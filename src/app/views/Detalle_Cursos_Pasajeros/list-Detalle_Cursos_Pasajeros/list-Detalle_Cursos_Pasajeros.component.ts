import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Detalle_Cursos_PasajerosService } from "src/app/api-services/Detalle_Cursos_Pasajeros.service";
import { Detalle_Cursos_Pasajeros } from "src/app/models/Detalle_Cursos_Pasajeros";
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
import { Detalle_Cursos_PasajerosIndexRules } from 'src/app/shared/businessRules/Detalle_Cursos_Pasajeros-index-rules';
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
  selector: "app-list-Detalle_Cursos_Pasajeros",
  templateUrl: "./list-Detalle_Cursos_Pasajeros.component.html",
  styleUrls: ["./list-Detalle_Cursos_Pasajeros.component.scss"],
})
export class ListDetalle_Cursos_PasajerosComponent extends Detalle_Cursos_PasajerosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Curso",
    "Descripcion_del_Curso",
    "Fecha_del_Curso",
    "Vencimiento",
    "Fecha_de_Vencimiento",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Curso",
      "Descripcion_del_Curso",
      "Fecha_del_Curso",
      "Vencimiento",
      "Fecha_de_Vencimiento",
      "Cargar_documento",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Curso_filtro",
      "Descripcion_del_Curso_filtro",
      "Fecha_del_Curso_filtro",
      "Vencimiento_filtro",
      "Fecha_de_Vencimiento_filtro",
      "Cargar_documento_filtro",

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
      Curso: "",
      Descripcion_del_Curso: "",
      Fecha_del_Curso: null,
      Vencimiento: "",
      Fecha_de_Vencimiento: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_del_Curso: "",
      toFecha_del_Curso: "",

    }
  };

  dataSource: Detalle_Cursos_PasajerosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Detalle_Cursos_PasajerosDataSource;
  dataClipboard: any;

  constructor(
    private _Detalle_Cursos_PasajerosService: Detalle_Cursos_PasajerosService,
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
    this.dataSource = new Detalle_Cursos_PasajerosDataSource(
      this._Detalle_Cursos_PasajerosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Detalle_Cursos_Pasajeros)
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
    this.listConfig.filter.Curso = "";
    this.listConfig.filter.Descripcion_del_Curso = "";
    this.listConfig.filter.Fecha_del_Curso = undefined;
    this.listConfig.filter.Vencimiento = undefined;
    this.listConfig.filter.Fecha_de_Vencimiento = undefined;

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

  remove(row: Detalle_Cursos_Pasajeros) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Detalle_Cursos_PasajerosService
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
  ActionPrint(dataRow: Detalle_Cursos_Pasajeros) {

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
,'Curso'
,'Descripción del Curso'
,'Fecha del Curso'
,'Vencimiento'
,'Fecha de Vencimiento'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Curso
,x.Descripcion_del_Curso
,x.Fecha_del_Curso
,x.Vencimiento
,x.Fecha_de_Vencimiento
		  
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
    pdfMake.createPdf(pdfDefinition).download('Detalle_Cursos_Pasajeros.pdf');
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
          this._Detalle_Cursos_PasajerosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Detalle_Cursos_Pasajeross;
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
          this._Detalle_Cursos_PasajerosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Detalle_Cursos_Pasajeross;
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
        'Curso ': fields.Curso,
        'Descripción del Curso ': fields.Descripcion_del_Curso,
        'Fecha del Curso ': fields.Fecha_del_Curso ? momentJS(fields.Fecha_del_Curso).format('DD/MM/YYYY') : '',
        'Vencimiento ': fields.Vencimiento ? 'SI' : 'NO',
        'Fecha_de_Vencimiento ': fields.Fecha_de_Vencimiento ? 'SI' : 'NO',

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Detalle_Cursos_Pasajeros  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Curso: x.Curso,
      Descripcion_del_Curso: x.Descripcion_del_Curso,
      Fecha_del_Curso: x.Fecha_del_Curso,
      Vencimiento: x.Vencimiento,
      Fecha_de_Vencimiento: x.Fecha_de_Vencimiento,

    }));

    this.excelService.exportToCsv(result, 'Detalle_Cursos_Pasajeros',  ['Folio'    ,'Curso'  ,'Descripcion_del_Curso'  ,'Fecha_del_Curso'  ,'Vencimiento'  ,'Fecha_de_Vencimiento' ]);
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
    template += '          <th>Curso</th>';
    template += '          <th>Descripción del Curso</th>';
    template += '          <th>Fecha del Curso</th>';
    template += '          <th>Vencimiento</th>';
    template += '          <th>Fecha de Vencimiento</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Curso + '</td>';
      template += '          <td>' + element.Descripcion_del_Curso + '</td>';
      template += '          <td>' + element.Fecha_del_Curso + '</td>';
      template += '          <td>' + element.Vencimiento + '</td>';
      template += '          <td>' + element.Fecha_de_Vencimiento + '</td>';
		  
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
	template += '\t Curso';
	template += '\t Descripción del Curso';
	template += '\t Fecha del Curso';
	template += '\t Vencimiento';
	template += '\t Fecha de Vencimiento';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Curso;
	  template += '\t ' + element.Descripcion_del_Curso;
	  template += '\t ' + element.Fecha_del_Curso;
	  template += '\t ' + element.Vencimiento;
	  template += '\t ' + element.Fecha_de_Vencimiento;

	  template += '\n';
    });

    return template;
  }

}

