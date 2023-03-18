import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Gastos_de_VueloService } from "src/app/api-services/Gastos_de_Vuelo.service";
import { Gastos_de_Vuelo } from "src/app/models/Gastos_de_Vuelo";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild,Renderer2 } from "@angular/core";
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
import { Gastos_de_VueloIndexRules } from 'src/app/shared/businessRules/Gastos_de_Vuelo-index-rules';
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
  selector: "app-list-Gastos_de_Vuelo",
  templateUrl: "./list-Gastos_de_Vuelo.component.html",
  styleUrls: ["./list-Gastos_de_Vuelo.component.scss"],
})
export class ListGastos_de_VueloComponent extends Gastos_de_VueloIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Fecha_de_Registro",
    "Tipo_de_Ingreso_de_Gasto",
    "Orden_de_Trabajo",
    "Numero_de_Vuelo",
    "Matricula",
    "Tramo_de_Vuelo",
    "Salida",
    "Destino",
    "Empleado",
    "Estatus",
    "empleado_total_mxn",
    "empleado_total_usd",
    "empleado_total_eur",
    "empleado_total_libras",
    "empleado_total_cad",
    "aeronave_total_mxn",
    "aeronave_total_usd",
    "aeronave_total_eur",
    "aeronave_total_libras",
    "aeronave_total_cad",
    "Observaciones",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Registro",
      "Tipo_de_Ingreso_de_Gasto",
      "Orden_de_Trabajo",
      "Numero_de_Vuelo",
      "Matricula",
      "Tramo_de_Vuelo",
      "Salida",
      "Destino",
      "Empleado",
      "Estatus",
      "empleado_total_mxn",
      "empleado_total_usd",
      "empleado_total_eur",
      "empleado_total_libras",
      "empleado_total_cad",
      "aeronave_total_mxn",
      "aeronave_total_usd",
      "aeronave_total_eur",
      "aeronave_total_libras",
      "aeronave_total_cad",
      "Observaciones",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Registro_filtro",
      "Tipo_de_Ingreso_de_Gasto_filtro",
      "Orden_de_Trabajo_filtro",
      "Numero_de_Vuelo_filtro",
      "Matricula_filtro",
      "Tramo_de_Vuelo_filtro",
      "Salida_filtro",
      "Destino_filtro",
      "Empleado_filtro",
      "Estatus_filtro",
      "empleado_total_mxn_filtro",
      "empleado_total_usd_filtro",
      "empleado_total_eur_filtro",
      "empleado_total_libras_filtro",
      "empleado_total_cad_filtro",
      "aeronave_total_mxn_filtro",
      "aeronave_total_usd_filtro",
      "aeronave_total_eur_filtro",
      "aeronave_total_libras_filtro",
      "aeronave_total_cad_filtro",
      "Observaciones_filtro",

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
      Tipo_de_Ingreso_de_Gasto: "",
      Orden_de_Trabajo: "",
      Numero_de_Vuelo: "",
      Matricula: "",
      Tramo_de_Vuelo: "",
      Salida: "",
      Destino: "",
      Empleado: "",
      Estatus: "",
      empleado_total_mxn: "",
      empleado_total_usd: "",
      empleado_total_eur: "",
      empleado_total_libras: "",
      empleado_total_cad: "",
      aeronave_total_mxn: "",
      aeronave_total_usd: "",
      aeronave_total_eur: "",
      aeronave_total_libras: "",
      aeronave_total_cad: "",
      Observaciones: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      Tipo_de_Ingreso_de_GastoFilter: "",
      Tipo_de_Ingreso_de_Gasto: "",
      Tipo_de_Ingreso_de_GastoMultiple: "",
      Orden_de_TrabajoFilter: "",
      Orden_de_Trabajo: "",
      Orden_de_TrabajoMultiple: "",
      Numero_de_VueloFilter: "",
      Numero_de_Vuelo: "",
      Numero_de_VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      Tramo_de_VueloFilter: "",
      Tramo_de_Vuelo: "",
      Tramo_de_VueloMultiple: "",
      SalidaFilter: "",
      Salida: "",
      SalidaMultiple: "",
      DestinoFilter: "",
      Destino: "",
      DestinoMultiple: "",
      EmpleadoFilter: "",
      Empleado: "",
      EmpleadoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromempleado_total_mxn: "",
      toempleado_total_mxn: "",
      fromempleado_total_usd: "",
      toempleado_total_usd: "",
      fromempleado_total_eur: "",
      toempleado_total_eur: "",
      fromempleado_total_libras: "",
      toempleado_total_libras: "",
      fromempleado_total_cad: "",
      toempleado_total_cad: "",
      fromaeronave_total_mxn: "",
      toaeronave_total_mxn: "",
      fromaeronave_total_usd: "",
      toaeronave_total_usd: "",
      fromaeronave_total_eur: "",
      toaeronave_total_eur: "",
      fromaeronave_total_libras: "",
      toaeronave_total_libras: "",
      fromaeronave_total_cad: "",
      toaeronave_total_cad: "",

    }
  };

  dataSource: Gastos_de_VueloDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Gastos_de_VueloDataSource;
  dataClipboard: any;

  constructor(
    private _Gastos_de_VueloService: Gastos_de_VueloService,
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
    this.dataSource = new Gastos_de_VueloDataSource(
      this._Gastos_de_VueloService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Gastos_de_Vuelo)
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
    this.listConfig.filter.Fecha_de_Registro = undefined;
    this.listConfig.filter.Tipo_de_Ingreso_de_Gasto = "";
    this.listConfig.filter.Orden_de_Trabajo = "";
    this.listConfig.filter.Numero_de_Vuelo = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Tramo_de_Vuelo = "";
    this.listConfig.filter.Salida = "";
    this.listConfig.filter.Destino = "";
    this.listConfig.filter.Empleado = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.empleado_total_mxn = "";
    this.listConfig.filter.empleado_total_usd = "";
    this.listConfig.filter.empleado_total_eur = "";
    this.listConfig.filter.empleado_total_libras = "";
    this.listConfig.filter.empleado_total_cad = "";
    this.listConfig.filter.aeronave_total_mxn = "";
    this.listConfig.filter.aeronave_total_usd = "";
    this.listConfig.filter.aeronave_total_eur = "";
    this.listConfig.filter.aeronave_total_libras = "";
    this.listConfig.filter.aeronave_total_cad = "";
    this.listConfig.filter.Observaciones = "";

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

//INICIA - BRID:3123 - Ocultar columnas - Autor: Francisco Javier Martínez Urbina - Actualización: 9/23/2021 5:13:47 PM
this.brf.HideFieldofMultirenglon(this.displayedColumns, "Estatus"); this.brf.HideFieldofMultirenglon(this.displayedColumns, "Tramo_de_Vuelo");
//TERMINA - BRID:3123

//rulesAfterCreationList_ExecuteBusinessRulesEnd

  }
  
  rulesBeforeCreationList() {
    //rulesBeforeCreationList_ExecuteBusinessRulesInit

//INICIA - BRID:2235 - Solo puede dar de alta, ediar o borrar gastos de vuelo de los vuelos donde el está dentro de la tripulación. - Autor: Lizeth Villa - Actualización: 4/28/2021 11:08:49 PM
if( this.brf.EvaluaQuery("SELECT GLOBAL[USERROLEID]", 1, 'ABC123')==this.brf.TryParseInt('13', '13') ) { this.brf.SetFilteronList(this.listConfig,"exec spMostarGastosXUsuario GLOBAL[USERID]");} else {}
//TERMINA - BRID:2235


//INICIA - BRID:2853 - Solo puede dar de alta, editar o borrar gastos de vuelo de los vuelos donde el está dentro de la tripulación. - Autor: Lizeth Villa - Actualización: 4/30/2021 11:00:05 PM
if( this.brf.EvaluaQuery("SELECT GLOBAL[USERROLEID]	", 1, 'ABC123')==this.brf.TryParseInt('13', '13') ) { this.brf.SetFilteronList(this.listConfig,"Gastos_de_Vuelo.Numero_de_vuelo in (select sv.Folio from Solicitud_de_Vuelo sv with(nolock) inner join DBO.fncVuelosTripulante(GLOBAL[USERID]) t on sv.Folio = t.vueloid");} else {}
//TERMINA - BRID:2853


//INICIA - BRID:6440 - Si es rol Piloto 13 mostrarle solo los gastos de vuelo donde el usuario logueado sea el empleado - Autor: Francisco Javier Martínez Urbina - Actualización: 9/24/2021 5:42:13 PM
if( this.brf.TryParseInt(this.brf.ReplaceVAR('USERROLEID'), this.brf.ReplaceVAR('USERROLEID'))==this.brf.TryParseInt('13', '13') ) { this.brf.SetFilteronList(this.listConfig,"Gastos_de_Vuelo.Folio IN (SELECT Folio FROM gastos_de_vuelo WITH(NOLOCK) WHERE Empleado = GLOBAL[USERID]");} else {}
//TERMINA - BRID:6440

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

  remove(row: Gastos_de_Vuelo) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Gastos_de_VueloService
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
  ActionPrint(dataRow: Gastos_de_Vuelo) {

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
,'Fecha de Registro'
,'Tipo de Ingreso de Gasto'
,'Orden de Trabajo'
,'Número de Vuelo'
,'Matrícula'
,'Tramo de Vuelo'
,'Salida'
,'Destino'
,'Empleado'
,'Estatus'
,'Total MXN'
,'Total USD'
,'Total EUR'
,'Total LIBRAS'
,'Total CAD'
,'Observaciones'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Fecha_de_Registro
,x.Tipo_de_Ingreso_de_Gasto_Tipo_de_Ingreso_de_Gasto.Descripcion
,x.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden
,x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
,x.Matricula_Aeronave.Matricula
,x.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo
,x.Salida_Aeropuertos.Descripcion
,x.Destino_Aeropuertos.Descripcion
,x.Empleado_Spartan_User.Name
,x.Estatus_Estatus_de_Gastos_de_Vuelo.Descripcion
,x.empleado_total_mxn
,x.empleado_total_usd
,x.empleado_total_eur
,x.empleado_total_libras
,x.empleado_total_cad
,x.aeronave_total_mxn
,x.aeronave_total_usd
,x.aeronave_total_eur
,x.aeronave_total_libras
,x.aeronave_total_cad
,x.Observaciones
		  
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
    pdfMake.createPdf(pdfDefinition).download('Gastos_de_Vuelo.pdf');
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
        buttonLabel="Copiar";
      break;
      case 2: title = "Exportar Excel"; buttonLabel="Exportar"; break;
      case 3: title = "Exportar CSV"; buttonLabel="Exportar"; break;
      case 4: title = "Exportar PDF"; buttonLabel="Exportar"; break;
      case 5: title = "Imprimir"; buttonLabel="Imprimir"; break;
    }


    this.dialogo
      .open(DialogConfirmExportComponent, {
        data: {
          mensaje: `Seleccione una opción`,
          titulo: title,
          buttonLabel:buttonLabel
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
          this._Gastos_de_VueloService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Gastos_de_Vuelos;
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
          this._Gastos_de_VueloService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Gastos_de_Vuelos;
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
        'Tipo de Ingreso de Gasto ': fields.Tipo_de_Ingreso_de_Gasto_Tipo_de_Ingreso_de_Gasto.Descripcion,
        'Orden de Trabajo ': fields.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
        'Número de Vuelo ': fields.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Tramo de Vuelo ': fields.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo,
        'Salida ': fields.Salida_Aeropuertos.Descripcion,
        'Destino 1': fields.Destino_Aeropuertos.Descripcion,
        'Empleado ': fields.Empleado_Spartan_User.Name,
        'Estatus ': fields.Estatus_Estatus_de_Gastos_de_Vuelo.Descripcion,
        'Total MXN ': fields.empleado_total_mxn,
        'Total USD ': fields.empleado_total_usd,
        'Total EUR ': fields.empleado_total_eur,
        'Total LIBRAS ': fields.empleado_total_libras,
        'Total CAD ': fields.empleado_total_cad,
        'Observaciones ': fields.Observaciones,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Gastos_de_Vuelo  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Fecha_de_Registro: x.Fecha_de_Registro,
      Tipo_de_Ingreso_de_Gasto: x.Tipo_de_Ingreso_de_Gasto_Tipo_de_Ingreso_de_Gasto.Descripcion,
      Orden_de_Trabajo: x.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
      Numero_de_Vuelo: x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Matricula: x.Matricula_Aeronave.Matricula,
      Tramo_de_Vuelo: x.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo,
      Salida: x.Salida_Aeropuertos.Descripcion,
      Destino: x.Destino_Aeropuertos.Descripcion,
      Empleado: x.Empleado_Spartan_User.Name,
      Estatus: x.Estatus_Estatus_de_Gastos_de_Vuelo.Descripcion,
      empleado_total_mxn: x.empleado_total_mxn,
      empleado_total_usd: x.empleado_total_usd,
      empleado_total_eur: x.empleado_total_eur,
      empleado_total_libras: x.empleado_total_libras,
      empleado_total_cad: x.empleado_total_cad,
      aeronave_total_mxn: x.aeronave_total_mxn,
      aeronave_total_usd: x.aeronave_total_usd,
      aeronave_total_eur: x.aeronave_total_eur,
      aeronave_total_libras: x.aeronave_total_libras,
      aeronave_total_cad: x.aeronave_total_cad,
      Observaciones: x.Observaciones,

    }));

    this.excelService.exportToCsv(result, 'Gastos_de_Vuelo',  ['Folio'    ,'Fecha_de_Registro'  ,'Tipo_de_Ingreso_de_Gasto'  ,'Orden_de_Trabajo'  ,'Numero_de_Vuelo'  ,'Matricula'  ,'Tramo_de_Vuelo'  ,'Salida'  ,'Destino'  ,'Empleado'  ,'Estatus'  ,'empleado_total_mxn'  ,'empleado_total_usd'  ,'empleado_total_eur'  ,'empleado_total_libras'  ,'empleado_total_cad'  ,'aeronave_total_mxn'  ,'aeronave_total_usd'  ,'aeronave_total_eur'  ,'aeronave_total_libras'  ,'aeronave_total_cad'  ,'Observaciones' ]);
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
    template += '          <th>Tipo de Ingreso de Gasto</th>';
    template += '          <th>Orden de Trabajo</th>';
    template += '          <th>Número de Vuelo</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Tramo de Vuelo</th>';
    template += '          <th>Salida</th>';
    template += '          <th>Destino</th>';
    template += '          <th>Empleado</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Total MXN</th>';
    template += '          <th>Total USD</th>';
    template += '          <th>Total EUR</th>';
    template += '          <th>Total LIBRAS</th>';
    template += '          <th>Total CAD</th>';
    template += '          <th>Observaciones</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Fecha_de_Registro + '</td>';
      template += '          <td>' + element.Tipo_de_Ingreso_de_Gasto_Tipo_de_Ingreso_de_Gasto.Descripcion + '</td>';
      template += '          <td>' + element.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo + '</td>';
      template += '          <td>' + element.Salida_Aeropuertos.Descripcion + '</td>';
      template += '          <td>' + element.Destino_Aeropuertos.Descripcion + '</td>';
      template += '          <td>' + element.Empleado_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Gastos_de_Vuelo.Descripcion + '</td>';
      template += '          <td>' + element.empleado_total_mxn + '</td>';
      template += '          <td>' + element.empleado_total_usd + '</td>';
      template += '          <td>' + element.empleado_total_eur + '</td>';
      template += '          <td>' + element.empleado_total_libras + '</td>';
      template += '          <td>' + element.empleado_total_cad + '</td>';
      template += '          <td>' + element.aeronave_total_mxn + '</td>';
      template += '          <td>' + element.aeronave_total_usd + '</td>';
      template += '          <td>' + element.aeronave_total_eur + '</td>';
      template += '          <td>' + element.aeronave_total_libras + '</td>';
      template += '          <td>' + element.aeronave_total_cad + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
		  
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
	template += '\t Fecha de Registro';
	template += '\t Tipo de Ingreso de Gasto';
	template += '\t Orden de Trabajo';
	template += '\t Número de Vuelo';
	template += '\t Matrícula';
	template += '\t Tramo de Vuelo';
	template += '\t Salida';
	template += '\t Destino';
	template += '\t Empleado';
	template += '\t Estatus';
	template += '\t Total MXN';
	template += '\t Total USD';
	template += '\t Total EUR';
	template += '\t Total LIBRAS';
	template += '\t Total CAD';
	template += '\t Observaciones';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Fecha_de_Registro;
      template += '\t ' + element.Tipo_de_Ingreso_de_Gasto_Tipo_de_Ingreso_de_Gasto.Descripcion;
      template += '\t ' + element.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden;
      template += '\t ' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo;
      template += '\t ' + element.Salida_Aeropuertos.Descripcion;
      template += '\t ' + element.Destino_Aeropuertos.Descripcion;
      template += '\t ' + element.Empleado_Spartan_User.Name;
      template += '\t ' + element.Estatus_Estatus_de_Gastos_de_Vuelo.Descripcion;
	  template += '\t ' + element.empleado_total_mxn;
	  template += '\t ' + element.empleado_total_usd;
	  template += '\t ' + element.empleado_total_eur;
	  template += '\t ' + element.empleado_total_libras;
	  template += '\t ' + element.empleado_total_cad;
	  template += '\t ' + element.aeronave_total_mxn;
	  template += '\t ' + element.aeronave_total_usd;
	  template += '\t ' + element.aeronave_total_eur;
	  template += '\t ' + element.aeronave_total_libras;
	  template += '\t ' + element.aeronave_total_cad;
	  template += '\t ' + element.Observaciones;

	  template += '\n';
    });

    return template;
  }

}

