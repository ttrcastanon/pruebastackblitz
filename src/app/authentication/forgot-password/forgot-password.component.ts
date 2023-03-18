import { Component, Inject, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoggedUser, Spartan_User } from 'src/app/models/logged-user';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { catchError, finalize } from 'rxjs/operators';
import { Observable, of, throwError } from 'rxjs';
import { LoginService } from 'src/app/api-services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import * as AppConstants from 'src/app/app-constants';
import { SpartanUserHistoricalPasswordService } from 'src/app/api-services/spartan-user-historical-password.service';
import { SpartanUserHistoricalPasswordModel, SpartanUserHistoricalPasswordPagingModel } from 'src/app/models/spartan-user-historical-password.model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HelperService } from 'src/app/api-services/helper.service';


@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})

/**
 * Reset Contraseña
 */
export class ForgotPasswordComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  md5 = require('md5');
  ReverseMd5 = require('reverse-md5')
  reverse = this.ReverseMd5({
    lettersUpper: false,
    lettersLower: true,
    numbers: true,
    special: false,
    whitespace: true,
    maxLen: 50
  });

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private userService: SpartanUserService,
    private userHistoricalPasswordService: SpartanUserHistoricalPasswordService,
    private helperService: HelperService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: [ null, [ Validators.required, Validators.email ]]
    });
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  // get f() {
  //   return this.loginForm.controls;
  // }

  onSubmit() {
    this.submitted = true;
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else { 
      const email = this.loginForm.controls.email.value;
      const userData: LoggedUser = new LoggedUser();
      // userData.UserId = 9;
      userData.Email = email;
      userData.UserName = null;

      if (email != null) {
        //Obteniendo Token
        this.loginService.getToken(userData.UserName, null)
        .pipe(catchError(this.HandleError))
        .subscribe(token => {
          if (token != null && token !== undefined) {
            //Guardando Token
            this.loginService.setTokenToUser(userData, token);
            //Buscando información a través de Email
            this.userService.GetUserData("Email = '" + this.loginForm.controls.email.value + "'")
            .pipe(catchError(this.HandleError))
            .subscribe((result: any) => { 
              if (result.RowCount > 0) {
                var data: Spartan_User = result.Spartan_Users[0];
                delete data['Password']; //Removiendo la contraseña de la respuesta
                if (data?.Id_User > 0) {
                  //Actualizando contraseña
                  const newPassword = AppConstants.AppSettings.stringPasswordDefault;
                  this.userService.SetUserPassword(data.Id_User, data, newPassword.toLowerCase())
                  .pipe(catchError(this.HandleError))
                  .subscribe((response: any) => { 
                    if (response == 0) {
                      //Guardar historial
                      let historicalData: SpartanUserHistoricalPasswordModel = new SpartanUserHistoricalPasswordModel();
                      historicalData.Fecha_de_Registro = new Date();
                      var md5 = require('md5');
                      historicalData.Password = md5(newPassword.toLowerCase());
                      historicalData.Usuario = data.Id_User
                      this.userHistoricalPasswordService.Post(historicalData)
                      .subscribe((response: any) => {
                        //Enviando correo
                        const body = this.helperService.GetTemplateForResetPassword(data.Name, data.Username, newPassword);
                        this.helperService.SendEmail(data.Email, 'Recuperación de Contraseña', body)
                        .subscribe((response: any) => {
                          //console.log('Correo enviado', response);
                        });
                        //Redireccionando al Login
                        this.ShowNotify('Contraseña reiniciada. Se ha enviado un correo con su nueva contraseña.', 'success');
                        this.router.navigate(['/authentication/signin']);
                      });
                    }
                  }, error => {

                  });
                }
              }
              else {
                this.ShowNotify('Dirección de correo no encontrada', 'info');
              }
            }, error => {

            });
          }
        }, error => {

        });
      }
      // this.router.navigate(['/dashboard/main']);
    }
  }

  /**
   * Mostrar notificación
   */
  ShowNotify(message: string, type: string) {

    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: type
    });

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
    this.ShowNotify(errorMessage, 'error');
    return throwError(errorMessage);
  }

}