import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Solicitud_de_cotizacionService } from "src/app/api-services/Solicitud_de_cotizacion.service";
import { Solicitud_de_cotizacion } from "src/app/models/Solicitud_de_cotizacion";
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
import { Solicitud_de_cotizacionIndexRules } from 'src/app/shared/businessRules/Solicitud_de_cotizacion-index-rules';
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
  selector: "app-list-Solicitud_de_cotizacion",
  templateUrl: "./list-Solicitud_de_cotizacion.component.html",
  styleUrls: ["./list-Solicitud_de_cotizacion.component.scss"],
})
export class ListSolicitud_de_cotizacionComponent extends Solicitud_de_cotizacionIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Usuario_que_Registra",
    "Fecha_de_Registro",
    "Hora_de_Registro",
    "Mensaje_de_correo",
    "Comentarios_Adicionales",
    "Folio_Solicitud_de_Cotizacion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Usuario_que_Registra",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Mensaje_de_correo",
      "Comentarios_Adicionales",
      "Folio_Solicitud_de_Cotizacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Usuario_que_Registra_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Mensaje_de_correo_filtro",
      "Comentarios_Adicionales_filtro",
      "Folio_Solicitud_de_Cotizacion_filtro",

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
      Usuario_que_Registra: "",
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Mensaje_de_correo: "",
      Comentarios_Adicionales: "",
      Folio_Solicitud_de_Cotizacion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",

    }
  };

  dataSource: Solicitud_de_cotizacionDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Solicitud_de_cotizacionDataSource;
  dataClipboard: any;

  constructor(
    private _Solicitud_de_cotizacionService: Solicitud_de_cotizacionService,
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
    this.dataSource = new Solicitud_de_cotizacionDataSource(
      this._Solicitud_de_cotizacionService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_cotizacion)
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
    this.listConfig.filter.Usuario_que_Registra = "";
    this.listConfig.filter.Fecha_de_Registro = undefined;
    this.listConfig.filter.Hora_de_Registro = "";
    this.listConfig.filter.Mensaje_de_correo = "";
    this.listConfig.filter.Comentarios_Adicionales = "";
    this.listConfig.filter.Folio_Solicitud_de_Cotizacion = "";

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

  remove(row: Solicitud_de_cotizacion) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Solicitud_de_cotizacionService
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
  ActionPrint(dataRow: Solicitud_de_cotizacion) {

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
,'Usuario que Registra'
,'Fecha de Registro'
,'Hora de Registro'
,'Redacción de Correo'
,'Comentarios Adicionales'
,'Folio Solicitud de Cotizacion'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Usuario_que_Registra_Spartan_User.Name
,x.Fecha_de_Registro
,x.Hora_de_Registro
,x.Mensaje_de_correo
,x.Comentarios_Adicionales
,x.Folio_Solicitud_de_Cotizacion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Solicitud_de_cotizacion.pdf');
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
          this._Solicitud_de_cotizacionService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_cotizacions;
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
          this._Solicitud_de_cotizacionService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_cotizacions;
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
        'Usuario que Registra ': fields.Usuario_que_Registra_Spartan_User.Name,
        'Fecha de Registro ': fields.Fecha_de_Registro ? momentJS(fields.Fecha_de_Registro).format('DD/MM/YYYY') : '',
        'Hora de Registro ': fields.Hora_de_Registro,
        'Redacción de Correo ': fields.Mensaje_de_correo,
        'Comentarios Adicionales ': fields.Comentarios_Adicionales,
        'Folio Solicitud de Cotizacion ': fields.Folio_Solicitud_de_Cotizacion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Solicitud_de_cotizacion  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Usuario_que_Registra: x.Usuario_que_Registra_Spartan_User.Name,
      Fecha_de_Registro: x.Fecha_de_Registro,
      Hora_de_Registro: x.Hora_de_Registro,
      Mensaje_de_correo: x.Mensaje_de_correo,
      Comentarios_Adicionales: x.Comentarios_Adicionales,
      Folio_Solicitud_de_Cotizacion: x.Folio_Solicitud_de_Cotizacion,

    }));

    this.excelService.exportToCsv(result, 'Solicitud_de_cotizacion',  ['Folio'    ,'Usuario_que_Registra'  ,'Fecha_de_Registro'  ,'Hora_de_Registro'  ,'Mensaje_de_correo'  ,'Comentarios_Adicionales'  ,'Folio_Solicitud_de_Cotizacion' ]);
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
    template += '          <th>Usuario que Registra</th>';
    template += '          <th>Fecha de Registro</th>';
    template += '          <th>Hora de Registro</th>';
    template += '          <th>Redacción de Correo</th>';
    template += '          <th>Comentarios Adicionales</th>';
    template += '          <th>Folio Solicitud de Cotizacion</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Usuario_que_Registra_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Fecha_de_Registro + '</td>';
      template += '          <td>' + element.Hora_de_Registro + '</td>';
      template += '          <td>' + element.Mensaje_de_correo + '</td>';
      template += '          <td>' + element.Comentarios_Adicionales + '</td>';
      template += '          <td>' + element.Folio_Solicitud_de_Cotizacion + '</td>';
		  
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
	template += '\t Usuario que Registra';
	template += '\t Fecha de Registro';
	template += '\t Hora de Registro';
	template += '\t Redacción de Correo';
	template += '\t Comentarios Adicionales';
	template += '\t Folio Solicitud de Cotizacion';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Usuario_que_Registra_Spartan_User.Name;
	  template += '\t ' + element.Fecha_de_Registro;
	  template += '\t ' + element.Hora_de_Registro;
	  template += '\t ' + element.Mensaje_de_correo;
	  template += '\t ' + element.Comentarios_Adicionales;
	  template += '\t ' + element.Folio_Solicitud_de_Cotizacion;

	  template += '\n';
    });

    return template;
  }

}

