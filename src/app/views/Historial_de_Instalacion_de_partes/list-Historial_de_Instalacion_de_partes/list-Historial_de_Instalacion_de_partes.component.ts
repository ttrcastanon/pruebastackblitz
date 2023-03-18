import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Historial_de_Instalacion_de_partesService } from "src/app/api-services/Historial_de_Instalacion_de_partes.service";
import { Historial_de_Instalacion_de_partes } from "src/app/models/Historial_de_Instalacion_de_partes";
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
import { Historial_de_Instalacion_de_partesIndexRules } from 'src/app/shared/businessRules/Historial_de_Instalacion_de_partes-index-rules';
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
  selector: "app-list-Historial_de_Instalacion_de_partes",
  templateUrl: "./list-Historial_de_Instalacion_de_partes.component.html",
  styleUrls: ["./list-Historial_de_Instalacion_de_partes.component.scss"],
})
export class ListHistorial_de_Instalacion_de_partesComponent extends Historial_de_Instalacion_de_partesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {

  displayedColumns = [
    "acciones",
    "Folio",
    "Descripcion",
    "N_de_parte",
    "N_de_serie",
    "Modelo",
    "Posicion",
    "Estatus",
    "Horas_acumuladas_parte",
    "Ciclos_acumulados_parte",
    "Fecha_de_Fabricacion",
    "Fecha_de_Instalacion",
    "Fecha_Reparacion",
    "Usuario_que_realiza_la_instalacion",
    "Meses_acumulados_parte",
    "Tipo_de_vencimiento",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Descripcion",
      "N_de_parte",
      "N_de_serie",
      "Modelo",
      "Posicion",
      "Estatus",
      "Horas_acumuladas_parte",
      "Ciclos_acumulados_parte",
      "Fecha_de_Fabricacion",
      "Fecha_de_Instalacion",
      "Fecha_Reparacion",
      "Usuario_que_realiza_la_instalacion",
      "Meses_acumulados_parte",
      "Tipo_de_vencimiento",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Descripcion_filtro",
      "N_de_parte_filtro",
      "N_de_serie_filtro",
      "Modelo_filtro",
      "Posicion_filtro",
      "Estatus_filtro",
      "Horas_acumuladas_parte_filtro",
      "Ciclos_acumulados_parte_filtro",
      "Fecha_de_Fabricacion_filtro",
      "Fecha_de_Instalacion_filtro",
      "Fecha_Reparacion_filtro",
      "Usuario_que_realiza_la_instalacion_filtro",
      "Meses_acumulados_parte_filtro",
      "Tipo_de_vencimiento_filtro",

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
      N_de_serie: "",
      Modelo: "",
      Posicion: "",
      Estatus: "",
      Horas_acumuladas_parte: "",
      Ciclos_acumulados_parte: "",
      Fecha_de_Fabricacion: null,
      Fecha_de_Instalacion: null,
      Fecha_Reparacion: null,
      Usuario_que_realiza_la_instalacion: "",
      Meses_acumulados_parte: "",
      Tipo_de_vencimiento: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromHoras_acumuladas_parte: "",
      toHoras_acumuladas_parte: "",
      fromCiclos_acumulados_parte: "",
      toCiclos_acumulados_parte: "",
      fromFecha_de_Fabricacion: "",
      toFecha_de_Fabricacion: "",
      fromFecha_de_Instalacion: "",
      toFecha_de_Instalacion: "",
      fromFecha_Reparacion: "",
      toFecha_Reparacion: "",
      Usuario_que_realiza_la_instalacionFilter: "",
      Usuario_que_realiza_la_instalacion: "",
      Usuario_que_realiza_la_instalacionMultiple: "",
      fromMeses_acumulados_parte: "",
      toMeses_acumulados_parte: "",
      Tipo_de_vencimientoFilter: "",
      Tipo_de_vencimiento: "",
      Tipo_de_vencimientoMultiple: "",

    }
  };

  dataSource: Historial_de_Instalacion_de_partesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Historial_de_Instalacion_de_partesDataSource;
  dataClipboard: any;

  constructor(
    private _Historial_de_Instalacion_de_partesService: Historial_de_Instalacion_de_partesService,
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
    this.dataSource = new Historial_de_Instalacion_de_partesDataSource(
      this._Historial_de_Instalacion_de_partesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Historial_de_Instalacion_de_partes)
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
    this.listConfig.filter.N_de_serie = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Posicion = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Horas_acumuladas_parte = "";
    this.listConfig.filter.Ciclos_acumulados_parte = "";
    this.listConfig.filter.Fecha_de_Fabricacion = undefined;
    this.listConfig.filter.Fecha_de_Instalacion = undefined;
    this.listConfig.filter.Fecha_Reparacion = undefined;
    this.listConfig.filter.Usuario_que_realiza_la_instalacion = "";
    this.listConfig.filter.Meses_acumulados_parte = "";
    this.listConfig.filter.Tipo_de_vencimiento = "";

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

  remove(row: Historial_de_Instalacion_de_partes) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Historial_de_Instalacion_de_partesService
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
  ActionPrint(dataRow: Historial_de_Instalacion_de_partes) {

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
          this._Historial_de_Instalacion_de_partesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Historial_de_Instalacion_de_partess;
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
                    pdfMake.createPdf(documentDefinition).download('Historial_de_Instalacion_de_partes.pdf');
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
          this._Historial_de_Instalacion_de_partesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Historial_de_Instalacion_de_partess;
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
                    pdfMake.createPdf(documentDefinition).download('Historial_de_Instalacion_de_partes.pdf');
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
        'N° de serie': fields.N_de_serie,
        'Modelo ': fields.Modelo,
        'Posición': fields.Posicion,
        'Estatus': fields.Estatus_Tipos_de_Origen_del_Componente.Descripcion,
        'Horas acumuladas parte': fields.Horas_acumuladas_parte,
        'Ciclos acumulados parte': fields.Ciclos_acumulados_parte,
        'Fecha de fabricación': fields.Fecha_de_Fabricacion ? momentJS(fields.Fecha_de_Fabricacion).format('DD/MM/YYYY') : '',
        'Fecha de instalación': fields.Fecha_de_Instalacion ? momentJS(fields.Fecha_de_Instalacion).format('DD/MM/YYYY') : '',
        'Fecha reparación': fields.Fecha_Reparacion ? momentJS(fields.Fecha_Reparacion).format('DD/MM/YYYY') : '',
        'Usuario que realiza la instalación': fields.Usuario_que_realiza_la_instalacion_Spartan_User.Name,
        'Meses acumulados parte': fields.Meses_acumulados_parte,
        'Tipo de vencimiento': fields.Tipo_de_vencimiento_Catalogo_Tipo_de_Vencimiento.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Historial_de_Instalacion_de_partes  ${new Date().toLocaleString()}`);
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
      N_de_serie: x.N_de_serie,
      Modelo: x.Modelo,
      Posicion: x.Posicion,
      Estatus: x.Estatus_Tipos_de_Origen_del_Componente.Descripcion,
      Horas_acumuladas_parte: x.Horas_acumuladas_parte,
      Ciclos_acumulados_parte: x.Ciclos_acumulados_parte,
      Fecha_de_Fabricacion: x.Fecha_de_Fabricacion,
      Fecha_de_Instalacion: x.Fecha_de_Instalacion,
      Fecha_Reparacion: x.Fecha_Reparacion,
      Usuario_que_realiza_la_instalacion: x.Usuario_que_realiza_la_instalacion_Spartan_User.Name,
      Meses_acumulados_parte: x.Meses_acumulados_parte,
      Tipo_de_vencimiento: x.Tipo_de_vencimiento_Catalogo_Tipo_de_Vencimiento.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Historial_de_Instalacion_de_partes',  ['Folio'    ,'Descripcion'  ,'N_de_parte'  ,'N_de_serie'  ,'Modelo'  ,'Posicion'  ,'Estatus'  ,'Horas_acumuladas_parte'  ,'Ciclos_acumulados_parte'  ,'Fecha_de_Fabricacion'  ,'Fecha_de_Instalacion'  ,'Fecha_Reparacion'  ,'Usuario_que_realiza_la_instalacion'  ,'Meses_acumulados_parte'  ,'Tipo_de_vencimiento' ]);
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
    template += '          <th>N° de serie</th>';
    template += '          <th>Modelo </th>';
    template += '          <th>Posición</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Horas acumuladas parte</th>';
    template += '          <th>Ciclos acumulados parte</th>';
    template += '          <th>Fecha de fabricación</th>';
    template += '          <th>Fecha de instalación</th>';
    template += '          <th>Fecha reparación</th>';
    template += '          <th>Usuario que realiza la instalación</th>';
    template += '          <th>Meses acumulados parte</th>';
    template += '          <th>Tipo de vencimiento</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.N_de_parte + '</td>';
      template += '          <td>' + element.N_de_serie + '</td>';
      template += '          <td>' + element.Modelo + '</td>';
      template += '          <td>' + element.Posicion + '</td>';
      template += '          <td>' + element.Estatus_Tipos_de_Origen_del_Componente.Descripcion + '</td>';
      template += '          <td>' + element.Horas_acumuladas_parte + '</td>';
      template += '          <td>' + element.Ciclos_acumulados_parte + '</td>';
      template += '          <td>' + element.Fecha_de_Fabricacion + '</td>';
      template += '          <td>' + element.Fecha_de_Instalacion + '</td>';
      template += '          <td>' + element.Fecha_Reparacion + '</td>';
      template += '          <td>' + element.Usuario_que_realiza_la_instalacion_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Meses_acumulados_parte + '</td>';
      template += '          <td>' + element.Tipo_de_vencimiento_Catalogo_Tipo_de_Vencimiento.Descripcion + '</td>';
		  
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
	template += '\t N° de serie';
	template += '\t Modelo ';
	template += '\t Posición';
	template += '\t Estatus';
	template += '\t Horas acumuladas parte';
	template += '\t Ciclos acumulados parte';
	template += '\t Fecha de fabricación';
	template += '\t Fecha de instalación';
	template += '\t Fecha reparación';
	template += '\t Usuario que realiza la instalación';
	template += '\t Meses acumulados parte';
	template += '\t Tipo de vencimiento';

	template += '\n';

    data.forEach(element => {
      template =''
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Descripcion;
	  template += '\t ' + element.N_de_parte;
	  template += '\t ' + element.N_de_serie;
	  template += '\t ' + element.Modelo;
	  template += '\t ' + element.Posicion;
      template += '\t ' + element.Estatus_Tipos_de_Origen_del_Componente.Descripcion;
	  template += '\t ' + element.Horas_acumuladas_parte;
	  template += '\t ' + element.Ciclos_acumulados_parte;
	  template += '\t ' + element.Fecha_de_Fabricacion;
	  template += '\t ' + element.Fecha_de_Instalacion;
	  template += '\t ' + element.Fecha_Reparacion;
      template += '\t ' + element.Usuario_que_realiza_la_instalacion_Spartan_User.Name;
	  template += '\t ' + element.Meses_acumulados_parte;
      template += '\t ' + element.Tipo_de_vencimiento_Catalogo_Tipo_de_Vencimiento.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Historial_de_Instalacion_de_partesDataSource implements DataSource<Historial_de_Instalacion_de_partes>
{
  private subject = new BehaviorSubject<Historial_de_Instalacion_de_partes[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Historial_de_Instalacion_de_partesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Historial_de_Instalacion_de_partes[]> {
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
              const longest = result.Historial_de_Instalacion_de_partess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Historial_de_Instalacion_de_partess);
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
      condition += " and Historial_de_Instalacion_de_partes.Folio = " + data.filter.Folio;
    if (data.filter.Descripcion != "")
      condition += " and Historial_de_Instalacion_de_partes.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.N_de_parte != "")
      condition += " and Historial_de_Instalacion_de_partes.N_de_parte like '%" + data.filter.N_de_parte + "%' ";
    if (data.filter.N_de_serie != "")
      condition += " and Historial_de_Instalacion_de_partes.N_de_serie like '%" + data.filter.N_de_serie + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Historial_de_Instalacion_de_partes.Modelo like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Posicion != "")
      condition += " and Historial_de_Instalacion_de_partes.Posicion like '%" + data.filter.Posicion + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Tipos_de_Origen_del_Componente.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Horas_acumuladas_parte != "")
      condition += " and Historial_de_Instalacion_de_partes.Horas_acumuladas_parte = " + data.filter.Horas_acumuladas_parte;
    if (data.filter.Ciclos_acumulados_parte != "")
      condition += " and Historial_de_Instalacion_de_partes.Ciclos_acumulados_parte = " + data.filter.Ciclos_acumulados_parte;
    if (data.filter.Fecha_de_Fabricacion)
      condition += " and CONVERT(VARCHAR(10), Historial_de_Instalacion_de_partes.Fecha_de_Fabricacion, 102)  = '" + moment(data.filter.Fecha_de_Fabricacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_Instalacion)
      condition += " and CONVERT(VARCHAR(10), Historial_de_Instalacion_de_partes.Fecha_de_Instalacion, 102)  = '" + moment(data.filter.Fecha_de_Instalacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_Reparacion)
      condition += " and CONVERT(VARCHAR(10), Historial_de_Instalacion_de_partes.Fecha_Reparacion, 102)  = '" + moment(data.filter.Fecha_Reparacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Usuario_que_realiza_la_instalacion != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_realiza_la_instalacion + "%' ";
    if (data.filter.Meses_acumulados_parte != "")
      condition += " and Historial_de_Instalacion_de_partes.Meses_acumulados_parte = " + data.filter.Meses_acumulados_parte;
    if (data.filter.Tipo_de_vencimiento != "")
      condition += " and Catalogo_Tipo_de_Vencimiento.Descripcion like '%" + data.filter.Tipo_de_vencimiento + "%' ";

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
        sort = " Historial_de_Instalacion_de_partes.Folio " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Historial_de_Instalacion_de_partes.Descripcion " + data.sortDirecction;
        break;
      case "N_de_parte":
        sort = " Historial_de_Instalacion_de_partes.N_de_parte " + data.sortDirecction;
        break;
      case "N_de_serie":
        sort = " Historial_de_Instalacion_de_partes.N_de_serie " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Historial_de_Instalacion_de_partes.Modelo " + data.sortDirecction;
        break;
      case "Posicion":
        sort = " Historial_de_Instalacion_de_partes.Posicion " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Tipos_de_Origen_del_Componente.Descripcion " + data.sortDirecction;
        break;
      case "Horas_acumuladas_parte":
        sort = " Historial_de_Instalacion_de_partes.Horas_acumuladas_parte " + data.sortDirecction;
        break;
      case "Ciclos_acumulados_parte":
        sort = " Historial_de_Instalacion_de_partes.Ciclos_acumulados_parte " + data.sortDirecction;
        break;
      case "Fecha_de_Fabricacion":
        sort = " Historial_de_Instalacion_de_partes.Fecha_de_Fabricacion " + data.sortDirecction;
        break;
      case "Fecha_de_Instalacion":
        sort = " Historial_de_Instalacion_de_partes.Fecha_de_Instalacion " + data.sortDirecction;
        break;
      case "Fecha_Reparacion":
        sort = " Historial_de_Instalacion_de_partes.Fecha_Reparacion " + data.sortDirecction;
        break;
      case "Usuario_que_realiza_la_instalacion":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Meses_acumulados_parte":
        sort = " Historial_de_Instalacion_de_partes.Meses_acumulados_parte " + data.sortDirecction;
        break;
      case "Tipo_de_vencimiento":
        sort = " Catalogo_Tipo_de_Vencimiento.Descripcion " + data.sortDirecction;
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
        condition += " AND Historial_de_Instalacion_de_partes.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Historial_de_Instalacion_de_partes.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Instalacion_de_partes.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Instalacion_de_partes.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Instalacion_de_partes.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Instalacion_de_partes.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    switch (data.filterAdvanced.N_de_parteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Instalacion_de_partes.N_de_parte LIKE '" + data.filterAdvanced.N_de_parte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Instalacion_de_partes.N_de_parte LIKE '%" + data.filterAdvanced.N_de_parte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Instalacion_de_partes.N_de_parte LIKE '%" + data.filterAdvanced.N_de_parte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Instalacion_de_partes.N_de_parte = '" + data.filterAdvanced.N_de_parte + "'";
        break;
    }
    switch (data.filterAdvanced.N_de_serieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Instalacion_de_partes.N_de_serie LIKE '" + data.filterAdvanced.N_de_serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Instalacion_de_partes.N_de_serie LIKE '%" + data.filterAdvanced.N_de_serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Instalacion_de_partes.N_de_serie LIKE '%" + data.filterAdvanced.N_de_serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Instalacion_de_partes.N_de_serie = '" + data.filterAdvanced.N_de_serie + "'";
        break;
    }
    switch (data.filterAdvanced.ModeloFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Instalacion_de_partes.Modelo LIKE '" + data.filterAdvanced.Modelo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Instalacion_de_partes.Modelo LIKE '%" + data.filterAdvanced.Modelo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Instalacion_de_partes.Modelo LIKE '%" + data.filterAdvanced.Modelo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Instalacion_de_partes.Modelo = '" + data.filterAdvanced.Modelo + "'";
        break;
    }
    switch (data.filterAdvanced.PosicionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Historial_de_Instalacion_de_partes.Posicion LIKE '" + data.filterAdvanced.Posicion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Historial_de_Instalacion_de_partes.Posicion LIKE '%" + data.filterAdvanced.Posicion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Historial_de_Instalacion_de_partes.Posicion LIKE '%" + data.filterAdvanced.Posicion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Historial_de_Instalacion_de_partes.Posicion = '" + data.filterAdvanced.Posicion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipos_de_Origen_del_Componente.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipos_de_Origen_del_Componente.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipos_de_Origen_del_Componente.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipos_de_Origen_del_Componente.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Historial_de_Instalacion_de_partes.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.fromHoras_acumuladas_parte != 'undefined' && data.filterAdvanced.fromHoras_acumuladas_parte)
	|| (typeof data.filterAdvanced.toHoras_acumuladas_parte != 'undefined' && data.filterAdvanced.toHoras_acumuladas_parte)) 
	{
      if (typeof data.filterAdvanced.fromHoras_acumuladas_parte != 'undefined' && data.filterAdvanced.fromHoras_acumuladas_parte)
        condition += " AND Historial_de_Instalacion_de_partes.Horas_acumuladas_parte >= " + data.filterAdvanced.fromHoras_acumuladas_parte;

      if (typeof data.filterAdvanced.toHoras_acumuladas_parte != 'undefined' && data.filterAdvanced.toHoras_acumuladas_parte) 
        condition += " AND Historial_de_Instalacion_de_partes.Horas_acumuladas_parte <= " + data.filterAdvanced.toHoras_acumuladas_parte;
    }
    if ((typeof data.filterAdvanced.fromCiclos_acumulados_parte != 'undefined' && data.filterAdvanced.fromCiclos_acumulados_parte)
	|| (typeof data.filterAdvanced.toCiclos_acumulados_parte != 'undefined' && data.filterAdvanced.toCiclos_acumulados_parte)) 
	{
      if (typeof data.filterAdvanced.fromCiclos_acumulados_parte != 'undefined' && data.filterAdvanced.fromCiclos_acumulados_parte)
        condition += " AND Historial_de_Instalacion_de_partes.Ciclos_acumulados_parte >= " + data.filterAdvanced.fromCiclos_acumulados_parte;

      if (typeof data.filterAdvanced.toCiclos_acumulados_parte != 'undefined' && data.filterAdvanced.toCiclos_acumulados_parte) 
        condition += " AND Historial_de_Instalacion_de_partes.Ciclos_acumulados_parte <= " + data.filterAdvanced.toCiclos_acumulados_parte;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Fabricacion != 'undefined' && data.filterAdvanced.fromFecha_de_Fabricacion)
	|| (typeof data.filterAdvanced.toFecha_de_Fabricacion != 'undefined' && data.filterAdvanced.toFecha_de_Fabricacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Fabricacion != 'undefined' && data.filterAdvanced.fromFecha_de_Fabricacion) 
        condition += " and CONVERT(VARCHAR(10), Historial_de_Instalacion_de_partes.Fecha_de_Fabricacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Fabricacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Fabricacion != 'undefined' && data.filterAdvanced.toFecha_de_Fabricacion) 
        condition += " and CONVERT(VARCHAR(10), Historial_de_Instalacion_de_partes.Fecha_de_Fabricacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Fabricacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Instalacion != 'undefined' && data.filterAdvanced.fromFecha_de_Instalacion)
	|| (typeof data.filterAdvanced.toFecha_de_Instalacion != 'undefined' && data.filterAdvanced.toFecha_de_Instalacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Instalacion != 'undefined' && data.filterAdvanced.fromFecha_de_Instalacion) 
        condition += " and CONVERT(VARCHAR(10), Historial_de_Instalacion_de_partes.Fecha_de_Instalacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Instalacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Instalacion != 'undefined' && data.filterAdvanced.toFecha_de_Instalacion) 
        condition += " and CONVERT(VARCHAR(10), Historial_de_Instalacion_de_partes.Fecha_de_Instalacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Instalacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_Reparacion != 'undefined' && data.filterAdvanced.fromFecha_Reparacion)
	|| (typeof data.filterAdvanced.toFecha_Reparacion != 'undefined' && data.filterAdvanced.toFecha_Reparacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Reparacion != 'undefined' && data.filterAdvanced.fromFecha_Reparacion) 
        condition += " and CONVERT(VARCHAR(10), Historial_de_Instalacion_de_partes.Fecha_Reparacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Reparacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Reparacion != 'undefined' && data.filterAdvanced.toFecha_Reparacion) 
        condition += " and CONVERT(VARCHAR(10), Historial_de_Instalacion_de_partes.Fecha_Reparacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_Reparacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_realiza_la_instalacion != 'undefined' && data.filterAdvanced.Usuario_que_realiza_la_instalacion)) {
      switch (data.filterAdvanced.Usuario_que_realiza_la_instalacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_que_realiza_la_instalacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_realiza_la_instalacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_realiza_la_instalacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_que_realiza_la_instalacion + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_realiza_la_instalacionMultiple != null && data.filterAdvanced.Usuario_que_realiza_la_instalacionMultiple.length > 0) {
      var Usuario_que_realiza_la_instalacionds = data.filterAdvanced.Usuario_que_realiza_la_instalacionMultiple.join(",");
      condition += " AND Historial_de_Instalacion_de_partes.Usuario_que_realiza_la_instalacion In (" + Usuario_que_realiza_la_instalacionds + ")";
    }
    if ((typeof data.filterAdvanced.fromMeses_acumulados_parte != 'undefined' && data.filterAdvanced.fromMeses_acumulados_parte)
	|| (typeof data.filterAdvanced.toMeses_acumulados_parte != 'undefined' && data.filterAdvanced.toMeses_acumulados_parte)) 
	{
      if (typeof data.filterAdvanced.fromMeses_acumulados_parte != 'undefined' && data.filterAdvanced.fromMeses_acumulados_parte)
        condition += " AND Historial_de_Instalacion_de_partes.Meses_acumulados_parte >= " + data.filterAdvanced.fromMeses_acumulados_parte;

      if (typeof data.filterAdvanced.toMeses_acumulados_parte != 'undefined' && data.filterAdvanced.toMeses_acumulados_parte) 
        condition += " AND Historial_de_Instalacion_de_partes.Meses_acumulados_parte <= " + data.filterAdvanced.toMeses_acumulados_parte;
    }
    if ((typeof data.filterAdvanced.Tipo_de_vencimiento != 'undefined' && data.filterAdvanced.Tipo_de_vencimiento)) {
      switch (data.filterAdvanced.Tipo_de_vencimientoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Catalogo_Tipo_de_Vencimiento.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_vencimiento + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Catalogo_Tipo_de_Vencimiento.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_vencimiento + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Catalogo_Tipo_de_Vencimiento.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_vencimiento + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Catalogo_Tipo_de_Vencimiento.Descripcion = '" + data.filterAdvanced.Tipo_de_vencimiento + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_vencimientoMultiple != null && data.filterAdvanced.Tipo_de_vencimientoMultiple.length > 0) {
      var Tipo_de_vencimientods = data.filterAdvanced.Tipo_de_vencimientoMultiple.join(",");
      condition += " AND Historial_de_Instalacion_de_partes.Tipo_de_vencimiento In (" + Tipo_de_vencimientods + ")";
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
              const longest = result.Historial_de_Instalacion_de_partess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Historial_de_Instalacion_de_partess);
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
