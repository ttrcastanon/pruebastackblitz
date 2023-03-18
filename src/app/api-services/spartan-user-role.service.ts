import { SpartanUser } from './../models/spartan-user.model';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import * as AppConstants  from '../app-constants';import { HelperService } from 'src/app/api-services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class SpartanUserRoleService extends AbstractDataProviderService<SpartanUser> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, 'api/spartan_user_role', http, localStorageHelper, _HelperService  , appConfig);
  }

}