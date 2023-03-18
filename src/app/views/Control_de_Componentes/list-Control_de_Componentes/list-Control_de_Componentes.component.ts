import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Control_de_ComponentesService } from "src/app/api-services/Control_de_Componentes.service";
import { Control_de_Componentes } from "src/app/models/Control_de_Componentes";
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
import { Control_de_ComponentesIndexRules } from 'src/app/shared/businessRules/Control_de_Componentes-index-rules';
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
  selector: "app-list-Control_de_Componentes",
  templateUrl: "./list-Control_de_Componentes.component.html",
  styleUrls: ["./list-Control_de_Componentes.component.scss"],
})
export class ListControl_de_ComponentesComponent extends Control_de_ComponentesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Id_Mantenimiento",
    "Modelo_de_aeronave",
    "Codigo_computarizado",
    "Matricula",
    "Numero_de_serie",
    "Capitulo_en_el_manual",
    "Codigo_ATA",
    "Descripcion_de_actividad",
    "Estatus_de_componente",
    "Tiempo_de_ejecucion",
    "Velocidad_en_nudos",
    "Color_de_la_cubierta",
    "Color_de_la_aeronave",
    "Clasificacion_de_aeronavegabilidad",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Id_Mantenimiento",
      "Modelo_de_aeronave",
      "Codigo_computarizado",
      "Matricula",
      "Numero_de_serie",
      "Capitulo_en_el_manual",
      "Codigo_ATA",
      "Descripcion_de_actividad",
      "Estatus_de_componente",
      "Tiempo_de_ejecucion",
      "Velocidad_en_nudos",
      "Color_de_la_cubierta",
      "Color_de_la_aeronave",
      "Clasificacion_de_aeronavegabilidad",
      "Instrucciones",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Id_Mantenimiento_filtro",
      "Modelo_de_aeronave_filtro",
      "Codigo_computarizado_filtro",
      "Matricula_filtro",
      "Numero_de_serie_filtro",
      "Capitulo_en_el_manual_filtro",
      "Codigo_ATA_filtro",
      "Descripcion_de_actividad_filtro",
      "Estatus_de_componente_filtro",
      "Tiempo_de_ejecucion_filtro",
      "Velocidad_en_nudos_filtro",
      "Color_de_la_cubierta_filtro",
      "Color_de_la_aeronave_filtro",
      "Clasificacion_de_aeronavegabilidad_filtro",
      "Instrucciones_filtro",

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
      Id_Mantenimiento: "",
      Modelo_de_aeronave: "",
      Codigo_computarizado: "",
      Matricula: "",
      Numero_de_serie: "",
      Capitulo_en_el_manual: "",
      Codigo_ATA: "",
      Descripcion_de_actividad: "",
      Estatus_de_componente: "",
      Tiempo_de_ejecucion: "",
      Velocidad_en_nudos: "",
      Color_de_la_cubierta: "",
      Color_de_la_aeronave: "",
      Clasificacion_de_aeronavegabilidad: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Id_MantenimientoFilter: "",
      Id_Mantenimiento: "",
      Id_MantenimientoMultiple: "",
      Modelo_de_aeronaveFilter: "",
      Modelo_de_aeronave: "",
      Modelo_de_aeronaveMultiple: "",
      Codigo_computarizadoFilter: "",
      Codigo_computarizado: "",
      Codigo_computarizadoMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      Numero_de_serieFilter: "",
      Numero_de_serie: "",
      Numero_de_serieMultiple: "",
      Codigo_ATAFilter: "",
      Codigo_ATA: "",
      Codigo_ATAMultiple: "",
      Estatus_de_componenteFilter: "",
      Estatus_de_componente: "",
      Estatus_de_componenteMultiple: "",
      Clasificacion_de_aeronavegabilidadFilter: "",
      Clasificacion_de_aeronavegabilidad: "",
      Clasificacion_de_aeronavegabilidadMultiple: "",

    }
  };

  dataSource: Control_de_ComponentesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Control_de_ComponentesDataSource;
  dataClipboard: any;

  constructor(
    private _Control_de_ComponentesService: Control_de_ComponentesService,
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
    this.dataSource = new Control_de_ComponentesDataSource(
      this._Control_de_ComponentesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Control_de_Componentes)
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
    this.listConfig.filter.Id_Mantenimiento = "";
    this.listConfig.filter.Modelo_de_aeronave = "";
    this.listConfig.filter.Codigo_computarizado = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Numero_de_serie = "";
    this.listConfig.filter.Capitulo_en_el_manual = "";
    this.listConfig.filter.Codigo_ATA = "";
    this.listConfig.filter.Descripcion_de_actividad = "";
    this.listConfig.filter.Estatus_de_componente = "";
    this.listConfig.filter.Tiempo_de_ejecucion = "";
    this.listConfig.filter.Velocidad_en_nudos = "";
    this.listConfig.filter.Color_de_la_cubierta = "";
    this.listConfig.filter.Color_de_la_aeronave = "";
    this.listConfig.filter.Clasificacion_de_aeronavegabilidad = "";

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

  remove(row: Control_de_Componentes) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Control_de_ComponentesService
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
  ActionPrint(dataRow: Control_de_Componentes) {

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
,'Id Mantenimiento'
,'Modelo de aeronave'
,'Código computarizado'
,'Matrícula'
,'Número de serie'
,'Capítulo en el manual '
,'Código ATA'
,'Descripción de actividad'
,'Estatus de componente'
,'Tiempo de ejecución'
,'Velocidad en nudos'
,'Color de la cubierta de las lanchas salvavidas'
,'Color de la aeronave'
,'Clasificación de aeronavegabilidad'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Id_Mantenimiento_Modulo_de_Mantenimiento.Clave
,x.Modelo_de_aeronave_Modelos.Descripcion
,x.Codigo_computarizado_Codigo_Computarizado.Descripcion
,x.Matricula_Aeronave.Matricula
,x.Numero_de_serie_Aeronave.Numero_de_Serie
,x.Capitulo_en_el_manual
,x.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion
,x.Descripcion_de_actividad
,x.Estatus_de_componente_Estatus_de_componente.Descripcion
,x.Tiempo_de_ejecucion
,x.Velocidad_en_nudos
,x.Color_de_la_cubierta
,x.Color_de_la_aeronave
,x.Clasificacion_de_aeronavegabilidad_Clasificacion_de_aeronavegabilidad.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Control_de_Componentes.pdf');
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
          this._Control_de_ComponentesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Control_de_Componentess;
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
          this._Control_de_ComponentesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Control_de_Componentess;
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
        'Id Mantenimiento ': fields.Id_Mantenimiento_Modulo_de_Mantenimiento.Clave,
        'Modelo de aeronave ': fields.Modelo_de_aeronave_Modelos.Descripcion,
        'Código computarizado ': fields.Codigo_computarizado_Codigo_Computarizado.Descripcion,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Número de serie ': fields.Numero_de_serie_Aeronave.Numero_de_Serie,
        'Capítulo en el manual  ': fields.Capitulo_en_el_manual,
        'Código ATA ': fields.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
        'Descripción de actividad ': fields.Descripcion_de_actividad,
        'Estatus de componente ': fields.Estatus_de_componente_Estatus_de_componente.Descripcion,
        'Tiempo de ejecución ': fields.Tiempo_de_ejecucion,
        'Velocidad en nudos ': fields.Velocidad_en_nudos,
        'Color de la cubierta de las lanchas salvavidas ': fields.Color_de_la_cubierta,
        'Color de la aeronave ': fields.Color_de_la_aeronave,
        'Clasificación de aeronavegabilidad ': fields.Clasificacion_de_aeronavegabilidad_Clasificacion_de_aeronavegabilidad.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Control_de_Componentes  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Id_Mantenimiento: x.Id_Mantenimiento_Modulo_de_Mantenimiento.Clave,
      Modelo_de_aeronave: x.Modelo_de_aeronave_Modelos.Descripcion,
      Codigo_computarizado: x.Codigo_computarizado_Codigo_Computarizado.Descripcion,
      Matricula: x.Matricula_Aeronave.Matricula,
      Numero_de_serie: x.Numero_de_serie_Aeronave.Numero_de_Serie,
      Capitulo_en_el_manual: x.Capitulo_en_el_manual,
      Codigo_ATA: x.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
      Descripcion_de_actividad: x.Descripcion_de_actividad,
      Estatus_de_componente: x.Estatus_de_componente_Estatus_de_componente.Descripcion,
      Tiempo_de_ejecucion: x.Tiempo_de_ejecucion,
      Velocidad_en_nudos: x.Velocidad_en_nudos,
      Color_de_la_cubierta: x.Color_de_la_cubierta,
      Color_de_la_aeronave: x.Color_de_la_aeronave,
      Clasificacion_de_aeronavegabilidad: x.Clasificacion_de_aeronavegabilidad_Clasificacion_de_aeronavegabilidad.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Control_de_Componentes',  ['Folio'    ,'Id_Mantenimiento'  ,'Modelo_de_aeronave'  ,'Codigo_computarizado'  ,'Matricula'  ,'Numero_de_serie'  ,'Capitulo_en_el_manual'  ,'Codigo_ATA'  ,'Descripcion_de_actividad'  ,'Estatus_de_componente'  ,'Tiempo_de_ejecucion'  ,'Velocidad_en_nudos'  ,'Color_de_la_cubierta'  ,'Color_de_la_aeronave'  ,'Clasificacion_de_aeronavegabilidad' ]);
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
    template += '          <th>Id Mantenimiento</th>';
    template += '          <th>Modelo de aeronave</th>';
    template += '          <th>Código computarizado</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Número de serie</th>';
    template += '          <th>Capítulo en el manual </th>';
    template += '          <th>Código ATA</th>';
    template += '          <th>Descripción de actividad</th>';
    template += '          <th>Estatus de componente</th>';
    template += '          <th>Tiempo de ejecución</th>';
    template += '          <th>Velocidad en nudos</th>';
    template += '          <th>Color de la cubierta de las lanchas salvavidas</th>';
    template += '          <th>Color de la aeronave</th>';
    template += '          <th>Clasificación de aeronavegabilidad</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Id_Mantenimiento_Modulo_de_Mantenimiento.Clave + '</td>';
      template += '          <td>' + element.Modelo_de_aeronave_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Codigo_computarizado_Codigo_Computarizado.Descripcion + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Numero_de_serie_Aeronave.Numero_de_Serie + '</td>';
      template += '          <td>' + element.Capitulo_en_el_manual + '</td>';
      template += '          <td>' + element.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion + '</td>';
      template += '          <td>' + element.Descripcion_de_actividad + '</td>';
      template += '          <td>' + element.Estatus_de_componente_Estatus_de_componente.Descripcion + '</td>';
      template += '          <td>' + element.Tiempo_de_ejecucion + '</td>';
      template += '          <td>' + element.Velocidad_en_nudos + '</td>';
      template += '          <td>' + element.Color_de_la_cubierta + '</td>';
      template += '          <td>' + element.Color_de_la_aeronave + '</td>';
      template += '          <td>' + element.Clasificacion_de_aeronavegabilidad_Clasificacion_de_aeronavegabilidad.Descripcion + '</td>';
		  
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
	template += '\t Id Mantenimiento';
	template += '\t Modelo de aeronave';
	template += '\t Código computarizado';
	template += '\t Matrícula';
	template += '\t Número de serie';
	template += '\t Capítulo en el manual ';
	template += '\t Código ATA';
	template += '\t Descripción de actividad';
	template += '\t Estatus de componente';
	template += '\t Tiempo de ejecución';
	template += '\t Velocidad en nudos';
	template += '\t Color de la cubierta de las lanchas salvavidas';
	template += '\t Color de la aeronave';
	template += '\t Clasificación de aeronavegabilidad';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Id_Mantenimiento_Modulo_de_Mantenimiento.Clave;
      template += '\t ' + element.Modelo_de_aeronave_Modelos.Descripcion;
      template += '\t ' + element.Codigo_computarizado_Codigo_Computarizado.Descripcion;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Numero_de_serie_Aeronave.Numero_de_Serie;
	  template += '\t ' + element.Capitulo_en_el_manual;
      template += '\t ' + element.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion;
	  template += '\t ' + element.Descripcion_de_actividad;
      template += '\t ' + element.Estatus_de_componente_Estatus_de_componente.Descripcion;
	  template += '\t ' + element.Tiempo_de_ejecucion;
	  template += '\t ' + element.Velocidad_en_nudos;
	  template += '\t ' + element.Color_de_la_cubierta;
	  template += '\t ' + element.Color_de_la_aeronave;
      template += '\t ' + element.Clasificacion_de_aeronavegabilidad_Clasificacion_de_aeronavegabilidad.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Control_de_ComponentesDataSource implements DataSource<Control_de_Componentes>
{
  private subject = new BehaviorSubject<Control_de_Componentes[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Control_de_ComponentesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Control_de_Componentes[]> {
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
          } else if (column != 'acciones'  && column != 'Instrucciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Control_de_Componentess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Control_de_Componentess);
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
      condition += " and Control_de_Componentes.Folio = " + data.filter.Folio;
    if (data.filter.Id_Mantenimiento != "")
      condition += " and Modulo_de_Mantenimiento.Clave like '%" + data.filter.Id_Mantenimiento + "%' ";
    if (data.filter.Modelo_de_aeronave != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo_de_aeronave + "%' ";
    if (data.filter.Codigo_computarizado != "")
      condition += " and Codigo_Computarizado.Descripcion like '%" + data.filter.Codigo_computarizado + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Numero_de_serie != "")
      condition += " and Aeronave.Numero_de_Serie like '%" + data.filter.Numero_de_serie + "%' ";
    if (data.filter.Capitulo_en_el_manual != "")
      condition += " and Control_de_Componentes.Capitulo_en_el_manual like '%" + data.filter.Capitulo_en_el_manual + "%' ";
    if (data.filter.Codigo_ATA != "")
      condition += " and Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + data.filter.Codigo_ATA + "%' ";
    if (data.filter.Descripcion_de_actividad != "")
      condition += " and Control_de_Componentes.Descripcion_de_actividad like '%" + data.filter.Descripcion_de_actividad + "%' ";
    if (data.filter.Estatus_de_componente != "")
      condition += " and Estatus_de_componente.Descripcion like '%" + data.filter.Estatus_de_componente + "%' ";
    if (data.filter.Tiempo_de_ejecucion != "")
      condition += " and Control_de_Componentes.Tiempo_de_ejecucion like '%" + data.filter.Tiempo_de_ejecucion + "%' ";
    if (data.filter.Velocidad_en_nudos != "")
      condition += " and Control_de_Componentes.Velocidad_en_nudos like '%" + data.filter.Velocidad_en_nudos + "%' ";
    if (data.filter.Color_de_la_cubierta != "")
      condition += " and Control_de_Componentes.Color_de_la_cubierta like '%" + data.filter.Color_de_la_cubierta + "%' ";
    if (data.filter.Color_de_la_aeronave != "")
      condition += " and Control_de_Componentes.Color_de_la_aeronave like '%" + data.filter.Color_de_la_aeronave + "%' ";
    if (data.filter.Clasificacion_de_aeronavegabilidad != "")
      condition += " and Clasificacion_de_aeronavegabilidad.Descripcion like '%" + data.filter.Clasificacion_de_aeronavegabilidad + "%' ";

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
        sort = " Control_de_Componentes.Folio " + data.sortDirecction;
        break;
      case "Id_Mantenimiento":
        sort = " Modulo_de_Mantenimiento.Clave " + data.sortDirecction;
        break;
      case "Modelo_de_aeronave":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Codigo_computarizado":
        sort = " Codigo_Computarizado.Descripcion " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Numero_de_serie":
        sort = " Aeronave.Numero_de_Serie " + data.sortDirecction;
        break;
      case "Capitulo_en_el_manual":
        sort = " Control_de_Componentes.Capitulo_en_el_manual " + data.sortDirecction;
        break;
      case "Codigo_ATA":
        sort = " Catalogo_codigo_ATA.Codigo_ATA_Descripcion " + data.sortDirecction;
        break;
      case "Descripcion_de_actividad":
        sort = " Control_de_Componentes.Descripcion_de_actividad " + data.sortDirecction;
        break;
      case "Estatus_de_componente":
        sort = " Estatus_de_componente.Descripcion " + data.sortDirecction;
        break;
      case "Tiempo_de_ejecucion":
        sort = " Control_de_Componentes.Tiempo_de_ejecucion " + data.sortDirecction;
        break;
      case "Velocidad_en_nudos":
        sort = " Control_de_Componentes.Velocidad_en_nudos " + data.sortDirecction;
        break;
      case "Color_de_la_cubierta":
        sort = " Control_de_Componentes.Color_de_la_cubierta " + data.sortDirecction;
        break;
      case "Color_de_la_aeronave":
        sort = " Control_de_Componentes.Color_de_la_aeronave " + data.sortDirecction;
        break;
      case "Clasificacion_de_aeronavegabilidad":
        sort = " Clasificacion_de_aeronavegabilidad.Descripcion " + data.sortDirecction;
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
        condition += " AND Control_de_Componentes.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Control_de_Componentes.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Id_Mantenimiento != 'undefined' && data.filterAdvanced.Id_Mantenimiento)) {
      switch (data.filterAdvanced.Id_MantenimientoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Modulo_de_Mantenimiento.Clave LIKE '" + data.filterAdvanced.Id_Mantenimiento + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Modulo_de_Mantenimiento.Clave LIKE '%" + data.filterAdvanced.Id_Mantenimiento + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Modulo_de_Mantenimiento.Clave LIKE '%" + data.filterAdvanced.Id_Mantenimiento + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Modulo_de_Mantenimiento.Clave = '" + data.filterAdvanced.Id_Mantenimiento + "'";
          break;
      }
    } else if (data.filterAdvanced.Id_MantenimientoMultiple != null && data.filterAdvanced.Id_MantenimientoMultiple.length > 0) {
      var Id_Mantenimientods = data.filterAdvanced.Id_MantenimientoMultiple.join(",");
      condition += " AND Control_de_Componentes.Id_Mantenimiento In (" + Id_Mantenimientods + ")";
    }
    if ((typeof data.filterAdvanced.Modelo_de_aeronave != 'undefined' && data.filterAdvanced.Modelo_de_aeronave)) {
      switch (data.filterAdvanced.Modelo_de_aeronaveFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Modelos.Descripcion LIKE '" + data.filterAdvanced.Modelo_de_aeronave + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo_de_aeronave + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo_de_aeronave + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Modelos.Descripcion = '" + data.filterAdvanced.Modelo_de_aeronave + "'";
          break;
      }
    } else if (data.filterAdvanced.Modelo_de_aeronaveMultiple != null && data.filterAdvanced.Modelo_de_aeronaveMultiple.length > 0) {
      var Modelo_de_aeronaveds = data.filterAdvanced.Modelo_de_aeronaveMultiple.join(",");
      condition += " AND Control_de_Componentes.Modelo_de_aeronave In (" + Modelo_de_aeronaveds + ")";
    }
    if ((typeof data.filterAdvanced.Codigo_computarizado != 'undefined' && data.filterAdvanced.Codigo_computarizado)) {
      switch (data.filterAdvanced.Codigo_computarizadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Codigo_Computarizado.Descripcion LIKE '" + data.filterAdvanced.Codigo_computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Codigo_Computarizado.Descripcion LIKE '%" + data.filterAdvanced.Codigo_computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Codigo_Computarizado.Descripcion LIKE '%" + data.filterAdvanced.Codigo_computarizado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Codigo_Computarizado.Descripcion = '" + data.filterAdvanced.Codigo_computarizado + "'";
          break;
      }
    } else if (data.filterAdvanced.Codigo_computarizadoMultiple != null && data.filterAdvanced.Codigo_computarizadoMultiple.length > 0) {
      var Codigo_computarizadods = data.filterAdvanced.Codigo_computarizadoMultiple.join(",");
      condition += " AND Control_de_Componentes.Codigo_computarizado In (" + Codigo_computarizadods + ")";
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
      condition += " AND Control_de_Componentes.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.Numero_de_serie != 'undefined' && data.filterAdvanced.Numero_de_serie)) {
      switch (data.filterAdvanced.Numero_de_serieFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeronave.Numero_de_Serie LIKE '" + data.filterAdvanced.Numero_de_serie + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.Numero_de_serie + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.Numero_de_serie + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeronave.Numero_de_Serie = '" + data.filterAdvanced.Numero_de_serie + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_serieMultiple != null && data.filterAdvanced.Numero_de_serieMultiple.length > 0) {
      var Numero_de_serieds = data.filterAdvanced.Numero_de_serieMultiple.join(",");
      condition += " AND Control_de_Componentes.Numero_de_serie In (" + Numero_de_serieds + ")";
    }
    switch (data.filterAdvanced.Capitulo_en_el_manualFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Componentes.Capitulo_en_el_manual LIKE '" + data.filterAdvanced.Capitulo_en_el_manual + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Componentes.Capitulo_en_el_manual LIKE '%" + data.filterAdvanced.Capitulo_en_el_manual + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Componentes.Capitulo_en_el_manual LIKE '%" + data.filterAdvanced.Capitulo_en_el_manual + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Componentes.Capitulo_en_el_manual = '" + data.filterAdvanced.Capitulo_en_el_manual + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Codigo_ATA != 'undefined' && data.filterAdvanced.Codigo_ATA)) {
      switch (data.filterAdvanced.Codigo_ATAFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '" + data.filterAdvanced.Codigo_ATA + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '%" + data.filterAdvanced.Codigo_ATA + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion LIKE '%" + data.filterAdvanced.Codigo_ATA + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Catalogo_codigo_ATA.Codigo_ATA_Descripcion = '" + data.filterAdvanced.Codigo_ATA + "'";
          break;
      }
    } else if (data.filterAdvanced.Codigo_ATAMultiple != null && data.filterAdvanced.Codigo_ATAMultiple.length > 0) {
      var Codigo_ATAds = data.filterAdvanced.Codigo_ATAMultiple.join(",");
      condition += " AND Control_de_Componentes.Codigo_ATA In (" + Codigo_ATAds + ")";
    }
    switch (data.filterAdvanced.Descripcion_de_actividadFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Componentes.Descripcion_de_actividad LIKE '" + data.filterAdvanced.Descripcion_de_actividad + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Componentes.Descripcion_de_actividad LIKE '%" + data.filterAdvanced.Descripcion_de_actividad + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Componentes.Descripcion_de_actividad LIKE '%" + data.filterAdvanced.Descripcion_de_actividad + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Componentes.Descripcion_de_actividad = '" + data.filterAdvanced.Descripcion_de_actividad + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus_de_componente != 'undefined' && data.filterAdvanced.Estatus_de_componente)) {
      switch (data.filterAdvanced.Estatus_de_componenteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_componente.Descripcion LIKE '" + data.filterAdvanced.Estatus_de_componente + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_componente.Descripcion LIKE '%" + data.filterAdvanced.Estatus_de_componente + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_componente.Descripcion LIKE '%" + data.filterAdvanced.Estatus_de_componente + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_componente.Descripcion = '" + data.filterAdvanced.Estatus_de_componente + "'";
          break;
      }
    } else if (data.filterAdvanced.Estatus_de_componenteMultiple != null && data.filterAdvanced.Estatus_de_componenteMultiple.length > 0) {
      var Estatus_de_componenteds = data.filterAdvanced.Estatus_de_componenteMultiple.join(",");
      condition += " AND Control_de_Componentes.Estatus_de_componente In (" + Estatus_de_componenteds + ")";
    }
    switch (data.filterAdvanced.Tiempo_de_ejecucionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Componentes.Tiempo_de_ejecucion LIKE '" + data.filterAdvanced.Tiempo_de_ejecucion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Componentes.Tiempo_de_ejecucion LIKE '%" + data.filterAdvanced.Tiempo_de_ejecucion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Componentes.Tiempo_de_ejecucion LIKE '%" + data.filterAdvanced.Tiempo_de_ejecucion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Componentes.Tiempo_de_ejecucion = '" + data.filterAdvanced.Tiempo_de_ejecucion + "'";
        break;
    }
    switch (data.filterAdvanced.Velocidad_en_nudosFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Componentes.Velocidad_en_nudos LIKE '" + data.filterAdvanced.Velocidad_en_nudos + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Componentes.Velocidad_en_nudos LIKE '%" + data.filterAdvanced.Velocidad_en_nudos + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Componentes.Velocidad_en_nudos LIKE '%" + data.filterAdvanced.Velocidad_en_nudos + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Componentes.Velocidad_en_nudos = '" + data.filterAdvanced.Velocidad_en_nudos + "'";
        break;
    }
    switch (data.filterAdvanced.Color_de_la_cubiertaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Componentes.Color_de_la_cubierta LIKE '" + data.filterAdvanced.Color_de_la_cubierta + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Componentes.Color_de_la_cubierta LIKE '%" + data.filterAdvanced.Color_de_la_cubierta + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Componentes.Color_de_la_cubierta LIKE '%" + data.filterAdvanced.Color_de_la_cubierta + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Componentes.Color_de_la_cubierta = '" + data.filterAdvanced.Color_de_la_cubierta + "'";
        break;
    }
    switch (data.filterAdvanced.Color_de_la_aeronaveFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Componentes.Color_de_la_aeronave LIKE '" + data.filterAdvanced.Color_de_la_aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Componentes.Color_de_la_aeronave LIKE '%" + data.filterAdvanced.Color_de_la_aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Componentes.Color_de_la_aeronave LIKE '%" + data.filterAdvanced.Color_de_la_aeronave + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Componentes.Color_de_la_aeronave = '" + data.filterAdvanced.Color_de_la_aeronave + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Clasificacion_de_aeronavegabilidad != 'undefined' && data.filterAdvanced.Clasificacion_de_aeronavegabilidad)) {
      switch (data.filterAdvanced.Clasificacion_de_aeronavegabilidadFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Clasificacion_de_aeronavegabilidad.Descripcion LIKE '" + data.filterAdvanced.Clasificacion_de_aeronavegabilidad + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Clasificacion_de_aeronavegabilidad.Descripcion LIKE '%" + data.filterAdvanced.Clasificacion_de_aeronavegabilidad + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Clasificacion_de_aeronavegabilidad.Descripcion LIKE '%" + data.filterAdvanced.Clasificacion_de_aeronavegabilidad + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Clasificacion_de_aeronavegabilidad.Descripcion = '" + data.filterAdvanced.Clasificacion_de_aeronavegabilidad + "'";
          break;
      }
    } else if (data.filterAdvanced.Clasificacion_de_aeronavegabilidadMultiple != null && data.filterAdvanced.Clasificacion_de_aeronavegabilidadMultiple.length > 0) {
      var Clasificacion_de_aeronavegabilidadds = data.filterAdvanced.Clasificacion_de_aeronavegabilidadMultiple.join(",");
      condition += " AND Control_de_Componentes.Clasificacion_de_aeronavegabilidad In (" + Clasificacion_de_aeronavegabilidadds + ")";
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
          } else if (column != 'acciones'  && column != 'Instrucciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Control_de_Componentess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Control_de_Componentess);
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
