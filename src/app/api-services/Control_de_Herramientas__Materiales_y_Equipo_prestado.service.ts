import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Control_de_Herramientas__Materiales_y_Equipo_prestado } from '../models/Control_de_Herramientas__Materiales_y_Equipo_prestado';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Control_de_Herramientas__Materiales_y_Equipo_prestadoService extends AbstractDataProviderService<Control_de_Herramientas__Materiales_y_Equipo_prestado> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Control_de_Herramientas__Materiales_y_Equipo_prestado', http, localStorageHelper, _HelperService  , appConfig);
  }
}

