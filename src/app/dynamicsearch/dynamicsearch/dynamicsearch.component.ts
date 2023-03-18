import { Component, OnInit, Renderer2, ViewChild, Output, EventEmitter, Input, ElementRef, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { DynamicSearchService } from '../../api-services/dynamicsearch.service';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';
import { NgxSpinnerService } from 'ngx-spinner';
import * as momentJS from 'moment';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { TranslateService } from '@ngx-translate/core';
import { StorageKeys } from 'src/app/app-constants';
import { MatTable, MatTableDataSource } from '@angular/material/table';

import { q, q2 } from "src/app/models/business-rules/business-rule-query.model";
import { Spartan_Record_Detail_ManagementService } from 'src/app/api-services/Spartan_Record_Detail_Management.service';
import { ModelResultsFields, ModelResultsValueFields } from 'src/app/dynamicsearch/dynamic_search_model';
import { MatPaginator, MatPaginatorIntl, PageEvent } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { Spartan_RDM_Operations_DetailService } from 'src/app/api-services/Spartan_RDM_Operations_Detail.service';
import { ResultGeneralDetail } from 'src/app/dynamicsearch/dynamic_search_model';
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { environment as env } from 'src/environments/environment';
import { SpartanObjectService } from '../../api-services/spartan-object.service';
import { MatDialog } from '@angular/material/dialog';

import { DialogPrintFormatComponent } from 'src/app/shared/views/dialogs/dialog-print-format/dialog-print-format.component';
import { HelperService } from 'src/app/api-services/helper.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as moment from "moment/moment";
import { ReportesService } from 'src/app/api-services/reportes.service';
import { base64ToArrayBuffer, saveByteArray } from 'src/app/functions/blob-function';
import { PdfCloudService } from 'src/app/api-services/pdf-cloud.service';
import { ModalRegistroDeVueloComponent } from 'src/app/views/Registro_de_vuelo/modal-Registro_de_vuelo/modal-Registro_de_vuelo.component';
import { FormatPrintEnum } from 'src/app/models/enums/formatPrint.enum';
import { element } from 'protractor';
import { ModalEjecucionDeVueloComponent } from 'src/app/views/Ejecucion_de_Vuelo/modal-ejecucion-de-vuelo/modal-ejecucion-de-vuelo.component';
import { MessagesHelper } from 'src/app/helpers/messages-helper';
import Swal from 'sweetalert2';
import { ModalComisariatoYNotasDeVueloComponent } from 'src/app/views/Comisariato_y_notas_de_vuelo/modal-comisariato-y-notas-de-vuelo/modal-comisariato-y-notas-de-vuelo.component';
import { ModalCoordinacionAvisosComponent } from 'src/app/views/Coordinacion_Avisos/modal-coordinacion-avisos/modal-coordinacion-avisos.component';
import { ModalCoordinacionHandlingComponent } from 'src/app/views/Coordinacion_Handling/modal-coordinacion-handling/modal-coordinacion-handling.component';
import { ModalCoordinacionPasajerosComponent } from 'src/app/views/Coordinacion_Pasajeros/modal-coordinacion-pasajeros/modal-coordinacion-pasajeros.component';
import { ModalCoordDeVueloDocumentacionComponent } from 'src/app/views/Coord__de_Vuelo__Documentacion/modal-coord-de-vuelo-documentacion/modal-coord-de-vuelo-documentacion.component';
import { ModalCoordDeVueloTripulacionComponent } from 'src/app/views/Coord__de_Vuelo__Tripulacion/modal-coord-de-vuelo-tripulacion/modal-coord-de-vuelo-tripulacion.component';
import { ModalGastosDeVueloComponent } from 'src/app/views/Gastos_de_Vuelo/modal-gastos-de-vuelo/modal-gastos-de-vuelo.component';
import { getDutchPaginatorEsMX } from 'src/app/shared/base-views/dutch-paginator-intl';
import { ModalReabrir_vueloComponent } from 'src/app/views/Reabrir_vuelo/modal-Reabrir_vuelo/modal-Reabrir_vuelo.component';

declare var $: any;

@Component({
  selector: 'app-dynamicsearch',
  templateUrl: './dynamicsearch.component.html',
  styleUrls: ['./dynamicsearch.component.sass'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorEsMX()}
  ],
  encapsulation: ViewEncapsulation.None,
})
//https://stackblitz.com/edit/angular-dynamic-tables?file=app%2Fapp.module.ts

export class DynamicSearchComponent implements OnInit {

