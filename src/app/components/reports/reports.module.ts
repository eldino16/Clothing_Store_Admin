import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { ReportsComponent } from './reports.component';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';


@NgModule({
  declarations: [
    ReportsComponent
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    Ng2GoogleChartsModule,
  ]
})
export class ReportsModule { }
