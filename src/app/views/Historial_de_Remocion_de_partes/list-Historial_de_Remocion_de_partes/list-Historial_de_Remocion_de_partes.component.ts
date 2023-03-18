import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Historial_de_Remocion_de_partesService } from "src/app/api-services/Historial_de_Remocion_de_partes.service";
import { Historial_de_Remocion_de_partes } from "src/app/models/Historial_de_Remocion_de_partes";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild } from "@angular/core";
import { CollectionViewer } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of } from "rxjs";
import { catchError, finalize, concatMap, switchMap, mergeMap, tap } from "rxjs/operators";
import { SpartanService } from "src/app/api-services/spartan.service";
import { MatSort } from "@angular/material/sort";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import * as AppConstants from "../../../app-constants";
import { StorageKeys } from "../../../app-constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { Historial_de_Remocion_de_partesIndexRules } from 'src/app/shared/businessRules/Historial_de_Remocion_de_partes-index-rules';
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
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-list-Historial_de_Remocion_de_partes",
  templateUrl: "./list-Historial_de_Remocion_de_partes.component.html",
  styleUrls: ["./list-Historial_de_Remocion_de_partes.component.scss"],
})
export class ListHistorial_de_Remocion_de_partesComponent extends Historial_de_Remocion_de_partesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {

