import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { SpartanBrScopeService } from 'src/app/api-services/business-rules/spartan-br-scope.service';
import { SpartanBrOperationService } from 'src/app/api-services/business-rules/spartan-br-operation.service';
import { SpartanBrProcessEventService } from 'src/app/api-services/business-rules/spartan-br-process-event.service';
import { SpartanBrConditionOperatorService } from 'src/app/api-services/business-rules/spartan-br-condition-operator.service';
import { SpartanBrConditionService } from 'src/app/api-services/business-rules/spartan-br-condition.service';
import { SpartanBrOperatorTypeService } from 'src/app/api-services/business-rules/spartan-br-operator-type.service';

import { Business_Rule_Creation_Model } from 'src/app/models/business-rules/business-rule-creation.model';
import { Spartan_BR_Conditions_Detail_Model } from 'src/app/models/business-rules/spartan-br-conditions-detail.model';
import { SpartanBrConditionsDetailListDatasource } from './spartan-br-conditions-detail-datasource';
import { Spartan_BR_Scope_Model } from 'src/app/models/business-rules/spartan-br-scope.model';
import { Spartan_BR_Operation_Model } from 'src/app/models/business-rules/spartan-br-operation.model';
import { Spartan_BR_Process_Event_Model } from 'src/app/models/business-rules/spartan-br-process-event.model';
import { Spartan_BR_Condition_Operator_Model } from 'src/app/models/business-rules/spartan-br-condition-operator.model';
import { Spartan_BR_Condition_Model } from 'src/app/models/business-rules/spartan-br-condition.model';
import { Spartan_BR_Operator_Type_Model } from 'src/app/models/business-rules/spartan-br-operator-type.model';

@Component({
  selector: 'app-business-rules-setting',
  templateUrl: './business-rules-setting.component.html',
  styleUrls: ['./business-rules-setting.component.scss']
})
export class BusinessRulesSettingComponent implements OnInit, AfterViewInit {

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ScopeList: Array<Spartan_BR_Scope_Model>;
  OperationList: Array<Spartan_BR_Operation_Model>;
  EventList: Array<Spartan_BR_Process_Event_Model>;
  ConditionOperatorList: Array<Spartan_BR_Condition_Operator_Model>;
  ConditionConditionList: Array<Spartan_BR_Condition_Model>;
  ConditionOperatorType1List: Array<Spartan_BR_Operator_Type_Model>;
  ConditionOperatorType2List: Array<Spartan_BR_Operator_Type_Model>;
 
  OpenStateConditions: boolean;
  OpenStateActionsFill: boolean;
  OpenStateActionsNotFill: boolean;
  Business_Rule_Creation: Business_Rule_Creation_Model;
  BR_Conditions_Detail_Model: Spartan_BR_Conditions_Detail_Model;

  dataSourceConditions = new MatTableDataSource<Spartan_BR_Conditions_Detail_Model>();

  ConditionsColumns: string[];
  ConditionsDataList: Spartan_BR_Conditions_Detail_Model[] = [];


