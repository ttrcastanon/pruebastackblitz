import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Pago_de_servicios_de_operacionesService } from "src/app/api-services/Pago_de_servicios_de_operaciones.service";
import { Pago_de_servicios_de_operaciones } from "src/app/models/Pago_de_servicios_de_operaciones";
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
import { Pago_de_servicios_de_operacionesIndexRules } from 'src/app/shared/businessRules/Pago_de_servicios_de_operaciones-index-rules';
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
  selector: "app-list-Pago_de_servicios_de_operaciones",
  templateUrl: "./list-Pago_de_servicios_de_operaciones.component.html",
  styleUrls: ["./list-Pago_de_servicios_de_operaciones.component.scss"],
})
export class ListPago_de_servicios_de_operacionesComponent extends Pago_de_servicios_de_operacionesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    //"IdLisPagServOp",
    "No_de_Solicitud",
    "Proveedor",
    "No_Vuelo",
    "Aeropuerto",
    "Descripcion",
    "Cantidad",
    "Unidad",
    "Costo",
    "No_de_Factura",
    "Fecha_de_Factura",
    "Tiempos_de_Pago",
    "Estatus",
    "No_de_Referencia",
    "Fecha_de_Ejecucion_del_Pago",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      //"IdLisPagServOp",
      "No_de_Solicitud",
      "Proveedor",
      "No_Vuelo",
      "Aeropuerto",
      "Descripcion",
      "Cantidad",
      "Unidad",
      "Costo",
      "No_de_Factura",
      "Fecha_de_Factura",
      "Tiempos_de_Pago",
      "Estatus",
      "No_de_Referencia",
      "Fecha_de_Ejecucion_del_Pago",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      //"IdLisPagServOp_filtro",
      "No_de_Solicitud_filtro",
      "Proveedor_filtro",
      "No_Vuelo_filtro",
      "Aeropuerto_filtro",
      "Descripcion_filtro",
      "Cantidad_filtro",
      "Unidad_filtro",
      "Costo_filtro",
      "No_de_Factura_filtro",
      "Fecha_de_Factura_filtro",
      "Tiempos_de_Pago_filtro",
      "Estatus_filtro",
      "No_de_Referencia_filtro",
      "Fecha_de_Ejecucion_del_Pago_filtro",

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
      IdLisPagServOp: "",
      No_de_Solicitud: "",
      Proveedor: "",
      No_Vuelo: "",
      Aeropuerto: "",
      Descripcion: "",
      Cantidad: "",
      Unidad: "",
      Costo: "",
      No_de_Factura: "",
      Fecha_de_Factura: null,
      Tiempos_de_Pago: "",
      Estatus: "",
      No_de_Referencia: "",
      Fecha_de_Ejecucion_del_Pago: null,
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromIdLisPagServOp: "",
      toIdLisPagServOp: "",
      No_de_SolicitudFilter: "",
      No_de_Solicitud: "",
      No_de_SolicitudMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      No_VueloFilter: "",
      No_Vuelo: "",
      No_VueloMultiple: "",
      AeropuertoFilter: "",
      Aeropuerto: "",
      AeropuertoMultiple: "",
      fromCantidad: "",
      toCantidad: "",
      UnidadFilter: "",
      Unidad: "",
      UnidadMultiple: "",
      fromCosto: "",
      toCosto: "",
      fromNo_de_Factura: "",
      toNo_de_Factura: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",
      fromTiempos_de_Pago: "",
      toTiempos_de_Pago: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromFecha_de_Ejecucion_del_Pago: "",
      toFecha_de_Ejecucion_del_Pago: "",

    }
  };

  dataSource: Pago_de_servicios_de_operacionesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Pago_de_servicios_de_operacionesDataSource;
  dataClipboard: any;

  constructor(
    private _Pago_de_servicios_de_operacionesService: Pago_de_servicios_de_operacionesService,
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
    this.dataSource = new Pago_de_servicios_de_operacionesDataSource(
      this._Pago_de_servicios_de_operacionesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Pago_de_servicios_de_operaciones)
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
    this.listConfig.filter.IdLisPagServOp = "";
    this.listConfig.filter.No_de_Solicitud = "";
    this.listConfig.filter.Proveedor = "";
    this.listConfig.filter.No_Vuelo = "";
    this.listConfig.filter.Aeropuerto = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Cantidad = "";
    this.listConfig.filter.Unidad = "";
    this.listConfig.filter.Costo = "";
    this.listConfig.filter.No_de_Factura = "";
    this.listConfig.filter.Fecha_de_Factura = undefined;
    this.listConfig.filter.Tiempos_de_Pago = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.No_de_Referencia = "";
    this.listConfig.filter.Fecha_de_Ejecucion_del_Pago = undefined;

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

//INICIA - BRID:4690 - Ocultar columnas en index Pago_de_servicios_de_operaciones - Autor: Agustín Administrador - Actualización: 8/5/2021 7:05:12 PM
if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"IdLisPagServOp")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"IdLisPagServOp")  }
//TERMINA - BRID:4690

