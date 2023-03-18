import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Presupuesto_AnualService } from "src/app/api-services/Presupuesto_Anual.service";
import { Presupuesto_Anual } from "src/app/models/Presupuesto_Anual";
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
import { Presupuesto_AnualIndexRules } from 'src/app/shared/businessRules/Presupuesto_Anual-index-rules';
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
  selector: "app-list-Presupuesto_Anual",
  templateUrl: "./list-Presupuesto_Anual.component.html",
  styleUrls: ["./list-Presupuesto_Anual.component.scss"],
})
export class ListPresupuesto_AnualComponent extends Presupuesto_AnualIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Empresa",
    "Ano_en_curso",
    "Monto_Pres__Inicial_Ano",
    "Porcentaje_Pres__Ano",
    "Gasto_Real_Facturado",
    "Pto__Estimado_acumulado",
    "Porcentaje_Estimado_Acumulado",
    "Porcentaje_Gasto_Real_Acumulado",
    "Porcentaje_Diferencia",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Empresa",
      "Ano_en_curso",
      "Monto_Pres__Inicial_Ano",
      "Porcentaje_Pres__Ano",
      "Gasto_Real_Facturado",
      "Pto__Estimado_acumulado",
      "Porcentaje_Estimado_Acumulado",
      "Porcentaje_Gasto_Real_Acumulado",
      "Porcentaje_Diferencia",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Empresa_filtro",
      "Ano_en_curso_filtro",
      "Monto_Pres__Inicial_Ano_filtro",
      "Porcentaje_Pres__Ano_filtro",
      "Gasto_Real_Facturado_filtro",
      "Pto__Estimado_acumulado_filtro",
      "Porcentaje_Estimado_Acumulado_filtro",
      "Porcentaje_Gasto_Real_Acumulado_filtro",
      "Porcentaje_Diferencia_filtro",

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
      Empresa: "",
      Ano_en_curso: "",
      Monto_Pres__Inicial_Ano: "",
      Porcentaje_Pres__Ano: "",
      Gasto_Real_Facturado: "",
      Pto__Estimado_acumulado: "",
      Porcentaje_Estimado_Acumulado: "",
      Porcentaje_Gasto_Real_Acumulado: "",
      Porcentaje_Diferencia: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      EmpresaFilter: "",
      Empresa: "",
      EmpresaMultiple: "",
      fromAno_en_curso: "",
      toAno_en_curso: "",
      fromMonto_Pres__Inicial_Ano: "",
      toMonto_Pres__Inicial_Ano: "",
      fromPorcentaje_Pres__Ano: "",
      toPorcentaje_Pres__Ano: "",
      fromGasto_Real_Facturado: "",
      toGasto_Real_Facturado: "",
      fromPto__Estimado_acumulado: "",
      toPto__Estimado_acumulado: "",
      fromPorcentaje_Estimado_Acumulado: "",
      toPorcentaje_Estimado_Acumulado: "",
      fromPorcentaje_Gasto_Real_Acumulado: "",
      toPorcentaje_Gasto_Real_Acumulado: "",
      fromPorcentaje_Diferencia: "",
      toPorcentaje_Diferencia: "",

    }
  };

  dataSource: Presupuesto_AnualDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Presupuesto_AnualDataSource;
  dataClipboard: any;

  constructor(
    private _Presupuesto_AnualService: Presupuesto_AnualService,
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
    this.dataSource = new Presupuesto_AnualDataSource(
      this._Presupuesto_AnualService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Presupuesto_Anual)
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
    this.listConfig.filter.Empresa = "";
    this.listConfig.filter.Ano_en_curso = "";
    this.listConfig.filter.Monto_Pres__Inicial_Ano = "";
    this.listConfig.filter.Porcentaje_Pres__Ano = "";
    this.listConfig.filter.Gasto_Real_Facturado = "";
    this.listConfig.filter.Pto__Estimado_acumulado = "";
    this.listConfig.filter.Porcentaje_Estimado_Acumulado = "";
    this.listConfig.filter.Porcentaje_Gasto_Real_Acumulado = "";
    this.listConfig.filter.Porcentaje_Diferencia = "";

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

  remove(row: Presupuesto_Anual) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Presupuesto_AnualService
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
  ActionPrint(dataRow: Presupuesto_Anual) {

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
,'Empresa'
,'Año en curso'
,'Monto Pres. Inicial Año'
,'Porcentaje Pres. Año'
,'Gasto Real Facturado'
,'Pto. Estimado acumulado'
,'Porcentaje Estimado Acumulado'
,'Porcentaje Gasto Real Acumulado'
,'Porcentaje Diferencia'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Empresa_Cliente.Razon_Social
,x.Ano_en_curso
,x.Monto_Pres__Inicial_Ano
,x.Porcentaje_Pres__Ano
,x.Gasto_Real_Facturado
,x.Pto__Estimado_acumulado
,x.Porcentaje_Estimado_Acumulado
,x.Porcentaje_Gasto_Real_Acumulado
,x.Porcentaje_Diferencia
		  
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
    pdfMake.createPdf(pdfDefinition).download('Presupuesto_Anual.pdf');
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
          this._Presupuesto_AnualService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Presupuesto_Anuals;
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
          this._Presupuesto_AnualService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Presupuesto_Anuals;
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
        'Empresa ': fields.Empresa_Cliente.Razon_Social,
        'Año en curso ': fields.Ano_en_curso,
        'Monto Pres. Inicial Año ': fields.Monto_Pres__Inicial_Ano,
        'Porcentaje Pres. Año ': fields.Porcentaje_Pres__Ano,
        'Gasto Real Facturado ': fields.Gasto_Real_Facturado,
        'Pto. Estimado acumulado ': fields.Pto__Estimado_acumulado,
        'Porcentaje Estimado Acumulado ': fields.Porcentaje_Estimado_Acumulado,
        'Porcentaje Gasto Real Acumulado ': fields.Porcentaje_Gasto_Real_Acumulado,
        'Porcentaje Diferencia ': fields.Porcentaje_Diferencia,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Presupuesto_Anual  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Empresa: x.Empresa_Cliente.Razon_Social,
      Ano_en_curso: x.Ano_en_curso,
      Monto_Pres__Inicial_Ano: x.Monto_Pres__Inicial_Ano,
      Porcentaje_Pres__Ano: x.Porcentaje_Pres__Ano,
      Gasto_Real_Facturado: x.Gasto_Real_Facturado,
      Pto__Estimado_acumulado: x.Pto__Estimado_acumulado,
      Porcentaje_Estimado_Acumulado: x.Porcentaje_Estimado_Acumulado,
      Porcentaje_Gasto_Real_Acumulado: x.Porcentaje_Gasto_Real_Acumulado,
      Porcentaje_Diferencia: x.Porcentaje_Diferencia,

    }));

    this.excelService.exportToCsv(result, 'Presupuesto_Anual',  ['Folio'    ,'Empresa'  ,'Ano_en_curso'  ,'Monto_Pres__Inicial_Ano'  ,'Porcentaje_Pres__Ano'  ,'Gasto_Real_Facturado'  ,'Pto__Estimado_acumulado'  ,'Porcentaje_Estimado_Acumulado'  ,'Porcentaje_Gasto_Real_Acumulado'  ,'Porcentaje_Diferencia' ]);
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
    template += '          <th>Empresa</th>';
    template += '          <th>Año en curso</th>';
    template += '          <th>Monto Pres. Inicial Año</th>';
    template += '          <th>Porcentaje Pres. Año</th>';
    template += '          <th>Gasto Real Facturado</th>';
    template += '          <th>Pto. Estimado acumulado</th>';
    template += '          <th>Porcentaje Estimado Acumulado</th>';
    template += '          <th>Porcentaje Gasto Real Acumulado</th>';
    template += '          <th>Porcentaje Diferencia</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Empresa_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Ano_en_curso + '</td>';
      template += '          <td>' + element.Monto_Pres__Inicial_Ano + '</td>';
      template += '          <td>' + element.Porcentaje_Pres__Ano + '</td>';
      template += '          <td>' + element.Gasto_Real_Facturado + '</td>';
      template += '          <td>' + element.Pto__Estimado_acumulado + '</td>';
      template += '          <td>' + element.Porcentaje_Estimado_Acumulado + '</td>';
      template += '          <td>' + element.Porcentaje_Gasto_Real_Acumulado + '</td>';
      template += '          <td>' + element.Porcentaje_Diferencia + '</td>';
		  
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
	template += '\t Empresa';
	template += '\t Año en curso';
	template += '\t Monto Pres. Inicial Año';
	template += '\t Porcentaje Pres. Año';
	template += '\t Gasto Real Facturado';
	template += '\t Pto. Estimado acumulado';
	template += '\t Porcentaje Estimado Acumulado';
	template += '\t Porcentaje Gasto Real Acumulado';
	template += '\t Porcentaje Diferencia';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Empresa_Cliente.Razon_Social;
	  template += '\t ' + element.Ano_en_curso;
	  template += '\t ' + element.Monto_Pres__Inicial_Ano;
	  template += '\t ' + element.Porcentaje_Pres__Ano;
	  template += '\t ' + element.Gasto_Real_Facturado;
	  template += '\t ' + element.Pto__Estimado_acumulado;
	  template += '\t ' + element.Porcentaje_Estimado_Acumulado;
	  template += '\t ' + element.Porcentaje_Gasto_Real_Acumulado;
	  template += '\t ' + element.Porcentaje_Diferencia;

	  template += '\n';
    });

    return template;
  }

}

