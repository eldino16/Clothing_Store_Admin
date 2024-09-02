import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpResponse,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, map, Observable, retry, throwError } from 'rxjs';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {
  constructor() { }

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
  ): Observable<HttpEvent<unknown>> {
    return next.handle(request).pipe(
      retry(3),
      map((res) => {
        if (res instanceof HttpResponse) {
          return res;
        }
        return null;
      }),
      catchError((err: HttpErrorResponse) => {
        let errMsg = '';
        if (err.error instanceof ErrorEvent) {
          errMsg = `Error : ${err.message}`;
        } else {
          errMsg = `Error Message : ${err.message} Error Status : ${err.status}`;
        }
        return throwError(() => Error(errMsg));
      })
    );
  }
}
