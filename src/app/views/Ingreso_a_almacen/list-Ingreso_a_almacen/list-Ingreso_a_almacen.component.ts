import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Ingreso_a_almacenService } from "src/app/api-services/Ingreso_a_almacen.service";
import { Ingreso_a_almacen } from "src/app/models/Ingreso_a_almacen";
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
import { Ingreso_a_almacenIndexRules } from 'src/app/shared/businessRules/Ingreso_a_almacen-index-rules';
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
  selector: "app-list-Ingreso_a_almacen",
  templateUrl: "./list-Ingreso_a_almacen.component.html",
  styleUrls: ["./list-Ingreso_a_almacen.component.scss"],
})
export class ListIngreso_a_almacenComponent extends Ingreso_a_almacenIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No__de_parte___Descripcion",
    "Categoria",
    "Cant__Solicitada",
    "Unidad_CS",
    "Cant__Recibida",
    "Unidad_CR",
    "Costo_de_Material_",
    "No__de_Factura",
    "Costo_en_Factura_",
    "Tipo_de_Cambio",
    "Fecha_de_Factura",
    "Fecha_Estimada_de_llegada",
    "Fecha_Real_de_llegada",
    "Se_mantiene_el_No__de_Parte",
    "No__de_Serie",
    "No__de_Lote",
    "Horas_acumuladas",
    "Ciclos_acumulados",
    "Fecha_de_vencimiento",
    "Ubicacion_en_Almacen",
    "Linea_de_Almacen",
    "Ubicacion",
    "Condicion",
    "Fecha_de_Expiracion",
    "Control_de_Temperatura",
    "Identificacion_de_Herramienta",
    "No__Parte_Nuevo",
    "IdIngresoAlmacen",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_parte___Descripcion",
      "Categoria",
      "Cant__Solicitada",
      "Unidad_CS",
      "Cant__Recibida",
      "Unidad_CR",
      "Costo_de_Material_",
      "No__de_Factura",
      "Costo_en_Factura_",
      "Tipo_de_Cambio",
      "Fecha_de_Factura",
      "Fecha_Estimada_de_llegada",
      "Fecha_Real_de_llegada",
      "Se_mantiene_el_No__de_Parte",
      "No__de_Serie",
      "No__de_Lote",
      "Horas_acumuladas",
      "Ciclos_acumulados",
      "Fecha_de_vencimiento",
      "Ubicacion_en_Almacen",
      "Linea_de_Almacen",
      "Ubicacion",
      "Condicion",
      "Fecha_de_Expiracion",
      "Control_de_Temperatura",
      "Identificacion_de_Herramienta",
      "No__Parte_Nuevo",
      "IdIngresoAlmacen",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_parte___Descripcion_filtro",
      "Categoria_filtro",
      "Cant__Solicitada_filtro",
      "Unidad_CS_filtro",
      "Cant__Recibida_filtro",
      "Unidad_CR_filtro",
      "Costo_de_Material__filtro",
      "No__de_Factura_filtro",
      "Costo_en_Factura__filtro",
      "Tipo_de_Cambio_filtro",
      "Fecha_de_Factura_filtro",
      "Fecha_Estimada_de_llegada_filtro",
      "Fecha_Real_de_llegada_filtro",
      "Se_mantiene_el_No__de_Parte_filtro",
      "No__de_Serie_filtro",
      "No__de_Lote_filtro",
      "Horas_acumuladas_filtro",
      "Ciclos_acumulados_filtro",
      "Fecha_de_vencimiento_filtro",
      "Ubicacion_en_Almacen_filtro",
      "Linea_de_Almacen_filtro",
      "Ubicacion_filtro",
      "Condicion_filtro",
      "Fecha_de_Expiracion_filtro",
      "Control_de_Temperatura_filtro",
      "Identificacion_de_Herramienta_filtro",
      "No__Parte_Nuevo_filtro",
      "IdIngresoAlmacen_filtro",

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
      No__de_parte___Descripcion: "",
      Categoria: "",
      Cant__Solicitada: "",
      Unidad_CS: "",
      Cant__Recibida: "",
      Unidad_CR: "",
      Costo_de_Material_: "",
      No__de_Factura: "",
      Costo_en_Factura_: "",
      Tipo_de_Cambio: "",
      Fecha_de_Factura: null,
      Fecha_Estimada_de_llegada: null,
      Fecha_Real_de_llegada: null,
      Se_mantiene_el_No__de_Parte: "",
      No__de_Serie: "",
      No__de_Lote: "",
      Horas_acumuladas: "",
      Ciclos_acumulados: "",
      Fecha_de_vencimiento: null,
      Ubicacion_en_Almacen: "",
      Linea_de_Almacen: "",
      Ubicacion: "",
      Condicion: "",
      Fecha_de_Expiracion: null,
      Control_de_Temperatura: "",
      Identificacion_de_Herramienta: "",
      No__Parte_Nuevo: "",
      IdIngresoAlmacen: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      CategoriaFilter: "",
      Categoria: "",
      CategoriaMultiple: "",
      fromCant__Solicitada: "",
      toCant__Solicitada: "",
      Unidad_CSFilter: "",
      Unidad_CS: "",
      Unidad_CSMultiple: "",
      fromCant__Recibida: "",
      toCant__Recibida: "",
      Unidad_CRFilter: "",
      Unidad_CR: "",
      Unidad_CRMultiple: "",
      fromCosto_de_Material_: "",
      toCosto_de_Material_: "",
      fromCosto_en_Factura_: "",
      toCosto_en_Factura_: "",
      fromTipo_de_Cambio: "",
      toTipo_de_Cambio: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",
      fromFecha_Estimada_de_llegada: "",
      toFecha_Estimada_de_llegada: "",
      fromFecha_Real_de_llegada: "",
      toFecha_Real_de_llegada: "",
      Se_mantiene_el_No__de_ParteFilter: "",
      Se_mantiene_el_No__de_Parte: "",
      Se_mantiene_el_No__de_ParteMultiple: "",
      fromHoras_acumuladas: "",
      toHoras_acumuladas: "",
      fromCiclos_acumulados: "",
      toCiclos_acumulados: "",
      fromFecha_de_vencimiento: "",
      toFecha_de_vencimiento: "",
      CondicionFilter: "",
      Condicion: "",
      CondicionMultiple: "",
      fromFecha_de_Expiracion: "",
      toFecha_de_Expiracion: "",
      fromControl_de_Temperatura: "",
      toControl_de_Temperatura: "",

    }
  };

  dataSource: Ingreso_a_almacenDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Ingreso_a_almacenDataSource;
  dataClipboard: any;

  constructor(
    private _Ingreso_a_almacenService: Ingreso_a_almacenService,
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
    this.dataSource = new Ingreso_a_almacenDataSource(
      this._Ingreso_a_almacenService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Ingreso_a_almacen)
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
    this.listConfig.filter.No__de_parte___Descripcion = "";
    this.listConfig.filter.Categoria = "";
    this.listConfig.filter.Cant__Solicitada = "";
    this.listConfig.filter.Unidad_CS = "";
    this.listConfig.filter.Cant__Recibida = "";
    this.listConfig.filter.Unidad_CR = "";
    this.listConfig.filter.Costo_de_Material_ = "";
    this.listConfig.filter.No__de_Factura = "";
    this.listConfig.filter.Costo_en_Factura_ = "";
    this.listConfig.filter.Tipo_de_Cambio = "";
    this.listConfig.filter.Fecha_de_Factura = undefined;
    this.listConfig.filter.Fecha_Estimada_de_llegada = undefined;
    this.listConfig.filter.Fecha_Real_de_llegada = undefined;
    this.listConfig.filter.Se_mantiene_el_No__de_Parte = "";
    this.listConfig.filter.No__de_Serie = "";
    this.listConfig.filter.No__de_Lote = "";
    this.listConfig.filter.Horas_acumuladas = "";
    this.listConfig.filter.Ciclos_acumulados = "";
    this.listConfig.filter.Fecha_de_vencimiento = undefined;
    this.listConfig.filter.Ubicacion_en_Almacen = "";
    this.listConfig.filter.Linea_de_Almacen = "";
    this.listConfig.filter.Ubicacion = "";
    this.listConfig.filter.Condicion = "";
    this.listConfig.filter.Fecha_de_Expiracion = undefined;
    this.listConfig.filter.Control_de_Temperatura = "";
    this.listConfig.filter.Identificacion_de_Herramienta = "";
    this.listConfig.filter.No__Parte_Nuevo = "";
    this.listConfig.filter.IdIngresoAlmacen = "";

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

  remove(row: Ingreso_a_almacen) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Ingreso_a_almacenService
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
  ActionPrint(dataRow: Ingreso_a_almacen) {

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
,'No. de parte / Descripción '
,'Categoría'
,'Cant. Solicitada'
,'Unidad CS'
,'Cant. Recibida'
,'Unidad CR'
,'Costo de Material $'
,'No. de Factura'
,'Costo en Factura $'
,'Tipo de Cambio'
,'Fecha de Factura'
,'Fecha Estimada de llegada'
,'Fecha Real de llegada'
,'¿Se mantiene el No. de Parte?'
,'No. de Serie'
,'No. de Lote'
,'Horas acumuladas'
,'Ciclos acumulados'
,'Fecha de vencimiento'
,'Ubicación en Almacén'
,'Linea de Almacén'
,'Ubicación'
,'Condición'
,'Fecha de Expiración'
,'Control de Temperatura'
,'Identificación de Herramienta'
,'No. Parte Referencia'
,'IdIngresoAlmacen'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.No__de_parte___Descripcion
,x.Categoria_Categoria_de_Partes.Categoria
,x.Cant__Solicitada
,x.Unidad_CS_Unidad.Descripcion
,x.Cant__Recibida
,x.Unidad_CR_Unidad.Descripcion
,x.Costo_de_Material_
,x.No__de_Factura
,x.Costo_en_Factura_
,x.Tipo_de_Cambio
,x.Fecha_de_Factura
,x.Fecha_Estimada_de_llegada
,x.Fecha_Real_de_llegada
,x.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion
,x.No__de_Serie
,x.No__de_Lote
,x.Horas_acumuladas
,x.Ciclos_acumulados
,x.Fecha_de_vencimiento
,x.Ubicacion_en_Almacen
,x.Linea_de_Almacen
,x.Condicion_Condicion_del_item.Condicion
,x.Fecha_de_Expiracion
,x.Control_de_Temperatura
,x.Identificacion_de_Herramienta
,x.No__Parte_Nuevo
,x.IdIngresoAlmacen
		  
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
    pdfMake.createPdf(pdfDefinition).download('Ingreso_a_almacen.pdf');
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
          this._Ingreso_a_almacenService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ingreso_a_almacens;
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
          this._Ingreso_a_almacenService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ingreso_a_almacens;
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
        'No. de parte / Descripción  ': fields.No__de_parte___Descripcion,
        'Categoría ': fields.Categoria_Categoria_de_Partes.Categoria,
        'Cant. Solicitada ': fields.Cant__Solicitada,
        'Unidad CS ': fields.Unidad_CS_Unidad.Descripcion,
        'Cant. Recibida ': fields.Cant__Recibida,
        'Unidad CR 1': fields.Unidad_CR_Unidad.Descripcion,
        'Costo de Material $ ': fields.Costo_de_Material_,
        'No. de Factura ': fields.No__de_Factura,
        'Costo en Factura $ ': fields.Costo_en_Factura_,
        'Tipo de Cambio ': fields.Tipo_de_Cambio,
        'Fecha de Factura ': fields.Fecha_de_Factura ? momentJS(fields.Fecha_de_Factura).format('DD/MM/YYYY') : '',
        'Fecha Estimada de llegada ': fields.Fecha_Estimada_de_llegada ? momentJS(fields.Fecha_Estimada_de_llegada).format('DD/MM/YYYY') : '',
        'Fecha Real de llegada ': fields.Fecha_Real_de_llegada ? momentJS(fields.Fecha_Real_de_llegada).format('DD/MM/YYYY') : '',
        '¿Se mantiene el No. de Parte? ': fields.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion,
        'No. de Serie ': fields.No__de_Serie,
        'No. de Lote ': fields.No__de_Lote,
        'Horas acumuladas ': fields.Horas_acumuladas,
        'Ciclos acumulados ': fields.Ciclos_acumulados,
        'Fecha de vencimiento ': fields.Fecha_de_vencimiento ? momentJS(fields.Fecha_de_vencimiento).format('DD/MM/YYYY') : '',
        'Ubicación en Almacén ': fields.Ubicacion_en_Almacen,
        'Linea de Almacén ': fields.Linea_de_Almacen,
        'Ubicación ': fields.Ubicacion,
        'Condición ': fields.Condicion_Condicion_del_item.Condicion,
        'Fecha de Expiración ': fields.Fecha_de_Expiracion ? momentJS(fields.Fecha_de_Expiracion).format('DD/MM/YYYY') : '',
        'Control de Temperatura ': fields.Control_de_Temperatura,
        'Identificación de Herramienta ': fields.Identificacion_de_Herramienta,
        'No. Parte Referencia ': fields.No__Parte_Nuevo,
        'IdIngresoAlmacen ': fields.IdIngresoAlmacen,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Ingreso_a_almacen  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No__de_parte___Descripcion: x.No__de_parte___Descripcion,
      Categoria: x.Categoria_Categoria_de_Partes.Categoria,
      Cant__Solicitada: x.Cant__Solicitada,
      Unidad_CS: x.Unidad_CS_Unidad.Descripcion,
      Cant__Recibida: x.Cant__Recibida,
      Unidad_CR: x.Unidad_CR_Unidad.Descripcion,
      Costo_de_Material_: x.Costo_de_Material_,
      No__de_Factura: x.No__de_Factura,
      Costo_en_Factura_: x.Costo_en_Factura_,
      Tipo_de_Cambio: x.Tipo_de_Cambio,
      Fecha_de_Factura: x.Fecha_de_Factura,
      Fecha_Estimada_de_llegada: x.Fecha_Estimada_de_llegada,
      Fecha_Real_de_llegada: x.Fecha_Real_de_llegada,
      Se_mantiene_el_No__de_Parte: x.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion,
      No__de_Serie: x.No__de_Serie,
      No__de_Lote: x.No__de_Lote,
      Horas_acumuladas: x.Horas_acumuladas,
      Ciclos_acumulados: x.Ciclos_acumulados,
      Fecha_de_vencimiento: x.Fecha_de_vencimiento,
      Ubicacion_en_Almacen: x.Ubicacion_en_Almacen,
      Linea_de_Almacen: x.Linea_de_Almacen,
      Ubicacion: x.Ubicacion,
      Condicion: x.Condicion_Condicion_del_item.Condicion,
      Fecha_de_Expiracion: x.Fecha_de_Expiracion,
      Control_de_Temperatura: x.Control_de_Temperatura,
      Identificacion_de_Herramienta: x.Identificacion_de_Herramienta,
      No__Parte_Nuevo: x.No__Parte_Nuevo,
      IdIngresoAlmacen: x.IdIngresoAlmacen,

    }));

    this.excelService.exportToCsv(result, 'Ingreso_a_almacen',  ['Folio'    ,'No__de_parte___Descripcion'  ,'Categoria'  ,'Cant__Solicitada'  ,'Unidad_CS'  ,'Cant__Recibida'  ,'Unidad_CR'  ,'Costo_de_Material_'  ,'No__de_Factura'  ,'Costo_en_Factura_'  ,'Tipo_de_Cambio'  ,'Fecha_de_Factura'  ,'Fecha_Estimada_de_llegada'  ,'Fecha_Real_de_llegada'  ,'Se_mantiene_el_No__de_Parte'  ,'No__de_Serie'  ,'No__de_Lote'  ,'Horas_acumuladas'  ,'Ciclos_acumulados'  ,'Fecha_de_vencimiento'  ,'Ubicacion_en_Almacen'  ,'Linea_de_Almacen'  ,'Ubicacion'  ,'Condicion'  ,'Fecha_de_Expiracion'  ,'Control_de_Temperatura'  ,'Identificacion_de_Herramienta'  ,'No__Parte_Nuevo'  ,'IdIngresoAlmacen' ]);
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
    template += '          <th>No. de parte / Descripción </th>';
    template += '          <th>Categoría</th>';
    template += '          <th>Cant. Solicitada</th>';
    template += '          <th>Unidad CS</th>';
    template += '          <th>Cant. Recibida</th>';
    template += '          <th>Unidad CR</th>';
    template += '          <th>Costo de Material $</th>';
    template += '          <th>No. de Factura</th>';
    template += '          <th>Costo en Factura $</th>';
    template += '          <th>Tipo de Cambio</th>';
    template += '          <th>Fecha de Factura</th>';
    template += '          <th>Fecha Estimada de llegada</th>';
    template += '          <th>Fecha Real de llegada</th>';
    template += '          <th>¿Se mantiene el No. de Parte?</th>';
    template += '          <th>No. de Serie</th>';
    template += '          <th>No. de Lote</th>';
    template += '          <th>Horas acumuladas</th>';
    template += '          <th>Ciclos acumulados</th>';
    template += '          <th>Fecha de vencimiento</th>';
    template += '          <th>Ubicación en Almacén</th>';
    template += '          <th>Linea de Almacén</th>';
    template += '          <th>Ubicación</th>';
    template += '          <th>Condición</th>';
    template += '          <th>Fecha de Expiración</th>';
    template += '          <th>Control de Temperatura</th>';
    template += '          <th>Identificación de Herramienta</th>';
    template += '          <th>No. Parte Referencia</th>';
    template += '          <th>IdIngresoAlmacen</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No__de_parte___Descripcion + '</td>';
      template += '          <td>' + element.Categoria_Categoria_de_Partes.Categoria + '</td>';
      template += '          <td>' + element.Cant__Solicitada + '</td>';
      template += '          <td>' + element.Unidad_CS_Unidad.Descripcion + '</td>';
      template += '          <td>' + element.Cant__Recibida + '</td>';
      template += '          <td>' + element.Unidad_CR_Unidad.Descripcion + '</td>';
      template += '          <td>' + element.Costo_de_Material_ + '</td>';
      template += '          <td>' + element.No__de_Factura + '</td>';
      template += '          <td>' + element.Costo_en_Factura_ + '</td>';
      template += '          <td>' + element.Tipo_de_Cambio + '</td>';
      template += '          <td>' + element.Fecha_de_Factura + '</td>';
      template += '          <td>' + element.Fecha_Estimada_de_llegada + '</td>';
      template += '          <td>' + element.Fecha_Real_de_llegada + '</td>';
      template += '          <td>' + element.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion + '</td>';
      template += '          <td>' + element.No__de_Serie + '</td>';
      template += '          <td>' + element.No__de_Lote + '</td>';
      template += '          <td>' + element.Horas_acumuladas + '</td>';
      template += '          <td>' + element.Ciclos_acumulados + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento + '</td>';
      template += '          <td>' + element.Ubicacion_en_Almacen + '</td>';
      template += '          <td>' + element.Linea_de_Almacen + '</td>';
      template += '          <td>' + element.Ubicacion + '</td>';
      template += '          <td>' + element.Condicion_Condicion_del_item.Condicion + '</td>';
      template += '          <td>' + element.Fecha_de_Expiracion + '</td>';
      template += '          <td>' + element.Control_de_Temperatura + '</td>';
      template += '          <td>' + element.Identificacion_de_Herramienta + '</td>';
      template += '          <td>' + element.No__Parte_Nuevo + '</td>';
      template += '          <td>' + element.IdIngresoAlmacen + '</td>';
		  
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
	template += '\t No. de parte / Descripción ';
	template += '\t Categoría';
	template += '\t Cant. Solicitada';
	template += '\t Unidad CS';
	template += '\t Cant. Recibida';
	template += '\t Unidad CR';
	template += '\t Costo de Material $';
	template += '\t No. de Factura';
	template += '\t Costo en Factura $';
	template += '\t Tipo de Cambio';
	template += '\t Fecha de Factura';
	template += '\t Fecha Estimada de llegada';
	template += '\t Fecha Real de llegada';
	template += '\t ¿Se mantiene el No. de Parte?';
	template += '\t No. de Serie';
	template += '\t No. de Lote';
	template += '\t Horas acumuladas';
	template += '\t Ciclos acumulados';
	template += '\t Fecha de vencimiento';
	template += '\t Ubicación en Almacén';
	template += '\t Linea de Almacén';
	template += '\t Ubicación';
	template += '\t Condición';
	template += '\t Fecha de Expiración';
	template += '\t Control de Temperatura';
	template += '\t Identificación de Herramienta';
	template += '\t No. Parte Referencia';
	template += '\t IdIngresoAlmacen';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.No__de_parte___Descripcion;
      template += '\t ' + element.Categoria_Categoria_de_Partes.Categoria;
	  template += '\t ' + element.Cant__Solicitada;
      template += '\t ' + element.Unidad_CS_Unidad.Descripcion;
	  template += '\t ' + element.Cant__Recibida;
      template += '\t ' + element.Unidad_CR_Unidad.Descripcion;
	  template += '\t ' + element.Costo_de_Material_;
	  template += '\t ' + element.No__de_Factura;
	  template += '\t ' + element.Costo_en_Factura_;
	  template += '\t ' + element.Tipo_de_Cambio;
	  template += '\t ' + element.Fecha_de_Factura;
	  template += '\t ' + element.Fecha_Estimada_de_llegada;
	  template += '\t ' + element.Fecha_Real_de_llegada;
      template += '\t ' + element.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion;
	  template += '\t ' + element.No__de_Serie;
	  template += '\t ' + element.No__de_Lote;
	  template += '\t ' + element.Horas_acumuladas;
	  template += '\t ' + element.Ciclos_acumulados;
	  template += '\t ' + element.Fecha_de_vencimiento;
	  template += '\t ' + element.Ubicacion_en_Almacen;
	  template += '\t ' + element.Linea_de_Almacen;
	  template += '\t ' + element.Ubicacion;
      template += '\t ' + element.Condicion_Condicion_del_item.Condicion;
	  template += '\t ' + element.Fecha_de_Expiracion;
	  template += '\t ' + element.Control_de_Temperatura;
	  template += '\t ' + element.Identificacion_de_Herramienta;
	  template += '\t ' + element.No__Parte_Nuevo;
	  template += '\t ' + element.IdIngresoAlmacen;

	  template += '\n';
    });

    return template;
  }

}

