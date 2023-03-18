import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Ingreso_de_CostosService } from "src/app/api-services/Ingreso_de_Costos.service";
import { Ingreso_de_Costos } from "src/app/models/Ingreso_de_Costos";
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
import { Ingreso_de_CostosIndexRules } from 'src/app/shared/businessRules/Ingreso_de_Costos-index-rules';
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
  selector: "app-list-Ingreso_de_Costos",
  templateUrl: "./list-Ingreso_de_Costos.component.html",
  styleUrls: ["./list-Ingreso_de_Costos.component.scss"],
})
export class ListIngreso_de_CostosComponent extends Ingreso_de_CostosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No__de_OC",
    "Proveedor",
    "No__de_Factura",
    "Fecha_de_Factura",
    "Fecha_de_Pago",
    "Nota_de_Credito",
    "Total_de_Factura_",
    "Observaciones",
    "IdSolicitudPago",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_OC",
      "Proveedor",
      "No__de_Factura",
      "Fecha_de_Factura",
      "Fecha_de_Pago",
      "Nota_de_Credito",
      "Total_de_Factura_",
      "Observaciones",
      "IdSolicitudPago",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_OC_filtro",
      "Proveedor_filtro",
      "No__de_Factura_filtro",
      "Fecha_de_Factura_filtro",
      "Fecha_de_Pago_filtro",
      "Nota_de_Credito_filtro",
      "Total_de_Factura__filtro",
      "Observaciones_filtro",
      "IdSolicitudPago_filtro",

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
      No__de_OC: "",
      Proveedor: "",
      No__de_Factura: "",
      Fecha_de_Factura: null,
      Fecha_de_Pago: null,
      Nota_de_Credito: "",
      Total_de_Factura_: "",
      Observaciones: "",
      IdSolicitudPago: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      No__de_OCFilter: "",
      No__de_OC: "",
      No__de_OCMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",
      fromFecha_de_Pago: "",
      toFecha_de_Pago: "",
      fromTotal_de_Factura_: "",
      toTotal_de_Factura_: "",

    }
  };

  dataSource: Ingreso_de_CostosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Ingreso_de_CostosDataSource;
  dataClipboard: any;

  constructor(
    private _Ingreso_de_CostosService: Ingreso_de_CostosService,
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
    this.dataSource = new Ingreso_de_CostosDataSource(
      this._Ingreso_de_CostosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Ingreso_de_Costos)
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
    this.listConfig.filter.No__de_OC = "";
    this.listConfig.filter.Proveedor = "";
    this.listConfig.filter.No__de_Factura = "";
    this.listConfig.filter.Fecha_de_Factura = undefined;
    this.listConfig.filter.Fecha_de_Pago = undefined;
    this.listConfig.filter.Nota_de_Credito = "";
    this.listConfig.filter.Total_de_Factura_ = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.IdSolicitudPago = "";

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

  remove(row: Ingreso_de_Costos) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Ingreso_de_CostosService
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
  ActionPrint(dataRow: Ingreso_de_Costos) {

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
,'No. de OC'
,'Proveedor'
,'No. de Factura'
,'Fecha de Factura'
,'Fecha de Pago'
,'Nota de Crédito'
,'Total de Factura $'
,'Observaciones'
,'IdSolicitudPago'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC
,x.Proveedor_Creacion_de_Proveedores.Razon_social
,x.No__de_Factura
,x.Fecha_de_Factura
,x.Fecha_de_Pago
,x.Nota_de_Credito
,x.Total_de_Factura_
,x.Observaciones
,x.IdSolicitudPago
		  
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
    pdfMake.createPdf(pdfDefinition).download('Ingreso_de_Costos.pdf');
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
          this._Ingreso_de_CostosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ingreso_de_Costoss;
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
          this._Ingreso_de_CostosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ingreso_de_Costoss;
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
        'No. de OC ': fields.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
        'Proveedor ': fields.Proveedor_Creacion_de_Proveedores.Razon_social,
        'No. de Factura ': fields.No__de_Factura,
        'Fecha de Factura ': fields.Fecha_de_Factura ? momentJS(fields.Fecha_de_Factura).format('DD/MM/YYYY') : '',
        'Fecha de Pago ': fields.Fecha_de_Pago ? momentJS(fields.Fecha_de_Pago).format('DD/MM/YYYY') : '',
        'Nota de Crédito ': fields.Nota_de_Credito,
        'Total de Factura $ ': fields.Total_de_Factura_,
        'Observaciones ': fields.Observaciones,
        'IdSolicitudPago ': fields.IdSolicitudPago,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Ingreso_de_Costos  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No__de_OC: x.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
      Proveedor: x.Proveedor_Creacion_de_Proveedores.Razon_social,
      No__de_Factura: x.No__de_Factura,
      Fecha_de_Factura: x.Fecha_de_Factura,
      Fecha_de_Pago: x.Fecha_de_Pago,
      Nota_de_Credito: x.Nota_de_Credito,
      Total_de_Factura_: x.Total_de_Factura_,
      Observaciones: x.Observaciones,
      IdSolicitudPago: x.IdSolicitudPago,

    }));

    this.excelService.exportToCsv(result, 'Ingreso_de_Costos',  ['Folio'    ,'No__de_OC'  ,'Proveedor'  ,'No__de_Factura'  ,'Fecha_de_Factura'  ,'Fecha_de_Pago'  ,'Nota_de_Credito'  ,'Total_de_Factura_'  ,'Observaciones'  ,'IdSolicitudPago' ]);
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
    template += '          <th>No. de OC</th>';
    template += '          <th>Proveedor</th>';
    template += '          <th>No. de Factura</th>';
    template += '          <th>Fecha de Factura</th>';
    template += '          <th>Fecha de Pago</th>';
    template += '          <th>Nota de Crédito</th>';
    template += '          <th>Total de Factura $</th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>IdSolicitudPago</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC + '</td>';
      template += '          <td>' + element.Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.No__de_Factura + '</td>';
      template += '          <td>' + element.Fecha_de_Factura + '</td>';
      template += '          <td>' + element.Fecha_de_Pago + '</td>';
      template += '          <td>' + element.Nota_de_Credito + '</td>';
      template += '          <td>' + element.Total_de_Factura_ + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.IdSolicitudPago + '</td>';
		  
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
	template += '\t No. de OC';
	template += '\t Proveedor';
	template += '\t No. de Factura';
	template += '\t Fecha de Factura';
	template += '\t Fecha de Pago';
	template += '\t Nota de Crédito';
	template += '\t Total de Factura $';
	template += '\t Observaciones';
	template += '\t IdSolicitudPago';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC;
      template += '\t ' + element.Proveedor_Creacion_de_Proveedores.Razon_social;
	  template += '\t ' + element.No__de_Factura;
	  template += '\t ' + element.Fecha_de_Factura;
	  template += '\t ' + element.Fecha_de_Pago;
	  template += '\t ' + element.Nota_de_Credito;
	  template += '\t ' + element.Total_de_Factura_;
	  template += '\t ' + element.Observaciones;
	  template += '\t ' + element.IdSolicitudPago;

	  template += '\n';
    });

    return template;
  }

}

