import { HttpClient } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { AppConfig, APP_CONFIG } from '../app.config';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import * as AppConstants from '../app-constants';
import { Observable } from 'rxjs';
import { HelperService } from 'src/app/api-services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class GeneralService extends AbstractDataProviderService<any> {

  constructor(protected http: HttpClient, protected localStorageHelper: LocalStorageHelper,  protected _HelperService: HelperService,  @Inject(APP_CONFIG) appConfig: AppConfig) {
    super(AppConstants.EndpointNames.WebApi, 'api/Spartan_Query', http, localStorageHelper, _HelperService  , appConfig);
  }

  getTable(query: string): Observable<any[]> {
    return this.http.get<any[]>(this.baseUrl + '/GetTable?query=' + query);
  }
}
