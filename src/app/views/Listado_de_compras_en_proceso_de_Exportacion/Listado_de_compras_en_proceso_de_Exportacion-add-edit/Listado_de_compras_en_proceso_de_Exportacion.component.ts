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
import { Listado_de_compras_en_proceso_de_ExportacionService } from 'src/app/api-services/Listado_de_compras_en_proceso_de_Exportacion.service';
import { Listado_de_compras_en_proceso_de_Exportacion } from 'src/app/models/Listado_de_compras_en_proceso_de_Exportacion';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Detalle_de_Compras_en_exportacionService } from 'src/app/api-services/Detalle_de_Compras_en_exportacion.service';
import { Detalle_de_Compras_en_exportacion } from 'src/app/models/Detalle_de_Compras_en_exportacion';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Gestion_de_ExportacionService } from 'src/app/api-services/Gestion_de_Exportacion.service';
import { Gestion_de_Exportacion } from 'src/app/models/Gestion_de_Exportacion';


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
import { Element } from '../../../components/workflow/business-rules-setting/business-rules-setting.component';

@Component({
  selector: 'app-Listado_de_compras_en_proceso_de_Exportacion',
  templateUrl: './Listado_de_compras_en_proceso_de_Exportacion.component.html',
  styleUrls: ['./Listado_de_compras_en_proceso_de_Exportacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Listado_de_compras_en_proceso_de_ExportacionComponent implements OnInit, AfterViewInit {
MRaddListado_de_Compras_de_Exportacion: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Listado_de_compras_en_proceso_de_ExportacionForm: FormGroup;
	public Editor = ClassicEditor;
	model: Listado_de_compras_en_proceso_de_Exportacion;
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
	public varAeronave: Aeronave[] = [];
	public varModelos: Modelos[] = [];
	public varGestion_de_Exportacion: Gestion_de_Exportacion[] = [];

  autoNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion = new FormControl();
  SelectedNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion: string[] = [];
  isLoadingNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion: boolean;
  searchNo_Orden_de_Compra_Detalle_de_Compras_en_exportacionCompleted: boolean;
  autoProveedor_Detalle_de_Compras_en_exportacion = new FormControl();
  SelectedProveedor_Detalle_de_Compras_en_exportacion: string[] = [];
  isLoadingProveedor_Detalle_de_Compras_en_exportacion: boolean;
  searchProveedor_Detalle_de_Compras_en_exportacionCompleted: boolean;
  autoMatricula_Detalle_de_Compras_en_exportacion = new FormControl();
  SelectedMatricula_Detalle_de_Compras_en_exportacion: string[] = [];
  isLoadingMatricula_Detalle_de_Compras_en_exportacion: boolean;
  searchMatricula_Detalle_de_Compras_en_exportacionCompleted: boolean;
  autoModelo_Detalle_de_Compras_en_exportacion = new FormControl();
  SelectedModelo_Detalle_de_Compras_en_exportacion: string[] = [];
  isLoadingModelo_Detalle_de_Compras_en_exportacion: boolean;
  searchModelo_Detalle_de_Compras_en_exportacionCompleted: boolean;
  autoFolioGestionExportacion_Detalle_de_Compras_en_exportacion = new FormControl();
  SelectedFolioGestionExportacion_Detalle_de_Compras_en_exportacion: string[] = [];
  isLoadingFolioGestionExportacion_Detalle_de_Compras_en_exportacion: boolean;
  searchFolioGestionExportacion_Detalle_de_Compras_en_exportacionCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceListado_de_Compras_de_Exportacion = new MatTableDataSource<Detalle_de_Compras_en_exportacion>();
  Listado_de_Compras_de_ExportacionColumns = [
    { def: 'actions', hide: false },
    { def: 'No_Orden_de_Compra', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'No_de_Parte___Descripcion', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'No__de_Pedimento_Export_', hide: false },
    { def: 'Clave_de_Pedimento_Export_', hide: false },
    { def: 'Fecha_de_Factura', hide: false },
    { def: 'No__Factura', hide: false },
    //{ def: 'FolioGestionExportacion', hide: false },
	
  ];
  Listado_de_Compras_de_ExportacionData: Detalle_de_Compras_en_exportacion[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Listado_de_compras_en_proceso_de_ExportacionService: Listado_de_compras_en_proceso_de_ExportacionService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Generacion_de_Orden_de_ComprasService: Generacion_de_Orden_de_ComprasService,
    private Detalle_de_Compras_en_exportacionService: Detalle_de_Compras_en_exportacionService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Gestion_de_ExportacionService: Gestion_de_ExportacionService,


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
    this.model = new Listado_de_compras_en_proceso_de_Exportacion(this.fb);
    this.Listado_de_compras_en_proceso_de_ExportacionForm = this.model.buildFormGroup();
    this.Listado_de_Compras_de_ExportacionItems.removeAt(0);
	
	this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Folio').disable();
    this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceListado_de_Compras_de_Exportacion.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Listado_de_Compras_de_ExportacionColumns.splice(0, 1);
		
          this.Listado_de_compras_en_proceso_de_ExportacionForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Listado_de_compras_en_proceso_de_Exportacion)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Listado_de_compras_en_proceso_de_ExportacionForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Listado_de_compras_en_proceso_de_ExportacionForm, 'No__Orden_de_Compra', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Listado_de_compras_en_proceso_de_ExportacionService.listaSelAll(0, 1, 'Listado_de_compras_en_proceso_de_Exportacion.Folio=' + id).toPromise();
	if (result.Listado_de_compras_en_proceso_de_Exportacions.length > 0) {
        let fListado_de_Compras_de_Exportacion = await this.Detalle_de_Compras_en_exportacionService.listaSelAll(0, 1000,'Listado_de_compras_en_proceso_de_Exportacion.Folio=' + id).toPromise();
            this.Listado_de_Compras_de_ExportacionData = fListado_de_Compras_de_Exportacion.Detalle_de_Compras_en_exportacions;
            this.loadListado_de_Compras_de_Exportacion(fListado_de_Compras_de_Exportacion.Detalle_de_Compras_en_exportacions);
            this.dataSourceListado_de_Compras_de_Exportacion = new MatTableDataSource(fListado_de_Compras_de_Exportacion.Detalle_de_Compras_en_exportacions);
            this.dataSourceListado_de_Compras_de_Exportacion.paginator = this.paginator;
            this.dataSourceListado_de_Compras_de_Exportacion.sort = this.sort;
	  
        this.model.fromObject(result.Listado_de_compras_en_proceso_de_Exportacions[0]);
        this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Proveedor').setValue(
          result.Listado_de_compras_en_proceso_de_Exportacions[0].Proveedor_Creacion_de_Proveedores.Razon_social,
          { onlySelf: false, emitEvent: true }
        );
        this.Listado_de_compras_en_proceso_de_ExportacionForm.get('No__Orden_de_Compra').setValue(
          result.Listado_de_compras_en_proceso_de_Exportacions[0].No__Orden_de_Compra_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
          { onlySelf: false, emitEvent: true }
        );

		this.Listado_de_compras_en_proceso_de_ExportacionForm.markAllAsTouched();
		this.Listado_de_compras_en_proceso_de_ExportacionForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Listado_de_Compras_de_ExportacionItems() {
    return this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Detalle_de_Compras_en_exportacionItems') as FormArray;
  }

  getListado_de_Compras_de_ExportacionColumns(): string[] {
    return this.Listado_de_Compras_de_ExportacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadListado_de_Compras_de_Exportacion(Listado_de_Compras_de_Exportacion: Detalle_de_Compras_en_exportacion[]) {
    Listado_de_Compras_de_Exportacion.forEach(element => {
      this.addListado_de_Compras_de_Exportacion(element);
    });
  }

  addListado_de_Compras_de_ExportacionToMR() {
    const Listado_de_Compras_de_Exportacion = new Detalle_de_Compras_en_exportacion(this.fb);
    this.Listado_de_Compras_de_ExportacionData.push(this.addListado_de_Compras_de_Exportacion(Listado_de_Compras_de_Exportacion));
    this.dataSourceListado_de_Compras_de_Exportacion.data = this.Listado_de_Compras_de_ExportacionData;
    Listado_de_Compras_de_Exportacion.edit = true;
    Listado_de_Compras_de_Exportacion.isNew = true;
    const length = this.dataSourceListado_de_Compras_de_Exportacion.data.length;
    const index = length - 1;
    const formListado_de_Compras_de_Exportacion = this.Listado_de_Compras_de_ExportacionItems.controls[index] as FormGroup;
	this.addFilterToControlNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.No_Orden_de_Compra, index);
	this.addFilterToControlProveedor_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.Proveedor, index);
	this.addFilterToControlMatricula_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.Matricula, index);
	this.addFilterToControlModelo_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.Modelo, index);
	this.addFilterToControlFolioGestionExportacion_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.FolioGestionExportacion, index);
    
    const page = Math.ceil(this.dataSourceListado_de_Compras_de_Exportacion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addListado_de_Compras_de_Exportacion(entity: Detalle_de_Compras_en_exportacion) {
    const Listado_de_Compras_de_Exportacion = new Detalle_de_Compras_en_exportacion(this.fb);
    this.Listado_de_Compras_de_ExportacionItems.push(Listado_de_Compras_de_Exportacion.buildFormGroup());
    if (entity) {
      Listado_de_Compras_de_Exportacion.fromObject(entity);
    }
	return entity;
  }  

  Listado_de_Compras_de_ExportacionItemsByFolio(Folio: number): FormGroup {
    return (this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Detalle_de_Compras_en_exportacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Listado_de_Compras_de_ExportacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
	let fb = this.Listado_de_Compras_de_ExportacionItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteListado_de_Compras_de_Exportacion(element: any) {
    let index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    this.Listado_de_Compras_de_ExportacionData[index].IsDeleted = true;
    this.dataSourceListado_de_Compras_de_Exportacion.data = this.Listado_de_Compras_de_ExportacionData;
    this.dataSourceListado_de_Compras_de_Exportacion._updateChangeSubscription();
    index = this.dataSourceListado_de_Compras_de_Exportacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditListado_de_Compras_de_Exportacion(element: any) {
    let index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Listado_de_Compras_de_ExportacionData[index].IsDeleted = true;
      this.dataSourceListado_de_Compras_de_Exportacion.data = this.Listado_de_Compras_de_ExportacionData;
      this.dataSourceListado_de_Compras_de_Exportacion._updateChangeSubscription();
      index = this.Listado_de_Compras_de_ExportacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveListado_de_Compras_de_Exportacion(element: any) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    const formListado_de_Compras_de_Exportacion = this.Listado_de_Compras_de_ExportacionItems.controls[index] as FormGroup;
    if (this.Listado_de_Compras_de_ExportacionData[index].No_Orden_de_Compra !== formListado_de_Compras_de_Exportacion.value.No_Orden_de_Compra && formListado_de_Compras_de_Exportacion.value.No_Orden_de_Compra > 0) {
		let generacion_de_orden_de_compras = await this.Generacion_de_Orden_de_ComprasService.getById(formListado_de_Compras_de_Exportacion.value.No_Orden_de_Compra).toPromise();
        this.Listado_de_Compras_de_ExportacionData[index].No_Orden_de_Compra_Generacion_de_Orden_de_Compras = generacion_de_orden_de_compras;
    }
    this.Listado_de_Compras_de_ExportacionData[index].No_Orden_de_Compra = formListado_de_Compras_de_Exportacion.value.No_Orden_de_Compra;
    if (this.Listado_de_Compras_de_ExportacionData[index].Proveedor !== formListado_de_Compras_de_Exportacion.value.Proveedor && formListado_de_Compras_de_Exportacion.value.Proveedor > 0) {
		let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formListado_de_Compras_de_Exportacion.value.Proveedor).toPromise();
        this.Listado_de_Compras_de_ExportacionData[index].Proveedor_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Listado_de_Compras_de_ExportacionData[index].Proveedor = formListado_de_Compras_de_Exportacion.value.Proveedor;
    this.Listado_de_Compras_de_ExportacionData[index].No_de_Parte___Descripcion = formListado_de_Compras_de_Exportacion.value.No_de_Parte___Descripcion;
    if (this.Listado_de_Compras_de_ExportacionData[index].Matricula !== formListado_de_Compras_de_Exportacion.value.Matricula && formListado_de_Compras_de_Exportacion.value.Matricula > 0) {
		let aeronave = await this.AeronaveService.getById(formListado_de_Compras_de_Exportacion.value.Matricula).toPromise();
        this.Listado_de_Compras_de_ExportacionData[index].Matricula_Aeronave = aeronave;
    }
    this.Listado_de_Compras_de_ExportacionData[index].Matricula = formListado_de_Compras_de_Exportacion.value.Matricula;
    if (this.Listado_de_Compras_de_ExportacionData[index].Modelo !== formListado_de_Compras_de_Exportacion.value.Modelo && formListado_de_Compras_de_Exportacion.value.Modelo > 0) {
		let modelos = await this.ModelosService.getById(formListado_de_Compras_de_Exportacion.value.Modelo).toPromise();
        this.Listado_de_Compras_de_ExportacionData[index].Modelo_Modelos = modelos;
    }
    this.Listado_de_Compras_de_ExportacionData[index].Modelo = formListado_de_Compras_de_Exportacion.value.Modelo;
    this.Listado_de_Compras_de_ExportacionData[index].No__de_Pedimento_Export_ = formListado_de_Compras_de_Exportacion.value.No__de_Pedimento_Export_;
    this.Listado_de_Compras_de_ExportacionData[index].Clave_de_Pedimento_Export_ = formListado_de_Compras_de_Exportacion.value.Clave_de_Pedimento_Export_;
    this.Listado_de_Compras_de_ExportacionData[index].Fecha_de_Factura = formListado_de_Compras_de_Exportacion.value.Fecha_de_Factura;
    this.Listado_de_Compras_de_ExportacionData[index].No__Factura = formListado_de_Compras_de_Exportacion.value.No__Factura;
    if (this.Listado_de_Compras_de_ExportacionData[index].FolioGestionExportacion !== formListado_de_Compras_de_Exportacion.value.FolioGestionExportacion && formListado_de_Compras_de_Exportacion.value.FolioGestionExportacion > 0) {
		let gestion_de_exportacion = await this.Gestion_de_ExportacionService.getById(formListado_de_Compras_de_Exportacion.value.FolioGestionExportacion).toPromise();
        this.Listado_de_Compras_de_ExportacionData[index].FolioGestionExportacion_Gestion_de_Exportacion = gestion_de_exportacion;
    }
    this.Listado_de_Compras_de_ExportacionData[index].FolioGestionExportacion = formListado_de_Compras_de_Exportacion.value.FolioGestionExportacion;
	
    this.Listado_de_Compras_de_ExportacionData[index].isNew = false;
    this.dataSourceListado_de_Compras_de_Exportacion.data = this.Listado_de_Compras_de_ExportacionData;
    this.dataSourceListado_de_Compras_de_Exportacion._updateChangeSubscription();
  }
  
  editListado_de_Compras_de_Exportacion(element: any) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    const formListado_de_Compras_de_Exportacion = this.Listado_de_Compras_de_ExportacionItems.controls[index] as FormGroup;
	this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion[index] = this.dataSourceListado_de_Compras_de_Exportacion.data[index].FolioGestionExportacion;
    this.addFilterToControlNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.No_Orden_de_Compra, index);
	this.SelectedProveedor_Detalle_de_Compras_en_exportacion[index] = this.dataSourceListado_de_Compras_de_Exportacion.data[index].Proveedor_Creacion_de_Proveedores.Razon_social;
    this.addFilterToControlProveedor_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.Proveedor, index);
	this.SelectedMatricula_Detalle_de_Compras_en_exportacion[index] = this.dataSourceListado_de_Compras_de_Exportacion.data[index].Matricula_Aeronave.Matricula;
    this.addFilterToControlMatricula_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.Matricula, index);
	this.SelectedModelo_Detalle_de_Compras_en_exportacion[index] = this.dataSourceListado_de_Compras_de_Exportacion.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.Modelo, index);
	this.SelectedFolioGestionExportacion_Detalle_de_Compras_en_exportacion[index] = this.dataSourceListado_de_Compras_de_Exportacion.data[index].FolioGestionExportacion_Gestion_de_Exportacion.FolioExportacion;
    this.addFilterToControlFolioGestionExportacion_Detalle_de_Compras_en_exportacion(formListado_de_Compras_de_Exportacion.controls.FolioGestionExportacion, index);
	    
    element.edit = true;
  }  

  async saveDetalle_de_Compras_en_exportacion(Folio: number) {
    this.dataSourceListado_de_Compras_de_Exportacion.data.forEach(async (d, index) => {
      const data = this.Listado_de_Compras_de_ExportacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Listado_de_compras_en_proceso_de_Exportacion = Folio;
	
      
      if (model.Folio === 0) {
        // Add Listado de Compras de Exportación
		let response = await this.Detalle_de_Compras_en_exportacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formListado_de_Compras_de_Exportacion = this.Listado_de_Compras_de_ExportacionItemsByFolio(model.Folio);
        if (formListado_de_Compras_de_Exportacion.dirty) {
          // Update Listado de Compras de Exportación
          let response = await this.Detalle_de_Compras_en_exportacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Listado de Compras de Exportación
        await this.Detalle_de_Compras_en_exportacionService.delete(model.Folio).toPromise();
      }
    });
  }

  // Funcion Consultar agregado
  SearchConsult() {

    let Query = "EXEC spListadoExportacion '";

    //obtenemos todos los datos para la consulta del Query
    let Proveedor = this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Proveedor').value.Clave;
    let No__Orden_de_Compra = this.Listado_de_compras_en_proceso_de_ExportacionForm.get('No__Orden_de_Compra').value.Folio;
    let FechaDeFactura = this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Fecha_de_Factura').value;

    if(Proveedor != undefined){
      Query += "AND Proveedor = ''" + Proveedor + "'' ";
    }
    if(No__Orden_de_Compra != undefined){
      Query += "AND No_Orden_de_CompraId = ''" + No__Orden_de_Compra + "'' ";
    }
    if(FechaDeFactura != '' && FechaDeFactura != null){
      let fecha = FechaDeFactura.toISOString().split('T')[0];
      let anio = fecha.split('-')[0];
      let mes = fecha.split('-')[1];
      let dia = fecha.split('-')[2];
      let fechaCompuesta = dia + "-" + mes + "-" + anio;

      Query += "AND Fecha_de_Factura = ''" + fechaCompuesta + "'' ";
    }

    Query += "'"

    this.dataSourceListado_de_Compras_de_Exportacion = new MatTableDataSource<Detalle_de_Compras_en_exportacion>();
    this.dataSourceListado_de_Compras_de_Exportacion.paginator = this.paginator;
    this.dataSourceListado_de_Compras_de_Exportacion.sort = this.sort;

    this.brf.FillMultiRenglonfromQuery(this.dataSourceListado_de_Compras_de_Exportacion, Query, 1, "ABC123");
  }

  //Open Costos de importacion
  OpenCostoDeImportacion(element: any){
    let url = this.router.serializeUrl(this.router.createUrlTree([`#/Gestion_de_Exportacion/edit/${element.No_Orden_de_Compra}`]));
    window.open(decodeURIComponent(url), "_blank", "width=800, height=600, top=200, left=500");
  }

  public selectNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ExportacionForm.controls.Detalle_de_Compras_en_exportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.No_Orden_de_Compra.setValue(event.option.value);
    this.displayFnNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion(element);
  }  
  
  displayFnNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    return this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion[index];
  }
  updateOptionNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion[index] = event.source.viewValue;
  } 

	_filterNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion(filter: any): Observable<Generacion_de_Orden_de_Compras> {
		const where = filter !== '' ?  "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + filter + "%'" : '';
		return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, where);
	}

  addFilterToControlNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion = true;
        return this._filterNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion(value || '');
      })
    ).subscribe(result => {
      this.varGeneracion_de_Orden_de_Compras = result.Generacion_de_Orden_de_Comprass;
      this.isLoadingNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion = false;
      this.searchNo_Orden_de_Compra_Detalle_de_Compras_en_exportacionCompleted = true;
      this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion[index] = this.varGeneracion_de_Orden_de_Compras.length === 0 ? '' : this.SelectedNo_Orden_de_Compra_Detalle_de_Compras_en_exportacion[index];
    });
  }
  public selectProveedor_Detalle_de_Compras_en_exportacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_Detalle_de_Compras_en_exportacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ExportacionForm.controls.Detalle_de_Compras_en_exportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Proveedor.setValue(event.option.value);
    this.displayFnProveedor_Detalle_de_Compras_en_exportacion(element);
  }  
  
  displayFnProveedor_Detalle_de_Compras_en_exportacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    return this.SelectedProveedor_Detalle_de_Compras_en_exportacion[index];
  }
  updateOptionProveedor_Detalle_de_Compras_en_exportacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    this.SelectedProveedor_Detalle_de_Compras_en_exportacion[index] = event.source.viewValue;
  } 

	_filterProveedor_Detalle_de_Compras_en_exportacion(filter: any): Observable<Creacion_de_Proveedores> {
		const where = filter !== '' ?  "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
		return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
	}

  addFilterToControlProveedor_Detalle_de_Compras_en_exportacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_Detalle_de_Compras_en_exportacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_Detalle_de_Compras_en_exportacion = true;
        return this._filterProveedor_Detalle_de_Compras_en_exportacion(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_Detalle_de_Compras_en_exportacion = false;
      this.searchProveedor_Detalle_de_Compras_en_exportacionCompleted = true;
      this.SelectedProveedor_Detalle_de_Compras_en_exportacion[index] = this.varCreacion_de_Proveedores.length === 0 ? '' : this.SelectedProveedor_Detalle_de_Compras_en_exportacion[index];
    });
  }
  public selectMatricula_Detalle_de_Compras_en_exportacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMatricula_Detalle_de_Compras_en_exportacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ExportacionForm.controls.Detalle_de_Compras_en_exportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Matricula.setValue(event.option.value);
    this.displayFnMatricula_Detalle_de_Compras_en_exportacion(element);
  }  
  
  displayFnMatricula_Detalle_de_Compras_en_exportacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    return this.SelectedMatricula_Detalle_de_Compras_en_exportacion[index];
  }
  updateOptionMatricula_Detalle_de_Compras_en_exportacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    this.SelectedMatricula_Detalle_de_Compras_en_exportacion[index] = event.source.viewValue;
  } 

	_filterMatricula_Detalle_de_Compras_en_exportacion(filter: any): Observable<Aeronave> {
		const where = filter !== '' ?  "Aeronave.Matricula like '%" + filter + "%'" : '';
		return this.AeronaveService.listaSelAll(0, 20, where);
	}

  addFilterToControlMatricula_Detalle_de_Compras_en_exportacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMatricula_Detalle_de_Compras_en_exportacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMatricula_Detalle_de_Compras_en_exportacion = true;
        return this._filterMatricula_Detalle_de_Compras_en_exportacion(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingMatricula_Detalle_de_Compras_en_exportacion = false;
      this.searchMatricula_Detalle_de_Compras_en_exportacionCompleted = true;
      this.SelectedMatricula_Detalle_de_Compras_en_exportacion[index] = this.varAeronave.length === 0 ? '' : this.SelectedMatricula_Detalle_de_Compras_en_exportacion[index];
    });
  }
  public selectModelo_Detalle_de_Compras_en_exportacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_de_Compras_en_exportacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ExportacionForm.controls.Detalle_de_Compras_en_exportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_de_Compras_en_exportacion(element);
  }  
  
  displayFnModelo_Detalle_de_Compras_en_exportacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    return this.SelectedModelo_Detalle_de_Compras_en_exportacion[index];
  }
  updateOptionModelo_Detalle_de_Compras_en_exportacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    this.SelectedModelo_Detalle_de_Compras_en_exportacion[index] = event.source.viewValue;
  } 

	_filterModelo_Detalle_de_Compras_en_exportacion(filter: any): Observable<Modelos> {
		const where = filter !== '' ?  "Modelos.Descripcion like '%" + filter + "%'" : '';
		return this.ModelosService.listaSelAll(0, 20, where);
	}

  addFilterToControlModelo_Detalle_de_Compras_en_exportacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_de_Compras_en_exportacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_de_Compras_en_exportacion = true;
        return this._filterModelo_Detalle_de_Compras_en_exportacion(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_de_Compras_en_exportacion = false;
      this.searchModelo_Detalle_de_Compras_en_exportacionCompleted = true;
      this.SelectedModelo_Detalle_de_Compras_en_exportacion[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_de_Compras_en_exportacion[index];
    });
  }
  public selectFolioGestionExportacion_Detalle_de_Compras_en_exportacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedFolioGestionExportacion_Detalle_de_Compras_en_exportacion[index] = event.option.viewValue;
	let fgr = this.Listado_de_compras_en_proceso_de_ExportacionForm.controls.Detalle_de_Compras_en_exportacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.FolioGestionExportacion.setValue(event.option.value);
    this.displayFnFolioGestionExportacion_Detalle_de_Compras_en_exportacion(element);
  }  
  
  displayFnFolioGestionExportacion_Detalle_de_Compras_en_exportacion(this, element) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    return this.SelectedFolioGestionExportacion_Detalle_de_Compras_en_exportacion[index];
  }
  updateOptionFolioGestionExportacion_Detalle_de_Compras_en_exportacion(event, element: any) {
    const index = this.dataSourceListado_de_Compras_de_Exportacion.data.indexOf(element);
    this.SelectedFolioGestionExportacion_Detalle_de_Compras_en_exportacion[index] = event.source.viewValue;
  } 

	_filterFolioGestionExportacion_Detalle_de_Compras_en_exportacion(filter: any): Observable<Gestion_de_Exportacion> {
		const where = filter !== '' ?  "Gestion_de_Exportacion.FolioExportacion like '%" + filter + "%'" : '';
		return this.Gestion_de_ExportacionService.listaSelAll(0, 20, where);
	}

  addFilterToControlFolioGestionExportacion_Detalle_de_Compras_en_exportacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingFolioGestionExportacion_Detalle_de_Compras_en_exportacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingFolioGestionExportacion_Detalle_de_Compras_en_exportacion = true;
        return this._filterFolioGestionExportacion_Detalle_de_Compras_en_exportacion(value || '');
      })
    ).subscribe(result => {
      this.varGestion_de_Exportacion = result.Gestion_de_Exportacions;
      this.isLoadingFolioGestionExportacion_Detalle_de_Compras_en_exportacion = false;
      this.searchFolioGestionExportacion_Detalle_de_Compras_en_exportacionCompleted = true;
      this.SelectedFolioGestionExportacion_Detalle_de_Compras_en_exportacion[index] = this.varGestion_de_Exportacion.length === 0 ? '' : this.SelectedFolioGestionExportacion_Detalle_de_Compras_en_exportacion[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Listado_de_compras_en_proceso_de_ExportacionForm.disabled ? "Update" : this.operation;
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

    this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Proveedor').valueChanges.pipe(
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
	  //this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Proveedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
	  this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });
    this.Listado_de_compras_en_proceso_de_ExportacionForm.get('No__Orden_de_Compra').valueChanges.pipe(
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
	  //this.Listado_de_compras_en_proceso_de_ExportacionForm.get('No__Orden_de_Compra').setValue(result?.Generacion_de_Orden_de_Comprass[0], { onlySelf: true, emitEvent: false });
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
      const entity = this.Listado_de_compras_en_proceso_de_ExportacionForm.value;
      entity.Folio = this.model.Folio;
      entity.Proveedor = this.Listado_de_compras_en_proceso_de_ExportacionForm.get('Proveedor').value.Clave;
      entity.No__Orden_de_Compra = this.Listado_de_compras_en_proceso_de_ExportacionForm.get('No__Orden_de_Compra').value.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Listado_de_compras_en_proceso_de_ExportacionService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Compras_en_exportacion(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Listado_de_compras_en_proceso_de_ExportacionService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Compras_en_exportacion(id);

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
      this.Listado_de_compras_en_proceso_de_ExportacionForm.reset();
      this.model = new Listado_de_compras_en_proceso_de_Exportacion(this.fb);
      this.Listado_de_compras_en_proceso_de_ExportacionForm = this.model.buildFormGroup();
      this.dataSourceListado_de_Compras_de_Exportacion = new MatTableDataSource<Detalle_de_Compras_en_exportacion>();
      this.Listado_de_Compras_de_ExportacionData = [];

    } else {
      this.router.navigate(['views/Listado_de_compras_en_proceso_de_Exportacion/add']);
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
    this.router.navigate(['/Listado_de_compras_en_proceso_de_Exportacion/list'], { state: { data: this.dataListConfig } });
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

//INICIA - BRID:4132 - Tam de campos - Autor: Eliud Hernandez - Actualización: 7/14/2021 12:53:43 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4132


//INICIA - BRID:4466 - Ocultar y asignar no requerido siempre - Autor: Lizeth Villa - Actualización: 7/27/2021 4:03:10 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Listado_de_compras_en_proceso_de_ExportacionForm, "Folio"); this.brf.SetNotRequiredControl(this.Listado_de_compras_en_proceso_de_ExportacionForm, "Folio"); this.brf.SetNotRequiredControl(this.Listado_de_compras_en_proceso_de_ExportacionForm, "Folio");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_proceso_de_ExportacionForm, "Proveedor");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_proceso_de_ExportacionForm, "No__Orden_de_Compra");this.brf.SetNotRequiredControl(this.Listado_de_compras_en_proceso_de_ExportacionForm, "Fecha_de_Factura");
} 
//TERMINA - BRID:4466

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