export class Detalle_Cursos_PasajerosDataSource implements DataSource<Detalle_Cursos_Pasajeros>
{
  private subject = new BehaviorSubject<Detalle_Cursos_Pasajeros[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Detalle_Cursos_PasajerosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Detalle_Cursos_Pasajeros[]> {
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
          } else if (column != 'acciones'  && column != 'Cargar_documento' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Detalle_Cursos_Pasajeross.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Detalle_Cursos_Pasajeross);
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
      condition += " and Detalle_Cursos_Pasajeros.Folio = " + data.filter.Folio;
    if (data.filter.Curso != "")
      condition += " and Detalle_Cursos_Pasajeros.Curso like '%" + data.filter.Curso + "%' ";
    if (data.filter.Descripcion_del_Curso != "")
      condition += " and Detalle_Cursos_Pasajeros.Descripcion_del_Curso like '%" + data.filter.Descripcion_del_Curso + "%' ";
    if (data.filter.Fecha_del_Curso)
      condition += " and CONVERT(VARCHAR(10), Detalle_Cursos_Pasajeros.Fecha_del_Curso, 102)  = '" + moment(data.filter.Fecha_del_Curso).format("YYYY.MM.DD") + "'";
    if (data.filter.Vencimiento && data.filter.Vencimiento != "2") {
      if (data.filter.Vencimiento == "0" || data.filter.Vencimiento == "") {
        condition += " and (Detalle_Cursos_Pasajeros.Vencimiento = 0 or Detalle_Cursos_Pasajeros.Vencimiento is null)";
      } else {
        condition += " and Detalle_Cursos_Pasajeros.Vencimiento = 1";
      }
    }
    if (data.filter.Fecha_de_Vencimiento && data.filter.Fecha_de_Vencimiento != "2") {
      if (data.filter.Fecha_de_Vencimiento == "0" || data.filter.Fecha_de_Vencimiento == "") {
        condition += " and (Detalle_Cursos_Pasajeros.Fecha_de_Vencimiento = 0 or Detalle_Cursos_Pasajeros.Fecha_de_Vencimiento is null)";
      } else {
        condition += " and Detalle_Cursos_Pasajeros.Fecha_de_Vencimiento = 1";
      }
    }

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
        sort = " Detalle_Cursos_Pasajeros.Folio " + data.sortDirecction;
        break;
      case "Curso":
        sort = " Detalle_Cursos_Pasajeros.Curso " + data.sortDirecction;
        break;
      case "Descripcion_del_Curso":
        sort = " Detalle_Cursos_Pasajeros.Descripcion_del_Curso " + data.sortDirecction;
        break;
      case "Fecha_del_Curso":
        sort = " Detalle_Cursos_Pasajeros.Fecha_del_Curso " + data.sortDirecction;
        break;
      case "Vencimiento":
        sort = " Detalle_Cursos_Pasajeros.Vencimiento " + data.sortDirecction;
        break;
      case "Fecha_de_Vencimiento":
        sort = " Detalle_Cursos_Pasajeros.Fecha_de_Vencimiento " + data.sortDirecction;
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
        condition += " AND Detalle_Cursos_Pasajeros.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Detalle_Cursos_Pasajeros.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.CursoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_Cursos_Pasajeros.Curso LIKE '" + data.filterAdvanced.Curso + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_Cursos_Pasajeros.Curso LIKE '%" + data.filterAdvanced.Curso + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_Cursos_Pasajeros.Curso LIKE '%" + data.filterAdvanced.Curso + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_Cursos_Pasajeros.Curso = '" + data.filterAdvanced.Curso + "'";
        break;
    }
    switch (data.filterAdvanced.Descripcion_del_CursoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_Cursos_Pasajeros.Descripcion_del_Curso LIKE '" + data.filterAdvanced.Descripcion_del_Curso + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_Cursos_Pasajeros.Descripcion_del_Curso LIKE '%" + data.filterAdvanced.Descripcion_del_Curso + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_Cursos_Pasajeros.Descripcion_del_Curso LIKE '%" + data.filterAdvanced.Descripcion_del_Curso + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_Cursos_Pasajeros.Descripcion_del_Curso = '" + data.filterAdvanced.Descripcion_del_Curso + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_del_Curso != 'undefined' && data.filterAdvanced.fromFecha_del_Curso)
	|| (typeof data.filterAdvanced.toFecha_del_Curso != 'undefined' && data.filterAdvanced.toFecha_del_Curso)) 
	{
      if (typeof data.filterAdvanced.fromFecha_del_Curso != 'undefined' && data.filterAdvanced.fromFecha_del_Curso) 
        condition += " and CONVERT(VARCHAR(10), Detalle_Cursos_Pasajeros.Fecha_del_Curso, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_del_Curso).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_del_Curso != 'undefined' && data.filterAdvanced.toFecha_del_Curso) 
        condition += " and CONVERT(VARCHAR(10), Detalle_Cursos_Pasajeros.Fecha_del_Curso, 102)  <= '" + moment(data.filterAdvanced.toFecha_del_Curso).format("YYYY.MM.DD") + "'";
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
          } else if (column != 'acciones'  && column != 'Cargar_documento' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Detalle_Cursos_Pasajeross.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Detalle_Cursos_Pasajeross);
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
