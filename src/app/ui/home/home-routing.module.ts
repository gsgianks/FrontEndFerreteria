import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { HomeContainerComponent } from './home-container.component';

const homeRoutes: Routes = [
  {
    path: '',
    component: HomeContainerComponent,
    children: [
      {
        path: '',
        component: HomeComponent
      },
    //   {
    //     path:'home2',
    //     component: HomeOption2Component
    //   }
    ]
  }
];

@NgModule({
  imports: [
    RouterModule.forChild(homeRoutes)
  ],
  exports: [
    RouterModule
  ],
  declarations: []
})
export class HomeRoutingModule { }
