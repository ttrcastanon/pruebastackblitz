import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { Spartan_BR_Scope_Model } from 'src/app/models/business-rules/spartan-br-scope.model';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SpartanBrScopeService {

  private readonly API_URL = 'api/spartan_br_scope/';

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
   * Obtener todos los registros de Spartan_BR_Scope
   */
  GetAll() {

    return this.http.get<Array<Spartan_BR_Scope_Model>>(environment.endpoints.WebApi + this.API_URL + 'GetAll', { headers: this.buildGetHeaders() }).
    pipe(
       map((data: Array<Spartan_BR_Scope_Model>) => {
         return data;
       }), 
       catchError( error => {
        //console.log('Settings_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }

  /**
   * Obtener todos los registros de Spartan_BR_Scope
   */
  GetAllComplete() {

    return this.http.get<Spartan_BR_Scope_Model>(environment.endpoints.WebApi + this.API_URL + 'GetAllComplete', { headers: this.buildGetHeaders() }).
    pipe(
       map((data: Spartan_BR_Scope_Model) => {
         return data;
       }), 
       catchError( error => {
        //console.log('Settings_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }

  /**
   * Obtener registros filtrados de Spartan_BR_Scope
   * @param startRowIndex 
   * @param maximumRows 
   * @param where 
   * @param order 
   */
  ListaSelAll(startRowIndex: number, maximumRows: number, where: string, order: string) {

    return this.http.get<Spartan_BR_Scope_Model>(
            environment.endpoints.WebApi + this.API_URL + 'ListaSelAll?startRowIndex=' + startRowIndex + '&maximumRows=' + maximumRows + 
            (where !=='' ? "&where=" + where : '') + (order !== '' ? "&order=" + order : ''), 
            { headers: this.buildGetHeaders() }).
    pipe(
       map((data: Spartan_BR_Scope_Model) => {
         //console.log('Spartan_BR_Scope', data);
         return data;
       }), 
       catchError( error => {
        //console.log('Spartan_BR_Scope_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }


}