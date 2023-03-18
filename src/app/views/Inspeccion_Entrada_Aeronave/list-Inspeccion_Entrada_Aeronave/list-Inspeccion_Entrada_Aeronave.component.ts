import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Inspeccion_Entrada_AeronaveService } from "src/app/api-services/Inspeccion_Entrada_Aeronave.service";
import { Inspeccion_Entrada_Aeronave } from "src/app/models/Inspeccion_Entrada_Aeronave";
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
import { Inspeccion_Entrada_AeronaveIndexRules } from 'src/app/shared/businessRules/Inspeccion_Entrada_Aeronave-index-rules';
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
  selector: "app-list-Inspeccion_Entrada_Aeronave",
  templateUrl: "./list-Inspeccion_Entrada_Aeronave.component.html",
  styleUrls: ["./list-Inspeccion_Entrada_Aeronave.component.scss"],
})
export class ListInspeccion_Entrada_AeronaveComponent extends Inspeccion_Entrada_AeronaveIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Reporte",
    "N_Orden_de_Trabajo",
    "Fecha_de_Entrega",
    "Fecha_de_Registro",
    "Hora_de_Registro",
    "Usuario_que_Registra",
    "Aeronave",
    "Modelo",
    "Numero_de_Serie",
    "Cliente",
    "Se_realizo_evidencia_filmografica",
    "Cant__Combustible_en_la_recepcion",
    "Razon_de_ingreso",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Reporte",
      "N_Orden_de_Trabajo",
      "Fecha_de_Entrega",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Aeronave",
      "Modelo",
      "Numero_de_Serie",
      "Cliente",
      "Se_realizo_evidencia_filmografica",
      "Cant__Combustible_en_la_recepcion",
      "Razon_de_ingreso",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Reporte_filtro",
      "N_Orden_de_Trabajo_filtro",
      "Fecha_de_Entrega_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Aeronave_filtro",
      "Modelo_filtro",
      "Numero_de_Serie_filtro",
      "Cliente_filtro",
      "Se_realizo_evidencia_filmografica_filtro",
      "Cant__Combustible_en_la_recepcion_filtro",
      "Razon_de_ingreso_filtro",

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
      Reporte: "",
      N_Orden_de_Trabajo: "",
      Fecha_de_Entrega: null,
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Aeronave: "",
      Modelo: "",
      Numero_de_Serie: "",
      Cliente: "",
      Se_realizo_evidencia_filmografica: "",
      Cant__Combustible_en_la_recepcion: "",
      Razon_de_ingreso: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ReporteFilter: "",
      Reporte: "",
      ReporteMultiple: "",
      N_Orden_de_TrabajoFilter: "",
      N_Orden_de_Trabajo: "",
      N_Orden_de_TrabajoMultiple: "",
      fromFecha_de_Entrega: "",
      toFecha_de_Entrega: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      Se_realizo_evidencia_filmograficaFilter: "",
      Se_realizo_evidencia_filmografica: "",
      Se_realizo_evidencia_filmograficaMultiple: "",

    }
  };

  dataSource: Inspeccion_Entrada_AeronaveDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Inspeccion_Entrada_AeronaveDataSource;
  dataClipboard: any;

  constructor(
    private _Inspeccion_Entrada_AeronaveService: Inspeccion_Entrada_AeronaveService,
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
    this.dataSource = new Inspeccion_Entrada_AeronaveDataSource(
      this._Inspeccion_Entrada_AeronaveService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Inspeccion_Entrada_Aeronave)
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
    this.listConfig.filter.Reporte = "";
    this.listConfig.filter.N_Orden_de_Trabajo = "";
    this.listConfig.filter.Fecha_de_Entrega = undefined;
    this.listConfig.filter.Fecha_de_Registro = undefined;
    this.listConfig.filter.Hora_de_Registro = "";
    this.listConfig.filter.Usuario_que_Registra = "";
    this.listConfig.filter.Aeronave = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Numero_de_Serie = "";
    this.listConfig.filter.Cliente = "";
    this.listConfig.filter.Se_realizo_evidencia_filmografica = "";
    this.listConfig.filter.Cant__Combustible_en_la_recepcion = "";
    this.listConfig.filter.Razon_de_ingreso = "";

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

  remove(row: Inspeccion_Entrada_Aeronave) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Inspeccion_Entrada_AeronaveService
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
  ActionPrint(dataRow: Inspeccion_Entrada_Aeronave) {

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
,'Reporte'
,'N° Orden de Trabajo'
,'Fecha de Entrega'
,'Fecha de Registro'
,'Hora de Registro'
,'Usuario que Registra'
,'Matrícula'
,'Modelo'
,'Número de Serie'
,'Cliente'
,'¿Se realizó evidencia filmográfica?'
,'Cant. Combustible en la recepción'
,'Razón de ingreso'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Reporte_Crear_Reporte.No_Reporte
,x.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden
,x.Fecha_de_Entrega
,x.Fecha_de_Registro
,x.Hora_de_Registro
,x.Usuario_que_Registra_Spartan_User.Name
,x.Aeronave
,x.Modelo_Modelos.Descripcion
,x.Numero_de_Serie
,x.Cliente_Cliente.Razon_Social
,x.Se_realizo_evidencia_filmografica_Respuesta.Descripcion
,x.Cant__Combustible_en_la_recepcion
,x.Razon_de_ingreso
		  
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
    pdfMake.createPdf(pdfDefinition).download('Inspeccion_Entrada_Aeronave.pdf');
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
          this._Inspeccion_Entrada_AeronaveService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Inspeccion_Entrada_Aeronaves;
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
          this._Inspeccion_Entrada_AeronaveService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Inspeccion_Entrada_Aeronaves;
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
        'Reporte ': fields.Reporte_Crear_Reporte.No_Reporte,
        'N° Orden de Trabajo ': fields.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
        'Fecha de Entrega ': fields.Fecha_de_Entrega ? momentJS(fields.Fecha_de_Entrega).format('DD/MM/YYYY') : '',
        'Fecha de Registro ': fields.Fecha_de_Registro ? momentJS(fields.Fecha_de_Registro).format('DD/MM/YYYY') : '',
        'Hora de Registro ': fields.Hora_de_Registro,
        'Usuario que Registra ': fields.Usuario_que_Registra_Spartan_User.Name,
        'Matrícula ': fields.Aeronave,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'Número de Serie ': fields.Numero_de_Serie,
        'Cliente ': fields.Cliente_Cliente.Razon_Social,
        '¿Se realizó evidencia filmográfica? ': fields.Se_realizo_evidencia_filmografica_Respuesta.Descripcion,
        'Cant. Combustible en la recepción ': fields.Cant__Combustible_en_la_recepcion,
        'Razón de ingreso ': fields.Razon_de_ingreso,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Inspeccion_Entrada_Aeronave  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Reporte: x.Reporte_Crear_Reporte.No_Reporte,
      N_Orden_de_Trabajo: x.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
      Fecha_de_Entrega: x.Fecha_de_Entrega,
      Fecha_de_Registro: x.Fecha_de_Registro,
      Hora_de_Registro: x.Hora_de_Registro,
      Usuario_que_Registra: x.Usuario_que_Registra_Spartan_User.Name,
      Aeronave: x.Aeronave,
      Modelo: x.Modelo_Modelos.Descripcion,
      Numero_de_Serie: x.Numero_de_Serie,
      Cliente: x.Cliente_Cliente.Razon_Social,
      Se_realizo_evidencia_filmografica: x.Se_realizo_evidencia_filmografica_Respuesta.Descripcion,
      Cant__Combustible_en_la_recepcion: x.Cant__Combustible_en_la_recepcion,
      Razon_de_ingreso: x.Razon_de_ingreso,

    }));

    this.excelService.exportToCsv(result, 'Inspeccion_Entrada_Aeronave',  ['Folio'    ,'Reporte'  ,'N_Orden_de_Trabajo'  ,'Fecha_de_Entrega'  ,'Fecha_de_Registro'  ,'Hora_de_Registro'  ,'Usuario_que_Registra'  ,'Aeronave'  ,'Modelo'  ,'Numero_de_Serie'  ,'Cliente'  ,'Se_realizo_evidencia_filmografica'  ,'Cant__Combustible_en_la_recepcion'  ,'Razon_de_ingreso' ]);
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
    template += '          <th>Reporte</th>';
    template += '          <th>N° Orden de Trabajo</th>';
    template += '          <th>Fecha de Entrega</th>';
    template += '          <th>Fecha de Registro</th>';
    template += '          <th>Hora de Registro</th>';
    template += '          <th>Usuario que Registra</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Número de Serie</th>';
    template += '          <th>Cliente</th>';
    template += '          <th>¿Se realizó evidencia filmográfica?</th>';
    template += '          <th>Cant. Combustible en la recepción</th>';
    template += '          <th>Razón de ingreso</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Reporte_Crear_Reporte.No_Reporte + '</td>';
      template += '          <td>' + element.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.Fecha_de_Entrega + '</td>';
      template += '          <td>' + element.Fecha_de_Registro + '</td>';
      template += '          <td>' + element.Hora_de_Registro + '</td>';
      template += '          <td>' + element.Usuario_que_Registra_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Aeronave + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Numero_de_Serie + '</td>';
      template += '          <td>' + element.Cliente_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Se_realizo_evidencia_filmografica_Respuesta.Descripcion + '</td>';
      template += '          <td>' + element.Cant__Combustible_en_la_recepcion + '</td>';
      template += '          <td>' + element.Razon_de_ingreso + '</td>';
		  
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
	template += '\t Reporte';
	template += '\t N° Orden de Trabajo';
	template += '\t Fecha de Entrega';
	template += '\t Fecha de Registro';
	template += '\t Hora de Registro';
	template += '\t Usuario que Registra';
	template += '\t Matrícula';
	template += '\t Modelo';
	template += '\t Número de Serie';
	template += '\t Cliente';
	template += '\t ¿Se realizó evidencia filmográfica?';
	template += '\t Cant. Combustible en la recepción';
	template += '\t Razón de ingreso';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Reporte_Crear_Reporte.No_Reporte;
      template += '\t ' + element.N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden;
	  template += '\t ' + element.Fecha_de_Entrega;
	  template += '\t ' + element.Fecha_de_Registro;
	  template += '\t ' + element.Hora_de_Registro;
      template += '\t ' + element.Usuario_que_Registra_Spartan_User.Name;
	  template += '\t ' + element.Aeronave;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
	  template += '\t ' + element.Numero_de_Serie;
      template += '\t ' + element.Cliente_Cliente.Razon_Social;
      template += '\t ' + element.Se_realizo_evidencia_filmografica_Respuesta.Descripcion;
	  template += '\t ' + element.Cant__Combustible_en_la_recepcion;
	  template += '\t ' + element.Razon_de_ingreso;

	  template += '\n';
    });

    return template;
  }

}

