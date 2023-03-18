import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { SpartanFormatPermissionsModel, SpartanFormatPermissionsPagingModel } from '../models/spartan-format-permissions.model';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpartanFormatPermissionsService {

  private readonly API_URL = 'api/spartan_format_permissions/';

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
   * Obtener listado de Permisos de Formatos
   * @param startRowIndex : Generalmente => 1
   * @param maximumRows   : Total de registros a recuperar
   * @param where         : Condición Where
   * @param order         : Condición Order
   */
  ListaSelAll(startRowIndex: number, maximumRows: number, where: string, order: string) {

    return this.http.get<SpartanFormatPermissionsPagingModel>(
            environment.endpoints.WebApi + this.API_URL + 'ListaSelAll?startRowIndex=' + startRowIndex + '&maximumRows=' + maximumRows + 
            (where !=='' ? "&where=" + where : '') + (order !== '' ? "&order=" + order : ''), 
            { headers: this.buildGetHeaders() }).
    pipe(
       map((data: SpartanFormatPermissionsPagingModel) => {
         return data;
       }), 
       catchError( error => {
        //console.log('Formatos_Permisos_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )
  }


}