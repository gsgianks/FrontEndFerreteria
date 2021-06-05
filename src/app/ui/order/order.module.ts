import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { OrderRoutingModule } from './order-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import * as OrderComponents from '.';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';

@NgModule({
  declarations: [
    OrderComponents.OrderViewComponent,
    OrderComponents.OrderEditComponent,
    OrderComponents.OrderTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    OrderRoutingModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    OrderComponents.OrderEditComponent,
  ],
  providers: [
    ConfirmationDialogService
  ],
  exports: [
    OrderComponents.OrderTableComponent
  ]
})
export class OrderModule { }
