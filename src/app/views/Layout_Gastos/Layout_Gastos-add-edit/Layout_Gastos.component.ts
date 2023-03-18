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
import { Layout_GastosService } from 'src/app/api-services/Layout_Gastos.service';
import { Layout_Gastos } from 'src/app/models/Layout_Gastos';
import { Tipo_ConceptoService } from 'src/app/api-services/Tipo_Concepto.service';
import { Tipo_Concepto } from 'src/app/models/Tipo_Concepto';
import { Tipo_de_GastoService } from 'src/app/api-services/Tipo_de_Gasto.service';
import { Tipo_de_Gasto } from 'src/app/models/Tipo_de_Gasto';
import { ConceptoService } from 'src/app/api-services/Concepto.service';
import { Concepto } from 'src/app/models/Concepto';

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
  selector: 'app-Layout_Gastos',
  templateUrl: './Layout_Gastos.component.html',
  styleUrls: ['./Layout_Gastos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Layout_GastosComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Layout_GastosForm: FormGroup;
	public Editor = ClassicEditor;
	model: Layout_Gastos;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varTipo_Concepto: Tipo_Concepto[] = [];
	public varTipo_de_Gasto: Tipo_de_Gasto[] = [];
	optionsConcepto: Observable<Concepto[]>;
	hasOptionsConcepto: boolean;
	isLoadingConcepto: boolean;

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
    private Layout_GastosService: Layout_GastosService,
    private Tipo_ConceptoService: Tipo_ConceptoService,
    private Tipo_de_GastoService: Tipo_de_GastoService,
    private ConceptoService: ConceptoService,

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
    this.model = new Layout_Gastos(this.fb);
    this.Layout_GastosForm = this.model.buildFormGroup();
	
	this.Layout_GastosForm.get('Folio').disable();
    this.Layout_GastosForm.get('Folio').setValue('Auto');
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
		
          this.Layout_GastosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Layout_Gastos)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Layout_GastosForm, 'Concepto', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Layout_GastosService.listaSelAll(0, 1, 'Layout_Gastos.Folio=' + id).toPromise();
	if (result.Layout_Gastoss.length > 0) {
	  
        this.model.fromObject(result.Layout_Gastoss[0]);
        this.Layout_GastosForm.get('Concepto').setValue(
          result.Layout_Gastoss[0].Concepto_Concepto.Descripcion,
          { onlySelf: false, emitEvent: true }
        );

		this.Layout_GastosForm.markAllAsTouched();
		this.Layout_GastosForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Layout_GastosForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_ConceptoService.getAll());
    observablesArray.push(this.Tipo_de_GastoService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varTipo_Concepto , varTipo_de_Gasto ]) => {
          this.varTipo_Concepto = varTipo_Concepto;
          this.varTipo_de_Gasto = varTipo_de_Gasto;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Layout_GastosForm.get('Concepto').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingConcepto = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.ConceptoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.ConceptoService.listaSelAll(0, 20, '');
          return this.ConceptoService.listaSelAll(0, 20,
            "Concepto.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.ConceptoService.listaSelAll(0, 20,
          "Concepto.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingConcepto = false;
      this.hasOptionsConcepto = result?.Conceptos?.length > 0;
	  this.Layout_GastosForm.get('Concepto').setValue(result?.Conceptos[0], { onlySelf: true, emitEvent: false });
	  this.optionsConcepto = of(result?.Conceptos);
    }, error => {
      this.isLoadingConcepto = false;
      this.hasOptionsConcepto = false;
      this.optionsConcepto = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'TipoConcepto': {
        this.Tipo_ConceptoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_Concepto = x.Tipo_Conceptos;
        });
        break;
      }
      case 'TipoGasto': {
        this.Tipo_de_GastoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Gasto = x.Tipo_de_Gastos;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

displayFnConcepto(option: Concepto) {
    return option?.Descripcion;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Layout_GastosForm.value;
      entity.Folio = this.model.Folio;
      entity.Concepto = this.Layout_GastosForm.get('Concepto').value.Clave;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Layout_GastosService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Layout_GastosService.insert(entity).toPromise().then(async id => {

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
      this.Layout_GastosForm.reset();
      this.model = new Layout_Gastos(this.fb);
      this.Layout_GastosForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Layout_Gastos/add']);
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
    this.router.navigate(['/Layout_Gastos/list'], { state: { data: this.dataListConfig } });
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
    TipoConcepto_ExecuteBusinessRules(): void {
        //TipoConcepto_FieldExecuteBusinessRulesEnd
    }
    TipoGasto_ExecuteBusinessRules(): void {
        //TipoGasto_FieldExecuteBusinessRulesEnd
    }
    Concepto_ExecuteBusinessRules(): void {
        //Concepto_FieldExecuteBusinessRulesEnd
    }
    Real_ExecuteBusinessRules(): void {
        //Real_FieldExecuteBusinessRulesEnd
    }
    Presupuesto_ExecuteBusinessRules(): void {
        //Presupuesto_FieldExecuteBusinessRulesEnd
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
