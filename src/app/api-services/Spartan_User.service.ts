import { SpartanFileService } from './spartan-file.service';
import { SpartanUserRoleService } from './spartan-user-role.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Spartan_User } from '../models/Spartan_User';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HelperService } from 'src/app/api-services/helper.service';

@Injectable({
  providedIn: 'root'
})
export class Spartan_UserService extends AbstractDataProviderService<Spartan_User> {

  private readonly API_URL = 'api/spartan_user/';

  constructor(
    protected http: HttpClient,
    protected localStorageHelper: LocalStorageHelper,
    @Inject(APP_CONFIG) appConfig: AppConfig,
    private _roles: SpartanUserRoleService,
    private _files: SpartanFileService, protected _HelperService: HelperService
  ) {
    super(AppConstants.EndpointNames.WebApi, 'api/Spartan_User', http, localStorageHelper, _HelperService, appConfig);
  }

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

  public current() {

    const userInfo = this.localStorageHelper.getLoggedUserInfo();
    return this.getById(userInfo.UserId).pipe(
      switchMap((user: Spartan_User) => this._roles.getById(user.Role).pipe(
        switchMap((role: any) => this._files.urlId(user.Image).pipe(
          map(
            (avatar: string) => {
              user.Role_Spartan_User_Role = role.Description;
              user.ImageUrl = avatar;
              return user;
            }
          )
        )
        )
      )
      ));

  }

  /**
   * Obtener información de usuario
   * @param condicion : Condición WHERE
   */
  public GetUserData(condicion: string) {

    return this.listaSelAll(1, 2, condicion);
    // .pipe(catchError(this.HandleError))
    // .subscribe((result: any) => {      
    //   // this.subject.next(result.Registro_de_Empleados);
    //   if (result.RowCount > 0) {
    //     delete result.Spartan_Users[0]['Password']; //Removiendo la contraseña de la respuesta
    //     return result.Spartan_Users[0];
    //   }
    //   else {
    //     return null;
    //   }

    // });

  }

  /**
   * Establecer contraseña
   * @param userId   : Identificador de Usuario
   * @param userData : Contenedor de información de Usuario
   * @param password : Password a actualizar
   */
  public SetUserPassword(userId: number, userData: any, password: string) {

    var md5 = require('md5');
    const newPassword = md5(password.toLowerCase());
    userData.Password = newPassword;

    //1. Guardar en Spartan_User la contraseña
    //2. Guardar en Spartan_User_Historical_Password
    let Id = 0;
    return this.update(userId, userData);
    // .pipe(catchError(this.HandleError))
    // .subscribe((result: any) => {
    //   console.log('actualizacion_contraseña', result);
    //   Id = result;
    //   console.log('actualizacion_contraseña_ID', Id);
    //   return Id;
    // });

  }

  /**
   * Actualizar información de Usuario
   * @param userId   : Identificador de Usuario
   * @param userData : Contenedor de información de Usuario
   */
  public UpdateUser(userId: number, userData: any) {

    return this.update(userId, userData);

  }

  /**
   * Manejo de Errores
   * @param error
   */
  HandleError(error: HttpErrorResponse) {
    let errorMessage = 'Error desconocido.';
    if (error.error instanceof ErrorEvent) {
      // Client-side errors
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side errors
      errorMessage = `Error Code: ${error.status}\nDescripción: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }

  ListaSelAll(startRowIndex: number, maximumRows: number, where: string = '', order: string = '') {

    return this.http.get<any>(
      environment.endpoints.WebApi + this.API_URL + 'ListaSelAll?startRowIndex=' + startRowIndex + '&maximumRows=' + maximumRows +
      (where !== '' ? "&where=" + where : '') + (order !== '' ? "&order=" + order : ''),
      { headers: this.buildGetHeaders() }).
      pipe(
        map((data: any) => {
          return data;
        }),
        catchError(error => {
          return throwError('Something went wrong!');
        })
      )

  }


}
