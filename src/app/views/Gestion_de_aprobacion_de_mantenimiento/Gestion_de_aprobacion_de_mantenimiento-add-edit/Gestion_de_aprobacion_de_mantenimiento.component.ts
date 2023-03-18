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
import { GeneralService } from 'src/app/api-services/general.service';
import { Gestion_de_aprobacion_de_mantenimientoService } from 'src/app/api-services/Gestion_de_aprobacion_de_mantenimiento.service';
import { Gestion_de_aprobacion_de_mantenimiento } from 'src/app/models/Gestion_de_aprobacion_de_mantenimiento';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Departamento } from 'src/app/models/Departamento';
import { Detalle_Solicitud_de_PiezasService } from 'src/app/api-services/Detalle_Solicitud_de_Piezas.service';
import { Detalle_Solicitud_de_Piezas } from 'src/app/models/Detalle_Solicitud_de_Piezas';
import { PartesService } from 'src/app/api-services/Partes.service';
import { Partes } from 'src/app/models/Partes';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { UrgenciaService } from 'src/app/api-services/Urgencia.service';
import { Urgencia } from 'src/app/models/Urgencia';
import { Existencia_solicitud_crear_reporteService } from 'src/app/api-services/Existencia_solicitud_crear_reporte.service';
import { Existencia_solicitud_crear_reporte } from 'src/app/models/Existencia_solicitud_crear_reporte';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';

import { Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionService } from 'src/app/api-services/Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion.service';
import { Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion } from 'src/app/models/Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion';
import { Catalogo_serviciosService } from 'src/app/api-services/Catalogo_servicios.service';
import { Catalogo_servicios } from 'src/app/models/Catalogo_servicios';

import { Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionService } from 'src/app/api-services/Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion.service';
import { Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion } from 'src/app/models/Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion';
import { Listado_de_MaterialesService } from 'src/app/api-services/Listado_de_Materiales.service';
import { Listado_de_Materiales } from 'src/app/models/Listado_de_Materiales';

import { Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionService } from 'src/app/api-services/Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion.service';
import { Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion } from 'src/app/models/Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion';
import { HerramientasService } from 'src/app/api-services/Herramientas.service';
import { Herramientas } from 'src/app/models/Herramientas';

