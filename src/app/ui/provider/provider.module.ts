import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { ProviderRoutingModule } from './provider-routing.module';
import { AgGridModule } from 'ag-grid-angular';
import * as ProviderComponents from '.';
import { ConfirmationDialogService } from '../shared/confirmation-dialog/confirmation-dialog.service';

@NgModule({
  declarations: [
    ProviderComponents.ProviderViewComponent,
    ProviderComponents.ProviderEditComponent,
    ProviderComponents.ProviderTableComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MaterialModule,
    FormsModule,
    ProviderRoutingModule,
    AgGridModule.withComponents([])
  ],
  entryComponents: [
    ProviderComponents.ProviderEditComponent,
  ],
  providers: [
    ConfirmationDialogService
  ],
  exports: [
    ProviderComponents.ProviderTableComponent
  ]
})
export class ProviderModule { }