  //#region Variables
  porCargar = false;
  brf: BusinessRulesFunctions;
  dataSource: MatTableDataSource<any>;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }

  WhereWF: String;
  _faseid?: number;
  management: any; // Recibe la data de
  wf: any;
  expanded = true;
  expandedSearch = true;
  firstSearch = false;
  WorkFlow: String = "";
  idTablero: any;
  filtro: String = '';
  dataTableJson: any;
  frm!: FormGroup;
  now = new Date();
  searchresult: any;
  parentCount = 0;
  timerStart: boolean = false;
  enterCalendar: boolean = false;
  row: any;
  pageEvent: PageEvent;

  displayedColumns = [
    //'Folio',
    'No. Solicitud',
    'No. Vuelo',
    'Empresa',
    'Salida',
    'Llegada',
    'Aeronave',
    'Estatus',
    'Cant. Pasajeros',
    'Avance Coord.',
  ];

  IdSelected: any;
  folioselected: any;
  tablaDerechaTitle: any;
  tablaDerecha: any;
  btnEditarRegistro = false;
  btnImprimirReporteCoordinacion = false;
  ImageSearchData = false;
  ImageSearchDataSRC = '';
  buttonsDetails = [];
  btnCancelarVuelo = false;
  btnNew = false;
  _VueloCerrado = false;
  _Numero_de_Vuelo = 0;
  selectedRowIndex: any;
  id: any;
  resultado: any;
  resultFinal: any = { Data: [], Details: [], Label: String, LabelValue: String };
  phase: any;
  novuelo: any;
  public openWindows: any;

  dataSourceTabs = [];
  displayedColumnsTabs = [];
  esEdicionInvitaciones = false;
  lastTabClicked: any;
  ObjectSelected: any;
  LabelDetalle = '';
  TabSelected: any;
  btnCierre_de_Vuelo = false;
  btnBitacoras = false;
  btnReporteGastos = false;
  darclickaNuevoEndiligencias = false;
  FolioRegistroVuelo: any
  ObjectSelectedName: any;
  motivoRechazo: string = '';

  @ViewChild(MatPaginator, { static: true }) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  pageIndex: number = 0
  pageSize: number = 10
  length: number = 0
  RoleId: any;
  htmlAcciones: any
  loadData: boolean = true
  orderDefault: boolean = false;
  //#endregion


  constructor(
    private localStorageHelper: LocalStorageHelper,
    private SpartanService: SpartanService,
    private translateService: TranslateService,
    public DynamicSearchService: DynamicSearchService,
    private _Spartan_Record_Detail_ManagementService: Spartan_Record_Detail_ManagementService,
    private activateRoute: ActivatedRoute,
    renderer: Renderer2,
    private fb: FormBuilder,
    private _Spartan_RDM_Operations_DetailService: Spartan_RDM_Operations_DetailService,
    private _SpartanFileService: SpartanFileService,
    private _spartanObjectService: SpartanObjectService,
    public dialog: MatDialog,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private spinner: NgxSpinnerService,
    public router: Router,
    private modalService: NgbModal,
    private reportesService: ReportesService,
    private pdfCloudService: PdfCloudService,
    private _messages: MessagesHelper,
  ) {
    this.brf = new BusinessRulesFunctions(renderer, SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.createFormulario();
    this.RoleId = this.localStorageHelper.getItemFromLocalStorage('USERROLEID');
    this.idTablero = 2;
  }

  sortData(sort: Sort) {
    console.log(sort);

    const isAsc = sort.direction === 'asc';
    let orden: string = "";

    if (!sort.active || sort.direction === '') {
      // this.Index(this.idTablero, this.wf, this.phase);
      return;
    }
    
    switch (sort.active) {    
      case 'Avance Coord.':
        this.orderDefault = true;
        //orden = isAsc ? " ORDER BY sv.Avance ASC " : " ORDER BY sv.Avance DESC ";
        this.Index(this.idTablero, 3, this.phase, orden);
        return;      
      case 'Cant. Pasajeros':
        this.orderDefault = false;
        orden = isAsc ? " ORDER BY tr.CANT_PASAJEROS ASC " : " ORDER BY tr.CANT_PASAJEROS DESC ";
        this.Index(this.idTablero, 3, this.phase, orden);
        return;
      case 'Aeronave':
        this.orderDefault = false;
        orden = isAsc ? " ORDER BY tr.AERONAVE ASC " : " ORDER BY tr.AERONAVE DESC ";
        this.Index(this.idTablero, 3, this.phase, orden);
        return;  
      case 'Estatus':
        this.orderDefault = false;
        orden = isAsc ? " ORDER BY tr.ESTATUS ASC " : " ORDER BY tr.ESTATUS DESC ";
        this.Index(this.idTablero, 3, this.phase, orden);
        return;  
      case 'Empresa':
        this.orderDefault = false;
        orden = isAsc ? " ORDER BY tr.EMPRESA ASC " : " ORDER BY tr.EMPRESA DESC ";
        this.Index(this.idTablero, 3, this.phase, orden);
        return;
      case 'No. Vuelo':
        this.orderDefault = false;
        orden = isAsc ? " ORDER BY tr.NO_VUELO ASC " : " ORDER BY tr.NO_VUELO DESC ";
        this.Index(this.idTablero, 3, this.phase, orden);
        return;
      case 'No. Solicitud':
        this.orderDefault = true;
        //orden = isAsc ? " ORDER BY tr.NO_SOLICITUD ASC " : " ORDER BY tr.NO_SOLICITUD DESC ";
        this.Index(this.idTablero, 3, this.phase, orden);
        return;
      case 'Salida':
        this.orderDefault = false;
        orden = isAsc ? " ORDER BY ISNULL(tr.SALIDA, sv.Fecha_de_Salida) ASC " : " ORDER BY ISNULL(tr.SALIDA, sv.Fecha_de_Salida) DESC ";
        this.Index(this.idTablero, 3, this.phase, orden);
        return;
      case 'Llegada':
        this.orderDefault = false;
        orden = isAsc ? " ORDER BY ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso) ASC " : " ORDER BY ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso) DESC ";
        this.Index(this.idTablero, 3, this.phase, orden);
        return;
      default:
        this.orderDefault = false;
        return 0;
    }
  }

  LimpiarBusqueda() {
    this.frm.patchValue({
      aeronave: '',
      numeroVuelo: '',
      cliente: '',
      salidaInicio: '',
      salidaFin: '',
      llegadaInicio: '',
      llegadaFin: ''
    });
  }

  toggleClass() {
    this.expanded = !this.expanded;
  }

  toggleClassSeach(evento) {
    this.LimpiarBusqueda();
    this.expandedSearch = !this.expandedSearch;
  }

  ngOnInit(): void {
    this.activateRoute.paramMap.subscribe(
      params => {
        this.idTablero = params.get('id');
        this.wf = params.get('wf');
        this.phase = params.get('phase');
        this.novuelo = params.get('novuelo');
        this.paginator._intl.itemsPerPageLabel = 'Registros por página';

        if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") != this.idTablero + "/" + this.wf + "/" + this.phase) {
          this.localStorageHelper.setItemToLocalStorage("QueryParam", this.idTablero + "/" + this.wf + "/" + this.phase);

          this.LimpiarBusqueda();
          this.OcultarBusqueda();
          this.ngOnInit();
        }
      });
    this.Index(this.idTablero, this.wf, this.phase);

    if (!this.timerStart) {
      this.startTimer();
    }

  }

  OcultarBusqueda() {
    if (!this.expandedSearch) {
      this.toggleClassSeach(null);
    }
  }

  // Esto permite el refrescado automatico si se inserta un nuevo registro en la BD para cualquier pesta#a del DynamicSearch
  interval;
  startTimer() {
    this.timerStart = true;
    this.interval = setInterval(() => {
      let Reset = +this.localStorageHelper.getItemFromLocalStorage("IsResetDynamicSearch");
      if (Reset == 1) {
        this.spinner.show("loading")
        this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "0");
        this.SpartanService.SetValueExecuteQueryFG("EXEC uspGeneraGastosVuelo " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
        this.SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + ",1", 1, "ABC123");
        this.SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + ",2", 1, "ABC123");
        this.SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + ",3", 1, "ABC123");
        this.SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + ",4", 1, "ABC123");
        this.SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + ",5", 1, "ABC123");
        this.fnClickTabla(this.row);

        setTimeout(() => {
          this.spinner.hide("loading")
        }, 5000);

        this.snackBar.open('Refrescando Vista.', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success',
        });

          if(this.porCargar){
            this.spinner.show("loading")
            this.fnManualClickEnRow(this.row['No. Solicitud']);
            this.porCargar = false;
          }
      }
    }, 5000);

    this.interval = setInterval(() => {
      let Reset = +this.localStorageHelper.getItemFromLocalStorage("IsResetDynamicSearchReabrirVuelo");
      if (Reset == 1) {
        this.spinner.show("loading")
        this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearchReabrirVuelo", "0");

        this.fnClickTabla(this.row);

        this.snackBar.open('Refrescando Vista.', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success'
        });
      }
    }, 5000);
  }

  pauseTimer() {
    clearInterval(this.interval);
  }

  // Fin de funcionalidad

  createFormulario() {

    this.frm = this.fb.group({
      aeronave: new FormControl(),
      numeroVuelo: new FormControl(),
      cliente: new FormControl(),
      salidaInicio: new FormControl(),
      salidaFin: new FormControl(),
      llegadaInicio: new FormControl(),
      llegadaFin: new FormControl()
    });

  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
      },
      (reason) => {
      },
    );
  }

  modalClic() {
    var opcion = confirm("¿Está seguro de cancelar este vuelo?");
    if (opcion == true) {
      if (this.motivoRechazo.length > 0) {

        let user_id = this.localStorageHelper.getItemFromLocalStorage('USERID');
        let query_upd = `exec sp_btnCancelarVuelo ${this.IdSelected},${user_id},'${this.motivoRechazo}'`;

        this.brf.EvaluaQuery(query_upd, 1, 'ABC123');
        this.motivoRechazo = '';
        this.modalService.dismissAll();
        this.Index(this.idTablero, 3, 9);
        this.tablaDerecha = [];
        this.tablaDerechaTitle = '';
        this.btnEditarRegistro = false;
        this.btnImprimirReporteCoordinacion = false;
        this.btnCancelarVuelo = false;
        this.dataSourceTabs = [];
        this.resultFinal.Details = [];
      }
      else {
        alert('La observación es requerida');
      }
    }
  }

  toggleEditable(value: string) {
    this.motivoRechazo = value;
  }

  Index(id: number, wf?: number, p?: number, whereBusqueda?: string) {
    this.WhereWF = '';
    this._faseid = null;

    this._Spartan_Record_Detail_ManagementService.GetByKey(1).subscribe((response) => {

      this.management = response;

    }, (error) => {
      console.error(JSON.stringify(error))
    }, () => {
      localStorage.setItem('Management', JSON.stringify(this.management));
      this.IndexTwo(id, wf, p, whereBusqueda);

    });
  }

  async IndexTwo(id: number, wf?: number, p?: number, whereBusqueda?: string) {

    this.filtro = '';

    if (p != null) {
      this._faseid = p;
    }

    if (wf != null) {

      let model: q = new q();
      model.id = 1;
      model.query = `exec uspGetFiltroWF ${wf.toString()}, ${p.toString()}`;
      model.securityCode = 'ABC123';

      let _uspGetFiltroWF = await this.SpartanService.ExecuteQuery(model).toPromise().then((result) => {
        this.filtro = result.toString();
        this.WhereWF = this.filtro;
      });

      model.query = `exec uspGetNombreFaseWF ${wf.toString()}, ${p.toString()}`;

      let _uuspGetNombreFaseWF = await this.SpartanService.ExecuteQuery(model).toPromise().then((result) => {
        this.filtro = result.toString();
        this.wf = this.filtro;
      });

      this.WorkFlow = this.filtro;
      this.idTablero = id;
      localStorage.setItem('idTablero', id.toString());

      this.fnGetQuantityFlights();
      this.GetResultSearchTable(null, true, whereBusqueda);

    }

    }

  async GetResultSearchTable(resultsSearch?: string, isFromWF: boolean = false, whereBusqueda?: string) {

    let where: String = '';

    let OrderBy: string = '';
    let queryResult: string = '';
    let OrderByQuery: string;

    if (isFromWF) {
      //WHERE DE WORKFLOW
      if (this.WhereWF != null) {
        if (this.WhereWF != '') {
          if (where != '')
            where += ' AND ';
          where += this.WhereWF.toString();
        }
      }
    }


    // var management = (Spartan_Record_Detail_Management)Session["Management"];// _service.GetByKey(ID, false).Resource;
    if (where != "") {
      if (this.management.Search_Result_Query.toUpperCase().includes('WHERE'))
        where = ' AND ' + where;
      else
        where = ' WHERE ' + where;
    }

    //queryResult = `DECLARE @PageNumber AS INT = ${this.pageIndex}  DECLARE @RowsOfPage AS INT = ${this.pageSize} `
    queryResult = queryResult + this.management.Search_Result_Query + where + ' ORDER BY Solicitud_de_Vuelo.Folio DESC ';

    // XMVC: _ISpartaneQueryApiConsumer.SetAuthHeader(_tokenManager.Token);

    OrderByQuery = `select OrderBy from Spartan_Record_Detail_Management where Process_Id = ${this.management.Process_Id}`;

    //Obtener Where de la fase del workflow

    let model: q = new q();
    model.id = 1;
    model.query = OrderByQuery;
    model.securityCode = 'ABC123';

    let _order_by = await this.SpartanService.GetRawQuery(model).subscribe((result) => {

      var x = result.toString()
      // Quitar corchetes
      x = x.substring(0, (result.length - 1));
      x = x.substring((result.length - 1), 1);
      var z = JSON.parse(x);// Parsear a JSON para deserealizar el SQL Query

      OrderBy = z.OrderBy;

    }, (error) => {
      console.error(`ERROR: ${JSON.stringify(error)}`);
    }, () => {

      queryResult = queryResult + ' ' + OrderBy;
      model.query = queryResult;

      let sWhere: string = '';

      for (const field in this.frm.controls) {
        switch (field) {
          case 'aeronave':
            sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` WHERE AERONAVE LIKE '%${this.frm.controls[field].value}%' `;
            break;
          case 'numeroVuelo':
            if ((sWhere != null && sWhere.length > 0) && this.frm.controls[field].value != null) {
              sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` AND NO_VUELO LIKE '%${this.frm.controls[field].value}%' `;
            }

            if ((sWhere == null || sWhere == '') && this.frm.controls[field].value != null) {
              sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` WHERE NO_VUELO LIKE '%${this.frm.controls[field].value}%' `;
            }
            break;
          case 'cliente':

            if ((sWhere != null && sWhere.length > 0) && this.frm.controls[field].value != null) {
              sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` AND EMPRESA LIKE '%${this.frm.controls[field].value}%' `;
            }

            if ((sWhere == null || sWhere == '') && this.frm.controls[field].value != null) {
              sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` WHERE EMPRESA LIKE '%${this.frm.controls[field].value}%' `;
            }
            break;
          case 'salidaFin':

            if ((sWhere != null && sWhere.length > 0) && this.frm.controls[field].value != null) {
              if (this.frm.controls['salidaInicio'].value != null && this.frm.controls['salidaInicio'].value != "") {

                let fechaInicio = this.frm.controls['salidaInicio'].value && this.frm.controls['salidaInicio'].value.toISOString().split('T')[0];
                //let fechaInicio = this.frm.controls['salidaInicio'].value.toISOString().split('T')[0];
                //let fechaFin = fechaInicio != ''? this.frm.controls[field].value && this.frm.controls[field].value.toISOString().split('T')[0] : '';
                let fechaFin = this.frm.controls[field].value && this.frm.controls[field].value.toISOString().split('T')[0];

                sWhere += ` AND (FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'yyyy') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'MM') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;
                //sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` AND (FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'yyyy') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'MM') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;
              }
            }

            if ((sWhere == null || sWhere == '') && this.frm.controls[field].value != null) {
              if (this.frm.controls['salidaInicio'].value != null && this.frm.controls['salidaInicio'].value != "") { //entrar aca aunque salidainicio este vacio (campo salida fin lleno)

                let fechaInicio = this.frm.controls['salidaInicio'].value && this.frm.controls['salidaInicio'].value.toISOString().split('T')[0];
                //let fechaInicio = this.frm.controls['salidaInicio'].value.toISOString().split('T')[0];
                let fechaFin = fechaInicio != '' ? this.frm.controls[field].value && this.frm.controls[field].value.toISOString().split('T')[0] : '';

                sWhere += ` WHERE (FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'yyyy') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'MM') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;
                //sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` WHERE (FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'yyyy') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'MM') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;
              } else if ((this.frm.controls['salidaInicio'].value == null || this.frm.controls['salidaInicio'].value == "") && this.frm.controls['salidaFin'].value != null && this.frm.controls['salidaFin'].value != "") {

                let fechaInicio = this.frm.controls['salidaInicio'].value && this.frm.controls['salidaInicio'].value.toISOString().split('T')[0];
                //let fechaInicio = this.frm.controls['salidaInicio'].value.toISOString().split('T')[0];
                let fechaFin = fechaInicio != '' ? this.frm.controls[field].value && this.frm.controls[field].value.toISOString().split('T')[0] : '';

                sWhere += ` WHERE (FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'yyyy') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'MM') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;
                //sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` WHERE (FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'yyyy') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'MM') + '-' + FORMAT(ISNULL(tr.SALIDA, sv.Fecha_de_Salida),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;

              }
            }
            break;
          case 'llegadaFin':

            if ((sWhere != null && sWhere.length > 0) && this.frm.controls[field].value != null) {
              if (this.frm.controls['llegadaInicio'].value != null && this.frm.controls['llegadaInicio'].value != "") {

                let fechaInicio = this.frm.controls['llegadaInicio']?.value?.toISOString().split('T')[0];
                let fechaFin = this.frm.controls[field].value && this.frm.controls[field].value.toISOString().split('T')[0];

                sWhere += ` AND (FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'yyyy') + '-' + FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'MM') + '-' + FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;
                //sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` AND (FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'yyyy') + '-' + FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'MM') + '-' + FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;
              }
            }

            if ((sWhere == null || sWhere == '') && this.frm.controls[field].value != null) {
              if (this.frm.controls['llegadaInicio'].value != null && this.frm.controls['llegadaInicio'].value != "") {

                let fechaInicio = this.frm.controls['llegadaInicio']?.value?.toISOString().split('T')[0];
                let fechaFin = this.frm.controls[field].value && this.frm.controls[field].value.toISOString().split('T')[0];

                sWhere += ` WHERE (FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'yyyy') + '-' + FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'MM') + '-' + FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;
                //sWhere += (this.frm.controls[field].value == null || this.frm.controls[field].value == '') ? '' : ` WHERE (FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'yyyy') + '-' + FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'MM') + '-' + FORMAT(ISNULL(tr.LLEGADA, sv.Fecha_de_Regreso),'dd')) BETWEEN '${fechaInicio}' AND '${fechaFin}' `;
              }
            }
            break;
        }
      }

      if (this.novuelo) {
        if ((sWhere != null && sWhere.length > 0)) {
          sWhere += ` AND NO_SOLICITUD = '${this.novuelo}'`;
        }

        if ((sWhere == null || sWhere == '')) {
          sWhere += ` WHERE NO_SOLICITUD = '${this.novuelo}'`;
        }
      }

      if (sWhere != null && sWhere.length > 0) {
        model.query = model.query + sWhere;
      }

      if(whereBusqueda != undefined && whereBusqueda != "") {
        model.query = model.query + whereBusqueda;
      }
      else {
        model.query = model.query + " ORDER BY tr.Folio DESC ";
      }

      //model.query = model.query + ` OFFSET (@PageNumber)*@RowsOfPage ROWS  FETCH NEXT @RowsOfPage ROWS ONLY`

      this.SpartanService.GetRawQuery(model).subscribe(async (result) => {

        if(this.orderDefault){
          this.dataTableJson.sort = this.sort;
          this.orderDefault = false;
        }else{
        this.dataTableJson = new MatTableDataSource<any>(JSON.parse(result));
        }
        this.dataTableJson.paginator = this.paginator;

        this.dataTableJson.sortingDataAccessor = (item, property) => {
          switch (property) {
            //case 'Salida': return momentJS(item.Salida);
            //case 'Llegada': return momentJS(item.Llegada);
            case 'Avance Coord.': return item[property] && parseInt(item[property]?.substring(0, item[property]?.length - 1));
            case 'No. Solicitud': return item[property] && parseInt(item[property]);
            //case 'Cant. Pasajeros': return item[property] && parseInt(item[property]);
            default: return item[property];
          }
        };

        this.searchresult = result;
        if (this.novuelo && !this.enterCalendar) {
          if (JSON.parse(result)[0]) {
            this.fnClickTablaDesdeCalendario(JSON.parse(result)[0]);
          }
        }
      });
    });
  }

  onSubmit() {
    let aeronave: string = '';
    aeronave = this.frm.controls['aeronave'].value;

    this.Index(this.idTablero, 3, this.phase);
  }

  async fnClickTablaDesdeCalendario(row: any) {
    this.spinner.show('loading');
    this.row = row;
    this.btnNew = false;
    this.enterCalendar = true;

    if (row.Estatus == "Cerrado") {
      this._VueloCerrado = true;
    }

    this._Numero_de_Vuelo = row['No. Solicitud'];
    this.localStorageHelper.setItemToLocalStorage("NoVuelo", row['No. Vuelo']);
    //this._Numero_de_Vuelo = row['No. Vuelo'];

    await this.GetLogicDataToShow(row, this.idTablero);
    this.fnGetdataShow(row.Folio, this.idTablero);

    switch (this.TabSelected) {
      case 'Registro de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[0]);
        break;
      case 'Comisariato y notas de vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[1]);
        break;
      case 'Coordinación Avisos':
        this.fnClickTabsBadget(this.resultFinal.Details[2]);
        break;
      case 'Coord. de Vuelo- Handling':
        this.fnClickTabsBadget(this.resultFinal.Details[3]);
        break;
      case 'Coord. de Vuelo-Pasajeros':
        this.fnClickTabsBadget(this.resultFinal.Details[4]);
        break;
      case 'Coord. de Vuelo - Tripulación':
        this.fnClickTabsBadget(this.resultFinal.Details[5]);
        break;
      case 'Coord. de Vuelo- Documentación':
        this.fnClickTabsBadget(this.resultFinal.Details[6]);
        break;
      case 'Gastos de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[7]);
        break;
      case 'Cierre de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[8]);
        break;
      default:
    }

    setTimeout(() => {
      this.DisabledAE(row.Empresa);
      this.BussinesRoles(this.wf);

      //this.GetResultSearchTable(null, true);

      if (this.wf == "Gestión de vuelo") {
        document.querySelectorAll('[data-object="46928"]').forEach(e => e.remove()); //OCULTAR REABRIR VUELO EN LA FASE DE GESTIÓN DE VUELO - FELIPE RODRÍGUEZ
      }
      document.querySelectorAll('[data-object="46155"]').forEach(e => e.remove()); //OCULTAR HISTORIAL DE CAMBIOS - LIZETH VILLA
      if (this.tablaDerecha[3].value == 'Cerrado') { //20210924 Ocultar botón de Editar Registro
        this.btnEditarRegistro = false;
      }
    }, 1000);

    this.spinner.hide('loading');
  }

  soloFecha(e) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
    const keyPressed = e.key;

    if (!allowedKeys.includes(keyPressed)) {
      e.preventDefault();
      return;
    }
    if (e.target.value.length >=10) {
      e.preventDefault();
      return;
    }
  }

  async fnClickTabla(row: any) {
    this.spinner.show('loading');
    this.row = row;
    this.btnNew = false;

    if (row.Estatus == "Cerrado") {
      this._VueloCerrado = true;
    }

    this._Numero_de_Vuelo = row['No. Solicitud'];
    this.localStorageHelper.setItemToLocalStorage("NoVuelo", row['No. Vuelo']);
    //this._Numero_de_Vuelo = row['No. Vuelo'];

    await this.GetLogicDataToShow(row, this.idTablero);
    this.fnGetdataShow(row.Folio, this.idTablero);

    switch (this.TabSelected) {
      case 'Registro de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[0]);
        break;
      case 'Comisariato y notas de vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[1]);
        break;
      case 'Coordinación Avisos':
        this.fnClickTabsBadget(this.resultFinal.Details[2]);
        break;
      case 'Coord. de Vuelo- Handling':
        this.fnClickTabsBadget(this.resultFinal.Details[3]);
        break;
      case 'Coord. de Vuelo-Pasajeros':
        this.fnClickTabsBadget(this.resultFinal.Details[4]);
        break;
      case 'Coord. de Vuelo - Tripulación':
        this.fnClickTabsBadget(this.resultFinal.Details[5]);
        break;
      case 'Coord. de Vuelo- Documentación':
        this.fnClickTabsBadget(this.resultFinal.Details[6]);
        break;
      case 'Gastos de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[7]);
        break;
      case 'Cierre de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[8]);
        break;
      default:
    }

    setTimeout(() => {
      this.DisabledAE(row.Empresa);
      this.BussinesRoles(this.wf);

      this.GetResultSearchTable(null, true);

      console.log(this.resultFinal);
      console.log(this.tablaDerecha);

      if (this.wf == "Gestión de vuelo") {
        document.querySelectorAll('[data-object="46928"]').forEach(e => e.remove()); //OCULTAR REABRIR VUELO EN LA FASE DE GESTIÓN DE VUELO - FELIPE RODRÍGUEZ
      }
      document.querySelectorAll('[data-object="46155"]').forEach(e => e.remove()); //OCULTAR HISTORIAL DE CAMBIOS - LIZETH VILLA
      if (this.tablaDerecha[3].value == 'Cerrado') { //20210924 Ocultar botón de Editar Registro
        this.btnEditarRegistro = false;
      }
    }, 1000);

    this.spinner.hide('loading');
  }

  fnGetdataShow(folio, idTablero) {
    this.folioselected = folio;
    this.IdSelected = folio;

    if (this.tablaDerecha) {
      this.tablaDerecha.length = 0;
    }
    else {
      this.tablaDerecha = [];
    }

    this.tablaDerechaTitle = `${this.resultFinal.Label} ${this.resultFinal.LabelValue}`;
    if (this.wf != "Vuelo Cancelado") {
      this.btnEditarRegistro = true;
      this.btnImprimirReporteCoordinacion = true;
    }

    let image = this.resultFinal.Data[0];
    if (image.value == '') {
      this.ImageSearchData = false;
    } else {
      this.ImageSearchDataSRC = image.value;
    }

    let notimage = false;
    this.resultFinal.Data.forEach((data) => {
      if (notimage) {
        let datavalue = data.value ? data.value.toString() : '';
        datavalue = datavalue.trim().replace(/(?:\r\n|\r|\n)/g, ' ');
        //let result2 = /\(([^)]*)\)/.exec(datavalue);
        let result2 = /\##(.*?)\##/.exec(datavalue);
        let valueSinComent = datavalue.replace(result2?.[0], '');
        if (datavalue.indexOf('@@@@') < 0) {
          this.tablaDerecha.push({ label: data.label, value: datavalue, valueObs: result2, valueSin: valueSinComent   });
        } else {
          if (datavalue.indexOf('@@@@_') >= 0) {
            let _urlImg = "assets/images/" + datavalue.replace('@@@@_', '');
            this.tablaDerecha.push({ label: data.label, value: datavalue, image: _urlImg });
          } else {
            this.tablaDerecha.push({ label: data.label, value: datavalue });
          }
        }
      }
      else {
        notimage = true;
      }
    });

    let role = +this.localStorageHelper.getItemFromLocalStorage('USERROLEID');

    this.resultFinal.Details.forEach((data) => {
      this.buttonsDetails.push({ label: data.Label, objectid: data.ObjectId, icon: data.Icon, counter: data.Counter });

    });

    // Verifica si deberia reabrir vuelo.
    if (role == 12) {
      this.resultFinal.Details.splice(9, 1);
    }

    this.validarBotonCancelar(this.resultFinal);
    if (this.wf == "Vuelo Cancelado") {
      this.ocultarBotonesEnFaseCancelar();
    }

   

  }

  validarBotonCancelar(result) {

    let status = result.Data.find(x => x.Label === "Estatus" && x.Value === "Cancelado");
    if ((status == undefined || status == null) && (this.RoleId == 9 || this.RoleId == 12)) {
      this.mostrarBotonCancelar();
    }
  }

  mostrarBotonCancelar() {
    this.btnCancelarVuelo = true;
  }

  validarFaseCancelar() {
    let roleUsuario = +this.localStorageHelper.getItemFromLocalStorage('USERROLEID');//@Session["USERROLEID"];
    let status = this.tablaDerecha[4].value;
    if ((status === 'Cancelado')) {
      this.ocultarBotonesEnFaseCancelar();
    }
  }

  ocultarBotonesEnFaseCancelar() {
    this.btnCancelarVuelo = false;
    this.btnImprimirReporteCoordinacion = false;
    this.btnEditarRegistro = false;
  }


  btnCancelarVueloClick() {

  }

  DisabledAE(value) {
    let replaced = value.toString().split(' ').join('');
    if (replaced == 'AtenciónaExtravío') {
      if (document.querySelectorAll('button[data-name="Servicios de Apoyo"]').length > 0)
        document.querySelectorAll('button[data-name="Servicios de Apoyo"]')[0].setAttribute('disabled', 'disabled');
      if (document.querySelectorAll('button[data-name="Probable Responsable"]').length > 0)
        document.querySelectorAll('button[data-name="Probable Responsable"]')[0].setAttribute('disabled', 'disabled');
      if (document.querySelectorAll('button[data-name="Delitos"]').length > 0)
        document.querySelectorAll('button[data-name="Delitos"]')[0].setAttribute('disabled', 'disabled');
      if (document.querySelectorAll('button[data-name="Relaciones"]').length > 0)
        document.querySelectorAll('button[data-name="Relaciones"]')[0].setAttribute('disabled', 'disabled');
      if (document.querySelectorAll('button[data-name="Desestimación"]').length > 0)
        document.querySelectorAll('button[data-name="Desestimación"]')[0].setAttribute('disabled', 'disabled');
    }
    else {
      if (document.querySelectorAll('button[data-name="Servicios de Apoyo"]').length > 0)
        document.querySelectorAll('button[data-name="Servicios de Apoyo"]')[0].removeAttribute('disabled');
      if (document.querySelectorAll('button[data-name="Probable Responsable"]').length > 0)
        document.querySelectorAll('button[data-name="Probable Responsable"]')[0].removeAttribute('disabled');
      if (document.querySelectorAll('button[data-name="Delitos"]').length > 0)
        document.querySelectorAll('button[data-name="Delitos"]')[0].removeAttribute('disabled');
      if (document.querySelectorAll('button[data-name="Relaciones"]').length > 0)
        document.querySelectorAll('button[data-name="Relaciones"]')[0].removeAttribute('disabled');
      if (document.querySelectorAll('button[data-name="Documentos"]').length > 0)
        document.querySelectorAll('button[data-name="Documentos"]')[0].removeAttribute('disabled');
      if (document.querySelectorAll('button[data-name="Desestimación"]').length > 0)
        document.querySelectorAll('button[data-name="Desestimación"]')[0].removeAttribute('disabled');
      if (document.querySelectorAll('button[data-name="Involucrados"]').length > 0)
        document.querySelectorAll('button[data-name="Involucrados"]')[0].removeAttribute('disabled');
    }
  }

  BussinesRoles(value) {
    switch (value) {
      case "Canalizados":
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        this.btnEditarRegistro = false;
        this.btnNew = false;
        let findControls: any = document.getElementsByClassName('classDelete');//[0].style.display = 'none';
        for (let index = 0; index < findControls.length; index++) {
          findControls[index].style.display = 'none';
        }
        break;
      case "Cerrados":
        //Declaraciones ejecutadas cuando el resultado de expresión coincide con el valor1
        this.btnEditarRegistro = false;
        this.btnNew = false;

        let findControlseditDetails: any = document.getElementsByClassName('editDetails');
        for (let index = 0; index < findControlseditDetails.length; index++) {
          findControlseditDetails[index].setAttribute('disabled', 'disabled');
          findControlseditDetails[index].style.display = 'none';
        }

        let findControlsclassDelete: any = document.getElementsByClassName('classDelete');
        for (let index = 0; index < findControlsclassDelete.length; index++) {
          findControlsclassDelete[index].style.display = 'none';
        }

        break;
      default:
        //console.log("")
        break;
    }
  }

  async GetLogicDataToShow(row: any, idTablero: any) {
    this.spinner.show('loading');
    this.localStorageHelper.setItemToLocalStorage('SpartanOperationId', row.Folio);

    let label = this.management.Reference_Label;
    let labelValue = row.Folio;

    this.resultFinal.Label = label;
    this.resultFinal.LabelValue = labelValue;

    this.tablaDerechaTitle = `${this.resultFinal.Label} ${this.resultFinal.LabelValue}`;

    let query = this.management.Query_Data_Detail;
    query = query.replace("@@LLAVE@@", row.Folio);

    let model: q = new q();
    model.id = 1;
    model.query = query;
    model.securityCode = 'ABC123';

    let _result = await this.fillData(model);

    this.resultFinal.Data.length = 0;

    Object.entries(JSON.parse(_result)[0]).find(([key, value]) => {
      this.resultFinal.Data.push({ label: key, value: value, image: '' });
    });

    let resultDetails = await this.fillDetails(this.idTablero);
    if (resultDetails && resultDetails.RowCount > 0) {
      let resultDetailsOrder = resultDetails.Spartan_RDM_Operations_Details
        .sort((a, b) => (a.Order_Shown < b.Order_Shown) ? -1 : 1);

      this.resultFinal.Details = await this.fnPreparaObjetoDetails(resultDetailsOrder, row);
      console.log(`this.resultFinal`);
      //console.log(`this.resultFinal ${JSON.stringify(this.resultFinal)}`);
      console.log(`${this.resultFinal}`);

    }

   

    this.spinner.hide('loading');
  }

  async fnPreparaObjetoDetails(info: any, row: any): Promise<any> {
    try {
      let aux: ResultGeneralDetail;
      let _resultDetails: ResultGeneralDetail[] = [];
      for (let index = 0; index < info.length; index++) {
        let item = info[index];
        aux = new ResultGeneralDetail();
        aux.ObjectId = item.Object_Name;
        let faseStringPaso: string = (this._faseid == null ? "null" : this._faseid.toString());
        let counter = await this.fillByExecuteQuery(item.Count_Query.replace("@@LLAVE@@", row.Folio).replace("@@FASE@@", faseStringPaso));

        if (counter && counter != "[]") {
          aux.Counter = parseInt(JSON.parse(counter)[0].Conteo ?? JSON.parse(counter)[0].Column1);
        } else {
          aux.Counter = 0;
        }

        aux.Label = item.Object_Label;
        let fileInfo = await this.fillFile(item.Icono || null);
        aux.Icon = env.urlpublicaimagenes + "/api/Spartan_File/Files/" + item.Icono + "/" + fileInfo.Description;
        aux.Details = new ModelResultsFields();
        let queryDataDetail: string = item.Query_Data.replace("@@LLAVE@@", row.Folio).replace("@@FASE@@", faseStringPaso);
        let resultQueryDetail: any = await this.fillByExecuteQuery(queryDataDetail);
        if (resultQueryDetail != null && resultQueryDetail != "[]" && resultQueryDetail != "") {
          let objDetail = JSON.parse(resultQueryDetail);
          // Esta linea se puso para obtener la data

          let valuesColumnsDetail: ModelResultsValueFields[] = [];
          let columnsDictionaryDetail = JSON.parse(resultQueryDetail);
          let columnsDetail = [];

          Object.entries(columnsDictionaryDetail[0]).find(([key, value]) => {
            columnsDetail.push(key);
          });


          aux.Details.Columns = columnsDetail;
          //aux.Details.ValuesColumns = ModelResultsValueFields[];
          objDetail.forEach((itemDetail: any) => {
            let row = [];
            columnsDetail.forEach((col: any) => {
              row.push(itemDetail[col] == null ? "" : itemDetail[col].toString());
            });
            let values = new ModelResultsValueFields();
            values.Values = row;
            valuesColumnsDetail.push(values);
          });
          let resultDetailNew = new ModelResultsFields();
          resultDetailNew.Columns = columnsDetail;
          resultDetailNew.ValuesColumns = valuesColumnsDetail;
          resultDetailNew.tableDataSource = objDetail;

          aux.Details = resultDetailNew;
        }
        _resultDetails.push(aux);

      }
      return _resultDetails;
    } catch (error) {
    }
  }

  fillDetails(idTablero: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._Spartan_RDM_Operations_DetailService.listaSelAll(0, 9999, `Spartan_RDM_Operations_Detail.Record_Detail_Management= ${idTablero} `).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  async fillData(model: q): Promise<any> {
    return new Promise((resolve, reject) => {
      this.SpartanService.GetRawQuery(model).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  fillByExecuteQuery(query: string): Promise<any> {
    return new Promise((resolve, reject) => {

      let model: q = new q();
      model.id = 1;
      model.query = query;
      model.securityCode = 'ABC123';

      this.SpartanService.GetRawQuery(model).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  fillByExecuteQueryDictionary(query: string): Promise<any> {
    return new Promise((resolve, reject) => {

      let model: q = new q();
      model.id = 1;
      model.query = query;
      model.securityCode = 'ABC123';

      this.SpartanService.ExecuteQueryDictionary(model).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  fillFile(id: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._SpartanFileService.getById(id).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  fillEvaluaQuery(query: any): Promise<any> {
    return new Promise((resolve, reject) => {

      let model: q = new q();
      model.id = 1;
      model.query = query;
      model.securityCode = 'ABC123';

      this.SpartanService.ExecuteQuery(model).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  fillGetCatalogName(where: any): Promise<any> {
    return new Promise((resolve, reject) => {
      this._spartanObjectService.listaSelAll(1, 10, where, '').subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }

  async fnClickTabsBadget(button: any) {
    let clicked = true;
    this.esEdicionInvitaciones = false;
    this.TabSelected = button.Label;
    this.ObjectSelected = button.ObjectId;
    this.LabelDetalle = button.Label;

    let role = +this.localStorageHelper.getItemFromLocalStorage('USERROLEID'); //@Session["USERROLEID"] != null ? @Session["USERROLEID"] : 0;
    await this.FillDetailsByTab(button);

    if (await this.HasValidaPersmisoX(this.ObjectSelected, role, 2) === true) { // el 2 represta si tiene permio de nuevo
      this.btnNew = true;
    }
    else {
      this.btnNew = false;
    }

    let findControlseditDetails: any;
    let findControlsclassDelete: any;
    let findControlsclassEditor: any;
    switch (this.wf) {
      case "Canalizados":
        let findControls: any = document.getElementsByClassName('classDelete');//[0].style.display = 'none';
        for (let index = 0; index < findControls.length; index++) {
          findControls[index].style.display = 'none';
        }
        break;
      case "Cerrados":
        findControlseditDetails = document.getElementsByClassName('editDetails');
        for (let index = 0; index < findControlseditDetails.length; index++) {
          findControlseditDetails[index].setAttribute('disabled', 'disabled');
          findControlseditDetails[index].style.display = 'none';
        }

        findControlsclassDelete = document.getElementsByClassName('classDelete');
        for (let index = 0; index < findControlsclassDelete.length; index++) {
          findControlsclassDelete[index].style.display = 'none';
        }
        if (this.ObjectSelected == 46928 && role == 9) //Mostrar boton de nuevo en pantalla Reabrir Vuelo en fase cerrados- Felipe Rodríguez
        {
          this.btnNew = true;
        }
        break;
      case "Vuelo Cerrado":
        findControlseditDetails = document.getElementsByClassName('editDetails');
        for (let index = 0; index < findControlseditDetails.length; index++) {
          findControlseditDetails[index].setAttribute('disabled', 'disabled');
          findControlseditDetails[index].style.display = 'none';
        }

        findControlsclassDelete = document.getElementsByClassName('classDelete');
        for (let index = 0; index < findControlsclassDelete.length; index++) {
          findControlsclassDelete[index].style.display = 'none';
        }

        findControlsclassEditor = document.getElementsByClassName('editor_remove'); // 20210924 Mostrar botón de consulta para todos
        for (let index = 0; index < findControlsclassEditor.length; index++) {
          findControlsclassEditor[index].style.display = 'block';
        }

        this.btnNew = false;
        this.btnEditarRegistro = false;
        this.btnCierre_de_Vuelo = false;
        if (this.ObjectSelected == 46928 && role == 9) //Mostrar boton de nuevo en pantalla Reabrir Vuelo en fase cerrados- Felipe Rodríguez
        {
          this.btnNew = true;

          let reabierto = await this.brf.EvaluaQueryAsync(`SELECT Vuelo_Reabierto FROM Solicitud_de_vuelo WHERE Folio = ${this._Numero_de_Vuelo}`, 1, "ABC123");
          if(reabierto == 1 || reabierto == "1") {
            this.btnNew = false;
          }          
        }
        break;
      case "Vuelo Cancelado":
        findControlseditDetails = document.getElementsByClassName('editDetails');
        for (let index = 0; index < findControlseditDetails.length; index++) {
          findControlseditDetails[index].setAttribute('disabled', 'disabled');
          findControlseditDetails[index].style.display = 'none';
        }

        findControlsclassDelete = document.getElementsByClassName('classDelete');
        for (let index = 0; index < findControlsclassDelete.length; index++) {
          findControlsclassDelete[index].style.display = 'none';
        }

        findControlsclassEditor = document.getElementsByClassName('editor_remove'); // 20210924 Mostrar botón de consulta para todos
        for (let index = 0; index < findControlsclassEditor.length; index++) {
          findControlsclassEditor[index].style.display = 'block';
        }

        this.btnNew = false;
        this.btnEditarRegistro = false;
        this.btnCierre_de_Vuelo = false;
        break;
      default:
        break;
    }

    if (this.darclickaNuevoEndiligencias) {
      let element: HTMLElement = document.getElementById('new')[0] as HTMLElement;
      element.click();
    }
    
    if (this.tablaDerecha[3].value == 'Cerrado') { //20210924
      if (this.ObjectSelected != 46928 && role != 9) {
        this.btnNew = false;
      }
      this.btnCierre_de_Vuelo = false;
      this.btnEditarRegistro = false;
    }

  }

  async FillDetailsByTab(button: any) {

    if (button.Counter > 0) {
      //if (button.Label == "Registro de Vuelo") {
      if (button.Details.Columns[0] == "Folio" || button.Details.Columns[0] == "folio") {
        button.Details.Columns.splice(0, 1);
      }
      for (let i = 0; i < button.Details.tableDataSource.length; i++) {
        let time = button.Details.ValuesColumns[i].Values[11];
        time = moment(time, 'HH:mm').format('HH:mm');
        button.Details.tableDataSource[i]["Hora de Salida"] = time;
      }
      //}
    }

    this.btnCierre_de_Vuelo = false;
    this.btnBitacoras = false;
    this.btnReporteGastos = false;

    let role = +this.localStorageHelper.getItemFromLocalStorage('USERROLEID');
    let permisionDelete = false;
    let DeleteElement = '';

    if (await this.HasValidaPersmisoX(this.ObjectSelected, role, 4) === true) { // el 4 represta si tiene permio de Eliminar
      permisionDelete = true;
    }

    let permisionConsult = false;  //20210924 Agregar botón Consultar.-  Perezfort
    let ConsultElement = '';
    if (await this.HasValidaPersmisoX(this.ObjectSelected, role, 1) === true) { // el 1 representa si tiene permiso de Consulta
      permisionConsult = true;
    }

    if (this._VueloCerrado == true) {  //Bloquear Vuelos Cerrado - Perezfort
      permisionDelete = false;
    }

    let permisionPrint = false
    let PrintElement = '';
    if (await this.HasValidaPersmisoX(this.ObjectSelected, role, 6) === true) { // el 6 represta si tiene permio de Imprimir
      permisionPrint = true;
    }

    let permisionEdit = false;
    let EditElement = '';
    if (await this.HasValidaPersmisoX(this.ObjectSelected, role, 3) === true) { // el 3 representa si tiene permiso de Editar
      permisionEdit = true;
    }

    if (this.ObjectSelected == 46928) //Ocultar botones de editar en pantalla Reabrir Vuelo - Felipe Rodríguez
    {
      permisionEdit = false;
    }

    if (permisionPrint) {
      PrintElement = '<a class="printDetails" style="padding-left: 10px;"><i class="fa fa-print "></i></a>';
      PrintElement = '--printDetails';
    }
    if (permisionConsult) { //20210924 Agregar botón Consultar.-  Perezfort
      ConsultElement = '<a class="editor_remove" data-original-title="Consultar" style="padding-left: 10px;"><i class="fa fa-male"></i></a>';
      ConsultElement = '--editor_remove';
    }
    if (permisionDelete) {
      DeleteElement = '<a class="classDelete" style="padding-left: 10px;"><i class="fa fa-trash"  data-ObjectSelected="' + this.ObjectSelected + '"></i></a>';
      DeleteElement = '--classDelete';
    }
    if (permisionEdit) {
      EditElement = '<a class="editDetails"><i class="fa fa-edit"></i></a>';
      EditElement = '--editDetails';
    }

    this.htmlAcciones = EditElement + ConsultElement + PrintElement + DeleteElement;
    if (button.Details.Columns == undefined) {
      this.displayedColumnsTabs.length = 0;
      return
    }
    if (button.Details.Columns.length > 1 && button.Details.Columns[0] != 'Acción') {
      let dct = button.Details.Columns.unshift('Acción');
    }


    let dtt = button.Details.tableDataSource.map(obj => ({ ...obj, Acción: this.htmlAcciones }));

    this.dataSourceTabs = dtt;
    this.displayedColumnsTabs = button.Details.Columns;

    if (this.ObjectSelected == '46161') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId != 13) {
        this.btnCierre_de_Vuelo = true;
      }
      this.btnBitacoras = true;
    }
    if (this.ObjectSelected == '46151') {
      this.btnReporteGastos = true;
    }

  }

  async fnReloadTable() {
    this.dataSourceTabs.forEach(element => {
      console.log(element)
    });
  }

  async HasValidaPersmisoX(objSelected, role, function_Id) {
    let resulttado = await this.fillByExecuteQueryDictionary(" usp_ValidaPersmiso  '" + objSelected + "'," + role + "," + function_Id);
    if (Object.keys(resulttado).length > 0) {
      return true;
    }
    else {
      return false;
    }
  }

  async fnAccion(opt: any, element: any) {

    let folio
    if (element.Folio != undefined) folio = element.Folio
    else if (element.folio != undefined) folio = element.folio

    let spartaneObject: any;
    switch (opt) {
      case 'printDetails':
        this.spinner.show('loading');
        spartaneObject = await this.fillGetCatalogName(`Spartan_Object.Object_Id=${this.ObjectSelected}`);
        if (spartaneObject.RowCount > 0) {
          this.ObjectSelectedName = spartaneObject.Spartan_Objects[0].URL;
        }

        this.fnImprimirDetalleVuelo(FormatPrintEnum[this.ObjectSelectedName], folio)

        break;
      case 'editor_remove':
        spartaneObject = await this.fillGetCatalogName(`Spartan_Object.Object_Id=${this.ObjectSelected}`);
        if (spartaneObject.RowCount > 0) {
          this.ObjectSelectedName = spartaneObject.Spartan_Objects[0].URL;
        }
        this.GetCatalogPopup(folio);
        break;
      case 'classDelete':
        let r = confirm("¿Está seguro de borrar el registro?");
        if (r == true) {
          let folioORClave = folio;
          //let dataObjectSelected = $(this).find("i").attr("data-ObjectSelected");
          //let querySelectNameOfTble = "select Class_name from spartan_metadata where object_id ='" + dataObjectSelected + "'";
          spartaneObject = await this.fillGetCatalogName(`Spartan_Object.Object_Id=${this.ObjectSelected}`);
          if (spartaneObject.RowCount > 0) {
            this.ObjectSelectedName = spartaneObject.Spartan_Objects[0].URL;
          }
          let resultSelectNameOfTble = this.ObjectSelectedName;
          let spToExecute = "exec SP_DEL" + resultSelectNameOfTble + " '" + folioORClave + "'";
          if (resultSelectNameOfTble == 'Registro_de_vuelo') {  //20210924
            spToExecute = "exec USP_DEL" + resultSelectNameOfTble + " '" + folioORClave + "'";
          }

          var dele = await this.fillEvaluaQuery(spToExecute);

          this.fnClickTabla(this.row);

          // var filterObj = '*[data-object="' + dataObjectSelected + '"]';
          // var badge = $("#TabsBadget").find(filterObj).find(".badge");
          // var cont = badge.text().trim();

          // if (cont != null && cont != "") {
          //     var contItn = parseInt(cont) - 1;
          //     badge.text(contItn)
          // }

          // $("#TabsBadget").find(filterObj).click()
        } else {
          //ToDo
        }
        break;
      case 'editDetails':
        if (this.ObjectSelected == "45033") { // es invitaciones (detalle_de_solicitud_de_invitacines)
          this.esEdicionInvitaciones = true;
        }
        spartaneObject = await this.fillGetCatalogName(`Spartan_Object.Object_Id=${this.ObjectSelected}`);
        if (spartaneObject.RowCount > 0) {
          this.ObjectSelectedName = spartaneObject.Spartan_Objects[0].URL;
        }

        this.localStorageHelper.setItemToLocalStorage("Folio_Solicitud", this._Numero_de_Vuelo.toString());
        this.localStorageHelper.setItemToLocalStorage("FolioRegistroVuelo", element.Folio);
        this.FolioRegistroVuelo = element.Folio

        this.GetCatalogPopup(folio);
        break;
    }
  }

  async GetCatalogPopup(Id, consult = false) {  //20210924 Agregar parametro para abrir modo consulta

    this.darclickaNuevoEndiligencias = false;
    let r = await this.fillEvaluaQuery("SELECT " + this.localStorageHelper.getItemFromLocalStorage('USERROLEID')); //GLOBAL[USERROLEID]
    let module = await this.fillEvaluaQuery(`exec usp_GetModule ${this.ObjectSelected}, ${r}`);

    let url: any = "";
    switch (this.ObjectSelectedName) {

      case 'Registro_de_vuelo':

        this.localStorageHelper.setItemToLocalStorage("Registro_de_vueloWindowsFloat", "1");
        this.fnOpenModalNuevoRegistroTramo("Update", Id);

        break;

      case 'Comisariato_y_notas_de_vuelo':

        this.fnOpenModalComisariato_y_Notas_de_vuelo("Update", Id);

        break;

      case 'Coordinacion_Avisos':

        this.fnOpenModalCoordinacion_Avisos("Update", Id);

        break;

      case 'Coordinacion_Handling':

        this.fnOpenModalCoordinacion_Handling("Update", Id);

        break;

      case 'Coordinacion_Pasajeros':

        this.fnOpenModalCoordinacion_Pasajeros("Update", Id);

        break;

      case 'Coord__de_Vuelo__Tripulacion':

        this.fnOpenModalCoord_de_Vuelo_Tripulacion("Update", Id);

        break;

      case 'Coord__de_Vuelo__Documentacion':

        this.fnOpenModalCoord_de_Vuelo_Documentacion("Update", Id);

        break;

      case 'Gastos_de_Vuelo':

        this.fnOpenModalGastos_de_Vuelo("Update", Id);

        break;

      case 'Cierre_de_Vuelo':
        url = this.router.serializeUrl(
          this.router.createUrlTree([`#/Cierre_de_Vuelo/edit/${Id}`])
        );
        this.localStorageHelper.setItemToLocalStorage("Cierre_de_VueloWindowsFloat", "1");
        break;

      case 'Ejecucion_de_Vuelo':

        this.localStorageHelper.setItemToLocalStorage("Ejecucion_de_VueloWindowsFloat", "1");
        this.localStorageHelper.setItemToLocalStorage('TituloDynamic', 'Si');
        this.fnOpenModalEjecucion_de_Vuelo("Update", Id);
        break;

      case 'Reabrir_vuelo':
        // url = this.router.serializeUrl(
        //   this.router.createUrlTree([`#/Reabrir_vuelo/add`])
        // );
        // this.localStorageHelper.setItemToLocalStorage("Reabrir_vueloWindowsFloat", "1");
        // break;

        this.fnOpenModalReabrirVuelo("Update", Id);

        break;

      case 'Solicitud_de_Vuelo':
        url = this.router.serializeUrl(
          this.router.createUrlTree([`#/Solicitud_de_Vuelo/edit/${Id}`])
        );
        this.localStorageHelper.setItemToLocalStorage("Solicitud_de_VueloWindowsFloat", "1");
        break;
    }

    if (this.ObjectSelectedName != 'Registro_de_vuelo' && url != "") {
      var newWindow = window.open(decodeURIComponent(url), "_blank", 'scrollbars=yes, ' + this.getParamNewWindow());
    }

    return;
  }

  async closeWindows() {
    this.openWindows = await this.openWindows.close;
  }

  async fnEditarRow() {
    let spartaneObject = await this.fillGetCatalogName(`Spartan_Object.Object_Id=${this.management.Object}`);
    if (spartaneObject.RowCount > 0) {
      this.ObjectSelectedName = spartaneObject.Spartan_Objects[0].URL;
    }
    this.GetCatalogPopup(this.folioselected);
  }

  //#region Funcionalidad Cierre de vuelo (Boton)
  async CloseFligth() {

    Swal.fire({
      title: "¿Estás seguro que quieres cerrar este vuelo?",
      text: "",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      cancelButtonText: "Cancelar",
      confirmButtonText: "Aceptar"
    }).then(result => {
      if (result.value) {
        this.spinner.show("loading");

        this.sqlModel.query = ` EXEC uspCerrarVuelo ${this._Numero_de_Vuelo}`;

        this.SpartanService.ExecuteQuery(this.sqlModel).subscribe({
          next: (response) => {
            this.SendMails();
          },
          error: err => {
            console.error(err);
          },
          complete: () => {
            this.router.navigate(['/Calendario/list']);

            this.spinner.hide("loading");
          }
        })
      }
    });

  }
  //#endregion


  refreshPage() {
    this.Index(this.idTablero, 3, 9);
    this.tablaDerecha = [];
    this.tablaDerechaTitle = '';
    this.btnEditarRegistro = false;
    this.btnImprimirReporteCoordinacion = false;
    this.btnCancelarVuelo = false;
    this.dataSourceTabs = [];
    this.resultFinal.Details = [];

    this.btnNew = false;
    this.btnBitacoras = false;
    this.btnCierre_de_Vuelo = false
    this.btnReporteGastos = false
  }

  async SendMails() {
    //Emails
    let NumVuelo = await this.SpartanService.SetValueExecuteQueryRT("select Numero_de_Vuelo from Solicitud_de_Vuelo where folio = " + this._Numero_de_Vuelo, 1, "ABC123");
    let emailsContadores = await this.SpartanService.SetValueExecuteQueryRT("select STUFF(( select ';' + Email + '' from Spartan_User where Role = 24 for XML PATH('') ), 1, 1, '')", 1, "ABC123");
    let emailsTesoreria = await this.SpartanService.SetValueExecuteQueryRT("select STUFF(( select ';' + Email + '' from Spartan_User where Role = 40 for XML PATH('') ), 1, 1, '')", 1, "ABC123");
    let emailsOperaciones = await this.SpartanService.SetValueExecuteQueryRT("select STUFF(( select ';' + Email + '' from Spartan_User where Role = 12 for XML PATH('') ), 1, 1, '')", 1, "ABC123");
    let emailsAdministrativo = await this.SpartanService.SetValueExecuteQueryRT("select STUFF(( select ';' + Email + '' from Spartan_User where Role = 22 for XML PATH('') ), 1, 1, '')", 1, "ABC123");
    let emailsAdministradordeSistema = await this.SpartanService.SetValueExecuteQueryRT("select STUFF(( select ';' + Email + '' from Spartan_User where Role = 9 for XML PATH('') ), 1, 1, '')", 1, "ABC123");

    let emailHTMLContadores = await this.SpartanService.SetValueExecuteQueryRT("exec usp_Get_HTMLPlantilla 1", 1, "ABC123");
    emailHTMLContadores = emailHTMLContadores?.replace('"no. De vuelo"', NumVuelo);

    let emailHTMLTesoreria = await this.SpartanService.SetValueExecuteQueryRT("exec usp_Get_HTMLPlantilla 2", 1, "ABC123");
    emailHTMLTesoreria = emailHTMLTesoreria?.replace('"no. De vuelo"', NumVuelo);

    let emailHTMLOperaciones = await this.SpartanService.SetValueExecuteQueryRT("exec usp_Get_HTMLPlantilla 3", 1, "ABC123");
    emailHTMLOperaciones = emailHTMLOperaciones?.replace('"no. De vuelo"', NumVuelo);

    let emailHTMLAdministrativo = await this.SpartanService.SetValueExecuteQueryRT("exec usp_Get_HTMLPlantilla 4", 1, "ABC123");
    emailHTMLAdministrativo = emailHTMLAdministrativo?.replace('"no. De vuelo"', NumVuelo);

    let emailHTMLAdministradordeSistema = await this.SpartanService.SetValueExecuteQueryRT("exec usp_Get_HTMLPlantilla 5", 1, "ABC123");
    emailHTMLAdministradordeSistema = emailHTMLAdministradordeSistema?.replace('"no. De vuelo"', NumVuelo);

    this.helperService.SendEmail(emailsContadores, 'VICS - Notificación Servicio de Vuelo por Facturar', emailHTMLContadores).subscribe;
    this.helperService.SendEmail(emailsTesoreria, 'VICS - Notificación Servicio de Vuelo por Facturar', emailHTMLTesoreria).subscribe;
    this.helperService.SendEmail(emailsOperaciones, 'VICS - Notificación Servicio de Vuelo por Facturar', emailHTMLOperaciones).subscribe;
    this.helperService.SendEmail(emailsAdministrativo, 'VICS - Notificación Servicio de Vuelo por Facturar', emailHTMLAdministrativo).subscribe;
    this.helperService.SendEmail(emailsAdministradordeSistema, 'VICS - Notificación Servicio de Vuelo por Facturar', emailHTMLAdministradordeSistema);
  }

  OpenReporteDeGastos() {
    this.router.navigate(['/Report/DetailedReport/14']);
  }

  async fnOpenNew() {

    let r = await this.fillEvaluaQuery("SELECT " + this.localStorageHelper.getItemFromLocalStorage('USERROLEID')); //GLOBAL[USERROLEID]
    let module = await this.fillEvaluaQuery(`exec usp_GetModule ${this.ObjectSelected}, ${r}`);

    let spartaneObject: any;

    spartaneObject = await this.fillGetCatalogName(`Spartan_Object.Object_Id=${this.ObjectSelected}`);
    if (spartaneObject.RowCount > 0) {
      this.ObjectSelectedName = spartaneObject.Spartan_Objects[0].URL;
    }

    this.localStorageHelper.setItemToLocalStorage("Folio_Solicitud", this._Numero_de_Vuelo.toString());

    let url: any = "";
    switch (this.ObjectSelectedName) {
      case 'Registro_de_vuelo':

        this.localStorageHelper.setItemToLocalStorage("Registro_de_vueloWindowsFloat", "1");
        this.fnOpenModalNuevoRegistroTramo("New", 0);

        break;
      case 'Ejecucion_de_Vuelo':

        this.localStorageHelper.setItemToLocalStorage('TituloDynamic', 'Si');
        this.localStorageHelper.setItemToLocalStorage("Ejecucion_de_VueloWindowsFloat", "1");

        this.fnOpenModalEjecucion_de_Vuelo("New", 0);
        break;
      case 'Solicitud de vuelo':
        break;
      case 'Reabrir_vuelo':

        this.fnOpenModalReabrirVuelo("New", 0);

        break;
        
        // url = this.router.serializeUrl(
        //   this.router.createUrlTree([`#/Reabrir_vuelo/add`])
        // );
        // this.localStorageHelper.setItemToLocalStorage("Reabrir_vueloWindowsFloat", "1");
        // break;
    }
    if (url != "") {
      window.open(decodeURIComponent(url), "_blank", "width=800, height=600, top=200, left=500");
    }
    return

  }

  //#region Definir Mensajes
  public async ShowMessageType(message: string, typeMessage: string) {

    let type: string;

    switch (typeMessage) {
      case 'warning':
        type = "mat-warn"
        break;
      case 'error':
        type = "mat-accent"
        break;
      case 'normal':
        type = "mat-primary"

      default:
        break;
    }

    this.snackBar.open(message, '', {
      duration: 4000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['mat-toolbar', type]
    });
  }
  //#endregion


  //#region Obtener Datos de Reporte Coordinación de Vuelo
  async fnGetReporteCoordinacion() {
    this.spinner.show('loading');

    let RecordId = await this.fillEvaluaQuery(`SELECT TOP 1 Folio FROM dbo.Coordinacion_Avisos WHERE Numero_de_Vuelo = ${this._Numero_de_Vuelo}`);
    let SpartanRDMId = await this.fillEvaluaQuery(`SELECT TOP 1 DetailId FROM dbo.Spartan_RDM_Operations_Detail WHERE Object_Name = 46115`);
    let SpartanRDMProcess = await this.fillEvaluaQuery(`SELECT TOP 1 Object_Label FROM dbo.Spartan_RDM_Operations_Detail WHERE Object_Name = 46115`);
    let RoleId = +this.localStorageHelper.getItemFromLocalStorage('USERROLEID');

    this.fnGeneratePDFReporteCoordinacion(SpartanRDMId, SpartanRDMProcess, RecordId, RoleId)

  }
  //#endregion


  //#region Generar PDF de Reporte Coordinación de Vuelo
  fnGeneratePDFReporteCoordinacion(SpartanRDMId, SpartanRDMProcess, RecordId, RoleId) {

    //Get Formatos
    this.sqlModel.query = `exec uspGetFormatosporTipo ${SpartanRDMId},'${SpartanRDMProcess}',${RecordId}, ${RoleId}`;

    this.SpartanService.GetRawQuery(this.sqlModel).subscribe({
      next: (response) => {

        let dt = JSON.parse(response.replace('\\', ''))
        let idFormat = dt[0].formatid;

        //Funcion Descargar PDF
        this.reportesService.GeneratePDF(idFormat, RecordId).subscribe((res) => {

          saveByteArray('Coordinacion de Vuelos.pdf', base64ToArrayBuffer(res), 'application/pdf');

          this.spinner.hide('loading');

        });

      }
    })
  }
  //#endregion


  //#region Validar Formato Bitacora
  fnValidateBitacora() {
    this.sqlModel.query = ` EXEC uspValidarAeronaveBitacoras ${this._Numero_de_Vuelo}`;

    this.SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        if (response >= 1) {
          this.fnGetFormatBitacora()
        }
        else {
          let message = "La aeronave incluida en el vuelo no cuenta con bitácora configurada, favor de notificar al Administrador del Sistema."
          this.ShowMessageType(message, "warning")
        }
      },
    })
  }
  //#endregion


  //#region Get Format Bitacora
  fnGetFormatBitacora() {
    this.sqlModel.query = ` EXEC uspGetFormatBitacora ${this._Numero_de_Vuelo}`;

    this.SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.fnImprimirBitacora(response)
      },
    })
  }
  //#endregion


  //#region Imprimir Bitacora
  fnImprimirBitacora(idFormat) {

    this.pdfCloudService.ImprimirBitacoraVuelo(idFormat, this._Numero_de_Vuelo).subscribe({
      next: (response) => {

        //window.open(response, 'Imprimir Formato_blank');
        saveByteArray('Bitacora Vuelo.pdf', base64ToArrayBuffer(response), 'application/pdf');

      },
    })
  }
  //#endregion


  //#region Parametros para Nueva Ventana
  getParamNewWindow(): string {
    var dualScreenLeft = window.screenLeft != undefined ? window.screenLeft : window.screenX;
    var dualScreenTop = window.screenTop != undefined ? window.screenTop : window.screenY;

    let widthLocal = window.screen.availWidth / 2 + window.screen.availWidth / 10;
    let heightLocal = window.screen.availHeight / 2 + window.screen.availWidth / 7;

    var width = window.innerWidth ? window.innerWidth : document.documentElement.clientWidth ? document.documentElement.clientWidth : screen.width;
    var height = window.innerHeight ? window.innerHeight : document.documentElement.clientHeight ? document.documentElement.clientHeight : screen.height;

    var left = ((width / 2) - (widthLocal / 2)) + dualScreenLeft;
    var top = ((height / 2) - (heightLocal / 2)) + dualScreenTop;

    return 'width=' + widthLocal + ', height=' + heightLocal + ', top=' + top + ', left=' + left;
  }
  //#endregion

  //#region Abrir Modal de Reabrir Vuelo
  async fnOpenModalReabrirVuelo(operation: string, Id: any) {
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalReabrir_vueloComponent, {
      width: '100rem',
      maxHeight: '60rem',
      disableClose: true,
      data: {
        operation: operation,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result != "") {
        this.reloadPage()
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Abrir Modal de Nuevo Registro de Tramo
  fnOpenModalNuevoRegistroTramo(operation: string, Id: any) {

    let Folio_Solicitud = this._Numero_de_Vuelo.toString()
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalRegistroDeVueloComponent, {
      width: '100rem',
      disableClose: false,
      data: {
        operation: operation,
        Folio_Solicitud: Folio_Solicitud,
        FolioRegistroVuelo: this.FolioRegistroVuelo,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result != "") {
        this.reloadPage();
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Funcionalidad Imprimir
  fnImprimirDetalleVuelo(idFormat, RecordId) {

    this.pdfCloudService.GeneratePDF(idFormat, RecordId).subscribe({
      next: (response) => {

        this.sqlModel.query = `SELECT coalesce(Format_Name,'Formatos') Nombre FROM SPARTAN_FORMAT WHERE FormatId = ${idFormat}`

        this.SpartanService.ExecuteQuery(this.sqlModel).subscribe({
          next: (nombre) => {

            saveByteArray(nombre + '.pdf', base64ToArrayBuffer(response), 'application / pdf');
            this.spinner.hide('loading');
          },
        })

      },
    })
  }
  //#endregion


  //#region Abrir Modal de Cierre de Vuelo
  async fnOpenModalEjecucion_de_Vuelo(operation: string, Id: any) {
    this.sqlModel.query = "select Numero_de_Vuelo from Solicitud_de_Vuelo where folio = " + this._Numero_de_Vuelo
    let NumVuelo = await this.SpartanService.ExecuteQuery(this.sqlModel).toPromise();
    let Folio_Solicitud = this._Numero_de_Vuelo.toString() //this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud");
    //let FolioRegistroVuelo = this.localStorageHelper.getItemFromLocalStorage("FolioRegistroVuelo");
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalEjecucionDeVueloComponent, {
      width: '100rem',
      maxHeight: '60rem',
      disableClose: false,
      data: {
        operation: operation,
        Folio_Solicitud: Folio_Solicitud,
        //FolioRegistroVuelo: FolioRegistroVuelo,
        NumVuelo: NumVuelo,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result != "") {
        this.reloadPage();
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Abrir Modal de Comisariato y Notas de Vuelo
  async fnOpenModalComisariato_y_Notas_de_vuelo(operation: string, Id: any) {
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalComisariatoYNotasDeVueloComponent, {
      width: '100rem',
      maxHeight: '60rem',
      disableClose: true,
      data: {
        operation: operation,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result != "") {
        this.reloadPage()
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Abrir Modal de Coordinacion Avisos
  async fnOpenModalCoordinacion_Avisos(operation: string, Id: any) {
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalCoordinacionAvisosComponent, {
      width: '100rem',
      maxHeight: '60rem',
      disableClose: true,
      data: {
        operation: operation,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result !== undefined && result != "") {
        this.loadData = false
        this.reloadPage()

        this.sqlModel.query = `EXEC uspGetCaratulaCoordinacionAvisos ${SpartanOperationId}`
        this.fnGetTableDetails()
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Abrir Modal de Coordinacion Handling
  async fnOpenModalCoordinacion_Handling(operation: string, Id: any) {
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalCoordinacionHandlingComponent, {
      width: '100rem',
      maxHeight: '60rem',
      disableClose: true,
      data: {
        operation: operation,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {

      if (result !== undefined && result != "") {
        this.reloadPage()
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Abrir Modal de Coordinacion Pasajeros
  async fnOpenModalCoordinacion_Pasajeros(operation: string, Id: any) {
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalCoordinacionPasajerosComponent, {
      width: '100rem',
      maxHeight: '60rem',
      disableClose: true,
      data: {
        operation: operation,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result != "") {
        this.reloadPage()
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Abrir Modal de Coordinacion de Vuelo Tripulacion
  async fnOpenModalCoord_de_Vuelo_Tripulacion(operation: string, Id: any) {
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalCoordDeVueloTripulacionComponent, {
      width: '100rem',
      maxHeight: '60rem',
      disableClose: true,
      data: {
        operation: operation,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result != "") {
        this.reloadPage()
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Abrir Modal de Coordinacion de Vuelo Documentacion
  async fnOpenModalCoord_de_Vuelo_Documentacion(operation: string, Id: any) {
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalCoordDeVueloDocumentacionComponent, {
      width: '100rem',
      maxHeight: '60rem',
      disableClose: true,
      data: {
        operation: operation,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result != "") {
        this.reloadPage()
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Abrir Modal de Coordinacion de Gastos de Vuelo
  async fnOpenModalGastos_de_Vuelo(operation: string, Id: any) {
    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');

    const dialogRef = this.dialog.open(ModalGastosDeVueloComponent, {
      width: '100rem',
      maxHeight: '60rem',
      disableClose: true,
      data: {
        operation: operation,
        Id: Id,
        SpartanOperationId: SpartanOperationId
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result !== undefined && result != "") {
        this.reloadPage()
        this.porCargar = true;
      }
    });
  }
  //#endregion


  //#region Recargar despues de Cerrar modal
  reloadPage() {

    this.SpartanService.SetValueExecuteQueryFG("EXEC uspGeneraGastosVuelo " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
    this.fnSelectSolicitud(this.row, this.loadData);

  }
  //#endregion

  //#region Funcionalidad Click en Numero de Solicitud
  async fnSelectSolicitud(row: any, loadData: boolean, fromView?: boolean) {
    this.spinner.show('loading');

    this.row = row;
    this.btnNew = false;

    this._VueloCerrado = (row["Estatus"] == "Cerrado") ? true : false;
    this._Numero_de_Vuelo = row['No. Solicitud'];

    this.localStorageHelper.setItemToLocalStorage("NoVuelo", row['No. Vuelo']);
    this.localStorageHelper.setItemToLocalStorage('SpartanOperationId', row["Folio"]);

    //Obtener Datos de Tabla derecha y pestaña
    await this.GetLogicDataToShow2(row, this.idTablero, loadData);

    //Asignar funcionalidad de pestañas
    this.fnSetResultFinalButtons();

    setTimeout(() => {
      this.DisabledAE(row.Empresa);
      this.BussinesRoles(this.wf);

      if(!fromView){
      this.GetResultSearchTable(null, true);
      }

      if (this.wf == "Gestión de vuelo") {
        document.querySelectorAll('[data-object="46928"]').forEach(e => e.remove()); //OCULTAR REABRIR VUELO EN LA FASE DE GESTIÓN DE VUELO - FELIPE RODRÍGUEZ
      }
      document.querySelectorAll('[data-object="46155"]').forEach(e => e.remove()); //OCULTAR HISTORIAL DE CAMBIOS - LIZETH VILLA
      if (this.tablaDerecha[3].value == 'Cerrado') { //20210924 Ocultar botón de Editar Registro
        this.btnEditarRegistro = false;
      }
    }, 1000);

  }
  //#endregion


  //#region Obtener Datos de Tabla Derecha y Pestañas
  async GetLogicDataToShow2(row: any, idTablero: any, loadData: boolean) {

    this.resultFinal.Label = this.management.Reference_Label;
    this.resultFinal.LabelValue = row["Folio"];
    this.resultFinal.Data = []

    //Titulo de Tabla Derecha
    this.tablaDerechaTitle = `${this.resultFinal.Label} ${this.resultFinal.LabelValue}`;

    let query = this.management.Query_Data_Detail;
    query = query.replace("@@LLAVE@@", row.Folio);

    //Obtener Datos de Resumen (Tabla Derecha)
    this.sqlModel.query = query;
    let _result = await this.fnGetResultFinalData(this.sqlModel);

    //Formatear Datos de Resumen (Tabla Derecha)
    Object.entries(JSON.parse(_result)[0]).find(([key, value]) => {
      this.resultFinal.Data.push({ label: key, value: value, image: '' });
    });

    //Asignar Datos Tabla Derecha
    this.fnSetTablaDerecha(row["Folio"])

    if (!loadData) {
      this.spinner.hide('loading');
      return
    }

    //Obtener Datos Detalle
    let resultDetails = await this.fnGetResultFinalDetail(this.idTablero);

    if (resultDetails && resultDetails.RowCount > 0) {
      let resultDetailsOrder = resultDetails.Spartan_RDM_Operations_Details.sort((a, b) => (a.Order_Shown < b.Order_Shown) ? -1 : 1);

      //Asignar Datos Detalles
      this.resultFinal.Details = await this.fnPreparaObjetoDetails2(resultDetailsOrder, row);

      //console.log(`this.resultFinal`);
      //console.log(`this.resultFinal ${JSON.stringify(this.resultFinal)}`);
      //console.log(`${this.resultFinal}`);

    }

    this.fnManualClickEnTabs();

    this.spinner.hide('loading');
  }
  //#endregion

  fnManualClickEnTabs(){
    setTimeout(() => {
      let yourElem = <HTMLElement>document.querySelector(`button[data-name="${this.LabelDetalle? this.LabelDetalle : 'Registro de Vuelo'}"]`);
      yourElem.click();
    }, 1000);
  }

  
  fnManualClickEnRow(solicitud){
    setTimeout(() => {
      let yourElem = <HTMLElement>document.querySelector(`td[data-sol="${solicitud}"]`);
      yourElem.click();
    }, 2000);
  }

  //#region Obtener Datos de Resumen (Tabla Derecha)
  fnGetResultFinalData(model: q): Promise<any> {
    return new Promise((resolve, reject) => {
      this.SpartanService.GetRawQuery(model).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }
  //#endregion


  //#region Asignar Datos Tabla derecha
  fnSetTablaDerecha(folio) {
    this.folioselected = folio;
    this.IdSelected = folio;

    this.tablaDerecha = [];

    if (this.wf != "Vuelo Cancelado") {
      this.btnEditarRegistro = true;
      this.btnImprimirReporteCoordinacion = true;
    }

    let image = this.resultFinal.Data[0];
    if (image.value == '') {
      this.ImageSearchData = false;
    } else {
      this.ImageSearchDataSRC = image.value;
    }

    let notimage = false;

    this.resultFinal.Data.forEach((data) => {
      if (notimage) {
        let datavalue = data.value ? data.value.toString() : '';
        datavalue = datavalue.trim().replace(/(?:\r\n|\r|\n)/g, ' ');
        let result2 = /\##(.*?)\##/.exec(datavalue);
        let valueSinComent = datavalue.replace(result2?.[0], '');
        if (datavalue.indexOf('@@@@') < 0) {
          this.tablaDerecha.push({ label: data.label, value: datavalue, valueObs: result2, valueSin: valueSinComent });
        } else {
          if (datavalue.indexOf('@@@@_') >= 0) {
            let _urlImg = "assets/images/" + datavalue.replace('@@@@_', '');
            this.tablaDerecha.push({ label: data.label, value: datavalue, image: _urlImg });
          } else {
            this.tablaDerecha.push({ label: data.label, value: datavalue });
          }
        }
      }
      else {
        notimage = true;
      }
    });
  }
  //#endregion


  //#region Obtener Datos de Pestañas
  fnGetResultFinalDetail(idTablero: number): Promise<any> {
    return new Promise((resolve, reject) => {
      this._Spartan_RDM_Operations_DetailService.listaSelAll(0, 20, `Spartan_RDM_Operations_Detail.Record_Detail_Management= ${idTablero} `).subscribe({
        next: data => {
          resolve(data);
        },
        error: err => {
          reject(err);
        }
      });
    });
  }
  //#endregion


  //#region Asignar Detalle de los botones pestañas
  fnSetResultFinalButtons() {
    this.resultFinal.Details.forEach((data) => {
      this.buttonsDetails.push({ label: data.Label, objectid: data.ObjectId, icon: data.Icon, counter: data.Counter });
    });

    // Verifica si deberia reabrir vuelo.
    if (this.RoleId == 12) {
      this.resultFinal.Details.splice(9, 1);
    }

    this.validarBotonCancelar(this.resultFinal);

    if (this.wf == "Vuelo Cancelado") {
      this.ocultarBotonesEnFaseCancelar();
    }
    this.spinner.hide('loading');
  }
  //#endregion


  //#region Obtener datos de las Pestañas inferiores
  async fnPreparaObjetoDetails2(info: any, row: any): Promise<any> {
    try {
      let aux: ResultGeneralDetail;
      let _resultDetails: ResultGeneralDetail[] = [];
      for (let index = 0; index < info.length; index++) {
        let item = info[index];
        aux = new ResultGeneralDetail();
        aux.ObjectId = item.Object_Name;
        let faseStringPaso: string = (this._faseid == null ? "null" : this._faseid.toString());
        let counter = await this.fillByExecuteQuery(item.Count_Query.replace("@@LLAVE@@", row.Folio).replace("@@FASE@@", faseStringPaso));

        if (counter && counter != "[]") {
          aux.Counter = parseInt(JSON.parse(counter)[0].Conteo ?? JSON.parse(counter)[0].Column1);
        } else {
          aux.Counter = 0;
        }

        aux.Label = item.Object_Label;
        let fileInfo = await this.fillFile(item.Icono || null);
        aux.Icon = env.urlpublicaimagenes + "/api/Spartan_File/Files/" + item.Icono + "/" + fileInfo.Description;
        aux.Details = new ModelResultsFields();

        let queryDataDetail: string = item.Query_Data.replace("@@LLAVE@@", row.Folio).replace("@@FASE@@", faseStringPaso);
        let resultQueryDetail: any = await this.fillByExecuteQuery(queryDataDetail);

        if (resultQueryDetail != null && resultQueryDetail != "[]" && resultQueryDetail != "") {
          let objDetail = JSON.parse(resultQueryDetail);
          // Esta linea se puso para obtener la data

          let valuesColumnsDetail: ModelResultsValueFields[] = [];
          let columnsDictionaryDetail = JSON.parse(resultQueryDetail);
          let columnsDetail = [];

          Object.entries(columnsDictionaryDetail[0]).find(([key, value]) => {
            columnsDetail.push(key);
          });

          aux.Details.Columns = columnsDetail;
          //aux.Details.ValuesColumns = ModelResultsValueFields[];
          objDetail.forEach((itemDetail: any) => {
            let row = [];
            columnsDetail.forEach((col: any) => {
              row.push(itemDetail[col] == null ? "" : itemDetail[col].toString());
            });
            let values = new ModelResultsValueFields();
            values.Values = row;
            valuesColumnsDetail.push(values);
          });
          let resultDetailNew = new ModelResultsFields();
          resultDetailNew.Columns = columnsDetail;
          resultDetailNew.ValuesColumns = valuesColumnsDetail;
          resultDetailNew.tableDataSource = objDetail;

          aux.Details = resultDetailNew;
        }
        _resultDetails.push(aux);

      }
      return _resultDetails;
    } catch (error) {
    }
  }
  //#endregion


  //#region Obtener DataTable
  getDataTable(model) {
    this.dataTableJson = new MatTableDataSource([]);

    this.SpartanService.GetJsonQuery(model).subscribe((result) => {

      if (result == null || result.length == 0) {
        this.generateMatTable([])
        return
      }

      let dt = result[0].Table

      var data = []
      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];

        data.push(resDt);
      }


      this.generateMatTable(data)

    });

  }
  //#endregion


  //#region Generar Mat Table
  generateMatTable(result) {

    this.dataTableJson = new MatTableDataSource<any>(result);
    this.dataTableJson.paginator = this.paginator;
    this.dataTableJson.sort = this.sort;

  }
  //#endregion


  //#region Obtener Cantidad de Vuelos
  fnGetQuantityFlights() {
    let where: String = '';

    //WHERE DE WORKFLOW
    if (this.WhereWF != null) {
      if (this.WhereWF != '') {
        if (where != '')
          where += ' AND ';
        where += this.WhereWF.toString();
      }
    }

    if (where != "") {
      if (this.management.Search_Result_Query.toUpperCase().includes('WHERE'))
        where = ' AND ' + where;
      else
        where = ' WHERE ' + where;
    }


    this.sqlModel.query = `SELECT COUNT(*) FROM Solicitud_de_Vuelo ${where} `

    this.SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {

        //this.length = response
        this.length = 100
      },
      error: (e) => console.error(e),
      complete: () => {
      },
    })
  }
  //#endregion


  //#region Accion al Siguiente Pagina
  handlePageEvent(e: PageEvent) {
    this.pageEvent = e;
    this.length = e.length;
    this.pageSize = e.pageSize;
    this.pageIndex = e.pageIndex;
    this.GetResultSearchTable();
  }
  //#endregion


  //#region Llenar Tabla Según Pestaña donde se encuentre
  fnSetTabDetails() {
    switch (this.TabSelected) {
      case 'Registro de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[0]);
        break;
      case 'Comisariato y notas de vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[1]);
        break;
      case 'Coordinación Avisos':
        this.fnClickTabsBadget(this.resultFinal.Details[2]);
        break;
      case 'Coord. de Vuelo- Handling':
        this.fnClickTabsBadget(this.resultFinal.Details[3]);
        break;
      case 'Coord. de Vuelo-Pasajeros':
        this.fnClickTabsBadget(this.resultFinal.Details[4]);
        break;
      case 'Coord. de Vuelo - Tripulación':
        this.fnClickTabsBadget(this.resultFinal.Details[5]);
        break;
      case 'Coord. de Vuelo- Documentación':
        this.fnClickTabsBadget(this.resultFinal.Details[6]);
        break;
      case 'Gastos de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[7]);
        break;
      case 'Cierre de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[8]);
        break;
      default:
    }
  }
  //#endregion


  //#region Obtener Tabla Detalle
  fnGetTableDetails() {
    this.SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      if (result == null || result.length == 0) {
        this.dataSourceTabs = []
        return
      }

      let dt = result[0].Table

      let data = [];
      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];

        resDt.IsDeleted = false;
        resDt.edit = false;
        resDt.isNew = true;
        data.push(resDt);
      }

      let dtt = data.map(obj => ({ ...obj, Acción: this.htmlAcciones }));
      this.dataSourceTabs = dtt

      this.fnSetTabDetails2(data)
    });
  }
  //#endregion


  //#region Llenar Tabla Según Pestaña donde se encuentre
  fnSetTabDetails2(array) {
    switch (this.TabSelected) {
      case 'Registro de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[0]);
        break;
      case 'Comisariato y notas de vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[1]);
        break;
      case 'Coordinación Avisos':

        this.resultFinal.Details[2]["Details"].ValuesColumns[0].Values[5] = array["Calificación"]
        this.resultFinal.Details[2]["Details"].ValuesColumns[0].Values[6] = array["Observaciones"]
        this.resultFinal.Details[2]["Details"].tableDataSource = array

        break;
      case 'Coord. de Vuelo- Handling':
        this.fnClickTabsBadget(this.resultFinal.Details[3]);
        break;
      case 'Coord. de Vuelo-Pasajeros':
        this.fnClickTabsBadget(this.resultFinal.Details[4]);
        break;
      case 'Coord. de Vuelo - Tripulación':
        this.fnClickTabsBadget(this.resultFinal.Details[5]);
        break;
      case 'Coord. de Vuelo- Documentación':
        this.fnClickTabsBadget(this.resultFinal.Details[6]);
        break;
      case 'Gastos de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[7]);
        break;
      case 'Cierre de Vuelo':
        this.fnClickTabsBadget(this.resultFinal.Details[8]);
        break;
      default:
    }

  }
  //#endregion
}


// Solo para tener presentes todas las propiedades de
// Spartan_Record_Detail_ManagementServiceModel
class Spartan_Record_Detail_ManagementServiceModel {

  image_Field_Spartan_Attribute_Bypass?: any;
  object_Spartan_Object_ByPass?: any;
  reference_Field_Spartan_Attribute_Bypass?: any;
  register_User_Spartan_User?: any;
  process_Id: number;
  register_Date: any;
  register_Hour: any;
  register_User: number;
  description: String;
  object: number;
  reference_Label: String;
  reference_Field: number;
  search_Result: number;
  search_Result_Query: String;
  image_Field: number;
  data_Detail: number;
  query_Data_Detail: String;
  id: number;

  constructor() {

  }

}

