import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Generacion_de_Orden_de_ComprasService } from "src/app/api-services/Generacion_de_Orden_de_Compras.service";
import { Generacion_de_Orden_de_Compras } from "src/app/models/Generacion_de_Orden_de_Compras";
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
import { Generacion_de_Orden_de_ComprasIndexRules } from 'src/app/shared/businessRules/Generacion_de_Orden_de_Compras-index-rules';
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
  selector: "app-list-Generacion_de_Orden_de_Compras",
  templateUrl: "./list-Generacion_de_Orden_de_Compras.component.html",
  styleUrls: ["./list-Generacion_de_Orden_de_Compras.component.scss"],
})
export class ListGeneracion_de_Orden_de_ComprasComponent extends Generacion_de_Orden_de_ComprasIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "FolioCorreo",
    "Fecha_de_Registro",
    "Hora_de_Registro",
    "Usuario_que_Registra",
    "Proveedor",
    "RFC",
    "Vendedor",
    "Direccion",
    "Telefono_del_Contacto",
    "Email",
    "Subtotal",
    "Total",
    "Moneda",
    "Mensaje_de_correo",
    "Comentarios_Adicionales",
    "Estatus_OC",
    "Tipo_de_Envio",
    "Transporte",
    "FolioGeneracionOC",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "FolioCorreo",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Proveedor",
      "RFC",
      "Vendedor",
      "Direccion",
      "Telefono_del_Contacto",
      "Email",
      "Subtotal",
      "Total",
      "Moneda",
      "Mensaje_de_correo",
      "Comentarios_Adicionales",
      "Estatus_OC",
      "Tipo_de_Envio",
      "Transporte",
      "FolioGeneracionOC",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "FolioCorreo_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Proveedor_filtro",
      "RFC_filtro",
      "Vendedor_filtro",
      "Direccion_filtro",
      "Telefono_del_Contacto_filtro",
      "Email_filtro",
      "Subtotal_filtro",
      "Total_filtro",
      "Moneda_filtro",
      "Mensaje_de_correo_filtro",
      "Comentarios_Adicionales_filtro",
      "Estatus_OC_filtro",
      "Tipo_de_Envio_filtro",
      "Transporte_filtro",
      "FolioGeneracionOC_filtro",

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
      FolioCorreo: "",
      Fecha_de_Registro: "",
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Proveedor: "",
      RFC: "",
      Vendedor: "",
      Direccion: "",
      Telefono_del_Contacto: "",
      Email: "",
      Subtotal: "",
      Total: "",
      Moneda: "",
      Mensaje_de_correo: "",
      Comentarios_Adicionales: "",
      Estatus_OC: "",
      Tipo_de_Envio: "",
      Transporte: "",
      FolioGeneracionOC: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      FolioCorreoFilter: "",
      FolioCorreo: "",
      FolioCorreoMultiple: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      RFCFilter: "",
      RFC: "",
      RFCMultiple: "",
      VendedorFilter: "",
      Vendedor: "",
      VendedorMultiple: "",
      DireccionFilter: "",
      Direccion: "",
      DireccionMultiple: "",
      Telefono_del_ContactoFilter: "",
      Telefono_del_Contacto: "",
      Telefono_del_ContactoMultiple: "",
      EmailFilter: "",
      Email: "",
      EmailMultiple: "",
      fromSubtotal: "",
      toSubtotal: "",
      fromTotal: "",
      toTotal: "",
      MonedaFilter: "",
      Moneda: "",
      MonedaMultiple: "",
      Estatus_OCFilter: "",
      Estatus_OC: "",
      Estatus_OCMultiple: "",
      TransporteFilter: "",
      Transporte: "",
      TransporteMultiple: "",

    }
  };

  dataSource: Generacion_de_Orden_de_ComprasDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Generacion_de_Orden_de_ComprasDataSource;
  dataClipboard: any;

  constructor(
    private _Generacion_de_Orden_de_ComprasService: Generacion_de_Orden_de_ComprasService,
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
    this.dataSource = new Generacion_de_Orden_de_ComprasDataSource(
      this._Generacion_de_Orden_de_ComprasService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Generacion_de_Orden_de_Compras)
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
    this.listConfig.filter.FolioCorreo = "";
    this.listConfig.filter.Fecha_de_Registro = "";
    this.listConfig.filter.Hora_de_Registro = "";
    this.listConfig.filter.Usuario_que_Registra = "";
    this.listConfig.filter.Proveedor = "";
    this.listConfig.filter.RFC = "";
    this.listConfig.filter.Vendedor = "";
    this.listConfig.filter.Direccion = "";
    this.listConfig.filter.Telefono_del_Contacto = "";
    this.listConfig.filter.Email = "";
    this.listConfig.filter.Subtotal = "";
    this.listConfig.filter.Total = "";
    this.listConfig.filter.Moneda = "";
    this.listConfig.filter.Mensaje_de_correo = "";
    this.listConfig.filter.Comentarios_Adicionales = "";
    this.listConfig.filter.Estatus_OC = "";
    this.listConfig.filter.Tipo_de_Envio = "";
    this.listConfig.filter.Transporte = "";
    this.listConfig.filter.FolioGeneracionOC = "";

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

  remove(row: Generacion_de_Orden_de_Compras) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Generacion_de_Orden_de_ComprasService
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
  ActionPrint(dataRow: Generacion_de_Orden_de_Compras) {

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
,'Fecha de Registro'
,'Hora de Registro'
,'Usuario que Registra'
,'Proveedor'
,'RFC'
,'Vendedor'
,'Dirección'
,'Teléfono del Contacto'
,'Email'
,'Subtotal'
,'Total'
,'Moneda'
,'Redacción de Correo'
,'Comentarios Adicionales'
,'Estatus OC'
,'Tipo de Envió'
,'Transporte'
,'FolioGeneracionOC'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.FolioCorreo_Folios_Generacion_OC.FolioTexto
,x.Fecha_de_Registro
,x.Hora_de_Registro
,x.Usuario_que_Registra_Spartan_User.Name
,x.Proveedor_Creacion_de_Proveedores.Razon_social
,x.RFC_Creacion_de_Proveedores.RFC
,x.Vendedor_Creacion_de_Proveedores.Contacto
,x.Direccion_Creacion_de_Proveedores.Direccion_postal
,x.Telefono_del_Contacto_Creacion_de_Proveedores.Telefono_de_contacto
,x.Email_Creacion_de_Proveedores.Correo_electronico
,x.Subtotal
,x.Total
,x.Moneda_Moneda.Descripcion
,x.Mensaje_de_correo
,x.Comentarios_Adicionales
,x.Estatus_OC_Estatus_de_Seguimiento.Descripcion
,x.Tipo_de_Envio
,x.Transporte_Tipo_de_Transporte.Descripcion
,x.FolioGeneracionOC
		  
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
    pdfMake.createPdf(pdfDefinition).download('Generacion_de_Orden_de_Compras.pdf');
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
          this._Generacion_de_Orden_de_ComprasService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Generacion_de_Orden_de_Comprass;
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
          this._Generacion_de_Orden_de_ComprasService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Generacion_de_Orden_de_Comprass;
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
        'FolioTexto ': fields.FolioCorreo_Folios_Generacion_OC.FolioTexto,
        'Fecha de Registro ': fields.Fecha_de_Registro,
        'Hora de Registro ': fields.Hora_de_Registro,
        'Usuario que Registra ': fields.Usuario_que_Registra_Spartan_User.Name,
        'Proveedor ': fields.Proveedor_Creacion_de_Proveedores.Razon_social,
        'RFC 1': fields.RFC_Creacion_de_Proveedores.RFC,
        'Vendedor 2': fields.Vendedor_Creacion_de_Proveedores.Contacto,
        'Dirección 3': fields.Direccion_Creacion_de_Proveedores.Direccion_postal,
        'Teléfono del Contacto 4': fields.Telefono_del_Contacto_Creacion_de_Proveedores.Telefono_de_contacto,
        'Email 5': fields.Email_Creacion_de_Proveedores.Correo_electronico,
        'Subtotal ': fields.Subtotal,
        'Total ': fields.Total,
        'Moneda ': fields.Moneda_Moneda.Descripcion,
        'Redacción de Correo ': fields.Mensaje_de_correo,
        'Comentarios Adicionales ': fields.Comentarios_Adicionales,
        'Estatus OC ': fields.Estatus_OC_Estatus_de_Seguimiento.Descripcion,
        'Tipo de Envió ': fields.Tipo_de_Envio,
        'Transporte ': fields.Transporte_Tipo_de_Transporte.Descripcion,
        'FolioGeneracionOC ': fields.FolioGeneracionOC,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Generacion_de_Orden_de_Compras  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      FolioCorreo: x.FolioCorreo_Folios_Generacion_OC.FolioTexto,
      Fecha_de_Registro: x.Fecha_de_Registro,
      Hora_de_Registro: x.Hora_de_Registro,
      Usuario_que_Registra: x.Usuario_que_Registra_Spartan_User.Name,
      Proveedor: x.Proveedor_Creacion_de_Proveedores.Razon_social,
      RFC: x.RFC_Creacion_de_Proveedores.RFC,
      Vendedor: x.Vendedor_Creacion_de_Proveedores.Contacto,
      Direccion: x.Direccion_Creacion_de_Proveedores.Direccion_postal,
      Telefono_del_Contacto: x.Telefono_del_Contacto_Creacion_de_Proveedores.Telefono_de_contacto,
      Email: x.Email_Creacion_de_Proveedores.Correo_electronico,
      Subtotal: x.Subtotal,
      Total: x.Total,
      Moneda: x.Moneda_Moneda.Descripcion,
      Mensaje_de_correo: x.Mensaje_de_correo,
      Comentarios_Adicionales: x.Comentarios_Adicionales,
      Estatus_OC: x.Estatus_OC_Estatus_de_Seguimiento.Descripcion,
      Tipo_de_Envio: x.Tipo_de_Envio,
      Transporte: x.Transporte_Tipo_de_Transporte.Descripcion,
      FolioGeneracionOC: x.FolioGeneracionOC,

    }));

    this.excelService.exportToCsv(result, 'Generacion_de_Orden_de_Compras',  ['Folio'    ,'FolioCorreo'  ,'Fecha_de_Registro'  ,'Hora_de_Registro'  ,'Usuario_que_Registra'  ,'Proveedor'  ,'RFC'  ,'Vendedor'  ,'Direccion'  ,'Telefono_del_Contacto'  ,'Email'  ,'Subtotal'  ,'Total'  ,'Moneda'  ,'Mensaje_de_correo'  ,'Comentarios_Adicionales'  ,'Estatus_OC'  ,'Tipo_de_Envio'  ,'Transporte'  ,'FolioGeneracionOC' ]);
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
    template += '          <th>Fecha de Registro</th>';
    template += '          <th>Hora de Registro</th>';
    template += '          <th>Usuario que Registra</th>';
    template += '          <th>Proveedor</th>';
    template += '          <th>RFC</th>';
    template += '          <th>Vendedor</th>';
    template += '          <th>Dirección</th>';
    template += '          <th>Teléfono del Contacto</th>';
    template += '          <th>Email</th>';
    template += '          <th>Subtotal</th>';
    template += '          <th>Total</th>';
    template += '          <th>Moneda</th>';
    template += '          <th>Redacción de Correo</th>';
    template += '          <th>Comentarios Adicionales</th>';
    template += '          <th>Estatus OC</th>';
    template += '          <th>Tipo de Envió</th>';
    template += '          <th>Transporte</th>';
    template += '          <th>FolioGeneracionOC</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.FolioCorreo_Folios_Generacion_OC.FolioTexto + '</td>';
      template += '          <td>' + element.Fecha_de_Registro + '</td>';
      template += '          <td>' + element.Hora_de_Registro + '</td>';
      template += '          <td>' + element.Usuario_que_Registra_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.RFC_Creacion_de_Proveedores.RFC + '</td>';
      template += '          <td>' + element.Vendedor_Creacion_de_Proveedores.Contacto + '</td>';
      template += '          <td>' + element.Direccion_Creacion_de_Proveedores.Direccion_postal + '</td>';
      template += '          <td>' + element.Telefono_del_Contacto_Creacion_de_Proveedores.Telefono_de_contacto + '</td>';
      template += '          <td>' + element.Email_Creacion_de_Proveedores.Correo_electronico + '</td>';
      template += '          <td>' + element.Subtotal + '</td>';
      template += '          <td>' + element.Total + '</td>';
      template += '          <td>' + element.Moneda_Moneda.Descripcion + '</td>';
      template += '          <td>' + element.Mensaje_de_correo + '</td>';
      template += '          <td>' + element.Comentarios_Adicionales + '</td>';
      template += '          <td>' + element.Estatus_OC_Estatus_de_Seguimiento.Descripcion + '</td>';
      template += '          <td>' + element.Tipo_de_Envio + '</td>';
      template += '          <td>' + element.Transporte_Tipo_de_Transporte.Descripcion + '</td>';
      template += '          <td>' + element.FolioGeneracionOC + '</td>';
		  
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
	template += '\t Fecha de Registro';
	template += '\t Hora de Registro';
	template += '\t Usuario que Registra';
	template += '\t Proveedor';
	template += '\t RFC';
	template += '\t Vendedor';
	template += '\t Dirección';
	template += '\t Teléfono del Contacto';
	template += '\t Email';
	template += '\t Subtotal';
	template += '\t Total';
	template += '\t Moneda';
	template += '\t Redacción de Correo';
	template += '\t Comentarios Adicionales';
	template += '\t Estatus OC';
	template += '\t Tipo de Envió';
	template += '\t Transporte';
	template += '\t FolioGeneracionOC';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.FolioCorreo_Folios_Generacion_OC.FolioTexto;
	  template += '\t ' + element.Fecha_de_Registro;
	  template += '\t ' + element.Hora_de_Registro;
      template += '\t ' + element.Usuario_que_Registra_Spartan_User.Name;
      template += '\t ' + element.Proveedor_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.RFC_Creacion_de_Proveedores.RFC;
      template += '\t ' + element.Vendedor_Creacion_de_Proveedores.Contacto;
      template += '\t ' + element.Direccion_Creacion_de_Proveedores.Direccion_postal;
      template += '\t ' + element.Telefono_del_Contacto_Creacion_de_Proveedores.Telefono_de_contacto;
      template += '\t ' + element.Email_Creacion_de_Proveedores.Correo_electronico;
	  template += '\t ' + element.Subtotal;
	  template += '\t ' + element.Total;
      template += '\t ' + element.Moneda_Moneda.Descripcion;
	  template += '\t ' + element.Mensaje_de_correo;
	  template += '\t ' + element.Comentarios_Adicionales;
      template += '\t ' + element.Estatus_OC_Estatus_de_Seguimiento.Descripcion;
	  template += '\t ' + element.Tipo_de_Envio;
      template += '\t ' + element.Transporte_Tipo_de_Transporte.Descripcion;
	  template += '\t ' + element.FolioGeneracionOC;

	  template += '\n';
    });

    return template;
  }

}

