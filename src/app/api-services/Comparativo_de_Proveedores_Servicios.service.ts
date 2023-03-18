import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Comparativo_de_Proveedores_Servicios } from '../models/Comparativo_de_Proveedores_Servicios';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Comparativo_de_Proveedores_ServiciosService extends AbstractDataProviderService<Comparativo_de_Proveedores_Servicios> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Comparativo_de_Proveedores_Servicios', http, localStorageHelper, _HelperService  , appConfig);
  }
}

