import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Comparativo_de_Proveedores_ServiciosService } from "src/app/api-services/Comparativo_de_Proveedores_Servicios.service";
import { Comparativo_de_Proveedores_Servicios } from "src/app/models/Comparativo_de_Proveedores_Servicios";
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
import { Comparativo_de_Proveedores_ServiciosIndexRules } from 'src/app/shared/businessRules/Comparativo_de_Proveedores_Servicios-index-rules';
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
  selector: "app-list-Comparativo_de_Proveedores_Servicios",
  templateUrl: "./list-Comparativo_de_Proveedores_Servicios.component.html",
  styleUrls: ["./list-Comparativo_de_Proveedores_Servicios.component.scss"],
})
export class ListComparativo_de_Proveedores_ServiciosComponent extends Comparativo_de_Proveedores_ServiciosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Folio_MR_Servicios",
    "Folio_MR_Fila_Servicios",
    "No__de_Parte",
    "Descripcion",
    "Numero_de_Reporte",
    "Numero_de_O_T",
    "Matricula",
    "Modelo",
    "Fecha_Estimada_del_Mtto",
    "No__Solicitud",
    "Solicitante",
    "Fecha_de_Solicitud",
    "Estatus",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_MR_Servicios",
      "Folio_MR_Fila_Servicios",
      "No__de_Parte",
      "Descripcion",
      "Numero_de_Reporte",
      "Numero_de_O_T",
      "Matricula",
      "Modelo",
      "Fecha_Estimada_del_Mtto",
      "No__Solicitud",
      "Solicitante",
      "Fecha_de_Solicitud",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_MR_Servicios_filtro",
      "Folio_MR_Fila_Servicios_filtro",
      "No__de_Parte_filtro",
      "Descripcion_filtro",
      "Numero_de_Reporte_filtro",
      "Numero_de_O_T_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Fecha_Estimada_del_Mtto_filtro",
      "No__Solicitud_filtro",
      "Solicitante_filtro",
      "Fecha_de_Solicitud_filtro",
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
      Folio_MR_Servicios: "",
      Folio_MR_Fila_Servicios: "",
      No__de_Parte: "",
      Descripcion: "",
      Numero_de_Reporte: "",
      Numero_de_O_T: "",
      Matricula: "",
      Modelo: "",
      Fecha_Estimada_del_Mtto: null,
      No__Solicitud: "",
      Solicitante: "",
      Fecha_de_Solicitud: null,
      Estatus: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Folio_MR_ServiciosFilter: "",
      Folio_MR_Servicios: "",
      Folio_MR_ServiciosMultiple: "",
      Folio_MR_Fila_ServiciosFilter: "",
      Folio_MR_Fila_Servicios: "",
      Folio_MR_Fila_ServiciosMultiple: "",
      fromNo__de_Parte: "",
      toNo__de_Parte: "",
      fromNumero_de_Reporte: "",
      toNumero_de_Reporte: "",
      fromNumero_de_O_T: "",
      toNumero_de_O_T: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromFecha_Estimada_del_Mtto: "",
      toFecha_Estimada_del_Mtto: "",
      fromNo__Solicitud: "",
      toNo__Solicitud: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      fromFecha_de_Solicitud: "",
      toFecha_de_Solicitud: "",

    }
  };

  dataSource: Comparativo_de_Proveedores_ServiciosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Comparativo_de_Proveedores_ServiciosDataSource;
  dataClipboard: any;

  constructor(
    private _Comparativo_de_Proveedores_ServiciosService: Comparativo_de_Proveedores_ServiciosService,
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
    this.dataSource = new Comparativo_de_Proveedores_ServiciosDataSource(
      this._Comparativo_de_Proveedores_ServiciosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Comparativo_de_Proveedores_Servicios)
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
    this.listConfig.filter.Folio_MR_Servicios = "";
    this.listConfig.filter.Folio_MR_Fila_Servicios = "";
    this.listConfig.filter.No__de_Parte = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Numero_de_Reporte = "";
    this.listConfig.filter.Numero_de_O_T = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Fecha_Estimada_del_Mtto = undefined;
    this.listConfig.filter.No__Solicitud = "";
    this.listConfig.filter.Solicitante = "";
    this.listConfig.filter.Fecha_de_Solicitud = undefined;
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

  remove(row: Comparativo_de_Proveedores_Servicios) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Comparativo_de_Proveedores_ServiciosService
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
  ActionPrint(dataRow: Comparativo_de_Proveedores_Servicios) {

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
,'Folio MR Servicios'
,'Folio MR Fila Servicios'
,'No. de Parte'
,'Descripción '
,'Número de Reporte '
,'Número de O/T'
,'Matrícula'
,'Modelo'
,'Fecha Estimada del Mtto'
,'No. Solicitud'
,'Solicitante'
,'Fecha de Solicitud'
,'Estatus'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Folio_MR_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios
,x.Folio_MR_Fila_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios
,x.No__de_Parte
,x.Descripcion
,x.Numero_de_Reporte
,x.Numero_de_O_T
,x.Matricula_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.Fecha_Estimada_del_Mtto
,x.No__Solicitud
,x.Solicitante_Spartan_User.Name
,x.Fecha_de_Solicitud
,x.Estatus
		  
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
    pdfMake.createPdf(pdfDefinition).download('Comparativo_de_Proveedores_Servicios.pdf');
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
          this._Comparativo_de_Proveedores_ServiciosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Comparativo_de_Proveedores_Servicioss;
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
          this._Comparativo_de_Proveedores_ServiciosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Comparativo_de_Proveedores_Servicioss;
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
        'Folio MR Servicios ': fields.Folio_MR_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios,
        'Folio MR Fila Servicios 1': fields.Folio_MR_Fila_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios,
        'No. de Parte ': fields.No__de_Parte,
        'Descripción  ': fields.Descripcion,
        'Número de Reporte  ': fields.Numero_de_Reporte,
        'Número de O/T ': fields.Numero_de_O_T,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'Fecha Estimada del Mtto ': fields.Fecha_Estimada_del_Mtto ? momentJS(fields.Fecha_Estimada_del_Mtto).format('DD/MM/YYYY') : '',
        'No. Solicitud ': fields.No__Solicitud,
        'Solicitante ': fields.Solicitante_Spartan_User.Name,
        'Fecha de Solicitud ': fields.Fecha_de_Solicitud ? momentJS(fields.Fecha_de_Solicitud).format('DD/MM/YYYY') : '',
        'Estatus ': fields.Estatus,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Comparativo_de_Proveedores_Servicios  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Folio_MR_Servicios: x.Folio_MR_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios,
      Folio_MR_Fila_Servicios: x.Folio_MR_Fila_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios,
      No__de_Parte: x.No__de_Parte,
      Descripcion: x.Descripcion,
      Numero_de_Reporte: x.Numero_de_Reporte,
      Numero_de_O_T: x.Numero_de_O_T,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      Fecha_Estimada_del_Mtto: x.Fecha_Estimada_del_Mtto,
      No__Solicitud: x.No__Solicitud,
      Solicitante: x.Solicitante_Spartan_User.Name,
      Fecha_de_Solicitud: x.Fecha_de_Solicitud,
      Estatus: x.Estatus,

    }));

    this.excelService.exportToCsv(result, 'Comparativo_de_Proveedores_Servicios',  ['Folio'    ,'Folio_MR_Servicios'  ,'Folio_MR_Fila_Servicios'  ,'No__de_Parte'  ,'Descripcion'  ,'Numero_de_Reporte'  ,'Numero_de_O_T'  ,'Matricula'  ,'Modelo'  ,'Fecha_Estimada_del_Mtto'  ,'No__Solicitud'  ,'Solicitante'  ,'Fecha_de_Solicitud'  ,'Estatus' ]);
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
    template += '          <th>Folio MR Servicios</th>';
    template += '          <th>Folio MR Fila Servicios</th>';
    template += '          <th>No. de Parte</th>';
    template += '          <th>Descripción </th>';
    template += '          <th>Número de Reporte </th>';
    template += '          <th>Número de O/T</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Fecha Estimada del Mtto</th>';
    template += '          <th>No. Solicitud</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Fecha de Solicitud</th>';
    template += '          <th>Estatus</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Folio_MR_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios + '</td>';
      template += '          <td>' + element.Folio_MR_Fila_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios + '</td>';
      template += '          <td>' + element.No__de_Parte + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.Numero_de_Reporte + '</td>';
      template += '          <td>' + element.Numero_de_O_T + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_Estimada_del_Mtto + '</td>';
      template += '          <td>' + element.No__Solicitud + '</td>';
      template += '          <td>' + element.Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Fecha_de_Solicitud + '</td>';
      template += '          <td>' + element.Estatus + '</td>';
		  
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
	template += '\t Folio MR Servicios';
	template += '\t Folio MR Fila Servicios';
	template += '\t No. de Parte';
	template += '\t Descripción ';
	template += '\t Número de Reporte ';
	template += '\t Número de O/T';
	template += '\t Matrícula';
	template += '\t Modelo';
	template += '\t Fecha Estimada del Mtto';
	template += '\t No. Solicitud';
	template += '\t Solicitante';
	template += '\t Fecha de Solicitud';
	template += '\t Estatus';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Folio_MR_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios;
      template += '\t ' + element.Folio_MR_Fila_Servicios_Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios;
	  template += '\t ' + element.No__de_Parte;
	  template += '\t ' + element.Descripcion;
	  template += '\t ' + element.Numero_de_Reporte;
	  template += '\t ' + element.Numero_de_O_T;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
	  template += '\t ' + element.Fecha_Estimada_del_Mtto;
	  template += '\t ' + element.No__Solicitud;
      template += '\t ' + element.Solicitante_Spartan_User.Name;
	  template += '\t ' + element.Fecha_de_Solicitud;
	  template += '\t ' + element.Estatus;

	  template += '\n';
    });

    return template;
  }

}

