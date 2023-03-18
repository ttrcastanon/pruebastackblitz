import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Coord__de_Vuelo__Tripulacion } from '../models/Coord__de_Vuelo__Tripulacion';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Coord__de_Vuelo__TripulacionService extends AbstractDataProviderService<Coord__de_Vuelo__Tripulacion> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Coord__de_Vuelo__Tripulacion', http, localStorageHelper, _HelperService  , appConfig);
  }
}

