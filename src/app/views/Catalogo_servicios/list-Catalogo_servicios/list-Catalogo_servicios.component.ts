import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Catalogo_serviciosService } from "src/app/api-services/Catalogo_servicios.service";
import { Catalogo_servicios } from "src/app/models/Catalogo_servicios";
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
import { Catalogo_serviciosIndexRules } from 'src/app/shared/businessRules/Catalogo_servicios-index-rules';
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
  selector: "app-list-Catalogo_servicios",
  templateUrl: "./list-Catalogo_servicios.component.html",
  styleUrls: ["./list-Catalogo_servicios.component.scss"],
})
export class ListCatalogo_serviciosComponent extends Catalogo_serviciosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Codigo",
    "Categoria",
    "Descripcion",
    "Codigo_Descripcion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Codigo",
      "Categoria",
      "Descripcion",
      "Codigo_Descripcion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_filtro",
      "Categoria_filtro",
      "Descripcion_filtro",
      "Codigo_Descripcion_filtro",

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
      Codigo: "",
      Categoria: "",
      Descripcion: "",
      Codigo_Descripcion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      CategoriaFilter: "",
      Categoria: "",
      CategoriaMultiple: "",

    }
  };

  dataSource: Catalogo_serviciosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Catalogo_serviciosDataSource;
  dataClipboard: any;

  constructor(
    private _Catalogo_serviciosService: Catalogo_serviciosService,
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
    this.dataSource = new Catalogo_serviciosDataSource(
      this._Catalogo_serviciosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Catalogo_servicios)
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
    this.listConfig.filter.Codigo = "";
    this.listConfig.filter.Categoria = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Codigo_Descripcion = "";

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

//INICIA - BRID:3954 - Ocultar columna "Código/Descripción" catálogo servicios - Autor: Administrador - Actualización: 6/18/2021 2:57:57 PM
if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Codigo_Descripcion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Codigo_Descripcion")  }
//TERMINA - BRID:3954

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

  remove(row: Catalogo_servicios) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Catalogo_serviciosService
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
  ActionPrint(dataRow: Catalogo_servicios) {

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
,'Código'
,'Categoría'
,'Descripción'
,'Código/Descripción'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Codigo
,x.Categoria_Categoria_de_Partes.Categoria
,x.Descripcion
,x.Codigo_Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Catalogo_servicios.pdf');
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
          this._Catalogo_serviciosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Catalogo_servicioss;
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
          this._Catalogo_serviciosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Catalogo_servicioss;
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
        'Código ': fields.Codigo,
        'Categoría ': fields.Categoria_Categoria_de_Partes.Categoria,
        'Descripción ': fields.Descripcion,
        'Código/Descripción ': fields.Codigo_Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Catalogo_servicios  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Codigo: x.Codigo,
      Categoria: x.Categoria_Categoria_de_Partes.Categoria,
      Descripcion: x.Descripcion,
      Codigo_Descripcion: x.Codigo_Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Catalogo_servicios',  ['Folio'    ,'Codigo'  ,'Categoria'  ,'Descripcion'  ,'Codigo_Descripcion' ]);
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
    template += '          <th>Código</th>';
    template += '          <th>Categoría</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>Código/Descripción</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Codigo + '</td>';
      template += '          <td>' + element.Categoria_Categoria_de_Partes.Categoria + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.Codigo_Descripcion + '</td>';
		  
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
	template += '\t Código';
	template += '\t Categoría';
	template += '\t Descripción';
	template += '\t Código/Descripción';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Codigo;
      template += '\t ' + element.Categoria_Categoria_de_Partes.Categoria;
	  template += '\t ' + element.Descripcion;
	  template += '\t ' + element.Codigo_Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Catalogo_serviciosDataSource implements DataSource<Catalogo_servicios>
{
  private subject = new BehaviorSubject<Catalogo_servicios[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Catalogo_serviciosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Catalogo_servicios[]> {
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
              const longest = result.Catalogo_servicioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Catalogo_servicioss);
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
      condition += " and Catalogo_servicios.Folio = " + data.filter.Folio;
    if (data.filter.Codigo != "")
      condition += " and Catalogo_servicios.Codigo like '%" + data.filter.Codigo + "%' ";
    if (data.filter.Categoria != "")
      condition += " and Categoria_de_Partes.Categoria like '%" + data.filter.Categoria + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Catalogo_servicios.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Codigo_Descripcion != "")
      condition += " and Catalogo_servicios.Codigo_Descripcion like '%" + data.filter.Codigo_Descripcion + "%' ";

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
        sort = " Catalogo_servicios.Folio " + data.sortDirecction;
        break;
      case "Codigo":
        sort = " Catalogo_servicios.Codigo " + data.sortDirecction;
        break;
      case "Categoria":
        sort = " Categoria_de_Partes.Categoria " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Catalogo_servicios.Descripcion " + data.sortDirecction;
        break;
      case "Codigo_Descripcion":
        sort = " Catalogo_servicios.Codigo_Descripcion " + data.sortDirecction;
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
        condition += " AND Catalogo_servicios.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Catalogo_servicios.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.CodigoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Catalogo_servicios.Codigo LIKE '" + data.filterAdvanced.Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Catalogo_servicios.Codigo LIKE '%" + data.filterAdvanced.Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Catalogo_servicios.Codigo LIKE '%" + data.filterAdvanced.Codigo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Catalogo_servicios.Codigo = '" + data.filterAdvanced.Codigo + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Categoria != 'undefined' && data.filterAdvanced.Categoria)) {
      switch (data.filterAdvanced.CategoriaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Categoria_de_Partes.Categoria LIKE '" + data.filterAdvanced.Categoria + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Categoria_de_Partes.Categoria LIKE '%" + data.filterAdvanced.Categoria + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Categoria_de_Partes.Categoria LIKE '%" + data.filterAdvanced.Categoria + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Categoria_de_Partes.Categoria = '" + data.filterAdvanced.Categoria + "'";
          break;
      }
    } else if (data.filterAdvanced.CategoriaMultiple != null && data.filterAdvanced.CategoriaMultiple.length > 0) {
      var Categoriads = data.filterAdvanced.CategoriaMultiple.join(",");
      condition += " AND Catalogo_servicios.Categoria In (" + Categoriads + ")";
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Catalogo_servicios.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Catalogo_servicios.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Catalogo_servicios.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Catalogo_servicios.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    switch (data.filterAdvanced.Codigo_DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Catalogo_servicios.Codigo_Descripcion LIKE '" + data.filterAdvanced.Codigo_Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Catalogo_servicios.Codigo_Descripcion LIKE '%" + data.filterAdvanced.Codigo_Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Catalogo_servicios.Codigo_Descripcion LIKE '%" + data.filterAdvanced.Codigo_Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Catalogo_servicios.Codigo_Descripcion = '" + data.filterAdvanced.Codigo_Descripcion + "'";
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
              const longest = result.Catalogo_servicioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Catalogo_servicioss);
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
