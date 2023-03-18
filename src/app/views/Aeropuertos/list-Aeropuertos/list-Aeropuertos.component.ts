import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { AeropuertosService } from "src/app/api-services/Aeropuertos.service";
import { Aeropuertos } from "src/app/models/Aeropuertos";
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
import { AeropuertosIndexRules } from 'src/app/shared/businessRules/Aeropuertos-index-rules';
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
  selector: "app-list-Aeropuertos",
  templateUrl: "./list-Aeropuertos.component.html",
  styleUrls: ["./list-Aeropuertos.component.scss"],
})
export class ListAeropuertosComponent extends AeropuertosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "ICAO",
    "IATA",
    "FAA",
    "Nombre",
    "Pais",
    "Latitud",
    "Longitud",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "ICAO",
      "IATA",
      "FAA",
      "Nombre",
      "Pais",
      "Latitud",
      "Longitud",

    ],
    columns_filters: [
      "acciones_filtro",
      "ICAO_filtro",
      "IATA_filtro",
      "FAA_filtro",
      "Nombre_filtro",
      "Pais_filtro",
      "Latitud_filtro",
      "Longitud_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Aeropuerto_ID: "",
      ICAO: "",
      IATA: "",
      FAA: "",
      Nombre: "",
      Pais: "",
      Estado: "",
      Ciudad: "",
      Horario_de_operaciones: "",
      Latitud: "",
      Longitud: "",
      Elevacion_pies: "",
      Variacion: "",
      Tipo_de_Aeropuerto: "",
      Ciudad_mas_cercana: "",
      Distancia_en_KM: "",
      Aeropuerto_Controlado: "",
      UTC_Estandar: "",
      UTC_Estandar_Inicio: null,
      UTC_Estandar_Fin: null,
      UTC_DLTS: "",
      UTC_DLTS_Inicio: null,
      UTC_DLTS_Fin: null,
      UTC__Amanecer: "",
      UTC__Atardecer: "",
      Local_Amanecer: "",
      Local_Atardecer: "",
      TWR: "",
      GND: "",
      UNICOM: "",
      CARDEL_1: "",
      CARDEL_2: "",
      APPR: "",
      DEP: "",
      ATIS: "",
      ATIS_Phone: "",
      ASOS: "",
      ASOS_Phone: "",
      AWOS: "",
      AWOS_Phone: "",
      AWOS_Type: "",
      Codigo_de_area___Lada: "",
      Administracion_Aeropuerto: "",
      Comandancia: "",
      Despacho: "",
      Torre_de_Control: "",
      Descripcion: "",
      Notas: "",
      ICAO_IATA: "",
		
    },
    filterAdvanced: {
      fromAeropuerto_ID: "",
      toAeropuerto_ID: "",
      PaisFilter: "",
      Pais: "",
      PaisMultiple: "",
      EstadoFilter: "",
      Estado: "",
      EstadoMultiple: "",
      CiudadFilter: "",
      Ciudad: "",
      CiudadMultiple: "",
      fromElevacion_pies: "",
      toElevacion_pies: "",
      Tipo_de_AeropuertoFilter: "",
      Tipo_de_Aeropuerto: "",
      Tipo_de_AeropuertoMultiple: "",
      Ciudad_mas_cercanaFilter: "",
      Ciudad_mas_cercana: "",
      Ciudad_mas_cercanaMultiple: "",
      fromDistancia_en_KM: "",
      toDistancia_en_KM: "",
      fromUTC_Estandar_Inicio: "",
      toUTC_Estandar_Inicio: "",
      fromUTC_Estandar_Fin: "",
      toUTC_Estandar_Fin: "",
      fromUTC_DLTS_Inicio: "",
      toUTC_DLTS_Inicio: "",
      fromUTC_DLTS_Fin: "",
      toUTC_DLTS_Fin: "",
      fromUTC__Amanecer: "",
      toUTC__Amanecer: "",
      fromUTC__Atardecer: "",
      toUTC__Atardecer: "",
      fromLocal_Amanecer: "",
      toLocal_Amanecer: "",
      fromLocal_Atardecer: "",
      toLocal_Atardecer: "",
      fromTWR: "",
      toTWR: "",
      fromGND: "",
      toGND: "",
      fromAPPR: "",
      toAPPR: "",
      fromDEP: "",
      toDEP: "",

    }
  };

  dataSource: AeropuertosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: AeropuertosDataSource;
  dataClipboard: any;

  constructor(
    private _AeropuertosService: AeropuertosService,
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
    this.dataSource = new AeropuertosDataSource(
      this._AeropuertosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Aeropuertos)
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
    this.listConfig.filter.Aeropuerto_ID = "";
    this.listConfig.filter.ICAO = "";
    this.listConfig.filter.IATA = "";
    this.listConfig.filter.FAA = "";
    this.listConfig.filter.Nombre = "";
    this.listConfig.filter.Pais = "";
    this.listConfig.filter.Estado = "";
    this.listConfig.filter.Ciudad = "";
    this.listConfig.filter.Horario_de_operaciones = "";
    this.listConfig.filter.Latitud = "";
    this.listConfig.filter.Longitud = "";
    this.listConfig.filter.Elevacion_pies = "";
    this.listConfig.filter.Variacion = "";
    this.listConfig.filter.Tipo_de_Aeropuerto = "";
    this.listConfig.filter.Ciudad_mas_cercana = "";
    this.listConfig.filter.Distancia_en_KM = "";
    this.listConfig.filter.Aeropuerto_Controlado = undefined;
    this.listConfig.filter.UTC_Estandar = "";
    this.listConfig.filter.UTC_Estandar_Inicio = undefined;
    this.listConfig.filter.UTC_Estandar_Fin = undefined;
    this.listConfig.filter.UTC_DLTS = "";
    this.listConfig.filter.UTC_DLTS_Inicio = undefined;
    this.listConfig.filter.UTC_DLTS_Fin = undefined;
    this.listConfig.filter.UTC__Amanecer = "";
    this.listConfig.filter.UTC__Atardecer = "";
    this.listConfig.filter.Local_Amanecer = "";
    this.listConfig.filter.Local_Atardecer = "";
    this.listConfig.filter.TWR = "";
    this.listConfig.filter.GND = "";
    this.listConfig.filter.UNICOM = "";
    this.listConfig.filter.CARDEL_1 = "";
    this.listConfig.filter.CARDEL_2 = "";
    this.listConfig.filter.APPR = "";
    this.listConfig.filter.DEP = "";
    this.listConfig.filter.ATIS = "";
    this.listConfig.filter.ATIS_Phone = "";
    this.listConfig.filter.ASOS = "";
    this.listConfig.filter.ASOS_Phone = "";
    this.listConfig.filter.AWOS = "";
    this.listConfig.filter.AWOS_Phone = "";
    this.listConfig.filter.AWOS_Type = "";
    this.listConfig.filter.Codigo_de_area___Lada = "";
    this.listConfig.filter.Administracion_Aeropuerto = "";
    this.listConfig.filter.Comandancia = "";
    this.listConfig.filter.Despacho = "";
    this.listConfig.filter.Torre_de_Control = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Notas = "";
    this.listConfig.filter.ICAO_IATA = "";

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

  remove(row: Aeropuertos) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._AeropuertosService
          .delete(+row.Aeropuerto_ID)
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
  ActionPrint(dataRow: Aeropuertos) {

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
'ICAO'
,'IATA'
,'FAA'
,'Nombre'
,'País'
,'Latitud'
,'Longitud'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.ICAO
,x.IATA
,x.FAA
,x.Nombre
,x.Pais_Pais.Nombre
,x.Latitud
,x.Longitud
		  
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
    pdfMake.createPdf(pdfDefinition).download('Aeropuertos.pdf');
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
          this._AeropuertosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              response.Aeropuertoss.forEach(e =>{
                for (const p in e) {
                  if(e[p]== null){
                    e[p] = '';      
                  }
                }
                
                if(!e.Tipo_de_Aeropuerto.trim())e.Tipo_de_Aeropuerto = ''
                if(e.UTC_Estandar_Inicio) e.UTC_Estandar_Inicio = e.UTC_Estandar_Inicio.substring(0,10);
                if(e.UTC_Estandar_Fin) e.UTC_Estandar_Fin = e.UTC_Estandar_Fin.substring(0,10);
                if(e.UTC_DLTS_Inicio) e.UTC_DLTS_Inicio = e.UTC_DLTS_Inicio.substring(0,10);
                if(e.UTC_DLTS_Fin) e.UTC_DLTS_Fin = e.UTC_DLTS_Fin.substring(0,10);
                e.Aeropuerto_Controlado?  e.Aeropuerto_Controlado = 'Si': e.Aeropuerto_Controlado = 'No';

                })
              this.dataSourceTemp = response.Aeropuertoss;
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
          this._AeropuertosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              response.Aeropuertoss.forEach(e =>{
                for (const p in e) {
                  if(e[p]== null){
                    e[p] = '';      
                  }
                }
                
                if(!e.Tipo_de_Aeropuerto.trim())e.Tipo_de_Aeropuerto = ''
                if(e.UTC_Estandar_Inicio) e.UTC_Estandar_Inicio = e.UTC_Estandar_Inicio.substring(0,10);
                if(e.UTC_Estandar_Fin) e.UTC_Estandar_Fin = e.UTC_Estandar_Fin.substring(0,10);
                if(e.UTC_DLTS_Inicio) e.UTC_DLTS_Inicio = e.UTC_DLTS_Inicio.substring(0,10);
                if(e.UTC_DLTS_Fin) e.UTC_DLTS_Fin = e.UTC_DLTS_Fin.substring(0,10);
                e.Aeropuerto_Controlado?  e.Aeropuerto_Controlado = 'Si': e.Aeropuerto_Controlado = 'No';

                })
              this.dataSourceTemp = response.Aeropuertoss;

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
        'ICAO ': fields.ICAO,
        'IATA ': fields.IATA,
        'FAA ': fields.FAA,
        'Nombre ': fields.Nombre,
        'País ': fields.Pais_Pais.Nombre,
        'Latitud ': fields.Latitud,
        'Longitud ': fields.Longitud,
      };
    });
    this.excelService.exportAsExcelFile(excelData, `Aeropuertos  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      ICAO: x.ICAO,
      IATA: x.IATA,
      FAA: x.FAA,
      Nombre: x.Nombre,
      Pais: x.Pais_Pais.Nombre,
      Latitud: x.Latitud,
      Longitud: x.Longitud

    }));

    this.excelService.exportToCsv(result, 'Aeropuertos', 
     ['ICAO'  ,'IATA'  ,'FAA'  ,'Nombre'  ,'Pais'  ,'Latitud'  ,'Longitud']
    , ['ICAO'  ,'IATA'  ,'FAA'  ,'Nombre'  ,'Pais'  ,'Latitud'  ,'Longitud']);
     
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
    template += '          <th>Aeropuerto ID</th>';
    template += '          <th>ICAO</th>';
    template += '          <th>IATA</th>';
    template += '          <th>FAA</th>';
    template += '          <th>Nombre</th>';
    template += '          <th>País</th>';
    template += '          <th>Estado</th>';
    template += '          <th>Ciudad</th>';
    template += '          <th>Horario de operaciones</th>';
    template += '          <th>Latitud</th>';
    template += '          <th>Longitud</th>';
    template += '          <th>Elevación (pies)</th>';
    template += '          <th>Variación</th>';
    template += '          <th>Tipo de Aeropuerto</th>';
    template += '          <th>Ciudad más cercana</th>';
    template += '          <th>Distancia en KM</th>';
    template += '          <th>¿Aeropuerto Controlado?</th>';
    template += '          <th>UTC Estándar</th>';
    template += '          <th>UTC Estándar Inicio</th>';
    template += '          <th>UTC Estándar Fin</th>';
    template += '          <th>UTC DLTS</th>';
    template += '          <th>UTC DLTS Inicio</th>';
    template += '          <th>UTC DLTS Fin</th>';
    template += '          <th>UTC - Amanecer</th>';
    template += '          <th>UTC - Atardecer</th>';
    template += '          <th>Local Amanecer</th>';
    template += '          <th>Local Atardecer</th>';
    template += '          <th>TWR</th>';
    template += '          <th>GND</th>';
    template += '          <th>UNICOM</th>';
    template += '          <th>CLRDEL 1</th>';
    template += '          <th>CLRDEL 2</th>';
    template += '          <th>APPR</th>';
    template += '          <th>DEP</th>';
    template += '          <th>ATIS</th>';
    template += '          <th>ATIS Phone</th>';
    template += '          <th>ASOS</th>';
    template += '          <th>ASOS Phone</th>';
    template += '          <th>AWOS</th>';
    template += '          <th>AWOS Phone</th>';
    template += '          <th>AWOS Type</th>';
    template += '          <th>Código de área / Lada</th>';
    template += '          <th>Administración Aeropuerto</th>';
    template += '          <th>Comandancia</th>';
    template += '          <th>Despacho</th>';
    template += '          <th>Torre de Control</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>Notas</th>';
    template += '          <th>ICAO/IATA</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Aeropuerto_ID + '</td>';
      template += '          <td>' + element.ICAO + '</td>';
      template += '          <td>' + element.IATA + '</td>';
      template += '          <td>' + element.FAA + '</td>';
      template += '          <td>' + element.Nombre + '</td>';
      template += '          <td>' + element.Pais_Pais.Nombre + '</td>';
      template += '          <td>' + element.Estado_Estado.Nombre + '</td>';
      template += '          <td>' + element.Ciudad_Ciudad.Nombre + '</td>';
      template += '          <td>' + element.Horario_de_operaciones + '</td>';
      template += '          <td>' + element.Latitud + '</td>';
      template += '          <td>' + element.Longitud + '</td>';
      template += '          <td>' + element.Elevacion_pies + '</td>';
      template += '          <td>' + element.Variacion + '</td>';
      template += '          <td>' + element.Tipo_de_Aeropuerto_Tipo_de_Aeropuerto.Descripcion + '</td>';
      template += '          <td>' + element.Ciudad_mas_cercana_Ciudad.Nombre + '</td>';
      template += '          <td>' + element.Distancia_en_KM + '</td>';
      template += '          <td>' + element.Aeropuerto_Controlado + '</td>';
      template += '          <td>' + element.UTC_Estandar + '</td>';
      template += '          <td>' + element.UTC_Estandar_Inicio + '</td>';
      template += '          <td>' + element.UTC_Estandar_Fin + '</td>';
      template += '          <td>' + element.UTC_DLTS + '</td>';
      template += '          <td>' + element.UTC_DLTS_Inicio + '</td>';
      template += '          <td>' + element.UTC_DLTS_Fin + '</td>';
      template += '          <td>' + element.UTC__Amanecer + '</td>';
      template += '          <td>' + element.UTC__Atardecer + '</td>';
      template += '          <td>' + element.Local_Amanecer + '</td>';
      template += '          <td>' + element.Local_Atardecer + '</td>';
      template += '          <td>' + element.TWR + '</td>';
      template += '          <td>' + element.GND + '</td>';
      template += '          <td>' + element.UNICOM + '</td>';
      template += '          <td>' + element.CARDEL_1 + '</td>';
      template += '          <td>' + element.CARDEL_2 + '</td>';
      template += '          <td>' + element.APPR + '</td>';
      template += '          <td>' + element.DEP + '</td>';
      template += '          <td>' + element.ATIS + '</td>';
      template += '          <td>' + element.ATIS_Phone + '</td>';
      template += '          <td>' + element.ASOS + '</td>';
      template += '          <td>' + element.ASOS_Phone + '</td>';
      template += '          <td>' + element.AWOS + '</td>';
      template += '          <td>' + element.AWOS_Phone + '</td>';
      template += '          <td>' + element.AWOS_Type + '</td>';
      template += '          <td>' + element.Codigo_de_area___Lada + '</td>';
      template += '          <td>' + element.Administracion_Aeropuerto + '</td>';
      template += '          <td>' + element.Comandancia + '</td>';
      template += '          <td>' + element.Despacho + '</td>';
      template += '          <td>' + element.Torre_de_Control + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.Notas + '</td>';
      template += '          <td>' + element.ICAO_IATA + '</td>';
		  
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
	template += 'ICAO';
	template += '\t IATA';
	template += '\t FAA';
	template += '\t Nombre';
	template += '\t País';
	template += '\t Latitud';
	template += '\t Longitud';

	template += '\n';

    data.forEach(element => {
	  template += element.ICAO;
	  template += '\t ' + element.IATA;
	  template += '\t ' + element.FAA;
	  template += '\t ' + element.Nombre;
      template += '\t ' + element.Pais_Pais.Nombre;
	  template += '\t ' + element.Latitud;
	  template += '\t ' + element.Longitud;
	  template += '\n';
    });

    return template;
  }

}

export class AeropuertosDataSource implements DataSource<Aeropuertos>
{
  private subject = new BehaviorSubject<Aeropuertos[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: AeropuertosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Aeropuertos[]> {
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
          if (column === 'Aeropuerto_ID') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Aeropuertoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Aeropuertoss);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Aeropuerto_ID != "")
      condition += " and Aeropuertos.Aeropuerto_ID = " + data.filter.Aeropuerto_ID;
    if (data.filter.ICAO != "")
      condition += " and Aeropuertos.ICAO like '%" + data.filter.ICAO + "%' ";
    if (data.filter.IATA != "")
      condition += " and Aeropuertos.IATA like '%" + data.filter.IATA + "%' ";
    if (data.filter.FAA != "")
      condition += " and Aeropuertos.FAA like '%" + data.filter.FAA + "%' ";
    if (data.filter.Nombre != "")
      condition += " and Aeropuertos.Nombre like '%" + data.filter.Nombre + "%' ";
    if (data.filter.Pais != "")
      condition += " and Pais.Nombre like '%" + data.filter.Pais + "%' ";
    if (data.filter.Estado != "")
      condition += " and Estado.Nombre like '%" + data.filter.Estado + "%' ";
    if (data.filter.Ciudad != "")
      condition += " and Ciudad.Nombre like '%" + data.filter.Ciudad + "%' ";
    if (data.filter.Horario_de_operaciones != "")
      condition += " and Aeropuertos.Horario_de_operaciones like '%" + data.filter.Horario_de_operaciones + "%' ";
    if (data.filter.Latitud != "")
      condition += " and Aeropuertos.Latitud like '%" + data.filter.Latitud + "%' ";
    if (data.filter.Longitud != "")
      condition += " and Aeropuertos.Longitud like '%" + data.filter.Longitud + "%' ";
    if (data.filter.Elevacion_pies != "")
      condition += " and Aeropuertos.Elevacion_pies = " + data.filter.Elevacion_pies;
    if (data.filter.Variacion != "")
      condition += " and Aeropuertos.Variacion like '%" + data.filter.Variacion + "%' ";
    if (data.filter.Tipo_de_Aeropuerto != "")
      condition += " and Tipo_de_Aeropuerto.Descripcion like '%" + data.filter.Tipo_de_Aeropuerto + "%' ";
    if (data.filter.Ciudad_mas_cercana != "")
      condition += " and Ciudad.Nombre like '%" + data.filter.Ciudad_mas_cercana + "%' ";
    if (data.filter.Distancia_en_KM != "")
      condition += " and Aeropuertos.Distancia_en_KM = " + data.filter.Distancia_en_KM;
    if (data.filter.Aeropuerto_Controlado && data.filter.Aeropuerto_Controlado != "2") {
      if (data.filter.Aeropuerto_Controlado == "0" || data.filter.Aeropuerto_Controlado == "") {
        condition += " and (Aeropuertos.Aeropuerto_Controlado = 0 or Aeropuertos.Aeropuerto_Controlado is null)";
      } else {
        condition += " and Aeropuertos.Aeropuerto_Controlado = 1";
      }
    }
    if (data.filter.UTC_Estandar != "")
      condition += " and Aeropuertos.UTC_Estandar like '%" + data.filter.UTC_Estandar + "%' ";
    if (data.filter.UTC_Estandar_Inicio)
      condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_Estandar_Inicio, 102)  = '" + moment(data.filter.UTC_Estandar_Inicio).format("YYYY.MM.DD") + "'";
    if (data.filter.UTC_Estandar_Fin)
      condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_Estandar_Fin, 102)  = '" + moment(data.filter.UTC_Estandar_Fin).format("YYYY.MM.DD") + "'";
    if (data.filter.UTC_DLTS != "")
      condition += " and Aeropuertos.UTC_DLTS like '%" + data.filter.UTC_DLTS + "%' ";
    if (data.filter.UTC_DLTS_Inicio)
      condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_DLTS_Inicio, 102)  = '" + moment(data.filter.UTC_DLTS_Inicio).format("YYYY.MM.DD") + "'";
    if (data.filter.UTC_DLTS_Fin)
      condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_DLTS_Fin, 102)  = '" + moment(data.filter.UTC_DLTS_Fin).format("YYYY.MM.DD") + "'";
    if (data.filter.UTC__Amanecer != "")
      condition += " and Aeropuertos.UTC__Amanecer = '" + data.filter.UTC__Amanecer + "'";
    if (data.filter.UTC__Atardecer != "")
      condition += " and Aeropuertos.UTC__Atardecer = '" + data.filter.UTC__Atardecer + "'";
    if (data.filter.Local_Amanecer != "")
      condition += " and Aeropuertos.Local_Amanecer = '" + data.filter.Local_Amanecer + "'";
    if (data.filter.Local_Atardecer != "")
      condition += " and Aeropuertos.Local_Atardecer = '" + data.filter.Local_Atardecer + "'";
    if (data.filter.TWR != "")
      condition += " and Aeropuertos.TWR = " + data.filter.TWR;
    if (data.filter.GND != "")
      condition += " and Aeropuertos.GND = " + data.filter.GND;
    if (data.filter.UNICOM != "")
      condition += " and Aeropuertos.UNICOM like '%" + data.filter.UNICOM + "%' ";
    if (data.filter.CARDEL_1 != "")
      condition += " and Aeropuertos.CARDEL_1 like '%" + data.filter.CARDEL_1 + "%' ";
    if (data.filter.CARDEL_2 != "")
      condition += " and Aeropuertos.CARDEL_2 like '%" + data.filter.CARDEL_2 + "%' ";
    if (data.filter.APPR != "")
      condition += " and Aeropuertos.APPR = " + data.filter.APPR;
    if (data.filter.DEP != "")
      condition += " and Aeropuertos.DEP = " + data.filter.DEP;
    if (data.filter.ATIS != "")
      condition += " and Aeropuertos.ATIS like '%" + data.filter.ATIS + "%' ";
    if (data.filter.ATIS_Phone != "")
      condition += " and Aeropuertos.ATIS_Phone like '%" + data.filter.ATIS_Phone + "%' ";
    if (data.filter.ASOS != "")
      condition += " and Aeropuertos.ASOS like '%" + data.filter.ASOS + "%' ";
    if (data.filter.ASOS_Phone != "")
      condition += " and Aeropuertos.ASOS_Phone like '%" + data.filter.ASOS_Phone + "%' ";
    if (data.filter.AWOS != "")
      condition += " and Aeropuertos.AWOS like '%" + data.filter.AWOS + "%' ";
    if (data.filter.AWOS_Phone != "")
      condition += " and Aeropuertos.AWOS_Phone like '%" + data.filter.AWOS_Phone + "%' ";
    if (data.filter.AWOS_Type != "")
      condition += " and Aeropuertos.AWOS_Type like '%" + data.filter.AWOS_Type + "%' ";
    if (data.filter.Codigo_de_area___Lada != "")
      condition += " and Aeropuertos.Codigo_de_area___Lada like '%" + data.filter.Codigo_de_area___Lada + "%' ";
    if (data.filter.Administracion_Aeropuerto != "")
      condition += " and Aeropuertos.Administracion_Aeropuerto like '%" + data.filter.Administracion_Aeropuerto + "%' ";
    if (data.filter.Comandancia != "")
      condition += " and Aeropuertos.Comandancia like '%" + data.filter.Comandancia + "%' ";
    if (data.filter.Despacho != "")
      condition += " and Aeropuertos.Despacho like '%" + data.filter.Despacho + "%' ";
    if (data.filter.Torre_de_Control != "")
      condition += " and Aeropuertos.Torre_de_Control like '%" + data.filter.Torre_de_Control + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Aeropuertos.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Notas != "")
      condition += " and Aeropuertos.Notas like '%" + data.filter.Notas + "%' ";
    if (data.filter.ICAO_IATA != "")
      condition += " and Aeropuertos.ICAO_IATA like '%" + data.filter.ICAO_IATA + "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "Aeropuerto_ID":
        sort = " Aeropuertos.Aeropuerto_ID " + data.sortDirecction;
        break;
      case "ICAO":
        sort = " Aeropuertos.ICAO " + data.sortDirecction;
        break;
      case "IATA":
        sort = " Aeropuertos.IATA " + data.sortDirecction;
        break;
      case "FAA":
        sort = " Aeropuertos.FAA " + data.sortDirecction;
        break;
      case "Nombre":
        sort = " Aeropuertos.Nombre " + data.sortDirecction;
        break;
      case "Pais":
        sort = " Pais.Nombre " + data.sortDirecction;
        break;
      case "Estado":
        sort = " Estado.Nombre " + data.sortDirecction;
        break;
      case "Ciudad":
        sort = " Ciudad.Nombre " + data.sortDirecction;
        break;
      case "Horario_de_operaciones":
        sort = " Aeropuertos.Horario_de_operaciones " + data.sortDirecction;
        break;
      case "Latitud":
        sort = " Aeropuertos.Latitud " + data.sortDirecction;
        break;
      case "Longitud":
        sort = " Aeropuertos.Longitud " + data.sortDirecction;
        break;
      case "Elevacion_pies":
        sort = " Aeropuertos.Elevacion_pies " + data.sortDirecction;
        break;
      case "Variacion":
        sort = " Aeropuertos.Variacion " + data.sortDirecction;
        break;
      case "Tipo_de_Aeropuerto":
        sort = " Tipo_de_Aeropuerto.Descripcion " + data.sortDirecction;
        break;
      case "Ciudad_mas_cercana":
        sort = " Ciudad.Nombre " + data.sortDirecction;
        break;
      case "Distancia_en_KM":
        sort = " Aeropuertos.Distancia_en_KM " + data.sortDirecction;
        break;
      case "Aeropuerto_Controlado":
        sort = " Aeropuertos.Aeropuerto_Controlado " + data.sortDirecction;
        break;
      case "UTC_Estandar":
        sort = " Aeropuertos.UTC_Estandar " + data.sortDirecction;
        break;
      case "UTC_Estandar_Inicio":
        sort = " Aeropuertos.UTC_Estandar_Inicio " + data.sortDirecction;
        break;
      case "UTC_Estandar_Fin":
        sort = " Aeropuertos.UTC_Estandar_Fin " + data.sortDirecction;
        break;
      case "UTC_DLTS":
        sort = " Aeropuertos.UTC_DLTS " + data.sortDirecction;
        break;
      case "UTC_DLTS_Inicio":
        sort = " Aeropuertos.UTC_DLTS_Inicio " + data.sortDirecction;
        break;
      case "UTC_DLTS_Fin":
        sort = " Aeropuertos.UTC_DLTS_Fin " + data.sortDirecction;
        break;
      case "UTC__Amanecer":
        sort = " Aeropuertos.UTC__Amanecer " + data.sortDirecction;
        break;
      case "UTC__Atardecer":
        sort = " Aeropuertos.UTC__Atardecer " + data.sortDirecction;
        break;
      case "Local_Amanecer":
        sort = " Aeropuertos.Local_Amanecer " + data.sortDirecction;
        break;
      case "Local_Atardecer":
        sort = " Aeropuertos.Local_Atardecer " + data.sortDirecction;
        break;
      case "TWR":
        sort = " Aeropuertos.TWR " + data.sortDirecction;
        break;
      case "GND":
        sort = " Aeropuertos.GND " + data.sortDirecction;
        break;
      case "UNICOM":
        sort = " Aeropuertos.UNICOM " + data.sortDirecction;
        break;
      case "CARDEL_1":
        sort = " Aeropuertos.CARDEL_1 " + data.sortDirecction;
        break;
      case "CARDEL_2":
        sort = " Aeropuertos.CARDEL_2 " + data.sortDirecction;
        break;
      case "APPR":
        sort = " Aeropuertos.APPR " + data.sortDirecction;
        break;
      case "DEP":
        sort = " Aeropuertos.DEP " + data.sortDirecction;
        break;
      case "ATIS":
        sort = " Aeropuertos.ATIS " + data.sortDirecction;
        break;
      case "ATIS_Phone":
        sort = " Aeropuertos.ATIS_Phone " + data.sortDirecction;
        break;
      case "ASOS":
        sort = " Aeropuertos.ASOS " + data.sortDirecction;
        break;
      case "ASOS_Phone":
        sort = " Aeropuertos.ASOS_Phone " + data.sortDirecction;
        break;
      case "AWOS":
        sort = " Aeropuertos.AWOS " + data.sortDirecction;
        break;
      case "AWOS_Phone":
        sort = " Aeropuertos.AWOS_Phone " + data.sortDirecction;
        break;
      case "AWOS_Type":
        sort = " Aeropuertos.AWOS_Type " + data.sortDirecction;
        break;
      case "Codigo_de_area___Lada":
        sort = " Aeropuertos.Codigo_de_area___Lada " + data.sortDirecction;
        break;
      case "Administracion_Aeropuerto":
        sort = " Aeropuertos.Administracion_Aeropuerto " + data.sortDirecction;
        break;
      case "Comandancia":
        sort = " Aeropuertos.Comandancia " + data.sortDirecction;
        break;
      case "Despacho":
        sort = " Aeropuertos.Despacho " + data.sortDirecction;
        break;
      case "Torre_de_Control":
        sort = " Aeropuertos.Torre_de_Control " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Aeropuertos.Descripcion " + data.sortDirecction;
        break;
      case "Notas":
        sort = " Aeropuertos.Notas " + data.sortDirecction;
        break;
      case "ICAO_IATA":
        sort = " Aeropuertos.ICAO_IATA " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromAeropuerto_ID != 'undefined' && data.filterAdvanced.fromAeropuerto_ID)
	|| (typeof data.filterAdvanced.toAeropuerto_ID != 'undefined' && data.filterAdvanced.toAeropuerto_ID)) 
	{
      if (typeof data.filterAdvanced.fromAeropuerto_ID != 'undefined' && data.filterAdvanced.fromAeropuerto_ID)
        condition += " AND Aeropuertos.Aeropuerto_ID >= " + data.filterAdvanced.fromAeropuerto_ID;

      if (typeof data.filterAdvanced.toAeropuerto_ID != 'undefined' && data.filterAdvanced.toAeropuerto_ID) 
        condition += " AND Aeropuertos.Aeropuerto_ID <= " + data.filterAdvanced.toAeropuerto_ID;
    }
    switch (data.filterAdvanced.ICAOFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.ICAO LIKE '" + data.filterAdvanced.ICAO + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.ICAO LIKE '%" + data.filterAdvanced.ICAO + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.ICAO LIKE '%" + data.filterAdvanced.ICAO + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.ICAO = '" + data.filterAdvanced.ICAO + "'";
        break;
    }
    switch (data.filterAdvanced.IATAFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.IATA LIKE '" + data.filterAdvanced.IATA + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.IATA LIKE '%" + data.filterAdvanced.IATA + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.IATA LIKE '%" + data.filterAdvanced.IATA + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.IATA = '" + data.filterAdvanced.IATA + "'";
        break;
    }
    switch (data.filterAdvanced.FAAFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.FAA LIKE '" + data.filterAdvanced.FAA + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.FAA LIKE '%" + data.filterAdvanced.FAA + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.FAA LIKE '%" + data.filterAdvanced.FAA + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.FAA = '" + data.filterAdvanced.FAA + "'";
        break;
    }
    switch (data.filterAdvanced.NombreFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Nombre LIKE '" + data.filterAdvanced.Nombre + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Nombre + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Nombre + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Nombre = '" + data.filterAdvanced.Nombre + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Pais != 'undefined' && data.filterAdvanced.Pais)) {
      switch (data.filterAdvanced.PaisFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Pais.Nombre LIKE '" + data.filterAdvanced.Pais + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Pais.Nombre = '" + data.filterAdvanced.Pais + "'";
          break;
      }
    } else if (data.filterAdvanced.PaisMultiple != null && data.filterAdvanced.PaisMultiple.length > 0) {
      var Paisds = data.filterAdvanced.PaisMultiple.join(",");
      condition += " AND Aeropuertos.Pais In (" + Paisds + ")";
    }
    if ((typeof data.filterAdvanced.Estado != 'undefined' && data.filterAdvanced.Estado)) {
      switch (data.filterAdvanced.EstadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estado.Nombre LIKE '" + data.filterAdvanced.Estado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estado.Nombre LIKE '%" + data.filterAdvanced.Estado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estado.Nombre LIKE '%" + data.filterAdvanced.Estado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estado.Nombre = '" + data.filterAdvanced.Estado + "'";
          break;
      }
    } else if (data.filterAdvanced.EstadoMultiple != null && data.filterAdvanced.EstadoMultiple.length > 0) {
      var Estadods = data.filterAdvanced.EstadoMultiple.join(",");
      condition += " AND Aeropuertos.Estado In (" + Estadods + ")";
    }
    if ((typeof data.filterAdvanced.Ciudad != 'undefined' && data.filterAdvanced.Ciudad)) {
      switch (data.filterAdvanced.CiudadFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Ciudad.Nombre LIKE '" + data.filterAdvanced.Ciudad + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Ciudad.Nombre LIKE '%" + data.filterAdvanced.Ciudad + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Ciudad.Nombre LIKE '%" + data.filterAdvanced.Ciudad + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Ciudad.Nombre = '" + data.filterAdvanced.Ciudad + "'";
          break;
      }
    } else if (data.filterAdvanced.CiudadMultiple != null && data.filterAdvanced.CiudadMultiple.length > 0) {
      var Ciudadds = data.filterAdvanced.CiudadMultiple.join(",");
      condition += " AND Aeropuertos.Ciudad In (" + Ciudadds + ")";
    }
    switch (data.filterAdvanced.Horario_de_operacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Horario_de_operaciones LIKE '" + data.filterAdvanced.Horario_de_operaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Horario_de_operaciones LIKE '%" + data.filterAdvanced.Horario_de_operaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Horario_de_operaciones LIKE '%" + data.filterAdvanced.Horario_de_operaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Horario_de_operaciones = '" + data.filterAdvanced.Horario_de_operaciones + "'";
        break;
    }
    switch (data.filterAdvanced.LatitudFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Latitud LIKE '" + data.filterAdvanced.Latitud + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Latitud LIKE '%" + data.filterAdvanced.Latitud + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Latitud LIKE '%" + data.filterAdvanced.Latitud + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Latitud = '" + data.filterAdvanced.Latitud + "'";
        break;
    }
    switch (data.filterAdvanced.LongitudFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Longitud LIKE '" + data.filterAdvanced.Longitud + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Longitud LIKE '%" + data.filterAdvanced.Longitud + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Longitud LIKE '%" + data.filterAdvanced.Longitud + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Longitud = '" + data.filterAdvanced.Longitud + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromElevacion_pies != 'undefined' && data.filterAdvanced.fromElevacion_pies)
	|| (typeof data.filterAdvanced.toElevacion_pies != 'undefined' && data.filterAdvanced.toElevacion_pies)) 
	{
      if (typeof data.filterAdvanced.fromElevacion_pies != 'undefined' && data.filterAdvanced.fromElevacion_pies)
        condition += " AND Aeropuertos.Elevacion_pies >= " + data.filterAdvanced.fromElevacion_pies;

      if (typeof data.filterAdvanced.toElevacion_pies != 'undefined' && data.filterAdvanced.toElevacion_pies) 
        condition += " AND Aeropuertos.Elevacion_pies <= " + data.filterAdvanced.toElevacion_pies;
    }
    switch (data.filterAdvanced.VariacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Variacion LIKE '" + data.filterAdvanced.Variacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Variacion LIKE '%" + data.filterAdvanced.Variacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Variacion LIKE '%" + data.filterAdvanced.Variacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Variacion = '" + data.filterAdvanced.Variacion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Tipo_de_Aeropuerto != 'undefined' && data.filterAdvanced.Tipo_de_Aeropuerto)) {
      switch (data.filterAdvanced.Tipo_de_AeropuertoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Aeropuerto.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Aeropuerto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Aeropuerto.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Aeropuerto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Aeropuerto.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Aeropuerto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Aeropuerto.Descripcion = '" + data.filterAdvanced.Tipo_de_Aeropuerto + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_AeropuertoMultiple != null && data.filterAdvanced.Tipo_de_AeropuertoMultiple.length > 0) {
      var Tipo_de_Aeropuertods = data.filterAdvanced.Tipo_de_AeropuertoMultiple.join(",");
      condition += " AND Aeropuertos.Tipo_de_Aeropuerto In (" + Tipo_de_Aeropuertods + ")";
    }
    if ((typeof data.filterAdvanced.Ciudad_mas_cercana != 'undefined' && data.filterAdvanced.Ciudad_mas_cercana)) {
      switch (data.filterAdvanced.Ciudad_mas_cercanaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Ciudad.Nombre LIKE '" + data.filterAdvanced.Ciudad_mas_cercana + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Ciudad.Nombre LIKE '%" + data.filterAdvanced.Ciudad_mas_cercana + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Ciudad.Nombre LIKE '%" + data.filterAdvanced.Ciudad_mas_cercana + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Ciudad.Nombre = '" + data.filterAdvanced.Ciudad_mas_cercana + "'";
          break;
      }
    } else if (data.filterAdvanced.Ciudad_mas_cercanaMultiple != null && data.filterAdvanced.Ciudad_mas_cercanaMultiple.length > 0) {
      var Ciudad_mas_cercanads = data.filterAdvanced.Ciudad_mas_cercanaMultiple.join(",");
      condition += " AND Aeropuertos.Ciudad_mas_cercana In (" + Ciudad_mas_cercanads + ")";
    }
    if ((typeof data.filterAdvanced.fromDistancia_en_KM != 'undefined' && data.filterAdvanced.fromDistancia_en_KM)
	|| (typeof data.filterAdvanced.toDistancia_en_KM != 'undefined' && data.filterAdvanced.toDistancia_en_KM)) 
	{
      if (typeof data.filterAdvanced.fromDistancia_en_KM != 'undefined' && data.filterAdvanced.fromDistancia_en_KM)
        condition += " AND Aeropuertos.Distancia_en_KM >= " + data.filterAdvanced.fromDistancia_en_KM;

      if (typeof data.filterAdvanced.toDistancia_en_KM != 'undefined' && data.filterAdvanced.toDistancia_en_KM) 
        condition += " AND Aeropuertos.Distancia_en_KM <= " + data.filterAdvanced.toDistancia_en_KM;
    }
    switch (data.filterAdvanced.UTC_EstandarFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.UTC_Estandar LIKE '" + data.filterAdvanced.UTC_Estandar + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.UTC_Estandar LIKE '%" + data.filterAdvanced.UTC_Estandar + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.UTC_Estandar LIKE '%" + data.filterAdvanced.UTC_Estandar + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.UTC_Estandar = '" + data.filterAdvanced.UTC_Estandar + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromUTC_Estandar_Inicio != 'undefined' && data.filterAdvanced.fromUTC_Estandar_Inicio)
	|| (typeof data.filterAdvanced.toUTC_Estandar_Inicio != 'undefined' && data.filterAdvanced.toUTC_Estandar_Inicio)) 
	{
      if (typeof data.filterAdvanced.fromUTC_Estandar_Inicio != 'undefined' && data.filterAdvanced.fromUTC_Estandar_Inicio) 
        condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_Estandar_Inicio, 102)  >= '" +  moment(data.filterAdvanced.fromUTC_Estandar_Inicio).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toUTC_Estandar_Inicio != 'undefined' && data.filterAdvanced.toUTC_Estandar_Inicio) 
        condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_Estandar_Inicio, 102)  <= '" + moment(data.filterAdvanced.toUTC_Estandar_Inicio).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromUTC_Estandar_Fin != 'undefined' && data.filterAdvanced.fromUTC_Estandar_Fin)
	|| (typeof data.filterAdvanced.toUTC_Estandar_Fin != 'undefined' && data.filterAdvanced.toUTC_Estandar_Fin)) 
	{
      if (typeof data.filterAdvanced.fromUTC_Estandar_Fin != 'undefined' && data.filterAdvanced.fromUTC_Estandar_Fin) 
        condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_Estandar_Fin, 102)  >= '" +  moment(data.filterAdvanced.fromUTC_Estandar_Fin).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toUTC_Estandar_Fin != 'undefined' && data.filterAdvanced.toUTC_Estandar_Fin) 
        condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_Estandar_Fin, 102)  <= '" + moment(data.filterAdvanced.toUTC_Estandar_Fin).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.UTC_DLTSFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.UTC_DLTS LIKE '" + data.filterAdvanced.UTC_DLTS + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.UTC_DLTS LIKE '%" + data.filterAdvanced.UTC_DLTS + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.UTC_DLTS LIKE '%" + data.filterAdvanced.UTC_DLTS + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.UTC_DLTS = '" + data.filterAdvanced.UTC_DLTS + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromUTC_DLTS_Inicio != 'undefined' && data.filterAdvanced.fromUTC_DLTS_Inicio)
	|| (typeof data.filterAdvanced.toUTC_DLTS_Inicio != 'undefined' && data.filterAdvanced.toUTC_DLTS_Inicio)) 
	{
      if (typeof data.filterAdvanced.fromUTC_DLTS_Inicio != 'undefined' && data.filterAdvanced.fromUTC_DLTS_Inicio) 
        condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_DLTS_Inicio, 102)  >= '" +  moment(data.filterAdvanced.fromUTC_DLTS_Inicio).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toUTC_DLTS_Inicio != 'undefined' && data.filterAdvanced.toUTC_DLTS_Inicio) 
        condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_DLTS_Inicio, 102)  <= '" + moment(data.filterAdvanced.toUTC_DLTS_Inicio).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromUTC_DLTS_Fin != 'undefined' && data.filterAdvanced.fromUTC_DLTS_Fin)
	|| (typeof data.filterAdvanced.toUTC_DLTS_Fin != 'undefined' && data.filterAdvanced.toUTC_DLTS_Fin)) 
	{
      if (typeof data.filterAdvanced.fromUTC_DLTS_Fin != 'undefined' && data.filterAdvanced.fromUTC_DLTS_Fin) 
        condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_DLTS_Fin, 102)  >= '" +  moment(data.filterAdvanced.fromUTC_DLTS_Fin).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toUTC_DLTS_Fin != 'undefined' && data.filterAdvanced.toUTC_DLTS_Fin) 
        condition += " and CONVERT(VARCHAR(10), Aeropuertos.UTC_DLTS_Fin, 102)  <= '" + moment(data.filterAdvanced.toUTC_DLTS_Fin).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromUTC__Amanecer != 'undefined' && data.filterAdvanced.fromUTC__Amanecer)
	|| (typeof data.filterAdvanced.toUTC__Amanecer != 'undefined' && data.filterAdvanced.toUTC__Amanecer)) 
	{
		if (typeof data.filterAdvanced.fromUTC__Amanecer != 'undefined' && data.filterAdvanced.fromUTC__Amanecer) 
			condition += " and Aeropuertos.UTC__Amanecer >= '" + data.filterAdvanced.fromUTC__Amanecer + "'";
      
		if (typeof data.filterAdvanced.toUTC__Amanecer != 'undefined' && data.filterAdvanced.toUTC__Amanecer) 
			condition += " and Aeropuertos.UTC__Amanecer <= '" + data.filterAdvanced.toUTC__Amanecer + "'";
    }
    if ((typeof data.filterAdvanced.fromUTC__Atardecer != 'undefined' && data.filterAdvanced.fromUTC__Atardecer)
	|| (typeof data.filterAdvanced.toUTC__Atardecer != 'undefined' && data.filterAdvanced.toUTC__Atardecer)) 
	{
		if (typeof data.filterAdvanced.fromUTC__Atardecer != 'undefined' && data.filterAdvanced.fromUTC__Atardecer) 
			condition += " and Aeropuertos.UTC__Atardecer >= '" + data.filterAdvanced.fromUTC__Atardecer + "'";
      
		if (typeof data.filterAdvanced.toUTC__Atardecer != 'undefined' && data.filterAdvanced.toUTC__Atardecer) 
			condition += " and Aeropuertos.UTC__Atardecer <= '" + data.filterAdvanced.toUTC__Atardecer + "'";
    }
    if ((typeof data.filterAdvanced.fromLocal_Amanecer != 'undefined' && data.filterAdvanced.fromLocal_Amanecer)
	|| (typeof data.filterAdvanced.toLocal_Amanecer != 'undefined' && data.filterAdvanced.toLocal_Amanecer)) 
	{
		if (typeof data.filterAdvanced.fromLocal_Amanecer != 'undefined' && data.filterAdvanced.fromLocal_Amanecer) 
			condition += " and Aeropuertos.Local_Amanecer >= '" + data.filterAdvanced.fromLocal_Amanecer + "'";
      
		if (typeof data.filterAdvanced.toLocal_Amanecer != 'undefined' && data.filterAdvanced.toLocal_Amanecer) 
			condition += " and Aeropuertos.Local_Amanecer <= '" + data.filterAdvanced.toLocal_Amanecer + "'";
    }
    if ((typeof data.filterAdvanced.fromLocal_Atardecer != 'undefined' && data.filterAdvanced.fromLocal_Atardecer)
	|| (typeof data.filterAdvanced.toLocal_Atardecer != 'undefined' && data.filterAdvanced.toLocal_Atardecer)) 
	{
		if (typeof data.filterAdvanced.fromLocal_Atardecer != 'undefined' && data.filterAdvanced.fromLocal_Atardecer) 
			condition += " and Aeropuertos.Local_Atardecer >= '" + data.filterAdvanced.fromLocal_Atardecer + "'";
      
		if (typeof data.filterAdvanced.toLocal_Atardecer != 'undefined' && data.filterAdvanced.toLocal_Atardecer) 
			condition += " and Aeropuertos.Local_Atardecer <= '" + data.filterAdvanced.toLocal_Atardecer + "'";
    }
    if ((typeof data.filterAdvanced.fromTWR != 'undefined' && data.filterAdvanced.fromTWR)
	|| (typeof data.filterAdvanced.toTWR != 'undefined' && data.filterAdvanced.toTWR)) 
	{
      if (typeof data.filterAdvanced.fromTWR != 'undefined' && data.filterAdvanced.fromTWR)
        condition += " AND Aeropuertos.TWR >= " + data.filterAdvanced.fromTWR;

      if (typeof data.filterAdvanced.toTWR != 'undefined' && data.filterAdvanced.toTWR) 
        condition += " AND Aeropuertos.TWR <= " + data.filterAdvanced.toTWR;
    }
    if ((typeof data.filterAdvanced.fromGND != 'undefined' && data.filterAdvanced.fromGND)
	|| (typeof data.filterAdvanced.toGND != 'undefined' && data.filterAdvanced.toGND)) 
	{
      if (typeof data.filterAdvanced.fromGND != 'undefined' && data.filterAdvanced.fromGND)
        condition += " AND Aeropuertos.GND >= " + data.filterAdvanced.fromGND;

      if (typeof data.filterAdvanced.toGND != 'undefined' && data.filterAdvanced.toGND) 
        condition += " AND Aeropuertos.GND <= " + data.filterAdvanced.toGND;
    }
    switch (data.filterAdvanced.UNICOMFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.UNICOM LIKE '" + data.filterAdvanced.UNICOM + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.UNICOM LIKE '%" + data.filterAdvanced.UNICOM + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.UNICOM LIKE '%" + data.filterAdvanced.UNICOM + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.UNICOM = '" + data.filterAdvanced.UNICOM + "'";
        break;
    }
    switch (data.filterAdvanced.CARDEL_1Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.CARDEL_1 LIKE '" + data.filterAdvanced.CARDEL_1 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.CARDEL_1 LIKE '%" + data.filterAdvanced.CARDEL_1 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.CARDEL_1 LIKE '%" + data.filterAdvanced.CARDEL_1 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.CARDEL_1 = '" + data.filterAdvanced.CARDEL_1 + "'";
        break;
    }
    switch (data.filterAdvanced.CARDEL_2Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.CARDEL_2 LIKE '" + data.filterAdvanced.CARDEL_2 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.CARDEL_2 LIKE '%" + data.filterAdvanced.CARDEL_2 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.CARDEL_2 LIKE '%" + data.filterAdvanced.CARDEL_2 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.CARDEL_2 = '" + data.filterAdvanced.CARDEL_2 + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromAPPR != 'undefined' && data.filterAdvanced.fromAPPR)
	|| (typeof data.filterAdvanced.toAPPR != 'undefined' && data.filterAdvanced.toAPPR)) 
	{
      if (typeof data.filterAdvanced.fromAPPR != 'undefined' && data.filterAdvanced.fromAPPR)
        condition += " AND Aeropuertos.APPR >= " + data.filterAdvanced.fromAPPR;

      if (typeof data.filterAdvanced.toAPPR != 'undefined' && data.filterAdvanced.toAPPR) 
        condition += " AND Aeropuertos.APPR <= " + data.filterAdvanced.toAPPR;
    }
    if ((typeof data.filterAdvanced.fromDEP != 'undefined' && data.filterAdvanced.fromDEP)
	|| (typeof data.filterAdvanced.toDEP != 'undefined' && data.filterAdvanced.toDEP)) 
	{
      if (typeof data.filterAdvanced.fromDEP != 'undefined' && data.filterAdvanced.fromDEP)
        condition += " AND Aeropuertos.DEP >= " + data.filterAdvanced.fromDEP;

      if (typeof data.filterAdvanced.toDEP != 'undefined' && data.filterAdvanced.toDEP) 
        condition += " AND Aeropuertos.DEP <= " + data.filterAdvanced.toDEP;
    }
    switch (data.filterAdvanced.ATISFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.ATIS LIKE '" + data.filterAdvanced.ATIS + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.ATIS LIKE '%" + data.filterAdvanced.ATIS + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.ATIS LIKE '%" + data.filterAdvanced.ATIS + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.ATIS = '" + data.filterAdvanced.ATIS + "'";
        break;
    }
    switch (data.filterAdvanced.ATIS_PhoneFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.ATIS_Phone LIKE '" + data.filterAdvanced.ATIS_Phone + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.ATIS_Phone LIKE '%" + data.filterAdvanced.ATIS_Phone + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.ATIS_Phone LIKE '%" + data.filterAdvanced.ATIS_Phone + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.ATIS_Phone = '" + data.filterAdvanced.ATIS_Phone + "'";
        break;
    }
    switch (data.filterAdvanced.ASOSFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.ASOS LIKE '" + data.filterAdvanced.ASOS + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.ASOS LIKE '%" + data.filterAdvanced.ASOS + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.ASOS LIKE '%" + data.filterAdvanced.ASOS + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.ASOS = '" + data.filterAdvanced.ASOS + "'";
        break;
    }
    switch (data.filterAdvanced.ASOS_PhoneFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.ASOS_Phone LIKE '" + data.filterAdvanced.ASOS_Phone + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.ASOS_Phone LIKE '%" + data.filterAdvanced.ASOS_Phone + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.ASOS_Phone LIKE '%" + data.filterAdvanced.ASOS_Phone + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.ASOS_Phone = '" + data.filterAdvanced.ASOS_Phone + "'";
        break;
    }
    switch (data.filterAdvanced.AWOSFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.AWOS LIKE '" + data.filterAdvanced.AWOS + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.AWOS LIKE '%" + data.filterAdvanced.AWOS + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.AWOS LIKE '%" + data.filterAdvanced.AWOS + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.AWOS = '" + data.filterAdvanced.AWOS + "'";
        break;
    }
    switch (data.filterAdvanced.AWOS_PhoneFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.AWOS_Phone LIKE '" + data.filterAdvanced.AWOS_Phone + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.AWOS_Phone LIKE '%" + data.filterAdvanced.AWOS_Phone + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.AWOS_Phone LIKE '%" + data.filterAdvanced.AWOS_Phone + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.AWOS_Phone = '" + data.filterAdvanced.AWOS_Phone + "'";
        break;
    }
    switch (data.filterAdvanced.AWOS_TypeFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.AWOS_Type LIKE '" + data.filterAdvanced.AWOS_Type + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.AWOS_Type LIKE '%" + data.filterAdvanced.AWOS_Type + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.AWOS_Type LIKE '%" + data.filterAdvanced.AWOS_Type + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.AWOS_Type = '" + data.filterAdvanced.AWOS_Type + "'";
        break;
    }
    switch (data.filterAdvanced.Codigo_de_area___LadaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Codigo_de_area___Lada LIKE '" + data.filterAdvanced.Codigo_de_area___Lada + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Codigo_de_area___Lada LIKE '%" + data.filterAdvanced.Codigo_de_area___Lada + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Codigo_de_area___Lada LIKE '%" + data.filterAdvanced.Codigo_de_area___Lada + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Codigo_de_area___Lada = '" + data.filterAdvanced.Codigo_de_area___Lada + "'";
        break;
    }
    switch (data.filterAdvanced.Administracion_AeropuertoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Administracion_Aeropuerto LIKE '" + data.filterAdvanced.Administracion_Aeropuerto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Administracion_Aeropuerto LIKE '%" + data.filterAdvanced.Administracion_Aeropuerto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Administracion_Aeropuerto LIKE '%" + data.filterAdvanced.Administracion_Aeropuerto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Administracion_Aeropuerto = '" + data.filterAdvanced.Administracion_Aeropuerto + "'";
        break;
    }
    switch (data.filterAdvanced.ComandanciaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Comandancia LIKE '" + data.filterAdvanced.Comandancia + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Comandancia LIKE '%" + data.filterAdvanced.Comandancia + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Comandancia LIKE '%" + data.filterAdvanced.Comandancia + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Comandancia = '" + data.filterAdvanced.Comandancia + "'";
        break;
    }
    switch (data.filterAdvanced.DespachoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Despacho LIKE '" + data.filterAdvanced.Despacho + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Despacho LIKE '%" + data.filterAdvanced.Despacho + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Despacho LIKE '%" + data.filterAdvanced.Despacho + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Despacho = '" + data.filterAdvanced.Despacho + "'";
        break;
    }
    switch (data.filterAdvanced.Torre_de_ControlFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Torre_de_Control LIKE '" + data.filterAdvanced.Torre_de_Control + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Torre_de_Control LIKE '%" + data.filterAdvanced.Torre_de_Control + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Torre_de_Control LIKE '%" + data.filterAdvanced.Torre_de_Control + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Torre_de_Control = '" + data.filterAdvanced.Torre_de_Control + "'";
        break;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    switch (data.filterAdvanced.NotasFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.Notas LIKE '" + data.filterAdvanced.Notas + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.Notas LIKE '%" + data.filterAdvanced.Notas + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.Notas LIKE '%" + data.filterAdvanced.Notas + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.Notas = '" + data.filterAdvanced.Notas + "'";
        break;
    }
    switch (data.filterAdvanced.ICAO_IATAFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Aeropuertos.ICAO_IATA LIKE '" + data.filterAdvanced.ICAO_IATA + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Aeropuertos.ICAO_IATA LIKE '%" + data.filterAdvanced.ICAO_IATA + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Aeropuertos.ICAO_IATA LIKE '%" + data.filterAdvanced.ICAO_IATA + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Aeropuertos.ICAO_IATA = '" + data.filterAdvanced.ICAO_IATA + "'";
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
          if (column === 'Aeropuerto_ID') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Aeropuertoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Aeropuertoss);
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
