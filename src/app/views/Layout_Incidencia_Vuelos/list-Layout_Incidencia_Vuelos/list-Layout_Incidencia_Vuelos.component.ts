import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Layout_Incidencia_VuelosService } from "src/app/api-services/Layout_Incidencia_Vuelos.service";
import { Layout_Incidencia_Vuelos } from "src/app/models/Layout_Incidencia_Vuelos";
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
import { Layout_Incidencia_VuelosIndexRules } from 'src/app/shared/businessRules/Layout_Incidencia_Vuelos-index-rules';
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
  selector: "app-list-Layout_Incidencia_Vuelos",
  templateUrl: "./list-Layout_Incidencia_Vuelos.component.html",
  styleUrls: ["./list-Layout_Incidencia_Vuelos.component.scss"],
})
export class ListLayout_Incidencia_VuelosComponent extends Layout_Incidencia_VuelosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Folio_de_carga_manual",
    "Fecha",
    "Vuelo",
    "TipoIncidencia",
    "Responsable",
    "Motivo",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "Vuelo",
      "TipoIncidencia",
      "Responsable",
      "Motivo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_de_carga_manual_filtro",
      "Fecha_filtro",
      "Vuelo_filtro",
      "TipoIncidencia_filtro",
      "Responsable_filtro",
      "Motivo_filtro",

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
      Vuelo: "",
      TipoIncidencia: "",
      Responsable: "",
      Motivo: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFolio_de_carga_manual: "",
      toFolio_de_carga_manual: "",
      fromFecha: "",
      toFecha: "",
      VueloFilter: "",
      Vuelo: "",
      VueloMultiple: "",
      TipoIncidenciaFilter: "",
      TipoIncidencia: "",
      TipoIncidenciaMultiple: "",
      ResponsableFilter: "",
      Responsable: "",
      ResponsableMultiple: "",

    }
  };

  dataSource: Layout_Incidencia_VuelosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Layout_Incidencia_VuelosDataSource;
  dataClipboard: any;

  constructor(
    private _Layout_Incidencia_VuelosService: Layout_Incidencia_VuelosService,
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
    this.dataSource = new Layout_Incidencia_VuelosDataSource(
      this._Layout_Incidencia_VuelosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Layout_Incidencia_Vuelos)
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
    this.listConfig.filter.Vuelo = "";
    this.listConfig.filter.TipoIncidencia = "";
    this.listConfig.filter.Responsable = "";
    this.listConfig.filter.Motivo = "";

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

  remove(row: Layout_Incidencia_Vuelos) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Layout_Incidencia_VuelosService
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
  ActionPrint(dataRow: Layout_Incidencia_Vuelos) {

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
,'Vuelo'
,'TipoIncidencia'
,'Responsable'
,'Motivo'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Folio_de_carga_manual
,x.Fecha
,x.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
,x.TipoIncidencia_Tipo_Incidencia_Vuelos.Descripcion
,x.Responsable_Responsable_Incidencia_Vuelo.Descripcion
,x.Motivo
		  
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
    pdfMake.createPdf(pdfDefinition).download('Layout_Incidencia_Vuelos.pdf');
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
          this._Layout_Incidencia_VuelosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Layout_Incidencia_Vueloss;
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
          this._Layout_Incidencia_VuelosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Layout_Incidencia_Vueloss;
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
        'Vuelo ': fields.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'TipoIncidencia ': fields.TipoIncidencia_Tipo_Incidencia_Vuelos.Descripcion,
        'Responsable ': fields.Responsable_Responsable_Incidencia_Vuelo.Descripcion,
        'Motivo ': fields.Motivo,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Layout_Incidencia_Vuelos  ${new Date().toLocaleString()}`);
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
      Vuelo: x.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      TipoIncidencia: x.TipoIncidencia_Tipo_Incidencia_Vuelos.Descripcion,
      Responsable: x.Responsable_Responsable_Incidencia_Vuelo.Descripcion,
      Motivo: x.Motivo,

    }));

    this.excelService.exportToCsv(result, 'Layout_Incidencia_Vuelos',  ['Folio'    ,'Folio_de_carga_manual'  ,'Fecha'  ,'Vuelo'  ,'TipoIncidencia'  ,'Responsable'  ,'Motivo' ]);
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
    template += '          <th>Vuelo</th>';
    template += '          <th>TipoIncidencia</th>';
    template += '          <th>Responsable</th>';
    template += '          <th>Motivo</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Folio_de_carga_manual + '</td>';
      template += '          <td>' + element.Fecha + '</td>';
      template += '          <td>' + element.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.TipoIncidencia_Tipo_Incidencia_Vuelos.Descripcion + '</td>';
      template += '          <td>' + element.Responsable_Responsable_Incidencia_Vuelo.Descripcion + '</td>';
      template += '          <td>' + element.Motivo + '</td>';
		  
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
	template += '\t Vuelo';
	template += '\t TipoIncidencia';
	template += '\t Responsable';
	template += '\t Motivo';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Folio_de_carga_manual;
	  template += '\t ' + element.Fecha;
      template += '\t ' + element.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.TipoIncidencia_Tipo_Incidencia_Vuelos.Descripcion;
      template += '\t ' + element.Responsable_Responsable_Incidencia_Vuelo.Descripcion;
	  template += '\t ' + element.Motivo;

	  template += '\n';
    });

    return template;
  }

}

export class Layout_Incidencia_VuelosDataSource implements DataSource<Layout_Incidencia_Vuelos>
{
  private subject = new BehaviorSubject<Layout_Incidencia_Vuelos[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Layout_Incidencia_VuelosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Layout_Incidencia_Vuelos[]> {
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
              const longest = result.Layout_Incidencia_Vueloss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Layout_Incidencia_Vueloss);
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
      condition += " and Layout_Incidencia_Vuelos.Folio = " + data.filter.Folio;
    if (data.filter.Folio_de_carga_manual != "")
      condition += " and Layout_Incidencia_Vuelos.Folio_de_carga_manual = " + data.filter.Folio_de_carga_manual;
    if (data.filter.Fecha)
      condition += " and CONVERT(VARCHAR(10), Layout_Incidencia_Vuelos.Fecha, 102)  = '" + moment(data.filter.Fecha).format("YYYY.MM.DD") + "'";
    if (data.filter.Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Vuelo + "%' ";
    if (data.filter.TipoIncidencia != "")
      condition += " and Tipo_Incidencia_Vuelos.Descripcion like '%" + data.filter.TipoIncidencia + "%' ";
    if (data.filter.Responsable != "")
      condition += " and Responsable_Incidencia_Vuelo.Descripcion like '%" + data.filter.Responsable + "%' ";
    if (data.filter.Motivo != "")
      condition += " and Layout_Incidencia_Vuelos.Motivo like '%" + data.filter.Motivo + "%' ";

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
        sort = " Layout_Incidencia_Vuelos.Folio " + data.sortDirecction;
        break;
      case "Folio_de_carga_manual":
        sort = " Layout_Incidencia_Vuelos.Folio_de_carga_manual " + data.sortDirecction;
        break;
      case "Fecha":
        sort = " Layout_Incidencia_Vuelos.Fecha " + data.sortDirecction;
        break;
      case "Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "TipoIncidencia":
        sort = " Tipo_Incidencia_Vuelos.Descripcion " + data.sortDirecction;
        break;
      case "Responsable":
        sort = " Responsable_Incidencia_Vuelo.Descripcion " + data.sortDirecction;
        break;
      case "Motivo":
        sort = " Layout_Incidencia_Vuelos.Motivo " + data.sortDirecction;
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
        condition += " AND Layout_Incidencia_Vuelos.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Layout_Incidencia_Vuelos.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFolio_de_carga_manual != 'undefined' && data.filterAdvanced.fromFolio_de_carga_manual)
	|| (typeof data.filterAdvanced.toFolio_de_carga_manual != 'undefined' && data.filterAdvanced.toFolio_de_carga_manual)) 
	{
      if (typeof data.filterAdvanced.fromFolio_de_carga_manual != 'undefined' && data.filterAdvanced.fromFolio_de_carga_manual)
        condition += " AND Layout_Incidencia_Vuelos.Folio_de_carga_manual >= " + data.filterAdvanced.fromFolio_de_carga_manual;

      if (typeof data.filterAdvanced.toFolio_de_carga_manual != 'undefined' && data.filterAdvanced.toFolio_de_carga_manual) 
        condition += " AND Layout_Incidencia_Vuelos.Folio_de_carga_manual <= " + data.filterAdvanced.toFolio_de_carga_manual;
    }
    if ((typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
	|| (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)) 
	{
      if (typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha) 
        condition += " and CONVERT(VARCHAR(10), Layout_Incidencia_Vuelos.Fecha, 102)  >= '" +  moment(data.filterAdvanced.fromFecha).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha) 
        condition += " and CONVERT(VARCHAR(10), Layout_Incidencia_Vuelos.Fecha, 102)  <= '" + moment(data.filterAdvanced.toFecha).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Vuelo != 'undefined' && data.filterAdvanced.Vuelo)) {
      switch (data.filterAdvanced.VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.VueloMultiple != null && data.filterAdvanced.VueloMultiple.length > 0) {
      var Vuelods = data.filterAdvanced.VueloMultiple.join(",");
      condition += " AND Layout_Incidencia_Vuelos.Vuelo In (" + Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.TipoIncidencia != 'undefined' && data.filterAdvanced.TipoIncidencia)) {
      switch (data.filterAdvanced.TipoIncidenciaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_Incidencia_Vuelos.Descripcion LIKE '" + data.filterAdvanced.TipoIncidencia + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_Incidencia_Vuelos.Descripcion LIKE '%" + data.filterAdvanced.TipoIncidencia + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_Incidencia_Vuelos.Descripcion LIKE '%" + data.filterAdvanced.TipoIncidencia + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_Incidencia_Vuelos.Descripcion = '" + data.filterAdvanced.TipoIncidencia + "'";
          break;
      }
    } else if (data.filterAdvanced.TipoIncidenciaMultiple != null && data.filterAdvanced.TipoIncidenciaMultiple.length > 0) {
      var TipoIncidenciads = data.filterAdvanced.TipoIncidenciaMultiple.join(",");
      condition += " AND Layout_Incidencia_Vuelos.TipoIncidencia In (" + TipoIncidenciads + ")";
    }
    if ((typeof data.filterAdvanced.Responsable != 'undefined' && data.filterAdvanced.Responsable)) {
      switch (data.filterAdvanced.ResponsableFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Responsable_Incidencia_Vuelo.Descripcion LIKE '" + data.filterAdvanced.Responsable + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Responsable_Incidencia_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Responsable + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Responsable_Incidencia_Vuelo.Descripcion LIKE '%" + data.filterAdvanced.Responsable + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Responsable_Incidencia_Vuelo.Descripcion = '" + data.filterAdvanced.Responsable + "'";
          break;
      }
    } else if (data.filterAdvanced.ResponsableMultiple != null && data.filterAdvanced.ResponsableMultiple.length > 0) {
      var Responsableds = data.filterAdvanced.ResponsableMultiple.join(",");
      condition += " AND Layout_Incidencia_Vuelos.Responsable In (" + Responsableds + ")";
    }
    switch (data.filterAdvanced.MotivoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Layout_Incidencia_Vuelos.Motivo LIKE '" + data.filterAdvanced.Motivo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Layout_Incidencia_Vuelos.Motivo LIKE '%" + data.filterAdvanced.Motivo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Layout_Incidencia_Vuelos.Motivo LIKE '%" + data.filterAdvanced.Motivo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Layout_Incidencia_Vuelos.Motivo = '" + data.filterAdvanced.Motivo + "'";
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
              const longest = result.Layout_Incidencia_Vueloss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Layout_Incidencia_Vueloss);
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
