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
import { Solicitud_de_Compras_GeneralesService } from 'src/app/api-services/Solicitud_de_Compras_Generales.service';
import { Solicitud_de_Compras_Generales } from 'src/app/models/Solicitud_de_Compras_Generales';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { Orden_de_servicioService } from 'src/app/api-services/Orden_de_servicio.service';
import { Orden_de_servicio } from 'src/app/models/Orden_de_servicio';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Departamento } from 'src/app/models/Departamento';
import { Tipo_de_Solicitud_de_ComprasService } from 'src/app/api-services/Tipo_de_Solicitud_de_Compras.service';
import { Tipo_de_Solicitud_de_Compras } from 'src/app/models/Tipo_de_Solicitud_de_Compras';
import { Estatus_de_Solicitud_de_Compras_GeneralesService } from 'src/app/api-services/Estatus_de_Solicitud_de_Compras_Generales.service';
import { Estatus_de_Solicitud_de_Compras_Generales } from 'src/app/models/Estatus_de_Solicitud_de_Compras_Generales';
import { Detalle_de_Item_Compras_GeneralesService } from 'src/app/api-services/Detalle_de_Item_Compras_Generales.service';
import { Detalle_de_Item_Compras_Generales } from 'src/app/models/Detalle_de_Item_Compras_Generales';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { UrgenciaService } from 'src/app/api-services/Urgencia.service';
import { Urgencia } from 'src/app/models/Urgencia';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';

import { AutorizacionService } from 'src/app/api-services/Autorizacion.service';
import { Autorizacion } from 'src/app/models/Autorizacion';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { SpartanService } from "src/app/api-services/spartan.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';

