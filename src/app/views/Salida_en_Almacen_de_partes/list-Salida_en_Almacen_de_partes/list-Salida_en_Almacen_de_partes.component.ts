import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Salida_en_Almacen_de_partesService } from "src/app/api-services/Salida_en_Almacen_de_partes.service";
import { Salida_en_Almacen_de_partes } from "src/app/models/Salida_en_Almacen_de_partes";
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
import { Salida_en_Almacen_de_partesIndexRules } from 'src/app/shared/businessRules/Salida_en_Almacen_de_partes-index-rules';
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
  selector: "app-list-Salida_en_Almacen_de_partes",
  templateUrl: "./list-Salida_en_Almacen_de_partes.component.html",
  styleUrls: ["./list-Salida_en_Almacen_de_partes.component.scss"],
})
export class ListSalida_en_Almacen_de_partesComponent extends Salida_en_Almacen_de_partesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No__de_Parte___Descripcion",
    "Se_mantiene_el_No__de_Parte",
    "No__de_parte_nuevo",
    "No__de_serie",
    "No__de_lote",
    "Hora_acumuladas",
    "Ciclos_acumulados",
    "Fecha_de_Vencimiento",
    "Ubicacion",
    "Solicitante",
    "No__de_OT",
    "No__de_Reporte",
    "Matricula",
    "Modelo",
    "IdAsignacionPartes",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_Parte___Descripcion",
      "Se_mantiene_el_No__de_Parte",
      "No__de_parte_nuevo",
      "No__de_serie",
      "No__de_lote",
      "Hora_acumuladas",
      "Ciclos_acumulados",
      "Fecha_de_Vencimiento",
      "Ubicacion",
      "Solicitante",
      "No__de_OT",
      "No__de_Reporte",
      "Matricula",
      "Modelo",
      "IdAsignacionPartes",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_Parte___Descripcion_filtro",
      "Se_mantiene_el_No__de_Parte_filtro",
      "No__de_parte_nuevo_filtro",
      "No__de_serie_filtro",
      "No__de_lote_filtro",
      "Hora_acumuladas_filtro",
      "Ciclos_acumulados_filtro",
      "Fecha_de_Vencimiento_filtro",
      "Ubicacion_filtro",
      "Solicitante_filtro",
      "No__de_OT_filtro",
      "No__de_Reporte_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "IdAsignacionPartes_filtro",

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
      No__de_Parte___Descripcion: "",
      Se_mantiene_el_No__de_Parte: "",
      No__de_parte_nuevo: "",
      No__de_serie: "",
      No__de_lote: "",
      Hora_acumuladas: "",
      Ciclos_acumulados: "",
      Fecha_de_Vencimiento: null,
      Ubicacion: "",
      Solicitante: "",
      No__de_OT: "",
      No__de_Reporte: "",
      Matricula: "",
      Modelo: "",
      IdAsignacionPartes: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Se_mantiene_el_No__de_ParteFilter: "",
      Se_mantiene_el_No__de_Parte: "",
      Se_mantiene_el_No__de_ParteMultiple: "",
      fromHora_acumuladas: "",
      toHora_acumuladas: "",
      fromCiclos_acumulados: "",
      toCiclos_acumulados: "",
      fromFecha_de_Vencimiento: "",
      toFecha_de_Vencimiento: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      No__de_OTFilter: "",
      No__de_OT: "",
      No__de_OTMultiple: "",
      No__de_ReporteFilter: "",
      No__de_Reporte: "",
      No__de_ReporteMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",

    }
  };

  dataSource: Salida_en_Almacen_de_partesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Salida_en_Almacen_de_partesDataSource;
  dataClipboard: any;

  constructor(
    private _Salida_en_Almacen_de_partesService: Salida_en_Almacen_de_partesService,
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
    this.dataSource = new Salida_en_Almacen_de_partesDataSource(
      this._Salida_en_Almacen_de_partesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Salida_en_Almacen_de_partes)
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
    this.listConfig.filter.No__de_Parte___Descripcion = "";
    this.listConfig.filter.Se_mantiene_el_No__de_Parte = "";
    this.listConfig.filter.No__de_parte_nuevo = "";
    this.listConfig.filter.No__de_serie = "";
    this.listConfig.filter.No__de_lote = "";
    this.listConfig.filter.Hora_acumuladas = "";
    this.listConfig.filter.Ciclos_acumulados = "";
    this.listConfig.filter.Fecha_de_Vencimiento = undefined;
    this.listConfig.filter.Ubicacion = "";
    this.listConfig.filter.Solicitante = "";
    this.listConfig.filter.No__de_OT = "";
    this.listConfig.filter.No__de_Reporte = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.IdAsignacionPartes = "";

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

  remove(row: Salida_en_Almacen_de_partes) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Salida_en_Almacen_de_partesService
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
  ActionPrint(dataRow: Salida_en_Almacen_de_partes) {

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
,'No. de Parte / Descripción'
,'¿Se mantiene el No. de Parte?'
,'No. de parte nuevo'
,'No. de serie'
,'No. de lote'
,'Hora acumuladas'
,'Ciclos acumulados'
,'Fecha de Vencimiento'
,'Ubicación del Almacén'
,'Solicitante'
,'No. de OT'
,'No. de Reporte'
,'Matrícula'
,'Modelo'
,'IdAsignacionPartes'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.No__de_Parte___Descripcion
,x.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion
,x.No__de_parte_nuevo
,x.No__de_serie
,x.No__de_lote
,x.Hora_acumuladas
,x.Ciclos_acumulados
,x.Fecha_de_Vencimiento
,x.Ubicacion
,x.Solicitante_Spartan_User.Name
,x.No__de_OT_Orden_de_Trabajo.numero_de_orden
,x.No__de_Reporte_Crear_Reporte.No_Reporte
,x.Matricula_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.IdAsignacionPartes
		  
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
    pdfMake.createPdf(pdfDefinition).download('Salida_en_Almacen_de_partes.pdf');
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
          this._Salida_en_Almacen_de_partesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Salida_en_Almacen_de_partess;
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
          this._Salida_en_Almacen_de_partesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Salida_en_Almacen_de_partess;
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
        'No. de Parte / Descripción ': fields.No__de_Parte___Descripcion,
        '¿Se mantiene el No. de Parte? ': fields.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion,
        'No. de parte nuevo ': fields.No__de_parte_nuevo,
        'No. de serie ': fields.No__de_serie,
        'No. de lote ': fields.No__de_lote,
        'Hora acumuladas ': fields.Hora_acumuladas,
        'Ciclos acumulados ': fields.Ciclos_acumulados,
        'Fecha de Vencimiento ': fields.Fecha_de_Vencimiento ? momentJS(fields.Fecha_de_Vencimiento).format('DD/MM/YYYY') : '',
        'Ubicación del Almacén ': fields.Ubicacion,
        'Solicitante ': fields.Solicitante_Spartan_User.Name,
        'No. de OT ': fields.No__de_OT_Orden_de_Trabajo.numero_de_orden,
        'No. de Reporte ': fields.No__de_Reporte_Crear_Reporte.No_Reporte,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'IdAsignacionPartes ': fields.IdAsignacionPartes,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Salida_en_Almacen_de_partes  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No__de_Parte___Descripcion: x.No__de_Parte___Descripcion,
      Se_mantiene_el_No__de_Parte: x.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion,
      No__de_parte_nuevo: x.No__de_parte_nuevo,
      No__de_serie: x.No__de_serie,
      No__de_lote: x.No__de_lote,
      Hora_acumuladas: x.Hora_acumuladas,
      Ciclos_acumulados: x.Ciclos_acumulados,
      Fecha_de_Vencimiento: x.Fecha_de_Vencimiento,
      Ubicacion: x.Ubicacion,
      Solicitante: x.Solicitante_Spartan_User.Name,
      No__de_OT: x.No__de_OT_Orden_de_Trabajo.numero_de_orden,
      No__de_Reporte: x.No__de_Reporte_Crear_Reporte.No_Reporte,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      IdAsignacionPartes: x.IdAsignacionPartes,

    }));

    this.excelService.exportToCsv(result, 'Salida_en_Almacen_de_partes',  ['Folio'    ,'No__de_Parte___Descripcion'  ,'Se_mantiene_el_No__de_Parte'  ,'No__de_parte_nuevo'  ,'No__de_serie'  ,'No__de_lote'  ,'Hora_acumuladas'  ,'Ciclos_acumulados'  ,'Fecha_de_Vencimiento'  ,'Ubicacion'  ,'Solicitante'  ,'No__de_OT'  ,'No__de_Reporte'  ,'Matricula'  ,'Modelo'  ,'IdAsignacionPartes' ]);
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
    template += '          <th>No. de Parte / Descripción</th>';
    template += '          <th>¿Se mantiene el No. de Parte?</th>';
    template += '          <th>No. de parte nuevo</th>';
    template += '          <th>No. de serie</th>';
    template += '          <th>No. de lote</th>';
    template += '          <th>Hora acumuladas</th>';
    template += '          <th>Ciclos acumulados</th>';
    template += '          <th>Fecha de Vencimiento</th>';
    template += '          <th>Ubicación del Almacén</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>No. de OT</th>';
    template += '          <th>No. de Reporte</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>IdAsignacionPartes</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No__de_Parte___Descripcion + '</td>';
      template += '          <td>' + element.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion + '</td>';
      template += '          <td>' + element.No__de_parte_nuevo + '</td>';
      template += '          <td>' + element.No__de_serie + '</td>';
      template += '          <td>' + element.No__de_lote + '</td>';
      template += '          <td>' + element.Hora_acumuladas + '</td>';
      template += '          <td>' + element.Ciclos_acumulados + '</td>';
      template += '          <td>' + element.Fecha_de_Vencimiento + '</td>';
      template += '          <td>' + element.Ubicacion + '</td>';
      template += '          <td>' + element.Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.No__de_OT_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.No__de_Reporte_Crear_Reporte.No_Reporte + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.IdAsignacionPartes + '</td>';
		  
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
	template += '\t No. de Parte / Descripción';
	template += '\t ¿Se mantiene el No. de Parte?';
	template += '\t No. de parte nuevo';
	template += '\t No. de serie';
	template += '\t No. de lote';
	template += '\t Hora acumuladas';
	template += '\t Ciclos acumulados';
	template += '\t Fecha de Vencimiento';
	template += '\t Ubicación del Almacén';
	template += '\t Solicitante';
	template += '\t No. de OT';
	template += '\t No. de Reporte';
	template += '\t Matrícula';
	template += '\t Modelo';
	template += '\t IdAsignacionPartes';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.No__de_Parte___Descripcion;
      template += '\t ' + element.Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion;
	  template += '\t ' + element.No__de_parte_nuevo;
	  template += '\t ' + element.No__de_serie;
	  template += '\t ' + element.No__de_lote;
	  template += '\t ' + element.Hora_acumuladas;
	  template += '\t ' + element.Ciclos_acumulados;
	  template += '\t ' + element.Fecha_de_Vencimiento;
	  template += '\t ' + element.Ubicacion;
      template += '\t ' + element.Solicitante_Spartan_User.Name;
      template += '\t ' + element.No__de_OT_Orden_de_Trabajo.numero_de_orden;
      template += '\t ' + element.No__de_Reporte_Crear_Reporte.No_Reporte;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
	  template += '\t ' + element.IdAsignacionPartes;

	  template += '\n';
    });

    return template;
  }

}

