import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Impresion_de_Bitacora_de_Vuelo } from '../models/Impresion_de_Bitacora_de_Vuelo';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Impresion_de_Bitacora_de_VueloService extends AbstractDataProviderService<Impresion_de_Bitacora_de_Vuelo> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Impresion_de_Bitacora_de_Vuelo', http, localStorageHelper, _HelperService  , appConfig);
  }
}

