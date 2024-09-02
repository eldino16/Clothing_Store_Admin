import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private _router: Router) {}
  message: string = '';
  currentUser: BehaviorSubject<any> = new BehaviorSubject<any>(null);
  private isLoggedIn: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  get currentUser$() {
    return this.currentUser.asObservable();
  }

  get isLoggedIn$() {
    return this.isLoggedIn.asObservable();
  }

  authLogin(res: any) {
    localStorage.setItem('userDetails', JSON.stringify(res));
    this.currentUser.next(res);
    this.isLoggedIn.next(true);
    this._router.navigate(['dashboard/default']);
  }

  logout() {
    this.currentUser.next(null);
    this.isLoggedIn.next(false);
    this._router.navigate(['auth/login']);
  }
}
