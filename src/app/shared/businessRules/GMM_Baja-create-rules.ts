import Utils from 'src/app/helpers/utils';
import { ElementRef, Injectable, Input, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { AbstractControl, FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/api-services/general.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { FilterCombo } from 'src/app/models/filter-combo';
import { BusinessRulesFunctions } from './business-rules-functions';
@Injectable({
  providedIn: 'root'
})
export class GMM_BajaCreateRules {
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

  maxDateTodayValidator(control: AbstractControl) {
    const today = new Date();
    const maxDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    if (control.value) {
      if (control.value > maxDate) {
        return { maxDateToday: true };
      } else {
        return null;
      }
    }
  }

  rulesOnInit(formGroup: FormGroup, parameters?: any[]) {
    // NEWBUSINESSRULE_SCREENOPENING//
    setTimeout(() => {
      // 1..- Ocultar los campos Folio y Solicitud de Trámite y no deben ser obligatorios
      this.brf.applyConditionsToControl(formGroup, 'Folio', false, false, false);
      this.brf.applyConditionsToControl(formGroup, 'Solicitud_de_Tramite', false, false, false);
      // 2.- La fecha de la baja es obligatoria
      this.brf.applyConditionsToControl(formGroup, 'Fecha_de_baja', true);
    }, 0);
    // 3.- La fecha de la baja no puede ser mayor a la fecha actual (No se pueden registrar fechas posteriores).
    this.brf.updateValidatorsToControl(formGroup, 'Fecha_de_baja', [Validators.required, this.maxDateTodayValidator]);
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
