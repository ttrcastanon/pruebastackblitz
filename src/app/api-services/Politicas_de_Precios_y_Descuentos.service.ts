import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Politicas_de_Precios_y_Descuentos } from '../models/Politicas_de_Precios_y_Descuentos';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Politicas_de_Precios_y_DescuentosService extends AbstractDataProviderService<Politicas_de_Precios_y_Descuentos> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Politicas_de_Precios_y_Descuentos', http, localStorageHelper, _HelperService  , appConfig);
  }
}

