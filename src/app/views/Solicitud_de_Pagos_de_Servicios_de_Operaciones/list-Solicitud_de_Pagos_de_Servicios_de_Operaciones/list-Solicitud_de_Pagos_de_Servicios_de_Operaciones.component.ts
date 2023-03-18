import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Solicitud_de_Pagos_de_Servicios_de_OperacionesService } from "src/app/api-services/Solicitud_de_Pagos_de_Servicios_de_Operaciones.service";
import { Solicitud_de_Pagos_de_Servicios_de_Operaciones } from "src/app/models/Solicitud_de_Pagos_de_Servicios_de_Operaciones";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2 } from "@angular/core";
import { CollectionViewer } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of } from "rxjs";
import { catchError, finalize, concatMap, switchMap, mergeMap, tap } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import { MatDialog } from "@angular/material/dialog";
import * as AppConstants from "../../../app-constants";
import { StorageKeys } from "../../../app-constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { Solicitud_de_Pagos_de_Servicios_de_OperacionesIndexRules } from 'src/app/shared/businessRules/Solicitud_de_Pagos_de_Servicios_de_Operaciones-index-rules';
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
  selector: "app-list-Solicitud_de_Pagos_de_Servicios_de_Operaciones",
  templateUrl: "./list-Solicitud_de_Pagos_de_Servicios_de_Operaciones.component.html",
  styleUrls: ["./list-Solicitud_de_Pagos_de_Servicios_de_Operaciones.component.scss"],
})
export class ListSolicitud_de_Pagos_de_Servicios_de_OperacionesComponent extends Solicitud_de_Pagos_de_Servicios_de_OperacionesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Proveedor",
    "No__de_Vuelo",
    "Aeropuerto",
    "Estatus",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Proveedor",
      "No__de_Vuelo",
      "Aeropuerto",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Proveedor_filtro",
      "No__de_Vuelo_filtro",
      "Aeropuerto_filtro",
      "Estatus_filtro",

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
      Proveedor: "",
      No__de_Vuelo: "",
      Aeropuerto: "",
      Estatus: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      No__de_VueloFilter: "",
      No__de_Vuelo: "",
      No__de_VueloMultiple: "",
      AeropuertoFilter: "",
      Aeropuerto: "",
      AeropuertoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

    }
  };

  dataSource: Solicitud_de_Pagos_de_Servicios_de_OperacionesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Solicitud_de_Pagos_de_Servicios_de_OperacionesDataSource;
  dataClipboard: any;

  constructor(
    private _Solicitud_de_Pagos_de_Servicios_de_OperacionesService: Solicitud_de_Pagos_de_Servicios_de_OperacionesService,
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
    private route: Router,
    renderer: Renderer2
  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

  }

  ngOnInit() {
    this.rulesBeforeCreationList();
    this.dataSource = new Solicitud_de_Pagos_de_Servicios_de_OperacionesDataSource(
      this._Solicitud_de_Pagos_de_Servicios_de_OperacionesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_Pagos_de_Servicios_de_Operaciones)
      .subscribe((response) => {
        this.permisos = response;
      });
    this.route.navigate(['/Solicitud_de_Pagos_de_Servicios_de_Operaciones/add']);

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
    this.listConfig.filter.Proveedor = "";
    this.listConfig.filter.No__de_Vuelo = "";
    this.listConfig.filter.Aeropuerto = "";
    this.listConfig.filter.Estatus = "";

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

  remove(row: Solicitud_de_Pagos_de_Servicios_de_Operaciones) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Solicitud_de_Pagos_de_Servicios_de_OperacionesService
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
  ActionPrint(dataRow: Solicitud_de_Pagos_de_Servicios_de_Operaciones) {

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
      , 'Proveedor'
      , 'No. de Vuelo'
      , 'Aeropuerto'
      , 'Estatus'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.Proveedor_Creacion_de_Proveedores.Razon_social
        , x.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
        , x.Aeropuerto_Aeropuertos.Nombre
        , x.Estatus_Estatus_de_Seguimiento.Descripcion

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
    pdfMake.createPdf(pdfDefinition).download('Solicitud_de_Pagos_de_Servicios_de_Operaciones.pdf');
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
        buttonLabel = "Copiar";
        break;
      case 2: title = "Exportar Excel"; buttonLabel = "Exportar"; break;
      case 3: title = "Exportar CSV"; buttonLabel = "Exportar"; break;
      case 4: title = "Exportar PDF"; buttonLabel = "Exportar"; break;
      case 5: title = "Imprimir"; buttonLabel = "Imprimir"; break;
    }


    this.dialogo
      .open(DialogConfirmExportComponent, {
        data: {
          mensaje: `Seleccione una opción`,
          titulo: title,
          buttonLabel: buttonLabel
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
          this._Solicitud_de_Pagos_de_Servicios_de_OperacionesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_Pagos_de_Servicios_de_Operacioness;
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
          this._Solicitud_de_Pagos_de_Servicios_de_OperacionesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_Pagos_de_Servicios_de_Operacioness;
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
        'Proveedor ': fields.Proveedor_Creacion_de_Proveedores.Razon_social,
        'No. de Vuelo ': fields.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Aeropuerto ': fields.Aeropuerto_Aeropuertos.Nombre,
        'Estatus ': fields.Estatus_Estatus_de_Seguimiento.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Solicitud_de_Pagos_de_Servicios_de_Operaciones  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Proveedor: x.Proveedor_Creacion_de_Proveedores.Razon_social,
      No__de_Vuelo: x.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Aeropuerto: x.Aeropuerto_Aeropuertos.Nombre,
      Estatus: x.Estatus_Estatus_de_Seguimiento.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Solicitud_de_Pagos_de_Servicios_de_Operaciones', ['Folio', 'Proveedor', 'No__de_Vuelo', 'Aeropuerto', 'Estatus']);
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
    template += '          <th>Proveedor</th>';
    template += '          <th>No. de Vuelo</th>';
    template += '          <th>Aeropuerto</th>';
    template += '          <th>Estatus</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Aeropuerto_Aeropuertos.Nombre + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Seguimiento.Descripcion + '</td>';

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
    template += '\t Proveedor';
    template += '\t No. de Vuelo';
    template += '\t Aeropuerto';
    template += '\t Estatus';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.Proveedor_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Aeropuerto_Aeropuertos.Nombre;
      template += '\t ' + element.Estatus_Estatus_de_Seguimiento.Descripcion;

      template += '\n';
    });

    return template;
  }

}

