import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Registro_de_vueloService } from "src/app/api-services/Registro_de_vuelo.service";
import { Registro_de_vuelo } from "src/app/models/Registro_de_vuelo";
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
import { Registro_de_vueloIndexRules } from 'src/app/shared/businessRules/Registro_de_vuelo-index-rules';
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
  selector: "app-list-Registro_de_vuelo",
  templateUrl: "./list-Registro_de_vuelo.component.html",
  styleUrls: ["./list-Registro_de_vuelo.component.scss"],
})
export class ListRegistro_de_vueloComponent extends Registro_de_vueloIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No_Vuelo",
    "Matricula",
    "Fecha_de_solicitud",
    "Cliente",
    "Solicitante",
    "Tipo_de_vuelo",
    "Numero_de_Tramo",
    "Origen",
    "Destino",
    "Fecha_de_salida",
    "Hora_de_salida",
    "Cantidad_de_Pasajeros",
    "Ultimo_Tramo_notificar",
    "Comisariato",
    "Notas_de_vuelo",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No_Vuelo",
      "Matricula",
      "Fecha_de_solicitud",
      "Cliente",
      "Solicitante",
      "Tipo_de_vuelo",
      "Numero_de_Tramo",
      "Origen",
      "Destino",
      "Fecha_de_salida",
      "Hora_de_salida",
      "Cantidad_de_Pasajeros",
      "Ultimo_Tramo_notificar",
      "Comisariato",
      "Notas_de_vuelo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No_Vuelo_filtro",
      "Matricula_filtro",
      "Fecha_de_solicitud_filtro",
      "Cliente_filtro",
      "Solicitante_filtro",
      "Tipo_de_vuelo_filtro",
      "Numero_de_Tramo_filtro",
      "Origen_filtro",
      "Destino_filtro",
      "Fecha_de_salida_filtro",
      "Hora_de_salida_filtro",
      "Cantidad_de_Pasajeros_filtro",
      "Ultimo_Tramo_notificar_filtro",
      "Comisariato_filtro",
      "Notas_de_vuelo_filtro",

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
      No_Vuelo: "",
      Matricula: "",
      Fecha_de_solicitud: null,
      Cliente: "",
      Solicitante: "",
      Tipo_de_vuelo: "",
      Numero_de_Tramo: "",
      Origen: "",
      Destino: "",
      Fecha_de_salida: null,
      Hora_de_salida: "",
      Cantidad_de_Pasajeros: "",
      Ultimo_Tramo_notificar: "",
      Comisariato: "",
      Notas_de_vuelo: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      No_VueloFilter: "",
      No_Vuelo: "",
      No_VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromFecha_de_solicitud: "",
      toFecha_de_solicitud: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      Tipo_de_vueloFilter: "",
      Tipo_de_vuelo: "",
      Tipo_de_vueloMultiple: "",
      OrigenFilter: "",
      Origen: "",
      OrigenMultiple: "",
      DestinoFilter: "",
      Destino: "",
      DestinoMultiple: "",
      fromFecha_de_salida: "",
      toFecha_de_salida: "",
      fromHora_de_salida: "",
      toHora_de_salida: "",
      fromCantidad_de_Pasajeros: "",
      toCantidad_de_Pasajeros: "",

    }
  };

  dataSource: Registro_de_vueloDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Registro_de_vueloDataSource;
  dataClipboard: any;

  constructor(
    private _Registro_de_vueloService: Registro_de_vueloService,
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
    this.dataSource = new Registro_de_vueloDataSource(
      this._Registro_de_vueloService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Registro_de_vuelo)
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
    this.listConfig.filter.No_Vuelo = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Fecha_de_solicitud = undefined;
    this.listConfig.filter.Cliente = "";
    this.listConfig.filter.Solicitante = "";
    this.listConfig.filter.Tipo_de_vuelo = "";
    this.listConfig.filter.Numero_de_Tramo = "";
    this.listConfig.filter.Origen = "";
    this.listConfig.filter.Destino = "";
    this.listConfig.filter.Fecha_de_salida = undefined;
    this.listConfig.filter.Hora_de_salida = "";
    this.listConfig.filter.Cantidad_de_Pasajeros = "";
    this.listConfig.filter.Ultimo_Tramo_notificar = undefined;
    this.listConfig.filter.Comisariato = "";
    this.listConfig.filter.Notas_de_vuelo = "";

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

  remove(row: Registro_de_vuelo) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Registro_de_vueloService
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
  ActionPrint(dataRow: Registro_de_vuelo) {

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
      , 'No Vuelo'
      , 'Matricula'
      , 'Fecha de solicitud'
      , 'Cliente'
      , 'Solicitante'
      , 'Tipo de vuelo'
      , 'Tramo No.'
      , 'Origen'
      , 'Destino'
      , 'Fecha de salida'
      , 'Hora de salida'
      , 'Cantidad de Pasajeros'
      , 'Último Tramo (notificar a la tripulación por correo)'
      , 'Comisariato'
      , 'Notas de vuelo'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.Folio
        , x.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
        , x.Matricula_Aeronave.Matricula
        , x.Fecha_de_solicitud
        , x.Cliente_Cliente.Razon_Social
        , x.Solicitante_Spartan_User.Name
        , x.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion
        , x.Numero_de_Tramo
        , x.Origen_Aeropuertos.Descripcion
        , x.Destino_Aeropuertos.Descripcion
        , x.Fecha_de_salida
        , x.Hora_de_salida
        , x.Cantidad_de_Pasajeros
        , x.Ultimo_Tramo_notificar
        , x.Comisariato
        , x.Notas_de_vuelo

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
    pdfMake.createPdf(pdfDefinition).download('Registro_de_vuelo.pdf');
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
          this._Registro_de_vueloService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Registro_de_vuelos;
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
          this._Registro_de_vueloService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Registro_de_vuelos;
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
        'No Vuelo ': fields.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Matricula ': fields.Matricula_Aeronave.Matricula,
        'Fecha de solicitud ': fields.Fecha_de_solicitud ? momentJS(fields.Fecha_de_solicitud).format('DD/MM/YYYY') : '',
        'Cliente ': fields.Cliente_Cliente.Razon_Social,
        'Solicitante ': fields.Solicitante_Spartan_User.Name,
        'Tipo de vuelo ': fields.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion,
        'Tramo No. ': fields.Numero_de_Tramo,
        'Origen ': fields.Origen_Aeropuertos.Descripcion,
        'Destino 1': fields.Destino_Aeropuertos.Descripcion,
        'Fecha de salida ': fields.Fecha_de_salida ? momentJS(fields.Fecha_de_salida).format('DD/MM/YYYY') : '',
        'Hora de salida ': fields.Hora_de_salida,
        'Cantidad de Pasajeros ': fields.Cantidad_de_Pasajeros,
        'Ultimo_Tramo_notificar ': fields.Ultimo_Tramo_notificar ? 'SI' : 'NO',
        'Comisariato ': fields.Comisariato,
        'Notas de vuelo ': fields.Notas_de_vuelo,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Registro_de_vuelo  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No_Vuelo: x.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Matricula: x.Matricula_Aeronave.Matricula,
      Fecha_de_solicitud: x.Fecha_de_solicitud,
      Cliente: x.Cliente_Cliente.Razon_Social,
      Solicitante: x.Solicitante_Spartan_User.Name,
      Tipo_de_vuelo: x.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion,
      Numero_de_Tramo: x.Numero_de_Tramo,
      Origen: x.Origen_Aeropuertos.Descripcion,
      Destino: x.Destino_Aeropuertos.Descripcion,
      Fecha_de_salida: x.Fecha_de_salida,
      Hora_de_salida: x.Hora_de_salida,
      Cantidad_de_Pasajeros: x.Cantidad_de_Pasajeros,
      Ultimo_Tramo_notificar: x.Ultimo_Tramo_notificar,
      Comisariato: x.Comisariato,
      Notas_de_vuelo: x.Notas_de_vuelo,

    }));

    this.excelService.exportToCsv(result, 'Registro_de_vuelo', ['Folio', 'No_Vuelo', 'Matricula', 'Fecha_de_solicitud', 'Cliente', 'Solicitante', 'Tipo_de_vuelo', 'Numero_de_Tramo', 'Origen', 'Destino', 'Fecha_de_salida', 'Hora_de_salida', 'Cantidad_de_Pasajeros', 'Ultimo_Tramo_notificar', 'Comisariato', 'Notas_de_vuelo']);
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
    template += '          <th>No Vuelo</th>';
    template += '          <th>Matricula</th>';
    template += '          <th>Fecha de solicitud</th>';
    template += '          <th>Cliente</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Tipo de vuelo</th>';
    template += '          <th>Tramo No.</th>';
    template += '          <th>Origen</th>';
    template += '          <th>Destino</th>';
    template += '          <th>Fecha de salida</th>';
    template += '          <th>Hora de salida</th>';
    template += '          <th>Cantidad de Pasajeros</th>';
    template += '          <th>Último Tramo (notificar a la tripulación por correo)</th>';
    template += '          <th>Comisariato</th>';
    template += '          <th>Notas de vuelo</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Fecha_de_solicitud + '</td>';
      template += '          <td>' + element.Cliente_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion + '</td>';
      template += '          <td>' + element.Numero_de_Tramo + '</td>';
      template += '          <td>' + element.Origen_Aeropuertos.Descripcion + '</td>';
      template += '          <td>' + element.Destino_Aeropuertos.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_de_salida + '</td>';
      template += '          <td>' + element.Hora_de_salida + '</td>';
      template += '          <td>' + element.Cantidad_de_Pasajeros + '</td>';
      template += '          <td>' + element.Ultimo_Tramo_notificar + '</td>';
      template += '          <td>' + element.Comisariato + '</td>';
      template += '          <td>' + element.Notas_de_vuelo + '</td>';

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
    template += '\t No Vuelo';
    template += '\t Matricula';
    template += '\t Fecha de solicitud';
    template += '\t Cliente';
    template += '\t Solicitante';
    template += '\t Tipo de vuelo';
    template += '\t Tramo No.';
    template += '\t Origen';
    template += '\t Destino';
    template += '\t Fecha de salida';
    template += '\t Hora de salida';
    template += '\t Cantidad de Pasajeros';
    template += '\t Último Tramo (notificar a la tripulación por correo)';
    template += '\t Comisariato';
    template += '\t Notas de vuelo';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.Folio;
      template += '\t ' + element.No_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Fecha_de_solicitud;
      template += '\t ' + element.Cliente_Cliente.Razon_Social;
      template += '\t ' + element.Solicitante_Spartan_User.Name;
      template += '\t ' + element.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion;
      template += '\t ' + element.Numero_de_Tramo;
      template += '\t ' + element.Origen_Aeropuertos.Descripcion;
      template += '\t ' + element.Destino_Aeropuertos.Descripcion;
      template += '\t ' + element.Fecha_de_salida;
      template += '\t ' + element.Hora_de_salida;
      template += '\t ' + element.Cantidad_de_Pasajeros;
      template += '\t ' + element.Ultimo_Tramo_notificar;
      template += '\t ' + element.Comisariato;
      template += '\t ' + element.Notas_de_vuelo;

      template += '\n';
    });

    return template;
  }

}

