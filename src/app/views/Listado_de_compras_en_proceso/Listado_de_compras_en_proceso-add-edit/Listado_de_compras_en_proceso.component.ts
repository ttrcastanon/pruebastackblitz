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
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise, filter } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { off } from 'process';
import * as ts from 'typescript';

import { GeneralService } from 'src/app/api-services/general.service';
import { Listado_de_compras_en_procesoService } from 'src/app/api-services/Listado_de_compras_en_proceso.service';
import { Listado_de_compras_en_proceso } from 'src/app/models/Listado_de_compras_en_proceso';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Departamento } from 'src/app/models/Departamento';
import { Categoria_de_PartesService } from 'src/app/api-services/Categoria_de_Partes.service';
import { Categoria_de_Partes } from 'src/app/models/Categoria_de_Partes';
import { Estatus_de_Seguimiento_de_MaterialesService } from 'src/app/api-services/Estatus_de_Seguimiento_de_Materiales.service';
import { Estatus_de_Seguimiento_de_Materiales } from 'src/app/models/Estatus_de_Seguimiento_de_Materiales';
import { Detalle_Listado_de_compras_en_procesoService } from 'src/app/api-services/Detalle_Listado_de_compras_en_proceso.service';
import { Detalle_Listado_de_compras_en_proceso } from 'src/app/models/Detalle_Listado_de_compras_en_proceso';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Costos_de_ImportacionService } from 'src/app/api-services/Costos_de_Importacion.service';
import { Costos_de_Importacion } from 'src/app/models/Costos_de_Importacion';
import { Ingreso_a_almacenService } from 'src/app/api-services/Ingreso_a_almacen.service';
import { Ingreso_a_almacen } from 'src/app/models/Ingreso_a_almacen';
import { Notificacion_de_rechazo_al_ingreso_de_almacenService } from 'src/app/api-services/Notificacion_de_rechazo_al_ingreso_de_almacen.service';
import { Notificacion_de_rechazo_al_ingreso_de_almacen } from 'src/app/models/Notificacion_de_rechazo_al_ingreso_de_almacen';


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
import { element } from 'protractor';

