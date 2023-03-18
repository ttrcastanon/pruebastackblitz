import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Estatus_de_Orden_de_Trabajo } from '../models/Estatus_de_Orden_de_Trabajo';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Estatus_de_Orden_de_TrabajoService extends AbstractDataProviderService<Estatus_de_Orden_de_Trabajo> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Estatus_de_Orden_de_Trabajo', http, localStorageHelper, _HelperService  , appConfig);
  }
}

