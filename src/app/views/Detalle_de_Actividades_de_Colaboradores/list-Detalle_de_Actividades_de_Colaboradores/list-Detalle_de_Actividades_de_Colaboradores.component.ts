import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Detalle_de_Actividades_de_ColaboradoresService } from "src/app/api-services/Detalle_de_Actividades_de_Colaboradores.service";
import { Detalle_de_Actividades_de_Colaboradores } from "src/app/models/Detalle_de_Actividades_de_Colaboradores";
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
import { Detalle_de_Actividades_de_ColaboradoresIndexRules } from 'src/app/shared/businessRules/Detalle_de_Actividades_de_Colaboradores-index-rules';
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
  selector: "app-list-Detalle_de_Actividades_de_Colaboradores",
  templateUrl: "./list-Detalle_de_Actividades_de_Colaboradores.component.html",
  styleUrls: ["./list-Detalle_de_Actividades_de_Colaboradores.component.scss"],
})
export class ListDetalle_de_Actividades_de_ColaboradoresComponent extends Detalle_de_Actividades_de_ColaboradoresIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Id_Actividad",
    "Fecha_de_Reporte",
    "Dia_Inhabil",
    "Colaborador",
    "Puesto",
    "Empresa",
    "Inicio_Horario_Laboral",
    "Fin_Horario_Laboral",
    "No_OT",
    "No_OS",
    "No_Vuelo",
    "No_Reporte",
    "Hora_Inicial",
    "Hora_Final",
    "Matricula",
    "Concepto",
    "Hora_Normal",
    "Horas_Extra",
    "Tiempo_Normal",
    "Tiempo_Extra",
    "Aeronave_Propia",
    "Observaciones",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Id_Actividad",
      "Fecha_de_Reporte",
      "Dia_Inhabil",
      "Colaborador",
      "Puesto",
      "Empresa",
      "Inicio_Horario_Laboral",
      "Fin_Horario_Laboral",
      "No_OT",
      "No_OS",
      "No_Vuelo",
      "No_Reporte",
      "Hora_Inicial",
      "Hora_Final",
      "Matricula",
      "Concepto",
      "Hora_Normal",
      "Horas_Extra",
      "Tiempo_Normal",
      "Tiempo_Extra",
      "Aeronave_Propia",
      "Observaciones",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Id_Actividad_filtro",
      "Fecha_de_Reporte_filtro",
      "Dia_Inhabil_filtro",
      "Colaborador_filtro",
      "Puesto_filtro",
      "Empresa_filtro",
      "Inicio_Horario_Laboral_filtro",
      "Fin_Horario_Laboral_filtro",
      "No_OT_filtro",
      "No_OS_filtro",
      "No_Vuelo_filtro",
      "No_Reporte_filtro",
      "Hora_Inicial_filtro",
      "Hora_Final_filtro",
      "Matricula_filtro",
      "Concepto_filtro",
      "Hora_Normal_filtro",
      "Horas_Extra_filtro",
      "Tiempo_Normal_filtro",
      "Tiempo_Extra_filtro",
      "Aeronave_Propia_filtro",
      "Observaciones_filtro",

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
      Id_Actividad: "",
      Fecha_de_Reporte: null,
      Dia_Inhabil: "",
      Colaborador: "",
      Puesto: "",
      Empresa: "",
      Inicio_Horario_Laboral: "",
      Fin_Horario_Laboral: "",
      No_OT: "",
      No_OS: "",
      No_Vuelo: "",
      No_Reporte: "",
      Hora_Inicial: "",
      Hora_Final: "",
      Matricula: "",
      Concepto: "",
      Hora_Normal: "",
      Horas_Extra: "",
      Tiempo_Normal: "",
      Tiempo_Extra: "",
      Aeronave_Propia: "",
      Observaciones: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Id_ActividadFilter: "",
      Id_Actividad: "",
      Id_ActividadMultiple: "",
      fromFecha_de_Reporte: "",
      toFecha_de_Reporte: "",
      ColaboradorFilter: "",
      Colaborador: "",
      ColaboradorMultiple: "",
      PuestoFilter: "",
      Puesto: "",
      PuestoMultiple: "",
      EmpresaFilter: "",
      Empresa: "",
      EmpresaMultiple: "",
      fromInicio_Horario_Laboral: "",
      toInicio_Horario_Laboral: "",
      fromFin_Horario_Laboral: "",
      toFin_Horario_Laboral: "",
      No_OTFilter: "",
      No_OT: "",
      No_OTMultiple: "",
      No_OSFilter: "",
      No_OS: "",
      No_OSMultiple: "",
      No_VueloFilter: "",
      No_Vuelo: "",
      No_VueloMultiple: "",
      No_ReporteFilter: "",
      No_Reporte: "",
      No_ReporteMultiple: "",
      fromHora_Inicial: "",
      toHora_Inicial: "",
      fromHora_Final: "",
      toHora_Final: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ConceptoFilter: "",
      Concepto: "",
      ConceptoMultiple: "",
      fromHora_Normal: "",
      toHora_Normal: "",
      fromHoras_Extra: "",
      toHoras_Extra: "",

    }
  };

  dataSource: Detalle_de_Actividades_de_ColaboradoresDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Detalle_de_Actividades_de_ColaboradoresDataSource;
  dataClipboard: any;

  constructor(
    private _Detalle_de_Actividades_de_ColaboradoresService: Detalle_de_Actividades_de_ColaboradoresService,
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
    this.dataSource = new Detalle_de_Actividades_de_ColaboradoresDataSource(
      this._Detalle_de_Actividades_de_ColaboradoresService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Detalle_de_Actividades_de_Colaboradores)
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
    this.listConfig.filter.Id_Actividad = "";
    this.listConfig.filter.Fecha_de_Reporte = undefined;
    this.listConfig.filter.Dia_Inhabil = undefined;
    this.listConfig.filter.Colaborador = "";
    this.listConfig.filter.Puesto = "";
    this.listConfig.filter.Empresa = "";
    this.listConfig.filter.Inicio_Horario_Laboral = "";
    this.listConfig.filter.Fin_Horario_Laboral = "";
    this.listConfig.filter.No_OT = "";
    this.listConfig.filter.No_OS = "";
    this.listConfig.filter.No_Vuelo = "";
    this.listConfig.filter.No_Reporte = "";
    this.listConfig.filter.Hora_Inicial = "";
    this.listConfig.filter.Hora_Final = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Concepto = "";
    this.listConfig.filter.Hora_Normal = "";
    this.listConfig.filter.Horas_Extra = "";
    this.listConfig.filter.Tiempo_Normal = "";
    this.listConfig.filter.Tiempo_Extra = "";
    this.listConfig.filter.Aeronave_Propia = undefined;
    this.listConfig.filter.Observaciones = "";

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

//INICIA - BRID:6367 - Ocultar campo de Actividad - Autor: Aaron - Actualización: 9/24/2021 9:42:38 AM
if("true" == "true")  {   
  this.brf.HideFieldofMultirenglon(this.displayedColumns,"Id_ActividadNo_Actividad")  
}  else  {   
  this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Id_ActividadNo_Actividad")  
}
//TERMINA - BRID:6367


//INICIA - BRID:6434 - mostrar columna - Autor: Aaron - Actualización: 9/24/2021 11:40:06 AM
// if(false == true)  {   
//   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Id_ActividadNo_Actividad")  
// }  else  {   
  this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Id_ActividadNo_Actividad")  
// }
//TERMINA - BRID:6434


//INICIA - BRID:6437 - Ocultar Columnas Tiempo Normal y Tiempo Extra - Autor: Aaron - Actualización: 9/24/2021 10:23:08 AM
if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Tiempo_Normal")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Tiempo_Normal")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Tiempo_Extra")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Tiempo_Extra")  }
//TERMINA - BRID:6437

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

  remove(row: Detalle_de_Actividades_de_Colaboradores) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Detalle_de_Actividades_de_ColaboradoresService
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
  ActionPrint(dataRow: Detalle_de_Actividades_de_Colaboradores) {

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
,'Id_Actividad'
,'Fecha de Reporte'
,'Día Inhábil'
,'Colaborador'
,'Puesto'
,'Empresa'
,'Inicio Horario Laboral'
,'Fin Horario Laboral'
,'No. OT'
,'No. OS'
,'No. Vuelo'
,'No. Reporte'
,'Hora Inicial'
,'Hora Final'
,'Matricula'
,'Concepto'
,'Hora Normal'
,'Horas Extra'
,'Tiempo Normal'
,'Tiempo Extra'
,'Aeronave Propia'
,'Observaciones'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Id_Actividad_Actividades_de_los_Colaboradores.No_Actividad
,x.Fecha_de_Reporte
,x.Dia_Inhabil
,x.Colaborador_Creacion_de_Usuarios.Nombre_completo
,x.Puesto_Cargos.Descripcion
,x.Empresa_Cliente.Razon_Social
,x.Inicio_Horario_Laboral
,x.Fin_Horario_Laboral
,x.No_OT_Orden_de_Trabajo.numero_de_orden
,x.No_OS_Orden_de_servicio.Folio_OS
,x.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
,x.No_Reporte_Crear_Reporte.No_Reporte
,x.Hora_Inicial
,x.Hora_Final
,x.Matricula_Aeronave.Matricula
,x.Concepto_Catalogo_Actividades_de_Colaboradores.Descripcion
,x.Hora_Normal
,x.Horas_Extra
,x.Tiempo_Normal
,x.Tiempo_Extra
,x.Aeronave_Propia
,x.Observaciones
		  
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
    pdfMake.createPdf(pdfDefinition).download('Detalle_de_Actividades_de_Colaboradores.pdf');
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
          this._Detalle_de_Actividades_de_ColaboradoresService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Detalle_de_Actividades_de_Colaboradoress;
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
          this._Detalle_de_Actividades_de_ColaboradoresService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Detalle_de_Actividades_de_Colaboradoress;
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
        'Id_Actividad ': fields.Id_Actividad_Actividades_de_los_Colaboradores.No_Actividad,
        'Fecha de Reporte ': fields.Fecha_de_Reporte ? momentJS(fields.Fecha_de_Reporte).format('DD/MM/YYYY') : '',
        'Dia_Inhabil ': fields.Dia_Inhabil ? 'SI' : 'NO',
        'Colaborador ': fields.Colaborador_Creacion_de_Usuarios.Nombre_completo,
        'Puesto ': fields.Puesto_Cargos.Descripcion,
        'Empresa ': fields.Empresa_Cliente.Razon_Social,
        'Inicio Horario Laboral ': fields.Inicio_Horario_Laboral,
        'Fin Horario Laboral ': fields.Fin_Horario_Laboral,
        'No. OT ': fields.No_OT_Orden_de_Trabajo.numero_de_orden,
        'No. OS ': fields.No_OS_Orden_de_servicio.Folio_OS,
        'No. Vuelo ': fields.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'No. Reporte ': fields.No_Reporte_Crear_Reporte.No_Reporte,
        'Hora Inicial ': fields.Hora_Inicial,
        'Hora Final ': fields.Hora_Final,
        'Matricula ': fields.Matricula_Aeronave.Matricula,
        'Concepto ': fields.Concepto_Catalogo_Actividades_de_Colaboradores.Descripcion,
        'Hora Normal ': fields.Hora_Normal,
        'Horas Extra ': fields.Horas_Extra,
        'Tiempo Normal ': fields.Tiempo_Normal,
        'Tiempo Extra ': fields.Tiempo_Extra,
        'Aeronave_Propia ': fields.Aeronave_Propia ? 'SI' : 'NO',
        'Observaciones ': fields.Observaciones,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Detalle_de_Actividades_de_Colaboradores  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Id_Actividad: x.Id_Actividad_Actividades_de_los_Colaboradores.No_Actividad,
      Fecha_de_Reporte: x.Fecha_de_Reporte,
      Dia_Inhabil: x.Dia_Inhabil,
      Colaborador: x.Colaborador_Creacion_de_Usuarios.Nombre_completo,
      Puesto: x.Puesto_Cargos.Descripcion,
      Empresa: x.Empresa_Cliente.Razon_Social,
      Inicio_Horario_Laboral: x.Inicio_Horario_Laboral,
      Fin_Horario_Laboral: x.Fin_Horario_Laboral,
      No_OT: x.No_OT_Orden_de_Trabajo.numero_de_orden,
      No_OS: x.No_OS_Orden_de_servicio.Folio_OS,
      No_Vuelo: x.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      No_Reporte: x.No_Reporte_Crear_Reporte.No_Reporte,
      Hora_Inicial: x.Hora_Inicial,
      Hora_Final: x.Hora_Final,
      Matricula: x.Matricula_Aeronave.Matricula,
      Concepto: x.Concepto_Catalogo_Actividades_de_Colaboradores.Descripcion,
      Hora_Normal: x.Hora_Normal,
      Horas_Extra: x.Horas_Extra,
      Tiempo_Normal: x.Tiempo_Normal,
      Tiempo_Extra: x.Tiempo_Extra,
      Aeronave_Propia: x.Aeronave_Propia,
      Observaciones: x.Observaciones,

    }));

    this.excelService.exportToCsv(result, 'Detalle_de_Actividades_de_Colaboradores',  ['Folio'    ,'Id_Actividad'  ,'Fecha_de_Reporte'  ,'Dia_Inhabil'  ,'Colaborador'  ,'Puesto'  ,'Empresa'  ,'Inicio_Horario_Laboral'  ,'Fin_Horario_Laboral'  ,'No_OT'  ,'No_OS'  ,'No_Vuelo'  ,'No_Reporte'  ,'Hora_Inicial'  ,'Hora_Final'  ,'Matricula'  ,'Concepto'  ,'Hora_Normal'  ,'Horas_Extra'  ,'Tiempo_Normal'  ,'Tiempo_Extra'  ,'Aeronave_Propia'  ,'Observaciones' ]);
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
    template += '          <th>Id_Actividad</th>';
    template += '          <th>Fecha de Reporte</th>';
    template += '          <th>Día Inhábil</th>';
    template += '          <th>Colaborador</th>';
    template += '          <th>Puesto</th>';
    template += '          <th>Empresa</th>';
    template += '          <th>Inicio Horario Laboral</th>';
    template += '          <th>Fin Horario Laboral</th>';
    template += '          <th>No. OT</th>';
    template += '          <th>No. OS</th>';
    template += '          <th>No. Vuelo</th>';
    template += '          <th>No. Reporte</th>';
    template += '          <th>Hora Inicial</th>';
    template += '          <th>Hora Final</th>';
    template += '          <th>Matricula</th>';
    template += '          <th>Concepto</th>';
    template += '          <th>Hora Normal</th>';
    template += '          <th>Horas Extra</th>';
    template += '          <th>Tiempo Normal</th>';
    template += '          <th>Tiempo Extra</th>';
    template += '          <th>Aeronave Propia</th>';
    template += '          <th>Observaciones</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Id_Actividad_Actividades_de_los_Colaboradores.No_Actividad + '</td>';
      template += '          <td>' + element.Fecha_de_Reporte + '</td>';
      template += '          <td>' + element.Dia_Inhabil + '</td>';
      template += '          <td>' + element.Colaborador_Creacion_de_Usuarios.Nombre_completo + '</td>';
      template += '          <td>' + element.Puesto_Cargos.Descripcion + '</td>';
      template += '          <td>' + element.Empresa_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Inicio_Horario_Laboral + '</td>';
      template += '          <td>' + element.Fin_Horario_Laboral + '</td>';
      template += '          <td>' + element.No_OT_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.No_OS_Orden_de_servicio.Folio_OS + '</td>';
      template += '          <td>' + element.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.No_Reporte_Crear_Reporte.No_Reporte + '</td>';
      template += '          <td>' + element.Hora_Inicial + '</td>';
      template += '          <td>' + element.Hora_Final + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Concepto_Catalogo_Actividades_de_Colaboradores.Descripcion + '</td>';
      template += '          <td>' + element.Hora_Normal + '</td>';
      template += '          <td>' + element.Horas_Extra + '</td>';
      template += '          <td>' + element.Tiempo_Normal + '</td>';
      template += '          <td>' + element.Tiempo_Extra + '</td>';
      template += '          <td>' + element.Aeronave_Propia + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
		  
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
	template += '\t Id_Actividad';
	template += '\t Fecha de Reporte';
	template += '\t Día Inhábil';
	template += '\t Colaborador';
	template += '\t Puesto';
	template += '\t Empresa';
	template += '\t Inicio Horario Laboral';
	template += '\t Fin Horario Laboral';
	template += '\t No. OT';
	template += '\t No. OS';
	template += '\t No. Vuelo';
	template += '\t No. Reporte';
	template += '\t Hora Inicial';
	template += '\t Hora Final';
	template += '\t Matricula';
	template += '\t Concepto';
	template += '\t Hora Normal';
	template += '\t Horas Extra';
	template += '\t Tiempo Normal';
	template += '\t Tiempo Extra';
	template += '\t Aeronave Propia';
	template += '\t Observaciones';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Id_Actividad_Actividades_de_los_Colaboradores.No_Actividad;
	  template += '\t ' + element.Fecha_de_Reporte;
	  template += '\t ' + element.Dia_Inhabil;
      template += '\t ' + element.Colaborador_Creacion_de_Usuarios.Nombre_completo;
      template += '\t ' + element.Puesto_Cargos.Descripcion;
      template += '\t ' + element.Empresa_Cliente.Razon_Social;
	  template += '\t ' + element.Inicio_Horario_Laboral;
	  template += '\t ' + element.Fin_Horario_Laboral;
      template += '\t ' + element.No_OT_Orden_de_Trabajo.numero_de_orden;
      template += '\t ' + element.No_OS_Orden_de_servicio.Folio_OS;
      template += '\t ' + element.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.No_Reporte_Crear_Reporte.No_Reporte;
	  template += '\t ' + element.Hora_Inicial;
	  template += '\t ' + element.Hora_Final;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Concepto_Catalogo_Actividades_de_Colaboradores.Descripcion;
	  template += '\t ' + element.Hora_Normal;
	  template += '\t ' + element.Horas_Extra;
	  template += '\t ' + element.Tiempo_Normal;
	  template += '\t ' + element.Tiempo_Extra;
	  template += '\t ' + element.Aeronave_Propia;
	  template += '\t ' + element.Observaciones;

	  template += '\n';
    });

    return template;
  }

}

