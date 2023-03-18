import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Catalogo_codigo_ATAService } from "src/app/api-services/Catalogo_codigo_ATA.service";
import { Catalogo_codigo_ATA } from "src/app/models/Catalogo_codigo_ATA";
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
import { Catalogo_codigo_ATAIndexRules } from 'src/app/shared/businessRules/Catalogo_codigo_ATA-index-rules';
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
  selector: "app-list-Catalogo_codigo_ATA",
  templateUrl: "./list-Catalogo_codigo_ATA.component.html",
  styleUrls: ["./list-Catalogo_codigo_ATA.component.scss"],
})
export class ListCatalogo_codigo_ATAComponent extends Catalogo_codigo_ATAIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Codigo_ATA",
    "Descripcion",
    "Codigo_ATA_Descripcion",
    "Modelo",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Codigo_ATA",
      "Descripcion",
      "Codigo_ATA_Descripcion",
      "Modelo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_ATA_filtro",
      "Descripcion_filtro",
      "Codigo_ATA_Descripcion_filtro",
      "Modelo_filtro",

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
      Codigo_ATA: "",
      Descripcion: "",
      Codigo_ATA_Descripcion: "",
      Modelo: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",

    }
  };

  dataSource: Catalogo_codigo_ATADataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Catalogo_codigo_ATADataSource;
  dataClipboard: any;

  constructor(
    private _Catalogo_codigo_ATAService: Catalogo_codigo_ATAService,
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
    this.dataSource = new Catalogo_codigo_ATADataSource(
      this._Catalogo_codigo_ATAService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Catalogo_codigo_ATA)
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
    this.listConfig.filter.Codigo_ATA = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Codigo_ATA_Descripcion = "";
    this.listConfig.filter.Modelo = "";

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

//INICIA - BRID:4185 - Ocultar columna "Codigo_ATA_Descripcion" - Autor: Administrador - Actualización: 7/20/2021 1:22:04 PM
if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Codigo_ATA_Descripcion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Codigo_ATA_Descripcion")  }
//TERMINA - BRID:4185

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

  remove(row: Catalogo_codigo_ATA) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Catalogo_codigo_ATAService
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
  ActionPrint(dataRow: Catalogo_codigo_ATA) {

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
,'Código ATA'
,'Descripción'
,'Código ATA/Descripción'
,'Modelo'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Codigo_ATA
,x.Descripcion
,x.Codigo_ATA_Descripcion
,x.Modelo_Modelos.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Catalogo_codigo_ATA.pdf');
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
          this._Catalogo_codigo_ATAService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Catalogo_codigo_ATAs;
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
          this._Catalogo_codigo_ATAService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Catalogo_codigo_ATAs;
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
        'Código ATA ': fields.Codigo_ATA,
        'Descripción ': fields.Descripcion,
        'Código ATA/Descripción ': fields.Codigo_ATA_Descripcion,
        'Modelo ': fields.Modelo_Modelos.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Catalogo_codigo_ATA  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Codigo_ATA: x.Codigo_ATA,
      Descripcion: x.Descripcion,
      Codigo_ATA_Descripcion: x.Codigo_ATA_Descripcion,
      Modelo: x.Modelo_Modelos.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Catalogo_codigo_ATA',  ['Folio'    ,'Codigo_ATA'  ,'Descripcion'  ,'Codigo_ATA_Descripcion'  ,'Modelo' ]);
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
    template += '          <th>Código ATA</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>Código ATA/Descripción</th>';
    template += '          <th>Modelo</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Codigo_ATA + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.Codigo_ATA_Descripcion + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
		  
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
	template += '\t Código ATA';
	template += '\t Descripción';
	template += '\t Código ATA/Descripción';
	template += '\t Modelo';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Codigo_ATA;
	  template += '\t ' + element.Descripcion;
	  template += '\t ' + element.Codigo_ATA_Descripcion;
      template += '\t ' + element.Modelo_Modelos.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Catalogo_codigo_ATADataSource implements DataSource<Catalogo_codigo_ATA>
{
  private subject = new BehaviorSubject<Catalogo_codigo_ATA[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Catalogo_codigo_ATAService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Catalogo_codigo_ATA[]> {
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
              const longest = result.Catalogo_codigo_ATAs.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Catalogo_codigo_ATAs);
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
      condition += " and Catalogo_codigo_ATA.Folio = " + data.filter.Folio;
    if (data.filter.Codigo_ATA != "")
      condition += " and Catalogo_codigo_ATA.Codigo_ATA like '%" + data.filter.Codigo_ATA + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Catalogo_codigo_ATA.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Codigo_ATA_Descripcion != "")
      condition += " and Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + data.filter.Codigo_ATA_Descripcion + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";

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
        sort = " Catalogo_codigo_ATA.Folio " + data.sortDirecction;
        break;
      case "Codigo_ATA":
        sort = " Catalogo_codigo_ATA.Codigo_ATA " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Catalogo_codigo_ATA.Descripcion " + data.sortDirecction;
        break;
      case "Codigo_ATA_Descripcion":
        sort = " Catalogo_codigo_ATA.Codigo_ATA_Descripcion " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
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
        condition += " AND Catalogo_codigo_ATA.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Catalogo_codigo_ATA.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.Codigo_ATAFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Catalogo_codigo_ATA.Codigo_ATA LIKE '" + data.filterAdvanced.Codigo_ATA + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Catalogo_codigo_ATA.Codigo_ATA LIKE '%" + data.filterAdvanced.Codigo_ATA + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Catalogo_codigo_ATA.Codigo_ATA LIKE '%" + data.filterAdvanced.Codigo_ATA + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Catalogo_codigo_ATA.Codigo_ATA = '" + data.filterAdvanced.Codigo_ATA + "'";
        break;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Catalogo_codigo_ATA.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Catalogo_codigo_ATA.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Catalogo_codigo_ATA.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Catalogo_codigo_ATA.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    switch (data.filterAdvanced.Codigo_ATA_DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '" + data.filterAdvanced.Codigo_ATA_Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '%" + data.filterAdvanced.Codigo_ATA_Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '%" + data.filterAdvanced.Codigo_ATA_Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion = '" + data.filterAdvanced.Codigo_ATA_Descripcion + "'";
        break;
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
      condition += " AND Catalogo_codigo_ATA.Modelo In (" + Modelods + ")";
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
              const longest = result.Catalogo_codigo_ATAs.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Catalogo_codigo_ATAs);
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
