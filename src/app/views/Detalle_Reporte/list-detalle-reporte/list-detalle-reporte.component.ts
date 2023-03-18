import { CollectionViewer, DataSource } from "@angular/cdk/collections";
import { AfterViewChecked, AfterViewInit, Component, OnInit, Renderer2, ViewChild } from "@angular/core";
import { MatDialog } from "@angular/material/dialog";
import { MatPaginator } from "@angular/material/paginator";
import { MatSort } from "@angular/material/sort";
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from "@ngx-translate/core";
import { BehaviorSubject, merge, Observable, of } from "rxjs";
import { catchError, debounceTime, distinctUntilChanged, finalize, startWith, switchMap, tap } from "rxjs/operators";
import { Agrupacion_Concepto_Balance_GeneralService } from "src/app/api-services/Agrupacion_Concepto_Balance_General.service";
import { SpartanFileService } from "src/app/api-services/spartan-file.service";
import { Agrupacion_Concepto_Balance_General } from "src/app/models/Agrupacion_Concepto_Balance_General";
import { Agrupacion_Concepto_Balance_GeneralIndexRules } from "src/app/shared/businessRules/Agrupacion_Concepto_Balance_General-index-rules";
import { BusinessRulesFunctions } from "src/app/shared/businessRules/business-rules-functions";
import { FormControl, FormGroup, Validators } from "@angular/forms";
import { AeronaveService } from "src/app/api-services/Aeronave.service";
import { AeropuertosService } from "src/app/api-services/Aeropuertos.service";
import { ClienteService } from "src/app/api-services/Cliente.service";
import { ExcelService } from "src/app/api-services/excel.service";
import { PasajerosService } from "src/app/api-services/Pasajeros.service";
import { ReportesService } from "src/app/api-services/reportes.service";
import { SeguridadService } from "src/app/api-services/seguridad.service";
import { SpartanUserService } from "src/app/api-services/spartan-user.service";
import { SpartanService } from "src/app/api-services/spartan.service";
import { TripulacionService } from "src/app/api-services/Tripulacion.service";
import { Spartan_ReportService } from "src/app/api-services/Spartan_Report.service"
import { StorageKeys } from "src/app/app-constants";
import { base64ToArrayBuffer, saveByteArray } from 'src/app/functions/blob-function';
import { LocalStorageHelper } from "src/app/helpers/local-storage-helper";
import { MessagesHelper } from "src/app/helpers/messages-helper";
import { Aeronave } from "src/app/models/Aeronave";
import { Aeropuertos } from "src/app/models/Aeropuertos";
import { Cliente } from "src/app/models/Cliente";
import { Enumerations } from "src/app/models/enumerations";
import { ObjectPermission } from "src/app/models/object-permission";
import { Pasajeros } from "src/app/models/Pasajeros";
import { Tripulacion } from "src/app/models/Tripulacion";
import { HtmlEditorDialogComponent } from "src/app/shared/views/dialogs/html-editor-dialog/html-editor-dialog.component";
import _ from "underscore";
import { ExcelUtil } from "src/app/helpers/excelUtil"
import { MatSnackBar } from "@angular/material/snack-bar";
import * as AppConstants from "../../../app-constants";
import pdfMake from "pdfmake/build/pdfmake";
import { NgxSpinnerService } from "ngx-spinner";



@Component({
  selector: "app-list-detalle-reporte",
  templateUrl: "./list-detalle-reporte.component.html",
  styleUrls: ["./list-detalle-reporte.component.scss"],
})
export class ListDetalleReporteComponent extends Agrupacion_Concepto_Balance_GeneralIndexRules implements OnInit, AfterViewInit, AfterViewChecked {

  //#region Variables

  ExportType = Enumerations.Enums.ExportType;
  filtrosForm: FormGroup;
  initialValueFiltrosForm = {
    FechaDesde: '',
    FechaHasta: '',
    Aeropuerto: '',
    Aeropuerto_Destino: '',
    Aeronaves: '',
    Imprimir_solo_aeronaves_activas: '',
    Mostrar_Aeronave: 3,
    Clientes: '',
    Imprimir_solo_clientes_activos: '',
    Mostrar_Cliente: 3,
    Pasajeros: '',
    Imprimir_solo_pasajeros_activos: '',
    Mostrar_Pasajero: 3,
    Pilotos: '',
    Imprimir_solo_pilotos_activos: '',
    Mostrar_Piloto: 3,
    Vuelos_como_capitan_o_primer_oficial: '',
  }
  brf: BusinessRulesFunctions;



