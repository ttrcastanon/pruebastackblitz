import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Boletines_Directivas_aeronavegatibilidadService } from "src/app/api-services/Boletines_Directivas_aeronavegatibilidad.service";
import { Boletines_Directivas_aeronavegatibilidad } from "src/app/models/Boletines_Directivas_aeronavegatibilidad";
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
import { Boletines_Directivas_aeronavegatibilidadIndexRules } from 'src/app/shared/businessRules/Boletines_Directivas_aeronavegatibilidad-index-rules';
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
  selector: "app-list-Boletines_Directivas_aeronavegatibilidad",
  templateUrl: "./list-Boletines_Directivas_aeronavegatibilidad.component.html",
  styleUrls: ["./list-Boletines_Directivas_aeronavegatibilidad.component.scss"],
})
export class ListBoletines_Directivas_aeronavegatibilidadComponent extends Boletines_Directivas_aeronavegatibilidadIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Aeronave",
    "Modelo",
    "N_Serie",
    "Procedencia",
    "Tipo",
    "N_de_boletin_directiva_aeronavegabilidad",
    "titulo_de_boletin_o_directiva",
    "Codigo_ATA",
    "Fecha_de_creacion",
    "Crear_reporte",
    "Horas",
    "Dias",
    "Meses",
    "Ciclos",
    "Es_recurrente",
    "LimitesEnDias",
    "DiasTranscurridos",
    "DiasFaltantes",
    "HorasFaltantes",
    "CiclosFaltantes",
    "Estatus",
    "HorasTranscurridas",
    "MesesTranscurridos",
    "MesesFaltantes",
    "CiclosTranscurridos",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Aeronave",
      "Modelo",
      "N_Serie",
      "Procedencia",
      "Tipo",
      "N_de_boletin_directiva_aeronavegabilidad",
      "titulo_de_boletin_o_directiva",
      "Codigo_ATA",
      "Fecha_de_creacion",
      "Crear_reporte",
      "Horas",
      "Dias",
      "Meses",
      "Ciclos",
      "Es_recurrente",
      "LimitesEnDias",
      "DiasTranscurridos",
      "DiasFaltantes",
      "HorasFaltantes",
      "CiclosFaltantes",
      "Estatus",
      "HorasTranscurridas",
      "MesesTranscurridos",
      "MesesFaltantes",
      "CiclosTranscurridos",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Aeronave_filtro",
      "Modelo_filtro",
      "N_Serie_filtro",
      "Procedencia_filtro",
      "Tipo_filtro",
      "N_de_boletin_directiva_aeronavegabilidad_filtro",
      "titulo_de_boletin_o_directiva_filtro",
      "Codigo_ATA_filtro",
      "Fecha_de_creacion_filtro",
      "Crear_reporte_filtro",
      "Horas_filtro",
      "Dias_filtro",
      "Meses_filtro",
      "Ciclos_filtro",
      "Es_recurrente_filtro",
      "LimitesEnDias_filtro",
      "DiasTranscurridos_filtro",
      "DiasFaltantes_filtro",
      "HorasFaltantes_filtro",
      "CiclosFaltantes_filtro",
      "Estatus_filtro",
      "HorasTranscurridas_filtro",
      "MesesTranscurridos_filtro",
      "MesesFaltantes_filtro",
      "CiclosTranscurridos_filtro",

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
      Aeronave: "",
      Modelo: "",
      N_Serie: "",
      Procedencia: "",
      Tipo: "",
      N_de_boletin_directiva_aeronavegabilidad: "",
      titulo_de_boletin_o_directiva: "",
      Codigo_ATA: "",
      Fecha_de_creacion: null,
      Crear_reporte: "",
      Horas: "",
      Dias: "",
      Meses: "",
      Ciclos: "",
      Es_recurrente: "",
      LimitesEnDias: "",
      DiasTranscurridos: "",
      DiasFaltantes: "",
      HorasFaltantes: "",
      CiclosFaltantes: "",
      Estatus: "",
      HorasTranscurridas: "",
      MesesTranscurridos: "",
      MesesFaltantes: "",
      CiclosTranscurridos: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      AeronaveFilter: "",
      Aeronave: "",
      AeronaveMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      N_SerieFilter: "",
      N_Serie: "",
      N_SerieMultiple: "",
      ProcedenciaFilter: "",
      Procedencia: "",
      ProcedenciaMultiple: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",
      Codigo_ATAFilter: "",
      Codigo_ATA: "",
      Codigo_ATAMultiple: "",
      fromFecha_de_creacion: "",
      toFecha_de_creacion: "",
      fromHoras: "",
      toHoras: "",
      fromDias: "",
      toDias: "",
      fromMeses: "",
      toMeses: "",
      fromCiclos: "",
      toCiclos: "",
      fromLimitesEnDias: "",
      toLimitesEnDias: "",
      fromDiasTranscurridos: "",
      toDiasTranscurridos: "",
      fromDiasFaltantes: "",
      toDiasFaltantes: "",
      fromHorasFaltantes: "",
      toHorasFaltantes: "",
      fromCiclosFaltantes: "",
      toCiclosFaltantes: "",
      fromHorasTranscurridas: "",
      toHorasTranscurridas: "",
      fromMesesTranscurridos: "",
      toMesesTranscurridos: "",
      fromMesesFaltantes: "",
      toMesesFaltantes: "",
      fromCiclosTranscurridos: "",
      toCiclosTranscurridos: "",

    }
  };

  dataSource: Boletines_Directivas_aeronavegatibilidadDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Boletines_Directivas_aeronavegatibilidadDataSource;
  dataClipboard: any;
  phase: any;
  nombrePantalla: string = "Boletines / directivas aeronavegabilidad";

  constructor(
    private _Boletines_Directivas_aeronavegatibilidadService: Boletines_Directivas_aeronavegatibilidadService,
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
    private activateRoute: ActivatedRoute,
    private route: Router, renderer: Renderer2
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
          this.route.navigateByUrl("/Boletines_Directivas_aeronavegatibilidad/add");
        }
        if(this.phase == 2) {
          this.nombrePantalla = "Lista de Boletines";
        }
        if(this.phase == 3) {
          this.nombrePantalla = "Lista de Directivas";
        }

        if (this.localStorageHelper.getItemFromLocalStorage("QueryParamBDA") != this.phase) {
          this.localStorageHelper.setItemToLocalStorage("QueryParamBDA", this.phase);
          this.ngOnInit();
        }

      });

    this.rulesBeforeCreationList();
    this.dataSource = new Boletines_Directivas_aeronavegatibilidadDataSource(
      this._Boletines_Directivas_aeronavegatibilidadService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Boletines_Directivas_aeronavegatibilidad)
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
    this.listConfig.filter.Aeronave = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.N_Serie = "";
    this.listConfig.filter.Procedencia = "";
    this.listConfig.filter.Tipo = "";
    this.listConfig.filter.N_de_boletin_directiva_aeronavegabilidad = "";
    this.listConfig.filter.titulo_de_boletin_o_directiva = "";
    this.listConfig.filter.Codigo_ATA = "";
    this.listConfig.filter.Fecha_de_creacion = undefined;
    this.listConfig.filter.Crear_reporte = undefined;
    this.listConfig.filter.Horas = "";
    this.listConfig.filter.Dias = "";
    this.listConfig.filter.Meses = "";
    this.listConfig.filter.Ciclos = "";
    this.listConfig.filter.Es_recurrente = undefined;
    this.listConfig.filter.LimitesEnDias = "";
    this.listConfig.filter.DiasTranscurridos = "";
    this.listConfig.filter.DiasFaltantes = "";
    this.listConfig.filter.HorasFaltantes = "";
    this.listConfig.filter.CiclosFaltantes = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.HorasTranscurridas = "";
    this.listConfig.filter.MesesTranscurridos = "";
    this.listConfig.filter.MesesFaltantes = "";
    this.listConfig.filter.CiclosTranscurridos = "";

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

