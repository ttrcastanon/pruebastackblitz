import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { SpartanFormatModel, SpartanFormatPagingModel } from '../models/spartan-format.model';
import { environment } from 'src/environments/environment';
import { catchError, map } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpartanFormatService {

  private readonly API_URL = 'api/spartan_format/';

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
   * Obtener listado de Formatos
   * @param startRowIndex : Generalmente => 1
   * @param maximumRows   : Total de registros a recuperar
   * @param where         : Condición Where
   * @param order         : Condición Order
   */
  ListaSelAll(startRowIndex: number, maximumRows: number, where: string, order: string) {

    return this.http.get<SpartanFormatPagingModel>(
            environment.endpoints.WebApi + this.API_URL + 'ListaSelAll?startRowIndex=' + startRowIndex + '&maximumRows=' + maximumRows +
            (where !=='' ? "&where=" + where : '') + (order !== '' ? "&order=" + order : ''),
            { headers: this.buildGetHeaders() }).
    pipe(
       map((data: SpartanFormatPagingModel) => {
         return data;
       }),
       catchError( error => {
        //console.log('Formatos_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )
  }

  /**
   * Formatos demo
   */
  GetDummySpartanFormat(): Observable<SpartanFormatModel[]> {
    let APIURL = 'assets/data/totaltech/spartan-format.json';
    return this.http.get<SpartanFormatModel[]>(APIURL)
        .pipe(
            catchError(this.errorHandler)
        );
  }

  errorHandler(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
    } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    //console.log(errorMessage);
    return throwError(errorMessage);
}

openFortmat(id:number)
{

  window.open("http://192.99.89.90/imagenes/jauja_background.jpg");

}



}
