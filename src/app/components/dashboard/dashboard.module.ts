import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { DashboardComponent } from './dashboard.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CountUpModule } from 'ngx-countup';
import { AgGridModule } from 'ag-grid-angular';
import { Ng2GoogleChartsModule } from 'ng2-google-charts';


@NgModule({
  declarations: [
    DashboardComponent
  ],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    SharedModule,
    ReactiveFormsModule,
    CountUpModule,
    AgGridModule,
    Ng2GoogleChartsModule
  ]
})
export class DashboardModule {

}
