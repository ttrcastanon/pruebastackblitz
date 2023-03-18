import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { PiezasService } from "src/app/api-services/Piezas.service";
import { Piezas } from "src/app/models/Piezas";
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
import { PiezasIndexRules } from 'src/app/shared/businessRules/Piezas-index-rules';
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
  selector: "app-list-Piezas",
  templateUrl: "./list-Piezas.component.html",
  styleUrls: ["./list-Piezas.component.scss"],
})
export class ListPiezasComponent extends PiezasIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Codigo",
    "Descripcion",
    "Instalacion",
    "N_de_Serie",
    "Posicion",
    "OT",
    "Periodicidad_meses",
    "Vencimiento",
    "Descripcion_Busqueda",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Codigo",
      "Descripcion",
      "Instalacion",
      "N_de_Serie",
      "Posicion",
      "OT",
      "Periodicidad_meses",
      "Vencimiento",
      "Descripcion_Busqueda",

    ],
    columns_filters: [
      "acciones_filtro",
      "Codigo_filtro",
      "Descripcion_filtro",
      "Instalacion_filtro",
      "N_de_Serie_filtro",
      "Posicion_filtro",
      "OT_filtro",
      "Periodicidad_meses_filtro",
      "Vencimiento_filtro",
      "Descripcion_Busqueda_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Codigo: "",
      Descripcion: "",
      Instalacion: null,
      N_de_Serie: "",
      Posicion: "",
      OT: "",
      Periodicidad_meses: "",
      Vencimiento: null,
      Descripcion_Busqueda: "",
		
    },
    filterAdvanced: {
      fromCodigo: "",
      toCodigo: "",
      fromInstalacion: "",
      toInstalacion: "",
      PosicionFilter: "",
      Posicion: "",
      PosicionMultiple: "",
      fromOT: "",
      toOT: "",
      fromPeriodicidad_meses: "",
      toPeriodicidad_meses: "",
      fromVencimiento: "",
      toVencimiento: "",

    }
  };

  dataSource: PiezasDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: PiezasDataSource;
  dataClipboard: any;

  constructor(
    private _PiezasService: PiezasService,
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
    this.dataSource = new PiezasDataSource(
      this._PiezasService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Piezas)
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
    this.listConfig.filter.Codigo = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Instalacion = undefined;
    this.listConfig.filter.N_de_Serie = "";
    this.listConfig.filter.Posicion = "";
    this.listConfig.filter.OT = "";
    this.listConfig.filter.Periodicidad_meses = "";
    this.listConfig.filter.Vencimiento = undefined;
    this.listConfig.filter.Descripcion_Busqueda = "";

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

//INICIA - BRID:259 - En el listado ocultar la columna "Descripción Búsqueda - Autor: Lizeth Villa - Actualización: 2/9/2021 8:03:13 PM
if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Descripcion_Busqueda")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Descripcion_Busqueda")  }
//TERMINA - BRID:259

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

  remove(row: Piezas) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._PiezasService
          .delete(+row.Codigo)
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
  ActionPrint(dataRow: Piezas) {

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
'Código'
,'Descripción'
,'Instalación'
,'N° de Serie'
,'Posición'
,'OT'
,'Periodicidad (meses)'
,'Vencimiento'
,'Descripción Búsqueda'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Codigo
,x.Descripcion
,x.Instalacion
,x.N_de_Serie
,x.Posicion_Tipo_de_Posicion_de_Piezas.Descripcion
,x.OT
,x.Periodicidad_meses
,x.Vencimiento
,x.Descripcion_Busqueda
		  
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
    pdfMake.createPdf(pdfDefinition).download('Piezas.pdf');
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
          this._PiezasService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Piezass;
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
          this._PiezasService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Piezass;
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
        'Código ': fields.Codigo,
        'Descripción ': fields.Descripcion,
        'Instalación ': fields.Instalacion ? momentJS(fields.Instalacion).format('DD/MM/YYYY') : '',
        'N° de Serie ': fields.N_de_Serie,
        'Posición ': fields.Posicion_Tipo_de_Posicion_de_Piezas.Descripcion,
        'OT ': fields.OT,
        'Periodicidad (meses) ': fields.Periodicidad_meses,
        'Vencimiento ': fields.Vencimiento ? momentJS(fields.Vencimiento).format('DD/MM/YYYY') : '',
        'Descripción Búsqueda ': fields.Descripcion_Busqueda,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Piezas  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Codigo: x.Codigo,
      Descripcion: x.Descripcion,
      Instalacion: x.Instalacion,
      N_de_Serie: x.N_de_Serie,
      Posicion: x.Posicion_Tipo_de_Posicion_de_Piezas.Descripcion,
      OT: x.OT,
      Periodicidad_meses: x.Periodicidad_meses,
      Vencimiento: x.Vencimiento,
      Descripcion_Busqueda: x.Descripcion_Busqueda,

    }));

    this.excelService.exportToCsv(result, 'Piezas',  ['Codigo'    ,'Descripcion'  ,'Instalacion'  ,'N_de_Serie'  ,'Posicion'  ,'OT'  ,'Periodicidad_meses'  ,'Vencimiento'  ,'Descripcion_Busqueda' ]);
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
    template += '          <th>Código</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>Instalación</th>';
    template += '          <th>N° de Serie</th>';
    template += '          <th>Posición</th>';
    template += '          <th>OT</th>';
    template += '          <th>Periodicidad (meses)</th>';
    template += '          <th>Vencimiento</th>';
    template += '          <th>Descripción Búsqueda</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Codigo + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.Instalacion + '</td>';
      template += '          <td>' + element.N_de_Serie + '</td>';
      template += '          <td>' + element.Posicion_Tipo_de_Posicion_de_Piezas.Descripcion + '</td>';
      template += '          <td>' + element.OT + '</td>';
      template += '          <td>' + element.Periodicidad_meses + '</td>';
      template += '          <td>' + element.Vencimiento + '</td>';
      template += '          <td>' + element.Descripcion_Busqueda + '</td>';
		  
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
	template += '\t Código';
	template += '\t Descripción';
	template += '\t Instalación';
	template += '\t N° de Serie';
	template += '\t Posición';
	template += '\t OT';
	template += '\t Periodicidad (meses)';
	template += '\t Vencimiento';
	template += '\t Descripción Búsqueda';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Codigo;
	  template += '\t ' + element.Descripcion;
	  template += '\t ' + element.Instalacion;
	  template += '\t ' + element.N_de_Serie;
      template += '\t ' + element.Posicion_Tipo_de_Posicion_de_Piezas.Descripcion;
	  template += '\t ' + element.OT;
	  template += '\t ' + element.Periodicidad_meses;
	  template += '\t ' + element.Vencimiento;
	  template += '\t ' + element.Descripcion_Busqueda;

	  template += '\n';
    });

    return template;
  }

}

