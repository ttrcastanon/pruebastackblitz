import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Estatus_Detalle_Servicios_Asociados_Control_Componentes } from '../models/Estatus_Detalle_Servicios_Asociados_Control_Componentes';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Estatus_Detalle_Servicios_Asociados_Control_ComponentesService extends AbstractDataProviderService<Estatus_Detalle_Servicios_Asociados_Control_Componentes> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Estatus_Detalle_Servicios_Asociados_Control_Componentes', http, localStorageHelper, _HelperService  , appConfig);
  }
}

