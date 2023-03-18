import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Solicitud_de_Compras_GeneralesService } from "src/app/api-services/Solicitud_de_Compras_Generales.service";
import { Solicitud_de_Compras_Generales } from "src/app/models/Solicitud_de_Compras_Generales";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2, OnDestroy } from '@angular/core';
import { CollectionViewer } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of, Subscription } from "rxjs";
import { catchError, finalize, concatMap, switchMap, mergeMap, tap, filter } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import * as AppConstants from "../../../app-constants";
import { StorageKeys } from "../../../app-constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { Solicitud_de_Compras_GeneralesIndexRules } from 'src/app/shared/businessRules/Solicitud_de_Compras_Generales-index-rules';
import { DialogConfirmExportComponent } from "./../../../shared/views/dialogs/dialog-confirm-export/dialog-confirm-export.component";
import { Enumerations } from 'src/app/models/enumerations';
import _, { map } from 'underscore';
import { ExcelService } from "src/app/api-services/excel.service";
import * as momentJS from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogPrintFormatComponent } from './../../../shared/views/dialogs/dialog-print-format/dialog-print-format.component';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { PrintHelper } from 'src/app/helpers/print-helper';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-list-Solicitud_de_Compras_Generales",
  templateUrl: "./list-Solicitud_de_Compras_Generales.component.html",
  styleUrls: ["./list-Solicitud_de_Compras_Generales.component.scss"],
})
export class ListSolicitud_de_Compras_GeneralesComponent extends Solicitud_de_Compras_GeneralesIndexRules implements OnInit, AfterViewInit, AfterViewChecked, OnDestroy {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "No_de_Solicitud",
    "Fecha_de_Registro",
    "Hora_de_Registro",
    "Usuario_que_Registra",
    "Razon_de_la_Compra",
    "Proveedor",
    "No_de_Vuelo",
    "Tramo",
    "Numero_de_O_S",
    "Numero_de_O_T",
    //"Departamento",
    "Tipo",
    "Observaciones",
    "Motivo_de_Cancelacion",
    //"Enviar_Solicitud",
    "Estatus_de_Solicitud",
    "Fecha_de_Autorizacion",
    "Hora_de_Autorizacion",
    "Autorizado_por",
    "Resultado",
    "Observacion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "No_de_Solicitud",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Razon_de_la_Compra",
      "Proveedor",
      "No_de_Vuelo",
      "Tramo",
      "Numero_de_O_S",
      "Numero_de_O_T",
      //"Departamento",
      "Tipo",
      "Observaciones",
      "Motivo_de_Cancelacion",
      //"Enviar_Solicitud",
      "Estatus_de_Solicitud",
      "Fecha_de_Autorizacion",
      "Hora_de_Autorizacion",
      "Autorizado_por",
      "Resultado",
      "Observacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "No_de_Solicitud_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Razon_de_la_Compra_filtro",
      "Proveedor_filtro",
      "No_de_Vuelo_filtro",
      "Tramo_filtro",
      "Numero_de_O_S_filtro",
      "Numero_de_O_T_filtro",
      //"Departamento_filtro",
      "Tipo_filtro",
      "Observaciones_filtro",
      "Motivo_de_Cancelacion_filtro",
      //"Enviar_Solicitud_filtro",
      "Estatus_de_Solicitud_filtro",
      "Fecha_de_Autorizacion_filtro",
      "Hora_de_Autorizacion_filtro",
      "Autorizado_por_filtro",
      "Resultado_filtro",
      "Observacion_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      No_de_Solicitud: "",
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Razon_de_la_Compra: "",
      Proveedor: "",
      No_de_Vuelo: "",
      Tramo: "",
      Numero_de_O_S: "",
      Numero_de_O_T: "",
      //Departamento: "",
      Tipo: "",
      Observaciones: "",
      Motivo_de_Cancelacion: "",
      //Enviar_Solicitud: "",
      Estatus_de_Solicitud: "",
      Fecha_de_Autorizacion: null,
      Hora_de_Autorizacion: "",
      Autorizado_por: "",
      Resultado: "",
      Observacion: "",

    },
    filterAdvanced: {
      fromNo_de_Solicitud: "",
      toNo_de_Solicitud: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      No_de_VueloFilter: "",
      No_de_Vuelo: "",
      No_de_VueloMultiple: "",
      TramoFilter: "",
      Tramo: "",
      TramoMultiple: "",
      Numero_de_O_SFilter: "",
      Numero_de_O_S: "",
      Numero_de_O_SMultiple: "",
      Numero_de_O_TFilter: "",
      Numero_de_O_T: "",
      Numero_de_O_TMultiple: "",
      //DepartamentoFilter: "",
      //Departamento: "",
      //DepartamentoMultiple: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",
      Estatus_de_SolicitudFilter: "",
      Estatus_de_Solicitud: "",
      Estatus_de_SolicitudMultiple: "",
      fromFecha_de_Autorizacion: "",
      toFecha_de_Autorizacion: "",
      fromHora_de_Autorizacion: "",
      toHora_de_Autorizacion: "",
      Autorizado_porFilter: "",
      Autorizado_por: "",
      Autorizado_porMultiple: "",
      ResultadoFilter: "",
      Resultado: "",
      ResultadoMultiple: "",

    }
  };
  public id: any;
  RoleId: number = 0;
  UserId: number = 0;
  Phase: any

  dataSource: Solicitud_de_Compras_GeneralesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Solicitud_de_Compras_GeneralesDataSource;
  dataClipboard: any;

  public subscriber: Subscription
  constructor(
    private _Solicitud_de_Compras_GeneralesService: Solicitud_de_Compras_GeneralesService,
    private activateRoute: ActivatedRoute,
    public _dialog: MatDialog,
    private _messages: MessagesHelper,
    private _seguridad: SeguridadService,
    private _translate: TranslateService,
    public _file: SpartanFileService,
    public dialogo: MatDialog,
    private excelService: ExcelService,
    private _user: SpartanUserService,
    private _SpartanService: SpartanService,
    private localStorageHelper: LocalStorageHelper,
    private route: Router,
    private printHelper: PrintHelper,
    renderer: Renderer2,
  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

    const User = this.localStorageHelper.getLoggedUserInfo();
    this.UserId = User.UserId
    this.RoleId = User.RoleId

    this.subscriber = route.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe((event) => {
      this.activateRoute.paramMap.subscribe(
        params => {
          this.id = params.get('id');
        });
      this.localStorageHelper.setItemToLocalStorage('Phase', this.id);
      this.Phase = this.id
      this.rulesBeforeCreationList();
      this.dataSource = new Solicitud_de_Compras_GeneralesDataSource(
        this._Solicitud_de_Compras_GeneralesService, this._file, this.id
      );
      this.init();
    });
  }

  ngOnInit() {
    // this.rulesBeforeCreationList();
    // this.dataSource = new Solicitud_de_Compras_GeneralesDataSource(
    //   this._Solicitud_de_Compras_GeneralesService, this._file,this.id
    // );
    // this.init();

    this._seguridad.permisos(AppConstants.Permisos.Solicitud_de_Compras_Generales).subscribe((response) => {
      this.permisos = response;
    });


  }

  ngOnDestroy() {
    this.subscriber?.unsubscribe();
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
    this.listConfig.filter.No_de_Solicitud = "";
    this.listConfig.filter.Fecha_de_Registro = undefined;
    this.listConfig.filter.Hora_de_Registro = "";
    this.listConfig.filter.Usuario_que_Registra = "";
    this.listConfig.filter.Razon_de_la_Compra = "";
    this.listConfig.filter.Proveedor = "";
    this.listConfig.filter.No_de_Vuelo = "";
    this.listConfig.filter.Tramo = "";
    this.listConfig.filter.Numero_de_O_S = "";
    this.listConfig.filter.Numero_de_O_T = "";
    //this.listConfig.filter.Departamento = "";
    this.listConfig.filter.Tipo = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.Motivo_de_Cancelacion = "";
    //this.listConfig.filter.Enviar_Solicitud = undefined;
    this.listConfig.filter.Estatus_de_Solicitud = "";
    this.listConfig.filter.Fecha_de_Autorizacion = undefined;
    this.listConfig.filter.Hora_de_Autorizacion = "";
    this.listConfig.filter.Autorizado_por = "";
    this.listConfig.filter.Resultado = "";
    this.listConfig.filter.Observacion = "";

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

    //INICIA - BRID:3711 - Ocultar columnas. - Autor: Lizeth Villa - Actualización: 6/1/2021 9:49:05 AM
    //this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Departamento")
    //this.brf.ShowFieldofMultirenglon(this.displayedColumns, "Enviar_Solicitud")

    //TERMINA - BRID:3711

    //rulesAfterCreationList_ExecuteBusinessRulesEnd

  }

  rulesBeforeCreationList() {
    //rulesBeforeCreationList_ExecuteBusinessRulesInit

    const Phase = this.localStorageHelper.getItemFromLocalStorage('Phase');

    //INICIA - BRID:3208 - Mostrar listado solo de solicitudes que solicite el usuario de compras. - Autor: Lizeth Villa - Actualización: 5/26/2021 12:03:53 PM
    if (this.RoleId == 42) {
      this.brf.SetFilteronList(this.listConfig, "Solicitud_de_Servicios_para_Operaciones.usuario_que_registra = (select spartan_user.id_user from spartan_user where spartan_user.id_user = GLOBAL[USERID] and spartan_user.role = 42)	");
    }
    //TERMINA - BRID:3208


    //INICIA - BRID:3212 - Mostrar listado solo de solicitudes que solicite el usuario - Autor: Lizeth Villa - Actualización: 5/31/2021 9:46:08 AM
    if (this.brf.EvaluaQuery(`if ( ${this.RoleId}= 1 or  ${this.RoleId}= 9 or  ${this.RoleId}= 42 ) begin select 1 end `, 1, 'ABC123') != this.brf.TryParseInt('1', '1')) {
      this.brf.SetFilteronList(this.listConfig, `Solicitud_de_Compras_Generales.usuario_que_registra = ${this.UserId}`);
    }
    //TERMINA - BRID:3212


    //INICIA - BRID:7230 - WF:7 Rule List - Phase: 1 (Solicitar Compra) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.brf.EvaluaQuery(`Select '${Phase}'`, 1, 'ABC123') == this.brf.EvaluaQuery("Select '1'", 1, 'ABC123')) {
      this.brf.SetFilteronList(this.listConfig, " Solicitud_de_Compras_Generales.No_de_Solicitud in (select No_de_Solicitud from Solicitud_de_Compras_Generales WHERE (GLOBAL[USERROLEID] NOT IN (42) AND Usuario_que_Registra IN (SELECT Usuario_que_Registra from Solicitud_de_Compras_Generales s inner join dbo.Spartan_User U on s.Usuario_que_Registra = U.Id_User and s.Usuario_que_Registra = GLOBAL[USERID])) OR (GLOBAL[USERROLEID] IN (42, 9))) and Estatus_de_Solicitud IN (5) ");
    }
    //TERMINA - BRID:7230


    //INICIA - BRID:7232 - WF:7 Rule List - Phase: 2 (Por Autorizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.brf.EvaluaQuery(`Select '${Phase}'`, 1, 'ABC123') == this.brf.EvaluaQuery("Select '2'", 1, 'ABC123')) {
      this.brf.SetFilteronList(this.listConfig, "Solicitud_de_Compras_Generales.No_de_Solicitud  in (select No_de_Solicitud from Solicitud_de_Compras_Generales  WHERE (GLOBAL[USERROLEID]  NOT IN (42,9)  AND Usuario_que_Registra IN (SELECT Usuario_que_Registra from Solicitud_de_Compras_Generales s  where s.Usuario_que_Registra =GLOBAL[USERID]) or autorizado_por IN (SELECT autorizado_por from Solicitud_de_Compras_Generales s  where s.autorizado_por =GLOBAL[USERID])) OR (GLOBAL[USERROLEID]  IN (42,9)))  and Estatus_de_Solicitud = 2  ");
    }
    //TERMINA - BRID:7232


    //INICIA - BRID:7234 - WF:7 Rule List - Phase: 3 (Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.brf.EvaluaQuery(`Select '${Phase}'`, 1, 'ABC123') == this.brf.EvaluaQuery("Select '3'", 1, 'ABC123')) {
      this.brf.SetFilteronList(this.listConfig, "	Solicitud_de_Compras_Generales.No_de_Solicitud in (select No_de_Solicitud from Solicitud_de_Compras_Generales WHERE (GLOBAL[USERROLEID] NOT IN (42, 9) AND Usuario_que_Registra IN (SELECT Usuario_que_Registra from Solicitud_de_Compras_Generales s inner join dbo.Spartan_User U on s.Usuario_que_Registra = U.Id_User and s.Usuario_que_Registra = GLOBAL[USERID])) OR (GLOBAL[USERROLEID] IN (42, 9))) and Solicitud_de_Compras_Generales.Estatus_de_Solicitud = 3 ");
    }
    //TERMINA - BRID:7234


    //INICIA - BRID:7236 - WF:7 Rule List - Phase: 4 (No Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.brf.EvaluaQuery(`Select '${Phase}'`, 1, 'ABC123') == this.brf.EvaluaQuery("Select '4'", 1, 'ABC123')) {
      this.brf.SetFilteronList(this.listConfig, "	Solicitud_de_Compras_Generales.No_de_Solicitud in (select No_de_Solicitud from Solicitud_de_Compras_Generales WHERE (GLOBAL[USERROLEID] NOT IN (42, 9) AND Usuario_que_Registra IN (SELECT Usuario_que_Registra from Solicitud_de_Compras_Generales s inner join dbo.Spartan_User U on s.Usuario_que_Registra = U.Id_User and s.Usuario_que_Registra = GLOBAL[USERID])) OR (GLOBAL[USERROLEID] IN (42, 9))) and Solicitud_de_Compras_Generales.Estatus_de_Solicitud = 4 ");
    }
    //TERMINA - BRID:7236

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

  remove(row: Solicitud_de_Compras_Generales) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Solicitud_de_Compras_GeneralesService
          .delete(+row.No_de_Solicitud)
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

  async ActionPrint(dataRow: Solicitud_de_Compras_Generales) {

    this.dialogo.open(DialogPrintFormatComponent, { data: dataRow })
      .afterClosed()
      .subscribe(async (formatSelected: any) => {
        console.log(formatSelected)
        if (formatSelected.length > 0) {
          this.dataSource.loadingSubject.next(true);
          formatSelected.forEach(async element => {
            await this.printHelper.PrintFormats(element.Format, dataRow.No_de_Solicitud, element.Name).then(() => {
              setTimeout(() => {
                this.dataSource.loadingSubject.next(false);
              }, 5000);
            })
          });
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
      'No. de Solicitud'
      , 'Fecha de Registro'
      , 'Hora de Registro'
      , 'Usuario que Registra'
      , 'Razón de la Compra'
      , 'Proveedor '
      , 'No. de Vuelo'
      , 'Tramo'
      , 'Número de O/S'
      , 'Número de O/T'
      //, 'Departamento'
      , 'Tipo '
      , 'Observaciones'
      , 'Motivo de Cancelación'
      //, 'Enviar Solicitud '
      , 'Estatus de Solicitud'
      , 'Fecha de Autorizacion'
      , 'Hora de Autorizacion'
      , 'Usuario que Autoriza'
      , 'Resultado'
      , 'Observación'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
        x.No_de_Solicitud
        , x.Fecha_de_Registro
        , x.Hora_de_Registro
        , x.Usuario_que_Registra_Spartan_User.Name
        , x.Razon_de_la_Compra
        , x.Proveedor_Creacion_de_Proveedores.Razon_social
        , x.No_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
        , x.Tramo_Aeropuertos.ICAO_IATA
        , x.Numero_de_O_S_Orden_de_servicio.Folio_OS
        , x.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden
        //, x.Departamento_Departamento.Nombre
        , x.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion
        , x.Observaciones
        , x.Motivo_de_Cancelacion
        //, x.Enviar_Solicitud
        , x.Estatus_de_Solicitud_Estatus_de_Solicitud_de_Compras_Generales.Descripcion
        , x.Fecha_de_Autorizacion
        , x.Hora_de_Autorizacion
        , x.Autorizado_por_Spartan_User.Name
        , x.Resultado_Autorizacion.Resultado

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
    pdfMake.createPdf(pdfDefinition).download('Solicitud_de_Compras_Generales.pdf');
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
          this._Solicitud_de_Compras_GeneralesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_Compras_Generaless;
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
          this._Solicitud_de_Compras_GeneralesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_Compras_Generaless;
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
        'No. de Solicitud ': fields.No_de_Solicitud,
        'Fecha de Registro ': fields.Fecha_de_Registro ? momentJS(fields.Fecha_de_Registro).format('DD/MM/YYYY') : '',
        'Hora de Registro ': fields.Hora_de_Registro,
        'Usuario que Registra ': fields.Usuario_que_Registra_Spartan_User.Name,
        'Razón de la Compra ': fields.Razon_de_la_Compra,
        'Proveedor  ': fields.Proveedor_Creacion_de_Proveedores.Razon_social,
        'No. de Vuelo ': fields.No_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Tramo ': fields.Tramo_Aeropuertos.ICAO_IATA,
        'Número de O/S ': fields.Numero_de_O_S_Orden_de_servicio.Folio_OS,
        'Número de O/T ': fields.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden,
        //'Departamento ': fields.Departamento_Departamento.Nombre,
        'Tipo  ': fields.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion,
        'Observaciones ': fields.Observaciones,
        'Motivo de Cancelación ': fields.Motivo_de_Cancelacion,
        //'Enviar_Solicitud ': fields.Enviar_Solicitud ? 'SI' : 'NO',
        'Estatus de Solicitud ': fields.Estatus_de_Solicitud_Estatus_de_Solicitud_de_Compras_Generales.Descripcion,
        'Fecha de Autorizacion ': fields.Fecha_de_Autorizacion ? momentJS(fields.Fecha_de_Autorizacion).format('DD/MM/YYYY') : '',
        'Hora de Autorizacion ': fields.Hora_de_Autorizacion,
        'Usuario que Autoriza 1': fields.Autorizado_por_Spartan_User.Name,
        'Resultado ': fields.Resultado_Autorizacion.Resultado,
        'Observación ': fields.Observacion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Solicitud_de_Compras_Generales  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      No_de_Solicitud: x.No_de_Solicitud,
      Fecha_de_Registro: x.Fecha_de_Registro,
      Hora_de_Registro: x.Hora_de_Registro,
      Usuario_que_Registra: x.Usuario_que_Registra_Spartan_User.Name,
      Razon_de_la_Compra: x.Razon_de_la_Compra,
      Proveedor: x.Proveedor_Creacion_de_Proveedores.Razon_social,
      No_de_Vuelo: x.No_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Tramo: x.Tramo_Aeropuertos.ICAO_IATA,
      Numero_de_O_S: x.Numero_de_O_S_Orden_de_servicio.Folio_OS,
      Numero_de_O_T: x.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden,
      //Departamento: x.Departamento_Departamento.Nombre,
      Tipo: x.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion,
      Observaciones: x.Observaciones,
      Motivo_de_Cancelacion: x.Motivo_de_Cancelacion,
      //Enviar_Solicitud: x.Enviar_Solicitud,
      Estatus_de_Solicitud: x.Estatus_de_Solicitud_Estatus_de_Solicitud_de_Compras_Generales.Descripcion,
      Fecha_de_Autorizacion: x.Fecha_de_Autorizacion,
      Hora_de_Autorizacion: x.Hora_de_Autorizacion,
      Autorizado_por: x.Autorizado_por_Spartan_User.Name,
      Resultado: x.Resultado_Autorizacion.Resultado,
      Observacion: x.Observacion,

    }));

    this.excelService.exportToCsv(result, 'Solicitud_de_Compras_Generales', ['No_de_Solicitud', 'Fecha_de_Registro', 'Hora_de_Registro', 'Usuario_que_Registra', 'Razon_de_la_Compra', 'Proveedor', 'No_de_Vuelo', 'Tramo', 'Numero_de_O_S', 'Numero_de_O_T'
      , 'Tipo', 'Observaciones', 'Motivo_de_Cancelacion', 'Estatus_de_Solicitud', 'Fecha_de_Autorizacion', 'Hora_de_Autorizacion', 'Autorizado_por', 'Resultado', 'Observacion']);
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
    template += '          <th>No. de Solicitud</th>';
    template += '          <th>Fecha de Registro</th>';
    template += '          <th>Hora de Registro</th>';
    template += '          <th>Usuario que Registra</th>';
    template += '          <th>Razón de la Compra</th>';
    template += '          <th>Proveedor </th>';
    template += '          <th>No. de Vuelo</th>';
    template += '          <th>Tramo</th>';
    template += '          <th>Número de O/S</th>';
    template += '          <th>Número de O/T</th>';
    //template += '          <th>Departamento</th>';
    template += '          <th>Tipo </th>';
    template += '          <th>Observaciones</th>';
    template += '          <th>Motivo de Cancelación</th>';
    //template += '          <th>Enviar Solicitud </th>';
    template += '          <th>Estatus de Solicitud</th>';
    template += '          <th>Fecha de Autorizacion</th>';
    template += '          <th>Hora de Autorizacion</th>';
    template += '          <th>Usuario que Autoriza</th>';
    template += '          <th>Resultado</th>';
    template += '          <th>Observación</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.No_de_Solicitud + '</td>';
      template += '          <td>' + element.Fecha_de_Registro + '</td>';
      template += '          <td>' + element.Hora_de_Registro + '</td>';
      template += '          <td>' + element.Usuario_que_Registra_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Razon_de_la_Compra + '</td>';
      template += '          <td>' + element.Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.No_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Tramo_Aeropuertos.ICAO_IATA + '</td>';
      template += '          <td>' + element.Numero_de_O_S_Orden_de_servicio.Folio_OS + '</td>';
      template += '          <td>' + element.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden + '</td>';
      //template += '          <td>' + element.Departamento_Departamento.Nombre + '</td>';
      template += '          <td>' + element.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.Motivo_de_Cancelacion + '</td>';
      //template += '          <td>' + element.Enviar_Solicitud + '</td>';
      template += '          <td>' + element.Estatus_de_Solicitud_Estatus_de_Solicitud_de_Compras_Generales.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_de_Autorizacion + '</td>';
      template += '          <td>' + element.Hora_de_Autorizacion + '</td>';
      template += '          <td>' + element.Autorizado_por_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Resultado_Autorizacion.Resultado + '</td>';
      template += '          <td>' + element.Observacion + '</td>';

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
    template += '\t No. de Solicitud';
    template += '\t Fecha de Registro';
    template += '\t Hora de Registro';
    template += '\t Usuario que Registra';
    template += '\t Razón de la Compra';
    template += '\t Proveedor ';
    template += '\t No. de Vuelo';
    template += '\t Tramo';
    template += '\t Número de O/S';
    template += '\t Número de O/T';
    //template += '\t Departamento';
    template += '\t Tipo ';
    template += '\t Observaciones';
    template += '\t Motivo de Cancelación';
    //template += '\t Enviar Solicitud ';
    template += '\t Estatus de Solicitud';
    template += '\t Fecha de Autorizacion';
    template += '\t Hora de Autorizacion';
    template += '\t Usuario que Autoriza';
    template += '\t Resultado';
    template += '\t Observación';

    template += '\n';

    data.forEach(element => {
      template += '\t ' + element.No_de_Solicitud;
      template += '\t ' + element.Fecha_de_Registro;
      template += '\t ' + element.Hora_de_Registro;
      template += '\t ' + element.Usuario_que_Registra_Spartan_User.Name;
      template += '\t ' + element.Razon_de_la_Compra;
      template += '\t ' + element.Proveedor_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.No_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
      template += '\t ' + element.Tramo_Aeropuertos.ICAO_IATA;
      template += '\t ' + element.Numero_de_O_S_Orden_de_servicio.Folio_OS;
      template += '\t ' + element.Numero_de_O_T_Orden_de_Trabajo.numero_de_orden;
      //template += '\t ' + element.Departamento_Departamento.Nombre;
      template += '\t ' + element.Tipo_Tipo_de_Solicitud_de_Compras.Descripcion;
      template += '\t ' + element.Observaciones;
      template += '\t ' + element.Motivo_de_Cancelacion;
      //template += '\t ' + element.Enviar_Solicitud;
      template += '\t ' + element.Estatus_de_Solicitud_Estatus_de_Solicitud_de_Compras_Generales.Descripcion;
      template += '\t ' + element.Fecha_de_Autorizacion;
      template += '\t ' + element.Hora_de_Autorizacion;
      template += '\t ' + element.Autorizado_por_Spartan_User.Name;
      template += '\t ' + element.Resultado_Autorizacion.Resultado;
      template += '\t ' + element.Observacion;

      template += '\n';
    });

    return template;
  }



}

