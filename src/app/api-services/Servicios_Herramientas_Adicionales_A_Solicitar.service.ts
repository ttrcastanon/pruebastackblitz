import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Servicios_Herramientas_Adicionales_A_Solicitar } from '../models/Servicios_Herramientas_Adicionales_A_Solicitar';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Servicios_Herramientas_Adicionales_A_SolicitarService extends AbstractDataProviderService<Servicios_Herramientas_Adicionales_A_Solicitar> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Servicios_Herramientas_Adicionales_A_Solicitar', http, localStorageHelper, _HelperService  , appConfig);
  }
}

