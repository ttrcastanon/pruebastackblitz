import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Orden_de_TrabajoService } from "src/app/api-services/Orden_de_Trabajo.service";
import { Orden_de_Trabajo } from "src/app/models/Orden_de_Trabajo";
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
import { Orden_de_TrabajoIndexRules } from 'src/app/shared/businessRules/Orden_de_Trabajo-index-rules';
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
  selector: "app-list-Orden_de_Trabajo",
  templateUrl: "./list-Orden_de_Trabajo.component.html",
  styleUrls: ["./list-Orden_de_Trabajo.component.scss"],
})
export class ListOrden_de_TrabajoComponent extends Orden_de_TrabajoIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Tipo_de_orden",
    "Matricula",
    "Modelo",
    "Propietario",
    "Fecha_de_Creacion",
    "Fecha_de_entrega",
    "Cant_de_reportes_pendientes",
    "Cant_de_reportes_asignados",
    "Cant_de_reportes_cerrados",
    "Cant_de_rpts_mandatorios_abiertos",
    "Horas_acumuladas",
    "Ciclos_acumulados",
    "Estatus",
    "Causa_de_Cancelacion",
    "numero_de_orden",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Tipo_de_orden",
      "Matricula",
      "Modelo",
      "Propietario",
      "Fecha_de_Creacion",
      "Fecha_de_entrega",
      "Cant_de_reportes_pendientes",
      "Cant_de_reportes_asignados",
      "Cant_de_reportes_cerrados",
      "Cant_de_rpts_mandatorios_abiertos",
      "Horas_acumuladas",
      "Ciclos_acumulados",
      "Estatus",
      "Causa_de_Cancelacion",
      "numero_de_orden",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Tipo_de_orden_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Propietario_filtro",
      "Fecha_de_Creacion_filtro",
      "Fecha_de_entrega_filtro",
      "Cant_de_reportes_pendientes_filtro",
      "Cant_de_reportes_asignados_filtro",
      "Cant_de_reportes_cerrados_filtro",
      "Cant_de_rpts_mandatorios_abiertos_filtro",
      "Horas_acumuladas_filtro",
      "Ciclos_acumulados_filtro",
      "Estatus_filtro",
      "Causa_de_Cancelacion_filtro",
      "numero_de_orden_filtro",

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
      Tipo_de_orden: "",
      Matricula: "",
      Modelo: "",
      Propietario: "",
      Fecha_de_Creacion: null,
      Fecha_de_entrega: null,
      Cant_de_reportes_pendientes: "",
      Cant_de_reportes_asignados: "",
      Cant_de_reportes_cerrados: "",
      Cant_de_rpts_mandatorios_abiertos: "",
      Horas_acumuladas: "",
      Ciclos_acumulados: "",
      Estatus: "",
      Causa_de_Cancelacion: "",
      numero_de_orden: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Tipo_de_ordenFilter: "",
      Tipo_de_orden: "",
      Tipo_de_ordenMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      fromFecha_de_Creacion: "",
      toFecha_de_Creacion: "",
      fromFecha_de_entrega: "",
      toFecha_de_entrega: "",
      fromCant_de_reportes_pendientes: "",
      toCant_de_reportes_pendientes: "",
      fromCant_de_reportes_asignados: "",
      toCant_de_reportes_asignados: "",
      fromCant_de_reportes_cerrados: "",
      toCant_de_reportes_cerrados: "",
      fromCant_de_rpts_mandatorios_abiertos: "",
      toCant_de_rpts_mandatorios_abiertos: "",
      fromHoras_acumuladas: "",
      toHoras_acumuladas: "",
      fromCiclos_acumulados: "",
      toCiclos_acumulados: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

    }
  };

  dataSource: Orden_de_TrabajoDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Orden_de_TrabajoDataSource;
  dataClipboard: any;

  constructor(
    private _Orden_de_TrabajoService: Orden_de_TrabajoService,
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
    this.dataSource = new Orden_de_TrabajoDataSource(
      this._Orden_de_TrabajoService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Orden_de_Trabajo)
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
    this.listConfig.filter.Tipo_de_orden = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Propietario = "";
    this.listConfig.filter.Fecha_de_Creacion = undefined;
    this.listConfig.filter.Fecha_de_entrega = undefined;
    this.listConfig.filter.Cant_de_reportes_pendientes = "";
    this.listConfig.filter.Cant_de_reportes_asignados = "";
    this.listConfig.filter.Cant_de_reportes_cerrados = "";
    this.listConfig.filter.Cant_de_rpts_mandatorios_abiertos = "";
    this.listConfig.filter.Horas_acumuladas = "";
    this.listConfig.filter.Ciclos_acumulados = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Causa_de_Cancelacion = "";
    this.listConfig.filter.numero_de_orden = "";

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

//INICIA - BRID:5665 - WF:8 Rule List - Phase: 2 (Orden de trabajo primaria) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
if( this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123')==this.brf.EvaluaQuery("Select '2'", 1, 'ABC123') ) { this.brf.SetFilteronList(this.listConfig," Orden_de_Trabajo.Tipo_de_orden = 1 ");} else {}
//TERMINA - BRID:5665


//INICIA - BRID:5667 - WF:8 Rule List - Phase: 3 (Orden de trabajo secundaria) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
if( this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123')==this.brf.EvaluaQuery("Select '3'", 1, 'ABC123') ) { this.brf.SetFilteronList(this.listConfig," Orden_de_Trabajo.Tipo_de_orden = 2 ");} else {}
//TERMINA - BRID:5667

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

  remove(row: Orden_de_Trabajo) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Orden_de_TrabajoService
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
  ActionPrint(dataRow: Orden_de_Trabajo) {

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
'Número de Orden'
,'Tipo de orden'
,'Matrícula'
,'Modelo'
,'Propietario'
,'Fecha de Creación'
,'Fecha de cierre'
,'Cant. de reportes pendientes'
,'Cant. de reportes asignados'
,'Cant. de reportes cerrados'
,'Cant. de reportes mandatorios abiertos'
,'Horas acumuladas'
,'Ciclos acumulados'
,'Estatus'
,'Causa de Cancelación'
,'numero de orden'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Tipo_de_orden_Tipo_de_Orden_de_Trabajo.Descripcion
,x.Matricula_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.Propietario_Propietarios.Nombre
,x.Fecha_de_Creacion
,x.Fecha_de_entrega
,x.Cant_de_reportes_pendientes
,x.Cant_de_reportes_asignados
,x.Cant_de_reportes_cerrados
,x.Cant_de_rpts_mandatorios_abiertos
,x.Horas_acumuladas
,x.Ciclos_acumulados
,x.Estatus_Estatus_Reporte.Descripcion
,x.Causa_de_Cancelacion
,x.numero_de_orden
		  
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
    pdfMake.createPdf(pdfDefinition).download('Orden_de_Trabajo.pdf');
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
          this._Orden_de_TrabajoService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Orden_de_Trabajos;
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
          this._Orden_de_TrabajoService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Orden_de_Trabajos;
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
        'Número de Orden ': fields.Folio,
        'Tipo de orden ': fields.Tipo_de_orden_Tipo_de_Orden_de_Trabajo.Descripcion,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'Propietario ': fields.Propietario_Propietarios.Nombre,
        'Fecha de Creación ': fields.Fecha_de_Creacion ? momentJS(fields.Fecha_de_Creacion).format('DD/MM/YYYY') : '',
        'Fecha de cierre ': fields.Fecha_de_entrega ? momentJS(fields.Fecha_de_entrega).format('DD/MM/YYYY') : '',
        'Cant. de reportes pendientes ': fields.Cant_de_reportes_pendientes,
        'Cant. de reportes asignados ': fields.Cant_de_reportes_asignados,
        'Cant. de reportes cerrados ': fields.Cant_de_reportes_cerrados,
        'Cant. de reportes mandatorios abiertos ': fields.Cant_de_rpts_mandatorios_abiertos,
        'Horas acumuladas ': fields.Horas_acumuladas,
        'Ciclos acumulados ': fields.Ciclos_acumulados,
        'Estatus ': fields.Estatus_Estatus_Reporte.Descripcion,
        'Causa de Cancelación ': fields.Causa_de_Cancelacion,
        'numero de orden ': fields.numero_de_orden,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Orden_de_Trabajo  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Tipo_de_orden: x.Tipo_de_orden_Tipo_de_Orden_de_Trabajo.Descripcion,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      Propietario: x.Propietario_Propietarios.Nombre,
      Fecha_de_Creacion: x.Fecha_de_Creacion,
      Fecha_de_entrega: x.Fecha_de_entrega,
      Cant_de_reportes_pendientes: x.Cant_de_reportes_pendientes,
      Cant_de_reportes_asignados: x.Cant_de_reportes_asignados,
      Cant_de_reportes_cerrados: x.Cant_de_reportes_cerrados,
      Cant_de_rpts_mandatorios_abiertos: x.Cant_de_rpts_mandatorios_abiertos,
      Horas_acumuladas: x.Horas_acumuladas,
      Ciclos_acumulados: x.Ciclos_acumulados,
      Estatus: x.Estatus_Estatus_Reporte.Descripcion,
      Causa_de_Cancelacion: x.Causa_de_Cancelacion,
      numero_de_orden: x.numero_de_orden,

    }));

    this.excelService.exportToCsv(result, 'Orden_de_Trabajo',  ['Folio'    ,'Tipo_de_orden'  ,'Matricula'  ,'Modelo'  ,'Propietario'  ,'Fecha_de_Creacion'  ,'Fecha_de_entrega'  ,'Cant_de_reportes_pendientes'  ,'Cant_de_reportes_asignados'  ,'Cant_de_reportes_cerrados'  ,'Cant_de_rpts_mandatorios_abiertos'  ,'Horas_acumuladas'  ,'Ciclos_acumulados'  ,'Estatus'  ,'Causa_de_Cancelacion'  ,'numero_de_orden' ]);
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
    template += '          <th>Número de Orden</th>';
    template += '          <th>Tipo de orden</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Propietario</th>';
    template += '          <th>Fecha de Creación</th>';
    template += '          <th>Fecha de cierre</th>';
    template += '          <th>Cant. de reportes pendientes</th>';
    template += '          <th>Cant. de reportes asignados</th>';
    template += '          <th>Cant. de reportes cerrados</th>';
    template += '          <th>Cant. de reportes mandatorios abiertos</th>';
    template += '          <th>Horas acumuladas</th>';
    template += '          <th>Ciclos acumulados</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Causa de Cancelación</th>';
    template += '          <th>numero de orden</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Tipo_de_orden_Tipo_de_Orden_de_Trabajo.Descripcion + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Propietario_Propietarios.Nombre + '</td>';
      template += '          <td>' + element.Fecha_de_Creacion + '</td>';
      template += '          <td>' + element.Fecha_de_entrega + '</td>';
      template += '          <td>' + element.Cant_de_reportes_pendientes + '</td>';
      template += '          <td>' + element.Cant_de_reportes_asignados + '</td>';
      template += '          <td>' + element.Cant_de_reportes_cerrados + '</td>';
      template += '          <td>' + element.Cant_de_rpts_mandatorios_abiertos + '</td>';
      template += '          <td>' + element.Horas_acumuladas + '</td>';
      template += '          <td>' + element.Ciclos_acumulados + '</td>';
      template += '          <td>' + element.Estatus_Estatus_Reporte.Descripcion + '</td>';
      template += '          <td>' + element.Causa_de_Cancelacion + '</td>';
      template += '          <td>' + element.numero_de_orden + '</td>';
		  
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
	template += '\t Número de Orden';
	template += '\t Tipo de orden';
	template += '\t Matrícula';
	template += '\t Modelo';
	template += '\t Propietario';
	template += '\t Fecha de Creación';
	template += '\t Fecha de cierre';
	template += '\t Cant. de reportes pendientes';
	template += '\t Cant. de reportes asignados';
	template += '\t Cant. de reportes cerrados';
	template += '\t Cant. de reportes mandatorios abiertos';
	template += '\t Horas acumuladas';
	template += '\t Ciclos acumulados';
	template += '\t Estatus';
	template += '\t Causa de Cancelación';
	template += '\t numero de orden';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Tipo_de_orden_Tipo_de_Orden_de_Trabajo.Descripcion;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.Propietario_Propietarios.Nombre;
	  template += '\t ' + element.Fecha_de_Creacion;
	  template += '\t ' + element.Fecha_de_entrega;
	  template += '\t ' + element.Cant_de_reportes_pendientes;
	  template += '\t ' + element.Cant_de_reportes_asignados;
	  template += '\t ' + element.Cant_de_reportes_cerrados;
	  template += '\t ' + element.Cant_de_rpts_mandatorios_abiertos;
	  template += '\t ' + element.Horas_acumuladas;
	  template += '\t ' + element.Ciclos_acumulados;
      template += '\t ' + element.Estatus_Estatus_Reporte.Descripcion;
	  template += '\t ' + element.Causa_de_Cancelacion;
	  template += '\t ' + element.numero_de_orden;

	  template += '\n';
    });

    return template;
  }

}

