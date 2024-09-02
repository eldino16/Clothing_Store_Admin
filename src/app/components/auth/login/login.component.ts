import { Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { HttpService } from 'src/app/shared/services/http.service';
import { MustMatchValidator } from 'src/app/shared/validations/validation.validator';
import { environment } from 'src/environments/environment';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  registerForm: FormGroup;
  loginForm: FormGroup;
  submitted: boolean = false;
  @ViewChild('nav') elNav: any;

  constructor(
    private _formBuilder: FormBuilder,
    private _toastr: ToastrService,
    private _httpService: HttpService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    this.setLoginForm();
    this.setRegistrationForm();
  }

  setLoginForm() {
    this.loginForm = this._formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  setRegistrationForm() {
    /* this.registerForm = this._formBuilder.group(
      {
        firstName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ]),
        ],
        lastName: [
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ]),
        ],
        email: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
          ]),
        ],
        userTypeId: [1],
        password: [
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
            ),
          ]),
        ],
        confirmPassword: ['', Validators.required],
      },
      { validators: MustMatchValidator('password', 'confirmPassword') }
    ); */
    this.registerForm = new FormGroup(
      {
        firstName: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ])
        ),
        lastName: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(10),
          ])
        ),
        email: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
          ])
        ),
        userTypeId: new FormControl(1),
        password: new FormControl(
          '',
          Validators.compose([
            Validators.required,
            Validators.pattern(
              '(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-zd$@$!%*?&].{8,}'
            ),
          ])
        ),
        confirmPassword: new FormControl('', Validators.required),
      },
      MustMatchValidator('password', 'confirmPassword')
    );
  }

  get registrationCtrl() {
    return this.registerForm.controls;
  }

  login() {
    if (this.loginForm.get('userName').value === '') {
      this._toastr.error('Username is required', 'Login');
    } else if (this.loginForm.get('password').value === '') {
      this._toastr.error('Password is required', 'Login');
    } else {
      if (this.loginForm.valid) {
        this._httpService
          .post(
            environment.BASE_API_PATH + 'UserMaster/Login/',
            this.loginForm.value
          )
          .subscribe((res) => {
            if (res.isSuccess) {
              this._toastr.success('Login Successful', 'Login');
              this._authService.authLogin(res.data);
              this.loginForm.reset();
            } else {
              this._toastr.error(res.errors[0], 'Login');
            }
          });
      }
    }
  }

  register(formData: FormGroup) {
    this.submitted = true;
    if (this.registerForm.invalid) {
      return;
    }

    this._httpService
      .post(environment.BASE_API_PATH + 'UserMaster/Save/', formData.value)
      .subscribe((res) => {
        if (res.isSuccess) {
          this._toastr.success('Registeration Successful', 'Registration');
          this.registerForm.reset({
            firstName: '',
            lastName: '',
            email: '',
            userTypeId: 1,
            password: '',
            confirmPassword: '',
          });
          this.submitted = false;
          this.elNav.select('loginTab');
        } else {
          this._toastr.error(res.errors[0], 'Registration');
        }
      });
  }
}
