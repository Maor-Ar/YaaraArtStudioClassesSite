import { Injectable } from '@angular/core';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
  addDoc,
  Timestamp,
  DocumentData,
} from 'firebase/firestore';
import { FirebaseService } from './firebase.service';

export interface AdultClassOccurrence {
  /** Virtual id: baseEventId_YYYY-MM-DD */
  occurrenceId: string;
  baseEventId: string;
  title: string;
  occurrenceDateKey: string;
  startTime: string;
  duration: number;
  timeLabel: string;
  displayLabel: string;
  availableSpots: number;
  maxRegistrations: number;
}

export interface ReserveTrialSpotInput {
  eventId: string;
  occurrenceDateKey: string;
  customerName: string;
}

const CONFIRMED = 'confirmed';
const TRIAL_NAME_SUFFIX = 'אוטומטי שיעור נסיון';

@Injectable({
  providedIn: 'root',
})
export class ArthubEventsService {
  constructor(private firebaseService: FirebaseService) {}

  async getAvailableAdultOccurrences(daysAhead = 14): Promise<AdultClassOccurrence[]> {
    const db = this.firebaseService.getFirestore();
    if (!db) {
      return [];
    }

    const eventsSnap = await getDocs(
      query(collection(db, 'events'), where('isActive', '==', true))
    );

    const adultEvents = eventsSnap.docs
      .map((d) => ({ id: d.id, ...d.data() } as DocumentData & { id: string }))
      .filter((event) => this.isAdultClass(event));

    if (adultEvents.length === 0) {
      return [];
    }

    const rangeStart = this.toUtcMidnight(new Date());
    const rangeEnd = new Date(rangeStart);
    rangeEnd.setUTCDate(rangeEnd.getUTCDate() + daysAhead);
    rangeEnd.setUTCHours(23, 59, 59, 999);

    const occurrences: Array<{
      baseEventId: string;
      occurrenceDate: Date;
      occurrenceDateKey: string;
      title: string;
      startTime: string;
      duration: number;
      maxRegistrations: number;
    }> = [];

    for (const event of adultEvents) {
      const expanded = this.expandOccurrences(event, rangeStart, rangeEnd);
      for (const occ of expanded) {
        if (this.hasOccurrenceEnded(occ.occurrenceDate, event['startTime'], event['duration'])) {
          continue;
        }
        occurrences.push({
          baseEventId: event.id,
          occurrenceDate: occ.occurrenceDate,
          occurrenceDateKey: occ.occurrenceDateKey,
          title: String(event['title'] || ''),
          startTime: String(event['startTime'] || ''),
          duration: Number(event['duration']) || 90,
          maxRegistrations: Number(event['maxRegistrations']) || 6,
        });
      }
    }

    if (occurrences.length === 0) {
      return [];
    }

    const eventIds = [...new Set(occurrences.map((o) => o.baseEventId))];
    const counts = await this.countConfirmedByEventAndDate(eventIds);
    const cancellations = await this.loadCancellations(eventIds, occurrences.map((o) => o.occurrenceDateKey));

    const available: AdultClassOccurrence[] = [];

    for (const occ of occurrences) {
      const cancelKey = `${occ.baseEventId}_${occ.occurrenceDateKey}`;
      if (cancellations.has(cancelKey)) {
        continue;
      }

      const countKey = `${occ.baseEventId}:${occ.occurrenceDateKey}`;
      const registeredCount = counts[countKey] || 0;
      const availableSpots = occ.maxRegistrations - registeredCount;
      if (availableSpots <= 0) {
        continue;
      }

      const timeLabel = this.formatTimeRange(occ.startTime, occ.duration);
      const hebrewDate = this.formatHebrewDate(occ.occurrenceDateKey);
      // Keep labels compact so native <select> does not stretch mobile layout
      const shortTitle = this.shortenTitle(occ.title);

      available.push({
        occurrenceId: `${occ.baseEventId}_${occ.occurrenceDateKey}`,
        baseEventId: occ.baseEventId,
        title: occ.title,
        occurrenceDateKey: occ.occurrenceDateKey,
        startTime: occ.startTime,
        duration: occ.duration,
        timeLabel,
        displayLabel: `${hebrewDate} ${timeLabel} · ${shortTitle}`,
        availableSpots,
        maxRegistrations: occ.maxRegistrations,
      });
    }

    available.sort((a, b) => {
      const dateCmp = a.occurrenceDateKey.localeCompare(b.occurrenceDateKey);
      if (dateCmp !== 0) return dateCmp;
      return a.startTime.localeCompare(b.startTime);
    });

    return available;
  }