  displayedColumns = [
    "acciones",
    "Folio",
    "Descripcion",
    "N_de_parte",
    "N_Serie",
    "Modelo",
    "Posicion",
    "Estatus",
    "Horas_actuales",
    "Ciclos_actuales",
    "Causa_de_remocion",
    "Fecha_de_Remocion",
    "Usuario_que_realiza_la_remocion",
    "Tiempo_de_remocion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Descripcion",
      "N_de_parte",
      "N_Serie",
      "Modelo",
      "Posicion",
      "Estatus",
      "Horas_actuales",
      "Ciclos_actuales",
      "Causa_de_remocion",
      "Fecha_de_Remocion",
      "Usuario_que_realiza_la_remocion",
      "Tiempo_de_remocion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Descripcion_filtro",
      "N_de_parte_filtro",
      "N_Serie_filtro",
      "Modelo_filtro",
      "Posicion_filtro",
      "Estatus_filtro",
      "Horas_actuales_filtro",
      "Ciclos_actuales_filtro",
      "Causa_de_remocion_filtro",
      "Fecha_de_Remocion_filtro",
      "Usuario_que_realiza_la_remocion_filtro",
      "Tiempo_de_remocion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Descripcion: "",
      N_de_parte: "",
      N_Serie: "",
      Modelo: "",
      Posicion: "",
      Estatus: "",
      Horas_actuales: "",
      Ciclos_actuales: "",
      Causa_de_remocion: "",
      Fecha_de_Remocion: null,
      Usuario_que_realiza_la_remocion: "",
      Tiempo_de_remocion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromHoras_actuales: "",
      toHoras_actuales: "",
      fromCiclos_actuales: "",
      toCiclos_actuales: "",
      Causa_de_remocionFilter: "",
      Causa_de_remocion: "",
      Causa_de_remocionMultiple: "",
      fromFecha_de_Remocion: "",
      toFecha_de_Remocion: "",
      Usuario_que_realiza_la_remocionFilter: "",
      Usuario_que_realiza_la_remocion: "",
      Usuario_que_realiza_la_remocionMultiple: "",
      Tiempo_de_remocionFilter: "",
      Tiempo_de_remocion: "",
      Tiempo_de_remocionMultiple: "",

    }
  };

  dataSource: Historial_de_Remocion_de_partesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Historial_de_Remocion_de_partesDataSource;
  dataClipboard: any;

  constructor(
    private _Historial_de_Remocion_de_partesService: Historial_de_Remocion_de_partesService,
    public _dialog: MatDialog,
    private _messages: MessagesHelper,
    private _seguridad: SeguridadService,
    private _translate: TranslateService,
    private localStorageHelper: LocalStorageHelper,
    public _file: SpartanFileService,
    public dialogo: MatDialog,
    private excelService: ExcelService,
    _user: SpartanUserService,
    private SpartanService: SpartanService,
    route: Router
  ) {
    super();
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

  }

  ngOnInit() {
    //this.rulesOnInit();
    this.dataSource = new Historial_de_Remocion_de_partesDataSource(
      this._Historial_de_Remocion_de_partesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Historial_de_Remocion_de_partes)
      .subscribe((response) => {
        this.permisos = response;
      });
  }

  ngAfterViewInit() {
    //this.rulesAfterViewInit();  
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
    //this.rulesAfterViewChecked();
  }
  
  clearFilter() {
    this.listConfig.page = 0;
    this.listConfig.filter.Folio = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.N_de_parte = "";
    this.listConfig.filter.N_Serie = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Posicion = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Horas_actuales = "";
    this.listConfig.filter.Ciclos_actuales = "";
    this.listConfig.filter.Causa_de_remocion = "";
    this.listConfig.filter.Fecha_de_Remocion = undefined;
    this.listConfig.filter.Usuario_que_realiza_la_remocion = "";
    this.listConfig.filter.Tiempo_de_remocion = "";

    this.listConfig.page = 0;
    this.loadData();
  }

  refresh() {
    this.listConfig.page = 0;
    this.loadData();
  }



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

  remove(row: Historial_de_Remocion_de_partes) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Historial_de_Remocion_de_partesService
          .delete(row.Folio)
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
  ActionPrint(dataRow: Historial_de_Remocion_de_partes) {

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
          this._Historial_de_Remocion_de_partesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Historial_de_Remocion_de_partess;
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
                    const documentDefinition = { content: this.SetTableExportToClipboard(this.dataSourceTemp) };
                    pdfMake.createPdf(documentDefinition).download('Historial_de_Remocion_de_partes.pdf');
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
          this._Historial_de_Remocion_de_partesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Historial_de_Remocion_de_partess;
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
                    const documentDefinition = { content: this.SetTableExportToClipboard(this.dataSourceTemp) };
                    pdfMake.createPdf(documentDefinition).download('Historial_de_Remocion_de_partes.pdf');
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
        'Folio': fields.Folio,
        'Descripción': fields.Descripcion,
        'N° de parte': fields.N_de_parte,
        'N° Serie': fields.N_Serie,
        'Modelo': fields.Modelo,
        'Posición': fields.Posicion,
        'Estatus': fields.Estatus_Estatus_de_remocion.Descripcion,
        'Horas actuales': fields.Horas_actuales,
        'Ciclos actuales': fields.Ciclos_actuales,
        'Causa de remoción': fields.Causa_de_remocion_Causa_de_remocion.Descripcion,
        'Fecha de remoción': fields.Fecha_de_Remocion ? momentJS(fields.Fecha_de_Remocion).format('DD/MM/YYYY') : '',
        'Usuario que realiza la remoción': fields.Usuario_que_realiza_la_remocion_Spartan_User.Name,
        'Tiempo de remoción': fields.Tiempo_de_remocion_Tiempo_de_remocion.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Historial_de_Remocion_de_partes  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Descripcion: x.Descripcion,
      N_de_parte: x.N_de_parte,
      N_Serie: x.N_Serie,
      Modelo: x.Modelo,
      Posicion: x.Posicion,
      Estatus: x.Estatus_Estatus_de_remocion.Descripcion,
      Horas_actuales: x.Horas_actuales,
      Ciclos_actuales: x.Ciclos_actuales,
      Causa_de_remocion: x.Causa_de_remocion_Causa_de_remocion.Descripcion,
      Fecha_de_Remocion: x.Fecha_de_Remocion,
      Usuario_que_realiza_la_remocion: x.Usuario_que_realiza_la_remocion_Spartan_User.Name,
      Tiempo_de_remocion: x.Tiempo_de_remocion_Tiempo_de_remocion.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Historial_de_Remocion_de_partes',  ['Folio'    ,'Descripcion'  ,'N_de_parte'  ,'N_Serie'  ,'Modelo'  ,'Posicion'  ,'Estatus'  ,'Horas_actuales'  ,'Ciclos_actuales'  ,'Causa_de_remocion'  ,'Fecha_de_Remocion'  ,'Usuario_que_realiza_la_remocion'  ,'Tiempo_de_remocion' ]);
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
    template += '          <th>Descripción</th>';
    template += '          <th>N° de parte</th>';
    template += '          <th>N° Serie</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Posición</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Horas actuales</th>';
    template += '          <th>Ciclos actuales</th>';
    template += '          <th>Causa de remoción</th>';
    template += '          <th>Fecha de remoción</th>';
    template += '          <th>Usuario que realiza la remoción</th>';
    template += '          <th>Tiempo de remoción</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.N_de_parte + '</td>';
      template += '          <td>' + element.N_Serie + '</td>';
      template += '          <td>' + element.Modelo + '</td>';
      template += '          <td>' + element.Posicion + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_remocion.Descripcion + '</td>';
      template += '          <td>' + element.Horas_actuales + '</td>';
      template += '          <td>' + element.Ciclos_actuales + '</td>';
      template += '          <td>' + element.Causa_de_remocion_Causa_de_remocion.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_de_Remocion + '</td>';
      template += '          <td>' + element.Usuario_que_realiza_la_remocion_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Tiempo_de_remocion_Tiempo_de_remocion.Descripcion + '</td>';
		  
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
	template += '\t Descripción';
	template += '\t N° de parte';
	template += '\t N° Serie';
	template += '\t Modelo';
	template += '\t Posición';
	template += '\t Estatus';
	template += '\t Horas actuales';
	template += '\t Ciclos actuales';
	template += '\t Causa de remoción';
	template += '\t Fecha de remoción';
	template += '\t Usuario que realiza la remoción';
	template += '\t Tiempo de remoción';

	template += '\n';

    data.forEach(element => {
      template =''
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Descripcion;
	  template += '\t ' + element.N_de_parte;
	  template += '\t ' + element.N_Serie;
	  template += '\t ' + element.Modelo;
	  template += '\t ' + element.Posicion;
      template += '\t ' + element.Estatus_Estatus_de_remocion.Descripcion;
	  template += '\t ' + element.Horas_actuales;
	  template += '\t ' + element.Ciclos_actuales;
      template += '\t ' + element.Causa_de_remocion_Causa_de_remocion.Descripcion;
	  template += '\t ' + element.Fecha_de_Remocion;
      template += '\t ' + element.Usuario_que_realiza_la_remocion_Spartan_User.Name;
      template += '\t ' + element.Tiempo_de_remocion_Tiempo_de_remocion.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Historial_de_Remocion_de_partesDataSource implements DataSource<Historial_de_Remocion_de_partes>
{
  private subject = new BehaviorSubject<Historial_de_Remocion_de_partes[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Historial_de_Remocion_de_partesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Historial_de_Remocion_de_partes[]> {
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
              const longest = result.Historial_de_Remocion_de_partess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Historial_de_Remocion_de_partess);
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
      condition += " and Historial_de_Remocion_de_partes.Folio = " + data.filter.Folio;
    if (data.filter.Descripcion != "")
      condition += " and Historial_de_Remocion_de_partes.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.N_de_parte != "")
      condition += " and Historial_de_Remocion_de_partes.N_de_parte like '%" + data.filter.N_de_parte + "%' ";
    if (data.filter.N_Serie != "")
      condition += " and Historial_de_Remocion_de_partes.N_Serie like '%" + data.filter.N_Serie + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Historial_de_Remocion_de_partes.Modelo like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Posicion != "")
      condition += " and Historial_de_Remocion_de_partes.Posicion like '%" + data.filter.Posicion + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_remocion.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Horas_actuales != "")
      condition += " and Historial_de_Remocion_de_partes.Horas_actuales = " + data.filter.Horas_actuales;
    if (data.filter.Ciclos_actuales != "")
      condition += " and Historial_de_Remocion_de_partes.Ciclos_actuales = " + data.filter.Ciclos_actuales;
    if (data.filter.Causa_de_remocion != "")
      condition += " and Causa_de_remocion.Descripcion like '%" + data.filter.Causa_de_remocion + "%' ";
    if (data.filter.Fecha_de_Remocion)
      condition += " and CONVERT(VARCHAR(10), Historial_de_Remocion_de_partes.Fecha_de_Remocion, 102)  = '" + moment(data.filter.Fecha_de_Remocion).format("YYYY.MM.DD") + "'";
    if (data.filter.Usuario_que_realiza_la_remocion != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_realiza_la_remocion + "%' ";
    if (data.filter.Tiempo_de_remocion != "")
      condition += " and Tiempo_de_remocion.Descripcion like '%" + data.filter.Tiempo_de_remocion + "%' ";

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
        sort = " Historial_de_Remocion_de_partes.Folio " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Historial_de_Remocion_de_partes.Descripcion " + data.sortDirecction;
        break;
      case "N_de_parte":
        sort = " Historial_de_Remocion_de_partes.N_de_parte " + data.sortDirecction;
        break;
      case "N_Serie":
        sort = " Historial_de_Remocion_de_partes.N_Serie " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Historial_de_Remocion_de_partes.Modelo " + data.sortDirecction;
        break;
      case "Posicion":
        sort = " Historial_de_Remocion_de_partes.Posicion " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_remocion.Descripcion " + data.sortDirecction;
        break;
      case "Horas_actuales":
        sort = " Historial_de_Remocion_de_partes.Horas_actuales " + data.sortDirecction;
        break;
      case "Ciclos_actuales":
        sort = " Historial_de_Remocion_de_partes.Ciclos_actuales " + data.sortDirecction;
        break;
      case "Causa_de_remocion":
        sort = " Causa_de_remocion.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_de_Remocion":
        sort = " Historial_de_Remocion_de_partes.Fecha_de_Remocion " + data.sortDirecction;
        break;
      case "Usuario_que_realiza_la_remocion":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Tiempo_de_remocion":
        sort = " Tiempo_de_remocion.Descripcion " + data.sortDirecction;
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
        condition += " AND Historial_de_Remocion_de_partes.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Historial_de_Remocion_de_partes.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Remocion_de_partes.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Remocion_de_partes.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Remocion_de_partes.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Remocion_de_partes.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    switch (data.filterAdvanced.N_de_parteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Remocion_de_partes.N_de_parte LIKE '" + data.filterAdvanced.N_de_parte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Remocion_de_partes.N_de_parte LIKE '%" + data.filterAdvanced.N_de_parte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Remocion_de_partes.N_de_parte LIKE '%" + data.filterAdvanced.N_de_parte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Remocion_de_partes.N_de_parte = '" + data.filterAdvanced.N_de_parte + "'";
        break;
    }
    switch (data.filterAdvanced.N_SerieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Remocion_de_partes.N_Serie LIKE '" + data.filterAdvanced.N_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Remocion_de_partes.N_Serie LIKE '%" + data.filterAdvanced.N_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Remocion_de_partes.N_Serie LIKE '%" + data.filterAdvanced.N_Serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Remocion_de_partes.N_Serie = '" + data.filterAdvanced.N_Serie + "'";
        break;
    }
    switch (data.filterAdvanced.ModeloFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Remocion_de_partes.Modelo LIKE '" + data.filterAdvanced.Modelo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Remocion_de_partes.Modelo LIKE '%" + data.filterAdvanced.Modelo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Remocion_de_partes.Modelo LIKE '%" + data.filterAdvanced.Modelo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Remocion_de_partes.Modelo = '" + data.filterAdvanced.Modelo + "'";
        break;
    }
    switch (data.filterAdvanced.PosicionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Remocion_de_partes.Posicion LIKE '" + data.filterAdvanced.Posicion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Remocion_de_partes.Posicion LIKE '%" + data.filterAdvanced.Posicion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Remocion_de_partes.Posicion LIKE '%" + data.filterAdvanced.Posicion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Remocion_de_partes.Posicion = '" + data.filterAdvanced.Posicion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_remocion.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_remocion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_remocion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_remocion.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Historial_de_Remocion_de_partes.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.fromHoras_actuales != 'undefined' && data.filterAdvanced.fromHoras_actuales)
	|| (typeof data.filterAdvanced.toHoras_actuales != 'undefined' && data.filterAdvanced.toHoras_actuales)) 
	{
      if (typeof data.filterAdvanced.fromHoras_actuales != 'undefined' && data.filterAdvanced.fromHoras_actuales)
        condition += " AND Historial_de_Remocion_de_partes.Horas_actuales >= " + data.filterAdvanced.fromHoras_actuales;

      if (typeof data.filterAdvanced.toHoras_actuales != 'undefined' && data.filterAdvanced.toHoras_actuales) 
        condition += " AND Historial_de_Remocion_de_partes.Horas_actuales <= " + data.filterAdvanced.toHoras_actuales;
    }
    if ((typeof data.filterAdvanced.fromCiclos_actuales != 'undefined' && data.filterAdvanced.fromCiclos_actuales)
	|| (typeof data.filterAdvanced.toCiclos_actuales != 'undefined' && data.filterAdvanced.toCiclos_actuales)) 
	{
      if (typeof data.filterAdvanced.fromCiclos_actuales != 'undefined' && data.filterAdvanced.fromCiclos_actuales)
        condition += " AND Historial_de_Remocion_de_partes.Ciclos_actuales >= " + data.filterAdvanced.fromCiclos_actuales;

      if (typeof data.filterAdvanced.toCiclos_actuales != 'undefined' && data.filterAdvanced.toCiclos_actuales) 
        condition += " AND Historial_de_Remocion_de_partes.Ciclos_actuales <= " + data.filterAdvanced.toCiclos_actuales;
    }
    if ((typeof data.filterAdvanced.Causa_de_remocion != 'undefined' && data.filterAdvanced.Causa_de_remocion)) {
      switch (data.filterAdvanced.Causa_de_remocionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Causa_de_remocion.Descripcion LIKE '" + data.filterAdvanced.Causa_de_remocion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Causa_de_remocion.Descripcion LIKE '%" + data.filterAdvanced.Causa_de_remocion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Causa_de_remocion.Descripcion LIKE '%" + data.filterAdvanced.Causa_de_remocion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Causa_de_remocion.Descripcion = '" + data.filterAdvanced.Causa_de_remocion + "'";
          break;
      }
    } else if (data.filterAdvanced.Causa_de_remocionMultiple != null && data.filterAdvanced.Causa_de_remocionMultiple.length > 0) {
      var Causa_de_remocionds = data.filterAdvanced.Causa_de_remocionMultiple.join(",");
      condition += " AND Historial_de_Remocion_de_partes.Causa_de_remocion In (" + Causa_de_remocionds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Remocion != 'undefined' && data.filterAdvanced.fromFecha_de_Remocion)
	|| (typeof data.filterAdvanced.toFecha_de_Remocion != 'undefined' && data.filterAdvanced.toFecha_de_Remocion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Remocion != 'undefined' && data.filterAdvanced.fromFecha_de_Remocion) 
        condition += " and CONVERT(VARCHAR(10), Historial_de_Remocion_de_partes.Fecha_de_Remocion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Remocion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Remocion != 'undefined' && data.filterAdvanced.toFecha_de_Remocion) 
        condition += " and CONVERT(VARCHAR(10), Historial_de_Remocion_de_partes.Fecha_de_Remocion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Remocion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_realiza_la_remocion != 'undefined' && data.filterAdvanced.Usuario_que_realiza_la_remocion)) {
      switch (data.filterAdvanced.Usuario_que_realiza_la_remocionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_que_realiza_la_remocion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_realiza_la_remocion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_realiza_la_remocion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_que_realiza_la_remocion + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_realiza_la_remocionMultiple != null && data.filterAdvanced.Usuario_que_realiza_la_remocionMultiple.length > 0) {
      var Usuario_que_realiza_la_remocionds = data.filterAdvanced.Usuario_que_realiza_la_remocionMultiple.join(",");
      condition += " AND Historial_de_Remocion_de_partes.Usuario_que_realiza_la_remocion In (" + Usuario_que_realiza_la_remocionds + ")";
    }
    if ((typeof data.filterAdvanced.Tiempo_de_remocion != 'undefined' && data.filterAdvanced.Tiempo_de_remocion)) {
      switch (data.filterAdvanced.Tiempo_de_remocionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tiempo_de_remocion.Descripcion LIKE '" + data.filterAdvanced.Tiempo_de_remocion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tiempo_de_remocion.Descripcion LIKE '%" + data.filterAdvanced.Tiempo_de_remocion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tiempo_de_remocion.Descripcion LIKE '%" + data.filterAdvanced.Tiempo_de_remocion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tiempo_de_remocion.Descripcion = '" + data.filterAdvanced.Tiempo_de_remocion + "'";
          break;
      }
    } else if (data.filterAdvanced.Tiempo_de_remocionMultiple != null && data.filterAdvanced.Tiempo_de_remocionMultiple.length > 0) {
      var Tiempo_de_remocionds = data.filterAdvanced.Tiempo_de_remocionMultiple.join(",");
      condition += " AND Historial_de_Remocion_de_partes.Tiempo_de_remocion In (" + Tiempo_de_remocionds + ")";
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
              const longest = result.Historial_de_Remocion_de_partess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Historial_de_Remocion_de_partess);
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
