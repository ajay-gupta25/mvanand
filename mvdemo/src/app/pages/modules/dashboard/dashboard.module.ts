import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DasboardRoutingModule } from './daboard-routing.module';
import { SharedModule }      from '../../../shared/shared.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { NgxPaginationModule } from 'ngx-pagination';
import { NgxSliderModule } from '@angular-slider/ngx-slider';



@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DasboardRoutingModule,
    SharedModule,
    NgSelectModule,
    NgxPaginationModule,
    NgxSliderModule
  ]
})
export class DashboardModule { }
