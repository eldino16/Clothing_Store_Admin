import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invoice',
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss']
})
export class InvoiceComponent implements OnInit {

  orders: any = [];

  constructor(private _httpService: HttpService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getInvoiceData();
  }

  getInvoiceData() {
    this._httpService
      .get(environment.BASE_API_PATH + 'PaymentMaster/GetReportInvoiceList')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.orders = res.data;
        } else {
          this._toastrService.error(res.errors[0], 'Dashboard');
        }
      });
  }

  columnDefs: ColDef[] = [
    { field: 'invoiceNo', filter: true, cellStyle: { textAlign: 'center' } },
    { field: 'orderId', filter: true, cellStyle: { textAlign: 'center' } },
    { field: 'orderStatus', filter: true, cellRenderer: p => p.value, cellStyle: { textAlign: 'center' } },
    { field: 'paymentMethod', filter: true, cellStyle: { textAlign: 'center' } },
    { field: 'paymentDate', filter: true, cellStyle: { textAlign: 'center' } },
    { field: 'paymentStatus', filter: true, cellRenderer: p => p.value, cellStyle: { textAlign: 'center' } },
    { field: 'shippingAmount', filter: true, cellStyle: { textAlign: 'center' } },
    { field: 'subTotalAmount', filter: true, cellStyle: { textAlign: 'center' } },
    { field: 'totalAmount', filter: true, cellStyle: { textAlign: 'center' } },
  ];

  gridOptions: any = {
    domLayout: 'autoHeight',
  }

  pagination = true;
  paginationPageSize = 10;
  paginationPageSizeSelector = [10, 25, 50];
}
