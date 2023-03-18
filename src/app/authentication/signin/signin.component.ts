import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormBuilder, FormGroup } from '@angular/forms';
import { LoginService } from '../../api-services/login.service';
import { SpartanLanguageService } from '../../api-services/spartan-language.service';
import { SpartanLanguage } from 'src/app/models/spartan-language';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { StorageKeys } from 'src/app/app-constants';
import { MatInput } from '@angular/material/input';
import { NgxSpinnerService } from 'ngx-spinner';
import * as AppConstants from 'src/app/app-constants';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { SpartanSettingsService } from 'src/app/api-services/spartan-settings.service';
import { LoggedUser, Spartan_User } from 'src/app/models/logged-user';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Enumerations } from 'src/app/models/enumerations';
import { catchError } from 'rxjs/operators';
import { SpartanUserHistoricalPasswordService } from 'src/app/api-services/spartan-user-historical-password.service';
import { SpartanUserHistoricalPasswordModel, SpartanUserHistoricalPasswordPagingModel } from 'src/app/models/spartan-user-historical-password.model';
import { HelperService } from 'src/app/api-services/helper.service';
import { AppService } from '../../app.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})

export class SigninComponent implements OnInit {

  loginForm: FormGroup;
  submitted = false;
  returnUrl: string;
  languages: SpartanLanguage[] = [];
  hide = true;
  error = '';
  @ViewChild('username') inputUserName: ElementRef;
  logout: boolean;
  IsSignIn: boolean;
  passwordVisible: boolean = false;
  /**
   * Intentos de acceso
   */
  SignInAttempts: number;
  /**
   * Días de expiración
   */
  ExpirationDays: number;

