import { Injectable, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { SpartanLanguage } from '../models/spartan-language';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class SpartanLanguageService extends AbstractDataProviderService<SpartanLanguage> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, 'api/Spartan_System_Language', http, localStorageHelper, _HelperService  , appConfig);
  }
 
  getAll(): Observable<SpartanLanguage[]> {
    return this.http.get<SpartanLanguage[]>(this.baseUrl + '/GetAll');
  }
}
