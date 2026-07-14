/**
 * Smoke test: read active adult events and print next-14-day open occurrences.
 * Uses Firebase Admin if GOOGLE_APPLICATION_CREDENTIALS / FIREBASE_* are set,
 * otherwise uses the public Firebase web SDK (same as the site).
 *
 * Usage: node scripts/smoke-firebase-adult-classes.mjs
 */
import { initializeApp } from 'firebase/app';
import {
  getFirestore,
  collection,
  getDocs,
  query,
  where,
  doc,
  getDoc,
  addDoc,
  setDoc,
  increment,
  Timestamp,
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyBU19U0qOzDs498W7C11-qA4NuUSQ0tuGw',
  authDomain: 'studiobuda-arthub.firebaseapp.com',
  projectId: 'studiobuda-arthub',
  storageBucket: 'studiobuda-arthub.firebasestorage.app',
  messagingSenderId: '102013040020',
  appId: '1:102013040020:web:a773d91232908f2bb44b81',
};

const CONFIRMED = 'confirmed';
const DO_WRITE = process.argv.includes('--write');

function toUtcMidnight(date) {
  const d = new Date(date);
  d.setUTCHours(0, 0, 0, 0);
  return d;
}

function expandOccurrences(event, startDate, endDate) {
  const results = [];
  if (event.isRecurring && event.recurringIntervalDays) {
    const baseDateRaw = event.date?.toDate ? event.date.toDate() : new Date(event.date);
    const baseDateUTC = toUtcMidnight(baseDateRaw);
    const intervalDays = Number(event.recurringIntervalDays) || 7;
    const startDateUTC = toUtcMidnight(startDate);
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
  return results;
}

async function main() {
  console.log('🔥 Initializing Firebase web SDK for', firebaseConfig.projectId);
  const app = initializeApp(firebaseConfig);
  const db = getFirestore(app);

  console.log('📖 Reading active events...');
  const eventsSnap = await getDocs(query(collection(db, 'events'), where('isActive', '==', true)));
  console.log(`   Found ${eventsSnap.size} active events`);

  const adultEvents = eventsSnap.docs
    .map((d) => ({ id: d.id, ...d.data() }))
    .filter((e) => !String(e.title || '').includes('ילדים') && !String(e.title || '').includes('נוער'));

  console.log(`   Adult classes (any time of day): ${adultEvents.length}`);
  adultEvents.forEach((e) => {
    console.log(`   - ${e.title} @ ${e.startTime} (id=${e.id}, recurring=${e.isRecurring})`);
  });

  const rangeStart = toUtcMidnight(new Date());
  const rangeEnd = new Date(rangeStart);
  rangeEnd.setUTCDate(rangeEnd.getUTCDate() + 14);
  rangeEnd.setUTCHours(23, 59, 59, 999);

  const occurrences = [];
  for (const event of adultEvents) {
    for (const occ of expandOccurrences(event, rangeStart, rangeEnd)) {
      occurrences.push({
        baseEventId: event.id,
        title: event.title,
        startTime: event.startTime,
        maxRegistrations: Number(event.maxRegistrations) || 6,
        ...occ,
      });
    }
  }
  console.log(`📅 Expanded occurrences in next 14 days: ${occurrences.length}`);

  const eventIds = [...new Set(occurrences.map((o) => o.baseEventId))];
  const counts = {};
  for (let i = 0; i < eventIds.length; i += 10) {
    const chunk = eventIds.slice(i, i + 10);
    const [realSnap, manualSnap] = await Promise.all([
      getDocs(query(collection(db, 'event_registrations'), where('eventId', 'in', chunk), where('status', '==', CONFIRMED))),
      getDocs(query(collection(db, 'event_manual_registrations'), where('eventId', 'in', chunk), where('status', '==', CONFIRMED))),
    ]);
    const add = (data) => {
      const dateField = data.occurrenceDate || data.date;
      if (!dateField) return;
      const regDate = dateField?.toDate ? dateField.toDate() : new Date(dateField);
      const dateKey = toUtcMidnight(regDate).toISOString().split('T')[0];
      const key = `${data.eventId}:${dateKey}`;
      counts[key] = (counts[key] || 0) + 1;
    };
    realSnap.docs.forEach((d) => add(d.data()));
    manualSnap.docs.forEach((d) => add(d.data()));
  }

  const open = [];
  for (const occ of occurrences) {
    const cancelId = `${occ.baseEventId}_${occ.occurrenceDateKey}`;
    const cancelSnap = await getDoc(doc(db, 'event_cancellations', cancelId));
    if (cancelSnap.exists() && cancelSnap.data()?.isActive !== false) continue;
    const registered = counts[`${occ.baseEventId}:${occ.occurrenceDateKey}`] || 0;
    const spots = occ.maxRegistrations - registered;
    if (spots > 0) {
      open.push({ ...occ, availableSpots: spots });
    }
  }

  console.log(`✅ Open adult occurrences: ${open.length}`);
  open.slice(0, 12).forEach((o) => {
    console.log(`   ${o.occurrenceDateKey} ${o.startTime} ${o.title} (${o.availableSpots} spots) [${o.baseEventId}]`);
  });

  if (DO_WRITE && open.length > 0) {
    const target = open[0];
    console.log('✍️  Writing smoke reservation...');
    const now = new Date();
    const occurrenceDate = new Date(`${target.occurrenceDateKey}T00:00:00.000Z`);
    const ref = await addDoc(collection(db, 'event_manual_registrations'), {
      customerName: 'Smoke Test אוטומטי שיעור נסיון',
      eventId: target.baseEventId,
      occurrenceDate: Timestamp.fromDate(occurrenceDate),
      date: Timestamp.fromDate(occurrenceDate),
      dateKey: target.occurrenceDateKey,
      status: CONFIRMED,
      source: 'trial_site',
      createdAt: Timestamp.fromDate(now),
      updatedAt: Timestamp.fromDate(now),
    });
    const countRef = doc(db, 'occurrence_counts', `${target.baseEventId}_${target.occurrenceDateKey}`);
    const countSnap = await getDoc(countRef);
    if (countSnap.exists()) {
      await setDoc(
        countRef,
        {
          eventId: target.baseEventId,
          dateKey: target.occurrenceDateKey,
          count: increment(1),
          updatedAt: Timestamp.fromDate(now),
        },
        { merge: true }
      );
    } else {
      await setDoc(countRef, {
        eventId: target.baseEventId,
        dateKey: target.occurrenceDateKey,
        count: 1,
        updatedAt: Timestamp.fromDate(now),
      });
    }
    console.log(`   ✅ Created manual reservation ${ref.id} and bumped occurrence_counts`);
    console.log('   (Client delete is denied by design; clean up with Admin SDK if needed)');
  } else if (DO_WRITE) {
    console.log('⚠️  No open occurrences to write against.');
  }

  console.log('🏁 Smoke test finished');
}

main().catch((err) => {
  console.error('❌ Smoke test failed:', err);
  process.exit(1);
});
