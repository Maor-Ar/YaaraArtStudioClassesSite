import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  private readonly hypPaymentLink =
    'https://stage.hyp.co.il/sp/?key=cfd7757d-b482-4d5c-b840-2398bce254ec&id=13443';
  
  // Form data from localStorage
  fullName: string = '';
  phone: string = '';
  lessonDate: string = '';
  hasFormData: boolean = false;

  // Payment state
  isRedirecting: boolean = false;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      this.loadFormData();
    }
  }

  /**
   * Load form data from localStorage
   */
  private loadFormData(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    this.fullName = localStorage.getItem('formFullName') || '';
    this.phone = localStorage.getItem('formPhone') || '';
    this.lessonDate = localStorage.getItem('formLessonDate') || '';
    
    this.hasFormData = !!(this.fullName && this.lessonDate);
    
    if (!this.hasFormData) {
      // If no form data, redirect back to main page
      console.warn('No form data found, redirecting to main page');
      // You could optionally show an error message here
    }
  }

  /**
   * Redirect to Hyp payment page
   */
  proceedToPayment(): void {
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }

    if (!this.hasFormData) {
      console.error('Cannot proceed to payment: missing form data');
      return;
    }

    // Save payment timestamp
    const nowIso = new Date().toISOString();
    localStorage.setItem('paymentCustomerName', this.fullName);
    localStorage.setItem('paymentDateTime', nowIso);

    this.isRedirecting = true;
    window.location.href = this.hypPaymentLink;
  }
}
