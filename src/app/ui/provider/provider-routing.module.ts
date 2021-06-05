import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { Role } from '../../domain/role.enum';
import * as ProviderComponents from '.';

const ProviderRoutes: Routes = [
  {
    path: '',
    component: ProviderComponents.ProviderViewComponent,
    data: {
      title: 'Proveedores'
    }
  },
//   {
//     path: ':id',
//     component: ProviderComponents.ProviderDisplayComponent
//   },
  {
    path: 'edit/:id',
    component: ProviderComponents.ProviderEditComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(ProviderRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class ProviderRoutingModule { }
