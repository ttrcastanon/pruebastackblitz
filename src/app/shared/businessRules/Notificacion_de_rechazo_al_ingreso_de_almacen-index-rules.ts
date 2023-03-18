import { Injectable, Input } from '@angular/core';
import { FormGroup, Validators } from '@angular/forms';

@Injectable({
  providedIn: 'root'
})

export class Notificacion_de_rechazo_al_ingreso_de_almacenIndexRules {
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
