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
import { Listado_de_compras_en_proceso_de_ImportacionService } from 'src/app/api-services/Listado_de_compras_en_proceso_de_Importacion.service';
import { Listado_de_compras_en_proceso_de_Importacion } from 'src/app/models/Listado_de_compras_en_proceso_de_Importacion';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Detalle_de_Compras_de_ImportacionService } from 'src/app/api-services/Detalle_de_Compras_de_Importacion.service';
import { Detalle_de_Compras_de_Importacion } from 'src/app/models/Detalle_de_Compras_de_Importacion';
import { PartesService } from 'src/app/api-services/Partes.service';
import { Partes } from 'src/app/models/Partes';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Gestion_de_ImportacionService } from 'src/app/api-services/Gestion_de_Importacion.service';
import { Gestion_de_Importacion } from 'src/app/models/Gestion_de_Importacion';
import { Costos_de_ImportacionService } from 'src/app/api-services/Costos_de_Importacion.service';
import { Costos_de_Importacion } from 'src/app/models/Costos_de_Importacion';


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
  selector: 'app-Listado_de_compras_en_proceso_de_Importacion',
  templateUrl: './Listado_de_compras_en_proceso_de_Importacion.component.html',
  styleUrls: ['./Listado_de_compras_en_proceso_de_Importacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Listado_de_compras_en_proceso_de_ImportacionComponent implements OnInit, AfterViewInit {
MRaddListado_de_Compras_de_Importacion: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Listado_de_compras_en_proceso_de_ImportacionForm: FormGroup;
	public Editor = ClassicEditor;
	model: Listado_de_compras_en_proceso_de_Importacion;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsProveedor: Observable<Creacion_de_Proveedores[]>;
	hasOptionsProveedor: boolean;
	isLoadingProveedor: boolean;
	optionsNo__Orden_de_Compra: Observable<Generacion_de_Orden_de_Compras[]>;
	hasOptionsNo__Orden_de_Compra: boolean;
	isLoadingNo__Orden_de_Compra: boolean;
	public varGeneracion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras[] = [];
	public varCreacion_de_Proveedores: Creacion_de_Proveedores[] = [];
	public varPartes: Partes[] = [];
	public varAeronave: Aeronave[] = [];
	public varModelos: Modelos[] = [];
	public varGestion_de_Importacion: Gestion_de_Importacion[] = [];
	public varCostos_de_Importacion: Costos_de_Importacion[] = [];

  autoNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion = new FormControl();
  SelectedNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion: string[] = [];
  isLoadingNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion: boolean;
  searchNo_Orden_de_Compra_Detalle_de_Compras_de_ImportacionCompleted: boolean;
  autoProveedor_Detalle_de_Compras_de_Importacion = new FormControl();
  SelectedProveedor_Detalle_de_Compras_de_Importacion: string[] = [];
  isLoadingProveedor_Detalle_de_Compras_de_Importacion: boolean;
  searchProveedor_Detalle_de_Compras_de_ImportacionCompleted: boolean;
  autoNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion = new FormControl();
  SelectedNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion: string[] = [];
  isLoadingNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion: boolean;
  searchNo_de_Parte___Descripcion_Detalle_de_Compras_de_ImportacionCompleted: boolean;
  autoMatricula_Detalle_de_Compras_de_Importacion = new FormControl();
  SelectedMatricula_Detalle_de_Compras_de_Importacion: string[] = [];
  isLoadingMatricula_Detalle_de_Compras_de_Importacion: boolean;
  searchMatricula_Detalle_de_Compras_de_ImportacionCompleted: boolean;
  autoModelo_Detalle_de_Compras_de_Importacion = new FormControl();
  SelectedModelo_Detalle_de_Compras_de_Importacion: string[] = [];
  isLoadingModelo_Detalle_de_Compras_de_Importacion: boolean;
  searchModelo_Detalle_de_Compras_de_ImportacionCompleted: boolean;
  autoFolioGestionIportacion_Detalle_de_Compras_de_Importacion = new FormControl();
  SelectedFolioGestionIportacion_Detalle_de_Compras_de_Importacion: string[] = [];
  isLoadingFolioGestionIportacion_Detalle_de_Compras_de_Importacion: boolean;
  searchFolioGestionIportacion_Detalle_de_Compras_de_ImportacionCompleted: boolean;
  autoFolioCostosImportacion_Detalle_de_Compras_de_Importacion = new FormControl();
  SelectedFolioCostosImportacion_Detalle_de_Compras_de_Importacion: string[] = [];
  isLoadingFolioCostosImportacion_Detalle_de_Compras_de_Importacion: boolean;
  searchFolioCostosImportacion_Detalle_de_Compras_de_ImportacionCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceListado_de_Compras_de_Importacion = new MatTableDataSource<Detalle_de_Compras_de_Importacion>();
  Listado_de_Compras_de_ImportacionColumns = [
    { def: 'actions', hide: false },
    { def: 'No_Orden_de_Compra', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'No_de_Parte___Descripcion', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'No__de_Pedimento_Import_', hide: false },
    { def: 'Clave_de_Pedimento_Import_', hide: false },
    { def: 'Fecha_de_Factura', hide: false },
    { def: 'No__Factura', hide: false },
    { def: 'Costo_', hide: false },
    { def: 'Fecha_de_Factura_T', hide: false },
    { def: 'No__Factura_T', hide: false },
    { def: 'Costo_T_', hide: false },
    //{ def: 'FolioGestionIportacion', hide: false },
    //{ def: 'FolioCostosImportacion', hide: false },
    //{ def: 'iddetallegestionaprobacion', hide: false },
	
  ];
  Listado_de_Compras_de_ImportacionData: Detalle_de_Compras_de_Importacion[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Listado_de_compras_en_proceso_de_ImportacionService: Listado_de_compras_en_proceso_de_ImportacionService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Generacion_de_Orden_de_ComprasService: Generacion_de_Orden_de_ComprasService,
    private Detalle_de_Compras_de_ImportacionService: Detalle_de_Compras_de_ImportacionService,
    private PartesService: PartesService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Gestion_de_ImportacionService: Gestion_de_ImportacionService,
    private Costos_de_ImportacionService: Costos_de_ImportacionService,


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
    this.model = new Listado_de_compras_en_proceso_de_Importacion(this.fb);
    this.Listado_de_compras_en_proceso_de_ImportacionForm = this.model.buildFormGroup();
    this.Listado_de_Compras_de_ImportacionItems.removeAt(0);
	
	this.Listado_de_compras_en_proceso_de_ImportacionForm.get('Folio').disable();
    this.Listado_de_compras_en_proceso_de_ImportacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceListado_de_Compras_de_Importacion.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Listado_de_Compras_de_ImportacionColumns.splice(0, 1);
		
          this.Listado_de_compras_en_proceso_de_ImportacionForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Listado_de_compras_en_proceso_de_Importacion)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Listado_de_compras_en_proceso_de_ImportacionForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Listado_de_compras_en_proceso_de_ImportacionForm, 'No__Orden_de_Compra', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Listado_de_compras_en_proceso_de_ImportacionService.listaSelAll(0, 1, 'Listado_de_compras_en_proceso_de_Importacion.Folio=' + id).toPromise();
	if (result.Listado_de_compras_en_proceso_de_Importacions.length > 0) {
        let fListado_de_Compras_de_Importacion = await this.Detalle_de_Compras_de_ImportacionService.listaSelAll(0, 1000,'Listado_de_compras_en_proceso_de_Importacion.Folio=' + id).toPromise();
            this.Listado_de_Compras_de_ImportacionData = fListado_de_Compras_de_Importacion.Detalle_de_Compras_de_Importacions;
            this.loadListado_de_Compras_de_Importacion(fListado_de_Compras_de_Importacion.Detalle_de_Compras_de_Importacions);
            this.dataSourceListado_de_Compras_de_Importacion = new MatTableDataSource(fListado_de_Compras_de_Importacion.Detalle_de_Compras_de_Importacions);
            this.dataSourceListado_de_Compras_de_Importacion.paginator = this.paginator;
            this.dataSourceListado_de_Compras_de_Importacion.sort = this.sort;
	  
        this.model.fromObject(result.Listado_de_compras_en_proceso_de_Importacions[0]);
        this.Listado_de_compras_en_proceso_de_ImportacionForm.get('Proveedor').setValue(
          result.Listado_de_compras_en_proceso_de_Importacions[0].Proveedor_Creacion_de_Proveedores.Razon_social,
          { onlySelf: false, emitEvent: true }
        );
        this.Listado_de_compras_en_proceso_de_ImportacionForm.get('No__Orden_de_Compra').setValue(
          result.Listado_de_compras_en_proceso_de_Importacions[0].No__Orden_de_Compra_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
          { onlySelf: false, emitEvent: true }
        );

		this.Listado_de_compras_en_proceso_de_ImportacionForm.markAllAsTouched();
		this.Listado_de_compras_en_proceso_de_ImportacionForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Listado_de_Compras_de_ImportacionItems() {
    return this.Listado_de_compras_en_proceso_de_ImportacionForm.get('Detalle_de_Compras_de_ImportacionItems') as FormArray;
  }

  getListado_de_Compras_de_ImportacionColumns(): string[] {
    return this.Listado_de_Compras_de_ImportacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadListado_de_Compras_de_Importacion(Listado_de_Compras_de_Importacion: Detalle_de_Compras_de_Importacion[]) {
    Listado_de_Compras_de_Importacion.forEach(element => {
      this.addListado_de_Compras_de_Importacion(element);
    });
  }

  addListado_de_Compras_de_ImportacionToMR() {
    const Listado_de_Compras_de_Importacion = new Detalle_de_Compras_de_Importacion(this.fb);
    this.Listado_de_Compras_de_ImportacionData.push(this.addListado_de_Compras_de_Importacion(Listado_de_Compras_de_Importacion));
    this.dataSourceListado_de_Compras_de_Importacion.data = this.Listado_de_Compras_de_ImportacionData;
    Listado_de_Compras_de_Importacion.edit = true;
    Listado_de_Compras_de_Importacion.isNew = true;
    const length = this.dataSourceListado_de_Compras_de_Importacion.data.length;
    const index = length - 1;
    const formListado_de_Compras_de_Importacion = this.Listado_de_Compras_de_ImportacionItems.controls[index] as FormGroup;
	this.addFilterToControlNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.No_Orden_de_Compra, index);
	this.addFilterToControlProveedor_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.Proveedor, index);
	this.addFilterToControlNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.No_de_Parte___Descripcion, index);
	this.addFilterToControlMatricula_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.Matricula, index);
	this.addFilterToControlModelo_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.Modelo, index);
	this.addFilterToControlFolioGestionIportacion_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.FolioGestionIportacion, index);
	this.addFilterToControlFolioCostosImportacion_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.FolioCostosImportacion, index);
    
    const page = Math.ceil(this.dataSourceListado_de_Compras_de_Importacion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addListado_de_Compras_de_Importacion(entity: Detalle_de_Compras_de_Importacion) {
    const Listado_de_Compras_de_Importacion = new Detalle_de_Compras_de_Importacion(this.fb);
    this.Listado_de_Compras_de_ImportacionItems.push(Listado_de_Compras_de_Importacion.buildFormGroup());
    if (entity) {
      Listado_de_Compras_de_Importacion.fromObject(entity);
    }
	return entity;
  }  

  Listado_de_Compras_de_ImportacionItemsByFolio(Folio: number): FormGroup {
    return (this.Listado_de_compras_en_proceso_de_ImportacionForm.get('Detalle_de_Compras_de_ImportacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Listado_de_Compras_de_ImportacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
	let fb = this.Listado_de_Compras_de_ImportacionItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteListado_de_Compras_de_Importacion(element: any) {
    let index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    this.Listado_de_Compras_de_ImportacionData[index].IsDeleted = true;
    this.dataSourceListado_de_Compras_de_Importacion.data = this.Listado_de_Compras_de_ImportacionData;
    this.dataSourceListado_de_Compras_de_Importacion._updateChangeSubscription();
    index = this.dataSourceListado_de_Compras_de_Importacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditListado_de_Compras_de_Importacion(element: any) {
    let index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Listado_de_Compras_de_ImportacionData[index].IsDeleted = true;
      this.dataSourceListado_de_Compras_de_Importacion.data = this.Listado_de_Compras_de_ImportacionData;
      this.dataSourceListado_de_Compras_de_Importacion._updateChangeSubscription();
      index = this.Listado_de_Compras_de_ImportacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveListado_de_Compras_de_Importacion(element: any) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    const formListado_de_Compras_de_Importacion = this.Listado_de_Compras_de_ImportacionItems.controls[index] as FormGroup;
    if (this.Listado_de_Compras_de_ImportacionData[index].No_Orden_de_Compra !== formListado_de_Compras_de_Importacion.value.No_Orden_de_Compra && formListado_de_Compras_de_Importacion.value.No_Orden_de_Compra > 0) {
		let generacion_de_orden_de_compras = await this.Generacion_de_Orden_de_ComprasService.getById(formListado_de_Compras_de_Importacion.value.No_Orden_de_Compra).toPromise();
        this.Listado_de_Compras_de_ImportacionData[index].No_Orden_de_Compra_Generacion_de_Orden_de_Compras = generacion_de_orden_de_compras;
    }
    this.Listado_de_Compras_de_ImportacionData[index].No_Orden_de_Compra = formListado_de_Compras_de_Importacion.value.No_Orden_de_Compra;
    if (this.Listado_de_Compras_de_ImportacionData[index].Proveedor !== formListado_de_Compras_de_Importacion.value.Proveedor && formListado_de_Compras_de_Importacion.value.Proveedor > 0) {
		let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formListado_de_Compras_de_Importacion.value.Proveedor).toPromise();
        this.Listado_de_Compras_de_ImportacionData[index].Proveedor_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Listado_de_Compras_de_ImportacionData[index].Proveedor = formListado_de_Compras_de_Importacion.value.Proveedor;
    if (this.Listado_de_Compras_de_ImportacionData[index].No_de_Parte___Descripcion !== formListado_de_Compras_de_Importacion.value.No_de_Parte___Descripcion && formListado_de_Compras_de_Importacion.value.No_de_Parte___Descripcion > 0) {
		let partes = await this.PartesService.getById(formListado_de_Compras_de_Importacion.value.No_de_Parte___Descripcion).toPromise();
        this.Listado_de_Compras_de_ImportacionData[index].No_de_Parte___Descripcion_Partes = partes;
    }
    this.Listado_de_Compras_de_ImportacionData[index].No_de_Parte___Descripcion = formListado_de_Compras_de_Importacion.value.No_de_Parte___Descripcion;
    if (this.Listado_de_Compras_de_ImportacionData[index].Matricula !== formListado_de_Compras_de_Importacion.value.Matricula && formListado_de_Compras_de_Importacion.value.Matricula > 0) {
		let aeronave = await this.AeronaveService.getById(formListado_de_Compras_de_Importacion.value.Matricula).toPromise();
        this.Listado_de_Compras_de_ImportacionData[index].Matricula_Aeronave = aeronave;
    }
    this.Listado_de_Compras_de_ImportacionData[index].Matricula = formListado_de_Compras_de_Importacion.value.Matricula;
    if (this.Listado_de_Compras_de_ImportacionData[index].Modelo !== formListado_de_Compras_de_Importacion.value.Modelo && formListado_de_Compras_de_Importacion.value.Modelo > 0) {
		let modelos = await this.ModelosService.getById(formListado_de_Compras_de_Importacion.value.Modelo).toPromise();
        this.Listado_de_Compras_de_ImportacionData[index].Modelo_Modelos = modelos;
    }
    this.Listado_de_Compras_de_ImportacionData[index].Modelo = formListado_de_Compras_de_Importacion.value.Modelo;
    this.Listado_de_Compras_de_ImportacionData[index].No__de_Pedimento_Import_ = formListado_de_Compras_de_Importacion.value.No__de_Pedimento_Import_;
    this.Listado_de_Compras_de_ImportacionData[index].Clave_de_Pedimento_Import_ = formListado_de_Compras_de_Importacion.value.Clave_de_Pedimento_Import_;
    this.Listado_de_Compras_de_ImportacionData[index].Fecha_de_Factura = formListado_de_Compras_de_Importacion.value.Fecha_de_Factura;
    this.Listado_de_Compras_de_ImportacionData[index].No__Factura = formListado_de_Compras_de_Importacion.value.No__Factura;
    this.Listado_de_Compras_de_ImportacionData[index].Costo_ = formListado_de_Compras_de_Importacion.value.Costo_;
    this.Listado_de_Compras_de_ImportacionData[index].Fecha_de_Factura_T = formListado_de_Compras_de_Importacion.value.Fecha_de_Factura_T;
    this.Listado_de_Compras_de_ImportacionData[index].No__Factura_T = formListado_de_Compras_de_Importacion.value.No__Factura_T;
    this.Listado_de_Compras_de_ImportacionData[index].Costo_T_ = formListado_de_Compras_de_Importacion.value.Costo_T_;
    if (this.Listado_de_Compras_de_ImportacionData[index].FolioGestionIportacion !== formListado_de_Compras_de_Importacion.value.FolioGestionIportacion && formListado_de_Compras_de_Importacion.value.FolioGestionIportacion > 0) {
		let gestion_de_importacion = await this.Gestion_de_ImportacionService.getById(formListado_de_Compras_de_Importacion.value.FolioGestionIportacion).toPromise();
        this.Listado_de_Compras_de_ImportacionData[index].FolioGestionIportacion_Gestion_de_Importacion = gestion_de_importacion;
    }
    this.Listado_de_Compras_de_ImportacionData[index].FolioGestionIportacion = formListado_de_Compras_de_Importacion.value.FolioGestionIportacion;
    if (this.Listado_de_Compras_de_ImportacionData[index].FolioCostosImportacion !== formListado_de_Compras_de_Importacion.value.FolioCostosImportacion && formListado_de_Compras_de_Importacion.value.FolioCostosImportacion > 0) {
		let costos_de_importacion = await this.Costos_de_ImportacionService.getById(formListado_de_Compras_de_Importacion.value.FolioCostosImportacion).toPromise();
        this.Listado_de_Compras_de_ImportacionData[index].FolioCostosImportacion_Costos_de_Importacion = costos_de_importacion;
    }
    this.Listado_de_Compras_de_ImportacionData[index].FolioCostosImportacion = formListado_de_Compras_de_Importacion.value.FolioCostosImportacion;
    this.Listado_de_Compras_de_ImportacionData[index].iddetallegestionaprobacion = formListado_de_Compras_de_Importacion.value.iddetallegestionaprobacion;
	
    this.Listado_de_Compras_de_ImportacionData[index].isNew = false;
    this.dataSourceListado_de_Compras_de_Importacion.data = this.Listado_de_Compras_de_ImportacionData;
    this.dataSourceListado_de_Compras_de_Importacion._updateChangeSubscription();
  }
  
  editListado_de_Compras_de_Importacion(element: any) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    const formListado_de_Compras_de_Importacion = this.Listado_de_Compras_de_ImportacionItems.controls[index] as FormGroup;
	this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion[index] = this.dataSourceListado_de_Compras_de_Importacion.data[index].No_Orden_de_Compra_Generacion_de_Orden_de_Compras.FolioGeneracionOC;
    this.addFilterToControlNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.No_Orden_de_Compra, index);
	this.SelectedProveedor_Detalle_de_Compras_de_Importacion[index] = this.dataSourceListado_de_Compras_de_Importacion.data[index].Proveedor_Creacion_de_Proveedores.Razon_social;
    this.addFilterToControlProveedor_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.Proveedor, index);
	this.SelectedNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion[index] = this.dataSourceListado_de_Compras_de_Importacion.data[index].No_de_Parte___Descripcion_Partes.Numero_de_parte_Descripcion;
    this.addFilterToControlNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.No_de_Parte___Descripcion, index);
	this.SelectedMatricula_Detalle_de_Compras_de_Importacion[index] = this.dataSourceListado_de_Compras_de_Importacion.data[index].Matricula_Aeronave.Matricula;
    this.addFilterToControlMatricula_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.Matricula, index);
	this.SelectedModelo_Detalle_de_Compras_de_Importacion[index] = this.dataSourceListado_de_Compras_de_Importacion.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.Modelo, index);
	this.SelectedFolioGestionIportacion_Detalle_de_Compras_de_Importacion[index] = this.dataSourceListado_de_Compras_de_Importacion.data[index].FolioGestionIportacion_Gestion_de_Importacion.FolioGestiondeImportacion;
    this.addFilterToControlFolioGestionIportacion_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.FolioGestionIportacion, index);
	this.SelectedFolioCostosImportacion_Detalle_de_Compras_de_Importacion[index] = this.dataSourceListado_de_Compras_de_Importacion.data[index].FolioCostosImportacion_Costos_de_Importacion.FolioCostosImportacion;
    this.addFilterToControlFolioCostosImportacion_Detalle_de_Compras_de_Importacion(formListado_de_Compras_de_Importacion.controls.FolioCostosImportacion, index);
	    
    element.edit = true;
  }  

  async saveDetalle_de_Compras_de_Importacion(Folio: number) {
    this.dataSourceListado_de_Compras_de_Importacion.data.forEach(async (d, index) => {
      const data = this.Listado_de_Compras_de_ImportacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Listado_de_compras_en_proceso_de_Importacion = Folio;
	
      
      if (model.Folio === 0) {
        // Add Listado de Compras de Importación
		let response = await this.Detalle_de_Compras_de_ImportacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formListado_de_Compras_de_Importacion = this.Listado_de_Compras_de_ImportacionItemsByFolio(model.Folio);
        if (formListado_de_Compras_de_Importacion.dirty) {
          // Update Listado de Compras de Importación
          let response = await this.Detalle_de_Compras_de_ImportacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Listado de Compras de Importación
        await this.Detalle_de_Compras_de_ImportacionService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ImportacionForm.controls.Detalle_de_Compras_de_ImportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.No_Orden_de_Compra.setValue(event.option.value);
    this.displayFnNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion(element);
  }  
  
  displayFnNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    return this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion[index];
  }
  updateOptionNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion[index] = event.source.viewValue;
  } 

	_filterNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion(filter: any): Observable<Generacion_de_Orden_de_Compras> {
		const where = filter !== '' ?  "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + filter + "%'" : '';
		return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, where);
	}

  // Funcion Consultar agregado
  SearchConsult() {

    let Query = "EXEC spListadoImportacion '";

    //obtenemos todos los datos para la consulta del Query
    let Proveedor = this.Listado_de_compras_en_proceso_de_ImportacionForm.get('Proveedor').value.Clave;
    let No__Orden_de_Compra = this.Listado_de_compras_en_proceso_de_ImportacionForm.get('No__Orden_de_Compra').value.Folio;

    if(Proveedor != undefined){
      Query += "AND Proveedor = ''" + Proveedor + "'' ";
    }
    if(No__Orden_de_Compra != undefined){
      Query += "AND No_Orden_de_Compra = ''" + No__Orden_de_Compra + "'' ";
    }

    Query += "'"

    this.dataSourceListado_de_Compras_de_Importacion = new MatTableDataSource<Detalle_de_Compras_de_Importacion>();
    this.dataSourceListado_de_Compras_de_Importacion.paginator = this.paginator;
    this.dataSourceListado_de_Compras_de_Importacion.sort = this.sort;

    this.brf.FillMultiRenglonfromQuery(this.dataSourceListado_de_Compras_de_Importacion,Query, 1, "ABC123");
  }

  //Open Costos de importacion
  OpenCostoDeImportacion(element: any){
    let url = this.router.serializeUrl(this.router.createUrlTree([`#/Costos_de_Importacion/edit/${element.No_Orden_de_Compra}`]));
    window.open(decodeURIComponent(url), "_blank", "width=800, height=600, top=200, left=500");
  }

  addFilterToControlNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion = true;
        return this._filterNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion(value || '');
      })
    ).subscribe(result => {
      this.varGeneracion_de_Orden_de_Compras = result.Generacion_de_Orden_de_Comprass;
      this.isLoadingNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion = false;
      this.searchNo_Orden_de_Compra_Detalle_de_Compras_de_ImportacionCompleted = true;
      this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion[index] = this.varGeneracion_de_Orden_de_Compras.length === 0 ? '' : this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_de_Importacion[index];
    });
  }
  public selectProveedor_Detalle_de_Compras_de_Importacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_Detalle_de_Compras_de_Importacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ImportacionForm.controls.Detalle_de_Compras_de_ImportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Proveedor.setValue(event.option.value);
    this.displayFnProveedor_Detalle_de_Compras_de_Importacion(element);
  }  
  
  displayFnProveedor_Detalle_de_Compras_de_Importacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    return this.SelectedProveedor_Detalle_de_Compras_de_Importacion[index];
  }
  updateOptionProveedor_Detalle_de_Compras_de_Importacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    this.SelectedProveedor_Detalle_de_Compras_de_Importacion[index] = event.source.viewValue;
  } 

	_filterProveedor_Detalle_de_Compras_de_Importacion(filter: any): Observable<Creacion_de_Proveedores> {
		const where = filter !== '' ?  "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
		return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
	}

  addFilterToControlProveedor_Detalle_de_Compras_de_Importacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_Detalle_de_Compras_de_Importacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_Detalle_de_Compras_de_Importacion = true;
        return this._filterProveedor_Detalle_de_Compras_de_Importacion(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_Detalle_de_Compras_de_Importacion = false;
      this.searchProveedor_Detalle_de_Compras_de_ImportacionCompleted = true;
      this.SelectedProveedor_Detalle_de_Compras_de_Importacion[index] = this.varCreacion_de_Proveedores.length === 0 ? '' : this.SelectedProveedor_Detalle_de_Compras_de_Importacion[index];
    });
  }
  public selectNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ImportacionForm.controls.Detalle_de_Compras_de_ImportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.No_de_Parte___Descripcion.setValue(event.option.value);
    this.displayFnNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion(element);
  }  
  
  displayFnNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    return this.SelectedNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion[index];
  }
  updateOptionNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    this.SelectedNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion[index] = event.source.viewValue;
  } 

	_filterNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion(filter: any): Observable<Partes> {
		const where = filter !== '' ?  "Partes.Numero_de_parte_Descripcion like '%" + filter + "%'" : '';
		return this.PartesService.listaSelAll(0, 20, where);
	}

  addFilterToControlNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion = true;
        return this._filterNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion(value || '');
      })
    ).subscribe(result => {
      this.varPartes = result.Partess;
      this.isLoadingNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion = false;
      this.searchNo_de_Parte___Descripcion_Detalle_de_Compras_de_ImportacionCompleted = true;
      this.SelectedNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion[index] = this.varPartes.length === 0 ? '' : this.SelectedNo_de_Parte___Descripcion_Detalle_de_Compras_de_Importacion[index];
    });
  }
  public selectMatricula_Detalle_de_Compras_de_Importacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMatricula_Detalle_de_Compras_de_Importacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ImportacionForm.controls.Detalle_de_Compras_de_ImportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Matricula.setValue(event.option.value);
    this.displayFnMatricula_Detalle_de_Compras_de_Importacion(element);
  }  
  
  displayFnMatricula_Detalle_de_Compras_de_Importacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    return this.SelectedMatricula_Detalle_de_Compras_de_Importacion[index];
  }
  updateOptionMatricula_Detalle_de_Compras_de_Importacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    this.SelectedMatricula_Detalle_de_Compras_de_Importacion[index] = event.source.viewValue;
  } 

	_filterMatricula_Detalle_de_Compras_de_Importacion(filter: any): Observable<Aeronave> {
		const where = filter !== '' ?  "Aeronave.Matricula like '%" + filter + "%'" : '';
		return this.AeronaveService.listaSelAll(0, 20, where);
	}

  addFilterToControlMatricula_Detalle_de_Compras_de_Importacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMatricula_Detalle_de_Compras_de_Importacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMatricula_Detalle_de_Compras_de_Importacion = true;
        return this._filterMatricula_Detalle_de_Compras_de_Importacion(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingMatricula_Detalle_de_Compras_de_Importacion = false;
      this.searchMatricula_Detalle_de_Compras_de_ImportacionCompleted = true;
      this.SelectedMatricula_Detalle_de_Compras_de_Importacion[index] = this.varAeronave.length === 0 ? '' : this.SelectedMatricula_Detalle_de_Compras_de_Importacion[index];
    });
  }
  public selectModelo_Detalle_de_Compras_de_Importacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_de_Compras_de_Importacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ImportacionForm.controls.Detalle_de_Compras_de_ImportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_de_Compras_de_Importacion(element);
  }  
  
  displayFnModelo_Detalle_de_Compras_de_Importacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    return this.SelectedModelo_Detalle_de_Compras_de_Importacion[index];
  }
  updateOptionModelo_Detalle_de_Compras_de_Importacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    this.SelectedModelo_Detalle_de_Compras_de_Importacion[index] = event.source.viewValue;
  } 

	_filterModelo_Detalle_de_Compras_de_Importacion(filter: any): Observable<Modelos> {
		const where = filter !== '' ?  "Modelos.Descripcion like '%" + filter + "%'" : '';
		return this.ModelosService.listaSelAll(0, 20, where);
	}

  addFilterToControlModelo_Detalle_de_Compras_de_Importacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_de_Compras_de_Importacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_de_Compras_de_Importacion = true;
        return this._filterModelo_Detalle_de_Compras_de_Importacion(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_de_Compras_de_Importacion = false;
      this.searchModelo_Detalle_de_Compras_de_ImportacionCompleted = true;
      this.SelectedModelo_Detalle_de_Compras_de_Importacion[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_de_Compras_de_Importacion[index];
    });
  }
  public selectFolioGestionIportacion_Detalle_de_Compras_de_Importacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedFolioGestionIportacion_Detalle_de_Compras_de_Importacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ImportacionForm.controls.Detalle_de_Compras_de_ImportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.FolioGestionIportacion.setValue(event.option.value);
    this.displayFnFolioGestionIportacion_Detalle_de_Compras_de_Importacion(element);
  }  
  
  displayFnFolioGestionIportacion_Detalle_de_Compras_de_Importacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    return this.SelectedFolioGestionIportacion_Detalle_de_Compras_de_Importacion[index];
  }
  updateOptionFolioGestionIportacion_Detalle_de_Compras_de_Importacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    this.SelectedFolioGestionIportacion_Detalle_de_Compras_de_Importacion[index] = event.source.viewValue;
  } 

	_filterFolioGestionIportacion_Detalle_de_Compras_de_Importacion(filter: any): Observable<Gestion_de_Importacion> {
		const where = filter !== '' ?  "Gestion_de_Importacion.FolioGestiondeImportacion like '%" + filter + "%'" : '';
		return this.Gestion_de_ImportacionService.listaSelAll(0, 20, where);
	}

  addFilterToControlFolioGestionIportacion_Detalle_de_Compras_de_Importacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingFolioGestionIportacion_Detalle_de_Compras_de_Importacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingFolioGestionIportacion_Detalle_de_Compras_de_Importacion = true;
        return this._filterFolioGestionIportacion_Detalle_de_Compras_de_Importacion(value || '');
      })
    ).subscribe(result => {
      this.varGestion_de_Importacion = result.Gestion_de_Importacions;
      this.isLoadingFolioGestionIportacion_Detalle_de_Compras_de_Importacion = false;
      this.searchFolioGestionIportacion_Detalle_de_Compras_de_ImportacionCompleted = true;
      this.SelectedFolioGestionIportacion_Detalle_de_Compras_de_Importacion[index] = this.varGestion_de_Importacion.length === 0 ? '' : this.SelectedFolioGestionIportacion_Detalle_de_Compras_de_Importacion[index];
    });
  }
  public selectFolioCostosImportacion_Detalle_de_Compras_de_Importacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedFolioCostosImportacion_Detalle_de_Compras_de_Importacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ImportacionForm.controls.Detalle_de_Compras_de_ImportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.FolioCostosImportacion.setValue(event.option.value);
    this.displayFnFolioCostosImportacion_Detalle_de_Compras_de_Importacion(element);
  }  
  
  displayFnFolioCostosImportacion_Detalle_de_Compras_de_Importacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    return this.SelectedFolioCostosImportacion_Detalle_de_Compras_de_Importacion[index];
  }
  updateOptionFolioCostosImportacion_Detalle_de_Compras_de_Importacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Importacion.data.indexOf(element);
    this.SelectedFolioCostosImportacion_Detalle_de_Compras_de_Importacion[index] = event.source.viewValue;
  } 

	_filterFolioCostosImportacion_Detalle_de_Compras_de_Importacion(filter: any): Observable<Costos_de_Importacion> {
		const where = filter !== '' ?  "Costos_de_Importacion.FolioCostosImportacion like '%" + filter + "%'" : '';
		return this.Costos_de_ImportacionService.listaSelAll(0, 20, where);
	}

  addFilterToControlFolioCostosImportacion_Detalle_de_Compras_de_Importacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingFolioCostosImportacion_Detalle_de_Compras_de_Importacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingFolioCostosImportacion_Detalle_de_Compras_de_Importacion = true;
        return this._filterFolioCostosImportacion_Detalle_de_Compras_de_Importacion(value || '');
      })
    ).subscribe(result => {
      this.varCostos_de_Importacion = result.Costos_de_Importacions;
      this.isLoadingFolioCostosImportacion_Detalle_de_Compras_de_Importacion = false;
      this.searchFolioCostosImportacion_Detalle_de_Compras_de_ImportacionCompleted = true;
      this.SelectedFolioCostosImportacion_Detalle_de_Compras_de_Importacion[index] = this.varCostos_de_Importacion.length === 0 ? '' : this.SelectedFolioCostosImportacion_Detalle_de_Compras_de_Importacion[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Listado_de_compras_en_proceso_de_ImportacionForm.disabled ? "Update" : this.operation;
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

    this.Listado_de_compras_en_proceso_de_ImportacionForm.get('Proveedor').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingProveedor = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, ' Razon_social IS NOT NULL ', ' Razon_social ASC ');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, ' Razon_social IS NOT NULL ', ' Razon_social ASC ');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Razon_social like '%" + value.trimLeft().trimRight() + "%'", ' Razon_social ASC ');
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Razon_social like '%" + value.Razon_social.trimLeft().trimRight() + "%'", ' Razon_social ASC ');
      })
    ).subscribe(result => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = result?.Creacion_de_Proveedoress?.length > 0;
	  //this.Listado_de_compras_en_proceso_de_ImportacionForm.get('Proveedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
	  this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });
    this.Listado_de_compras_en_proceso_de_ImportacionForm.get('No__Orden_de_Compra').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo__Orden_de_Compra = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, ` FolioGeneracionOC IS NOT NULL AND FolioGeneracionOC <> '' `, ' FolioGeneracionOC ASC ');
        if (typeof value === 'string') {
          if (value === '') return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, ` FolioGeneracionOC IS NOT NULL AND FolioGeneracionOC <> '' `, ' FolioGeneracionOC ASC ');
          return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20,
            "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + value.trimLeft().trimRight() + "%'", ' FolioGeneracionOC ASC ');
        }
        return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20,
          "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + value.FolioGeneracionOC.trimLeft().trimRight() + "%'", ' FolioGeneracionOC ASC ');
      })
    ).subscribe(result => {
      this.isLoadingNo__Orden_de_Compra = false;
      this.hasOptionsNo__Orden_de_Compra = result?.Generacion_de_Orden_de_Comprass?.length > 0;
	    //this.Listado_de_compras_en_proceso_de_ImportacionForm.get('No__Orden_de_Compra').setValue(result?.Generacion_de_Orden_de_Comprass[0], { onlySelf: true, emitEvent: false });
	    this.optionsNo__Orden_de_Compra = of(result?.Generacion_de_Orden_de_Comprass);
    }, error => {
      this.isLoadingNo__Orden_de_Compra = false;
      this.hasOptionsNo__Orden_de_Compra = false;
      this.optionsNo__Orden_de_Compra = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {


      default: {
        break;
      }
    }
  }

displayFnProveedor(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }
displayFnNo__Orden_de_Compra(option: Generacion_de_Orden_de_Compras) {
    return option?.FolioGeneracionOC;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Listado_de_compras_en_proceso_de_ImportacionForm.value;
      entity.Folio = this.model.Folio;
      entity.Proveedor = this.Listado_de_compras_en_proceso_de_ImportacionForm.get('Proveedor').value.Clave;
      entity.No__Orden_de_Compra = this.Listado_de_compras_en_proceso_de_ImportacionForm.get('No__Orden_de_Compra').value.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Listado_de_compras_en_proceso_de_ImportacionService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Compras_de_Importacion(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Listado_de_compras_en_proceso_de_ImportacionService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Compras_de_Importacion(id);

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
      this.Listado_de_compras_en_proceso_de_ImportacionForm.reset();
      this.model = new Listado_de_compras_en_proceso_de_Importacion(this.fb);
      this.Listado_de_compras_en_proceso_de_ImportacionForm = this.model.buildFormGroup();
      this.dataSourceListado_de_Compras_de_Importacion = new MatTableDataSource<Detalle_de_Compras_de_Importacion>();
      this.Listado_de_Compras_de_ImportacionData = [];

    } else {
      this.router.navigate(['views/Listado_de_compras_en_proceso_de_Importacion/add']);
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
    this.router.navigate(['/Listado_de_compras_en_proceso_de_Importacion/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Proveedor_ExecuteBusinessRules(): void {
        //Proveedor_FieldExecuteBusinessRulesEnd
    }
    No__Orden_de_Compra_ExecuteBusinessRules(): void {
        //No__Orden_de_Compra_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Factura_ExecuteBusinessRules(): void {
        //Fecha_de_Factura_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4128 - Tamaño de los campos 1 - Autor: Eliud Hernandez - Actualización: 7/14/2021 11:11:29 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4128


//INICIA - BRID:4469 - Ocultar Campo Folio - Autor: Jose Caballero - Actualización: 7/28/2021 2:02:19 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.HideFieldOfForm(this.Listado_de_compras_en_proceso_de_ImportacionForm, "Folio"); 
  this.brf.SetNotRequiredControl(this.Listado_de_compras_en_proceso_de_ImportacionForm, "Folio");
} 
//TERMINA - BRID:4469


//INICIA - BRID:4474 - Asignar campos no requeridos a filtro - Autor: Jose Caballero - Actualización: 7/28/2021 12:14:33 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.SetNotRequiredControl(this.Listado_de_compras_en_proceso_de_ImportacionForm, "Proveedor"); 
  this.brf.SetNotRequiredControl(this.Listado_de_compras_en_proceso_de_ImportacionForm, "No__Orden_de_Compra"); 
  this.brf.SetNotRequiredControl(this.Listado_de_compras_en_proceso_de_ImportacionForm, "Fecha_de_Factura");
} 
//TERMINA - BRID:4474

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
