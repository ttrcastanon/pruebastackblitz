import { Injectable, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { GeneralService } from 'src/app/api-services/general.service';
import { FilterCombo } from 'src/app/models/filter-combo';
import { BusinessRulesFunctions } from './business-rules-functions';
@Injectable({
  providedIn: 'root'
})
export class Estatus_de_tramiteCreateRules {
  public operation: string;
  public formGroup: FormGroup;
  public rowIndex = '';
  public nameOfTable = '';
  public filterComboEmiter = new Subject<FilterCombo>();
  public brf: BusinessRulesFunctions = new BusinessRulesFunctions(this.renderer);

  constructor(private generalService: GeneralService, public renderer: Renderer2) {
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
    setTimeout(() => {
      formGroup.get('Atencion_requerida').disable();
      formGroup.get('Dias_sin_atencion_para_alerta').disable();
      formGroup.get('Rol_que_Atiende').disable();
    }, 0);
    formGroup.get('Requiere_Atencion').valueChanges
      .pipe(startWith(false), pairwise())
      .subscribe(([prev, next]) => {
        if (next) {
          formGroup.get('Rol_que_Atiende').enable();
          formGroup.get('Atencion_requerida').enable();
          formGroup.get('Dias_sin_atencion_para_alerta').enable();
        } else {
          formGroup.get('Rol_que_Atiende').disable();
          formGroup.get('Atencion_requerida').disable();
          formGroup.get('Dias_sin_atencion_para_alerta').disable();
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
