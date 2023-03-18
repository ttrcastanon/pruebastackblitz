import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Tipo_de_Concepto_Balance_General } from '../models/Tipo_de_Concepto_Balance_General';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Tipo_de_Concepto_Balance_GeneralService extends AbstractDataProviderService<Tipo_de_Concepto_Balance_General> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Tipo_de_Concepto_Balance_General', http, localStorageHelper, _HelperService  , appConfig);
  }
}

