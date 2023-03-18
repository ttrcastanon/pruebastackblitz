import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Concepto_de_Gasto_de_Empleado } from '../models/Concepto_de_Gasto_de_Empleado';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Concepto_de_Gasto_de_EmpleadoService extends AbstractDataProviderService<Concepto_de_Gasto_de_Empleado> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Concepto_de_Gasto_de_Empleado', http, localStorageHelper, _HelperService  , appConfig);
  }
}