export class Ingreso_de_CostosDataSource implements DataSource<Ingreso_de_Costos>
{
  private subject = new BehaviorSubject<Ingreso_de_Costos[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Ingreso_de_CostosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Ingreso_de_Costos[]> {
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
              const longest = result.Ingreso_de_Costoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ingreso_de_Costoss);
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
      condition += " and Ingreso_de_Costos.Folio = " + data.filter.Folio;
    if (data.filter.No__de_OC != "")
      condition += " and Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + data.filter.No__de_OC + "%' ";
    if (data.filter.Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor + "%' ";
    if (data.filter.No__de_Factura != "")
      condition += " and Ingreso_de_Costos.No__de_Factura like '%" + data.filter.No__de_Factura + "%' ";
    if (data.filter.Fecha_de_Factura)
      condition += " and CONVERT(VARCHAR(10), Ingreso_de_Costos.Fecha_de_Factura, 102)  = '" + moment(data.filter.Fecha_de_Factura).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_Pago)
      condition += " and CONVERT(VARCHAR(10), Ingreso_de_Costos.Fecha_de_Pago, 102)  = '" + moment(data.filter.Fecha_de_Pago).format("YYYY.MM.DD") + "'";
    if (data.filter.Nota_de_Credito != "")
      condition += " and Ingreso_de_Costos.Nota_de_Credito like '%" + data.filter.Nota_de_Credito + "%' ";
    if (data.filter.Total_de_Factura_ != "")
      condition += " and Ingreso_de_Costos.Total_de_Factura_ = " + data.filter.Total_de_Factura_;
    if (data.filter.Observaciones != "")
      condition += " and Ingreso_de_Costos.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.IdSolicitudPago != "")
      condition += " and Ingreso_de_Costos.IdSolicitudPago like '%" + data.filter.IdSolicitudPago + "%' ";

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
        sort = " Ingreso_de_Costos.Folio " + data.sortDirecction;
        break;
      case "No__de_OC":
        sort = " Generacion_de_Orden_de_Compras.FolioGeneracionOC " + data.sortDirecction;
        break;
      case "Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "No__de_Factura":
        sort = " Ingreso_de_Costos.No__de_Factura " + data.sortDirecction;
        break;
      case "Fecha_de_Factura":
        sort = " Ingreso_de_Costos.Fecha_de_Factura " + data.sortDirecction;
        break;
      case "Fecha_de_Pago":
        sort = " Ingreso_de_Costos.Fecha_de_Pago " + data.sortDirecction;
        break;
      case "Nota_de_Credito":
        sort = " Ingreso_de_Costos.Nota_de_Credito " + data.sortDirecction;
        break;
      case "Total_de_Factura_":
        sort = " Ingreso_de_Costos.Total_de_Factura_ " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Ingreso_de_Costos.Observaciones " + data.sortDirecction;
        break;
      case "IdSolicitudPago":
        sort = " Ingreso_de_Costos.IdSolicitudPago " + data.sortDirecction;
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
        condition += " AND Ingreso_de_Costos.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Ingreso_de_Costos.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.No__de_OC != 'undefined' && data.filterAdvanced.No__de_OC)) {
      switch (data.filterAdvanced.No__de_OCFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '" + data.filterAdvanced.No__de_OC + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '%" + data.filterAdvanced.No__de_OC + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '%" + data.filterAdvanced.No__de_OC + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC = '" + data.filterAdvanced.No__de_OC + "'";
          break;
      }
    } else if (data.filterAdvanced.No__de_OCMultiple != null && data.filterAdvanced.No__de_OCMultiple.length > 0) {
      var No__de_OCds = data.filterAdvanced.No__de_OCMultiple.join(",");
      condition += " AND Ingreso_de_Costos.No__de_OC In (" + No__de_OCds + ")";
    }
    if ((typeof data.filterAdvanced.Proveedor != 'undefined' && data.filterAdvanced.Proveedor)) {
      switch (data.filterAdvanced.ProveedorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.Proveedor + "'";
          break;
      }
    } else if (data.filterAdvanced.ProveedorMultiple != null && data.filterAdvanced.ProveedorMultiple.length > 0) {
      var Proveedords = data.filterAdvanced.ProveedorMultiple.join(",");
      condition += " AND Ingreso_de_Costos.Proveedor In (" + Proveedords + ")";
    }
    switch (data.filterAdvanced.No__de_FacturaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Costos.No__de_Factura LIKE '" + data.filterAdvanced.No__de_Factura + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Costos.No__de_Factura LIKE '%" + data.filterAdvanced.No__de_Factura + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Costos.No__de_Factura LIKE '%" + data.filterAdvanced.No__de_Factura + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Costos.No__de_Factura = '" + data.filterAdvanced.No__de_Factura + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura)
	|| (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Costos.Fecha_de_Factura, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Factura).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Costos.Fecha_de_Factura, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Factura).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Pago != 'undefined' && data.filterAdvanced.fromFecha_de_Pago)
	|| (typeof data.filterAdvanced.toFecha_de_Pago != 'undefined' && data.filterAdvanced.toFecha_de_Pago)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Pago != 'undefined' && data.filterAdvanced.fromFecha_de_Pago) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Costos.Fecha_de_Pago, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Pago).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Pago != 'undefined' && data.filterAdvanced.toFecha_de_Pago) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Costos.Fecha_de_Pago, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Pago).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Nota_de_CreditoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Costos.Nota_de_Credito LIKE '" + data.filterAdvanced.Nota_de_Credito + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Costos.Nota_de_Credito LIKE '%" + data.filterAdvanced.Nota_de_Credito + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Costos.Nota_de_Credito LIKE '%" + data.filterAdvanced.Nota_de_Credito + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Costos.Nota_de_Credito = '" + data.filterAdvanced.Nota_de_Credito + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromTotal_de_Factura_ != 'undefined' && data.filterAdvanced.fromTotal_de_Factura_)
	|| (typeof data.filterAdvanced.toTotal_de_Factura_ != 'undefined' && data.filterAdvanced.toTotal_de_Factura_)) 
	{
      if (typeof data.filterAdvanced.fromTotal_de_Factura_ != 'undefined' && data.filterAdvanced.fromTotal_de_Factura_)
        condition += " AND Ingreso_de_Costos.Total_de_Factura_ >= " + data.filterAdvanced.fromTotal_de_Factura_;

      if (typeof data.filterAdvanced.toTotal_de_Factura_ != 'undefined' && data.filterAdvanced.toTotal_de_Factura_) 
        condition += " AND Ingreso_de_Costos.Total_de_Factura_ <= " + data.filterAdvanced.toTotal_de_Factura_;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Costos.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Costos.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Costos.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Costos.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    switch (data.filterAdvanced.IdSolicitudPagoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Costos.IdSolicitudPago LIKE '" + data.filterAdvanced.IdSolicitudPago + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Costos.IdSolicitudPago LIKE '%" + data.filterAdvanced.IdSolicitudPago + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Costos.IdSolicitudPago LIKE '%" + data.filterAdvanced.IdSolicitudPago + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Costos.IdSolicitudPago = '" + data.filterAdvanced.IdSolicitudPago + "'";
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
              const longest = result.Ingreso_de_Costoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ingreso_de_Costoss);
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
