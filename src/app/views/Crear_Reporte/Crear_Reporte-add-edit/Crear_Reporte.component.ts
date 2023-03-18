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
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_servicioService } from 'src/app/api-services/Orden_de_servicio.service';
import { Orden_de_servicio } from 'src/app/models/Orden_de_servicio';
import { Tipo_orden_de_servicioService } from 'src/app/api-services/Tipo_orden_de_servicio.service';
import { Tipo_orden_de_servicio } from 'src/app/models/Tipo_orden_de_servicio';
import { Prioridad_del_ReporteService } from 'src/app/api-services/Prioridad_del_Reporte.service';
import { Prioridad_del_Reporte } from 'src/app/models/Prioridad_del_Reporte';
import { Tipo_de_Orden_de_TrabajoService } from 'src/app/api-services/Tipo_de_Orden_de_Trabajo.service';
import { Tipo_de_Orden_de_Trabajo } from 'src/app/models/Tipo_de_Orden_de_Trabajo';
import { Estatus_de_ReporteService } from 'src/app/api-services/Estatus_de_Reporte.service';
import { Estatus_de_Reporte } from 'src/app/models/Estatus_de_Reporte';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Tipo_de_origen_del_reporteService } from 'src/app/api-services/Tipo_de_origen_del_reporte.service';
import { Tipo_de_origen_del_reporte } from 'src/app/models/Tipo_de_origen_del_reporte';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Tipo_de_ReporteService } from 'src/app/api-services/Tipo_de_Reporte.service';
import { Tipo_de_Reporte } from 'src/app/models/Tipo_de_Reporte';
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { Detalle_Solicitud_de_Partes_Crear_reporteService } from 'src/app/api-services/Detalle_Solicitud_de_Partes_Crear_reporte.service';
import { Detalle_Solicitud_de_Partes_Crear_reporte } from 'src/app/models/Detalle_Solicitud_de_Partes_Crear_reporte';
import { PartesService } from 'src/app/api-services/Partes.service';
import { Partes } from 'src/app/models/Partes';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { UrgenciaService } from 'src/app/api-services/Urgencia.service';
import { Urgencia } from 'src/app/models/Urgencia';
import { Existencia_solicitud_crear_reporteService } from 'src/app/api-services/Existencia_solicitud_crear_reporte.service';
import { Existencia_solicitud_crear_reporte } from 'src/app/models/Existencia_solicitud_crear_reporte';

import { Detalle_Solicitud_de_Servicios_Crear_reporteService } from 'src/app/api-services/Detalle_Solicitud_de_Servicios_Crear_reporte.service';
import { Detalle_Solicitud_de_Servicios_Crear_reporte } from 'src/app/models/Detalle_Solicitud_de_Servicios_Crear_reporte';
import { Catalogo_serviciosService } from 'src/app/api-services/Catalogo_servicios.service';
import { Catalogo_servicios } from 'src/app/models/Catalogo_servicios';

import { Detalle_Solicitud_de_Materiales_Crear_reporteService } from 'src/app/api-services/Detalle_Solicitud_de_Materiales_Crear_reporte.service';
import { Detalle_Solicitud_de_Materiales_Crear_reporte } from 'src/app/models/Detalle_Solicitud_de_Materiales_Crear_reporte';
import { Listado_de_MaterialesService } from 'src/app/api-services/Listado_de_Materiales.service';
import { Listado_de_Materiales } from 'src/app/models/Listado_de_Materiales';

import { Detalle_Solicitud_de_Herramientas_Crear_reporteService } from 'src/app/api-services/Detalle_Solicitud_de_Herramientas_Crear_reporte.service';
import { Detalle_Solicitud_de_Herramientas_Crear_reporte } from 'src/app/models/Detalle_Solicitud_de_Herramientas_Crear_reporte';
import { HerramientasService } from 'src/app/api-services/Herramientas.service';
import { Herramientas } from 'src/app/models/Herramientas';

import { Detalle_de_Remocion_de_piezasService } from 'src/app/api-services/Detalle_de_Remocion_de_piezas.service';
import { Detalle_de_Remocion_de_piezas } from 'src/app/models/Detalle_de_Remocion_de_piezas';
import { Detalle_Parte_Asociada_al_Componente_AeronaveService } from 'src/app/api-services/Detalle_Parte_Asociada_al_Componente_Aeronave.service';
import { Detalle_Parte_Asociada_al_Componente_Aeronave } from 'src/app/models/Detalle_Parte_Asociada_al_Componente_Aeronave';
import { Estatus_de_remocionService } from 'src/app/api-services/Estatus_de_remocion.service';
import { Estatus_de_remocion } from 'src/app/models/Estatus_de_remocion';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Causa_de_remocionService } from 'src/app/api-services/Causa_de_remocion.service';
import { Causa_de_remocion } from 'src/app/models/Causa_de_remocion';
import { Tiempo_de_remocionService } from 'src/app/api-services/Tiempo_de_remocion.service';
import { Tiempo_de_remocion } from 'src/app/models/Tiempo_de_remocion';

import { Detalle_de_Instalacion_de_piezasService } from 'src/app/api-services/Detalle_de_Instalacion_de_piezas.service';
import { Detalle_de_Instalacion_de_piezas } from 'src/app/models/Detalle_de_Instalacion_de_piezas';
import { Tipos_de_Origen_del_ComponenteService } from 'src/app/api-services/Tipos_de_Origen_del_Componente.service';
import { Tipos_de_Origen_del_Componente } from 'src/app/models/Tipos_de_Origen_del_Componente';
import { Catalogo_Tipo_de_VencimientoService } from 'src/app/api-services/Catalogo_Tipo_de_Vencimiento.service';
import { Catalogo_Tipo_de_Vencimiento } from 'src/app/models/Catalogo_Tipo_de_Vencimiento';

import { Detalle_tiempo_ejecutantes_crear_reporteService } from 'src/app/api-services/Detalle_tiempo_ejecutantes_crear_reporte.service';
import { Detalle_tiempo_ejecutantes_crear_reporte } from 'src/app/models/Detalle_tiempo_ejecutantes_crear_reporte';

