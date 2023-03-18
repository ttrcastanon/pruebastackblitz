import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Catalogo_Tipo_de_Vencimiento } from '../models/Catalogo_Tipo_de_Vencimiento';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Catalogo_Tipo_de_VencimientoService extends AbstractDataProviderService<Catalogo_Tipo_de_Vencimiento> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Catalogo_Tipo_de_Vencimiento', http, localStorageHelper, _HelperService  , appConfig);
  }
}

