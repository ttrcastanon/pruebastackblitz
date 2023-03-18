import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Solicitud_de_Servicios_para_OperacionesService } from "src/app/api-services/Solicitud_de_Servicios_para_Operaciones.service";
import { Solicitud_de_Servicios_para_Operaciones } from "src/app/models/Solicitud_de_Servicios_para_Operaciones";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2 } from "@angular/core";
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
import { Solicitud_de_Servicios_para_OperacionesIndexRules } from 'src/app/shared/businessRules/Solicitud_de_Servicios_para_Operaciones-index-rules';
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
  selector: "app-list-Solicitud_de_Servicios_para_Operaciones",
  templateUrl: "./list-Solicitud_de_Servicios_para_Operaciones.component.html",
  styleUrls: ["./list-Solicitud_de_Servicios_para_Operaciones.component.scss"],
})
export class ListSolicitud_de_Servicios_para_OperacionesComponent extends Solicitud_de_Servicios_para_OperacionesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "No_de_Solicitud",
    "Fecha_de_Registro",
    "Hora_de_Registro",
    "Usuario_que_Registra",
    "Proveedor",
    "No__de_Vuelo",
    "Tramo",
    "Observaciones",
    "Estatus",
    "Tipo",
    "No_Solicitud",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "No_de_Solicitud",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Proveedor",
      "No__de_Vuelo",
      "Tramo",
      "Observaciones",
      "Estatus",
      "Tipo",
      "No_Solicitud",

    ],
    columns_filters: [
      "acciones_filtro",
      "No_de_Solicitud_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Proveedor_filtro",
      "No__de_Vuelo_filtro",
      "Tramo_filtro",
      "Observaciones_filtro",
      "Estatus_filtro",
      "Tipo_filtro",
      "No_Solicitud_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      No_de_Solicitud: "",
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Proveedor: "",
      No__de_Vuelo: "",
      Tramo: "",
      Observaciones: "",
      Estatus: "",
      Tipo: "",
      No_Solicitud: "",

    },
    filterAdvanced: {
      fromNo_de_Solicitud: "",
      toNo_de_Solicitud: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      No__de_VueloFilter: "",
      No__de_Vuelo: "",
      No__de_VueloMultiple: "",
      TramoFilter: "",
      Tramo: "",
      TramoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",

    }
  };

  dataSource: Solicitud_de_Servicios_para_OperacionesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Solicitud_de_Servicios_para_OperacionesDataSource;
  dataClipboard: any;

  constructor(
    private _Solicitud_de_Servicios_para_OperacionesService: Solicitud_de_Servicios_para_OperacionesService,
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
    this.dataSource = new Solicitud_de_Servicios_para_OperacionesDataSource(
      this._Solicitud_de_Servicios_para_OperacionesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_Servicios_para_Operaciones)
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
    this.listConfig.filter.No_de_Solicitud = "";
    this.listConfig.filter.Fecha_de_Registro = undefined;
    this.listConfig.filter.Hora_de_Registro = "";
    this.listConfig.filter.Usuario_que_Registra = "";
    this.listConfig.filter.Proveedor = "";
    this.listConfig.filter.No__de_Vuelo = "";
    this.listConfig.filter.Tramo = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Tipo = "";
    this.listConfig.filter.No_Solicitud = "";

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

    //INICIA - BRID:3204 - Mostrar listado solo de solicitudes que solicite el usuario de compras - Autor: ANgel Acuña - Actualización: 7/23/2021 1:07:14 PM
    if (this.brf.EvaluaQuery("if ( GLOBAL[USERROLEID]= 1 or  GLOBAL[USERROLEID]= 9 or  GLOBAL[USERROLEID]= 12 ) begin select 1 end ", 1, 'ABC123') != this.brf.TryParseInt('1', '1')) { this.brf.SetFilteronList(this.listConfig, "Solicitud_de_Servicios_para_Operaciones.usuario_que_registra = GLOBAL[USERID]"); } else { }
    //TERMINA - BRID:3204

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

  remove(row: Solicitud_de_Servicios_para_Operaciones) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Solicitud_de_Servicios_para_OperacionesService
          .delete(+row.No_de_Solicitud)
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
  ActionPrint(dataRow: Solicitud_de_Servicios_para_Operaciones) {

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
      'No de Solicitud'
      , 'Fecha de Registro'
      , 'Hora de Registro'
      , 'Usuario que Registra'
      , 'Proveedor '
      , 'No. de Vuelo'
      , 'Tramo'
      , 'Observaciones'
      , 'Estatus'
      , 'Tipo'
      , 'No Solicitud'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.No_de_Solicitud
        , x.Fecha_de_Registro
        , x.Hora_de_Registro
        , x.Usuario_que_Registra_Spartan_User.Name
        , x.Proveedor_Creacion_de_Proveedores.Razon_social
        , x.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
        , x.Tramo_Registro_de_vuelo.Numero_de_Tramo
        , x.Observaciones
        , x.Estatus_Estatus_de_Solicitud_de_Compras.Descripcion
        , x.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion
        , x.No_Solicitud

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
    pdfMake.createPdf(pdfDefinition).download('Solicitud_de_Servicios_para_Operaciones.pdf');
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
          this._Solicitud_de_Servicios_para_OperacionesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_Servicios_para_Operacioness;
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
          this._Solicitud_de_Servicios_para_OperacionesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_Servicios_para_Operacioness;
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
        'No de Solicitud ': fields.No_de_Solicitud,
        'Fecha de Registro ': fields.Fecha_de_Registro ? momentJS(fields.Fecha_de_Registro).format('DD/MM/YYYY') : '',
        'Hora de Registro ': fields.Hora_de_Registro,
        'Usuario que Registra ': fields.Usuario_que_Registra_Spartan_User.Name,
        'Proveedor  ': fields.Proveedor_Creacion_de_Proveedores.Razon_social,
        'No. de Vuelo ': fields.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Tramo ': fields.Tramo_Registro_de_vuelo.Numero_de_Tramo,
        'Observaciones ': fields.Observaciones,
        'Estatus ': fields.Estatus_Estatus_de_Solicitud_de_Compras.Descripcion,
        'Tipo ': fields.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion,
        'No Solicitud ': fields.No_Solicitud,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Solicitud_de_Servicios_para_Operaciones  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      No_de_Solicitud: x.No_de_Solicitud,
      Fecha_de_Registro: x.Fecha_de_Registro,
      Hora_de_Registro: x.Hora_de_Registro,
      Usuario_que_Registra: x.Usuario_que_Registra_Spartan_User.Name,
      Proveedor: x.Proveedor_Creacion_de_Proveedores.Razon_social,
      No__de_Vuelo: x.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Tramo: x.Tramo_Registro_de_vuelo.Numero_de_Tramo,
      Observaciones: x.Observaciones,
      Estatus: x.Estatus_Estatus_de_Solicitud_de_Compras.Descripcion,
      Tipo: x.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion,
      No_Solicitud: x.No_Solicitud,

    }));

    this.excelService.exportToCsv(result, 'Solicitud_de_Servicios_para_Operaciones', ['No_de_Solicitud', 'Fecha_de_Registro', 'Hora_de_Registro', 'Usuario_que_Registra', 'Proveedor', 'No__de_Vuelo', 'Tramo', 'Observaciones', 'Estatus', 'Tipo', 'No_Solicitud']);
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
    template += '          <th>No de Solicitud</th>';
    template += '          <th>Fecha de Registro</th>';
    template += '          <th>Hora de Registro</th>';
    template += '          <th>Usuario que Registra</th>';
    template += '          <th>Proveedor </th>';
    template += '          <th>No. de Vuelo</th>';
    template += '          <th>Tramo</th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Tipo</th>';
    template += '          <th>No Solicitud</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.No_de_Solicitud + '</td>';
      template += '          <td>' + element.Fecha_de_Registro + '</td>';
      template += '          <td>' + element.Hora_de_Registro + '</td>';
      template += '          <td>' + element.Usuario_que_Registra_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Tramo_Registro_de_vuelo.Numero_de_Tramo + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Solicitud_de_Compras.Descripcion + '</td>';
      template += '          <td>' + element.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion + '</td>';
      template += '          <td>' + element.No_Solicitud + '</td>';

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
    template += '\t No de Solicitud';
    template += '\t Fecha de Registro';
    template += '\t Hora de Registro';
    template += '\t Usuario que Registra';
    template += '\t Proveedor ';
    template += '\t No. de Vuelo';
    template += '\t Tramo';
    template += '\t Observaciones';
    template += '\t Estatus';
    template += '\t Tipo';
    template += '\t No Solicitud';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.No_de_Solicitud;
      template += '\t ' + element.Fecha_de_Registro;
      template += '\t ' + element.Hora_de_Registro;
      template += '\t ' + element.Usuario_que_Registra_Spartan_User.Name;
      template += '\t ' + element.Proveedor_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Tramo_Registro_de_vuelo.Numero_de_Tramo;
      template += '\t ' + element.Observaciones;
      template += '\t ' + element.Estatus_Estatus_de_Solicitud_de_Compras.Descripcion;
      template += '\t ' + element.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion;
      template += '\t ' + element.No_Solicitud;

      template += '\n';
    });

    return template;
  }

}

