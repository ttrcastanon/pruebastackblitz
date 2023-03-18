import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { Spartan_SettingsPagingModel } from '../models/spartan-settings.model';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpartanSettingsService {

  private readonly API_URL = 'api/spartan_settings/';

  constructor(
    private http: HttpClient,
    protected localStorageHelper: LocalStorageHelper
  ) { }

  /**
   * Builds a set of HTTP headers to send whenever a GET or DELETE request is issued.
   */
  protected buildGetHeaders(): HttpHeaders {
    let getHeaders = new HttpHeaders();
    const user = this.localStorageHelper.getLoggedUserInfo();
    getHeaders = getHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
    return getHeaders;
  }

  /**
   * Builds a set of HTTP headers to send whenever a POST, PUT or PATCH request is issued.
   */
  protected buildPostHeaders(): HttpHeaders {
    const user = this.localStorageHelper.getLoggedUserInfo();
    let postHeaders = new HttpHeaders();
    postHeaders = postHeaders.set('Authorization', 'Bearer ' + user.Token.access_token);
    postHeaders = postHeaders.set('Content-Type', 'application/json');
    return postHeaders;
  }

  /**
   * Obtener todos los registros de Spartan_Settings
   */
  GetAll() {

    return this.http.get<Spartan_SettingsPagingModel>(environment.endpoints.WebApi + this.API_URL + 'GetAll', { headers: this.buildGetHeaders() }).
    pipe(
       map((data: Spartan_SettingsPagingModel) => {
         return data;
       }), 
       catchError( error => {
        //console.log('Settings_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }

  /**
   * Obtener registros filtrados de Spartan_Settings
   * @param startRowIndex 
   * @param maximumRows 
   * @param where 
   * @param order 
   */
  ListaSelAll(startRowIndex: number, maximumRows: number, where: string, order: string) {

    return this.http.get<Spartan_SettingsPagingModel>(
            environment.endpoints.WebApi + this.API_URL + 'ListaSelAll?startRowIndex=' + startRowIndex + '&maximumRows=' + maximumRows + 
            (where !=='' ? "&where=" + where : '') + (order !== '' ? "&order=" + order : ''), 
            { headers: this.buildGetHeaders() }).
    pipe(
       map((data: Spartan_SettingsPagingModel) => {
         //console.log('Settings_Data', data);
         return data;
       }), 
       catchError( error => {
        //console.log('Settings_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }


}
