import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Toma_de_Tiempos_a_aeronaves } from '../models/Toma_de_Tiempos_a_aeronaves';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Toma_de_Tiempos_a_aeronavesService extends AbstractDataProviderService<Toma_de_Tiempos_a_aeronaves> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Toma_de_Tiempos_a_aeronaves', http, localStorageHelper, _HelperService  , appConfig);
  }
}

