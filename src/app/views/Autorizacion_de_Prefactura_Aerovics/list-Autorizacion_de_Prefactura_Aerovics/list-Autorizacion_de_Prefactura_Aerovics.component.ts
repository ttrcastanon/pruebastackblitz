import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ActivatedRoute } from '@angular/router'
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Autorizacion_de_Prefactura_AerovicsService } from "src/app/api-services/Autorizacion_de_Prefactura_Aerovics.service";
import { Autorizacion_de_Prefactura_Aerovics } from "src/app/models/Autorizacion_de_Prefactura_Aerovics";
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
import { Autorizacion_de_Prefactura_AerovicsIndexRules } from 'src/app/shared/businessRules/Autorizacion_de_Prefactura_Aerovics-index-rules';
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
  selector: "app-list-Autorizacion_de_Prefactura_Aerovics",
  templateUrl: "./list-Autorizacion_de_Prefactura_Aerovics.component.html",
  styleUrls: ["./list-Autorizacion_de_Prefactura_Aerovics.component.scss"],
})
export class ListAutorizacion_de_Prefactura_AerovicsComponent extends Autorizacion_de_Prefactura_AerovicsIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  phase: any = 0;
  displayedColumns = [
    "acciones",
    "Folio",
    "No_prefactura",
    "Vuelo",
    "Pax_Solicitante",
    "Empresa_Solicitante",
    "Fecha_de_Salida",
    "Fecha_de_Regreso",
    "Monto_de_Factura",
    "Estatus",
    "Motivo_de_rechazo_general",
    "Observaciones",
    "Fecha_de_autorizacion_adm",
    "Hora_de_autorizacion_adm",
    "Usuario_que_autoriza_adm",
    "Resultado_de_autorizacion_adm",
    "Motivo_de_rechazo_adm",
    "Observaciones_adm",
    "Fecha_de_autorizacion_dg",
    "Hora_de_autorizacion_dg",
    "Usuario_que_autoriza_dg",
    "Resultado_de_autorizacion_dg",
    "Motivo_de_rechazo_dg",
    "Observaciones_dg",
    "Fecha_de_autorizacion_dc",
    "Hora_de_autorizacion_dc",
    "Usuario_que_autoriza_dc",
    "Resultado_de_autorizacion_dc",
    "Motivo_de_rechazo_dc",
    "Observaciones_dc",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No_prefactura",
      "Vuelo",
      "Pax_Solicitante",
      "Empresa_Solicitante",
      "Fecha_de_Salida",
      "Fecha_de_Regreso",
      "Monto_de_Factura",
      "Estatus",
      "Motivo_de_rechazo_general",
      "Observaciones",
      "Fecha_de_autorizacion_adm",
      "Hora_de_autorizacion_adm",
      "Usuario_que_autoriza_adm",
      "Resultado_de_autorizacion_adm",
      "Motivo_de_rechazo_adm",
      "Observaciones_adm",
      "Fecha_de_autorizacion_dg",
      "Hora_de_autorizacion_dg",
      "Usuario_que_autoriza_dg",
      "Resultado_de_autorizacion_dg",
      "Motivo_de_rechazo_dg",
      "Observaciones_dg",
      "Fecha_de_autorizacion_dc",
      "Hora_de_autorizacion_dc",
      "Usuario_que_autoriza_dc",
      "Resultado_de_autorizacion_dc",
      "Motivo_de_rechazo_dc",
      "Observaciones_dc",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No_prefactura_filtro",
      "Vuelo_filtro",
      "Pax_Solicitante_filtro",
      "Empresa_Solicitante_filtro",
      "Fecha_de_Salida_filtro",
      "Fecha_de_Regreso_filtro",
      "Monto_de_Factura_filtro",
      "Estatus_filtro",
      "Motivo_de_rechazo_general_filtro",
      "Observaciones_filtro",
      "Fecha_de_autorizacion_adm_filtro",
      "Hora_de_autorizacion_adm_filtro",
      "Usuario_que_autoriza_adm_filtro",
      "Resultado_de_autorizacion_adm_filtro",
      "Motivo_de_rechazo_adm_filtro",
      "Observaciones_adm_filtro",
      "Fecha_de_autorizacion_dg_filtro",
      "Hora_de_autorizacion_dg_filtro",
      "Usuario_que_autoriza_dg_filtro",
      "Resultado_de_autorizacion_dg_filtro",
      "Motivo_de_rechazo_dg_filtro",
      "Observaciones_dg_filtro",
      "Fecha_de_autorizacion_dc_filtro",
      "Hora_de_autorizacion_dc_filtro",
      "Usuario_que_autoriza_dc_filtro",
      "Resultado_de_autorizacion_dc_filtro",
      "Motivo_de_rechazo_dc_filtro",
      "Observaciones_dc_filtro",

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
      No_prefactura: "",
      Vuelo: "",
      Pax_Solicitante: "",
      Empresa_Solicitante: "",
      Fecha_de_Salida: null,
      Fecha_de_Regreso: null,
      Monto_de_Factura: "",
      Estatus: "",
      Motivo_de_rechazo_general: "",
      Observaciones: "",
      Fecha_de_autorizacion_adm: null,
      Hora_de_autorizacion_adm: "",
      Usuario_que_autoriza_adm: "",
      Resultado_de_autorizacion_adm: "",
      Motivo_de_rechazo_adm: "",
      Observaciones_adm: "",
      Fecha_de_autorizacion_dg: null,
      Hora_de_autorizacion_dg: "",
      Usuario_que_autoriza_dg: "",
      Resultado_de_autorizacion_dg: "",
      Motivo_de_rechazo_dg: "",
      Observaciones_dg: "",
      Fecha_de_autorizacion_dc: null,
      Hora_de_autorizacion_dc: "",
      Usuario_que_autoriza_dc: "",
      Resultado_de_autorizacion_dc: "",
      Motivo_de_rechazo_dc: "",
      Observaciones_dc: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromNo_prefactura: "",
      toNo_prefactura: "",
      VueloFilter: "",
      Vuelo: "",
      VueloMultiple: "",
      Pax_SolicitanteFilter: "",
      Pax_Solicitante: "",
      Pax_SolicitanteMultiple: "",
      Empresa_SolicitanteFilter: "",
      Empresa_Solicitante: "",
      Empresa_SolicitanteMultiple: "",
      fromFecha_de_Salida: "",
      toFecha_de_Salida: "",
      fromFecha_de_Regreso: "",
      toFecha_de_Regreso: "",
      fromMonto_de_Factura: "",
      toMonto_de_Factura: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromFecha_de_autorizacion_adm: "",
      toFecha_de_autorizacion_adm: "",
      fromHora_de_autorizacion_adm: "",
      toHora_de_autorizacion_adm: "",
      Usuario_que_autoriza_admFilter: "",
      Usuario_que_autoriza_adm: "",
      Usuario_que_autoriza_admMultiple: "",
      Resultado_de_autorizacion_admFilter: "",
      Resultado_de_autorizacion_adm: "",
      Resultado_de_autorizacion_admMultiple: "",
      fromFecha_de_autorizacion_dg: "",
      toFecha_de_autorizacion_dg: "",
      fromHora_de_autorizacion_dg: "",
      toHora_de_autorizacion_dg: "",
      Usuario_que_autoriza_dgFilter: "",
      Usuario_que_autoriza_dg: "",
      Usuario_que_autoriza_dgMultiple: "",
      Resultado_de_autorizacion_dgFilter: "",
      Resultado_de_autorizacion_dg: "",
      Resultado_de_autorizacion_dgMultiple: "",
      fromFecha_de_autorizacion_dc: "",
      toFecha_de_autorizacion_dc: "",
      fromHora_de_autorizacion_dc: "",
      toHora_de_autorizacion_dc: "",
      Usuario_que_autoriza_dcFilter: "",
      Usuario_que_autoriza_dc: "",
      Usuario_que_autoriza_dcMultiple: "",
      Resultado_de_autorizacion_dcFilter: "",
      Resultado_de_autorizacion_dc: "",
      Resultado_de_autorizacion_dcMultiple: "",

    }
  };

  dataSource: Autorizacion_de_Prefactura_AerovicsDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Autorizacion_de_Prefactura_AerovicsDataSource;
  dataClipboard: any;

  constructor(
    private _Autorizacion_de_Prefactura_AerovicsService: Autorizacion_de_Prefactura_AerovicsService,
    public _dialog: MatDialog,
    private _messages: MessagesHelper,
    private _seguridad: SeguridadService,
    private _translate: TranslateService,
    public _file: SpartanFileService,
    public dialogo: MatDialog,
    private excelService: ExcelService,
    _user: SpartanUserService,
    private activateRoute: ActivatedRoute,
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
    this.activateRoute.paramMap.subscribe(
      params => {
        this.phase = params.get('id');
        if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") != this.phase) {
          this.localStorageHelper.setItemToLocalStorage("QueryParam", this.phase);
          this.ngOnInit();
        }
      });
    this.rulesBeforeCreationList();
    this.dataSource = new Autorizacion_de_Prefactura_AerovicsDataSource(
      this._Autorizacion_de_Prefactura_AerovicsService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Autorizacion_de_Prefactura_Aerovics)
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
    this.listConfig.filter.No_prefactura = "";
    this.listConfig.filter.Vuelo = "";
    this.listConfig.filter.Pax_Solicitante = "";
    this.listConfig.filter.Empresa_Solicitante = "";
    this.listConfig.filter.Fecha_de_Salida = undefined;
    this.listConfig.filter.Fecha_de_Regreso = undefined;
    this.listConfig.filter.Monto_de_Factura = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Motivo_de_rechazo_general = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.Fecha_de_autorizacion_adm = undefined;
    this.listConfig.filter.Hora_de_autorizacion_adm = "";
    this.listConfig.filter.Usuario_que_autoriza_adm = "";
    this.listConfig.filter.Resultado_de_autorizacion_adm = "";
    this.listConfig.filter.Motivo_de_rechazo_adm = "";
    this.listConfig.filter.Observaciones_adm = "";
    this.listConfig.filter.Fecha_de_autorizacion_dg = undefined;
    this.listConfig.filter.Hora_de_autorizacion_dg = "";
    this.listConfig.filter.Usuario_que_autoriza_dg = "";
    this.listConfig.filter.Resultado_de_autorizacion_dg = "";
    this.listConfig.filter.Motivo_de_rechazo_dg = "";
    this.listConfig.filter.Observaciones_dg = "";
    this.listConfig.filter.Fecha_de_autorizacion_dc = undefined;
    this.listConfig.filter.Hora_de_autorizacion_dc = "";
    this.listConfig.filter.Usuario_que_autoriza_dc = "";
    this.listConfig.filter.Resultado_de_autorizacion_dc = "";
    this.listConfig.filter.Motivo_de_rechazo_dc = "";
    this.listConfig.filter.Observaciones_dc = "";

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

    //INICIA - BRID:5457 - Ordenar por estatuss - Autor: Agustín Administrador - Actualización: 8/26/2021 11:14:45 PM
    this.brf.SetOrderonList(this.listConfig, "Autorizacion_de_Prefactura_Aerovics.Estatus");
    //TERMINA - BRID:5457


    //INICIA - BRID:6541 - WF:12 Rule List - Phase: 1 (Prefacturas Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 1) {
      this.brf.SetFilteronList(this.listConfig, " Autorizacion_de_Prefactura_Aerovics.Estatus = 1 ");
    } else { }
    //TERMINA - BRID:6541


    //INICIA - BRID:6543 - WF:12 Rule List - Phase: 2 (Prefacturas Generadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 2) { this.brf.SetFilteronList(this.listConfig, " Autorizacion_de_Prefactura_Aerovics.Estatus <> 0)  "); } else { }
    //TERMINA - BRID:6543


    //INICIA - BRID:6545 - WF:12 Rule List - Phase: 3 (Prefacturas por Autorizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 3) { this.brf.SetFilteronList(this.listConfig, " Autorizacion_de_Prefactura_Aerovics.Estatus = 3 "); } else { }
    //TERMINA - BRID:6545


    //INICIA - BRID:6547 - WF:12 Rule List - Phase: 4 (Prefacturas Autorizadas Director Corporativo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 4) { this.brf.SetFilteronList(this.listConfig, " Autorizacion_de_Prefactura_Aerovics.Resultado_de_autorizacion_dc = 1 "); } else { }
    //TERMINA - BRID:6547


    //INICIA - BRID:6549 - WF:12 Rule List - Phase: 5 (Prefacturas Autorizadas Director General) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 5) { this.brf.SetFilteronList(this.listConfig, " Autorizacion_de_Prefactura_Aerovics.Resultado_de_autorizacion_dg = 1 "); } else { }
    //TERMINA - BRID:6549


    //INICIA - BRID:6551 - WF:12 Rule List - Phase: 6 (Prefacturas por Autorizar Director General) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 6) { this.brf.SetFilteronList(this.listConfig, " Autorizacion_de_Prefactura_Aerovics.Estatus = 3 "); } else { }
    //TERMINA - BRID:6551


    //INICIA - BRID:6553 - WF:12 Rule List - Phase: 7 (Prefacturas por Autorizar Director Corporativo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 7) { this.brf.SetFilteronList(this.listConfig, " Autorizacion_de_Prefactura_Aerovics.Estatus = 4 "); } else { }
    //TERMINA - BRID:6553


    //INICIA - BRID:6555 - WF:12 Rule List - Phase: 8 (Prefacturas Autorizadas Administrativo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 8) { this.brf.SetFilteronList(this.listConfig, " Autorizacion_de_Prefactura_Aerovics.Resultado_de_autorizacion_adm = 1 "); } else { }
    //TERMINA - BRID:6555


    //INICIA - BRID:6557 - WF:12 Rule List - Phase: 9 (Prefacturas por Autorizar Administrativo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == 9) { this.brf.SetFilteronList(this.listConfig, " Autorizacion_de_Prefactura_Aerovics.Estatus = 7 "); } else { }
    //TERMINA - BRID:6557

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

  remove(row: Autorizacion_de_Prefactura_Aerovics) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Autorizacion_de_Prefactura_AerovicsService
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
  ActionPrint(dataRow: Autorizacion_de_Prefactura_Aerovics) {

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
      , 'No. prefactura'
      , 'Vuelo'
      , 'Solicitante'
      , 'Empresa Solicitante'
      , 'Fecha de Salida'
      , 'Fecha de Regreso'
      , 'Monto de Factura'
      , 'Estatus'
      , 'Motivo de rechazo general'
      , 'Observaciones'
      , 'Fecha de autorización'
      , 'Hora de autorización'
      , 'Usuario que autoriza'
      , 'Resultado de autorización'
      , 'Motivo de rechazo'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.No_prefactura
        , x.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
        , x.Pax_Solicitante_Spartan_User.Name
        , x.Empresa_Solicitante_Cliente.Razon_Social
        , x.Fecha_de_Salida
        , x.Fecha_de_Regreso
        , x.Monto_de_Factura
        , x.Estatus_Estatus_autorizacion_de_prefactura.Descripcion
        , x.Motivo_de_rechazo_general
        , x.Observaciones
        , x.Fecha_de_autorizacion_adm
        , x.Hora_de_autorizacion_adm
        , x.Usuario_que_autoriza_adm_Spartan_User.Name
        , x.Resultado_de_autorizacion_adm_Estatus_autorizacion_de_prefactura.Descripcion
        , x.Motivo_de_rechazo_adm
        , x.Observaciones_adm
        , x.Fecha_de_autorizacion_dg
        , x.Hora_de_autorizacion_dg
        , x.Usuario_que_autoriza_dg_Spartan_User.Name
        , x.Resultado_de_autorizacion_dg_Estatus_autorizacion_de_prefactura.Descripcion
        , x.Motivo_de_rechazo_dg
        , x.Observaciones_dg
        , x.Fecha_de_autorizacion_dc
        , x.Hora_de_autorizacion_dc
        , x.Usuario_que_autoriza_dc_Spartan_User.Name
        , x.Resultado_de_autorizacion_dc_Estatus_autorizacion_de_prefactura.Descripcion
        , x.Motivo_de_rechazo_dc
        , x.Observaciones_dc
      ]
      new_data.push(new_content);
    });

    const pdfDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        {
          table: {
            widths: ['*', 200, 'auto'],
            body: new_data
          }
        }
      ]
    }
    pdfMake.createPdf(pdfDefinition).download('Autorizacion_de_Prefactura_Aerovics.pdf');
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
          this._Autorizacion_de_Prefactura_AerovicsService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Autorizacion_de_Prefactura_Aerovicss;
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
          this._Autorizacion_de_Prefactura_AerovicsService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Autorizacion_de_Prefactura_Aerovicss;
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
        'No. prefactura ': fields.No_prefactura,
        'Vuelo ': fields.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Solicitante ': fields.Pax_Solicitante_Spartan_User.Name,
        'Empresa Solicitante ': fields.Empresa_Solicitante_Cliente.Razon_Social,
        'Fecha de Salida ': fields.Fecha_de_Salida ? momentJS(fields.Fecha_de_Salida).format('DD/MM/YYYY') : '',
        'Fecha de Regreso ': fields.Fecha_de_Regreso ? momentJS(fields.Fecha_de_Regreso).format('DD/MM/YYYY') : '',
        'Monto de Factura ': fields.Monto_de_Factura,
        'Estatus ': fields.Estatus_Estatus_autorizacion_de_prefactura.Descripcion,
        'Motivo de rechazo general ': fields.Motivo_de_rechazo_general,
        'Observaciones ': fields.Observaciones,
        'Fecha de autorización ': fields.Fecha_de_autorizacion_adm ? momentJS(fields.Fecha_de_autorizacion_adm).format('DD/MM/YYYY') : '',
        'Hora de autorización ': fields.Hora_de_autorizacion_adm,
        'Usuario que autoriza 1': fields.Usuario_que_autoriza_adm_Spartan_User.Name,
        'Resultado de autorización 1': fields.Resultado_de_autorizacion_adm_Estatus_autorizacion_de_prefactura.Descripcion,
        'Motivo de rechazo ': fields.Motivo_de_rechazo_adm,
        'Observaciones 1': fields.Observaciones_adm,
        'Fecha de autorización 1': fields.Fecha_de_autorizacion_dg ? momentJS(fields.Fecha_de_autorizacion_dg).format('DD/MM/YYYY') : '',
        'Hora de autorización 1 ': fields.Hora_de_autorizacion_dg,
        'Usuario que autoriza 2': fields.Usuario_que_autoriza_dg_Spartan_User.Name,
        'Resultado de autorización 2': fields.Resultado_de_autorizacion_dg_Estatus_autorizacion_de_prefactura.Descripcion,
        'Motivo de rechazo 2': fields.Motivo_de_rechazo_dg,
        'Observaciones 2': fields.Observaciones_dg,
        'Fecha de autorización 2': fields.Fecha_de_autorizacion_dc ? momentJS(fields.Fecha_de_autorizacion_dc).format('DD/MM/YYYY') : '',
        'Hora de autorización 2': fields.Hora_de_autorizacion_dc,
        'Usuario que autoriza 3': fields.Usuario_que_autoriza_dc_Spartan_User.Name,
        'Resultado de autorización 3': fields.Resultado_de_autorizacion_dc_Estatus_autorizacion_de_prefactura.Descripcion,
        'Motivo de rechazo 3': fields.Motivo_de_rechazo_dc,
        'Observaciones 3': fields.Observaciones_dc,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Autorizacion_de_Prefactura_Aerovics  ${new Date().toLocaleString()}`);
    this.excelService.exportAsExcelFile(excelData, `Autorizacion_de_Prefactura_Aerovics  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No_prefactura: x.No_prefactura,
      Vuelo: x.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Pax_Solicitante: x.Pax_Solicitante_Spartan_User.Name,
      Empresa_Solicitante: x.Empresa_Solicitante_Cliente.Razon_Social,
      Fecha_de_Salida: x.Fecha_de_Salida,
      Fecha_de_Regreso: x.Fecha_de_Regreso,
      Monto_de_Factura: x.Monto_de_Factura,
      Estatus: x.Estatus_Estatus_autorizacion_de_prefactura.Descripcion,
      Motivo_de_rechazo_general: x.Motivo_de_rechazo_general,
      Observaciones: x.Observaciones,
      Fecha_de_autorizacion_adm: x.Fecha_de_autorizacion_adm,
      Hora_de_autorizacion_adm: x.Hora_de_autorizacion_adm,
      Usuario_que_autoriza_adm: x.Usuario_que_autoriza_adm_Spartan_User.Name,
      Resultado_de_autorizacion_adm: x.Resultado_de_autorizacion_adm_Estatus_autorizacion_de_prefactura.Descripcion,
      Motivo_de_rechazo_adm: x.Motivo_de_rechazo_adm,
      Observaciones_adm: x.Observaciones_adm,
      Fecha_de_autorizacion_dg: x.Fecha_de_autorizacion_dg,
      Hora_de_autorizacion_dg: x.Hora_de_autorizacion_dg,
      Usuario_que_autoriza_dg: x.Usuario_que_autoriza_dg_Spartan_User.Name,
      Resultado_de_autorizacion_dg: x.Resultado_de_autorizacion_dg_Estatus_autorizacion_de_prefactura.Descripcion,
      Motivo_de_rechazo_dg: x.Motivo_de_rechazo_dg,
      Observaciones_dg: x.Observaciones_dg,
      Fecha_de_autorizacion_dc: x.Fecha_de_autorizacion_dc,
      Hora_de_autorizacion_dc: x.Hora_de_autorizacion_dc,
      Usuario_que_autoriza_dc: x.Usuario_que_autoriza_dc_Spartan_User.Name,
      Resultado_de_autorizacion_dc: x.Resultado_de_autorizacion_dc_Estatus_autorizacion_de_prefactura.Descripcion,
      Motivo_de_rechazo_dc: x.Motivo_de_rechazo_dc,
      Observaciones_dc: x.Observaciones_dc,

    }));

    this.excelService.exportToCsv(result, 'Autorizacion_de_Prefactura_Aerovics', ['Folio', 'No_prefactura', 'Vuelo', 'Pax_Solicitante', 'Empresa_Solicitante', 'Fecha_de_Salida', 'Fecha_de_Regreso', 'Monto_de_Factura', 'Estatus', 'Motivo_de_rechazo_general', 'Observaciones', 'Fecha_de_autorizacion_adm', 'Hora_de_autorizacion_adm', 'Usuario_que_autoriza_adm', 'Resultado_de_autorizacion_adm', 'Motivo_de_rechazo_adm', 'Observaciones_adm', 'Fecha_de_autorizacion_dg', 'Hora_de_autorizacion_dg', 'Usuario_que_autoriza_dg', 'Resultado_de_autorizacion_dg', 'Motivo_de_rechazo_dg', 'Observaciones_dg', 'Fecha_de_autorizacion_dc', 'Hora_de_autorizacion_dc', 'Usuario_que_autoriza_dc', 'Resultado_de_autorizacion_dc', 'Motivo_de_rechazo_dc', 'Observaciones_dc']);
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
    template += '          <th>No. prefactura</th>';
    template += '          <th>Vuelo</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Empresa Solicitante</th>';
    template += '          <th>Fecha de Salida</th>';
    template += '          <th>Fecha de Regreso</th>';
    template += '          <th>Monto de Factura</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Motivo de rechazo general</th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>Fecha de autorización</th>';
    template += '          <th>Hora de autorización</th>';
    template += '          <th>Usuario que autoriza</th>';
    template += '          <th>Resultado de autorización</th>';
    template += '          <th>Motivo de rechazo</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No_prefactura + '</td>';
      template += '          <td>' + element.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Pax_Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Empresa_Solicitante_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Fecha_de_Salida + '</td>';
      template += '          <td>' + element.Fecha_de_Regreso + '</td>';
      template += '          <td>' + element.Monto_de_Factura + '</td>';
      template += '          <td>' + element.Estatus_Estatus_autorizacion_de_prefactura.Descripcion + '</td>';
      template += '          <td>' + element.Motivo_de_rechazo_general + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.Fecha_de_autorizacion_adm + '</td>';
      template += '          <td>' + element.Hora_de_autorizacion_adm + '</td>';
      template += '          <td>' + element.Usuario_que_autoriza_adm_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_de_autorizacion_adm_Estatus_autorizacion_de_prefactura.Descripcion + '</td>';
      template += '          <td>' + element.Motivo_de_rechazo_adm + '</td>';
      template += '          <td>' + element.Observaciones_adm + '</td>';
      template += '          <td>' + element.Fecha_de_autorizacion_dg + '</td>';
      template += '          <td>' + element.Hora_de_autorizacion_dg + '</td>';
      template += '          <td>' + element.Usuario_que_autoriza_dg_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_de_autorizacion_dg_Estatus_autorizacion_de_prefactura.Descripcion + '</td>';
      template += '          <td>' + element.Motivo_de_rechazo_dg + '</td>';
      template += '          <td>' + element.Observaciones_dg + '</td>';
      template += '          <td>' + element.Fecha_de_autorizacion_dc + '</td>';
      template += '          <td>' + element.Hora_de_autorizacion_dc + '</td>';
      template += '          <td>' + element.Usuario_que_autoriza_dc_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_de_autorizacion_dc_Estatus_autorizacion_de_prefactura.Descripcion + '</td>';
      template += '          <td>' + element.Motivo_de_rechazo_dc + '</td>';
      template += '          <td>' + element.Observaciones_dc + '</td>';

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
    template += '\t No. prefactura';
    template += '\t Vuelo';
    template += '\t Solicitante';
    template += '\t Empresa Solicitante';
    template += '\t Fecha de Salida';
    template += '\t Fecha de Regreso';
    template += '\t Monto de Factura';
    template += '\t Estatus';
    template += '\t Motivo de rechazo general';
    template += '\t Observaciones';
    template += '\t Fecha de autorización';
    template += '\t Hora de autorización';
    template += '\t Usuario que autoriza';
    template += '\t Resultado de autorización';
    template += '\t Motivo de rechazo';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.No_prefactura;
      template += '\t ' + element.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Pax_Solicitante_Spartan_User.Name;
      template += '\t ' + element.Empresa_Solicitante_Cliente.Razon_Social;
      template += '\t ' + element.Fecha_de_Salida;
      template += '\t ' + element.Fecha_de_Regreso;
      template += '\t ' + element.Monto_de_Factura;
      template += '\t ' + element.Estatus_Estatus_autorizacion_de_prefactura.Descripcion;
      template += '\t ' + element.Motivo_de_rechazo_general;
      template += '\t ' + element.Observaciones;
      template += '\t ' + element.Fecha_de_autorizacion_adm;
      template += '\t ' + element.Hora_de_autorizacion_adm;
      template += '\t ' + element.Usuario_que_autoriza_adm_Spartan_User.Name;
      template += '\t ' + element.Resultado_de_autorizacion_adm_Estatus_autorizacion_de_prefactura.Descripcion;
      template += '\t ' + element.Motivo_de_rechazo_adm;
      template += '\t ' + element.Observaciones_adm;
      template += '\t ' + element.Fecha_de_autorizacion_dg;
      template += '\t ' + element.Hora_de_autorizacion_dg;
      template += '\t ' + element.Usuario_que_autoriza_dg_Spartan_User.Name;
      template += '\t ' + element.Resultado_de_autorizacion_dg_Estatus_autorizacion_de_prefactura.Descripcion;
      template += '\t ' + element.Motivo_de_rechazo_dg;
      template += '\t ' + element.Observaciones_dg;
      template += '\t ' + element.Fecha_de_autorizacion_dc;
      template += '\t ' + element.Hora_de_autorizacion_dc;
      template += '\t ' + element.Usuario_que_autoriza_dc_Spartan_User.Name;
      template += '\t ' + element.Resultado_de_autorizacion_dc_Estatus_autorizacion_de_prefactura.Descripcion;
      template += '\t ' + element.Motivo_de_rechazo_dc;
      template += '\t ' + element.Observaciones_dc;

      template += '\n';
    });

    return template;
  }

}

