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
import { CMP_a_CotizarService } from 'src/app/api-services/CMP_a_Cotizar.service';
import { CMP_a_Cotizar } from 'src/app/models/CMP_a_Cotizar';
import { CotizacionService } from 'src/app/api-services/Cotizacion.service';
import { Cotizacion } from 'src/app/models/Cotizacion';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Tipo_de_ReporteService } from 'src/app/api-services/Tipo_de_Reporte.service';
import { Tipo_de_Reporte } from 'src/app/models/Tipo_de_Reporte';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Detalle_Partes_CMP_CotizarService } from 'src/app/api-services/Detalle_Partes_CMP_Cotizar.service';
import { Detalle_Partes_CMP_Cotizar } from 'src/app/models/Detalle_Partes_CMP_Cotizar';
import { PiezasService } from 'src/app/api-services/Piezas.service';
import { Piezas } from 'src/app/models/Piezas';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { UtilidadService } from 'src/app/api-services/Utilidad.service';
import { Utilidad } from 'src/app/models/Utilidad';
import { Tipo_de_Condicion_ParteService } from 'src/app/api-services/Tipo_de_Condicion_Parte.service';
import { Tipo_de_Condicion_Parte } from 'src/app/models/Tipo_de_Condicion_Parte';

import { Detalle_Servicios_Externos_CMP_CotizarService } from 'src/app/api-services/Detalle_Servicios_Externos_CMP_Cotizar.service';
import { Detalle_Servicios_Externos_CMP_Cotizar } from 'src/app/models/Detalle_Servicios_Externos_CMP_Cotizar';
import { ServiciosService } from 'src/app/api-services/Servicios.service';
import { Servicios } from 'src/app/models/Servicios';

