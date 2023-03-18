import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones } from '../models/Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesService extends AbstractDataProviderService<Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones', http, localStorageHelper, _HelperService  , appConfig);
  }
}

