import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss']
})
export class ProductListComponent implements OnInit, OnDestroy {
  objRows: any[] = [];

  constructor(
    private _toastrService: ToastrService,
    private _httpService: HttpService,
    private _router: Router
  ) { }

  ngOnInit() {
    this.getData();
  }

  ngOnDestroy() {
    this.objRows = null;
  }

  getData() {
    this._httpService
      .get(environment.BASE_API_PATH + 'ProductMaster/GetAll')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.objRows = res.data;
        } else {
          this._toastrService.error(res.errors[0], 'Product Master');
        }
      });
  }

  editRecord(id: number) {
    this._router.navigate(['products/manage/add-product/'], { queryParams: { productId: id } });
  }

  deleteRecord(id: number) {
    let obj = {
      id: id,
    };

    const swalWithBootstrapButtons = Swal.mixin({
      customClass: {
        confirmButton: 'btn btn-success',
        cancelButton: 'btn btn-danger',
      },
      buttonsStyling: false,
    });
    swalWithBootstrapButtons
      .fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Yes, delete it!',
        cancelButtonText: 'No, cancel!',
        reverseButtons: true,
      })
      .then((result) => {
        if (result.isConfirmed) {
          this._httpService
            .post(environment.BASE_API_PATH + 'ProductMaster/Delete', obj)
            .subscribe((res) => {
              if (res.isSuccess) {
                swalWithBootstrapButtons.fire({
                  title: 'Deleted!',
                  text: 'Your record has been deleted.',
                  icon: 'success',
                });
                this.getData();
              } else {
                swalWithBootstrapButtons.fire({
                  title: 'Error',
                  text: res.errors[0],
                  icon: 'error',
                });
              }
            });
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          swalWithBootstrapButtons.fire({
            title: 'Cancelled',
            text: 'Your record is safe :)',
            icon: 'error',
          });
        }
      });
  }
}
