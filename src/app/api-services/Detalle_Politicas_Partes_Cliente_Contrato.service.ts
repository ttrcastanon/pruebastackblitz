﻿import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_Politicas_Partes_Cliente_Contrato } from '../models/Detalle_Politicas_Partes_Cliente_Contrato';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_Politicas_Partes_Cliente_ContratoService extends AbstractDataProviderService<Detalle_Politicas_Partes_Cliente_Contrato> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_Politicas_Partes_Cliente_Contrato', http, localStorageHelper, _HelperService  , appConfig);
  }
}

