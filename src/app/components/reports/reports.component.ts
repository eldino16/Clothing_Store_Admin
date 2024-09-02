import { Component, OnInit } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-reports',
  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {

  orderStatusChart: any;

  constructor(private _httpService: HttpService, private _toastrService: ToastrService) { }

  ngOnInit(): void {
    this.getChartData();
  }

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
            chartType: 'LineChart',
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
