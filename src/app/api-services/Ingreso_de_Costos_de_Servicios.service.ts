import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Ingreso_de_Costos_de_Servicios } from '../models/Ingreso_de_Costos_de_Servicios';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Ingreso_de_Costos_de_ServiciosService extends AbstractDataProviderService<Ingreso_de_Costos_de_Servicios> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Ingreso_de_Costos_de_Servicios', http, localStorageHelper, _HelperService  , appConfig);
  }
}

