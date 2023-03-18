import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { CotizacionService } from "src/app/api-services/Cotizacion.service";
import { Cotizacion } from "src/app/models/Cotizacion";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2, OnDestroy } from "@angular/core";
import { CollectionViewer } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of, Subscription } from "rxjs";
import { catchError, finalize, concatMap, switchMap, mergeMap, tap, filter } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import * as AppConstants from "../../../app-constants";
import { StorageKeys } from "../../../app-constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { CotizacionIndexRules } from 'src/app/shared/businessRules/Cotizacion-index-rules';
import { DialogConfirmExportComponent } from "./../../../shared/views/dialogs/dialog-confirm-export/dialog-confirm-export.component";
import { Enumerations } from 'src/app/models/enumerations';
import _, { map } from 'underscore';
import { ExcelService } from "src/app/api-services/excel.service";
import * as momentJS from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogPrintFormatComponent } from './../../../shared/views/dialogs/dialog-print-format/dialog-print-format.component';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { CotizacionRoutingModule } from '../Cotizacion-routing.module';
import { PrintHelper } from "./../../../helpers/print-helper";
import { FormatPrintEnum } from 'src/app/models/enums/formatPrint.enum';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-list-Cotizacion",
  templateUrl: "./list-Cotizacion.component.html",
  styleUrls: ["./list-Cotizacion.component.scss"],
})
export class ListCotizacionComponent extends CotizacionIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  phase: any = 0;
  displayedColumns = [
    "acciones",
    "Folio",
    "Fecha_de_Registro",
    "Hora_de_Registro",
    "Usuario_que_Registra",
    "Numero_de_Cotizacion",
    "Orden_de_Trabajo_Origen",
    "Orden_de_Trabajo_Generada",
    "Tipo_de_Reporte",
    "Tipo_de_ingreso",
    "Cliente",
    "Matricula",
    "Modelo",
    "Contacto",
    "Tiempo_de_Ejecucion",
    "Enviar_Cotizacion_a_Cliente",
    "Redaccion_Correo_para_Cliente",
    "Estatus",
    "Mano_de_Obra",
    "Partes",
    "Consumibles",
    "Total",
    "Porcentaje_de_Consumibles",
    "Porcentaje_de_Anticipo",
    "Comentarios_Mantenimiento",
    "Reporte",
    "Item_de_Inspeccion",
    "Motivo_de_Edicion",
    "Observaciones",
    "Fecha_de_Respuesta",
    "Hora_de_Respuesta",
    "Usuario_que_Registra_Respuesta",
    "Respuesta",
    "Observaciones_Respeusta",
    "Dia_de_Llegada_del_Avion",
    "Hora_de_Llegada_del_Avion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Numero_de_Cotizacion",
      "Orden_de_Trabajo_Origen",
      "Orden_de_Trabajo_Generada",
      "Tipo_de_Reporte",
      "Tipo_de_ingreso",
      "Cliente",
      "Matricula",
      "Modelo",
      "Contacto",
      "Tiempo_de_Ejecucion",
      "Enviar_Cotizacion_a_Cliente",
      "Redaccion_Correo_para_Cliente",
      "Clausulas_Especificas",
      "Clausulas_Generales",
      "Estatus",
      "Mano_de_Obra",
      "Partes",
      "Consumibles",
      "Total",
      "Porcentaje_de_Consumibles",
      "Porcentaje_de_Anticipo",
      "Comentarios_Mantenimiento",
      "Reporte",
      "Item_de_Inspeccion",
      "Motivo_de_Edicion",
      "Observaciones",
      "Fecha_de_Respuesta",
      "Hora_de_Respuesta",
      "Usuario_que_Registra_Respuesta",
      "Respuesta",
      "Observaciones_Respeusta",
      "Dia_de_Llegada_del_Avion",
      "Hora_de_Llegada_del_Avion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Numero_de_Cotizacion_filtro",
      "Orden_de_Trabajo_Origen_filtro",
      "Orden_de_Trabajo_Generada_filtro",
      "Tipo_de_Reporte_filtro",
      "Tipo_de_ingreso_filtro",
      "Cliente_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Contacto_filtro",
      "Tiempo_de_Ejecucion_filtro",
      "Enviar_Cotizacion_a_Cliente_filtro",
      "Redaccion_Correo_para_Cliente_filtro",
      "Clausulas_Especificas_filtro",
      "Clausulas_Generales_filtro",
      "Estatus_filtro",
      "Mano_de_Obra_filtro",
      "Partes_filtro",
      "Consumibles_filtro",
      "Total_filtro",
      "Porcentaje_de_Consumibles_filtro",
      "Porcentaje_de_Anticipo_filtro",
      "Comentarios_Mantenimiento_filtro",
      "Reporte_filtro",
      "Item_de_Inspeccion_filtro",
      "Motivo_de_Edicion_filtro",
      "Observaciones_filtro",
      "Fecha_de_Respuesta_filtro",
      "Hora_de_Respuesta_filtro",
      "Usuario_que_Registra_Respuesta_filtro",
      "Respuesta_filtro",
      "Observaciones_Respeusta_filtro",
      "Dia_de_Llegada_del_Avion_filtro",
      "Hora_de_Llegada_del_Avion_filtro",

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
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Numero_de_Cotizacion: "",
      Orden_de_Trabajo_Origen: "",
      Orden_de_Trabajo_Generada: "",
      Tipo_de_Reporte: "",
      Tipo_de_ingreso: "",
      Cliente: "",
      Matricula: "",
      Modelo: "",
      Contacto: "",
      Tiempo_de_Ejecucion: "",
      Enviar_Cotizacion_a_Cliente: "",
      Redaccion_Correo_para_Cliente: "",
      Estatus: "",
      Mano_de_Obra: "",
      Partes: "",
      Consumibles: "",
      Total: "",
      Porcentaje_de_Consumibles: "",
      Porcentaje_de_Anticipo: "",
      Comentarios_Mantenimiento: "",
      Reporte: "",
      Item_de_Inspeccion: "",
      Motivo_de_Edicion: "",
      Observaciones: "",
      Fecha_de_Respuesta: null,
      Hora_de_Respuesta: "",
      Usuario_que_Registra_Respuesta: "",
      Respuesta: "",
      Observaciones_Respeusta: "",
      Dia_de_Llegada_del_Avion: null,
      Hora_de_Llegada_del_Avion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      Orden_de_Trabajo_OrigenFilter: "",
      Orden_de_Trabajo_Origen: "",
      Orden_de_Trabajo_OrigenMultiple: "",
      Orden_de_Trabajo_GeneradaFilter: "",
      Orden_de_Trabajo_Generada: "",
      Orden_de_Trabajo_GeneradaMultiple: "",
      Tipo_de_ReporteFilter: "",
      Tipo_de_Reporte: "",
      Tipo_de_ReporteMultiple: "",
      Tipo_de_ingresoFilter: "",
      Tipo_de_ingreso: "",
      Tipo_de_ingresoMultiple: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromTiempo_de_Ejecucion: "",
      toTiempo_de_Ejecucion: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromMano_de_Obra: "",
      toMano_de_Obra: "",
      fromPartes: "",
      toPartes: "",
      fromConsumibles: "",
      toConsumibles: "",
      fromTotal: "",
      toTotal: "",
      fromPorcentaje_de_Consumibles: "",
      toPorcentaje_de_Consumibles: "",
      fromPorcentaje_de_Anticipo: "",
      toPorcentaje_de_Anticipo: "",
      ReporteFilter: "",
      Reporte: "",
      ReporteMultiple: "",
      fromItem_de_Inspeccion: "",
      toItem_de_Inspeccion: "",
      Motivo_de_EdicionFilter: "",
      Motivo_de_Edicion: "",
      Motivo_de_EdicionMultiple: "",
      fromFecha_de_Respuesta: "",
      toFecha_de_Respuesta: "",
      fromHora_de_Respuesta: "",
      toHora_de_Respuesta: "",
      Usuario_que_Registra_RespuestaFilter: "",
      Usuario_que_Registra_Respuesta: "",
      Usuario_que_Registra_RespuestaMultiple: "",
      RespuestaFilter: "",
      Respuesta: "",
      RespuestaMultiple: "",
      fromDia_de_Llegada_del_Avion: "",
      toDia_de_Llegada_del_Avion: "",
      fromHora_de_Llegada_del_Avion: "",
      toHora_de_Llegada_del_Avion: "",

    }
  };
  public id: any;
  RoleId: number = 0;
  UserId: number = 0;
  Phase: any

  dataSource: CotizacionDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: CotizacionDataSource;
  dataClipboard: any;

  public subscriber: Subscription
  constructor(
    private _CotizacionService: CotizacionService,
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
    route: Router, renderer: Renderer2,
    private printHelper: PrintHelper,
  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);
    const User = this.localStorageHelper.getLoggedUserInfo();
    this.UserId = User.UserId
    this.RoleId = User.RoleId

    this.subscriber = route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      this.activateRoute.paramMap.subscribe(
        params => {
          this.id = params.get('phase');
          console.log(this.id)
        });
      this.localStorageHelper.setItemToLocalStorage('Phase', this.id);
      this.Phase = this.id
      this.rulesBeforeCreationList();
      this.dataSource = new CotizacionDataSource(
        this._CotizacionService, this._file, this.id
      );
      this.init();
    });


  }


  ngOnInit() {
    // this.activateRoute.paramMap.subscribe(
    //   params => {
    //     this.phase = params.get('phase');
    //     if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") != this.phase) {
    //       this.localStorageHelper.setItemToLocalStorage("QueryParam", this.phase);
    //       this.ngOnInit();
    //     }
    //   });
    // this.rulesBeforeCreationList();
    // this.dataSource = new CotizacionDataSource(
    //   this._CotizacionService, this._file
    // );
    // this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Cotizacion)
      .subscribe((response) => {
        console.log(response)
        this.permisos = response;
      });

  }

  ngOnDestroy() {
    this.subscriber?.unsubscribe();
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
    this.listConfig.filter.Fecha_de_Registro = undefined;
    this.listConfig.filter.Hora_de_Registro = "";
    this.listConfig.filter.Usuario_que_Registra = "";
    this.listConfig.filter.Numero_de_Cotizacion = "";
    this.listConfig.filter.Orden_de_Trabajo_Origen = "";
    this.listConfig.filter.Orden_de_Trabajo_Generada = "";
    this.listConfig.filter.Tipo_de_Reporte = "";
    this.listConfig.filter.Tipo_de_ingreso = "";
    this.listConfig.filter.Cliente = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Contacto = "";
    this.listConfig.filter.Tiempo_de_Ejecucion = "";
    this.listConfig.filter.Enviar_Cotizacion_a_Cliente = undefined;
    this.listConfig.filter.Redaccion_Correo_para_Cliente = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Mano_de_Obra = "";
    this.listConfig.filter.Partes = "";
    this.listConfig.filter.Consumibles = "";
    this.listConfig.filter.Total = "";
    this.listConfig.filter.Porcentaje_de_Consumibles = "";
    this.listConfig.filter.Porcentaje_de_Anticipo = "";
    this.listConfig.filter.Comentarios_Mantenimiento = "";
    this.listConfig.filter.Reporte = "";
    this.listConfig.filter.Item_de_Inspeccion = "";
    this.listConfig.filter.Motivo_de_Edicion = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.Fecha_de_Respuesta = undefined;
    this.listConfig.filter.Hora_de_Respuesta = "";
    this.listConfig.filter.Usuario_que_Registra_Respuesta = "";
    this.listConfig.filter.Respuesta = "";
    this.listConfig.filter.Observaciones_Respeusta = "";
    this.listConfig.filter.Dia_de_Llegada_del_Avion = undefined;
    this.listConfig.filter.Hora_de_Llegada_del_Avion = "";

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

    //INICIA - BRID:357 - si la fase es diferente de 3 ocultar checkbox de agregar a cotizacion,"se modifico js para ocultar checkbox" - Autor: Ivan Yañez - Actualización: 2/12/2021 12:35:56 PM
    if (this.phase != 3) {
      if ("true" == "true") {
        this.brf.HideFieldofMultirenglon(this.displayedColumns, "Motivo_de_EdicionDescripcion")
      }
      else {
        this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Motivo_de_EdicionDescripcion")
      }
    }
    //TERMINA - BRID:357


    //INICIA - BRID:367 - ocultar columnas que no se ocupan en el listado - Autor: Administrador - Actualización: 2/12/2021 6:13:36 PM
    if ("true" == "true") {
      this.brf.HideFieldofMultirenglon(this.displayedColumns, "Clausulas_Especificas")
    } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Clausulas_Especificas") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Clausulas_Generales") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Clausulas_Generales") }
    //TERMINA - BRID:367

    //rulesAfterCreationList_ExecuteBusinessRulesEnd


  }

  rulesBeforeCreationList() {
    //rulesBeforeCreationList_ExecuteBusinessRulesInit

    //INICIA - BRID:7115 - WF:2 Rule List - Phase: 3 (Por enviar a Cliente) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 3) { this.brf.SetFilteronList(this.listConfig, " Cotizacion.Estatus = 1 "); } else { }
    //TERMINA - BRID:7115


    //INICIA - BRID:7117 - WF:2 Rule List - Phase: 4 (Por Autorizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 4) { this.brf.SetFilteronList(this.listConfig, " Cotizacion.Estatus = 2 "); } else { }
    //TERMINA - BRID:7117


    //INICIA - BRID:7119 - WF:2 Rule List - Phase: 5 (Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 5) { this.brf.SetFilteronList(this.listConfig, " Cotizacion.Estatus = 3 "); } else { }
    //TERMINA - BRID:7119


    //INICIA - BRID:7121 - WF:2 Rule List - Phase: 6 (Canceladas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 6) { this.brf.SetFilteronList(this.listConfig, " Cotizacion.Estatus = 4 "); } else { }
    //TERMINA - BRID:7121


    //INICIA - BRID:7123 - WF:2 Rule List - Phase: 1 (Nueva Cotización) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 1) { this.brf.SetFilteronList(this.listConfig, " Cotizacion.Estatus = 0 "); } else { }
    //TERMINA - BRID:7123


    //INICIA - BRID:7125 - WF:2 Rule List - Phase: 2 (Por Cotizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 2) { this.brf.SetFilteronList(this.listConfig, " Cotizacion.Estatus = 6 "); } else { }
    //TERMINA - BRID:7125

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

  remove(row: Cotizacion) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._CotizacionService
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
  async ActionPrint(dataRow: Cotizacion) {

    this.dialogo.open(DialogPrintFormatComponent, { data: dataRow })
      .afterClosed()
      .subscribe(async (formatSelected: any) => {
        console.log(formatSelected)
        if (formatSelected.length > 0) {
          this.dataSource.loadingSubject.next(true);
          formatSelected.forEach(async element => {
            await this.printHelper.PrintFormats(element.Format, dataRow.Folio, element.Name).then(() => {
              setTimeout(() => {
                this.dataSource.loadingSubject.next(false);
              }, 5000);
            })
          });
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
      , 'Fecha de Registro'
      , 'Hora de Registro'
      , 'Usuario que Registra'
      , 'Numero de Cotización'
      , 'Orden de Trabajo Origen'
      , 'Orden de Trabajo Generada'
      , 'Tipo de Reporte'
      , 'Tipo de ingreso'
      , 'Cliente'
      , 'Matrícula'
      , 'Modelo'
      , 'Contacto'
      , 'Tiempo de Ejecución (días)'
      , 'Enviar Cotización a Cliente'
      , 'Redacción Correo para Cliente'
      , 'Estatus'
      , 'Mano de Obra'
      , 'Partes'
      , 'Consumibles'
      , 'Total'
      , 'Porcentaje de Consumibles'
      , 'Porcentaje de Anticipo'
      , 'Comentarios Mantenimiento'
      , 'Reporte'
      , 'Item de Inspección'
      , 'Motivo de Edición'
      , 'Observaciones'
      , 'Fecha de Respuesta'
      , 'Hora de Respuesta'
      , 'Respuesta'
      , 'Día de Llegada del Avión'
      , 'Hora de Llegada del Avión'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.Fecha_de_Registro
        , x.Hora_de_Registro
        , x.Usuario_que_Registra_Spartan_User.Name
        , x.Numero_de_Cotizacion
        , x.Orden_de_Trabajo_Origen_Orden_de_Trabajo.numero_de_orden
        , x.Orden_de_Trabajo_Generada_Orden_de_Trabajo.numero_de_orden
        , x.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion
        , x.Tipo_de_ingreso_Tipo_de_Ingreso_a_Cotizacion.Descripcion
        , x.Cliente_Cliente.Razon_Social
        , x.Matricula_Aeronave.Matricula
        , x.Modelo_Modelos.Descripcion
        , x.Contacto
        , x.Tiempo_de_Ejecucion
        , x.Enviar_Cotizacion_a_Cliente
        , x.Redaccion_Correo_para_Cliente
        , x.Estatus_Estatus_de_Cotizacion.Descripcion
        , x.Mano_de_Obra
        , x.Partes
        , x.Consumibles
        , x.Total
        , x.Porcentaje_de_Consumibles
        , x.Porcentaje_de_Anticipo
        , x.Comentarios_Mantenimiento
        , x.Reporte_Crear_Reporte.No_Reporte
        , x.Item_de_Inspeccion
        , x.Motivo_de_Edicion_Motivo_de_Edicion_de_Cotizacion.Descripcion
        , x.Observaciones
        , x.Fecha_de_Respuesta
        , x.Hora_de_Respuesta
        , x.Observaciones_Respeusta
        , x.Dia_de_Llegada_del_Avion
        , x.Hora_de_Llegada_del_Avion

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

    pdfMake.createPdf(pdfDefinition).download('Cotizacion.pdf');
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
          this._CotizacionService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              response.Cotizacions.forEach(e => { e.Enviar_Cotizacion_a_Cliente = e.Enviar_Cotizacion_a_Cliente ? 'Si' : 'No' });
              this.dataSourceTemp = response.Cotizacions;
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
          let data = this.listConfig;
          let condition = "1 = 1 ";
          switch (+this.id) {
            case 1:
              condition += " and Cotizacion.Estatus = 5"
              break;
            case 2:
              condition += " and Cotizacion.Estatus = 6"
              break;
            case 3:
              condition += " and Cotizacion.Estatus = 1"
              break;
            case 4:
              condition += " and Cotizacion.Estatus = 2"
              break;
            case 5:
              condition += " and Cotizacion.Estatus = 3"
              break;
            case 6:
              condition += " and Cotizacion.Estatus = 4"
              break;
          }
          if (data.filter.Folio != "")
            condition += " and Cotizacion.Folio = " + data.filter.Folio;
          if (data.filter.Fecha_de_Registro)
            condition += " and CONVERT(VARCHAR(10), Cotizacion.Fecha_de_Registro, 102)  = '" + moment(data.filter.Fecha_de_Registro).format("YYYY.MM.DD") + "'";
          if (data.filter.Hora_de_Registro != "")
            condition += " and Cotizacion.Hora_de_Registro = '" + data.filter.Hora_de_Registro + "'";
          if (data.filter.Usuario_que_Registra != "")
            condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra + "%' ";
          if (data.filter.Numero_de_Cotizacion != "")
            condition += " and Cotizacion.Numero_de_Cotizacion like '%" + data.filter.Numero_de_Cotizacion + "%' ";
          if (data.filter.Orden_de_Trabajo_Origen != "")
            condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.Orden_de_Trabajo_Origen + "%' ";
          if (data.filter.Orden_de_Trabajo_Generada != "")
            condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.Orden_de_Trabajo_Generada + "%' ";
          if (data.filter.Tipo_de_Reporte != "")
            condition += " and Tipo_de_Reporte.Descripcion like '%" + data.filter.Tipo_de_Reporte + "%' ";
          if (data.filter.Tipo_de_ingreso != "")
            condition += " and Tipo_de_Ingreso_a_Cotizacion.Descripcion like '%" + data.filter.Tipo_de_ingreso + "%' ";
          if (data.filter.Cliente != "")
            condition += " and Cliente.Razon_Social like '%" + data.filter.Cliente + "%' ";
          if (data.filter.Matricula != "")
            condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
          if (data.filter.Modelo != "")
            condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
          if (data.filter.Contacto != "")
            condition += " and Cotizacion.Contacto like '%" + data.filter.Contacto + "%' ";
          if (data.filter.Tiempo_de_Ejecucion != "")
            condition += " and Cotizacion.Tiempo_de_Ejecucion = " + data.filter.Tiempo_de_Ejecucion;
          if (data.filter.Enviar_Cotizacion_a_Cliente && data.filter.Enviar_Cotizacion_a_Cliente != "2") {
            if (data.filter.Enviar_Cotizacion_a_Cliente == "0" || data.filter.Enviar_Cotizacion_a_Cliente == "") {
              condition += " and (Cotizacion.Enviar_Cotizacion_a_Cliente = 0 or Cotizacion.Enviar_Cotizacion_a_Cliente is null)";
            } else {
              condition += " and Cotizacion.Enviar_Cotizacion_a_Cliente = 1";
            }
          }
          if (data.filter.Redaccion_Correo_para_Cliente != "")
            condition += " and Cotizacion.Redaccion_Correo_para_Cliente like '%" + data.filter.Redaccion_Correo_para_Cliente + "%' ";
          if (data.filter.Estatus != "")
            condition += " and Estatus_de_Cotizacion.Descripcion like '%" + data.filter.Estatus + "%' ";
          if (data.filter.Mano_de_Obra != "")
            condition += " and Cotizacion.Mano_de_Obra = " + data.filter.Mano_de_Obra;
          if (data.filter.Partes != "")
            condition += " and Cotizacion.Partes = " + data.filter.Partes;
          if (data.filter.Consumibles != "")
            condition += " and Cotizacion.Consumibles = " + data.filter.Consumibles;
          if (data.filter.Total != "")
            condition += " and Cotizacion.Total = " + data.filter.Total;
          if (data.filter.Porcentaje_de_Consumibles != "")
            condition += " and Cotizacion.Porcentaje_de_Consumibles = " + data.filter.Porcentaje_de_Consumibles;
          if (data.filter.Porcentaje_de_Anticipo != "")
            condition += " and Cotizacion.Porcentaje_de_Anticipo = " + data.filter.Porcentaje_de_Anticipo;
          if (data.filter.Comentarios_Mantenimiento != "")
            condition += " and Cotizacion.Comentarios_Mantenimiento like '%" + data.filter.Comentarios_Mantenimiento + "%' ";
          if (data.filter.Reporte != "")
            condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.Reporte + "%' ";
          if (data.filter.Item_de_Inspeccion != "")
            condition += " and Cotizacion.Item_de_Inspeccion = " + data.filter.Item_de_Inspeccion;
          if (data.filter.Motivo_de_Edicion != "")
            condition += " and Motivo_de_Edicion_de_Cotizacion.Descripcion like '%" + data.filter.Motivo_de_Edicion + "%' ";
          if (data.filter.Observaciones != "")
            condition += " and Cotizacion.Observaciones like '%" + data.filter.Observaciones + "%' ";
          if (data.filter.Fecha_de_Respuesta)
            condition += " and CONVERT(VARCHAR(10), Cotizacion.Fecha_de_Respuesta, 102)  = '" + moment(data.filter.Fecha_de_Respuesta).format("YYYY.MM.DD") + "'";
          if (data.filter.Hora_de_Respuesta != "")
            condition += " and Cotizacion.Hora_de_Respuesta = '" + data.filter.Hora_de_Respuesta + "'";
          if (data.filter.Usuario_que_Registra_Respuesta != "")
            condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra_Respuesta + "%' ";
          if (data.filter.Respuesta != "")
            condition += " and Respuesta_del_Cliente_a_Cotizacion.Descripcion like '%" + data.filter.Respuesta + "%' ";
          if (data.filter.Observaciones_Respeusta != "")
            condition += " and Cotizacion.Observaciones_Respeusta like '%" + data.filter.Observaciones_Respeusta + "%' ";
          if (data.filter.Dia_de_Llegada_del_Avion)
            condition += " and CONVERT(VARCHAR(10), Cotizacion.Dia_de_Llegada_del_Avion, 102)  = '" + moment(data.filter.Dia_de_Llegada_del_Avion).format("YYYY.MM.DD") + "'";
          if (data.filter.Hora_de_Llegada_del_Avion != "")
            condition += " and Cotizacion.Hora_de_Llegada_del_Avion = '" + data.filter.Hora_de_Llegada_del_Avion + "'";

          this._CotizacionService.listaSelAll(1, 9999, condition, '')
            .subscribe((response: any) => {
              response.Cotizacions.forEach(e => { e.Enviar_Cotizacion_a_Cliente = e.Enviar_Cotizacion_a_Cliente ? 'Si' : 'No' });
              this.dataSourceTemp = response.Cotizacions;
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
        'Fecha de Registro ': fields.Fecha_de_Registro ? momentJS(fields.Fecha_de_Registro).format('DD/MM/YYYY') : '',
        'Hora de Registro ': fields.Hora_de_Registro,
        'Usuario que Registra ': fields.Usuario_que_Registra_Spartan_User.Name,
        'Numero de Cotización ': fields.Numero_de_Cotizacion,
        'Orden de Trabajo Origen ': fields.Orden_de_Trabajo_Origen_Orden_de_Trabajo.numero_de_orden,
        'Orden de Trabajo Generada 1': fields.Orden_de_Trabajo_Generada_Orden_de_Trabajo.numero_de_orden,
        'Tipo de Reporte ': fields.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion,
        'Tipo de ingreso ': fields.Tipo_de_ingreso_Tipo_de_Ingreso_a_Cotizacion.Descripcion,
        'Cliente ': fields.Cliente_Cliente.Razon_Social,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'Contacto ': fields.Contacto,
        'Tiempo de Ejecución (días) ': fields.Tiempo_de_Ejecucion,
        'Enviar_Cotizacion_a_Cliente ': fields.Enviar_Cotizacion_a_Cliente ? 'SI' : 'NO',
        'Redacción Correo para Cliente ': fields.Redaccion_Correo_para_Cliente,
        'Estatus ': fields.Estatus_Estatus_de_Cotizacion.Descripcion,
        'Mano de Obra ': fields.Mano_de_Obra,
        'Partes ': fields.Partes,
        'Consumibles ': fields.Consumibles,
        'Total ': fields.Total,
        'Porcentaje de Consumibles ': fields.Porcentaje_de_Consumibles,
        'Porcentaje de Anticipo ': fields.Porcentaje_de_Anticipo,
        'Comentarios Mantenimiento ': fields.Comentarios_Mantenimiento,
        'Reporte ': fields.Reporte_Crear_Reporte.No_Reporte,
        'Item de Inspección ': fields.Item_de_Inspeccion,
        'Motivo de Edición ': fields.Motivo_de_Edicion_Motivo_de_Edicion_de_Cotizacion.Descripcion,
        'Observaciones ': fields.Observaciones,
        'Fecha de Respuesta ': fields.Fecha_de_Respuesta ? momentJS(fields.Fecha_de_Respuesta).format('DD/MM/YYYY') : '',
        'Hora de Respuesta ': fields.Hora_de_Respuesta,
        'Usuario que Registra 1': fields.Usuario_que_Registra_Respuesta_Spartan_User.Name,
        'Respuesta ': fields.Respuesta_Respuesta_del_Cliente_a_Cotizacion.Descripcion,
        'Observaciones 1': fields.Observaciones_Respeusta,
        'Día de Llegada del Avión ': fields.Dia_de_Llegada_del_Avion ? momentJS(fields.Dia_de_Llegada_del_Avion).format('DD/MM/YYYY') : '',
        'Hora de Llegada del Avión ': fields.Hora_de_Llegada_del_Avion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Cotizacion  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Fecha_de_Registro: x.Fecha_de_Registro,
      Hora_de_Registro: x.Hora_de_Registro,
      Usuario_que_Registra: x.Usuario_que_Registra_Spartan_User.Name,
      Numero_de_Cotizacion: x.Numero_de_Cotizacion,
      Orden_de_Trabajo_Origen: x.Orden_de_Trabajo_Origen_Orden_de_Trabajo.numero_de_orden,
      Orden_de_Trabajo_Generada: x.Orden_de_Trabajo_Generada_Orden_de_Trabajo.numero_de_orden,
      Tipo_de_Reporte: x.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion,
      Tipo_de_ingreso: x.Tipo_de_ingreso_Tipo_de_Ingreso_a_Cotizacion.Descripcion,
      Cliente: x.Cliente_Cliente.Razon_Social,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      Contacto: x.Contacto,
      Tiempo_de_Ejecucion: x.Tiempo_de_Ejecucion,
      Enviar_Cotizacion_a_Cliente: x.Enviar_Cotizacion_a_Cliente,
      Redaccion_Correo_para_Cliente: x.Redaccion_Correo_para_Cliente,
      Estatus: x.Estatus_Estatus_de_Cotizacion.Descripcion,
      Mano_de_Obra: x.Mano_de_Obra,
      Partes: x.Partes,
      Consumibles: x.Consumibles,
      Total: x.Total,
      Porcentaje_de_Consumibles: x.Porcentaje_de_Consumibles,
      Porcentaje_de_Anticipo: x.Porcentaje_de_Anticipo,
      Comentarios_Mantenimiento: x.Comentarios_Mantenimiento,
      Reporte: x.Reporte_Crear_Reporte.No_Reporte,
      Item_de_Inspeccion: x.Item_de_Inspeccion,
      Motivo_de_Edicion: x.Motivo_de_Edicion_Motivo_de_Edicion_de_Cotizacion.Descripcion,
      Observaciones: x.Observaciones,
      Fecha_de_Respuesta: x.Fecha_de_Respuesta,
      Hora_de_Respuesta: x.Hora_de_Respuesta,
      Usuario_que_Registra_Respuesta: x.Usuario_que_Registra_Respuesta_Spartan_User.Name,
      Respuesta: x.Respuesta_Respuesta_del_Cliente_a_Cotizacion.Descripcion,
      Observaciones_Respeusta: x.Observaciones_Respeusta,
      Dia_de_Llegada_del_Avion: x.Dia_de_Llegada_del_Avion,
      Hora_de_Llegada_del_Avion: x.Hora_de_Llegada_del_Avion,

    }));

    this.excelService.exportToCsv(result, 'Cotizacion', ['Folio', 'Fecha_de_Registro', 'Hora_de_Registro', 'Usuario_que_Registra', 'Numero_de_Cotizacion', 'Orden_de_Trabajo_Origen', 'Orden_de_Trabajo_Generada', 'Tipo_de_Reporte', 'Tipo_de_ingreso', 'Cliente', 'Matricula', 'Modelo', 'Contacto', 'Tiempo_de_Ejecucion', 'Enviar_Cotizacion_a_Cliente', 'Redaccion_Correo_para_Cliente', 'Estatus', 'Mano_de_Obra', 'Partes', 'Consumibles', 'Total', 'Porcentaje_de_Consumibles', 'Porcentaje_de_Anticipo', 'Comentarios_Mantenimiento', 'Reporte', 'Item_de_Inspeccion', 'Motivo_de_Edicion', 'Observaciones', 'Fecha_de_Respuesta', 'Hora_de_Respuesta', 'Usuario_que_Registra_Respuesta', 'Respuesta', 'Observaciones_Respeusta', 'Dia_de_Llegada_del_Avion', 'Hora_de_Llegada_del_Avion']);
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
    template += '          <th>Fecha de Registro</th>';
    template += '          <th>Hora de Registro</th>';
    template += '          <th>Usuario que Registra</th>';
    template += '          <th>Numero de Cotización</th>';
    template += '          <th>Orden de Trabajo Origen</th>';
    template += '          <th>Orden de Trabajo Generada</th>';
    template += '          <th>Tipo de Reporte</th>';
    template += '          <th>Tipo de ingreso</th>';
    template += '          <th>Cliente</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Contacto</th>';
    template += '          <th>Tiempo de Ejecución (días)</th>';
    template += '          <th>Enviar Cotización a Cliente</th>';
    template += '          <th>Redacción Correo para Cliente</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Mano de Obra</th>';
    template += '          <th>Partes</th>';
    template += '          <th>Consumibles</th>';
    template += '          <th>Total</th>';
    template += '          <th>Porcentaje de Consumibles</th>';
    template += '          <th>Porcentaje de Anticipo</th>';
    template += '          <th>Comentarios Mantenimiento</th>';
    template += '          <th>Reporte</th>';
    template += '          <th>Item de Inspección</th>';
    template += '          <th>Motivo de Edición</th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>Fecha de Respuesta</th>';
    template += '          <th>Hora de Respuesta</th>';
    template += '          <th>Respuesta</th>';
    template += '          <th>Día de Llegada del Avión</th>';
    template += '          <th>Hora de Llegada del Avión</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Fecha_de_Registro + '</td>';
      template += '          <td>' + element.Hora_de_Registro + '</td>';
      template += '          <td>' + element.Usuario_que_Registra_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Numero_de_Cotizacion + '</td>';
      template += '          <td>' + element.Orden_de_Trabajo_Origen_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.Orden_de_Trabajo_Generada_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion + '</td>';
      template += '          <td>' + element.Tipo_de_ingreso_Tipo_de_Ingreso_a_Cotizacion.Descripcion + '</td>';
      template += '          <td>' + element.Cliente_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Contacto + '</td>';
      template += '          <td>' + element.Tiempo_de_Ejecucion + '</td>';
      template += '          <td>' + element.Enviar_Cotizacion_a_Cliente + '</td>';
      template += '          <td>' + element.Redaccion_Correo_para_Cliente + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Cotizacion.Descripcion + '</td>';
      template += '          <td>' + element.Mano_de_Obra + '</td>';
      template += '          <td>' + element.Partes + '</td>';
      template += '          <td>' + element.Consumibles + '</td>';
      template += '          <td>' + element.Total + '</td>';
      template += '          <td>' + element.Porcentaje_de_Consumibles + '</td>';
      template += '          <td>' + element.Porcentaje_de_Anticipo + '</td>';
      template += '          <td>' + element.Comentarios_Mantenimiento + '</td>';
      template += '          <td>' + element.Reporte_Crear_Reporte.No_Reporte + '</td>';
      template += '          <td>' + element.Item_de_Inspeccion + '</td>';
      template += '          <td>' + element.Motivo_de_Edicion_Motivo_de_Edicion_de_Cotizacion.Descripcion + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.Fecha_de_Respuesta + '</td>';
      template += '          <td>' + element.Hora_de_Respuesta + '</td>';
      template += '          <td>' + element.Usuario_que_Registra_Respuesta_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Respuesta_Respuesta_del_Cliente_a_Cotizacion.Descripcion + '</td>';
      template += '          <td>' + element.Observaciones_Respeusta + '</td>';
      template += '          <td>' + element.Dia_de_Llegada_del_Avion + '</td>';
      template += '          <td>' + element.Hora_de_Llegada_del_Avion + '</td>';

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
    template += 'Folio';
    template += '\t Fecha de Registro';
    template += '\t Hora de Registro';
    template += '\t Usuario que Registra';
    template += '\t Numero de Cotización';
    template += '\t Orden de Trabajo Origen';
    template += '\t Orden de Trabajo Generada';
    template += '\t Tipo de Reporte';
    template += '\t Tipo de ingreso';
    template += '\t Cliente';
    template += '\t Matrícula';
    template += '\t Modelo';
    template += '\t Contacto';
    template += '\t Tiempo de Ejecución (días)';
    template += '\t Enviar Cotización a Cliente';
    template += '\t Redacción Correo para Cliente';
    template += '\t Estatus';
    template += '\t Mano de Obra';
    template += '\t Partes';
    template += '\t Consumibles';
    template += '\t Total';
    template += '\t Porcentaje de Consumibles';
    template += '\t Porcentaje de Anticipo';
    template += '\t Comentarios Mantenimiento';
    template += '\t Reporte';
    template += '\t Item de Inspección';
    template += '\t Motivo de Edición';
    template += '\t Observaciones';
    template += '\t Fecha de Respuesta';
    template += '\t Hora de Respuesta';
    template += '\t Usuario que Registra Respuesta';
    template += '\t Respuesta';
    template += '\t Observaciones Respuesta';
    template += '\t Día de Llegada del Avión';
    template += '\t Hora de Llegada del Avión';

    template += '\n';

    data.forEach(element => {
      template += element.Folio;
      template += '\t ' + element.Fecha_de_Registro;
      template += '\t ' + element.Hora_de_Registro;
      template += '\t ' + element.Usuario_que_Registra_Spartan_User.Name;
      template += '\t ' + element.Numero_de_Cotizacion;
      template += '\t ' + element.Orden_de_Trabajo_Origen_Orden_de_Trabajo.numero_de_orden;
      template += '\t ' + element.Orden_de_Trabajo_Generada_Orden_de_Trabajo.numero_de_orden;
      template += '\t ' + element.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion;
      template += '\t ' + element.Tipo_de_ingreso_Tipo_de_Ingreso_a_Cotizacion.Descripcion;
      template += '\t ' + element.Cliente_Cliente.Razon_Social;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.Contacto;
      template += '\t ' + element.Tiempo_de_Ejecucion;
      template += '\t ' + element.Enviar_Cotizacion_a_Cliente;
      template += '\t ' + element.Redaccion_Correo_para_Cliente;
      template += '\t ' + element.Estatus_Estatus_de_Cotizacion.Descripcion;
      template += '\t ' + element.Mano_de_Obra;
      template += '\t ' + element.Partes;
      template += '\t ' + element.Consumibles;
      template += '\t ' + element.Total;
      template += '\t ' + element.Porcentaje_de_Consumibles;
      template += '\t ' + element.Porcentaje_de_Anticipo;
      template += '\t ' + element.Comentarios_Mantenimiento;
      template += '\t ' + element.Reporte_Crear_Reporte.No_Reporte;
      template += '\t ' + element.Item_de_Inspeccion;
      template += '\t ' + element.Motivo_de_Edicion_Motivo_de_Edicion_de_Cotizacion.Descripcion;
      template += '\t ' + element.Observaciones;
      template += '\t ' + element.Fecha_de_Respuesta;
      template += '\t ' + element.Hora_de_Respuesta;
      template += '\t ' + element.Usuario_que_Registra_Respuesta_Spartan_User.Name;
      template += '\t ' + element.Respuesta_Respuesta_del_Cliente_a_Cotizacion.Descripcion;
      template += '\t ' + element.Observaciones_Respeusta;
      template += '\t ' + element.Dia_de_Llegada_del_Avion;
      template += '\t ' + element.Hora_de_Llegada_del_Avion;

      template += '\n';
    });

    return template;
  }

}

export class CotizacionDataSource implements DataSource<Cotizacion>
{
  private subject = new BehaviorSubject<Cotizacion[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: CotizacionService, private _file: SpartanFileService, private id: any) { }



  connect(
    collectionViewer: CollectionViewer
  ): Observable<Cotizacion[]> {
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
        //condition = condition + " AND " + data.MRWhere + "por aqui 1";
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
          } else if (column != 'acciones' && column != 'Clausulas_Especificas' && column != 'Clausulas_Generales') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Cotizacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false || column === 'Paquete_de_beneficios') { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Cotizacions);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    switch (+this.id) {
      case 1:
        condition += " and Cotizacion.Estatus = 5"
        break;
      case 2:
        condition += " and Cotizacion.Estatus = 6"
        break;
      case 3:
        condition += " and Cotizacion.Estatus = 1"
        break;
      case 4:
        condition += " and Cotizacion.Estatus = 2"
        break;
      case 5:
        condition += " and Cotizacion.Estatus = 3"
        break;
      case 6:
        condition += " and Cotizacion.Estatus = 4"
        break;
    }
    if (data.filter.Folio != "")
      condition += " and Cotizacion.Folio = " + data.filter.Folio;
    if (data.filter.Fecha_de_Registro)
      condition += " and CONVERT(VARCHAR(10), Cotizacion.Fecha_de_Registro, 102)  = '" + moment(data.filter.Fecha_de_Registro).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Registro != "")
      condition += " and Cotizacion.Hora_de_Registro = '" + data.filter.Hora_de_Registro + "'";
    if (data.filter.Usuario_que_Registra != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra + "%' ";
    if (data.filter.Numero_de_Cotizacion != "")
      condition += " and Cotizacion.Numero_de_Cotizacion like '%" + data.filter.Numero_de_Cotizacion + "%' ";
    if (data.filter.Orden_de_Trabajo_Origen != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.Orden_de_Trabajo_Origen + "%' ";
    if (data.filter.Orden_de_Trabajo_Generada != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.Orden_de_Trabajo_Generada + "%' ";
    if (data.filter.Tipo_de_Reporte != "")
      condition += " and Tipo_de_Reporte.Descripcion like '%" + data.filter.Tipo_de_Reporte + "%' ";
    if (data.filter.Tipo_de_ingreso != "")
      condition += " and Tipo_de_Ingreso_a_Cotizacion.Descripcion like '%" + data.filter.Tipo_de_ingreso + "%' ";
    if (data.filter.Cliente != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Cliente + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Contacto != "")
      condition += " and Cotizacion.Contacto like '%" + data.filter.Contacto + "%' ";
    if (data.filter.Tiempo_de_Ejecucion != "")
      condition += " and Cotizacion.Tiempo_de_Ejecucion = " + data.filter.Tiempo_de_Ejecucion;
    if (data.filter.Enviar_Cotizacion_a_Cliente && data.filter.Enviar_Cotizacion_a_Cliente != "2") {
      if (data.filter.Enviar_Cotizacion_a_Cliente == "0" || data.filter.Enviar_Cotizacion_a_Cliente == "") {
        condition += " and (Cotizacion.Enviar_Cotizacion_a_Cliente = 0 or Cotizacion.Enviar_Cotizacion_a_Cliente is null)";
      } else {
        condition += " and Cotizacion.Enviar_Cotizacion_a_Cliente = 1";
      }
    }
    if (data.filter.Redaccion_Correo_para_Cliente != "")
      condition += " and Cotizacion.Redaccion_Correo_para_Cliente like '%" + data.filter.Redaccion_Correo_para_Cliente + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Cotizacion.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Mano_de_Obra != "")
      condition += " and Cotizacion.Mano_de_Obra = " + data.filter.Mano_de_Obra;
    if (data.filter.Partes != "")
      condition += " and Cotizacion.Partes = " + data.filter.Partes;
    if (data.filter.Consumibles != "")
      condition += " and Cotizacion.Consumibles = " + data.filter.Consumibles;
    if (data.filter.Total != "")
      condition += " and Cotizacion.Total = " + data.filter.Total;
    if (data.filter.Porcentaje_de_Consumibles != "")
      condition += " and Cotizacion.Porcentaje_de_Consumibles = " + data.filter.Porcentaje_de_Consumibles;
    if (data.filter.Porcentaje_de_Anticipo != "")
      condition += " and Cotizacion.Porcentaje_de_Anticipo = " + data.filter.Porcentaje_de_Anticipo;
    if (data.filter.Comentarios_Mantenimiento != "")
      condition += " and Cotizacion.Comentarios_Mantenimiento like '%" + data.filter.Comentarios_Mantenimiento + "%' ";
    if (data.filter.Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.Reporte + "%' ";
    if (data.filter.Item_de_Inspeccion != "")
      condition += " and Cotizacion.Item_de_Inspeccion = " + data.filter.Item_de_Inspeccion;
    if (data.filter.Motivo_de_Edicion != "")
      condition += " and Motivo_de_Edicion_de_Cotizacion.Descripcion like '%" + data.filter.Motivo_de_Edicion + "%' ";
    if (data.filter.Observaciones != "")
      condition += " and Cotizacion.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.Fecha_de_Respuesta)
      condition += " and CONVERT(VARCHAR(10), Cotizacion.Fecha_de_Respuesta, 102)  = '" + moment(data.filter.Fecha_de_Respuesta).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Respuesta != "")
      condition += " and Cotizacion.Hora_de_Respuesta = '" + data.filter.Hora_de_Respuesta + "'";
    if (data.filter.Usuario_que_Registra_Respuesta != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra_Respuesta + "%' ";
    if (data.filter.Respuesta != "")
      condition += " and Respuesta_del_Cliente_a_Cotizacion.Descripcion like '%" + data.filter.Respuesta + "%' ";
    if (data.filter.Observaciones_Respeusta != "")
      condition += " and Cotizacion.Observaciones_Respeusta like '%" + data.filter.Observaciones_Respeusta + "%' ";
    if (data.filter.Dia_de_Llegada_del_Avion)
      condition += " and CONVERT(VARCHAR(10), Cotizacion.Dia_de_Llegada_del_Avion, 102)  = '" + moment(data.filter.Dia_de_Llegada_del_Avion).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Llegada_del_Avion != "")
      condition += " and Cotizacion.Hora_de_Llegada_del_Avion = '" + data.filter.Hora_de_Llegada_del_Avion + "'";

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
        sort = " Cotizacion.Folio " + data.sortDirecction;
        break;
      case "Fecha_de_Registro":
        sort = " Cotizacion.Fecha_de_Registro " + data.sortDirecction;
        break;
      case "Hora_de_Registro":
        sort = " Cotizacion.Hora_de_Registro " + data.sortDirecction;
        break;
      case "Usuario_que_Registra":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Numero_de_Cotizacion":
        sort = " Cotizacion.Numero_de_Cotizacion " + data.sortDirecction;
        break;
      case "Orden_de_Trabajo_Origen":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "Orden_de_Trabajo_Generada":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "Tipo_de_Reporte":
        sort = " Tipo_de_Reporte.Descripcion " + data.sortDirecction;
        break;
      case "Tipo_de_ingreso":
        sort = " Tipo_de_Ingreso_a_Cotizacion.Descripcion " + data.sortDirecction;
        break;
      case "Cliente":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Contacto":
        sort = " Cotizacion.Contacto " + data.sortDirecction;
        break;
      case "Tiempo_de_Ejecucion":
        sort = " Cotizacion.Tiempo_de_Ejecucion " + data.sortDirecction;
        break;
      case "Enviar_Cotizacion_a_Cliente":
        sort = " Cotizacion.Enviar_Cotizacion_a_Cliente " + data.sortDirecction;
        break;
      case "Redaccion_Correo_para_Cliente":
        sort = " Cotizacion.Redaccion_Correo_para_Cliente " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Cotizacion.Descripcion " + data.sortDirecction;
        break;
      case "Mano_de_Obra":
        sort = " Cotizacion.Mano_de_Obra " + data.sortDirecction;
        break;
      case "Partes":
        sort = " Cotizacion.Partes " + data.sortDirecction;
        break;
      case "Consumibles":
        sort = " Cotizacion.Consumibles " + data.sortDirecction;
        break;
      case "Total":
        sort = " Cotizacion.Total " + data.sortDirecction;
        break;
      case "Porcentaje_de_Consumibles":
        sort = " Cotizacion.Porcentaje_de_Consumibles " + data.sortDirecction;
        break;
      case "Porcentaje_de_Anticipo":
        sort = " Cotizacion.Porcentaje_de_Anticipo " + data.sortDirecction;
        break;
      case "Comentarios_Mantenimiento":
        sort = " Cotizacion.Comentarios_Mantenimiento " + data.sortDirecction;
        break;
      case "Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "Item_de_Inspeccion":
        sort = " Cotizacion.Item_de_Inspeccion " + data.sortDirecction;
        break;
      case "Motivo_de_Edicion":
        sort = " Motivo_de_Edicion_de_Cotizacion.Descripcion " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Cotizacion.Observaciones " + data.sortDirecction;
        break;
      case "Fecha_de_Respuesta":
        sort = " Cotizacion.Fecha_de_Respuesta " + data.sortDirecction;
        break;
      case "Hora_de_Respuesta":
        sort = " Cotizacion.Hora_de_Respuesta " + data.sortDirecction;
        break;
      case "Usuario_que_Registra_Respuesta":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Respuesta":
        sort = " Respuesta_del_Cliente_a_Cotizacion.Descripcion " + data.sortDirecction;
        break;
      case "Observaciones_Respeusta":
        sort = " Cotizacion.Observaciones_Respeusta " + data.sortDirecction;
        break;
      case "Dia_de_Llegada_del_Avion":
        sort = " Cotizacion.Dia_de_Llegada_del_Avion " + data.sortDirecction;
        break;
      case "Hora_de_Llegada_del_Avion":
        sort = " Cotizacion.Hora_de_Llegada_del_Avion " + data.sortDirecction;
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
        condition += " AND Cotizacion.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Cotizacion.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
      || (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)) {
      if (typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
        condition += " and CONVERT(VARCHAR(10), Cotizacion.Fecha_de_Registro, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Registro).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)
        condition += " and CONVERT(VARCHAR(10), Cotizacion.Fecha_de_Registro, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Registro).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
      || (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)) {
      if (typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
        condition += " and Cotizacion.Hora_de_Registro >= '" + data.filterAdvanced.fromHora_de_Registro + "'";

      if (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)
        condition += " and Cotizacion.Hora_de_Registro <= '" + data.filterAdvanced.toHora_de_Registro + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_Registra != 'undefined' && data.filterAdvanced.Usuario_que_Registra)) {
      switch (data.filterAdvanced.Usuario_que_RegistraFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_que_Registra + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Registra + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Registra + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_que_Registra + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_RegistraMultiple != null && data.filterAdvanced.Usuario_que_RegistraMultiple.length > 0) {
      var Usuario_que_Registrads = data.filterAdvanced.Usuario_que_RegistraMultiple.join(",");
      condition += " AND Cotizacion.Usuario_que_Registra In (" + Usuario_que_Registrads + ")";
    }
    switch (data.filterAdvanced.Numero_de_CotizacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cotizacion.Numero_de_Cotizacion LIKE '" + data.filterAdvanced.Numero_de_Cotizacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cotizacion.Numero_de_Cotizacion LIKE '%" + data.filterAdvanced.Numero_de_Cotizacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cotizacion.Numero_de_Cotizacion LIKE '%" + data.filterAdvanced.Numero_de_Cotizacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cotizacion.Numero_de_Cotizacion = '" + data.filterAdvanced.Numero_de_Cotizacion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Orden_de_Trabajo_Origen != 'undefined' && data.filterAdvanced.Orden_de_Trabajo_Origen)) {
      switch (data.filterAdvanced.Orden_de_Trabajo_OrigenFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.Orden_de_Trabajo_Origen + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Orden_de_Trabajo_Origen + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Orden_de_Trabajo_Origen + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.Orden_de_Trabajo_Origen + "'";
          break;
      }
    } else if (data.filterAdvanced.Orden_de_Trabajo_OrigenMultiple != null && data.filterAdvanced.Orden_de_Trabajo_OrigenMultiple.length > 0) {
      var Orden_de_Trabajo_Origends = data.filterAdvanced.Orden_de_Trabajo_OrigenMultiple.join(",");
      condition += " AND Cotizacion.Orden_de_Trabajo_Origen In (" + Orden_de_Trabajo_Origends + ")";
    }
    if ((typeof data.filterAdvanced.Orden_de_Trabajo_Generada != 'undefined' && data.filterAdvanced.Orden_de_Trabajo_Generada)) {
      switch (data.filterAdvanced.Orden_de_Trabajo_GeneradaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.Orden_de_Trabajo_Generada + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Orden_de_Trabajo_Generada + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Orden_de_Trabajo_Generada + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.Orden_de_Trabajo_Generada + "'";
          break;
      }
    } else if (data.filterAdvanced.Orden_de_Trabajo_GeneradaMultiple != null && data.filterAdvanced.Orden_de_Trabajo_GeneradaMultiple.length > 0) {
      var Orden_de_Trabajo_Generadads = data.filterAdvanced.Orden_de_Trabajo_GeneradaMultiple.join(",");
      condition += " AND Cotizacion.Orden_de_Trabajo_Generada In (" + Orden_de_Trabajo_Generadads + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_Reporte != 'undefined' && data.filterAdvanced.Tipo_de_Reporte)) {
      switch (data.filterAdvanced.Tipo_de_ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Reporte.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Reporte.Descripcion = '" + data.filterAdvanced.Tipo_de_Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_ReporteMultiple != null && data.filterAdvanced.Tipo_de_ReporteMultiple.length > 0) {
      var Tipo_de_Reporteds = data.filterAdvanced.Tipo_de_ReporteMultiple.join(",");
      condition += " AND Cotizacion.Tipo_de_Reporte In (" + Tipo_de_Reporteds + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_ingreso != 'undefined' && data.filterAdvanced.Tipo_de_ingreso)) {
      switch (data.filterAdvanced.Tipo_de_ingresoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Ingreso_a_Cotizacion.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_ingreso + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Ingreso_a_Cotizacion.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_ingreso + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Ingreso_a_Cotizacion.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_ingreso + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Ingreso_a_Cotizacion.Descripcion = '" + data.filterAdvanced.Tipo_de_ingreso + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_ingresoMultiple != null && data.filterAdvanced.Tipo_de_ingresoMultiple.length > 0) {
      var Tipo_de_ingresods = data.filterAdvanced.Tipo_de_ingresoMultiple.join(",");
      condition += " AND Cotizacion.Tipo_de_ingreso In (" + Tipo_de_ingresods + ")";
    }
    if ((typeof data.filterAdvanced.Cliente != 'undefined' && data.filterAdvanced.Cliente)) {
      switch (data.filterAdvanced.ClienteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Cliente + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.Cliente + "'";
          break;
      }
    } else if (data.filterAdvanced.ClienteMultiple != null && data.filterAdvanced.ClienteMultiple.length > 0) {
      var Clienteds = data.filterAdvanced.ClienteMultiple.join(",");
      condition += " AND Cotizacion.Cliente In (" + Clienteds + ")";
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
      condition += " AND Cotizacion.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.Modelo != 'undefined' && data.filterAdvanced.Modelo)) {
      switch (data.filterAdvanced.ModeloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Modelos.Descripcion LIKE '" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Modelos.Descripcion = '" + data.filterAdvanced.Modelo + "'";
          break;
      }
    } else if (data.filterAdvanced.ModeloMultiple != null && data.filterAdvanced.ModeloMultiple.length > 0) {
      var Modelods = data.filterAdvanced.ModeloMultiple.join(",");
      condition += " AND Cotizacion.Modelo In (" + Modelods + ")";
    }
    switch (data.filterAdvanced.ContactoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cotizacion.Contacto LIKE '" + data.filterAdvanced.Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cotizacion.Contacto LIKE '%" + data.filterAdvanced.Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cotizacion.Contacto LIKE '%" + data.filterAdvanced.Contacto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cotizacion.Contacto = '" + data.filterAdvanced.Contacto + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Ejecucion != 'undefined' && data.filterAdvanced.fromTiempo_de_Ejecucion)
      || (typeof data.filterAdvanced.toTiempo_de_Ejecucion != 'undefined' && data.filterAdvanced.toTiempo_de_Ejecucion)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Ejecucion != 'undefined' && data.filterAdvanced.fromTiempo_de_Ejecucion)
        condition += " AND Cotizacion.Tiempo_de_Ejecucion >= " + data.filterAdvanced.fromTiempo_de_Ejecucion;

      if (typeof data.filterAdvanced.toTiempo_de_Ejecucion != 'undefined' && data.filterAdvanced.toTiempo_de_Ejecucion)
        condition += " AND Cotizacion.Tiempo_de_Ejecucion <= " + data.filterAdvanced.toTiempo_de_Ejecucion;
    }
    switch (data.filterAdvanced.Redaccion_Correo_para_ClienteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cotizacion.Redaccion_Correo_para_Cliente LIKE '" + data.filterAdvanced.Redaccion_Correo_para_Cliente + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cotizacion.Redaccion_Correo_para_Cliente LIKE '%" + data.filterAdvanced.Redaccion_Correo_para_Cliente + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cotizacion.Redaccion_Correo_para_Cliente LIKE '%" + data.filterAdvanced.Redaccion_Correo_para_Cliente + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cotizacion.Redaccion_Correo_para_Cliente = '" + data.filterAdvanced.Redaccion_Correo_para_Cliente + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Cotizacion.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Cotizacion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Cotizacion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Cotizacion.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Cotizacion.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.fromMano_de_Obra != 'undefined' && data.filterAdvanced.fromMano_de_Obra)
      || (typeof data.filterAdvanced.toMano_de_Obra != 'undefined' && data.filterAdvanced.toMano_de_Obra)) {
      if (typeof data.filterAdvanced.fromMano_de_Obra != 'undefined' && data.filterAdvanced.fromMano_de_Obra)
        condition += " AND Cotizacion.Mano_de_Obra >= " + data.filterAdvanced.fromMano_de_Obra;

      if (typeof data.filterAdvanced.toMano_de_Obra != 'undefined' && data.filterAdvanced.toMano_de_Obra)
        condition += " AND Cotizacion.Mano_de_Obra <= " + data.filterAdvanced.toMano_de_Obra;
    }
    if ((typeof data.filterAdvanced.fromPartes != 'undefined' && data.filterAdvanced.fromPartes)
      || (typeof data.filterAdvanced.toPartes != 'undefined' && data.filterAdvanced.toPartes)) {
      if (typeof data.filterAdvanced.fromPartes != 'undefined' && data.filterAdvanced.fromPartes)
        condition += " AND Cotizacion.Partes >= " + data.filterAdvanced.fromPartes;

      if (typeof data.filterAdvanced.toPartes != 'undefined' && data.filterAdvanced.toPartes)
        condition += " AND Cotizacion.Partes <= " + data.filterAdvanced.toPartes;
    }
    if ((typeof data.filterAdvanced.fromConsumibles != 'undefined' && data.filterAdvanced.fromConsumibles)
      || (typeof data.filterAdvanced.toConsumibles != 'undefined' && data.filterAdvanced.toConsumibles)) {
      if (typeof data.filterAdvanced.fromConsumibles != 'undefined' && data.filterAdvanced.fromConsumibles)
        condition += " AND Cotizacion.Consumibles >= " + data.filterAdvanced.fromConsumibles;

      if (typeof data.filterAdvanced.toConsumibles != 'undefined' && data.filterAdvanced.toConsumibles)
        condition += " AND Cotizacion.Consumibles <= " + data.filterAdvanced.toConsumibles;
    }
    if ((typeof data.filterAdvanced.fromTotal != 'undefined' && data.filterAdvanced.fromTotal)
      || (typeof data.filterAdvanced.toTotal != 'undefined' && data.filterAdvanced.toTotal)) {
      if (typeof data.filterAdvanced.fromTotal != 'undefined' && data.filterAdvanced.fromTotal)
        condition += " AND Cotizacion.Total >= " + data.filterAdvanced.fromTotal;

      if (typeof data.filterAdvanced.toTotal != 'undefined' && data.filterAdvanced.toTotal)
        condition += " AND Cotizacion.Total <= " + data.filterAdvanced.toTotal;
    }
    if ((typeof data.filterAdvanced.fromPorcentaje_de_Consumibles != 'undefined' && data.filterAdvanced.fromPorcentaje_de_Consumibles)
      || (typeof data.filterAdvanced.toPorcentaje_de_Consumibles != 'undefined' && data.filterAdvanced.toPorcentaje_de_Consumibles)) {
      if (typeof data.filterAdvanced.fromPorcentaje_de_Consumibles != 'undefined' && data.filterAdvanced.fromPorcentaje_de_Consumibles)
        condition += " AND Cotizacion.Porcentaje_de_Consumibles >= " + data.filterAdvanced.fromPorcentaje_de_Consumibles;

      if (typeof data.filterAdvanced.toPorcentaje_de_Consumibles != 'undefined' && data.filterAdvanced.toPorcentaje_de_Consumibles)
        condition += " AND Cotizacion.Porcentaje_de_Consumibles <= " + data.filterAdvanced.toPorcentaje_de_Consumibles;
    }
    if ((typeof data.filterAdvanced.fromPorcentaje_de_Anticipo != 'undefined' && data.filterAdvanced.fromPorcentaje_de_Anticipo)
      || (typeof data.filterAdvanced.toPorcentaje_de_Anticipo != 'undefined' && data.filterAdvanced.toPorcentaje_de_Anticipo)) {
      if (typeof data.filterAdvanced.fromPorcentaje_de_Anticipo != 'undefined' && data.filterAdvanced.fromPorcentaje_de_Anticipo)
        condition += " AND Cotizacion.Porcentaje_de_Anticipo >= " + data.filterAdvanced.fromPorcentaje_de_Anticipo;

      if (typeof data.filterAdvanced.toPorcentaje_de_Anticipo != 'undefined' && data.filterAdvanced.toPorcentaje_de_Anticipo)
        condition += " AND Cotizacion.Porcentaje_de_Anticipo <= " + data.filterAdvanced.toPorcentaje_de_Anticipo;
    }
    switch (data.filterAdvanced.Comentarios_MantenimientoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cotizacion.Comentarios_Mantenimiento LIKE '" + data.filterAdvanced.Comentarios_Mantenimiento + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cotizacion.Comentarios_Mantenimiento LIKE '%" + data.filterAdvanced.Comentarios_Mantenimiento + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cotizacion.Comentarios_Mantenimiento LIKE '%" + data.filterAdvanced.Comentarios_Mantenimiento + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cotizacion.Comentarios_Mantenimiento = '" + data.filterAdvanced.Comentarios_Mantenimiento + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Reporte != 'undefined' && data.filterAdvanced.Reporte)) {
      switch (data.filterAdvanced.ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.ReporteMultiple != null && data.filterAdvanced.ReporteMultiple.length > 0) {
      var Reporteds = data.filterAdvanced.ReporteMultiple.join(",");
      condition += " AND Cotizacion.Reporte In (" + Reporteds + ")";
    }
    if ((typeof data.filterAdvanced.fromItem_de_Inspeccion != 'undefined' && data.filterAdvanced.fromItem_de_Inspeccion)
      || (typeof data.filterAdvanced.toItem_de_Inspeccion != 'undefined' && data.filterAdvanced.toItem_de_Inspeccion)) {
      if (typeof data.filterAdvanced.fromItem_de_Inspeccion != 'undefined' && data.filterAdvanced.fromItem_de_Inspeccion)
        condition += " AND Cotizacion.Item_de_Inspeccion >= " + data.filterAdvanced.fromItem_de_Inspeccion;

      if (typeof data.filterAdvanced.toItem_de_Inspeccion != 'undefined' && data.filterAdvanced.toItem_de_Inspeccion)
        condition += " AND Cotizacion.Item_de_Inspeccion <= " + data.filterAdvanced.toItem_de_Inspeccion;
    }
    if ((typeof data.filterAdvanced.Motivo_de_Edicion != 'undefined' && data.filterAdvanced.Motivo_de_Edicion)) {
      switch (data.filterAdvanced.Motivo_de_EdicionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Motivo_de_Edicion_de_Cotizacion.Descripcion LIKE '" + data.filterAdvanced.Motivo_de_Edicion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Motivo_de_Edicion_de_Cotizacion.Descripcion LIKE '%" + data.filterAdvanced.Motivo_de_Edicion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Motivo_de_Edicion_de_Cotizacion.Descripcion LIKE '%" + data.filterAdvanced.Motivo_de_Edicion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Motivo_de_Edicion_de_Cotizacion.Descripcion = '" + data.filterAdvanced.Motivo_de_Edicion + "'";
          break;
      }
    } else if (data.filterAdvanced.Motivo_de_EdicionMultiple != null && data.filterAdvanced.Motivo_de_EdicionMultiple.length > 0) {
      var Motivo_de_Edicionds = data.filterAdvanced.Motivo_de_EdicionMultiple.join(",");
      condition += " AND Cotizacion.Motivo_de_Edicion In (" + Motivo_de_Edicionds + ")";
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cotizacion.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cotizacion.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cotizacion.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cotizacion.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Respuesta != 'undefined' && data.filterAdvanced.fromFecha_de_Respuesta)
      || (typeof data.filterAdvanced.toFecha_de_Respuesta != 'undefined' && data.filterAdvanced.toFecha_de_Respuesta)) {
      if (typeof data.filterAdvanced.fromFecha_de_Respuesta != 'undefined' && data.filterAdvanced.fromFecha_de_Respuesta)
        condition += " and CONVERT(VARCHAR(10), Cotizacion.Fecha_de_Respuesta, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Respuesta).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Respuesta != 'undefined' && data.filterAdvanced.toFecha_de_Respuesta)
        condition += " and CONVERT(VARCHAR(10), Cotizacion.Fecha_de_Respuesta, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Respuesta).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Respuesta != 'undefined' && data.filterAdvanced.fromHora_de_Respuesta)
      || (typeof data.filterAdvanced.toHora_de_Respuesta != 'undefined' && data.filterAdvanced.toHora_de_Respuesta)) {
      if (typeof data.filterAdvanced.fromHora_de_Respuesta != 'undefined' && data.filterAdvanced.fromHora_de_Respuesta)
        condition += " and Cotizacion.Hora_de_Respuesta >= '" + data.filterAdvanced.fromHora_de_Respuesta + "'";

      if (typeof data.filterAdvanced.toHora_de_Respuesta != 'undefined' && data.filterAdvanced.toHora_de_Respuesta)
        condition += " and Cotizacion.Hora_de_Respuesta <= '" + data.filterAdvanced.toHora_de_Respuesta + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_Registra_Respuesta != 'undefined' && data.filterAdvanced.Usuario_que_Registra_Respuesta)) {
      switch (data.filterAdvanced.Usuario_que_Registra_RespuestaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_que_Registra_Respuesta + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Registra_Respuesta + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Registra_Respuesta + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_que_Registra_Respuesta + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_Registra_RespuestaMultiple != null && data.filterAdvanced.Usuario_que_Registra_RespuestaMultiple.length > 0) {
      var Usuario_que_Registra_Respuestads = data.filterAdvanced.Usuario_que_Registra_RespuestaMultiple.join(",");
      condition += " AND Cotizacion.Usuario_que_Registra_Respuesta In (" + Usuario_que_Registra_Respuestads + ")";
    }
    if ((typeof data.filterAdvanced.Respuesta != 'undefined' && data.filterAdvanced.Respuesta)) {
      switch (data.filterAdvanced.RespuestaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Respuesta_del_Cliente_a_Cotizacion.Descripcion LIKE '" + data.filterAdvanced.Respuesta + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Respuesta_del_Cliente_a_Cotizacion.Descripcion LIKE '%" + data.filterAdvanced.Respuesta + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Respuesta_del_Cliente_a_Cotizacion.Descripcion LIKE '%" + data.filterAdvanced.Respuesta + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Respuesta_del_Cliente_a_Cotizacion.Descripcion = '" + data.filterAdvanced.Respuesta + "'";
          break;
      }
    } else if (data.filterAdvanced.RespuestaMultiple != null && data.filterAdvanced.RespuestaMultiple.length > 0) {
      var Respuestads = data.filterAdvanced.RespuestaMultiple.join(",");
      condition += " AND Cotizacion.Respuesta In (" + Respuestads + ")";
    }
    switch (data.filterAdvanced.Observaciones_RespeustaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cotizacion.Observaciones_Respeusta LIKE '" + data.filterAdvanced.Observaciones_Respeusta + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cotizacion.Observaciones_Respeusta LIKE '%" + data.filterAdvanced.Observaciones_Respeusta + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cotizacion.Observaciones_Respeusta LIKE '%" + data.filterAdvanced.Observaciones_Respeusta + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cotizacion.Observaciones_Respeusta = '" + data.filterAdvanced.Observaciones_Respeusta + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromDia_de_Llegada_del_Avion != 'undefined' && data.filterAdvanced.fromDia_de_Llegada_del_Avion)
      || (typeof data.filterAdvanced.toDia_de_Llegada_del_Avion != 'undefined' && data.filterAdvanced.toDia_de_Llegada_del_Avion)) {
      if (typeof data.filterAdvanced.fromDia_de_Llegada_del_Avion != 'undefined' && data.filterAdvanced.fromDia_de_Llegada_del_Avion)
        condition += " and CONVERT(VARCHAR(10), Cotizacion.Dia_de_Llegada_del_Avion, 102)  >= '" + moment(data.filterAdvanced.fromDia_de_Llegada_del_Avion).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toDia_de_Llegada_del_Avion != 'undefined' && data.filterAdvanced.toDia_de_Llegada_del_Avion)
        condition += " and CONVERT(VARCHAR(10), Cotizacion.Dia_de_Llegada_del_Avion, 102)  <= '" + moment(data.filterAdvanced.toDia_de_Llegada_del_Avion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Llegada_del_Avion != 'undefined' && data.filterAdvanced.fromHora_de_Llegada_del_Avion)
      || (typeof data.filterAdvanced.toHora_de_Llegada_del_Avion != 'undefined' && data.filterAdvanced.toHora_de_Llegada_del_Avion)) {
      if (typeof data.filterAdvanced.fromHora_de_Llegada_del_Avion != 'undefined' && data.filterAdvanced.fromHora_de_Llegada_del_Avion)
        condition += " and Cotizacion.Hora_de_Llegada_del_Avion >= '" + data.filterAdvanced.fromHora_de_Llegada_del_Avion + "'";

      if (typeof data.filterAdvanced.toHora_de_Llegada_del_Avion != 'undefined' && data.filterAdvanced.toHora_de_Llegada_del_Avion)
        condition += " and Cotizacion.Hora_de_Llegada_del_Avion <= '" + data.filterAdvanced.toHora_de_Llegada_del_Avion + "'";
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
          } else if (column != 'acciones' && column != 'Clausulas_Especificas' && column != 'Clausulas_Generales') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Cotizacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false || column === 'Paquete_de_beneficios') { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Cotizacions);
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
