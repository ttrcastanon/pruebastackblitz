import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Gestion_de_aprobacion_de_mantenimiento } from '../models/Gestion_de_aprobacion_de_mantenimiento';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Gestion_de_aprobacion_de_mantenimientoService extends AbstractDataProviderService<Gestion_de_aprobacion_de_mantenimiento> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Gestion_de_aprobacion_de_mantenimiento', http, localStorageHelper, _HelperService  , appConfig);
  }
}

