import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { detalle_de_configuracion_de_proveedores } from '../models/detalle_de_configuracion_de_proveedores';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class detalle_de_configuracion_de_proveedoresService extends AbstractDataProviderService<detalle_de_configuracion_de_proveedores> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/detalle_de_configuracion_de_proveedores', http, localStorageHelper, _HelperService  , appConfig);
  }
}

