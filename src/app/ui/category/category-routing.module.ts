import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from '../../auth/auth.guard';
import { Role } from '../../domain/role.enum';
import * as CategoryComponents from '.';

const CategoryRoutes: Routes = [
  {
    path: '',
    component: CategoryComponents.CategoryViewComponent,
    data: {
      title: 'Categorias'
    }
  },
//   {
//     path: ':id',
//     component: CategoryComponents.CategoryDisplayComponent
//   },
  {
    path: 'edit/:id',
    component: CategoryComponents.CategoryEditComponent
  }
];
@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(CategoryRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class CategoryRoutingModule { }
