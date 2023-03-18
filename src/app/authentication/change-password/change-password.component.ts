import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { LoginService } from 'src/app/api-services/login.service';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { LoggedUser, Spartan_User } from 'src/app/models/logged-user';
import { SpartanUserHistoricalPasswordService } from 'src/app/api-services/spartan-user-historical-password.service';
import { SpartanUserHistoricalPasswordModel, SpartanUserHistoricalPasswordPagingModel } from 'src/app/models/spartan-user-historical-password.model';

import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.sass']
})

export class ChangePasswordComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  md5 = require('md5');

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private loginService: LoginService,
    private userService: SpartanUserService,
    private userHistoricalPasswordService: SpartanUserHistoricalPasswordService,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
          
    this.loginForm = this.formBuilder.group({
      // email: [ null, 
      //         [
      //           Validators.required, 
      //           Validators.pattern(/^[\W]*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4}[\W]*,{1}[\W]*)*([\w+\-.%]+@[\w\-.]+\.[A-Za-z]{2,4})[\W]*$/)
      //         ]
      //       ],
      password: [ null, Validators.required],
      confirmPassword: [ null, Validators.required],
      email: [ null, [ Validators.required, Validators.email ]]
    });
    // // get return url from route parameters or default to '/'
    // this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  /**
   * Realizando actualización
   */
  onSubmit() {

    const email = this.loginForm.controls.email.value;
    const password = this.loginForm.controls.password.value;
    const passwordConfirm = this.loginForm.controls.confirmPassword.value;

    if (this.loginForm.invalid) {
      return;
    } 
    else { 
      if (password != passwordConfirm) {
        this.ShowNotify('Las contraseñas deben ser idénticas.', 'info');
        return;
      }
      
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
                delete data['Password'];
                if (data?.Id_User > 0) {
                  //Obtener la última fecha de actualización, para verificar si puede realizar el cambio
                  this.userHistoricalPasswordService.ListaSelAll(1, 99, `Usuario = ${data.Id_User}`, '')
                  .subscribe((data: SpartanUserHistoricalPasswordPagingModel) => {
                    //console.log('ListaSelAll', data);
                  }, error => {

                  });

                  //Guardando contraseña
                  this.userService.SetUserPassword(data.Id_User, data, password)
                  .pipe(catchError(this.HandleError))
                  .subscribe((response: any) => { 
                    if (response == 0) {
                      //Guardar historial
                      let historicalData: SpartanUserHistoricalPasswordModel = new SpartanUserHistoricalPasswordModel();
                      historicalData.Fecha_de_Registro = new Date();
                      var md5 = require('md5');
                      historicalData.Password = md5(password.toLowerCase());
                      historicalData.Usuario = data.Id_User
                      this.userHistoricalPasswordService.Post(historicalData)
                      .subscribe((response: any) => {
                        this.ShowNotify('Contraseña actualizada', 'success');
                        this.loginForm.reset();
                        this.router.navigate(['/authentication/signin']);
                      });
                    }
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