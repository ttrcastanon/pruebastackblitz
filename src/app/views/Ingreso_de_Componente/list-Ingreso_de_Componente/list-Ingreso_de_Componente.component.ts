import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Ingreso_de_ComponenteService } from "src/app/api-services/Ingreso_de_Componente.service";
import { Ingreso_de_Componente } from "src/app/models/Ingreso_de_Componente";
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
import { Ingreso_de_ComponenteIndexRules } from 'src/app/shared/businessRules/Ingreso_de_Componente-index-rules';
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
  selector: "app-list-Ingreso_de_Componente",
  templateUrl: "./list-Ingreso_de_Componente.component.html",
  styleUrls: ["./list-Ingreso_de_Componente.component.scss"],
})
export class ListIngreso_de_ComponenteComponent extends Ingreso_de_ComponenteIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "N_Parte",
    "Descripcion",
    "Origen_del_Componente",
    "Estatus",
    "N_de_Serie",
    "Posicion_de_la_pieza",
    "Fecha_de_Fabricacion",
    "Fecha_de_Instalacion",
    "Fecha_Reparacion",
    "Horas_acumuladas_parte",
    "Ciclos_acumulados_parte",
    "Horas_Acumuladas_Aeronave",
    "Ciclos_Acumulados_Aeronave",
    "N_OT",
    "N_Reporte",
    "Alerta_en_horas_acumuladas",
    "Alerta_en_ciclos_acumulados",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "N_Parte",
      "Descripcion",
      "Origen_del_Componente",
      "Estatus",
      "N_de_Serie",
      "Posicion_de_la_pieza",
      "Fecha_de_Fabricacion",
      "Fecha_de_Instalacion",
      "Fecha_Reparacion",
      "Horas_acumuladas_parte",
      "Ciclos_acumulados_parte",
      "Horas_Acumuladas_Aeronave",
      "Ciclos_Acumulados_Aeronave",
      "N_OT",
      "N_Reporte",
      "Alerta_en_horas_acumuladas",
      "Alerta_en_ciclos_acumulados",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "N_Parte_filtro",
      "Descripcion_filtro",
      "Origen_del_Componente_filtro",
      "Estatus_filtro",
      "N_de_Serie_filtro",
      "Posicion_de_la_pieza_filtro",
      "Fecha_de_Fabricacion_filtro",
      "Fecha_de_Instalacion_filtro",
      "Fecha_Reparacion_filtro",
      "Horas_acumuladas_parte_filtro",
      "Ciclos_acumulados_parte_filtro",
      "Horas_Acumuladas_Aeronave_filtro",
      "Ciclos_Acumulados_Aeronave_filtro",
      "N_OT_filtro",
      "N_Reporte_filtro",
      "Alerta_en_horas_acumuladas_filtro",
      "Alerta_en_ciclos_acumulados_filtro",

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
      N_Parte: "",
      Descripcion: "",
      Origen_del_Componente: "",
      Estatus: "",
      N_de_Serie: "",
      Posicion_de_la_pieza: "",
      Fecha_de_Fabricacion: null,
      Fecha_de_Instalacion: null,
      Fecha_Reparacion: null,
      Horas_acumuladas_parte: "",
      Ciclos_acumulados_parte: "",
      Horas_Acumuladas_Aeronave: "",
      Ciclos_Acumulados_Aeronave: "",
      N_OT: "",
      N_Reporte: "",
      Alerta_en_horas_acumuladas: "",
      Alerta_en_ciclos_acumulados: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      N_ParteFilter: "",
      N_Parte: "",
      N_ParteMultiple: "",
      DescripcionFilter: "",
      Descripcion: "",
      DescripcionMultiple: "",
      Origen_del_ComponenteFilter: "",
      Origen_del_Componente: "",
      Origen_del_ComponenteMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      N_de_SerieFilter: "",
      N_de_Serie: "",
      N_de_SerieMultiple: "",
      Posicion_de_la_piezaFilter: "",
      Posicion_de_la_pieza: "",
      Posicion_de_la_piezaMultiple: "",
      fromFecha_de_Fabricacion: "",
      toFecha_de_Fabricacion: "",
      fromFecha_de_Instalacion: "",
      toFecha_de_Instalacion: "",
      fromFecha_Reparacion: "",
      toFecha_Reparacion: "",
      fromHoras_acumuladas_parte: "",
      toHoras_acumuladas_parte: "",
      fromCiclos_acumulados_parte: "",
      toCiclos_acumulados_parte: "",
      fromHoras_Acumuladas_Aeronave: "",
      toHoras_Acumuladas_Aeronave: "",
      fromCiclos_Acumulados_Aeronave: "",
      toCiclos_Acumulados_Aeronave: "",

    }
  };

  dataSource: Ingreso_de_ComponenteDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Ingreso_de_ComponenteDataSource;
  dataClipboard: any;

  constructor(
    private _Ingreso_de_ComponenteService: Ingreso_de_ComponenteService,
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
    this.dataSource = new Ingreso_de_ComponenteDataSource(
      this._Ingreso_de_ComponenteService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Ingreso_de_Componente)
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
    this.listConfig.filter.N_Parte = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Origen_del_Componente = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.N_de_Serie = "";
    this.listConfig.filter.Posicion_de_la_pieza = "";
    this.listConfig.filter.Fecha_de_Fabricacion = undefined;
    this.listConfig.filter.Fecha_de_Instalacion = undefined;
    this.listConfig.filter.Fecha_Reparacion = undefined;
    this.listConfig.filter.Horas_acumuladas_parte = "";
    this.listConfig.filter.Ciclos_acumulados_parte = "";
    this.listConfig.filter.Horas_Acumuladas_Aeronave = "";
    this.listConfig.filter.Ciclos_Acumulados_Aeronave = "";
    this.listConfig.filter.N_OT = "";
    this.listConfig.filter.N_Reporte = "";
    this.listConfig.filter.Alerta_en_horas_acumuladas = "";
    this.listConfig.filter.Alerta_en_ciclos_acumulados = "";

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

  remove(row: Ingreso_de_Componente) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Ingreso_de_ComponenteService
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
  ActionPrint(dataRow: Ingreso_de_Componente) {

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
,'N° Parte'
,'Descripción'
,'Origen del Componente'
,'Estatus'
,'N° de Serie'
,'Posición de la pieza'
,'Fecha de Fabricación'
,'Fecha de Instalación'
,'Fecha Reparación'
,'Horas acumuladas parte'
,'Ciclos acumulados parte'
,'Horas Acumuladas Aeronave'
,'Ciclos Acumulados Aeronave'
,'N° OT'
,'N° Reporte'
,'Alerta en horas acumuladas'
,'Alerta en ciclos acumulados'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.N_Parte_Piezas.Descripcion
,x.Descripcion_Piezas.Descripcion
,x.Origen_del_Componente_Tipos_de_Origen_del_Componente.Descripcion
,x.Estatus_Estatus_Parte_Asociada_al_Componente.Descripcion
,x.N_de_Serie_Piezas.Descripcion
,x.Posicion_de_la_pieza_Tipo_de_Posicion_de_Piezas.Descripcion
,x.Fecha_de_Fabricacion
,x.Fecha_de_Instalacion
,x.Fecha_Reparacion
,x.Horas_acumuladas_parte
,x.Ciclos_acumulados_parte
,x.Horas_Acumuladas_Aeronave
,x.Ciclos_Acumulados_Aeronave
,x.N_OT
,x.N_Reporte
,x.Alerta_en_horas_acumuladas
,x.Alerta_en_ciclos_acumulados
		  
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
    pdfMake.createPdf(pdfDefinition).download('Ingreso_de_Componente.pdf');
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
          this._Ingreso_de_ComponenteService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ingreso_de_Componentes;
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
          this._Ingreso_de_ComponenteService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Ingreso_de_Componentes;
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
        'N° Parte ': fields.N_Parte_Piezas.Descripcion,
        'Descripción 1': fields.Descripcion_Piezas.Descripcion,
        'Origen del Componente ': fields.Origen_del_Componente_Tipos_de_Origen_del_Componente.Descripcion,
        'Estatus ': fields.Estatus_Estatus_Parte_Asociada_al_Componente.Descripcion,
        'N° de Serie 2': fields.N_de_Serie_Piezas.Descripcion,
        'Posición de la pieza ': fields.Posicion_de_la_pieza_Tipo_de_Posicion_de_Piezas.Descripcion,
        'Fecha de Fabricación ': fields.Fecha_de_Fabricacion ? momentJS(fields.Fecha_de_Fabricacion).format('DD/MM/YYYY') : '',
        'Fecha de Instalación ': fields.Fecha_de_Instalacion ? momentJS(fields.Fecha_de_Instalacion).format('DD/MM/YYYY') : '',
        'Fecha Reparación ': fields.Fecha_Reparacion ? momentJS(fields.Fecha_Reparacion).format('DD/MM/YYYY') : '',
        'Horas acumuladas parte ': fields.Horas_acumuladas_parte,
        'Ciclos acumulados parte ': fields.Ciclos_acumulados_parte,
        'Horas Acumuladas Aeronave ': fields.Horas_Acumuladas_Aeronave,
        'Ciclos Acumulados Aeronave ': fields.Ciclos_Acumulados_Aeronave,
        'N° OT ': fields.N_OT,
        'N° Reporte ': fields.N_Reporte,
        'Alerta en horas acumuladas ': fields.Alerta_en_horas_acumuladas,
        'Alerta en ciclos acumulados ': fields.Alerta_en_ciclos_acumulados,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Ingreso_de_Componente  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      N_Parte: x.N_Parte_Piezas.Descripcion,
      Descripcion: x.Descripcion_Piezas.Descripcion,
      Origen_del_Componente: x.Origen_del_Componente_Tipos_de_Origen_del_Componente.Descripcion,
      Estatus: x.Estatus_Estatus_Parte_Asociada_al_Componente.Descripcion,
      N_de_Serie: x.N_de_Serie_Piezas.Descripcion,
      Posicion_de_la_pieza: x.Posicion_de_la_pieza_Tipo_de_Posicion_de_Piezas.Descripcion,
      Fecha_de_Fabricacion: x.Fecha_de_Fabricacion,
      Fecha_de_Instalacion: x.Fecha_de_Instalacion,
      Fecha_Reparacion: x.Fecha_Reparacion,
      Horas_acumuladas_parte: x.Horas_acumuladas_parte,
      Ciclos_acumulados_parte: x.Ciclos_acumulados_parte,
      Horas_Acumuladas_Aeronave: x.Horas_Acumuladas_Aeronave,
      Ciclos_Acumulados_Aeronave: x.Ciclos_Acumulados_Aeronave,
      N_OT: x.N_OT,
      N_Reporte: x.N_Reporte,
      Alerta_en_horas_acumuladas: x.Alerta_en_horas_acumuladas,
      Alerta_en_ciclos_acumulados: x.Alerta_en_ciclos_acumulados,

    }));

    this.excelService.exportToCsv(result, 'Ingreso_de_Componente',  ['Folio'    ,'N_Parte'  ,'Descripcion'  ,'Origen_del_Componente'  ,'Estatus'  ,'N_de_Serie'  ,'Posicion_de_la_pieza'  ,'Fecha_de_Fabricacion'  ,'Fecha_de_Instalacion'  ,'Fecha_Reparacion'  ,'Horas_acumuladas_parte'  ,'Ciclos_acumulados_parte'  ,'Horas_Acumuladas_Aeronave'  ,'Ciclos_Acumulados_Aeronave'  ,'N_OT'  ,'N_Reporte'  ,'Alerta_en_horas_acumuladas'  ,'Alerta_en_ciclos_acumulados' ]);
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
    template += '          <th>N° Parte</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>Origen del Componente</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>N° de Serie</th>';
    template += '          <th>Posición de la pieza</th>';
    template += '          <th>Fecha de Fabricación</th>';
    template += '          <th>Fecha de Instalación</th>';
    template += '          <th>Fecha Reparación</th>';
    template += '          <th>Horas acumuladas parte</th>';
    template += '          <th>Ciclos acumulados parte</th>';
    template += '          <th>Horas Acumuladas Aeronave</th>';
    template += '          <th>Ciclos Acumulados Aeronave</th>';
    template += '          <th>N° OT</th>';
    template += '          <th>N° Reporte</th>';
    template += '          <th>Alerta en horas acumuladas</th>';
    template += '          <th>Alerta en ciclos acumulados</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.N_Parte_Piezas.Descripcion + '</td>';
      template += '          <td>' + element.Descripcion_Piezas.Descripcion + '</td>';
      template += '          <td>' + element.Origen_del_Componente_Tipos_de_Origen_del_Componente.Descripcion + '</td>';
      template += '          <td>' + element.Estatus_Estatus_Parte_Asociada_al_Componente.Descripcion + '</td>';
      template += '          <td>' + element.N_de_Serie_Piezas.Descripcion + '</td>';
      template += '          <td>' + element.Posicion_de_la_pieza_Tipo_de_Posicion_de_Piezas.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_de_Fabricacion + '</td>';
      template += '          <td>' + element.Fecha_de_Instalacion + '</td>';
      template += '          <td>' + element.Fecha_Reparacion + '</td>';
      template += '          <td>' + element.Horas_acumuladas_parte + '</td>';
      template += '          <td>' + element.Ciclos_acumulados_parte + '</td>';
      template += '          <td>' + element.Horas_Acumuladas_Aeronave + '</td>';
      template += '          <td>' + element.Ciclos_Acumulados_Aeronave + '</td>';
      template += '          <td>' + element.N_OT + '</td>';
      template += '          <td>' + element.N_Reporte + '</td>';
      template += '          <td>' + element.Alerta_en_horas_acumuladas + '</td>';
      template += '          <td>' + element.Alerta_en_ciclos_acumulados + '</td>';
		  
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
	template += '\t N° Parte';
	template += '\t Descripción';
	template += '\t Origen del Componente';
	template += '\t Estatus';
	template += '\t N° de Serie';
	template += '\t Posición de la pieza';
	template += '\t Fecha de Fabricación';
	template += '\t Fecha de Instalación';
	template += '\t Fecha Reparación';
	template += '\t Horas acumuladas parte';
	template += '\t Ciclos acumulados parte';
	template += '\t Horas Acumuladas Aeronave';
	template += '\t Ciclos Acumulados Aeronave';
	template += '\t N° OT';
	template += '\t N° Reporte';
	template += '\t Alerta en horas acumuladas';
	template += '\t Alerta en ciclos acumulados';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.N_Parte_Piezas.Descripcion;
      template += '\t ' + element.Descripcion_Piezas.Descripcion;
      template += '\t ' + element.Origen_del_Componente_Tipos_de_Origen_del_Componente.Descripcion;
      template += '\t ' + element.Estatus_Estatus_Parte_Asociada_al_Componente.Descripcion;
      template += '\t ' + element.N_de_Serie_Piezas.Descripcion;
      template += '\t ' + element.Posicion_de_la_pieza_Tipo_de_Posicion_de_Piezas.Descripcion;
	  template += '\t ' + element.Fecha_de_Fabricacion;
	  template += '\t ' + element.Fecha_de_Instalacion;
	  template += '\t ' + element.Fecha_Reparacion;
	  template += '\t ' + element.Horas_acumuladas_parte;
	  template += '\t ' + element.Ciclos_acumulados_parte;
	  template += '\t ' + element.Horas_Acumuladas_Aeronave;
	  template += '\t ' + element.Ciclos_Acumulados_Aeronave;
	  template += '\t ' + element.N_OT;
	  template += '\t ' + element.N_Reporte;
	  template += '\t ' + element.Alerta_en_horas_acumuladas;
	  template += '\t ' + element.Alerta_en_ciclos_acumulados;

	  template += '\n';
    });

    return template;
  }

}