export class Inspeccion_Entrada_AeronaveDataSource implements DataSource<Inspeccion_Entrada_Aeronave>
{
  private subject = new BehaviorSubject<Inspeccion_Entrada_Aeronave[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Inspeccion_Entrada_AeronaveService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Inspeccion_Entrada_Aeronave[]> {
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
              const longest = result.Inspeccion_Entrada_Aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Inspeccion_Entrada_Aeronaves);
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
      condition += " and Inspeccion_Entrada_Aeronave.Folio = " + data.filter.Folio;
    if (data.filter.Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.Reporte + "%' ";
    if (data.filter.N_Orden_de_Trabajo != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.N_Orden_de_Trabajo + "%' ";
    if (data.filter.Fecha_de_Entrega)
      condition += " and CONVERT(VARCHAR(10), Inspeccion_Entrada_Aeronave.Fecha_de_Entrega, 102)  = '" + moment(data.filter.Fecha_de_Entrega).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_Registro)
      condition += " and CONVERT(VARCHAR(10), Inspeccion_Entrada_Aeronave.Fecha_de_Registro, 102)  = '" + moment(data.filter.Fecha_de_Registro).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Registro != "")
      condition += " and Inspeccion_Entrada_Aeronave.Hora_de_Registro = '" + data.filter.Hora_de_Registro + "'";
    if (data.filter.Usuario_que_Registra != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra + "%' ";
    if (data.filter.Aeronave != "")
      condition += " and Inspeccion_Entrada_Aeronave.Aeronave like '%" + data.filter.Aeronave + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Numero_de_Serie != "")
      condition += " and Inspeccion_Entrada_Aeronave.Numero_de_Serie like '%" + data.filter.Numero_de_Serie + "%' ";
    if (data.filter.Cliente != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Cliente + "%' ";
    if (data.filter.Se_realizo_evidencia_filmografica != "")
      condition += " and Respuesta.Descripcion like '%" + data.filter.Se_realizo_evidencia_filmografica + "%' ";
    if (data.filter.Cant__Combustible_en_la_recepcion != "")
      condition += " and Inspeccion_Entrada_Aeronave.Cant__Combustible_en_la_recepcion like '%" + data.filter.Cant__Combustible_en_la_recepcion + "%' ";
    if (data.filter.Razon_de_ingreso != "")
      condition += " and Inspeccion_Entrada_Aeronave.Razon_de_ingreso like '%" + data.filter.Razon_de_ingreso + "%' ";

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
        sort = " Inspeccion_Entrada_Aeronave.Folio " + data.sortDirecction;
        break;
      case "Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "N_Orden_de_Trabajo":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "Fecha_de_Entrega":
        sort = " Inspeccion_Entrada_Aeronave.Fecha_de_Entrega " + data.sortDirecction;
        break;
      case "Fecha_de_Registro":
        sort = " Inspeccion_Entrada_Aeronave.Fecha_de_Registro " + data.sortDirecction;
        break;
      case "Hora_de_Registro":
        sort = " Inspeccion_Entrada_Aeronave.Hora_de_Registro " + data.sortDirecction;
        break;
      case "Usuario_que_Registra":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Aeronave":
        sort = " Inspeccion_Entrada_Aeronave.Aeronave " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Numero_de_Serie":
        sort = " Inspeccion_Entrada_Aeronave.Numero_de_Serie " + data.sortDirecction;
        break;
      case "Cliente":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Se_realizo_evidencia_filmografica":
        sort = " Respuesta.Descripcion " + data.sortDirecction;
        break;
      case "Cant__Combustible_en_la_recepcion":
        sort = " Inspeccion_Entrada_Aeronave.Cant__Combustible_en_la_recepcion " + data.sortDirecction;
        break;
      case "Razon_de_ingreso":
        sort = " Inspeccion_Entrada_Aeronave.Razon_de_ingreso " + data.sortDirecction;
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
        condition += " AND Inspeccion_Entrada_Aeronave.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Inspeccion_Entrada_Aeronave.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Reporte != 'undefined' && data.filterAdvanced.Reporte)) {
      switch (data.filterAdvanced.ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.ReporteMultiple != null && data.filterAdvanced.ReporteMultiple.length > 0) {
      var Reporteds = data.filterAdvanced.ReporteMultiple.join(",");
      condition += " AND Inspeccion_Entrada_Aeronave.Reporte In (" + Reporteds + ")";
    }
    if ((typeof data.filterAdvanced.N_Orden_de_Trabajo != 'undefined' && data.filterAdvanced.N_Orden_de_Trabajo)) {
      switch (data.filterAdvanced.N_Orden_de_TrabajoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.N_Orden_de_Trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.N_Orden_de_Trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.N_Orden_de_Trabajo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.N_Orden_de_Trabajo + "'";
          break;
      }
    } else if (data.filterAdvanced.N_Orden_de_TrabajoMultiple != null && data.filterAdvanced.N_Orden_de_TrabajoMultiple.length > 0) {
      var N_Orden_de_Trabajods = data.filterAdvanced.N_Orden_de_TrabajoMultiple.join(",");
      condition += " AND Inspeccion_Entrada_Aeronave.N_Orden_de_Trabajo In (" + N_Orden_de_Trabajods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Entrega != 'undefined' && data.filterAdvanced.fromFecha_de_Entrega)
	|| (typeof data.filterAdvanced.toFecha_de_Entrega != 'undefined' && data.filterAdvanced.toFecha_de_Entrega)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Entrega != 'undefined' && data.filterAdvanced.fromFecha_de_Entrega) 
        condition += " and CONVERT(VARCHAR(10), Inspeccion_Entrada_Aeronave.Fecha_de_Entrega, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Entrega).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Entrega != 'undefined' && data.filterAdvanced.toFecha_de_Entrega) 
        condition += " and CONVERT(VARCHAR(10), Inspeccion_Entrada_Aeronave.Fecha_de_Entrega, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Entrega).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
	|| (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro) 
        condition += " and CONVERT(VARCHAR(10), Inspeccion_Entrada_Aeronave.Fecha_de_Registro, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Registro).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro) 
        condition += " and CONVERT(VARCHAR(10), Inspeccion_Entrada_Aeronave.Fecha_de_Registro, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Registro).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
	|| (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)) 
	{
		if (typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro) 
			condition += " and Inspeccion_Entrada_Aeronave.Hora_de_Registro >= '" + data.filterAdvanced.fromHora_de_Registro + "'";
      
		if (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro) 
			condition += " and Inspeccion_Entrada_Aeronave.Hora_de_Registro <= '" + data.filterAdvanced.toHora_de_Registro + "'";
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
      condition += " AND Inspeccion_Entrada_Aeronave.Usuario_que_Registra In (" + Usuario_que_Registrads + ")";
    }
    switch (data.filterAdvanced.AeronaveFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Inspeccion_Entrada_Aeronave.Aeronave LIKE '" + data.filterAdvanced.Aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Inspeccion_Entrada_Aeronave.Aeronave LIKE '%" + data.filterAdvanced.Aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Inspeccion_Entrada_Aeronave.Aeronave LIKE '%" + data.filterAdvanced.Aeronave + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Inspeccion_Entrada_Aeronave.Aeronave = '" + data.filterAdvanced.Aeronave + "'";
        break;
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
      condition += " AND Inspeccion_Entrada_Aeronave.Modelo In (" + Modelods + ")";
    }
    switch (data.filterAdvanced.Numero_de_SerieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Inspeccion_Entrada_Aeronave.Numero_de_Serie LIKE '" + data.filterAdvanced.Numero_de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Inspeccion_Entrada_Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.Numero_de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Inspeccion_Entrada_Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.Numero_de_Serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Inspeccion_Entrada_Aeronave.Numero_de_Serie = '" + data.filterAdvanced.Numero_de_Serie + "'";
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
      condition += " AND Inspeccion_Entrada_Aeronave.Cliente In (" + Clienteds + ")";
    }
    if ((typeof data.filterAdvanced.Se_realizo_evidencia_filmografica != 'undefined' && data.filterAdvanced.Se_realizo_evidencia_filmografica)) {
      switch (data.filterAdvanced.Se_realizo_evidencia_filmograficaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Respuesta.Descripcion LIKE '" + data.filterAdvanced.Se_realizo_evidencia_filmografica + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Se_realizo_evidencia_filmografica + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Se_realizo_evidencia_filmografica + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Respuesta.Descripcion = '" + data.filterAdvanced.Se_realizo_evidencia_filmografica + "'";
          break;
      }
    } else if (data.filterAdvanced.Se_realizo_evidencia_filmograficaMultiple != null && data.filterAdvanced.Se_realizo_evidencia_filmograficaMultiple.length > 0) {
      var Se_realizo_evidencia_filmograficads = data.filterAdvanced.Se_realizo_evidencia_filmograficaMultiple.join(",");
      condition += " AND Inspeccion_Entrada_Aeronave.Se_realizo_evidencia_filmografica In (" + Se_realizo_evidencia_filmograficads + ")";
    }
    switch (data.filterAdvanced.Cant__Combustible_en_la_recepcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Inspeccion_Entrada_Aeronave.Cant__Combustible_en_la_recepcion LIKE '" + data.filterAdvanced.Cant__Combustible_en_la_recepcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Inspeccion_Entrada_Aeronave.Cant__Combustible_en_la_recepcion LIKE '%" + data.filterAdvanced.Cant__Combustible_en_la_recepcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Inspeccion_Entrada_Aeronave.Cant__Combustible_en_la_recepcion LIKE '%" + data.filterAdvanced.Cant__Combustible_en_la_recepcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Inspeccion_Entrada_Aeronave.Cant__Combustible_en_la_recepcion = '" + data.filterAdvanced.Cant__Combustible_en_la_recepcion + "'";
        break;
    }
    switch (data.filterAdvanced.Razon_de_ingresoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Inspeccion_Entrada_Aeronave.Razon_de_ingreso LIKE '" + data.filterAdvanced.Razon_de_ingreso + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Inspeccion_Entrada_Aeronave.Razon_de_ingreso LIKE '%" + data.filterAdvanced.Razon_de_ingreso + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Inspeccion_Entrada_Aeronave.Razon_de_ingreso LIKE '%" + data.filterAdvanced.Razon_de_ingreso + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Inspeccion_Entrada_Aeronave.Razon_de_ingreso = '" + data.filterAdvanced.Razon_de_ingreso + "'";
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
              const longest = result.Inspeccion_Entrada_Aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Inspeccion_Entrada_Aeronaves);
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
