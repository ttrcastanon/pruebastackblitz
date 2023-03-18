import { EventEmitter, Inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Router } from '@angular/router';
import { LoggedUser, Token } from '../models/logged-user';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class LoginService {

  constructor(private http: HttpClient,
    private router: Router,
    protected localStorageHelper: LocalStorageHelper) {
  }


  login(usuario: string, password: string) {
    return this.http.post(environment.endpoints.WebApi + 'api/Spartan_SecurityAccount/Login',
      { usuario, password })
      .pipe(map(((user: LoggedUser) => {
        return user;
      })));
  }

  logout() {
    // remove user from local storage to log user out
    this.localStorageHelper.clearStorage();
    this.router.navigate(['/authentication/signin']);
  }

  refreshToken(refreshToken: string): Promise<any> {
    let getHeaders = new HttpHeaders();
    getHeaders = getHeaders.set('Authorization', 'Bearer ' + refreshToken);
    return this.http.get<any>(environment.endpoints.WebApi + 'api/Token/RefeshTokenMain',
      { headers: getHeaders }).toPromise();
  }

  getToken(username: string, password: string) {
    const requestPayload = "userName=" + encodeURIComponent('admin') + "&password=" + encodeURIComponent('admin') + "&grant_type=password";
    let getHeaders = new HttpHeaders();
    getHeaders = getHeaders.set('content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<Token>(environment.endpoints.WebApi + 'oauth/token',
      requestPayload, { headers: getHeaders });
  }

  async getUserToken(): Promise<string> {
    const userData = this.localStorageHelper.getLoggedUserInfo();
    if (userData != null && userData.Token !== null) {
      localStorage.setItem("access_token",userData.Token.access_token);
      const now = new Date();
      if (userData.Token !== undefined && userData.Token !== null) {
        const expiryDate: number = Date.parse(userData.Token.dateExpire.toString());
        const nowSeconds = new Date().getTime();
        const diff = expiryDate - nowSeconds;
        if (diff > 0 && diff <= 25000) {
          await (this.getToken("admin", "admin").toPromise().then(_ => {
            this.setTokenToUser(userData, userData.Token);
            return userData.Token.access_token;
          }, err => {
            if (err.status === 401) {
              return null;
            }
          }));
        }
        else if (diff < 0 && diff >= -50000) {
          await (this.getToken("admin", "admin").toPromise().then(t => {
            this.setTokenToUser(userData, t);
            return userData.Token.access_token;
          }));
        }
        else if (diff > 0 && diff > 25000) {
          return userData.Token.access_token;
        }
      } else {
        return null;
      }
    }
    return null;
  }

  setTokenToUser(userData: LoggedUser, t: Token) {
    const now = new Date();
    const dateExpire = new Date((now.getTime() + (t.expires_in * 1000)));
    userData.Token = t;
    userData.Token.dateExpire = dateExpire;
    this.localStorageHelper.setLoggedUserInfo(userData);
  }

}
