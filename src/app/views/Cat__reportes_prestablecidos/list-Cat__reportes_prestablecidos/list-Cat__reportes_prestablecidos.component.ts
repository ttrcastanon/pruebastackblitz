import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Cat__reportes_prestablecidosService } from "src/app/api-services/Cat__reportes_prestablecidos.service";
import { Cat__reportes_prestablecidos } from "src/app/models/Cat__reportes_prestablecidos";
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
import { Cat__reportes_prestablecidosIndexRules } from 'src/app/shared/businessRules/Cat__reportes_prestablecidos-index-rules';
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
  selector: "app-list-Cat__reportes_prestablecidos",
  templateUrl: "./list-Cat__reportes_prestablecidos.component.html",
  styleUrls: ["./list-Cat__reportes_prestablecidos.component.scss"],
})
export class ListCat__reportes_prestablecidosComponent extends Cat__reportes_prestablecidosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Reporte_de_inspeccion_de_entrada",
    "Tipo_de_reporte",
    "Prioridad",
    "Tipo_de_Codigo",
    "Codigo_NP",
    "Descripcion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Reporte_de_inspeccion_de_entrada",
      "Tipo_de_reporte",
      "Prioridad",
      "Tipo_de_Codigo",
      "Codigo_NP",
      "Descripcion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Reporte_de_inspeccion_de_entrada_filtro",
      "Tipo_de_reporte_filtro",
      "Prioridad_filtro",
      "Tipo_de_Codigo_filtro",
      "Codigo_NP_filtro",
      "Descripcion_filtro",

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
      Reporte_de_inspeccion_de_entrada: "",
      Tipo_de_reporte: "",
      Prioridad: "",
      Tipo_de_Codigo: "",
      Codigo_NP: "",
      Descripcion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",

    }
  };

  dataSource: Cat__reportes_prestablecidosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Cat__reportes_prestablecidosDataSource;
  dataClipboard: any;

  constructor(
    private _Cat__reportes_prestablecidosService: Cat__reportes_prestablecidosService,
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
    this.dataSource = new Cat__reportes_prestablecidosDataSource(
      this._Cat__reportes_prestablecidosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Cat__reportes_prestablecidos)
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
    this.listConfig.filter.Reporte_de_inspeccion_de_entrada = "";
    this.listConfig.filter.Tipo_de_reporte = "";
    this.listConfig.filter.Prioridad = "";
    this.listConfig.filter.Tipo_de_Codigo = "";
    this.listConfig.filter.Codigo_NP = "";
    this.listConfig.filter.Descripcion = "";

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

  remove(row: Cat__reportes_prestablecidos) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Cat__reportes_prestablecidosService
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
  ActionPrint(dataRow: Cat__reportes_prestablecidos) {

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
,'Reporte de inspección de entrada'
,'Tipo de reporte'
,'Prioridad'
,'Tipo de Código'
,'Código/NP'
,'Descripción'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Reporte_de_inspeccion_de_entrada
,x.Tipo_de_reporte
,x.Prioridad
,x.Tipo_de_Codigo
,x.Codigo_NP
,x.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Cat__reportes_prestablecidos.pdf');
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
          this._Cat__reportes_prestablecidosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Cat__reportes_prestablecidoss;
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
          this._Cat__reportes_prestablecidosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Cat__reportes_prestablecidoss;
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
        'Reporte de inspección de entrada ': fields.Reporte_de_inspeccion_de_entrada,
        'Tipo de reporte ': fields.Tipo_de_reporte,
        'Prioridad ': fields.Prioridad,
        'Tipo de Código ': fields.Tipo_de_Codigo,
        'Código/NP ': fields.Codigo_NP,
        'Descripción ': fields.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Cat__reportes_prestablecidos  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Reporte_de_inspeccion_de_entrada: x.Reporte_de_inspeccion_de_entrada,
      Tipo_de_reporte: x.Tipo_de_reporte,
      Prioridad: x.Prioridad,
      Tipo_de_Codigo: x.Tipo_de_Codigo,
      Codigo_NP: x.Codigo_NP,
      Descripcion: x.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Cat__reportes_prestablecidos',  ['Folio'    ,'Reporte_de_inspeccion_de_entrada'  ,'Tipo_de_reporte'  ,'Prioridad'  ,'Tipo_de_Codigo'  ,'Codigo_NP'  ,'Descripcion' ]);
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
    template += '          <th>Reporte de inspección de entrada</th>';
    template += '          <th>Tipo de reporte</th>';
    template += '          <th>Prioridad</th>';
    template += '          <th>Tipo de Código</th>';
    template += '          <th>Código/NP</th>';
    template += '          <th>Descripción</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Reporte_de_inspeccion_de_entrada + '</td>';
      template += '          <td>' + element.Tipo_de_reporte + '</td>';
      template += '          <td>' + element.Prioridad + '</td>';
      template += '          <td>' + element.Tipo_de_Codigo + '</td>';
      template += '          <td>' + element.Codigo_NP + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
		  
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
	template += '\t Reporte de inspección de entrada';
	template += '\t Tipo de reporte';
	template += '\t Prioridad';
	template += '\t Tipo de Código';
	template += '\t Código/NP';
	template += '\t Descripción';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Reporte_de_inspeccion_de_entrada;
	  template += '\t ' + element.Tipo_de_reporte;
	  template += '\t ' + element.Prioridad;
	  template += '\t ' + element.Tipo_de_Codigo;
	  template += '\t ' + element.Codigo_NP;
	  template += '\t ' + element.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Cat__reportes_prestablecidosDataSource implements DataSource<Cat__reportes_prestablecidos>
{
  private subject = new BehaviorSubject<Cat__reportes_prestablecidos[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Cat__reportes_prestablecidosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Cat__reportes_prestablecidos[]> {
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
              const longest = result.Cat__reportes_prestablecidoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Cat__reportes_prestablecidoss);
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
      condition += " and Cat__reportes_prestablecidos.Folio = " + data.filter.Folio;
    if (data.filter.Reporte_de_inspeccion_de_entrada != "")
      condition += " and Cat__reportes_prestablecidos.Reporte_de_inspeccion_de_entrada like '%" + data.filter.Reporte_de_inspeccion_de_entrada + "%' ";
    if (data.filter.Tipo_de_reporte != "")
      condition += " and Cat__reportes_prestablecidos.Tipo_de_reporte like '%" + data.filter.Tipo_de_reporte + "%' ";
    if (data.filter.Prioridad != "")
      condition += " and Cat__reportes_prestablecidos.Prioridad like '%" + data.filter.Prioridad + "%' ";
    if (data.filter.Tipo_de_Codigo != "")
      condition += " and Cat__reportes_prestablecidos.Tipo_de_Codigo like '%" + data.filter.Tipo_de_Codigo + "%' ";
    if (data.filter.Codigo_NP != "")
      condition += " and Cat__reportes_prestablecidos.Codigo_NP like '%" + data.filter.Codigo_NP + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Cat__reportes_prestablecidos.Descripcion like '%" + data.filter.Descripcion + "%' ";

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
        sort = " Cat__reportes_prestablecidos.Folio " + data.sortDirecction;
        break;
      case "Reporte_de_inspeccion_de_entrada":
        sort = " Cat__reportes_prestablecidos.Reporte_de_inspeccion_de_entrada " + data.sortDirecction;
        break;
      case "Tipo_de_reporte":
        sort = " Cat__reportes_prestablecidos.Tipo_de_reporte " + data.sortDirecction;
        break;
      case "Prioridad":
        sort = " Cat__reportes_prestablecidos.Prioridad " + data.sortDirecction;
        break;
      case "Tipo_de_Codigo":
        sort = " Cat__reportes_prestablecidos.Tipo_de_Codigo " + data.sortDirecction;
        break;
      case "Codigo_NP":
        sort = " Cat__reportes_prestablecidos.Codigo_NP " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Cat__reportes_prestablecidos.Descripcion " + data.sortDirecction;
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
        condition += " AND Cat__reportes_prestablecidos.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Cat__reportes_prestablecidos.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.Reporte_de_inspeccion_de_entradaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cat__reportes_prestablecidos.Reporte_de_inspeccion_de_entrada LIKE '" + data.filterAdvanced.Reporte_de_inspeccion_de_entrada + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cat__reportes_prestablecidos.Reporte_de_inspeccion_de_entrada LIKE '%" + data.filterAdvanced.Reporte_de_inspeccion_de_entrada + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cat__reportes_prestablecidos.Reporte_de_inspeccion_de_entrada LIKE '%" + data.filterAdvanced.Reporte_de_inspeccion_de_entrada + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cat__reportes_prestablecidos.Reporte_de_inspeccion_de_entrada = '" + data.filterAdvanced.Reporte_de_inspeccion_de_entrada + "'";
        break;
    }
    switch (data.filterAdvanced.Tipo_de_reporteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cat__reportes_prestablecidos.Tipo_de_reporte LIKE '" + data.filterAdvanced.Tipo_de_reporte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cat__reportes_prestablecidos.Tipo_de_reporte LIKE '%" + data.filterAdvanced.Tipo_de_reporte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cat__reportes_prestablecidos.Tipo_de_reporte LIKE '%" + data.filterAdvanced.Tipo_de_reporte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cat__reportes_prestablecidos.Tipo_de_reporte = '" + data.filterAdvanced.Tipo_de_reporte + "'";
        break;
    }
    switch (data.filterAdvanced.PrioridadFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cat__reportes_prestablecidos.Prioridad LIKE '" + data.filterAdvanced.Prioridad + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cat__reportes_prestablecidos.Prioridad LIKE '%" + data.filterAdvanced.Prioridad + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cat__reportes_prestablecidos.Prioridad LIKE '%" + data.filterAdvanced.Prioridad + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cat__reportes_prestablecidos.Prioridad = '" + data.filterAdvanced.Prioridad + "'";
        break;
    }
    switch (data.filterAdvanced.Tipo_de_CodigoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cat__reportes_prestablecidos.Tipo_de_Codigo LIKE '" + data.filterAdvanced.Tipo_de_Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cat__reportes_prestablecidos.Tipo_de_Codigo LIKE '%" + data.filterAdvanced.Tipo_de_Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cat__reportes_prestablecidos.Tipo_de_Codigo LIKE '%" + data.filterAdvanced.Tipo_de_Codigo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cat__reportes_prestablecidos.Tipo_de_Codigo = '" + data.filterAdvanced.Tipo_de_Codigo + "'";
        break;
    }
    switch (data.filterAdvanced.Codigo_NPFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cat__reportes_prestablecidos.Codigo_NP LIKE '" + data.filterAdvanced.Codigo_NP + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cat__reportes_prestablecidos.Codigo_NP LIKE '%" + data.filterAdvanced.Codigo_NP + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cat__reportes_prestablecidos.Codigo_NP LIKE '%" + data.filterAdvanced.Codigo_NP + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cat__reportes_prestablecidos.Codigo_NP = '" + data.filterAdvanced.Codigo_NP + "'";
        break;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cat__reportes_prestablecidos.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cat__reportes_prestablecidos.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cat__reportes_prestablecidos.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cat__reportes_prestablecidos.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
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
              const longest = result.Cat__reportes_prestablecidoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Cat__reportes_prestablecidoss);
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
