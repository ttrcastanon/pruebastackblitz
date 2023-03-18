import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Politicas_de_Precios_y_DescuentosService } from "src/app/api-services/Politicas_de_Precios_y_Descuentos.service";
import { Politicas_de_Precios_y_Descuentos } from "src/app/models/Politicas_de_Precios_y_Descuentos";
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
import { Politicas_de_Precios_y_DescuentosIndexRules } from 'src/app/shared/businessRules/Politicas_de_Precios_y_Descuentos-index-rules';
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
  selector: "app-list-Politicas_de_Precios_y_Descuentos",
  templateUrl: "./list-Politicas_de_Precios_y_Descuentos.component.html",
  styleUrls: ["./list-Politicas_de_Precios_y_Descuentos.component.scss"],
})
export class ListPoliticas_de_Precios_y_DescuentosComponent extends Politicas_de_Precios_y_DescuentosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "contrato_tarifa_tecnico",
    "contrato_tarifa_rampa",
    "sin_contrato_tarifa_tecnico",
    "sin_contrato_tarifa_rampa",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "contrato_tarifa_tecnico",
      "contrato_tarifa_rampa",
      "sin_contrato_tarifa_tecnico",
      "sin_contrato_tarifa_rampa",
      "Clausulas_de_Cotizacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "contrato_tarifa_tecnico_filtro",
      "contrato_tarifa_rampa_filtro",
      "sin_contrato_tarifa_tecnico_filtro",
      "sin_contrato_tarifa_rampa_filtro",
      "Clausulas_de_Cotizacion_filtro",

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
      contrato_tarifa_tecnico: "",
      contrato_tarifa_rampa: "",
      sin_contrato_tarifa_tecnico: "",
      sin_contrato_tarifa_rampa: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromcontrato_tarifa_tecnico: "",
      tocontrato_tarifa_tecnico: "",
      fromcontrato_tarifa_rampa: "",
      tocontrato_tarifa_rampa: "",
      fromsin_contrato_tarifa_tecnico: "",
      tosin_contrato_tarifa_tecnico: "",
      fromsin_contrato_tarifa_rampa: "",
      tosin_contrato_tarifa_rampa: "",

    }
  };

  dataSource: Politicas_de_Precios_y_DescuentosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Politicas_de_Precios_y_DescuentosDataSource;
  dataClipboard: any;

  constructor(
    private _Politicas_de_Precios_y_DescuentosService: Politicas_de_Precios_y_DescuentosService,
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
    this.dataSource = new Politicas_de_Precios_y_DescuentosDataSource(
      this._Politicas_de_Precios_y_DescuentosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Politicas_de_Precios_y_Descuentos)
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
    this.listConfig.filter.contrato_tarifa_tecnico = "";
    this.listConfig.filter.contrato_tarifa_rampa = "";
    this.listConfig.filter.sin_contrato_tarifa_tecnico = "";
    this.listConfig.filter.sin_contrato_tarifa_rampa = "";

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

  remove(row: Politicas_de_Precios_y_Descuentos) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Politicas_de_Precios_y_DescuentosService
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
  ActionPrint(dataRow: Politicas_de_Precios_y_Descuentos) {

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
,'Cliente con Contrato - Tarifa Hora Técnico'
,'Cliente con Contrato - Tarifa Hora de Rampa'
,'Cliente SIN Contrato - Tarifa Hora Técnico'
,'Cliente SIN Contrato - Tarifa Hora de Rampa'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.contrato_tarifa_tecnico
,x.contrato_tarifa_rampa
,x.sin_contrato_tarifa_tecnico
,x.sin_contrato_tarifa_rampa
		  
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
    pdfMake.createPdf(pdfDefinition).download('Politicas_de_Precios_y_Descuentos.pdf');
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
          this._Politicas_de_Precios_y_DescuentosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Politicas_de_Precios_y_Descuentoss;
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
          this._Politicas_de_Precios_y_DescuentosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Politicas_de_Precios_y_Descuentoss;
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
        'Cliente con Contrato - Tarifa Hora Técnico ': fields.contrato_tarifa_tecnico,
        'Cliente con Contrato - Tarifa Hora de Rampa ': fields.contrato_tarifa_rampa,
        'Cliente SIN Contrato - Tarifa Hora Técnico ': fields.sin_contrato_tarifa_tecnico,
        'Cliente SIN Contrato - Tarifa Hora de Rampa ': fields.sin_contrato_tarifa_rampa,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Politicas_de_Precios_y_Descuentos  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      contrato_tarifa_tecnico: x.contrato_tarifa_tecnico,
      contrato_tarifa_rampa: x.contrato_tarifa_rampa,
      sin_contrato_tarifa_tecnico: x.sin_contrato_tarifa_tecnico,
      sin_contrato_tarifa_rampa: x.sin_contrato_tarifa_rampa,

    }));

    this.excelService.exportToCsv(result, 'Politicas_de_Precios_y_Descuentos',  ['Folio'    ,'contrato_tarifa_tecnico'  ,'contrato_tarifa_rampa'  ,'sin_contrato_tarifa_tecnico'  ,'sin_contrato_tarifa_rampa' ]);
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
    template += '          <th>Cliente con Contrato - Tarifa Hora Técnico</th>';
    template += '          <th>Cliente con Contrato - Tarifa Hora de Rampa</th>';
    template += '          <th>Cliente SIN Contrato - Tarifa Hora Técnico</th>';
    template += '          <th>Cliente SIN Contrato - Tarifa Hora de Rampa</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.contrato_tarifa_tecnico + '</td>';
      template += '          <td>' + element.contrato_tarifa_rampa + '</td>';
      template += '          <td>' + element.sin_contrato_tarifa_tecnico + '</td>';
      template += '          <td>' + element.sin_contrato_tarifa_rampa + '</td>';
		  
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
	template += '\t Cliente con Contrato - Tarifa Hora Técnico';
	template += '\t Cliente con Contrato - Tarifa Hora de Rampa';
	template += '\t Cliente SIN Contrato - Tarifa Hora Técnico';
	template += '\t Cliente SIN Contrato - Tarifa Hora de Rampa';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.contrato_tarifa_tecnico;
	  template += '\t ' + element.contrato_tarifa_rampa;
	  template += '\t ' + element.sin_contrato_tarifa_tecnico;
	  template += '\t ' + element.sin_contrato_tarifa_rampa;

	  template += '\n';
    });

    return template;
  }

}

