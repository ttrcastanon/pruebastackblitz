import { Injectable, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class Configuracion_de_NotificacionIndexRules {
  public operation = "List";
  public MRWhere = '';
  public MROrder = '';
  constructor() {
   }
   
  rulesAfterViewInit() {
    const operation = this.operation;
// NEWBUSINESSRULE_BEFORECREATIONLIST//
   }

   rulesOnInit() {
     const operation = this.operation;
// NEWBUSINESSRULE_AFTERCREATIONLIST//
   }

  rulesAfterViewChecked() {
    const operation = this.operation;
// NEWBUSINESSRULE_AFTERVIEWCHECKEDLIST//
  }
  
}
