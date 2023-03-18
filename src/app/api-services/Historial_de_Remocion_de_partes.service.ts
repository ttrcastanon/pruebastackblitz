import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Historial_de_Remocion_de_partes } from '../models/Historial_de_Remocion_de_partes';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Historial_de_Remocion_de_partesService extends AbstractDataProviderService<Historial_de_Remocion_de_partes> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Historial_de_Remocion_de_partes', http, localStorageHelper, _HelperService  , appConfig);
  }
}

