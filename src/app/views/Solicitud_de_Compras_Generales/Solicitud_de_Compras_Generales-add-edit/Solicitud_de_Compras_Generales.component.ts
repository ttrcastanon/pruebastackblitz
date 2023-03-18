import { AfterViewInit, Component, ElementRef, LOCALE_ID, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { GeneralService } from 'src/app/api-services/general.service';
import { Solicitud_de_Compras_GeneralesService } from 'src/app/api-services/Solicitud_de_Compras_Generales.service';
import { Solicitud_de_Compras_Generales } from 'src/app/models/Solicitud_de_Compras_Generales';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { Orden_de_servicioService } from 'src/app/api-services/Orden_de_servicio.service';
import { Orden_de_servicio } from 'src/app/models/Orden_de_servicio';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Departamento } from 'src/app/models/Departamento';
import { Tipo_de_Solicitud_de_ComprasService } from 'src/app/api-services/Tipo_de_Solicitud_de_Compras.service';
import { Tipo_de_Solicitud_de_Compras } from 'src/app/models/Tipo_de_Solicitud_de_Compras';
import { Estatus_de_Solicitud_de_Compras_GeneralesService } from 'src/app/api-services/Estatus_de_Solicitud_de_Compras_Generales.service';
import { Estatus_de_Solicitud_de_Compras_Generales } from 'src/app/models/Estatus_de_Solicitud_de_Compras_Generales';
import { Detalle_de_Item_Compras_GeneralesService } from 'src/app/api-services/Detalle_de_Item_Compras_Generales.service';
import { Detalle_de_Item_Compras_Generales } from 'src/app/models/Detalle_de_Item_Compras_Generales';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { UrgenciaService } from 'src/app/api-services/Urgencia.service';
import { Urgencia } from 'src/app/models/Urgencia';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { AutorizacionService } from 'src/app/api-services/Autorizacion.service';
import { Autorizacion } from 'src/app/models/Autorizacion';
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';
import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";
import { MatDialog } from '@angular/material/dialog';
import { Lista_PredeterminadaComponent } from '../../Lista_Predeterminada/Lista_Predeterminada-add-edit/Lista_Predeterminada.component';
import { ListLista_PredeterminadaComponent } from '../../Lista_Predeterminada/list-Lista_Predeterminada/list-Lista_Predeterminada.component';

import { Lista_Predeterminada_Seleccionar } from 'src/app/models/Lista_Predeterminada_Seleccionar';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { q } from 'src/app/models/business-rules/business-rule-query.model';

registerLocaleData(localeEs, 'es')

