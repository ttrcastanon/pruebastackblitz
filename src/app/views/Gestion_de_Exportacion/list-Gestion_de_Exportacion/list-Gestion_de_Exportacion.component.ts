import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Gestion_de_ExportacionService } from "src/app/api-services/Gestion_de_Exportacion.service";
import { Gestion_de_Exportacion } from "src/app/models/Gestion_de_Exportacion";
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
import { Gestion_de_ExportacionIndexRules } from 'src/app/shared/businessRules/Gestion_de_Exportacion-index-rules';
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
  selector: "app-list-Gestion_de_Exportacion",
  templateUrl: "./list-Gestion_de_Exportacion.component.html",
  styleUrls: ["./list-Gestion_de_Exportacion.component.scss"],
})
export class ListGestion_de_ExportacionComponent extends Gestion_de_ExportacionIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Transporte",
    "Costo_Flete_",
    "Tipo_de_Cambio_Transp_",
    "No__Factura",
    "Fecha_de_Factura",
    "Servicios_aduanales",
    "Costo_Servicios_",
    "Tipo_de_Cambio_Aduanales",
    "No__Factura_SA",
    "Fecha_de_Factura_2",
    //"Impuestos_Aduanales",
    "Costo_Impuestos_",
    "Tipo_de_Cambio_Imp_",
    "Clave_de_Pedimento",
    "No__de_Pedimento",
    "No__De_Guia",
    "Aplicacion",
    "FolioExportacion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Transporte",
      "Costo_Flete_",
      "Tipo_de_Cambio_Transp_",
      "No__Factura",
      "Fecha_de_Factura",
      "Servicios_aduanales",
      "Costo_Servicios_",
      "Tipo_de_Cambio_Aduanales",
      "No__Factura_SA",
      "Fecha_de_Factura_2",
      //"Impuestos_Aduanales",
      "Costo_Impuestos_",
      "Tipo_de_Cambio_Imp_",
      "Clave_de_Pedimento",
      "No__de_Pedimento",
      "No__De_Guia",
      "Aplicacion",
      "FolioExportacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Transporte_filtro",
      "Costo_Flete__filtro",
      "Tipo_de_Cambio_Transp__filtro",
      "No__Factura_filtro",
      "Fecha_de_Factura_filtro",
      "Servicios_aduanales_filtro",
      "Costo_Servicios__filtro",
      "Tipo_de_Cambio_Aduanales_filtro",
      "No__Factura_SA_filtro",
      "Fecha_de_Factura_2_filtro",
      //"Impuestos_Aduanales_filtro",
      "Costo_Impuestos__filtro",
      "Tipo_de_Cambio_Imp__filtro",
      "Clave_de_Pedimento_filtro",
      "No__de_Pedimento_filtro",
      "No__De_Guia_filtro",
      "Aplicacion_filtro",
      "FolioExportacion_filtro",

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
      Transporte: "",
      Costo_Flete_: "",
      Tipo_de_Cambio_Transp_: "",
      No__Factura: "",
      Fecha_de_Factura: null,
      Servicios_aduanales: "",
      Costo_Servicios_: "",
      Tipo_de_Cambio_Aduanales: "",
      No__Factura_SA: "",
      Fecha_de_Factura_2: null,
      //Impuestos_Aduanales: "",
      Costo_Impuestos_: "",
      Tipo_de_Cambio_Imp_: "",
      Clave_de_Pedimento: "",
      No__de_Pedimento: "",
      No__De_Guia: "",
      Aplicacion: "",
      FolioExportacion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromCosto_Flete_: "",
      toCosto_Flete_: "",
      fromTipo_de_Cambio_Transp_: "",
      toTipo_de_Cambio_Transp_: "",
      fromNo__Factura: "",
      toNo__Factura: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",
      Servicios_aduanalesFilter: "",
      Servicios_aduanales: "",
      Servicios_aduanalesMultiple: "",
      fromCosto_Servicios_: "",
      toCosto_Servicios_: "",
      fromTipo_de_Cambio_Aduanales: "",
      toTipo_de_Cambio_Aduanales: "",
      fromNo__Factura_SA: "",
      toNo__Factura_SA: "",
      fromFecha_de_Factura_2: "",
      toFecha_de_Factura_2: "",
      //fromImpuestos_Aduanales: "",
      //toImpuestos_Aduanales: "",
      fromCosto_Impuestos_: "",
      toCosto_Impuestos_: "",
      fromTipo_de_Cambio_Imp_: "",
      toTipo_de_Cambio_Imp_: "",
      fromNo__de_Pedimento: "",
      toNo__de_Pedimento: "",
      fromNo__De_Guia: "",
      toNo__De_Guia: "",

    }
  };

  dataSource: Gestion_de_ExportacionDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Gestion_de_ExportacionDataSource;
  dataClipboard: any;

  constructor(
    private _Gestion_de_ExportacionService: Gestion_de_ExportacionService,
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
    this.dataSource = new Gestion_de_ExportacionDataSource(
      this._Gestion_de_ExportacionService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Gestion_de_Exportacion)
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
    this.listConfig.filter.Transporte = "";
    this.listConfig.filter.Costo_Flete_ = "";
    this.listConfig.filter.Tipo_de_Cambio_Transp_ = "";
    this.listConfig.filter.No__Factura = "";
    this.listConfig.filter.Fecha_de_Factura = undefined;
    this.listConfig.filter.Servicios_aduanales = "";
    this.listConfig.filter.Costo_Servicios_ = "";
    this.listConfig.filter.Tipo_de_Cambio_Aduanales = "";
    this.listConfig.filter.No__Factura_SA = "";
    this.listConfig.filter.Fecha_de_Factura_2 = undefined;
    //this.listConfig.filter.Impuestos_Aduanales = "";
    this.listConfig.filter.Costo_Impuestos_ = "";
    this.listConfig.filter.Tipo_de_Cambio_Imp_ = "";
    this.listConfig.filter.Clave_de_Pedimento = "";
    this.listConfig.filter.No__de_Pedimento = "";
    this.listConfig.filter.No__De_Guia = "";
    this.listConfig.filter.Aplicacion = "";
    this.listConfig.filter.FolioExportacion = "";

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

  remove(row: Gestion_de_Exportacion) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Gestion_de_ExportacionService
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
  ActionPrint(dataRow: Gestion_de_Exportacion) {

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
,'Transporte'
,'Costo Flete $'
,'Tipo de Cambio Transp.'
,'No. Factura'
,'Fecha de Factura'
,'Agencia Aduanal'
,'Costo Servicios $'
,'Tipo de Cambio Aduanales'
,'No. Factura SA'
,'Fecha de Factura 2'
,'Impuestos Aduanales'
,'Costo Impuestos $'
,'Tipo de Cambio Imp.'
,'Clave de Pedimento'
,'No. de Pedimento'
,'No. De Guía'
,'Aplicación'
,'FolioExportacion'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Transporte
,x.Costo_Flete_
,x.Tipo_de_Cambio_Transp_
,x.No__Factura
,x.Fecha_de_Factura
,x.Servicios_aduanales_Servicios_Aduanales.Descripcion
,x.Costo_Servicios_
,x.Tipo_de_Cambio_Aduanales
,x.No__Factura_SA
,x.Fecha_de_Factura_2
//,x.Impuestos_Aduanales
,x.Costo_Impuestos_
,x.Tipo_de_Cambio_Imp_
,x.Clave_de_Pedimento
,x.No__de_Pedimento
,x.No__De_Guia
,x.Aplicacion
,x.FolioExportacion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Gestion_de_Exportacion.pdf');
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
          this._Gestion_de_ExportacionService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Gestion_de_Exportacions;
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
          this._Gestion_de_ExportacionService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Gestion_de_Exportacions;
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
        'Transporte ': fields.Transporte,
        'Costo Flete $ ': fields.Costo_Flete_,
        'Tipo de Cambio Transp. ': fields.Tipo_de_Cambio_Transp_,
        'No. Factura ': fields.No__Factura,
        'Fecha de Factura ': fields.Fecha_de_Factura ? momentJS(fields.Fecha_de_Factura).format('DD/MM/YYYY') : '',
        'Agencia Aduanal ': fields.Servicios_aduanales_Servicios_Aduanales.Descripcion,
        'Costo Servicios $ ': fields.Costo_Servicios_,
        'Tipo de Cambio Aduanales ': fields.Tipo_de_Cambio_Aduanales,
        'No. Factura SA ': fields.No__Factura_SA,
        'Fecha de Factura 2 ': fields.Fecha_de_Factura_2 ? momentJS(fields.Fecha_de_Factura_2).format('DD/MM/YYYY') : '',
        //'Impuestos Aduanales ': fields.Impuestos_Aduanales,
        'Costo Impuestos $ ': fields.Costo_Impuestos_,
        'Tipo de Cambio Imp. ': fields.Tipo_de_Cambio_Imp_,
        'Clave de Pedimento ': fields.Clave_de_Pedimento,
        'No. de Pedimento ': fields.No__de_Pedimento,
        'No. De Guía ': fields.No__De_Guia,
        'Aplicación ': fields.Aplicacion,
        'FolioExportacion ': fields.FolioExportacion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Gestion_de_Exportacion  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Transporte: x.Transporte,
      Costo_Flete_: x.Costo_Flete_,
      Tipo_de_Cambio_Transp_: x.Tipo_de_Cambio_Transp_,
      No__Factura: x.No__Factura,
      Fecha_de_Factura: x.Fecha_de_Factura,
      Servicios_aduanales: x.Servicios_aduanales_Servicios_Aduanales.Descripcion,
      Costo_Servicios_: x.Costo_Servicios_,
      Tipo_de_Cambio_Aduanales: x.Tipo_de_Cambio_Aduanales,
      No__Factura_SA: x.No__Factura_SA,
      Fecha_de_Factura_2: x.Fecha_de_Factura_2,
      //Impuestos_Aduanales: x.Impuestos_Aduanales,
      Costo_Impuestos_: x.Costo_Impuestos_,
      Tipo_de_Cambio_Imp_: x.Tipo_de_Cambio_Imp_,
      Clave_de_Pedimento: x.Clave_de_Pedimento,
      No__de_Pedimento: x.No__de_Pedimento,
      No__De_Guia: x.No__De_Guia,
      Aplicacion: x.Aplicacion,
      FolioExportacion: x.FolioExportacion,

    }));

    this.excelService.exportToCsv(result, 'Gestion_de_Exportacion',  ['Folio'    ,'Transporte'  ,'Costo_Flete_'  ,'Tipo_de_Cambio_Transp_'  ,'No__Factura'  ,'Fecha_de_Factura'  ,'Servicios_aduanales'  ,'Costo_Servicios_'  ,'Tipo_de_Cambio_Aduanales'  ,'No__Factura_SA'  ,'Fecha_de_Factura_2'  ,'Costo_Impuestos_'  ,'Tipo_de_Cambio_Imp_'  ,'Clave_de_Pedimento'  ,'No__de_Pedimento'  ,'No__De_Guia'  ,'Aplicacion'  ,'FolioExportacion' ]);
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
    template += '          <th>Transporte</th>';
    template += '          <th>Costo Flete $</th>';
    template += '          <th>Tipo de Cambio Transp.</th>';
    template += '          <th>No. Factura</th>';
    template += '          <th>Fecha de Factura</th>';
    template += '          <th>Agencia Aduanal</th>';
    template += '          <th>Costo Servicios $</th>';
    template += '          <th>Tipo de Cambio Aduanales</th>';
    template += '          <th>No. Factura SA</th>';
    template += '          <th>Fecha de Factura 2</th>';
    template += '          <th>Impuestos Aduanales</th>';
    template += '          <th>Costo Impuestos $</th>';
    template += '          <th>Tipo de Cambio Imp.</th>';
    template += '          <th>Clave de Pedimento</th>';
    template += '          <th>No. de Pedimento</th>';
    template += '          <th>No. De Guía</th>';
    template += '          <th>Aplicación</th>';
    template += '          <th>FolioExportacion</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Transporte + '</td>';
      template += '          <td>' + element.Costo_Flete_ + '</td>';
      template += '          <td>' + element.Tipo_de_Cambio_Transp_ + '</td>';
      template += '          <td>' + element.No__Factura + '</td>';
      template += '          <td>' + element.Fecha_de_Factura + '</td>';
      template += '          <td>' + element.Servicios_aduanales_Servicios_Aduanales.Descripcion + '</td>';
      template += '          <td>' + element.Costo_Servicios_ + '</td>';
      template += '          <td>' + element.Tipo_de_Cambio_Aduanales + '</td>';
      template += '          <td>' + element.No__Factura_SA + '</td>';
      template += '          <td>' + element.Fecha_de_Factura_2 + '</td>';
      //template += '          <td>' + element.Impuestos_Aduanales + '</td>';
      template += '          <td>' + element.Costo_Impuestos_ + '</td>';
      template += '          <td>' + element.Tipo_de_Cambio_Imp_ + '</td>';
      template += '          <td>' + element.Clave_de_Pedimento + '</td>';
      template += '          <td>' + element.No__de_Pedimento + '</td>';
      template += '          <td>' + element.No__De_Guia + '</td>';
      template += '          <td>' + element.Aplicacion + '</td>';
      template += '          <td>' + element.FolioExportacion + '</td>';
		  
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
	template += '\t Transporte';
	template += '\t Costo Flete $';
	template += '\t Tipo de Cambio Transp.';
	template += '\t No. Factura';
	template += '\t Fecha de Factura';
	template += '\t Agencia Aduanal';
	template += '\t Costo Servicios $';
	template += '\t Tipo de Cambio Aduanales';
	template += '\t No. Factura SA';
	template += '\t Fecha de Factura 2';
	template += '\t Impuestos Aduanales';
	template += '\t Costo Impuestos $';
	template += '\t Tipo de Cambio Imp.';
	template += '\t Clave de Pedimento';
	template += '\t No. de Pedimento';
	template += '\t No. De Guía';
	template += '\t Aplicación';
	template += '\t FolioExportacion';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Transporte;
	  template += '\t ' + element.Costo_Flete_;
	  template += '\t ' + element.Tipo_de_Cambio_Transp_;
	  template += '\t ' + element.No__Factura;
	  template += '\t ' + element.Fecha_de_Factura;
      template += '\t ' + element.Servicios_aduanales_Servicios_Aduanales.Descripcion;
	  template += '\t ' + element.Costo_Servicios_;
	  template += '\t ' + element.Tipo_de_Cambio_Aduanales;
	  template += '\t ' + element.No__Factura_SA;
	  template += '\t ' + element.Fecha_de_Factura_2;
	  //template += '\t ' + element.Impuestos_Aduanales;
	  template += '\t ' + element.Costo_Impuestos_;
	  template += '\t ' + element.Tipo_de_Cambio_Imp_;
	  template += '\t ' + element.Clave_de_Pedimento;
	  template += '\t ' + element.No__de_Pedimento;
	  template += '\t ' + element.No__De_Guia;
	  template += '\t ' + element.Aplicacion;
	  template += '\t ' + element.FolioExportacion;

	  template += '\n';
    });

    return template;
  }

}

