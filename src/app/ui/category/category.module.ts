import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { CategoryRoutingModule } from './category-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import * as CategoryComponents from '.';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';

@NgModule({
  declarations: [
    CategoryComponents.CategoryViewComponent,
    CategoryComponents.CategoryEditComponent,
    CategoryComponents.CategoryTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    CategoryRoutingModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    CategoryComponents.CategoryEditComponent,
  ],
  providers: [
    ConfirmationDialogService
  ],
  exports: [
    CategoryComponents.CategoryTableComponent
  ]
})
export class CategoryModule { }