import { Estatus_de_CMP_a_CotizarService } from 'src/app/api-services/Estatus_de_CMP_a_Cotizar.service';
import { Estatus_de_CMP_a_Cotizar } from 'src/app/models/Estatus_de_CMP_a_Cotizar';

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
  selector: 'app-CMP_a_Cotizar',
  templateUrl: './CMP_a_Cotizar.component.html',
  styleUrls: ['./CMP_a_Cotizar.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CMP_a_CotizarComponent implements OnInit, AfterViewInit {
MRaddServicios_Externos_Asociados: boolean = false;
MRaddPartes_Asociadas: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	CMP_a_CotizarForm: FormGroup;
	public Editor = ClassicEditor;
	model: CMP_a_Cotizar;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsCotizacion: Observable<Cotizacion[]>;
	hasOptionsCotizacion: boolean;
	isLoadingCotizacion: boolean;
	optionsOrden_de_Trabajo: Observable<Orden_de_Trabajo[]>;
	hasOptionsOrden_de_Trabajo: boolean;
	isLoadingOrden_de_Trabajo: boolean;
	public varTipo_de_Reporte: Tipo_de_Reporte[] = [];
	optionsCodigo_Computarizado: Observable<Codigo_Computarizado[]>;
	hasOptionsCodigo_Computarizado: boolean;
	isLoadingCodigo_Computarizado: boolean;
	public varPiezas: Piezas[] = [];
	public varUnidad: Unidad[] = [];
	public varUtilidad: Utilidad[] = [];
	public varTipo_de_Condicion_Parte: Tipo_de_Condicion_Parte[] = [];

  autoNumero_de_Parte_Detalle_Partes_CMP_Cotizar = new FormControl();
  SelectedNumero_de_Parte_Detalle_Partes_CMP_Cotizar: string[] = [];
  isLoadingNumero_de_Parte_Detalle_Partes_CMP_Cotizar: boolean;
  searchNumero_de_Parte_Detalle_Partes_CMP_CotizarCompleted: boolean;
  autoUnidad_Detalle_Partes_CMP_Cotizar = new FormControl();
  SelectedUnidad_Detalle_Partes_CMP_Cotizar: string[] = [];
  isLoadingUnidad_Detalle_Partes_CMP_Cotizar: boolean;
  searchUnidad_Detalle_Partes_CMP_CotizarCompleted: boolean;
  autoCondicion_Detalle_Partes_CMP_Cotizar = new FormControl();
  SelectedCondicion_Detalle_Partes_CMP_Cotizar: string[] = [];
  isLoadingCondicion_Detalle_Partes_CMP_Cotizar: boolean;
  searchCondicion_Detalle_Partes_CMP_CotizarCompleted: boolean;

	public varServicios: Servicios[] = [];

  autoCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar = new FormControl();
  SelectedCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar: string[] = [];
  isLoadingCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar: boolean;
  searchCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_CotizarCompleted: boolean;

	public varEstatus_de_CMP_a_Cotizar: Estatus_de_CMP_a_Cotizar[] = [];

	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourcePartes_Asociadas = new MatTableDataSource<Detalle_Partes_CMP_Cotizar>();
  Partes_AsociadasColumns = [
    { def: 'actions', hide: false },
    { def: 'Numero_de_Parte', hide: false },
    { def: 'Ultimo_Costo_Cotizado', hide: false },
    { def: 'Parte__Material_conseguida', hide: false },
    { def: 'Costo_Original', hide: false },
    { def: 'Costo_de_Parte', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Utilidad', hide: false },
    { def: 'Condicion', hide: false },
    { def: 'Motivo_de_Incumplimiento', hide: false },
	
  ];
  Partes_AsociadasData: Detalle_Partes_CMP_Cotizar[] = [];
  dataSourceServicios_Externos_Asociados = new MatTableDataSource<Detalle_Servicios_Externos_CMP_Cotizar>();
  Servicios_Externos_AsociadosColumns = [
    { def: 'actions', hide: false },
    { def: 'Codigo_de_Servicio', hide: false },
    { def: 'Servicio_proporcionado_por_el_cliente', hide: false },
    { def: 'Costo_de_Servicio', hide: false },
    { def: 'Taller_Externo', hide: false },
	
  ];
  Servicios_Externos_AsociadosData: Detalle_Servicios_Externos_CMP_Cotizar[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private CMP_a_CotizarService: CMP_a_CotizarService,
    private CotizacionService: CotizacionService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Tipo_de_ReporteService: Tipo_de_ReporteService,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,
    private Detalle_Partes_CMP_CotizarService: Detalle_Partes_CMP_CotizarService,
    private PiezasService: PiezasService,
    private UnidadService: UnidadService,
    private UtilidadService: UtilidadService,
    private Tipo_de_Condicion_ParteService: Tipo_de_Condicion_ParteService,

    private Detalle_Servicios_Externos_CMP_CotizarService: Detalle_Servicios_Externos_CMP_CotizarService,
    private ServiciosService: ServiciosService,

    private Estatus_de_CMP_a_CotizarService: Estatus_de_CMP_a_CotizarService,

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
    this.model = new CMP_a_Cotizar(this.fb);
    this.CMP_a_CotizarForm = this.model.buildFormGroup();
    this.Partes_AsociadasItems.removeAt(0);
    this.Servicios_Externos_AsociadosItems.removeAt(0);
	
	this.CMP_a_CotizarForm.get('Folio').disable();
    this.CMP_a_CotizarForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourcePartes_Asociadas.paginator = this.paginator;
    this.dataSourceServicios_Externos_Asociados.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Partes_AsociadasColumns.splice(0, 1);
          this.Servicios_Externos_AsociadosColumns.splice(0, 1);
		
          this.CMP_a_CotizarForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.CMP_a_Cotizar)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.CMP_a_CotizarForm, 'Cotizacion', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.CMP_a_CotizarForm, 'Orden_de_Trabajo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.CMP_a_CotizarForm, 'Codigo_Computarizado', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.CMP_a_CotizarService.listaSelAll(0, 1, 'CMP_a_Cotizar.Folio=' + id).toPromise();
	if (result.CMP_a_Cotizars.length > 0) {
        let fPartes_Asociadas = await this.Detalle_Partes_CMP_CotizarService.listaSelAll(0, 1000,'CMP_a_Cotizar.Folio=' + id).toPromise();
            this.Partes_AsociadasData = fPartes_Asociadas.Detalle_Partes_CMP_Cotizars;
            this.loadPartes_Asociadas(fPartes_Asociadas.Detalle_Partes_CMP_Cotizars);
            this.dataSourcePartes_Asociadas = new MatTableDataSource(fPartes_Asociadas.Detalle_Partes_CMP_Cotizars);
            this.dataSourcePartes_Asociadas.paginator = this.paginator;
            this.dataSourcePartes_Asociadas.sort = this.sort;
        let fServicios_Externos_Asociados = await this.Detalle_Servicios_Externos_CMP_CotizarService.listaSelAll(0, 1000,'CMP_a_Cotizar.Folio=' + id).toPromise();
            this.Servicios_Externos_AsociadosData = fServicios_Externos_Asociados.Detalle_Servicios_Externos_CMP_Cotizars;
            this.loadServicios_Externos_Asociados(fServicios_Externos_Asociados.Detalle_Servicios_Externos_CMP_Cotizars);
            this.dataSourceServicios_Externos_Asociados = new MatTableDataSource(fServicios_Externos_Asociados.Detalle_Servicios_Externos_CMP_Cotizars);
            this.dataSourceServicios_Externos_Asociados.paginator = this.paginator;
            this.dataSourceServicios_Externos_Asociados.sort = this.sort;
	  
        this.model.fromObject(result.CMP_a_Cotizars[0]);
        this.CMP_a_CotizarForm.get('Cotizacion').setValue(
          result.CMP_a_Cotizars[0].Cotizacion_Cotizacion.Numero_de_Cotizacion,
          { onlySelf: false, emitEvent: true }
        );
        this.CMP_a_CotizarForm.get('Orden_de_Trabajo').setValue(
          result.CMP_a_Cotizars[0].Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
          { onlySelf: false, emitEvent: true }
        );
        this.CMP_a_CotizarForm.get('Codigo_Computarizado').setValue(
          result.CMP_a_Cotizars[0].Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda,
          { onlySelf: false, emitEvent: true }
        );

		this.CMP_a_CotizarForm.markAllAsTouched();
		this.CMP_a_CotizarForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Partes_AsociadasItems() {
    return this.CMP_a_CotizarForm.get('Detalle_Partes_CMP_CotizarItems') as FormArray;
  }

  getPartes_AsociadasColumns(): string[] {
    return this.Partes_AsociadasColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPartes_Asociadas(Partes_Asociadas: Detalle_Partes_CMP_Cotizar[]) {
    Partes_Asociadas.forEach(element => {
      this.addPartes_Asociadas(element);
    });
  }

  addPartes_AsociadasToMR() {
    const Partes_Asociadas = new Detalle_Partes_CMP_Cotizar(this.fb);
    this.Partes_AsociadasData.push(this.addPartes_Asociadas(Partes_Asociadas));
    this.dataSourcePartes_Asociadas.data = this.Partes_AsociadasData;
    Partes_Asociadas.edit = true;
    Partes_Asociadas.isNew = true;
    const length = this.dataSourcePartes_Asociadas.data.length;
    const index = length - 1;
    const formPartes_Asociadas = this.Partes_AsociadasItems.controls[index] as FormGroup;
	this.addFilterToControlNumero_de_Parte_Detalle_Partes_CMP_Cotizar(formPartes_Asociadas.controls.Numero_de_Parte, index);
	this.addFilterToControlUnidad_Detalle_Partes_CMP_Cotizar(formPartes_Asociadas.controls.Unidad, index);
	this.addFilterToControlCondicion_Detalle_Partes_CMP_Cotizar(formPartes_Asociadas.controls.Condicion, index);
    
    const page = Math.ceil(this.dataSourcePartes_Asociadas.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addPartes_Asociadas(entity: Detalle_Partes_CMP_Cotizar) {
    const Partes_Asociadas = new Detalle_Partes_CMP_Cotizar(this.fb);
    this.Partes_AsociadasItems.push(Partes_Asociadas.buildFormGroup());
    if (entity) {
      Partes_Asociadas.fromObject(entity);
    }
	return entity;
  }  

  Partes_AsociadasItemsByFolio(Folio: number): FormGroup {
    return (this.CMP_a_CotizarForm.get('Detalle_Partes_CMP_CotizarItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Partes_AsociadasItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
	let fb = this.Partes_AsociadasItems.controls[index] as FormGroup;
    return fb;
  }  

  deletePartes_Asociadas(element: any) {
    let index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    this.Partes_AsociadasData[index].IsDeleted = true;
    this.dataSourcePartes_Asociadas.data = this.Partes_AsociadasData;
    this.dataSourcePartes_Asociadas._updateChangeSubscription();
    index = this.dataSourcePartes_Asociadas.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditPartes_Asociadas(element: any) {
    let index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Partes_AsociadasData[index].IsDeleted = true;
      this.dataSourcePartes_Asociadas.data = this.Partes_AsociadasData;
      this.dataSourcePartes_Asociadas._updateChangeSubscription();
      index = this.Partes_AsociadasData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async savePartes_Asociadas(element: any) {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    const formPartes_Asociadas = this.Partes_AsociadasItems.controls[index] as FormGroup;
    if (this.Partes_AsociadasData[index].Numero_de_Parte !== formPartes_Asociadas.value.Numero_de_Parte && formPartes_Asociadas.value.Numero_de_Parte > 0) {
		let piezas = await this.PiezasService.getById(formPartes_Asociadas.value.Numero_de_Parte).toPromise();
        this.Partes_AsociadasData[index].Numero_de_Parte_Piezas = piezas;
    }
    this.Partes_AsociadasData[index].Numero_de_Parte = formPartes_Asociadas.value.Numero_de_Parte;
    this.Partes_AsociadasData[index].Ultimo_Costo_Cotizado = formPartes_Asociadas.value.Ultimo_Costo_Cotizado;
    this.Partes_AsociadasData[index].Parte__Material_conseguida = formPartes_Asociadas.value.Parte__Material_conseguida;
    this.Partes_AsociadasData[index].Costo_Original = formPartes_Asociadas.value.Costo_Original;
    this.Partes_AsociadasData[index].Costo_de_Parte = formPartes_Asociadas.value.Costo_de_Parte;
    this.Partes_AsociadasData[index].Cantidad = formPartes_Asociadas.value.Cantidad;
    if (this.Partes_AsociadasData[index].Unidad !== formPartes_Asociadas.value.Unidad && formPartes_Asociadas.value.Unidad > 0) {
		let unidad = await this.UnidadService.getById(formPartes_Asociadas.value.Unidad).toPromise();
        this.Partes_AsociadasData[index].Unidad_Unidad = unidad;
    }
    this.Partes_AsociadasData[index].Unidad = formPartes_Asociadas.value.Unidad;
    this.Partes_AsociadasData[index].Utilidad = formPartes_Asociadas.value.Utilidad;
    this.Partes_AsociadasData[index].Utilidad_Utilidad = formPartes_Asociadas.value.Utilidad !== '' ?
     this.varUtilidad.filter(d => d.Clave === formPartes_Asociadas.value.Utilidad)[0] : null ;	
    if (this.Partes_AsociadasData[index].Condicion !== formPartes_Asociadas.value.Condicion && formPartes_Asociadas.value.Condicion > 0) {
		let tipo_de_condicion_parte = await this.Tipo_de_Condicion_ParteService.getById(formPartes_Asociadas.value.Condicion).toPromise();
        this.Partes_AsociadasData[index].Condicion_Tipo_de_Condicion_Parte = tipo_de_condicion_parte;
    }
    this.Partes_AsociadasData[index].Condicion = formPartes_Asociadas.value.Condicion;
    this.Partes_AsociadasData[index].Motivo_de_Incumplimiento = formPartes_Asociadas.value.Motivo_de_Incumplimiento;
	
    this.Partes_AsociadasData[index].isNew = false;
    this.dataSourcePartes_Asociadas.data = this.Partes_AsociadasData;
    this.dataSourcePartes_Asociadas._updateChangeSubscription();
  }
  
  editPartes_Asociadas(element: any) {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    const formPartes_Asociadas = this.Partes_AsociadasItems.controls[index] as FormGroup;
	this.SelectedNumero_de_Parte_Detalle_Partes_CMP_Cotizar[index] = this.dataSourcePartes_Asociadas.data[index].Numero_de_Parte_Piezas.Descripcion;
    this.addFilterToControlNumero_de_Parte_Detalle_Partes_CMP_Cotizar(formPartes_Asociadas.controls.Numero_de_Parte, index);
	this.SelectedUnidad_Detalle_Partes_CMP_Cotizar[index] = this.dataSourcePartes_Asociadas.data[index].Unidad_Unidad.Descripcion;
    this.addFilterToControlUnidad_Detalle_Partes_CMP_Cotizar(formPartes_Asociadas.controls.Unidad, index);
	this.SelectedCondicion_Detalle_Partes_CMP_Cotizar[index] = this.dataSourcePartes_Asociadas.data[index].Condicion_Tipo_de_Condicion_Parte.Descripcion;
    this.addFilterToControlCondicion_Detalle_Partes_CMP_Cotizar(formPartes_Asociadas.controls.Condicion, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Partes_CMP_Cotizar(Folio: number) {
    this.dataSourcePartes_Asociadas.data.forEach(async (d, index) => {
      const data = this.Partes_AsociadasItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.CMP_a_Cotizar = Folio;
	
      
      if (model.Folio === 0) {
        // Add Partes Asociadas
		let response = await this.Detalle_Partes_CMP_CotizarService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPartes_Asociadas = this.Partes_AsociadasItemsByFolio(model.Folio);
        if (formPartes_Asociadas.dirty) {
          // Update Partes Asociadas
          let response = await this.Detalle_Partes_CMP_CotizarService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Partes Asociadas
        await this.Detalle_Partes_CMP_CotizarService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectNumero_de_Parte_Detalle_Partes_CMP_Cotizar(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNumero_de_Parte_Detalle_Partes_CMP_Cotizar[index] = event.option.viewValue;
	let fgr = this.CMP_a_CotizarForm.controls.Detalle_Partes_CMP_CotizarItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Numero_de_Parte.setValue(event.option.value);
    this.displayFnNumero_de_Parte_Detalle_Partes_CMP_Cotizar(element);
  }  
  
  displayFnNumero_de_Parte_Detalle_Partes_CMP_Cotizar(this, element) {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    return this.SelectedNumero_de_Parte_Detalle_Partes_CMP_Cotizar[index];
  }
  updateOptionNumero_de_Parte_Detalle_Partes_CMP_Cotizar(event, element: any) {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    this.SelectedNumero_de_Parte_Detalle_Partes_CMP_Cotizar[index] = event.source.viewValue;
  } 

	_filterNumero_de_Parte_Detalle_Partes_CMP_Cotizar(filter: any): Observable<Piezas> {
		const where = filter !== '' ?  "Piezas.Descripcion like '%" + filter + "%'" : '';
		return this.PiezasService.listaSelAll(0, 20, where);
	}

  addFilterToControlNumero_de_Parte_Detalle_Partes_CMP_Cotizar(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNumero_de_Parte_Detalle_Partes_CMP_Cotizar = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNumero_de_Parte_Detalle_Partes_CMP_Cotizar = true;
        return this._filterNumero_de_Parte_Detalle_Partes_CMP_Cotizar(value || '');
      })
    ).subscribe(result => {
      this.varPiezas = result.Piezass;
      this.isLoadingNumero_de_Parte_Detalle_Partes_CMP_Cotizar = false;
      this.searchNumero_de_Parte_Detalle_Partes_CMP_CotizarCompleted = true;
      this.SelectedNumero_de_Parte_Detalle_Partes_CMP_Cotizar[index] = this.varPiezas.length === 0 ? '' : this.SelectedNumero_de_Parte_Detalle_Partes_CMP_Cotizar[index];
    });
  }
  public selectUnidad_Detalle_Partes_CMP_Cotizar(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_Detalle_Partes_CMP_Cotizar[index] = event.option.viewValue;
	let fgr = this.CMP_a_CotizarForm.controls.Detalle_Partes_CMP_CotizarItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Unidad.setValue(event.option.value);
    this.displayFnUnidad_Detalle_Partes_CMP_Cotizar(element);
  }  
  
  displayFnUnidad_Detalle_Partes_CMP_Cotizar(this, element) {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    return this.SelectedUnidad_Detalle_Partes_CMP_Cotizar[index];
  }
  updateOptionUnidad_Detalle_Partes_CMP_Cotizar(event, element: any) {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    this.SelectedUnidad_Detalle_Partes_CMP_Cotizar[index] = event.source.viewValue;
  } 

	_filterUnidad_Detalle_Partes_CMP_Cotizar(filter: any): Observable<Unidad> {
		const where = filter !== '' ?  "Unidad.Descripcion like '%" + filter + "%'" : '';
		return this.UnidadService.listaSelAll(0, 20, where);
	}

  addFilterToControlUnidad_Detalle_Partes_CMP_Cotizar(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_Detalle_Partes_CMP_Cotizar = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_Detalle_Partes_CMP_Cotizar = true;
        return this._filterUnidad_Detalle_Partes_CMP_Cotizar(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_Detalle_Partes_CMP_Cotizar = false;
      this.searchUnidad_Detalle_Partes_CMP_CotizarCompleted = true;
      this.SelectedUnidad_Detalle_Partes_CMP_Cotizar[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_Detalle_Partes_CMP_Cotizar[index];
    });
  }
  public selectCondicion_Detalle_Partes_CMP_Cotizar(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedCondicion_Detalle_Partes_CMP_Cotizar[index] = event.option.viewValue;
	let fgr = this.CMP_a_CotizarForm.controls.Detalle_Partes_CMP_CotizarItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Condicion.setValue(event.option.value);
    this.displayFnCondicion_Detalle_Partes_CMP_Cotizar(element);
  }  
  
  displayFnCondicion_Detalle_Partes_CMP_Cotizar(this, element) {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    return this.SelectedCondicion_Detalle_Partes_CMP_Cotizar[index];
  }
  updateOptionCondicion_Detalle_Partes_CMP_Cotizar(event, element: any) {
    const index = this.dataSourcePartes_Asociadas.data.indexOf(element);
    this.SelectedCondicion_Detalle_Partes_CMP_Cotizar[index] = event.source.viewValue;
  } 

	_filterCondicion_Detalle_Partes_CMP_Cotizar(filter: any): Observable<Tipo_de_Condicion_Parte> {
		const where = filter !== '' ?  "Tipo_de_Condicion_Parte.Descripcion like '%" + filter + "%'" : '';
		return this.Tipo_de_Condicion_ParteService.listaSelAll(0, 20, where);
	}

  addFilterToControlCondicion_Detalle_Partes_CMP_Cotizar(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCondicion_Detalle_Partes_CMP_Cotizar = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCondicion_Detalle_Partes_CMP_Cotizar = true;
        return this._filterCondicion_Detalle_Partes_CMP_Cotizar(value || '');
      })
    ).subscribe(result => {
      this.varTipo_de_Condicion_Parte = result.Tipo_de_Condicion_Partes;
      this.isLoadingCondicion_Detalle_Partes_CMP_Cotizar = false;
      this.searchCondicion_Detalle_Partes_CMP_CotizarCompleted = true;
      this.SelectedCondicion_Detalle_Partes_CMP_Cotizar[index] = this.varTipo_de_Condicion_Parte.length === 0 ? '' : this.SelectedCondicion_Detalle_Partes_CMP_Cotizar[index];
    });
  }

  get Servicios_Externos_AsociadosItems() {
    return this.CMP_a_CotizarForm.get('Detalle_Servicios_Externos_CMP_CotizarItems') as FormArray;
  }

  getServicios_Externos_AsociadosColumns(): string[] {
    return this.Servicios_Externos_AsociadosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadServicios_Externos_Asociados(Servicios_Externos_Asociados: Detalle_Servicios_Externos_CMP_Cotizar[]) {
    Servicios_Externos_Asociados.forEach(element => {
      this.addServicios_Externos_Asociados(element);
    });
  }

  addServicios_Externos_AsociadosToMR() {
    const Servicios_Externos_Asociados = new Detalle_Servicios_Externos_CMP_Cotizar(this.fb);
    this.Servicios_Externos_AsociadosData.push(this.addServicios_Externos_Asociados(Servicios_Externos_Asociados));
    this.dataSourceServicios_Externos_Asociados.data = this.Servicios_Externos_AsociadosData;
    Servicios_Externos_Asociados.edit = true;
    Servicios_Externos_Asociados.isNew = true;
    const length = this.dataSourceServicios_Externos_Asociados.data.length;
    const index = length - 1;
    const formServicios_Externos_Asociados = this.Servicios_Externos_AsociadosItems.controls[index] as FormGroup;
	this.addFilterToControlCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar(formServicios_Externos_Asociados.controls.Codigo_de_Servicio, index);
    
    const page = Math.ceil(this.dataSourceServicios_Externos_Asociados.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addServicios_Externos_Asociados(entity: Detalle_Servicios_Externos_CMP_Cotizar) {
    const Servicios_Externos_Asociados = new Detalle_Servicios_Externos_CMP_Cotizar(this.fb);
    this.Servicios_Externos_AsociadosItems.push(Servicios_Externos_Asociados.buildFormGroup());
    if (entity) {
      Servicios_Externos_Asociados.fromObject(entity);
    }
	return entity;
  }  

  Servicios_Externos_AsociadosItemsByFolio(Folio: number): FormGroup {
    return (this.CMP_a_CotizarForm.get('Detalle_Servicios_Externos_CMP_CotizarItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Servicios_Externos_AsociadosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceServicios_Externos_Asociados.data.indexOf(element);
	let fb = this.Servicios_Externos_AsociadosItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteServicios_Externos_Asociados(element: any) {
    let index = this.dataSourceServicios_Externos_Asociados.data.indexOf(element);
    this.Servicios_Externos_AsociadosData[index].IsDeleted = true;
    this.dataSourceServicios_Externos_Asociados.data = this.Servicios_Externos_AsociadosData;
    this.dataSourceServicios_Externos_Asociados._updateChangeSubscription();
    index = this.dataSourceServicios_Externos_Asociados.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditServicios_Externos_Asociados(element: any) {
    let index = this.dataSourceServicios_Externos_Asociados.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Servicios_Externos_AsociadosData[index].IsDeleted = true;
      this.dataSourceServicios_Externos_Asociados.data = this.Servicios_Externos_AsociadosData;
      this.dataSourceServicios_Externos_Asociados._updateChangeSubscription();
      index = this.Servicios_Externos_AsociadosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveServicios_Externos_Asociados(element: any) {
    const index = this.dataSourceServicios_Externos_Asociados.data.indexOf(element);
    const formServicios_Externos_Asociados = this.Servicios_Externos_AsociadosItems.controls[index] as FormGroup;
    if (this.Servicios_Externos_AsociadosData[index].Codigo_de_Servicio !== formServicios_Externos_Asociados.value.Codigo_de_Servicio && formServicios_Externos_Asociados.value.Codigo_de_Servicio > 0) {
		let servicios = await this.ServiciosService.getById(formServicios_Externos_Asociados.value.Codigo_de_Servicio).toPromise();
        this.Servicios_Externos_AsociadosData[index].Codigo_de_Servicio_Servicios = servicios;
    }
    this.Servicios_Externos_AsociadosData[index].Codigo_de_Servicio = formServicios_Externos_Asociados.value.Codigo_de_Servicio;
    this.Servicios_Externos_AsociadosData[index].Ultimo_Costo_Cotizado = formServicios_Externos_Asociados.value.Ultimo_Costo_Cotizado;
    this.Servicios_Externos_AsociadosData[index].Servicio_proporcionado_por_el_cliente = formServicios_Externos_Asociados.value.Servicio_proporcionado_por_el_cliente;
    this.Servicios_Externos_AsociadosData[index].Costo_de_Servicio = formServicios_Externos_Asociados.value.Costo_de_Servicio;
    this.Servicios_Externos_AsociadosData[index].Cantidad = formServicios_Externos_Asociados.value.Cantidad;
    this.Servicios_Externos_AsociadosData[index].Utilidad = formServicios_Externos_Asociados.value.Utilidad;
    this.Servicios_Externos_AsociadosData[index].Utilidad_Utilidad = formServicios_Externos_Asociados.value.Utilidad !== '' ?
     this.varUtilidad.filter(d => d.Clave === formServicios_Externos_Asociados.value.Utilidad)[0] : null ;	
    this.Servicios_Externos_AsociadosData[index].Taller_Externo = formServicios_Externos_Asociados.value.Taller_Externo;
    this.Servicios_Externos_AsociadosData[index].Motivo_de_Incumplimiento = formServicios_Externos_Asociados.value.Motivo_de_Incumplimiento;
	
    this.Servicios_Externos_AsociadosData[index].isNew = false;
    this.dataSourceServicios_Externos_Asociados.data = this.Servicios_Externos_AsociadosData;
    this.dataSourceServicios_Externos_Asociados._updateChangeSubscription();
  }
  
  editServicios_Externos_Asociados(element: any) {
    const index = this.dataSourceServicios_Externos_Asociados.data.indexOf(element);
    const formServicios_Externos_Asociados = this.Servicios_Externos_AsociadosItems.controls[index] as FormGroup;
	this.SelectedCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar[index] = this.dataSourceServicios_Externos_Asociados.data[index].Codigo_de_Servicio_Servicios.Descripcion_Busqueda;
    this.addFilterToControlCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar(formServicios_Externos_Asociados.controls.Codigo_de_Servicio, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Servicios_Externos_CMP_Cotizar(Folio: number) {
    this.dataSourceServicios_Externos_Asociados.data.forEach(async (d, index) => {
      const data = this.Servicios_Externos_AsociadosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.CMP_a_Cotizar = Folio;
	
      
      if (model.Folio === 0) {
        // Add Servicios Externos Asociados
		let response = await this.Detalle_Servicios_Externos_CMP_CotizarService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formServicios_Externos_Asociados = this.Servicios_Externos_AsociadosItemsByFolio(model.Folio);
        if (formServicios_Externos_Asociados.dirty) {
          // Update Servicios Externos Asociados
          let response = await this.Detalle_Servicios_Externos_CMP_CotizarService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Servicios Externos Asociados
        await this.Detalle_Servicios_Externos_CMP_CotizarService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceServicios_Externos_Asociados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar[index] = event.option.viewValue;
	let fgr = this.CMP_a_CotizarForm.controls.Detalle_Servicios_Externos_CMP_CotizarItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Codigo_de_Servicio.setValue(event.option.value);
    this.displayFnCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar(element);
  }  
  
  displayFnCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar(this, element) {
    const index = this.dataSourceServicios_Externos_Asociados.data.indexOf(element);
    return this.SelectedCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar[index];
  }
  updateOptionCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar(event, element: any) {
    const index = this.dataSourceServicios_Externos_Asociados.data.indexOf(element);
    this.SelectedCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar[index] = event.source.viewValue;
  } 

	_filterCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar(filter: any): Observable<Servicios> {
		const where = filter !== '' ?  "Servicios.Descripcion_Busqueda like '%" + filter + "%'" : '';
		return this.ServiciosService.listaSelAll(0, 20, where);
	}

  addFilterToControlCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar = true;
        return this._filterCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar(value || '');
      })
    ).subscribe(result => {
      this.varServicios = result.Servicioss;
      this.isLoadingCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar = false;
      this.searchCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_CotizarCompleted = true;
      this.SelectedCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar[index] = this.varServicios.length === 0 ? '' : this.SelectedCodigo_de_Servicio_Detalle_Servicios_Externos_CMP_Cotizar[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.CMP_a_CotizarForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_de_ReporteService.getAll());
    observablesArray.push(this.UtilidadService.getAll());


    observablesArray.push(this.Estatus_de_CMP_a_CotizarService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varTipo_de_Reporte , varUtilidad   , varEstatus_de_CMP_a_Cotizar ]) => {
          this.varTipo_de_Reporte = varTipo_de_Reporte;
          this.varUtilidad = varUtilidad;


          this.varEstatus_de_CMP_a_Cotizar = varEstatus_de_CMP_a_Cotizar;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.CMP_a_CotizarForm.get('Cotizacion').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCotizacion = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.CotizacionService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.CotizacionService.listaSelAll(0, 20, '');
          return this.CotizacionService.listaSelAll(0, 20,
            "Cotizacion.Numero_de_Cotizacion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.CotizacionService.listaSelAll(0, 20,
          "Cotizacion.Numero_de_Cotizacion like '%" + value.Numero_de_Cotizacion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCotizacion = false;
      this.hasOptionsCotizacion = result?.Cotizacions?.length > 0;
	  this.CMP_a_CotizarForm.get('Cotizacion').setValue(result?.Cotizacions[0], { onlySelf: true, emitEvent: false });
	  this.optionsCotizacion = of(result?.Cotizacions);
    }, error => {
      this.isLoadingCotizacion = false;
      this.hasOptionsCotizacion = false;
      this.optionsCotizacion = of([]);
    });
    this.CMP_a_CotizarForm.get('Orden_de_Trabajo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingOrden_de_Trabajo = true),
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
      this.isLoadingOrden_de_Trabajo = false;
      this.hasOptionsOrden_de_Trabajo = result?.Orden_de_Trabajos?.length > 0;
	  this.CMP_a_CotizarForm.get('Orden_de_Trabajo').setValue(result?.Orden_de_Trabajos[0], { onlySelf: true, emitEvent: false });
	  this.optionsOrden_de_Trabajo = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingOrden_de_Trabajo = false;
      this.hasOptionsOrden_de_Trabajo = false;
      this.optionsOrden_de_Trabajo = of([]);
    });
    this.CMP_a_CotizarForm.get('Codigo_Computarizado').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCodigo_Computarizado = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Codigo_ComputarizadoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Codigo_ComputarizadoService.listaSelAll(0, 20, '');
          return this.Codigo_ComputarizadoService.listaSelAll(0, 20,
            "Codigo_Computarizado.Descripcion_Busqueda like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Codigo_ComputarizadoService.listaSelAll(0, 20,
          "Codigo_Computarizado.Descripcion_Busqueda like '%" + value.Descripcion_Busqueda.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCodigo_Computarizado = false;
      this.hasOptionsCodigo_Computarizado = result?.Codigo_Computarizados?.length > 0;
	  this.CMP_a_CotizarForm.get('Codigo_Computarizado').setValue(result?.Codigo_Computarizados[0], { onlySelf: true, emitEvent: false });
	  this.optionsCodigo_Computarizado = of(result?.Codigo_Computarizados);
    }, error => {
      this.isLoadingCodigo_Computarizado = false;
      this.hasOptionsCodigo_Computarizado = false;
      this.optionsCodigo_Computarizado = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tipo_de_Reporte': {
        this.Tipo_de_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Reporte = x.Tipo_de_Reportes;
        });
        break;
      }
      case 'Utilidad': {
        this.UtilidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUtilidad = x.Utilidads;
        });
        break;
      }


      case 'Estatus': {
        this.Estatus_de_CMP_a_CotizarService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_CMP_a_Cotizar = x.Estatus_de_CMP_a_Cotizars;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

displayFnCotizacion(option: Cotizacion) {
    return option?.Numero_de_Cotizacion;
  }
displayFnOrden_de_Trabajo(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
displayFnCodigo_Computarizado(option: Codigo_Computarizado) {
    return option?.Descripcion_Busqueda;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.CMP_a_CotizarForm.value;
      entity.Folio = this.model.Folio;
      entity.Cotizacion = this.CMP_a_CotizarForm.get('Cotizacion').value.Folio;
      entity.Orden_de_Trabajo = this.CMP_a_CotizarForm.get('Orden_de_Trabajo').value.Folio;
      entity.Codigo_Computarizado = this.CMP_a_CotizarForm.get('Codigo_Computarizado').value.Codigo;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.CMP_a_CotizarService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Partes_CMP_Cotizar(this.model.Folio);  
        await this.saveDetalle_Servicios_Externos_CMP_Cotizar(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.CMP_a_CotizarService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Partes_CMP_Cotizar(id);
          await this.saveDetalle_Servicios_Externos_CMP_Cotizar(id);

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
      this.CMP_a_CotizarForm.reset();
      this.model = new CMP_a_Cotizar(this.fb);
      this.CMP_a_CotizarForm = this.model.buildFormGroup();
      this.dataSourcePartes_Asociadas = new MatTableDataSource<Detalle_Partes_CMP_Cotizar>();
      this.Partes_AsociadasData = [];
      this.dataSourceServicios_Externos_Asociados = new MatTableDataSource<Detalle_Servicios_Externos_CMP_Cotizar>();
      this.Servicios_Externos_AsociadosData = [];

    } else {
      this.router.navigate(['views/CMP_a_Cotizar/add']);
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
    this.router.navigate(['/CMP_a_Cotizar/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Cotizacion_ExecuteBusinessRules(): void {
        //Cotizacion_FieldExecuteBusinessRulesEnd
    }
    Orden_de_Trabajo_ExecuteBusinessRules(): void {
        //Orden_de_Trabajo_FieldExecuteBusinessRulesEnd
    }
    Tipo_de_Reporte_ExecuteBusinessRules(): void {
        //Tipo_de_Reporte_FieldExecuteBusinessRulesEnd
    }
    Codigo_Computarizado_ExecuteBusinessRules(): void {

//INICIA - BRID:11 - Al seleccionar el código computarizado mostrar el tiempo estándar. - Autor: Administrador - Actualización: 2/9/2021 6:53:53 PM
if( this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Codigo_Computarizado')!=this.brf.TryParseInt('null', 'null') ) { this.brf.SetValueFromQuery(this.CMP_a_CotizarForm,"Tiempo_Estandar_de_Ejecucion",this.brf.EvaluaQuery(" @LC@@LB@ select Tiempo_Estandar from codigo_computarizado with(nolock) where codigo = 'FLD[Codigo_Computarizado]'", 1, "ABC123"),1,"ABC123");} else {}
//TERMINA - BRID:11


//INICIA - BRID:199 - Al seleccionar el código computarizado realizar lo siguiente:revisar si en la pantalla de configuración de código computarizado tiene partes asociadas y servicios asociados y si es así, entonces vaciarlos en los MR de Partes Asociadas y en el MR de Servicios de Terceros Asociados. Debe llenar código, descripción y cantidad en ambos MR.Llenar el tiempo estándar del código computarizado. - Autor: Lizeth Villa - Actualización: 3/3/2021 9:42:25 AM
if( this.brf.TryParseInt('Codigo_Computarizado', 'Codigo_Computarizado')!=this.brf.TryParseInt('', '') && this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Codigo_Computarizado')==this.brf.EvaluaQuery("	select codigo_computarizado from Configuracion_de_Codigo_Computarizado where codigo_computarizado = 'FLD[Codigo_Computarizado]'", 1, 'ABC123') ) { this.brf.FillMultiRenglonfromQuery(this.dataSourcePartes_Asociadas,"Detalle_Partes_CMP_Cotizar",1,"ABC123"); this.brf.FillMultiRenglonfromQuery(this.dataSourcePartes_Asociadas,"Detalle_Servicios_Externos_CMP_Cotizar",1,"ABC123");} else {}
//TERMINA - BRID:199


//INICIA - BRID:294 - Al seleccionar el código computarizado realizar lo siguiente:revisar si en la pantalla de configuración de código computarizado tiene partes asociadas y servicios asociados y si es así, entonces vaciarlos en los MR de Partes Asociadas y en el MR de Servicios de Terceros Asociados. Debe llenar código, descripción y cantidad en ambos MR.Llenar el tiempo estándar del código computarizado - Autor: Lizeth Villa - Actualización: 2/11/2021 4:47:21 PM
if( this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Codigo_Computarizado')!=this.brf.TryParseInt('null', 'null') && this.brf.EvaluaQuery("select FLDD[lblFolio]", 1, 'ABC123')==this.brf.TryParseInt('null', 'null') && this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Codigo_Computarizado')==this.brf.EvaluaQuery("select codigo_computarizado from Configuracion_de_Codigo_Computarizado where codigo_computarizado = 'FLD[Codigo_Computarizado]'", 1, 'ABC123') ) { this.brf.FillMultiRenglonfromQuery(this.dataSourcePartes_Asociadas,"Detalle_Partes_CMP_Cotizar",1,"ABC123"); this.brf.FillMultiRenglonfromQuery(this.dataSourcePartes_Asociadas,"Detalle_Servicios_Externos_CMP_Cotizar",1,"ABC123");} else {}
//TERMINA - BRID:294

//Codigo_Computarizado_FieldExecuteBusinessRulesEnd



    }
    Tiempo_Estandar_de_Ejecucion_ExecuteBusinessRules(): void {
        //Tiempo_Estandar_de_Ejecucion_FieldExecuteBusinessRulesEnd
    }
    tiempo_a_cobrar_ExecuteBusinessRules(): void {
        //tiempo_a_cobrar_FieldExecuteBusinessRulesEnd
    }
    Tiempo_a_Cobrar_Rampa_ExecuteBusinessRules(): void {
        //Tiempo_a_Cobrar_Rampa_FieldExecuteBusinessRulesEnd
    }
    Costo_HR_Tecnico_ExecuteBusinessRules(): void {

//INICIA - BRID:34 - Al editar el campo "Costo_HR_Tecnico" si el valor del campo "Costo_HR_Tecnico" es diferente a la variable global GLOBAL[varCostoTecnico] o el valor del campo "Costo_HR_Rampa" es diferente a la variable global GLOBAL[varCostoRampa] entonces - Autor: Administrador - Actualización: 2/15/2021 7:10:29 PM
if( this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Costo_HR_Tecnico')!=this.brf.TryParseInt('null', 'null') && this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Costo_HR_Tecnico')!=this.brf.EvaluaQuery("select GLOBAL[varCostoTecnico]", 1, 'ABC123') ) { this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa"); this.brf.SetRequiredControl(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa");} else { this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa"); this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa");}
//TERMINA - BRID:34

//Costo_HR_Tecnico_FieldExecuteBusinessRulesEnd

    }
    Costo_HR_Rampa_ExecuteBusinessRules(): void {

//INICIA - BRID:35 - Al editar el campo "Costo_HR_Rampa" si el valor del campo "Costo_HR_Tecnico" es diferente a la variable global GLOBAL[varCostoTecnico] o el valor del campo "Costo_HR_Rampa" es diferente a la variable global GLOBAL[varCostoRampa] entonces - Autor: Administrador - Actualización: 2/15/2021 7:11:10 PM
if( this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Costo_HR_Rampa')!=this.brf.TryParseInt('null', 'null') && this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Costo_HR_Rampa')!=this.brf.TryParseInt('select GLOBAL[varCostoRampa]', 'select GLOBAL[varCostoRampa]') ) { this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa"); this.brf.SetRequiredControl(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa");} else { this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa"); this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa"); this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa"); this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa");}
//TERMINA - BRID:35

//Costo_HR_Rampa_FieldExecuteBusinessRulesEnd

    }
    Motivo_de_Cambio_de_Tarifa_ExecuteBusinessRules(): void {
        //Motivo_de_Cambio_de_Tarifa_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:7 - campos no requeridos para hacer pruebas en el flujo. - Autor: Lizeth Villa - Actualización: 2/4/2021 12:24:35 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Folio");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Fecha_de_Registro");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Hora_de_Registro");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Usuario_que_Registra");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Cotizacion");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Tipo_de_Ingreso");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Orden_de_Trabajo");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Tipo_de_Reporte");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Cliente");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Matricula");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Modelo");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Contacto");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Codigo_Computarizado");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Descripcion");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Tiempo_Estandar_de_Ejecucion");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "tiempo_a_cobrar");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Tiempo_a_Cobrar_Rampa");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Costo_HR_Tecnico");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Costo_HR_Rampa");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Folio");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "CMP_a_Cotizar");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Numero_de_Parte");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Descripcion");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Ultimo_Costo_Cotizado");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Costo_de_Parte");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Cantidad");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Utilidad");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Folio");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "CMP_a_Cotizar");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Codigo_de_Servicio");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Descripcion");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Ultimo_Costo_Cotizado");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Costo_de_Servicio");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Cantidad");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Utilidad");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Estatus");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa");this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Servicio_proporcionado_por_el_cliente");
} 
//TERMINA - BRID:7


//INICIA - BRID:10 - Deshabilitar campos - Autor: Lizeth Villa - Actualización: 6/14/2021 12:05:01 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Fecha_de_Registro', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Hora_de_Registro', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Usuario_que_Registra', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Cotizacion', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Tipo_de_Ingreso', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Orden_de_Trabajo', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Tipo_de_Reporte', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Contacto', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Tiempo_Estandar_de_Ejecucion', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Estatus', 0); this.brf.CreateSessionVar("varCostoTecnico",this.brf.EvaluaQuery("select 'FLD[Costo_HR_Tecnico]'", 1, "ABC123"), 1,"ABC123"); this.brf.CreateSessionVar("varCostoRampa",this.brf.EvaluaQuery("select 'FLD[Costo_HR_Rampa]'", 1, "ABC123"), 1,"ABC123");
} 
//TERMINA - BRID:10


//INICIA - BRID:12 - Ocultar cotización(si no trae cotización) - Autor: Cesar M Administrador - Actualización: 2/6/2021 9:30:25 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
if( this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Cotizacion')==this.brf.TryParseInt('null', 'null') ) { this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Cotizacion"); this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Cotizacion");} else { this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Cotizacion");}
} 
//TERMINA - BRID:12


//INICIA - BRID:24 - Al abrir la pantalla, en nuevo: Estatus = Cotizado - Autor: Lizeth Villa - Actualización: 2/4/2021 12:24:41 PM
if(  this.operation == 'New' ) {
this.brf.SetValueControl(this.CMP_a_CotizarForm, "Estatus", "2");
} 
//TERMINA - BRID:24


//INICIA - BRID:28 - Al abrir la pantlala, en modificación y consulta. Si el tipo de ingreso es "Inspección"- Mostrar Orden de Trabajo y Tipo de Reporte- Deshabilitar Cliente, Matrícula, Modelo y ContactoDE LO CONTRARIO- Ocultar Orden de Trabajo y Tipo de Reporte- Habilitar Cliente, Matrícula, Modelo y Contacto - Autor: Lizeth Villa - Actualización: 6/14/2021 12:04:54 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
if( this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Tipo_de_Ingreso')==this.brf.TryParseInt('1', '1') ) { this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Orden_de_Trabajo");this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Tipo_de_Reporte"); this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Cliente', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Matricula', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Modelo', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Contacto', 0);} else { this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Orden_de_Trabajo"); this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Orden_de_Trabajo");this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Tipo_de_Reporte"); this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Tipo_de_Reporte"); this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Cliente', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Matricula', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Modelo', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Contacto', 0); this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Cliente', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Matricula', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Modelo', 0);this.brf.SetEnabledControl(this.CMP_a_CotizarForm, 'Contacto', 0);}
} 
//TERMINA - BRID:28


//INICIA - BRID:36 - prueba - Autor: Administrador - Actualización: 2/15/2021 7:11:47 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery(" select GLOBAL[varCostoTecnico]", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:36


//INICIA - BRID:37 - ocultar campo  "Motivo_de_Cambio_de_Tarifa" - Autor: Administrador - Actualización: 2/15/2021 6:58:50 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa"); this.brf.SetNotRequiredControl(this.CMP_a_CotizarForm, "Motivo_de_Cambio_de_Tarifa");
} 
//TERMINA - BRID:37


//INICIA - BRID:206 - Configuración al dar de alta una cotización de un CMP Manual - Autor: Administrador - Actualización: 2/8/2021 5:58:42 AM
if(  this.operation == 'New' ) {
this.brf.SetCurrentDateToField(this.CMP_a_CotizarForm, "Fecha_de_Registro"); this.brf.SetCurrentHourToField(this.CMP_a_CotizarForm, "Hora_de_Registro"); this.brf.AssignGlobalVariabletoField(this.CMP_a_CotizarForm,"Usuario_que_Registra","GLOBAL[USERID]"); this.brf.SetValueControl(this.CMP_a_CotizarForm, "Tipo_de_Ingreso", "2");
} 
//TERMINA - BRID:206


//INICIA - BRID:242 - prueba2 - Autor: Lizeth Villa - Actualización: 2/9/2021 12:14:53 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery("select  'FLD[Cliente]'@LC@@LB@ ", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:242


//INICIA - BRID:349 - Al editar con tipo de reporte "Inspección" y estatus "Por cotizar" - Autor: Lizeth Villa - Actualización: 2/11/2021 2:12:50 PM
if(  this.operation == 'Update' ) {
if( this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Estatus')==this.brf.TryParseInt('1', '1') && this.brf.GetValueByControlType(this.CMP_a_CotizarForm, 'Tipo_de_Ingreso')==this.brf.TryParseInt('1', '1') ) { this.brf.SetValueControl(this.CMP_a_CotizarForm, "Estatus", "2");} else {}
} 
//TERMINA - BRID:349

//rulesOnInit_ExecuteBusinessRulesEnd










  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:246 - ejecutar sp  prueba - Autor: Felipe Rodríguez - Actualización: 10/26/2021 2:43:54 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery("exec  uspGeneraCMPACotizar 1", 1, "ABC123"); this.brf.EvaluaQuery("exec uspGeneraCMPACotizar 2", 1, "ABC123");
} 
//TERMINA - BRID:246


//INICIA - BRID:387 - En nuevo, después de guardar, envíandole el folio que acaban de crear ejecutar exec uspAgregaCMPsPorDefecto GLOBAL[keyvalueinserted] - Autor: Administrador - Actualización: 2/15/2021 5:39:01 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery("uspAgregaCMPsPorDefecto GLOBAL[keyvalueinserted]", 1, "ABC123");
} 
//TERMINA - BRID:387

//rulesAfterSave_ExecuteBusinessRulesEnd


  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:184 - 2.- En modificar, antes de guardar, si el campo "Tiempo a Cobrar Rampa" no tiene formato correcto de hora HH:MM mostrar el mensaje "El Tiempo a cobrar no tiene el formato de tiempo correcto (HH:MM), favor de corregir" y no dejar guardar - Autor: Lizeth Villa - Actualización: 10/25/2021 3:47:54 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
if( this.brf.EvaluaQuery("declare @hora nvarchar(5)= 'FLD[tiempo_a_cobrar]'@LC@@LB@ select isdate('01/01/2021 ' + @hora)", 1, 'ABC123')!=this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" El Tiempo a cobrar Técnico no tiene el formato de tiempo correcto (HH:MM), favor de corregir");

result=false;} else {}
} 
//TERMINA - BRID:184


//INICIA - BRID:185 - 	1.- En modificar, antes de guardar, si el campo "Tiempo a Cobrar" no tiene formato correcto de hora HH:MM mostrar el mensaje "El Tiempo a cobrar no tiene el formato de tiempo correcto (HH:MM), favor de corregir" y no dejar guardar - Autor: Lizeth Villa - Actualización: 10/25/2021 3:47:56 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
if( this.brf.EvaluaQuery("declare @hora nvarchar(5)= 'FLD[Tiempo_a_Cobrar_Rampa]'@LC@@LB@ select isdate('01/01/2021 ' + @hora)", 1, 'ABC123')!=this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" El Tiempo a cobrar Rampa no tiene el formato de tiempo correcto (HH:MM), favor de corregir");

result=false;} else {}
} 
//TERMINA - BRID:185

//rulesBeforeSave_ExecuteBusinessRulesEnd


    return result;
  }

  //Fin de reglas
  
}