export class Ingreso_a_almacenDataSource implements DataSource<Ingreso_a_almacen>
{
  private subject = new BehaviorSubject<Ingreso_a_almacen[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Ingreso_a_almacenService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Ingreso_a_almacen[]> {
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
              const longest = result.Ingreso_a_almacens.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ingreso_a_almacens);
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
      condition += " and Ingreso_a_almacen.Folio = " + data.filter.Folio;
    if (data.filter.No__de_parte___Descripcion != "")
      condition += " and Ingreso_a_almacen.No__de_parte___Descripcion like '%" + data.filter.No__de_parte___Descripcion + "%' ";
    if (data.filter.Categoria != "")
      condition += " and Categoria_de_Partes.Categoria like '%" + data.filter.Categoria + "%' ";
    if (data.filter.Cant__Solicitada != "")
      condition += " and Ingreso_a_almacen.Cant__Solicitada = " + data.filter.Cant__Solicitada;
    if (data.filter.Unidad_CS != "")
      condition += " and Unidad.Descripcion like '%" + data.filter.Unidad_CS + "%' ";
    if (data.filter.Cant__Recibida != "")
      condition += " and Ingreso_a_almacen.Cant__Recibida = " + data.filter.Cant__Recibida;
    if (data.filter.Unidad_CR != "")
      condition += " and Unidad.Descripcion like '%" + data.filter.Unidad_CR + "%' ";
    if (data.filter.Costo_de_Material_ != "")
      condition += " and Ingreso_a_almacen.Costo_de_Material_ = " + data.filter.Costo_de_Material_;
    if (data.filter.No__de_Factura != "")
      condition += " and Ingreso_a_almacen.No__de_Factura like '%" + data.filter.No__de_Factura + "%' ";
    if (data.filter.Costo_en_Factura_ != "")
      condition += " and Ingreso_a_almacen.Costo_en_Factura_ = " + data.filter.Costo_en_Factura_;
    if (data.filter.Tipo_de_Cambio != "")
      condition += " and Ingreso_a_almacen.Tipo_de_Cambio = " + data.filter.Tipo_de_Cambio;
    if (data.filter.Fecha_de_Factura)
      condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_de_Factura, 102)  = '" + moment(data.filter.Fecha_de_Factura).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_Estimada_de_llegada)
      condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_Estimada_de_llegada, 102)  = '" + moment(data.filter.Fecha_Estimada_de_llegada).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_Real_de_llegada)
      condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_Real_de_llegada, 102)  = '" + moment(data.filter.Fecha_Real_de_llegada).format("YYYY.MM.DD") + "'";
    if (data.filter.Se_mantiene_el_No__de_Parte != "")
      condition += " and Estatus_de_Requerido.Descripcion like '%" + data.filter.Se_mantiene_el_No__de_Parte + "%' ";
    if (data.filter.No__de_Serie != "")
      condition += " and Ingreso_a_almacen.No__de_Serie like '%" + data.filter.No__de_Serie + "%' ";
    if (data.filter.No__de_Lote != "")
      condition += " and Ingreso_a_almacen.No__de_Lote like '%" + data.filter.No__de_Lote + "%' ";
    if (data.filter.Horas_acumuladas != "")
      condition += " and Ingreso_a_almacen.Horas_acumuladas = " + data.filter.Horas_acumuladas;
    if (data.filter.Ciclos_acumulados != "")
      condition += " and Ingreso_a_almacen.Ciclos_acumulados = " + data.filter.Ciclos_acumulados;
    if (data.filter.Fecha_de_vencimiento)
      condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_de_vencimiento, 102)  = '" + moment(data.filter.Fecha_de_vencimiento).format("YYYY.MM.DD") + "'";
    if (data.filter.Ubicacion_en_Almacen != "")
      condition += " and Ingreso_a_almacen.Ubicacion_en_Almacen like '%" + data.filter.Ubicacion_en_Almacen + "%' ";
    if (data.filter.Linea_de_Almacen != "")
      condition += " and Ingreso_a_almacen.Linea_de_Almacen like '%" + data.filter.Linea_de_Almacen + "%' ";
    if (data.filter.Ubicacion != "")
      condition += " and Ingreso_a_almacen.Ubicacion like '%" + data.filter.Ubicacion + "%' ";
    if (data.filter.Condicion != "")
      condition += " and Condicion_del_item.Condicion like '%" + data.filter.Condicion + "%' ";
    if (data.filter.Fecha_de_Expiracion)
      condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_de_Expiracion, 102)  = '" + moment(data.filter.Fecha_de_Expiracion).format("YYYY.MM.DD") + "'";
    if (data.filter.Control_de_Temperatura != "")
      condition += " and Ingreso_a_almacen.Control_de_Temperatura = " + data.filter.Control_de_Temperatura;
    if (data.filter.Identificacion_de_Herramienta != "")
      condition += " and Ingreso_a_almacen.Identificacion_de_Herramienta like '%" + data.filter.Identificacion_de_Herramienta + "%' ";
    if (data.filter.No__Parte_Nuevo != "")
      condition += " and Ingreso_a_almacen.No__Parte_Nuevo like '%" + data.filter.No__Parte_Nuevo + "%' ";
    if (data.filter.IdIngresoAlmacen != "")
      condition += " and Ingreso_a_almacen.IdIngresoAlmacen like '%" + data.filter.IdIngresoAlmacen + "%' ";

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
        sort = " Ingreso_a_almacen.Folio " + data.sortDirecction;
        break;
      case "No__de_parte___Descripcion":
        sort = " Ingreso_a_almacen.No__de_parte___Descripcion " + data.sortDirecction;
        break;
      case "Categoria":
        sort = " Categoria_de_Partes.Categoria " + data.sortDirecction;
        break;
      case "Cant__Solicitada":
        sort = " Ingreso_a_almacen.Cant__Solicitada " + data.sortDirecction;
        break;
      case "Unidad_CS":
        sort = " Unidad.Descripcion " + data.sortDirecction;
        break;
      case "Cant__Recibida":
        sort = " Ingreso_a_almacen.Cant__Recibida " + data.sortDirecction;
        break;
      case "Unidad_CR":
        sort = " Unidad.Descripcion " + data.sortDirecction;
        break;
      case "Costo_de_Material_":
        sort = " Ingreso_a_almacen.Costo_de_Material_ " + data.sortDirecction;
        break;
      case "No__de_Factura":
        sort = " Ingreso_a_almacen.No__de_Factura " + data.sortDirecction;
        break;
      case "Costo_en_Factura_":
        sort = " Ingreso_a_almacen.Costo_en_Factura_ " + data.sortDirecction;
        break;
      case "Tipo_de_Cambio":
        sort = " Ingreso_a_almacen.Tipo_de_Cambio " + data.sortDirecction;
        break;
      case "Fecha_de_Factura":
        sort = " Ingreso_a_almacen.Fecha_de_Factura " + data.sortDirecction;
        break;
      case "Fecha_Estimada_de_llegada":
        sort = " Ingreso_a_almacen.Fecha_Estimada_de_llegada " + data.sortDirecction;
        break;
      case "Fecha_Real_de_llegada":
        sort = " Ingreso_a_almacen.Fecha_Real_de_llegada " + data.sortDirecction;
        break;
      case "Se_mantiene_el_No__de_Parte":
        sort = " Estatus_de_Requerido.Descripcion " + data.sortDirecction;
        break;
      case "No__de_Serie":
        sort = " Ingreso_a_almacen.No__de_Serie " + data.sortDirecction;
        break;
      case "No__de_Lote":
        sort = " Ingreso_a_almacen.No__de_Lote " + data.sortDirecction;
        break;
      case "Horas_acumuladas":
        sort = " Ingreso_a_almacen.Horas_acumuladas " + data.sortDirecction;
        break;
      case "Ciclos_acumulados":
        sort = " Ingreso_a_almacen.Ciclos_acumulados " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento":
        sort = " Ingreso_a_almacen.Fecha_de_vencimiento " + data.sortDirecction;
        break;
      case "Ubicacion_en_Almacen":
        sort = " Ingreso_a_almacen.Ubicacion_en_Almacen " + data.sortDirecction;
        break;
      case "Linea_de_Almacen":
        sort = " Ingreso_a_almacen.Linea_de_Almacen " + data.sortDirecction;
        break;
      case "Ubicacion":
        sort = " Ingreso_a_almacen.Ubicacion " + data.sortDirecction;
        break;
      case "Condicion":
        sort = " Condicion_del_item.Condicion " + data.sortDirecction;
        break;
      case "Fecha_de_Expiracion":
        sort = " Ingreso_a_almacen.Fecha_de_Expiracion " + data.sortDirecction;
        break;
      case "Control_de_Temperatura":
        sort = " Ingreso_a_almacen.Control_de_Temperatura " + data.sortDirecction;
        break;
      case "Identificacion_de_Herramienta":
        sort = " Ingreso_a_almacen.Identificacion_de_Herramienta " + data.sortDirecction;
        break;
      case "No__Parte_Nuevo":
        sort = " Ingreso_a_almacen.No__Parte_Nuevo " + data.sortDirecction;
        break;
      case "IdIngresoAlmacen":
        sort = " Ingreso_a_almacen.IdIngresoAlmacen " + data.sortDirecction;
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
        condition += " AND Ingreso_a_almacen.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Ingreso_a_almacen.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.No__de_parte___DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.No__de_parte___Descripcion LIKE '" + data.filterAdvanced.No__de_parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.No__de_parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.No__de_parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_parte___Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.No__de_parte___Descripcion = '" + data.filterAdvanced.No__de_parte___Descripcion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Categoria != 'undefined' && data.filterAdvanced.Categoria)) {
      switch (data.filterAdvanced.CategoriaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Categoria_de_Partes.Categoria LIKE '" + data.filterAdvanced.Categoria + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Categoria_de_Partes.Categoria LIKE '%" + data.filterAdvanced.Categoria + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Categoria_de_Partes.Categoria LIKE '%" + data.filterAdvanced.Categoria + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Categoria_de_Partes.Categoria = '" + data.filterAdvanced.Categoria + "'";
          break;
      }
    } else if (data.filterAdvanced.CategoriaMultiple != null && data.filterAdvanced.CategoriaMultiple.length > 0) {
      var Categoriads = data.filterAdvanced.CategoriaMultiple.join(",");
      condition += " AND Ingreso_a_almacen.Categoria In (" + Categoriads + ")";
    }
    if ((typeof data.filterAdvanced.fromCant__Solicitada != 'undefined' && data.filterAdvanced.fromCant__Solicitada)
	|| (typeof data.filterAdvanced.toCant__Solicitada != 'undefined' && data.filterAdvanced.toCant__Solicitada)) 
	{
      if (typeof data.filterAdvanced.fromCant__Solicitada != 'undefined' && data.filterAdvanced.fromCant__Solicitada)
        condition += " AND Ingreso_a_almacen.Cant__Solicitada >= " + data.filterAdvanced.fromCant__Solicitada;

      if (typeof data.filterAdvanced.toCant__Solicitada != 'undefined' && data.filterAdvanced.toCant__Solicitada) 
        condition += " AND Ingreso_a_almacen.Cant__Solicitada <= " + data.filterAdvanced.toCant__Solicitada;
    }
    if ((typeof data.filterAdvanced.Unidad_CS != 'undefined' && data.filterAdvanced.Unidad_CS)) {
      switch (data.filterAdvanced.Unidad_CSFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Unidad.Descripcion LIKE '" + data.filterAdvanced.Unidad_CS + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Unidad_CS + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Unidad_CS + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Unidad.Descripcion = '" + data.filterAdvanced.Unidad_CS + "'";
          break;
      }
    } else if (data.filterAdvanced.Unidad_CSMultiple != null && data.filterAdvanced.Unidad_CSMultiple.length > 0) {
      var Unidad_CSds = data.filterAdvanced.Unidad_CSMultiple.join(",");
      condition += " AND Ingreso_a_almacen.Unidad_CS In (" + Unidad_CSds + ")";
    }
    if ((typeof data.filterAdvanced.fromCant__Recibida != 'undefined' && data.filterAdvanced.fromCant__Recibida)
	|| (typeof data.filterAdvanced.toCant__Recibida != 'undefined' && data.filterAdvanced.toCant__Recibida)) 
	{
      if (typeof data.filterAdvanced.fromCant__Recibida != 'undefined' && data.filterAdvanced.fromCant__Recibida)
        condition += " AND Ingreso_a_almacen.Cant__Recibida >= " + data.filterAdvanced.fromCant__Recibida;

      if (typeof data.filterAdvanced.toCant__Recibida != 'undefined' && data.filterAdvanced.toCant__Recibida) 
        condition += " AND Ingreso_a_almacen.Cant__Recibida <= " + data.filterAdvanced.toCant__Recibida;
    }
    if ((typeof data.filterAdvanced.Unidad_CR != 'undefined' && data.filterAdvanced.Unidad_CR)) {
      switch (data.filterAdvanced.Unidad_CRFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Unidad.Descripcion LIKE '" + data.filterAdvanced.Unidad_CR + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Unidad_CR + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Unidad_CR + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Unidad.Descripcion = '" + data.filterAdvanced.Unidad_CR + "'";
          break;
      }
    } else if (data.filterAdvanced.Unidad_CRMultiple != null && data.filterAdvanced.Unidad_CRMultiple.length > 0) {
      var Unidad_CRds = data.filterAdvanced.Unidad_CRMultiple.join(",");
      condition += " AND Ingreso_a_almacen.Unidad_CR In (" + Unidad_CRds + ")";
    }
    if ((typeof data.filterAdvanced.fromCosto_de_Material_ != 'undefined' && data.filterAdvanced.fromCosto_de_Material_)
	|| (typeof data.filterAdvanced.toCosto_de_Material_ != 'undefined' && data.filterAdvanced.toCosto_de_Material_)) 
	{
      if (typeof data.filterAdvanced.fromCosto_de_Material_ != 'undefined' && data.filterAdvanced.fromCosto_de_Material_)
        condition += " AND Ingreso_a_almacen.Costo_de_Material_ >= " + data.filterAdvanced.fromCosto_de_Material_;

      if (typeof data.filterAdvanced.toCosto_de_Material_ != 'undefined' && data.filterAdvanced.toCosto_de_Material_) 
        condition += " AND Ingreso_a_almacen.Costo_de_Material_ <= " + data.filterAdvanced.toCosto_de_Material_;
    }
    switch (data.filterAdvanced.No__de_FacturaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.No__de_Factura LIKE '" + data.filterAdvanced.No__de_Factura + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.No__de_Factura LIKE '%" + data.filterAdvanced.No__de_Factura + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.No__de_Factura LIKE '%" + data.filterAdvanced.No__de_Factura + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.No__de_Factura = '" + data.filterAdvanced.No__de_Factura + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromCosto_en_Factura_ != 'undefined' && data.filterAdvanced.fromCosto_en_Factura_)
	|| (typeof data.filterAdvanced.toCosto_en_Factura_ != 'undefined' && data.filterAdvanced.toCosto_en_Factura_)) 
	{
      if (typeof data.filterAdvanced.fromCosto_en_Factura_ != 'undefined' && data.filterAdvanced.fromCosto_en_Factura_)
        condition += " AND Ingreso_a_almacen.Costo_en_Factura_ >= " + data.filterAdvanced.fromCosto_en_Factura_;

      if (typeof data.filterAdvanced.toCosto_en_Factura_ != 'undefined' && data.filterAdvanced.toCosto_en_Factura_) 
        condition += " AND Ingreso_a_almacen.Costo_en_Factura_ <= " + data.filterAdvanced.toCosto_en_Factura_;
    }
    if ((typeof data.filterAdvanced.fromTipo_de_Cambio != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio)
	|| (typeof data.filterAdvanced.toTipo_de_Cambio != 'undefined' && data.filterAdvanced.toTipo_de_Cambio)) 
	{
      if (typeof data.filterAdvanced.fromTipo_de_Cambio != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio)
        condition += " AND Ingreso_a_almacen.Tipo_de_Cambio >= " + data.filterAdvanced.fromTipo_de_Cambio;

      if (typeof data.filterAdvanced.toTipo_de_Cambio != 'undefined' && data.filterAdvanced.toTipo_de_Cambio) 
        condition += " AND Ingreso_a_almacen.Tipo_de_Cambio <= " + data.filterAdvanced.toTipo_de_Cambio;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura)
	|| (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_de_Factura, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Factura).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_de_Factura, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Factura).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_Estimada_de_llegada != 'undefined' && data.filterAdvanced.fromFecha_Estimada_de_llegada)
	|| (typeof data.filterAdvanced.toFecha_Estimada_de_llegada != 'undefined' && data.filterAdvanced.toFecha_Estimada_de_llegada)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Estimada_de_llegada != 'undefined' && data.filterAdvanced.fromFecha_Estimada_de_llegada) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_Estimada_de_llegada, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Estimada_de_llegada).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Estimada_de_llegada != 'undefined' && data.filterAdvanced.toFecha_Estimada_de_llegada) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_Estimada_de_llegada, 102)  <= '" + moment(data.filterAdvanced.toFecha_Estimada_de_llegada).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_Real_de_llegada != 'undefined' && data.filterAdvanced.fromFecha_Real_de_llegada)
	|| (typeof data.filterAdvanced.toFecha_Real_de_llegada != 'undefined' && data.filterAdvanced.toFecha_Real_de_llegada)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Real_de_llegada != 'undefined' && data.filterAdvanced.fromFecha_Real_de_llegada) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_Real_de_llegada, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Real_de_llegada).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Real_de_llegada != 'undefined' && data.filterAdvanced.toFecha_Real_de_llegada) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_Real_de_llegada, 102)  <= '" + moment(data.filterAdvanced.toFecha_Real_de_llegada).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Se_mantiene_el_No__de_Parte != 'undefined' && data.filterAdvanced.Se_mantiene_el_No__de_Parte)) {
      switch (data.filterAdvanced.Se_mantiene_el_No__de_ParteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Requerido.Descripcion LIKE '" + data.filterAdvanced.Se_mantiene_el_No__de_Parte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Requerido.Descripcion LIKE '%" + data.filterAdvanced.Se_mantiene_el_No__de_Parte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Requerido.Descripcion LIKE '%" + data.filterAdvanced.Se_mantiene_el_No__de_Parte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Requerido.Descripcion = '" + data.filterAdvanced.Se_mantiene_el_No__de_Parte + "'";
          break;
      }
    } else if (data.filterAdvanced.Se_mantiene_el_No__de_ParteMultiple != null && data.filterAdvanced.Se_mantiene_el_No__de_ParteMultiple.length > 0) {
      var Se_mantiene_el_No__de_Parteds = data.filterAdvanced.Se_mantiene_el_No__de_ParteMultiple.join(",");
      condition += " AND Ingreso_a_almacen.Se_mantiene_el_No__de_Parte In (" + Se_mantiene_el_No__de_Parteds + ")";
    }
    switch (data.filterAdvanced.No__de_SerieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.No__de_Serie LIKE '" + data.filterAdvanced.No__de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.No__de_Serie LIKE '%" + data.filterAdvanced.No__de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.No__de_Serie LIKE '%" + data.filterAdvanced.No__de_Serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.No__de_Serie = '" + data.filterAdvanced.No__de_Serie + "'";
        break;
    }
    switch (data.filterAdvanced.No__de_LoteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.No__de_Lote LIKE '" + data.filterAdvanced.No__de_Lote + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.No__de_Lote LIKE '%" + data.filterAdvanced.No__de_Lote + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.No__de_Lote LIKE '%" + data.filterAdvanced.No__de_Lote + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.No__de_Lote = '" + data.filterAdvanced.No__de_Lote + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromHoras_acumuladas != 'undefined' && data.filterAdvanced.fromHoras_acumuladas)
	|| (typeof data.filterAdvanced.toHoras_acumuladas != 'undefined' && data.filterAdvanced.toHoras_acumuladas)) 
	{
      if (typeof data.filterAdvanced.fromHoras_acumuladas != 'undefined' && data.filterAdvanced.fromHoras_acumuladas)
        condition += " AND Ingreso_a_almacen.Horas_acumuladas >= " + data.filterAdvanced.fromHoras_acumuladas;

      if (typeof data.filterAdvanced.toHoras_acumuladas != 'undefined' && data.filterAdvanced.toHoras_acumuladas) 
        condition += " AND Ingreso_a_almacen.Horas_acumuladas <= " + data.filterAdvanced.toHoras_acumuladas;
    }
    if ((typeof data.filterAdvanced.fromCiclos_acumulados != 'undefined' && data.filterAdvanced.fromCiclos_acumulados)
	|| (typeof data.filterAdvanced.toCiclos_acumulados != 'undefined' && data.filterAdvanced.toCiclos_acumulados)) 
	{
      if (typeof data.filterAdvanced.fromCiclos_acumulados != 'undefined' && data.filterAdvanced.fromCiclos_acumulados)
        condition += " AND Ingreso_a_almacen.Ciclos_acumulados >= " + data.filterAdvanced.fromCiclos_acumulados;

      if (typeof data.filterAdvanced.toCiclos_acumulados != 'undefined' && data.filterAdvanced.toCiclos_acumulados) 
        condition += " AND Ingreso_a_almacen.Ciclos_acumulados <= " + data.filterAdvanced.toCiclos_acumulados;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_de_vencimiento, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_de_vencimiento, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Ubicacion_en_AlmacenFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.Ubicacion_en_Almacen LIKE '" + data.filterAdvanced.Ubicacion_en_Almacen + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.Ubicacion_en_Almacen LIKE '%" + data.filterAdvanced.Ubicacion_en_Almacen + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.Ubicacion_en_Almacen LIKE '%" + data.filterAdvanced.Ubicacion_en_Almacen + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.Ubicacion_en_Almacen = '" + data.filterAdvanced.Ubicacion_en_Almacen + "'";
        break;
    }
    switch (data.filterAdvanced.Linea_de_AlmacenFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.Linea_de_Almacen LIKE '" + data.filterAdvanced.Linea_de_Almacen + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.Linea_de_Almacen LIKE '%" + data.filterAdvanced.Linea_de_Almacen + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.Linea_de_Almacen LIKE '%" + data.filterAdvanced.Linea_de_Almacen + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.Linea_de_Almacen = '" + data.filterAdvanced.Linea_de_Almacen + "'";
        break;
    }
    switch (data.filterAdvanced.UbicacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.Ubicacion LIKE '" + data.filterAdvanced.Ubicacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.Ubicacion LIKE '%" + data.filterAdvanced.Ubicacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.Ubicacion LIKE '%" + data.filterAdvanced.Ubicacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.Ubicacion = '" + data.filterAdvanced.Ubicacion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Condicion != 'undefined' && data.filterAdvanced.Condicion)) {
      switch (data.filterAdvanced.CondicionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Condicion_del_item.Condicion LIKE '" + data.filterAdvanced.Condicion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Condicion_del_item.Condicion LIKE '%" + data.filterAdvanced.Condicion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Condicion_del_item.Condicion LIKE '%" + data.filterAdvanced.Condicion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Condicion_del_item.Condicion = '" + data.filterAdvanced.Condicion + "'";
          break;
      }
    } else if (data.filterAdvanced.CondicionMultiple != null && data.filterAdvanced.CondicionMultiple.length > 0) {
      var Condicionds = data.filterAdvanced.CondicionMultiple.join(",");
      condition += " AND Ingreso_a_almacen.Condicion In (" + Condicionds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Expiracion != 'undefined' && data.filterAdvanced.fromFecha_de_Expiracion)
	|| (typeof data.filterAdvanced.toFecha_de_Expiracion != 'undefined' && data.filterAdvanced.toFecha_de_Expiracion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Expiracion != 'undefined' && data.filterAdvanced.fromFecha_de_Expiracion) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_de_Expiracion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Expiracion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Expiracion != 'undefined' && data.filterAdvanced.toFecha_de_Expiracion) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_a_almacen.Fecha_de_Expiracion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Expiracion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromControl_de_Temperatura != 'undefined' && data.filterAdvanced.fromControl_de_Temperatura)
	|| (typeof data.filterAdvanced.toControl_de_Temperatura != 'undefined' && data.filterAdvanced.toControl_de_Temperatura)) 
	{
      if (typeof data.filterAdvanced.fromControl_de_Temperatura != 'undefined' && data.filterAdvanced.fromControl_de_Temperatura)
        condition += " AND Ingreso_a_almacen.Control_de_Temperatura >= " + data.filterAdvanced.fromControl_de_Temperatura;

      if (typeof data.filterAdvanced.toControl_de_Temperatura != 'undefined' && data.filterAdvanced.toControl_de_Temperatura) 
        condition += " AND Ingreso_a_almacen.Control_de_Temperatura <= " + data.filterAdvanced.toControl_de_Temperatura;
    }
    switch (data.filterAdvanced.Identificacion_de_HerramientaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.Identificacion_de_Herramienta LIKE '" + data.filterAdvanced.Identificacion_de_Herramienta + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.Identificacion_de_Herramienta LIKE '%" + data.filterAdvanced.Identificacion_de_Herramienta + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.Identificacion_de_Herramienta LIKE '%" + data.filterAdvanced.Identificacion_de_Herramienta + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.Identificacion_de_Herramienta = '" + data.filterAdvanced.Identificacion_de_Herramienta + "'";
        break;
    }
    switch (data.filterAdvanced.No__Parte_NuevoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.No__Parte_Nuevo LIKE '" + data.filterAdvanced.No__Parte_Nuevo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.No__Parte_Nuevo LIKE '%" + data.filterAdvanced.No__Parte_Nuevo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.No__Parte_Nuevo LIKE '%" + data.filterAdvanced.No__Parte_Nuevo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.No__Parte_Nuevo = '" + data.filterAdvanced.No__Parte_Nuevo + "'";
        break;
    }
    switch (data.filterAdvanced.IdIngresoAlmacenFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_a_almacen.IdIngresoAlmacen LIKE '" + data.filterAdvanced.IdIngresoAlmacen + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_a_almacen.IdIngresoAlmacen LIKE '%" + data.filterAdvanced.IdIngresoAlmacen + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_a_almacen.IdIngresoAlmacen LIKE '%" + data.filterAdvanced.IdIngresoAlmacen + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_a_almacen.IdIngresoAlmacen = '" + data.filterAdvanced.IdIngresoAlmacen + "'";
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
              const longest = result.Ingreso_a_almacens.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ingreso_a_almacens);
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
