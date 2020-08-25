import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from 'src/app/shared/material/material.module';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home/home.component';
import { HomeContainerComponent } from './home-container.component';

@NgModule({
  declarations: [
    HomeComponent,
    HomeContainerComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    MaterialModule
  ]
})
export class HomeModule { }
