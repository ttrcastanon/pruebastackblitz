import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Formato_de_salida_de_aeronaveService } from "src/app/api-services/Formato_de_salida_de_aeronave.service";
import { Formato_de_salida_de_aeronave } from "src/app/models/Formato_de_salida_de_aeronave";
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
import { Formato_de_salida_de_aeronaveIndexRules } from 'src/app/shared/businessRules/Formato_de_salida_de_aeronave-index-rules';
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
  selector: "app-list-Formato_de_salida_de_aeronave",
  templateUrl: "./list-Formato_de_salida_de_aeronave.component.html",
  styleUrls: ["./list-Formato_de_salida_de_aeronave.component.scss"],
})
export class ListFormato_de_salida_de_aeronaveComponent extends Formato_de_salida_de_aeronaveIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Orden_de_Trabajo",
    "Fecha_de_Inspeccion",
    "Matricula",
    "Modelo",
    "Numero_de_serie",
    "Cliente",
    "Usuario_que_registra",
    "Rol_de_usuario",
    "Hora",
    "Prevuelo_Efectuado",
    "Liberado_despues_de_reparacion_mayor",
    "Liberado_despues_de_inspeccion",
    "Liberado_despues_de_modificacion_mayor",
    "Liberado_despues_de_trabajos_menores",
    "Tipo_de_inspeccion",
    "Combustible_LH",
    "Combustible_RH",
    "Regresar_a_servicio",
    "Vuelo_de_evaluacion",
    "Salida",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Orden_de_Trabajo",
      "Fecha_de_Inspeccion",
      "Matricula",
      "Modelo",
      "Numero_de_serie",
      "Cliente",
      "Usuario_que_registra",
      "Rol_de_usuario",
      "Hora",
      "Prevuelo_Efectuado",
      "Liberado_despues_de_reparacion_mayor",
      "Liberado_despues_de_inspeccion",
      "Liberado_despues_de_modificacion_mayor",
      "Liberado_despues_de_trabajos_menores",
      "Tipo_de_inspeccion",
      "Combustible_LH",
      "Combustible_RH",
      "Regresar_a_servicio",
      "Vuelo_de_evaluacion",
      "Salida",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Orden_de_Trabajo_filtro",
      "Fecha_de_Inspeccion_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Numero_de_serie_filtro",
      "Cliente_filtro",
      "Usuario_que_registra_filtro",
      "Rol_de_usuario_filtro",
      "Hora_filtro",
      "Prevuelo_Efectuado_filtro",
      "Liberado_despues_de_reparacion_mayor_filtro",
      "Liberado_despues_de_inspeccion_filtro",
      "Liberado_despues_de_modificacion_mayor_filtro",
      "Liberado_despues_de_trabajos_menores_filtro",
      "Tipo_de_inspeccion_filtro",
      "Combustible_LH_filtro",
      "Combustible_RH_filtro",
      "Regresar_a_servicio_filtro",
      "Vuelo_de_evaluacion_filtro",
      "Salida_filtro",

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
      Orden_de_Trabajo: "",
      Fecha_de_Inspeccion: null,
      Matricula: "",
      Modelo: "",
      Numero_de_serie: "",
      Cliente: "",
      Usuario_que_registra: "",
      Rol_de_usuario: "",
      Hora: "",
      Prevuelo_Efectuado: "",
      Liberado_despues_de_reparacion_mayor: "",
      Liberado_despues_de_inspeccion: "",
      Liberado_despues_de_modificacion_mayor: "",
      Liberado_despues_de_trabajos_menores: "",
      Tipo_de_inspeccion: "",
      Combustible_LH: "",
      Combustible_RH: "",
      Regresar_a_servicio: "",
      Vuelo_de_evaluacion: "",
      Salida: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Orden_de_TrabajoFilter: "",
      Orden_de_Trabajo: "",
      Orden_de_TrabajoMultiple: "",
      fromFecha_de_Inspeccion: "",
      toFecha_de_Inspeccion: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      Usuario_que_registraFilter: "",
      Usuario_que_registra: "",
      Usuario_que_registraMultiple: "",
      fromHora: "",
      toHora: "",

    }
  };

  dataSource: Formato_de_salida_de_aeronaveDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Formato_de_salida_de_aeronaveDataSource;
  dataClipboard: any;

  constructor(
    private _Formato_de_salida_de_aeronaveService: Formato_de_salida_de_aeronaveService,
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
    this.dataSource = new Formato_de_salida_de_aeronaveDataSource(
      this._Formato_de_salida_de_aeronaveService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Formato_de_salida_de_aeronave)
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
    this.listConfig.filter.Orden_de_Trabajo = "";
    this.listConfig.filter.Fecha_de_Inspeccion = undefined;
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Numero_de_serie = "";
    this.listConfig.filter.Cliente = "";
    this.listConfig.filter.Usuario_que_registra = "";
    this.listConfig.filter.Rol_de_usuario = "";
    this.listConfig.filter.Hora = "";
    this.listConfig.filter.Prevuelo_Efectuado = undefined;
    this.listConfig.filter.Liberado_despues_de_reparacion_mayor = undefined;
    this.listConfig.filter.Liberado_despues_de_inspeccion = undefined;
    this.listConfig.filter.Liberado_despues_de_modificacion_mayor = undefined;
    this.listConfig.filter.Liberado_despues_de_trabajos_menores = undefined;
    this.listConfig.filter.Tipo_de_inspeccion = "";
    this.listConfig.filter.Combustible_LH = "";
    this.listConfig.filter.Combustible_RH = "";
    this.listConfig.filter.Regresar_a_servicio = undefined;
    this.listConfig.filter.Vuelo_de_evaluacion = undefined;
    this.listConfig.filter.Salida = undefined;

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

  remove(row: Formato_de_salida_de_aeronave) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Formato_de_salida_de_aeronaveService
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
  ActionPrint(dataRow: Formato_de_salida_de_aeronave) {

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
,'Orden de Trabajo'
,'Fecha de Inspección'
,'Matrícula'
,'Modelo'
,'Número de serie'
,'Cliente'
,'Usuario que registra'
,'Rol de usuario'
,'Hora'
,'Prevuelo Efectuado'
,'Liberado después de una reparación mayor'
,'Liberado después de una inspección'
,'Liberado después de una modificación mayor'
,'Liberado después de trabajos menores'
,'Tipo de inspección'
,'Combustible LH'
,'Combustible RH'
,'Regresar a servicio'
,'Vuelo de evaluación'
,'Salida'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden
,x.Fecha_de_Inspeccion
,x.Matricula_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.Numero_de_serie
,x.Cliente_Cliente.Razon_Social
,x.Usuario_que_registra_Spartan_User.Name
,x.Rol_de_usuario
,x.Hora
,x.Prevuelo_Efectuado
,x.Liberado_despues_de_reparacion_mayor
,x.Liberado_despues_de_inspeccion
,x.Liberado_despues_de_modificacion_mayor
,x.Liberado_despues_de_trabajos_menores
,x.Tipo_de_inspeccion
,x.Combustible_LH
,x.Combustible_RH
,x.Regresar_a_servicio
,x.Vuelo_de_evaluacion
,x.Salida
		  
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
    pdfMake.createPdf(pdfDefinition).download('Formato_de_salida_de_aeronave.pdf');
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
          this._Formato_de_salida_de_aeronaveService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Formato_de_salida_de_aeronaves;
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
          this._Formato_de_salida_de_aeronaveService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Formato_de_salida_de_aeronaves;
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
        'Orden de Trabajo ': fields.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
        'Fecha de Inspección ': fields.Fecha_de_Inspeccion ? momentJS(fields.Fecha_de_Inspeccion).format('DD/MM/YYYY') : '',
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'Número de serie ': fields.Numero_de_serie,
        'Cliente ': fields.Cliente_Cliente.Razon_Social,
        'Usuario que registra ': fields.Usuario_que_registra_Spartan_User.Name,
        'Rol de usuario ': fields.Rol_de_usuario,
        'Hora ': fields.Hora,
        'Prevuelo_Efectuado ': fields.Prevuelo_Efectuado ? 'SI' : 'NO',
        'Liberado_despues_de_reparacion_mayor ': fields.Liberado_despues_de_reparacion_mayor ? 'SI' : 'NO',
        'Liberado_despues_de_inspeccion ': fields.Liberado_despues_de_inspeccion ? 'SI' : 'NO',
        'Liberado_despues_de_modificacion_mayor ': fields.Liberado_despues_de_modificacion_mayor ? 'SI' : 'NO',
        'Liberado_despues_de_trabajos_menores ': fields.Liberado_despues_de_trabajos_menores ? 'SI' : 'NO',
        'Tipo de inspección ': fields.Tipo_de_inspeccion,
        'Combustible LH ': fields.Combustible_LH,
        'Combustible RH ': fields.Combustible_RH,
        'Regresar_a_servicio ': fields.Regresar_a_servicio ? 'SI' : 'NO',
        'Vuelo_de_evaluacion ': fields.Vuelo_de_evaluacion ? 'SI' : 'NO',
        'Salida ': fields.Salida ? 'SI' : 'NO',

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Formato_de_salida_de_aeronave  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Orden_de_Trabajo: x.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
      Fecha_de_Inspeccion: x.Fecha_de_Inspeccion,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      Numero_de_serie: x.Numero_de_serie,
      Cliente: x.Cliente_Cliente.Razon_Social,
      Usuario_que_registra: x.Usuario_que_registra_Spartan_User.Name,
      Rol_de_usuario: x.Rol_de_usuario,
      Hora: x.Hora,
      Prevuelo_Efectuado: x.Prevuelo_Efectuado,
      Liberado_despues_de_reparacion_mayor: x.Liberado_despues_de_reparacion_mayor,
      Liberado_despues_de_inspeccion: x.Liberado_despues_de_inspeccion,
      Liberado_despues_de_modificacion_mayor: x.Liberado_despues_de_modificacion_mayor,
      Liberado_despues_de_trabajos_menores: x.Liberado_despues_de_trabajos_menores,
      Tipo_de_inspeccion: x.Tipo_de_inspeccion,
      Combustible_LH: x.Combustible_LH,
      Combustible_RH: x.Combustible_RH,
      Regresar_a_servicio: x.Regresar_a_servicio,
      Vuelo_de_evaluacion: x.Vuelo_de_evaluacion,
      Salida: x.Salida,

    }));

    this.excelService.exportToCsv(result, 'Formato_de_salida_de_aeronave',  ['Folio'    ,'Orden_de_Trabajo'  ,'Fecha_de_Inspeccion'  ,'Matricula'  ,'Modelo'  ,'Numero_de_serie'  ,'Cliente'  ,'Usuario_que_registra'  ,'Rol_de_usuario'  ,'Hora'  ,'Prevuelo_Efectuado'  ,'Liberado_despues_de_reparacion_mayor'  ,'Liberado_despues_de_inspeccion'  ,'Liberado_despues_de_modificacion_mayor'  ,'Liberado_despues_de_trabajos_menores'  ,'Tipo_de_inspeccion'  ,'Combustible_LH'  ,'Combustible_RH'  ,'Regresar_a_servicio'  ,'Vuelo_de_evaluacion'  ,'Salida' ]);
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
    template += '          <th>Orden de Trabajo</th>';
    template += '          <th>Fecha de Inspección</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Número de serie</th>';
    template += '          <th>Cliente</th>';
    template += '          <th>Usuario que registra</th>';
    template += '          <th>Rol de usuario</th>';
    template += '          <th>Hora</th>';
    template += '          <th>Prevuelo Efectuado</th>';
    template += '          <th>Liberado después de una reparación mayor</th>';
    template += '          <th>Liberado después de una inspección</th>';
    template += '          <th>Liberado después de una modificación mayor</th>';
    template += '          <th>Liberado después de trabajos menores</th>';
    template += '          <th>Tipo de inspección</th>';
    template += '          <th>Combustible LH</th>';
    template += '          <th>Combustible RH</th>';
    template += '          <th>Regresar a servicio</th>';
    template += '          <th>Vuelo de evaluación</th>';
    template += '          <th>Salida</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.Fecha_de_Inspeccion + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Numero_de_serie + '</td>';
      template += '          <td>' + element.Cliente_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Usuario_que_registra_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Rol_de_usuario + '</td>';
      template += '          <td>' + element.Hora + '</td>';
      template += '          <td>' + element.Prevuelo_Efectuado + '</td>';
      template += '          <td>' + element.Liberado_despues_de_reparacion_mayor + '</td>';
      template += '          <td>' + element.Liberado_despues_de_inspeccion + '</td>';
      template += '          <td>' + element.Liberado_despues_de_modificacion_mayor + '</td>';
      template += '          <td>' + element.Liberado_despues_de_trabajos_menores + '</td>';
      template += '          <td>' + element.Tipo_de_inspeccion + '</td>';
      template += '          <td>' + element.Combustible_LH + '</td>';
      template += '          <td>' + element.Combustible_RH + '</td>';
      template += '          <td>' + element.Regresar_a_servicio + '</td>';
      template += '          <td>' + element.Vuelo_de_evaluacion + '</td>';
      template += '          <td>' + element.Salida + '</td>';
		  
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
	template += '\t Orden de Trabajo';
	template += '\t Fecha de Inspección';
	template += '\t Matrícula';
	template += '\t Modelo';
	template += '\t Número de serie';
	template += '\t Cliente';
	template += '\t Usuario que registra';
	template += '\t Rol de usuario';
	template += '\t Hora';
	template += '\t Prevuelo Efectuado';
	template += '\t Liberado después de una reparación mayor';
	template += '\t Liberado después de una inspección';
	template += '\t Liberado después de una modificación mayor';
	template += '\t Liberado después de trabajos menores';
	template += '\t Tipo de inspección';
	template += '\t Combustible LH';
	template += '\t Combustible RH';
	template += '\t Regresar a servicio';
	template += '\t Vuelo de evaluación';
	template += '\t Salida';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden;
	  template += '\t ' + element.Fecha_de_Inspeccion;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
	  template += '\t ' + element.Numero_de_serie;
      template += '\t ' + element.Cliente_Cliente.Razon_Social;
      template += '\t ' + element.Usuario_que_registra_Spartan_User.Name;
	  template += '\t ' + element.Rol_de_usuario;
	  template += '\t ' + element.Hora;
	  template += '\t ' + element.Prevuelo_Efectuado;
	  template += '\t ' + element.Liberado_despues_de_reparacion_mayor;
	  template += '\t ' + element.Liberado_despues_de_inspeccion;
	  template += '\t ' + element.Liberado_despues_de_modificacion_mayor;
	  template += '\t ' + element.Liberado_despues_de_trabajos_menores;
	  template += '\t ' + element.Tipo_de_inspeccion;
	  template += '\t ' + element.Combustible_LH;
	  template += '\t ' + element.Combustible_RH;
	  template += '\t ' + element.Regresar_a_servicio;
	  template += '\t ' + element.Vuelo_de_evaluacion;
	  template += '\t ' + element.Salida;

	  template += '\n';
    });

    return template;
  }

}

