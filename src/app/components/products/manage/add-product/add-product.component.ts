import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utilities/db-operation';
import { CharFieldValidator, NoWhiteSpaceValidator, NumberFieldValidator } from 'src/app/shared/validations/validation.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-product',
  templateUrl: './add-product.component.html',
  styleUrls: ['./add-product.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class AddProductComponent implements OnInit {
  productId: number = 0;
  objSize: any[] = [];
  objCategory: any[] = [];
  objTag: any[] = [];
  objColor: any[] = [];
  submitted: boolean = false;
  addForm: FormGroup;
  dbOps: DbOperation;
  counter: number = 1;
  buttonText: string = "";
  fileToUpload = [];

  bigImage = "assets/images/product-noimage.jpg";
  images = [
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" },
    { img: "assets/images/noimage.png" }
  ];

  @ViewChild('file') elfile: ElementRef;

  constructor(private route: ActivatedRoute, private router: Router, private _httpService: HttpService, private _toastrService: ToastrService, private _formBuilder: FormBuilder) {
    this.route.queryParams.subscribe(params => {
      this.productId = params['productId'];
    });
  }

  ngOnInit() {
    this.setFormState();
    this.getSizes();
    this.getCategories();
    this.getColors();
    this.getTags();

    if (this.productId && this.productId != null && this.productId > 0) {
      this.buttonText = "Update";
      this.dbOps = DbOperation.update;
      this.getProductById(this.productId);
    }
  }

  getProductById(id: number) {
    this._httpService.get(environment.BASE_API_PATH + "ProductMaster/GetbyId/" + id).subscribe(res => {
      if (res.isSuccess) {
        this.addForm.patchValue(res.data);
        this.counter = res.data.quantity;
        this.addForm.get('isSale').setValue(res.data.isSale === 1 ? true : false);
        this.addForm.get('isNew').setValue(res.data.isNew === 1 ? true : false);

        this._httpService.get(environment.BASE_API_PATH + "ProductMaster/GetProductPicturebyId/" + id).subscribe(res => {
          if (res.isSuccess && res.data.length > 0) {
            this.images = [
              { img: res.data[0].name != null ? environment.BASE_IMAGE_PATH + res.data[0].name : "assets/images/noimage.png" },
              { img: res.data[1].name != null ? environment.BASE_IMAGE_PATH + res.data[1].name : "assets/images/noimage.png" },
              { img: res.data[2].name != null ? environment.BASE_IMAGE_PATH + res.data[2].name : "assets/images/noimage.png" },
              { img: res.data[3].name != null ? environment.BASE_IMAGE_PATH + res.data[3].name : "assets/images/noimage.png" },
              { img: res.data[4].name != null ? environment.BASE_IMAGE_PATH + res.data[4].name : "assets/images/noimage.png" }
            ];
          } else {
            this._toastrService.error(res.errors[0], "Add Product");
          }
        });

      } else {
        this._toastrService.error(res.errors[0], "Add Product");
      }
    });
  }

  getSizes() {
    this._httpService
      .get(environment.BASE_API_PATH + 'SizeMaster/GetAll')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.objSize = res.data;
        } else {
          this._toastrService.error(res.errors[0], 'Product Master');
        }
      });
  }

  getColors() {
    this._httpService
      .get(environment.BASE_API_PATH + 'ColorMaster/GetAll')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.objColor = res.data;
        } else {
          this._toastrService.error(res.errors[0], 'Product Master');
        }
      });
  }

  getCategories() {
    this._httpService
      .get(environment.BASE_API_PATH + 'Category/GetAll')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.objCategory = res.data;
        } else {
          this._toastrService.error(res.errors[0], 'Product Master');
        }
      });
  }

  getTags() {
    this._httpService
      .get(environment.BASE_API_PATH + 'TagMaster/GetAll')
      .subscribe((res) => {
        if (res.isSuccess) {
          this.objTag = res.data;
        } else {
          this._toastrService.error(res.errors[0], 'Product Master');
        }
      });
  }

  formErrors = { name: '', title: '', code: '', price: '', salePrice: '', discount: '', sizeId: '', colorId: '', categoryId: '', tagId: '' };

  validationMessage = {
    name: {
      required: 'Name is required',
      minlength: 'Name cannot be less than 3 char long',
      maxlength: 'Name cannot be more than 20 char long',
      validCharField: 'Name must contains char and space only',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
    },
    title: {
      required: 'Title is required',
      minlength: 'Name cannot be less than 3 char long',
      maxlength: 'Name cannot be more than 20 char long',
      validCharField: 'Name must contains char and space only',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
    },
    code: {
      required: 'Code is required',
      minlength: 'Code cannot be less than 3 char long',
      maxlength: 'Code cannot be more than 10 char long',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
    },
    price: {
      required: 'Price is required',
      minlength: 'Price cannot be less than 1 char long',
      maxlength: 'Price cannot be more than 4 char long',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
      NumberFieldValidator: 'Only numbers are allowed'
    },
    salePrice: {
      required: 'Sale price is required',
      minlength: 'Sale price cannot be less than 1 char long',
      maxlength: 'Sale price cannot be more than 4 char long',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
      NumberFieldValidator: 'Only numbers are allowed'
    },
    discount: {
      required: 'Discount price is required',
      minlength: 'Discount Price cannot be less than 1 char long',
      maxlength: 'Discount Price cannot be more than 4 char long',
      noWhiteSpaceValidator: 'Only whitespaces are not allowed',
      NumberFieldValidator: 'Only numbers are allowed'
    },
    sizeId: {
      required: 'Size is required'
    },
    colorId: {
      required: 'Color is required'
    },
    tagId: {
      required: 'Tag is required'
    },
    categoryId: {
      required: 'Category is required'
    }
  };

  setFormState() {
    this.buttonText = "Add";
    this.dbOps = DbOperation.create;

    this.addForm = this._formBuilder.group({
      id: [0],
      name: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          CharFieldValidator.validCharField,
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
        ])],
      title: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(20),
          CharFieldValidator.validCharField,
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
        ])],
      code: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(10),
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
        ])],
      price: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4),
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
          NumberFieldValidator.validNumberField
        ])],
      salePrice: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4),
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
          NumberFieldValidator.validNumberField
        ])],
      discount: [
        '',
        Validators.compose([
          Validators.required,
          Validators.minLength(1),
          Validators.maxLength(4),
          NoWhiteSpaceValidator.noWhiteSpaceValidator,
          NumberFieldValidator.validNumberField
        ])],
      sizeId: ['', Validators.required],
      colorId: ['', Validators.required],
      tagId: ['', Validators.required],
      categoryId: ['', Validators.required],
      quantity: [''],
      isSale: [false],
      isNew: [false],
      shortDetails: [''],
      description: ['']
    });

    this.addForm.valueChanges.subscribe(() => {
      this.onValueChanges();
    });
    this.addForm.get('quantity').setValue(this.counter);
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

  increment() {
    this.counter = this.counter + 1;
    this.addForm.get('quantity').setValue(this.counter);
  }
  decrement() {
    if (this.counter > 0) { this.counter = this.counter - 1; }
    this.addForm.get('quantity').setValue(this.counter);
  }

  upload(files: any, i: number) {
    if (files.length === 0) {
      return;
    }

    let type = files[0].type;
    if (type.match(/image\/*/) == null) {
      this._toastrService.error("Please upload a valid image type !", "Add Product");
      this.elfile.nativeElement.value = null;
      this.bigImage = "assets/images/noimage.png";
    }

    this.fileToUpload[i] = files[0];

    //read image
    let reader = new FileReader();
    reader.readAsDataURL(files[0]);
    reader.onload = () => {
      this.images[i].img = reader.result.toString();
      this.bigImage = reader.result.toString();
    }
  }

  get ctrl() {
    return this.addForm.controls;
  }

  submit() {
    this.submitted = true;

    if (this.addForm.invalid) {
      return;
    }

    if (this.dbOps === DbOperation.create && this.fileToUpload.length < 5) {
      this._toastrService.error("Please upload 5 images per product!", "Add Product");
      return;
    } else if (this.dbOps === DbOperation.update && (this.fileToUpload.length > 0 && this.fileToUpload.length < 5)) {
      this._toastrService.error("Please upload 5 images per product!", "Add Product");
      return;
    }

    const formData = new FormData();
    formData.append("Id", this.addForm.value.id);
    formData.append("Name", this.addForm.value.name);
    formData.append("Title", this.addForm.value.title);
    formData.append("Code", this.addForm.value.code);
    formData.append("Price", this.addForm.value.price);
    formData.append("SalePrice", this.addForm.value.salePrice);
    formData.append("Discount", this.addForm.value.discount);
    formData.append("Quantity", this.addForm.value.quantity);
    if (this.addForm.value.isSale == true) {
      formData.append("IsSale", '1');
    }
    else { formData.append("IsSale", '0'); }
    if (this.addForm.value.isNew == true) {
      formData.append("IsNew", '1');
    }
    else { formData.append("IsNew", '0'); }
    formData.append("SizeId", this.addForm.value.sizeId);
    formData.append("ColorId", this.addForm.value.colorId);
    formData.append("CategoryId", this.addForm.value.categoryId);
    formData.append("TagId", this.addForm.value.tagId);
    formData.append("ShortDetails", this.addForm.value.shortDetails);
    formData.append("Description", this.addForm.value.description);

    if (this.fileToUpload) {
      for (let i = 0; i < this.fileToUpload.length; i++) {
        //formData.append("Image", this.fileToUpload[i], this.fileToUpload[i].name);
        let ToUpload = this.fileToUpload[i];
        formData.append("Image", ToUpload, ToUpload.name);
      }
    }
    switch (this.dbOps) {
      case DbOperation.create:
        this._httpService.postImage(environment.BASE_API_PATH + "ProductMaster/Save/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastrService.success("Record saved succesfully", "Add Product");
            this.cancelForm();
          } else {
            this._toastrService.error(res.errors[0], "Add Product");
          }
        });
        break;
      case DbOperation.update:
        this._httpService.postImage(environment.BASE_API_PATH + "ProductMaster/Update/", formData).subscribe(res => {
          if (res.isSuccess) {
            this._toastrService.success("Record updated succesfully", "Add Product");
            this.cancelForm();
          } else {
            this._toastrService.error(res.errors[0], "Add Product");
          }
        });
        break;
    }
  }

  cancelForm() {
    this.addForm.reset({
      id: 0,
      name: '',
      title: '',
      code: '',
      price: '',
      salePrice: '',
      discount: '',
      sizeId: '',
      colorId: '',
      categoryId: '',
      tagId: '',
      quantity: '',
      isSale: false,
      isNew: false,
      shortDetails: '',
      description: ''
    });

    this.buttonText = "Add";
    this.dbOps = DbOperation.create;

    this.bigImage = "assets/images/product-noimage.jpg";
    this.images = [
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" },
      { img: "assets/images/noimage.png" }
    ];

    this.fileToUpload = [];
    this.counter = 1;
    this.router.navigate(['/products/manage/product-list']);
  }

  ngOnDestroy() {
    this.objSize = [];
    this.objColor = [];
    this.objTag = [];
    this.objCategory = [];
    this.fileToUpload = [];
  }

  public Editor = ClassicEditor;

}