export class Autorizacion_de_Prefactura_AerovicsDataSource implements DataSource<Autorizacion_de_Prefactura_Aerovics>
{
  private subject = new BehaviorSubject<Autorizacion_de_Prefactura_Aerovics[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Autorizacion_de_Prefactura_AerovicsService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Autorizacion_de_Prefactura_Aerovics[]> {
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
              const longest = result.Autorizacion_de_Prefactura_Aerovicss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Autorizacion_de_Prefactura_Aerovicss);
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
      condition += " and Autorizacion_de_Prefactura_Aerovics.Folio = " + data.filter.Folio;
    if (data.filter.No_prefactura != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.No_prefactura = " + data.filter.No_prefactura;
    if (data.filter.Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Vuelo + "%' ";
    if (data.filter.Pax_Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Pax_Solicitante + "%' ";
    if (data.filter.Empresa_Solicitante != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Empresa_Solicitante + "%' ";
    if (data.filter.Fecha_de_Salida)
      condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_Salida, 102)  = '" + moment(data.filter.Fecha_de_Salida).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_Regreso)
      condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_Regreso, 102)  = '" + moment(data.filter.Fecha_de_Regreso).format("YYYY.MM.DD") + "'";
    if (data.filter.Monto_de_Factura != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Monto_de_Factura = " + data.filter.Monto_de_Factura;
    if (data.filter.Estatus != "")
      condition += " and Estatus_autorizacion_de_prefactura.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Motivo_de_rechazo_general != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_general like '%" + data.filter.Motivo_de_rechazo_general + "%' ";
    if (data.filter.Observaciones != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.Fecha_de_autorizacion_adm)
      condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_adm, 102)  = '" + moment(data.filter.Fecha_de_autorizacion_adm).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_autorizacion_adm != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_adm = '" + data.filter.Hora_de_autorizacion_adm + "'";
    if (data.filter.Usuario_que_autoriza_adm != "")
      condition += " and Spartan_User1.Name like '%" + data.filter.Usuario_que_autoriza_adm + "%' ";
    if (data.filter.Resultado_de_autorizacion_adm != "")
      condition += " and Estatus_autorizacion_de_prefactura1.Descripcion like '%" + data.filter.Resultado_de_autorizacion_adm + "%' ";
    if (data.filter.Motivo_de_rechazo_adm != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_adm like '%" + data.filter.Motivo_de_rechazo_adm + "%' ";
    if (data.filter.Observaciones_adm != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Observaciones_adm like '%" + data.filter.Observaciones_adm + "%' ";
    if (data.filter.Fecha_de_autorizacion_dg)
      condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_dg, 102)  = '" + moment(data.filter.Fecha_de_autorizacion_dg).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_autorizacion_dg != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_dg = '" + data.filter.Hora_de_autorizacion_dg + "'";
    if (data.filter.Usuario_que_autoriza_dg != "")
      condition += " and Spartan_User2.Name like '%" + data.filter.Usuario_que_autoriza_dg + "%' ";
    if (data.filter.Resultado_de_autorizacion_dg != "")
      condition += " and Estatus_autorizacion_de_prefactura2.Descripcion like '%" + data.filter.Resultado_de_autorizacion_dg + "%' ";
    if (data.filter.Motivo_de_rechazo_dg != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dg like '%" + data.filter.Motivo_de_rechazo_dg + "%' ";
    if (data.filter.Observaciones_dg != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Observaciones_dg like '%" + data.filter.Observaciones_dg + "%' ";
    if (data.filter.Fecha_de_autorizacion_dc)
      condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_dc, 102)  = '" + moment(data.filter.Fecha_de_autorizacion_dc).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_autorizacion_dc != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_dc = '" + data.filter.Hora_de_autorizacion_dc + "'";
    if (data.filter.Usuario_que_autoriza_dc != "")
      condition += " and Spartan_User3.Name like '%" + data.filter.Usuario_que_autoriza_dc + "%' ";
    if (data.filter.Resultado_de_autorizacion_dc != "")
      condition += " and Estatus_autorizacion_de_prefactura3.Descripcion like '%" + data.filter.Resultado_de_autorizacion_dc + "%' ";
    if (data.filter.Motivo_de_rechazo_dc != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dc like '%" + data.filter.Motivo_de_rechazo_dc + "%' ";
    if (data.filter.Observaciones_dc != "")
      condition += " and Autorizacion_de_Prefactura_Aerovics.Observaciones_dc like '%" + data.filter.Observaciones_dc + "%' ";

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
        sort = " Autorizacion_de_Prefactura_Aerovics.Folio " + data.sortDirecction;
        break;
      case "No_prefactura":
        sort = " Autorizacion_de_Prefactura_Aerovics.No_prefactura " + data.sortDirecction;
        break;
      case "Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Pax_Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Empresa_Solicitante":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Fecha_de_Salida":
        sort = " Autorizacion_de_Prefactura_Aerovics.Fecha_de_Salida " + data.sortDirecction;
        break;
      case "Fecha_de_Regreso":
        sort = " Autorizacion_de_Prefactura_Aerovics.Fecha_de_Regreso " + data.sortDirecction;
        break;
      case "Monto_de_Factura":
        sort = " Autorizacion_de_Prefactura_Aerovics.Monto_de_Factura " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_autorizacion_de_prefactura.Descripcion " + data.sortDirecction;
        break;
      case "Motivo_de_rechazo_general":
        sort = " Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_general " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Autorizacion_de_Prefactura_Aerovics.Observaciones " + data.sortDirecction;
        break;
      case "Fecha_de_autorizacion_adm":
        sort = " Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_adm " + data.sortDirecction;
        break;
      case "Hora_de_autorizacion_adm":
        sort = " Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_adm " + data.sortDirecction;
        break;
      case "Usuario_que_autoriza_adm":
        sort = " Spartan_User1.Name " + data.sortDirecction;
        break;
      case "Resultado_de_autorizacion_adm":
        sort = " Estatus_autorizacion_de_prefactura1.Descripcion " + data.sortDirecction;
        break;
      case "Motivo_de_rechazo_adm":
        sort = " Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_adm " + data.sortDirecction;
        break;
      case "Observaciones_adm":
        sort = " Autorizacion_de_Prefactura_Aerovics.Observaciones_adm " + data.sortDirecction;
        break;
      case "Fecha_de_autorizacion_dg":
        sort = " Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_dg " + data.sortDirecction;
        break;
      case "Hora_de_autorizacion_dg":
        sort = " Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_dg " + data.sortDirecction;
        break;
      case "Usuario_que_autoriza_dg":
        sort = " Spartan_User2.Name " + data.sortDirecction;
        break;
      case "Resultado_de_autorizacion_dg":
        sort = " Estatus_autorizacion_de_prefactura2.Descripcion " + data.sortDirecction;
        break;
      case "Motivo_de_rechazo_dg":
        sort = " Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dg " + data.sortDirecction;
        break;
      case "Observaciones_dg":
        sort = " Autorizacion_de_Prefactura_Aerovics.Observaciones_dg " + data.sortDirecction;
        break;
      case "Fecha_de_autorizacion_dc":
        sort = " Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_dc " + data.sortDirecction;
        break;
      case "Hora_de_autorizacion_dc":
        sort = " Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_dc " + data.sortDirecction;
        break;
      case "Usuario_que_autoriza_dc":
        sort = " Spartan_User3.Name " + data.sortDirecction;
        break;
      case "Resultado_de_autorizacion_dc":
        sort = " Estatus_autorizacion_de_prefactura3.Descripcion " + data.sortDirecction;
        break;
      case "Motivo_de_rechazo_dc":
        sort = " Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dc " + data.sortDirecction;
        break;
      case "Observaciones_dc":
        sort = " Autorizacion_de_Prefactura_Aerovics.Observaciones_dc " + data.sortDirecction;
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
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromNo_prefactura != 'undefined' && data.filterAdvanced.fromNo_prefactura)
      || (typeof data.filterAdvanced.toNo_prefactura != 'undefined' && data.filterAdvanced.toNo_prefactura)) {
      if (typeof data.filterAdvanced.fromNo_prefactura != 'undefined' && data.filterAdvanced.fromNo_prefactura)
        condition += " AND Autorizacion_de_Prefactura_Aerovics.No_prefactura >= " + data.filterAdvanced.fromNo_prefactura;

      if (typeof data.filterAdvanced.toNo_prefactura != 'undefined' && data.filterAdvanced.toNo_prefactura)
        condition += " AND Autorizacion_de_Prefactura_Aerovics.No_prefactura <= " + data.filterAdvanced.toNo_prefactura;
    }
    if ((typeof data.filterAdvanced.Vuelo != 'undefined' && data.filterAdvanced.Vuelo)) {
      switch (data.filterAdvanced.VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.VueloMultiple != null && data.filterAdvanced.VueloMultiple.length > 0) {
      var Vuelods = data.filterAdvanced.VueloMultiple.join(",");
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Vuelo In (" + Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Pax_Solicitante != 'undefined' && data.filterAdvanced.Pax_Solicitante)) {
      switch (data.filterAdvanced.Pax_SolicitanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Pax_Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Pax_Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Pax_Solicitante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Pax_Solicitante + "'";
          break;
      }
    } else if (data.filterAdvanced.Pax_SolicitanteMultiple != null && data.filterAdvanced.Pax_SolicitanteMultiple.length > 0) {
      var Pax_Solicitanteds = data.filterAdvanced.Pax_SolicitanteMultiple.join(",");
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Pax_Solicitante In (" + Pax_Solicitanteds + ")";
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
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Empresa_Solicitante In (" + Empresa_Solicitanteds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Salida != 'undefined' && data.filterAdvanced.fromFecha_de_Salida)
      || (typeof data.filterAdvanced.toFecha_de_Salida != 'undefined' && data.filterAdvanced.toFecha_de_Salida)) {
      if (typeof data.filterAdvanced.fromFecha_de_Salida != 'undefined' && data.filterAdvanced.fromFecha_de_Salida)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_Salida, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Salida).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Salida != 'undefined' && data.filterAdvanced.toFecha_de_Salida)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_Salida, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Salida).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Regreso != 'undefined' && data.filterAdvanced.fromFecha_de_Regreso)
      || (typeof data.filterAdvanced.toFecha_de_Regreso != 'undefined' && data.filterAdvanced.toFecha_de_Regreso)) {
      if (typeof data.filterAdvanced.fromFecha_de_Regreso != 'undefined' && data.filterAdvanced.fromFecha_de_Regreso)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_Regreso, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Regreso).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Regreso != 'undefined' && data.filterAdvanced.toFecha_de_Regreso)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_Regreso, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Regreso).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromMonto_de_Factura != 'undefined' && data.filterAdvanced.fromMonto_de_Factura)
      || (typeof data.filterAdvanced.toMonto_de_Factura != 'undefined' && data.filterAdvanced.toMonto_de_Factura)) {
      if (typeof data.filterAdvanced.fromMonto_de_Factura != 'undefined' && data.filterAdvanced.fromMonto_de_Factura)
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Monto_de_Factura >= " + data.filterAdvanced.fromMonto_de_Factura;

      if (typeof data.filterAdvanced.toMonto_de_Factura != 'undefined' && data.filterAdvanced.toMonto_de_Factura)
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Monto_de_Factura <= " + data.filterAdvanced.toMonto_de_Factura;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_autorizacion_de_prefactura.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_autorizacion_de_prefactura.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_autorizacion_de_prefactura.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_autorizacion_de_prefactura.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Estatus In (" + Estatusds + ")";
    }
    switch (data.filterAdvanced.Motivo_de_rechazo_generalFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_general LIKE '" + data.filterAdvanced.Motivo_de_rechazo_general + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_general LIKE '%" + data.filterAdvanced.Motivo_de_rechazo_general + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_general LIKE '%" + data.filterAdvanced.Motivo_de_rechazo_general + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_general = '" + data.filterAdvanced.Motivo_de_rechazo_general + "'";
        break;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_autorizacion_adm != 'undefined' && data.filterAdvanced.fromFecha_de_autorizacion_adm)
      || (typeof data.filterAdvanced.toFecha_de_autorizacion_adm != 'undefined' && data.filterAdvanced.toFecha_de_autorizacion_adm)) {
      if (typeof data.filterAdvanced.fromFecha_de_autorizacion_adm != 'undefined' && data.filterAdvanced.fromFecha_de_autorizacion_adm)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_adm, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_autorizacion_adm).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_autorizacion_adm != 'undefined' && data.filterAdvanced.toFecha_de_autorizacion_adm)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_adm, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_autorizacion_adm).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_autorizacion_adm != 'undefined' && data.filterAdvanced.fromHora_de_autorizacion_adm)
      || (typeof data.filterAdvanced.toHora_de_autorizacion_adm != 'undefined' && data.filterAdvanced.toHora_de_autorizacion_adm)) {
      if (typeof data.filterAdvanced.fromHora_de_autorizacion_adm != 'undefined' && data.filterAdvanced.fromHora_de_autorizacion_adm)
        condition += " and Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_adm >= '" + data.filterAdvanced.fromHora_de_autorizacion_adm + "'";

      if (typeof data.filterAdvanced.toHora_de_autorizacion_adm != 'undefined' && data.filterAdvanced.toHora_de_autorizacion_adm)
        condition += " and Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_adm <= '" + data.filterAdvanced.toHora_de_autorizacion_adm + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_autoriza_adm != 'undefined' && data.filterAdvanced.Usuario_que_autoriza_adm)) {
      switch (data.filterAdvanced.Usuario_que_autoriza_admFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User1.Name LIKE '" + data.filterAdvanced.Usuario_que_autoriza_adm + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User1.Name LIKE '%" + data.filterAdvanced.Usuario_que_autoriza_adm + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User1.Name LIKE '%" + data.filterAdvanced.Usuario_que_autoriza_adm + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User1.Name = '" + data.filterAdvanced.Usuario_que_autoriza_adm + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_autoriza_admMultiple != null && data.filterAdvanced.Usuario_que_autoriza_admMultiple.length > 0) {
      var Usuario_que_autoriza_admds = data.filterAdvanced.Usuario_que_autoriza_admMultiple.join(",");
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Usuario_que_autoriza_adm In (" + Usuario_que_autoriza_admds + ")";
    }
    if ((typeof data.filterAdvanced.Resultado_de_autorizacion_adm != 'undefined' && data.filterAdvanced.Resultado_de_autorizacion_adm)) {
      switch (data.filterAdvanced.Resultado_de_autorizacion_admFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_autorizacion_de_prefactura1.Descripcion LIKE '" + data.filterAdvanced.Resultado_de_autorizacion_adm + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_autorizacion_de_prefactura1.Descripcion LIKE '%" + data.filterAdvanced.Resultado_de_autorizacion_adm + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_autorizacion_de_prefactura1.Descripcion LIKE '%" + data.filterAdvanced.Resultado_de_autorizacion_adm + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_autorizacion_de_prefactura1.Descripcion = '" + data.filterAdvanced.Resultado_de_autorizacion_adm + "'";
          break;
      }
    } else if (data.filterAdvanced.Resultado_de_autorizacion_admMultiple != null && data.filterAdvanced.Resultado_de_autorizacion_admMultiple.length > 0) {
      var Resultado_de_autorizacion_admds = data.filterAdvanced.Resultado_de_autorizacion_admMultiple.join(",");
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Resultado_de_autorizacion_adm In (" + Resultado_de_autorizacion_admds + ")";
    }
    switch (data.filterAdvanced.Motivo_de_rechazo_admFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_adm LIKE '" + data.filterAdvanced.Motivo_de_rechazo_adm + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_adm LIKE '%" + data.filterAdvanced.Motivo_de_rechazo_adm + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_adm LIKE '%" + data.filterAdvanced.Motivo_de_rechazo_adm + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_adm = '" + data.filterAdvanced.Motivo_de_rechazo_adm + "'";
        break;
    }
    switch (data.filterAdvanced.Observaciones_admFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_adm LIKE '" + data.filterAdvanced.Observaciones_adm + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_adm LIKE '%" + data.filterAdvanced.Observaciones_adm + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_adm LIKE '%" + data.filterAdvanced.Observaciones_adm + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_adm = '" + data.filterAdvanced.Observaciones_adm + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_autorizacion_dg != 'undefined' && data.filterAdvanced.fromFecha_de_autorizacion_dg)
      || (typeof data.filterAdvanced.toFecha_de_autorizacion_dg != 'undefined' && data.filterAdvanced.toFecha_de_autorizacion_dg)) {
      if (typeof data.filterAdvanced.fromFecha_de_autorizacion_dg != 'undefined' && data.filterAdvanced.fromFecha_de_autorizacion_dg)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_dg, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_autorizacion_dg).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_autorizacion_dg != 'undefined' && data.filterAdvanced.toFecha_de_autorizacion_dg)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_dg, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_autorizacion_dg).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_autorizacion_dg != 'undefined' && data.filterAdvanced.fromHora_de_autorizacion_dg)
      || (typeof data.filterAdvanced.toHora_de_autorizacion_dg != 'undefined' && data.filterAdvanced.toHora_de_autorizacion_dg)) {
      if (typeof data.filterAdvanced.fromHora_de_autorizacion_dg != 'undefined' && data.filterAdvanced.fromHora_de_autorizacion_dg)
        condition += " and Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_dg >= '" + data.filterAdvanced.fromHora_de_autorizacion_dg + "'";

      if (typeof data.filterAdvanced.toHora_de_autorizacion_dg != 'undefined' && data.filterAdvanced.toHora_de_autorizacion_dg)
        condition += " and Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_dg <= '" + data.filterAdvanced.toHora_de_autorizacion_dg + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_autoriza_dg != 'undefined' && data.filterAdvanced.Usuario_que_autoriza_dg)) {
      switch (data.filterAdvanced.Usuario_que_autoriza_dgFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User2.Name LIKE '" + data.filterAdvanced.Usuario_que_autoriza_dg + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User2.Name LIKE '%" + data.filterAdvanced.Usuario_que_autoriza_dg + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User2.Name LIKE '%" + data.filterAdvanced.Usuario_que_autoriza_dg + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User2.Name = '" + data.filterAdvanced.Usuario_que_autoriza_dg + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_autoriza_dgMultiple != null && data.filterAdvanced.Usuario_que_autoriza_dgMultiple.length > 0) {
      var Usuario_que_autoriza_dgds = data.filterAdvanced.Usuario_que_autoriza_dgMultiple.join(",");
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Usuario_que_autoriza_dg In (" + Usuario_que_autoriza_dgds + ")";
    }
    if ((typeof data.filterAdvanced.Resultado_de_autorizacion_dg != 'undefined' && data.filterAdvanced.Resultado_de_autorizacion_dg)) {
      switch (data.filterAdvanced.Resultado_de_autorizacion_dgFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_autorizacion_de_prefactura2.Descripcion LIKE '" + data.filterAdvanced.Resultado_de_autorizacion_dg + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_autorizacion_de_prefactura2.Descripcion LIKE '%" + data.filterAdvanced.Resultado_de_autorizacion_dg + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_autorizacion_de_prefactura2.Descripcion LIKE '%" + data.filterAdvanced.Resultado_de_autorizacion_dg + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_autorizacion_de_prefactura2.Descripcion = '" + data.filterAdvanced.Resultado_de_autorizacion_dg + "'";
          break;
      }
    } else if (data.filterAdvanced.Resultado_de_autorizacion_dgMultiple != null && data.filterAdvanced.Resultado_de_autorizacion_dgMultiple.length > 0) {
      var Resultado_de_autorizacion_dgds = data.filterAdvanced.Resultado_de_autorizacion_dgMultiple.join(",");
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Resultado_de_autorizacion_dg In (" + Resultado_de_autorizacion_dgds + ")";
    }
    switch (data.filterAdvanced.Motivo_de_rechazo_dgFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dg LIKE '" + data.filterAdvanced.Motivo_de_rechazo_dg + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dg LIKE '%" + data.filterAdvanced.Motivo_de_rechazo_dg + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dg LIKE '%" + data.filterAdvanced.Motivo_de_rechazo_dg + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dg = '" + data.filterAdvanced.Motivo_de_rechazo_dg + "'";
        break;
    }
    switch (data.filterAdvanced.Observaciones_dgFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_dg LIKE '" + data.filterAdvanced.Observaciones_dg + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_dg LIKE '%" + data.filterAdvanced.Observaciones_dg + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_dg LIKE '%" + data.filterAdvanced.Observaciones_dg + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_dg = '" + data.filterAdvanced.Observaciones_dg + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_autorizacion_dc != 'undefined' && data.filterAdvanced.fromFecha_de_autorizacion_dc)
      || (typeof data.filterAdvanced.toFecha_de_autorizacion_dc != 'undefined' && data.filterAdvanced.toFecha_de_autorizacion_dc)) {
      if (typeof data.filterAdvanced.fromFecha_de_autorizacion_dc != 'undefined' && data.filterAdvanced.fromFecha_de_autorizacion_dc)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_dc, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_autorizacion_dc).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_autorizacion_dc != 'undefined' && data.filterAdvanced.toFecha_de_autorizacion_dc)
        condition += " and CONVERT(VARCHAR(10), Autorizacion_de_Prefactura_Aerovics.Fecha_de_autorizacion_dc, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_autorizacion_dc).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_autorizacion_dc != 'undefined' && data.filterAdvanced.fromHora_de_autorizacion_dc)
      || (typeof data.filterAdvanced.toHora_de_autorizacion_dc != 'undefined' && data.filterAdvanced.toHora_de_autorizacion_dc)) {
      if (typeof data.filterAdvanced.fromHora_de_autorizacion_dc != 'undefined' && data.filterAdvanced.fromHora_de_autorizacion_dc)
        condition += " and Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_dc >= '" + data.filterAdvanced.fromHora_de_autorizacion_dc + "'";

      if (typeof data.filterAdvanced.toHora_de_autorizacion_dc != 'undefined' && data.filterAdvanced.toHora_de_autorizacion_dc)
        condition += " and Autorizacion_de_Prefactura_Aerovics.Hora_de_autorizacion_dc <= '" + data.filterAdvanced.toHora_de_autorizacion_dc + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_autoriza_dc != 'undefined' && data.filterAdvanced.Usuario_que_autoriza_dc)) {
      switch (data.filterAdvanced.Usuario_que_autoriza_dcFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User3.Name LIKE '" + data.filterAdvanced.Usuario_que_autoriza_dc + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User3.Name LIKE '%" + data.filterAdvanced.Usuario_que_autoriza_dc + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User3.Name LIKE '%" + data.filterAdvanced.Usuario_que_autoriza_dc + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User3.Name = '" + data.filterAdvanced.Usuario_que_autoriza_dc + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_autoriza_dcMultiple != null && data.filterAdvanced.Usuario_que_autoriza_dcMultiple.length > 0) {
      var Usuario_que_autoriza_dcds = data.filterAdvanced.Usuario_que_autoriza_dcMultiple.join(",");
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Usuario_que_autoriza_dc In (" + Usuario_que_autoriza_dcds + ")";
    }
    if ((typeof data.filterAdvanced.Resultado_de_autorizacion_dc != 'undefined' && data.filterAdvanced.Resultado_de_autorizacion_dc)) {
      switch (data.filterAdvanced.Resultado_de_autorizacion_dcFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_autorizacion_de_prefactura3.Descripcion LIKE '" + data.filterAdvanced.Resultado_de_autorizacion_dc + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_autorizacion_de_prefactura3.Descripcion LIKE '%" + data.filterAdvanced.Resultado_de_autorizacion_dc + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_autorizacion_de_prefactura3.Descripcion LIKE '%" + data.filterAdvanced.Resultado_de_autorizacion_dc + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_autorizacion_de_prefactura3.Descripcion = '" + data.filterAdvanced.Resultado_de_autorizacion_dc + "'";
          break;
      }
    } else if (data.filterAdvanced.Resultado_de_autorizacion_dcMultiple != null && data.filterAdvanced.Resultado_de_autorizacion_dcMultiple.length > 0) {
      var Resultado_de_autorizacion_dcds = data.filterAdvanced.Resultado_de_autorizacion_dcMultiple.join(",");
      condition += " AND Autorizacion_de_Prefactura_Aerovics.Resultado_de_autorizacion_dc In (" + Resultado_de_autorizacion_dcds + ")";
    }
    switch (data.filterAdvanced.Motivo_de_rechazo_dcFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dc LIKE '" + data.filterAdvanced.Motivo_de_rechazo_dc + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dc LIKE '%" + data.filterAdvanced.Motivo_de_rechazo_dc + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dc LIKE '%" + data.filterAdvanced.Motivo_de_rechazo_dc + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Motivo_de_rechazo_dc = '" + data.filterAdvanced.Motivo_de_rechazo_dc + "'";
        break;
    }
    switch (data.filterAdvanced.Observaciones_dcFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_dc LIKE '" + data.filterAdvanced.Observaciones_dc + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_dc LIKE '%" + data.filterAdvanced.Observaciones_dc + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_dc LIKE '%" + data.filterAdvanced.Observaciones_dc + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Autorizacion_de_Prefactura_Aerovics.Observaciones_dc = '" + data.filterAdvanced.Observaciones_dc + "'";
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
              const longest = result.Autorizacion_de_Prefactura_Aerovicss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Autorizacion_de_Prefactura_Aerovicss);
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
