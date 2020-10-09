import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { Role } from '../../domain/role.enum';

import * as CreditComponents from '.';

const CreditRoutes: Routes = [
  {
    path: '',
    component: CreditComponents.ViewCreditPaymentComponent,
    data: {
      title: 'Pagos Crédito'
    }
  },
  // {
  //   path: ':id',
  //   component: CreditComponents.PayCreditPaymentComponent
  // },
  {
    path: 'edit/:id/:idPago/:tab',
    component: CreditComponents.ViewCreditPaymentComponent
  },
  {
    path: 'his/:id/:idPago/:tab',
    component: CreditComponents.ViewCreditPaymentComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CreditRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class CreditRoutingModule { }
