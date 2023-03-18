import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Boletines_Directivas_aeronavegatibilidad } from '../models/Boletines_Directivas_aeronavegatibilidad';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Boletines_Directivas_aeronavegatibilidadService extends AbstractDataProviderService<Boletines_Directivas_aeronavegatibilidad> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Boletines_Directivas_aeronavegatibilidad', http, localStorageHelper, _HelperService  , appConfig);
  }
}