export class Politicas_de_Precios_y_DescuentosDataSource implements DataSource<Politicas_de_Precios_y_Descuentos>
{
  private subject = new BehaviorSubject<Politicas_de_Precios_y_Descuentos[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Politicas_de_Precios_y_DescuentosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Politicas_de_Precios_y_Descuentos[]> {
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
          } else if (column != 'acciones'  && column != 'Clausulas_de_Cotizacion' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Politicas_de_Precios_y_Descuentoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Politicas_de_Precios_y_Descuentoss);
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
      condition += " and Politicas_de_Precios_y_Descuentos.Folio = " + data.filter.Folio;
    if (data.filter.contrato_tarifa_tecnico != "")
      condition += " and Politicas_de_Precios_y_Descuentos.contrato_tarifa_tecnico = " + data.filter.contrato_tarifa_tecnico;
    if (data.filter.contrato_tarifa_rampa != "")
      condition += " and Politicas_de_Precios_y_Descuentos.contrato_tarifa_rampa = " + data.filter.contrato_tarifa_rampa;
    if (data.filter.sin_contrato_tarifa_tecnico != "")
      condition += " and Politicas_de_Precios_y_Descuentos.sin_contrato_tarifa_tecnico = " + data.filter.sin_contrato_tarifa_tecnico;
    if (data.filter.sin_contrato_tarifa_rampa != "")
      condition += " and Politicas_de_Precios_y_Descuentos.sin_contrato_tarifa_rampa = " + data.filter.sin_contrato_tarifa_rampa;

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
        sort = " Politicas_de_Precios_y_Descuentos.Folio " + data.sortDirecction;
        break;
      case "contrato_tarifa_tecnico":
        sort = " Politicas_de_Precios_y_Descuentos.contrato_tarifa_tecnico " + data.sortDirecction;
        break;
      case "contrato_tarifa_rampa":
        sort = " Politicas_de_Precios_y_Descuentos.contrato_tarifa_rampa " + data.sortDirecction;
        break;
      case "sin_contrato_tarifa_tecnico":
        sort = " Politicas_de_Precios_y_Descuentos.sin_contrato_tarifa_tecnico " + data.sortDirecction;
        break;
      case "sin_contrato_tarifa_rampa":
        sort = " Politicas_de_Precios_y_Descuentos.sin_contrato_tarifa_rampa " + data.sortDirecction;
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
        condition += " AND Politicas_de_Precios_y_Descuentos.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Politicas_de_Precios_y_Descuentos.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromcontrato_tarifa_tecnico != 'undefined' && data.filterAdvanced.fromcontrato_tarifa_tecnico)
	|| (typeof data.filterAdvanced.tocontrato_tarifa_tecnico != 'undefined' && data.filterAdvanced.tocontrato_tarifa_tecnico)) 
	{
      if (typeof data.filterAdvanced.fromcontrato_tarifa_tecnico != 'undefined' && data.filterAdvanced.fromcontrato_tarifa_tecnico)
        condition += " AND Politicas_de_Precios_y_Descuentos.contrato_tarifa_tecnico >= " + data.filterAdvanced.fromcontrato_tarifa_tecnico;

      if (typeof data.filterAdvanced.tocontrato_tarifa_tecnico != 'undefined' && data.filterAdvanced.tocontrato_tarifa_tecnico) 
        condition += " AND Politicas_de_Precios_y_Descuentos.contrato_tarifa_tecnico <= " + data.filterAdvanced.tocontrato_tarifa_tecnico;
    }
    if ((typeof data.filterAdvanced.fromcontrato_tarifa_rampa != 'undefined' && data.filterAdvanced.fromcontrato_tarifa_rampa)
	|| (typeof data.filterAdvanced.tocontrato_tarifa_rampa != 'undefined' && data.filterAdvanced.tocontrato_tarifa_rampa)) 
	{
      if (typeof data.filterAdvanced.fromcontrato_tarifa_rampa != 'undefined' && data.filterAdvanced.fromcontrato_tarifa_rampa)
        condition += " AND Politicas_de_Precios_y_Descuentos.contrato_tarifa_rampa >= " + data.filterAdvanced.fromcontrato_tarifa_rampa;

      if (typeof data.filterAdvanced.tocontrato_tarifa_rampa != 'undefined' && data.filterAdvanced.tocontrato_tarifa_rampa) 
        condition += " AND Politicas_de_Precios_y_Descuentos.contrato_tarifa_rampa <= " + data.filterAdvanced.tocontrato_tarifa_rampa;
    }
    if ((typeof data.filterAdvanced.fromsin_contrato_tarifa_tecnico != 'undefined' && data.filterAdvanced.fromsin_contrato_tarifa_tecnico)
	|| (typeof data.filterAdvanced.tosin_contrato_tarifa_tecnico != 'undefined' && data.filterAdvanced.tosin_contrato_tarifa_tecnico)) 
	{
      if (typeof data.filterAdvanced.fromsin_contrato_tarifa_tecnico != 'undefined' && data.filterAdvanced.fromsin_contrato_tarifa_tecnico)
        condition += " AND Politicas_de_Precios_y_Descuentos.sin_contrato_tarifa_tecnico >= " + data.filterAdvanced.fromsin_contrato_tarifa_tecnico;

      if (typeof data.filterAdvanced.tosin_contrato_tarifa_tecnico != 'undefined' && data.filterAdvanced.tosin_contrato_tarifa_tecnico) 
        condition += " AND Politicas_de_Precios_y_Descuentos.sin_contrato_tarifa_tecnico <= " + data.filterAdvanced.tosin_contrato_tarifa_tecnico;
    }
    if ((typeof data.filterAdvanced.fromsin_contrato_tarifa_rampa != 'undefined' && data.filterAdvanced.fromsin_contrato_tarifa_rampa)
	|| (typeof data.filterAdvanced.tosin_contrato_tarifa_rampa != 'undefined' && data.filterAdvanced.tosin_contrato_tarifa_rampa)) 
	{
      if (typeof data.filterAdvanced.fromsin_contrato_tarifa_rampa != 'undefined' && data.filterAdvanced.fromsin_contrato_tarifa_rampa)
        condition += " AND Politicas_de_Precios_y_Descuentos.sin_contrato_tarifa_rampa >= " + data.filterAdvanced.fromsin_contrato_tarifa_rampa;

      if (typeof data.filterAdvanced.tosin_contrato_tarifa_rampa != 'undefined' && data.filterAdvanced.tosin_contrato_tarifa_rampa) 
        condition += " AND Politicas_de_Precios_y_Descuentos.sin_contrato_tarifa_rampa <= " + data.filterAdvanced.tosin_contrato_tarifa_rampa;
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
          } else if (column != 'acciones'  && column != 'Clausulas_de_Cotizacion' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Politicas_de_Precios_y_Descuentoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Politicas_de_Precios_y_Descuentoss);
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
