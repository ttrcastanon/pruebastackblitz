import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Spartan_Record_Detail_Management } from '../models/Spartan_Record_Detail_Management';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Spartan_Record_Detail_ManagementService extends AbstractDataProviderService<Spartan_Record_Detail_Management> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Spartan_Record_Detail_Management', http, localStorageHelper, _HelperService  , appConfig);
  }

  // // Arma todos los encabezados para el header
  // protected buildGetHeaders(): HttpHeaders {
  //   let getHeaders = new HttpHeaders();
  //   const user = this.localStorageHelper.getLoggedUserInfo();
  //   getHeaders = getHeaders.set('Authorization', 'Bearer ' + user.Token);
  //   return getHeaders;
  // }

   /**
   * Builds a set of HTTP headers to send whenever a GET or DELETE request is issued.
   */
    protected buildGetHeaders(): HttpHeaders {
      let getHeaders = new HttpHeaders();
      const user = this.localStorageHelper.getLoggedUserInfo();
      getHeaders = getHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
      return getHeaders;
    }
  
  
    /**
     * Builds a set of HTTP headers to send whenever a POST, PUT or PATCH request is issued.
     */
    protected buildPostHeaders(): HttpHeaders {
      const user = this.localStorageHelper.getLoggedUserInfo();
      let postHeaders = new HttpHeaders();
      postHeaders = postHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
      postHeaders = postHeaders.set('Content-Type', 'application/json');
      return postHeaders;
    }
  
  //ocgf
  GetByKey(id: number): Observable<any> {

    let webapi = AppConstants.EndpointNames.WebApi;
    let base = `${this.baseUrl}/Get?Id=2`;
    //let url = 'http://localhost:9018/api/Spartan_Record_Detail_Management/Get?Id=2';
    //AppConstants.EndpointNames.WebApi
    return this.http.get<any>(base, { headers: this.buildGetHeaders() });
  }
  
}

