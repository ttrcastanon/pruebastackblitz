import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Layout_ProveedoresService } from "src/app/api-services/Layout_Proveedores.service";
import { Layout_Proveedores } from "src/app/models/Layout_Proveedores";
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
import { Layout_ProveedoresIndexRules } from 'src/app/shared/businessRules/Layout_Proveedores-index-rules';
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
  selector: "app-list-Layout_Proveedores",
  templateUrl: "./list-Layout_Proveedores.component.html",
  styleUrls: ["./list-Layout_Proveedores.component.scss"],
})
export class ListLayout_ProveedoresComponent extends Layout_ProveedoresIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Folio_de_carga_manual",
    "Fecha",
    "ID_Proveedor",
    "RFC_Proveedor",
    "Descripcion_Proveedor",
    "Monto",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "ID_Proveedor",
      "RFC_Proveedor",
      "Descripcion_Proveedor",
      "Monto",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_de_carga_manual_filtro",
      "Fecha_filtro",
      "ID_Proveedor_filtro",
      "RFC_Proveedor_filtro",
      "Descripcion_Proveedor_filtro",
      "Monto_filtro",

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
      Folio_de_carga_manual: "",
      Fecha: null,
      ID_Proveedor: "",
      RFC_Proveedor: "",
      Descripcion_Proveedor: "",
      Monto: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFolio_de_carga_manual: "",
      toFolio_de_carga_manual: "",
      fromFecha: "",
      toFecha: "",
      ID_ProveedorFilter: "",
      ID_Proveedor: "",
      ID_ProveedorMultiple: "",
      RFC_ProveedorFilter: "",
      RFC_Proveedor: "",
      RFC_ProveedorMultiple: "",
      fromMonto: "",
      toMonto: "",

    }
  };

  dataSource: Layout_ProveedoresDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Layout_ProveedoresDataSource;
  dataClipboard: any;

  constructor(
    private _Layout_ProveedoresService: Layout_ProveedoresService,
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
    this.dataSource = new Layout_ProveedoresDataSource(
      this._Layout_ProveedoresService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Layout_Proveedores)
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
    this.listConfig.filter.Folio_de_carga_manual = "";
    this.listConfig.filter.Fecha = undefined;
    this.listConfig.filter.ID_Proveedor = "";
    this.listConfig.filter.RFC_Proveedor = "";
    this.listConfig.filter.Descripcion_Proveedor = "";
    this.listConfig.filter.Monto = "";

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

  remove(row: Layout_Proveedores) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Layout_ProveedoresService
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
  ActionPrint(dataRow: Layout_Proveedores) {

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
,'Folio de carga manual'
,'Fecha'
,'ID_Proveedor'
,'RFC_Proveedor'
,'Descripcion_Proveedor'
,'Monto'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Folio_de_carga_manual
,x.Fecha
,x.ID_Proveedor_Creacion_de_Proveedores.Razon_social
,x.RFC_Proveedor_Creacion_de_Proveedores.Razon_social
,x.Descripcion_Proveedor
,x.Monto
		  
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
    pdfMake.createPdf(pdfDefinition).download('Layout_Proveedores.pdf');
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
          this._Layout_ProveedoresService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Layout_Proveedoress;
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
          this._Layout_ProveedoresService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Layout_Proveedoress;
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
        'Folio de carga manual ': fields.Folio_de_carga_manual,
        'Fecha ': fields.Fecha ? momentJS(fields.Fecha).format('DD/MM/YYYY') : '',
        'ID_Proveedor ': fields.ID_Proveedor_Creacion_de_Proveedores.Razon_social,
        'RFC_Proveedor 1': fields.RFC_Proveedor_Creacion_de_Proveedores.Razon_social,
        'Descripcion_Proveedor ': fields.Descripcion_Proveedor,
        'Monto ': fields.Monto,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Layout_Proveedores  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Folio_de_carga_manual: x.Folio_de_carga_manual,
      Fecha: x.Fecha,
      ID_Proveedor: x.ID_Proveedor_Creacion_de_Proveedores.Razon_social,
      RFC_Proveedor: x.RFC_Proveedor_Creacion_de_Proveedores.Razon_social,
      Descripcion_Proveedor: x.Descripcion_Proveedor,
      Monto: x.Monto,

    }));

    this.excelService.exportToCsv(result, 'Layout_Proveedores',  ['Folio'    ,'Folio_de_carga_manual'  ,'Fecha'  ,'ID_Proveedor'  ,'RFC_Proveedor'  ,'Descripcion_Proveedor'  ,'Monto' ]);
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
    template += '          <th>Folio de carga manual</th>';
    template += '          <th>Fecha</th>';
    template += '          <th>ID_Proveedor</th>';
    template += '          <th>RFC_Proveedor</th>';
    template += '          <th>Descripcion_Proveedor</th>';
    template += '          <th>Monto</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Folio_de_carga_manual + '</td>';
      template += '          <td>' + element.Fecha + '</td>';
      template += '          <td>' + element.ID_Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.RFC_Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.Descripcion_Proveedor + '</td>';
      template += '          <td>' + element.Monto + '</td>';
		  
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
	template += '\t Folio de carga manual';
	template += '\t Fecha';
	template += '\t ID_Proveedor';
	template += '\t RFC_Proveedor';
	template += '\t Descripcion_Proveedor';
	template += '\t Monto';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Folio_de_carga_manual;
	  template += '\t ' + element.Fecha;
      template += '\t ' + element.ID_Proveedor_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.RFC_Proveedor_Creacion_de_Proveedores.Razon_social;
	  template += '\t ' + element.Descripcion_Proveedor;
	  template += '\t ' + element.Monto;

	  template += '\n';
    });

    return template;
  }

}

