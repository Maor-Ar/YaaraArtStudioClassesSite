import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      this.loadPaymentData();
      this.loadFormData();
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
}

