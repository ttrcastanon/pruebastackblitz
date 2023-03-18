import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Filtros_de_reportesService } from "src/app/api-services/Filtros_de_reportes.service";
import { Filtros_de_reportes } from "src/app/models/Filtros_de_reportes";
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
import { Filtros_de_reportesIndexRules } from 'src/app/shared/businessRules/Filtros_de_reportes-index-rules';
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
  selector: "app-list-Filtros_de_reportes",
  templateUrl: "./list-Filtros_de_reportes.component.html",
  styleUrls: ["./list-Filtros_de_reportes.component.scss"],
})
export class ListFiltros_de_reportesComponent extends Filtros_de_reportesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Fecha",
    "Aeronaves",
    "Imprimir_solo_aeronaves_activas",
    "Mostrar_Aeronave",
    "Clientes",
    "Imprimir_solo_clientes_activos",
    "Mostrar_Cliente",
    "Pasajeros",
    "Imprimir_solo_pasajeros_activos",
    "Mostrar_Pasajero",
    "Pilotos",
    "Imprimir_solo_pilotos_activos",
    "Mostrar_Piloto",
    "Vuelos_como_capitan_o_primer_oficial",
    "Aeropuerto",
    "Aeropuerto_Destino",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha",
      "Aeronaves",
      "Imprimir_solo_aeronaves_activas",
      "Mostrar_Aeronave",
      "Clientes",
      "Imprimir_solo_clientes_activos",
      "Mostrar_Cliente",
      "Pasajeros",
      "Imprimir_solo_pasajeros_activos",
      "Mostrar_Pasajero",
      "Pilotos",
      "Imprimir_solo_pilotos_activos",
      "Mostrar_Piloto",
      "Vuelos_como_capitan_o_primer_oficial",
      "Aeropuerto",
      "Aeropuerto_Destino",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_filtro",
      "Aeronaves_filtro",
      "Imprimir_solo_aeronaves_activas_filtro",
      "Mostrar_Aeronave_filtro",
      "Clientes_filtro",
      "Imprimir_solo_clientes_activos_filtro",
      "Mostrar_Cliente_filtro",
      "Pasajeros_filtro",
      "Imprimir_solo_pasajeros_activos_filtro",
      "Mostrar_Pasajero_filtro",
      "Pilotos_filtro",
      "Imprimir_solo_pilotos_activos_filtro",
      "Mostrar_Piloto_filtro",
      "Vuelos_como_capitan_o_primer_oficial_filtro",
      "Aeropuerto_filtro",
      "Aeropuerto_Destino_filtro",

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
      Fecha: null,
      Aeronaves: "",
      Imprimir_solo_aeronaves_activas: "",
      Mostrar_Aeronave: "",
      Clientes: "",
      Imprimir_solo_clientes_activos: "",
      Mostrar_Cliente: "",
      Pasajeros: "",
      Imprimir_solo_pasajeros_activos: "",
      Mostrar_Pasajero: "",
      Pilotos: "",
      Imprimir_solo_pilotos_activos: "",
      Mostrar_Piloto: "",
      Vuelos_como_capitan_o_primer_oficial: "",
      Aeropuerto: "",
      Aeropuerto_Destino: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha: "",
      toFecha: "",
      AeronavesFilter: "",
      Aeronaves: "",
      AeronavesMultiple: "",
      Mostrar_AeronaveFilter: "",
      Mostrar_Aeronave: "",
      Mostrar_AeronaveMultiple: "",
      ClientesFilter: "",
      Clientes: "",
      ClientesMultiple: "",
      Mostrar_ClienteFilter: "",
      Mostrar_Cliente: "",
      Mostrar_ClienteMultiple: "",
      PasajerosFilter: "",
      Pasajeros: "",
      PasajerosMultiple: "",
      Mostrar_PasajeroFilter: "",
      Mostrar_Pasajero: "",
      Mostrar_PasajeroMultiple: "",
      PilotosFilter: "",
      Pilotos: "",
      PilotosMultiple: "",
      Mostrar_PilotoFilter: "",
      Mostrar_Piloto: "",
      Mostrar_PilotoMultiple: "",
      AeropuertoFilter: "",
      Aeropuerto: "",
      AeropuertoMultiple: "",
      Aeropuerto_DestinoFilter: "",
      Aeropuerto_Destino: "",
      Aeropuerto_DestinoMultiple: "",

    }
  };

  dataSource: Filtros_de_reportesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Filtros_de_reportesDataSource;
  dataClipboard: any;

  constructor(
    private _Filtros_de_reportesService: Filtros_de_reportesService,
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
    this.dataSource = new Filtros_de_reportesDataSource(
      this._Filtros_de_reportesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Filtros_de_reportes)
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
    this.listConfig.filter.Fecha = undefined;
    this.listConfig.filter.Aeronaves = "";
    this.listConfig.filter.Imprimir_solo_aeronaves_activas = undefined;
    this.listConfig.filter.Mostrar_Aeronave = "";
    this.listConfig.filter.Clientes = "";
    this.listConfig.filter.Imprimir_solo_clientes_activos = undefined;
    this.listConfig.filter.Mostrar_Cliente = "";
    this.listConfig.filter.Pasajeros = "";
    this.listConfig.filter.Imprimir_solo_pasajeros_activos = undefined;
    this.listConfig.filter.Mostrar_Pasajero = "";
    this.listConfig.filter.Pilotos = "";
    this.listConfig.filter.Imprimir_solo_pilotos_activos = undefined;
    this.listConfig.filter.Mostrar_Piloto = "";
    this.listConfig.filter.Vuelos_como_capitan_o_primer_oficial = undefined;
    this.listConfig.filter.Aeropuerto = "";
    this.listConfig.filter.Aeropuerto_Destino = "";

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

  remove(row: Filtros_de_reportes) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Filtros_de_reportesService
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
  ActionPrint(dataRow: Filtros_de_reportes) {

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
,'Fecha'
,'Aeronaves'
,'Imprimir sólo aeronaves activas'
,'Mostrar'
,'Clientes'
,'Imprimir solo clientes activos'
,'Pasajeros'
,'Imprimir solo pasajeros activos'
,'Pilotos'
,'Imprimir solo pilotos activos'
,'Vuelos como capitan o primer oficial'
,'Aeropuerto'
,'Aeropuerto Destino'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Fecha
,x.Aeronaves_Aeronave.Matricula
,x.Imprimir_solo_aeronaves_activas
,x.Mostrar_Aeronave_Tipo_de_Grupo.Descripcion
,x.Clientes_Cliente.Razon_Social
,x.Imprimir_solo_clientes_activos
,x.Mostrar_Cliente_Tipo_de_Grupo.Descripcion
,x.Pasajeros_Pasajeros.Nombre_completo
,x.Imprimir_solo_pasajeros_activos
,x.Mostrar_Pasajero_Tipo_de_Grupo.Descripcion
,x.Pilotos_Tripulacion.Nombre_completo
,x.Imprimir_solo_pilotos_activos
,x.Mostrar_Piloto_Tipo_de_Grupo.Descripcion
,x.Vuelos_como_capitan_o_primer_oficial
,x.Aeropuerto_Aeropuertos.Nombre
,x.Aeropuerto_Destino_Aeropuertos.Nombre
		  
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
    pdfMake.createPdf(pdfDefinition).download('Filtros_de_reportes.pdf');
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
          this._Filtros_de_reportesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Filtros_de_reportess;
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
          this._Filtros_de_reportesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Filtros_de_reportess;
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
        'Fecha ': fields.Fecha ? momentJS(fields.Fecha).format('DD/MM/YYYY') : '',
        'Aeronaves ': fields.Aeronaves_Aeronave.Matricula,
        'Imprimir_solo_aeronaves_activas ': fields.Imprimir_solo_aeronaves_activas ? 'SI' : 'NO',
        'Mostrar ': fields.Mostrar_Aeronave_Tipo_de_Grupo.Descripcion,
        'Clientes ': fields.Clientes_Cliente.Razon_Social,
        'Imprimir_solo_clientes_activos ': fields.Imprimir_solo_clientes_activos ? 'SI' : 'NO',
        'Mostrar 1': fields.Mostrar_Cliente_Tipo_de_Grupo.Descripcion,
        'Pasajeros ': fields.Pasajeros_Pasajeros.Nombre_completo,
        'Imprimir_solo_pasajeros_activos ': fields.Imprimir_solo_pasajeros_activos ? 'SI' : 'NO',
        'Mostrar 2': fields.Mostrar_Pasajero_Tipo_de_Grupo.Descripcion,
        'Pilotos ': fields.Pilotos_Tripulacion.Nombre_completo,
        'Imprimir_solo_pilotos_activos ': fields.Imprimir_solo_pilotos_activos ? 'SI' : 'NO',
        'Mostrar 3': fields.Mostrar_Piloto_Tipo_de_Grupo.Descripcion,
        'Vuelos_como_capitan_o_primer_oficial ': fields.Vuelos_como_capitan_o_primer_oficial ? 'SI' : 'NO',
        'Aeropuerto ': fields.Aeropuerto_Aeropuertos.Nombre,
        'Aeropuerto Destino 1': fields.Aeropuerto_Destino_Aeropuertos.Nombre,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Filtros_de_reportes  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Fecha: x.Fecha,
      Aeronaves: x.Aeronaves_Aeronave.Matricula,
      Imprimir_solo_aeronaves_activas: x.Imprimir_solo_aeronaves_activas,
      Mostrar_Aeronave: x.Mostrar_Aeronave_Tipo_de_Grupo.Descripcion,
      Clientes: x.Clientes_Cliente.Razon_Social,
      Imprimir_solo_clientes_activos: x.Imprimir_solo_clientes_activos,
      Mostrar_Cliente: x.Mostrar_Cliente_Tipo_de_Grupo.Descripcion,
      Pasajeros: x.Pasajeros_Pasajeros.Nombre_completo,
      Imprimir_solo_pasajeros_activos: x.Imprimir_solo_pasajeros_activos,
      Mostrar_Pasajero: x.Mostrar_Pasajero_Tipo_de_Grupo.Descripcion,
      Pilotos: x.Pilotos_Tripulacion.Nombre_completo,
      Imprimir_solo_pilotos_activos: x.Imprimir_solo_pilotos_activos,
      Mostrar_Piloto: x.Mostrar_Piloto_Tipo_de_Grupo.Descripcion,
      Vuelos_como_capitan_o_primer_oficial: x.Vuelos_como_capitan_o_primer_oficial,
      Aeropuerto: x.Aeropuerto_Aeropuertos.Nombre,
      Aeropuerto_Destino: x.Aeropuerto_Destino_Aeropuertos.Nombre,

    }));

    this.excelService.exportToCsv(result, 'Filtros_de_reportes',  ['Folio'    ,'Fecha'  ,'Aeronaves'  ,'Imprimir_solo_aeronaves_activas'  ,'Mostrar_Aeronave'  ,'Clientes'  ,'Imprimir_solo_clientes_activos'  ,'Mostrar_Cliente'  ,'Pasajeros'  ,'Imprimir_solo_pasajeros_activos'  ,'Mostrar_Pasajero'  ,'Pilotos'  ,'Imprimir_solo_pilotos_activos'  ,'Mostrar_Piloto'  ,'Vuelos_como_capitan_o_primer_oficial'  ,'Aeropuerto'  ,'Aeropuerto_Destino' ]);
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
    template += '          <th>Fecha</th>';
    template += '          <th>Aeronaves</th>';
    template += '          <th>Imprimir sólo aeronaves activas</th>';
    template += '          <th>Mostrar</th>';
    template += '          <th>Clientes</th>';
    template += '          <th>Imprimir solo clientes activos</th>';
    template += '          <th>Pasajeros</th>';
    template += '          <th>Imprimir solo pasajeros activos</th>';
    template += '          <th>Pilotos</th>';
    template += '          <th>Imprimir solo pilotos activos</th>';
    template += '          <th>Vuelos como capitan o primer oficial</th>';
    template += '          <th>Aeropuerto</th>';
    template += '          <th>Aeropuerto Destino</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Fecha + '</td>';
      template += '          <td>' + element.Aeronaves_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Imprimir_solo_aeronaves_activas + '</td>';
      template += '          <td>' + element.Mostrar_Aeronave_Tipo_de_Grupo.Descripcion + '</td>';
      template += '          <td>' + element.Clientes_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Imprimir_solo_clientes_activos + '</td>';
      template += '          <td>' + element.Mostrar_Cliente_Tipo_de_Grupo.Descripcion + '</td>';
      template += '          <td>' + element.Pasajeros_Pasajeros.Nombre_completo + '</td>';
      template += '          <td>' + element.Imprimir_solo_pasajeros_activos + '</td>';
      template += '          <td>' + element.Mostrar_Pasajero_Tipo_de_Grupo.Descripcion + '</td>';
      template += '          <td>' + element.Pilotos_Tripulacion.Nombre_completo + '</td>';
      template += '          <td>' + element.Imprimir_solo_pilotos_activos + '</td>';
      template += '          <td>' + element.Mostrar_Piloto_Tipo_de_Grupo.Descripcion + '</td>';
      template += '          <td>' + element.Vuelos_como_capitan_o_primer_oficial + '</td>';
      template += '          <td>' + element.Aeropuerto_Aeropuertos.Nombre + '</td>';
      template += '          <td>' + element.Aeropuerto_Destino_Aeropuertos.Nombre + '</td>';
		  
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
	template += '\t Fecha';
	template += '\t Aeronaves';
	template += '\t Imprimir sólo aeronaves activas';
	template += '\t Mostrar';
	template += '\t Clientes';
	template += '\t Imprimir solo clientes activos';
	template += '\t Pasajeros';
	template += '\t Imprimir solo pasajeros activos';
	template += '\t Pilotos';
	template += '\t Imprimir solo pilotos activos';
	template += '\t Vuelos como capitan o primer oficial';
	template += '\t Aeropuerto';
	template += '\t Aeropuerto Destino';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Fecha;
      template += '\t ' + element.Aeronaves_Aeronave.Matricula;
	  template += '\t ' + element.Imprimir_solo_aeronaves_activas;
      template += '\t ' + element.Mostrar_Aeronave_Tipo_de_Grupo.Descripcion;
      template += '\t ' + element.Clientes_Cliente.Razon_Social;
	  template += '\t ' + element.Imprimir_solo_clientes_activos;
      template += '\t ' + element.Mostrar_Cliente_Tipo_de_Grupo.Descripcion;
      template += '\t ' + element.Pasajeros_Pasajeros.Nombre_completo;
	  template += '\t ' + element.Imprimir_solo_pasajeros_activos;
      template += '\t ' + element.Mostrar_Pasajero_Tipo_de_Grupo.Descripcion;
      template += '\t ' + element.Pilotos_Tripulacion.Nombre_completo;
	  template += '\t ' + element.Imprimir_solo_pilotos_activos;
      template += '\t ' + element.Mostrar_Piloto_Tipo_de_Grupo.Descripcion;
	  template += '\t ' + element.Vuelos_como_capitan_o_primer_oficial;
      template += '\t ' + element.Aeropuerto_Aeropuertos.Nombre;
      template += '\t ' + element.Aeropuerto_Destino_Aeropuertos.Nombre;

	  template += '\n';
    });

    return template;
  }

}