  public isDisabled: boolean = true;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private appService: AppService,
    private router: Router,
    private loginService: LoginService,
    private spartanLanguageService: SpartanLanguageService,
    private localStorageHelper: LocalStorageHelper,
    private spinner: NgxSpinnerService,
    private userService: SpartanUserService,
    private settingsService: SpartanSettingsService,
    private userHistoricalPasswordService: SpartanUserHistoricalPasswordService,
    private helperService: HelperService,
    private snackBar: MatSnackBar
  ) { }

  ngOnInit() {
    this.IsSignIn = true;
    this.SignInAttempts = 0;
    this.logout = true;
    this.spinner.show('loading');
    this.loginForm = this.formBuilder.group({
      username: [''],
      password: [''],
      language: [1],
    });
    // ToDo - No se hace uso de la carga de lenguaje por tener solo español
    // this.loadLanguages();
    this.localStorageHelper.clearStorage();
    setTimeout(() => { // this will make the execution after the above boolean has changed
      this.inputUserName.nativeElement.focus();
    }, 1000);
    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
    this.spinner.hide('loading');
  }

  loadLanguages() {
    this.spartanLanguageService.getAll().subscribe(sl => {
      this.languages = sl;
      this.loginForm.controls.language.setValue(2);
    });
  }

  get f() {
    return this.loginForm.controls;
  }

  onSubmit() {
    this.submitted = true;
    this.error = '';
    // stop here if form is invalid
    if (this.loginForm.invalid) {
      return;
    } else {

      const username = this.loginForm.controls.username.value;
      const password = this.loginForm.controls.password.value;
      // ToDo - No se hace uso de la carga de lenguaje por tener solo español
      // const language = this.loginForm.controls.language.value;
      const genericPassword = AppConstants.AppSettings.stringPasswordDefault;

      // ToDo - No se hace uso de la carga de lenguaje por tener solo español
      // this.localStorageHelper.setItemToLocalStorage(StorageKeys.Language, language === 1 ? 'en' : 'es');
      this.localStorageHelper.setItemToLocalStorage(StorageKeys.Language, 'es');
      this.loginService.login(username, password).subscribe(userdata => {

        this.localStorageHelper.setItemToLocalStorage('USERID', userdata.UserId.toString());
        this.localStorageHelper.setItemToLocalStorage('USERROLEID', userdata.RoleId.toString());
        
        if (userdata.Error != "") {
          this.error = userdata.Error;
          return;
        }


        this.loginService.getToken(username, password).subscribe(token => {
          if (token != null && token !== undefined) {
            this.loginService.setTokenToUser(userdata, token);
            //Buscando información de Configuración
            this.settingsService.GetAll()
              .subscribe((result: any) => {
                if (result != null && result.length > 0) {
                  let ExpirationDays = result.filter(x => x.Clave == 'ExpirationDays')[0]?.Valor || 0;
                  let CountSamePassword = result.filter(x => x.Clave == 'CountSamePassword')[0]?.Valor || 0;
                  if (ExpirationDays != 0) {
                    //Buscar información histórica del password
                    this.userHistoricalPasswordService.ListaSelAll(1, 1, `Usuario = ${userdata.UserId}`, ' Fecha_de_Registro DESC')
                      .subscribe((data: SpartanUserHistoricalPasswordPagingModel) => {
                        if (data != null && data.Spartan_User_Historical_Passwords.length > 0) {
                          let registerDate = data.Spartan_User_Historical_Passwords[0]?.Fecha_de_Registro;
                          let initialDate = new Date(registerDate);
                          let currentDate = new Date();
                          var diff = (currentDate.getTime() - initialDate.getTime()) / (1000 * 60 * 60 * 24);
                          let differenceDays = Math.round(diff);
                          //Si la diferencia de días no está en el rango de la configurada, resetear contraseña
                          if (differenceDays > ExpirationDays) {
                            this.ResetPassword(userdata.UserId);
                            return;
                          }
                          else {
                            this.SignInAttempts += 1;
                            //Verificando no sea una contraseña genérica
                            if (password.toLowerCase() == genericPassword.toLowerCase()) {
                              this.IsSignIn = false;
                              this.ShowNotify('La contraseña ingresada es de tipo genérica. Es necesario cambiarla.', 'info');
                              setTimeout(() => {
                                this.router.navigate(['/authentication/change-password']);
                                return;
                              }, 3000);
                            }
                            else if (userdata != null && userdata.Error === '') {
                              this.loginService.getToken(username, password).subscribe(token => {
                                if (token != null && token !== undefined) {
                                  this.logout = false;
                                  this.loginService.setTokenToUser(userdata, token);
                                  this.router.navigate(['/dashboard/main']);
                                  this.appService.setUserLoggedIn(true);
                                  setTimeout(() => { // this will make the execution after the above boolean has changed
                                    if (this.logout === false) {
                                      this.loginService.getUserToken();
                                    }
                                  }, 100000);
                                }
                              });
                            } else {

                              if (this.SignInAttempts == CountSamePassword) {
                                this.ShowNotify('Ha superado el límite de intentos de acceso. La cuenta será deshabilitada.', 'info');
                                setTimeout(() => {
                                  this.DisableAccount();
                                  this.SignInAttempts = 0;
                                }, 3000);
                                return;
                              }

                              const errorMessage = userdata ? userdata.Error : "Ha ocurrido un error, por favor revisar las credenciales";
                              this.ShowNotify(errorMessage, 'error');
                              this.error = errorMessage;
                            }
                          }
                        }
                      }, error => {

                      });
                  }
                }
              }, error => {

              });
          }
        }, error => {

        });

      }, error => {
        this.ShowNotify(error, 'error');
      });
    }
  }

  /**
   * Obtener el historial del password
   * @param userId : Identificador de Usuario
   */
  GetHistoricalPassword(userId: number, expirationDays: number): boolean {

    let ResetPassword: boolean = false;

    this.userHistoricalPasswordService.ListaSelAll(1, 1, `Usuario = ${userId}`, ' Fecha_de_Registro DESC')
      .subscribe((data: SpartanUserHistoricalPasswordPagingModel) => {
        if (data != null && data.Spartan_User_Historical_Passwords.length > 0) {
          let lastDate = data.Spartan_User_Historical_Passwords[0]?.Fecha_de_Registro;
          //console.log('Fecha_de_Registro', lastDate);
          let registerDate = new Date(lastDate);
          let currentDate = new Date();
          // var fecha1 = moment('2016-07-12');
          // var fecha2 = moment('2016-08-01');
          // //console.log(currentDate.diff(lastDate, 'days'), ' dias de diferencia');
          var diff = (currentDate.getTime() - registerDate.getTime()) / (1000 * 60 * 60 * 24);
          let differenceDays = Math.round(diff);
          //console.log('DIFERENCIA', differenceDays);
          if (differenceDays > expirationDays) {
            //console.log('Resetear contraseña');
            ResetPassword = true;
          }
          else {
            //console.log('NO Resetear contraseña');

          }
        }
      }, error => {

      });
    return ResetPassword;

  }

  /**
   * Resetear contraseña
   * @param userData : Contenedor de información de usuario
   */
  ResetPassword(userId: number) {

    //Buscando información a través de Email
    this.userService.GetUserData(`Id_User = ${userId}`)
      .subscribe((result: any) => {
        if (result.RowCount > 0) {
          var data: Spartan_User = result.Spartan_Users[0];
          delete data['Password'];
          if (data?.Id_User > 0) {
            //Actualizando contraseña
            const newPassword = AppConstants.AppSettings.stringPasswordDefault;
            this.userService.SetUserPassword(data.Id_User, data, newPassword.toLowerCase())
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
                      // this.router.navigate(['/authentication/signin']);
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

  /**
   * Deshabilitar cuenta
   */
  DisableAccount() {

    //Obteniendo Token
    this.loginService.getToken(this.loginForm.controls.username.value, null)
      .subscribe(token => {
        if (token != null && token !== undefined) {
          //Guardando Token
          const userData: LoggedUser = new LoggedUser();
          userData.UserName = this.loginForm.controls.username.value;
          this.loginService.setTokenToUser(userData, token);
          //Buscando información de usuario
          this.userService.GetUserData("Username = '" + this.loginForm.controls.username.value + "'")
            .subscribe((result: any) => {
              if (result.RowCount > 0) {
                var data: Spartan_User = result.Spartan_Users[0];
                // delete data['Password'];
                if (data?.Id_User > 0) {
                  //Guardando nuevo estatus
                  data.Status = Enumerations.Enums.UserStatus.Inactive;
                  this.userService.UpdateUser(data.Id_User, data)
                    .subscribe((response: any) => {
                      if (response == 0) {
                        this.ShowNotify('Cuenta bloqueada', 'success');
                        this.loginForm.reset();
                      }
                    }, error => {
                      this.ShowNotify(error, 'error');
                    });
                }
              }
            },
              error => {
                this.ShowNotify(error, 'error');
              });
        }
      }, error => {
        this.ShowNotify(error, 'error');
      });

  }

  /**
   * Mostrar notificación
   */
  ShowNotify(message: string, type: string) {

    this.snackBar.open(message, '', {
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: [type]
    });

  }

  setPasswordVisible(){
    this.passwordVisible = this.passwordVisible ? false : true;
  }

  toggleEditable(event) {
    if ( event.target.checked ) {
      this.isDisabled = false;
    }
    else{
      this.isDisabled = true;
    }
  }

}
