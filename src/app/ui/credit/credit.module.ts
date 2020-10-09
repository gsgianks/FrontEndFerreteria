import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { CreditRoutingModule } from './credit-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import * as CreditComponents from '.';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';

@NgModule({
  declarations: [
    CreditComponents.CreditViewComponent,
    CreditComponents.CreditEditComponent,
    CreditComponents.CreditDisplayComponent,
    CreditComponents.CreditTableComponent,
    CreditComponents.CreditUserListComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    CreditRoutingModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    CreditComponents.CreditEditComponent,
    CreditComponents.CreditDisplayComponent
  ],
  providers: [
    ConfirmationDialogService
  ],
  exports: [
    CreditComponents.CreditTableComponent
  ]
})
export class CreditModule { }
