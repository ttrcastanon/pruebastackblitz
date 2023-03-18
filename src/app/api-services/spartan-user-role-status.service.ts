import { SpartanUser } from './../models/spartan-user.model';
import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import * as AppConstants  from '../app-constants';import { HelperService } from 'src/app/api-services/helper.service';
import { UserRoleStatus } from '../models/spartan-user-role-.status';

@Injectable({
  providedIn: 'root'
})
export class SpartanUserRoleStatusService extends AbstractDataProviderService<UserRoleStatus> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, 'Spartan_User_Role_Status', http, localStorageHelper, _HelperService  , appConfig);
  }

}