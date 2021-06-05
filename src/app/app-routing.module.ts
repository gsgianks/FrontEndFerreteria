import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginComponent } from './ui/login/login/login.component';
import { LogoutComponent } from './ui/login/logout/logout.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'home',
    loadChildren: './ui/home/home.module#HomeModule'
  },
  {
    path: 'user',
    loadChildren: './ui/user/user.module#UserModule'
  },
  {
    path: 'product',
    loadChildren: './ui/product/product.module#ProductModule'
  },
  {
    path: 'credit',
    loadChildren: './ui/credit/credit.module#CreditModule'
  },
  {
    path: 'creditpayment',
    loadChildren: './ui/credit-payment/credit-payment.module#CreditPaymentModule'
  },
  {
    path: 'category',
    loadChildren: './ui/category/category.module#CategoryModule'
  },
  {
    path: 'provider',
    loadChildren: './ui/provider/provider.module#ProviderModule'
  },
  {
    path: 'order',
    loadChildren: './ui/order/order.module#OrderModule'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'logout',
    component: LogoutComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
