import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Facturacion_de_vuelos_por_tramo } from '../models/Facturacion_de_vuelos_por_tramo';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Facturacion_de_vuelos_por_tramoService extends AbstractDataProviderService<Facturacion_de_vuelos_por_tramo> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Facturacion_de_vuelos_por_tramo', http, localStorageHelper, _HelperService  , appConfig);
  }
}

