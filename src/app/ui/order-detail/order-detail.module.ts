import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { MaterialModule } from "src/app/shared/material/material.module";
import * as OrderDetailComponents from '.';
import { ConfirmationDialogComponent } from "../shared/confirmation-dialog/confirmation-dialog.component";


@NgModule({
    declarations: [
        OrderDetailComponents.OrderDetailEditComponent,
        OrderDetailComponents.OrderDetailTableComponent,
        OrderDetailComponents.OrderDetailViewComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        MaterialModule,
        FormsModule,
    ],
    entryComponents: [
        OrderDetailComponents.OrderDetailEditComponent,
    ],
    providers: [
        ConfirmationDialogComponent
    ],
    exports: [
        OrderDetailComponents.OrderDetailTableComponent
    ]
})

export class OrderDetailComponent {}