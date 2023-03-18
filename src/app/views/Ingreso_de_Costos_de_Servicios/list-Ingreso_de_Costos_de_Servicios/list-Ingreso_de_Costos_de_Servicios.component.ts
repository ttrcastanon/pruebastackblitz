import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Ingreso_de_Costos_de_ServiciosService } from "src/app/api-services/Ingreso_de_Costos_de_Servicios.service";
import { Ingreso_de_Costos_de_Servicios } from "src/app/models/Ingreso_de_Costos_de_Servicios";
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
import { Ingreso_de_Costos_de_ServiciosIndexRules } from 'src/app/shared/businessRules/Ingreso_de_Costos_de_Servicios-index-rules';
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
  selector: "app-list-Ingreso_de_Costos_de_Servicios",
  templateUrl: "./list-Ingreso_de_Costos_de_Servicios.component.html",
  styleUrls: ["./list-Ingreso_de_Costos_de_Servicios.component.scss"],
})
export class ListIngreso_de_Costos_de_ServiciosComponent extends Ingreso_de_Costos_de_ServiciosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Costo_",
    "No__de_Factura",
    "Fecha_de_Factura",
    "FolioIngresoCostosServ",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Costo_",
      "No__de_Factura",
      "Fecha_de_Factura",
      "FolioIngresoCostosServ",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Costo__filtro",
      "No__de_Factura_filtro",
      "Fecha_de_Factura_filtro",
      "FolioIngresoCostosServ_filtro",

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
      Costo_: "",
      No__de_Factura: "",
      Fecha_de_Factura: null,
      FolioIngresoCostosServ: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromCosto_: "",
      toCosto_: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",

    }
  };

  dataSource: Ingreso_de_Costos_de_ServiciosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Ingreso_de_Costos_de_ServiciosDataSource;
  dataClipboard: any;

  constructor(
    private _Ingreso_de_Costos_de_ServiciosService: Ingreso_de_Costos_de_ServiciosService,
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
    this.dataSource = new Ingreso_de_Costos_de_ServiciosDataSource(
      this._Ingreso_de_Costos_de_ServiciosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Ingreso_de_Costos_de_Servicios)
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
    this.listConfig.filter.Costo_ = "";
    this.listConfig.filter.No__de_Factura = "";
    this.listConfig.filter.Fecha_de_Factura = undefined;
    this.listConfig.filter.FolioIngresoCostosServ = "";

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

  remove(row: Ingreso_de_Costos_de_Servicios) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Ingreso_de_Costos_de_ServiciosService
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
  ActionPrint(dataRow: Ingreso_de_Costos_de_Servicios) {

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
,'Costo $'
,'No. de Factura'
,'Fecha de Factura'
,'FolioIngresoCostosServ'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Costo_
,x.No__de_Factura
,x.Fecha_de_Factura
,x.FolioIngresoCostosServ
		  
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
    pdfMake.createPdf(pdfDefinition).download('Ingreso_de_Costos_de_Servicios.pdf');
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
          this._Ingreso_de_Costos_de_ServiciosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ingreso_de_Costos_de_Servicioss;
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
          this._Ingreso_de_Costos_de_ServiciosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ingreso_de_Costos_de_Servicioss;
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
        'Costo $ ': fields.Costo_,
        'No. de Factura ': fields.No__de_Factura,
        'Fecha de Factura ': fields.Fecha_de_Factura ? momentJS(fields.Fecha_de_Factura).format('DD/MM/YYYY') : '',
        'FolioIngresoCostosServ ': fields.FolioIngresoCostosServ,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Ingreso_de_Costos_de_Servicios  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Costo_: x.Costo_,
      No__de_Factura: x.No__de_Factura,
      Fecha_de_Factura: x.Fecha_de_Factura,
      FolioIngresoCostosServ: x.FolioIngresoCostosServ,

    }));

    this.excelService.exportToCsv(result, 'Ingreso_de_Costos_de_Servicios',  ['Folio'    ,'Costo_'  ,'No__de_Factura'  ,'Fecha_de_Factura'  ,'FolioIngresoCostosServ' ]);
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
    template += '          <th>Costo $</th>';
    template += '          <th>No. de Factura</th>';
    template += '          <th>Fecha de Factura</th>';
    template += '          <th>FolioIngresoCostosServ</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Costo_ + '</td>';
      template += '          <td>' + element.No__de_Factura + '</td>';
      template += '          <td>' + element.Fecha_de_Factura + '</td>';
      template += '          <td>' + element.FolioIngresoCostosServ + '</td>';
		  
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
	template += '\t Costo $';
	template += '\t No. de Factura';
	template += '\t Fecha de Factura';
	template += '\t FolioIngresoCostosServ';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Costo_;
	  template += '\t ' + element.No__de_Factura;
	  template += '\t ' + element.Fecha_de_Factura;
	  template += '\t ' + element.FolioIngresoCostosServ;

	  template += '\n';
    });

    return template;
  }

}

