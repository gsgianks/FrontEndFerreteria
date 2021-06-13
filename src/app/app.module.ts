import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './ui/login/login/login.component';
import { MaterialModule } from './shared/material/material.module';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { NavBarComponent } from './ui/shared/nav-bar/nav-bar.component';
import { LogoutComponent } from './ui/login/logout/logout.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from './services/auth.service';
import { AuthGuard } from './auth/auth.guard';
import { AuthHttpInterceptor } from './auth/AuthHttpInterceptor';
import { ConfirmationDialogComponent } from './ui/shared/confirmation-dialog/confirmation-dialog.component';
import { OrderDetailViewComponent } from './ui/order-detail/order-detail-view/order-detail-view.component';
import { OrderDetailTableComponent } from './ui/order-detail/order-detail-table/order-detail-table.component';
import { OrderDetailEditComponent } from './ui/order-detail/order-detail-edit/order-detail-edit.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    NavBarComponent,
    LogoutComponent,
    ConfirmationDialogComponent,
    OrderDetailViewComponent,
    OrderDetailTableComponent,
    OrderDetailEditComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MaterialModule,
    ReactiveFormsModule,
    HttpClientModule,
    BrowserAnimationsModule,
    NgbModule
  ],
  providers: [AuthService, AuthGuard,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthHttpInterceptor,
      multi: true
    }
  ],
  entryComponents: [
    ConfirmationDialogComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
