import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Control_de_Calibracion_de_Equipo_y_Herramienta } from '../models/Control_de_Calibracion_de_Equipo_y_Herramienta';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Control_de_Calibracion_de_Equipo_y_HerramientaService extends AbstractDataProviderService<Control_de_Calibracion_de_Equipo_y_Herramienta> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Control_de_Calibracion_de_Equipo_y_Herramienta', http, localStorageHelper, _HelperService  , appConfig);
  }
}

