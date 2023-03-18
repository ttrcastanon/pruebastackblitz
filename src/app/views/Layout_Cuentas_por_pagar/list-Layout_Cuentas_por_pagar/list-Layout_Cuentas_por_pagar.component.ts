import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Layout_Cuentas_por_pagarService } from "src/app/api-services/Layout_Cuentas_por_pagar.service";
import { Layout_Cuentas_por_pagar } from "src/app/models/Layout_Cuentas_por_pagar";
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
import { Layout_Cuentas_por_pagarIndexRules } from 'src/app/shared/businessRules/Layout_Cuentas_por_pagar-index-rules';
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
  selector: "app-list-Layout_Cuentas_por_pagar",
  templateUrl: "./list-Layout_Cuentas_por_pagar.component.html",
  styleUrls: ["./list-Layout_Cuentas_por_pagar.component.scss"],
})
export class ListLayout_Cuentas_por_pagarComponent extends Layout_Cuentas_por_pagarIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Folio_de_carga_manual",
    "Fecha",
    "RFC_Cliente",
    "Descripcion_Cliente",
    "Facturacion",
    "Cobranza",
    "Saldo30dias",
    "Saldo60dias",
    "Saldo90dias",
    "SaldoMayor180dias",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "RFC_Cliente",
      "Descripcion_Cliente",
      "Facturacion",
      "Cobranza",
      "Saldo30dias",
      "Saldo60dias",
      "Saldo90dias",
      "SaldoMayor180dias",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_de_carga_manual_filtro",
      "Fecha_filtro",
      "RFC_Cliente_filtro",
      "Descripcion_Cliente_filtro",
      "Facturacion_filtro",
      "Cobranza_filtro",
      "Saldo30dias_filtro",
      "Saldo60dias_filtro",
      "Saldo90dias_filtro",
      "SaldoMayor180dias_filtro",

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
      RFC_Cliente: "",
      Descripcion_Cliente: "",
      Facturacion: "",
      Cobranza: "",
      Saldo30dias: "",
      Saldo60dias: "",
      Saldo90dias: "",
      SaldoMayor180dias: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFolio_de_carga_manual: "",
      toFolio_de_carga_manual: "",
      fromFecha: "",
      toFecha: "",
      RFC_ClienteFilter: "",
      RFC_Cliente: "",
      RFC_ClienteMultiple: "",
      Descripcion_ClienteFilter: "",
      Descripcion_Cliente: "",
      Descripcion_ClienteMultiple: "",
      fromFacturacion: "",
      toFacturacion: "",
      fromCobranza: "",
      toCobranza: "",
      fromSaldo30dias: "",
      toSaldo30dias: "",
      fromSaldo60dias: "",
      toSaldo60dias: "",
      fromSaldo90dias: "",
      toSaldo90dias: "",
      fromSaldoMayor180dias: "",
      toSaldoMayor180dias: "",

    }
  };

  dataSource: Layout_Cuentas_por_pagarDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Layout_Cuentas_por_pagarDataSource;
  dataClipboard: any;

  constructor(
    private _Layout_Cuentas_por_pagarService: Layout_Cuentas_por_pagarService,
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
    this.dataSource = new Layout_Cuentas_por_pagarDataSource(
      this._Layout_Cuentas_por_pagarService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Layout_Cuentas_por_pagar)
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
    this.listConfig.filter.RFC_Cliente = "";
    this.listConfig.filter.Descripcion_Cliente = "";
    this.listConfig.filter.Facturacion = "";
    this.listConfig.filter.Cobranza = "";
    this.listConfig.filter.Saldo30dias = "";
    this.listConfig.filter.Saldo60dias = "";
    this.listConfig.filter.Saldo90dias = "";
    this.listConfig.filter.SaldoMayor180dias = "";

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

  remove(row: Layout_Cuentas_por_pagar) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Layout_Cuentas_por_pagarService
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
  ActionPrint(dataRow: Layout_Cuentas_por_pagar) {

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
,'RFC_Cliente'
,'Descripcion_Cliente'
,'Facturación'
,'Cobranza'
,'Saldo30dias'
,'Saldo60dias'
,'Saldo90dias'
,'SaldoMayor180dias'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Folio_de_carga_manual
,x.Fecha
,x.RFC_Cliente_Cliente.Razon_Social
,x.Descripcion_Cliente_Cliente.Razon_Social
,x.Facturacion
,x.Cobranza
,x.Saldo30dias
,x.Saldo60dias
,x.Saldo90dias
,x.SaldoMayor180dias
		  
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
    pdfMake.createPdf(pdfDefinition).download('Layout_Cuentas_por_pagar.pdf');
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
          this._Layout_Cuentas_por_pagarService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Layout_Cuentas_por_pagars;
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
          this._Layout_Cuentas_por_pagarService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Layout_Cuentas_por_pagars;
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
        'RFC_Cliente ': fields.RFC_Cliente_Cliente.Razon_Social,
        'Descripcion_Cliente 1': fields.Descripcion_Cliente_Cliente.Razon_Social,
        'Facturación ': fields.Facturacion,
        'Cobranza ': fields.Cobranza,
        'Saldo30dias ': fields.Saldo30dias,
        'Saldo60dias ': fields.Saldo60dias,
        'Saldo90dias ': fields.Saldo90dias,
        'SaldoMayor180dias ': fields.SaldoMayor180dias,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Layout_Cuentas_por_pagar  ${new Date().toLocaleString()}`);
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
      RFC_Cliente: x.RFC_Cliente_Cliente.Razon_Social,
      Descripcion_Cliente: x.Descripcion_Cliente_Cliente.Razon_Social,
      Facturacion: x.Facturacion,
      Cobranza: x.Cobranza,
      Saldo30dias: x.Saldo30dias,
      Saldo60dias: x.Saldo60dias,
      Saldo90dias: x.Saldo90dias,
      SaldoMayor180dias: x.SaldoMayor180dias,

    }));

    this.excelService.exportToCsv(result, 'Layout_Cuentas_por_pagar',  ['Folio'    ,'Folio_de_carga_manual'  ,'Fecha'  ,'RFC_Cliente'  ,'Descripcion_Cliente'  ,'Facturacion'  ,'Cobranza'  ,'Saldo30dias'  ,'Saldo60dias'  ,'Saldo90dias'  ,'SaldoMayor180dias' ]);
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
    template += '          <th>RFC_Cliente</th>';
    template += '          <th>Descripcion_Cliente</th>';
    template += '          <th>Facturación</th>';
    template += '          <th>Cobranza</th>';
    template += '          <th>Saldo30dias</th>';
    template += '          <th>Saldo60dias</th>';
    template += '          <th>Saldo90dias</th>';
    template += '          <th>SaldoMayor180dias</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Folio_de_carga_manual + '</td>';
      template += '          <td>' + element.Fecha + '</td>';
      template += '          <td>' + element.RFC_Cliente_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Descripcion_Cliente_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Facturacion + '</td>';
      template += '          <td>' + element.Cobranza + '</td>';
      template += '          <td>' + element.Saldo30dias + '</td>';
      template += '          <td>' + element.Saldo60dias + '</td>';
      template += '          <td>' + element.Saldo90dias + '</td>';
      template += '          <td>' + element.SaldoMayor180dias + '</td>';
		  
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
	template += '\t RFC_Cliente';
	template += '\t Descripcion_Cliente';
	template += '\t Facturación';
	template += '\t Cobranza';
	template += '\t Saldo30dias';
	template += '\t Saldo60dias';
	template += '\t Saldo90dias';
	template += '\t SaldoMayor180dias';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Folio_de_carga_manual;
	  template += '\t ' + element.Fecha;
      template += '\t ' + element.RFC_Cliente_Cliente.Razon_Social;
      template += '\t ' + element.Descripcion_Cliente_Cliente.Razon_Social;
	  template += '\t ' + element.Facturacion;
	  template += '\t ' + element.Cobranza;
	  template += '\t ' + element.Saldo30dias;
	  template += '\t ' + element.Saldo60dias;
	  template += '\t ' + element.Saldo90dias;
	  template += '\t ' + element.SaldoMayor180dias;

	  template += '\n';
    });

    return template;
  }

}

export class Layout_Cuentas_por_pagarDataSource implements DataSource<Layout_Cuentas_por_pagar>
{
  private subject = new BehaviorSubject<Layout_Cuentas_por_pagar[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Layout_Cuentas_por_pagarService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Layout_Cuentas_por_pagar[]> {
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
              const longest = result.Layout_Cuentas_por_pagars.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Layout_Cuentas_por_pagars);
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
      condition += " and Layout_Cuentas_por_pagar.Folio = " + data.filter.Folio;
    if (data.filter.Folio_de_carga_manual != "")
      condition += " and Layout_Cuentas_por_pagar.Folio_de_carga_manual = " + data.filter.Folio_de_carga_manual;
    if (data.filter.Fecha)
      condition += " and CONVERT(VARCHAR(10), Layout_Cuentas_por_pagar.Fecha, 102)  = '" + moment(data.filter.Fecha).format("YYYY.MM.DD") + "'";
    if (data.filter.RFC_Cliente != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.RFC_Cliente + "%' ";
    if (data.filter.Descripcion_Cliente != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Descripcion_Cliente + "%' ";
    if (data.filter.Facturacion != "")
      condition += " and Layout_Cuentas_por_pagar.Facturacion = " + data.filter.Facturacion;
    if (data.filter.Cobranza != "")
      condition += " and Layout_Cuentas_por_pagar.Cobranza = " + data.filter.Cobranza;
    if (data.filter.Saldo30dias != "")
      condition += " and Layout_Cuentas_por_pagar.Saldo30dias = " + data.filter.Saldo30dias;
    if (data.filter.Saldo60dias != "")
      condition += " and Layout_Cuentas_por_pagar.Saldo60dias = " + data.filter.Saldo60dias;
    if (data.filter.Saldo90dias != "")
      condition += " and Layout_Cuentas_por_pagar.Saldo90dias = " + data.filter.Saldo90dias;
    if (data.filter.SaldoMayor180dias != "")
      condition += " and Layout_Cuentas_por_pagar.SaldoMayor180dias = " + data.filter.SaldoMayor180dias;

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
        sort = " Layout_Cuentas_por_pagar.Folio " + data.sortDirecction;
        break;
      case "Folio_de_carga_manual":
        sort = " Layout_Cuentas_por_pagar.Folio_de_carga_manual " + data.sortDirecction;
        break;
      case "Fecha":
        sort = " Layout_Cuentas_por_pagar.Fecha " + data.sortDirecction;
        break;
      case "RFC_Cliente":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Descripcion_Cliente":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Facturacion":
        sort = " Layout_Cuentas_por_pagar.Facturacion " + data.sortDirecction;
        break;
      case "Cobranza":
        sort = " Layout_Cuentas_por_pagar.Cobranza " + data.sortDirecction;
        break;
      case "Saldo30dias":
        sort = " Layout_Cuentas_por_pagar.Saldo30dias " + data.sortDirecction;
        break;
      case "Saldo60dias":
        sort = " Layout_Cuentas_por_pagar.Saldo60dias " + data.sortDirecction;
        break;
      case "Saldo90dias":
        sort = " Layout_Cuentas_por_pagar.Saldo90dias " + data.sortDirecction;
        break;
      case "SaldoMayor180dias":
        sort = " Layout_Cuentas_por_pagar.SaldoMayor180dias " + data.sortDirecction;
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
        condition += " AND Layout_Cuentas_por_pagar.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Layout_Cuentas_por_pagar.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFolio_de_carga_manual != 'undefined' && data.filterAdvanced.fromFolio_de_carga_manual)
	|| (typeof data.filterAdvanced.toFolio_de_carga_manual != 'undefined' && data.filterAdvanced.toFolio_de_carga_manual)) 
	{
      if (typeof data.filterAdvanced.fromFolio_de_carga_manual != 'undefined' && data.filterAdvanced.fromFolio_de_carga_manual)
        condition += " AND Layout_Cuentas_por_pagar.Folio_de_carga_manual >= " + data.filterAdvanced.fromFolio_de_carga_manual;

      if (typeof data.filterAdvanced.toFolio_de_carga_manual != 'undefined' && data.filterAdvanced.toFolio_de_carga_manual) 
        condition += " AND Layout_Cuentas_por_pagar.Folio_de_carga_manual <= " + data.filterAdvanced.toFolio_de_carga_manual;
    }
    if ((typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
	|| (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)) 
	{
      if (typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha) 
        condition += " and CONVERT(VARCHAR(10), Layout_Cuentas_por_pagar.Fecha, 102)  >= '" +  moment(data.filterAdvanced.fromFecha).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha) 
        condition += " and CONVERT(VARCHAR(10), Layout_Cuentas_por_pagar.Fecha, 102)  <= '" + moment(data.filterAdvanced.toFecha).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.RFC_Cliente != 'undefined' && data.filterAdvanced.RFC_Cliente)) {
      switch (data.filterAdvanced.RFC_ClienteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.RFC_Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.RFC_Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.RFC_Cliente + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.RFC_Cliente + "'";
          break;
      }
    } else if (data.filterAdvanced.RFC_ClienteMultiple != null && data.filterAdvanced.RFC_ClienteMultiple.length > 0) {
      var RFC_Clienteds = data.filterAdvanced.RFC_ClienteMultiple.join(",");
      condition += " AND Layout_Cuentas_por_pagar.RFC_Cliente In (" + RFC_Clienteds + ")";
    }
    if ((typeof data.filterAdvanced.Descripcion_Cliente != 'undefined' && data.filterAdvanced.Descripcion_Cliente)) {
      switch (data.filterAdvanced.Descripcion_ClienteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.Descripcion_Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Descripcion_Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Descripcion_Cliente + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.Descripcion_Cliente + "'";
          break;
      }
    } else if (data.filterAdvanced.Descripcion_ClienteMultiple != null && data.filterAdvanced.Descripcion_ClienteMultiple.length > 0) {
      var Descripcion_Clienteds = data.filterAdvanced.Descripcion_ClienteMultiple.join(",");
      condition += " AND Layout_Cuentas_por_pagar.Descripcion_Cliente In (" + Descripcion_Clienteds + ")";
    }
    if ((typeof data.filterAdvanced.fromFacturacion != 'undefined' && data.filterAdvanced.fromFacturacion)
	|| (typeof data.filterAdvanced.toFacturacion != 'undefined' && data.filterAdvanced.toFacturacion)) 
	{
      if (typeof data.filterAdvanced.fromFacturacion != 'undefined' && data.filterAdvanced.fromFacturacion)
        condition += " AND Layout_Cuentas_por_pagar.Facturacion >= " + data.filterAdvanced.fromFacturacion;

      if (typeof data.filterAdvanced.toFacturacion != 'undefined' && data.filterAdvanced.toFacturacion) 
        condition += " AND Layout_Cuentas_por_pagar.Facturacion <= " + data.filterAdvanced.toFacturacion;
    }
    if ((typeof data.filterAdvanced.fromCobranza != 'undefined' && data.filterAdvanced.fromCobranza)
	|| (typeof data.filterAdvanced.toCobranza != 'undefined' && data.filterAdvanced.toCobranza)) 
	{
      if (typeof data.filterAdvanced.fromCobranza != 'undefined' && data.filterAdvanced.fromCobranza)
        condition += " AND Layout_Cuentas_por_pagar.Cobranza >= " + data.filterAdvanced.fromCobranza;

      if (typeof data.filterAdvanced.toCobranza != 'undefined' && data.filterAdvanced.toCobranza) 
        condition += " AND Layout_Cuentas_por_pagar.Cobranza <= " + data.filterAdvanced.toCobranza;
    }
    if ((typeof data.filterAdvanced.fromSaldo30dias != 'undefined' && data.filterAdvanced.fromSaldo30dias)
	|| (typeof data.filterAdvanced.toSaldo30dias != 'undefined' && data.filterAdvanced.toSaldo30dias)) 
	{
      if (typeof data.filterAdvanced.fromSaldo30dias != 'undefined' && data.filterAdvanced.fromSaldo30dias)
        condition += " AND Layout_Cuentas_por_pagar.Saldo30dias >= " + data.filterAdvanced.fromSaldo30dias;

      if (typeof data.filterAdvanced.toSaldo30dias != 'undefined' && data.filterAdvanced.toSaldo30dias) 
        condition += " AND Layout_Cuentas_por_pagar.Saldo30dias <= " + data.filterAdvanced.toSaldo30dias;
    }
    if ((typeof data.filterAdvanced.fromSaldo60dias != 'undefined' && data.filterAdvanced.fromSaldo60dias)
	|| (typeof data.filterAdvanced.toSaldo60dias != 'undefined' && data.filterAdvanced.toSaldo60dias)) 
	{
      if (typeof data.filterAdvanced.fromSaldo60dias != 'undefined' && data.filterAdvanced.fromSaldo60dias)
        condition += " AND Layout_Cuentas_por_pagar.Saldo60dias >= " + data.filterAdvanced.fromSaldo60dias;

      if (typeof data.filterAdvanced.toSaldo60dias != 'undefined' && data.filterAdvanced.toSaldo60dias) 
        condition += " AND Layout_Cuentas_por_pagar.Saldo60dias <= " + data.filterAdvanced.toSaldo60dias;
    }
    if ((typeof data.filterAdvanced.fromSaldo90dias != 'undefined' && data.filterAdvanced.fromSaldo90dias)
	|| (typeof data.filterAdvanced.toSaldo90dias != 'undefined' && data.filterAdvanced.toSaldo90dias)) 
	{
      if (typeof data.filterAdvanced.fromSaldo90dias != 'undefined' && data.filterAdvanced.fromSaldo90dias)
        condition += " AND Layout_Cuentas_por_pagar.Saldo90dias >= " + data.filterAdvanced.fromSaldo90dias;

      if (typeof data.filterAdvanced.toSaldo90dias != 'undefined' && data.filterAdvanced.toSaldo90dias) 
        condition += " AND Layout_Cuentas_por_pagar.Saldo90dias <= " + data.filterAdvanced.toSaldo90dias;
    }
    if ((typeof data.filterAdvanced.fromSaldoMayor180dias != 'undefined' && data.filterAdvanced.fromSaldoMayor180dias)
	|| (typeof data.filterAdvanced.toSaldoMayor180dias != 'undefined' && data.filterAdvanced.toSaldoMayor180dias)) 
	{
      if (typeof data.filterAdvanced.fromSaldoMayor180dias != 'undefined' && data.filterAdvanced.fromSaldoMayor180dias)
        condition += " AND Layout_Cuentas_por_pagar.SaldoMayor180dias >= " + data.filterAdvanced.fromSaldoMayor180dias;

      if (typeof data.filterAdvanced.toSaldoMayor180dias != 'undefined' && data.filterAdvanced.toSaldoMayor180dias) 
        condition += " AND Layout_Cuentas_por_pagar.SaldoMayor180dias <= " + data.filterAdvanced.toSaldoMayor180dias;
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
              const longest = result.Layout_Cuentas_por_pagars.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Layout_Cuentas_por_pagars);
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
