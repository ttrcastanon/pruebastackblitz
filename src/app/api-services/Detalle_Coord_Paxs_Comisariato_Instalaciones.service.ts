import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_Coord_Paxs_Comisariato_Instalaciones } from '../models/Detalle_Coord_Paxs_Comisariato_Instalaciones';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_Coord_Paxs_Comisariato_InstalacionesService extends AbstractDataProviderService<Detalle_Coord_Paxs_Comisariato_Instalaciones> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_Coord_Paxs_Comisariato_Instalaciones', http, localStorageHelper, _HelperService  , appConfig);
  }
}

