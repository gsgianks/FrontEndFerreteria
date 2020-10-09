import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { CreditRoutingModule } from './credit-payment-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import * as CreditComponents from '.';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';
import { CreditModule } from '../credit/credit.module';
import { PaymentHistoryComponent } from './payment-history/payment-history.component';
import { DisplayCreditPaymentComponent } from './display-credit-payment/display-credit-payment.component';

@NgModule({
  declarations: [
    CreditComponents.PayCreditPaymentComponent,
    CreditComponents.ViewCreditPaymentComponent,
    PaymentHistoryComponent,
    DisplayCreditPaymentComponent,
    // CreditComponents.CreditDisplayComponent,
    // CreditComponents.CreditTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    CreditRoutingModule,
    CreditModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    CreditComponents.PayCreditPaymentComponent,
    // CreditComponents.CreditDisplayComponent
  ],
  providers: [
    ConfirmationDialogService
  ]
})
export class CreditPaymentModule { }