export class Ingreso_de_ComponenteDataSource implements DataSource<Ingreso_de_Componente>
{
  private subject = new BehaviorSubject<Ingreso_de_Componente[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Ingreso_de_ComponenteService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Ingreso_de_Componente[]> {
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
              const longest = result.Ingreso_de_Componentes.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ingreso_de_Componentes);
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
      condition += " and Ingreso_de_Componente.Folio = " + data.filter.Folio;
    if (data.filter.N_Parte != "")
      condition += " and Piezas.Descripcion like '%" + data.filter.N_Parte + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Piezas.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Origen_del_Componente != "")
      condition += " and Tipos_de_Origen_del_Componente.Descripcion like '%" + data.filter.Origen_del_Componente + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_Parte_Asociada_al_Componente.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.N_de_Serie != "")
      condition += " and Piezas.Descripcion like '%" + data.filter.N_de_Serie + "%' ";
    if (data.filter.Posicion_de_la_pieza != "")
      condition += " and Tipo_de_Posicion_de_Piezas.Descripcion like '%" + data.filter.Posicion_de_la_pieza + "%' ";
    if (data.filter.Fecha_de_Fabricacion)
      condition += " and CONVERT(VARCHAR(10), Ingreso_de_Componente.Fecha_de_Fabricacion, 102)  = '" + moment(data.filter.Fecha_de_Fabricacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_Instalacion)
      condition += " and CONVERT(VARCHAR(10), Ingreso_de_Componente.Fecha_de_Instalacion, 102)  = '" + moment(data.filter.Fecha_de_Instalacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_Reparacion)
      condition += " and CONVERT(VARCHAR(10), Ingreso_de_Componente.Fecha_Reparacion, 102)  = '" + moment(data.filter.Fecha_Reparacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Horas_acumuladas_parte != "")
      condition += " and Ingreso_de_Componente.Horas_acumuladas_parte = " + data.filter.Horas_acumuladas_parte;
    if (data.filter.Ciclos_acumulados_parte != "")
      condition += " and Ingreso_de_Componente.Ciclos_acumulados_parte = " + data.filter.Ciclos_acumulados_parte;
    if (data.filter.Horas_Acumuladas_Aeronave != "")
      condition += " and Ingreso_de_Componente.Horas_Acumuladas_Aeronave = " + data.filter.Horas_Acumuladas_Aeronave;
    if (data.filter.Ciclos_Acumulados_Aeronave != "")
      condition += " and Ingreso_de_Componente.Ciclos_Acumulados_Aeronave = " + data.filter.Ciclos_Acumulados_Aeronave;
    if (data.filter.N_OT != "")
      condition += " and Ingreso_de_Componente.N_OT like '%" + data.filter.N_OT + "%' ";
    if (data.filter.N_Reporte != "")
      condition += " and Ingreso_de_Componente.N_Reporte like '%" + data.filter.N_Reporte + "%' ";
    if (data.filter.Alerta_en_horas_acumuladas != "")
      condition += " and Ingreso_de_Componente.Alerta_en_horas_acumuladas like '%" + data.filter.Alerta_en_horas_acumuladas + "%' ";
    if (data.filter.Alerta_en_ciclos_acumulados != "")
      condition += " and Ingreso_de_Componente.Alerta_en_ciclos_acumulados like '%" + data.filter.Alerta_en_ciclos_acumulados + "%' ";

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
        sort = " Ingreso_de_Componente.Folio " + data.sortDirecction;
        break;
      case "N_Parte":
        sort = " Piezas.Descripcion " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Piezas.Descripcion " + data.sortDirecction;
        break;
      case "Origen_del_Componente":
        sort = " Tipos_de_Origen_del_Componente.Descripcion " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_Parte_Asociada_al_Componente.Descripcion " + data.sortDirecction;
        break;
      case "N_de_Serie":
        sort = " Piezas.Descripcion " + data.sortDirecction;
        break;
      case "Posicion_de_la_pieza":
        sort = " Tipo_de_Posicion_de_Piezas.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_de_Fabricacion":
        sort = " Ingreso_de_Componente.Fecha_de_Fabricacion " + data.sortDirecction;
        break;
      case "Fecha_de_Instalacion":
        sort = " Ingreso_de_Componente.Fecha_de_Instalacion " + data.sortDirecction;
        break;
      case "Fecha_Reparacion":
        sort = " Ingreso_de_Componente.Fecha_Reparacion " + data.sortDirecction;
        break;
      case "Horas_acumuladas_parte":
        sort = " Ingreso_de_Componente.Horas_acumuladas_parte " + data.sortDirecction;
        break;
      case "Ciclos_acumulados_parte":
        sort = " Ingreso_de_Componente.Ciclos_acumulados_parte " + data.sortDirecction;
        break;
      case "Horas_Acumuladas_Aeronave":
        sort = " Ingreso_de_Componente.Horas_Acumuladas_Aeronave " + data.sortDirecction;
        break;
      case "Ciclos_Acumulados_Aeronave":
        sort = " Ingreso_de_Componente.Ciclos_Acumulados_Aeronave " + data.sortDirecction;
        break;
      case "N_OT":
        sort = " Ingreso_de_Componente.N_OT " + data.sortDirecction;
        break;
      case "N_Reporte":
        sort = " Ingreso_de_Componente.N_Reporte " + data.sortDirecction;
        break;
      case "Alerta_en_horas_acumuladas":
        sort = " Ingreso_de_Componente.Alerta_en_horas_acumuladas " + data.sortDirecction;
        break;
      case "Alerta_en_ciclos_acumulados":
        sort = " Ingreso_de_Componente.Alerta_en_ciclos_acumulados " + data.sortDirecction;
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
        condition += " AND Ingreso_de_Componente.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Ingreso_de_Componente.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.N_Parte != 'undefined' && data.filterAdvanced.N_Parte)) {
      switch (data.filterAdvanced.N_ParteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Piezas.Descripcion LIKE '" + data.filterAdvanced.N_Parte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Piezas.Descripcion LIKE '%" + data.filterAdvanced.N_Parte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Piezas.Descripcion LIKE '%" + data.filterAdvanced.N_Parte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Piezas.Descripcion = '" + data.filterAdvanced.N_Parte + "'";
          break;
      }
    } else if (data.filterAdvanced.N_ParteMultiple != null && data.filterAdvanced.N_ParteMultiple.length > 0) {
      var N_Parteds = data.filterAdvanced.N_ParteMultiple.join(",");
      condition += " AND Ingreso_de_Componente.N_Parte In (" + N_Parteds + ")";
    }
    if ((typeof data.filterAdvanced.Descripcion != 'undefined' && data.filterAdvanced.Descripcion)) {
      switch (data.filterAdvanced.DescripcionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Piezas.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Piezas.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Piezas.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Piezas.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
          break;
      }
    } else if (data.filterAdvanced.DescripcionMultiple != null && data.filterAdvanced.DescripcionMultiple.length > 0) {
      var Descripcionds = data.filterAdvanced.DescripcionMultiple.join(",");
      condition += " AND Ingreso_de_Componente.Descripcion In (" + Descripcionds + ")";
    }
    if ((typeof data.filterAdvanced.Origen_del_Componente != 'undefined' && data.filterAdvanced.Origen_del_Componente)) {
      switch (data.filterAdvanced.Origen_del_ComponenteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipos_de_Origen_del_Componente.Descripcion LIKE '" + data.filterAdvanced.Origen_del_Componente + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipos_de_Origen_del_Componente.Descripcion LIKE '%" + data.filterAdvanced.Origen_del_Componente + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipos_de_Origen_del_Componente.Descripcion LIKE '%" + data.filterAdvanced.Origen_del_Componente + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipos_de_Origen_del_Componente.Descripcion = '" + data.filterAdvanced.Origen_del_Componente + "'";
          break;
      }
    } else if (data.filterAdvanced.Origen_del_ComponenteMultiple != null && data.filterAdvanced.Origen_del_ComponenteMultiple.length > 0) {
      var Origen_del_Componenteds = data.filterAdvanced.Origen_del_ComponenteMultiple.join(",");
      condition += " AND Ingreso_de_Componente.Origen_del_Componente In (" + Origen_del_Componenteds + ")";
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_Parte_Asociada_al_Componente.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_Parte_Asociada_al_Componente.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_Parte_Asociada_al_Componente.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_Parte_Asociada_al_Componente.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Ingreso_de_Componente.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.N_de_Serie != 'undefined' && data.filterAdvanced.N_de_Serie)) {
      switch (data.filterAdvanced.N_de_SerieFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Piezas.Descripcion LIKE '" + data.filterAdvanced.N_de_Serie + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Piezas.Descripcion LIKE '%" + data.filterAdvanced.N_de_Serie + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Piezas.Descripcion LIKE '%" + data.filterAdvanced.N_de_Serie + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Piezas.Descripcion = '" + data.filterAdvanced.N_de_Serie + "'";
          break;
      }
    } else if (data.filterAdvanced.N_de_SerieMultiple != null && data.filterAdvanced.N_de_SerieMultiple.length > 0) {
      var N_de_Serieds = data.filterAdvanced.N_de_SerieMultiple.join(",");
      condition += " AND Ingreso_de_Componente.N_de_Serie In (" + N_de_Serieds + ")";
    }
    if ((typeof data.filterAdvanced.Posicion_de_la_pieza != 'undefined' && data.filterAdvanced.Posicion_de_la_pieza)) {
      switch (data.filterAdvanced.Posicion_de_la_piezaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Posicion_de_Piezas.Descripcion LIKE '" + data.filterAdvanced.Posicion_de_la_pieza + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Posicion_de_Piezas.Descripcion LIKE '%" + data.filterAdvanced.Posicion_de_la_pieza + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Posicion_de_Piezas.Descripcion LIKE '%" + data.filterAdvanced.Posicion_de_la_pieza + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Posicion_de_Piezas.Descripcion = '" + data.filterAdvanced.Posicion_de_la_pieza + "'";
          break;
      }
    } else if (data.filterAdvanced.Posicion_de_la_piezaMultiple != null && data.filterAdvanced.Posicion_de_la_piezaMultiple.length > 0) {
      var Posicion_de_la_piezads = data.filterAdvanced.Posicion_de_la_piezaMultiple.join(",");
      condition += " AND Ingreso_de_Componente.Posicion_de_la_pieza In (" + Posicion_de_la_piezads + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Fabricacion != 'undefined' && data.filterAdvanced.fromFecha_de_Fabricacion)
	|| (typeof data.filterAdvanced.toFecha_de_Fabricacion != 'undefined' && data.filterAdvanced.toFecha_de_Fabricacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Fabricacion != 'undefined' && data.filterAdvanced.fromFecha_de_Fabricacion) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Componente.Fecha_de_Fabricacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Fabricacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Fabricacion != 'undefined' && data.filterAdvanced.toFecha_de_Fabricacion) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Componente.Fecha_de_Fabricacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Fabricacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Instalacion != 'undefined' && data.filterAdvanced.fromFecha_de_Instalacion)
	|| (typeof data.filterAdvanced.toFecha_de_Instalacion != 'undefined' && data.filterAdvanced.toFecha_de_Instalacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Instalacion != 'undefined' && data.filterAdvanced.fromFecha_de_Instalacion) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Componente.Fecha_de_Instalacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Instalacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Instalacion != 'undefined' && data.filterAdvanced.toFecha_de_Instalacion) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Componente.Fecha_de_Instalacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Instalacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_Reparacion != 'undefined' && data.filterAdvanced.fromFecha_Reparacion)
	|| (typeof data.filterAdvanced.toFecha_Reparacion != 'undefined' && data.filterAdvanced.toFecha_Reparacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Reparacion != 'undefined' && data.filterAdvanced.fromFecha_Reparacion) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Componente.Fecha_Reparacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Reparacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Reparacion != 'undefined' && data.filterAdvanced.toFecha_Reparacion) 
        condition += " and CONVERT(VARCHAR(10), Ingreso_de_Componente.Fecha_Reparacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_Reparacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHoras_acumuladas_parte != 'undefined' && data.filterAdvanced.fromHoras_acumuladas_parte)
	|| (typeof data.filterAdvanced.toHoras_acumuladas_parte != 'undefined' && data.filterAdvanced.toHoras_acumuladas_parte)) 
	{
      if (typeof data.filterAdvanced.fromHoras_acumuladas_parte != 'undefined' && data.filterAdvanced.fromHoras_acumuladas_parte)
        condition += " AND Ingreso_de_Componente.Horas_acumuladas_parte >= " + data.filterAdvanced.fromHoras_acumuladas_parte;

      if (typeof data.filterAdvanced.toHoras_acumuladas_parte != 'undefined' && data.filterAdvanced.toHoras_acumuladas_parte) 
        condition += " AND Ingreso_de_Componente.Horas_acumuladas_parte <= " + data.filterAdvanced.toHoras_acumuladas_parte;
    }
    if ((typeof data.filterAdvanced.fromCiclos_acumulados_parte != 'undefined' && data.filterAdvanced.fromCiclos_acumulados_parte)
	|| (typeof data.filterAdvanced.toCiclos_acumulados_parte != 'undefined' && data.filterAdvanced.toCiclos_acumulados_parte)) 
	{
      if (typeof data.filterAdvanced.fromCiclos_acumulados_parte != 'undefined' && data.filterAdvanced.fromCiclos_acumulados_parte)
        condition += " AND Ingreso_de_Componente.Ciclos_acumulados_parte >= " + data.filterAdvanced.fromCiclos_acumulados_parte;

      if (typeof data.filterAdvanced.toCiclos_acumulados_parte != 'undefined' && data.filterAdvanced.toCiclos_acumulados_parte) 
        condition += " AND Ingreso_de_Componente.Ciclos_acumulados_parte <= " + data.filterAdvanced.toCiclos_acumulados_parte;
    }
    if ((typeof data.filterAdvanced.fromHoras_Acumuladas_Aeronave != 'undefined' && data.filterAdvanced.fromHoras_Acumuladas_Aeronave)
	|| (typeof data.filterAdvanced.toHoras_Acumuladas_Aeronave != 'undefined' && data.filterAdvanced.toHoras_Acumuladas_Aeronave)) 
	{
      if (typeof data.filterAdvanced.fromHoras_Acumuladas_Aeronave != 'undefined' && data.filterAdvanced.fromHoras_Acumuladas_Aeronave)
        condition += " AND Ingreso_de_Componente.Horas_Acumuladas_Aeronave >= " + data.filterAdvanced.fromHoras_Acumuladas_Aeronave;

      if (typeof data.filterAdvanced.toHoras_Acumuladas_Aeronave != 'undefined' && data.filterAdvanced.toHoras_Acumuladas_Aeronave) 
        condition += " AND Ingreso_de_Componente.Horas_Acumuladas_Aeronave <= " + data.filterAdvanced.toHoras_Acumuladas_Aeronave;
    }
    if ((typeof data.filterAdvanced.fromCiclos_Acumulados_Aeronave != 'undefined' && data.filterAdvanced.fromCiclos_Acumulados_Aeronave)
	|| (typeof data.filterAdvanced.toCiclos_Acumulados_Aeronave != 'undefined' && data.filterAdvanced.toCiclos_Acumulados_Aeronave)) 
	{
      if (typeof data.filterAdvanced.fromCiclos_Acumulados_Aeronave != 'undefined' && data.filterAdvanced.fromCiclos_Acumulados_Aeronave)
        condition += " AND Ingreso_de_Componente.Ciclos_Acumulados_Aeronave >= " + data.filterAdvanced.fromCiclos_Acumulados_Aeronave;

      if (typeof data.filterAdvanced.toCiclos_Acumulados_Aeronave != 'undefined' && data.filterAdvanced.toCiclos_Acumulados_Aeronave) 
        condition += " AND Ingreso_de_Componente.Ciclos_Acumulados_Aeronave <= " + data.filterAdvanced.toCiclos_Acumulados_Aeronave;
    }
    switch (data.filterAdvanced.N_OTFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Componente.N_OT LIKE '" + data.filterAdvanced.N_OT + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Componente.N_OT LIKE '%" + data.filterAdvanced.N_OT + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Componente.N_OT LIKE '%" + data.filterAdvanced.N_OT + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Componente.N_OT = '" + data.filterAdvanced.N_OT + "'";
        break;
    }
    switch (data.filterAdvanced.N_ReporteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Componente.N_Reporte LIKE '" + data.filterAdvanced.N_Reporte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Componente.N_Reporte LIKE '%" + data.filterAdvanced.N_Reporte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Componente.N_Reporte LIKE '%" + data.filterAdvanced.N_Reporte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Componente.N_Reporte = '" + data.filterAdvanced.N_Reporte + "'";
        break;
    }
    switch (data.filterAdvanced.Alerta_en_horas_acumuladasFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Componente.Alerta_en_horas_acumuladas LIKE '" + data.filterAdvanced.Alerta_en_horas_acumuladas + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Componente.Alerta_en_horas_acumuladas LIKE '%" + data.filterAdvanced.Alerta_en_horas_acumuladas + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Componente.Alerta_en_horas_acumuladas LIKE '%" + data.filterAdvanced.Alerta_en_horas_acumuladas + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Componente.Alerta_en_horas_acumuladas = '" + data.filterAdvanced.Alerta_en_horas_acumuladas + "'";
        break;
    }
    switch (data.filterAdvanced.Alerta_en_ciclos_acumuladosFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Ingreso_de_Componente.Alerta_en_ciclos_acumulados LIKE '" + data.filterAdvanced.Alerta_en_ciclos_acumulados + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Ingreso_de_Componente.Alerta_en_ciclos_acumulados LIKE '%" + data.filterAdvanced.Alerta_en_ciclos_acumulados + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Ingreso_de_Componente.Alerta_en_ciclos_acumulados LIKE '%" + data.filterAdvanced.Alerta_en_ciclos_acumulados + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Ingreso_de_Componente.Alerta_en_ciclos_acumulados = '" + data.filterAdvanced.Alerta_en_ciclos_acumulados + "'";
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
              const longest = result.Ingreso_de_Componentes.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Ingreso_de_Componentes);
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
