import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Codigo_ComputarizadoService } from "src/app/api-services/Codigo_Computarizado.service";
import { Codigo_Computarizado } from "src/app/models/Codigo_Computarizado";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, Renderer2, OnInit, ViewChild } from "@angular/core";
import { CollectionViewer } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of } from "rxjs";
import { catchError, finalize, concatMap, switchMap, mergeMap, tap } from "rxjs/operators";
import { SpartanService } from "src/app/api-services/spartan.service";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import * as AppConstants from "../../../app-constants";
import { StorageKeys } from "../../../app-constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { Codigo_ComputarizadoIndexRules } from 'src/app/shared/businessRules/Codigo_Computarizado-index-rules';
import { DialogConfirmExportComponent } from "./../../../shared/views/dialogs/dialog-confirm-export/dialog-confirm-export.component";
import { Enumerations } from 'src/app/models/enumerations';
import { ExcelService } from "src/app/api-services/excel.service";
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogPrintFormatComponent } from './../../../shared/views/dialogs/dialog-print-format/dialog-print-format.component';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { Router } from '@angular/router';

import _, { map } from 'underscore';
import * as moment from "moment";
import Swal from 'sweetalert2';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-list-Codigo_Computarizado",
  templateUrl: "./list-Codigo_Computarizado.component.html",
  styleUrls: ["./list-Codigo_Computarizado.component.scss"],
})
export class ListCodigo_ComputarizadoComponent extends Codigo_ComputarizadoIndexRules implements OnInit, AfterViewInit, AfterViewChecked {

  permisos: ObjectPermission[] = [];

  displayedColumns = [
    "acciones",
    "Modelo",
    "Codigo",
    "Descripcion",
    "Tiempo_Estandar",
    //"Descripcion_Busqueda",
    "Por_Defecto_en_Cotizacion",

  ];


  public listConfig = {
    columns: [
      "acciones",
      "Codigo",
      "Modelo",
      "Descripcion",
      "Tiempo_Estandar",
      //"Descripcion_Busqueda",
      "Por_Defecto_en_Cotizacion",

    ],

    columns_filters: [
      "acciones_filtro",
      "Codigo_filtro",
      "Modelo_filtro",
      "Descripcion_filtro",
      "Tiempo_Estandar_filtro",
      //"Descripcion_Busqueda_filtro",
      "Por_Defecto_en_Cotizacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Modelo: "",
      Codigo: "",
      Descripcion: "",
      Tiempo_Estandar: "",
      Descripcion_Busqueda: "",
      Por_Defecto_en_Cotizacion: "",

    },
    filterAdvanced: {
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromCodigo: "",
      toCodigo: "",
      fromTiempo_Estandar: "",
      toTiempo_Estandar: "",

    }
  };

