import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, APP_CONFIG } from '../app.config';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Observable } from 'rxjs';
import * as AppConstants from '../app-constants';import { HelperService } from 'src/app/api-services/helper.service';
import { UserRuleModule } from '../models/spartan-user-rule-module';

@Injectable({
  providedIn: 'root'
})
export class SpartanUserRuleModuleService extends AbstractDataProviderService<UserRuleModule> {

  
  
  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, 'spartan_user_rule_module', http, localStorageHelper, _HelperService  , appConfig);
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

  deleteRuleModule(idRuleModule: number, idRol){
    return this.http.delete(this.baseUrl  + '/Delete?Id=' + idRuleModule + '&Spartan_User_Role=' + idRol, { headers: this.buildGetHeaders() } );
  }

  selAll(conRelaciones: boolean, where: string, order: string) : Observable<any> {
    return this.http.get(this.baseUrl  + '/GetAll?' + 
    ( where !== '' ? 'Where=' + where : '' ) +
    ( order !== '' ? '&Order=' + order : '' ), 
    { headers: this.buildGetHeaders() } );
  }

  updateOrderModule(oUserRoleModule: UserRuleModule) {
    return this.http.put(this.baseUrl  + '/put?Id=' + oUserRoleModule.User_Rule_Module_Id + '&varSpartan_User_Rule_Module=' + oUserRoleModule, oUserRoleModule, { headers: this.buildPostHeaders() });
  }
}
