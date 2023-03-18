import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Notificaciones_de_mantenimientoService } from "src/app/api-services/Notificaciones_de_mantenimiento.service";
import { Notificaciones_de_mantenimiento } from "src/app/models/Notificaciones_de_mantenimiento";
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
import { Notificaciones_de_mantenimientoIndexRules } from 'src/app/shared/businessRules/Notificaciones_de_mantenimiento-index-rules';
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
  selector: "app-list-Notificaciones_de_mantenimiento",
  templateUrl: "./list-Notificaciones_de_mantenimiento.component.html",
  styleUrls: ["./list-Notificaciones_de_mantenimiento.component.scss"],
})
export class ListNotificaciones_de_mantenimientoComponent extends Notificaciones_de_mantenimientoIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Codigo_computarizado",
    "Modelo",
    "Propietario",
    "Matricula",
    "ATA",
    "No__Bitacora",
    "Fecha_de_mantenimiento",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Codigo_computarizado",
      "Modelo",
      "Propietario",
      "Matricula",
      "ATA",
      "No__Bitacora",
      "Fecha_de_mantenimiento",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_computarizado_filtro",
      "Modelo_filtro",
      "Propietario_filtro",
      "Matricula_filtro",
      "ATA_filtro",
      "No__Bitacora_filtro",
      "Fecha_de_mantenimiento_filtro",

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
      Codigo_computarizado: "",
      Modelo: "",
      Propietario: "",
      Matricula: "",
      ATA: "",
      No__Bitacora: "",
      Fecha_de_mantenimiento: null,
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Codigo_computarizadoFilter: "",
      Codigo_computarizado: "",
      Codigo_computarizadoMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromNo__Bitacora: "",
      toNo__Bitacora: "",
      fromFecha_de_mantenimiento: "",
      toFecha_de_mantenimiento: "",

    }
  };

  dataSource: Notificaciones_de_mantenimientoDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Notificaciones_de_mantenimientoDataSource;
  dataClipboard: any;

  constructor(
    private _Notificaciones_de_mantenimientoService: Notificaciones_de_mantenimientoService,
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
    this.dataSource = new Notificaciones_de_mantenimientoDataSource(
      this._Notificaciones_de_mantenimientoService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Notificaciones_de_mantenimiento)
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
    this.listConfig.filter.Codigo_computarizado = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Propietario = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.ATA = "";
    this.listConfig.filter.No__Bitacora = "";
    this.listConfig.filter.Fecha_de_mantenimiento = undefined;

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

  remove(row: Notificaciones_de_mantenimiento) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Notificaciones_de_mantenimientoService
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
  ActionPrint(dataRow: Notificaciones_de_mantenimiento) {

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
,'Código computarizado'
,'Modelo'
,'Propietario'
,'Matricula'
,'ATA'
,'No. Bitácora'
,'Fecha de mantenimiento'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Codigo_computarizado_Codigo_Computarizado.Descripcion_Busqueda
,x.Modelo_Modelos.Descripcion
,x.Propietario_Propietarios.Nombre
,x.Matricula_Aeronave.Matricula
,x.ATA
,x.No__Bitacora
,x.Fecha_de_mantenimiento
		  
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
    pdfMake.createPdf(pdfDefinition).download('Notificaciones_de_mantenimiento.pdf');
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
          this._Notificaciones_de_mantenimientoService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Notificaciones_de_mantenimientos;
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
          this._Notificaciones_de_mantenimientoService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Notificaciones_de_mantenimientos;
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
        'Código computarizado ': fields.Codigo_computarizado_Codigo_Computarizado.Descripcion_Busqueda,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'Propietario ': fields.Propietario_Propietarios.Nombre,
        'Matricula ': fields.Matricula_Aeronave.Matricula,
        'ATA ': fields.ATA,
        'No. Bitácora ': fields.No__Bitacora,
        'Fecha de mantenimiento ': fields.Fecha_de_mantenimiento ? momentJS(fields.Fecha_de_mantenimiento).format('DD/MM/YYYY') : '',

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Notificaciones_de_mantenimiento  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Codigo_computarizado: x.Codigo_computarizado_Codigo_Computarizado.Descripcion_Busqueda,
      Modelo: x.Modelo_Modelos.Descripcion,
      Propietario: x.Propietario_Propietarios.Nombre,
      Matricula: x.Matricula_Aeronave.Matricula,
      ATA: x.ATA,
      No__Bitacora: x.No__Bitacora,
      Fecha_de_mantenimiento: x.Fecha_de_mantenimiento,

    }));

    this.excelService.exportToCsv(result, 'Notificaciones_de_mantenimiento',  ['Folio'    ,'Codigo_computarizado'  ,'Modelo'  ,'Propietario'  ,'Matricula'  ,'ATA'  ,'No__Bitacora'  ,'Fecha_de_mantenimiento' ]);
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
    template += '          <th>Código computarizado</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Propietario</th>';
    template += '          <th>Matricula</th>';
    template += '          <th>ATA</th>';
    template += '          <th>No. Bitácora</th>';
    template += '          <th>Fecha de mantenimiento</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Codigo_computarizado_Codigo_Computarizado.Descripcion_Busqueda + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Propietario_Propietarios.Nombre + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.ATA + '</td>';
      template += '          <td>' + element.No__Bitacora + '</td>';
      template += '          <td>' + element.Fecha_de_mantenimiento + '</td>';
		  
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
	template += '\t Código computarizado';
	template += '\t Modelo';
	template += '\t Propietario';
	template += '\t Matricula';
	template += '\t ATA';
	template += '\t No. Bitácora';
	template += '\t Fecha de mantenimiento';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Codigo_computarizado_Codigo_Computarizado.Descripcion_Busqueda;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.Propietario_Propietarios.Nombre;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
	  template += '\t ' + element.ATA;
	  template += '\t ' + element.No__Bitacora;
	  template += '\t ' + element.Fecha_de_mantenimiento;

	  template += '\n';
    });

    return template;
  }

}