@Component({
  selector: 'app-Solicitud_de_Compras_Generales',
  templateUrl: './Solicitud_de_Compras_Generales.component.html',
  styleUrls: ['./Solicitud_de_Compras_Generales.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Solicitud_de_Compras_GeneralesComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Solicitud_de_Compras_GeneralesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Solicitud_de_Compras_Generales;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varSpartan_User: Spartan_User[] = [];
	optionsProveedor: Observable<Creacion_de_Proveedores[]>;
	hasOptionsProveedor: boolean;
	isLoadingProveedor: boolean;
	optionsNo_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
	hasOptionsNo_de_Vuelo: boolean;
	isLoadingNo_de_Vuelo: boolean;
	optionsTramo: Observable<Aeropuertos[]>;
	hasOptionsTramo: boolean;
	isLoadingTramo: boolean;
	optionsNumero_de_O_S: Observable<Orden_de_servicio[]>;
	hasOptionsNumero_de_O_S: boolean;
	isLoadingNumero_de_O_S: boolean;
	optionsNumero_de_O_T: Observable<Orden_de_Trabajo[]>;
	hasOptionsNumero_de_O_T: boolean;
	isLoadingNumero_de_O_T: boolean;
	public varDepartamento: Departamento[] = [];
	public varTipo_de_Solicitud_de_Compras: Tipo_de_Solicitud_de_Compras[] = [];
	public varEstatus_de_Solicitud_de_Compras_Generales: Estatus_de_Solicitud_de_Compras_Generales[] = [];
	public varUnidad: Unidad[] = [];
	public varUrgencia: Urgencia[] = [];
	public varEstatus_de_Seguimiento: Estatus_de_Seguimiento[] = [];

  autoUnidad_de_Medida_Detalle_de_Item_Compras_Generales = new FormControl();
  SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales: string[] = [];
  isLoadingUnidad_de_Medida_Detalle_de_Item_Compras_Generales: boolean;
  searchUnidad_de_Medida_Detalle_de_Item_Compras_GeneralesCompleted: boolean;
  autoUrgencia_Detalle_de_Item_Compras_Generales = new FormControl();
  SelectedUrgencia_Detalle_de_Item_Compras_Generales: string[] = [];
  isLoadingUrgencia_Detalle_de_Item_Compras_Generales: boolean;
  searchUrgencia_Detalle_de_Item_Compras_GeneralesCompleted: boolean;

	public varAutorizacion: Autorizacion[] = [];

	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceItem_Compras_Generales = new MatTableDataSource<Detalle_de_Item_Compras_Generales>();
  Item_Compras_GeneralesColumns = [
    { def: 'actions', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Cantidad_Requerida', hide: false },
    { def: 'Unidad_de_Medida', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Aplicacion_y_Justificacion', hide: false },
    { def: 'Fecha_requerida', hide: false },
    { def: 'Observaciones', hide: false },
    { def: 'Estatus_de_Seguimiento', hide: false },
	
  ];
  Item_Compras_GeneralesData: Detalle_de_Item_Compras_Generales[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Solicitud_de_Compras_GeneralesService: Solicitud_de_Compras_GeneralesService,
    private Spartan_UserService: Spartan_UserService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeropuertosService: AeropuertosService,
    private Orden_de_servicioService: Orden_de_servicioService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private DepartamentoService: DepartamentoService,
    private Tipo_de_Solicitud_de_ComprasService: Tipo_de_Solicitud_de_ComprasService,
    private Estatus_de_Solicitud_de_Compras_GeneralesService: Estatus_de_Solicitud_de_Compras_GeneralesService,
    private Detalle_de_Item_Compras_GeneralesService: Detalle_de_Item_Compras_GeneralesService,
    private UnidadService: UnidadService,
    private UrgenciaService: UrgenciaService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,

    private AutorizacionService: AutorizacionService,

    private _seguridad: SeguridadService,	
    private spartanFileService: SpartanFileService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private SpartanService: SpartanService,
    renderer: Renderer2) {
	this.brf = new BusinessRulesFunctions(renderer, SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Solicitud_de_Compras_Generales(this.fb);
    this.Solicitud_de_Compras_GeneralesForm = this.model.buildFormGroup();
    this.Item_Compras_GeneralesItems.removeAt(0);
	
	this.Solicitud_de_Compras_GeneralesForm.get('No_de_Solicitud').disable();
    this.Solicitud_de_Compras_GeneralesForm.get('No_de_Solicitud').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceItem_Compras_Generales.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Item_Compras_GeneralesColumns.splice(0, 1);
		
          this.Solicitud_de_Compras_GeneralesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_Compras_Generales)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Solicitud_de_Compras_GeneralesForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitud_de_Compras_GeneralesForm, 'No_de_Vuelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitud_de_Compras_GeneralesForm, 'Tramo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_S', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_T', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Solicitud_de_Compras_GeneralesService.listaSelAll(0, 1, 'Solicitud_de_Compras_Generales.No_de_Solicitud=' + id).toPromise();
	if (result.Solicitud_de_Compras_Generaless.length > 0) {
        let fItem_Compras_Generales = await this.Detalle_de_Item_Compras_GeneralesService.listaSelAll(0, 1000,'Solicitud_de_Compras_Generales.No_de_Solicitud=' + id).toPromise();
            this.Item_Compras_GeneralesData = fItem_Compras_Generales.Detalle_de_Item_Compras_Generaless;
            this.loadItem_Compras_Generales(fItem_Compras_Generales.Detalle_de_Item_Compras_Generaless);
            this.dataSourceItem_Compras_Generales = new MatTableDataSource(fItem_Compras_Generales.Detalle_de_Item_Compras_Generaless);
            this.dataSourceItem_Compras_Generales.paginator = this.paginator;
            this.dataSourceItem_Compras_Generales.sort = this.sort;
	  
        this.model.fromObject(result.Solicitud_de_Compras_Generaless[0]);
        this.Solicitud_de_Compras_GeneralesForm.get('Proveedor').setValue(
          result.Solicitud_de_Compras_Generaless[0].Proveedor_Creacion_de_Proveedores.Razon_social,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitud_de_Compras_GeneralesForm.get('No_de_Vuelo').setValue(
          result.Solicitud_de_Compras_Generaless[0].No_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitud_de_Compras_GeneralesForm.get('Tramo').setValue(
          result.Solicitud_de_Compras_Generaless[0].Tramo_Aeropuertos.ICAO_IATA,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_S').setValue(
          result.Solicitud_de_Compras_Generaless[0].Numero_de_O_S_Orden_de_servicio.Folio_OS,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_T').setValue(
          result.Solicitud_de_Compras_Generaless[0].Numero_de_O_T_Orden_de_Trabajo.numero_de_orden,
          { onlySelf: false, emitEvent: true }
        );

		this.Solicitud_de_Compras_GeneralesForm.markAllAsTouched();
		this.Solicitud_de_Compras_GeneralesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Item_Compras_GeneralesItems() {
    return this.Solicitud_de_Compras_GeneralesForm.get('Detalle_de_Item_Compras_GeneralesItems') as FormArray;
  }

  getItem_Compras_GeneralesColumns(): string[] {
    return this.Item_Compras_GeneralesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadItem_Compras_Generales(Item_Compras_Generales: Detalle_de_Item_Compras_Generales[]) {
    Item_Compras_Generales.forEach(element => {
      this.addItem_Compras_Generales(element);
    });
  }

  addItem_Compras_GeneralesToMR() {
    const Item_Compras_Generales = new Detalle_de_Item_Compras_Generales(this.fb);
    this.Item_Compras_GeneralesData.push(this.addItem_Compras_Generales(Item_Compras_Generales));
    this.dataSourceItem_Compras_Generales.data = this.Item_Compras_GeneralesData;
    Item_Compras_Generales.edit = true;
    Item_Compras_Generales.isNew = true;
    const length = this.dataSourceItem_Compras_Generales.data.length;
    const index = length - 1;
    const formItem_Compras_Generales = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
	this.addFilterToControlUnidad_de_Medida_Detalle_de_Item_Compras_Generales(formItem_Compras_Generales.controls.Unidad_de_Medida, index);
	this.addFilterToControlUrgencia_Detalle_de_Item_Compras_Generales(formItem_Compras_Generales.controls.Urgencia, index);
    
    const page = Math.ceil(this.dataSourceItem_Compras_Generales.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addItem_Compras_Generales(entity: Detalle_de_Item_Compras_Generales) {
    const Item_Compras_Generales = new Detalle_de_Item_Compras_Generales(this.fb);
    this.Item_Compras_GeneralesItems.push(Item_Compras_Generales.buildFormGroup());
    if (entity) {
      Item_Compras_Generales.fromObject(entity);
    }
	return entity;
  }  

  Item_Compras_GeneralesItemsByFolio(Folio: number): FormGroup {
    return (this.Solicitud_de_Compras_GeneralesForm.get('Detalle_de_Item_Compras_GeneralesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Item_Compras_GeneralesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
	let fb = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteItem_Compras_Generales(element: any) {
    let index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    this.Item_Compras_GeneralesData[index].IsDeleted = true;
    this.dataSourceItem_Compras_Generales.data = this.Item_Compras_GeneralesData;
    this.dataSourceItem_Compras_Generales._updateChangeSubscription();
    index = this.dataSourceItem_Compras_Generales.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditItem_Compras_Generales(element: any) {
    let index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Item_Compras_GeneralesData[index].IsDeleted = true;
      this.dataSourceItem_Compras_Generales.data = this.Item_Compras_GeneralesData;
      this.dataSourceItem_Compras_Generales._updateChangeSubscription();
      index = this.Item_Compras_GeneralesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveItem_Compras_Generales(element: any) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    const formItem_Compras_Generales = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
    this.Item_Compras_GeneralesData[index].Descripcion = formItem_Compras_Generales.value.Descripcion;
    this.Item_Compras_GeneralesData[index].Cantidad_Requerida = formItem_Compras_Generales.value.Cantidad_Requerida;
    if (this.Item_Compras_GeneralesData[index].Unidad_de_Medida !== formItem_Compras_Generales.value.Unidad_de_Medida && formItem_Compras_Generales.value.Unidad_de_Medida > 0) {
		let unidad = await this.UnidadService.getById(formItem_Compras_Generales.value.Unidad_de_Medida).toPromise();
        this.Item_Compras_GeneralesData[index].Unidad_de_Medida_Unidad = unidad;
    }
    this.Item_Compras_GeneralesData[index].Unidad_de_Medida = formItem_Compras_Generales.value.Unidad_de_Medida;
    if (this.Item_Compras_GeneralesData[index].Urgencia !== formItem_Compras_Generales.value.Urgencia && formItem_Compras_Generales.value.Urgencia > 0) {
		let urgencia = await this.UrgenciaService.getById(formItem_Compras_Generales.value.Urgencia).toPromise();
        this.Item_Compras_GeneralesData[index].Urgencia_Urgencia = urgencia;
    }
    this.Item_Compras_GeneralesData[index].Urgencia = formItem_Compras_Generales.value.Urgencia;
    this.Item_Compras_GeneralesData[index].Aplicacion_y_Justificacion = formItem_Compras_Generales.value.Aplicacion_y_Justificacion;
    this.Item_Compras_GeneralesData[index].Fecha_requerida = formItem_Compras_Generales.value.Fecha_requerida;
    this.Item_Compras_GeneralesData[index].Observaciones = formItem_Compras_Generales.value.Observaciones;
    this.Item_Compras_GeneralesData[index].Estatus_de_Seguimiento = formItem_Compras_Generales.value.Estatus_de_Seguimiento;
    this.Item_Compras_GeneralesData[index].Estatus_de_Seguimiento_Estatus_de_Seguimiento = formItem_Compras_Generales.value.Estatus_de_Seguimiento !== '' ?
     this.varEstatus_de_Seguimiento.filter(d => d.Folio === formItem_Compras_Generales.value.Estatus_de_Seguimiento)[0] : null ;	
	
    this.Item_Compras_GeneralesData[index].isNew = false;
    this.dataSourceItem_Compras_Generales.data = this.Item_Compras_GeneralesData;
    this.dataSourceItem_Compras_Generales._updateChangeSubscription();
  }
  
  editItem_Compras_Generales(element: any) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    const formItem_Compras_Generales = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
	this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index] = this.dataSourceItem_Compras_Generales.data[index].Unidad_de_Medida_Unidad.Descripcion;
    this.addFilterToControlUnidad_de_Medida_Detalle_de_Item_Compras_Generales(formItem_Compras_Generales.controls.Unidad_de_Medida, index);
	this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index] = this.dataSourceItem_Compras_Generales.data[index].Urgencia_Urgencia.Descripcion;
    this.addFilterToControlUrgencia_Detalle_de_Item_Compras_Generales(formItem_Compras_Generales.controls.Urgencia, index);
	    
    element.edit = true;
  }  

  async saveDetalle_de_Item_Compras_Generales(Folio: number) {
    this.dataSourceItem_Compras_Generales.data.forEach(async (d, index) => {
      const data = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Solicitud_de_Compras_Generales = Folio;
	
      
      if (model.Folio === 0) {
        // Add Item Compras Generales
		let response = await this.Detalle_de_Item_Compras_GeneralesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formItem_Compras_Generales = this.Item_Compras_GeneralesItemsByFolio(model.Folio);
        if (formItem_Compras_Generales.dirty) {
          // Update Item Compras Generales
          let response = await this.Detalle_de_Item_Compras_GeneralesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Item Compras Generales
        await this.Detalle_de_Item_Compras_GeneralesService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectUnidad_de_Medida_Detalle_de_Item_Compras_Generales(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_Compras_GeneralesForm.controls.Detalle_de_Item_Compras_GeneralesItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Unidad_de_Medida.setValue(event.option.value);
    this.displayFnUnidad_de_Medida_Detalle_de_Item_Compras_Generales(element);
  }  
  
  displayFnUnidad_de_Medida_Detalle_de_Item_Compras_Generales(this, element) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    return this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index];
  }
  updateOptionUnidad_de_Medida_Detalle_de_Item_Compras_Generales(event, element: any) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index] = event.source.viewValue;
  } 

	_filterUnidad_de_Medida_Detalle_de_Item_Compras_Generales(filter: any): Observable<Unidad> {
		const where = filter !== '' ?  "Unidad.Descripcion like '%" + filter + "%'" : '';
		return this.UnidadService.listaSelAll(0, 20, where);
	}

  addFilterToControlUnidad_de_Medida_Detalle_de_Item_Compras_Generales(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_de_Medida_Detalle_de_Item_Compras_Generales = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_de_Medida_Detalle_de_Item_Compras_Generales = true;
        return this._filterUnidad_de_Medida_Detalle_de_Item_Compras_Generales(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_de_Medida_Detalle_de_Item_Compras_Generales = false;
      this.searchUnidad_de_Medida_Detalle_de_Item_Compras_GeneralesCompleted = true;
      this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index];
    });
  }
  public selectUrgencia_Detalle_de_Item_Compras_Generales(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_Compras_GeneralesForm.controls.Detalle_de_Item_Compras_GeneralesItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Urgencia.setValue(event.option.value);
    this.displayFnUrgencia_Detalle_de_Item_Compras_Generales(element);
  }  
  
  displayFnUrgencia_Detalle_de_Item_Compras_Generales(this, element) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    return this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index];
  }
  updateOptionUrgencia_Detalle_de_Item_Compras_Generales(event, element: any) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index] = event.source.viewValue;
  } 

	_filterUrgencia_Detalle_de_Item_Compras_Generales(filter: any): Observable<Urgencia> {
		const where = filter !== '' ?  "Urgencia.Descripcion like '%" + filter + "%'" : '';
		return this.UrgenciaService.listaSelAll(0, 20, where);
	}

  addFilterToControlUrgencia_Detalle_de_Item_Compras_Generales(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUrgencia_Detalle_de_Item_Compras_Generales = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUrgencia_Detalle_de_Item_Compras_Generales = true;
        return this._filterUrgencia_Detalle_de_Item_Compras_Generales(value || '');
      })
    ).subscribe(result => {
      this.varUrgencia = result.Urgencias;
      this.isLoadingUrgencia_Detalle_de_Item_Compras_Generales = false;
      this.searchUrgencia_Detalle_de_Item_Compras_GeneralesCompleted = true;
      this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index] = this.varUrgencia.length === 0 ? '' : this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.No_de_Solicitud = +params.get('id');

        if (this.model.No_de_Solicitud) {
          this.operation = !this.Solicitud_de_Compras_GeneralesForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.No_de_Solicitud);
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
    observablesArray.push(this.Spartan_UserService.getAll());
    observablesArray.push(this.DepartamentoService.getAll());
    observablesArray.push(this.Tipo_de_Solicitud_de_ComprasService.getAll());
    observablesArray.push(this.Estatus_de_Solicitud_de_Compras_GeneralesService.getAll());
    observablesArray.push(this.Estatus_de_SeguimientoService.getAll());

    observablesArray.push(this.AutorizacionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varSpartan_User , varDepartamento , varTipo_de_Solicitud_de_Compras , varEstatus_de_Solicitud_de_Compras_Generales , varEstatus_de_Seguimiento  , varAutorizacion ]) => {
          this.varSpartan_User = varSpartan_User;
          this.varDepartamento = varDepartamento;
          this.varTipo_de_Solicitud_de_Compras = varTipo_de_Solicitud_de_Compras;
          this.varEstatus_de_Solicitud_de_Compras_Generales = varEstatus_de_Solicitud_de_Compras_Generales;
          this.varEstatus_de_Seguimiento = varEstatus_de_Seguimiento;

          this.varAutorizacion = varAutorizacion;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Solicitud_de_Compras_GeneralesForm.get('Proveedor').valueChanges.pipe(
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
	  this.Solicitud_de_Compras_GeneralesForm.get('Proveedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
	  this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });
    this.Solicitud_de_Compras_GeneralesForm.get('No_de_Vuelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo_de_Vuelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
          return this.Solicitud_de_VueloService.listaSelAll(0, 20,
            "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Solicitud_de_VueloService.listaSelAll(0, 20,
          "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.Numero_de_Vuelo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNo_de_Vuelo = false;
      this.hasOptionsNo_de_Vuelo = result?.Solicitud_de_Vuelos?.length > 0;
	  this.Solicitud_de_Compras_GeneralesForm.get('No_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
	  this.optionsNo_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNo_de_Vuelo = false;
      this.hasOptionsNo_de_Vuelo = false;
      this.optionsNo_de_Vuelo = of([]);
    });
    this.Solicitud_de_Compras_GeneralesForm.get('Tramo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingTramo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.ICAO_IATA like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.ICAO_IATA like '%" + value.ICAO_IATA.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingTramo = false;
      this.hasOptionsTramo = result?.Aeropuertoss?.length > 0;
	  this.Solicitud_de_Compras_GeneralesForm.get('Tramo').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
	  this.optionsTramo = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingTramo = false;
      this.hasOptionsTramo = false;
      this.optionsTramo = of([]);
    });
    this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_S').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNumero_de_O_S = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Orden_de_servicioService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Orden_de_servicioService.listaSelAll(0, 20, '');
          return this.Orden_de_servicioService.listaSelAll(0, 20,
            "Orden_de_servicio.Folio_OS like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Orden_de_servicioService.listaSelAll(0, 20,
          "Orden_de_servicio.Folio_OS like '%" + value.Folio_OS.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNumero_de_O_S = false;
      this.hasOptionsNumero_de_O_S = result?.Orden_de_servicios?.length > 0;
	  this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_S').setValue(result?.Orden_de_servicios[0], { onlySelf: true, emitEvent: false });
	  this.optionsNumero_de_O_S = of(result?.Orden_de_servicios);
    }, error => {
      this.isLoadingNumero_de_O_S = false;
      this.hasOptionsNumero_de_O_S = false;
      this.optionsNumero_de_O_S = of([]);
    });
    this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_T').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNumero_de_O_T = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
          return this.Orden_de_TrabajoService.listaSelAll(0, 20,
            "Orden_de_Trabajo.numero_de_orden like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Orden_de_TrabajoService.listaSelAll(0, 20,
          "Orden_de_Trabajo.numero_de_orden like '%" + value.numero_de_orden.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNumero_de_O_T = false;
      this.hasOptionsNumero_de_O_T = result?.Orden_de_Trabajos?.length > 0;
	  this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_T').setValue(result?.Orden_de_Trabajos[0], { onlySelf: true, emitEvent: false });
	  this.optionsNumero_de_O_T = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingNumero_de_O_T = false;
      this.hasOptionsNumero_de_O_T = false;
      this.optionsNumero_de_O_T = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Usuario_que_Registra': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Departamento': {
        this.DepartamentoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDepartamento = x.Departamentos;
        });
        break;
      }
      case 'Tipo': {
        this.Tipo_de_Solicitud_de_ComprasService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Solicitud_de_Compras = x.Tipo_de_Solicitud_de_Comprass;
        });
        break;
      }
      case 'Estatus_de_Solicitud': {
        this.Estatus_de_Solicitud_de_Compras_GeneralesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Solicitud_de_Compras_Generales = x.Estatus_de_Solicitud_de_Compras_Generaless;
        });
        break;
      }
      case 'Estatus_de_Seguimiento': {
        this.Estatus_de_SeguimientoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Seguimiento = x.Estatus_de_Seguimientos;
        });
        break;
      }

      case 'Autorizado_por': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Resultado': {
        this.AutorizacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAutorizacion = x.Autorizacions;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

