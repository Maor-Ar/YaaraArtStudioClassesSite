import { Component, Output, EventEmitter, OnInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { StripeService, PaymentResult } from '../../services/stripe.service';

@Component({
  selector: 'app-payment',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent implements OnInit {
  @Output() paymentSuccess = new EventEmitter<void>();
  @ViewChild('applePayButton', { static: false }) applePayButton!: ElementRef;
  @ViewChild('cardElement', { static: false }) cardElement!: ElementRef;
  
  showSuccessMessage = false;
  showCreditCardForm = false;
  isApplePayAvailable = false;
  isLoading = false;
  paymentError = '';
  
  // Credit card form data
  cardholderName = '';
  email = '';
  phone = '';

  constructor(
    private router: Router,
    private stripeService: StripeService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  async ngOnInit(): Promise<void> {
    if (isPlatformBrowser(this.platformId)) {
      window.scrollTo(0, 0);
      await this.checkApplePayAvailability();
    }
  }
  // Phone number from contact section
  private readonly phoneNumber = '0556646033'; // Remove dashes for deep links
  private readonly phoneNumberFormatted = '055-664-6033';
  
  // Default lesson price
  private readonly lessonPrice = 50;

  /**
   * Initiate Bit payment
   * Bit app deep link format: bit://pay?phone=PHONE&amount=AMOUNT&description=DESCRIPTION
   */
  initiateBitPayment(): void {
    const amount = this.lessonPrice;
    const description = encodeURIComponent('שיעור ניסיון - סטודיו יערה');
    
    // Bit deep link URL
    const bitUrl = `bit://pay?phone=${this.phoneNumber}&amount=${amount}&description=${description}`;
    
    // Fallback to web version if app not installed
    const bitWebUrl = `https://bit.co.il/pay?phone=${this.phoneNumber}&amount=${amount}&description=${description}`;
    
    this.openPaymentApp(bitUrl, bitWebUrl, 'Bit');
  }

  /**
   * Initiate PayBox payment
   * PayBox deep link format: paybox://pay?phone=PHONE&amount=AMOUNT&description=DESCRIPTION
   */
  initiatePayBoxPayment(): void {
    const amount = this.lessonPrice;
    const description = encodeURIComponent('שיעור ניסיון - סטודיו יערה');
    
    // PayBox deep link URL
    const payboxUrl = `paybox://pay?phone=${this.phoneNumber}&amount=${amount}&description=${description}`;
    
    // Fallback to web version if app not installed
    const payboxWebUrl = `https://paybox.co.il/pay?phone=${this.phoneNumber}&amount=${amount}&description=${description}`;
    
    this.openPaymentApp(payboxUrl, payboxWebUrl, 'PayBox');
  }

  /**
   * Open payment app with fallback to web version
   */
  private openPaymentApp(appUrl: string, webUrl: string, appName: string): void {
    // Only execute in browser environment
    if (!isPlatformBrowser(this.platformId)) {
      return;
    }
    
    // Try to open the mobile app
    const appWindow = window.open(appUrl, '_blank');
    
    // Check if app opened successfully (timeout approach)
    setTimeout(() => {
      if (appWindow && appWindow.closed) {
        // App likely opened, close the fallback window
        return;
      }
      
      // If app didn't open, try web version
      if (appWindow) {
        appWindow.location.href = webUrl;
      } else {
        // Fallback to web version
        window.open(webUrl, '_blank');
      }
    }, 1000);
  }

  /**
   * Initiate Kashkash payment
   * Kashkash deep link format: kashkash://pay?phone=PHONE&amount=AMOUNT&description=DESCRIPTION
   */
  initiateKashkashPayment(): void {
    const amount = this.lessonPrice;
    const description = encodeURIComponent('שיעור ניסיון - סטודיו יערה');
    
    // Kashkash deep link URL
    const kashkashUrl = `kashkash://pay?phone=${this.phoneNumber}&amount=${amount}&description=${description}`;
    
    // Fallback to web version if app not installed
    const kashkashWebUrl = `https://kashkash.co.il/pay?phone=${this.phoneNumber}&amount=${amount}&description=${description}`;
    
    this.openPaymentApp(kashkashUrl, kashkashWebUrl, 'Kashkash');
  }

  /**
   * Copy phone number to clipboard
   */
  copyPhoneNumber(): void {
    navigator.clipboard.writeText(this.phoneNumberFormatted).then(() => {
      // You could add a toast notification here
      console.log('Phone number copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy phone number:', err);
    });
  }

  /**
   * Handle successful payment
   */
  onPaymentSuccess(): void {
    console.log('Payment completed successfully');
    
    // Show success popup first
    this.showSuccessMessage = true;
    
    // Navigate back to main page after 5 seconds
    setTimeout(() => {
      this.showSuccessMessage = false;
      this.router.navigate(['/'], { fragment: 'contact' });
    }, 5000);
  }

  /**
   * Navigate back to form after payment
   */
  navigateBackToForm(): void {
    this.router.navigate(['/'], { fragment: 'contact' });
  }

  /**
   * Check if Apple Pay is available
   */
  private async checkApplePayAvailability(): Promise<void> {
    try {
      this.isApplePayAvailable = await this.stripeService.isApplePayAvailable();
    } catch (error) {
      console.error('Error checking Apple Pay availability:', error);
      this.isApplePayAvailable = false;
    }
  }

  /**
   * Show credit card payment form
   */
  showCreditCardPayment(): void {
    this.showCreditCardForm = true;
    this.paymentError = '';
    
    // Initialize Stripe elements after view is updated
    setTimeout(() => {
      this.initializeCreditCardForm();
    }, 100);
  }

  /**
   * Initialize credit card form with Stripe Elements
   */
  private initializeCreditCardForm(): void {
    const elements = this.stripeService.createElements();
    if (!elements) return;

    const cardElement = elements.create('card', {
      style: {
        base: {
          fontSize: '16px',
          color: '#424770',
          fontFamily: 'system-ui, sans-serif',
          '::placeholder': {
            color: '#aab7c4',
          },
        },
      },
    });

    cardElement.mount(this.cardElement.nativeElement);
  }

  /**
   * Process credit card payment
   */
  async processCreditCardPayment(): Promise<void> {
    if (!this.cardholderName || !this.email) {
      this.paymentError = 'אנא מלא את כל השדות הנדרשים';
      return;
    }

    this.isLoading = true;
    this.paymentError = '';

    try {
      // Create payment intent (in real app, this would call your backend)
      const paymentIntent = await this.stripeService.createPaymentIntent(this.lessonPrice * 100); // Convert to agorot
      
      // Get the card element
      const elements = this.stripeService.getElements();
      if (!elements) throw new Error('Stripe elements not initialized');

      const cardElement = elements.getElement('card');
      if (!cardElement) throw new Error('Card element not found');

      // Confirm payment
      const result: PaymentResult = await this.stripeService.confirmCardPayment(
        paymentIntent.client_secret,
        cardElement,
        {
          name: this.cardholderName,
          email: this.email,
          phone: this.phone || this.phoneNumberFormatted,
        }
      );

      if (result.success) {
        this.onPaymentSuccess();
      } else {
        this.paymentError = result.error || 'שגיאה בעיבוד התשלום';
      }
    } catch (error) {
      console.error('Credit card payment error:', error);
      this.paymentError = 'שגיאה בעיבוד התשלום';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Process Apple Pay payment
   */
  async processApplePayPayment(): Promise<void> {
    this.isLoading = true;
    this.paymentError = '';

    try {
      // Mount Apple Pay button
      if (this.applePayButton) {
        await this.stripeService.mountApplePayButton(this.applePayButton.nativeElement);
      }
    } catch (error) {
      console.error('Apple Pay payment error:', error);
      this.paymentError = 'שגיאה בעיבוד תשלום Apple Pay';
    } finally {
      this.isLoading = false;
    }
  }

  /**
   * Hide credit card form
   */
  hideCreditCardForm(): void {
    this.showCreditCardForm = false;
    this.paymentError = '';
    this.cardholderName = '';
    this.email = '';
    this.phone = '';
  }

  /**
   * Get payment method display info
   */
  getPaymentMethodInfo(method: string): { name: string; description: string; recommended?: boolean } {
    const methods = {
      bit: { name: 'Bit', description: 'תשלום מאובטח עם Bit', recommended: true },
      paybox: { name: 'PayBox', description: 'תשלום מאובטח עם PayBox', recommended: true },
      kashkash: { name: 'Kashkash', description: 'תשלום מאובטח עם Kashkash', recommended: true },
      applePay: { name: 'Apple Pay', description: 'תשלום מאובטח עם Apple Pay' },
      creditCard: { name: 'כרטיס אשראי', description: 'כרטיסי אשראי בינלאומיים' }
    };
    
    return methods[method as keyof typeof methods] || { name: method, description: '' };
  }
}