import { Estatus_Gestion_AprobacionService } from 'src/app/api-services/Estatus_Gestion_Aprobacion.service';
import { Estatus_Gestion_Aprobacion } from 'src/app/models/Estatus_Gestion_Aprobacion';

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
  selector: 'app-Gestion_de_aprobacion_de_mantenimiento',
  templateUrl: './Gestion_de_aprobacion_de_mantenimiento.component.html',
  styleUrls: ['./Gestion_de_aprobacion_de_mantenimiento.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Gestion_de_aprobacion_de_mantenimientoComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Gestion_de_aprobacion_de_mantenimientoForm: FormGroup;
  public Editor = ClassicEditor;
  model: Gestion_de_aprobacion_de_mantenimiento;
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
  optionsSolicitante: Observable<Spartan_User[]>;
  hasOptionsSolicitante: boolean;
  isLoadingSolicitante: boolean;
  optionsDepartamento: Observable<Departamento[]>;
  hasOptionsDepartamento: boolean;
  isLoadingDepartamento: boolean;
  public varPartes: Partes[] = [];
  public varOrden_de_Trabajo: Orden_de_Trabajo[] = [];
  public varAeronave: Aeronave[] = [];
  public varModelos: Modelos[] = [];
  public varUnidad: Unidad[] = [];
  public varUrgencia: Urgencia[] = [];
  public varCrear_Reporte: Crear_Reporte[] = [];
  public varExistencia_solicitud_crear_reporte: Existencia_solicitud_crear_reporte[] = [];
  public varEstatus_de_Seguimiento: Estatus_de_Seguimiento[] = [];

  autoN_Parte_Descripcion_Detalle_Solicitud_de_Piezas = new FormControl();
  SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Piezas: string[] = [];
  isLoadingN_Parte_Descripcion_Detalle_Solicitud_de_Piezas: boolean;
  searchN_Parte_Descripcion_Detalle_Solicitud_de_PiezasCompleted: boolean;
  autoN_de_OT_Detalle_Solicitud_de_Piezas = new FormControl();
  SelectedN_de_OT_Detalle_Solicitud_de_Piezas: string[] = [];
  isLoadingN_de_OT_Detalle_Solicitud_de_Piezas: boolean;
  searchN_de_OT_Detalle_Solicitud_de_PiezasCompleted: boolean;
  autoMatricula_Detalle_Solicitud_de_Piezas = new FormControl();
  SelectedMatricula_Detalle_Solicitud_de_Piezas: string[] = [];
  isLoadingMatricula_Detalle_Solicitud_de_Piezas: boolean;
  searchMatricula_Detalle_Solicitud_de_PiezasCompleted: boolean;
  autoModelo_Detalle_Solicitud_de_Piezas = new FormControl();
  SelectedModelo_Detalle_Solicitud_de_Piezas: string[] = [];
  isLoadingModelo_Detalle_Solicitud_de_Piezas: boolean;
  searchModelo_Detalle_Solicitud_de_PiezasCompleted: boolean;
  autoUnidad_Detalle_Solicitud_de_Piezas = new FormControl();
  SelectedUnidad_Detalle_Solicitud_de_Piezas: string[] = [];
  isLoadingUnidad_Detalle_Solicitud_de_Piezas: boolean;
  searchUnidad_Detalle_Solicitud_de_PiezasCompleted: boolean;
  autoN_Reporte_Detalle_Solicitud_de_Piezas = new FormControl();
  SelectedN_Reporte_Detalle_Solicitud_de_Piezas: string[] = [];
  isLoadingN_Reporte_Detalle_Solicitud_de_Piezas: boolean;
  searchN_Reporte_Detalle_Solicitud_de_PiezasCompleted: boolean;

  public varCatalogo_servicios: Catalogo_servicios[] = [];

  autoN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = new FormControl();
  SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: string[] = [];
  isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: boolean;
  searchN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted: boolean;
  autoN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = new FormControl();
  SelectedN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: string[] = [];
  isLoadingN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: boolean;
  searchN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted: boolean;
  autoMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = new FormControl();
  SelectedMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: string[] = [];
  isLoadingMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: boolean;
  searchMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted: boolean;
  autoModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = new FormControl();
  SelectedModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: string[] = [];
  isLoadingModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: boolean;
  searchModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted: boolean;
  autoUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = new FormControl();
  SelectedUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: string[] = [];
  isLoadingUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: boolean;
  searchUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted: boolean;
  autoN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = new FormControl();
  SelectedN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: string[] = [];
  isLoadingN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion: boolean;
  searchN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted: boolean;

  public varListado_de_Materiales: Listado_de_Materiales[] = [];

  autoCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = new FormControl();
  SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: string[] = [];
  isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: boolean;
  searchCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted: boolean;
  autoN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = new FormControl();
  SelectedN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: string[] = [];
  isLoadingN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: boolean;
  searchN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted: boolean;
  autoN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = new FormControl();
  SelectedN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: string[] = [];
  isLoadingN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: boolean;
  searchN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted: boolean;
  autoMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = new FormControl();
  SelectedMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: string[] = [];
  isLoadingMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: boolean;
  searchMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted: boolean;
  autoModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = new FormControl();
  SelectedModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: string[] = [];
  isLoadingModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: boolean;
  searchModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted: boolean;
  autoUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = new FormControl();
  SelectedUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: string[] = [];
  isLoadingUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion: boolean;
  searchUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted: boolean;

  public varHerramientas: Herramientas[] = [];

  autoCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = new FormControl();
  SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: string[] = [];
  isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: boolean;
  searchCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted: boolean;
  autoN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = new FormControl();
  SelectedN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: string[] = [];
  isLoadingN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: boolean;
  searchN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted: boolean;
  autoN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = new FormControl();
  SelectedN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: string[] = [];
  isLoadingN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: boolean;
  searchN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted: boolean;
  autoMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = new FormControl();
  SelectedMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: string[] = [];
  isLoadingMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: boolean;
  searchMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted: boolean;
  autoModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = new FormControl();
  SelectedModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: string[] = [];
  isLoadingModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: boolean;
  searchModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted: boolean;
  autoUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = new FormControl();
  SelectedUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: string[] = [];
  isLoadingUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion: boolean;
  searchUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted: boolean;

  public varEstatus_Gestion_Aprobacion: Estatus_Gestion_Aprobacion[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatPaginator) paginatorPartes: MatPaginator;
  @ViewChild(MatPaginator) paginatorServicios: MatPaginator;
  @ViewChild(MatPaginator) paginatorMateriales: MatPaginator;
  @ViewChild(MatPaginator) paginatorHerramientas: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  dataSourceSolicitud_de_Piezas = new MatTableDataSource<Detalle_Solicitud_de_Piezas>();
  Solicitud_de_PiezasColumns = [
    { def: 'N_Parte_Descripcion', hide: false },
    { def: 'N_de_OT', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Horas_del_Componente_a_Remover', hide: false },
    { def: 'Ciclos_del_componente_a_Remover', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Razon_de_Solicitud', hide: false },
    { def: 'Condicion_de_la_Parte', hide: false },
    { def: 'N_Reporte', hide: false },
    { def: 'Existencia_Almacen', hide: false },
    { def: 'Aprobacion_de_mantenimiento', hide: false },

  ];
  Solicitud_de_PiezasData: Detalle_Solicitud_de_Piezas[] = [];

  dataSourceSolicitud_de_Servicios = new MatTableDataSource<Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion>();
  Solicitud_de_ServiciosColumns = [
    { def: 'N_Servicio_Descripcion', hide: false },
    { def: 'N_de_OT', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Fecha_Estimada_del_Mtto_', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'N_Reporte', hide: false },
    { def: 'Razon_de_Solicitud', hide: false },
    { def: 'Existencia_Almacen', hide: false },
    { def: 'Aprobacion_de_mantenimiento', hide: false },

  ];
  Solicitud_de_ServiciosData: Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[] = [];

  dataSourceSolicitud_de_Materiales = new MatTableDataSource<Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion>();
  Solicitud_de_MaterialesColumns = [
    { def: 'Codigo_Descripcion', hide: false },
    { def: 'N_de_Reporte', hide: false },
    { def: 'N_de_OT', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Razon_de_Solicitud', hide: false },
    { def: 'Existencia_Almacen', hide: false },
    { def: 'Aprobacion_de_mantenimiento', hide: false },

  ];
  Solicitud_de_MaterialesData: Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[] = [];

  dataSourceSolicitud_de_Herramientas = new MatTableDataSource<Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion>();
  Solicitud_de_HerramientasColumns = [
    { def: 'Codigo_Descripcion', hide: false },
    { def: 'N_de_Reporte', hide: false },
    { def: 'N_de_OT', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Razon_de_Solicitud', hide: false },
    { def: 'Existencia_Almacen', hide: false },
    { def: 'Aprobacion_de_mantenimiento', hide: false },

  ];
  Solicitud_de_HerramientasData: Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[] = [];

  today = new Date;
  consult: boolean = false;
  phase: any;

  MatriculaSeleccion: any = null;
  ModeloSeleccion: any = null;
  N_ReporteSeleccion: any = null;
  SolicitanteSeleccion: any = null;
  DepartamentoSeleccion: any = null;
  RoleId: any
  UserId: any

  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Gestion_de_aprobacion_de_mantenimientoService: Gestion_de_aprobacion_de_mantenimientoService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Crear_ReporteService: Crear_ReporteService,
    private Spartan_UserService: Spartan_UserService,
    private DepartamentoService: DepartamentoService,
    private Detalle_Solicitud_de_PiezasService: Detalle_Solicitud_de_PiezasService,
    private PartesService: PartesService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private UnidadService: UnidadService,
    private UrgenciaService: UrgenciaService,
    private Existencia_solicitud_crear_reporteService: Existencia_solicitud_crear_reporteService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,

    private Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionService: Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionService,
    private Catalogo_serviciosService: Catalogo_serviciosService,

    private Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionService: Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionService,
    private Listado_de_MaterialesService: Listado_de_MaterialesService,

    private Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionService: Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionService,
    private HerramientasService: HerramientasService,

    private Estatus_Gestion_AprobacionService: Estatus_Gestion_AprobacionService,

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

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.model = new Gestion_de_aprobacion_de_mantenimiento(this.fb);
    this.Gestion_de_aprobacion_de_mantenimientoForm = this.model.buildFormGroup();
    this.Solicitud_de_PiezasItems.removeAt(0);
    this.Solicitud_de_ServiciosItems.removeAt(0);
    this.Solicitud_de_MaterialesItems.removeAt(0);
    this.Solicitud_de_HerramientasItems.removeAt(0);

    this.Gestion_de_aprobacion_de_mantenimientoForm.get('Folio').disable();
    this.Gestion_de_aprobacion_de_mantenimientoForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceSolicitud_de_Piezas.paginator = this.paginatorPartes;
    this.dataSourceSolicitud_de_Servicios.paginator = this.paginatorServicios;
    this.dataSourceSolicitud_de_Materiales.paginator = this.paginatorMateriales;
    this.dataSourceSolicitud_de_Herramientas.paginator = this.paginatorHerramientas;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {

    this.phase = this.localStorageHelper.getItemFromLocalStorage("QueryParamGA");

    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Solicitud_de_PiezasColumns.splice(0, 1);
        this.Solicitud_de_ServiciosColumns.splice(0, 1);
        this.Solicitud_de_MaterialesColumns.splice(0, 1);
        this.Solicitud_de_HerramientasColumns.splice(0, 1);

        this.Gestion_de_aprobacion_de_mantenimientoForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Gestion_de_aprobacion_de_mantenimiento).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'N_Reporte', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Solicitante', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Departamento', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Gestion_de_aprobacion_de_mantenimientoService.listaSelAll(0, 1, 'Gestion_de_aprobacion_de_mantenimiento.Folio=' + id).toPromise();
    if (result.Gestion_de_aprobacion_de_mantenimientos.length > 0) {

      await this.Detalle_Solicitud_de_PiezasService.listaSelAll(0, 1000, 'Gestion_de_aprobacion_de_mantenimiento.Folio=' + id).toPromise().then((fSolicitud_de_Piezas: any) => {

        if (this.phase == 1 || this.phase == 2) {
          fSolicitud_de_Piezas.Detalle_Solicitud_de_Piezass.forEach(x => {
            x.Aprobacion_de_mantenimiento = 3;
            x.Aprobacion_de_mantenimiento_Estatus_de_Seguimiento.Folio = 3;
            x.Aprobacion_de_mantenimiento_Estatus_de_Seguimiento.Descripcion = "Por aprobar mtto.";
          });
        }

        this.Solicitud_de_PiezasData = fSolicitud_de_Piezas.Detalle_Solicitud_de_Piezass;
        this.loadSolicitud_de_Piezas(fSolicitud_de_Piezas.Detalle_Solicitud_de_Piezass);
        this.dataSourceSolicitud_de_Piezas = new MatTableDataSource(fSolicitud_de_Piezas.Detalle_Solicitud_de_Piezass);
        this.dataSourceSolicitud_de_Piezas.paginator = this.paginatorPartes;
        this.dataSourceSolicitud_de_Piezas.sort = this.sort;
      });


      await this.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionService.listaSelAll(0, 1000, 'Gestion_de_aprobacion_de_mantenimiento.Folio=' + id).toPromise().then((fSolicitud_de_Servicios: any) => {

        if (this.phase == 1 || this.phase == 2) {
          fSolicitud_de_Servicios.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacions.forEach(x => {
            x.Aprobacion_de_mantenimiento = 3;
            x.Aprobacion_de_mantenimiento_Estatus_de_Seguimiento.Folio = 3;
            x.Aprobacion_de_mantenimiento_Estatus_de_Seguimiento.Descripcion = "Por aprobar mtto.";
          });
        }

        this.Solicitud_de_ServiciosData = fSolicitud_de_Servicios.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacions;
        this.loadSolicitud_de_Servicios(fSolicitud_de_Servicios.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacions);
        this.dataSourceSolicitud_de_Servicios = new MatTableDataSource(fSolicitud_de_Servicios.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacions);
        this.dataSourceSolicitud_de_Servicios.paginator = this.paginatorServicios;
        this.dataSourceSolicitud_de_Servicios.sort = this.sort;
      })


      await this.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionService.listaSelAll(0, 1000, 'Gestion_de_aprobacion_de_mantenimiento.Folio=' + id).toPromise().then((fSolicitud_de_Materiales: any) => {

        if (this.phase == 1 || this.phase == 2) {
          fSolicitud_de_Materiales.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacions.forEach(x => {
            x.Aprobacion_de_mantenimiento = 3;
            x.Aprobacion_de_mantenimiento_Estatus_de_Seguimiento.Folio = 3;
            x.Aprobacion_de_mantenimiento_Estatus_de_Seguimiento.Descripcion = "Por aprobar mtto.";
          });
        }

        this.Solicitud_de_MaterialesData = fSolicitud_de_Materiales.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacions;
        this.loadSolicitud_de_Materiales(fSolicitud_de_Materiales.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacions);
        this.dataSourceSolicitud_de_Materiales = new MatTableDataSource(fSolicitud_de_Materiales.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacions);
        this.dataSourceSolicitud_de_Materiales.paginator = this.paginatorMateriales;
        this.dataSourceSolicitud_de_Materiales.sort = this.sort;
      });


      await this.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionService.listaSelAll(0, 1000, 'Gestion_de_aprobacion_de_mantenimiento.Folio=' + id).toPromise().then((fSolicitud_de_Herramientas: any) => {

        if (this.phase == 1 || this.phase == 2) {
          fSolicitud_de_Herramientas.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacions.forEach(x => {
            x.Aprobacion_de_mantenimiento = 3;
            x.Aprobacion_de_mantenimiento_Estatus_de_Seguimiento.Folio = 3;
            x.Aprobacion_de_mantenimiento_Estatus_de_Seguimiento.Descripcion = "Por aprobar mtto.";
          });
        }

        this.Solicitud_de_HerramientasData = fSolicitud_de_Herramientas.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacions;
        this.loadSolicitud_de_Herramientas(fSolicitud_de_Herramientas.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacions);
        this.dataSourceSolicitud_de_Herramientas = new MatTableDataSource(fSolicitud_de_Herramientas.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacions);
        this.dataSourceSolicitud_de_Herramientas.paginator = this.paginatorHerramientas;
        this.dataSourceSolicitud_de_Herramientas.sort = this.sort;
      });


      this.model.fromObject(result.Gestion_de_aprobacion_de_mantenimientos[0]);

      this.Gestion_de_aprobacion_de_mantenimientoForm.get('Matricula').setValue(
        result.Gestion_de_aprobacion_de_mantenimientos[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.Gestion_de_aprobacion_de_mantenimientoForm.get('Modelo').setValue(
        result.Gestion_de_aprobacion_de_mantenimientos[0].Modelo_Modelos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Gestion_de_aprobacion_de_mantenimientoForm.get('N_Reporte').setValue(
        this.operation == "Update" || this.operation == "Consult" ? result.Gestion_de_aprobacion_de_mantenimientos[0].N_Reporte_Crear_Reporte.Folio : result.Gestion_de_aprobacion_de_mantenimientos[0].N_Reporte_Crear_Reporte.No_Reporte,
        { onlySelf: false, emitEvent: true }
      );
      this.Gestion_de_aprobacion_de_mantenimientoForm.get('Solicitante').setValue(
        result.Gestion_de_aprobacion_de_mantenimientos[0].Solicitante_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );
      this.Gestion_de_aprobacion_de_mantenimientoForm.get('Departamento').setValue(
        result.Gestion_de_aprobacion_de_mantenimientos[0].Departamento_Departamento.Nombre,
        { onlySelf: false, emitEvent: true }
      );

      this.Gestion_de_aprobacion_de_mantenimientoForm.markAllAsTouched();
      this.Gestion_de_aprobacion_de_mantenimientoForm.updateValueAndValidity();
      this.spinner.hide('loading');
    }
    else {
      this.spinner.hide('loading');
    }
  }

  //#region Solicitud de Piezas

  get Solicitud_de_PiezasItems() {
    return this.Gestion_de_aprobacion_de_mantenimientoForm.get('Detalle_Solicitud_de_PiezasItems') as FormArray;
  }

  getSolicitud_de_PiezasColumns(): string[] {
    return this.Solicitud_de_PiezasColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSolicitud_de_Piezas(Solicitud_de_Piezas: Detalle_Solicitud_de_Piezas[]) {
    Solicitud_de_Piezas.forEach(element => {
      this.addSolicitud_de_Piezas(element);
    });
  }

  addSolicitud_de_PiezasToMR() {
    const Solicitud_de_Piezas = new Detalle_Solicitud_de_Piezas(this.fb);
    this.Solicitud_de_PiezasData.push(this.addSolicitud_de_Piezas(Solicitud_de_Piezas));
    this.dataSourceSolicitud_de_Piezas.data = this.Solicitud_de_PiezasData;
    Solicitud_de_Piezas.edit = true;
    Solicitud_de_Piezas.isNew = true;
    const length = this.dataSourceSolicitud_de_Piezas.data.length;
    const index = length - 1;
    const formSolicitud_de_Piezas = this.Solicitud_de_PiezasItems.controls[index] as FormGroup;
    this.addFilterToControlN_Parte_Descripcion_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.N_Parte_Descripcion, index);
    this.addFilterToControlN_de_OT_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.N_de_OT, index);
    this.addFilterToControlMatricula_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.Matricula, index);
    this.addFilterToControlModelo_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.Modelo, index);
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.Unidad, index);
    this.addFilterToControlN_Reporte_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.N_Reporte, index);

    const page = Math.ceil(this.dataSourceSolicitud_de_Piezas.data.filter(d => !d.IsDeleted).length / this.paginatorPartes.pageSize);
    if (page !== this.paginatorPartes.pageIndex) {
      this.paginatorPartes.pageIndex = page;
    }
  }

  addSolicitud_de_Piezas(entity: Detalle_Solicitud_de_Piezas) {
    const Solicitud_de_Piezas = new Detalle_Solicitud_de_Piezas(this.fb);
    this.Solicitud_de_PiezasItems.push(Solicitud_de_Piezas.buildFormGroup());
    if (entity) {
      Solicitud_de_Piezas.fromObject(entity);
    }
    return entity;
  }

  Solicitud_de_PiezasItemsByFolio(Folio: number): FormGroup {
    return (this.Gestion_de_aprobacion_de_mantenimientoForm.get('Detalle_Solicitud_de_PiezasItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Solicitud_de_PiezasItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    let fb = this.Solicitud_de_PiezasItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSolicitud_de_Piezas(element: any) {
    let index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    this.Solicitud_de_PiezasData[index].IsDeleted = true;
    this.dataSourceSolicitud_de_Piezas.data = this.Solicitud_de_PiezasData;
    this.dataSourceSolicitud_de_Piezas.data.splice(index, 1);
    this.dataSourceSolicitud_de_Piezas._updateChangeSubscription();
    index = this.dataSourceSolicitud_de_Piezas.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorPartes.pageSize);
    if (page !== this.paginatorPartes.pageIndex) {
      this.paginatorPartes.pageIndex = page;
    }
  }

  cancelEditSolicitud_de_Piezas(element: any) {
    let index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Solicitud_de_PiezasData[index].IsDeleted = true;
      this.dataSourceSolicitud_de_Piezas.data = this.Solicitud_de_PiezasData;
      this.dataSourceSolicitud_de_Piezas.data.splice(index, 1);
      this.dataSourceSolicitud_de_Piezas._updateChangeSubscription();
      index = this.Solicitud_de_PiezasData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginatorPartes.pageSize);
      if (page !== this.paginatorPartes.pageIndex) {
        this.paginatorPartes.pageIndex = page;
      }
    }
  }

  async saveSolicitud_de_Piezas(element: any) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    const formSolicitud_de_Piezas = this.Solicitud_de_PiezasItems.controls[index] as FormGroup;
    if (this.Solicitud_de_PiezasData[index].N_Parte_Descripcion !== element.N_Parte_Descripcion && element.N_Parte_Descripcion > 0) {
      let partes = await this.PartesService.getById(element.N_Parte_Descripcion).toPromise();
      this.Solicitud_de_PiezasData[index].N_Parte_Descripcion_Partes = partes;
    }
    this.Solicitud_de_PiezasData[index].N_Parte_Descripcion = element.N_Parte_Descripcion;
    if (this.Solicitud_de_PiezasData[index].N_de_OT !== element.N_de_OT && element.N_de_OT > 0) {
      let orden_de_trabajo = await this.Orden_de_TrabajoService.getById(element.N_de_OT).toPromise();
      this.Solicitud_de_PiezasData[index].N_de_OT_Orden_de_Trabajo = orden_de_trabajo;
    }
    this.Solicitud_de_PiezasData[index].N_de_OT = element.N_de_OT;
    if (this.Solicitud_de_PiezasData[index].Matricula !== element.Matricula && element.Matricula > 0) {
      let aeronave = await this.AeronaveService.getById(element.Matricula).toPromise();
      this.Solicitud_de_PiezasData[index].Matricula_Aeronave = aeronave;
    }
    this.Solicitud_de_PiezasData[index].Matricula = element.Matricula;
    if (this.Solicitud_de_PiezasData[index].Modelo !== element.Modelo && element.Modelo > 0) {
      let modelos = await this.ModelosService.getById(element.Modelo).toPromise();
      this.Solicitud_de_PiezasData[index].Modelo_Modelos = modelos;
    }
    this.Solicitud_de_PiezasData[index].Modelo = element.Modelo;
    this.Solicitud_de_PiezasData[index].Horas_del_Componente_a_Remover = element.Horas_del_Componente_a_Remover;
    this.Solicitud_de_PiezasData[index].Ciclos_del_componente_a_Remover = element.Ciclos_del_componente_a_Remover;
    this.Solicitud_de_PiezasData[index].Cantidad = element.Cantidad;
    if (this.Solicitud_de_PiezasData[index].Unidad !== element.Unidad && element.Unidad > 0) {
      let unidad = await this.UnidadService.getById(element.Unidad).toPromise();
      this.Solicitud_de_PiezasData[index].Unidad_Unidad = unidad;
    }
    this.Solicitud_de_PiezasData[index].Unidad = element.Unidad;
    this.Solicitud_de_PiezasData[index].Urgencia = element.Urgencia;
    this.Solicitud_de_PiezasData[index].Urgencia_Urgencia = element.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === element.Urgencia)[0] : null;
    this.Solicitud_de_PiezasData[index].Razon_de_Solicitud = element.Razon_de_Solicitud;
    this.Solicitud_de_PiezasData[index].Condicion_de_la_Parte = element.Condicion_de_la_Parte;
    if (this.Solicitud_de_PiezasData[index].N_Reporte !== element.N_Reporte && element.N_Reporte > 0) {
      let crear_reporte = await this.Crear_ReporteService.getById(element.N_Reporte).toPromise();
      this.Solicitud_de_PiezasData[index].N_Reporte_Crear_Reporte = crear_reporte;
    }
    this.Solicitud_de_PiezasData[index].N_Reporte = element.N_Reporte;
    this.Solicitud_de_PiezasData[index].FolioDetalleSolicitudPartes = element.FolioDetalleSolicitudPartes;
    this.Solicitud_de_PiezasData[index].Existencia_Almacen = this.phase == "1" ? formSolicitud_de_Piezas.value.Existencia_Almacen : element.Existencia_Almacen;
    this.Solicitud_de_PiezasData[index].Existencia_Almacen_Existencia_solicitud_crear_reporte = (this.phase == "1" ? formSolicitud_de_Piezas.value.Existencia_Almacen : element.Existencia_Almacen) !== '' ?
      this.varExistencia_solicitud_crear_reporte.filter(d => d.Folio === (this.phase == "1" ? formSolicitud_de_Piezas.value.Existencia_Almacen : element.Existencia_Almacen))[0] : null;
    this.Solicitud_de_PiezasData[index].Aprobacion_de_mantenimiento = this.phase == "2" ? formSolicitud_de_Piezas.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento;
    this.Solicitud_de_PiezasData[index].Aprobacion_de_mantenimiento_Estatus_de_Seguimiento = (this.phase == "2" ? formSolicitud_de_Piezas.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento) !== '' ?
      this.varEstatus_de_Seguimiento.filter(d => d.Folio === (this.phase == "2" ? formSolicitud_de_Piezas.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento))[0] : null;

    this.Solicitud_de_PiezasData[index].isNew = false;
    this.dataSourceSolicitud_de_Piezas.data = this.Solicitud_de_PiezasData;
    this.dataSourceSolicitud_de_Piezas._updateChangeSubscription();
  }

  editSolicitud_de_Piezas(element: any) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    const formSolicitud_de_Piezas = this.Solicitud_de_PiezasItems.controls[index] as FormGroup;
    this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Piezas[index] = this.dataSourceSolicitud_de_Piezas.data[index].N_Parte_Descripcion_Partes.Numero_de_parte_Descripcion;
    this.addFilterToControlN_Parte_Descripcion_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.N_Parte_Descripcion, index);
    this.SelectedN_de_OT_Detalle_Solicitud_de_Piezas[index] = this.dataSourceSolicitud_de_Piezas.data[index].N_de_OT_Orden_de_Trabajo.numero_de_orden;
    this.addFilterToControlN_de_OT_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.N_de_OT, index);
    this.SelectedMatricula_Detalle_Solicitud_de_Piezas[index] = this.dataSourceSolicitud_de_Piezas.data[index].Matricula_Aeronave.Matricula;
    this.addFilterToControlMatricula_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.Matricula, index);
    this.SelectedModelo_Detalle_Solicitud_de_Piezas[index] = this.dataSourceSolicitud_de_Piezas.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.Modelo, index);
    this.SelectedUnidad_Detalle_Solicitud_de_Piezas[index] = this.dataSourceSolicitud_de_Piezas.data[index].Unidad_Unidad.Descripcion;
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.Unidad, index);
    this.SelectedN_Reporte_Detalle_Solicitud_de_Piezas[index] = this.dataSourceSolicitud_de_Piezas.data[index].N_Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlN_Reporte_Detalle_Solicitud_de_Piezas(formSolicitud_de_Piezas.controls.N_Reporte, index);


    if (this.phase == 1) {
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "N_Parte_Descripcion");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "N_de_OT");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Matricula");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Modelo");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Horas_del_Componente_a_Remover");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Ciclos_del_componente_a_Remover");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Cantidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Unidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Urgencia");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Razon_de_Solicitud");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Condicion_de_la_Parte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "N_Reporte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Aprobacion_de_mantenimiento");
    }

    if (this.phase == 2) {
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "N_Parte_Descripcion");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "N_de_OT");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Matricula");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Modelo");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Horas_del_Componente_a_Remover");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Ciclos_del_componente_a_Remover");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Cantidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Unidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Urgencia");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Razon_de_Solicitud");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Condicion_de_la_Parte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "N_Reporte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Piezas, "Existencia_Almacen");
    }

    element.edit = true;
  }

  async saveDetalle_Solicitud_de_Piezas(Folio: number) {
    this.dataSourceSolicitud_de_Piezas.data.forEach(async (d, index) => {
      const data = this.Solicitud_de_PiezasItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Gestion_de_aprobacion_de_mantenimiento = Folio;


      if (model.Folio === 0) {
        // Add Solicitud de Partes
        let response = await this.Detalle_Solicitud_de_PiezasService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSolicitud_de_Piezas = this.Solicitud_de_PiezasItemsByFolio(model.Folio);
        if (formSolicitud_de_Piezas.dirty) {
          // Update Solicitud de Partes
          let response = await this.Detalle_Solicitud_de_PiezasService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Solicitud de Partes
        await this.Detalle_Solicitud_de_PiezasService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectN_Parte_Descripcion_Detalle_Solicitud_de_Piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Piezas[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_PiezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Parte_Descripcion.setValue(event.option.value);
    this.displayFnN_Parte_Descripcion_Detalle_Solicitud_de_Piezas(element);
  }

  displayFnN_Parte_Descripcion_Detalle_Solicitud_de_Piezas(this, element) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    return this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Piezas[index];
  }

  updateOptionN_Parte_Descripcion_Detalle_Solicitud_de_Piezas(event, element: any) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Piezas[index] = event.source.viewValue;
  }

  _filterN_Parte_Descripcion_Detalle_Solicitud_de_Piezas(filter: any): Observable<Partes> {
    const where = filter !== '' ? "Partes.Numero_de_parte_Descripcion like '%" + filter + "%'" : '';
    return this.PartesService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Parte_Descripcion_Detalle_Solicitud_de_Piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Parte_Descripcion_Detalle_Solicitud_de_Piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Parte_Descripcion_Detalle_Solicitud_de_Piezas = true;
        return this._filterN_Parte_Descripcion_Detalle_Solicitud_de_Piezas(value || '');
      })
    ).subscribe(result => {
      this.varPartes = result.Partess;
      this.isLoadingN_Parte_Descripcion_Detalle_Solicitud_de_Piezas = false;
      this.searchN_Parte_Descripcion_Detalle_Solicitud_de_PiezasCompleted = true;
      this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Piezas[index] = this.varPartes.length === 0 ? '' : this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Piezas[index];
    });
  }

  public selectN_de_OT_Detalle_Solicitud_de_Piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_de_OT_Detalle_Solicitud_de_Piezas[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_PiezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_de_OT.setValue(event.option.value);
    this.displayFnN_de_OT_Detalle_Solicitud_de_Piezas(element);
  }

  displayFnN_de_OT_Detalle_Solicitud_de_Piezas(this, element) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    return this.SelectedN_de_OT_Detalle_Solicitud_de_Piezas[index];
  }
  updateOptionN_de_OT_Detalle_Solicitud_de_Piezas(event, element: any) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    this.SelectedN_de_OT_Detalle_Solicitud_de_Piezas[index] = event.source.viewValue;
  }

  _filterN_de_OT_Detalle_Solicitud_de_Piezas(filter: any): Observable<Orden_de_Trabajo> {
    const where = filter !== '' ? "Orden_de_Trabajo.numero_de_orden like '%" + filter + "%'" : '';
    return this.Orden_de_TrabajoService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_de_OT_Detalle_Solicitud_de_Piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_de_OT_Detalle_Solicitud_de_Piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_de_OT_Detalle_Solicitud_de_Piezas = true;
        return this._filterN_de_OT_Detalle_Solicitud_de_Piezas(value || '');
      })
    ).subscribe(result => {
      this.varOrden_de_Trabajo = result.Orden_de_Trabajos;
      this.isLoadingN_de_OT_Detalle_Solicitud_de_Piezas = false;
      this.searchN_de_OT_Detalle_Solicitud_de_PiezasCompleted = true;
      this.SelectedN_de_OT_Detalle_Solicitud_de_Piezas[index] = this.varOrden_de_Trabajo.length === 0 ? '' : this.SelectedN_de_OT_Detalle_Solicitud_de_Piezas[index];
    });
  }

  public selectMatricula_Detalle_Solicitud_de_Piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMatricula_Detalle_Solicitud_de_Piezas[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_PiezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Matricula.setValue(event.option.value);
    this.displayFnMatricula_Detalle_Solicitud_de_Piezas(element);
  }

  displayFnMatricula_Detalle_Solicitud_de_Piezas(this, element) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    return this.SelectedMatricula_Detalle_Solicitud_de_Piezas[index];
  }
  updateOptionMatricula_Detalle_Solicitud_de_Piezas(event, element: any) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    this.SelectedMatricula_Detalle_Solicitud_de_Piezas[index] = event.source.viewValue;
  }

  _filterMatricula_Detalle_Solicitud_de_Piezas(filter: any): Observable<Aeronave> {
    const where = filter !== '' ? "Aeronave.Matricula like '%" + filter + "%'" : '';
    return this.AeronaveService.listaSelAll(0, 20, where);
  }

  addFilterToControlMatricula_Detalle_Solicitud_de_Piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMatricula_Detalle_Solicitud_de_Piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMatricula_Detalle_Solicitud_de_Piezas = true;
        return this._filterMatricula_Detalle_Solicitud_de_Piezas(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingMatricula_Detalle_Solicitud_de_Piezas = false;
      this.searchMatricula_Detalle_Solicitud_de_PiezasCompleted = true;
      this.SelectedMatricula_Detalle_Solicitud_de_Piezas[index] = this.varAeronave.length === 0 ? '' : this.SelectedMatricula_Detalle_Solicitud_de_Piezas[index];
    });
  }

  public selectModelo_Detalle_Solicitud_de_Piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_Solicitud_de_Piezas[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_PiezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_Solicitud_de_Piezas(element);
  }

  displayFnModelo_Detalle_Solicitud_de_Piezas(this, element) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    return this.SelectedModelo_Detalle_Solicitud_de_Piezas[index];
  }
  updateOptionModelo_Detalle_Solicitud_de_Piezas(event, element: any) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    this.SelectedModelo_Detalle_Solicitud_de_Piezas[index] = event.source.viewValue;
  }

  _filterModelo_Detalle_Solicitud_de_Piezas(filter: any): Observable<Modelos> {
    const where = filter !== '' ? "Modelos.Descripcion like '%" + filter + "%'" : '';
    return this.ModelosService.listaSelAll(0, 20, where);
  }

  addFilterToControlModelo_Detalle_Solicitud_de_Piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_Solicitud_de_Piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_Solicitud_de_Piezas = true;
        return this._filterModelo_Detalle_Solicitud_de_Piezas(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_Solicitud_de_Piezas = false;
      this.searchModelo_Detalle_Solicitud_de_PiezasCompleted = true;
      this.SelectedModelo_Detalle_Solicitud_de_Piezas[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_Solicitud_de_Piezas[index];
    });
  }

  public selectUnidad_Detalle_Solicitud_de_Piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_Detalle_Solicitud_de_Piezas[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_PiezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad.setValue(event.option.value);
    this.displayFnUnidad_Detalle_Solicitud_de_Piezas(element);
  }

  displayFnUnidad_Detalle_Solicitud_de_Piezas(this, element) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    return this.SelectedUnidad_Detalle_Solicitud_de_Piezas[index];
  }
  updateOptionUnidad_Detalle_Solicitud_de_Piezas(event, element: any) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    this.SelectedUnidad_Detalle_Solicitud_de_Piezas[index] = event.source.viewValue;
  }

  _filterUnidad_Detalle_Solicitud_de_Piezas(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_Detalle_Solicitud_de_Piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_Detalle_Solicitud_de_Piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_Detalle_Solicitud_de_Piezas = true;
        return this._filterUnidad_Detalle_Solicitud_de_Piezas(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_Detalle_Solicitud_de_Piezas = false;
      this.searchUnidad_Detalle_Solicitud_de_PiezasCompleted = true;
      this.SelectedUnidad_Detalle_Solicitud_de_Piezas[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_Detalle_Solicitud_de_Piezas[index];
    });
  }

  public selectN_Reporte_Detalle_Solicitud_de_Piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_Reporte_Detalle_Solicitud_de_Piezas[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_PiezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Reporte.setValue(event.option.value);
    this.displayFnN_Reporte_Detalle_Solicitud_de_Piezas(element);
  }

  displayFnN_Reporte_Detalle_Solicitud_de_Piezas(this, element) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    return this.SelectedN_Reporte_Detalle_Solicitud_de_Piezas[index];
  }
  updateOptionN_Reporte_Detalle_Solicitud_de_Piezas(event, element: any) {
    const index = this.dataSourceSolicitud_de_Piezas.data.indexOf(element);
    this.SelectedN_Reporte_Detalle_Solicitud_de_Piezas[index] = event.source.viewValue;
  }

  _filterN_Reporte_Detalle_Solicitud_de_Piezas(filter: any): Observable<Crear_Reporte> {
    const where = filter !== '' ? "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';
    return this.Crear_ReporteService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Reporte_Detalle_Solicitud_de_Piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Reporte_Detalle_Solicitud_de_Piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Reporte_Detalle_Solicitud_de_Piezas = true;
        return this._filterN_Reporte_Detalle_Solicitud_de_Piezas(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingN_Reporte_Detalle_Solicitud_de_Piezas = false;
      this.searchN_Reporte_Detalle_Solicitud_de_PiezasCompleted = true;
      this.SelectedN_Reporte_Detalle_Solicitud_de_Piezas[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedN_Reporte_Detalle_Solicitud_de_Piezas[index];
    });
  }
  //#endregion


  //#region Solicitud de Servicios
  get Solicitud_de_ServiciosItems() {
    return this.Gestion_de_aprobacion_de_mantenimientoForm.get('Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems') as FormArray;
  }

  getSolicitud_de_ServiciosColumns(): string[] {
    return this.Solicitud_de_ServiciosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSolicitud_de_Servicios(Solicitud_de_Servicios: Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[]) {
    Solicitud_de_Servicios.forEach(element => {
      this.addSolicitud_de_Servicios(element);
    });
  }

  addSolicitud_de_ServiciosToMR() {
    const Solicitud_de_Servicios = new Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(this.fb);
    this.Solicitud_de_ServiciosData.push(this.addSolicitud_de_Servicios(Solicitud_de_Servicios));
    this.dataSourceSolicitud_de_Servicios.data = this.Solicitud_de_ServiciosData;
    Solicitud_de_Servicios.edit = true;
    Solicitud_de_Servicios.isNew = true;
    const length = this.dataSourceSolicitud_de_Servicios.data.length;
    const index = length - 1;
    const formSolicitud_de_Servicios = this.Solicitud_de_ServiciosItems.controls[index] as FormGroup;
    this.addFilterToControlN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.N_Servicio_Descripcion, index);
    this.addFilterToControlN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.N_de_OT, index);
    this.addFilterToControlMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.Matricula, index);
    this.addFilterToControlModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.Modelo, index);
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.Unidad, index);
    this.addFilterToControlN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.N_Reporte, index);

    const page = Math.ceil(this.dataSourceSolicitud_de_Servicios.data.filter(d => !d.IsDeleted).length / this.paginatorServicios.pageSize);
    if (page !== this.paginatorServicios.pageIndex) {
      this.paginatorServicios.pageIndex = page;
    }
  }

  addSolicitud_de_Servicios(entity: Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion) {
    const Solicitud_de_Servicios = new Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(this.fb);
    this.Solicitud_de_ServiciosItems.push(Solicitud_de_Servicios.buildFormGroup());
    if (entity) {
      Solicitud_de_Servicios.fromObject(entity);
    }
    return entity;
  }

  Solicitud_de_ServiciosItemsByFolio(Folio: number): FormGroup {
    return (this.Gestion_de_aprobacion_de_mantenimientoForm.get('Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Solicitud_de_ServiciosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    let fb = this.Solicitud_de_ServiciosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSolicitud_de_Servicios(element: any) {
    let index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    this.Solicitud_de_ServiciosData[index].IsDeleted = true;
    this.dataSourceSolicitud_de_Servicios.data = this.Solicitud_de_ServiciosData;
    this.dataSourceSolicitud_de_Servicios.data.splice(index, 1);
    this.dataSourceSolicitud_de_Servicios._updateChangeSubscription();
    index = this.dataSourceSolicitud_de_Servicios.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorServicios.pageSize);
    if (page !== this.paginatorServicios.pageIndex) {
      this.paginatorServicios.pageIndex = page;
    }
  }

  cancelEditSolicitud_de_Servicios(element: any) {
    let index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Solicitud_de_ServiciosData[index].IsDeleted = true;
      this.dataSourceSolicitud_de_Servicios.data = this.Solicitud_de_ServiciosData;
      this.dataSourceSolicitud_de_Servicios.data.splice(index, 1);
      this.dataSourceSolicitud_de_Servicios._updateChangeSubscription();
      index = this.Solicitud_de_ServiciosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginatorServicios.pageSize);
      if (page !== this.paginatorServicios.pageIndex) {
        this.paginatorServicios.pageIndex = page;
      }
    }
  }

  async saveSolicitud_de_Servicios(element: any) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    const formSolicitud_de_Servicios = this.Solicitud_de_ServiciosItems.controls[index] as FormGroup;
    if (this.Solicitud_de_ServiciosData[index].N_Servicio_Descripcion !== element.N_Servicio_Descripcion && element.N_Servicio_Descripcion > 0) {
      let catalogo_servicios = await this.Catalogo_serviciosService.getById(element.N_Servicio_Descripcion).toPromise();
      this.Solicitud_de_ServiciosData[index].N_Servicio_Descripcion_Catalogo_servicios = catalogo_servicios;
    }
    this.Solicitud_de_ServiciosData[index].N_Servicio_Descripcion = element.N_Servicio_Descripcion;
    if (this.Solicitud_de_ServiciosData[index].N_de_OT !== element.N_de_OT && element.N_de_OT > 0) {
      let orden_de_trabajo = await this.Orden_de_TrabajoService.getById(element.N_de_OT).toPromise();
      this.Solicitud_de_ServiciosData[index].N_de_OT_Orden_de_Trabajo = orden_de_trabajo;
    }
    this.Solicitud_de_ServiciosData[index].N_de_OT = element.N_de_OT;
    if (this.Solicitud_de_ServiciosData[index].Matricula !== element.Matricula && element.Matricula > 0) {
      let aeronave = await this.AeronaveService.getById(element.Matricula).toPromise();
      this.Solicitud_de_ServiciosData[index].Matricula_Aeronave = aeronave;
    }
    this.Solicitud_de_ServiciosData[index].Matricula = element.Matricula;
    if (this.Solicitud_de_ServiciosData[index].Modelo !== element.Modelo && element.Modelo > 0) {
      let modelos = await this.ModelosService.getById(element.Modelo).toPromise();
      this.Solicitud_de_ServiciosData[index].Modelo_Modelos = modelos;
    }
    this.Solicitud_de_ServiciosData[index].Modelo = element.Modelo;
    this.Solicitud_de_ServiciosData[index].Fecha_Estimada_del_Mtto_ = element.Fecha_Estimada_del_Mtto_;
    this.Solicitud_de_ServiciosData[index].Cantidad = element.Cantidad;
    if (this.Solicitud_de_ServiciosData[index].Unidad !== element.Unidad && element.Unidad > 0) {
      let unidad = await this.UnidadService.getById(element.Unidad).toPromise();
      this.Solicitud_de_ServiciosData[index].Unidad_Unidad = unidad;
    }
    this.Solicitud_de_ServiciosData[index].Unidad = element.Unidad;
    this.Solicitud_de_ServiciosData[index].Urgencia = element.Urgencia;
    this.Solicitud_de_ServiciosData[index].Urgencia_Urgencia = element.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === element.Urgencia)[0] : null;
    if (this.Solicitud_de_ServiciosData[index].N_Reporte !== element.N_Reporte && element.N_Reporte > 0) {
      let crear_reporte = await this.Crear_ReporteService.getById(element.N_Reporte).toPromise();
      this.Solicitud_de_ServiciosData[index].N_Reporte_Crear_Reporte = crear_reporte;
    }
    this.Solicitud_de_ServiciosData[index].N_Reporte = element.N_Reporte;
    this.Solicitud_de_ServiciosData[index].Razon_de_Solicitud = element.Razon_de_Solicitud;
    this.Solicitud_de_ServiciosData[index].Existencia_Almacen = this.phase == "1" ? formSolicitud_de_Servicios.value.Existencia_Almacen : element.Existencia_Almacen;
    this.Solicitud_de_ServiciosData[index].Existencia_Almacen_Existencia_solicitud_crear_reporte = (this.phase == "1" ? formSolicitud_de_Servicios.value.Existencia_Almacen : element.Existencia_Almacen) !== '' ?
      this.varExistencia_solicitud_crear_reporte.filter(d => d.Folio === (this.phase == "1" ? formSolicitud_de_Servicios.value.Existencia_Almacen : element.Existencia_Almacen))[0] : null;
    this.Solicitud_de_ServiciosData[index].Aprobacion_de_mantenimiento = this.phase == "2" ? formSolicitud_de_Servicios.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento;
    this.Solicitud_de_ServiciosData[index].Aprobacion_de_mantenimiento_Estatus_de_Seguimiento = (this.phase == "2" ? formSolicitud_de_Servicios.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento) !== '' ?
      this.varEstatus_de_Seguimiento.filter(d => d.Folio === (this.phase == "2" ? formSolicitud_de_Servicios.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento))[0] : null;
    this.Solicitud_de_ServiciosData[index].FolioDetalleSolicitudServicios = element.FolioDetalleSolicitudServicios;

    this.Solicitud_de_ServiciosData[index].isNew = false;
    this.dataSourceSolicitud_de_Servicios.data = this.Solicitud_de_ServiciosData;
    this.dataSourceSolicitud_de_Servicios._updateChangeSubscription();
  }

  editSolicitud_de_Servicios(element: any) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    const formSolicitud_de_Servicios = this.Solicitud_de_ServiciosItems.controls[index] as FormGroup;
    this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Servicios.data[index].N_Servicio_Descripcion_Catalogo_servicios.Codigo_Descripcion;
    this.addFilterToControlN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.N_Servicio_Descripcion, index);
    this.SelectedN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Servicios.data[index].N_de_OT_Orden_de_Trabajo.numero_de_orden;
    this.addFilterToControlN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.N_de_OT, index);
    this.SelectedMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Servicios.data[index].Matricula_Aeronave.Matricula;
    this.addFilterToControlMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.Matricula, index);
    this.SelectedModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Servicios.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.Modelo, index);
    this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Servicios.data[index].Unidad_Unidad.Descripcion;
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.Unidad, index);
    this.SelectedN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Servicios.data[index].N_Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(formSolicitud_de_Servicios.controls.N_Reporte, index);

    if (this.phase == 1) {
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "N_Servicio_Descripcion");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "N_de_OT");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Matricula");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Modelo");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Fecha_Estimada_del_Mtto_");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Cantidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Unidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Urgencia");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "N_Reporte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Razon_de_Solicitud");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Aprobacion_de_mantenimiento");
    }

    if (this.phase == 2) {
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "N_Servicio_Descripcion");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "N_de_OT");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Matricula");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Modelo");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Fecha_Estimada_del_Mtto_");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Cantidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Unidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Urgencia");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "N_Reporte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Razon_de_Solicitud");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Servicios, "Existencia_Almacen");
    }

    element.edit = true;
  }

  async saveDetalle_Solicitud_de_Servicios_Gestion_de_aprobacion(Folio: number) {
    this.dataSourceSolicitud_de_Servicios.data.forEach(async (d, index) => {
      const data = this.Solicitud_de_ServiciosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Gestion_de_aprobacion_de_mantenimiento = Folio;

      if (model.Folio === 0) {
        // Add Solicitud de Servicios
        let response = await this.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSolicitud_de_Servicios = this.Solicitud_de_ServiciosItemsByFolio(model.Folio);
        if (formSolicitud_de_Servicios.dirty) {
          // Update Solicitud de Servicios
          let response = await this.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Solicitud de Servicios
        await this.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Servicio_Descripcion.setValue(event.option.value);
    this.displayFnN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(element);
  }

  displayFnN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    return this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
  }
  updateOptionN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(filter: any): Observable<Catalogo_servicios> {
    const where = filter !== '' ? "Catalogo_servicios.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Catalogo_serviciosService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true;
        return this._filterN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varCatalogo_servicios = result.Catalogo_servicioss;
      this.isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = false;
      this.searchN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted = true;
      this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.varCatalogo_servicios.length === 0 ? '' : this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
    });
  }
  public selectN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_de_OT.setValue(event.option.value);
    this.displayFnN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(element);
  }

  displayFnN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    return this.SelectedN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
  }
  updateOptionN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    this.SelectedN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(filter: any): Observable<Orden_de_Trabajo> {
    const where = filter !== '' ? "Orden_de_Trabajo.numero_de_orden like '%" + filter + "%'" : '';
    return this.Orden_de_TrabajoService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true;
        return this._filterN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varOrden_de_Trabajo = result.Orden_de_Trabajos;
      this.isLoadingN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = false;
      this.searchN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted = true;
      this.SelectedN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.varOrden_de_Trabajo.length === 0 ? '' : this.SelectedN_de_OT_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
    });
  }
  public selectMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Matricula.setValue(event.option.value);
    this.displayFnMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(element);
  }

  displayFnMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    return this.SelectedMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
  }
  updateOptionMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    this.SelectedMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(filter: any): Observable<Aeronave> {
    const where = filter !== '' ? "Aeronave.Matricula like '%" + filter + "%'" : '';
    return this.AeronaveService.listaSelAll(0, 20, where);
  }

  addFilterToControlMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true;
        return this._filterMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = false;
      this.searchMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted = true;
      this.SelectedMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.varAeronave.length === 0 ? '' : this.SelectedMatricula_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
    });
  }
  public selectModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(element);
  }

  displayFnModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    return this.SelectedModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
  }
  updateOptionModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    this.SelectedModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(filter: any): Observable<Modelos> {
    const where = filter !== '' ? "Modelos.Descripcion like '%" + filter + "%'" : '';
    return this.ModelosService.listaSelAll(0, 20, where);
  }

  addFilterToControlModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true;
        return this._filterModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = false;
      this.searchModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted = true;
      this.SelectedModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
    });
  }
  public selectUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad.setValue(event.option.value);
    this.displayFnUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(element);
  }

  displayFnUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    return this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
  }
  updateOptionUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true;
        return this._filterUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = false;
      this.searchUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted = true;
      this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
    });
  }
  public selectN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Reporte.setValue(event.option.value);
    this.displayFnN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(element);
  }

  displayFnN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    return this.SelectedN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
  }
  updateOptionN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Servicios.data.indexOf(element);
    this.SelectedN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(filter: any): Observable<Crear_Reporte> {
    const where = filter !== '' ? "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';
    return this.Crear_ReporteService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = true;
        return this._filterN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion = false;
      this.searchN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacionCompleted = true;
      this.SelectedN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedN_Reporte_Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion[index];
    });
  }
  //#endregion

  //#region Solicitud de Materiales
  get Solicitud_de_MaterialesItems() {
    return this.Gestion_de_aprobacion_de_mantenimientoForm.get('Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems') as FormArray;
  }

  getSolicitud_de_MaterialesColumns(): string[] {
    return this.Solicitud_de_MaterialesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSolicitud_de_Materiales(Solicitud_de_Materiales: Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[]) {
    Solicitud_de_Materiales.forEach(element => {
      this.addSolicitud_de_Materiales(element);
    });
  }

  addSolicitud_de_MaterialesToMR() {
    const Solicitud_de_Materiales = new Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(this.fb);
    this.Solicitud_de_MaterialesData.push(this.addSolicitud_de_Materiales(Solicitud_de_Materiales));
    this.dataSourceSolicitud_de_Materiales.data = this.Solicitud_de_MaterialesData;
    Solicitud_de_Materiales.edit = true;
    Solicitud_de_Materiales.isNew = true;
    const length = this.dataSourceSolicitud_de_Materiales.data.length;
    const index = length - 1;
    const formSolicitud_de_Materiales = this.Solicitud_de_MaterialesItems.controls[index] as FormGroup;
    this.addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.Codigo_Descripcion, index);
    this.addFilterToControlN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.N_de_Reporte, index);
    this.addFilterToControlN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.N_de_OT, index);
    this.addFilterToControlMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.Matricula, index);
    this.addFilterToControlModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.Modelo, index);
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.Unidad, index);

    const page = Math.ceil(this.dataSourceSolicitud_de_Materiales.data.filter(d => !d.IsDeleted).length / this.paginatorMateriales.pageSize);
    if (page !== this.paginatorMateriales.pageIndex) {
      this.paginatorMateriales.pageIndex = page;
    }
  }

  addSolicitud_de_Materiales(entity: Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion) {
    const Solicitud_de_Materiales = new Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(this.fb);
    this.Solicitud_de_MaterialesItems.push(Solicitud_de_Materiales.buildFormGroup());
    if (entity) {
      Solicitud_de_Materiales.fromObject(entity);
    }
    return entity;
  }

  Solicitud_de_MaterialesItemsByFolio(Folio: number): FormGroup {
    return (this.Gestion_de_aprobacion_de_mantenimientoForm.get('Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Solicitud_de_MaterialesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    let fb = this.Solicitud_de_MaterialesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSolicitud_de_Materiales(element: any) {
    let index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    this.Solicitud_de_MaterialesData[index].IsDeleted = true;
    this.dataSourceSolicitud_de_Materiales.data = this.Solicitud_de_MaterialesData;
    this.dataSourceSolicitud_de_Materiales.data.splice(index, 1);
    this.dataSourceSolicitud_de_Materiales._updateChangeSubscription();
    index = this.dataSourceSolicitud_de_Materiales.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorMateriales.pageSize);
    if (page !== this.paginatorMateriales.pageIndex) {
      this.paginatorMateriales.pageIndex = page;
    }
  }

  cancelEditSolicitud_de_Materiales(element: any) {
    let index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Solicitud_de_MaterialesData[index].IsDeleted = true;
      this.dataSourceSolicitud_de_Materiales.data = this.Solicitud_de_MaterialesData;
      this.dataSourceSolicitud_de_Materiales.data.splice(index, 1);
      this.dataSourceSolicitud_de_Materiales._updateChangeSubscription();
      index = this.Solicitud_de_MaterialesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginatorMateriales.pageSize);
      if (page !== this.paginatorMateriales.pageIndex) {
        this.paginatorMateriales.pageIndex = page;
      }
    }
  }

  async saveSolicitud_de_Materiales(element: any) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    const formSolicitud_de_Materiales = this.Solicitud_de_MaterialesItems.controls[index] as FormGroup;
    if (this.Solicitud_de_MaterialesData[index].Codigo_Descripcion !== element.Codigo_Descripcion && element.Codigo_Descripcion > 0) {
      let listado_de_materiales = await this.Listado_de_MaterialesService.getById(element.Codigo_Descripcion).toPromise();
      this.Solicitud_de_MaterialesData[index].Codigo_Descripcion_Listado_de_Materiales = listado_de_materiales;
    }
    this.Solicitud_de_MaterialesData[index].Codigo_Descripcion = element.Codigo_Descripcion;
    if (this.Solicitud_de_MaterialesData[index].N_de_Reporte !== element.N_de_Reporte && element.N_de_Reporte > 0) {
      let crear_reporte = await this.Crear_ReporteService.getById(element.N_de_Reporte).toPromise();
      this.Solicitud_de_MaterialesData[index].N_de_Reporte_Crear_Reporte = crear_reporte;
    }
    this.Solicitud_de_MaterialesData[index].N_de_Reporte = element.N_de_Reporte;
    if (this.Solicitud_de_MaterialesData[index].N_de_OT !== element.N_de_OT && element.N_de_OT > 0) {
      let orden_de_trabajo = await this.Orden_de_TrabajoService.getById(element.N_de_OT).toPromise();
      this.Solicitud_de_MaterialesData[index].N_de_OT_Orden_de_Trabajo = orden_de_trabajo;
    }
    this.Solicitud_de_MaterialesData[index].N_de_OT = element.N_de_OT;
    if (this.Solicitud_de_MaterialesData[index].Matricula !== element.Matricula && element.Matricula > 0) {
      let aeronave = await this.AeronaveService.getById(element.Matricula).toPromise();
      this.Solicitud_de_MaterialesData[index].Matricula_Aeronave = aeronave;
    }
    this.Solicitud_de_MaterialesData[index].Matricula = element.Matricula;
    if (this.Solicitud_de_MaterialesData[index].Modelo !== element.Modelo && element.Modelo > 0) {
      let modelos = await this.ModelosService.getById(element.Modelo).toPromise();
      this.Solicitud_de_MaterialesData[index].Modelo_Modelos = modelos;
    }
    this.Solicitud_de_MaterialesData[index].Modelo = element.Modelo;
    this.Solicitud_de_MaterialesData[index].Cantidad = element.Cantidad;
    if (this.Solicitud_de_MaterialesData[index].Unidad !== element.Unidad && element.Unidad > 0) {
      let unidad = await this.UnidadService.getById(element.Unidad).toPromise();
      this.Solicitud_de_MaterialesData[index].Unidad_Unidad = unidad;
    }
    this.Solicitud_de_MaterialesData[index].Unidad = element.Unidad;
    this.Solicitud_de_MaterialesData[index].Urgencia = element.Urgencia;
    this.Solicitud_de_MaterialesData[index].Urgencia_Urgencia = element.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === element.Urgencia)[0] : null;
    this.Solicitud_de_MaterialesData[index].Razon_de_Solicitud = element.Razon_de_Solicitud;
    this.Solicitud_de_MaterialesData[index].Existencia_Almacen = this.phase == "1" ? formSolicitud_de_Materiales.value.Existencia_Almacen : element.Existencia_Almacen;
    this.Solicitud_de_MaterialesData[index].Existencia_Almacen_Existencia_solicitud_crear_reporte = (this.phase == "1" ? formSolicitud_de_Materiales.value.Existencia_Almacen : element.Existencia_Almacen) !== '' ?
      this.varExistencia_solicitud_crear_reporte.filter(d => d.Folio === (this.phase == "1" ? formSolicitud_de_Materiales.value.Existencia_Almacen : element.Existencia_Almacen))[0] : null;
    this.Solicitud_de_MaterialesData[index].Aprobacion_de_mantenimiento = this.phase == "2" ? formSolicitud_de_Materiales.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento;
    this.Solicitud_de_MaterialesData[index].Aprobacion_de_mantenimiento_Estatus_de_Seguimiento = (this.phase == "2" ? formSolicitud_de_Materiales.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento) !== '' ?
      this.varEstatus_de_Seguimiento.filter(d => d.Folio === (this.phase == "2" ? formSolicitud_de_Materiales.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento))[0] : null;
    this.Solicitud_de_MaterialesData[index].FolioDetalleSolicitudMateriales = element.FolioDetalleSolicitudMateriales;

    this.Solicitud_de_MaterialesData[index].isNew = false;
    this.dataSourceSolicitud_de_Materiales.data = this.Solicitud_de_MaterialesData;
    this.dataSourceSolicitud_de_Materiales._updateChangeSubscription();
  }

  editSolicitud_de_Materiales(element: any) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    const formSolicitud_de_Materiales = this.Solicitud_de_MaterialesItems.controls[index] as FormGroup;
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Materiales.data[index].Codigo_Descripcion_Listado_de_Materiales.Codigo_Descripcion;
    this.addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.Codigo_Descripcion, index);
    this.SelectedN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Materiales.data[index].N_de_Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.N_de_Reporte, index);
    this.SelectedN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Materiales.data[index].N_de_OT_Orden_de_Trabajo.numero_de_orden;
    this.addFilterToControlN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.N_de_OT, index);
    this.SelectedMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Materiales.data[index].Matricula_Aeronave.Matricula;
    this.addFilterToControlMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.Matricula, index);
    this.SelectedModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Materiales.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.Modelo, index);
    this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Materiales.data[index].Unidad_Unidad.Descripcion;
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(formSolicitud_de_Materiales.controls.Unidad, index);

    if (this.phase == 1) {
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Codigo_Descripcion");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "N_de_Reporte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "N_de_OT");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Matricula");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Modelo");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Cantidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Unidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Urgencia");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Razon_de_Solicitud");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Aprobacion_de_mantenimiento");
    }

    if (this.phase == 2) {
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Codigo_Descripcion");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "N_de_Reporte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "N_de_OT");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Matricula");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Modelo");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Cantidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Unidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Urgencia");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Razon_de_Solicitud");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Materiales, "Existencia_Almacen");
    }

    element.edit = true;
  }

  async saveDetalle_Solicitud_de_Materiales_Gestion_de_aprobacion(Folio: number) {
    this.dataSourceSolicitud_de_Materiales.data.forEach(async (d, index) => {
      const data = this.Solicitud_de_MaterialesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Gestion_de_aprobacion_de_mantenimiento = Folio;


      if (model.Folio === 0) {
        // Add Solicitud de Materiales
        let response = await this.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSolicitud_de_Materiales = this.Solicitud_de_MaterialesItemsByFolio(model.Folio);
        if (formSolicitud_de_Materiales.dirty) {
          // Update Solicitud de Materiales
          let response = await this.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Solicitud de Materiales
        await this.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Codigo_Descripcion.setValue(event.option.value);
    this.displayFnCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(element);
  }

  displayFnCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    return this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
  }
  updateOptionCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(filter: any): Observable<Listado_de_Materiales> {
    const where = filter !== '' ? "Listado_de_Materiales.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Listado_de_MaterialesService.listaSelAll(0, 20, where);
  }

  addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true;
        return this._filterCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varListado_de_Materiales = result.Listado_de_Materialess;
      this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = false;
      this.searchCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted = true;
      this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.varListado_de_Materiales.length === 0 ? '' : this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
    });
  }
  public selectN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_de_Reporte.setValue(event.option.value);
    this.displayFnN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(element);
  }

  displayFnN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    return this.SelectedN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
  }
  updateOptionN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    this.SelectedN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(filter: any): Observable<Crear_Reporte> {
    const where = filter !== '' ? "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';
    return this.Crear_ReporteService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true;
        return this._filterN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = false;
      this.searchN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted = true;
      this.SelectedN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedN_de_Reporte_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
    });
  }
  public selectN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_de_OT.setValue(event.option.value);
    this.displayFnN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(element);
  }

  displayFnN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    return this.SelectedN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
  }
  updateOptionN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    this.SelectedN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(filter: any): Observable<Orden_de_Trabajo> {
    const where = filter !== '' ? "Orden_de_Trabajo.numero_de_orden like '%" + filter + "%'" : '';
    return this.Orden_de_TrabajoService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true;
        return this._filterN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varOrden_de_Trabajo = result.Orden_de_Trabajos;
      this.isLoadingN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = false;
      this.searchN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted = true;
      this.SelectedN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.varOrden_de_Trabajo.length === 0 ? '' : this.SelectedN_de_OT_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
    });
  }
  public selectMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Matricula.setValue(event.option.value);
    this.displayFnMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(element);
  }

  displayFnMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    return this.SelectedMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
  }
  updateOptionMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    this.SelectedMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(filter: any): Observable<Aeronave> {
    const where = filter !== '' ? "Aeronave.Matricula like '%" + filter + "%'" : '';
    return this.AeronaveService.listaSelAll(0, 20, where);
  }

  addFilterToControlMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true;
        return this._filterMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = false;
      this.searchMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted = true;
      this.SelectedMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.varAeronave.length === 0 ? '' : this.SelectedMatricula_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
    });
  }
  public selectModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(element);
  }

  displayFnModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    return this.SelectedModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
  }
  updateOptionModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    this.SelectedModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(filter: any): Observable<Modelos> {
    const where = filter !== '' ? "Modelos.Descripcion like '%" + filter + "%'" : '';
    return this.ModelosService.listaSelAll(0, 20, where);
  }

  addFilterToControlModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true;
        return this._filterModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = false;
      this.searchModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted = true;
      this.SelectedModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
    });
  }
  public selectUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad.setValue(event.option.value);
    this.displayFnUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(element);
  }

  displayFnUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    return this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
  }
  updateOptionUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Materiales.data.indexOf(element);
    this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = true;
        return this._filterUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion = false;
      this.searchUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacionCompleted = true;
      this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion[index];
    });
  }

  //#endregion


  //#region Solicitud de Herramientas

  get Solicitud_de_HerramientasItems() {
    return this.Gestion_de_aprobacion_de_mantenimientoForm.get('Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems') as FormArray;
  }

  getSolicitud_de_HerramientasColumns(): string[] {
    return this.Solicitud_de_HerramientasColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSolicitud_de_Herramientas(Solicitud_de_Herramientas: Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[]) {
    Solicitud_de_Herramientas.forEach(element => {
      this.addSolicitud_de_Herramientas(element);
    });
  }

  addSolicitud_de_HerramientasToMR() {
    const Solicitud_de_Herramientas = new Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(this.fb);
    this.Solicitud_de_HerramientasData.push(this.addSolicitud_de_Herramientas(Solicitud_de_Herramientas));
    this.dataSourceSolicitud_de_Herramientas.data = this.Solicitud_de_HerramientasData;
    Solicitud_de_Herramientas.edit = true;
    Solicitud_de_Herramientas.isNew = true;
    const length = this.dataSourceSolicitud_de_Herramientas.data.length;
    const index = length - 1;
    const formSolicitud_de_Herramientas = this.Solicitud_de_HerramientasItems.controls[index] as FormGroup;
    this.addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.Codigo_Descripcion, index);
    this.addFilterToControlN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.N_Reporte, index);
    this.addFilterToControlN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.N_de_OT, index);
    this.addFilterToControlMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.Matricula, index);
    this.addFilterToControlModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.Modelo, index);
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.Unidad, index);

    const page = Math.ceil(this.dataSourceSolicitud_de_Herramientas.data.filter(d => !d.IsDeleted).length / this.paginatorHerramientas.pageSize);
    if (page !== this.paginatorHerramientas.pageIndex) {
      this.paginatorHerramientas.pageIndex = page;
    }
  }

  addSolicitud_de_Herramientas(entity: Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion) {
    const Solicitud_de_Herramientas = new Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(this.fb);
    this.Solicitud_de_HerramientasItems.push(Solicitud_de_Herramientas.buildFormGroup());
    if (entity) {
      Solicitud_de_Herramientas.fromObject(entity);
    }
    return entity;
  }

  Solicitud_de_HerramientasItemsByFolio(Folio: number): FormGroup {
    return (this.Gestion_de_aprobacion_de_mantenimientoForm.get('Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Solicitud_de_HerramientasItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    let fb = this.Solicitud_de_HerramientasItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSolicitud_de_Herramientas(element: any) {
    let index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    this.Solicitud_de_HerramientasData[index].IsDeleted = true;
    this.dataSourceSolicitud_de_Herramientas.data = this.Solicitud_de_HerramientasData;
    this.dataSourceSolicitud_de_Herramientas.data.splice(index, 1);
    this.dataSourceSolicitud_de_Herramientas._updateChangeSubscription();
    index = this.dataSourceSolicitud_de_Herramientas.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorHerramientas.pageSize);
    if (page !== this.paginatorHerramientas.pageIndex) {
      this.paginatorHerramientas.pageIndex = page;
    }
  }

  cancelEditSolicitud_de_Herramientas(element: any) {
    let index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Solicitud_de_HerramientasData[index].IsDeleted = true;
      this.dataSourceSolicitud_de_Herramientas.data = this.Solicitud_de_HerramientasData;
      this.dataSourceSolicitud_de_Herramientas.data.splice(index, 1);
      this.dataSourceSolicitud_de_Herramientas._updateChangeSubscription();
      index = this.Solicitud_de_HerramientasData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginatorHerramientas.pageSize);
      if (page !== this.paginatorHerramientas.pageIndex) {
        this.paginatorHerramientas.pageIndex = page;
      }
    }
  }

  async saveSolicitud_de_Herramientas(element: any) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    const formSolicitud_de_Herramientas = this.Solicitud_de_HerramientasItems.controls[index] as FormGroup;
    if (this.Solicitud_de_HerramientasData[index].Codigo_Descripcion !== element.Codigo_Descripcion && element.Codigo_Descripcion > 0) {
      let herramientas = await this.HerramientasService.getById(element.Codigo_Descripcion).toPromise();
      this.Solicitud_de_HerramientasData[index].Codigo_Descripcion_Herramientas = herramientas;
    }
    this.Solicitud_de_HerramientasData[index].Codigo_Descripcion = element.Codigo_Descripcion;
    if (this.Solicitud_de_HerramientasData[index].N_Reporte !== element.N_Reporte && element.N_Reporte > 0) {
      let crear_reporte = await this.Crear_ReporteService.getById(element.N_Reporte).toPromise();
      this.Solicitud_de_HerramientasData[index].N_Reporte_Crear_Reporte = crear_reporte;
    }
    this.Solicitud_de_HerramientasData[index].N_Reporte = element.N_Reporte;
    if (this.Solicitud_de_HerramientasData[index].N_de_OT !== element.N_de_OT && element.N_de_OT > 0) {
      let orden_de_trabajo = await this.Orden_de_TrabajoService.getById(element.N_de_OT).toPromise();
      this.Solicitud_de_HerramientasData[index].N_de_OT_Orden_de_Trabajo = orden_de_trabajo;
    }
    this.Solicitud_de_HerramientasData[index].N_de_OT = element.N_de_OT;
    if (this.Solicitud_de_HerramientasData[index].Matricula !== element.Matricula && element.Matricula > 0) {
      let aeronave = await this.AeronaveService.getById(element.Matricula).toPromise();
      this.Solicitud_de_HerramientasData[index].Matricula_Aeronave = aeronave;
    }
    this.Solicitud_de_HerramientasData[index].Matricula = element.Matricula;
    if (this.Solicitud_de_HerramientasData[index].Modelo !== element.Modelo && element.Modelo > 0) {
      let modelos = await this.ModelosService.getById(element.Modelo).toPromise();
      this.Solicitud_de_HerramientasData[index].Modelo_Modelos = modelos;
    }
    this.Solicitud_de_HerramientasData[index].Modelo = element.Modelo;
    this.Solicitud_de_HerramientasData[index].Cantidad = element.Cantidad;
    if (this.Solicitud_de_HerramientasData[index].Unidad !== element.Unidad && element.Unidad > 0) {
      let unidad = await this.UnidadService.getById(element.Unidad).toPromise();
      this.Solicitud_de_HerramientasData[index].Unidad_Unidad = unidad;
    }
    this.Solicitud_de_HerramientasData[index].Unidad = element.Unidad;
    this.Solicitud_de_HerramientasData[index].Urgencia = element.Urgencia;
    this.Solicitud_de_HerramientasData[index].Urgencia_Urgencia = element.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === element.Urgencia)[0] : null;
    this.Solicitud_de_HerramientasData[index].Razon_de_Solicitud = element.Razon_de_Solicitud;
    this.Solicitud_de_HerramientasData[index].Existencia_Almacen = this.phase == "1" ? formSolicitud_de_Herramientas.value.Existencia_Almacen : element.Existencia_Almacen;
    this.Solicitud_de_HerramientasData[index].Existencia_Almacen_Existencia_solicitud_crear_reporte = (this.phase == "1" ? formSolicitud_de_Herramientas.value.Existencia_Almacen : element.Existencia_Almacen) !== '' ?
      this.varExistencia_solicitud_crear_reporte.filter(d => d.Folio === (this.phase == "1" ? formSolicitud_de_Herramientas.value.Existencia_Almacen : element.Existencia_Almacen))[0] : null;
    this.Solicitud_de_HerramientasData[index].Aprobacion_de_mantenimiento = this.phase == "2" ? formSolicitud_de_Herramientas.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento;
    this.Solicitud_de_HerramientasData[index].Aprobacion_de_mantenimiento_Estatus_de_Seguimiento = (this.phase == "2" ? formSolicitud_de_Herramientas.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento) !== '' ?
      this.varEstatus_de_Seguimiento.filter(d => d.Folio === (this.phase == "2" ? formSolicitud_de_Herramientas.value.Aprobacion_de_mantenimiento : element.Aprobacion_de_mantenimiento))[0] : null;
    this.Solicitud_de_HerramientasData[index].FolioDetalleSolicitudHerramientas = element.FolioDetalleSolicitudHerramientas;

    this.Solicitud_de_HerramientasData[index].isNew = false;
    this.dataSourceSolicitud_de_Herramientas.data = this.Solicitud_de_HerramientasData;
    this.dataSourceSolicitud_de_Herramientas._updateChangeSubscription();
  }

  editSolicitud_de_Herramientas(element: any) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    const formSolicitud_de_Herramientas = this.Solicitud_de_HerramientasItems.controls[index] as FormGroup;
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Herramientas.data[index].Codigo_Descripcion_Herramientas.Codigo_Descripcion;
    this.addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.Codigo_Descripcion, index);
    this.SelectedN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Herramientas.data[index].N_Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.N_Reporte, index);
    this.SelectedN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Herramientas.data[index].N_de_OT_Orden_de_Trabajo.numero_de_orden;
    this.addFilterToControlN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.N_de_OT, index);
    this.SelectedMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Herramientas.data[index].Matricula_Aeronave.Matricula;
    this.addFilterToControlMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.Matricula, index);
    this.SelectedModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Herramientas.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.Modelo, index);
    this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.dataSourceSolicitud_de_Herramientas.data[index].Unidad_Unidad.Descripcion;
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(formSolicitud_de_Herramientas.controls.Unidad, index);


    if (this.phase == 1) {
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Codigo_Descripcion");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "N_Reporte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "N_de_OT");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Matricula");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Modelo");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Cantidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Unidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Urgencia");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Razon_de_Solicitud");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Aprobacion_de_mantenimiento");
    }

    if (this.phase == 2) {
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Codigo_Descripcion");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "N_Reporte");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "N_de_OT");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Matricula");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Modelo");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Cantidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Unidad");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Urgencia");

      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Razon_de_Solicitud");
      this.brf.SetDisabledToMRControl(formSolicitud_de_Herramientas, "Existencia_Almacen");
    }

    element.edit = true;
  }

  async saveDetalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(Folio: number) {
    this.dataSourceSolicitud_de_Herramientas.data.forEach(async (d, index) => {
      const data = this.Solicitud_de_HerramientasItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Gestion_de_aprobacion_de_mantenimiento = Folio;


      if (model.Folio === 0) {
        // Add Solicitud de Herramientas
        let response = await this.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSolicitud_de_Herramientas = this.Solicitud_de_HerramientasItemsByFolio(model.Folio);
        if (formSolicitud_de_Herramientas.dirty) {
          // Update Solicitud de Herramientas
          let response = await this.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Solicitud de Herramientas
        await this.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Codigo_Descripcion.setValue(event.option.value);
    this.displayFnCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(element);
  }

  displayFnCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    return this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
  }
  updateOptionCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(filter: any): Observable<Herramientas> {
    const where = filter !== '' ? "Herramientas.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.HerramientasService.listaSelAll(0, 20, where);
  }

  addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true;
        return this._filterCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varHerramientas = result.Herramientass;
      this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = false;
      this.searchCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted = true;
      this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.varHerramientas.length === 0 ? '' : this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
    });
  }
  public selectN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Reporte.setValue(event.option.value);
    this.displayFnN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(element);
  }

  displayFnN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    return this.SelectedN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
  }
  updateOptionN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    this.SelectedN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(filter: any): Observable<Crear_Reporte> {
    const where = filter !== '' ? "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';
    return this.Crear_ReporteService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true;
        return this._filterN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = false;
      this.searchN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted = true;
      this.SelectedN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedN_Reporte_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
    });
  }
  public selectN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_de_OT.setValue(event.option.value);
    this.displayFnN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(element);
  }

  displayFnN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    return this.SelectedN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
  }
  updateOptionN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    this.SelectedN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(filter: any): Observable<Orden_de_Trabajo> {
    const where = filter !== '' ? "Orden_de_Trabajo.numero_de_orden like '%" + filter + "%'" : '';
    return this.Orden_de_TrabajoService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true;
        return this._filterN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varOrden_de_Trabajo = result.Orden_de_Trabajos;
      this.isLoadingN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = false;
      this.searchN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted = true;
      this.SelectedN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.varOrden_de_Trabajo.length === 0 ? '' : this.SelectedN_de_OT_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
    });
  }
  public selectMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Matricula.setValue(event.option.value);
    this.displayFnMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(element);
  }

  displayFnMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    return this.SelectedMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
  }
  updateOptionMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    this.SelectedMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(filter: any): Observable<Aeronave> {
    const where = filter !== '' ? "Aeronave.Matricula like '%" + filter + "%'" : '';
    return this.AeronaveService.listaSelAll(0, 20, where);
  }

  addFilterToControlMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true;
        return this._filterMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = false;
      this.searchMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted = true;
      this.SelectedMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.varAeronave.length === 0 ? '' : this.SelectedMatricula_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
    });
  }
  public selectModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(element);
  }

  displayFnModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    return this.SelectedModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
  }
  updateOptionModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    this.SelectedModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(filter: any): Observable<Modelos> {
    const where = filter !== '' ? "Modelos.Descripcion like '%" + filter + "%'" : '';
    return this.ModelosService.listaSelAll(0, 20, where);
  }

  addFilterToControlModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true;
        return this._filterModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = false;
      this.searchModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted = true;
      this.SelectedModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
    });
  }
  public selectUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacion_de_mantenimientoForm.controls.Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad.setValue(event.option.value);
    this.displayFnUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(element);
  }

  displayFnUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    return this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
  }
  updateOptionUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceSolicitud_de_Herramientas.data.indexOf(element);
    this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = true;
        return this._filterUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion = false;
      this.searchUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacionCompleted = true;
      this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion[index];
    });
  }

  //#endregion


  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Gestion_de_aprobacion_de_mantenimientoForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.UrgenciaService.getAll());
    observablesArray.push(this.Existencia_solicitud_crear_reporteService.getAll());
    observablesArray.push(this.Estatus_de_SeguimientoService.getAll());
    observablesArray.push(this.Estatus_Gestion_AprobacionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varUrgencia, varExistencia_solicitud_crear_reporte, varEstatus_de_Seguimiento, varEstatus_Gestion_Aprobacion]) => {
          this.varUrgencia = varUrgencia;
          this.varExistencia_solicitud_crear_reporte = varExistencia_solicitud_crear_reporte;
          this.varEstatus_de_Seguimiento = varEstatus_de_Seguimiento;
          this.varEstatus_Gestion_Aprobacion = varEstatus_Gestion_Aprobacion;

          this.filterEstatus_de_Seguimiento();

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Gestion_de_aprobacion_de_mantenimientoForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.MatriculaSeleccion = value;
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

      if (this.MatriculaSeleccion != null && this.MatriculaSeleccion != "") {
        if (result.Aeronaves.length == 1 || this.operation == "Update") {
          this.Gestion_de_aprobacion_de_mantenimientoForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
        }
      }

      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Gestion_de_aprobacion_de_mantenimientoForm.get('Modelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingModelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.ModeloSeleccion = value;
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

      if (this.ModeloSeleccion != null && this.ModeloSeleccion != "") {
        if (result.Modeloss.length == 1 || this.operation == "Update") {
          this.Gestion_de_aprobacion_de_mantenimientoForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
        }
      }

      this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Gestion_de_aprobacion_de_mantenimientoForm.get('N_Reporte').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingN_Reporte = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.N_ReporteSeleccion = value;

        if (this.operation == "Update" || this.operation == "Consult") {
          if (typeof value === 'number') {
            return this.Crear_ReporteService.listaSelAll(0, 20, "Crear_Reporte.Folio = " + value);
          }
        }

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

      if (this.N_ReporteSeleccion != null && this.N_ReporteSeleccion != "") {
        if (result.Crear_Reportes.length == 1 || this.operation == "Update") {
          this.Gestion_de_aprobacion_de_mantenimientoForm.get('N_Reporte').setValue(result?.Crear_Reportes[0], { onlySelf: true, emitEvent: false });
        }
      }

      this.optionsN_Reporte = of(result?.Crear_Reportes);
    }, error => {
      this.isLoadingN_Reporte = false;
      this.hasOptionsN_Reporte = false;
      this.optionsN_Reporte = of([]);
    });
    this.Gestion_de_aprobacion_de_mantenimientoForm.get('Solicitante').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingSolicitante = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.SolicitanteSeleccion = value;
        if (!value) return this.Spartan_UserService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Spartan_UserService.listaSelAll(0, 20, '');
          return this.Spartan_UserService.listaSelAll(0, 20,
            "Spartan_User.Name like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Spartan_UserService.listaSelAll(0, 20,
          "Spartan_User.Name like '%" + value.Name.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingSolicitante = false;
      this.hasOptionsSolicitante = result?.Spartan_Users?.length > 0;

      if (this.SolicitanteSeleccion != null && this.SolicitanteSeleccion != "") {
        if (result.Spartan_Users.length == 1 || this.operation == "Update") {
          this.Gestion_de_aprobacion_de_mantenimientoForm.get('Solicitante').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
        }
      }

      this.optionsSolicitante = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingSolicitante = false;
      this.hasOptionsSolicitante = false;
      this.optionsSolicitante = of([]);
    });
    this.Gestion_de_aprobacion_de_mantenimientoForm.get('Departamento').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingDepartamento = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.DepartamentoSeleccion = value;
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

      if (this.DepartamentoSeleccion != null && this.DepartamentoSeleccion != "") {
        if (result.Departamentos.length == 1 || this.operation == "Update") {
          this.Gestion_de_aprobacion_de_mantenimientoForm.get('Departamento').setValue(result?.Departamentos[0], { onlySelf: true, emitEvent: false });
        }
      }

      this.optionsDepartamento = of(result?.Departamentos);
    }, error => {
      this.isLoadingDepartamento = false;
      this.hasOptionsDepartamento = false;
      this.optionsDepartamento = of([]);
    });


  }

  filterEstatus_de_Seguimiento() {
    this.varEstatus_de_Seguimiento = this.varEstatus_de_Seguimiento.filter(element => element["Folio"] == 3 || element["Folio"] == 4);
  }

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Urgencia': {
        this.UrgenciaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUrgencia = x.Urgencias;
        });
        break;
      }
      case 'Existencia_Almacen': {
        this.Existencia_solicitud_crear_reporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varExistencia_solicitud_crear_reporte = x.Existencia_solicitud_crear_reportes;
        });
        break;
      }
      case 'Aprobacion_de_mantenimiento': {
        this.Estatus_de_SeguimientoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Seguimiento = x.Estatus_de_Seguimientos;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_Gestion_AprobacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_Gestion_Aprobacion = x.Estatus_Gestion_Aprobacions;
        });
        break;
      }

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
  displayFnSolicitante(option: Spartan_User) {
    return option?.Name;
  }
  displayFnDepartamento(option: Departamento) {
    return option?.Nombre;
  }


  async save() {
    await this.saveData();

  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Gestion_de_aprobacion_de_mantenimientoForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Gestion_de_aprobacion_de_mantenimientoForm.get('Matricula').value?.Matricula;
      entity.Modelo = this.Gestion_de_aprobacion_de_mantenimientoForm.get('Modelo').value?.Clave;
      entity.N_Reporte = this.Gestion_de_aprobacion_de_mantenimientoForm.get('N_Reporte').value?.Folio;
      entity.Solicitante = this.Gestion_de_aprobacion_de_mantenimientoForm.get('Solicitante').value?.Id_User;
      entity.Departamento = this.Gestion_de_aprobacion_de_mantenimientoForm.get('Departamento').value?.Folio;
      entity.Fecha_de_solicitud = this.Gestion_de_aprobacion_de_mantenimientoForm.get('Fecha_de_solicitud')?.value;
      entity.Motivo_de_Cancelacion = this.Gestion_de_aprobacion_de_mantenimientoForm.get('Motivo_de_Cancelacion')?.value;

      if (this.model.Folio > 0) {
        await this.Gestion_de_aprobacion_de_mantenimientoService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Solicitud_de_Piezas(this.model.Folio);
        await this.saveDetalle_Solicitud_de_Servicios_Gestion_de_aprobacion(this.model.Folio);
        await this.saveDetalle_Solicitud_de_Materiales_Gestion_de_aprobacion(this.model.Folio);
        await this.saveDetalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        await this.rulesAfterSave();
      }
      else {
        await (this.Gestion_de_aprobacion_de_mantenimientoService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Solicitud_de_Piezas(id);
          await this.saveDetalle_Solicitud_de_Servicios_Gestion_de_aprobacion(id);
          await this.saveDetalle_Solicitud_de_Materiales_Gestion_de_aprobacion(id);
          await this.saveDetalle_Solicitud_de_Herramientas_Gestion_de_aprobacion(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          await this.rulesAfterSave();
        }));

      }

    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Gestion_de_aprobacion_de_mantenimientoForm.reset();
      this.model = new Gestion_de_aprobacion_de_mantenimiento(this.fb);
      this.Gestion_de_aprobacion_de_mantenimientoForm = this.model.buildFormGroup();
      this.dataSourceSolicitud_de_Piezas = new MatTableDataSource<Detalle_Solicitud_de_Piezas>();
      this.Solicitud_de_PiezasData = [];
      this.dataSourceSolicitud_de_Servicios = new MatTableDataSource<Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion>();
      this.Solicitud_de_ServiciosData = [];
      this.dataSourceSolicitud_de_Materiales = new MatTableDataSource<Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion>();
      this.Solicitud_de_MaterialesData = [];
      this.dataSourceSolicitud_de_Herramientas = new MatTableDataSource<Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion>();
      this.Solicitud_de_HerramientasData = [];

    } else {
      this.router.navigate(['views/Gestion_de_aprobacion_de_mantenimiento/add']);
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
    this.router.navigate(['/Gestion_de_aprobacion_de_mantenimiento/list/' + this.phase], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Matricula_ExecuteBusinessRules(): void {
    //Matricula_FieldExecuteBusinessRulesEnd
  }
  Modelo_ExecuteBusinessRules(): void {
    //Modelo_FieldExecuteBusinessRulesEnd
  }
  N_Reporte_ExecuteBusinessRules(): void {
    //N_Reporte_FieldExecuteBusinessRulesEnd
  }
  Solicitante_ExecuteBusinessRules(): void {
    //Solicitante_FieldExecuteBusinessRulesEnd
  }
  Departamento_ExecuteBusinessRules(): void {
    //Departamento_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_solicitud_ExecuteBusinessRules(): void {
    //Fecha_de_solicitud_FieldExecuteBusinessRulesEnd
  }
  Motivo_de_Cancelacion_ExecuteBusinessRules(): void {
    //Motivo_de_Cancelacion_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:3996 - Quitar requerido y deshabilitar campos pantalla principal Gestión de aprobacion de mantenimiento. - Autor: Administrador - Actualización: 7/12/2021 4:25:23 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Matricula");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Modelo");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Departamento");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "N_Reporte");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Solicitante");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Fecha_de_solicitud");
      this.brf.SetEnabledControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Modelo', 0);
      this.brf.SetEnabledControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Departamento', 0);
      this.brf.SetEnabledControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'N_Reporte', 0);
      this.brf.SetEnabledControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Solicitante', 0);
      this.brf.SetEnabledControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Fecha_de_solicitud', 0);
    }
    //TERMINA - BRID:3996


    //INICIA - BRID:4123 - Ocultar Folio gestión de aprobación - Autor: Administrador - Actualización: 7/14/2021 10:59:16 AM
    this.brf.HideFieldOfForm(this.Gestion_de_aprobacion_de_mantenimientoForm, "Folio");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Folio");
    //TERMINA - BRID:4123


    //INICIA - BRID:4925 - Ocultar campos en MR's Gestion_de_aprobacion_de_mantenimiento - Autor: Agustín Administrador - Actualización: 8/9/2021 1:13:40 PM
    this.brf.HideFieldofMultirenglon(this.Solicitud_de_PiezasColumns, "FolioDetalleSolicitudPartes");
    this.brf.HideFieldofMultirenglon(this.Solicitud_de_ServiciosColumns, "FolioDetalleSolicitudServicios");
    this.brf.HideFieldofMultirenglon(this.Solicitud_de_MaterialesColumns, "FolioDetalleSolicitudMateriales");
    this.brf.HideFieldofMultirenglon(this.Solicitud_de_HerramientasColumns, "FolioDetalleSolicitudHerramientas");
    //TERMINA - BRID:4925


    //INICIA - BRID:5446 - ocultar estatus de aprobacion - Autor: Aaron - Actualización: 8/25/2021 8:27:28 PM
    this.brf.HideFieldOfForm(this.Gestion_de_aprobacion_de_mantenimientoForm, "Estatus");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Estatus");
    //TERMINA - BRID:5446


    //INICIA - BRID:5447 - Asignar estatus 1 por defaul - Autor: Aaron - Actualización: 8/25/2021 8:28:42 PM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Estatus", "1");
    }
    //TERMINA - BRID:5447


    //INICIA - BRID:6518 - Ocultar campo motivo de rechazo si el estatus es diferente a cancelada - Autor: Lizeth Villa - Actualización: 9/27/2021 1:50:01 PM
    if (this.brf.GetValueByControlType(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Estatus') != this.brf.TryParseInt('4', '4')) {
      this.brf.HideFieldOfForm(this.Gestion_de_aprobacion_de_mantenimientoForm, "Motivo_de_Cancelacion");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Motivo_de_Cancelacion");
    }
    //TERMINA - BRID:6518


    //INICIA - BRID:6519 - Asignar no requerido y desabilitado siempre a campo motivo de rechazo - Autor: Lizeth Villa - Actualización: 9/27/2021 1:54:42 PM
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Motivo_de_Cancelacion");
    this.brf.SetEnabledControl(this.Gestion_de_aprobacion_de_mantenimientoForm, 'Motivo_de_Cancelacion', 0);
    //TERMINA - BRID:6519


    //INICIA - BRID:7203 - WF:13 Rule - Phase: 4 (Canceladas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == this.brf.TryParseInt('4', '4')) {
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Folio");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Matricula");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Modelo");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Departamento");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "N_Reporte");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Solicitante");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Fecha_de_solicitud");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Estatus");
      this.brf.SetNotRequiredControl(this.Gestion_de_aprobacion_de_mantenimientoForm, "Motivo_de_Cancelacion");
    }
    //TERMINA - BRID:7203

    //rulesOnInit_ExecuteBusinessRulesEnd


  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:5443 - CAMBIAR ESTATUS crear - Autor: Aaron - Actualización: 8/25/2021 8:52:52 PM
    if (this.operation == 'New') {
      await this.brf.EvaluaQueryAsync(` Exec  Update_Estatus_Gestion_Aprobacion '${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}'`, 1, "ABC123");
    }
    //TERMINA - BRID:5443


    //INICIA - BRID:5444 - CAMBIAR ESTATUS AL Editar - Autor: Aaron - Actualización: 8/25/2021 8:59:14 PM
    if (this.operation == 'Update') {
      await this.brf.EvaluaQueryAsync(`EXEC Update_Estatus_Gestion_Aprobacion '${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}'`, 1, "ABC123");
    }
    //TERMINA - BRID:5444

    //rulesAfterSave_ExecuteBusinessRulesEnd
    setTimeout(() => {
      this.successSave()
    }, 2500);
  }

  successSave() {
    this.isLoading = false;
    this.spinner.hide('loading');

    this.snackBar.open('Registro guardado con éxito', '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'success'
    });
    this.goToList();
  }


  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    // if(  this.operation == 'Update' ) {
    //   if(this.Gestion_de_aprobacion_de_mantenimientoForm.get('Estatus').value == 1) {
    //     this.Gestion_de_aprobacion_de_mantenimientoForm.get('Estatus').setValue(2);
    //     return true;
    //   }

    //   if(this.Gestion_de_aprobacion_de_mantenimientoForm.get('Estatus').value == 2) {
    //     this.Gestion_de_aprobacion_de_mantenimientoForm.get('Estatus').setValue(3);
    //     return true;
    //   }
    // }

    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas

}
