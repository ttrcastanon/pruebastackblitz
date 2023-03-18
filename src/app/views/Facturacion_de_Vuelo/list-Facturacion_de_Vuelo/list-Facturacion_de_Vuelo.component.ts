import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Facturacion_de_VueloService } from "src/app/api-services/Facturacion_de_Vuelo.service";
import { Facturacion_de_Vuelo } from "src/app/models/Facturacion_de_Vuelo";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from "@angular/core";
import { CollectionViewer } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of } from "rxjs";
import { catchError, finalize, concatMap, switchMap, mergeMap, tap } from "rxjs/operators";
import { SpartanService } from "src/app/api-services/spartan.service";
import { MatSort } from "@angular/material/sort";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import * as AppConstants from "../../../app-constants";
import { StorageKeys } from "../../../app-constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { Facturacion_de_VueloIndexRules } from 'src/app/shared/businessRules/Facturacion_de_Vuelo-index-rules';
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
pdfMake.vfs = pdfFonts.pdfMake.vfs;
import { PrintHelper } from "./../../../helpers/print-helper";
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';

@Component({
  selector: "app-list-Facturacion_de_Vuelo",
  templateUrl: "./list-Facturacion_de_Vuelo.component.html",
  styleUrls: ["./list-Facturacion_de_Vuelo.component.scss"],
})
export class ListFacturacion_de_VueloComponent extends Facturacion_de_VueloIndexRules implements OnInit, AfterViewInit, AfterViewChecked {

  brf: BusinessRulesFunctions;

