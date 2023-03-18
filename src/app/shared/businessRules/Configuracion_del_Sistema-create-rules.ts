import Utils from 'src/app/helpers/utils';
import { ElementRef, Injectable, Input, QueryList, Renderer2, ViewChild, ViewChildren } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';
import { GeneralService } from 'src/app/api-services/general.service';
import { MatTableDataSource } from '@angular/material/table';
import { Observable, Subject } from 'rxjs';
import { FilterCombo } from 'src/app/models/filter-combo';
import { BusinessRulesFunctions } from './business-rules-functions';
@Injectable({
  providedIn: 'root'
})
export class Configuracion_del_SistemaCreateRules {
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
