import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { CMP_a_CotizarService } from "src/app/api-services/CMP_a_Cotizar.service";
import { CMP_a_Cotizar } from "src/app/models/CMP_a_Cotizar";
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
import { CMP_a_CotizarIndexRules } from 'src/app/shared/businessRules/CMP_a_Cotizar-index-rules';
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
  selector: "app-list-CMP_a_Cotizar",
  templateUrl: "./list-CMP_a_Cotizar.component.html",
  styleUrls: ["./list-CMP_a_Cotizar.component.scss"],
})
export class ListCMP_a_CotizarComponent extends CMP_a_CotizarIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Cotizacion",
    "Orden_de_Trabajo",
    "Tipo_de_Reporte",
    "Codigo_Computarizado",
    "Tiempo_Estandar_de_Ejecucion",
    "tiempo_a_cobrar",
    "Tiempo_a_Cobrar_Rampa",
    "Costo_HR_Tecnico",
    "Costo_HR_Rampa",
    "Motivo_de_Cambio_de_Tarifa",
    "Estatus",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Cotizacion",
      "Orden_de_Trabajo",
      "Tipo_de_Reporte",
      "Codigo_Computarizado",
      "Tiempo_Estandar_de_Ejecucion",
      "tiempo_a_cobrar",
      "Tiempo_a_Cobrar_Rampa",
      "Costo_HR_Tecnico",
      "Costo_HR_Rampa",
      "Motivo_de_Cambio_de_Tarifa",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Cotizacion_filtro",
      "Orden_de_Trabajo_filtro",
      "Tipo_de_Reporte_filtro",
      "Codigo_Computarizado_filtro",
      "Tiempo_Estandar_de_Ejecucion_filtro",
      "tiempo_a_cobrar_filtro",
      "Tiempo_a_Cobrar_Rampa_filtro",
      "Costo_HR_Tecnico_filtro",
      "Costo_HR_Rampa_filtro",
      "Motivo_de_Cambio_de_Tarifa_filtro",
      "Estatus_filtro",

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
      Cotizacion: "",
      Orden_de_Trabajo: "",
      Tipo_de_Reporte: "",
      Codigo_Computarizado: "",
      Tiempo_Estandar_de_Ejecucion: "",
      tiempo_a_cobrar: "",
      Tiempo_a_Cobrar_Rampa: "",
      Costo_HR_Tecnico: "",
      Costo_HR_Rampa: "",
      Motivo_de_Cambio_de_Tarifa: "",
      Estatus: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      CotizacionFilter: "",
      Cotizacion: "",
      CotizacionMultiple: "",
      Orden_de_TrabajoFilter: "",
      Orden_de_Trabajo: "",
      Orden_de_TrabajoMultiple: "",
      Tipo_de_ReporteFilter: "",
      Tipo_de_Reporte: "",
      Tipo_de_ReporteMultiple: "",
      Codigo_ComputarizadoFilter: "",
      Codigo_Computarizado: "",
      Codigo_ComputarizadoMultiple: "",
      fromTiempo_Estandar_de_Ejecucion: "",
      toTiempo_Estandar_de_Ejecucion: "",
      fromtiempo_a_cobrar: "",
      totiempo_a_cobrar: "",
      fromTiempo_a_Cobrar_Rampa: "",
      toTiempo_a_Cobrar_Rampa: "",
      fromCosto_HR_Tecnico: "",
      toCosto_HR_Tecnico: "",
      fromCosto_HR_Rampa: "",
      toCosto_HR_Rampa: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

    }
  };

  dataSource: CMP_a_CotizarDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: CMP_a_CotizarDataSource;
  dataClipboard: any;

  constructor(
    private _CMP_a_CotizarService: CMP_a_CotizarService,
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
    this.dataSource = new CMP_a_CotizarDataSource(
      this._CMP_a_CotizarService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.CMP_a_Cotizar)
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
    this.listConfig.filter.Cotizacion = "";
    this.listConfig.filter.Orden_de_Trabajo = "";
    this.listConfig.filter.Tipo_de_Reporte = "";
    this.listConfig.filter.Codigo_Computarizado = "";
    this.listConfig.filter.Tiempo_Estandar_de_Ejecucion = "";
    this.listConfig.filter.tiempo_a_cobrar = "";
    this.listConfig.filter.Tiempo_a_Cobrar_Rampa = "";
    this.listConfig.filter.Costo_HR_Tecnico = "";
    this.listConfig.filter.Costo_HR_Rampa = "";
    this.listConfig.filter.Motivo_de_Cambio_de_Tarifa = "";
    this.listConfig.filter.Estatus = "";

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

//INICIA - BRID:248 - En el listado, si no está en la charola de incluidas en cotización hay que ocultar la columna "Cotización" - Autor: Francisco Javier Martínez Urbina - Actualización: 2/9/2021 5:36:52 PM
if( this.brf.EvaluaQuery("SELECT 'GLOBAL[Phase]'", 1, 'ABC123')!=this.brf.TryParseInt('4', '4') ) { if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"CotizacionNumero_de_Cotizacion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"CotizacionNumero_de_Cotizacion")  }} else { if("false".trim() == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"CotizacionNumero_de_Cotizacion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"CotizacionNumero_de_Cotizacion")  }}
//TERMINA - BRID:248


