import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_de_Herramientas_y_Equipo_Prestado } from '../models/Detalle_de_Herramientas_y_Equipo_Prestado';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_de_Herramientas_y_Equipo_PrestadoService extends AbstractDataProviderService<Detalle_de_Herramientas_y_Equipo_Prestado> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_de_Herramientas_y_Equipo_Prestado', http, localStorageHelper, _HelperService  , appConfig);
  }
}

