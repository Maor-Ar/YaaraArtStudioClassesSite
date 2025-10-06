import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrl: './payment.component.scss'
})
export class PaymentComponent {
  @Input() showPaymentButtons: boolean = false;
  @Output() paymentSuccess = new EventEmitter<void>();

  constructor(private router: Router) {}
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
   * Open WhatsApp for manual payment coordination
   */
  openWhatsAppPayment(): void {
    const message = encodeURIComponent(`שלום! אני מעוניין/ת לשלם עבור שיעור ניסיון ב-${this.lessonPrice}₪. איך אפשר לבצע את התשלום?`);
    const whatsappUrl = `https://wa.me/972${this.phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
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
    this.paymentSuccess.emit();
  }

  /**
   * Navigate back to form after payment
   */
  navigateBackToForm(): void {
    this.router.navigate(['/'], { fragment: 'contact' });
  }
}