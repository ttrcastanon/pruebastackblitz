import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { environment } from 'src/environments/environment';
import { throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HelperService {

  private readonly API_URL = 'api/Spartan_User/';

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
   * Plantilla de reseteo de contraseña
   * @param name     : Nombre de usuario
   * @param username : User name
   * @param password : Nuevo password
   */
  GetTemplateForResetPassword(name: string, username: string, password: string): string {
    let template: string;
    
    template =  "<p style='font-size: 1.5em; text-align: center;'><strong>Proceso de Recuperación de Contraseña</strong></p>";
    template += "<br />";
    template += "<br />";
    template += "<p>Estimado(a) <strong>" + name + "</strong>.</p>";
    template += "<br />";
    template += "<p>Hemos recibido una solicitud para recuperar su contraseña. A continuación le proporcionaremos una contraseña temporal para que ingrese al sistema. Una vez ingresando al sistema usted puede cambiar su contraseña</p>";
    template += "<br />";
    template += "<table style='width: 300px;'>";
    template += "   <tbody>";
    template += "      <tr>";
    template += "         <td style='width: 72px;'><strong>Clave de Acceso:</strong></td>";
    template += "         <td style='width: 131px;'>" + username + "</td>";
    template += "      </tr>";
    template += "      <tr>";
    template += "         <td style='width: 72px;'><strong>Contraseña:</strong></td>";
    template += "         <td style='width: 131px;'>" + password + "</td>";
    template += "      </tr>";
    template += "   </tbody>";
    template += "</table>";
    template += "<br />";
    template += "<br />";
    template += "<br />";
    template += "<p>* Favor de no responder este mensaje.</p>";

    return template;
  }

  /**
   * Envío de correos
   * @param ToEmails : Lista de correos, separados por (;)
   * @param Subject  : Asunto
   * @param Body     : Cuerpo
   */
  SendEmail(ToEmails: string, Subject: string, Body: string) {

    return this.http.get<any>(environment.endpoints.WebApi + this.API_URL + 'EnviarCorreoAzure?email=' + ToEmails + '&Subject=' + Subject + '&Body=' + Body, { headers: this.buildPostHeaders() }).
    pipe(
       map((data: any) => {
         return data;
       }), 
       catchError( error => {
         //console.log('SendEmail_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }

  /**
   * Envío de correos Post
   * @param ToEmails : Lista de correos, separados por (;)
   * @param Subject  : Asunto
   * @param Body     : Cuerpo
   */
  SendEmailAngular(ToEmails: string, Subject: string, Body: string) {

    let object = {
      ToEmail: [],
      Subject: Subject,
      Body: Body,
      pathAttachments: null,
      From: ''
    }

    let data = ToEmails.split(';');
    data.forEach(element =>{ object.ToEmail.push(element)});
    console.log(object);
    return this.http.post<any>(environment.endpoints.WebApi + this.API_URL + 'SendEmailFromAngularApp', object, { headers: this.buildPostHeaders() }).
    pipe(
       map((data: any) => {
         return data;
       }), 
       catchError( error => {
         //console.log('SendEmail_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }
  

  /**
   * Envío de correos
   * @param ToEmails : Lista de correos, separados por (;)
   * @param Subject  : Asunto
   * @param Body     : Cuerpo
   * @param file     : Archivos adjuntos
   */
   SendEmailFile(ToEmails: string, Subject: string, Body: string, file: string = null) {

    return this.http.get<any>(this.API_URL + 'SendEmail?ToEmail=' + ToEmails + '&Subject=' + Subject + '&Body=' + Body + '&File=' + file, { headers: this.buildGetHeaders() }).
    pipe(
       map((data: any) => {
         return data;
       }), 
       catchError( error => {
         console.log('SendEmail_Error', error);
         return throwError( 'Something went wrong!' );
       })
    )

  }


}
