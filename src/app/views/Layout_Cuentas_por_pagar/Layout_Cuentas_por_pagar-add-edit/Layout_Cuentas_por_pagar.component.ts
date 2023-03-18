import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { off } from 'process';
import * as ts from 'typescript';

import { GeneralService } from 'src/app/api-services/general.service';
import { Layout_Cuentas_por_pagarService } from 'src/app/api-services/Layout_Cuentas_por_pagar.service';
import { Layout_Cuentas_por_pagar } from 'src/app/models/Layout_Cuentas_por_pagar';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Layout_Cuentas_por_pagar',
  templateUrl: './Layout_Cuentas_por_pagar.component.html',
  styleUrls: ['./Layout_Cuentas_por_pagar.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Layout_Cuentas_por_pagarComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Layout_Cuentas_por_pagarForm: FormGroup;
	public Editor = ClassicEditor;
	model: Layout_Cuentas_por_pagar;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varCliente: Cliente[] = [];

	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Layout_Cuentas_por_pagarService: Layout_Cuentas_por_pagarService,
    private ClienteService: ClienteService,

    private _seguridad: SeguridadService,	
    private spartanFileService: SpartanFileService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private _SpartanService: SpartanService,
    renderer: Renderer2) {
	this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Layout_Cuentas_por_pagar(this.fb);
    this.Layout_Cuentas_por_pagarForm = this.model.buildFormGroup();
	
	this.Layout_Cuentas_por_pagarForm.get('Folio').disable();
    this.Layout_Cuentas_por_pagarForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
		
          this.Layout_Cuentas_por_pagarForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Layout_Cuentas_por_pagar)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Layout_Cuentas_por_pagarService.listaSelAll(0, 1, 'Layout_Cuentas_por_pagar.Folio=' + id).toPromise();
	if (result.Layout_Cuentas_por_pagars.length > 0) {
	  
        this.model.fromObject(result.Layout_Cuentas_por_pagars[0]);

		this.Layout_Cuentas_por_pagarForm.markAllAsTouched();
		this.Layout_Cuentas_por_pagarForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Layout_Cuentas_por_pagarForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Folio);
        } else {
          this.operation = "New";
        }
        this.rulesOnInit();
      });
  }
  
  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.ClienteService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varCliente ]) => {
          this.varCliente = varCliente;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'RFC_Cliente': {
        this.ClienteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCliente = x.Clientes;
        });
        break;
      }
      case 'Descripcion_Cliente': {
        this.ClienteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCliente = x.Clientes;
        });
        break;
      }

      default: {
        break;
      }
    }
  }



  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Layout_Cuentas_por_pagarForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Layout_Cuentas_por_pagarService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Layout_Cuentas_por_pagarService.insert(entity).toPromise().then(async id => {

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          return id;
        }));
      }
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
      this.rulesAfterSave();
      this.isLoading = false;
      this.spinner.hide('loading');
    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0 ) {
      this.Layout_Cuentas_por_pagarForm.reset();
      this.model = new Layout_Cuentas_por_pagar(this.fb);
      this.Layout_Cuentas_por_pagarForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Layout_Cuentas_por_pagar/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }
  
  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Layout_Cuentas_por_pagar/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Folio_de_carga_manual_ExecuteBusinessRules(): void {
        //Folio_de_carga_manual_FieldExecuteBusinessRulesEnd
    }
    Fecha_ExecuteBusinessRules(): void {
        //Fecha_FieldExecuteBusinessRulesEnd
    }
    RFC_Cliente_ExecuteBusinessRules(): void {
        //RFC_Cliente_FieldExecuteBusinessRulesEnd
    }
    Descripcion_Cliente_ExecuteBusinessRules(): void {
        //Descripcion_Cliente_FieldExecuteBusinessRulesEnd
    }
    Facturacion_ExecuteBusinessRules(): void {
        //Facturacion_FieldExecuteBusinessRulesEnd
    }
    Cobranza_ExecuteBusinessRules(): void {
        //Cobranza_FieldExecuteBusinessRulesEnd
    }
    Saldo30dias_ExecuteBusinessRules(): void {
        //Saldo30dias_FieldExecuteBusinessRulesEnd
    }
    Saldo60dias_ExecuteBusinessRules(): void {
        //Saldo60dias_FieldExecuteBusinessRulesEnd
    }
    Saldo90dias_ExecuteBusinessRules(): void {
        //Saldo90dias_FieldExecuteBusinessRulesEnd
    }
    SaldoMayor180dias_ExecuteBusinessRules(): void {
        //SaldoMayor180dias_FieldExecuteBusinessRulesEnd
    }


  
  applyRules() { }
  
  filterComboObservable(): Observable<FilterCombo> {
    return this.filterComboEmiter.asObservable();
  }
  
  filterCombo(nameCombo: string, filter: string) {
    const filterCombo: FilterCombo = { nameCombo, filter };
    this.filterComboEmiter.next(filterCombo);
  }
  
  rulesAfterViewInit() {
  }
  
  rulesOnInit() {
//rulesOnInit_ExecuteBusinessRulesInit
//rulesOnInit_ExecuteBusinessRulesEnd
  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit
//rulesAfterSave_ExecuteBusinessRulesEnd
  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit
//rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas
  
}