  async reserveTrialSpot(input: ReserveTrialSpotInput): Promise<string> {
    const db = this.firebaseService.getFirestore();
    if (!db) {
      throw new Error('Firestore is not available in this environment');
    }

    const eventId = String(input.eventId || '').trim();
    const occurrenceDateKey = String(input.occurrenceDateKey || '').trim();
    const customerName = String(input.customerName || '').trim();

    if (!eventId || !/^\d{4}-\d{2}-\d{2}$/.test(occurrenceDateKey)) {
      throw new Error('Invalid event or occurrence date');
    }
    if (!customerName || !customerName.includes(TRIAL_NAME_SUFFIX)) {
      throw new Error('Customer name must include trial reservation suffix');
    }

    const eventSnap = await getDoc(doc(db, 'events', eventId));
    if (!eventSnap.exists() || eventSnap.data()?.['isActive'] !== true) {
      throw new Error('Event is not active');
    }

    const event = eventSnap.data()!;
    const occurrenceDate = new Date(`${occurrenceDateKey}T00:00:00.000Z`);
    if (this.hasOccurrenceEnded(occurrenceDate, event['startTime'], event['duration'])) {
      throw new Error('Cannot reserve a class that has already ended');
    }

    const cancelSnap = await getDoc(doc(db, 'event_cancellations', `${eventId}_${occurrenceDateKey}`));
    if (cancelSnap.exists() && cancelSnap.data()?.['isActive'] !== false) {
      throw new Error('This class occurrence is cancelled');
    }

    const counts = await this.countConfirmedByEventAndDate([eventId]);
    const registeredCount = counts[`${eventId}:${occurrenceDateKey}`] || 0;
    const maxRegistrations = Number(event['maxRegistrations']) || 6;
    if (registeredCount >= maxRegistrations) {
      throw new Error('Event is at full capacity');
    }

    const now = new Date();
    const docRef = await addDoc(collection(db, 'event_manual_registrations'), {
      customerName,
      eventId,
      occurrenceDate: Timestamp.fromDate(occurrenceDate),
      date: Timestamp.fromDate(occurrenceDate),
      status: CONFIRMED,
      source: 'trial_site',
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });

    return docRef.id;
  }

  buildTrialCustomerName(firstName: string, lastName: string): string {
    return `${(firstName || '').trim()} ${(lastName || '').trim()} ${TRIAL_NAME_SUFFIX}`.trim();
  }

  private isAdultClass(event: DocumentData): boolean {
    // Exclude known children's titles; do not filter by time of day.
    const title = String(event['title'] || '');
    if (title.includes('ילדים') || title.includes('נוער')) {
      return false;
    }

    return true;
  }

  private expandOccurrences(
    event: DocumentData & { id: string },
    startDate: Date,
    endDate: Date
  ): Array<{ occurrenceDate: Date; occurrenceDateKey: string }> {
    const results: Array<{ occurrenceDate: Date; occurrenceDateKey: string }> = [];

    if (event['isRecurring'] && event['recurringIntervalDays']) {
      const baseDateRaw = event['date']?.toDate ? event['date'].toDate() : new Date(event['date']);
      const baseDateUTC = this.toUtcMidnight(baseDateRaw);
      const intervalDays = Number(event['recurringIntervalDays']) || 7;
      const startDateUTC = this.toUtcMidnight(startDate);

      let currentDate = new Date(baseDateUTC);
      while (currentDate < startDateUTC) {
        currentDate = new Date(currentDate);
        currentDate.setUTCDate(currentDate.getUTCDate() + intervalDays);
        currentDate.setUTCHours(0, 0, 0, 0);
      }

      const endDateUTC = new Date(endDate);
      endDateUTC.setUTCHours(23, 59, 59, 999);

      while (currentDate <= endDateUTC) {
        const instanceDate = new Date(currentDate);
        instanceDate.setUTCHours(0, 0, 0, 0);
        results.push({
          occurrenceDate: instanceDate,
          occurrenceDateKey: instanceDate.toISOString().split('T')[0],
        });
        currentDate = new Date(currentDate);
        currentDate.setUTCDate(currentDate.getUTCDate() + intervalDays);
        currentDate.setUTCHours(0, 0, 0, 0);
      }

      return results;
    }

    const oneTimeRaw = event['date']?.toDate ? event['date'].toDate() : new Date(event['date']);
    const oneTime = this.toUtcMidnight(oneTimeRaw);
    if (oneTime >= this.toUtcMidnight(startDate) && oneTime <= endDate) {
      results.push({
        occurrenceDate: oneTime,
        occurrenceDateKey: oneTime.toISOString().split('T')[0],
      });
    }
    return results;
  }