export class Ingreso_de_Costos_de_ServiciosDataSource implements DataSource<Ingreso_de_Costos_de_Servicios>
{
  private subject = new BehaviorSubject<Ingreso_de_Costos_de_Servicios[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Ingreso_de_Costos_de_ServiciosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Ingreso_de_Costos_de_Servicios[]> {
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
              const longest = result.Ingreso_de_Costos_de_Servicioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ingreso_de_Costos_de_Servicioss);
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
      condition += " and Ingreso_de_Costos_de_Servicios.Folio = " + data.filter.Folio;
    if (data.filter.Costo_ != "")
      condition += " and Ingreso_de_Costos_de_Servicios.Costo_ = " + data.filter.Costo_;
    if (data.filter.No__de_Factura != "")
      condition += " and Ingreso_de_Costos_de_Servicios.No__de_Factura like '%" + data.filter.No__de_Factura + "%' ";
    if (data.filter.Fecha_de_Factura)
      condition += " and CONVERT(VARCHAR(10), Ingreso_de_Costos_de_Servicios.Fecha_de_Factura, 102)  = '" + moment(data.filter.Fecha_de_Factura).format("YYYY.MM.DD") + "'";
    if (data.filter.FolioIngresoCostosServ != "")
      condition += " and Ingreso_de_Costos_de_Servicios.FolioIngresoCostosServ like '%" + data.filter.FolioIngresoCostosServ + "%' ";

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
        sort = " Ingreso_de_Costos_de_Servicios.Folio " + data.sortDirecction;
        break;
      case "Costo_":
        sort = " Ingreso_de_Costos_de_Servicios.Costo_ " + data.sortDirecction;
        break;
      case "No__de_Factura":
        sort = " Ingreso_de_Costos_de_Servicios.No__de_Factura " + data.sortDirecction;
        break;
      case "Fecha_de_Factura":
        sort = " Ingreso_de_Costos_de_Servicios.Fecha_de_Factura " + data.sortDirecction;
        break;
      case "FolioIngresoCostosServ":
        sort = " Ingreso_de_Costos_de_Servicios.FolioIngresoCostosServ " + data.sortDirecction;
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
        condition += " AND Ingreso_de_Costos_de_Servicios.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Ingreso_de_Costos_de_Servicios.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromCosto_ != 'undefined' && data.filterAdvanced.fromCosto_)
	|| (typeof data.filterAdvanced.toCosto_ != 'undefined' && data.filterAdvanced.toCosto_)) 
	{
      if (typeof data.filterAdvanced.fromCosto_ != 'undefined' && data.filterAdvanced.fromCosto_)
        condition += " AND Ingreso_de_Costos_de_Servicios.Costo_ >= " + data.filterAdvanced.fromCosto_;

      if (typeof data.filterAdvanced.toCosto_ != 'undefined' && data.filterAdvanced.toCosto_) 
        condition += " AND Ingreso_de_Costos_de_Servicios.Costo_ <= " + data.filterAdvanced.toCosto_;
    }
    switch (data.filterAdvanced.No__de_FacturaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Costos_de_Servicios.No__de_Factura LIKE '" + data.filterAdvanced.No__de_Factura + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Costos_de_Servicios.No__de_Factura LIKE '%" + data.filterAdvanced.No__de_Factura + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Costos_de_Servicios.No__de_Factura LIKE '%" + data.filterAdvanced.No__de_Factura + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Costos_de_Servicios.No__de_Factura = '" + data.filterAdvanced.No__de_Factura + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura)
	|| (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Costos_de_Servicios.Fecha_de_Factura, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Factura).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Costos_de_Servicios.Fecha_de_Factura, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Factura).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.FolioIngresoCostosServFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Costos_de_Servicios.FolioIngresoCostosServ LIKE '" + data.filterAdvanced.FolioIngresoCostosServ + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Costos_de_Servicios.FolioIngresoCostosServ LIKE '%" + data.filterAdvanced.FolioIngresoCostosServ + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Costos_de_Servicios.FolioIngresoCostosServ LIKE '%" + data.filterAdvanced.FolioIngresoCostosServ + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Costos_de_Servicios.FolioIngresoCostosServ = '" + data.filterAdvanced.FolioIngresoCostosServ + "'";
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
              const longest = result.Ingreso_de_Costos_de_Servicioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ingreso_de_Costos_de_Servicioss);
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