  dataSource: Codigo_ComputarizadoDataSource | null;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Codigo_ComputarizadoDataSource;
  dataClipboard: any;
  brf: BusinessRulesFunctions;
  constructor(
    private _Codigo_ComputarizadoService: Codigo_ComputarizadoService,
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
    private SpartanService: SpartanService,
    renderer: Renderer2,
    route: Router
  ) {
    super();
    const lang = this._localHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);
    this.brf = new BusinessRulesFunctions(renderer, SpartanService, localStorageHelper);

  }

  ngOnInit() {
    //this.rulesOnInit();
    this.dataSource = new Codigo_ComputarizadoDataSource(this._Codigo_ComputarizadoService, this._file);

    this.init();
    this._seguridad.permisos(AppConstants.Permisos.Codigo_Computarizado)
      .subscribe((response) => {
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
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Codigo = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Tiempo_Estandar = "";
    //this.listConfig.filter.Descripcion_Busqueda = "";
    this.listConfig.filter.Por_Defecto_en_Cotizacion = undefined;

    this.listConfig.page = 0;
    this.loadData();
  }


  refresh() {
    this.listConfig.page = 0;
    this.loadData();
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


  //#region Eliminar
  remove(row: Codigo_Computarizado) {
    this._messages.confirmation("¿Está seguro de que desea eliminar este registro?", "")
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        console.log(row.Descripcion_Busqueda);
        this.brf.EvaluaQueryAsync(`delete Codigo_Computarizado where Descripcion_Busqueda = '${row.Descripcion_Busqueda}'`, 1, 'ABC123')
          .then(() => {

            Swal.fire({
              icon: 'success',
              title: "Registro eliminado correctamente",
              showConfirmButton: false,
              timer: 3000,
            });

            this.loadData();
          });


      });
  }
  //#endregion


  /**
   * Imprimir
   * @param dataRow : Información de Formato
   */
  ActionPrint(dataRow: Codigo_Computarizado) {

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
      'Modelo'
      , 'Código'
      , 'Descripción'
      , 'Tiempo Estándar'
      //, 'Descripción Búsqueda'
      , 'Por Defecto en Cotización'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Modelo_Modelos.Descripcion
        , x.Codigo
        , x.Descripcion
        , x.Tiempo_Estandar
        //, x.Descripcion_Busqueda
        , x.Por_Defecto_en_Cotizacion

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

    pdfMake.createPdf(pdfDefinition).download('Codigo_Computarizado.pdf');
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
          this._Codigo_ComputarizadoService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Codigo_Computarizados;
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
          this._Codigo_ComputarizadoService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Codigo_Computarizados;
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
        'Modelo': fields.Modelo_Modelos.Descripcion,
        'Código': fields.Codigo,
        'Descripción': fields.Descripcion,
        'Tiempo Estándar': fields.Tiempo_Estandar,
        //'Descripción Búsqueda': fields.Descripcion_Busqueda,
        'Por_Defecto_en_Cotizacion': fields.Por_Defecto_en_Cotizacion ? 'SI' : 'NO',

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Codigo_Computarizado  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Modelo: x.Modelo_Modelos.Descripcion,
      Codigo: x.Codigo,
      Descripcion: x.Descripcion,
      Tiempo_Estandar: x.Tiempo_Estandar,
      //Descripcion_Busqueda: x.Descripcion_Busqueda,
      Por_Defecto_en_Cotizacion: x.Por_Defecto_en_Cotizacion,

    }));

    this.excelService.exportToCsv(result, 'Codigo_Computarizado', ['Codigo', 'Modelo', 'Descripcion', 'Tiempo_Estandar',
      //'Descripcion_Busqueda', 
      'Por_Defecto_en_Cotizacion']);
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
    template += '          <th>Modelo</th>';
    template += '          <th>Código</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>Tiempo Estándar</th>';
    //template += '          <th>Descripción Búsqueda</th>';
    template += '          <th>Por Defecto en Cotización</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Codigo + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.Tiempo_Estandar + '</td>';
      //template += '          <td>' + element.Descripcion_Busqueda + '</td>';
      template += '          <td>' + element.Por_Defecto_en_Cotizacion + '</td>';

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
    template += '\t Modelo';
    template += '\t Código';
    template += '\t Descripción';
    template += '\t Tiempo Estándar';
    //template += '\t Descripción Búsqueda';
    template += '\t Por Defecto en Cotización';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.Codigo;
      template += '\t ' + element.Descripcion;
      template += '\t ' + element.Tiempo_Estandar;
      //template += '\t ' + element.Descripcion_Busqueda;
      template += '\t ' + element.Por_Defecto_en_Cotizacion;

      template += '\n';
    });

    return template;
  }

}

