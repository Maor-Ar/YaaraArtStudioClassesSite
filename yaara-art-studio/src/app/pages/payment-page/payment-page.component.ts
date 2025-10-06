import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
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
export class PaymentPageComponent {

  constructor(private router: Router) {}

  /**
   * Handle payment success - navigate back to main page
   */
  onPaymentSuccess(): void {
    console.log('Payment completed successfully');
    // Navigate back to main page with contact section
    this.router.navigate(['/'], { fragment: 'contact' });
  }
}
