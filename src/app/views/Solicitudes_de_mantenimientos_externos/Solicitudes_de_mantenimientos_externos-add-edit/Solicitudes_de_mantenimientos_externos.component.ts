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
import { Solicitudes_de_mantenimientos_externosService } from 'src/app/api-services/Solicitudes_de_mantenimientos_externos.service';
import { Solicitudes_de_mantenimientos_externos } from 'src/app/models/Solicitudes_de_mantenimientos_externos';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';

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
  selector: 'app-Solicitudes_de_mantenimientos_externos',
  templateUrl: './Solicitudes_de_mantenimientos_externos.component.html',
  styleUrls: ['./Solicitudes_de_mantenimientos_externos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Solicitudes_de_mantenimientos_externosComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Solicitudes_de_mantenimientos_externosForm: FormGroup;
	public Editor = ClassicEditor;
	model: Solicitudes_de_mantenimientos_externos;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;
	optionsN_Reporte: Observable<Crear_Reporte[]>;
	hasOptionsN_Reporte: boolean;
	isLoadingN_Reporte: boolean;
	optionsPropietario: Observable<Propietarios[]>;
	hasOptionsPropietario: boolean;
	isLoadingPropietario: boolean;
	optionsProveedor: Observable<Creacion_de_Proveedores[]>;
	hasOptionsProveedor: boolean;
	isLoadingProveedor: boolean;

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
    private Solicitudes_de_mantenimientos_externosService: Solicitudes_de_mantenimientos_externosService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Crear_ReporteService: Crear_ReporteService,
    private PropietariosService: PropietariosService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,

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
    this.model = new Solicitudes_de_mantenimientos_externos(this.fb);
    this.Solicitudes_de_mantenimientos_externosForm = this.model.buildFormGroup();
	
	this.Solicitudes_de_mantenimientos_externosForm.get('Folio').disable();
    this.Solicitudes_de_mantenimientos_externosForm.get('Folio').setValue('Auto');
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
		
          this.Solicitudes_de_mantenimientos_externosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Solicitudes_de_mantenimientos_externos)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Solicitudes_de_mantenimientos_externosForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitudes_de_mantenimientos_externosForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitudes_de_mantenimientos_externosForm, 'N_Reporte', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitudes_de_mantenimientos_externosForm, 'Propietario', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitudes_de_mantenimientos_externosForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Solicitudes_de_mantenimientos_externosService.listaSelAll(0, 1, 'Solicitudes_de_mantenimientos_externos.Folio=' + id).toPromise();
	if (result.Solicitudes_de_mantenimientos_externoss.length > 0) {
	  
        this.model.fromObject(result.Solicitudes_de_mantenimientos_externoss[0]);
        this.Solicitudes_de_mantenimientos_externosForm.get('Matricula').setValue(
          result.Solicitudes_de_mantenimientos_externoss[0].Matricula_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitudes_de_mantenimientos_externosForm.get('Modelo').setValue(
          result.Solicitudes_de_mantenimientos_externoss[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitudes_de_mantenimientos_externosForm.get('N_Reporte').setValue(
          result.Solicitudes_de_mantenimientos_externoss[0].N_Reporte_Crear_Reporte.No_Reporte,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitudes_de_mantenimientos_externosForm.get('Propietario').setValue(
          result.Solicitudes_de_mantenimientos_externoss[0].Propietario_Propietarios.Nombre,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitudes_de_mantenimientos_externosForm.get('Proveedor').setValue(
          result.Solicitudes_de_mantenimientos_externoss[0].Proveedor_Creacion_de_Proveedores.Razon_social,
          { onlySelf: false, emitEvent: true }
        );

		this.Solicitudes_de_mantenimientos_externosForm.markAllAsTouched();
		this.Solicitudes_de_mantenimientos_externosForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Solicitudes_de_mantenimientos_externosForm.disabled ? "Update" : this.operation;
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

    this.Solicitudes_de_mantenimientos_externosForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeronaveService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeronaveService.listaSelAll(0, 20, '');
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Matricula like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeronaveService.listaSelAll(0, 20,
          "Aeronave.Matricula like '%" + value.Matricula.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = result?.Aeronaves?.length > 0;
	  this.Solicitudes_de_mantenimientos_externosForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
	  this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Solicitudes_de_mantenimientos_externosForm.get('Modelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingModelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.ModelosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.ModelosService.listaSelAll(0, 20, '');
          return this.ModelosService.listaSelAll(0, 20,
            "Modelos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.ModelosService.listaSelAll(0, 20,
          "Modelos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = result?.Modeloss?.length > 0;
	  this.Solicitudes_de_mantenimientos_externosForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
	  this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Solicitudes_de_mantenimientos_externosForm.get('N_Reporte').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingN_Reporte = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Crear_ReporteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Crear_ReporteService.listaSelAll(0, 20, '');
          return this.Crear_ReporteService.listaSelAll(0, 20,
            "Crear_Reporte.No_Reporte like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Crear_ReporteService.listaSelAll(0, 20,
          "Crear_Reporte.No_Reporte like '%" + value.No_Reporte.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingN_Reporte = false;
      this.hasOptionsN_Reporte = result?.Crear_Reportes?.length > 0;
	  this.Solicitudes_de_mantenimientos_externosForm.get('N_Reporte').setValue(result?.Crear_Reportes[0], { onlySelf: true, emitEvent: false });
	  this.optionsN_Reporte = of(result?.Crear_Reportes);
    }, error => {
      this.isLoadingN_Reporte = false;
      this.hasOptionsN_Reporte = false;
      this.optionsN_Reporte = of([]);
    });
    this.Solicitudes_de_mantenimientos_externosForm.get('Propietario').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPropietario = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PropietariosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PropietariosService.listaSelAll(0, 20, '');
          return this.PropietariosService.listaSelAll(0, 20,
            "Propietarios.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PropietariosService.listaSelAll(0, 20,
          "Propietarios.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPropietario = false;
      this.hasOptionsPropietario = result?.Propietarioss?.length > 0;
	  this.Solicitudes_de_mantenimientos_externosForm.get('Propietario').setValue(result?.Propietarioss[0], { onlySelf: true, emitEvent: false });
	  this.optionsPropietario = of(result?.Propietarioss);
    }, error => {
      this.isLoadingPropietario = false;
      this.hasOptionsPropietario = false;
      this.optionsPropietario = of([]);
    });
    this.Solicitudes_de_mantenimientos_externosForm.get('Proveedor').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingProveedor = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Razon_social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Razon_social like '%" + value.Razon_social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = result?.Creacion_de_Proveedoress?.length > 0;
	  this.Solicitudes_de_mantenimientos_externosForm.get('Proveedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
	  this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
displayFnN_Reporte(option: Crear_Reporte) {
    return option?.No_Reporte;
  }
displayFnPropietario(option: Propietarios) {
    return option?.Nombre;
  }
displayFnProveedor(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Solicitudes_de_mantenimientos_externosForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Solicitudes_de_mantenimientos_externosForm.get('Matricula').value.Matricula;
      entity.Modelo = this.Solicitudes_de_mantenimientos_externosForm.get('Modelo').value.Clave;
      entity.N_Reporte = this.Solicitudes_de_mantenimientos_externosForm.get('N_Reporte').value.Folio;
      entity.Propietario = this.Solicitudes_de_mantenimientos_externosForm.get('Propietario').value.Folio;
      entity.Proveedor = this.Solicitudes_de_mantenimientos_externosForm.get('Proveedor').value.Clave;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Solicitudes_de_mantenimientos_externosService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Solicitudes_de_mantenimientos_externosService.insert(entity).toPromise().then(async id => {

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
      this.Solicitudes_de_mantenimientos_externosForm.reset();
      this.model = new Solicitudes_de_mantenimientos_externos(this.fb);
      this.Solicitudes_de_mantenimientos_externosForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Solicitudes_de_mantenimientos_externos/add']);
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
    this.router.navigate(['/Solicitudes_de_mantenimientos_externos/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Matricula_ExecuteBusinessRules(): void {

//INICIA - BRID:4656 - Asignar valor de campos al seleccionar matricula - Autor: Aaron - Actualización: 8/5/2021 10:48:17 AM
this.brf.SetValueFromQuery(this.Solicitudes_de_mantenimientos_externosForm,"Modelo",this.brf.EvaluaQuery(" Select Modelo From Aeronave Where Matricula = 'FLD[Matricula]'", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Solicitudes_de_mantenimientos_externosForm,"Propietario",this.brf.EvaluaQuery(" Select Propietario from Aeronave Where Matricula = 'FLD[Matricula]'", 1, "ABC123"),1,"ABC123");
//TERMINA - BRID:4656

//Matricula_FieldExecuteBusinessRulesEnd

    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    N_Reporte_ExecuteBusinessRules(): void {
        //N_Reporte_FieldExecuteBusinessRulesEnd
    }
    Propietario_ExecuteBusinessRules(): void {
        //Propietario_FieldExecuteBusinessRulesEnd
    }
    Proveedor_ExecuteBusinessRules(): void {
        //Proveedor_FieldExecuteBusinessRulesEnd
    }
    N_Servicio_ExecuteBusinessRules(): void {
        //N_Servicio_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Costo_pieza_ExecuteBusinessRules(): void {
        //Costo_pieza_FieldExecuteBusinessRulesEnd
    }
    Costo_total_ExecuteBusinessRules(): void {
        //Costo_total_FieldExecuteBusinessRulesEnd
    }
    Nuevo_costo_ExecuteBusinessRules(): void {
        //Nuevo_costo_FieldExecuteBusinessRulesEnd
    }
    Nuevo_monto_negociado_ExecuteBusinessRules(): void {

//INICIA - BRID:4659 - Validar el Nuevo monto negociado - Autor: Aaron - Actualización: 8/5/2021 10:46:22 AM
if( this.brf.GetValueByControlType(this.Solicitudes_de_mantenimientos_externosForm, 'Nuevo_costo')>this.brf.GetValueByControlType(this.Solicitudes_de_mantenimientos_externosForm, 'Nuevo_monto_negociado') ) { this.brf.ShowMessage("El Nuevo Monto Negociado no puede ser menor al Nuevo Costo, favor de verificar la información ingresada."); this.brf.SetValueFromQuery(this.Solicitudes_de_mantenimientos_externosForm,"Nuevo_monto_negociado",this.brf.EvaluaQuery(" Select ''", 1, "ABC123"),1,"ABC123");} else {}
//TERMINA - BRID:4659

//Nuevo_monto_negociado_FieldExecuteBusinessRulesEnd

    }
    Observaciones_ExecuteBusinessRules(): void {
        //Observaciones_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4045 - Ocultar "Folio" Solicitudes de mantenimiento - Autor: Administrador - Actualización: 7/1/2021 5:20:02 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Solicitudes_de_mantenimientos_externosForm, "Folio"); this.brf.SetNotRequiredControl(this.Solicitudes_de_mantenimientos_externosForm, "Folio");
} 
//TERMINA - BRID:4045


//INICIA - BRID:4049 - Asignar no requerido y ocultar campos de nuevo monto negociado y observaciones al nuevo - Autor: Administrador - Actualización: 7/1/2021 5:35:40 PM
if(  this.operation == 'New' ) {
this.brf.SetNotRequiredControl(this.Solicitudes_de_mantenimientos_externosForm, "Nuevo_monto_negociado");this.brf.SetNotRequiredControl(this.Solicitudes_de_mantenimientos_externosForm, "Observaciones"); this.brf.HideFieldOfForm(this.Solicitudes_de_mantenimientos_externosForm, "Nuevo_monto_negociado"); this.brf.SetNotRequiredControl(this.Solicitudes_de_mantenimientos_externosForm, "Nuevo_monto_negociado");this.brf.HideFieldOfForm(this.Solicitudes_de_mantenimientos_externosForm, "Observaciones"); this.brf.SetNotRequiredControl(this.Solicitudes_de_mantenimientos_externosForm, "Observaciones");
} 
//TERMINA - BRID:4049


//INICIA - BRID:4054 - Mostrar campos nuevo monto negociado y observaciones al editar. - Autor: Administrador - Actualización: 7/2/2021 10:46:25 AM
if(  this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Solicitudes_de_mantenimientos_externosForm, "Nuevo_monto_negociado");this.brf.HideFieldOfForm(this.Solicitudes_de_mantenimientos_externosForm, "Observaciones");
} 
//TERMINA - BRID:4054


//INICIA - BRID:4057 - Distribución de campos. - Autor: Administrador - Actualización: 7/2/2021 11:47:07 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4057


//INICIA - BRID:4076 - Inhabilitar campos llenos al editar. - Autor: Administrador - Actualización: 7/6/2021 4:34:04 PM
if(  this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Matricula', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Modelo', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'N_Reporte', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Propietario', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Proveedor', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'N_Servicio', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Descripcion', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Costo_pieza', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Costo_total', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Nuevo_costo', 0);
} 
//TERMINA - BRID:4076


//INICIA - BRID:4653 - Deshabilitar campos automaticos de aeronave - Autor: Aaron - Actualización: 8/5/2021 10:48:06 AM
if(  this.operation == 'New' ) {
this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Modelo', 0);this.brf.SetEnabledControl(this.Solicitudes_de_mantenimientos_externosForm, 'Propietario', 0);
} 
//TERMINA - BRID:4653


//INICIA - BRID:4655 - Filtrar Autocomplete - Autor: Aaron - Actualización: 8/4/2021 7:46:25 PM
if(  this.operation == 'New' ) {

} 
//TERMINA - BRID:4655


//INICIA - BRID:4657 - Ocultar pestaña Negociación al nuevo - Autor: Aaron - Actualización: 8/4/2021 8:20:27 PM
if(  this.operation == 'New' ) {
this.brf.HideFolder("Negociacion");
} 
//TERMINA - BRID:4657

//rulesOnInit_ExecuteBusinessRulesEnd








  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit
//rulesAfterSave_ExecuteBusinessRulesEnd
  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:4658 - Validar que Nuevo Monto sea mayor a Nuevo costo - Autor: Aaron - Actualización: 8/5/2021 10:38:27 AM
if(  this.operation == 'Update' ) {
if( this.brf.GetValueByControlType(this.Solicitudes_de_mantenimientos_externosForm, 'Nuevo_monto_negociado')<this.brf.GetValueByControlType(this.Solicitudes_de_mantenimientos_externosForm, 'Nuevo_costo') ) { this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery(" Select 'El Nuevo Monto Negociado no puede ser menor al Nuevo Costo, favor de verificar la información ingresada.'", 1, "ABC123"),1,"ABC123");

result=false;} else {}
} 
//TERMINA - BRID:4658

//rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas
  
}
