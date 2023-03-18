import Utils from 'src/app/helpers/utils';
import { ElementRef, Injectable, Input, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/api-services/general.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { FilterCombo } from 'src/app/models/filter-combo';
import { CustomValidators } from './custom-validators';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { SpartanUser } from 'src/app/models/spartan-user.model';
import { BusinessRulesFunctions } from './business-rules-functions';
@Injectable({
  providedIn: 'root'
})
export class EmpleadoCreateRules {
  public operation: string;
  public formGroup: FormGroup;
  public rowIndex = '';
  public nameOfTable = '';
  public filterComboEmiter = new Subject<FilterCombo>();
  public brf: BusinessRulesFunctions = new BusinessRulesFunctions(this.renderer);
  user: SpartanUser;

  constructor(private generalService: GeneralService, public renderer: Renderer2, private _user: SpartanUserService) {
    this._user.current().subscribe((result) => {
      this.user = result;
    })
  }

  filterComboObservable(): Observable<FilterCombo> {
    return this.filterComboEmiter.asObservable();
  }

  filterCombo(nameCombo: string, filter: string) {
    const filterCombo: FilterCombo = { nameCombo, filter };
    this.filterComboEmiter.next(filterCombo);

  }

  rulesAfterViewInit() {
    // NEWBUSINESSRULE_NONE//
  }

  rulesOnInit(formGroup: FormGroup, parameters?: any[]) {
    // NEWBUSINESSRULE_SCREENOPENING//
    // Ocultar botones de "Guardar y Nuevo" y "Guardar y Copia"
    if (this.operation === 'Update' || this.operation === 'New') {
      const nodeList: any[] = [];
      let xpath = ".//button[.//span[contains(text(),'Guardar y Nuevo')]]";
      let result = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      let node = null;
      while (node = result.iterateNext()) {
        nodeList.push(node);
      }
      xpath = ".//button[.//span[contains(text(),'Guardar y Copia')]]";
      result = document.evaluate(xpath, document, null, XPathResult.UNORDERED_NODE_ITERATOR_TYPE, null);
      node = null;
      while (node = result.iterateNext()) {
        nodeList.push(node);
      }
      nodeList.forEach(node => {
        setTimeout(() => {
          this.renderer.setStyle(node, 'display', 'none');
        }, 0);
      });
    }
    if (this.operation === 'Update') {

      this._user.current().subscribe((result) => {
        if (result.Role === 10) {
          formGroup.get('Numero_de_empleado').disable();
          formGroup.get('Empresa').disable();
          formGroup.get('Grupo_de_Prestacion').disable();
          formGroup.get('Estatus_de_empleado').disable();
          formGroup.get('Poliza_GMM').disable();
          formGroup.get('Poliza_Vida').disable();
        }
      })


    }
    else if (this.operation == 'New') {
      formGroup.controls['Estatus_de_empleado'].setValue(1);
      formGroup.get('Estatus_de_empleado').disable();
      let acceso = Math.random().toString(36).slice(-8);
      formGroup.controls['Clave_de_acceso'].setValue(acceso);
      formGroup.controls['Contrasena'].setValue(acceso);
      formGroup.controls['Confirmar_contrasena'].setValue(acceso);
      formGroup.get('Clave_de_acceso').clearValidators();
      formGroup.get('Contrasena').clearValidators();
      formGroup.get('Confirmar_contrasena').clearValidators();
      formGroup.get('Estatus_de_empleado').clearValidators();
    }
    formGroup.get('Folio').clearValidators();
    formGroup.get('Nombre_completo').clearValidators();
    formGroup.get('Usuario_del_Sistema').clearValidators();
    formGroup.controls['Correo_Electronico'].setValidators([Validators.email]);
    formGroup.controls['Contrasena'].setValidators([Validators.compose(
      [
        Validators.required,
        // check whether the entered password has a number
        CustomValidators.patternValidator(/\d/, {
          hasNumber: true
        }),
        // check whether the entered password has upper case letter
        CustomValidators.patternValidator(/[A-Z-a-z]/, {
          hasLetters: true
        }),
        // // check whether the entered password has a lower case letter
        // CustomValidators.patternValidator(/[a-z]/, {
        //   hasSmallCase: true
        // }),
        // // check whether the entered password has a special character
        // CustomValidators.patternValidator(
        //   /[ !@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/,
        //   {
        //     hasSpecialCharacters: true
        //   }
        // ),
        Validators.minLength(8),
      ]
    )]);
  }

  rulesAfterSave() {
    // NEWBUSINESSRULE_AFTERSAVING//
  }

  rulesBeforeSave(formGroup: FormGroup): boolean {
    const result = true;
    // NEWBUSINESSRULE_BEFORESAVING//
    let nombre = formGroup.get('Nombre').value;
    let apPaterno = formGroup.get('Apellido_paterno').value;
    let apMaterno = formGroup.get('Apellido_materno').value;
    formGroup.get('Nombre_completo').setValue(`${nombre} ${apPaterno} ${apMaterno}`);
    formGroup.get('Usuario_del_Sistema').setValue(this.user.Id_User);
    formGroup.get('Estatus_de_empleado').enable();
    return result;
  }
}
