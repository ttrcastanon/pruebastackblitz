import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Solicitud_de_partes_materiales_y_herramientas } from '../models/Solicitud_de_partes_materiales_y_herramientas';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Solicitud_de_partes_materiales_y_herramientasService extends AbstractDataProviderService<Solicitud_de_partes_materiales_y_herramientas> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Solicitud_de_partes_materiales_y_herramientas', http, localStorageHelper, _HelperService  , appConfig);
  }
}

