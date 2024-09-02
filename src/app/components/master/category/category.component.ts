import {
  Component,
  ElementRef,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utilities/db-operation';
import {
  CharFieldValidator,
  NoWhiteSpaceValidator,
  NumberFieldValidator,
} from 'src/app/shared/validations/validation.validator';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-category',
  templateUrl: './category.component.html',
  styleUrls: ['./category.component.scss'],
})
export class CategoryComponent implements OnInit, OnDestroy {
  addForm: FormGroup;
  buttonText: string;
  dbOps: DbOperation;
  objRows: any[] = [];
  objRow: any;
  baseImagePath: string = environment.BASE_IMAGE_PATH;

  uploadedImagePath: string = 'assets/images/noimage.png';
  fileToUpload: any;

  @ViewChild('nav') elNav: any;
  @ViewChild('file') elFile: ElementRef;

  constructor(
    private _httpService: HttpService,
    private _toastrService: ToastrService,
    private _formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setFormState();
    this.getData();
  }

  ngOnDestroy() {
    this.objRows = null;
    this.objRow = null;
  }

  formErrors = { name: '', title: '', isSave: '', link: '' };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 3 char long',
      maxlength: 'Name cannot be more than 10 char long',
      validCharField: 'Name must contains char and space only',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
    },
    title: {
      required: 'Title is required',
      minlength: 'Title cannot be less than 3 char long',
      maxlength: 'Title cannot be more than 10 char long',
      validCharField: 'Title must contains char and space only',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
    },
    isSave: {
      required: 'Discount Value is required',
      minlength: 'Discount Value cannot be less than 3 char long',
      maxlength: 'Discount Value cannot be more than 10 char long',
      validNumberField: 'Discount Value must contains char and space only',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
    },
    link: {
      required: 'Link is required',
      minlength: 'Link cannot be less than 20 char long',
      maxlength: 'Link cannot be more than 100 char long',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
    },
  };

  get ctrl() {
    return this.addForm.controls;
  }

  getData() {
    this._httpService
      .get(environment.BASE_API_PATH + 'Category/GetAll')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.objRows = res.data;
        } else {
          this._toastrService.error(res.errors[0], 'Category Master');
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
          Validators.maxLength(10),
          CharFieldValidator.validCharField,
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
        ]),
      ],
      title: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
          CharFieldValidator.validCharField,
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
        ]),
      ],
      isSave: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(2),
          NumberFieldValidator.validNumberField,
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
        ]),
      ],
      link: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(20),
          Validators.maxLength(100),
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
      title: '',
      isSave: '',
      link: '',
    });

    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
    this.elFile.nativeElement.value = null;
    this.uploadedImagePath = 'assets/images/noimage.png';
    this.getData();
    this.elNav.select('viewTab');
  }

  submitForm() {
    if (this.addForm.invalid) {
      return;
    }

    if (this.dbOps === DbOperation.create && !this.fileToUpload) {
      this._toastrService.error(
        'Please upload a valid image type',
        'Category Master'
      );
      return;
    }
    const formData = new FormData();
    formData.append('Id', this.addForm.value.id);
    formData.append('Name', this.addForm.value.name);
    formData.append('Title', this.addForm.value.title);
    formData.append('IsSave', this.addForm.value.isSave);
    formData.append('Link', this.addForm.value.link);
    formData.append('Image', this.fileToUpload, this.fileToUpload.name);
    switch (this.dbOps) {
      case DbOperation.create:

        this._httpService
          .postImage(environment.BASE_API_PATH + 'Category/Save/', formData)
          .subscribe((res) => {
            if (res.isSuccess) {
              this._toastrService.success(
                'Record saved successfully',
                'Category Master'
              );
              this.resetForm();
            } else {
              this._toastrService.error(res.errors[0], 'Category Master');
            }
          });
        break;
      case DbOperation.update:
        this._httpService
          .postImage(environment.BASE_API_PATH + 'Category/Update/', formData)
          .subscribe((res) => {
            if (res.isSuccess) {
              this._toastrService.success(
                'Record updated successfully',
                'Category Master'
              );
              this.resetForm();
            } else {
              this._toastrService.error(res.errors[0], 'Category Master');
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
    this.uploadedImagePath =
      environment.BASE_IMAGE_PATH + this.objRow.imagePath;
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
            .post(environment.BASE_API_PATH + 'Category/Delete', obj)
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
      title: '',
      isSave: '',
      link: '',
    });
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
    this.elFile.nativeElement.value = null;
    this.uploadedImagePath = 'assets/images/noimage.png';
  }

  uploadImage(files: any) {
    if (files.length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastrService.error(
        'Please upload a valid image type',
        'Category Master'
      );
      this.elFile.nativeElement.value = null;
      this.uploadedImagePath = 'assets/images/noimage.png';
      return;
    }

    this.fileToUpload = files[0];

    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.uploadedImagePath = reader.result.toString();
    };
  }
}