export class Gestion_de_ExportacionDataSource implements DataSource<Gestion_de_Exportacion>
{
  private subject = new BehaviorSubject<Gestion_de_Exportacion[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Gestion_de_ExportacionService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Gestion_de_Exportacion[]> {
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
              const longest = result.Gestion_de_Exportacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Gestion_de_Exportacions);
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
      condition += " and Gestion_de_Exportacion.Folio = " + data.filter.Folio;
    if (data.filter.Transporte != "")
      condition += " and Gestion_de_Exportacion.Transporte like '%" + data.filter.Transporte + "%' ";
    if (data.filter.Costo_Flete_ != "")
      condition += " and Gestion_de_Exportacion.Costo_Flete_ = " + data.filter.Costo_Flete_;
    if (data.filter.Tipo_de_Cambio_Transp_ != "")
      condition += " and Gestion_de_Exportacion.Tipo_de_Cambio_Transp_ = " + data.filter.Tipo_de_Cambio_Transp_;
    if (data.filter.No__Factura != "")
      condition += " and Gestion_de_Exportacion.No__Factura = " + data.filter.No__Factura;
    if (data.filter.Fecha_de_Factura)
      condition += " and CONVERT(VARCHAR(10), Gestion_de_Exportacion.Fecha_de_Factura, 102)  = '" + moment(data.filter.Fecha_de_Factura).format("YYYY.MM.DD") + "'";
    if (data.filter.Servicios_aduanales != "")
      condition += " and Servicios_Aduanales.Descripcion like '%" + data.filter.Servicios_aduanales + "%' ";
    if (data.filter.Costo_Servicios_ != "")
      condition += " and Gestion_de_Exportacion.Costo_Servicios_ = " + data.filter.Costo_Servicios_;
    if (data.filter.Tipo_de_Cambio_Aduanales != "")
      condition += " and Gestion_de_Exportacion.Tipo_de_Cambio_Aduanales = " + data.filter.Tipo_de_Cambio_Aduanales;
    if (data.filter.No__Factura_SA != "")
      condition += " and Gestion_de_Exportacion.No__Factura_SA = " + data.filter.No__Factura_SA;
    if (data.filter.Fecha_de_Factura_2)
      condition += " and CONVERT(VARCHAR(10), Gestion_de_Exportacion.Fecha_de_Factura_2, 102)  = '" + moment(data.filter.Fecha_de_Factura_2).format("YYYY.MM.DD") + "'";
    /* if (data.filter.Impuestos_Aduanales != "")
      condition += " and Gestion_de_Exportacion.Impuestos_Aduanales = " + data.filter.Impuestos_Aduanales; */
    if (data.filter.Costo_Impuestos_ != "")
      condition += " and Gestion_de_Exportacion.Costo_Impuestos_ = " + data.filter.Costo_Impuestos_;
    if (data.filter.Tipo_de_Cambio_Imp_ != "")
      condition += " and Gestion_de_Exportacion.Tipo_de_Cambio_Imp_ = " + data.filter.Tipo_de_Cambio_Imp_;
    if (data.filter.Clave_de_Pedimento != "")
      condition += " and Gestion_de_Exportacion.Clave_de_Pedimento like '%" + data.filter.Clave_de_Pedimento + "%' ";
    if (data.filter.No__de_Pedimento != "")
      condition += " and Gestion_de_Exportacion.No__de_Pedimento = " + data.filter.No__de_Pedimento;
    if (data.filter.No__De_Guia != "")
      condition += " and Gestion_de_Exportacion.No__De_Guia = " + data.filter.No__De_Guia;
    if (data.filter.Aplicacion != "")
      condition += " and Gestion_de_Exportacion.Aplicacion like '%" + data.filter.Aplicacion + "%' ";
    if (data.filter.FolioExportacion != "")
      condition += " and Gestion_de_Exportacion.FolioExportacion like '%" + data.filter.FolioExportacion + "%' ";

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
        sort = " Gestion_de_Exportacion.Folio " + data.sortDirecction;
        break;
      case "Transporte":
        sort = " Gestion_de_Exportacion.Transporte " + data.sortDirecction;
        break;
      case "Costo_Flete_":
        sort = " Gestion_de_Exportacion.Costo_Flete_ " + data.sortDirecction;
        break;
      case "Tipo_de_Cambio_Transp_":
        sort = " Gestion_de_Exportacion.Tipo_de_Cambio_Transp_ " + data.sortDirecction;
        break;
      case "No__Factura":
        sort = " Gestion_de_Exportacion.No__Factura " + data.sortDirecction;
        break;
      case "Fecha_de_Factura":
        sort = " Gestion_de_Exportacion.Fecha_de_Factura " + data.sortDirecction;
        break;
      case "Servicios_aduanales":
        sort = " Servicios_Aduanales.Descripcion " + data.sortDirecction;
        break;
      case "Costo_Servicios_":
        sort = " Gestion_de_Exportacion.Costo_Servicios_ " + data.sortDirecction;
        break;
      case "Tipo_de_Cambio_Aduanales":
        sort = " Gestion_de_Exportacion.Tipo_de_Cambio_Aduanales " + data.sortDirecction;
        break;
      case "No__Factura_SA":
        sort = " Gestion_de_Exportacion.No__Factura_SA " + data.sortDirecction;
        break;
      case "Fecha_de_Factura_2":
        sort = " Gestion_de_Exportacion.Fecha_de_Factura_2 " + data.sortDirecction;
        break;
      /* case "Impuestos_Aduanales":
        sort = " Gestion_de_Exportacion.Impuestos_Aduanales " + data.sortDirecction;
        break; */
      case "Costo_Impuestos_":
        sort = " Gestion_de_Exportacion.Costo_Impuestos_ " + data.sortDirecction;
        break;
      case "Tipo_de_Cambio_Imp_":
        sort = " Gestion_de_Exportacion.Tipo_de_Cambio_Imp_ " + data.sortDirecction;
        break;
      case "Clave_de_Pedimento":
        sort = " Gestion_de_Exportacion.Clave_de_Pedimento " + data.sortDirecction;
        break;
      case "No__de_Pedimento":
        sort = " Gestion_de_Exportacion.No__de_Pedimento " + data.sortDirecction;
        break;
      case "No__De_Guia":
        sort = " Gestion_de_Exportacion.No__De_Guia " + data.sortDirecction;
        break;
      case "Aplicacion":
        sort = " Gestion_de_Exportacion.Aplicacion " + data.sortDirecction;
        break;
      case "FolioExportacion":
        sort = " Gestion_de_Exportacion.FolioExportacion " + data.sortDirecction;
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
        condition += " AND Gestion_de_Exportacion.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Gestion_de_Exportacion.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.TransporteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Gestion_de_Exportacion.Transporte LIKE '" + data.filterAdvanced.Transporte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Gestion_de_Exportacion.Transporte LIKE '%" + data.filterAdvanced.Transporte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Gestion_de_Exportacion.Transporte LIKE '%" + data.filterAdvanced.Transporte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Gestion_de_Exportacion.Transporte = '" + data.filterAdvanced.Transporte + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromCosto_Flete_ != 'undefined' && data.filterAdvanced.fromCosto_Flete_)
	|| (typeof data.filterAdvanced.toCosto_Flete_ != 'undefined' && data.filterAdvanced.toCosto_Flete_)) 
	{
      if (typeof data.filterAdvanced.fromCosto_Flete_ != 'undefined' && data.filterAdvanced.fromCosto_Flete_)
        condition += " AND Gestion_de_Exportacion.Costo_Flete_ >= " + data.filterAdvanced.fromCosto_Flete_;

      if (typeof data.filterAdvanced.toCosto_Flete_ != 'undefined' && data.filterAdvanced.toCosto_Flete_) 
        condition += " AND Gestion_de_Exportacion.Costo_Flete_ <= " + data.filterAdvanced.toCosto_Flete_;
    }
    if ((typeof data.filterAdvanced.fromTipo_de_Cambio_Transp_ != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_Transp_)
	|| (typeof data.filterAdvanced.toTipo_de_Cambio_Transp_ != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_Transp_)) 
	{
      if (typeof data.filterAdvanced.fromTipo_de_Cambio_Transp_ != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_Transp_)
        condition += " AND Gestion_de_Exportacion.Tipo_de_Cambio_Transp_ >= " + data.filterAdvanced.fromTipo_de_Cambio_Transp_;

      if (typeof data.filterAdvanced.toTipo_de_Cambio_Transp_ != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_Transp_) 
        condition += " AND Gestion_de_Exportacion.Tipo_de_Cambio_Transp_ <= " + data.filterAdvanced.toTipo_de_Cambio_Transp_;
    }
    if ((typeof data.filterAdvanced.fromNo__Factura != 'undefined' && data.filterAdvanced.fromNo__Factura)
	|| (typeof data.filterAdvanced.toNo__Factura != 'undefined' && data.filterAdvanced.toNo__Factura)) 
	{
      if (typeof data.filterAdvanced.fromNo__Factura != 'undefined' && data.filterAdvanced.fromNo__Factura)
        condition += " AND Gestion_de_Exportacion.No__Factura >= " + data.filterAdvanced.fromNo__Factura;

      if (typeof data.filterAdvanced.toNo__Factura != 'undefined' && data.filterAdvanced.toNo__Factura) 
        condition += " AND Gestion_de_Exportacion.No__Factura <= " + data.filterAdvanced.toNo__Factura;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura)
	|| (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Factura != 'undefined' && data.filterAdvanced.fromFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Gestion_de_Exportacion.Fecha_de_Factura, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Factura).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Factura != 'undefined' && data.filterAdvanced.toFecha_de_Factura) 
        condition += " and CONVERT(VARCHAR(10), Gestion_de_Exportacion.Fecha_de_Factura, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Factura).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Servicios_aduanales != 'undefined' && data.filterAdvanced.Servicios_aduanales)) {
      switch (data.filterAdvanced.Servicios_aduanalesFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Servicios_Aduanales.Descripcion LIKE '" + data.filterAdvanced.Servicios_aduanales + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Servicios_Aduanales.Descripcion LIKE '%" + data.filterAdvanced.Servicios_aduanales + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Servicios_Aduanales.Descripcion LIKE '%" + data.filterAdvanced.Servicios_aduanales + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Servicios_Aduanales.Descripcion = '" + data.filterAdvanced.Servicios_aduanales + "'";
          break;
      }
    } else if (data.filterAdvanced.Servicios_aduanalesMultiple != null && data.filterAdvanced.Servicios_aduanalesMultiple.length > 0) {
      var Servicios_aduanalesds = data.filterAdvanced.Servicios_aduanalesMultiple.join(",");
      condition += " AND Gestion_de_Exportacion.Servicios_aduanales In (" + Servicios_aduanalesds + ")";
    }
    if ((typeof data.filterAdvanced.fromCosto_Servicios_ != 'undefined' && data.filterAdvanced.fromCosto_Servicios_)
	|| (typeof data.filterAdvanced.toCosto_Servicios_ != 'undefined' && data.filterAdvanced.toCosto_Servicios_)) 
	{
      if (typeof data.filterAdvanced.fromCosto_Servicios_ != 'undefined' && data.filterAdvanced.fromCosto_Servicios_)
        condition += " AND Gestion_de_Exportacion.Costo_Servicios_ >= " + data.filterAdvanced.fromCosto_Servicios_;

      if (typeof data.filterAdvanced.toCosto_Servicios_ != 'undefined' && data.filterAdvanced.toCosto_Servicios_) 
        condition += " AND Gestion_de_Exportacion.Costo_Servicios_ <= " + data.filterAdvanced.toCosto_Servicios_;
    }
    if ((typeof data.filterAdvanced.fromTipo_de_Cambio_Aduanales != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_Aduanales)
	|| (typeof data.filterAdvanced.toTipo_de_Cambio_Aduanales != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_Aduanales)) 
	{
      if (typeof data.filterAdvanced.fromTipo_de_Cambio_Aduanales != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_Aduanales)
        condition += " AND Gestion_de_Exportacion.Tipo_de_Cambio_Aduanales >= " + data.filterAdvanced.fromTipo_de_Cambio_Aduanales;

      if (typeof data.filterAdvanced.toTipo_de_Cambio_Aduanales != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_Aduanales) 
        condition += " AND Gestion_de_Exportacion.Tipo_de_Cambio_Aduanales <= " + data.filterAdvanced.toTipo_de_Cambio_Aduanales;
    }
    if ((typeof data.filterAdvanced.fromNo__Factura_SA != 'undefined' && data.filterAdvanced.fromNo__Factura_SA)
	|| (typeof data.filterAdvanced.toNo__Factura_SA != 'undefined' && data.filterAdvanced.toNo__Factura_SA)) 
	{
      if (typeof data.filterAdvanced.fromNo__Factura_SA != 'undefined' && data.filterAdvanced.fromNo__Factura_SA)
        condition += " AND Gestion_de_Exportacion.No__Factura_SA >= " + data.filterAdvanced.fromNo__Factura_SA;

      if (typeof data.filterAdvanced.toNo__Factura_SA != 'undefined' && data.filterAdvanced.toNo__Factura_SA) 
        condition += " AND Gestion_de_Exportacion.No__Factura_SA <= " + data.filterAdvanced.toNo__Factura_SA;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Factura_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Factura_2)
	|| (typeof data.filterAdvanced.toFecha_de_Factura_2 != 'undefined' && data.filterAdvanced.toFecha_de_Factura_2)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Factura_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Factura_2) 
        condition += " and CONVERT(VARCHAR(10), Gestion_de_Exportacion.Fecha_de_Factura_2, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Factura_2).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Factura_2 != 'undefined' && data.filterAdvanced.toFecha_de_Factura_2) 
        condition += " and CONVERT(VARCHAR(10), Gestion_de_Exportacion.Fecha_de_Factura_2, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Factura_2).format("YYYY.MM.DD") + "'";
    }
   /*  if ((typeof data.filterAdvanced.fromImpuestos_Aduanales != 'undefined' && data.filterAdvanced.fromImpuestos_Aduanales)
	|| (typeof data.filterAdvanced.toImpuestos_Aduanales != 'undefined' && data.filterAdvanced.toImpuestos_Aduanales)) 
	{
      if (typeof data.filterAdvanced.fromImpuestos_Aduanales != 'undefined' && data.filterAdvanced.fromImpuestos_Aduanales)
        condition += " AND Gestion_de_Exportacion.Impuestos_Aduanales >= " + data.filterAdvanced.fromImpuestos_Aduanales;

      if (typeof data.filterAdvanced.toImpuestos_Aduanales != 'undefined' && data.filterAdvanced.toImpuestos_Aduanales) 
        condition += " AND Gestion_de_Exportacion.Impuestos_Aduanales <= " + data.filterAdvanced.toImpuestos_Aduanales;
    } */
    if ((typeof data.filterAdvanced.fromCosto_Impuestos_ != 'undefined' && data.filterAdvanced.fromCosto_Impuestos_)
	|| (typeof data.filterAdvanced.toCosto_Impuestos_ != 'undefined' && data.filterAdvanced.toCosto_Impuestos_)) 
	{
      if (typeof data.filterAdvanced.fromCosto_Impuestos_ != 'undefined' && data.filterAdvanced.fromCosto_Impuestos_)
        condition += " AND Gestion_de_Exportacion.Costo_Impuestos_ >= " + data.filterAdvanced.fromCosto_Impuestos_;

      if (typeof data.filterAdvanced.toCosto_Impuestos_ != 'undefined' && data.filterAdvanced.toCosto_Impuestos_) 
        condition += " AND Gestion_de_Exportacion.Costo_Impuestos_ <= " + data.filterAdvanced.toCosto_Impuestos_;
    }
    if ((typeof data.filterAdvanced.fromTipo_de_Cambio_Imp_ != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_Imp_)
	|| (typeof data.filterAdvanced.toTipo_de_Cambio_Imp_ != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_Imp_)) 
	{
      if (typeof data.filterAdvanced.fromTipo_de_Cambio_Imp_ != 'undefined' && data.filterAdvanced.fromTipo_de_Cambio_Imp_)
        condition += " AND Gestion_de_Exportacion.Tipo_de_Cambio_Imp_ >= " + data.filterAdvanced.fromTipo_de_Cambio_Imp_;

      if (typeof data.filterAdvanced.toTipo_de_Cambio_Imp_ != 'undefined' && data.filterAdvanced.toTipo_de_Cambio_Imp_) 
        condition += " AND Gestion_de_Exportacion.Tipo_de_Cambio_Imp_ <= " + data.filterAdvanced.toTipo_de_Cambio_Imp_;
    }
    switch (data.filterAdvanced.Clave_de_PedimentoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Gestion_de_Exportacion.Clave_de_Pedimento LIKE '" + data.filterAdvanced.Clave_de_Pedimento + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Gestion_de_Exportacion.Clave_de_Pedimento LIKE '%" + data.filterAdvanced.Clave_de_Pedimento + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Gestion_de_Exportacion.Clave_de_Pedimento LIKE '%" + data.filterAdvanced.Clave_de_Pedimento + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Gestion_de_Exportacion.Clave_de_Pedimento = '" + data.filterAdvanced.Clave_de_Pedimento + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromNo__de_Pedimento != 'undefined' && data.filterAdvanced.fromNo__de_Pedimento)
	|| (typeof data.filterAdvanced.toNo__de_Pedimento != 'undefined' && data.filterAdvanced.toNo__de_Pedimento)) 
	{
      if (typeof data.filterAdvanced.fromNo__de_Pedimento != 'undefined' && data.filterAdvanced.fromNo__de_Pedimento)
        condition += " AND Gestion_de_Exportacion.No__de_Pedimento >= " + data.filterAdvanced.fromNo__de_Pedimento;

      if (typeof data.filterAdvanced.toNo__de_Pedimento != 'undefined' && data.filterAdvanced.toNo__de_Pedimento) 
        condition += " AND Gestion_de_Exportacion.No__de_Pedimento <= " + data.filterAdvanced.toNo__de_Pedimento;
    }
    if ((typeof data.filterAdvanced.fromNo__De_Guia != 'undefined' && data.filterAdvanced.fromNo__De_Guia)
	|| (typeof data.filterAdvanced.toNo__De_Guia != 'undefined' && data.filterAdvanced.toNo__De_Guia)) 
	{
      if (typeof data.filterAdvanced.fromNo__De_Guia != 'undefined' && data.filterAdvanced.fromNo__De_Guia)
        condition += " AND Gestion_de_Exportacion.No__De_Guia >= " + data.filterAdvanced.fromNo__De_Guia;

      if (typeof data.filterAdvanced.toNo__De_Guia != 'undefined' && data.filterAdvanced.toNo__De_Guia) 
        condition += " AND Gestion_de_Exportacion.No__De_Guia <= " + data.filterAdvanced.toNo__De_Guia;
    }
    switch (data.filterAdvanced.AplicacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Gestion_de_Exportacion.Aplicacion LIKE '" + data.filterAdvanced.Aplicacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Gestion_de_Exportacion.Aplicacion LIKE '%" + data.filterAdvanced.Aplicacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Gestion_de_Exportacion.Aplicacion LIKE '%" + data.filterAdvanced.Aplicacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Gestion_de_Exportacion.Aplicacion = '" + data.filterAdvanced.Aplicacion + "'";
        break;
    }
    switch (data.filterAdvanced.FolioExportacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Gestion_de_Exportacion.FolioExportacion LIKE '" + data.filterAdvanced.FolioExportacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Gestion_de_Exportacion.FolioExportacion LIKE '%" + data.filterAdvanced.FolioExportacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Gestion_de_Exportacion.FolioExportacion LIKE '%" + data.filterAdvanced.FolioExportacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Gestion_de_Exportacion.FolioExportacion = '" + data.filterAdvanced.FolioExportacion + "'";
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
              const longest = result.Gestion_de_Exportacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Gestion_de_Exportacions);
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
