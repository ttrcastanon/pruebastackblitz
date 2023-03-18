import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Costos_de_ImportacionService } from "src/app/api-services/Costos_de_Importacion.service";
import { Costos_de_Importacion } from "src/app/models/Costos_de_Importacion";
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
import { Costos_de_ImportacionIndexRules } from 'src/app/shared/businessRules/Costos_de_Importacion-index-rules';
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
  selector: "app-list-Costos_de_Importacion",
  templateUrl: "./list-Costos_de_Importacion.component.html",
  styleUrls: ["./list-Costos_de_Importacion.component.scss"],
})
export class ListCostos_de_ImportacionComponent extends Costos_de_ImportacionIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Miscelaneas",
    "No__items_asociados",
    "Transporte",
    "Costo_flete_",
    "Tipo_de_Cambio_T",
    "No__de_Factura_T",
    "Fecha_de_Factura_T",
    "Servicios_Aduanales",
    "Costo_Servicios_",
    "Tipo_de_Cambio_SA",
    "No__de_Factura_SA",
    "Fecha_de_Factura_SA",
    //"Impuestos_Aduanales",
    "Costo_Impuesto_",
    "Tipo_de_Cambio_IA",
    "No__de_Factura_IA",
    "No__de_Factura_IA2",
    "Clave_de_Pedimento",
    "No__de_Pedimento",
    "No__de_Guia",
    "FolioGestionIportacion",
    "FolioCostosImportacion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Miscelaneas",
      "No__items_asociados",
      "Transporte",
      "Costo_flete_",
      "Tipo_de_Cambio_T",
      "No__de_Factura_T",
      "Fecha_de_Factura_T",
      "Servicios_Aduanales",
      "Costo_Servicios_",
      "Tipo_de_Cambio_SA",
      "No__de_Factura_SA",
      "Fecha_de_Factura_SA",
      //"Impuestos_Aduanales",
      "Costo_Impuesto_",
      "Tipo_de_Cambio_IA",
      "No__de_Factura_IA",
      "No__de_Factura_IA2",
      "Clave_de_Pedimento",
      "No__de_Pedimento",
      "No__de_Guia",
      "FolioGestionIportacion",
      "FolioCostosImportacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Miscelaneas_filtro",
      "No__items_asociados_filtro",
      "Transporte_filtro",
      "Costo_flete__filtro",
      "Tipo_de_Cambio_T_filtro",
      "No__de_Factura_T_filtro",
      "Fecha_de_Factura_T_filtro",
      "Servicios_Aduanales_filtro",
      "Costo_Servicios__filtro",
      "Tipo_de_Cambio_SA_filtro",
      "No__de_Factura_SA_filtro",
      "Fecha_de_Factura_SA_filtro",
      //"Impuestos_Aduanales_filtro",
      "Costo_Impuesto__filtro",
      "Tipo_de_Cambio_IA_filtro",
      "No__de_Factura_IA_filtro",
      "No__de_Factura_IA2_filtro",
      "Clave_de_Pedimento_filtro",
      "No__de_Pedimento_filtro",
      "No__de_Guia_filtro",
      "FolioGestionIportacion_filtro",
      "FolioCostosImportacion_filtro",

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
      Miscelaneas: "",
      No__items_asociados: "",
      Transporte: "",
      Costo_flete_: "",
      Tipo_de_Cambio_T: "",
      No__de_Factura_T: "",
      Fecha_de_Factura_T: null,
      Servicios_Aduanales: "",
      Costo_Servicios_: "",
      Tipo_de_Cambio_SA: "",
      No__de_Factura_SA: "",
      Fecha_de_Factura_SA: null,
      Impuestos_Aduanales: "",
      Costo_Impuesto_: "",
      Tipo_de_Cambio_IA: "",
      No__de_Factura_IA: "",
      No__de_Factura_IA2: null,
      Clave_de_Pedimento: "",
      No__de_Pedimento: "",
      No__de_Guia: "",
      FolioGestionIportacion: "",
      FolioCostosImportacion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MiscelaneasFilter: "",
      Miscelaneas: "",
      MiscelaneasMultiple: "",
      fromNo__items_asociados: "",
      toNo__items_asociados: "",
      TransporteFilter: "",
      Transporte: "",
      TransporteMultiple: "",
      fromCosto_flete_: "",
      toCosto_flete_: "",
      fromTipo_de_Cambio_T: "",
      toTipo_de_Cambio_T: "",
      fromFecha_de_Factura_T: "",
      toFecha_de_Factura_T: "",
      Servicios_AduanalesFilter: "",
      Servicios_Aduanales: "",
      Servicios_AduanalesMultiple: "",
      fromCosto_Servicios_: "",
      toCosto_Servicios_: "",
      fromTipo_de_Cambio_SA: "",
      toTipo_de_Cambio_SA: "",
      fromFecha_de_Factura_SA: "",
      toFecha_de_Factura_SA: "",
      fromCosto_Impuesto_: "",
      toCosto_Impuesto_: "",
      fromTipo_de_Cambio_IA: "",
      toTipo_de_Cambio_IA: "",
      fromNo__de_Factura_IA2: "",
      toNo__de_Factura_IA2: "",
      fromNo__de_Pedimento: "",
      toNo__de_Pedimento: "",
      fromNo__de_Guia: "",
      toNo__de_Guia: "",
      FolioGestionIportacionFilter: "",
      FolioGestionIportacion: "",
      FolioGestionIportacionMultiple: "",

    }
  };

  dataSource: Costos_de_ImportacionDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Costos_de_ImportacionDataSource;
  dataClipboard: any;

  constructor(
    private _Costos_de_ImportacionService: Costos_de_ImportacionService,
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
    this.dataSource = new Costos_de_ImportacionDataSource(
      this._Costos_de_ImportacionService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Costos_de_Importacion)
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
    this.listConfig.filter.Miscelaneas = "";
    this.listConfig.filter.No__items_asociados = "";
    this.listConfig.filter.Transporte = "";
    this.listConfig.filter.Costo_flete_ = "";
    this.listConfig.filter.Tipo_de_Cambio_T = "";
    this.listConfig.filter.No__de_Factura_T = "";
    this.listConfig.filter.Fecha_de_Factura_T = undefined;
    this.listConfig.filter.Servicios_Aduanales = "";
    this.listConfig.filter.Costo_Servicios_ = "";
    this.listConfig.filter.Tipo_de_Cambio_SA = "";
    this.listConfig.filter.No__de_Factura_SA = "";
    this.listConfig.filter.Fecha_de_Factura_SA = undefined;
    this.listConfig.filter.Impuestos_Aduanales = "";
    this.listConfig.filter.Costo_Impuesto_ = "";
    this.listConfig.filter.Tipo_de_Cambio_IA = "";
    this.listConfig.filter.No__de_Factura_IA = "";
    this.listConfig.filter.No__de_Factura_IA2 = undefined;
    this.listConfig.filter.Clave_de_Pedimento = "";
    this.listConfig.filter.No__de_Pedimento = "";
    this.listConfig.filter.No__de_Guia = "";
    this.listConfig.filter.FolioGestionIportacion = "";
    this.listConfig.filter.FolioCostosImportacion = "";

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

  remove(row: Costos_de_Importacion) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Costos_de_ImportacionService
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
  ActionPrint(dataRow: Costos_de_Importacion) {

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
,'¿Misceláneas?'
,'No. items asociados'
,'Transporte'
,'Costo flete $'
,'Tipo de Cambio'
,'No. de Factura'
,'Fecha de Factura'
,'Agencia Aduanal'
,'Costo Servicios $'
,'Impuestos Aduanales'
,'Costo Impuesto $'
,'Tipo de Cambio IA'
,'No. de Factura IA'
,'No. de Factura IA2'
,'Clave de Pedimento'
,'No. de Pedimento'
,'No. de Guía'
,'FolioGestionIportacion'
,'FolioCostosImportacion'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Miscelaneas_Tipo_de_Miscelaneas.Descripcion
,x.No__items_asociados
,x.Transporte_Tipo_de_Transporte.Descripcion
,x.Costo_flete_
,x.Tipo_de_Cambio_T
,x.No__de_Factura_T
,x.Fecha_de_Factura_T
,x.Servicios_Aduanales_Servicios_Aduanales.Descripcion
,x.Costo_Servicios_
,x.Tipo_de_Cambio_SA
,x.No__de_Factura_SA
,x.Fecha_de_Factura_SA
,x.Impuestos_Aduanales
,x.Costo_Impuesto_
,x.Tipo_de_Cambio_IA
,x.No__de_Factura_IA
,x.No__de_Factura_IA2
,x.Clave_de_Pedimento
,x.No__de_Pedimento
,x.No__de_Guia
,x.FolioGestionIportacion_Gestion_de_Importacion.FolioGestiondeImportacion
,x.FolioCostosImportacion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Costos_de_Importacion.pdf');
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
          this._Costos_de_ImportacionService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Costos_de_Importacions;
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
          this._Costos_de_ImportacionService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Costos_de_Importacions;
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
        '¿Misceláneas? ': fields.Miscelaneas_Tipo_de_Miscelaneas.Descripcion,
        'No. items asociados ': fields.No__items_asociados,
        'Transporte ': fields.Transporte_Tipo_de_Transporte.Descripcion,
        'Costo flete $ ': fields.Costo_flete_,
        'Tipo de Cambio ': fields.Tipo_de_Cambio_T,
        'No. de Factura ': fields.No__de_Factura_T,
        'Fecha de Factura ': fields.Fecha_de_Factura_T ? momentJS(fields.Fecha_de_Factura_T).format('DD/MM/YYYY') : '',
        'Agencia Aduanal ': fields.Servicios_Aduanales_Servicios_Aduanales.Descripcion,
        'Costo Servicios $ ': fields.Costo_Servicios_,
        'Tipo de Cambio Sa': fields.Tipo_de_Cambio_SA,
        'No. de Factura Sa': fields.No__de_Factura_SA,
        'Fecha de Factura Sa': fields.Fecha_de_Factura_SA ? momentJS(fields.Fecha_de_Factura_SA).format('DD/MM/YYYY') : '',
        'Impuestos Aduanales ': fields.Impuestos_Aduanales,
        'Costo Impuesto $ ': fields.Costo_Impuesto_,
        'Tipo de Cambio IA ': fields.Tipo_de_Cambio_IA,
        'No. de Factura IA ': fields.No__de_Factura_IA,
        'No. de Factura IA2 ': fields.No__de_Factura_IA2 ? momentJS(fields.No__de_Factura_IA2).format('DD/MM/YYYY') : '',
        'Clave de Pedimento ': fields.Clave_de_Pedimento,
        'No. de Pedimento ': fields.No__de_Pedimento,
        'No. de Guía ': fields.No__de_Guia,
        'FolioGestionIportacion ': fields.FolioGestionIportacion_Gestion_de_Importacion.FolioGestiondeImportacion,
        'FolioCostosImportacion ': fields.FolioCostosImportacion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Costos_de_Importacion  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Miscelaneas: x.Miscelaneas_Tipo_de_Miscelaneas.Descripcion,
      No__items_asociados: x.No__items_asociados,
      Transporte: x.Transporte_Tipo_de_Transporte.Descripcion,
      Costo_flete_: x.Costo_flete_,
      Tipo_de_Cambio_T: x.Tipo_de_Cambio_T,
      No__de_Factura_T: x.No__de_Factura_T,
      Fecha_de_Factura_T: x.Fecha_de_Factura_T,
      Servicios_Aduanales: x.Servicios_Aduanales_Servicios_Aduanales.Descripcion,
      Costo_Servicios_: x.Costo_Servicios_,
      Tipo_de_Cambio_SA: x.Tipo_de_Cambio_SA,
      No__de_Factura_SA: x.No__de_Factura_SA,
      Fecha_de_Factura_SA: x.Fecha_de_Factura_SA,
      Impuestos_Aduanales: x.Impuestos_Aduanales,
      Costo_Impuesto_: x.Costo_Impuesto_,
      Tipo_de_Cambio_IA: x.Tipo_de_Cambio_IA,
      No__de_Factura_IA: x.No__de_Factura_IA,
      No__de_Factura_IA2: x.No__de_Factura_IA2,
      Clave_de_Pedimento: x.Clave_de_Pedimento,
      No__de_Pedimento: x.No__de_Pedimento,
      No__de_Guia: x.No__de_Guia,
      FolioGestionIportacion: x.FolioGestionIportacion_Gestion_de_Importacion.FolioGestiondeImportacion,
      FolioCostosImportacion: x.FolioCostosImportacion,

    }));

    this.excelService.exportToCsv(result, 'Costos_de_Importacion',  ['Folio'    ,'Miscelaneas'  ,'No__items_asociados'  ,'Transporte'  ,'Costo_flete_'  ,'Tipo_de_Cambio_T'  ,'No__de_Factura_T'  ,'Fecha_de_Factura_T'  ,'Servicios_Aduanales'  ,'Costo_Servicios_'  ,'Tipo_de_Cambio_SA'  ,'No__de_Factura_SA'  ,'Fecha_de_Factura_SA'  ,'Impuestos_Aduanales'  ,'Costo_Impuesto_'  ,'Tipo_de_Cambio_IA'  ,'No__de_Factura_IA'  ,'No__de_Factura_IA2'  ,'Clave_de_Pedimento'  ,'No__de_Pedimento'  ,'No__de_Guia'  ,'FolioGestionIportacion'  ,'FolioCostosImportacion' ]);
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
    template += '          <th>¿Misceláneas?</th>';
    template += '          <th>No. items asociados</th>';
    template += '          <th>Transporte</th>';
    template += '          <th>Costo flete $</th>';
    template += '          <th>Tipo de Cambio</th>';
    template += '          <th>No. de Factura</th>';
    template += '          <th>Fecha de Factura</th>';
    template += '          <th>Agencia Aduanal</th>';
    template += '          <th>Costo Servicios $</th>';
    template += '          <th>Impuestos Aduanales</th>';
    template += '          <th>Costo Impuesto $</th>';
    template += '          <th>Tipo de Cambio IA</th>';
    template += '          <th>No. de Factura IA</th>';
    template += '          <th>No. de Factura IA2</th>';
    template += '          <th>Clave de Pedimento</th>';
    template += '          <th>No. de Pedimento</th>';
    template += '          <th>No. de Guía</th>';
    template += '          <th>FolioGestionIportacion</th>';
    template += '          <th>FolioCostosImportacion</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Miscelaneas_Tipo_de_Miscelaneas.Descripcion + '</td>';
      template += '          <td>' + element.No__items_asociados + '</td>';
      template += '          <td>' + element.Transporte_Tipo_de_Transporte.Descripcion + '</td>';
      template += '          <td>' + element.Costo_flete_ + '</td>';
      template += '          <td>' + element.Tipo_de_Cambio_T + '</td>';
      template += '          <td>' + element.No__de_Factura_T + '</td>';
      template += '          <td>' + element.Fecha_de_Factura_T + '</td>';
      template += '          <td>' + element.Servicios_Aduanales_Servicios_Aduanales.Descripcion + '</td>';
      template += '          <td>' + element.Costo_Servicios_ + '</td>';
      template += '          <td>' + element.Tipo_de_Cambio_SA + '</td>';
      template += '          <td>' + element.No__de_Factura_SA + '</td>';
      template += '          <td>' + element.Fecha_de_Factura_SA + '</td>';
      template += '          <td>' + element.Impuestos_Aduanales + '</td>';
      template += '          <td>' + element.Costo_Impuesto_ + '</td>';
      template += '          <td>' + element.Tipo_de_Cambio_IA + '</td>';
      template += '          <td>' + element.No__de_Factura_IA + '</td>';
      template += '          <td>' + element.No__de_Factura_IA2 + '</td>';
      template += '          <td>' + element.Clave_de_Pedimento + '</td>';
      template += '          <td>' + element.No__de_Pedimento + '</td>';
      template += '          <td>' + element.No__de_Guia + '</td>';
      template += '          <td>' + element.FolioGestionIportacion_Gestion_de_Importacion.FolioGestiondeImportacion + '</td>';
      template += '          <td>' + element.FolioCostosImportacion + '</td>';
		  
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
	template += '\t ¿Misceláneas?';
	template += '\t No. items asociados';
	template += '\t Transporte';
	template += '\t Costo flete $';
	template += '\t Tipo de Cambio';
	template += '\t No. de Factura';
	template += '\t Fecha de Factura';
	template += '\t Agencia Aduanal';
	template += '\t Costo Servicios $';
	template += '\t Impuestos Aduanales';
	template += '\t Costo Impuesto $';
	template += '\t Tipo de Cambio IA';
	template += '\t No. de Factura IA';
	template += '\t No. de Factura IA2';
	template += '\t Clave de Pedimento';
	template += '\t No. de Pedimento';
	template += '\t No. de Guía';
	template += '\t FolioGestionIportacion';
	template += '\t FolioCostosImportacion';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Miscelaneas_Tipo_de_Miscelaneas.Descripcion;
	  template += '\t ' + element.No__items_asociados;
      template += '\t ' + element.Transporte_Tipo_de_Transporte.Descripcion;
	  template += '\t ' + element.Costo_flete_;
	  template += '\t ' + element.Tipo_de_Cambio_T;
	  template += '\t ' + element.No__de_Factura_T;
	  template += '\t ' + element.Fecha_de_Factura_T;
      template += '\t ' + element.Servicios_Aduanales_Servicios_Aduanales.Descripcion;
	  template += '\t ' + element.Costo_Servicios_;
	  template += '\t ' + element.Tipo_de_Cambio_SA;
	  template += '\t ' + element.No__de_Factura_SA;
	  template += '\t ' + element.Fecha_de_Factura_SA;
	  template += '\t ' + element.Impuestos_Aduanales;
	  template += '\t ' + element.Costo_Impuesto_;
	  template += '\t ' + element.Tipo_de_Cambio_IA;
	  template += '\t ' + element.No__de_Factura_IA;
	  template += '\t ' + element.No__de_Factura_IA2;
	  template += '\t ' + element.Clave_de_Pedimento;
	  template += '\t ' + element.No__de_Pedimento;
	  template += '\t ' + element.No__de_Guia;
      template += '\t ' + element.FolioGestionIportacion_Gestion_de_Importacion.FolioGestiondeImportacion;
	  template += '\t ' + element.FolioCostosImportacion;

	  template += '\n';
    });

    return template;
  }

}

