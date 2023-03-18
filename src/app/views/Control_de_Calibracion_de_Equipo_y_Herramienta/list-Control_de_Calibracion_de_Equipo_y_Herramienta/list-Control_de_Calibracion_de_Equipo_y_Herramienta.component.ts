import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Control_de_Calibracion_de_Equipo_y_HerramientaService } from "src/app/api-services/Control_de_Calibracion_de_Equipo_y_Herramienta.service";
import { Control_de_Calibracion_de_Equipo_y_Herramienta } from "src/app/models/Control_de_Calibracion_de_Equipo_y_Herramienta";
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
import { Control_de_Calibracion_de_Equipo_y_HerramientaIndexRules } from 'src/app/shared/businessRules/Control_de_Calibracion_de_Equipo_y_Herramienta-index-rules';
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
  selector: "app-list-Control_de_Calibracion_de_Equipo_y_Herramienta",
  templateUrl: "./list-Control_de_Calibracion_de_Equipo_y_Herramienta.component.html",
  styleUrls: ["./list-Control_de_Calibracion_de_Equipo_y_Herramienta.component.scss"],
})
export class ListControl_de_Calibracion_de_Equipo_y_HerramientaComponent extends Control_de_Calibracion_de_Equipo_y_HerramientaIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No_de_Codigo",
    "No__de_Parte___Descripcion",
    "No__de_Serie",
    "Fecha_Ultima_Calibracion",
    "Fecha_Proxima_Calibracion",
    "Manual_del_Usuario",
    "Alcance",
    "Estatus",
    "Notas",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No_de_Codigo",
      "No__de_Parte___Descripcion",
      "No__de_Serie",
      "Fecha_Ultima_Calibracion",
      "Fecha_Proxima_Calibracion",
      "Manual_del_Usuario",
      "Alcance",
      "Estatus",
      "Notas",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No_de_Codigo_filtro",
      "No__de_Parte___Descripcion_filtro",
      "No__de_Serie_filtro",
      "Fecha_Ultima_Calibracion_filtro",
      "Fecha_Proxima_Calibracion_filtro",
      "Manual_del_Usuario_filtro",
      "Alcance_filtro",
      "Estatus_filtro",
      "Notas_filtro",
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
      No_de_Codigo: "",
      No__de_Parte___Descripcion: "",
      No__de_Serie: "",
      Fecha_Ultima_Calibracion: null,
      Fecha_Proxima_Calibracion: null,
      Manual_del_Usuario: "",
      Alcance: "",
      Estatus: "",
      Notas: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      No_de_CodigoFilter: "",
      No_de_Codigo: "",
      No_de_CodigoMultiple: "",
      fromFecha_Ultima_Calibracion: "",
      toFecha_Ultima_Calibracion: "",
      fromFecha_Proxima_Calibracion: "",
      toFecha_Proxima_Calibracion: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

    }
  };

  dataSource: Control_de_Calibracion_de_Equipo_y_HerramientaDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Control_de_Calibracion_de_Equipo_y_HerramientaDataSource;
  dataClipboard: any;
  today = new Date()

  constructor(
    private _Control_de_Calibracion_de_Equipo_y_HerramientaService: Control_de_Calibracion_de_Equipo_y_HerramientaService,
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
    this.dataSource = new Control_de_Calibracion_de_Equipo_y_HerramientaDataSource(
      this._Control_de_Calibracion_de_Equipo_y_HerramientaService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Control_de_Calibracion_de_Equipo_y_Herramienta)
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
    this.listConfig.filter.No_de_Codigo = "";
    this.listConfig.filter.No__de_Parte___Descripcion = "";
    this.listConfig.filter.No__de_Serie = "";
    this.listConfig.filter.Fecha_Ultima_Calibracion = undefined;
    this.listConfig.filter.Fecha_Proxima_Calibracion = undefined;
    this.listConfig.filter.Manual_del_Usuario = "";
    this.listConfig.filter.Alcance = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Notas = "";

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

  remove(row: Control_de_Calibracion_de_Equipo_y_Herramienta) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Control_de_Calibracion_de_Equipo_y_HerramientaService
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
  ActionPrint(dataRow: Control_de_Calibracion_de_Equipo_y_Herramienta) {

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
      , 'No. de Código'
      , 'No. de Parte / Descripción'
      , 'No. de Serie'
      , 'Fecha Última Calibración'
      , 'Fecha Próxima Calibración'
      , 'Manual del Usuario'
      , 'Alcance'
      , 'Estatus'
      , 'Notas'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.No_de_Codigo_Herramientas.Codigo_de_calibracion
        , x.No__de_Parte___Descripcion
        , x.No__de_Serie
        , x.Fecha_Ultima_Calibracion
        , x.Fecha_Proxima_Calibracion
        , x.Manual_del_Usuario
        , x.Alcance
        , x.Estatus_Estatus_de_Calibracion.Descripcion
        , x.Notas

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
    pdfMake.createPdf(pdfDefinition).download('Control_de_Calibracion_de_Equipo_y_Herramienta.pdf');
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
          this._Control_de_Calibracion_de_Equipo_y_HerramientaService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Control_de_Calibracion_de_Equipo_y_Herramientas;
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
          this._Control_de_Calibracion_de_Equipo_y_HerramientaService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Control_de_Calibracion_de_Equipo_y_Herramientas;
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
        'No. de Código ': fields.No_de_Codigo_Herramientas.Codigo_de_calibracion,
        'No. de Parte / Descripción ': fields.No__de_Parte___Descripcion,
        'No. de Serie ': fields.No__de_Serie,
        'Fecha Última Calibración ': fields.Fecha_Ultima_Calibracion ? momentJS(fields.Fecha_Ultima_Calibracion).format('DD/MM/YYYY') : '',
        'Fecha Próxima Calibración ': fields.Fecha_Proxima_Calibracion ? momentJS(fields.Fecha_Proxima_Calibracion).format('DD/MM/YYYY') : '',
        'Manual del Usuario ': fields.Manual_del_Usuario,
        'Alcance ': fields.Alcance,
        'Estatus ': fields.Estatus_Estatus_de_Calibracion.Descripcion,
        'Notas ': fields.Notas,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Control_de_Calibracion_de_Equipo_y_Herramienta  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No_de_Codigo: x.No_de_Codigo_Herramientas.Codigo_de_calibracion,
      No__de_Parte___Descripcion: x.No__de_Parte___Descripcion,
      No__de_Serie: x.No__de_Serie,
      Fecha_Ultima_Calibracion: x.Fecha_Ultima_Calibracion,
      Fecha_Proxima_Calibracion: x.Fecha_Proxima_Calibracion,
      Manual_del_Usuario: x.Manual_del_Usuario,
      Alcance: x.Alcance,
      Estatus: x.Estatus_Estatus_de_Calibracion.Descripcion,
      Notas: x.Notas,

    }));

    this.excelService.exportToCsv(result, 'Control_de_Calibracion_de_Equipo_y_Herramienta', ['Folio', 'No_de_Codigo', 'No__de_Parte___Descripcion', 'No__de_Serie', 'Fecha_Ultima_Calibracion', 'Fecha_Proxima_Calibracion', 'Manual_del_Usuario', 'Alcance', 'Estatus', 'Notas']);
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
    template += '          <th>No. de Código</th>';
    template += '          <th>No. de Parte / Descripción</th>';
    template += '          <th>No. de Serie</th>';
    template += '          <th>Fecha Última Calibración</th>';
    template += '          <th>Fecha Próxima Calibración</th>';
    template += '          <th>Manual del Usuario</th>';
    template += '          <th>Alcance</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Notas</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No_de_Codigo_Herramientas.Codigo_de_calibracion + '</td>';
      template += '          <td>' + element.No__de_Parte___Descripcion + '</td>';
      template += '          <td>' + element.No__de_Serie + '</td>';
      template += '          <td>' + element.Fecha_Ultima_Calibracion + '</td>';
      template += '          <td>' + element.Fecha_Proxima_Calibracion + '</td>';
      template += '          <td>' + element.Manual_del_Usuario + '</td>';
      template += '          <td>' + element.Alcance + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Calibracion.Descripcion + '</td>';
      template += '          <td>' + element.Notas + '</td>';

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
    template += '\t No. de Código';
    template += '\t No. de Parte / Descripción';
    template += '\t No. de Serie';
    template += '\t Fecha Última Calibración';
    template += '\t Fecha Próxima Calibración';
    template += '\t Manual del Usuario';
    template += '\t Alcance';
    template += '\t Estatus';
    template += '\t Notas';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.No_de_Codigo_Herramientas.Codigo_de_calibracion;
      template += '\t ' + element.No__de_Parte___Descripcion;
      template += '\t ' + element.No__de_Serie;
      template += '\t ' + element.Fecha_Ultima_Calibracion;
      template += '\t ' + element.Fecha_Proxima_Calibracion;
      template += '\t ' + element.Manual_del_Usuario;
      template += '\t ' + element.Alcance;
      template += '\t ' + element.Estatus_Estatus_de_Calibracion.Descripcion;
      template += '\t ' + element.Notas;

      template += '\n';
    });

    return template;
  }

}

