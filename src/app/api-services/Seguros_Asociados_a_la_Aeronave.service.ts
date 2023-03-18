import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Seguros_Asociados_a_la_Aeronave } from '../models/Seguros_Asociados_a_la_Aeronave';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Seguros_Asociados_a_la_AeronaveService extends AbstractDataProviderService<Seguros_Asociados_a_la_Aeronave> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Seguros_Asociados_a_la_Aeronave', http, localStorageHelper, _HelperService  , appConfig);
  }
}

