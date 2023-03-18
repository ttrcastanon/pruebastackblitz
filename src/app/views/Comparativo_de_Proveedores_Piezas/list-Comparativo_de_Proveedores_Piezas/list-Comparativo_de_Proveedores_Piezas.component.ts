import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Comparativo_de_Proveedores_PiezasService } from "src/app/api-services/Comparativo_de_Proveedores_Piezas.service";
import { Comparativo_de_Proveedores_Piezas } from "src/app/models/Comparativo_de_Proveedores_Piezas";
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
import { Comparativo_de_Proveedores_PiezasIndexRules } from 'src/app/shared/businessRules/Comparativo_de_Proveedores_Piezas-index-rules';
import { DialogConfirmExportComponent } from "./../../../shared/views/dialogs/dialog-confirm-export/dialog-confirm-export.component";
import { Enumerations } from 'src/app/models/enumerations';
import _, { map } from 'underscore';
import { ExcelService } from "src/app/api-services/excel.service";
import * as momentJS from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogPrintFormatComponent } from './../../../shared/views/dialogs/dialog-print-format/dialog-print-format.component';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { SpartanService } from 'src/app/api-services/spartan.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-list-Comparativo_de_Proveedores_Piezas",
  templateUrl: "./list-Comparativo_de_Proveedores_Piezas.component.html",
  styleUrls: ["./list-Comparativo_de_Proveedores_Piezas.component.scss"],
})
export class ListComparativo_de_Proveedores_PiezasComponent extends Comparativo_de_Proveedores_PiezasIndexRules implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {

