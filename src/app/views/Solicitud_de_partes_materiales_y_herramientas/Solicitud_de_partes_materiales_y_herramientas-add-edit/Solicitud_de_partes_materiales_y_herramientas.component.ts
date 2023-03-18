import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, query, state, style, transition, trigger } from '@angular/animations';
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
import { Solicitud_de_partes_materiales_y_herramientasService } from 'src/app/api-services/Solicitud_de_partes_materiales_y_herramientas.service';
import { Solicitud_de_partes_materiales_y_herramientas } from 'src/app/models/Solicitud_de_partes_materiales_y_herramientas';
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
import { Detalle_de_Solicitud_de_partes_materiales_y_herramientasService } from 'src/app/api-services/Detalle_de_Solicitud_de_partes_materiales_y_herramientas.service';
import { Detalle_de_Solicitud_de_partes_materiales_y_herramientas } from 'src/app/models/Detalle_de_Solicitud_de_partes_materiales_y_herramientas';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Salida_en_Almacen_de_partesService } from 'src/app/api-services/Salida_en_Almacen_de_partes.service';
import { Salida_en_Almacen_de_partes } from 'src/app/models/Salida_en_Almacen_de_partes';
import { Salida_en_almacenService } from 'src/app/api-services/Salida_en_almacen.service';
import { Salida_en_almacen } from 'src/app/models/Salida_en_almacen';
import { Ingreso_a_almacenService } from 'src/app/api-services/Ingreso_a_almacen.service';
import { Ingreso_a_almacen } from 'src/app/models/Ingreso_a_almacen';


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
  selector: 'app-Solicitud_de_partes_materiales_y_herramientas',
  templateUrl: './Solicitud_de_partes_materiales_y_herramientas.component.html',
  styleUrls: ['./Solicitud_de_partes_materiales_y_herramientas.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Solicitud_de_partes_materiales_y_herramientasComponent implements OnInit, AfterViewInit {
MRaddPartes__materiales_y_herramientas: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Solicitud_de_partes_materiales_y_herramientasForm: FormGroup;
	public Editor = ClassicEditor;
	model: Solicitud_de_partes_materiales_y_herramientas;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsNo_de_OC: Observable<Generacion_de_Orden_de_Compras[]>;
	hasOptionsNo_de_OC: boolean;
	isLoadingNo_de_OC: boolean;
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
	public varDepartamento: Departamento[] = [];
	public varCategoria_de_Partes: Categoria_de_Partes[] = [];
	public varOrden_de_Trabajo: Orden_de_Trabajo[] = [];
	public varCrear_Reporte: Crear_Reporte[] = [];
	public varSpartan_User: Spartan_User[] = [];
	public varEstatus_de_Seguimiento_de_Materiales: Estatus_de_Seguimiento_de_Materiales[] = [];
	public varSalida_en_Almacen_de_partes: Salida_en_Almacen_de_partes[] = [];
	public varSalida_en_almacen: Salida_en_almacen[] = [];
	public varIngreso_a_almacen: Ingreso_a_almacen[] = [];

  autoNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;
  autoProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;
  autoDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;
  autoCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;
  autoNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;
  autoNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;
  autoSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;
  autoIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;
  autoIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;
  autoIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = new FormControl();
  SelectedIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: string[] = [];
  isLoadingIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas: boolean;
  searchIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourcePartes__materiales_y_herramientas = new MatTableDataSource<Detalle_de_Solicitud_de_partes_materiales_y_herramientas>();
  Partes__materiales_y_herramientasColumns = [
    //{ def: 'actions', hide: false },
    { def: 'No_de_OC', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'Departamento', hide: false },
    { def: 'Categoria', hide: false },
    { def: 'No__de_OT', hide: false },
    { def: 'No__Reporte', hide: false },
    { def: 'No__de_parte__Descripcion', hide: false },
    { def: 'Fecha_de_Vencimiento', hide: false },
    { def: 'Ubicacion_de_Almacen', hide: false },
    { def: 'No__de_Solicitud', hide: false },
    { def: 'Solicitante', hide: false },
    { def: 'Fecha_de_Solicitud', hide: false },
    { def: 'Estatus', hide: false },
    //{ def: 'IdAsignaciondePartes', hide: false },
    //{ def: 'IdSalidaenAlmacen', hide: false },
    //{ def: 'IdIngresoAlmacen', hide: false },
    //{ def: 'IdDetalleGestionAprobacion', hide: false },
    { def: 'Asignar_Parte', hide: false },
    { def: 'Salida', hide: false },
	
  ];
  Partes__materiales_y_herramientasData: Detalle_de_Solicitud_de_partes_materiales_y_herramientas[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Solicitud_de_partes_materiales_y_herramientasService: Solicitud_de_partes_materiales_y_herramientasService,
    private Generacion_de_Orden_de_ComprasService: Generacion_de_Orden_de_ComprasService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private DepartamentoService: DepartamentoService,
    private Categoria_de_PartesService: Categoria_de_PartesService,
    private Estatus_de_Seguimiento_de_MaterialesService: Estatus_de_Seguimiento_de_MaterialesService,
    private Detalle_de_Solicitud_de_partes_materiales_y_herramientasService: Detalle_de_Solicitud_de_partes_materiales_y_herramientasService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Crear_ReporteService: Crear_ReporteService,
    private Spartan_UserService: Spartan_UserService,
    private Salida_en_Almacen_de_partesService: Salida_en_Almacen_de_partesService,
    private Salida_en_almacenService: Salida_en_almacenService,
    private Ingreso_a_almacenService: Ingreso_a_almacenService,


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
    this.model = new Solicitud_de_partes_materiales_y_herramientas(this.fb);
    this.Solicitud_de_partes_materiales_y_herramientasForm = this.model.buildFormGroup();
    this.Partes__materiales_y_herramientasItems.removeAt(0);
	
	this.Solicitud_de_partes_materiales_y_herramientasForm.get('Folio').disable();
    this.Solicitud_de_partes_materiales_y_herramientasForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourcePartes__materiales_y_herramientas.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Partes__materiales_y_herramientasColumns.splice(0, 1);
		
          this.Solicitud_de_partes_materiales_y_herramientasForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_partes_materiales_y_herramientas)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Solicitud_de_partes_materiales_y_herramientasForm, 'No_de_OC', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitud_de_partes_materiales_y_herramientasForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitud_de_partes_materiales_y_herramientasForm, 'Departamento', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitud_de_partes_materiales_y_herramientasForm, 'Categoria', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Solicitud_de_partes_materiales_y_herramientasForm, 'Estatus', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Solicitud_de_partes_materiales_y_herramientasService.listaSelAll(0, 1, 'Solicitud_de_partes_materiales_y_herramientas.Folio=' + id).toPromise();
	if (result.Solicitud_de_partes_materiales_y_herramientass.length > 0) {
        let fPartes__materiales_y_herramientas = await this.Detalle_de_Solicitud_de_partes_materiales_y_herramientasService.listaSelAll(0, 1000,'Solicitud_de_partes_materiales_y_herramientas.Folio=' + id).toPromise();
            this.Partes__materiales_y_herramientasData = fPartes__materiales_y_herramientas.Detalle_de_Solicitud_de_partes_materiales_y_herramientass;
            this.loadPartes__materiales_y_herramientas(fPartes__materiales_y_herramientas.Detalle_de_Solicitud_de_partes_materiales_y_herramientass);
            this.dataSourcePartes__materiales_y_herramientas = new MatTableDataSource(fPartes__materiales_y_herramientas.Detalle_de_Solicitud_de_partes_materiales_y_herramientass);
            this.dataSourcePartes__materiales_y_herramientas.paginator = this.paginator;
            this.dataSourcePartes__materiales_y_herramientas.sort = this.sort;
	  
        this.model.fromObject(result.Solicitud_de_partes_materiales_y_herramientass[0]);
        /*this.Solicitud_de_partes_materiales_y_herramientasForm.get('No_de_OC').setValue(
          result.Solicitud_de_partes_materiales_y_herramientass[0].No_de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitud_de_partes_materiales_y_herramientasForm.get('Proveedor').setValue(
          result.Solicitud_de_partes_materiales_y_herramientass[0].Proveedor_Creacion_de_Proveedores.Razon_social,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitud_de_partes_materiales_y_herramientasForm.get('Departamento').setValue(
          result.Solicitud_de_partes_materiales_y_herramientass[0].Departamento_Departamento.Nombre,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitud_de_partes_materiales_y_herramientasForm.get('Categoria').setValue(
          result.Solicitud_de_partes_materiales_y_herramientass[0].Categoria_Categoria_de_Partes.Categoria,
          { onlySelf: false, emitEvent: true }
        );
        this.Solicitud_de_partes_materiales_y_herramientasForm.get('Estatus').setValue(
          result.Solicitud_de_partes_materiales_y_herramientass[0].Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion,
          { onlySelf: false, emitEvent: true }
        );*/

		this.Solicitud_de_partes_materiales_y_herramientasForm.markAllAsTouched();
		this.Solicitud_de_partes_materiales_y_herramientasForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Partes__materiales_y_herramientasItems() {
    return this.Solicitud_de_partes_materiales_y_herramientasForm.get('Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems') as FormArray;
  }

  getPartes__materiales_y_herramientasColumns(): string[] {
    return this.Partes__materiales_y_herramientasColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPartes__materiales_y_herramientas(Partes__materiales_y_herramientas: Detalle_de_Solicitud_de_partes_materiales_y_herramientas[]) {
    Partes__materiales_y_herramientas.forEach(element => {
      this.addPartes__materiales_y_herramientas(element);
    });
  }

  addPartes__materiales_y_herramientasToMR() {
    const Partes__materiales_y_herramientas = new Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this.fb);
    this.Partes__materiales_y_herramientasData.push(this.addPartes__materiales_y_herramientas(Partes__materiales_y_herramientas));
    this.dataSourcePartes__materiales_y_herramientas.data = this.Partes__materiales_y_herramientasData;
    Partes__materiales_y_herramientas.edit = true;
    Partes__materiales_y_herramientas.isNew = true;
    const length = this.dataSourcePartes__materiales_y_herramientas.data.length;
    const index = length - 1;
    const formPartes__materiales_y_herramientas = this.Partes__materiales_y_herramientasItems.controls[index] as FormGroup;
	this.addFilterToControlNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.No_de_OC, index);
	this.addFilterToControlProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.Proveedor, index);
	this.addFilterToControlDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.Departamento, index);
	this.addFilterToControlCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.Categoria, index);
	this.addFilterToControlNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.No__de_OT, index);
	this.addFilterToControlNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.No__Reporte, index);
	this.addFilterToControlSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.Solicitante, index);
	this.addFilterToControlIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.IdAsignaciondePartes, index);
	this.addFilterToControlIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.IdSalidaenAlmacen, index);
	this.addFilterToControlIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.IdIngresoAlmacen, index);
    
    const page = Math.ceil(this.dataSourcePartes__materiales_y_herramientas.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addPartes__materiales_y_herramientas(entity: Detalle_de_Solicitud_de_partes_materiales_y_herramientas) {
    const Partes__materiales_y_herramientas = new Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this.fb);
    this.Partes__materiales_y_herramientasItems.push(Partes__materiales_y_herramientas.buildFormGroup());
    if (entity) {
      Partes__materiales_y_herramientas.fromObject(entity);
    }
	return entity;
  }  

  Partes__materiales_y_herramientasItemsByFolio(Folio: number): FormGroup {
    return (this.Solicitud_de_partes_materiales_y_herramientasForm.get('Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Partes__materiales_y_herramientasItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
	let fb = this.Partes__materiales_y_herramientasItems.controls[index] as FormGroup;
    return fb;
  }  

  deletePartes__materiales_y_herramientas(element: any) {
    let index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.Partes__materiales_y_herramientasData[index].IsDeleted = true;
    this.dataSourcePartes__materiales_y_herramientas.data = this.Partes__materiales_y_herramientasData;
    this.dataSourcePartes__materiales_y_herramientas._updateChangeSubscription();
    index = this.dataSourcePartes__materiales_y_herramientas.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditPartes__materiales_y_herramientas(element: any) {
    let index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Partes__materiales_y_herramientasData[index].IsDeleted = true;
      this.dataSourcePartes__materiales_y_herramientas.data = this.Partes__materiales_y_herramientasData;
      this.dataSourcePartes__materiales_y_herramientas._updateChangeSubscription();
      index = this.Partes__materiales_y_herramientasData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async savePartes__materiales_y_herramientas(element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    const formPartes__materiales_y_herramientas = this.Partes__materiales_y_herramientasItems.controls[index] as FormGroup;
    if (this.Partes__materiales_y_herramientasData[index].No_de_OC !== formPartes__materiales_y_herramientas.value.No_de_OC && formPartes__materiales_y_herramientas.value.No_de_OC > 0) {
		let generacion_de_orden_de_compras = await this.Generacion_de_Orden_de_ComprasService.getById(formPartes__materiales_y_herramientas.value.No_de_OC).toPromise();
        this.Partes__materiales_y_herramientasData[index].No_de_OC_Generacion_de_Orden_de_Compras = generacion_de_orden_de_compras;
    }
    this.Partes__materiales_y_herramientasData[index].No_de_OC = formPartes__materiales_y_herramientas.value.No_de_OC;
    if (this.Partes__materiales_y_herramientasData[index].Proveedor !== formPartes__materiales_y_herramientas.value.Proveedor && formPartes__materiales_y_herramientas.value.Proveedor > 0) {
		let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formPartes__materiales_y_herramientas.value.Proveedor).toPromise();
        this.Partes__materiales_y_herramientasData[index].Proveedor_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Partes__materiales_y_herramientasData[index].Proveedor = formPartes__materiales_y_herramientas.value.Proveedor;
    if (this.Partes__materiales_y_herramientasData[index].Departamento !== formPartes__materiales_y_herramientas.value.Departamento && formPartes__materiales_y_herramientas.value.Departamento > 0) {
		let departamento = await this.DepartamentoService.getById(formPartes__materiales_y_herramientas.value.Departamento).toPromise();
        this.Partes__materiales_y_herramientasData[index].Departamento_Departamento = departamento;
    }
    this.Partes__materiales_y_herramientasData[index].Departamento = formPartes__materiales_y_herramientas.value.Departamento;
    if (this.Partes__materiales_y_herramientasData[index].Categoria !== formPartes__materiales_y_herramientas.value.Categoria && formPartes__materiales_y_herramientas.value.Categoria > 0) {
		let categoria_de_partes = await this.Categoria_de_PartesService.getById(formPartes__materiales_y_herramientas.value.Categoria).toPromise();
        this.Partes__materiales_y_herramientasData[index].Categoria_Categoria_de_Partes = categoria_de_partes;
    }
    this.Partes__materiales_y_herramientasData[index].Categoria = formPartes__materiales_y_herramientas.value.Categoria;
    if (this.Partes__materiales_y_herramientasData[index].No__de_OT !== formPartes__materiales_y_herramientas.value.No__de_OT && formPartes__materiales_y_herramientas.value.No__de_OT > 0) {
		let orden_de_trabajo = await this.Orden_de_TrabajoService.getById(formPartes__materiales_y_herramientas.value.No__de_OT).toPromise();
        this.Partes__materiales_y_herramientasData[index].No__de_OT_Orden_de_Trabajo = orden_de_trabajo;
    }
    this.Partes__materiales_y_herramientasData[index].No__de_OT = formPartes__materiales_y_herramientas.value.No__de_OT;
    if (this.Partes__materiales_y_herramientasData[index].No__Reporte !== formPartes__materiales_y_herramientas.value.No__Reporte && formPartes__materiales_y_herramientas.value.No__Reporte > 0) {
		let crear_reporte = await this.Crear_ReporteService.getById(formPartes__materiales_y_herramientas.value.No__Reporte).toPromise();
        this.Partes__materiales_y_herramientasData[index].No__Reporte_Crear_Reporte = crear_reporte;
    }
    this.Partes__materiales_y_herramientasData[index].No__Reporte = formPartes__materiales_y_herramientas.value.No__Reporte;
    this.Partes__materiales_y_herramientasData[index].No__de_parte__Descripcion = formPartes__materiales_y_herramientas.value.No__de_parte__Descripcion;
    this.Partes__materiales_y_herramientasData[index].Fecha_de_Vencimiento = formPartes__materiales_y_herramientas.value.Fecha_de_Vencimiento;
    this.Partes__materiales_y_herramientasData[index].Ubicacion_de_Almacen = formPartes__materiales_y_herramientas.value.Ubicacion_de_Almacen;
    this.Partes__materiales_y_herramientasData[index].No__de_Solicitud = formPartes__materiales_y_herramientas.value.No__de_Solicitud;
    if (this.Partes__materiales_y_herramientasData[index].Solicitante !== formPartes__materiales_y_herramientas.value.Solicitante && formPartes__materiales_y_herramientas.value.Solicitante > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formPartes__materiales_y_herramientas.value.Solicitante).toPromise();
        this.Partes__materiales_y_herramientasData[index].Solicitante_Spartan_User = spartan_user;
    }
    this.Partes__materiales_y_herramientasData[index].Solicitante = formPartes__materiales_y_herramientas.value.Solicitante;
    this.Partes__materiales_y_herramientasData[index].Fecha_de_Solicitud = formPartes__materiales_y_herramientas.value.Fecha_de_Solicitud;
    this.Partes__materiales_y_herramientasData[index].Estatus = formPartes__materiales_y_herramientas.value.Estatus;
    this.Partes__materiales_y_herramientasData[index].Estatus_Estatus_de_Seguimiento_de_Materiales = formPartes__materiales_y_herramientas.value.Estatus !== '' ?
     this.varEstatus_de_Seguimiento_de_Materiales.filter(d => d.Folio === formPartes__materiales_y_herramientas.value.Estatus)[0] : null ;	
    if (this.Partes__materiales_y_herramientasData[index].IdAsignaciondePartes !== formPartes__materiales_y_herramientas.value.IdAsignaciondePartes && formPartes__materiales_y_herramientas.value.IdAsignaciondePartes > 0) {
		let salida_en_almacen_de_partes = await this.Salida_en_Almacen_de_partesService.getById(formPartes__materiales_y_herramientas.value.IdAsignaciondePartes).toPromise();
        this.Partes__materiales_y_herramientasData[index].IdAsignaciondePartes_Salida_en_Almacen_de_partes = salida_en_almacen_de_partes;
    }
    this.Partes__materiales_y_herramientasData[index].IdAsignaciondePartes = formPartes__materiales_y_herramientas.value.IdAsignaciondePartes;
    if (this.Partes__materiales_y_herramientasData[index].IdSalidaenAlmacen !== formPartes__materiales_y_herramientas.value.IdSalidaenAlmacen && formPartes__materiales_y_herramientas.value.IdSalidaenAlmacen > 0) {
		let salida_en_almacen = await this.Salida_en_almacenService.getById(formPartes__materiales_y_herramientas.value.IdSalidaenAlmacen).toPromise();
        this.Partes__materiales_y_herramientasData[index].IdSalidaenAlmacen_Salida_en_almacen = salida_en_almacen;
    }
    this.Partes__materiales_y_herramientasData[index].IdSalidaenAlmacen = formPartes__materiales_y_herramientas.value.IdSalidaenAlmacen;
    if (this.Partes__materiales_y_herramientasData[index].IdIngresoAlmacen !== formPartes__materiales_y_herramientas.value.IdIngresoAlmacen && formPartes__materiales_y_herramientas.value.IdIngresoAlmacen > 0) {
		let ingreso_a_almacen = await this.Ingreso_a_almacenService.getById(formPartes__materiales_y_herramientas.value.IdIngresoAlmacen).toPromise();
        this.Partes__materiales_y_herramientasData[index].IdIngresoAlmacen_Ingreso_a_almacen = ingreso_a_almacen;
    }
    this.Partes__materiales_y_herramientasData[index].IdIngresoAlmacen = formPartes__materiales_y_herramientas.value.IdIngresoAlmacen;
    this.Partes__materiales_y_herramientasData[index].IdDetalleGestionAprobacion = formPartes__materiales_y_herramientas.value.IdDetalleGestionAprobacion;
    this.Partes__materiales_y_herramientasData[index].Asignar_Parte = formPartes__materiales_y_herramientas.value.Asignar_Parte;
    this.Partes__materiales_y_herramientasData[index].Salida = formPartes__materiales_y_herramientas.value.Salida;
	
    this.Partes__materiales_y_herramientasData[index].isNew = false;
    this.dataSourcePartes__materiales_y_herramientas.data = this.Partes__materiales_y_herramientasData;
    this.dataSourcePartes__materiales_y_herramientas._updateChangeSubscription();
  }
  
  editPartes__materiales_y_herramientas(element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    const formPartes__materiales_y_herramientas = this.Partes__materiales_y_herramientasItems.controls[index] as FormGroup;
	this.SelectedNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].No_de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC;
    this.addFilterToControlNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.No_de_OC, index);
	this.SelectedProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].Proveedor_Creacion_de_Proveedores.Razon_social;
    this.addFilterToControlProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.Proveedor, index);
	this.SelectedDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].Departamento_Departamento.Nombre;
    this.addFilterToControlDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.Departamento, index);
	this.SelectedCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].Categoria_Categoria_de_Partes.Categoria;
    this.addFilterToControlCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.Categoria, index);
	this.SelectedNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].No__de_OT_Orden_de_Trabajo.numero_de_orden;
    this.addFilterToControlNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.No__de_OT, index);
	this.SelectedNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].No__Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.No__Reporte, index);
	this.SelectedSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].Solicitante_Spartan_User.Name;
    this.addFilterToControlSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.Solicitante, index);
	this.SelectedIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].IdAsignaciondePartes_Salida_en_Almacen_de_partes.IdAsignacionPartes;
    this.addFilterToControlIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.IdAsignaciondePartes, index);
	this.SelectedIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].IdSalidaenAlmacen_Salida_en_almacen.IdSalidaAlmacen;
    this.addFilterToControlIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.IdSalidaenAlmacen, index);
	this.SelectedIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.dataSourcePartes__materiales_y_herramientas.data[index].IdIngresoAlmacen_Ingreso_a_almacen.IdIngresoAlmacen;
    this.addFilterToControlIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(formPartes__materiales_y_herramientas.controls.IdIngresoAlmacen, index);
	    
    element.edit = true;
  }  

  async saveDetalle_de_Solicitud_de_partes_materiales_y_herramientas(Folio: number) {
    this.dataSourcePartes__materiales_y_herramientas.data.forEach(async (d, index) => {
      const data = this.Partes__materiales_y_herramientasItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Solicitud_de_partes_materiales_y_herramientas = Folio;
	
      
      if (model.Folio === 0) {
        // Add Partes, materiales y herramientas
		let response = await this.Detalle_de_Solicitud_de_partes_materiales_y_herramientasService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPartes__materiales_y_herramientas = this.Partes__materiales_y_herramientasItemsByFolio(model.Folio);
        if (formPartes__materiales_y_herramientas.dirty) {
          // Update Partes, materiales y herramientas
          let response = await this.Detalle_de_Solicitud_de_partes_materiales_y_herramientasService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Partes, materiales y herramientas
        await this.Detalle_de_Solicitud_de_partes_materiales_y_herramientasService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.No_de_OC.setValue(event.option.value);
    this.displayFnNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Generacion_de_Orden_de_Compras> {
		const where = filter !== '' ?  "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + filter + "%'" : '';
		return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, where);
	}

  addFilterToControlNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varGeneracion_de_Orden_de_Compras = result.Generacion_de_Orden_de_Comprass;
      this.isLoadingNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varGeneracion_de_Orden_de_Compras.length === 0 ? '' : this.SelectedNo_de_OC_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }
  public selectProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Proveedor.setValue(event.option.value);
    this.displayFnProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Creacion_de_Proveedores> {
		const where = filter !== '' ?  "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
		return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
	}

  addFilterToControlProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varCreacion_de_Proveedores.length === 0 ? '' : this.SelectedProveedor_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }
  public selectDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Departamento.setValue(event.option.value);
    this.displayFnDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Departamento> {
		const where = filter !== '' ?  "Departamento.Nombre like '%" + filter + "%'" : '';
		return this.DepartamentoService.listaSelAll(0, 20, where);
	}

  addFilterToControlDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varDepartamento = result.Departamentos;
      this.isLoadingDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varDepartamento.length === 0 ? '' : this.SelectedDepartamento_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }
  public selectCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Categoria.setValue(event.option.value);
    this.displayFnCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Categoria_de_Partes> {
		const where = filter !== '' ?  "Categoria_de_Partes.Categoria like '%" + filter + "%'" : '';
		return this.Categoria_de_PartesService.listaSelAll(0, 20, where);
	}

  addFilterToControlCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varCategoria_de_Partes = result.Categoria_de_Partess;
      this.isLoadingCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varCategoria_de_Partes.length === 0 ? '' : this.SelectedCategoria_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }
  public selectNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.No__de_OT.setValue(event.option.value);
    this.displayFnNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Orden_de_Trabajo> {
		const where = filter !== '' ?  "Orden_de_Trabajo.numero_de_orden like '%" + filter + "%'" : '';
		return this.Orden_de_TrabajoService.listaSelAll(0, 20, where);
	}

  addFilterToControlNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varOrden_de_Trabajo = result.Orden_de_Trabajos;
      this.isLoadingNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varOrden_de_Trabajo.length === 0 ? '' : this.SelectedNo__de_OT_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }
  public selectNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.No__Reporte.setValue(event.option.value);
    this.displayFnNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Crear_Reporte> {
		const where = filter !== '' ?  "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';
		return this.Crear_ReporteService.listaSelAll(0, 20, where);
	}

  addFilterToControlNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedNo__Reporte_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }
  public selectSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Solicitante.setValue(event.option.value);
    this.displayFnSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedSolicitante_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }
  public selectIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.IdAsignaciondePartes.setValue(event.option.value);
    this.displayFnIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Salida_en_Almacen_de_partes> {
		const where = filter !== '' ?  "Salida_en_Almacen_de_partes.IdAsignacionPartes like '%" + filter + "%'" : '';
		return this.Salida_en_Almacen_de_partesService.listaSelAll(0, 20, where);
	}

  addFilterToControlIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varSalida_en_Almacen_de_partes = result.Salida_en_Almacen_de_partess;
      this.isLoadingIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varSalida_en_Almacen_de_partes.length === 0 ? '' : this.SelectedIdAsignaciondePartes_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }
  public selectIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.IdSalidaenAlmacen.setValue(event.option.value);
    this.displayFnIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Salida_en_almacen> {
		const where = filter !== '' ?  "Salida_en_almacen.IdSalidaAlmacen like '%" + filter + "%'" : '';
		return this.Salida_en_almacenService.listaSelAll(0, 20, where);
	}

  addFilterToControlIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varSalida_en_almacen = result.Salida_en_almacens;
      this.isLoadingIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varSalida_en_almacen.length === 0 ? '' : this.SelectedIdSalidaenAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }
  public selectIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.option.viewValue;
	let fgr = this.Solicitud_de_partes_materiales_y_herramientasForm.controls.Detalle_de_Solicitud_de_partes_materiales_y_herramientasItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.IdIngresoAlmacen.setValue(event.option.value);
    this.displayFnIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(element);
  }  
  
  displayFnIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(this, element) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    return this.SelectedIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
  }
  updateOptionIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(event, element: any) {
    const index = this.dataSourcePartes__materiales_y_herramientas.data.indexOf(element);
    this.SelectedIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = event.source.viewValue;
  } 

	_filterIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(filter: any): Observable<Ingreso_a_almacen> {
		const where = filter !== '' ?  "Ingreso_a_almacen.IdIngresoAlmacen like '%" + filter + "%'" : '';
		return this.Ingreso_a_almacenService.listaSelAll(0, 20, where);
	}

  addFilterToControlIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = true;
        return this._filterIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas(value || '');
      })
    ).subscribe(result => {
      this.varIngreso_a_almacen = result.Ingreso_a_almacens;
      this.isLoadingIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas = false;
      this.searchIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientasCompleted = true;
      this.SelectedIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index] = this.varIngreso_a_almacen.length === 0 ? '' : this.SelectedIdIngresoAlmacen_Detalle_de_Solicitud_de_partes_materiales_y_herramientas[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Solicitud_de_partes_materiales_y_herramientasForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Estatus_de_Seguimiento_de_MaterialesService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varEstatus_de_Seguimiento_de_Materiales  ]) => {
          this.varEstatus_de_Seguimiento_de_Materiales = varEstatus_de_Seguimiento_de_Materiales;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Solicitud_de_partes_materiales_y_herramientasForm.get('No_de_OC').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo_de_OC = true),
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
      this.isLoadingNo_de_OC = false;
      this.hasOptionsNo_de_OC = result?.Generacion_de_Orden_de_Comprass?.length > 0;
	  //this.Solicitud_de_partes_materiales_y_herramientasForm.get('No_de_OC').setValue(result?.Generacion_de_Orden_de_Comprass[0], { onlySelf: true, emitEvent: false });
	  this.optionsNo_de_OC = of(result?.Generacion_de_Orden_de_Comprass);
    }, error => {
      this.isLoadingNo_de_OC = false;
      this.hasOptionsNo_de_OC = false;
      this.optionsNo_de_OC = of([]);
    });
    this.Solicitud_de_partes_materiales_y_herramientasForm.get('Proveedor').valueChanges.pipe(
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
	  //this.Solicitud_de_partes_materiales_y_herramientasForm.get('Proveedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
	  this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });
    this.Solicitud_de_partes_materiales_y_herramientasForm.get('Departamento').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingDepartamento = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.DepartamentoService.listaSelAll(0, 20, ' Nombre IS NOT NULL ', ' Nombre ASC ');
        if (typeof value === 'string') {
          if (value === '') return this.DepartamentoService.listaSelAll(0, 20, ' Nombre IS NOT NULL ', ' Nombre ASC ');
          return this.DepartamentoService.listaSelAll(0, 20,
            "Departamento.Nombre like '%" + value.trimLeft().trimRight() + "%'", ' Nombre ASC ');
        }
        return this.DepartamentoService.listaSelAll(0, 20,
          "Departamento.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'", ' Nombre ASC ');
      })
    ).subscribe(result => {
      this.isLoadingDepartamento = false;
      this.hasOptionsDepartamento = result?.Departamentos?.length > 0;
	  //this.Solicitud_de_partes_materiales_y_herramientasForm.get('Departamento').setValue(result?.Departamentos[0], { onlySelf: true, emitEvent: false });
	  this.optionsDepartamento = of(result?.Departamentos);
    }, error => {
      this.isLoadingDepartamento = false;
      this.hasOptionsDepartamento = false;
      this.optionsDepartamento = of([]);
    });
    this.Solicitud_de_partes_materiales_y_herramientasForm.get('Categoria').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCategoria = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Categoria_de_PartesService.listaSelAll(0, 20, ' Categoria IS NOT NULL ', ' Categoria ASC ');
        if (typeof value === 'string') {
          if (value === '') return this.Categoria_de_PartesService.listaSelAll(0, 20, ' Categoria IS NOT NULL ', ' Categoria ASC ');
          return this.Categoria_de_PartesService.listaSelAll(0, 20,
            "Categoria_de_Partes.Categoria like '%" + value.trimLeft().trimRight() + "%'", ' Categoria ASC ');
        }
        return this.Categoria_de_PartesService.listaSelAll(0, 20,
          "Categoria_de_Partes.Categoria like '%" + value.Categoria.trimLeft().trimRight() + "%'", ' Categoria ASC ');
      })
    ).subscribe(result => {
      this.isLoadingCategoria = false;
      this.hasOptionsCategoria = result?.Categoria_de_Partess?.length > 0;
	  //this.Solicitud_de_partes_materiales_y_herramientasForm.get('Categoria').setValue(result?.Categoria_de_Partess[0], { onlySelf: true, emitEvent: false });
	  this.optionsCategoria = of(result?.Categoria_de_Partess);
    }, error => {
      this.isLoadingCategoria = false;
      this.hasOptionsCategoria = false;
      this.optionsCategoria = of([]);
    });
    this.Solicitud_de_partes_materiales_y_herramientasForm.get('Estatus').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEstatus = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(0, 20, ' Descripcion IS NOT NULL ', ' Descripcion ASC ');
        if (typeof value === 'string') {
          if (value === '') return this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(0, 20, ' Descripcion IS NOT NULL ', ' Descripcion ASC ');
          return this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(0, 20,
            "Estatus_de_Seguimiento_de_Materiales.Descripcion like '%" + value.trimLeft().trimRight() + "%'", ' Descripcion ASC ');
        }
        return this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(0, 20,
          "Estatus_de_Seguimiento_de_Materiales.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'", ' Descripcion ASC ');
      })
    ).subscribe(result => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = result?.Estatus_de_Seguimiento_de_Materialess?.length > 0;
	  //this.Solicitud_de_partes_materiales_y_herramientasForm.get('Estatus').setValue(result?.Estatus_de_Seguimiento_de_Materialess[0], { onlySelf: true, emitEvent: false });
	  this.optionsEstatus = of(result?.Estatus_de_Seguimiento_de_Materialess);
    }, error => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = false;
      this.optionsEstatus = of([]);
    });


  }

  // Funcion Consultar agregado
  SearchConsult() {
    
    let Query = "EXEC spListadoSolicitudParteMaterialesHerramientas '";

    //obtenemos todos los datos para la consulta del Query
    let NoOC = this.Solicitud_de_partes_materiales_y_herramientasForm.get('No_de_OC').value.Folio;
    let Proveedor = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Proveedor').value.Clave;
    let Departamento = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Departamento').value.Folio;
    let Categoria = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Categoria').value.Folio;
    let estatus = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Estatus').value.Folio;
    let NodeParteDescripcion = this.Solicitud_de_partes_materiales_y_herramientasForm.get('No__de_Parte___Descripcion').value;
    let FechaDeVencimiento = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Fecha_de_Vencimiento').value;
    let UbicacionAlmacen = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Ubicacion_almacen').value;

    if(NoOC != undefined){
      Query += "AND No_de_OCId = ''" + NoOC + "'' ";
    }
    if(Proveedor != undefined){
      Query += "AND Proveedor = ''" + Proveedor + "'' ";
    }
    if(Departamento != undefined){
      Query += "AND Departamento = ''" + Departamento + "'' ";
    }
    if(Categoria != undefined){
      Query += "AND Categoria = ''" + Categoria + "'' ";
    }
    if(estatus != undefined){
      Query += "AND estatusId = ''" + estatus + "'' ";
    }
    if(NodeParteDescripcion != undefined && NodeParteDescripcion.length > 0){
      Query += "AND No__de_parte__Descripcion LIKE ''%" + NodeParteDescripcion + "%'' ";
    }
    if(UbicacionAlmacen != undefined && UbicacionAlmacen.length > 0){
      Query += "AND Ubicacion_de_Almacen LIKE ''%" + UbicacionAlmacen + "%'' ";
    }
    if(FechaDeVencimiento != '' && FechaDeVencimiento != null){
      let fecha = FechaDeVencimiento.toISOString().split('T')[0];
      let anio = fecha.split('-')[0];
      let mes = fecha.split('-')[1];
      let dia = fecha.split('-')[2];
      let fechaCompuesta = dia + "-" + mes + "-" + anio;

      Query += "AND Fecha_de_Vencimiento = ''" + fechaCompuesta + "'' ";
    }

    Query += "'"
	  
    this.dataSourcePartes__materiales_y_herramientas = new MatTableDataSource<Detalle_de_Solicitud_de_partes_materiales_y_herramientas>();
    this.dataSourcePartes__materiales_y_herramientas.paginator = this.paginator;
    this.dataSourcePartes__materiales_y_herramientas.sort = this.sort;

    this.brf.FillMultiRenglonfromQuery(this.dataSourcePartes__materiales_y_herramientas ,Query, 1, "ABC123");
  }

  //Open Salida Almacen
  OpenExitAlmacen(element: any){
    let url = this.router.serializeUrl(this.router.createUrlTree([`#/Salida_en_Almacen_de_partes/edit/${element.No_de_OC}`]));
    window.open(decodeURIComponent(url), "_blank", "width=800, height=600, top=200, left=500");
  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Estatus': {
        this.Estatus_de_Seguimiento_de_MaterialesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Seguimiento_de_Materiales = x.Estatus_de_Seguimiento_de_Materialess;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

displayFnNo_de_OC(option: Generacion_de_Orden_de_Compras) {
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
      const entity = this.Solicitud_de_partes_materiales_y_herramientasForm.value;
      entity.Folio = this.model.Folio;
      entity.No_de_OC = this.Solicitud_de_partes_materiales_y_herramientasForm.get('No_de_OC').value.Folio;
      entity.Proveedor = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Proveedor').value.Clave;
      entity.Departamento = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Departamento').value.Folio;
      entity.Categoria = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Categoria').value.Folio;
      entity.Estatus = this.Solicitud_de_partes_materiales_y_herramientasForm.get('Estatus').value.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Solicitud_de_partes_materiales_y_herramientasService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Solicitud_de_partes_materiales_y_herramientas(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Solicitud_de_partes_materiales_y_herramientasService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Solicitud_de_partes_materiales_y_herramientas(id);

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
      this.Solicitud_de_partes_materiales_y_herramientasForm.reset();
      this.model = new Solicitud_de_partes_materiales_y_herramientas(this.fb);
      this.Solicitud_de_partes_materiales_y_herramientasForm = this.model.buildFormGroup();
      this.dataSourcePartes__materiales_y_herramientas = new MatTableDataSource<Detalle_de_Solicitud_de_partes_materiales_y_herramientas>();
      this.Partes__materiales_y_herramientasData = [];

    } else {
      this.router.navigate(['views/Solicitud_de_partes_materiales_y_herramientas/add']);
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
    this.router.navigate(['/Solicitud_de_partes_materiales_y_herramientas/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      No_de_OC_ExecuteBusinessRules(): void {
        //No_de_OC_FieldExecuteBusinessRulesEnd
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
    No__de_Parte___Descripcion_ExecuteBusinessRules(): void {
        //No__de_Parte___Descripcion_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Vencimiento_ExecuteBusinessRules(): void {
        //Fecha_de_Vencimiento_FieldExecuteBusinessRulesEnd
    }
    Ubicacion_almacen_ExecuteBusinessRules(): void {
        //Ubicacion_almacen_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4140 - Solicitud_de_partes_materiales_y_herramientas tamaño campos - Autor: Lizeth Villa - Actualización: 8/2/2021 9:42:47 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4140


//INICIA - BRID:4554 - Ocultar y asignar no requeridos siempre - Autor: Lizeth Villa - Actualización: 8/2/2021 9:37:36 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.HideFieldOfForm(this.Solicitud_de_partes_materiales_y_herramientasForm, "Folio"); 
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Folio"); 
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Folio");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "No__de_Parte___Descripcion");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Fecha_de_Vencimiento");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Ubicacion_almacen");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "No_de_OC");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Proveedor");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Departamento");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Categoria");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Fecha_de_Vencimiento");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Ubicacion_de_Almacen");
  this.brf.SetNotRequiredControl(this.Solicitud_de_partes_materiales_y_herramientasForm, "Estatus");
} 
//TERMINA - BRID:4554

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
