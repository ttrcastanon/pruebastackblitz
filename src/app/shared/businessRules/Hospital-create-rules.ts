import { Injectable, Renderer2 } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatTabGroup } from '@angular/material/tabs';
import { Observable, Subject } from 'rxjs';
import { pairwise, startWith } from 'rxjs/operators';
import { GeneralService } from 'src/app/api-services/general.service';
import { FilterCombo } from 'src/app/models/filter-combo';
import { BusinessRulesFunctions } from './business-rules-functions';

@Injectable({
  providedIn: 'root'
})
export class HospitalCreateRules {
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
    const tabGroup = parameters[0] as MatTabGroup;
    setTimeout(() => {
      this.brf.applyConditionsToControl(formGroup, 'Paquete_de_beneficios', false);
      this.brf.applyConditionsToControl(formGroup, 'Nombre_de_enlace_de_servicio', false);
      this.brf.applyConditionsToControl(formGroup, 'Telefono_de_enlace_de_servicio', false);
      this.brf.applyConditionsToControl(formGroup, 'Evaluacion_de_clientes', false, false);
    }, 0);
    tabGroup?.selectedIndexChange?.pipe(
      startWith(tabGroup.selectedIndex),
      pairwise()
    ).subscribe(([previousIndex, currentIndex]) => {
      if (currentIndex === 0) {
        setTimeout(() => {
          this.brf.applyConditionsToControl(formGroup, 'Paquete_de_beneficios', false);
          this.brf.applyConditionsToControl(formGroup, 'Nombre_de_enlace_de_servicio', false);
          this.brf.applyConditionsToControl(formGroup, 'Telefono_de_enlace_de_servicio', false);
          this.brf.applyConditionsToControl(formGroup, 'Evaluacion_de_clientes', false, false);
        }, 0);
      }
      if (currentIndex === 1) {
        setTimeout(() => {
          this.brf.applyConditionsToControl(formGroup, 'Colonia', false);
          this.brf.applyConditionsToControl(formGroup, 'Calle', false);
          this.brf.applyConditionsToControl(formGroup, 'Numero_exterior', false);
          this.brf.applyConditionsToControl(formGroup, 'Numero_interior', false);
          this.brf.applyConditionsToControl(formGroup, 'Codigo_Postal', false);
          this.brf.applyConditionsToControl(formGroup, 'Latitud', false);
          this.brf.applyConditionsToControl(formGroup, 'Longitud', false);
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