export class Solicitud_de_cotizacionDataSource implements DataSource<Solicitud_de_cotizacion>
{
  private subject = new BehaviorSubject<Solicitud_de_cotizacion[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Solicitud_de_cotizacionService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Solicitud_de_cotizacion[]> {
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
              const longest = result.Solicitud_de_cotizacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_cotizacions);
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
      condition += " and Solicitud_de_cotizacion.Folio = " + data.filter.Folio;
    if (data.filter.Usuario_que_Registra != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra + "%' ";
    if (data.filter.Fecha_de_Registro)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_cotizacion.Fecha_de_Registro, 102)  = '" + moment(data.filter.Fecha_de_Registro).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Registro != "")
      condition += " and Solicitud_de_cotizacion.Hora_de_Registro = '" + data.filter.Hora_de_Registro + "'";
    if (data.filter.Mensaje_de_correo != "")
      condition += " and Solicitud_de_cotizacion.Mensaje_de_correo like '%" + data.filter.Mensaje_de_correo + "%' ";
    if (data.filter.Comentarios_Adicionales != "")
      condition += " and Solicitud_de_cotizacion.Comentarios_Adicionales like '%" + data.filter.Comentarios_Adicionales + "%' ";
    if (data.filter.Folio_Solicitud_de_Cotizacion != "")
      condition += " and Solicitud_de_cotizacion.Folio_Solicitud_de_Cotizacion like '%" + data.filter.Folio_Solicitud_de_Cotizacion + "%' ";

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
        sort = " Solicitud_de_cotizacion.Folio " + data.sortDirecction;
        break;
      case "Usuario_que_Registra":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Fecha_de_Registro":
        sort = " Solicitud_de_cotizacion.Fecha_de_Registro " + data.sortDirecction;
        break;
      case "Hora_de_Registro":
        sort = " Solicitud_de_cotizacion.Hora_de_Registro " + data.sortDirecction;
        break;
      case "Mensaje_de_correo":
        sort = " Solicitud_de_cotizacion.Mensaje_de_correo " + data.sortDirecction;
        break;
      case "Comentarios_Adicionales":
        sort = " Solicitud_de_cotizacion.Comentarios_Adicionales " + data.sortDirecction;
        break;
      case "Folio_Solicitud_de_Cotizacion":
        sort = " Solicitud_de_cotizacion.Folio_Solicitud_de_Cotizacion " + data.sortDirecction;
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
        condition += " AND Solicitud_de_cotizacion.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Solicitud_de_cotizacion.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Usuario_que_Registra != 'undefined' && data.filterAdvanced.Usuario_que_Registra)) {
      switch (data.filterAdvanced.Usuario_que_RegistraFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_que_Registra + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Registra + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Registra + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_que_Registra + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_RegistraMultiple != null && data.filterAdvanced.Usuario_que_RegistraMultiple.length > 0) {
      var Usuario_que_Registrads = data.filterAdvanced.Usuario_que_RegistraMultiple.join(",");
      condition += " AND Solicitud_de_cotizacion.Usuario_que_Registra In (" + Usuario_que_Registrads + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
	|| (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro) 
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_cotizacion.Fecha_de_Registro, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Registro).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro) 
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_cotizacion.Fecha_de_Registro, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Registro).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
	|| (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)) 
	{
		if (typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro) 
			condition += " and Solicitud_de_cotizacion.Hora_de_Registro >= '" + data.filterAdvanced.fromHora_de_Registro + "'";
      
		if (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro) 
			condition += " and Solicitud_de_cotizacion.Hora_de_Registro <= '" + data.filterAdvanced.toHora_de_Registro + "'";
    }
    switch (data.filterAdvanced.Mensaje_de_correoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_cotizacion.Mensaje_de_correo LIKE '" + data.filterAdvanced.Mensaje_de_correo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_cotizacion.Mensaje_de_correo LIKE '%" + data.filterAdvanced.Mensaje_de_correo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_cotizacion.Mensaje_de_correo LIKE '%" + data.filterAdvanced.Mensaje_de_correo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_cotizacion.Mensaje_de_correo = '" + data.filterAdvanced.Mensaje_de_correo + "'";
        break;
    }
    switch (data.filterAdvanced.Comentarios_AdicionalesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_cotizacion.Comentarios_Adicionales LIKE '" + data.filterAdvanced.Comentarios_Adicionales + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_cotizacion.Comentarios_Adicionales LIKE '%" + data.filterAdvanced.Comentarios_Adicionales + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_cotizacion.Comentarios_Adicionales LIKE '%" + data.filterAdvanced.Comentarios_Adicionales + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_cotizacion.Comentarios_Adicionales = '" + data.filterAdvanced.Comentarios_Adicionales + "'";
        break;
    }
    switch (data.filterAdvanced.Folio_Solicitud_de_CotizacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_cotizacion.Folio_Solicitud_de_Cotizacion LIKE '" + data.filterAdvanced.Folio_Solicitud_de_Cotizacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_cotizacion.Folio_Solicitud_de_Cotizacion LIKE '%" + data.filterAdvanced.Folio_Solicitud_de_Cotizacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_cotizacion.Folio_Solicitud_de_Cotizacion LIKE '%" + data.filterAdvanced.Folio_Solicitud_de_Cotizacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_cotizacion.Folio_Solicitud_de_Cotizacion = '" + data.filterAdvanced.Folio_Solicitud_de_Cotizacion + "'";
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
              const longest = result.Solicitud_de_cotizacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_cotizacions);
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
