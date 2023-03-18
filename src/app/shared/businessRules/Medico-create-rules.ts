import { Injectable, Renderer2 } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { GeneralService } from 'src/app/api-services/general.service';
import { FilterCombo } from 'src/app/models/filter-combo';
import { BusinessRulesFunctions } from './business-rules-functions';
@Injectable({
  providedIn: 'root'
})
export class MedicoCreateRules {
  public operation: string;
  public formGroup: FormGroup;
  public rowIndex = '';
  public nameOfTable = '';
  public filterComboEmiter = new Subject<FilterCombo>();
  public brf: BusinessRulesFunctions = new BusinessRulesFunctions(this.renderer);

  constructor(private generalService: GeneralService, private renderer: Renderer2) {
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
      
      this.brf.updateValidatorsToControl(formGroup, "Correo_Electronico", [Validators.email]);
      this.brf.applyConditionsToControl(formGroup, 'Nombre_del_medico', true);
      this.brf.applyConditionsToControl(formGroup, 'Especialidad', true);
      this.brf.applyConditionsToControl(formGroup, 'Subespecialidad', false);
      this.brf.applyConditionsToControl(formGroup, 'Pagina_web_del_medico', false);
      this.brf.applyConditionsToControl(formGroup, 'CurriculumFile', false);
      this.brf.applyConditionsToControl(formGroup, 'Precio_de_consulta', false);
      this.brf.applyConditionsToControl(formGroup, 'Horarios_de_atencion', false, false, false);
      this.brf.applyConditionsToControl(formGroup, 'Evaluacion_de_clientes', false, false);
    }, 0);
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
