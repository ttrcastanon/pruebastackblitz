import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Ayuda_de_respuesta_crear_reporte } from '../models/Ayuda_de_respuesta_crear_reporte';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Ayuda_de_respuesta_crear_reporteService extends AbstractDataProviderService<Ayuda_de_respuesta_crear_reporte> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Ayuda_de_respuesta_crear_reporte', http, localStorageHelper, _HelperService  , appConfig);
  }
}

