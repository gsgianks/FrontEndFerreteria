import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import * as OrderComponents from '.';

const OrderRoutes: Routes = [
  {
    path: '',
    component: OrderComponents.OrderViewComponent,
    data: {
      title: 'Pedidos'
    }
  },
  {
    path: ':id',
    component: OrderComponents.OrderViewComponent
  },
  {
    path: 'edit/:id',
    component: OrderComponents.OrderEditComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(OrderRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class OrderRoutingModule { }