export class Orden_de_TrabajoDataSource implements DataSource<Orden_de_Trabajo>
{
  private subject = new BehaviorSubject<Orden_de_Trabajo[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Orden_de_TrabajoService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Orden_de_Trabajo[]> {
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
              const longest = result.Orden_de_Trabajos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Orden_de_Trabajos);
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
      condition += " and Orden_de_Trabajo.Folio = " + data.filter.Folio;
    if (data.filter.Tipo_de_orden != "")
      condition += " and Tipo_de_Orden_de_Trabajo.Descripcion like '%" + data.filter.Tipo_de_orden + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Propietario != "")
      condition += " and Propietarios.Nombre like '%" + data.filter.Propietario + "%' ";
    if (data.filter.Fecha_de_Creacion)
      condition += " and CONVERT(VARCHAR(10), Orden_de_Trabajo.Fecha_de_Creacion, 102)  = '" + moment(data.filter.Fecha_de_Creacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_entrega)
      condition += " and CONVERT(VARCHAR(10), Orden_de_Trabajo.Fecha_de_entrega, 102)  = '" + moment(data.filter.Fecha_de_entrega).format("YYYY.MM.DD") + "'";
    if (data.filter.Cant_de_reportes_pendientes != "")
      condition += " and Orden_de_Trabajo.Cant_de_reportes_pendientes = " + data.filter.Cant_de_reportes_pendientes;
    if (data.filter.Cant_de_reportes_asignados != "")
      condition += " and Orden_de_Trabajo.Cant_de_reportes_asignados = " + data.filter.Cant_de_reportes_asignados;
    if (data.filter.Cant_de_reportes_cerrados != "")
      condition += " and Orden_de_Trabajo.Cant_de_reportes_cerrados = " + data.filter.Cant_de_reportes_cerrados;
    if (data.filter.Cant_de_rpts_mandatorios_abiertos != "")
      condition += " and Orden_de_Trabajo.Cant_de_rpts_mandatorios_abiertos = " + data.filter.Cant_de_rpts_mandatorios_abiertos;
    if (data.filter.Horas_acumuladas != "")
      condition += " and Orden_de_Trabajo.Horas_acumuladas = " + data.filter.Horas_acumuladas;
    if (data.filter.Ciclos_acumulados != "")
      condition += " and Orden_de_Trabajo.Ciclos_acumulados = " + data.filter.Ciclos_acumulados;
    if (data.filter.Estatus != "")
      condition += " and Estatus_Reporte.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Causa_de_Cancelacion != "")
      condition += " and Orden_de_Trabajo.Causa_de_Cancelacion like '%" + data.filter.Causa_de_Cancelacion + "%' ";
    if (data.filter.numero_de_orden != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.numero_de_orden + "%' ";

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
        sort = " Orden_de_Trabajo.Folio " + data.sortDirecction;
        break;
      case "Tipo_de_orden":
        sort = " Tipo_de_Orden_de_Trabajo.Descripcion " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Propietario":
        sort = " Propietarios.Nombre " + data.sortDirecction;
        break;
      case "Fecha_de_Creacion":
        sort = " Orden_de_Trabajo.Fecha_de_Creacion " + data.sortDirecction;
        break;
      case "Fecha_de_entrega":
        sort = " Orden_de_Trabajo.Fecha_de_entrega " + data.sortDirecction;
        break;
      case "Cant_de_reportes_pendientes":
        sort = " Orden_de_Trabajo.Cant_de_reportes_pendientes " + data.sortDirecction;
        break;
      case "Cant_de_reportes_asignados":
        sort = " Orden_de_Trabajo.Cant_de_reportes_asignados " + data.sortDirecction;
        break;
      case "Cant_de_reportes_cerrados":
        sort = " Orden_de_Trabajo.Cant_de_reportes_cerrados " + data.sortDirecction;
        break;
      case "Cant_de_rpts_mandatorios_abiertos":
        sort = " Orden_de_Trabajo.Cant_de_rpts_mandatorios_abiertos " + data.sortDirecction;
        break;
      case "Horas_acumuladas":
        sort = " Orden_de_Trabajo.Horas_acumuladas " + data.sortDirecction;
        break;
      case "Ciclos_acumulados":
        sort = " Orden_de_Trabajo.Ciclos_acumulados " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_Reporte.Descripcion " + data.sortDirecction;
        break;
      case "Causa_de_Cancelacion":
        sort = " Orden_de_Trabajo.Causa_de_Cancelacion " + data.sortDirecction;
        break;
      case "numero_de_orden":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
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
        condition += " AND Orden_de_Trabajo.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Orden_de_Trabajo.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Tipo_de_orden != 'undefined' && data.filterAdvanced.Tipo_de_orden)) {
      switch (data.filterAdvanced.Tipo_de_ordenFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Orden_de_Trabajo.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_orden + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Orden_de_Trabajo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_orden + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Orden_de_Trabajo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_orden + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Orden_de_Trabajo.Descripcion = '" + data.filterAdvanced.Tipo_de_orden + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_ordenMultiple != null && data.filterAdvanced.Tipo_de_ordenMultiple.length > 0) {
      var Tipo_de_ordends = data.filterAdvanced.Tipo_de_ordenMultiple.join(",");
      condition += " AND Orden_de_Trabajo.Tipo_de_orden In (" + Tipo_de_ordends + ")";
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
      condition += " AND Orden_de_Trabajo.Matricula In (" + Matriculads + ")";
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
      condition += " AND Orden_de_Trabajo.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.Propietario != 'undefined' && data.filterAdvanced.Propietario)) {
      switch (data.filterAdvanced.PropietarioFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Propietarios.Nombre LIKE '" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Propietarios.Nombre = '" + data.filterAdvanced.Propietario + "'";
          break;
      }
    } else if (data.filterAdvanced.PropietarioMultiple != null && data.filterAdvanced.PropietarioMultiple.length > 0) {
      var Propietariods = data.filterAdvanced.PropietarioMultiple.join(",");
      condition += " AND Orden_de_Trabajo.Propietario In (" + Propietariods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Creacion != 'undefined' && data.filterAdvanced.fromFecha_de_Creacion)
	|| (typeof data.filterAdvanced.toFecha_de_Creacion != 'undefined' && data.filterAdvanced.toFecha_de_Creacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Creacion != 'undefined' && data.filterAdvanced.fromFecha_de_Creacion) 
        condition += " and CONVERT(VARCHAR(10), Orden_de_Trabajo.Fecha_de_Creacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Creacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Creacion != 'undefined' && data.filterAdvanced.toFecha_de_Creacion) 
        condition += " and CONVERT(VARCHAR(10), Orden_de_Trabajo.Fecha_de_Creacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Creacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_entrega != 'undefined' && data.filterAdvanced.fromFecha_de_entrega)
	|| (typeof data.filterAdvanced.toFecha_de_entrega != 'undefined' && data.filterAdvanced.toFecha_de_entrega)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_entrega != 'undefined' && data.filterAdvanced.fromFecha_de_entrega) 
        condition += " and CONVERT(VARCHAR(10), Orden_de_Trabajo.Fecha_de_entrega, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_entrega).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_entrega != 'undefined' && data.filterAdvanced.toFecha_de_entrega) 
        condition += " and CONVERT(VARCHAR(10), Orden_de_Trabajo.Fecha_de_entrega, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_entrega).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromCant_de_reportes_pendientes != 'undefined' && data.filterAdvanced.fromCant_de_reportes_pendientes)
	|| (typeof data.filterAdvanced.toCant_de_reportes_pendientes != 'undefined' && data.filterAdvanced.toCant_de_reportes_pendientes)) 
	{
      if (typeof data.filterAdvanced.fromCant_de_reportes_pendientes != 'undefined' && data.filterAdvanced.fromCant_de_reportes_pendientes)
        condition += " AND Orden_de_Trabajo.Cant_de_reportes_pendientes >= " + data.filterAdvanced.fromCant_de_reportes_pendientes;

      if (typeof data.filterAdvanced.toCant_de_reportes_pendientes != 'undefined' && data.filterAdvanced.toCant_de_reportes_pendientes) 
        condition += " AND Orden_de_Trabajo.Cant_de_reportes_pendientes <= " + data.filterAdvanced.toCant_de_reportes_pendientes;
    }
    if ((typeof data.filterAdvanced.fromCant_de_reportes_asignados != 'undefined' && data.filterAdvanced.fromCant_de_reportes_asignados)
	|| (typeof data.filterAdvanced.toCant_de_reportes_asignados != 'undefined' && data.filterAdvanced.toCant_de_reportes_asignados)) 
	{
      if (typeof data.filterAdvanced.fromCant_de_reportes_asignados != 'undefined' && data.filterAdvanced.fromCant_de_reportes_asignados)
        condition += " AND Orden_de_Trabajo.Cant_de_reportes_asignados >= " + data.filterAdvanced.fromCant_de_reportes_asignados;

      if (typeof data.filterAdvanced.toCant_de_reportes_asignados != 'undefined' && data.filterAdvanced.toCant_de_reportes_asignados) 
        condition += " AND Orden_de_Trabajo.Cant_de_reportes_asignados <= " + data.filterAdvanced.toCant_de_reportes_asignados;
    }
    if ((typeof data.filterAdvanced.fromCant_de_reportes_cerrados != 'undefined' && data.filterAdvanced.fromCant_de_reportes_cerrados)
	|| (typeof data.filterAdvanced.toCant_de_reportes_cerrados != 'undefined' && data.filterAdvanced.toCant_de_reportes_cerrados)) 
	{
      if (typeof data.filterAdvanced.fromCant_de_reportes_cerrados != 'undefined' && data.filterAdvanced.fromCant_de_reportes_cerrados)
        condition += " AND Orden_de_Trabajo.Cant_de_reportes_cerrados >= " + data.filterAdvanced.fromCant_de_reportes_cerrados;

      if (typeof data.filterAdvanced.toCant_de_reportes_cerrados != 'undefined' && data.filterAdvanced.toCant_de_reportes_cerrados) 
        condition += " AND Orden_de_Trabajo.Cant_de_reportes_cerrados <= " + data.filterAdvanced.toCant_de_reportes_cerrados;
    }
    if ((typeof data.filterAdvanced.fromCant_de_rpts_mandatorios_abiertos != 'undefined' && data.filterAdvanced.fromCant_de_rpts_mandatorios_abiertos)
	|| (typeof data.filterAdvanced.toCant_de_rpts_mandatorios_abiertos != 'undefined' && data.filterAdvanced.toCant_de_rpts_mandatorios_abiertos)) 
	{
      if (typeof data.filterAdvanced.fromCant_de_rpts_mandatorios_abiertos != 'undefined' && data.filterAdvanced.fromCant_de_rpts_mandatorios_abiertos)
        condition += " AND Orden_de_Trabajo.Cant_de_rpts_mandatorios_abiertos >= " + data.filterAdvanced.fromCant_de_rpts_mandatorios_abiertos;

      if (typeof data.filterAdvanced.toCant_de_rpts_mandatorios_abiertos != 'undefined' && data.filterAdvanced.toCant_de_rpts_mandatorios_abiertos) 
        condition += " AND Orden_de_Trabajo.Cant_de_rpts_mandatorios_abiertos <= " + data.filterAdvanced.toCant_de_rpts_mandatorios_abiertos;
    }
    if ((typeof data.filterAdvanced.fromHoras_acumuladas != 'undefined' && data.filterAdvanced.fromHoras_acumuladas)
	|| (typeof data.filterAdvanced.toHoras_acumuladas != 'undefined' && data.filterAdvanced.toHoras_acumuladas)) 
	{
      if (typeof data.filterAdvanced.fromHoras_acumuladas != 'undefined' && data.filterAdvanced.fromHoras_acumuladas)
        condition += " AND Orden_de_Trabajo.Horas_acumuladas >= " + data.filterAdvanced.fromHoras_acumuladas;

      if (typeof data.filterAdvanced.toHoras_acumuladas != 'undefined' && data.filterAdvanced.toHoras_acumuladas) 
        condition += " AND Orden_de_Trabajo.Horas_acumuladas <= " + data.filterAdvanced.toHoras_acumuladas;
    }
    if ((typeof data.filterAdvanced.fromCiclos_acumulados != 'undefined' && data.filterAdvanced.fromCiclos_acumulados)
	|| (typeof data.filterAdvanced.toCiclos_acumulados != 'undefined' && data.filterAdvanced.toCiclos_acumulados)) 
	{
      if (typeof data.filterAdvanced.fromCiclos_acumulados != 'undefined' && data.filterAdvanced.fromCiclos_acumulados)
        condition += " AND Orden_de_Trabajo.Ciclos_acumulados >= " + data.filterAdvanced.fromCiclos_acumulados;

      if (typeof data.filterAdvanced.toCiclos_acumulados != 'undefined' && data.filterAdvanced.toCiclos_acumulados) 
        condition += " AND Orden_de_Trabajo.Ciclos_acumulados <= " + data.filterAdvanced.toCiclos_acumulados;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_Reporte.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_Reporte.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Orden_de_Trabajo.Estatus In (" + Estatusds + ")";
    }
    switch (data.filterAdvanced.Causa_de_CancelacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Orden_de_Trabajo.Causa_de_Cancelacion LIKE '" + data.filterAdvanced.Causa_de_Cancelacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Orden_de_Trabajo.Causa_de_Cancelacion LIKE '%" + data.filterAdvanced.Causa_de_Cancelacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Orden_de_Trabajo.Causa_de_Cancelacion LIKE '%" + data.filterAdvanced.Causa_de_Cancelacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Orden_de_Trabajo.Causa_de_Cancelacion = '" + data.filterAdvanced.Causa_de_Cancelacion + "'";
        break;
    }
    switch (data.filterAdvanced.numero_de_ordenFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.numero_de_orden + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.numero_de_orden + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.numero_de_orden + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.numero_de_orden + "'";
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
              const longest = result.Orden_de_Trabajos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Orden_de_Trabajos);
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
