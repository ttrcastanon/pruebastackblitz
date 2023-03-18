import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { GeneralService } from 'src/app/api-services/general.service';
import { Comparativo_de_Proveedores_PiezasService } from 'src/app/api-services/Comparativo_de_Proveedores_Piezas.service';
import { Comparativo_de_Proveedores_Piezas } from 'src/app/models/Comparativo_de_Proveedores_Piezas';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Departamento } from 'src/app/models/Departamento';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Detalle_de_Cuadro_ComparativoService } from 'src/app/api-services/Detalle_de_Cuadro_Comparativo.service';
import { Detalle_de_Cuadro_Comparativo } from 'src/app/models/Detalle_de_Cuadro_Comparativo';
import { PartesService } from 'src/app/api-services/Partes.service';
import { Partes } from 'src/app/models/Partes';
import { Catalogo_serviciosService } from 'src/app/api-services/Catalogo_servicios.service';
import { Catalogo_servicios } from 'src/app/models/Catalogo_servicios';
import { Listado_de_MaterialesService } from 'src/app/api-services/Listado_de_Materiales.service';
import { Listado_de_Materiales } from 'src/app/models/Listado_de_Materiales';
import { HerramientasService } from 'src/app/api-services/Herramientas.service';
import { Herramientas } from 'src/app/models/Herramientas';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';

import { MonedaService } from 'src/app/api-services/Moneda.service';
import { Moneda } from 'src/app/models/Moneda';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { AutorizacionService } from 'src/app/api-services/Autorizacion.service';
import { Autorizacion } from 'src/app/models/Autorizacion';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import * as moment from 'moment';


import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/AppDateAdapter';
import { PdfCloudService } from 'src/app/api-services/pdf-cloud.service';
import { base64ToArrayBuffer, saveByteArray } from 'src/app/functions/blob-function';