  displayedColumns = ["acciones", "Clave", "Descripcion"];

  reportId = this.route.snapshot.paramMap.get('index');
  permisos: ObjectPermission[] = [];
  index: string;
  phase = 0;
  public listConfig = {
    columns: ["acciones", "Clave", "Descripcion"],
    columns_filters: ["acciones_filtro", "Clave_filtro", "Descripcion_filtro"],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      Descripcion: "",
    },
  };

  dataSource: Agrupacion_Concepto_Balance_GeneralDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Agrupacion_Concepto_Balance_GeneralDataSource;
  dataClipboard: any;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  reportObject: any
  title: string = ""
  minFechaHasta: Date;

  /**Almancena el resultado de aeropuertos */
  listaAeropuertos: Observable<Aeropuertos[]>;
  listaAeropuerto_Destino: Observable<Aeropuertos[]>;
  listaAeronaves: Observable<Aeronave[]>;
  listaClientes: Observable<Cliente[]>;
  listaPasajeros: Observable<Pasajeros[]>;
  listaPilotos: Observable<Tripulacion[]>;

  isLoadingAeropuerto: boolean = false
  isLoadingAeropuerto_Destino: boolean = false
  isLoadingAeronaves: boolean = false
  isLoadingClientes: boolean = false
  isLoadingPasajeros: boolean = false
  isLoadingPilotos: boolean = false


  notFound: string = "No se encontraron registros."
  loadingText: string = "Cargando..."
  //#endregion


  constructor(
    private _Agrupacion_Concepto_Balance_GeneralService: Agrupacion_Concepto_Balance_GeneralService,
    public _dialog: MatDialog,
    private _messages: MessagesHelper,
    private _seguridad: SeguridadService,
    private _translate: TranslateService,
    public _file: SpartanFileService,
    private excelService: ExcelService,
    _user: SpartanUserService,
    private _SpartanService: SpartanService,
    private localStorageHelper: LocalStorageHelper,
    private route: ActivatedRoute,
    renderer: Renderer2,
    private _aeropuertos: AeropuertosService,
    private _aeronaves: AeronaveService,
    private _clientes: ClienteService,
    private _pasajeros: PasajerosService,
    private _pilotos: TripulacionService,
    private _reportes: ReportesService,
    private activateRoute: ActivatedRoute,
    private spartan_ReportService: Spartan_ReportService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,

  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

    this.filtrosForm = new FormGroup({
      FechaDesde: new FormControl(''),
      FechaHasta: new FormControl(''),
      Aeropuerto: new FormControl(''),
      Aeropuerto_Destino: new FormControl(''),
      Aeronaves: new FormControl(''),
      Imprimir_solo_aeronaves_activas: new FormControl(''),
      Mostrar_Aeronave: new FormControl(3),
      Clientes: new FormControl(''),
      Imprimir_solo_clientes_activos: new FormControl(''),
      Mostrar_Cliente: new FormControl(3),
      Pasajeros: new FormControl(''),
      Imprimir_solo_pasajeros_activos: new FormControl(''),
      Mostrar_Pasajero: new FormControl(3),
      Pilotos: new FormControl(''),
      Imprimir_solo_pilotos_activos: new FormControl(''),
      Mostrar_Piloto: new FormControl(3),
      Vuelos_como_capitan_o_primer_oficial: new FormControl(''),
    });

  }

  ngOnInit() {

    this.activateRoute.paramMap.subscribe(
      params => {
        this.index = params.get('index');
        this.reportId = params.get('index');
        if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") != this.index) {
          this.localStorageHelper.setItemToLocalStorage("QueryParam", this.index);
          this.ngOnInit();
        }
        this.setDefaultValueFilter();
        this.getTitle();
      });

    this.rulesBeforeCreationList();
    this.dataSource = new Agrupacion_Concepto_Balance_GeneralDataSource(
      this._Agrupacion_Concepto_Balance_GeneralService,
      this._file
    );



    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Agrupacion_Concepto_Balance_General)
      .subscribe((response) => {
        this.permisos = response;
      });
    this.consultaDropdows();

  }

  ngAfterViewInit() {
    this.rulesAfterCreationList();
    /* merge(this.sort.sortChange, this.paginator.page)
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
    this.loadPaginatorTranslate(); */
  }

  ngAfterViewChecked() {
    this.rulesAfterViewChecked();
  }

  refresh() {
    this.listConfig.page = 0;
    this.loadData();
  }

  //#region Obtener Titulo de Reporte
  getTitle() {

    this.sqlModel.query = `SELECT TOP 1 Report_Name FROM Spartan_Report WHERE ReportId = ${this.index}`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe((result) => {
      this.title = result;
    });

  }
  //#endregion

  //#region Limpiar Filtros  
  clearFilter() {
    this.listConfig.page = 0;
    this.listConfig.filter.Clave = "";
    this.listConfig.filter.Descripcion = "";

    this.listConfig.page = 0;
    this.filtrosForm.reset();
    this.setDefaultValueFilter();
    this.loadData();
  }

  setDefaultValueFilter() {
    this.filtrosForm.patchValue(this.initialValueFiltrosForm);
  }
  //#endregion

  //#region Completar información de Selects
  consultaDropdows(): void {
    this.searchAeropuerto()
    this.searchAeropuerto_Destino()
    this.searchAeronaves();
    this.searchClientes();
    this.searchPasajeros();
    this.searchPilotos();
  }
  //#endregion

  //#region Consulta de Aeropuertos Origen
  searchAeropuerto(term?: string) {
    this.isLoadingAeropuerto = true;
    if (term == "" || term == null || term == undefined) {
      this._aeropuertos.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingAeropuerto = false;
        this.listaAeropuertos = of(result?.Aeropuertoss);
      }, error => {
        this.isLoadingAeropuerto = false;
        this.listaAeropuertos = of([]);
      });;
    }
    else if (term != "") {
      this._aeropuertos.listaSelAll(0, 20, "Aeropuertos.Descripcion like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingAeropuerto = false;
        this.listaAeropuertos = of(result?.Aeropuertoss);
      }, error => {
        this.isLoadingAeropuerto = false;
        this.listaAeropuertos = of([]);
      });;
    }
  }
  //#endregion

  //#region Consulta de Aeropuertos Destino
  searchAeropuerto_Destino(term?: string) {
    this.isLoadingAeropuerto_Destino = true;
    if (term == "" || term == null || term == undefined) {
      this._aeropuertos.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingAeropuerto_Destino = false;
        this.listaAeropuerto_Destino = of(result?.Aeropuertoss);
      }, error => {
        this.isLoadingAeropuerto_Destino = false;
        this.listaAeropuerto_Destino = of([]);
      });;
    }
    else if (term != "") {
      this._aeropuertos.listaSelAll(0, 20, "Aeropuertos.Descripcion like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingAeropuerto_Destino = false;
        this.listaAeropuerto_Destino = of(result?.Aeropuertoss);
      }, error => {
        this.isLoadingAeropuerto_Destino = false;
        this.listaAeropuerto_Destino = of([]);
      });;
    }
  }
  //#endregion

  //#region Consulta de Aeronaves
  searchAeronaves(term?: string) {
    this.isLoadingAeronaves = true;
    if (term == "" || term == null || term == undefined) {
      this._aeronaves.listaSelAll(0, 20, "").subscribe((result: any) => {
        this.isLoadingAeronaves = false;
        this.listaAeronaves = of(result?.Aeronaves);
      }, error => {
        this.isLoadingAeronaves = false;
        this.listaAeronaves = of([]);
      });;
    }
    else if (term != "") {
      this._aeronaves.listaSelAll(0, 20, "Aeronave.Matricula like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingAeronaves = false;
        this.listaAeronaves = of(result?.Aeronaves);
      }, error => {
        this.isLoadingAeronaves = false;
        this.listaAeronaves = of([]);
      });;
    }
  }
  //#endregion

  //#region Consulta de Clientes
  searchClientes(term?: string) {
    this.isLoadingClientes = true;
    if (term == "" || term == null || term == undefined) {
      this._clientes.listaSelAll(0, 20, "").subscribe((result: any) => {
        this.isLoadingClientes = false;
        this.listaClientes = of(result?.Clientes);
      }, error => {
        this.isLoadingClientes = false;
        this.listaClientes = of([]);
      });;
    }
    else if (term != "") {
      this._clientes.listaSelAll(0, 20, "Cliente.Razon_Social like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingClientes = false;
        this.listaClientes = of(result?.Clientes);
      }, error => {
        this.isLoadingClientes = false;
        this.listaClientes = of([]);
      });;
    }
  }
  //#endregion

  //#region Consulta de Pasajeros
  searchPasajeros(term?: string) {
    this.isLoadingPasajeros = true;
    if (term == "" || term == null || term == undefined) {
      this._pasajeros.listaSelAll(0, 20, "").subscribe((result: any) => {
        this.isLoadingPasajeros = false;
        this.listaPasajeros = of(result?.Pasajeross);
      }, error => {
        this.isLoadingPasajeros = false;
        this.listaPasajeros = of([]);
      });;
    }
    else if (term != "") {
      this._pasajeros.listaSelAll(0, 20, "Pasajeros.Nombre_completo like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingPasajeros = false;
        this.listaPasajeros = of(result?.Pasajeross);
      }, error => {
        this.isLoadingPasajeros = false;
        this.listaPasajeros = of([]);
      });;
    }
  }
  //#endregion

  //#region Consulta de Pilotos
  searchPilotos(term?: string) {
    this.isLoadingPilotos = true;
    if (term == "" || term == null || term == undefined) {
      this._pilotos.listaSelAll(0, 20, "").subscribe((result: any) => {
        this.isLoadingPilotos = false;
        this.listaPilotos = of(result?.Tripulacions);
      }, error => {
        this.isLoadingPilotos = false;
        this.listaPilotos = of([]);
      });;
    }
    else if (term != "") {
      this._pilotos.listaSelAll(0, 20, "Tripulacion.Nombre_completo like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingPilotos = false;
        this.listaPilotos = of(result?.Tripulacions);
      }, error => {
        this.isLoadingPilotos = false;
        this.listaPilotos = of([]);
      });;
    }
  }
  //#endregion

  //#region Asignar Tiempo de Vuelo
  setMinFechaHasta() {

    let FechaDesde = this.filtrosForm.controls['FechaDesde'].value
    this.minFechaHasta = new Date(FechaDesde)

  }
  //#endregion


  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  applyRules() { }

  rulesAfterCreationList() {

  }

  rulesBeforeCreationList() {
  }

  //Fin de reglas


  loadPaginatorTranslate() {
    this._translate.get("general").subscribe(() => {
      this.paginator._intl.itemsPerPageLabel = this._translate.instant(
        "general.items_per_page"
      );
      this.paginator._intl.nextPageLabel =
        this._translate.instant("general.next_page");
      this.paginator._intl.previousPageLabel = this._translate.instant(
        "general.previus_page"
      );
      this.paginator._intl.firstPageLabel =
        this._translate.instant("general.first_page");
      this.paginator._intl.lastPageLabel =
        this._translate.instant("general.last_page");
    });
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

  remove(row: Agrupacion_Concepto_Balance_General) {
    this._messages
      .confirmation("¿Está seguro de que desea eliminar este registro?", "")
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Agrupacion_Concepto_Balance_GeneralService
          .delete(+row.Clave)
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
  /*ActionPrint(dataRow: Agrupacion_Concepto_Balance_General) {
    this.dialogo
      .open(DialogPrintFormatComponent, {
        data: dataRow,
      })
      .afterClosed()
      .subscribe((optionSelected: boolean) => {
        if (optionSelected) {
          alert("Pendiente de implementar.");
        }
      });
  }*/

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  Editor_HTML(title: string, info: string) {
    const data = {
      titleDialog: title,
      infoDialog: info,
    };
    this._dialog.open(HtmlEditorDialogComponent, { data });
  }

  /** Construir tabla con datos a exportar (PDF)
   * @param data : Contenedor de datos
   */

  SetTableExportPdf(data: any) {
    let new_data = [];
    let header = ["Clave", "Descripción"];
    new_data.push(header);
    data.forEach((x) => {
      let new_content = [x.Clave, x.Descripcion];
      new_data.push(new_content);
    });

    const pdfDefinition: any = {
      pageOrientation: "landscape",
      content: [
        {
          table: {
            // widths:['*',200,'auto'],
            body: new_data,
          },
        },
      ],
    };
    pdfMake
      .createPdf(pdfDefinition)
      .download("Agrupacion_Concepto_Balance_General.pdf");
  }

  /** Construye el filtro para los reportes en PDF, apartir del formulario*/
  createFilterPdfFromForm(): string {
    const parseKeys = {
      Mostrar_Aeronave: 'AeronaveGrupo',
      Mostrar_Cliente: 'ClienteGrupo',
      Mostrar_Pasajero: 'PasajeroGrupo',
      Mostrar_Piloto: 'PilotoGrupo'
    }
    return Object.keys(this.filtrosForm.value).reduce((filtros, key) => {
      let value = this.filtrosForm.value[key];

      if (key == "Aeronaves" && value != "" && value != null) {
        value = `'${value}'`
      }

      return value ? filtros + (value instanceof Date ? `@${parseKeys[key] || key}=${"'" + value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate() + "'"},` : `@${parseKeys[key] || key}=${value},`) : filtros;
    }, '').slice(0, -1);
  }

  /** Construye el filtro para los reportes en EXCEL, apartir del formulario*/
  createFilterExcelFromForm(): Record<'PhysicalName' | 'Valor', string>[] {
    const parseKeys = {
      Mostrar_Aeronave: 'AeronaveGrupo',
      Mostrar_Cliente: 'ClienteGrupo',
      Mostrar_Pasajero: 'PasajeroGrupo',
      Mostrar_Piloto: 'PilotoGrupo'
    }
    return Object.keys(this.filtrosForm.value).reduce((filtros, key) => {
      const value = this.filtrosForm.value[key];
      filtros.push({ PhysicalName: parseKeys[key] || key, Valor: value instanceof Date ? "'" + value.getFullYear() + '-' + (value.getMonth() + 1) + '-' + value.getDate() + "'" : value });
      return filtros;
    }, [] as Record<'PhysicalName' | 'Valor', string>[]);
  }

  /**
   * Exportar información
   * @param exportType : Tipo de exportación (XLS|PDF)
   */
  ActionExport(exportType: number) {

    this.dataSource.loadingSubject.next(true);

    switch (exportType) {
      case Enumerations.Enums.ExportType.XLS:

        this.getReportByKey();

        break;
      case Enumerations.Enums.ExportType.PDF:
        this._reportes.exportPDF(this.reportId, this.createFilterPdfFromForm()).subscribe((res) => {
          //Implementar Mensaje si no hay reportes
          saveByteArray('Reporte.pdf', base64ToArrayBuffer(res), 'application/pdf');
          this.dataSource.loadingSubject.next(false);
        });
        break;
    }


  }

  //#region Obtener Reporte por Id
  getReportByKey() {

    let reportId = parseInt(this.reportId)

    this.spartan_ReportService.getById(reportId).subscribe({
      next: (response) => {

        this.reportObject = response;

      },
      error: e => console.error(e),
      complete: () => {
        this.execQueryReport(this.reportObject.Query)
      }

    })
  }
  //#endregion

  //#region Obtener Lista de Datos de Reporte
  execQueryReport(query) {
    let filters: any = ""
    let arrayExcel: any;

    this.createFilterExcelFromForm().forEach(element => {
      if (element.PhysicalName == "Aeronaves" && element.Valor != null && element.Valor != "") {
        filters += `@${element.PhysicalName} = '${element.Valor}',`
      }
      else if (element.Valor != "" && element.Valor != null) {
        filters += `@${element.PhysicalName} = ${element.Valor},`
      }
    });
    filters = filters.substring(0, filters.length - 1);

    this.sqlModel.query = `${query} ${filters}`;

    this._SpartanService.GetRawQuery(this.sqlModel).subscribe({
      next: (response) => {

        arrayExcel = JSON.parse(response);// Parsear a JSON para deserealizar el SQL Query

      },
      error: e => console.error(e),
      complete: () => {
        //Exportar a Excel
        if (this.validateQuantityExcel(arrayExcel)) {
          ExcelUtil.exportArrayToExcel(arrayExcel, this.title);
        }
        this.dataSource.loadingSubject.next(false);
      }

    })
  }
  //#endregion

  //#region Validar Cantidad de Registros en Excel
  validateQuantityExcel(array): boolean {
    let isValid: boolean = true;

    if (array == null || array.length == 0) {
      this.snackBar.open('No existen registros con los filtros indicados.', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
      isValid = false;
    }

    return isValid
  }
  //#endregion


  /**
   * Exportar a Excel
   * @param data : Data a exportar
   */
  ExportToExcel(data: any) {
    const that = this;
    const excelData = _.map(data, function (fields) {
      return {
        "Clave ": fields.Clave,
        "Descripción ": fields.Descripcion,
      };
    });
    this.excelService.exportAsExcelFile(
      excelData,
      `Agrupacion_Concepto_Balance_General  ${new Date().toLocaleString()}`
    );
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map((x) => ({
      Clave: x.Clave,
      Descripcion: x.Descripcion,
    }));

    this.excelService.exportToCsv(
      result,
      "Agrupacion_Concepto_Balance_General",
      ["Clave", "Descripcion"]
    );
  }

  /**
   * Construir tabla con datos a exportar (XLS | CSV | PDF | PTR)
   * @param data : Contenedor de datos
   */
  SetTableExport(data: any): string {
    let template: string;

    template = '<table id="xxx" boder="1">';
    template += "  <thead>";
    template += "      <tr>";
    template += "          <th>FOLIO</th>";
    template += "          <th>SALIDA</th>";
    template += "          <th>ORIGEN</th>";
    template += "          <th>DESTINO</th>";
    template += "          <th>VUELO</th>";
    template += "          <th>CALZO</th>";
    template += "          <th>TRIPULACION</th>";
    template += "          <th>CLIENTE</th>";
    template += "          <th>CANT. PASAJEROS</th>";
    template += "          <th>PASAJEROS</th>";
    template += "      </tr>";
    template += "  </thead>";
    template += "  <tbody>";

    data.forEach((element) => {
      template += "      <tr>";
      template += "          <td>" + element.Descripcion + "</td>";
      template += "          <td>" + element.Clave + "</td>";
      template += "          <td>" + element.Descripcion + "</td>";
      template += "          <td>" + element.Clave + "</td>";
      template += "          <td>" + element.Descripcion + "</td>";
      template += "          <td>" + element.Clave + "</td>";
      template += "          <td>" + element.Descripcion + "</td>";
      template += "          <td>" + element.Clave + "</td>";
      template += "          <td>" + element.Descripcion + "</td>";

      template += "      </tr>";
    });

    template += "  </tbody>";
    template += "</table>";

    return template;
  }

  /**
   * Construir tabla con datos a exportar (Portapapeles)
   * @param data : Contenedor de datos
   */
  SetTableExportToClipboard(data: any): string {
    let template: string;
    template = "";
    template += "\t Aeronave";
    template += "\t Vuelos";
    template += "\t Tramos";
    template += "\t Horas Vuelo";
    template += "\t Horas Calzo";
    template += "\t Distancia";
    template += "\t Pax";
    template += "\t Combustible";
    template += "\t Prom. Vuelo Folio";
    template += "\t Prom. Vuelo Tramo";
    template += "\t Prom. Calzo Folio";
    template += "\t Prom. Calzo Tramo";
    template += "\t Prom. Pax Vuelo";
    template += "\t Prom. Pax Tramo";
    template += "\t Prom. KM Pax";
    template += "\t Prom. MN Pax";
    template += "\n";

    data.forEach((element) => {
      template += "\t " + element.Clave;
      template += "\t " + element.Descripcion;

      template += "\n";
    });

    return template;
  }
}

export class Agrupacion_Concepto_Balance_GeneralDataSource
  implements DataSource<Agrupacion_Concepto_Balance_General>
{
  private subject = new BehaviorSubject<Agrupacion_Concepto_Balance_General[]>(
    []
  );
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(
    private service: Agrupacion_Concepto_Balance_GeneralService,
    private _file: SpartanFileService
  ) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Agrupacion_Concepto_Balance_General[]> {
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
          if (column === "Clave") {
            // Clave primaria
            data.styles[
              column
            ] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != "acciones") {
            // Campos que no son acciones ni HTML ni Archivos
            try {
              const longest = result.Agrupacion_Concepto_Balance_Generals.map(
                (x) => (x[column] ? x[column].toString() : "")
              ).sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10
                }px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) { }
          } else if (false) {
            // Campos que son HTML o Archivos
            data.styles[
              column
            ] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Agrupacion_Concepto_Balance_Generals);
        this.totalSubject.next(result.RowCount);
      });
  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {
    let condition = "1 = 1 ";
    if (data.filter.Clave != "")
      condition +=
        " and Agrupacion_Concepto_Balance_General.Clave = " + data.filter.Clave;
    if (data.filter.Descripcion != "")
      condition +=
        " and Agrupacion_Concepto_Balance_General.Descripcion like '%" +
        data.filter.Descripcion +
        "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = "";

    switch (data.sortField) {
      case "Clave":
        sort =
          " Agrupacion_Concepto_Balance_General.Clave " + data.sortDirecction;
        break;
      case "Descripcion":
        sort =
          " Agrupacion_Concepto_Balance_General.Descripcion " +
          data.sortDirecction;
        break;
    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if (
      (typeof data.filterAdvanced.fromClave != "undefined" &&
        data.filterAdvanced.fromClave) ||
      (typeof data.filterAdvanced.toClave != "undefined" &&
        data.filterAdvanced.toClave)
    ) {
      if (
        typeof data.filterAdvanced.fromClave != "undefined" &&
        data.filterAdvanced.fromClave
      )
        condition +=
          " AND Agrupacion_Concepto_Balance_General.Clave >= " +
          data.filterAdvanced.fromClave;

      if (
        typeof data.filterAdvanced.toClave != "undefined" &&
        data.filterAdvanced.toClave
      )
        condition +=
          " AND Agrupacion_Concepto_Balance_General.Clave <= " +
          data.filterAdvanced.toClave;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition +=
          " AND Agrupacion_Concepto_Balance_General.Descripcion LIKE '" +
          data.filterAdvanced.Descripcion +
          "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition +=
          " AND Agrupacion_Concepto_Balance_General.Descripcion LIKE '%" +
          data.filterAdvanced.Descripcion +
          "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition +=
          " AND Agrupacion_Concepto_Balance_General.Descripcion LIKE '%" +
          data.filterAdvanced.Descripcion +
          "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition +=
          " AND Agrupacion_Concepto_Balance_General.Descripcion = '" +
          data.filterAdvanced.Descripcion +
          "'";
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
          if (column === "Clave") {
            // Clave primaria
            data.styles[
              column
            ] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != "acciones") {
            // Campos que no son acciones ni HTML ni Archivos
            try {
              const longest = result.Agrupacion_Concepto_Balance_Generals.map(
                (x) => (x[column] ? x[column].toString() : "")
              ).sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10
                }px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) { }
          } else if (false) {
            // Campos que son HTML o Archivos
            data.styles[
              column
            ] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Agrupacion_Concepto_Balance_Generals);
        this.totalSubject.next(result.RowCount);
      });
  }

  ShowFile(key: number | string) {
    const id = parseInt(key.toString());
    const file = this._file.getById(id).subscribe((data) => {
      const url = this._file.url(data.File_Id.toString(), data.Description);
      window.open(url, "_blank");
    });
  }

}