export class Solicitud_de_Pagos_de_Servicios_de_OperacionesDataSource implements DataSource<Solicitud_de_Pagos_de_Servicios_de_Operaciones>
{
  private subject = new BehaviorSubject<Solicitud_de_Pagos_de_Servicios_de_Operaciones[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Solicitud_de_Pagos_de_Servicios_de_OperacionesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Solicitud_de_Pagos_de_Servicios_de_Operaciones[]> {
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
    if (data.MRWhere.length > 0) {
      if (condition != null && condition.length > 0) {
        condition = condition + " AND " + data.MRWhere;
      }
      if (condition == null || condition.length == 0) {
        condition = data.MRWhere;
      }
    }

    if (data.MRSort.length > 0) {
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
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Solicitud_de_Pagos_de_Servicios_de_Operacioness.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_Pagos_de_Servicios_de_Operacioness);
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
      condition += " and Solicitud_de_Pagos_de_Servicios_de_Operaciones.Folio = " + data.filter.Folio;
    if (data.filter.Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor + "%' ";
    if (data.filter.No__de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.No__de_Vuelo + "%' ";
    if (data.filter.Aeropuerto != "")
      condition += " and Aeropuertos.Nombre like '%" + data.filter.Aeropuerto + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Seguimiento.Descripcion like '%" + data.filter.Estatus + "%' ";

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
        sort = " Solicitud_de_Pagos_de_Servicios_de_Operaciones.Folio " + data.sortDirecction;
        break;
      case "Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "No__de_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Aeropuerto":
        sort = " Aeropuertos.Nombre " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Seguimiento.Descripcion " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
      || (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)) {
      if (typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
        condition += " AND Solicitud_de_Pagos_de_Servicios_de_Operaciones.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Solicitud_de_Pagos_de_Servicios_de_Operaciones.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Proveedor != 'undefined' && data.filterAdvanced.Proveedor)) {
      switch (data.filterAdvanced.ProveedorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.Proveedor + "'";
          break;
      }
    } else if (data.filterAdvanced.ProveedorMultiple != null && data.filterAdvanced.ProveedorMultiple.length > 0) {
      var Proveedords = data.filterAdvanced.ProveedorMultiple.join(",");
      condition += " AND Solicitud_de_Pagos_de_Servicios_de_Operaciones.Proveedor In (" + Proveedords + ")";
    }
    if ((typeof data.filterAdvanced.No__de_Vuelo != 'undefined' && data.filterAdvanced.No__de_Vuelo)) {
      switch (data.filterAdvanced.No__de_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.No__de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No__de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No__de_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.No__de_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.No__de_VueloMultiple != null && data.filterAdvanced.No__de_VueloMultiple.length > 0) {
      var No__de_Vuelods = data.filterAdvanced.No__de_VueloMultiple.join(",");
      condition += " AND Solicitud_de_Pagos_de_Servicios_de_Operaciones.No__de_Vuelo In (" + No__de_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Aeropuerto != 'undefined' && data.filterAdvanced.Aeropuerto)) {
      switch (data.filterAdvanced.AeropuertoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Nombre LIKE '" + data.filterAdvanced.Aeropuerto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Nombre = '" + data.filterAdvanced.Aeropuerto + "'";
          break;
      }
    } else if (data.filterAdvanced.AeropuertoMultiple != null && data.filterAdvanced.AeropuertoMultiple.length > 0) {
      var Aeropuertods = data.filterAdvanced.AeropuertoMultiple.join(",");
      condition += " AND Solicitud_de_Pagos_de_Servicios_de_Operaciones.Aeropuerto In (" + Aeropuertods + ")";
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Seguimiento.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Seguimiento.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Seguimiento.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Seguimiento.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Solicitud_de_Pagos_de_Servicios_de_Operaciones.Estatus In (" + Estatusds + ")";
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
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Solicitud_de_Pagos_de_Servicios_de_Operacioness.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_Pagos_de_Servicios_de_Operacioness);
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
