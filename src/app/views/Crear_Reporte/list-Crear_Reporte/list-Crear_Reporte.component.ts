import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Crear_ReporteService } from "src/app/api-services/Crear_Reporte.service";
import { Crear_Reporte } from "src/app/models/Crear_Reporte";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2 } from "@angular/core";
import { CollectionViewer } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of } from "rxjs";
import { catchError, finalize, concatMap, switchMap, mergeMap, tap } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import * as AppConstants from "../../../app-constants";
import { StorageKeys } from "../../../app-constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { Crear_ReporteIndexRules } from 'src/app/shared/businessRules/Crear_Reporte-index-rules';
import { DialogConfirmExportComponent } from "./../../../shared/views/dialogs/dialog-confirm-export/dialog-confirm-export.component";
import { Enumerations } from 'src/app/models/enumerations';
import _, { map } from 'underscore';
import { ExcelService } from "src/app/api-services/excel.service";
import * as momentJS from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogPrintFormatComponent } from './../../../shared/views/dialogs/dialog-print-format/dialog-print-format.component';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpartanService } from 'src/app/api-services/spartan.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-list-Crear_Reporte",
  templateUrl: "./list-Crear_Reporte.component.html",
  styleUrls: ["./list-Crear_Reporte.component.scss"],
})
export class ListCrear_ReporteComponent extends Crear_ReporteIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No_Reporte",
    "N_Orden_de_Trabajo",
    "No__de_Orden_de_Servicio",
    "Descripcion_breve",
    "Tipo_de_reporte_OS",
    "Descripcion_del_componente",
    "Numero_de_parte",
    "Numero_de_serie",
    "Fecha_requerida",
    "Promedio_de_ejecucion",
    "Prioridad_del_reporte",
    "Tipo_de_orden_de_trabajo",
    "Estatus",
    "Matricula",
    "Origen_del_reporte",
    "Codigo_computarizado_Descripcion",
    "Ciclos_restantes",
    "Horas_restantes",
    "N_boletin_directiva",
    "Titulo_boletin_directiva",
    "Tipo_de_reporte",
    "Reporte_de_aeronave",
    "N_de_bitacora",
    "Codigo_ATA",
    "IdDiscrepancia",
    "Id_Inspeccion_de_Entrada",
    "IdCotizacion",
    "Fecha_de_Creacion_del_Reporte",
    "Hora_de_Creacion_del_Reporte",
    "Fecha_de_Asignacion",
    "Hora_de_Asignacion",
    "Notas",
    "Tiempo_total_de_ejecucion",
    "Fecha_resp",
    "Hora_resp",
    "Respondiente_resp",
    "Ayuda_de_respuesta_resp",
    "Respuesta_resp",
    "Fecha_sup",
    "Hora_sup",
    "Supervisor",
    "Resultado_sup",
    "Tiempo_ejecucion_Hrs_sup",
    "Observaciones_sup",
    "Fecha_ins",
    "Hora_ins",
    "Inspector",
    "Resultado_ins",
    "Tiempo_ejecucion_Hrs_ins",
    "Observaciones_ins",
    "Fecha_pro",
    "Hora_pro",
    "Programador_de_mantenimiento",
    "Resultado_pro",
    "Tiempo_ejecucion_Hrs_pro",
    "Observaciones_pro",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No_Reporte",
      "N_Orden_de_Trabajo",
      "No__de_Orden_de_Servicio",
      "Descripcion_breve",
      "Tipo_de_reporte_OS",
      "Descripcion_del_componente",
      "Numero_de_parte",
      "Numero_de_serie",
      "Fecha_requerida",
      "Promedio_de_ejecucion",
      "Prioridad_del_reporte",
      "Tipo_de_orden_de_trabajo",
      "Estatus",
      "Matricula",
      "Origen_del_reporte",
      "Codigo_computarizado_Descripcion",
      "Ciclos_restantes",
      "Horas_restantes",
      "N_boletin_directiva",
      "Titulo_boletin_directiva",
      "Tipo_de_reporte",
      "Reporte_de_aeronave",
      "N_de_bitacora",
      "Codigo_ATA",
      "IdDiscrepancia",
      "Id_Inspeccion_de_Entrada",
      "IdCotizacion",
      "Fecha_de_Creacion_del_Reporte",
      "Hora_de_Creacion_del_Reporte",
      "Fecha_de_Asignacion",
      "Hora_de_Asignacion",
      "Notas",
      "Tiempo_total_de_ejecucion",
      "Fecha_resp",
      "Hora_resp",
      "Respondiente_resp",
      "Ayuda_de_respuesta_resp",
      "Respuesta_resp",
      "Fecha_sup",
      "Hora_sup",
      "Supervisor",
      "Resultado_sup",
      "Tiempo_ejecucion_Hrs_sup",
      "Observaciones_sup",
      "Fecha_ins",
      "Hora_ins",
      "Inspector",
      "Resultado_ins",
      "Tiempo_ejecucion_Hrs_ins",
      "Observaciones_ins",
      "Fecha_pro",
      "Hora_pro",
      "Programador_de_mantenimiento",
      "Resultado_pro",
      "Tiempo_ejecucion_Hrs_pro",
      "Observaciones_pro",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No_Reporte_filtro",
      "N_Orden_de_Trabajo_filtro",
      "No__de_Orden_de_Servicio_filtro",
      "Descripcion_breve_filtro",
      "Tipo_de_reporte_OS_filtro",
      "Descripcion_del_componente_filtro",
      "Numero_de_parte_filtro",
      "Numero_de_serie_filtro",
      "Fecha_requerida_filtro",
      "Promedio_de_ejecucion_filtro",
      "Prioridad_del_reporte_filtro",
      "Tipo_de_orden_de_trabajo_filtro",
      "Estatus_filtro",
      "Matricula_filtro",
      "Origen_del_reporte_filtro",
      "Codigo_computarizado_Descripcion_filtro",
      "Ciclos_restantes_filtro",
      "Horas_restantes_filtro",
      "N_boletin_directiva_filtro",
      "Titulo_boletin_directiva_filtro",
      "Tipo_de_reporte_filtro",
      "Reporte_de_aeronave_filtro",
      "N_de_bitacora_filtro",
      "Codigo_ATA_filtro",
      "IdDiscrepancia_filtro",
      "Id_Inspeccion_de_Entrada_filtro",
      "IdCotizacion_filtro",
      "Fecha_de_Creacion_del_Reporte_filtro",
      "Hora_de_Creacion_del_Reporte_filtro",
      "Fecha_de_Asignacion_filtro",
      "Hora_de_Asignacion_filtro",
      "Notas_filtro",
      "Tiempo_total_de_ejecucion_filtro",
      "Fecha_resp_filtro",
      "Hora_resp_filtro",
      "Respondiente_resp_filtro",
      "Ayuda_de_respuesta_resp_filtro",
      "Respuesta_resp_filtro",
      "Fecha_sup_filtro",
      "Hora_sup_filtro",
      "Supervisor_filtro",
      "Resultado_sup_filtro",
      "Tiempo_ejecucion_Hrs_sup_filtro",
      "Observaciones_sup_filtro",
      "Fecha_ins_filtro",
      "Hora_ins_filtro",
      "Inspector_filtro",
      "Resultado_ins_filtro",
      "Tiempo_ejecucion_Hrs_ins_filtro",
      "Observaciones_ins_filtro",
      "Fecha_pro_filtro",
      "Hora_pro_filtro",
      "Programador_de_mantenimiento_filtro",
      "Resultado_pro_filtro",
      "Tiempo_ejecucion_Hrs_pro_filtro",
      "Observaciones_pro_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No_Reporte: "",
      N_Orden_de_Trabajo: "",
      No__de_Orden_de_Servicio: "",
      Descripcion_breve: "",
      Tipo_de_reporte_OS: "",
      Descripcion_del_componente: "",
      Numero_de_parte: "",
      Numero_de_serie: "",
      Fecha_requerida: "",
      Promedio_de_ejecucion: "",
      Prioridad_del_reporte: "",
      Tipo_de_orden_de_trabajo: "",
      Estatus: "",
      Matricula: "",
      Origen_del_reporte: "",
      Codigo_computarizado_Descripcion: "",
      Ciclos_restantes: "",
      Horas_restantes: "",
      N_boletin_directiva: "",
      Titulo_boletin_directiva: "",
      Tipo_de_reporte: "",
      Reporte_de_aeronave: "",
      N_de_bitacora: "",
      Codigo_ATA: "",
      IdDiscrepancia: "",
      Id_Inspeccion_de_Entrada: "",
      IdCotizacion: "",
      Fecha_de_Creacion_del_Reporte: null,
      Hora_de_Creacion_del_Reporte: "",
      Fecha_de_Asignacion: null,
      Hora_de_Asignacion: "",
      Notas: "",
      Tiempo_total_de_ejecucion: "",
      Fecha_resp: null,
      Hora_resp: "",
      Respondiente_resp: "",
      Ayuda_de_respuesta_resp: "",
      Respuesta_resp: "",
      Fecha_sup: null,
      Hora_sup: "",
      Supervisor: "",
      Resultado_sup: "",
      Tiempo_ejecucion_Hrs_sup: "",
      Observaciones_sup: "",
      Fecha_ins: null,
      Hora_ins: "",
      Inspector: "",
      Resultado_ins: "",
      Tiempo_ejecucion_Hrs_ins: "",
      Observaciones_ins: "",
      Fecha_pro: null,
      Hora_pro: "",
      Programador_de_mantenimiento: "",
      Resultado_pro: "",
      Tiempo_ejecucion_Hrs_pro: "",
      Observaciones_pro: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      N_Orden_de_TrabajoFilter: "",
      N_Orden_de_Trabajo: "",
      N_Orden_de_TrabajoMultiple: "",
      No__de_Orden_de_ServicioFilter: "",
      No__de_Orden_de_Servicio: "",
      No__de_Orden_de_ServicioMultiple: "",
      Tipo_de_reporte_OSFilter: "",
      Tipo_de_reporte_OS: "",
      Tipo_de_reporte_OSMultiple: "",
      fromPromedio_de_ejecucion: "",
      toPromedio_de_ejecucion: "",
      Prioridad_del_reporteFilter: "",
      Prioridad_del_reporte: "",
      Prioridad_del_reporteMultiple: "",
      Tipo_de_orden_de_trabajoFilter: "",
      Tipo_de_orden_de_trabajo: "",
      Tipo_de_orden_de_trabajoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      Origen_del_reporteFilter: "",
      Origen_del_reporte: "",
      Origen_del_reporteMultiple: "",
      Codigo_computarizado_DescripcionFilter: "",
      Codigo_computarizado_Descripcion: "",
      Codigo_computarizado_DescripcionMultiple: "",
      fromCiclos_restantes: "",
      toCiclos_restantes: "",
      fromHoras_restantes: "",
      toHoras_restantes: "",
      Tipo_de_reporteFilter: "",
      Tipo_de_reporte: "",
      Tipo_de_reporteMultiple: "",
      Codigo_ATAFilter: "",
      Codigo_ATA: "",
      Codigo_ATAMultiple: "",
      fromIdDiscrepancia: "",
      toIdDiscrepancia: "",
      fromId_Inspeccion_de_Entrada: "",
      toId_Inspeccion_de_Entrada: "",
      fromIdCotizacion: "",
      toIdCotizacion: "",
      fromFecha_de_Creacion_del_Reporte: "",
      toFecha_de_Creacion_del_Reporte: "",
      fromHora_de_Creacion_del_Reporte: "",
      toHora_de_Creacion_del_Reporte: "",
      fromFecha_de_Asignacion: "",
      toFecha_de_Asignacion: "",
      fromHora_de_Asignacion: "",
      toHora_de_Asignacion: "",
      fromTiempo_total_de_ejecucion: "",
      toTiempo_total_de_ejecucion: "",
      fromFecha_resp: "",
      toFecha_resp: "",
      fromHora_resp: "",
      toHora_resp: "",
      Respondiente_respFilter: "",
      Respondiente_resp: "",
      Respondiente_respMultiple: "",
      Ayuda_de_respuesta_respFilter: "",
      Ayuda_de_respuesta_resp: "",
      Ayuda_de_respuesta_respMultiple: "",
      fromFecha_sup: "",
      toFecha_sup: "",
      fromHora_sup: "",
      toHora_sup: "",
      SupervisorFilter: "",
      Supervisor: "",
      SupervisorMultiple: "",
      Resultado_supFilter: "",
      Resultado_sup: "",
      Resultado_supMultiple: "",
      fromTiempo_ejecucion_Hrs_sup: "",
      toTiempo_ejecucion_Hrs_sup: "",
      fromFecha_ins: "",
      toFecha_ins: "",
      fromHora_ins: "",
      toHora_ins: "",
      InspectorFilter: "",
      Inspector: "",
      InspectorMultiple: "",
      Resultado_insFilter: "",
      Resultado_ins: "",
      Resultado_insMultiple: "",
      fromTiempo_ejecucion_Hrs_ins: "",
      toTiempo_ejecucion_Hrs_ins: "",
      fromFecha_pro: "",
      toFecha_pro: "",
      fromHora_pro: "",
      toHora_pro: "",
      Programador_de_mantenimientoFilter: "",
      Programador_de_mantenimiento: "",
      Programador_de_mantenimientoMultiple: "",
      Resultado_proFilter: "",
      Resultado_pro: "",
      Resultado_proMultiple: "",
      fromTiempo_ejecucion_Hrs_pro: "",
      toTiempo_ejecucion_Hrs_pro: "",

    }
  };

  dataSource: Crear_ReporteDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Crear_ReporteDataSource;
  dataClipboard: any;
  phase: any;
  nombrePantalla: string = "Crear Reporte";

  constructor(
    private _Crear_ReporteService: Crear_ReporteService,
    public _dialog: MatDialog,
    private _messages: MessagesHelper,
    private _seguridad: SeguridadService,
    private _translate: TranslateService,
    public _file: SpartanFileService,
    public dialogo: MatDialog,
    private excelService: ExcelService,
    _user: SpartanUserService,
    private _SpartanService: SpartanService,
    private localStorageHelper: LocalStorageHelper,
    route: Router, renderer: Renderer2,
    private activateRoute: ActivatedRoute,
  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

    

  }

  async ngOnInit() {
    
    this.activateRoute.paramMap.subscribe(
      params => {
        this.phase = params.get('id');

        if(this.phase == 2) {
          this.nombrePantalla = "Reportes por Asignar";
        }
        if(this.phase == 3) {
          this.nombrePantalla = "Reportes por Ejecutar";
        }
        if(this.phase == 4) {
          this.nombrePantalla = "Reportes por Autorizar Supervisor";
        }
        if(this.phase == 5) {
          this.nombrePantalla = "Reportes por Autorizar Inspector";
        }
        if(this.phase == 6) {
          this.nombrePantalla = "Reportes por Autorizar Programador";
        }
        if(this.phase == 7) {
          this.nombrePantalla = "Reportes Cancelados";
        }
        if(this.phase == 8) {
          this.nombrePantalla = "Reportes Cerrados";
        }
        if(this.phase == 10) {
          this.nombrePantalla = "Reportes por Cotizar";
        }

        if (this.localStorageHelper.getItemFromLocalStorage("QueryParamLCR") != this.phase) {
          this.localStorageHelper.setItemToLocalStorage("QueryParamLCR", this.phase);
          this.ngOnInit();
        }

      });

    this.rulesBeforeCreationList();
    this.dataSource = new Crear_ReporteDataSource(this._Crear_ReporteService, this._file);
    this.init();

    this._seguridad.permisos(AppConstants.Permisos.Crear_Reporte).subscribe((response) => {
      this.permisos = response;
    });

  }

  ngAfterViewInit() {
    this.rulesAfterCreationList();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.listConfig.page = this.paginator.pageIndex;
          this.listConfig.size = this.paginator.pageSize;
          this.listConfig.sortField = this.sort.active;
          this.listConfig.sortDirecction = this.sort.direction;
          this.loadData();
        })
      ).subscribe();

    this.loadPaginatorTranslate();
  }

  ngAfterViewChecked() {
    this.rulesAfterViewChecked();
  }

  clearFilter() {
    this.listConfig.page = 0;
    this.listConfig.filter.Folio = "";
    this.listConfig.filter.No_Reporte = "";
    this.listConfig.filter.N_Orden_de_Trabajo = "";
    this.listConfig.filter.No__de_Orden_de_Servicio = "";
    this.listConfig.filter.Descripcion_breve = "";
    this.listConfig.filter.Tipo_de_reporte_OS = "";
    this.listConfig.filter.Descripcion_del_componente = "";
    this.listConfig.filter.Numero_de_parte = "";
    this.listConfig.filter.Numero_de_serie = "";
    this.listConfig.filter.Fecha_requerida = "";
    this.listConfig.filter.Promedio_de_ejecucion = "";
    this.listConfig.filter.Prioridad_del_reporte = "";
    this.listConfig.filter.Tipo_de_orden_de_trabajo = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Origen_del_reporte = "";
    this.listConfig.filter.Codigo_computarizado_Descripcion = "";
    this.listConfig.filter.Ciclos_restantes = "";
    this.listConfig.filter.Horas_restantes = "";
    this.listConfig.filter.N_boletin_directiva = "";
    this.listConfig.filter.Titulo_boletin_directiva = "";
    this.listConfig.filter.Tipo_de_reporte = "";
    this.listConfig.filter.Reporte_de_aeronave = "";
    this.listConfig.filter.N_de_bitacora = "";
    this.listConfig.filter.Codigo_ATA = "";
    this.listConfig.filter.IdDiscrepancia = "";
    this.listConfig.filter.Id_Inspeccion_de_Entrada = "";
    this.listConfig.filter.IdCotizacion = "";
    this.listConfig.filter.Fecha_de_Creacion_del_Reporte = undefined;
    this.listConfig.filter.Hora_de_Creacion_del_Reporte = "";
    this.listConfig.filter.Fecha_de_Asignacion = undefined;
    this.listConfig.filter.Hora_de_Asignacion = "";
    this.listConfig.filter.Notas = "";
    this.listConfig.filter.Tiempo_total_de_ejecucion = "";
    this.listConfig.filter.Fecha_resp = undefined;
    this.listConfig.filter.Hora_resp = "";
    this.listConfig.filter.Respondiente_resp = "";
    this.listConfig.filter.Ayuda_de_respuesta_resp = "";
    this.listConfig.filter.Respuesta_resp = "";
    this.listConfig.filter.Fecha_sup = undefined;
    this.listConfig.filter.Hora_sup = "";
    this.listConfig.filter.Supervisor = "";
    this.listConfig.filter.Resultado_sup = "";
    this.listConfig.filter.Tiempo_ejecucion_Hrs_sup = "";
    this.listConfig.filter.Observaciones_sup = "";
    this.listConfig.filter.Fecha_ins = undefined;
    this.listConfig.filter.Hora_ins = "";
    this.listConfig.filter.Inspector = "";
    this.listConfig.filter.Resultado_ins = "";
    this.listConfig.filter.Tiempo_ejecucion_Hrs_ins = "";
    this.listConfig.filter.Observaciones_ins = "";
    this.listConfig.filter.Fecha_pro = undefined;
    this.listConfig.filter.Hora_pro = "";
    this.listConfig.filter.Programador_de_mantenimiento = "";
    this.listConfig.filter.Resultado_pro = "";
    this.listConfig.filter.Tiempo_ejecucion_Hrs_pro = "";
    this.listConfig.filter.Observaciones_pro = "";

    this.listConfig.page = 0;
    this.loadData();
  }

  refresh() {
    this.listConfig.page = 0;
    this.loadData();
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  applyRules() { }

  rulesAfterCreationList() {
    //rulesAfterCreationList_ExecuteBusinessRulesInit
    //rulesAfterCreationList_ExecuteBusinessRulesEnd
  }

  async rulesBeforeCreationList() {
    //rulesBeforeCreationList_ExecuteBusinessRulesInit

    //INICIA - BRID:7020 - WF:5 Rule List - Phase: 2 (Reportes por Asignar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '2') { this.brf.SetFilteronList(this.listConfig, " Crear_Reporte.Estatus = 5 "); }
    //TERMINA - BRID:7020

    //INICIA - BRID:7022 - WF:5 Rule List - Phase: 3 (Reportes por Ejecutar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '3') {
      this.brf.SetFilteronList(this.listConfig, ` Crear_reporte.Folio IN (SELECT FolioReporte FROM dbo.fncGetTecnicoAsignadoReporte(${this.localStorageHelper.getItemFromLocalStorage('USERID')})) Or ( Crear_reporte.Estatus = 1 AND Crear_reporte.Folio IN (Select case when ${this.localStorageHelper.getItemFromLocalStorage('USERROLEID')} IN (17,19,25,43) THEN Folio ELSE 0 END From Crear_Reporte)) Or ( Crear_reporte.Estatus = 1 AND Crear_reporte.Folio IN( Select Reporte from Detalle_de_reportes_por_componentes Where Asignado_a = ${this.localStorageHelper.getItemFromLocalStorage('USERID')} OR Asignado_a_1 = ${this.localStorageHelper.getItemFromLocalStorage('USERID')} OR Asignado_a_2 = ${this.localStorageHelper.getItemFromLocalStorage('USERID')} OR Asignado_a_3 = ${this.localStorageHelper.getItemFromLocalStorage('USERID')} OR Asignado_a_4 = ${this.localStorageHelper.getItemFromLocalStorage('USERID')})  ) Or ( Crear_reporte.Estatus = 1 AND Crear_reporte.Folio IN( Select Reporte from Detalle_de_reportes_por_aeronave Where Asignado_a = ${this.localStorageHelper.getItemFromLocalStorage('USERID')} OR Asignado_a_1 = ${this.localStorageHelper.getItemFromLocalStorage('USERID')} OR Asignado_a_2 = ${this.localStorageHelper.getItemFromLocalStorage('USERID')} OR Asignado_a_3 = ${this.localStorageHelper.getItemFromLocalStorage('USERID')} OR Asignado_a_4 = ${this.localStorageHelper.getItemFromLocalStorage('USERID')})) `);
    }
    //TERMINA - BRID:7022

    //INICIA - BRID:7024 - WF:5 Rule List - Phase: 4 (Reportes por Autorizar Supervisor) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '4') { this.brf.SetFilteronList(this.listConfig, " Crear_Reporte.Estatus = 2 "); }
    //TERMINA - BRID:7024

    //INICIA - BRID:7026 - WF:5 Rule List - Phase: 5 (Reportes por Autorizar Inspector) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '5') { this.brf.SetFilteronList(this.listConfig, " Crear_Reporte.Estatus = 3 "); }
    //TERMINA - BRID:7026

    //INICIA - BRID:7028 - WF:5 Rule List - Phase: 6 (Reportes por Autorizar Programador) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '6') { this.brf.SetFilteronList(this.listConfig, " Crear_Reporte.Estatus = 4 "); }
    //TERMINA - BRID:7028

    //INICIA - BRID:7030 - WF:5 Rule List - Phase: 7 (Reportes Cancelados) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '7') { this.brf.SetFilteronList(this.listConfig, " Crear_Reporte.Estatus = 8 "); }
    //TERMINA - BRID:7030

    //INICIA - BRID:7032 - WF:5 Rule List - Phase: 8 (Reportes Cerrados) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '8') { this.brf.SetFilteronList(this.listConfig, " Crear_Reporte.Estatus = 6 "); }
    //TERMINA - BRID:7032

    //INICIA - BRID:7034 - WF:5 Rule List - Phase: 9 (Reportes (Paro/Cambio turno)) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '9') { this.brf.SetFilteronList(this.listConfig, " Crear_Reporte.Estatus = 7 "); }
    //TERMINA - BRID:7034

    //INICIA - BRID:7036 - WF:5 Rule List - Phase: 10 (Reportes por Cotizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '10') { this.brf.SetFilteronList(this.listConfig, " Crear_Reporte.Estatus = 9 "); }
    //TERMINA - BRID:7036

    //INICIA - BRID:7038 - WF:5 Rule List - Phase: 11 (Reportes de Inspección de Entrada) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '11') { this.brf.SetFilteronList(this.listConfig, " Crear_reporte.Estatus = 1 AND Crear_Reporte.Tipo_de_reporte = 7 "); }
    //TERMINA - BRID:7038

    //INICIA - BRID:7040 - WF:5 Rule List - Phase: 12 ( Reportes de Inspección de Salida) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == '12') { this.brf.SetFilteronList(this.listConfig, " Crear_reporte.Estatus = 1 AND Crear_Reporte.Tipo_de_reporte = 8 "); }
    //TERMINA - BRID:7040

    //rulesBeforeCreationList_ExecuteBusinessRulesEnd

  }

  //Fin de reglas



  loadPaginatorTranslate() {

    this._translate.get("general").subscribe(() => {
      this.paginator._intl.itemsPerPageLabel = this._translate.instant("general.items_per_page");
      this.paginator._intl.nextPageLabel = this._translate.instant("general.next_page");
      this.paginator._intl.previousPageLabel = this._translate.instant("general.previus_page");
      this.paginator._intl.firstPageLabel = this._translate.instant("general.first_page");
      this.paginator._intl.lastPageLabel = this._translate.instant("general.last_page");

    })

  }

  init() {
    const initConfig = history.state.data;

    if (initConfig) {
      this.listConfig = initConfig;
    }

    if (this.listConfig.advancedSearch === true) {
      this.loadDataAdvanced();
    } else {
      this.loadData();
    }
  }

  public loadData() {
    this.dataSource.load(this.listConfig);
  }

  public loadDataAdvanced() {
    this.dataSource.loadAdvanced(this.listConfig);
  }

  remove(row: Crear_Reporte) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Crear_ReporteService
          .delete(+row.Folio)
          .pipe(
            catchError(() => of([])),
            finalize(() => this.dataSource.loadingSubject.next(false))
          )
          .subscribe((result: any) => {
            this._messages.success("Registro eliminado correctamente");
            this.loadData();
          });
      });
  }

  /**
   * Imprimir
   * @param dataRow : Información de Formato
   */
  ActionPrint(dataRow: Crear_Reporte) {

    this.dialogo
      .open(DialogPrintFormatComponent, {
        data: dataRow
      })
      .afterClosed()
      .subscribe((optionSelected: boolean) => {
        if (optionSelected) {
          alert('Pendiente de implementar.');
        }
      });

  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  Editor_HTML(title: string, info: string) {
    const data = {
      titleDialog: title,
      infoDialog: info
    }
    this._dialog.open(HtmlEditorDialogComponent, { data });
  }

  /** Construir tabla con datos a exportar (PDF)
     * @param data : Contenedor de datos
     */

  SetTableExportPdf(data: any) {
    let new_data = [];
    let header = [
      'Folio'
      , 'No. Reporte'
      , 'N° Orden de Trabajo'
      , 'No. de Orden de Servicio'
      , 'Descripción breve  '
      , 'Tipo de reporte OS'
      , 'Descripción del componente'
      , 'Numero de parte'
      , 'Número de serie'
      , 'Tiempo límite ejecución'
      , 'Promedio de ejecución'
      , 'Prioridad del reporte'
      , 'Tipo de orden de trabajo'
      , 'Estatus'
      , 'Matrícula'
      , 'Origen del reporte'
      , 'Código computarizado/Descripción'
      , 'Ciclos restantes'
      , 'Horas restantes'
      , 'N° boletín/directiva'
      , 'Título boletín/directiva'
      , 'Tipo de reporte'
      , 'Reporte de aeronave'
      , 'N° de bitácora'
      , 'Código ATA'
      , 'IdDiscrepancia'
      , 'Inspección de Entrada'
      , 'IdCotización'
      , 'Fecha de Creación del Reporte'
      , 'Hora de Creación del Reporte'
      , 'Fecha de Asignación'
      , 'Hora de Asignación'
      , 'Notas'
      , 'Tiempo total de ejecución'
      , 'Fecha'
      , 'Hora'
      , 'Responsable'
      , 'Ayuda de respuesta'
      , 'Respuesta'
      , 'Supervisor'
      , 'Resultado'
      , 'Tiempo de ejecución en Hrs'
      , 'Observaciones'
      , 'Inspector'
      , 'Programador de mantenimiento'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.No_Reporte
        , x.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden
        , x.No__de_Orden_de_Servicio_Orden_de_servicio.Folio_OS
        , x.Descripcion_breve
        , x.Tipo_de_reporte_OS_Tipo_orden_de_servicio.Descripcion
        , x.Descripcion_del_componente
        , x.Numero_de_parte
        , x.Numero_de_serie
        , x.Fecha_requerida
        , x.Promedio_de_ejecucion
        , x.Prioridad_del_reporte_Prioridad_del_Reporte.Descripcion
        , x.Tipo_de_orden_de_trabajo_Tipo_de_Orden_de_Trabajo.Descripcion
        , x.Estatus_Estatus_de_Reporte.Descripcion
        , x.Matricula_Aeronave.Matricula
        , x.Origen_del_reporte_Tipo_de_origen_del_reporte.Descripcion
        , x.Codigo_computarizado_Descripcion_Codigo_Computarizado.Descripcion_Busqueda
        , x.Ciclos_restantes
        , x.Horas_restantes
        , x.N_boletin_directiva
        , x.Titulo_boletin_directiva
        , x.Tipo_de_reporte_Tipo_de_Reporte.Descripcion
        , x.Reporte_de_aeronave
        , x.N_de_bitacora
        , x.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion
        , x.IdDiscrepancia
        , x.Id_Inspeccion_de_Entrada
        , x.IdCotizacion
        , x.Fecha_de_Creacion_del_Reporte
        , x.Hora_de_Creacion_del_Reporte
        , x.Fecha_de_Asignacion
        , x.Hora_de_Asignacion
        , x.Notas
        , x.Tiempo_total_de_ejecucion
        , x.Fecha_resp
        , x.Hora_resp
        , x.Respondiente_resp_Spartan_User.Name
        , x.Ayuda_de_respuesta_resp_Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda
        , x.Respuesta_resp
        , x.Fecha_sup
        , x.Hora_sup
        , x.Supervisor_Spartan_User.Name
        , x.Resultado_sup_Resultado_aprobacion_crear_reporte.Autorizacion
        , x.Tiempo_ejecucion_Hrs_sup
        , x.Observaciones_sup
        , x.Fecha_ins
        , x.Hora_ins
        , x.Inspector_Spartan_User.Name
        , x.Resultado_ins_Resultado_aprobacion_crear_reporte.Autorizacion
        , x.Tiempo_ejecucion_Hrs_ins
        , x.Observaciones_ins
        , x.Fecha_pro
        , x.Hora_pro
        , x.Programador_de_mantenimiento_Spartan_User.Name
        , x.Resultado_pro_Resultado_aprobacion_crear_reporte.Autorizacion
        , x.Tiempo_ejecucion_Hrs_pro
        , x.Observaciones_pro

      ]
      new_data.push(new_content);
    });


    const pdfDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        {
          table: {
            // widths:['*',200,'auto'],
            body: new_data
          }
        }
      ]
    }
    pdfMake.createPdf(pdfDefinition).download('Crear_Reporte.pdf');
  }


  /**
   * Exportar información
   * @param exportType : Tipo de exportación (MEM|XLS|CSV|PDF|PTR)
   */
  ActionExport(exportType: number) {

    let title: string = "";
    let buttonLabel: string = "";
    switch (exportType) {
      case 1:
        title = "Copiar";
        buttonLabel = "Copiar";
        break;
      case 2: title = "Exportar Excel"; buttonLabel = "Exportar"; break;
      case 3: title = "Exportar CSV"; buttonLabel = "Exportar"; break;
      case 4: title = "Exportar PDF"; buttonLabel = "Exportar"; break;
      case 5: title = "Imprimir"; buttonLabel = "Imprimir"; break;
    }


    this.dialogo
      .open(DialogConfirmExportComponent, {
        data: {
          mensaje: `Seleccione una opción`,
          titulo: title,
          buttonLabel: buttonLabel
        },

      })
      .afterClosed()
      .subscribe((optionSelected: string) => {

        if (optionSelected == '1') {
          let condition = this.dataSource.SetWhereClause(this.listConfig);
          let sort = this.dataSource.SetOrderClause(this.listConfig);
          let page = this.listConfig.page + 1;
          let starRowIndex = page * this.listConfig.size - this.listConfig.size + 1;
          let maximumRows = page * this.listConfig.size;
          this._Crear_ReporteService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Crear_Reportes;
              const dataToRender = this.SetTableExport(this.dataSourceTemp);

              switch (exportType) {
                case Enumerations.Enums.ExportType.MEM:
                  {
                    const selBox = document.createElement('textarea');
                    selBox.style.position = 'fixed';
                    selBox.style.left = '0';
                    selBox.style.top = '0';
                    selBox.style.opacity = '0';
                    selBox.value = this.SetTableExportToClipboard(this.dataSourceTemp);
                    document.body.appendChild(selBox);
                    selBox.focus();
                    selBox.select();
                    document.execCommand('copy');
                    document.body.removeChild(selBox);
                    break;
                  }
                case Enumerations.Enums.ExportType.XLS:
                  {
                    this.ExportToExcel(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.CSV:
                  {
                    this.ExportToCSV(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.PDF:
                  {
                    this.SetTableExportPdf(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.PTR:
                  {
                    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
                    WindowPrt.document.write(dataToRender);
                    WindowPrt.document.close();
                    WindowPrt.focus();
                    WindowPrt.print();
                    WindowPrt.close();
                    break;
                  }
              }
            }, error => {

            });
        } else if (optionSelected == '2') {
          this._Crear_ReporteService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Crear_Reportes;
              const dataToRender = this.SetTableExport(this.dataSourceTemp);

              switch (exportType) {
                case Enumerations.Enums.ExportType.MEM:
                  {
                    const selBox = document.createElement('textarea');
                    selBox.style.position = 'fixed';
                    selBox.style.left = '0';
                    selBox.style.top = '0';
                    selBox.style.opacity = '0';
                    selBox.value = this.SetTableExportToClipboard(this.dataSourceTemp);
                    document.body.appendChild(selBox);
                    selBox.focus();
                    selBox.select();
                    document.execCommand('copy');
                    document.body.removeChild(selBox);
                    break;
                  }
                case Enumerations.Enums.ExportType.XLS:
                  {
                    this.ExportToExcel(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.CSV:
                  {
                    this.ExportToCSV(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.PDF:
                  {
                    this.SetTableExportPdf(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.PTR:
                  {
                    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
                    WindowPrt.document.write(dataToRender);
                    WindowPrt.document.close();
                    WindowPrt.focus();
                    WindowPrt.print();
                    WindowPrt.close();
                    break;
                  }
              }
            }, error => {

            });

        }
      });

  }

  /**
   * Exportar a Excel
   * @param data : Data a exportar
   */
  ExportToExcel(data: any) {
    const that = this;
    const excelData = _.map(data, function (fields) {
      return {
        'Folio ': fields.Folio,
        'No. Reporte ': fields.No_Reporte,
        'N° Orden de Trabajo ': fields.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
        'No. de Orden de Servicio ': fields.No__de_Orden_de_Servicio_Orden_de_servicio.Folio_OS,
        'Descripción breve   ': fields.Descripcion_breve,
        'Tipo de reporte OS ': fields.Tipo_de_reporte_OS_Tipo_orden_de_servicio.Descripcion,
        'Descripción del componente ': fields.Descripcion_del_componente,
        'Numero de parte ': fields.Numero_de_parte,
        'Número de serie ': fields.Numero_de_serie,
        'Tiempo límite ejecución ': fields.Fecha_requerida,
        'Promedio de ejecución ': fields.Promedio_de_ejecucion,
        'Prioridad del reporte ': fields.Prioridad_del_reporte_Prioridad_del_Reporte.Descripcion,
        'Tipo de orden de trabajo ': fields.Tipo_de_orden_de_trabajo_Tipo_de_Orden_de_Trabajo.Descripcion,
        'Estatus ': fields.Estatus_Estatus_de_Reporte.Descripcion,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Origen del reporte ': fields.Origen_del_reporte_Tipo_de_origen_del_reporte.Descripcion,
        'Código computarizado/Descripción ': fields.Codigo_computarizado_Descripcion_Codigo_Computarizado.Descripcion_Busqueda,
        'Ciclos restantes ': fields.Ciclos_restantes,
        'Horas restantes ': fields.Horas_restantes,
        'N° boletín/directiva ': fields.N_boletin_directiva,
        'Título boletín/directiva ': fields.Titulo_boletin_directiva,
        'Tipo de reporte ': fields.Tipo_de_reporte_Tipo_de_Reporte.Descripcion,
        'Reporte de aeronave ': fields.Reporte_de_aeronave,
        'N° de bitácora ': fields.N_de_bitacora,
        'Código ATA ': fields.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
        'IdDiscrepancia ': fields.IdDiscrepancia,
        'Inspección de Entrada ': fields.Id_Inspeccion_de_Entrada,
        'IdCotización ': fields.IdCotizacion,
        'Fecha de Creación del Reporte ': fields.Fecha_de_Creacion_del_Reporte ? momentJS(fields.Fecha_de_Creacion_del_Reporte).format('DD/MM/YYYY') : '',
        'Hora de Creación del Reporte ': fields.Hora_de_Creacion_del_Reporte,
        'Fecha de Asignación ': fields.Fecha_de_Asignacion ? momentJS(fields.Fecha_de_Asignacion).format('DD/MM/YYYY') : '',
        'Hora de Asignación ': fields.Hora_de_Asignacion,
        'Notas ': fields.Notas,
        'Tiempo total de ejecución ': fields.Tiempo_total_de_ejecucion,
        'Fecha ': fields.Fecha_resp ? momentJS(fields.Fecha_resp).format('DD/MM/YYYY') : '',
        'Hora ': fields.Hora_resp,
        'Responsable ': fields.Respondiente_resp_Spartan_User.Name,
        'Ayuda de respuesta ': fields.Ayuda_de_respuesta_resp_Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda,
        'Respuesta ': fields.Respuesta_resp,
        'Fecha sup ': fields.Fecha_sup ? momentJS(fields.Fecha_sup).format('DD/MM/YYYY') : '',
        'Hora sup ': fields.Hora_sup,
        'Supervisor 1': fields.Supervisor_Spartan_User.Name,
        'Resultado ': fields.Resultado_sup_Resultado_aprobacion_crear_reporte.Autorizacion,
        'Tiempo de ejecución en Hrs sup ': fields.Tiempo_ejecucion_Hrs_sup,
        'Observaciones ': fields.Observaciones_sup,
        'Fecha_ins ': fields.Fecha_ins ? momentJS(fields.Fecha_ins).format('DD/MM/YYYY') : '',
        'Hora_ins ': fields.Hora_ins,
        'Inspector 2': fields.Inspector_Spartan_User.Name,
        'Resultado 1': fields.Resultado_ins_Resultado_aprobacion_crear_reporte.Autorizacion,
        'Tiempo de ejecución en Hrs ins ': fields.Tiempo_ejecucion_Hrs_ins,
        'Observaciones ins': fields.Observaciones_ins,
        'Fecha pro': fields.Fecha_pro ? momentJS(fields.Fecha_pro).format('DD/MM/YYYY') : '',
        'Hora pro': fields.Hora_pro,
        'Programador de mantenimiento 3': fields.Programador_de_mantenimiento_Spartan_User.Name,
        'Resultado 2': fields.Resultado_pro_Resultado_aprobacion_crear_reporte.Autorizacion,
        'Tiempo de ejecución en Hrs ': fields.Tiempo_ejecucion_Hrs_pro,
        'Observaciones pro': fields.Observaciones_pro,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Crear_Reporte  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No_Reporte: x.No_Reporte,
      N_Orden_de_Trabajo: x.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
      No__de_Orden_de_Servicio: x.No__de_Orden_de_Servicio_Orden_de_servicio.Folio_OS,
      Descripcion_breve: x.Descripcion_breve,
      Tipo_de_reporte_OS: x.Tipo_de_reporte_OS_Tipo_orden_de_servicio.Descripcion,
      Descripcion_del_componente: x.Descripcion_del_componente,
      Numero_de_parte: x.Numero_de_parte,
      Numero_de_serie: x.Numero_de_serie,
      Fecha_requerida: x.Fecha_requerida,
      Promedio_de_ejecucion: x.Promedio_de_ejecucion,
      Prioridad_del_reporte: x.Prioridad_del_reporte_Prioridad_del_Reporte.Descripcion,
      Tipo_de_orden_de_trabajo: x.Tipo_de_orden_de_trabajo_Tipo_de_Orden_de_Trabajo.Descripcion,
      Estatus: x.Estatus_Estatus_de_Reporte.Descripcion,
      Matricula: x.Matricula_Aeronave.Matricula,
      Origen_del_reporte: x.Origen_del_reporte_Tipo_de_origen_del_reporte.Descripcion,
      Codigo_computarizado_Descripcion: x.Codigo_computarizado_Descripcion_Codigo_Computarizado.Descripcion_Busqueda,
      Ciclos_restantes: x.Ciclos_restantes,
      Horas_restantes: x.Horas_restantes,
      N_boletin_directiva: x.N_boletin_directiva,
      Titulo_boletin_directiva: x.Titulo_boletin_directiva,
      Tipo_de_reporte: x.Tipo_de_reporte_Tipo_de_Reporte.Descripcion,
      Reporte_de_aeronave: x.Reporte_de_aeronave,
      N_de_bitacora: x.N_de_bitacora,
      Codigo_ATA: x.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
      IdDiscrepancia: x.IdDiscrepancia,
      Id_Inspeccion_de_Entrada: x.Id_Inspeccion_de_Entrada,
      IdCotizacion: x.IdCotizacion,
      Fecha_de_Creacion_del_Reporte: x.Fecha_de_Creacion_del_Reporte,
      Hora_de_Creacion_del_Reporte: x.Hora_de_Creacion_del_Reporte,
      Fecha_de_Asignacion: x.Fecha_de_Asignacion,
      Hora_de_Asignacion: x.Hora_de_Asignacion,
      Notas: x.Notas,
      Tiempo_total_de_ejecucion: x.Tiempo_total_de_ejecucion,
      Fecha_resp: x.Fecha_resp,
      Hora_resp: x.Hora_resp,
      Respondiente_resp: x.Respondiente_resp_Spartan_User.Name,
      Ayuda_de_respuesta_resp: x.Ayuda_de_respuesta_resp_Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda,
      Respuesta_resp: x.Respuesta_resp,
      Fecha_sup: x.Fecha_sup,
      Hora_sup: x.Hora_sup,
      Supervisor: x.Supervisor_Spartan_User.Name,
      Resultado_sup: x.Resultado_sup_Resultado_aprobacion_crear_reporte.Autorizacion,
      Tiempo_ejecucion_Hrs_sup: x.Tiempo_ejecucion_Hrs_sup,
      Observaciones_sup: x.Observaciones_sup,
      Fecha_ins: x.Fecha_ins,
      Hora_ins: x.Hora_ins,
      Inspector: x.Inspector_Spartan_User.Name,
      Resultado_ins: x.Resultado_ins_Resultado_aprobacion_crear_reporte.Autorizacion,
      Tiempo_ejecucion_Hrs_ins: x.Tiempo_ejecucion_Hrs_ins,
      Observaciones_ins: x.Observaciones_ins,
      Fecha_pro: x.Fecha_pro,
      Hora_pro: x.Hora_pro,
      Programador_de_mantenimiento: x.Programador_de_mantenimiento_Spartan_User.Name,
      Resultado_pro: x.Resultado_pro_Resultado_aprobacion_crear_reporte.Autorizacion,
      Tiempo_ejecucion_Hrs_pro: x.Tiempo_ejecucion_Hrs_pro,
      Observaciones_pro: x.Observaciones_pro,

    }));

    this.excelService.exportToCsv(result, 'Crear_Reporte', ['Folio', 'No_Reporte', 'N_Orden_de_Trabajo', 'No__de_Orden_de_Servicio', 'Descripcion_breve', 'Tipo_de_reporte_OS', 'Descripcion_del_componente', 'Numero_de_parte', 'Numero_de_serie', 'Fecha_requerida', 'Promedio_de_ejecucion', 'Prioridad_del_reporte', 'Tipo_de_orden_de_trabajo', 'Estatus', 'Matricula', 'Origen_del_reporte', 'Codigo_computarizado_Descripcion', 'Ciclos_restantes', 'Horas_restantes', 'N_boletin_directiva', 'Titulo_boletin_directiva', 'Tipo_de_reporte', 'Reporte_de_aeronave', 'N_de_bitacora', 'Codigo_ATA', 'IdDiscrepancia', 'Id_Inspeccion_de_Entrada', 'IdCotizacion', 'Fecha_de_Creacion_del_Reporte', 'Hora_de_Creacion_del_Reporte', 'Fecha_de_Asignacion', 'Hora_de_Asignacion', 'Notas', 'Tiempo_total_de_ejecucion', 'Fecha_resp', 'Hora_resp', 'Respondiente_resp', 'Ayuda_de_respuesta_resp', 'Respuesta_resp', 'Fecha_sup', 'Hora_sup', 'Supervisor', 'Resultado_sup', 'Tiempo_ejecucion_Hrs_sup', 'Observaciones_sup', 'Fecha_ins', 'Hora_ins', 'Inspector', 'Resultado_ins', 'Tiempo_ejecucion_Hrs_ins', 'Observaciones_ins', 'Fecha_pro', 'Hora_pro', 'Programador_de_mantenimiento', 'Resultado_pro', 'Tiempo_ejecucion_Hrs_pro', 'Observaciones_pro']);
  }

  /**
   * Construir tabla con datos a exportar (XLS | CSV | PDF | PTR)
   * @param data : Contenedor de datos
   */
  SetTableExport(data: any): string {

    let template: string;

    template = '<table id="xxx" boder="1">';
    template += '  <thead>';
    template += '      <tr>';
    template += '          <th>Folio</th>';
    template += '          <th>No. Reporte</th>';
    template += '          <th>N° Orden de Trabajo</th>';
    template += '          <th>No. de Orden de Servicio</th>';
    template += '          <th>Descripción breve  </th>';
    template += '          <th>Tipo de reporte OS</th>';
    template += '          <th>Descripción del componente</th>';
    template += '          <th>Numero de parte</th>';
    template += '          <th>Número de serie</th>';
    template += '          <th>Tiempo límite ejecución</th>';
    template += '          <th>Promedio de ejecución</th>';
    template += '          <th>Prioridad del reporte</th>';
    template += '          <th>Tipo de orden de trabajo</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Origen del reporte</th>';
    template += '          <th>Código computarizado/Descripción</th>';
    template += '          <th>Ciclos restantes</th>';
    template += '          <th>Horas restantes</th>';
    template += '          <th>N° boletín/directiva</th>';
    template += '          <th>Título boletín/directiva</th>';
    template += '          <th>Tipo de reporte</th>';
    template += '          <th>Reporte de aeronave</th>';
    template += '          <th>N° de bitácora</th>';
    template += '          <th>Código ATA</th>';
    template += '          <th>IdDiscrepancia</th>';
    template += '          <th>Inspección de Entrada</th>';
    template += '          <th>IdCotización</th>';
    template += '          <th>Fecha de Creación del Reporte</th>';
    template += '          <th>Hora de Creación del Reporte</th>';
    template += '          <th>Fecha de Asignación</th>';
    template += '          <th>Hora de Asignación</th>';
    template += '          <th>Notas</th>';
    template += '          <th>Tiempo total de ejecución</th>';
    template += '          <th>Fecha</th>';
    template += '          <th>Hora</th>';
    template += '          <th>Responsable</th>';
    template += '          <th>Ayuda de respuesta</th>';
    template += '          <th>Respuesta</th>';
    template += '          <th>Supervisor</th>';
    template += '          <th>Resultado</th>';
    template += '          <th>Tiempo de ejecución en Hrs</th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>Inspector</th>';
    template += '          <th>Programador de mantenimiento</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No_Reporte + '</td>';
      template += '          <td>' + element.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.No__de_Orden_de_Servicio_Orden_de_servicio.Folio_OS + '</td>';
      template += '          <td>' + element.Descripcion_breve + '</td>';
      template += '          <td>' + element.Tipo_de_reporte_OS_Tipo_orden_de_servicio.Descripcion + '</td>';
      template += '          <td>' + element.Descripcion_del_componente + '</td>';
      template += '          <td>' + element.Numero_de_parte + '</td>';
      template += '          <td>' + element.Numero_de_serie + '</td>';
      template += '          <td>' + element.Fecha_requerida + '</td>';
      template += '          <td>' + element.Promedio_de_ejecucion + '</td>';
      template += '          <td>' + element.Prioridad_del_reporte_Prioridad_del_Reporte.Descripcion + '</td>';
      template += '          <td>' + element.Tipo_de_orden_de_trabajo_Tipo_de_Orden_de_Trabajo.Descripcion + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Reporte.Descripcion + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Origen_del_reporte_Tipo_de_origen_del_reporte.Descripcion + '</td>';
      template += '          <td>' + element.Codigo_computarizado_Descripcion_Codigo_Computarizado.Descripcion_Busqueda + '</td>';
      template += '          <td>' + element.Ciclos_restantes + '</td>';
      template += '          <td>' + element.Horas_restantes + '</td>';
      template += '          <td>' + element.N_boletin_directiva + '</td>';
      template += '          <td>' + element.Titulo_boletin_directiva + '</td>';
      template += '          <td>' + element.Tipo_de_reporte_Tipo_de_Reporte.Descripcion + '</td>';
      template += '          <td>' + element.Reporte_de_aeronave + '</td>';
      template += '          <td>' + element.N_de_bitacora + '</td>';
      template += '          <td>' + element.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion + '</td>';
      template += '          <td>' + element.IdDiscrepancia + '</td>';
      template += '          <td>' + element.Id_Inspeccion_de_Entrada + '</td>';
      template += '          <td>' + element.IdCotizacion + '</td>';
      template += '          <td>' + element.Fecha_de_Creacion_del_Reporte + '</td>';
      template += '          <td>' + element.Hora_de_Creacion_del_Reporte + '</td>';
      template += '          <td>' + element.Fecha_de_Asignacion + '</td>';
      template += '          <td>' + element.Hora_de_Asignacion + '</td>';
      template += '          <td>' + element.Notas + '</td>';
      template += '          <td>' + element.Tiempo_total_de_ejecucion + '</td>';
      template += '          <td>' + element.Fecha_resp + '</td>';
      template += '          <td>' + element.Hora_resp + '</td>';
      template += '          <td>' + element.Respondiente_resp_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Ayuda_de_respuesta_resp_Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda + '</td>';
      template += '          <td>' + element.Respuesta_resp + '</td>';
      template += '          <td>' + element.Fecha_sup + '</td>';
      template += '          <td>' + element.Hora_sup + '</td>';
      template += '          <td>' + element.Supervisor_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_sup_Resultado_aprobacion_crear_reporte.Autorizacion + '</td>';
      template += '          <td>' + element.Tiempo_ejecucion_Hrs_sup + '</td>';
      template += '          <td>' + element.Observaciones_sup + '</td>';
      template += '          <td>' + element.Fecha_ins + '</td>';
      template += '          <td>' + element.Hora_ins + '</td>';
      template += '          <td>' + element.Inspector_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_ins_Resultado_aprobacion_crear_reporte.Autorizacion + '</td>';
      template += '          <td>' + element.Tiempo_ejecucion_Hrs_ins + '</td>';
      template += '          <td>' + element.Observaciones_ins + '</td>';
      template += '          <td>' + element.Fecha_pro + '</td>';
      template += '          <td>' + element.Hora_pro + '</td>';
      template += '          <td>' + element.Programador_de_mantenimiento_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_pro_Resultado_aprobacion_crear_reporte.Autorizacion + '</td>';
      template += '          <td>' + element.Tiempo_ejecucion_Hrs_pro + '</td>';
      template += '          <td>' + element.Observaciones_pro + '</td>';

      template += '      </tr>';
    });

    template += '  </tbody>';
    template += '</table>';

    return template;
  }

  /**
   * Construir tabla con datos a exportar (Portapapeles)
   * @param data : Contenedor de datos
   */
  SetTableExportToClipboard(data: any): string {
    let template: string;
    template = '';
    template += '\t Folio';
    template += '\t No. Reporte';
    template += '\t N° Orden de Trabajo';
    template += '\t No. de Orden de Servicio';
    template += '\t Descripción breve  ';
    template += '\t Tipo de reporte OS';
    template += '\t Descripción del componente';
    template += '\t Numero de parte';
    template += '\t Número de serie';
    template += '\t Tiempo límite ejecución';
    template += '\t Promedio de ejecución';
    template += '\t Prioridad del reporte';
    template += '\t Tipo de orden de trabajo';
    template += '\t Estatus';
    template += '\t Matrícula';
    template += '\t Origen del reporte';
    template += '\t Código computarizado/Descripción';
    template += '\t Ciclos restantes';
    template += '\t Horas restantes';
    template += '\t N° boletín/directiva';
    template += '\t Título boletín/directiva';
    template += '\t Tipo de reporte';
    template += '\t Reporte de aeronave';
    template += '\t N° de bitácora';
    template += '\t Código ATA';
    template += '\t IdDiscrepancia';
    template += '\t Inspección de Entrada';
    template += '\t IdCotización';
    template += '\t Fecha de Creación del Reporte';
    template += '\t Hora de Creación del Reporte';
    template += '\t Fecha de Asignación';
    template += '\t Hora de Asignación';
    template += '\t Notas';
    template += '\t Tiempo total de ejecución';
    template += '\t Fecha';
    template += '\t Hora';
    template += '\t Responsable';
    template += '\t Ayuda de respuesta';
    template += '\t Respuesta';
    template += '\t Supervisor';
    template += '\t Resultado';
    template += '\t Tiempo de ejecución en Hrs';
    template += '\t Observaciones';
    template += '\t Inspector';
    template += '\t Programador de mantenimiento';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.No_Reporte;
      template += '\t ' + element.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden;
      template += '\t ' + element.No__de_Orden_de_Servicio_Orden_de_servicio.Folio_OS;
      template += '\t ' + element.Descripcion_breve;
      template += '\t ' + element.Tipo_de_reporte_OS_Tipo_orden_de_servicio.Descripcion;
      template += '\t ' + element.Descripcion_del_componente;
      template += '\t ' + element.Numero_de_parte;
      template += '\t ' + element.Numero_de_serie;
      template += '\t ' + element.Fecha_requerida;
      template += '\t ' + element.Promedio_de_ejecucion;
      template += '\t ' + element.Prioridad_del_reporte_Prioridad_del_Reporte.Descripcion;
      template += '\t ' + element.Tipo_de_orden_de_trabajo_Tipo_de_Orden_de_Trabajo.Descripcion;
      template += '\t ' + element.Estatus_Estatus_de_Reporte.Descripcion;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Origen_del_reporte_Tipo_de_origen_del_reporte.Descripcion;
      template += '\t ' + element.Codigo_computarizado_Descripcion_Codigo_Computarizado.Descripcion_Busqueda;
      template += '\t ' + element.Ciclos_restantes;
      template += '\t ' + element.Horas_restantes;
      template += '\t ' + element.N_boletin_directiva;
      template += '\t ' + element.Titulo_boletin_directiva;
      template += '\t ' + element.Tipo_de_reporte_Tipo_de_Reporte.Descripcion;
      template += '\t ' + element.Reporte_de_aeronave;
      template += '\t ' + element.N_de_bitacora;
      template += '\t ' + element.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion;
      template += '\t ' + element.IdDiscrepancia;
      template += '\t ' + element.Id_Inspeccion_de_Entrada;
      template += '\t ' + element.IdCotizacion;
      template += '\t ' + element.Fecha_de_Creacion_del_Reporte;
      template += '\t ' + element.Hora_de_Creacion_del_Reporte;
      template += '\t ' + element.Fecha_de_Asignacion;
      template += '\t ' + element.Hora_de_Asignacion;
      template += '\t ' + element.Notas;
      template += '\t ' + element.Tiempo_total_de_ejecucion;
      template += '\t ' + element.Fecha_resp;
      template += '\t ' + element.Hora_resp;
      template += '\t ' + element.Respondiente_resp_Spartan_User.Name;
      template += '\t ' + element.Ayuda_de_respuesta_resp_Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda;
      template += '\t ' + element.Respuesta_resp;
      template += '\t ' + element.Fecha_sup;
      template += '\t ' + element.Hora_sup;
      template += '\t ' + element.Supervisor_Spartan_User.Name;
      template += '\t ' + element.Resultado_sup_Resultado_aprobacion_crear_reporte.Autorizacion;
      template += '\t ' + element.Tiempo_ejecucion_Hrs_sup;
      template += '\t ' + element.Observaciones_sup;
      template += '\t ' + element.Fecha_ins;
      template += '\t ' + element.Hora_ins;
      template += '\t ' + element.Inspector_Spartan_User.Name;
      template += '\t ' + element.Resultado_ins_Resultado_aprobacion_crear_reporte.Autorizacion;
      template += '\t ' + element.Tiempo_ejecucion_Hrs_ins;
      template += '\t ' + element.Observaciones_ins;
      template += '\t ' + element.Fecha_pro;
      template += '\t ' + element.Hora_pro;
      template += '\t ' + element.Programador_de_mantenimiento_Spartan_User.Name;
      template += '\t ' + element.Resultado_pro_Resultado_aprobacion_crear_reporte.Autorizacion;
      template += '\t ' + element.Tiempo_ejecucion_Hrs_pro;
      template += '\t ' + element.Observaciones_pro;

      template += '\n';
    });

    return template;
  }

}

export class Crear_ReporteDataSource implements DataSource<Crear_Reporte>
{
  private subject = new BehaviorSubject<Crear_Reporte[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(
    private service: Crear_ReporteService,
    private _file: SpartanFileService
  ) {

  }

  connect(collectionViewer: CollectionViewer): Observable<Crear_Reporte[]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
    this.loadingSubject.complete();
  }

  load(data: any) {

    let condition = this.SetWhereClause(data);
    let sort = this.SetOrderClause(data);

    this.loadingSubject.next(true);
    if (data.MRWhere.length > 0) {
      if (condition != null && condition.length > 0) {
        condition = condition + " AND " + data.MRWhere;
      }
      if (condition == null || condition.length == 0) {
        condition = data.MRWhere;
      }
    }

    if (data.MRSort.length > 0) {
      sort = data.MRSort;
    }

    let page = data.page + 1;
    this.service.listaSelAll(page * data.size - data.size + 1, page * data.size, condition, sort)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: any) => {
        data.styles = [];
        data.columns.forEach((column, index) => {
          if (column === 'Folio') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Crear_Reportes.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Crear_Reportes);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Folio != "")
      condition += " and Crear_Reporte.Folio = " + data.filter.Folio;
    if (data.filter.No_Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.No_Reporte + "%' ";
    if (data.filter.N_Orden_de_Trabajo != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.N_Orden_de_Trabajo + "%' ";
    if (data.filter.No__de_Orden_de_Servicio != "")
      condition += " and Orden_de_servicio.Folio_OS like '%" + data.filter.No__de_Orden_de_Servicio + "%' ";
    if (data.filter.Descripcion_breve != "")
      condition += " and Crear_Reporte.Descripcion_breve like '%" + data.filter.Descripcion_breve + "%' ";
    if (data.filter.Tipo_de_reporte_OS != "")
      condition += " and Tipo_orden_de_servicio.Descripcion like '%" + data.filter.Tipo_de_reporte_OS + "%' ";
    if (data.filter.Descripcion_del_componente != "")
      condition += " and Crear_Reporte.Descripcion_del_componente like '%" + data.filter.Descripcion_del_componente + "%' ";
    if (data.filter.Numero_de_parte != "")
      condition += " and Crear_Reporte.Numero_de_parte like '%" + data.filter.Numero_de_parte + "%' ";
    if (data.filter.Numero_de_serie != "")
      condition += " and Crear_Reporte.Numero_de_serie like '%" + data.filter.Numero_de_serie + "%' ";
    if (data.filter.Fecha_requerida != "")
      condition += " and Crear_Reporte.Fecha_requerida like '%" + data.filter.Fecha_requerida + "%' ";
    if (data.filter.Promedio_de_ejecucion != "")
      condition += " and Crear_Reporte.Promedio_de_ejecucion = " + data.filter.Promedio_de_ejecucion;
    if (data.filter.Prioridad_del_reporte != "")
      condition += " and Prioridad_del_Reporte.Descripcion like '%" + data.filter.Prioridad_del_reporte + "%' ";
    if (data.filter.Tipo_de_orden_de_trabajo != "")
      condition += " and Tipo_de_Orden_de_Trabajo.Descripcion like '%" + data.filter.Tipo_de_orden_de_trabajo + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Reporte.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Origen_del_reporte != "")
      condition += " and Tipo_de_origen_del_reporte.Descripcion like '%" + data.filter.Origen_del_reporte + "%' ";
    if (data.filter.Codigo_computarizado_Descripcion != "")
      condition += " and Codigo_Computarizado.Descripcion_Busqueda like '%" + data.filter.Codigo_computarizado_Descripcion + "%' ";
    if (data.filter.Ciclos_restantes != "")
      condition += " and Crear_Reporte.Ciclos_restantes = " + data.filter.Ciclos_restantes;
    if (data.filter.Horas_restantes != "")
      condition += " and Crear_Reporte.Horas_restantes = " + data.filter.Horas_restantes;
    if (data.filter.N_boletin_directiva != "")
      condition += " and Crear_Reporte.N_boletin_directiva like '%" + data.filter.N_boletin_directiva + "%' ";
    if (data.filter.Titulo_boletin_directiva != "")
      condition += " and Crear_Reporte.Titulo_boletin_directiva like '%" + data.filter.Titulo_boletin_directiva + "%' ";
    if (data.filter.Tipo_de_reporte != "")
      condition += " and Tipo_de_Reporte.Descripcion like '%" + data.filter.Tipo_de_reporte + "%' ";
    if (data.filter.Reporte_de_aeronave != "")
      condition += " and Crear_Reporte.Reporte_de_aeronave like '%" + data.filter.Reporte_de_aeronave + "%' ";
    if (data.filter.N_de_bitacora != "")
      condition += " and Crear_Reporte.N_de_bitacora like '%" + data.filter.N_de_bitacora + "%' ";
    if (data.filter.Codigo_ATA != "")
      condition += " and Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + data.filter.Codigo_ATA + "%' ";
    if (data.filter.IdDiscrepancia != "")
      condition += " and Crear_Reporte.IdDiscrepancia = " + data.filter.IdDiscrepancia;
    if (data.filter.Id_Inspeccion_de_Entrada != "")
      condition += " and Crear_Reporte.Id_Inspeccion_de_Entrada = " + data.filter.Id_Inspeccion_de_Entrada;
    if (data.filter.IdCotizacion != "")
      condition += " and Crear_Reporte.IdCotizacion = " + data.filter.IdCotizacion;
    if (data.filter.Fecha_de_Creacion_del_Reporte)
      condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_de_Creacion_del_Reporte, 102)  = '" + moment(data.filter.Fecha_de_Creacion_del_Reporte).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Creacion_del_Reporte != "")
      condition += " and Crear_Reporte.Hora_de_Creacion_del_Reporte = '" + data.filter.Hora_de_Creacion_del_Reporte + "'";
    if (data.filter.Fecha_de_Asignacion)
      condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_de_Asignacion, 102)  = '" + moment(data.filter.Fecha_de_Asignacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Asignacion != "")
      condition += " and Crear_Reporte.Hora_de_Asignacion = '" + data.filter.Hora_de_Asignacion + "'";
    if (data.filter.Notas != "")
      condition += " and Crear_Reporte.Notas like '%" + data.filter.Notas + "%' ";
    if (data.filter.Tiempo_total_de_ejecucion != "")
      condition += " and Crear_Reporte.Tiempo_total_de_ejecucion = " + data.filter.Tiempo_total_de_ejecucion;
    if (data.filter.Fecha_resp)
      condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_resp, 102)  = '" + moment(data.filter.Fecha_resp).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_resp != "")
      condition += " and Crear_Reporte.Hora_resp = '" + data.filter.Hora_resp + "'";
    if (data.filter.Respondiente_resp != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Respondiente_resp + "%' ";
    if (data.filter.Ayuda_de_respuesta_resp != "")
      condition += " and Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda like '%" + data.filter.Ayuda_de_respuesta_resp + "%' ";
    if (data.filter.Respuesta_resp != "")
      condition += " and Crear_Reporte.Respuesta_resp like '%" + data.filter.Respuesta_resp + "%' ";
    if (data.filter.Fecha_sup)
      condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_sup, 102)  = '" + moment(data.filter.Fecha_sup).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_sup != "")
      condition += " and Crear_Reporte.Hora_sup = '" + data.filter.Hora_sup + "'";
    if (data.filter.Supervisor != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Supervisor + "%' ";
    if (data.filter.Resultado_sup != "")
      condition += " and Resultado_aprobacion_crear_reporte.Autorizacion like '%" + data.filter.Resultado_sup + "%' ";
    if (data.filter.Tiempo_ejecucion_Hrs_sup != "")
      condition += " and Crear_Reporte.Tiempo_ejecucion_Hrs_sup = " + data.filter.Tiempo_ejecucion_Hrs_sup;
    if (data.filter.Observaciones_sup != "")
      condition += " and Crear_Reporte.Observaciones_sup like '%" + data.filter.Observaciones_sup + "%' ";
    if (data.filter.Fecha_ins)
      condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_ins, 102)  = '" + moment(data.filter.Fecha_ins).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_ins != "")
      condition += " and Crear_Reporte.Hora_ins = '" + data.filter.Hora_ins + "'";
    if (data.filter.Inspector != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Inspector + "%' ";
    if (data.filter.Resultado_ins != "")
      condition += " and Resultado_aprobacion_crear_reporte.Autorizacion like '%" + data.filter.Resultado_ins + "%' ";
    if (data.filter.Tiempo_ejecucion_Hrs_ins != "")
      condition += " and Crear_Reporte.Tiempo_ejecucion_Hrs_ins = " + data.filter.Tiempo_ejecucion_Hrs_ins;
    if (data.filter.Observaciones_ins != "")
      condition += " and Crear_Reporte.Observaciones_ins like '%" + data.filter.Observaciones_ins + "%' ";
    if (data.filter.Fecha_pro)
      condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_pro, 102)  = '" + moment(data.filter.Fecha_pro).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_pro != "")
      condition += " and Crear_Reporte.Hora_pro = '" + data.filter.Hora_pro + "'";
    if (data.filter.Programador_de_mantenimiento != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Programador_de_mantenimiento + "%' ";
    if (data.filter.Resultado_pro != "")
      condition += " and Resultado_aprobacion_crear_reporte.Autorizacion like '%" + data.filter.Resultado_pro + "%' ";
    if (data.filter.Tiempo_ejecucion_Hrs_pro != "")
      condition += " and Crear_Reporte.Tiempo_ejecucion_Hrs_pro = " + data.filter.Tiempo_ejecucion_Hrs_pro;
    if (data.filter.Observaciones_pro != "")
      condition += " and Crear_Reporte.Observaciones_pro like '%" + data.filter.Observaciones_pro + "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "Folio":
        sort = " Crear_Reporte.Folio " + data.sortDirecction;
        break;
      case "No_Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "N_Orden_de_Trabajo":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "No__de_Orden_de_Servicio":
        sort = " Orden_de_servicio.Folio_OS " + data.sortDirecction;
        break;
      case "Descripcion_breve":
        sort = " Crear_Reporte.Descripcion_breve " + data.sortDirecction;
        break;
      case "Tipo_de_reporte_OS":
        sort = " Tipo_orden_de_servicio.Descripcion " + data.sortDirecction;
        break;
      case "Descripcion_del_componente":
        sort = " Crear_Reporte.Descripcion_del_componente " + data.sortDirecction;
        break;
      case "Numero_de_parte":
        sort = " Crear_Reporte.Numero_de_parte " + data.sortDirecction;
        break;
      case "Numero_de_serie":
        sort = " Crear_Reporte.Numero_de_serie " + data.sortDirecction;
        break;
      case "Fecha_requerida":
        sort = " Crear_Reporte.Fecha_requerida " + data.sortDirecction;
        break;
      case "Promedio_de_ejecucion":
        sort = " Crear_Reporte.Promedio_de_ejecucion " + data.sortDirecction;
        break;
      case "Prioridad_del_reporte":
        sort = " Prioridad_del_Reporte.Descripcion " + data.sortDirecction;
        break;
      case "Tipo_de_orden_de_trabajo":
        sort = " Tipo_de_Orden_de_Trabajo.Descripcion " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Reporte.Descripcion " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Origen_del_reporte":
        sort = " Tipo_de_origen_del_reporte.Descripcion " + data.sortDirecction;
        break;
      case "Codigo_computarizado_Descripcion":
        sort = " Codigo_Computarizado.Descripcion_Busqueda " + data.sortDirecction;
        break;
      case "Ciclos_restantes":
        sort = " Crear_Reporte.Ciclos_restantes " + data.sortDirecction;
        break;
      case "Horas_restantes":
        sort = " Crear_Reporte.Horas_restantes " + data.sortDirecction;
        break;
      case "N_boletin_directiva":
        sort = " Crear_Reporte.N_boletin_directiva " + data.sortDirecction;
        break;
      case "Titulo_boletin_directiva":
        sort = " Crear_Reporte.Titulo_boletin_directiva " + data.sortDirecction;
        break;
      case "Tipo_de_reporte":
        sort = " Tipo_de_Reporte.Descripcion " + data.sortDirecction;
        break;
      case "Reporte_de_aeronave":
        sort = " Crear_Reporte.Reporte_de_aeronave " + data.sortDirecction;
        break;
      case "N_de_bitacora":
        sort = " Crear_Reporte.N_de_bitacora " + data.sortDirecction;
        break;
      case "Codigo_ATA":
        sort = " Catalogo_codigo_ATA.Codigo_ATA_Descripcion " + data.sortDirecction;
        break;
      case "IdDiscrepancia":
        sort = " Crear_Reporte.IdDiscrepancia " + data.sortDirecction;
        break;
      case "Id_Inspeccion_de_Entrada":
        sort = " Crear_Reporte.Id_Inspeccion_de_Entrada " + data.sortDirecction;
        break;
      case "IdCotizacion":
        sort = " Crear_Reporte.IdCotizacion " + data.sortDirecction;
        break;
      case "Fecha_de_Creacion_del_Reporte":
        sort = " Crear_Reporte.Fecha_de_Creacion_del_Reporte " + data.sortDirecction;
        break;
      case "Hora_de_Creacion_del_Reporte":
        sort = " Crear_Reporte.Hora_de_Creacion_del_Reporte " + data.sortDirecction;
        break;
      case "Fecha_de_Asignacion":
        sort = " Crear_Reporte.Fecha_de_Asignacion " + data.sortDirecction;
        break;
      case "Hora_de_Asignacion":
        sort = " Crear_Reporte.Hora_de_Asignacion " + data.sortDirecction;
        break;
      case "Notas":
        sort = " Crear_Reporte.Notas " + data.sortDirecction;
        break;
      case "Tiempo_total_de_ejecucion":
        sort = " Crear_Reporte.Tiempo_total_de_ejecucion " + data.sortDirecction;
        break;
      case "Fecha_resp":
        sort = " Crear_Reporte.Fecha_resp " + data.sortDirecction;
        break;
      case "Hora_resp":
        sort = " Crear_Reporte.Hora_resp " + data.sortDirecction;
        break;
      case "Respondiente_resp":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Ayuda_de_respuesta_resp":
        sort = " Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda " + data.sortDirecction;
        break;
      case "Respuesta_resp":
        sort = " Crear_Reporte.Respuesta_resp " + data.sortDirecction;
        break;
      case "Fecha_sup":
        sort = " Crear_Reporte.Fecha_sup " + data.sortDirecction;
        break;
      case "Hora_sup":
        sort = " Crear_Reporte.Hora_sup " + data.sortDirecction;
        break;
      case "Supervisor":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Resultado_sup":
        sort = " Resultado_aprobacion_crear_reporte.Autorizacion " + data.sortDirecction;
        break;
      case "Tiempo_ejecucion_Hrs_sup":
        sort = " Crear_Reporte.Tiempo_ejecucion_Hrs_sup " + data.sortDirecction;
        break;
      case "Observaciones_sup":
        sort = " Crear_Reporte.Observaciones_sup " + data.sortDirecction;
        break;
      case "Fecha_ins":
        sort = " Crear_Reporte.Fecha_ins " + data.sortDirecction;
        break;
      case "Hora_ins":
        sort = " Crear_Reporte.Hora_ins " + data.sortDirecction;
        break;
      case "Inspector":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Resultado_ins":
        sort = " Resultado_aprobacion_crear_reporte.Autorizacion " + data.sortDirecction;
        break;
      case "Tiempo_ejecucion_Hrs_ins":
        sort = " Crear_Reporte.Tiempo_ejecucion_Hrs_ins " + data.sortDirecction;
        break;
      case "Observaciones_ins":
        sort = " Crear_Reporte.Observaciones_ins " + data.sortDirecction;
        break;
      case "Fecha_pro":
        sort = " Crear_Reporte.Fecha_pro " + data.sortDirecction;
        break;
      case "Hora_pro":
        sort = " Crear_Reporte.Hora_pro " + data.sortDirecction;
        break;
      case "Programador_de_mantenimiento":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Resultado_pro":
        sort = " Resultado_aprobacion_crear_reporte.Autorizacion " + data.sortDirecction;
        break;
      case "Tiempo_ejecucion_Hrs_pro":
        sort = " Crear_Reporte.Tiempo_ejecucion_Hrs_pro " + data.sortDirecction;
        break;
      case "Observaciones_pro":
        sort = " Crear_Reporte.Observaciones_pro " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
      || (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)) {
      if (typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
        condition += " AND Crear_Reporte.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Crear_Reporte.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.No_ReporteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.No_Reporte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.No_Reporte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.No_Reporte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.No_Reporte + "'";
        break;
    }
    if ((typeof data.filterAdvanced.N_Orden_de_Trabajo != 'undefined' && data.filterAdvanced.N_Orden_de_Trabajo)) {
      switch (data.filterAdvanced.N_Orden_de_TrabajoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.N_Orden_de_Trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.N_Orden_de_Trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.N_Orden_de_Trabajo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.N_Orden_de_Trabajo + "'";
          break;
      }
    } else if (data.filterAdvanced.N_Orden_de_TrabajoMultiple != null && data.filterAdvanced.N_Orden_de_TrabajoMultiple.length > 0) {
      var N_Orden_de_Trabajods = data.filterAdvanced.N_Orden_de_TrabajoMultiple.join(",");
      condition += " AND Crear_Reporte.N_Orden_de_Trabajo In (" + N_Orden_de_Trabajods + ")";
    }
    if ((typeof data.filterAdvanced.No__de_Orden_de_Servicio != 'undefined' && data.filterAdvanced.No__de_Orden_de_Servicio)) {
      switch (data.filterAdvanced.No__de_Orden_de_ServicioFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '" + data.filterAdvanced.No__de_Orden_de_Servicio + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '%" + data.filterAdvanced.No__de_Orden_de_Servicio + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '%" + data.filterAdvanced.No__de_Orden_de_Servicio + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_servicio.Folio_OS = '" + data.filterAdvanced.No__de_Orden_de_Servicio + "'";
          break;
      }
    } else if (data.filterAdvanced.No__de_Orden_de_ServicioMultiple != null && data.filterAdvanced.No__de_Orden_de_ServicioMultiple.length > 0) {
      var No__de_Orden_de_Serviciods = data.filterAdvanced.No__de_Orden_de_ServicioMultiple.join(",");
      condition += " AND Crear_Reporte.No__de_Orden_de_Servicio In (" + No__de_Orden_de_Serviciods + ")";
    }
    switch (data.filterAdvanced.Descripcion_breveFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Descripcion_breve LIKE '" + data.filterAdvanced.Descripcion_breve + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Descripcion_breve LIKE '%" + data.filterAdvanced.Descripcion_breve + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Descripcion_breve LIKE '%" + data.filterAdvanced.Descripcion_breve + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Descripcion_breve = '" + data.filterAdvanced.Descripcion_breve + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Tipo_de_reporte_OS != 'undefined' && data.filterAdvanced.Tipo_de_reporte_OS)) {
      switch (data.filterAdvanced.Tipo_de_reporte_OSFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_orden_de_servicio.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_reporte_OS + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_orden_de_servicio.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_reporte_OS + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_orden_de_servicio.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_reporte_OS + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_orden_de_servicio.Descripcion = '" + data.filterAdvanced.Tipo_de_reporte_OS + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_reporte_OSMultiple != null && data.filterAdvanced.Tipo_de_reporte_OSMultiple.length > 0) {
      var Tipo_de_reporte_OSds = data.filterAdvanced.Tipo_de_reporte_OSMultiple.join(",");
      condition += " AND Crear_Reporte.Tipo_de_reporte_OS In (" + Tipo_de_reporte_OSds + ")";
    }
    switch (data.filterAdvanced.Descripcion_del_componenteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Descripcion_del_componente LIKE '" + data.filterAdvanced.Descripcion_del_componente + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Descripcion_del_componente LIKE '%" + data.filterAdvanced.Descripcion_del_componente + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Descripcion_del_componente LIKE '%" + data.filterAdvanced.Descripcion_del_componente + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Descripcion_del_componente = '" + data.filterAdvanced.Descripcion_del_componente + "'";
        break;
    }
    switch (data.filterAdvanced.Numero_de_parteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Numero_de_parte LIKE '" + data.filterAdvanced.Numero_de_parte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Numero_de_parte LIKE '%" + data.filterAdvanced.Numero_de_parte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Numero_de_parte LIKE '%" + data.filterAdvanced.Numero_de_parte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Numero_de_parte = '" + data.filterAdvanced.Numero_de_parte + "'";
        break;
    }
    switch (data.filterAdvanced.Numero_de_serieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Numero_de_serie LIKE '" + data.filterAdvanced.Numero_de_serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Numero_de_serie LIKE '%" + data.filterAdvanced.Numero_de_serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Numero_de_serie LIKE '%" + data.filterAdvanced.Numero_de_serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Numero_de_serie = '" + data.filterAdvanced.Numero_de_serie + "'";
        break;
    }
    switch (data.filterAdvanced.Fecha_requeridaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Fecha_requerida LIKE '" + data.filterAdvanced.Fecha_requerida + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Fecha_requerida LIKE '%" + data.filterAdvanced.Fecha_requerida + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Fecha_requerida LIKE '%" + data.filterAdvanced.Fecha_requerida + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Fecha_requerida = '" + data.filterAdvanced.Fecha_requerida + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromPromedio_de_ejecucion != 'undefined' && data.filterAdvanced.fromPromedio_de_ejecucion)
      || (typeof data.filterAdvanced.toPromedio_de_ejecucion != 'undefined' && data.filterAdvanced.toPromedio_de_ejecucion)) {
      if (typeof data.filterAdvanced.fromPromedio_de_ejecucion != 'undefined' && data.filterAdvanced.fromPromedio_de_ejecucion)
        condition += " AND Crear_Reporte.Promedio_de_ejecucion >= " + data.filterAdvanced.fromPromedio_de_ejecucion;

      if (typeof data.filterAdvanced.toPromedio_de_ejecucion != 'undefined' && data.filterAdvanced.toPromedio_de_ejecucion)
        condition += " AND Crear_Reporte.Promedio_de_ejecucion <= " + data.filterAdvanced.toPromedio_de_ejecucion;
    }
    if ((typeof data.filterAdvanced.Prioridad_del_reporte != 'undefined' && data.filterAdvanced.Prioridad_del_reporte)) {
      switch (data.filterAdvanced.Prioridad_del_reporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Prioridad_del_Reporte.Descripcion LIKE '" + data.filterAdvanced.Prioridad_del_reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Prioridad_del_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Prioridad_del_reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Prioridad_del_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Prioridad_del_reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Prioridad_del_Reporte.Descripcion = '" + data.filterAdvanced.Prioridad_del_reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.Prioridad_del_reporteMultiple != null && data.filterAdvanced.Prioridad_del_reporteMultiple.length > 0) {
      var Prioridad_del_reporteds = data.filterAdvanced.Prioridad_del_reporteMultiple.join(",");
      condition += " AND Crear_Reporte.Prioridad_del_reporte In (" + Prioridad_del_reporteds + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_orden_de_trabajo != 'undefined' && data.filterAdvanced.Tipo_de_orden_de_trabajo)) {
      switch (data.filterAdvanced.Tipo_de_orden_de_trabajoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Orden_de_Trabajo.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_orden_de_trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Orden_de_Trabajo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_orden_de_trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Orden_de_Trabajo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_orden_de_trabajo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Orden_de_Trabajo.Descripcion = '" + data.filterAdvanced.Tipo_de_orden_de_trabajo + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_orden_de_trabajoMultiple != null && data.filterAdvanced.Tipo_de_orden_de_trabajoMultiple.length > 0) {
      var Tipo_de_orden_de_trabajods = data.filterAdvanced.Tipo_de_orden_de_trabajoMultiple.join(",");
      condition += " AND Crear_Reporte.Tipo_de_orden_de_trabajo In (" + Tipo_de_orden_de_trabajods + ")";
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Reporte.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Reporte.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Crear_Reporte.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.Matricula != 'undefined' && data.filterAdvanced.Matricula)) {
      switch (data.filterAdvanced.MatriculaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeronave.Matricula LIKE '" + data.filterAdvanced.Matricula + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Matricula + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Matricula + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeronave.Matricula = '" + data.filterAdvanced.Matricula + "'";
          break;
      }
    } else if (data.filterAdvanced.MatriculaMultiple != null && data.filterAdvanced.MatriculaMultiple.length > 0) {
      var Matriculads = data.filterAdvanced.MatriculaMultiple.join(",");
      condition += " AND Crear_Reporte.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.Origen_del_reporte != 'undefined' && data.filterAdvanced.Origen_del_reporte)) {
      switch (data.filterAdvanced.Origen_del_reporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_origen_del_reporte.Descripcion LIKE '" + data.filterAdvanced.Origen_del_reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_origen_del_reporte.Descripcion LIKE '%" + data.filterAdvanced.Origen_del_reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_origen_del_reporte.Descripcion LIKE '%" + data.filterAdvanced.Origen_del_reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_origen_del_reporte.Descripcion = '" + data.filterAdvanced.Origen_del_reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.Origen_del_reporteMultiple != null && data.filterAdvanced.Origen_del_reporteMultiple.length > 0) {
      var Origen_del_reporteds = data.filterAdvanced.Origen_del_reporteMultiple.join(",");
      condition += " AND Crear_Reporte.Origen_del_reporte In (" + Origen_del_reporteds + ")";
    }
    if ((typeof data.filterAdvanced.Codigo_computarizado_Descripcion != 'undefined' && data.filterAdvanced.Codigo_computarizado_Descripcion)) {
      switch (data.filterAdvanced.Codigo_computarizado_DescripcionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '" + data.filterAdvanced.Codigo_computarizado_Descripcion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Codigo_computarizado_Descripcion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Codigo_computarizado_Descripcion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda = '" + data.filterAdvanced.Codigo_computarizado_Descripcion + "'";
          break;
      }
    } else if (data.filterAdvanced.Codigo_computarizado_DescripcionMultiple != null && data.filterAdvanced.Codigo_computarizado_DescripcionMultiple.length > 0) {
      var Codigo_computarizado_Descripcionds = data.filterAdvanced.Codigo_computarizado_DescripcionMultiple.join(",");
      condition += " AND Crear_Reporte.Codigo_computarizado_Descripcion In (" + Codigo_computarizado_Descripcionds + ")";
    }
    if ((typeof data.filterAdvanced.fromCiclos_restantes != 'undefined' && data.filterAdvanced.fromCiclos_restantes)
      || (typeof data.filterAdvanced.toCiclos_restantes != 'undefined' && data.filterAdvanced.toCiclos_restantes)) {
      if (typeof data.filterAdvanced.fromCiclos_restantes != 'undefined' && data.filterAdvanced.fromCiclos_restantes)
        condition += " AND Crear_Reporte.Ciclos_restantes >= " + data.filterAdvanced.fromCiclos_restantes;

      if (typeof data.filterAdvanced.toCiclos_restantes != 'undefined' && data.filterAdvanced.toCiclos_restantes)
        condition += " AND Crear_Reporte.Ciclos_restantes <= " + data.filterAdvanced.toCiclos_restantes;
    }
    if ((typeof data.filterAdvanced.fromHoras_restantes != 'undefined' && data.filterAdvanced.fromHoras_restantes)
      || (typeof data.filterAdvanced.toHoras_restantes != 'undefined' && data.filterAdvanced.toHoras_restantes)) {
      if (typeof data.filterAdvanced.fromHoras_restantes != 'undefined' && data.filterAdvanced.fromHoras_restantes)
        condition += " AND Crear_Reporte.Horas_restantes >= " + data.filterAdvanced.fromHoras_restantes;

      if (typeof data.filterAdvanced.toHoras_restantes != 'undefined' && data.filterAdvanced.toHoras_restantes)
        condition += " AND Crear_Reporte.Horas_restantes <= " + data.filterAdvanced.toHoras_restantes;
    }
    switch (data.filterAdvanced.N_boletin_directivaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.N_boletin_directiva LIKE '" + data.filterAdvanced.N_boletin_directiva + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.N_boletin_directiva LIKE '%" + data.filterAdvanced.N_boletin_directiva + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.N_boletin_directiva LIKE '%" + data.filterAdvanced.N_boletin_directiva + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.N_boletin_directiva = '" + data.filterAdvanced.N_boletin_directiva + "'";
        break;
    }
    switch (data.filterAdvanced.Titulo_boletin_directivaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Titulo_boletin_directiva LIKE '" + data.filterAdvanced.Titulo_boletin_directiva + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Titulo_boletin_directiva LIKE '%" + data.filterAdvanced.Titulo_boletin_directiva + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Titulo_boletin_directiva LIKE '%" + data.filterAdvanced.Titulo_boletin_directiva + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Titulo_boletin_directiva = '" + data.filterAdvanced.Titulo_boletin_directiva + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Tipo_de_reporte != 'undefined' && data.filterAdvanced.Tipo_de_reporte)) {
      switch (data.filterAdvanced.Tipo_de_reporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Reporte.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Reporte.Descripcion = '" + data.filterAdvanced.Tipo_de_reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_reporteMultiple != null && data.filterAdvanced.Tipo_de_reporteMultiple.length > 0) {
      var Tipo_de_reporteds = data.filterAdvanced.Tipo_de_reporteMultiple.join(",");
      condition += " AND Crear_Reporte.Tipo_de_reporte In (" + Tipo_de_reporteds + ")";
    }
    switch (data.filterAdvanced.Reporte_de_aeronaveFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Reporte_de_aeronave LIKE '" + data.filterAdvanced.Reporte_de_aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Reporte_de_aeronave LIKE '%" + data.filterAdvanced.Reporte_de_aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Reporte_de_aeronave LIKE '%" + data.filterAdvanced.Reporte_de_aeronave + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Reporte_de_aeronave = '" + data.filterAdvanced.Reporte_de_aeronave + "'";
        break;
    }
    switch (data.filterAdvanced.N_de_bitacoraFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.N_de_bitacora LIKE '" + data.filterAdvanced.N_de_bitacora + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.N_de_bitacora LIKE '%" + data.filterAdvanced.N_de_bitacora + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.N_de_bitacora LIKE '%" + data.filterAdvanced.N_de_bitacora + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.N_de_bitacora = '" + data.filterAdvanced.N_de_bitacora + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Codigo_ATA != 'undefined' && data.filterAdvanced.Codigo_ATA)) {
      switch (data.filterAdvanced.Codigo_ATAFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '" + data.filterAdvanced.Codigo_ATA + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '%" + data.filterAdvanced.Codigo_ATA + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '%" + data.filterAdvanced.Codigo_ATA + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion = '" + data.filterAdvanced.Codigo_ATA + "'";
          break;
      }
    } else if (data.filterAdvanced.Codigo_ATAMultiple != null && data.filterAdvanced.Codigo_ATAMultiple.length > 0) {
      var Codigo_ATAds = data.filterAdvanced.Codigo_ATAMultiple.join(",");
      condition += " AND Crear_Reporte.Codigo_ATA In (" + Codigo_ATAds + ")";
    }
    if ((typeof data.filterAdvanced.fromIdDiscrepancia != 'undefined' && data.filterAdvanced.fromIdDiscrepancia)
      || (typeof data.filterAdvanced.toIdDiscrepancia != 'undefined' && data.filterAdvanced.toIdDiscrepancia)) {
      if (typeof data.filterAdvanced.fromIdDiscrepancia != 'undefined' && data.filterAdvanced.fromIdDiscrepancia)
        condition += " AND Crear_Reporte.IdDiscrepancia >= " + data.filterAdvanced.fromIdDiscrepancia;

      if (typeof data.filterAdvanced.toIdDiscrepancia != 'undefined' && data.filterAdvanced.toIdDiscrepancia)
        condition += " AND Crear_Reporte.IdDiscrepancia <= " + data.filterAdvanced.toIdDiscrepancia;
    }
    if ((typeof data.filterAdvanced.fromId_Inspeccion_de_Entrada != 'undefined' && data.filterAdvanced.fromId_Inspeccion_de_Entrada)
      || (typeof data.filterAdvanced.toId_Inspeccion_de_Entrada != 'undefined' && data.filterAdvanced.toId_Inspeccion_de_Entrada)) {
      if (typeof data.filterAdvanced.fromId_Inspeccion_de_Entrada != 'undefined' && data.filterAdvanced.fromId_Inspeccion_de_Entrada)
        condition += " AND Crear_Reporte.Id_Inspeccion_de_Entrada >= " + data.filterAdvanced.fromId_Inspeccion_de_Entrada;

      if (typeof data.filterAdvanced.toId_Inspeccion_de_Entrada != 'undefined' && data.filterAdvanced.toId_Inspeccion_de_Entrada)
        condition += " AND Crear_Reporte.Id_Inspeccion_de_Entrada <= " + data.filterAdvanced.toId_Inspeccion_de_Entrada;
    }
    if ((typeof data.filterAdvanced.fromIdCotizacion != 'undefined' && data.filterAdvanced.fromIdCotizacion)
      || (typeof data.filterAdvanced.toIdCotizacion != 'undefined' && data.filterAdvanced.toIdCotizacion)) {
      if (typeof data.filterAdvanced.fromIdCotizacion != 'undefined' && data.filterAdvanced.fromIdCotizacion)
        condition += " AND Crear_Reporte.IdCotizacion >= " + data.filterAdvanced.fromIdCotizacion;

      if (typeof data.filterAdvanced.toIdCotizacion != 'undefined' && data.filterAdvanced.toIdCotizacion)
        condition += " AND Crear_Reporte.IdCotizacion <= " + data.filterAdvanced.toIdCotizacion;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Creacion_del_Reporte != 'undefined' && data.filterAdvanced.fromFecha_de_Creacion_del_Reporte)
      || (typeof data.filterAdvanced.toFecha_de_Creacion_del_Reporte != 'undefined' && data.filterAdvanced.toFecha_de_Creacion_del_Reporte)) {
      if (typeof data.filterAdvanced.fromFecha_de_Creacion_del_Reporte != 'undefined' && data.filterAdvanced.fromFecha_de_Creacion_del_Reporte)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_de_Creacion_del_Reporte, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Creacion_del_Reporte).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Creacion_del_Reporte != 'undefined' && data.filterAdvanced.toFecha_de_Creacion_del_Reporte)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_de_Creacion_del_Reporte, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Creacion_del_Reporte).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Creacion_del_Reporte != 'undefined' && data.filterAdvanced.fromHora_de_Creacion_del_Reporte)
      || (typeof data.filterAdvanced.toHora_de_Creacion_del_Reporte != 'undefined' && data.filterAdvanced.toHora_de_Creacion_del_Reporte)) {
      if (typeof data.filterAdvanced.fromHora_de_Creacion_del_Reporte != 'undefined' && data.filterAdvanced.fromHora_de_Creacion_del_Reporte)
        condition += " and Crear_Reporte.Hora_de_Creacion_del_Reporte >= '" + data.filterAdvanced.fromHora_de_Creacion_del_Reporte + "'";

      if (typeof data.filterAdvanced.toHora_de_Creacion_del_Reporte != 'undefined' && data.filterAdvanced.toHora_de_Creacion_del_Reporte)
        condition += " and Crear_Reporte.Hora_de_Creacion_del_Reporte <= '" + data.filterAdvanced.toHora_de_Creacion_del_Reporte + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Asignacion != 'undefined' && data.filterAdvanced.fromFecha_de_Asignacion)
      || (typeof data.filterAdvanced.toFecha_de_Asignacion != 'undefined' && data.filterAdvanced.toFecha_de_Asignacion)) {
      if (typeof data.filterAdvanced.fromFecha_de_Asignacion != 'undefined' && data.filterAdvanced.fromFecha_de_Asignacion)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_de_Asignacion, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Asignacion).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Asignacion != 'undefined' && data.filterAdvanced.toFecha_de_Asignacion)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_de_Asignacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Asignacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Asignacion != 'undefined' && data.filterAdvanced.fromHora_de_Asignacion)
      || (typeof data.filterAdvanced.toHora_de_Asignacion != 'undefined' && data.filterAdvanced.toHora_de_Asignacion)) {
      if (typeof data.filterAdvanced.fromHora_de_Asignacion != 'undefined' && data.filterAdvanced.fromHora_de_Asignacion)
        condition += " and Crear_Reporte.Hora_de_Asignacion >= '" + data.filterAdvanced.fromHora_de_Asignacion + "'";

      if (typeof data.filterAdvanced.toHora_de_Asignacion != 'undefined' && data.filterAdvanced.toHora_de_Asignacion)
        condition += " and Crear_Reporte.Hora_de_Asignacion <= '" + data.filterAdvanced.toHora_de_Asignacion + "'";
    }
    switch (data.filterAdvanced.NotasFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Notas LIKE '" + data.filterAdvanced.Notas + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Notas LIKE '%" + data.filterAdvanced.Notas + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Notas LIKE '%" + data.filterAdvanced.Notas + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Notas = '" + data.filterAdvanced.Notas + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromTiempo_total_de_ejecucion != 'undefined' && data.filterAdvanced.fromTiempo_total_de_ejecucion)
      || (typeof data.filterAdvanced.toTiempo_total_de_ejecucion != 'undefined' && data.filterAdvanced.toTiempo_total_de_ejecucion)) {
      if (typeof data.filterAdvanced.fromTiempo_total_de_ejecucion != 'undefined' && data.filterAdvanced.fromTiempo_total_de_ejecucion)
        condition += " AND Crear_Reporte.Tiempo_total_de_ejecucion >= " + data.filterAdvanced.fromTiempo_total_de_ejecucion;

      if (typeof data.filterAdvanced.toTiempo_total_de_ejecucion != 'undefined' && data.filterAdvanced.toTiempo_total_de_ejecucion)
        condition += " AND Crear_Reporte.Tiempo_total_de_ejecucion <= " + data.filterAdvanced.toTiempo_total_de_ejecucion;
    }
    if ((typeof data.filterAdvanced.fromFecha_resp != 'undefined' && data.filterAdvanced.fromFecha_resp)
      || (typeof data.filterAdvanced.toFecha_resp != 'undefined' && data.filterAdvanced.toFecha_resp)) {
      if (typeof data.filterAdvanced.fromFecha_resp != 'undefined' && data.filterAdvanced.fromFecha_resp)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_resp, 102)  >= '" + moment(data.filterAdvanced.fromFecha_resp).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_resp != 'undefined' && data.filterAdvanced.toFecha_resp)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_resp, 102)  <= '" + moment(data.filterAdvanced.toFecha_resp).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_resp != 'undefined' && data.filterAdvanced.fromHora_resp)
      || (typeof data.filterAdvanced.toHora_resp != 'undefined' && data.filterAdvanced.toHora_resp)) {
      if (typeof data.filterAdvanced.fromHora_resp != 'undefined' && data.filterAdvanced.fromHora_resp)
        condition += " and Crear_Reporte.Hora_resp >= '" + data.filterAdvanced.fromHora_resp + "'";

      if (typeof data.filterAdvanced.toHora_resp != 'undefined' && data.filterAdvanced.toHora_resp)
        condition += " and Crear_Reporte.Hora_resp <= '" + data.filterAdvanced.toHora_resp + "'";
    }
    if ((typeof data.filterAdvanced.Respondiente_resp != 'undefined' && data.filterAdvanced.Respondiente_resp)) {
      switch (data.filterAdvanced.Respondiente_respFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Respondiente_resp + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Respondiente_resp + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Respondiente_resp + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Respondiente_resp + "'";
          break;
      }
    } else if (data.filterAdvanced.Respondiente_respMultiple != null && data.filterAdvanced.Respondiente_respMultiple.length > 0) {
      var Respondiente_respds = data.filterAdvanced.Respondiente_respMultiple.join(",");
      condition += " AND Crear_Reporte.Respondiente_resp In (" + Respondiente_respds + ")";
    }
    if ((typeof data.filterAdvanced.Ayuda_de_respuesta_resp != 'undefined' && data.filterAdvanced.Ayuda_de_respuesta_resp)) {
      switch (data.filterAdvanced.Ayuda_de_respuesta_respFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda LIKE '" + data.filterAdvanced.Ayuda_de_respuesta_resp + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda LIKE '%" + data.filterAdvanced.Ayuda_de_respuesta_resp + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda LIKE '%" + data.filterAdvanced.Ayuda_de_respuesta_resp + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Ayuda_de_respuesta_crear_reporte.Respuesta_de_ayuda = '" + data.filterAdvanced.Ayuda_de_respuesta_resp + "'";
          break;
      }
    } else if (data.filterAdvanced.Ayuda_de_respuesta_respMultiple != null && data.filterAdvanced.Ayuda_de_respuesta_respMultiple.length > 0) {
      var Ayuda_de_respuesta_respds = data.filterAdvanced.Ayuda_de_respuesta_respMultiple.join(",");
      condition += " AND Crear_Reporte.Ayuda_de_respuesta_resp In (" + Ayuda_de_respuesta_respds + ")";
    }
    switch (data.filterAdvanced.Respuesta_respFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Respuesta_resp LIKE '" + data.filterAdvanced.Respuesta_resp + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Respuesta_resp LIKE '%" + data.filterAdvanced.Respuesta_resp + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Respuesta_resp LIKE '%" + data.filterAdvanced.Respuesta_resp + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Respuesta_resp = '" + data.filterAdvanced.Respuesta_resp + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_sup != 'undefined' && data.filterAdvanced.fromFecha_sup)
      || (typeof data.filterAdvanced.toFecha_sup != 'undefined' && data.filterAdvanced.toFecha_sup)) {
      if (typeof data.filterAdvanced.fromFecha_sup != 'undefined' && data.filterAdvanced.fromFecha_sup)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_sup, 102)  >= '" + moment(data.filterAdvanced.fromFecha_sup).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_sup != 'undefined' && data.filterAdvanced.toFecha_sup)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_sup, 102)  <= '" + moment(data.filterAdvanced.toFecha_sup).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_sup != 'undefined' && data.filterAdvanced.fromHora_sup)
      || (typeof data.filterAdvanced.toHora_sup != 'undefined' && data.filterAdvanced.toHora_sup)) {
      if (typeof data.filterAdvanced.fromHora_sup != 'undefined' && data.filterAdvanced.fromHora_sup)
        condition += " and Crear_Reporte.Hora_sup >= '" + data.filterAdvanced.fromHora_sup + "'";

      if (typeof data.filterAdvanced.toHora_sup != 'undefined' && data.filterAdvanced.toHora_sup)
        condition += " and Crear_Reporte.Hora_sup <= '" + data.filterAdvanced.toHora_sup + "'";
    }
    if ((typeof data.filterAdvanced.Supervisor != 'undefined' && data.filterAdvanced.Supervisor)) {
      switch (data.filterAdvanced.SupervisorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Supervisor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Supervisor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Supervisor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Supervisor + "'";
          break;
      }
    } else if (data.filterAdvanced.SupervisorMultiple != null && data.filterAdvanced.SupervisorMultiple.length > 0) {
      var Supervisords = data.filterAdvanced.SupervisorMultiple.join(",");
      condition += " AND Crear_Reporte.Supervisor In (" + Supervisords + ")";
    }
    if ((typeof data.filterAdvanced.Resultado_sup != 'undefined' && data.filterAdvanced.Resultado_sup)) {
      switch (data.filterAdvanced.Resultado_supFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion LIKE '" + data.filterAdvanced.Resultado_sup + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion LIKE '%" + data.filterAdvanced.Resultado_sup + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion LIKE '%" + data.filterAdvanced.Resultado_sup + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion = '" + data.filterAdvanced.Resultado_sup + "'";
          break;
      }
    } else if (data.filterAdvanced.Resultado_supMultiple != null && data.filterAdvanced.Resultado_supMultiple.length > 0) {
      var Resultado_supds = data.filterAdvanced.Resultado_supMultiple.join(",");
      condition += " AND Crear_Reporte.Resultado_sup In (" + Resultado_supds + ")";
    }
    if ((typeof data.filterAdvanced.fromTiempo_ejecucion_Hrs_sup != 'undefined' && data.filterAdvanced.fromTiempo_ejecucion_Hrs_sup)
      || (typeof data.filterAdvanced.toTiempo_ejecucion_Hrs_sup != 'undefined' && data.filterAdvanced.toTiempo_ejecucion_Hrs_sup)) {
      if (typeof data.filterAdvanced.fromTiempo_ejecucion_Hrs_sup != 'undefined' && data.filterAdvanced.fromTiempo_ejecucion_Hrs_sup)
        condition += " AND Crear_Reporte.Tiempo_ejecucion_Hrs_sup >= " + data.filterAdvanced.fromTiempo_ejecucion_Hrs_sup;

      if (typeof data.filterAdvanced.toTiempo_ejecucion_Hrs_sup != 'undefined' && data.filterAdvanced.toTiempo_ejecucion_Hrs_sup)
        condition += " AND Crear_Reporte.Tiempo_ejecucion_Hrs_sup <= " + data.filterAdvanced.toTiempo_ejecucion_Hrs_sup;
    }
    switch (data.filterAdvanced.Observaciones_supFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Observaciones_sup LIKE '" + data.filterAdvanced.Observaciones_sup + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Observaciones_sup LIKE '%" + data.filterAdvanced.Observaciones_sup + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Observaciones_sup LIKE '%" + data.filterAdvanced.Observaciones_sup + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Observaciones_sup = '" + data.filterAdvanced.Observaciones_sup + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_ins != 'undefined' && data.filterAdvanced.fromFecha_ins)
      || (typeof data.filterAdvanced.toFecha_ins != 'undefined' && data.filterAdvanced.toFecha_ins)) {
      if (typeof data.filterAdvanced.fromFecha_ins != 'undefined' && data.filterAdvanced.fromFecha_ins)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_ins, 102)  >= '" + moment(data.filterAdvanced.fromFecha_ins).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_ins != 'undefined' && data.filterAdvanced.toFecha_ins)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_ins, 102)  <= '" + moment(data.filterAdvanced.toFecha_ins).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_ins != 'undefined' && data.filterAdvanced.fromHora_ins)
      || (typeof data.filterAdvanced.toHora_ins != 'undefined' && data.filterAdvanced.toHora_ins)) {
      if (typeof data.filterAdvanced.fromHora_ins != 'undefined' && data.filterAdvanced.fromHora_ins)
        condition += " and Crear_Reporte.Hora_ins >= '" + data.filterAdvanced.fromHora_ins + "'";

      if (typeof data.filterAdvanced.toHora_ins != 'undefined' && data.filterAdvanced.toHora_ins)
        condition += " and Crear_Reporte.Hora_ins <= '" + data.filterAdvanced.toHora_ins + "'";
    }
    if ((typeof data.filterAdvanced.Inspector != 'undefined' && data.filterAdvanced.Inspector)) {
      switch (data.filterAdvanced.InspectorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Inspector + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Inspector + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Inspector + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Inspector + "'";
          break;
      }
    } else if (data.filterAdvanced.InspectorMultiple != null && data.filterAdvanced.InspectorMultiple.length > 0) {
      var Inspectords = data.filterAdvanced.InspectorMultiple.join(",");
      condition += " AND Crear_Reporte.Inspector In (" + Inspectords + ")";
    }
    if ((typeof data.filterAdvanced.Resultado_ins != 'undefined' && data.filterAdvanced.Resultado_ins)) {
      switch (data.filterAdvanced.Resultado_insFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion LIKE '" + data.filterAdvanced.Resultado_ins + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion LIKE '%" + data.filterAdvanced.Resultado_ins + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion LIKE '%" + data.filterAdvanced.Resultado_ins + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion = '" + data.filterAdvanced.Resultado_ins + "'";
          break;
      }
    } else if (data.filterAdvanced.Resultado_insMultiple != null && data.filterAdvanced.Resultado_insMultiple.length > 0) {
      var Resultado_insds = data.filterAdvanced.Resultado_insMultiple.join(",");
      condition += " AND Crear_Reporte.Resultado_ins In (" + Resultado_insds + ")";
    }
    if ((typeof data.filterAdvanced.fromTiempo_ejecucion_Hrs_ins != 'undefined' && data.filterAdvanced.fromTiempo_ejecucion_Hrs_ins)
      || (typeof data.filterAdvanced.toTiempo_ejecucion_Hrs_ins != 'undefined' && data.filterAdvanced.toTiempo_ejecucion_Hrs_ins)) {
      if (typeof data.filterAdvanced.fromTiempo_ejecucion_Hrs_ins != 'undefined' && data.filterAdvanced.fromTiempo_ejecucion_Hrs_ins)
        condition += " AND Crear_Reporte.Tiempo_ejecucion_Hrs_ins >= " + data.filterAdvanced.fromTiempo_ejecucion_Hrs_ins;

      if (typeof data.filterAdvanced.toTiempo_ejecucion_Hrs_ins != 'undefined' && data.filterAdvanced.toTiempo_ejecucion_Hrs_ins)
        condition += " AND Crear_Reporte.Tiempo_ejecucion_Hrs_ins <= " + data.filterAdvanced.toTiempo_ejecucion_Hrs_ins;
    }
    switch (data.filterAdvanced.Observaciones_insFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Observaciones_ins LIKE '" + data.filterAdvanced.Observaciones_ins + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Observaciones_ins LIKE '%" + data.filterAdvanced.Observaciones_ins + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Observaciones_ins LIKE '%" + data.filterAdvanced.Observaciones_ins + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Observaciones_ins = '" + data.filterAdvanced.Observaciones_ins + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_pro != 'undefined' && data.filterAdvanced.fromFecha_pro)
      || (typeof data.filterAdvanced.toFecha_pro != 'undefined' && data.filterAdvanced.toFecha_pro)) {
      if (typeof data.filterAdvanced.fromFecha_pro != 'undefined' && data.filterAdvanced.fromFecha_pro)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_pro, 102)  >= '" + moment(data.filterAdvanced.fromFecha_pro).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_pro != 'undefined' && data.filterAdvanced.toFecha_pro)
        condition += " and CONVERT(VARCHAR(10), Crear_Reporte.Fecha_pro, 102)  <= '" + moment(data.filterAdvanced.toFecha_pro).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_pro != 'undefined' && data.filterAdvanced.fromHora_pro)
      || (typeof data.filterAdvanced.toHora_pro != 'undefined' && data.filterAdvanced.toHora_pro)) {
      if (typeof data.filterAdvanced.fromHora_pro != 'undefined' && data.filterAdvanced.fromHora_pro)
        condition += " and Crear_Reporte.Hora_pro >= '" + data.filterAdvanced.fromHora_pro + "'";

      if (typeof data.filterAdvanced.toHora_pro != 'undefined' && data.filterAdvanced.toHora_pro)
        condition += " and Crear_Reporte.Hora_pro <= '" + data.filterAdvanced.toHora_pro + "'";
    }
    if ((typeof data.filterAdvanced.Programador_de_mantenimiento != 'undefined' && data.filterAdvanced.Programador_de_mantenimiento)) {
      switch (data.filterAdvanced.Programador_de_mantenimientoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Programador_de_mantenimiento + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Programador_de_mantenimiento + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Programador_de_mantenimiento + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Programador_de_mantenimiento + "'";
          break;
      }
    } else if (data.filterAdvanced.Programador_de_mantenimientoMultiple != null && data.filterAdvanced.Programador_de_mantenimientoMultiple.length > 0) {
      var Programador_de_mantenimientods = data.filterAdvanced.Programador_de_mantenimientoMultiple.join(",");
      condition += " AND Crear_Reporte.Programador_de_mantenimiento In (" + Programador_de_mantenimientods + ")";
    }
    if ((typeof data.filterAdvanced.Resultado_pro != 'undefined' && data.filterAdvanced.Resultado_pro)) {
      switch (data.filterAdvanced.Resultado_proFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion LIKE '" + data.filterAdvanced.Resultado_pro + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion LIKE '%" + data.filterAdvanced.Resultado_pro + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion LIKE '%" + data.filterAdvanced.Resultado_pro + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Resultado_aprobacion_crear_reporte.Autorizacion = '" + data.filterAdvanced.Resultado_pro + "'";
          break;
      }
    } else if (data.filterAdvanced.Resultado_proMultiple != null && data.filterAdvanced.Resultado_proMultiple.length > 0) {
      var Resultado_prods = data.filterAdvanced.Resultado_proMultiple.join(",");
      condition += " AND Crear_Reporte.Resultado_pro In (" + Resultado_prods + ")";
    }
    if ((typeof data.filterAdvanced.fromTiempo_ejecucion_Hrs_pro != 'undefined' && data.filterAdvanced.fromTiempo_ejecucion_Hrs_pro)
      || (typeof data.filterAdvanced.toTiempo_ejecucion_Hrs_pro != 'undefined' && data.filterAdvanced.toTiempo_ejecucion_Hrs_pro)) {
      if (typeof data.filterAdvanced.fromTiempo_ejecucion_Hrs_pro != 'undefined' && data.filterAdvanced.fromTiempo_ejecucion_Hrs_pro)
        condition += " AND Crear_Reporte.Tiempo_ejecucion_Hrs_pro >= " + data.filterAdvanced.fromTiempo_ejecucion_Hrs_pro;

      if (typeof data.filterAdvanced.toTiempo_ejecucion_Hrs_pro != 'undefined' && data.filterAdvanced.toTiempo_ejecucion_Hrs_pro)
        condition += " AND Crear_Reporte.Tiempo_ejecucion_Hrs_pro <= " + data.filterAdvanced.toTiempo_ejecucion_Hrs_pro;
    }
    switch (data.filterAdvanced.Observaciones_proFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Crear_Reporte.Observaciones_pro LIKE '" + data.filterAdvanced.Observaciones_pro + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Crear_Reporte.Observaciones_pro LIKE '%" + data.filterAdvanced.Observaciones_pro + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Crear_Reporte.Observaciones_pro LIKE '%" + data.filterAdvanced.Observaciones_pro + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Crear_Reporte.Observaciones_pro = '" + data.filterAdvanced.Observaciones_pro + "'";
        break;
    }


    this.loadingSubject.next(true);
    let page = data.page + 1;
    this.service
      .listaSelAll(
        page * data.size - data.size + 1,
        page * data.size,
        condition,
        sort
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: any) => {
        data.styles = [];
        data.columns.forEach((column, index) => {
          if (column === 'Folio') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Crear_Reportes.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Crear_Reportes);
        this.totalSubject.next(result.RowCount);
      });
  }

  ShowFile(key: number | string) {
    const id = parseInt(key.toString());
    const file = this._file.getById(id).subscribe(
      data => {
        const url = this._file.url(data.File_Id.toString(), data.Description);
        window.open(url, '_blank');
      }
    );
  }

}