export class Codigo_ComputarizadoDataSource implements DataSource<Codigo_Computarizado>
{
  private subject = new BehaviorSubject<Codigo_Computarizado[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(
    private service: Codigo_ComputarizadoService,
    private _file: SpartanFileService
  ) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Codigo_Computarizado[]> {
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
    let page = data.page + 1;

    this.service.listaSelAll(page * data.size - data.size + 1, page * data.size, condition, sort)
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: any) => {
        data.styles = [];
        data.columns.forEach((column, index) => {
          if (column === 'Codigo') { // Clave primaria
            data.styles[column] = `width: ${9}%; flex: 0 0 ${9}% !important;`;
          }
          else if (column.includes('Descripcion')) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Codigo_Computarizados.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length}%; flex: 0 0 ${length}% !important;`;
            } catch (error) {
              ;
            }
          }
          else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Codigo_Computarizados.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 2}%; flex: 0 0 ${length * 2}% !important;`;
            } catch (error) {
              ;
            }
          }
        });
        this.subject.next(result.Codigo_Computarizados);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Codigo != "")
      condition += " and Codigo_Computarizado.Codigo like '%" + data.filter.Codigo + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Codigo_Computarizado.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Tiempo_Estandar != "")
      condition += " and Codigo_Computarizado.Tiempo_Estandar = '" + data.filter.Tiempo_Estandar + "'";
    if (data.filter.Descripcion_Busqueda != "")
      condition += " and Codigo_Computarizado.Descripcion_Busqueda like '%" + data.filter.Descripcion_Busqueda + "%' ";
    if (data.filter.Por_Defecto_en_Cotizacion && data.filter.Por_Defecto_en_Cotizacion != "2") {
      if (data.filter.Por_Defecto_en_Cotizacion == "0" || data.filter.Por_Defecto_en_Cotizacion == "") {
        condition += " and (Codigo_Computarizado.Por_Defecto_en_Cotizacion = 0 or Codigo_Computarizado.Por_Defecto_en_Cotizacion is null)";
      } else {
        condition += " and Codigo_Computarizado.Por_Defecto_en_Cotizacion = 1";
      }
    }

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Codigo":
        sort = " Codigo_Computarizado.Codigo " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Codigo_Computarizado.Descripcion " + data.sortDirecction;
        break;
      case "Tiempo_Estandar":
        sort = " Codigo_Computarizado.Tiempo_Estandar " + data.sortDirecction;
        break;
      case "Descripcion_Busqueda":
        sort = " Codigo_Computarizado.Descripcion_Busqueda " + data.sortDirecction;
        break;
      case "Por_Defecto_en_Cotizacion":
        sort = " Codigo_Computarizado.Por_Defecto_en_Cotizacion " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
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
      condition += " AND Codigo_Computarizado.Modelo In (" + Modelods + ")";
    }
    switch (data.filterAdvanced.CodigoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Codigo_Computarizado.Codigo LIKE '" + data.filterAdvanced.Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Codigo_Computarizado.Codigo LIKE '%" + data.filterAdvanced.Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Codigo_Computarizado.Codigo LIKE '%" + data.filterAdvanced.Codigo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Codigo_Computarizado.Codigo = '" + data.filterAdvanced.Codigo + "'";
        break;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Codigo_Computarizado.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Codigo_Computarizado.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Codigo_Computarizado.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Codigo_Computarizado.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromTiempo_Estandar != 'undefined' && data.filterAdvanced.fromTiempo_Estandar)
      || (typeof data.filterAdvanced.toTiempo_Estandar != 'undefined' && data.filterAdvanced.toTiempo_Estandar)) {
      if (typeof data.filterAdvanced.fromTiempo_Estandar != 'undefined' && data.filterAdvanced.fromTiempo_Estandar)
        condition += " and Codigo_Computarizado.Tiempo_Estandar >= '" + data.filterAdvanced.fromTiempo_Estandar + "'";

      if (typeof data.filterAdvanced.toTiempo_Estandar != 'undefined' && data.filterAdvanced.toTiempo_Estandar)
        condition += " and Codigo_Computarizado.Tiempo_Estandar <= '" + data.filterAdvanced.toTiempo_Estandar + "'";
    }
    switch (data.filterAdvanced.Descripcion_BusquedaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '" + data.filterAdvanced.Descripcion_Busqueda + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Descripcion_Busqueda + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Descripcion_Busqueda + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Codigo_Computarizado.Descripcion_Busqueda = '" + data.filterAdvanced.Descripcion_Busqueda + "'";
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
          if (column === 'Codigo') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Codigo_Computarizados.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Codigo_Computarizados);
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
