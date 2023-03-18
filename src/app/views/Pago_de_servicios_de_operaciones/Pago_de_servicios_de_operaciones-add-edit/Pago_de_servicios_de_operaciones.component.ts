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
import { Pago_de_servicios_de_operacionesService } from 'src/app/api-services/Pago_de_servicios_de_operaciones.service';
import { Pago_de_servicios_de_operaciones } from 'src/app/models/Pago_de_servicios_de_operaciones';
import { Solicitud_de_Servicios_para_OperacionesService } from 'src/app/api-services/Solicitud_de_Servicios_para_Operaciones.service';
import { Solicitud_de_Servicios_para_Operaciones } from 'src/app/models/Solicitud_de_Servicios_para_Operaciones';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';

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
  selector: 'app-Pago_de_servicios_de_operaciones',
  templateUrl: './Pago_de_servicios_de_operaciones.component.html',
  styleUrls: ['./Pago_de_servicios_de_operaciones.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Pago_de_servicios_de_operacionesComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Pago_de_servicios_de_operacionesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Pago_de_servicios_de_operaciones;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varSolicitud_de_Servicios_para_Operaciones: Solicitud_de_Servicios_para_Operaciones[] = [];
	public varCreacion_de_Proveedores: Creacion_de_Proveedores[] = [];
	public varSolicitud_de_Vuelo: Solicitud_de_Vuelo[] = [];
	public varAeropuertos: Aeropuertos[] = [];
	public varUnidad: Unidad[] = [];
	public varEstatus_de_Seguimiento: Estatus_de_Seguimiento[] = [];

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
    private Pago_de_servicios_de_operacionesService: Pago_de_servicios_de_operacionesService,
    private Solicitud_de_Servicios_para_OperacionesService: Solicitud_de_Servicios_para_OperacionesService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeropuertosService: AeropuertosService,
    private UnidadService: UnidadService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,

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
    this.model = new Pago_de_servicios_de_operaciones(this.fb);
    this.Pago_de_servicios_de_operacionesForm = this.model.buildFormGroup();
	
	this.Pago_de_servicios_de_operacionesForm.get('Folio').disable();
    this.Pago_de_servicios_de_operacionesForm.get('Folio').setValue('Auto');
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
		
          this.Pago_de_servicios_de_operacionesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Pago_de_servicios_de_operaciones)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Pago_de_servicios_de_operacionesService.listaSelAll(0, 1, 'Pago_de_servicios_de_operaciones.Folio=' + id).toPromise();
	if (result.Pago_de_servicios_de_operacioness.length > 0) {
	  
        this.model.fromObject(result.Pago_de_servicios_de_operacioness[0]);

		this.Pago_de_servicios_de_operacionesForm.markAllAsTouched();
		this.Pago_de_servicios_de_operacionesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Pago_de_servicios_de_operacionesForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Solicitud_de_Servicios_para_OperacionesService.getAll());
    observablesArray.push(this.Creacion_de_ProveedoresService.getAll());
    observablesArray.push(this.Solicitud_de_VueloService.getAll());
    observablesArray.push(this.AeropuertosService.getAll());
    observablesArray.push(this.UnidadService.getAll());
    observablesArray.push(this.Estatus_de_SeguimientoService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varSolicitud_de_Servicios_para_Operaciones , varCreacion_de_Proveedores , varSolicitud_de_Vuelo , varAeropuertos , varUnidad , varEstatus_de_Seguimiento ]) => {
          this.varSolicitud_de_Servicios_para_Operaciones = varSolicitud_de_Servicios_para_Operaciones;
          this.varCreacion_de_Proveedores = varCreacion_de_Proveedores;
          this.varSolicitud_de_Vuelo = varSolicitud_de_Vuelo;
          this.varAeropuertos = varAeropuertos;
          this.varUnidad = varUnidad;
          this.varEstatus_de_Seguimiento = varEstatus_de_Seguimiento;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'No_de_Solicitud': {
        this.Solicitud_de_Servicios_para_OperacionesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSolicitud_de_Servicios_para_Operaciones = x.Solicitud_de_Servicios_para_Operacioness;
        });
        break;
      }
      case 'Proveedor': {
        this.Creacion_de_ProveedoresService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCreacion_de_Proveedores = x.Creacion_de_Proveedoress;
        });
        break;
      }
      case 'No_Vuelo': {
        this.Solicitud_de_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSolicitud_de_Vuelo = x.Solicitud_de_Vuelos;
        });
        break;
      }
      case 'Aeropuerto': {
        this.AeropuertosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAeropuertos = x.Aeropuertoss;
        });
        break;
      }
      case 'Unidad': {
        this.UnidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUnidad = x.Unidads;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_de_SeguimientoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Seguimiento = x.Estatus_de_Seguimientos;
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
      const entity = this.Pago_de_servicios_de_operacionesForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Pago_de_servicios_de_operacionesService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Pago_de_servicios_de_operacionesService.insert(entity).toPromise().then(async id => {

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
      this.Pago_de_servicios_de_operacionesForm.reset();
      this.model = new Pago_de_servicios_de_operaciones(this.fb);
      this.Pago_de_servicios_de_operacionesForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Pago_de_servicios_de_operaciones/add']);
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
    this.router.navigate(['/Pago_de_servicios_de_operaciones/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      IdLisPagServOp_ExecuteBusinessRules(): void {
        //IdLisPagServOp_FieldExecuteBusinessRulesEnd
    }
    No_de_Solicitud_ExecuteBusinessRules(): void {
        //No_de_Solicitud_FieldExecuteBusinessRulesEnd
    }
    Proveedor_ExecuteBusinessRules(): void {
        //Proveedor_FieldExecuteBusinessRulesEnd
    }
    No_Vuelo_ExecuteBusinessRules(): void {
        //No_Vuelo_FieldExecuteBusinessRulesEnd
    }
    Aeropuerto_ExecuteBusinessRules(): void {
        //Aeropuerto_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Cantidad_ExecuteBusinessRules(): void {
        //Cantidad_FieldExecuteBusinessRulesEnd
    }
    Unidad_ExecuteBusinessRules(): void {
        //Unidad_FieldExecuteBusinessRulesEnd
    }
    Costo_ExecuteBusinessRules(): void {
        //Costo_FieldExecuteBusinessRulesEnd
    }
    No_de_Factura_ExecuteBusinessRules(): void {
        //No_de_Factura_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Factura_ExecuteBusinessRules(): void {
        //Fecha_de_Factura_FieldExecuteBusinessRulesEnd
    }
    Tiempos_de_Pago_ExecuteBusinessRules(): void {
        //Tiempos_de_Pago_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
    }
    No_de_Referencia_ExecuteBusinessRules(): void {
        //No_de_Referencia_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Ejecucion_del_Pago_ExecuteBusinessRules(): void {
        //Fecha_de_Ejecucion_del_Pago_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4691 - Ocultar "Folio" y "IdLisPagServOp" Pago_de_servicios_de_operaciones - Autor: Agustín Administrador - Actualización: 8/5/2021 7:09:49 PM
if(  this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Pago_de_servicios_de_operacionesForm, "Folio"); this.brf.SetNotRequiredControl(this.Pago_de_servicios_de_operacionesForm, "Folio");this.brf.HideFieldOfForm(this.Pago_de_servicios_de_operacionesForm, "IdLisPagServOp"); this.brf.SetNotRequiredControl(this.Pago_de_servicios_de_operacionesForm, "IdLisPagServOp"); this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'IdLisPagServOp', 0);
} 
//TERMINA - BRID:4691


//INICIA - BRID:4692 - Deshabilitar campos excepto "No. de Referencia" y "Fecha de Ejecución del Pago" Pago_de_servicios_de_operaciones - Autor: Agustín Administrador - Actualización: 8/5/2021 7:11:16 PM
if(  this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'No_de_Solicitud', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'Proveedor', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'No_Vuelo', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'Aeropuerto', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'Descripcion', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'Cantidad', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'Unidad', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'Costo', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'No_de_Factura', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'Fecha_de_Factura', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'Tiempos_de_Pago', 0);this.brf.SetEnabledControl(this.Pago_de_servicios_de_operacionesForm, 'Estatus', 0);
} 
//TERMINA - BRID:4692


//INICIA - BRID:4693 - Acomodo de campos Pago_de_servicios_de_operaciones - Autor: Agustín Administrador - Actualización: 8/5/2021 7:13:29 PM
if(  this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4693

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