export class Solicitud_de_Compras_GeneralesDataSource implements DataSource<Solicitud_de_Compras_Generales>
{
  private subject = new BehaviorSubject<Solicitud_de_Compras_Generales[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Solicitud_de_Compras_GeneralesService,
    private _file: SpartanFileService,
    private id: any) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Solicitud_de_Compras_Generales[]> {
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
          if (column === 'No_de_Solicitud') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Solicitud_de_Compras_Generaless.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_Compras_Generaless);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";

    switch (+this.id) {
      case 1:
        condition += " and Solicitud_de_Compras_Generales.Estatus_de_Solicitud in (1,5)"
        break;
      case 2:
        condition += " and Solicitud_de_Compras_Generales.Estatus_de_Solicitud = 2"
        break;
      case 3:
        condition += " and Solicitud_de_Compras_Generales.Estatus_de_Solicitud = 3"
        break;
      case 4:
        condition += " and Solicitud_de_Compras_Generales.Estatus_de_Solicitud = 4"
        break;
    }
    if (data.filter.No_de_Solicitud != "")
      condition += " and Solicitud_de_Compras_Generales.No_de_Solicitud = " + data.filter.No_de_Solicitud;
    if (data.filter.Fecha_de_Registro)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_Compras_Generales.Fecha_de_Registro, 102)  = '" + moment(data.filter.Fecha_de_Registro).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Registro != "")
      condition += " and Solicitud_de_Compras_Generales.Hora_de_Registro = '" + data.filter.Hora_de_Registro + "'";
    if (data.filter.Usuario_que_Registra != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Registra + "%' ";
    if (data.filter.Razon_de_la_Compra != "")
      condition += " and Solicitud_de_Compras_Generales.Razon_de_la_Compra like '%" + data.filter.Razon_de_la_Compra + "%' ";
    if (data.filter.Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor + "%' ";
    if (data.filter.No_de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.No_de_Vuelo + "%' ";
    if (data.filter.Tramo != "")
      condition += " and Aeropuertos.ICAO_IATA like '%" + data.filter.Tramo + "%' ";
    if (data.filter.Numero_de_O_S != "")
      condition += " and Orden_de_servicio.Folio_OS like '%" + data.filter.Numero_de_O_S + "%' ";
    if (data.filter.Numero_de_O_T != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.Numero_de_O_T + "%' ";
    /* if (data.filter.Departamento != "")
      condition += " and Departamento.Nombre like '%" + data.filter.Departamento + "%' "; */
    if (data.filter.Tipo != "")
      condition += " and Tipo_de_Solicitud_de_Compras.Descripcion like '%" + data.filter.Tipo + "%' ";
    if (data.filter.Observaciones != "")
      condition += " and Solicitud_de_Compras_Generales.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.Motivo_de_Cancelacion != "")
      condition += " and Solicitud_de_Compras_Generales.Motivo_de_Cancelacion like '%" + data.filter.Motivo_de_Cancelacion + "%' ";
    /* if (data.filter.Enviar_Solicitud && data.filter.Enviar_Solicitud != "2") {
      if (data.filter.Enviar_Solicitud == "0" || data.filter.Enviar_Solicitud == "") {
        condition += " and (Solicitud_de_Compras_Generales.Enviar_Solicitud = 0 or Solicitud_de_Compras_Generales.Enviar_Solicitud is null)";
      } else {
        condition += " and Solicitud_de_Compras_Generales.Enviar_Solicitud = 1";
      }
    } */
    if (data.filter.Estatus_de_Solicitud != "")
      condition += " and Estatus_de_Solicitud_de_Compras_Generales.Descripcion like '%" + data.filter.Estatus_de_Solicitud + "%' ";
    if (data.filter.Fecha_de_Autorizacion)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_Compras_Generales.Fecha_de_Autorizacion, 102)  = '" + moment(data.filter.Fecha_de_Autorizacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Autorizacion != "")
      condition += " and Solicitud_de_Compras_Generales.Hora_de_Autorizacion = '" + data.filter.Hora_de_Autorizacion + "'";
    if (data.filter.Autorizado_por != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Autorizado_por + "%' ";
    if (data.filter.Resultado != "")
      condition += " and Autorizacion.Resultado like '%" + data.filter.Resultado + "%' ";
    if (data.filter.Observacion != "")
      condition += " and Solicitud_de_Compras_Generales.Observacion like '%" + data.filter.Observacion + "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "No_de_Solicitud":
        sort = " Solicitud_de_Compras_Generales.No_de_Solicitud " + data.sortDirecction;
        break;
      case "Fecha_de_Registro":
        sort = " Solicitud_de_Compras_Generales.Fecha_de_Registro " + data.sortDirecction;
        break;
      case "Hora_de_Registro":
        sort = " Solicitud_de_Compras_Generales.Hora_de_Registro " + data.sortDirecction;
        break;
      case "Usuario_que_Registra":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Razon_de_la_Compra":
        sort = " Solicitud_de_Compras_Generales.Razon_de_la_Compra " + data.sortDirecction;
        break;
      case "Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "No_de_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Tramo":
        sort = " Aeropuertos.ICAO_IATA " + data.sortDirecction;
        break;
      case "Numero_de_O_S":
        sort = " Orden_de_servicio.Folio_OS " + data.sortDirecction;
        break;
      case "Numero_de_O_T":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      /* case "Departamento":
        sort = " Departamento.Nombre " + data.sortDirecction;
        break; */
      case "Tipo":
        sort = " Tipo_de_Solicitud_de_Compras.Descripcion " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Solicitud_de_Compras_Generales.Observaciones " + data.sortDirecction;
        break;
      case "Motivo_de_Cancelacion":
        sort = " Solicitud_de_Compras_Generales.Motivo_de_Cancelacion " + data.sortDirecction;
        break;
      /* case "Enviar_Solicitud":
        sort = " Solicitud_de_Compras_Generales.Enviar_Solicitud " + data.sortDirecction;
        break; */
      case "Estatus_de_Solicitud":
        sort = " Estatus_de_Solicitud_de_Compras_Generales.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_de_Autorizacion":
        sort = " Solicitud_de_Compras_Generales.Fecha_de_Autorizacion " + data.sortDirecction;
        break;
      case "Hora_de_Autorizacion":
        sort = " Solicitud_de_Compras_Generales.Hora_de_Autorizacion " + data.sortDirecction;
        break;
      case "Autorizado_por":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Resultado":
        sort = " Autorizacion.Resultado " + data.sortDirecction;
        break;
      case "Observacion":
        sort = " Solicitud_de_Compras_Generales.Observacion " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromNo_de_Solicitud != 'undefined' && data.filterAdvanced.fromNo_de_Solicitud)
      || (typeof data.filterAdvanced.toNo_de_Solicitud != 'undefined' && data.filterAdvanced.toNo_de_Solicitud)) {
      if (typeof data.filterAdvanced.fromNo_de_Solicitud != 'undefined' && data.filterAdvanced.fromNo_de_Solicitud)
        condition += " AND Solicitud_de_Compras_Generales.No_de_Solicitud >= " + data.filterAdvanced.fromNo_de_Solicitud;

      if (typeof data.filterAdvanced.toNo_de_Solicitud != 'undefined' && data.filterAdvanced.toNo_de_Solicitud)
        condition += " AND Solicitud_de_Compras_Generales.No_de_Solicitud <= " + data.filterAdvanced.toNo_de_Solicitud;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
      || (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)) {
      if (typeof data.filterAdvanced.fromFecha_de_Registro != 'undefined' && data.filterAdvanced.fromFecha_de_Registro)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Compras_Generales.Fecha_de_Registro, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Registro).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Registro != 'undefined' && data.filterAdvanced.toFecha_de_Registro)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Compras_Generales.Fecha_de_Registro, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Registro).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
      || (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)) {
      if (typeof data.filterAdvanced.fromHora_de_Registro != 'undefined' && data.filterAdvanced.fromHora_de_Registro)
        condition += " and Solicitud_de_Compras_Generales.Hora_de_Registro >= '" + data.filterAdvanced.fromHora_de_Registro + "'";

      if (typeof data.filterAdvanced.toHora_de_Registro != 'undefined' && data.filterAdvanced.toHora_de_Registro)
        condition += " and Solicitud_de_Compras_Generales.Hora_de_Registro <= '" + data.filterAdvanced.toHora_de_Registro + "'";
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
      condition += " AND Solicitud_de_Compras_Generales.Usuario_que_Registra In (" + Usuario_que_Registrads + ")";
    }
    switch (data.filterAdvanced.Razon_de_la_CompraFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Compras_Generales.Razon_de_la_Compra LIKE '" + data.filterAdvanced.Razon_de_la_Compra + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Compras_Generales.Razon_de_la_Compra LIKE '%" + data.filterAdvanced.Razon_de_la_Compra + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Compras_Generales.Razon_de_la_Compra LIKE '%" + data.filterAdvanced.Razon_de_la_Compra + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Compras_Generales.Razon_de_la_Compra = '" + data.filterAdvanced.Razon_de_la_Compra + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Proveedor != 'undefined' && data.filterAdvanced.Proveedor)) {
      switch (data.filterAdvanced.ProveedorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.Proveedor + "'";
          break;
      }
    } else if (data.filterAdvanced.ProveedorMultiple != null && data.filterAdvanced.ProveedorMultiple.length > 0) {
      var Proveedords = data.filterAdvanced.ProveedorMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.Proveedor In (" + Proveedords + ")";
    }
    if ((typeof data.filterAdvanced.No_de_Vuelo != 'undefined' && data.filterAdvanced.No_de_Vuelo)) {
      switch (data.filterAdvanced.No_de_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.No_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No_de_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.No_de_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.No_de_VueloMultiple != null && data.filterAdvanced.No_de_VueloMultiple.length > 0) {
      var No_de_Vuelods = data.filterAdvanced.No_de_VueloMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.No_de_Vuelo In (" + No_de_Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Tramo != 'undefined' && data.filterAdvanced.Tramo)) {
      switch (data.filterAdvanced.TramoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.ICAO_IATA LIKE '" + data.filterAdvanced.Tramo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.ICAO_IATA LIKE '%" + data.filterAdvanced.Tramo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.ICAO_IATA LIKE '%" + data.filterAdvanced.Tramo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.ICAO_IATA = '" + data.filterAdvanced.Tramo + "'";
          break;
      }
    } else if (data.filterAdvanced.TramoMultiple != null && data.filterAdvanced.TramoMultiple.length > 0) {
      var Tramods = data.filterAdvanced.TramoMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.Tramo In (" + Tramods + ")";
    }
    if ((typeof data.filterAdvanced.Numero_de_O_S != 'undefined' && data.filterAdvanced.Numero_de_O_S)) {
      switch (data.filterAdvanced.Numero_de_O_SFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '" + data.filterAdvanced.Numero_de_O_S + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '%" + data.filterAdvanced.Numero_de_O_S + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '%" + data.filterAdvanced.Numero_de_O_S + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_servicio.Folio_OS = '" + data.filterAdvanced.Numero_de_O_S + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_O_SMultiple != null && data.filterAdvanced.Numero_de_O_SMultiple.length > 0) {
      var Numero_de_O_Sds = data.filterAdvanced.Numero_de_O_SMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.Numero_de_O_S In (" + Numero_de_O_Sds + ")";
    }
    if ((typeof data.filterAdvanced.Numero_de_O_T != 'undefined' && data.filterAdvanced.Numero_de_O_T)) {
      switch (data.filterAdvanced.Numero_de_O_TFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.Numero_de_O_T + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Numero_de_O_T + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.Numero_de_O_T + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.Numero_de_O_T + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_O_TMultiple != null && data.filterAdvanced.Numero_de_O_TMultiple.length > 0) {
      var Numero_de_O_Tds = data.filterAdvanced.Numero_de_O_TMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.Numero_de_O_T In (" + Numero_de_O_Tds + ")";
    }

    /* if ((typeof data.filterAdvanced.Departamento != 'undefined' && data.filterAdvanced.Departamento)) {
      switch (data.filterAdvanced.DepartamentoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Departamento.Nombre LIKE '" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Departamento.Nombre = '" + data.filterAdvanced.Departamento + "'";
          break;
      }
    } else if (data.filterAdvanced.DepartamentoMultiple != null && data.filterAdvanced.DepartamentoMultiple.length > 0) {
      var Departamentods = data.filterAdvanced.DepartamentoMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.Departamento In (" + Departamentods + ")";
    } */

    if ((typeof data.filterAdvanced.Tipo != 'undefined' && data.filterAdvanced.Tipo)) {
      switch (data.filterAdvanced.TipoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Solicitud_de_Compras.Descripcion LIKE '" + data.filterAdvanced.Tipo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Solicitud_de_Compras.Descripcion LIKE '%" + data.filterAdvanced.Tipo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Solicitud_de_Compras.Descripcion LIKE '%" + data.filterAdvanced.Tipo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Solicitud_de_Compras.Descripcion = '" + data.filterAdvanced.Tipo + "'";
          break;
      }
    } else if (data.filterAdvanced.TipoMultiple != null && data.filterAdvanced.TipoMultiple.length > 0) {
      var Tipods = data.filterAdvanced.TipoMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.Tipo In (" + Tipods + ")";
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Compras_Generales.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Compras_Generales.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Compras_Generales.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Compras_Generales.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    switch (data.filterAdvanced.Motivo_de_CancelacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Compras_Generales.Motivo_de_Cancelacion LIKE '" + data.filterAdvanced.Motivo_de_Cancelacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Compras_Generales.Motivo_de_Cancelacion LIKE '%" + data.filterAdvanced.Motivo_de_Cancelacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Compras_Generales.Motivo_de_Cancelacion LIKE '%" + data.filterAdvanced.Motivo_de_Cancelacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Compras_Generales.Motivo_de_Cancelacion = '" + data.filterAdvanced.Motivo_de_Cancelacion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus_de_Solicitud != 'undefined' && data.filterAdvanced.Estatus_de_Solicitud)) {
      switch (data.filterAdvanced.Estatus_de_SolicitudFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Solicitud_de_Compras_Generales.Descripcion LIKE '" + data.filterAdvanced.Estatus_de_Solicitud + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Solicitud_de_Compras_Generales.Descripcion LIKE '%" + data.filterAdvanced.Estatus_de_Solicitud + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Solicitud_de_Compras_Generales.Descripcion LIKE '%" + data.filterAdvanced.Estatus_de_Solicitud + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Solicitud_de_Compras_Generales.Descripcion = '" + data.filterAdvanced.Estatus_de_Solicitud + "'";
          break;
      }
    } else if (data.filterAdvanced.Estatus_de_SolicitudMultiple != null && data.filterAdvanced.Estatus_de_SolicitudMultiple.length > 0) {
      var Estatus_de_Solicitudds = data.filterAdvanced.Estatus_de_SolicitudMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.Estatus_de_Solicitud In (" + Estatus_de_Solicitudds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Autorizacion != 'undefined' && data.filterAdvanced.fromFecha_de_Autorizacion)
      || (typeof data.filterAdvanced.toFecha_de_Autorizacion != 'undefined' && data.filterAdvanced.toFecha_de_Autorizacion)) {
      if (typeof data.filterAdvanced.fromFecha_de_Autorizacion != 'undefined' && data.filterAdvanced.fromFecha_de_Autorizacion)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Compras_Generales.Fecha_de_Autorizacion, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Autorizacion).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Autorizacion != 'undefined' && data.filterAdvanced.toFecha_de_Autorizacion)
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_Compras_Generales.Fecha_de_Autorizacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Autorizacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Autorizacion != 'undefined' && data.filterAdvanced.fromHora_de_Autorizacion)
      || (typeof data.filterAdvanced.toHora_de_Autorizacion != 'undefined' && data.filterAdvanced.toHora_de_Autorizacion)) {
      if (typeof data.filterAdvanced.fromHora_de_Autorizacion != 'undefined' && data.filterAdvanced.fromHora_de_Autorizacion)
        condition += " and Solicitud_de_Compras_Generales.Hora_de_Autorizacion >= '" + data.filterAdvanced.fromHora_de_Autorizacion + "'";

      if (typeof data.filterAdvanced.toHora_de_Autorizacion != 'undefined' && data.filterAdvanced.toHora_de_Autorizacion)
        condition += " and Solicitud_de_Compras_Generales.Hora_de_Autorizacion <= '" + data.filterAdvanced.toHora_de_Autorizacion + "'";
    }
    if ((typeof data.filterAdvanced.Autorizado_por != 'undefined' && data.filterAdvanced.Autorizado_por)) {
      switch (data.filterAdvanced.Autorizado_porFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Autorizado_por + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Autorizado_por + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Autorizado_por + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Autorizado_por + "'";
          break;
      }
    } else if (data.filterAdvanced.Autorizado_porMultiple != null && data.filterAdvanced.Autorizado_porMultiple.length > 0) {
      var Autorizado_pords = data.filterAdvanced.Autorizado_porMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.Autorizado_por In (" + Autorizado_pords + ")";
    }
    if ((typeof data.filterAdvanced.Resultado != 'undefined' && data.filterAdvanced.Resultado)) {
      switch (data.filterAdvanced.ResultadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Autorizacion.Resultado LIKE '" + data.filterAdvanced.Resultado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Autorizacion.Resultado LIKE '%" + data.filterAdvanced.Resultado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Autorizacion.Resultado LIKE '%" + data.filterAdvanced.Resultado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Autorizacion.Resultado = '" + data.filterAdvanced.Resultado + "'";
          break;
      }
    } else if (data.filterAdvanced.ResultadoMultiple != null && data.filterAdvanced.ResultadoMultiple.length > 0) {
      var Resultadods = data.filterAdvanced.ResultadoMultiple.join(",");
      condition += " AND Solicitud_de_Compras_Generales.Resultado In (" + Resultadods + ")";
    }
    switch (data.filterAdvanced.ObservacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_Compras_Generales.Observacion LIKE '" + data.filterAdvanced.Observacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_Compras_Generales.Observacion LIKE '%" + data.filterAdvanced.Observacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_Compras_Generales.Observacion LIKE '%" + data.filterAdvanced.Observacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_Compras_Generales.Observacion = '" + data.filterAdvanced.Observacion + "'";
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
          if (column === 'No_de_Solicitud') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Solicitud_de_Compras_Generaless.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_Compras_Generaless);
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
