import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Configuracion_de_Politicas_de_Viaticos } from '../models/Configuracion_de_Politicas_de_Viaticos';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Configuracion_de_Politicas_de_ViaticosService extends AbstractDataProviderService<Configuracion_de_Politicas_de_Viaticos> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Configuracion_de_Politicas_de_Viaticos', http, localStorageHelper, _HelperService  , appConfig);
  }
}

