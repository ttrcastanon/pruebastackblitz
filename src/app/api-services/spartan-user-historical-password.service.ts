import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { SpartanUserHistoricalPasswordModel, SpartanUserHistoricalPasswordPagingModel } from 'src/app/models/spartan-user-historical-password.model';
import { LocalStorageHelper } from '../helpers/local-storage-helper';

@Injectable({
  providedIn: 'root'
})
export class SpartanUserHistoricalPasswordService {

  private readonly API_URL = 'api/spartan_user_historical_password/';

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
   * Obtener historial
   * @param startRowIndex : Generalmente => 1
   * @param maximumRows   : Total de registros a recuperar
   * @param where         : Condición Where
   * @param order         : Condición Order
   */
  ListaSelAll(startRowIndex: number, maximumRows: number, where: string, order: string) {

    return this.http.get<SpartanUserHistoricalPasswordPagingModel>(
            environment.endpoints.WebApi + this.API_URL + 'ListaSelAll?startRowIndex=' + startRowIndex + '&maximumRows=' + maximumRows + 
            (where !=='' ? "&where=" + where : '') + (order !== '' ? "&order=" + order : ''), 
            { headers: this.buildGetHeaders() }).
    pipe(
       map((data: SpartanUserHistoricalPasswordPagingModel) => {
         return data;
       }), 
       catchError( error => {
        //console.log('Historia_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }

  /**
   * Guardando historial
   * @param data : Contenedor de Historial
   */
  Post(data: SpartanUserHistoricalPasswordModel) {

    return this.http.post(environment.endpoints.WebApi + this.API_URL + 'Post/', data, { headers: this.buildPostHeaders() }).
    pipe(
       map(response => {
         //console.log('Historia_Data', response);
         return response;
       }), 
       catchError( error => {
        //console.log('Historia_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

   }


}