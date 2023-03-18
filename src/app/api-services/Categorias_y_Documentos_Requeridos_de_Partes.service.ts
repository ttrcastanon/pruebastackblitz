import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Categorias_y_Documentos_Requeridos_de_Partes } from '../models/Categorias_y_Documentos_Requeridos_de_Partes';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Categorias_y_Documentos_Requeridos_de_PartesService extends AbstractDataProviderService<Categorias_y_Documentos_Requeridos_de_Partes> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Categorias_y_Documentos_Requeridos_de_Partes', http, localStorageHelper, _HelperService  , appConfig);
  }
}