export class Presupuesto_AnualDataSource implements DataSource<Presupuesto_Anual>
{
  private subject = new BehaviorSubject<Presupuesto_Anual[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Presupuesto_AnualService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Presupuesto_Anual[]> {
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
              const longest = result.Presupuesto_Anuals.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Presupuesto_Anuals);
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
      condition += " and Presupuesto_Anual.Folio = " + data.filter.Folio;
    if (data.filter.Empresa != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Empresa + "%' ";
    if (data.filter.Ano_en_curso != "")
      condition += " and Presupuesto_Anual.Ano_en_curso = " + data.filter.Ano_en_curso;
    if (data.filter.Monto_Pres__Inicial_Ano != "")
      condition += " and Presupuesto_Anual.Monto_Pres__Inicial_Ano = " + data.filter.Monto_Pres__Inicial_Ano;
    if (data.filter.Porcentaje_Pres__Ano != "")
      condition += " and Presupuesto_Anual.Porcentaje_Pres__Ano = " + data.filter.Porcentaje_Pres__Ano;
    if (data.filter.Gasto_Real_Facturado != "")
      condition += " and Presupuesto_Anual.Gasto_Real_Facturado = " + data.filter.Gasto_Real_Facturado;
    if (data.filter.Pto__Estimado_acumulado != "")
      condition += " and Presupuesto_Anual.Pto__Estimado_acumulado = " + data.filter.Pto__Estimado_acumulado;
    if (data.filter.Porcentaje_Estimado_Acumulado != "")
      condition += " and Presupuesto_Anual.Porcentaje_Estimado_Acumulado = " + data.filter.Porcentaje_Estimado_Acumulado;
    if (data.filter.Porcentaje_Gasto_Real_Acumulado != "")
      condition += " and Presupuesto_Anual.Porcentaje_Gasto_Real_Acumulado = " + data.filter.Porcentaje_Gasto_Real_Acumulado;
    if (data.filter.Porcentaje_Diferencia != "")
      condition += " and Presupuesto_Anual.Porcentaje_Diferencia = " + data.filter.Porcentaje_Diferencia;

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
        sort = " Presupuesto_Anual.Folio " + data.sortDirecction;
        break;
      case "Empresa":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Ano_en_curso":
        sort = " Presupuesto_Anual.Ano_en_curso " + data.sortDirecction;
        break;
      case "Monto_Pres__Inicial_Ano":
        sort = " Presupuesto_Anual.Monto_Pres__Inicial_Ano " + data.sortDirecction;
        break;
      case "Porcentaje_Pres__Ano":
        sort = " Presupuesto_Anual.Porcentaje_Pres__Ano " + data.sortDirecction;
        break;
      case "Gasto_Real_Facturado":
        sort = " Presupuesto_Anual.Gasto_Real_Facturado " + data.sortDirecction;
        break;
      case "Pto__Estimado_acumulado":
        sort = " Presupuesto_Anual.Pto__Estimado_acumulado " + data.sortDirecction;
        break;
      case "Porcentaje_Estimado_Acumulado":
        sort = " Presupuesto_Anual.Porcentaje_Estimado_Acumulado " + data.sortDirecction;
        break;
      case "Porcentaje_Gasto_Real_Acumulado":
        sort = " Presupuesto_Anual.Porcentaje_Gasto_Real_Acumulado " + data.sortDirecction;
        break;
      case "Porcentaje_Diferencia":
        sort = " Presupuesto_Anual.Porcentaje_Diferencia " + data.sortDirecction;
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
        condition += " AND Presupuesto_Anual.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Presupuesto_Anual.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Empresa != 'undefined' && data.filterAdvanced.Empresa)) {
      switch (data.filterAdvanced.EmpresaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.Empresa + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Empresa + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Empresa + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.Empresa + "'";
          break;
      }
    } else if (data.filterAdvanced.EmpresaMultiple != null && data.filterAdvanced.EmpresaMultiple.length > 0) {
      var Empresads = data.filterAdvanced.EmpresaMultiple.join(",");
      condition += " AND Presupuesto_Anual.Empresa In (" + Empresads + ")";
    }
    if ((typeof data.filterAdvanced.fromAno_en_curso != 'undefined' && data.filterAdvanced.fromAno_en_curso)
	|| (typeof data.filterAdvanced.toAno_en_curso != 'undefined' && data.filterAdvanced.toAno_en_curso)) 
	{
      if (typeof data.filterAdvanced.fromAno_en_curso != 'undefined' && data.filterAdvanced.fromAno_en_curso)
        condition += " AND Presupuesto_Anual.Ano_en_curso >= " + data.filterAdvanced.fromAno_en_curso;

      if (typeof data.filterAdvanced.toAno_en_curso != 'undefined' && data.filterAdvanced.toAno_en_curso) 
        condition += " AND Presupuesto_Anual.Ano_en_curso <= " + data.filterAdvanced.toAno_en_curso;
    }
    if ((typeof data.filterAdvanced.fromMonto_Pres__Inicial_Ano != 'undefined' && data.filterAdvanced.fromMonto_Pres__Inicial_Ano)
	|| (typeof data.filterAdvanced.toMonto_Pres__Inicial_Ano != 'undefined' && data.filterAdvanced.toMonto_Pres__Inicial_Ano)) 
	{
      if (typeof data.filterAdvanced.fromMonto_Pres__Inicial_Ano != 'undefined' && data.filterAdvanced.fromMonto_Pres__Inicial_Ano)
        condition += " AND Presupuesto_Anual.Monto_Pres__Inicial_Ano >= " + data.filterAdvanced.fromMonto_Pres__Inicial_Ano;

      if (typeof data.filterAdvanced.toMonto_Pres__Inicial_Ano != 'undefined' && data.filterAdvanced.toMonto_Pres__Inicial_Ano) 
        condition += " AND Presupuesto_Anual.Monto_Pres__Inicial_Ano <= " + data.filterAdvanced.toMonto_Pres__Inicial_Ano;
    }
    if ((typeof data.filterAdvanced.fromPorcentaje_Pres__Ano != 'undefined' && data.filterAdvanced.fromPorcentaje_Pres__Ano)
	|| (typeof data.filterAdvanced.toPorcentaje_Pres__Ano != 'undefined' && data.filterAdvanced.toPorcentaje_Pres__Ano)) 
	{
      if (typeof data.filterAdvanced.fromPorcentaje_Pres__Ano != 'undefined' && data.filterAdvanced.fromPorcentaje_Pres__Ano)
        condition += " AND Presupuesto_Anual.Porcentaje_Pres__Ano >= " + data.filterAdvanced.fromPorcentaje_Pres__Ano;

      if (typeof data.filterAdvanced.toPorcentaje_Pres__Ano != 'undefined' && data.filterAdvanced.toPorcentaje_Pres__Ano) 
        condition += " AND Presupuesto_Anual.Porcentaje_Pres__Ano <= " + data.filterAdvanced.toPorcentaje_Pres__Ano;
    }
    if ((typeof data.filterAdvanced.fromGasto_Real_Facturado != 'undefined' && data.filterAdvanced.fromGasto_Real_Facturado)
	|| (typeof data.filterAdvanced.toGasto_Real_Facturado != 'undefined' && data.filterAdvanced.toGasto_Real_Facturado)) 
	{
      if (typeof data.filterAdvanced.fromGasto_Real_Facturado != 'undefined' && data.filterAdvanced.fromGasto_Real_Facturado)
        condition += " AND Presupuesto_Anual.Gasto_Real_Facturado >= " + data.filterAdvanced.fromGasto_Real_Facturado;

      if (typeof data.filterAdvanced.toGasto_Real_Facturado != 'undefined' && data.filterAdvanced.toGasto_Real_Facturado) 
        condition += " AND Presupuesto_Anual.Gasto_Real_Facturado <= " + data.filterAdvanced.toGasto_Real_Facturado;
    }
    if ((typeof data.filterAdvanced.fromPto__Estimado_acumulado != 'undefined' && data.filterAdvanced.fromPto__Estimado_acumulado)
	|| (typeof data.filterAdvanced.toPto__Estimado_acumulado != 'undefined' && data.filterAdvanced.toPto__Estimado_acumulado)) 
	{
      if (typeof data.filterAdvanced.fromPto__Estimado_acumulado != 'undefined' && data.filterAdvanced.fromPto__Estimado_acumulado)
        condition += " AND Presupuesto_Anual.Pto__Estimado_acumulado >= " + data.filterAdvanced.fromPto__Estimado_acumulado;

      if (typeof data.filterAdvanced.toPto__Estimado_acumulado != 'undefined' && data.filterAdvanced.toPto__Estimado_acumulado) 
        condition += " AND Presupuesto_Anual.Pto__Estimado_acumulado <= " + data.filterAdvanced.toPto__Estimado_acumulado;
    }
    if ((typeof data.filterAdvanced.fromPorcentaje_Estimado_Acumulado != 'undefined' && data.filterAdvanced.fromPorcentaje_Estimado_Acumulado)
	|| (typeof data.filterAdvanced.toPorcentaje_Estimado_Acumulado != 'undefined' && data.filterAdvanced.toPorcentaje_Estimado_Acumulado)) 
	{
      if (typeof data.filterAdvanced.fromPorcentaje_Estimado_Acumulado != 'undefined' && data.filterAdvanced.fromPorcentaje_Estimado_Acumulado)
        condition += " AND Presupuesto_Anual.Porcentaje_Estimado_Acumulado >= " + data.filterAdvanced.fromPorcentaje_Estimado_Acumulado;

      if (typeof data.filterAdvanced.toPorcentaje_Estimado_Acumulado != 'undefined' && data.filterAdvanced.toPorcentaje_Estimado_Acumulado) 
        condition += " AND Presupuesto_Anual.Porcentaje_Estimado_Acumulado <= " + data.filterAdvanced.toPorcentaje_Estimado_Acumulado;
    }
    if ((typeof data.filterAdvanced.fromPorcentaje_Gasto_Real_Acumulado != 'undefined' && data.filterAdvanced.fromPorcentaje_Gasto_Real_Acumulado)
	|| (typeof data.filterAdvanced.toPorcentaje_Gasto_Real_Acumulado != 'undefined' && data.filterAdvanced.toPorcentaje_Gasto_Real_Acumulado)) 
	{
      if (typeof data.filterAdvanced.fromPorcentaje_Gasto_Real_Acumulado != 'undefined' && data.filterAdvanced.fromPorcentaje_Gasto_Real_Acumulado)
        condition += " AND Presupuesto_Anual.Porcentaje_Gasto_Real_Acumulado >= " + data.filterAdvanced.fromPorcentaje_Gasto_Real_Acumulado;

      if (typeof data.filterAdvanced.toPorcentaje_Gasto_Real_Acumulado != 'undefined' && data.filterAdvanced.toPorcentaje_Gasto_Real_Acumulado) 
        condition += " AND Presupuesto_Anual.Porcentaje_Gasto_Real_Acumulado <= " + data.filterAdvanced.toPorcentaje_Gasto_Real_Acumulado;
    }
    if ((typeof data.filterAdvanced.fromPorcentaje_Diferencia != 'undefined' && data.filterAdvanced.fromPorcentaje_Diferencia)
	|| (typeof data.filterAdvanced.toPorcentaje_Diferencia != 'undefined' && data.filterAdvanced.toPorcentaje_Diferencia)) 
	{
      if (typeof data.filterAdvanced.fromPorcentaje_Diferencia != 'undefined' && data.filterAdvanced.fromPorcentaje_Diferencia)
        condition += " AND Presupuesto_Anual.Porcentaje_Diferencia >= " + data.filterAdvanced.fromPorcentaje_Diferencia;

      if (typeof data.filterAdvanced.toPorcentaje_Diferencia != 'undefined' && data.filterAdvanced.toPorcentaje_Diferencia) 
        condition += " AND Presupuesto_Anual.Porcentaje_Diferencia <= " + data.filterAdvanced.toPorcentaje_Diferencia;
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
              const longest = result.Presupuesto_Anuals.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Presupuesto_Anuals);
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
