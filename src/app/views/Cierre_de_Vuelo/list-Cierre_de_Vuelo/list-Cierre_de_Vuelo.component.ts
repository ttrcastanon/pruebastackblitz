import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Cierre_de_VueloService } from "src/app/api-services/Cierre_de_Vuelo.service";
import { Cierre_de_Vuelo } from "src/app/models/Cierre_de_Vuelo";
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
import { Cierre_de_VueloIndexRules } from 'src/app/shared/businessRules/Cierre_de_Vuelo-index-rules';
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
  selector: "app-list-Cierre_de_Vuelo",
  templateUrl: "./list-Cierre_de_Vuelo.component.html",
  styleUrls: ["./list-Cierre_de_Vuelo.component.scss"],
})
export class ListCierre_de_VueloComponent extends Cierre_de_VueloIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Numero_de_Vuelo",
    "Matricula",
    "Solicitud",
    "Tramo_de_Vuelo",
    "Origen",
    "Destino",
    "Fecha_Salida",
    "Hora_Salida",
    "Fecha_Despegue",
    "Hora_Despegue",
    "Fecha_Aterrizaje",
    "Hora_Aterrizaje",
    "Fecha_Llegada",
    "Hora_Llegada",
    "Pasajeros_Adicionales",
    "Combustible_Inicial",
    "Cumbustible_Final_Consumido",
    "Combustible_Total_Consumido",
    "Notas_de_Tramo",
    "cerrar_vuelo",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Numero_de_Vuelo",
      "Matricula",
      "Solicitud",
      "Tramo_de_Vuelo",
      "Origen",
      "Destino",
      "Fecha_Salida",
      "Hora_Salida",
      "Fecha_Despegue",
      "Hora_Despegue",
      "Fecha_Aterrizaje",
      "Hora_Aterrizaje",
      "Fecha_Llegada",
      "Hora_Llegada",
      "Pasajeros_Adicionales",
      "Combustible_Inicial",
      "Cumbustible_Final_Consumido",
      "Combustible_Total_Consumido",
      "Notas_de_Tramo",
      "cerrar_vuelo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Numero_de_Vuelo_filtro",
      "Matricula_filtro",
      "Solicitud_filtro",
      "Tramo_de_Vuelo_filtro",
      "Origen_filtro",
      "Destino_filtro",
      "Fecha_Salida_filtro",
      "Hora_Salida_filtro",
      "Fecha_Despegue_filtro",
      "Hora_Despegue_filtro",
      "Fecha_Aterrizaje_filtro",
      "Hora_Aterrizaje_filtro",
      "Fecha_Llegada_filtro",
      "Hora_Llegada_filtro",
      "Pasajeros_Adicionales_filtro",
      "Combustible_Inicial_filtro",
      "Cumbustible_Final_Consumido_filtro",
      "Combustible_Total_Consumido_filtro",
      "Notas_de_Tramo_filtro",
      "cerrar_vuelo_filtro",

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
      Numero_de_Vuelo: "",
      Matricula: "",
      Solicitud: null,
      Tramo_de_Vuelo: "",
      Origen: "",
      Destino: "",
      Fecha_Salida: null,
      Hora_Salida: "",
      Fecha_Despegue: null,
      Hora_Despegue: "",
      Fecha_Aterrizaje: null,
      Hora_Aterrizaje: "",
      Fecha_Llegada: null,
      Hora_Llegada: "",
      Pasajeros_Adicionales: "",
      Combustible_Inicial: "",
      Cumbustible_Final_Consumido: "",
      Combustible_Total_Consumido: "",
      Notas_de_Tramo: "",
      cerrar_vuelo: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Numero_de_VueloFilter: "",
      Numero_de_Vuelo: "",
      Numero_de_VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromSolicitud: "",
      toSolicitud: "",
      Tramo_de_VueloFilter: "",
      Tramo_de_Vuelo: "",
      Tramo_de_VueloMultiple: "",
      OrigenFilter: "",
      Origen: "",
      OrigenMultiple: "",
      DestinoFilter: "",
      Destino: "",
      DestinoMultiple: "",
      fromFecha_Salida: "",
      toFecha_Salida: "",
      fromHora_Salida: "",
      toHora_Salida: "",
      fromFecha_Despegue: "",
      toFecha_Despegue: "",
      fromHora_Despegue: "",
      toHora_Despegue: "",
      fromFecha_Aterrizaje: "",
      toFecha_Aterrizaje: "",
      fromHora_Aterrizaje: "",
      toHora_Aterrizaje: "",
      fromFecha_Llegada: "",
      toFecha_Llegada: "",
      fromHora_Llegada: "",
      toHora_Llegada: "",
      fromPasajeros_Adicionales: "",
      toPasajeros_Adicionales: "",
      fromCombustible_Inicial: "",
      toCombustible_Inicial: "",
      fromCumbustible_Final_Consumido: "",
      toCumbustible_Final_Consumido: "",
      fromCombustible_Total_Consumido: "",
      toCombustible_Total_Consumido: "",
      cerrar_vueloFilter: "",
      cerrar_vuelo: "",
      cerrar_vueloMultiple: "",

    }
  };

  dataSource: Cierre_de_VueloDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Cierre_de_VueloDataSource;
  dataClipboard: any;

  constructor(
    private _Cierre_de_VueloService: Cierre_de_VueloService,
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
    this.dataSource = new Cierre_de_VueloDataSource(
      this._Cierre_de_VueloService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Cierre_de_Vuelo)
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
    this.listConfig.filter.Numero_de_Vuelo = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Solicitud = undefined;
    this.listConfig.filter.Tramo_de_Vuelo = "";
    this.listConfig.filter.Origen = "";
    this.listConfig.filter.Destino = "";
    this.listConfig.filter.Fecha_Salida = undefined;
    this.listConfig.filter.Hora_Salida = "";
    this.listConfig.filter.Fecha_Despegue = undefined;
    this.listConfig.filter.Hora_Despegue = "";
    this.listConfig.filter.Fecha_Aterrizaje = undefined;
    this.listConfig.filter.Hora_Aterrizaje = "";
    this.listConfig.filter.Fecha_Llegada = undefined;
    this.listConfig.filter.Hora_Llegada = "";
    this.listConfig.filter.Pasajeros_Adicionales = "";
    this.listConfig.filter.Combustible_Inicial = "";
    this.listConfig.filter.Cumbustible_Final_Consumido = "";
    this.listConfig.filter.Combustible_Total_Consumido = "";
    this.listConfig.filter.Notas_de_Tramo = "";
    this.listConfig.filter.cerrar_vuelo = "";

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

  remove(row: Cierre_de_Vuelo) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Cierre_de_VueloService
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
  ActionPrint(dataRow: Cierre_de_Vuelo) {

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
,'Número de Vuelo'
,'Matrícula'
,'Solicitud'
,'Tramo de Vuelo'
,'Origen'
,'Destino'
,'Fecha Salida'
,'Hora Salida'
,'Fecha Despegue'
,'Hora Despegue'
,'Fecha Aterrizaje'
,'Hora Aterrizaje'
,'Fecha Llegada'
,'Hora Llegada'
,'Pasajeros Adicionales'
,'Combustible Inicial'
,'Cumbustible Final Consumido'
,'Combustible Total Consumido'
,'Notas de Tramo'
,'¿Desea cerrar el vuelo?'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
,x.Matricula_Aeronave.Matricula
,x.Solicitud
,x.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo
,x.Origen_Aeropuertos.Descripcion
,x.Destino_Aeropuertos.Descripcion
,x.Fecha_Salida
,x.Hora_Salida
,x.Fecha_Despegue
,x.Hora_Despegue
,x.Fecha_Aterrizaje
,x.Hora_Aterrizaje
,x.Fecha_Llegada
,x.Hora_Llegada
,x.Pasajeros_Adicionales
,x.Combustible_Inicial
,x.Cumbustible_Final_Consumido
,x.Combustible_Total_Consumido
,x.Notas_de_Tramo
,x.cerrar_vuelo_Respuesta.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Cierre_de_Vuelo.pdf');
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
          this._Cierre_de_VueloService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Cierre_de_Vuelos;
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
          this._Cierre_de_VueloService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Cierre_de_Vuelos;
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
        'Número de Vuelo ': fields.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Solicitud ': fields.Solicitud ? momentJS(fields.Solicitud).format('DD/MM/YYYY') : '',
        'Tramo de Vuelo ': fields.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo,
        'Origen ': fields.Origen_Aeropuertos.Descripcion,
        'Destino 1': fields.Destino_Aeropuertos.Descripcion,
        'Fecha Salida ': fields.Fecha_Salida ? momentJS(fields.Fecha_Salida).format('DD/MM/YYYY') : '',
        'Hora Salida ': fields.Hora_Salida,
        'Fecha Despegue ': fields.Fecha_Despegue ? momentJS(fields.Fecha_Despegue).format('DD/MM/YYYY') : '',
        'Hora Despegue ': fields.Hora_Despegue,
        'Fecha Aterrizaje ': fields.Fecha_Aterrizaje ? momentJS(fields.Fecha_Aterrizaje).format('DD/MM/YYYY') : '',
        'Hora Aterrizaje ': fields.Hora_Aterrizaje,
        'Fecha Llegada ': fields.Fecha_Llegada ? momentJS(fields.Fecha_Llegada).format('DD/MM/YYYY') : '',
        'Hora Llegada ': fields.Hora_Llegada,
        'Pasajeros Adicionales ': fields.Pasajeros_Adicionales,
        'Combustible Inicial ': fields.Combustible_Inicial,
        'Cumbustible Final Consumido ': fields.Cumbustible_Final_Consumido,
        'Combustible Total Consumido ': fields.Combustible_Total_Consumido,
        'Notas de Tramo ': fields.Notas_de_Tramo,
        '¿Desea cerrar el vuelo? ': fields.cerrar_vuelo_Respuesta.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Cierre_de_Vuelo  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Numero_de_Vuelo: x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Matricula: x.Matricula_Aeronave.Matricula,
      Solicitud: x.Solicitud,
      Tramo_de_Vuelo: x.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo,
      Origen: x.Origen_Aeropuertos.Descripcion,
      Destino: x.Destino_Aeropuertos.Descripcion,
      Fecha_Salida: x.Fecha_Salida,
      Hora_Salida: x.Hora_Salida,
      Fecha_Despegue: x.Fecha_Despegue,
      Hora_Despegue: x.Hora_Despegue,
      Fecha_Aterrizaje: x.Fecha_Aterrizaje,
      Hora_Aterrizaje: x.Hora_Aterrizaje,
      Fecha_Llegada: x.Fecha_Llegada,
      Hora_Llegada: x.Hora_Llegada,
      Pasajeros_Adicionales: x.Pasajeros_Adicionales,
      Combustible_Inicial: x.Combustible_Inicial,
      Cumbustible_Final_Consumido: x.Cumbustible_Final_Consumido,
      Combustible_Total_Consumido: x.Combustible_Total_Consumido,
      Notas_de_Tramo: x.Notas_de_Tramo,
      cerrar_vuelo: x.cerrar_vuelo_Respuesta.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Cierre_de_Vuelo',  ['Folio'    ,'Numero_de_Vuelo'  ,'Matricula'  ,'Solicitud'  ,'Tramo_de_Vuelo'  ,'Origen'  ,'Destino'  ,'Fecha_Salida'  ,'Hora_Salida'  ,'Fecha_Despegue'  ,'Hora_Despegue'  ,'Fecha_Aterrizaje'  ,'Hora_Aterrizaje'  ,'Fecha_Llegada'  ,'Hora_Llegada'  ,'Pasajeros_Adicionales'  ,'Combustible_Inicial'  ,'Cumbustible_Final_Consumido'  ,'Combustible_Total_Consumido'  ,'Notas_de_Tramo'  ,'cerrar_vuelo' ]);
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
    template += '          <th>Número de Vuelo</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Solicitud</th>';
    template += '          <th>Tramo de Vuelo</th>';
    template += '          <th>Origen</th>';
    template += '          <th>Destino</th>';
    template += '          <th>Fecha Salida</th>';
    template += '          <th>Hora Salida</th>';
    template += '          <th>Fecha Despegue</th>';
    template += '          <th>Hora Despegue</th>';
    template += '          <th>Fecha Aterrizaje</th>';
    template += '          <th>Hora Aterrizaje</th>';
    template += '          <th>Fecha Llegada</th>';
    template += '          <th>Hora Llegada</th>';
    template += '          <th>Pasajeros Adicionales</th>';
    template += '          <th>Combustible Inicial</th>';
    template += '          <th>Cumbustible Final Consumido</th>';
    template += '          <th>Combustible Total Consumido</th>';
    template += '          <th>Notas de Tramo</th>';
    template += '          <th>¿Desea cerrar el vuelo?</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Solicitud + '</td>';
      template += '          <td>' + element.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo + '</td>';
      template += '          <td>' + element.Origen_Aeropuertos.Descripcion + '</td>';
      template += '          <td>' + element.Destino_Aeropuertos.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_Salida + '</td>';
      template += '          <td>' + element.Hora_Salida + '</td>';
      template += '          <td>' + element.Fecha_Despegue + '</td>';
      template += '          <td>' + element.Hora_Despegue + '</td>';
      template += '          <td>' + element.Fecha_Aterrizaje + '</td>';
      template += '          <td>' + element.Hora_Aterrizaje + '</td>';
      template += '          <td>' + element.Fecha_Llegada + '</td>';
      template += '          <td>' + element.Hora_Llegada + '</td>';
      template += '          <td>' + element.Pasajeros_Adicionales + '</td>';
      template += '          <td>' + element.Combustible_Inicial + '</td>';
      template += '          <td>' + element.Cumbustible_Final_Consumido + '</td>';
      template += '          <td>' + element.Combustible_Total_Consumido + '</td>';
      template += '          <td>' + element.Notas_de_Tramo + '</td>';
      template += '          <td>' + element.cerrar_vuelo_Respuesta.Descripcion + '</td>';
		  
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
	template += '\t Número de Vuelo';
	template += '\t Matrícula';
	template += '\t Solicitud';
	template += '\t Tramo de Vuelo';
	template += '\t Origen';
	template += '\t Destino';
	template += '\t Fecha Salida';
	template += '\t Hora Salida';
	template += '\t Fecha Despegue';
	template += '\t Hora Despegue';
	template += '\t Fecha Aterrizaje';
	template += '\t Hora Aterrizaje';
	template += '\t Fecha Llegada';
	template += '\t Hora Llegada';
	template += '\t Pasajeros Adicionales';
	template += '\t Combustible Inicial';
	template += '\t Cumbustible Final Consumido';
	template += '\t Combustible Total Consumido';
	template += '\t Notas de Tramo';
	template += '\t ¿Desea cerrar el vuelo?';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
	  template += '\t ' + element.Solicitud;
      template += '\t ' + element.Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo;
      template += '\t ' + element.Origen_Aeropuertos.Descripcion;
      template += '\t ' + element.Destino_Aeropuertos.Descripcion;
	  template += '\t ' + element.Fecha_Salida;
	  template += '\t ' + element.Hora_Salida;
	  template += '\t ' + element.Fecha_Despegue;
	  template += '\t ' + element.Hora_Despegue;
	  template += '\t ' + element.Fecha_Aterrizaje;
	  template += '\t ' + element.Hora_Aterrizaje;
	  template += '\t ' + element.Fecha_Llegada;
	  template += '\t ' + element.Hora_Llegada;
	  template += '\t ' + element.Pasajeros_Adicionales;
	  template += '\t ' + element.Combustible_Inicial;
	  template += '\t ' + element.Cumbustible_Final_Consumido;
	  template += '\t ' + element.Combustible_Total_Consumido;
	  template += '\t ' + element.Notas_de_Tramo;
      template += '\t ' + element.cerrar_vuelo_Respuesta.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Cierre_de_VueloDataSource implements DataSource<Cierre_de_Vuelo>
{
  private subject = new BehaviorSubject<Cierre_de_Vuelo[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Cierre_de_VueloService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Cierre_de_Vuelo[]> {
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
              const longest = result.Cierre_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Cierre_de_Vuelos);
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
      condition += " and Cierre_de_Vuelo.Folio = " + data.filter.Folio;
    if (data.filter.Numero_de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Numero_de_Vuelo + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Solicitud)
      condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Solicitud, 102)  = '" + moment(data.filter.Solicitud).format("YYYY.MM.DD") + "'";
    if (data.filter.Tramo_de_Vuelo != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Tramo_de_Vuelo + "%' ";
    if (data.filter.Origen != "")
      condition += " and Aeropuertos.Descripcion like '%" + data.filter.Origen + "%' ";
    if (data.filter.Destino != "")
      condition += " and Aeropuertos.Descripcion like '%" + data.filter.Destino + "%' ";
    if (data.filter.Fecha_Salida)
      condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Salida, 102)  = '" + moment(data.filter.Fecha_Salida).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_Salida != "")
      condition += " and Cierre_de_Vuelo.Hora_Salida = '" + data.filter.Hora_Salida + "'";
    if (data.filter.Fecha_Despegue)
      condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Despegue, 102)  = '" + moment(data.filter.Fecha_Despegue).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_Despegue != "")
      condition += " and Cierre_de_Vuelo.Hora_Despegue = '" + data.filter.Hora_Despegue + "'";
    if (data.filter.Fecha_Aterrizaje)
      condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Aterrizaje, 102)  = '" + moment(data.filter.Fecha_Aterrizaje).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_Aterrizaje != "")
      condition += " and Cierre_de_Vuelo.Hora_Aterrizaje = '" + data.filter.Hora_Aterrizaje + "'";
    if (data.filter.Fecha_Llegada)
      condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Llegada, 102)  = '" + moment(data.filter.Fecha_Llegada).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_Llegada != "")
      condition += " and Cierre_de_Vuelo.Hora_Llegada = '" + data.filter.Hora_Llegada + "'";
    if (data.filter.Pasajeros_Adicionales != "")
      condition += " and Cierre_de_Vuelo.Pasajeros_Adicionales = " + data.filter.Pasajeros_Adicionales;
    if (data.filter.Combustible_Inicial != "")
      condition += " and Cierre_de_Vuelo.Combustible_Inicial = " + data.filter.Combustible_Inicial;
    if (data.filter.Cumbustible_Final_Consumido != "")
      condition += " and Cierre_de_Vuelo.Cumbustible_Final_Consumido = " + data.filter.Cumbustible_Final_Consumido;
    if (data.filter.Combustible_Total_Consumido != "")
      condition += " and Cierre_de_Vuelo.Combustible_Total_Consumido = " + data.filter.Combustible_Total_Consumido;
    if (data.filter.Notas_de_Tramo != "")
      condition += " and Cierre_de_Vuelo.Notas_de_Tramo like '%" + data.filter.Notas_de_Tramo + "%' ";
    if (data.filter.cerrar_vuelo != "")
      condition += " and Respuesta.Descripcion like '%" + data.filter.cerrar_vuelo + "%' ";

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
        sort = " Cierre_de_Vuelo.Folio " + data.sortDirecction;
        break;
      case "Numero_de_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Solicitud":
        sort = " Cierre_de_Vuelo.Solicitud " + data.sortDirecction;
        break;
      case "Tramo_de_Vuelo":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
        break;
      case "Origen":
        sort = " Aeropuertos.Descripcion " + data.sortDirecction;
        break;
      case "Destino":
        sort = " Aeropuertos.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_Salida":
        sort = " Cierre_de_Vuelo.Fecha_Salida " + data.sortDirecction;
        break;
      case "Hora_Salida":
        sort = " Cierre_de_Vuelo.Hora_Salida " + data.sortDirecction;
        break;
      case "Fecha_Despegue":
        sort = " Cierre_de_Vuelo.Fecha_Despegue " + data.sortDirecction;
        break;
      case "Hora_Despegue":
        sort = " Cierre_de_Vuelo.Hora_Despegue " + data.sortDirecction;
        break;
      case "Fecha_Aterrizaje":
        sort = " Cierre_de_Vuelo.Fecha_Aterrizaje " + data.sortDirecction;
        break;
      case "Hora_Aterrizaje":
        sort = " Cierre_de_Vuelo.Hora_Aterrizaje " + data.sortDirecction;
        break;
      case "Fecha_Llegada":
        sort = " Cierre_de_Vuelo.Fecha_Llegada " + data.sortDirecction;
        break;
      case "Hora_Llegada":
        sort = " Cierre_de_Vuelo.Hora_Llegada " + data.sortDirecction;
        break;
      case "Pasajeros_Adicionales":
        sort = " Cierre_de_Vuelo.Pasajeros_Adicionales " + data.sortDirecction;
        break;
      case "Combustible_Inicial":
        sort = " Cierre_de_Vuelo.Combustible_Inicial " + data.sortDirecction;
        break;
      case "Cumbustible_Final_Consumido":
        sort = " Cierre_de_Vuelo.Cumbustible_Final_Consumido " + data.sortDirecction;
        break;
      case "Combustible_Total_Consumido":
        sort = " Cierre_de_Vuelo.Combustible_Total_Consumido " + data.sortDirecction;
        break;
      case "Notas_de_Tramo":
        sort = " Cierre_de_Vuelo.Notas_de_Tramo " + data.sortDirecction;
        break;
      case "cerrar_vuelo":
        sort = " Respuesta.Descripcion " + data.sortDirecction;
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
        condition += " AND Cierre_de_Vuelo.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Cierre_de_Vuelo.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Numero_de_Vuelo != 'undefined' && data.filterAdvanced.Numero_de_Vuelo)) {
      switch (data.filterAdvanced.Numero_de_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.Numero_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Numero_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Numero_de_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.Numero_de_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_VueloMultiple != null && data.filterAdvanced.Numero_de_VueloMultiple.length > 0) {
      var Numero_de_Vuelods = data.filterAdvanced.Numero_de_VueloMultiple.join(",");
      condition += " AND Cierre_de_Vuelo.Numero_de_Vuelo In (" + Numero_de_Vuelods + ")";
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
      condition += " AND Cierre_de_Vuelo.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.fromSolicitud != 'undefined' && data.filterAdvanced.fromSolicitud)
	|| (typeof data.filterAdvanced.toSolicitud != 'undefined' && data.filterAdvanced.toSolicitud)) 
	{
      if (typeof data.filterAdvanced.fromSolicitud != 'undefined' && data.filterAdvanced.fromSolicitud) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Solicitud, 102)  >= '" +  moment(data.filterAdvanced.fromSolicitud).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toSolicitud != 'undefined' && data.filterAdvanced.toSolicitud) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Solicitud, 102)  <= '" + moment(data.filterAdvanced.toSolicitud).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Tramo_de_Vuelo != 'undefined' && data.filterAdvanced.Tramo_de_Vuelo)) {
      switch (data.filterAdvanced.Tramo_de_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '" + data.filterAdvanced.Tramo_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo_de_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo = '" + data.filterAdvanced.Tramo_de_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.Tramo_de_VueloMultiple != null && data.filterAdvanced.Tramo_de_VueloMultiple.length > 0) {
      var Tramo_de_Vuelods = data.filterAdvanced.Tramo_de_VueloMultiple.join(",");
      condition += " AND Cierre_de_Vuelo.Tramo_de_Vuelo In (" + Tramo_de_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Origen != 'undefined' && data.filterAdvanced.Origen)) {
      switch (data.filterAdvanced.OrigenFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Descripcion LIKE '" + data.filterAdvanced.Origen + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Origen + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Origen + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Descripcion = '" + data.filterAdvanced.Origen + "'";
          break;
      }
    } else if (data.filterAdvanced.OrigenMultiple != null && data.filterAdvanced.OrigenMultiple.length > 0) {
      var Origends = data.filterAdvanced.OrigenMultiple.join(",");
      condition += " AND Cierre_de_Vuelo.Origen In (" + Origends + ")";
    }
    if ((typeof data.filterAdvanced.Destino != 'undefined' && data.filterAdvanced.Destino)) {
      switch (data.filterAdvanced.DestinoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Descripcion LIKE '" + data.filterAdvanced.Destino + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Destino + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Destino + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Descripcion = '" + data.filterAdvanced.Destino + "'";
          break;
      }
    } else if (data.filterAdvanced.DestinoMultiple != null && data.filterAdvanced.DestinoMultiple.length > 0) {
      var Destinods = data.filterAdvanced.DestinoMultiple.join(",");
      condition += " AND Cierre_de_Vuelo.Destino In (" + Destinods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_Salida != 'undefined' && data.filterAdvanced.fromFecha_Salida)
	|| (typeof data.filterAdvanced.toFecha_Salida != 'undefined' && data.filterAdvanced.toFecha_Salida)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Salida != 'undefined' && data.filterAdvanced.fromFecha_Salida) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Salida, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Salida).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Salida != 'undefined' && data.filterAdvanced.toFecha_Salida) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Salida, 102)  <= '" + moment(data.filterAdvanced.toFecha_Salida).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_Salida != 'undefined' && data.filterAdvanced.fromHora_Salida)
	|| (typeof data.filterAdvanced.toHora_Salida != 'undefined' && data.filterAdvanced.toHora_Salida)) 
	{
		if (typeof data.filterAdvanced.fromHora_Salida != 'undefined' && data.filterAdvanced.fromHora_Salida) 
			condition += " and Cierre_de_Vuelo.Hora_Salida >= '" + data.filterAdvanced.fromHora_Salida + "'";
      
		if (typeof data.filterAdvanced.toHora_Salida != 'undefined' && data.filterAdvanced.toHora_Salida) 
			condition += " and Cierre_de_Vuelo.Hora_Salida <= '" + data.filterAdvanced.toHora_Salida + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_Despegue != 'undefined' && data.filterAdvanced.fromFecha_Despegue)
	|| (typeof data.filterAdvanced.toFecha_Despegue != 'undefined' && data.filterAdvanced.toFecha_Despegue)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Despegue != 'undefined' && data.filterAdvanced.fromFecha_Despegue) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Despegue, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Despegue).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Despegue != 'undefined' && data.filterAdvanced.toFecha_Despegue) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Despegue, 102)  <= '" + moment(data.filterAdvanced.toFecha_Despegue).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_Despegue != 'undefined' && data.filterAdvanced.fromHora_Despegue)
	|| (typeof data.filterAdvanced.toHora_Despegue != 'undefined' && data.filterAdvanced.toHora_Despegue)) 
	{
		if (typeof data.filterAdvanced.fromHora_Despegue != 'undefined' && data.filterAdvanced.fromHora_Despegue) 
			condition += " and Cierre_de_Vuelo.Hora_Despegue >= '" + data.filterAdvanced.fromHora_Despegue + "'";
      
		if (typeof data.filterAdvanced.toHora_Despegue != 'undefined' && data.filterAdvanced.toHora_Despegue) 
			condition += " and Cierre_de_Vuelo.Hora_Despegue <= '" + data.filterAdvanced.toHora_Despegue + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_Aterrizaje != 'undefined' && data.filterAdvanced.fromFecha_Aterrizaje)
	|| (typeof data.filterAdvanced.toFecha_Aterrizaje != 'undefined' && data.filterAdvanced.toFecha_Aterrizaje)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Aterrizaje != 'undefined' && data.filterAdvanced.fromFecha_Aterrizaje) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Aterrizaje, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Aterrizaje).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Aterrizaje != 'undefined' && data.filterAdvanced.toFecha_Aterrizaje) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Aterrizaje, 102)  <= '" + moment(data.filterAdvanced.toFecha_Aterrizaje).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_Aterrizaje != 'undefined' && data.filterAdvanced.fromHora_Aterrizaje)
	|| (typeof data.filterAdvanced.toHora_Aterrizaje != 'undefined' && data.filterAdvanced.toHora_Aterrizaje)) 
	{
		if (typeof data.filterAdvanced.fromHora_Aterrizaje != 'undefined' && data.filterAdvanced.fromHora_Aterrizaje) 
			condition += " and Cierre_de_Vuelo.Hora_Aterrizaje >= '" + data.filterAdvanced.fromHora_Aterrizaje + "'";
      
		if (typeof data.filterAdvanced.toHora_Aterrizaje != 'undefined' && data.filterAdvanced.toHora_Aterrizaje) 
			condition += " and Cierre_de_Vuelo.Hora_Aterrizaje <= '" + data.filterAdvanced.toHora_Aterrizaje + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_Llegada != 'undefined' && data.filterAdvanced.fromFecha_Llegada)
	|| (typeof data.filterAdvanced.toFecha_Llegada != 'undefined' && data.filterAdvanced.toFecha_Llegada)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Llegada != 'undefined' && data.filterAdvanced.fromFecha_Llegada) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Llegada, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Llegada).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Llegada != 'undefined' && data.filterAdvanced.toFecha_Llegada) 
        condition += " and CONVERT(VARCHAR(10), Cierre_de_Vuelo.Fecha_Llegada, 102)  <= '" + moment(data.filterAdvanced.toFecha_Llegada).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_Llegada != 'undefined' && data.filterAdvanced.fromHora_Llegada)
	|| (typeof data.filterAdvanced.toHora_Llegada != 'undefined' && data.filterAdvanced.toHora_Llegada)) 
	{
		if (typeof data.filterAdvanced.fromHora_Llegada != 'undefined' && data.filterAdvanced.fromHora_Llegada) 
			condition += " and Cierre_de_Vuelo.Hora_Llegada >= '" + data.filterAdvanced.fromHora_Llegada + "'";
      
		if (typeof data.filterAdvanced.toHora_Llegada != 'undefined' && data.filterAdvanced.toHora_Llegada) 
			condition += " and Cierre_de_Vuelo.Hora_Llegada <= '" + data.filterAdvanced.toHora_Llegada + "'";
    }
    if ((typeof data.filterAdvanced.fromPasajeros_Adicionales != 'undefined' && data.filterAdvanced.fromPasajeros_Adicionales)
	|| (typeof data.filterAdvanced.toPasajeros_Adicionales != 'undefined' && data.filterAdvanced.toPasajeros_Adicionales)) 
	{
      if (typeof data.filterAdvanced.fromPasajeros_Adicionales != 'undefined' && data.filterAdvanced.fromPasajeros_Adicionales)
        condition += " AND Cierre_de_Vuelo.Pasajeros_Adicionales >= " + data.filterAdvanced.fromPasajeros_Adicionales;

      if (typeof data.filterAdvanced.toPasajeros_Adicionales != 'undefined' && data.filterAdvanced.toPasajeros_Adicionales) 
        condition += " AND Cierre_de_Vuelo.Pasajeros_Adicionales <= " + data.filterAdvanced.toPasajeros_Adicionales;
    }
    if ((typeof data.filterAdvanced.fromCombustible_Inicial != 'undefined' && data.filterAdvanced.fromCombustible_Inicial)
	|| (typeof data.filterAdvanced.toCombustible_Inicial != 'undefined' && data.filterAdvanced.toCombustible_Inicial)) 
	{
      if (typeof data.filterAdvanced.fromCombustible_Inicial != 'undefined' && data.filterAdvanced.fromCombustible_Inicial)
        condition += " AND Cierre_de_Vuelo.Combustible_Inicial >= " + data.filterAdvanced.fromCombustible_Inicial;

      if (typeof data.filterAdvanced.toCombustible_Inicial != 'undefined' && data.filterAdvanced.toCombustible_Inicial) 
        condition += " AND Cierre_de_Vuelo.Combustible_Inicial <= " + data.filterAdvanced.toCombustible_Inicial;
    }
    if ((typeof data.filterAdvanced.fromCumbustible_Final_Consumido != 'undefined' && data.filterAdvanced.fromCumbustible_Final_Consumido)
	|| (typeof data.filterAdvanced.toCumbustible_Final_Consumido != 'undefined' && data.filterAdvanced.toCumbustible_Final_Consumido)) 
	{
      if (typeof data.filterAdvanced.fromCumbustible_Final_Consumido != 'undefined' && data.filterAdvanced.fromCumbustible_Final_Consumido)
        condition += " AND Cierre_de_Vuelo.Cumbustible_Final_Consumido >= " + data.filterAdvanced.fromCumbustible_Final_Consumido;

      if (typeof data.filterAdvanced.toCumbustible_Final_Consumido != 'undefined' && data.filterAdvanced.toCumbustible_Final_Consumido) 
        condition += " AND Cierre_de_Vuelo.Cumbustible_Final_Consumido <= " + data.filterAdvanced.toCumbustible_Final_Consumido;
    }
    if ((typeof data.filterAdvanced.fromCombustible_Total_Consumido != 'undefined' && data.filterAdvanced.fromCombustible_Total_Consumido)
	|| (typeof data.filterAdvanced.toCombustible_Total_Consumido != 'undefined' && data.filterAdvanced.toCombustible_Total_Consumido)) 
	{
      if (typeof data.filterAdvanced.fromCombustible_Total_Consumido != 'undefined' && data.filterAdvanced.fromCombustible_Total_Consumido)
        condition += " AND Cierre_de_Vuelo.Combustible_Total_Consumido >= " + data.filterAdvanced.fromCombustible_Total_Consumido;

      if (typeof data.filterAdvanced.toCombustible_Total_Consumido != 'undefined' && data.filterAdvanced.toCombustible_Total_Consumido) 
        condition += " AND Cierre_de_Vuelo.Combustible_Total_Consumido <= " + data.filterAdvanced.toCombustible_Total_Consumido;
    }
    switch (data.filterAdvanced.Notas_de_TramoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cierre_de_Vuelo.Notas_de_Tramo LIKE '" + data.filterAdvanced.Notas_de_Tramo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cierre_de_Vuelo.Notas_de_Tramo LIKE '%" + data.filterAdvanced.Notas_de_Tramo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cierre_de_Vuelo.Notas_de_Tramo LIKE '%" + data.filterAdvanced.Notas_de_Tramo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cierre_de_Vuelo.Notas_de_Tramo = '" + data.filterAdvanced.Notas_de_Tramo + "'";
        break;
    }
    if ((typeof data.filterAdvanced.cerrar_vuelo != 'undefined' && data.filterAdvanced.cerrar_vuelo)) {
      switch (data.filterAdvanced.cerrar_vueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Respuesta.Descripcion LIKE '" + data.filterAdvanced.cerrar_vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.cerrar_vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.cerrar_vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Respuesta.Descripcion = '" + data.filterAdvanced.cerrar_vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.cerrar_vueloMultiple != null && data.filterAdvanced.cerrar_vueloMultiple.length > 0) {
      var cerrar_vuelods = data.filterAdvanced.cerrar_vueloMultiple.join(",");
      condition += " AND Cierre_de_Vuelo.cerrar_vuelo In (" + cerrar_vuelods + ")";
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
              const longest = result.Cierre_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Cierre_de_Vuelos);
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
