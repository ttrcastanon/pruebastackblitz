import { Injectable, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { EmpleadoService } from 'src/app/api-services/Empleado.service';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';

@Injectable({
  providedIn: 'root'
})

export class EmpleadoIndexRules {
  public operation = "List";
  public MRWhere = '';
  public MROrder = '';
  constructor(private _user: SpartanUserService, private route: Router, private EmpleadoService: EmpleadoService) {
  }

  rulesAfterViewInit() {
    // NEWBUSINESSRULE_BEFORECREATIONLIST//
    const operation = this.operation;
  }

  rulesOnInit() {
    // NEWBUSINESSRULE_AFTERCREATIONLIST//
    const operation = this.operation;
    this._user.current().subscribe((user) => {
      let roles = [10];
      console.log(user);
      if (roles.includes(user.Role)) {
        this.EmpleadoService.listaSelAll(0, 1, 'Empleado.Usuario_del_Sistema=' + user.Id_User).subscribe(async result => {
          if (result.Empleados.length > 0) {
            this.route.navigate(['/Empleado/edit/' + result.Empleados[0].Folio]);
          }
        });

      }
    })
  }

  rulesAfterViewChecked() {
    // NEWBUSINESSRULE_AFTERVIEWCHECKEDLIST//
    const operation = this.operation;
  }

}
