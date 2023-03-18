import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_Tabla_de_Control_de_Componentes } from '../models/Detalle_Tabla_de_Control_de_Componentes';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_Tabla_de_Control_de_ComponentesService extends AbstractDataProviderService<Detalle_Tabla_de_Control_de_Componentes> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_Tabla_de_Control_de_Componentes', http, localStorageHelper, _HelperService  , appConfig);
  }
}