  //#region Variables
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No__Solicitud",
    "Solicitante",
    "Fecha_de_Solicitud",
    "Razon_de_la_Compra",
    "Departamento",
    "Numero_de_Reporte",
    "Numero_de_O_T",
    "Matricula",
    "Modelo",
    "Estatus",
    "Proveedor1",
    "Total_Proveedor1",
    "Total_Cotizacion_Proveedor1",
    "Tipo_de_Moneda1",
    "Proveedor2",
    "Total_Proveedor2",
    "Total_Cotizacion_Proveedor2",
    "Tipo_de_Moneda2",
    "Proveedor3",
    "Total_Proveedor3",
    "Total_Cotizacion_Proveedor3",
    "Tipo_de_Moneda3",
    "Proveedor4",
    "Total_Proveedor4",
    "Total_Cotizacion_Proveedor4",
    "Tipo_de_Moneda4",
    "Total_Cotizacion",
    "Tipo_de_Cambio",
    "Tipo_de_Moneda",
    "Observaciones",
    "Estatus_de_Seguimiento",
    "idComprasGenerales",
    "idGestionAprobacionMantenimiento",
    "FolioComparativoProv",
    "Fecha_de_Autorizacion",
    "Hora_de_Autorizacion",
    "Autorizado_por",
    "Resultado",
    "Motivo_de_Rechazo",
    "Fecha_de_Autorizacion_DG",
    "Hora_de_Autorizacion_DG",
    "Autorizado_por_DG",
    "Resultado_DG",
    "Motivo_de_Rechazo_DG",
    "Fecha_de_Autorizacion_Adm",
    "Hora_de_Autorizacion_Adm",
    "Autorizado_por_Adm",
    "Resultado_Adm",
    "Motivo_de_Rechazo_Adm",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__Solicitud",
      "Solicitante",
      "Fecha_de_Solicitud",
      "Razon_de_la_Compra",
      "Departamento",
      "Numero_de_Reporte",
      "Numero_de_O_T",
      "Matricula",
      "Modelo",
      "Estatus",
      "Proveedor1",
      "Total_Proveedor1",
      "Total_Cotizacion_Proveedor1",
      "Tipo_de_Moneda1",
      "Proveedor2",
      "Total_Proveedor2",
      "Total_Cotizacion_Proveedor2",
      "Tipo_de_Moneda2",
      "Proveedor3",
      "Total_Proveedor3",
      "Total_Cotizacion_Proveedor3",
      "Tipo_de_Moneda3",
      "Proveedor4",
      "Total_Proveedor4",
      "Total_Cotizacion_Proveedor4",
      "Tipo_de_Moneda4",
      "Total_Cotizacion",
      "Tipo_de_Cambio",
      "Tipo_de_Moneda",
      "Observaciones",
      "Estatus_de_Seguimiento",
      "idComprasGenerales",
      "idGestionAprobacionMantenimiento",
      "FolioComparativoProv",
      "Fecha_de_Autorizacion",
      "Hora_de_Autorizacion",
      "Autorizado_por",
      "Resultado",
      "Motivo_de_Rechazo",
      "Fecha_de_Autorizacion_DG",
      "Hora_de_Autorizacion_DG",
      "Autorizado_por_DG",
      "Resultado_DG",
      "Motivo_de_Rechazo_DG",
      "Fecha_de_Autorizacion_Adm",
      "Hora_de_Autorizacion_Adm",
      "Autorizado_por_Adm",
      "Resultado_Adm",
      "Motivo_de_Rechazo_Adm",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__Solicitud_filtro",
      "Solicitante_filtro",
      "Fecha_de_Solicitud_filtro",
      "Razon_de_la_Compra_filtro",
      "Departamento_filtro",
      "Numero_de_Reporte_filtro",
      "Numero_de_O_T_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Estatus_filtro",
      "Proveedor1_filtro",
      "Total_Proveedor1_filtro",
      "Total_Cotizacion_Proveedor1_filtro",
      "Tipo_de_Moneda1_filtro",
      "Proveedor2_filtro",
      "Total_Proveedor2_filtro",
      "Total_Cotizacion_Proveedor2_filtro",
      "Tipo_de_Moneda2_filtro",
      "Proveedor3_filtro",
      "Total_Proveedor3_filtro",
      "Total_Cotizacion_Proveedor3_filtro",
      "Tipo_de_Moneda3_filtro",
      "Proveedor4_filtro",
      "Total_Proveedor4_filtro",
      "Total_Cotizacion_Proveedor4_filtro",
      "Tipo_de_Moneda4_filtro",
      "Total_Cotizacion_filtro",
      "Tipo_de_Cambio_filtro",
      "Tipo_de_Moneda_filtro",
      "Observaciones_filtro",
      "Estatus_de_Seguimiento_filtro",
      "idComprasGenerales_filtro",
      "idGestionAprobacionMantenimiento_filtro",
      "FolioComparativoProv_filtro",
      "Fecha_de_Autorizacion_filtro",
      "Hora_de_Autorizacion_filtro",
      "Autorizado_por_filtro",
      "Resultado_filtro",
      "Motivo_de_Rechazo_filtro",
      "Fecha_de_Autorizacion_DG_filtro",
      "Hora_de_Autorizacion_DG_filtro",
      "Autorizado_por_DG_filtro",
      "Resultado_DG_filtro",
      "Motivo_de_Rechazo_DG_filtro",
      "Fecha_de_Autorizacion_Adm_filtro",
      "Hora_de_Autorizacion_Adm_filtro",
      "Autorizado_por_Adm_filtro",
      "Resultado_Adm_filtro",
      "Motivo_de_Rechazo_Adm_filtro",

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
      No__Solicitud: "",
      Solicitante: "",
      Fecha_de_Solicitud: null,
      Razon_de_la_Compra: "",
      Departamento: "",
      Numero_de_Reporte: "",
      Numero_de_O_T: "",
      Matricula: "",
      Modelo: "",
      Estatus: "",
      Proveedor1: "",
      Total_Proveedor1: "",
      Total_Cotizacion_Proveedor1: "",
      Tipo_de_Moneda1: "",
      Proveedor2: "",
      Total_Proveedor2: "",
      Total_Cotizacion_Proveedor2: "",
      Tipo_de_Moneda2: "",
      Proveedor3: "",
      Total_Proveedor3: "",
      Total_Cotizacion_Proveedor3: "",
      Tipo_de_Moneda3: "",
      Proveedor4: "",
      Total_Proveedor4: "",
      Total_Cotizacion_Proveedor4: "",
      Tipo_de_Moneda4: "",
      Total_Cotizacion: "",
      Tipo_de_Cambio: "",
      Tipo_de_Moneda: "",
      Observaciones: "",
      Estatus_de_Seguimiento: "",
      idComprasGenerales: "",
      idGestionAprobacionMantenimiento: "",
      FolioComparativoProv: "",
      Fecha_de_Autorizacion: null,
      Hora_de_Autorizacion: "",
      Autorizado_por: "",
      Resultado: "",
      Motivo_de_Rechazo: "",
      Fecha_de_Autorizacion_DG: null,
      Hora_de_Autorizacion_DG: "",
      Autorizado_por_DG: "",
      Resultado_DG: "",
      Motivo_de_Rechazo_DG: "",
      Fecha_de_Autorizacion_Adm: null,
      Hora_de_Autorizacion_Adm: "",
      Autorizado_por_Adm: "",
      Resultado_Adm: "",
      Motivo_de_Rechazo_Adm: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromNo__Solicitud: "",
      toNo__Solicitud: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      fromFecha_de_Solicitud: "",
      toFecha_de_Solicitud: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      Numero_de_ReporteFilter: "",
      Numero_de_Reporte: "",
      Numero_de_ReporteMultiple: "",
      Numero_de_O_TFilter: "",
      Numero_de_O_T: "",
      Numero_de_O_TMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      Proveedor1Filter: "",
      Proveedor1: "",
      Proveedor1Multiple: "",
      fromTotal_Proveedor1: "",
      toTotal_Proveedor1: "",
      fromTotal_Cotizacion_Proveedor1: "",
      toTotal_Cotizacion_Proveedor1: "",
      Tipo_de_Moneda1Filter: "",
      Tipo_de_Moneda1: "",
      Tipo_de_Moneda1Multiple: "",
      Proveedor2Filter: "",
      Proveedor2: "",
      Proveedor2Multiple: "",
      fromTotal_Proveedor2: "",
      toTotal_Proveedor2: "",
      fromTotal_Cotizacion_Proveedor2: "",
      toTotal_Cotizacion_Proveedor2: "",
      Tipo_de_Moneda2Filter: "",
      Tipo_de_Moneda2: "",
      Tipo_de_Moneda2Multiple: "",
      Proveedor3Filter: "",
      Proveedor3: "",
      Proveedor3Multiple: "",
      fromTotal_Proveedor3: "",
      toTotal_Proveedor3: "",
      fromTotal_Cotizacion_Proveedor3: "",
      toTotal_Cotizacion_Proveedor3: "",
      Tipo_de_Moneda3Filter: "",
      Tipo_de_Moneda3: "",
      Tipo_de_Moneda3Multiple: "",
      Proveedor4Filter: "",
      Proveedor4: "",
      Proveedor4Multiple: "",
      fromTotal_Proveedor4: "",
      toTotal_Proveedor4: "",
      fromTotal_Cotizacion_Proveedor4: "",
      toTotal_Cotizacion_Proveedor4: "",
      Tipo_de_Moneda4Filter: "",
      Tipo_de_Moneda4: "",
      Tipo_de_Moneda4Multiple: "",
      fromTotal_Cotizacion: "",
      toTotal_Cotizacion: "",
      fromTipo_de_Cambio: "",
      toTipo_de_Cambio: "",
      Tipo_de_MonedaFilter: "",
      Tipo_de_Moneda: "",
      Tipo_de_MonedaMultiple: "",
      Estatus_de_SeguimientoFilter: "",
      Estatus_de_Seguimiento: "",
      Estatus_de_SeguimientoMultiple: "",
      fromidComprasGenerales: "",
      toidComprasGenerales: "",
      fromidGestionAprobacionMantenimiento: "",
      toidGestionAprobacionMantenimiento: "",
      fromFecha_de_Autorizacion: "",
      toFecha_de_Autorizacion: "",
      fromHora_de_Autorizacion: "",
      toHora_de_Autorizacion: "",
      Autorizado_porFilter: "",
      Autorizado_por: "",
      Autorizado_porMultiple: "",
      ResultadoFilter: "",
      Resultado: "",
      ResultadoMultiple: "",
      fromFecha_de_Autorizacion_DG: "",
      toFecha_de_Autorizacion_DG: "",
      fromHora_de_Autorizacion_DG: "",
      toHora_de_Autorizacion_DG: "",
      Autorizado_por_DGFilter: "",
      Autorizado_por_DG: "",
      Autorizado_por_DGMultiple: "",
      Resultado_DGFilter: "",
      Resultado_DG: "",
      Resultado_DGMultiple: "",
      fromFecha_de_Autorizacion_Adm: "",
      toFecha_de_Autorizacion_Adm: "",
      fromHora_de_Autorizacion_Adm: "",
      toHora_de_Autorizacion_Adm: "",
      Autorizado_por_AdmFilter: "",
      Autorizado_por_Adm: "",
      Autorizado_por_AdmMultiple: "",
      Resultado_AdmFilter: "",
      Resultado_Adm: "",
      Resultado_AdmMultiple: "",

    }
  };

  dataSource: Comparativo_de_Proveedores_PiezasDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Comparativo_de_Proveedores_PiezasDataSource;
  dataClipboard: any;
  Phase: any
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  public subscriber: Subscription

  //#endregion

  constructor(
    private _Comparativo_de_Proveedores_PiezasService: Comparativo_de_Proveedores_PiezasService,
    private activateRoute: ActivatedRoute,
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
    private route: Router,
    renderer: Renderer2
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
          this.Phase = params.get('id');
        });
      this.localStorageHelper.setItemToLocalStorage('Phase', this.Phase);


      this.rulesBeforeCreationList();
      this.dataSource = new Comparativo_de_Proveedores_PiezasDataSource(
        this._Comparativo_de_Proveedores_PiezasService, this._file
      );
      this.init();
    });

  }

  ngOnInit() {

    this._seguridad.permisos(AppConstants.Permisos.Comparativo_de_Proveedores_Piezas).subscribe((response) => {
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

  ngOnDestroy() {
    this.subscriber?.unsubscribe();
  }


  clearFilter() {
    this.listConfig.page = 0;
    this.listConfig.filter.Folio = "";
    this.listConfig.filter.No__Solicitud = "";
    this.listConfig.filter.Solicitante = "";
    this.listConfig.filter.Fecha_de_Solicitud = undefined;
    this.listConfig.filter.Razon_de_la_Compra = "";
    this.listConfig.filter.Departamento = "";
    this.listConfig.filter.Numero_de_Reporte = "";
    this.listConfig.filter.Numero_de_O_T = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Proveedor1 = "";
    this.listConfig.filter.Total_Proveedor1 = "";
    this.listConfig.filter.Total_Cotizacion_Proveedor1 = "";
    this.listConfig.filter.Tipo_de_Moneda1 = "";
    this.listConfig.filter.Proveedor2 = "";
    this.listConfig.filter.Total_Proveedor2 = "";
    this.listConfig.filter.Total_Cotizacion_Proveedor2 = "";
    this.listConfig.filter.Tipo_de_Moneda2 = "";
    this.listConfig.filter.Proveedor3 = "";
    this.listConfig.filter.Total_Proveedor3 = "";
    this.listConfig.filter.Total_Cotizacion_Proveedor3 = "";
    this.listConfig.filter.Tipo_de_Moneda3 = "";
    this.listConfig.filter.Proveedor4 = "";
    this.listConfig.filter.Total_Proveedor4 = "";
    this.listConfig.filter.Total_Cotizacion_Proveedor4 = "";
    this.listConfig.filter.Tipo_de_Moneda4 = "";
    this.listConfig.filter.Total_Cotizacion = "";
    this.listConfig.filter.Tipo_de_Cambio = "";
    this.listConfig.filter.Tipo_de_Moneda = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.Estatus_de_Seguimiento = "";
    this.listConfig.filter.idComprasGenerales = "";
    this.listConfig.filter.idGestionAprobacionMantenimiento = "";
    this.listConfig.filter.FolioComparativoProv = "";
    this.listConfig.filter.Fecha_de_Autorizacion = undefined;
    this.listConfig.filter.Hora_de_Autorizacion = "";
    this.listConfig.filter.Autorizado_por = "";
    this.listConfig.filter.Resultado = "";
    this.listConfig.filter.Motivo_de_Rechazo = "";
    this.listConfig.filter.Fecha_de_Autorizacion_DG = undefined;
    this.listConfig.filter.Hora_de_Autorizacion_DG = "";
    this.listConfig.filter.Autorizado_por_DG = "";
    this.listConfig.filter.Resultado_DG = "";
    this.listConfig.filter.Motivo_de_Rechazo_DG = "";
    this.listConfig.filter.Fecha_de_Autorizacion_Adm = undefined;
    this.listConfig.filter.Hora_de_Autorizacion_Adm = "";
    this.listConfig.filter.Autorizado_por_Adm = "";
    this.listConfig.filter.Resultado_Adm = "";
    this.listConfig.filter.Motivo_de_Rechazo_Adm = "";

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

    //INICIA - BRID:7148 - WF:10 Rule List - Phase: 1 (Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 1) {
      this.brf.SetFilteronList(this.listConfig, ` Comparativo_de_Proveedores_Piezas.Folio IN (select * from dbo.FiltroCuadroComparativo(1, ${this.RoleId} )) `);
    }
    //TERMINA - BRID:7148


    //INICIA - BRID:7150 - WF:10 Rule List - Phase: 2 (No Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 2) {
      this.brf.SetFilteronList(this.listConfig, ` Comparativo_de_Proveedores_Piezas.Folio IN (select * from dbo.FiltroCuadroComparativo(2, ${this.RoleId} )) `);
    }
    //TERMINA - BRID:7150


    //INICIA - BRID:7152 - WF:10 Rule List - Phase: 3 (En Proceso de Autorización) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 3) {
      this.brf.SetFilteronList(this.listConfig, ` Comparativo_de_Proveedores_Piezas.Folio IN (select * from dbo.FiltroCuadroComparativo(3, ${this.RoleId} )) `);
    }
    //TERMINA - BRID:7152

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

  remove(row: Comparativo_de_Proveedores_Piezas) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Comparativo_de_Proveedores_PiezasService
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
  ActionPrint(dataRow: Comparativo_de_Proveedores_Piezas) {

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
      , 'No. Solicitud'
      , 'Solicitante'
      , 'Fecha de Solicitud'
      , 'Razón de la Compra'
      , 'Departamento'
      , 'Número de Reporte'
      , 'Número de O/T'
      , 'Matrícula'
      , 'Modelo'
      , 'Estatus'
      , 'Proveedor:'
      , 'Total Proveedor:'
      , 'Total Cotización Proveedor:'
      , 'Tipo de Moneda:'
      , 'Total Cotización:'
      , 'Tipo de Cambio:'
      , 'Observaciones'
      , 'Estatus de Seguimiento'
      , 'idComprasGenerales  '
      , 'idGestionAprobacionMantenimiento'
      , 'FolioComparativoProv'
      , 'Fecha de Autorización'
      , 'Hora de Autorización'
      , 'Autorizado por'
      , 'Resultado'
      , 'Motivo'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.No__Solicitud
        , x.Solicitante_Spartan_User.Name
        , x.Fecha_de_Solicitud
        , x.Razon_de_la_Compra
        , x.Departamento_Departamento.Nombre
        , x.Numero_de_Reporte_Crear_Reporte.No_Reporte
        , x.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden
        , x.Matricula_Aeronave.Matricula
        , x.Modelo_Modelos.Descripcion
        , x.Estatus
        , x.Proveedor1_Creacion_de_Proveedores.Razon_social
        , x.Total_Proveedor1
        , x.Total_Cotizacion_Proveedor1
        , x.Tipo_de_Moneda1_Moneda.Descripcion
        , x.Proveedor2_Creacion_de_Proveedores.Razon_social
        , x.Total_Proveedor2
        , x.Total_Cotizacion_Proveedor2
        , x.Tipo_de_Moneda2_Moneda.Descripcion
        , x.Proveedor3_Creacion_de_Proveedores.Razon_social
        , x.Total_Proveedor3
        , x.Total_Cotizacion_Proveedor3
        , x.Tipo_de_Moneda3_Moneda.Descripcion
        , x.Proveedor4_Creacion_de_Proveedores.Razon_social
        , x.Total_Proveedor4
        , x.Total_Cotizacion_Proveedor4
        , x.Tipo_de_Moneda4_Moneda.Descripcion
        , x.Tipo_de_Cambio
        , x.Tipo_de_Moneda_Moneda.Descripcion
        , x.Observaciones
        , x.Estatus_de_Seguimiento_Estatus_de_Seguimiento.Descripcion
        , x.idComprasGenerales
        , x.idGestionAprobacionMantenimiento
        , x.FolioComparativoProv
        , x.Fecha_de_Autorizacion
        , x.Hora_de_Autorizacion
        , x.Autorizado_por_Spartan_User.Name
        , x.Resultado_Autorizacion.Resultado
        , x.Motivo_de_Rechazo
        , x.Fecha_de_Autorizacion_DG
        , x.Hora_de_Autorizacion_DG
        , x.Autorizado_por_DG_Spartan_User.Name
        , x.Resultado_DG_Autorizacion.Resultado
        , x.Motivo_de_Rechazo_DG
        , x.Fecha_de_Autorizacion_Adm
        , x.Hora_de_Autorizacion_Adm
        , x.Autorizado_por_Adm_Spartan_User.Name
        , x.Resultado_Adm_Autorizacion.Resultado
        , x.Motivo_de_Rechazo_Adm

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
    pdfMake.createPdf(pdfDefinition).download('Comparativo_de_Proveedores_Piezas.pdf');
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
          this._Comparativo_de_Proveedores_PiezasService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Comparativo_de_Proveedores_Piezass;
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
          this._Comparativo_de_Proveedores_PiezasService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Comparativo_de_Proveedores_Piezass;
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
        'No. Solicitud ': fields.No__Solicitud,
        'Solicitante ': fields.Solicitante_Spartan_User.Name,
        'Fecha de Solicitud ': fields.Fecha_de_Solicitud ? momentJS(fields.Fecha_de_Solicitud).format('DD/MM/YYYY') : '',
        'Razón de la Compra ': fields.Razon_de_la_Compra,
        'Departamento ': fields.Departamento_Departamento.Nombre,
        'Número de Reporte ': fields.Numero_de_Reporte_Crear_Reporte.No_Reporte,
        'Número de O/T ': fields.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'Estatus ': fields.Estatus,
        'Proveedor: ': fields.Proveedor1_Creacion_de_Proveedores.Razon_social,
        'Total Proveedor: ': fields.Total_Proveedor1,
        'Total Cotización Proveedor: ': fields.Total_Cotizacion_Proveedor1,
        'Tipo de Moneda: ': fields.Tipo_de_Moneda1_Moneda.Descripcion,
        'Proveedor: 1': fields.Proveedor2_Creacion_de_Proveedores.Razon_social,
        'Total Proveedor2: ': fields.Total_Proveedor2,
        'Total Cotización Proveedor2: ': fields.Total_Cotizacion_Proveedor2,
        'Tipo de Moneda: 1': fields.Tipo_de_Moneda2_Moneda.Descripcion,
        'Proveedor: 2': fields.Proveedor3_Creacion_de_Proveedores.Razon_social,
        'Total Proveedor3: ': fields.Total_Proveedor3,
        'Total Cotización Proveedor3: ': fields.Total_Cotizacion_Proveedor3,
        'Tipo de Moneda: 2': fields.Tipo_de_Moneda3_Moneda.Descripcion,
        'Proveedor: 3': fields.Proveedor4_Creacion_de_Proveedores.Razon_social,
        'Total Proveedor4: ': fields.Total_Proveedor4,
        'Total Cotización Proveedor4: ': fields.Total_Cotizacion_Proveedor4,
        'Tipo de Moneda: 3': fields.Tipo_de_Moneda4_Moneda.Descripcion,
        'Total Cotización: ': fields.Total_Cotizacion,
        'Tipo de Cambio: ': fields.Tipo_de_Cambio,
        'Tipo de Moneda: 4': fields.Tipo_de_Moneda_Moneda.Descripcion,
        'Observaciones ': fields.Observaciones,
        'Estatus de Seguimiento ': fields.Estatus_de_Seguimiento_Estatus_de_Seguimiento.Descripcion,
        'idComprasGenerales   ': fields.idComprasGenerales,
        'idGestionAprobacionMantenimiento ': fields.idGestionAprobacionMantenimiento,
        'FolioComparativoProv ': fields.FolioComparativoProv,
        'Fecha de Autorización ': fields.Fecha_de_Autorizacion ? momentJS(fields.Fecha_de_Autorizacion).format('DD/MM/YYYY') : '',
        'Hora de Autorización ': fields.Hora_de_Autorizacion,
        'Autorizado por 1': fields.Autorizado_por_Spartan_User.Name,
        'Resultado ': fields.Resultado_Autorizacion.Resultado,
        'Motivo ': fields.Motivo_de_Rechazo,
        'Fecha de Autorización 2 ': fields.Fecha_de_Autorizacion_DG ? momentJS(fields.Fecha_de_Autorizacion_DG).format('DD/MM/YYYY') : '',
        'Hora de Autorización 2': fields.Hora_de_Autorizacion_DG,
        'Autorizado por 2': fields.Autorizado_por_DG_Spartan_User.Name,
        'Resultado 1': fields.Resultado_DG_Autorizacion.Resultado,
        'Motivo 2': fields.Motivo_de_Rechazo_DG,
        'Fecha de Autorización 3': fields.Fecha_de_Autorizacion_Adm ? momentJS(fields.Fecha_de_Autorizacion_Adm).format('DD/MM/YYYY') : '',
        'Hora de Autorización 3': fields.Hora_de_Autorizacion_Adm,
        'Autorizado por 3': fields.Autorizado_por_Adm_Spartan_User.Name,
        'Resultado 2': fields.Resultado_Adm_Autorizacion.Resultado,
        'Motivo 3': fields.Motivo_de_Rechazo_Adm,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Comparativo_de_Proveedores_Piezas  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No__Solicitud: x.No__Solicitud,
      Solicitante: x.Solicitante_Spartan_User.Name,
      Fecha_de_Solicitud: x.Fecha_de_Solicitud,
      Razon_de_la_Compra: x.Razon_de_la_Compra,
      Departamento: x.Departamento_Departamento.Nombre,
      Numero_de_Reporte: x.Numero_de_Reporte_Crear_Reporte.No_Reporte,
      Numero_de_O_T: x.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      Estatus: x.Estatus,
      Proveedor1: x.Proveedor1_Creacion_de_Proveedores.Razon_social,
      Total_Proveedor1: x.Total_Proveedor1,
      Total_Cotizacion_Proveedor1: x.Total_Cotizacion_Proveedor1,
      Tipo_de_Moneda1: x.Tipo_de_Moneda1_Moneda.Descripcion,
      Proveedor2: x.Proveedor2_Creacion_de_Proveedores.Razon_social,
      Total_Proveedor2: x.Total_Proveedor2,
      Total_Cotizacion_Proveedor2: x.Total_Cotizacion_Proveedor2,
      Tipo_de_Moneda2: x.Tipo_de_Moneda2_Moneda.Descripcion,
      Proveedor3: x.Proveedor3_Creacion_de_Proveedores.Razon_social,
      Total_Proveedor3: x.Total_Proveedor3,
      Total_Cotizacion_Proveedor3: x.Total_Cotizacion_Proveedor3,
      Tipo_de_Moneda3: x.Tipo_de_Moneda3_Moneda.Descripcion,
      Proveedor4: x.Proveedor4_Creacion_de_Proveedores.Razon_social,
      Total_Proveedor4: x.Total_Proveedor4,
      Total_Cotizacion_Proveedor4: x.Total_Cotizacion_Proveedor4,
      Tipo_de_Moneda4: x.Tipo_de_Moneda4_Moneda.Descripcion,
      Total_Cotizacion: x.Total_Cotizacion,
      Tipo_de_Cambio: x.Tipo_de_Cambio,
      Tipo_de_Moneda: x.Tipo_de_Moneda_Moneda.Descripcion,
      Observaciones: x.Observaciones,
      Estatus_de_Seguimiento: x.Estatus_de_Seguimiento_Estatus_de_Seguimiento.Descripcion,
      idComprasGenerales: x.idComprasGenerales,
      idGestionAprobacionMantenimiento: x.idGestionAprobacionMantenimiento,
      FolioComparativoProv: x.FolioComparativoProv,
      Fecha_de_Autorizacion: x.Fecha_de_Autorizacion,
      Hora_de_Autorizacion: x.Hora_de_Autorizacion,
      Autorizado_por: x.Autorizado_por_Spartan_User.Name,
      Resultado: x.Resultado_Autorizacion.Resultado,
      Motivo_de_Rechazo: x.Motivo_de_Rechazo,
      Fecha_de_Autorizacion_DG: x.Fecha_de_Autorizacion_DG,
      Hora_de_Autorizacion_DG: x.Hora_de_Autorizacion_DG,
      Autorizado_por_DG: x.Autorizado_por_DG_Spartan_User.Name,
      Resultado_DG: x.Resultado_DG_Autorizacion.Resultado,
      Motivo_de_Rechazo_DG: x.Motivo_de_Rechazo_DG,
      Fecha_de_Autorizacion_Adm: x.Fecha_de_Autorizacion_Adm,
      Hora_de_Autorizacion_Adm: x.Hora_de_Autorizacion_Adm,
      Autorizado_por_Adm: x.Autorizado_por_Adm_Spartan_User.Name,
      Resultado_Adm: x.Resultado_Adm_Autorizacion.Resultado,
      Motivo_de_Rechazo_Adm: x.Motivo_de_Rechazo_Adm,

    }));

    this.excelService.exportToCsv(result, 'Comparativo_de_Proveedores_Piezas', ['Folio', 'No__Solicitud', 'Solicitante', 'Fecha_de_Solicitud', 'Razon_de_la_Compra', 'Departamento', 'Numero_de_Reporte', 'Numero_de_O_T', 'Matricula', 'Modelo', 'Estatus', 'Proveedor1', 'Total_Proveedor1', 'Total_Cotizacion_Proveedor1', 'Tipo_de_Moneda1', 'Proveedor2', 'Total_Proveedor2', 'Total_Cotizacion_Proveedor2', 'Tipo_de_Moneda2', 'Proveedor3', 'Total_Proveedor3', 'Total_Cotizacion_Proveedor3', 'Tipo_de_Moneda3', 'Proveedor4', 'Total_Proveedor4', 'Total_Cotizacion_Proveedor4', 'Tipo_de_Moneda4', 'Total_Cotizacion', 'Tipo_de_Cambio', 'Tipo_de_Moneda', 'Observaciones', 'Estatus_de_Seguimiento', 'idComprasGenerales', 'idGestionAprobacionMantenimiento', 'FolioComparativoProv', 'Fecha_de_Autorizacion', 'Hora_de_Autorizacion', 'Autorizado_por', 'Resultado', 'Motivo_de_Rechazo', 'Fecha_de_Autorizacion_DG', 'Hora_de_Autorizacion_DG', 'Autorizado_por_DG', 'Resultado_DG', 'Motivo_de_Rechazo_DG', 'Fecha_de_Autorizacion_Adm', 'Hora_de_Autorizacion_Adm', 'Autorizado_por_Adm', 'Resultado_Adm', 'Motivo_de_Rechazo_Adm']);
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
    template += '          <th>No. Solicitud</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Fecha de Solicitud</th>';
    template += '          <th>Razón de la Compra</th>';
    template += '          <th>Departamento</th>';
    template += '          <th>Número de Reporte</th>';
    template += '          <th>Número de O/T</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Proveedor:</th>';
    template += '          <th>Total Proveedor:</th>';
    template += '          <th>Total Cotización Proveedor:</th>';
    template += '          <th>Tipo de Moneda:</th>';
    template += '          <th>Total Cotización:</th>';
    template += '          <th>Tipo de Cambio:</th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>Estatus de Seguimiento</th>';
    template += '          <th>idComprasGenerales  </th>';
    template += '          <th>idGestionAprobacionMantenimiento</th>';
    template += '          <th>FolioComparativoProv</th>';
    template += '          <th>Fecha de Autorización</th>';
    template += '          <th>Hora de Autorización</th>';
    template += '          <th>Autorizado por</th>';
    template += '          <th>Resultado</th>';
    template += '          <th>Motivo</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No__Solicitud + '</td>';
      template += '          <td>' + element.Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Fecha_de_Solicitud + '</td>';
      template += '          <td>' + element.Razon_de_la_Compra + '</td>';
      template += '          <td>' + element.Departamento_Departamento.Nombre + '</td>';
      template += '          <td>' + element.Numero_de_Reporte_Crear_Reporte.No_Reporte + '</td>';
      template += '          <td>' + element.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Estatus + '</td>';
      template += '          <td>' + element.Proveedor1_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.Total_Proveedor1 + '</td>';
      template += '          <td>' + element.Total_Cotizacion_Proveedor1 + '</td>';
      template += '          <td>' + element.Tipo_de_Moneda1_Moneda.Descripcion + '</td>';
      template += '          <td>' + element.Proveedor2_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.Total_Proveedor2 + '</td>';
      template += '          <td>' + element.Total_Cotizacion_Proveedor2 + '</td>';
      template += '          <td>' + element.Tipo_de_Moneda2_Moneda.Descripcion + '</td>';
      template += '          <td>' + element.Proveedor3_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.Total_Proveedor3 + '</td>';
      template += '          <td>' + element.Total_Cotizacion_Proveedor3 + '</td>';
      template += '          <td>' + element.Tipo_de_Moneda3_Moneda.Descripcion + '</td>';
      template += '          <td>' + element.Proveedor4_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.Total_Proveedor4 + '</td>';
      template += '          <td>' + element.Total_Cotizacion_Proveedor4 + '</td>';
      template += '          <td>' + element.Tipo_de_Moneda4_Moneda.Descripcion + '</td>';
      template += '          <td>' + element.Total_Cotizacion + '</td>';
      template += '          <td>' + element.Tipo_de_Cambio + '</td>';
      template += '          <td>' + element.Tipo_de_Moneda_Moneda.Descripcion + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.Estatus_de_Seguimiento_Estatus_de_Seguimiento.Descripcion + '</td>';
      template += '          <td>' + element.idComprasGenerales + '</td>';
      template += '          <td>' + element.idGestionAprobacionMantenimiento + '</td>';
      template += '          <td>' + element.FolioComparativoProv + '</td>';
      template += '          <td>' + element.Fecha_de_Autorizacion + '</td>';
      template += '          <td>' + element.Hora_de_Autorizacion + '</td>';
      template += '          <td>' + element.Autorizado_por_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_Autorizacion.Resultado + '</td>';
      template += '          <td>' + element.Motivo_de_Rechazo + '</td>';
      template += '          <td>' + element.Fecha_de_Autorizacion_DG + '</td>';
      template += '          <td>' + element.Hora_de_Autorizacion_DG + '</td>';
      template += '          <td>' + element.Autorizado_por_DG_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_DG_Autorizacion.Resultado + '</td>';
      template += '          <td>' + element.Motivo_de_Rechazo_DG + '</td>';
      template += '          <td>' + element.Fecha_de_Autorizacion_Adm + '</td>';
      template += '          <td>' + element.Hora_de_Autorizacion_Adm + '</td>';
      template += '          <td>' + element.Autorizado_por_Adm_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_Adm_Autorizacion.Resultado + '</td>';
      template += '          <td>' + element.Motivo_de_Rechazo_Adm + '</td>';

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
    template += '\t No. Solicitud';
    template += '\t Solicitante';
    template += '\t Fecha de Solicitud';
    template += '\t Razón de la Compra';
    template += '\t Departamento';
    template += '\t Número de Reporte';
    template += '\t Número de O/T';
    template += '\t Matrícula';
    template += '\t Modelo';
    template += '\t Estatus';
    template += '\t Proveedor:';
    template += '\t Total Proveedor:';
    template += '\t Total Cotización Proveedor:';
    template += '\t Tipo de Moneda:';
    template += '\t Total Cotización:';
    template += '\t Tipo de Cambio:';
    template += '\t Observaciones';
    template += '\t Estatus de Seguimiento';
    template += '\t idComprasGenerales  ';
    template += '\t idGestionAprobacionMantenimiento';
    template += '\t FolioComparativoProv';
    template += '\t Fecha de Autorización';
    template += '\t Hora de Autorización';
    template += '\t Autorizado por';
    template += '\t Resultado';
    template += '\t Motivo';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.No__Solicitud;
      template += '\t ' + element.Solicitante_Spartan_User.Name;
      template += '\t ' + element.Fecha_de_Solicitud;
      template += '\t ' + element.Razon_de_la_Compra;
      template += '\t ' + element.Departamento_Departamento.Nombre;
      template += '\t ' + element.Numero_de_Reporte_Crear_Reporte.No_Reporte;
      template += '\t ' + element.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.Estatus;
      template += '\t ' + element.Proveedor1_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.Total_Proveedor1;
      template += '\t ' + element.Total_Cotizacion_Proveedor1;
      template += '\t ' + element.Tipo_de_Moneda1_Moneda.Descripcion;
      template += '\t ' + element.Proveedor2_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.Total_Proveedor2;
      template += '\t ' + element.Total_Cotizacion_Proveedor2;
      template += '\t ' + element.Tipo_de_Moneda2_Moneda.Descripcion;
      template += '\t ' + element.Proveedor3_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.Total_Proveedor3;
      template += '\t ' + element.Total_Cotizacion_Proveedor3;
      template += '\t ' + element.Tipo_de_Moneda3_Moneda.Descripcion;
      template += '\t ' + element.Proveedor4_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.Total_Proveedor4;
      template += '\t ' + element.Total_Cotizacion_Proveedor4;
      template += '\t ' + element.Tipo_de_Moneda4_Moneda.Descripcion;
      template += '\t ' + element.Total_Cotizacion;
      template += '\t ' + element.Tipo_de_Cambio;
      template += '\t ' + element.Tipo_de_Moneda_Moneda.Descripcion;
      template += '\t ' + element.Observaciones;
      template += '\t ' + element.Estatus_de_Seguimiento_Estatus_de_Seguimiento.Descripcion;
      template += '\t ' + element.idComprasGenerales;
      template += '\t ' + element.idGestionAprobacionMantenimiento;
      template += '\t ' + element.FolioComparativoProv;
      template += '\t ' + element.Fecha_de_Autorizacion;
      template += '\t ' + element.Hora_de_Autorizacion;
      template += '\t ' + element.Autorizado_por_Spartan_User.Name;
      template += '\t ' + element.Resultado_Autorizacion.Resultado;
      template += '\t ' + element.Motivo_de_Rechazo;
      template += '\t ' + element.Fecha_de_Autorizacion_DG;
      template += '\t ' + element.Hora_de_Autorizacion_DG;
      template += '\t ' + element.Autorizado_por_DG_Spartan_User.Name;
      template += '\t ' + element.Resultado_DG_Autorizacion.Resultado;
      template += '\t ' + element.Motivo_de_Rechazo_DG;
      template += '\t ' + element.Fecha_de_Autorizacion_Adm;
      template += '\t ' + element.Hora_de_Autorizacion_Adm;
      template += '\t ' + element.Autorizado_por_Adm_Spartan_User.Name;
      template += '\t ' + element.Resultado_Adm_Autorizacion.Resultado;
      template += '\t ' + element.Motivo_de_Rechazo_Adm;

      template += '\n';
    });

    return template;
  }

}

