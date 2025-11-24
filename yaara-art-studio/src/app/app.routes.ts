import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';
import { PaymentSuccessComponent } from './pages/payment-success/payment-success.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    title: 'סטודיו בודה - שיעורי ציור חווייתיים'
  },
  {
    path: 'payments',
    component: PaymentPageComponent,
    title: 'תשלומים - סטודיו בודה'
  },
  {
    path: 'payment-success',
    component: PaymentSuccessComponent,
    title: 'תשלום הושלם בהצלחה - סטודיו בודה'
  },
  {
    path: '**',
    redirectTo: ''
  }
];