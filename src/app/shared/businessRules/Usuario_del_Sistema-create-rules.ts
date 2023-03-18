import { Injectable, OnDestroy, Renderer2 } from '@angular/core';
import { AbstractControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { GeneralService } from 'src/app/api-services/general.service';
import { FilterCombo } from 'src/app/models/filter-combo';
import { BusinessRulesFunctions } from './business-rules-functions';
@Injectable({
  providedIn: 'root'
})
export class Usuario_del_SistemaCreateRules implements OnDestroy {
  public operation: string;
  public formGroup: FormGroup;
  public rowIndex = '';
  public nameOfTable = '';
  public filterComboEmiter = new Subject<FilterCombo>();
  private unsubscribe: Subject<void> = new Subject();
  public brf: BusinessRulesFunctions = new BusinessRulesFunctions(this.renderer);

  ngOnDestroy(): void {
    this.unsubscribe.next();
    this.unsubscribe.complete();
  }

  constructor(private generalService: GeneralService, public renderer: Renderer2) {
  }


  filterComboObservable(): Observable<FilterCombo> {
    return this.filterComboEmiter.asObservable();
  }
  
  filterCombo(nameCombo: string, filter: string) {
    const filterCombo: FilterCombo = { nameCombo, filter };
    this.filterComboEmiter.next(filterCombo);

  }

  
  validation(control: AbstractControl): ValidationErrors | null {
    const result: ValidationErrors | null = null;
    // NEWBUSINESSRULE_VALIDATION//
    return result;
  }

  duplicateRamos_y_Empresas_de_Usuario(control: AbstractControl): ValidationErrors | null {
    let result = { duplicateRamos_y_Empresas_de_Usuario: true };
    if (control.value !== null && control.value !== undefined) {
      if (control.value.length <= 2) {
        if (JSON.stringify(control.value[0]) !== JSON.stringify(control.value[1])) {
          result = null;
        }
      } else {
        const itemsToTest = control.value.filter((item, index) => index !== 0);
        if (itemsToTest) {
          const itemToFind = itemsToTest.find(item => item.Ramo.Clave === control.value[0].Ramo?.Clave
            && item.Empresa.Clave === control.value[0].Empresa?.Clave);
          if (!itemToFind) {
            result = null;
          }
        }
      }
    } else {
      result = null;
    }
    return result;
  }

  // requiredAtleastOneRamos_y_Empresas_de_Usuario(control: AbstractControl): ValidationErrors | null {
  //   let result = { requiredAtleastOneRamos_y_Empresas_de_Usuario: true };
  //   if (control.value !== null && control.value !== undefined) {
  //     if (control.value.length > 0) {
  //       result = null;
  //     } else {
  //       result = { requiredAtleastOneRamos_y_Empresas_de_Usuario: true };
  //     }
  //   } else {
  //     result = null;
  //   }
  //   //console.log(result);
  //   return result;
  // }
  

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
    // Ocultar Ramos_y_Empresas_de_Usuario si no es concierge
    setTimeout(() => {
      const multiRow = document.querySelector("[formcontrolname='Ramos_y_Empresas_de_Usuario']")
      this.renderer.setStyle(multiRow, 'display', 'none');
    }, 0);
    formGroup.get('Email').setValidators([Validators.email, Validators.required]);
    formGroup.get('Rol').valueChanges
      .pipe(startWith(false), pairwise())
      .subscribe(([prev, next]) => {
        if (next == 9) {
          setTimeout(() => {
            const multiRow = document.querySelector("[formcontrolname='Ramos_y_Empresas_de_Usuario']")
            this.renderer.setStyle(multiRow, 'display', 'inline');
          }, 0);
        } else {
          setTimeout(() => {
            const multiRow = document.querySelector("[formcontrolname='Ramos_y_Empresas_de_Usuario']")
            this.renderer.setStyle(multiRow, 'display', 'none');
          }, 0);
        }
      });
  }

  rulesAfterSave() {
    // NEWBUSINESSRULE_AFTERSAVING//
  }

  rulesBeforeSave(): boolean {
    const result = true;
    // NEWBUSINESSRULE_BEFORESAVING//
    return result;
  }
}