export class Layout_ProveedoresDataSource implements DataSource<Layout_Proveedores>
{
  private subject = new BehaviorSubject<Layout_Proveedores[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Layout_ProveedoresService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Layout_Proveedores[]> {
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
              const longest = result.Layout_Proveedoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Layout_Proveedoress);
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
      condition += " and Layout_Proveedores.Folio = " + data.filter.Folio;
    if (data.filter.Folio_de_carga_manual != "")
      condition += " and Layout_Proveedores.Folio_de_carga_manual = " + data.filter.Folio_de_carga_manual;
    if (data.filter.Fecha)
      condition += " and CONVERT(VARCHAR(10), Layout_Proveedores.Fecha, 102)  = '" + moment(data.filter.Fecha).format("YYYY.MM.DD") + "'";
    if (data.filter.ID_Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.ID_Proveedor + "%' ";
    if (data.filter.RFC_Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.RFC_Proveedor + "%' ";
    if (data.filter.Descripcion_Proveedor != "")
      condition += " and Layout_Proveedores.Descripcion_Proveedor like '%" + data.filter.Descripcion_Proveedor + "%' ";
    if (data.filter.Monto != "")
      condition += " and Layout_Proveedores.Monto = " + data.filter.Monto;

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
        sort = " Layout_Proveedores.Folio " + data.sortDirecction;
        break;
      case "Folio_de_carga_manual":
        sort = " Layout_Proveedores.Folio_de_carga_manual " + data.sortDirecction;
        break;
      case "Fecha":
        sort = " Layout_Proveedores.Fecha " + data.sortDirecction;
        break;
      case "ID_Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "RFC_Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "Descripcion_Proveedor":
        sort = " Layout_Proveedores.Descripcion_Proveedor " + data.sortDirecction;
        break;
      case "Monto":
        sort = " Layout_Proveedores.Monto " + data.sortDirecction;
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
        condition += " AND Layout_Proveedores.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Layout_Proveedores.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFolio_de_carga_manual != 'undefined' && data.filterAdvanced.fromFolio_de_carga_manual)
	|| (typeof data.filterAdvanced.toFolio_de_carga_manual != 'undefined' && data.filterAdvanced.toFolio_de_carga_manual)) 
	{
      if (typeof data.filterAdvanced.fromFolio_de_carga_manual != 'undefined' && data.filterAdvanced.fromFolio_de_carga_manual)
        condition += " AND Layout_Proveedores.Folio_de_carga_manual >= " + data.filterAdvanced.fromFolio_de_carga_manual;

      if (typeof data.filterAdvanced.toFolio_de_carga_manual != 'undefined' && data.filterAdvanced.toFolio_de_carga_manual) 
        condition += " AND Layout_Proveedores.Folio_de_carga_manual <= " + data.filterAdvanced.toFolio_de_carga_manual;
    }
    if ((typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
	|| (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)) 
	{
      if (typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha) 
        condition += " and CONVERT(VARCHAR(10), Layout_Proveedores.Fecha, 102)  >= '" +  moment(data.filterAdvanced.fromFecha).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha) 
        condition += " and CONVERT(VARCHAR(10), Layout_Proveedores.Fecha, 102)  <= '" + moment(data.filterAdvanced.toFecha).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.ID_Proveedor != 'undefined' && data.filterAdvanced.ID_Proveedor)) {
      switch (data.filterAdvanced.ID_ProveedorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.ID_Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.ID_Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.ID_Proveedor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.ID_Proveedor + "'";
          break;
      }
    } else if (data.filterAdvanced.ID_ProveedorMultiple != null && data.filterAdvanced.ID_ProveedorMultiple.length > 0) {
      var ID_Proveedords = data.filterAdvanced.ID_ProveedorMultiple.join(",");
      condition += " AND Layout_Proveedores.ID_Proveedor In (" + ID_Proveedords + ")";
    }
    if ((typeof data.filterAdvanced.RFC_Proveedor != 'undefined' && data.filterAdvanced.RFC_Proveedor)) {
      switch (data.filterAdvanced.RFC_ProveedorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.RFC_Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.RFC_Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.RFC_Proveedor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.RFC_Proveedor + "'";
          break;
      }
    } else if (data.filterAdvanced.RFC_ProveedorMultiple != null && data.filterAdvanced.RFC_ProveedorMultiple.length > 0) {
      var RFC_Proveedords = data.filterAdvanced.RFC_ProveedorMultiple.join(",");
      condition += " AND Layout_Proveedores.RFC_Proveedor In (" + RFC_Proveedords + ")";
    }
    switch (data.filterAdvanced.Descripcion_ProveedorFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Layout_Proveedores.Descripcion_Proveedor LIKE '" + data.filterAdvanced.Descripcion_Proveedor + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Layout_Proveedores.Descripcion_Proveedor LIKE '%" + data.filterAdvanced.Descripcion_Proveedor + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Layout_Proveedores.Descripcion_Proveedor LIKE '%" + data.filterAdvanced.Descripcion_Proveedor + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Layout_Proveedores.Descripcion_Proveedor = '" + data.filterAdvanced.Descripcion_Proveedor + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromMonto != 'undefined' && data.filterAdvanced.fromMonto)
	|| (typeof data.filterAdvanced.toMonto != 'undefined' && data.filterAdvanced.toMonto)) 
	{
      if (typeof data.filterAdvanced.fromMonto != 'undefined' && data.filterAdvanced.fromMonto)
        condition += " AND Layout_Proveedores.Monto >= " + data.filterAdvanced.fromMonto;

      if (typeof data.filterAdvanced.toMonto != 'undefined' && data.filterAdvanced.toMonto) 
        condition += " AND Layout_Proveedores.Monto <= " + data.filterAdvanced.toMonto;
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
              const longest = result.Layout_Proveedoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Layout_Proveedoress);
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
