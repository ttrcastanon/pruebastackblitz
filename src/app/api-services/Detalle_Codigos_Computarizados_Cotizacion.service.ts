import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_Codigos_Computarizados_Cotizacion } from '../models/Detalle_Codigos_Computarizados_Cotizacion';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_Codigos_Computarizados_CotizacionService extends AbstractDataProviderService<Detalle_Codigos_Computarizados_Cotizacion> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_Codigos_Computarizados_Cotizacion', http, localStorageHelper, _HelperService  , appConfig);
  }
}

