import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent } from '@angular/common/http';
import { Observable, throwError, interval, of } from 'rxjs';
import { catchError, retryWhen, flatMap } from 'rxjs/operators';
import { Router } from '@angular/router';

import { LoginService } from 'src/app/api-services/login.service';

@Injectable({
  providedIn: 'root'
})
export class SpartaneInterceptorService implements HttpInterceptor {
  constructor(private loginService: LoginService) {
  }
  /**
   * intercept http requests for handle error.
   * If  error is 401 refresh token and Rettry one more time, otherwise I handle the error with catcherror
   * If he returns 401 a second time, throwError
   */
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(request)
      .pipe(catchError(err => this.handleError(request, err, next)));
  }

  public  handleError(request: HttpRequest<any>, err, next: HttpHandler) {
    if (err.status === 401) {
      const token = this.loginService.getUserToken().then( t => {
        if (token == null) {
          return this.loginService.logout();
       } else {
         return next.handle(request);
       }
      },
      catchError(e => {
          return of(this.loginService.logout());
      }));
    } else {
      return throwError(err);
    }
  }
}