//INICIA - BRID:4490 - WF:6 Rule List - Phase: 2 (Lista de Boletines) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
if(this.phase == this.brf.TryParseInt('2', '2')) { 
  this.brf.SetFilteronList(this.listConfig," Boletines_Directivas_aeronavegatibilidad.Procedencia = 1 ");
} else {}
//TERMINA - BRID:4490


//INICIA - BRID:4492 - WF:6 Rule List - Phase: 3 (Lista de Directivas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
if(this.phase == this.brf.TryParseInt('3', '3')) { 
  this.brf.SetFilteronList(this.listConfig," Boletines_Directivas_aeronavegatibilidad.Procedencia = 2 ");
} else {}
//TERMINA - BRID:4492

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

  remove(row: Boletines_Directivas_aeronavegatibilidad) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Boletines_Directivas_aeronavegatibilidadService
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
  ActionPrint(dataRow: Boletines_Directivas_aeronavegatibilidad) {

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
,'Matricula'
,'Modelo'
,'N° Serie'
,'Procedencia'
,'Tipo'
,'N° de boletín/directiva aeronavegabilidad'
,'Título de boletín/directiva aeronavegabilidad'
,'Código ATA'
,'Fecha de efectividad'
,'¿Crear reporte?'
,'Horas'
,'Días'
,'Meses'
,'Ciclos'
,'¿Es recurrente?'
,'LimitesEnDias'
,'DiasTranscurridos'
,'DiasFaltantes'
,'HorasFaltantes'
,'CiclosFaltantes'
,'Estatus'
,'HorasTranscurridas'
,'MesesTranscurridos'
,'MesesFaltantes'
,'CiclosTranscurridos'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Aeronave_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.N_Serie_Aeronave.Numero_de_Serie
,x.Procedencia_Procedencia.Descripcion
,x.Tipo_Tipo_de_urgencia.Urgencia
,x.N_de_boletin_directiva_aeronavegabilidad
,x.titulo_de_boletin_o_directiva
,x.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion
,x.Fecha_de_creacion
,x.Crear_reporte
,x.Horas
,x.Dias
,x.Meses
,x.Ciclos
,x.Es_recurrente
,x.LimitesEnDias
,x.DiasTranscurridos
,x.DiasFaltantes
,x.HorasFaltantes
,x.CiclosFaltantes
,x.Estatus
,x.HorasTranscurridas
,x.MesesTranscurridos
,x.MesesFaltantes
,x.CiclosTranscurridos
		  
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
    pdfMake.createPdf(pdfDefinition).download('Boletines_Directivas_aeronavegatibilidad.pdf');
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
          this._Boletines_Directivas_aeronavegatibilidadService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Boletines_Directivas_aeronavegatibilidads;
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
          this._Boletines_Directivas_aeronavegatibilidadService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Boletines_Directivas_aeronavegatibilidads;
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
        'Matricula ': fields.Aeronave_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'N° Serie ': fields.N_Serie_Aeronave.Numero_de_Serie,
        'Procedencia ': fields.Procedencia_Procedencia.Descripcion,
        'Tipo ': fields.Tipo_Tipo_de_urgencia.Urgencia,
        'N° de boletín/directiva aeronavegabilidad ': fields.N_de_boletin_directiva_aeronavegabilidad,
        'Título de boletín/directiva aeronavegabilidad ': fields.titulo_de_boletin_o_directiva,
        'Código ATA ': fields.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
        'Fecha de efectividad ': fields.Fecha_de_creacion ? momentJS(fields.Fecha_de_creacion).format('DD/MM/YYYY') : '',
        'Crear_reporte ': fields.Crear_reporte ? 'SI' : 'NO',
        'Horas ': fields.Horas,
        'Días ': fields.Dias,
        'Meses ': fields.Meses,
        'Ciclos ': fields.Ciclos,
        'Es_recurrente ': fields.Es_recurrente ? 'SI' : 'NO',
        'LimitesEnDias ': fields.LimitesEnDias,
        'DiasTranscurridos ': fields.DiasTranscurridos,
        'DiasFaltantes ': fields.DiasFaltantes,
        'HorasFaltantes ': fields.HorasFaltantes,
        'CiclosFaltantes ': fields.CiclosFaltantes,
        'Estatus ': fields.Estatus,
        'HorasTranscurridas ': fields.HorasTranscurridas,
        'MesesTranscurridos ': fields.MesesTranscurridos,
        'MesesFaltantes ': fields.MesesFaltantes,
        'CiclosTranscurridos ': fields.CiclosTranscurridos,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Boletines_Directivas_aeronavegatibilidad  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Aeronave: x.Aeronave_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      N_Serie: x.N_Serie_Aeronave.Numero_de_Serie,
      Procedencia: x.Procedencia_Procedencia.Descripcion,
      Tipo: x.Tipo_Tipo_de_urgencia.Urgencia,
      N_de_boletin_directiva_aeronavegabilidad: x.N_de_boletin_directiva_aeronavegabilidad,
      titulo_de_boletin_o_directiva: x.titulo_de_boletin_o_directiva,
      Codigo_ATA: x.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
      Fecha_de_creacion: x.Fecha_de_creacion,
      Crear_reporte: x.Crear_reporte,
      Horas: x.Horas,
      Dias: x.Dias,
      Meses: x.Meses,
      Ciclos: x.Ciclos,
      Es_recurrente: x.Es_recurrente,
      LimitesEnDias: x.LimitesEnDias,
      DiasTranscurridos: x.DiasTranscurridos,
      DiasFaltantes: x.DiasFaltantes,
      HorasFaltantes: x.HorasFaltantes,
      CiclosFaltantes: x.CiclosFaltantes,
      Estatus: x.Estatus,
      HorasTranscurridas: x.HorasTranscurridas,
      MesesTranscurridos: x.MesesTranscurridos,
      MesesFaltantes: x.MesesFaltantes,
      CiclosTranscurridos: x.CiclosTranscurridos,

    }));

    this.excelService.exportToCsv(result, 'Boletines_Directivas_aeronavegatibilidad',  ['Folio'    ,'Aeronave'  ,'Modelo'  ,'N_Serie'  ,'Procedencia'  ,'Tipo'  ,'N_de_boletin_directiva_aeronavegabilidad'  ,'titulo_de_boletin_o_directiva'  ,'Codigo_ATA'  ,'Fecha_de_creacion'  ,'Crear_reporte'  ,'Horas'  ,'Dias'  ,'Meses'  ,'Ciclos'  ,'Es_recurrente'  ,'LimitesEnDias'  ,'DiasTranscurridos'  ,'DiasFaltantes'  ,'HorasFaltantes'  ,'CiclosFaltantes'  ,'Estatus'  ,'HorasTranscurridas'  ,'MesesTranscurridos'  ,'MesesFaltantes'  ,'CiclosTranscurridos' ]);
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
    template += '          <th>Matricula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>N° Serie</th>';
    template += '          <th>Procedencia</th>';
    template += '          <th>Tipo</th>';
    template += '          <th>N° de boletín/directiva aeronavegabilidad</th>';
    template += '          <th>Título de boletín/directiva aeronavegabilidad</th>';
    template += '          <th>Código ATA</th>';
    template += '          <th>Fecha de efectividad</th>';
    template += '          <th>¿Crear reporte?</th>';
    template += '          <th>Horas</th>';
    template += '          <th>Días</th>';
    template += '          <th>Meses</th>';
    template += '          <th>Ciclos</th>';
    template += '          <th>¿Es recurrente?</th>';
    template += '          <th>LimitesEnDias</th>';
    template += '          <th>DiasTranscurridos</th>';
    template += '          <th>DiasFaltantes</th>';
    template += '          <th>HorasFaltantes</th>';
    template += '          <th>CiclosFaltantes</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>HorasTranscurridas</th>';
    template += '          <th>MesesTranscurridos</th>';
    template += '          <th>MesesFaltantes</th>';
    template += '          <th>CiclosTranscurridos</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Aeronave_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.N_Serie_Aeronave.Numero_de_Serie + '</td>';
      template += '          <td>' + element.Procedencia_Procedencia.Descripcion + '</td>';
      template += '          <td>' + element.Tipo_Tipo_de_urgencia.Urgencia + '</td>';
      template += '          <td>' + element.N_de_boletin_directiva_aeronavegabilidad + '</td>';
      template += '          <td>' + element.titulo_de_boletin_o_directiva + '</td>';
      template += '          <td>' + element.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion + '</td>';
      template += '          <td>' + element.Fecha_de_creacion + '</td>';
      template += '          <td>' + element.Crear_reporte + '</td>';
      template += '          <td>' + element.Horas + '</td>';
      template += '          <td>' + element.Dias + '</td>';
      template += '          <td>' + element.Meses + '</td>';
      template += '          <td>' + element.Ciclos + '</td>';
      template += '          <td>' + element.Es_recurrente + '</td>';
      template += '          <td>' + element.LimitesEnDias + '</td>';
      template += '          <td>' + element.DiasTranscurridos + '</td>';
      template += '          <td>' + element.DiasFaltantes + '</td>';
      template += '          <td>' + element.HorasFaltantes + '</td>';
      template += '          <td>' + element.CiclosFaltantes + '</td>';
      template += '          <td>' + element.Estatus + '</td>';
      template += '          <td>' + element.HorasTranscurridas + '</td>';
      template += '          <td>' + element.MesesTranscurridos + '</td>';
      template += '          <td>' + element.MesesFaltantes + '</td>';
      template += '          <td>' + element.CiclosTranscurridos + '</td>';
		  
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
	template += '\t Matricula';
	template += '\t Modelo';
	template += '\t N° Serie';
	template += '\t Procedencia';
	template += '\t Tipo';
	template += '\t N° de boletín/directiva aeronavegabilidad';
	template += '\t Título de boletín/directiva aeronavegabilidad';
	template += '\t Código ATA';
	template += '\t Fecha de efectividad';
	template += '\t ¿Crear reporte?';
	template += '\t Horas';
	template += '\t Días';
	template += '\t Meses';
	template += '\t Ciclos';
	template += '\t ¿Es recurrente?';
	template += '\t LimitesEnDias';
	template += '\t DiasTranscurridos';
	template += '\t DiasFaltantes';
	template += '\t HorasFaltantes';
	template += '\t CiclosFaltantes';
	template += '\t Estatus';
	template += '\t HorasTranscurridas';
	template += '\t MesesTranscurridos';
	template += '\t MesesFaltantes';
	template += '\t CiclosTranscurridos';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Aeronave_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.N_Serie_Aeronave.Numero_de_Serie;
      template += '\t ' + element.Procedencia_Procedencia.Descripcion;
      template += '\t ' + element.Tipo_Tipo_de_urgencia.Urgencia;
	  template += '\t ' + element.N_de_boletin_directiva_aeronavegabilidad;
	  template += '\t ' + element.titulo_de_boletin_o_directiva;
      template += '\t ' + element.Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion;
	  template += '\t ' + element.Fecha_de_creacion;
	  template += '\t ' + element.Crear_reporte;
	  template += '\t ' + element.Horas;
	  template += '\t ' + element.Dias;
	  template += '\t ' + element.Meses;
	  template += '\t ' + element.Ciclos;
	  template += '\t ' + element.Es_recurrente;
	  template += '\t ' + element.LimitesEnDias;
	  template += '\t ' + element.DiasTranscurridos;
	  template += '\t ' + element.DiasFaltantes;
	  template += '\t ' + element.HorasFaltantes;
	  template += '\t ' + element.CiclosFaltantes;
	  template += '\t ' + element.Estatus;
	  template += '\t ' + element.HorasTranscurridas;
	  template += '\t ' + element.MesesTranscurridos;
	  template += '\t ' + element.MesesFaltantes;
	  template += '\t ' + element.CiclosTranscurridos;

	  template += '\n';
    });

    return template;
  }

}