  private async countConfirmedByEventAndDate(eventIds: string[]): Promise<Record<string, number>> {
    const db = this.firebaseService.getFirestore();
    if (!db || eventIds.length === 0) {
      return {};
    }

    const counts: Record<string, number> = {};
    const chunks = this.chunk(eventIds, 10);

    for (const chunkIds of chunks) {
      const [realSnap, manualSnap] = await Promise.all([
        getDocs(
          query(
            collection(db, 'event_registrations'),
            where('eventId', 'in', chunkIds),
            where('status', '==', CONFIRMED)
          )
        ),
        getDocs(
          query(
            collection(db, 'event_manual_registrations'),
            where('eventId', 'in', chunkIds),
            where('status', '==', CONFIRMED)
          )
        ),
      ]);

      const addCount = (data: DocumentData) => {
        const dateField = data['occurrenceDate'] || data['date'];
        if (!dateField) return;
        const regDate = dateField?.toDate ? dateField.toDate() : new Date(dateField);
        const dateKey = this.toUtcMidnight(regDate).toISOString().split('T')[0];
        const key = `${data['eventId']}:${dateKey}`;
        counts[key] = (counts[key] || 0) + 1;
      };

      realSnap.docs.forEach((d) => addCount(d.data()));
      manualSnap.docs.forEach((d) => addCount(d.data()));
    }

    return counts;
  }

  private async loadCancellations(
    eventIds: string[],
    dateKeys: string[]
  ): Promise<Set<string>> {
    const db = this.firebaseService.getFirestore();
    const cancelled = new Set<string>();
    if (!db) {
      return cancelled;
    }

    const uniqueDateKeys = [...new Set(dateKeys)];
    const docIds = eventIds.flatMap((eventId) =>
      uniqueDateKeys.map((dateKey) => `${eventId}_${dateKey}`)
    );

    await Promise.all(
      docIds.map(async (docId) => {
        const snap = await getDoc(doc(db, 'event_cancellations', docId));
        if (snap.exists() && snap.data()?.['isActive'] !== false) {
          cancelled.add(docId);
        }
      })
    );

    return cancelled;
  }

  private hasOccurrenceEnded(
    occurrenceDate: Date,
    startTime: unknown,
    durationMinutes: unknown
  ): boolean {
    const [hours = 0, minutes = 0] = String(startTime || '00:00')
      .split(':')
      .map((part) => parseInt(part, 10));
    const safeDuration = Number.isFinite(Number(durationMinutes)) ? Number(durationMinutes) : 0;

    const endDateTime = new Date(occurrenceDate);
    // Match ArtHub: set local hours on the occurrence date object
    endDateTime.setHours(hours, minutes, 0, 0);
    endDateTime.setMinutes(endDateTime.getMinutes() + safeDuration);
    return endDateTime.getTime() < Date.now();
  }

  private formatTimeRange(startTime: string, durationMinutes: number): string {
    const [h = 0, m = 0] = startTime.split(':').map((p) => parseInt(p, 10));
    const startMinutes = h * 60 + m;
    const endMinutes = startMinutes + (durationMinutes || 90);
    const endH = Math.floor(endMinutes / 60) % 24;
    const endM = endMinutes % 60;
    const pad = (n: number) => String(n).padStart(2, '0');
    return `${pad(h)}:${pad(m)}-${pad(endH)}:${pad(endM)}`;
  }

  private formatHebrewDate(dateKey: string): string {
    const [year, month, day] = dateKey.split('-').map((p) => parseInt(p, 10));
    const localDate = new Date(year, month - 1, day);
    return localDate.toLocaleDateString('he-IL', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  }

  private shortenTitle(title: string): string {
    const clean = String(title || '').trim();
    if (clean.length <= 28) {
      return clean;
    }
    // Prefer text before dash/hyphen for compact select labels
    const beforeDash = clean.split(/\s*[-–—]\s*/)[0]?.trim();
    if (beforeDash && beforeDash.length >= 4 && beforeDash.length <= 28) {
      return beforeDash;
    }
    return `${clean.slice(0, 26)}…`;
  }

  private toUtcMidnight(date: Date): Date {
    const d = new Date(date);
    d.setUTCHours(0, 0, 0, 0);
    return d;
  }

  private chunk<T>(items: T[], size: number): T[][] {
    const result: T[][] = [];
    for (let i = 0; i < items.length; i += size) {
      result.push(items.slice(i, i + size));
    }
    return result;
  }
}
