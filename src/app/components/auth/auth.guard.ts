import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './auth.service';
import { inject } from '@angular/core';
import { map } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  let _authService = inject(AuthService);
  let _router = inject(Router);
  return _authService.isLoggedIn$.pipe(
    map((_isLoggedIn: Boolean) => {
      if (!_isLoggedIn) {
        _router.navigate(['auth/login']);
        return false;
      }
      return true;
    })
  );
};