export class Costos_de_ImportacionDataSource implements DataSource<Costos_de_Importacion>
{
  private subject = new BehaviorSubject<Costos_de_Importacion[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Costos_de_ImportacionService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Costos_de_Importacion[]> {
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
              const longest = result.Costos_de_Importacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Costos_de_Importacions);
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
      condition += " and Costos_de_Importacion.Folio = " + data.filter.Folio;
    if (data.filter.Miscelaneas != "")
      condition += " and Tipo_de_Miscelaneas.Descripcion like '%" + data.filter.Miscelaneas + "%' ";
    if (data.filter.No__items_asociados != "")
      condition += " and Costos_de_Importacion.No__items_asociados = " + data.filter.No__items_asociados;
    if (data.filter.Transporte != "")
      condition += " and Tipo_de_Transporte.Descripcion like '%" + data.filter.Transporte + "%' ";
    if (data.filter.Costo_flete_ != "")
      condition += " and Costos_de_Importacion.Costo_flete_ = " + data.filter.Costo_flete_;
    if (data.filter.Tipo_de_Cambio_T != "")
      condition += " and Costos_de_Importacion.Tipo_de_Cambio_T = " + data.filter.Tipo_de_Cambio_T;
    if (data.filter.No__de_Factura_T != "")
      condition += " and Costos_de_Importacion.No__de_Factura_T like '%" + data.filter.No__de_Factura_T + "%' ";
    if (data.filter.Fecha_de_Factura_T)
      condition += " and CONVERT(VARCHAR(10), Costos_de_Importacion.Fecha_de_Factura_T, 102)  = '" + moment(data.filter.Fecha_de_Factura_T).format("YYYY.MM.DD") + "'";
    if (data.filter.Servicios_Aduanales != "")
      condition += " and Servicios_Aduanales.Descripcion like '%" + data.filter.Servicios_Aduanales + "%' ";
    if (data.filter.Costo_Servicios_ != "")
      condition += " and Costos_de_Importacion.Costo_Servicios_ = " + data.filter.Costo_Servicios_;
    if (data.filter.Tipo_de_Cambio_SA != "")
      condition += " and Costos_de_Importacion.Tipo_de_Cambio_SA = " + data.filter.Tipo_de_Cambio_SA;
    if (data.filter.No__de_Factura_SA != "")
      condition += " and Costos_de_Importacion.No__de_Factura_SA like '%" + data.filter.No__de_Factura_SA + "%' ";
    if (data.filter.Fecha_de_Factura_SA)
      condition += " and CONVERT(VARCHAR(10), Costos_de_Importacion.Fecha_de_Factura_SA, 102)  = '" + moment(data.filter.Fecha_de_Factura_SA).format("YYYY.MM.DD") + "'";
    if (data.filter.Impuestos_Aduanales != "")
      condition += " and Costos_de_Importacion.Impuestos_Aduanales like '%" + data.filter.Impuestos_Aduanales + "%' ";
    if (data.filter.Costo_Impuesto_ != "")
      condition += " and Costos_de_Importacion.Costo_Impuesto_ = " + data.filter.Costo_Impuesto_;
    if (data.filter.Tipo_de_Cambio_IA != "")
      condition += " and Costos_de_Importacion.Tipo_de_Cambio_IA = " + data.filter.Tipo_de_Cambio_IA;
    if (data.filter.No__de_Factura_IA != "")
      condition += " and Costos_de_Importacion.No__de_Factura_IA like '%" + data.filter.No__de_Factura_IA + "%' ";
    if (data.filter.No__de_Factura_IA2)
      condition += " and CONVERT(VARCHAR(10), Costos_de_Importacion.No__de_Factura_IA2, 102)  = '" + moment(data.filter.No__de_Factura_IA2).format("YYYY.MM.DD") + "'";
    if (data.filter.Clave_de_Pedimento != "")
      condition += " and Costos_de_Importacion.Clave_de_Pedimento like '%" + data.filter.Clave_de_Pedimento + "%' ";
    if (data.filter.No__de_Pedimento != "")
      condition += " and Costos_de_Importacion.No__de_Pedimento = " + data.filter.No__de_Pedimento;
    if (data.filter.No__de_Guia != "")
      condition += " and Costos_de_Importacion.No__de_Guia = " + data.filter.No__de_Guia;
    if (data.filter.FolioGestionIportacion != "")
      condition += " and Gestion_de_Importacion.FolioGestiondeImportacion like '%" + data.filter.FolioGestionIportacion + "%' ";
    if (data.filter.FolioCostosImportacion != "")
      condition += " and Costos_de_Importacion.FolioCostosImportacion like '%" + data.filter.FolioCostosImportacion + "%' ";

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
        sort = " Costos_de_Importacion.Folio " + data.sortDirecction;
        break;
      case "Miscelaneas":
        sort = " Tipo_de_Miscelaneas.Descripcion " + data.sortDirecction;
        break;
      case "No__items_asociados":
        sort = " Costos_de_Importacion.No__items_asociados " + data.sortDirecction;
        break;
      case "Transporte":
        sort = " Tipo_de_Transporte.Descripcion " + data.sortDirecction;
        break;
      case "Costo_flete_":
        sort = " Costos_de_Importacion.Costo_flete_ " + data.sortDirecction;
        break;
      case "Tipo_de_Cambio_T":
        sort = " Costos_de_Importacion.Tipo_de_Cambio_T " + data.sortDirecction;
        break;
      case "No__de_Factura_T":
        sort = " Costos_de_Importacion.No__de_Factura_T " + data.sortDirecction;
        break;
      case "Fecha_de_Factura_T":
        sort = " Costos_de_Importacion.Fecha_de_Factura_T " + data.sortDirecction;
        break;
      case "Servicios_Aduanales":
        sort = " Servicios_Aduanales.Descripcion " + data.sortDirecction;
        break;
      case "Costo_Servicios_":
        sort = " Costos_de_Importacion.Costo_Servicios_ " + data.sortDirecction;
        break;
      case "Tipo_de_Cambio_SA":
        sort = " Costos_de_Importacion.Tipo_de_Cambio_SA " + data.sortDirecction;
        break;
      case "No__de_Factura_SA":
        sort = " Costos_de_Importacion.No__de_Factura_SA " + data.sortDirecction;
        break;
      case "Fecha_de_Factura_SA":
        sort = " Costos_de_Importacion.Fecha_de_Factura_SA " + data.sortDirecction;
        break;
      case "Impuestos_Aduanales":
        sort = " Costos_de_Importacion.Impuestos_Aduanales " + data.sortDirecction;
        break;
      case "Costo_Impuesto_":
        sort = " Costos_de_Importacion.Costo_Impuesto_ " + data.sortDirecction;
        break;
      case "Tipo_de_Cambio_IA":
        sort = " Costos_de_Importacion.Tipo_de_Cambio_IA " + data.sortDirecction;
        break;
      case "No__de_Factura_IA":
        sort = " Costos_de_Importacion.No__de_Factura_IA " + data.sortDirecction;
        break;
      case "No__de_Factura_IA2":
        sort = " Costos_de_Importacion.No__de_Factura_IA2 " + data.sortDirecction;
        break;
      case "Clave_de_Pedimento":
        sort = " Costos_de_Importacion.Clave_de_Pedimento " + data.sortDirecction;
        break;
      case "No__de_Pedimento":
        sort = " Costos_de_Importacion.No__de_Pedimento " + data.sortDirecction;
        break;
      case "No__de_Guia":
        sort = " Costos_de_Importacion.No__de_Guia " + data.sortDirecction;
        break;
      case "FolioGestionIportacion":
        sort = " Gestion_de_Importacion.FolioGestiondeImportacion " + data.sortDirecction;
        break;
      case "FolioCostosImportacion":
        sort = " Costos_de_Importacion.FolioCostosImportacion " + data.sortDirecction;
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
        condition += " AND Costos_de_Importacion.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Costos_de_Importacion.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Miscelaneas != 'undefined' && data.filterAdvanced.Miscelaneas)) {
      switch (data.filterAdvanced.MiscelaneasFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Miscelaneas.Descripcion LIKE '" + data.filterAdvanced.Miscelaneas + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Miscelaneas.Descripcion LIKE '%" + data.filterAdvanced.Miscelaneas + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Miscelaneas.Descripcion LIKE '%" + data.filterAdvanced.Miscelaneas + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Miscelaneas.Descripcion = '" + data.filterAdvanced.Miscelaneas + "'";
          break;
      }
    } else if (data.filterAdvanced.MiscelaneasMultiple != null && data.filterAdvanced.MiscelaneasMultiple.length > 0) {
      var Miscelaneasds = data.filterAdvanced.MiscelaneasMultiple.join(",");
      condition += " AND Costos_de_Importacion.Miscelaneas In (" + Miscelaneasds + ")";
    }
    if ((typeof data.filterAdvanced.fromNo__items_asociados != 'undefined' && data.filterAdvanced.fromNo__items_asociados)
	|| (typeof data.filterAdvanced.toNo__items_asociados != 'undefined' && data.filterAdvanced.toNo__items_asociados)) 
	{
      if (typeof data.filterAdvanced.fromNo__items_asociados != 'undefined' && data.filterAdvanced.fromNo__items_asociados)
        condition += " AND Costos_de_Importacion.No__items_asociados >= " + data.filterAdvanced.fromNo__items_asociados;

      if (typeof data.filterAdvanced.toNo__items_asociados != 'undefined' && data.filterAdvanced.toNo__items_asociados) 
        condition += " AND Costos_de_Importacion.No__items_asociados <= " + data.filterAdvanced.toNo__items_asociados;
    }
    if ((typeof data.filterAdvanced.Transporte != 'undefined' && data.filterAdvanced.Transporte)) {
      switch (data.filterAdvanced.TransporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Transporte.Descripcion LIKE '" + data.filterAdvanced.Transporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Transporte.Descripcion LIKE '%" + data.filterAdvanced.Transporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Transporte.Descripcion LIKE '%" + data.filterAdvanced.Transporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Transporte.Descripcion = '" + data.filterAdvanced.Transporte + "'";
          break;
      }
    } else if (data.filterAdvanced.TransporteMultiple != null && data.filterAdvanced.TransporteMultiple.length > 0) {
      var Transporteds = data.filterAdvanced.TransporteMultiple.join(",");
      condition += " AND Costos_de_Importacion.Transporte In (" + Transporteds + ")";
    }
    if ((typeof data.filterAdvanced.fromCosto_flete_ != 'undefined' && data.filterAdvanced.fromCosto_flete_)
	|| (typeof data.filterAdvanced.toCosto_flete_ != 'undefined' && data.filterAdvanced.toCosto_flete_)) 
	{
      if (typeof data.filterAdvanced.fromCosto_flete_ != 'undefined' && data.filterAdvanced.fromCosto_flete_)
        condition += " AND Costos_de_Importacion.Costo_flete_ >= " + data.filterAdvanced.fromCosto_flete_;

      if (typeof data.filterAdvanced.toCosto_flete_ != 'undefined' && data.filterAdvanced.toCosto_flete_) 
        condition += " AND Costos_de_Importacion.Costo_flete_ <= " + data.filterAdvanced.toCosto_flete_;
    }
    if ((typeof data.filterAdvanced.fromTipo_de_Cambio_T != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_T)
	|| (typeof data.filterAdvanced.toTipo_de_Cambio_T != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_T)) 
	{
      if (typeof data.filterAdvanced.fromTipo_de_Cambio_T != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_T)
        condition += " AND Costos_de_Importacion.Tipo_de_Cambio_T >= " + data.filterAdvanced.fromTipo_de_Cambio_T;

      if (typeof data.filterAdvanced.toTipo_de_Cambio_T != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_T) 
        condition += " AND Costos_de_Importacion.Tipo_de_Cambio_T <= " + data.filterAdvanced.toTipo_de_Cambio_T;
    }
    switch (data.filterAdvanced.No__de_Factura_TFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Costos_de_Importacion.No__de_Factura_T LIKE '" + data.filterAdvanced.No__de_Factura_T + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Costos_de_Importacion.No__de_Factura_T LIKE '%" + data.filterAdvanced.No__de_Factura_T + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Costos_de_Importacion.No__de_Factura_T LIKE '%" + data.filterAdvanced.No__de_Factura_T + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Costos_de_Importacion.No__de_Factura_T = '" + data.filterAdvanced.No__de_Factura_T + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Factura_T != 'undefined' && data.filterAdvanced.fromFecha_de_Factura_T)
	|| (typeof data.filterAdvanced.toFecha_de_Factura_T != 'undefined' && data.filterAdvanced.toFecha_de_Factura_T)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Factura_T != 'undefined' && data.filterAdvanced.fromFecha_de_Factura_T) 
        condition += " and CONVERT(VARCHAR(10), Costos_de_Importacion.Fecha_de_Factura_T, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Factura_T).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Factura_T != 'undefined' && data.filterAdvanced.toFecha_de_Factura_T) 
        condition += " and CONVERT(VARCHAR(10), Costos_de_Importacion.Fecha_de_Factura_T, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Factura_T).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Servicios_Aduanales != 'undefined' && data.filterAdvanced.Servicios_Aduanales)) {
      switch (data.filterAdvanced.Servicios_AduanalesFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Servicios_Aduanales.Descripcion LIKE '" + data.filterAdvanced.Servicios_Aduanales + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Servicios_Aduanales.Descripcion LIKE '%" + data.filterAdvanced.Servicios_Aduanales + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Servicios_Aduanales.Descripcion LIKE '%" + data.filterAdvanced.Servicios_Aduanales + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Servicios_Aduanales.Descripcion = '" + data.filterAdvanced.Servicios_Aduanales + "'";
          break;
      }
    } else if (data.filterAdvanced.Servicios_AduanalesMultiple != null && data.filterAdvanced.Servicios_AduanalesMultiple.length > 0) {
      var Servicios_Aduanalesds = data.filterAdvanced.Servicios_AduanalesMultiple.join(",");
      condition += " AND Costos_de_Importacion.Servicios_Aduanales In (" + Servicios_Aduanalesds + ")";
    }
    if ((typeof data.filterAdvanced.fromCosto_Servicios_ != 'undefined' && data.filterAdvanced.fromCosto_Servicios_)
	|| (typeof data.filterAdvanced.toCosto_Servicios_ != 'undefined' && data.filterAdvanced.toCosto_Servicios_)) 
	{
      if (typeof data.filterAdvanced.fromCosto_Servicios_ != 'undefined' && data.filterAdvanced.fromCosto_Servicios_)
        condition += " AND Costos_de_Importacion.Costo_Servicios_ >= " + data.filterAdvanced.fromCosto_Servicios_;

      if (typeof data.filterAdvanced.toCosto_Servicios_ != 'undefined' && data.filterAdvanced.toCosto_Servicios_) 
        condition += " AND Costos_de_Importacion.Costo_Servicios_ <= " + data.filterAdvanced.toCosto_Servicios_;
    }
    if ((typeof data.filterAdvanced.fromTipo_de_Cambio_SA != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_SA)
	|| (typeof data.filterAdvanced.toTipo_de_Cambio_SA != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_SA)) 
	{
      if (typeof data.filterAdvanced.fromTipo_de_Cambio_SA != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_SA)
        condition += " AND Costos_de_Importacion.Tipo_de_Cambio_SA >= " + data.filterAdvanced.fromTipo_de_Cambio_SA;

      if (typeof data.filterAdvanced.toTipo_de_Cambio_SA != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_SA) 
        condition += " AND Costos_de_Importacion.Tipo_de_Cambio_SA <= " + data.filterAdvanced.toTipo_de_Cambio_SA;
    }
    switch (data.filterAdvanced.No__de_Factura_SAFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Costos_de_Importacion.No__de_Factura_SA LIKE '" + data.filterAdvanced.No__de_Factura_SA + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Costos_de_Importacion.No__de_Factura_SA LIKE '%" + data.filterAdvanced.No__de_Factura_SA + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Costos_de_Importacion.No__de_Factura_SA LIKE '%" + data.filterAdvanced.No__de_Factura_SA + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Costos_de_Importacion.No__de_Factura_SA = '" + data.filterAdvanced.No__de_Factura_SA + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Factura_SA != 'undefined' && data.filterAdvanced.fromFecha_de_Factura_SA)
	|| (typeof data.filterAdvanced.toFecha_de_Factura_SA != 'undefined' && data.filterAdvanced.toFecha_de_Factura_SA)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Factura_SA != 'undefined' && data.filterAdvanced.fromFecha_de_Factura_SA) 
        condition += " and CONVERT(VARCHAR(10), Costos_de_Importacion.Fecha_de_Factura_SA, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Factura_SA).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Factura_SA != 'undefined' && data.filterAdvanced.toFecha_de_Factura_SA) 
        condition += " and CONVERT(VARCHAR(10), Costos_de_Importacion.Fecha_de_Factura_SA, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Factura_SA).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Impuestos_AduanalesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Costos_de_Importacion.Impuestos_Aduanales LIKE '" + data.filterAdvanced.Impuestos_Aduanales + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Costos_de_Importacion.Impuestos_Aduanales LIKE '%" + data.filterAdvanced.Impuestos_Aduanales + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Costos_de_Importacion.Impuestos_Aduanales LIKE '%" + data.filterAdvanced.Impuestos_Aduanales + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Costos_de_Importacion.Impuestos_Aduanales = '" + data.filterAdvanced.Impuestos_Aduanales + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromCosto_Impuesto_ != 'undefined' && data.filterAdvanced.fromCosto_Impuesto_)
	|| (typeof data.filterAdvanced.toCosto_Impuesto_ != 'undefined' && data.filterAdvanced.toCosto_Impuesto_)) 
	{
      if (typeof data.filterAdvanced.fromCosto_Impuesto_ != 'undefined' && data.filterAdvanced.fromCosto_Impuesto_)
        condition += " AND Costos_de_Importacion.Costo_Impuesto_ >= " + data.filterAdvanced.fromCosto_Impuesto_;

      if (typeof data.filterAdvanced.toCosto_Impuesto_ != 'undefined' && data.filterAdvanced.toCosto_Impuesto_) 
        condition += " AND Costos_de_Importacion.Costo_Impuesto_ <= " + data.filterAdvanced.toCosto_Impuesto_;
    }
    if ((typeof data.filterAdvanced.fromTipo_de_Cambio_IA != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_IA)
	|| (typeof data.filterAdvanced.toTipo_de_Cambio_IA != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_IA)) 
	{
      if (typeof data.filterAdvanced.fromTipo_de_Cambio_IA != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_IA)
        condition += " AND Costos_de_Importacion.Tipo_de_Cambio_IA >= " + data.filterAdvanced.fromTipo_de_Cambio_IA;

      if (typeof data.filterAdvanced.toTipo_de_Cambio_IA != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_IA) 
        condition += " AND Costos_de_Importacion.Tipo_de_Cambio_IA <= " + data.filterAdvanced.toTipo_de_Cambio_IA;
    }
    switch (data.filterAdvanced.No__de_Factura_IAFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Costos_de_Importacion.No__de_Factura_IA LIKE '" + data.filterAdvanced.No__de_Factura_IA + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Costos_de_Importacion.No__de_Factura_IA LIKE '%" + data.filterAdvanced.No__de_Factura_IA + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Costos_de_Importacion.No__de_Factura_IA LIKE '%" + data.filterAdvanced.No__de_Factura_IA + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Costos_de_Importacion.No__de_Factura_IA = '" + data.filterAdvanced.No__de_Factura_IA + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromNo__de_Factura_IA2 != 'undefined' && data.filterAdvanced.fromNo__de_Factura_IA2)
	|| (typeof data.filterAdvanced.toNo__de_Factura_IA2 != 'undefined' && data.filterAdvanced.toNo__de_Factura_IA2)) 
	{
      if (typeof data.filterAdvanced.fromNo__de_Factura_IA2 != 'undefined' && data.filterAdvanced.fromNo__de_Factura_IA2) 
        condition += " and CONVERT(VARCHAR(10), Costos_de_Importacion.No__de_Factura_IA2, 102)  >= '" +  moment(data.filterAdvanced.fromNo__de_Factura_IA2).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toNo__de_Factura_IA2 != 'undefined' && data.filterAdvanced.toNo__de_Factura_IA2) 
        condition += " and CONVERT(VARCHAR(10), Costos_de_Importacion.No__de_Factura_IA2, 102)  <= '" + moment(data.filterAdvanced.toNo__de_Factura_IA2).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Clave_de_PedimentoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Costos_de_Importacion.Clave_de_Pedimento LIKE '" + data.filterAdvanced.Clave_de_Pedimento + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Costos_de_Importacion.Clave_de_Pedimento LIKE '%" + data.filterAdvanced.Clave_de_Pedimento + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Costos_de_Importacion.Clave_de_Pedimento LIKE '%" + data.filterAdvanced.Clave_de_Pedimento + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Costos_de_Importacion.Clave_de_Pedimento = '" + data.filterAdvanced.Clave_de_Pedimento + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromNo__de_Pedimento != 'undefined' && data.filterAdvanced.fromNo__de_Pedimento)
	|| (typeof data.filterAdvanced.toNo__de_Pedimento != 'undefined' && data.filterAdvanced.toNo__de_Pedimento)) 
	{
      if (typeof data.filterAdvanced.fromNo__de_Pedimento != 'undefined' && data.filterAdvanced.fromNo__de_Pedimento)
        condition += " AND Costos_de_Importacion.No__de_Pedimento >= " + data.filterAdvanced.fromNo__de_Pedimento;

      if (typeof data.filterAdvanced.toNo__de_Pedimento != 'undefined' && data.filterAdvanced.toNo__de_Pedimento) 
        condition += " AND Costos_de_Importacion.No__de_Pedimento <= " + data.filterAdvanced.toNo__de_Pedimento;
    }
    if ((typeof data.filterAdvanced.fromNo__de_Guia != 'undefined' && data.filterAdvanced.fromNo__de_Guia)
	|| (typeof data.filterAdvanced.toNo__de_Guia != 'undefined' && data.filterAdvanced.toNo__de_Guia)) 
	{
      if (typeof data.filterAdvanced.fromNo__de_Guia != 'undefined' && data.filterAdvanced.fromNo__de_Guia)
        condition += " AND Costos_de_Importacion.No__de_Guia >= " + data.filterAdvanced.fromNo__de_Guia;

      if (typeof data.filterAdvanced.toNo__de_Guia != 'undefined' && data.filterAdvanced.toNo__de_Guia) 
        condition += " AND Costos_de_Importacion.No__de_Guia <= " + data.filterAdvanced.toNo__de_Guia;
    }
    if ((typeof data.filterAdvanced.FolioGestionIportacion != 'undefined' && data.filterAdvanced.FolioGestionIportacion)) {
      switch (data.filterAdvanced.FolioGestionIportacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Gestion_de_Importacion.FolioGestiondeImportacion LIKE '" + data.filterAdvanced.FolioGestionIportacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Gestion_de_Importacion.FolioGestiondeImportacion LIKE '%" + data.filterAdvanced.FolioGestionIportacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Gestion_de_Importacion.FolioGestiondeImportacion LIKE '%" + data.filterAdvanced.FolioGestionIportacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Gestion_de_Importacion.FolioGestiondeImportacion = '" + data.filterAdvanced.FolioGestionIportacion + "'";
          break;
      }
    } else if (data.filterAdvanced.FolioGestionIportacionMultiple != null && data.filterAdvanced.FolioGestionIportacionMultiple.length > 0) {
      var FolioGestionIportacionds = data.filterAdvanced.FolioGestionIportacionMultiple.join(",");
      condition += " AND Costos_de_Importacion.FolioGestionIportacion In (" + FolioGestionIportacionds + ")";
    }
    switch (data.filterAdvanced.FolioCostosImportacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Costos_de_Importacion.FolioCostosImportacion LIKE '" + data.filterAdvanced.FolioCostosImportacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Costos_de_Importacion.FolioCostosImportacion LIKE '%" + data.filterAdvanced.FolioCostosImportacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Costos_de_Importacion.FolioCostosImportacion LIKE '%" + data.filterAdvanced.FolioCostosImportacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Costos_de_Importacion.FolioCostosImportacion = '" + data.filterAdvanced.FolioCostosImportacion + "'";
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
              const longest = result.Costos_de_Importacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Costos_de_Importacions);
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