displayFnProveedor(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }
displayFnNo_de_Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }
displayFnTramo(option: Aeropuertos) {
    return option?.ICAO_IATA;
  }
displayFnNumero_de_O_S(option: Orden_de_servicio) {
    return option?.Folio_OS;
  }
displayFnNumero_de_O_T(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Solicitud_de_Compras_GeneralesForm.value;
      entity.No_de_Solicitud = this.model.No_de_Solicitud;
      entity.Proveedor = this.Solicitud_de_Compras_GeneralesForm.get('Proveedor').value.Clave;
      entity.No_de_Vuelo = this.Solicitud_de_Compras_GeneralesForm.get('No_de_Vuelo').value.Folio;
      entity.Tramo = this.Solicitud_de_Compras_GeneralesForm.get('Tramo').value.Aeropuerto_ID;
      entity.Numero_de_O_S = this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_S').value.Folio;
      entity.Numero_de_O_T = this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_T').value.Folio;
	  	  
	  
	  if (this.model.No_de_Solicitud > 0 ) {
        await this.Solicitud_de_Compras_GeneralesService.update(this.model.No_de_Solicitud, entity).toPromise();

        await this.saveDetalle_de_Item_Compras_Generales(this.model.No_de_Solicitud);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.No_de_Solicitud.toString());
        this.spinner.hide('loading');
        return this.model.No_de_Solicitud;
      } else {
        await (this.Solicitud_de_Compras_GeneralesService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Item_Compras_Generales(id);

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
    if (this.model.No_de_Solicitud === 0 ) {
      this.Solicitud_de_Compras_GeneralesForm.reset();
      this.model = new Solicitud_de_Compras_Generales(this.fb);
      this.Solicitud_de_Compras_GeneralesForm = this.model.buildFormGroup();
      this.dataSourceItem_Compras_Generales = new MatTableDataSource<Detalle_de_Item_Compras_Generales>();
      this.Item_Compras_GeneralesData = [];

    } else {
      this.router.navigate(['views/Solicitud_de_Compras_Generales/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.No_de_Solicitud = 0;

  }
  
  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Solicitud_de_Compras_Generales/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas
  ')
  
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
    const result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }
  
  

//Fin de reglas
  
}
