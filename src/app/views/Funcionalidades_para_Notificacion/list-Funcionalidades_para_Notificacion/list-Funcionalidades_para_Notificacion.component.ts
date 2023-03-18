import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Funcionalidades_para_NotificacionService } from "src/app/api-services/Funcionalidades_para_Notificacion.service";
import { Funcionalidades_para_Notificacion } from "src/app/models/Funcionalidades_para_Notificacion";
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
import { Funcionalidades_para_NotificacionIndexRules } from 'src/app/shared/businessRules/Funcionalidades_para_Notificacion-index-rules';
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
  selector: "app-list-Funcionalidades_para_Notificacion",
  templateUrl: "./list-Funcionalidades_para_Notificacion.component.html",
  styleUrls: ["./list-Funcionalidades_para_Notificacion.component.scss"],
})
export class ListFuncionalidades_para_NotificacionComponent extends Funcionalidades_para_NotificacionIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Funcionalidad",
    "Nombre_de_la_Tabla",
    "Campos_de_Estatus",
    "Validacion_Obligatoria",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Funcionalidad",
      "Nombre_de_la_Tabla",
      "Campos_de_Estatus",
      "Validacion_Obligatoria",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Funcionalidad_filtro",
      "Nombre_de_la_Tabla_filtro",
      "Campos_de_Estatus_filtro",
      "Validacion_Obligatoria_filtro",

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
      Funcionalidad: "",
      Nombre_de_la_Tabla: "",
      Campos_de_Estatus: "",
      Validacion_Obligatoria: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Campos_de_EstatusFilter: "",
      Campos_de_Estatus: "",
      Campos_de_EstatusMultiple: "",

    }
  };

  dataSource: Funcionalidades_para_NotificacionDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Funcionalidades_para_NotificacionDataSource;
  dataClipboard: any;

  constructor(
    private _Funcionalidades_para_NotificacionService: Funcionalidades_para_NotificacionService,
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
    this.dataSource = new Funcionalidades_para_NotificacionDataSource(
      this._Funcionalidades_para_NotificacionService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Funcionalidades_para_Notificacion)
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
    this.listConfig.filter.Funcionalidad = "";
    this.listConfig.filter.Nombre_de_la_Tabla = "";
    this.listConfig.filter.Campos_de_Estatus = "";
    this.listConfig.filter.Validacion_Obligatoria = "";

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

  remove(row: Funcionalidades_para_Notificacion) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Funcionalidades_para_NotificacionService
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
  ActionPrint(dataRow: Funcionalidades_para_Notificacion) {

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
,'Funcionalidad'
,'Nombre de la Tabla'
,'Campos de Estatus'
,'Validación Obligatoria'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Funcionalidad
,x.Nombre_de_la_Tabla
,x.Campos_de_Estatus_Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus
,x.Validacion_Obligatoria
		  
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
    pdfMake.createPdf(pdfDefinition).download('Funcionalidades_para_Notificacion.pdf');
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
          this._Funcionalidades_para_NotificacionService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Funcionalidades_para_Notificacions;
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
          this._Funcionalidades_para_NotificacionService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Funcionalidades_para_Notificacions;
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
        'Funcionalidad ': fields.Funcionalidad,
        'Nombre de la Tabla ': fields.Nombre_de_la_Tabla,
        'Campos de Estatus ': fields.Campos_de_Estatus_Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus,
        'Validación Obligatoria ': fields.Validacion_Obligatoria,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Funcionalidades_para_Notificacion  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Funcionalidad: x.Funcionalidad,
      Nombre_de_la_Tabla: x.Nombre_de_la_Tabla,
      Campos_de_Estatus: x.Campos_de_Estatus_Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus,
      Validacion_Obligatoria: x.Validacion_Obligatoria,

    }));

    this.excelService.exportToCsv(result, 'Funcionalidades_para_Notificacion',  ['Folio'    ,'Funcionalidad'  ,'Nombre_de_la_Tabla'  ,'Campos_de_Estatus'  ,'Validacion_Obligatoria' ]);
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
    template += '          <th>Funcionalidad</th>';
    template += '          <th>Nombre de la Tabla</th>';
    template += '          <th>Campos de Estatus</th>';
    template += '          <th>Validación Obligatoria</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Funcionalidad + '</td>';
      template += '          <td>' + element.Nombre_de_la_Tabla + '</td>';
      template += '          <td>' + element.Campos_de_Estatus_Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus + '</td>';
      template += '          <td>' + element.Validacion_Obligatoria + '</td>';
		  
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
	template += '\t Funcionalidad';
	template += '\t Nombre de la Tabla';
	template += '\t Campos de Estatus';
	template += '\t Validación Obligatoria';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Funcionalidad;
	  template += '\t ' + element.Nombre_de_la_Tabla;
      template += '\t ' + element.Campos_de_Estatus_Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus;
	  template += '\t ' + element.Validacion_Obligatoria;

	  template += '\n';
    });

    return template;
  }

}