@Component({
  selector: 'app-Listado_de_compras_en_proceso',
  templateUrl: './Listado_de_compras_en_proceso.component.html',
  styleUrls: ['./Listado_de_compras_en_proceso.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Listado_de_compras_en_procesoComponent implements OnInit, AfterViewInit {
MRaddCompras_en_proceso: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Listado_de_compras_en_procesoForm: FormGroup;
	public Editor = ClassicEditor;
	model: Listado_de_compras_en_proceso;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsNo__de_OC: Observable<Generacion_de_Orden_de_Compras[]>;
	hasOptionsNo__de_OC: boolean;
	isLoadingNo__de_OC: boolean;
	optionsProveedor: Observable<Creacion_de_Proveedores[]>;
	hasOptionsProveedor: boolean;
	isLoadingProveedor: boolean;
	optionsDepartamento: Observable<Departamento[]>;
	hasOptionsDepartamento: boolean;
	isLoadingDepartamento: boolean;
	optionsCategoria: Observable<Categoria_de_Partes[]>;
	hasOptionsCategoria: boolean;
	isLoadingCategoria: boolean;
	optionsEstatus: Observable<Estatus_de_Seguimiento_de_Materiales[]>;
	hasOptionsEstatus: boolean;
	isLoadingEstatus: boolean;
	public varGeneracion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras[] = [];
	public varCreacion_de_Proveedores: Creacion_de_Proveedores[] = [];
	public varAeronave: Aeronave[] = [];
	public varModelos: Modelos[] = [];
	public varCategoria_de_Partes: Categoria_de_Partes[] = [];
	public varEstatus_de_Seguimiento_de_Materiales: Estatus_de_Seguimiento_de_Materiales[] = [];
	public varDepartamento: Departamento[] = [];
	public varCostos_de_Importacion: Costos_de_Importacion[] = [];
	public varIngreso_a_almacen: Ingreso_a_almacen[] = [];
	public varNotificacion_de_rechazo_al_ingreso_de_almacen: Notificacion_de_rechazo_al_ingreso_de_almacen[] = [];

  autoNo__de_OC_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedNo__de_OC_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingNo__de_OC_Detalle_Listado_de_compras_en_proceso: boolean;
  searchNo__de_OC_Detalle_Listado_de_compras_en_procesoCompleted: boolean;
  autoProveedor_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedProveedor_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingProveedor_Detalle_Listado_de_compras_en_proceso: boolean;
  searchProveedor_Detalle_Listado_de_compras_en_procesoCompleted: boolean;
  autoMatricula_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedMatricula_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingMatricula_Detalle_Listado_de_compras_en_proceso: boolean;
  searchMatricula_Detalle_Listado_de_compras_en_procesoCompleted: boolean;
  autoModelo_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedModelo_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingModelo_Detalle_Listado_de_compras_en_proceso: boolean;
  searchModelo_Detalle_Listado_de_compras_en_procesoCompleted: boolean;
  autoCategoria_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedCategoria_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingCategoria_Detalle_Listado_de_compras_en_proceso: boolean;
  searchCategoria_Detalle_Listado_de_compras_en_procesoCompleted: boolean;
  autoEstatus_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedEstatus_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingEstatus_Detalle_Listado_de_compras_en_proceso: boolean;
  searchEstatus_Detalle_Listado_de_compras_en_procesoCompleted: boolean;
  autoDepartamento_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedDepartamento_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingDepartamento_Detalle_Listado_de_compras_en_proceso: boolean;
  searchDepartamento_Detalle_Listado_de_compras_en_procesoCompleted: boolean;
  autoIdCostosImportacion_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedIdCostosImportacion_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingIdCostosImportacion_Detalle_Listado_de_compras_en_proceso: boolean;
  searchIdCostosImportacion_Detalle_Listado_de_compras_en_procesoCompleted: boolean;
  autoIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso: boolean;
  searchIdIngresoAlmacen_Detalle_Listado_de_compras_en_procesoCompleted: boolean;
  autoIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso = new FormControl();
  SelectedIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso: string[] = [];
  isLoadingIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso: boolean;
  searchIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_procesoCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceCompras_en_proceso = new MatTableDataSource<Detalle_Listado_de_compras_en_proceso>();
  Compras_en_procesoColumns = [
    { def: 'actions', hide: true },
    { def: 'No__de_OC', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'No__de_Parte_Descripcion', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Categoria', hide: false },
    { def: 'Estatus', hide: false },
    { def: 'Fecha_de_Entrega_Estimada', hide: false },
    { def: 'Departamento', hide: false },
    { def: 'Visualizacion_de_OC', hide: false },
    { def: 'Informacion_de_Importacion', hide: false },
    { def: 'Ingreso_Almacen', hide: false },
    { def: 'Rechazo_de_Ingreso', hide: false },
    { def: 'IdCostosImportacion', hide: true },
    { def: 'IdIngresoAlmacen', hide: true },
    { def: 'IdNotificacionRechazoIA', hide: true },
    { def: 'IdDetalleGestionAprobacion', hide: true },
	
  ];
  Compras_en_procesoData: Detalle_Listado_de_compras_en_proceso[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Listado_de_compras_en_procesoService: Listado_de_compras_en_procesoService,
    private Generacion_de_Orden_de_ComprasService: Generacion_de_Orden_de_ComprasService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private DepartamentoService: DepartamentoService,
    private Categoria_de_PartesService: Categoria_de_PartesService,
    private Estatus_de_Seguimiento_de_MaterialesService: Estatus_de_Seguimiento_de_MaterialesService,
    private Detalle_Listado_de_compras_en_procesoService: Detalle_Listado_de_compras_en_procesoService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Costos_de_ImportacionService: Costos_de_ImportacionService,
    private Ingreso_a_almacenService: Ingreso_a_almacenService,
    private Notificacion_de_rechazo_al_ingreso_de_almacenService: Notificacion_de_rechazo_al_ingreso_de_almacenService,


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
    this.model = new Listado_de_compras_en_proceso(this.fb);
    this.Listado_de_compras_en_procesoForm = this.model.buildFormGroup();
    this.Compras_en_procesoItems.removeAt(0);
	
	this.Listado_de_compras_en_procesoForm.get('Folio').disable();
    this.Listado_de_compras_en_procesoForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceCompras_en_proceso.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Compras_en_procesoColumns.splice(0, 1);
		
          this.Listado_de_compras_en_procesoForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Listado_de_compras_en_proceso)
      .subscribe((response) => {
        this.permisos = response;
      });

	//this.brf.updateValidatorsToControl(this.Listado_de_compras_en_procesoForm, 'No__de_OC', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	//this.brf.updateValidatorsToControl(this.Listado_de_compras_en_procesoForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	//this.brf.updateValidatorsToControl(this.Listado_de_compras_en_procesoForm, 'Departamento', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	//this.brf.updateValidatorsToControl(this.Listado_de_compras_en_procesoForm, 'Categoria', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	//this.brf.updateValidatorsToControl(this.Listado_de_compras_en_procesoForm, 'Estatus', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Listado_de_compras_en_procesoService.listaSelAll(0, 1, 'Listado_de_compras_en_proceso.Folio=' + id).toPromise();
	if (result.Listado_de_compras_en_procesos.length > 0) {
        let fCompras_en_proceso = await this.Detalle_Listado_de_compras_en_procesoService.listaSelAll(0, 1000,'Listado_de_compras_en_proceso.Folio=' + id).toPromise();
            this.Compras_en_procesoData = fCompras_en_proceso.Detalle_Listado_de_compras_en_procesos;
            this.loadCompras_en_proceso(fCompras_en_proceso.Detalle_Listado_de_compras_en_procesos);
            this.dataSourceCompras_en_proceso = new MatTableDataSource(fCompras_en_proceso.Detalle_Listado_de_compras_en_procesos);
            this.dataSourceCompras_en_proceso.paginator = this.paginator;
            this.dataSourceCompras_en_proceso.sort = this.sort;
	  
        this.model.fromObject(result.Listado_de_compras_en_procesos[0]);
        /*this.Listado_de_compras_en_procesoForm.get('No__de_OC').setValue(
          result.Listado_de_compras_en_procesos[0].No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
          { onlySelf: false, emitEvent: true }
        );
        this.Listado_de_compras_en_procesoForm.get('Proveedor').setValue(
          result.Listado_de_compras_en_procesos[0].Proveedor_Creacion_de_Proveedores.Razon_social,
          { onlySelf: false, emitEvent: true }
        );
        this.Listado_de_compras_en_procesoForm.get('Departamento').setValue(
          result.Listado_de_compras_en_procesos[0].Departamento_Departamento.Nombre,
          { onlySelf: false, emitEvent: true }
        );
        this.Listado_de_compras_en_procesoForm.get('Categoria').setValue(
          result.Listado_de_compras_en_procesos[0].Categoria_Categoria_de_Partes.Categoria,
          { onlySelf: false, emitEvent: true }
        );
        this.Listado_de_compras_en_procesoForm.get('Estatus').setValue(
          result.Listado_de_compras_en_procesos[0].Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion,
          { onlySelf: false, emitEvent: true }
        );*/

		this.Listado_de_compras_en_procesoForm.markAllAsTouched();
		this.Listado_de_compras_en_procesoForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Compras_en_procesoItems() {
    return this.Listado_de_compras_en_procesoForm.get('Detalle_Listado_de_compras_en_procesoItems') as FormArray;
  }

  getCompras_en_procesoColumns(): string[] {
    return this.Compras_en_procesoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadCompras_en_proceso(Compras_en_proceso: Detalle_Listado_de_compras_en_proceso[]) {
    Compras_en_proceso.forEach(element => {
      this.addCompras_en_proceso(element);
    });
  }

  addCompras_en_procesoToMR() {
    const Compras_en_proceso = new Detalle_Listado_de_compras_en_proceso(this.fb);
    this.Compras_en_procesoData.push(this.addCompras_en_proceso(Compras_en_proceso));
    this.dataSourceCompras_en_proceso.data = this.Compras_en_procesoData;
    Compras_en_proceso.edit = true;
    Compras_en_proceso.isNew = true;
    const length = this.dataSourceCompras_en_proceso.data.length;
    const index = length - 1;
    const formCompras_en_proceso = this.Compras_en_procesoItems.controls[index] as FormGroup;
	this.addFilterToControlNo__de_OC_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.No__de_OC, index);
	this.addFilterToControlProveedor_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Proveedor, index);
	this.addFilterToControlMatricula_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Matricula, index);
	this.addFilterToControlModelo_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Modelo, index);
	this.addFilterToControlCategoria_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Categoria, index);
	this.addFilterToControlEstatus_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Estatus, index);
	this.addFilterToControlDepartamento_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Departamento, index);
	this.addFilterToControlIdCostosImportacion_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.IdCostosImportacion, index);
	this.addFilterToControlIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.IdIngresoAlmacen, index);
	this.addFilterToControlIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.IdNotificacionRechazoIA, index);
    
    const page = Math.ceil(this.dataSourceCompras_en_proceso.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addCompras_en_proceso(entity: Detalle_Listado_de_compras_en_proceso) {
    const Compras_en_proceso = new Detalle_Listado_de_compras_en_proceso(this.fb);
    this.Compras_en_procesoItems.push(Compras_en_proceso.buildFormGroup());
    if (entity) {
      Compras_en_proceso.fromObject(entity);
    }
	return entity;
  }  

  Compras_en_procesoItemsByFolio(Folio: number): FormGroup {
    return (this.Listado_de_compras_en_procesoForm.get('Detalle_Listado_de_compras_en_procesoItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Compras_en_procesoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
	let fb = this.Compras_en_procesoItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteCompras_en_proceso(element: any) {
    let index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.Compras_en_procesoData[index].IsDeleted = true;
    this.dataSourceCompras_en_proceso.data = this.Compras_en_procesoData;
    this.dataSourceCompras_en_proceso._updateChangeSubscription();
    index = this.dataSourceCompras_en_proceso.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditCompras_en_proceso(element: any) {
    let index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Compras_en_procesoData[index].IsDeleted = true;
      this.dataSourceCompras_en_proceso.data = this.Compras_en_procesoData;
      this.dataSourceCompras_en_proceso._updateChangeSubscription();
      index = this.Compras_en_procesoData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveCompras_en_proceso(element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    const formCompras_en_proceso = this.Compras_en_procesoItems.controls[index] as FormGroup;
    if (this.Compras_en_procesoData[index].No__de_OC !== formCompras_en_proceso.value.No__de_OC && formCompras_en_proceso.value.No__de_OC > 0) {
		let generacion_de_orden_de_compras = await this.Generacion_de_Orden_de_ComprasService.getById(formCompras_en_proceso.value.No__de_OC).toPromise();
        this.Compras_en_procesoData[index].No__de_OC_Generacion_de_Orden_de_Compras = generacion_de_orden_de_compras;
    }
    this.Compras_en_procesoData[index].No__de_OC = formCompras_en_proceso.value.No__de_OC;
    if (this.Compras_en_procesoData[index].Proveedor !== formCompras_en_proceso.value.Proveedor && formCompras_en_proceso.value.Proveedor > 0) {
		let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formCompras_en_proceso.value.Proveedor).toPromise();
        this.Compras_en_procesoData[index].Proveedor_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Compras_en_procesoData[index].Proveedor = formCompras_en_proceso.value.Proveedor;
    this.Compras_en_procesoData[index].No__de_Parte_Descripcion = formCompras_en_proceso.value.No__de_Parte_Descripcion;
    if (this.Compras_en_procesoData[index].Matricula !== formCompras_en_proceso.value.Matricula && formCompras_en_proceso.value.Matricula > 0) {
		let aeronave = await this.AeronaveService.getById(formCompras_en_proceso.value.Matricula).toPromise();
        this.Compras_en_procesoData[index].Matricula_Aeronave = aeronave;
    }
    this.Compras_en_procesoData[index].Matricula = formCompras_en_proceso.value.Matricula;
    if (this.Compras_en_procesoData[index].Modelo !== formCompras_en_proceso.value.Modelo && formCompras_en_proceso.value.Modelo > 0) {
		let modelos = await this.ModelosService.getById(formCompras_en_proceso.value.Modelo).toPromise();
        this.Compras_en_procesoData[index].Modelo_Modelos = modelos;
    }
    this.Compras_en_procesoData[index].Modelo = formCompras_en_proceso.value.Modelo;
    if (this.Compras_en_procesoData[index].Categoria !== formCompras_en_proceso.value.Categoria && formCompras_en_proceso.value.Categoria > 0) {
		let categoria_de_partes = await this.Categoria_de_PartesService.getById(formCompras_en_proceso.value.Categoria).toPromise();
        this.Compras_en_procesoData[index].Categoria_Categoria_de_Partes = categoria_de_partes;
    }
    this.Compras_en_procesoData[index].Categoria = formCompras_en_proceso.value.Categoria;
    if (this.Compras_en_procesoData[index].Estatus !== formCompras_en_proceso.value.Estatus && formCompras_en_proceso.value.Estatus > 0) {
		let estatus_de_seguimiento_de_materiales = await this.Estatus_de_Seguimiento_de_MaterialesService.getById(formCompras_en_proceso.value.Estatus).toPromise();
        this.Compras_en_procesoData[index].Estatus_Estatus_de_Seguimiento_de_Materiales = estatus_de_seguimiento_de_materiales;
    }
    this.Compras_en_procesoData[index].Estatus = formCompras_en_proceso.value.Estatus;
    this.Compras_en_procesoData[index].Fecha_de_Entrega_Estimada = formCompras_en_proceso.value.Fecha_de_Entrega_Estimada;
    if (this.Compras_en_procesoData[index].Departamento !== formCompras_en_proceso.value.Departamento && formCompras_en_proceso.value.Departamento > 0) {
		let departamento = await this.DepartamentoService.getById(formCompras_en_proceso.value.Departamento).toPromise();
        this.Compras_en_procesoData[index].Departamento_Departamento = departamento;
    }
    this.Compras_en_procesoData[index].Departamento = formCompras_en_proceso.value.Departamento;
    if (this.Compras_en_procesoData[index].IdCostosImportacion !== formCompras_en_proceso.value.IdCostosImportacion && formCompras_en_proceso.value.IdCostosImportacion > 0) {
		let costos_de_importacion = await this.Costos_de_ImportacionService.getById(formCompras_en_proceso.value.IdCostosImportacion).toPromise();
        this.Compras_en_procesoData[index].IdCostosImportacion_Costos_de_Importacion = costos_de_importacion;
    }
    this.Compras_en_procesoData[index].IdCostosImportacion = formCompras_en_proceso.value.IdCostosImportacion;
    if (this.Compras_en_procesoData[index].IdIngresoAlmacen !== formCompras_en_proceso.value.IdIngresoAlmacen && formCompras_en_proceso.value.IdIngresoAlmacen > 0) {
		let ingreso_a_almacen = await this.Ingreso_a_almacenService.getById(formCompras_en_proceso.value.IdIngresoAlmacen).toPromise();
        this.Compras_en_procesoData[index].IdIngresoAlmacen_Ingreso_a_almacen = ingreso_a_almacen;
    }
    this.Compras_en_procesoData[index].IdIngresoAlmacen = formCompras_en_proceso.value.IdIngresoAlmacen;
    if (this.Compras_en_procesoData[index].IdNotificacionRechazoIA !== formCompras_en_proceso.value.IdNotificacionRechazoIA && formCompras_en_proceso.value.IdNotificacionRechazoIA > 0) {
		let notificacion_de_rechazo_al_ingreso_de_almacen = await this.Notificacion_de_rechazo_al_ingreso_de_almacenService.getById(formCompras_en_proceso.value.IdNotificacionRechazoIA).toPromise();
        this.Compras_en_procesoData[index].IdNotificacionRechazoIA_Notificacion_de_rechazo_al_ingreso_de_almacen = notificacion_de_rechazo_al_ingreso_de_almacen;
    }
    this.Compras_en_procesoData[index].IdNotificacionRechazoIA = formCompras_en_proceso.value.IdNotificacionRechazoIA;
    this.Compras_en_procesoData[index].IdDetalleGestionAprobacion = formCompras_en_proceso.value.IdDetalleGestionAprobacion;
	
    this.Compras_en_procesoData[index].isNew = false;
    this.dataSourceCompras_en_proceso.data = this.Compras_en_procesoData;
    this.dataSourceCompras_en_proceso._updateChangeSubscription();
  }
  
  editCompras_en_proceso(element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    const formCompras_en_proceso = this.Compras_en_procesoItems.controls[index] as FormGroup;
	this.SelectedNo__de_OC_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC;
    this.addFilterToControlNo__de_OC_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.No__de_OC, index);
	this.SelectedProveedor_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].Proveedor_Creacion_de_Proveedores.Razon_social;
    this.addFilterToControlProveedor_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Proveedor, index);
	this.SelectedMatricula_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].Matricula_Aeronave.Matricula;
    this.addFilterToControlMatricula_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Matricula, index);
	this.SelectedModelo_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Modelo, index);
	this.SelectedCategoria_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].Categoria_Categoria_de_Partes.Categoria;
    this.addFilterToControlCategoria_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Categoria, index);
	this.SelectedEstatus_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion;
    this.addFilterToControlEstatus_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Estatus, index);
	this.SelectedDepartamento_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].Departamento_Departamento.Nombre;
    this.addFilterToControlDepartamento_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.Departamento, index);
	this.SelectedIdCostosImportacion_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].IdCostosImportacion_Costos_de_Importacion.FolioCostosImportacion;
    this.addFilterToControlIdCostosImportacion_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.IdCostosImportacion, index);
	this.SelectedIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].IdIngresoAlmacen_Ingreso_a_almacen.IdIngresoAlmacen;
    this.addFilterToControlIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.IdIngresoAlmacen, index);
	this.SelectedIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso[index] = this.dataSourceCompras_en_proceso.data[index].IdNotificacionRechazoIA_Notificacion_de_rechazo_al_ingreso_de_almacen.IdNotificacionRechazoIA;
    this.addFilterToControlIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso(formCompras_en_proceso.controls.IdNotificacionRechazoIA, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Listado_de_compras_en_proceso(Folio: number) {
    this.dataSourceCompras_en_proceso.data.forEach(async (d, index) => {
      const data = this.Compras_en_procesoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Listado_de_compras_en_proceso = Folio;
	
      
      if (model.Folio === 0) {
        // Add Compras en proceso
		let response = await this.Detalle_Listado_de_compras_en_procesoService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formCompras_en_proceso = this.Compras_en_procesoItemsByFolio(model.Folio);
        if (formCompras_en_proceso.dirty) {
          // Update Compras en proceso
          let response = await this.Detalle_Listado_de_compras_en_procesoService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Compras en proceso
        await this.Detalle_Listado_de_compras_en_procesoService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectNo__de_OC_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__de_OC_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.No__de_OC.setValue(event.option.value);
    this.displayFnNo__de_OC_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnNo__de_OC_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedNo__de_OC_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionNo__de_OC_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedNo__de_OC_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterNo__de_OC_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Generacion_de_Orden_de_Compras> {
		const where = filter !== '' ?  "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + filter + "%'" : '';
		return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, where);
	}

  addFilterToControlNo__de_OC_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__de_OC_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__de_OC_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterNo__de_OC_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varGeneracion_de_Orden_de_Compras = result.Generacion_de_Orden_de_Comprass;
      this.isLoadingNo__de_OC_Detalle_Listado_de_compras_en_proceso = false;
      this.searchNo__de_OC_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedNo__de_OC_Detalle_Listado_de_compras_en_proceso[index] = this.varGeneracion_de_Orden_de_Compras.length === 0 ? '' : this.SelectedNo__de_OC_Detalle_Listado_de_compras_en_proceso[index];
    });
  }
  public selectProveedor_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Proveedor.setValue(event.option.value);
    this.displayFnProveedor_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnProveedor_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedProveedor_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionProveedor_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedProveedor_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterProveedor_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Creacion_de_Proveedores> {
		const where = filter !== '' ?  "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
		return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
	}

  addFilterToControlProveedor_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterProveedor_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_Detalle_Listado_de_compras_en_proceso = false;
      this.searchProveedor_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedProveedor_Detalle_Listado_de_compras_en_proceso[index] = this.varCreacion_de_Proveedores.length === 0 ? '' : this.SelectedProveedor_Detalle_Listado_de_compras_en_proceso[index];
    });
  }
  public selectMatricula_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMatricula_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Matricula.setValue(event.option.value);
    this.displayFnMatricula_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnMatricula_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedMatricula_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionMatricula_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedMatricula_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterMatricula_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Aeronave> {
		const where = filter !== '' ?  "Aeronave.Matricula like '%" + filter + "%'" : '';
		return this.AeronaveService.listaSelAll(0, 20, where);
	}

  addFilterToControlMatricula_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMatricula_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMatricula_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterMatricula_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingMatricula_Detalle_Listado_de_compras_en_proceso = false;
      this.searchMatricula_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedMatricula_Detalle_Listado_de_compras_en_proceso[index] = this.varAeronave.length === 0 ? '' : this.SelectedMatricula_Detalle_Listado_de_compras_en_proceso[index];
    });
  }
  public selectModelo_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnModelo_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedModelo_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionModelo_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedModelo_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterModelo_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Modelos> {
		const where = filter !== '' ?  "Modelos.Descripcion like '%" + filter + "%'" : '';
		return this.ModelosService.listaSelAll(0, 20, where);
	}

  addFilterToControlModelo_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterModelo_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_Listado_de_compras_en_proceso = false;
      this.searchModelo_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedModelo_Detalle_Listado_de_compras_en_proceso[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_Listado_de_compras_en_proceso[index];
    });
  }
  public selectCategoria_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedCategoria_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Categoria.setValue(event.option.value);
    this.displayFnCategoria_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnCategoria_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedCategoria_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionCategoria_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedCategoria_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterCategoria_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Categoria_de_Partes> {
		const where = filter !== '' ?  "Categoria_de_Partes.Categoria like '%" + filter + "%'" : '';
		return this.Categoria_de_PartesService.listaSelAll(0, 20, where);
	}

  // Funcion Consultar agregado
  SearchConsult() {
    console.log("Estoy dentro");

    let Query = "EXEC usp_Detalle_Listado_de_compras_en_procesoMR '";

    //obtenemos todos los datos para la consulta del Query
    let No__de_OC = this.Listado_de_compras_en_procesoForm.get('No__de_OC').value.Folio;
    let Proveedor = this.Listado_de_compras_en_procesoForm.get('Proveedor').value.Clave;
    let Departamento = this.Listado_de_compras_en_procesoForm.get('Departamento').value.Folio;
    let Categoria = this.Listado_de_compras_en_procesoForm.get('Categoria').value.Folio;
    let Estatus = this.Listado_de_compras_en_procesoForm.get('Estatus').value.Folio;

    if(Proveedor != 1 && Proveedor != undefined){
      Query += "AND Proveedor = ''" + Proveedor + "'' ";
    }
    if(No__de_OC != 1 && No__de_OC != undefined){
      Query += "AND No__de_OC = ''" + No__de_OC + "'' ";
    }
    if(Departamento != 1 && Departamento != undefined){
      Query += "AND Departamento = ''" + Departamento + "'' ";
    }
    if(Categoria != 1 && Categoria != undefined){
      Query += "AND Categoria = ''" + Categoria + "'' ";
    }
    if(Estatus != 1 && Estatus != undefined){
      Query += "AND Estatus = ''" + Estatus + "'' ";
    }

    Query += "'"

    this.dataSourceCompras_en_proceso = new MatTableDataSource<Detalle_Listado_de_compras_en_proceso>();
    this.dataSourceCompras_en_proceso.paginator = this.paginator;
    this.dataSourceCompras_en_proceso.sort = this.sort;

    this.brf.FillMultiRenglonfromQuery(this.dataSourceCompras_en_proceso, Query, 1, "ABC123");

  }

  //Open import Click
  OpenImport(element: any){

    let url = this.router.serializeUrl(this.router.createUrlTree([`#/Costos_de_Importacion/add`]));
    window.open(decodeURIComponent(url), "_blank", "width=800, height=600, top=200, left=500");

  }

  OpenIngreso(element: any){
    let url = this.router.serializeUrl(this.router.createUrlTree([`#/Ingreso_a_almacen/add`]));
    window.open(decodeURIComponent(url), "_blank", "width=800, height=600, top=200, left=500");
  }

  Openrechazo(element: any){
    let url = this.router.serializeUrl(this.router.createUrlTree([`#/Notificacion_de_rechazo_al_ingreso_de_almacen/add`]));
    window.open(decodeURIComponent(url), "_blank", "width=800, height=600, top=200, left=500");
  }

  addFilterToControlCategoria_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCategoria_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCategoria_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterCategoria_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varCategoria_de_Partes = result.Categoria_de_Partess;
      this.isLoadingCategoria_Detalle_Listado_de_compras_en_proceso = false;
      this.searchCategoria_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedCategoria_Detalle_Listado_de_compras_en_proceso[index] = this.varCategoria_de_Partes.length === 0 ? '' : this.SelectedCategoria_Detalle_Listado_de_compras_en_proceso[index];
    });
  }
  public selectEstatus_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedEstatus_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Estatus.setValue(event.option.value);
    this.displayFnEstatus_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnEstatus_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedEstatus_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionEstatus_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedEstatus_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterEstatus_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Estatus_de_Seguimiento_de_Materiales> {
		const where = filter !== '' ?  "Estatus_de_Seguimiento_de_Materiales.Descripcion like '%" + filter + "%'" : '';
		return this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(0, 20, where);
	}

  addFilterToControlEstatus_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingEstatus_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingEstatus_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterEstatus_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varEstatus_de_Seguimiento_de_Materiales = result.Estatus_de_Seguimiento_de_Materialess;
      this.isLoadingEstatus_Detalle_Listado_de_compras_en_proceso = false;
      this.searchEstatus_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedEstatus_Detalle_Listado_de_compras_en_proceso[index] = this.varEstatus_de_Seguimiento_de_Materiales.length === 0 ? '' : this.SelectedEstatus_Detalle_Listado_de_compras_en_proceso[index];
    });
  }
  public selectDepartamento_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedDepartamento_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Departamento.setValue(event.option.value);
    this.displayFnDepartamento_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnDepartamento_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedDepartamento_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionDepartamento_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedDepartamento_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterDepartamento_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Departamento> {
		const where = filter !== '' ?  "Departamento.Nombre like '%" + filter + "%'" : '';
		return this.DepartamentoService.listaSelAll(0, 20, where);
	}

  addFilterToControlDepartamento_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingDepartamento_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingDepartamento_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterDepartamento_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varDepartamento = result.Departamentos;
      this.isLoadingDepartamento_Detalle_Listado_de_compras_en_proceso = false;
      this.searchDepartamento_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedDepartamento_Detalle_Listado_de_compras_en_proceso[index] = this.varDepartamento.length === 0 ? '' : this.SelectedDepartamento_Detalle_Listado_de_compras_en_proceso[index];
    });
  }
  public selectIdCostosImportacion_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdCostosImportacion_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.IdCostosImportacion.setValue(event.option.value);
    this.displayFnIdCostosImportacion_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnIdCostosImportacion_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedIdCostosImportacion_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionIdCostosImportacion_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedIdCostosImportacion_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterIdCostosImportacion_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Costos_de_Importacion> {
		const where = filter !== '' ?  "Costos_de_Importacion.FolioCostosImportacion like '%" + filter + "%'" : '';
		return this.Costos_de_ImportacionService.listaSelAll(0, 20, where);
	}

  addFilterToControlIdCostosImportacion_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdCostosImportacion_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdCostosImportacion_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterIdCostosImportacion_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varCostos_de_Importacion = result.Costos_de_Importacions;
      this.isLoadingIdCostosImportacion_Detalle_Listado_de_compras_en_proceso = false;
      this.searchIdCostosImportacion_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedIdCostosImportacion_Detalle_Listado_de_compras_en_proceso[index] = this.varCostos_de_Importacion.length === 0 ? '' : this.SelectedIdCostosImportacion_Detalle_Listado_de_compras_en_proceso[index];
    });
  }
  public selectIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.IdIngresoAlmacen.setValue(event.option.value);
    this.displayFnIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Ingreso_a_almacen> {
		const where = filter !== '' ?  "Ingreso_a_almacen.IdIngresoAlmacen like '%" + filter + "%'" : '';
		return this.Ingreso_a_almacenService.listaSelAll(0, 20, where);
	}

  addFilterToControlIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varIngreso_a_almacen = result.Ingreso_a_almacens;
      this.isLoadingIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso = false;
      this.searchIdIngresoAlmacen_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso[index] = this.varIngreso_a_almacen.length === 0 ? '' : this.SelectedIdIngresoAlmacen_Detalle_Listado_de_compras_en_proceso[index];
    });
  }
  public selectIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_procesoForm.controls.Detalle_Listado_de_compras_en_procesoItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.IdNotificacionRechazoIA.setValue(event.option.value);
    this.displayFnIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso(element);
  }  
  
  displayFnIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso(this, element) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    return this.SelectedIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso[index];
  }
  updateOptionIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso(event, element: any) {
    const index = this.dataSourceCompras_en_proceso.data.indexOf(element);
    this.SelectedIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso[index] = event.source.viewValue;
  } 

	_filterIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso(filter: any): Observable<Notificacion_de_rechazo_al_ingreso_de_almacen> {
		const where = filter !== '' ?  "Notificacion_de_rechazo_al_ingreso_de_almacen.IdNotificacionRechazoIA like '%" + filter + "%'" : '';
		return this.Notificacion_de_rechazo_al_ingreso_de_almacenService.listaSelAll(0, 20, where);
	}

  addFilterToControlIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso = true;
        return this._filterIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso(value || '');
      })
    ).subscribe(result => {
      this.varNotificacion_de_rechazo_al_ingreso_de_almacen = result.Notificacion_de_rechazo_al_ingreso_de_almacens;
      this.isLoadingIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso = false;
      this.searchIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_procesoCompleted = true;
      this.SelectedIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso[index] = this.varNotificacion_de_rechazo_al_ingreso_de_almacen.length === 0 ? '' : this.SelectedIdNotificacionRechazoIA_Detalle_Listado_de_compras_en_proceso[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Listado_de_compras_en_procesoForm.disabled ? "Update" : this.operation;
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

    this.Listado_de_compras_en_procesoForm.get('No__de_OC').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo__de_OC = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, '');
          return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20,
            "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20,
          "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + value.FolioGeneracionOC.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNo__de_OC = false;
      for(let i = 0; i < result.Generacion_de_Orden_de_Comprass.length; i++){
        if (result.Generacion_de_Orden_de_Comprass[i].FolioGeneracionOC == null || result.Generacion_de_Orden_de_Comprass[i].FolioGeneracionOC == ""){
          result.Generacion_de_Orden_de_Comprass.splice(i, 1);
          console.log('Eliminado: ', result.Generacion_de_Orden_de_Comprass[i])
        }
      }
      this.hasOptionsNo__de_OC = result?.Generacion_de_Orden_de_Comprass?.length > 0;
	  //this.Listado_de_compras_en_procesoForm.get('No__de_OC').setValue(result?.Generacion_de_Orden_de_Comprass[0], { onlySelf: true, emitEvent: false });
	  this.optionsNo__de_OC = of(result?.Generacion_de_Orden_de_Comprass);
    }, error => {
      this.isLoadingNo__de_OC = false;
      this.hasOptionsNo__de_OC = false;
      this.optionsNo__de_OC = of([]);
    });
    this.Listado_de_compras_en_procesoForm.get('Proveedor').valueChanges.pipe(
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
      for(let i = 0; i < result.Creacion_de_Proveedoress.length; i++){
        if (result.Creacion_de_Proveedoress[i].Razon_social == null || result.Creacion_de_Proveedoress[i].Razon_social == ""){
          result.Creacion_de_Proveedoress.splice(i, 1);
          console.log('Eliminado: ', result.Creacion_de_Proveedoress[i])
        }
      }
      this.hasOptionsProveedor = result?.Creacion_de_Proveedoress?.length > 0;
	  //this.Listado_de_compras_en_procesoForm.get('Proveedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
	  this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });
    this.Listado_de_compras_en_procesoForm.get('Departamento').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingDepartamento = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.DepartamentoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.DepartamentoService.listaSelAll(0, 20, '');
          return this.DepartamentoService.listaSelAll(0, 20,
            "Departamento.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.DepartamentoService.listaSelAll(0, 20,
          "Departamento.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingDepartamento = false;
      this.hasOptionsDepartamento = result?.Departamentos?.length > 0;
	  //this.Listado_de_compras_en_procesoForm.get('Departamento').setValue(result?.Departamentos[0], { onlySelf: true, emitEvent: false });
	  this.optionsDepartamento = of(result?.Departamentos);
    }, error => {
      this.isLoadingDepartamento = false;
      this.hasOptionsDepartamento = false;
      this.optionsDepartamento = of([]);
    });
    this.Listado_de_compras_en_procesoForm.get('Categoria').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCategoria = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Categoria_de_PartesService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Categoria_de_PartesService.listaSelAll(0, 20, '');
          return this.Categoria_de_PartesService.listaSelAll(0, 20,
            "Categoria_de_Partes.Categoria like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Categoria_de_PartesService.listaSelAll(0, 20,
          "Categoria_de_Partes.Categoria like '%" + value.Categoria.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCategoria = false;
      this.hasOptionsCategoria = result?.Categoria_de_Partess?.length > 0;
	  //this.Listado_de_compras_en_procesoForm.get('Categoria').setValue(result?.Categoria_de_Partess[0], { onlySelf: true, emitEvent: false });
	  this.optionsCategoria = of(result?.Categoria_de_Partess);
    }, error => {
      this.isLoadingCategoria = false;
      this.hasOptionsCategoria = false;
      this.optionsCategoria = of([]);
    });
    this.Listado_de_compras_en_procesoForm.get('Estatus').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEstatus = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(0, 20, '');
          return this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(0, 20,
            "Estatus_de_Seguimiento_de_Materiales.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(0, 20,
          "Estatus_de_Seguimiento_de_Materiales.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = result?.Estatus_de_Seguimiento_de_Materialess?.length > 0;
	  //this.Listado_de_compras_en_procesoForm.get('Estatus').setValue(result?.Estatus_de_Seguimiento_de_Materialess[0], { onlySelf: true, emitEvent: false });
	  this.optionsEstatus = of(result?.Estatus_de_Seguimiento_de_Materialess);
    }, error => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = false;
      this.optionsEstatus = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {


      default: {
        break;
      }
    }
  }