export class Boletines_Directivas_aeronavegatibilidadDataSource implements DataSource<Boletines_Directivas_aeronavegatibilidad>
{
  private subject = new BehaviorSubject<Boletines_Directivas_aeronavegatibilidad[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Boletines_Directivas_aeronavegatibilidadService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Boletines_Directivas_aeronavegatibilidad[]> {
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
              const longest = result.Boletines_Directivas_aeronavegatibilidads.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Boletines_Directivas_aeronavegatibilidads);
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
      condition += " and Boletines_Directivas_aeronavegatibilidad.Folio = " + data.filter.Folio;
    if (data.filter.Aeronave != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Aeronave + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.N_Serie != "")
      condition += " and Aeronave.Numero_de_Serie like '%" + data.filter.N_Serie + "%' ";
    if (data.filter.Procedencia != "")
      condition += " and Procedencia.Descripcion like '%" + data.filter.Procedencia + "%' ";
    if (data.filter.Tipo != "")
      condition += " and Tipo_de_urgencia.Urgencia like '%" + data.filter.Tipo + "%' ";
    if (data.filter.N_de_boletin_directiva_aeronavegabilidad != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.N_de_boletin_directiva_aeronavegabilidad like '%" + data.filter.N_de_boletin_directiva_aeronavegabilidad + "%' ";
    if (data.filter.titulo_de_boletin_o_directiva != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.titulo_de_boletin_o_directiva like '%" + data.filter.titulo_de_boletin_o_directiva + "%' ";
    if (data.filter.Codigo_ATA != "")
      condition += " and Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + data.filter.Codigo_ATA + "%' ";
    if (data.filter.Fecha_de_creacion)
      condition += " and CONVERT(VARCHAR(10), Boletines_Directivas_aeronavegatibilidad.Fecha_de_creacion, 102)  = '" + moment(data.filter.Fecha_de_creacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Crear_reporte && data.filter.Crear_reporte != "2") {
      if (data.filter.Crear_reporte == "0" || data.filter.Crear_reporte == "") {
        condition += " and (Boletines_Directivas_aeronavegatibilidad.Crear_reporte = 0 or Boletines_Directivas_aeronavegatibilidad.Crear_reporte is null)";
      } else {
        condition += " and Boletines_Directivas_aeronavegatibilidad.Crear_reporte = 1";
      }
    }
    if (data.filter.Horas != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.Horas = " + data.filter.Horas;
    if (data.filter.Dias != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.Dias = " + data.filter.Dias;
    if (data.filter.Meses != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.Meses = " + data.filter.Meses;
    if (data.filter.Ciclos != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.Ciclos = " + data.filter.Ciclos;
    if (data.filter.Es_recurrente && data.filter.Es_recurrente != "2") {
      if (data.filter.Es_recurrente == "0" || data.filter.Es_recurrente == "") {
        condition += " and (Boletines_Directivas_aeronavegatibilidad.Es_recurrente = 0 or Boletines_Directivas_aeronavegatibilidad.Es_recurrente is null)";
      } else {
        condition += " and Boletines_Directivas_aeronavegatibilidad.Es_recurrente = 1";
      }
    }
    if (data.filter.LimitesEnDias != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.LimitesEnDias = " + data.filter.LimitesEnDias;
    if (data.filter.DiasTranscurridos != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.DiasTranscurridos = " + data.filter.DiasTranscurridos;
    if (data.filter.DiasFaltantes != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.DiasFaltantes = " + data.filter.DiasFaltantes;
    if (data.filter.HorasFaltantes != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.HorasFaltantes = " + data.filter.HorasFaltantes;
    if (data.filter.CiclosFaltantes != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.CiclosFaltantes = " + data.filter.CiclosFaltantes;
    if (data.filter.Estatus != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.Estatus like '%" + data.filter.Estatus + "%' ";
    if (data.filter.HorasTranscurridas != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.HorasTranscurridas = " + data.filter.HorasTranscurridas;
    if (data.filter.MesesTranscurridos != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.MesesTranscurridos = " + data.filter.MesesTranscurridos;
    if (data.filter.MesesFaltantes != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.MesesFaltantes = " + data.filter.MesesFaltantes;
    if (data.filter.CiclosTranscurridos != "")
      condition += " and Boletines_Directivas_aeronavegatibilidad.CiclosTranscurridos = " + data.filter.CiclosTranscurridos;

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
        sort = " Boletines_Directivas_aeronavegatibilidad.Folio " + data.sortDirecction;
        break;
      case "Aeronave":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "N_Serie":
        sort = " Aeronave.Numero_de_Serie " + data.sortDirecction;
        break;
      case "Procedencia":
        sort = " Procedencia.Descripcion " + data.sortDirecction;
        break;
      case "Tipo":
        sort = " Tipo_de_urgencia.Urgencia " + data.sortDirecction;
        break;
      case "N_de_boletin_directiva_aeronavegabilidad":
        sort = " Boletines_Directivas_aeronavegatibilidad.N_de_boletin_directiva_aeronavegabilidad " + data.sortDirecction;
        break;
      case "titulo_de_boletin_o_directiva":
        sort = " Boletines_Directivas_aeronavegatibilidad.titulo_de_boletin_o_directiva " + data.sortDirecction;
        break;
      case "Codigo_ATA":
        sort = " Catalogo_codigo_ATA.Codigo_ATA_Descripcion " + data.sortDirecction;
        break;
      case "Fecha_de_creacion":
        sort = " Boletines_Directivas_aeronavegatibilidad.Fecha_de_creacion " + data.sortDirecction;
        break;
      case "Crear_reporte":
        sort = " Boletines_Directivas_aeronavegatibilidad.Crear_reporte " + data.sortDirecction;
        break;
      case "Horas":
        sort = " Boletines_Directivas_aeronavegatibilidad.Horas " + data.sortDirecction;
        break;
      case "Dias":
        sort = " Boletines_Directivas_aeronavegatibilidad.Dias " + data.sortDirecction;
        break;
      case "Meses":
        sort = " Boletines_Directivas_aeronavegatibilidad.Meses " + data.sortDirecction;
        break;
      case "Ciclos":
        sort = " Boletines_Directivas_aeronavegatibilidad.Ciclos " + data.sortDirecction;
        break;
      case "Es_recurrente":
        sort = " Boletines_Directivas_aeronavegatibilidad.Es_recurrente " + data.sortDirecction;
        break;
      case "LimitesEnDias":
        sort = " Boletines_Directivas_aeronavegatibilidad.LimitesEnDias " + data.sortDirecction;
        break;
      case "DiasTranscurridos":
        sort = " Boletines_Directivas_aeronavegatibilidad.DiasTranscurridos " + data.sortDirecction;
        break;
      case "DiasFaltantes":
        sort = " Boletines_Directivas_aeronavegatibilidad.DiasFaltantes " + data.sortDirecction;
        break;
      case "HorasFaltantes":
        sort = " Boletines_Directivas_aeronavegatibilidad.HorasFaltantes " + data.sortDirecction;
        break;
      case "CiclosFaltantes":
        sort = " Boletines_Directivas_aeronavegatibilidad.CiclosFaltantes " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Boletines_Directivas_aeronavegatibilidad.Estatus " + data.sortDirecction;
        break;
      case "HorasTranscurridas":
        sort = " Boletines_Directivas_aeronavegatibilidad.HorasTranscurridas " + data.sortDirecction;
        break;
      case "MesesTranscurridos":
        sort = " Boletines_Directivas_aeronavegatibilidad.MesesTranscurridos " + data.sortDirecction;
        break;
      case "MesesFaltantes":
        sort = " Boletines_Directivas_aeronavegatibilidad.MesesFaltantes " + data.sortDirecction;
        break;
      case "CiclosTranscurridos":
        sort = " Boletines_Directivas_aeronavegatibilidad.CiclosTranscurridos " + data.sortDirecction;
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
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Aeronave != 'undefined' && data.filterAdvanced.Aeronave)) {
      switch (data.filterAdvanced.AeronaveFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeronave.Matricula LIKE '" + data.filterAdvanced.Aeronave + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Aeronave + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Aeronave + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeronave.Matricula = '" + data.filterAdvanced.Aeronave + "'";
          break;
      }
    } else if (data.filterAdvanced.AeronaveMultiple != null && data.filterAdvanced.AeronaveMultiple.length > 0) {
      var Aeronaveds = data.filterAdvanced.AeronaveMultiple.join(",");
      condition += " AND Boletines_Directivas_aeronavegatibilidad.Aeronave In (" + Aeronaveds + ")";
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
      condition += " AND Boletines_Directivas_aeronavegatibilidad.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.N_Serie != 'undefined' && data.filterAdvanced.N_Serie)) {
      switch (data.filterAdvanced.N_SerieFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeronave.Numero_de_Serie LIKE '" + data.filterAdvanced.N_Serie + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.N_Serie + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.N_Serie + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeronave.Numero_de_Serie = '" + data.filterAdvanced.N_Serie + "'";
          break;
      }
    } else if (data.filterAdvanced.N_SerieMultiple != null && data.filterAdvanced.N_SerieMultiple.length > 0) {
      var N_Serieds = data.filterAdvanced.N_SerieMultiple.join(",");
      condition += " AND Boletines_Directivas_aeronavegatibilidad.N_Serie In (" + N_Serieds + ")";
    }
    if ((typeof data.filterAdvanced.Procedencia != 'undefined' && data.filterAdvanced.Procedencia)) {
      switch (data.filterAdvanced.ProcedenciaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Procedencia.Descripcion LIKE '" + data.filterAdvanced.Procedencia + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Procedencia.Descripcion LIKE '%" + data.filterAdvanced.Procedencia + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Procedencia.Descripcion LIKE '%" + data.filterAdvanced.Procedencia + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Procedencia.Descripcion = '" + data.filterAdvanced.Procedencia + "'";
          break;
      }
    } else if (data.filterAdvanced.ProcedenciaMultiple != null && data.filterAdvanced.ProcedenciaMultiple.length > 0) {
      var Procedenciads = data.filterAdvanced.ProcedenciaMultiple.join(",");
      condition += " AND Boletines_Directivas_aeronavegatibilidad.Procedencia In (" + Procedenciads + ")";
    }
    if ((typeof data.filterAdvanced.Tipo != 'undefined' && data.filterAdvanced.Tipo)) {
      switch (data.filterAdvanced.TipoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_urgencia.Urgencia LIKE '" + data.filterAdvanced.Tipo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_urgencia.Urgencia LIKE '%" + data.filterAdvanced.Tipo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_urgencia.Urgencia LIKE '%" + data.filterAdvanced.Tipo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_urgencia.Urgencia = '" + data.filterAdvanced.Tipo + "'";
          break;
      }
    } else if (data.filterAdvanced.TipoMultiple != null && data.filterAdvanced.TipoMultiple.length > 0) {
      var Tipods = data.filterAdvanced.TipoMultiple.join(",");
      condition += " AND Boletines_Directivas_aeronavegatibilidad.Tipo In (" + Tipods + ")";
    }
    switch (data.filterAdvanced.N_de_boletin_directiva_aeronavegabilidadFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.N_de_boletin_directiva_aeronavegabilidad LIKE '" + data.filterAdvanced.N_de_boletin_directiva_aeronavegabilidad + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.N_de_boletin_directiva_aeronavegabilidad LIKE '%" + data.filterAdvanced.N_de_boletin_directiva_aeronavegabilidad + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.N_de_boletin_directiva_aeronavegabilidad LIKE '%" + data.filterAdvanced.N_de_boletin_directiva_aeronavegabilidad + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.N_de_boletin_directiva_aeronavegabilidad = '" + data.filterAdvanced.N_de_boletin_directiva_aeronavegabilidad + "'";
        break;
    }
    switch (data.filterAdvanced.titulo_de_boletin_o_directivaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.titulo_de_boletin_o_directiva LIKE '" + data.filterAdvanced.titulo_de_boletin_o_directiva + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.titulo_de_boletin_o_directiva LIKE '%" + data.filterAdvanced.titulo_de_boletin_o_directiva + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.titulo_de_boletin_o_directiva LIKE '%" + data.filterAdvanced.titulo_de_boletin_o_directiva + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.titulo_de_boletin_o_directiva = '" + data.filterAdvanced.titulo_de_boletin_o_directiva + "'";
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
      condition += " AND Boletines_Directivas_aeronavegatibilidad.Codigo_ATA In (" + Codigo_ATAds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_creacion != 'undefined' && data.filterAdvanced.fromFecha_de_creacion)
	|| (typeof data.filterAdvanced.toFecha_de_creacion != 'undefined' && data.filterAdvanced.toFecha_de_creacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_creacion != 'undefined' && data.filterAdvanced.fromFecha_de_creacion) 
        condition += " and CONVERT(VARCHAR(10), Boletines_Directivas_aeronavegatibilidad.Fecha_de_creacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_creacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_creacion != 'undefined' && data.filterAdvanced.toFecha_de_creacion) 
        condition += " and CONVERT(VARCHAR(10), Boletines_Directivas_aeronavegatibilidad.Fecha_de_creacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_creacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHoras != 'undefined' && data.filterAdvanced.fromHoras)
	|| (typeof data.filterAdvanced.toHoras != 'undefined' && data.filterAdvanced.toHoras)) 
	{
      if (typeof data.filterAdvanced.fromHoras != 'undefined' && data.filterAdvanced.fromHoras)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Horas >= " + data.filterAdvanced.fromHoras;

      if (typeof data.filterAdvanced.toHoras != 'undefined' && data.filterAdvanced.toHoras) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Horas <= " + data.filterAdvanced.toHoras;
    }
    if ((typeof data.filterAdvanced.fromDias != 'undefined' && data.filterAdvanced.fromDias)
	|| (typeof data.filterAdvanced.toDias != 'undefined' && data.filterAdvanced.toDias)) 
	{
      if (typeof data.filterAdvanced.fromDias != 'undefined' && data.filterAdvanced.fromDias)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Dias >= " + data.filterAdvanced.fromDias;

      if (typeof data.filterAdvanced.toDias != 'undefined' && data.filterAdvanced.toDias) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Dias <= " + data.filterAdvanced.toDias;
    }
    if ((typeof data.filterAdvanced.fromMeses != 'undefined' && data.filterAdvanced.fromMeses)
	|| (typeof data.filterAdvanced.toMeses != 'undefined' && data.filterAdvanced.toMeses)) 
	{
      if (typeof data.filterAdvanced.fromMeses != 'undefined' && data.filterAdvanced.fromMeses)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Meses >= " + data.filterAdvanced.fromMeses;

      if (typeof data.filterAdvanced.toMeses != 'undefined' && data.filterAdvanced.toMeses) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Meses <= " + data.filterAdvanced.toMeses;
    }
    if ((typeof data.filterAdvanced.fromCiclos != 'undefined' && data.filterAdvanced.fromCiclos)
	|| (typeof data.filterAdvanced.toCiclos != 'undefined' && data.filterAdvanced.toCiclos)) 
	{
      if (typeof data.filterAdvanced.fromCiclos != 'undefined' && data.filterAdvanced.fromCiclos)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Ciclos >= " + data.filterAdvanced.fromCiclos;

      if (typeof data.filterAdvanced.toCiclos != 'undefined' && data.filterAdvanced.toCiclos) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Ciclos <= " + data.filterAdvanced.toCiclos;
    }
    if ((typeof data.filterAdvanced.fromLimitesEnDias != 'undefined' && data.filterAdvanced.fromLimitesEnDias)
	|| (typeof data.filterAdvanced.toLimitesEnDias != 'undefined' && data.filterAdvanced.toLimitesEnDias)) 
	{
      if (typeof data.filterAdvanced.fromLimitesEnDias != 'undefined' && data.filterAdvanced.fromLimitesEnDias)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.LimitesEnDias >= " + data.filterAdvanced.fromLimitesEnDias;

      if (typeof data.filterAdvanced.toLimitesEnDias != 'undefined' && data.filterAdvanced.toLimitesEnDias) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.LimitesEnDias <= " + data.filterAdvanced.toLimitesEnDias;
    }
    if ((typeof data.filterAdvanced.fromDiasTranscurridos != 'undefined' && data.filterAdvanced.fromDiasTranscurridos)
	|| (typeof data.filterAdvanced.toDiasTranscurridos != 'undefined' && data.filterAdvanced.toDiasTranscurridos)) 
	{
      if (typeof data.filterAdvanced.fromDiasTranscurridos != 'undefined' && data.filterAdvanced.fromDiasTranscurridos)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.DiasTranscurridos >= " + data.filterAdvanced.fromDiasTranscurridos;

      if (typeof data.filterAdvanced.toDiasTranscurridos != 'undefined' && data.filterAdvanced.toDiasTranscurridos) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.DiasTranscurridos <= " + data.filterAdvanced.toDiasTranscurridos;
    }
    if ((typeof data.filterAdvanced.fromDiasFaltantes != 'undefined' && data.filterAdvanced.fromDiasFaltantes)
	|| (typeof data.filterAdvanced.toDiasFaltantes != 'undefined' && data.filterAdvanced.toDiasFaltantes)) 
	{
      if (typeof data.filterAdvanced.fromDiasFaltantes != 'undefined' && data.filterAdvanced.fromDiasFaltantes)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.DiasFaltantes >= " + data.filterAdvanced.fromDiasFaltantes;

      if (typeof data.filterAdvanced.toDiasFaltantes != 'undefined' && data.filterAdvanced.toDiasFaltantes) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.DiasFaltantes <= " + data.filterAdvanced.toDiasFaltantes;
    }
    if ((typeof data.filterAdvanced.fromHorasFaltantes != 'undefined' && data.filterAdvanced.fromHorasFaltantes)
	|| (typeof data.filterAdvanced.toHorasFaltantes != 'undefined' && data.filterAdvanced.toHorasFaltantes)) 
	{
      if (typeof data.filterAdvanced.fromHorasFaltantes != 'undefined' && data.filterAdvanced.fromHorasFaltantes)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.HorasFaltantes >= " + data.filterAdvanced.fromHorasFaltantes;

      if (typeof data.filterAdvanced.toHorasFaltantes != 'undefined' && data.filterAdvanced.toHorasFaltantes) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.HorasFaltantes <= " + data.filterAdvanced.toHorasFaltantes;
    }
    if ((typeof data.filterAdvanced.fromCiclosFaltantes != 'undefined' && data.filterAdvanced.fromCiclosFaltantes)
	|| (typeof data.filterAdvanced.toCiclosFaltantes != 'undefined' && data.filterAdvanced.toCiclosFaltantes)) 
	{
      if (typeof data.filterAdvanced.fromCiclosFaltantes != 'undefined' && data.filterAdvanced.fromCiclosFaltantes)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.CiclosFaltantes >= " + data.filterAdvanced.fromCiclosFaltantes;

      if (typeof data.filterAdvanced.toCiclosFaltantes != 'undefined' && data.filterAdvanced.toCiclosFaltantes) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.CiclosFaltantes <= " + data.filterAdvanced.toCiclosFaltantes;
    }
    switch (data.filterAdvanced.EstatusFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Estatus LIKE '" + data.filterAdvanced.Estatus + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Estatus LIKE '%" + data.filterAdvanced.Estatus + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Estatus LIKE '%" + data.filterAdvanced.Estatus + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Boletines_Directivas_aeronavegatibilidad.Estatus = '" + data.filterAdvanced.Estatus + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromHorasTranscurridas != 'undefined' && data.filterAdvanced.fromHorasTranscurridas)
	|| (typeof data.filterAdvanced.toHorasTranscurridas != 'undefined' && data.filterAdvanced.toHorasTranscurridas)) 
	{
      if (typeof data.filterAdvanced.fromHorasTranscurridas != 'undefined' && data.filterAdvanced.fromHorasTranscurridas)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.HorasTranscurridas >= " + data.filterAdvanced.fromHorasTranscurridas;

      if (typeof data.filterAdvanced.toHorasTranscurridas != 'undefined' && data.filterAdvanced.toHorasTranscurridas) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.HorasTranscurridas <= " + data.filterAdvanced.toHorasTranscurridas;
    }
    if ((typeof data.filterAdvanced.fromMesesTranscurridos != 'undefined' && data.filterAdvanced.fromMesesTranscurridos)
	|| (typeof data.filterAdvanced.toMesesTranscurridos != 'undefined' && data.filterAdvanced.toMesesTranscurridos)) 
	{
      if (typeof data.filterAdvanced.fromMesesTranscurridos != 'undefined' && data.filterAdvanced.fromMesesTranscurridos)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.MesesTranscurridos >= " + data.filterAdvanced.fromMesesTranscurridos;

      if (typeof data.filterAdvanced.toMesesTranscurridos != 'undefined' && data.filterAdvanced.toMesesTranscurridos) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.MesesTranscurridos <= " + data.filterAdvanced.toMesesTranscurridos;
    }
    if ((typeof data.filterAdvanced.fromMesesFaltantes != 'undefined' && data.filterAdvanced.fromMesesFaltantes)
	|| (typeof data.filterAdvanced.toMesesFaltantes != 'undefined' && data.filterAdvanced.toMesesFaltantes)) 
	{
      if (typeof data.filterAdvanced.fromMesesFaltantes != 'undefined' && data.filterAdvanced.fromMesesFaltantes)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.MesesFaltantes >= " + data.filterAdvanced.fromMesesFaltantes;

      if (typeof data.filterAdvanced.toMesesFaltantes != 'undefined' && data.filterAdvanced.toMesesFaltantes) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.MesesFaltantes <= " + data.filterAdvanced.toMesesFaltantes;
    }
    if ((typeof data.filterAdvanced.fromCiclosTranscurridos != 'undefined' && data.filterAdvanced.fromCiclosTranscurridos)
	|| (typeof data.filterAdvanced.toCiclosTranscurridos != 'undefined' && data.filterAdvanced.toCiclosTranscurridos)) 
	{
      if (typeof data.filterAdvanced.fromCiclosTranscurridos != 'undefined' && data.filterAdvanced.fromCiclosTranscurridos)
        condition += " AND Boletines_Directivas_aeronavegatibilidad.CiclosTranscurridos >= " + data.filterAdvanced.fromCiclosTranscurridos;

      if (typeof data.filterAdvanced.toCiclosTranscurridos != 'undefined' && data.filterAdvanced.toCiclosTranscurridos) 
        condition += " AND Boletines_Directivas_aeronavegatibilidad.CiclosTranscurridos <= " + data.filterAdvanced.toCiclosTranscurridos;
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
              const longest = result.Boletines_Directivas_aeronavegatibilidads.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Boletines_Directivas_aeronavegatibilidads);
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
