import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Discrepancias_Pendientes_SalidaService } from "src/app/api-services/Discrepancias_Pendientes_Salida.service";
import { Discrepancias_Pendientes_Salida } from "src/app/models/Discrepancias_Pendientes_Salida";
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
import { Discrepancias_Pendientes_SalidaIndexRules } from 'src/app/shared/businessRules/Discrepancias_Pendientes_Salida-index-rules';
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
  selector: "app-list-Discrepancias_Pendientes_Salida",
  templateUrl: "./list-Discrepancias_Pendientes_Salida.component.html",
  styleUrls: ["./list-Discrepancias_Pendientes_Salida.component.scss"],
})
export class ListDiscrepancias_Pendientes_SalidaComponent extends Discrepancias_Pendientes_SalidaIndexRules implements OnInit, AfterViewInit, AfterViewChecked {

  displayedColumns = [
    "acciones",
    "Folio",
    "Item",
    "Id_Reporte",
    "Codigo_Computarizado",
    "Codigo_ATA",
    "Respuesta",
    "Asignado_a",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Item",
      "Id_Reporte",
      "Codigo_Computarizado",
      "Codigo_ATA",
      "Respuesta",
      "Asignado_a",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Item_filtro",
      "Id_Reporte_filtro",
      "Codigo_Computarizado_filtro",
      "Codigo_ATA_filtro",
      "Respuesta_filtro",
      "Asignado_a_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Item: "",
      Id_Reporte: "",
      Codigo_Computarizado: "",
      Codigo_ATA: "",
      Respuesta: "",
      Asignado_a: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ItemFilter: "",
      Item: "",
      ItemMultiple: "",
      fromId_Reporte: "",
      toId_Reporte: "",
      Codigo_ComputarizadoFilter: "",
      Codigo_Computarizado: "",
      Codigo_ComputarizadoMultiple: "",
      Codigo_ATAFilter: "",
      Codigo_ATA: "",
      Codigo_ATAMultiple: "",
      Asignado_aFilter: "",
      Asignado_a: "",
      Asignado_aMultiple: "",

    }
  };

  dataSource: Discrepancias_Pendientes_SalidaDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Discrepancias_Pendientes_SalidaDataSource;
  dataClipboard: any;

  constructor(
    private _Discrepancias_Pendientes_SalidaService: Discrepancias_Pendientes_SalidaService,
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
    this.dataSource = new Discrepancias_Pendientes_SalidaDataSource(
      this._Discrepancias_Pendientes_SalidaService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Discrepancias_Pendientes_Salida)
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
    this.listConfig.filter.Item = "";
    this.listConfig.filter.Id_Reporte = "";
    this.listConfig.filter.Codigo_Computarizado = "";
    this.listConfig.filter.Codigo_ATA = "";
    this.listConfig.filter.Respuesta = "";
    this.listConfig.filter.Asignado_a = "";

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

  remove(row: Discrepancias_Pendientes_Salida) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Discrepancias_Pendientes_SalidaService
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
  ActionPrint(dataRow: Discrepancias_Pendientes_Salida) {

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
          this._Discrepancias_Pendientes_SalidaService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Discrepancias_Pendientes_Salidas;
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
                    pdfMake.createPdf(documentDefinition).download('Discrepancias_Pendientes_Salida.pdf');
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
          this._Discrepancias_Pendientes_SalidaService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Discrepancias_Pendientes_Salidas;
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
                    pdfMake.createPdf(documentDefinition).download('Discrepancias_Pendientes_Salida.pdf');
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
        'Item': fields.Item_Items.Descripcion,
        'Reporte': fields.Id_Reporte,
        'Código Computarizado': fields.Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda,
        'Código ATA': fields.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
        'Respuesta': fields.Respuesta,
        'Asignado a': fields.Asignado_a_Spartan_User.Name,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Discrepancias_Pendientes_Salida  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Item: x.Item_Items.Descripcion,
      Id_Reporte: x.Id_Reporte,
      Codigo_Computarizado: x.Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda,
      Codigo_ATA: x.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
      Respuesta: x.Respuesta,
      Asignado_a: x.Asignado_a_Spartan_User.Name,

    }));

    this.excelService.exportToCsv(result, 'Discrepancias_Pendientes_Salida',  ['Folio'    ,'Item'  ,'Id_Reporte'  ,'Codigo_Computarizado'  ,'Codigo_ATA'  ,'Respuesta'  ,'Asignado_a' ]);
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
    template += '          <th>Item</th>';
    template += '          <th>Reporte</th>';
    template += '          <th>Código Computarizado</th>';
    template += '          <th>Código ATA</th>';
    template += '          <th>Respuesta</th>';
    template += '          <th>Asignado a</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Item_Items.Descripcion + '</td>';
      template += '          <td>' + element.Id_Reporte + '</td>';
      template += '          <td>' + element.Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda + '</td>';
      template += '          <td>' + element.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion + '</td>';
      template += '          <td>' + element.Respuesta + '</td>';
      template += '          <td>' + element.Asignado_a_Spartan_User.Name + '</td>';
		  
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
	template += '\t Item';
	template += '\t Reporte';
	template += '\t Código Computarizado';
	template += '\t Código ATA';
	template += '\t Respuesta';
	template += '\t Asignado a';

	template += '\n';

    data.forEach(element => {
      template =''
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Item_Items.Descripcion;
	  template += '\t ' + element.Id_Reporte;
      template += '\t ' + element.Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda;
      template += '\t ' + element.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion;
	  template += '\t ' + element.Respuesta;
      template += '\t ' + element.Asignado_a_Spartan_User.Name;

	  template += '\n';
    });

    return template;
  }

}