export class Notificaciones_de_mantenimientoDataSource implements DataSource<Notificaciones_de_mantenimiento>
{
  private subject = new BehaviorSubject<Notificaciones_de_mantenimiento[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Notificaciones_de_mantenimientoService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Notificaciones_de_mantenimiento[]> {
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
              const longest = result.Notificaciones_de_mantenimientos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Notificaciones_de_mantenimientos);
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
      condition += " and Notificaciones_de_mantenimiento.Folio = " + data.filter.Folio;
    if (data.filter.Codigo_computarizado != "")
      condition += " and Codigo_Computarizado.Descripcion_Busqueda like '%" + data.filter.Codigo_computarizado + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Propietario != "")
      condition += " and Propietarios.Nombre like '%" + data.filter.Propietario + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.ATA != "")
      condition += " and Notificaciones_de_mantenimiento.ATA like '%" + data.filter.ATA + "%' ";
    if (data.filter.No__Bitacora != "")
      condition += " and Notificaciones_de_mantenimiento.No__Bitacora = " + data.filter.No__Bitacora;
    if (data.filter.Fecha_de_mantenimiento)
      condition += " and CONVERT(VARCHAR(10), Notificaciones_de_mantenimiento.Fecha_de_mantenimiento, 102)  = '" + moment(data.filter.Fecha_de_mantenimiento).format("YYYY.MM.DD") + "'";

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
        sort = " Notificaciones_de_mantenimiento.Folio " + data.sortDirecction;
        break;
      case "Codigo_computarizado":
        sort = " Codigo_Computarizado.Descripcion_Busqueda " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Propietario":
        sort = " Propietarios.Nombre " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "ATA":
        sort = " Notificaciones_de_mantenimiento.ATA " + data.sortDirecction;
        break;
      case "No__Bitacora":
        sort = " Notificaciones_de_mantenimiento.No__Bitacora " + data.sortDirecction;
        break;
      case "Fecha_de_mantenimiento":
        sort = " Notificaciones_de_mantenimiento.Fecha_de_mantenimiento " + data.sortDirecction;
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
        condition += " AND Notificaciones_de_mantenimiento.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Notificaciones_de_mantenimiento.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Codigo_computarizado != 'undefined' && data.filterAdvanced.Codigo_computarizado)) {
      switch (data.filterAdvanced.Codigo_computarizadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '" + data.filterAdvanced.Codigo_computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Codigo_computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Codigo_computarizado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda = '" + data.filterAdvanced.Codigo_computarizado + "'";
          break;
      }
    } else if (data.filterAdvanced.Codigo_computarizadoMultiple != null && data.filterAdvanced.Codigo_computarizadoMultiple.length > 0) {
      var Codigo_computarizadods = data.filterAdvanced.Codigo_computarizadoMultiple.join(",");
      condition += " AND Notificaciones_de_mantenimiento.Codigo_computarizado In (" + Codigo_computarizadods + ")";
    }
    if ((typeof data.filterAdvanced.Modelo != 'undefined' && data.filterAdvanced.Modelo)) {
      switch (data.filterAdvanced.ModeloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Modelos.Descripcion LIKE '" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Modelos.Descripcion = '" + data.filterAdvanced.Modelo + "'";
          break;
      }
    } else if (data.filterAdvanced.ModeloMultiple != null && data.filterAdvanced.ModeloMultiple.length > 0) {
      var Modelods = data.filterAdvanced.ModeloMultiple.join(",");
      condition += " AND Notificaciones_de_mantenimiento.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.Propietario != 'undefined' && data.filterAdvanced.Propietario)) {
      switch (data.filterAdvanced.PropietarioFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Propietarios.Nombre LIKE '" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Propietarios.Nombre = '" + data.filterAdvanced.Propietario + "'";
          break;
      }
    } else if (data.filterAdvanced.PropietarioMultiple != null && data.filterAdvanced.PropietarioMultiple.length > 0) {
      var Propietariods = data.filterAdvanced.PropietarioMultiple.join(",");
      condition += " AND Notificaciones_de_mantenimiento.Propietario In (" + Propietariods + ")";
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
      condition += " AND Notificaciones_de_mantenimiento.Matricula In (" + Matriculads + ")";
    }
    switch (data.filterAdvanced.ATAFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Notificaciones_de_mantenimiento.ATA LIKE '" + data.filterAdvanced.ATA + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Notificaciones_de_mantenimiento.ATA LIKE '%" + data.filterAdvanced.ATA + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Notificaciones_de_mantenimiento.ATA LIKE '%" + data.filterAdvanced.ATA + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Notificaciones_de_mantenimiento.ATA = '" + data.filterAdvanced.ATA + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromNo__Bitacora != 'undefined' && data.filterAdvanced.fromNo__Bitacora)
	|| (typeof data.filterAdvanced.toNo__Bitacora != 'undefined' && data.filterAdvanced.toNo__Bitacora)) 
	{
      if (typeof data.filterAdvanced.fromNo__Bitacora != 'undefined' && data.filterAdvanced.fromNo__Bitacora)
        condition += " AND Notificaciones_de_mantenimiento.No__Bitacora >= " + data.filterAdvanced.fromNo__Bitacora;

      if (typeof data.filterAdvanced.toNo__Bitacora != 'undefined' && data.filterAdvanced.toNo__Bitacora) 
        condition += " AND Notificaciones_de_mantenimiento.No__Bitacora <= " + data.filterAdvanced.toNo__Bitacora;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_mantenimiento != 'undefined' && data.filterAdvanced.fromFecha_de_mantenimiento)
	|| (typeof data.filterAdvanced.toFecha_de_mantenimiento != 'undefined' && data.filterAdvanced.toFecha_de_mantenimiento)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_mantenimiento != 'undefined' && data.filterAdvanced.fromFecha_de_mantenimiento) 
        condition += " and CONVERT(VARCHAR(10), Notificaciones_de_mantenimiento.Fecha_de_mantenimiento, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_mantenimiento).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_mantenimiento != 'undefined' && data.filterAdvanced.toFecha_de_mantenimiento) 
        condition += " and CONVERT(VARCHAR(10), Notificaciones_de_mantenimiento.Fecha_de_mantenimiento, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_mantenimiento).format("YYYY.MM.DD") + "'";
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
              const longest = result.Notificaciones_de_mantenimientos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Notificaciones_de_mantenimientos);
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