  displayedColumns = [
    "acciones",
    "Folio",
    "Fecha",
    "Hora",
    "Vuelo",
    "Seccion",
    "Tipo",
    "Matricula",
    "Modelo",
    "Ano",
    "Cliente",
    "Solicitante_1",
    "Horas_de_vuelo",
    "Horas_de_Espera",
    "Percnota",
    "Estatus",
    "Fecha_de_la_factura",
    "Servicios_Terminal_Total",
    "Comisariato_Total",
    "Despacho",
    "TUA_Nacional",
    "TUA_Nacional_Total",
    "TUA_Internacional",
    "TUA_Internacional_Total",
    "IVA_Frontera",
    "IVA_Frontera_Total",
    "IVA_Nacional",
    "IVA_Nacional_Total",
    "SubTotal",
    "Tiempo_de_Vuelo",
    "Tiempo_de_Vuelo_Total",
    "Tiempo_de_Espera",
    "Espera_sin_Cargo",
    "Espera_con_Cargo",
    "Espera_con_Cargo_Total",
    "Pernocta",
    "Pernoctas_Total",
    "IVA_Nacional_Servicios",
    "IVA_Nacional_Servicios_Total",
    "IVA",
    "IVA_Internacional_Total",
    "Cargo_vuelo_int_",
    "Cargo_Vuelo_Int__Total",
    "IVA_vuelo_int_",
    "IVA_Vuelo_Int__Total",
    "SubTotal_1",
    "Servicios_de_Terminal",
    "Comisariato_1",
    "Despacho_1",
    "Margen",
    "Total_a_pagar",
    "SAPSA_Monto",
    "SAPSA_Porcentaje",
    "GNP_Monto",
    "GNP_Porcentaje",
    "PH_Monto",
    "PH_Porcentaje",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha",
      "Hora",
      "Vuelo",
      "Seccion",
      "Tipo",
      "Matricula",
      "Modelo",
      "Ano",
      "Cliente",
      "Solicitante_1",
      "Horas_de_vuelo",
      "Horas_de_Espera",
      "Percnota",
      "Estatus",
      "Fecha_de_la_factura",
      "Servicios_Terminal_Total",
      "Comisariato_Total",
      "Despacho",
      "TUA_Nacional",
      "TUA_Nacional_Total",
      "TUA_Internacional",
      "TUA_Internacional_Total",
      "IVA_Frontera",
      "IVA_Frontera_Total",
      "IVA_Nacional",
      "IVA_Nacional_Total",
      "SubTotal",
      "Tiempo_de_Vuelo",
      "Tiempo_de_Vuelo_Total",
      "Tiempo_de_Espera",
      "Espera_sin_Cargo",
      "Espera_con_Cargo",
      "Espera_con_Cargo_Total",
      "Pernocta",
      "Pernoctas_Total",
      "IVA_Nacional_Servicios",
      "IVA_Nacional_Servicios_Total",
      "IVA",
      "IVA_Internacional_Total",
      "Cargo_vuelo_int_",
      "Cargo_Vuelo_Int__Total",
      "IVA_vuelo_int_",
      "IVA_Vuelo_Int__Total",
      "SubTotal_1",
      "Servicios_de_Terminal",
      "Comisariato_1",
      "Despacho_1",
      "Margen",
      "Total_a_pagar",
      "SAPSA_Monto",
      "SAPSA_Porcentaje",
      "GNP_Monto",
      "GNP_Porcentaje",
      "PH_Monto",
      "PH_Porcentaje",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_filtro",
      "Hora_filtro",
      "Vuelo_filtro",
      "Seccion_filtro",
      "Tipo_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Ano_filtro",
      "Cliente_filtro",
      "Solicitante_1_filtro",
      "Horas_de_vuelo_filtro",
      "Horas_de_Espera_filtro",
      "Percnota_filtro",
      "Estatus_filtro",
      "Fecha_de_la_factura_filtro",
      "Servicios_Terminal_Total_filtro",
      "Comisariato_Total_filtro",
      "Despacho_filtro",
      "TUA_Nacional_filtro",
      "TUA_Nacional_Total_filtro",
      "TUA_Internacional_filtro",
      "TUA_Internacional_Total_filtro",
      "IVA_Frontera_filtro",
      "IVA_Frontera_Total_filtro",
      "IVA_Nacional_filtro",
      "IVA_Nacional_Total_filtro",
      "SubTotal_filtro",
      "Tiempo_de_Vuelo_filtro",
      "Tiempo_de_Vuelo_Total_filtro",
      "Tiempo_de_Espera_filtro",
      "Espera_sin_Cargo_filtro",
      "Espera_con_Cargo_filtro",
      "Espera_con_Cargo_Total_filtro",
      "Pernocta_filtro",
      "Pernoctas_Total_filtro",
      "IVA_Nacional_Servicios_filtro",
      "IVA_Nacional_Servicios_Total_filtro",
      "IVA_filtro",
      "IVA_Internacional_Total_filtro",
      "Cargo_vuelo_int__filtro",
      "Cargo_Vuelo_Int__Total_filtro",
      "IVA_vuelo_int__filtro",
      "IVA_Vuelo_Int__Total_filtro",
      "SubTotal_1_filtro",
      "Servicios_de_Terminal_filtro",
      "Comisariato_1_filtro",
      "Despacho_1_filtro",
      "Margen_filtro",
      "Total_a_pagar_filtro",
      "SAPSA_Monto_filtro",
      "SAPSA_Porcentaje_filtro",
      "GNP_Monto_filtro",
      "GNP_Porcentaje_filtro",
      "PH_Monto_filtro",
      "PH_Porcentaje_filtro",

    ],
    page: 0,
    MRWhere: "",
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha: null,
      Hora: "",
      Vuelo: "",
      Seccion: "",
      Tipo: "",
      Matricula: "",
      Modelo: "",
      Ano: "",
      Cliente: "",
      Solicitante_1: "",
      Horas_de_vuelo: "",
      Horas_de_Espera: "",
      Percnota: "",
      Estatus: "",
      Fecha_de_la_factura: null,
      Servicios_Terminal_Total: "",
      Comisariato_Total: "",
      Despacho: "",
      TUA_Nacional: "",
      TUA_Nacional_Total: "",
      TUA_Internacional: "",
      TUA_Internacional_Total: "",
      IVA_Frontera: "",
      IVA_Frontera_Total: "",
      IVA_Nacional: "",
      IVA_Nacional_Total: "",
      SubTotal: "",
      Tiempo_de_Vuelo: "",
      Tiempo_de_Vuelo_Total: "",
      Tiempo_de_Espera: "",
      Espera_sin_Cargo: "",
      Espera_con_Cargo: "",
      Espera_con_Cargo_Total: "",
      Pernocta: "",
      Pernoctas_Total: "",
      IVA_Nacional_Servicios: "",
      IVA_Nacional_Servicios_Total: "",
      IVA: "",
      IVA_Internacional_Total: "",
      Cargo_vuelo_int_: "",
      Cargo_Vuelo_Int__Total: "",
      IVA_vuelo_int_: "",
      IVA_Vuelo_Int__Total: "",
      SubTotal_1: "",
      Servicios_de_Terminal: "",
      Comisariato_1: "",
      Despacho_1: "",
      Margen: "",
      Total_a_pagar: "",
      SAPSA_Monto: "",
      SAPSA_Porcentaje: "",
      GNP_Monto: "",
      GNP_Porcentaje: "",
      PH_Monto: "",
      PH_Porcentaje: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha: "",
      toFecha: "",
      fromHora: "",
      toHora: "",
      VueloFilter: "",
      Vuelo: "",
      VueloMultiple: "",
      fromSeccion: "",
      toSeccion: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromAno: "",
      toAno: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      Solicitante_1Filter: "",
      Solicitante_1: "",
      Solicitante_1Multiple: "",
      fromHoras_de_vuelo: "",
      toHoras_de_vuelo: "",
      fromHoras_de_Espera: "",
      toHoras_de_Espera: "",
      fromPercnota: "",
      toPercnota: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromFecha_de_la_factura: "",
      toFecha_de_la_factura: "",
      fromServicios_Terminal_Total: "",
      toServicios_Terminal_Total: "",
      fromComisariato_Total: "",
      toComisariato_Total: "",
      fromDespacho: "",
      toDespacho: "",
      fromTUA_Nacional: "",
      toTUA_Nacional: "",
      fromTUA_Nacional_Total: "",
      toTUA_Nacional_Total: "",
      fromTUA_Internacional: "",
      toTUA_Internacional: "",
      fromTUA_Internacional_Total: "",
      toTUA_Internacional_Total: "",
      fromIVA_Frontera: "",
      toIVA_Frontera: "",
      fromIVA_Frontera_Total: "",
      toIVA_Frontera_Total: "",
      fromIVA_Nacional: "",
      toIVA_Nacional: "",
      fromIVA_Nacional_Total: "",
      toIVA_Nacional_Total: "",
      fromSubTotal: "",
      toSubTotal: "",
      fromTiempo_de_Vuelo: "",
      toTiempo_de_Vuelo: "",
      fromTiempo_de_Vuelo_Total: "",
      toTiempo_de_Vuelo_Total: "",
      fromTiempo_de_Espera: "",
      toTiempo_de_Espera: "",
      fromEspera_sin_Cargo: "",
      toEspera_sin_Cargo: "",
      fromEspera_con_Cargo: "",
      toEspera_con_Cargo: "",
      fromEspera_con_Cargo_Total: "",
      toEspera_con_Cargo_Total: "",
      fromPernocta: "",
      toPernocta: "",
      fromPernoctas_Total: "",
      toPernoctas_Total: "",
      fromIVA_Nacional_Servicios: "",
      toIVA_Nacional_Servicios: "",
      fromIVA_Nacional_Servicios_Total: "",
      toIVA_Nacional_Servicios_Total: "",
      fromIVA: "",
      toIVA: "",
      fromIVA_Internacional_Total: "",
      toIVA_Internacional_Total: "",
      fromCargo_vuelo_int_: "",
      toCargo_vuelo_int_: "",
      fromCargo_Vuelo_Int__Total: "",
      toCargo_Vuelo_Int__Total: "",
      fromIVA_vuelo_int_: "",
      toIVA_vuelo_int_: "",
      fromIVA_Vuelo_Int__Total: "",
      toIVA_Vuelo_Int__Total: "",
      fromSubTotal_1: "",
      toSubTotal_1: "",
      fromServicios_de_Terminal: "",
      toServicios_de_Terminal: "",
      fromComisariato_1: "",
      toComisariato_1: "",
      fromDespacho_1: "",
      toDespacho_1: "",
      fromMargen: "",
      toMargen: "",
      fromTotal_a_pagar: "",
      toTotal_a_pagar: "",
      fromSAPSA_Monto: "",
      toSAPSA_Monto: "",
      fromSAPSA_Porcentaje: "",
      toSAPSA_Porcentaje: "",
      fromGNP_Monto: "",
      toGNP_Monto: "",
      fromGNP_Porcentaje: "",
      toGNP_Porcentaje: "",
      fromPH_Monto: "",
      toPH_Monto: "",
      fromPH_Porcentaje: "",
      toPH_Porcentaje: "",

    }
  };

  dataSource: Facturacion_de_VueloDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Facturacion_de_VueloDataSource;
  dataClipboard: any;

  showPrintButton: boolean = false;
  Phase: any;

  constructor(
    private _Facturacion_de_VueloService: Facturacion_de_VueloService,
    public _dialog: MatDialog,
    private _messages: MessagesHelper,
    private _seguridad: SeguridadService,
    private _translate: TranslateService,
    private _localHelper: LocalStorageHelper,
    public _file: SpartanFileService,
    public dialogo: MatDialog,
    private excelService: ExcelService,
    _user: SpartanUserService,
    private localStorageHelper: LocalStorageHelper,
    private spartanService: SpartanService,
    private route: Router,
    private printHelper: PrintHelper,
    private activateRoute: ActivatedRoute,
    private _SpartanService: SpartanService,
    private renderer: Renderer2,
  ) {

    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);

    const lang = this._localHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

  }

  ngOnInit() {

    this.activateRoute.paramMap.subscribe(
      params => {
        this.Phase = params.get('id');
        if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") != this.Phase) {
          this.localStorageHelper.setItemToLocalStorage("QueryParam", this.Phase);
          this.ngOnInit();
        }
      });

    this.rulesBeforeCreationList();
    this.dataSource = new Facturacion_de_VueloDataSource(
      this._Facturacion_de_VueloService, this._file
    );
    this.init();
    this._seguridad.permisos(AppConstants.Permisos.Facturacion_de_Vuelo).subscribe((response) => {
      this.permisos = response;
    });
  }

  ngAfterViewInit() {
    //this.rulesAfterViewInit();  
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
    //this.rulesAfterViewChecked();
  }

  clearFilter() {
    this.listConfig.page = 0;
    this.listConfig.filter.Folio = "";
    this.listConfig.filter.Fecha = undefined;
    this.listConfig.filter.Hora = "";
    this.listConfig.filter.Vuelo = "";
    this.listConfig.filter.Seccion = "";
    this.listConfig.filter.Tipo = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Ano = "";
    this.listConfig.filter.Cliente = "";
    this.listConfig.filter.Solicitante_1 = "";
    this.listConfig.filter.Horas_de_vuelo = "";
    this.listConfig.filter.Horas_de_Espera = "";
    this.listConfig.filter.Percnota = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Fecha_de_la_factura = undefined;
    this.listConfig.filter.Servicios_Terminal_Total = "";
    this.listConfig.filter.Comisariato_Total = "";
    this.listConfig.filter.Despacho = "";
    this.listConfig.filter.TUA_Nacional = "";
    this.listConfig.filter.TUA_Nacional_Total = "";
    this.listConfig.filter.TUA_Internacional = "";
    this.listConfig.filter.TUA_Internacional_Total = "";
    this.listConfig.filter.IVA_Frontera = "";
    this.listConfig.filter.IVA_Frontera_Total = "";
    this.listConfig.filter.IVA_Nacional = "";
    this.listConfig.filter.IVA_Nacional_Total = "";
    this.listConfig.filter.SubTotal = "";
    this.listConfig.filter.Tiempo_de_Vuelo = "";
    this.listConfig.filter.Tiempo_de_Vuelo_Total = "";
    this.listConfig.filter.Tiempo_de_Espera = "";
    this.listConfig.filter.Espera_sin_Cargo = "";
    this.listConfig.filter.Espera_con_Cargo = "";
    this.listConfig.filter.Espera_con_Cargo_Total = "";
    this.listConfig.filter.Pernocta = "";
    this.listConfig.filter.Pernoctas_Total = "";
    this.listConfig.filter.IVA_Nacional_Servicios = "";
    this.listConfig.filter.IVA_Nacional_Servicios_Total = "";
    this.listConfig.filter.IVA = "";
    this.listConfig.filter.IVA_Internacional_Total = "";
    this.listConfig.filter.Cargo_vuelo_int_ = "";
    this.listConfig.filter.Cargo_Vuelo_Int__Total = "";
    this.listConfig.filter.IVA_vuelo_int_ = "";
    this.listConfig.filter.IVA_Vuelo_Int__Total = "";
    this.listConfig.filter.SubTotal_1 = "";
    this.listConfig.filter.Servicios_de_Terminal = "";
    this.listConfig.filter.Comisariato_1 = "";
    this.listConfig.filter.Despacho_1 = "";
    this.listConfig.filter.Margen = "";
    this.listConfig.filter.Total_a_pagar = "";
    this.listConfig.filter.SAPSA_Monto = "";
    this.listConfig.filter.SAPSA_Porcentaje = "";
    this.listConfig.filter.GNP_Monto = "";
    this.listConfig.filter.GNP_Porcentaje = "";
    this.listConfig.filter.PH_Monto = "";
    this.listConfig.filter.PH_Porcentaje = "";

    this.listConfig.page = 0;
    this.loadData();
  }

  refresh() {
    this.listConfig.page = 0;
    this.loadData();
  }

  rulesBeforeCreationList() {
    //rulesBeforeCreationList_ExecuteBusinessRulesInit

    //INICIA - BRID:7148 - WF:10 Rule List - Phase: 1 (Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 1) {
      this.brf.SetFilteronList(this.listConfig, ` Facturacion_de_Vuelo.Estatus IN (1,2,4) `);
    }
    //TERMINA - BRID:7148


    //INICIA - BRID:7150 - WF:10 Rule List - Phase: 2 (No Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 2) {
      this.brf.SetFilteronList(this.listConfig, ` Facturacion_de_Vuelo.Estatus = 5`);

      //this.listConfig.filter.Estatus = "Cancelado"
    }
    //TERMINA - BRID:7150


  }


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

  remove(row: Facturacion_de_Vuelo) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Facturacion_de_VueloService
          .delete(row.Folio)
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
  async ActionPrint(dataRow: Facturacion_de_Vuelo) {

    this.localStorageHelper.setItemToLocalStorage("FolioPrint", dataRow.Folio.toString());

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
      , 'Fecha'
      , 'Hora'
      , 'Vuelo'
      , 'Sección'
      , 'Tipo'
      , 'Matricula'
      , 'Modelo'
      , 'Año'
      , 'Cliente'
      , 'Solicitante'
      , 'Horas de vuelo'
      , 'Horas de Espera'
      , 'Pernocta'
      , 'Estatus'
      , 'Servicios Terminal Total'
      , 'Comisariato Total'
      , 'Despacho'
      , 'TUA Nacional'
      , 'TUA Nacional Total'
      , 'TUA Internacional'
      , 'TUA Internacional Total'
      , 'IVA Frontera'
      , 'IVA Frontera Total'
      , 'IVA Nacional'
      , 'IVA Nacional Total'
      , 'Total Serv. Ext.'
      , 'Tiempo de Vuelo'
      , 'Tiempo de Vuelo Total'
      , 'Tiempo de Espera'
      , 'Espera sin Cargo'
      , 'Espera con Cargo'
      , 'Espera con Cargo Total'
      , 'Pernoctas'
      , 'Pernoctas Total'
      , 'IVA Nacional Servicios'
      , 'IVA Nacional Servicios Total'
      , 'IVA'
      , 'IVA Internacional Total'
      , 'Cargo vuelo int.'
      , 'Cargo Vuelo Int. Total'
      , 'IVA vuelo int.'
      , 'IVA Vuelo Int. Total'
      , 'Total Serv. Vuelo'
      , 'Servicios de Terminal'
      , 'Comisariato'
      , 'Margen'
      , 'Total a pagar'
      , 'SAPSA Monto'
      , 'SAPSA %'
      , 'GNP Monto'
      , 'GNP %'
      , 'PH Monto'
      , 'PH %'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.Fecha
        , x.Hora
        , x.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
        , x.Seccion
        , x.Tipo
        , x.Matricula_Aeronave.Matricula
        , x.Modelo_Modelos.Descripcion
        , x.Ano
        , x.Cliente_Cliente.Razon_Social
        , x.Solicitante_1_Spartan_User.Name
        , x.Horas_de_vuelo
        , x.Horas_de_Espera
        , x.Percnota
        , x.Estatus_Estatus_de_facturacion_de_vuelo.Estatus
        , x.Fecha_de_la_factura
        , x.Servicios_Terminal_Total
        , x.Comisariato_Total
        , x.Despacho
        , x.TUA_Nacional
        , x.TUA_Nacional_Total
        , x.TUA_Internacional
        , x.TUA_Internacional_Total
        , x.IVA_Frontera
        , x.IVA_Frontera_Total
        , x.IVA_Nacional
        , x.IVA_Nacional_Total
        , x.SubTotal
        , x.Tiempo_de_Vuelo
        , x.Tiempo_de_Vuelo_Total
        , x.Tiempo_de_Espera
        , x.Espera_sin_Cargo
        , x.Espera_con_Cargo
        , x.Espera_con_Cargo_Total
        , x.Pernocta
        , x.Pernoctas_Total
        , x.IVA_Nacional_Servicios
        , x.IVA_Nacional_Servicios_Total
        , x.IVA_Internacional_Total
        , x.Cargo_vuelo_int_
        , x.Cargo_Vuelo_Int__Total
        , x.IVA_vuelo_int_
        , x.IVA_Vuelo_Int__Total
        , x.SubTotal_1
        , x.Servicios_de_Terminal
        , x.Comisariato_1
        , x.Despacho_1
        , x.Margen
        , x.Total_a_pagar
        , x.SAPSA_Monto
        , x.SAPSA_Porcentaje
        , x.GNP_Monto
        , x.GNP_Porcentaje
        , x.PH_Monto
        , x.PH_Porcentaje

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
    pdfMake.createPdf(pdfDefinition).download('Facturacion_de_Vuelo.pdf');
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
          this._Facturacion_de_VueloService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Facturacion_de_Vuelos;
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
          this._Facturacion_de_VueloService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Facturacion_de_Vuelos;
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
        'Folio': fields.Folio,
        'Fecha': fields.Fecha ? momentJS(fields.Fecha).format('DD/MM/YYYY') : '',
        'Hora': fields.Hora,
        'Vuelo': fields.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Sección': fields.Seccion,
        'Tipo': fields.Tipo,
        'Matricula': fields.Matricula_Aeronave.Matricula,
        'Modelo': fields.Modelo_Modelos.Descripcion,
        'Año': fields.Ano,
        'Cliente': fields.Cliente_Cliente.Razon_Social,
        'Solicitante': fields.Solicitante_1_Spartan_User.Name,
        'Horas de vuelo': fields.Horas_de_vuelo,
        'Horas de Espera': fields.Horas_de_Espera,
        'Pernocta': fields.Percnota,
        'Estatus': fields.Estatus_Estatus_de_facturacion_de_vuelo.Estatus,
        'Fecha ': fields.Fecha_de_la_factura ? momentJS(fields.Fecha_de_la_factura).format('DD/MM/YYYY') : '',
        'Servicios Terminal Total': fields.Servicios_Terminal_Total,
        'Comisariato Total': fields.Comisariato_Total,
        'Despacho': fields.Despacho,
        'TUA Nacional': fields.TUA_Nacional,
        'TUA Nacional Total': fields.TUA_Nacional_Total,
        'TUA Internacional': fields.TUA_Internacional,
        'TUA Internacional Total': fields.TUA_Internacional_Total,
        'IVA Frontera': fields.IVA_Frontera,
        'IVA Frontera Total': fields.IVA_Frontera_Total,
        'IVA Nacional': fields.IVA_Nacional,
        'IVA Nacional Total': fields.IVA_Nacional_Total,
        'Total Serv. Ext.': fields.SubTotal,
        'Tiempo de Vuelo': fields.Tiempo_de_Vuelo,
        'Tiempo de Vuelo Total': fields.Tiempo_de_Vuelo_Total,
        'Tiempo de Espera': fields.Tiempo_de_Espera,
        'Espera sin Cargo': fields.Espera_sin_Cargo,
        'Espera con Cargo': fields.Espera_con_Cargo,
        'Espera con Cargo Total': fields.Espera_con_Cargo_Total,
        'Pernoctas': fields.Pernocta,
        'Pernoctas Total': fields.Pernoctas_Total,
        'IVA Nacional Servicios': fields.IVA_Nacional_Servicios,
        'IVA Nacional Servicios Total': fields.IVA_Nacional_Servicios_Total,
        'IVA': fields.IVA,
        'IVA Internacional Total': fields.IVA_Internacional_Total,
        'Cargo vuelo int.': fields.Cargo_vuelo_int_,
        'Cargo Vuelo Int. Total': fields.Cargo_Vuelo_Int__Total,
        'IVA vuelo int.': fields.IVA_vuelo_int_,
        'IVA Vuelo Int. Total': fields.IVA_Vuelo_Int__Total,
        'Total Serv. Vuelo': fields.SubTotal_1,
        'Servicios de Terminal': fields.Servicios_de_Terminal,
        'Comisariato': fields.Comisariato_1,
        'Despacho ': fields.Despacho_1,
        'Margen': fields.Margen,
        'Total a pagar': fields.Total_a_pagar,
        'SAPSA Monto': fields.SAPSA_Monto,
        'SAPSA %': fields.SAPSA_Porcentaje,
        'GNP Monto': fields.GNP_Monto,
        'GNP %': fields.GNP_Porcentaje,
        'PH Monto': fields.PH_Monto,
        'PH %': fields.PH_Porcentaje,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Facturacion_de_Vuelo  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Fecha: x.Fecha,
      Hora: x.Hora,
      Vuelo: x.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Seccion: x.Seccion,
      Tipo: x.Tipo,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      Ano: x.Ano,
      Cliente: x.Cliente_Cliente.Razon_Social,
      Solicitante_1: x.Solicitante_1_Spartan_User.Name,
      Horas_de_vuelo: x.Horas_de_vuelo,
      Horas_de_Espera: x.Horas_de_Espera,
      Percnota: x.Percnota,
      Estatus: x.Estatus_Estatus_de_facturacion_de_vuelo.Estatus,
      Fecha_de_la_factura: x.Fecha_de_la_factura,
      Servicios_Terminal_Total: x.Servicios_Terminal_Total,
      Comisariato_Total: x.Comisariato_Total,
      Despacho: x.Despacho,
      TUA_Nacional: x.TUA_Nacional,
      TUA_Nacional_Total: x.TUA_Nacional_Total,
      TUA_Internacional: x.TUA_Internacional,
      TUA_Internacional_Total: x.TUA_Internacional_Total,
      IVA_Frontera: x.IVA_Frontera,
      IVA_Frontera_Total: x.IVA_Frontera_Total,
      IVA_Nacional: x.IVA_Nacional,
      IVA_Nacional_Total: x.IVA_Nacional_Total,
      SubTotal: x.SubTotal,
      Tiempo_de_Vuelo: x.Tiempo_de_Vuelo,
      Tiempo_de_Vuelo_Total: x.Tiempo_de_Vuelo_Total,
      Tiempo_de_Espera: x.Tiempo_de_Espera,
      Espera_sin_Cargo: x.Espera_sin_Cargo,
      Espera_con_Cargo: x.Espera_con_Cargo,
      Espera_con_Cargo_Total: x.Espera_con_Cargo_Total,
      Pernocta: x.Pernocta,
      Pernoctas_Total: x.Pernoctas_Total,
      IVA_Nacional_Servicios: x.IVA_Nacional_Servicios,
      IVA_Nacional_Servicios_Total: x.IVA_Nacional_Servicios_Total,
      IVA: x.IVA,
      IVA_Internacional_Total: x.IVA_Internacional_Total,
      Cargo_vuelo_int_: x.Cargo_vuelo_int_,
      Cargo_Vuelo_Int__Total: x.Cargo_Vuelo_Int__Total,
      IVA_vuelo_int_: x.IVA_vuelo_int_,
      IVA_Vuelo_Int__Total: x.IVA_Vuelo_Int__Total,
      SubTotal_1: x.SubTotal_1,
      Servicios_de_Terminal: x.Servicios_de_Terminal,
      Comisariato_1: x.Comisariato_1,
      Despacho_1: x.Despacho_1,
      Margen: x.Margen,
      Total_a_pagar: x.Total_a_pagar,
      SAPSA_Monto: x.SAPSA_Monto,
      SAPSA_Porcentaje: x.SAPSA_Porcentaje,
      GNP_Monto: x.GNP_Monto,
      GNP_Porcentaje: x.GNP_Porcentaje,
      PH_Monto: x.PH_Monto,
      PH_Porcentaje: x.PH_Porcentaje,

    }));

    this.excelService.exportToCsv(result, 'Facturacion_de_Vuelo', ['Folio', 'Fecha', 'Hora', 'Vuelo', 'Seccion', 'Tipo', 'Matricula', 'Modelo', 'Ano', 'Cliente', 'Solicitante_1', 'Horas_de_vuelo', 'Horas_de_Espera', 'Percnota', 'Estatus', 'Fecha_de_la_factura', 'Servicios_Terminal_Total', 'Comisariato_Total', 'Despacho', 'TUA_Nacional', 'TUA_Nacional_Total', 'TUA_Internacional', 'TUA_Internacional_Total', 'IVA_Frontera', 'IVA_Frontera_Total', 'IVA_Nacional', 'IVA_Nacional_Total', 'SubTotal', 'Tiempo_de_Vuelo', 'Tiempo_de_Vuelo_Total', 'Tiempo_de_Espera', 'Espera_sin_Cargo', 'Espera_con_Cargo', 'Espera_con_Cargo_Total', 'Pernocta', 'Pernoctas_Total', 'IVA_Nacional_Servicios', 'IVA_Nacional_Servicios_Total', 'IVA', 'IVA_Internacional_Total', 'Cargo_vuelo_int_', 'Cargo_Vuelo_Int__Total', 'IVA_vuelo_int_', 'IVA_Vuelo_Int__Total', 'SubTotal_1', 'Servicios_de_Terminal', 'Comisariato_1', 'Despacho_1', 'Margen', 'Total_a_pagar', 'SAPSA_Monto', 'SAPSA_Porcentaje', 'GNP_Monto', 'GNP_Porcentaje', 'PH_Monto', 'PH_Porcentaje']);
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
    template += '          <th>Fecha</th>';
    template += '          <th>Hora</th>';
    template += '          <th>Vuelo</th>';
    template += '          <th>Sección</th>';
    template += '          <th>Tipo</th>';
    template += '          <th>Matricula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Año</th>';
    template += '          <th>Cliente</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Horas de vuelo</th>';
    template += '          <th>Horas de Espera</th>';
    template += '          <th>Pernocta</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Servicios Terminal Total</th>';
    template += '          <th>Comisariato Total</th>';
    template += '          <th>Despacho</th>';
    template += '          <th>TUA Nacional</th>';
    template += '          <th>TUA Nacional Total</th>';
    template += '          <th>TUA Internacional</th>';
    template += '          <th>TUA Internacional Total</th>';
    template += '          <th>IVA Frontera</th>';
    template += '          <th>IVA Frontera Total</th>';
    template += '          <th>IVA Nacional</th>';
    template += '          <th>IVA Nacional Total</th>';
    template += '          <th>Total Serv. Ext.</th>';
    template += '          <th>Tiempo de Vuelo</th>';
    template += '          <th>Tiempo de Vuelo Total</th>';
    template += '          <th>Tiempo de Espera</th>';
    template += '          <th>Espera sin Cargo</th>';
    template += '          <th>Espera con Cargo</th>';
    template += '          <th>Espera con Cargo Total</th>';
    template += '          <th>Pernoctas</th>';
    template += '          <th>Pernoctas Total</th>';
    template += '          <th>IVA Nacional Servicios</th>';
    template += '          <th>IVA Nacional Servicios Total</th>';
    template += '          <th>IVA</th>';
    template += '          <th>IVA Internacional Total</th>';
    template += '          <th>Cargo vuelo int.</th>';
    template += '          <th>Cargo Vuelo Int. Total</th>';
    template += '          <th>IVA vuelo int.</th>';
    template += '          <th>IVA Vuelo Int. Total</th>';
    template += '          <th>Total Serv. Vuelo</th>';
    template += '          <th>Servicios de Terminal</th>';
    template += '          <th>Comisariato</th>';
    template += '          <th>Margen</th>';
    template += '          <th>Total a pagar</th>';
    template += '          <th>SAPSA Monto</th>';
    template += '          <th>SAPSA %</th>';
    template += '          <th>GNP Monto</th>';
    template += '          <th>GNP %</th>';
    template += '          <th>PH Monto</th>';
    template += '          <th>PH %</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Fecha + '</td>';
      template += '          <td>' + element.Hora + '</td>';
      template += '          <td>' + element.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Seccion + '</td>';
      template += '          <td>' + element.Tipo + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Ano + '</td>';
      template += '          <td>' + element.Cliente_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Solicitante_1_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Horas_de_vuelo + '</td>';
      template += '          <td>' + element.Horas_de_Espera + '</td>';
      template += '          <td>' + element.Percnota + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_facturacion_de_vuelo.Estatus + '</td>';
      template += '          <td>' + element.Fecha_de_la_factura + '</td>';
      template += '          <td>' + element.Servicios_Terminal_Total + '</td>';
      template += '          <td>' + element.Comisariato_Total + '</td>';
      template += '          <td>' + element.Despacho + '</td>';
      template += '          <td>' + element.TUA_Nacional + '</td>';
      template += '          <td>' + element.TUA_Nacional_Total + '</td>';
      template += '          <td>' + element.TUA_Internacional + '</td>';
      template += '          <td>' + element.TUA_Internacional_Total + '</td>';
      template += '          <td>' + element.IVA_Frontera + '</td>';
      template += '          <td>' + element.IVA_Frontera_Total + '</td>';
      template += '          <td>' + element.IVA_Nacional + '</td>';
      template += '          <td>' + element.IVA_Nacional_Total + '</td>';
      template += '          <td>' + element.SubTotal + '</td>';
      template += '          <td>' + element.Tiempo_de_Vuelo + '</td>';
      template += '          <td>' + element.Tiempo_de_Vuelo_Total + '</td>';
      template += '          <td>' + element.Tiempo_de_Espera + '</td>';
      template += '          <td>' + element.Espera_sin_Cargo + '</td>';
      template += '          <td>' + element.Espera_con_Cargo + '</td>';
      template += '          <td>' + element.Espera_con_Cargo_Total + '</td>';
      template += '          <td>' + element.Pernocta + '</td>';
      template += '          <td>' + element.Pernoctas_Total + '</td>';
      template += '          <td>' + element.IVA_Nacional_Servicios + '</td>';
      template += '          <td>' + element.IVA_Nacional_Servicios_Total + '</td>';
      template += '          <td>' + element.IVA + '</td>';
      template += '          <td>' + element.IVA_Internacional_Total + '</td>';
      template += '          <td>' + element.Cargo_vuelo_int_ + '</td>';
      template += '          <td>' + element.Cargo_Vuelo_Int__Total + '</td>';
      template += '          <td>' + element.IVA_vuelo_int_ + '</td>';
      template += '          <td>' + element.IVA_Vuelo_Int__Total + '</td>';
      template += '          <td>' + element.SubTotal_1 + '</td>';
      template += '          <td>' + element.Servicios_de_Terminal + '</td>';
      template += '          <td>' + element.Comisariato_1 + '</td>';
      template += '          <td>' + element.Despacho_1 + '</td>';
      template += '          <td>' + element.Margen + '</td>';
      template += '          <td>' + element.Total_a_pagar + '</td>';
      template += '          <td>' + element.SAPSA_Monto + '</td>';
      template += '          <td>' + element.SAPSA_Porcentaje + '</td>';
      template += '          <td>' + element.GNP_Monto + '</td>';
      template += '          <td>' + element.GNP_Porcentaje + '</td>';
      template += '          <td>' + element.PH_Monto + '</td>';
      template += '          <td>' + element.PH_Porcentaje + '</td>';

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
    template += '\t Fecha';
    template += '\t Hora';
    template += '\t Vuelo';
    template += '\t Sección';
    template += '\t Tipo';
    template += '\t Matricula';
    template += '\t Modelo';
    template += '\t Año';
    template += '\t Cliente';
    template += '\t Solicitante';
    template += '\t Horas de vuelo';
    template += '\t Horas de Espera';
    template += '\t Pernocta';
    template += '\t Estatus';
    template += '\t Servicios Terminal Total';
    template += '\t Comisariato Total';
    template += '\t Despacho';
    template += '\t TUA Nacional';
    template += '\t TUA Nacional Total';
    template += '\t TUA Internacional';
    template += '\t TUA Internacional Total';
    template += '\t IVA Frontera';
    template += '\t IVA Frontera Total';
    template += '\t IVA Nacional';
    template += '\t IVA Nacional Total';
    template += '\t Total Serv. Ext.';
    template += '\t Tiempo de Vuelo';
    template += '\t Tiempo de Vuelo Total';
    template += '\t Tiempo de Espera';
    template += '\t Espera sin Cargo';
    template += '\t Espera con Cargo';
    template += '\t Espera con Cargo Total';
    template += '\t Pernoctas';
    template += '\t Pernoctas Total';
    template += '\t IVA Nacional Servicios';
    template += '\t IVA Nacional Servicios Total';
    template += '\t IVA';
    template += '\t IVA Internacional Total';
    template += '\t Cargo vuelo int.';
    template += '\t Cargo Vuelo Int. Total';
    template += '\t IVA vuelo int.';
    template += '\t IVA Vuelo Int. Total';
    template += '\t Total Serv. Vuelo';
    template += '\t Servicios de Terminal';
    template += '\t Comisariato';
    template += '\t Margen';
    template += '\t Total a pagar';
    template += '\t SAPSA Monto';
    template += '\t SAPSA %';
    template += '\t GNP Monto';
    template += '\t GNP %';
    template += '\t PH Monto';
    template += '\t PH %';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.Fecha;
      template += '\t ' + element.Hora;
      template += '\t ' + element.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Seccion;
      template += '\t ' + element.Tipo;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.Ano;
      template += '\t ' + element.Cliente_Cliente.Razon_Social;
      template += '\t ' + element.Solicitante_1_Spartan_User.Name;
      template += '\t ' + element.Horas_de_vuelo;
      template += '\t ' + element.Horas_de_Espera;
      template += '\t ' + element.Percnota;
      template += '\t ' + element.Estatus_Estatus_de_facturacion_de_vuelo.Estatus;
      template += '\t ' + element.Fecha_de_la_factura;
      template += '\t ' + element.Servicios_Terminal_Total;
      template += '\t ' + element.Comisariato_Total;
      template += '\t ' + element.Despacho;
      template += '\t ' + element.TUA_Nacional;
      template += '\t ' + element.TUA_Nacional_Total;
      template += '\t ' + element.TUA_Internacional;
      template += '\t ' + element.TUA_Internacional_Total;
      template += '\t ' + element.IVA_Frontera;
      template += '\t ' + element.IVA_Frontera_Total;
      template += '\t ' + element.IVA_Nacional;
      template += '\t ' + element.IVA_Nacional_Total;
      template += '\t ' + element.SubTotal;
      template += '\t ' + element.Tiempo_de_Vuelo;
      template += '\t ' + element.Tiempo_de_Vuelo_Total;
      template += '\t ' + element.Tiempo_de_Espera;
      template += '\t ' + element.Espera_sin_Cargo;
      template += '\t ' + element.Espera_con_Cargo;
      template += '\t ' + element.Espera_con_Cargo_Total;
      template += '\t ' + element.Pernocta;
      template += '\t ' + element.Pernoctas_Total;
      template += '\t ' + element.IVA_Nacional_Servicios;
      template += '\t ' + element.IVA_Nacional_Servicios_Total;
      template += '\t ' + element.IVA;
      template += '\t ' + element.IVA_Internacional_Total;
      template += '\t ' + element.Cargo_vuelo_int_;
      template += '\t ' + element.Cargo_Vuelo_Int__Total;
      template += '\t ' + element.IVA_vuelo_int_;
      template += '\t ' + element.IVA_Vuelo_Int__Total;
      template += '\t ' + element.SubTotal_1;
      template += '\t ' + element.Servicios_de_Terminal;
      template += '\t ' + element.Comisariato_1;
      template += '\t ' + element.Despacho_1;
      template += '\t ' + element.Margen;
      template += '\t ' + element.Total_a_pagar;
      template += '\t ' + element.SAPSA_Monto;
      template += '\t ' + element.SAPSA_Porcentaje;
      template += '\t ' + element.GNP_Monto;
      template += '\t ' + element.GNP_Porcentaje;
      template += '\t ' + element.PH_Monto;
      template += '\t ' + element.PH_Porcentaje;

      template += '\n';
    });

    return template;
  }

}

