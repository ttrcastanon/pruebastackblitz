import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Coordinacion_PasajerosService } from "src/app/api-services/Coordinacion_Pasajeros.service";
import { Coordinacion_Pasajeros } from "src/app/models/Coordinacion_Pasajeros";
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
import { Coordinacion_PasajerosIndexRules } from 'src/app/shared/businessRules/Coordinacion_Pasajeros-index-rules';
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
  selector: "app-list-Coordinacion_Pasajeros",
  templateUrl: "./list-Coordinacion_Pasajeros.component.html",
  styleUrls: ["./list-Coordinacion_Pasajeros.component.scss"],
})
export class ListCoordinacion_PasajerosComponent extends Coordinacion_PasajerosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Numero_de_Vuelo",
    "Matricula",
    "Ruta_de_Vuelo",
    "Fecha_y_Hora_de_Salida",
    "Calificacion",
    "Observaciones",
    "Notas_C",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Numero_de_Vuelo",
      "Matricula",
      "Ruta_de_Vuelo",
      "Fecha_y_Hora_de_Salida",
      "Calificacion",
      "Observaciones",
      "Notas_C",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Numero_de_Vuelo_filtro",
      "Matricula_filtro",
      "Ruta_de_Vuelo_filtro",
      "Fecha_y_Hora_de_Salida_filtro",
      "Calificacion_filtro",
      "Observaciones_filtro",
      "Notas_C_filtro",

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
      Numero_de_Vuelo: "",
      Matricula: "",
      Ruta_de_Vuelo: "",
      Fecha_y_Hora_de_Salida: "",
      Calificacion: "",
      Observaciones: "",
      Notas_C: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Numero_de_VueloFilter: "",
      Numero_de_Vuelo: "",
      Numero_de_VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromCalificacion: "",
      toCalificacion: "",

    }
  };

  dataSource: Coordinacion_PasajerosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Coordinacion_PasajerosDataSource;
  dataClipboard: any;

  constructor(
    private _Coordinacion_PasajerosService: Coordinacion_PasajerosService,
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
    this.dataSource = new Coordinacion_PasajerosDataSource(
      this._Coordinacion_PasajerosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Coordinacion_Pasajeros)
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
    this.listConfig.filter.Numero_de_Vuelo = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Ruta_de_Vuelo = "";
    this.listConfig.filter.Fecha_y_Hora_de_Salida = "";
    this.listConfig.filter.Calificacion = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.Notas_C = "";

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

  remove(row: Coordinacion_Pasajeros) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Coordinacion_PasajerosService
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
  ActionPrint(dataRow: Coordinacion_Pasajeros) {

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
,'Número de Vuelo'
,'Matrícula'
,'Ruta de Vuelo'
,'Fecha y Hora de Salida'
,'Calificación'
,'Observaciones'
,'Notas'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
,x.Matricula_Aeronave.Matricula
,x.Ruta_de_Vuelo
,x.Fecha_y_Hora_de_Salida
,x.Calificacion
,x.Observaciones
,x.Notas_C
		  
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
    pdfMake.createPdf(pdfDefinition).download('Coordinacion_Pasajeros.pdf');
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
          this._Coordinacion_PasajerosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Coordinacion_Pasajeross;
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
          this._Coordinacion_PasajerosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Coordinacion_Pasajeross;
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
        'Número de Vuelo ': fields.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Ruta de Vuelo ': fields.Ruta_de_Vuelo,
        'Fecha y Hora de Salida ': fields.Fecha_y_Hora_de_Salida,
        'Calificación ': fields.Calificacion,
        'Observaciones ': fields.Observaciones,
        'Notas ': fields.Notas_C,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Coordinacion_Pasajeros  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Numero_de_Vuelo: x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Matricula: x.Matricula_Aeronave.Matricula,
      Ruta_de_Vuelo: x.Ruta_de_Vuelo,
      Fecha_y_Hora_de_Salida: x.Fecha_y_Hora_de_Salida,
      Calificacion: x.Calificacion,
      Observaciones: x.Observaciones,
      Notas_C: x.Notas_C,

    }));

    this.excelService.exportToCsv(result, 'Coordinacion_Pasajeros',  ['Folio'    ,'Numero_de_Vuelo'  ,'Matricula'  ,'Ruta_de_Vuelo'  ,'Fecha_y_Hora_de_Salida'  ,'Calificacion'  ,'Observaciones'  ,'Notas_C' ]);
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
    template += '          <th>Número de Vuelo</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Ruta de Vuelo</th>';
    template += '          <th>Fecha y Hora de Salida</th>';
    template += '          <th>Calificación</th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>Notas</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Ruta_de_Vuelo + '</td>';
      template += '          <td>' + element.Fecha_y_Hora_de_Salida + '</td>';
      template += '          <td>' + element.Calificacion + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.Notas_C + '</td>';
		  
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
	template += '\t Número de Vuelo';
	template += '\t Matrícula';
	template += '\t Ruta de Vuelo';
	template += '\t Fecha y Hora de Salida';
	template += '\t Calificación';
	template += '\t Observaciones';
	template += '\t Notas';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
	  template += '\t ' + element.Ruta_de_Vuelo;
	  template += '\t ' + element.Fecha_y_Hora_de_Salida;
	  template += '\t ' + element.Calificacion;
	  template += '\t ' + element.Observaciones;
	  template += '\t ' + element.Notas_C;

	  template += '\n';
    });

    return template;
  }

}

