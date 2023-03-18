﻿import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Tipos_de_Origen_del_Componente } from '../models/Tipos_de_Origen_del_Componente';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Tipos_de_Origen_del_ComponenteService extends AbstractDataProviderService<Tipos_de_Origen_del_Componente> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Tipos_de_Origen_del_Componente', http, localStorageHelper, _HelperService  , appConfig);
  }
}

