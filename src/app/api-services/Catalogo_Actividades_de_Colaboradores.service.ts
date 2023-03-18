import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Catalogo_Actividades_de_Colaboradores } from '../models/Catalogo_Actividades_de_Colaboradores';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Catalogo_Actividades_de_ColaboradoresService extends AbstractDataProviderService<Catalogo_Actividades_de_Colaboradores> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Catalogo_Actividades_de_Colaboradores', http, localStorageHelper, _HelperService  , appConfig);
  }
}

