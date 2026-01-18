import { Component, AfterViewInit, ViewChild, ElementRef, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { HeaderComponent } from '../../components/header/header.component';
import { FooterComponent } from '../../components/footer/footer.component';
import { PaymentComponent } from '../../components/payment/payment.component';

@Component({
  selector: 'app-payment-page',
  standalone: true,
  imports: [CommonModule, HeaderComponent, FooterComponent, PaymentComponent],
  templateUrl: './payment-page.component.html',
  styleUrl: './payment-page.component.scss'
})
export class PaymentPageComponent implements AfterViewInit {
  @ViewChild('paymentMain', { static: false }) paymentMain!: ElementRef<HTMLElement>;

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngAfterViewInit(): void {
    // Scroll to top of payment content after view is initialized
    if (isPlatformBrowser(this.platformId)) {
      // Use setTimeout to ensure the view is fully rendered
      setTimeout(() => {
        // Try to scroll to the payment main element, otherwise scroll to top
        if (this.paymentMain?.nativeElement) {
          this.paymentMain.nativeElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
          console.log('🔵 [Payment Page] Scrolled to payment content');
        } else {
          // Fallback: scroll window to top
          window.scrollTo({ top: 0, behavior: 'smooth' });
          console.log('🔵 [Payment Page] Scrolled window to top');
        }
      }, 100);
    }
  }
}
