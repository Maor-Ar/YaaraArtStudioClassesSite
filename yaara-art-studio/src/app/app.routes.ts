import { Routes } from '@angular/router';
import { MainPageComponent } from './pages/main-page/main-page.component';
import { PaymentPageComponent } from './pages/payment-page/payment-page.component';

export const routes: Routes = [
  {
    path: '',
    component: MainPageComponent,
    title: 'סטודיו יערה - שיעורי ציור חווייתיים'
  },
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