export class Filtros_de_reportesDataSource implements DataSource<Filtros_de_reportes>
{
  private subject = new BehaviorSubject<Filtros_de_reportes[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Filtros_de_reportesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Filtros_de_reportes[]> {
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
              const longest = result.Filtros_de_reportess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Filtros_de_reportess);
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
      condition += " and Filtros_de_reportes.Folio = " + data.filter.Folio;
    if (data.filter.Fecha)
      condition += " and CONVERT(VARCHAR(10), Filtros_de_reportes.Fecha, 102)  = '" + moment(data.filter.Fecha).format("YYYY.MM.DD") + "'";
    if (data.filter.Aeronaves != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Aeronaves + "%' ";
    if (data.filter.Imprimir_solo_aeronaves_activas && data.filter.Imprimir_solo_aeronaves_activas != "2") {
      if (data.filter.Imprimir_solo_aeronaves_activas == "0" || data.filter.Imprimir_solo_aeronaves_activas == "") {
        condition += " and (Filtros_de_reportes.Imprimir_solo_aeronaves_activas = 0 or Filtros_de_reportes.Imprimir_solo_aeronaves_activas is null)";
      } else {
        condition += " and Filtros_de_reportes.Imprimir_solo_aeronaves_activas = 1";
      }
    }
    if (data.filter.Mostrar_Aeronave != "")
      condition += " and Tipo_de_Grupo.Descripcion like '%" + data.filter.Mostrar_Aeronave + "%' ";
    if (data.filter.Clientes != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Clientes + "%' ";
    if (data.filter.Imprimir_solo_clientes_activos && data.filter.Imprimir_solo_clientes_activos != "2") {
      if (data.filter.Imprimir_solo_clientes_activos == "0" || data.filter.Imprimir_solo_clientes_activos == "") {
        condition += " and (Filtros_de_reportes.Imprimir_solo_clientes_activos = 0 or Filtros_de_reportes.Imprimir_solo_clientes_activos is null)";
      } else {
        condition += " and Filtros_de_reportes.Imprimir_solo_clientes_activos = 1";
      }
    }
    if (data.filter.Mostrar_Cliente != "")
      condition += " and Tipo_de_Grupo.Descripcion like '%" + data.filter.Mostrar_Cliente + "%' ";
    if (data.filter.Pasajeros != "")
      condition += " and Pasajeros.Nombre_completo like '%" + data.filter.Pasajeros + "%' ";
    if (data.filter.Imprimir_solo_pasajeros_activos && data.filter.Imprimir_solo_pasajeros_activos != "2") {
      if (data.filter.Imprimir_solo_pasajeros_activos == "0" || data.filter.Imprimir_solo_pasajeros_activos == "") {
        condition += " and (Filtros_de_reportes.Imprimir_solo_pasajeros_activos = 0 or Filtros_de_reportes.Imprimir_solo_pasajeros_activos is null)";
      } else {
        condition += " and Filtros_de_reportes.Imprimir_solo_pasajeros_activos = 1";
      }
    }
    if (data.filter.Mostrar_Pasajero != "")
      condition += " and Tipo_de_Grupo.Descripcion like '%" + data.filter.Mostrar_Pasajero + "%' ";
    if (data.filter.Pilotos != "")
      condition += " and Tripulacion.Nombre_completo like '%" + data.filter.Pilotos + "%' ";
    if (data.filter.Imprimir_solo_pilotos_activos && data.filter.Imprimir_solo_pilotos_activos != "2") {
      if (data.filter.Imprimir_solo_pilotos_activos == "0" || data.filter.Imprimir_solo_pilotos_activos == "") {
        condition += " and (Filtros_de_reportes.Imprimir_solo_pilotos_activos = 0 or Filtros_de_reportes.Imprimir_solo_pilotos_activos is null)";
      } else {
        condition += " and Filtros_de_reportes.Imprimir_solo_pilotos_activos = 1";
      }
    }
    if (data.filter.Mostrar_Piloto != "")
      condition += " and Tipo_de_Grupo.Descripcion like '%" + data.filter.Mostrar_Piloto + "%' ";
    if (data.filter.Vuelos_como_capitan_o_primer_oficial && data.filter.Vuelos_como_capitan_o_primer_oficial != "2") {
      if (data.filter.Vuelos_como_capitan_o_primer_oficial == "0" || data.filter.Vuelos_como_capitan_o_primer_oficial == "") {
        condition += " and (Filtros_de_reportes.Vuelos_como_capitan_o_primer_oficial = 0 or Filtros_de_reportes.Vuelos_como_capitan_o_primer_oficial is null)";
      } else {
        condition += " and Filtros_de_reportes.Vuelos_como_capitan_o_primer_oficial = 1";
      }
    }
    if (data.filter.Aeropuerto != "")
      condition += " and Aeropuertos.Nombre like '%" + data.filter.Aeropuerto + "%' ";
    if (data.filter.Aeropuerto_Destino != "")
      condition += " and Aeropuertos.Nombre like '%" + data.filter.Aeropuerto_Destino + "%' ";

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
        sort = " Filtros_de_reportes.Folio " + data.sortDirecction;
        break;
      case "Fecha":
        sort = " Filtros_de_reportes.Fecha " + data.sortDirecction;
        break;
      case "Aeronaves":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Imprimir_solo_aeronaves_activas":
        sort = " Filtros_de_reportes.Imprimir_solo_aeronaves_activas " + data.sortDirecction;
        break;
      case "Mostrar_Aeronave":
        sort = " Tipo_de_Grupo.Descripcion " + data.sortDirecction;
        break;
      case "Clientes":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Imprimir_solo_clientes_activos":
        sort = " Filtros_de_reportes.Imprimir_solo_clientes_activos " + data.sortDirecction;
        break;
      case "Mostrar_Cliente":
        sort = " Tipo_de_Grupo.Descripcion " + data.sortDirecction;
        break;
      case "Pasajeros":
        sort = " Pasajeros.Nombre_completo " + data.sortDirecction;
        break;
      case "Imprimir_solo_pasajeros_activos":
        sort = " Filtros_de_reportes.Imprimir_solo_pasajeros_activos " + data.sortDirecction;
        break;
      case "Mostrar_Pasajero":
        sort = " Tipo_de_Grupo.Descripcion " + data.sortDirecction;
        break;
      case "Pilotos":
        sort = " Tripulacion.Nombre_completo " + data.sortDirecction;
        break;
      case "Imprimir_solo_pilotos_activos":
        sort = " Filtros_de_reportes.Imprimir_solo_pilotos_activos " + data.sortDirecction;
        break;
      case "Mostrar_Piloto":
        sort = " Tipo_de_Grupo.Descripcion " + data.sortDirecction;
        break;
      case "Vuelos_como_capitan_o_primer_oficial":
        sort = " Filtros_de_reportes.Vuelos_como_capitan_o_primer_oficial " + data.sortDirecction;
        break;
      case "Aeropuerto":
        sort = " Aeropuertos.Nombre " + data.sortDirecction;
        break;
      case "Aeropuerto_Destino":
        sort = " Aeropuertos.Nombre " + data.sortDirecction;
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
        condition += " AND Filtros_de_reportes.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Filtros_de_reportes.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
	|| (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)) 
	{
      if (typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha) 
        condition += " and CONVERT(VARCHAR(10), Filtros_de_reportes.Fecha, 102)  >= '" +  moment(data.filterAdvanced.fromFecha).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha) 
        condition += " and CONVERT(VARCHAR(10), Filtros_de_reportes.Fecha, 102)  <= '" + moment(data.filterAdvanced.toFecha).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Aeronaves != 'undefined' && data.filterAdvanced.Aeronaves)) {
      switch (data.filterAdvanced.AeronavesFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeronave.Matricula LIKE '" + data.filterAdvanced.Aeronaves + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Aeronaves + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Aeronaves + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeronave.Matricula = '" + data.filterAdvanced.Aeronaves + "'";
          break;
      }
    } else if (data.filterAdvanced.AeronavesMultiple != null && data.filterAdvanced.AeronavesMultiple.length > 0) {
      var Aeronavesds = data.filterAdvanced.AeronavesMultiple.join(",");
      condition += " AND Filtros_de_reportes.Aeronaves In (" + Aeronavesds + ")";
    }
    if ((typeof data.filterAdvanced.Mostrar_Aeronave != 'undefined' && data.filterAdvanced.Mostrar_Aeronave)) {
      switch (data.filterAdvanced.Mostrar_AeronaveFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '" + data.filterAdvanced.Mostrar_Aeronave + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '%" + data.filterAdvanced.Mostrar_Aeronave + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '%" + data.filterAdvanced.Mostrar_Aeronave + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Grupo.Descripcion = '" + data.filterAdvanced.Mostrar_Aeronave + "'";
          break;
      }
    } else if (data.filterAdvanced.Mostrar_AeronaveMultiple != null && data.filterAdvanced.Mostrar_AeronaveMultiple.length > 0) {
      var Mostrar_Aeronaveds = data.filterAdvanced.Mostrar_AeronaveMultiple.join(",");
      condition += " AND Filtros_de_reportes.Mostrar_Aeronave In (" + Mostrar_Aeronaveds + ")";
    }
    if ((typeof data.filterAdvanced.Clientes != 'undefined' && data.filterAdvanced.Clientes)) {
      switch (data.filterAdvanced.ClientesFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.Clientes + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Clientes + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Clientes + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.Clientes + "'";
          break;
      }
    } else if (data.filterAdvanced.ClientesMultiple != null && data.filterAdvanced.ClientesMultiple.length > 0) {
      var Clientesds = data.filterAdvanced.ClientesMultiple.join(",");
      condition += " AND Filtros_de_reportes.Clientes In (" + Clientesds + ")";
    }
    if ((typeof data.filterAdvanced.Mostrar_Cliente != 'undefined' && data.filterAdvanced.Mostrar_Cliente)) {
      switch (data.filterAdvanced.Mostrar_ClienteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '" + data.filterAdvanced.Mostrar_Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '%" + data.filterAdvanced.Mostrar_Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '%" + data.filterAdvanced.Mostrar_Cliente + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Grupo.Descripcion = '" + data.filterAdvanced.Mostrar_Cliente + "'";
          break;
      }
    } else if (data.filterAdvanced.Mostrar_ClienteMultiple != null && data.filterAdvanced.Mostrar_ClienteMultiple.length > 0) {
      var Mostrar_Clienteds = data.filterAdvanced.Mostrar_ClienteMultiple.join(",");
      condition += " AND Filtros_de_reportes.Mostrar_Cliente In (" + Mostrar_Clienteds + ")";
    }
    if ((typeof data.filterAdvanced.Pasajeros != 'undefined' && data.filterAdvanced.Pasajeros)) {
      switch (data.filterAdvanced.PasajerosFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Pasajeros.Nombre_completo LIKE '" + data.filterAdvanced.Pasajeros + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Pasajeros.Nombre_completo LIKE '%" + data.filterAdvanced.Pasajeros + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Pasajeros.Nombre_completo LIKE '%" + data.filterAdvanced.Pasajeros + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Pasajeros.Nombre_completo = '" + data.filterAdvanced.Pasajeros + "'";
          break;
      }
    } else if (data.filterAdvanced.PasajerosMultiple != null && data.filterAdvanced.PasajerosMultiple.length > 0) {
      var Pasajerosds = data.filterAdvanced.PasajerosMultiple.join(",");
      condition += " AND Filtros_de_reportes.Pasajeros In (" + Pasajerosds + ")";
    }
    if ((typeof data.filterAdvanced.Mostrar_Pasajero != 'undefined' && data.filterAdvanced.Mostrar_Pasajero)) {
      switch (data.filterAdvanced.Mostrar_PasajeroFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '" + data.filterAdvanced.Mostrar_Pasajero + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '%" + data.filterAdvanced.Mostrar_Pasajero + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '%" + data.filterAdvanced.Mostrar_Pasajero + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Grupo.Descripcion = '" + data.filterAdvanced.Mostrar_Pasajero + "'";
          break;
      }
    } else if (data.filterAdvanced.Mostrar_PasajeroMultiple != null && data.filterAdvanced.Mostrar_PasajeroMultiple.length > 0) {
      var Mostrar_Pasajerods = data.filterAdvanced.Mostrar_PasajeroMultiple.join(",");
      condition += " AND Filtros_de_reportes.Mostrar_Pasajero In (" + Mostrar_Pasajerods + ")";
    }
    if ((typeof data.filterAdvanced.Pilotos != 'undefined' && data.filterAdvanced.Pilotos)) {
      switch (data.filterAdvanced.PilotosFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tripulacion.Nombre_completo LIKE '" + data.filterAdvanced.Pilotos + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tripulacion.Nombre_completo LIKE '%" + data.filterAdvanced.Pilotos + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tripulacion.Nombre_completo LIKE '%" + data.filterAdvanced.Pilotos + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tripulacion.Nombre_completo = '" + data.filterAdvanced.Pilotos + "'";
          break;
      }
    } else if (data.filterAdvanced.PilotosMultiple != null && data.filterAdvanced.PilotosMultiple.length > 0) {
      var Pilotosds = data.filterAdvanced.PilotosMultiple.join(",");
      condition += " AND Filtros_de_reportes.Pilotos In (" + Pilotosds + ")";
    }
    if ((typeof data.filterAdvanced.Mostrar_Piloto != 'undefined' && data.filterAdvanced.Mostrar_Piloto)) {
      switch (data.filterAdvanced.Mostrar_PilotoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '" + data.filterAdvanced.Mostrar_Piloto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '%" + data.filterAdvanced.Mostrar_Piloto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Grupo.Descripcion LIKE '%" + data.filterAdvanced.Mostrar_Piloto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Grupo.Descripcion = '" + data.filterAdvanced.Mostrar_Piloto + "'";
          break;
      }
    } else if (data.filterAdvanced.Mostrar_PilotoMultiple != null && data.filterAdvanced.Mostrar_PilotoMultiple.length > 0) {
      var Mostrar_Pilotods = data.filterAdvanced.Mostrar_PilotoMultiple.join(",");
      condition += " AND Filtros_de_reportes.Mostrar_Piloto In (" + Mostrar_Pilotods + ")";
    }
    if ((typeof data.filterAdvanced.Aeropuerto != 'undefined' && data.filterAdvanced.Aeropuerto)) {
      switch (data.filterAdvanced.AeropuertoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Nombre LIKE '" + data.filterAdvanced.Aeropuerto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Nombre = '" + data.filterAdvanced.Aeropuerto + "'";
          break;
      }
    } else if (data.filterAdvanced.AeropuertoMultiple != null && data.filterAdvanced.AeropuertoMultiple.length > 0) {
      var Aeropuertods = data.filterAdvanced.AeropuertoMultiple.join(",");
      condition += " AND Filtros_de_reportes.Aeropuerto In (" + Aeropuertods + ")";
    }
    if ((typeof data.filterAdvanced.Aeropuerto_Destino != 'undefined' && data.filterAdvanced.Aeropuerto_Destino)) {
      switch (data.filterAdvanced.Aeropuerto_DestinoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Nombre LIKE '" + data.filterAdvanced.Aeropuerto_Destino + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto_Destino + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto_Destino + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Nombre = '" + data.filterAdvanced.Aeropuerto_Destino + "'";
          break;
      }
    } else if (data.filterAdvanced.Aeropuerto_DestinoMultiple != null && data.filterAdvanced.Aeropuerto_DestinoMultiple.length > 0) {
      var Aeropuerto_Destinods = data.filterAdvanced.Aeropuerto_DestinoMultiple.join(",");
      condition += " AND Filtros_de_reportes.Aeropuerto_Destino In (" + Aeropuerto_Destinods + ")";
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
              const longest = result.Filtros_de_reportess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Filtros_de_reportess);
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