export class Generacion_de_Orden_de_ComprasDataSource implements DataSource<Generacion_de_Orden_de_Compras>
{
  private subject = new BehaviorSubject<Generacion_de_Orden_de_Compras[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Generacion_de_Orden_de_ComprasService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Generacion_de_Orden_de_Compras[]> {
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
              const longest = result.Generacion_de_Orden_de_Comprass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Generacion_de_Orden_de_Comprass);
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
      condition += " and Generacion_de_Orden_de_Compras.Folio = " + data.filter.Folio;
    if (data.filter.FolioCorreo != "")
      condition += " and Folios_Generacion_OC.FolioTexto like '%" + data.filter.FolioCorreo + "%' ";
    if (data.filter.Fecha_de_Registro != "")
      condition += " and Generacion_de_Orden_de_Compras.Fecha_de_Registro like '%" + data.filter.Fecha_de_Registro + "%' ";
    if (data.filter.Hora_de_Registro != "")
      condition += " and Generacion_de_Orden_de_Compras.Hora_de_Registro = '" + data.filter.Hora_de_Registro + "'";
    if (data.filter.Usuario_que_Registra != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra + "%' ";
    if (data.filter.Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor + "%' ";
    if (data.filter.RFC != "")
      condition += " and Creacion_de_Proveedores.RFC like '%" + data.filter.RFC + "%' ";
    if (data.filter.Vendedor != "")
      condition += " and Creacion_de_Proveedores.Contacto like '%" + data.filter.Vendedor + "%' ";
    if (data.filter.Direccion != "")
      condition += " and Creacion_de_Proveedores.Direccion_postal like '%" + data.filter.Direccion + "%' ";
    if (data.filter.Telefono_del_Contacto != "")
      condition += " and Creacion_de_Proveedores.Telefono_de_contacto like '%" + data.filter.Telefono_del_Contacto + "%' ";
    if (data.filter.Email != "")
      condition += " and Creacion_de_Proveedores.Correo_electronico like '%" + data.filter.Email + "%' ";
    if (data.filter.Subtotal != "")
      condition += " and Generacion_de_Orden_de_Compras.Subtotal = " + data.filter.Subtotal;
    if (data.filter.Total != "")
      condition += " and Generacion_de_Orden_de_Compras.Total = " + data.filter.Total;
    if (data.filter.Moneda != "")
      condition += " and Moneda.Descripcion like '%" + data.filter.Moneda + "%' ";
    if (data.filter.Mensaje_de_correo != "")
      condition += " and Generacion_de_Orden_de_Compras.Mensaje_de_correo like '%" + data.filter.Mensaje_de_correo + "%' ";
    if (data.filter.Comentarios_Adicionales != "")
      condition += " and Generacion_de_Orden_de_Compras.Comentarios_Adicionales like '%" + data.filter.Comentarios_Adicionales + "%' ";
    if (data.filter.Estatus_OC != "")
      condition += " and Estatus_de_Seguimiento.Descripcion like '%" + data.filter.Estatus_OC + "%' ";
    if (data.filter.Tipo_de_Envio != "")
      condition += " and Generacion_de_Orden_de_Compras.Tipo_de_Envio like '%" + data.filter.Tipo_de_Envio + "%' ";
    if (data.filter.Transporte != "")
      condition += " and Tipo_de_Transporte.Descripcion like '%" + data.filter.Transporte + "%' ";
    if (data.filter.FolioGeneracionOC != "")
      condition += " and Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + data.filter.FolioGeneracionOC + "%' ";

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
        sort = " Generacion_de_Orden_de_Compras.Folio " + data.sortDirecction;
        break;
      case "FolioCorreo":
        sort = " Folios_Generacion_OC.FolioTexto " + data.sortDirecction;
        break;
      case "Fecha_de_Registro":
        sort = " Generacion_de_Orden_de_Compras.Fecha_de_Registro " + data.sortDirecction;
        break;
      case "Hora_de_Registro":
        sort = " Generacion_de_Orden_de_Compras.Hora_de_Registro " + data.sortDirecction;
        break;
      case "Usuario_que_Registra":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "RFC":
        sort = " Creacion_de_Proveedores.RFC " + data.sortDirecction;
        break;
      case "Vendedor":
        sort = " Creacion_de_Proveedores.Contacto " + data.sortDirecction;
        break;
      case "Direccion":
        sort = " Creacion_de_Proveedores.Direccion_postal " + data.sortDirecction;
        break;
      case "Telefono_del_Contacto":
        sort = " Creacion_de_Proveedores.Telefono_de_contacto " + data.sortDirecction;
        break;
      case "Email":
        sort = " Creacion_de_Proveedores.Correo_electronico " + data.sortDirecction;
        break;
      case "Subtotal":
        sort = " Generacion_de_Orden_de_Compras.Subtotal " + data.sortDirecction;
        break;
      case "Total":
        sort = " Generacion_de_Orden_de_Compras.Total " + data.sortDirecction;
        break;
      case "Moneda":
        sort = " Moneda.Descripcion " + data.sortDirecction;
        break;
      case "Mensaje_de_correo":
        sort = " Generacion_de_Orden_de_Compras.Mensaje_de_correo " + data.sortDirecction;
        break;
      case "Comentarios_Adicionales":
        sort = " Generacion_de_Orden_de_Compras.Comentarios_Adicionales " + data.sortDirecction;
        break;
      case "Estatus_OC":
        sort = " Estatus_de_Seguimiento.Descripcion " + data.sortDirecction;
        break;
      case "Tipo_de_Envio":
        sort = " Generacion_de_Orden_de_Compras.Tipo_de_Envio " + data.sortDirecction;
        break;
      case "Transporte":
        sort = " Tipo_de_Transporte.Descripcion " + data.sortDirecction;
        break;
      case "FolioGeneracionOC":
        sort = " Generacion_de_Orden_de_Compras.FolioGeneracionOC " + data.sortDirecction;
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
        condition += " AND Generacion_de_Orden_de_Compras.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Generacion_de_Orden_de_Compras.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.FolioCorreo != 'undefined' && data.filterAdvanced.FolioCorreo)) {
      switch (data.filterAdvanced.FolioCorreoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Folios_Generacion_OC.FolioTexto LIKE '" + data.filterAdvanced.FolioCorreo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Folios_Generacion_OC.FolioTexto LIKE '%" + data.filterAdvanced.FolioCorreo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Folios_Generacion_OC.FolioTexto LIKE '%" + data.filterAdvanced.FolioCorreo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Folios_Generacion_OC.FolioTexto = '" + data.filterAdvanced.FolioCorreo + "'";
          break;
      }
    } else if (data.filterAdvanced.FolioCorreoMultiple != null && data.filterAdvanced.FolioCorreoMultiple.length > 0) {
      var FolioCorreods = data.filterAdvanced.FolioCorreoMultiple.join(",");
      condition += " AND Generacion_de_Orden_de_Compras.FolioCorreo In (" + FolioCorreods + ")";
    }
    switch (data.filterAdvanced.Fecha_de_RegistroFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Generacion_de_Orden_de_Compras.Fecha_de_Registro LIKE '" + data.filterAdvanced.Fecha_de_Registro + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Generacion_de_Orden_de_Compras.Fecha_de_Registro LIKE '%" + data.filterAdvanced.Fecha_de_Registro + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Generacion_de_Orden_de_Compras.Fecha_de_Registro LIKE '%" + data.filterAdvanced.Fecha_de_Registro + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Generacion_de_Orden_de_Compras.Fecha_de_Registro = '" + data.filterAdvanced.Fecha_de_Registro + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
	|| (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)) 
	{
		if (typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro) 
			condition += " and Generacion_de_Orden_de_Compras.Hora_de_Registro >= '" + data.filterAdvanced.fromHora_de_Registro + "'";
      
		if (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro) 
			condition += " and Generacion_de_Orden_de_Compras.Hora_de_Registro <= '" + data.filterAdvanced.toHora_de_Registro + "'";
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
      condition += " AND Generacion_de_Orden_de_Compras.Usuario_que_Registra In (" + Usuario_que_Registrads + ")";
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
      condition += " AND Generacion_de_Orden_de_Compras.Proveedor In (" + Proveedords + ")";
    }
    if ((typeof data.filterAdvanced.RFC != 'undefined' && data.filterAdvanced.RFC)) {
      switch (data.filterAdvanced.RFCFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.RFC LIKE '" + data.filterAdvanced.RFC + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.RFC LIKE '%" + data.filterAdvanced.RFC + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.RFC LIKE '%" + data.filterAdvanced.RFC + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.RFC = '" + data.filterAdvanced.RFC + "'";
          break;
      }
    } else if (data.filterAdvanced.RFCMultiple != null && data.filterAdvanced.RFCMultiple.length > 0) {
      var RFCds = data.filterAdvanced.RFCMultiple.join(",");
      condition += " AND Generacion_de_Orden_de_Compras.RFC In (" + RFCds + ")";
    }
    if ((typeof data.filterAdvanced.Vendedor != 'undefined' && data.filterAdvanced.Vendedor)) {
      switch (data.filterAdvanced.VendedorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Contacto LIKE '" + data.filterAdvanced.Vendedor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Contacto LIKE '%" + data.filterAdvanced.Vendedor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Contacto LIKE '%" + data.filterAdvanced.Vendedor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Contacto = '" + data.filterAdvanced.Vendedor + "'";
          break;
      }
    } else if (data.filterAdvanced.VendedorMultiple != null && data.filterAdvanced.VendedorMultiple.length > 0) {
      var Vendedords = data.filterAdvanced.VendedorMultiple.join(",");
      condition += " AND Generacion_de_Orden_de_Compras.Vendedor In (" + Vendedords + ")";
    }
    if ((typeof data.filterAdvanced.Direccion != 'undefined' && data.filterAdvanced.Direccion)) {
      switch (data.filterAdvanced.DireccionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Direccion_postal LIKE '" + data.filterAdvanced.Direccion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Direccion_postal LIKE '%" + data.filterAdvanced.Direccion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Direccion_postal LIKE '%" + data.filterAdvanced.Direccion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Direccion_postal = '" + data.filterAdvanced.Direccion + "'";
          break;
      }
    } else if (data.filterAdvanced.DireccionMultiple != null && data.filterAdvanced.DireccionMultiple.length > 0) {
      var Direccionds = data.filterAdvanced.DireccionMultiple.join(",");
      condition += " AND Generacion_de_Orden_de_Compras.Direccion In (" + Direccionds + ")";
    }
    if ((typeof data.filterAdvanced.Telefono_del_Contacto != 'undefined' && data.filterAdvanced.Telefono_del_Contacto)) {
      switch (data.filterAdvanced.Telefono_del_ContactoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Telefono_de_contacto LIKE '" + data.filterAdvanced.Telefono_del_Contacto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Telefono_de_contacto LIKE '%" + data.filterAdvanced.Telefono_del_Contacto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Telefono_de_contacto LIKE '%" + data.filterAdvanced.Telefono_del_Contacto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Telefono_de_contacto = '" + data.filterAdvanced.Telefono_del_Contacto + "'";
          break;
      }
    } else if (data.filterAdvanced.Telefono_del_ContactoMultiple != null && data.filterAdvanced.Telefono_del_ContactoMultiple.length > 0) {
      var Telefono_del_Contactods = data.filterAdvanced.Telefono_del_ContactoMultiple.join(",");
      condition += " AND Generacion_de_Orden_de_Compras.Telefono_del_Contacto In (" + Telefono_del_Contactods + ")";
    }
    if ((typeof data.filterAdvanced.Email != 'undefined' && data.filterAdvanced.Email)) {
      switch (data.filterAdvanced.EmailFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Correo_electronico LIKE '" + data.filterAdvanced.Email + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Correo_electronico LIKE '%" + data.filterAdvanced.Email + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Correo_electronico LIKE '%" + data.filterAdvanced.Email + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Correo_electronico = '" + data.filterAdvanced.Email + "'";
          break;
      }
    } else if (data.filterAdvanced.EmailMultiple != null && data.filterAdvanced.EmailMultiple.length > 0) {
      var Emailds = data.filterAdvanced.EmailMultiple.join(",");
      condition += " AND Generacion_de_Orden_de_Compras.Email In (" + Emailds + ")";
    }
    if ((typeof data.filterAdvanced.fromSubtotal != 'undefined' && data.filterAdvanced.fromSubtotal)
	|| (typeof data.filterAdvanced.toSubtotal != 'undefined' && data.filterAdvanced.toSubtotal)) 
	{
      if (typeof data.filterAdvanced.fromSubtotal != 'undefined' && data.filterAdvanced.fromSubtotal)
        condition += " AND Generacion_de_Orden_de_Compras.Subtotal >= " + data.filterAdvanced.fromSubtotal;

      if (typeof data.filterAdvanced.toSubtotal != 'undefined' && data.filterAdvanced.toSubtotal) 
        condition += " AND Generacion_de_Orden_de_Compras.Subtotal <= " + data.filterAdvanced.toSubtotal;
    }
    if ((typeof data.filterAdvanced.fromTotal != 'undefined' && data.filterAdvanced.fromTotal)
	|| (typeof data.filterAdvanced.toTotal != 'undefined' && data.filterAdvanced.toTotal)) 
	{
      if (typeof data.filterAdvanced.fromTotal != 'undefined' && data.filterAdvanced.fromTotal)
        condition += " AND Generacion_de_Orden_de_Compras.Total >= " + data.filterAdvanced.fromTotal;

      if (typeof data.filterAdvanced.toTotal != 'undefined' && data.filterAdvanced.toTotal) 
        condition += " AND Generacion_de_Orden_de_Compras.Total <= " + data.filterAdvanced.toTotal;
    }
    if ((typeof data.filterAdvanced.Moneda != 'undefined' && data.filterAdvanced.Moneda)) {
      switch (data.filterAdvanced.MonedaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Moneda.Descripcion LIKE '" + data.filterAdvanced.Moneda + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Moneda + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Moneda + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Moneda.Descripcion = '" + data.filterAdvanced.Moneda + "'";
          break;
      }
    } else if (data.filterAdvanced.MonedaMultiple != null && data.filterAdvanced.MonedaMultiple.length > 0) {
      var Monedads = data.filterAdvanced.MonedaMultiple.join(",");
      condition += " AND Generacion_de_Orden_de_Compras.Moneda In (" + Monedads + ")";
    }
    switch (data.filterAdvanced.Mensaje_de_correoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Generacion_de_Orden_de_Compras.Mensaje_de_correo LIKE '" + data.filterAdvanced.Mensaje_de_correo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Generacion_de_Orden_de_Compras.Mensaje_de_correo LIKE '%" + data.filterAdvanced.Mensaje_de_correo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Generacion_de_Orden_de_Compras.Mensaje_de_correo LIKE '%" + data.filterAdvanced.Mensaje_de_correo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Generacion_de_Orden_de_Compras.Mensaje_de_correo = '" + data.filterAdvanced.Mensaje_de_correo + "'";
        break;
    }
    switch (data.filterAdvanced.Comentarios_AdicionalesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Generacion_de_Orden_de_Compras.Comentarios_Adicionales LIKE '" + data.filterAdvanced.Comentarios_Adicionales + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Generacion_de_Orden_de_Compras.Comentarios_Adicionales LIKE '%" + data.filterAdvanced.Comentarios_Adicionales + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Generacion_de_Orden_de_Compras.Comentarios_Adicionales LIKE '%" + data.filterAdvanced.Comentarios_Adicionales + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Generacion_de_Orden_de_Compras.Comentarios_Adicionales = '" + data.filterAdvanced.Comentarios_Adicionales + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus_OC != 'undefined' && data.filterAdvanced.Estatus_OC)) {
      switch (data.filterAdvanced.Estatus_OCFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Seguimiento.Descripcion LIKE '" + data.filterAdvanced.Estatus_OC + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Seguimiento.Descripcion LIKE '%" + data.filterAdvanced.Estatus_OC + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Seguimiento.Descripcion LIKE '%" + data.filterAdvanced.Estatus_OC + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Seguimiento.Descripcion = '" + data.filterAdvanced.Estatus_OC + "'";
          break;
      }
    } else if (data.filterAdvanced.Estatus_OCMultiple != null && data.filterAdvanced.Estatus_OCMultiple.length > 0) {
      var Estatus_OCds = data.filterAdvanced.Estatus_OCMultiple.join(",");
      condition += " AND Generacion_de_Orden_de_Compras.Estatus_OC In (" + Estatus_OCds + ")";
    }
    switch (data.filterAdvanced.Tipo_de_EnvioFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Generacion_de_Orden_de_Compras.Tipo_de_Envio LIKE '" + data.filterAdvanced.Tipo_de_Envio + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Generacion_de_Orden_de_Compras.Tipo_de_Envio LIKE '%" + data.filterAdvanced.Tipo_de_Envio + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Generacion_de_Orden_de_Compras.Tipo_de_Envio LIKE '%" + data.filterAdvanced.Tipo_de_Envio + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Generacion_de_Orden_de_Compras.Tipo_de_Envio = '" + data.filterAdvanced.Tipo_de_Envio + "'";
        break;
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
      condition += " AND Generacion_de_Orden_de_Compras.Transporte In (" + Transporteds + ")";
    }
    switch (data.filterAdvanced.FolioGeneracionOCFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '" + data.filterAdvanced.FolioGeneracionOC + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '%" + data.filterAdvanced.FolioGeneracionOC + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '%" + data.filterAdvanced.FolioGeneracionOC + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC = '" + data.filterAdvanced.FolioGeneracionOC + "'";
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
              const longest = result.Generacion_de_Orden_de_Comprass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Generacion_de_Orden_de_Comprass);
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