@Component({
  selector: 'app-Comparativo_de_Proveedores_Piezas',
  templateUrl: './Comparativo_de_Proveedores_Piezas.component.html',
  styleUrls: ['./Comparativo_de_Proveedores_Piezas.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
})
export class Comparativo_de_Proveedores_PiezasComponent implements OnInit, AfterViewInit {
MRaddComparativo_de_Cotizaciones: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  Phase: any;
  Tipo_MR: any;
  public varSpartan_User: Spartan_User[] = [];

  Comparativo_de_Proveedores_PiezasForm: FormGroup;
  model: Comparativo_de_Proveedores_Piezas;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsSolicitante: Observable<Spartan_User[]>;
  hasOptionsSolicitante: boolean;
  isLoadingSolicitante: boolean;
  public varDepartamento: Departamento[] = [];
  optionsNumero_de_Reporte: Observable<Crear_Reporte[]>;
  hasOptionsNumero_de_Reporte: boolean;
  isLoadingNumero_de_Reporte: boolean;
  optionsNumero_de_O_T: Observable<Orden_de_Trabajo[]>;
  hasOptionsNumero_de_O_T: boolean;
  isLoadingNumero_de_O_T: boolean;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  public varModelos: Modelos[] = [];
  public varPartes: Partes[] = [];
  public varCatalogo_servicios: Catalogo_servicios[] = [];
  public varListado_de_Materiales: Listado_de_Materiales[] = [];
  public varHerramientas: Herramientas[] = [];
  public varCreacion_de_Proveedores: Creacion_de_Proveedores[] = [];
  public varCreacion_de_Proveedores_2: Creacion_de_Proveedores[] = [];
  public varCreacion_de_Proveedores_3: Creacion_de_Proveedores[] = [];
  public varCreacion_de_Proveedores_4: Creacion_de_Proveedores[] = [];


  autoPartes_Detalle_de_Cuadro_Comparativo = new FormControl();
  SelectedPartes_Detalle_de_Cuadro_Comparativo: string[] = [];
  isLoadingPartes_Detalle_de_Cuadro_Comparativo: boolean;
  searchPartes_Detalle_de_Cuadro_ComparativoCompleted: boolean;
  autoServicios_Detalle_de_Cuadro_Comparativo = new FormControl();
  SelectedServicios_Detalle_de_Cuadro_Comparativo: string[] = [];
  isLoadingServicios_Detalle_de_Cuadro_Comparativo: boolean;
  searchServicios_Detalle_de_Cuadro_ComparativoCompleted: boolean;
  autoMateriales_Detalle_de_Cuadro_Comparativo = new FormControl();
  SelectedMateriales_Detalle_de_Cuadro_Comparativo: string[] = [];
  isLoadingMateriales_Detalle_de_Cuadro_Comparativo: boolean;
  searchMateriales_Detalle_de_Cuadro_ComparativoCompleted: boolean;
  autoHerramientas_Detalle_de_Cuadro_Comparativo = new FormControl();
  SelectedHerramientas_Detalle_de_Cuadro_Comparativo: string[] = [];
  isLoadingHerramientas_Detalle_de_Cuadro_Comparativo: boolean;
  searchHerramientas_Detalle_de_Cuadro_ComparativoCompleted: boolean;
  autoProveedor_1_Detalle_de_Cuadro_Comparativo = new FormControl();
  SelectedProveedor_1_Detalle_de_Cuadro_Comparativo: string[] = [];
  isLoadingProveedor_1_Detalle_de_Cuadro_Comparativo: boolean;
  searchProveedor_1_Detalle_de_Cuadro_ComparativoCompleted: boolean;
  autoProveedor_2_Detalle_de_Cuadro_Comparativo = new FormControl();
  SelectedProveedor_2_Detalle_de_Cuadro_Comparativo: string[] = [];
  isLoadingProveedor_2_Detalle_de_Cuadro_Comparativo: boolean;
  searchProveedor_2_Detalle_de_Cuadro_ComparativoCompleted: boolean;
  autoProveedor_3_Detalle_de_Cuadro_Comparativo = new FormControl();
  SelectedProveedor_3_Detalle_de_Cuadro_Comparativo: string[] = [];
  isLoadingProveedor_3_Detalle_de_Cuadro_Comparativo: boolean;
  searchProveedor_3_Detalle_de_Cuadro_ComparativoCompleted: boolean;
  autoProveedor_4_Detalle_de_Cuadro_Comparativo = new FormControl();
  SelectedProveedor_4_Detalle_de_Cuadro_Comparativo: string[] = [];
  isLoadingProveedor_4_Detalle_de_Cuadro_Comparativo: boolean;
  searchProveedor_4_Detalle_de_Cuadro_ComparativoCompleted: boolean;

  optionsProveedor1: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor1: boolean;
  isLoadingProveedor1: boolean;
  optionsTipo_de_Moneda1: Observable<Moneda[]>;
  hasOptionsTipo_de_Moneda1: boolean;
  isLoadingTipo_de_Moneda1: boolean;
  optionsProveedor2: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor2: boolean;
  isLoadingProveedor2: boolean;
  optionsTipo_de_Moneda2: Observable<Moneda[]>;
  hasOptionsTipo_de_Moneda2: boolean;
  isLoadingTipo_de_Moneda2: boolean;
  optionsProveedor3: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor3: boolean;
  isLoadingProveedor3: boolean;
  optionsTipo_de_Moneda3: Observable<Moneda[]>;
  hasOptionsTipo_de_Moneda3: boolean;
  isLoadingTipo_de_Moneda3: boolean;
  optionsProveedor4: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor4: boolean;
  isLoadingProveedor4: boolean;
  optionsTipo_de_Moneda4: Observable<Moneda[]>;
  hasOptionsTipo_de_Moneda4: boolean;
  isLoadingTipo_de_Moneda4: boolean;
  optionsTipo_de_Moneda: Observable<Moneda[]>;
  hasOptionsTipo_de_Moneda: boolean;
  isLoadingTipo_de_Moneda: boolean;
  public varEstatus_de_Seguimiento: Estatus_de_Seguimiento[] = [];
  optionsAutorizado_por: Observable<Spartan_User[]>;
  hasOptionsAutorizado_por: boolean;
  isLoadingAutorizado_por: boolean;
  public varAutorizacion: Autorizacion[] = [];
  optionsAutorizado_por_DG: Observable<Spartan_User[]>;
  hasOptionsAutorizado_por_DG: boolean;
  isLoadingAutorizado_por_DG: boolean;
  optionsAutorizado_por_Adm: Observable<Spartan_User[]>;
  hasOptionsAutorizado_por_Adm: boolean;
  isLoadingAutorizado_por_Adm: boolean;

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceComparativo_de_Cotizaciones = new MatTableDataSource<Detalle_de_Cuadro_Comparativo>();
  Comparativo_de_CotizacionesColumns = [
    { def: 'actions', hide: false },
    { def: 'FolioDetalle', hide: false },
    { def: 'TipoMR', hide: false },
    { def: 'Partes', hide: false },
    { def: 'Servicios', hide: false },
    { def: 'Materiales', hide: false },
    { def: 'Herramientas', hide: false },
    { def: 'Horas_del_Componente_a_Remover', hide: false },
    { def: 'Ciclos_Componentes_a_Remover', hide: false },
    { def: 'Condicion_de_la_Pieza_Solicitada', hide: false },
    { def: 'Fecha_estimada_de_Mtto_', hide: false },
    { def: 'No__de_Parte___Descripcion', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Proveedor_1', hide: false },
    { def: 'Seleccion_1', hide: false },
    { def: 'Costo_Unitario_1', hide: false },
    { def: 'Total_1', hide: false },
    { def: 'Proveedor_2', hide: false },
    { def: 'Seleccion_2', hide: false },
    { def: 'Costo_Unitario_2', hide: false },
    { def: 'Total_2', hide: false },
    { def: 'Proveedor_3', hide: false },
    { def: 'Seleccion_3', hide: false },
    { def: 'Costo_Unitario_3', hide: false },
    { def: 'Total_3', hide: false },
    { def: 'Proveedor_4', hide: false },
    { def: 'Seleccion_4', hide: false },
    { def: 'Costo_Unitario_4', hide: false },
    { def: 'Total_4', hide: false },

  ];
  Comparativo_de_CotizacionesData: Detalle_de_Cuadro_Comparativo[] = [];

  today = new Date;
  consult: boolean = false;

  fromSeguimiento: boolean = false
  fromGestion_de_Aprobacion: boolean = false

  imprimir: boolean = false
  //#endregion


  constructor(
    private fb: FormBuilder,
    private Comparativo_de_Proveedores_PiezasService: Comparativo_de_Proveedores_PiezasService,
    private Spartan_UserService: Spartan_UserService,
    private DepartamentoService: DepartamentoService,
    private Crear_ReporteService: Crear_ReporteService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Detalle_de_Cuadro_ComparativoService: Detalle_de_Cuadro_ComparativoService,
    private PartesService: PartesService,
    private Catalogo_serviciosService: Catalogo_serviciosService,
    private Listado_de_MaterialesService: Listado_de_MaterialesService,
    private HerramientasService: HerramientasService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private MonedaService: MonedaService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,
    private AutorizacionService: AutorizacionService,
    private _seguridad: SeguridadService,
    private spartanFileService: SpartanFileService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private spartanService: SpartanService,
    renderer: Renderer2,
    private pdfCloudService: PdfCloudService,

  ) {
    this.brf = new BusinessRulesFunctions(renderer, spartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.Phase = this.localStorageHelper.getItemFromLocalStorage('Phase');
    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.consult = this.localStorageHelper.getItemFromLocalStorage("ConsultaComparativo") == "true" ? true : false;
    this.fromGestion_de_Aprobacion = this.localStorageHelper.getItemFromLocalStorage("fromGestion_de_Aprobacion") == "true" ? true : false;

    this.localStorageHelper.removeItemFromLocalStorage("ConsultaComparativo");
    this.localStorageHelper.removeItemFromLocalStorage("fromGestion_de_Aprobacion");

    this.model = new Comparativo_de_Proveedores_Piezas(this.fb);
    this.Comparativo_de_Proveedores_PiezasForm = this.model.buildFormGroup();
    this.Comparativo_de_CotizacionesItems.removeAt(0);

    this.Comparativo_de_Proveedores_PiezasForm.get('Folio').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceComparativo_de_Cotizaciones.paginator = this.paginator;

    this.rulesAfterViewInit();
  }


  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Comparativo_de_CotizacionesColumns.splice(0, 1);

        this.Comparativo_de_Proveedores_PiezasForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Comparativo_de_Proveedores_Piezas).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Solicitante', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Numero_de_Reporte', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Numero_de_O_T', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Proveedor1', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda1', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Proveedor2', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda2', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Proveedor3', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda3', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Proveedor4', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda4', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por_DG', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por_Adm', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Comparativo_de_Proveedores_PiezasService.listaSelAll(0, 1, 'Comparativo_de_Proveedores_Piezas.Folio=' + id).toPromise();
    if (result.Comparativo_de_Proveedores_Piezass.length > 0) {

      this.model.fromObject(result.Comparativo_de_Proveedores_Piezass[0]);


      let Solicitante = {
        Id_User: result.Comparativo_de_Proveedores_Piezass[0].Solicitante_Spartan_User.Id_User,
        Name: result.Comparativo_de_Proveedores_Piezass[0].Solicitante_Spartan_User.Name
      }
      this.Comparativo_de_Proveedores_PiezasForm.get('Solicitante').setValue(Solicitante, { onlySelf: false, emitEvent: true });

      let Numero_de_O_T = {
        Folio: result.Comparativo_de_Proveedores_Piezass[0].Numero_de_O_T_Orden_de_Trabajo?.Folio,
        numero_de_orden: result.Comparativo_de_Proveedores_Piezass[0].Numero_de_O_T_Orden_de_Trabajo?.numero_de_orden
      }
      this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_O_T').setValue(Numero_de_O_T, { onlySelf: false, emitEvent: true });

      let Matricula = {
        Folio: result.Comparativo_de_Proveedores_Piezass[0].Matricula_Aeronave?.Matricula,
        Matricula: result.Comparativo_de_Proveedores_Piezass[0].Matricula_Aeronave?.Matricula
      }
      this.Comparativo_de_Proveedores_PiezasForm.get('Matricula').setValue(Matricula, { onlySelf: false, emitEvent: true });

      let Numero_de_Reporte = {
        Folio: result.Comparativo_de_Proveedores_Piezass[0].Numero_de_Reporte_Crear_Reporte?.Folio,
        No_Reporte: result.Comparativo_de_Proveedores_Piezass[0].Numero_de_Reporte_Crear_Reporte?.No_Reporte
      }

      this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_Reporte').setValue(Numero_de_Reporte, { onlySelf: false, emitEvent: true });

      let Proveedor1 = result.Comparativo_de_Proveedores_Piezass[0].Proveedor1_Creacion_de_Proveedores

      this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor1').setValue(Proveedor1, { onlySelf: false, emitEvent: true });

      let Moneda = {
        Clave: result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda1_Moneda?.Clave,
        Descripcion: result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda1_Moneda?.Descripcion
      }

      this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda1').setValue(Moneda, { onlySelf: false, emitEvent: true });

      let Proveedor2 = result.Comparativo_de_Proveedores_Piezass[0].Proveedor2_Creacion_de_Proveedores
      this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor2"].setValue(Proveedor2);

      Moneda.Clave = result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda2_Moneda?.Clave
      Moneda.Descripcion = result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda2_Moneda?.Descripcion

      this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda2').setValue(Moneda, { onlySelf: false, emitEvent: true });

      let Proveedor3 = result.Comparativo_de_Proveedores_Piezass[0].Proveedor3_Creacion_de_Proveedores
      this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor3').setValue(Proveedor3, { onlySelf: false, emitEvent: true });

      Moneda.Clave = result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda3_Moneda?.Clave
      Moneda.Descripcion = result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda3_Moneda?.Descripcion

      this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda3').setValue(Moneda, { onlySelf: false, emitEvent: true });

      let Proveedor4 = result.Comparativo_de_Proveedores_Piezass[0].Proveedor4_Creacion_de_Proveedores
      this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor4').setValue(Proveedor4, { onlySelf: false, emitEvent: true });

      Moneda.Clave = result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda4_Moneda?.Clave
      Moneda.Descripcion = result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda4_Moneda?.Descripcion

      this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda4').setValue(Moneda, { onlySelf: false, emitEvent: true });

      Moneda.Clave = result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda_Moneda?.Clave
      Moneda.Descripcion = result.Comparativo_de_Proveedores_Piezass[0].Tipo_de_Moneda_Moneda?.Descripcion
      this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda').setValue(Moneda, { onlySelf: false, emitEvent: true });

      let Autorizado_Por = result.Comparativo_de_Proveedores_Piezass[0].Autorizado_por_Spartan_User?.Id_User
      this.Comparativo_de_Proveedores_PiezasForm.get('Autorizado_por').setValue(Autorizado_Por, { onlySelf: false, emitEvent: true });

      this.Comparativo_de_Proveedores_PiezasForm.get('Autorizado_por_DG').setValue(
        result.Comparativo_de_Proveedores_Piezass[0].Autorizado_por_DG_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );
      this.Comparativo_de_Proveedores_PiezasForm.get('Autorizado_por_Adm').setValue(
        result.Comparativo_de_Proveedores_Piezass[0].Autorizado_por_Adm_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );

      //console.log("Result General")
      //console.log(result.Comparativo_de_Proveedores_Piezass[0])

      await this.Detalle_de_Cuadro_ComparativoService.listaSelAll(0, 1000, 'Comparativo_de_Proveedores_Piezas.Folio=' + id).toPromise().then(fComparativo_de_Cotizaciones => {

        //console.log("Detalle ")
        //console.log(fComparativo_de_Cotizaciones)
        this.Tipo_MR = fComparativo_de_Cotizaciones.Detalle_de_Cuadro_Comparativos[0].TipoMR

        this.Comparativo_de_CotizacionesData = fComparativo_de_Cotizaciones.Detalle_de_Cuadro_Comparativos;
        this.loadComparativo_de_Cotizaciones(fComparativo_de_Cotizaciones.Detalle_de_Cuadro_Comparativos);
        this.dataSourceComparativo_de_Cotizaciones = new MatTableDataSource(fComparativo_de_Cotizaciones.Detalle_de_Cuadro_Comparativos);
        this.dataSourceComparativo_de_Cotizaciones.paginator = this.paginator;
        this.dataSourceComparativo_de_Cotizaciones.sort = this.sort;

        this.rulesOnInit();
      });

      this.Comparativo_de_Proveedores_PiezasForm.markAllAsTouched();
      this.Comparativo_de_Proveedores_PiezasForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else {
      this.spinner.hide('loading');
    }
  }

  //#region Comparativo de Cotizaciones
  get Comparativo_de_CotizacionesItems() {
    return this.Comparativo_de_Proveedores_PiezasForm.get('Detalle_de_Cuadro_ComparativoItems') as FormArray;
  }

  getComparativo_de_CotizacionesColumns(): string[] {
    return this.Comparativo_de_CotizacionesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadComparativo_de_Cotizaciones(Comparativo_de_Cotizaciones: Detalle_de_Cuadro_Comparativo[]) {
    Comparativo_de_Cotizaciones.forEach(element => {
      this.addComparativo_de_Cotizaciones(element);
    });
  }

  addComparativo_de_CotizacionesToMR() {
    const Comparativo_de_Cotizaciones = new Detalle_de_Cuadro_Comparativo(this.fb);
    this.Comparativo_de_CotizacionesData.push(this.addComparativo_de_Cotizaciones(Comparativo_de_Cotizaciones));
    this.dataSourceComparativo_de_Cotizaciones.data = this.Comparativo_de_CotizacionesData;
    Comparativo_de_Cotizaciones.edit = true;
    Comparativo_de_Cotizaciones.isNew = true;
    const length = this.dataSourceComparativo_de_Cotizaciones.data.length;
    const index = length - 1;
    const formComparativo_de_Cotizaciones = this.Comparativo_de_CotizacionesItems.controls[index] as FormGroup;
    this.addFilterToControlPartes_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Partes, index);
    this.addFilterToControlServicios_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Servicios, index);
    this.addFilterToControlMateriales_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Materiales, index);
    this.addFilterToControlHerramientas_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Herramientas, index);
    this.addFilterToControlProveedor_1_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Proveedor_1, index);
    this.addFilterToControlProveedor_2_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Proveedor_2, index);
    this.addFilterToControlProveedor_3_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Proveedor_3, index);
    this.addFilterToControlProveedor_4_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Proveedor_4, index);

    const page = Math.ceil(this.dataSourceComparativo_de_Cotizaciones.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addComparativo_de_Cotizaciones(entity: Detalle_de_Cuadro_Comparativo) {
    const Comparativo_de_Cotizaciones = new Detalle_de_Cuadro_Comparativo(this.fb);
    this.Comparativo_de_CotizacionesItems.push(Comparativo_de_Cotizaciones.buildFormGroup());
    if (entity) {
      Comparativo_de_Cotizaciones.fromObject(entity);
    }
    return entity;
  }

  Comparativo_de_CotizacionesItemsByFolio(Folio: number): FormGroup {
    return (this.Comparativo_de_Proveedores_PiezasForm.get('Detalle_de_Cuadro_ComparativoItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Comparativo_de_CotizacionesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    let fb = this.Comparativo_de_CotizacionesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteComparativo_de_Cotizaciones(element: any) {
    let index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    this.Comparativo_de_CotizacionesData[index].IsDeleted = true;
    this.dataSourceComparativo_de_Cotizaciones.data = this.Comparativo_de_CotizacionesData;
    this.dataSourceComparativo_de_Cotizaciones._updateChangeSubscription();
    index = this.dataSourceComparativo_de_Cotizaciones.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditComparativo_de_Cotizaciones(element: any) {
    let index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Comparativo_de_CotizacionesData[index].IsDeleted = true;
      this.dataSourceComparativo_de_Cotizaciones.data = this.Comparativo_de_CotizacionesData;
      this.dataSourceComparativo_de_Cotizaciones._updateChangeSubscription();
      index = this.Comparativo_de_CotizacionesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveComparativo_de_Cotizaciones(element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    const formComparativo_de_Cotizaciones = this.Comparativo_de_CotizacionesItems.controls[index] as FormGroup;
    this.Comparativo_de_CotizacionesData[index].FolioDetalle = formComparativo_de_Cotizaciones.value.FolioDetalle;
    this.Comparativo_de_CotizacionesData[index].TipoMR = formComparativo_de_Cotizaciones.value.TipoMR;
    if (this.Comparativo_de_CotizacionesData[index].Partes !== formComparativo_de_Cotizaciones.value.Partes && formComparativo_de_Cotizaciones.value.Partes > 0) {
      let partes = await this.PartesService.getById(formComparativo_de_Cotizaciones.value.Partes).toPromise();
      this.Comparativo_de_CotizacionesData[index].Partes_Partes = partes;
    }
    this.Comparativo_de_CotizacionesData[index].Partes = formComparativo_de_Cotizaciones.value.Partes;
    if (this.Comparativo_de_CotizacionesData[index].Servicios !== formComparativo_de_Cotizaciones.value.Servicios && formComparativo_de_Cotizaciones.value.Servicios > 0) {
      let catalogo_servicios = await this.Catalogo_serviciosService.getById(formComparativo_de_Cotizaciones.value.Servicios).toPromise();
      this.Comparativo_de_CotizacionesData[index].Servicios_Catalogo_servicios = catalogo_servicios;
    }
    this.Comparativo_de_CotizacionesData[index].Servicios = formComparativo_de_Cotizaciones.value.Servicios;
    if (this.Comparativo_de_CotizacionesData[index].Materiales !== formComparativo_de_Cotizaciones.value.Materiales && formComparativo_de_Cotizaciones.value.Materiales > 0) {
      let listado_de_materiales = await this.Listado_de_MaterialesService.getById(formComparativo_de_Cotizaciones.value.Materiales).toPromise();
      this.Comparativo_de_CotizacionesData[index].Materiales_Listado_de_Materiales = listado_de_materiales;
    }
    this.Comparativo_de_CotizacionesData[index].Materiales = formComparativo_de_Cotizaciones.value.Materiales;
    if (this.Comparativo_de_CotizacionesData[index].Herramientas !== formComparativo_de_Cotizaciones.value.Herramientas && formComparativo_de_Cotizaciones.value.Herramientas > 0) {
      let herramientas = await this.HerramientasService.getById(formComparativo_de_Cotizaciones.value.Herramientas).toPromise();
      this.Comparativo_de_CotizacionesData[index].Herramientas_Herramientas = herramientas;
    }
    this.Comparativo_de_CotizacionesData[index].Herramientas = formComparativo_de_Cotizaciones.value.Herramientas;
    this.Comparativo_de_CotizacionesData[index].Horas_del_Componente_a_Remover = formComparativo_de_Cotizaciones.value.Horas_del_Componente_a_Remover;
    this.Comparativo_de_CotizacionesData[index].Ciclos_Componentes_a_Remover = formComparativo_de_Cotizaciones.value.Ciclos_Componentes_a_Remover;
    this.Comparativo_de_CotizacionesData[index].Condicion_de_la_Pieza_Solicitada = formComparativo_de_Cotizaciones.value.Condicion_de_la_Pieza_Solicitada;
    this.Comparativo_de_CotizacionesData[index].Fecha_estimada_de_Mtto_ = formComparativo_de_Cotizaciones.value.Fecha_estimada_de_Mtto_;
    this.Comparativo_de_CotizacionesData[index].No__de_Parte___Descripcion = formComparativo_de_Cotizaciones.value.No__de_Parte___Descripcion;
    this.Comparativo_de_CotizacionesData[index].Cantidad = formComparativo_de_Cotizaciones.value.Cantidad;
    if (this.Comparativo_de_CotizacionesData[index].Proveedor_1 !== formComparativo_de_Cotizaciones.value.Proveedor_1 && formComparativo_de_Cotizaciones.value.Proveedor_1 > 0) {
      let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formComparativo_de_Cotizaciones.value.Proveedor_1).toPromise();
      this.Comparativo_de_CotizacionesData[index].Proveedor_1_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Comparativo_de_CotizacionesData[index].Proveedor_1 = formComparativo_de_Cotizaciones.value.Proveedor_1;
    this.Comparativo_de_CotizacionesData[index].Seleccion_1 = formComparativo_de_Cotizaciones.value.Seleccion_1;
    this.Comparativo_de_CotizacionesData[index].Costo_Unitario_1 = formComparativo_de_Cotizaciones.value.Costo_Unitario_1;
    this.Comparativo_de_CotizacionesData[index].Total_1 = formComparativo_de_Cotizaciones.value.Total_1;
    if (this.Comparativo_de_CotizacionesData[index].Proveedor_2 !== formComparativo_de_Cotizaciones.value.Proveedor_2 && formComparativo_de_Cotizaciones.value.Proveedor_2 > 0) {
      let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formComparativo_de_Cotizaciones.value.Proveedor_2).toPromise();
      this.Comparativo_de_CotizacionesData[index].Proveedor_2_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Comparativo_de_CotizacionesData[index].Proveedor_2 = formComparativo_de_Cotizaciones.value.Proveedor_2;
    this.Comparativo_de_CotizacionesData[index].Seleccion_2 = formComparativo_de_Cotizaciones.value.Seleccion_2;
    this.Comparativo_de_CotizacionesData[index].Costo_Unitario_2 = formComparativo_de_Cotizaciones.value.Costo_Unitario_2;
    this.Comparativo_de_CotizacionesData[index].Total_2 = formComparativo_de_Cotizaciones.value.Total_2;
    if (this.Comparativo_de_CotizacionesData[index].Proveedor_3 !== formComparativo_de_Cotizaciones.value.Proveedor_3 && formComparativo_de_Cotizaciones.value.Proveedor_3 > 0) {
      let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formComparativo_de_Cotizaciones.value.Proveedor_3).toPromise();
      this.Comparativo_de_CotizacionesData[index].Proveedor_3_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Comparativo_de_CotizacionesData[index].Proveedor_3 = formComparativo_de_Cotizaciones.value.Proveedor_3;
    this.Comparativo_de_CotizacionesData[index].Seleccion_3 = formComparativo_de_Cotizaciones.value.Seleccion_3;
    this.Comparativo_de_CotizacionesData[index].Costo_Unitario_3 = formComparativo_de_Cotizaciones.value.Costo_Unitario_3;
    this.Comparativo_de_CotizacionesData[index].Total_3 = formComparativo_de_Cotizaciones.value.Total_3;
    if (this.Comparativo_de_CotizacionesData[index].Proveedor_4 !== formComparativo_de_Cotizaciones.value.Proveedor_4 && formComparativo_de_Cotizaciones.value.Proveedor_4 > 0) {
      let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formComparativo_de_Cotizaciones.value.Proveedor_4).toPromise();
      this.Comparativo_de_CotizacionesData[index].Proveedor_4_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Comparativo_de_CotizacionesData[index].Proveedor_4 = formComparativo_de_Cotizaciones.value.Proveedor_4;
    this.Comparativo_de_CotizacionesData[index].Seleccion_4 = formComparativo_de_Cotizaciones.value.Seleccion_4;
    this.Comparativo_de_CotizacionesData[index].Costo_Unitario_4 = formComparativo_de_Cotizaciones.value.Costo_Unitario_4;
    this.Comparativo_de_CotizacionesData[index].Total_4 = formComparativo_de_Cotizaciones.value.Total_4;

    this.Comparativo_de_CotizacionesData[index].isNew = false;
    this.dataSourceComparativo_de_Cotizaciones.data = this.Comparativo_de_CotizacionesData;
    this.dataSourceComparativo_de_Cotizaciones._updateChangeSubscription();

    //console.log(this.dataSourceComparativo_de_Cotizaciones.data)
    this.setProveedoresToMR()
  }

  editComparativo_de_Cotizaciones(element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    const formComparativo_de_Cotizaciones = this.Comparativo_de_CotizacionesItems.controls[index] as FormGroup;
    this.SelectedPartes_Detalle_de_Cuadro_Comparativo[index] = this.dataSourceComparativo_de_Cotizaciones.data[index]?.Partes_Partes?.Numero_de_parte_Descripcion;
    this.addFilterToControlPartes_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Partes, index);
    this.SelectedServicios_Detalle_de_Cuadro_Comparativo[index] = this.dataSourceComparativo_de_Cotizaciones.data[index]?.Servicios_Catalogo_servicios?.Codigo_Descripcion;
    this.addFilterToControlServicios_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Servicios, index);
    this.SelectedMateriales_Detalle_de_Cuadro_Comparativo[index] = this.dataSourceComparativo_de_Cotizaciones.data[index]?.Materiales_Listado_de_Materiales?.Codigo_Descripcion;
    this.addFilterToControlMateriales_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Materiales, index);
    this.SelectedHerramientas_Detalle_de_Cuadro_Comparativo[index] = this.dataSourceComparativo_de_Cotizaciones.data[index]?.Herramientas_Herramientas?.Codigo_Descripcion;
    this.addFilterToControlHerramientas_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Herramientas, index);
    this.SelectedProveedor_1_Detalle_de_Cuadro_Comparativo[index] = this.dataSourceComparativo_de_Cotizaciones.data[index]?.Proveedor_1_Creacion_de_Proveedores?.Razon_social;
    this.addFilterToControlProveedor_1_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Proveedor_1, index);
    this.SelectedProveedor_2_Detalle_de_Cuadro_Comparativo[index] = this.dataSourceComparativo_de_Cotizaciones.data[index]?.Proveedor_2_Creacion_de_Proveedores?.Razon_social;
    this.addFilterToControlProveedor_2_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Proveedor_2, index);
    this.SelectedProveedor_3_Detalle_de_Cuadro_Comparativo[index] = this.dataSourceComparativo_de_Cotizaciones.data[index]?.Proveedor_3_Creacion_de_Proveedores?.Razon_social;
    this.addFilterToControlProveedor_3_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Proveedor_3, index);
    this.SelectedProveedor_4_Detalle_de_Cuadro_Comparativo[index] = this.dataSourceComparativo_de_Cotizaciones.data[index]?.Proveedor_4_Creacion_de_Proveedores?.Razon_social;
    this.addFilterToControlProveedor_4_Detalle_de_Cuadro_Comparativo(formComparativo_de_Cotizaciones.controls.Proveedor_4, index);

    element.edit = true;
  }

  async saveDetalle_de_Cuadro_Comparativo(Folio: number) {
    this.dataSourceComparativo_de_Cotizaciones.data.forEach(async (d, index) => {
      const data = this.Comparativo_de_CotizacionesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Comparativo_de_Proveedores_Piezas = Folio;
      model.Comparativo_de_Proveedores = Folio;

      //console.log(model)

      if (model.Folio === 0) {
        // Add Comparativo de Cotizaciones
        model.Folio = await this.Detalle_de_Cuadro_ComparativoService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formComparativo_de_Cotizaciones = this.Comparativo_de_CotizacionesItemsByFolio(model.Folio);
        if (formComparativo_de_Cotizaciones.dirty) {
          // Update Comparativo de Cotizaciones
          let response = await this.Detalle_de_Cuadro_ComparativoService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Comparativo de Cotizaciones
        await this.Detalle_de_Cuadro_ComparativoService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectPartes_Detalle_de_Cuadro_Comparativo(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedPartes_Detalle_de_Cuadro_Comparativo[index] = event.option.viewValue;
    let fgr = this.Comparativo_de_Proveedores_PiezasForm.controls.Detalle_de_Cuadro_ComparativoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Partes.setValue(event.option.value);
    this.displayFnPartes_Detalle_de_Cuadro_Comparativo(element);
  }

  displayFnPartes_Detalle_de_Cuadro_Comparativo(this, element) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    return this.SelectedPartes_Detalle_de_Cuadro_Comparativo[index];
  }

  updateOptionPartes_Detalle_de_Cuadro_Comparativo(event, element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    this.SelectedPartes_Detalle_de_Cuadro_Comparativo[index] = event.source.viewValue;
  }

  _filterPartes_Detalle_de_Cuadro_Comparativo(filter: any): Observable<Partes> {
    const where = filter !== '' ? "Partes.Numero_de_parte_Descripcion like '%" + filter + "%'" : '';
    return this.PartesService.listaSelAll(0, 20, where);
  }

  addFilterToControlPartes_Detalle_de_Cuadro_Comparativo(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingPartes_Detalle_de_Cuadro_Comparativo = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingPartes_Detalle_de_Cuadro_Comparativo = true;
        return this._filterPartes_Detalle_de_Cuadro_Comparativo(value || '');
      })
    ).subscribe(result => {
      this.varPartes = result.Partess;
      this.isLoadingPartes_Detalle_de_Cuadro_Comparativo = false;
      this.searchPartes_Detalle_de_Cuadro_ComparativoCompleted = true;
      this.SelectedPartes_Detalle_de_Cuadro_Comparativo[index] = this.varPartes.length === 0 ? '' : this.SelectedPartes_Detalle_de_Cuadro_Comparativo[index];
    });
  }

  public selectServicios_Detalle_de_Cuadro_Comparativo(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedServicios_Detalle_de_Cuadro_Comparativo[index] = event.option.viewValue;
    let fgr = this.Comparativo_de_Proveedores_PiezasForm.controls.Detalle_de_Cuadro_ComparativoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Servicios.setValue(event.option.value);
    this.displayFnServicios_Detalle_de_Cuadro_Comparativo(element);
  }

  displayFnServicios_Detalle_de_Cuadro_Comparativo(this, element) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    return this.SelectedServicios_Detalle_de_Cuadro_Comparativo[index];
  }

  updateOptionServicios_Detalle_de_Cuadro_Comparativo(event, element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    this.SelectedServicios_Detalle_de_Cuadro_Comparativo[index] = event.source.viewValue;
  }

  _filterServicios_Detalle_de_Cuadro_Comparativo(filter: any): Observable<Catalogo_servicios> {
    const where = filter !== '' ? "Catalogo_servicios.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Catalogo_serviciosService.listaSelAll(0, 20, where);
  }

  addFilterToControlServicios_Detalle_de_Cuadro_Comparativo(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingServicios_Detalle_de_Cuadro_Comparativo = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingServicios_Detalle_de_Cuadro_Comparativo = true;
        return this._filterServicios_Detalle_de_Cuadro_Comparativo(value || '');
      })
    ).subscribe(result => {
      this.varCatalogo_servicios = result.Catalogo_servicioss;
      this.isLoadingServicios_Detalle_de_Cuadro_Comparativo = false;
      this.searchServicios_Detalle_de_Cuadro_ComparativoCompleted = true;
      this.SelectedServicios_Detalle_de_Cuadro_Comparativo[index] = this.varCatalogo_servicios.length === 0 ? '' : this.SelectedServicios_Detalle_de_Cuadro_Comparativo[index];
    });
  }

  public selectMateriales_Detalle_de_Cuadro_Comparativo(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMateriales_Detalle_de_Cuadro_Comparativo[index] = event.option.viewValue;
    let fgr = this.Comparativo_de_Proveedores_PiezasForm.controls.Detalle_de_Cuadro_ComparativoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Materiales.setValue(event.option.value);
    this.displayFnMateriales_Detalle_de_Cuadro_Comparativo(element);
  }

  displayFnMateriales_Detalle_de_Cuadro_Comparativo(this, element) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    return this.SelectedMateriales_Detalle_de_Cuadro_Comparativo[index];
  }

  updateOptionMateriales_Detalle_de_Cuadro_Comparativo(event, element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    this.SelectedMateriales_Detalle_de_Cuadro_Comparativo[index] = event.source.viewValue;
  }

  _filterMateriales_Detalle_de_Cuadro_Comparativo(filter: any): Observable<Listado_de_Materiales> {
    const where = filter !== '' ? "Listado_de_Materiales.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Listado_de_MaterialesService.listaSelAll(0, 20, where);
  }

  addFilterToControlMateriales_Detalle_de_Cuadro_Comparativo(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMateriales_Detalle_de_Cuadro_Comparativo = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMateriales_Detalle_de_Cuadro_Comparativo = true;
        return this._filterMateriales_Detalle_de_Cuadro_Comparativo(value || '');
      })
    ).subscribe(result => {
      this.varListado_de_Materiales = result.Listado_de_Materialess;
      this.isLoadingMateriales_Detalle_de_Cuadro_Comparativo = false;
      this.searchMateriales_Detalle_de_Cuadro_ComparativoCompleted = true;
      this.SelectedMateriales_Detalle_de_Cuadro_Comparativo[index] = this.varListado_de_Materiales.length === 0 ? '' : this.SelectedMateriales_Detalle_de_Cuadro_Comparativo[index];
    });
  }

  public selectHerramientas_Detalle_de_Cuadro_Comparativo(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedHerramientas_Detalle_de_Cuadro_Comparativo[index] = event.option.viewValue;
    let fgr = this.Comparativo_de_Proveedores_PiezasForm.controls.Detalle_de_Cuadro_ComparativoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Herramientas.setValue(event.option.value);
    this.displayFnHerramientas_Detalle_de_Cuadro_Comparativo(element);
  }

  displayFnHerramientas_Detalle_de_Cuadro_Comparativo(this, element) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    return this.SelectedHerramientas_Detalle_de_Cuadro_Comparativo[index];
  }

  updateOptionHerramientas_Detalle_de_Cuadro_Comparativo(event, element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    this.SelectedHerramientas_Detalle_de_Cuadro_Comparativo[index] = event.source.viewValue;
  }

  _filterHerramientas_Detalle_de_Cuadro_Comparativo(filter: any): Observable<Herramientas> {
    const where = filter !== '' ? "Herramientas.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.HerramientasService.listaSelAll(0, 20, where);
  }

  addFilterToControlHerramientas_Detalle_de_Cuadro_Comparativo(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingHerramientas_Detalle_de_Cuadro_Comparativo = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingHerramientas_Detalle_de_Cuadro_Comparativo = true;
        return this._filterHerramientas_Detalle_de_Cuadro_Comparativo(value || '');
      })
    ).subscribe(result => {
      this.varHerramientas = result.Herramientass;
      this.isLoadingHerramientas_Detalle_de_Cuadro_Comparativo = false;
      this.searchHerramientas_Detalle_de_Cuadro_ComparativoCompleted = true;
      this.SelectedHerramientas_Detalle_de_Cuadro_Comparativo[index] = this.varHerramientas.length === 0 ? '' : this.SelectedHerramientas_Detalle_de_Cuadro_Comparativo[index];
    });
  }
  //#endregion


  //#region Proveedor 1

  public selectProveedor_1_Detalle_de_Cuadro_Comparativo(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_1_Detalle_de_Cuadro_Comparativo[index] = event.option.viewValue;
    let fgr = this.Comparativo_de_Proveedores_PiezasForm.controls.Detalle_de_Cuadro_ComparativoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Proveedor_1.setValue(event.option.value);
    this.displayFnProveedor_1_Detalle_de_Cuadro_Comparativo(element);
  }

  displayFnProveedor_1_Detalle_de_Cuadro_Comparativo(this, element) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    return this.SelectedProveedor_1_Detalle_de_Cuadro_Comparativo[index];
  }

  updateOptionProveedor_1_Detalle_de_Cuadro_Comparativo(event, element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    this.SelectedProveedor_1_Detalle_de_Cuadro_Comparativo[index] = event.source.viewValue;
  }

  _filterProveedor_1_Detalle_de_Cuadro_Comparativo(filter: any): Observable<Creacion_de_Proveedores> {
    const where = filter !== '' ? "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
    return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
  }

  addFilterToControlProveedor_1_Detalle_de_Cuadro_Comparativo(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_1_Detalle_de_Cuadro_Comparativo = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_1_Detalle_de_Cuadro_Comparativo = true;
        return this._filterProveedor_1_Detalle_de_Cuadro_Comparativo(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_1_Detalle_de_Cuadro_Comparativo = false;
      this.searchProveedor_1_Detalle_de_Cuadro_ComparativoCompleted = true;
      this.SelectedProveedor_1_Detalle_de_Cuadro_Comparativo[index] = this.varCreacion_de_Proveedores.length === 0 ? '' : this.SelectedProveedor_1_Detalle_de_Cuadro_Comparativo[index];
    });
  }
  //#endregion

  //#region Proveedor 2

  public selectProveedor_2_Detalle_de_Cuadro_Comparativo(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_2_Detalle_de_Cuadro_Comparativo[index] = event.option.viewValue;
    let fgr = this.Comparativo_de_Proveedores_PiezasForm.controls.Detalle_de_Cuadro_ComparativoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Proveedor_2.setValue(event.option.value);
    this.displayFnProveedor_2_Detalle_de_Cuadro_Comparativo(element);
  }

  displayFnProveedor_2_Detalle_de_Cuadro_Comparativo(this, element) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    return this.SelectedProveedor_2_Detalle_de_Cuadro_Comparativo[index];
  }

  updateOptionProveedor_2_Detalle_de_Cuadro_Comparativo(event, element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    this.SelectedProveedor_2_Detalle_de_Cuadro_Comparativo[index] = event.source.viewValue;
  }

  _filterProveedor_2_Detalle_de_Cuadro_Comparativo(filter: any): Observable<Creacion_de_Proveedores> {
    const where = filter !== '' ? "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
    return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
  }

  addFilterToControlProveedor_2_Detalle_de_Cuadro_Comparativo(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_2_Detalle_de_Cuadro_Comparativo = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_2_Detalle_de_Cuadro_Comparativo = true;
        return this._filterProveedor_2_Detalle_de_Cuadro_Comparativo(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores_2 = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_2_Detalle_de_Cuadro_Comparativo = false;
      this.searchProveedor_2_Detalle_de_Cuadro_ComparativoCompleted = true;
      this.SelectedProveedor_2_Detalle_de_Cuadro_Comparativo[index] = this.varCreacion_de_Proveedores_2.length === 0 ? '' : this.SelectedProveedor_2_Detalle_de_Cuadro_Comparativo[index];
    });
  }
  //#endregion

  //#region Proveedor 3

  public selectProveedor_3_Detalle_de_Cuadro_Comparativo(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_3_Detalle_de_Cuadro_Comparativo[index] = event.option.viewValue;
    let fgr = this.Comparativo_de_Proveedores_PiezasForm.controls.Detalle_de_Cuadro_ComparativoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Proveedor_3.setValue(event.option.value);
    this.displayFnProveedor_3_Detalle_de_Cuadro_Comparativo(element);
  }

  displayFnProveedor_3_Detalle_de_Cuadro_Comparativo(this, element) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    return this.SelectedProveedor_3_Detalle_de_Cuadro_Comparativo[index];
  }

  updateOptionProveedor_3_Detalle_de_Cuadro_Comparativo(event, element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    this.SelectedProveedor_3_Detalle_de_Cuadro_Comparativo[index] = event.source.viewValue;
  }

  _filterProveedor_3_Detalle_de_Cuadro_Comparativo(filter: any): Observable<Creacion_de_Proveedores> {
    const where = filter !== '' ? "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
    return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
  }

  addFilterToControlProveedor_3_Detalle_de_Cuadro_Comparativo(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_3_Detalle_de_Cuadro_Comparativo = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_3_Detalle_de_Cuadro_Comparativo = true;
        return this._filterProveedor_3_Detalle_de_Cuadro_Comparativo(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores_3 = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_3_Detalle_de_Cuadro_Comparativo = false;
      this.searchProveedor_3_Detalle_de_Cuadro_ComparativoCompleted = true;
      this.SelectedProveedor_3_Detalle_de_Cuadro_Comparativo[index] = this.varCreacion_de_Proveedores_3.length === 0 ? '' : this.SelectedProveedor_3_Detalle_de_Cuadro_Comparativo[index];
    });
  }
  //#endregion

  //#region Proveedor 4
  public selectProveedor_4_Detalle_de_Cuadro_Comparativo(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_4_Detalle_de_Cuadro_Comparativo[index] = event.option.viewValue;
    let fgr = this.Comparativo_de_Proveedores_PiezasForm.controls.Detalle_de_Cuadro_ComparativoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Proveedor_4.setValue(event.option.value);
    this.displayFnProveedor_4_Detalle_de_Cuadro_Comparativo(element);
  }

  displayFnProveedor_4_Detalle_de_Cuadro_Comparativo(this, element) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    return this.SelectedProveedor_4_Detalle_de_Cuadro_Comparativo[index];
  }

  updateOptionProveedor_4_Detalle_de_Cuadro_Comparativo(event, element: any) {
    const index = this.dataSourceComparativo_de_Cotizaciones.data.indexOf(element);
    this.SelectedProveedor_4_Detalle_de_Cuadro_Comparativo[index] = event.source.viewValue;
  }

  _filterProveedor_4_Detalle_de_Cuadro_Comparativo(filter: any): Observable<Creacion_de_Proveedores> {
    const where = filter !== '' ? "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
    return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
  }

  addFilterToControlProveedor_4_Detalle_de_Cuadro_Comparativo(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_4_Detalle_de_Cuadro_Comparativo = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_4_Detalle_de_Cuadro_Comparativo = true;
        return this._filterProveedor_4_Detalle_de_Cuadro_Comparativo(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores_4 = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_4_Detalle_de_Cuadro_Comparativo = false;
      this.searchProveedor_4_Detalle_de_Cuadro_ComparativoCompleted = true;
      this.SelectedProveedor_4_Detalle_de_Cuadro_Comparativo[index] = this.varCreacion_de_Proveedores_4.length === 0 ? '' : this.SelectedProveedor_4_Detalle_de_Cuadro_Comparativo[index];
    });
  }

  //#endregion


  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Comparativo_de_Proveedores_PiezasForm.disabled ? "Update" : this.operation;

          this.populateModel(this.model.Folio);

        } else {
          this.operation = "New";
          this.rulesOnInit();
        }
      });
  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Spartan_UserService.getAll());
    observablesArray.push(this.DepartamentoService.getAll());
    observablesArray.push(this.ModelosService.getAll());
    observablesArray.push(this.Estatus_de_SeguimientoService.getAll());
    observablesArray.push(this.AutorizacionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varSpartan_User, varDepartamento, varModelos, varEstatus_de_Seguimiento, varAutorizacion]) => {
          this.varSpartan_User = varSpartan_User;
          this.varDepartamento = varDepartamento;
          this.varModelos = varModelos;
          this.varEstatus_de_Seguimiento = varEstatus_de_Seguimiento;
          this.varAutorizacion = varAutorizacion;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Comparativo_de_Proveedores_PiezasForm.get('Solicitante').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingSolicitante = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Spartan_UserService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Spartan_UserService.listaSelAll(0, 20, '');
          return this.Spartan_UserService.listaSelAll(0, 20,
            "Spartan_User.Name like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Spartan_UserService.listaSelAll(0, 20,
          "Spartan_User.Name like '%" + value.Name.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingSolicitante = false;
      this.hasOptionsSolicitante = result?.Spartan_Users?.length > 0;
      this.optionsSolicitante = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingSolicitante = false;
      this.hasOptionsSolicitante = false;
      this.optionsSolicitante = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_Reporte').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNumero_de_Reporte = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Crear_ReporteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Crear_ReporteService.listaSelAll(0, 20, '');
          return this.Crear_ReporteService.listaSelAll(0, 20,
            "Crear_Reporte.No_Reporte like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Crear_ReporteService.listaSelAll(0, 20,
          "Crear_Reporte.No_Reporte like '%" + value.No_Reporte.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNumero_de_Reporte = false;
      this.hasOptionsNumero_de_Reporte = result?.Crear_Reportes?.length > 0;
      this.optionsNumero_de_Reporte = of(result?.Crear_Reportes);
    }, error => {
      this.isLoadingNumero_de_Reporte = false;
      this.hasOptionsNumero_de_Reporte = false;
      this.optionsNumero_de_Reporte = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_O_T').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNumero_de_O_T = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
          return this.Orden_de_TrabajoService.listaSelAll(0, 20,
            "Orden_de_Trabajo.numero_de_orden like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Orden_de_TrabajoService.listaSelAll(0, 20,
          "Orden_de_Trabajo.numero_de_orden like '%" + value.numero_de_orden.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNumero_de_O_T = false;
      this.hasOptionsNumero_de_O_T = result?.Orden_de_Trabajos?.length > 0;
      this.optionsNumero_de_O_T = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingNumero_de_O_T = false;
      this.hasOptionsNumero_de_O_T = false;
      this.optionsNumero_de_O_T = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeronaveService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeronaveService.listaSelAll(0, 20, '');
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Matricula like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeronaveService.listaSelAll(0, 20,
          "Aeronave.Matricula like '%" + value.Matricula.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = result?.Aeronaves?.length > 0;
      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor1').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingProveedor1 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Razon_social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Razon_social like '%" + value.Razon_social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingProveedor1 = false;
      this.hasOptionsProveedor1 = result?.Creacion_de_Proveedoress?.length > 0;
      this.optionsProveedor1 = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor1 = false;
      this.hasOptionsProveedor1 = false;
      this.optionsProveedor1 = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda1').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingTipo_de_Moneda1 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.MonedaService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.MonedaService.listaSelAll(0, 20, '');
          return this.MonedaService.listaSelAll(0, 20,
            "Moneda.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.MonedaService.listaSelAll(0, 20,
          "Moneda.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingTipo_de_Moneda1 = false;
      this.hasOptionsTipo_de_Moneda1 = result?.Monedas?.length > 0;
      this.optionsTipo_de_Moneda1 = of(result?.Monedas);
    }, error => {
      this.isLoadingTipo_de_Moneda1 = false;
      this.hasOptionsTipo_de_Moneda1 = false;
      this.optionsTipo_de_Moneda1 = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor2').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingProveedor2 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Razon_social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Razon_social like '%" + value.Razon_social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingProveedor2 = false;
      this.hasOptionsProveedor2 = result?.Creacion_de_Proveedoress?.length > 0;
      this.optionsProveedor2 = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor2 = false;
      this.hasOptionsProveedor2 = false;
      this.optionsProveedor2 = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda2').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingTipo_de_Moneda2 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.MonedaService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.MonedaService.listaSelAll(0, 20, '');
          return this.MonedaService.listaSelAll(0, 20,
            "Moneda.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.MonedaService.listaSelAll(0, 20,
          "Moneda.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingTipo_de_Moneda2 = false;
      this.hasOptionsTipo_de_Moneda2 = result?.Monedas?.length > 0;
      this.optionsTipo_de_Moneda2 = of(result?.Monedas);
    }, error => {
      this.isLoadingTipo_de_Moneda2 = false;
      this.hasOptionsTipo_de_Moneda2 = false;
      this.optionsTipo_de_Moneda2 = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor3').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingProveedor3 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Razon_social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Razon_social like '%" + value.Razon_social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingProveedor3 = false;
      this.hasOptionsProveedor3 = result?.Creacion_de_Proveedoress?.length > 0;
      this.optionsProveedor3 = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor3 = false;
      this.hasOptionsProveedor3 = false;
      this.optionsProveedor3 = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda3').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingTipo_de_Moneda3 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.MonedaService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.MonedaService.listaSelAll(0, 20, '');
          return this.MonedaService.listaSelAll(0, 20,
            "Moneda.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.MonedaService.listaSelAll(0, 20,
          "Moneda.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingTipo_de_Moneda3 = false;
      this.hasOptionsTipo_de_Moneda3 = result?.Monedas?.length > 0;
      this.optionsTipo_de_Moneda3 = of(result?.Monedas);
    }, error => {
      this.isLoadingTipo_de_Moneda3 = false;
      this.hasOptionsTipo_de_Moneda3 = false;
      this.optionsTipo_de_Moneda3 = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor4').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingProveedor4 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Razon_social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Razon_social like '%" + value.Razon_social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingProveedor4 = false;
      this.hasOptionsProveedor4 = result?.Creacion_de_Proveedoress?.length > 0;
      this.optionsProveedor4 = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor4 = false;
      this.hasOptionsProveedor4 = false;
      this.optionsProveedor4 = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda4').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingTipo_de_Moneda4 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.MonedaService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.MonedaService.listaSelAll(0, 20, '');
          return this.MonedaService.listaSelAll(0, 20,
            "Moneda.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.MonedaService.listaSelAll(0, 20,
          "Moneda.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingTipo_de_Moneda4 = false;
      this.hasOptionsTipo_de_Moneda4 = result?.Monedas?.length > 0;
      this.optionsTipo_de_Moneda4 = of(result?.Monedas);
    }, error => {
      this.isLoadingTipo_de_Moneda4 = false;
      this.hasOptionsTipo_de_Moneda4 = false;
      this.optionsTipo_de_Moneda4 = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingTipo_de_Moneda = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.MonedaService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.MonedaService.listaSelAll(0, 20, '');
          return this.MonedaService.listaSelAll(0, 20,
            "Moneda.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.MonedaService.listaSelAll(0, 20,
          "Moneda.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingTipo_de_Moneda = false;
      this.hasOptionsTipo_de_Moneda = result?.Monedas?.length > 0;
      this.optionsTipo_de_Moneda = of(result?.Monedas);
    }, error => {
      this.isLoadingTipo_de_Moneda = false;
      this.hasOptionsTipo_de_Moneda = false;
      this.optionsTipo_de_Moneda = of([]);
    });

    this.Comparativo_de_Proveedores_PiezasForm.get('Autorizado_por_DG').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAutorizado_por_DG = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Spartan_UserService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Spartan_UserService.listaSelAll(0, 20, '');
          return this.Spartan_UserService.listaSelAll(0, 20,
            "Spartan_User.Name like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Spartan_UserService.listaSelAll(0, 20,
          "Spartan_User.Name like '%" + value.Name.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingAutorizado_por_DG = false;
      this.hasOptionsAutorizado_por_DG = result?.Spartan_Users?.length > 0;
      this.optionsAutorizado_por_DG = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingAutorizado_por_DG = false;
      this.hasOptionsAutorizado_por_DG = false;
      this.optionsAutorizado_por_DG = of([]);
    });
    this.Comparativo_de_Proveedores_PiezasForm.get('Autorizado_por_Adm').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAutorizado_por_Adm = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Spartan_UserService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Spartan_UserService.listaSelAll(0, 20, '');
          return this.Spartan_UserService.listaSelAll(0, 20,
            "Spartan_User.Name like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Spartan_UserService.listaSelAll(0, 20,
          "Spartan_User.Name like '%" + value.Name.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingAutorizado_por_Adm = false;
      this.hasOptionsAutorizado_por_Adm = result?.Spartan_Users?.length > 0;
      this.optionsAutorizado_por_Adm = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingAutorizado_por_Adm = false;
      this.hasOptionsAutorizado_por_Adm = false;
      this.optionsAutorizado_por_Adm = of([]);
    });

  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Departamento': {
        this.DepartamentoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDepartamento = x.Departamentos;
        });
        break;
      }
      case 'Modelo': {
        this.ModelosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varModelos = x.Modeloss;
        });
        break;
      }

      case 'Estatus_de_Seguimiento': {
        this.Estatus_de_SeguimientoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Seguimiento = x.Estatus_de_Seguimientos;
        });
        break;
      }
      case 'Resultado': {
        this.AutorizacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAutorizacion = x.Autorizacions;
        });
        break;
      }
      case 'Resultado_DG': {
        this.AutorizacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAutorizacion = x.Autorizacions;
        });
        break;
      }
      case 'Resultado_Adm': {
        this.AutorizacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAutorizacion = x.Autorizacions;
        });
        break;
      }

      case 'Autorizado_por': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnSolicitante(option: Spartan_User) {
    return option?.Name;
  }
  displayFnNumero_de_Reporte(option: Crear_Reporte) {
    return option?.No_Reporte;
  }
  displayFnNumero_de_O_T(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnProveedor1(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }
  displayFnTipo_de_Moneda1(option: Moneda) {
    return option?.Descripcion;
  }
  displayFnProveedor2(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }
  displayFnTipo_de_Moneda2(option: Moneda) {
    return option?.Descripcion;
  }
  displayFnProveedor3(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }
  displayFnTipo_de_Moneda3(option: Moneda) {
    return option?.Descripcion;
  }
  displayFnProveedor4(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }
  displayFnTipo_de_Moneda4(option: Moneda) {
    return option?.Descripcion;
  }
  displayFnTipo_de_Moneda(option: Moneda) {
    return option?.Descripcion;
  }
  displayFnAutorizado_por(option: Spartan_User) {
    return option?.Name;
  }
  displayFnAutorizado_por_DG(option: Spartan_User) {
    return option?.Name;
  }
  displayFnAutorizado_por_Adm(option: Spartan_User) {
    return option?.Name;
  }


  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (await this.rulesBeforeSave()) {

      this.enableFields();
      const entity = this.Comparativo_de_Proveedores_PiezasForm.value;
      entity.Folio = this.model.Folio;

      /* entity.No__Solicitud = this.Comparativo_de_Proveedores_PiezasForm.get('No__Solicitud').value
      entity.Fecha_de_Solicitud = this.Comparativo_de_Proveedores_PiezasForm.get('Fecha_de_Solicitud').value
      entity.Razon_de_la_Compra = this.Comparativo_de_Proveedores_PiezasForm.get('Razon_de_la_Compra').value
      entity.Departamento = this.Comparativo_de_Proveedores_PiezasForm.get('Departamento').value; */

      entity.Solicitante = this.Comparativo_de_Proveedores_PiezasForm.get('Solicitante').value.Id_User;
      entity.Numero_de_Reporte = this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_Reporte').value?.Folio;
      entity.Numero_de_O_T = this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_O_T').value?.Folio;
      entity.Matricula = this.Comparativo_de_Proveedores_PiezasForm.get('Matricula').value?.Matricula;
      entity.Modelo = this.Comparativo_de_Proveedores_PiezasForm.get('Modelo')?.value;

      entity.Proveedor1 = this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor1').value?.Clave;
      entity.Tipo_de_Moneda1 = this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda1').value?.Clave;
      entity.Proveedor2 = this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor2').value?.Clave;
      entity.Tipo_de_Moneda2 = this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda2').value?.Clave;
      entity.Proveedor3 = this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor3').value?.Clave;
      entity.Tipo_de_Moneda3 = this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda3').value?.Clave;
      entity.Proveedor4 = this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor4').value?.Clave;
      entity.Tipo_de_Moneda4 = this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda4').value?.Clave;
      entity.Tipo_de_Moneda = this.Comparativo_de_Proveedores_PiezasForm.get('Tipo_de_Moneda').value?.Clave;
      entity.Autorizado_por_DG = this.Comparativo_de_Proveedores_PiezasForm.get('Autorizado_por_DG').value?.Id_User;
      entity.Autorizado_por_Adm = this.Comparativo_de_Proveedores_PiezasForm.get('Autorizado_por_Adm').value?.Id_User;


      if (entity.Numero_de_Reporte == 0) delete entity.Numero_de_Reporte
      if (entity.Numero_de_O_T == 0) delete entity.Numero_de_O_T
      if (entity.Matricula == "" || entity.Matricula == null) delete entity.Matricula
      if (entity.Modelo == 0) delete entity.Modelo

      if (entity.Proveedor1 == 0) delete entity.Proveedor1
      if (entity.Proveedor2 == 0) delete entity.Proveedor2
      if (entity.Proveedor3 == 0) delete entity.Proveedor3
      if (entity.Proveedor4 == 0) delete entity.Proveedor4

      if (entity.Tipo_de_Moneda1 == 0) delete entity.Tipo_de_Moneda1
      if (entity.Tipo_de_Moneda2 == 0) delete entity.Tipo_de_Moneda2
      if (entity.Tipo_de_Moneda3 == 0) delete entity.Tipo_de_Moneda3
      if (entity.Tipo_de_Moneda4 == 0) delete entity.Tipo_de_Moneda4

      //console.log(entity)

      if (this.model.Folio > 0) {
        await this.Comparativo_de_Proveedores_PiezasService.update(this.model.Folio, entity).toPromise().then(async id => {
          await this.saveDetalle_de_Cuadro_Comparativo(this.model.Folio);

          this.localStorageHelper.setItemToLocalStorage("IsResetSeguimiento", "1");
          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
          this.rulesAfterSave();

          return this.model.Folio;
        });

      } else {
        await (this.Comparativo_de_Proveedores_PiezasService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Cuadro_Comparativo(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());

          if (this.imprimir) {
            setTimeout(() => {
              this.PrintPDF(id);
            }, 2000);
          }
          else {
            this.snackBar.open('Registro guardado con éxito', '', {
              duration: 3000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'success'
            });
            this.localStorageHelper.setItemToLocalStorage("IsResetSeguimiento", "1");
            this.rulesAfterSave();
          }

          return id;
        }));
      }
     
      this.isLoading = false;
    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Comparativo_de_Proveedores_PiezasForm.reset();
      this.model = new Comparativo_de_Proveedores_Piezas(this.fb);
      this.Comparativo_de_Proveedores_PiezasForm = this.model.buildFormGroup();
      this.dataSourceComparativo_de_Cotizaciones = new MatTableDataSource<Detalle_de_Cuadro_Comparativo>();
      this.Comparativo_de_CotizacionesData = [];

    } else {
      this.router.navigate(['views/Comparativo_de_Proveedores_Piezas/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;
  }

  cancel() {
    if (this.fromSeguimiento || this.fromGestion_de_Aprobacion) {
      window.close();
    }
    else {
      this.goToList();
    }
    this.localStorageHelper.setItemToLocalStorage("fromGestion_de_Aprobacion", "false");
  }

  goToList() {
    this.router.navigate(['/Comparativo_de_Proveedores_Piezas/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  No__Solicitud_ExecuteBusinessRules(): void {
    //No__Solicitud_FieldExecuteBusinessRulesEnd
  }
  Solicitante_ExecuteBusinessRules(): void {
    //Solicitante_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Solicitud_ExecuteBusinessRules(): void {
    //Fecha_de_Solicitud_FieldExecuteBusinessRulesEnd
  }
  Razon_de_la_Compra_ExecuteBusinessRules(): void {
    //Razon_de_la_Compra_FieldExecuteBusinessRulesEnd
  }
  Departamento_ExecuteBusinessRules(): void {
    //Departamento_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Reporte_ExecuteBusinessRules(): void {
    //Numero_de_Reporte_FieldExecuteBusinessRulesEnd
  }
  Numero_de_O_T_ExecuteBusinessRules(): void {
    //Numero_de_O_T_FieldExecuteBusinessRulesEnd
  }
  Matricula_ExecuteBusinessRules(): void {
    //Matricula_FieldExecuteBusinessRulesEnd
  }
  Modelo_ExecuteBusinessRules(): void {
    //Modelo_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }

  Proveedor1_ExecuteBusinessRules(): void {


    //INICIA - BRID:7056 - Asignar campo requerido si el proveedor 1 esta seleccionado - Autor: Antonio Lopez - Actualización: 10/8/2021 11:57:25 AM
    if (this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor1"].value >= 1) {
      this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda1");
    } else {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda1");
    }
    //TERMINA - BRID:7056

    //Proveedor1_FieldExecuteBusinessRulesEnd


  }

  Total_Proveedor1_ExecuteBusinessRules(): void {
    //Total_Proveedor1_FieldExecuteBusinessRulesEnd
  }
  Total_Cotizacion_Proveedor1_ExecuteBusinessRules(): void {
    //Total_Cotizacion_Proveedor1_FieldExecuteBusinessRulesEnd
  }

  Tipo_de_Moneda1_ExecuteBusinessRules(): void {

    //Tipo_de_Moneda1_FieldExecuteBusinessRulesEnd

  }
  Proveedor2_ExecuteBusinessRules(): void {
    //Proveedor2_FieldExecuteBusinessRulesEnd
  }
  Total_Proveedor2_ExecuteBusinessRules(): void {
    //Total_Proveedor2_FieldExecuteBusinessRulesEnd
  }
  Total_Cotizacion_Proveedor2_ExecuteBusinessRules(): void {
    //Total_Cotizacion_Proveedor2_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Moneda2_ExecuteBusinessRules(): void {
    //Tipo_de_Moneda2_FieldExecuteBusinessRulesEnd
  }
  Proveedor3_ExecuteBusinessRules(): void {
    //Proveedor3_FieldExecuteBusinessRulesEnd
  }
  Total_Proveedor3_ExecuteBusinessRules(): void {
    //Total_Proveedor3_FieldExecuteBusinessRulesEnd
  }
  Total_Cotizacion_Proveedor3_ExecuteBusinessRules(): void {
    //Total_Cotizacion_Proveedor3_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Moneda3_ExecuteBusinessRules(): void {
    //Tipo_de_Moneda3_FieldExecuteBusinessRulesEnd
  }
  Proveedor4_ExecuteBusinessRules(): void {
    //Proveedor4_FieldExecuteBusinessRulesEnd
  }
  Total_Proveedor4_ExecuteBusinessRules(): void {
    //Total_Proveedor4_FieldExecuteBusinessRulesEnd
  }
  Total_Cotizacion_Proveedor4_ExecuteBusinessRules(): void {
    //Total_Cotizacion_Proveedor4_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Moneda4_ExecuteBusinessRules(): void {
    //Tipo_de_Moneda4_FieldExecuteBusinessRulesEnd
  }
  Total_Cotizacion_ExecuteBusinessRules(): void {
    //Total_Cotizacion_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Cambio_ExecuteBusinessRules(): void {
    //Tipo_de_Cambio_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Moneda_ExecuteBusinessRules(): void {
    //Tipo_de_Moneda_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    //Observaciones_FieldExecuteBusinessRulesEnd
  }
  Estatus_de_Seguimiento_ExecuteBusinessRules(): void {
    //Estatus_de_Seguimiento_FieldExecuteBusinessRulesEnd
  }
  idComprasGenerales_ExecuteBusinessRules(): void {
    //idComprasGenerales_FieldExecuteBusinessRulesEnd
  }
  idGestionAprobacionMantenimiento_ExecuteBusinessRules(): void {
    //idGestionAprobacionMantenimiento_FieldExecuteBusinessRulesEnd
  }
  FolioComparativoProv_ExecuteBusinessRules(): void {
    //FolioComparativoProv_FieldExecuteBusinessRulesEnd
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

    if (this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado"].value == 2) {
      this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
    }
    else {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
    }

  }
  Motivo_de_Rechazo_ExecuteBusinessRules(): void {
    //Motivo_de_Rechazo_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Autorizacion_DG_ExecuteBusinessRules(): void {
    //Fecha_de_Autorizacion_DG_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Autorizacion_DG_ExecuteBusinessRules(): void {
    //Hora_de_Autorizacion_DG_FieldExecuteBusinessRulesEnd
  }
  Autorizado_por_DG_ExecuteBusinessRules(): void {
    //Autorizado_por_DG_FieldExecuteBusinessRulesEnd
  }

  Resultado_DG_ExecuteBusinessRules(): void {

    //INICIA - BRID:6592 - Asignar obligatorio motivo si es rechazo - Autor: Lizeth Villa - Actualización: 10/1/2021 2:58:02 PM
    if (this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_DG"].value == 2) {
      this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_DG");
    }
    else {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_DG");
    }
    //TERMINA - BRID:6592

    //Resultado_DG_FieldExecuteBusinessRulesEnd

  }
  Motivo_de_Rechazo_DG_ExecuteBusinessRules(): void {
    //Motivo_de_Rechazo_DG_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Autorizacion_Adm_ExecuteBusinessRules(): void {
    //Fecha_de_Autorizacion_Adm_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Autorizacion_Adm_ExecuteBusinessRules(): void {
    //Hora_de_Autorizacion_Adm_FieldExecuteBusinessRulesEnd
  }
  Autorizado_por_Adm_ExecuteBusinessRules(): void {
    //Autorizado_por_Adm_FieldExecuteBusinessRulesEnd
  }

  Resultado_Adm_ExecuteBusinessRules(): void {

    //INICIA - BRID:6593 - Asignar obligatorio motivo si resultado es no autorizado - Autor: Lizeth Villa - Actualización: 10/1/2021 2:59:13 PM
    if (this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_Adm"].value == 2) {
      this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_Adm");
    } else {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_Adm");
    }
    //TERMINA - BRID:6593

    //Resultado_Adm_FieldExecuteBusinessRulesEnd

  }

  Motivo_de_Rechazo_Adm_ExecuteBusinessRules(): void {
    //Motivo_de_Rechazo_Adm_FieldExecuteBusinessRulesEnd
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

  rulesOnInit() {
    //rulesOnInit_ExecuteBusinessRulesInit

    //#region BRID:3912 - Ocultar campos siempre - Autor: Lizeth Villa - Actualización: 8/17/2021 4:58:00 PM
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idMateriales");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idMateriales");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idHerramientas");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idHerramientas");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "FolioComparativoProv");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "FolioComparativoProv");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idGestionAprobacionMantenimiento");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idGestionAprobacionMantenimiento");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "FolioComparativoProv");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idGestionAprobacionMantenimiento");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Folio");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Folio");
    this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
    //#endregion


    //#region BRID:3917 - Asignar no obligatorio y deshabilitados siempre - Autor: Lizeth Villa - Actualización: 6/15/2021 3:29:26 PM
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Observaciones");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Folio");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Numero_de_Reporte");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Numero_de_O_T");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Matricula");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "No__Solicitud");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Solicitante");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Solicitud");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Observaciones");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Razon_de_la_Compra");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Departamento");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Modelo");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "FolioComparativoProv");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Folio");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Proveedor1");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Partes");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Servicios");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_Proveedor1");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda1");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_Cotizacion_Proveedor1");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Proveedor2");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_Proveedor2");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda2");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_Cotizacion_Proveedor2");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Proveedor3");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_Proveedor3");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda3");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_Cotizacion_Proveedor3");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Proveedor4");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Materiales");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Herramientas");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Horas_del_Componente_a_Remover");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ciclos_Componentes_a_Remover");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Condicion_de_la_Pieza_Solicitada");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_estimada_de_Mtto_");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "No__de_Parte___Descripcion");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_Proveedor4");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda4");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_Cotizacion_Proveedor4");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Cambio");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_Cotizacion");
    //this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Cantidad");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Proveedor_1");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Seleccion_1");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Costo_Unitario_1");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_1");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Proveedor_2");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Seleccion_2");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Costo_Unitario_2");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_2");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Proveedor_3");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Seleccion_3");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Costo_Unitario_3");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_3");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Proveedor_4");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Seleccion_4");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Costo_Unitario_4");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Total_4");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Comparativo_de_Proveedores");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idGestionAprobacionMantenimiento");
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Folio', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Numero_de_Reporte', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Numero_de_O_T', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Matricula', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'No__Solicitud', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Solicitante', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Fecha_de_Solicitud', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Estatus', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Estatus_de_Seguimiento', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Razon_de_la_Compra', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Departamento', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Fecha_de_Autorizacion', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Hora_de_Autorizacion', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'N_Servicio_Descripcion', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Codigo_Des_Herramientas', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Modelo', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Proveedor1', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Total_Proveedor1', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Total_Cotizacion_Proveedor1', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Proveedor2', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Total_Proveedor2', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Total_Cotizacion_Proveedor2', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Proveedor3', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Total_Proveedor3', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Total_Cotizacion_Proveedor3', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Proveedor4', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Total_Proveedor4', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Total_Cotizacion_Proveedor4', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Total_Cotizacion', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Fecha_de_Autorizacion_Adm', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Hora_de_Autorizacion_Adm', 0);
    this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por_Adm', 0);
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_DG");
    this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_Adm");
    //#endregion


    if (this.operation == "New") {
      this.getDataFromSeguimientoSolicitudCompras();
    }



    //INICIA - BRID:3913 - Asignar fecha, hora y usuario que autoriza y bloquear campos - Autor: Lizeth Villa - Actualización: 9/20/2021 6:46:06 PM
    if (this.operation == 'New') {

      this.Comparativo_de_Proveedores_PiezasForm.controls["Autorizado_por"].setValue(this.UserId)
      this.Comparativo_de_Proveedores_PiezasForm.controls["Fecha_de_Autorizacion"].setValue(this.today)
      moment.locale('es');
      var now = moment().format("HH:mm:ss");
      this.Comparativo_de_Proveedores_PiezasForm.controls["Hora_de_Autorizacion"].setValue(now)

      this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Fecha_de_Autorizacion', 0);
      this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Hora_de_Autorizacion', 0);
      this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por', 0);
    }
    //TERMINA - BRID:3913

    //INICIA - BRID:3924 - Ocultar campos si el tipo de mr es de compras generales - Autor: Lizeth Villa - Actualización: 8/17/2021 5:20:06 PM
    if (this.Tipo_MR == 1) {
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Numero_de_Reporte");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Numero_de_Reporte");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Horas_del_Componente_a_Remover");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Horas_del_Componente_a_Remover");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Ciclos_del_Componente_a_Remover");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ciclos_del_Componente_a_Remover");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Condicion_de_la_Pieza_Solicitada");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Condicion_de_la_Pieza_Solicitada");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_Estimada_del_Mtto_");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_Estimada_del_Mtto_");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
      //this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Cambio");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Cambio");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Tipo");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "N_Servicio_Descripcion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "N_Servicio_Descripcion");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Codigo_Des_Herramientas");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Codigo_Des_Herramientas");
    }
    //TERMINA - BRID:3924


    //INICIA - BRID:3987 - Ocultar campos si el mr es piezas - Autor: Lizeth Villa - Actualización: 8/17/2021 5:19:19 PM
    if (this.Tipo_MR == 2) {
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_Estimada_del_Mtto_");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_Estimada_del_Mtto_");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Cambio");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Cambio");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
    }
    //TERMINA - BRID:3987


    //INICIA - BRID:3990 - Ocultar campos si el MR es Servicios de mantenimiento con codigo manual - Autor: Lizeth Villa - Actualización: 6/25/2021 11:24:06 AM
    if (this.Tipo_MR == 3) {
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Descripcion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Descripcion");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Horas_del_Componente_a_Remover");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Horas_del_Componente_a_Remover");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Ciclos_del_Componente_a_Remover");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ciclos_del_Componente_a_Remover");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Condicion_de_la_Pieza_Solicitada");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Condicion_de_la_Pieza_Solicitada");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idMateriales");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idMateriales");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idHerramientas");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idHerramientas");
      this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Codigo_Des_Herramientas");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Codigo_Des_Herramientas");
    }
    //TERMINA - BRID:3990


    //INICIA - BRID:3991 - Asignar valores si el tipo de MR es de Servicios con codigo manual - Autor: Lizeth Villa - Actualización: 6/25/2021 12:41:00 AM
    if (this.operation == 'New') {
      if (this.Tipo_MR == 3) {
        //this.brf.SetValueControl(this.Comparativo_de_Proveedores_PiezasForm, "idServicios", "folio_solicitud");
      }
    }
    //TERMINA - BRID:3991


    //INICIA - BRID:3992 - Asignar valores si el tipo de MR  es materiales con codigo manual - Autor: Lizeth Villa - Actualización: 6/25/2021 1:06:16 AM
    if (this.operation == 'New') {
      if (this.Tipo_MR == 4) {
        //this.brf.SetValueFromQuery(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte", this.brf.EvaluaQuery(" ", 1, "ABC123"), 1, "ABC123");
      }

    }
    //TERMINA - BRID:3992


    //INICIA - BRID:3993 - Ocultar campos si el tipo de MR es de materiales - Autor: Lizeth Villa - Actualización: 6/25/2021 11:27:48 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.Tipo_MR == 4) {
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Descripcion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Descripcion");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Horas_del_Componente_a_Remover");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Horas_del_Componente_a_Remover");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Ciclos_del_Componente_a_Remover");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ciclos_del_Componente_a_Remover");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Condicion_de_la_Pieza_Solicitada");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Condicion_de_la_Pieza_Solicitada");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_Estimada_del_Mtto_");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_Estimada_del_Mtto_");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Observaciones");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Observaciones");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "N_Servicio_Descripcion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "N_Servicio_Descripcion");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Codigo_Des_Herramientas");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Codigo_Des_Herramientas");
      }
    }
    //TERMINA - BRID:3993


    //INICIA - BRID:3994 - Ocultar campo si el MR es de Herramientas - Autor: Lizeth Villa - Actualización: 6/25/2021 11:29:39 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.Tipo_MR == 5) {
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idPiezas");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idServicios");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "No_de_Parte");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Descripcion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Descripcion");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Horas_del_Componente_a_Remover");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Horas_del_Componente_a_Remover");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Ciclos_del_Componente_a_Remover");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ciclos_del_Componente_a_Remover");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Condicion_de_la_Pieza_Solicitada");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Condicion_de_la_Pieza_Solicitada");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_Estimada_del_Mtto_");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_Estimada_del_Mtto_");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Detalle_de_la_Falla");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Ref_");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Codigo");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "idComprasGenerales");
        this.brf.HideFieldOfForm(this.Comparativo_de_Proveedores_PiezasForm, "N_Servicio_Descripcion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "N_Servicio_Descripcion");
      }
    }
    //TERMINA - BRID:3994


    //INICIA - BRID:3995 - Asignar valores si el tipo de MR es herramientas con codigo manual - Autor: Lizeth Villa - Actualización: 6/25/2021 2:57:13 AM
    if (this.operation == 'New') {
      if (this.Tipo_MR == 5) {
        //this.brf.SetValueFromQuery(this.Comparativo_de_Proveedores_PiezasForm, "No__Solicitud", this.brf.EvaluaQuery(" ", 1, "ABC123"), 1, "ABC123");
      }
    }
    //TERMINA - BRID:3995


    //INICIA - BRID:4064 - ocultar pestaña autorizacion - Autor: Lizeth Villa - Actualización: 7/5/2021 12:29:59 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFolder("Autorizacion_por_Direccion_General");
    }
    //TERMINA - BRID:4064


    //INICIA - BRID:5003 - desabilitar campos de mr - Autor: Lizeth Villa - Actualización: 8/18/2021 2:57:31 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'No__de_Parte___Descripcion', 0);
      this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Cantidad', 0);
    }
    //TERMINA - BRID:5003


    //INICIA - BRID:6346 - En la pantalla Cuadro Comparativo al editar , desabilitar los campos y no requeridos a Fecha de Autorización, Hora de Autorización y Autorizado por de la pestaña Direccion General - Autor: Francisco Javier Martínez Urbina - Actualización: 9/21/2021 12:50:02 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Fecha_de_Autorizacion_DG', 0);
      this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Hora_de_Autorizacion_DG', 0);
      this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por_DG', 0);
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_DG");
    }
    //TERMINA - BRID:6346


    if (this.operation == 'Update') {

      //#region BRID:6604 - Al editar y la fase es en proceso de autorización, bloquear todos los campos de datos generales - Autor: Lizeth Villa - Actualización: 10/1/2021 5:30:05 PM
      if (this.Comparativo_de_Proveedores_PiezasForm.controls["Estatus_de_Seguimiento"].value == 6) {
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda1', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda2', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda3', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda4', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Cambio', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda', 0);
      }
      //#endregion

      if (this.RoleId == 42 && this.Comparativo_de_Proveedores_PiezasForm.controls["Estatus_de_Seguimiento"].value == 6) {

        //#region BRID:6360 - Al editar si el rol es Compras y el estatus es 6 entonces asignar valores a Fecha de Autorización, Hora de Autorización y Autorizado por. - Autor: Francisco Javier Martínez Urbina - Actualización: 9/21/2021 2:08:08 PM
        this.brf.SetCurrentDateToField(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion");
        this.brf.SetCurrentHourToField(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion");
        this.Comparativo_de_Proveedores_PiezasForm.controls["Autorizado_por"].setValue(this.UserId)

        this.Comparativo_de_Proveedores_PiezasForm.controls["Fecha_de_Autorizacion"].disable();
        this.Comparativo_de_Proveedores_PiezasForm.controls["Hora_de_Autorizacion"].disable();
        this.Comparativo_de_Proveedores_PiezasForm.controls["Autorizado_por"].disable();
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");

        //#region BRID:6362 - al editar y consulta, si el rol es Compras y el estatus es 6 entonces Ocultar la pestaña Direccion General y pestaña administracion con todos sus campos desabilitados y no obligatorios - Autor: Lizeth Villa - Actualización: 9/22/2021 3:25:12 PM
        this.brf.HideFolder("Autorizacion_Direccion_General");
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Fecha_de_Autorizacion_DG', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Hora_de_Autorizacion_DG', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Resultado_DG', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Motivo_de_Rechazo_DG', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por_DG', 0);
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_DG");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_DG");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado_DG");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_DG");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_DG");
        this.brf.HideFolder("Autorizacion_Administracion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_Adm");
        //#endregion

      }

      if (this.RoleId == 10 && this.Comparativo_de_Proveedores_PiezasForm.controls["Estatus_de_Seguimiento"].value == 6) {
        //#region BRID:6366 - al editar , si el rol es Direccion General y el estatus es 6 entonces asignar valores a Fecha de Autorización, Hora de Autorización y Autorizado por.  - Autor: Francisco Javier Martínez Urbina - Actualización: 9/21/2021 5:13:44 PM
        this.brf.SetCurrentDateToField(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_DG");
        this.brf.SetCurrentHourToField(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_DG");
        this.brf.SetValueFromQuery(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_DG", this.brf.EvaluaQuery(`SELECT name FROM Spartan_User WITH(NOLOCK) WHERE Id_User = ${this.UserId}`, 1, "ABC123"), 1, "ABC123");
        //#endregion
      }

      if (this.RoleId == 9 && this.Comparativo_de_Proveedores_PiezasForm.controls["Estatus_de_Seguimiento"].value == 6) {
        //BRID:6410 - Al editar , si el rol es Admin del sistema y el estatus es 6 entonces asignar valores a Fecha de Autorización, Hora de Autorización y Autorizado por. - Autor: Lizeth Villa - Actualización: 9/22/2021 3:04:49 PM

        this.Comparativo_de_Proveedores_PiezasForm.controls["Autorizado_por_Adm"].setValue(this.UserId)
        this.Comparativo_de_Proveedores_PiezasForm.controls["Fecha_de_Autorizacion_Adm"].setValue(this.today)
        moment.locale('es');

        var now = moment().format("HH:mm:ss");
        this.Comparativo_de_Proveedores_PiezasForm.controls["Hora_de_Autorizacion_Adm"].setValue(now)
        //TERMINA - BRID:6410
      }


    }


    //INICIA - BRID:6368 - al editar y consulta, si el rol es Direccion General entonces Ocultar la pestaña Compras con todos sus campos desabilitados y no obligatorios - Autor: Francisco Javier Martínez Urbina - Actualización: 9/22/2021 6:27:47 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.RoleId == 10) {
        this.brf.HideFolder("Autorizacion_Compras");
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Fecha_de_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Hora_de_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Resultado', 0);
        this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Motivo_de_Rechazo', 0);
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
        this.brf.HideFolder("Autorizacion_Administracion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_Adm");
        this.brf.HideFolder("Autorizacion_Administracion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_Adm");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_Adm");
      }
    }
    //TERMINA - BRID:6368


    //INICIA - BRID:6369 - al editar si es Direccion General o Administrativo y Compras ya autorizó, mostrar la pestaña de Compras, con todos sus datos desabilitados y no obligatorios. - Autor: Francisco Javier Martínez Urbina - Actualización: 9/28/2021 4:39:09 PM
    if (this.operation == 'Update') {
      //if(  EvaluaOperatorIn (this.brf.TryParseInt(this.brf.ReplaceVAR('USERROLEID'), this.brf.ReplaceVAR('USERROLEID')), this.brf.TryParseInt('10,22', '10,22') ) && this.brf.GetValueByControlType(this.Comparativo_de_Proveedores_PiezasForm, 'Resultado')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowFolder("Autorizacion_Compras"); this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Fecha_de_Autorizacion', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Hora_de_Autorizacion', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Autorizado_por', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Resultado', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Motivo_de_Rechazo', 0); this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion");this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion");this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por");this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado");this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");} else {}
    }
    //TERMINA - BRID:6369


    if (this.operation == 'New') {
      //#region BRID:6390 - En nuevo, ocultar pestañas de autorización - Autor: Lizeth Villa - Actualización: 10/1/2021 11:38:33 AM
      this.brf.HideFolder("Autorizacion_Compras");
      this.brf.HideFolder("Autorizacion_Direccion_General");
      this.brf.HideFolder("Autorizacion_Administracion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_Adm");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_Adm");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado_Adm");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_Adm");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_Adm");
      //#endregion

      //#region BRID:6391 - Asignar campos autorización no obligatorios - Autor: Lizeth Villa - Actualización: 9/22/2021 2:49:50 PM
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_DG");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_Adm");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_Adm");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado_Adm");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_Adm");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_Adm");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "FolioDetalle");
      //#endregion

    }


    //INICIA - BRID:6413 - Al abrir la pantalla en edicion y consulta si es rol es 9 Administracion ocultar las pestañas de compras y direccion general y sus campos no requeridos - Autor: Francisco Javier Martínez Urbina - Actualización: 9/28/2021 4:41:17 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.RoleId == 22) {
        this.brf.HideFolder("Autorizacion_Compras");
        this.brf.HideFolder("Autorizacion_Direccion_General");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion_DG");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion_DG");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado_DG");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo_DG");
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por_DG");
      }
    }
    //TERMINA - BRID:6413


    //INICIA - BRID:6415 - En modificar y consultar, Si el rol de Admin y no ha autorizado compras, ocular pestaña de compras - Autor: Francisco Javier Martínez Urbina - Actualización: 9/28/2021 4:40:27 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.RoleId == 22 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado"].value == null) {
        this.brf.HideFolder("Autorizacion_Compras");
      }
    }
    //TERMINA - BRID:6415


    //INICIA - BRID:6419 - En modificar, asignar obligatorio motivo, si el rol es compras y el estatus en 6 - Autor: Lizeth Villa - Actualización: 9/22/2021 6:57:18 PM
    if (this.operation == 'Update') {
      if (this.RoleId == 42 && this.Comparativo_de_Proveedores_PiezasForm.controls["Estatus_de_Seguimiento"].value == 6) {
        //this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
      }
    }
    //TERMINA - BRID:6419


    //INICIA - BRID:6561 - Desabilitar campos de datos generales al editar para roles que autorizan - Autor: Francisco Javier Martínez Urbina - Actualización: 9/30/2021 1:32:09 PM
    if (this.operation == 'Update') {
      //if(  EvaluaOperatorIn (this.brf.TryParseInt(this.brf.ReplaceVAR('USERROLEID'), this.brf.ReplaceVAR('USERROLEID')), this.brf.TryParseInt('9,10,22', '9,10,22') ) ) {  this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Observaciones', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda1', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda2', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda3', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda4', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Cambio', 0);this.brf.SetEnabledControl(this.Comparativo_de_Proveedores_PiezasForm, 'Tipo_de_Moneda', 0);} else {}
    }
    //TERMINA - BRID:6561


    //INICIA - BRID:7064 - modificar asignar requerido campo tipo moneda si proveedor 1 esta seleccionado - Autor: Antonio Lopez - Actualización: 10/7/2021 12:44:02 PM
    if (this.operation == 'Update') {
      if (this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor1"].value >= 1) {
        this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda1");
      }
      else {
        this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda1");
      }
    }
    //TERMINA - BRID:7064


    //INICIA - BRID:7070 - En nuevo asignar no requerido a campo motivo - Autor: Lizeth Villa - Actualización: 10/7/2021 10:22:25 AM
    if (this.operation == 'New') {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
    }
    //TERMINA - BRID:7070


    //INICIA - BRID:7088 - Campo tipo moneda siempre obligatorio - Autor: Lizeth Villa - Actualización: 10/8/2021 1:00:20 PM
    if (this.operation == 'New') {
      this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda");
    }
    //TERMINA - BRID:7088


    //INICIA - BRID:7147 - WF:10 Rule - Phase: 1 (Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 1) {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
    }
    //TERMINA - BRID:7147


    //INICIA - BRID:7149 - WF:10 Rule - Phase: 2 (No Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.Phase == 2) {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Fecha_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Hora_de_Autorizacion");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Autorizado_por");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Resultado");
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Motivo_de_Rechazo");
    }
    //TERMINA - BRID:7149


    //INICIA - BRID:7151 - WF:10 Rule - Phase: 3 (En Proceso de Autorización) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.Phase == 3) {

      }
    }
    //TERMINA - BRID:7151

    //INICIA - BRID:7246 - compras habilitar el mr - Autor: Eliud Hernandez - Actualización: 4/12/2022 5:25:38 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.RoleId == 43) {
        this.brf.ShowFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Proveedor1");
        this.brf.ShowFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "No__de_Parte___Descripcion");
        this.brf.ShowFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Cantidad");
      }
    }
    //TERMINA - BRID:7246

    //rulesOnInit_ExecuteBusinessRulesEnd

    this.hideColumnsDataTable()

  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    const KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)

    //INICIA - BRID:4079 - Actualizar estatus de seguimiento de cada item de compras generales con codigo manual - Autor: Lizeth Villa - Actualización: 7/6/2021 4:57:18 PM
    if (this.operation == 'New') {
      if (this.Tipo_MR == 1) {
        this.dataSourceComparativo_de_Cotizaciones.data.forEach(element => {
          this.brf.EvaluaQuery(`UPDATE Detalle_de_Item_Compras_Generales set Estatus_de_Seguimiento = 6 where Folio = ${element.FolioDetalle}`, 1, "ABC123");
        });
      }
    }
    //TERMINA - BRID:4079


    //INICIA - BRID:4080 - Actualizar estatus de seguimiento de cada item de Detalle_Solicitud_de_Piezas con codigo manual - Autor: Lizeth Villa - Actualización: 7/6/2021 5:26:06 PM
    if (this.operation == 'New') {
      if (this.Tipo_MR == 2) {
        this.brf.EvaluaQuery(" update", 1, "ABC123");
      }
    }
    //TERMINA - BRID:4080


    //INICIA - BRID:4081 - Actualizar estatus de seguimiento de cada item de Detalle_Solicitud_de_Servicios_Gestion_de_aprobacion con codigo manual - Autor: Lizeth Villa - Actualización: 7/6/2021 5:26:07 PM
    if (this.operation == 'New') {
      if (this.Tipo_MR == 3) {
        this.brf.EvaluaQuery(" update", 1, "ABC123");
      }
    }
    //TERMINA - BRID:4081


    //INICIA - BRID:4082 - Actualizar estatus de seguimiento de cada item de Detalle_Solicitud_de_Materiales_Gestion_de_aprobacion con codigo manual - Autor: Lizeth Villa - Actualización: 7/6/2021 5:26:09 PM
    if (this.operation == 'New') {
      if (this.Tipo_MR == 4) {
        this.brf.EvaluaQuery(" update", 1, "ABC123");
      }
    }
    //TERMINA - BRID:4082


    //INICIA - BRID:4083 - Actualizar estatus de seguimiento de cada item de Detalle_Solicitud_de_Herramientas_Gestion_de_aprobacion con codigo manual - Autor: Lizeth Villa - Actualización: 7/6/2021 5:26:10 PM
    if (this.operation == 'New') {
      if (this.Tipo_MR == 5) {
        this.brf.EvaluaQuery("UPDATE", 1, "ABC123");
      }
    }
    //TERMINA - BRID:4083


    //INICIA - BRID:4095 - Asignar folio a campo folioComparativoProv - Autor: Lizeth Villa - Actualización: 7/9/2021 3:03:24 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(` UPDATE Comparativo_de_Proveedores_Piezas SET FolioComparativoProv = FOLIO WHERE FOLIO = ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4095


    //INICIA - BRID:4171 - Asignar proveedor despues de guardar en MR de Detalle_de_Gestion_de_aprobacion - Autor: Lizeth Villa - Actualización: 9/21/2021 6:49:33 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(`EXEC spUpdateGestionAprobacion ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4171


    //INICIA - BRID:4174 - Actualizar estatus de seguiento a "autorizadas" temporalmete - Autor: Lizeth Villa - Actualización: 9/21/2021 9:07:12 AM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(`UPDATE Comparativo_de_Proveedores_Piezas SET Estatus_de_Seguimiento = 1 where Folio = ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4174


    //INICIA - BRID:4314 - Correo de Autorización para Dirección General. - Autor: Lizeth Villa - Actualización: 7/22/2021 5:08:09 PM
    if (this.operation == 'New') {
      //this.brf.SendEmailQuery("VICS - Nueva Solicitud de Compra", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where Role = 10 for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado/a (Usuario): </p> <p>Para hacer de su conocimiento que ha ingresado una solicitud para su visto bueno y / o autorización.. </p> <p>Atentamente</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div></center></td></tr></table></body></html>	");
    }
    //TERMINA - BRID:4314


    //INICIA - BRID:6341 - En nuevo, después de guardar, actualizar estatus a 6-Por Autorizar Dirección General - Autor: Lizeth Villa - Actualización: 9/21/2021 7:06:42 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(`EXEC spUpdateEstatusCuadroComparativo 6, ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:6341


    //INICIA - BRID:6370 - Despues de guardar al editar, si el rol es Compras y Autorizan y el Resultado DG es diferente a rechazado entonces cambiarle el estatus a Autorizado - Autor: Francisco Javier Martínez Urbina - Actualización: 9/22/2021 6:06:59 PM
    if (this.operation == 'Update') {
      if (this.RoleId == 42 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_DG"].value != 2 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado"].value == 1) {
        this.brf.EvaluaQuery(`update Comparativo_de_Proveedores_Piezas set Estatus_de_seguimiento = 1 where Folio =  ${this.model.Folio}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6370


    //INICIA - BRID:6373 - Después de guardar, si el rol es Compras y NO Autorizan y el Resultado DG es diferente a autorizado entonces cambiarle el estatus a No autorizado - Autor: Francisco Javier Martínez Urbina - Actualización: 9/22/2021 6:07:02 PM
    if (this.operation == 'Update') {
      if (this.RoleId == 42 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado"].value == 2 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_DG"].value == 1) {
        this.brf.EvaluaQuery(`update Comparativo_de_Proveedores_Piezas set Estatus_de_seguimiento = 2 where Folio = ${this.model.Folio}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6373


    //INICIA - BRID:6374 - Despues de guardar al editar, si el rol es Direccion General y Autorizan entonces cambiarle el estatus a Autorizado - Autor: Francisco Javier Martínez Urbina - Actualización: 9/22/2021 6:06:51 PM
    if (this.operation == 'Update') {
      if (this.RoleId == 10 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_DG"].value == 1) {
        this.brf.EvaluaQuery(`update Comparativo_de_Proveedores_Piezas set Estatus_de_seguimiento = 1 where Folio = ${this.model.Folio}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6374


    //INICIA - BRID:6375 - Después de guardar al editar, si el rol es Dirección General y NO Autorizan entonces cambiarle el estatus a No autorizado - Autor: Francisco Javier Martínez Urbina - Actualización: 9/22/2021 6:06:54 PM
    if (this.operation == 'Update') {
      if (this.RoleId == 10 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_DG"].value == 2) {
        this.brf.EvaluaQuery(`update Comparativo_de_Proveedores_Piezas set Estatus_de_seguimiento = 2 where Folio = ${this.model.Folio}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6375


    //INICIA - BRID:6411 - Despues de guardar al editar, si el rol es 22 Administrativo y Autorizan entonces cambiarle el estatus a autorizado - Autor: Lizeth Villa - Actualización: 10/8/2021 1:04:37 PM
    if (this.operation == 'Update') {
      if (this.RoleId == 22 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_Adm"].value == 1) {
        this.brf.EvaluaQuery(`update Comparativo_de_Proveedores_Piezas set Estatus_de_seguimiento = 1 where Folio = ${this.model.Folio}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6411


    //INICIA - BRID:6412 - Despues de guardar al editar, si el rol es 22 Administrativo y NO Autorizan entonces cambiarle el estatus a No autorizado - Autor: Lizeth Villa - Actualización: 10/5/2021 1:52:42 PM
    if (this.operation == 'Update') {
      if (this.RoleId == 22 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_Adm"].value == 2) {
        this.brf.EvaluaQuery(`update Comparativo_de_Proveedores_Piezas set Estatus_de_seguimiento = 2 where Folio = ${this.model.Folio}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6412


    //INICIA - BRID:6560 - Enviar correo después de guardar, en nuevo, a rol administrativo si el total de la cotizacion es menor a 5000,  con ajuste manual, no desactivar - Autor: Lizeth Villa - Actualización: 9/29/2021 7:07:44 PM
    if (this.operation == 'New') {
      if (this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Cotizacion"].value < 5000) {
        //this.brf.SendEmailQuery("VICS - Nueva Solicitud de Cuadro Comparartivo", this.brf.EvaluaQuery("select STUFF((select ';' + Email + '' from Spartan_User where Role = 22 for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html><html><head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <title>EmailTemplate-Fluid</title> <style type='text/css'> html, body{margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important;}*{-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}.ExternalClass{width: 100%;}div[style*='margin: 16px 0']{margin: 0 !important;}table, td{mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important;}table{border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important;}table table table{table-layout: auto;}img{-ms-interpolation-mode: bicubic;}.yshortcuts a{border-bottom: none !important;}a[x-apple-data-detectors]{color: inherit !important;}/* Estilos Hover para botones */ .button-td, .button-a{transition: all 100ms ease-in;}.button-td:hover, .button-a:hover{color: #000;}</style></head><body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'> <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0' style='border-collapse:collapse;'> <tr> <td> <center style='width: 100%;'> <div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div><div style='max-width: 600px;'> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'> <tr> <td width='40'>&nbsp;</td><td width='260'><img src='logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr> <td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td> <table cellspacing='0' cellpadding='0' border='0' width='100%'> <tr> <td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'> <p>Estimado/a ##usuario##: </p><p>Para hacer de su conocimiento que ha ingresado una solicitud para su visto bueno y / o autorización.. </p><p>Atentamente</p></td></tr></table> </td></tr></table> <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'> <tr> <td width='40'>&nbsp;</td><td width='40' align='right' valign='middle'> <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='fill:#325396; transform:;-ms-filter:;'> <path d='M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z'> </path> </svg> </td><td width='5'>&nbsp;</td><td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p></td><td width='40'>&nbsp;</td></tr></table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td></tr><tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'> &nbsp; </td></tr></table> </div></center> </td></tr></table></body></html>");
      }
    }
    //TERMINA - BRID:6560


    //INICIA - BRID:6590 - En modificar, después de guardar, enviar correo de rechazo de Direccion general a compras, con ajuste manual, no desactivar - Autor: Lizeth Villa - Actualización: 10/1/2021 2:12:28 PM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Comparativo_de_Proveedores_PiezasForm, 'Resultado_DG')==this.brf.TryParseInt('2', '2') ) { this.brf.SendEmailQuery("Notificación de Rechazo - Comparativo de Cotizaciones", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + '' from Spartan_User where Role = 42 for XML PATH('') ), 1, 1, '') ", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado Compras</p> <p>Para hacer de su conocimiento que la solicitud No. FLD[No__Solicitud] ha sido rechazada por el motivo 'FLD[Motivo_de_Rechazo_DG]'.</p> <p>Atentamente.</p> <p>Aerovics S.A. de C.V.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style="fill:#325396;transform:;-ms-filter:"> <path fill="none" d="M12,8c-1.178,0-2,0.822-2,2s0.822,2,2,2s2-0.822,2-2S13.178,8,12,8z"> </path> <path fill="none" d="M12,4c-4.337,0-8,3.663-8,8c0,2.176,0.923,4.182,2.39,5.641c0.757-1.8,2.538-3.068,4.61-3.068h2 c2.072,0,3.854,1.269,4.61,3.068C19.077,16.182,20,14.176,20,12C20,7.663,16.337,4,12,4z M12,14c-2.28,0-4-1.72-4-4s1.72-4,4-4 s4,1.72,4,4S14.28,14,12,14z"> </path> <path fill="none" d="M13,16.572h-2c-1.432,0-2.629,1.01-2.926,2.354C9.242,19.604,10.584,20,12,20s2.758-0.396,3.926-1.073 C15.629,17.582,14.432,16.572,13,16.572z"> </path> <path d="M12,2C6.579,2,2,6.579,2,12c0,3.189,1.592,6.078,4,7.924V20h0.102C7.77,21.245,9.813,22,12,22s4.23-0.755,5.898-2H18 v-0.076c2.408-1.846,4-4.734,4-7.924C22,6.579,17.421,2,12,2z M8.074,18.927c0.297-1.345,1.494-2.354,2.926-2.354h2 c1.432,0,2.629,1.01,2.926,2.354C14.758,19.604,13.416,20,12,20S9.242,19.604,8.074,18.927z M17.61,17.641 c-0.757-1.8-2.538-3.068-4.61-3.068h-2c-2.072,0-3.854,1.269-4.61,3.068C4.923,16.182,4,14.176,4,12c0-4.337,3.663-8,8-8 s8,3.663,8,8C20,14.176,19.077,16.182,17.61,17.641z"> </path> <path d="M12,6c-2.28,0-4,1.72-4,4s1.72,4,4,4s4-1.72,4-4S14.28,6,12,6z M12,12c-1.178,0-2-0.822-2-2s0.822-2,2-2s2,0.822,2,2 S13.178,12,12,12z"> </path> </svg></td> <td width="5">&nbsp;</td> <td> <p style="font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;"> GLOBAL[nombre_usuario]</p> <p style="font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;"> Dirección General</p> </td> <td width="40">&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td> <p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p> </td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	");} else {}
    }
    //TERMINA - BRID:6590


    //INICIA - BRID:6591 - En modificar, después de guardar, enviar correo de rechazo de Administrativo a compras, con ajuste manual, no desactivar - Autor: Lizeth Villa - Actualización: 10/1/2021 2:41:26 PM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Comparativo_de_Proveedores_PiezasForm, 'Resultado_Adm')==this.brf.TryParseInt('2', '2') ) { this.brf.SendEmailQuery("VICS - Notificación de Rechazo Comparativo de Cotizaciones", this.brf.EvaluaQuery("select Email, Name from Spartan_User where Role = 42", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado Compras</p> <p>Para hacer de su conocimiento que la solicitud No. FLD[No__Solicitud] ha sido rechazada por el motivo FLD[Motivo_de_Rechazo_Adm].</p> <p>Atentamente.</p> <p>Aerovics S.A. de C.V.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style="fill:#325396;transform:;-ms-filter:"> <path fill="none" d="M12,8c-1.178,0-2,0.822-2,2s0.822,2,2,2s2-0.822,2-2S13.178,8,12,8z"> </path> <path fill="none" d="M12,4c-4.337,0-8,3.663-8,8c0,2.176,0.923,4.182,2.39,5.641c0.757-1.8,2.538-3.068,4.61-3.068h2 c2.072,0,3.854,1.269,4.61,3.068C19.077,16.182,20,14.176,20,12C20,7.663,16.337,4,12,4z M12,14c-2.28,0-4-1.72-4-4s1.72-4,4-4 s4,1.72,4,4S14.28,14,12,14z"> </path> <path fill="none" d="M13,16.572h-2c-1.432,0-2.629,1.01-2.926,2.354C9.242,19.604,10.584,20,12,20s2.758-0.396,3.926-1.073 C15.629,17.582,14.432,16.572,13,16.572z"> </path> <path d="M12,2C6.579,2,2,6.579,2,12c0,3.189,1.592,6.078,4,7.924V20h0.102C7.77,21.245,9.813,22,12,22s4.23-0.755,5.898-2H18 v-0.076c2.408-1.846,4-4.734,4-7.924C22,6.579,17.421,2,12,2z M8.074,18.927c0.297-1.345,1.494-2.354,2.926-2.354h2 c1.432,0,2.629,1.01,2.926,2.354C14.758,19.604,13.416,20,12,20S9.242,19.604,8.074,18.927z M17.61,17.641 c-0.757-1.8-2.538-3.068-4.61-3.068h-2c-2.072,0-3.854,1.269-4.61,3.068C4.923,16.182,4,14.176,4,12c0-4.337,3.663-8,8-8 s8,3.663,8,8C20,14.176,19.077,16.182,17.61,17.641z"> </path> <path d="M12,6c-2.28,0-4,1.72-4,4s1.72,4,4,4s4-1.72,4-4S14.28,6,12,6z M12,12c-1.178,0-2-0.822-2-2s0.822-2,2-2s2,0.822,2,2 S13.178,12,12,12z"> </path> </svg></td> <td width="5">&nbsp;</td> <td> <p style="font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;"> GLOBAL[nombre_usuario]</p> <p style="font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;"> Administrativo</p> </td> <td width="40">&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td> <p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p> </td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	");} else {}
    }
    //TERMINA - BRID:6591

    //rulesAfterSave_ExecuteBusinessRulesEnd


    setTimeout(() => {
      this.spinner.hide('loading');
      this.cancel()
    }, 4000);


  }

  async rulesBeforeSave(): Promise<boolean> {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    result = this.fnValidarProveedores()

    //INICIA - BRID:4046 - Actualizar estatus de seguimiento - Autor: Lizeth Villa - Actualización: 9/21/2021 2:03:55 PM
    if (this.operation == 'New') {
      if (this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado"].value == 1) {
        this.brf.SetValueControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento", "1");
      }
    }
    //TERMINA - BRID:4046


    //INICIA - BRID:4047 - actualizar estatus de seguimiento a rechazada - Autor: Lizeth Villa - Actualización: 9/21/2021 2:03:57 PM
    if (this.operation == 'New') {
      if (this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado"].value == 2) {
        this.brf.SetValueControl(this.Comparativo_de_Proveedores_PiezasForm, "Estatus_de_Seguimiento", "2");
      }
    }
    //TERMINA - BRID:4047


    //INICIA - BRID:4094 - En modificacion, antes de guardar, validar e Insertar registros en mr de gestion de aprobacion - Autor: Lizeth Villa - Actualización: 9/28/2021 7:07:58 PM
    if (this.operation == 'Update') {
      /* if (this.brf.EvaluaQuery(`EXEC spValidacionAutorizacionCuadroComparativo ${this.model.Folio}`, 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
      } */
      if (this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado"].value == 1) {
        this.brf.EvaluaQuery(`EXEC usp_InsDetalle_de_Gestion_de_aprobacionComparativo ${this.model.Folio}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:4094


    //INICIA - BRID:6414 - Si el rol es direccion general o admin y ya se autorizo la solicitud, no dejar rechazar y no guardar - Autor: Lizeth Villa - Actualización: 10/5/2021 6:26:15 PM
    if (this.operation == 'Update') {
      if (this.RoleId == 2 || this.RoleId == 10 && this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado"].value == 1
        && (this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_DG"].value == 2 || this.Comparativo_de_Proveedores_PiezasForm.controls["Resultado_Adm"].value == 2)) {
        this.brf.ShowMessage(" Esta solicitud ya fue autorizada por compras, favor de verificar.");

        result = false;
      }
    }
    //TERMINA - BRID:6414

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas

  //#region Generar Mat Table
  generateMatTable(array) {
    this.Comparativo_de_CotizacionesData = array;
    this.loadComparativo_de_Cotizaciones(array);
    this.dataSourceComparativo_de_Cotizaciones = new MatTableDataSource(array);
    this.dataSourceComparativo_de_Cotizaciones.paginator = this.paginator;
    this.dataSourceComparativo_de_Cotizaciones.sort = this.sort;
  }
  //#endregion


  //#region Obtener Datos desde Seguimiento de Solicitud de Compras
  getDataFromSeguimientoSolicitudCompras() {
    if (!this.fromSeguimiento) {
      this.fromSeguimiento = this.localStorageHelper.getItemFromLocalStorage("ComparativoSeguimiento") == "true" ? true : false;
    }


    this.localStorageHelper.removeItemFromLocalStorage("ComparativoSeguimiento");


    if (this.fromSeguimiento) {
      this.GetListaComparativoCotizaciones();
    }

  }
  //#endregion


  //#region Obtener Listado Comparativo de Cotizaciones
  GetListaComparativoCotizaciones() {

    const stringListadoCotizar = this.localStorageHelper.getItemFromLocalStorage("ListadoComparativo");
    var arrayListadoComparativo = JSON.parse(stringListadoCotizar)

    if (arrayListadoComparativo != null && arrayListadoComparativo.length > 0) {

      arrayListadoComparativo.forEach(element => {
        element["TipoMR"] = element.Tipo_MR;
        element["No__de_Parte___Descripcion"] = element.Descripcion;
        element["Costo_Unitario_1"] = "0.00"
        element["Total_1"] = "0.00"
        element["Costo_Unitario_2"] = "0.00"
        element["Total_2"] = "0.00"
        element["Costo_Unitario_3"] = "0.00"
        element["Total_3"] = "0.00"
        element["Costo_Unitario_4"] = "0.00"
        element["Total_4"] = "0.00"
      });

      this.generateMatTable(arrayListadoComparativo)
      //this.dataSourceComparativo_de_Cotizaciones = new MatTableDataSource(arrayListadoComparativo);
      this.setDatosGeneralesFromSeguimiento(arrayListadoComparativo)
    }

    this.localStorageHelper.removeItemFromLocalStorage("ListadoComparativo")

  }
  //#endregion


  //#region Asignar Datos desde Seguimiento
  setDatosGeneralesFromSeguimiento(array) {
    this.Tipo_MR = array[0].Tipo_MR

    this.Comparativo_de_Proveedores_PiezasForm.controls["No__Solicitud"].setValue(array[0].No__de_Solicitud)

    let Solicitante = { Id_User: array[0].Solicitante_clave, Name: array[0].Solicitante }
    this.Comparativo_de_Proveedores_PiezasForm.controls["Solicitante"].setValue(Solicitante)

    let formatDate = this.setRefactorDate(array[0].Fecha_de_Entrega)
    this.Comparativo_de_Proveedores_PiezasForm.controls["Fecha_de_Solicitud"].setValue(formatDate)

    this.Comparativo_de_Proveedores_PiezasForm.controls["Razon_de_la_Compra"].setValue(array[0].Razon_de_la_Compra)
    this.Comparativo_de_Proveedores_PiezasForm.controls["Departamento"].setValue(array[0].Departamento)

    let Numero_de_O_T = { Folio: array[0].No_O_T, numero_de_orden: array[0].No_O_T }
    this.Comparativo_de_Proveedores_PiezasForm.controls["Numero_de_O_T"].setValue(Numero_de_O_T)

    let Matricula = { Folio: array[0].Matricula, Matricula: array[0].Matricula }
    this.Comparativo_de_Proveedores_PiezasForm.controls["Matricula"].setValue(Matricula)

    let Modelo: any
    this.varModelos.forEach(element => {
      if (array[0].Modelo == element.Descripcion) {
        Modelo = element.Clave
      }
    });

    this.Comparativo_de_Proveedores_PiezasForm.controls["Modelo"].setValue(Modelo)

    let Numero_de_Reporte = { Folio: array[0].No__de_Reporte, No_Reporte: array[0].No__de_Reporte }
    this.Comparativo_de_Proveedores_PiezasForm.controls["Numero_de_Reporte"].setValue(Numero_de_Reporte)

  }
  //#endregion


  //#region Refactorizar Fecha para el DatePicker
  setRefactorDate(paramDate) {
    //Formatear Fecha 
    moment.locale('es');

    let formatDate = moment(paramDate, 'DD-MM-YYYY').format('YYYY-MM-DD')

    var date = new Date(formatDate)
    //Asignar Fecha como +1 día (Por el datepicker)
    date.setDate(date.getDate() + 1)

    return date
  }
  //#endregion


  //#region Ocultar columnas de tabla
  hideColumnsDataTable() {
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "FolioDetalle");
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "TipoMR");
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Partes");
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Servicios");
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Materiales");
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Herramientas");
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Horas_del_Componente_a_Remover");
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Ciclos_Componentes_a_Remover");
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Condicion_de_la_Pieza_Solicitada");
    this.brf.HideFieldofMultirenglon(this.Comparativo_de_CotizacionesColumns, "Fecha_estimada_de_Mtto_");
  }
  //#endregion


  //#region Obtener la fila de Totales
  getTotalFromRow(index) {

    let formArray = this.Comparativo_de_Proveedores_PiezasForm.get('Detalle_de_Cuadro_ComparativoItems') as FormArray

    const cantidad: number = formArray.controls[index].get("Cantidad").value

    const Costo_Unitario_1 = formArray.controls[index].get("Costo_Unitario_1").value
    var Total_1 = (cantidad * parseFloat(Costo_Unitario_1)).toFixed(2)
    formArray.controls[index].get("Total_1").setValue(Total_1)

    const Costo_Unitario_2 = formArray.controls[index].get("Costo_Unitario_2").value
    var Total_2 = (cantidad * parseFloat(Costo_Unitario_2)).toFixed(2)
    formArray.controls[index].get("Total_2").setValue(Total_2)

    const Costo_Unitario_3 = formArray.controls[index].get("Costo_Unitario_3").value
    var Total_3 = (cantidad * parseFloat(Costo_Unitario_3)).toFixed(2)
    formArray.controls[index].get("Total_3").setValue(Total_3)

    const Costo_Unitario_4 = formArray.controls[index].get("Costo_Unitario_4").value
    var Total_4 = (cantidad * parseFloat(Costo_Unitario_4)).toFixed(2)
    formArray.controls[index].get("Total_4").setValue(Total_4)
  }
  //#endregion


  //#region Seleccionar Unico Proveedor
  selectUniqueProveedor(index) {
    let formArray = this.Comparativo_de_Proveedores_PiezasForm.get('Detalle_de_Cuadro_ComparativoItems') as FormArray

    const Seleccion_1 = formArray.controls[index].get("Seleccion_1").value
    const Seleccion_2 = formArray.controls[index].get("Seleccion_2").value
    const Seleccion_3 = formArray.controls[index].get("Seleccion_3").value
    const Seleccion_4 = formArray.controls[index].get("Seleccion_4").value

    if (Seleccion_1) {
      formArray.controls[index].get("Seleccion_2").disable()
      formArray.controls[index].get("Seleccion_3").disable()
      formArray.controls[index].get("Seleccion_4").disable()
    }
    if (Seleccion_2) {
      formArray.controls[index].get("Seleccion_1").disable()
      formArray.controls[index].get("Seleccion_3").disable()
      formArray.controls[index].get("Seleccion_4").disable()
    }
    if (Seleccion_3) {
      formArray.controls[index].get("Seleccion_1").disable()
      formArray.controls[index].get("Seleccion_2").disable()
      formArray.controls[index].get("Seleccion_4").disable()
    }
    if (Seleccion_4) {
      formArray.controls[index].get("Seleccion_1").disable()
      formArray.controls[index].get("Seleccion_2").disable()
      formArray.controls[index].get("Seleccion_3").disable()
    }

    if (!Seleccion_1 && !Seleccion_2 && !Seleccion_3 && !Seleccion_4) {
      formArray.controls[index].get("Seleccion_1").enable()
      formArray.controls[index].get("Seleccion_2").enable()
      formArray.controls[index].get("Seleccion_3").enable()
      formArray.controls[index].get("Seleccion_4").enable()
    }

  }
  //#endregion


  //#region Asignar Proveedores a todos los MR diferentes al primero
  setProveedoresToMR() {
    let formArray: any = this.Comparativo_de_Proveedores_PiezasForm.get('Detalle_de_Cuadro_ComparativoItems')

    const objProveedor_1 = this.dataSourceComparativo_de_Cotizaciones.data[0].Proveedor_1_Creacion_de_Proveedores
    const objProveedor_2 = this.dataSourceComparativo_de_Cotizaciones.data[0].Proveedor_2_Creacion_de_Proveedores
    const objProveedor_3 = this.dataSourceComparativo_de_Cotizaciones.data[0].Proveedor_3_Creacion_de_Proveedores
    const objProveedor_4 = this.dataSourceComparativo_de_Cotizaciones.data[0].Proveedor_4_Creacion_de_Proveedores

    formArray.controls.forEach(element => {
      element.controls["Proveedor_1"].setValue(objProveedor_1?.Clave)
      element.controls["Proveedor_2"].setValue(objProveedor_2?.Clave)
      element.controls["Proveedor_3"].setValue(objProveedor_3?.Clave)
      element.controls["Proveedor_4"].setValue(objProveedor_4?.Clave)
    });


    for (let i = 1; i < this.dataSourceComparativo_de_Cotizaciones.data.length; i++) {
      this.dataSourceComparativo_de_Cotizaciones.data[i].Proveedor_1 = objProveedor_1?.Clave
      this.dataSourceComparativo_de_Cotizaciones.data[i].Proveedor_1_Creacion_de_Proveedores = objProveedor_1

      this.dataSourceComparativo_de_Cotizaciones.data[i].Proveedor_2 = objProveedor_2?.Clave
      this.dataSourceComparativo_de_Cotizaciones.data[i].Proveedor_2_Creacion_de_Proveedores = objProveedor_2

      this.dataSourceComparativo_de_Cotizaciones.data[i].Proveedor_3 = objProveedor_3?.Clave
      this.dataSourceComparativo_de_Cotizaciones.data[i].Proveedor_3_Creacion_de_Proveedores = objProveedor_3

      this.dataSourceComparativo_de_Cotizaciones.data[i].Proveedor_4 = objProveedor_4?.Clave
      this.dataSourceComparativo_de_Cotizaciones.data[i].Proveedor_4_Creacion_de_Proveedores = objProveedor_4
    }

    this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor1"].setValue(objProveedor_1)
    this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor2"].setValue(objProveedor_2)
    this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor3"].setValue(objProveedor_3)
    this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor4"].setValue(objProveedor_4)

    this.setTotalProveedorCotizacion()

  }
  //#endregion  


  //#region Asignar Total Proveedor y Total Cotización Proveedor
  setTotalProveedorCotizacion() {
    let formArray: any = this.Comparativo_de_Proveedores_PiezasForm.get('Detalle_de_Cuadro_ComparativoItems')
    var Total_Proveedor1 = 0, Total_Proveedor2 = 0, Total_Proveedor3 = 0, Total_Proveedor4 = 0;
    var Total_Cotizacion_Proveedor1 = 0, Total_Cotizacion_Proveedor2 = 0, Total_Cotizacion_Proveedor3 = 0, Total_Cotizacion_Proveedor4 = 0

    formArray.controls.forEach(element => {
      Total_Proveedor1 += parseFloat(element.controls["Total_1"].value)
      Total_Proveedor2 += parseFloat(element.controls["Total_2"].value)
      Total_Proveedor3 += parseFloat(element.controls["Total_3"].value)
      Total_Proveedor4 += parseFloat(element.controls["Total_4"].value)

      if (element.controls["Seleccion_1"].value) {
        Total_Cotizacion_Proveedor1 += parseFloat(element.controls["Total_1"].value)
      }
      if (element.controls["Seleccion_2"].value) {
        Total_Cotizacion_Proveedor2 += parseFloat(element.controls["Total_2"].value)
      }
      if (element.controls["Seleccion_3"].value) {
        Total_Cotizacion_Proveedor3 += parseFloat(element.controls["Total_3"].value)
      }
      if (element.controls["Seleccion_4"].value) {
        Total_Cotizacion_Proveedor4 += parseFloat(element.controls["Total_4"].value)
      }

    });

    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Proveedor1"].setValue(Total_Proveedor1.toFixed(2))
    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Cotizacion_Proveedor1"].setValue(Total_Cotizacion_Proveedor1.toFixed(2))

    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Proveedor2"].setValue(Total_Proveedor2.toFixed(2))
    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Cotizacion_Proveedor2"].setValue(Total_Cotizacion_Proveedor2.toFixed(2))

    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Proveedor3"].setValue(Total_Proveedor3.toFixed(2))
    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Cotizacion_Proveedor3"].setValue(Total_Cotizacion_Proveedor3.toFixed(2))

    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Proveedor4"].setValue(Total_Proveedor4.toFixed(2))
    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Cotizacion_Proveedor4"].setValue(Total_Cotizacion_Proveedor4.toFixed(2))

    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Proveedor4"].setValue(Total_Proveedor4.toFixed(2))
    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Cotizacion_Proveedor4"].setValue(Total_Cotizacion_Proveedor4.toFixed(2))

    let Total_Cotizacion = Total_Cotizacion_Proveedor1 + Total_Cotizacion_Proveedor2 + Total_Cotizacion_Proveedor3 + Total_Cotizacion_Proveedor4
    this.Comparativo_de_Proveedores_PiezasForm.controls["Total_Cotizacion"].setValue(Total_Cotizacion.toFixed(2))

    this.setRequiredTipoMoneda();
  }
  //#endregion


  //#region Asignar Moneda Requerida
  setRequiredTipoMoneda() {

    //Moneda 1
    if (this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor1"].value != undefined) {
      this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda1");
    }
    else {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda1");
    }

    //Moneda 2
    if (this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor2"].value != undefined) {
      this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda2");
    }
    else {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda2");
    }

    //Moneda 3
    if (this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor3"].value != undefined) {
      this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda3");
    }
    else {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda3");
    }

    //Moneda 4
    if (this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor4"].value != undefined) {
      this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda4");
    }
    else {
      this.brf.SetNotRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda4");
    }

    //Moneda General
    this.brf.SetRequiredControl(this.Comparativo_de_Proveedores_PiezasForm, "Tipo_de_Moneda");

  }
  //#endregion


  //#region Enviar a Aprobar
  sendToApprove() {
    this.saveData()
  }
  //#endregion


  //#region Enviar a Imprimir
  sendToPrint() {
    if (this.operation == "New") {
      this.imprimir = true;
      this.saveData()
    }
    else {
      this.spinner.show('loading');
      this.PrintPDF(this.model.Folio)
    }
  }
  //#endregion


  //#region Imprimir PDF
  PrintPDF(RecordId) {
    const IdFormat = 84

    this.pdfCloudService.GeneratePDF(IdFormat, RecordId).subscribe((res) => {

      //Implementar Mensaje si no hay reportes
      saveByteArray('Formatos.pdf', base64ToArrayBuffer(res), 'application/pdf');

      if (this.operation == "New") {
        this.deleteComparativo(RecordId)
        this.imprimir = false;
        this.disableFields();
      }
      this.spinner.hide('loading');
    });
  }
  //#endregion


  //#region Habilitar Campos
  enableFields() {
    this.Comparativo_de_Proveedores_PiezasForm.get('Folio').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('No__Solicitud').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Solicitante').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Fecha_de_Solicitud').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Razon_de_la_Compra').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Departamento').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_Reporte').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_O_T').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Matricula').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Modelo').enable();

    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor1').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor2').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor3').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor4').enable();

    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Proveedor1').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Proveedor2').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Proveedor3').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Proveedor4').enable();

    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion_Proveedor1').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion_Proveedor2').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion_Proveedor3').enable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion_Proveedor4').enable();

    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion').enable();
  }
  //#endregion


  //#region Deshabilitar Campos
  disableFields() {
    this.Comparativo_de_Proveedores_PiezasForm.get('Folio').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('No__Solicitud').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Solicitante').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Fecha_de_Solicitud').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Razon_de_la_Compra').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Departamento').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_Reporte').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Numero_de_O_T').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Matricula').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Modelo').disable();

    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor1').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor2').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor3').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Proveedor4').disable();

    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Proveedor1').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Proveedor2').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Proveedor3').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Proveedor4').disable();

    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion_Proveedor1').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion_Proveedor2').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion_Proveedor3').disable();
    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion_Proveedor4').disable();

    this.Comparativo_de_Proveedores_PiezasForm.get('Total_Cotizacion').disable();

  }
  //#endregion


  //#region Eliminar Comparativo para Solo Imprimir
  deleteComparativo(RecordId) {
    //implementar delete 
    this.sqlModel.query = `exec usp_del_comparativo_de_proveedores_piezas_only_print ${RecordId}`

    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
      },
      error: (e) => console.error(e),
      complete: () => {
      },
    })
  }
  //#endregion


  //#region Digitos Maximos
  maxDigits(value: any, max: number): boolean {
    if (value.substring(value.length - 3, value.length - 2) == ".") {
      max = max + 3
    }

    if (value.replaceAll(",", "").length > (max - 1)) {
      return false;
    }
    return true;
  }
  //#endregion


  //#region Validar que se haya seleccionado un proveedor
  fnValidarProveedores(): boolean {

    this.enableFields();

    const Proveedor1 = this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor1"].value
    const Proveedor2 = this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor2"].value
    const Proveedor3 = this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor3"].value
    const Proveedor4 = this.Comparativo_de_Proveedores_PiezasForm.controls["Proveedor4"].value

    this.disableFields();
    if ((Proveedor1 == "" && Proveedor2 == "" && Proveedor3 == "" && Proveedor4 == "") ||
      (Proveedor1 == undefined && Proveedor2 == undefined && Proveedor3 == undefined && Proveedor4 == undefined)) {
      let message = "Falta seleccionar un proveedor."
      this.snackBar.open(message, '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['mat-toolbar', 'mat-warn']
      });
      return false;
    }

    return true;
  }
  //#endregion


}
