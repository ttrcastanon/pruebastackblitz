import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion } from '../models/Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionService extends AbstractDataProviderService<Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion', http, localStorageHelper, _HelperService  , appConfig);
  }
}

