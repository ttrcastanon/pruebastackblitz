import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Notificaciones_PushService } from "src/app/api-services/Notificaciones_Push.service";
import { Notificaciones_Push } from "src/app/models/Notificaciones_Push";
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
import { Notificaciones_PushIndexRules } from 'src/app/shared/businessRules/Notificaciones_Push-index-rules';
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
  selector: "app-list-Notificaciones_Push",
  templateUrl: "./list-Notificaciones_Push.component.html",
  styleUrls: ["./list-Notificaciones_Push.component.scss"],
})
export class ListNotificaciones_PushComponent extends Notificaciones_PushIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Fecha",
    "Hora",
    "Destinatario",
    "Parametros_Adicionales",
    "Notificacion",
    "Leida",
    "Titulo",
    "Tipo",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha",
      "Hora",
      "Destinatario",
      "Parametros_Adicionales",
      "Notificacion",
      "Leida",
      "Titulo",
      "Tipo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_filtro",
      "Hora_filtro",
      "Destinatario_filtro",
      "Parametros_Adicionales_filtro",
      "Notificacion_filtro",
      "Leida_filtro",
      "Titulo_filtro",
      "Tipo_filtro",

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
      Fecha: null,
      Hora: "",
      Destinatario: "",
      Parametros_Adicionales: "",
      Notificacion: "",
      Leida: "",
      Titulo: "",
      Tipo: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha: "",
      toFecha: "",
      fromHora: "",
      toHora: "",
      DestinatarioFilter: "",
      Destinatario: "",
      DestinatarioMultiple: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",

    }
  };

  dataSource: Notificaciones_PushDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Notificaciones_PushDataSource;
  dataClipboard: any;

  constructor(
    private _Notificaciones_PushService: Notificaciones_PushService,
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
    this.dataSource = new Notificaciones_PushDataSource(
      this._Notificaciones_PushService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Notificaciones_Push)
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
    this.listConfig.filter.Fecha = undefined;
    this.listConfig.filter.Hora = "";
    this.listConfig.filter.Destinatario = "";
    this.listConfig.filter.Parametros_Adicionales = "";
    this.listConfig.filter.Notificacion = "";
    this.listConfig.filter.Leida = undefined;
    this.listConfig.filter.Titulo = "";
    this.listConfig.filter.Tipo = "";

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

  remove(row: Notificaciones_Push) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Notificaciones_PushService
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
  ActionPrint(dataRow: Notificaciones_Push) {

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
,'Fecha'
,'Hora'
,'Destinatario'
,'Parámetros Adicionales'
,'Notificación'
,'Leída'
,'Titulo'
,'Tipo'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Fecha
,x.Hora
,x.Destinatario_Spartan_User.Name
,x.Parametros_Adicionales
,x.Notificacion
,x.Leida
,x.Titulo
,x.Tipo_Tipo_de_Notificacion_Push.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Notificaciones_Push.pdf');
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
          this._Notificaciones_PushService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Notificaciones_Pushs;
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
          this._Notificaciones_PushService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Notificaciones_Pushs;
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
        'Fecha ': fields.Fecha ? momentJS(fields.Fecha).format('DD/MM/YYYY') : '',
        'Hora ': fields.Hora,
        'Destinatario ': fields.Destinatario_Spartan_User.Name,
        'Parámetros Adicionales ': fields.Parametros_Adicionales,
        'Notificación ': fields.Notificacion,
        'Leida ': fields.Leida ? 'SI' : 'NO',
        'Titulo ': fields.Titulo,
        'Tipo ': fields.Tipo_Tipo_de_Notificacion_Push.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Notificaciones_Push  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Fecha: x.Fecha,
      Hora: x.Hora,
      Destinatario: x.Destinatario_Spartan_User.Name,
      Parametros_Adicionales: x.Parametros_Adicionales,
      Notificacion: x.Notificacion,
      Leida: x.Leida,
      Titulo: x.Titulo,
      Tipo: x.Tipo_Tipo_de_Notificacion_Push.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Notificaciones_Push',  ['Folio'    ,'Fecha'  ,'Hora'  ,'Destinatario'  ,'Parametros_Adicionales'  ,'Notificacion'  ,'Leida'  ,'Titulo'  ,'Tipo' ]);
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
    template += '          <th>Fecha</th>';
    template += '          <th>Hora</th>';
    template += '          <th>Destinatario</th>';
    template += '          <th>Parámetros Adicionales</th>';
    template += '          <th>Notificación</th>';
    template += '          <th>Leída</th>';
    template += '          <th>Titulo</th>';
    template += '          <th>Tipo</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Fecha + '</td>';
      template += '          <td>' + element.Hora + '</td>';
      template += '          <td>' + element.Destinatario_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Parametros_Adicionales + '</td>';
      template += '          <td>' + element.Notificacion + '</td>';
      template += '          <td>' + element.Leida + '</td>';
      template += '          <td>' + element.Titulo + '</td>';
      template += '          <td>' + element.Tipo_Tipo_de_Notificacion_Push.Descripcion + '</td>';
		  
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
	template += '\t Fecha';
	template += '\t Hora';
	template += '\t Destinatario';
	template += '\t Parámetros Adicionales';
	template += '\t Notificación';
	template += '\t Leída';
	template += '\t Titulo';
	template += '\t Tipo';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Fecha;
	  template += '\t ' + element.Hora;
      template += '\t ' + element.Destinatario_Spartan_User.Name;
	  template += '\t ' + element.Parametros_Adicionales;
	  template += '\t ' + element.Notificacion;
	  template += '\t ' + element.Leida;
	  template += '\t ' + element.Titulo;
      template += '\t ' + element.Tipo_Tipo_de_Notificacion_Push.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Notificaciones_PushDataSource implements DataSource<Notificaciones_Push>
{
  private subject = new BehaviorSubject<Notificaciones_Push[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Notificaciones_PushService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Notificaciones_Push[]> {
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
              const longest = result.Notificaciones_Pushs.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Notificaciones_Pushs);
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
      condition += " and Notificaciones_Push.Folio = " + data.filter.Folio;
    if (data.filter.Fecha)
      condition += " and CONVERT(VARCHAR(10), Notificaciones_Push.Fecha, 102)  = '" + moment(data.filter.Fecha).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora != "")
      condition += " and Notificaciones_Push.Hora = '" + data.filter.Hora + "'";
    if (data.filter.Destinatario != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Destinatario + "%' ";
    if (data.filter.Parametros_Adicionales != "")
      condition += " and Notificaciones_Push.Parametros_Adicionales like '%" + data.filter.Parametros_Adicionales + "%' ";
    if (data.filter.Notificacion != "")
      condition += " and Notificaciones_Push.Notificacion like '%" + data.filter.Notificacion + "%' ";
    if (data.filter.Leida && data.filter.Leida != "2") {
      if (data.filter.Leida == "0" || data.filter.Leida == "") {
        condition += " and (Notificaciones_Push.Leida = 0 or Notificaciones_Push.Leida is null)";
      } else {
        condition += " and Notificaciones_Push.Leida = 1";
      }
    }
    if (data.filter.Titulo != "")
      condition += " and Notificaciones_Push.Titulo like '%" + data.filter.Titulo + "%' ";
    if (data.filter.Tipo != "")
      condition += " and Tipo_de_Notificacion_Push.Descripcion like '%" + data.filter.Tipo + "%' ";

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
        sort = " Notificaciones_Push.Folio " + data.sortDirecction;
        break;
      case "Fecha":
        sort = " Notificaciones_Push.Fecha " + data.sortDirecction;
        break;
      case "Hora":
        sort = " Notificaciones_Push.Hora " + data.sortDirecction;
        break;
      case "Destinatario":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Parametros_Adicionales":
        sort = " Notificaciones_Push.Parametros_Adicionales " + data.sortDirecction;
        break;
      case "Notificacion":
        sort = " Notificaciones_Push.Notificacion " + data.sortDirecction;
        break;
      case "Leida":
        sort = " Notificaciones_Push.Leida " + data.sortDirecction;
        break;
      case "Titulo":
        sort = " Notificaciones_Push.Titulo " + data.sortDirecction;
        break;
      case "Tipo":
        sort = " Tipo_de_Notificacion_Push.Descripcion " + data.sortDirecction;
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
        condition += " AND Notificaciones_Push.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Notificaciones_Push.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
	|| (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)) 
	{
      if (typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha) 
        condition += " and CONVERT(VARCHAR(10), Notificaciones_Push.Fecha, 102)  >= '" +  moment(data.filterAdvanced.fromFecha).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha) 
        condition += " and CONVERT(VARCHAR(10), Notificaciones_Push.Fecha, 102)  <= '" + moment(data.filterAdvanced.toFecha).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora != 'undefined' && data.filterAdvanced.fromHora)
	|| (typeof data.filterAdvanced.toHora != 'undefined' && data.filterAdvanced.toHora)) 
	{
		if (typeof data.filterAdvanced.fromHora != 'undefined' && data.filterAdvanced.fromHora) 
			condition += " and Notificaciones_Push.Hora >= '" + data.filterAdvanced.fromHora + "'";
      
		if (typeof data.filterAdvanced.toHora != 'undefined' && data.filterAdvanced.toHora) 
			condition += " and Notificaciones_Push.Hora <= '" + data.filterAdvanced.toHora + "'";
    }
    if ((typeof data.filterAdvanced.Destinatario != 'undefined' && data.filterAdvanced.Destinatario)) {
      switch (data.filterAdvanced.DestinatarioFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Destinatario + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Destinatario + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Destinatario + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Destinatario + "'";
          break;
      }
    } else if (data.filterAdvanced.DestinatarioMultiple != null && data.filterAdvanced.DestinatarioMultiple.length > 0) {
      var Destinatariods = data.filterAdvanced.DestinatarioMultiple.join(",");
      condition += " AND Notificaciones_Push.Destinatario In (" + Destinatariods + ")";
    }
    switch (data.filterAdvanced.Parametros_AdicionalesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Notificaciones_Push.Parametros_Adicionales LIKE '" + data.filterAdvanced.Parametros_Adicionales + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Notificaciones_Push.Parametros_Adicionales LIKE '%" + data.filterAdvanced.Parametros_Adicionales + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Notificaciones_Push.Parametros_Adicionales LIKE '%" + data.filterAdvanced.Parametros_Adicionales + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Notificaciones_Push.Parametros_Adicionales = '" + data.filterAdvanced.Parametros_Adicionales + "'";
        break;
    }
    switch (data.filterAdvanced.NotificacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Notificaciones_Push.Notificacion LIKE '" + data.filterAdvanced.Notificacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Notificaciones_Push.Notificacion LIKE '%" + data.filterAdvanced.Notificacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Notificaciones_Push.Notificacion LIKE '%" + data.filterAdvanced.Notificacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Notificaciones_Push.Notificacion = '" + data.filterAdvanced.Notificacion + "'";
        break;
    }
    switch (data.filterAdvanced.TituloFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Notificaciones_Push.Titulo LIKE '" + data.filterAdvanced.Titulo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Notificaciones_Push.Titulo LIKE '%" + data.filterAdvanced.Titulo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Notificaciones_Push.Titulo LIKE '%" + data.filterAdvanced.Titulo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Notificaciones_Push.Titulo = '" + data.filterAdvanced.Titulo + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Tipo != 'undefined' && data.filterAdvanced.Tipo)) {
      switch (data.filterAdvanced.TipoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Notificacion_Push.Descripcion LIKE '" + data.filterAdvanced.Tipo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Notificacion_Push.Descripcion LIKE '%" + data.filterAdvanced.Tipo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Notificacion_Push.Descripcion LIKE '%" + data.filterAdvanced.Tipo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Notificacion_Push.Descripcion = '" + data.filterAdvanced.Tipo + "'";
          break;
      }
    } else if (data.filterAdvanced.TipoMultiple != null && data.filterAdvanced.TipoMultiple.length > 0) {
      var Tipods = data.filterAdvanced.TipoMultiple.join(",");
      condition += " AND Notificaciones_Push.Tipo In (" + Tipods + ")";
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
              const longest = result.Notificaciones_Pushs.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Notificaciones_Pushs);
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
