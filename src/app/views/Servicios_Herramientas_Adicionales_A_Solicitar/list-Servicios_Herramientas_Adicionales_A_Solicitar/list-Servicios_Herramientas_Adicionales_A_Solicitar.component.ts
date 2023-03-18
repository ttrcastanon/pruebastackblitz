import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Servicios_Herramientas_Adicionales_A_SolicitarService } from "src/app/api-services/Servicios_Herramientas_Adicionales_A_Solicitar.service";
import { Servicios_Herramientas_Adicionales_A_Solicitar } from "src/app/models/Servicios_Herramientas_Adicionales_A_Solicitar";
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
import { Servicios_Herramientas_Adicionales_A_SolicitarIndexRules } from 'src/app/shared/businessRules/Servicios_Herramientas_Adicionales_A_Solicitar-index-rules';
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
  selector: "app-list-Servicios_Herramientas_Adicionales_A_Solicitar",
  templateUrl: "./list-Servicios_Herramientas_Adicionales_A_Solicitar.component.html",
  styleUrls: ["./list-Servicios_Herramientas_Adicionales_A_Solicitar.component.scss"],
})
export class ListServicios_Herramientas_Adicionales_A_SolicitarComponent extends Servicios_Herramientas_Adicionales_A_SolicitarIndexRules implements OnInit, AfterViewInit, AfterViewChecked {

  displayedColumns = [
    "acciones",
    "Folio",
    "Codigo_del_servicio",
    "Descripcion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Codigo_del_servicio",
      "Descripcion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_del_servicio_filtro",
      "Descripcion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Codigo_del_servicio: "",
      Descripcion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",

    }
  };

  dataSource: Servicios_Herramientas_Adicionales_A_SolicitarDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Servicios_Herramientas_Adicionales_A_SolicitarDataSource;
  dataClipboard: any;

  constructor(
    private _Servicios_Herramientas_Adicionales_A_SolicitarService: Servicios_Herramientas_Adicionales_A_SolicitarService,
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
    this.dataSource = new Servicios_Herramientas_Adicionales_A_SolicitarDataSource(
      this._Servicios_Herramientas_Adicionales_A_SolicitarService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Servicios_Herramientas_Adicionales_A_Solicitar)
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
    this.listConfig.filter.Codigo_del_servicio = "";
    this.listConfig.filter.Descripcion = "";

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

  remove(row: Servicios_Herramientas_Adicionales_A_Solicitar) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Servicios_Herramientas_Adicionales_A_SolicitarService
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
  ActionPrint(dataRow: Servicios_Herramientas_Adicionales_A_Solicitar) {

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
          this._Servicios_Herramientas_Adicionales_A_SolicitarService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Servicios_Herramientas_Adicionales_A_Solicitars;
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
                    pdfMake.createPdf(documentDefinition).download('Servicios_Herramientas_Adicionales_A_Solicitar.pdf');
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
          this._Servicios_Herramientas_Adicionales_A_SolicitarService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Servicios_Herramientas_Adicionales_A_Solicitars;
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
                    pdfMake.createPdf(documentDefinition).download('Servicios_Herramientas_Adicionales_A_Solicitar.pdf');
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
        'Código del servicio': fields.Codigo_del_servicio,
        'Descripción': fields.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Servicios_Herramientas_Adicionales_A_Solicitar  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Codigo_del_servicio: x.Codigo_del_servicio,
      Descripcion: x.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Servicios_Herramientas_Adicionales_A_Solicitar',  ['Folio'    ,'Codigo_del_servicio'  ,'Descripcion' ]);
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
    template += '          <th>Código del servicio</th>';
    template += '          <th>Descripción</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Codigo_del_servicio + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
		  
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
	template += '\t Código del servicio';
	template += '\t Descripción';

	template += '\n';

    data.forEach(element => {
      template =''
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Codigo_del_servicio;
	  template += '\t ' + element.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Servicios_Herramientas_Adicionales_A_SolicitarDataSource implements DataSource<Servicios_Herramientas_Adicionales_A_Solicitar>
{
  private subject = new BehaviorSubject<Servicios_Herramientas_Adicionales_A_Solicitar[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Servicios_Herramientas_Adicionales_A_SolicitarService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Servicios_Herramientas_Adicionales_A_Solicitar[]> {
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
              const longest = result.Servicios_Herramientas_Adicionales_A_Solicitars.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Servicios_Herramientas_Adicionales_A_Solicitars);
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
      condition += " and Servicios_Herramientas_Adicionales_A_Solicitar.Folio = " + data.filter.Folio;
    if (data.filter.Codigo_del_servicio != "")
      condition += " and Servicios_Herramientas_Adicionales_A_Solicitar.Codigo_del_servicio like '%" + data.filter.Codigo_del_servicio + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Servicios_Herramientas_Adicionales_A_Solicitar.Descripcion like '%" + data.filter.Descripcion + "%' ";

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
        sort = " Servicios_Herramientas_Adicionales_A_Solicitar.Folio " + data.sortDirecction;
        break;
      case "Codigo_del_servicio":
        sort = " Servicios_Herramientas_Adicionales_A_Solicitar.Codigo_del_servicio " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Servicios_Herramientas_Adicionales_A_Solicitar.Descripcion " + data.sortDirecction;
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
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.Codigo_del_servicioFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Codigo_del_servicio LIKE '" + data.filterAdvanced.Codigo_del_servicio + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Codigo_del_servicio LIKE '%" + data.filterAdvanced.Codigo_del_servicio + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Codigo_del_servicio LIKE '%" + data.filterAdvanced.Codigo_del_servicio + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Codigo_del_servicio = '" + data.filterAdvanced.Codigo_del_servicio + "'";
        break;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Servicios_Herramientas_Adicionales_A_Solicitar.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
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
              const longest = result.Servicios_Herramientas_Adicionales_A_Solicitars.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Servicios_Herramientas_Adicionales_A_Solicitars);
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