export class Gastos_de_VueloDataSource implements DataSource<Gastos_de_Vuelo>
{
  private subject = new BehaviorSubject<Gastos_de_Vuelo[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Gastos_de_VueloService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Gastos_de_Vuelo[]> {
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
if (data.MRWhere.length > 0){
        if(condition != null && condition.length > 0){
          condition = condition + " AND " + data.MRWhere;
        }
        if(condition == null || condition.length == 0){
          condition = data.MRWhere;
        }
      }
  
      if(data.MRSort.length > 0){
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
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Gastos_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Gastos_de_Vuelos);
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
      condition += " and Gastos_de_Vuelo.Folio = " + data.filter.Folio;
    if (data.filter.Fecha_de_Registro)
      condition += " and CONVERT(VARCHAR(10), Gastos_de_Vuelo.Fecha_de_Registro, 102)  = '" + moment(data.filter.Fecha_de_Registro).format("YYYY.MM.DD") + "'";
    if (data.filter.Tipo_de_Ingreso_de_Gasto != "")
      condition += " and Tipo_de_Ingreso_de_Gasto.Descripcion like '%" + data.filter.Tipo_de_Ingreso_de_Gasto + "%' ";
    if (data.filter.Orden_de_Trabajo != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.Orden_de_Trabajo + "%' ";
    if (data.filter.Numero_de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Numero_de_Vuelo + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Tramo_de_Vuelo != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Tramo_de_Vuelo + "%' ";
    if (data.filter.Salida != "")
      condition += " and Aeropuertos.Descripcion like '%" + data.filter.Salida + "%' ";
    if (data.filter.Destino != "")
      condition += " and Aeropuertos.Descripcion like '%" + data.filter.Destino + "%' ";
    if (data.filter.Empleado != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Empleado + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Gastos_de_Vuelo.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.empleado_total_mxn != "")
      condition += " and Gastos_de_Vuelo.empleado_total_mxn = " + data.filter.empleado_total_mxn;
    if (data.filter.empleado_total_usd != "")
      condition += " and Gastos_de_Vuelo.empleado_total_usd = " + data.filter.empleado_total_usd;
    if (data.filter.empleado_total_eur != "")
      condition += " and Gastos_de_Vuelo.empleado_total_eur = " + data.filter.empleado_total_eur;
    if (data.filter.empleado_total_libras != "")
      condition += " and Gastos_de_Vuelo.empleado_total_libras = " + data.filter.empleado_total_libras;
    if (data.filter.empleado_total_cad != "")
      condition += " and Gastos_de_Vuelo.empleado_total_cad = " + data.filter.empleado_total_cad;
    if (data.filter.aeronave_total_mxn != "")
      condition += " and Gastos_de_Vuelo.aeronave_total_mxn = " + data.filter.aeronave_total_mxn;
    if (data.filter.aeronave_total_usd != "")
      condition += " and Gastos_de_Vuelo.aeronave_total_usd = " + data.filter.aeronave_total_usd;
    if (data.filter.aeronave_total_eur != "")
      condition += " and Gastos_de_Vuelo.aeronave_total_eur = " + data.filter.aeronave_total_eur;
    if (data.filter.aeronave_total_libras != "")
      condition += " and Gastos_de_Vuelo.aeronave_total_libras = " + data.filter.aeronave_total_libras;
    if (data.filter.aeronave_total_cad != "")
      condition += " and Gastos_de_Vuelo.aeronave_total_cad = " + data.filter.aeronave_total_cad;
    if (data.filter.Observaciones != "")
      condition += " and Gastos_de_Vuelo.Observaciones like '%" + data.filter.Observaciones + "%' ";

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
        sort = " Gastos_de_Vuelo.Folio " + data.sortDirecction;
        break;
      case "Fecha_de_Registro":
        sort = " Gastos_de_Vuelo.Fecha_de_Registro " + data.sortDirecction;
        break;
      case "Tipo_de_Ingreso_de_Gasto":
        sort = " Tipo_de_Ingreso_de_Gasto.Descripcion " + data.sortDirecction;
        break;
      case "Orden_de_Trabajo":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "Numero_de_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Tramo_de_Vuelo":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
        break;
      case "Salida":
        sort = " Aeropuertos.Descripcion " + data.sortDirecction;
        break;
      case "Destino":
        sort = " Aeropuertos.Descripcion " + data.sortDirecction;
        break;
      case "Empleado":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Gastos_de_Vuelo.Descripcion " + data.sortDirecction;
        break;
      case "empleado_total_mxn":
        sort = " Gastos_de_Vuelo.empleado_total_mxn " + data.sortDirecction;
        break;
      case "empleado_total_usd":
        sort = " Gastos_de_Vuelo.empleado_total_usd " + data.sortDirecction;
        break;
      case "empleado_total_eur":
        sort = " Gastos_de_Vuelo.empleado_total_eur " + data.sortDirecction;
        break;
      case "empleado_total_libras":
        sort = " Gastos_de_Vuelo.empleado_total_libras " + data.sortDirecction;
        break;
      case "empleado_total_cad":
        sort = " Gastos_de_Vuelo.empleado_total_cad " + data.sortDirecction;
        break;
      case "aeronave_total_mxn":
        sort = " Gastos_de_Vuelo.aeronave_total_mxn " + data.sortDirecction;
        break;
      case "aeronave_total_usd":
        sort = " Gastos_de_Vuelo.aeronave_total_usd " + data.sortDirecction;
        break;
      case "aeronave_total_eur":
        sort = " Gastos_de_Vuelo.aeronave_total_eur " + data.sortDirecction;
        break;
      case "aeronave_total_libras":
        sort = " Gastos_de_Vuelo.aeronave_total_libras " + data.sortDirecction;
        break;
      case "aeronave_total_cad":
        sort = " Gastos_de_Vuelo.aeronave_total_cad " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Gastos_de_Vuelo.Observaciones " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
	|| (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)) 
	{
      if (typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
        condition += " AND Gastos_de_Vuelo.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Gastos_de_Vuelo.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
	|| (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro) 
        condition += " and CONVERT(VARCHAR(10), Gastos_de_Vuelo.Fecha_de_Registro, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Registro).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro) 
        condition += " and CONVERT(VARCHAR(10), Gastos_de_Vuelo.Fecha_de_Registro, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Registro).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Tipo_de_Ingreso_de_Gasto != 'undefined' && data.filterAdvanced.Tipo_de_Ingreso_de_Gasto)) {
      switch (data.filterAdvanced.Tipo_de_Ingreso_de_GastoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Ingreso_de_Gasto.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Ingreso_de_Gasto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Ingreso_de_Gasto.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Ingreso_de_Gasto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Ingreso_de_Gasto.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Ingreso_de_Gasto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Ingreso_de_Gasto.Descripcion = '" + data.filterAdvanced.Tipo_de_Ingreso_de_Gasto + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_Ingreso_de_GastoMultiple != null && data.filterAdvanced.Tipo_de_Ingreso_de_GastoMultiple.length > 0) {
      var Tipo_de_Ingreso_de_Gastods = data.filterAdvanced.Tipo_de_Ingreso_de_GastoMultiple.join(",");
      condition += " AND Gastos_de_Vuelo.Tipo_de_Ingreso_de_Gasto In (" + Tipo_de_Ingreso_de_Gastods + ")";
    }
    if ((typeof data.filterAdvanced.Orden_de_Trabajo != 'undefined' && data.filterAdvanced.Orden_de_Trabajo)) {
      switch (data.filterAdvanced.Orden_de_TrabajoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.Orden_de_Trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Orden_de_Trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Orden_de_Trabajo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.Orden_de_Trabajo + "'";
          break;
      }
    } else if (data.filterAdvanced.Orden_de_TrabajoMultiple != null && data.filterAdvanced.Orden_de_TrabajoMultiple.length > 0) {
      var Orden_de_Trabajods = data.filterAdvanced.Orden_de_TrabajoMultiple.join(",");
      condition += " AND Gastos_de_Vuelo.Orden_de_Trabajo In (" + Orden_de_Trabajods + ")";
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
      condition += " AND Gastos_de_Vuelo.Numero_de_Vuelo In (" + Numero_de_Vuelods + ")";
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
      condition += " AND Gastos_de_Vuelo.Matricula In (" + Matriculads + ")";
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
      condition += " AND Gastos_de_Vuelo.Tramo_de_Vuelo In (" + Tramo_de_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Salida != 'undefined' && data.filterAdvanced.Salida)) {
      switch (data.filterAdvanced.SalidaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Descripcion LIKE '" + data.filterAdvanced.Salida + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Salida + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Salida + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Descripcion = '" + data.filterAdvanced.Salida + "'";
          break;
      }
    } else if (data.filterAdvanced.SalidaMultiple != null && data.filterAdvanced.SalidaMultiple.length > 0) {
      var Salidads = data.filterAdvanced.SalidaMultiple.join(",");
      condition += " AND Gastos_de_Vuelo.Salida In (" + Salidads + ")";
    }
    if ((typeof data.filterAdvanced.Destino != 'undefined' && data.filterAdvanced.Destino)) {
      switch (data.filterAdvanced.DestinoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Descripcion LIKE '" + data.filterAdvanced.Destino + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Destino + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Destino + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Descripcion = '" + data.filterAdvanced.Destino + "'";
          break;
      }
    } else if (data.filterAdvanced.DestinoMultiple != null && data.filterAdvanced.DestinoMultiple.length > 0) {
      var Destinods = data.filterAdvanced.DestinoMultiple.join(",");
      condition += " AND Gastos_de_Vuelo.Destino In (" + Destinods + ")";
    }
    if ((typeof data.filterAdvanced.Empleado != 'undefined' && data.filterAdvanced.Empleado)) {
      switch (data.filterAdvanced.EmpleadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Empleado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Empleado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Empleado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Empleado + "'";
          break;
      }
    } else if (data.filterAdvanced.EmpleadoMultiple != null && data.filterAdvanced.EmpleadoMultiple.length > 0) {
      var Empleadods = data.filterAdvanced.EmpleadoMultiple.join(",");
      condition += " AND Gastos_de_Vuelo.Empleado In (" + Empleadods + ")";
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Gastos_de_Vuelo.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Gastos_de_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Gastos_de_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Gastos_de_Vuelo.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Gastos_de_Vuelo.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.fromempleado_total_mxn != 'undefined' && data.filterAdvanced.fromempleado_total_mxn)
	|| (typeof data.filterAdvanced.toempleado_total_mxn != 'undefined' && data.filterAdvanced.toempleado_total_mxn)) 
	{
      if (typeof data.filterAdvanced.fromempleado_total_mxn != 'undefined' && data.filterAdvanced.fromempleado_total_mxn)
        condition += " AND Gastos_de_Vuelo.empleado_total_mxn >= " + data.filterAdvanced.fromempleado_total_mxn;

      if (typeof data.filterAdvanced.toempleado_total_mxn != 'undefined' && data.filterAdvanced.toempleado_total_mxn) 
        condition += " AND Gastos_de_Vuelo.empleado_total_mxn <= " + data.filterAdvanced.toempleado_total_mxn;
    }
    if ((typeof data.filterAdvanced.fromempleado_total_usd != 'undefined' && data.filterAdvanced.fromempleado_total_usd)
	|| (typeof data.filterAdvanced.toempleado_total_usd != 'undefined' && data.filterAdvanced.toempleado_total_usd)) 
	{
      if (typeof data.filterAdvanced.fromempleado_total_usd != 'undefined' && data.filterAdvanced.fromempleado_total_usd)
        condition += " AND Gastos_de_Vuelo.empleado_total_usd >= " + data.filterAdvanced.fromempleado_total_usd;

      if (typeof data.filterAdvanced.toempleado_total_usd != 'undefined' && data.filterAdvanced.toempleado_total_usd) 
        condition += " AND Gastos_de_Vuelo.empleado_total_usd <= " + data.filterAdvanced.toempleado_total_usd;
    }
    if ((typeof data.filterAdvanced.fromempleado_total_eur != 'undefined' && data.filterAdvanced.fromempleado_total_eur)
	|| (typeof data.filterAdvanced.toempleado_total_eur != 'undefined' && data.filterAdvanced.toempleado_total_eur)) 
	{
      if (typeof data.filterAdvanced.fromempleado_total_eur != 'undefined' && data.filterAdvanced.fromempleado_total_eur)
        condition += " AND Gastos_de_Vuelo.empleado_total_eur >= " + data.filterAdvanced.fromempleado_total_eur;

      if (typeof data.filterAdvanced.toempleado_total_eur != 'undefined' && data.filterAdvanced.toempleado_total_eur) 
        condition += " AND Gastos_de_Vuelo.empleado_total_eur <= " + data.filterAdvanced.toempleado_total_eur;
    }
    if ((typeof data.filterAdvanced.fromempleado_total_libras != 'undefined' && data.filterAdvanced.fromempleado_total_libras)
	|| (typeof data.filterAdvanced.toempleado_total_libras != 'undefined' && data.filterAdvanced.toempleado_total_libras)) 
	{
      if (typeof data.filterAdvanced.fromempleado_total_libras != 'undefined' && data.filterAdvanced.fromempleado_total_libras)
        condition += " AND Gastos_de_Vuelo.empleado_total_libras >= " + data.filterAdvanced.fromempleado_total_libras;

      if (typeof data.filterAdvanced.toempleado_total_libras != 'undefined' && data.filterAdvanced.toempleado_total_libras) 
        condition += " AND Gastos_de_Vuelo.empleado_total_libras <= " + data.filterAdvanced.toempleado_total_libras;
    }
    if ((typeof data.filterAdvanced.fromempleado_total_cad != 'undefined' && data.filterAdvanced.fromempleado_total_cad)
	|| (typeof data.filterAdvanced.toempleado_total_cad != 'undefined' && data.filterAdvanced.toempleado_total_cad)) 
	{
      if (typeof data.filterAdvanced.fromempleado_total_cad != 'undefined' && data.filterAdvanced.fromempleado_total_cad)
        condition += " AND Gastos_de_Vuelo.empleado_total_cad >= " + data.filterAdvanced.fromempleado_total_cad;

      if (typeof data.filterAdvanced.toempleado_total_cad != 'undefined' && data.filterAdvanced.toempleado_total_cad) 
        condition += " AND Gastos_de_Vuelo.empleado_total_cad <= " + data.filterAdvanced.toempleado_total_cad;
    }
    if ((typeof data.filterAdvanced.fromaeronave_total_mxn != 'undefined' && data.filterAdvanced.fromaeronave_total_mxn)
	|| (typeof data.filterAdvanced.toaeronave_total_mxn != 'undefined' && data.filterAdvanced.toaeronave_total_mxn)) 
	{
      if (typeof data.filterAdvanced.fromaeronave_total_mxn != 'undefined' && data.filterAdvanced.fromaeronave_total_mxn)
        condition += " AND Gastos_de_Vuelo.aeronave_total_mxn >= " + data.filterAdvanced.fromaeronave_total_mxn;

      if (typeof data.filterAdvanced.toaeronave_total_mxn != 'undefined' && data.filterAdvanced.toaeronave_total_mxn) 
        condition += " AND Gastos_de_Vuelo.aeronave_total_mxn <= " + data.filterAdvanced.toaeronave_total_mxn;
    }
    if ((typeof data.filterAdvanced.fromaeronave_total_usd != 'undefined' && data.filterAdvanced.fromaeronave_total_usd)
	|| (typeof data.filterAdvanced.toaeronave_total_usd != 'undefined' && data.filterAdvanced.toaeronave_total_usd)) 
	{
      if (typeof data.filterAdvanced.fromaeronave_total_usd != 'undefined' && data.filterAdvanced.fromaeronave_total_usd)
        condition += " AND Gastos_de_Vuelo.aeronave_total_usd >= " + data.filterAdvanced.fromaeronave_total_usd;

      if (typeof data.filterAdvanced.toaeronave_total_usd != 'undefined' && data.filterAdvanced.toaeronave_total_usd) 
        condition += " AND Gastos_de_Vuelo.aeronave_total_usd <= " + data.filterAdvanced.toaeronave_total_usd;
    }
    if ((typeof data.filterAdvanced.fromaeronave_total_eur != 'undefined' && data.filterAdvanced.fromaeronave_total_eur)
	|| (typeof data.filterAdvanced.toaeronave_total_eur != 'undefined' && data.filterAdvanced.toaeronave_total_eur)) 
	{
      if (typeof data.filterAdvanced.fromaeronave_total_eur != 'undefined' && data.filterAdvanced.fromaeronave_total_eur)
        condition += " AND Gastos_de_Vuelo.aeronave_total_eur >= " + data.filterAdvanced.fromaeronave_total_eur;

      if (typeof data.filterAdvanced.toaeronave_total_eur != 'undefined' && data.filterAdvanced.toaeronave_total_eur) 
        condition += " AND Gastos_de_Vuelo.aeronave_total_eur <= " + data.filterAdvanced.toaeronave_total_eur;
    }
    if ((typeof data.filterAdvanced.fromaeronave_total_libras != 'undefined' && data.filterAdvanced.fromaeronave_total_libras)
	|| (typeof data.filterAdvanced.toaeronave_total_libras != 'undefined' && data.filterAdvanced.toaeronave_total_libras)) 
	{
      if (typeof data.filterAdvanced.fromaeronave_total_libras != 'undefined' && data.filterAdvanced.fromaeronave_total_libras)
        condition += " AND Gastos_de_Vuelo.aeronave_total_libras >= " + data.filterAdvanced.fromaeronave_total_libras;

      if (typeof data.filterAdvanced.toaeronave_total_libras != 'undefined' && data.filterAdvanced.toaeronave_total_libras) 
        condition += " AND Gastos_de_Vuelo.aeronave_total_libras <= " + data.filterAdvanced.toaeronave_total_libras;
    }
    if ((typeof data.filterAdvanced.fromaeronave_total_cad != 'undefined' && data.filterAdvanced.fromaeronave_total_cad)
	|| (typeof data.filterAdvanced.toaeronave_total_cad != 'undefined' && data.filterAdvanced.toaeronave_total_cad)) 
	{
      if (typeof data.filterAdvanced.fromaeronave_total_cad != 'undefined' && data.filterAdvanced.fromaeronave_total_cad)
        condition += " AND Gastos_de_Vuelo.aeronave_total_cad >= " + data.filterAdvanced.fromaeronave_total_cad;

      if (typeof data.filterAdvanced.toaeronave_total_cad != 'undefined' && data.filterAdvanced.toaeronave_total_cad) 
        condition += " AND Gastos_de_Vuelo.aeronave_total_cad <= " + data.filterAdvanced.toaeronave_total_cad;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Gastos_de_Vuelo.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Gastos_de_Vuelo.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Gastos_de_Vuelo.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Gastos_de_Vuelo.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
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
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Gastos_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Gastos_de_Vuelos);
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
