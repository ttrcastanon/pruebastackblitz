import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { AeronaveService } from "src/app/api-services/Aeronave.service";
import { Aeronave } from "src/app/models/Aeronave";
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
import { AeronaveIndexRules } from 'src/app/shared/businessRules/Aeronave-index-rules';
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
  selector: "app-list-Aeronave",
  templateUrl: "./list-Aeronave.component.html",
  styleUrls: ["./list-Aeronave.component.scss"],
})
export class ListAeronaveComponent extends AeronaveIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Matricula",
    "Modelo",
    "Propietario",
    "Fabricante",
    "Numero_de_Serie",
    "Cliente",
    "Ano_de_Fabricacion",
    "Origen_de_Aeronave",
    "Propia",
    "Estatus",
    "Operaciones",
    "Mantenimiento",
    "Capacidad_de_pasajeros",
    "Nivel_de_ruido",
    "Turbulencia",
    "Equipo_de_navegacion",
    "UHV",
    "VHF",
    "ELT",
    "Desierto",
    "Polar",
    "Selva",
    "Maritimo",
    "Chalecos_salvavidas",
    "Numero_de_lanchas_salvavidas",
    "Capacidad",
    "Color_de_la_aeronave",
    "Color_cubierta_de_los_botes",
    "Velocidad",
    "Tipo_de_Ala",
    "UPA",
    "UPA_MODELO",
    "UPA_SERIE",
    "Ciclos_iniciales",
    "Ciclos_actuales",
    "Horas_iniciales",
    "Horas_actuales",
    "Inicio_de_operaciones",
    "Bitacora",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Matricula",
      "Modelo",
      "Propietario",
      "Fabricante",
      "Numero_de_Serie",
      "Cliente",
      "Ano_de_Fabricacion",
      "Origen_de_Aeronave",
      "Propia",
      "Estatus",
      "Operaciones",
      "Mantenimiento",
      "Capacidad_de_pasajeros",
      "Nivel_de_ruido",
      "Turbulencia",
      "Equipo_de_navegacion",
      "UHV",
      "VHF",
      "ELT",
      "Desierto",
      "Polar",
      "Selva",
      "Maritimo",
      "Chalecos_salvavidas",
      "Numero_de_lanchas_salvavidas",
      "Capacidad",
      "Color_de_la_aeronave",
      "Color_cubierta_de_los_botes",
      "Velocidad",
      "Tipo_de_Ala",
      "UPA",
      "UPA_MODELO",
      "UPA_SERIE",
      "Ciclos_iniciales",
      "Ciclos_actuales",
      "Horas_iniciales",
      "Horas_actuales",
      "Inicio_de_operaciones",
      "Bitacora",

    ],
    columns_filters: [
      "acciones_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Propietario_filtro",
      "Fabricante_filtro",
      "Numero_de_Serie_filtro",
      "Cliente_filtro",
      "Ano_de_Fabricacion_filtro",
      "Origen_de_Aeronave_filtro",
      "Propia_filtro",
      "Estatus_filtro",
      "Operaciones_filtro",
      "Mantenimiento_filtro",
      "Capacidad_de_pasajeros_filtro",
      "Nivel_de_ruido_filtro",
      "Turbulencia_filtro",
      "Equipo_de_navegacion_filtro",
      "UHV_filtro",
      "VHF_filtro",
      "ELT_filtro",
      "Desierto_filtro",
      "Polar_filtro",
      "Selva_filtro",
      "Maritimo_filtro",
      "Chalecos_salvavidas_filtro",
      "Numero_de_lanchas_salvavidas_filtro",
      "Capacidad_filtro",
      "Color_de_la_aeronave_filtro",
      "Color_cubierta_de_los_botes_filtro",
      "Velocidad_filtro",
      "Tipo_de_Ala_filtro",
      "UPA_filtro",
      "UPA_MODELO_filtro",
      "UPA_SERIE_filtro",
      "Ciclos_iniciales_filtro",
      "Ciclos_actuales_filtro",
      "Horas_iniciales_filtro",
      "Horas_actuales_filtro",
      "Inicio_de_operaciones_filtro",
      "Bitacora_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Matricula: "",
      Modelo: "",
      Propietario: "",
      Fabricante: "",
      Numero_de_Serie: "",
      Cliente: "",
      Ano_de_Fabricacion: "",
      Origen_de_Aeronave: "",
      Propia: "",
      Estatus: "",
      Operaciones: "",
      Mantenimiento: "",
      Capacidad_de_pasajeros: "",
      Nivel_de_ruido: "",
      Turbulencia: "",
      Equipo_de_navegacion: "",
      UHV: "",
      VHF: "",
      ELT: "",
      Desierto: "",
      Polar: "",
      Selva: "",
      Maritimo: "",
      Chalecos_salvavidas: "",
      Numero_de_lanchas_salvavidas: "",
      Capacidad: "",
      Color_de_la_aeronave: "",
      Color_cubierta_de_los_botes: "",
      Velocidad: "",
      Tipo_de_Ala: "",
      UPA: "",
      UPA_MODELO: "",
      UPA_SERIE: "",
      Ciclos_iniciales: "",
      Ciclos_actuales: "",
      Horas_iniciales: "",
      Horas_actuales: "",
      Inicio_de_operaciones: null,
      Bitacora: "",

    },
    filterAdvanced: {
      fromMatricula: "",
      toMatricula: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      FabricanteFilter: "",
      Fabricante: "",
      FabricanteMultiple: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      fromAno_de_Fabricacion: "",
      toAno_de_Fabricacion: "",
      Origen_de_AeronaveFilter: "",
      Origen_de_Aeronave: "",
      Origen_de_AeronaveMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromCapacidad_de_pasajeros: "",
      toCapacidad_de_pasajeros: "",
      Nivel_de_ruidoFilter: "",
      Nivel_de_ruido: "",
      Nivel_de_ruidoMultiple: "",
      TurbulenciaFilter: "",
      Turbulencia: "",
      TurbulenciaMultiple: "",
      Equipo_de_navegacionFilter: "",
      Equipo_de_navegacion: "",
      Equipo_de_navegacionMultiple: "",
      fromChalecos_salvavidas: "",
      toChalecos_salvavidas: "",
      fromNumero_de_lanchas_salvavidas: "",
      toNumero_de_lanchas_salvavidas: "",
      fromCapacidad: "",
      toCapacidad: "",
      fromVelocidad: "",
      toVelocidad: "",
      Tipo_de_AlaFilter: "",
      Tipo_de_Ala: "",
      Tipo_de_AlaMultiple: "",
      fromCiclos_iniciales: "",
      toCiclos_iniciales: "",
      fromCiclos_actuales: "",
      toCiclos_actuales: "",
      fromHoras_iniciales: "",
      toHoras_iniciales: "",
      fromHoras_actuales: "",
      toHoras_actuales: "",
      fromInicio_de_operaciones: "",
      toInicio_de_operaciones: "",
      BitacoraFilter: "",
      Bitacora: "",
      BitacoraMultiple: "",

    }
  };

  dataSource: AeronaveDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: AeronaveDataSource;
  dataClipboard: any;

  constructor(
    private _AeronaveService: AeronaveService,
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
    this.dataSource = new AeronaveDataSource(
      this._AeronaveService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Aeronave)
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
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Propietario = "";
    this.listConfig.filter.Fabricante = "";
    this.listConfig.filter.Numero_de_Serie = "";
    this.listConfig.filter.Cliente = "";
    this.listConfig.filter.Ano_de_Fabricacion = "";
    this.listConfig.filter.Origen_de_Aeronave = "";
    this.listConfig.filter.Propia = undefined;
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Operaciones = undefined;
    this.listConfig.filter.Mantenimiento = undefined;
    this.listConfig.filter.Capacidad_de_pasajeros = "";
    this.listConfig.filter.Nivel_de_ruido = "";
    this.listConfig.filter.Turbulencia = "";
    this.listConfig.filter.Equipo_de_navegacion = "";
    this.listConfig.filter.UHV = undefined;
    this.listConfig.filter.VHF = undefined;
    this.listConfig.filter.ELT = undefined;
    this.listConfig.filter.Desierto = undefined;
    this.listConfig.filter.Polar = undefined;
    this.listConfig.filter.Selva = undefined;
    this.listConfig.filter.Maritimo = undefined;
    this.listConfig.filter.Chalecos_salvavidas = "";
    this.listConfig.filter.Numero_de_lanchas_salvavidas = "";
    this.listConfig.filter.Capacidad = "";
    this.listConfig.filter.Color_de_la_aeronave = "";
    this.listConfig.filter.Color_cubierta_de_los_botes = "";
    this.listConfig.filter.Velocidad = "";
    this.listConfig.filter.Tipo_de_Ala = "";
    this.listConfig.filter.UPA = "";
    this.listConfig.filter.UPA_MODELO = "";
    this.listConfig.filter.UPA_SERIE = "";
    this.listConfig.filter.Ciclos_iniciales = "";
    this.listConfig.filter.Ciclos_actuales = "";
    this.listConfig.filter.Horas_iniciales = "";
    this.listConfig.filter.Horas_actuales = "";
    this.listConfig.filter.Inicio_de_operaciones = undefined;
    this.listConfig.filter.Bitacora = "";

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

    //INICIA - BRID:1960 - ocultar campos pdf. - Autor: Administrador - Actualización: 3/29/2021 7:41:52 PM
    if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "ClienteRazon_Social") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "ClienteRazon_Social") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Capacidad_de_pasajeros") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Capacidad_de_pasajeros") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Equipo_de_emergencia") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Equipo_de_emergencia") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Equipo_de_Supervivencia") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Equipo_de_Supervivencia") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Chalecos_salvavidas") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Chalecos_salvavidas") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Numero_de_lanchas_salvavidas") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Numero_de_lanchas_salvavidas") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Capacidad") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Capacidad") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "UHV") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "UHV") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "VHF") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "VHF") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "ELT") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "ELT") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Polar") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Polar") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Desierto") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Desierto") } if ("true" == "true") { this.brf.HideFieldofMultirenglon(this.displayedColumns, "Maritimo") } else { this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Maritimo") }
    //TERMINA - BRID:1960

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

  remove(row: Aeronave) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._AeronaveService
          .delete(+row.Matricula)
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
  ActionPrint(dataRow: Aeronave) {

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
      'Matricula'
      , 'Modelo'
      , 'Propietario'
      , 'Fabricante'
      , 'Número de Serie'
      , 'Cliente'
      , 'Año de Fabricación'
      , 'Origen de Aeronave'
      , 'Propia'
      , 'Estatus'
      , 'Operaciones'
      , 'Mantenimiento'
      , 'Capacidad de pasajeros'
      , 'Nivel de ruido'
      , 'Turbulencia de Estela'
      , 'Equipo de navegación'
      , 'UHV'
      , 'VHF'
      , 'ELT'
      , 'Desierto'
      , 'Polar'
      , 'Selva'
      , 'Marítimo'
      , 'Chalecos salvavidas'
      , 'Número de lanchas salvavidas'
      , 'Capacidad de lancha Salvavidas'
      , 'Color de la aeronave'
      , 'Color cubierta de los botes'
      , 'Velocidad'
      , 'Tipo de Ala'
      , 'UPA'
      , 'UPA MODELO'
      , 'UPA SERIE'
      , 'Ciclos iniciales'
      , 'Ciclos actuales'
      , 'Horas iniciales'
      , 'Horas actuales'
      , 'Inicio de operaciones'
      , 'Bitácora'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Matricula
        , x.Modelo_Modelos.Descripcion
        , x.Propietario_Propietarios.Nombre
        , x.Fabricante_Fabricante.Nombre
        , x.Numero_de_Serie
        , x.Cliente_Cliente.Razon_Social
        , x.Ano_de_Fabricacion
        , x.Origen_de_Aeronave_Origen_de_Aeronave.Descripcion
        , x.Propia
        , x.Estatus_Estatus_Aeronave.Descripcion
        , x.Operaciones
        , x.Mantenimiento
        , x.Capacidad_de_pasajeros
        , x.Nivel_de_ruido_Nivel_de_Ruido.Descripcion
        , x.Turbulencia_Turbulencia_de_Estela.Descripcion
        , x.Equipo_de_navegacion_Equipo_de_Navegacion.Descripcion
        , x.UHV
        , x.VHF
        , x.ELT
        , x.Desierto
        , x.Polar
        , x.Selva
        , x.Maritimo
        , x.Chalecos_salvavidas
        , x.Numero_de_lanchas_salvavidas
        , x.Color_de_la_aeronave
        , x.Color_cubierta_de_los_botes
        , x.Velocidad
        , x.Tipo_de_Ala_Tipo_de_Ala.Descripcion
        , x.UPA
        , x.UPA_MODELO
        , x.UPA_SERIE
        , x.Ciclos_iniciales
        , x.Ciclos_actuales
        , x.Horas_iniciales
        , x.Horas_actuales
        , x.Inicio_de_operaciones
        , x.Bitacora_Tipo_de_Bitacora_de_Aeronave.Descripcion

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
    pdfMake.createPdf(pdfDefinition).download('Aeronave.pdf');
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
          this._AeronaveService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Aeronaves;
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
          this._AeronaveService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Aeronaves;
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
        'Matricula ': fields.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'Propietario ': fields.Propietario_Propietarios.Nombre,
        'Fabricante ': fields.Fabricante_Fabricante.Nombre,
        'Número de Serie ': fields.Numero_de_Serie,
        'Cliente ': fields.Cliente_Cliente.Razon_Social,
        'Año de Fabricación ': fields.Ano_de_Fabricacion,
        'Origen de Aeronave ': fields.Origen_de_Aeronave_Origen_de_Aeronave.Descripcion,
        'Propia ': fields.Propia ? 'SI' : 'NO',
        'Estatus ': fields.Estatus_Estatus_Aeronave.Descripcion,
        'Operaciones ': fields.Operaciones ? 'SI' : 'NO',
        'Mantenimiento ': fields.Mantenimiento ? 'SI' : 'NO',
        'Capacidad de pasajeros ': fields.Capacidad_de_pasajeros,
        'Nivel de ruido ': fields.Nivel_de_ruido_Nivel_de_Ruido.Descripcion,
        'Turbulencia de Estela ': fields.Turbulencia_Turbulencia_de_Estela.Descripcion,
        'Equipo de navegación ': fields.Equipo_de_navegacion_Equipo_de_Navegacion.Descripcion,
        'UHV ': fields.UHV ? 'SI' : 'NO',
        'VHF ': fields.VHF ? 'SI' : 'NO',
        'ELT ': fields.ELT ? 'SI' : 'NO',
        'Desierto ': fields.Desierto ? 'SI' : 'NO',
        'Polar ': fields.Polar ? 'SI' : 'NO',
        'Selva ': fields.Selva ? 'SI' : 'NO',
        'Maritimo ': fields.Maritimo ? 'SI' : 'NO',
        'Chalecos salvavidas ': fields.Chalecos_salvavidas,
        'Número de lanchas salvavidas ': fields.Numero_de_lanchas_salvavidas,
        'Capacidad de lancha Salvavidas ': fields.Capacidad,
        'Color de la aeronave ': fields.Color_de_la_aeronave,
        'Color cubierta de los botes ': fields.Color_cubierta_de_los_botes,
        'Velocidad ': fields.Velocidad,
        'Tipo de Ala ': fields.Tipo_de_Ala_Tipo_de_Ala.Descripcion,
        'UPA ': fields.UPA,
        'UPA MODELO ': fields.UPA_MODELO,
        'UPA SERIE ': fields.UPA_SERIE,
        'Ciclos iniciales ': fields.Ciclos_iniciales,
        'Ciclos actuales ': fields.Ciclos_actuales,
        'Horas iniciales ': fields.Horas_iniciales,
        'Horas actuales ': fields.Horas_actuales,
        'Inicio de operaciones ': fields.Inicio_de_operaciones ? momentJS(fields.Inicio_de_operaciones).format('DD/MM/YYYY') : '',
        'Bitácora ': fields.Bitacora_Tipo_de_Bitacora_de_Aeronave.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Aeronave  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Matricula: x.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      Propietario: x.Propietario_Propietarios.Nombre,
      Fabricante: x.Fabricante_Fabricante.Nombre,
      Numero_de_Serie: x.Numero_de_Serie,
      Cliente: x.Cliente_Cliente.Razon_Social,
      Ano_de_Fabricacion: x.Ano_de_Fabricacion,
      Origen_de_Aeronave: x.Origen_de_Aeronave_Origen_de_Aeronave.Descripcion,
      Propia: x.Propia,
      Estatus: x.Estatus_Estatus_Aeronave.Descripcion,
      Operaciones: x.Operaciones,
      Mantenimiento: x.Mantenimiento,
      Capacidad_de_pasajeros: x.Capacidad_de_pasajeros,
      Nivel_de_ruido: x.Nivel_de_ruido_Nivel_de_Ruido.Descripcion,
      Turbulencia: x.Turbulencia_Turbulencia_de_Estela.Descripcion,
      Equipo_de_navegacion: x.Equipo_de_navegacion_Equipo_de_Navegacion.Descripcion,
      UHV: x.UHV,
      VHF: x.VHF,
      ELT: x.ELT,
      Desierto: x.Desierto,
      Polar: x.Polar,
      Selva: x.Selva,
      Maritimo: x.Maritimo,
      Chalecos_salvavidas: x.Chalecos_salvavidas,
      Numero_de_lanchas_salvavidas: x.Numero_de_lanchas_salvavidas,
      Capacidad: x.Capacidad,
      Color_de_la_aeronave: x.Color_de_la_aeronave,
      Color_cubierta_de_los_botes: x.Color_cubierta_de_los_botes,
      Velocidad: x.Velocidad,
      Tipo_de_Ala: x.Tipo_de_Ala_Tipo_de_Ala.Descripcion,
      UPA: x.UPA,
      UPA_MODELO: x.UPA_MODELO,
      UPA_SERIE: x.UPA_SERIE,
      Ciclos_iniciales: x.Ciclos_iniciales,
      Ciclos_actuales: x.Ciclos_actuales,
      Horas_iniciales: x.Horas_iniciales,
      Horas_actuales: x.Horas_actuales,
      Inicio_de_operaciones: x.Inicio_de_operaciones,
      Bitacora: x.Bitacora_Tipo_de_Bitacora_de_Aeronave.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Aeronave', ['Matricula', 'Modelo', 'Propietario', 'Fabricante', 'Numero_de_Serie', 'Cliente', 'Ano_de_Fabricacion', 'Origen_de_Aeronave', 'Propia', 'Estatus', 'Operaciones', 'Mantenimiento', 'Capacidad_de_pasajeros', 'Nivel_de_ruido', 'Turbulencia', 'Equipo_de_navegacion', 'UHV', 'VHF', 'ELT', 'Desierto', 'Polar', 'Selva', 'Maritimo', 'Chalecos_salvavidas', 'Numero_de_lanchas_salvavidas', 'Capacidad', 'Color_de_la_aeronave', 'Color_cubierta_de_los_botes', 'Velocidad', 'Tipo_de_Ala', 'UPA', 'UPA_MODELO', 'UPA_SERIE', 'Ciclos_iniciales', 'Ciclos_actuales', 'Horas_iniciales', 'Horas_actuales', 'Inicio_de_operaciones', 'Bitacora']);
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
    template += '          <th>Matricula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Propietario</th>';
    template += '          <th>Fabricante</th>';
    template += '          <th>Número de Serie</th>';
    template += '          <th>Cliente</th>';
    template += '          <th>Año de Fabricación</th>';
    template += '          <th>Origen de Aeronave</th>';
    template += '          <th>Propia</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Operaciones</th>';
    template += '          <th>Mantenimiento</th>';
    template += '          <th>Capacidad de pasajeros</th>';
    template += '          <th>Nivel de ruido</th>';
    template += '          <th>Turbulencia de Estela</th>';
    template += '          <th>Equipo de navegación</th>';
    template += '          <th>UHV</th>';
    template += '          <th>VHF</th>';
    template += '          <th>ELT</th>';
    template += '          <th>Desierto</th>';
    template += '          <th>Polar</th>';
    template += '          <th>Selva</th>';
    template += '          <th>Marítimo</th>';
    template += '          <th>Chalecos salvavidas</th>';
    template += '          <th>Número de lanchas salvavidas</th>';
    template += '          <th>Capacidad de lancha Salvavidas</th>';
    template += '          <th>Color de la aeronave</th>';
    template += '          <th>Color cubierta de los botes</th>';
    template += '          <th>Velocidad</th>';
    template += '          <th>Tipo de Ala</th>';
    template += '          <th>UPA</th>';
    template += '          <th>UPA MODELO</th>';
    template += '          <th>UPA SERIE</th>';
    template += '          <th>Ciclos iniciales</th>';
    template += '          <th>Ciclos actuales</th>';
    template += '          <th>Horas iniciales</th>';
    template += '          <th>Horas actuales</th>';
    template += '          <th>Inicio de operaciones</th>';
    template += '          <th>Bitácora</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Propietario_Propietarios.Nombre + '</td>';
      template += '          <td>' + element.Fabricante_Fabricante.Nombre + '</td>';
      template += '          <td>' + element.Numero_de_Serie + '</td>';
      template += '          <td>' + element.Cliente_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Ano_de_Fabricacion + '</td>';
      template += '          <td>' + element.Origen_de_Aeronave_Origen_de_Aeronave.Descripcion + '</td>';
      template += '          <td>' + element.Propia + '</td>';
      template += '          <td>' + element.Estatus_Estatus_Aeronave.Descripcion + '</td>';
      template += '          <td>' + element.Operaciones + '</td>';
      template += '          <td>' + element.Mantenimiento + '</td>';
      template += '          <td>' + element.Capacidad_de_pasajeros + '</td>';
      template += '          <td>' + element.Nivel_de_ruido_Nivel_de_Ruido.Descripcion + '</td>';
      template += '          <td>' + element.Turbulencia_Turbulencia_de_Estela.Descripcion + '</td>';
      template += '          <td>' + element.Equipo_de_navegacion_Equipo_de_Navegacion.Descripcion + '</td>';
      template += '          <td>' + element.UHV + '</td>';
      template += '          <td>' + element.VHF + '</td>';
      template += '          <td>' + element.ELT + '</td>';
      template += '          <td>' + element.Desierto + '</td>';
      template += '          <td>' + element.Polar + '</td>';
      template += '          <td>' + element.Selva + '</td>';
      template += '          <td>' + element.Maritimo + '</td>';
      template += '          <td>' + element.Chalecos_salvavidas + '</td>';
      template += '          <td>' + element.Numero_de_lanchas_salvavidas + '</td>';
      template += '          <td>' + element.Capacidad + '</td>';
      template += '          <td>' + element.Color_de_la_aeronave + '</td>';
      template += '          <td>' + element.Color_cubierta_de_los_botes + '</td>';
      template += '          <td>' + element.Velocidad + '</td>';
      template += '          <td>' + element.Tipo_de_Ala_Tipo_de_Ala.Descripcion + '</td>';
      template += '          <td>' + element.UPA + '</td>';
      template += '          <td>' + element.UPA_MODELO + '</td>';
      template += '          <td>' + element.UPA_SERIE + '</td>';
      template += '          <td>' + element.Ciclos_iniciales + '</td>';
      template += '          <td>' + element.Ciclos_actuales + '</td>';
      template += '          <td>' + element.Horas_iniciales + '</td>';
      template += '          <td>' + element.Horas_actuales + '</td>';
      template += '          <td>' + element.Inicio_de_operaciones + '</td>';
      template += '          <td>' + element.Bitacora_Tipo_de_Bitacora_de_Aeronave.Descripcion + '</td>';

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
    template += '\t Matricula';
    template += '\t Modelo';
    template += '\t Propietario';
    template += '\t Fabricante';
    template += '\t Número de Serie';
    template += '\t Cliente';
    template += '\t Año de Fabricación';
    template += '\t Origen de Aeronave';
    template += '\t Propia';
    template += '\t Estatus';
    template += '\t Operaciones';
    template += '\t Mantenimiento';
    template += '\t Capacidad de pasajeros';
    template += '\t Nivel de ruido';
    template += '\t Turbulencia de Estela';
    template += '\t Equipo de navegación';
    template += '\t UHV';
    template += '\t VHF';
    template += '\t ELT';
    template += '\t Desierto';
    template += '\t Polar';
    template += '\t Selva';
    template += '\t Marítimo';
    template += '\t Chalecos salvavidas';
    template += '\t Número de lanchas salvavidas';
    template += '\t Capacidad de lancha Salvavidas';
    template += '\t Color de la aeronave';
    template += '\t Color cubierta de los botes';
    template += '\t Velocidad';
    template += '\t Tipo de Ala';
    template += '\t UPA';
    template += '\t UPA MODELO';
    template += '\t UPA SERIE';
    template += '\t Ciclos iniciales';
    template += '\t Ciclos actuales';
    template += '\t Horas iniciales';
    template += '\t Horas actuales';
    template += '\t Inicio de operaciones';
    template += '\t Bitácora';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.Propietario_Propietarios.Nombre;
      template += '\t ' + element.Fabricante_Fabricante.Nombre;
      template += '\t ' + element.Numero_de_Serie;
      template += '\t ' + element.Cliente_Cliente.Razon_Social;
      template += '\t ' + element.Ano_de_Fabricacion;
      template += '\t ' + element.Origen_de_Aeronave_Origen_de_Aeronave.Descripcion;
      template += '\t ' + element.Propia;
      template += '\t ' + element.Estatus_Estatus_Aeronave.Descripcion;
      template += '\t ' + element.Operaciones;
      template += '\t ' + element.Mantenimiento;
      template += '\t ' + element.Capacidad_de_pasajeros;
      template += '\t ' + element.Nivel_de_ruido_Nivel_de_Ruido.Descripcion;
      template += '\t ' + element.Turbulencia_Turbulencia_de_Estela.Descripcion;
      template += '\t ' + element.Equipo_de_navegacion_Equipo_de_Navegacion.Descripcion;
      template += '\t ' + element.UHV;
      template += '\t ' + element.VHF;
      template += '\t ' + element.ELT;
      template += '\t ' + element.Desierto;
      template += '\t ' + element.Polar;
      template += '\t ' + element.Selva;
      template += '\t ' + element.Maritimo;
      template += '\t ' + element.Chalecos_salvavidas;
      template += '\t ' + element.Numero_de_lanchas_salvavidas;
      template += '\t ' + element.Capacidad;
      template += '\t ' + element.Color_de_la_aeronave;
      template += '\t ' + element.Color_cubierta_de_los_botes;
      template += '\t ' + element.Velocidad;
      template += '\t ' + element.Tipo_de_Ala_Tipo_de_Ala.Descripcion;
      template += '\t ' + element.UPA;
      template += '\t ' + element.UPA_MODELO;
      template += '\t ' + element.UPA_SERIE;
      template += '\t ' + element.Ciclos_iniciales;
      template += '\t ' + element.Ciclos_actuales;
      template += '\t ' + element.Horas_iniciales;
      template += '\t ' + element.Horas_actuales;
      template += '\t ' + element.Inicio_de_operaciones;
      template += '\t ' + element.Bitacora_Tipo_de_Bitacora_de_Aeronave.Descripcion;

      template += '\n';
    });

    return template;
  }

}

