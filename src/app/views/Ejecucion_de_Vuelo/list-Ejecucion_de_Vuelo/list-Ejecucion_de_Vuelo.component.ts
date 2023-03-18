import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Ejecucion_de_VueloService } from "src/app/api-services/Ejecucion_de_Vuelo.service";
import { Ejecucion_de_Vuelo } from "src/app/models/Ejecucion_de_Vuelo";
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
import { Ejecucion_de_VueloIndexRules } from 'src/app/shared/businessRules/Ejecucion_de_Vuelo-index-rules';
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
  selector: "app-list-Ejecucion_de_Vuelo",
  templateUrl: "./list-Ejecucion_de_Vuelo.component.html",
  styleUrls: ["./list-Ejecucion_de_Vuelo.component.scss"],
})
export class ListEjecucion_de_VueloComponent extends Ejecucion_de_VueloIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  //#region Variables
  displayedColumns = [
    "acciones",
    "Folio",
    "Numero_de_Vuelo",
    "Tramo_de_Vuelo",
    "Matricula",
    "Tipo_de_Ala",
    "Solicitud",
    "Origen",
    "Destino",
    "Distancia_FIR_Km",
    "Comandante",
    "Capitan",
    "Primer_Capitan",
    "Segundo_Capitan",
    "Sobrecargo",
    "Administrador_del_Vuelo",
    "Tipo_de_Vuelo",
    "Pasajeros_Adicionales",
    "Fecha_de_Salida",
    "Hora_de_Salida",
    "Fecha_de_Llegada",
    "Hora_de_Llegada",
    "Fecha_de_Despegue",
    "Hora_de_Despegue",
    "Fecha_de_Aterrizaje",
    "Hora_de_Aterrizaje",
    "Fecha_de_Salida_Local",
    "Hora_de_Salida_Local",
    "Fecha_de_Llegada_Local",
    "Hora_de_Llegada_Local",
    "Fecha_de_Despegue_Local",
    "Hora_de_Despegue_Local",
    "Fecha_de_Aterrizaje_Local",
    "Hora_de_Aterrizaje_Local",
    "Internacional",
    "Tiempo_de_Calzo",
    "Tiempo_de_Vuelo",
    "Distancia_en_Millas",
    "Combustible__Cargado",
    "Combustible__Despegue",
    "Combustible__Aterrizaje",
    "Combustible__Consumo",
    "Observaciones",
    "Reportes_de_la_Aeronave",
    "Tiempo_de_Espera_Paso",
    "Tiempo_de_Espera",
    "Tiempo_de_Espera_Con_Costo",
    "Tiempo_de_Espera_Sin_Costo",
    "Pernoctas",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Numero_de_Vuelo",
      "Tramo_de_Vuelo",
      "Matricula",
      "Tipo_de_Ala",
      "Solicitud",
      "Origen",
      "Destino",
      "Distancia_FIR_Km",
      "Comandante",
      "Capitan",
      "Primer_Capitan",
      "Segundo_Capitan",
      "Sobrecargo",
      "Administrador_del_Vuelo",
      "Tipo_de_Vuelo",
      "Pasajeros_Adicionales",
      "Fecha_de_Salida",
      "Hora_de_Salida",
      "Fecha_de_Llegada",
      "Hora_de_Llegada",
      "Fecha_de_Despegue",
      "Hora_de_Despegue",
      "Fecha_de_Aterrizaje",
      "Hora_de_Aterrizaje",
      "Fecha_de_Salida_Local",
      "Hora_de_Salida_Local",
      "Fecha_de_Llegada_Local",
      "Hora_de_Llegada_Local",
      "Fecha_de_Despegue_Local",
      "Hora_de_Despegue_Local",
      "Fecha_de_Aterrizaje_Local",
      "Hora_de_Aterrizaje_Local",
      "Internacional",
      "Tiempo_de_Calzo",
      "Tiempo_de_Vuelo",
      "Distancia_en_Millas",
      "Combustible__Cargado",
      "Combustible__Despegue",
      "Combustible__Aterrizaje",
      "Combustible__Consumo",
      "Observaciones",
      "Reportes_de_la_Aeronave",
      "Tiempo_de_Espera_Paso",
      "Tiempo_de_Espera",
      "Tiempo_de_Espera_Con_Costo",
      "Tiempo_de_Espera_Sin_Costo",
      "Pernoctas",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Numero_de_Vuelo_filtro",
      "Tramo_de_Vuelo_filtro",
      "Matricula_filtro",
      "Tipo_de_Ala_filtro",
      "Solicitud_filtro",
      "Origen_filtro",
      "Destino_filtro",
      "Distancia_FIR_Km_filtro",
      "Comandante_filtro",
      "Capitan_filtro",
      "Primer_Capitan_filtro",
      "Segundo_Capitan_filtro",
      "Sobrecargo_filtro",
      "Administrador_del_Vuelo_filtro",
      "Tipo_de_Vuelo_filtro",
      "Pasajeros_Adicionales_filtro",
      "Fecha_de_Salida_filtro",
      "Hora_de_Salida_filtro",
      "Fecha_de_Llegada_filtro",
      "Hora_de_Llegada_filtro",
      "Fecha_de_Despegue_filtro",
      "Hora_de_Despegue_filtro",
      "Fecha_de_Aterrizaje_filtro",
      "Hora_de_Aterrizaje_filtro",
      "Fecha_de_Salida_Local_filtro",
      "Hora_de_Salida_Local_filtro",
      "Fecha_de_Llegada_Local_filtro",
      "Hora_de_Llegada_Local_filtro",
      "Fecha_de_Despegue_Local_filtro",
      "Hora_de_Despegue_Local_filtro",
      "Fecha_de_Aterrizaje_Local_filtro",
      "Hora_de_Aterrizaje_Local_filtro",
      "Internacional_filtro",
      "Tiempo_de_Calzo_filtro",
      "Tiempo_de_Vuelo_filtro",
      "Distancia_en_Millas_filtro",
      "Combustible__Cargado_filtro",
      "Combustible__Despegue_filtro",
      "Combustible__Aterrizaje_filtro",
      "Combustible__Consumo_filtro",
      "Observaciones_filtro",
      "Reportes_de_la_Aeronave_filtro",
      "Tiempo_de_Espera_Paso_filtro",
      "Tiempo_de_Espera_filtro",
      "Tiempo_de_Espera_Con_Costo_filtro",
      "Tiempo_de_Espera_Sin_Costo_filtro",
      "Pernoctas_filtro",

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
      Numero_de_Vuelo: "",
      Tramo_de_Vuelo: "",
      Matricula: "",
      Tipo_de_Ala: "",
      Solicitud: null,
      Origen: "",
      Destino: "",
      Distancia_FIR_Km: "",
      Comandante: "",
      Capitan: "",
      Primer_Capitan: "",
      Segundo_Capitan: "",
      Sobrecargo: "",
      Administrador_del_Vuelo: "",
      Tipo_de_Vuelo: "",
      Pasajeros_Adicionales: "",
      Fecha_de_Salida: null,
      Hora_de_Salida: "",
      Fecha_de_Llegada: null,
      Hora_de_Llegada: "",
      Fecha_de_Despegue: null,
      Hora_de_Despegue: "",
      Fecha_de_Aterrizaje: null,
      Hora_de_Aterrizaje: "",
      Fecha_de_Salida_Local: null,
      Hora_de_Salida_Local: "",
      Fecha_de_Llegada_Local: null,
      Hora_de_Llegada_Local: "",
      Fecha_de_Despegue_Local: null,
      Hora_de_Despegue_Local: "",
      Fecha_de_Aterrizaje_Local: null,
      Hora_de_Aterrizaje_Local: "",
      Internacional: "",
      Tiempo_de_Calzo: "",
      Tiempo_de_Vuelo: "",
      Distancia_en_Millas: "",
      Combustible__Cargado: "",
      Combustible__Despegue: "",
      Combustible__Aterrizaje: "",
      Combustible__Consumo: "",
      Observaciones: "",
      Reportes_de_la_Aeronave: "",
      Tiempo_de_Espera_Paso: "",
      Tiempo_de_Espera: "",
      Tiempo_de_Espera_Con_Costo: "",
      Tiempo_de_Espera_Sin_Costo: "",
      Pernoctas: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Numero_de_VueloFilter: "",
      Numero_de_Vuelo: "",
      Numero_de_VueloMultiple: "",
      Tramo_de_VueloFilter: "",
      Tramo_de_Vuelo: "",
      Tramo_de_VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      Tipo_de_AlaFilter: "",
      Tipo_de_Ala: "",
      Tipo_de_AlaMultiple: "",
      fromSolicitud: "",
      toSolicitud: "",
      OrigenFilter: "",
      Origen: "",
      OrigenMultiple: "",
      DestinoFilter: "",
      Destino: "",
      DestinoMultiple: "",
      fromDistancia_FIR_Km: "",
      toDistancia_FIR_Km: "",
      ComandanteFilter: "",
      Comandante: "",
      ComandanteMultiple: "",
      CapitanFilter: "",
      Capitan: "",
      CapitanMultiple: "",
      Primer_CapitanFilter: "",
      Primer_Capitan: "",
      Primer_CapitanMultiple: "",
      Segundo_CapitanFilter: "",
      Segundo_Capitan: "",
      Segundo_CapitanMultiple: "",
      SobrecargoFilter: "",
      Sobrecargo: "",
      SobrecargoMultiple: "",
      Administrador_del_VueloFilter: "",
      Administrador_del_Vuelo: "",
      Administrador_del_VueloMultiple: "",
      Tipo_de_VueloFilter: "",
      Tipo_de_Vuelo: "",
      Tipo_de_VueloMultiple: "",
      fromPasajeros_Adicionales: "",
      toPasajeros_Adicionales: "",
      fromFecha_de_Salida: "",
      toFecha_de_Salida: "",
      fromHora_de_Salida: "",
      toHora_de_Salida: "",
      fromFecha_de_Llegada: "",
      toFecha_de_Llegada: "",
      fromHora_de_Llegada: "",
      toHora_de_Llegada: "",
      fromFecha_de_Despegue: "",
      toFecha_de_Despegue: "",
      fromHora_de_Despegue: "",
      toHora_de_Despegue: "",
      fromFecha_de_Aterrizaje: "",
      toFecha_de_Aterrizaje: "",
      fromHora_de_Aterrizaje: "",
      toHora_de_Aterrizaje: "",
      fromFecha_de_Salida_Local: "",
      toFecha_de_Salida_Local: "",
      fromHora_de_Salida_Local: "",
      toHora_de_Salida_Local: "",
      fromFecha_de_Llegada_Local: "",
      toFecha_de_Llegada_Local: "",
      fromHora_de_Llegada_Local: "",
      toHora_de_Llegada_Local: "",
      fromFecha_de_Despegue_Local: "",
      toFecha_de_Despegue_Local: "",
      fromHora_de_Despegue_Local: "",
      toHora_de_Despegue_Local: "",
      fromFecha_de_Aterrizaje_Local: "",
      toFecha_de_Aterrizaje_Local: "",
      fromHora_de_Aterrizaje_Local: "",
      toHora_de_Aterrizaje_Local: "",
      fromTiempo_de_Calzo: "",
      toTiempo_de_Calzo: "",
      fromTiempo_de_Vuelo: "",
      toTiempo_de_Vuelo: "",
      fromDistancia_en_Millas: "",
      toDistancia_en_Millas: "",
      fromCombustible__Cargado: "",
      toCombustible__Cargado: "",
      fromCombustible__Despegue: "",
      toCombustible__Despegue: "",
      fromCombustible__Aterrizaje: "",
      toCombustible__Aterrizaje: "",
      fromCombustible__Consumo: "",
      toCombustible__Consumo: "",
      fromTiempo_de_Espera_Paso: "",
      toTiempo_de_Espera_Paso: "",
      fromTiempo_de_Espera: "",
      toTiempo_de_Espera: "",
      fromPernoctas: "",
      toPernoctas: "",

    }
  };

  dataSource: Ejecucion_de_VueloDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Ejecucion_de_VueloDataSource;
  dataClipboard: any;

  //#endregion

  constructor(
    private _Ejecucion_de_VueloService: Ejecucion_de_VueloService,
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
    route: Router, renderer: Renderer2
  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

  }

  ngOnInit() {
    this.rulesBeforeCreationList();
    this.dataSource = new Ejecucion_de_VueloDataSource(
      this._Ejecucion_de_VueloService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Ejecucion_de_Vuelo)
      .subscribe((response) => {
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
    this.listConfig.filter.Numero_de_Vuelo = "";
    this.listConfig.filter.Tramo_de_Vuelo = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Tipo_de_Ala = "";
    this.listConfig.filter.Solicitud = undefined;
    this.listConfig.filter.Origen = "";
    this.listConfig.filter.Destino = "";
    this.listConfig.filter.Distancia_FIR_Km = "";
    this.listConfig.filter.Comandante = "";
    this.listConfig.filter.Capitan = "";
    this.listConfig.filter.Primer_Capitan = "";
    this.listConfig.filter.Segundo_Capitan = "";
    this.listConfig.filter.Sobrecargo = "";
    this.listConfig.filter.Administrador_del_Vuelo = "";
    this.listConfig.filter.Tipo_de_Vuelo = "";
    this.listConfig.filter.Pasajeros_Adicionales = "";
    this.listConfig.filter.Fecha_de_Salida = undefined;
    this.listConfig.filter.Hora_de_Salida = "";
    this.listConfig.filter.Fecha_de_Llegada = undefined;
    this.listConfig.filter.Hora_de_Llegada = "";
    this.listConfig.filter.Fecha_de_Despegue = undefined;
    this.listConfig.filter.Hora_de_Despegue = "";
    this.listConfig.filter.Fecha_de_Aterrizaje = undefined;
    this.listConfig.filter.Hora_de_Aterrizaje = "";
    this.listConfig.filter.Fecha_de_Salida_Local = undefined;
    this.listConfig.filter.Hora_de_Salida_Local = "";
    this.listConfig.filter.Fecha_de_Llegada_Local = undefined;
    this.listConfig.filter.Hora_de_Llegada_Local = "";
    this.listConfig.filter.Fecha_de_Despegue_Local = undefined;
    this.listConfig.filter.Hora_de_Despegue_Local = "";
    this.listConfig.filter.Fecha_de_Aterrizaje_Local = undefined;
    this.listConfig.filter.Hora_de_Aterrizaje_Local = "";
    this.listConfig.filter.Internacional = undefined;
    this.listConfig.filter.Tiempo_de_Calzo = "";
    this.listConfig.filter.Tiempo_de_Vuelo = "";
    this.listConfig.filter.Distancia_en_Millas = "";
    this.listConfig.filter.Combustible__Cargado = "";
    this.listConfig.filter.Combustible__Despegue = "";
    this.listConfig.filter.Combustible__Aterrizaje = "";
    this.listConfig.filter.Combustible__Consumo = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.Reportes_de_la_Aeronave = "";
    this.listConfig.filter.Tiempo_de_Espera_Paso = "";
    this.listConfig.filter.Tiempo_de_Espera = "";
    this.listConfig.filter.Tiempo_de_Espera_Con_Costo = "";
    this.listConfig.filter.Tiempo_de_Espera_Sin_Costo = "";
    this.listConfig.filter.Pernoctas = "";

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

    //INICIA - BRID:2204 -  Solo puede dar de alta, ediar o borrar ejecuciones de vuelo de los vuelos donde el está dentro de la tripulación. Para saber en que tripulaciones se encuentra, es en la pantalla Registro de Tramo de Vuelo, ahí hay un MR de Tripulación. - Autor: Administrador - Actualización: 3/30/2021 9:29:05 PM
    if (this.brf.EvaluaQuery("SELECT GLOBAL[USERROLEID]", 1, 'ABC123') == this.brf.TryParseInt('13', '13')) {
      this.brf.SetFilteronList(this.listConfig, "Ejecucion_de_Vuelo.Numero_de_Vuelo IN (SELECT VueloId FROM DBO.fncVuelosTripulante(GLOBAL[USERID]) )");
    }
    //TERMINA - BRID:2204

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

  remove(row: Ejecucion_de_Vuelo) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Ejecucion_de_VueloService
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
  ActionPrint(dataRow: Ejecucion_de_Vuelo) {

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
      , 'Número de Vuelo'
      , 'Tramo de Vuelo'
      , 'Matrícula'
      , 'Tipo de Ala'
      , 'Solicitud'
      , 'Origen'
      , 'Destino'
      , 'Distancia FIR (Km)'
      , 'Comandante'
      , 'Capitán'
      , 'Primer Oficial'
      , 'Segundo Tripulante'
      , 'Sobrecargo'
      , 'Administrador del Vuelo'
      , 'Tipo de Vuelo'
      , 'Pasajeros Adicionales'
      , 'Fecha de Salida'
      , 'Hora de Salida'
      , 'Fecha de Llegada'
      , 'Hora de Llegada'
      , 'Fecha de Despegue'
      , 'Hora de Despegue'
      , 'Fecha de Aterrizaje'
      , 'Hora de Aterrizaje'
      , 'Fecha de Salida Local'
      , 'Hora de Salida Local'
      , 'Fecha de Llegada Local'
      , 'Hora de Llegada Local'
      , 'Fecha de Despegue Local'
      , 'Hora de Despegue Local'
      , 'Fecha de Aterrizaje Local'
      , 'Hora de Aterrizaje Local'
      , 'Internacional'
      , 'Tiempo de Calzo'
      , 'Tiempo de Vuelo'
      , 'Distancia en Millas'
      , 'Combustible - Cargado'
      , 'Combustible - Despegue'
      , 'Combustible - Aterrizaje'
      , 'Combustible - Consumo'
      , 'Observaciones'
      , 'Reportes de la Aeronave'
      , 'Tiempo de Espera Paso'
      , 'Tiempo de Espera'
      , 'Tiempo de Espera Con Costo'
      , 'Tiempo de Espera Sin Costo'
      , 'Pernoctas'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
        , x.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo
        , x.Matricula_Aeronave.Matricula
        , x.Tipo_de_Ala_Tipo_de_Ala.Descripcion
        , x.Solicitud
        , x.Origen_Aeropuertos.Descripcion
        , x.Destino_Aeropuertos.Descripcion
        , x.Distancia_FIR_Km
        , x.Comandante_Tripulacion.Nombre_completo
        , x.Capitan_Tripulacion.Nombre_completo
        , x.Primer_Capitan_Tripulacion.Nombres
        , x.Segundo_Capitan_Tripulacion.Nombres
        , x.Sobrecargo_Tripulacion.Nombre_completo
        , x.Administrador_del_Vuelo_Tripulacion.Nombre_completo
        , x.Tipo_de_Vuelo_Tipo_de_vuelo.Descripcion
        , x.Pasajeros_Adicionales
        , x.Fecha_de_Salida
        , x.Hora_de_Salida
        , x.Fecha_de_Llegada
        , x.Hora_de_Llegada
        , x.Fecha_de_Despegue
        , x.Hora_de_Despegue
        , x.Fecha_de_Aterrizaje
        , x.Hora_de_Aterrizaje
        , x.Fecha_de_Salida_Local
        , x.Hora_de_Salida_Local
        , x.Fecha_de_Llegada_Local
        , x.Hora_de_Llegada_Local
        , x.Fecha_de_Despegue_Local
        , x.Hora_de_Despegue_Local
        , x.Fecha_de_Aterrizaje_Local
        , x.Hora_de_Aterrizaje_Local
        , x.Internacional
        , x.Tiempo_de_Calzo
        , x.Tiempo_de_Vuelo
        , x.Distancia_en_Millas
        , x.Combustible__Cargado
        , x.Combustible__Despegue
        , x.Combustible__Aterrizaje
        , x.Combustible__Consumo
        , x.Observaciones
        , x.Reportes_de_la_Aeronave
        , x.Tiempo_de_Espera_Paso
        , x.Tiempo_de_Espera_Con_Costo
        , x.Tiempo_de_Espera_Sin_Costo
        , x.Pernoctas

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
    pdfMake.createPdf(pdfDefinition).download('Ejecucion_de_Vuelo.pdf');
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
          this._Ejecucion_de_VueloService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ejecucion_de_Vuelos;
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
          this._Ejecucion_de_VueloService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ejecucion_de_Vuelos;
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
        'Número de Vuelo ': fields.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Tramo de Vuelo ': fields.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Tipo de Ala ': fields.Tipo_de_Ala_Tipo_de_Ala.Descripcion,
        'Solicitud ': fields.Solicitud ? momentJS(fields.Solicitud).format('DD/MM/YYYY') : '',
        'Origen ': fields.Origen_Aeropuertos.Descripcion,
        'Destino 1': fields.Destino_Aeropuertos.Descripcion,
        'Distancia FIR (Km) ': fields.Distancia_FIR_Km,
        'Comandante ': fields.Comandante_Tripulacion.Nombre_completo,
        'Capitán 1': fields.Capitan_Tripulacion.Nombre_completo,
        'Primer Oficial 2': fields.Primer_Capitan_Tripulacion.Nombres,
        'Segundo Tripulante 3': fields.Segundo_Capitan_Tripulacion.Nombres,
        'Sobrecargo 4': fields.Sobrecargo_Tripulacion.Nombre_completo,
        'Administrador del Vuelo 5': fields.Administrador_del_Vuelo_Tripulacion.Nombre_completo,
        'Tipo de Vuelo ': fields.Tipo_de_Vuelo_Tipo_de_vuelo.Descripcion,
        'Pasajeros Adicionales ': fields.Pasajeros_Adicionales,
        'Fecha de Salida ': fields.Fecha_de_Salida ? momentJS(fields.Fecha_de_Salida).format('DD/MM/YYYY') : '',
        'Hora de Salida ': fields.Hora_de_Salida,
        'Fecha de Llegada ': fields.Fecha_de_Llegada ? momentJS(fields.Fecha_de_Llegada).format('DD/MM/YYYY') : '',
        'Hora de Llegada ': fields.Hora_de_Llegada,
        'Fecha de Despegue ': fields.Fecha_de_Despegue ? momentJS(fields.Fecha_de_Despegue).format('DD/MM/YYYY') : '',
        'Hora de Despegue ': fields.Hora_de_Despegue,
        'Fecha de Aterrizaje ': fields.Fecha_de_Aterrizaje ? momentJS(fields.Fecha_de_Aterrizaje).format('DD/MM/YYYY') : '',
        'Hora de Aterrizaje ': fields.Hora_de_Aterrizaje,
        'Fecha de Salida Local ': fields.Fecha_de_Salida_Local ? momentJS(fields.Fecha_de_Salida_Local).format('DD/MM/YYYY') : '',
        'Hora de Salida Local ': fields.Hora_de_Salida_Local,
        'Fecha de Llegada Local ': fields.Fecha_de_Llegada_Local ? momentJS(fields.Fecha_de_Llegada_Local).format('DD/MM/YYYY') : '',
        'Hora de Llegada Local ': fields.Hora_de_Llegada_Local,
        'Fecha de Despegue Local ': fields.Fecha_de_Despegue_Local ? momentJS(fields.Fecha_de_Despegue_Local).format('DD/MM/YYYY') : '',
        'Hora de Despegue Local ': fields.Hora_de_Despegue_Local,
        'Fecha de Aterrizaje Local ': fields.Fecha_de_Aterrizaje_Local ? momentJS(fields.Fecha_de_Aterrizaje_Local).format('DD/MM/YYYY') : '',
        'Hora de Aterrizaje Local ': fields.Hora_de_Aterrizaje_Local,
        'Internacional ': fields.Internacional ? 'SI' : 'NO',
        'Tiempo de Calzo ': fields.Tiempo_de_Calzo,
        'Tiempo de Vuelo ': fields.Tiempo_de_Vuelo,
        'Distancia en Millas ': fields.Distancia_en_Millas,
        'Combustible - Cargado ': fields.Combustible__Cargado,
        'Combustible - Despegue ': fields.Combustible__Despegue,
        'Combustible - Aterrizaje ': fields.Combustible__Aterrizaje,
        'Combustible - Consumo ': fields.Combustible__Consumo,
        'Observaciones ': fields.Observaciones,
        'Reportes de la Aeronave ': fields.Reportes_de_la_Aeronave,
        'Tiempo de Espera Paso ': fields.Tiempo_de_Espera_Paso,
        'Tiempo de Espera ': fields.Tiempo_de_Espera,
        'Tiempo de Espera Con Costo ': fields.Tiempo_de_Espera_Con_Costo,
        'Tiempo de Espera Sin Costo ': fields.Tiempo_de_Espera_Sin_Costo,
        'Pernoctas ': fields.Pernoctas,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Ejecucion_de_Vuelo  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Numero_de_Vuelo: x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Tramo_de_Vuelo: x.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo,
      Matricula: x.Matricula_Aeronave.Matricula,
      Tipo_de_Ala: x.Tipo_de_Ala_Tipo_de_Ala.Descripcion,
      Solicitud: x.Solicitud,
      Origen: x.Origen_Aeropuertos.Descripcion,
      Destino: x.Destino_Aeropuertos.Descripcion,
      Distancia_FIR_Km: x.Distancia_FIR_Km,
      Comandante: x.Comandante_Tripulacion.Nombre_completo,
      Capitan: x.Capitan_Tripulacion.Nombre_completo,
      Primer_Capitan: x.Primer_Capitan_Tripulacion.Nombres,
      Segundo_Capitan: x.Segundo_Capitan_Tripulacion.Nombres,
      Sobrecargo: x.Sobrecargo_Tripulacion.Nombre_completo,
      Administrador_del_Vuelo: x.Administrador_del_Vuelo_Tripulacion.Nombre_completo,
      Tipo_de_Vuelo: x.Tipo_de_Vuelo_Tipo_de_vuelo.Descripcion,
      Pasajeros_Adicionales: x.Pasajeros_Adicionales,
      Fecha_de_Salida: x.Fecha_de_Salida,
      Hora_de_Salida: x.Hora_de_Salida,
      Fecha_de_Llegada: x.Fecha_de_Llegada,
      Hora_de_Llegada: x.Hora_de_Llegada,
      Fecha_de_Despegue: x.Fecha_de_Despegue,
      Hora_de_Despegue: x.Hora_de_Despegue,
      Fecha_de_Aterrizaje: x.Fecha_de_Aterrizaje,
      Hora_de_Aterrizaje: x.Hora_de_Aterrizaje,
      Fecha_de_Salida_Local: x.Fecha_de_Salida_Local,
      Hora_de_Salida_Local: x.Hora_de_Salida_Local,
      Fecha_de_Llegada_Local: x.Fecha_de_Llegada_Local,
      Hora_de_Llegada_Local: x.Hora_de_Llegada_Local,
      Fecha_de_Despegue_Local: x.Fecha_de_Despegue_Local,
      Hora_de_Despegue_Local: x.Hora_de_Despegue_Local,
      Fecha_de_Aterrizaje_Local: x.Fecha_de_Aterrizaje_Local,
      Hora_de_Aterrizaje_Local: x.Hora_de_Aterrizaje_Local,
      Internacional: x.Internacional,
      Tiempo_de_Calzo: x.Tiempo_de_Calzo,
      Tiempo_de_Vuelo: x.Tiempo_de_Vuelo,
      Distancia_en_Millas: x.Distancia_en_Millas,
      Combustible__Cargado: x.Combustible__Cargado,
      Combustible__Despegue: x.Combustible__Despegue,
      Combustible__Aterrizaje: x.Combustible__Aterrizaje,
      Combustible__Consumo: x.Combustible__Consumo,
      Observaciones: x.Observaciones,
      Reportes_de_la_Aeronave: x.Reportes_de_la_Aeronave,
      Tiempo_de_Espera_Paso: x.Tiempo_de_Espera_Paso,
      Tiempo_de_Espera: x.Tiempo_de_Espera,
      Tiempo_de_Espera_Con_Costo: x.Tiempo_de_Espera_Con_Costo,
      Tiempo_de_Espera_Sin_Costo: x.Tiempo_de_Espera_Sin_Costo,
      Pernoctas: x.Pernoctas,

    }));

    this.excelService.exportToCsv(result, 'Ejecucion_de_Vuelo', ['Folio', 'Numero_de_Vuelo', 'Tramo_de_Vuelo', 'Matricula', 'Tipo_de_Ala', 'Solicitud', 'Origen', 'Destino', 'Distancia_FIR_Km', 'Comandante', 'Capitan', 'Primer_Capitan', 'Segundo_Capitan', 'Sobrecargo', 'Administrador_del_Vuelo', 'Tipo_de_Vuelo', 'Pasajeros_Adicionales', 'Fecha_de_Salida', 'Hora_de_Salida', 'Fecha_de_Llegada', 'Hora_de_Llegada', 'Fecha_de_Despegue', 'Hora_de_Despegue', 'Fecha_de_Aterrizaje', 'Hora_de_Aterrizaje', 'Fecha_de_Salida_Local', 'Hora_de_Salida_Local', 'Fecha_de_Llegada_Local', 'Hora_de_Llegada_Local', 'Fecha_de_Despegue_Local', 'Hora_de_Despegue_Local', 'Fecha_de_Aterrizaje_Local', 'Hora_de_Aterrizaje_Local', 'Internacional', 'Tiempo_de_Calzo', 'Tiempo_de_Vuelo', 'Distancia_en_Millas', 'Combustible__Cargado', 'Combustible__Despegue', 'Combustible__Aterrizaje', 'Combustible__Consumo', 'Observaciones', 'Reportes_de_la_Aeronave', 'Tiempo_de_Espera_Paso', 'Tiempo_de_Espera', 'Tiempo_de_Espera_Con_Costo', 'Tiempo_de_Espera_Sin_Costo', 'Pernoctas']);
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
    template += '          <th>Número de Vuelo</th>';
    template += '          <th>Tramo de Vuelo</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Tipo de Ala</th>';
    template += '          <th>Solicitud</th>';
    template += '          <th>Origen</th>';
    template += '          <th>Destino</th>';
    template += '          <th>Distancia FIR (Km)</th>';
    template += '          <th>Comandante</th>';
    template += '          <th>Capitán</th>';
    template += '          <th>Primer Oficial</th>';
    template += '          <th>Segundo Tripulante</th>';
    template += '          <th>Sobrecargo</th>';
    template += '          <th>Administrador del Vuelo</th>';
    template += '          <th>Tipo de Vuelo</th>';
    template += '          <th>Pasajeros Adicionales</th>';
    template += '          <th>Fecha de Salida</th>';
    template += '          <th>Hora de Salida</th>';
    template += '          <th>Fecha de Llegada</th>';
    template += '          <th>Hora de Llegada</th>';
    template += '          <th>Fecha de Despegue</th>';
    template += '          <th>Hora de Despegue</th>';
    template += '          <th>Fecha de Aterrizaje</th>';
    template += '          <th>Hora de Aterrizaje</th>';
    template += '          <th>Fecha de Salida Local</th>';
    template += '          <th>Hora de Salida Local</th>';
    template += '          <th>Fecha de Llegada Local</th>';
    template += '          <th>Hora de Llegada Local</th>';
    template += '          <th>Fecha de Despegue Local</th>';
    template += '          <th>Hora de Despegue Local</th>';
    template += '          <th>Fecha de Aterrizaje Local</th>';
    template += '          <th>Hora de Aterrizaje Local</th>';
    template += '          <th>Internacional</th>';
    template += '          <th>Tiempo de Calzo</th>';
    template += '          <th>Tiempo de Vuelo</th>';
    template += '          <th>Distancia en Millas</th>';
    template += '          <th>Combustible - Cargado</th>';
    template += '          <th>Combustible - Despegue</th>';
    template += '          <th>Combustible - Aterrizaje</th>';
    template += '          <th>Combustible - Consumo</th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>Reportes de la Aeronave</th>';
    template += '          <th>Tiempo de Espera Paso</th>';
    template += '          <th>Tiempo de Espera</th>';
    template += '          <th>Tiempo de Espera Con Costo</th>';
    template += '          <th>Tiempo de Espera Sin Costo</th>';
    template += '          <th>Pernoctas</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Tipo_de_Ala_Tipo_de_Ala.Descripcion + '</td>';
      template += '          <td>' + element.Solicitud + '</td>';
      template += '          <td>' + element.Origen_Aeropuertos.Descripcion + '</td>';
      template += '          <td>' + element.Destino_Aeropuertos.Descripcion + '</td>';
      template += '          <td>' + element.Distancia_FIR_Km + '</td>';
      template += '          <td>' + element.Comandante_Tripulacion.Nombre_completo + '</td>';
      template += '          <td>' + element.Capitan_Tripulacion.Nombre_completo + '</td>';
      template += '          <td>' + element.Primer_Capitan_Tripulacion.Nombres + '</td>';
      template += '          <td>' + element.Segundo_Capitan_Tripulacion.Nombres + '</td>';
      template += '          <td>' + element.Sobrecargo_Tripulacion.Nombre_completo + '</td>';
      template += '          <td>' + element.Administrador_del_Vuelo_Tripulacion.Nombre_completo + '</td>';
      template += '          <td>' + element.Tipo_de_Vuelo_Tipo_de_vuelo.Descripcion + '</td>';
      template += '          <td>' + element.Pasajeros_Adicionales + '</td>';
      template += '          <td>' + element.Fecha_de_Salida + '</td>';
      template += '          <td>' + element.Hora_de_Salida + '</td>';
      template += '          <td>' + element.Fecha_de_Llegada + '</td>';
      template += '          <td>' + element.Hora_de_Llegada + '</td>';
      template += '          <td>' + element.Fecha_de_Despegue + '</td>';
      template += '          <td>' + element.Hora_de_Despegue + '</td>';
      template += '          <td>' + element.Fecha_de_Aterrizaje + '</td>';
      template += '          <td>' + element.Hora_de_Aterrizaje + '</td>';
      template += '          <td>' + element.Fecha_de_Salida_Local + '</td>';
      template += '          <td>' + element.Hora_de_Salida_Local + '</td>';
      template += '          <td>' + element.Fecha_de_Llegada_Local + '</td>';
      template += '          <td>' + element.Hora_de_Llegada_Local + '</td>';
      template += '          <td>' + element.Fecha_de_Despegue_Local + '</td>';
      template += '          <td>' + element.Hora_de_Despegue_Local + '</td>';
      template += '          <td>' + element.Fecha_de_Aterrizaje_Local + '</td>';
      template += '          <td>' + element.Hora_de_Aterrizaje_Local + '</td>';
      template += '          <td>' + element.Internacional + '</td>';
      template += '          <td>' + element.Tiempo_de_Calzo + '</td>';
      template += '          <td>' + element.Tiempo_de_Vuelo + '</td>';
      template += '          <td>' + element.Distancia_en_Millas + '</td>';
      template += '          <td>' + element.Combustible__Cargado + '</td>';
      template += '          <td>' + element.Combustible__Despegue + '</td>';
      template += '          <td>' + element.Combustible__Aterrizaje + '</td>';
      template += '          <td>' + element.Combustible__Consumo + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.Reportes_de_la_Aeronave + '</td>';
      template += '          <td>' + element.Tiempo_de_Espera_Paso + '</td>';
      template += '          <td>' + element.Tiempo_de_Espera + '</td>';
      template += '          <td>' + element.Tiempo_de_Espera_Con_Costo + '</td>';
      template += '          <td>' + element.Tiempo_de_Espera_Sin_Costo + '</td>';
      template += '          <td>' + element.Pernoctas + '</td>';

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
    template += '\t Número de Vuelo';
    template += '\t Tramo de Vuelo';
    template += '\t Matrícula';
    template += '\t Tipo de Ala';
    template += '\t Solicitud';
    template += '\t Origen';
    template += '\t Destino';
    template += '\t Distancia FIR (Km)';
    template += '\t Comandante';
    template += '\t Capitán';
    template += '\t Primer Oficial';
    template += '\t Segundo Tripulante';
    template += '\t Sobrecargo';
    template += '\t Administrador del Vuelo';
    template += '\t Tipo de Vuelo';
    template += '\t Pasajeros Adicionales';
    template += '\t Fecha de Salida';
    template += '\t Hora de Salida';
    template += '\t Fecha de Llegada';
    template += '\t Hora de Llegada';
    template += '\t Fecha de Despegue';
    template += '\t Hora de Despegue';
    template += '\t Fecha de Aterrizaje';
    template += '\t Hora de Aterrizaje';
    template += '\t Fecha de Salida Local';
    template += '\t Hora de Salida Local';
    template += '\t Fecha de Llegada Local';
    template += '\t Hora de Llegada Local';
    template += '\t Fecha de Despegue Local';
    template += '\t Hora de Despegue Local';
    template += '\t Fecha de Aterrizaje Local';
    template += '\t Hora de Aterrizaje Local';
    template += '\t Internacional';
    template += '\t Tiempo de Calzo';
    template += '\t Tiempo de Vuelo';
    template += '\t Distancia en Millas';
    template += '\t Combustible - Cargado';
    template += '\t Combustible - Despegue';
    template += '\t Combustible - Aterrizaje';
    template += '\t Combustible - Consumo';
    template += '\t Observaciones';
    template += '\t Reportes de la Aeronave';
    template += '\t Tiempo de Espera Paso';
    template += '\t Tiempo de Espera';
    template += '\t Tiempo de Espera Con Costo';
    template += '\t Tiempo de Espera Sin Costo';
    template += '\t Pernoctas';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Tipo_de_Ala_Tipo_de_Ala.Descripcion;
      template += '\t ' + element.Solicitud;
      template += '\t ' + element.Origen_Aeropuertos.Descripcion;
      template += '\t ' + element.Destino_Aeropuertos.Descripcion;
      template += '\t ' + element.Distancia_FIR_Km;
      template += '\t ' + element.Comandante_Tripulacion.Nombre_completo;
      template += '\t ' + element.Capitan_Tripulacion.Nombre_completo;
      template += '\t ' + element.Primer_Capitan_Tripulacion.Nombres;
      template += '\t ' + element.Segundo_Capitan_Tripulacion.Nombres;
      template += '\t ' + element.Sobrecargo_Tripulacion.Nombre_completo;
      template += '\t ' + element.Administrador_del_Vuelo_Tripulacion.Nombre_completo;
      template += '\t ' + element.Tipo_de_Vuelo_Tipo_de_vuelo.Descripcion;
      template += '\t ' + element.Pasajeros_Adicionales;
      template += '\t ' + element.Fecha_de_Salida;
      template += '\t ' + element.Hora_de_Salida;
      template += '\t ' + element.Fecha_de_Llegada;
      template += '\t ' + element.Hora_de_Llegada;
      template += '\t ' + element.Fecha_de_Despegue;
      template += '\t ' + element.Hora_de_Despegue;
      template += '\t ' + element.Fecha_de_Aterrizaje;
      template += '\t ' + element.Hora_de_Aterrizaje;
      template += '\t ' + element.Fecha_de_Salida_Local;
      template += '\t ' + element.Hora_de_Salida_Local;
      template += '\t ' + element.Fecha_de_Llegada_Local;
      template += '\t ' + element.Hora_de_Llegada_Local;
      template += '\t ' + element.Fecha_de_Despegue_Local;
      template += '\t ' + element.Hora_de_Despegue_Local;
      template += '\t ' + element.Fecha_de_Aterrizaje_Local;
      template += '\t ' + element.Hora_de_Aterrizaje_Local;
      template += '\t ' + element.Internacional;
      template += '\t ' + element.Tiempo_de_Calzo;
      template += '\t ' + element.Tiempo_de_Vuelo;
      template += '\t ' + element.Distancia_en_Millas;
      template += '\t ' + element.Combustible__Cargado;
      template += '\t ' + element.Combustible__Despegue;
      template += '\t ' + element.Combustible__Aterrizaje;
      template += '\t ' + element.Combustible__Consumo;
      template += '\t ' + element.Observaciones;
      template += '\t ' + element.Reportes_de_la_Aeronave;
      template += '\t ' + element.Tiempo_de_Espera_Paso;
      template += '\t ' + element.Tiempo_de_Espera;
      template += '\t ' + element.Tiempo_de_Espera_Con_Costo;
      template += '\t ' + element.Tiempo_de_Espera_Sin_Costo;
      template += '\t ' + element.Pernoctas;

      template += '\n';
    });

    return template;
  }

}

