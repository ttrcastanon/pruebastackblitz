import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Listado_de_compras_en_proceso_de_Importacion } from '../models/Listado_de_compras_en_proceso_de_Importacion';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Listado_de_compras_en_proceso_de_ImportacionService extends AbstractDataProviderService<Listado_de_compras_en_proceso_de_Importacion> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Listado_de_compras_en_proceso_de_Importacion', http, localStorageHelper, _HelperService  , appConfig);
  }
}

