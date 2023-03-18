import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Configuracion_de_NotificacionService } from "src/app/api-services/Configuracion_de_Notificacion.service";
import { Configuracion_de_Notificacion } from "src/app/models/Configuracion_de_Notificacion";
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
import { Configuracion_de_NotificacionIndexRules } from 'src/app/shared/businessRules/Configuracion_de_Notificacion-index-rules';
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
  selector: "app-list-Configuracion_de_Notificacion",
  templateUrl: "./list-Configuracion_de_Notificacion.component.html",
  styleUrls: ["./list-Configuracion_de_Notificacion.component.scss"],
})
export class ListConfiguracion_de_NotificacionComponent extends Configuracion_de_NotificacionIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Fecha_de_Registro",
    "Hora_de_Registro",
    "Usuario_que_Registra",
    "Nombre_de_la_Notificacion",
    "Es_Permanente",
    "Funcionalidad",
    "Tipo_de_Notificacion",
    "Tipo_de_Accion",
    "Tipo_de_Recordatorio",
    "Fecha_de_Inicio",
    "Tiene_Fecha_de_Finalizacion_Definida",
    "Cantidad_de_Dias_a_Validar",
    "Fecha_a_Validar",
    "Fecha_Fin",
    "Estatus",
    "Notificar__por_Correo",
    "Texto_que_llevara_el_Correo",
    "Notificacion_push",
    "Texto_a_Mostrar_en_la_Notificacion_push",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Nombre_de_la_Notificacion",
      "Es_Permanente",
      "Funcionalidad",
      "Tipo_de_Notificacion",
      "Tipo_de_Accion",
      "Tipo_de_Recordatorio",
      "Fecha_de_Inicio",
      "Tiene_Fecha_de_Finalizacion_Definida",
      "Cantidad_de_Dias_a_Validar",
      "Fecha_a_Validar",
      "Fecha_Fin",
      "Estatus",
      "Notificar__por_Correo",
      "Texto_que_llevara_el_Correo",
      "Notificacion_push",
      "Texto_a_Mostrar_en_la_Notificacion_push",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Nombre_de_la_Notificacion_filtro",
      "Es_Permanente_filtro",
      "Funcionalidad_filtro",
      "Tipo_de_Notificacion_filtro",
      "Tipo_de_Accion_filtro",
      "Tipo_de_Recordatorio_filtro",
      "Fecha_de_Inicio_filtro",
      "Tiene_Fecha_de_Finalizacion_Definida_filtro",
      "Cantidad_de_Dias_a_Validar_filtro",
      "Fecha_a_Validar_filtro",
      "Fecha_Fin_filtro",
      "Estatus_filtro",
      "Notificar__por_Correo_filtro",
      "Texto_que_llevara_el_Correo_filtro",
      "Notificacion_push_filtro",
      "Texto_a_Mostrar_en_la_Notificacion_push_filtro",

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
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Nombre_de_la_Notificacion: "",
      Es_Permanente: "",
      Funcionalidad: "",
      Tipo_de_Notificacion: "",
      Tipo_de_Accion: "",
      Tipo_de_Recordatorio: "",
      Fecha_de_Inicio: null,
      Tiene_Fecha_de_Finalizacion_Definida: "",
      Cantidad_de_Dias_a_Validar: "",
      Fecha_a_Validar: "",
      Fecha_Fin: null,
      Estatus: "",
      Notificar__por_Correo: "",
      Texto_que_llevara_el_Correo: "",
      Notificacion_push: "",
      Texto_a_Mostrar_en_la_Notificacion_push: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      FuncionalidadFilter: "",
      Funcionalidad: "",
      FuncionalidadMultiple: "",
      Tipo_de_NotificacionFilter: "",
      Tipo_de_Notificacion: "",
      Tipo_de_NotificacionMultiple: "",
      Tipo_de_AccionFilter: "",
      Tipo_de_Accion: "",
      Tipo_de_AccionMultiple: "",
      Tipo_de_RecordatorioFilter: "",
      Tipo_de_Recordatorio: "",
      Tipo_de_RecordatorioMultiple: "",
      fromFecha_de_Inicio: "",
      toFecha_de_Inicio: "",
      fromCantidad_de_Dias_a_Validar: "",
      toCantidad_de_Dias_a_Validar: "",
      Fecha_a_ValidarFilter: "",
      Fecha_a_Validar: "",
      Fecha_a_ValidarMultiple: "",
      fromFecha_Fin: "",
      toFecha_Fin: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

    }
  };

  dataSource: Configuracion_de_NotificacionDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Configuracion_de_NotificacionDataSource;
  dataClipboard: any;

  constructor(
    private _Configuracion_de_NotificacionService: Configuracion_de_NotificacionService,
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
    this.dataSource = new Configuracion_de_NotificacionDataSource(
      this._Configuracion_de_NotificacionService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Configuracion_de_Notificacion)
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
    this.listConfig.filter.Fecha_de_Registro = undefined;
    this.listConfig.filter.Hora_de_Registro = "";
    this.listConfig.filter.Usuario_que_Registra = "";
    this.listConfig.filter.Nombre_de_la_Notificacion = "";
    this.listConfig.filter.Es_Permanente = undefined;
    this.listConfig.filter.Funcionalidad = "";
    this.listConfig.filter.Tipo_de_Notificacion = "";
    this.listConfig.filter.Tipo_de_Accion = "";
    this.listConfig.filter.Tipo_de_Recordatorio = "";
    this.listConfig.filter.Fecha_de_Inicio = undefined;
    this.listConfig.filter.Tiene_Fecha_de_Finalizacion_Definida = undefined;
    this.listConfig.filter.Cantidad_de_Dias_a_Validar = "";
    this.listConfig.filter.Fecha_a_Validar = "";
    this.listConfig.filter.Fecha_Fin = undefined;
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Notificar__por_Correo = undefined;
    this.listConfig.filter.Texto_que_llevara_el_Correo = "";
    this.listConfig.filter.Notificacion_push = undefined;
    this.listConfig.filter.Texto_a_Mostrar_en_la_Notificacion_push = "";

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

  remove(row: Configuracion_de_Notificacion) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Configuracion_de_NotificacionService
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
  ActionPrint(dataRow: Configuracion_de_Notificacion) {

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
,'Nombre de la Notificación'
,'¿Es Permanente?'
,'Funcionalidad'
,'Tipo de Notificación'
,'Tipo de Acción'
,'Tipo de Recordatorio'
,'Fecha de Inicio'
,'¿Tiene Fecha de Finalización Definida?'
,'Cantidad de Días a Validar'
,'Fecha a Validar'
,'Fecha Fin'
,'Estatus'
,'¿Notificar  por Correo?'
,'Texto que llevara el Correo'
,'¿Notificación push?'
,'Texto a Mostrar en la Notificación push'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Fecha_de_Registro
,x.Hora_de_Registro
,x.Usuario_que_Registra_Spartan_User.Name
,x.Nombre_de_la_Notificacion
,x.Es_Permanente
,x.Funcionalidad_Funcionalidades_para_Notificacion.Funcionalidad
,x.Tipo_de_Notificacion_Tipo_de_Notificacion.Descripcion
,x.Tipo_de_Accion_Tipo_de_Accion_Notificacion.Descripcion
,x.Tipo_de_Recordatorio_Tipo_de_Recordatorio_Notificacion.Descripcion
,x.Fecha_de_Inicio
,x.Tiene_Fecha_de_Finalizacion_Definida
,x.Cantidad_de_Dias_a_Validar
,x.Fecha_a_Validar_Nombre_del_Campo_en_MS.Descripcion
,x.Fecha_Fin
,x.Estatus_Estatus_Notificacion.Descripcion
,x.Notificar__por_Correo
,x.Texto_que_llevara_el_Correo
,x.Notificacion_push
,x.Texto_a_Mostrar_en_la_Notificacion_push
		  
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
    pdfMake.createPdf(pdfDefinition).download('Configuracion_de_Notificacion.pdf');
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
          this._Configuracion_de_NotificacionService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Configuracion_de_Notificacions;
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
          this._Configuracion_de_NotificacionService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Configuracion_de_Notificacions;
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
        'Fecha de Registro ': fields.Fecha_de_Registro ? momentJS(fields.Fecha_de_Registro).format('DD/MM/YYYY') : '',
        'Hora de Registro ': fields.Hora_de_Registro,
        'Usuario que Registra ': fields.Usuario_que_Registra_Spartan_User.Name,
        'Nombre de la Notificación ': fields.Nombre_de_la_Notificacion,
        'Es_Permanente ': fields.Es_Permanente ? 'SI' : 'NO',
        'Funcionalidad ': fields.Funcionalidad_Funcionalidades_para_Notificacion.Funcionalidad,
        'Tipo de Notificación ': fields.Tipo_de_Notificacion_Tipo_de_Notificacion.Descripcion,
        'Tipo de Acción ': fields.Tipo_de_Accion_Tipo_de_Accion_Notificacion.Descripcion,
        'Tipo de Recordatorio ': fields.Tipo_de_Recordatorio_Tipo_de_Recordatorio_Notificacion.Descripcion,
        'Fecha de Inicio ': fields.Fecha_de_Inicio ? momentJS(fields.Fecha_de_Inicio).format('DD/MM/YYYY') : '',
        'Tiene_Fecha_de_Finalizacion_Definida ': fields.Tiene_Fecha_de_Finalizacion_Definida ? 'SI' : 'NO',
        'Cantidad de Días a Validar ': fields.Cantidad_de_Dias_a_Validar,
        'Fecha a Validar ': fields.Fecha_a_Validar_Nombre_del_Campo_en_MS.Descripcion,
        'Fecha Fin ': fields.Fecha_Fin ? momentJS(fields.Fecha_Fin).format('DD/MM/YYYY') : '',
        'Estatus ': fields.Estatus_Estatus_Notificacion.Descripcion,
        'Notificar__por_Correo ': fields.Notificar__por_Correo ? 'SI' : 'NO',
        'Texto que llevara el Correo ': fields.Texto_que_llevara_el_Correo,
        'Notificacion_push ': fields.Notificacion_push ? 'SI' : 'NO',
        'Texto a Mostrar en la Notificación push ': fields.Texto_a_Mostrar_en_la_Notificacion_push,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Configuracion_de_Notificacion  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Fecha_de_Registro: x.Fecha_de_Registro,
      Hora_de_Registro: x.Hora_de_Registro,
      Usuario_que_Registra: x.Usuario_que_Registra_Spartan_User.Name,
      Nombre_de_la_Notificacion: x.Nombre_de_la_Notificacion,
      Es_Permanente: x.Es_Permanente,
      Funcionalidad: x.Funcionalidad_Funcionalidades_para_Notificacion.Funcionalidad,
      Tipo_de_Notificacion: x.Tipo_de_Notificacion_Tipo_de_Notificacion.Descripcion,
      Tipo_de_Accion: x.Tipo_de_Accion_Tipo_de_Accion_Notificacion.Descripcion,
      Tipo_de_Recordatorio: x.Tipo_de_Recordatorio_Tipo_de_Recordatorio_Notificacion.Descripcion,
      Fecha_de_Inicio: x.Fecha_de_Inicio,
      Tiene_Fecha_de_Finalizacion_Definida: x.Tiene_Fecha_de_Finalizacion_Definida,
      Cantidad_de_Dias_a_Validar: x.Cantidad_de_Dias_a_Validar,
      Fecha_a_Validar: x.Fecha_a_Validar_Nombre_del_Campo_en_MS.Descripcion,
      Fecha_Fin: x.Fecha_Fin,
      Estatus: x.Estatus_Estatus_Notificacion.Descripcion,
      Notificar__por_Correo: x.Notificar__por_Correo,
      Texto_que_llevara_el_Correo: x.Texto_que_llevara_el_Correo,
      Notificacion_push: x.Notificacion_push,
      Texto_a_Mostrar_en_la_Notificacion_push: x.Texto_a_Mostrar_en_la_Notificacion_push,

    }));

    this.excelService.exportToCsv(result, 'Configuracion_de_Notificacion',  ['Folio'    ,'Fecha_de_Registro'  ,'Hora_de_Registro'  ,'Usuario_que_Registra'  ,'Nombre_de_la_Notificacion'  ,'Es_Permanente'  ,'Funcionalidad'  ,'Tipo_de_Notificacion'  ,'Tipo_de_Accion'  ,'Tipo_de_Recordatorio'  ,'Fecha_de_Inicio'  ,'Tiene_Fecha_de_Finalizacion_Definida'  ,'Cantidad_de_Dias_a_Validar'  ,'Fecha_a_Validar'  ,'Fecha_Fin'  ,'Estatus'  ,'Notificar__por_Correo'  ,'Texto_que_llevara_el_Correo'  ,'Notificacion_push'  ,'Texto_a_Mostrar_en_la_Notificacion_push' ]);
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
    template += '          <th>Nombre de la Notificación</th>';
    template += '          <th>¿Es Permanente?</th>';
    template += '          <th>Funcionalidad</th>';
    template += '          <th>Tipo de Notificación</th>';
    template += '          <th>Tipo de Acción</th>';
    template += '          <th>Tipo de Recordatorio</th>';
    template += '          <th>Fecha de Inicio</th>';
    template += '          <th>¿Tiene Fecha de Finalización Definida?</th>';
    template += '          <th>Cantidad de Días a Validar</th>';
    template += '          <th>Fecha a Validar</th>';
    template += '          <th>Fecha Fin</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>¿Notificar  por Correo?</th>';
    template += '          <th>Texto que llevara el Correo</th>';
    template += '          <th>¿Notificación push?</th>';
    template += '          <th>Texto a Mostrar en la Notificación push</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Fecha_de_Registro + '</td>';
      template += '          <td>' + element.Hora_de_Registro + '</td>';
      template += '          <td>' + element.Usuario_que_Registra_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Nombre_de_la_Notificacion + '</td>';
      template += '          <td>' + element.Es_Permanente + '</td>';
      template += '          <td>' + element.Funcionalidad_Funcionalidades_para_Notificacion.Funcionalidad + '</td>';
      template += '          <td>' + element.Tipo_de_Notificacion_Tipo_de_Notificacion.Descripcion + '</td>';
      template += '          <td>' + element.Tipo_de_Accion_Tipo_de_Accion_Notificacion.Descripcion + '</td>';
      template += '          <td>' + element.Tipo_de_Recordatorio_Tipo_de_Recordatorio_Notificacion.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_de_Inicio + '</td>';
      template += '          <td>' + element.Tiene_Fecha_de_Finalizacion_Definida + '</td>';
      template += '          <td>' + element.Cantidad_de_Dias_a_Validar + '</td>';
      template += '          <td>' + element.Fecha_a_Validar_Nombre_del_Campo_en_MS.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_Fin + '</td>';
      template += '          <td>' + element.Estatus_Estatus_Notificacion.Descripcion + '</td>';
      template += '          <td>' + element.Notificar__por_Correo + '</td>';
      template += '          <td>' + element.Texto_que_llevara_el_Correo + '</td>';
      template += '          <td>' + element.Notificacion_push + '</td>';
      template += '          <td>' + element.Texto_a_Mostrar_en_la_Notificacion_push + '</td>';
		  
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
	template += '\t Nombre de la Notificación';
	template += '\t ¿Es Permanente?';
	template += '\t Funcionalidad';
	template += '\t Tipo de Notificación';
	template += '\t Tipo de Acción';
	template += '\t Tipo de Recordatorio';
	template += '\t Fecha de Inicio';
	template += '\t ¿Tiene Fecha de Finalización Definida?';
	template += '\t Cantidad de Días a Validar';
	template += '\t Fecha a Validar';
	template += '\t Fecha Fin';
	template += '\t Estatus';
	template += '\t ¿Notificar  por Correo?';
	template += '\t Texto que llevara el Correo';
	template += '\t ¿Notificación push?';
	template += '\t Texto a Mostrar en la Notificación push';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Fecha_de_Registro;
	  template += '\t ' + element.Hora_de_Registro;
      template += '\t ' + element.Usuario_que_Registra_Spartan_User.Name;
	  template += '\t ' + element.Nombre_de_la_Notificacion;
	  template += '\t ' + element.Es_Permanente;
      template += '\t ' + element.Funcionalidad_Funcionalidades_para_Notificacion.Funcionalidad;
      template += '\t ' + element.Tipo_de_Notificacion_Tipo_de_Notificacion.Descripcion;
      template += '\t ' + element.Tipo_de_Accion_Tipo_de_Accion_Notificacion.Descripcion;
      template += '\t ' + element.Tipo_de_Recordatorio_Tipo_de_Recordatorio_Notificacion.Descripcion;
	  template += '\t ' + element.Fecha_de_Inicio;
	  template += '\t ' + element.Tiene_Fecha_de_Finalizacion_Definida;
	  template += '\t ' + element.Cantidad_de_Dias_a_Validar;
      template += '\t ' + element.Fecha_a_Validar_Nombre_del_Campo_en_MS.Descripcion;
	  template += '\t ' + element.Fecha_Fin;
      template += '\t ' + element.Estatus_Estatus_Notificacion.Descripcion;
	  template += '\t ' + element.Notificar__por_Correo;
	  template += '\t ' + element.Texto_que_llevara_el_Correo;
	  template += '\t ' + element.Notificacion_push;
	  template += '\t ' + element.Texto_a_Mostrar_en_la_Notificacion_push;

	  template += '\n';
    });

    return template;
  }

}

