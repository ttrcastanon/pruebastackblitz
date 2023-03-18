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
import { PiezasService } from 'src/app/api-services/Piezas.service';
import { Piezas } from 'src/app/models/Piezas';
import { Tipo_de_Posicion_de_PiezasService } from 'src/app/api-services/Tipo_de_Posicion_de_Piezas.service';
import { Tipo_de_Posicion_de_Piezas } from 'src/app/models/Tipo_de_Posicion_de_Piezas';

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
  selector: 'app-Piezas',
  templateUrl: './Piezas.component.html',
  styleUrls: ['./Piezas.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PiezasComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	PiezasForm: FormGroup;
	public Editor = ClassicEditor;
	model: Piezas;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varTipo_de_Posicion_de_Piezas: Tipo_de_Posicion_de_Piezas[] = [];

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
    private PiezasService: PiezasService,
    private Tipo_de_Posicion_de_PiezasService: Tipo_de_Posicion_de_PiezasService,

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
    this.model = new Piezas(this.fb);
    this.PiezasForm = this.model.buildFormGroup();
	
	this.PiezasForm.get('Codigo').disable();
    this.PiezasForm.get('Codigo').setValue('Auto');
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
		
          this.PiezasForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Piezas)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: string) {
  
    this.spinner.show('loading');
	let result =  await this.PiezasService.listaSelAll(0, 1, 'Piezas.Codigo=' + id).toPromise();
	if (result.Piezass.length > 0) {
	  
        this.model.fromObject(result.Piezass[0]);

		this.PiezasForm.markAllAsTouched();
		this.PiezasForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Codigo = params.get('id');

        if (this.model.Codigo) {
          this.operation = !this.PiezasForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Codigo);
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
    observablesArray.push(this.Tipo_de_Posicion_de_PiezasService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varTipo_de_Posicion_de_Piezas ]) => {
          this.varTipo_de_Posicion_de_Piezas = varTipo_de_Posicion_de_Piezas;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Posicion': {
        this.Tipo_de_Posicion_de_PiezasService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Posicion_de_Piezas = x.Tipo_de_Posicion_de_Piezass;
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
      const entity = this.PiezasForm.value;
      entity.Codigo = this.model.Codigo;
	  	  
	  
	  if (this.model.Codigo != '' ) {
        await this.PiezasService.updateString(this.model.Codigo, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Codigo.toString());
        this.spinner.hide('loading');
        return this.model.Codigo;
      } else {
        await (this.PiezasService.insert(entity).toPromise().then(async id => {

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
    if (this.model.Codigo === '0' ) {
      this.PiezasForm.reset();
      this.model = new Piezas(this.fb);
      this.PiezasForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Piezas/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Codigo = '0';

  }
  
  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Piezas/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Codigo_ExecuteBusinessRules(): void {
        //Codigo_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Instalacion_ExecuteBusinessRules(): void {
        //Instalacion_FieldExecuteBusinessRulesEnd
    }
    N_de_Serie_ExecuteBusinessRules(): void {
        //N_de_Serie_FieldExecuteBusinessRulesEnd
    }
    Posicion_ExecuteBusinessRules(): void {
        //Posicion_FieldExecuteBusinessRulesEnd
    }
    OT_ExecuteBusinessRules(): void {
        //OT_FieldExecuteBusinessRulesEnd
    }
    Periodicidad_meses_ExecuteBusinessRules(): void {
        //Periodicidad_meses_FieldExecuteBusinessRulesEnd
    }
    Vencimiento_ExecuteBusinessRules(): void {
        //Vencimiento_FieldExecuteBusinessRulesEnd
    }
    Descripcion_Busqueda_ExecuteBusinessRules(): void {
        //Descripcion_Busqueda_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:258 - Al abrir la pantalla en nuevo, modificar y consultar ocultar el campo Descripción Busqueda - Autor: Lizeth Villa - Actualización: 2/9/2021 8:00:53 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.PiezasForm, "Descripcion_Busqueda"); this.brf.SetNotRequiredControl(this.PiezasForm, "Descripcion_Busqueda");
} 
//TERMINA - BRID:258

//rulesOnInit_ExecuteBusinessRulesEnd

  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit
//rulesAfterSave_ExecuteBusinessRulesEnd
  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:253 - Antes de guardar, en nuevo y modificar, concatenar el código y la descripción - Autor: Lizeth Villa - Actualización: 2/9/2021 7:11:55 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetValueFromQuery(this.PiezasForm,"Descripcion_Busqueda",this.brf.EvaluaQuery("SELECT ('FLD[Codigo]'+ ' - ' + 'FLD[Descripcion]')@LC@@LB@ ", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:253

//rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas
  
}
