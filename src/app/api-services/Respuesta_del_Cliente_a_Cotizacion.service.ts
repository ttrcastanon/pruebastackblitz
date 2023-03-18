import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Respuesta_del_Cliente_a_Cotizacion } from '../models/Respuesta_del_Cliente_a_Cotizacion';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Respuesta_del_Cliente_a_CotizacionService extends AbstractDataProviderService<Respuesta_del_Cliente_a_Cotizacion> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Respuesta_del_Cliente_a_Cotizacion', http, localStorageHelper, _HelperService  , appConfig);
  }
}