export class Detalle_de_Actividades_de_ColaboradoresDataSource implements DataSource<Detalle_de_Actividades_de_Colaboradores>
{
  private subject = new BehaviorSubject<Detalle_de_Actividades_de_Colaboradores[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Detalle_de_Actividades_de_ColaboradoresService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Detalle_de_Actividades_de_Colaboradores[]> {
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
              const longest = result.Detalle_de_Actividades_de_Colaboradoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Detalle_de_Actividades_de_Colaboradoress);
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
      condition += " and Detalle_de_Actividades_de_Colaboradores.Folio = " + data.filter.Folio;
    if (data.filter.Id_Actividad != "")
      condition += " and Actividades_de_los_Colaboradores.No_Actividad like '%" + data.filter.Id_Actividad + "%' ";
    if (data.filter.Fecha_de_Reporte)
      condition += " and CONVERT(VARCHAR(10), Detalle_de_Actividades_de_Colaboradores.Fecha_de_Reporte, 102)  = '" + moment(data.filter.Fecha_de_Reporte).format("YYYY.MM.DD") + "'";
    if (data.filter.Dia_Inhabil && data.filter.Dia_Inhabil != "2") {
      if (data.filter.Dia_Inhabil == "0" || data.filter.Dia_Inhabil == "") {
        condition += " and (Detalle_de_Actividades_de_Colaboradores.Dia_Inhabil = 0 or Detalle_de_Actividades_de_Colaboradores.Dia_Inhabil is null)";
      } else {
        condition += " and Detalle_de_Actividades_de_Colaboradores.Dia_Inhabil = 1";
      }
    }
    if (data.filter.Colaborador != "")
      condition += " and Creacion_de_Usuarios.Nombre_completo like '%" + data.filter.Colaborador + "%' ";
    if (data.filter.Puesto != "")
      condition += " and Cargos.Descripcion like '%" + data.filter.Puesto + "%' ";
    if (data.filter.Empresa != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Empresa + "%' ";
    if (data.filter.Inicio_Horario_Laboral != "")
      condition += " and Detalle_de_Actividades_de_Colaboradores.Inicio_Horario_Laboral = '" + data.filter.Inicio_Horario_Laboral + "'";
    if (data.filter.Fin_Horario_Laboral != "")
      condition += " and Detalle_de_Actividades_de_Colaboradores.Fin_Horario_Laboral = '" + data.filter.Fin_Horario_Laboral + "'";
    if (data.filter.No_OT != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.No_OT + "%' ";
    if (data.filter.No_OS != "")
      condition += " and Orden_de_servicio.Folio_OS like '%" + data.filter.No_OS + "%' ";
    if (data.filter.No_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.No_Vuelo + "%' ";
    if (data.filter.No_Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.No_Reporte + "%' ";
    if (data.filter.Hora_Inicial != "")
      condition += " and Detalle_de_Actividades_de_Colaboradores.Hora_Inicial = '" + data.filter.Hora_Inicial + "'";
    if (data.filter.Hora_Final != "")
      condition += " and Detalle_de_Actividades_de_Colaboradores.Hora_Final = '" + data.filter.Hora_Final + "'";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Concepto != "")
      condition += " and Catalogo_Actividades_de_Colaboradores.Descripcion like '%" + data.filter.Concepto + "%' ";
    if (data.filter.Hora_Normal != "")
      condition += " and Detalle_de_Actividades_de_Colaboradores.Hora_Normal = " + data.filter.Hora_Normal;
    if (data.filter.Horas_Extra != "")
      condition += " and Detalle_de_Actividades_de_Colaboradores.Horas_Extra = " + data.filter.Horas_Extra;
    if (data.filter.Tiempo_Normal != "")
      condition += " and Detalle_de_Actividades_de_Colaboradores.Tiempo_Normal like '%" + data.filter.Tiempo_Normal + "%' ";
    if (data.filter.Tiempo_Extra != "")
      condition += " and Detalle_de_Actividades_de_Colaboradores.Tiempo_Extra like '%" + data.filter.Tiempo_Extra + "%' ";
    if (data.filter.Aeronave_Propia && data.filter.Aeronave_Propia != "2") {
      if (data.filter.Aeronave_Propia == "0" || data.filter.Aeronave_Propia == "") {
        condition += " and (Detalle_de_Actividades_de_Colaboradores.Aeronave_Propia = 0 or Detalle_de_Actividades_de_Colaboradores.Aeronave_Propia is null)";
      } else {
        condition += " and Detalle_de_Actividades_de_Colaboradores.Aeronave_Propia = 1";
      }
    }
    if (data.filter.Observaciones != "")
      condition += " and Detalle_de_Actividades_de_Colaboradores.Observaciones like '%" + data.filter.Observaciones + "%' ";

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
        sort = " Detalle_de_Actividades_de_Colaboradores.Folio " + data.sortDirecction;
        break;
      case "Id_Actividad":
        sort = " Actividades_de_los_Colaboradores.No_Actividad " + data.sortDirecction;
        break;
      case "Fecha_de_Reporte":
        sort = " Detalle_de_Actividades_de_Colaboradores.Fecha_de_Reporte " + data.sortDirecction;
        break;
      case "Dia_Inhabil":
        sort = " Detalle_de_Actividades_de_Colaboradores.Dia_Inhabil " + data.sortDirecction;
        break;
      case "Colaborador":
        sort = " Creacion_de_Usuarios.Nombre_completo " + data.sortDirecction;
        break;
      case "Puesto":
        sort = " Cargos.Descripcion " + data.sortDirecction;
        break;
      case "Empresa":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Inicio_Horario_Laboral":
        sort = " Detalle_de_Actividades_de_Colaboradores.Inicio_Horario_Laboral " + data.sortDirecction;
        break;
      case "Fin_Horario_Laboral":
        sort = " Detalle_de_Actividades_de_Colaboradores.Fin_Horario_Laboral " + data.sortDirecction;
        break;
      case "No_OT":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "No_OS":
        sort = " Orden_de_servicio.Folio_OS " + data.sortDirecction;
        break;
      case "No_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "No_Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "Hora_Inicial":
        sort = " Detalle_de_Actividades_de_Colaboradores.Hora_Inicial " + data.sortDirecction;
        break;
      case "Hora_Final":
        sort = " Detalle_de_Actividades_de_Colaboradores.Hora_Final " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Concepto":
        sort = " Catalogo_Actividades_de_Colaboradores.Descripcion " + data.sortDirecction;
        break;
      case "Hora_Normal":
        sort = " Detalle_de_Actividades_de_Colaboradores.Hora_Normal " + data.sortDirecction;
        break;
      case "Horas_Extra":
        sort = " Detalle_de_Actividades_de_Colaboradores.Horas_Extra " + data.sortDirecction;
        break;
      case "Tiempo_Normal":
        sort = " Detalle_de_Actividades_de_Colaboradores.Tiempo_Normal " + data.sortDirecction;
        break;
      case "Tiempo_Extra":
        sort = " Detalle_de_Actividades_de_Colaboradores.Tiempo_Extra " + data.sortDirecction;
        break;
      case "Aeronave_Propia":
        sort = " Detalle_de_Actividades_de_Colaboradores.Aeronave_Propia " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Detalle_de_Actividades_de_Colaboradores.Observaciones " + data.sortDirecction;
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
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Id_Actividad != 'undefined' && data.filterAdvanced.Id_Actividad)) {
      switch (data.filterAdvanced.Id_ActividadFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Actividades_de_los_Colaboradores.No_Actividad LIKE '" + data.filterAdvanced.Id_Actividad + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Actividades_de_los_Colaboradores.No_Actividad LIKE '%" + data.filterAdvanced.Id_Actividad + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Actividades_de_los_Colaboradores.No_Actividad LIKE '%" + data.filterAdvanced.Id_Actividad + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Actividades_de_los_Colaboradores.No_Actividad = '" + data.filterAdvanced.Id_Actividad + "'";
          break;
      }
    } else if (data.filterAdvanced.Id_ActividadMultiple != null && data.filterAdvanced.Id_ActividadMultiple.length > 0) {
      var Id_Actividadds = data.filterAdvanced.Id_ActividadMultiple.join(",");
      condition += " AND Detalle_de_Actividades_de_Colaboradores.Id_Actividad In (" + Id_Actividadds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Reporte != 'undefined' && data.filterAdvanced.fromFecha_de_Reporte)
	|| (typeof data.filterAdvanced.toFecha_de_Reporte != 'undefined' && data.filterAdvanced.toFecha_de_Reporte)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Reporte != 'undefined' && data.filterAdvanced.fromFecha_de_Reporte) 
        condition += " and CONVERT(VARCHAR(10), Detalle_de_Actividades_de_Colaboradores.Fecha_de_Reporte, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Reporte).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Reporte != 'undefined' && data.filterAdvanced.toFecha_de_Reporte) 
        condition += " and CONVERT(VARCHAR(10), Detalle_de_Actividades_de_Colaboradores.Fecha_de_Reporte, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Reporte).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Colaborador != 'undefined' && data.filterAdvanced.Colaborador)) {
      switch (data.filterAdvanced.ColaboradorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '" + data.filterAdvanced.Colaborador + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '%" + data.filterAdvanced.Colaborador + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '%" + data.filterAdvanced.Colaborador + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Usuarios.Nombre_completo = '" + data.filterAdvanced.Colaborador + "'";
          break;
      }
    } else if (data.filterAdvanced.ColaboradorMultiple != null && data.filterAdvanced.ColaboradorMultiple.length > 0) {
      var Colaboradords = data.filterAdvanced.ColaboradorMultiple.join(",");
      condition += " AND Detalle_de_Actividades_de_Colaboradores.Colaborador In (" + Colaboradords + ")";
    }
    if ((typeof data.filterAdvanced.Puesto != 'undefined' && data.filterAdvanced.Puesto)) {
      switch (data.filterAdvanced.PuestoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cargos.Descripcion LIKE '" + data.filterAdvanced.Puesto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cargos.Descripcion LIKE '%" + data.filterAdvanced.Puesto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cargos.Descripcion LIKE '%" + data.filterAdvanced.Puesto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cargos.Descripcion = '" + data.filterAdvanced.Puesto + "'";
          break;
      }
    } else if (data.filterAdvanced.PuestoMultiple != null && data.filterAdvanced.PuestoMultiple.length > 0) {
      var Puestods = data.filterAdvanced.PuestoMultiple.join(",");
      condition += " AND Detalle_de_Actividades_de_Colaboradores.Puesto In (" + Puestods + ")";
    }
    if ((typeof data.filterAdvanced.Empresa != 'undefined' && data.filterAdvanced.Empresa)) {
      switch (data.filterAdvanced.EmpresaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.Empresa + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Empresa + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Empresa + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.Empresa + "'";
          break;
      }
    } else if (data.filterAdvanced.EmpresaMultiple != null && data.filterAdvanced.EmpresaMultiple.length > 0) {
      var Empresads = data.filterAdvanced.EmpresaMultiple.join(",");
      condition += " AND Detalle_de_Actividades_de_Colaboradores.Empresa In (" + Empresads + ")";
    }
    if ((typeof data.filterAdvanced.fromInicio_Horario_Laboral != 'undefined' && data.filterAdvanced.fromInicio_Horario_Laboral)
	|| (typeof data.filterAdvanced.toInicio_Horario_Laboral != 'undefined' && data.filterAdvanced.toInicio_Horario_Laboral)) 
	{
		if (typeof data.filterAdvanced.fromInicio_Horario_Laboral != 'undefined' && data.filterAdvanced.fromInicio_Horario_Laboral) 
			condition += " and Detalle_de_Actividades_de_Colaboradores.Inicio_Horario_Laboral >= '" + data.filterAdvanced.fromInicio_Horario_Laboral + "'";
      
		if (typeof data.filterAdvanced.toInicio_Horario_Laboral != 'undefined' && data.filterAdvanced.toInicio_Horario_Laboral) 
			condition += " and Detalle_de_Actividades_de_Colaboradores.Inicio_Horario_Laboral <= '" + data.filterAdvanced.toInicio_Horario_Laboral + "'";
    }
    if ((typeof data.filterAdvanced.fromFin_Horario_Laboral != 'undefined' && data.filterAdvanced.fromFin_Horario_Laboral)
	|| (typeof data.filterAdvanced.toFin_Horario_Laboral != 'undefined' && data.filterAdvanced.toFin_Horario_Laboral)) 
	{
		if (typeof data.filterAdvanced.fromFin_Horario_Laboral != 'undefined' && data.filterAdvanced.fromFin_Horario_Laboral) 
			condition += " and Detalle_de_Actividades_de_Colaboradores.Fin_Horario_Laboral >= '" + data.filterAdvanced.fromFin_Horario_Laboral + "'";
      
		if (typeof data.filterAdvanced.toFin_Horario_Laboral != 'undefined' && data.filterAdvanced.toFin_Horario_Laboral) 
			condition += " and Detalle_de_Actividades_de_Colaboradores.Fin_Horario_Laboral <= '" + data.filterAdvanced.toFin_Horario_Laboral + "'";
    }
    if ((typeof data.filterAdvanced.No_OT != 'undefined' && data.filterAdvanced.No_OT)) {
      switch (data.filterAdvanced.No_OTFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.No_OT + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.No_OT + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.No_OT + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.No_OT + "'";
          break;
      }
    } else if (data.filterAdvanced.No_OTMultiple != null && data.filterAdvanced.No_OTMultiple.length > 0) {
      var No_OTds = data.filterAdvanced.No_OTMultiple.join(",");
      condition += " AND Detalle_de_Actividades_de_Colaboradores.No_OT In (" + No_OTds + ")";
    }
    if ((typeof data.filterAdvanced.No_OS != 'undefined' && data.filterAdvanced.No_OS)) {
      switch (data.filterAdvanced.No_OSFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '" + data.filterAdvanced.No_OS + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '%" + data.filterAdvanced.No_OS + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '%" + data.filterAdvanced.No_OS + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_servicio.Folio_OS = '" + data.filterAdvanced.No_OS + "'";
          break;
      }
    } else if (data.filterAdvanced.No_OSMultiple != null && data.filterAdvanced.No_OSMultiple.length > 0) {
      var No_OSds = data.filterAdvanced.No_OSMultiple.join(",");
      condition += " AND Detalle_de_Actividades_de_Colaboradores.No_OS In (" + No_OSds + ")";
    }
    if ((typeof data.filterAdvanced.No_Vuelo != 'undefined' && data.filterAdvanced.No_Vuelo)) {
      switch (data.filterAdvanced.No_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.No_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.No_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.No_VueloMultiple != null && data.filterAdvanced.No_VueloMultiple.length > 0) {
      var No_Vuelods = data.filterAdvanced.No_VueloMultiple.join(",");
      condition += " AND Detalle_de_Actividades_de_Colaboradores.No_Vuelo In (" + No_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.No_Reporte != 'undefined' && data.filterAdvanced.No_Reporte)) {
      switch (data.filterAdvanced.No_ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.No_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.No_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.No_Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.No_Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.No_ReporteMultiple != null && data.filterAdvanced.No_ReporteMultiple.length > 0) {
      var No_Reporteds = data.filterAdvanced.No_ReporteMultiple.join(",");
      condition += " AND Detalle_de_Actividades_de_Colaboradores.No_Reporte In (" + No_Reporteds + ")";
    }
    if ((typeof data.filterAdvanced.fromHora_Inicial != 'undefined' && data.filterAdvanced.fromHora_Inicial)
	|| (typeof data.filterAdvanced.toHora_Inicial != 'undefined' && data.filterAdvanced.toHora_Inicial)) 
	{
		if (typeof data.filterAdvanced.fromHora_Inicial != 'undefined' && data.filterAdvanced.fromHora_Inicial) 
			condition += " and Detalle_de_Actividades_de_Colaboradores.Hora_Inicial >= '" + data.filterAdvanced.fromHora_Inicial + "'";
      
		if (typeof data.filterAdvanced.toHora_Inicial != 'undefined' && data.filterAdvanced.toHora_Inicial) 
			condition += " and Detalle_de_Actividades_de_Colaboradores.Hora_Inicial <= '" + data.filterAdvanced.toHora_Inicial + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_Final != 'undefined' && data.filterAdvanced.fromHora_Final)
	|| (typeof data.filterAdvanced.toHora_Final != 'undefined' && data.filterAdvanced.toHora_Final)) 
	{
		if (typeof data.filterAdvanced.fromHora_Final != 'undefined' && data.filterAdvanced.fromHora_Final) 
			condition += " and Detalle_de_Actividades_de_Colaboradores.Hora_Final >= '" + data.filterAdvanced.fromHora_Final + "'";
      
		if (typeof data.filterAdvanced.toHora_Final != 'undefined' && data.filterAdvanced.toHora_Final) 
			condition += " and Detalle_de_Actividades_de_Colaboradores.Hora_Final <= '" + data.filterAdvanced.toHora_Final + "'";
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
      condition += " AND Detalle_de_Actividades_de_Colaboradores.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.Concepto != 'undefined' && data.filterAdvanced.Concepto)) {
      switch (data.filterAdvanced.ConceptoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Catalogo_Actividades_de_Colaboradores.Descripcion LIKE '" + data.filterAdvanced.Concepto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Catalogo_Actividades_de_Colaboradores.Descripcion LIKE '%" + data.filterAdvanced.Concepto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Catalogo_Actividades_de_Colaboradores.Descripcion LIKE '%" + data.filterAdvanced.Concepto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Catalogo_Actividades_de_Colaboradores.Descripcion = '" + data.filterAdvanced.Concepto + "'";
          break;
      }
    } else if (data.filterAdvanced.ConceptoMultiple != null && data.filterAdvanced.ConceptoMultiple.length > 0) {
      var Conceptods = data.filterAdvanced.ConceptoMultiple.join(",");
      condition += " AND Detalle_de_Actividades_de_Colaboradores.Concepto In (" + Conceptods + ")";
    }
    if ((typeof data.filterAdvanced.fromHora_Normal != 'undefined' && data.filterAdvanced.fromHora_Normal)
	|| (typeof data.filterAdvanced.toHora_Normal != 'undefined' && data.filterAdvanced.toHora_Normal)) 
	{
      if (typeof data.filterAdvanced.fromHora_Normal != 'undefined' && data.filterAdvanced.fromHora_Normal)
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Hora_Normal >= " + data.filterAdvanced.fromHora_Normal;

      if (typeof data.filterAdvanced.toHora_Normal != 'undefined' && data.filterAdvanced.toHora_Normal) 
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Hora_Normal <= " + data.filterAdvanced.toHora_Normal;
    }
    if ((typeof data.filterAdvanced.fromHoras_Extra != 'undefined' && data.filterAdvanced.fromHoras_Extra)
	|| (typeof data.filterAdvanced.toHoras_Extra != 'undefined' && data.filterAdvanced.toHoras_Extra)) 
	{
      if (typeof data.filterAdvanced.fromHoras_Extra != 'undefined' && data.filterAdvanced.fromHoras_Extra)
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Horas_Extra >= " + data.filterAdvanced.fromHoras_Extra;

      if (typeof data.filterAdvanced.toHoras_Extra != 'undefined' && data.filterAdvanced.toHoras_Extra) 
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Horas_Extra <= " + data.filterAdvanced.toHoras_Extra;
    }
    switch (data.filterAdvanced.Tiempo_NormalFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Tiempo_Normal LIKE '" + data.filterAdvanced.Tiempo_Normal + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Tiempo_Normal LIKE '%" + data.filterAdvanced.Tiempo_Normal + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Tiempo_Normal LIKE '%" + data.filterAdvanced.Tiempo_Normal + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Tiempo_Normal = '" + data.filterAdvanced.Tiempo_Normal + "'";
        break;
    }
    switch (data.filterAdvanced.Tiempo_ExtraFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Tiempo_Extra LIKE '" + data.filterAdvanced.Tiempo_Extra + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Tiempo_Extra LIKE '%" + data.filterAdvanced.Tiempo_Extra + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Tiempo_Extra LIKE '%" + data.filterAdvanced.Tiempo_Extra + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Tiempo_Extra = '" + data.filterAdvanced.Tiempo_Extra + "'";
        break;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_de_Actividades_de_Colaboradores.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
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
              const longest = result.Detalle_de_Actividades_de_Colaboradoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Detalle_de_Actividades_de_Colaboradoress);
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
