import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Creacion_de_ProveedoresService } from "src/app/api-services/Creacion_de_Proveedores.service";
import { Creacion_de_Proveedores } from "src/app/models/Creacion_de_Proveedores";
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
import { Creacion_de_ProveedoresIndexRules } from 'src/app/shared/businessRules/Creacion_de_Proveedores-index-rules';
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
  selector: "app-list-Creacion_de_Proveedores",
  templateUrl: "./list-Creacion_de_Proveedores.component.html",
  styleUrls: ["./list-Creacion_de_Proveedores.component.scss"],
})
export class ListCreacion_de_ProveedoresComponent extends Creacion_de_ProveedoresIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Clave",
    "ID_Dynamics",
    "Razon_social",
    "RFC",
    "Contacto",
    "Correo_electronico",
    "Direccion_fiscal",
    "Direccion_postal",
    "Telefono_de_contacto",
    "Estatus",
    "Tiempo_de_pagos_negociado",
    "Tipo_de_proveedor",
    "Se_realizo_auditoria",
    "Clasificacion_de_proveedor",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "ID_Dynamics",
      "Razon_social",
      "RFC",
      "Contacto",
      "Correo_electronico",
      "Direccion_fiscal",
      "Direccion_postal",
      "Telefono_de_contacto",
      "Estatus",
      "Tiempo_de_pagos_negociado",
      "Tipo_de_proveedor",
      "Se_realizo_auditoria",
      "Clasificacion_de_proveedor",
      "Cargar_acuerdo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "ID_Dynamics_filtro",
      "Razon_social_filtro",
      "RFC_filtro",
      "Contacto_filtro",
      "Correo_electronico_filtro",
      "Direccion_fiscal_filtro",
      "Direccion_postal_filtro",
      "Telefono_de_contacto_filtro",
      "Estatus_filtro",
      "Tiempo_de_pagos_negociado_filtro",
      "Tipo_de_proveedor_filtro",
      "Se_realizo_auditoria_filtro",
      "Clasificacion_de_proveedor_filtro",
      "Cargar_acuerdo_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      ID_Dynamics: "",
      Razon_social: "",
      RFC: "",
      Contacto: "",
      Correo_electronico: "",
      Direccion_fiscal: "",
      Direccion_postal: "",
      Telefono_de_contacto: "",
      Estatus: "",
      Tiempo_de_pagos_negociado: "",
      Tipo_de_proveedor: "",
      Se_realizo_auditoria: "",
      Clasificacion_de_proveedor: "",
		
    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromTiempo_de_pagos_negociado: "",
      toTiempo_de_pagos_negociado: "",
      Tipo_de_proveedorFilter: "",
      Tipo_de_proveedor: "",
      Tipo_de_proveedorMultiple: "",
      Se_realizo_auditoriaFilter: "",
      Se_realizo_auditoria: "",
      Se_realizo_auditoriaMultiple: "",
      Clasificacion_de_proveedorFilter: "",
      Clasificacion_de_proveedor: "",
      Clasificacion_de_proveedorMultiple: "",

    }
  };

  dataSource: Creacion_de_ProveedoresDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Creacion_de_ProveedoresDataSource;
  dataClipboard: any;

  constructor(
    private _Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
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
    this.dataSource = new Creacion_de_ProveedoresDataSource(
      this._Creacion_de_ProveedoresService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Creacion_de_Proveedores)
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
    this.listConfig.filter.Clave = "";
    this.listConfig.filter.ID_Dynamics = "";
    this.listConfig.filter.Razon_social = "";
    this.listConfig.filter.RFC = "";
    this.listConfig.filter.Contacto = "";
    this.listConfig.filter.Correo_electronico = "";
    this.listConfig.filter.Direccion_fiscal = "";
    this.listConfig.filter.Direccion_postal = "";
    this.listConfig.filter.Telefono_de_contacto = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Tiempo_de_pagos_negociado = "";
    this.listConfig.filter.Tipo_de_proveedor = "";
    this.listConfig.filter.Se_realizo_auditoria = "";
    this.listConfig.filter.Clasificacion_de_proveedor = "";

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

//INICIA - BRID:43 - etjuedrtyjdfhjndxfg - Autor: Administrador - Actualización: 2/4/2021 10:29:31 PM

//TERMINA - BRID:43

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

  remove(row: Creacion_de_Proveedores) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Creacion_de_ProveedoresService
          .delete(+row.Clave)
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
  ActionPrint(dataRow: Creacion_de_Proveedores) {

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
'Clave'
,'ID Dynamics'
,'Razón social'
,'RFC'
,'Contacto'
,'Correo electrónico'
,'Dirección fiscal'
,'Dirección postal'
,'Teléfono de contacto '
,'Estatus'
,'Tiempo de pagos negociado (Numero de Días)'
,'Tipo de proveedor'
,'¿Se realizó auditoria?'
,'Clasificación de proveedor'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Clave
,x.ID_Dynamics
,x.Razon_social
,x.RFC
,x.Contacto
,x.Correo_electronico
,x.Direccion_fiscal
,x.Direccion_postal
,x.Telefono_de_contacto
,x.Estatus_Estatus_de_Proveedor.Descripcion
,x.Tiempo_de_pagos_negociado
,x.Tipo_de_proveedor_Tipos_de_proveedor.Descripcion
,x.Se_realizo_auditoria_Respuesta.Descripcion
,x.Clasificacion_de_proveedor_Clasificacion_de_proveedores.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Creacion_de_Proveedores.pdf');
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
          this._Creacion_de_ProveedoresService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Creacion_de_Proveedoress;
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
          this._Creacion_de_ProveedoresService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Creacion_de_Proveedoress;
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
        'Clave ': fields.Clave,
        'ID Dynamics ': fields.ID_Dynamics,
        'Razón social ': fields.Razon_social,
        'RFC ': fields.RFC,
        'Contacto ': fields.Contacto,
        'Correo electrónico ': fields.Correo_electronico,
        'Dirección fiscal ': fields.Direccion_fiscal,
        'Dirección postal ': fields.Direccion_postal,
        'Teléfono de contacto  ': fields.Telefono_de_contacto,
        'Estatus ': fields.Estatus_Estatus_de_Proveedor.Descripcion,
        'Tiempo de pagos negociado (Numero de Días) ': fields.Tiempo_de_pagos_negociado,
        'Tipo de proveedor ': fields.Tipo_de_proveedor_Tipos_de_proveedor.Descripcion,
        '¿Se realizó auditoria? ': fields.Se_realizo_auditoria_Respuesta.Descripcion,
        'Clasificación de proveedor ': fields.Clasificacion_de_proveedor_Clasificacion_de_proveedores.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Creacion_de_Proveedores  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Clave: x.Clave,
      ID_Dynamics: x.ID_Dynamics,
      Razon_social: x.Razon_social,
      RFC: x.RFC,
      Contacto: x.Contacto,
      Correo_electronico: x.Correo_electronico,
      Direccion_fiscal: x.Direccion_fiscal,
      Direccion_postal: x.Direccion_postal,
      Telefono_de_contacto: x.Telefono_de_contacto,
      Estatus: x.Estatus_Estatus_de_Proveedor.Descripcion,
      Tiempo_de_pagos_negociado: x.Tiempo_de_pagos_negociado,
      Tipo_de_proveedor: x.Tipo_de_proveedor_Tipos_de_proveedor.Descripcion,
      Se_realizo_auditoria: x.Se_realizo_auditoria_Respuesta.Descripcion,
      Clasificacion_de_proveedor: x.Clasificacion_de_proveedor_Clasificacion_de_proveedores.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Creacion_de_Proveedores',  ['Clave'    ,'ID_Dynamics'  ,'Razon_social'  ,'RFC'  ,'Contacto'  ,'Correo_electronico'  ,'Direccion_fiscal'  ,'Direccion_postal'  ,'Telefono_de_contacto'  ,'Estatus'  ,'Tiempo_de_pagos_negociado'  ,'Tipo_de_proveedor'  ,'Se_realizo_auditoria'  ,'Clasificacion_de_proveedor' ]);
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
    template += '          <th>Clave</th>';
    template += '          <th>ID Dynamics</th>';
    template += '          <th>Razón social</th>';
    template += '          <th>RFC</th>';
    template += '          <th>Contacto</th>';
    template += '          <th>Correo electrónico</th>';
    template += '          <th>Dirección fiscal</th>';
    template += '          <th>Dirección postal</th>';
    template += '          <th>Teléfono de contacto </th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Tiempo de pagos negociado (Numero de Días)</th>';
    template += '          <th>Tipo de proveedor</th>';
    template += '          <th>¿Se realizó auditoria?</th>';
    template += '          <th>Clasificación de proveedor</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Clave + '</td>';
      template += '          <td>' + element.ID_Dynamics + '</td>';
      template += '          <td>' + element.Razon_social + '</td>';
      template += '          <td>' + element.RFC + '</td>';
      template += '          <td>' + element.Contacto + '</td>';
      template += '          <td>' + element.Correo_electronico + '</td>';
      template += '          <td>' + element.Direccion_fiscal + '</td>';
      template += '          <td>' + element.Direccion_postal + '</td>';
      template += '          <td>' + element.Telefono_de_contacto + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Proveedor.Descripcion + '</td>';
      template += '          <td>' + element.Tiempo_de_pagos_negociado + '</td>';
      template += '          <td>' + element.Tipo_de_proveedor_Tipos_de_proveedor.Descripcion + '</td>';
      template += '          <td>' + element.Se_realizo_auditoria_Respuesta.Descripcion + '</td>';
      template += '          <td>' + element.Clasificacion_de_proveedor_Clasificacion_de_proveedores.Descripcion + '</td>';
		  
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
	template += '\t Clave';
	template += '\t ID Dynamics';
	template += '\t Razón social';
	template += '\t RFC';
	template += '\t Contacto';
	template += '\t Correo electrónico';
	template += '\t Dirección fiscal';
	template += '\t Dirección postal';
	template += '\t Teléfono de contacto ';
	template += '\t Estatus';
	template += '\t Tiempo de pagos negociado (Numero de Días)';
	template += '\t Tipo de proveedor';
	template += '\t ¿Se realizó auditoria?';
	template += '\t Clasificación de proveedor';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Clave;
	  template += '\t ' + element.ID_Dynamics;
	  template += '\t ' + element.Razon_social;
	  template += '\t ' + element.RFC;
	  template += '\t ' + element.Contacto;
	  template += '\t ' + element.Correo_electronico;
	  template += '\t ' + element.Direccion_fiscal;
	  template += '\t ' + element.Direccion_postal;
	  template += '\t ' + element.Telefono_de_contacto;
      template += '\t ' + element.Estatus_Estatus_de_Proveedor.Descripcion;
	  template += '\t ' + element.Tiempo_de_pagos_negociado;
      template += '\t ' + element.Tipo_de_proveedor_Tipos_de_proveedor.Descripcion;
      template += '\t ' + element.Se_realizo_auditoria_Respuesta.Descripcion;
      template += '\t ' + element.Clasificacion_de_proveedor_Clasificacion_de_proveedores.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Creacion_de_ProveedoresDataSource implements DataSource<Creacion_de_Proveedores>
{
  private subject = new BehaviorSubject<Creacion_de_Proveedores[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Creacion_de_ProveedoresService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Creacion_de_Proveedores[]> {
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
          if (column === 'Clave') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones'  && column != 'Cargar_acuerdo' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Creacion_de_Proveedoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Creacion_de_Proveedoress);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Clave != "")
      condition += " and Creacion_de_Proveedores.Clave = " + data.filter.Clave;
    if (data.filter.ID_Dynamics != "")
      condition += " and Creacion_de_Proveedores.ID_Dynamics like '%" + data.filter.ID_Dynamics + "%' ";
    if (data.filter.Razon_social != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Razon_social + "%' ";
    if (data.filter.RFC != "")
      condition += " and Creacion_de_Proveedores.RFC like '%" + data.filter.RFC + "%' ";
    if (data.filter.Contacto != "")
      condition += " and Creacion_de_Proveedores.Contacto like '%" + data.filter.Contacto + "%' ";
    if (data.filter.Correo_electronico != "")
      condition += " and Creacion_de_Proveedores.Correo_electronico like '%" + data.filter.Correo_electronico + "%' ";
    if (data.filter.Direccion_fiscal != "")
      condition += " and Creacion_de_Proveedores.Direccion_fiscal like '%" + data.filter.Direccion_fiscal + "%' ";
    if (data.filter.Direccion_postal != "")
      condition += " and Creacion_de_Proveedores.Direccion_postal like '%" + data.filter.Direccion_postal + "%' ";
    if (data.filter.Telefono_de_contacto != "")
      condition += " and Creacion_de_Proveedores.Telefono_de_contacto like '%" + data.filter.Telefono_de_contacto + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Proveedor.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Tiempo_de_pagos_negociado != "")
      condition += " and Creacion_de_Proveedores.Tiempo_de_pagos_negociado = " + data.filter.Tiempo_de_pagos_negociado;
    if (data.filter.Tipo_de_proveedor != "")
      condition += " and Tipos_de_proveedor.Descripcion like '%" + data.filter.Tipo_de_proveedor + "%' ";
    if (data.filter.Se_realizo_auditoria != "")
      condition += " and Respuesta.Descripcion like '%" + data.filter.Se_realizo_auditoria + "%' ";
    if (data.filter.Clasificacion_de_proveedor != "")
      condition += " and Clasificacion_de_proveedores.Descripcion like '%" + data.filter.Clasificacion_de_proveedor + "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "Clave":
        sort = " Creacion_de_Proveedores.Clave " + data.sortDirecction;
        break;
      case "ID_Dynamics":
        sort = " Creacion_de_Proveedores.ID_Dynamics " + data.sortDirecction;
        break;
      case "Razon_social":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "RFC":
        sort = " Creacion_de_Proveedores.RFC " + data.sortDirecction;
        break;
      case "Contacto":
        sort = " Creacion_de_Proveedores.Contacto " + data.sortDirecction;
        break;
      case "Correo_electronico":
        sort = " Creacion_de_Proveedores.Correo_electronico " + data.sortDirecction;
        break;
      case "Direccion_fiscal":
        sort = " Creacion_de_Proveedores.Direccion_fiscal " + data.sortDirecction;
        break;
      case "Direccion_postal":
        sort = " Creacion_de_Proveedores.Direccion_postal " + data.sortDirecction;
        break;
      case "Telefono_de_contacto":
        sort = " Creacion_de_Proveedores.Telefono_de_contacto " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Proveedor.Descripcion " + data.sortDirecction;
        break;
      case "Tiempo_de_pagos_negociado":
        sort = " Creacion_de_Proveedores.Tiempo_de_pagos_negociado " + data.sortDirecction;
        break;
      case "Tipo_de_proveedor":
        sort = " Tipos_de_proveedor.Descripcion " + data.sortDirecction;
        break;
      case "Se_realizo_auditoria":
        sort = " Respuesta.Descripcion " + data.sortDirecction;
        break;
      case "Clasificacion_de_proveedor":
        sort = " Clasificacion_de_proveedores.Descripcion " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromClave != 'undefined' && data.filterAdvanced.fromClave)
	|| (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave)) 
	{
      if (typeof data.filterAdvanced.fromClave != 'undefined' && data.filterAdvanced.fromClave)
        condition += " AND Creacion_de_Proveedores.Clave >= " + data.filterAdvanced.fromClave;

      if (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave) 
        condition += " AND Creacion_de_Proveedores.Clave <= " + data.filterAdvanced.toClave;
    }
    switch (data.filterAdvanced.ID_DynamicsFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Proveedores.ID_Dynamics LIKE '" + data.filterAdvanced.ID_Dynamics + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Proveedores.ID_Dynamics LIKE '%" + data.filterAdvanced.ID_Dynamics + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Proveedores.ID_Dynamics LIKE '%" + data.filterAdvanced.ID_Dynamics + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Proveedores.ID_Dynamics = '" + data.filterAdvanced.ID_Dynamics + "'";
        break;
    }
    switch (data.filterAdvanced.Razon_socialFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.Razon_social + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Razon_social + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Razon_social + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.Razon_social + "'";
        break;
    }
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
    switch (data.filterAdvanced.ContactoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Proveedores.Contacto LIKE '" + data.filterAdvanced.Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Proveedores.Contacto LIKE '%" + data.filterAdvanced.Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Proveedores.Contacto LIKE '%" + data.filterAdvanced.Contacto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Proveedores.Contacto = '" + data.filterAdvanced.Contacto + "'";
        break;
    }
    switch (data.filterAdvanced.Correo_electronicoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Proveedores.Correo_electronico LIKE '" + data.filterAdvanced.Correo_electronico + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Proveedores.Correo_electronico LIKE '%" + data.filterAdvanced.Correo_electronico + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Proveedores.Correo_electronico LIKE '%" + data.filterAdvanced.Correo_electronico + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Proveedores.Correo_electronico = '" + data.filterAdvanced.Correo_electronico + "'";
        break;
    }
    switch (data.filterAdvanced.Direccion_fiscalFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Proveedores.Direccion_fiscal LIKE '" + data.filterAdvanced.Direccion_fiscal + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Proveedores.Direccion_fiscal LIKE '%" + data.filterAdvanced.Direccion_fiscal + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Proveedores.Direccion_fiscal LIKE '%" + data.filterAdvanced.Direccion_fiscal + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Proveedores.Direccion_fiscal = '" + data.filterAdvanced.Direccion_fiscal + "'";
        break;
    }
    switch (data.filterAdvanced.Direccion_postalFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Proveedores.Direccion_postal LIKE '" + data.filterAdvanced.Direccion_postal + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Proveedores.Direccion_postal LIKE '%" + data.filterAdvanced.Direccion_postal + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Proveedores.Direccion_postal LIKE '%" + data.filterAdvanced.Direccion_postal + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Proveedores.Direccion_postal = '" + data.filterAdvanced.Direccion_postal + "'";
        break;
    }
    switch (data.filterAdvanced.Telefono_de_contactoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Proveedores.Telefono_de_contacto LIKE '" + data.filterAdvanced.Telefono_de_contacto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Proveedores.Telefono_de_contacto LIKE '%" + data.filterAdvanced.Telefono_de_contacto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Proveedores.Telefono_de_contacto LIKE '%" + data.filterAdvanced.Telefono_de_contacto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Proveedores.Telefono_de_contacto = '" + data.filterAdvanced.Telefono_de_contacto + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Proveedor.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Proveedor.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Proveedor.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Proveedor.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Creacion_de_Proveedores.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.fromTiempo_de_pagos_negociado != 'undefined' && data.filterAdvanced.fromTiempo_de_pagos_negociado)
	|| (typeof data.filterAdvanced.toTiempo_de_pagos_negociado != 'undefined' && data.filterAdvanced.toTiempo_de_pagos_negociado)) 
	{
      if (typeof data.filterAdvanced.fromTiempo_de_pagos_negociado != 'undefined' && data.filterAdvanced.fromTiempo_de_pagos_negociado)
        condition += " AND Creacion_de_Proveedores.Tiempo_de_pagos_negociado >= " + data.filterAdvanced.fromTiempo_de_pagos_negociado;

      if (typeof data.filterAdvanced.toTiempo_de_pagos_negociado != 'undefined' && data.filterAdvanced.toTiempo_de_pagos_negociado) 
        condition += " AND Creacion_de_Proveedores.Tiempo_de_pagos_negociado <= " + data.filterAdvanced.toTiempo_de_pagos_negociado;
    }
    if ((typeof data.filterAdvanced.Tipo_de_proveedor != 'undefined' && data.filterAdvanced.Tipo_de_proveedor)) {
      switch (data.filterAdvanced.Tipo_de_proveedorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipos_de_proveedor.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipos_de_proveedor.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipos_de_proveedor.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_proveedor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipos_de_proveedor.Descripcion = '" + data.filterAdvanced.Tipo_de_proveedor + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_proveedorMultiple != null && data.filterAdvanced.Tipo_de_proveedorMultiple.length > 0) {
      var Tipo_de_proveedords = data.filterAdvanced.Tipo_de_proveedorMultiple.join(",");
      condition += " AND Creacion_de_Proveedores.Tipo_de_proveedor In (" + Tipo_de_proveedords + ")";
    }
    if ((typeof data.filterAdvanced.Se_realizo_auditoria != 'undefined' && data.filterAdvanced.Se_realizo_auditoria)) {
      switch (data.filterAdvanced.Se_realizo_auditoriaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Respuesta.Descripcion LIKE '" + data.filterAdvanced.Se_realizo_auditoria + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Se_realizo_auditoria + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Se_realizo_auditoria + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Respuesta.Descripcion = '" + data.filterAdvanced.Se_realizo_auditoria + "'";
          break;
      }
    } else if (data.filterAdvanced.Se_realizo_auditoriaMultiple != null && data.filterAdvanced.Se_realizo_auditoriaMultiple.length > 0) {
      var Se_realizo_auditoriads = data.filterAdvanced.Se_realizo_auditoriaMultiple.join(",");
      condition += " AND Creacion_de_Proveedores.Se_realizo_auditoria In (" + Se_realizo_auditoriads + ")";
    }
    if ((typeof data.filterAdvanced.Clasificacion_de_proveedor != 'undefined' && data.filterAdvanced.Clasificacion_de_proveedor)) {
      switch (data.filterAdvanced.Clasificacion_de_proveedorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Clasificacion_de_proveedores.Descripcion LIKE '" + data.filterAdvanced.Clasificacion_de_proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Clasificacion_de_proveedores.Descripcion LIKE '%" + data.filterAdvanced.Clasificacion_de_proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Clasificacion_de_proveedores.Descripcion LIKE '%" + data.filterAdvanced.Clasificacion_de_proveedor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Clasificacion_de_proveedores.Descripcion = '" + data.filterAdvanced.Clasificacion_de_proveedor + "'";
          break;
      }
    } else if (data.filterAdvanced.Clasificacion_de_proveedorMultiple != null && data.filterAdvanced.Clasificacion_de_proveedorMultiple.length > 0) {
      var Clasificacion_de_proveedords = data.filterAdvanced.Clasificacion_de_proveedorMultiple.join(",");
      condition += " AND Creacion_de_Proveedores.Clasificacion_de_proveedor In (" + Clasificacion_de_proveedords + ")";
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
          if (column === 'Clave') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones'  && column != 'Cargar_acuerdo' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Creacion_de_Proveedoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Creacion_de_Proveedoress);
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
