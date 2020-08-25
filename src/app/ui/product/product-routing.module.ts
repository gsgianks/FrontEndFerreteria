import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { Role } from '../../domain/role.enum';
import { ProductEditComponent } from './product-edit/product-edit.component';

import * as ProductComponents from '.';

const ProductRoutes: Routes = [
  {
    path: '',
    component: ProductComponents.ProductViewComponent
  },
  {
    path: ':id',
    component: ProductComponents.ProductDisplayComponent
  },
  {
    path: 'edit/:id',
    component: ProductComponents.ProductEditComponent
  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProductRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class ProductRoutingModule { }