  //******************** TEMPORAL
  values: Element[] = [ {position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'}, ];
  valuesActions: ElementActions[] = [ 
    {
      Classification: 'Control Properties', 
      Action: 'Hide field from form', 
      ActionResult: 'Stop', 
      Parameter1: 'A', 
      Parameter2: 'B', 
      Parameter3: 'C', 
      Parameter4: 'D', 
      Parameter5: 'E'
    } 
  ];
  displayedColumns = ['position', 'name', 'weight', 'symbol'];
  displayedColumnsActions = ['Classification', 'Action', 'ActionResult', 'Parameter1', 'Parameter2', 'Parameter3', 'Parameter4', 'Parameter5'];
  subject = new BehaviorSubject(this.values);
  subjectActions = new BehaviorSubject(this.valuesActions);
  dataSourceActions = new SpartanBrConditionsDetailListDatasource(this.subject.asObservable());
  dataSource = new SpartanBrConditionsDetailListDatasource(this.subject.asObservable());


  constructor(
    public dialogoRef: MatDialogRef<BusinessRulesSettingComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string,
    private brScopeService: SpartanBrScopeService,
    private brOperationService: SpartanBrOperationService,
    private brProcessEventService: SpartanBrProcessEventService,
    private brConditionOperatorService: SpartanBrConditionOperatorService,
    private brConditionService: SpartanBrConditionService,
    private brOperatorTypeService: SpartanBrOperatorTypeService
  ) {
    this.ScopeList = new Array<Spartan_BR_Scope_Model>();
    this.OperationList = new Array<Spartan_BR_Operation_Model>();
    this.EventList = new Array<Spartan_BR_Process_Event_Model>();
    this.ConditionOperatorList = new Array<Spartan_BR_Condition_Operator_Model>();
    this.ConditionConditionList = new Array<Spartan_BR_Condition_Model>();
    this.ConditionOperatorType1List = new Array<Spartan_BR_Operator_Type_Model>();
    this.ConditionOperatorType2List = new Array<Spartan_BR_Operator_Type_Model>();
    this.OpenStateConditions = true;
    this.OpenStateActionsFill = true;
    this.OpenStateActionsNotFill = true;
    this.Business_Rule_Creation = new Business_Rule_Creation_Model();
    this.BR_Conditions_Detail_Model = new Spartan_BR_Conditions_Detail_Model();
  }

  ngOnInit(): void {

    this.ConditionsColumns = [ 
      'actions', 
      'ConditionsDetailId', 
      'Business_Rule', 
      'Condition_Operator', 
      'First_Operator_Type',
      'First_Operator_Value', 
      'Condition', 
      'Second_Operator_Type', 
      'Second_Operator_Value' 
    ];
    this.GetDataList();

  }

  /**
   * Obtener información para las listas
   */
  GetDataList() {

    forkJoin([
      this.brScopeService.GetAll(),
      this.brOperationService.GetAll(),
      this.brProcessEventService.GetAll(),
      this.brConditionOperatorService.GetAll(),
      this.brConditionService.GetAll(),
      this.brOperatorTypeService.GetAll()
   ])
   .subscribe(dataSet => {
       this.ScopeList = dataSet[0];
       this.OperationList = dataSet[1];
       this.EventList = dataSet[2];
       this.ConditionOperatorList = dataSet[3];
       this.ConditionConditionList = dataSet[4];
       this.ConditionOperatorType1List = dataSet[5];
       this.ConditionOperatorType2List = dataSet[5];
   });

  }

  
  ngAfterViewInit(): void {
    this.dataSourceConditions.paginator = this.paginator;
  }

  
  ActionAddCondition() {
    // const familiar = new DetalleFamiliaresDeEmpleado(this.fb);
    const conditionRow = new Spartan_BR_Conditions_Detail_Model();
    conditionRow.Business_Rule = 1;
    conditionRow.Condition = 99;
    conditionRow.Condition_Operator = 1;
    conditionRow.ConditionsDetailId = 0;
    conditionRow.First_Operator_Type = 1;
    conditionRow.First_Operator_Value = 'Operador 1';
    conditionRow.Second_Operator_Type = 2;
    conditionRow.Second_Operator_Value = 'Operador 2';

    // this.addFamiliar(conditionRow);
    this.ConditionsDataList.push(conditionRow);
    this.dataSourceConditions.data = this.ConditionsDataList;
    conditionRow.IsEdit = true;
    conditionRow.IsNew = true;
    const length = this.dataSourceConditions.data.length;
    const index = length - 1;
    // const formFamiliar = this.familiaresItems.controls[index] as FormGroup;
    // this.addFilterToControl(formFamiliar.controls.Area, index);
    const page = Math.ceil(this.dataSourceConditions.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }

  // //   const values: Element[] = 
  // // [
  // //   { id: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'},
  // // ];
  //   const displayedColumns = [
  //     'ConditionsDetailId', 'Business_Rule', 'Condition_Operator', 'First_Operator_Type',
  //     'First_Operator_Value', 'Condition', 'Second_Operator_Type', 'Second_Operator_Value'
  //   ];
  //   let subject = new BehaviorSubject(this.BR_Conditions_Detail_Model);
  //   let dataSource = new SpartanBrConditionsDetailListDatasource(subject.asObservable());
  }


  addFamiliar(entity?: Spartan_BR_Conditions_Detail_Model) {
    // const detalleEmpleado = new DetalleFamiliaresDeEmpleado(this.fb);
    const detalleEmpleado = new Spartan_BR_Conditions_Detail_Model();
    // this.familiaresItems.push(detalleEmpleado.buildFormGroup());
    // if (entity) {
    //   detalleEmpleado.fromObject(entity);
    // }
  }

  ActionClose() {
    this.dialogoRef.close(false);
  }

  ActionPending() {
    alert('Pendiente de implementar');
  }

  OnEditCondition(row: any) {}

  OnDeleteCondition(row: any) {}

  OnActionAddFill() {
    this.valuesActions = [ 
      {
        Classification: 'Control Properties', 
        Action: 'Hide field from form', 
        ActionResult: 'Stop', 
        Parameter1: 'A', 
        Parameter2: 'B', 
        Parameter3: 'C', 
        Parameter4: 'D', 
        Parameter5: 'E'
      } 
    ];
    // this.values.push(this.valuesActions);
    this.subjectActions.next(this.valuesActions);
  }

  OnActionAddNotFill() {
    // this.values = [ 
    //   {
    //   position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'
    // } 
    // ];
    this.values.push({position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H'});
    this.subject.next(this.values);
  }

}

export interface ElementActions {
  Classification: string;
  Action: string;
  ActionResult: string;
  Parameter1: string;
  Parameter2: string;
  Parameter3: string;
  Parameter4: string;
  Parameter5: string;
}

export interface Element {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}