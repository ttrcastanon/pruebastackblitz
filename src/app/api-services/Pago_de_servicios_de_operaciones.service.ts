import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Pago_de_servicios_de_operaciones } from '../models/Pago_de_servicios_de_operaciones';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Pago_de_servicios_de_operacionesService extends AbstractDataProviderService<Pago_de_servicios_de_operaciones> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Pago_de_servicios_de_operaciones', http, localStorageHelper, _HelperService  , appConfig);
  }
}