export class Funcionalidades_para_NotificacionDataSource implements DataSource<Funcionalidades_para_Notificacion>
{
  private subject = new BehaviorSubject<Funcionalidades_para_Notificacion[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Funcionalidades_para_NotificacionService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Funcionalidades_para_Notificacion[]> {
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
              const longest = result.Funcionalidades_para_Notificacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Funcionalidades_para_Notificacions);
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
      condition += " and Funcionalidades_para_Notificacion.Folio = " + data.filter.Folio;
    if (data.filter.Funcionalidad != "")
      condition += " and Funcionalidades_para_Notificacion.Funcionalidad like '%" + data.filter.Funcionalidad + "%' ";
    if (data.filter.Nombre_de_la_Tabla != "")
      condition += " and Funcionalidades_para_Notificacion.Nombre_de_la_Tabla like '%" + data.filter.Nombre_de_la_Tabla + "%' ";
    if (data.filter.Campos_de_Estatus != "")
      condition += " and Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus like '%" + data.filter.Campos_de_Estatus + "%' ";
    if (data.filter.Validacion_Obligatoria != "")
      condition += " and Funcionalidades_para_Notificacion.Validacion_Obligatoria like '%" + data.filter.Validacion_Obligatoria + "%' ";

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
        sort = " Funcionalidades_para_Notificacion.Folio " + data.sortDirecction;
        break;
      case "Funcionalidad":
        sort = " Funcionalidades_para_Notificacion.Funcionalidad " + data.sortDirecction;
        break;
      case "Nombre_de_la_Tabla":
        sort = " Funcionalidades_para_Notificacion.Nombre_de_la_Tabla " + data.sortDirecction;
        break;
      case "Campos_de_Estatus":
        sort = " Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus " + data.sortDirecction;
        break;
      case "Validacion_Obligatoria":
        sort = " Funcionalidades_para_Notificacion.Validacion_Obligatoria " + data.sortDirecction;
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
        condition += " AND Funcionalidades_para_Notificacion.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Funcionalidades_para_Notificacion.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.FuncionalidadFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Funcionalidades_para_Notificacion.Funcionalidad LIKE '" + data.filterAdvanced.Funcionalidad + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Funcionalidades_para_Notificacion.Funcionalidad LIKE '%" + data.filterAdvanced.Funcionalidad + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Funcionalidades_para_Notificacion.Funcionalidad LIKE '%" + data.filterAdvanced.Funcionalidad + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Funcionalidades_para_Notificacion.Funcionalidad = '" + data.filterAdvanced.Funcionalidad + "'";
        break;
    }
    switch (data.filterAdvanced.Nombre_de_la_TablaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Funcionalidades_para_Notificacion.Nombre_de_la_Tabla LIKE '" + data.filterAdvanced.Nombre_de_la_Tabla + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Funcionalidades_para_Notificacion.Nombre_de_la_Tabla LIKE '%" + data.filterAdvanced.Nombre_de_la_Tabla + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Funcionalidades_para_Notificacion.Nombre_de_la_Tabla LIKE '%" + data.filterAdvanced.Nombre_de_la_Tabla + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Funcionalidades_para_Notificacion.Nombre_de_la_Tabla = '" + data.filterAdvanced.Nombre_de_la_Tabla + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Campos_de_Estatus != 'undefined' && data.filterAdvanced.Campos_de_Estatus)) {
      switch (data.filterAdvanced.Campos_de_EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus LIKE '" + data.filterAdvanced.Campos_de_Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus LIKE '%" + data.filterAdvanced.Campos_de_Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus LIKE '%" + data.filterAdvanced.Campos_de_Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Funcionalidad_para_Notificacion.Campo_para_Estatus = '" + data.filterAdvanced.Campos_de_Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.Campos_de_EstatusMultiple != null && data.filterAdvanced.Campos_de_EstatusMultiple.length > 0) {
      var Campos_de_Estatusds = data.filterAdvanced.Campos_de_EstatusMultiple.join(",");
      condition += " AND Funcionalidades_para_Notificacion.Campos_de_Estatus In (" + Campos_de_Estatusds + ")";
    }
    switch (data.filterAdvanced.Validacion_ObligatoriaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Funcionalidades_para_Notificacion.Validacion_Obligatoria LIKE '" + data.filterAdvanced.Validacion_Obligatoria + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Funcionalidades_para_Notificacion.Validacion_Obligatoria LIKE '%" + data.filterAdvanced.Validacion_Obligatoria + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Funcionalidades_para_Notificacion.Validacion_Obligatoria LIKE '%" + data.filterAdvanced.Validacion_Obligatoria + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Funcionalidades_para_Notificacion.Validacion_Obligatoria = '" + data.filterAdvanced.Validacion_Obligatoria + "'";
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
              const longest = result.Funcionalidades_para_Notificacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Funcionalidades_para_Notificacions);
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
