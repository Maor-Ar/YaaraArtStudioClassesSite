import { Routes } from '@angular/router';
import { PaymentComponent } from './components/payment/payment.component';

export const routes: Routes = [
  {
    path: 'payments',
    component: PaymentComponent,
    title: 'תשלומים - סטודיו יערה'
  },
  {
    path: '**',
    redirectTo: ''
  }
];