import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utilities/db-operation';
import {
  CharFieldValidator,
  NoWhiteSpaceValidator,
} from 'src/app/shared/validations/validation.validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-tag',
  templateUrl: './tag.component.html',
  styleUrls: ['./tag.component.scss'],
})
export class TagComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  buttonText: string;
  dbOps: DbOperation;
  objRows: any[] = [];
  objRow: any;
  @ViewChild('nav') elNav: any;

  formErrors = { name: '' };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 3 char long',
      maxlength: 'Name cannot be more than 15 char long',
      validCharField: 'Name must contains char and space only',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
    },
  };

  constructor(
    private _httpService: HttpService,
    private _toastrService: ToastrService,
    private _formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.setFormState();
    this.getData();
  }

  ngOnDestroy() {
    this.objRows = null;
    this.objRow = null;
  }

  get ctrl() {
    return this.addForm.controls;
  }

  getData() {
    this._httpService
      .get(environment.BASE_API_PATH + 'TagMaster/GetAll')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.objRows = res.data;
        } else {
          this._toastrService.error(res.errors[0], 'Tag Master');
        }
      });
  }

  setFormState() {
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
    this.addForm = this._formBuilder.group({
      id: [0],
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(15),
          CharFieldValidator.validCharField,
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
        ]),
      ],
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanges();
    });
  }

  onValueChanges() {
    if (!this.addForm) {
      return;
    }
    for (const field of Object.keys(this.formErrors)) {
      this.formErrors[field] = '';

      const control = this.addForm.get(field);
      if (control && control.dirty && control.invalid) {
        const msg = this.validationMessage[field];

        for (const key of Object.keys(control.errors)) {
          if (key !== 'required') {
            this.formErrors[field] += msg[key] + '. ';
          }
        }
      }
    }
  }

  resetForm() {
    this.addForm.reset({
      id: 0,
      name: '',
    });

    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
    this.getData();
    this.elNav.select('viewTab');
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: '',
    });

    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
    this.elNav.select('viewTab');
  }

  submitForm() {
    if (this.addForm.invalid) {
      return;
    }

    switch (this.dbOps) {
      case DbOperation.create:
        this._httpService
          .post(
            environment.BASE_API_PATH + 'TagMaster/Save/',
            this.addForm.value
          )
          .subscribe((res) => {
            if (res.isSuccess) {
              this._toastrService.success(
                'Record saved successfully',
                'Tag Master'
              );
              this.resetForm();
            } else {
              this._toastrService.error(res.errors, 'Tag Master');
            }
          });
        break;
      case DbOperation.update:
        this._httpService
          .post(
            environment.BASE_API_PATH + 'TagMaster/Update/',
            this.addForm.value
          )
          .subscribe((res) => {
            if (res.isSuccess) {
              this._toastrService.success(
                'Record updated successfully',
                'Tag Master'
              );
              this.resetForm();
            } else {
              this._toastrService.error(res.errors[0], 'Tag Master');
            }
          });
        break;
    }
  }

  editRecord(id: number) {
    this.buttonText = 'Update';
    this.dbOps = DbOperation.update;
    this.elNav.select('addTab');
    this.objRow = this.objRows.find((x) => x.id === id);
    this.addForm.patchValue(this.objRow);
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
            .post(environment.BASE_API_PATH + 'TagMaster/Delete/', obj)
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

  tabChange() {
    this.addForm.reset({
      id: 0,
      name: '',
    });

    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
  }
}