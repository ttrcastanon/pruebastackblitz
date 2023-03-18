import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from '@angular/router'
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Solicitud_de_VueloService } from "src/app/api-services/Solicitud_de_Vuelo.service";
import { Solicitud_de_Vuelo } from "src/app/models/Solicitud_de_Vuelo";
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
import { Solicitud_de_VueloIndexRules } from 'src/app/shared/businessRules/Solicitud_de_Vuelo-index-rules';
import { DialogConfirmExportComponent } from "./../../../shared/views/dialogs/dialog-confirm-export/dialog-confirm-export.component";
import { Enumerations } from 'src/app/models/enumerations';
import _, { map } from 'underscore';
import { ExcelService } from "src/app/api-services/excel.service";
import * as momentJS from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogPrintFormatComponent } from './../../../shared/views/dialogs/dialog-print-format/dialog-print-format.component';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { Router } from '@angular/router';
import { SpartanService } from 'src/app/api-services/spartan.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-list-Solicitud_de_Vuelo",
  templateUrl: "./list-Solicitud_de_Vuelo.component.html",
  styleUrls: ["./list-Solicitud_de_Vuelo.component.scss"],
})
export class ListSolicitud_de_VueloComponent extends Solicitud_de_VueloIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  phase: any = 0;
  displayedColumns = [
    "acciones",
    "Folio",
    "Fecha_de_Solicitud",
    "Hora_de_Solicitud",
    "Solicitante",
    "Empresa_Solicitante",
    "Motivo_de_viaje",
    "Fecha_de_Salida",
    "Hora_de_Salida",
    "Fecha_de_Regreso",
    "Hora_de_Regreso",
    "Numero_de_Vuelo",
    "Ruta_de_Vuelo",
    "Observaciones",
    "Estatus",
    "Tiempo_de_Vuelo",
    "Tiempo_de_Espera",
    "Espera_SIN_Cargo",
    "Espera_CON_Cargo",
    "Pernoctas",
    // "Tiempo_de_Calzo",
    // "Internacional",
    "Direccion_fecha_autorizacion",
    "Direccion_Hora_Autorizacion",
    "Direccion_Usuario_Autorizacion",
    "Direccion_Resultado_Autorizacion",
    "Direccion_Motivo_Rechazo",
    "Presidencia_Fecha_Autorizacion",
    "Presidencia_Hora_Autorizacion",
    //"Vuelo_Reabierto",
    "Presidencia_Usuario_Autorizacion",
    //"Tramos",
    //"TuaNacionales",
    //"TuaInternacionales",
    "Presidencia_Resultado_Autorizacion",
    "Presidencia_motivo_rechazo",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Solicitud",
      "Hora_de_Solicitud",
      "Solicitante",
      "Empresa_Solicitante",
      "Motivo_de_viaje",
      "Fecha_de_Salida",
      "Hora_de_Salida",
      "Fecha_de_Regreso",
      "Hora_de_Regreso",
      "Numero_de_Vuelo",
      "Ruta_de_Vuelo",
      "Observaciones",
      "Estatus",
      "Tiempo_de_Vuelo",
      "Tiempo_de_Espera",
      "Espera_SIN_Cargo",
      "Espera_CON_Cargo",
      "Pernoctas",
      // "Tiempo_de_Calzo",
      // "Internacional",
      "Direccion_fecha_autorizacion",
      "Direccion_Hora_Autorizacion",
      "Direccion_Usuario_Autorizacion",
      "Direccion_Resultado_Autorizacion",
      "Direccion_Motivo_Rechazo",
      "Presidencia_Fecha_Autorizacion",
      "Presidencia_Hora_Autorizacion",
      //"Vuelo_Reabierto",
      "Presidencia_Usuario_Autorizacion",
      //"Tramos",
      //"TuaNacionales",
      //"TuaInternacionales",
      "Presidencia_Resultado_Autorizacion",
      "Presidencia_motivo_rechazo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Solicitud_filtro",
      "Hora_de_Solicitud_filtro",
      "Solicitante_filtro",
      "Empresa_Solicitante_filtro",
      "Motivo_de_viaje_filtro",
      "Fecha_de_Salida_filtro",
      "Hora_de_Salida_filtro",
      "Fecha_de_Regreso_filtro",
      "Hora_de_Regreso_filtro",
      "Numero_de_Vuelo_filtro",
      "Ruta_de_Vuelo_filtro",
      "Observaciones_filtro",
      "Estatus_filtro",
      "Tiempo_de_Vuelo_filtro",
      "Tiempo_de_Espera_filtro",
      "Espera_SIN_Cargo_filtro",
      "Espera_CON_Cargo_filtro",
      "Pernoctas_filtro",
      // "Tiempo_de_Calzo_filtro",
      // "Internacional_filtro",
      "Direccion_fecha_autorizacion_filtro",
      "Direccion_Hora_Autorizacion_filtro",
      "Direccion_Usuario_Autorizacion_filtro",
      "Direccion_Resultado_Autorizacion_filtro",
      "Direccion_Motivo_Rechazo_filtro",
      "Presidencia_Fecha_Autorizacion_filtro",
      "Presidencia_Hora_Autorizacion_filtro",
      //"Vuelo_Reabierto_filtro",
      "Presidencia_Usuario_Autorizacion_filtro",
      //"Tramos_filtro",
      //"TuaNacionales_filtro",
      //"TuaInternacionales_filtro",
      "Presidencia_Resultado_Autorizacion_filtro",
      "Presidencia_motivo_rechazo_filtro",

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
      Fecha_de_Solicitud: null,
      Hora_de_Solicitud: "",
      Solicitante: "",
      Empresa_Solicitante: "",
      Motivo_de_viaje: "",
      Fecha_de_Salida: null,
      Hora_de_Salida: "",
      Fecha_de_Regreso: null,
      Hora_de_Regreso: "",
      Numero_de_Vuelo: "",
      Ruta_de_Vuelo: "",
      Observaciones: "",
      Estatus: "",
      Tiempo_de_Vuelo: "",
      Tiempo_de_Espera: "",
      Espera_SIN_Cargo: "",
      Espera_CON_Cargo: "",
      Pernoctas: "",
      Tiempo_de_Calzo: "",
      Internacional: "",
      Direccion_fecha_autorizacion: null,
      Direccion_Hora_Autorizacion: "",
      Direccion_Usuario_Autorizacion: "",
      Direccion_Resultado_Autorizacion: "",
      Direccion_Motivo_Rechazo: "",
      Presidencia_Fecha_Autorizacion: null,
      Presidencia_Hora_Autorizacion: "",
      Vuelo_Reabierto: "",
      Presidencia_Usuario_Autorizacion: "",
      Tramos: "",
      TuaNacionales: "",
      TuaInternacionales: "",
      Presidencia_Resultado_Autorizacion: "",
      Presidencia_motivo_rechazo: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Solicitud: "",
      toFecha_de_Solicitud: "",
      fromHora_de_Solicitud: "",
      toHora_de_Solicitud: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      Empresa_SolicitanteFilter: "",
      Empresa_Solicitante: "",
      Empresa_SolicitanteMultiple: "",
      fromFecha_de_Salida: "",
      toFecha_de_Salida: "",
      fromHora_de_Salida: "",
      toHora_de_Salida: "",
      fromFecha_de_Regreso: "",
      toFecha_de_Regreso: "",
      fromHora_de_Regreso: "",
      toHora_de_Regreso: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromTiempo_de_Vuelo: "",
      toTiempo_de_Vuelo: "",
      fromTiempo_de_Espera: "",
      toTiempo_de_Espera: "",
      fromEspera_SIN_Cargo: "",
      toEspera_SIN_Cargo: "",
      fromEspera_CON_Cargo: "",
      toEspera_CON_Cargo: "",
      fromPernoctas: "",
      toPernoctas: "",
      fromTiempo_de_Calzo: "",
      toTiempo_de_Calzo: "",
      fromDireccion_fecha_autorizacion: "",
      toDireccion_fecha_autorizacion: "",
      fromDireccion_Hora_Autorizacion: "",
      toDireccion_Hora_Autorizacion: "",
      Direccion_Usuario_AutorizacionFilter: "",
      Direccion_Usuario_Autorizacion: "",
      Direccion_Usuario_AutorizacionMultiple: "",
      Direccion_Resultado_AutorizacionFilter: "",
      Direccion_Resultado_Autorizacion: "",
      Direccion_Resultado_AutorizacionMultiple: "",
      fromPresidencia_Fecha_Autorizacion: "",
      toPresidencia_Fecha_Autorizacion: "",
      fromPresidencia_Hora_Autorizacion: "",
      toPresidencia_Hora_Autorizacion: "",
      Presidencia_Usuario_AutorizacionFilter: "",
      Presidencia_Usuario_Autorizacion: "",
      Presidencia_Usuario_AutorizacionMultiple: "",
      fromTramos: "",
      toTramos: "",
      fromTuaNacionales: "",
      toTuaNacionales: "",
      fromTuaInternacionales: "",
      toTuaInternacionales: "",
      Presidencia_Resultado_AutorizacionFilter: "",
      Presidencia_Resultado_Autorizacion: "",
      Presidencia_Resultado_AutorizacionMultiple: "",

    }
  };

  dataSource: Solicitud_de_VueloDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Solicitud_de_VueloDataSource;
  dataClipboard: any;
  public isDisabled: boolean = false;

  constructor(
    private _Solicitud_de_VueloService: Solicitud_de_VueloService,
    public _dialog: MatDialog,
    private _messages: MessagesHelper,
    private _seguridad: SeguridadService,
    private _translate: TranslateService,
    public _file: SpartanFileService,
    public dialogo: MatDialog,
    private activateRoute: ActivatedRoute,
    private excelService: ExcelService,
    _user: SpartanUserService,
    private _SpartanService: SpartanService,
    private localStorageHelper: LocalStorageHelper,
    private route: Router, renderer: Renderer2
  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);
  }

  ngOnInit() {
    this.activateRoute.paramMap.subscribe(
      params => {
        this.phase = params.get('phase');
        if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") != this.phase) {
          this.localStorageHelper.setItemToLocalStorage("QueryParam", this.phase);
          this.ngOnInit();
        }
      });

    this.rulesBeforeCreationList();
    this.dataSource = new Solicitud_de_VueloDataSource(
      this._Solicitud_de_VueloService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_Vuelo)
      .subscribe((response) => {
        this.permisos = response;
      });

    if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == '10') {
      this.isDisabled = true;
    }
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
      )
      .subscribe();
    this.loadPaginatorTranslate();
  }

  ngAfterViewChecked() {
    this.rulesAfterViewChecked();
  }

  clearFilter() {
    this.listConfig.page = 0;
    this.listConfig.filter.Folio = "";
    this.listConfig.filter.Fecha_de_Solicitud = undefined;
    this.listConfig.filter.Hora_de_Solicitud = "";
    this.listConfig.filter.Solicitante = "";
    this.listConfig.filter.Empresa_Solicitante = "";
    this.listConfig.filter.Motivo_de_viaje = "";
    this.listConfig.filter.Fecha_de_Salida = undefined;
    this.listConfig.filter.Hora_de_Salida = "";
    this.listConfig.filter.Fecha_de_Regreso = undefined;
    this.listConfig.filter.Hora_de_Regreso = "";
    this.listConfig.filter.Numero_de_Vuelo = "";
    this.listConfig.filter.Ruta_de_Vuelo = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Tiempo_de_Vuelo = "";
    this.listConfig.filter.Tiempo_de_Espera = "";
    this.listConfig.filter.Espera_SIN_Cargo = "";
    this.listConfig.filter.Espera_CON_Cargo = "";
    this.listConfig.filter.Pernoctas = "";
    this.listConfig.filter.Tiempo_de_Calzo = "";
    this.listConfig.filter.Internacional = undefined;
    this.listConfig.filter.Direccion_fecha_autorizacion = undefined;
    this.listConfig.filter.Direccion_Hora_Autorizacion = "";
    this.listConfig.filter.Direccion_Usuario_Autorizacion = "";
    this.listConfig.filter.Direccion_Resultado_Autorizacion = "";
    this.listConfig.filter.Direccion_Motivo_Rechazo = "";
    this.listConfig.filter.Presidencia_Fecha_Autorizacion = undefined;
    this.listConfig.filter.Presidencia_Hora_Autorizacion = "";
    this.listConfig.filter.Vuelo_Reabierto = undefined;
    this.listConfig.filter.Presidencia_Usuario_Autorizacion = "";
    this.listConfig.filter.Tramos = "";
    this.listConfig.filter.TuaNacionales = "";
    this.listConfig.filter.TuaInternacionales = "";
    this.listConfig.filter.Presidencia_Resultado_Autorizacion = "";
    this.listConfig.filter.Presidencia_motivo_rechazo = "";

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

  rulesBeforeCreationList() {
    //rulesBeforeCreationList_ExecuteBusinessRulesInit

    //INICIA - BRID:5790 - WF:3 Rule List - Phase: 2 (Solicitar vuelo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 2) { this.brf.SetFilteronList(this.listConfig, " Solicitud_de_Vuelo.Estatus = 1 "); } else { }
    //TERMINA - BRID:5790


    //INICIA - BRID:5792 - WF:3 Rule List - Phase: 3 (Por Autorizar dirección) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 3) { this.brf.SetFilteronList(this.listConfig, " Solicitud_de_Vuelo.Estatus = 2 "); } else { }
    //TERMINA - BRID:5792


    //INICIA - BRID:5794 - WF:3 Rule List - Phase: 4 (No Autorizada por Dirección) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 4) {
      this.brf.SetFilteronList(this.listConfig, " Solicitud_De_Vuelo.Estatus=4 and (Solicitud_De_Vuelo.Solicitante=" + this.localStorageHelper.getItemFromLocalStorage('USERID') +
        " or( " + this.localStorageHelper.getItemFromLocalStorage('USERROLEID') + " in(9,11,12,10,31))) ");
    } else { }
    //TERMINA - BRID:5794


    //INICIA - BRID:5796 - WF:3 Rule List - Phase: 5 (Por Autorizar Presidencia) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 5) { this.brf.SetFilteronList(this.listConfig, " Solicitud_de_Vuelo.Estatus = 3 "); } else { }
    //TERMINA - BRID:5796


    //INICIA - BRID:5798 - WF:3 Rule List - Phase: 6 (No Autorizado) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 6) {
      this.brf.SetFilteronList(this.listConfig, " Solicitud_De_Vuelo.Estatus IN (4, 5) and (Solicitud_De_Vuelo.Solicitante=" +
        this.localStorageHelper.getItemFromLocalStorage('USERID') + " or( " + this.localStorageHelper.getItemFromLocalStorage('USERROLEID') + " in(9,11,12,10,30,31))) ");
    } else { }
    //TERMINA - BRID:5798


    //INICIA - BRID:5800 - WF:3 Rule List - Phase: 1 (Solicitar Vuelo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 1) {
      this.brf.SetFilteronList(this.listConfig, " Solicitud_De_Vuelo.Estatus in (1,2,3) and Solicitud_De_Vuelo.Solicitante="
        + this.localStorageHelper.getItemFromLocalStorage('USERID') + "	 ");
    } else { }
    //TERMINA - BRID:5800


    //INICIA - BRID:5802 - WF:3 Rule List - Phase: 7 (Autorizados) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 7) {
      this.brf.SetFilteronList(this.listConfig, " Solicitud_De_Vuelo.Estatus=6 and (Solicitud_De_Vuelo.Solicitante="
        + this.localStorageHelper.getItemFromLocalStorage('USERID') + " or (" + this.localStorageHelper.getItemFromLocalStorage('USERROLEID') + " in(9,12))) ");
    } else { }
    //TERMINA - BRID:5802


    //INICIA - BRID:5804 - WF:3 Rule List - Phase: 8 (En Proceso de Autorización) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 8) {
      this.brf.SetFilteronList(this.listConfig, "  Solicitud_De_Vuelo.Estatus in (2,3) and (Solicitud_De_Vuelo.Solicitante="
        + this.localStorageHelper.getItemFromLocalStorage('USERID') + " or( " + this.localStorageHelper.getItemFromLocalStorage('USERROLEID') + " in(12,11))) ");
    } else { }
    //TERMINA - BRID:5804


    //INICIA - BRID:5806 - WF:3 Rule List - Phase: 9 (Gestión de Vuelo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 9) { this.brf.SetFilteronList(this.listConfig, " 	Solicitud_De_Vuelo.Estatus in (2,3,4,6,10,12) "); } else { }
    //TERMINA - BRID:5806


    //INICIA - BRID:5808 - WF:3 Rule List - Phase: 10 (Vuelo Cerrado) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 10) { this.brf.SetFilteronList(this.listConfig, " Solicitud_De_Vuelo.Estatus = 9 "); } else { }
    //TERMINA - BRID:5808


    //INICIA - BRID:5810 - WF:3 Rule List - Phase: 11 (Cierre de Vuelo por Corregir) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 11) { this.brf.SetFilteronList(this.listConfig, " Solicitud_De_Vuelo.Estatus>=1	 "); } else { }
    //TERMINA - BRID:5810


    //INICIA - BRID:5812 - WF:3 Rule List - Phase: 12 (Cierre de Vuelo por Autorizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 12) { this.brf.SetFilteronList(this.listConfig, " Solicitud_De_Vuelo.Estatus>=1	 "); } else { }
    //TERMINA - BRID:5812

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

  remove(row: Solicitud_de_Vuelo) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Solicitud_de_VueloService
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
  ActionPrint(dataRow: Solicitud_de_Vuelo) {

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
      , 'Fecha de Solicitud'
      , 'Hora de Solicitud'
      , 'Solicitante'
      , 'Empresa Solicitante'
      , 'Motivo de viaje'
      , 'Fecha de Salida'
      , 'Hora de Salida'
      , 'Fecha de Regreso '
      , 'Hora de Regreso'
      , 'Número de Vuelo'
      , 'Ruta de Vuelo'
      , 'Observaciones'
      , 'Estatus'
      , 'Tiempo de Vuelo'
      , 'Tiempo de Espera'
      , 'Espera SIN Cargo'
      , 'Espera CON Cargo'
      , 'Pernoctas'
      , 'Fecha de autorización'
      , 'Hora de autorización'
      , 'Usuario que autoriza'
      , 'Resultado'
      , 'Observaciones Aerovics, equipo a utilizar y otras'
      , 'Fecha de autorización'
      , 'Hora de autorización'
      , 'Usuario que autoriza'
      , 'Resultado'
      , 'Observaciones'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.Fecha_de_Solicitud
        , x.Hora_de_Solicitud
        , x.Solicitante_Spartan_User.Name
        , x.Empresa_Solicitante_Cliente.Razon_Social
        , x.Motivo_de_viaje
        , x.Fecha_de_Salida
        , x.Hora_de_Salida
        , x.Fecha_de_Regreso
        , x.Hora_de_Regreso
        , x.Numero_de_Vuelo
        , x.Ruta_de_Vuelo
        , x.Observaciones
        , x.Estatus_Estatus_de_Solicitud_de_Vuelo.Descripcion
        , x.Tiempo_de_Vuelo
        , x.Tiempo_de_Espera
        , x.Espera_SIN_Cargo
        , x.Espera_CON_Cargo
        , x.Pernoctas
        , x.Direccion_fecha_autorizacion
        , x.Direccion_Hora_Autorizacion
        , x.Direccion_Usuario_Autorizacion_Spartan_User.Name
        , x.Direccion_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion
        , x.Direccion_Motivo_Rechazo
        , x.Presidencia_Fecha_Autorizacion
        , x.Presidencia_Hora_Autorizacion
        , x.Presidencia_Usuario_Autorizacion_Spartan_User.Name
        , x.Presidencia_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion
        , x.Presidencia_motivo_rechazo
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
    pdfMake.createPdf(pdfDefinition).download('Solicitud_de_Vuelo.pdf');
    console.log("AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA")

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
          this._Solicitud_de_VueloService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_Vuelos;
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
          this._Solicitud_de_VueloService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_Vuelos;
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
        'Fecha de Solicitud ': fields.Fecha_de_Solicitud ? momentJS(fields.Fecha_de_Solicitud).format('DD/MM/YYYY') : '',
        'Hora de Solicitud ': fields.Hora_de_Solicitud,
        'Solicitante ': fields.Solicitante_Spartan_User.Name,
        'Empresa Solicitante ': fields.Empresa_Solicitante_Cliente.Razon_Social,
        'Motivo de viaje ': fields.Motivo_de_viaje,
        'Fecha de Salida ': fields.Fecha_de_Salida ? momentJS(fields.Fecha_de_Salida).format('DD/MM/YYYY') : '',
        'Hora de Salida ': fields.Hora_de_Salida,
        'Fecha de Regreso  ': fields.Fecha_de_Regreso ? momentJS(fields.Fecha_de_Regreso).format('DD/MM/YYYY') : '',
        'Hora de Regreso ': fields.Hora_de_Regreso,
        'Número de Vuelo ': fields.Numero_de_Vuelo,
        'Ruta de Vuelo ': fields.Ruta_de_Vuelo,
        'Observaciones ': fields.Observaciones,
        'Estatus ': fields.Estatus_Estatus_de_Solicitud_de_Vuelo.Descripcion,
        'Tiempo de Vuelo ': fields.Tiempo_de_Vuelo,
        'Tiempo de Espera ': fields.Tiempo_de_Espera,
        'Espera SIN Cargo ': fields.Espera_SIN_Cargo,
        'Espera CON Cargo ': fields.Espera_CON_Cargo,
        'Pernoctas ': fields.Pernoctas,
        'Tiempo de Calzo ': fields.Tiempo_de_Calzo,
        'Internacional ': fields.Internacional ? 'SI' : 'NO',
        'Fecha de autorización ': fields.Direccion_fecha_autorizacion ? momentJS(fields.Direccion_fecha_autorizacion).format('DD/MM/YYYY') : '',
        'Hora de autorización ': fields.Direccion_Hora_Autorizacion,
        'Usuario que autoriza 1': fields.Direccion_Usuario_Autorizacion_Spartan_User.Name,
        'Resultado ': fields.Direccion_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion,
        'Observaciones Aerovics, equipo a utilizar y otras ': fields.Direccion_Motivo_Rechazo,
        'Fecha de autorización1 ': fields.Presidencia_Fecha_Autorizacion ? momentJS(fields.Presidencia_Fecha_Autorizacion).format('DD/MM/YYYY') : '',
        'Hora de autorización1 ': fields.Presidencia_Hora_Autorizacion,
        'Vuelo_Reabierto ': fields.Vuelo_Reabierto ? 'SI' : 'NO',
        'Usuario que autoriza 2': fields.Presidencia_Usuario_Autorizacion_Spartan_User.Name,
        'Tramos ': fields.Tramos,
        'TuaNacionales ': fields.TuaNacionales,
        'TuaInternacionales ': fields.TuaInternacionales,
        'Resultado 1': fields.Presidencia_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion,
        'Observaciones1': fields.Presidencia_motivo_rechazo,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Solicitud_de_Vuelo  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Fecha_de_Solicitud: x.Fecha_de_Solicitud,
      Hora_de_Solicitud: x.Hora_de_Solicitud,
      Solicitante: x.Solicitante_Spartan_User.Name,
      Empresa_Solicitante: x.Empresa_Solicitante_Cliente.Razon_Social,
      Motivo_de_viaje: x.Motivo_de_viaje,
      Fecha_de_Salida: x.Fecha_de_Salida,
      Hora_de_Salida: x.Hora_de_Salida,
      Fecha_de_Regreso: x.Fecha_de_Regreso,
      Hora_de_Regreso: x.Hora_de_Regreso,
      Numero_de_Vuelo: x.Numero_de_Vuelo,
      Ruta_de_Vuelo: x.Ruta_de_Vuelo,
      Observaciones: x.Observaciones,
      Estatus: x.Estatus_Estatus_de_Solicitud_de_Vuelo.Descripcion,
      Tiempo_de_Vuelo: x.Tiempo_de_Vuelo,
      Tiempo_de_Espera: x.Tiempo_de_Espera,
      Espera_SIN_Cargo: x.Espera_SIN_Cargo,
      Espera_CON_Cargo: x.Espera_CON_Cargo,
      Pernoctas: x.Pernoctas,
      Tiempo_de_Calzo: x.Tiempo_de_Calzo,
      Internacional: x.Internacional,
      Direccion_fecha_autorizacion: x.Direccion_fecha_autorizacion,
      Direccion_Hora_Autorizacion: x.Direccion_Hora_Autorizacion,
      Direccion_Usuario_Autorizacion: x.Direccion_Usuario_Autorizacion_Spartan_User.Name,
      Direccion_Resultado_Autorizacion: x.Direccion_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion,
      Direccion_Motivo_Rechazo: x.Direccion_Motivo_Rechazo,
      Presidencia_Fecha_Autorizacion: x.Presidencia_Fecha_Autorizacion,
      Presidencia_Hora_Autorizacion: x.Presidencia_Hora_Autorizacion,
      Vuelo_Reabierto: x.Vuelo_Reabierto,
      Presidencia_Usuario_Autorizacion: x.Presidencia_Usuario_Autorizacion_Spartan_User.Name,
      Tramos: x.Tramos,
      TuaNacionales: x.TuaNacionales,
      TuaInternacionales: x.TuaInternacionales,
      Presidencia_Resultado_Autorizacion: x.Presidencia_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion,
      Presidencia_motivo_rechazo: x.Presidencia_motivo_rechazo,

    }));

    this.excelService.exportToCsv(result, 'Solicitud_de_Vuelo', ['Folio', 'Fecha_de_Solicitud', 'Hora_de_Solicitud', 'Solicitante', 'Empresa_Solicitante', 'Motivo_de_viaje', 'Fecha_de_Salida', 'Hora_de_Salida', 'Fecha_de_Regreso', 'Hora_de_Regreso', 'Numero_de_Vuelo', 'Ruta_de_Vuelo', 'Observaciones', 'Estatus', 'Tiempo_de_Vuelo', 'Tiempo_de_Espera', 'Espera_SIN_Cargo', 'Espera_CON_Cargo', 'Pernoctas', 'Tiempo_de_Calzo', 'Internacional', 'Direccion_fecha_autorizacion', 'Direccion_Hora_Autorizacion', 'Direccion_Usuario_Autorizacion', 'Direccion_Resultado_Autorizacion', 'Direccion_Motivo_Rechazo', 'Presidencia_Fecha_Autorizacion', 'Presidencia_Hora_Autorizacion', 'Vuelo_Reabierto', 'Presidencia_Usuario_Autorizacion', 'Tramos', 'TuaNacionales', 'TuaInternacionales', 'Presidencia_Resultado_Autorizacion', 'Presidencia_motivo_rechazo']);
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
    template += '          <th>Fecha de Solicitud</th>';
    template += '          <th>Hora de Solicitud</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Empresa Solicitante</th>';
    template += '          <th>Motivo de viaje</th>';
    template += '          <th>Fecha de Salida</th>';
    template += '          <th>Hora de Salida</th>';
    template += '          <th>Fecha de Regreso </th>';
    template += '          <th>Hora de Regreso</th>';
    template += '          <th>Número de Vuelo</th>';
    template += '          <th>Ruta de Vuelo</th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Tiempo de Vuelo</th>';
    template += '          <th>Tiempo de Espera</th>';
    template += '          <th>Espera SIN Cargo</th>';
    template += '          <th>Espera CON Cargo</th>';
    template += '          <th>Pernoctas</th>';
    template += '          <th>Tiempo de Calzo</th>';
    template += '          <th>Internacional</th>';
    template += '          <th>Fecha de autorización</th>';
    template += '          <th>Hora de autorización</th>';
    template += '          <th>Usuario que autoriza</th>';
    template += '          <th>Resultado</th>';
    template += '          <th>Observaciones Aerovics, equipo a utilizar y otras</th>';
    template += '          <th>Vuelo Reabierto</th>';
    template += '          <th>Tramos</th>';
    template += '          <th>TuaNacionales</th>';
    template += '          <th>TuaInternacionales</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Fecha_de_Solicitud + '</td>';
      template += '          <td>' + element.Hora_de_Solicitud + '</td>';
      template += '          <td>' + element.Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Empresa_Solicitante_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Motivo_de_viaje + '</td>';
      template += '          <td>' + element.Fecha_de_Salida + '</td>';
      template += '          <td>' + element.Hora_de_Salida + '</td>';
      template += '          <td>' + element.Fecha_de_Regreso + '</td>';
      template += '          <td>' + element.Hora_de_Regreso + '</td>';
      template += '          <td>' + element.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Ruta_de_Vuelo + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Solicitud_de_Vuelo.Descripcion + '</td>';
      template += '          <td>' + element.Tiempo_de_Vuelo + '</td>';
      template += '          <td>' + element.Tiempo_de_Espera + '</td>';
      template += '          <td>' + element.Espera_SIN_Cargo + '</td>';
      template += '          <td>' + element.Espera_CON_Cargo + '</td>';
      template += '          <td>' + element.Pernoctas + '</td>';
      template += '          <td>' + element.Tiempo_de_Calzo + '</td>';
      template += '          <td>' + element.Internacional + '</td>';
      template += '          <td>' + element.Direccion_fecha_autorizacion + '</td>';
      template += '          <td>' + element.Direccion_Hora_Autorizacion + '</td>';
      template += '          <td>' + element.Direccion_Usuario_Autorizacion_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Direccion_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion + '</td>';
      template += '          <td>' + element.Direccion_Motivo_Rechazo + '</td>';
      template += '          <td>' + element.Presidencia_Fecha_Autorizacion + '</td>';
      template += '          <td>' + element.Presidencia_Hora_Autorizacion + '</td>';
      template += '          <td>' + element.Vuelo_Reabierto + '</td>';
      template += '          <td>' + element.Presidencia_Usuario_Autorizacion_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Tramos + '</td>';
      template += '          <td>' + element.TuaNacionales + '</td>';
      template += '          <td>' + element.TuaInternacionales + '</td>';
      template += '          <td>' + element.Presidencia_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion + '</td>';
      template += '          <td>' + element.Presidencia_motivo_rechazo + '</td>';

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
    template += '\t Fecha de Solicitud';
    template += '\t Hora de Solicitud';
    template += '\t Solicitante';
    template += '\t Empresa Solicitante';
    template += '\t Motivo de viaje';
    template += '\t Fecha de Salida';
    template += '\t Hora de Salida';
    template += '\t Fecha de Regreso ';
    template += '\t Hora de Regreso';
    template += '\t Número de Vuelo';
    template += '\t Ruta de Vuelo';
    template += '\t Observaciones';
    template += '\t Estatus';
    template += '\t Tiempo de Vuelo';
    template += '\t Tiempo de Espera';
    template += '\t Espera SIN Cargo';
    template += '\t Espera CON Cargo';
    template += '\t Pernoctas';
    template += '\t Tiempo de Calzo';
    template += '\t Internacional';
    template += '\t Fecha de autorización';
    template += '\t Hora de autorización';
    template += '\t Usuario que autoriza';
    template += '\t Resultado';
    template += '\t Observaciones Aerovics, equipo a utilizar y otras';
    template += '\t Vuelo Reabierto';
    template += '\t Tramos';
    template += '\t TuaNacionales';
    template += '\t TuaInternacionales';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.Fecha_de_Solicitud;
      template += '\t ' + element.Hora_de_Solicitud;
      template += '\t ' + element.Solicitante_Spartan_User.Name;
      template += '\t ' + element.Empresa_Solicitante_Cliente.Razon_Social;
      template += '\t ' + element.Motivo_de_viaje;
      template += '\t ' + element.Fecha_de_Salida;
      template += '\t ' + element.Hora_de_Salida;
      template += '\t ' + element.Fecha_de_Regreso;
      template += '\t ' + element.Hora_de_Regreso;
      template += '\t ' + element.Numero_de_Vuelo;
      template += '\t ' + element.Ruta_de_Vuelo;
      template += '\t ' + element.Observaciones;
      template += '\t ' + element.Estatus_Estatus_de_Solicitud_de_Vuelo.Descripcion;
      template += '\t ' + element.Tiempo_de_Vuelo;
      template += '\t ' + element.Tiempo_de_Espera;
      template += '\t ' + element.Espera_SIN_Cargo;
      template += '\t ' + element.Espera_CON_Cargo;
      template += '\t ' + element.Pernoctas;
      template += '\t ' + element.Tiempo_de_Calzo;
      template += '\t ' + element.Internacional;
      template += '\t ' + element.Direccion_fecha_autorizacion;
      template += '\t ' + element.Direccion_Hora_Autorizacion;
      template += '\t ' + element.Direccion_Usuario_Autorizacion_Spartan_User.Name;
      template += '\t ' + element.Direccion_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion;
      template += '\t ' + element.Direccion_Motivo_Rechazo;
      template += '\t ' + element.Presidencia_Fecha_Autorizacion;
      template += '\t ' + element.Presidencia_Hora_Autorizacion;
      template += '\t ' + element.Vuelo_Reabierto;
      template += '\t ' + element.Presidencia_Usuario_Autorizacion_Spartan_User.Name;
      template += '\t ' + element.Tramos;
      template += '\t ' + element.TuaNacionales;
      template += '\t ' + element.TuaInternacionales;
      template += '\t ' + element.Presidencia_Resultado_Autorizacion_Resultado_de_Autorizacion_de_Vuelo.Descripcion;
      template += '\t ' + element.Presidencia_motivo_rechazo;

      template += '\n';
    });

    return template;
  }

}

