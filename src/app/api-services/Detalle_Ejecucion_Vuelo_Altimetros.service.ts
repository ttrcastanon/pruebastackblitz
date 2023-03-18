import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_Ejecucion_Vuelo_Altimetros } from '../models/Detalle_Ejecucion_Vuelo_Altimetros';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_Ejecucion_Vuelo_AltimetrosService extends AbstractDataProviderService<Detalle_Ejecucion_Vuelo_Altimetros> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_Ejecucion_Vuelo_Altimetros', http, localStorageHelper, _HelperService  , appConfig);
  }
}