export class Configuracion_de_NotificacionDataSource implements DataSource<Configuracion_de_Notificacion>
{
  private subject = new BehaviorSubject<Configuracion_de_Notificacion[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Configuracion_de_NotificacionService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Configuracion_de_Notificacion[]> {
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
              const longest = result.Configuracion_de_Notificacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Configuracion_de_Notificacions);
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
      condition += " and Configuracion_de_Notificacion.Folio = " + data.filter.Folio;
    if (data.filter.Fecha_de_Registro)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_Notificacion.Fecha_de_Registro, 102)  = '" + moment(data.filter.Fecha_de_Registro).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Registro != "")
      condition += " and Configuracion_de_Notificacion.Hora_de_Registro = '" + data.filter.Hora_de_Registro + "'";
    if (data.filter.Usuario_que_Registra != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra + "%' ";
    if (data.filter.Nombre_de_la_Notificacion != "")
      condition += " and Configuracion_de_Notificacion.Nombre_de_la_Notificacion like '%" + data.filter.Nombre_de_la_Notificacion + "%' ";
    if (data.filter.Es_Permanente && data.filter.Es_Permanente != "2") {
      if (data.filter.Es_Permanente == "0" || data.filter.Es_Permanente == "") {
        condition += " and (Configuracion_de_Notificacion.Es_Permanente = 0 or Configuracion_de_Notificacion.Es_Permanente is null)";
      } else {
        condition += " and Configuracion_de_Notificacion.Es_Permanente = 1";
      }
    }
    if (data.filter.Funcionalidad != "")
      condition += " and Funcionalidades_para_Notificacion.Funcionalidad like '%" + data.filter.Funcionalidad + "%' ";
    if (data.filter.Tipo_de_Notificacion != "")
      condition += " and Tipo_de_Notificacion.Descripcion like '%" + data.filter.Tipo_de_Notificacion + "%' ";
    if (data.filter.Tipo_de_Accion != "")
      condition += " and Tipo_de_Accion_Notificacion.Descripcion like '%" + data.filter.Tipo_de_Accion + "%' ";
    if (data.filter.Tipo_de_Recordatorio != "")
      condition += " and Tipo_de_Recordatorio_Notificacion.Descripcion like '%" + data.filter.Tipo_de_Recordatorio + "%' ";
    if (data.filter.Fecha_de_Inicio)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_Notificacion.Fecha_de_Inicio, 102)  = '" + moment(data.filter.Fecha_de_Inicio).format("YYYY.MM.DD") + "'";
    if (data.filter.Tiene_Fecha_de_Finalizacion_Definida && data.filter.Tiene_Fecha_de_Finalizacion_Definida != "2") {
      if (data.filter.Tiene_Fecha_de_Finalizacion_Definida == "0" || data.filter.Tiene_Fecha_de_Finalizacion_Definida == "") {
        condition += " and (Configuracion_de_Notificacion.Tiene_Fecha_de_Finalizacion_Definida = 0 or Configuracion_de_Notificacion.Tiene_Fecha_de_Finalizacion_Definida is null)";
      } else {
        condition += " and Configuracion_de_Notificacion.Tiene_Fecha_de_Finalizacion_Definida = 1";
      }
    }
    if (data.filter.Cantidad_de_Dias_a_Validar != "")
      condition += " and Configuracion_de_Notificacion.Cantidad_de_Dias_a_Validar = " + data.filter.Cantidad_de_Dias_a_Validar;
    if (data.filter.Fecha_a_Validar != "")
      condition += " and Nombre_del_Campo_en_MS.Descripcion like '%" + data.filter.Fecha_a_Validar + "%' ";
    if (data.filter.Fecha_Fin)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_Notificacion.Fecha_Fin, 102)  = '" + moment(data.filter.Fecha_Fin).format("YYYY.MM.DD") + "'";
    if (data.filter.Estatus != "")
      condition += " and Estatus_Notificacion.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Notificar__por_Correo && data.filter.Notificar__por_Correo != "2") {
      if (data.filter.Notificar__por_Correo == "0" || data.filter.Notificar__por_Correo == "") {
        condition += " and (Configuracion_de_Notificacion.Notificar__por_Correo = 0 or Configuracion_de_Notificacion.Notificar__por_Correo is null)";
      } else {
        condition += " and Configuracion_de_Notificacion.Notificar__por_Correo = 1";
      }
    }
    if (data.filter.Texto_que_llevara_el_Correo != "")
      condition += " and Configuracion_de_Notificacion.Texto_que_llevara_el_Correo like '%" + data.filter.Texto_que_llevara_el_Correo + "%' ";
    if (data.filter.Notificacion_push && data.filter.Notificacion_push != "2") {
      if (data.filter.Notificacion_push == "0" || data.filter.Notificacion_push == "") {
        condition += " and (Configuracion_de_Notificacion.Notificacion_push = 0 or Configuracion_de_Notificacion.Notificacion_push is null)";
      } else {
        condition += " and Configuracion_de_Notificacion.Notificacion_push = 1";
      }
    }
    if (data.filter.Texto_a_Mostrar_en_la_Notificacion_push != "")
      condition += " and Configuracion_de_Notificacion.Texto_a_Mostrar_en_la_Notificacion_push like '%" + data.filter.Texto_a_Mostrar_en_la_Notificacion_push + "%' ";

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
        sort = " Configuracion_de_Notificacion.Folio " + data.sortDirecction;
        break;
      case "Fecha_de_Registro":
        sort = " Configuracion_de_Notificacion.Fecha_de_Registro " + data.sortDirecction;
        break;
      case "Hora_de_Registro":
        sort = " Configuracion_de_Notificacion.Hora_de_Registro " + data.sortDirecction;
        break;
      case "Usuario_que_Registra":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Nombre_de_la_Notificacion":
        sort = " Configuracion_de_Notificacion.Nombre_de_la_Notificacion " + data.sortDirecction;
        break;
      case "Es_Permanente":
        sort = " Configuracion_de_Notificacion.Es_Permanente " + data.sortDirecction;
        break;
      case "Funcionalidad":
        sort = " Funcionalidades_para_Notificacion.Funcionalidad " + data.sortDirecction;
        break;
      case "Tipo_de_Notificacion":
        sort = " Tipo_de_Notificacion.Descripcion " + data.sortDirecction;
        break;
      case "Tipo_de_Accion":
        sort = " Tipo_de_Accion_Notificacion.Descripcion " + data.sortDirecction;
        break;
      case "Tipo_de_Recordatorio":
        sort = " Tipo_de_Recordatorio_Notificacion.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_de_Inicio":
        sort = " Configuracion_de_Notificacion.Fecha_de_Inicio " + data.sortDirecction;
        break;
      case "Tiene_Fecha_de_Finalizacion_Definida":
        sort = " Configuracion_de_Notificacion.Tiene_Fecha_de_Finalizacion_Definida " + data.sortDirecction;
        break;
      case "Cantidad_de_Dias_a_Validar":
        sort = " Configuracion_de_Notificacion.Cantidad_de_Dias_a_Validar " + data.sortDirecction;
        break;
      case "Fecha_a_Validar":
        sort = " Nombre_del_Campo_en_MS.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_Fin":
        sort = " Configuracion_de_Notificacion.Fecha_Fin " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_Notificacion.Descripcion " + data.sortDirecction;
        break;
      case "Notificar__por_Correo":
        sort = " Configuracion_de_Notificacion.Notificar__por_Correo " + data.sortDirecction;
        break;
      case "Texto_que_llevara_el_Correo":
        sort = " Configuracion_de_Notificacion.Texto_que_llevara_el_Correo " + data.sortDirecction;
        break;
      case "Notificacion_push":
        sort = " Configuracion_de_Notificacion.Notificacion_push " + data.sortDirecction;
        break;
      case "Texto_a_Mostrar_en_la_Notificacion_push":
        sort = " Configuracion_de_Notificacion.Texto_a_Mostrar_en_la_Notificacion_push " + data.sortDirecction;
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
        condition += " AND Configuracion_de_Notificacion.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Configuracion_de_Notificacion.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
	|| (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_Notificacion.Fecha_de_Registro, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Registro).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_Notificacion.Fecha_de_Registro, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Registro).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
	|| (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)) 
	{
		if (typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro) 
			condition += " and Configuracion_de_Notificacion.Hora_de_Registro >= '" + data.filterAdvanced.fromHora_de_Registro + "'";
      
		if (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro) 
			condition += " and Configuracion_de_Notificacion.Hora_de_Registro <= '" + data.filterAdvanced.toHora_de_Registro + "'";
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
      condition += " AND Configuracion_de_Notificacion.Usuario_que_Registra In (" + Usuario_que_Registrads + ")";
    }
    switch (data.filterAdvanced.Nombre_de_la_NotificacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_Notificacion.Nombre_de_la_Notificacion LIKE '" + data.filterAdvanced.Nombre_de_la_Notificacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_Notificacion.Nombre_de_la_Notificacion LIKE '%" + data.filterAdvanced.Nombre_de_la_Notificacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_Notificacion.Nombre_de_la_Notificacion LIKE '%" + data.filterAdvanced.Nombre_de_la_Notificacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_Notificacion.Nombre_de_la_Notificacion = '" + data.filterAdvanced.Nombre_de_la_Notificacion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Funcionalidad != 'undefined' && data.filterAdvanced.Funcionalidad)) {
      switch (data.filterAdvanced.FuncionalidadFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Funcionalidades_para_Notificacion.Funcionalidad LIKE '" + data.filterAdvanced.Funcionalidad + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Funcionalidades_para_Notificacion.Funcionalidad LIKE '%" + data.filterAdvanced.Funcionalidad + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Funcionalidades_para_Notificacion.Funcionalidad LIKE '%" + data.filterAdvanced.Funcionalidad + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Funcionalidades_para_Notificacion.Funcionalidad = '" + data.filterAdvanced.Funcionalidad + "'";
          break;
      }
    } else if (data.filterAdvanced.FuncionalidadMultiple != null && data.filterAdvanced.FuncionalidadMultiple.length > 0) {
      var Funcionalidadds = data.filterAdvanced.FuncionalidadMultiple.join(",");
      condition += " AND Configuracion_de_Notificacion.Funcionalidad In (" + Funcionalidadds + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_Notificacion != 'undefined' && data.filterAdvanced.Tipo_de_Notificacion)) {
      switch (data.filterAdvanced.Tipo_de_NotificacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Notificacion.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Notificacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Notificacion.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Notificacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Notificacion.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Notificacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Notificacion.Descripcion = '" + data.filterAdvanced.Tipo_de_Notificacion + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_NotificacionMultiple != null && data.filterAdvanced.Tipo_de_NotificacionMultiple.length > 0) {
      var Tipo_de_Notificacionds = data.filterAdvanced.Tipo_de_NotificacionMultiple.join(",");
      condition += " AND Configuracion_de_Notificacion.Tipo_de_Notificacion In (" + Tipo_de_Notificacionds + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_Accion != 'undefined' && data.filterAdvanced.Tipo_de_Accion)) {
      switch (data.filterAdvanced.Tipo_de_AccionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Accion_Notificacion.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Accion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Accion_Notificacion.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Accion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Accion_Notificacion.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Accion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Accion_Notificacion.Descripcion = '" + data.filterAdvanced.Tipo_de_Accion + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_AccionMultiple != null && data.filterAdvanced.Tipo_de_AccionMultiple.length > 0) {
      var Tipo_de_Accionds = data.filterAdvanced.Tipo_de_AccionMultiple.join(",");
      condition += " AND Configuracion_de_Notificacion.Tipo_de_Accion In (" + Tipo_de_Accionds + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_Recordatorio != 'undefined' && data.filterAdvanced.Tipo_de_Recordatorio)) {
      switch (data.filterAdvanced.Tipo_de_RecordatorioFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Recordatorio_Notificacion.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Recordatorio + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Recordatorio_Notificacion.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Recordatorio + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Recordatorio_Notificacion.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Recordatorio + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Recordatorio_Notificacion.Descripcion = '" + data.filterAdvanced.Tipo_de_Recordatorio + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_RecordatorioMultiple != null && data.filterAdvanced.Tipo_de_RecordatorioMultiple.length > 0) {
      var Tipo_de_Recordatoriods = data.filterAdvanced.Tipo_de_RecordatorioMultiple.join(",");
      condition += " AND Configuracion_de_Notificacion.Tipo_de_Recordatorio In (" + Tipo_de_Recordatoriods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Inicio != 'undefined' && data.filterAdvanced.fromFecha_de_Inicio)
	|| (typeof data.filterAdvanced.toFecha_de_Inicio != 'undefined' && data.filterAdvanced.toFecha_de_Inicio)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Inicio != 'undefined' && data.filterAdvanced.fromFecha_de_Inicio) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_Notificacion.Fecha_de_Inicio, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Inicio).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Inicio != 'undefined' && data.filterAdvanced.toFecha_de_Inicio) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_Notificacion.Fecha_de_Inicio, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Inicio).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromCantidad_de_Dias_a_Validar != 'undefined' && data.filterAdvanced.fromCantidad_de_Dias_a_Validar)
	|| (typeof data.filterAdvanced.toCantidad_de_Dias_a_Validar != 'undefined' && data.filterAdvanced.toCantidad_de_Dias_a_Validar)) 
	{
      if (typeof data.filterAdvanced.fromCantidad_de_Dias_a_Validar != 'undefined' && data.filterAdvanced.fromCantidad_de_Dias_a_Validar)
        condition += " AND Configuracion_de_Notificacion.Cantidad_de_Dias_a_Validar >= " + data.filterAdvanced.fromCantidad_de_Dias_a_Validar;

      if (typeof data.filterAdvanced.toCantidad_de_Dias_a_Validar != 'undefined' && data.filterAdvanced.toCantidad_de_Dias_a_Validar) 
        condition += " AND Configuracion_de_Notificacion.Cantidad_de_Dias_a_Validar <= " + data.filterAdvanced.toCantidad_de_Dias_a_Validar;
    }
    if ((typeof data.filterAdvanced.Fecha_a_Validar != 'undefined' && data.filterAdvanced.Fecha_a_Validar)) {
      switch (data.filterAdvanced.Fecha_a_ValidarFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Nombre_del_Campo_en_MS.Descripcion LIKE '" + data.filterAdvanced.Fecha_a_Validar + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Nombre_del_Campo_en_MS.Descripcion LIKE '%" + data.filterAdvanced.Fecha_a_Validar + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Nombre_del_Campo_en_MS.Descripcion LIKE '%" + data.filterAdvanced.Fecha_a_Validar + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Nombre_del_Campo_en_MS.Descripcion = '" + data.filterAdvanced.Fecha_a_Validar + "'";
          break;
      }
    } else if (data.filterAdvanced.Fecha_a_ValidarMultiple != null && data.filterAdvanced.Fecha_a_ValidarMultiple.length > 0) {
      var Fecha_a_Validards = data.filterAdvanced.Fecha_a_ValidarMultiple.join(",");
      condition += " AND Configuracion_de_Notificacion.Fecha_a_Validar In (" + Fecha_a_Validards + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_Fin != 'undefined' && data.filterAdvanced.fromFecha_Fin)
	|| (typeof data.filterAdvanced.toFecha_Fin != 'undefined' && data.filterAdvanced.toFecha_Fin)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Fin != 'undefined' && data.filterAdvanced.fromFecha_Fin) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_Notificacion.Fecha_Fin, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Fin).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Fin != 'undefined' && data.filterAdvanced.toFecha_Fin) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_Notificacion.Fecha_Fin, 102)  <= '" + moment(data.filterAdvanced.toFecha_Fin).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_Notificacion.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_Notificacion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_Notificacion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_Notificacion.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Configuracion_de_Notificacion.Estatus In (" + Estatusds + ")";
    }
    switch (data.filterAdvanced.Texto_que_llevara_el_CorreoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_Notificacion.Texto_que_llevara_el_Correo LIKE '" + data.filterAdvanced.Texto_que_llevara_el_Correo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_Notificacion.Texto_que_llevara_el_Correo LIKE '%" + data.filterAdvanced.Texto_que_llevara_el_Correo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_Notificacion.Texto_que_llevara_el_Correo LIKE '%" + data.filterAdvanced.Texto_que_llevara_el_Correo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_Notificacion.Texto_que_llevara_el_Correo = '" + data.filterAdvanced.Texto_que_llevara_el_Correo + "'";
        break;
    }
    switch (data.filterAdvanced.Texto_a_Mostrar_en_la_Notificacion_pushFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_Notificacion.Texto_a_Mostrar_en_la_Notificacion_push LIKE '" + data.filterAdvanced.Texto_a_Mostrar_en_la_Notificacion_push + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_Notificacion.Texto_a_Mostrar_en_la_Notificacion_push LIKE '%" + data.filterAdvanced.Texto_a_Mostrar_en_la_Notificacion_push + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_Notificacion.Texto_a_Mostrar_en_la_Notificacion_push LIKE '%" + data.filterAdvanced.Texto_a_Mostrar_en_la_Notificacion_push + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_Notificacion.Texto_a_Mostrar_en_la_Notificacion_push = '" + data.filterAdvanced.Texto_a_Mostrar_en_la_Notificacion_push + "'";
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
              const longest = result.Configuracion_de_Notificacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Configuracion_de_Notificacions);
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