export class Formato_de_salida_de_aeronaveDataSource implements DataSource<Formato_de_salida_de_aeronave>
{
  private subject = new BehaviorSubject<Formato_de_salida_de_aeronave[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Formato_de_salida_de_aeronaveService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Formato_de_salida_de_aeronave[]> {
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
              const longest = result.Formato_de_salida_de_aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Formato_de_salida_de_aeronaves);
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
      condition += " and Formato_de_salida_de_aeronave.Folio = " + data.filter.Folio;
    if (data.filter.Orden_de_Trabajo != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.Orden_de_Trabajo + "%' ";
    if (data.filter.Fecha_de_Inspeccion)
      condition += " and CONVERT(VARCHAR(10), Formato_de_salida_de_aeronave.Fecha_de_Inspeccion, 102)  = '" + moment(data.filter.Fecha_de_Inspeccion).format("YYYY.MM.DD") + "'";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Numero_de_serie != "")
      condition += " and Formato_de_salida_de_aeronave.Numero_de_serie like '%" + data.filter.Numero_de_serie + "%' ";
    if (data.filter.Cliente != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Cliente + "%' ";
    if (data.filter.Usuario_que_registra != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_registra + "%' ";
    if (data.filter.Rol_de_usuario != "")
      condition += " and Formato_de_salida_de_aeronave.Rol_de_usuario like '%" + data.filter.Rol_de_usuario + "%' ";
    if (data.filter.Hora != "")
      condition += " and Formato_de_salida_de_aeronave.Hora = '" + data.filter.Hora + "'";
    if (data.filter.Prevuelo_Efectuado && data.filter.Prevuelo_Efectuado != "2") {
      if (data.filter.Prevuelo_Efectuado == "0" || data.filter.Prevuelo_Efectuado == "") {
        condition += " and (Formato_de_salida_de_aeronave.Prevuelo_Efectuado = 0 or Formato_de_salida_de_aeronave.Prevuelo_Efectuado is null)";
      } else {
        condition += " and Formato_de_salida_de_aeronave.Prevuelo_Efectuado = 1";
      }
    }
    if (data.filter.Liberado_despues_de_reparacion_mayor && data.filter.Liberado_despues_de_reparacion_mayor != "2") {
      if (data.filter.Liberado_despues_de_reparacion_mayor == "0" || data.filter.Liberado_despues_de_reparacion_mayor == "") {
        condition += " and (Formato_de_salida_de_aeronave.Liberado_despues_de_reparacion_mayor = 0 or Formato_de_salida_de_aeronave.Liberado_despues_de_reparacion_mayor is null)";
      } else {
        condition += " and Formato_de_salida_de_aeronave.Liberado_despues_de_reparacion_mayor = 1";
      }
    }
    if (data.filter.Liberado_despues_de_inspeccion && data.filter.Liberado_despues_de_inspeccion != "2") {
      if (data.filter.Liberado_despues_de_inspeccion == "0" || data.filter.Liberado_despues_de_inspeccion == "") {
        condition += " and (Formato_de_salida_de_aeronave.Liberado_despues_de_inspeccion = 0 or Formato_de_salida_de_aeronave.Liberado_despues_de_inspeccion is null)";
      } else {
        condition += " and Formato_de_salida_de_aeronave.Liberado_despues_de_inspeccion = 1";
      }
    }
    if (data.filter.Liberado_despues_de_modificacion_mayor && data.filter.Liberado_despues_de_modificacion_mayor != "2") {
      if (data.filter.Liberado_despues_de_modificacion_mayor == "0" || data.filter.Liberado_despues_de_modificacion_mayor == "") {
        condition += " and (Formato_de_salida_de_aeronave.Liberado_despues_de_modificacion_mayor = 0 or Formato_de_salida_de_aeronave.Liberado_despues_de_modificacion_mayor is null)";
      } else {
        condition += " and Formato_de_salida_de_aeronave.Liberado_despues_de_modificacion_mayor = 1";
      }
    }
    if (data.filter.Liberado_despues_de_trabajos_menores && data.filter.Liberado_despues_de_trabajos_menores != "2") {
      if (data.filter.Liberado_despues_de_trabajos_menores == "0" || data.filter.Liberado_despues_de_trabajos_menores == "") {
        condition += " and (Formato_de_salida_de_aeronave.Liberado_despues_de_trabajos_menores = 0 or Formato_de_salida_de_aeronave.Liberado_despues_de_trabajos_menores is null)";
      } else {
        condition += " and Formato_de_salida_de_aeronave.Liberado_despues_de_trabajos_menores = 1";
      }
    }
    if (data.filter.Tipo_de_inspeccion != "")
      condition += " and Formato_de_salida_de_aeronave.Tipo_de_inspeccion like '%" + data.filter.Tipo_de_inspeccion + "%' ";
    if (data.filter.Combustible_LH != "")
      condition += " and Formato_de_salida_de_aeronave.Combustible_LH like '%" + data.filter.Combustible_LH + "%' ";
    if (data.filter.Combustible_RH != "")
      condition += " and Formato_de_salida_de_aeronave.Combustible_RH like '%" + data.filter.Combustible_RH + "%' ";
    if (data.filter.Regresar_a_servicio && data.filter.Regresar_a_servicio != "2") {
      if (data.filter.Regresar_a_servicio == "0" || data.filter.Regresar_a_servicio == "") {
        condition += " and (Formato_de_salida_de_aeronave.Regresar_a_servicio = 0 or Formato_de_salida_de_aeronave.Regresar_a_servicio is null)";
      } else {
        condition += " and Formato_de_salida_de_aeronave.Regresar_a_servicio = 1";
      }
    }
    if (data.filter.Vuelo_de_evaluacion && data.filter.Vuelo_de_evaluacion != "2") {
      if (data.filter.Vuelo_de_evaluacion == "0" || data.filter.Vuelo_de_evaluacion == "") {
        condition += " and (Formato_de_salida_de_aeronave.Vuelo_de_evaluacion = 0 or Formato_de_salida_de_aeronave.Vuelo_de_evaluacion is null)";
      } else {
        condition += " and Formato_de_salida_de_aeronave.Vuelo_de_evaluacion = 1";
      }
    }
    if (data.filter.Salida && data.filter.Salida != "2") {
      if (data.filter.Salida == "0" || data.filter.Salida == "") {
        condition += " and (Formato_de_salida_de_aeronave.Salida = 0 or Formato_de_salida_de_aeronave.Salida is null)";
      } else {
        condition += " and Formato_de_salida_de_aeronave.Salida = 1";
      }
    }

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
        sort = " Formato_de_salida_de_aeronave.Folio " + data.sortDirecction;
        break;
      case "Orden_de_Trabajo":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "Fecha_de_Inspeccion":
        sort = " Formato_de_salida_de_aeronave.Fecha_de_Inspeccion " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Numero_de_serie":
        sort = " Formato_de_salida_de_aeronave.Numero_de_serie " + data.sortDirecction;
        break;
      case "Cliente":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Usuario_que_registra":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Rol_de_usuario":
        sort = " Formato_de_salida_de_aeronave.Rol_de_usuario " + data.sortDirecction;
        break;
      case "Hora":
        sort = " Formato_de_salida_de_aeronave.Hora " + data.sortDirecction;
        break;
      case "Prevuelo_Efectuado":
        sort = " Formato_de_salida_de_aeronave.Prevuelo_Efectuado " + data.sortDirecction;
        break;
      case "Liberado_despues_de_reparacion_mayor":
        sort = " Formato_de_salida_de_aeronave.Liberado_despues_de_reparacion_mayor " + data.sortDirecction;
        break;
      case "Liberado_despues_de_inspeccion":
        sort = " Formato_de_salida_de_aeronave.Liberado_despues_de_inspeccion " + data.sortDirecction;
        break;
      case "Liberado_despues_de_modificacion_mayor":
        sort = " Formato_de_salida_de_aeronave.Liberado_despues_de_modificacion_mayor " + data.sortDirecction;
        break;
      case "Liberado_despues_de_trabajos_menores":
        sort = " Formato_de_salida_de_aeronave.Liberado_despues_de_trabajos_menores " + data.sortDirecction;
        break;
      case "Tipo_de_inspeccion":
        sort = " Formato_de_salida_de_aeronave.Tipo_de_inspeccion " + data.sortDirecction;
        break;
      case "Combustible_LH":
        sort = " Formato_de_salida_de_aeronave.Combustible_LH " + data.sortDirecction;
        break;
      case "Combustible_RH":
        sort = " Formato_de_salida_de_aeronave.Combustible_RH " + data.sortDirecction;
        break;
      case "Regresar_a_servicio":
        sort = " Formato_de_salida_de_aeronave.Regresar_a_servicio " + data.sortDirecction;
        break;
      case "Vuelo_de_evaluacion":
        sort = " Formato_de_salida_de_aeronave.Vuelo_de_evaluacion " + data.sortDirecction;
        break;
      case "Salida":
        sort = " Formato_de_salida_de_aeronave.Salida " + data.sortDirecction;
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
        condition += " AND Formato_de_salida_de_aeronave.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Formato_de_salida_de_aeronave.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Orden_de_Trabajo != 'undefined' && data.filterAdvanced.Orden_de_Trabajo)) {
      switch (data.filterAdvanced.Orden_de_TrabajoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.Orden_de_Trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Orden_de_Trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Orden_de_Trabajo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.Orden_de_Trabajo + "'";
          break;
      }
    } else if (data.filterAdvanced.Orden_de_TrabajoMultiple != null && data.filterAdvanced.Orden_de_TrabajoMultiple.length > 0) {
      var Orden_de_Trabajods = data.filterAdvanced.Orden_de_TrabajoMultiple.join(",");
      condition += " AND Formato_de_salida_de_aeronave.Orden_de_Trabajo In (" + Orden_de_Trabajods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Inspeccion != 'undefined' && data.filterAdvanced.fromFecha_de_Inspeccion)
	|| (typeof data.filterAdvanced.toFecha_de_Inspeccion != 'undefined' && data.filterAdvanced.toFecha_de_Inspeccion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Inspeccion != 'undefined' && data.filterAdvanced.fromFecha_de_Inspeccion) 
        condition += " and CONVERT(VARCHAR(10), Formato_de_salida_de_aeronave.Fecha_de_Inspeccion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Inspeccion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Inspeccion != 'undefined' && data.filterAdvanced.toFecha_de_Inspeccion) 
        condition += " and CONVERT(VARCHAR(10), Formato_de_salida_de_aeronave.Fecha_de_Inspeccion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Inspeccion).format("YYYY.MM.DD") + "'";
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
      condition += " AND Formato_de_salida_de_aeronave.Matricula In (" + Matriculads + ")";
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
      condition += " AND Formato_de_salida_de_aeronave.Modelo In (" + Modelods + ")";
    }
    switch (data.filterAdvanced.Numero_de_serieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Formato_de_salida_de_aeronave.Numero_de_serie LIKE '" + data.filterAdvanced.Numero_de_serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Formato_de_salida_de_aeronave.Numero_de_serie LIKE '%" + data.filterAdvanced.Numero_de_serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Formato_de_salida_de_aeronave.Numero_de_serie LIKE '%" + data.filterAdvanced.Numero_de_serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Formato_de_salida_de_aeronave.Numero_de_serie = '" + data.filterAdvanced.Numero_de_serie + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Cliente != 'undefined' && data.filterAdvanced.Cliente)) {
      switch (data.filterAdvanced.ClienteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Cliente + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.Cliente + "'";
          break;
      }
    } else if (data.filterAdvanced.ClienteMultiple != null && data.filterAdvanced.ClienteMultiple.length > 0) {
      var Clienteds = data.filterAdvanced.ClienteMultiple.join(",");
      condition += " AND Formato_de_salida_de_aeronave.Cliente In (" + Clienteds + ")";
    }
    if ((typeof data.filterAdvanced.Usuario_que_registra != 'undefined' && data.filterAdvanced.Usuario_que_registra)) {
      switch (data.filterAdvanced.Usuario_que_registraFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_que_registra + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_registra + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_registra + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_que_registra + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_registraMultiple != null && data.filterAdvanced.Usuario_que_registraMultiple.length > 0) {
      var Usuario_que_registrads = data.filterAdvanced.Usuario_que_registraMultiple.join(",");
      condition += " AND Formato_de_salida_de_aeronave.Usuario_que_registra In (" + Usuario_que_registrads + ")";
    }
    switch (data.filterAdvanced.Rol_de_usuarioFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Formato_de_salida_de_aeronave.Rol_de_usuario LIKE '" + data.filterAdvanced.Rol_de_usuario + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Formato_de_salida_de_aeronave.Rol_de_usuario LIKE '%" + data.filterAdvanced.Rol_de_usuario + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Formato_de_salida_de_aeronave.Rol_de_usuario LIKE '%" + data.filterAdvanced.Rol_de_usuario + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Formato_de_salida_de_aeronave.Rol_de_usuario = '" + data.filterAdvanced.Rol_de_usuario + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromHora != 'undefined' && data.filterAdvanced.fromHora)
	|| (typeof data.filterAdvanced.toHora != 'undefined' && data.filterAdvanced.toHora)) 
	{
		if (typeof data.filterAdvanced.fromHora != 'undefined' && data.filterAdvanced.fromHora) 
			condition += " and Formato_de_salida_de_aeronave.Hora >= '" + data.filterAdvanced.fromHora + "'";
      
		if (typeof data.filterAdvanced.toHora != 'undefined' && data.filterAdvanced.toHora) 
			condition += " and Formato_de_salida_de_aeronave.Hora <= '" + data.filterAdvanced.toHora + "'";
    }
    switch (data.filterAdvanced.Tipo_de_inspeccionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Formato_de_salida_de_aeronave.Tipo_de_inspeccion LIKE '" + data.filterAdvanced.Tipo_de_inspeccion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Formato_de_salida_de_aeronave.Tipo_de_inspeccion LIKE '%" + data.filterAdvanced.Tipo_de_inspeccion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Formato_de_salida_de_aeronave.Tipo_de_inspeccion LIKE '%" + data.filterAdvanced.Tipo_de_inspeccion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Formato_de_salida_de_aeronave.Tipo_de_inspeccion = '" + data.filterAdvanced.Tipo_de_inspeccion + "'";
        break;
    }
    switch (data.filterAdvanced.Combustible_LHFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Formato_de_salida_de_aeronave.Combustible_LH LIKE '" + data.filterAdvanced.Combustible_LH + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Formato_de_salida_de_aeronave.Combustible_LH LIKE '%" + data.filterAdvanced.Combustible_LH + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Formato_de_salida_de_aeronave.Combustible_LH LIKE '%" + data.filterAdvanced.Combustible_LH + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Formato_de_salida_de_aeronave.Combustible_LH = '" + data.filterAdvanced.Combustible_LH + "'";
        break;
    }
    switch (data.filterAdvanced.Combustible_RHFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Formato_de_salida_de_aeronave.Combustible_RH LIKE '" + data.filterAdvanced.Combustible_RH + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Formato_de_salida_de_aeronave.Combustible_RH LIKE '%" + data.filterAdvanced.Combustible_RH + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Formato_de_salida_de_aeronave.Combustible_RH LIKE '%" + data.filterAdvanced.Combustible_RH + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Formato_de_salida_de_aeronave.Combustible_RH = '" + data.filterAdvanced.Combustible_RH + "'";
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
              const longest = result.Formato_de_salida_de_aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Formato_de_salida_de_aeronaves);
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