export class Solicitud_de_Servicios_para_OperacionesDataSource implements DataSource<Solicitud_de_Servicios_para_Operaciones>
{
  private subject = new BehaviorSubject<Solicitud_de_Servicios_para_Operaciones[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Solicitud_de_Servicios_para_OperacionesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Solicitud_de_Servicios_para_Operaciones[]> {
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
          if (column === 'No_de_Solicitud') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Solicitud_de_Servicios_para_Operacioness.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_Servicios_para_Operacioness);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.No_de_Solicitud != "")
      condition += " and Solicitud_de_Servicios_para_Operaciones.No_de_Solicitud = " + data.filter.No_de_Solicitud;
    if (data.filter.Fecha_de_Registro)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_Servicios_para_Operaciones.Fecha_de_Registro, 102)  = '" + moment(data.filter.Fecha_de_Registro).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Registro != "")
      condition += " and Solicitud_de_Servicios_para_Operaciones.Hora_de_Registro = '" + data.filter.Hora_de_Registro + "'";
    if (data.filter.Usuario_que_Registra != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra + "%' ";
    if (data.filter.Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor + "%' ";
    if (data.filter.No__de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.No__de_Vuelo + "%' ";
    if (data.filter.Tramo != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Tramo + "%' ";
    if (data.filter.Observaciones != "")
      condition += " and Solicitud_de_Servicios_para_Operaciones.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Solicitud_de_Compras.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Tipo != "")
      condition += " and Tipo_de_Solicitud_de_Compras.Descripcion like '%" + data.filter.Tipo + "%' ";
    if (data.filter.No_Solicitud != "")
      condition += " and Solicitud_de_Servicios_para_Operaciones.No_Solicitud like '%" + data.filter.No_Solicitud + "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "No_de_Solicitud":
        sort = " Solicitud_de_Servicios_para_Operaciones.No_de_Solicitud " + data.sortDirecction;
        break;
      case "Fecha_de_Registro":
        sort = " Solicitud_de_Servicios_para_Operaciones.Fecha_de_Registro " + data.sortDirecction;
        break;
      case "Hora_de_Registro":
        sort = " Solicitud_de_Servicios_para_Operaciones.Hora_de_Registro " + data.sortDirecction;
        break;
      case "Usuario_que_Registra":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "No__de_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Tramo":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Solicitud_de_Servicios_para_Operaciones.Observaciones " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Solicitud_de_Compras.Descripcion " + data.sortDirecction;
        break;
      case "Tipo":
        sort = " Tipo_de_Solicitud_de_Compras.Descripcion " + data.sortDirecction;
        break;
      case "No_Solicitud":
        sort = " Solicitud_de_Servicios_para_Operaciones.No_Solicitud " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromNo_de_Solicitud != 'undefined' && data.filterAdvanced.fromNo_de_Solicitud)
      || (typeof data.filterAdvanced.toNo_de_Solicitud != 'undefined' && data.filterAdvanced.toNo_de_Solicitud)) {
      if (typeof data.filterAdvanced.fromNo_de_Solicitud != 'undefined' && data.filterAdvanced.fromNo_de_Solicitud)
        condition += " AND Solicitud_de_Servicios_para_Operaciones.No_de_Solicitud >= " + data.filterAdvanced.fromNo_de_Solicitud;

      if (typeof data.filterAdvanced.toNo_de_Solicitud != 'undefined' && data.filterAdvanced.toNo_de_Solicitud)
        condition += " AND Solicitud_de_Servicios_para_Operaciones.No_de_Solicitud <= " + data.filterAdvanced.toNo_de_Solicitud;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
      || (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)) {
      if (typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Servicios_para_Operaciones.Fecha_de_Registro, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Registro).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Servicios_para_Operaciones.Fecha_de_Registro, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Registro).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
      || (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)) {
      if (typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
        condition += " and Solicitud_de_Servicios_para_Operaciones.Hora_de_Registro >= '" + data.filterAdvanced.fromHora_de_Registro + "'";

      if (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)
        condition += " and Solicitud_de_Servicios_para_Operaciones.Hora_de_Registro <= '" + data.filterAdvanced.toHora_de_Registro + "'";
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
      condition += " AND Solicitud_de_Servicios_para_Operaciones.Usuario_que_Registra In (" + Usuario_que_Registrads + ")";
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
      condition += " AND Solicitud_de_Servicios_para_Operaciones.Proveedor In (" + Proveedords + ")";
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
      condition += " AND Solicitud_de_Servicios_para_Operaciones.No__de_Vuelo In (" + No__de_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Tramo != 'undefined' && data.filterAdvanced.Tramo)) {
      switch (data.filterAdvanced.TramoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '" + data.filterAdvanced.Tramo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo = '" + data.filterAdvanced.Tramo + "'";
          break;
      }
    } else if (data.filterAdvanced.TramoMultiple != null && data.filterAdvanced.TramoMultiple.length > 0) {
      var Tramods = data.filterAdvanced.TramoMultiple.join(",");
      condition += " AND Solicitud_de_Servicios_para_Operaciones.Tramo In (" + Tramods + ")";
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Servicios_para_Operaciones.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Servicios_para_Operaciones.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Servicios_para_Operaciones.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Servicios_para_Operaciones.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Solicitud_de_Compras.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Solicitud_de_Compras.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Solicitud_de_Compras.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Solicitud_de_Compras.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Solicitud_de_Servicios_para_Operaciones.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.Tipo != 'undefined' && data.filterAdvanced.Tipo)) {
      switch (data.filterAdvanced.TipoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Solicitud_de_Compras.Descripcion LIKE '" + data.filterAdvanced.Tipo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Solicitud_de_Compras.Descripcion LIKE '%" + data.filterAdvanced.Tipo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Solicitud_de_Compras.Descripcion LIKE '%" + data.filterAdvanced.Tipo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Solicitud_de_Compras.Descripcion = '" + data.filterAdvanced.Tipo + "'";
          break;
      }
    } else if (data.filterAdvanced.TipoMultiple != null && data.filterAdvanced.TipoMultiple.length > 0) {
      var Tipods = data.filterAdvanced.TipoMultiple.join(",");
      condition += " AND Solicitud_de_Servicios_para_Operaciones.Tipo In (" + Tipods + ")";
    }
    switch (data.filterAdvanced.No_SolicitudFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Servicios_para_Operaciones.No_Solicitud LIKE '" + data.filterAdvanced.No_Solicitud + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Servicios_para_Operaciones.No_Solicitud LIKE '%" + data.filterAdvanced.No_Solicitud + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Servicios_para_Operaciones.No_Solicitud LIKE '%" + data.filterAdvanced.No_Solicitud + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Servicios_para_Operaciones.No_Solicitud = '" + data.filterAdvanced.No_Solicitud + "'";
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
          if (column === 'No_de_Solicitud') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Solicitud_de_Servicios_para_Operacioness.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_Servicios_para_Operacioness);
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