//rulesAfterCreationList_ExecuteBusinessRulesEnd

  }
  
  rulesBeforeCreationList() {
    //rulesBeforeCreationList_ExecuteBusinessRulesInit

//INICIA - BRID:4685 - Ejecutar SP "Extraccion_de_Listado_de_Pagos_de_Servicios_de_Operaciones" - Autor: Agustín Administrador - Actualización: 8/5/2021 6:17:49 PM
this.brf.EvaluaQuery("EXEC Extraccion_de_Listado_de_Pagos_de_Servicios_de_Operaciones", 1, "ABC123");
//TERMINA - BRID:4685

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

  remove(row: Pago_de_servicios_de_operaciones) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Pago_de_servicios_de_operacionesService
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
  ActionPrint(dataRow: Pago_de_servicios_de_operaciones) {

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
,'IdLisPagServOp'
,'No. de Solicitud'
,'Proveedor'
,'No. Vuelo'
,'Aeropuerto'
,'Descripción'
,'Cantidad'
,'Unidad'
,'Costo $'
,'No. de Factura'
,'Fecha de Factura'
,'Tiempos de Pago'
,'Estatus'
,'No. de Referencia'
,'Fecha de Ejecución del Pago'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.IdLisPagServOp
,x.No_de_Solicitud_Solicitud_de_Servicios_para_Operaciones.No_Solicitud
,x.Proveedor_Creacion_de_Proveedores.Razon_social
,x.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
,x.Aeropuerto_Aeropuertos.Nombre
,x.Descripcion
,x.Cantidad
,x.Unidad_Unidad.Descripcion
,x.Costo
,x.No_de_Factura
,x.Fecha_de_Factura
,x.Tiempos_de_Pago
,x.Estatus_Estatus_de_Seguimiento.Descripcion
,x.No_de_Referencia
,x.Fecha_de_Ejecucion_del_Pago
		  
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
    pdfMake.createPdf(pdfDefinition).download('Pago_de_servicios_de_operaciones.pdf');
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
          this._Pago_de_servicios_de_operacionesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Pago_de_servicios_de_operacioness;
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
          this._Pago_de_servicios_de_operacionesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Pago_de_servicios_de_operacioness;
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
        'IdLisPagServOp ': fields.IdLisPagServOp,
        'No. de Solicitud ': fields.No_de_Solicitud_Solicitud_de_Servicios_para_Operaciones.No_Solicitud,
        'Proveedor ': fields.Proveedor_Creacion_de_Proveedores.Razon_social,
        'No. Vuelo ': fields.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Aeropuerto ': fields.Aeropuerto_Aeropuertos.Nombre,
        'Descripción ': fields.Descripcion,
        'Cantidad ': fields.Cantidad,
        'Unidad ': fields.Unidad_Unidad.Descripcion,
        'Costo $ ': fields.Costo,
        'No. de Factura ': fields.No_de_Factura,
        'Fecha de Factura ': fields.Fecha_de_Factura ? momentJS(fields.Fecha_de_Factura).format('DD/MM/YYYY') : '',
        'Tiempos de Pago ': fields.Tiempos_de_Pago,
        'Estatus ': fields.Estatus_Estatus_de_Seguimiento.Descripcion,
        'No. de Referencia ': fields.No_de_Referencia,
        'Fecha de Ejecución del Pago ': fields.Fecha_de_Ejecucion_del_Pago ? momentJS(fields.Fecha_de_Ejecucion_del_Pago).format('DD/MM/YYYY') : '',

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Pago_de_servicios_de_operaciones  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      IdLisPagServOp: x.IdLisPagServOp,
      No_de_Solicitud: x.No_de_Solicitud_Solicitud_de_Servicios_para_Operaciones.No_Solicitud,
      Proveedor: x.Proveedor_Creacion_de_Proveedores.Razon_social,
      No_Vuelo: x.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Aeropuerto: x.Aeropuerto_Aeropuertos.Nombre,
      Descripcion: x.Descripcion,
      Cantidad: x.Cantidad,
      Unidad: x.Unidad_Unidad.Descripcion,
      Costo: x.Costo,
      No_de_Factura: x.No_de_Factura,
      Fecha_de_Factura: x.Fecha_de_Factura,
      Tiempos_de_Pago: x.Tiempos_de_Pago,
      Estatus: x.Estatus_Estatus_de_Seguimiento.Descripcion,
      No_de_Referencia: x.No_de_Referencia,
      Fecha_de_Ejecucion_del_Pago: x.Fecha_de_Ejecucion_del_Pago,

    }));

    this.excelService.exportToCsv(result, 'Pago_de_servicios_de_operaciones',  ['Folio'    ,'IdLisPagServOp'  ,'No_de_Solicitud'  ,'Proveedor'  ,'No_Vuelo'  ,'Aeropuerto'  ,'Descripcion'  ,'Cantidad'  ,'Unidad'  ,'Costo'  ,'No_de_Factura'  ,'Fecha_de_Factura'  ,'Tiempos_de_Pago'  ,'Estatus'  ,'No_de_Referencia'  ,'Fecha_de_Ejecucion_del_Pago' ]);
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
    template += '          <th>IdLisPagServOp</th>';
    template += '          <th>No. de Solicitud</th>';
    template += '          <th>Proveedor</th>';
    template += '          <th>No. Vuelo</th>';
    template += '          <th>Aeropuerto</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>Cantidad</th>';
    template += '          <th>Unidad</th>';
    template += '          <th>Costo $</th>';
    template += '          <th>No. de Factura</th>';
    template += '          <th>Fecha de Factura</th>';
    template += '          <th>Tiempos de Pago</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>No. de Referencia</th>';
    template += '          <th>Fecha de Ejecución del Pago</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.IdLisPagServOp + '</td>';
      template += '          <td>' + element.No_de_Solicitud_Solicitud_de_Servicios_para_Operaciones.No_Solicitud + '</td>';
      template += '          <td>' + element.Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Aeropuerto_Aeropuertos.Nombre + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.Cantidad + '</td>';
      template += '          <td>' + element.Unidad_Unidad.Descripcion + '</td>';
      template += '          <td>' + element.Costo + '</td>';
      template += '          <td>' + element.No_de_Factura + '</td>';
      template += '          <td>' + element.Fecha_de_Factura + '</td>';
      template += '          <td>' + element.Tiempos_de_Pago + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Seguimiento.Descripcion + '</td>';
      template += '          <td>' + element.No_de_Referencia + '</td>';
      template += '          <td>' + element.Fecha_de_Ejecucion_del_Pago + '</td>';
		  
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
	template += '\t IdLisPagServOp';
	template += '\t No. de Solicitud';
	template += '\t Proveedor';
	template += '\t No. Vuelo';
	template += '\t Aeropuerto';
	template += '\t Descripción';
	template += '\t Cantidad';
	template += '\t Unidad';
	template += '\t Costo $';
	template += '\t No. de Factura';
	template += '\t Fecha de Factura';
	template += '\t Tiempos de Pago';
	template += '\t Estatus';
	template += '\t No. de Referencia';
	template += '\t Fecha de Ejecución del Pago';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.IdLisPagServOp;
      template += '\t ' + element.No_de_Solicitud_Solicitud_de_Servicios_para_Operaciones.No_Solicitud;
      template += '\t ' + element.Proveedor_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Aeropuerto_Aeropuertos.Nombre;
	  template += '\t ' + element.Descripcion;
	  template += '\t ' + element.Cantidad;
      template += '\t ' + element.Unidad_Unidad.Descripcion;
	  template += '\t ' + element.Costo;
	  template += '\t ' + element.No_de_Factura;
	  template += '\t ' + element.Fecha_de_Factura;
	  template += '\t ' + element.Tiempos_de_Pago;
      template += '\t ' + element.Estatus_Estatus_de_Seguimiento.Descripcion;
	  template += '\t ' + element.No_de_Referencia;
	  template += '\t ' + element.Fecha_de_Ejecucion_del_Pago;

	  template += '\n';
    });

    return template;
  }

}

