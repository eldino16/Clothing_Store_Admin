import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SalesRoutingModule } from './sales-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { TransactionsComponent } from './transactions/transactions.component';
import { AgGridModule } from 'ag-grid-angular';


@NgModule({
  declarations: [
    OrdersComponent,
    TransactionsComponent
  ],
  imports: [
    CommonModule,
    SalesRoutingModule,
    AgGridModule
  ]
})
export class SalesModule { }
