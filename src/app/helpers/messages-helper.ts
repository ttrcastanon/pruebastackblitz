import { TranslateService } from '@ngx-translate/core';
import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
    providedIn: 'root'
  })
export class MessagesHelper {

    constructor(private translateService: TranslateService) { }

    public confirmation(header:string,subheader:string = ''):Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => { 
            Swal.fire({
                title: header, // ToDo - Habilitarlos cuando se resuelva el tema del multilenguaje - this.translateService.instant(header),
                text: subheader, // ToDo - Habilitarlos cuando se resuelva el tema del multilenguaje - this.translateService.instant(subheader),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "Cancelar",
                confirmButtonText: "Eliminar"
              }).then(result => {
                if (result.value) {
                  resolve(true);
                }
            });
        }); 
    }

    public success(message:string){
        Swal.fire({
            icon: 'success',
            title: message, // ToDo - Habilitarlos cuando se resuelva el tema del multilenguaje - this.translateService.instant(message),
            showConfirmButton: false
        }); 
    }

    public error(message:string){
        Swal.fire({
            icon: 'error',
            title: message, // ToDo - Habilitarlos cuando se resuelva el tema del multilenguaje - this.translateService.instant(message),
        }); 
    }

    public confirmExport(header:string,subheader:string = ''):Promise<boolean>{
        return new Promise<boolean>((resolve, reject) => { 
            Swal.fire({
                title: header, // ToDo - Habilitarlos cuando se resuelva el tema del multilenguaje - this.translateService.instant(header),
                text: subheader, // ToDo - Habilitarlos cuando se resuelva el tema del multilenguaje - this.translateService.instant(subheader),
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                cancelButtonText: "Cancelar",
                confirmButtonText: "Eliminar"
              }).then(result => {
                if (result.value) {
                  resolve(true);
                }
            });
        }); 
    }

    public close() {
        if(Swal.isVisible()) { // instant regret
            Swal.close();
        }
    }

}