export class Comparativo_de_Proveedores_ServiciosDataSource implements DataSource<Comparativo_de_Proveedores_Servicios>
{
  private subject = new BehaviorSubject<Comparativo_de_Proveedores_Servicios[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Comparativo_de_Proveedores_ServiciosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Comparativo_de_Proveedores_Servicios[]> {
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
              const longest = result.Comparativo_de_Proveedores_Servicioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Comparativo_de_Proveedores_Servicioss);
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
      condition += " and Comparativo_de_Proveedores_Servicios.Folio = " + data.filter.Folio;
    if (data.filter.Folio_MR_Servicios != "")
      condition += " and Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios like '%" + data.filter.Folio_MR_Servicios + "%' ";
    if (data.filter.Folio_MR_Fila_Servicios != "")
      condition += " and Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios like '%" + data.filter.Folio_MR_Fila_Servicios + "%' ";
    if (data.filter.No__de_Parte != "")
      condition += " and Comparativo_de_Proveedores_Servicios.No__de_Parte = " + data.filter.No__de_Parte;
    if (data.filter.Descripcion != "")
      condition += " and Comparativo_de_Proveedores_Servicios.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Numero_de_Reporte != "")
      condition += " and Comparativo_de_Proveedores_Servicios.Numero_de_Reporte = " + data.filter.Numero_de_Reporte;
    if (data.filter.Numero_de_O_T != "")
      condition += " and Comparativo_de_Proveedores_Servicios.Numero_de_O_T = " + data.filter.Numero_de_O_T;
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Fecha_Estimada_del_Mtto)
      condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Servicios.Fecha_Estimada_del_Mtto, 102)  = '" + moment(data.filter.Fecha_Estimada_del_Mtto).format("YYYY.MM.DD") + "'";
    if (data.filter.No__Solicitud != "")
      condition += " and Comparativo_de_Proveedores_Servicios.No__Solicitud = " + data.filter.No__Solicitud;
    if (data.filter.Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante + "%' ";
    if (data.filter.Fecha_de_Solicitud)
      condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Servicios.Fecha_de_Solicitud, 102)  = '" + moment(data.filter.Fecha_de_Solicitud).format("YYYY.MM.DD") + "'";
    if (data.filter.Estatus != "")
      condition += " and Comparativo_de_Proveedores_Servicios.Estatus like '%" + data.filter.Estatus + "%' ";

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
        sort = " Comparativo_de_Proveedores_Servicios.Folio " + data.sortDirecction;
        break;
      case "Folio_MR_Servicios":
        sort = " Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios " + data.sortDirecction;
        break;
      case "Folio_MR_Fila_Servicios":
        sort = " Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios " + data.sortDirecction;
        break;
      case "No__de_Parte":
        sort = " Comparativo_de_Proveedores_Servicios.No__de_Parte " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Comparativo_de_Proveedores_Servicios.Descripcion " + data.sortDirecction;
        break;
      case "Numero_de_Reporte":
        sort = " Comparativo_de_Proveedores_Servicios.Numero_de_Reporte " + data.sortDirecction;
        break;
      case "Numero_de_O_T":
        sort = " Comparativo_de_Proveedores_Servicios.Numero_de_O_T " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_Estimada_del_Mtto":
        sort = " Comparativo_de_Proveedores_Servicios.Fecha_Estimada_del_Mtto " + data.sortDirecction;
        break;
      case "No__Solicitud":
        sort = " Comparativo_de_Proveedores_Servicios.No__Solicitud " + data.sortDirecction;
        break;
      case "Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Fecha_de_Solicitud":
        sort = " Comparativo_de_Proveedores_Servicios.Fecha_de_Solicitud " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Comparativo_de_Proveedores_Servicios.Estatus " + data.sortDirecction;
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
        condition += " AND Comparativo_de_Proveedores_Servicios.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Comparativo_de_Proveedores_Servicios.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Folio_MR_Servicios != 'undefined' && data.filterAdvanced.Folio_MR_Servicios)) {
      switch (data.filterAdvanced.Folio_MR_ServiciosFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios LIKE '" + data.filterAdvanced.Folio_MR_Servicios + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios LIKE '%" + data.filterAdvanced.Folio_MR_Servicios + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios LIKE '%" + data.filterAdvanced.Folio_MR_Servicios + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_Solicitud_de_Servicios = '" + data.filterAdvanced.Folio_MR_Servicios + "'";
          break;
      }
    } else if (data.filterAdvanced.Folio_MR_ServiciosMultiple != null && data.filterAdvanced.Folio_MR_ServiciosMultiple.length > 0) {
      var Folio_MR_Serviciosds = data.filterAdvanced.Folio_MR_ServiciosMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Servicios.Folio_MR_Servicios In (" + Folio_MR_Serviciosds + ")";
    }
    if ((typeof data.filterAdvanced.Folio_MR_Fila_Servicios != 'undefined' && data.filterAdvanced.Folio_MR_Fila_Servicios)) {
      switch (data.filterAdvanced.Folio_MR_Fila_ServiciosFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios LIKE '" + data.filterAdvanced.Folio_MR_Fila_Servicios + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios LIKE '%" + data.filterAdvanced.Folio_MR_Fila_Servicios + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios LIKE '%" + data.filterAdvanced.Folio_MR_Fila_Servicios + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.Folio_MR_fila_Solicitud_de_Servicios = '" + data.filterAdvanced.Folio_MR_Fila_Servicios + "'";
          break;
      }
    } else if (data.filterAdvanced.Folio_MR_Fila_ServiciosMultiple != null && data.filterAdvanced.Folio_MR_Fila_ServiciosMultiple.length > 0) {
      var Folio_MR_Fila_Serviciosds = data.filterAdvanced.Folio_MR_Fila_ServiciosMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Servicios.Folio_MR_Fila_Servicios In (" + Folio_MR_Fila_Serviciosds + ")";
    }
    if ((typeof data.filterAdvanced.fromNo__de_Parte != 'undefined' && data.filterAdvanced.fromNo__de_Parte)
	|| (typeof data.filterAdvanced.toNo__de_Parte != 'undefined' && data.filterAdvanced.toNo__de_Parte)) 
	{
      if (typeof data.filterAdvanced.fromNo__de_Parte != 'undefined' && data.filterAdvanced.fromNo__de_Parte)
        condition += " AND Comparativo_de_Proveedores_Servicios.No__de_Parte >= " + data.filterAdvanced.fromNo__de_Parte;

      if (typeof data.filterAdvanced.toNo__de_Parte != 'undefined' && data.filterAdvanced.toNo__de_Parte) 
        condition += " AND Comparativo_de_Proveedores_Servicios.No__de_Parte <= " + data.filterAdvanced.toNo__de_Parte;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Servicios.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Servicios.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Servicios.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Servicios.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromNumero_de_Reporte != 'undefined' && data.filterAdvanced.fromNumero_de_Reporte)
	|| (typeof data.filterAdvanced.toNumero_de_Reporte != 'undefined' && data.filterAdvanced.toNumero_de_Reporte)) 
	{
      if (typeof data.filterAdvanced.fromNumero_de_Reporte != 'undefined' && data.filterAdvanced.fromNumero_de_Reporte)
        condition += " AND Comparativo_de_Proveedores_Servicios.Numero_de_Reporte >= " + data.filterAdvanced.fromNumero_de_Reporte;

      if (typeof data.filterAdvanced.toNumero_de_Reporte != 'undefined' && data.filterAdvanced.toNumero_de_Reporte) 
        condition += " AND Comparativo_de_Proveedores_Servicios.Numero_de_Reporte <= " + data.filterAdvanced.toNumero_de_Reporte;
    }
    if ((typeof data.filterAdvanced.fromNumero_de_O_T != 'undefined' && data.filterAdvanced.fromNumero_de_O_T)
	|| (typeof data.filterAdvanced.toNumero_de_O_T != 'undefined' && data.filterAdvanced.toNumero_de_O_T)) 
	{
      if (typeof data.filterAdvanced.fromNumero_de_O_T != 'undefined' && data.filterAdvanced.fromNumero_de_O_T)
        condition += " AND Comparativo_de_Proveedores_Servicios.Numero_de_O_T >= " + data.filterAdvanced.fromNumero_de_O_T;

      if (typeof data.filterAdvanced.toNumero_de_O_T != 'undefined' && data.filterAdvanced.toNumero_de_O_T) 
        condition += " AND Comparativo_de_Proveedores_Servicios.Numero_de_O_T <= " + data.filterAdvanced.toNumero_de_O_T;
    }
    if ((typeof data.filterAdvanced.Matricula != 'undefined' && data.filterAdvanced.Matricula)) {
      switch (data.filterAdvanced.MatriculaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeronave.Matricula LIKE '" + data.filterAdvanced.Matricula + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Matricula + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Matricula + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeronave.Matricula = '" + data.filterAdvanced.Matricula + "'";
          break;
      }
    } else if (data.filterAdvanced.MatriculaMultiple != null && data.filterAdvanced.MatriculaMultiple.length > 0) {
      var Matriculads = data.filterAdvanced.MatriculaMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Servicios.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.Modelo != 'undefined' && data.filterAdvanced.Modelo)) {
      switch (data.filterAdvanced.ModeloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Modelos.Descripcion LIKE '" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Modelos.Descripcion = '" + data.filterAdvanced.Modelo + "'";
          break;
      }
    } else if (data.filterAdvanced.ModeloMultiple != null && data.filterAdvanced.ModeloMultiple.length > 0) {
      var Modelods = data.filterAdvanced.ModeloMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Servicios.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_Estimada_del_Mtto != 'undefined' && data.filterAdvanced.fromFecha_Estimada_del_Mtto)
	|| (typeof data.filterAdvanced.toFecha_Estimada_del_Mtto != 'undefined' && data.filterAdvanced.toFecha_Estimada_del_Mtto)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Estimada_del_Mtto != 'undefined' && data.filterAdvanced.fromFecha_Estimada_del_Mtto) 
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Servicios.Fecha_Estimada_del_Mtto, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Estimada_del_Mtto).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Estimada_del_Mtto != 'undefined' && data.filterAdvanced.toFecha_Estimada_del_Mtto) 
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Servicios.Fecha_Estimada_del_Mtto, 102)  <= '" + moment(data.filterAdvanced.toFecha_Estimada_del_Mtto).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromNo__Solicitud != 'undefined' && data.filterAdvanced.fromNo__Solicitud)
	|| (typeof data.filterAdvanced.toNo__Solicitud != 'undefined' && data.filterAdvanced.toNo__Solicitud)) 
	{
      if (typeof data.filterAdvanced.fromNo__Solicitud != 'undefined' && data.filterAdvanced.fromNo__Solicitud)
        condition += " AND Comparativo_de_Proveedores_Servicios.No__Solicitud >= " + data.filterAdvanced.fromNo__Solicitud;

      if (typeof data.filterAdvanced.toNo__Solicitud != 'undefined' && data.filterAdvanced.toNo__Solicitud) 
        condition += " AND Comparativo_de_Proveedores_Servicios.No__Solicitud <= " + data.filterAdvanced.toNo__Solicitud;
    }
    if ((typeof data.filterAdvanced.Solicitante != 'undefined' && data.filterAdvanced.Solicitante)) {
      switch (data.filterAdvanced.SolicitanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Solicitante + "'";
          break;
      }
    } else if (data.filterAdvanced.SolicitanteMultiple != null && data.filterAdvanced.SolicitanteMultiple.length > 0) {
      var Solicitanteds = data.filterAdvanced.SolicitanteMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Servicios.Solicitante In (" + Solicitanteds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_Solicitud)
	|| (typeof data.filterAdvanced.toFecha_de_Solicitud != 'undefined' && data.filterAdvanced.toFecha_de_Solicitud)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_Solicitud) 
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Servicios.Fecha_de_Solicitud, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Solicitud).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Solicitud != 'undefined' && data.filterAdvanced.toFecha_de_Solicitud) 
        condition += " and CONVERT(VARCHAR(10), Comparativo_de_Proveedores_Servicios.Fecha_de_Solicitud, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Solicitud).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.EstatusFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Servicios.Estatus LIKE '" + data.filterAdvanced.Estatus + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Servicios.Estatus LIKE '%" + data.filterAdvanced.Estatus + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Servicios.Estatus LIKE '%" + data.filterAdvanced.Estatus + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Servicios.Estatus = '" + data.filterAdvanced.Estatus + "'";
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
              const longest = result.Comparativo_de_Proveedores_Servicioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Comparativo_de_Proveedores_Servicioss);
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