export class PiezasDataSource implements DataSource<Piezas>
{
  private subject = new BehaviorSubject<Piezas[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: PiezasService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Piezas[]> {
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
          if (column === 'Codigo') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Piezass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Piezass);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Codigo != "")
      condition += " and Piezas.Codigo like '%" + data.filter.Codigo + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Piezas.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Instalacion)
      condition += " and CONVERT(VARCHAR(10), Piezas.Instalacion, 102)  = '" + moment(data.filter.Instalacion).format("YYYY.MM.DD") + "'";
    if (data.filter.N_de_Serie != "")
      condition += " and Piezas.N_de_Serie like '%" + data.filter.N_de_Serie + "%' ";
    if (data.filter.Posicion != "")
      condition += " and Tipo_de_Posicion_de_Piezas.Descripcion like '%" + data.filter.Posicion + "%' ";
    if (data.filter.OT != "")
      condition += " and Piezas.OT = " + data.filter.OT;
    if (data.filter.Periodicidad_meses != "")
      condition += " and Piezas.Periodicidad_meses = " + data.filter.Periodicidad_meses;
    if (data.filter.Vencimiento)
      condition += " and CONVERT(VARCHAR(10), Piezas.Vencimiento, 102)  = '" + moment(data.filter.Vencimiento).format("YYYY.MM.DD") + "'";
    if (data.filter.Descripcion_Busqueda != "")
      condition += " and Piezas.Descripcion_Busqueda like '%" + data.filter.Descripcion_Busqueda + "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "Codigo":
        sort = " Piezas.Codigo " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Piezas.Descripcion " + data.sortDirecction;
        break;
      case "Instalacion":
        sort = " Piezas.Instalacion " + data.sortDirecction;
        break;
      case "N_de_Serie":
        sort = " Piezas.N_de_Serie " + data.sortDirecction;
        break;
      case "Posicion":
        sort = " Tipo_de_Posicion_de_Piezas.Descripcion " + data.sortDirecction;
        break;
      case "OT":
        sort = " Piezas.OT " + data.sortDirecction;
        break;
      case "Periodicidad_meses":
        sort = " Piezas.Periodicidad_meses " + data.sortDirecction;
        break;
      case "Vencimiento":
        sort = " Piezas.Vencimiento " + data.sortDirecction;
        break;
      case "Descripcion_Busqueda":
        sort = " Piezas.Descripcion_Busqueda " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    switch (data.filterAdvanced.CodigoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Piezas.Codigo LIKE '" + data.filterAdvanced.Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Piezas.Codigo LIKE '%" + data.filterAdvanced.Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Piezas.Codigo LIKE '%" + data.filterAdvanced.Codigo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Piezas.Codigo = '" + data.filterAdvanced.Codigo + "'";
        break;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Piezas.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Piezas.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Piezas.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Piezas.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromInstalacion != 'undefined' && data.filterAdvanced.fromInstalacion)
	|| (typeof data.filterAdvanced.toInstalacion != 'undefined' && data.filterAdvanced.toInstalacion)) 
	{
      if (typeof data.filterAdvanced.fromInstalacion != 'undefined' && data.filterAdvanced.fromInstalacion) 
        condition += " and CONVERT(VARCHAR(10), Piezas.Instalacion, 102)  >= '" +  moment(data.filterAdvanced.fromInstalacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toInstalacion != 'undefined' && data.filterAdvanced.toInstalacion) 
        condition += " and CONVERT(VARCHAR(10), Piezas.Instalacion, 102)  <= '" + moment(data.filterAdvanced.toInstalacion).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.N_de_SerieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Piezas.N_de_Serie LIKE '" + data.filterAdvanced.N_de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Piezas.N_de_Serie LIKE '%" + data.filterAdvanced.N_de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Piezas.N_de_Serie LIKE '%" + data.filterAdvanced.N_de_Serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Piezas.N_de_Serie = '" + data.filterAdvanced.N_de_Serie + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Posicion != 'undefined' && data.filterAdvanced.Posicion)) {
      switch (data.filterAdvanced.PosicionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Posicion_de_Piezas.Descripcion LIKE '" + data.filterAdvanced.Posicion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Posicion_de_Piezas.Descripcion LIKE '%" + data.filterAdvanced.Posicion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Posicion_de_Piezas.Descripcion LIKE '%" + data.filterAdvanced.Posicion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Posicion_de_Piezas.Descripcion = '" + data.filterAdvanced.Posicion + "'";
          break;
      }
    } else if (data.filterAdvanced.PosicionMultiple != null && data.filterAdvanced.PosicionMultiple.length > 0) {
      var Posicionds = data.filterAdvanced.PosicionMultiple.join(",");
      condition += " AND Piezas.Posicion In (" + Posicionds + ")";
    }
    if ((typeof data.filterAdvanced.fromOT != 'undefined' && data.filterAdvanced.fromOT)
	|| (typeof data.filterAdvanced.toOT != 'undefined' && data.filterAdvanced.toOT)) 
	{
      if (typeof data.filterAdvanced.fromOT != 'undefined' && data.filterAdvanced.fromOT)
        condition += " AND Piezas.OT >= " + data.filterAdvanced.fromOT;

      if (typeof data.filterAdvanced.toOT != 'undefined' && data.filterAdvanced.toOT) 
        condition += " AND Piezas.OT <= " + data.filterAdvanced.toOT;
    }
    if ((typeof data.filterAdvanced.fromPeriodicidad_meses != 'undefined' && data.filterAdvanced.fromPeriodicidad_meses)
	|| (typeof data.filterAdvanced.toPeriodicidad_meses != 'undefined' && data.filterAdvanced.toPeriodicidad_meses)) 
	{
      if (typeof data.filterAdvanced.fromPeriodicidad_meses != 'undefined' && data.filterAdvanced.fromPeriodicidad_meses)
        condition += " AND Piezas.Periodicidad_meses >= " + data.filterAdvanced.fromPeriodicidad_meses;

      if (typeof data.filterAdvanced.toPeriodicidad_meses != 'undefined' && data.filterAdvanced.toPeriodicidad_meses) 
        condition += " AND Piezas.Periodicidad_meses <= " + data.filterAdvanced.toPeriodicidad_meses;
    }
    if ((typeof data.filterAdvanced.fromVencimiento != 'undefined' && data.filterAdvanced.fromVencimiento)
	|| (typeof data.filterAdvanced.toVencimiento != 'undefined' && data.filterAdvanced.toVencimiento)) 
	{
      if (typeof data.filterAdvanced.fromVencimiento != 'undefined' && data.filterAdvanced.fromVencimiento) 
        condition += " and CONVERT(VARCHAR(10), Piezas.Vencimiento, 102)  >= '" +  moment(data.filterAdvanced.fromVencimiento).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toVencimiento != 'undefined' && data.filterAdvanced.toVencimiento) 
        condition += " and CONVERT(VARCHAR(10), Piezas.Vencimiento, 102)  <= '" + moment(data.filterAdvanced.toVencimiento).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Descripcion_BusquedaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Piezas.Descripcion_Busqueda LIKE '" + data.filterAdvanced.Descripcion_Busqueda + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Piezas.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Descripcion_Busqueda + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Piezas.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Descripcion_Busqueda + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Piezas.Descripcion_Busqueda = '" + data.filterAdvanced.Descripcion_Busqueda + "'";
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
          if (column === 'Codigo') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Piezass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Piezass);
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
