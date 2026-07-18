import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { ArthubEventsService } from '../../services/arthub-events.service';

declare global {
  interface Window {
    fbq?: (...args: any[]) => void;
  }
}

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, DatePipe],
  templateUrl: './payment-success.component.html',
  styleUrl: './payment-success.component.scss'
})
export class PaymentSuccessComponent implements OnInit {
  // Payment data
  customerName: string | null = null;
  paymentDateTime: string | null = null;
  formattedDate: string = '';
  formattedTime: string = '';
  
  // Form data (reserved class information)
  firstName: string | null = null;
  lastName: string | null = null;
  phone: string | null = null;
  lessonDate: string | null = null;
  background: string | null = null;
  classTitle: string | null = null;
  fullName: string = '';

  spotReserved = false;
  spotReserveError: string | null = null;
  isReservingSpot = false;

  showCalendarModal = false;
  showAppleCalendar = false;

  constructor(
    private router: Router,
    private arthubEvents: ArthubEventsService,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      this.loadPaymentData();
      this.loadFormData();
      this.showAppleCalendar = this.detectAppleDevice();
      void this.reserveAdultSpotIfNeeded();
      
      // Check if Meta Pixel is loaded before tracking
      console.log('🟢 [Meta Pixel] Payment success component initialized');
      console.log('🟢 [Meta Pixel] Checking fbq availability on init...');
      if (typeof window !== 'undefined' && window.fbq) {
        console.log('✅ [Meta Pixel] fbq is available, proceeding with tracking');
      } else {
        console.warn('⚠️ [Meta Pixel] fbq is NOT available on init, will retry');
      }
      
      this.trackMetaPixelPurchase();
    }
  }

  private detectAppleDevice(): boolean {
    if (typeof navigator === 'undefined') {
      return false;
    }
    const ua = navigator.userAgent || '';
    const platform = (navigator as Navigator & { userAgentData?: { platform?: string } }).userAgentData
      ?.platform || navigator.platform || '';
    const appleUa = /iPhone|iPad|iPod|Macintosh|Mac OS X/i.test(ua) || /Mac|iPhone|iPad|iPod/i.test(platform);
    // Exclude Windows with "like Mac" edge cases; include iPadOS desktop UA
    const isTouchMac = platform === 'MacIntel' && (navigator.maxTouchPoints || 0) > 1;
    return appleUa || isTouchMac;
  }

  /**
   * Load payment data from localStorage
   */
  private loadPaymentData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.customerName = localStorage.getItem('paymentCustomerName');
    this.paymentDateTime = localStorage.getItem('paymentDateTime');

    if (this.paymentDateTime) {
      const date = new Date(this.paymentDateTime);
      this.formattedDate = date.toLocaleDateString('he-IL', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      this.formattedTime = date.toLocaleTimeString('he-IL', {
        hour: '2-digit',
        minute: '2-digit'
      });
    }
  }

  /**
   * Load form data (reserved class information) from localStorage
   */
  private loadFormData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.firstName = localStorage.getItem('formFirstName');
    this.lastName = localStorage.getItem('formLastName');
    this.phone = localStorage.getItem('formPhone');
    this.lessonDate = localStorage.getItem('formLessonDate');
    this.background = localStorage.getItem('formBackground');
    this.classTitle = localStorage.getItem('formClassTitle');
    
    // Build full name
    if (this.firstName || this.lastName) {
      this.fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
    } else {
      this.fullName = this.customerName || '';
    }
  }

  /**
   * Adults only: reserve a manual spot after successful payment (once per submission).
   */
  private async reserveAdultSpotIfNeeded(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    const classFor = localStorage.getItem('formClassFor') || '';
    if (classFor === 'בשביל הילד שלי') {
      return;
    }

    const eventId = localStorage.getItem('formEventId');
    const occurrenceDateKey = localStorage.getItem('formOccurrenceDate');
    if (!eventId || !occurrenceDateKey) {
      return;
    }

    if (localStorage.getItem('formSpotReserved') === 'true') {
      this.spotReserved = true;
      return;
    }

    this.isReservingSpot = true;
    this.spotReserveError = null;

    try {
      const customerName = this.arthubEvents.buildTrialCustomerName(
        this.firstName || '',
        this.lastName || ''
      );
      const reservationId = await this.arthubEvents.reserveTrialSpot({
        eventId,
        occurrenceDateKey,
        customerName,
      });

      localStorage.setItem('formSpotReserved', 'true');
      localStorage.setItem('formSpotReservationId', reservationId);
      this.spotReserved = true;
      console.log('✅ [Reserve] Trial spot reserved:', reservationId);
    } catch (error) {
      console.error('❌ [Reserve] Failed to reserve trial spot:', error);
      this.spotReserveError =
        'התשלום התקבל, אך שריון המקום נכשל. ניצור קשר לתיאום השיעור.';
    } finally {
      this.isReservingSpot = false;
    }
  }

  openCalendarModal(): void {
    if (!this.lessonDate) {
      return;
    }
    this.showCalendarModal = true;
  }

  closeCalendarModal(): void {
    this.showCalendarModal = false;
  }

  onCalendarOverlayClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.closeCalendarModal();
    }
  }

  addToGoogleCalendar(): void {
    const event = this.buildCalendarEvent();
    if (!event) {
      return;
    }
    const startStr = this.toUtcCompact(event.start);
    const endStr = this.toUtcCompact(event.end);
    const url =
      `https://www.google.com/calendar/render?action=TEMPLATE` +
      `&text=${encodeURIComponent(event.title)}` +
      `&dates=${startStr}/${endStr}` +
      `&details=${encodeURIComponent(event.description)}` +
      `&location=${encodeURIComponent(event.location)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    this.closeCalendarModal();
  }

  addToOutlookCalendar(): void {
    const event = this.buildCalendarEvent();
    if (!event) {
      return;
    }
    const url =
      `https://outlook.live.com/calendar/0/deeplink/compose?path=/calendar/action/compose&rru=addevent` +
      `&subject=${encodeURIComponent(event.title)}` +
      `&startdt=${encodeURIComponent(event.start.toISOString())}` +
      `&enddt=${encodeURIComponent(event.end.toISOString())}` +
      `&body=${encodeURIComponent(event.description)}` +
      `&location=${encodeURIComponent(event.location)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
    this.closeCalendarModal();
  }

  /**
   * Apple has no public web "create event" URL.
   * On Apple devices, opening a text/calendar blob launches Calendar's add-event UI
   * (not a file-download flow).
   */
  addToAppleCalendar(): void {
    const event = this.buildCalendarEvent();
    if (!event || !isPlatformBrowser(this.platformId)) {
      return;
    }
    const ics = this.buildIcsContent(event);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    // Navigate in-place so iOS/macOS Calendar opens the event sheet
    window.location.href = url;
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    this.closeCalendarModal();
  }

  downloadIcsFile(): void {
    const event = this.buildCalendarEvent();
    if (!event || !isPlatformBrowser(this.platformId)) {
      return;
    }
    const ics = this.buildIcsContent(event);
    const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'studio-buda-trial.ics';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.setTimeout(() => URL.revokeObjectURL(url), 2000);
    this.closeCalendarModal();
  }

  private buildCalendarEvent(): {
    title: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
  } | null {
    if (!isPlatformBrowser(this.platformId) || !this.lessonDate) {
      return null;
    }

    // Parse lesson date (format: "DD/MM/YYYY HH:MM-HH:MM")
    const lessonParts = this.lessonDate.split(' ');
    if (lessonParts.length !== 2) {
      console.error('Invalid lesson date format');
      return null;
    }

    const datePart = lessonParts[0];
    const timePart = lessonParts[1];
    const [day, month, year] = datePart.split('/');
    const [startTime, endTime] = timePart.split('-');
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');

    const start = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(startHour, 10),
      parseInt(startMinute, 10)
    );
    const end = new Date(
      parseInt(year, 10),
      parseInt(month, 10) - 1,
      parseInt(day, 10),
      parseInt(endHour, 10),
      parseInt(endMinute, 10)
    );

    const name = this.fullName || 'שיעור ניסיון';
    const title = `שיעור ניסיון - סטודיו בודה: ${name}`;
    const location = 'תל חי 39 כפר סבא, קומה 1';
    let description = 'שיעור ניסיון בסטודיו בודה';
    if (this.classTitle) {
      description += `\nשיעור: ${this.classTitle}`;
    }
    if (this.background) {
      description += `\nרקע: ${this.background}`;
    }

    return { title, description, location, start, end };
  }

  private toUtcCompact(date: Date): string {
    return date.toISOString().replace(/-|:|\.\d{3}/g, '');
  }

  private buildIcsContent(event: {
    title: string;
    description: string;
    location: string;
    start: Date;
    end: Date;
  }): string {
    const escape = (value: string) =>
      value
        .replace(/\\/g, '\\\\')
        .replace(/;/g, '\\;')
        .replace(/,/g, '\\,')
        .replace(/\n/g, '\\n');

    const stamp = this.toUtcCompact(new Date());
    const uid = `${stamp}-${Math.random().toString(36).slice(2)}@studiobuda.co.il`;

    return [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//Studio Buda//Trial Lesson//HE',
      'CALSCALE:GREGORIAN',
      'METHOD:PUBLISH',
      'BEGIN:VEVENT',
      `UID:${uid}`,
      `DTSTAMP:${stamp}`,
      `DTSTART:${this.toUtcCompact(event.start)}`,
      `DTEND:${this.toUtcCompact(event.end)}`,
      `SUMMARY:${escape(event.title)}`,
      `DESCRIPTION:${escape(event.description)}`,
      `LOCATION:${escape(event.location)}`,
      'END:VEVENT',
      'END:VCALENDAR',
    ].join('\r\n');
  }

  /**
   * Navigate back to main page
   */
  navigateToHome(): void {
    this.router.navigate(['/']);
  }

  /**
   * Navigate to payment page
   */
  navigateToPayment(): void {
    this.router.navigate(['/payments']);
  }

  /**
   * Track Meta Pixel Purchase event using Renderer2
   */
  private trackMetaPixelPurchase(): void {
    console.log('🟢 [Meta Pixel] trackMetaPixelPurchase called');
    
    if (!isPlatformBrowser(this.platformId)) {
      console.warn('🟢 [Meta Pixel] Not in browser platform, skipping');
      return;
    }

    console.log('🟢 [Meta Pixel] Checking if fbq is available...');
    console.log('🟢 [Meta Pixel] typeof window:', typeof window);
    console.log('🟢 [Meta Pixel] window.fbq exists:', typeof window !== 'undefined' && !!window.fbq);
    console.log('🟢 [Meta Pixel] window.fbq type:', typeof window !== 'undefined' && window.fbq ? typeof window.fbq : 'N/A');

    // Check if fbq is available on window object
    if (typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function') {
      // Value is 50 ILS for trial lesson
      const value = 50;
      const purchaseData = {
        value: value,
        currency: 'ILS',
        content_type: 'product'
      };
      
      console.log('🟢 [Meta Pixel] Calling fbq("track", "Purchase", ...) with data:', purchaseData);
      
      // Use Renderer2 to safely invoke the fbq function
      try {
        // Call fbq directly - it's safe to call since we've checked it exists
        window.fbq('track', 'Purchase', purchaseData);
        console.log('✅ [Meta Pixel] Purchase event tracked successfully!');
      } catch (error) {
        console.error('❌ [Meta Pixel] Error tracking Meta Pixel Purchase event:', error);
      }
    } else {
      console.warn('⚠️ [Meta Pixel] fbq is not available or not a function');
      console.warn('⚠️ [Meta Pixel] This might mean Meta Pixel script has not loaded yet');
      
      // Try to wait a bit and retry (in case script is still loading)
      setTimeout(() => {
        if (typeof window !== 'undefined' && window.fbq && typeof window.fbq === 'function') {
          const value = 50;
          const purchaseData = {
            value: value,
            currency: 'ILS',
            content_type: 'product'
          };
          console.log('🟢 [Meta Pixel] Retry: Calling fbq("track", "Purchase", ...) with data:', purchaseData);
          try {
            window.fbq('track', 'Purchase', purchaseData);
            console.log('✅ [Meta Pixel] Purchase event tracked successfully on retry!');
          } catch (error) {
            console.error('❌ [Meta Pixel] Error on retry:', error);
          }
        } else {
          console.error('❌ [Meta Pixel] fbq still not available after retry');
        }
      }, 1000);
    }
  }
}

