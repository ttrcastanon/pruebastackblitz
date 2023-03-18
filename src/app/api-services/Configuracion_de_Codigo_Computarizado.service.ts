import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Configuracion_de_Codigo_Computarizado } from '../models/Configuracion_de_Codigo_Computarizado';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Configuracion_de_Codigo_ComputarizadoService extends AbstractDataProviderService<Configuracion_de_Codigo_Computarizado> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Configuracion_de_Codigo_Computarizado', http, localStorageHelper, _HelperService  , appConfig);
  }
}

