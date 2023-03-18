import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Gestion_de_aprobacion_de_mantenimientoService } from "src/app/api-services/Gestion_de_aprobacion_de_mantenimiento.service";
import { Gestion_de_aprobacion_de_mantenimiento } from "src/app/models/Gestion_de_aprobacion_de_mantenimiento";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2 } from "@angular/core";
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
import { Gestion_de_aprobacion_de_mantenimientoIndexRules } from 'src/app/shared/businessRules/Gestion_de_aprobacion_de_mantenimiento-index-rules';
import { DialogConfirmExportComponent } from "./../../../shared/views/dialogs/dialog-confirm-export/dialog-confirm-export.component";
import { Enumerations } from 'src/app/models/enumerations';
import _, { map } from 'underscore';
import { ExcelService } from "src/app/api-services/excel.service";
import * as momentJS from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogPrintFormatComponent } from './../../../shared/views/dialogs/dialog-print-format/dialog-print-format.component';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SpartanService } from 'src/app/api-services/spartan.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-list-Gestion_de_aprobacion_de_mantenimiento",
  templateUrl: "./list-Gestion_de_aprobacion_de_mantenimiento.component.html",
  styleUrls: ["./list-Gestion_de_aprobacion_de_mantenimiento.component.scss"],
})
export class ListGestion_de_aprobacion_de_mantenimientoComponent extends Gestion_de_aprobacion_de_mantenimientoIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Matricula",
    "Modelo",
    "N_Reporte",
    "Solicitante",
    "Departamento",
    "Fecha_de_solicitud",
    "Motivo_de_Cancelacion",
    "Estatus",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "N_Reporte",
      "Solicitante",
      "Departamento",
      "Fecha_de_solicitud",
      "Motivo_de_Cancelacion",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "N_Reporte_filtro",
      "Solicitante_filtro",
      "Departamento_filtro",
      "Fecha_de_solicitud_filtro",
      "Motivo_de_Cancelacion_filtro",
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
      Matricula: "",
      Modelo: "",
      N_Reporte: "",
      Solicitante: "",
      Departamento: "",
      Fecha_de_solicitud: null,
      Motivo_de_Cancelacion: "",
      Estatus: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      N_ReporteFilter: "",
      N_Reporte: "",
      N_ReporteMultiple: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      fromFecha_de_solicitud: "",
      toFecha_de_solicitud: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

    }
  };

  dataSource: Gestion_de_aprobacion_de_mantenimientoDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Gestion_de_aprobacion_de_mantenimientoDataSource;
  dataClipboard: any;
  phase: any;
  nombrePantalla: string = "Solicitud de Servicios Herramientas Materiales y Partes";

  constructor(
    private _Gestion_de_aprobacion_de_mantenimientoService: Gestion_de_aprobacion_de_mantenimientoService,
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
    route: Router,
    private activateRoute: ActivatedRoute,
    renderer: Renderer2
  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

  }

  ngOnInit() {

    this.activateRoute.paramMap.subscribe(
      params => {
        this.phase = params.get('id');

        if(this.phase == 1) {
          this.nombrePantalla = "Por Aprobar Almacén";
        }
        if(this.phase == 2) {
          this.nombrePantalla = "Por Aprobar Gerente Mantenimiento";
        }
        if(this.phase == 3) {
          this.nombrePantalla = "Aprobado Gerente Mantenimiento";
        }
        if(this.phase == 4) {
          this.nombrePantalla = "Canceladas";
        }

        this.localStorageHelper.setItemToLocalStorage("QueryParamGA", this.phase);

        if (this.localStorageHelper.getItemFromLocalStorage("QueryParamLGA") != this.phase) {
          this.localStorageHelper.setItemToLocalStorage("QueryParamLGA", this.phase);
          this.ngOnInit();
        }

      });

    this.rulesBeforeCreationList();

    this.dataSource = new Gestion_de_aprobacion_de_mantenimientoDataSource(this._Gestion_de_aprobacion_de_mantenimientoService, this._file);
    this.init();

    this._seguridad.permisos(AppConstants.Permisos.Gestion_de_aprobacion_de_mantenimiento).subscribe((response) => {
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
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.N_Reporte = "";
    this.listConfig.filter.Solicitante = "";
    this.listConfig.filter.Departamento = "";
    this.listConfig.filter.Fecha_de_solicitud = undefined;
    this.listConfig.filter.Motivo_de_Cancelacion = "";
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

    //INICIA - BRID:5385 - Filtrar para Almacen - Autor: Aaron - Actualización: 8/25/2021 6:26:56 PM

    this.brf.SetFilteronList(this.listConfig, `Gestion_de_aprobacion_de_mantenimiento.Estatus=1 and (${this.localStorageHelper.getItemFromLocalStorage("USERROLEID")} IN (26,1,9) )`);
    //TERMINA - BRID:5385


    //INICIA - BRID:5386 - Filtrar para Gte Mtto - Autor: Aaron - Actualización: 8/25/2021 6:25:29 PM
    this.brf.SetFilteronList(this.listConfig, `Gestion_de_aprobacion_de_mantenimiento.Estatus=1 and (${this.localStorageHelper.getItemFromLocalStorage("USERROLEID")} IN (19,1,9) )`);
    //TERMINA - BRID:5386


    //INICIA - BRID:7198 - WF:13 Rule List - Phase: 1 (Por Aprobar Almacén) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == this.brf.TryParseInt('1', '1')) {
      this.brf.SetFilteronList(this.listConfig, ` Gestion_de_aprobacion_de_mantenimiento.Estatus=1 and (${this.localStorageHelper.getItemFromLocalStorage("USERROLEID")} IN (1,9,19,17,25,43,26) ) `);
    }
    //TERMINA - BRID:7198


    //INICIA - BRID:7200 - WF:13 Rule List - Phase: 2 (Por Aprobar Gerente Mantenimiento) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == this.brf.TryParseInt('2', '2')) {
      this.brf.SetFilteronList(this.listConfig, ` Gestion_de_aprobacion_de_mantenimiento.Estatus=2 and (${this.localStorageHelper.getItemFromLocalStorage("USERROLEID")} IN (1,9,19,17,25,43) ) `);
    }
    //TERMINA - BRID:7200


    //INICIA - BRID:7202 - WF:13 Rule List - Phase: 3 (Aprobado Gerente Mantenimiento) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == this.brf.TryParseInt('3', '3')) {
      this.brf.SetFilteronList(this.listConfig, " Gestion_de_aprobacion_de_mantenimiento.Estatus = 3 ");
    }
    //TERMINA - BRID:7202


    //INICIA - BRID:7204 - WF:13 Rule List - Phase: 4 (Canceladas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.phase == this.brf.TryParseInt('4', '4')) {
      this.brf.SetFilteronList(this.listConfig, " Gestion_de_aprobacion_de_mantenimiento.Estatus = 4 ");
    }
    //TERMINA - BRID:7204

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

  remove(row: Gestion_de_aprobacion_de_mantenimiento) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Gestion_de_aprobacion_de_mantenimientoService
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
  ActionPrint(dataRow: Gestion_de_aprobacion_de_mantenimiento) {

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
      , 'Matrícula '
      , 'Modelo'
      , 'N° Reporte'
      , 'Solicitante'
      , 'Departamento'
      , 'Fecha de solicitud'
      , 'Motivo de Cancelación'
      , 'Estatus'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.Matricula_Aeronave.Matricula
        , x.Modelo_Modelos.Descripcion
        , x.N_Reporte_Crear_Reporte.No_Reporte
        , x.Solicitante_Spartan_User.Name
        , x.Departamento_Departamento.Nombre
        , x.Fecha_de_solicitud
        , x.Motivo_de_Cancelacion
        , x.Estatus_Estatus_Gestion_Aprobacion.Descripcion

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
    pdfMake.createPdf(pdfDefinition).download('Gestion_de_aprobacion_de_mantenimiento.pdf');
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
        buttonLabel = "Copiar";
        break;
      case 2: title = "Exportar Excel"; buttonLabel = "Exportar"; break;
      case 3: title = "Exportar CSV"; buttonLabel = "Exportar"; break;
      case 4: title = "Exportar PDF"; buttonLabel = "Exportar"; break;
      case 5: title = "Imprimir"; buttonLabel = "Imprimir"; break;
    }


    this.dialogo
      .open(DialogConfirmExportComponent, {
        data: {
          mensaje: `Seleccione una opción`,
          titulo: title,
          buttonLabel: buttonLabel
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
          this._Gestion_de_aprobacion_de_mantenimientoService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Gestion_de_aprobacion_de_mantenimientos;
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
          this._Gestion_de_aprobacion_de_mantenimientoService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Gestion_de_aprobacion_de_mantenimientos;
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
        'Matrícula  ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'N° Reporte ': fields.N_Reporte_Crear_Reporte.No_Reporte,
        'Solicitante ': fields.Solicitante_Spartan_User.Name,
        'Departamento ': fields.Departamento_Departamento.Nombre,
        'Fecha de solicitud ': fields.Fecha_de_solicitud ? momentJS(fields.Fecha_de_solicitud).format('DD/MM/YYYY') : '',
        'Motivo de Cancelación ': fields.Motivo_de_Cancelacion,
        'Estatus ': fields.Estatus_Estatus_Gestion_Aprobacion.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Gestion_de_aprobacion_de_mantenimiento  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      N_Reporte: x.N_Reporte_Crear_Reporte.No_Reporte,
      Solicitante: x.Solicitante_Spartan_User.Name,
      Departamento: x.Departamento_Departamento.Nombre,
      Fecha_de_solicitud: x.Fecha_de_solicitud,
      Motivo_de_Cancelacion: x.Motivo_de_Cancelacion,
      Estatus: x.Estatus_Estatus_Gestion_Aprobacion.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Gestion_de_aprobacion_de_mantenimiento', ['Folio', 'Matricula', 'Modelo', 'N_Reporte', 'Solicitante', 'Departamento', 'Fecha_de_solicitud', 'Motivo_de_Cancelacion', 'Estatus']);
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
    template += '          <th>Matrícula </th>';
    template += '          <th>Modelo</th>';
    template += '          <th>N° Reporte</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Departamento</th>';
    template += '          <th>Fecha de solicitud</th>';
    template += '          <th>Motivo de Cancelación</th>';
    template += '          <th>Estatus</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.N_Reporte_Crear_Reporte.No_Reporte + '</td>';
      template += '          <td>' + element.Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Departamento_Departamento.Nombre + '</td>';
      template += '          <td>' + element.Fecha_de_solicitud + '</td>';
      template += '          <td>' + element.Motivo_de_Cancelacion + '</td>';
      template += '          <td>' + element.Estatus_Estatus_Gestion_Aprobacion.Descripcion + '</td>';

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
    template += '\t Matrícula ';
    template += '\t Modelo';
    template += '\t N° Reporte';
    template += '\t Solicitante';
    template += '\t Departamento';
    template += '\t Fecha de solicitud';
    template += '\t Motivo de Cancelación';
    template += '\t Estatus';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.N_Reporte_Crear_Reporte.No_Reporte;
      template += '\t ' + element.Solicitante_Spartan_User.Name;
      template += '\t ' + element.Departamento_Departamento.Nombre;
      template += '\t ' + element.Fecha_de_solicitud;
      template += '\t ' + element.Motivo_de_Cancelacion;
      template += '\t ' + element.Estatus_Estatus_Gestion_Aprobacion.Descripcion;

      template += '\n';
    });

    return template;
  }

}

