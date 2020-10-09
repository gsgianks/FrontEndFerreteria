import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// tslint:disable-next-line: max-line-length
import { MatCardModule, MatIconModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatPaginatorModule, MatDialogModule, MatTooltipModule, MatSidenavModule, MatCheckboxModule, MatAutocompleteModule, MatDatepickerModule, MatRadioModule, MatSelectModule, MatMenuModule, MatDividerModule, MatToolbarModule, MatNativeDateModule, MatOptionModule, MatTableModule, MatBottomSheetModule, MatBadgeModule, MatTabsModule, MatStepperModule, MatExpansionModule, MatListModule, MatSortModule } from '@angular/material';

const modules = [
  MatButtonModule,
  MatCheckboxModule,
  MatFormFieldModule,
  MatAutocompleteModule,
  MatDatepickerModule,
  MatRadioModule,
  MatSelectModule,
  MatMenuModule,
  MatCardModule,
  MatDividerModule,
  MatExpansionModule,
  MatListModule,
  MatStepperModule,
  MatTabsModule,
  MatBadgeModule,
  MatDialogModule,
  MatBottomSheetModule,
  MatTooltipModule,
  MatTableModule,
  MatIconModule,
  MatInputModule,
  MatOptionModule,
  MatNativeDateModule,
  MatToolbarModule,
  MatSidenavModule,
  MatPaginatorModule,
  MatSortModule
];

@NgModule({
  declarations: [],
  imports: [...modules],
  exports: [...modules]
})
export class MaterialModule { }
