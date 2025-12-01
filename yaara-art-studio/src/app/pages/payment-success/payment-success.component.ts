import { Component, OnInit, Inject, PLATFORM_ID, Renderer2 } from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

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
  fullName: string = '';

  constructor(
    private router: Router,
    @Inject(PLATFORM_ID) private platformId: Object,
    private renderer: Renderer2
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      this.loadPaymentData();
      this.loadFormData();
      
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
    
    // Build full name
    if (this.firstName || this.lastName) {
      this.fullName = `${this.firstName || ''} ${this.lastName || ''}`.trim();
    } else {
      this.fullName = this.customerName || '';
    }
  }

  /**
   * Add reserved class event to Google Calendar
   */
  addToCalendar(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.lessonDate) {
      console.error('Lesson date not found');
      return;
    }

    const name = this.fullName || 'שיעור ניסיון';
    const studioAddress = 'תל חי 39 כפר סבא, קומה 1';
    
    // Parse lesson date (format: "DD/MM/YYYY HH:MM-HH:MM")
    // Example: "07/12/2025 18:00-19:30"
    const lessonParts = this.lessonDate.split(' ');
    if (lessonParts.length !== 2) {
      console.error('Invalid lesson date format');
      return;
    }
    
    const datePart = lessonParts[0]; // "07/12/2025"
    const timePart = lessonParts[1]; // "18:00-19:30"
    
    const [day, month, year] = datePart.split('/');
    const [startTime, endTime] = timePart.split('-');
    const [startHour, startMinute] = startTime.split(':');
    const [endHour, endMinute] = endTime.split(':');
    
    // Create date objects in local time
    const startDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(startHour), parseInt(startMinute));
    const endDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day), parseInt(endHour), parseInt(endMinute));
    
    const summary = encodeURIComponent(`שיעור ניסיון - סטודיו בודה: ${name}`);
    const location = encodeURIComponent(studioAddress);
    let description = encodeURIComponent(`שיעור ניסיון בסטודיו בודה`);
    if (this.background) {
      description = encodeURIComponent(`שיעור ניסיון בסטודיו בודה\nרקע: ${this.background}`);
    }
    
    // Format dates for Google Calendar (YYYYMMDDTHHMMSS)
    const startStr = startDate.toISOString().replace(/-|:|\.\d{3}/g, '');
    const endStr = endDate.toISOString().replace(/-|:|\.\d{3}/g, '');
    
    const url = `https://www.google.com/calendar/render?action=TEMPLATE&text=${summary}&dates=${startStr}/${endStr}&details=${description}&location=${location}`;
    
    window.open(url, '_blank');
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

