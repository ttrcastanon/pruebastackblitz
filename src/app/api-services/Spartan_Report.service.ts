import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
//import { Actividades_de_los_Colaboradores } from '../models/Actividades_de_los_Colaboradores';


@Injectable({
  providedIn: 'root'
})
export class Spartan_ReportService extends AbstractDataProviderService<any> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService, @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, '/api/Spartan_Report', http, localStorageHelper, _HelperService  , appConfig);
  }
}

