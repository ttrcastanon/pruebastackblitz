import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, APP_CONFIG } from '../app.config';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import * as AppConstants  from '../app-constants';
import { Observable } from 'rxjs';import { HelperService } from 'src/app/api-services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class SpartanUserRuleModuleObjectService extends AbstractDataProviderService<any> {
  
    constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
        super(AppConstants.EndpointNames.WebApi, 'spartan_user_rule_module_object', http, localStorageHelper, _HelperService  , appConfig);
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
    
      GetAllParams(conRelaciones: boolean, where:string, order: string) : Observable<any> {
        return this.http.get(this.baseUrl  + '/GetAll?' + 
            ( where !== '' ? 'Where=' + where : '' ) +
            ( order !== '' ? '&Order=' + order : '' ), 
            { headers: this.buildGetHeaders() } );
      }

      DeleteParams(key:number, spartanUserRole:number) : Observable<any> {
        return this.http.delete(this.baseUrl  + '/Delete?Id=' + key + '&spartanUserRole=' + spartanUserRole, 
        { headers: this.buildGetHeaders() } );
      }


}