export class Registro_de_vueloDataSource implements DataSource<Registro_de_vuelo>
{
  private subject = new BehaviorSubject<Registro_de_vuelo[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Registro_de_vueloService, private _file: SpartanFileService) { }

  connect(collectionViewer: CollectionViewer): Observable<Registro_de_vuelo[]> {
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
          if (column === 'Folio') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Registro_de_vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Registro_de_vuelos);
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
      condition += " and Registro_de_vuelo.Folio = " + data.filter.Folio;
    if (data.filter.No_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.No_Vuelo + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Fecha_de_solicitud)
      condition += " and CONVERT(VARCHAR(10), Registro_de_vuelo.Fecha_de_solicitud, 102)  = '" + moment(data.filter.Fecha_de_solicitud).format("YYYY.MM.DD") + "'";
    if (data.filter.Cliente != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Cliente + "%' ";
    if (data.filter.Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante + "%' ";
    if (data.filter.Tipo_de_vuelo != "")
      condition += " and Tipo_de_vuelo.Descripcion like '%" + data.filter.Tipo_de_vuelo + "%' ";
    if (data.filter.Numero_de_Tramo != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Numero_de_Tramo + "%' ";
    if (data.filter.Origen != "")
      condition += " and Aeropuertos.Descripcion like '%" + data.filter.Origen + "%' ";
    if (data.filter.Destino != "")
      condition += " and Aeropuertos.Descripcion like '%" + data.filter.Destino + "%' ";
    if (data.filter.Fecha_de_salida)
      condition += " and CONVERT(VARCHAR(10), Registro_de_vuelo.Fecha_de_salida, 102)  = '" + moment(data.filter.Fecha_de_salida).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_salida != "")
      condition += " and Registro_de_vuelo.Hora_de_salida = '" + data.filter.Hora_de_salida + "'";
    if (data.filter.Cantidad_de_Pasajeros != "")
      condition += " and Registro_de_vuelo.Cantidad_de_Pasajeros = " + data.filter.Cantidad_de_Pasajeros;
    if (data.filter.Ultimo_Tramo_notificar && data.filter.Ultimo_Tramo_notificar != "2") {
      if (data.filter.Ultimo_Tramo_notificar == "0" || data.filter.Ultimo_Tramo_notificar == "") {
        condition += " and (Registro_de_vuelo.Ultimo_Tramo_notificar = 0 or Registro_de_vuelo.Ultimo_Tramo_notificar is null)";
      } else {
        condition += " and Registro_de_vuelo.Ultimo_Tramo_notificar = 1";
      }
    }
    if (data.filter.Comisariato != "")
      condition += " and Registro_de_vuelo.Comisariato like '%" + data.filter.Comisariato + "%' ";
    if (data.filter.Notas_de_vuelo != "")
      condition += " and Registro_de_vuelo.Notas_de_vuelo like '%" + data.filter.Notas_de_vuelo + "%' ";

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
        sort = " Registro_de_vuelo.Folio " + data.sortDirecction;
        break;
      case "No_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Fecha_de_solicitud":
        sort = " Registro_de_vuelo.Fecha_de_solicitud " + data.sortDirecction;
        break;
      case "Cliente":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Tipo_de_vuelo":
        sort = " Tipo_de_vuelo.Descripcion " + data.sortDirecction;
        break;
      case "Numero_de_Tramo":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
        break;
      case "Origen":
        sort = " Aeropuertos.Descripcion " + data.sortDirecction;
        break;
      case "Destino":
        sort = " Aeropuertos.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_de_salida":
        sort = " Registro_de_vuelo.Fecha_de_salida " + data.sortDirecction;
        break;
      case "Hora_de_salida":
        sort = " Registro_de_vuelo.Hora_de_salida " + data.sortDirecction;
        break;
      case "Cantidad_de_Pasajeros":
        sort = " Registro_de_vuelo.Cantidad_de_Pasajeros " + data.sortDirecction;
        break;
      case "Ultimo_Tramo_notificar":
        sort = " Registro_de_vuelo.Ultimo_Tramo_notificar " + data.sortDirecction;
        break;
      case "Comisariato":
        sort = " Registro_de_vuelo.Comisariato " + data.sortDirecction;
        break;
      case "Notas_de_vuelo":
        sort = " Registro_de_vuelo.Notas_de_vuelo " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
      || (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)) {
      if (typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
        condition += " AND Registro_de_vuelo.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)
        condition += " AND Registro_de_vuelo.Folio <= " + data.filterAdvanced.toFolio;
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
      condition += " AND Registro_de_vuelo.No_Vuelo In (" + No_Vuelods + ")";
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
      condition += " AND Registro_de_vuelo.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_solicitud)
      || (typeof data.filterAdvanced.toFecha_de_solicitud != 'undefined' && data.filterAdvanced.toFecha_de_solicitud)) {
      if (typeof data.filterAdvanced.fromFecha_de_solicitud != 'undefined' && data.filterAdvanced.fromFecha_de_solicitud)
        condition += " and CONVERT(VARCHAR(10), Registro_de_vuelo.Fecha_de_solicitud, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_solicitud).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_solicitud != 'undefined' && data.filterAdvanced.toFecha_de_solicitud)
        condition += " and CONVERT(VARCHAR(10), Registro_de_vuelo.Fecha_de_solicitud, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_solicitud).format("YYYY.MM.DD") + "'";
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
      condition += " AND Registro_de_vuelo.Cliente In (" + Clienteds + ")";
    }
    if ((typeof data.filterAdvanced.Solicitante != 'undefined' && data.filterAdvanced.Solicitante)) {
      switch (data.filterAdvanced.SolicitanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Solicitante + "'";
          break;
      }
    } else if (data.filterAdvanced.SolicitanteMultiple != null && data.filterAdvanced.SolicitanteMultiple.length > 0) {
      var Solicitanteds = data.filterAdvanced.SolicitanteMultiple.join(",");
      condition += " AND Registro_de_vuelo.Solicitante In (" + Solicitanteds + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_vuelo != 'undefined' && data.filterAdvanced.Tipo_de_vuelo)) {
      switch (data.filterAdvanced.Tipo_de_vueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_vuelo.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_vuelo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_vuelo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_vuelo.Descripcion = '" + data.filterAdvanced.Tipo_de_vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_vueloMultiple != null && data.filterAdvanced.Tipo_de_vueloMultiple.length > 0) {
      var Tipo_de_vuelods = data.filterAdvanced.Tipo_de_vueloMultiple.join(",");
      condition += " AND Registro_de_vuelo.Tipo_de_vuelo In (" + Tipo_de_vuelods + ")";
    }
    switch (data.filterAdvanced.Numero_de_TramoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '" + data.filterAdvanced.Numero_de_Tramo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Numero_de_Tramo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Numero_de_Tramo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Registro_de_vuelo.Numero_de_Tramo = '" + data.filterAdvanced.Numero_de_Tramo + "'";
        break;
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
      condition += " AND Registro_de_vuelo.Origen In (" + Origends + ")";
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
      condition += " AND Registro_de_vuelo.Destino In (" + Destinods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_salida != 'undefined' && data.filterAdvanced.fromFecha_de_salida)
      || (typeof data.filterAdvanced.toFecha_de_salida != 'undefined' && data.filterAdvanced.toFecha_de_salida)) {
      if (typeof data.filterAdvanced.fromFecha_de_salida != 'undefined' && data.filterAdvanced.fromFecha_de_salida)
        condition += " and CONVERT(VARCHAR(10), Registro_de_vuelo.Fecha_de_salida, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_salida).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_salida != 'undefined' && data.filterAdvanced.toFecha_de_salida)
        condition += " and CONVERT(VARCHAR(10), Registro_de_vuelo.Fecha_de_salida, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_salida).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_salida != 'undefined' && data.filterAdvanced.fromHora_de_salida)
      || (typeof data.filterAdvanced.toHora_de_salida != 'undefined' && data.filterAdvanced.toHora_de_salida)) {
      if (typeof data.filterAdvanced.fromHora_de_salida != 'undefined' && data.filterAdvanced.fromHora_de_salida)
        condition += " and Registro_de_vuelo.Hora_de_salida >= '" + data.filterAdvanced.fromHora_de_salida + "'";

      if (typeof data.filterAdvanced.toHora_de_salida != 'undefined' && data.filterAdvanced.toHora_de_salida)
        condition += " and Registro_de_vuelo.Hora_de_salida <= '" + data.filterAdvanced.toHora_de_salida + "'";
    }
    if ((typeof data.filterAdvanced.fromCantidad_de_Pasajeros != 'undefined' && data.filterAdvanced.fromCantidad_de_Pasajeros)
      || (typeof data.filterAdvanced.toCantidad_de_Pasajeros != 'undefined' && data.filterAdvanced.toCantidad_de_Pasajeros)) {
      if (typeof data.filterAdvanced.fromCantidad_de_Pasajeros != 'undefined' && data.filterAdvanced.fromCantidad_de_Pasajeros)
        condition += " AND Registro_de_vuelo.Cantidad_de_Pasajeros >= " + data.filterAdvanced.fromCantidad_de_Pasajeros;

      if (typeof data.filterAdvanced.toCantidad_de_Pasajeros != 'undefined' && data.filterAdvanced.toCantidad_de_Pasajeros)
        condition += " AND Registro_de_vuelo.Cantidad_de_Pasajeros <= " + data.filterAdvanced.toCantidad_de_Pasajeros;
    }
    switch (data.filterAdvanced.ComisariatoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Registro_de_vuelo.Comisariato LIKE '" + data.filterAdvanced.Comisariato + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Registro_de_vuelo.Comisariato LIKE '%" + data.filterAdvanced.Comisariato + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Registro_de_vuelo.Comisariato LIKE '%" + data.filterAdvanced.Comisariato + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Registro_de_vuelo.Comisariato = '" + data.filterAdvanced.Comisariato + "'";
        break;
    }
    switch (data.filterAdvanced.Notas_de_vueloFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Registro_de_vuelo.Notas_de_vuelo LIKE '" + data.filterAdvanced.Notas_de_vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Registro_de_vuelo.Notas_de_vuelo LIKE '%" + data.filterAdvanced.Notas_de_vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Registro_de_vuelo.Notas_de_vuelo LIKE '%" + data.filterAdvanced.Notas_de_vuelo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Registro_de_vuelo.Notas_de_vuelo = '" + data.filterAdvanced.Notas_de_vuelo + "'";
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
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Registro_de_vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Registro_de_vuelos);
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
