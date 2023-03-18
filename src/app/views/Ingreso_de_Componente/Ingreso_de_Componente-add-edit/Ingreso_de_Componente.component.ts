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
import { Ingreso_de_ComponenteService } from 'src/app/api-services/Ingreso_de_Componente.service';
import { Ingreso_de_Componente } from 'src/app/models/Ingreso_de_Componente';
import { PiezasService } from 'src/app/api-services/Piezas.service';
import { Piezas } from 'src/app/models/Piezas';
import { Tipos_de_Origen_del_ComponenteService } from 'src/app/api-services/Tipos_de_Origen_del_Componente.service';
import { Tipos_de_Origen_del_Componente } from 'src/app/models/Tipos_de_Origen_del_Componente';
import { Estatus_Parte_Asociada_al_ComponenteService } from 'src/app/api-services/Estatus_Parte_Asociada_al_Componente.service';
import { Estatus_Parte_Asociada_al_Componente } from 'src/app/models/Estatus_Parte_Asociada_al_Componente';
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
  selector: 'app-Ingreso_de_Componente',
  templateUrl: './Ingreso_de_Componente.component.html',
  styleUrls: ['./Ingreso_de_Componente.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Ingreso_de_ComponenteComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Ingreso_de_ComponenteForm: FormGroup;
	public Editor = ClassicEditor;
	model: Ingreso_de_Componente;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsN_Parte: Observable<Piezas[]>;
	hasOptionsN_Parte: boolean;
	isLoadingN_Parte: boolean;
	optionsDescripcion: Observable<Piezas[]>;
	hasOptionsDescripcion: boolean;
	isLoadingDescripcion: boolean;
	optionsOrigen_del_Componente: Observable<Tipos_de_Origen_del_Componente[]>;
	hasOptionsOrigen_del_Componente: boolean;
	isLoadingOrigen_del_Componente: boolean;
	optionsEstatus: Observable<Estatus_Parte_Asociada_al_Componente[]>;
	hasOptionsEstatus: boolean;
	isLoadingEstatus: boolean;
	optionsN_de_Serie: Observable<Piezas[]>;
	hasOptionsN_de_Serie: boolean;
	isLoadingN_de_Serie: boolean;
	optionsPosicion_de_la_pieza: Observable<Tipo_de_Posicion_de_Piezas[]>;
	hasOptionsPosicion_de_la_pieza: boolean;
	isLoadingPosicion_de_la_pieza: boolean;

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
    private Ingreso_de_ComponenteService: Ingreso_de_ComponenteService,
    private PiezasService: PiezasService,
    private Tipos_de_Origen_del_ComponenteService: Tipos_de_Origen_del_ComponenteService,
    private Estatus_Parte_Asociada_al_ComponenteService: Estatus_Parte_Asociada_al_ComponenteService,
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
    this.model = new Ingreso_de_Componente(this.fb);
    this.Ingreso_de_ComponenteForm = this.model.buildFormGroup();
	
	this.Ingreso_de_ComponenteForm.get('Folio').disable();
    this.Ingreso_de_ComponenteForm.get('Folio').setValue('Auto');
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
		
          this.Ingreso_de_ComponenteForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Ingreso_de_Componente)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Ingreso_de_ComponenteForm, 'N_Parte', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Ingreso_de_ComponenteForm, 'Descripcion', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Ingreso_de_ComponenteForm, 'Origen_del_Componente', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Ingreso_de_ComponenteForm, 'Estatus', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Ingreso_de_ComponenteForm, 'N_de_Serie', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Ingreso_de_ComponenteForm, 'Posicion_de_la_pieza', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Ingreso_de_ComponenteService.listaSelAll(0, 1, 'Ingreso_de_Componente.Folio=' + id).toPromise();
	if (result.Ingreso_de_Componentes.length > 0) {
	  
        this.model.fromObject(result.Ingreso_de_Componentes[0]);
        this.Ingreso_de_ComponenteForm.get('N_Parte').setValue(
          result.Ingreso_de_Componentes[0].N_Parte_Piezas.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Ingreso_de_ComponenteForm.get('Descripcion').setValue(
          result.Ingreso_de_Componentes[0].Descripcion_Piezas.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Ingreso_de_ComponenteForm.get('Origen_del_Componente').setValue(
          result.Ingreso_de_Componentes[0].Origen_del_Componente_Tipos_de_Origen_del_Componente.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Ingreso_de_ComponenteForm.get('Estatus').setValue(
          result.Ingreso_de_Componentes[0].Estatus_Estatus_Parte_Asociada_al_Componente.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Ingreso_de_ComponenteForm.get('N_de_Serie').setValue(
          result.Ingreso_de_Componentes[0].N_de_Serie_Piezas.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Ingreso_de_ComponenteForm.get('Posicion_de_la_pieza').setValue(
          result.Ingreso_de_Componentes[0].Posicion_de_la_pieza_Tipo_de_Posicion_de_Piezas.Descripcion,
          { onlySelf: false, emitEvent: true }
        );

		this.Ingreso_de_ComponenteForm.markAllAsTouched();
		this.Ingreso_de_ComponenteForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Ingreso_de_ComponenteForm.disabled ? "Update" : this.operation;
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

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([]) => {

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Ingreso_de_ComponenteForm.get('N_Parte').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingN_Parte = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PiezasService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PiezasService.listaSelAll(0, 20, '');
          return this.PiezasService.listaSelAll(0, 20,
            "Piezas.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PiezasService.listaSelAll(0, 20,
          "Piezas.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingN_Parte = false;
      this.hasOptionsN_Parte = result?.Piezass?.length > 0;
	  this.Ingreso_de_ComponenteForm.get('N_Parte').setValue(result?.Piezass[0], { onlySelf: true, emitEvent: false });
	  this.optionsN_Parte = of(result?.Piezass);
    }, error => {
      this.isLoadingN_Parte = false;
      this.hasOptionsN_Parte = false;
      this.optionsN_Parte = of([]);
    });
    this.Ingreso_de_ComponenteForm.get('Descripcion').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingDescripcion = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PiezasService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PiezasService.listaSelAll(0, 20, '');
          return this.PiezasService.listaSelAll(0, 20,
            "Piezas.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PiezasService.listaSelAll(0, 20,
          "Piezas.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingDescripcion = false;
      this.hasOptionsDescripcion = result?.Piezass?.length > 0;
	  this.Ingreso_de_ComponenteForm.get('Descripcion').setValue(result?.Piezass[0], { onlySelf: true, emitEvent: false });
	  this.optionsDescripcion = of(result?.Piezass);
    }, error => {
      this.isLoadingDescripcion = false;
      this.hasOptionsDescripcion = false;
      this.optionsDescripcion = of([]);
    });
    this.Ingreso_de_ComponenteForm.get('Origen_del_Componente').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingOrigen_del_Componente = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Tipos_de_Origen_del_ComponenteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Tipos_de_Origen_del_ComponenteService.listaSelAll(0, 20, '');
          return this.Tipos_de_Origen_del_ComponenteService.listaSelAll(0, 20,
            "Tipos_de_Origen_del_Componente.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Tipos_de_Origen_del_ComponenteService.listaSelAll(0, 20,
          "Tipos_de_Origen_del_Componente.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingOrigen_del_Componente = false;
      this.hasOptionsOrigen_del_Componente = result?.Tipos_de_Origen_del_Componentes?.length > 0;
	  this.Ingreso_de_ComponenteForm.get('Origen_del_Componente').setValue(result?.Tipos_de_Origen_del_Componentes[0], { onlySelf: true, emitEvent: false });
	  this.optionsOrigen_del_Componente = of(result?.Tipos_de_Origen_del_Componentes);
    }, error => {
      this.isLoadingOrigen_del_Componente = false;
      this.hasOptionsOrigen_del_Componente = false;
      this.optionsOrigen_del_Componente = of([]);
    });
    this.Ingreso_de_ComponenteForm.get('Estatus').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEstatus = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Estatus_Parte_Asociada_al_ComponenteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Estatus_Parte_Asociada_al_ComponenteService.listaSelAll(0, 20, '');
          return this.Estatus_Parte_Asociada_al_ComponenteService.listaSelAll(0, 20,
            "Estatus_Parte_Asociada_al_Componente.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Estatus_Parte_Asociada_al_ComponenteService.listaSelAll(0, 20,
          "Estatus_Parte_Asociada_al_Componente.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = result?.Estatus_Parte_Asociada_al_Componentes?.length > 0;
	  this.Ingreso_de_ComponenteForm.get('Estatus').setValue(result?.Estatus_Parte_Asociada_al_Componentes[0], { onlySelf: true, emitEvent: false });
	  this.optionsEstatus = of(result?.Estatus_Parte_Asociada_al_Componentes);
    }, error => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = false;
      this.optionsEstatus = of([]);
    });
    this.Ingreso_de_ComponenteForm.get('N_de_Serie').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingN_de_Serie = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PiezasService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PiezasService.listaSelAll(0, 20, '');
          return this.PiezasService.listaSelAll(0, 20,
            "Piezas.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PiezasService.listaSelAll(0, 20,
          "Piezas.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingN_de_Serie = false;
      this.hasOptionsN_de_Serie = result?.Piezass?.length > 0;
	  this.Ingreso_de_ComponenteForm.get('N_de_Serie').setValue(result?.Piezass[0], { onlySelf: true, emitEvent: false });
	  this.optionsN_de_Serie = of(result?.Piezass);
    }, error => {
      this.isLoadingN_de_Serie = false;
      this.hasOptionsN_de_Serie = false;
      this.optionsN_de_Serie = of([]);
    });
    this.Ingreso_de_ComponenteForm.get('Posicion_de_la_pieza').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPosicion_de_la_pieza = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Tipo_de_Posicion_de_PiezasService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Tipo_de_Posicion_de_PiezasService.listaSelAll(0, 20, '');
          return this.Tipo_de_Posicion_de_PiezasService.listaSelAll(0, 20,
            "Tipo_de_Posicion_de_Piezas.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Tipo_de_Posicion_de_PiezasService.listaSelAll(0, 20,
          "Tipo_de_Posicion_de_Piezas.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPosicion_de_la_pieza = false;
      this.hasOptionsPosicion_de_la_pieza = result?.Tipo_de_Posicion_de_Piezass?.length > 0;
	  this.Ingreso_de_ComponenteForm.get('Posicion_de_la_pieza').setValue(result?.Tipo_de_Posicion_de_Piezass[0], { onlySelf: true, emitEvent: false });
	  this.optionsPosicion_de_la_pieza = of(result?.Tipo_de_Posicion_de_Piezass);
    }, error => {
      this.isLoadingPosicion_de_la_pieza = false;
      this.hasOptionsPosicion_de_la_pieza = false;
      this.optionsPosicion_de_la_pieza = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

displayFnN_Parte(option: Piezas) {
    return option?.Descripcion;
  }
displayFnDescripcion(option: Piezas) {
    return option?.Descripcion;
  }
displayFnOrigen_del_Componente(option: Tipos_de_Origen_del_Componente) {
    return option?.Descripcion;
  }
displayFnEstatus(option: Estatus_Parte_Asociada_al_Componente) {
    return option?.Descripcion;
  }
displayFnN_de_Serie(option: Piezas) {
    return option?.Descripcion;
  }
displayFnPosicion_de_la_pieza(option: Tipo_de_Posicion_de_Piezas) {
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
      const entity = this.Ingreso_de_ComponenteForm.value;
      entity.Folio = this.model.Folio;
      entity.N_Parte = this.Ingreso_de_ComponenteForm.get('N_Parte').value.Codigo;
      entity.Descripcion = this.Ingreso_de_ComponenteForm.get('Descripcion').value.Codigo;
      entity.Origen_del_Componente = this.Ingreso_de_ComponenteForm.get('Origen_del_Componente').value.Clave;
      entity.Estatus = this.Ingreso_de_ComponenteForm.get('Estatus').value.Clave;
      entity.N_de_Serie = this.Ingreso_de_ComponenteForm.get('N_de_Serie').value.Codigo;
      entity.Posicion_de_la_pieza = this.Ingreso_de_ComponenteForm.get('Posicion_de_la_pieza').value.Clave;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Ingreso_de_ComponenteService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Ingreso_de_ComponenteService.insert(entity).toPromise().then(async id => {

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
      this.Ingreso_de_ComponenteForm.reset();
      this.model = new Ingreso_de_Componente(this.fb);
      this.Ingreso_de_ComponenteForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Ingreso_de_Componente/add']);
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
    this.router.navigate(['/Ingreso_de_Componente/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      N_Parte_ExecuteBusinessRules(): void {
        //N_Parte_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Origen_del_Componente_ExecuteBusinessRules(): void {
        //Origen_del_Componente_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
    }
    N_de_Serie_ExecuteBusinessRules(): void {
        //N_de_Serie_FieldExecuteBusinessRulesEnd
    }
    Posicion_de_la_pieza_ExecuteBusinessRules(): void {
        //Posicion_de_la_pieza_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Fabricacion_ExecuteBusinessRules(): void {
        //Fecha_de_Fabricacion_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Instalacion_ExecuteBusinessRules(): void {
        //Fecha_de_Instalacion_FieldExecuteBusinessRulesEnd
    }
    Fecha_Reparacion_ExecuteBusinessRules(): void {
        //Fecha_Reparacion_FieldExecuteBusinessRulesEnd
    }
    Horas_acumuladas_parte_ExecuteBusinessRules(): void {
        //Horas_acumuladas_parte_FieldExecuteBusinessRulesEnd
    }
    Ciclos_acumulados_parte_ExecuteBusinessRules(): void {
        //Ciclos_acumulados_parte_FieldExecuteBusinessRulesEnd
    }
    Horas_Acumuladas_Aeronave_ExecuteBusinessRules(): void {
        //Horas_Acumuladas_Aeronave_FieldExecuteBusinessRulesEnd
    }
    Ciclos_Acumulados_Aeronave_ExecuteBusinessRules(): void {
        //Ciclos_Acumulados_Aeronave_FieldExecuteBusinessRulesEnd
    }
    N_OT_ExecuteBusinessRules(): void {
        //N_OT_FieldExecuteBusinessRulesEnd
    }
    N_Reporte_ExecuteBusinessRules(): void {
        //N_Reporte_FieldExecuteBusinessRulesEnd
    }
    Alerta_en_horas_acumuladas_ExecuteBusinessRules(): void {
        //Alerta_en_horas_acumuladas_FieldExecuteBusinessRulesEnd
    }
    Alerta_en_ciclos_acumulados_ExecuteBusinessRules(): void {
        //Alerta_en_ciclos_acumulados_FieldExecuteBusinessRulesEnd
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
