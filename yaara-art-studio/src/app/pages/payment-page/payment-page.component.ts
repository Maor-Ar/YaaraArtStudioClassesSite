import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
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
}
