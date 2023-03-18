import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_Solicitud_de_Partes_Crear_reporte } from '../models/Detalle_Solicitud_de_Partes_Crear_reporte';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_Solicitud_de_Partes_Crear_reporteService extends AbstractDataProviderService<Detalle_Solicitud_de_Partes_Crear_reporte> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_Solicitud_de_Partes_Crear_reporte', http, localStorageHelper, _HelperService  , appConfig);
  }
}