export class Comparativo_de_Proveedores_PiezasDataSource implements DataSource<Comparativo_de_Proveedores_Piezas>
{
  private subject = new BehaviorSubject<Comparativo_de_Proveedores_Piezas[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Comparativo_de_Proveedores_PiezasService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Comparativo_de_Proveedores_Piezas[]> {
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
              const longest = result.Comparativo_de_Proveedores_Piezass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Comparativo_de_Proveedores_Piezass);
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
      condition += " and Comparativo_de_Proveedores_Piezas.Folio = " + data.filter.Folio;
    if (data.filter.No__Solicitud != "")
      condition += " and Comparativo_de_Proveedores_Piezas.No__Solicitud = " + data.filter.No__Solicitud;
    if (data.filter.Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante + "%' ";
    if (data.filter.Fecha_de_Solicitud)
      condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Solicitud, 102)  = '" + moment(data.filter.Fecha_de_Solicitud).format("YYYY.MM.DD") + "'";
    if (data.filter.Razon_de_la_Compra != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Razon_de_la_Compra like '%" + data.filter.Razon_de_la_Compra + "%' ";
    if (data.filter.Departamento != "")
      condition += " and Departamento.Nombre like '%" + data.filter.Departamento + "%' ";
    if (data.filter.Numero_de_Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.Numero_de_Reporte + "%' ";
    if (data.filter.Numero_de_O_T != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.Numero_de_O_T + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Estatus like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Proveedor1 != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor1 + "%' ";
    if (data.filter.Total_Proveedor1 != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Total_Proveedor1 = " + data.filter.Total_Proveedor1;
    if (data.filter.Total_Cotizacion_Proveedor1 != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor1 = " + data.filter.Total_Cotizacion_Proveedor1;
    if (data.filter.Tipo_de_Moneda1 != "")
      condition += " and Moneda.Descripcion like '%" + data.filter.Tipo_de_Moneda1 + "%' ";
    if (data.filter.Proveedor2 != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor2 + "%' ";
    if (data.filter.Total_Proveedor2 != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Total_Proveedor2 = " + data.filter.Total_Proveedor2;
    if (data.filter.Total_Cotizacion_Proveedor2 != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor2 = " + data.filter.Total_Cotizacion_Proveedor2;
    if (data.filter.Tipo_de_Moneda2 != "")
      condition += " and Moneda.Descripcion like '%" + data.filter.Tipo_de_Moneda2 + "%' ";
    if (data.filter.Proveedor3 != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor3 + "%' ";
    if (data.filter.Total_Proveedor3 != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Total_Proveedor3 = " + data.filter.Total_Proveedor3;
    if (data.filter.Total_Cotizacion_Proveedor3 != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor3 = " + data.filter.Total_Cotizacion_Proveedor3;
    if (data.filter.Tipo_de_Moneda3 != "")
      condition += " and Moneda.Descripcion like '%" + data.filter.Tipo_de_Moneda3 + "%' ";
    if (data.filter.Proveedor4 != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor4 + "%' ";
    if (data.filter.Total_Proveedor4 != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Total_Proveedor4 = " + data.filter.Total_Proveedor4;
    if (data.filter.Total_Cotizacion_Proveedor4 != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor4 = " + data.filter.Total_Cotizacion_Proveedor4;
    if (data.filter.Tipo_de_Moneda4 != "")
      condition += " and Moneda.Descripcion like '%" + data.filter.Tipo_de_Moneda4 + "%' ";
    if (data.filter.Total_Cotizacion != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Total_Cotizacion = " + data.filter.Total_Cotizacion;
    if (data.filter.Tipo_de_Cambio != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Tipo_de_Cambio = " + data.filter.Tipo_de_Cambio;
    if (data.filter.Tipo_de_Moneda != "")
      condition += " and Moneda.Descripcion like '%" + data.filter.Tipo_de_Moneda + "%' ";
    if (data.filter.Observaciones != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.Estatus_de_Seguimiento != "")
      condition += " and Estatus_de_Seguimiento.Descripcion like '%" + data.filter.Estatus_de_Seguimiento + "%' ";
    if (data.filter.idComprasGenerales != "")
      condition += " and Comparativo_de_Proveedores_Piezas.idComprasGenerales = " + data.filter.idComprasGenerales;
    if (data.filter.idGestionAprobacionMantenimiento != "")
      condition += " and Comparativo_de_Proveedores_Piezas.idGestionAprobacionMantenimiento = " + data.filter.idGestionAprobacionMantenimiento;
    if (data.filter.FolioComparativoProv != "")
      condition += " and Comparativo_de_Proveedores_Piezas.FolioComparativoProv like '%" + data.filter.FolioComparativoProv + "%' ";
    if (data.filter.Fecha_de_Autorizacion)
      condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion, 102)  = '" + moment(data.filter.Fecha_de_Autorizacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Autorizacion != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion = '" + data.filter.Hora_de_Autorizacion + "'";
    if (data.filter.Autorizado_por != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Autorizado_por + "%' ";
    if (data.filter.Resultado != "")
      condition += " and Autorizacion.Resultado like '%" + data.filter.Resultado + "%' ";
    if (data.filter.Motivo_de_Rechazo != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo like '%" + data.filter.Motivo_de_Rechazo + "%' ";
    if (data.filter.Fecha_de_Autorizacion_DG)
      condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion_DG, 102)  = '" + moment(data.filter.Fecha_de_Autorizacion_DG).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Autorizacion_DG != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion_DG = '" + data.filter.Hora_de_Autorizacion_DG + "'";
    if (data.filter.Autorizado_por_DG != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Autorizado_por_DG + "%' ";
    if (data.filter.Resultado_DG != "")
      condition += " and Autorizacion.Resultado like '%" + data.filter.Resultado_DG + "%' ";
    if (data.filter.Motivo_de_Rechazo_DG != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_DG like '%" + data.filter.Motivo_de_Rechazo_DG + "%' ";
    if (data.filter.Fecha_de_Autorizacion_Adm)
      condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion_Adm, 102)  = '" + moment(data.filter.Fecha_de_Autorizacion_Adm).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Autorizacion_Adm != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion_Adm = '" + data.filter.Hora_de_Autorizacion_Adm + "'";
    if (data.filter.Autorizado_por_Adm != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Autorizado_por_Adm + "%' ";
    if (data.filter.Resultado_Adm != "")
      condition += " and Autorizacion.Resultado like '%" + data.filter.Resultado_Adm + "%' ";
    if (data.filter.Motivo_de_Rechazo_Adm != "")
      condition += " and Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_Adm like '%" + data.filter.Motivo_de_Rechazo_Adm + "%' ";

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
        sort = " Comparativo_de_Proveedores_Piezas.Folio " + data.sortDirecction;
        break;
      case "No__Solicitud":
        sort = " Comparativo_de_Proveedores_Piezas.No__Solicitud " + data.sortDirecction;
        break;
      case "Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Fecha_de_Solicitud":
        sort = " Comparativo_de_Proveedores_Piezas.Fecha_de_Solicitud " + data.sortDirecction;
        break;
      case "Razon_de_la_Compra":
        sort = " Comparativo_de_Proveedores_Piezas.Razon_de_la_Compra " + data.sortDirecction;
        break;
      case "Departamento":
        sort = " Departamento.Nombre " + data.sortDirecction;
        break;
      case "Numero_de_Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "Numero_de_O_T":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Comparativo_de_Proveedores_Piezas.Estatus " + data.sortDirecction;
        break;
      case "Proveedor1":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "Total_Proveedor1":
        sort = " Comparativo_de_Proveedores_Piezas.Total_Proveedor1 " + data.sortDirecction;
        break;
      case "Total_Cotizacion_Proveedor1":
        sort = " Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor1 " + data.sortDirecction;
        break;
      case "Tipo_de_Moneda1":
        sort = " Moneda.Descripcion " + data.sortDirecction;
        break;
      case "Proveedor2":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "Total_Proveedor2":
        sort = " Comparativo_de_Proveedores_Piezas.Total_Proveedor2 " + data.sortDirecction;
        break;
      case "Total_Cotizacion_Proveedor2":
        sort = " Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor2 " + data.sortDirecction;
        break;
      case "Tipo_de_Moneda2":
        sort = " Moneda.Descripcion " + data.sortDirecction;
        break;
      case "Proveedor3":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "Total_Proveedor3":
        sort = " Comparativo_de_Proveedores_Piezas.Total_Proveedor3 " + data.sortDirecction;
        break;
      case "Total_Cotizacion_Proveedor3":
        sort = " Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor3 " + data.sortDirecction;
        break;
      case "Tipo_de_Moneda3":
        sort = " Moneda.Descripcion " + data.sortDirecction;
        break;
      case "Proveedor4":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "Total_Proveedor4":
        sort = " Comparativo_de_Proveedores_Piezas.Total_Proveedor4 " + data.sortDirecction;
        break;
      case "Total_Cotizacion_Proveedor4":
        sort = " Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor4 " + data.sortDirecction;
        break;
      case "Tipo_de_Moneda4":
        sort = " Moneda.Descripcion " + data.sortDirecction;
        break;
      case "Total_Cotizacion":
        sort = " Comparativo_de_Proveedores_Piezas.Total_Cotizacion " + data.sortDirecction;
        break;
      case "Tipo_de_Cambio":
        sort = " Comparativo_de_Proveedores_Piezas.Tipo_de_Cambio " + data.sortDirecction;
        break;
      case "Tipo_de_Moneda":
        sort = " Moneda.Descripcion " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Comparativo_de_Proveedores_Piezas.Observaciones " + data.sortDirecction;
        break;
      case "Estatus_de_Seguimiento":
        sort = " Estatus_de_Seguimiento.Descripcion " + data.sortDirecction;
        break;
      case "idComprasGenerales":
        sort = " Comparativo_de_Proveedores_Piezas.idComprasGenerales " + data.sortDirecction;
        break;
      case "idGestionAprobacionMantenimiento":
        sort = " Comparativo_de_Proveedores_Piezas.idGestionAprobacionMantenimiento " + data.sortDirecction;
        break;
      case "FolioComparativoProv":
        sort = " Comparativo_de_Proveedores_Piezas.FolioComparativoProv " + data.sortDirecction;
        break;
      case "Fecha_de_Autorizacion":
        sort = " Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion " + data.sortDirecction;
        break;
      case "Hora_de_Autorizacion":
        sort = " Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion " + data.sortDirecction;
        break;
      case "Autorizado_por":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Resultado":
        sort = " Autorizacion.Resultado " + data.sortDirecction;
        break;
      case "Motivo_de_Rechazo":
        sort = " Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo " + data.sortDirecction;
        break;
      case "Fecha_de_Autorizacion_DG":
        sort = " Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion_DG " + data.sortDirecction;
        break;
      case "Hora_de_Autorizacion_DG":
        sort = " Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion_DG " + data.sortDirecction;
        break;
      case "Autorizado_por_DG":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Resultado_DG":
        sort = " Autorizacion.Resultado " + data.sortDirecction;
        break;
      case "Motivo_de_Rechazo_DG":
        sort = " Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_DG " + data.sortDirecction;
        break;
      case "Fecha_de_Autorizacion_Adm":
        sort = " Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion_Adm " + data.sortDirecction;
        break;
      case "Hora_de_Autorizacion_Adm":
        sort = " Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion_Adm " + data.sortDirecction;
        break;
      case "Autorizado_por_Adm":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Resultado_Adm":
        sort = " Autorizacion.Resultado " + data.sortDirecction;
        break;
      case "Motivo_de_Rechazo_Adm":
        sort = " Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_Adm " + data.sortDirecction;
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
        condition += " AND Comparativo_de_Proveedores_Piezas.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Comparativo_de_Proveedores_Piezas.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromNo__Solicitud != 'undefined' && data.filterAdvanced.fromNo__Solicitud)
      || (typeof data.filterAdvanced.toNo__Solicitud != 'undefined' && data.filterAdvanced.toNo__Solicitud)) {
      if (typeof data.filterAdvanced.fromNo__Solicitud != 'undefined' && data.filterAdvanced.fromNo__Solicitud)
        condition += " AND Comparativo_de_Proveedores_Piezas.No__Solicitud >= " + data.filterAdvanced.fromNo__Solicitud;

      if (typeof data.filterAdvanced.toNo__Solicitud != 'undefined' && data.filterAdvanced.toNo__Solicitud)
        condition += " AND Comparativo_de_Proveedores_Piezas.No__Solicitud <= " + data.filterAdvanced.toNo__Solicitud;
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
      condition += " AND Comparativo_de_Proveedores_Piezas.Solicitante In (" + Solicitanteds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_Solicitud)
      || (typeof data.filterAdvanced.toFecha_de_Solicitud != 'undefined' && data.filterAdvanced.toFecha_de_Solicitud)) {
      if (typeof data.filterAdvanced.fromFecha_de_Solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_Solicitud)
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Solicitud, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Solicitud).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Solicitud != 'undefined' && data.filterAdvanced.toFecha_de_Solicitud)
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Solicitud, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Solicitud).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Razon_de_la_CompraFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Razon_de_la_Compra LIKE '" + data.filterAdvanced.Razon_de_la_Compra + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Piezas.Razon_de_la_Compra LIKE '%" + data.filterAdvanced.Razon_de_la_Compra + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Razon_de_la_Compra LIKE '%" + data.filterAdvanced.Razon_de_la_Compra + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Piezas.Razon_de_la_Compra = '" + data.filterAdvanced.Razon_de_la_Compra + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Departamento != 'undefined' && data.filterAdvanced.Departamento)) {
      switch (data.filterAdvanced.DepartamentoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Departamento.Nombre LIKE '" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Departamento.Nombre = '" + data.filterAdvanced.Departamento + "'";
          break;
      }
    } else if (data.filterAdvanced.DepartamentoMultiple != null && data.filterAdvanced.DepartamentoMultiple.length > 0) {
      var Departamentods = data.filterAdvanced.DepartamentoMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Departamento In (" + Departamentods + ")";
    }
    if ((typeof data.filterAdvanced.Numero_de_Reporte != 'undefined' && data.filterAdvanced.Numero_de_Reporte)) {
      switch (data.filterAdvanced.Numero_de_ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.Numero_de_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.Numero_de_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.Numero_de_Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.Numero_de_Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_ReporteMultiple != null && data.filterAdvanced.Numero_de_ReporteMultiple.length > 0) {
      var Numero_de_Reporteds = data.filterAdvanced.Numero_de_ReporteMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Numero_de_Reporte In (" + Numero_de_Reporteds + ")";
    }
    if ((typeof data.filterAdvanced.Numero_de_O_T != 'undefined' && data.filterAdvanced.Numero_de_O_T)) {
      switch (data.filterAdvanced.Numero_de_O_TFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.Numero_de_O_T + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Numero_de_O_T + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Numero_de_O_T + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.Numero_de_O_T + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_O_TMultiple != null && data.filterAdvanced.Numero_de_O_TMultiple.length > 0) {
      var Numero_de_O_Tds = data.filterAdvanced.Numero_de_O_TMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Numero_de_O_T In (" + Numero_de_O_Tds + ")";
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
      condition += " AND Comparativo_de_Proveedores_Piezas.Matricula In (" + Matriculads + ")";
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
      condition += " AND Comparativo_de_Proveedores_Piezas.Modelo In (" + Modelods + ")";
    }
    switch (data.filterAdvanced.EstatusFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Estatus LIKE '" + data.filterAdvanced.Estatus + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Piezas.Estatus LIKE '%" + data.filterAdvanced.Estatus + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Estatus LIKE '%" + data.filterAdvanced.Estatus + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Piezas.Estatus = '" + data.filterAdvanced.Estatus + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Proveedor1 != 'undefined' && data.filterAdvanced.Proveedor1)) {
      switch (data.filterAdvanced.Proveedor1Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.Proveedor1 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor1 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor1 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.Proveedor1 + "'";
          break;
      }
    } else if (data.filterAdvanced.Proveedor1Multiple != null && data.filterAdvanced.Proveedor1Multiple.length > 0) {
      var Proveedor1ds = data.filterAdvanced.Proveedor1Multiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Proveedor1 In (" + Proveedor1ds + ")";
    }
    if ((typeof data.filterAdvanced.fromTotal_Proveedor1 != 'undefined' && data.filterAdvanced.fromTotal_Proveedor1)
      || (typeof data.filterAdvanced.toTotal_Proveedor1 != 'undefined' && data.filterAdvanced.toTotal_Proveedor1)) {
      if (typeof data.filterAdvanced.fromTotal_Proveedor1 != 'undefined' && data.filterAdvanced.fromTotal_Proveedor1)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Proveedor1 >= " + data.filterAdvanced.fromTotal_Proveedor1;

      if (typeof data.filterAdvanced.toTotal_Proveedor1 != 'undefined' && data.filterAdvanced.toTotal_Proveedor1)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Proveedor1 <= " + data.filterAdvanced.toTotal_Proveedor1;
    }
    if ((typeof data.filterAdvanced.fromTotal_Cotizacion_Proveedor1 != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion_Proveedor1)
      || (typeof data.filterAdvanced.toTotal_Cotizacion_Proveedor1 != 'undefined' && data.filterAdvanced.toTotal_Cotizacion_Proveedor1)) {
      if (typeof data.filterAdvanced.fromTotal_Cotizacion_Proveedor1 != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion_Proveedor1)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor1 >= " + data.filterAdvanced.fromTotal_Cotizacion_Proveedor1;

      if (typeof data.filterAdvanced.toTotal_Cotizacion_Proveedor1 != 'undefined' && data.filterAdvanced.toTotal_Cotizacion_Proveedor1)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor1 <= " + data.filterAdvanced.toTotal_Cotizacion_Proveedor1;
    }
    if ((typeof data.filterAdvanced.Tipo_de_Moneda1 != 'undefined' && data.filterAdvanced.Tipo_de_Moneda1)) {
      switch (data.filterAdvanced.Tipo_de_Moneda1Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Moneda.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Moneda1 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda1 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda1 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Moneda.Descripcion = '" + data.filterAdvanced.Tipo_de_Moneda1 + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_Moneda1Multiple != null && data.filterAdvanced.Tipo_de_Moneda1Multiple.length > 0) {
      var Tipo_de_Moneda1ds = data.filterAdvanced.Tipo_de_Moneda1Multiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Tipo_de_Moneda1 In (" + Tipo_de_Moneda1ds + ")";
    }
    if ((typeof data.filterAdvanced.Proveedor2 != 'undefined' && data.filterAdvanced.Proveedor2)) {
      switch (data.filterAdvanced.Proveedor2Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.Proveedor2 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor2 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor2 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.Proveedor2 + "'";
          break;
      }
    } else if (data.filterAdvanced.Proveedor2Multiple != null && data.filterAdvanced.Proveedor2Multiple.length > 0) {
      var Proveedor2ds = data.filterAdvanced.Proveedor2Multiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Proveedor2 In (" + Proveedor2ds + ")";
    }
    if ((typeof data.filterAdvanced.fromTotal_Proveedor2 != 'undefined' && data.filterAdvanced.fromTotal_Proveedor2)
      || (typeof data.filterAdvanced.toTotal_Proveedor2 != 'undefined' && data.filterAdvanced.toTotal_Proveedor2)) {
      if (typeof data.filterAdvanced.fromTotal_Proveedor2 != 'undefined' && data.filterAdvanced.fromTotal_Proveedor2)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Proveedor2 >= " + data.filterAdvanced.fromTotal_Proveedor2;

      if (typeof data.filterAdvanced.toTotal_Proveedor2 != 'undefined' && data.filterAdvanced.toTotal_Proveedor2)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Proveedor2 <= " + data.filterAdvanced.toTotal_Proveedor2;
    }
    if ((typeof data.filterAdvanced.fromTotal_Cotizacion_Proveedor2 != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion_Proveedor2)
      || (typeof data.filterAdvanced.toTotal_Cotizacion_Proveedor2 != 'undefined' && data.filterAdvanced.toTotal_Cotizacion_Proveedor2)) {
      if (typeof data.filterAdvanced.fromTotal_Cotizacion_Proveedor2 != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion_Proveedor2)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor2 >= " + data.filterAdvanced.fromTotal_Cotizacion_Proveedor2;

      if (typeof data.filterAdvanced.toTotal_Cotizacion_Proveedor2 != 'undefined' && data.filterAdvanced.toTotal_Cotizacion_Proveedor2)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor2 <= " + data.filterAdvanced.toTotal_Cotizacion_Proveedor2;
    }
    if ((typeof data.filterAdvanced.Tipo_de_Moneda2 != 'undefined' && data.filterAdvanced.Tipo_de_Moneda2)) {
      switch (data.filterAdvanced.Tipo_de_Moneda2Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Moneda.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Moneda2 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda2 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda2 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Moneda.Descripcion = '" + data.filterAdvanced.Tipo_de_Moneda2 + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_Moneda2Multiple != null && data.filterAdvanced.Tipo_de_Moneda2Multiple.length > 0) {
      var Tipo_de_Moneda2ds = data.filterAdvanced.Tipo_de_Moneda2Multiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Tipo_de_Moneda2 In (" + Tipo_de_Moneda2ds + ")";
    }
    if ((typeof data.filterAdvanced.Proveedor3 != 'undefined' && data.filterAdvanced.Proveedor3)) {
      switch (data.filterAdvanced.Proveedor3Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.Proveedor3 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor3 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor3 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.Proveedor3 + "'";
          break;
      }
    } else if (data.filterAdvanced.Proveedor3Multiple != null && data.filterAdvanced.Proveedor3Multiple.length > 0) {
      var Proveedor3ds = data.filterAdvanced.Proveedor3Multiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Proveedor3 In (" + Proveedor3ds + ")";
    }
    if ((typeof data.filterAdvanced.fromTotal_Proveedor3 != 'undefined' && data.filterAdvanced.fromTotal_Proveedor3)
      || (typeof data.filterAdvanced.toTotal_Proveedor3 != 'undefined' && data.filterAdvanced.toTotal_Proveedor3)) {
      if (typeof data.filterAdvanced.fromTotal_Proveedor3 != 'undefined' && data.filterAdvanced.fromTotal_Proveedor3)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Proveedor3 >= " + data.filterAdvanced.fromTotal_Proveedor3;

      if (typeof data.filterAdvanced.toTotal_Proveedor3 != 'undefined' && data.filterAdvanced.toTotal_Proveedor3)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Proveedor3 <= " + data.filterAdvanced.toTotal_Proveedor3;
    }
    if ((typeof data.filterAdvanced.fromTotal_Cotizacion_Proveedor3 != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion_Proveedor3)
      || (typeof data.filterAdvanced.toTotal_Cotizacion_Proveedor3 != 'undefined' && data.filterAdvanced.toTotal_Cotizacion_Proveedor3)) {
      if (typeof data.filterAdvanced.fromTotal_Cotizacion_Proveedor3 != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion_Proveedor3)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor3 >= " + data.filterAdvanced.fromTotal_Cotizacion_Proveedor3;

      if (typeof data.filterAdvanced.toTotal_Cotizacion_Proveedor3 != 'undefined' && data.filterAdvanced.toTotal_Cotizacion_Proveedor3)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor3 <= " + data.filterAdvanced.toTotal_Cotizacion_Proveedor3;
    }
    if ((typeof data.filterAdvanced.Tipo_de_Moneda3 != 'undefined' && data.filterAdvanced.Tipo_de_Moneda3)) {
      switch (data.filterAdvanced.Tipo_de_Moneda3Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Moneda.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Moneda3 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda3 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda3 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Moneda.Descripcion = '" + data.filterAdvanced.Tipo_de_Moneda3 + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_Moneda3Multiple != null && data.filterAdvanced.Tipo_de_Moneda3Multiple.length > 0) {
      var Tipo_de_Moneda3ds = data.filterAdvanced.Tipo_de_Moneda3Multiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Tipo_de_Moneda3 In (" + Tipo_de_Moneda3ds + ")";
    }
    if ((typeof data.filterAdvanced.Proveedor4 != 'undefined' && data.filterAdvanced.Proveedor4)) {
      switch (data.filterAdvanced.Proveedor4Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.Proveedor4 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor4 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor4 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.Proveedor4 + "'";
          break;
      }
    } else if (data.filterAdvanced.Proveedor4Multiple != null && data.filterAdvanced.Proveedor4Multiple.length > 0) {
      var Proveedor4ds = data.filterAdvanced.Proveedor4Multiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Proveedor4 In (" + Proveedor4ds + ")";
    }
    if ((typeof data.filterAdvanced.fromTotal_Proveedor4 != 'undefined' && data.filterAdvanced.fromTotal_Proveedor4)
      || (typeof data.filterAdvanced.toTotal_Proveedor4 != 'undefined' && data.filterAdvanced.toTotal_Proveedor4)) {
      if (typeof data.filterAdvanced.fromTotal_Proveedor4 != 'undefined' && data.filterAdvanced.fromTotal_Proveedor4)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Proveedor4 >= " + data.filterAdvanced.fromTotal_Proveedor4;

      if (typeof data.filterAdvanced.toTotal_Proveedor4 != 'undefined' && data.filterAdvanced.toTotal_Proveedor4)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Proveedor4 <= " + data.filterAdvanced.toTotal_Proveedor4;
    }
    if ((typeof data.filterAdvanced.fromTotal_Cotizacion_Proveedor4 != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion_Proveedor4)
      || (typeof data.filterAdvanced.toTotal_Cotizacion_Proveedor4 != 'undefined' && data.filterAdvanced.toTotal_Cotizacion_Proveedor4)) {
      if (typeof data.filterAdvanced.fromTotal_Cotizacion_Proveedor4 != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion_Proveedor4)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor4 >= " + data.filterAdvanced.fromTotal_Cotizacion_Proveedor4;

      if (typeof data.filterAdvanced.toTotal_Cotizacion_Proveedor4 != 'undefined' && data.filterAdvanced.toTotal_Cotizacion_Proveedor4)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion_Proveedor4 <= " + data.filterAdvanced.toTotal_Cotizacion_Proveedor4;
    }
    if ((typeof data.filterAdvanced.Tipo_de_Moneda4 != 'undefined' && data.filterAdvanced.Tipo_de_Moneda4)) {
      switch (data.filterAdvanced.Tipo_de_Moneda4Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Moneda.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Moneda4 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda4 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda4 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Moneda.Descripcion = '" + data.filterAdvanced.Tipo_de_Moneda4 + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_Moneda4Multiple != null && data.filterAdvanced.Tipo_de_Moneda4Multiple.length > 0) {
      var Tipo_de_Moneda4ds = data.filterAdvanced.Tipo_de_Moneda4Multiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Tipo_de_Moneda4 In (" + Tipo_de_Moneda4ds + ")";
    }
    if ((typeof data.filterAdvanced.fromTotal_Cotizacion != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion)
      || (typeof data.filterAdvanced.toTotal_Cotizacion != 'undefined' && data.filterAdvanced.toTotal_Cotizacion)) {
      if (typeof data.filterAdvanced.fromTotal_Cotizacion != 'undefined' && data.filterAdvanced.fromTotal_Cotizacion)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion >= " + data.filterAdvanced.fromTotal_Cotizacion;

      if (typeof data.filterAdvanced.toTotal_Cotizacion != 'undefined' && data.filterAdvanced.toTotal_Cotizacion)
        condition += " AND Comparativo_de_Proveedores_Piezas.Total_Cotizacion <= " + data.filterAdvanced.toTotal_Cotizacion;
    }
    if ((typeof data.filterAdvanced.fromTipo_de_Cambio != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio)
      || (typeof data.filterAdvanced.toTipo_de_Cambio != 'undefined' && data.filterAdvanced.toTipo_de_Cambio)) {
      if (typeof data.filterAdvanced.fromTipo_de_Cambio != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio)
        condition += " AND Comparativo_de_Proveedores_Piezas.Tipo_de_Cambio >= " + data.filterAdvanced.fromTipo_de_Cambio;

      if (typeof data.filterAdvanced.toTipo_de_Cambio != 'undefined' && data.filterAdvanced.toTipo_de_Cambio)
        condition += " AND Comparativo_de_Proveedores_Piezas.Tipo_de_Cambio <= " + data.filterAdvanced.toTipo_de_Cambio;
    }
    if ((typeof data.filterAdvanced.Tipo_de_Moneda != 'undefined' && data.filterAdvanced.Tipo_de_Moneda)) {
      switch (data.filterAdvanced.Tipo_de_MonedaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Moneda.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Moneda + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Moneda + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Moneda.Descripcion = '" + data.filterAdvanced.Tipo_de_Moneda + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_MonedaMultiple != null && data.filterAdvanced.Tipo_de_MonedaMultiple.length > 0) {
      var Tipo_de_Monedads = data.filterAdvanced.Tipo_de_MonedaMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Tipo_de_Moneda In (" + Tipo_de_Monedads + ")";
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Piezas.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Piezas.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus_de_Seguimiento != 'undefined' && data.filterAdvanced.Estatus_de_Seguimiento)) {
      switch (data.filterAdvanced.Estatus_de_SeguimientoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Seguimiento.Descripcion LIKE '" + data.filterAdvanced.Estatus_de_Seguimiento + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Seguimiento.Descripcion LIKE '%" + data.filterAdvanced.Estatus_de_Seguimiento + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Seguimiento.Descripcion LIKE '%" + data.filterAdvanced.Estatus_de_Seguimiento + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Seguimiento.Descripcion = '" + data.filterAdvanced.Estatus_de_Seguimiento + "'";
          break;
      }
    } else if (data.filterAdvanced.Estatus_de_SeguimientoMultiple != null && data.filterAdvanced.Estatus_de_SeguimientoMultiple.length > 0) {
      var Estatus_de_Seguimientods = data.filterAdvanced.Estatus_de_SeguimientoMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Estatus_de_Seguimiento In (" + Estatus_de_Seguimientods + ")";
    }
    if ((typeof data.filterAdvanced.fromidComprasGenerales != 'undefined' && data.filterAdvanced.fromidComprasGenerales)
      || (typeof data.filterAdvanced.toidComprasGenerales != 'undefined' && data.filterAdvanced.toidComprasGenerales)) {
      if (typeof data.filterAdvanced.fromidComprasGenerales != 'undefined' && data.filterAdvanced.fromidComprasGenerales)
        condition += " AND Comparativo_de_Proveedores_Piezas.idComprasGenerales >= " + data.filterAdvanced.fromidComprasGenerales;

      if (typeof data.filterAdvanced.toidComprasGenerales != 'undefined' && data.filterAdvanced.toidComprasGenerales)
        condition += " AND Comparativo_de_Proveedores_Piezas.idComprasGenerales <= " + data.filterAdvanced.toidComprasGenerales;
    }
    if ((typeof data.filterAdvanced.fromidGestionAprobacionMantenimiento != 'undefined' && data.filterAdvanced.fromidGestionAprobacionMantenimiento)
      || (typeof data.filterAdvanced.toidGestionAprobacionMantenimiento != 'undefined' && data.filterAdvanced.toidGestionAprobacionMantenimiento)) {
      if (typeof data.filterAdvanced.fromidGestionAprobacionMantenimiento != 'undefined' && data.filterAdvanced.fromidGestionAprobacionMantenimiento)
        condition += " AND Comparativo_de_Proveedores_Piezas.idGestionAprobacionMantenimiento >= " + data.filterAdvanced.fromidGestionAprobacionMantenimiento;

      if (typeof data.filterAdvanced.toidGestionAprobacionMantenimiento != 'undefined' && data.filterAdvanced.toidGestionAprobacionMantenimiento)
        condition += " AND Comparativo_de_Proveedores_Piezas.idGestionAprobacionMantenimiento <= " + data.filterAdvanced.toidGestionAprobacionMantenimiento;
    }
    switch (data.filterAdvanced.FolioComparativoProvFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.FolioComparativoProv LIKE '" + data.filterAdvanced.FolioComparativoProv + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Piezas.FolioComparativoProv LIKE '%" + data.filterAdvanced.FolioComparativoProv + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.FolioComparativoProv LIKE '%" + data.filterAdvanced.FolioComparativoProv + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Piezas.FolioComparativoProv = '" + data.filterAdvanced.FolioComparativoProv + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Autorizacion != 'undefined' && data.filterAdvanced.fromFecha_de_Autorizacion)
      || (typeof data.filterAdvanced.toFecha_de_Autorizacion != 'undefined' && data.filterAdvanced.toFecha_de_Autorizacion)) {
      if (typeof data.filterAdvanced.fromFecha_de_Autorizacion != 'undefined' && data.filterAdvanced.fromFecha_de_Autorizacion)
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Autorizacion).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Autorizacion != 'undefined' && data.filterAdvanced.toFecha_de_Autorizacion)
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Autorizacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Autorizacion != 'undefined' && data.filterAdvanced.fromHora_de_Autorizacion)
      || (typeof data.filterAdvanced.toHora_de_Autorizacion != 'undefined' && data.filterAdvanced.toHora_de_Autorizacion)) {
      if (typeof data.filterAdvanced.fromHora_de_Autorizacion != 'undefined' && data.filterAdvanced.fromHora_de_Autorizacion)
        condition += " and Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion >= '" + data.filterAdvanced.fromHora_de_Autorizacion + "'";

      if (typeof data.filterAdvanced.toHora_de_Autorizacion != 'undefined' && data.filterAdvanced.toHora_de_Autorizacion)
        condition += " and Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion <= '" + data.filterAdvanced.toHora_de_Autorizacion + "'";
    }
    if ((typeof data.filterAdvanced.Autorizado_por != 'undefined' && data.filterAdvanced.Autorizado_por)) {
      switch (data.filterAdvanced.Autorizado_porFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Autorizado_por + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Autorizado_por + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Autorizado_por + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Autorizado_por + "'";
          break;
      }
    } else if (data.filterAdvanced.Autorizado_porMultiple != null && data.filterAdvanced.Autorizado_porMultiple.length > 0) {
      var Autorizado_pords = data.filterAdvanced.Autorizado_porMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Autorizado_por In (" + Autorizado_pords + ")";
    }
    if ((typeof data.filterAdvanced.Resultado != 'undefined' && data.filterAdvanced.Resultado)) {
      switch (data.filterAdvanced.ResultadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Autorizacion.Resultado LIKE '" + data.filterAdvanced.Resultado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Autorizacion.Resultado LIKE '%" + data.filterAdvanced.Resultado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Autorizacion.Resultado LIKE '%" + data.filterAdvanced.Resultado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Autorizacion.Resultado = '" + data.filterAdvanced.Resultado + "'";
          break;
      }
    } else if (data.filterAdvanced.ResultadoMultiple != null && data.filterAdvanced.ResultadoMultiple.length > 0) {
      var Resultadods = data.filterAdvanced.ResultadoMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Resultado In (" + Resultadods + ")";
    }
    switch (data.filterAdvanced.Motivo_de_RechazoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo LIKE '" + data.filterAdvanced.Motivo_de_Rechazo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo LIKE '%" + data.filterAdvanced.Motivo_de_Rechazo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo LIKE '%" + data.filterAdvanced.Motivo_de_Rechazo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo = '" + data.filterAdvanced.Motivo_de_Rechazo + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Autorizacion_DG != 'undefined' && data.filterAdvanced.fromFecha_de_Autorizacion_DG)
      || (typeof data.filterAdvanced.toFecha_de_Autorizacion_DG != 'undefined' && data.filterAdvanced.toFecha_de_Autorizacion_DG)) {
      if (typeof data.filterAdvanced.fromFecha_de_Autorizacion_DG != 'undefined' && data.filterAdvanced.fromFecha_de_Autorizacion_DG)
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion_DG, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Autorizacion_DG).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Autorizacion_DG != 'undefined' && data.filterAdvanced.toFecha_de_Autorizacion_DG)
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion_DG, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Autorizacion_DG).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Autorizacion_DG != 'undefined' && data.filterAdvanced.fromHora_de_Autorizacion_DG)
      || (typeof data.filterAdvanced.toHora_de_Autorizacion_DG != 'undefined' && data.filterAdvanced.toHora_de_Autorizacion_DG)) {
      if (typeof data.filterAdvanced.fromHora_de_Autorizacion_DG != 'undefined' && data.filterAdvanced.fromHora_de_Autorizacion_DG)
        condition += " and Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion_DG >= '" + data.filterAdvanced.fromHora_de_Autorizacion_DG + "'";

      if (typeof data.filterAdvanced.toHora_de_Autorizacion_DG != 'undefined' && data.filterAdvanced.toHora_de_Autorizacion_DG)
        condition += " and Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion_DG <= '" + data.filterAdvanced.toHora_de_Autorizacion_DG + "'";
    }
    if ((typeof data.filterAdvanced.Autorizado_por_DG != 'undefined' && data.filterAdvanced.Autorizado_por_DG)) {
      switch (data.filterAdvanced.Autorizado_por_DGFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Autorizado_por_DG + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Autorizado_por_DG + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Autorizado_por_DG + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Autorizado_por_DG + "'";
          break;
      }
    } else if (data.filterAdvanced.Autorizado_por_DGMultiple != null && data.filterAdvanced.Autorizado_por_DGMultiple.length > 0) {
      var Autorizado_por_DGds = data.filterAdvanced.Autorizado_por_DGMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Autorizado_por_DG In (" + Autorizado_por_DGds + ")";
    }
    if ((typeof data.filterAdvanced.Resultado_DG != 'undefined' && data.filterAdvanced.Resultado_DG)) {
      switch (data.filterAdvanced.Resultado_DGFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Autorizacion.Resultado LIKE '" + data.filterAdvanced.Resultado_DG + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Autorizacion.Resultado LIKE '%" + data.filterAdvanced.Resultado_DG + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Autorizacion.Resultado LIKE '%" + data.filterAdvanced.Resultado_DG + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Autorizacion.Resultado = '" + data.filterAdvanced.Resultado_DG + "'";
          break;
      }
    } else if (data.filterAdvanced.Resultado_DGMultiple != null && data.filterAdvanced.Resultado_DGMultiple.length > 0) {
      var Resultado_DGds = data.filterAdvanced.Resultado_DGMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Resultado_DG In (" + Resultado_DGds + ")";
    }
    switch (data.filterAdvanced.Motivo_de_Rechazo_DGFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_DG LIKE '" + data.filterAdvanced.Motivo_de_Rechazo_DG + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_DG LIKE '%" + data.filterAdvanced.Motivo_de_Rechazo_DG + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_DG LIKE '%" + data.filterAdvanced.Motivo_de_Rechazo_DG + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_DG = '" + data.filterAdvanced.Motivo_de_Rechazo_DG + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Autorizacion_Adm != 'undefined' && data.filterAdvanced.fromFecha_de_Autorizacion_Adm)
      || (typeof data.filterAdvanced.toFecha_de_Autorizacion_Adm != 'undefined' && data.filterAdvanced.toFecha_de_Autorizacion_Adm)) {
      if (typeof data.filterAdvanced.fromFecha_de_Autorizacion_Adm != 'undefined' && data.filterAdvanced.fromFecha_de_Autorizacion_Adm)
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion_Adm, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Autorizacion_Adm).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Autorizacion_Adm != 'undefined' && data.filterAdvanced.toFecha_de_Autorizacion_Adm)
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Piezas.Fecha_de_Autorizacion_Adm, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Autorizacion_Adm).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Autorizacion_Adm != 'undefined' && data.filterAdvanced.fromHora_de_Autorizacion_Adm)
      || (typeof data.filterAdvanced.toHora_de_Autorizacion_Adm != 'undefined' && data.filterAdvanced.toHora_de_Autorizacion_Adm)) {
      if (typeof data.filterAdvanced.fromHora_de_Autorizacion_Adm != 'undefined' && data.filterAdvanced.fromHora_de_Autorizacion_Adm)
        condition += " and Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion_Adm >= '" + data.filterAdvanced.fromHora_de_Autorizacion_Adm + "'";

      if (typeof data.filterAdvanced.toHora_de_Autorizacion_Adm != 'undefined' && data.filterAdvanced.toHora_de_Autorizacion_Adm)
        condition += " and Comparativo_de_Proveedores_Piezas.Hora_de_Autorizacion_Adm <= '" + data.filterAdvanced.toHora_de_Autorizacion_Adm + "'";
    }
    if ((typeof data.filterAdvanced.Autorizado_por_Adm != 'undefined' && data.filterAdvanced.Autorizado_por_Adm)) {
      switch (data.filterAdvanced.Autorizado_por_AdmFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Autorizado_por_Adm + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Autorizado_por_Adm + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Autorizado_por_Adm + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Autorizado_por_Adm + "'";
          break;
      }
    } else if (data.filterAdvanced.Autorizado_por_AdmMultiple != null && data.filterAdvanced.Autorizado_por_AdmMultiple.length > 0) {
      var Autorizado_por_Admds = data.filterAdvanced.Autorizado_por_AdmMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Autorizado_por_Adm In (" + Autorizado_por_Admds + ")";
    }
    if ((typeof data.filterAdvanced.Resultado_Adm != 'undefined' && data.filterAdvanced.Resultado_Adm)) {
      switch (data.filterAdvanced.Resultado_AdmFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Autorizacion.Resultado LIKE '" + data.filterAdvanced.Resultado_Adm + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Autorizacion.Resultado LIKE '%" + data.filterAdvanced.Resultado_Adm + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Autorizacion.Resultado LIKE '%" + data.filterAdvanced.Resultado_Adm + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Autorizacion.Resultado = '" + data.filterAdvanced.Resultado_Adm + "'";
          break;
      }
    } else if (data.filterAdvanced.Resultado_AdmMultiple != null && data.filterAdvanced.Resultado_AdmMultiple.length > 0) {
      var Resultado_Admds = data.filterAdvanced.Resultado_AdmMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Piezas.Resultado_Adm In (" + Resultado_Admds + ")";
    }
    switch (data.filterAdvanced.Motivo_de_Rechazo_AdmFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_Adm LIKE '" + data.filterAdvanced.Motivo_de_Rechazo_Adm + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_Adm LIKE '%" + data.filterAdvanced.Motivo_de_Rechazo_Adm + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_Adm LIKE '%" + data.filterAdvanced.Motivo_de_Rechazo_Adm + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Piezas.Motivo_de_Rechazo_Adm = '" + data.filterAdvanced.Motivo_de_Rechazo_Adm + "'";
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
              const longest = result.Comparativo_de_Proveedores_Piezass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Comparativo_de_Proveedores_Piezass);
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