displayFnNo__de_OC(option: Generacion_de_Orden_de_Compras) {
    return option?.FolioGeneracionOC;
  }
displayFnProveedor(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }
displayFnDepartamento(option: Departamento) {
    return option?.Nombre;
  }
displayFnCategoria(option: Categoria_de_Partes) {
    return option?.Categoria;
  }
displayFnEstatus(option: Estatus_de_Seguimiento_de_Materiales) {
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
      const entity = this.Listado_de_compras_en_procesoForm.value;
      entity.Folio = this.model.Folio;
      entity.No__de_OC = this.Listado_de_compras_en_procesoForm.get('No__de_OC').value.Folio;
      entity.Proveedor = this.Listado_de_compras_en_procesoForm.get('Proveedor').value.Clave;
      entity.Departamento = this.Listado_de_compras_en_procesoForm.get('Departamento').value.Folio;
      entity.Categoria = this.Listado_de_compras_en_procesoForm.get('Categoria').value.Folio;
      entity.Estatus = this.Listado_de_compras_en_procesoForm.get('Estatus').value.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Listado_de_compras_en_procesoService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Listado_de_compras_en_proceso(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Listado_de_compras_en_procesoService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Listado_de_compras_en_proceso(id);

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
      this.Listado_de_compras_en_procesoForm.reset();
      this.model = new Listado_de_compras_en_proceso(this.fb);
      this.Listado_de_compras_en_procesoForm = this.model.buildFormGroup();
      this.dataSourceCompras_en_proceso = new MatTableDataSource<Detalle_Listado_de_compras_en_proceso>();
      this.Compras_en_procesoData = [];

    } else {
      this.router.navigate(['views/Listado_de_compras_en_proceso/add']);
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
    this.router.navigate(['/Listado_de_compras_en_proceso/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      No__de_OC_ExecuteBusinessRules(): void {
        //No__de_OC_FieldExecuteBusinessRulesEnd
    }
    Proveedor_ExecuteBusinessRules(): void {
        //Proveedor_FieldExecuteBusinessRulesEnd
    }
    Departamento_ExecuteBusinessRules(): void {
        //Departamento_FieldExecuteBusinessRulesEnd
    }
    Categoria_ExecuteBusinessRules(): void {
        //Categoria_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Entrega_Inicial_ExecuteBusinessRules(): void {
        //Fecha_de_Entrega_Inicial_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Entrega_Final_ExecuteBusinessRules(): void {
        //Fecha_de_Entrega_Final_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4138 - Listado_de_compras_en_proceso campos - Autor: ANgel Acuña - Actualización: 7/29/2021 12:01:26 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4138


//INICIA - BRID:4534 - Asignar no requeridos listado de compras en proceso - Autor: ANgel Acuña - Actualización: 7/29/2021 12:05:53 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
//this.brf.SetNotRequiredControl(this.Listado_de_compras_en_procesoForm, "No__de_OC");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_procesoForm, "Fecha_de_Entrega_Inicial");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_procesoForm, "Fecha_de_Entrega_Final");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_procesoForm, "Categoria");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_procesoForm, "Estatus");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_procesoForm, "Proveedor");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_procesoForm, "Proveedor");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_procesoForm, "Departamento");
} 
//TERMINA - BRID:4534


//INICIA - BRID:4535 - Ocultar campo de folio lista de compras en proceso - Autor: ANgel Acuña - Actualización: 7/29/2021 12:03:32 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
//this.brf.HideFieldOfForm(this.Listado_de_compras_en_procesoForm, "Folio"); this.brf.SetNotRequiredControl(this.Listado_de_compras_en_procesoForm, "Folio");
} 
//TERMINA - BRID:4535


//INICIA - BRID:4741 - Filtrar estatus solo estatus 1 y 2 en filtros - Autor: ANgel Acuña - Actualización: 8/6/2021 10:08:28 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {

} 
//TERMINA - BRID:4741


//INICIA - BRID:4911 - Listar los registros de la ultima semana - Autor: Jose Caballero - Actualización: 8/8/2021 4:55:15 PM
if(  this.operation == 'New' ) {
//this.brf.FillMultiRenglonfromQuery(this.dataSourceCompras_en_proceso,"Detalle_Listado_de_compras_en_proceso",1,"ABC123");
} 
//TERMINA - BRID:4911

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
