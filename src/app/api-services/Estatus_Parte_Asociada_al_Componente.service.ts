import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Estatus_Parte_Asociada_al_Componente } from '../models/Estatus_Parte_Asociada_al_Componente';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
  providedIn: 'root'
})
export class Estatus_Parte_Asociada_al_ComponenteService extends AbstractDataProviderService<Estatus_Parte_Asociada_al_Componente> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Estatus_Parte_Asociada_al_Componente', http, localStorageHelper, _HelperService  , appConfig);
  }
}