export class Discrepancias_Pendientes_SalidaDataSource implements DataSource<Discrepancias_Pendientes_Salida>
{
  private subject = new BehaviorSubject<Discrepancias_Pendientes_Salida[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Discrepancias_Pendientes_SalidaService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Discrepancias_Pendientes_Salida[]> {
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
              const longest = result.Discrepancias_Pendientes_Salidas.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Discrepancias_Pendientes_Salidas);
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
      condition += " and Discrepancias_Pendientes_Salida.Folio = " + data.filter.Folio;
    if (data.filter.Item != "")
      condition += " and Items.Descripcion like '%" + data.filter.Item + "%' ";
    if (data.filter.Id_Reporte != "")
      condition += " and Discrepancias_Pendientes_Salida.Id_Reporte = " + data.filter.Id_Reporte;
    if (data.filter.Codigo_Computarizado != "")
      condition += " and Codigo_Computarizado.Descripcion_Busqueda like '%" + data.filter.Codigo_Computarizado + "%' ";
    if (data.filter.Codigo_ATA != "")
      condition += " and Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + data.filter.Codigo_ATA + "%' ";
    if (data.filter.Respuesta != "")
      condition += " and Discrepancias_Pendientes_Salida.Respuesta like '%" + data.filter.Respuesta + "%' ";
    if (data.filter.Asignado_a != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Asignado_a + "%' ";

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
        sort = " Discrepancias_Pendientes_Salida.Folio " + data.sortDirecction;
        break;
      case "Item":
        sort = " Items.Descripcion " + data.sortDirecction;
        break;
      case "Id_Reporte":
        sort = " Discrepancias_Pendientes_Salida.Id_Reporte " + data.sortDirecction;
        break;
      case "Codigo_Computarizado":
        sort = " Codigo_Computarizado.Descripcion_Busqueda " + data.sortDirecction;
        break;
      case "Codigo_ATA":
        sort = " Catalogo_codigo_ATA.Codigo_ATA_Descripcion " + data.sortDirecction;
        break;
      case "Respuesta":
        sort = " Discrepancias_Pendientes_Salida.Respuesta " + data.sortDirecction;
        break;
      case "Asignado_a":
        sort = " Spartan_User.Name " + data.sortDirecction;
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
        condition += " AND Discrepancias_Pendientes_Salida.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Discrepancias_Pendientes_Salida.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Item != 'undefined' && data.filterAdvanced.Item)) {
      switch (data.filterAdvanced.ItemFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Items.Descripcion LIKE '" + data.filterAdvanced.Item + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Items.Descripcion LIKE '%" + data.filterAdvanced.Item + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Items.Descripcion LIKE '%" + data.filterAdvanced.Item + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Items.Descripcion = '" + data.filterAdvanced.Item + "'";
          break;
      }
    } else if (data.filterAdvanced.ItemMultiple != null && data.filterAdvanced.ItemMultiple.length > 0) {
      var Itemds = data.filterAdvanced.ItemMultiple.join(",");
      condition += " AND Discrepancias_Pendientes_Salida.Item In (" + Itemds + ")";
    }
    if ((typeof data.filterAdvanced.fromId_Reporte != 'undefined' && data.filterAdvanced.fromId_Reporte)
	|| (typeof data.filterAdvanced.toId_Reporte != 'undefined' && data.filterAdvanced.toId_Reporte)) 
	{
      if (typeof data.filterAdvanced.fromId_Reporte != 'undefined' && data.filterAdvanced.fromId_Reporte)
        condition += " AND Discrepancias_Pendientes_Salida.Id_Reporte >= " + data.filterAdvanced.fromId_Reporte;

      if (typeof data.filterAdvanced.toId_Reporte != 'undefined' && data.filterAdvanced.toId_Reporte) 
        condition += " AND Discrepancias_Pendientes_Salida.Id_Reporte <= " + data.filterAdvanced.toId_Reporte;
    }
    if ((typeof data.filterAdvanced.Codigo_Computarizado != 'undefined' && data.filterAdvanced.Codigo_Computarizado)) {
      switch (data.filterAdvanced.Codigo_ComputarizadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '" + data.filterAdvanced.Codigo_Computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Codigo_Computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Codigo_Computarizado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Codigo_Computarizado.Descripcion_Busqueda = '" + data.filterAdvanced.Codigo_Computarizado + "'";
          break;
      }
    } else if (data.filterAdvanced.Codigo_ComputarizadoMultiple != null && data.filterAdvanced.Codigo_ComputarizadoMultiple.length > 0) {
      var Codigo_Computarizadods = data.filterAdvanced.Codigo_ComputarizadoMultiple.join(",");
      condition += " AND Discrepancias_Pendientes_Salida.Codigo_Computarizado In (" + Codigo_Computarizadods + ")";
    }
    if ((typeof data.filterAdvanced.Codigo_ATA != 'undefined' && data.filterAdvanced.Codigo_ATA)) {
      switch (data.filterAdvanced.Codigo_ATAFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '" + data.filterAdvanced.Codigo_ATA + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '%" + data.filterAdvanced.Codigo_ATA + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '%" + data.filterAdvanced.Codigo_ATA + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion = '" + data.filterAdvanced.Codigo_ATA + "'";
          break;
      }
    } else if (data.filterAdvanced.Codigo_ATAMultiple != null && data.filterAdvanced.Codigo_ATAMultiple.length > 0) {
      var Codigo_ATAds = data.filterAdvanced.Codigo_ATAMultiple.join(",");
      condition += " AND Discrepancias_Pendientes_Salida.Codigo_ATA In (" + Codigo_ATAds + ")";
    }
    switch (data.filterAdvanced.RespuestaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Discrepancias_Pendientes_Salida.Respuesta LIKE '" + data.filterAdvanced.Respuesta + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Discrepancias_Pendientes_Salida.Respuesta LIKE '%" + data.filterAdvanced.Respuesta + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Discrepancias_Pendientes_Salida.Respuesta LIKE '%" + data.filterAdvanced.Respuesta + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Discrepancias_Pendientes_Salida.Respuesta = '" + data.filterAdvanced.Respuesta + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Asignado_a != 'undefined' && data.filterAdvanced.Asignado_a)) {
      switch (data.filterAdvanced.Asignado_aFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Asignado_a + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Asignado_a + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Asignado_a + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Asignado_a + "'";
          break;
      }
    } else if (data.filterAdvanced.Asignado_aMultiple != null && data.filterAdvanced.Asignado_aMultiple.length > 0) {
      var Asignado_ads = data.filterAdvanced.Asignado_aMultiple.join(",");
      condition += " AND Discrepancias_Pendientes_Salida.Asignado_a In (" + Asignado_ads + ")";
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
              const longest = result.Discrepancias_Pendientes_Salidas.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Discrepancias_Pendientes_Salidas);
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
