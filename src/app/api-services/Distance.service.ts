import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { Observable } from 'rxjs';
import { LocalStorageHelper } from '../helpers/local-storage-helper';import { HelperService } from 'src/app/api-services/helper.service';
@Injectable({
    providedIn: 'root'
})
export class DistanceService{
    baseUrl: string;

    constructor(
        endpointName: string,
        protected uriSection: string,
        protected http: HttpClient,
        protected localStorageHelper: LocalStorageHelper,
        @Inject(APP_CONFIG) protected appConfig?: AppConfig
    ) {
        //super(AppConstants.EndpointNames.WebApi, '/api/Distance', http, localStorageHelper, _HelperService  , appConfig);

        if (this.appConfig !== null && this.appConfig !== undefined) {
            if (endpointName in this.appConfig.endpoints) {
                const endpoint = this.appConfig.endpoints[endpointName];
                this.baseUrl = endpoint + this.uriSection;
            } else {
                console.error('Invalid endpoint name passed to data provider.');
            }
        } else {
            console.error('A reference to an instance of AppConfig was not injected into this service.');
        }
    }


    protected buildGetHeaders(): HttpHeaders {
        let getHeaders = new HttpHeaders();
        const user = this.localStorageHelper.getLoggedUserInfo();
        getHeaders = getHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
        return getHeaders;
    }

    getDistance(OLT: any, OLG: any, DLT: any, DLG: any): Observable<any[]> {

        let route = this.baseUrl + 'Distance/getDistance' +
            (OLT.ToString() + "&OLG=" + OLG.ToString() + "&DLT=" + DLT.ToString() + "&DLG=" + DLG.ToString()).replace(",", ".")

        return this.http.get<any[]>(route,
            { headers: this.buildGetHeaders() });
    }

}

