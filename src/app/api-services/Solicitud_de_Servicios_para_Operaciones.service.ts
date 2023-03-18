﻿import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Solicitud_de_Servicios_para_Operaciones } from '../models/Solicitud_de_Servicios_para_Operaciones';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Solicitud_de_Servicios_para_OperacionesService extends AbstractDataProviderService<Solicitud_de_Servicios_para_Operaciones> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Solicitud_de_Servicios_para_Operaciones', http, localStorageHelper, _HelperService  , appConfig);
  }
}

