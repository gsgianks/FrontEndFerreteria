import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductViewComponent } from './product-view/product-view.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ProductRoutingModule } from './product-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import * as ProductComponents from '.';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';

@NgModule({
  declarations: [
    ProductComponents.ProductViewComponent,
    ProductComponents.ProductEditComponent,
    ProductComponents.ProductDisplayComponent,
    ProductComponents.ProductTableComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    ProductRoutingModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    ProductComponents.ProductEditComponent,
    ProductComponents.ProductDisplayComponent
  ],
  exports: [],
  providers: [
    ConfirmationDialogService
  ]
})
export class ProductModule { }