@Component({
  selector: 'app-Solicitud_de_Compras_Generales',
  templateUrl: './Solicitud_de_Compras_Generales.component.html',
  styleUrls: ['./Solicitud_de_Compras_Generales.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Solicitud_de_Compras_GeneralesComponent implements OnInit, AfterViewInit, OnDestroy {
MRaddItem_Compras_Generales: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  Phase: any

  Solicitud_de_Compras_GeneralesForm: FormGroup;
  public Editor = ClassicEditor;
  model: Solicitud_de_Compras_Generales;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varSpartan_User: Spartan_User[] = [];
  optionsProveedor: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor: boolean;

  optionsNo_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
  hasOptionsNo_de_Vuelo: boolean;

  optionsTramo: Observable<Aeropuertos[]>;
  hasOptionsTramo: boolean;

  optionsNumero_de_O_S: Observable<Orden_de_servicio[]>;
  hasOptionsNumero_de_O_S: boolean;

  optionsNumero_de_O_T: Observable<Orden_de_Trabajo[]>;
  hasOptionsNumero_de_O_T: boolean;

  public varDepartamento: Departamento[] = [];
  public varTipo_de_Solicitud_de_Compras: Tipo_de_Solicitud_de_Compras[] = [];
  public varEstatus_de_Solicitud_de_Compras_Generales: Estatus_de_Solicitud_de_Compras_Generales[] = [];
  public varUnidad: Unidad[] = [];
  public varUrgencia: Urgencia[] = [];
  public varEstatus_de_Seguimiento: Estatus_de_Seguimiento[] = [];

  autoUnidad_de_Medida_Detalle_de_Item_Compras_Generales = new FormControl();
  SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales: string[] = [];
  isLoadingUnidad_de_Medida_Detalle_de_Item_Compras_Generales: boolean;
  searchUnidad_de_Medida_Detalle_de_Item_Compras_GeneralesCompleted: boolean;
  autoUrgencia_Detalle_de_Item_Compras_Generales = new FormControl();
  SelectedUrgencia_Detalle_de_Item_Compras_Generales: string[] = [];
  isLoadingUrgencia_Detalle_de_Item_Compras_Generales: boolean;
  searchUrgencia_Detalle_de_Item_Compras_GeneralesCompleted: boolean;

  public varAutorizacion: Autorizacion[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  //@ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceItem_Compras_Generales = new MatTableDataSource<Detalle_de_Item_Compras_Generales>();
  Item_Compras_GeneralesColumns = [
    { def: 'actions', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Cantidad_Requerida', hide: false },
    { def: 'Unidad_de_Medida', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Aplicacion_y_Justificacion', hide: false },
    { def: 'Fecha_requerida', hide: false },
    { def: 'Observaciones', hide: false },
    //{ def: 'Estatus_de_Seguimiento', hide: false },

  ];
  Item_Compras_GeneralesData: Detalle_de_Item_Compras_Generales[] = [];
  isItem_Compras_GeneralesAdd: boolean = true;

  isSendRequest: boolean = false;

  public openWindows: any;
  today = new Date;
  consult: boolean = false;

  dataSourceLista_Predeterminada_Seleccionar = new MatTableDataSource<Lista_Predeterminada_Seleccionar>();
  Lista_Predeterminada_SeleccionarColumns = [
    { def: 'actions', hide: true },

    { def: 'Seleccionar', hide: false },
    { def: 'Folio', hide: false },
    { def: 'Fecha_de_Registro', hide: false },
    { def: 'Hora_de_Registro', hide: false },
    { def: 'Usuario_que_Registra', hide: true },
    { def: 'Nombre_Usuario_que_Registra', hide: false },
    { def: 'Nombre_de_Lista_Predeterminada', hide: false },

  ];

  dataSourceLista_Predeterminada_SeleccionarPaso: any = null;

  @ViewChild('paginatorItem_Compras_Generales') paginatorItem_Compras_Generales: MatPaginator;
  //@ViewChild('paginatorLista_Predeterminada') paginatorLista_Predeterminada: MatPaginator;

  timerStart: boolean = false;
  interval;

  varUnidadMedida: any
  varUrgenciaArray: any

  listaProveedores: Observable<Creacion_de_Proveedores[]>;
  listaNo_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
  listaTramo = [];
  listaNumero_de_O_S: Observable<Orden_de_servicio[]>;
  listaNumero_de_O_T: Observable<Orden_de_Trabajo[]>;

  isLoadingProveedor: boolean = false
  isLoadingNo_de_Vuelo: boolean = false
  isLoadingTramo: boolean = false
  isLoadingNumero_de_O_S: boolean = false
  isLoadingNumero_de_O_T: boolean = false

  notFound: string = "No se encontraron registros."
  loadingText: string = "Cargando..."

  //#endregion

  constructor(
    private fb: FormBuilder,
    generalService: GeneralService,
    private Solicitud_de_Compras_GeneralesService: Solicitud_de_Compras_GeneralesService,
    private Spartan_UserService: Spartan_UserService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeropuertosService: AeropuertosService,
    private Orden_de_servicioService: Orden_de_servicioService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private DepartamentoService: DepartamentoService,
    private Tipo_de_Solicitud_de_ComprasService: Tipo_de_Solicitud_de_ComprasService,
    private Estatus_de_Solicitud_de_Compras_GeneralesService: Estatus_de_Solicitud_de_Compras_GeneralesService,
    private Detalle_de_Item_Compras_GeneralesService: Detalle_de_Item_Compras_GeneralesService,
    private UnidadService: UnidadService,
    private UrgenciaService: UrgenciaService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,
    private AutorizacionService: AutorizacionService,
    private _seguridad: SeguridadService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private _SpartanService: SpartanService,
    private modalService: NgbModal,
    renderer: Renderer2,
    public dialog: MatDialog,

  ) {

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.Phase = this.localStorageHelper.getItemFromLocalStorage('Phase');
    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.model = new Solicitud_de_Compras_Generales(this.fb);
    this.Solicitud_de_Compras_GeneralesForm = this.model.buildFormGroup();
    this.Item_Compras_GeneralesItems.removeAt(0);

    this.Solicitud_de_Compras_GeneralesForm.get('No_de_Solicitud').disable();
    this.Solicitud_de_Compras_GeneralesForm.get('No_de_Solicitud').setValue('Auto');

    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Item_Compras_GeneralesColumns.splice(0, 1);
        this.Lista_Predeterminada_SeleccionarColumns.splice(0, 1);

        this.Solicitud_de_Compras_GeneralesForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Solicitud_de_Compras_Generales).subscribe((response) => {
      this.permisos = response;
    });

    if (!this.timerStart) {
      this.startTimer();
    }

  }

  //#region Lista Predeterminada
  get Lista_Predeterminada_Seleccionar_Items() {
    return this.Solicitud_de_Compras_GeneralesForm.get('Lista_Predeterminada_SeleccionarItems') as FormArray;
  }

  Lista_Predeterminada_Seleccionar_ItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceLista_Predeterminada_Seleccionar.data.indexOf(element);
    let fb = this.Lista_Predeterminada_Seleccionar_Items.controls[index] as FormGroup;
    return fb;
  }

  OpenModal_Lista_Compras_Seleccionar(content) {

    this.dataSourceLista_Predeterminada_SeleccionarPaso = this.dataSourceItem_Compras_Generales.data.filter(r => r.Folio == 0);

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then(
      (result) => {

      },
      (reason) => {
        if (reason == 0 || reason == "cerrar" || reason == "cancelar") {
          //SE LIMPIA EL DATASOURCE DE PASO
          this.dataSourceLista_Predeterminada_SeleccionarPaso = this.dataSourceItem_Compras_Generales.data.filter(r => r.Folio == 0);
        }
      },
    );
  }

  Lista_Predeterminada_Seleccionar_Toggle(row, event) {

    let model: q = new q();
    model.id = 1;
    // model.query = `SELECT Folio, Lista_Predeterminada, Descripcion, Cantidad_Requerida, Unidad_de_Medida, Urgencia, Aplicacion_y_Justificacion, 
    // Fecha_requerida, Observaciones FROM Detalle_de_Lista_Predeterminada WHERE Lista_Predeterminada = ${row.Folio}`;
    model.query = `SELECT 0 Folio, Lista_Predeterminada, Detalle_de_Lista_Predeterminada.Descripcion, Cantidad_Requerida, Unidad_de_Medida, 
    Unidad.Descripcion Descripcion_Unidad_de_Medida, Urgencia, Urgencia.Descripcion Descripcion_Urgencia, Aplicacion_y_Justificacion, Fecha_requerida, Observaciones 
    FROM Detalle_de_Lista_Predeterminada 
    INNER JOIN Unidad ON Unidad.Clave = Detalle_de_Lista_Predeterminada.Unidad_de_Medida 
    INNER JOIN Urgencia ON Urgencia.Folio = Detalle_de_Lista_Predeterminada.Urgencia 
    WHERE Lista_Predeterminada = ${row.Folio}`;
    model.securityCode = "ABC123";

    if (event.checked) {
      this._SpartanService.GetRawQuery(model).subscribe((result) => {
        let dt = JSON.parse(result.replace('\\', ''));

        for (var i = 0; i < dt.length; i++) {
          let resDt = dt[i];
          resDt.IsDeleted = false;
          resDt.edit = false;
          resDt.isNew = true;

          resDt["Unidad_de_Medida_Unidad"] = { Descripcion: "" }
          resDt["Urgencia_Urgencia"] = { Descripcion: "" }

          resDt["Unidad_de_Medida_Unidad"]["Descripcion"] = resDt.Descripcion_Unidad_de_Medida
          resDt["Urgencia_Urgencia"]["Descripcion"] = resDt.Descripcion_Urgencia

          this.dataSourceLista_Predeterminada_SeleccionarPaso?.push(resDt);
        }
      });
    }
    else {
      let dtPaso = this.dataSourceLista_Predeterminada_SeleccionarPaso.filter(r => r.Lista_Predeterminada != row.Folio);
      this.dataSourceLista_Predeterminada_SeleccionarPaso = dtPaso;
    }
  }

  async GuardarDatos_Seleccionar_Lista_Predeterminada() {

    this.Item_Compras_GeneralesData = this.dataSourceLista_Predeterminada_SeleccionarPaso;
    this.loadItem_Compras_Generales(this.dataSourceLista_Predeterminada_SeleccionarPaso);
    this.dataSourceItem_Compras_Generales = new MatTableDataSource(this.dataSourceLista_Predeterminada_SeleccionarPaso)
    this.dataSourceItem_Compras_Generales.paginator = this.paginatorItem_Compras_Generales;
    this.dataSourceItem_Compras_Generales.sort = this.sort;

    this.dataSourceLista_Predeterminada_SeleccionarPaso = this.dataSourceItem_Compras_Generales.data.filter(r => r.Folio == 0);
    this.modalService.dismissAll();
  }

  getLista_Predeterminada_SeleccionarColumns(): string[] {
    return this.Lista_Predeterminada_SeleccionarColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }
  //#endregion


  ngAfterViewInit(): void {
    this.dataSourceItem_Compras_Generales.paginator = this.paginatorItem_Compras_Generales;
    //this.dataSourceLista_Predeterminada_Seleccionar.paginator = this.paginatorLista_Predeterminada;
    this.rulesAfterViewInit();
  }


  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.No_de_Solicitud = +params.get('id');

        if (this.model.No_de_Solicitud) {
          this.operation = !this.Solicitud_de_Compras_GeneralesForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.No_de_Solicitud);
        } else {
          this.operation = "New";
          this.rulesOnInit();
        }
      });
  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Solicitud_de_Compras_GeneralesService.listaSelAll(0, 1, 'Solicitud_de_Compras_Generales.No_de_Solicitud=' + id).toPromise();
    if (result.Solicitud_de_Compras_Generaless.length > 0) {

      this.model.fromObject(result.Solicitud_de_Compras_Generaless[0]);

      await this.onChangeNumero_de_Vuelo(0)

      this.Solicitud_de_Compras_GeneralesForm.get('Proveedor').setValue(
        result.Solicitud_de_Compras_Generaless[0].Proveedor, { onlySelf: false, emitEvent: true }
      );

      this.Solicitud_de_Compras_GeneralesForm.get('No_de_Vuelo').setValue(
        result.Solicitud_de_Compras_Generaless[0].No_de_Vuelo, { onlySelf: false, emitEvent: true }
      );

      this.Solicitud_de_Compras_GeneralesForm.get('Tramo').setValue(
        result.Solicitud_de_Compras_Generaless[0].Tramo, { onlySelf: false, emitEvent: true }
      );

      this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_S').setValue(
        result.Solicitud_de_Compras_Generaless[0].Numero_de_O_S, { onlySelf: false, emitEvent: true }
      );

      this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_T').setValue(
        result.Solicitud_de_Compras_Generaless[0].Numero_de_O_T, { onlySelf: false, emitEvent: true }
      );

      this.fnSetDateHourAutorizar()

      await this.Detalle_de_Item_Compras_GeneralesService.listaSelAll(0, 1000, 'Solicitud_de_Compras_Generales.No_de_Solicitud=' + id).toPromise().then(fItem_Compras_Generales => {
        this.Item_Compras_GeneralesData = fItem_Compras_Generales.Detalle_de_Item_Compras_Generaless;
        this.loadItem_Compras_Generales(fItem_Compras_Generales.Detalle_de_Item_Compras_Generaless);
        this.dataSourceItem_Compras_Generales = new MatTableDataSource(fItem_Compras_Generales.Detalle_de_Item_Compras_Generaless);
        this.dataSourceItem_Compras_Generales.paginator = this.paginatorItem_Compras_Generales;
        this.dataSourceItem_Compras_Generales.sort = this.sort;

        this.rulesOnInit();
      });

      this.Solicitud_de_Compras_GeneralesForm.markAllAsTouched();
      this.Solicitud_de_Compras_GeneralesForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  //#region Compras Generales Items
  get Item_Compras_GeneralesItems() {
    return this.Solicitud_de_Compras_GeneralesForm.get('Detalle_de_Item_Compras_GeneralesItems') as FormArray;
  }

  getItem_Compras_GeneralesColumns(): string[] {
    return this.Item_Compras_GeneralesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadItem_Compras_Generales(Item_Compras_Generales: Detalle_de_Item_Compras_Generales[]) {
    Item_Compras_Generales.forEach(element => {
      this.addItem_Compras_Generales(element);
    });
  }

  addItem_Compras_GeneralesToMR() {
    const Item_Compras_Generales = new Detalle_de_Item_Compras_Generales(this.fb);
    this.Item_Compras_GeneralesData.push(this.addItem_Compras_Generales(Item_Compras_Generales));
    this.dataSourceItem_Compras_Generales.data = this.Item_Compras_GeneralesData;
    Item_Compras_Generales.edit = true;
    Item_Compras_Generales.isNew = true;
    const length = this.dataSourceItem_Compras_Generales.data.length;
    const index = length - 1;
    const formItem_Compras_Generales = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
    this.addFilterToControlUnidad_de_Medida_Detalle_de_Item_Compras_Generales(formItem_Compras_Generales.controls.Unidad_de_Medida, index);
    this.addFilterToControlUrgencia_Detalle_de_Item_Compras_Generales(formItem_Compras_Generales.controls.Urgencia, index);

    const page = Math.ceil(this.dataSourceItem_Compras_Generales.data.filter(d => !d.IsDeleted).length / this.paginatorItem_Compras_Generales.pageSize);
    if (page !== this.paginatorItem_Compras_Generales.pageIndex) {
      this.paginatorItem_Compras_Generales.pageIndex = page;
    }

    this.isItem_Compras_GeneralesAdd = !this.isItem_Compras_GeneralesAdd
  }

  addItem_Compras_Generales(entity: Detalle_de_Item_Compras_Generales) {
    const Item_Compras_Generales = new Detalle_de_Item_Compras_Generales(this.fb);
    this.Item_Compras_GeneralesItems.push(Item_Compras_Generales.buildFormGroup());
    if (entity) {
      Item_Compras_Generales.fromObject(entity);
    }
    return entity;
  }

  Item_Compras_GeneralesItemsByFolio(Folio: number): FormGroup {
    return (this.Solicitud_de_Compras_GeneralesForm.get('Detalle_de_Item_Compras_GeneralesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Item_Compras_GeneralesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    let fb = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteItem_Compras_Generales(element: any) {
    let index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    this.Item_Compras_GeneralesData[index]["IsDeleted"] = true;
    this.dataSourceItem_Compras_Generales.data = this.Item_Compras_GeneralesData;
    this.dataSourceItem_Compras_Generales._updateChangeSubscription();
    index = this.dataSourceItem_Compras_Generales.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorItem_Compras_Generales.pageSize);
    if (page !== this.paginatorItem_Compras_Generales.pageIndex) {
      this.paginatorItem_Compras_Generales.pageIndex = page;
    }
  }

  cancelEditItem_Compras_Generales(element: any) {

    let index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Item_Compras_GeneralesData[index].IsDeleted = true;
      this.dataSourceItem_Compras_Generales.data = this.Item_Compras_GeneralesData;
      this.dataSourceItem_Compras_Generales._updateChangeSubscription();
      index = this.Item_Compras_GeneralesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginatorItem_Compras_Generales.pageSize);
      if (page !== this.paginatorItem_Compras_Generales.pageIndex) {
        this.paginatorItem_Compras_Generales.pageIndex = page;
      }
    }

    let detalle = this.Solicitud_de_Compras_GeneralesForm.get('Detalle_de_Item_Compras_GeneralesItems') as FormArray

    if (detalle.invalid) {
      detalle.removeAt(index)
      this.Item_Compras_GeneralesData.splice(index, 1)
    }

    this.isItem_Compras_GeneralesAdd = true;
  }

  async saveItem_Compras_Generales(element: any) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    const formItem_Compras_Generales = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
    this.Item_Compras_GeneralesData[index].Descripcion = formItem_Compras_Generales.value.Descripcion;
    this.Item_Compras_GeneralesData[index].Cantidad_Requerida = formItem_Compras_Generales.value.Cantidad_Requerida;

    if (this.Item_Compras_GeneralesData[index].Unidad_de_Medida !== formItem_Compras_Generales.value.Unidad_de_Medida && formItem_Compras_Generales.value.Unidad_de_Medida > 0) {
      let unidad = await this.UnidadService.getById(formItem_Compras_Generales.value.Unidad_de_Medida).toPromise();
      this.Item_Compras_GeneralesData[index].Unidad_de_Medida_Unidad = unidad;
    }
    this.Item_Compras_GeneralesData[index].Unidad_de_Medida = formItem_Compras_Generales.value.Unidad_de_Medida;

    if (this.Item_Compras_GeneralesData[index].Urgencia !== formItem_Compras_Generales.value.Urgencia && formItem_Compras_Generales.value.Urgencia > 0) {
      let urgencia = await this.UrgenciaService.getById(formItem_Compras_Generales.value.Urgencia).toPromise();
      this.Item_Compras_GeneralesData[index].Urgencia_Urgencia = urgencia;
    }
    this.Item_Compras_GeneralesData[index].Urgencia = formItem_Compras_Generales.value.Urgencia;
    this.Item_Compras_GeneralesData[index].Aplicacion_y_Justificacion = formItem_Compras_Generales.value.Aplicacion_y_Justificacion;
    this.Item_Compras_GeneralesData[index].Fecha_requerida = formItem_Compras_Generales.value.Fecha_requerida;
    this.Item_Compras_GeneralesData[index].Observaciones = formItem_Compras_Generales.value.Observaciones;
    this.Item_Compras_GeneralesData[index].Estatus_de_Seguimiento = formItem_Compras_Generales.value.Estatus_de_Seguimiento;
    this.Item_Compras_GeneralesData[index].Estatus_de_Seguimiento_Estatus_de_Seguimiento = formItem_Compras_Generales.value.Estatus_de_Seguimiento !== '' ?
      this.varEstatus_de_Seguimiento.filter(d => d.Folio === formItem_Compras_Generales.value.Estatus_de_Seguimiento)[0] : null;

    this.Item_Compras_GeneralesData[index].isNew = false;
    this.dataSourceItem_Compras_Generales.data = this.Item_Compras_GeneralesData;
    this.dataSourceItem_Compras_Generales._updateChangeSubscription();

    this.isItem_Compras_GeneralesAdd = true;

  }

  editItem_Compras_Generales(element: any) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    const formItem_Compras_Generales = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
    this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index] = this.dataSourceItem_Compras_Generales.data[index].Unidad_de_Medida_Unidad?.Descripcion;
    this.addFilterToControlUnidad_de_Medida_Detalle_de_Item_Compras_Generales(formItem_Compras_Generales.controls.Unidad_de_Medida, index);
    this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index] = this.dataSourceItem_Compras_Generales.data[index].Urgencia_Urgencia?.Descripcion;
    this.addFilterToControlUrgencia_Detalle_de_Item_Compras_Generales(formItem_Compras_Generales.controls.Urgencia, index);

    element.edit = true;
    this.isItem_Compras_GeneralesAdd = true;

  }

  async saveDetalle_de_Item_Compras_Generales(Folio: number) {
    this.dataSourceItem_Compras_Generales.data.forEach(async (d, index) => {
      //const data = this.Item_Compras_GeneralesItems.controls[index] as FormGroup;
      let model = d;
      model.Solicitud_de_Compras_Generales = Folio;

      if (model.Folio === 0 && !d.IsDeleted) {
        // Add Item Compras Generales
        let response = await this.Detalle_de_Item_Compras_GeneralesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formItem_Compras_Generales = this.Item_Compras_GeneralesItemsByFolio(model.Folio);
        if (formItem_Compras_Generales.dirty) {
          // Update Item Compras Generales
          let response = await this.Detalle_de_Item_Compras_GeneralesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Item Compras Generales
        await this.Detalle_de_Item_Compras_GeneralesService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectUnidad_de_Medida_Detalle_de_Item_Compras_Generales(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_Compras_GeneralesForm.controls.Detalle_de_Item_Compras_GeneralesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad_de_Medida.setValue(event.option.value);
    this.displayFnUnidad_de_Medida_Detalle_de_Item_Compras_Generales(element);
  }

  displayFnUnidad_de_Medida_Detalle_de_Item_Compras_Generales(this, element) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    return this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index];
  }

  updateOptionUnidad_de_Medida_Detalle_de_Item_Compras_Generales(event, element: any) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index] = event.source.viewValue;
  }

  _filterUnidad_de_Medida_Detalle_de_Item_Compras_Generales(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_de_Medida_Detalle_de_Item_Compras_Generales(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_de_Medida_Detalle_de_Item_Compras_Generales = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_de_Medida_Detalle_de_Item_Compras_Generales = true;
        return this._filterUnidad_de_Medida_Detalle_de_Item_Compras_Generales(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_de_Medida_Detalle_de_Item_Compras_Generales = false;
      this.searchUnidad_de_Medida_Detalle_de_Item_Compras_GeneralesCompleted = true;
      this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_de_Medida_Detalle_de_Item_Compras_Generales[index];
    });
  }

  public selectUrgencia_Detalle_de_Item_Compras_Generales(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_Compras_GeneralesForm.controls.Detalle_de_Item_Compras_GeneralesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Urgencia.setValue(event.option.value);
    this.displayFnUrgencia_Detalle_de_Item_Compras_Generales(element);
  }

  displayFnUrgencia_Detalle_de_Item_Compras_Generales(this, element) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    return this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index];
  }

  updateOptionUrgencia_Detalle_de_Item_Compras_Generales(event, element: any) {
    const index = this.dataSourceItem_Compras_Generales.data.indexOf(element);
    this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index] = event.source.viewValue;
  }

  _filterUrgencia_Detalle_de_Item_Compras_Generales(filter: any): Observable<Urgencia> {
    const where = filter !== '' ? "Urgencia.Descripcion like '%" + filter + "%'" : '';
    return this.UrgenciaService.listaSelAll(0, 20, where);
  }

  addFilterToControlUrgencia_Detalle_de_Item_Compras_Generales(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUrgencia_Detalle_de_Item_Compras_Generales = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUrgencia_Detalle_de_Item_Compras_Generales = true;
        return this._filterUrgencia_Detalle_de_Item_Compras_Generales(value || '');
      })
    ).subscribe(result => {
      this.varUrgencia = result.Urgencias;
      this.isLoadingUrgencia_Detalle_de_Item_Compras_Generales = false;
      this.searchUrgencia_Detalle_de_Item_Compras_GeneralesCompleted = true;
      this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index] = this.varUrgencia.length === 0 ? '' : this.SelectedUrgencia_Detalle_de_Item_Compras_Generales[index];
    });
  }
  //#endregion


  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Spartan_UserService.getAll());
    observablesArray.push(this.DepartamentoService.getAll());
    observablesArray.push(this.Tipo_de_Solicitud_de_ComprasService.getAll());
    observablesArray.push(this.Estatus_de_Solicitud_de_Compras_GeneralesService.getAll());
    observablesArray.push(this.Estatus_de_SeguimientoService.getAll());
    observablesArray.push(this.AutorizacionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varSpartan_User, varDepartamento, varTipo_de_Solicitud_de_Compras, varEstatus_de_Solicitud_de_Compras_Generales, varEstatus_de_Seguimiento, varAutorizacion]) => {
          this.varSpartan_User = varSpartan_User;
          this.varDepartamento = varDepartamento;
          this.varTipo_de_Solicitud_de_Compras = varTipo_de_Solicitud_de_Compras;
          this.varEstatus_de_Solicitud_de_Compras_Generales = varEstatus_de_Solicitud_de_Compras_Generales;
          this.varEstatus_de_Seguimiento = varEstatus_de_Seguimiento;
          this.varAutorizacion = varAutorizacion;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.getUnidadMedida()
    this.getUrgenciaArray();
    this.setDataFromSelects()

  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Usuario_que_Registra': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Departamento': {
        this.DepartamentoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDepartamento = x.Departamentos;
        });
        break;
      }
      case 'Tipo': {
        this.Tipo_de_Solicitud_de_ComprasService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Solicitud_de_Compras = x.Tipo_de_Solicitud_de_Comprass;
        });
        break;
      }
      case 'Estatus_de_Solicitud': {
        this.Estatus_de_Solicitud_de_Compras_GeneralesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Solicitud_de_Compras_Generales = x.Estatus_de_Solicitud_de_Compras_Generaless;
        });
        break;
      }
      case 'Estatus_de_Seguimiento': {
        this.Estatus_de_SeguimientoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Seguimiento = x.Estatus_de_Seguimientos;
        });
        break;
      }

      case 'Autorizado_por': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Resultado': {
        this.AutorizacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAutorizacion = x.Autorizacions;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnProveedor(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }
  displayFnNo_de_Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }
  displayFnTramo(option: Aeropuertos) {
    return option?.ICAO_IATA;
  }
  displayFnNumero_de_O_S(option: Orden_de_servicio) {
    return option?.Folio_OS;
  }
  displayFnNumero_de_O_T(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }


  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');

    if (await this.rulesBeforeSave()) {
      this.Solicitud_de_Compras_GeneralesForm.enable();
      const entity = this.Solicitud_de_Compras_GeneralesForm.value;

      entity.No_de_Solicitud = this.model.No_de_Solicitud;
      entity.Proveedor = this.Solicitud_de_Compras_GeneralesForm.get('Proveedor').value;
      entity.No_de_Vuelo = this.Solicitud_de_Compras_GeneralesForm.get('No_de_Vuelo').value;
      entity.Tramo = this.Solicitud_de_Compras_GeneralesForm.get('Tramo').value;
      entity.Numero_de_O_S = this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_S').value;
      entity.Numero_de_O_T = this.Solicitud_de_Compras_GeneralesForm.get('Numero_de_O_T').value;

      if (entity.Proveedor == 0 || entity.Proveedor == "") delete entity.Proveedor
      if (entity.No_de_Vuelo == 0 || entity.No_de_Vuelo == "") delete entity.No_de_Vuelo
      if (entity.Tramo == 0 || entity.Tramo == "") delete entity.Tramo
      if (entity.Numero_de_O_S == 0 || entity.Numero_de_O_S == "") delete entity.Numero_de_O_S
      if (entity.Numero_de_O_T == 0 || entity.Numero_de_O_T == "") delete entity.Numero_de_O_T

      if (this.model.No_de_Solicitud > 0) {

        await this.Solicitud_de_Compras_GeneralesService.update(this.model.No_de_Solicitud, entity).toPromise().then(async id => {
          await this.saveDetalle_de_Item_Compras_Generales(this.model.No_de_Solicitud);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.No_de_Solicitud.toString());
          this.spinner.hide('loading');
          this.rulesAfterSave();

          return this.model.No_de_Solicitud;
        });

      }
      else {
        await (this.Solicitud_de_Compras_GeneralesService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Item_Compras_Generales(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          this.rulesAfterSave();

          return id;
        }));
      }
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
      this.isLoading = false;
      this.spinner.hide('loading');
    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.No_de_Solicitud === 0) {
      this.Solicitud_de_Compras_GeneralesForm.reset();
      this.model = new Solicitud_de_Compras_Generales(this.fb);
      this.Solicitud_de_Compras_GeneralesForm = this.model.buildFormGroup();
      this.dataSourceItem_Compras_Generales = new MatTableDataSource<Detalle_de_Item_Compras_Generales>();
      this.Item_Compras_GeneralesData = [];

    } else {
      this.router.navigate(['views/Solicitud_de_Compras_Generales/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.No_de_Solicitud = 0;

  }

  cancel() {
    this.goToList();
  }

  goToList() {

    this.router.navigate(['/Solicitud_de_Compras_Generales/list/' + this.Phase], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Fecha_de_Registro_ExecuteBusinessRules(): void {
    //Fecha_de_Registro_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Registro_ExecuteBusinessRules(): void {
    //Hora_de_Registro_FieldExecuteBusinessRulesEnd
  }
  Usuario_que_Registra_ExecuteBusinessRules(): void {
    //Usuario_que_Registra_FieldExecuteBusinessRulesEnd
  }
  Razon_de_la_Compra_ExecuteBusinessRules(): void {
    //Razon_de_la_Compra_FieldExecuteBusinessRulesEnd
  }
  Proveedor_ExecuteBusinessRules(): void {
    //Proveedor_FieldExecuteBusinessRulesEnd
  }
  No_de_Vuelo_ExecuteBusinessRules(): void {

    //INICIA - BRID:3522 - Al seleccionar el vuelo, filtrar los tramos del vuelo seleccionado. - Autor: Lizeth Villa - Actualización: 8/13/2021 12:48:10 PM

    //TERMINA - BRID:3522

    //No_de_Vuelo_FieldExecuteBusinessRulesEnd

  }
  Tramo_ExecuteBusinessRules(): void {
    //Tramo_FieldExecuteBusinessRulesEnd
  }
  Numero_de_O_S_ExecuteBusinessRules(): void {
    //Numero_de_O_S_FieldExecuteBusinessRulesEnd
  }
  Numero_de_O_T_ExecuteBusinessRules(): void {
    //Numero_de_O_T_FieldExecuteBusinessRulesEnd
  }
  Departamento_ExecuteBusinessRules(): void {
    //Departamento_FieldExecuteBusinessRulesEnd
  }
  Tipo_ExecuteBusinessRules(): void {
    //Tipo_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    //Observaciones_FieldExecuteBusinessRulesEnd
  }
  Motivo_de_Cancelacion_ExecuteBusinessRules(): void {
    //Motivo_de_Cancelacion_FieldExecuteBusinessRulesEnd
  }
  Enviar_Solicitud_ExecuteBusinessRules(): void {
    //Enviar_Solicitud_FieldExecuteBusinessRulesEnd
  }
  Estatus_de_Solicitud_ExecuteBusinessRules(): void {
    //Estatus_de_Solicitud_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Autorizacion_ExecuteBusinessRules(): void {
    //Fecha_de_Autorizacion_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Autorizacion_ExecuteBusinessRules(): void {
    //Hora_de_Autorizacion_FieldExecuteBusinessRulesEnd
  }
  Autorizado_por_ExecuteBusinessRules(): void {
    //Autorizado_por_FieldExecuteBusinessRulesEnd
  }
  Resultado_ExecuteBusinessRules(): void {
    //Resultado_FieldExecuteBusinessRulesEnd
  }
  Observacion_ExecuteBusinessRules(): void {
    //Observacion_FieldExecuteBusinessRulesEnd
  }



  applyRules() { }

  filterComboObservable(): Observable<FilterCombo> {
    return this.filterComboEmiter.asObservable();
  }

  filterCombo(nameCombo: string, filter: string) {
    const filterCombo: FilterCombo = { nameCombo, filter };
    this.filterComboEmiter.next(filterCombo);
  }

  rulesAfterViewInit() {

  }

  async rulesOnInit() {
    //rulesOnInit_ExecuteBusinessRulesInit

    //BRID:3196 - No son requeridos los campos de Orden se Servicio, Orden de Trabajo y Número de Vuelo. - Autor: Lizeth Villa - Actualización: 6/21/2021 1:14:23 PM
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "No_de_Vuelo");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Numero_de_O_S");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Numero_de_O_T");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Observaciones");

    //BRID:3203 - Deshabilitar campos siempre. - Autor: Lizeth Villa - Actualización: 6/2/2021 3:15:54 PM
    this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_de_Registro', 0);
    this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Hora_de_Registro', 0);
    this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Usuario_que_Registra', 0);
    this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Departamento', 0);
    this.Solicitud_de_Compras_GeneralesForm.controls["Fecha_de_Autorizacion"].disable()
    this.Solicitud_de_Compras_GeneralesForm.controls["Hora_de_Autorizacion"].disable()
    this.Solicitud_de_Compras_GeneralesForm.controls["Autorizado_por"].disable()
    this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Tipo', 0);

    //BRID:3209 - Campo no requeridos y deshabilitados siempre - Autor: Lizeth Villa - Actualización: 9/27/2021 1:57:53 PM
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Proveedor");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Tramo");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Motivo_de_Cancelacion");
    this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Motivo_de_Cancelacion', 0);

    //BRID:3369 - Ocultar estatus - Autor: Lizeth Villa - Actualización: 5/26/2021 6:41:52 PM
    this.brf.HideFieldOfForm(this.Solicitud_de_Compras_GeneralesForm, "Estatus_de_Solicitud");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Estatus_de_Solicitud");

    //BRID:3964 - Ocultar siempre estatus de seguimiento - Autor: Lizeth Villa - Actualización: 6/21/2021 1:18:53 PM
    this.brf.HideFieldofMultirenglon(this.Item_Compras_GeneralesColumns, "Estatus_de_Seguimiento");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Estatus_de_Seguimiento");

    //BRID:6517 - Ocultar campo de motivo de rechazo - Autor: Lizeth Villa - Actualización: 9/27/2021 1:44:00 PM
    if (this.Solicitud_de_Compras_GeneralesForm.controls["Estatus_de_Solicitud"].value != 6) {
      this.brf.HideFieldOfForm(this.Solicitud_de_Compras_GeneralesForm, "Motivo_de_Cancelacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Motivo_de_Cancelacion");
    }

    //BRID:7042 - Ocultar checkbox enviar solicitud - Autor: ANgel Acuña - Actualización: 10/4/2021 9:36:39 AM
    this.brf.HideFieldOfForm(this.Solicitud_de_Compras_GeneralesForm, "Enviar_Solicitud");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Enviar_Solicitud");



    if (this.operation == 'New') {
      //BRID:3202 - Asignar usuario que solicita, hora y fecha de registro  - Autor: Lizeth Villa - Actualización: 5/26/2021 6:15:12 PM
      this.Solicitud_de_Compras_GeneralesForm.controls["Usuario_que_Registra"].setValue(this.UserId)
      this.Solicitud_de_Compras_GeneralesForm.controls["Fecha_de_Registro"].setValue(this.today)
      var now = moment().format("HH:mm:ss");
      this.Solicitud_de_Compras_GeneralesForm.controls["Hora_de_Registro"].setValue(now)

      //Asignar Jefe Inmediato
      this.sqlModel.query = `SELECT Jefe_inmediato FROM Creacion_de_Usuarios where usuario_registrado = (select ${this.UserId})`;

      this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
        next: (response) => {
          this.Solicitud_de_Compras_GeneralesForm.controls["Autorizado_por"].setValue(parseInt(response));
        }
      })

      //BRID:3213 - Asignar departamento - Autor: Lizeth Villa - Actualización: 5/26/2021 6:39:56 PM
      this.sqlModel.query = `SELECT Departamento FROM Creacion_de_Usuarios where usuario_registrado = (select ${this.UserId})`;

      this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
        next: (response) => { this.Solicitud_de_Compras_GeneralesForm.controls["Departamento"].setValue(parseInt(response)); }
      })

      //BRID:3531 - Ocultar pestaña de jefe inmediato - Autor: Lizeth Villa - Actualización: 5/27/2021 10:00:45 AM
      if (this.brf.GetValueByControlType(this.Solicitud_de_Compras_GeneralesForm, 'Estatus_de_Solicitud') == this.brf.TryParseInt('', '')) {
        this.brf.HideFolder("Autorizado_por_Jefe_Inmediato");
      }

      //BRID:3533 - En nuevo asignar no requeridos  - Autor: Lizeth Villa - Actualización: 5/27/2021 12:34:01 PM
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Fecha_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Hora_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Autorizado_por");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Observacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Resultado");

      //BRID:3747 - Asignar tipo de servicio generales por defecto - Autor: Lizeth Villa - Actualización: 6/2/2021 3:15:07 PM
      this.brf.SetValueControl(this.Solicitud_de_Compras_GeneralesForm, "Tipo", "2");

    }

    if (this.operation == 'Update') {

      //BRID:3347 - En editar, si el estatus es por autorizar y soy jefe directo  - Autor: Lizeth Villa - Actualización: 6/2/2021 4:12:43 PM
      if (this.Solicitud_de_Compras_GeneralesForm.controls["Estatus_de_Solicitud"].value == 2
        && this.Solicitud_de_Compras_GeneralesForm.controls["Autorizado_por"].value == this.UserId) {
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'No_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_de_Registro', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Hora_de_Registro', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Usuario_que_Registra', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Razon_de_la_Compra', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Proveedor', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'No_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Tramo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_S', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_T', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Departamento', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Tipo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Enviar_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Estatus_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Solicitud_de_Compras_Generales', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Cantidad_Requerida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Unidad_de_Medida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Aplicacion_y_Justificacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_requerida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Observaciones', 0);
      }

      //3 - BRID:3348 - si el estatus es autorizado bloquear campos - Autor: Lizeth Villa - Actualización: 5/26/2021 4:55:05 PM
      //4 - BRID:3349 - si el estatus es no autorizado bloquear campos - Autor: Lizeth Villa - Actualización: 5/26/2021 4:49:50 PM
      if (this.Solicitud_de_Compras_GeneralesForm.controls["Estatus_de_Solicitud"].value == 3 ||
        this.Solicitud_de_Compras_GeneralesForm.controls["Estatus_de_Solicitud"].value == 4) {
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'No_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_de_Registro', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Hora_de_Registro', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Usuario_que_Registra', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Razon_de_la_Compra', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Proveedor', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'No_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Tramo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_S', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_T', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Departamento', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Tipo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Enviar_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Estatus_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Solicitud_de_Compras_Generales', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Cantidad_Requerida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Unidad_de_Medida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Aplicacion_y_Justificacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_requerida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_de_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Hora_de_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Autorizado_por', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Resultado', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Observacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Resultado', 0);
      }



      //BRID:3532 - Editar en por autorizar. - Autor: Lizeth Villa - Actualización: 6/2/2021 4:18:36 PM
      if (this.Phase == 1 && this.Solicitud_de_Compras_GeneralesForm.controls["Estatus_de_Solicitud"].value == 2) {
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Razon_de_la_Compra', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Proveedor', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'No_de_Vuelo', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Tramo', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_S', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_T', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Tipo', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Enviar_Solicitud', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Solicitud_de_Compras_Generales', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Descripcion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Cantidad_Requerida', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Unidad_de_Medida', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Urgencia', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Aplicacion_y_Justificacion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_requerida', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Observaciones', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_de_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Hora_de_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Autorizado_por', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Observacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Resultado', 0);
        this.brf.SetRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Razon_de_la_Compra");
        this.brf.SetRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Tipo");
        this.brf.HideFolder("Autorizado_por_Jefe_Inmediato");
        this.brf.SetValueFromQuery(this.Solicitud_de_Compras_GeneralesForm, "Fecha_de_Autorizacion", this.brf.EvaluaQuery(" ", 1, "ABC123"), 1, "ABC123");
        this.brf.SetValueFromQuery(this.Solicitud_de_Compras_GeneralesForm, "Hora_de_Autorizacion", this.brf.EvaluaQuery(" ", 1, "ABC123"), 1, "ABC123");
      }

      //BRID:3766 - En modificar, si el estatus es por autorizar y es mi solicitud (No es por mi jefe) - Autor: Lizeth Villa - Actualización: 6/3/2021 4:38:08 PM
      if (this.Solicitud_de_Compras_GeneralesForm.controls["Estatus_de_Solicitud"].value == 2
        && this.Solicitud_de_Compras_GeneralesForm.controls["Autorizado_por"].value != this.UserId) {
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'No_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_de_Registro', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Hora_de_Registro', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Usuario_que_Registra', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Razon_de_la_Compra', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Proveedor', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'No_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Tramo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_S', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Numero_de_O_T', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Departamento', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Tipo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Enviar_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Estatus_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Solicitud_de_Compras_Generales', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Cantidad_Requerida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Unidad_de_Medida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Aplicacion_y_Justificacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_requerida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Fecha_de_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Hora_de_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Autorizado_por', 0);
        //this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Observacion', 0);
        //this.brf.SetEnabledControl(this.Solicitud_de_Compras_GeneralesForm, 'Resultado', 0);

        this.Solicitud_de_Compras_GeneralesForm.controls["Resultado"].disable()
        this.Solicitud_de_Compras_GeneralesForm.controls["Observacion"].disable()

      }

    }


    //INICIA - BRID:7229 - WF:7 Rule - Phase: 1 (Solicitar Compra) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 1) {
      this.brf.HideFolder("Autorizado_por_Jefe_Inmediato");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Fecha_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Hora_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Autorizado_por");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Observacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Resultado");
    }
    //TERMINA - BRID:7229


    //INICIA - BRID:7231 - WF:7 Rule - Phase: 2 (Por Autorizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 2) {
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "No_de_Solicitud");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Fecha_de_Registro");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Hora_de_Registro");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Usuario_que_Registra");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Razon_de_la_Compra");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Proveedor");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "No_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Tramo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Numero_de_O_S");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Numero_de_O_T");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Departamento");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Tipo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Enviar_Solicitud");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Estatus_de_Solicitud");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Motivo_de_Cancelacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Fecha_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Hora_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Autorizado_por");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Observacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Resultado");
    }
    //TERMINA - BRID:7231


    //INICIA - BRID:7233 - WF:7 Rule - Phase: 3 (Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 3) {
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "No_de_Solicitud");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Fecha_de_Registro");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Hora_de_Registro");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Usuario_que_Registra");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Razon_de_la_Compra");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Proveedor");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "No_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Tramo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Numero_de_O_S");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Numero_de_O_T");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Departamento");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Tipo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Enviar_Solicitud");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Estatus_de_Solicitud");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Motivo_de_Cancelacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Fecha_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Hora_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Autorizado_por");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Observacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Compras_GeneralesForm, "Resultado");
    }
    //TERMINA - BRID:7233

    this.getDataTable()
    /* this.brf.FillMultiRenglonfromQuery(this.dataSourceLista_Predeterminada_Seleccionar,
      `SELECT Folio, Fecha_de_Registro, Hora_de_Registro, Usuario_que_Registra, Name Nombre_Usuario_que_Registra, Nombre_de_Lista_Predeterminada ` +
      `FROM Lista_Predeterminada LEFT JOIN Spartan_User ON Spartan_User.Id_User = Lista_Predeterminada.Usuario_que_Registra`, 1, "ABC123"); */

    //rulesOnInit_ExecuteBusinessRulesEnd

  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    let No_de_Solicitud = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted);

    //BRID:3986 - Actualizar estatus de items - Autor: Lizeth Villa - Actualización: 7/26/2021 12:12:09 PM
    if (this.operation == 'Update') {
      if (this.Solicitud_de_Compras_GeneralesForm.controls['Resultado'].value == 1) {
        this.brf.EvaluaQuery(` UPDATE Detalle_de_Item_Compras_Generales set Estatus_de_Seguimiento = 5 where solicitud_de_compras_Generales = '${No_de_Solicitud}'`, 1, "ABC123");
      }
    }

    //Botón Enviar Solicitud
    if (this.isSendRequest) {
      this.brf.EvaluaQuery(` UPDATE Solicitud_de_Compras_Generales set Enviar_Solicitud = 1 where No_de_Solicitud = '${No_de_Solicitud}'`, 1, "ABC123");
      let message = "Se solicitó la aprobación al jefe inmediato"
      this.snackBar.open(message, '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['mat-toolbar', 'mat-primary']
      });
    }

    //INICIA - BRID:4218 - Enviar correo a jefe inmediato en por autorizar - Autor: Lizeth Villa - Actualización: 7/23/2021 12:49:32 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      //this.brf.SendEmailQuery("VICS - Solicitud de Compra", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + '' from Spartan_User where id_user = FLD[Autorizado_por] for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado/a '+ EvaluaQuery("select name from Spartan_User where id_user = FLD[Autorizado_por]"):+ '</p> <p>Ha recibido una solicitud de compras generales de parte de '+ EvaluaQuery("select name from Spartan_User where id_user = FLD[Usuario_que_Registra]") el '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Registro) AS nombreDia from Solicitud_de_Compras_Generales where No_de_Solicitud = FLDD[lblNo_de_Solicitud]")+' FLD[Fecha_de_Registro] </p> <p>Atentamente</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	");
    }
    //TERMINA - BRID:4218


    //INICIA - BRID:4239 - Correo de Notificación para el que Solicito la Compra. (Autorizada ) - Autor: Lizeth Villa - Actualización: 7/22/2021 4:41:06 PM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Solicitud_de_Compras_GeneralesForm, 'Resultado')==this.brf.TryParseInt('1', '1') ) { this.brf.SendEmailQuery("VICS - Solicitud de Compra. Autorizada	", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + '' from Spartan_User where id_user = FLD[Usuario_que_Registra] for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado/a '+ EvaluaQuery("select name from Spartan_User where id_user = FLD[Usuario_que_Registra]")+ ' </p> <p>Para hacer de su conocimiento que la solicitud de compras generales realizada el '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Registro) AS nombreDia from Solicitud_de_Compras_Generales where No_de_Solicitud = FLDD[lblNo_de_Solicitud]")+' FLD[Fecha_de_Registro] fue autorizada ></p> <p>Atentamente</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div></center></td></tr></table></body></html>	");} else {}
    }
    //TERMINA - BRID:4239


    //INICIA - BRID:4313 - Correo de Notificación para el que Solicito la Compra (No Autorizada). - Autor: Lizeth Villa - Actualización: 7/22/2021 4:51:53 PM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Solicitud_de_Compras_GeneralesForm, 'Resultado')==this.brf.TryParseInt('2', '2') ) { this.brf.SendEmailQuery("VICS - Solicitud de Compra. No Autorizada", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + '' from Spartan_User where id_user = FLD[Usuario_que_Registra] for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado/a '+ EvaluaQuery("select name from Spartan_User where id_user = FLD[Usuario_que_Registra]")+ ' </p> <p>Para hacer de su conocimiento que la solicitud de compras generales realizada el '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Registro) AS nombreDia from Solicitud_de_Compras_Generales where No_de_Solicitud = FLDD[lblNo_de_Solicitud]")+' FLD[Fecha_de_Registro] NO fue autorizada. </p> <p>Atentamente</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div></center></td></tr></table></body></html>	");} else {}
    }
    //TERMINA - BRID:4313

    //rulesAfterSave_ExecuteBusinessRulesEnd

    this.goToList();

  }

  async rulesBeforeSave(): Promise<boolean> {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //#region BRID:3211 -Debe de tener al menos un Item la Solicitud con codigo manual no desactivar - Autor: Lizeth Villa - Actualización: 5/26/2021 5:01:00 PM

    let lengthItem = this.dataSourceItem_Compras_Generales.data.filter(d => !d.IsDeleted).length;

    if (lengthItem == 0) {
      let message = "Debe capturar al menos 1 ítem"
      this.snackBar.open(message, '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
      result = false;
    }
    //#endregion


    //INICIA - BRID:3350 - Actualizar estatus si es rechazado - Autor: Lizeth Villa - Actualización: 5/26/2021 5:10:27 PM
    if (this.operation == 'Update') {
      if (this.Solicitud_de_Compras_GeneralesForm.controls['Resultado'].value == 2) {
        this.Solicitud_de_Compras_GeneralesForm.controls['Estatus_de_Solicitud'].setValue(4)
      }
    }
    //TERMINA - BRID:3350


    //INICIA - BRID:3351 - Actualizar estatus si es autorizado - Autor: Lizeth Villa - Actualización: 7/17/2021 5:12:16 PM
    if (this.operation == 'Update') {
      if (this.Solicitud_de_Compras_GeneralesForm.controls['Resultado'].value == 1) {
        this.Solicitud_de_Compras_GeneralesForm.controls['Estatus_de_Solicitud'].setValue(3)
      }
    }
    //TERMINA - BRID:3351

    //rulesBeforeSave_ExecuteBusinessRulesEnd
    if (!result) {
      this.isSendRequest = false;
    }

    //BRID:3346 - En nuevo asignar estatus pendiente por enviar - Autor: Lizeth Villa - Actualización: 6/2/2021 3:06:38 PM
    if (this.operation == 'New' && !this.isSendRequest) {
      this.Solicitud_de_Compras_GeneralesForm.controls['Estatus_de_Solicitud'].setValue(5)
    }

    return result;
  }

  //Fin de reglas

  //#region Obtener Tramo
  onChangeNumero_de_Vuelo(option: number) {

    //option : 0 = Desde Input | 1: Desde AutoComplete

    let Numero_de_Vuelo = this.Solicitud_de_Compras_GeneralesForm.controls['No_de_Vuelo'].value;
    Numero_de_Vuelo = (option == 0) ? Numero_de_Vuelo : Numero_de_Vuelo.Folio

    this.sqlModel.query = `exec uspFiltraICAO_IATAporVuelo ${Numero_de_Vuelo}  `;

    this._SpartanService.ExecuteQueryDictionary(this.sqlModel).subscribe({
      next: (data) => {

        let response = this.setResponseTramo(data)
        this.listaTramo = response

      }
    })

  }
  //#endregion

  //#region Formatear Obtener Tramo
  setResponseTramo(result: any) {
    let response: any = [];

    if (result) {
      //Se realiza el mapeo al modelo [{Clave, Description}]
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        response.push(
          {
            "Aeropuerto_ID": element[0],
            "ICAO_IATA": element[1]
          }
        )
      });
    }
    else {
      response = []
    }

    return response
  }
  //#endregion

  //#region Funcionalidad Enviar Solicitar
  sendRequest() {
    this.Solicitud_de_Compras_GeneralesForm.controls['Estatus_de_Solicitud'].setValue(2)
    this.isSendRequest = true;
    this.save();
  }
  //#endregion

  //#region BRID:3368 - Asignar hora y fecha en por autorizar - Autor: Lizeth Villa - Actualización: 5/26/2021 6:28:22 PM      
  fnSetDateHourAutorizar() {
    if (this.brf.GetValueByControlType(this.Solicitud_de_Compras_GeneralesForm, 'Estatus_de_Solicitud') == this.brf.TryParseInt('2', '2')) {

      this.Solicitud_de_Compras_GeneralesForm.controls["Fecha_de_Autorizacion"].setValue(this.today)
      var now = moment().format("HH:mm:ss");
      this.Solicitud_de_Compras_GeneralesForm.controls["Hora_de_Autorizacion"].setValue(now)
    }
  }
  //#endregion

  //#region Obtener DataTable
  getDataTable() {
    this.dataSourceLista_Predeterminada_Seleccionar = new MatTableDataSource([]);

    let data = [];
    this.sqlModel.query = `SELECT Folio, Fecha_de_Registro, Hora_de_Registro, Usuario_que_Registra, Name Nombre_Usuario_que_Registra, Nombre_de_Lista_Predeterminada ` +
      `FROM Lista_Predeterminada LEFT JOIN Spartan_User ON Spartan_User.Id_User = Lista_Predeterminada.Usuario_que_Registra`

    this._SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      if (result == null || result.length == 0) {
        return
      }

      let dt = result[0].Table

      if (dt != null && dt.length > 0) {
        for (var i = 0; i < dt.length; i++) {
          let resDt = dt[i];

          resDt.IsDeleted = false;
          resDt.edit = false;
          resDt.isNew = true;
          data.push(resDt);
        }

        this.dataSourceLista_Predeterminada_Seleccionar = new MatTableDataSource<Lista_Predeterminada_Seleccionar>(data);

      }

    });

  }
  //#endregion

  //#region Abrir Ventana Comparativo
  fnOpenWindowLista_Predeterminada() {

    let url = this.router.serializeUrl(this.router.createUrlTree([`#/Lista_Predeterminada/add`]));

    this.localStorageHelper.setItemToLocalStorage("IsResetSolicitud_de_Compras", "0");

    this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
    this.openWindows;


  }
  //#endregion

  //#region Refrescar Vista
  startTimer() {
    this.timerStart = true;
    this.interval = setInterval(() => {
      let Reset = +this.localStorageHelper.getItemFromLocalStorage("IsResetSolicitud_de_Compras");
      if (Reset == 1) {
        this.localStorageHelper.setItemToLocalStorage("IsResetSolicitud_de_Compras", "0");

        this.getDataTable();
        this.dataSourceLista_Predeterminada_SeleccionarPaso = this.dataSourceItem_Compras_Generales.data.filter(r => r.Folio == 0);

        this.snackBar.open('Refrescando Vista.', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success'
        });
      }
    }, 5000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }
  //#endregion

  //#region Obtener Unidad de Medida
  getUnidadMedida() {

    this.sqlModel.query = `SELECT Clave, Descripcion FROM Unidad `

    this._SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      this.varUnidadMedida = result[0].Table

    });

  }
  //#endregion

  //#region Obtener Urgencia
  getUrgenciaArray() {

    this.sqlModel.query = `SELECT Folio, Descripcion FROM Urgencia `

    this._SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      this.varUrgenciaArray = result[0].Table

    });

  }
  //#endregion

  //#region Completar información de Selects
  setDataFromSelects(): void {
    this.searchProveedores();
    this.searchNo_de_Vuelo();
    this.searchNumero_de_O_S();
    this.searchNumero_de_O_T();
  }
  //#endregion

  //#region Consulta de Proveedores
  searchProveedores(term?: string) {
    this.isLoadingProveedor = true;
    if (term == "" || term == null || term == undefined) {
      this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingProveedor = false;

        let response = result["Creacion_de_Proveedoress"].filter(element => element.Razon_social != null);

        this.listaProveedores = of(response);
      }, error => {
        this.isLoadingProveedor = false;
        this.listaProveedores = of([]);
      });;
    }
    else if (term != "") {
      this.Creacion_de_ProveedoresService.listaSelAll(0, 20, "Creacion_de_Proveedores.Razon_social like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingProveedor = false;

        let response = result["Creacion_de_Proveedoress"].filter(element => element.Razon_social != null);

        this.listaProveedores = of(response);
      }, error => {
        this.isLoadingProveedor = false;
        this.listaProveedores = of([]);
      });;
    }
  }
  //#endregion

  //#region Consulta de Numero de Vuelo
  searchNo_de_Vuelo(term?: string) {
    this.isLoadingNo_de_Vuelo = true;
    if (term == "" || term == null || term == undefined) {
      this.Solicitud_de_VueloService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingNo_de_Vuelo = false;
        this.listaNo_de_Vuelo = of(result?.Solicitud_de_Vuelos);
      }, error => {
        this.isLoadingNo_de_Vuelo = false;
        this.listaNo_de_Vuelo = of([]);
      });;
    }
    else if (term != "") {
      this.Solicitud_de_VueloService.listaSelAll(0, 20, "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingNo_de_Vuelo = false;
        this.listaNo_de_Vuelo = of(result?.Solicitud_de_Vuelos);
      }, error => {
        this.isLoadingNo_de_Vuelo = false;
        this.listaNo_de_Vuelo = of([]);
      });;
    }

  }
  //#endregion

  //#region Consulta de Numero_de_O_S
  searchNumero_de_O_S(term?: string) {
    this.isLoadingNumero_de_O_S = true;
    if (term == "" || term == null || term == undefined) {
      this.Orden_de_servicioService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingNumero_de_O_S = false;
        this.listaNumero_de_O_S = of(result?.Orden_de_servicios);
      }, error => {
        this.isLoadingNumero_de_O_S = false;
        this.listaNumero_de_O_S = of([]);
      });;
    }
    else if (term != "") {
      this.Orden_de_servicioService.listaSelAll(0, 20, "Orden_de_servicio.Folio_OS like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingNumero_de_O_S = false;
        this.listaNumero_de_O_S = of(result?.Orden_de_servicios);
      }, error => {
        this.isLoadingNumero_de_O_S = false;
        this.listaNumero_de_O_S = of([]);
      });;
    }

  }
  //#endregion

  //#region Consulta de Numero_de_O_T
  searchNumero_de_O_T(term?: string) {
    this.isLoadingNumero_de_O_T = true;
    if (term == "" || term == null || term == undefined) {
      this.Orden_de_TrabajoService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingNumero_de_O_T = false;
        this.listaNumero_de_O_T = of(result?.Orden_de_Trabajos);
      }, error => {
        this.isLoadingNumero_de_O_T = false;
        this.listaNumero_de_O_T = of([]);
      });;
    }
    else if (term != "") {
      this.Orden_de_TrabajoService.listaSelAll(0, 20, "Orden_de_Trabajo.numero_de_orden like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingNumero_de_O_T = false;
        this.listaNumero_de_O_T = of(result?.Orden_de_Trabajos);
      }, error => {
        this.isLoadingNumero_de_O_T = false;
        this.listaNumero_de_O_T = of([]);
      });;
    }
  }
  //#endregion


}