export class Gestion_de_aprobacion_de_mantenimientoDataSource implements DataSource<Gestion_de_aprobacion_de_mantenimiento>
{
  private subject = new BehaviorSubject<Gestion_de_aprobacion_de_mantenimiento[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Gestion_de_aprobacion_de_mantenimientoService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Gestion_de_aprobacion_de_mantenimiento[]> {
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
    if (data.MRWhere.length > 0) {
      if (condition != null && condition.length > 0) {
        condition = condition + " AND " + data.MRWhere;
      }
      if (condition == null || condition.length == 0) {
        condition = data.MRWhere;
      }
    }

    if (data.MRSort.length > 0) {
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
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Gestion_de_aprobacion_de_mantenimientos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Gestion_de_aprobacion_de_mantenimientos);
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
      condition += " and Gestion_de_aprobacion_de_mantenimiento.Folio = " + data.filter.Folio;
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.N_Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.N_Reporte + "%' ";
    if (data.filter.Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante + "%' ";
    if (data.filter.Departamento != "")
      condition += " and Departamento.Nombre like '%" + data.filter.Departamento + "%' ";
    if (data.filter.Fecha_de_solicitud)
      condition += " and CONVERT(VARCHAR(10), Gestion_de_aprobacion_de_mantenimiento.Fecha_de_solicitud, 102)  = '" + moment(data.filter.Fecha_de_solicitud).format("YYYY.MM.DD") + "'";
    if (data.filter.Motivo_de_Cancelacion != "")
      condition += " and Gestion_de_aprobacion_de_mantenimiento.Motivo_de_Cancelacion like '%" + data.filter.Motivo_de_Cancelacion + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_Gestion_Aprobacion.Descripcion like '%" + data.filter.Estatus + "%' ";

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
        sort = " Gestion_de_aprobacion_de_mantenimiento.Folio " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "N_Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Departamento":
        sort = " Departamento.Nombre " + data.sortDirecction;
        break;
      case "Fecha_de_solicitud":
        sort = " Gestion_de_aprobacion_de_mantenimiento.Fecha_de_solicitud " + data.sortDirecction;
        break;
      case "Motivo_de_Cancelacion":
        sort = " Gestion_de_aprobacion_de_mantenimiento.Motivo_de_Cancelacion " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_Gestion_Aprobacion.Descripcion " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
      || (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)) {
      if (typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
        condition += " AND Gestion_de_aprobacion_de_mantenimiento.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Gestion_de_aprobacion_de_mantenimiento.Folio <= " + data.filterAdvanced.toFolio;
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
      condition += " AND Gestion_de_aprobacion_de_mantenimiento.Matricula In (" + Matriculads + ")";
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
      condition += " AND Gestion_de_aprobacion_de_mantenimiento.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.N_Reporte != 'undefined' && data.filterAdvanced.N_Reporte)) {
      switch (data.filterAdvanced.N_ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.N_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.N_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.N_Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.N_Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.N_ReporteMultiple != null && data.filterAdvanced.N_ReporteMultiple.length > 0) {
      var N_Reporteds = data.filterAdvanced.N_ReporteMultiple.join(",");
      condition += " AND Gestion_de_aprobacion_de_mantenimiento.N_Reporte In (" + N_Reporteds + ")";
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
      condition += " AND Gestion_de_aprobacion_de_mantenimiento.Solicitante In (" + Solicitanteds + ")";
    }
    if ((typeof data.filterAdvanced.Departamento != 'undefined' && data.filterAdvanced.Departamento)) {
      switch (data.filterAdvanced.DepartamentoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Departamento.Nombre LIKE '" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Departamento.Nombre = '" + data.filterAdvanced.Departamento + "'";
          break;
      }
    } else if (data.filterAdvanced.DepartamentoMultiple != null && data.filterAdvanced.DepartamentoMultiple.length > 0) {
      var Departamentods = data.filterAdvanced.DepartamentoMultiple.join(",");
      condition += " AND Gestion_de_aprobacion_de_mantenimiento.Departamento In (" + Departamentods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_solicitud)
      || (typeof data.filterAdvanced.toFecha_de_solicitud != 'undefined' && data.filterAdvanced.toFecha_de_solicitud)) {
      if (typeof data.filterAdvanced.fromFecha_de_solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_solicitud)
        condition += " and CONVERT(VARCHAR(10), Gestion_de_aprobacion_de_mantenimiento.Fecha_de_solicitud, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_solicitud).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_solicitud != 'undefined' && data.filterAdvanced.toFecha_de_solicitud)
        condition += " and CONVERT(VARCHAR(10), Gestion_de_aprobacion_de_mantenimiento.Fecha_de_solicitud, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_solicitud).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Motivo_de_CancelacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Gestion_de_aprobacion_de_mantenimiento.Motivo_de_Cancelacion LIKE '" + data.filterAdvanced.Motivo_de_Cancelacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Gestion_de_aprobacion_de_mantenimiento.Motivo_de_Cancelacion LIKE '%" + data.filterAdvanced.Motivo_de_Cancelacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Gestion_de_aprobacion_de_mantenimiento.Motivo_de_Cancelacion LIKE '%" + data.filterAdvanced.Motivo_de_Cancelacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Gestion_de_aprobacion_de_mantenimiento.Motivo_de_Cancelacion = '" + data.filterAdvanced.Motivo_de_Cancelacion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_Gestion_Aprobacion.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_Gestion_Aprobacion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_Gestion_Aprobacion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_Gestion_Aprobacion.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Gestion_de_aprobacion_de_mantenimiento.Estatus In (" + Estatusds + ")";
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
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Gestion_de_aprobacion_de_mantenimientos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Gestion_de_aprobacion_de_mantenimientos);
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