export class Facturacion_de_VueloDataSource implements DataSource<Facturacion_de_Vuelo>
{
  private subject = new BehaviorSubject<Facturacion_de_Vuelo[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Facturacion_de_VueloService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Facturacion_de_Vuelo[]> {
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
              const longest = result.Facturacion_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Facturacion_de_Vuelos);
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
      condition += " and Facturacion_de_Vuelo.Folio = " + data.filter.Folio;
    if (data.filter.Fecha)
      condition += " and CONVERT(VARCHAR(10), Facturacion_de_Vuelo.Fecha, 102)  = '" + moment(data.filter.Fecha).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora != "")
      condition += " and Facturacion_de_Vuelo.Hora = '" + data.filter.Hora + "'";
    if (data.filter.Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Vuelo + "%' ";
    if (data.filter.Seccion != "")
      condition += " and Facturacion_de_Vuelo.Seccion = " + data.filter.Seccion;
    if (data.filter.Tipo != "")
      condition += " and Facturacion_de_Vuelo.Tipo like '%" + data.filter.Tipo + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Ano != "")
      condition += " and Facturacion_de_Vuelo.Ano = " + data.filter.Ano;
    if (data.filter.Cliente != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Cliente + "%' ";
    if (data.filter.Solicitante_1 != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante_1 + "%' ";
    if (data.filter.Horas_de_vuelo != "")
      condition += " and Facturacion_de_Vuelo.Horas_de_vuelo = " + data.filter.Horas_de_vuelo;
    if (data.filter.Horas_de_Espera != "")
      condition += " and Facturacion_de_Vuelo.Horas_de_Espera = " + data.filter.Horas_de_Espera;
    if (data.filter.Percnota != "")
      condition += " and Facturacion_de_Vuelo.Percnota = " + data.filter.Percnota;
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_facturacion_de_vuelo.Estatus like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Fecha_de_la_factura)
      condition += " and CONVERT(VARCHAR(10), Facturacion_de_Vuelo.Fecha_de_la_factura, 102)  = '" + moment(data.filter.Fecha_de_la_factura).format("YYYY.MM.DD") + "'";
    if (data.filter.Servicios_Terminal_Total != "")
      condition += " and Facturacion_de_Vuelo.Servicios_Terminal_Total = " + data.filter.Servicios_Terminal_Total;
    if (data.filter.Comisariato_Total != "")
      condition += " and Facturacion_de_Vuelo.Comisariato_Total = " + data.filter.Comisariato_Total;
    if (data.filter.Despacho != "")
      condition += " and Facturacion_de_Vuelo.Despacho = " + data.filter.Despacho;
    if (data.filter.TUA_Nacional != "")
      condition += " and Facturacion_de_Vuelo.TUA_Nacional = " + data.filter.TUA_Nacional;
    if (data.filter.TUA_Nacional_Total != "")
      condition += " and Facturacion_de_Vuelo.TUA_Nacional_Total = " + data.filter.TUA_Nacional_Total;
    if (data.filter.TUA_Internacional != "")
      condition += " and Facturacion_de_Vuelo.TUA_Internacional = " + data.filter.TUA_Internacional;
    if (data.filter.TUA_Internacional_Total != "")
      condition += " and Facturacion_de_Vuelo.TUA_Internacional_Total = " + data.filter.TUA_Internacional_Total;
    if (data.filter.IVA_Frontera != "")
      condition += " and Facturacion_de_Vuelo.IVA_Frontera = " + data.filter.IVA_Frontera;
    if (data.filter.IVA_Frontera_Total != "")
      condition += " and Facturacion_de_Vuelo.IVA_Frontera_Total = " + data.filter.IVA_Frontera_Total;
    if (data.filter.IVA_Nacional != "")
      condition += " and Facturacion_de_Vuelo.IVA_Nacional = " + data.filter.IVA_Nacional;
    if (data.filter.IVA_Nacional_Total != "")
      condition += " and Facturacion_de_Vuelo.IVA_Nacional_Total = " + data.filter.IVA_Nacional_Total;
    if (data.filter.SubTotal != "")
      condition += " and Facturacion_de_Vuelo.SubTotal = " + data.filter.SubTotal;
    if (data.filter.Tiempo_de_Vuelo != "")
      condition += " and Facturacion_de_Vuelo.Tiempo_de_Vuelo = '" + data.filter.Tiempo_de_Vuelo + "'";
    if (data.filter.Tiempo_de_Vuelo_Total != "")
      condition += " and Facturacion_de_Vuelo.Tiempo_de_Vuelo_Total = " + data.filter.Tiempo_de_Vuelo_Total;
    if (data.filter.Tiempo_de_Espera != "")
      condition += " and Facturacion_de_Vuelo.Tiempo_de_Espera = '" + data.filter.Tiempo_de_Espera + "'";
    if (data.filter.Espera_sin_Cargo != "")
      condition += " and Facturacion_de_Vuelo.Espera_sin_Cargo = '" + data.filter.Espera_sin_Cargo + "'";
    if (data.filter.Espera_con_Cargo != "")
      condition += " and Facturacion_de_Vuelo.Espera_con_Cargo = '" + data.filter.Espera_con_Cargo + "'";
    if (data.filter.Espera_con_Cargo_Total != "")
      condition += " and Facturacion_de_Vuelo.Espera_con_Cargo_Total = " + data.filter.Espera_con_Cargo_Total;
    if (data.filter.Pernocta != "")
      condition += " and Facturacion_de_Vuelo.Pernocta = " + data.filter.Pernocta;
    if (data.filter.Pernoctas_Total != "")
      condition += " and Facturacion_de_Vuelo.Pernoctas_Total = " + data.filter.Pernoctas_Total;
    if (data.filter.IVA_Nacional_Servicios != "")
      condition += " and Facturacion_de_Vuelo.IVA_Nacional_Servicios = " + data.filter.IVA_Nacional_Servicios;
    if (data.filter.IVA_Nacional_Servicios_Total != "")
      condition += " and Facturacion_de_Vuelo.IVA_Nacional_Servicios_Total = " + data.filter.IVA_Nacional_Servicios_Total;
    if (data.filter.IVA != "")
      condition += " and Facturacion_de_Vuelo.IVA = " + data.filter.IVA;
    if (data.filter.IVA_Internacional_Total != "")
      condition += " and Facturacion_de_Vuelo.IVA_Internacional_Total = " + data.filter.IVA_Internacional_Total;
    if (data.filter.Cargo_vuelo_int_ != "")
      condition += " and Facturacion_de_Vuelo.Cargo_vuelo_int_ = " + data.filter.Cargo_vuelo_int_;
    if (data.filter.Cargo_Vuelo_Int__Total != "")
      condition += " and Facturacion_de_Vuelo.Cargo_Vuelo_Int__Total = " + data.filter.Cargo_Vuelo_Int__Total;
    if (data.filter.IVA_vuelo_int_ != "")
      condition += " and Facturacion_de_Vuelo.IVA_vuelo_int_ = " + data.filter.IVA_vuelo_int_;
    if (data.filter.IVA_Vuelo_Int__Total != "")
      condition += " and Facturacion_de_Vuelo.IVA_Vuelo_Int__Total = " + data.filter.IVA_Vuelo_Int__Total;
    if (data.filter.SubTotal_1 != "")
      condition += " and Facturacion_de_Vuelo.SubTotal_1 = " + data.filter.SubTotal_1;
    if (data.filter.Servicios_de_Terminal != "")
      condition += " and Facturacion_de_Vuelo.Servicios_de_Terminal = " + data.filter.Servicios_de_Terminal;
    if (data.filter.Comisariato_1 != "")
      condition += " and Facturacion_de_Vuelo.Comisariato_1 = " + data.filter.Comisariato_1;
    if (data.filter.Despacho_1 != "")
      condition += " and Facturacion_de_Vuelo.Despacho_1 = " + data.filter.Despacho_1;
    if (data.filter.Margen != "")
      condition += " and Facturacion_de_Vuelo.Margen = " + data.filter.Margen;
    if (data.filter.Total_a_pagar != "")
      condition += " and Facturacion_de_Vuelo.Total_a_pagar = " + data.filter.Total_a_pagar;
    if (data.filter.SAPSA_Monto != "")
      condition += " and Facturacion_de_Vuelo.SAPSA_Monto = " + data.filter.SAPSA_Monto;
    if (data.filter.SAPSA_Porcentaje != "")
      condition += " and Facturacion_de_Vuelo.SAPSA_Porcentaje = " + data.filter.SAPSA_Porcentaje;
    if (data.filter.GNP_Monto != "")
      condition += " and Facturacion_de_Vuelo.GNP_Monto = " + data.filter.GNP_Monto;
    if (data.filter.GNP_Porcentaje != "")
      condition += " and Facturacion_de_Vuelo.GNP_Porcentaje = " + data.filter.GNP_Porcentaje;
    if (data.filter.PH_Monto != "")
      condition += " and Facturacion_de_Vuelo.PH_Monto = " + data.filter.PH_Monto;
    if (data.filter.PH_Porcentaje != "")
      condition += " and Facturacion_de_Vuelo.PH_Porcentaje = " + data.filter.PH_Porcentaje;

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
        sort = " Facturacion_de_Vuelo.Folio " + data.sortDirecction;
        break;
      case "Fecha":
        sort = " Facturacion_de_Vuelo.Fecha " + data.sortDirecction;
        break;
      case "Hora":
        sort = " Facturacion_de_Vuelo.Hora " + data.sortDirecction;
        break;
      case "Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Seccion":
        sort = " Facturacion_de_Vuelo.Seccion " + data.sortDirecction;
        break;
      case "Tipo":
        sort = " Facturacion_de_Vuelo.Tipo " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Ano":
        sort = " Facturacion_de_Vuelo.Ano " + data.sortDirecction;
        break;
      case "Cliente":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Solicitante_1":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Horas_de_vuelo":
        sort = " Facturacion_de_Vuelo.Horas_de_vuelo " + data.sortDirecction;
        break;
      case "Horas_de_Espera":
        sort = " Facturacion_de_Vuelo.Horas_de_Espera " + data.sortDirecction;
        break;
      case "Percnota":
        sort = " Facturacion_de_Vuelo.Percnota " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_facturacion_de_vuelo.Estatus " + data.sortDirecction;
        break;
      case "Fecha_de_la_factura":
        sort = " Facturacion_de_Vuelo.Fecha_de_la_factura " + data.sortDirecction;
        break;
      case "Servicios_Terminal_Total":
        sort = " Facturacion_de_Vuelo.Servicios_Terminal_Total " + data.sortDirecction;
        break;
      case "Comisariato_Total":
        sort = " Facturacion_de_Vuelo.Comisariato_Total " + data.sortDirecction;
        break;
      case "Despacho":
        sort = " Facturacion_de_Vuelo.Despacho " + data.sortDirecction;
        break;
      case "TUA_Nacional":
        sort = " Facturacion_de_Vuelo.TUA_Nacional " + data.sortDirecction;
        break;
      case "TUA_Nacional_Total":
        sort = " Facturacion_de_Vuelo.TUA_Nacional_Total " + data.sortDirecction;
        break;
      case "TUA_Internacional":
        sort = " Facturacion_de_Vuelo.TUA_Internacional " + data.sortDirecction;
        break;
      case "TUA_Internacional_Total":
        sort = " Facturacion_de_Vuelo.TUA_Internacional_Total " + data.sortDirecction;
        break;
      case "IVA_Frontera":
        sort = " Facturacion_de_Vuelo.IVA_Frontera " + data.sortDirecction;
        break;
      case "IVA_Frontera_Total":
        sort = " Facturacion_de_Vuelo.IVA_Frontera_Total " + data.sortDirecction;
        break;
      case "IVA_Nacional":
        sort = " Facturacion_de_Vuelo.IVA_Nacional " + data.sortDirecction;
        break;
      case "IVA_Nacional_Total":
        sort = " Facturacion_de_Vuelo.IVA_Nacional_Total " + data.sortDirecction;
        break;
      case "SubTotal":
        sort = " Facturacion_de_Vuelo.SubTotal " + data.sortDirecction;
        break;
      case "Tiempo_de_Vuelo":
        sort = " Facturacion_de_Vuelo.Tiempo_de_Vuelo " + data.sortDirecction;
        break;
      case "Tiempo_de_Vuelo_Total":
        sort = " Facturacion_de_Vuelo.Tiempo_de_Vuelo_Total " + data.sortDirecction;
        break;
      case "Tiempo_de_Espera":
        sort = " Facturacion_de_Vuelo.Tiempo_de_Espera " + data.sortDirecction;
        break;
      case "Espera_sin_Cargo":
        sort = " Facturacion_de_Vuelo.Espera_sin_Cargo " + data.sortDirecction;
        break;
      case "Espera_con_Cargo":
        sort = " Facturacion_de_Vuelo.Espera_con_Cargo " + data.sortDirecction;
        break;
      case "Espera_con_Cargo_Total":
        sort = " Facturacion_de_Vuelo.Espera_con_Cargo_Total " + data.sortDirecction;
        break;
      case "Pernocta":
        sort = " Facturacion_de_Vuelo.Pernocta " + data.sortDirecction;
        break;
      case "Pernoctas_Total":
        sort = " Facturacion_de_Vuelo.Pernoctas_Total " + data.sortDirecction;
        break;
      case "IVA_Nacional_Servicios":
        sort = " Facturacion_de_Vuelo.IVA_Nacional_Servicios " + data.sortDirecction;
        break;
      case "IVA_Nacional_Servicios_Total":
        sort = " Facturacion_de_Vuelo.IVA_Nacional_Servicios_Total " + data.sortDirecction;
        break;
      case "IVA":
        sort = " Facturacion_de_Vuelo.IVA " + data.sortDirecction;
        break;
      case "IVA_Internacional_Total":
        sort = " Facturacion_de_Vuelo.IVA_Internacional_Total " + data.sortDirecction;
        break;
      case "Cargo_vuelo_int_":
        sort = " Facturacion_de_Vuelo.Cargo_vuelo_int_ " + data.sortDirecction;
        break;
      case "Cargo_Vuelo_Int__Total":
        sort = " Facturacion_de_Vuelo.Cargo_Vuelo_Int__Total " + data.sortDirecction;
        break;
      case "IVA_vuelo_int_":
        sort = " Facturacion_de_Vuelo.IVA_vuelo_int_ " + data.sortDirecction;
        break;
      case "IVA_Vuelo_Int__Total":
        sort = " Facturacion_de_Vuelo.IVA_Vuelo_Int__Total " + data.sortDirecction;
        break;
      case "SubTotal_1":
        sort = " Facturacion_de_Vuelo.SubTotal_1 " + data.sortDirecction;
        break;
      case "Servicios_de_Terminal":
        sort = " Facturacion_de_Vuelo.Servicios_de_Terminal " + data.sortDirecction;
        break;
      case "Comisariato_1":
        sort = " Facturacion_de_Vuelo.Comisariato_1 " + data.sortDirecction;
        break;
      case "Despacho_1":
        sort = " Facturacion_de_Vuelo.Despacho_1 " + data.sortDirecction;
        break;
      case "Margen":
        sort = " Facturacion_de_Vuelo.Margen " + data.sortDirecction;
        break;
      case "Total_a_pagar":
        sort = " Facturacion_de_Vuelo.Total_a_pagar " + data.sortDirecction;
        break;
      case "SAPSA_Monto":
        sort = " Facturacion_de_Vuelo.SAPSA_Monto " + data.sortDirecction;
        break;
      case "SAPSA_Porcentaje":
        sort = " Facturacion_de_Vuelo.SAPSA_Porcentaje " + data.sortDirecction;
        break;
      case "GNP_Monto":
        sort = " Facturacion_de_Vuelo.GNP_Monto " + data.sortDirecction;
        break;
      case "GNP_Porcentaje":
        sort = " Facturacion_de_Vuelo.GNP_Porcentaje " + data.sortDirecction;
        break;
      case "PH_Monto":
        sort = " Facturacion_de_Vuelo.PH_Monto " + data.sortDirecction;
        break;
      case "PH_Porcentaje":
        sort = " Facturacion_de_Vuelo.PH_Porcentaje " + data.sortDirecction;
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
        condition += " AND Facturacion_de_Vuelo.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Facturacion_de_Vuelo.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
      || (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)) {
      if (typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
        condition += " and CONVERT(VARCHAR(10), Facturacion_de_Vuelo.Fecha, 102)  >= '" + moment(data.filterAdvanced.fromFecha).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)
        condition += " and CONVERT(VARCHAR(10), Facturacion_de_Vuelo.Fecha, 102)  <= '" + moment(data.filterAdvanced.toFecha).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora != 'undefined' && data.filterAdvanced.fromHora)
      || (typeof data.filterAdvanced.toHora != 'undefined' && data.filterAdvanced.toHora)) {
      if (typeof data.filterAdvanced.fromHora != 'undefined' && data.filterAdvanced.fromHora)
        condition += " and Facturacion_de_Vuelo.Hora >= '" + data.filterAdvanced.fromHora + "'";

      if (typeof data.filterAdvanced.toHora != 'undefined' && data.filterAdvanced.toHora)
        condition += " and Facturacion_de_Vuelo.Hora <= '" + data.filterAdvanced.toHora + "'";
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
      condition += " AND Facturacion_de_Vuelo.Vuelo In (" + Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.fromSeccion != 'undefined' && data.filterAdvanced.fromSeccion)
      || (typeof data.filterAdvanced.toSeccion != 'undefined' && data.filterAdvanced.toSeccion)) {
      if (typeof data.filterAdvanced.fromSeccion != 'undefined' && data.filterAdvanced.fromSeccion)
        condition += " AND Facturacion_de_Vuelo.Seccion >= " + data.filterAdvanced.fromSeccion;

      if (typeof data.filterAdvanced.toSeccion != 'undefined' && data.filterAdvanced.toSeccion)
        condition += " AND Facturacion_de_Vuelo.Seccion <= " + data.filterAdvanced.toSeccion;
    }
    switch (data.filterAdvanced.TipoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Facturacion_de_Vuelo.Tipo LIKE '" + data.filterAdvanced.Tipo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Facturacion_de_Vuelo.Tipo LIKE '%" + data.filterAdvanced.Tipo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Facturacion_de_Vuelo.Tipo LIKE '%" + data.filterAdvanced.Tipo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Facturacion_de_Vuelo.Tipo = '" + data.filterAdvanced.Tipo + "'";
        break;
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
      condition += " AND Facturacion_de_Vuelo.Matricula In (" + Matriculads + ")";
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
      condition += " AND Facturacion_de_Vuelo.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.fromAno != 'undefined' && data.filterAdvanced.fromAno)
      || (typeof data.filterAdvanced.toAno != 'undefined' && data.filterAdvanced.toAno)) {
      if (typeof data.filterAdvanced.fromAno != 'undefined' && data.filterAdvanced.fromAno)
        condition += " AND Facturacion_de_Vuelo.Ano >= " + data.filterAdvanced.fromAno;

      if (typeof data.filterAdvanced.toAno != 'undefined' && data.filterAdvanced.toAno)
        condition += " AND Facturacion_de_Vuelo.Ano <= " + data.filterAdvanced.toAno;
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
      condition += " AND Facturacion_de_Vuelo.Cliente In (" + Clienteds + ")";
    }
    if ((typeof data.filterAdvanced.Solicitante_1 != 'undefined' && data.filterAdvanced.Solicitante_1)) {
      switch (data.filterAdvanced.Solicitante_1Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Solicitante_1 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante_1 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante_1 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Solicitante_1 + "'";
          break;
      }
    } else if (data.filterAdvanced.Solicitante_1Multiple != null && data.filterAdvanced.Solicitante_1Multiple.length > 0) {
      var Solicitante_1ds = data.filterAdvanced.Solicitante_1Multiple.join(",");
      condition += " AND Facturacion_de_Vuelo.Solicitante_1 In (" + Solicitante_1ds + ")";
    }
    if ((typeof data.filterAdvanced.fromHoras_de_vuelo != 'undefined' && data.filterAdvanced.fromHoras_de_vuelo)
      || (typeof data.filterAdvanced.toHoras_de_vuelo != 'undefined' && data.filterAdvanced.toHoras_de_vuelo)) {
      if (typeof data.filterAdvanced.fromHoras_de_vuelo != 'undefined' && data.filterAdvanced.fromHoras_de_vuelo)
        condition += " AND Facturacion_de_Vuelo.Horas_de_vuelo >= " + data.filterAdvanced.fromHoras_de_vuelo;

      if (typeof data.filterAdvanced.toHoras_de_vuelo != 'undefined' && data.filterAdvanced.toHoras_de_vuelo)
        condition += " AND Facturacion_de_Vuelo.Horas_de_vuelo <= " + data.filterAdvanced.toHoras_de_vuelo;
    }
    if ((typeof data.filterAdvanced.fromHoras_de_Espera != 'undefined' && data.filterAdvanced.fromHoras_de_Espera)
      || (typeof data.filterAdvanced.toHoras_de_Espera != 'undefined' && data.filterAdvanced.toHoras_de_Espera)) {
      if (typeof data.filterAdvanced.fromHoras_de_Espera != 'undefined' && data.filterAdvanced.fromHoras_de_Espera)
        condition += " AND Facturacion_de_Vuelo.Horas_de_Espera >= " + data.filterAdvanced.fromHoras_de_Espera;

      if (typeof data.filterAdvanced.toHoras_de_Espera != 'undefined' && data.filterAdvanced.toHoras_de_Espera)
        condition += " AND Facturacion_de_Vuelo.Horas_de_Espera <= " + data.filterAdvanced.toHoras_de_Espera;
    }
    if ((typeof data.filterAdvanced.fromPercnota != 'undefined' && data.filterAdvanced.fromPercnota)
      || (typeof data.filterAdvanced.toPercnota != 'undefined' && data.filterAdvanced.toPercnota)) {
      if (typeof data.filterAdvanced.fromPercnota != 'undefined' && data.filterAdvanced.fromPercnota)
        condition += " AND Facturacion_de_Vuelo.Percnota >= " + data.filterAdvanced.fromPercnota;

      if (typeof data.filterAdvanced.toPercnota != 'undefined' && data.filterAdvanced.toPercnota)
        condition += " AND Facturacion_de_Vuelo.Percnota <= " + data.filterAdvanced.toPercnota;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_facturacion_de_vuelo.Estatus LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_facturacion_de_vuelo.Estatus LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_facturacion_de_vuelo.Estatus LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_facturacion_de_vuelo.Estatus = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Facturacion_de_Vuelo.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_la_factura != 'undefined' && data.filterAdvanced.fromFecha_de_la_factura)
      || (typeof data.filterAdvanced.toFecha_de_la_factura != 'undefined' && data.filterAdvanced.toFecha_de_la_factura)) {
      if (typeof data.filterAdvanced.fromFecha_de_la_factura != 'undefined' && data.filterAdvanced.fromFecha_de_la_factura)
        condition += " and CONVERT(VARCHAR(10), Facturacion_de_Vuelo.Fecha_de_la_factura, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_la_factura).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_la_factura != 'undefined' && data.filterAdvanced.toFecha_de_la_factura)
        condition += " and CONVERT(VARCHAR(10), Facturacion_de_Vuelo.Fecha_de_la_factura, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_la_factura).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromServicios_Terminal_Total != 'undefined' && data.filterAdvanced.fromServicios_Terminal_Total)
      || (typeof data.filterAdvanced.toServicios_Terminal_Total != 'undefined' && data.filterAdvanced.toServicios_Terminal_Total)) {
      if (typeof data.filterAdvanced.fromServicios_Terminal_Total != 'undefined' && data.filterAdvanced.fromServicios_Terminal_Total)
        condition += " AND Facturacion_de_Vuelo.Servicios_Terminal_Total >= " + data.filterAdvanced.fromServicios_Terminal_Total;

      if (typeof data.filterAdvanced.toServicios_Terminal_Total != 'undefined' && data.filterAdvanced.toServicios_Terminal_Total)
        condition += " AND Facturacion_de_Vuelo.Servicios_Terminal_Total <= " + data.filterAdvanced.toServicios_Terminal_Total;
    }
    if ((typeof data.filterAdvanced.fromComisariato_Total != 'undefined' && data.filterAdvanced.fromComisariato_Total)
      || (typeof data.filterAdvanced.toComisariato_Total != 'undefined' && data.filterAdvanced.toComisariato_Total)) {
      if (typeof data.filterAdvanced.fromComisariato_Total != 'undefined' && data.filterAdvanced.fromComisariato_Total)
        condition += " AND Facturacion_de_Vuelo.Comisariato_Total >= " + data.filterAdvanced.fromComisariato_Total;

      if (typeof data.filterAdvanced.toComisariato_Total != 'undefined' && data.filterAdvanced.toComisariato_Total)
        condition += " AND Facturacion_de_Vuelo.Comisariato_Total <= " + data.filterAdvanced.toComisariato_Total;
    }
    if ((typeof data.filterAdvanced.fromDespacho != 'undefined' && data.filterAdvanced.fromDespacho)
      || (typeof data.filterAdvanced.toDespacho != 'undefined' && data.filterAdvanced.toDespacho)) {
      if (typeof data.filterAdvanced.fromDespacho != 'undefined' && data.filterAdvanced.fromDespacho)
        condition += " AND Facturacion_de_Vuelo.Despacho >= " + data.filterAdvanced.fromDespacho;

      if (typeof data.filterAdvanced.toDespacho != 'undefined' && data.filterAdvanced.toDespacho)
        condition += " AND Facturacion_de_Vuelo.Despacho <= " + data.filterAdvanced.toDespacho;
    }
    if ((typeof data.filterAdvanced.fromTUA_Nacional != 'undefined' && data.filterAdvanced.fromTUA_Nacional)
      || (typeof data.filterAdvanced.toTUA_Nacional != 'undefined' && data.filterAdvanced.toTUA_Nacional)) {
      if (typeof data.filterAdvanced.fromTUA_Nacional != 'undefined' && data.filterAdvanced.fromTUA_Nacional)
        condition += " AND Facturacion_de_Vuelo.TUA_Nacional >= " + data.filterAdvanced.fromTUA_Nacional;

      if (typeof data.filterAdvanced.toTUA_Nacional != 'undefined' && data.filterAdvanced.toTUA_Nacional)
        condition += " AND Facturacion_de_Vuelo.TUA_Nacional <= " + data.filterAdvanced.toTUA_Nacional;
    }
    if ((typeof data.filterAdvanced.fromTUA_Nacional_Total != 'undefined' && data.filterAdvanced.fromTUA_Nacional_Total)
      || (typeof data.filterAdvanced.toTUA_Nacional_Total != 'undefined' && data.filterAdvanced.toTUA_Nacional_Total)) {
      if (typeof data.filterAdvanced.fromTUA_Nacional_Total != 'undefined' && data.filterAdvanced.fromTUA_Nacional_Total)
        condition += " AND Facturacion_de_Vuelo.TUA_Nacional_Total >= " + data.filterAdvanced.fromTUA_Nacional_Total;

      if (typeof data.filterAdvanced.toTUA_Nacional_Total != 'undefined' && data.filterAdvanced.toTUA_Nacional_Total)
        condition += " AND Facturacion_de_Vuelo.TUA_Nacional_Total <= " + data.filterAdvanced.toTUA_Nacional_Total;
    }
    if ((typeof data.filterAdvanced.fromTUA_Internacional != 'undefined' && data.filterAdvanced.fromTUA_Internacional)
      || (typeof data.filterAdvanced.toTUA_Internacional != 'undefined' && data.filterAdvanced.toTUA_Internacional)) {
      if (typeof data.filterAdvanced.fromTUA_Internacional != 'undefined' && data.filterAdvanced.fromTUA_Internacional)
        condition += " AND Facturacion_de_Vuelo.TUA_Internacional >= " + data.filterAdvanced.fromTUA_Internacional;

      if (typeof data.filterAdvanced.toTUA_Internacional != 'undefined' && data.filterAdvanced.toTUA_Internacional)
        condition += " AND Facturacion_de_Vuelo.TUA_Internacional <= " + data.filterAdvanced.toTUA_Internacional;
    }
    if ((typeof data.filterAdvanced.fromTUA_Internacional_Total != 'undefined' && data.filterAdvanced.fromTUA_Internacional_Total)
      || (typeof data.filterAdvanced.toTUA_Internacional_Total != 'undefined' && data.filterAdvanced.toTUA_Internacional_Total)) {
      if (typeof data.filterAdvanced.fromTUA_Internacional_Total != 'undefined' && data.filterAdvanced.fromTUA_Internacional_Total)
        condition += " AND Facturacion_de_Vuelo.TUA_Internacional_Total >= " + data.filterAdvanced.fromTUA_Internacional_Total;

      if (typeof data.filterAdvanced.toTUA_Internacional_Total != 'undefined' && data.filterAdvanced.toTUA_Internacional_Total)
        condition += " AND Facturacion_de_Vuelo.TUA_Internacional_Total <= " + data.filterAdvanced.toTUA_Internacional_Total;
    }
    if ((typeof data.filterAdvanced.fromIVA_Frontera != 'undefined' && data.filterAdvanced.fromIVA_Frontera)
      || (typeof data.filterAdvanced.toIVA_Frontera != 'undefined' && data.filterAdvanced.toIVA_Frontera)) {
      if (typeof data.filterAdvanced.fromIVA_Frontera != 'undefined' && data.filterAdvanced.fromIVA_Frontera)
        condition += " AND Facturacion_de_Vuelo.IVA_Frontera >= " + data.filterAdvanced.fromIVA_Frontera;

      if (typeof data.filterAdvanced.toIVA_Frontera != 'undefined' && data.filterAdvanced.toIVA_Frontera)
        condition += " AND Facturacion_de_Vuelo.IVA_Frontera <= " + data.filterAdvanced.toIVA_Frontera;
    }
    if ((typeof data.filterAdvanced.fromIVA_Frontera_Total != 'undefined' && data.filterAdvanced.fromIVA_Frontera_Total)
      || (typeof data.filterAdvanced.toIVA_Frontera_Total != 'undefined' && data.filterAdvanced.toIVA_Frontera_Total)) {
      if (typeof data.filterAdvanced.fromIVA_Frontera_Total != 'undefined' && data.filterAdvanced.fromIVA_Frontera_Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Frontera_Total >= " + data.filterAdvanced.fromIVA_Frontera_Total;

      if (typeof data.filterAdvanced.toIVA_Frontera_Total != 'undefined' && data.filterAdvanced.toIVA_Frontera_Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Frontera_Total <= " + data.filterAdvanced.toIVA_Frontera_Total;
    }
    if ((typeof data.filterAdvanced.fromIVA_Nacional != 'undefined' && data.filterAdvanced.fromIVA_Nacional)
      || (typeof data.filterAdvanced.toIVA_Nacional != 'undefined' && data.filterAdvanced.toIVA_Nacional)) {
      if (typeof data.filterAdvanced.fromIVA_Nacional != 'undefined' && data.filterAdvanced.fromIVA_Nacional)
        condition += " AND Facturacion_de_Vuelo.IVA_Nacional >= " + data.filterAdvanced.fromIVA_Nacional;

      if (typeof data.filterAdvanced.toIVA_Nacional != 'undefined' && data.filterAdvanced.toIVA_Nacional)
        condition += " AND Facturacion_de_Vuelo.IVA_Nacional <= " + data.filterAdvanced.toIVA_Nacional;
    }
    if ((typeof data.filterAdvanced.fromIVA_Nacional_Total != 'undefined' && data.filterAdvanced.fromIVA_Nacional_Total)
      || (typeof data.filterAdvanced.toIVA_Nacional_Total != 'undefined' && data.filterAdvanced.toIVA_Nacional_Total)) {
      if (typeof data.filterAdvanced.fromIVA_Nacional_Total != 'undefined' && data.filterAdvanced.fromIVA_Nacional_Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Nacional_Total >= " + data.filterAdvanced.fromIVA_Nacional_Total;

      if (typeof data.filterAdvanced.toIVA_Nacional_Total != 'undefined' && data.filterAdvanced.toIVA_Nacional_Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Nacional_Total <= " + data.filterAdvanced.toIVA_Nacional_Total;
    }
    if ((typeof data.filterAdvanced.fromSubTotal != 'undefined' && data.filterAdvanced.fromSubTotal)
      || (typeof data.filterAdvanced.toSubTotal != 'undefined' && data.filterAdvanced.toSubTotal)) {
      if (typeof data.filterAdvanced.fromSubTotal != 'undefined' && data.filterAdvanced.fromSubTotal)
        condition += " AND Facturacion_de_Vuelo.SubTotal >= " + data.filterAdvanced.fromSubTotal;

      if (typeof data.filterAdvanced.toSubTotal != 'undefined' && data.filterAdvanced.toSubTotal)
        condition += " AND Facturacion_de_Vuelo.SubTotal <= " + data.filterAdvanced.toSubTotal;
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.fromTiempo_de_Vuelo)
      || (typeof data.filterAdvanced.toTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.toTiempo_de_Vuelo)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.fromTiempo_de_Vuelo)
        condition += " and Facturacion_de_Vuelo.Tiempo_de_Vuelo >= '" + data.filterAdvanced.fromTiempo_de_Vuelo + "'";

      if (typeof data.filterAdvanced.toTiempo_de_Vuelo != 'undefined' && data.filterAdvanced.toTiempo_de_Vuelo)
        condition += " and Facturacion_de_Vuelo.Tiempo_de_Vuelo <= '" + data.filterAdvanced.toTiempo_de_Vuelo + "'";
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Vuelo_Total != 'undefined' && data.filterAdvanced.fromTiempo_de_Vuelo_Total)
      || (typeof data.filterAdvanced.toTiempo_de_Vuelo_Total != 'undefined' && data.filterAdvanced.toTiempo_de_Vuelo_Total)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Vuelo_Total != 'undefined' && data.filterAdvanced.fromTiempo_de_Vuelo_Total)
        condition += " AND Facturacion_de_Vuelo.Tiempo_de_Vuelo_Total >= " + data.filterAdvanced.fromTiempo_de_Vuelo_Total;

      if (typeof data.filterAdvanced.toTiempo_de_Vuelo_Total != 'undefined' && data.filterAdvanced.toTiempo_de_Vuelo_Total)
        condition += " AND Facturacion_de_Vuelo.Tiempo_de_Vuelo_Total <= " + data.filterAdvanced.toTiempo_de_Vuelo_Total;
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_Espera != 'undefined' && data.filterAdvanced.fromTiempo_de_Espera)
      || (typeof data.filterAdvanced.toTiempo_de_Espera != 'undefined' && data.filterAdvanced.toTiempo_de_Espera)) {
      if (typeof data.filterAdvanced.fromTiempo_de_Espera != 'undefined' && data.filterAdvanced.fromTiempo_de_Espera)
        condition += " and Facturacion_de_Vuelo.Tiempo_de_Espera >= '" + data.filterAdvanced.fromTiempo_de_Espera + "'";

      if (typeof data.filterAdvanced.toTiempo_de_Espera != 'undefined' && data.filterAdvanced.toTiempo_de_Espera)
        condition += " and Facturacion_de_Vuelo.Tiempo_de_Espera <= '" + data.filterAdvanced.toTiempo_de_Espera + "'";
    }
    if ((typeof data.filterAdvanced.fromEspera_sin_Cargo != 'undefined' && data.filterAdvanced.fromEspera_sin_Cargo)
      || (typeof data.filterAdvanced.toEspera_sin_Cargo != 'undefined' && data.filterAdvanced.toEspera_sin_Cargo)) {
      if (typeof data.filterAdvanced.fromEspera_sin_Cargo != 'undefined' && data.filterAdvanced.fromEspera_sin_Cargo)
        condition += " and Facturacion_de_Vuelo.Espera_sin_Cargo >= '" + data.filterAdvanced.fromEspera_sin_Cargo + "'";

      if (typeof data.filterAdvanced.toEspera_sin_Cargo != 'undefined' && data.filterAdvanced.toEspera_sin_Cargo)
        condition += " and Facturacion_de_Vuelo.Espera_sin_Cargo <= '" + data.filterAdvanced.toEspera_sin_Cargo + "'";
    }
    if ((typeof data.filterAdvanced.fromEspera_con_Cargo != 'undefined' && data.filterAdvanced.fromEspera_con_Cargo)
      || (typeof data.filterAdvanced.toEspera_con_Cargo != 'undefined' && data.filterAdvanced.toEspera_con_Cargo)) {
      if (typeof data.filterAdvanced.fromEspera_con_Cargo != 'undefined' && data.filterAdvanced.fromEspera_con_Cargo)
        condition += " and Facturacion_de_Vuelo.Espera_con_Cargo >= '" + data.filterAdvanced.fromEspera_con_Cargo + "'";

      if (typeof data.filterAdvanced.toEspera_con_Cargo != 'undefined' && data.filterAdvanced.toEspera_con_Cargo)
        condition += " and Facturacion_de_Vuelo.Espera_con_Cargo <= '" + data.filterAdvanced.toEspera_con_Cargo + "'";
    }
    if ((typeof data.filterAdvanced.fromEspera_con_Cargo_Total != 'undefined' && data.filterAdvanced.fromEspera_con_Cargo_Total)
      || (typeof data.filterAdvanced.toEspera_con_Cargo_Total != 'undefined' && data.filterAdvanced.toEspera_con_Cargo_Total)) {
      if (typeof data.filterAdvanced.fromEspera_con_Cargo_Total != 'undefined' && data.filterAdvanced.fromEspera_con_Cargo_Total)
        condition += " AND Facturacion_de_Vuelo.Espera_con_Cargo_Total >= " + data.filterAdvanced.fromEspera_con_Cargo_Total;

      if (typeof data.filterAdvanced.toEspera_con_Cargo_Total != 'undefined' && data.filterAdvanced.toEspera_con_Cargo_Total)
        condition += " AND Facturacion_de_Vuelo.Espera_con_Cargo_Total <= " + data.filterAdvanced.toEspera_con_Cargo_Total;
    }
    if ((typeof data.filterAdvanced.fromPernocta != 'undefined' && data.filterAdvanced.fromPernocta)
      || (typeof data.filterAdvanced.toPernocta != 'undefined' && data.filterAdvanced.toPernocta)) {
      if (typeof data.filterAdvanced.fromPernocta != 'undefined' && data.filterAdvanced.fromPernocta)
        condition += " AND Facturacion_de_Vuelo.Pernocta >= " + data.filterAdvanced.fromPernocta;

      if (typeof data.filterAdvanced.toPernocta != 'undefined' && data.filterAdvanced.toPernocta)
        condition += " AND Facturacion_de_Vuelo.Pernocta <= " + data.filterAdvanced.toPernocta;
    }
    if ((typeof data.filterAdvanced.fromPernoctas_Total != 'undefined' && data.filterAdvanced.fromPernoctas_Total)
      || (typeof data.filterAdvanced.toPernoctas_Total != 'undefined' && data.filterAdvanced.toPernoctas_Total)) {
      if (typeof data.filterAdvanced.fromPernoctas_Total != 'undefined' && data.filterAdvanced.fromPernoctas_Total)
        condition += " AND Facturacion_de_Vuelo.Pernoctas_Total >= " + data.filterAdvanced.fromPernoctas_Total;

      if (typeof data.filterAdvanced.toPernoctas_Total != 'undefined' && data.filterAdvanced.toPernoctas_Total)
        condition += " AND Facturacion_de_Vuelo.Pernoctas_Total <= " + data.filterAdvanced.toPernoctas_Total;
    }
    if ((typeof data.filterAdvanced.fromIVA_Nacional_Servicios != 'undefined' && data.filterAdvanced.fromIVA_Nacional_Servicios)
      || (typeof data.filterAdvanced.toIVA_Nacional_Servicios != 'undefined' && data.filterAdvanced.toIVA_Nacional_Servicios)) {
      if (typeof data.filterAdvanced.fromIVA_Nacional_Servicios != 'undefined' && data.filterAdvanced.fromIVA_Nacional_Servicios)
        condition += " AND Facturacion_de_Vuelo.IVA_Nacional_Servicios >= " + data.filterAdvanced.fromIVA_Nacional_Servicios;

      if (typeof data.filterAdvanced.toIVA_Nacional_Servicios != 'undefined' && data.filterAdvanced.toIVA_Nacional_Servicios)
        condition += " AND Facturacion_de_Vuelo.IVA_Nacional_Servicios <= " + data.filterAdvanced.toIVA_Nacional_Servicios;
    }
    if ((typeof data.filterAdvanced.fromIVA_Nacional_Servicios_Total != 'undefined' && data.filterAdvanced.fromIVA_Nacional_Servicios_Total)
      || (typeof data.filterAdvanced.toIVA_Nacional_Servicios_Total != 'undefined' && data.filterAdvanced.toIVA_Nacional_Servicios_Total)) {
      if (typeof data.filterAdvanced.fromIVA_Nacional_Servicios_Total != 'undefined' && data.filterAdvanced.fromIVA_Nacional_Servicios_Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Nacional_Servicios_Total >= " + data.filterAdvanced.fromIVA_Nacional_Servicios_Total;

      if (typeof data.filterAdvanced.toIVA_Nacional_Servicios_Total != 'undefined' && data.filterAdvanced.toIVA_Nacional_Servicios_Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Nacional_Servicios_Total <= " + data.filterAdvanced.toIVA_Nacional_Servicios_Total;
    }
    if ((typeof data.filterAdvanced.fromIVA != 'undefined' && data.filterAdvanced.fromIVA)
      || (typeof data.filterAdvanced.toIVA != 'undefined' && data.filterAdvanced.toIVA)) {
      if (typeof data.filterAdvanced.fromIVA != 'undefined' && data.filterAdvanced.fromIVA)
        condition += " AND Facturacion_de_Vuelo.IVA >= " + data.filterAdvanced.fromIVA;

      if (typeof data.filterAdvanced.toIVA != 'undefined' && data.filterAdvanced.toIVA)
        condition += " AND Facturacion_de_Vuelo.IVA <= " + data.filterAdvanced.toIVA;
    }
    if ((typeof data.filterAdvanced.fromIVA_Internacional_Total != 'undefined' && data.filterAdvanced.fromIVA_Internacional_Total)
      || (typeof data.filterAdvanced.toIVA_Internacional_Total != 'undefined' && data.filterAdvanced.toIVA_Internacional_Total)) {
      if (typeof data.filterAdvanced.fromIVA_Internacional_Total != 'undefined' && data.filterAdvanced.fromIVA_Internacional_Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Internacional_Total >= " + data.filterAdvanced.fromIVA_Internacional_Total;

      if (typeof data.filterAdvanced.toIVA_Internacional_Total != 'undefined' && data.filterAdvanced.toIVA_Internacional_Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Internacional_Total <= " + data.filterAdvanced.toIVA_Internacional_Total;
    }
    if ((typeof data.filterAdvanced.fromCargo_vuelo_int_ != 'undefined' && data.filterAdvanced.fromCargo_vuelo_int_)
      || (typeof data.filterAdvanced.toCargo_vuelo_int_ != 'undefined' && data.filterAdvanced.toCargo_vuelo_int_)) {
      if (typeof data.filterAdvanced.fromCargo_vuelo_int_ != 'undefined' && data.filterAdvanced.fromCargo_vuelo_int_)
        condition += " AND Facturacion_de_Vuelo.Cargo_vuelo_int_ >= " + data.filterAdvanced.fromCargo_vuelo_int_;

      if (typeof data.filterAdvanced.toCargo_vuelo_int_ != 'undefined' && data.filterAdvanced.toCargo_vuelo_int_)
        condition += " AND Facturacion_de_Vuelo.Cargo_vuelo_int_ <= " + data.filterAdvanced.toCargo_vuelo_int_;
    }
    if ((typeof data.filterAdvanced.fromCargo_Vuelo_Int__Total != 'undefined' && data.filterAdvanced.fromCargo_Vuelo_Int__Total)
      || (typeof data.filterAdvanced.toCargo_Vuelo_Int__Total != 'undefined' && data.filterAdvanced.toCargo_Vuelo_Int__Total)) {
      if (typeof data.filterAdvanced.fromCargo_Vuelo_Int__Total != 'undefined' && data.filterAdvanced.fromCargo_Vuelo_Int__Total)
        condition += " AND Facturacion_de_Vuelo.Cargo_Vuelo_Int__Total >= " + data.filterAdvanced.fromCargo_Vuelo_Int__Total;

      if (typeof data.filterAdvanced.toCargo_Vuelo_Int__Total != 'undefined' && data.filterAdvanced.toCargo_Vuelo_Int__Total)
        condition += " AND Facturacion_de_Vuelo.Cargo_Vuelo_Int__Total <= " + data.filterAdvanced.toCargo_Vuelo_Int__Total;
    }
    if ((typeof data.filterAdvanced.fromIVA_vuelo_int_ != 'undefined' && data.filterAdvanced.fromIVA_vuelo_int_)
      || (typeof data.filterAdvanced.toIVA_vuelo_int_ != 'undefined' && data.filterAdvanced.toIVA_vuelo_int_)) {
      if (typeof data.filterAdvanced.fromIVA_vuelo_int_ != 'undefined' && data.filterAdvanced.fromIVA_vuelo_int_)
        condition += " AND Facturacion_de_Vuelo.IVA_vuelo_int_ >= " + data.filterAdvanced.fromIVA_vuelo_int_;

      if (typeof data.filterAdvanced.toIVA_vuelo_int_ != 'undefined' && data.filterAdvanced.toIVA_vuelo_int_)
        condition += " AND Facturacion_de_Vuelo.IVA_vuelo_int_ <= " + data.filterAdvanced.toIVA_vuelo_int_;
    }
    if ((typeof data.filterAdvanced.fromIVA_Vuelo_Int__Total != 'undefined' && data.filterAdvanced.fromIVA_Vuelo_Int__Total)
      || (typeof data.filterAdvanced.toIVA_Vuelo_Int__Total != 'undefined' && data.filterAdvanced.toIVA_Vuelo_Int__Total)) {
      if (typeof data.filterAdvanced.fromIVA_Vuelo_Int__Total != 'undefined' && data.filterAdvanced.fromIVA_Vuelo_Int__Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Vuelo_Int__Total >= " + data.filterAdvanced.fromIVA_Vuelo_Int__Total;

      if (typeof data.filterAdvanced.toIVA_Vuelo_Int__Total != 'undefined' && data.filterAdvanced.toIVA_Vuelo_Int__Total)
        condition += " AND Facturacion_de_Vuelo.IVA_Vuelo_Int__Total <= " + data.filterAdvanced.toIVA_Vuelo_Int__Total;
    }
    if ((typeof data.filterAdvanced.fromSubTotal_1 != 'undefined' && data.filterAdvanced.fromSubTotal_1)
      || (typeof data.filterAdvanced.toSubTotal_1 != 'undefined' && data.filterAdvanced.toSubTotal_1)) {
      if (typeof data.filterAdvanced.fromSubTotal_1 != 'undefined' && data.filterAdvanced.fromSubTotal_1)
        condition += " AND Facturacion_de_Vuelo.SubTotal_1 >= " + data.filterAdvanced.fromSubTotal_1;

      if (typeof data.filterAdvanced.toSubTotal_1 != 'undefined' && data.filterAdvanced.toSubTotal_1)
        condition += " AND Facturacion_de_Vuelo.SubTotal_1 <= " + data.filterAdvanced.toSubTotal_1;
    }
    if ((typeof data.filterAdvanced.fromServicios_de_Terminal != 'undefined' && data.filterAdvanced.fromServicios_de_Terminal)
      || (typeof data.filterAdvanced.toServicios_de_Terminal != 'undefined' && data.filterAdvanced.toServicios_de_Terminal)) {
      if (typeof data.filterAdvanced.fromServicios_de_Terminal != 'undefined' && data.filterAdvanced.fromServicios_de_Terminal)
        condition += " AND Facturacion_de_Vuelo.Servicios_de_Terminal >= " + data.filterAdvanced.fromServicios_de_Terminal;

      if (typeof data.filterAdvanced.toServicios_de_Terminal != 'undefined' && data.filterAdvanced.toServicios_de_Terminal)
        condition += " AND Facturacion_de_Vuelo.Servicios_de_Terminal <= " + data.filterAdvanced.toServicios_de_Terminal;
    }
    if ((typeof data.filterAdvanced.fromComisariato_1 != 'undefined' && data.filterAdvanced.fromComisariato_1)
      || (typeof data.filterAdvanced.toComisariato_1 != 'undefined' && data.filterAdvanced.toComisariato_1)) {
      if (typeof data.filterAdvanced.fromComisariato_1 != 'undefined' && data.filterAdvanced.fromComisariato_1)
        condition += " AND Facturacion_de_Vuelo.Comisariato_1 >= " + data.filterAdvanced.fromComisariato_1;

      if (typeof data.filterAdvanced.toComisariato_1 != 'undefined' && data.filterAdvanced.toComisariato_1)
        condition += " AND Facturacion_de_Vuelo.Comisariato_1 <= " + data.filterAdvanced.toComisariato_1;
    }
    if ((typeof data.filterAdvanced.fromDespacho_1 != 'undefined' && data.filterAdvanced.fromDespacho_1)
      || (typeof data.filterAdvanced.toDespacho_1 != 'undefined' && data.filterAdvanced.toDespacho_1)) {
      if (typeof data.filterAdvanced.fromDespacho_1 != 'undefined' && data.filterAdvanced.fromDespacho_1)
        condition += " AND Facturacion_de_Vuelo.Despacho_1 >= " + data.filterAdvanced.fromDespacho_1;

      if (typeof data.filterAdvanced.toDespacho_1 != 'undefined' && data.filterAdvanced.toDespacho_1)
        condition += " AND Facturacion_de_Vuelo.Despacho_1 <= " + data.filterAdvanced.toDespacho_1;
    }
    if ((typeof data.filterAdvanced.fromMargen != 'undefined' && data.filterAdvanced.fromMargen)
      || (typeof data.filterAdvanced.toMargen != 'undefined' && data.filterAdvanced.toMargen)) {
      if (typeof data.filterAdvanced.fromMargen != 'undefined' && data.filterAdvanced.fromMargen)
        condition += " AND Facturacion_de_Vuelo.Margen >= " + data.filterAdvanced.fromMargen;

      if (typeof data.filterAdvanced.toMargen != 'undefined' && data.filterAdvanced.toMargen)
        condition += " AND Facturacion_de_Vuelo.Margen <= " + data.filterAdvanced.toMargen;
    }
    if ((typeof data.filterAdvanced.fromTotal_a_pagar != 'undefined' && data.filterAdvanced.fromTotal_a_pagar)
      || (typeof data.filterAdvanced.toTotal_a_pagar != 'undefined' && data.filterAdvanced.toTotal_a_pagar)) {
      if (typeof data.filterAdvanced.fromTotal_a_pagar != 'undefined' && data.filterAdvanced.fromTotal_a_pagar)
        condition += " AND Facturacion_de_Vuelo.Total_a_pagar >= " + data.filterAdvanced.fromTotal_a_pagar;

      if (typeof data.filterAdvanced.toTotal_a_pagar != 'undefined' && data.filterAdvanced.toTotal_a_pagar)
        condition += " AND Facturacion_de_Vuelo.Total_a_pagar <= " + data.filterAdvanced.toTotal_a_pagar;
    }
    if ((typeof data.filterAdvanced.fromSAPSA_Monto != 'undefined' && data.filterAdvanced.fromSAPSA_Monto)
      || (typeof data.filterAdvanced.toSAPSA_Monto != 'undefined' && data.filterAdvanced.toSAPSA_Monto)) {
      if (typeof data.filterAdvanced.fromSAPSA_Monto != 'undefined' && data.filterAdvanced.fromSAPSA_Monto)
        condition += " AND Facturacion_de_Vuelo.SAPSA_Monto >= " + data.filterAdvanced.fromSAPSA_Monto;

      if (typeof data.filterAdvanced.toSAPSA_Monto != 'undefined' && data.filterAdvanced.toSAPSA_Monto)
        condition += " AND Facturacion_de_Vuelo.SAPSA_Monto <= " + data.filterAdvanced.toSAPSA_Monto;
    }
    if ((typeof data.filterAdvanced.fromSAPSA_Porcentaje != 'undefined' && data.filterAdvanced.fromSAPSA_Porcentaje)
      || (typeof data.filterAdvanced.toSAPSA_Porcentaje != 'undefined' && data.filterAdvanced.toSAPSA_Porcentaje)) {
      if (typeof data.filterAdvanced.fromSAPSA_Porcentaje != 'undefined' && data.filterAdvanced.fromSAPSA_Porcentaje)
        condition += " AND Facturacion_de_Vuelo.SAPSA_Porcentaje >= " + data.filterAdvanced.fromSAPSA_Porcentaje;

      if (typeof data.filterAdvanced.toSAPSA_Porcentaje != 'undefined' && data.filterAdvanced.toSAPSA_Porcentaje)
        condition += " AND Facturacion_de_Vuelo.SAPSA_Porcentaje <= " + data.filterAdvanced.toSAPSA_Porcentaje;
    }
    if ((typeof data.filterAdvanced.fromGNP_Monto != 'undefined' && data.filterAdvanced.fromGNP_Monto)
      || (typeof data.filterAdvanced.toGNP_Monto != 'undefined' && data.filterAdvanced.toGNP_Monto)) {
      if (typeof data.filterAdvanced.fromGNP_Monto != 'undefined' && data.filterAdvanced.fromGNP_Monto)
        condition += " AND Facturacion_de_Vuelo.GNP_Monto >= " + data.filterAdvanced.fromGNP_Monto;

      if (typeof data.filterAdvanced.toGNP_Monto != 'undefined' && data.filterAdvanced.toGNP_Monto)
        condition += " AND Facturacion_de_Vuelo.GNP_Monto <= " + data.filterAdvanced.toGNP_Monto;
    }
    if ((typeof data.filterAdvanced.fromGNP_Porcentaje != 'undefined' && data.filterAdvanced.fromGNP_Porcentaje)
      || (typeof data.filterAdvanced.toGNP_Porcentaje != 'undefined' && data.filterAdvanced.toGNP_Porcentaje)) {
      if (typeof data.filterAdvanced.fromGNP_Porcentaje != 'undefined' && data.filterAdvanced.fromGNP_Porcentaje)
        condition += " AND Facturacion_de_Vuelo.GNP_Porcentaje >= " + data.filterAdvanced.fromGNP_Porcentaje;

      if (typeof data.filterAdvanced.toGNP_Porcentaje != 'undefined' && data.filterAdvanced.toGNP_Porcentaje)
        condition += " AND Facturacion_de_Vuelo.GNP_Porcentaje <= " + data.filterAdvanced.toGNP_Porcentaje;
    }
    if ((typeof data.filterAdvanced.fromPH_Monto != 'undefined' && data.filterAdvanced.fromPH_Monto)
      || (typeof data.filterAdvanced.toPH_Monto != 'undefined' && data.filterAdvanced.toPH_Monto)) {
      if (typeof data.filterAdvanced.fromPH_Monto != 'undefined' && data.filterAdvanced.fromPH_Monto)
        condition += " AND Facturacion_de_Vuelo.PH_Monto >= " + data.filterAdvanced.fromPH_Monto;

      if (typeof data.filterAdvanced.toPH_Monto != 'undefined' && data.filterAdvanced.toPH_Monto)
        condition += " AND Facturacion_de_Vuelo.PH_Monto <= " + data.filterAdvanced.toPH_Monto;
    }
    if ((typeof data.filterAdvanced.fromPH_Porcentaje != 'undefined' && data.filterAdvanced.fromPH_Porcentaje)
      || (typeof data.filterAdvanced.toPH_Porcentaje != 'undefined' && data.filterAdvanced.toPH_Porcentaje)) {
      if (typeof data.filterAdvanced.fromPH_Porcentaje != 'undefined' && data.filterAdvanced.fromPH_Porcentaje)
        condition += " AND Facturacion_de_Vuelo.PH_Porcentaje >= " + data.filterAdvanced.fromPH_Porcentaje;

      if (typeof data.filterAdvanced.toPH_Porcentaje != 'undefined' && data.filterAdvanced.toPH_Porcentaje)
        condition += " AND Facturacion_de_Vuelo.PH_Porcentaje <= " + data.filterAdvanced.toPH_Porcentaje;
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
              const longest = result.Facturacion_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Facturacion_de_Vuelos);
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
