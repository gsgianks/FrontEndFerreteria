import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { Role } from '../../domain/role.enum';
import { UserEditComponent } from './user-edit/user-edit.component';

import * as UserComponents from '.';

const userRoutes: Routes = [
  {
    path: '',
    component: UserComponents.UserViewComponent,
    data: {
      title: 'Usuarios'
    }
  },
  {
    path: ':id',
    component: UserComponents.UserViewComponent
  },
  {
    path: 'edit/:id',
    component: UserComponents.UserEditComponent
  }
];

// const userRoutes: Routes = [
//   {
//     path: '',
//     children: [
//       {
//         path: '',
//         pathMatch: 'full',
//         redirectTo : 'list'
//       },
//       {
//         path: 'list',
//         component: UserGridComponent
//       },
//       {
//         path: ':id',
//         component: UserEditComponent
//       },
//       {
//         path: 'edit:id',
//         component: UserEditComponent
//       }
//     ],
//     canActivate: [AuthGuard],
//     data: {
//       expectedRole: Role.AdminSupplier
//     }
//   }

// ];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(userRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class UserRoutingModule { }