export class Salida_en_Almacen_de_partesDataSource implements DataSource<Salida_en_Almacen_de_partes>
{
  private subject = new BehaviorSubject<Salida_en_Almacen_de_partes[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Salida_en_Almacen_de_partesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Salida_en_Almacen_de_partes[]> {
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
              const longest = result.Salida_en_Almacen_de_partess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Salida_en_Almacen_de_partess);
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
      condition += " and Salida_en_Almacen_de_partes.Folio = " + data.filter.Folio;
    if (data.filter.No__de_Parte___Descripcion != "")
      condition += " and Salida_en_Almacen_de_partes.No__de_Parte___Descripcion like '%" + data.filter.No__de_Parte___Descripcion + "%' ";
    if (data.filter.Se_mantiene_el_No__de_Parte != "")
      condition += " and Estatus_de_Requerido.Descripcion like '%" + data.filter.Se_mantiene_el_No__de_Parte + "%' ";
    if (data.filter.No__de_parte_nuevo != "")
      condition += " and Salida_en_Almacen_de_partes.No__de_parte_nuevo like '%" + data.filter.No__de_parte_nuevo + "%' ";
    if (data.filter.No__de_serie != "")
      condition += " and Salida_en_Almacen_de_partes.No__de_serie like '%" + data.filter.No__de_serie + "%' ";
    if (data.filter.No__de_lote != "")
      condition += " and Salida_en_Almacen_de_partes.No__de_lote like '%" + data.filter.No__de_lote + "%' ";
    if (data.filter.Hora_acumuladas != "")
      condition += " and Salida_en_Almacen_de_partes.Hora_acumuladas = " + data.filter.Hora_acumuladas;
    if (data.filter.Ciclos_acumulados != "")
      condition += " and Salida_en_Almacen_de_partes.Ciclos_acumulados = " + data.filter.Ciclos_acumulados;
    if (data.filter.Fecha_de_Vencimiento)
      condition += " and CONVERT(VARCHAR(10), Salida_en_Almacen_de_partes.Fecha_de_Vencimiento, 102)  = '" + moment(data.filter.Fecha_de_Vencimiento).format("YYYY.MM.DD") + "'";
    if (data.filter.Ubicacion != "")
      condition += " and Salida_en_Almacen_de_partes.Ubicacion like '%" + data.filter.Ubicacion + "%' ";
    if (data.filter.Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante + "%' ";
    if (data.filter.No__de_OT != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.No__de_OT + "%' ";
    if (data.filter.No__de_Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.No__de_Reporte + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.IdAsignacionPartes != "")
      condition += " and Salida_en_Almacen_de_partes.IdAsignacionPartes like '%" + data.filter.IdAsignacionPartes + "%' ";

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
        sort = " Salida_en_Almacen_de_partes.Folio " + data.sortDirecction;
        break;
      case "No__de_Parte___Descripcion":
        sort = " Salida_en_Almacen_de_partes.No__de_Parte___Descripcion " + data.sortDirecction;
        break;
      case "Se_mantiene_el_No__de_Parte":
        sort = " Estatus_de_Requerido.Descripcion " + data.sortDirecction;
        break;
      case "No__de_parte_nuevo":
        sort = " Salida_en_Almacen_de_partes.No__de_parte_nuevo " + data.sortDirecction;
        break;
      case "No__de_serie":
        sort = " Salida_en_Almacen_de_partes.No__de_serie " + data.sortDirecction;
        break;
      case "No__de_lote":
        sort = " Salida_en_Almacen_de_partes.No__de_lote " + data.sortDirecction;
        break;
      case "Hora_acumuladas":
        sort = " Salida_en_Almacen_de_partes.Hora_acumuladas " + data.sortDirecction;
        break;
      case "Ciclos_acumulados":
        sort = " Salida_en_Almacen_de_partes.Ciclos_acumulados " + data.sortDirecction;
        break;
      case "Fecha_de_Vencimiento":
        sort = " Salida_en_Almacen_de_partes.Fecha_de_Vencimiento " + data.sortDirecction;
        break;
      case "Ubicacion":
        sort = " Salida_en_Almacen_de_partes.Ubicacion " + data.sortDirecction;
        break;
      case "Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "No__de_OT":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "No__de_Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "IdAsignacionPartes":
        sort = " Salida_en_Almacen_de_partes.IdAsignacionPartes " + data.sortDirecction;
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
        condition += " AND Salida_en_Almacen_de_partes.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Salida_en_Almacen_de_partes.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.No__de_Parte___DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Salida_en_Almacen_de_partes.No__de_Parte___Descripcion LIKE '" + data.filterAdvanced.No__de_Parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Salida_en_Almacen_de_partes.No__de_Parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_Parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Salida_en_Almacen_de_partes.No__de_Parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_Parte___Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Salida_en_Almacen_de_partes.No__de_Parte___Descripcion = '" + data.filterAdvanced.No__de_Parte___Descripcion + "'";
        break;
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
      condition += " AND Salida_en_Almacen_de_partes.Se_mantiene_el_No__de_Parte In (" + Se_mantiene_el_No__de_Parteds + ")";
    }
    switch (data.filterAdvanced.No__de_parte_nuevoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Salida_en_Almacen_de_partes.No__de_parte_nuevo LIKE '" + data.filterAdvanced.No__de_parte_nuevo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Salida_en_Almacen_de_partes.No__de_parte_nuevo LIKE '%" + data.filterAdvanced.No__de_parte_nuevo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Salida_en_Almacen_de_partes.No__de_parte_nuevo LIKE '%" + data.filterAdvanced.No__de_parte_nuevo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Salida_en_Almacen_de_partes.No__de_parte_nuevo = '" + data.filterAdvanced.No__de_parte_nuevo + "'";
        break;
    }
    switch (data.filterAdvanced.No__de_serieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Salida_en_Almacen_de_partes.No__de_serie LIKE '" + data.filterAdvanced.No__de_serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Salida_en_Almacen_de_partes.No__de_serie LIKE '%" + data.filterAdvanced.No__de_serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Salida_en_Almacen_de_partes.No__de_serie LIKE '%" + data.filterAdvanced.No__de_serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Salida_en_Almacen_de_partes.No__de_serie = '" + data.filterAdvanced.No__de_serie + "'";
        break;
    }
    switch (data.filterAdvanced.No__de_loteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Salida_en_Almacen_de_partes.No__de_lote LIKE '" + data.filterAdvanced.No__de_lote + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Salida_en_Almacen_de_partes.No__de_lote LIKE '%" + data.filterAdvanced.No__de_lote + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Salida_en_Almacen_de_partes.No__de_lote LIKE '%" + data.filterAdvanced.No__de_lote + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Salida_en_Almacen_de_partes.No__de_lote = '" + data.filterAdvanced.No__de_lote + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromHora_acumuladas != 'undefined' && data.filterAdvanced.fromHora_acumuladas)
	|| (typeof data.filterAdvanced.toHora_acumuladas != 'undefined' && data.filterAdvanced.toHora_acumuladas)) 
	{
      if (typeof data.filterAdvanced.fromHora_acumuladas != 'undefined' && data.filterAdvanced.fromHora_acumuladas)
        condition += " AND Salida_en_Almacen_de_partes.Hora_acumuladas >= " + data.filterAdvanced.fromHora_acumuladas;

      if (typeof data.filterAdvanced.toHora_acumuladas != 'undefined' && data.filterAdvanced.toHora_acumuladas) 
        condition += " AND Salida_en_Almacen_de_partes.Hora_acumuladas <= " + data.filterAdvanced.toHora_acumuladas;
    }
    if ((typeof data.filterAdvanced.fromCiclos_acumulados != 'undefined' && data.filterAdvanced.fromCiclos_acumulados)
	|| (typeof data.filterAdvanced.toCiclos_acumulados != 'undefined' && data.filterAdvanced.toCiclos_acumulados)) 
	{
      if (typeof data.filterAdvanced.fromCiclos_acumulados != 'undefined' && data.filterAdvanced.fromCiclos_acumulados)
        condition += " AND Salida_en_Almacen_de_partes.Ciclos_acumulados >= " + data.filterAdvanced.fromCiclos_acumulados;

      if (typeof data.filterAdvanced.toCiclos_acumulados != 'undefined' && data.filterAdvanced.toCiclos_acumulados) 
        condition += " AND Salida_en_Almacen_de_partes.Ciclos_acumulados <= " + data.filterAdvanced.toCiclos_acumulados;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_Vencimiento)
	|| (typeof data.filterAdvanced.toFecha_de_Vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_Vencimiento)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_Vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Salida_en_Almacen_de_partes.Fecha_de_Vencimiento, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Vencimiento).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_Vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Salida_en_Almacen_de_partes.Fecha_de_Vencimiento, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Vencimiento).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.UbicacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Salida_en_Almacen_de_partes.Ubicacion LIKE '" + data.filterAdvanced.Ubicacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Salida_en_Almacen_de_partes.Ubicacion LIKE '%" + data.filterAdvanced.Ubicacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Salida_en_Almacen_de_partes.Ubicacion LIKE '%" + data.filterAdvanced.Ubicacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Salida_en_Almacen_de_partes.Ubicacion = '" + data.filterAdvanced.Ubicacion + "'";
        break;
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
      condition += " AND Salida_en_Almacen_de_partes.Solicitante In (" + Solicitanteds + ")";
    }
    if ((typeof data.filterAdvanced.No__de_OT != 'undefined' && data.filterAdvanced.No__de_OT)) {
      switch (data.filterAdvanced.No__de_OTFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.No__de_OT + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.No__de_OT + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.No__de_OT + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.No__de_OT + "'";
          break;
      }
    } else if (data.filterAdvanced.No__de_OTMultiple != null && data.filterAdvanced.No__de_OTMultiple.length > 0) {
      var No__de_OTds = data.filterAdvanced.No__de_OTMultiple.join(",");
      condition += " AND Salida_en_Almacen_de_partes.No__de_OT In (" + No__de_OTds + ")";
    }
    if ((typeof data.filterAdvanced.No__de_Reporte != 'undefined' && data.filterAdvanced.No__de_Reporte)) {
      switch (data.filterAdvanced.No__de_ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.No__de_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.No__de_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.No__de_Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.No__de_Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.No__de_ReporteMultiple != null && data.filterAdvanced.No__de_ReporteMultiple.length > 0) {
      var No__de_Reporteds = data.filterAdvanced.No__de_ReporteMultiple.join(",");
      condition += " AND Salida_en_Almacen_de_partes.No__de_Reporte In (" + No__de_Reporteds + ")";
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
      condition += " AND Salida_en_Almacen_de_partes.Matricula In (" + Matriculads + ")";
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
      condition += " AND Salida_en_Almacen_de_partes.Modelo In (" + Modelods + ")";
    }
    switch (data.filterAdvanced.IdAsignacionPartesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Salida_en_Almacen_de_partes.IdAsignacionPartes LIKE '" + data.filterAdvanced.IdAsignacionPartes + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Salida_en_Almacen_de_partes.IdAsignacionPartes LIKE '%" + data.filterAdvanced.IdAsignacionPartes + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Salida_en_Almacen_de_partes.IdAsignacionPartes LIKE '%" + data.filterAdvanced.IdAsignacionPartes + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Salida_en_Almacen_de_partes.IdAsignacionPartes = '" + data.filterAdvanced.IdAsignacionPartes + "'";
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
              const longest = result.Salida_en_Almacen_de_partess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Salida_en_Almacen_de_partess);
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
