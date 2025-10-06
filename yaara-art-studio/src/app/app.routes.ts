import { Routes } from '@angular/router';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';

export const routes: Routes = [
  {
    path: 'payments',
    component: PaymentPageComponent,
    title: 'תשלומים - סטודיו יערה'
  },
  {
    path: '**',
    redirectTo: ''
  }
];