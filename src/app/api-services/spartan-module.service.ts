import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, APP_CONFIG } from '../app.config';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import * as AppConstants  from '../app-constants';
import { Observable } from 'rxjs';import { HelperService } from 'src/app/api-services/helper.service';
import { SpartanModule } from '../models/spartan-module';

@Injectable({
  providedIn: 'root'
})
export class SpartanModuleService extends AbstractDataProviderService<SpartanModule> {
  
  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, 'spartan_module', http, localStorageHelper, _HelperService  , appConfig);
  }

  /**
   * Builds a set of HTTP headers to send whenever a GET or DELETE request is issued.
   */
   protected buildGetHeaders(): HttpHeaders {
    let getHeaders = new HttpHeaders();
    const user = this.localStorageHelper.getLoggedUserInfo();
    getHeaders = getHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
    return getHeaders;
  }

  GetAllByRole(idRol: number) : Observable<any> {
    return this.http.get(this.baseUrl  + '/GetAllByRole?RoleId=' + idRol, { headers: this.buildGetHeaders() } );
  }
}