export class Control_de_Calibracion_de_Equipo_y_HerramientaDataSource implements DataSource<Control_de_Calibracion_de_Equipo_y_Herramienta>
{
  private subject = new BehaviorSubject<Control_de_Calibracion_de_Equipo_y_Herramienta[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();
  today = new Date()

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Control_de_Calibracion_de_Equipo_y_HerramientaService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Control_de_Calibracion_de_Equipo_y_Herramienta[]> {
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
          } else if (column != 'acciones' && column != 'Certificado_de_Calibracion') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Control_de_Calibracion_de_Equipo_y_Herramientas.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false || column === 'Paquete_de_beneficios') { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });

        console.log(result)
        console.log(data)
        if (result.RowCount > 0) {
          result.Control_de_Calibracion_de_Equipo_y_Herramientas.forEach(element => {

            let date = new Date(element.Fecha_Proxima_Calibracion)
            element.DateMinor = (date <= this.today) ? true : false

          });
        }


        this.subject.next(result.Control_de_Calibracion_de_Equipo_y_Herramientas);
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
      condition += " and Control_de_Calibracion_de_Equipo_y_Herramienta.Folio = " + data.filter.Folio;
    if (data.filter.No_de_Codigo != "")
      condition += " and Herramientas.Codigo_de_calibracion like '%" + data.filter.No_de_Codigo + "%' ";
    if (data.filter.No__de_Parte___Descripcion != "")
      condition += " and Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Parte___Descripcion like '%" + data.filter.No__de_Parte___Descripcion + "%' ";
    if (data.filter.No__de_Serie != "")
      condition += " and Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Serie like '%" + data.filter.No__de_Serie + "%' ";
    if (data.filter.Fecha_Ultima_Calibracion)
      condition += " and CONVERT(VARCHAR(10), Control_de_Calibracion_de_Equipo_y_Herramienta.Fecha_Ultima_Calibracion, 102)  = '" + moment(data.filter.Fecha_Ultima_Calibracion).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_Proxima_Calibracion)
      condition += " and CONVERT(VARCHAR(10), Control_de_Calibracion_de_Equipo_y_Herramienta.Fecha_Proxima_Calibracion, 102)  = '" + moment(data.filter.Fecha_Proxima_Calibracion).format("YYYY.MM.DD") + "'";
    if (data.filter.Manual_del_Usuario != "")
      condition += " and Control_de_Calibracion_de_Equipo_y_Herramienta.Manual_del_Usuario like '%" + data.filter.Manual_del_Usuario + "%' ";
    if (data.filter.Alcance != "")
      condition += " and Control_de_Calibracion_de_Equipo_y_Herramienta.Alcance like '%" + data.filter.Alcance + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Calibracion.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Notas != "")
      condition += " and Control_de_Calibracion_de_Equipo_y_Herramienta.Notas like '%" + data.filter.Notas + "%' ";

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
        sort = " Control_de_Calibracion_de_Equipo_y_Herramienta.Folio " + data.sortDirecction;
        break;
      case "No_de_Codigo":
        sort = " Herramientas.Codigo_de_calibracion " + data.sortDirecction;
        break;
      case "No__de_Parte___Descripcion":
        sort = " Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Parte___Descripcion " + data.sortDirecction;
        break;
      case "No__de_Serie":
        sort = " Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Serie " + data.sortDirecction;
        break;
      case "Fecha_Ultima_Calibracion":
        sort = " Control_de_Calibracion_de_Equipo_y_Herramienta.Fecha_Ultima_Calibracion " + data.sortDirecction;
        break;
      case "Fecha_Proxima_Calibracion":
        sort = " Control_de_Calibracion_de_Equipo_y_Herramienta.Fecha_Proxima_Calibracion " + data.sortDirecction;
        break;
      case "Manual_del_Usuario":
        sort = " Control_de_Calibracion_de_Equipo_y_Herramienta.Manual_del_Usuario " + data.sortDirecction;
        break;
      case "Alcance":
        sort = " Control_de_Calibracion_de_Equipo_y_Herramienta.Alcance " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Calibracion.Descripcion " + data.sortDirecction;
        break;
      case "Notas":
        sort = " Control_de_Calibracion_de_Equipo_y_Herramienta.Notas " + data.sortDirecction;
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
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.No_de_Codigo != 'undefined' && data.filterAdvanced.No_de_Codigo)) {
      switch (data.filterAdvanced.No_de_CodigoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Herramientas.Codigo_de_calibracion LIKE '" + data.filterAdvanced.No_de_Codigo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Herramientas.Codigo_de_calibracion LIKE '%" + data.filterAdvanced.No_de_Codigo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Herramientas.Codigo_de_calibracion LIKE '%" + data.filterAdvanced.No_de_Codigo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Herramientas.Codigo_de_calibracion = '" + data.filterAdvanced.No_de_Codigo + "'";
          break;
      }
    } else if (data.filterAdvanced.No_de_CodigoMultiple != null && data.filterAdvanced.No_de_CodigoMultiple.length > 0) {
      var No_de_Codigods = data.filterAdvanced.No_de_CodigoMultiple.join(",");
      condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.No_de_Codigo In (" + No_de_Codigods + ")";
    }
    switch (data.filterAdvanced.No__de_Parte___DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Parte___Descripcion LIKE '" + data.filterAdvanced.No__de_Parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_Parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_Parte___Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Parte___Descripcion = '" + data.filterAdvanced.No__de_Parte___Descripcion + "'";
        break;
    }
    switch (data.filterAdvanced.No__de_SerieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Serie LIKE '" + data.filterAdvanced.No__de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Serie LIKE '%" + data.filterAdvanced.No__de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Serie LIKE '%" + data.filterAdvanced.No__de_Serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.No__de_Serie = '" + data.filterAdvanced.No__de_Serie + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_Ultima_Calibracion != 'undefined' && data.filterAdvanced.fromFecha_Ultima_Calibracion)
      || (typeof data.filterAdvanced.toFecha_Ultima_Calibracion != 'undefined' && data.filterAdvanced.toFecha_Ultima_Calibracion)) {
      if (typeof data.filterAdvanced.fromFecha_Ultima_Calibracion != 'undefined' && data.filterAdvanced.fromFecha_Ultima_Calibracion)
        condition += " and CONVERT(VARCHAR(10), Control_de_Calibracion_de_Equipo_y_Herramienta.Fecha_Ultima_Calibracion, 102)  >= '" + moment(data.filterAdvanced.fromFecha_Ultima_Calibracion).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_Ultima_Calibracion != 'undefined' && data.filterAdvanced.toFecha_Ultima_Calibracion)
        condition += " and CONVERT(VARCHAR(10), Control_de_Calibracion_de_Equipo_y_Herramienta.Fecha_Ultima_Calibracion, 102)  <= '" + moment(data.filterAdvanced.toFecha_Ultima_Calibracion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_Proxima_Calibracion != 'undefined' && data.filterAdvanced.fromFecha_Proxima_Calibracion)
      || (typeof data.filterAdvanced.toFecha_Proxima_Calibracion != 'undefined' && data.filterAdvanced.toFecha_Proxima_Calibracion)) {
      if (typeof data.filterAdvanced.fromFecha_Proxima_Calibracion != 'undefined' && data.filterAdvanced.fromFecha_Proxima_Calibracion)
        condition += " and CONVERT(VARCHAR(10), Control_de_Calibracion_de_Equipo_y_Herramienta.Fecha_Proxima_Calibracion, 102)  >= '" + moment(data.filterAdvanced.fromFecha_Proxima_Calibracion).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_Proxima_Calibracion != 'undefined' && data.filterAdvanced.toFecha_Proxima_Calibracion)
        condition += " and CONVERT(VARCHAR(10), Control_de_Calibracion_de_Equipo_y_Herramienta.Fecha_Proxima_Calibracion, 102)  <= '" + moment(data.filterAdvanced.toFecha_Proxima_Calibracion).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Manual_del_UsuarioFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Manual_del_Usuario LIKE '" + data.filterAdvanced.Manual_del_Usuario + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Manual_del_Usuario LIKE '%" + data.filterAdvanced.Manual_del_Usuario + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Manual_del_Usuario LIKE '%" + data.filterAdvanced.Manual_del_Usuario + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Manual_del_Usuario = '" + data.filterAdvanced.Manual_del_Usuario + "'";
        break;
    }
    switch (data.filterAdvanced.AlcanceFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Alcance LIKE '" + data.filterAdvanced.Alcance + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Alcance LIKE '%" + data.filterAdvanced.Alcance + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Alcance LIKE '%" + data.filterAdvanced.Alcance + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Alcance = '" + data.filterAdvanced.Alcance + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Calibracion.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Calibracion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Calibracion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Calibracion.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Estatus In (" + Estatusds + ")";
    }
    switch (data.filterAdvanced.NotasFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Notas LIKE '" + data.filterAdvanced.Notas + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Notas LIKE '%" + data.filterAdvanced.Notas + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Notas LIKE '%" + data.filterAdvanced.Notas + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Calibracion_de_Equipo_y_Herramienta.Notas = '" + data.filterAdvanced.Notas + "'";
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
          } else if (column != 'acciones' && column != 'Certificado_de_Calibracion') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Control_de_Calibracion_de_Equipo_y_Herramientas.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false || column === 'Paquete_de_beneficios') { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Control_de_Calibracion_de_Equipo_y_Herramientas);
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
