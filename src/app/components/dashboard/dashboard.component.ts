import { Component, OnInit } from '@angular/core';
import { ColDef } from 'ag-grid-community';
import { CellRendererComponent } from 'ag-grid-community/dist/types/core/components/framework/componentTypes';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  orders: any = [];
  orderStatusChart: any;

  constructor(private _httpService: HttpService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getNetAmount();
    this.getOrdersData();
    this.getChartData();
  }

  count = {
    from: 0,
    duration: 1,
  }

  getNetAmount() {
    this._httpService
      .get(environment.BASE_API_PATH + 'PaymentMaster/GetReportNetFigure')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.objCountData[0].count = res.data[0].orders;
          this.objCountData[1].count = res.data[0].shippingAmount;
          this.objCountData[2].count = res.data[0].cashOnDelivery;
          this.objCountData[3].count = res.data[0].cancelled;
        } else {
          this._toastrService.error(res.errors[0], 'Dashboard');
        }
      });
  }

  objCountData = [
    {
      bgColorClass: 'bg-warning card-body',
      fontColorClass: 'font-warning',
      icon: 'navigation',
      title: 'Orders',
      count: 0,
    },
    {
      bgColorClass: 'bg-secondary card-body',
      fontColorClass: 'font-secondary',
      icon: 'box',
      title: 'Shipping Amount',
      count: 0,
    },
    {
      bgColorClass: 'bg-primary card-body',
      fontColorClass: 'font-primary',
      icon: 'message-square',
      title: 'Cash On Delivery',
      count: 0,
    },
    {
      bgColorClass: 'bg-danger card-body',
      fontColorClass: 'font-danger',
      icon: 'users',
      title: 'Cancelled',
      count: 0,
    },
  ];

  getOrdersData() {
    this._httpService
      .get(environment.BASE_API_PATH + 'PaymentMaster/GetReportManageOrder')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.orders = res.data;
        } else {
          this._toastrService.error(res.errors[0], 'Dashboard');
        }
      });
  }

  columnDefs: ColDef[] = [
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

  getChartData() {
    let objOrderStatusData = [];
    let arr = ["Date"];

    this._httpService
      .get(environment.BASE_API_PATH + 'PaymentMaster/GetChartOrderStatus')
      .subscribe((res) => {
        if (res.isSuccess) {
          let allData = res.data;
          let allDates = allData.map(item => item.date).filter((value, index, self) => self.indexOf(value) === index);
          let orderStatus = allData.map(item => item.orderStatus).filter((value, index, self) => self.indexOf(value) === index);

          for (let status of orderStatus) {
            arr.push(status);
          }

          objOrderStatusData.push(arr);

          var setZero: any = 0;
          for (let date of allDates) {
            arr = [];
            arr.push(date);

            for (let status of orderStatus) {
              arr.push(setZero);
            }

            for (let i in orderStatus) {
              for (let index in allData) {
                if (orderStatus[i] === allData[index].orderStatus && date === allData[index].date) {
                  arr[parseInt(i) + 1] = allData[index].counts;
                }
              }
            }
            objOrderStatusData.push(arr);
          }

          this.orderStatusChart = {
            chartType: 'ColumnChart',
            dataTable: objOrderStatusData,
            options: {
              legend: { position: 'none' },
              bars: "vertical",
              vAxis: { format: "decimal" },
              height: 340,
              width: '100%',
              colors: ["#ff7f83", "#a5a5a5"],
              backgroundColor: 'transparent'
            }
          };
        } else {
          this._toastrService.error(res.errors[0], 'Dashboard');
        }
      });
  }
}
