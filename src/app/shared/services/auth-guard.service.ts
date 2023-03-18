import { Injectable } from '@angular/core';

import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot
} from '@angular/router';

import { LoginService } from 'src/app/api-services/login.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  constructor(
    private router: Router,
    private loginService: LoginService,
    private localStorageHelper: LocalStorageHelper) {}

  goToLogin(): void {
    this.localStorageHelper.clearStorage();
    this.router.navigate(['/authentication/signin']);
  }


  async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    const result = await this.loginService.getUserToken().then();
    if (result !== null) {
      return true;
    } else {
      this.goToLogin();
    }
  }
}