//INICIA - BRID:356 - Ocultar columnas dinamicas modal Aerovics - Autor: Felipe Rodríguez - Actualización: 2/15/2021 2:07:56 PM
if( this.brf.TryParseInt(this.brf.ReplaceVAR('USERID'), this.brf.ReplaceVAR('USERID'))==this.brf.TryParseInt('12', '12') ) { if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"EstatusDescripcion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"EstatusDescripcion")  }} else {}
//TERMINA - BRID:356


//INICIA - BRID:369 - Ocultar columnas dinamicas modal Aerovics - Autor: operacion ventas - Actualización: 2/24/2021 3:20:21 PM
if( this.brf.TryParseInt(this.brf.ReplaceVAR('USERID'), this.brf.ReplaceVAR('USERID'))==this.brf.TryParseInt('11', '11') ) { if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"")  }} else {}
//TERMINA - BRID:369

//rulesAfterCreationList_ExecuteBusinessRulesEnd



  }
  
  rulesBeforeCreationList() {
    //rulesBeforeCreationList_ExecuteBusinessRulesInit
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

  remove(row: CMP_a_Cotizar) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._CMP_a_CotizarService
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
  ActionPrint(dataRow: CMP_a_Cotizar) {

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
,'Cotización'
,'Orden de Trabajo'
,'Tipo de Reporte'
,'Código Computarizado'
,'Tiempo Estándar de Ejecución'
,'Tiempo a Cobrar Técnico / Inspector'
,'Tiempo a Cobrar Rampa'
,'Costo HR $ Técnico'
,'Costo HR $ Rampa'
,'Motivo de Cambio de Tarifa'
,'Estatus'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Cotizacion_Cotizacion.Numero_de_Cotizacion
,x.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden
,x.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion
,x.Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda
,x.Tiempo_Estandar_de_Ejecucion
,x.tiempo_a_cobrar
,x.Tiempo_a_Cobrar_Rampa
,x.Costo_HR_Tecnico
,x.Costo_HR_Rampa
,x.Motivo_de_Cambio_de_Tarifa
,x.Estatus_Estatus_de_CMP_a_Cotizar.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('CMP_a_Cotizar.pdf');
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
          this._CMP_a_CotizarService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.CMP_a_Cotizars;
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
          this._CMP_a_CotizarService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.CMP_a_Cotizars;
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
        'Cotización ': fields.Cotizacion_Cotizacion.Numero_de_Cotizacion,
        'Orden de Trabajo ': fields.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
        'Tipo de Reporte ': fields.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion,
        'Código Computarizado ': fields.Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda,
        'Tiempo Estándar de Ejecución ': fields.Tiempo_Estandar_de_Ejecucion,
        'Tiempo a Cobrar Técnico / Inspector ': fields.tiempo_a_cobrar,
        'Tiempo a Cobrar Rampa ': fields.Tiempo_a_Cobrar_Rampa,
        'Costo HR $ Técnico ': fields.Costo_HR_Tecnico,
        'Costo HR $ Rampa ': fields.Costo_HR_Rampa,
        'Motivo de Cambio de Tarifa ': fields.Motivo_de_Cambio_de_Tarifa,
        'Estatus ': fields.Estatus_Estatus_de_CMP_a_Cotizar.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `CMP_a_Cotizar  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Cotizacion: x.Cotizacion_Cotizacion.Numero_de_Cotizacion,
      Orden_de_Trabajo: x.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
      Tipo_de_Reporte: x.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion,
      Codigo_Computarizado: x.Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda,
      Tiempo_Estandar_de_Ejecucion: x.Tiempo_Estandar_de_Ejecucion,
      tiempo_a_cobrar: x.tiempo_a_cobrar,
      Tiempo_a_Cobrar_Rampa: x.Tiempo_a_Cobrar_Rampa,
      Costo_HR_Tecnico: x.Costo_HR_Tecnico,
      Costo_HR_Rampa: x.Costo_HR_Rampa,
      Motivo_de_Cambio_de_Tarifa: x.Motivo_de_Cambio_de_Tarifa,
      Estatus: x.Estatus_Estatus_de_CMP_a_Cotizar.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'CMP_a_Cotizar',  ['Folio'    ,'Cotizacion'  ,'Orden_de_Trabajo'  ,'Tipo_de_Reporte'  ,'Codigo_Computarizado'  ,'Tiempo_Estandar_de_Ejecucion'  ,'tiempo_a_cobrar'  ,'Tiempo_a_Cobrar_Rampa'  ,'Costo_HR_Tecnico'  ,'Costo_HR_Rampa'  ,'Motivo_de_Cambio_de_Tarifa'  ,'Estatus' ]);
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
    template += '          <th>Cotización</th>';
    template += '          <th>Orden de Trabajo</th>';
    template += '          <th>Tipo de Reporte</th>';
    template += '          <th>Código Computarizado</th>';
    template += '          <th>Tiempo Estándar de Ejecución</th>';
    template += '          <th>Tiempo a Cobrar Técnico / Inspector</th>';
    template += '          <th>Tiempo a Cobrar Rampa</th>';
    template += '          <th>Costo HR $ Técnico</th>';
    template += '          <th>Costo HR $ Rampa</th>';
    template += '          <th>Motivo de Cambio de Tarifa</th>';
    template += '          <th>Estatus</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Cotizacion_Cotizacion.Numero_de_Cotizacion + '</td>';
      template += '          <td>' + element.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion + '</td>';
      template += '          <td>' + element.Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda + '</td>';
      template += '          <td>' + element.Tiempo_Estandar_de_Ejecucion + '</td>';
      template += '          <td>' + element.tiempo_a_cobrar + '</td>';
      template += '          <td>' + element.Tiempo_a_Cobrar_Rampa + '</td>';
      template += '          <td>' + element.Costo_HR_Tecnico + '</td>';
      template += '          <td>' + element.Costo_HR_Rampa + '</td>';
      template += '          <td>' + element.Motivo_de_Cambio_de_Tarifa + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_CMP_a_Cotizar.Descripcion + '</td>';
		  
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
	template += '\t Cotización';
	template += '\t Orden de Trabajo';
	template += '\t Tipo de Reporte';
	template += '\t Código Computarizado';
	template += '\t Tiempo Estándar de Ejecución';
	template += '\t Tiempo a Cobrar Técnico / Inspector';
	template += '\t Tiempo a Cobrar Rampa';
	template += '\t Costo HR $ Técnico';
	template += '\t Costo HR $ Rampa';
	template += '\t Motivo de Cambio de Tarifa';
	template += '\t Estatus';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Cotizacion_Cotizacion.Numero_de_Cotizacion;
      template += '\t ' + element.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden;
      template += '\t ' + element.Tipo_de_Reporte_Tipo_de_Reporte.Descripcion;
      template += '\t ' + element.Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda;
	  template += '\t ' + element.Tiempo_Estandar_de_Ejecucion;
	  template += '\t ' + element.tiempo_a_cobrar;
	  template += '\t ' + element.Tiempo_a_Cobrar_Rampa;
	  template += '\t ' + element.Costo_HR_Tecnico;
	  template += '\t ' + element.Costo_HR_Rampa;
	  template += '\t ' + element.Motivo_de_Cambio_de_Tarifa;
      template += '\t ' + element.Estatus_Estatus_de_CMP_a_Cotizar.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class CMP_a_CotizarDataSource implements DataSource<CMP_a_Cotizar>
{
  private subject = new BehaviorSubject<CMP_a_Cotizar[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: CMP_a_CotizarService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<CMP_a_Cotizar[]> {
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
              const longest = result.CMP_a_Cotizars.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.CMP_a_Cotizars);
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
      condition += " and CMP_a_Cotizar.Folio = " + data.filter.Folio;
    if (data.filter.Cotizacion != "")
      condition += " and Cotizacion.Numero_de_Cotizacion like '%" + data.filter.Cotizacion + "%' ";
    if (data.filter.Orden_de_Trabajo != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.Orden_de_Trabajo + "%' ";
    if (data.filter.Tipo_de_Reporte != "")
      condition += " and Tipo_de_Reporte.Descripcion like '%" + data.filter.Tipo_de_Reporte + "%' ";
    if (data.filter.Codigo_Computarizado != "")
      condition += " and Codigo_Computarizado.Descripcion_Busqueda like '%" + data.filter.Codigo_Computarizado + "%' ";
    if (data.filter.Tiempo_Estandar_de_Ejecucion != "")
      condition += " and CMP_a_Cotizar.Tiempo_Estandar_de_Ejecucion = '" + data.filter.Tiempo_Estandar_de_Ejecucion + "'";
    if (data.filter.tiempo_a_cobrar != "")
      condition += " and CMP_a_Cotizar.tiempo_a_cobrar = " + data.filter.tiempo_a_cobrar;
    if (data.filter.Tiempo_a_Cobrar_Rampa != "")
      condition += " and CMP_a_Cotizar.Tiempo_a_Cobrar_Rampa = " + data.filter.Tiempo_a_Cobrar_Rampa;
    if (data.filter.Costo_HR_Tecnico != "")
      condition += " and CMP_a_Cotizar.Costo_HR_Tecnico = " + data.filter.Costo_HR_Tecnico;
    if (data.filter.Costo_HR_Rampa != "")
      condition += " and CMP_a_Cotizar.Costo_HR_Rampa = " + data.filter.Costo_HR_Rampa;
    if (data.filter.Motivo_de_Cambio_de_Tarifa != "")
      condition += " and CMP_a_Cotizar.Motivo_de_Cambio_de_Tarifa like '%" + data.filter.Motivo_de_Cambio_de_Tarifa + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_CMP_a_Cotizar.Descripcion like '%" + data.filter.Estatus + "%' ";

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
        sort = " CMP_a_Cotizar.Folio " + data.sortDirecction;
        break;
      case "Cotizacion":
        sort = " Cotizacion.Numero_de_Cotizacion " + data.sortDirecction;
        break;
      case "Orden_de_Trabajo":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "Tipo_de_Reporte":
        sort = " Tipo_de_Reporte.Descripcion " + data.sortDirecction;
        break;
      case "Codigo_Computarizado":
        sort = " Codigo_Computarizado.Descripcion_Busqueda " + data.sortDirecction;
        break;
      case "Tiempo_Estandar_de_Ejecucion":
        sort = " CMP_a_Cotizar.Tiempo_Estandar_de_Ejecucion " + data.sortDirecction;
        break;
      case "tiempo_a_cobrar":
        sort = " CMP_a_Cotizar.tiempo_a_cobrar " + data.sortDirecction;
        break;
      case "Tiempo_a_Cobrar_Rampa":
        sort = " CMP_a_Cotizar.Tiempo_a_Cobrar_Rampa " + data.sortDirecction;
        break;
      case "Costo_HR_Tecnico":
        sort = " CMP_a_Cotizar.Costo_HR_Tecnico " + data.sortDirecction;
        break;
      case "Costo_HR_Rampa":
        sort = " CMP_a_Cotizar.Costo_HR_Rampa " + data.sortDirecction;
        break;
      case "Motivo_de_Cambio_de_Tarifa":
        sort = " CMP_a_Cotizar.Motivo_de_Cambio_de_Tarifa " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_CMP_a_Cotizar.Descripcion " + data.sortDirecction;
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
        condition += " AND CMP_a_Cotizar.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND CMP_a_Cotizar.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Cotizacion != 'undefined' && data.filterAdvanced.Cotizacion)) {
      switch (data.filterAdvanced.CotizacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cotizacion.Numero_de_Cotizacion LIKE '" + data.filterAdvanced.Cotizacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cotizacion.Numero_de_Cotizacion LIKE '%" + data.filterAdvanced.Cotizacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cotizacion.Numero_de_Cotizacion LIKE '%" + data.filterAdvanced.Cotizacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cotizacion.Numero_de_Cotizacion = '" + data.filterAdvanced.Cotizacion + "'";
          break;
      }
    } else if (data.filterAdvanced.CotizacionMultiple != null && data.filterAdvanced.CotizacionMultiple.length > 0) {
      var Cotizacionds = data.filterAdvanced.CotizacionMultiple.join(",");
      condition += " AND CMP_a_Cotizar.Cotizacion In (" + Cotizacionds + ")";
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
      condition += " AND CMP_a_Cotizar.Orden_de_Trabajo In (" + Orden_de_Trabajods + ")";
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
      condition += " AND CMP_a_Cotizar.Tipo_de_Reporte In (" + Tipo_de_Reporteds + ")";
    }
    if ((typeof data.filterAdvanced.Codigo_Computarizado != 'undefined' && data.filterAdvanced.Codigo_Computarizado)) {
      switch (data.filterAdvanced.Codigo_ComputarizadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '" + data.filterAdvanced.Codigo_Computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Codigo_Computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Codigo_Computarizado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda = '" + data.filterAdvanced.Codigo_Computarizado + "'";
          break;
      }
    } else if (data.filterAdvanced.Codigo_ComputarizadoMultiple != null && data.filterAdvanced.Codigo_ComputarizadoMultiple.length > 0) {
      var Codigo_Computarizadods = data.filterAdvanced.Codigo_ComputarizadoMultiple.join(",");
      condition += " AND CMP_a_Cotizar.Codigo_Computarizado In (" + Codigo_Computarizadods + ")";
    }
    if ((typeof data.filterAdvanced.fromTiempo_Estandar_de_Ejecucion != 'undefined' && data.filterAdvanced.fromTiempo_Estandar_de_Ejecucion)
	|| (typeof data.filterAdvanced.toTiempo_Estandar_de_Ejecucion != 'undefined' && data.filterAdvanced.toTiempo_Estandar_de_Ejecucion)) 
	{
		if (typeof data.filterAdvanced.fromTiempo_Estandar_de_Ejecucion != 'undefined' && data.filterAdvanced.fromTiempo_Estandar_de_Ejecucion) 
			condition += " and CMP_a_Cotizar.Tiempo_Estandar_de_Ejecucion >= '" + data.filterAdvanced.fromTiempo_Estandar_de_Ejecucion + "'";
      
		if (typeof data.filterAdvanced.toTiempo_Estandar_de_Ejecucion != 'undefined' && data.filterAdvanced.toTiempo_Estandar_de_Ejecucion) 
			condition += " and CMP_a_Cotizar.Tiempo_Estandar_de_Ejecucion <= '" + data.filterAdvanced.toTiempo_Estandar_de_Ejecucion + "'";
    }
    if ((typeof data.filterAdvanced.fromtiempo_a_cobrar != 'undefined' && data.filterAdvanced.fromtiempo_a_cobrar)
	|| (typeof data.filterAdvanced.totiempo_a_cobrar != 'undefined' && data.filterAdvanced.totiempo_a_cobrar)) 
	{
      if (typeof data.filterAdvanced.fromtiempo_a_cobrar != 'undefined' && data.filterAdvanced.fromtiempo_a_cobrar)
        condition += " AND CMP_a_Cotizar.tiempo_a_cobrar >= " + data.filterAdvanced.fromtiempo_a_cobrar;

      if (typeof data.filterAdvanced.totiempo_a_cobrar != 'undefined' && data.filterAdvanced.totiempo_a_cobrar) 
        condition += " AND CMP_a_Cotizar.tiempo_a_cobrar <= " + data.filterAdvanced.totiempo_a_cobrar;
    }
    if ((typeof data.filterAdvanced.fromTiempo_a_Cobrar_Rampa != 'undefined' && data.filterAdvanced.fromTiempo_a_Cobrar_Rampa)
	|| (typeof data.filterAdvanced.toTiempo_a_Cobrar_Rampa != 'undefined' && data.filterAdvanced.toTiempo_a_Cobrar_Rampa)) 
	{
      if (typeof data.filterAdvanced.fromTiempo_a_Cobrar_Rampa != 'undefined' && data.filterAdvanced.fromTiempo_a_Cobrar_Rampa)
        condition += " AND CMP_a_Cotizar.Tiempo_a_Cobrar_Rampa >= " + data.filterAdvanced.fromTiempo_a_Cobrar_Rampa;

      if (typeof data.filterAdvanced.toTiempo_a_Cobrar_Rampa != 'undefined' && data.filterAdvanced.toTiempo_a_Cobrar_Rampa) 
        condition += " AND CMP_a_Cotizar.Tiempo_a_Cobrar_Rampa <= " + data.filterAdvanced.toTiempo_a_Cobrar_Rampa;
    }
    if ((typeof data.filterAdvanced.fromCosto_HR_Tecnico != 'undefined' && data.filterAdvanced.fromCosto_HR_Tecnico)
	|| (typeof data.filterAdvanced.toCosto_HR_Tecnico != 'undefined' && data.filterAdvanced.toCosto_HR_Tecnico)) 
	{
      if (typeof data.filterAdvanced.fromCosto_HR_Tecnico != 'undefined' && data.filterAdvanced.fromCosto_HR_Tecnico)
        condition += " AND CMP_a_Cotizar.Costo_HR_Tecnico >= " + data.filterAdvanced.fromCosto_HR_Tecnico;

      if (typeof data.filterAdvanced.toCosto_HR_Tecnico != 'undefined' && data.filterAdvanced.toCosto_HR_Tecnico) 
        condition += " AND CMP_a_Cotizar.Costo_HR_Tecnico <= " + data.filterAdvanced.toCosto_HR_Tecnico;
    }
    if ((typeof data.filterAdvanced.fromCosto_HR_Rampa != 'undefined' && data.filterAdvanced.fromCosto_HR_Rampa)
	|| (typeof data.filterAdvanced.toCosto_HR_Rampa != 'undefined' && data.filterAdvanced.toCosto_HR_Rampa)) 
	{
      if (typeof data.filterAdvanced.fromCosto_HR_Rampa != 'undefined' && data.filterAdvanced.fromCosto_HR_Rampa)
        condition += " AND CMP_a_Cotizar.Costo_HR_Rampa >= " + data.filterAdvanced.fromCosto_HR_Rampa;

      if (typeof data.filterAdvanced.toCosto_HR_Rampa != 'undefined' && data.filterAdvanced.toCosto_HR_Rampa) 
        condition += " AND CMP_a_Cotizar.Costo_HR_Rampa <= " + data.filterAdvanced.toCosto_HR_Rampa;
    }
    switch (data.filterAdvanced.Motivo_de_Cambio_de_TarifaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND CMP_a_Cotizar.Motivo_de_Cambio_de_Tarifa LIKE '" + data.filterAdvanced.Motivo_de_Cambio_de_Tarifa + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND CMP_a_Cotizar.Motivo_de_Cambio_de_Tarifa LIKE '%" + data.filterAdvanced.Motivo_de_Cambio_de_Tarifa + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND CMP_a_Cotizar.Motivo_de_Cambio_de_Tarifa LIKE '%" + data.filterAdvanced.Motivo_de_Cambio_de_Tarifa + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND CMP_a_Cotizar.Motivo_de_Cambio_de_Tarifa = '" + data.filterAdvanced.Motivo_de_Cambio_de_Tarifa + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_CMP_a_Cotizar.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_CMP_a_Cotizar.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_CMP_a_Cotizar.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_CMP_a_Cotizar.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND CMP_a_Cotizar.Estatus In (" + Estatusds + ")";
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
              const longest = result.CMP_a_Cotizars.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.CMP_a_Cotizars);
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
