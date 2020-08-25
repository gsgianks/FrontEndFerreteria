import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { Role } from '../../domain/role.enum';
import { CreditEditComponent } from './credit-edit/Credit-edit.component';

import * as CreditComponents from '.';

const CreditRoutes: Routes = [
  {
    path: '',
    component: CreditComponents.CreditViewComponent,
    data: {
      title: 'Creditos'
    }
  },
  {
    path: ':id',
    component: CreditComponents.CreditViewComponent
  },
  {
    path: 'edit/:id/:origen',
    component: CreditComponents.CreditEditComponent
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