export class Pago_de_servicios_de_operacionesDataSource implements DataSource<Pago_de_servicios_de_operaciones>
{
  private subject = new BehaviorSubject<Pago_de_servicios_de_operaciones[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Pago_de_servicios_de_operacionesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Pago_de_servicios_de_operaciones[]> {
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
              const longest = result.Pago_de_servicios_de_operacioness.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Pago_de_servicios_de_operacioness);
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
      condition += " and Pago_de_servicios_de_operaciones.Folio = " + data.filter.Folio;
    if (data.filter.IdLisPagServOp != "")
      condition += " and Pago_de_servicios_de_operaciones.IdLisPagServOp = " + data.filter.IdLisPagServOp;
    if (data.filter.No_de_Solicitud != "")
      condition += " and Solicitud_de_Servicios_para_Operaciones.No_Solicitud like '%" + data.filter.No_de_Solicitud + "%' ";
    if (data.filter.Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor + "%' ";
    if (data.filter.No_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.No_Vuelo + "%' ";
    if (data.filter.Aeropuerto != "")
      condition += " and Aeropuertos.Nombre like '%" + data.filter.Aeropuerto + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Pago_de_servicios_de_operaciones.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Cantidad != "")
      condition += " and Pago_de_servicios_de_operaciones.Cantidad = " + data.filter.Cantidad;
    if (data.filter.Unidad != "")
      condition += " and Unidad.Descripcion like '%" + data.filter.Unidad + "%' ";
    if (data.filter.Costo != "")
      condition += " and Pago_de_servicios_de_operaciones.Costo = " + data.filter.Costo;
    if (data.filter.No_de_Factura != "")
      condition += " and Pago_de_servicios_de_operaciones.No_de_Factura = " + data.filter.No_de_Factura;
    if (data.filter.Fecha_de_Factura)
      condition += " and CONVERT(VARCHAR(10), Pago_de_servicios_de_operaciones.Fecha_de_Factura, 102)  = '" + moment(data.filter.Fecha_de_Factura).format("YYYY.MM.DD") + "'";
    if (data.filter.Tiempos_de_Pago != "")
      condition += " and Pago_de_servicios_de_operaciones.Tiempos_de_Pago = " + data.filter.Tiempos_de_Pago;
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Seguimiento.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.No_de_Referencia != "")
      condition += " and Pago_de_servicios_de_operaciones.No_de_Referencia like '%" + data.filter.No_de_Referencia + "%' ";
    if (data.filter.Fecha_de_Ejecucion_del_Pago)
      condition += " and CONVERT(VARCHAR(10), Pago_de_servicios_de_operaciones.Fecha_de_Ejecucion_del_Pago, 102)  = '" + moment(data.filter.Fecha_de_Ejecucion_del_Pago).format("YYYY.MM.DD") + "'";

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
        sort = " Pago_de_servicios_de_operaciones.Folio " + data.sortDirecction;
        break;
      case "IdLisPagServOp":
        sort = " Pago_de_servicios_de_operaciones.IdLisPagServOp " + data.sortDirecction;
        break;
      case "No_de_Solicitud":
        sort = " Solicitud_de_Servicios_para_Operaciones.No_Solicitud " + data.sortDirecction;
        break;
      case "Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "No_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Aeropuerto":
        sort = " Aeropuertos.Nombre " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Pago_de_servicios_de_operaciones.Descripcion " + data.sortDirecction;
        break;
      case "Cantidad":
        sort = " Pago_de_servicios_de_operaciones.Cantidad " + data.sortDirecction;
        break;
      case "Unidad":
        sort = " Unidad.Descripcion " + data.sortDirecction;
        break;
      case "Costo":
        sort = " Pago_de_servicios_de_operaciones.Costo " + data.sortDirecction;
        break;
      case "No_de_Factura":
        sort = " Pago_de_servicios_de_operaciones.No_de_Factura " + data.sortDirecction;
        break;
      case "Fecha_de_Factura":
        sort = " Pago_de_servicios_de_operaciones.Fecha_de_Factura " + data.sortDirecction;
        break;
      case "Tiempos_de_Pago":
        sort = " Pago_de_servicios_de_operaciones.Tiempos_de_Pago " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Seguimiento.Descripcion " + data.sortDirecction;
        break;
      case "No_de_Referencia":
        sort = " Pago_de_servicios_de_operaciones.No_de_Referencia " + data.sortDirecction;
        break;
      case "Fecha_de_Ejecucion_del_Pago":
        sort = " Pago_de_servicios_de_operaciones.Fecha_de_Ejecucion_del_Pago " + data.sortDirecction;
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
        condition += " AND Pago_de_servicios_de_operaciones.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Pago_de_servicios_de_operaciones.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromIdLisPagServOp != 'undefined' && data.filterAdvanced.fromIdLisPagServOp)
	|| (typeof data.filterAdvanced.toIdLisPagServOp != 'undefined' && data.filterAdvanced.toIdLisPagServOp)) 
	{
      if (typeof data.filterAdvanced.fromIdLisPagServOp != 'undefined' && data.filterAdvanced.fromIdLisPagServOp)
        condition += " AND Pago_de_servicios_de_operaciones.IdLisPagServOp >= " + data.filterAdvanced.fromIdLisPagServOp;

      if (typeof data.filterAdvanced.toIdLisPagServOp != 'undefined' && data.filterAdvanced.toIdLisPagServOp) 
        condition += " AND Pago_de_servicios_de_operaciones.IdLisPagServOp <= " + data.filterAdvanced.toIdLisPagServOp;
    }
    if ((typeof data.filterAdvanced.No_de_Solicitud != 'undefined' && data.filterAdvanced.No_de_Solicitud)) {
      switch (data.filterAdvanced.No_de_SolicitudFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Servicios_para_Operaciones.No_Solicitud LIKE '" + data.filterAdvanced.No_de_Solicitud + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Servicios_para_Operaciones.No_Solicitud LIKE '%" + data.filterAdvanced.No_de_Solicitud + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Servicios_para_Operaciones.No_Solicitud LIKE '%" + data.filterAdvanced.No_de_Solicitud + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Servicios_para_Operaciones.No_Solicitud = '" + data.filterAdvanced.No_de_Solicitud + "'";
          break;
      }
    } else if (data.filterAdvanced.No_de_SolicitudMultiple != null && data.filterAdvanced.No_de_SolicitudMultiple.length > 0) {
      var No_de_Solicitudds = data.filterAdvanced.No_de_SolicitudMultiple.join(",");
      condition += " AND Pago_de_servicios_de_operaciones.No_de_Solicitud In (" + No_de_Solicitudds + ")";
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
      condition += " AND Pago_de_servicios_de_operaciones.Proveedor In (" + Proveedords + ")";
    }
    if ((typeof data.filterAdvanced.No_Vuelo != 'undefined' && data.filterAdvanced.No_Vuelo)) {
      switch (data.filterAdvanced.No_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.No_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.No_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.No_VueloMultiple != null && data.filterAdvanced.No_VueloMultiple.length > 0) {
      var No_Vuelods = data.filterAdvanced.No_VueloMultiple.join(",");
      condition += " AND Pago_de_servicios_de_operaciones.No_Vuelo In (" + No_Vuelods + ")";
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
      condition += " AND Pago_de_servicios_de_operaciones.Aeropuerto In (" + Aeropuertods + ")";
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Pago_de_servicios_de_operaciones.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Pago_de_servicios_de_operaciones.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Pago_de_servicios_de_operaciones.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Pago_de_servicios_de_operaciones.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromCantidad != 'undefined' && data.filterAdvanced.fromCantidad)
	|| (typeof data.filterAdvanced.toCantidad != 'undefined' && data.filterAdvanced.toCantidad)) 
	{
      if (typeof data.filterAdvanced.fromCantidad != 'undefined' && data.filterAdvanced.fromCantidad)
        condition += " AND Pago_de_servicios_de_operaciones.Cantidad >= " + data.filterAdvanced.fromCantidad;

      if (typeof data.filterAdvanced.toCantidad != 'undefined' && data.filterAdvanced.toCantidad) 
        condition += " AND Pago_de_servicios_de_operaciones.Cantidad <= " + data.filterAdvanced.toCantidad;
    }
    if ((typeof data.filterAdvanced.Unidad != 'undefined' && data.filterAdvanced.Unidad)) {
      switch (data.filterAdvanced.UnidadFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Unidad.Descripcion LIKE '" + data.filterAdvanced.Unidad + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Unidad + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Unidad + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Unidad.Descripcion = '" + data.filterAdvanced.Unidad + "'";
          break;
      }
    } else if (data.filterAdvanced.UnidadMultiple != null && data.filterAdvanced.UnidadMultiple.length > 0) {
      var Unidadds = data.filterAdvanced.UnidadMultiple.join(",");
      condition += " AND Pago_de_servicios_de_operaciones.Unidad In (" + Unidadds + ")";
    }
    if ((typeof data.filterAdvanced.fromCosto != 'undefined' && data.filterAdvanced.fromCosto)
	|| (typeof data.filterAdvanced.toCosto != 'undefined' && data.filterAdvanced.toCosto)) 
	{
      if (typeof data.filterAdvanced.fromCosto != 'undefined' && data.filterAdvanced.fromCosto)
        condition += " AND Pago_de_servicios_de_operaciones.Costo >= " + data.filterAdvanced.fromCosto;

      if (typeof data.filterAdvanced.toCosto != 'undefined' && data.filterAdvanced.toCosto) 
        condition += " AND Pago_de_servicios_de_operaciones.Costo <= " + data.filterAdvanced.toCosto;
    }
    if ((typeof data.filterAdvanced.fromNo_de_Factura != 'undefined' && data.filterAdvanced.fromNo_de_Factura)
	|| (typeof data.filterAdvanced.toNo_de_Factura != 'undefined' && data.filterAdvanced.toNo_de_Factura)) 
	{
      if (typeof data.filterAdvanced.fromNo_de_Factura != 'undefined' && data.filterAdvanced.fromNo_de_Factura)
        condition += " AND Pago_de_servicios_de_operaciones.No_de_Factura >= " + data.filterAdvanced.fromNo_de_Factura;

      if (typeof data.filterAdvanced.toNo_de_Factura != 'undefined' && data.filterAdvanced.toNo_de_Factura) 
        condition += " AND Pago_de_servicios_de_operaciones.No_de_Factura <= " + data.filterAdvanced.toNo_de_Factura;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura)
	|| (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Pago_de_servicios_de_operaciones.Fecha_de_Factura, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Factura).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Pago_de_servicios_de_operaciones.Fecha_de_Factura, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Factura).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromTiempos_de_Pago != 'undefined' && data.filterAdvanced.fromTiempos_de_Pago)
	|| (typeof data.filterAdvanced.toTiempos_de_Pago != 'undefined' && data.filterAdvanced.toTiempos_de_Pago)) 
	{
      if (typeof data.filterAdvanced.fromTiempos_de_Pago != 'undefined' && data.filterAdvanced.fromTiempos_de_Pago)
        condition += " AND Pago_de_servicios_de_operaciones.Tiempos_de_Pago >= " + data.filterAdvanced.fromTiempos_de_Pago;

      if (typeof data.filterAdvanced.toTiempos_de_Pago != 'undefined' && data.filterAdvanced.toTiempos_de_Pago) 
        condition += " AND Pago_de_servicios_de_operaciones.Tiempos_de_Pago <= " + data.filterAdvanced.toTiempos_de_Pago;
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
      condition += " AND Pago_de_servicios_de_operaciones.Estatus In (" + Estatusds + ")";
    }
    switch (data.filterAdvanced.No_de_ReferenciaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Pago_de_servicios_de_operaciones.No_de_Referencia LIKE '" + data.filterAdvanced.No_de_Referencia + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Pago_de_servicios_de_operaciones.No_de_Referencia LIKE '%" + data.filterAdvanced.No_de_Referencia + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Pago_de_servicios_de_operaciones.No_de_Referencia LIKE '%" + data.filterAdvanced.No_de_Referencia + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Pago_de_servicios_de_operaciones.No_de_Referencia = '" + data.filterAdvanced.No_de_Referencia + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Ejecucion_del_Pago != 'undefined' && data.filterAdvanced.fromFecha_de_Ejecucion_del_Pago)
	|| (typeof data.filterAdvanced.toFecha_de_Ejecucion_del_Pago != 'undefined' && data.filterAdvanced.toFecha_de_Ejecucion_del_Pago)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Ejecucion_del_Pago != 'undefined' && data.filterAdvanced.fromFecha_de_Ejecucion_del_Pago) 
        condition += " and CONVERT(VARCHAR(10), Pago_de_servicios_de_operaciones.Fecha_de_Ejecucion_del_Pago, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Ejecucion_del_Pago).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Ejecucion_del_Pago != 'undefined' && data.filterAdvanced.toFecha_de_Ejecucion_del_Pago) 
        condition += " and CONVERT(VARCHAR(10), Pago_de_servicios_de_operaciones.Fecha_de_Ejecucion_del_Pago, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Ejecucion_del_Pago).format("YYYY.MM.DD") + "'";
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
              const longest = result.Pago_de_servicios_de_operacioness.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Pago_de_servicios_de_operacioness);
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
