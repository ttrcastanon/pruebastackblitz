import { SpartanFileService } from './spartan-file.service';
import { SpartanUserRoleService } from './spartan-user-role.service';
import { catchError, map, switchMap } from 'rxjs/operators';
import { SpartanUser } from './../models/spartan-user.model';
import { Injectable, Inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { AppConfig, APP_CONFIG } from '../app.config';
import * as AppConstants from '../app-constants';
import { AbstractDataProviderService } from './abstract-data-provider.service';
import { LocalStorageHelper } from '../helpers/local-storage-helper';
import { of, throwError } from 'rxjs';
import { LoggedUser, Spartan_User } from '../models/logged-user';
import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class SpartanUserHistoricalPasswordService extends AbstractDataProviderService<SpartanUser> {

  constructor(
    protected http: HttpClient, 
    protected localStorageHelper: LocalStorageHelper,  
    @Inject(APP_CONFIG) appConfig: AppConfig,
    private _roles: SpartanUserRoleService,
    private _files: SpartanFileService,protected _HelperService: HelperService,
    private loginService: LoginService
  ) {
    super(AppConstants.EndpointNames.WebApi, 'api/spartan_user', http, localStorageHelper, _HelperService  , appConfig);
  }

  public current() {

    const userInfo = this.localStorageHelper.getLoggedUserInfo();    
    return this.getById(userInfo.UserId).pipe(
      switchMap((user:SpartanUser)=>this._roles.getById(user.Role).pipe(
        switchMap((role:any)=>this._files.urlId(user.Image).pipe(
          map(
            (avatar:string)=>{
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
   * Obtener información de usuario por su Correo
   * @param condicion : Dirección de correo
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

  public GetUserHistoricalPasswordData(condicion: string) {

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
   * @param userName : Nombre de Usuario
   */
  public SetUserPassword(userId: number, userData: any, password: string) {

    
    var md5 = require('md5');
    const newPassword = md5(password).toLowerCase();
    userData.Password = newPassword;

    //1. Guardar en Spartan_User la contraseña
    //2. Guardar en Spartan_User_Historical_Password
    let Id = 0;
    return this.update(userId, userData);
    // .pipe(catchError(this.HandleError))
    // .subscribe((result: any) => {
    //   //console.log('actualizacion_contraseña', result);
    //   Id = result;
    //   //console.log('actualizacion_contraseña_ID', Id);
    //   return Id;
    // });

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

  
}