export class Solicitud_de_VueloDataSource implements DataSource<Solicitud_de_Vuelo>
{
  private subject = new BehaviorSubject<Solicitud_de_Vuelo[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Solicitud_de_VueloService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Solicitud_de_Vuelo[]> {
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
              const longest = result.Solicitud_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_Vuelos);
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
      condition += " and Solicitud_de_Vuelo.Folio = " + data.filter.Folio;
    if (data.filter.Fecha_de_Solicitud)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Fecha_de_Solicitud, 102)  = '" + moment(data.filter.Fecha_de_Solicitud).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Solicitud != "")
      condition += " and Solicitud_de_Vuelo.Hora_de_Solicitud = '" + data.filter.Hora_de_Solicitud + "'";
    if (data.filter.Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante + "%' ";
    if (data.filter.Empresa_Solicitante != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Empresa_Solicitante + "%' ";
    if (data.filter.Motivo_de_viaje != "")
      condition += " and Solicitud_de_Vuelo.Motivo_de_viaje like '%" + data.filter.Motivo_de_viaje + "%' ";
    if (data.filter.Fecha_de_Salida)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Fecha_de_Salida, 102)  = '" + moment(data.filter.Fecha_de_Salida).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Salida != "")
      condition += " and Solicitud_de_Vuelo.Hora_de_Salida = '" + data.filter.Hora_de_Salida + "'";
    if (data.filter.Fecha_de_Regreso)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Fecha_de_Regreso, 102)  = '" + moment(data.filter.Fecha_de_Regreso).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Regreso != "")
      condition += " and Solicitud_de_Vuelo.Hora_de_Regreso = '" + data.filter.Hora_de_Regreso + "'";
    if (data.filter.Numero_de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Numero_de_Vuelo + "%' ";
    if (data.filter.Ruta_de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Ruta_de_Vuelo like '%" + data.filter.Ruta_de_Vuelo + "%' ";
    if (data.filter.Observaciones != "")
      condition += " and Solicitud_de_Vuelo.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Solicitud_de_Vuelo.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Tiempo_de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Tiempo_de_Vuelo = '" + data.filter.Tiempo_de_Vuelo + "'";
    if (data.filter.Tiempo_de_Espera != "")
      condition += " and Solicitud_de_Vuelo.Tiempo_de_Espera = '" + data.filter.Tiempo_de_Espera + "'";
    if (data.filter.Espera_SIN_Cargo != "")
      condition += " and Solicitud_de_Vuelo.Espera_SIN_Cargo = '" + data.filter.Espera_SIN_Cargo + "'";
    if (data.filter.Espera_CON_Cargo != "")
      condition += " and Solicitud_de_Vuelo.Espera_CON_Cargo = '" + data.filter.Espera_CON_Cargo + "'";
    if (data.filter.Pernoctas != "")
      condition += " and Solicitud_de_Vuelo.Pernoctas = " + data.filter.Pernoctas;
    if (data.filter.Tiempo_de_Calzo != "")
      condition += " and Solicitud_de_Vuelo.Tiempo_de_Calzo = '" + data.filter.Tiempo_de_Calzo + "'";
    if (data.filter.Internacional && data.filter.Internacional != "2") {
      if (data.filter.Internacional == "0" || data.filter.Internacional == "") {
        condition += " and (Solicitud_de_Vuelo.Internacional = 0 or Solicitud_de_Vuelo.Internacional is null)";
      } else {
        condition += " and Solicitud_de_Vuelo.Internacional = 1";
      }
    }
    if (data.filter.Direccion_fecha_autorizacion)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Direccion_fecha_autorizacion, 102)  = '" + moment(data.filter.Direccion_fecha_autorizacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Direccion_Hora_Autorizacion != "")
      condition += " and Solicitud_de_Vuelo.Direccion_Hora_Autorizacion = '" + data.filter.Direccion_Hora_Autorizacion + "'";
    if (data.filter.Direccion_Usuario_Autorizacion != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Direccion_Usuario_Autorizacion + "%' ";
    if (data.filter.Direccion_Resultado_Autorizacion != "")
      condition += " and Resultado_de_Autorizacion_de_Vuelo.Descripcion like '%" + data.filter.Direccion_Resultado_Autorizacion + "%' ";
    if (data.filter.Direccion_Motivo_Rechazo != "")
      condition += " and Solicitud_de_Vuelo.Direccion_Motivo_Rechazo like '%" + data.filter.Direccion_Motivo_Rechazo + "%' ";
    if (data.filter.Presidencia_Fecha_Autorizacion)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Presidencia_Fecha_Autorizacion, 102)  = '" + moment(data.filter.Presidencia_Fecha_Autorizacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Presidencia_Hora_Autorizacion != "")
      condition += " and Solicitud_de_Vuelo.Presidencia_Hora_Autorizacion = '" + data.filter.Presidencia_Hora_Autorizacion + "'";
    if (data.filter.Vuelo_Reabierto && data.filter.Vuelo_Reabierto != "2") {
      if (data.filter.Vuelo_Reabierto == "0" || data.filter.Vuelo_Reabierto == "") {
        condition += " and (Solicitud_de_Vuelo.Vuelo_Reabierto = 0 or Solicitud_de_Vuelo.Vuelo_Reabierto is null)";
      } else {
        condition += " and Solicitud_de_Vuelo.Vuelo_Reabierto = 1";
      }
    }
    if (data.filter.Presidencia_Usuario_Autorizacion != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Presidencia_Usuario_Autorizacion + "%' ";
    if (data.filter.Tramos != "")
      condition += " and Solicitud_de_Vuelo.Tramos = " + data.filter.Tramos;
    if (data.filter.TuaNacionales != "")
      condition += " and Solicitud_de_Vuelo.TuaNacionales = " + data.filter.TuaNacionales;
    if (data.filter.TuaInternacionales != "")
      condition += " and Solicitud_de_Vuelo.TuaInternacionales = " + data.filter.TuaInternacionales;
    if (data.filter.Presidencia_Resultado_Autorizacion != "")
      condition += " and Resultado_de_Autorizacion_de_Vuelo.Descripcion like '%" + data.filter.Presidencia_Resultado_Autorizacion + "%' ";
    if (data.filter.Presidencia_motivo_rechazo != "")
      condition += " and Solicitud_de_Vuelo.Presidencia_motivo_rechazo like '%" + data.filter.Presidencia_motivo_rechazo + "%' ";

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
        sort = " Solicitud_de_Vuelo.Folio " + data.sortDirecction;
        break;
      case "Fecha_de_Solicitud":
        sort = " Solicitud_de_Vuelo.Fecha_de_Solicitud " + data.sortDirecction;
        break;
      case "Hora_de_Solicitud":
        sort = " Solicitud_de_Vuelo.Hora_de_Solicitud " + data.sortDirecction;
        break;
      case "Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Empresa_Solicitante":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Motivo_de_viaje":
        sort = " Solicitud_de_Vuelo.Motivo_de_viaje " + data.sortDirecction;
        break;
      case "Fecha_de_Salida":
        sort = " Solicitud_de_Vuelo.Fecha_de_Salida " + data.sortDirecction;
        break;
      case "Hora_de_Salida":
        sort = " Solicitud_de_Vuelo.Hora_de_Salida " + data.sortDirecction;
        break;
      case "Fecha_de_Regreso":
        sort = " Solicitud_de_Vuelo.Fecha_de_Regreso " + data.sortDirecction;
        break;
      case "Hora_de_Regreso":
        sort = " Solicitud_de_Vuelo.Hora_de_Regreso " + data.sortDirecction;
        break;
      case "Numero_de_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Ruta_de_Vuelo":
        sort = " Solicitud_de_Vuelo.Ruta_de_Vuelo " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Solicitud_de_Vuelo.Observaciones " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Solicitud_de_Vuelo.Descripcion " + data.sortDirecction;
        break;
      case "Tiempo_de_Vuelo":
        sort = " Solicitud_de_Vuelo.Tiempo_de_Vuelo " + data.sortDirecction;
        break;
      case "Tiempo_de_Espera":
        sort = " Solicitud_de_Vuelo.Tiempo_de_Espera " + data.sortDirecction;
        break;
      case "Espera_SIN_Cargo":
        sort = " Solicitud_de_Vuelo.Espera_SIN_Cargo " + data.sortDirecction;
        break;
      case "Espera_CON_Cargo":
        sort = " Solicitud_de_Vuelo.Espera_CON_Cargo " + data.sortDirecction;
        break;
      case "Pernoctas":
        sort = " Solicitud_de_Vuelo.Pernoctas " + data.sortDirecction;
        break;
      case "Tiempo_de_Calzo":
        sort = " Solicitud_de_Vuelo.Tiempo_de_Calzo " + data.sortDirecction;
        break;
      case "Internacional":
        sort = " Solicitud_de_Vuelo.Internacional " + data.sortDirecction;
        break;
      case "Direccion_fecha_autorizacion":
        sort = " Solicitud_de_Vuelo.Direccion_fecha_autorizacion " + data.sortDirecction;
        break;
      case "Direccion_Hora_Autorizacion":
        sort = " Solicitud_de_Vuelo.Direccion_Hora_Autorizacion " + data.sortDirecction;
        break;
      case "Direccion_Usuario_Autorizacion":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Direccion_Resultado_Autorizacion":
        sort = " Resultado_de_Autorizacion_de_Vuelo.Descripcion " + data.sortDirecction;
        break;
      case "Direccion_Motivo_Rechazo":
        sort = " Solicitud_de_Vuelo.Direccion_Motivo_Rechazo " + data.sortDirecction;
        break;
      case "Presidencia_Fecha_Autorizacion":
        sort = " Solicitud_de_Vuelo.Presidencia_Fecha_Autorizacion " + data.sortDirecction;
        break;
      case "Presidencia_Hora_Autorizacion":
        sort = " Solicitud_de_Vuelo.Presidencia_Hora_Autorizacion " + data.sortDirecction;
        break;
      case "Vuelo_Reabierto":
        sort = " Solicitud_de_Vuelo.Vuelo_Reabierto " + data.sortDirecction;
        break;
      case "Presidencia_Usuario_Autorizacion":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Tramos":
        sort = " Solicitud_de_Vuelo.Tramos " + data.sortDirecction;
        break;
      case "TuaNacionales":
        sort = " Solicitud_de_Vuelo.TuaNacionales " + data.sortDirecction;
        break;
      case "TuaInternacionales":
        sort = " Solicitud_de_Vuelo.TuaInternacionales " + data.sortDirecction;
        break;
      case "Presidencia_Resultado_Autorizacion":
        sort = " Resultado_de_Autorizacion_de_Vuelo.Descripcion " + data.sortDirecction;
        break;
      case "Presidencia_motivo_rechazo":
        sort = " Solicitud_de_Vuelo.Presidencia_motivo_rechazo " + data.sortDirecction;
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
        condition += " AND Solicitud_de_Vuelo.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Solicitud_de_Vuelo.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_Solicitud)
      || (typeof data.filterAdvanced.toFecha_de_Solicitud != 'undefined' && data.filterAdvanced.toFecha_de_Solicitud)) {
      if (typeof data.filterAdvanced.fromFecha_de_Solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_Solicitud)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Fecha_de_Solicitud, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Solicitud).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Solicitud != 'undefined' && data.filterAdvanced.toFecha_de_Solicitud)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Fecha_de_Solicitud, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Solicitud).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Solicitud != 'undefined' && data.filterAdvanced.fromHora_de_Solicitud)
      || (typeof data.filterAdvanced.toHora_de_Solicitud != 'undefined' && data.filterAdvanced.toHora_de_Solicitud)) {
      if (typeof data.filterAdvanced.fromHora_de_Solicitud != 'undefined' && data.filterAdvanced.fromHora_de_Solicitud)
        condition += " and Solicitud_de_Vuelo.Hora_de_Solicitud >= '" + data.filterAdvanced.fromHora_de_Solicitud + "'";

      if (typeof data.filterAdvanced.toHora_de_Solicitud != 'undefined' && data.filterAdvanced.toHora_de_Solicitud)
        condition += " and Solicitud_de_Vuelo.Hora_de_Solicitud <= '" + data.filterAdvanced.toHora_de_Solicitud + "'";
    }
    if ((typeof data.filterAdvanced.Solicitante != 'undefined' && data.filterAdvanced.Solicitante)) {
      switch (data.filterAdvanced.SolicitanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Solicitante + "'";
          break;
      }
    } else if (data.filterAdvanced.SolicitanteMultiple != null && data.filterAdvanced.SolicitanteMultiple.length > 0) {
      var Solicitanteds = data.filterAdvanced.SolicitanteMultiple.join(",");
      condition += " AND Solicitud_de_Vuelo.Solicitante In (" + Solicitanteds + ")";
    }
    if ((typeof data.filterAdvanced.Empresa_Solicitante != 'undefined' && data.filterAdvanced.Empresa_Solicitante)) {
      switch (data.filterAdvanced.Empresa_SolicitanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.Empresa_Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Empresa_Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Empresa_Solicitante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.Empresa_Solicitante + "'";
          break;
      }
    } else if (data.filterAdvanced.Empresa_SolicitanteMultiple != null && data.filterAdvanced.Empresa_SolicitanteMultiple.length > 0) {
      var Empresa_Solicitanteds = data.filterAdvanced.Empresa_SolicitanteMultiple.join(",");
      condition += " AND Solicitud_de_Vuelo.Empresa_Solicitante In (" + Empresa_Solicitanteds + ")";
    }
    switch (data.filterAdvanced.Motivo_de_viajeFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Vuelo.Motivo_de_viaje LIKE '" + data.filterAdvanced.Motivo_de_viaje + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Vuelo.Motivo_de_viaje LIKE '%" + data.filterAdvanced.Motivo_de_viaje + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Vuelo.Motivo_de_viaje LIKE '%" + data.filterAdvanced.Motivo_de_viaje + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Vuelo.Motivo_de_viaje = '" + data.filterAdvanced.Motivo_de_viaje + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Salida != 'undefined' && data.filterAdvanced.fromFecha_de_Salida)
      || (typeof data.filterAdvanced.toFecha_de_Salida != 'undefined' && data.filterAdvanced.toFecha_de_Salida)) {
      if (typeof data.filterAdvanced.fromFecha_de_Salida != 'undefined' && data.filterAdvanced.fromFecha_de_Salida)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Fecha_de_Salida, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Salida).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Salida != 'undefined' && data.filterAdvanced.toFecha_de_Salida)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Fecha_de_Salida, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Salida).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Salida != 'undefined' && data.filterAdvanced.fromHora_de_Salida)
      || (typeof data.filterAdvanced.toHora_de_Salida != 'undefined' && data.filterAdvanced.toHora_de_Salida)) {
      if (typeof data.filterAdvanced.fromHora_de_Salida != 'undefined' && data.filterAdvanced.fromHora_de_Salida)
        condition += " and Solicitud_de_Vuelo.Hora_de_Salida >= '" + data.filterAdvanced.fromHora_de_Salida + "'";

      if (typeof data.filterAdvanced.toHora_de_Salida != 'undefined' && data.filterAdvanced.toHora_de_Salida)
        condition += " and Solicitud_de_Vuelo.Hora_de_Salida <= '" + data.filterAdvanced.toHora_de_Salida + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Regreso != 'undefined' && data.filterAdvanced.fromFecha_de_Regreso)
      || (typeof data.filterAdvanced.toFecha_de_Regreso != 'undefined' && data.filterAdvanced.toFecha_de_Regreso)) {
      if (typeof data.filterAdvanced.fromFecha_de_Regreso != 'undefined' && data.filterAdvanced.fromFecha_de_Regreso)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Fecha_de_Regreso, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Regreso).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Regreso != 'undefined' && data.filterAdvanced.toFecha_de_Regreso)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Fecha_de_Regreso, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Regreso).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Regreso != 'undefined' && data.filterAdvanced.fromHora_de_Regreso)
      || (typeof data.filterAdvanced.toHora_de_Regreso != 'undefined' && data.filterAdvanced.toHora_de_Regreso)) {
      if (typeof data.filterAdvanced.fromHora_de_Regreso != 'undefined' && data.filterAdvanced.fromHora_de_Regreso)
        condition += " and Solicitud_de_Vuelo.Hora_de_Regreso >= '" + data.filterAdvanced.fromHora_de_Regreso + "'";

      if (typeof data.filterAdvanced.toHora_de_Regreso != 'undefined' && data.filterAdvanced.toHora_de_Regreso)
        condition += " and Solicitud_de_Vuelo.Hora_de_Regreso <= '" + data.filterAdvanced.toHora_de_Regreso + "'";
    }
    switch (data.filterAdvanced.Numero_de_VueloFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.Numero_de_Vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Numero_de_Vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Numero_de_Vuelo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.Numero_de_Vuelo + "'";
        break;
    }
    switch (data.filterAdvanced.Ruta_de_VueloFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Vuelo.Ruta_de_Vuelo LIKE '" + data.filterAdvanced.Ruta_de_Vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Vuelo.Ruta_de_Vuelo LIKE '%" + data.filterAdvanced.Ruta_de_Vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Vuelo.Ruta_de_Vuelo LIKE '%" + data.filterAdvanced.Ruta_de_Vuelo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Vuelo.Ruta_de_Vuelo = '" + data.filterAdvanced.Ruta_de_Vuelo + "'";
        break;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Vuelo.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Vuelo.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Vuelo.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Vuelo.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Solicitud_de_Vuelo.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Solicitud_de_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Solicitud_de_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Solicitud_de_Vuelo.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Solicitud_de_Vuelo.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.fromTiempo_de_Vuelo)
      || (typeof data.filterAdvanced.toTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.toTiempo_de_Vuelo)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.fromTiempo_de_Vuelo)
        condition += " and Solicitud_de_Vuelo.Tiempo_de_Vuelo >= '" + data.filterAdvanced.fromTiempo_de_Vuelo + "'";

      if (typeof data.filterAdvanced.toTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.toTiempo_de_Vuelo)
        condition += " and Solicitud_de_Vuelo.Tiempo_de_Vuelo <= '" + data.filterAdvanced.toTiempo_de_Vuelo + "'";
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Espera != 'undefined' && data.filterAdvanced.fromTiempo_de_Espera)
      || (typeof data.filterAdvanced.toTiempo_de_Espera != 'undefined' && data.filterAdvanced.toTiempo_de_Espera)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Espera != 'undefined' && data.filterAdvanced.fromTiempo_de_Espera)
        condition += " and Solicitud_de_Vuelo.Tiempo_de_Espera >= '" + data.filterAdvanced.fromTiempo_de_Espera + "'";

      if (typeof data.filterAdvanced.toTiempo_de_Espera != 'undefined' && data.filterAdvanced.toTiempo_de_Espera)
        condition += " and Solicitud_de_Vuelo.Tiempo_de_Espera <= '" + data.filterAdvanced.toTiempo_de_Espera + "'";
    }
    if ((typeof data.filterAdvanced.fromEspera_SIN_Cargo != 'undefined' && data.filterAdvanced.fromEspera_SIN_Cargo)
      || (typeof data.filterAdvanced.toEspera_SIN_Cargo != 'undefined' && data.filterAdvanced.toEspera_SIN_Cargo)) {
      if (typeof data.filterAdvanced.fromEspera_SIN_Cargo != 'undefined' && data.filterAdvanced.fromEspera_SIN_Cargo)
        condition += " and Solicitud_de_Vuelo.Espera_SIN_Cargo >= '" + data.filterAdvanced.fromEspera_SIN_Cargo + "'";

      if (typeof data.filterAdvanced.toEspera_SIN_Cargo != 'undefined' && data.filterAdvanced.toEspera_SIN_Cargo)
        condition += " and Solicitud_de_Vuelo.Espera_SIN_Cargo <= '" + data.filterAdvanced.toEspera_SIN_Cargo + "'";
    }
    if ((typeof data.filterAdvanced.fromEspera_CON_Cargo != 'undefined' && data.filterAdvanced.fromEspera_CON_Cargo)
      || (typeof data.filterAdvanced.toEspera_CON_Cargo != 'undefined' && data.filterAdvanced.toEspera_CON_Cargo)) {
      if (typeof data.filterAdvanced.fromEspera_CON_Cargo != 'undefined' && data.filterAdvanced.fromEspera_CON_Cargo)
        condition += " and Solicitud_de_Vuelo.Espera_CON_Cargo >= '" + data.filterAdvanced.fromEspera_CON_Cargo + "'";

      if (typeof data.filterAdvanced.toEspera_CON_Cargo != 'undefined' && data.filterAdvanced.toEspera_CON_Cargo)
        condition += " and Solicitud_de_Vuelo.Espera_CON_Cargo <= '" + data.filterAdvanced.toEspera_CON_Cargo + "'";
    }
    if ((typeof data.filterAdvanced.fromPernoctas != 'undefined' && data.filterAdvanced.fromPernoctas)
      || (typeof data.filterAdvanced.toPernoctas != 'undefined' && data.filterAdvanced.toPernoctas)) {
      if (typeof data.filterAdvanced.fromPernoctas != 'undefined' && data.filterAdvanced.fromPernoctas)
        condition += " AND Solicitud_de_Vuelo.Pernoctas >= " + data.filterAdvanced.fromPernoctas;

      if (typeof data.filterAdvanced.toPernoctas != 'undefined' && data.filterAdvanced.toPernoctas)
        condition += " AND Solicitud_de_Vuelo.Pernoctas <= " + data.filterAdvanced.toPernoctas;
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Calzo != 'undefined' && data.filterAdvanced.fromTiempo_de_Calzo)
      || (typeof data.filterAdvanced.toTiempo_de_Calzo != 'undefined' && data.filterAdvanced.toTiempo_de_Calzo)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Calzo != 'undefined' && data.filterAdvanced.fromTiempo_de_Calzo)
        condition += " and Solicitud_de_Vuelo.Tiempo_de_Calzo >= '" + data.filterAdvanced.fromTiempo_de_Calzo + "'";

      if (typeof data.filterAdvanced.toTiempo_de_Calzo != 'undefined' && data.filterAdvanced.toTiempo_de_Calzo)
        condition += " and Solicitud_de_Vuelo.Tiempo_de_Calzo <= '" + data.filterAdvanced.toTiempo_de_Calzo + "'";
    }
    if ((typeof data.filterAdvanced.fromDireccion_fecha_autorizacion != 'undefined' && data.filterAdvanced.fromDireccion_fecha_autorizacion)
      || (typeof data.filterAdvanced.toDireccion_fecha_autorizacion != 'undefined' && data.filterAdvanced.toDireccion_fecha_autorizacion)) {
      if (typeof data.filterAdvanced.fromDireccion_fecha_autorizacion != 'undefined' && data.filterAdvanced.fromDireccion_fecha_autorizacion)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Direccion_fecha_autorizacion, 102)  >= '" + moment(data.filterAdvanced.fromDireccion_fecha_autorizacion).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toDireccion_fecha_autorizacion != 'undefined' && data.filterAdvanced.toDireccion_fecha_autorizacion)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Direccion_fecha_autorizacion, 102)  <= '" + moment(data.filterAdvanced.toDireccion_fecha_autorizacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromDireccion_Hora_Autorizacion != 'undefined' && data.filterAdvanced.fromDireccion_Hora_Autorizacion)
      || (typeof data.filterAdvanced.toDireccion_Hora_Autorizacion != 'undefined' && data.filterAdvanced.toDireccion_Hora_Autorizacion)) {
      if (typeof data.filterAdvanced.fromDireccion_Hora_Autorizacion != 'undefined' && data.filterAdvanced.fromDireccion_Hora_Autorizacion)
        condition += " and Solicitud_de_Vuelo.Direccion_Hora_Autorizacion >= '" + data.filterAdvanced.fromDireccion_Hora_Autorizacion + "'";

      if (typeof data.filterAdvanced.toDireccion_Hora_Autorizacion != 'undefined' && data.filterAdvanced.toDireccion_Hora_Autorizacion)
        condition += " and Solicitud_de_Vuelo.Direccion_Hora_Autorizacion <= '" + data.filterAdvanced.toDireccion_Hora_Autorizacion + "'";
    }
    if ((typeof data.filterAdvanced.Direccion_Usuario_Autorizacion != 'undefined' && data.filterAdvanced.Direccion_Usuario_Autorizacion)) {
      switch (data.filterAdvanced.Direccion_Usuario_AutorizacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Direccion_Usuario_Autorizacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Direccion_Usuario_Autorizacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Direccion_Usuario_Autorizacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Direccion_Usuario_Autorizacion + "'";
          break;
      }
    } else if (data.filterAdvanced.Direccion_Usuario_AutorizacionMultiple != null && data.filterAdvanced.Direccion_Usuario_AutorizacionMultiple.length > 0) {
      var Direccion_Usuario_Autorizacionds = data.filterAdvanced.Direccion_Usuario_AutorizacionMultiple.join(",");
      condition += " AND Solicitud_de_Vuelo.Direccion_Usuario_Autorizacion In (" + Direccion_Usuario_Autorizacionds + ")";
    }
    if ((typeof data.filterAdvanced.Direccion_Resultado_Autorizacion != 'undefined' && data.filterAdvanced.Direccion_Resultado_Autorizacion)) {
      switch (data.filterAdvanced.Direccion_Resultado_AutorizacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Resultado_de_Autorizacion_de_Vuelo.Descripcion LIKE '" + data.filterAdvanced.Direccion_Resultado_Autorizacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Resultado_de_Autorizacion_de_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Direccion_Resultado_Autorizacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Resultado_de_Autorizacion_de_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Direccion_Resultado_Autorizacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Resultado_de_Autorizacion_de_Vuelo.Descripcion = '" + data.filterAdvanced.Direccion_Resultado_Autorizacion + "'";
          break;
      }
    } else if (data.filterAdvanced.Direccion_Resultado_AutorizacionMultiple != null && data.filterAdvanced.Direccion_Resultado_AutorizacionMultiple.length > 0) {
      var Direccion_Resultado_Autorizacionds = data.filterAdvanced.Direccion_Resultado_AutorizacionMultiple.join(",");
      condition += " AND Solicitud_de_Vuelo.Direccion_Resultado_Autorizacion In (" + Direccion_Resultado_Autorizacionds + ")";
    }
    switch (data.filterAdvanced.Direccion_Motivo_RechazoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Vuelo.Direccion_Motivo_Rechazo LIKE '" + data.filterAdvanced.Direccion_Motivo_Rechazo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Vuelo.Direccion_Motivo_Rechazo LIKE '%" + data.filterAdvanced.Direccion_Motivo_Rechazo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Vuelo.Direccion_Motivo_Rechazo LIKE '%" + data.filterAdvanced.Direccion_Motivo_Rechazo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Vuelo.Direccion_Motivo_Rechazo = '" + data.filterAdvanced.Direccion_Motivo_Rechazo + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromPresidencia_Fecha_Autorizacion != 'undefined' && data.filterAdvanced.fromPresidencia_Fecha_Autorizacion)
      || (typeof data.filterAdvanced.toPresidencia_Fecha_Autorizacion != 'undefined' && data.filterAdvanced.toPresidencia_Fecha_Autorizacion)) {
      if (typeof data.filterAdvanced.fromPresidencia_Fecha_Autorizacion != 'undefined' && data.filterAdvanced.fromPresidencia_Fecha_Autorizacion)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Presidencia_Fecha_Autorizacion, 102)  >= '" + moment(data.filterAdvanced.fromPresidencia_Fecha_Autorizacion).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toPresidencia_Fecha_Autorizacion != 'undefined' && data.filterAdvanced.toPresidencia_Fecha_Autorizacion)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Vuelo.Presidencia_Fecha_Autorizacion, 102)  <= '" + moment(data.filterAdvanced.toPresidencia_Fecha_Autorizacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromPresidencia_Hora_Autorizacion != 'undefined' && data.filterAdvanced.fromPresidencia_Hora_Autorizacion)
      || (typeof data.filterAdvanced.toPresidencia_Hora_Autorizacion != 'undefined' && data.filterAdvanced.toPresidencia_Hora_Autorizacion)) {
      if (typeof data.filterAdvanced.fromPresidencia_Hora_Autorizacion != 'undefined' && data.filterAdvanced.fromPresidencia_Hora_Autorizacion)
        condition += " and Solicitud_de_Vuelo.Presidencia_Hora_Autorizacion >= '" + data.filterAdvanced.fromPresidencia_Hora_Autorizacion + "'";

      if (typeof data.filterAdvanced.toPresidencia_Hora_Autorizacion != 'undefined' && data.filterAdvanced.toPresidencia_Hora_Autorizacion)
        condition += " and Solicitud_de_Vuelo.Presidencia_Hora_Autorizacion <= '" + data.filterAdvanced.toPresidencia_Hora_Autorizacion + "'";
    }
    if ((typeof data.filterAdvanced.Presidencia_Usuario_Autorizacion != 'undefined' && data.filterAdvanced.Presidencia_Usuario_Autorizacion)) {
      switch (data.filterAdvanced.Presidencia_Usuario_AutorizacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Presidencia_Usuario_Autorizacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Presidencia_Usuario_Autorizacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Presidencia_Usuario_Autorizacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Presidencia_Usuario_Autorizacion + "'";
          break;
      }
    } else if (data.filterAdvanced.Presidencia_Usuario_AutorizacionMultiple != null && data.filterAdvanced.Presidencia_Usuario_AutorizacionMultiple.length > 0) {
      var Presidencia_Usuario_Autorizacionds = data.filterAdvanced.Presidencia_Usuario_AutorizacionMultiple.join(",");
      condition += " AND Solicitud_de_Vuelo.Presidencia_Usuario_Autorizacion In (" + Presidencia_Usuario_Autorizacionds + ")";
    }
    if ((typeof data.filterAdvanced.fromTramos != 'undefined' && data.filterAdvanced.fromTramos)
      || (typeof data.filterAdvanced.toTramos != 'undefined' && data.filterAdvanced.toTramos)) {
      if (typeof data.filterAdvanced.fromTramos != 'undefined' && data.filterAdvanced.fromTramos)
        condition += " AND Solicitud_de_Vuelo.Tramos >= " + data.filterAdvanced.fromTramos;

      if (typeof data.filterAdvanced.toTramos != 'undefined' && data.filterAdvanced.toTramos)
        condition += " AND Solicitud_de_Vuelo.Tramos <= " + data.filterAdvanced.toTramos;
    }
    if ((typeof data.filterAdvanced.fromTuaNacionales != 'undefined' && data.filterAdvanced.fromTuaNacionales)
      || (typeof data.filterAdvanced.toTuaNacionales != 'undefined' && data.filterAdvanced.toTuaNacionales)) {
      if (typeof data.filterAdvanced.fromTuaNacionales != 'undefined' && data.filterAdvanced.fromTuaNacionales)
        condition += " AND Solicitud_de_Vuelo.TuaNacionales >= " + data.filterAdvanced.fromTuaNacionales;

      if (typeof data.filterAdvanced.toTuaNacionales != 'undefined' && data.filterAdvanced.toTuaNacionales)
        condition += " AND Solicitud_de_Vuelo.TuaNacionales <= " + data.filterAdvanced.toTuaNacionales;
    }
    if ((typeof data.filterAdvanced.fromTuaInternacionales != 'undefined' && data.filterAdvanced.fromTuaInternacionales)
      || (typeof data.filterAdvanced.toTuaInternacionales != 'undefined' && data.filterAdvanced.toTuaInternacionales)) {
      if (typeof data.filterAdvanced.fromTuaInternacionales != 'undefined' && data.filterAdvanced.fromTuaInternacionales)
        condition += " AND Solicitud_de_Vuelo.TuaInternacionales >= " + data.filterAdvanced.fromTuaInternacionales;

      if (typeof data.filterAdvanced.toTuaInternacionales != 'undefined' && data.filterAdvanced.toTuaInternacionales)
        condition += " AND Solicitud_de_Vuelo.TuaInternacionales <= " + data.filterAdvanced.toTuaInternacionales;
    }
    if ((typeof data.filterAdvanced.Presidencia_Resultado_Autorizacion != 'undefined' && data.filterAdvanced.Presidencia_Resultado_Autorizacion)) {
      switch (data.filterAdvanced.Presidencia_Resultado_AutorizacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Resultado_de_Autorizacion_de_Vuelo.Descripcion LIKE '" + data.filterAdvanced.Presidencia_Resultado_Autorizacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Resultado_de_Autorizacion_de_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Presidencia_Resultado_Autorizacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Resultado_de_Autorizacion_de_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Presidencia_Resultado_Autorizacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Resultado_de_Autorizacion_de_Vuelo.Descripcion = '" + data.filterAdvanced.Presidencia_Resultado_Autorizacion + "'";
          break;
      }
    } else if (data.filterAdvanced.Presidencia_Resultado_AutorizacionMultiple != null && data.filterAdvanced.Presidencia_Resultado_AutorizacionMultiple.length > 0) {
      var Presidencia_Resultado_Autorizacionds = data.filterAdvanced.Presidencia_Resultado_AutorizacionMultiple.join(",");
      condition += " AND Solicitud_de_Vuelo.Presidencia_Resultado_Autorizacion In (" + Presidencia_Resultado_Autorizacionds + ")";
    }
    switch (data.filterAdvanced.Presidencia_motivo_rechazoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Vuelo.Presidencia_motivo_rechazo LIKE '" + data.filterAdvanced.Presidencia_motivo_rechazo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Vuelo.Presidencia_motivo_rechazo LIKE '%" + data.filterAdvanced.Presidencia_motivo_rechazo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Vuelo.Presidencia_motivo_rechazo LIKE '%" + data.filterAdvanced.Presidencia_motivo_rechazo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Vuelo.Presidencia_motivo_rechazo = '" + data.filterAdvanced.Presidencia_motivo_rechazo + "'";
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
              const longest = result.Solicitud_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_Vuelos);
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