import { Ayuda_de_respuesta_crear_reporteService } from 'src/app/api-services/Ayuda_de_respuesta_crear_reporte.service';
import { Ayuda_de_respuesta_crear_reporte } from 'src/app/models/Ayuda_de_respuesta_crear_reporte';
import { Resultado_aprobacion_crear_reporteService } from 'src/app/api-services/Resultado_aprobacion_crear_reporte.service';
import { Resultado_aprobacion_crear_reporte } from 'src/app/models/Resultado_aprobacion_crear_reporte';

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
import { q } from 'src/app/models/business-rules/business-rule-query.model';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-Crear_Reporte',
  templateUrl: './Crear_Reporte.component.html',
  styleUrls: ['./Crear_Reporte.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Crear_ReporteComponent implements OnInit, AfterViewInit {
MRaddEjecutantes: boolean = false;
MRaddInstalacion: boolean = false;
MRaddRemocion: boolean = false;
MRaddSolicitud_de_herramientas: boolean = false;
MRaddSolicitud_de_materiales: boolean = false;
MRaddSolicitud_de_servicios: boolean = false;
MRaddSolicitud_de_partes: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  //Botones
  ButtonSaveSolicitud_de_partes: boolean = true;
  ButtonSaveSolicitud_de_servicio: boolean = true;
  ButtonSaveSolicitud_de_materiales: boolean = true;
  ButtonSaveSolicitud_de_herramientas: boolean = true;

  Crear_ReporteForm: FormGroup;
  public Editor = ClassicEditor;
  model: Crear_Reporte;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsN_Orden_de_Trabajo: Observable<Orden_de_Trabajo[]>;
  hasOptionsN_Orden_de_Trabajo: boolean;
  isLoadingN_Orden_de_Trabajo: boolean;
  optionsNo__de_Orden_de_Servicio: Observable<Orden_de_servicio[]>;
  hasOptionsNo__de_Orden_de_Servicio: boolean;
  isLoadingNo__de_Orden_de_Servicio: boolean;
  public varTipo_orden_de_servicio: Tipo_orden_de_servicio[] = [];
  public varPrioridad_del_Reporte: Prioridad_del_Reporte[] = [];
  public varTipo_de_Orden_de_Trabajo: Tipo_de_Orden_de_Trabajo[] = [];
  public varEstatus_de_Reporte: Estatus_de_Reporte[] = [];

  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  public varTipo_de_origen_del_reporte: Tipo_de_origen_del_reporte[] = [];
  optionsCodigo_computarizado_Descripcion: Observable<Codigo_Computarizado[]>;
  hasOptionsCodigo_computarizado_Descripcion: boolean;
  isLoadingCodigo_computarizado_Descripcion: boolean;
  public varTipo_de_Reporte: Tipo_de_Reporte[] = [];
  optionsCodigo_ATA: Observable<Catalogo_codigo_ATA[]>;
  hasOptionsCodigo_ATA: boolean;
  isLoadingCodigo_ATA: boolean;
  public varPartes: Partes[] = [];
  public varUnidad: Unidad[] = [];
  public varUrgencia: Urgencia[] = [];
  public varExistencia_solicitud_crear_reporte: Existencia_solicitud_crear_reporte[] = [];

  autoN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte = new FormControl();
  SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte: string[] = [];
  isLoadingN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte: boolean;
  searchN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporteCompleted: boolean;
  autoUnidad_Detalle_Solicitud_de_Partes_Crear_reporte = new FormControl();
  SelectedUnidad_Detalle_Solicitud_de_Partes_Crear_reporte: string[] = [];
  isLoadingUnidad_Detalle_Solicitud_de_Partes_Crear_reporte: boolean;
  searchUnidad_Detalle_Solicitud_de_Partes_Crear_reporteCompleted: boolean;

  public varCatalogo_servicios: Catalogo_servicios[] = [];

  autoN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte = new FormControl();
  SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte: string[] = [];
  isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte: boolean;
  searchN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporteCompleted: boolean;
  autoUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte = new FormControl();
  SelectedUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte: string[] = [];
  isLoadingUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte: boolean;
  searchUnidad_Detalle_Solicitud_de_Servicios_Crear_reporteCompleted: boolean;

  public varListado_de_Materiales: Listado_de_Materiales[] = [];

  autoCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte = new FormControl();
  SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte: string[] = [];
  isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte: boolean;
  searchCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporteCompleted: boolean;
  autoUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte = new FormControl();
  SelectedUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte: string[] = [];
  isLoadingUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte: boolean;
  searchUnidad_Detalle_Solicitud_de_Materiales_Crear_reporteCompleted: boolean;

  public varHerramientas: Herramientas[] = [];

  autoCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte = new FormControl();
  SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte: string[] = [];
  isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte: boolean;
  searchCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporteCompleted: boolean;
  autoUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte = new FormControl();
  SelectedUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte: string[] = [];
  isLoadingUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte: boolean;
  searchUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporteCompleted: boolean;

  public varDetalle_Parte_Asociada_al_Componente_Aeronave: Detalle_Parte_Asociada_al_Componente_Aeronave[] = [];
  public varEstatus_de_remocion: Estatus_de_remocion[] = [];
  public varSpartan_User: Spartan_User[] = [];
  public varCausa_de_remocion: Causa_de_remocion[] = [];
  public varTiempo_de_remocion: Tiempo_de_remocion[] = [];

  autoN_de_Parte_Detalle_de_Remocion_de_piezas = new FormControl();
  SelectedN_de_Parte_Detalle_de_Remocion_de_piezas: string[] = [];
  isLoadingN_de_Parte_Detalle_de_Remocion_de_piezas: boolean;
  searchN_de_Parte_Detalle_de_Remocion_de_piezasCompleted: boolean;
  autoEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas = new FormControl();
  SelectedEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas: string[] = [];
  isLoadingEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas: boolean;
  searchEncargado_de_la_remocion_Detalle_de_Remocion_de_piezasCompleted: boolean;

  public varTipos_de_Origen_del_Componente: Tipos_de_Origen_del_Componente[] = [];
  public varCatalogo_Tipo_de_Vencimiento: Catalogo_Tipo_de_Vencimiento[] = [];

  autoN_Parte_Detalle_de_Instalacion_de_piezas = new FormControl();
  SelectedN_Parte_Detalle_de_Instalacion_de_piezas: string[] = [];
  isLoadingN_Parte_Detalle_de_Instalacion_de_piezas: boolean;
  searchN_Parte_Detalle_de_Instalacion_de_piezasCompleted: boolean;
  autoEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas = new FormControl();
  SelectedEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas: string[] = [];
  isLoadingEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas: boolean;
  searchEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezasCompleted: boolean;


  autoEjecutante_Detalle_tiempo_ejecutantes_crear_reporte = new FormControl();
  SelectedEjecutante_Detalle_tiempo_ejecutantes_crear_reporte: string[] = [];
  isLoadingEjecutante_Detalle_tiempo_ejecutantes_crear_reporte: boolean;
  searchEjecutante_Detalle_tiempo_ejecutantes_crear_reporteCompleted: boolean;

  optionsRespondiente_resp: Observable<Spartan_User[]>;
  hasOptionsRespondiente_resp: boolean;
  isLoadingRespondiente_resp: boolean;
  public varAyuda_de_respuesta_crear_reporte: Ayuda_de_respuesta_crear_reporte[] = [];
  optionsSupervisor: Observable<Spartan_User[]>;
  hasOptionsSupervisor: boolean;
  isLoadingSupervisor: boolean;
  public varResultado_aprobacion_crear_reporte: Resultado_aprobacion_crear_reporte[] = [];
  optionsInspector: Observable<Spartan_User[]>;
  hasOptionsInspector: boolean;
  isLoadingInspector: boolean;
  optionsProgramador_de_mantenimiento: Observable<Spartan_User[]>;
  hasOptionsProgramador_de_mantenimiento: boolean;
  isLoadingProgramador_de_mantenimiento: boolean;

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('PaginadorRemocion', { read: MatPaginator }) paginadorRemocion: MatPaginator;
  @ViewChild('PaginadorInstalacion', { read: MatPaginator }) paginadorInstalacion: MatPaginator;
  @ViewChild('PaginadorPartes', { read: MatPaginator }) paginadorPartes: MatPaginator;
  @ViewChild('PaginadorServicios', { read: MatPaginator }) paginadorServicios: MatPaginator;
  @ViewChild('PaginadorMateriales', { read: MatPaginator }) paginadorMateriales: MatPaginator;
  @ViewChild('PaginadorHerramientas', { read: MatPaginator }) paginadorHerramientas: MatPaginator;
  @ViewChild('PaginadorEjecutantes', { read: MatPaginator }) paginadorEjecutantes: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  dataSourceSolicitud_de_partes = new MatTableDataSource<Detalle_Solicitud_de_Partes_Crear_reporte>();
  Solicitud_de_partesColumns = [
    { def: 'actions', hide: false },
    { def: 'N_Parte_Descripcion', hide: false },
    { def: 'Horas_del_Componente_a_Remover', hide: false },
    { def: 'Ciclos_del_componente_a_Remover', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Razon_de_Solicitud', hide: false },
    { def: 'Condicion_de_la_Parte', hide: false },
    { def: 'En_Existencia', hide: false },

  ];
  Solicitud_de_partesData: Detalle_Solicitud_de_Partes_Crear_reporte[] = [];

  dataSourceSolicitud_de_servicios = new MatTableDataSource<Detalle_Solicitud_de_Servicios_Crear_reporte>();
  Solicitud_de_serviciosColumns = [
    { def: 'actions', hide: false },
    { def: 'N_Servicio_Descripcion', hide: false },
    { def: 'Fecha_Estimada_del_Mtto', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Razon_de_Solicitud', hide: false },
    { def: 'En_Existencia', hide: false },

  ];
  Solicitud_de_serviciosData: Detalle_Solicitud_de_Servicios_Crear_reporte[] = [];

  dataSourceSolicitud_de_materiales = new MatTableDataSource<Detalle_Solicitud_de_Materiales_Crear_reporte>();
  Solicitud_de_materialesColumns = [
    { def: 'actions', hide: false },
    { def: 'Codigo_Descripcion', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Razon_de_Solicitud', hide: false },
    { def: 'En_Existencia', hide: false },

  ];
  Solicitud_de_materialesData: Detalle_Solicitud_de_Materiales_Crear_reporte[] = [];

  dataSourceSolicitud_de_herramientas = new MatTableDataSource<Detalle_Solicitud_de_Herramientas_Crear_reporte>();
  Solicitud_de_herramientasColumns = [
    { def: 'actions', hide: false },
    { def: 'Codigo_Descripcion', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Razon_de_Solicitud', hide: false },
    { def: 'En_Existencia', hide: false },

  ];
  Solicitud_de_herramientasData: Detalle_Solicitud_de_Herramientas_Crear_reporte[] = [];

  dataSourceRemocion = new MatTableDataSource<Detalle_de_Remocion_de_piezas>();
  RemocionColumns = [
    { def: 'actions', hide: false },
    { def: 'N_de_Parte', hide: false },
    { def: 'N_de_Serie', hide: false },
    { def: 'Estatus', hide: false },
    { def: 'Horas_Actuales', hide: false },
    { def: 'Ciclos_Actuales', hide: false },
    { def: 'Fecha_de_Remocion', hide: false },
    { def: 'Encargado_de_la_remocion', hide: false },
    { def: 'Causa_de_remocion', hide: false },
    { def: 'Tiempo_de_remocion', hide: false },

  ];
  RemocionData: Detalle_de_Remocion_de_piezas[] = [];

  dataSourceInstalacion = new MatTableDataSource<Detalle_de_Instalacion_de_piezas>();
  InstalacionColumns = [
    { def: 'actions', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'N_Parte', hide: false },
    { def: 'N_de_serie', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Posicion', hide: false },
    { def: 'Horas_acumuladas_parte', hide: false },
    { def: 'Ciclos_acumulados_parte', hide: false },
    { def: 'Fecha_de_Fabricacion', hide: false },
    { def: 'Meses_Acumulados_Parte', hide: false },
    { def: 'Fecha_de_Reparacion', hide: false },
    { def: 'Fecha_de_Instalacion', hide: false },
    { def: 'Encargado_de_la_instalacion', hide: false },
    { def: 'Tipo_de_Vencimiento', hide: false },
    { def: 'Limite_de_Horas', hide: false },
    { def: 'Limite_de_Ciclos', hide: false },
    { def: 'Limite_de_Meses', hide: false },
    { def: 'Estatus_de_remocion', hide: false },

  ];
  InstalacionData: Detalle_de_Instalacion_de_piezas[] = [];

  dataSourceEjecutantes = new MatTableDataSource<Detalle_tiempo_ejecutantes_crear_reporte>();
  EjecutantesColumns = [
    { def: 'actions', hide: false },
    { def: 'Ejecutante', hide: false },
    { def: 'Fecha', hide: false },
    { def: 'Hora_inicial', hide: false },
    { def: 'Hora_final', hide: false },
    { def: 'Tiempo_ejecucion_en_hrs', hide: false },
    { def: 'Motivo_de_pausa', hide: false },

  ];
  EjecutantesData: Detalle_tiempo_ejecutantes_crear_reporte[] = [];

  today = new Date;
  consult: boolean = false;
  inicio: number = 0;
  pausa: number = 0;
  resume: number = 0;
  timeout: any = 0;
  tiempoInicial: string = '';
  hr: number = 0;
  mm: number = 0;
  ss: number = 0;
  tiempototal: string = '0';
  varMotivos: Tipo_de_Reporte[] = [];
  motivoClave: string = undefined;
  NoOrdenServicioEditar: any = null;
  CodigocomputarizadoDescripcion: any = null;
  CodigoATA: any = null;
  EstatusEditarConsulta: any = null;
  NodeOrdendeServicio: any = null;
  MatriculaSeleccionada: any = null;
  SupervisorEditar: any = null;
  InspectorEditar: any = null;
  ProgramadorEditar: any = null;
  NOrdenDeTrabajo: any = null;
  botonAddInstalacionDisabled: boolean = false;
  botonIniciarDisabled: boolean = false;
  botonPausarDisabled: boolean = false;
  botonReanudarDisabled: boolean = false;
  botonDetenerDisabled: boolean = false;
  UsuarioRespondiente: any = null;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Crear_ReporteService: Crear_ReporteService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Orden_de_servicioService: Orden_de_servicioService,
    private Tipo_orden_de_servicioService: Tipo_orden_de_servicioService,
    private Prioridad_del_ReporteService: Prioridad_del_ReporteService,
    private Tipo_de_Orden_de_TrabajoService: Tipo_de_Orden_de_TrabajoService,
    private Estatus_de_ReporteService: Estatus_de_ReporteService,
    private AeronaveService: AeronaveService,
    private Tipo_de_origen_del_reporteService: Tipo_de_origen_del_reporteService,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,
    private Tipo_de_ReporteService: Tipo_de_ReporteService,
    private Catalogo_codigo_ATAService: Catalogo_codigo_ATAService,
    private Detalle_Solicitud_de_Partes_Crear_reporteService: Detalle_Solicitud_de_Partes_Crear_reporteService,
    private PartesService: PartesService,
    private UnidadService: UnidadService,
    private UrgenciaService: UrgenciaService,
    private Existencia_solicitud_crear_reporteService: Existencia_solicitud_crear_reporteService,

    private Detalle_Solicitud_de_Servicios_Crear_reporteService: Detalle_Solicitud_de_Servicios_Crear_reporteService,
    private Catalogo_serviciosService: Catalogo_serviciosService,

    private Detalle_Solicitud_de_Materiales_Crear_reporteService: Detalle_Solicitud_de_Materiales_Crear_reporteService,
    private Listado_de_MaterialesService: Listado_de_MaterialesService,

    private Detalle_Solicitud_de_Herramientas_Crear_reporteService: Detalle_Solicitud_de_Herramientas_Crear_reporteService,
    private HerramientasService: HerramientasService,

    private Detalle_de_Remocion_de_piezasService: Detalle_de_Remocion_de_piezasService,
    private Detalle_Parte_Asociada_al_Componente_AeronaveService: Detalle_Parte_Asociada_al_Componente_AeronaveService,
    private Estatus_de_remocionService: Estatus_de_remocionService,
    private Spartan_UserService: Spartan_UserService,
    private Causa_de_remocionService: Causa_de_remocionService,
    private Tiempo_de_remocionService: Tiempo_de_remocionService,

    private Detalle_de_Instalacion_de_piezasService: Detalle_de_Instalacion_de_piezasService,
    private Tipos_de_Origen_del_ComponenteService: Tipos_de_Origen_del_ComponenteService,
    private Catalogo_Tipo_de_VencimientoService: Catalogo_Tipo_de_VencimientoService,

    private Detalle_tiempo_ejecutantes_crear_reporteService: Detalle_tiempo_ejecutantes_crear_reporteService,

    private Ayuda_de_respuesta_crear_reporteService: Ayuda_de_respuesta_crear_reporteService,
    private Resultado_aprobacion_crear_reporteService: Resultado_aprobacion_crear_reporteService,

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
    private modalService: NgbModal,
    renderer: Renderer2) {
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Crear_Reporte(this.fb);
    this.Crear_ReporteForm = this.model.buildFormGroup();
    this.Solicitud_de_partesItems.removeAt(0);
    this.Solicitud_de_serviciosItems.removeAt(0);
    this.Solicitud_de_materialesItems.removeAt(0);
    this.Solicitud_de_herramientasItems.removeAt(0);
    this.RemocionItems.removeAt(0);
    this.InstalacionItems.removeAt(0);
    this.EjecutantesItems.removeAt(0);

    this.Crear_ReporteForm.get('Folio').disable();
    this.Crear_ReporteForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  getCountRemocion(): number {
    return this.dataSourceRemocion.data.length;
  }

  getCountInstalacion(): number {
    return this.dataSourceInstalacion.data.length;
  }

  getCountPartes(): number {
    return this.dataSourceSolicitud_de_partes.data.length;
  }

  getCountServicios(): number {
    return this.dataSourceSolicitud_de_servicios.data.length;
  }

  getCountMateriales(): number {
    return this.dataSourceSolicitud_de_materiales.data.length;
  }

  getCountHerramientas(): number {
    return this.dataSourceSolicitud_de_herramientas.data.length;
  }

  getCountEjecutantes(): number {
    return this.dataSourceEjecutantes.data.length;
  }

  onTabChanged(event) {
    if (event.tab.ariaLabel == 'Respuesta_del_reporte') {
      if (this.operation == 'Consult') {
        this.botonIniciarDisabled = true;
        this.botonPausarDisabled = true;
        this.botonReanudarDisabled = true;
        this.botonDetenerDisabled = true;
      }
      if (this.operation == 'Update') {
        this.rulesOnInit();
      }
      if (this.operation == 'New') {
        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25')) {
          this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_total_de_ejecucion");
          this.brf.SetEnabledControl(this.Crear_ReporteForm, "Tiempo_total_de_ejecucion", 0);

          this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_resp");
          this.brf.SetEnabledControl(this.Crear_ReporteForm, "Fecha_resp", 0);

          this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_resp");
          this.brf.SetEnabledControl(this.Crear_ReporteForm, "Hora_resp", 0);

          this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Respondiente_resp");
          this.brf.SetEnabledControl(this.Crear_ReporteForm, "Respondiente_resp", 0);

          this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ayuda_de_respuesta_resp");
          this.brf.SetEnabledControl(this.Crear_ReporteForm, "Ayuda_de_respuesta_resp", 0);

          this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Respuesta_resp");
          this.brf.SetEnabledControl(this.Crear_ReporteForm, "Respuesta_resp", 0);
        }
      }
    }
    if (event.tab.ariaLabel == 'Autorizacion_del_supervisor') {
      if (this.operation == 'Update') {
        this.rulesOnInit();
      }
    }
    if (event.tab.ariaLabel == 'Autorizacion_del_inspector') {
      if (this.operation == 'Update') {
        this.rulesOnInit();
      }
    }
    if (event.tab.ariaLabel == 'Autorizacion_del_programador') {
      if (this.operation == 'Update') {
        this.rulesOnInit();
      }
    }
  }

  //Open Modal
  async OpenModalPausar(content) {

    this.botonIniciarDisabled = true;
    this.botonPausarDisabled = true;
    this.botonDetenerDisabled = true;
    this.botonReanudarDisabled = false;

    let motivos = await this.brf.EvaluaQueryStringDictionaryAsync("select cac.Clave,cac.Descripcion from dbo.Catalogo_Actividades_de_Colaboradores cac", 1, "ABC123");
    this.varMotivos = motivos;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
      },
      (reason) => {
      },
    );
  }

  CancelOpenModalPausar() {
    this.modalService.dismissAll();

    this.botonIniciarDisabled = true;
    this.botonPausarDisabled = false;
    this.botonDetenerDisabled = false;
    this.botonReanudarDisabled = true;
  }

  Motivos_ExecuteBusinessRules(option) {
    this.motivoClave = option.value;
  }

  async pausar() {
    let tiempoPausa = new Date();
    this.pausa = tiempoPausa.getTime();
    let horaPausa = this.addZero(tiempoPausa.getHours()) + ':' + this.addZero(tiempoPausa.getMinutes());
    let matrizCronoPausasPrev = JSON.parse(localStorage.getItem('matrizCronoPausas' + this.model.Folio));

    if (matrizCronoPausasPrev === null) {
      let matrizCronoPausas = [{
        report: this.model.Folio,
        pause: this.pausa,
        timePause: tiempoPausa,
        hourPause: horaPausa
      }];
      localStorage.setItem('matrizCronoPausas' + this.model.Folio, JSON.stringify(matrizCronoPausas));
    }
    else {
      for (var d = 0; d < matrizCronoPausasPrev.length; d++) {
        if (matrizCronoPausasPrev[d].report === this.model.Folio) {
          matrizCronoPausasPrev.slice(d, 1);
        }
      }
      matrizCronoPausasPrev.push({
        report: this.model.Folio,
        pause: this.pausa,
        timePause: tiempoPausa,
        hourPause: horaPausa
      });
      localStorage.setItem('matrizCronoPausas' + this.model.Folio, JSON.stringify(matrizCronoPausasPrev));
    }
    await this.brf.EvaluaQueryAsync(` exec sp_InformacionConteo 4, ${this.model.Folio} , 0, ${this.localStorageHelper.getItemFromLocalStorage('USERID')} `, 1, "ABC123");
    clearTimeout(this.timeout);
  }

  addZero(time: number) {
    return (time < 10) ? "0" + time : + time;
  }

  async empezar(): Promise<void> {
    if (this.timeout == 0) {

      this.botonIniciarDisabled = true;
      this.botonReanudarDisabled = true;

      this.botonPausarDisabled = false;
      this.botonDetenerDisabled = false;

      await this.brf.EvaluaQueryAsync("exec sp_InformacionConteo 2, " + this.model.Folio + ", 0, " + this.localStorageHelper.getItemFromLocalStorage('USERID'), 1, 'ABC123');
      this.tiempoInicial = await this.brf.EvaluaQueryAsync(`exec uspIniciaTimer ${this.model.Folio}`, 1, 'ABC123');
      this.hr = parseInt(this.tiempoInicial.split(':')[0]);
      this.mm = parseInt(this.tiempoInicial.split(':')[1]);
      this.ss = parseInt(this.tiempoInicial.split(':')[2]);
      this.crono();
    }
  }

  crono(): void {
    this.timeout = setInterval(() => {
      if (this.ss == 60) {
        this.ss = 0;
        this.mm++;
        if (this.mm == 60) {
          this.mm = 0;
          this.hr++;
        }
      }
      this.ss++;
      let result = this.hr + ":" + this.mm + ":" + this.ss;
      document.getElementById('clock').innerHTML = result;

    }, 1000);
  }

  async reanudar(): Promise<void> {

    this.botonIniciarDisabled = true;
    this.botonReanudarDisabled = true;

    this.botonPausarDisabled = false;
    this.botonDetenerDisabled = false;

    await this.brf.EvaluaQueryAsync("exec sp_InformacionConteo 6, " + this.model.Folio + ", 0, " + this.localStorageHelper.getItemFromLocalStorage('USERID'), 1, 'ABC123');
    this.tiempoInicial = await this.brf.EvaluaQueryAsync(`exec uspIniciaTimer ${this.model.Folio} `, 1, 'ABC123');
    this.hr = parseInt(this.tiempoInicial.split(':')[0]);
    this.mm = parseInt(this.tiempoInicial.split(':')[1]);
    this.ss = parseInt(this.tiempoInicial.split(':')[2]);
    this.crono();
  }

  async GuardarMotivoPausa() {
    let motivo = this.motivoClave;
    if (motivo == undefined) {
      alert('Debe seleccionar un motivo de paro');
      return;
    }
    else {

      let motivoTexto = this.varMotivos.filter(x => x.Clave.toString() == this.motivoClave).length > 0 ? this.varMotivos.filter(x => x.Clave.toString() == this.motivoClave)[0].Description : "";

      clearTimeout(this.timeout);
      await this.brf.EvaluaQueryAsync("exec sp_InformacionConteo 4, " + this.model.Folio + ", 0, " + this.localStorageHelper.getItemFromLocalStorage('USERID'), 1, 'ABC123');
      await this.brf.EvaluaQueryAsync("exec uspGeneraHistorialTimer " + this.model.Folio + "," + this.localStorageHelper.getItemFromLocalStorage('USERID') + ",'" + motivoTexto + "'", 1, 'ABC123');
      this.getDataFromBD();
      let tiempoTotalMomento = await this.brf.EvaluaQueryAsync("EXEC uspGettiempototalEjecucionReporte " + this.model.Folio, 1, 'ABC123');
      this.brf.SetValueControl(this.Crear_ReporteForm, "Tiempo_total_de_ejecucion", tiempoTotalMomento);

      this.modalService.dismissAll();
    }
  }

  async detener(): Promise<void> {
    if (confirm("¿estás seguro que quieres detener el tiempo del reporte?")) {

      this.botonIniciarDisabled = true;
      this.botonPausarDisabled = true;
      this.botonReanudarDisabled = true;
      this.botonDetenerDisabled = true;

      clearTimeout(this.timeout);
      await this.brf.EvaluaQueryAsync("exec sp_InformacionConteo 5, " + this.model.Folio + ", 0, " + this.localStorageHelper.getItemFromLocalStorage('USERID'), 1, 'ABC123');
      await this.brf.EvaluaQueryAsync("exec uspGeneraHistorialTimer " + this.model.Folio + "," + this.localStorageHelper.getItemFromLocalStorage('USERID') + ",''", 1, 'ABC123');
      this.getDataFromBD();
      this.tiempototal = await this.brf.EvaluaQueryAsync("EXEC uspGettiempototalEjecucionReporte " + this.model.Folio, 1, 'ABC123');
      this.brf.SetValueControl(this.Crear_ReporteForm, "Tiempo_total_de_ejecucion", this.tiempototal);
    }
  }

  async getDataFromBD(): Promise<void> {
    const model: q = new q();
    model.id = 1;
    model.query = `exec uspRefrescaEjecutantesReporte ${this.model.Folio}`;
    model.securityCode = 'ABC123';

    this._SpartanService.GetRawQuery(model).subscribe(async (result) => {
      if (result == null) {
        return;
      }
      let dt = JSON.parse(result.replace('\\', ''))
      let fEjecutantes = await this.Detalle_tiempo_ejecutantes_crear_reporteService.listaSelAll(0, dt.length, '').toPromise()

      for (var i = 0; i < dt.length; i++) {
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].Ejecutante = dt[i].Ejecutante;
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].Ejecutante_Spartan_User.Id_User = dt[i].Ejecutante;
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].Ejecutante_Spartan_User.Name = dt[i].EjecutanteName;
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].Folio = dt[i].Folio;
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].IdCrear_reporte = dt[i].IdCrear_reporte;
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].Motivo_de_pausa = dt[i].Motivo_de_pausa;
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].Fecha = new Date().toISOString();
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].Hora_inicial = dt[i].Hora_inicial;
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].Hora_final = dt[i].Hora_final;
        fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes[i].Tiempo_ejecucion_en_hrs = dt[i].Tiempo_ejecucion_en_hrs;
      }
      this.EjecutantesData = fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes;
      this.loadEjecutantes(fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes);
      this.dataSourceEjecutantes = new MatTableDataSource(fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes);

      const page = Math.ceil(this.dataSourceEjecutantes.data.filter(d => !d.IsDeleted).length / this.paginadorEjecutantes.pageSize);
      if (page !== this.paginadorEjecutantes.pageIndex) {
        this.paginadorEjecutantes.pageIndex = page;
      }

      this.dataSourceEjecutantes.paginator = this.paginadorEjecutantes;

    });
  }

  ngAfterViewInit(): void {
    this.dataSourceSolicitud_de_partes.paginator = this.paginadorPartes;
    this.dataSourceSolicitud_de_servicios.paginator = this.paginadorServicios;
    this.dataSourceSolicitud_de_materiales.paginator = this.paginadorMateriales;
    this.dataSourceSolicitud_de_herramientas.paginator = this.paginadorHerramientas;

    this.dataSourceRemocion.paginator = this.paginadorRemocion;
    this.dataSourceInstalacion.paginator = this.paginadorInstalacion;

    this.dataSourceEjecutantes.paginator = this.paginadorEjecutantes;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Solicitud_de_partesColumns.splice(0, 1);
          this.Solicitud_de_serviciosColumns.splice(0, 1);
          this.Solicitud_de_materialesColumns.splice(0, 1);
          this.Solicitud_de_herramientasColumns.splice(0, 1);
          this.RemocionColumns.splice(0, 1);
          this.InstalacionColumns.splice(0, 1);
          this.EjecutantesColumns.splice(0, 1);

          this.Crear_ReporteForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Crear_Reporte)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Crear_ReporteForm, 'No__de_Orden_de_Servicio', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Crear_ReporteForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Crear_ReporteForm, 'Codigo_computarizado_Descripcion', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Crear_ReporteForm, 'Codigo_ATA', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Crear_ReporteForm, 'Respondiente_resp', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Crear_ReporteForm, 'Supervisor', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Crear_ReporteForm, 'Inspector', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Crear_ReporteForm, 'Programador_de_mantenimiento', [CustomValidators.autocompleteObjectValidator(), Validators.required]);



    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Crear_ReporteService.listaSelAll(0, 1, 'Crear_Reporte.Folio=' + id).toPromise();
    if (result.Crear_Reportes.length > 0) {

      this.NoOrdenServicioEditar = result.Crear_Reportes[0].No__de_Orden_de_Servicio;
      this.EstatusEditarConsulta = result.Crear_Reportes[0].Estatus;

      let fSolicitud_de_partes = await this.Detalle_Solicitud_de_Partes_Crear_reporteService.listaSelAll(0, 1000, 'Crear_Reporte.Folio=' + id).toPromise();
      this.Solicitud_de_partesData = fSolicitud_de_partes.Detalle_Solicitud_de_Partes_Crear_reportes;
      this.loadSolicitud_de_partes(fSolicitud_de_partes.Detalle_Solicitud_de_Partes_Crear_reportes);
      this.dataSourceSolicitud_de_partes = new MatTableDataSource(fSolicitud_de_partes.Detalle_Solicitud_de_Partes_Crear_reportes);
      this.dataSourceSolicitud_de_partes.paginator = this.paginadorPartes;
      this.dataSourceSolicitud_de_partes.sort = this.sort;

      let fSolicitud_de_servicios = await this.Detalle_Solicitud_de_Servicios_Crear_reporteService.listaSelAll(0, 1000, 'Crear_Reporte.Folio=' + id).toPromise();
      this.Solicitud_de_serviciosData = fSolicitud_de_servicios.Detalle_Solicitud_de_Servicios_Crear_reportes;
      this.loadSolicitud_de_servicios(fSolicitud_de_servicios.Detalle_Solicitud_de_Servicios_Crear_reportes);
      this.dataSourceSolicitud_de_servicios = new MatTableDataSource(fSolicitud_de_servicios.Detalle_Solicitud_de_Servicios_Crear_reportes);
      this.dataSourceSolicitud_de_servicios.paginator = this.paginadorServicios;
      this.dataSourceSolicitud_de_servicios.sort = this.sort;

      let fSolicitud_de_materiales = await this.Detalle_Solicitud_de_Materiales_Crear_reporteService.listaSelAll(0, 1000, 'Crear_Reporte.Folio=' + id).toPromise();
      this.Solicitud_de_materialesData = fSolicitud_de_materiales.Detalle_Solicitud_de_Materiales_Crear_reportes;
      this.loadSolicitud_de_materiales(fSolicitud_de_materiales.Detalle_Solicitud_de_Materiales_Crear_reportes);
      this.dataSourceSolicitud_de_materiales = new MatTableDataSource(fSolicitud_de_materiales.Detalle_Solicitud_de_Materiales_Crear_reportes);
      this.dataSourceSolicitud_de_materiales.paginator = this.paginadorMateriales;
      this.dataSourceSolicitud_de_materiales.sort = this.sort;
      let fSolicitud_de_herramientas = await this.Detalle_Solicitud_de_Herramientas_Crear_reporteService.listaSelAll(0, 1000, 'Crear_Reporte.Folio=' + id).toPromise();
      this.Solicitud_de_herramientasData = fSolicitud_de_herramientas.Detalle_Solicitud_de_Herramientas_Crear_reportes;
      this.loadSolicitud_de_herramientas(fSolicitud_de_herramientas.Detalle_Solicitud_de_Herramientas_Crear_reportes);
      this.dataSourceSolicitud_de_herramientas = new MatTableDataSource(fSolicitud_de_herramientas.Detalle_Solicitud_de_Herramientas_Crear_reportes);
      this.dataSourceSolicitud_de_herramientas.paginator = this.paginadorHerramientas;
      this.dataSourceSolicitud_de_herramientas.sort = this.sort;
      let fRemocion = await this.Detalle_de_Remocion_de_piezasService.listaSelAll(0, 1000, 'Crear_Reporte.Folio=' + id).toPromise();
      this.RemocionData = fRemocion.Detalle_de_Remocion_de_piezass;
      this.loadRemocion(fRemocion.Detalle_de_Remocion_de_piezass);
      this.dataSourceRemocion = new MatTableDataSource(fRemocion.Detalle_de_Remocion_de_piezass);
      this.dataSourceRemocion.paginator = this.paginadorRemocion;
      this.dataSourceRemocion.sort = this.sort;
      let fInstalacion = await this.Detalle_de_Instalacion_de_piezasService.listaSelAll(0, 1000, 'Crear_Reporte.Folio=' + id).toPromise();
      this.InstalacionData = fInstalacion.Detalle_de_Instalacion_de_piezass;
      this.loadInstalacion(fInstalacion.Detalle_de_Instalacion_de_piezass);
      this.dataSourceInstalacion = new MatTableDataSource(fInstalacion.Detalle_de_Instalacion_de_piezass);
      this.dataSourceInstalacion.paginator = this.paginadorInstalacion;
      this.dataSourceInstalacion.sort = this.sort;
      let fEjecutantes = await this.Detalle_tiempo_ejecutantes_crear_reporteService.listaSelAll(0, 1000, 'Crear_Reporte.Folio=' + id).toPromise();
      this.EjecutantesData = fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes;
      this.loadEjecutantes(fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes);
      this.dataSourceEjecutantes = new MatTableDataSource(fEjecutantes.Detalle_tiempo_ejecutantes_crear_reportes);
      this.dataSourceEjecutantes.paginator = this.paginadorEjecutantes;
      this.dataSourceEjecutantes.sort = this.sort;

      this.model.fromObject(result.Crear_Reportes[0]);
      this.Crear_ReporteForm.get('N_Orden_de_Trabajo').setValue(
        result.Crear_Reportes[0].N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
        { onlySelf: false, emitEvent: true }
      );
      this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').setValue(
        result.Crear_Reportes[0].No__de_Orden_de_Servicio_Orden_de_servicio.Folio_OS,
        { onlySelf: false, emitEvent: true }
      );
      this.Crear_ReporteForm.get('Matricula').setValue(
        result.Crear_Reportes[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.Crear_ReporteForm.get('Codigo_computarizado_Descripcion').setValue(
        result.Crear_Reportes[0].Codigo_computarizado_Descripcion_Codigo_Computarizado.Descripcion_Busqueda,
        { onlySelf: false, emitEvent: true }
      );
      this.Crear_ReporteForm.get('Codigo_ATA').setValue(
        result.Crear_Reportes[0].Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Crear_ReporteForm.get('Respondiente_resp').setValue(
        result.Crear_Reportes[0].Respondiente_resp_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );
      this.Crear_ReporteForm.get('Supervisor').setValue(
        result.Crear_Reportes[0].Supervisor_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );
      this.Crear_ReporteForm.get('Inspector').setValue(
        result.Crear_Reportes[0].Inspector_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );
      this.Crear_ReporteForm.get('Programador_de_mantenimiento').setValue(
        result.Crear_Reportes[0].Programador_de_mantenimiento_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );
      this.Crear_ReporteForm.get('Estatus').setValue(
        result.Crear_Reportes[0].Estatus,
        { onlySelf: false, emitEvent: true }
      );

      this.Crear_ReporteForm.markAllAsTouched();
      this.Crear_ReporteForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else {
      this.spinner.hide('loading');
    }
  }

  get Solicitud_de_partesItems() {
    return this.Crear_ReporteForm.get('Detalle_Solicitud_de_Partes_Crear_reporteItems') as FormArray;
  }

  getSolicitud_de_partesColumns(): string[] {
    return this.Solicitud_de_partesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSolicitud_de_partes(Solicitud_de_partes: Detalle_Solicitud_de_Partes_Crear_reporte[]) {
    Solicitud_de_partes.forEach(element => {
      this.addSolicitud_de_partes(element);
    });
  }

  addSolicitud_de_partesToMR() {
    const Solicitud_de_partes = new Detalle_Solicitud_de_Partes_Crear_reporte(this.fb);
    this.Solicitud_de_partesData.push(this.addSolicitud_de_partes(Solicitud_de_partes));
    this.dataSourceSolicitud_de_partes.data = this.Solicitud_de_partesData;
    Solicitud_de_partes.edit = true;
    Solicitud_de_partes.isNew = true;
    const length = this.dataSourceSolicitud_de_partes.data.length;
    const index = length - 1;
    const formSolicitud_de_partes = this.Solicitud_de_partesItems.controls[index] as FormGroup;
    this.addFilterToControlN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte(formSolicitud_de_partes.controls.N_Parte_Descripcion, index);
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Partes_Crear_reporte(formSolicitud_de_partes.controls.Unidad, index);

    formSolicitud_de_partes.controls.En_Existencia.setValue(this.varExistencia_solicitud_crear_reporte.filter(x => x.Existencia == "Solicitar")[0].Folio);

    this.localStorageHelper.setItemToLocalStorage('Solicita_Herramientas', '1');
    this.localStorageHelper.setItemToLocalStorage('Solicita_Partes', '1');

    const page = Math.ceil(this.dataSourceSolicitud_de_partes.data.filter(d => !d.IsDeleted).length / this.paginadorPartes.pageSize);
    if (page !== this.paginadorPartes.pageIndex) {
      this.paginadorPartes.pageIndex = page;
    }
  }

  VerificarSolicitud_de_partes() {
    let count = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value.length;
    let N_Parte_Descripcion = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value[count - 1]['N_Parte_Descripcion'];
    let Horas_del_Componente_a_Remover = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value[count - 1]['Horas_del_Componente_a_Remover'];
    let Ciclos_del_componente_a_Remover = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value[count - 1]['Ciclos_del_componente_a_Remover'];
    let Cantidad = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value[count - 1]['Cantidad'];
    let Unidad = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value[count - 1]['Unidad'];
    let Urgencia = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value[count - 1]['Urgencia'];
    let Razon_de_Solicitud = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value[count - 1]['Razon_de_Solicitud'];
    let Condicion_de_la_Parte = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value[count - 1]['Condicion_de_la_Parte'];
    //let En_Existencia = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Partes_Crear_reporteItems").value[count - 1]['En_Existencia'];

    if (N_Parte_Descripcion && Horas_del_Componente_a_Remover != 0 && Ciclos_del_componente_a_Remover != 0 && Cantidad && Unidad && Urgencia && Razon_de_Solicitud && Condicion_de_la_Parte) {
      this.ButtonSaveSolicitud_de_partes = false;
    }
    else {
      this.ButtonSaveSolicitud_de_partes = true
    }
  }

  VerificarSolicitud_de_servicio() {
    let count = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Servicios_Crear_reporteItems").value.length;
    let N_Servicio_Descripcion = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Servicios_Crear_reporteItems").value[count - 1]['N_Servicio_Descripcion'];
    let Fecha_Estimada_del_Mtto = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Servicios_Crear_reporteItems").value[count - 1]['Fecha_Estimada_del_Mtto'];
    let Unidad = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Servicios_Crear_reporteItems").value[count - 1]['Unidad'];
    let Urgencia = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Servicios_Crear_reporteItems").value[count - 1]['Urgencia'];
    let Razon_de_Solicitud = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Servicios_Crear_reporteItems").value[count - 1]['Razon_de_Solicitud'];

    if (N_Servicio_Descripcion && Fecha_Estimada_del_Mtto != 0 && Unidad && Urgencia && Razon_de_Solicitud) {
      this.ButtonSaveSolicitud_de_servicio = false;
    }
    else {
      this.ButtonSaveSolicitud_de_servicio = true
    }
  }

  VerificarSolicitud_de_materiales() {
    let count = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Materiales_Crear_reporteItems").value.length;
    let Codigo_Descripcion = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Materiales_Crear_reporteItems").value[count - 1]['Codigo_Descripcion'];
    let Cantidad = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Materiales_Crear_reporteItems").value[count - 1]['Cantidad'];
    let Unidad = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Materiales_Crear_reporteItems").value[count - 1]['Unidad'];
    let Urgencia = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Materiales_Crear_reporteItems").value[count - 1]['Urgencia'];
    let Razon_de_Solicitud = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Materiales_Crear_reporteItems").value[count - 1]['Razon_de_Solicitud'];

    if (Codigo_Descripcion && Cantidad && Unidad && Urgencia && Razon_de_Solicitud) {
      this.ButtonSaveSolicitud_de_materiales = false;
    }
    else {
      this.ButtonSaveSolicitud_de_materiales = true
    }
  }

  VerificarSolicitud_de_herramientas() {
    let count = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Herramientas_Crear_reporteItems").value.length;
    let Codigo_Descripcion = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Herramientas_Crear_reporteItems").value[count - 1]['Codigo_Descripcion'];
    let Cantidad = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Herramientas_Crear_reporteItems").value[count - 1]['Cantidad'];
    let Unidad = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Herramientas_Crear_reporteItems").value[count - 1]['Unidad'];
    let Urgencia = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Herramientas_Crear_reporteItems").value[count - 1]['Urgencia'];
    let Razon_de_Solicitud = this.Crear_ReporteForm.get("Detalle_Solicitud_de_Herramientas_Crear_reporteItems").value[count - 1]['Razon_de_Solicitud'];

    if (Codigo_Descripcion && Cantidad && Unidad && Urgencia && Razon_de_Solicitud) {
      this.ButtonSaveSolicitud_de_herramientas = false;
    }
    else {
      this.ButtonSaveSolicitud_de_herramientas = true
    }
  }

  addSolicitud_de_partes(entity: Detalle_Solicitud_de_Partes_Crear_reporte) {
    const Solicitud_de_partes = new Detalle_Solicitud_de_Partes_Crear_reporte(this.fb);
    this.Solicitud_de_partesItems.push(Solicitud_de_partes.buildFormGroup());
    if (entity) {
      Solicitud_de_partes.fromObject(entity);
    }
    return entity;
  }

  Solicitud_de_partesItemsByFolio(Folio: number): FormGroup {
    return (this.Crear_ReporteForm.get('Detalle_Solicitud_de_Partes_Crear_reporteItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Solicitud_de_partesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    let fb = this.Solicitud_de_partesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSolicitud_de_partes(element: any) {

    let index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    this.Solicitud_de_partesData[index].N_Parte_Descripcion = ''
    this.Solicitud_de_partesData[index].Horas_del_Componente_a_Remover = ''
    this.Solicitud_de_partesData[index].Ciclos_del_componente_a_Remover = ''
    this.Solicitud_de_partesData[index].Cantidad = ''
    this.Solicitud_de_partesData[index].Unidad = ''
    this.Solicitud_de_partesData[index].Urgencia = ''
    this.Solicitud_de_partesData[index].Razon_de_Solicitud = ''
    this.Solicitud_de_partesData[index].Condicion_de_la_Parte = ''
    this.Solicitud_de_partesData[index].IsDeleted = true;
    this.dataSourceSolicitud_de_partes.data = this.Solicitud_de_partesData;
    this.dataSourceSolicitud_de_partes._updateChangeSubscription();
    index = this.dataSourceSolicitud_de_partes.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorPartes.pageSize);
    if (page !== this.paginadorPartes.pageIndex) {
      this.paginadorPartes.pageIndex = page;
    }
  }

  cancelEditSolicitud_de_partes(element: any) {
    let index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Solicitud_de_partesData[index].IsDeleted = true;
      this.dataSourceSolicitud_de_partes.data = this.Solicitud_de_partesData;
      this.dataSourceSolicitud_de_partes.data.splice(index, 1);
      this.dataSourceSolicitud_de_partes._updateChangeSubscription();
      index = this.Solicitud_de_partesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorPartes.pageSize);
      if (page !== this.paginadorPartes.pageIndex) {
        this.paginadorPartes.pageIndex = page;
      }
    }
  }

  async saveSolicitud_de_partes(element: any) {
    const index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    const formSolicitud_de_partes = this.Solicitud_de_partesItems.controls[index] as FormGroup;
    if (this.Solicitud_de_partesData[index].N_Parte_Descripcion !== formSolicitud_de_partes.value.N_Parte_Descripcion && formSolicitud_de_partes.value.N_Parte_Descripcion > 0) {
      let partes = await this.PartesService.getById(formSolicitud_de_partes.value.N_Parte_Descripcion).toPromise();
      this.Solicitud_de_partesData[index].N_Parte_Descripcion_Partes = partes;
    }
    this.Solicitud_de_partesData[index].N_Parte_Descripcion = formSolicitud_de_partes.value.N_Parte_Descripcion;
    this.Solicitud_de_partesData[index].Horas_del_Componente_a_Remover = formSolicitud_de_partes.value.Horas_del_Componente_a_Remover;
    this.Solicitud_de_partesData[index].Ciclos_del_componente_a_Remover = formSolicitud_de_partes.value.Ciclos_del_componente_a_Remover;
    this.Solicitud_de_partesData[index].Cantidad = formSolicitud_de_partes.value.Cantidad;
    if (this.Solicitud_de_partesData[index].Unidad !== formSolicitud_de_partes.value.Unidad && formSolicitud_de_partes.value.Unidad > 0) {
      let unidad = await this.UnidadService.getById(formSolicitud_de_partes.value.Unidad).toPromise();
      this.Solicitud_de_partesData[index].Unidad_Unidad = unidad;
    }
    this.Solicitud_de_partesData[index].Unidad = formSolicitud_de_partes.value.Unidad;
    this.Solicitud_de_partesData[index].Urgencia = formSolicitud_de_partes.value.Urgencia;
    this.Solicitud_de_partesData[index].Urgencia_Urgencia = formSolicitud_de_partes.value.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === formSolicitud_de_partes.value.Urgencia)[0] : null;
    this.Solicitud_de_partesData[index].Razon_de_Solicitud = formSolicitud_de_partes.value.Razon_de_Solicitud;
    this.Solicitud_de_partesData[index].Condicion_de_la_Parte = formSolicitud_de_partes.value.Condicion_de_la_Parte;
    this.Solicitud_de_partesData[index].En_Existencia = formSolicitud_de_partes.value.En_Existencia;
    this.Solicitud_de_partesData[index].En_Existencia_Existencia_solicitud_crear_reporte = formSolicitud_de_partes.value.En_Existencia !== '' ?
      this.varExistencia_solicitud_crear_reporte.filter(d => d.Folio === formSolicitud_de_partes.value.En_Existencia)[0] : null;

    this.Solicitud_de_partesData[index].isNew = false;
    this.dataSourceSolicitud_de_partes.data = this.Solicitud_de_partesData;
    this.dataSourceSolicitud_de_partes._updateChangeSubscription();
    this.ButtonSaveSolicitud_de_partes = true;
  }

  editSolicitud_de_partes(element: any) {
    const index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    const formSolicitud_de_partes = this.Solicitud_de_partesItems.controls[index] as FormGroup;
    this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte[index] = this.dataSourceSolicitud_de_partes.data[index].N_Parte_Descripcion_Partes.Numero_de_parte_Descripcion;
    this.addFilterToControlN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte(formSolicitud_de_partes.controls.N_Parte_Descripcion, index);
    this.SelectedUnidad_Detalle_Solicitud_de_Partes_Crear_reporte[index] = this.dataSourceSolicitud_de_partes.data[index].Unidad_Unidad.Descripcion;
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Partes_Crear_reporte(formSolicitud_de_partes.controls.Unidad, index);

    this.ButtonSaveSolicitud_de_partes = false;

    element.edit = true;
  }

  async saveDetalle_Solicitud_de_Partes_Crear_reporte(Folio: number) {
    this.dataSourceSolicitud_de_partes.data.forEach(async (d, index) => {
      const data = this.Solicitud_de_partesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Crear_Reporte = Folio;


      if (model.Folio === 0) {
        // Add Solicitud de partes
        let response = await this.Detalle_Solicitud_de_Partes_Crear_reporteService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSolicitud_de_partes = this.Solicitud_de_partesItemsByFolio(model.Folio);
        if (formSolicitud_de_partes.dirty) {
          // Update Solicitud de partes
          let response = await this.Detalle_Solicitud_de_Partes_Crear_reporteService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Solicitud de partes
        await this.Detalle_Solicitud_de_Partes_Crear_reporteService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_Solicitud_de_Partes_Crear_reporteItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Parte_Descripcion.setValue(event.option.value);
    this.displayFnN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte(element);
  }

  displayFnN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte(this, element) {
    const index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    return this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte[index];
  }
  updateOptionN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte(event, element: any) {
    const index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte[index] = event.source.viewValue;
  }

  _filterN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte(filter: any): Observable<Partes> {
    const where = filter !== '' ? "Partes.Numero_de_parte_Descripcion like '%" + filter + "%'" : '';
    return this.PartesService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte = true;
        return this._filterN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte(value || '');
      })
    ).subscribe(result => {
      this.varPartes = result.Partess;
      this.isLoadingN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte = false;
      this.searchN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporteCompleted = true;
      this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte[index] = this.varPartes.length === 0 ? '' : this.SelectedN_Parte_Descripcion_Detalle_Solicitud_de_Partes_Crear_reporte[index];
    });
  }
  public selectUnidad_Detalle_Solicitud_de_Partes_Crear_reporte(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_Detalle_Solicitud_de_Partes_Crear_reporte[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_Solicitud_de_Partes_Crear_reporteItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad.setValue(event.option.value);
    this.displayFnUnidad_Detalle_Solicitud_de_Partes_Crear_reporte(element);
  }

  displayFnUnidad_Detalle_Solicitud_de_Partes_Crear_reporte(this, element) {
    const index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    return this.SelectedUnidad_Detalle_Solicitud_de_Partes_Crear_reporte[index];
  }
  updateOptionUnidad_Detalle_Solicitud_de_Partes_Crear_reporte(event, element: any) {
    const index = this.dataSourceSolicitud_de_partes.data.indexOf(element);
    this.SelectedUnidad_Detalle_Solicitud_de_Partes_Crear_reporte[index] = event.source.viewValue;
  }

  _filterUnidad_Detalle_Solicitud_de_Partes_Crear_reporte(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_Detalle_Solicitud_de_Partes_Crear_reporte(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_Detalle_Solicitud_de_Partes_Crear_reporte = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_Detalle_Solicitud_de_Partes_Crear_reporte = true;
        return this._filterUnidad_Detalle_Solicitud_de_Partes_Crear_reporte(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_Detalle_Solicitud_de_Partes_Crear_reporte = false;
      this.searchUnidad_Detalle_Solicitud_de_Partes_Crear_reporteCompleted = true;
      this.SelectedUnidad_Detalle_Solicitud_de_Partes_Crear_reporte[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_Detalle_Solicitud_de_Partes_Crear_reporte[index];
    });
  }

  get Solicitud_de_serviciosItems() {
    return this.Crear_ReporteForm.get('Detalle_Solicitud_de_Servicios_Crear_reporteItems') as FormArray;
  }

  getSolicitud_de_serviciosColumns(): string[] {
    return this.Solicitud_de_serviciosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSolicitud_de_servicios(Solicitud_de_servicios: Detalle_Solicitud_de_Servicios_Crear_reporte[]) {
    Solicitud_de_servicios.forEach(element => {
      this.addSolicitud_de_servicios(element);
    });
  }

  addSolicitud_de_serviciosToMR() {
    const Solicitud_de_servicios = new Detalle_Solicitud_de_Servicios_Crear_reporte(this.fb);
    this.Solicitud_de_serviciosData.push(this.addSolicitud_de_servicios(Solicitud_de_servicios));
    this.dataSourceSolicitud_de_servicios.data = this.Solicitud_de_serviciosData;
    Solicitud_de_servicios.edit = true;
    Solicitud_de_servicios.isNew = true;
    const length = this.dataSourceSolicitud_de_servicios.data.length;
    const index = length - 1;
    const formSolicitud_de_servicios = this.Solicitud_de_serviciosItems.controls[index] as FormGroup;
    this.addFilterToControlN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte(formSolicitud_de_servicios.controls.N_Servicio_Descripcion, index);
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte(formSolicitud_de_servicios.controls.Unidad, index);

    formSolicitud_de_servicios.controls.En_Existencia.setValue(this.varExistencia_solicitud_crear_reporte.filter(x => x.Existencia == "Solicitar")[0].Folio);

    this.localStorageHelper.setItemToLocalStorage('Solicita_Herramientas', '1');
    this.localStorageHelper.setItemToLocalStorage('Solicita_Servicios', '1');

    const page = Math.ceil(this.dataSourceSolicitud_de_servicios.data.filter(d => !d.IsDeleted).length / this.paginadorServicios.pageSize);
    if (page !== this.paginadorServicios.pageIndex) {
      this.paginadorServicios.pageIndex = page;
    }
  }

  addSolicitud_de_servicios(entity: Detalle_Solicitud_de_Servicios_Crear_reporte) {
    const Solicitud_de_servicios = new Detalle_Solicitud_de_Servicios_Crear_reporte(this.fb);
    this.Solicitud_de_serviciosItems.push(Solicitud_de_servicios.buildFormGroup());
    if (entity) {
      Solicitud_de_servicios.fromObject(entity);
    }
    return entity;
  }

  Solicitud_de_serviciosItemsByFolio(Folio: number): FormGroup {
    return (this.Crear_ReporteForm.get('Detalle_Solicitud_de_Servicios_Crear_reporteItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Solicitud_de_serviciosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    let fb = this.Solicitud_de_serviciosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSolicitud_de_servicios(element: any) {
    let index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    this.Solicitud_de_serviciosData[index].N_Servicio_Descripcion = ''
    this.Solicitud_de_serviciosData[index].Fecha_Estimada_del_Mtto = ''
    this.Solicitud_de_serviciosData[index].Cantidad = ''
    this.Solicitud_de_serviciosData[index].Unidad = ''
    this.Solicitud_de_serviciosData[index].Urgencia = ''
    this.Solicitud_de_serviciosData[index].Razon_de_Solicitud = ''
    this.Solicitud_de_serviciosData[index].IsDeleted = true;

    this.dataSourceSolicitud_de_servicios.data = this.Solicitud_de_serviciosData;
    this.dataSourceSolicitud_de_servicios._updateChangeSubscription();
    index = this.dataSourceSolicitud_de_servicios.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorServicios.pageSize);
    if (page !== this.paginadorServicios.pageIndex) {
      this.paginadorServicios.pageIndex = page;
    }
  }

  cancelEditSolicitud_de_servicios(element: any) {
    let index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Solicitud_de_serviciosData[index].IsDeleted = true;
      this.dataSourceSolicitud_de_servicios.data = this.Solicitud_de_serviciosData;
      this.dataSourceSolicitud_de_servicios.data.splice(index, 1);
      this.dataSourceSolicitud_de_servicios._updateChangeSubscription();
      index = this.Solicitud_de_serviciosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorServicios.pageSize);
      if (page !== this.paginadorServicios.pageIndex) {
        this.paginadorServicios.pageIndex = page;
      }
    }
  }

  async saveSolicitud_de_servicios(element: any) {
    const index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    const formSolicitud_de_servicios = this.Solicitud_de_serviciosItems.controls[index] as FormGroup;
    if (this.Solicitud_de_serviciosData[index].N_Servicio_Descripcion !== formSolicitud_de_servicios.value.N_Servicio_Descripcion && formSolicitud_de_servicios.value.N_Servicio_Descripcion > 0) {
      let catalogo_servicios = await this.Catalogo_serviciosService.getById(formSolicitud_de_servicios.value.N_Servicio_Descripcion).toPromise();
      this.Solicitud_de_serviciosData[index].N_Servicio_Descripcion_Catalogo_servicios = catalogo_servicios;
    }
    this.Solicitud_de_serviciosData[index].N_Servicio_Descripcion = formSolicitud_de_servicios.value.N_Servicio_Descripcion;
    this.Solicitud_de_serviciosData[index].Fecha_Estimada_del_Mtto = formSolicitud_de_servicios.value.Fecha_Estimada_del_Mtto;
    this.Solicitud_de_serviciosData[index].Cantidad = formSolicitud_de_servicios.value.Cantidad;
    if (this.Solicitud_de_serviciosData[index].Unidad !== formSolicitud_de_servicios.value.Unidad && formSolicitud_de_servicios.value.Unidad > 0) {
      let unidad = await this.UnidadService.getById(formSolicitud_de_servicios.value.Unidad).toPromise();
      this.Solicitud_de_serviciosData[index].Unidad_Unidad = unidad;
    }
    this.Solicitud_de_serviciosData[index].Unidad = formSolicitud_de_servicios.value.Unidad;
    this.Solicitud_de_serviciosData[index].Urgencia = formSolicitud_de_servicios.value.Urgencia;
    this.Solicitud_de_serviciosData[index].Urgencia_Urgencia = formSolicitud_de_servicios.value.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === formSolicitud_de_servicios.value.Urgencia)[0] : null;
    this.Solicitud_de_serviciosData[index].Razon_de_Solicitud = formSolicitud_de_servicios.value.Razon_de_Solicitud;
    this.Solicitud_de_serviciosData[index].En_Existencia = formSolicitud_de_servicios.value.En_Existencia;
    this.Solicitud_de_serviciosData[index].En_Existencia_Existencia_solicitud_crear_reporte = formSolicitud_de_servicios.value.En_Existencia !== '' ?
      this.varExistencia_solicitud_crear_reporte.filter(d => d.Folio === formSolicitud_de_servicios.value.En_Existencia)[0] : null;

    this.Solicitud_de_serviciosData[index].isNew = false;
    this.dataSourceSolicitud_de_servicios.data = this.Solicitud_de_serviciosData;
    this.dataSourceSolicitud_de_servicios._updateChangeSubscription();
    this.ButtonSaveSolicitud_de_servicio = true;
  }

  editSolicitud_de_servicios(element: any) {
    const index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    const formSolicitud_de_servicios = this.Solicitud_de_serviciosItems.controls[index] as FormGroup;
    this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte[index] = this.dataSourceSolicitud_de_servicios.data[index].N_Servicio_Descripcion_Catalogo_servicios.Codigo_Descripcion;
    this.addFilterToControlN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte(formSolicitud_de_servicios.controls.N_Servicio_Descripcion, index);
    this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte[index] = this.dataSourceSolicitud_de_servicios.data[index].Unidad_Unidad.Descripcion;
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte(formSolicitud_de_servicios.controls.Unidad, index);

    this.ButtonSaveSolicitud_de_servicio = false;

    element.edit = true;
  }

  async saveDetalle_Solicitud_de_Servicios_Crear_reporte(Folio: number) {
    this.dataSourceSolicitud_de_servicios.data.forEach(async (d, index) => {
      const data = this.Solicitud_de_serviciosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Crear_Reporte = Folio;


      if (model.Folio === 0) {
        // Add Solicitud de servicios
        let response = await this.Detalle_Solicitud_de_Servicios_Crear_reporteService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSolicitud_de_servicios = this.Solicitud_de_serviciosItemsByFolio(model.Folio);
        if (formSolicitud_de_servicios.dirty) {
          // Update Solicitud de servicios
          let response = await this.Detalle_Solicitud_de_Servicios_Crear_reporteService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Solicitud de servicios
        await this.Detalle_Solicitud_de_Servicios_Crear_reporteService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    this.VerificarSolicitud_de_servicio();
    if (!event.option) {
      return;
    }
    this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_Solicitud_de_Servicios_Crear_reporteItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Servicio_Descripcion.setValue(event.option.value);
    this.displayFnN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte(element);
  }

  displayFnN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte(this, element) {
    const index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    return this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte[index];
  }
  updateOptionN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte(event, element: any) {
    const index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte[index] = event.source.viewValue;
  }

  _filterN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte(filter: any): Observable<Catalogo_servicios> {
    const where = filter !== '' ? "Catalogo_servicios.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Catalogo_serviciosService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte = true;
        return this._filterN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte(value || '');
      })
    ).subscribe(result => {
      this.varCatalogo_servicios = result.Catalogo_servicioss;
      this.isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte = false;
      this.searchN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporteCompleted = true;
      this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte[index] = this.varCatalogo_servicios.length === 0 ? '' : this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Servicios_Crear_reporte[index];
    });
  }
  public selectUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    this.VerificarSolicitud_de_servicio();
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_Solicitud_de_Servicios_Crear_reporteItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad.setValue(event.option.value);
    this.displayFnUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte(element);
  }

  displayFnUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte(this, element) {
    const index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    return this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte[index];
  }
  updateOptionUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte(event, element: any) {
    const index = this.dataSourceSolicitud_de_servicios.data.indexOf(element);
    this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte[index] = event.source.viewValue;
  }

  _filterUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte = true;
        return this._filterUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte = false;
      this.searchUnidad_Detalle_Solicitud_de_Servicios_Crear_reporteCompleted = true;
      this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_Detalle_Solicitud_de_Servicios_Crear_reporte[index];
    });
  }

  get Solicitud_de_materialesItems() {
    return this.Crear_ReporteForm.get('Detalle_Solicitud_de_Materiales_Crear_reporteItems') as FormArray;
  }

  getSolicitud_de_materialesColumns(): string[] {
    return this.Solicitud_de_materialesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSolicitud_de_materiales(Solicitud_de_materiales: Detalle_Solicitud_de_Materiales_Crear_reporte[]) {
    Solicitud_de_materiales.forEach(element => {
      this.addSolicitud_de_materiales(element);
    });
  }

  addSolicitud_de_materialesToMR() {
    const Solicitud_de_materiales = new Detalle_Solicitud_de_Materiales_Crear_reporte(this.fb);
    this.Solicitud_de_materialesData.push(this.addSolicitud_de_materiales(Solicitud_de_materiales));
    this.dataSourceSolicitud_de_materiales.data = this.Solicitud_de_materialesData;
    Solicitud_de_materiales.edit = true;
    Solicitud_de_materiales.isNew = true;
    const length = this.dataSourceSolicitud_de_materiales.data.length;
    const index = length - 1;
    const formSolicitud_de_materiales = this.Solicitud_de_materialesItems.controls[index] as FormGroup;
    this.addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte(formSolicitud_de_materiales.controls.Codigo_Descripcion, index);
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte(formSolicitud_de_materiales.controls.Unidad, index);


    formSolicitud_de_materiales.controls.En_Existencia.setValue(this.varExistencia_solicitud_crear_reporte.filter(x => x.Existencia == "Solicitar")[0].Folio);

    this.localStorageHelper.setItemToLocalStorage('Solicita_Herramientas', '1');
    this.localStorageHelper.setItemToLocalStorage('Solicita_Materiales', '1');

    const page = Math.ceil(this.dataSourceSolicitud_de_materiales.data.filter(d => !d.IsDeleted).length / this.paginadorMateriales.pageSize);
    if (page !== this.paginadorMateriales.pageIndex) {
      this.paginadorMateriales.pageIndex = page;
    }
  }

  addSolicitud_de_materiales(entity: Detalle_Solicitud_de_Materiales_Crear_reporte) {
    const Solicitud_de_materiales = new Detalle_Solicitud_de_Materiales_Crear_reporte(this.fb);
    this.Solicitud_de_materialesItems.push(Solicitud_de_materiales.buildFormGroup());
    if (entity) {
      Solicitud_de_materiales.fromObject(entity);
    }
    return entity;
  }

  Solicitud_de_materialesItemsByFolio(Folio: number): FormGroup {
    return (this.Crear_ReporteForm.get('Detalle_Solicitud_de_Materiales_Crear_reporteItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Solicitud_de_materialesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    let fb = this.Solicitud_de_materialesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSolicitud_de_materiales(element: any) {
    let index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    this.Solicitud_de_materialesData[index].Codigo_Descripcion = ''
    this.Solicitud_de_materialesData[index].Cantidad = ''
    this.Solicitud_de_materialesData[index].Unidad = ''
    this.Solicitud_de_materialesData[index].Urgencia = ''
    this.Solicitud_de_materialesData[index].Razon_de_Solicitud = ''
    this.Solicitud_de_materialesData[index].IsDeleted = true;
    this.dataSourceSolicitud_de_materiales.data = this.Solicitud_de_materialesData;
      
    this.dataSourceSolicitud_de_materiales._updateChangeSubscription();
    index = this.dataSourceSolicitud_de_materiales.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorMateriales.pageSize);
    if (page !== this.paginadorMateriales.pageIndex) {
      this.paginadorMateriales.pageIndex = page;
    }
  }

  cancelEditSolicitud_de_materiales(element: any) {
    let index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Solicitud_de_materialesData[index].IsDeleted = true;
      this.dataSourceSolicitud_de_materiales.data = this.Solicitud_de_materialesData;
      this.dataSourceSolicitud_de_materiales.data.splice(index, 1);
      this.dataSourceSolicitud_de_materiales._updateChangeSubscription();
      index = this.Solicitud_de_materialesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorMateriales.pageSize);
      if (page !== this.paginadorMateriales.pageIndex) {
        this.paginadorMateriales.pageIndex = page;
      }
    }
  }

  async saveSolicitud_de_materiales(element: any) {
    const index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    const formSolicitud_de_materiales = this.Solicitud_de_materialesItems.controls[index] as FormGroup;
    if (this.Solicitud_de_materialesData[index].Codigo_Descripcion !== formSolicitud_de_materiales.value.Codigo_Descripcion && formSolicitud_de_materiales.value.Codigo_Descripcion > 0) {
      let listado_de_materiales = await this.Listado_de_MaterialesService.getById(formSolicitud_de_materiales.value.Codigo_Descripcion).toPromise();
      this.Solicitud_de_materialesData[index].Codigo_Descripcion_Listado_de_Materiales = listado_de_materiales;
    }
    this.Solicitud_de_materialesData[index].Codigo_Descripcion = formSolicitud_de_materiales.value.Codigo_Descripcion;
    this.Solicitud_de_materialesData[index].Cantidad = formSolicitud_de_materiales.value.Cantidad;
    if (this.Solicitud_de_materialesData[index].Unidad !== formSolicitud_de_materiales.value.Unidad && formSolicitud_de_materiales.value.Unidad > 0) {
      let unidad = await this.UnidadService.getById(formSolicitud_de_materiales.value.Unidad).toPromise();
      this.Solicitud_de_materialesData[index].Unidad_Unidad = unidad;
    }
    this.Solicitud_de_materialesData[index].Unidad = formSolicitud_de_materiales.value.Unidad;
    this.Solicitud_de_materialesData[index].Urgencia = formSolicitud_de_materiales.value.Urgencia;
    this.Solicitud_de_materialesData[index].Urgencia_Urgencia = formSolicitud_de_materiales.value.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === formSolicitud_de_materiales.value.Urgencia)[0] : null;
    this.Solicitud_de_materialesData[index].Razon_de_Solicitud = formSolicitud_de_materiales.value.Razon_de_Solicitud;
    this.Solicitud_de_materialesData[index].En_Existencia = formSolicitud_de_materiales.value.En_Existencia;
    this.Solicitud_de_materialesData[index].En_Existencia_Existencia_solicitud_crear_reporte = formSolicitud_de_materiales.value.En_Existencia !== '' ?
      this.varExistencia_solicitud_crear_reporte.filter(d => d.Folio === formSolicitud_de_materiales.value.En_Existencia)[0] : null;

    this.Solicitud_de_materialesData[index].isNew = false;
    this.dataSourceSolicitud_de_materiales.data = this.Solicitud_de_materialesData;
    this.dataSourceSolicitud_de_materiales._updateChangeSubscription();
    this.ButtonSaveSolicitud_de_materiales = true;
  }

  editSolicitud_de_materiales(element: any) {
    const index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    const formSolicitud_de_materiales = this.Solicitud_de_materialesItems.controls[index] as FormGroup;
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte[index] = this.dataSourceSolicitud_de_materiales.data[index].Codigo_Descripcion_Listado_de_Materiales.Codigo_Descripcion;
    this.addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte(formSolicitud_de_materiales.controls.Codigo_Descripcion, index);
    this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte[index] = this.dataSourceSolicitud_de_materiales.data[index].Unidad_Unidad.Descripcion;
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte(formSolicitud_de_materiales.controls.Unidad, index);

    this.ButtonSaveSolicitud_de_materiales = false;

    element.edit = true;
  }

  async saveDetalle_Solicitud_de_Materiales_Crear_reporte(Folio: number) {
    this.dataSourceSolicitud_de_materiales.data.forEach(async (d, index) => {
      const data = this.Solicitud_de_materialesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Crear_Reporte = Folio;


      if (model.Folio === 0) {
        // Add Solicitud de materiales
        let response = await this.Detalle_Solicitud_de_Materiales_Crear_reporteService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSolicitud_de_materiales = this.Solicitud_de_materialesItemsByFolio(model.Folio);
        if (formSolicitud_de_materiales.dirty) {
          // Update Solicitud de materiales
          let response = await this.Detalle_Solicitud_de_Materiales_Crear_reporteService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Solicitud de materiales
        await this.Detalle_Solicitud_de_Materiales_Crear_reporteService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    this.VerificarSolicitud_de_materiales();
    if (!event.option) {
      return;
    }
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_Solicitud_de_Materiales_Crear_reporteItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Codigo_Descripcion.setValue(event.option.value);
    this.displayFnCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte(element);
  }

  displayFnCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte(this, element) {
    const index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    return this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte[index];
  }
  updateOptionCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte(event, element: any) {
    const index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte[index] = event.source.viewValue;
  }

  _filterCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte(filter: any): Observable<Listado_de_Materiales> {
    const where = filter !== '' ? "Listado_de_Materiales.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Listado_de_MaterialesService.listaSelAll(0, 20, where);
  }

  addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte = true;
        return this._filterCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte(value || '');
      })
    ).subscribe(result => {
      this.varListado_de_Materiales = result.Listado_de_Materialess;
      this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte = false;
      this.searchCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporteCompleted = true;
      this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte[index] = this.varListado_de_Materiales.length === 0 ? '' : this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Materiales_Crear_reporte[index];
    });
  }
  public selectUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    this.VerificarSolicitud_de_materiales();
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_Solicitud_de_Materiales_Crear_reporteItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad.setValue(event.option.value);
    this.displayFnUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte(element);
  }

  displayFnUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte(this, element) {
    const index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    return this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte[index];
  }
  updateOptionUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte(event, element: any) {
    const index = this.dataSourceSolicitud_de_materiales.data.indexOf(element);
    this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte[index] = event.source.viewValue;
  }

  _filterUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte = true;
        return this._filterUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte = false;
      this.searchUnidad_Detalle_Solicitud_de_Materiales_Crear_reporteCompleted = true;
      this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_Detalle_Solicitud_de_Materiales_Crear_reporte[index];
    });
  }

  get Solicitud_de_herramientasItems() {
    return this.Crear_ReporteForm.get('Detalle_Solicitud_de_Herramientas_Crear_reporteItems') as FormArray;
  }

  getSolicitud_de_herramientasColumns(): string[] {
    return this.Solicitud_de_herramientasColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSolicitud_de_herramientas(Solicitud_de_herramientas: Detalle_Solicitud_de_Herramientas_Crear_reporte[]) {
    Solicitud_de_herramientas.forEach(element => {
      this.addSolicitud_de_herramientas(element);
    });
  }

  addSolicitud_de_herramientasToMR() {
    const Solicitud_de_herramientas = new Detalle_Solicitud_de_Herramientas_Crear_reporte(this.fb);
    this.Solicitud_de_herramientasData.push(this.addSolicitud_de_herramientas(Solicitud_de_herramientas));
    this.dataSourceSolicitud_de_herramientas.data = this.Solicitud_de_herramientasData;
    Solicitud_de_herramientas.edit = true;
    Solicitud_de_herramientas.isNew = true;
    const length = this.dataSourceSolicitud_de_herramientas.data.length;
    const index = length - 1;
    const formSolicitud_de_herramientas = this.Solicitud_de_herramientasItems.controls[index] as FormGroup;
    this.addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte(formSolicitud_de_herramientas.controls.Codigo_Descripcion, index);
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte(formSolicitud_de_herramientas.controls.Unidad, index);

    formSolicitud_de_herramientas.controls.En_Existencia.setValue(this.varExistencia_solicitud_crear_reporte.filter(x => x.Existencia == "Solicitar")[0].Folio);

    this.localStorageHelper.setItemToLocalStorage('Solicita_Herramientas', '1');

    const page = Math.ceil(this.dataSourceSolicitud_de_herramientas.data.filter(d => !d.IsDeleted).length / this.paginadorHerramientas.pageSize);
    if (page !== this.paginadorHerramientas.pageIndex) {
      this.paginadorHerramientas.pageIndex = page;
    }
  }

  addSolicitud_de_herramientas(entity: Detalle_Solicitud_de_Herramientas_Crear_reporte) {
    const Solicitud_de_herramientas = new Detalle_Solicitud_de_Herramientas_Crear_reporte(this.fb);
    this.Solicitud_de_herramientasItems.push(Solicitud_de_herramientas.buildFormGroup());
    if (entity) {
      Solicitud_de_herramientas.fromObject(entity);
    }
    return entity;
  }

  Solicitud_de_herramientasItemsByFolio(Folio: number): FormGroup {
    return (this.Crear_ReporteForm.get('Detalle_Solicitud_de_Herramientas_Crear_reporteItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Solicitud_de_herramientasItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    let fb = this.Solicitud_de_herramientasItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSolicitud_de_herramientas(element: any) {
    let index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    this.Solicitud_de_herramientasData[index].Codigo_Descripcion = '';
    this.Solicitud_de_herramientasData[index].Cantidad = '';
    this.Solicitud_de_herramientasData[index].Unidad = '';
    this.Solicitud_de_herramientasData[index].Urgencia = '';
    this.Solicitud_de_herramientasData[index].Razon_de_Solicitud = '';
    this.Solicitud_de_herramientasData[index].IsDeleted = true;
    this.dataSourceSolicitud_de_herramientas.data = this.Solicitud_de_herramientasData;
    
    this.dataSourceSolicitud_de_herramientas._updateChangeSubscription();
    index = this.dataSourceSolicitud_de_herramientas.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorHerramientas.pageSize);
    if (page !== this.paginadorHerramientas.pageIndex) {
      this.paginadorHerramientas.pageIndex = page;
    }
  }

  cancelEditSolicitud_de_herramientas(element: any) {
    let index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Solicitud_de_herramientasData[index].IsDeleted = true;
      this.dataSourceSolicitud_de_herramientas.data = this.Solicitud_de_herramientasData;
      this.dataSourceSolicitud_de_herramientas.data.splice(index, 1);
      this.dataSourceSolicitud_de_herramientas._updateChangeSubscription();
      index = this.Solicitud_de_herramientasData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorHerramientas.pageSize);
      if (page !== this.paginadorHerramientas.pageIndex) {
        this.paginadorHerramientas.pageIndex = page;
      }
    }
  }

  async saveSolicitud_de_herramientas(element: any) {
    const index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    const formSolicitud_de_herramientas = this.Solicitud_de_herramientasItems.controls[index] as FormGroup;
    if (this.Solicitud_de_herramientasData[index].Codigo_Descripcion !== formSolicitud_de_herramientas.value.Codigo_Descripcion && formSolicitud_de_herramientas.value.Codigo_Descripcion > 0) {
      let herramientas = await this.HerramientasService.getById(formSolicitud_de_herramientas.value.Codigo_Descripcion).toPromise();
      this.Solicitud_de_herramientasData[index].Codigo_Descripcion_Herramientas = herramientas;
    }
    this.Solicitud_de_herramientasData[index].Codigo_Descripcion = formSolicitud_de_herramientas.value.Codigo_Descripcion;
    this.Solicitud_de_herramientasData[index].Cantidad = formSolicitud_de_herramientas.value.Cantidad;
    if (this.Solicitud_de_herramientasData[index].Unidad !== formSolicitud_de_herramientas.value.Unidad && formSolicitud_de_herramientas.value.Unidad > 0) {
      let unidad = await this.UnidadService.getById(formSolicitud_de_herramientas.value.Unidad).toPromise();
      this.Solicitud_de_herramientasData[index].Unidad_Unidad = unidad;
    }
    this.Solicitud_de_herramientasData[index].Unidad = formSolicitud_de_herramientas.value.Unidad;
    this.Solicitud_de_herramientasData[index].Urgencia = formSolicitud_de_herramientas.value.Urgencia;
    this.Solicitud_de_herramientasData[index].Urgencia_Urgencia = formSolicitud_de_herramientas.value.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === formSolicitud_de_herramientas.value.Urgencia)[0] : null;
    this.Solicitud_de_herramientasData[index].Razon_de_Solicitud = formSolicitud_de_herramientas.value.Razon_de_Solicitud;
    this.Solicitud_de_herramientasData[index].En_Existencia = formSolicitud_de_herramientas.value.En_Existencia;
    this.Solicitud_de_herramientasData[index].En_Existencia_Existencia_solicitud_crear_reporte = formSolicitud_de_herramientas.value.En_Existencia !== '' ?
      this.varExistencia_solicitud_crear_reporte.filter(d => d.Folio === formSolicitud_de_herramientas.value.En_Existencia)[0] : null;

    this.Solicitud_de_herramientasData[index].isNew = false;
    this.dataSourceSolicitud_de_herramientas.data = this.Solicitud_de_herramientasData;
    this.dataSourceSolicitud_de_herramientas._updateChangeSubscription();
    this.ButtonSaveSolicitud_de_herramientas = true;
  }

  editSolicitud_de_herramientas(element: any) {
    const index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    const formSolicitud_de_herramientas = this.Solicitud_de_herramientasItems.controls[index] as FormGroup;
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte[index] = this.dataSourceSolicitud_de_herramientas.data[index].Codigo_Descripcion_Herramientas.Codigo_Descripcion;
    this.addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte(formSolicitud_de_herramientas.controls.Codigo_Descripcion, index);
    this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte[index] = this.dataSourceSolicitud_de_herramientas.data[index].Unidad_Unidad.Descripcion;
    this.addFilterToControlUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte(formSolicitud_de_herramientas.controls.Unidad, index);

    this.ButtonSaveSolicitud_de_herramientas = false;
    element.edit = true;
  }

  async saveDetalle_Solicitud_de_Herramientas_Crear_reporte(Folio: number) {
    this.dataSourceSolicitud_de_herramientas.data.forEach(async (d, index) => {
      const data = this.Solicitud_de_herramientasItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Crear_Reporte = Folio;


      if (model.Folio === 0) {
        // Add Solicitud de herramientas
        let response = await this.Detalle_Solicitud_de_Herramientas_Crear_reporteService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSolicitud_de_herramientas = this.Solicitud_de_herramientasItemsByFolio(model.Folio);
        if (formSolicitud_de_herramientas.dirty) {
          // Update Solicitud de herramientas
          let response = await this.Detalle_Solicitud_de_Herramientas_Crear_reporteService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Solicitud de herramientas
        await this.Detalle_Solicitud_de_Herramientas_Crear_reporteService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    this.VerificarSolicitud_de_herramientas();
    if (!event.option) {
      return;
    }
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_Solicitud_de_Herramientas_Crear_reporteItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Codigo_Descripcion.setValue(event.option.value);
    this.displayFnCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte(element);
  }

  displayFnCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte(this, element) {
    const index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    return this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte[index];
  }
  updateOptionCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte(event, element: any) {
    const index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte[index] = event.source.viewValue;
  }

  _filterCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte(filter: any): Observable<Herramientas> {
    const where = filter !== '' ? "Herramientas.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.HerramientasService.listaSelAll(0, 20, where);
  }

  addFilterToControlCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte = true;
        return this._filterCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte(value || '');
      })
    ).subscribe(result => {
      this.varHerramientas = result.Herramientass;
      this.isLoadingCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte = false;
      this.searchCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporteCompleted = true;
      this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte[index] = this.varHerramientas.length === 0 ? '' : this.SelectedCodigo_Descripcion_Detalle_Solicitud_de_Herramientas_Crear_reporte[index];
    });
  }
  public selectUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    this.VerificarSolicitud_de_herramientas();
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_Solicitud_de_Herramientas_Crear_reporteItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad.setValue(event.option.value);
    this.displayFnUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte(element);
  }

  displayFnUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte(this, element) {
    const index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    return this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte[index];
  }
  updateOptionUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte(event, element: any) {
    const index = this.dataSourceSolicitud_de_herramientas.data.indexOf(element);
    this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte[index] = event.source.viewValue;
  }

  _filterUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte = true;
        return this._filterUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte = false;
      this.searchUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporteCompleted = true;
      this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_Detalle_Solicitud_de_Herramientas_Crear_reporte[index];
    });
  }

  get RemocionItems() {
    return this.Crear_ReporteForm.get('Detalle_de_Remocion_de_piezasItems') as FormArray;
  }

  getRemocionColumns(): string[] {
    return this.RemocionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadRemocion(Remocion: Detalle_de_Remocion_de_piezas[]) {
    Remocion.forEach(element => {
      this.addRemocion(element);
    });
  }

  async addRemocionToMR() {
    const Remocion = new Detalle_de_Remocion_de_piezas(this.fb);
    this.RemocionData.push(this.addRemocion(Remocion));
    this.dataSourceRemocion.data = this.RemocionData;
    Remocion.edit = true;
    Remocion.isNew = true;
    const length = this.dataSourceRemocion.data.length;
    const index = length - 1;
    const formRemocion = this.RemocionItems.controls[index] as FormGroup;
    this.addFilterToControlN_de_Parte_Detalle_de_Remocion_de_piezas(formRemocion.controls.N_de_Parte, index);
    this.addFilterToControlEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas(formRemocion.controls.Encargado_de_la_remocion, index);

    formRemocion.controls.Estatus.setValue(this.varEstatus_de_remocion.filter(x => x.Descripcion == "Removido")[0].Folio);
    let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`, 1, "ABC123");
    formRemocion.controls.Encargado_de_la_remocion.setValue(username);
    this.SelectedEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas[index] = username;

    formRemocion.controls.N_de_Serie.disable();
    formRemocion.controls.Horas_Actuales.disable();
    formRemocion.controls.Ciclos_Actuales.disable();
    formRemocion.controls.Fecha_de_Remocion.disable();
    formRemocion.controls.Encargado_de_la_remocion.disable();

    this.brf.SetCurrentDateToField(formRemocion, "Fecha_de_Remocion");

    const page = Math.ceil(this.dataSourceRemocion.data.filter(d => !d.IsDeleted).length / this.paginadorRemocion.pageSize);
    if (page !== this.paginadorRemocion.pageIndex) {
      this.paginadorRemocion.pageIndex = page;
    }
  }

  addRemocion(entity: Detalle_de_Remocion_de_piezas) {
    const Remocion = new Detalle_de_Remocion_de_piezas(this.fb);
    this.RemocionItems.push(Remocion.buildFormGroup());
    if (entity) {
      Remocion.fromObject(entity);
    }
    return entity;
  }

  RemocionItemsByFolio(Folio: number): FormGroup {
    return (this.Crear_ReporteForm.get('Detalle_de_Remocion_de_piezasItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  RemocionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceRemocion.data.indexOf(element);
    let fb = this.RemocionItems.controls[index] as FormGroup;
    return fb;
  }

  deleteRemocion(element: any) {
    let index = this.dataSourceRemocion.data.indexOf(element);
    this.RemocionData[index].N_de_Parte = '';
    this.RemocionData[index].N_de_Serie = '';
    this.RemocionData[index].Horas_Actuales = 0;
    this.RemocionData[index].Ciclos_Actuales = 0;
    this.RemocionData[index].Causa_de_remocion = '';
    this.RemocionData[index].Tiempo_de_remocion = '';
    this.RemocionData[index].IsDeleted = true;
    this.dataSourceRemocion.data = this.RemocionData;
    this.dataSourceRemocion._updateChangeSubscription();
    index = this.dataSourceRemocion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorRemocion.pageSize);
    if (page !== this.paginadorRemocion.pageIndex) {
      this.paginadorRemocion.pageIndex = page;
    }
  }

  cancelEditRemocion(element: any) {
    let index = this.dataSourceRemocion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.RemocionData[index].IsDeleted = true;
      this.dataSourceRemocion.data = this.RemocionData;
      this.dataSourceRemocion.data.splice(index, 1);
      this.dataSourceRemocion._updateChangeSubscription();
      index = this.RemocionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorRemocion.pageSize);
      if (page !== this.paginadorRemocion.pageIndex) {
        this.paginadorRemocion.pageIndex = page;
      }
    }
  }

  async saveRemocion(element: any) {
    const index = this.dataSourceRemocion.data.indexOf(element);
    const formRemocion = this.RemocionItems.controls[index] as FormGroup;
    if (this.RemocionData[index].N_de_Parte !== formRemocion.value.N_de_Parte && formRemocion.value.N_de_Parte > 0) {
      let detalle_parte_asociada_al_componente_aeronave = await this.Detalle_Parte_Asociada_al_Componente_AeronaveService.getById(formRemocion.value.N_de_Parte).toPromise();
      this.RemocionData[index].N_de_Parte_Detalle_Parte_Asociada_al_Componente_Aeronave = detalle_parte_asociada_al_componente_aeronave;
    }
    this.RemocionData[index].N_de_Parte = formRemocion.value.N_de_Parte;
    this.RemocionData[index].N_de_Serie = formRemocion.controls.N_de_Serie.value;
    this.RemocionData[index].Estatus = formRemocion.value.Estatus;
    this.RemocionData[index].Estatus_Estatus_de_remocion = formRemocion.value.Estatus !== '' ?
      this.varEstatus_de_remocion.filter(d => d.Folio === formRemocion.value.Estatus)[0] : null;
    this.RemocionData[index].Horas_Actuales = formRemocion.controls.Horas_Actuales.value;
    this.RemocionData[index].Ciclos_Actuales = formRemocion.controls.Ciclos_Actuales.value;
    this.RemocionData[index].Fecha_de_Remocion = formRemocion.controls.Fecha_de_Remocion.value;

    if (this.RemocionData[index].Encargado_de_la_remocion !== formRemocion.controls.Encargado_de_la_remocion.value) {
      let userId = this.localStorageHelper.getItemFromLocalStorage('USERID');
      let spartan_user = await this.Spartan_UserService.getById(Number(userId)).toPromise();
      this.RemocionData[index].Encargado_de_la_remocion_Spartan_User = spartan_user;
    }
    this.RemocionData[index].Encargado_de_la_remocion = Number(this.localStorageHelper.getItemFromLocalStorage('USERID'));

    this.RemocionData[index].Causa_de_remocion = formRemocion.value.Causa_de_remocion;
    this.RemocionData[index].Causa_de_remocion_Causa_de_remocion = formRemocion.value.Causa_de_remocion !== '' ?
      this.varCausa_de_remocion.filter(d => d.Folio === formRemocion.value.Causa_de_remocion)[0] : null;
    this.RemocionData[index].Tiempo_de_remocion = formRemocion.value.Tiempo_de_remocion;
    this.RemocionData[index].Tiempo_de_remocion_Tiempo_de_remocion = formRemocion.value.Tiempo_de_remocion !== '' ?
      this.varTiempo_de_remocion.filter(d => d.Folio === formRemocion.value.Tiempo_de_remocion)[0] : null;

    this.RemocionData[index].isNew = false;
    this.dataSourceRemocion.data = this.RemocionData;
    this.dataSourceRemocion._updateChangeSubscription();
  }

  editRemocion(element: any) {
    const index = this.dataSourceRemocion.data.indexOf(element);
    const formRemocion = this.RemocionItems.controls[index] as FormGroup;

    this.SelectedN_de_Parte_Detalle_de_Remocion_de_piezas[index] = this.dataSourceRemocion.data[index].N_de_Parte_Detalle_Parte_Asociada_al_Componente_Aeronave == undefined ?
      null : this.dataSourceRemocion.data[index].N_de_Parte_Detalle_Parte_Asociada_al_Componente_Aeronave.N_Parte;

    this.addFilterToControlN_de_Parte_Detalle_de_Remocion_de_piezas(formRemocion.controls.N_de_Parte, index);
    this.SelectedEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas[index] = this.dataSourceRemocion.data[index].Encargado_de_la_remocion_Spartan_User.Name;
    this.addFilterToControlEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas(formRemocion.controls.Encargado_de_la_remocion, index);

    element.edit = true;
  }

  async saveDetalle_de_Remocion_de_piezas(Folio: number) {
    this.dataSourceRemocion.data.forEach(async (d, index) => {
      const data = this.RemocionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Crear_Reporte = Folio;
      model.IdRemocion = Folio;
      let userId = await this.brf.EvaluaQueryAsync(`SELECT Id_User FROM Spartan_User WHERE Name = '${model.Encargado_de_la_remocion}'`, 1, "ABC123");
      model.Encargado_de_la_remocion = userId;

      if (model.Folio === 0) {
        // Add Remoción
        let response = await this.Detalle_de_Remocion_de_piezasService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formRemocion = this.RemocionItemsByFolio(model.Folio);
        if (formRemocion.dirty) {
          // Update Remoción
          let response = await this.Detalle_de_Remocion_de_piezasService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Remoción
        await this.Detalle_de_Remocion_de_piezasService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectN_de_Parte_Detalle_de_Remocion_de_piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceRemocion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_de_Parte_Detalle_de_Remocion_de_piezas[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_de_Remocion_de_piezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_de_Parte.setValue(event.option.value);
    this.displayFnN_de_Parte_Detalle_de_Remocion_de_piezas(element);
    this.SetValuesToRowRemocion(data, event.option.value);
  }

  async SetValuesToRowRemocion(data: FormGroup, N_de_Parte: number) {
    let N_de_Serie = await this.brf.EvaluaQueryAsync(`select N_de_Serie from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");
    let Horas_acumuladas_parte = await this.brf.EvaluaQueryAsync(`select Horas_acumuladas_parte from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");
    let Ciclos_acumulados_parte = await this.brf.EvaluaQueryAsync(`select Ciclos_acumulados_parte from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");

    data.controls.N_de_Serie.setValue(N_de_Serie);
    data.controls.Horas_Actuales.setValue(Horas_acumuladas_parte);
    data.controls.Ciclos_Actuales.setValue(Ciclos_acumulados_parte);
  }

  displayFnN_de_Parte_Detalle_de_Remocion_de_piezas(this, element) {
    const index = this.dataSourceRemocion.data.indexOf(element);
    return this.SelectedN_de_Parte_Detalle_de_Remocion_de_piezas[index];
  }
  updateOptionN_de_Parte_Detalle_de_Remocion_de_piezas(event, element: any) {
    const index = this.dataSourceRemocion.data.indexOf(element);
    this.SelectedN_de_Parte_Detalle_de_Remocion_de_piezas[index] = event.source.viewValue;
  }

  _filterN_de_Parte_Detalle_de_Remocion_de_piezas(filter: any): Observable<Detalle_Parte_Asociada_al_Componente_Aeronave> {
    const where = filter !== '' ? "Detalle_Parte_Asociada_al_Componente_Aeronave.N_Parte like '%" + filter + "%'" : '';
    return this.Detalle_Parte_Asociada_al_Componente_AeronaveService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_de_Parte_Detalle_de_Remocion_de_piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_de_Parte_Detalle_de_Remocion_de_piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_de_Parte_Detalle_de_Remocion_de_piezas = true;
        return this._filterN_de_Parte_Detalle_de_Remocion_de_piezas(value || '');
      })
    ).subscribe(result => {
      this.varDetalle_Parte_Asociada_al_Componente_Aeronave = result.Detalle_Parte_Asociada_al_Componente_Aeronaves;
      this.isLoadingN_de_Parte_Detalle_de_Remocion_de_piezas = false;
      this.searchN_de_Parte_Detalle_de_Remocion_de_piezasCompleted = true;
      this.SelectedN_de_Parte_Detalle_de_Remocion_de_piezas[index] = this.varDetalle_Parte_Asociada_al_Componente_Aeronave.length === 0 ? '' : this.SelectedN_de_Parte_Detalle_de_Remocion_de_piezas[index];
    });
  }
  public selectEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceRemocion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_de_Remocion_de_piezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Encargado_de_la_remocion.setValue(event.option.value);
    this.displayFnEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas(element);
  }

  displayFnEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas(this, element) {
    const index = this.dataSourceRemocion.data.indexOf(element);
    return this.SelectedEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas[index];
  }
  updateOptionEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas(event, element: any) {
    const index = this.dataSourceRemocion.data.indexOf(element);
    this.SelectedEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas[index] = event.source.viewValue;
  }

  _filterEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas(filter: any): Observable<Spartan_User> {
    const where = filter !== '' ? "Spartan_User.Name like '%" + filter + "%'" : '';
    return this.Spartan_UserService.listaSelAll(0, 20, where);
  }

  addFilterToControlEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas = true;
        return this._filterEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas = false;
      this.searchEncargado_de_la_remocion_Detalle_de_Remocion_de_piezasCompleted = true;
      this.SelectedEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedEncargado_de_la_remocion_Detalle_de_Remocion_de_piezas[index];
    });
  }

  get InstalacionItems() {
    return this.Crear_ReporteForm.get('Detalle_de_Instalacion_de_piezasItems') as FormArray;
  }

  getInstalacionColumns(): string[] {
    return this.InstalacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadInstalacion(Instalacion: Detalle_de_Instalacion_de_piezas[]) {
    Instalacion.forEach(element => {
      this.addInstalacion(element);
    });
  }

  async addInstalacionToMR() {
    const Instalacion = new Detalle_de_Instalacion_de_piezas(this.fb);
    this.InstalacionData.push(this.addInstalacion(Instalacion));
    this.dataSourceInstalacion.data = this.InstalacionData;
    Instalacion.edit = true;
    Instalacion.isNew = true;
    const length = this.dataSourceInstalacion.data.length;
    const index = length - 1;
    const formInstalacion = this.InstalacionItems.controls[index] as FormGroup;
    this.addFilterToControlN_Parte_Detalle_de_Instalacion_de_piezas(formInstalacion.controls.N_Parte, index);
    this.addFilterToControlEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas(formInstalacion.controls.Encargado_de_la_instalacion, index);

    formInstalacion.controls.Estatus_de_remocion.setValue(this.varEstatus_de_remocion.filter(x => x.Descripcion == "Instalado")[0].Folio);
    let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`, 1, "ABC123");
    formInstalacion.controls.Encargado_de_la_instalacion.setValue(username);
    this.SelectedEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas[index] = username;

    formInstalacion.controls.Fecha_de_Reparacion.disable();
    formInstalacion.controls.Fecha_de_Instalacion.disable();
    formInstalacion.controls.Encargado_de_la_instalacion.disable();
    formInstalacion.controls.Estatus_de_remocion.disable();

    this.brf.SetCurrentDateToField(formInstalacion, "Fecha_de_Instalacion");

    const page = Math.ceil(this.dataSourceInstalacion.data.filter(d => !d.IsDeleted).length / this.paginadorInstalacion.pageSize);
    if (page !== this.paginadorInstalacion.pageIndex) {
      this.paginadorInstalacion.pageIndex = page;
    }
  }

  addInstalacion(entity: Detalle_de_Instalacion_de_piezas) {
    const Instalacion = new Detalle_de_Instalacion_de_piezas(this.fb);
    this.InstalacionItems.push(Instalacion.buildFormGroup());
    if (entity) {
      Instalacion.fromObject(entity);
    }
    return entity;
  }

  InstalacionItemsByFolio(Folio: number): FormGroup {
    return (this.Crear_ReporteForm.get('Detalle_de_Instalacion_de_piezasItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  InstalacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceInstalacion.data.indexOf(element);
    let fb = this.InstalacionItems.controls[index] as FormGroup;
    return fb;
  }

  deleteInstalacion(element: any) {
    let index = this.dataSourceInstalacion.data.indexOf(element);
    this.InstalacionData[index].Descripcion = '';
    this.InstalacionData[index].N_Parte = '';
    this.InstalacionData[index].N_de_serie = '';
    this.InstalacionData[index].Posicion = '';
    this.InstalacionData[index].Estatus = '';
    this.InstalacionData[index].Horas_acumuladas_parte = 0;
    this.InstalacionData[index].Fecha_de_Fabricacion = '';
    this.InstalacionData[index].Meses_Acumulados_Parte = 0;
    this.InstalacionData[index].Fecha_de_Reparacion = '';
    this.InstalacionData[index].Tipo_de_Vencimiento = '';
    this.InstalacionData[index].Limite_de_Horas = 0;
    this.InstalacionData[index].Limite_de_Meses = 0;
    this.InstalacionData[index].IsDeleted = true;
    this.dataSourceInstalacion.data = this.InstalacionData;
    this.dataSourceInstalacion._updateChangeSubscription();
    index = this.dataSourceInstalacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorInstalacion.pageSize);
    if (page !== this.paginadorInstalacion.pageIndex) {
      this.paginadorInstalacion.pageIndex = page;
    }
  }

  cancelEditInstalacion(element: any) {
    let index = this.dataSourceInstalacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.InstalacionData[index].IsDeleted = true;
      this.dataSourceInstalacion.data = this.InstalacionData;
      this.dataSourceInstalacion.data.splice(index, 1);
      this.dataSourceInstalacion._updateChangeSubscription();
      index = this.InstalacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorInstalacion.pageSize);
      if (page !== this.paginadorInstalacion.pageIndex) {
        this.paginadorInstalacion.pageIndex = page;
      }
    }
  }

  async saveInstalacion(element: any) {
    const index = this.dataSourceInstalacion.data.indexOf(element);
    const formInstalacion = this.InstalacionItems.controls[index] as FormGroup;
    this.InstalacionData[index].Descripcion = formInstalacion.value.Descripcion;
    if (this.InstalacionData[index].N_Parte !== formInstalacion.value.N_Parte && formInstalacion.value.N_Parte > 0) {
      let detalle_parte_asociada_al_componente_aeronave = await this.Detalle_Parte_Asociada_al_Componente_AeronaveService.getById(formInstalacion.value.N_Parte).toPromise();
      this.InstalacionData[index].N_Parte_Detalle_Parte_Asociada_al_Componente_Aeronave = detalle_parte_asociada_al_componente_aeronave;
    }
    this.InstalacionData[index].N_Parte = formInstalacion.value.N_Parte;
    this.InstalacionData[index].N_de_serie = formInstalacion.value.N_de_serie;
    this.InstalacionData[index].Modelo = formInstalacion.value.Modelo;
    this.InstalacionData[index].Posicion = formInstalacion.value.Posicion;
    this.InstalacionData[index].Estatus = formInstalacion.value.Estatus;
    this.InstalacionData[index].Estatus_Tipos_de_Origen_del_Componente = formInstalacion.value.Estatus !== '' ?
      this.varTipos_de_Origen_del_Componente.filter(d => d.Clave === formInstalacion.value.Estatus)[0] : null;
    this.InstalacionData[index].Horas_acumuladas_parte = formInstalacion.value.Horas_acumuladas_parte;
    this.InstalacionData[index].Ciclos_acumulados_parte = formInstalacion.value.Ciclos_acumulados_parte;
    this.InstalacionData[index].Fecha_de_Fabricacion = formInstalacion.value.Fecha_de_Fabricacion;
    this.InstalacionData[index].Meses_Acumulados_Parte = formInstalacion.value.Meses_Acumulados_Parte;

    this.InstalacionData[index].Fecha_de_Reparacion = formInstalacion.controls.Fecha_de_Reparacion.value;
    this.InstalacionData[index].Fecha_de_Instalacion = formInstalacion.controls.Fecha_de_Instalacion.value;

    if (this.InstalacionData[index].Encargado_de_la_instalacion !== formInstalacion.controls.Encargado_de_la_instalacion.value) {
      let userId = this.localStorageHelper.getItemFromLocalStorage('USERID');
      let spartan_user = await this.Spartan_UserService.getById(Number(userId)).toPromise();
      this.InstalacionData[index].Encargado_de_la_instalacion_Spartan_User = spartan_user;
    }
    this.InstalacionData[index].Encargado_de_la_instalacion = Number(this.localStorageHelper.getItemFromLocalStorage('USERID'));
    this.InstalacionData[index].Tipo_de_Vencimiento = formInstalacion.value.Tipo_de_Vencimiento;
    this.InstalacionData[index].Tipo_de_Vencimiento_Catalogo_Tipo_de_Vencimiento = formInstalacion.value.Tipo_de_Vencimiento !== '' ?
      this.varCatalogo_Tipo_de_Vencimiento.filter(d => d.Clave === formInstalacion.value.Tipo_de_Vencimiento)[0] : null;
    this.InstalacionData[index].Limite_de_Horas = formInstalacion.value.Limite_de_Horas;
    this.InstalacionData[index].Limite_de_Ciclos = formInstalacion.value.Limite_de_Ciclos;
    this.InstalacionData[index].Limite_de_Meses = formInstalacion.controls.Limite_de_Meses.value;
    this.InstalacionData[index].Estatus_de_remocion = formInstalacion.controls.Estatus_de_remocion.value;
    this.InstalacionData[index].Estatus_de_remocion_Estatus_de_remocion = formInstalacion.controls.Estatus_de_remocion.value !== '' ?
      this.varEstatus_de_remocion.filter(d => d.Folio === formInstalacion.controls.Estatus_de_remocion.value)[0] : null;

    this.InstalacionData[index].isNew = false;
    this.dataSourceInstalacion.data = this.InstalacionData;
    this.dataSourceInstalacion._updateChangeSubscription();
  }

  editInstalacion(element: any) {
    const index = this.dataSourceInstalacion.data.indexOf(element);
    const formInstalacion = this.InstalacionItems.controls[index] as FormGroup;

    this.SelectedN_Parte_Detalle_de_Instalacion_de_piezas[index] = this.dataSourceInstalacion.data[index].N_Parte_Detalle_Parte_Asociada_al_Componente_Aeronave == undefined ?
      null : this.dataSourceInstalacion.data[index].N_Parte_Detalle_Parte_Asociada_al_Componente_Aeronave.N_Parte;

    this.addFilterToControlN_Parte_Detalle_de_Instalacion_de_piezas(formInstalacion.controls.N_Parte, index);
    this.SelectedEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas[index] = this.dataSourceInstalacion.data[index].Encargado_de_la_instalacion_Spartan_User.Name;
    this.addFilterToControlEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas(formInstalacion.controls.Encargado_de_la_instalacion, index);

    element.edit = true;
  }

  async saveDetalle_de_Instalacion_de_piezas(Folio: number) {
    this.dataSourceInstalacion.data.forEach(async (d, index) => {
      const data = this.InstalacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Crear_Reporte = Folio;
      model.id_Instalacion = Folio;
      let userId = await this.brf.EvaluaQueryAsync(`SELECT Id_User FROM Spartan_User WHERE Name = '${model.Encargado_de_la_instalacion}'`, 1, "ABC123");
      model.Encargado_de_la_instalacion = userId;

      if (model.Folio === 0) {
        // Add Instalación
        let response = await this.Detalle_de_Instalacion_de_piezasService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formInstalacion = this.InstalacionItemsByFolio(model.Folio);
        if (formInstalacion.dirty) {
          // Update Instalación
          let response = await this.Detalle_de_Instalacion_de_piezasService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Instalación
        await this.Detalle_de_Instalacion_de_piezasService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectN_Parte_Detalle_de_Instalacion_de_piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceInstalacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_Parte_Detalle_de_Instalacion_de_piezas[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_de_Instalacion_de_piezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Parte.setValue(event.option.value);
    this.displayFnN_Parte_Detalle_de_Instalacion_de_piezas(element);
    this.SetValuesToRowInstalacion(data, event.option.value);
  }

  async SetValuesToRowInstalacion(data: FormGroup, N_de_Parte: number) {
    let Limite_de_ciclos = await this.brf.EvaluaQueryAsync(`select Limite_de_ciclos from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");
    let Modelo = await this.brf.EvaluaQueryAsync(`select Modelo from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");
    let N_de_Serie = await this.brf.EvaluaQueryAsync(`select N_de_Serie from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");
    let Horas_acumuladas_parte = await this.brf.EvaluaQueryAsync(`exec sp_obtener_horas_acumuladas_parte_instalada ${N_de_Parte}, ${N_de_Serie}`, 1, "ABC123");
    let Ciclos_acumulados_parte = await this.brf.EvaluaQueryAsync(`exec sp_obtener_ciclos_acumuladas_parte_instalada ${N_de_Parte}, ${N_de_Serie}`, 1, "ABC123");
    let Descripcion = await this.brf.EvaluaQueryAsync(`select Descripcion_de_la_parte from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");
    let Posicion = await this.brf.EvaluaQueryAsync(`select Posicion_de_la_pieza from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio= ${N_de_Parte}`, 1, "ABC123");
    let Fecha_de_Fabricacion = await this.brf.EvaluaQueryAsync(`select convert (varchar(11),Fecha_de_fabricacion,105) from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");
    let Limite_de_Meses = await this.brf.EvaluaQueryAsync(`select Limite_de_meses from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");
    let Limite_de_Horas = await this.brf.EvaluaQueryAsync(`select Limite_de_horas from Detalle_Parte_Asociada_al_Componente_Aeronave where Folio = ${N_de_Parte}`, 1, "ABC123");

    data.controls.Limite_de_Ciclos.setValue(Limite_de_ciclos);
    data.controls.Modelo.setValue(Modelo);
    data.controls.N_de_serie.setValue(N_de_Serie);
    data.controls.Horas_acumuladas_parte.setValue(Horas_acumuladas_parte);
    data.controls.Ciclos_acumulados_parte.setValue(Ciclos_acumulados_parte);
    data.controls.Descripcion.setValue(Descripcion);
    data.controls.Posicion.setValue(Posicion);
    data.controls.Fecha_de_Fabricacion.setValue(Fecha_de_Fabricacion);
    data.controls.Limite_de_Meses.setValue(Limite_de_Meses);
    data.controls.Limite_de_Horas.setValue(Limite_de_Horas);
  }

  displayFnN_Parte_Detalle_de_Instalacion_de_piezas(this, element) {
    const index = this.dataSourceInstalacion.data.indexOf(element);
    return this.SelectedN_Parte_Detalle_de_Instalacion_de_piezas[index];
  }
  updateOptionN_Parte_Detalle_de_Instalacion_de_piezas(event, element: any) {
    const index = this.dataSourceInstalacion.data.indexOf(element);
    this.SelectedN_Parte_Detalle_de_Instalacion_de_piezas[index] = event.source.viewValue;
  }

  _filterN_Parte_Detalle_de_Instalacion_de_piezas(filter: any): Observable<Detalle_Parte_Asociada_al_Componente_Aeronave> {
    const where = filter !== '' ? "Detalle_Parte_Asociada_al_Componente_Aeronave.N_Parte like '%" + filter + "%'" : '';
    return this.Detalle_Parte_Asociada_al_Componente_AeronaveService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Parte_Detalle_de_Instalacion_de_piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Parte_Detalle_de_Instalacion_de_piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Parte_Detalle_de_Instalacion_de_piezas = true;
        return this._filterN_Parte_Detalle_de_Instalacion_de_piezas(value || '');
      })
    ).subscribe(result => {
      this.varDetalle_Parte_Asociada_al_Componente_Aeronave = result.Detalle_Parte_Asociada_al_Componente_Aeronaves;
      this.isLoadingN_Parte_Detalle_de_Instalacion_de_piezas = false;
      this.searchN_Parte_Detalle_de_Instalacion_de_piezasCompleted = true;
      this.SelectedN_Parte_Detalle_de_Instalacion_de_piezas[index] = this.varDetalle_Parte_Asociada_al_Componente_Aeronave.length === 0 ? '' : this.SelectedN_Parte_Detalle_de_Instalacion_de_piezas[index];
    });
  }
  public selectEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceInstalacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_de_Instalacion_de_piezasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Encargado_de_la_instalacion.setValue(event.option.value);
    this.displayFnEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas(element);
  }

  displayFnEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas(this, element) {
    const index = this.dataSourceInstalacion.data.indexOf(element);
    return this.SelectedEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas[index];
  }
  updateOptionEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas(event, element: any) {
    const index = this.dataSourceInstalacion.data.indexOf(element);
    this.SelectedEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas[index] = event.source.viewValue;
  }

  _filterEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas(filter: any): Observable<Spartan_User> {
    const where = filter !== '' ? "Spartan_User.Name like '%" + filter + "%'" : '';
    return this.Spartan_UserService.listaSelAll(0, 20, where);
  }

  addFilterToControlEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas = true;
        return this._filterEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas = false;
      this.searchEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezasCompleted = true;
      this.SelectedEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedEncargado_de_la_instalacion_Detalle_de_Instalacion_de_piezas[index];
    });
  }

  get EjecutantesItems() {
    return this.Crear_ReporteForm.get('Detalle_tiempo_ejecutantes_crear_reporteItems') as FormArray;
  }

  getEjecutantesColumns(): string[] {
    return this.EjecutantesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadEjecutantes(Ejecutantes: Detalle_tiempo_ejecutantes_crear_reporte[]) {
    Ejecutantes.forEach(element => {
      this.addEjecutantes(element);
    });
  }

  addEjecutantesToMR() {
    const Ejecutantes = new Detalle_tiempo_ejecutantes_crear_reporte(this.fb);
    this.EjecutantesData.push(this.addEjecutantes(Ejecutantes));
    this.dataSourceEjecutantes.data = this.EjecutantesData;
    Ejecutantes.edit = true;
    Ejecutantes.isNew = true;
    const length = this.dataSourceEjecutantes.data.length;
    const index = length - 1;
    const formEjecutantes = this.EjecutantesItems.controls[index] as FormGroup;
    this.addFilterToControlEjecutante_Detalle_tiempo_ejecutantes_crear_reporte(formEjecutantes.controls.Ejecutante, index);

    const page = Math.ceil(this.dataSourceEjecutantes.data.filter(d => !d.IsDeleted).length / this.paginadorEjecutantes.pageSize);
    if (page !== this.paginadorEjecutantes.pageIndex) {
      this.paginadorEjecutantes.pageIndex = page;
    }
  }

  addEjecutantes(entity: Detalle_tiempo_ejecutantes_crear_reporte) {
    const Ejecutantes = new Detalle_tiempo_ejecutantes_crear_reporte(this.fb);
    this.EjecutantesItems.push(Ejecutantes.buildFormGroup());
    if (entity) {
      Ejecutantes.fromObject(entity);
    }
    return entity;
  }

  EjecutantesItemsByFolio(Folio: number): FormGroup {
    return (this.Crear_ReporteForm.get('Detalle_tiempo_ejecutantes_crear_reporteItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  EjecutantesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceEjecutantes.data.indexOf(element);
    let fb = this.EjecutantesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteEjecutantes(element: any) {
    let index = this.dataSourceEjecutantes.data.indexOf(element);
    this.EjecutantesData[index].IsDeleted = true;
    this.dataSourceEjecutantes.data = this.EjecutantesData;
    this.dataSourceEjecutantes._updateChangeSubscription();
    index = this.dataSourceEjecutantes.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorEjecutantes.pageSize);
    if (page !== this.paginadorEjecutantes.pageIndex) {
      this.paginadorEjecutantes.pageIndex = page;
    }
  }

  cancelEditEjecutantes(element: any) {
    let index = this.dataSourceEjecutantes.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.EjecutantesData[index].IsDeleted = true;
      this.dataSourceEjecutantes.data = this.EjecutantesData;
      this.dataSourceEjecutantes._updateChangeSubscription();
      index = this.EjecutantesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorEjecutantes.pageSize);
      if (page !== this.paginadorEjecutantes.pageIndex) {
        this.paginadorEjecutantes.pageIndex = page;
      }
    }
  }

  async saveEjecutantes(element: any) {
    const index = this.dataSourceEjecutantes.data.indexOf(element);
    const formEjecutantes = this.EjecutantesItems.controls[index] as FormGroup;
    if (this.EjecutantesData[index].Ejecutante !== formEjecutantes.value.Ejecutante && formEjecutantes.value.Ejecutante > 0) {
      let spartan_user = await this.Spartan_UserService.getById(formEjecutantes.value.Ejecutante).toPromise();
      this.EjecutantesData[index].Ejecutante_Spartan_User = spartan_user;
    }
    this.EjecutantesData[index].Ejecutante = formEjecutantes.value.Ejecutante;
    this.EjecutantesData[index].Fecha = formEjecutantes.value.Fecha;
    this.EjecutantesData[index].Hora_inicial = formEjecutantes.value.Hora_inicial;
    this.EjecutantesData[index].Hora_final = formEjecutantes.value.Hora_final;
    this.EjecutantesData[index].Tiempo_ejecucion_en_hrs = formEjecutantes.value.Tiempo_ejecucion_en_hrs;
    this.EjecutantesData[index].Motivo_de_pausa = formEjecutantes.value.Motivo_de_pausa;

    this.EjecutantesData[index].isNew = false;
    this.dataSourceEjecutantes.data = this.EjecutantesData;
    this.dataSourceEjecutantes._updateChangeSubscription();
  }

  editEjecutantes(element: any) {
    const index = this.dataSourceEjecutantes.data.indexOf(element);
    const formEjecutantes = this.EjecutantesItems.controls[index] as FormGroup;
    this.SelectedEjecutante_Detalle_tiempo_ejecutantes_crear_reporte[index] = this.dataSourceEjecutantes.data[index].Ejecutante_Spartan_User.Name;
    this.addFilterToControlEjecutante_Detalle_tiempo_ejecutantes_crear_reporte(formEjecutantes.controls.Ejecutante, index);

    element.edit = true;
  }

  async saveDetalle_tiempo_ejecutantes_crear_reporte(Folio: number) {
    this.dataSourceEjecutantes.data.forEach(async (d, index) => {
      const data = this.EjecutantesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Crear_Reporte = Folio;


      if (model.Folio === 0) {
        // Add Ejecutantes
        let response = await this.Detalle_tiempo_ejecutantes_crear_reporteService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formEjecutantes = this.EjecutantesItemsByFolio(model.Folio);
        if (formEjecutantes.dirty) {
          // Update Ejecutantes
          let response = await this.Detalle_tiempo_ejecutantes_crear_reporteService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Ejecutantes
        await this.Detalle_tiempo_ejecutantes_crear_reporteService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectEjecutante_Detalle_tiempo_ejecutantes_crear_reporte(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceEjecutantes.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedEjecutante_Detalle_tiempo_ejecutantes_crear_reporte[index] = event.option.viewValue;
    let fgr = this.Crear_ReporteForm.controls.Detalle_tiempo_ejecutantes_crear_reporteItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Ejecutante.setValue(event.option.value);
    this.displayFnEjecutante_Detalle_tiempo_ejecutantes_crear_reporte(element);
  }

  displayFnEjecutante_Detalle_tiempo_ejecutantes_crear_reporte(this, element) {
    const index = this.dataSourceEjecutantes.data.indexOf(element);
    return this.SelectedEjecutante_Detalle_tiempo_ejecutantes_crear_reporte[index];
  }
  updateOptionEjecutante_Detalle_tiempo_ejecutantes_crear_reporte(event, element: any) {
    const index = this.dataSourceEjecutantes.data.indexOf(element);
    this.SelectedEjecutante_Detalle_tiempo_ejecutantes_crear_reporte[index] = event.source.viewValue;
  }

  _filterEjecutante_Detalle_tiempo_ejecutantes_crear_reporte(filter: any): Observable<Spartan_User> {
    const where = filter !== '' ? "Spartan_User.Name like '%" + filter + "%'" : '';
    return this.Spartan_UserService.listaSelAll(0, 20, where);
  }

  addFilterToControlEjecutante_Detalle_tiempo_ejecutantes_crear_reporte(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingEjecutante_Detalle_tiempo_ejecutantes_crear_reporte = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingEjecutante_Detalle_tiempo_ejecutantes_crear_reporte = true;
        return this._filterEjecutante_Detalle_tiempo_ejecutantes_crear_reporte(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingEjecutante_Detalle_tiempo_ejecutantes_crear_reporte = false;
      this.searchEjecutante_Detalle_tiempo_ejecutantes_crear_reporteCompleted = true;
      this.SelectedEjecutante_Detalle_tiempo_ejecutantes_crear_reporte[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedEjecutante_Detalle_tiempo_ejecutantes_crear_reporte[index];
    });
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      async params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          //this.operation =  !this.Crear_ReporteForm.disabled ? "Update" : this.operation;
          this.operation = !this.router.url.includes('/consult/') ? "Update" : this.operation;
          await this.populateModel(this.model.Folio);
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
    observablesArray.push(this.Tipo_orden_de_servicioService.getAll());
    observablesArray.push(this.Prioridad_del_ReporteService.getAll());
    observablesArray.push(this.Tipo_de_Orden_de_TrabajoService.getAll());
    observablesArray.push(this.Estatus_de_ReporteService.getAll());
    observablesArray.push(this.Tipo_de_origen_del_reporteService.getAll());
    observablesArray.push(this.Tipo_de_ReporteService.getAll());
    observablesArray.push(this.UrgenciaService.getAll());
    observablesArray.push(this.Existencia_solicitud_crear_reporteService.getAll());




    observablesArray.push(this.Estatus_de_remocionService.getAll());
    observablesArray.push(this.Causa_de_remocionService.getAll());
    observablesArray.push(this.Tiempo_de_remocionService.getAll());

    observablesArray.push(this.Tipos_de_Origen_del_ComponenteService.getAll());
    observablesArray.push(this.Catalogo_Tipo_de_VencimientoService.getAll());


    observablesArray.push(this.Ayuda_de_respuesta_crear_reporteService.getAll());
    observablesArray.push(this.Resultado_aprobacion_crear_reporteService.getAll());

    observablesArray.push(this.UnidadService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varTipo_orden_de_servicio, varPrioridad_del_Reporte, varTipo_de_Orden_de_Trabajo, varEstatus_de_Reporte, varTipo_de_origen_del_reporte, varTipo_de_Reporte,
          varUrgencia, varExistencia_solicitud_crear_reporte, varEstatus_de_remocion, varCausa_de_remocion, varTiempo_de_remocion, varTipos_de_Origen_del_Componente,
          varCatalogo_Tipo_de_Vencimiento, varAyuda_de_respuesta_crear_reporte, varResultado_aprobacion_crear_reporte, varUnidad]) => {
          this.varTipo_orden_de_servicio = varTipo_orden_de_servicio;
          this.varPrioridad_del_Reporte = varPrioridad_del_Reporte;
          this.varTipo_de_Orden_de_Trabajo = varTipo_de_Orden_de_Trabajo;
          this.varEstatus_de_Reporte = varEstatus_de_Reporte;
          this.varTipo_de_origen_del_reporte = varTipo_de_origen_del_reporte;
          this.varTipo_de_Reporte = varTipo_de_Reporte;
          this.varUrgencia = varUrgencia;
          this.varExistencia_solicitud_crear_reporte = varExistencia_solicitud_crear_reporte;

          this.varEstatus_de_remocion = varEstatus_de_remocion;
          this.varCausa_de_remocion = varCausa_de_remocion;
          this.varTiempo_de_remocion = varTiempo_de_remocion;

          this.varTipos_de_Origen_del_Componente = varTipos_de_Origen_del_Componente;
          this.varCatalogo_Tipo_de_Vencimiento = varCatalogo_Tipo_de_Vencimiento;

          this.varAyuda_de_respuesta_crear_reporte = varAyuda_de_respuesta_crear_reporte;
          this.varResultado_aprobacion_crear_reporte = varResultado_aprobacion_crear_reporte;

          this.varUnidad = varUnidad;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Crear_ReporteForm.get('N_Orden_de_Trabajo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingN_Orden_de_Trabajo = true),
      distinctUntilChanged(),
      switchMap(value => {

        let matricula: string = "";

        matricula = this.Crear_ReporteForm.get('Matricula').value.Matricula == undefined ?
          this.Crear_ReporteForm.get('Matricula').value : this.Crear_ReporteForm.get('Matricula').value.Matricula;

        this.NOrdenDeTrabajo = value;
        if (!value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
          return this.Orden_de_TrabajoService.listaSelAll(0, 20,
            "Orden_de_Trabajo.Matricula = '" + matricula + "' and Orden_de_Trabajo.numero_de_orden like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Orden_de_TrabajoService.listaSelAll(0, 20,
          "Orden_de_Trabajo.Matricula = '" + matricula + "' and Orden_de_Trabajo.numero_de_orden like '%" + value.numero_de_orden.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingN_Orden_de_Trabajo = false;
      this.hasOptionsN_Orden_de_Trabajo = result?.Orden_de_Trabajos?.length > 0;

      if (this.NOrdenDeTrabajo != undefined && this.NOrdenDeTrabajo != "") {
        this.Crear_ReporteForm.get('N_Orden_de_Trabajo').setValue(result?.Orden_de_Trabajos[0], { onlySelf: true, emitEvent: false });
      }

      this.optionsN_Orden_de_Trabajo = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingN_Orden_de_Trabajo = false;
      this.hasOptionsN_Orden_de_Trabajo = false;
      this.optionsN_Orden_de_Trabajo = of([]);
    });

    this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo__de_Orden_de_Servicio = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.NodeOrdendeServicio = value;
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
      this.isLoadingNo__de_Orden_de_Servicio = false;
      this.hasOptionsNo__de_Orden_de_Servicio = result?.Orden_de_servicios?.length > 0;

      if (this.NodeOrdendeServicio != undefined && this.NodeOrdendeServicio != "") {
        this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').setValue(result?.Orden_de_servicios[0], { onlySelf: true, emitEvent: false });
      }

      this.optionsNo__de_Orden_de_Servicio = of(result?.Orden_de_servicios);
    }, error => {
      this.isLoadingNo__de_Orden_de_Servicio = false;
      this.hasOptionsNo__de_Orden_de_Servicio = false;
      this.optionsNo__de_Orden_de_Servicio = of([]);
    });
    this.Crear_ReporteForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.MatriculaSeleccionada = value;
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

      if (this.MatriculaSeleccionada != undefined && this.MatriculaSeleccionada != "") {
        if (this.operation == "Update") {
          this.Crear_ReporteForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
        }
      }

      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Crear_ReporteForm.get('Codigo_computarizado_Descripcion').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCodigo_computarizado_Descripcion = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.CodigocomputarizadoDescripcion = value;
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
      this.isLoadingCodigo_computarizado_Descripcion = false;
      this.hasOptionsCodigo_computarizado_Descripcion = result?.Codigo_Computarizados?.length > 0;

      if (this.CodigocomputarizadoDescripcion != null && this.CodigocomputarizadoDescripcion != "") {
        this.Crear_ReporteForm.get('Codigo_computarizado_Descripcion').setValue(result?.Codigo_Computarizados[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsCodigo_computarizado_Descripcion = of(result?.Codigo_Computarizados);
    }, error => {
      this.isLoadingCodigo_computarizado_Descripcion = false;
      this.hasOptionsCodigo_computarizado_Descripcion = false;
      this.optionsCodigo_computarizado_Descripcion = of([]);
    });
    this.Crear_ReporteForm.get('Codigo_ATA').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCodigo_ATA = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.CodigoATA = value;
        if (!value) return this.Catalogo_codigo_ATAService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Catalogo_codigo_ATAService.listaSelAll(0, 20, '');
          return this.Catalogo_codigo_ATAService.listaSelAll(0, 20,
            "Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Catalogo_codigo_ATAService.listaSelAll(0, 20,
          "Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + value.Codigo_ATA_Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCodigo_ATA = false;
      this.hasOptionsCodigo_ATA = result?.Catalogo_codigo_ATAs?.length > 0;

      if (this.CodigoATA != null && this.CodigoATA != "") {
        this.Crear_ReporteForm.get('Codigo_ATA').setValue(result?.Catalogo_codigo_ATAs[0], { onlySelf: true, emitEvent: false });
      }

      this.optionsCodigo_ATA = of(result?.Catalogo_codigo_ATAs);
    }, error => {
      this.isLoadingCodigo_ATA = false;
      this.hasOptionsCodigo_ATA = false;
      this.optionsCodigo_ATA = of([]);
    });
    this.Crear_ReporteForm.get('Respondiente_resp').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingRespondiente_resp = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.UsuarioRespondiente = value;
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
      this.isLoadingRespondiente_resp = false;
      this.hasOptionsRespondiente_resp = result?.Spartan_Users?.length > 0;

      if (this.UsuarioRespondiente != null && this.UsuarioRespondiente != "") {
        this.Crear_ReporteForm.get('Respondiente_resp').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      }

      this.optionsRespondiente_resp = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingRespondiente_resp = false;
      this.hasOptionsRespondiente_resp = false;
      this.optionsRespondiente_resp = of([]);
    });
    this.Crear_ReporteForm.get('Supervisor').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingSupervisor = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.SupervisorEditar = value;
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
      this.isLoadingSupervisor = false;
      this.hasOptionsSupervisor = result?.Spartan_Users?.length > 0;

      if (this.SupervisorEditar != null && this.SupervisorEditar != "") {
        this.Crear_ReporteForm.get('Supervisor').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsSupervisor = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingSupervisor = false;
      this.hasOptionsSupervisor = false;
      this.optionsSupervisor = of([]);
    });
    this.Crear_ReporteForm.get('Inspector').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingInspector = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.InspectorEditar = value;
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
      this.isLoadingInspector = false;
      this.hasOptionsInspector = result?.Spartan_Users?.length > 0;

      if (this.InspectorEditar != null && this.InspectorEditar != "") {
        this.Crear_ReporteForm.get('Inspector').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      }

      this.optionsInspector = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingInspector = false;
      this.hasOptionsInspector = false;
      this.optionsInspector = of([]);
    });
    this.Crear_ReporteForm.get('Programador_de_mantenimiento').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingProgramador_de_mantenimiento = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.ProgramadorEditar = value;
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
      this.isLoadingProgramador_de_mantenimiento = false;
      this.hasOptionsProgramador_de_mantenimiento = result?.Spartan_Users?.length > 0;

      if (this.ProgramadorEditar != null && this.ProgramadorEditar != "") {
        this.Crear_ReporteForm.get('Programador_de_mantenimiento').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsProgramador_de_mantenimiento = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingProgramador_de_mantenimiento = false;
      this.hasOptionsProgramador_de_mantenimiento = false;
      this.optionsProgramador_de_mantenimiento = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tipo_de_reporte_OS': {
        this.Tipo_orden_de_servicioService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_orden_de_servicio = x.Tipo_orden_de_servicios;
        });
        break;
      }
      case 'Prioridad_del_reporte': {
        this.Prioridad_del_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varPrioridad_del_Reporte = x.Prioridad_del_Reportes;
        });
        break;
      }
      case 'Tipo_de_orden_de_trabajo': {
        this.Tipo_de_Orden_de_TrabajoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Orden_de_Trabajo = x.Tipo_de_Orden_de_Trabajos;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_de_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Reporte = x.Estatus_de_Reportes;
        });
        break;
      }
      case 'Origen_del_reporte': {
        this.Tipo_de_origen_del_reporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_origen_del_reporte = x.Tipo_de_origen_del_reportes;
        });
        break;
      }
      case 'Tipo_de_reporte': {
        this.Tipo_de_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Reporte = x.Tipo_de_Reportes;
        });
        break;
      }
      case 'Urgencia': {
        this.UrgenciaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUrgencia = x.Urgencias;
        });
        break;
      }
      case 'En_Existencia': {
        this.Existencia_solicitud_crear_reporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varExistencia_solicitud_crear_reporte = x.Existencia_solicitud_crear_reportes;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_de_remocionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_remocion = x.Estatus_de_remocions;
        });
        break;
      }
      case 'Causa_de_remocion': {
        this.Causa_de_remocionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCausa_de_remocion = x.Causa_de_remocions;
        });
        break;
      }
      case 'Tiempo_de_remocion': {
        this.Tiempo_de_remocionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTiempo_de_remocion = x.Tiempo_de_remocions;
        });
        break;
      }
      case 'Estatus': {
        this.Tipos_de_Origen_del_ComponenteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipos_de_Origen_del_Componente = x.Tipos_de_Origen_del_Componentes;
        });
        break;
      }
      case 'Tipo_de_Vencimiento': {
        this.Catalogo_Tipo_de_VencimientoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCatalogo_Tipo_de_Vencimiento = x.Catalogo_Tipo_de_Vencimientos;
        });
        break;
      }
      case 'Estatus_de_remocion': {
        this.Estatus_de_remocionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_remocion = x.Estatus_de_remocions;
        });
        break;
      }
      case 'Ayuda_de_respuesta_resp': {
        this.Ayuda_de_respuesta_crear_reporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAyuda_de_respuesta_crear_reporte = x.Ayuda_de_respuesta_crear_reportes;
        });
        break;
      }
      case 'Resultado_sup': {
        this.Resultado_aprobacion_crear_reporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varResultado_aprobacion_crear_reporte = x.Resultado_aprobacion_crear_reportes;
        });
        break;
      }
      case 'Resultado_ins': {
        this.Resultado_aprobacion_crear_reporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varResultado_aprobacion_crear_reporte = x.Resultado_aprobacion_crear_reportes;
        });
        break;
      }
      case 'Resultado_pro': {
        this.Resultado_aprobacion_crear_reporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varResultado_aprobacion_crear_reporte = x.Resultado_aprobacion_crear_reportes;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnN_Orden_de_Trabajo(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
  displayFnNo__de_Orden_de_Servicio(option: Orden_de_servicio) {
    return option?.Folio_OS;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnCodigo_computarizado_Descripcion(option: Codigo_Computarizado) {
    return option?.Descripcion_Busqueda;
  }
  displayFnCodigo_ATA(option: Catalogo_codigo_ATA) {
    return option?.Codigo_ATA_Descripcion;
  }
  displayFnRespondiente_resp(option: Spartan_User) {
    return option?.Name;
  }
  displayFnSupervisor(option: Spartan_User) {
    return option?.Name == undefined ? option : option?.Name;
  }
  displayFnInspector(option: Spartan_User) {
    return option?.Name == undefined ? option : option?.Name;
  }
  displayFnProgramador_de_mantenimiento(option: Spartan_User) {
    return option?.Name == undefined ? option : option?.Name;
  }


  async save() {
    await this.saveData();

  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Crear_ReporteForm.value;
      entity.Folio = this.model.Folio;
      entity.N_Orden_de_Trabajo = this.Crear_ReporteForm.get('N_Orden_de_Trabajo').value?.Folio;
      entity.No__de_Orden_de_Servicio = this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value == null ? null : this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value?.Folio;
      entity.Matricula = this.Crear_ReporteForm.get('Matricula').value?.Matricula;
      entity.Codigo_computarizado_Descripcion = this.Crear_ReporteForm.get('Codigo_computarizado_Descripcion').value == null ? null : this.Crear_ReporteForm.get('Codigo_computarizado_Descripcion').value?.Codigo;
      entity.Codigo_ATA = this.Crear_ReporteForm.get('Codigo_ATA').value == null ? null : this.Crear_ReporteForm.get('Codigo_ATA').value?.Folio;
      entity.Respondiente_resp = this.Crear_ReporteForm.get('Respondiente_resp').value == null ? null : this.Crear_ReporteForm.get('Respondiente_resp').value?.Id_User;
      entity.Supervisor = this.Crear_ReporteForm.get('Supervisor').value == null ? null : this.Crear_ReporteForm.get('Supervisor').value?.Id_User;

      if (this.Crear_ReporteForm.get('Supervisor').value != null && typeof this.Crear_ReporteForm.get('Supervisor').value == 'string') {
        let value = await this.brf.EvaluaQueryAsync(`SELECT Id_User FROM Spartan_User WHERE Name = '${this.Crear_ReporteForm.get('Supervisor').value}'`, 1, "ABC123");
        entity.Supervisor = entity.Supervisor == undefined ? value : entity.Supervisor;
      }

      entity.Inspector = this.Crear_ReporteForm.get('Inspector').value == null ? null : this.Crear_ReporteForm.get('Inspector').value.Id_User;
      if (this.Crear_ReporteForm.get('Inspector').value != null && typeof this.Crear_ReporteForm.get('Inspector').value == 'string') {
        let value = await this.brf.EvaluaQueryAsync(`SELECT Id_User FROM Spartan_User WHERE Name = '${this.Crear_ReporteForm.get('Inspector').value}'`, 1, "ABC123");
        entity.Inspector = entity.Inspector == undefined ? value : entity.Inspector;
      }

      entity.Programador_de_mantenimiento = this.Crear_ReporteForm.get('Programador_de_mantenimiento').value == null ? null : this.Crear_ReporteForm.get('Programador_de_mantenimiento').value.Id_User;
      if (this.Crear_ReporteForm.get('Programador_de_mantenimiento').value != null && typeof this.Crear_ReporteForm.get('Programador_de_mantenimiento').value == 'string') {
        let value = await this.brf.EvaluaQueryAsync(`SELECT Id_User FROM Spartan_User WHERE Name = '${this.Crear_ReporteForm.get('Programador_de_mantenimiento').value}'`, 1, "ABC123");
        entity.Programador_de_mantenimiento = entity.Programador_de_mantenimiento == undefined ? value : entity.Programador_de_mantenimiento;
      }

      entity.Fecha_resp = this.Crear_ReporteForm.controls.Fecha_resp.value;
      entity.Hora_resp = this.Crear_ReporteForm.controls.Hora_resp.value;

      entity.Fecha_sup = this.Crear_ReporteForm.controls.Fecha_sup.value;
      entity.Hora_sup = this.Crear_ReporteForm.controls.Hora_sup.value;
      entity.Resultado_sup = this.Crear_ReporteForm.controls.Resultado_sup.value;
      entity.Tiempo_ejecucion_Hrs_sup = this.Crear_ReporteForm.controls.Tiempo_ejecucion_Hrs_sup.value;
      entity.Observaciones_sup = this.Crear_ReporteForm.controls.Observaciones_sup.value;

      entity.Fecha_ins = this.Crear_ReporteForm.controls.Fecha_ins.value;
      entity.Hora_ins = this.Crear_ReporteForm.controls.Hora_ins.value;
      entity.Resultado_ins = this.Crear_ReporteForm.controls.Resultado_ins.value;
      entity.Tiempo_ejecucion_Hrs_ins = this.Crear_ReporteForm.controls.Tiempo_ejecucion_Hrs_ins.value;
      entity.Observaciones_ins = this.Crear_ReporteForm.controls.Observaciones_ins.value;

      entity.Fecha_pro = this.Crear_ReporteForm.controls.Fecha_pro.value;
      entity.Hora_pro = this.Crear_ReporteForm.controls.Hora_pro.value;
      entity.Resultado_pro = this.Crear_ReporteForm.controls.Resultado_pro.value;
      entity.Tiempo_ejecucion_Hrs_pro = this.Crear_ReporteForm.controls.Tiempo_ejecucion_Hrs_pro.value;
      entity.Observaciones_pro = this.Crear_ReporteForm.controls.Observaciones_pro.value;

      entity.No_Reporte = this.Crear_ReporteForm.controls.No_Reporte.value;
      entity.Descripcion_breve = this.Crear_ReporteForm.controls.Descripcion_breve.value;
      entity.Prioridad_del_reporte = this.Crear_ReporteForm.controls.Prioridad_del_reporte.value;
      entity.Tipo_de_orden_de_trabajo = this.Crear_ReporteForm.controls.Tipo_de_orden_de_trabajo.value;
      entity.Estatus = this.Crear_ReporteForm.controls.Estatus.value;
      entity.Tipo_de_reporte = this.Crear_ReporteForm.controls.Tipo_de_reporte.value;
      entity.Notas = this.Crear_ReporteForm.controls.Notas.value;
      entity.Tiempo_total_de_ejecucion = this.Crear_ReporteForm.controls.Tiempo_total_de_ejecucion.value;

      entity.Ayuda_de_respuesta_resp = this.Crear_ReporteForm.controls.Ayuda_de_respuesta_resp.value;
      entity.Respuesta_resp = this.Crear_ReporteForm.controls.Respuesta_resp.value;

      if (this.model.Folio > 0) {
        await this.Crear_ReporteService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Solicitud_de_Partes_Crear_reporte(this.model.Folio);
        await this.saveDetalle_Solicitud_de_Servicios_Crear_reporte(this.model.Folio);
        await this.saveDetalle_Solicitud_de_Materiales_Crear_reporte(this.model.Folio);
        await this.saveDetalle_Solicitud_de_Herramientas_Crear_reporte(this.model.Folio);
        await this.saveDetalle_de_Remocion_de_piezas(this.model.Folio);
        await this.saveDetalle_de_Instalacion_de_piezas(this.model.Folio);
        await this.saveDetalle_tiempo_ejecutantes_crear_reporte(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());

        await this.rulesAfterSave();
      } else {
        await (this.Crear_ReporteService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Solicitud_de_Partes_Crear_reporte(id);
          await this.saveDetalle_Solicitud_de_Servicios_Crear_reporte(id);
          await this.saveDetalle_Solicitud_de_Materiales_Crear_reporte(id);
          await this.saveDetalle_Solicitud_de_Herramientas_Crear_reporte(id);
          await this.saveDetalle_de_Remocion_de_piezas(id);
          await this.saveDetalle_de_Instalacion_de_piezas(id);
          await this.saveDetalle_tiempo_ejecutantes_crear_reporte(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());

          await this.rulesAfterSave();
        }));
      }

      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });

    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Crear_ReporteForm.reset();
      this.model = new Crear_Reporte(this.fb);
      this.Crear_ReporteForm = this.model.buildFormGroup();
      this.dataSourceSolicitud_de_partes = new MatTableDataSource<Detalle_Solicitud_de_Partes_Crear_reporte>();
      this.Solicitud_de_partesData = [];
      this.dataSourceSolicitud_de_servicios = new MatTableDataSource<Detalle_Solicitud_de_Servicios_Crear_reporte>();
      this.Solicitud_de_serviciosData = [];
      this.dataSourceSolicitud_de_materiales = new MatTableDataSource<Detalle_Solicitud_de_Materiales_Crear_reporte>();
      this.Solicitud_de_materialesData = [];
      this.dataSourceSolicitud_de_herramientas = new MatTableDataSource<Detalle_Solicitud_de_Herramientas_Crear_reporte>();
      this.Solicitud_de_herramientasData = [];
      this.dataSourceRemocion = new MatTableDataSource<Detalle_de_Remocion_de_piezas>();
      this.RemocionData = [];
      this.dataSourceInstalacion = new MatTableDataSource<Detalle_de_Instalacion_de_piezas>();
      this.InstalacionData = [];
      this.dataSourceEjecutantes = new MatTableDataSource<Detalle_tiempo_ejecutantes_crear_reporte>();
      this.EjecutantesData = [];

    } else {
      this.router.navigate(['views/Crear_Reporte/add']);
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
    this.router.navigate(['/Crear_Reporte/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  No_Reporte_ExecuteBusinessRules(): void {
    //No_Reporte_FieldExecuteBusinessRulesEnd
  }
  N_Orden_de_Trabajo_ExecuteBusinessRules(): void {

    //INICIA - BRID:3998 - Cargar tipo de orden a partir de la orden de trabajo - Autor: Administrador - Actualización: 6/25/2021 3:38:42 PM
    this._SpartanService.SetValueExecuteQuery(this.Crear_ReporteForm, "Tipo_de_orden_de_trabajo", this.brf.EvaluaQuery(" SELECT Tipo_de_Orden FROM Orden_de_trabajo WITH(NOLOCK) WHERE Folio = '" + this.Crear_ReporteForm.get('N_Orden_de_Trabajo').value + "'", 1, "ABC123"), 1, "ABC123");
    //TERMINA - BRID:3998

    //N_Orden_de_Trabajo_FieldExecuteBusinessRulesEnd

  }
  No__de_Orden_de_Servicio_ExecuteBusinessRules(): void {
    //No__de_Orden_de_Servicio_FieldExecuteBusinessRulesEnd
  }
  Descripcion_breve_ExecuteBusinessRules(): void {
    //Descripcion_breve_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_reporte_OS_ExecuteBusinessRules(): void {
    //Tipo_de_reporte_OS_FieldExecuteBusinessRulesEnd
  }
  Descripcion_del_componente_ExecuteBusinessRules(): void {
    //Descripcion_del_componente_FieldExecuteBusinessRulesEnd
  }
  Numero_de_parte_ExecuteBusinessRules(): void {
    //Numero_de_parte_FieldExecuteBusinessRulesEnd
  }
  Numero_de_serie_ExecuteBusinessRules(): void {
    //Numero_de_serie_FieldExecuteBusinessRulesEnd
  }
  Fecha_requerida_ExecuteBusinessRules(): void {
    //Fecha_requerida_FieldExecuteBusinessRulesEnd
  }
  Promedio_de_ejecucion_ExecuteBusinessRules(): void {
    //Promedio_de_ejecucion_FieldExecuteBusinessRulesEnd
  }
  Prioridad_del_reporte_ExecuteBusinessRules(): void {
    //Prioridad_del_reporte_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_orden_de_trabajo_ExecuteBusinessRules(): void {
    //Tipo_de_orden_de_trabajo_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  async Matricula_ExecuteBusinessRules(): Promise<void> {

    //INICIA - BRID:5879 - Obtener Orden de Trabajo al seleccionar Matricula - Autor: Aaron - Actualización: 9/9/2021 5:46:54 PM
    if (this.Crear_ReporteForm.get('Folio').value == 'AUTO' || this.Crear_ReporteForm.get('Folio').value == 'Auto') {
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 1);
      this.brf.SetRequiredControl(this.Crear_ReporteForm, "N_Orden_de_Trabajo");

      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25') ||
        this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17')) {
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_Orden_de_Trabajo");
      }

    }
    //TERMINA - BRID:5879

    //INICIA - BRID:6422 - Cambiar estatus dependiendo si es matricula propia o externa - Autor: Aaron - Actualización: 9/27/2021 11:31:34 AM
    if (await this.brf.EvaluaQueryAsync("EXEC uspAeronavePropiaoExterna '" + this.Crear_ReporteForm.get('Matricula').value.Matricula + "'", 1, 'ABC123') == 0 &&
      this.Crear_ReporteForm.get('Tipo_de_reporte').value != this.brf.TryParseInt('1', '1')) {
      this.Crear_ReporteForm.get('Estatus').setValue(9);
    }
    else {
      this.Crear_ReporteForm.get('Estatus').setValue(5);
    }

    if (this.EstatusEditarConsulta != null) {
      this.Crear_ReporteForm.get('Estatus').setValue(this.EstatusEditarConsulta);
    }
    else {
      this.Crear_ReporteForm.get('Estatus').setValue(5);
    }
    //TERMINA - BRID:6422


    //INICIA - BRID:7153 - Filtrar codigo computarizado por matricula - Autor: Jose Caballero - Actualización: 10/15/2021 3:51:12 PM

    //TERMINA - BRID:7153

    //Matricula_FieldExecuteBusinessRulesEnd

  }
  Origen_del_reporte_ExecuteBusinessRules(): void {

    //INICIA - BRID:6444 - Deshabilitar cmpos cuando provenga de cotizacion aprobada - Autor: Aaron - Actualización: 9/27/2021 10:44:32 AM
    if (this.Crear_ReporteForm.get('Estatus').value == this.brf.TryParseInt('5', '5') &&
      this.Crear_ReporteForm.get('Origen_del_reporte').value == this.brf.TryParseInt('3', '3') &&
      this.Crear_ReporteForm.get('Tipo_de_reporte').value == this.brf.TryParseInt('1', '1')) {
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Prioridad_del_reporte', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_computarizado_Descripcion', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
    }
    //TERMINA - BRID:6444

    //Origen_del_reporte_FieldExecuteBusinessRulesEnd

  }
  Codigo_computarizado_Descripcion_ExecuteBusinessRules(): void {
    //Codigo_computarizado_Descripcion_FieldExecuteBusinessRulesEnd
  }
  Ciclos_restantes_ExecuteBusinessRules(): void {
    //Ciclos_restantes_FieldExecuteBusinessRulesEnd
  }
  Horas_restantes_ExecuteBusinessRules(): void {
    //Horas_restantes_FieldExecuteBusinessRulesEnd
  }
  N_boletin_directiva_ExecuteBusinessRules(): void {
    //N_boletin_directiva_FieldExecuteBusinessRulesEnd
  }
  Titulo_boletin_directiva_ExecuteBusinessRules(): void {
    //Titulo_boletin_directiva_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_reporte_ExecuteBusinessRules(): void {

    //INICIA - BRID:6443 - Deshabilitar campos cuando el reporte provenga de una aprobacion de cotizacion de inspeccion de entrada - Autor: Aaron - Actualización: 9/27/2021 10:44:22 AM
    if (this.Crear_ReporteForm.get('Estatus').value == this.brf.TryParseInt('5', '5') &&
      this.Crear_ReporteForm.get('Tipo_de_reporte').value == this.brf.TryParseInt('1', '1') &&
      this.Crear_ReporteForm.get('Origen_del_reporte').value == this.brf.TryParseInt('3', '3')) {
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Prioridad_del_reporte', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_computarizado_Descripcion', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
    }
    //TERMINA - BRID:6443

    //Tipo_de_reporte_FieldExecuteBusinessRulesEnd

  }
  Reporte_de_aeronave_ExecuteBusinessRules(): void {
    //Reporte_de_aeronave_FieldExecuteBusinessRulesEnd
  }
  N_de_bitacora_ExecuteBusinessRules(): void {
    //N_de_bitacora_FieldExecuteBusinessRulesEnd
  }
  Codigo_ATA_ExecuteBusinessRules(): void {
    //Codigo_ATA_FieldExecuteBusinessRulesEnd
  }
  IdDiscrepancia_ExecuteBusinessRules(): void {
    //IdDiscrepancia_FieldExecuteBusinessRulesEnd
  }
  Id_Inspeccion_de_Entrada_ExecuteBusinessRules(): void {
    //Id_Inspeccion_de_Entrada_FieldExecuteBusinessRulesEnd
  }
  IdCotizacion_ExecuteBusinessRules(): void {
    //IdCotizacion_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Creacion_del_Reporte_ExecuteBusinessRules(): void {
    //Fecha_de_Creacion_del_Reporte_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Creacion_del_Reporte_ExecuteBusinessRules(): void {
    //Hora_de_Creacion_del_Reporte_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Asignacion_ExecuteBusinessRules(): void {
    //Fecha_de_Asignacion_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Asignacion_ExecuteBusinessRules(): void {
    //Hora_de_Asignacion_FieldExecuteBusinessRulesEnd
  }
  Notas_ExecuteBusinessRules(): void {
    //Notas_FieldExecuteBusinessRulesEnd
  }
  Tiempo_total_de_ejecucion_ExecuteBusinessRules(): void {
    //Tiempo_total_de_ejecucion_FieldExecuteBusinessRulesEnd
  }
  Fecha_resp_ExecuteBusinessRules(): void {
    //Fecha_resp_FieldExecuteBusinessRulesEnd
  }
  Hora_resp_ExecuteBusinessRules(): void {
    //Hora_resp_FieldExecuteBusinessRulesEnd
  }
  Respondiente_resp_ExecuteBusinessRules(): void {
    //Respondiente_resp_FieldExecuteBusinessRulesEnd
  }
  Ayuda_de_respuesta_resp_ExecuteBusinessRules(): void {
    this.brf.SetValueControl(this.Crear_ReporteForm, "Respuesta_resp", this.varAyuda_de_respuesta_crear_reporte.find(x => x.Folio == this.Crear_ReporteForm.get('Ayuda_de_respuesta_resp').value).Respuesta_de_ayuda);
    //Ayuda_de_respuesta_resp_FieldExecuteBusinessRulesEnd
  }
  Respuesta_resp_ExecuteBusinessRules(): void {
    //Respuesta_resp_FieldExecuteBusinessRulesEnd
  }
  Fecha_sup_ExecuteBusinessRules(): void {
    //Fecha_sup_FieldExecuteBusinessRulesEnd
  }
  Hora_sup_ExecuteBusinessRules(): void {
    //Hora_sup_FieldExecuteBusinessRulesEnd
  }
  Supervisor_ExecuteBusinessRules(element): void {
    //Supervisor_FieldExecuteBusinessRulesEnd
  }
  Resultado_sup_ExecuteBusinessRules(): void {

    //INICIA - BRID:4964 - Mostrar u ocultar "Resultado" de supervisor Crear_Reporte - Autor: Agustín Administrador - Actualización: 8/18/2021 5:10:01 PM
    if (this.Crear_ReporteForm.get('Resultado_sup').value == this.brf.TryParseInt('1', '1')) {
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_sup");
    } else {
      this.brf.SetRequiredControl(this.Crear_ReporteForm, "Observaciones_sup");
    }
    //TERMINA - BRID:4964

    //Resultado_sup_FieldExecuteBusinessRulesEnd

  }
  Tiempo_ejecucion_Hrs_sup_ExecuteBusinessRules(): void {
    //Tiempo_ejecucion_Hrs_sup_FieldExecuteBusinessRulesEnd
  }
  Observaciones_sup_ExecuteBusinessRules(): void {
    //Observaciones_sup_FieldExecuteBusinessRulesEnd
  }
  Fecha_ins_ExecuteBusinessRules(): void {
    //Fecha_ins_FieldExecuteBusinessRulesEnd
  }
  Hora_ins_ExecuteBusinessRules(): void {
    //Hora_ins_FieldExecuteBusinessRulesEnd
  }
  Inspector_ExecuteBusinessRules(): void {
    //Inspector_FieldExecuteBusinessRulesEnd
  }
  Resultado_ins_ExecuteBusinessRules(): void {

    //INICIA - BRID:4965 - Mostrar u ocultar "Resultado" de inspector Crear_Reporte - Autor: Agustín Administrador - Actualización: 8/18/2021 5:10:49 PM
    if (this.Crear_ReporteForm.get('Resultado_ins').value == this.brf.TryParseInt('1', '1')) {
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_ins");
    }
    else { this.brf.SetRequiredControl(this.Crear_ReporteForm, "Observaciones_ins"); }
    //TERMINA - BRID:4965

    //Resultado_ins_FieldExecuteBusinessRulesEnd

  }
  Tiempo_ejecucion_Hrs_ins_ExecuteBusinessRules(): void {
    //Tiempo_ejecucion_Hrs_ins_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ins_ExecuteBusinessRules(): void {
    //Observaciones_ins_FieldExecuteBusinessRulesEnd
  }
  Fecha_pro_ExecuteBusinessRules(): void {
    //Fecha_pro_FieldExecuteBusinessRulesEnd
  }
  Hora_pro_ExecuteBusinessRules(): void {
    //Hora_pro_FieldExecuteBusinessRulesEnd
  }
  Programador_de_mantenimiento_ExecuteBusinessRules(): void {
    //Programador_de_mantenimiento_FieldExecuteBusinessRulesEnd
  }
  Resultado_pro_ExecuteBusinessRules(): void {

    //INICIA - BRID:4966 - Mostrar u ocultar "Resultado" de programador Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/10/2021 5:15:18 PM
    if (this.Crear_ReporteForm.get('Resultado_pro').value == this.brf.TryParseInt('1', '1')) { this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_pro"); } else { this.brf.SetRequiredControl(this.Crear_ReporteForm, "Observaciones_pro"); }
    //TERMINA - BRID:4966

    //Resultado_pro_FieldExecuteBusinessRulesEnd

  }
  Tiempo_ejecucion_Hrs_pro_ExecuteBusinessRules(): void {
    //Tiempo_ejecucion_Hrs_pro_FieldExecuteBusinessRulesEnd
  }
  Observaciones_pro_ExecuteBusinessRules(): void {
    //Observaciones_pro_FieldExecuteBusinessRulesEnd
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
    this.rulesOnInit();
  }

  async rulesOnInit() {
    this.Matricula_ExecuteBusinessRules()
    //rulesOnInit_ExecuteBusinessRulesInit

    //INICIA - BRID:3712 - Quitar requerido y ocultar campos cuando viene de control de componentes - Autor: Administrador - Actualización: 6/1/2021 11:03:44 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.Crear_ReporteForm.get('Origen_del_reporte').value == this.brf.TryParseInt('Componente', 'Componente')) {
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_boletin_directiva");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Titulo_boletin_directiva");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_ATA");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_boletin_directiva");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_boletin_directiva");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Titulo_boletin_directiva");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Titulo_boletin_directiva");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Tipo");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Codigo_ATA");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_ATA");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora");
      }
    }
    //TERMINA - BRID:3712


    //INICIA - BRID:3713 - Quitar requerido y ocultar campos cuando viene de boletin o directiva - Autor: Aaron - Actualización: 9/7/2021 12:28:23 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.Crear_ReporteForm.get('Origen_del_reporte').value == this.brf.TryParseInt('1', '1') ||
        this.Crear_ReporteForm.get('Origen_del_reporte').value == this.brf.TryParseInt('2', '2')) {
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ciclos_restantes");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_restantes");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_computarizado_Descripcion");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_Orden_de_Trabajo");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Ciclos_restantes");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ciclos_restantes");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Horas_restantes");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_restantes");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Codigo_computarizado_Descripcion");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_computarizado_Descripcion");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_Orden_de_Trabajo");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_Orden_de_Trabajo");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Titulo_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_ATA', 0);
      }
    }
    //TERMINA - BRID:3713


    //INICIA - BRID:3719 - Ocultar campo de folio - Autor: Administrador - Actualización: 6/1/2021 6:16:08 PM
    this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Folio");
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Folio");
    //TERMINA - BRID:3719


    //INICIA - BRID:3850 - deshabilitar campo estatus - Autor: Administrador - Actualización: 6/3/2021 11:21:06 AM
    this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
    //TERMINA - BRID:3850


    //INICIA - BRID:3851 - asignar valor a estatus 1 - Autor: Administrador - Actualización: 6/3/2021 11:29:24 AM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "5");
    }
    //TERMINA - BRID:3851


    //INICIA - BRID:3915 - Quitar requerido y ocultar No Reporte - Autor: Administrador - Actualización: 6/15/2021 1:34:10 PM
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "No_Reporte");
    this.brf.HideFieldOfForm(this.Crear_ReporteForm, "No_Reporte");
    //TERMINA - BRID:3915


    //INICIA - BRID:3963 - ocultar campos u no requeridos cuando sea inspección de entrada  - Autor: Aaron - Actualización: 7/29/2021 8:11:34 PM
    if (this.Crear_ReporteForm.get('Origen_del_reporte').value == this.brf.TryParseInt('3', '3')) {
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Ciclos_restantes");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ciclos_restantes");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Horas_restantes");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_restantes");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_boletin_directiva");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_boletin_directiva");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Titulo_boletin_directiva");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Titulo_boletin_directiva");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Codigo_ATA");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_ATA");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Reporte_de_aeronave");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_de_bitacora");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora");
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Id_Inspeccion_de_Entrada', 0);
    }
    else {
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Id_Inspeccion_de_Entrada");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Id_Inspeccion_de_Entrada");
    }
    //TERMINA - BRID:3963


    //INICIA - BRID:3997 - Deshabilitar controles cuando es ingreso por inspección de entrada aeronave - Autor: Administrador - Actualización: 7/28/2021 11:06:16 AM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.Crear_ReporteForm.get('Origen_del_reporte').value == this.brf.TryParseInt('3', '3')) {
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_ATA', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
      }
    }
    //TERMINA - BRID:3997


    //INICIA - BRID:4062 - Deshabilitar campo Orden de Trabajo cuando el reporte ya esta asignado a una OT Abierta y es entrada de discrepancia - Autor: Aaron - Actualización: 9/7/2021 11:45:28 AM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.Crear_ReporteForm.get('Origen_del_reporte').value == this.brf.TryParseInt('3', '3') &&
        await this.brf.EvaluaQueryAsync("SELECT COUNT(*) FROM Detalles_de_trabajo_de_OT WHERE Folio_de_Reporte = '" + this.Crear_ReporteForm.get('Folio').value + "' AND Id_Orden_de_Trabajo = '" + this.Crear_ReporteForm.get('N_Orden_de_Trabajo').value + "'", 1, 'ABC123') > this.brf.TryParseInt('0', '0')) {
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
      }
    }
    //TERMINA - BRID:4062


    //INICIA - BRID:4221 - Ocultar y quitar requerido "IdCotización" Crear_Reporte - Autor: Administrador - Actualización: 7/22/2021 3:46:58 PM
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "IdCotizacion");
    this.brf.HideFieldOfForm(this.Crear_ReporteForm, "IdCotizacion");
    //TERMINA - BRID:4221


    //INICIA - BRID:4258 - Deshabilitar campos fecha, hora y usuarios Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/1/2021 3:49:20 PM
    if (this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_resp', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_resp', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Respondiente_resp', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_sup', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_sup', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Supervisor', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_ins', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_ins', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Inspector', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_pro', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_pro', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Programador_de_mantenimiento', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_total_de_ejecucion', 0);
    }
    //TERMINA - BRID:4258


    //INICIA - BRID:4315 - Ocultar pestañas cuando el estatus sea abierto Crear_Reporte - Autor: Administrador - Actualización: 7/22/2021 6:02:50 PM
    if (this.operation == 'Update') {
      if (this.EstatusEditarConsulta == this.brf.TryParseInt('5', '5')) {
        this.brf.HideFolder("Autorizacion_del_inspector");
        this.brf.HideFolder("Autorizacion_del_programador");
        this.brf.HideFolder("Autorizacion_del_supervisor");
        this.brf.HideFolder("Respuesta_del_reporte");

        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20')) {
          this.brf.ShowFolder("Respuesta_del_reporte");
        }

        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('43', '43')) {
          this.brf.ShowFolder("Respuesta_del_reporte");
          this.brf.ShowFolder("Autorizacion_del_supervisor");
        }

        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17')) {
          this.brf.ShowFolder("Respuesta_del_reporte");
          this.brf.ShowFolder("Autorizacion_del_supervisor");
          this.brf.ShowFolder("Autorizacion_del_inspector");
        }

        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25')) {
          this.brf.ShowFolder("Respuesta_del_reporte");
          this.brf.ShowFolder("Autorizacion_del_supervisor");
          this.brf.ShowFolder("Autorizacion_del_inspector");
          this.brf.ShowFolder("Autorizacion_del_programador");
        }

        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Folio");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "IdCrear_reporte");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ejecutante");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_inicial");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_final");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_en_hrs");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Motivo_de_pausa");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Respondiente_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ayuda_de_respuesta_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Respuesta_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Supervisor");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Inspector");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Programador_de_mantenimiento");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_pro");
      }
    }
    //TERMINA - BRID:4315


    //INICIA - BRID:4316 - Ocultar pestañas para inspector Crear_Reporte - Autor: Administrador - Actualización: 7/22/2021 6:20:33 PM
    if (this.operation == 'Update') {
      if (this.EstatusEditarConsulta == this.brf.TryParseInt('3', '3')) {
        this.brf.HideFolder("Autorizacion_del_programador");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Programador_de_mantenimiento");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_pro");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_requerida', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Prioridad_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Titulo_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Notas', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_computarizado_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_ATA', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Reporte_de_aeronave', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_bitacora', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Descripcion_breve', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'No_Reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'IdRemocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Parte_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_del_Componente_a_Remover', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_del_componente_a_Remover', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Condicion_de_la_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Servicio_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_Estimada_del_Mtto', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'id_Instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_serie', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_acumuladas_parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_acumulados_parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Reparacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Encargado_de_la_instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_Serie', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Encargado_de_la_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Causa_de_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_de_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_Actuales', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_Actuales', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Modelo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Posicion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Fabricacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Meses', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Horas', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Ciclos', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_Vencimiento', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Meses_Acumulados_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'IdCrear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ejecutante', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_inicial', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_final', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_ejecucion_en_hrs', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Motivo_de_pausa', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Respondiente_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ayuda_de_respuesta_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Respuesta_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Supervisor', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Resultado_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_ejecucion_Hrs_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Observaciones_sup', 0);
      }
    }
    //TERMINA - BRID:4316

    //INICIA - BRID:4317 - Ocultar pestañas para programador Crear_Reporte - Autor: Administrador - Actualización: 7/22/2021 6:35:00 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.EstatusEditarConsulta == this.brf.TryParseInt('4', '4')) {
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_requerida', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Prioridad_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Titulo_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Notas', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_computarizado_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_ATA', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Reporte_de_aeronave', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_bitacora', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Descripcion_breve', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'No_Reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'IdRemocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Parte_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_del_Componente_a_Remover', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_del_componente_a_Remover', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Condicion_de_la_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Servicio_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_Estimada_del_Mtto', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'id_Instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_serie', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_acumuladas_parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_acumulados_parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Reparacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Encargado_de_la_instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_Serie', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Encargado_de_la_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Causa_de_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_de_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_Actuales', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_Actuales', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Modelo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Posicion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Fabricacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Meses', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Horas', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Ciclos', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_Vencimiento', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Meses_Acumulados_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'IdCrear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ejecutante', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_inicial', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_final', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_ejecucion_en_hrs', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Motivo_de_pausa', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Respondiente_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ayuda_de_respuesta_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Respuesta_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Supervisor', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Resultado_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_ejecucion_Hrs_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Observaciones_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Inspector', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Resultado_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_ejecucion_Hrs_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Observaciones_ins', 0);
      }
    }
    //TERMINA - BRID:4317

    //INICIA - BRID:4318 - Ocultar pestañas para supervisor Crear_Reporte - Autor: Administrador - Actualización: 7/22/2021 6:49:55 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.EstatusEditarConsulta == this.brf.TryParseInt('2', '2')) {
        this.brf.HideFolder("Autorizacion_del_programador");
        this.brf.HideFolder("Autorizacion_del_inspector");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Inspector");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Programador_de_mantenimiento");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_pro");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_requerida', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Prioridad_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Titulo_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Notas', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_computarizado_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_ATA', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Reporte_de_aeronave', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_bitacora', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Descripcion_breve', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'No_Reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'IdRemocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Parte_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_del_Componente_a_Remover', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_del_componente_a_Remover', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Condicion_de_la_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Servicio_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_Estimada_del_Mtto', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'id_Instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_serie', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_acumuladas_parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_acumulados_parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Reparacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Encargado_de_la_instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_Serie', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Encargado_de_la_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Causa_de_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_de_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_Actuales', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_Actuales', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Modelo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Posicion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Fabricacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Meses', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Horas', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Ciclos', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_Vencimiento', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Meses_Acumulados_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'IdCrear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ejecutante', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_inicial', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_final', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_ejecucion_en_hrs', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Motivo_de_pausa', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Respondiente_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ayuda_de_respuesta_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Respuesta_resp', 0);
      }
    }
    //TERMINA - BRID:4318

    //INICIA - BRID:4338 - Ocultar pestañas para tecnico Crear_Reporte - Autor: Administrador - Actualización: 7/22/2021 7:26:12 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.EstatusEditarConsulta == this.brf.TryParseInt('1', '1')) {
        this.brf.HideFolder("Autorizacion_del_inspector");
        this.brf.HideFolder("Autorizacion_del_programador");
        this.brf.HideFolder("Autorizacion_del_supervisor");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Supervisor");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Inspector");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Programador_de_mantenimiento");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_pro");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_requerida', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Prioridad_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Titulo_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Notas', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_computarizado_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_ATA', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Reporte_de_aeronave', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_bitacora', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Descripcion_breve', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'No_Reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'IdRemocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Parte_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_del_Componente_a_Remover', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_del_componente_a_Remover', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Condicion_de_la_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Servicio_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_Estimada_del_Mtto', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Unidad', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Razon_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'En_Existencia', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'id_Instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_serie', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_acumuladas_parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_acumulados_parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Reparacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Encargado_de_la_instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_de_Serie', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Encargado_de_la_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Causa_de_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_de_remocion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_Actuales', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_Actuales', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Modelo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Posicion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Fabricacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_de_Instalacion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Meses', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Horas', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Limite_de_Ciclos', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_Vencimiento', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Meses_Acumulados_Parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Crear_reporte', 0);
      }
    }
    //TERMINA - BRID:4338


    //INICIA - BRID:4352 - Deshabilitar campos y campos automaticos fecha, hora y usuario cuando es técnico respondiente al editar Crear_Reporte - Autor: Aaron - Actualización: 10/1/2021 4:24:31 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20')) {
        let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`, 1, "ABC123");
        this.brf.SetValueControl(this.Crear_ReporteForm, "Respondiente_resp", username);
        this.brf.SetCurrentDateToField(this.Crear_ReporteForm, "Fecha_resp");
        this.brf.SetCurrentHourToField(this.Crear_ReporteForm, "Hora_resp");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Respondiente_resp', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_total_de_ejecucion', 0);
      }
    }
    //TERMINA - BRID:4352


    //INICIA - BRID:4353 - Deshabilitar campos y campos automaticos fecha, hora y usuario cuando es supervisor al editar Crear_Reporte - Autor: Aaron - Actualización: 10/1/2021 4:24:37 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('43', '43')) {
        let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`, 1, "ABC123");
        this.brf.SetValueControl(this.Crear_ReporteForm, "Supervisor", username);
        this.brf.SetCurrentDateToField(this.Crear_ReporteForm, "Fecha_sup");
        this.brf.SetCurrentHourToField(this.Crear_ReporteForm, "Hora_sup");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Supervisor', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_total_de_ejecucion', 0);
      }
    }
    //TERMINA - BRID:4353

    //INICIA - BRID:4354 - Deshabilitar campos y campos automaticos fecha, hora y usuario cuando es inspector al editar Crear_Reporte - Autor: Aaron - Actualización: 10/1/2021 4:24:45 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17')) {
        let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`, 1, "ABC123");
        this.brf.SetValueControl(this.Crear_ReporteForm, "Inspector", username);
        this.brf.SetCurrentDateToField(this.Crear_ReporteForm, "Fecha_ins");
        this.brf.SetCurrentHourToField(this.Crear_ReporteForm, "Hora_ins");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Inspector', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_total_de_ejecucion', 0);
      }
    }
    //TERMINA - BRID:4354


    //INICIA - BRID:4355 - Deshabilitar campos y campos automaticos fecha, hora y usuario cuando es programador al editar Crear_Reporte - Autor: Aaron - Actualización: 10/1/2021 4:24:52 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25')) {
        let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`, 1, "ABC123");
        this.brf.SetValueControl(this.Crear_ReporteForm, "Programador_de_mantenimiento", username);
        this.brf.SetCurrentDateToField(this.Crear_ReporteForm, "Fecha_pro");
        this.brf.SetCurrentHourToField(this.Crear_ReporteForm, "Hora_pro");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_pro', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_pro', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Programador_de_mantenimiento', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_total_de_ejecucion', 0);
      }
    }
    //TERMINA - BRID:4355

    //INICIA - BRID:4357 - Ocultar Pestañas De flujo de trabajo Al nuevo - Autor: Aaron - Actualización: 7/23/2021 4:23:59 PM
    if (this.operation == 'New') {
      this.brf.HideFolder("Respuesta_del_reporte");
      this.brf.HideFolder("Autorizacion_del_inspector");
      this.brf.HideFolder("Autorizacion_del_supervisor");
      this.brf.HideFolder("Autorizacion_del_programador");

      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25') ||
        this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17')) {
        this.brf.ShowFolder("Respuesta_del_reporte");
      }
    }
    //TERMINA - BRID:4357


    //INICIA - BRID:4531 - Quitar requerido "Ayuda de respuesta" Crear_Reporte - Autor: Administrador - Actualización: 7/28/2021 5:03:23 PM
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ayuda_de_respuesta_resp");
    //TERMINA - BRID:4531


    //INICIA - BRID:4548 - Ocultar campo Id discrepancia - Autor: Aaron - Actualización: 7/29/2021 8:00:38 PM
    this.brf.HideFieldOfForm(this.Crear_ReporteForm, "IdDiscrepancia");
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "IdDiscrepancia");
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "IdDiscrepancia");
    //TERMINA - BRID:4548

    //INICIA - BRID:4588 - Ocultar campos de OT cuando sea un reporte de una OS - Autor: Aaron - Actualización: 9/7/2021 11:50:25 AM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.NoOrdenServicioEditar != null) {
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Tipo_de_orden_de_trabajo");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_orden_de_trabajo");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Ciclos_restantes");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ciclos_restantes");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Horas_restantes");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_restantes");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_boletin_directiva");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_boletin_directiva");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Titulo_boletin_directiva");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Titulo_boletin_directiva");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Codigo_computarizado_Descripcion");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_computarizado_Descripcion");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Codigo_ATA");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_ATA");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_Orden_de_Trabajo");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_Orden_de_Trabajo");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "No_Reporte");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "No_Reporte");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Id_Inspeccion_de_Entrada");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Id_Inspeccion_de_Entrada");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "IdDiscrepancia");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "IdDiscrepancia");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte_OS', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Descripcion_del_componente', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Numero_de_parte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Numero_de_serie', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'No__de_Orden_de_Servicio', 0);
      }
      else {
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Tipo_de_reporte_OS");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_reporte_OS");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Descripcion_del_componente");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Descripcion_del_componente");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Numero_de_parte");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Numero_de_parte");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Numero_de_serie");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Numero_de_serie");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "No__de_Orden_de_Servicio");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "No__de_Orden_de_Servicio");
      }
    }
    //TERMINA - BRID:4588


    //INICIA - BRID:4984 - Deshabilitar campo "Promedio de ejecución" para técnico Crear_Reporte - Autor: Agustín Administrador - Actualización: 8/13/2021 2:38:11 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20')) {
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Promedio_de_ejecucion', 0);
      }
    }
    //TERMINA - BRID:4984


    //INICIA - BRID:5252 - Quitar requeridos de campo promedio ejecucion - Autor: Aaron - Actualización: 8/24/2021 3:12:41 PM
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Promedio_de_ejecucion");
    //TERMINA - BRID:5252


    //INICIA - BRID:5461 - Deshabilitar campos requeridos cuando crea un nuevo reporte programador - Autor: Aaron - Actualización: 8/27/2021 11:36:20 AM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25')) {
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_en_hrs");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Respondiente_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Respuesta_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Supervisor");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Inspector");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Programador_de_mantenimiento");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_total_de_ejecucion");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_inicial");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_final");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_en_hrs");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_resp");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_sup");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_ins");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_pro");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_pro");

        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 1);
        this.brf.SetRequiredControl(this.Crear_ReporteForm, "Matricula");
      }

      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17')) {
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 1);
        this.brf.SetRequiredControl(this.Crear_ReporteForm, "Matricula");
      }
    }
    //TERMINA - BRID:5461


    //INICIA - BRID:5569 - Manadar correo a gerente de mantenimiento, administrador de sistema, supervisor, inspector y tecnico de mantenimiento cuando se sobrepase el tiempo limite de ejecución. - Autor: Agustín Administrador - Actualización: 8/31/2021 4:46:43 PM
    if (this.operation == 'Update') {
      //this.brf.SendEmailQuery("Alerta sobrepaso de tiempo promedio de ejecución de reporte.", this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (9,20,19,17,43)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User = GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='IE=edge'><title>EmailTemplate-Fluid</title><style type='text/css'> html, body {margin: 20px 0 0 0 !important;padding: 0 !important;width: 100% i !important;background-color: #E0E0E0 !important;} * {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;} .ExternalClass {width: 100%;} div[style*='margin: 16px 0'] {margin: 0 !important;} table, td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;} table {border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;} table table table {table-layout: auto;} img {-ms-interpolation-mode: bicubic;} .yshortcuts a {border-bottom: none !important;} a[x-apple-data-detectors] {color: inherit !important;} /* Estilos Hover para botones */ .button-td, .button-a {transition: all 100ms ease-in;} .button-td:hover, .button-a:hover {color: #000;} </style></head><body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'><table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#E0E0E0' style='border-collapse:collapse;'><tr><td><center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --><div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>Aerovics</div> <!-- Visually Hidden Preheader Text : END --><div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'><tr><td width='40'>&nbsp;</td><td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr><td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table> <!-- Email Header : END --> <!-- Email Body : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'> <!-- 1 Column Text : BEGIN --><tr><td><table cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Buenos días,</p><p>Se les notifica que se ha rechazado una prefactura con los siguientes datos, favor de verificar: </p> <br><p><strong>Numero de prefactura:</strong> </p> <br><p><strong>Cliente:</strong> </p> <br><p><strong>Cantidad a facturar:</strong> </p> <br><p><strong>Número de vuelo:</strong> </p><p><strong>Número de aeronave:</strong> </p><p>Favor de enviar acuse de recibido.</p><p>Saludos,</p></td></tr></table></td></tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --><!-- Email Footer : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'><tr><td width='40'>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'><img style='width: 40px; height: 40px;' src='http://108.60.201.12/vicsdemoventas3/images/profile_small.jpg'/></td><td width='5'>&nbsp;</td><td><p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p><p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'>Mantenimiento.</p></td><td width='40'>&nbsp;</td></tr><tr><td>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'><img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/></td><td width='5'>&nbsp;</td><td><p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'>Aerovics, S.A. de C.V.</p></td><td width='40'>&nbsp;</td></tr></table><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'><tr><td style='padding-top: 40px;'></td></tr><tr><td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>&nbsp;</td></tr></table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--></div></center></td></tr></table></body></html>");
    }
    //TERMINA - BRID:5569


    //INICIA - BRID:5599 - Mostrar pestaña del supervisor a técnico cuando este lo rechaza Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/2/2021 12:10:43 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20') &&
        this.Crear_ReporteForm.get('Resultado_sup').value == this.brf.TryParseInt('2', '2')) {
        this.brf.ShowFolder("Autorizacion_del_supervisor");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Supervisor', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Resultado_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_ejecucion_Hrs_sup', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Observaciones_sup', 0);
      }
    }
    //TERMINA - BRID:5599


    //INICIA - BRID:5600 - Mostrar pestaña del inspector a técnico cuando este lo rechaza Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/2/2021 12:08:58 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20') &&
        this.Crear_ReporteForm.get('Resultado_ins').value == this.brf.TryParseInt('2', '2')) {
        this.brf.ShowFolder("Autorizacion_del_inspector");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Inspector', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Resultado_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_ejecucion_Hrs_ins', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Observaciones_ins', 0);
      }
    }
    //TERMINA - BRID:5600


    //INICIA - BRID:5603 - Mostrar pestaña del programador a técnico cuando este lo rechaza Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/1/2021 7:20:05 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20') &&
        this.Crear_ReporteForm.get('Resultado_pro').value == this.brf.TryParseInt('2', '2')) {
        this.brf.ShowFolder("Autorizacion_del_programador");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Fecha_pro', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Hora_pro', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Programador_de_mantenimiento', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Resultado_pro', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_ejecucion_Hrs_pro', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Observaciones_pro', 0);
      }
    }
    //TERMINA - BRID:5603


    //INICIA - BRID:5875 - Ocultar campos al nuevo Crear Reporte - Autor: Aaron - Actualización: 9/7/2021 12:02:40 PM
    if (this.operation == 'New') {
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Ciclos_restantes");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ciclos_restantes");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Horas_restantes");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_restantes");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Reporte_de_aeronave");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_boletin_directiva");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_boletin_directiva");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Titulo_boletin_directiva");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Titulo_boletin_directiva");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_de_bitacora");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Tipo_de_reporte_OS");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_reporte_OS");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Descripcion_del_componente");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Descripcion_del_componente");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Numero_de_parte");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Numero_de_parte");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Numero_de_serie");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Numero_de_serie");
      this.brf.HideFieldOfForm(this.Crear_ReporteForm, "No__de_Orden_de_Servicio");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "No__de_Orden_de_Servicio");
    }
    //TERMINA - BRID:5875


    //INICIA - BRID:5876 - Deshabilitar controles al nuevo Crear Reporte - Autor: Aaron - Actualización: 9/7/2021 12:30:45 PM
    if (this.operation == 'New') {
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
      this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);

      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25') ||
        this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17')) {
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 1);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 1);
        this.brf.SetRequiredControl(this.Crear_ReporteForm, "Matricula");

        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_Orden_de_Trabajo");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_requerida");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Promedio_de_ejecucion");

        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Origen_del_reporte");

        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_computarizado_Descripcion");

        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_reporte");

        this.botonAddInstalacionDisabled = true;
        this.botonIniciarDisabled = true;
        this.botonPausarDisabled = true;
        this.botonReanudarDisabled = true;
        this.botonDetenerDisabled = true;
      }
    }
    //TERMINA - BRID:5876


    //INICIA - BRID:5877 - No requerido al Nuevo Crear Reporte - Autor: Agustín Administrador - Actualización: 9/28/2021 10:18:20 AM
    if (this.operation == 'New') {
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_ATA");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_total_de_ejecucion");
    }
    //TERMINA - BRID:5877


    //INICIA - BRID:5878 - Cargar campos de Origen de reporte y Tipo de Reporte - Autor: Aaron - Actualización: 9/7/2021 12:24:27 PM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.Crear_ReporteForm, "Origen_del_reporte", "5");
      this.brf.SetValueControl(this.Crear_ReporteForm, "Tipo_de_reporte", "6");

      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Tipo_de_reporte", "3");
      }
    }
    //TERMINA - BRID:5878


    //INICIA - BRID:5880 - asignar no requerido a campos al nuevo - Autor: Aaron - Actualización: 9/7/2021 3:20:43 PM
    if (this.operation == 'New') {
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_inicial");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_final");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_en_hrs");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_resp");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Respondiente_resp");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ayuda_de_respuesta_resp");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Respuesta_resp");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_sup");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Supervisor");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_sup");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_sup");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_sup");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_ins");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Inspector");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_ins");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_ins");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_pro");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Programador_de_mantenimiento");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_ejecucion_Hrs_pro");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Observaciones_pro");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Id_Inspeccion_de_Entrada");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_total_de_ejecucion");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_requerida");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_Estimada_del_Mtto");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Reparacion");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Remocion");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Fabricacion");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Instalacion");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_resp");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_sup");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_ins");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_pro");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_restantes");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_del_Componente_a_Remover");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_acumuladas_parte");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_Actuales");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Limite_de_Horas");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_inicial");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_final");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_resp");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_sup");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_ins");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_pro");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_sup");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_ins");
      this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Resultado_pro");
    }
    //TERMINA - BRID:5880


    //INICIA - BRID:6177 - Desabilitar promedio de ejecucion al editar para el sol inspector - Autor: Lizeth Villa - Actualización: 9/13/2021 1:01:27 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17')) {
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Promedio_de_ejecucion', 0);
      }
    }
    //TERMINA - BRID:6177


    //INICIA - BRID:6420 - OCULTAR CAMPOS DE CREACION DE REPORTE Y ASIGNACION - Autor: Aaron - Actualización: 9/23/2021 12:31:38 PM
    this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Fecha_de_Creacion_del_Reporte");
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Creacion_del_Reporte");
    this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Hora_de_Creacion_del_Reporte");
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_de_Creacion_del_Reporte");
    this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Fecha_de_Asignacion");
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Asignacion");
    this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Hora_de_Asignacion");
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_de_Asignacion");
    //TERMINA - BRID:6420


    //INICIA - BRID:6468 - Deshabilitar campos cuando el reporte proviene de una Aprobacion de cotizacion - Autor: Aaron - Actualización: 9/27/2021 10:57:53 AM
    if (this.operation == 'New') {
      //this.brf.CreateSessionVar("TipoNotificacion", "0", 1, "ABC123");
      this.localStorageHelper.setItemToLocalStorage('TipoNotificacion', "0");
    }
    //TERMINA - BRID:6468


    //INICIA - BRID:6469 - CORREGIDA A MANO Deshabilitar campos y Asignar Valores cuando Provenga de Inspección de entrada  - Autor: Aaron - Actualización: 9/27/2021 11:14:31 AM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getItemFromLocalStorage('TipoNotificacion') == this.brf.TryParseInt('4', '4')) {
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Prioridad_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_computarizado_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
        this.brf.SetValueControl(this.Crear_ReporteForm, "Origen_del_reporte", "3");
        this.brf.SetValueControl(this.Crear_ReporteForm, "Tipo_de_reporte", "1");
        this.brf.SetValueControl(this.Crear_ReporteForm, "Prioridad_del_reporte", "4");
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "5");
      }
    }
    //TERMINA - BRID:6469


    //INICIA - BRID:6522 - No pedir requerido el tiempo total de ejecución - Autor: Agustín Administrador - Actualización: 9/28/2021 10:22:15 AM
    this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tiempo_total_de_ejecucion', 0);
    this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tiempo_total_de_ejecucion");
    //TERMINA - BRID:6522


    //INICIA - BRID:6588 - Deshabilitar y ocultar campos cuando viene con tipo de reporte programado sin OT Crear_Reporte - Autor: Aaron - Actualización: 10/4/2021 2:35:52 PM
    if (this.operation == 'Update') {
      if (this.Crear_ReporteForm.get('Tipo_de_reporte').value == this.brf.TryParseInt('3', '3') &&
        await this.brf.EvaluaQueryAsync("Select count(N_Orden_de_Trabajo) from crear_reporte where folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') == this.brf.TryParseInt('0', '0')) {
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Prioridad_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Codigo_computarizado_Descripcion', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Descripcion_breve', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Titulo_boletin_directiva', 0);
      }
    }
    //TERMINA - BRID:6588

    //INICIA - BRID:6589 - Deshabilitar y ocultar campos cuando viene con tipo de reporte programado con OT Crear_Reporte - Autor: Aaron - Actualización: 10/4/2021 2:24:59 PM
    if (this.operation == 'Update') {
      if (this.Crear_ReporteForm.get('Tipo_de_reporte').value == this.brf.TryParseInt('3', '3') &&
        await this.brf.EvaluaQueryAsync("Select count(N_Orden_de_Trabajo) from crear_reporte where folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') ==
        this.brf.TryParseInt('1', '1')) {
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave");
        this.brf.HideFieldOfForm(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora");
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Origen_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Prioridad_del_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_orden_de_trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Ciclos_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Horas_restantes', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Descripcion_breve', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_Orden_de_Trabajo', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Tipo_de_reporte', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Titulo_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'N_boletin_directiva', 0);
        this.brf.SetEnabledControl(this.Crear_ReporteForm, 'Titulo_boletin_directiva', 0);
      }
    }
    //TERMINA - BRID:6589


    //INICIA - BRID:7019 - WF:5 Rule - Phase: 2 (Reportes por Asignar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '2'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7019


    //INICIA - BRID:7021 - WF:5 Rule - Phase: 3 (Reportes por Ejecutar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '3'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7021


    //INICIA - BRID:7023 - WF:5 Rule - Phase: 4 (Reportes por Autorizar Supervisor) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '4'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7023


    //INICIA - BRID:7025 - WF:5 Rule - Phase: 5 (Reportes por Autorizar Inspector) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '5'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7025


    //INICIA - BRID:7027 - WF:5 Rule - Phase: 6 (Reportes por Autorizar Programador) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '6'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7027


    //INICIA - BRID:7029 - WF:5 Rule - Phase: 7 (Reportes Cancelados) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '7'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7029


    //INICIA - BRID:7031 - WF:5 Rule - Phase: 8 (Reportes Cerrados) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '8'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7031


    //INICIA - BRID:7033 - WF:5 Rule - Phase: 9 (Reportes (Paro/Cambio turno)) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '9'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7033


    //INICIA - BRID:7035 - WF:5 Rule - Phase: 10 (Reportes por Cotizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '10'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7035


    //INICIA - BRID:7037 - WF:5 Rule - Phase: 11 (Reportes de Inspección de Entrada) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '11'", 1, 'ABC123')) { this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Folio"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Origen_del_reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_requerida"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Prioridad_del_reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_orden_de_trabajo"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ciclos_restantes"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_restantes"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Estatus"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_boletin_directiva"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Titulo_boletin_directiva"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Notas"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_computarizado_Descripcion"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Matricula"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_ATA"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Descripcion_breve"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_Orden_de_Trabajo"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "No_Reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "IdCotizacion"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Id_Inspeccion_de_Entrada"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "IdDiscrepancia"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_reporte_OS"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Descripcion_del_componente"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Numero_de_parte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Numero_de_serie"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "No__de_Orden_de_Servicio"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Promedio_de_ejecucion"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Creacion_del_Reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_de_Creacion_del_Reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Asignacion"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_de_Asignacion"); } 
    }
    //TERMINA - BRID:7037


    //INICIA - BRID:7039 - WF:5 Rule - Phase: 12 ( Reportes de Inspección de Salida) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '12'", 1, 'ABC123')) { this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Folio"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Origen_del_reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_requerida"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Prioridad_del_reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_orden_de_trabajo"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Ciclos_restantes"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Horas_restantes"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Estatus"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_boletin_directiva"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Titulo_boletin_directiva"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Notas"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_computarizado_Descripcion"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Matricula"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Codigo_ATA"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Reporte_de_aeronave"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_de_bitacora"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Descripcion_breve"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "N_Orden_de_Trabajo"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "No_Reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "IdCotizacion"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Id_Inspeccion_de_Entrada"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "IdDiscrepancia"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Tipo_de_reporte_OS"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Descripcion_del_componente"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Numero_de_parte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Numero_de_serie"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "No__de_Orden_de_Servicio"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Promedio_de_ejecucion"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Creacion_del_Reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_de_Creacion_del_Reporte"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Fecha_de_Asignacion"); this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Hora_de_Asignacion"); } 
    }
    //TERMINA - BRID:7039


    //INICIA - BRID:7041 - WF:5 Rule - Phase: 1 (Crear Nuevo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '1'", 1, 'ABC123')) { } 
    }
    //TERMINA - BRID:7041

    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20') && this.EstatusEditarConsulta == 1) {
        if(this.dataSourceEjecutantes.data.filter( x => x.Motivo_de_pausa == "").length > 0) {
          this.botonIniciarDisabled = true;
          this.botonPausarDisabled = true;
          this.botonReanudarDisabled = true;
          this.botonDetenerDisabled = true;
        }
        else if(this.dataSourceEjecutantes.data.filter( x => x.Motivo_de_pausa.length > 0).length > 0 
          && this.dataSourceEjecutantes.data.filter( x => x.Motivo_de_pausa == "").length == 0
          && !this.botonPausarDisabled && !this.botonDetenerDisabled
          && this.botonIniciarDisabled && this.botonReanudarDisabled) {
          this.botonIniciarDisabled = true;
          this.botonPausarDisabled = false;
          this.botonReanudarDisabled = true;          
          this.botonDetenerDisabled = false;
        }
        else if(this.dataSourceEjecutantes.data.filter( x => x.Motivo_de_pausa.length > 0).length > 0 && this.dataSourceEjecutantes.data.filter( x => x.Motivo_de_pausa == "").length == 0) {
          this.botonIniciarDisabled = true;
          this.botonReanudarDisabled = false;
          this.botonPausarDisabled = true;
          this.botonDetenerDisabled = true;
        }        
        else {
          this.botonIniciarDisabled = false;
          this.botonPausarDisabled = true;
          this.botonReanudarDisabled = true;
          this.botonDetenerDisabled = true;
        }
      }
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('43', '43') ||
        this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17') ||
        this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25')) {
        this.botonIniciarDisabled = true;
        this.botonPausarDisabled = true;
        this.botonReanudarDisabled = true;
        this.botonDetenerDisabled = true;
      }
    }

    //rulesOnInit_ExecuteBusinessRulesEnd


  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:3914 - Guardar Numero de Reporte igual al Folio - Autor: Aaron - Actualización: 7/29/2021 11:18:03 AM
    if (this.operation == 'New') {
      await this.brf.EvaluaQueryAsync(`EXEC upsGuardarNumeroReporte ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}`, 1, "ABC123");
    }
    //TERMINA - BRID:3914

    //INICIA - BRID:4060 - Insertar Reportes a una OT Abierta cuando provienen de discrepancias - Autor: Aaron - Actualización: 7/3/2021 6:43:09 PM
    if (this.operation == 'Update') {
      if (this.Crear_ReporteForm.get('Origen_del_reporte').value == this.brf.TryParseInt('3', '3')) {
        let value = this.Crear_ReporteForm.get('N_Orden_de_Trabajo').value;
        await this.brf.EvaluaQueryAsync(` EXEC Insert_Reportes_OT_Abierta ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}, ${value} `, 1, "ABC123");
      }
    }
    //TERMINA - BRID:4060

    //INICIA - BRID:4163 - INSERTAR SERVICIOS, HERRAMIENTAS, PARTES Y MATERIALES EN GESTION DE APROBACION POR PROGRAMADOR AL NUEVO - Autor: Aaron - Actualización: 8/25/2021 8:21:18 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25')) {
        await this.brf.EvaluaQueryAsync(`EXEC Insert_Enviar_a_Gestion_Aprobacion ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}, ${this.localStorageHelper.getItemFromLocalStorage('USERROLEID')} `, 1, "ABC123");
      }
    }
    //TERMINA - BRID:4163


    //INICIA - BRID:4214 - Envio de Correo al Cerrar un reporte - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:04:18 PM
    if (this.operation == 'Update') {
      //if (this.brf.EvaluaQuery("Select "+this.localStorageHelper.getLoggedUserInfo().RoleId, 1, 'ABC123') == this.brf.TryParseInt('1', '1') && this.Crear_ReporteForm.get('Estatus').value  == this.brf.TryParseInt('2', '2')) { this.brf.SendEmailQuery("Aviso de Cierre de Reporte.", this.brf.EvaluaQuery("select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (1,19,9,43,17)) A for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <title>EmailTemplate-Fluid</title> <style type='text/css'> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*='margin: 16px 0'] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'> <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0' style='border-collapse:collapse;'> <tr> <td> <center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --> <div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'> Aerovics </div> <!-- Visually Hidden Preheader Text : END --> <div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'> <tr> <td width='40'>&nbsp;</td> <td width='260'> <img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'> </td> <td>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> <tr> <td width='40'>&nbsp;</td> <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td> <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing='0' cellpadding='0' border='0' width='100%'> <tr>  <td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'>  <p>Estimados buenos días</p> <p>Se notifica a todos del Cierre de los Trabajos descritos a continuación:    </p> <br> <p><strong>No. Orden de trabajo:</strong> GLOBAL[numero_de_orden]</p> <br><p><strong>No. de reporte:</strong> GLOBAL[numero_de_reporte]</p> <br><p><strong>Matrícula:</strong> GLOBAL[matricula]</p> <br> <p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p> <br> <p><strong>Codigo:</strong> GLOBAL[codigo]</p> <br><p><strong>Trabajo Por Realizar: </strong> GLOBAL[trabajo_por_realizar]</p> <br><p><strong> Respuesta del reporte:  </strong> GLOBAL[respuesta_de_reporte]</p> <br><p><strong>Atentamente:</strong> GLOBAL[nombre_usuario]</p> <p>Favor de enviar acuse de recibido.</p>  <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>  <img style='width: 40px; height: 40px;' src='http://108.60.201.12/vicsdemoventas3/images/profile_small.jpg'/> </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>  "); } 
    }
    //TERMINA - BRID:4214


    //INICIA - BRID:4368 - Envío de Correo Cuando contesta un Técnico  - Autor: Aaron - Actualización: 7/26/2021 2:22:26 PM
    if (this.operation == 'Update') {
      //if (this.brf.EvaluaQuery("select "+this.localStorageHelper.getLoggedUserInfo().RoleId, 1, 'ABC123') == this.brf.TryParseInt('20', '20')) { this.brf.SendEmailQuery("Aviso de Respuesta a Reporte.", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + '' from Spartan_User where Role in (1,19,43,17,9) for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html>  <head>     <meta charset='utf-8'>     <meta name='viewport' content='width=device-width, initial-scale=1.0'>     <meta http-equiv='X-UA-Compatible' content='IE=edge'>     <title>EmailTemplate-Fluid</title>      <style type='text/css'>         html,         body {             margin: 20px 0 0 0 !important;             padding: 0 !important;             width: 100% i !important;             background-color: #e0e0e0 !important;         }          * {             -ms-text-size-adjust: 100%;             -webkit-text-size-adjust: 100%;         }          .ExternalClass {             width: 100%;         }          div[style*='margin: 16px 0'] {             margin: 0 !important;         }          table,         td {             mso-table-lspace: 0pt !important;             mso-table-rspace: 0pt !important;         }          table {             border-spacing: 0 !important;             border-collapse: collapse !important;             table-layout: fixed !important;             margin: 0 auto !important;         }          table table table {             table-layout: auto;         }          img {             -ms-interpolation-mode: bicubic;         }          .yshortcuts a {             border-bottom: none !important;         }          a[x-apple-data-detectors] {             color: inherit !important;         }          /* Estilos Hover para botones */         .button-td,         .button-a {             transition: all 100ms ease-in;         }          .button-td:hover,         .button-a:hover {             color: #000;         }     </style> </head>  <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'>     <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0'         style='border-collapse:collapse;'>         <tr>             <td>                 <center style='width: 100%;'>                      <!-- Visually Hidden Preheader Text : BEGIN -->                     <div                         style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>                         Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div>                     <!-- Visually Hidden Preheader Text : END -->                      <div style='max-width: 600px;'>                         <!--[if (gte mso 9)|(IE)]>             <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'>             <tr>             <td>             <![endif]-->                          <!-- Email Header : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px; border-top: 5px solid #1F1F1F'>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto'                                         style='padding: 26px 0 10px 0' alt='alt_text'></td>                                 <td>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td>                                 <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                         </table>                         <!-- Email Header : END -->                          <!-- Email Body : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px;'>                              <!-- 1 Column Text : BEGIN -->                             <tr>                                 <td>                                     <table cellspacing='0' cellpadding='0' border='0' width='100%'>                                         <tr>                                             <td                                                 style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Buenos días</p><p>Favor de efectuar la revisión de los trabajos descritos a continuación: </p><br><p><strong>No. De OT:</strong> GLOBAL[numero_de_orden]</p><br><p><strong>Matrícula: </strong>GLOBAL[matricula]</p><br><p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p><br><p><strong>Código Computarizado:</strong> GLOBAL[codigo_computarizado]</p><br><p><strong>Descripción: </strong> GLOBAL[descripcion]</p><br><p><strong>Trabajo por Realizar: </strong> GLOBAL[trabajo])</p><p>Favor de enviar acuse de recibido.</p><p>Saludos,</p></td></tr></table></td></tr><!-- 1 Column Text : BEGIN --></table><!-- Email Body : END --><!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>   </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>  "); } 
    }
    //TERMINA - BRID:4368


    //INICIA - BRID:4435 - Enviar Reporte cuando decline un Supervisor - Autor: Administrador - Actualización: 7/27/2021 12:14:39 PM
    if (this.operation == 'Update') {
      //if (this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_sup') == this.brf.TryParseInt('1', '1') && this.brf.EvaluaQuery("select "+this.localStorageHelper.getLoggedUserInfo().RoleId, 1, 'ABC123') == this.brf.TryParseInt('43', '43')) { this.brf.SendEmailQuery("Aviso de Respuesta a Reporte", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + '' from Spartan_User where Role in (9,17,43) for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html>  <head>     <meta charset='utf-8'>     <meta name='viewport' content='width=device-width, initial-scale=1.0'>     <meta http-equiv='X-UA-Compatible' content='IE=edge'>     <title>EmailTemplate-Fluid</title>      <style type='text/css'>         html,         body {             margin: 20px 0 0 0 !important;             padding: 0 !important;             width: 100% i !important;             background-color: #e0e0e0 !important;         }          * {             -ms-text-size-adjust: 100%;             -webkit-text-size-adjust: 100%;         }          .ExternalClass {             width: 100%;         }          div[style*='margin: 16px 0'] {             margin: 0 !important;         }          table,         td {             mso-table-lspace: 0pt !important;             mso-table-rspace: 0pt !important;         }          table {             border-spacing: 0 !important;             border-collapse: collapse !important;             table-layout: fixed !important;             margin: 0 auto !important;         }          table table table {             table-layout: auto;         }          img {             -ms-interpolation-mode: bicubic;         }          .yshortcuts a {             border-bottom: none !important;         }          a[x-apple-data-detectors] {             color: inherit !important;         }          /* Estilos Hover para botones */         .button-td,         .button-a {             transition: all 100ms ease-in;         }          .button-td:hover,         .button-a:hover {             color: #000;         }     </style> </head>  <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'>     <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0'         style='border-collapse:collapse;'>         <tr>             <td>                 <center style='width: 100%;'>                      <!-- Visually Hidden Preheader Text : BEGIN -->                     <div                         style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>                         Aerovics - Mantenimiento</div>                     <!-- Visually Hidden Preheader Text : END -->                      <div style='max-width: 600px;'>                         <!--[if (gte mso 9)|(IE)]>             <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'>             <tr>             <td>             <![endif]-->                          <!-- Email Header : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px; border-top: 5px solid #1F1F1F'>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto'                                         style='padding: 26px 0 10px 0' alt='alt_text'></td>                                 <td>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td>                                 <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                         </table>                         <!-- Email Header : END -->                          <!-- Email Body : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px;'>                              <!-- 1 Column Text : BEGIN -->                             <tr>                                 <td>                                     <table cellspacing='0' cellpadding='0' border='0' width='100%'>                                         <tr>                                             <td                                                 style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Buenos días</p><p>Favor de efectuar la revisión de los trabajos descritos a continuación: </p><br><p><strong>No. De OT:</strong> GLOBAL[numero_ot]</p><br><p><strong>Estatus: </strong> Aprobado</p><br><p><strong>No. de reporte: </strong> "+ this.Crear_ReporteForm.get('Folio').value+"</p><br><p><strong>Matrícula: </strong>GLOBAL[matricula]</p><br><p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p><br><p>Atentamente: GLOBAL[nombre_usuario]</p><br><p>Favor de enviar acuse de recibido.</p><p>Saludos,</p></td></tr></table></td></tr><!-- 1 Column Text : BEGIN --></table><!-- Email Body : END --><!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>   </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>"); } 
    }
    //TERMINA - BRID:4435


    //INICIA - BRID:4459 - Enviar correo al declinar por supervisor - Autor: Administrador - Actualización: 7/27/2021 12:35:17 PM
    if (this.operation == 'Update') {
      //if (this.brf.EvaluaQuery("select "+this.localStorageHelper.getLoggedUserInfo().RoleId, 1, 'ABC123') == this.brf.TryParseInt('43', '43') && this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_sup') == this.brf.EvaluaQuery("2", 1, 'ABC123')) { this.brf.SendEmailQuery("Aviso de respuesta a reporte", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + '' from Spartan_User where Role in (9,43) for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html>  <head>     <meta charset='utf-8'>     <meta name='viewport' content='width=device-width, initial-scale=1.0'>     <meta http-equiv='X-UA-Compatible' content='IE=edge'>     <title>EmailTemplate-Fluid</title>      <style type='text/css'>         html,         body {             margin: 20px 0 0 0 !important;             padding: 0 !important;             width: 100% i !important;             background-color: #e0e0e0 !important;         }          * {             -ms-text-size-adjust: 100%;             -webkit-text-size-adjust: 100%;         }          .ExternalClass {             width: 100%;         }          div[style*='margin: 16px 0'] {             margin: 0 !important;         }          table,         td {             mso-table-lspace: 0pt !important;             mso-table-rspace: 0pt !important;         }          table {             border-spacing: 0 !important;             border-collapse: collapse !important;             table-layout: fixed !important;             margin: 0 auto !important;         }          table table table {             table-layout: auto;         }          img {             -ms-interpolation-mode: bicubic;         }          .yshortcuts a {             border-bottom: none !important;         }          a[x-apple-data-detectors] {             color: inherit !important;         }          /* Estilos Hover para botones */         .button-td,         .button-a {             transition: all 100ms ease-in;         }          .button-td:hover,         .button-a:hover {             color: #000;         }     </style> </head>  <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'>     <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0'         style='border-collapse:collapse;'>         <tr>             <td>                 <center style='width: 100%;'>                      <!-- Visually Hidden Preheader Text : BEGIN -->                     <div                         style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>                         Aerovics - Mantenimiento</div>                     <!-- Visually Hidden Preheader Text : END -->                      <div style='max-width: 600px;'>                         <!--[if (gte mso 9)|(IE)]>             <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'>             <tr>             <td>             <![endif]-->                          <!-- Email Header : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px; border-top: 5px solid #1F1F1F'>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto'                                         style='padding: 26px 0 10px 0' alt='alt_text'></td>                                 <td>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td>                                 <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                         </table>                         <!-- Email Header : END -->                          <!-- Email Body : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px;'>                              <!-- 1 Column Text : BEGIN -->                             <tr>                                 <td>                                     <table cellspacing='0' cellpadding='0' border='0' width='100%'>                                         <tr>                                             <td                                                 style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Buenos días</p><p>Favor de efectuar la revisión de los trabajos descritos a continuación: </p><br><p><strong>No. De OT:</strong> GLOBAL[numero_ot]</p><br><p><strong>Estatus: </strong> Rechazado</p><br><p><strong>No. de reporte: </strong> "+ this.Crear_ReporteForm.get('Folio').value+"</p><br><p><strong>Matrícula: </strong>GLOBAL[matricula]</p><br><p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p><br><p><strong>Motivo de rechazo:</strong> GLOBAL[respuesta_sup]</p><br><p>Atentamente: GLOBAL[nombre_usuario]</p><br><p>Favor de enviar acuse de recibido.</p><p>Saludos,</p></td></tr></table></td></tr><!-- 1 Column Text : BEGIN --></table><!-- Email Body : END --><!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>   </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>"); } 
    }
    //TERMINA - BRID:4459


    //INICIA - BRID:4467 - Envio de Correo cuando Inspector Declina - Autor: Aaron - Actualización: 7/28/2021 9:05:47 AM
    if (this.operation == 'Update') {
      //if (this.brf.EvaluaQuery("select "+this.localStorageHelper.getLoggedUserInfo().RoleId, 1, 'ABC123') == this.brf.TryParseInt('17', '17') && this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_ins') == this.brf.TryParseInt('2', '2')) { this.brf.SendEmailQuery("Aviso de Respuesta a Reporte", this.brf.EvaluaQuery("select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (9,43,17)) A for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html>  <head>     <meta charset='utf-8'>     <meta name='viewport' content='width=device-width, initial-scale=1.0'>     <meta http-equiv='X-UA-Compatible' content='IE=edge'>     <title>EmailTemplate-Fluid</title>      <style type='text/css'>         html,         body {             margin: 20px 0 0 0 !important;             padding: 0 !important;             width: 100% i !important;             background-color: #e0e0e0 !important;         }          * {             -ms-text-size-adjust: 100%;             -webkit-text-size-adjust: 100%;         }          .ExternalClass {             width: 100%;         }          div[style*='margin: 16px 0'] {             margin: 0 !important;         }          table,         td {             mso-table-lspace: 0pt !important;             mso-table-rspace: 0pt !important;         }          table {             border-spacing: 0 !important;             border-collapse: collapse !important;             table-layout: fixed !important;             margin: 0 auto !important;         }          table table table {             table-layout: auto;         }          img {             -ms-interpolation-mode: bicubic;         }          .yshortcuts a {             border-bottom: none !important;         }          a[x-apple-data-detectors] {             color: inherit !important;         }          /* Estilos Hover para botones */         .button-td,         .button-a {             transition: all 100ms ease-in;         }          .button-td:hover,         .button-a:hover {             color: #000;         }     </style> </head>  <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'>     <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0'         style='border-collapse:collapse;'>         <tr>             <td>                 <center style='width: 100%;'>                      <!-- Visually Hidden Preheader Text : BEGIN -->                     <div                         style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>                         Aerovics - Mantenimiento</div>                     <!-- Visually Hidden Preheader Text : END -->                      <div style='max-width: 600px;'><!--[if (gte mso 9)|(IE)]>             <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'>             <tr>             <td>             <![endif]--><!-- Email Header : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'><tr><td width='40'>&nbsp;</td><td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr><td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table><!-- Email Header : END --><!-- Email Body : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'><!-- 1 Column Text : BEGIN --><tr><td><table cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Buenos días</p><p>Favor de efectuar la revisión de los trabajos descritos a continuación: </p><br><p><strong>No. De OT:</strong> GLOBAL[numero_de_orden]</p><br><p><strong>Estatus: </strong> Rechazado por Inspector</p><br><p><strong>No. de reporte: </strong> "+ this.Crear_ReporteForm.get('Folio').value+"</p><br><p><strong>Matrícula: </strong>GLOBAL[matricula]</p><br><p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p><br><p><strong>Respuesta de supervisor:</strong> GLOBAL[respuesta_sup]</p><br><p>Atentamente: GLOBAL[nombre_usuario]</p><br><p>Favor de enviar acuse de recibido.</p><p>Saludos,</p></td></tr></table></td></tr><!-- 1 Column Text : BEGIN --></table><!-- Email Body : END --><!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>   </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>"); } 
    }
    //TERMINA - BRID:4467


    //INICIA - BRID:4468 - Envío de Correo cuando Aprueba Supervisor - Autor: Aaron - Actualización: 7/28/2021 9:20:23 AM
    if (this.operation == 'Update') {
      //if (this.brf.EvaluaQuery("select "+this.localStorageHelper.getLoggedUserInfo().RoleId, 1, 'ABC123') == this.brf.TryParseInt('17', '17') && this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_ins') == this.brf.TryParseInt('1', '1')) { this.brf.SendEmailQuery("Aviso de Respuesta a Reporte", this.brf.EvaluaQuery("select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (9,43,17)) A for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html>  <head>     <meta charset='utf-8'>     <meta name='viewport' content='width=device-width, initial-scale=1.0'>     <meta http-equiv='X-UA-Compatible' content='IE=edge'>     <title>EmailTemplate-Fluid</title>      <style type='text/css'>         html,         body {             margin: 20px 0 0 0 !important;             padding: 0 !important;             width: 100% i !important;             background-color: #e0e0e0 !important;         }          * {             -ms-text-size-adjust: 100%;             -webkit-text-size-adjust: 100%;         }          .ExternalClass {             width: 100%;         }          div[style*='margin: 16px 0'] {             margin: 0 !important;         }          table,         td {             mso-table-lspace: 0pt !important;             mso-table-rspace: 0pt !important;         }          table {             border-spacing: 0 !important;             border-collapse: collapse !important;             table-layout: fixed !important;             margin: 0 auto !important;         }          table table table {             table-layout: auto;         }          img {             -ms-interpolation-mode: bicubic;         }          .yshortcuts a {             border-bottom: none !important;         }          a[x-apple-data-detectors] {             color: inherit !important;         }          /* Estilos Hover para botones */         .button-td,         .button-a {             transition: all 100ms ease-in;         }          .button-td:hover,         .button-a:hover {             color: #000;         }     </style> </head>  <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'>     <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0'         style='border-collapse:collapse;'>         <tr>             <td>                 <center style='width: 100%;'>                      <!-- Visually Hidden Preheader Text : BEGIN -->                     <div                         style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>                         Aerovics - Mantenimiento</div>                     <!-- Visually Hidden Preheader Text : END -->                      <div style='max-width: 600px;'><!--[if (gte mso 9)|(IE)]>             <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'>             <tr>             <td>             <![endif]--><!-- Email Header : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'><tr><td width='40'>&nbsp;</td><td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr><td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table><!-- Email Header : END --><!-- Email Body : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'><!-- 1 Column Text : BEGIN --><tr><td><table cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Buenos días</p><p>Favor de efectuar la revisión de los trabajos descritos a continuación: </p><br><p><strong>No. De OT:</strong> GLOBAL[numero_de_orden]</p><br><p><strong>Estatus: </strong> Aprobado por Inspector</p><br><p><strong>No. de reporte: </strong> "+ this.Crear_ReporteForm.get('Folio').value+"</p><br><p><strong>Matrícula: </strong>GLOBAL[matricula]</p><br><p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p><br><p><strong>Respuesta de supervisor:</strong> GLOBAL[respuesta_sup]</p><br><p>Atentamente: GLOBAL[nombre_usuario]</p><br><p>Favor de enviar acuse de recibido.</p><p>Saludos,</p></td></tr></table></td></tr><!-- 1 Column Text : BEGIN --></table><!-- Email Body : END --><!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>   </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>"); } 
    }
    //TERMINA - BRID:4468


    //INICIA - BRID:4511 - Enviar correo cuando programador declina el reporte - Autor: Aaron - Actualización: 7/28/2021 4:30:24 PM
    if (this.operation == 'Update') {
      //if (this.brf.EvaluaQuery("select "+this.localStorageHelper.getLoggedUserInfo().RoleId, 1, 'ABC123') == this.brf.TryParseInt('25', '25') && this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_pro') == this.brf.TryParseInt('2', '2')) { this.brf.SendEmailQuery("Aviso de respuesta a reporte", this.brf.EvaluaQuery("Select ';'+ Email From Spartan_User Where id_user = (Select top 1 Asignado_a From  Detalles_de_trabajo_de_OT where Folio_de_Reporte =  "+ this.Crear_ReporteForm.get('Folio').value+")", 1, "ABC123"), "<!doctype html> <html>  <head>     <meta charset='utf-8'>     <meta name='viewport' content='width=device-width, initial-scale=1.0'>     <meta http-equiv='X-UA-Compatible' content='IE=edge'>     <title>EmailTemplate-Fluid</title>      <style type='text/css'>         html,         body {             margin: 20px 0 0 0 !important;             padding: 0 !important;             width: 100% i !important;             background-color: #e0e0e0 !important;         }          * {             -ms-text-size-adjust: 100%;             -webkit-text-size-adjust: 100%;         }          .ExternalClass {             width: 100%;         }          div[style*='margin: 16px 0'] {             margin: 0 !important;         }          table,         td {             mso-table-lspace: 0pt !important;             mso-table-rspace: 0pt !important;         }          table {             border-spacing: 0 !important;             border-collapse: collapse !important;             table-layout: fixed !important;             margin: 0 auto !important;         }          table table table {             table-layout: auto;         }          img {             -ms-interpolation-mode: bicubic;         }          .yshortcuts a {             border-bottom: none !important;         }          a[x-apple-data-detectors] {             color: inherit !important;         }          /* Estilos Hover para botones */         .button-td,         .button-a {             transition: all 100ms ease-in;         }          .button-td:hover,         .button-a:hover {             color: #000;         }     </style> </head>  <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'>     <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0'         style='border-collapse:collapse;'>         <tr>             <td>                 <center style='width: 100%;'>                      <!-- Visually Hidden Preheader Text : BEGIN -->                     <div                         style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>                         Aerovics - Mantenimiento</div>                     <!-- Visually Hidden Preheader Text : END -->                      <div style='max-width: 600px;'><!--[if (gte mso 9)|(IE)]>             <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'>             <tr>             <td>             <![endif]--><!-- Email Header : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'><tr><td width='40'>&nbsp;</td><td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr><td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table><!-- Email Header : END --><!-- Email Body : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'><!-- 1 Column Text : BEGIN --><tr><td><table cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Buenos días</p><p>Favor de efectuar la revisión de los trabajos descritos a continuación: </p><br><p><strong>No. De OT:</strong> GLOBAL[numero_de_orden]</p><br><p><strong>Estatus: </strong> Declinado por programador</p><br><p><strong>No. de reporte: </strong> "+ this.Crear_ReporteForm.get('Folio').value+"</p><br><p><strong>Matrícula: </strong>GLOBAL[matricula]</p><br><p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p><br><p><strong>Respuesta de programador:</strong> GLOBAL[respuesta_pro]</p><br><p>Atentamente: GLOBAL[nombre_usuario]</p><br><p>Favor de enviar acuse de recibido.</p><p>Saludos,</p></td></tr></table></td></tr><!-- 1 Column Text : BEGIN --></table><!-- Email Body : END --><!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>   </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>"); } 
    }
    //TERMINA - BRID:4511


    //INICIA - BRID:4536 - Enviar correo cuando se crea un nuevo reporte - Autor: Aaron - Actualización: 7/29/2021 1:41:59 PM
    if (this.operation == 'New') {
      //this.brf.SendEmailQuery("Aviso de Creación de Reporte", this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (19,9,43,17)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User =  GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <title>EmailTemplate-Fluid</title> <style type='text/css'> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*='margin: 16px 0'] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'> <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0' style='border-collapse:collapse;'> <tr> <td> <center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --> <div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'> Aerovics </div> <!-- Visually Hidden Preheader Text : END --> <div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'> <tr> <td width='40'>&nbsp;</td> <td width='260'> <img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'> </td> <td>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> <tr> <td width='40'>&nbsp;</td> <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td> <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing='0' cellpadding='0' border='0' width='100%'> <tr>  <td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'>  <p>Buenos días</p> <p>Ha sido registrado un nuevo reporte en la base de datos con la siguiente Información:</p> <br> <p><strong>No. de reporte:</strong> GLOBAL[KeyValueInserted]</p> <br><p><strong>Matrícula:</strong> GLOBAL[matricula]</p> <br> <p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p> <br><p><strong>Tipo de código:</strong> GLOBAL[tipo_codigo]</p> <br> <p><strong>Código:</strong> GLOBAL[codigo]</p><br> <p><strong> Descripción:  </strong> GLOBAL[descripcion_reporte]</p> <br><br><p><strong>Trabajo Por Realizar: </strong> GLOBAL[trabajo_por_realizar]</p> <br><p><strong>Atentamente:</strong> GLOBAL[nombre_usuario]</p> <p>Favor de enviar acuse de recibido.</p>  <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>  </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>");
    }
    //TERMINA - BRID:4536


    //INICIA - BRID:4785 - Guardar Estatus de reporte en OT - Autor: Aaron - Actualización: 8/6/2021 1:30:16 PM
    if (this.operation == 'Update') {
      await this.brf.EvaluaQueryAsync(" EXEC Update_Estatus_Reporte '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, "ABC123");
    }
    //TERMINA - BRID:4785


    //INICIA - BRID:5445 - ENVIAR PARTES, HERRAMIENTAS, MATERIALES Y SERVICIOS A APROBACION AL EDITAR POR TECNICO O PROGRAMADO - Autor: Aaron - Actualización: 9/2/2021 3:53:29 PM
    if (this.operation == 'Update') {
      if (await this.brf.EvaluaQueryAsync("Select Estatus From Crear_Reporte Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') == this.brf.TryParseInt('3', '3') &&
        this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20')) {
        await this.brf.EvaluaQueryAsync("EXEC Insert_Enviar_a_Gestion_Aprobacion '" +
          this.Crear_ReporteForm.get('Folio').value + "', " + this.localStorageHelper.getItemFromLocalStorage('USERROLEID'), 1, "ABC123");
      }
    }
    //TERMINA - BRID:5445


    //INICIA - BRID:5560 - Cambiar Estatus Cuando SUPERVISOR APRUEBE un reporte de OS: ASISTENCIA TÉCNICA Y CARGA DE COMBUSTIBLE - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:04:56 PM
    if (this.operation == 'Update') {
      if (await this.brf.EvaluaQueryAsync("Select COUNT(1) from Crear_reporte C LEFT JOIN Detalle_de_reportes_por_componentes RC ON C.Folio = RC.Reporte LEFT JOIN Detalle_de_reportes_por_aeronave RA ON C.Folio = RA.Reporte Where C.No__de_Orden_de_Servicio is not null AND C.Estatus = 3 AND (RA.Tipo_de_OS IN (2,5) OR RC.Tipo_de_OS IN (2,5)) AND C.Resultado_sup = 1 AND C.Folio = '" + this.Crear_ReporteForm.get('Folio').value + "' ", 1, 'ABC123') > this.brf.TryParseInt('0', '0')) {
        await this.brf.EvaluaQueryAsync("Update Crear_reporte Set Estatus = 4 Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "' ", 1, "ABC123");
      }
    }
    //TERMINA - BRID:5560


    //INICIA - BRID:5566 - ENVIAR SERVICIOS, HERRAMIENTAS, PARTES  A APROBACION AL EDITAR UN PROGRAMADOR - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:05:22 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25') &&
        this.Crear_ReporteForm.get('Estatus').value == this.brf.TryParseInt('5', '5')) {
        await this.brf.EvaluaQueryAsync(" EXEC Insert_Enviar_a_Gestion_Aprobacion '" + this.Crear_ReporteForm.get('Folio').value + "', " + this.localStorageHelper.getItemFromLocalStorage('USERROLEID'), 1, "ABC123");
      }
    }
    //TERMINA - BRID:5566

    //INICIA - BRID:5567 - Guardar datos en Historial de remoción de partes y en Historial de instalación de partes. - Autor: Jose Caballero - Actualización: 8/31/2021 12:15:29 PM
    await this.brf.EvaluaQueryAsync(` EXEC sp_InsertarHistorialRemocionPartes ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)} `, 1, "ABC123");
    await this.brf.EvaluaQueryAsync(` EXEC sp_InsertarHistorialInstalacionPartes ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)} `, 1, "ABC123");
    //TERMINA - BRID:5567

    //INICIA - BRID:5613 - Limpiar campos de aprobaciones cuando se regresa el reporte al técnico OT Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/3/2021 6:11:56 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20') &&
        this.Crear_ReporteForm.get('N_Orden_de_Trabajo').value != null) {
        await this.brf.EvaluaQueryAsync("EXEC spLimpiarCamposDeAprobacionesOT '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, "ABC123");
      }
    }
    //TERMINA - BRID:5613

    //INICIA - BRID:5623 - RN para Que tecnico responda reporte  - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:05:35 PM
    if (this.operation == 'Update') {
      if (await this.brf.EvaluaQueryAsync("Select Estatus From Crear_Reporte Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') ==
        this.brf.TryParseInt('2', '2') &&
        this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20') &&
        this.localStorageHelper.getItemFromLocalStorage('Solicita_Herramientas') == this.brf.TryParseInt('1', '1')) {
        await this.brf.EvaluaQueryAsync("EXEC Insert_Enviar_a_Gestion_Aprobacion '" + this.Crear_ReporteForm.get('Folio').value + "', " +
          this.localStorageHelper.getItemFromLocalStorage('USERID'), 1, "ABC123");
      }
    }
    //TERMINA - BRID:5623

    //INICIA - BRID:5624 - actualizar respuesta total OT - Autor: Jose Caballero - Actualización: 9/2/2021 4:27:24 PM
    if (this.operation == 'Update') {
      await this.brf.EvaluaQueryAsync(`EXEC sp_upd_Respueta_Total ${this.Crear_ReporteForm.get('N_Orden_de_Trabajo').value}, ${this.brf.GetValueByControlType(this.Crear_ReporteForm, 'No_Reporte')} `, 1, "ABC123");
    }
    //TERMINA - BRID:5624

    //INICIA - BRID:5886 - Insertar Reportes en detalles de reportes de OT - Autor: Aaron - Actualización: 9/23/2021 12:19:04 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17') &&
        await this.brf.EvaluaQueryAsync(` EXEC uspAeronavePropiaoExterna '${this.Crear_ReporteForm.get('Matricula').value.Matricula}' `, 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        await this.brf.EvaluaQueryAsync(` EXEC InsReporteDiscrepanciaEnOT ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)} `, 1, "ABC123");
        await this.brf.EvaluaQueryAsync(` EXEC Insert_Enviar_a_Gestion_Aprobacion ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}, ${this.localStorageHelper.getItemFromLocalStorage('USERROLEID')} `, 1, "ABC123");
      }
    }
    //TERMINA - BRID:5886

    //INICIA - BRID:6421 - Generar Cotizacion cuando es aeronave externa - Autor: Aaron - Actualización: 9/28/2021 4:45:33 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17') &&
        await this.brf.EvaluaQueryAsync(`EXEC uspAeronavePropiaoExterna '${this.Crear_ReporteForm.get('Matricula').value.Matricula}'`, 1, 'ABC123') == this.brf.TryParseInt('0', '0') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Tipo_de_reporte') == this.brf.TryParseInt('6', '6')) {
        await this.brf.EvaluaQueryAsync(` EXEC uspGeneraCotizacionDesdeDiscrepanciaMtto ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}, 
          ${this.localStorageHelper.getItemFromLocalStorage('USERROLEID')} `, 1, "ABC123");
        await this.brf.EvaluaQueryAsync(` EXEC sp_insdetalle_de_trabajo_de_Ot ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6421

    //INICIA - BRID:6439 - Enviar reportes a una OT cuando el reporte se aprobo por ventas - Autor: Aaron - Actualización: 9/28/2021 1:36:57 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getItemFromLocalStorage('TipoNotificacion') == this.brf.TryParseInt('4', '4')) {
        this.brf.EvaluaQueryAsync(` EXEC sp_insdetalle_de_trabajo_de_Ot ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}`, 1, "ABC123");
        this.brf.EvaluaQueryAsync(` EXEC uspActualizaFolioReporteCotizacion ${this.localStorageHelper.getItemFromLocalStorage('Solicita_Herramientas')}, ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6439

    setTimeout(() => {
      this.isLoading = false;
      this.spinner.hide('loading');
      this.goToList();
    }, 3000);

    //rulesAfterSave_ExecuteBusinessRulesEnd

  }

  async rulesBeforeSave(): Promise<boolean> {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:4213 - Crear Variables de sesión para envío de correo  - Autor: Aaron - Actualización: 7/26/2021 2:38:15 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.CreateSessionVar("numero_de_orden", this.brf.EvaluaQuery(" Select FLD[N_Orden_de_Trabajo]", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("numero_de_reporte", this.brf.EvaluaQuery(" Select FLD[Folio]", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("matricula", this.brf.EvaluaQuery(" Select 'FLD[Matricula]'", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("numero_de_serie", this.brf.EvaluaQuery("  Select Numero_de_Serie From Aeronave Where Matricula = 'FLD[Matricula]'", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("codigo", this.brf.EvaluaQuery(" Select 'FLD[Codigo_computarizado_Descripcion]'", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("trabajo_por_realizar", this.brf.EvaluaQuery(" Select 'FLD[Notas]' ", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("respuesta_de_reporte", this.brf.EvaluaQuery("Select 'FLD[Observaciones_pro]' ", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("respuesta_resp", this.brf.EvaluaQuery(" Select 'FLD[Respuesta_resp]'	", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("descripcion", this.brf.EvaluaQuery(" Select 'FLD[Descripcion_breve]'", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("respuesta_sup", this.brf.EvaluaQuery(" Select 'FLD[Observaciones_sup]'", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("respuesta_ins", this.brf.EvaluaQuery(" Select 'FLD[Observaciones_ins]'", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("nombre_usuario", this.brf.EvaluaQuery("Select Name from Spartan_user Where Id_User = GLOBAL[USERID]@LC@@LB@ @LC@@LB@ ", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("descripcion_reporte", this.brf.EvaluaQuery(" Select 'FLD[Descripcion_breve]'", 1, "ABC123"), 1, "ABC123");
      this.brf.CreateSessionVar("tipo_codigo", this.brf.EvaluaQuery(" Select CASE WHEN 'FLD[Codigo_computarizado_Descripcion]' = '' THEN '[Código Computarizado] ' ELSE '' END +  CASE WHEN 'FLD[Codigo_ATA]' = ''THEN ' [Código ATA]' ELSE '' END", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:4213


    //INICIA - BRID:4341 - Contesta técnico de mantenimiento OT Crear_Reporte - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:08:09 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20')
        && this.Crear_ReporteForm.get('N_Orden_de_Trabajo').value != null) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "2");
      }
    }
    //TERMINA - BRID:4341


    //INICIA - BRID:4342 - Aprueba supervisor OT Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/1/2021 2:18:19 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('43', '43') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_sup') == this.brf.TryParseInt('1', '1')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "3");
      }
    }
    //TERMINA - BRID:4342


    //INICIA - BRID:4345 - Rechaza programador OT Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/1/2021 2:50:00 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_pro') == this.brf.TryParseInt('2', '2')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "1");
      }
    }
    //TERMINA - BRID:4345


    //INICIA - BRID:4346 - Aprueba inspector OT Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/1/2021 2:40:21 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_ins') == this.brf.TryParseInt('1', '1')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "4");
      }
    }
    //TERMINA - BRID:4346


    //INICIA - BRID:4347 - Rechaza inspector OT Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/1/2021 2:43:04 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_ins') == this.brf.TryParseInt('2', '2')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "1");
      }
    }
    //TERMINA - BRID:4347


    //INICIA - BRID:4348 - Rechaza supervisor OT Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/1/2021 6:10:56 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('43', '43') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_sup') == this.brf.TryParseInt('2', '2')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "1");
      }
    }
    //TERMINA - BRID:4348


    //INICIA - BRID:4349 - Aprueba programador OT Crear_Reporte - Autor: Agustín Administrador - Actualización: 9/1/2021 2:45:36 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_pro') == this.brf.TryParseInt('1', '1')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "6");
      }
    }
    //TERMINA - BRID:4349


    //INICIA - BRID:4589 - Cambiar Estatus Cuando TECNICO conteste un reporte de OS: ASISTENCIA TÉCNICA Y CARGA DE COMBUSTIBLE - Autor: Agustín Administrador - Actualización: 8/30/2021 11:41:45 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20') &&
        this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != null && this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != '' &&
        await this.brf.EvaluaQueryAsync("Select Estatus  From Crear_Reporte  Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') == this.brf.TryParseInt('1', '1')
        && await this.brf.EvaluaQueryAsync("  Select Tipo_de_OS From (   Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_componentes    Where Reporte = '" +
          this.Crear_ReporteForm.get('Folio').value + "'   UNION   Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_aeronave   Where Reporte = '" + this.Crear_ReporteForm.get('Folio').value + "') P ", 1, 'ABC123') == this.brf.TryParseInt('2,5', '2,5')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "2");
      }
    }
    //TERMINA - BRID:4589


    //INICIA - BRID:5554 - Cambiar Estatus Cuando SUPERVISOR CANCELE un reporte de OS: ASISTENCIA TÉCNICA Y CARGA DE COMBUSTIBLE - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:06:13 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('43', '43') &&
        this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != '' &&
        await this.brf.EvaluaQueryAsync("Select Estatus From Crear_Reporte Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') == this.brf.TryParseInt('2', '2') &&
        await this.brf.EvaluaQueryAsync(" Select Tipo_de_OS From ( Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_componentes Where Reporte = '" +
          this.Crear_ReporteForm.get('Folio').value + "' UNION Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_aeronave Where Reporte = '" +
          this.Crear_ReporteForm.get('Folio').value + "') P ", 1, 'ABC123') == this.brf.TryParseInt('2,5', '2,5') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_sup') == this.brf.TryParseInt('2', '2')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "1");
      }
    }
    //TERMINA - BRID:5554


    //INICIA - BRID:5555 - Cambiar Estatus Cuando PROGRAMADOR ACEPTE CUALQUIER Reporte de OS - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:06:34 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25') &&
        this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != null && this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != '' &&
        await this.brf.EvaluaQueryAsync("Select Estatus From Crear_Reporte Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') ==
        this.brf.TryParseInt('4', '4') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_pro') == this.brf.TryParseInt('1', '1')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "6");
      }
    }
    //TERMINA - BRID:5555


    //INICIA - BRID:5557 - Cambiar Estatus Cuando PROGRAMADOR CANCELE  CUALQUIER Reporte de OS - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:07:01 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('25', '25') &&
        this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != null && this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != '' &&
        await this.brf.EvaluaQueryAsync("Select Estatus From Crear_Reporte Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') ==
        this.brf.TryParseInt('4', '4') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_pro') == this.brf.TryParseInt('2', '2')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "1");
      }
    }
    //TERMINA - BRID:5557


    //INICIA - BRID:5570 - Cambiar Estatus Cuando TECNICO conteste un reporte de OS: Limpieza de aeronave, Armado de llanta, Servicios a baterías y Otros - Autor: Aaron - Actualización: 9/1/2021 7:37:47 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('20', '20') &&
        this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != '' &&
        await this.brf.EvaluaQueryAsync("Select Estatus From Crear_Reporte Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') == this.brf.TryParseInt('1', '1') &&
        await this.brf.EvaluaQueryAsync(" Select Tipo_de_OS From ( Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_componentes Where Reporte = '" +
          this.Crear_ReporteForm.get('Folio').value + "' UNION Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_aeronave Where Reporte = '" + this.Crear_ReporteForm.get('Folio').value + "') P ", 1, 'ABC123') == this.brf.TryParseInt('1,3,4,10', '1,3,4,10')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "3");
      }
    }
    //TERMINA - BRID:5570


    //INICIA - BRID:5572 - Cambiar Estatus Cuando INSPECTOR APRUEBE un reporte de OS: Limpieza de aeronave, Armado de llanta, Servicios a baterías y otros - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:07:15 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17') &&
        this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != '' &&
        await this.brf.EvaluaQueryAsync(" Select Tipo_de_OS From ( Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_componentes Where Reporte = '" +
          this.Crear_ReporteForm.get('Folio').value + "' UNION Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_aeronave Where Reporte = '" +
          this.Crear_ReporteForm.get('Folio').value + "') P ", 1, 'ABC123') == this.brf.TryParseInt('1,3,4,10', '1,3,4,10') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_ins') == this.brf.TryParseInt('1', '1') &&
        await this.brf.EvaluaQueryAsync("Select Estatus From Crear_Reporte Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') == this.brf.TryParseInt('3', '3')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "4");
      }
    }
    //TERMINA - BRID:5572


    //INICIA - BRID:5573 - Cambiar Estatus Cuando INSPECTOR CANCELE un reporte de OS: Limpieza de aeronave, Armado de llanta, Servicios a baterías y otros  - Autor: Eliud Hernandez - Actualización: 10/29/2021 5:07:19 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('17', '17') &&
        this.Crear_ReporteForm.get('No__de_Orden_de_Servicio').value != '' &&
        await this.brf.EvaluaQueryAsync("Select Estatus From Crear_Reporte Where Folio = '" + this.Crear_ReporteForm.get('Folio').value + "'", 1, 'ABC123') == this.brf.TryParseInt('3', '3') &&
        await this.brf.EvaluaQueryAsync(" Select Tipo_de_OS From ( Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_componentes Where Reporte = '" +
          this.Crear_ReporteForm.get('Folio').value + "' UNION Select Folio,Reporte, Tipo_de_OS from Detalle_de_reportes_por_aeronave Where Reporte = '" +
          this.Crear_ReporteForm.get('Folio').value + "') P ", 1, 'ABC123') == this.brf.TryParseInt('1,3,4,10', '1,3,4,10') &&
        this.brf.GetValueByControlType(this.Crear_ReporteForm, 'Resultado_ins') == this.brf.TryParseInt('2', '2')) {
        this.brf.SetValueControl(this.Crear_ReporteForm, "Estatus", "1");
      }
    }
    //TERMINA - BRID:5573


    //INICIA - BRID:5612 - Notificar que pueden haber piezas a solicitar - Autor: Aaron - Actualización: 9/3/2021 3:20:50 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('Solicita_Herramientas') == this.brf.TryParseInt('1', '1') ||
        this.localStorageHelper.getItemFromLocalStorage('Solicita_Partes') == this.brf.TryParseInt('1', '1') ||
        this.localStorageHelper.getItemFromLocalStorage('Solicita_Servicios') == this.brf.TryParseInt('1', '1') ||
        this.localStorageHelper.getItemFromLocalStorage('Solicita_Materiales') == this.brf.TryParseInt('1', '1')) {
        alert("Si ha solicitado Partes, Herramientas, Materiales o Servicios, estos se enviaran a Aprobación. Y su reporte seguirá en espera para ser atendido. Gracias.");
        this.brf.SetNotRequiredControl(this.Crear_ReporteForm, "Respuesta_resp");
      }
    }
    //TERMINA - BRID:5612

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas

}