export class Ejecucion_de_VueloDataSource implements DataSource<Ejecucion_de_Vuelo>
{

  private subject = new BehaviorSubject<Ejecucion_de_Vuelo[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Ejecucion_de_VueloService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Ejecucion_de_Vuelo[]> {
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
      .pipe(catchError(() => of([])), finalize(() => this.loadingSubject.next(false)))
      .subscribe((result: any) => {
        data.styles = [];
        data.columns.forEach((column, index) => {
          if (column === 'Folio') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Ejecucion_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ejecucion_de_Vuelos);
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
      condition += " and Ejecucion_de_Vuelo.Folio = " + data.filter.Folio;
    if (data.filter.Numero_de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Numero_de_Vuelo + "%' ";
    if (data.filter.Tramo_de_Vuelo != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Tramo_de_Vuelo + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Tipo_de_Ala != "")
      condition += " and Tipo_de_Ala.Descripcion like '%" + data.filter.Tipo_de_Ala + "%' ";
    if (data.filter.Solicitud)
      condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Solicitud, 102)  = '" + moment(data.filter.Solicitud).format("YYYY.MM.DD") + "'";
    if (data.filter.Origen != "")
      condition += " and Aeropuertos.Descripcion like '%" + data.filter.Origen + "%' ";
    if (data.filter.Destino != "")
      condition += " and Aeropuertos1.Descripcion like '%" + data.filter.Destino + "%' ";
    if (data.filter.Distancia_FIR_Km != "")
      condition += " and Ejecucion_de_Vuelo.Distancia_FIR_Km = " + data.filter.Distancia_FIR_Km;
    if (data.filter.Comandante != "")
      condition += " and Tripulacion.Nombre_completo like '%" + data.filter.Comandante + "%' ";
    if (data.filter.Capitan != "")
      condition += " and Tripulacion1.Nombre_completo like '%" + data.filter.Capitan + "%' ";
    if (data.filter.Primer_Capitan != "")
      condition += " and Tripulacion2.Nombres like '%" + data.filter.Primer_Capitan + "%' ";
    if (data.filter.Segundo_Capitan != "")
      condition += " and Tripulacion3.Nombres like '%" + data.filter.Segundo_Capitan + "%' ";
    if (data.filter.Sobrecargo != "")
      condition += " and Tripulacion4.Nombre_completo like '%" + data.filter.Sobrecargo + "%' ";
    if (data.filter.Administrador_del_Vuelo != "")
      condition += " and Tripulacion5.Nombre_completo like '%" + data.filter.Administrador_del_Vuelo + "%' ";
    if (data.filter.Tipo_de_Vuelo != "")
      condition += " and Tipo_de_vuelo.Descripcion like '%" + data.filter.Tipo_de_Vuelo + "%' ";
    if (data.filter.Pasajeros_Adicionales != "")
      condition += " and Ejecucion_de_Vuelo.Pasajeros_Adicionales = " + data.filter.Pasajeros_Adicionales;
    if (data.filter.Fecha_de_Salida)
      condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Salida, 102)  = '" + moment(data.filter.Fecha_de_Salida).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Salida != "")
      condition += " and Ejecucion_de_Vuelo.Hora_de_Salida = '" + data.filter.Hora_de_Salida + "'";
    if (data.filter.Fecha_de_Llegada)
      condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Llegada, 102)  = '" + moment(data.filter.Fecha_de_Llegada).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Llegada != "")
      condition += " and Ejecucion_de_Vuelo.Hora_de_Llegada = '" + data.filter.Hora_de_Llegada + "'";
    if (data.filter.Fecha_de_Despegue)
      condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Despegue, 102)  = '" + moment(data.filter.Fecha_de_Despegue).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Despegue != "")
      condition += " and Ejecucion_de_Vuelo.Hora_de_Despegue = '" + data.filter.Hora_de_Despegue + "'";
    if (data.filter.Fecha_de_Aterrizaje)
      condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Aterrizaje, 102)  = '" + moment(data.filter.Fecha_de_Aterrizaje).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Aterrizaje != "")
      condition += " and Ejecucion_de_Vuelo.Hora_de_Aterrizaje = '" + data.filter.Hora_de_Aterrizaje + "'";
    if (data.filter.Fecha_de_Salida_Local)
      condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Salida_Local, 102)  = '" + moment(data.filter.Fecha_de_Salida_Local).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Salida_Local != "")
      condition += " and Ejecucion_de_Vuelo.Hora_de_Salida_Local = '" + data.filter.Hora_de_Salida_Local + "'";
    if (data.filter.Fecha_de_Llegada_Local)
      condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Llegada_Local, 102)  = '" + moment(data.filter.Fecha_de_Llegada_Local).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Llegada_Local != "")
      condition += " and Ejecucion_de_Vuelo.Hora_de_Llegada_Local = '" + data.filter.Hora_de_Llegada_Local + "'";
    if (data.filter.Fecha_de_Despegue_Local)
      condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Despegue_Local, 102)  = '" + moment(data.filter.Fecha_de_Despegue_Local).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Despegue_Local != "")
      condition += " and Ejecucion_de_Vuelo.Hora_de_Despegue_Local = '" + data.filter.Hora_de_Despegue_Local + "'";
    if (data.filter.Fecha_de_Aterrizaje_Local)
      condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Aterrizaje_Local, 102)  = '" + moment(data.filter.Fecha_de_Aterrizaje_Local).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Aterrizaje_Local != "")
      condition += " and Ejecucion_de_Vuelo.Hora_de_Aterrizaje_Local = '" + data.filter.Hora_de_Aterrizaje_Local + "'";
    if (data.filter.Internacional && data.filter.Internacional != "2") {
      if (data.filter.Internacional == "0" || data.filter.Internacional == "") {
        condition += " and (Ejecucion_de_Vuelo.Internacional = 0 or Ejecucion_de_Vuelo.Internacional is null)";
      } else {
        condition += " and Ejecucion_de_Vuelo.Internacional = 1";
      }
    }
    if (data.filter.Tiempo_de_Calzo != "")
      condition += " and Ejecucion_de_Vuelo.Tiempo_de_Calzo = '" + data.filter.Tiempo_de_Calzo + "'";
    if (data.filter.Tiempo_de_Vuelo != "")
      condition += " and Ejecucion_de_Vuelo.Tiempo_de_Vuelo = '" + data.filter.Tiempo_de_Vuelo + "'";
    if (data.filter.Distancia_en_Millas != "")
      condition += " and Ejecucion_de_Vuelo.Distancia_en_Millas = " + data.filter.Distancia_en_Millas;
    if (data.filter.Combustible__Cargado != "")
      condition += " and Ejecucion_de_Vuelo.Combustible__Cargado = " + data.filter.Combustible__Cargado;
    if (data.filter.Combustible__Despegue != "")
      condition += " and Ejecucion_de_Vuelo.Combustible__Despegue = " + data.filter.Combustible__Despegue;
    if (data.filter.Combustible__Aterrizaje != "")
      condition += " and Ejecucion_de_Vuelo.Combustible__Aterrizaje = " + data.filter.Combustible__Aterrizaje;
    if (data.filter.Combustible__Consumo != "")
      condition += " and Ejecucion_de_Vuelo.Combustible__Consumo = " + data.filter.Combustible__Consumo;
    if (data.filter.Observaciones != "")
      condition += " and Ejecucion_de_Vuelo.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.Reportes_de_la_Aeronave != "")
      condition += " and Ejecucion_de_Vuelo.Reportes_de_la_Aeronave like '%" + data.filter.Reportes_de_la_Aeronave + "%' ";
    if (data.filter.Tiempo_de_Espera_Paso != "")
      condition += " and Ejecucion_de_Vuelo.Tiempo_de_Espera_Paso = " + data.filter.Tiempo_de_Espera_Paso;
    if (data.filter.Tiempo_de_Espera != "")
      condition += " and Ejecucion_de_Vuelo.Tiempo_de_Espera = '" + data.filter.Tiempo_de_Espera + "'";
    if (data.filter.Tiempo_de_Espera_Con_Costo != "")
      condition += " and Ejecucion_de_Vuelo.Tiempo_de_Espera_Con_Costo like '%" + data.filter.Tiempo_de_Espera_Con_Costo + "%' ";
    if (data.filter.Tiempo_de_Espera_Sin_Costo != "")
      condition += " and Ejecucion_de_Vuelo.Tiempo_de_Espera_Sin_Costo like '%" + data.filter.Tiempo_de_Espera_Sin_Costo + "%' ";
    if (data.filter.Pernoctas != "")
      condition += " and Ejecucion_de_Vuelo.Pernoctas = " + data.filter.Pernoctas;

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
        sort = " Ejecucion_de_Vuelo.Folio " + data.sortDirecction;
        break;
      case "Numero_de_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Tramo_de_Vuelo":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Tipo_de_Ala":
        sort = " Tipo_de_Ala.Descripcion " + data.sortDirecction;
        break;
      case "Solicitud":
        sort = " Ejecucion_de_Vuelo.Solicitud " + data.sortDirecction;
        break;
      case "Origen":
        sort = " Aeropuertos.Descripcion " + data.sortDirecction;
        break;
      case "Destino":
        sort = " Aeropuertos1.Descripcion " + data.sortDirecction;
        break;
      case "Distancia_FIR_Km":
        sort = " Ejecucion_de_Vuelo.Distancia_FIR_Km " + data.sortDirecction;
        break;
      case "Comandante":
        sort = " Tripulacion.Nombre_completo " + data.sortDirecction;
        break;
      case "Capitan":
        sort = " Tripulacion1.Nombre_completo " + data.sortDirecction;
        break;
      case "Primer_Capitan":
        sort = " Tripulacion2.Nombres " + data.sortDirecction;
        break;
      case "Segundo_Capitan":
        sort = " Tripulacion3.Nombres " + data.sortDirecction;
        break;
      case "Sobrecargo":
        sort = " Tripulacion4.Nombre_completo " + data.sortDirecction;
        break;
      case "Administrador_del_Vuelo":
        sort = " Tripulacion5.Nombre_completo " + data.sortDirecction;
        break;
      case "Tipo_de_Vuelo":
        sort = " Tipo_de_vuelo.Descripcion " + data.sortDirecction;
        break;
      case "Pasajeros_Adicionales":
        sort = " Ejecucion_de_Vuelo.Pasajeros_Adicionales " + data.sortDirecction;
        break;
      case "Fecha_de_Salida":
        sort = " Ejecucion_de_Vuelo.Fecha_de_Salida " + data.sortDirecction;
        break;
      case "Hora_de_Salida":
        sort = " Ejecucion_de_Vuelo.Hora_de_Salida " + data.sortDirecction;
        break;
      case "Fecha_de_Llegada":
        sort = " Ejecucion_de_Vuelo.Fecha_de_Llegada " + data.sortDirecction;
        break;
      case "Hora_de_Llegada":
        sort = " Ejecucion_de_Vuelo.Hora_de_Llegada " + data.sortDirecction;
        break;
      case "Fecha_de_Despegue":
        sort = " Ejecucion_de_Vuelo.Fecha_de_Despegue " + data.sortDirecction;
        break;
      case "Hora_de_Despegue":
        sort = " Ejecucion_de_Vuelo.Hora_de_Despegue " + data.sortDirecction;
        break;
      case "Fecha_de_Aterrizaje":
        sort = " Ejecucion_de_Vuelo.Fecha_de_Aterrizaje " + data.sortDirecction;
        break;
      case "Hora_de_Aterrizaje":
        sort = " Ejecucion_de_Vuelo.Hora_de_Aterrizaje " + data.sortDirecction;
        break;
      case "Fecha_de_Salida_Local":
        sort = " Ejecucion_de_Vuelo.Fecha_de_Salida_Local " + data.sortDirecction;
        break;
      case "Hora_de_Salida_Local":
        sort = " Ejecucion_de_Vuelo.Hora_de_Salida_Local " + data.sortDirecction;
        break;
      case "Fecha_de_Llegada_Local":
        sort = " Ejecucion_de_Vuelo.Fecha_de_Llegada_Local " + data.sortDirecction;
        break;
      case "Hora_de_Llegada_Local":
        sort = " Ejecucion_de_Vuelo.Hora_de_Llegada_Local " + data.sortDirecction;
        break;
      case "Fecha_de_Despegue_Local":
        sort = " Ejecucion_de_Vuelo.Fecha_de_Despegue_Local " + data.sortDirecction;
        break;
      case "Hora_de_Despegue_Local":
        sort = " Ejecucion_de_Vuelo.Hora_de_Despegue_Local " + data.sortDirecction;
        break;
      case "Fecha_de_Aterrizaje_Local":
        sort = " Ejecucion_de_Vuelo.Fecha_de_Aterrizaje_Local " + data.sortDirecction;
        break;
      case "Hora_de_Aterrizaje_Local":
        sort = " Ejecucion_de_Vuelo.Hora_de_Aterrizaje_Local " + data.sortDirecction;
        break;
      case "Internacional":
        sort = " Ejecucion_de_Vuelo.Internacional " + data.sortDirecction;
        break;
      case "Tiempo_de_Calzo":
        sort = " Ejecucion_de_Vuelo.Tiempo_de_Calzo " + data.sortDirecction;
        break;
      case "Tiempo_de_Vuelo":
        sort = " Ejecucion_de_Vuelo.Tiempo_de_Vuelo " + data.sortDirecction;
        break;
      case "Distancia_en_Millas":
        sort = " Ejecucion_de_Vuelo.Distancia_en_Millas " + data.sortDirecction;
        break;
      case "Combustible__Cargado":
        sort = " Ejecucion_de_Vuelo.Combustible__Cargado " + data.sortDirecction;
        break;
      case "Combustible__Despegue":
        sort = " Ejecucion_de_Vuelo.Combustible__Despegue " + data.sortDirecction;
        break;
      case "Combustible__Aterrizaje":
        sort = " Ejecucion_de_Vuelo.Combustible__Aterrizaje " + data.sortDirecction;
        break;
      case "Combustible__Consumo":
        sort = " Ejecucion_de_Vuelo.Combustible__Consumo " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Ejecucion_de_Vuelo.Observaciones " + data.sortDirecction;
        break;
      case "Reportes_de_la_Aeronave":
        sort = " Ejecucion_de_Vuelo.Reportes_de_la_Aeronave " + data.sortDirecction;
        break;
      case "Tiempo_de_Espera_Paso":
        sort = " Ejecucion_de_Vuelo.Tiempo_de_Espera_Paso " + data.sortDirecction;
        break;
      case "Tiempo_de_Espera":
        sort = " Ejecucion_de_Vuelo.Tiempo_de_Espera " + data.sortDirecction;
        break;
      case "Tiempo_de_Espera_Con_Costo":
        sort = " Ejecucion_de_Vuelo.Tiempo_de_Espera_Con_Costo " + data.sortDirecction;
        break;
      case "Tiempo_de_Espera_Sin_Costo":
        sort = " Ejecucion_de_Vuelo.Tiempo_de_Espera_Sin_Costo " + data.sortDirecction;
        break;
      case "Pernoctas":
        sort = " Ejecucion_de_Vuelo.Pernoctas " + data.sortDirecction;
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
        condition += " AND Ejecucion_de_Vuelo.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Ejecucion_de_Vuelo.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Numero_de_Vuelo != 'undefined' && data.filterAdvanced.Numero_de_Vuelo)) {
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
    } else if (data.filterAdvanced.Numero_de_VueloMultiple != null && data.filterAdvanced.Numero_de_VueloMultiple.length > 0) {
      var Numero_de_Vuelods = data.filterAdvanced.Numero_de_VueloMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Numero_de_Vuelo In (" + Numero_de_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Tramo_de_Vuelo != 'undefined' && data.filterAdvanced.Tramo_de_Vuelo)) {
      switch (data.filterAdvanced.Tramo_de_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '" + data.filterAdvanced.Tramo_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo_de_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo = '" + data.filterAdvanced.Tramo_de_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.Tramo_de_VueloMultiple != null && data.filterAdvanced.Tramo_de_VueloMultiple.length > 0) {
      var Tramo_de_Vuelods = data.filterAdvanced.Tramo_de_VueloMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Tramo_de_Vuelo In (" + Tramo_de_Vuelods + ")";
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
      condition += " AND Ejecucion_de_Vuelo.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_Ala != 'undefined' && data.filterAdvanced.Tipo_de_Ala)) {
      switch (data.filterAdvanced.Tipo_de_AlaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Ala.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Ala + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Ala.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Ala + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Ala.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Ala + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Ala.Descripcion = '" + data.filterAdvanced.Tipo_de_Ala + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_AlaMultiple != null && data.filterAdvanced.Tipo_de_AlaMultiple.length > 0) {
      var Tipo_de_Alads = data.filterAdvanced.Tipo_de_AlaMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Tipo_de_Ala In (" + Tipo_de_Alads + ")";
    }
    if ((typeof data.filterAdvanced.fromSolicitud != 'undefined' && data.filterAdvanced.fromSolicitud)
      || (typeof data.filterAdvanced.toSolicitud != 'undefined' && data.filterAdvanced.toSolicitud)) {
      if (typeof data.filterAdvanced.fromSolicitud != 'undefined' && data.filterAdvanced.fromSolicitud)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Solicitud, 102)  >= '" + moment(data.filterAdvanced.fromSolicitud).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toSolicitud != 'undefined' && data.filterAdvanced.toSolicitud)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Solicitud, 102)  <= '" + moment(data.filterAdvanced.toSolicitud).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Origen != 'undefined' && data.filterAdvanced.Origen)) {
      switch (data.filterAdvanced.OrigenFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Descripcion LIKE '" + data.filterAdvanced.Origen + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Origen + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Origen + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Descripcion = '" + data.filterAdvanced.Origen + "'";
          break;
      }
    } else if (data.filterAdvanced.OrigenMultiple != null && data.filterAdvanced.OrigenMultiple.length > 0) {
      var Origends = data.filterAdvanced.OrigenMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Origen In (" + Origends + ")";
    }
    if ((typeof data.filterAdvanced.Destino != 'undefined' && data.filterAdvanced.Destino)) {
      switch (data.filterAdvanced.DestinoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos1.Descripcion LIKE '" + data.filterAdvanced.Destino + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos1.Descripcion LIKE '%" + data.filterAdvanced.Destino + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos1.Descripcion LIKE '%" + data.filterAdvanced.Destino + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos1.Descripcion = '" + data.filterAdvanced.Destino + "'";
          break;
      }
    } else if (data.filterAdvanced.DestinoMultiple != null && data.filterAdvanced.DestinoMultiple.length > 0) {
      var Destinods = data.filterAdvanced.DestinoMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Destino In (" + Destinods + ")";
    }
    if ((typeof data.filterAdvanced.fromDistancia_FIR_Km != 'undefined' && data.filterAdvanced.fromDistancia_FIR_Km)
      || (typeof data.filterAdvanced.toDistancia_FIR_Km != 'undefined' && data.filterAdvanced.toDistancia_FIR_Km)) {
      if (typeof data.filterAdvanced.fromDistancia_FIR_Km != 'undefined' && data.filterAdvanced.fromDistancia_FIR_Km)
        condition += " AND Ejecucion_de_Vuelo.Distancia_FIR_Km >= " + data.filterAdvanced.fromDistancia_FIR_Km;

      if (typeof data.filterAdvanced.toDistancia_FIR_Km != 'undefined' && data.filterAdvanced.toDistancia_FIR_Km)
        condition += " AND Ejecucion_de_Vuelo.Distancia_FIR_Km <= " + data.filterAdvanced.toDistancia_FIR_Km;
    }
    if ((typeof data.filterAdvanced.Comandante != 'undefined' && data.filterAdvanced.Comandante)) {
      switch (data.filterAdvanced.ComandanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tripulacion.Nombre_completo LIKE '" + data.filterAdvanced.Comandante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tripulacion.Nombre_completo LIKE '%" + data.filterAdvanced.Comandante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tripulacion.Nombre_completo LIKE '%" + data.filterAdvanced.Comandante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tripulacion.Nombre_completo = '" + data.filterAdvanced.Comandante + "'";
          break;
      }
    } else if (data.filterAdvanced.ComandanteMultiple != null && data.filterAdvanced.ComandanteMultiple.length > 0) {
      var Comandanteds = data.filterAdvanced.ComandanteMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Comandante In (" + Comandanteds + ")";
    }
    if ((typeof data.filterAdvanced.Capitan != 'undefined' && data.filterAdvanced.Capitan)) {
      switch (data.filterAdvanced.CapitanFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tripulacion1.Nombre_completo LIKE '" + data.filterAdvanced.Capitan + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tripulacion1.Nombre_completo LIKE '%" + data.filterAdvanced.Capitan + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tripulacion1.Nombre_completo LIKE '%" + data.filterAdvanced.Capitan + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tripulacion1.Nombre_completo = '" + data.filterAdvanced.Capitan + "'";
          break;
      }
    } else if (data.filterAdvanced.CapitanMultiple != null && data.filterAdvanced.CapitanMultiple.length > 0) {
      var Capitands = data.filterAdvanced.CapitanMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Capitan In (" + Capitands + ")";
    }
    if ((typeof data.filterAdvanced.Primer_Capitan != 'undefined' && data.filterAdvanced.Primer_Capitan)) {
      switch (data.filterAdvanced.Primer_CapitanFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tripulacion2.Nombres LIKE '" + data.filterAdvanced.Primer_Capitan + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tripulacion2.Nombres LIKE '%" + data.filterAdvanced.Primer_Capitan + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tripulacion2.Nombres LIKE '%" + data.filterAdvanced.Primer_Capitan + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tripulacion2.Nombres = '" + data.filterAdvanced.Primer_Capitan + "'";
          break;
      }
    } else if (data.filterAdvanced.Primer_CapitanMultiple != null && data.filterAdvanced.Primer_CapitanMultiple.length > 0) {
      var Primer_Capitands = data.filterAdvanced.Primer_CapitanMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Primer_Capitan In (" + Primer_Capitands + ")";
    }
    if ((typeof data.filterAdvanced.Segundo_Capitan != 'undefined' && data.filterAdvanced.Segundo_Capitan)) {
      switch (data.filterAdvanced.Segundo_CapitanFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tripulacion3.Nombres LIKE '" + data.filterAdvanced.Segundo_Capitan + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tripulacion3.Nombres LIKE '%" + data.filterAdvanced.Segundo_Capitan + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tripulacion3.Nombres LIKE '%" + data.filterAdvanced.Segundo_Capitan + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tripulacion3.Nombres = '" + data.filterAdvanced.Segundo_Capitan + "'";
          break;
      }
    } else if (data.filterAdvanced.Segundo_CapitanMultiple != null && data.filterAdvanced.Segundo_CapitanMultiple.length > 0) {
      var Segundo_Capitands = data.filterAdvanced.Segundo_CapitanMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Segundo_Capitan In (" + Segundo_Capitands + ")";
    }
    if ((typeof data.filterAdvanced.Sobrecargo != 'undefined' && data.filterAdvanced.Sobrecargo)) {
      switch (data.filterAdvanced.SobrecargoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tripulacion4.Nombre_completo LIKE '" + data.filterAdvanced.Sobrecargo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tripulacion4.Nombre_completo LIKE '%" + data.filterAdvanced.Sobrecargo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tripulacion4.Nombre_completo LIKE '%" + data.filterAdvanced.Sobrecargo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tripulacion4.Nombre_completo = '" + data.filterAdvanced.Sobrecargo + "'";
          break;
      }
    } else if (data.filterAdvanced.SobrecargoMultiple != null && data.filterAdvanced.SobrecargoMultiple.length > 0) {
      var Sobrecargods = data.filterAdvanced.SobrecargoMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Sobrecargo In (" + Sobrecargods + ")";
    }
    if ((typeof data.filterAdvanced.Administrador_del_Vuelo != 'undefined' && data.filterAdvanced.Administrador_del_Vuelo)) {
      switch (data.filterAdvanced.Administrador_del_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tripulacion5.Nombre_completo LIKE '" + data.filterAdvanced.Administrador_del_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tripulacion5.Nombre_completo LIKE '%" + data.filterAdvanced.Administrador_del_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tripulacion5.Nombre_completo LIKE '%" + data.filterAdvanced.Administrador_del_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tripulacion5.Nombre_completo = '" + data.filterAdvanced.Administrador_del_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.Administrador_del_VueloMultiple != null && data.filterAdvanced.Administrador_del_VueloMultiple.length > 0) {
      var Administrador_del_Vuelods = data.filterAdvanced.Administrador_del_VueloMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Administrador_del_Vuelo In (" + Administrador_del_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_Vuelo != 'undefined' && data.filterAdvanced.Tipo_de_Vuelo)) {
      switch (data.filterAdvanced.Tipo_de_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_vuelo.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_vuelo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_vuelo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_vuelo.Descripcion = '" + data.filterAdvanced.Tipo_de_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_VueloMultiple != null && data.filterAdvanced.Tipo_de_VueloMultiple.length > 0) {
      var Tipo_de_Vuelods = data.filterAdvanced.Tipo_de_VueloMultiple.join(",");
      condition += " AND Ejecucion_de_Vuelo.Tipo_de_Vuelo In (" + Tipo_de_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.fromPasajeros_Adicionales != 'undefined' && data.filterAdvanced.fromPasajeros_Adicionales)
      || (typeof data.filterAdvanced.toPasajeros_Adicionales != 'undefined' && data.filterAdvanced.toPasajeros_Adicionales)) {
      if (typeof data.filterAdvanced.fromPasajeros_Adicionales != 'undefined' && data.filterAdvanced.fromPasajeros_Adicionales)
        condition += " AND Ejecucion_de_Vuelo.Pasajeros_Adicionales >= " + data.filterAdvanced.fromPasajeros_Adicionales;

      if (typeof data.filterAdvanced.toPasajeros_Adicionales != 'undefined' && data.filterAdvanced.toPasajeros_Adicionales)
        condition += " AND Ejecucion_de_Vuelo.Pasajeros_Adicionales <= " + data.filterAdvanced.toPasajeros_Adicionales;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Salida != 'undefined' && data.filterAdvanced.fromFecha_de_Salida)
      || (typeof data.filterAdvanced.toFecha_de_Salida != 'undefined' && data.filterAdvanced.toFecha_de_Salida)) {
      if (typeof data.filterAdvanced.fromFecha_de_Salida != 'undefined' && data.filterAdvanced.fromFecha_de_Salida)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Salida, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Salida).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Salida != 'undefined' && data.filterAdvanced.toFecha_de_Salida)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Salida, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Salida).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Salida != 'undefined' && data.filterAdvanced.fromHora_de_Salida)
      || (typeof data.filterAdvanced.toHora_de_Salida != 'undefined' && data.filterAdvanced.toHora_de_Salida)) {
      if (typeof data.filterAdvanced.fromHora_de_Salida != 'undefined' && data.filterAdvanced.fromHora_de_Salida)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Salida >= '" + data.filterAdvanced.fromHora_de_Salida + "'";

      if (typeof data.filterAdvanced.toHora_de_Salida != 'undefined' && data.filterAdvanced.toHora_de_Salida)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Salida <= '" + data.filterAdvanced.toHora_de_Salida + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Llegada != 'undefined' && data.filterAdvanced.fromFecha_de_Llegada)
      || (typeof data.filterAdvanced.toFecha_de_Llegada != 'undefined' && data.filterAdvanced.toFecha_de_Llegada)) {
      if (typeof data.filterAdvanced.fromFecha_de_Llegada != 'undefined' && data.filterAdvanced.fromFecha_de_Llegada)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Llegada, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Llegada).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Llegada != 'undefined' && data.filterAdvanced.toFecha_de_Llegada)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Llegada, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Llegada).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Llegada != 'undefined' && data.filterAdvanced.fromHora_de_Llegada)
      || (typeof data.filterAdvanced.toHora_de_Llegada != 'undefined' && data.filterAdvanced.toHora_de_Llegada)) {
      if (typeof data.filterAdvanced.fromHora_de_Llegada != 'undefined' && data.filterAdvanced.fromHora_de_Llegada)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Llegada >= '" + data.filterAdvanced.fromHora_de_Llegada + "'";

      if (typeof data.filterAdvanced.toHora_de_Llegada != 'undefined' && data.filterAdvanced.toHora_de_Llegada)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Llegada <= '" + data.filterAdvanced.toHora_de_Llegada + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Despegue != 'undefined' && data.filterAdvanced.fromFecha_de_Despegue)
      || (typeof data.filterAdvanced.toFecha_de_Despegue != 'undefined' && data.filterAdvanced.toFecha_de_Despegue)) {
      if (typeof data.filterAdvanced.fromFecha_de_Despegue != 'undefined' && data.filterAdvanced.fromFecha_de_Despegue)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Despegue, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Despegue).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Despegue != 'undefined' && data.filterAdvanced.toFecha_de_Despegue)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Despegue, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Despegue).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Despegue != 'undefined' && data.filterAdvanced.fromHora_de_Despegue)
      || (typeof data.filterAdvanced.toHora_de_Despegue != 'undefined' && data.filterAdvanced.toHora_de_Despegue)) {
      if (typeof data.filterAdvanced.fromHora_de_Despegue != 'undefined' && data.filterAdvanced.fromHora_de_Despegue)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Despegue >= '" + data.filterAdvanced.fromHora_de_Despegue + "'";

      if (typeof data.filterAdvanced.toHora_de_Despegue != 'undefined' && data.filterAdvanced.toHora_de_Despegue)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Despegue <= '" + data.filterAdvanced.toHora_de_Despegue + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Aterrizaje != 'undefined' && data.filterAdvanced.fromFecha_de_Aterrizaje)
      || (typeof data.filterAdvanced.toFecha_de_Aterrizaje != 'undefined' && data.filterAdvanced.toFecha_de_Aterrizaje)) {
      if (typeof data.filterAdvanced.fromFecha_de_Aterrizaje != 'undefined' && data.filterAdvanced.fromFecha_de_Aterrizaje)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Aterrizaje, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Aterrizaje).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Aterrizaje != 'undefined' && data.filterAdvanced.toFecha_de_Aterrizaje)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Aterrizaje, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Aterrizaje).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Aterrizaje != 'undefined' && data.filterAdvanced.fromHora_de_Aterrizaje)
      || (typeof data.filterAdvanced.toHora_de_Aterrizaje != 'undefined' && data.filterAdvanced.toHora_de_Aterrizaje)) {
      if (typeof data.filterAdvanced.fromHora_de_Aterrizaje != 'undefined' && data.filterAdvanced.fromHora_de_Aterrizaje)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Aterrizaje >= '" + data.filterAdvanced.fromHora_de_Aterrizaje + "'";

      if (typeof data.filterAdvanced.toHora_de_Aterrizaje != 'undefined' && data.filterAdvanced.toHora_de_Aterrizaje)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Aterrizaje <= '" + data.filterAdvanced.toHora_de_Aterrizaje + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Salida_Local != 'undefined' && data.filterAdvanced.fromFecha_de_Salida_Local)
      || (typeof data.filterAdvanced.toFecha_de_Salida_Local != 'undefined' && data.filterAdvanced.toFecha_de_Salida_Local)) {
      if (typeof data.filterAdvanced.fromFecha_de_Salida_Local != 'undefined' && data.filterAdvanced.fromFecha_de_Salida_Local)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Salida_Local, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Salida_Local).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Salida_Local != 'undefined' && data.filterAdvanced.toFecha_de_Salida_Local)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Salida_Local, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Salida_Local).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Salida_Local != 'undefined' && data.filterAdvanced.fromHora_de_Salida_Local)
      || (typeof data.filterAdvanced.toHora_de_Salida_Local != 'undefined' && data.filterAdvanced.toHora_de_Salida_Local)) {
      if (typeof data.filterAdvanced.fromHora_de_Salida_Local != 'undefined' && data.filterAdvanced.fromHora_de_Salida_Local)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Salida_Local >= '" + data.filterAdvanced.fromHora_de_Salida_Local + "'";

      if (typeof data.filterAdvanced.toHora_de_Salida_Local != 'undefined' && data.filterAdvanced.toHora_de_Salida_Local)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Salida_Local <= '" + data.filterAdvanced.toHora_de_Salida_Local + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Llegada_Local != 'undefined' && data.filterAdvanced.fromFecha_de_Llegada_Local)
      || (typeof data.filterAdvanced.toFecha_de_Llegada_Local != 'undefined' && data.filterAdvanced.toFecha_de_Llegada_Local)) {
      if (typeof data.filterAdvanced.fromFecha_de_Llegada_Local != 'undefined' && data.filterAdvanced.fromFecha_de_Llegada_Local)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Llegada_Local, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Llegada_Local).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Llegada_Local != 'undefined' && data.filterAdvanced.toFecha_de_Llegada_Local)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Llegada_Local, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Llegada_Local).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Llegada_Local != 'undefined' && data.filterAdvanced.fromHora_de_Llegada_Local)
      || (typeof data.filterAdvanced.toHora_de_Llegada_Local != 'undefined' && data.filterAdvanced.toHora_de_Llegada_Local)) {
      if (typeof data.filterAdvanced.fromHora_de_Llegada_Local != 'undefined' && data.filterAdvanced.fromHora_de_Llegada_Local)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Llegada_Local >= '" + data.filterAdvanced.fromHora_de_Llegada_Local + "'";

      if (typeof data.filterAdvanced.toHora_de_Llegada_Local != 'undefined' && data.filterAdvanced.toHora_de_Llegada_Local)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Llegada_Local <= '" + data.filterAdvanced.toHora_de_Llegada_Local + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Despegue_Local != 'undefined' && data.filterAdvanced.fromFecha_de_Despegue_Local)
      || (typeof data.filterAdvanced.toFecha_de_Despegue_Local != 'undefined' && data.filterAdvanced.toFecha_de_Despegue_Local)) {
      if (typeof data.filterAdvanced.fromFecha_de_Despegue_Local != 'undefined' && data.filterAdvanced.fromFecha_de_Despegue_Local)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Despegue_Local, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Despegue_Local).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Despegue_Local != 'undefined' && data.filterAdvanced.toFecha_de_Despegue_Local)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Despegue_Local, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Despegue_Local).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Despegue_Local != 'undefined' && data.filterAdvanced.fromHora_de_Despegue_Local)
      || (typeof data.filterAdvanced.toHora_de_Despegue_Local != 'undefined' && data.filterAdvanced.toHora_de_Despegue_Local)) {
      if (typeof data.filterAdvanced.fromHora_de_Despegue_Local != 'undefined' && data.filterAdvanced.fromHora_de_Despegue_Local)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Despegue_Local >= '" + data.filterAdvanced.fromHora_de_Despegue_Local + "'";

      if (typeof data.filterAdvanced.toHora_de_Despegue_Local != 'undefined' && data.filterAdvanced.toHora_de_Despegue_Local)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Despegue_Local <= '" + data.filterAdvanced.toHora_de_Despegue_Local + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Aterrizaje_Local != 'undefined' && data.filterAdvanced.fromFecha_de_Aterrizaje_Local)
      || (typeof data.filterAdvanced.toFecha_de_Aterrizaje_Local != 'undefined' && data.filterAdvanced.toFecha_de_Aterrizaje_Local)) {
      if (typeof data.filterAdvanced.fromFecha_de_Aterrizaje_Local != 'undefined' && data.filterAdvanced.fromFecha_de_Aterrizaje_Local)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Aterrizaje_Local, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Aterrizaje_Local).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Aterrizaje_Local != 'undefined' && data.filterAdvanced.toFecha_de_Aterrizaje_Local)
        condition += " and CONVERT(VARCHAR(10), Ejecucion_de_Vuelo.Fecha_de_Aterrizaje_Local, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Aterrizaje_Local).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Aterrizaje_Local != 'undefined' && data.filterAdvanced.fromHora_de_Aterrizaje_Local)
      || (typeof data.filterAdvanced.toHora_de_Aterrizaje_Local != 'undefined' && data.filterAdvanced.toHora_de_Aterrizaje_Local)) {
      if (typeof data.filterAdvanced.fromHora_de_Aterrizaje_Local != 'undefined' && data.filterAdvanced.fromHora_de_Aterrizaje_Local)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Aterrizaje_Local >= '" + data.filterAdvanced.fromHora_de_Aterrizaje_Local + "'";

      if (typeof data.filterAdvanced.toHora_de_Aterrizaje_Local != 'undefined' && data.filterAdvanced.toHora_de_Aterrizaje_Local)
        condition += " and Ejecucion_de_Vuelo.Hora_de_Aterrizaje_Local <= '" + data.filterAdvanced.toHora_de_Aterrizaje_Local + "'";
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Calzo != 'undefined' && data.filterAdvanced.fromTiempo_de_Calzo)
      || (typeof data.filterAdvanced.toTiempo_de_Calzo != 'undefined' && data.filterAdvanced.toTiempo_de_Calzo)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Calzo != 'undefined' && data.filterAdvanced.fromTiempo_de_Calzo)
        condition += " and Ejecucion_de_Vuelo.Tiempo_de_Calzo >= '" + data.filterAdvanced.fromTiempo_de_Calzo + "'";

      if (typeof data.filterAdvanced.toTiempo_de_Calzo != 'undefined' && data.filterAdvanced.toTiempo_de_Calzo)
        condition += " and Ejecucion_de_Vuelo.Tiempo_de_Calzo <= '" + data.filterAdvanced.toTiempo_de_Calzo + "'";
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.fromTiempo_de_Vuelo)
      || (typeof data.filterAdvanced.toTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.toTiempo_de_Vuelo)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.fromTiempo_de_Vuelo)
        condition += " and Ejecucion_de_Vuelo.Tiempo_de_Vuelo >= '" + data.filterAdvanced.fromTiempo_de_Vuelo + "'";

      if (typeof data.filterAdvanced.toTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.toTiempo_de_Vuelo)
        condition += " and Ejecucion_de_Vuelo.Tiempo_de_Vuelo <= '" + data.filterAdvanced.toTiempo_de_Vuelo + "'";
    }
    if ((typeof data.filterAdvanced.fromDistancia_en_Millas != 'undefined' && data.filterAdvanced.fromDistancia_en_Millas)
      || (typeof data.filterAdvanced.toDistancia_en_Millas != 'undefined' && data.filterAdvanced.toDistancia_en_Millas)) {
      if (typeof data.filterAdvanced.fromDistancia_en_Millas != 'undefined' && data.filterAdvanced.fromDistancia_en_Millas)
        condition += " AND Ejecucion_de_Vuelo.Distancia_en_Millas >= " + data.filterAdvanced.fromDistancia_en_Millas;

      if (typeof data.filterAdvanced.toDistancia_en_Millas != 'undefined' && data.filterAdvanced.toDistancia_en_Millas)
        condition += " AND Ejecucion_de_Vuelo.Distancia_en_Millas <= " + data.filterAdvanced.toDistancia_en_Millas;
    }
    if ((typeof data.filterAdvanced.fromCombustible__Cargado != 'undefined' && data.filterAdvanced.fromCombustible__Cargado)
      || (typeof data.filterAdvanced.toCombustible__Cargado != 'undefined' && data.filterAdvanced.toCombustible__Cargado)) {
      if (typeof data.filterAdvanced.fromCombustible__Cargado != 'undefined' && data.filterAdvanced.fromCombustible__Cargado)
        condition += " AND Ejecucion_de_Vuelo.Combustible__Cargado >= " + data.filterAdvanced.fromCombustible__Cargado;

      if (typeof data.filterAdvanced.toCombustible__Cargado != 'undefined' && data.filterAdvanced.toCombustible__Cargado)
        condition += " AND Ejecucion_de_Vuelo.Combustible__Cargado <= " + data.filterAdvanced.toCombustible__Cargado;
    }
    if ((typeof data.filterAdvanced.fromCombustible__Despegue != 'undefined' && data.filterAdvanced.fromCombustible__Despegue)
      || (typeof data.filterAdvanced.toCombustible__Despegue != 'undefined' && data.filterAdvanced.toCombustible__Despegue)) {
      if (typeof data.filterAdvanced.fromCombustible__Despegue != 'undefined' && data.filterAdvanced.fromCombustible__Despegue)
        condition += " AND Ejecucion_de_Vuelo.Combustible__Despegue >= " + data.filterAdvanced.fromCombustible__Despegue;

      if (typeof data.filterAdvanced.toCombustible__Despegue != 'undefined' && data.filterAdvanced.toCombustible__Despegue)
        condition += " AND Ejecucion_de_Vuelo.Combustible__Despegue <= " + data.filterAdvanced.toCombustible__Despegue;
    }
    if ((typeof data.filterAdvanced.fromCombustible__Aterrizaje != 'undefined' && data.filterAdvanced.fromCombustible__Aterrizaje)
      || (typeof data.filterAdvanced.toCombustible__Aterrizaje != 'undefined' && data.filterAdvanced.toCombustible__Aterrizaje)) {
      if (typeof data.filterAdvanced.fromCombustible__Aterrizaje != 'undefined' && data.filterAdvanced.fromCombustible__Aterrizaje)
        condition += " AND Ejecucion_de_Vuelo.Combustible__Aterrizaje >= " + data.filterAdvanced.fromCombustible__Aterrizaje;

      if (typeof data.filterAdvanced.toCombustible__Aterrizaje != 'undefined' && data.filterAdvanced.toCombustible__Aterrizaje)
        condition += " AND Ejecucion_de_Vuelo.Combustible__Aterrizaje <= " + data.filterAdvanced.toCombustible__Aterrizaje;
    }
    if ((typeof data.filterAdvanced.fromCombustible__Consumo != 'undefined' && data.filterAdvanced.fromCombustible__Consumo)
      || (typeof data.filterAdvanced.toCombustible__Consumo != 'undefined' && data.filterAdvanced.toCombustible__Consumo)) {
      if (typeof data.filterAdvanced.fromCombustible__Consumo != 'undefined' && data.filterAdvanced.fromCombustible__Consumo)
        condition += " AND Ejecucion_de_Vuelo.Combustible__Consumo >= " + data.filterAdvanced.fromCombustible__Consumo;

      if (typeof data.filterAdvanced.toCombustible__Consumo != 'undefined' && data.filterAdvanced.toCombustible__Consumo)
        condition += " AND Ejecucion_de_Vuelo.Combustible__Consumo <= " + data.filterAdvanced.toCombustible__Consumo;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ejecucion_de_Vuelo.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ejecucion_de_Vuelo.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ejecucion_de_Vuelo.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ejecucion_de_Vuelo.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    switch (data.filterAdvanced.Reportes_de_la_AeronaveFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ejecucion_de_Vuelo.Reportes_de_la_Aeronave LIKE '" + data.filterAdvanced.Reportes_de_la_Aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ejecucion_de_Vuelo.Reportes_de_la_Aeronave LIKE '%" + data.filterAdvanced.Reportes_de_la_Aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ejecucion_de_Vuelo.Reportes_de_la_Aeronave LIKE '%" + data.filterAdvanced.Reportes_de_la_Aeronave + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ejecucion_de_Vuelo.Reportes_de_la_Aeronave = '" + data.filterAdvanced.Reportes_de_la_Aeronave + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Espera_Paso != 'undefined' && data.filterAdvanced.fromTiempo_de_Espera_Paso)
      || (typeof data.filterAdvanced.toTiempo_de_Espera_Paso != 'undefined' && data.filterAdvanced.toTiempo_de_Espera_Paso)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Espera_Paso != 'undefined' && data.filterAdvanced.fromTiempo_de_Espera_Paso)
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Paso >= " + data.filterAdvanced.fromTiempo_de_Espera_Paso;

      if (typeof data.filterAdvanced.toTiempo_de_Espera_Paso != 'undefined' && data.filterAdvanced.toTiempo_de_Espera_Paso)
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Paso <= " + data.filterAdvanced.toTiempo_de_Espera_Paso;
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Espera != 'undefined' && data.filterAdvanced.fromTiempo_de_Espera)
      || (typeof data.filterAdvanced.toTiempo_de_Espera != 'undefined' && data.filterAdvanced.toTiempo_de_Espera)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Espera != 'undefined' && data.filterAdvanced.fromTiempo_de_Espera)
        condition += " and Ejecucion_de_Vuelo.Tiempo_de_Espera >= '" + data.filterAdvanced.fromTiempo_de_Espera + "'";

      if (typeof data.filterAdvanced.toTiempo_de_Espera != 'undefined' && data.filterAdvanced.toTiempo_de_Espera)
        condition += " and Ejecucion_de_Vuelo.Tiempo_de_Espera <= '" + data.filterAdvanced.toTiempo_de_Espera + "'";
    }
    switch (data.filterAdvanced.Tiempo_de_Espera_Con_CostoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Con_Costo LIKE '" + data.filterAdvanced.Tiempo_de_Espera_Con_Costo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Con_Costo LIKE '%" + data.filterAdvanced.Tiempo_de_Espera_Con_Costo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Con_Costo LIKE '%" + data.filterAdvanced.Tiempo_de_Espera_Con_Costo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Con_Costo = '" + data.filterAdvanced.Tiempo_de_Espera_Con_Costo + "'";
        break;
    }
    switch (data.filterAdvanced.Tiempo_de_Espera_Sin_CostoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Sin_Costo LIKE '" + data.filterAdvanced.Tiempo_de_Espera_Sin_Costo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Sin_Costo LIKE '%" + data.filterAdvanced.Tiempo_de_Espera_Sin_Costo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Sin_Costo LIKE '%" + data.filterAdvanced.Tiempo_de_Espera_Sin_Costo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ejecucion_de_Vuelo.Tiempo_de_Espera_Sin_Costo = '" + data.filterAdvanced.Tiempo_de_Espera_Sin_Costo + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromPernoctas != 'undefined' && data.filterAdvanced.fromPernoctas)
      || (typeof data.filterAdvanced.toPernoctas != 'undefined' && data.filterAdvanced.toPernoctas)) {
      if (typeof data.filterAdvanced.fromPernoctas != 'undefined' && data.filterAdvanced.fromPernoctas)
        condition += " AND Ejecucion_de_Vuelo.Pernoctas >= " + data.filterAdvanced.fromPernoctas;

      if (typeof data.filterAdvanced.toPernoctas != 'undefined' && data.filterAdvanced.toPernoctas)
        condition += " AND Ejecucion_de_Vuelo.Pernoctas <= " + data.filterAdvanced.toPernoctas;
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
              const longest = result.Ejecucion_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ejecucion_de_Vuelos);
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