export class AeronaveDataSource implements DataSource<Aeronave>
{
  private subject = new BehaviorSubject<Aeronave[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: AeronaveService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Aeronave[]> {
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
          if (column === 'Matricula') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Aeronaves);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Propietario != "")
      condition += " and Propietarios.Nombre like '%" + data.filter.Propietario + "%' ";
    if (data.filter.Fabricante != "")
      condition += " and Fabricante.Nombre like '%" + data.filter.Fabricante + "%' ";
    if (data.filter.Numero_de_Serie != "")
      condition += " and Aeronave.Numero_de_Serie like '%" + data.filter.Numero_de_Serie + "%' ";
    if (data.filter.Cliente != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Cliente + "%' ";
    if (data.filter.Ano_de_Fabricacion != "")
      condition += " and Aeronave.Ano_de_Fabricacion = " + data.filter.Ano_de_Fabricacion;
    if (data.filter.Origen_de_Aeronave != "")
      condition += " and Origen_de_Aeronave.Descripcion like '%" + data.filter.Origen_de_Aeronave + "%' ";
    if (data.filter.Propia && data.filter.Propia != "2") {
      if (data.filter.Propia == "0" || data.filter.Propia == "") {
        condition += " and (Aeronave.Propia = 0 or Aeronave.Propia is null)";
      } else {
        condition += " and Aeronave.Propia = 1";
      }
    }
    if (data.filter.Estatus != "")
      condition += " and Estatus_Aeronave.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Operaciones && data.filter.Operaciones != "2") {
      if (data.filter.Operaciones == "0" || data.filter.Operaciones == "") {
        condition += " and (Aeronave.Operaciones = 0 or Aeronave.Operaciones is null)";
      } else {
        condition += " and Aeronave.Operaciones = 1";
      }
    }
    if (data.filter.Mantenimiento && data.filter.Mantenimiento != "2") {
      if (data.filter.Mantenimiento == "0" || data.filter.Mantenimiento == "") {
        condition += " and (Aeronave.Mantenimiento = 0 or Aeronave.Mantenimiento is null)";
      } else {
        condition += " and Aeronave.Mantenimiento = 1";
      }
    }
    if (data.filter.Capacidad_de_pasajeros != "")
      condition += " and Aeronave.Capacidad_de_pasajeros = " + data.filter.Capacidad_de_pasajeros;
    if (data.filter.Nivel_de_ruido != "")
      condition += " and Nivel_de_Ruido.Descripcion like '%" + data.filter.Nivel_de_ruido + "%' ";
    if (data.filter.Turbulencia != "")
      condition += " and Turbulencia_de_Estela.Descripcion like '%" + data.filter.Turbulencia + "%' ";
    if (data.filter.Equipo_de_navegacion != "")
      condition += " and Equipo_de_Navegacion.Descripcion like '%" + data.filter.Equipo_de_navegacion + "%' ";
    if (data.filter.UHV && data.filter.UHV != "2") {
      if (data.filter.UHV == "0" || data.filter.UHV == "") {
        condition += " and (Aeronave.UHV = 0 or Aeronave.UHV is null)";
      } else {
        condition += " and Aeronave.UHV = 1";
      }
    }
    if (data.filter.VHF && data.filter.VHF != "2") {
      if (data.filter.VHF == "0" || data.filter.VHF == "") {
        condition += " and (Aeronave.VHF = 0 or Aeronave.VHF is null)";
      } else {
        condition += " and Aeronave.VHF = 1";
      }
    }
    if (data.filter.ELT && data.filter.ELT != "2") {
      if (data.filter.ELT == "0" || data.filter.ELT == "") {
        condition += " and (Aeronave.ELT = 0 or Aeronave.ELT is null)";
      } else {
        condition += " and Aeronave.ELT = 1";
      }
    }
    if (data.filter.Desierto && data.filter.Desierto != "2") {
      if (data.filter.Desierto == "0" || data.filter.Desierto == "") {
        condition += " and (Aeronave.Desierto = 0 or Aeronave.Desierto is null)";
      } else {
        condition += " and Aeronave.Desierto = 1";
      }
    }
    if (data.filter.Polar && data.filter.Polar != "2") {
      if (data.filter.Polar == "0" || data.filter.Polar == "") {
        condition += " and (Aeronave.Polar = 0 or Aeronave.Polar is null)";
      } else {
        condition += " and Aeronave.Polar = 1";
      }
    }
    if (data.filter.Selva && data.filter.Selva != "2") {
      if (data.filter.Selva == "0" || data.filter.Selva == "") {
        condition += " and (Aeronave.Selva = 0 or Aeronave.Selva is null)";
      } else {
        condition += " and Aeronave.Selva = 1";
      }
    }
    if (data.filter.Maritimo && data.filter.Maritimo != "2") {
      if (data.filter.Maritimo == "0" || data.filter.Maritimo == "") {
        condition += " and (Aeronave.Maritimo = 0 or Aeronave.Maritimo is null)";
      } else {
        condition += " and Aeronave.Maritimo = 1";
      }
    }
    if (data.filter.Chalecos_salvavidas != "")
      condition += " and Aeronave.Chalecos_salvavidas = " + data.filter.Chalecos_salvavidas;
    if (data.filter.Numero_de_lanchas_salvavidas != "")
      condition += " and Aeronave.Numero_de_lanchas_salvavidas = " + data.filter.Numero_de_lanchas_salvavidas;
    if (data.filter.Capacidad != "")
      condition += " and Aeronave.Capacidad = " + data.filter.Capacidad;
    if (data.filter.Color_de_la_aeronave != "")
      condition += " and Aeronave.Color_de_la_aeronave like '%" + data.filter.Color_de_la_aeronave + "%' ";
    if (data.filter.Color_cubierta_de_los_botes != "")
      condition += " and Aeronave.Color_cubierta_de_los_botes like '%" + data.filter.Color_cubierta_de_los_botes + "%' ";
    if (data.filter.Velocidad != "")
      condition += " and Aeronave.Velocidad = " + data.filter.Velocidad;
    if (data.filter.Tipo_de_Ala != "")
      condition += " and Tipo_de_Ala.Descripcion like '%" + data.filter.Tipo_de_Ala + "%' ";
    if (data.filter.UPA != "")
      condition += " and Aeronave.UPA like '%" + data.filter.UPA + "%' ";
    if (data.filter.UPA_MODELO != "")
      condition += " and Aeronave.UPA_MODELO like '%" + data.filter.UPA_MODELO + "%' ";
    if (data.filter.UPA_SERIE != "")
      condition += " and Aeronave.UPA_SERIE like '%" + data.filter.UPA_SERIE + "%' ";
    if (data.filter.Ciclos_iniciales != "")
      condition += " and Aeronave.Ciclos_iniciales = " + data.filter.Ciclos_iniciales;
    if (data.filter.Ciclos_actuales != "")
      condition += " and Aeronave.Ciclos_actuales = " + data.filter.Ciclos_actuales;
    if (data.filter.Horas_iniciales != "")
      condition += " and Aeronave.Horas_iniciales = '" + data.filter.Horas_iniciales + "'";
    if (data.filter.Horas_actuales != "")
      condition += " and Aeronave.Horas_actuales = '" + data.filter.Horas_actuales + "'";
    if (data.filter.Inicio_de_operaciones)
      condition += " and CONVERT(VARCHAR(10), Aeronave.Inicio_de_operaciones, 102)  = '" + moment(data.filter.Inicio_de_operaciones).format("YYYY.MM.DD") + "'";
    if (data.filter.Bitacora != "")
      condition += " and Tipo_de_Bitacora_de_Aeronave.Descripcion like '%" + data.filter.Bitacora + "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Propietario":
        sort = " Propietarios.Nombre " + data.sortDirecction;
        break;
      case "Fabricante":
        sort = " Fabricante.Nombre " + data.sortDirecction;
        break;
      case "Numero_de_Serie":
        sort = " Aeronave.Numero_de_Serie " + data.sortDirecction;
        break;
      case "Cliente":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Ano_de_Fabricacion":
        sort = " Aeronave.Ano_de_Fabricacion " + data.sortDirecction;
        break;
      case "Origen_de_Aeronave":
        sort = " Origen_de_Aeronave.Descripcion " + data.sortDirecction;
        break;
      case "Propia":
        sort = " Aeronave.Propia " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_Aeronave.Descripcion " + data.sortDirecction;
        break;
      case "Operaciones":
        sort = " Aeronave.Operaciones " + data.sortDirecction;
        break;
      case "Mantenimiento":
        sort = " Aeronave.Mantenimiento " + data.sortDirecction;
        break;
      case "Capacidad_de_pasajeros":
        sort = " Aeronave.Capacidad_de_pasajeros " + data.sortDirecction;
        break;
      case "Nivel_de_ruido":
        sort = " Nivel_de_Ruido.Descripcion " + data.sortDirecction;
        break;
      case "Turbulencia":
        sort = " Turbulencia_de_Estela.Descripcion " + data.sortDirecction;
        break;
      case "Equipo_de_navegacion":
        sort = " Equipo_de_Navegacion.Descripcion " + data.sortDirecction;
        break;
      case "UHV":
        sort = " Aeronave.UHV " + data.sortDirecction;
        break;
      case "VHF":
        sort = " Aeronave.VHF " + data.sortDirecction;
        break;
      case "ELT":
        sort = " Aeronave.ELT " + data.sortDirecction;
        break;
      case "Desierto":
        sort = " Aeronave.Desierto " + data.sortDirecction;
        break;
      case "Polar":
        sort = " Aeronave.Polar " + data.sortDirecction;
        break;
      case "Selva":
        sort = " Aeronave.Selva " + data.sortDirecction;
        break;
      case "Maritimo":
        sort = " Aeronave.Maritimo " + data.sortDirecction;
        break;
      case "Chalecos_salvavidas":
        sort = " Aeronave.Chalecos_salvavidas " + data.sortDirecction;
        break;
      case "Numero_de_lanchas_salvavidas":
        sort = " Aeronave.Numero_de_lanchas_salvavidas " + data.sortDirecction;
        break;
      case "Capacidad":
        sort = " Aeronave.Capacidad " + data.sortDirecction;
        break;
      case "Color_de_la_aeronave":
        sort = " Aeronave.Color_de_la_aeronave " + data.sortDirecction;
        break;
      case "Color_cubierta_de_los_botes":
        sort = " Aeronave.Color_cubierta_de_los_botes " + data.sortDirecction;
        break;
      case "Velocidad":
        sort = " Aeronave.Velocidad " + data.sortDirecction;
        break;
      case "Tipo_de_Ala":
        sort = " Tipo_de_Ala.Descripcion " + data.sortDirecction;
        break;
      case "UPA":
        sort = " Aeronave.UPA " + data.sortDirecction;
        break;
      case "UPA_MODELO":
        sort = " Aeronave.UPA_MODELO " + data.sortDirecction;
        break;
      case "UPA_SERIE":
        sort = " Aeronave.UPA_SERIE " + data.sortDirecction;
        break;
      case "Ciclos_iniciales":
        sort = " Aeronave.Ciclos_iniciales " + data.sortDirecction;
        break;
      case "Ciclos_actuales":
        sort = " Aeronave.Ciclos_actuales " + data.sortDirecction;
        break;
      case "Horas_iniciales":
        sort = " Aeronave.Horas_iniciales " + data.sortDirecction;
        break;
      case "Horas_actuales":
        sort = " Aeronave.Horas_actuales " + data.sortDirecction;
        break;
      case "Inicio_de_operaciones":
        sort = " Aeronave.Inicio_de_operaciones " + data.sortDirecction;
        break;
      case "Bitacora":
        sort = " Tipo_de_Bitacora_de_Aeronave.Descripcion " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
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
      condition += " AND Aeronave.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.Propietario != 'undefined' && data.filterAdvanced.Propietario)) {
      switch (data.filterAdvanced.PropietarioFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Propietarios.Nombre LIKE '" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Propietarios.Nombre = '" + data.filterAdvanced.Propietario + "'";
          break;
      }
    } else if (data.filterAdvanced.PropietarioMultiple != null && data.filterAdvanced.PropietarioMultiple.length > 0) {
      var Propietariods = data.filterAdvanced.PropietarioMultiple.join(",");
      condition += " AND Aeronave.Propietario In (" + Propietariods + ")";
    }
    if ((typeof data.filterAdvanced.Fabricante != 'undefined' && data.filterAdvanced.Fabricante)) {
      switch (data.filterAdvanced.FabricanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Fabricante.Nombre LIKE '" + data.filterAdvanced.Fabricante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Fabricante.Nombre LIKE '%" + data.filterAdvanced.Fabricante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Fabricante.Nombre LIKE '%" + data.filterAdvanced.Fabricante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Fabricante.Nombre = '" + data.filterAdvanced.Fabricante + "'";
          break;
      }
    } else if (data.filterAdvanced.FabricanteMultiple != null && data.filterAdvanced.FabricanteMultiple.length > 0) {
      var Fabricanteds = data.filterAdvanced.FabricanteMultiple.join(",");
      condition += " AND Aeronave.Fabricante In (" + Fabricanteds + ")";
    }
    switch (data.filterAdvanced.Numero_de_SerieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeronave.Numero_de_Serie LIKE '" + data.filterAdvanced.Numero_de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.Numero_de_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.Numero_de_Serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeronave.Numero_de_Serie = '" + data.filterAdvanced.Numero_de_Serie + "'";
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
      condition += " AND Aeronave.Cliente In (" + Clienteds + ")";
    }
    if ((typeof data.filterAdvanced.fromAno_de_Fabricacion != 'undefined' && data.filterAdvanced.fromAno_de_Fabricacion)
      || (typeof data.filterAdvanced.toAno_de_Fabricacion != 'undefined' && data.filterAdvanced.toAno_de_Fabricacion)) {
      if (typeof data.filterAdvanced.fromAno_de_Fabricacion != 'undefined' && data.filterAdvanced.fromAno_de_Fabricacion)
        condition += " AND Aeronave.Ano_de_Fabricacion >= " + data.filterAdvanced.fromAno_de_Fabricacion;

      if (typeof data.filterAdvanced.toAno_de_Fabricacion != 'undefined' && data.filterAdvanced.toAno_de_Fabricacion)
        condition += " AND Aeronave.Ano_de_Fabricacion <= " + data.filterAdvanced.toAno_de_Fabricacion;
    }
    if ((typeof data.filterAdvanced.Origen_de_Aeronave != 'undefined' && data.filterAdvanced.Origen_de_Aeronave)) {
      switch (data.filterAdvanced.Origen_de_AeronaveFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Origen_de_Aeronave.Descripcion LIKE '" + data.filterAdvanced.Origen_de_Aeronave + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Origen_de_Aeronave.Descripcion LIKE '%" + data.filterAdvanced.Origen_de_Aeronave + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Origen_de_Aeronave.Descripcion LIKE '%" + data.filterAdvanced.Origen_de_Aeronave + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Origen_de_Aeronave.Descripcion = '" + data.filterAdvanced.Origen_de_Aeronave + "'";
          break;
      }
    } else if (data.filterAdvanced.Origen_de_AeronaveMultiple != null && data.filterAdvanced.Origen_de_AeronaveMultiple.length > 0) {
      var Origen_de_Aeronaveds = data.filterAdvanced.Origen_de_AeronaveMultiple.join(",");
      condition += " AND Aeronave.Origen_de_Aeronave In (" + Origen_de_Aeronaveds + ")";
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_Aeronave.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_Aeronave.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_Aeronave.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_Aeronave.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Aeronave.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.fromCapacidad_de_pasajeros != 'undefined' && data.filterAdvanced.fromCapacidad_de_pasajeros)
      || (typeof data.filterAdvanced.toCapacidad_de_pasajeros != 'undefined' && data.filterAdvanced.toCapacidad_de_pasajeros)) {
      if (typeof data.filterAdvanced.fromCapacidad_de_pasajeros != 'undefined' && data.filterAdvanced.fromCapacidad_de_pasajeros)
        condition += " AND Aeronave.Capacidad_de_pasajeros >= " + data.filterAdvanced.fromCapacidad_de_pasajeros;

      if (typeof data.filterAdvanced.toCapacidad_de_pasajeros != 'undefined' && data.filterAdvanced.toCapacidad_de_pasajeros)
        condition += " AND Aeronave.Capacidad_de_pasajeros <= " + data.filterAdvanced.toCapacidad_de_pasajeros;
    }
    if ((typeof data.filterAdvanced.Nivel_de_ruido != 'undefined' && data.filterAdvanced.Nivel_de_ruido)) {
      switch (data.filterAdvanced.Nivel_de_ruidoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Nivel_de_Ruido.Descripcion LIKE '" + data.filterAdvanced.Nivel_de_ruido + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Nivel_de_Ruido.Descripcion LIKE '%" + data.filterAdvanced.Nivel_de_ruido + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Nivel_de_Ruido.Descripcion LIKE '%" + data.filterAdvanced.Nivel_de_ruido + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Nivel_de_Ruido.Descripcion = '" + data.filterAdvanced.Nivel_de_ruido + "'";
          break;
      }
    } else if (data.filterAdvanced.Nivel_de_ruidoMultiple != null && data.filterAdvanced.Nivel_de_ruidoMultiple.length > 0) {
      var Nivel_de_ruidods = data.filterAdvanced.Nivel_de_ruidoMultiple.join(",");
      condition += " AND Aeronave.Nivel_de_ruido In (" + Nivel_de_ruidods + ")";
    }
    if ((typeof data.filterAdvanced.Turbulencia != 'undefined' && data.filterAdvanced.Turbulencia)) {
      switch (data.filterAdvanced.TurbulenciaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Turbulencia_de_Estela.Descripcion LIKE '" + data.filterAdvanced.Turbulencia + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Turbulencia_de_Estela.Descripcion LIKE '%" + data.filterAdvanced.Turbulencia + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Turbulencia_de_Estela.Descripcion LIKE '%" + data.filterAdvanced.Turbulencia + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Turbulencia_de_Estela.Descripcion = '" + data.filterAdvanced.Turbulencia + "'";
          break;
      }
    } else if (data.filterAdvanced.TurbulenciaMultiple != null && data.filterAdvanced.TurbulenciaMultiple.length > 0) {
      var Turbulenciads = data.filterAdvanced.TurbulenciaMultiple.join(",");
      condition += " AND Aeronave.Turbulencia In (" + Turbulenciads + ")";
    }
    if ((typeof data.filterAdvanced.Equipo_de_navegacion != 'undefined' && data.filterAdvanced.Equipo_de_navegacion)) {
      switch (data.filterAdvanced.Equipo_de_navegacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Equipo_de_Navegacion.Descripcion LIKE '" + data.filterAdvanced.Equipo_de_navegacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Equipo_de_Navegacion.Descripcion LIKE '%" + data.filterAdvanced.Equipo_de_navegacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Equipo_de_Navegacion.Descripcion LIKE '%" + data.filterAdvanced.Equipo_de_navegacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Equipo_de_Navegacion.Descripcion = '" + data.filterAdvanced.Equipo_de_navegacion + "'";
          break;
      }
    } else if (data.filterAdvanced.Equipo_de_navegacionMultiple != null && data.filterAdvanced.Equipo_de_navegacionMultiple.length > 0) {
      var Equipo_de_navegacionds = data.filterAdvanced.Equipo_de_navegacionMultiple.join(",");
      condition += " AND Aeronave.Equipo_de_navegacion In (" + Equipo_de_navegacionds + ")";
    }
    if ((typeof data.filterAdvanced.fromChalecos_salvavidas != 'undefined' && data.filterAdvanced.fromChalecos_salvavidas)
      || (typeof data.filterAdvanced.toChalecos_salvavidas != 'undefined' && data.filterAdvanced.toChalecos_salvavidas)) {
      if (typeof data.filterAdvanced.fromChalecos_salvavidas != 'undefined' && data.filterAdvanced.fromChalecos_salvavidas)
        condition += " AND Aeronave.Chalecos_salvavidas >= " + data.filterAdvanced.fromChalecos_salvavidas;

      if (typeof data.filterAdvanced.toChalecos_salvavidas != 'undefined' && data.filterAdvanced.toChalecos_salvavidas)
        condition += " AND Aeronave.Chalecos_salvavidas <= " + data.filterAdvanced.toChalecos_salvavidas;
    }
    if ((typeof data.filterAdvanced.fromNumero_de_lanchas_salvavidas != 'undefined' && data.filterAdvanced.fromNumero_de_lanchas_salvavidas)
      || (typeof data.filterAdvanced.toNumero_de_lanchas_salvavidas != 'undefined' && data.filterAdvanced.toNumero_de_lanchas_salvavidas)) {
      if (typeof data.filterAdvanced.fromNumero_de_lanchas_salvavidas != 'undefined' && data.filterAdvanced.fromNumero_de_lanchas_salvavidas)
        condition += " AND Aeronave.Numero_de_lanchas_salvavidas >= " + data.filterAdvanced.fromNumero_de_lanchas_salvavidas;

      if (typeof data.filterAdvanced.toNumero_de_lanchas_salvavidas != 'undefined' && data.filterAdvanced.toNumero_de_lanchas_salvavidas)
        condition += " AND Aeronave.Numero_de_lanchas_salvavidas <= " + data.filterAdvanced.toNumero_de_lanchas_salvavidas;
    }
    if ((typeof data.filterAdvanced.fromCapacidad != 'undefined' && data.filterAdvanced.fromCapacidad)
      || (typeof data.filterAdvanced.toCapacidad != 'undefined' && data.filterAdvanced.toCapacidad)) {
      if (typeof data.filterAdvanced.fromCapacidad != 'undefined' && data.filterAdvanced.fromCapacidad)
        condition += " AND Aeronave.Capacidad >= " + data.filterAdvanced.fromCapacidad;

      if (typeof data.filterAdvanced.toCapacidad != 'undefined' && data.filterAdvanced.toCapacidad)
        condition += " AND Aeronave.Capacidad <= " + data.filterAdvanced.toCapacidad;
    }
    switch (data.filterAdvanced.Color_de_la_aeronaveFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeronave.Color_de_la_aeronave LIKE '" + data.filterAdvanced.Color_de_la_aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeronave.Color_de_la_aeronave LIKE '%" + data.filterAdvanced.Color_de_la_aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeronave.Color_de_la_aeronave LIKE '%" + data.filterAdvanced.Color_de_la_aeronave + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeronave.Color_de_la_aeronave = '" + data.filterAdvanced.Color_de_la_aeronave + "'";
        break;
    }
    switch (data.filterAdvanced.Color_cubierta_de_los_botesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeronave.Color_cubierta_de_los_botes LIKE '" + data.filterAdvanced.Color_cubierta_de_los_botes + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeronave.Color_cubierta_de_los_botes LIKE '%" + data.filterAdvanced.Color_cubierta_de_los_botes + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeronave.Color_cubierta_de_los_botes LIKE '%" + data.filterAdvanced.Color_cubierta_de_los_botes + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeronave.Color_cubierta_de_los_botes = '" + data.filterAdvanced.Color_cubierta_de_los_botes + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromVelocidad != 'undefined' && data.filterAdvanced.fromVelocidad)
      || (typeof data.filterAdvanced.toVelocidad != 'undefined' && data.filterAdvanced.toVelocidad)) {
      if (typeof data.filterAdvanced.fromVelocidad != 'undefined' && data.filterAdvanced.fromVelocidad)
        condition += " AND Aeronave.Velocidad >= " + data.filterAdvanced.fromVelocidad;

      if (typeof data.filterAdvanced.toVelocidad != 'undefined' && data.filterAdvanced.toVelocidad)
        condition += " AND Aeronave.Velocidad <= " + data.filterAdvanced.toVelocidad;
    }
    if ((typeof data.filterAdvanced.Tipo_de_Ala != 'undefined' && data.filterAdvanced.Tipo_de_Ala)) {
      switch (data.filterAdvanced.Tipo_de_AlaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Ala.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Ala + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Ala.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Ala + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Ala.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Ala + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Ala.Descripcion = '" + data.filterAdvanced.Tipo_de_Ala + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_AlaMultiple != null && data.filterAdvanced.Tipo_de_AlaMultiple.length > 0) {
      var Tipo_de_Alads = data.filterAdvanced.Tipo_de_AlaMultiple.join(",");
      condition += " AND Aeronave.Tipo_de_Ala In (" + Tipo_de_Alads + ")";
    }
    switch (data.filterAdvanced.UPAFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeronave.UPA LIKE '" + data.filterAdvanced.UPA + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeronave.UPA LIKE '%" + data.filterAdvanced.UPA + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeronave.UPA LIKE '%" + data.filterAdvanced.UPA + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeronave.UPA = '" + data.filterAdvanced.UPA + "'";
        break;
    }
    switch (data.filterAdvanced.UPA_MODELOFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeronave.UPA_MODELO LIKE '" + data.filterAdvanced.UPA_MODELO + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeronave.UPA_MODELO LIKE '%" + data.filterAdvanced.UPA_MODELO + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeronave.UPA_MODELO LIKE '%" + data.filterAdvanced.UPA_MODELO + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeronave.UPA_MODELO = '" + data.filterAdvanced.UPA_MODELO + "'";
        break;
    }
    switch (data.filterAdvanced.UPA_SERIEFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeronave.UPA_SERIE LIKE '" + data.filterAdvanced.UPA_SERIE + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeronave.UPA_SERIE LIKE '%" + data.filterAdvanced.UPA_SERIE + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeronave.UPA_SERIE LIKE '%" + data.filterAdvanced.UPA_SERIE + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeronave.UPA_SERIE = '" + data.filterAdvanced.UPA_SERIE + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromCiclos_iniciales != 'undefined' && data.filterAdvanced.fromCiclos_iniciales)
      || (typeof data.filterAdvanced.toCiclos_iniciales != 'undefined' && data.filterAdvanced.toCiclos_iniciales)) {
      if (typeof data.filterAdvanced.fromCiclos_iniciales != 'undefined' && data.filterAdvanced.fromCiclos_iniciales)
        condition += " AND Aeronave.Ciclos_iniciales >= " + data.filterAdvanced.fromCiclos_iniciales;

      if (typeof data.filterAdvanced.toCiclos_iniciales != 'undefined' && data.filterAdvanced.toCiclos_iniciales)
        condition += " AND Aeronave.Ciclos_iniciales <= " + data.filterAdvanced.toCiclos_iniciales;
    }
    if ((typeof data.filterAdvanced.fromCiclos_actuales != 'undefined' && data.filterAdvanced.fromCiclos_actuales)
      || (typeof data.filterAdvanced.toCiclos_actuales != 'undefined' && data.filterAdvanced.toCiclos_actuales)) {
      if (typeof data.filterAdvanced.fromCiclos_actuales != 'undefined' && data.filterAdvanced.fromCiclos_actuales)
        condition += " AND Aeronave.Ciclos_actuales >= " + data.filterAdvanced.fromCiclos_actuales;

      if (typeof data.filterAdvanced.toCiclos_actuales != 'undefined' && data.filterAdvanced.toCiclos_actuales)
        condition += " AND Aeronave.Ciclos_actuales <= " + data.filterAdvanced.toCiclos_actuales;
    }
    if ((typeof data.filterAdvanced.fromHoras_iniciales != 'undefined' && data.filterAdvanced.fromHoras_iniciales)
      || (typeof data.filterAdvanced.toHoras_iniciales != 'undefined' && data.filterAdvanced.toHoras_iniciales)) {
      if (typeof data.filterAdvanced.fromHoras_iniciales != 'undefined' && data.filterAdvanced.fromHoras_iniciales)
        condition += " and Aeronave.Horas_iniciales >= '" + data.filterAdvanced.fromHoras_iniciales + "'";

      if (typeof data.filterAdvanced.toHoras_iniciales != 'undefined' && data.filterAdvanced.toHoras_iniciales)
        condition += " and Aeronave.Horas_iniciales <= '" + data.filterAdvanced.toHoras_iniciales + "'";
    }
    if ((typeof data.filterAdvanced.fromHoras_actuales != 'undefined' && data.filterAdvanced.fromHoras_actuales)
      || (typeof data.filterAdvanced.toHoras_actuales != 'undefined' && data.filterAdvanced.toHoras_actuales)) {
      if (typeof data.filterAdvanced.fromHoras_actuales != 'undefined' && data.filterAdvanced.fromHoras_actuales)
        condition += " and Aeronave.Horas_actuales >= '" + data.filterAdvanced.fromHoras_actuales + "'";

      if (typeof data.filterAdvanced.toHoras_actuales != 'undefined' && data.filterAdvanced.toHoras_actuales)
        condition += " and Aeronave.Horas_actuales <= '" + data.filterAdvanced.toHoras_actuales + "'";
    }
    if ((typeof data.filterAdvanced.fromInicio_de_operaciones != 'undefined' && data.filterAdvanced.fromInicio_de_operaciones)
      || (typeof data.filterAdvanced.toInicio_de_operaciones != 'undefined' && data.filterAdvanced.toInicio_de_operaciones)) {
      if (typeof data.filterAdvanced.fromInicio_de_operaciones != 'undefined' && data.filterAdvanced.fromInicio_de_operaciones)
        condition += " and CONVERT(VARCHAR(10), Aeronave.Inicio_de_operaciones, 102)  >= '" + moment(data.filterAdvanced.fromInicio_de_operaciones).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toInicio_de_operaciones != 'undefined' && data.filterAdvanced.toInicio_de_operaciones)
        condition += " and CONVERT(VARCHAR(10), Aeronave.Inicio_de_operaciones, 102)  <= '" + moment(data.filterAdvanced.toInicio_de_operaciones).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Bitacora != 'undefined' && data.filterAdvanced.Bitacora)) {
      switch (data.filterAdvanced.BitacoraFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Bitacora_de_Aeronave.Descripcion LIKE '" + data.filterAdvanced.Bitacora + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Bitacora_de_Aeronave.Descripcion LIKE '%" + data.filterAdvanced.Bitacora + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Bitacora_de_Aeronave.Descripcion LIKE '%" + data.filterAdvanced.Bitacora + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Bitacora_de_Aeronave.Descripcion = '" + data.filterAdvanced.Bitacora + "'";
          break;
      }
    } else if (data.filterAdvanced.BitacoraMultiple != null && data.filterAdvanced.BitacoraMultiple.length > 0) {
      var Bitacorads = data.filterAdvanced.BitacoraMultiple.join(",");
      condition += " AND Aeronave.Bitacora In (" + Bitacorads + ")";
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
          if (column === 'Matricula') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Aeronaves);
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
