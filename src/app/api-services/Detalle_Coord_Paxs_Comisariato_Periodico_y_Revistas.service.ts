import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas } from '../models/Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasService extends AbstractDataProviderService<Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas', http, localStorageHelper, _HelperService  , appConfig);
  }
}

