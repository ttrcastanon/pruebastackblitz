﻿import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Tarifas_de_Vuelo_de_Aeronave } from '../models/Tarifas_de_Vuelo_de_Aeronave';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Tarifas_de_Vuelo_de_AeronaveService extends AbstractDataProviderService<Tarifas_de_Vuelo_de_Aeronave> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Tarifas_de_Vuelo_de_Aeronave', http, localStorageHelper, _HelperService  , appConfig);
  }
}