export class Coordinacion_PasajerosDataSource implements DataSource<Coordinacion_Pasajeros>
{
  private subject = new BehaviorSubject<Coordinacion_Pasajeros[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Coordinacion_PasajerosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Coordinacion_Pasajeros[]> {
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
              const longest = result.Coordinacion_Pasajeross.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Coordinacion_Pasajeross);
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
      condition += " and Coordinacion_Pasajeros.Folio = " + data.filter.Folio;
    if (data.filter.Numero_de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Numero_de_Vuelo + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Ruta_de_Vuelo != "")
      condition += " and Coordinacion_Pasajeros.Ruta_de_Vuelo like '%" + data.filter.Ruta_de_Vuelo + "%' ";
    if (data.filter.Fecha_y_Hora_de_Salida != "")
      condition += " and Coordinacion_Pasajeros.Fecha_y_Hora_de_Salida like '%" + data.filter.Fecha_y_Hora_de_Salida + "%' ";
    if (data.filter.Calificacion != "")
      condition += " and Coordinacion_Pasajeros.Calificacion = " + data.filter.Calificacion;
    if (data.filter.Observaciones != "")
      condition += " and Coordinacion_Pasajeros.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.Notas_C != "")
      condition += " and Coordinacion_Pasajeros.Notas_C like '%" + data.filter.Notas_C + "%' ";

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
        sort = " Coordinacion_Pasajeros.Folio " + data.sortDirecction;
        break;
      case "Numero_de_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Ruta_de_Vuelo":
        sort = " Coordinacion_Pasajeros.Ruta_de_Vuelo " + data.sortDirecction;
        break;
      case "Fecha_y_Hora_de_Salida":
        sort = " Coordinacion_Pasajeros.Fecha_y_Hora_de_Salida " + data.sortDirecction;
        break;
      case "Calificacion":
        sort = " Coordinacion_Pasajeros.Calificacion " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Coordinacion_Pasajeros.Observaciones " + data.sortDirecction;
        break;
      case "Notas_C":
        sort = " Coordinacion_Pasajeros.Notas_C " + data.sortDirecction;
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
        condition += " AND Coordinacion_Pasajeros.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Coordinacion_Pasajeros.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Numero_de_Vuelo != 'undefined' && data.filterAdvanced.Numero_de_Vuelo)) {
      switch (data.filterAdvanced.Numero_de_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.Numero_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Numero_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Numero_de_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.Numero_de_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_VueloMultiple != null && data.filterAdvanced.Numero_de_VueloMultiple.length > 0) {
      var Numero_de_Vuelods = data.filterAdvanced.Numero_de_VueloMultiple.join(",");
      condition += " AND Coordinacion_Pasajeros.Numero_de_Vuelo In (" + Numero_de_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Matricula != 'undefined' && data.filterAdvanced.Matricula)) {
      switch (data.filterAdvanced.MatriculaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeronave.Matricula LIKE '" + data.filterAdvanced.Matricula + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Matricula + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Matricula + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeronave.Matricula = '" + data.filterAdvanced.Matricula + "'";
          break;
      }
    } else if (data.filterAdvanced.MatriculaMultiple != null && data.filterAdvanced.MatriculaMultiple.length > 0) {
      var Matriculads = data.filterAdvanced.MatriculaMultiple.join(",");
      condition += " AND Coordinacion_Pasajeros.Matricula In (" + Matriculads + ")";
    }
    switch (data.filterAdvanced.Ruta_de_VueloFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Coordinacion_Pasajeros.Ruta_de_Vuelo LIKE '" + data.filterAdvanced.Ruta_de_Vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Coordinacion_Pasajeros.Ruta_de_Vuelo LIKE '%" + data.filterAdvanced.Ruta_de_Vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Coordinacion_Pasajeros.Ruta_de_Vuelo LIKE '%" + data.filterAdvanced.Ruta_de_Vuelo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Coordinacion_Pasajeros.Ruta_de_Vuelo = '" + data.filterAdvanced.Ruta_de_Vuelo + "'";
        break;
    }
    switch (data.filterAdvanced.Fecha_y_Hora_de_SalidaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Coordinacion_Pasajeros.Fecha_y_Hora_de_Salida LIKE '" + data.filterAdvanced.Fecha_y_Hora_de_Salida + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Coordinacion_Pasajeros.Fecha_y_Hora_de_Salida LIKE '%" + data.filterAdvanced.Fecha_y_Hora_de_Salida + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Coordinacion_Pasajeros.Fecha_y_Hora_de_Salida LIKE '%" + data.filterAdvanced.Fecha_y_Hora_de_Salida + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Coordinacion_Pasajeros.Fecha_y_Hora_de_Salida = '" + data.filterAdvanced.Fecha_y_Hora_de_Salida + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromCalificacion != 'undefined' && data.filterAdvanced.fromCalificacion)
	|| (typeof data.filterAdvanced.toCalificacion != 'undefined' && data.filterAdvanced.toCalificacion)) 
	{
      if (typeof data.filterAdvanced.fromCalificacion != 'undefined' && data.filterAdvanced.fromCalificacion)
        condition += " AND Coordinacion_Pasajeros.Calificacion >= " + data.filterAdvanced.fromCalificacion;

      if (typeof data.filterAdvanced.toCalificacion != 'undefined' && data.filterAdvanced.toCalificacion) 
        condition += " AND Coordinacion_Pasajeros.Calificacion <= " + data.filterAdvanced.toCalificacion;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Coordinacion_Pasajeros.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Coordinacion_Pasajeros.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Coordinacion_Pasajeros.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Coordinacion_Pasajeros.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    switch (data.filterAdvanced.Notas_CFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Coordinacion_Pasajeros.Notas_C LIKE '" + data.filterAdvanced.Notas_C + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Coordinacion_Pasajeros.Notas_C LIKE '%" + data.filterAdvanced.Notas_C + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Coordinacion_Pasajeros.Notas_C LIKE '%" + data.filterAdvanced.Notas_C + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Coordinacion_Pasajeros.Notas_C = '" + data.filterAdvanced.Notas_C + "'";
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
              const longest = result.Coordinacion_Pasajeross.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Coordinacion_Pasajeross);
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
