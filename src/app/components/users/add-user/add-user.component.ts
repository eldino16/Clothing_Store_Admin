import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { DbOperation } from 'src/app/shared/utilities/db-operation';
import { MustMatchValidator } from 'src/app/shared/validations/validation.validator';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-add-user',
  templateUrl: './add-user.component.html',
  styleUrls: ['./add-user.component.scss']
})
export class AddUserComponent implements OnInit {
  addForm: FormGroup;
  submitted: boolean = false;
  buttonText: string = "Add";
  objUserTypes: any[] = [];
  dbOps: DbOperation;
  userId: number = 0;

  constructor(private _httpService: HttpService, private _toastrService: ToastrService, private _router: Router, private _route: ActivatedRoute) {
    this._route.queryParams.subscribe(params => {
      this.userId = params['userId'];
    })
  }

  ngOnInit() {
    this.setForm();
    this.getUserTypes();

    if (this.userId && this.userId != null && this.userId > 0) {
      this.buttonText = "Update";
      this.dbOps = DbOperation.update;
      this.getUserById(this.userId);
    }
  }

  get ctrl() {
    return this.addForm.controls;
  }

  setForm() {
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;

    this.addForm = new FormGroup({
      id: new FormControl(0),
      firstName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      lastName: new FormControl('', Validators.compose([Validators.required, Validators.minLength(3), Validators.maxLength(10)])),
      email: new FormControl('', Validators.compose([Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$')])),
      userTypeId: new FormControl('', Validators.required),
      password: new FormControl('', Validators.compose([Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}')])),
      confirmPassword: new FormControl('', Validators.required),
    },
      MustMatchValidator('password', 'confirmPassword'));
  }

  getUserById(id: number) {
    this._httpService.get(environment.BASE_API_PATH + "UserMaster/GetbyId/" + id).subscribe(res => {
      if (res.isSuccess) {
        this.addForm.patchValue(res.data);
      } else {
        this._toastrService.error(res.errors[0], "Add User");
      }
    });
  }

  getUserTypes() {
    this._httpService.get(environment.BASE_API_PATH + "UserType/GetAll").subscribe(res => {
      if (res.isSuccess) {
        this.objUserTypes = res.data;
      } else {
        this._toastrService.error(res.errors[0], "Add User");
      }
    });
  }

  submitForm() {
    this.submitted = true;
    if (this.addForm.invalid) { return; }

    switch (this.dbOps) {
      case DbOperation.create:
        this._httpService.post(environment.BASE_API_PATH + "UserMaster/Save/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this.resetForm();
            this._router.navigate(['users/user-list']);
            this._toastrService.success("Record saved successfully.", "Add User")
          } else { this._toastrService.error(res.errors[0], 'Add User'); }
        })
        break;
      case DbOperation.update:
        this._httpService.post(environment.BASE_API_PATH + "UserMaster/Update/", this.addForm.value).subscribe(res => {
          if (res.isSuccess) {
            this._router.navigate(['users/user-list']);
            this._toastrService.success("Record updated successfully.", "Add User")
          } else { this._toastrService.error(res.errors[0], 'Add User'); }
        })
        break;
    }
  }

  resetForm() {
    this.addForm.reset();
    this.submitted = false;
    this.buttonText = 'Add';
    this.dbOps = DbOperation.create;
  }

  cancelForm() {
    this.resetForm();
    this._router.navigate(['users/user-list']);
  }
}
