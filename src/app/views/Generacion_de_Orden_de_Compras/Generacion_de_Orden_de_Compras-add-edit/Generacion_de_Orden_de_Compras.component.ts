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
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { GeneralService } from 'src/app/api-services/general.service';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Folios_Generacion_OCService } from 'src/app/api-services/Folios_Generacion_OC.service';
import { Folios_Generacion_OC } from 'src/app/models/Folios_Generacion_OC';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Detalle_de_Generacion_de_OCService } from 'src/app/api-services/Detalle_de_Generacion_de_OC.service';
import { Detalle_de_Generacion_de_OC } from 'src/app/models/Detalle_de_Generacion_de_OC';
import { PartesService } from 'src/app/api-services/Partes.service';
import { Partes } from 'src/app/models/Partes';
import { Catalogo_serviciosService } from 'src/app/api-services/Catalogo_servicios.service';
import { Catalogo_servicios } from 'src/app/models/Catalogo_servicios';
import { Listado_de_MaterialesService } from 'src/app/api-services/Listado_de_Materiales.service';
import { Listado_de_Materiales } from 'src/app/models/Listado_de_Materiales';
import { HerramientasService } from 'src/app/api-services/Herramientas.service';
import { Herramientas } from 'src/app/models/Herramientas';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';

import { MonedaService } from 'src/app/api-services/Moneda.service';
import { Moneda } from 'src/app/models/Moneda';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { Tipo_de_TransporteService } from 'src/app/api-services/Tipo_de_Transporte.service';
import { Tipo_de_Transporte } from 'src/app/models/Tipo_de_Transporte';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import * as moment from 'moment';
import { PdfCloudService } from 'src/app/api-services/pdf-cloud.service';
import { base64ToArrayBuffer, saveByteArray } from 'src/app/functions/blob-function';

@Component({
  selector: 'app-Generacion_de_Orden_de_Compras',
  templateUrl: './Generacion_de_Orden_de_Compras.component.html',
  styleUrls: ['./Generacion_de_Orden_de_Compras.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Generacion_de_Orden_de_ComprasComponent implements OnInit, AfterViewInit {
MRaddDetalle_de_Generacion_de_Orden_de_Compra: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  IdFolioDetalle: any;

  Generacion_de_Orden_de_ComprasForm: FormGroup;
  public Editor = ClassicEditor;
  model: Generacion_de_Orden_de_Compras;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsFolioCorreo: Observable<Folios_Generacion_OC[]>;
  hasOptionsFolioCorreo: boolean;
  isLoadingFolioCorreo: boolean;
  public varSpartan_User: Spartan_User[] = [];
  optionsProveedor: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor: boolean;
  isLoadingProveedor: boolean;
  optionsRFC: Observable<Creacion_de_Proveedores[]>;
  hasOptionsRFC: boolean;
  isLoadingRFC: boolean;
  optionsVendedor: Observable<Creacion_de_Proveedores[]>;
  hasOptionsVendedor: boolean;
  isLoadingVendedor: boolean;
  optionsDireccion: Observable<Creacion_de_Proveedores[]>;
  hasOptionsDireccion: boolean;
  isLoadingDireccion: boolean;
  optionsTelefono_del_Contacto: Observable<Creacion_de_Proveedores[]>;
  hasOptionsTelefono_del_Contacto: boolean;
  isLoadingTelefono_del_Contacto: boolean;
  optionsEmail: Observable<Creacion_de_Proveedores[]>;
  hasOptionsEmail: boolean;
  isLoadingEmail: boolean;
  public varPartes: Partes[] = [];
  public varCatalogo_servicios: Catalogo_servicios[] = [];
  public varListado_de_Materiales: Listado_de_Materiales[] = [];
  public varHerramientas: Herramientas[] = [];
  public varModelos: Modelos[] = [];
  public varUnidad: Unidad[] = [];

  autoNo__de_Parte_Detalle_de_Generacion_de_OC = new FormControl();
  SelectedNo__de_Parte_Detalle_de_Generacion_de_OC: string[] = [];
  isLoadingNo__de_Parte_Detalle_de_Generacion_de_OC: boolean;
  searchNo__de_Parte_Detalle_de_Generacion_de_OCCompleted: boolean;
  autoN_Servicio_Descripcion_Detalle_de_Generacion_de_OC = new FormControl();
  SelectedN_Servicio_Descripcion_Detalle_de_Generacion_de_OC: string[] = [];
  isLoadingN_Servicio_Descripcion_Detalle_de_Generacion_de_OC: boolean;
  searchN_Servicio_Descripcion_Detalle_de_Generacion_de_OCCompleted: boolean;
  autoMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC = new FormControl();
  SelectedMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC: string[] = [];
  isLoadingMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC: boolean;
  searchMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OCCompleted: boolean;
  autoHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC = new FormControl();
  SelectedHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC: string[] = [];
  isLoadingHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC: boolean;
  searchHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OCCompleted: boolean;
  autoModelo_Detalle_de_Generacion_de_OC = new FormControl();
  SelectedModelo_Detalle_de_Generacion_de_OC: string[] = [];
  isLoadingModelo_Detalle_de_Generacion_de_OC: boolean;
  searchModelo_Detalle_de_Generacion_de_OCCompleted: boolean;

  public varMoneda: Moneda[] = [];
  optionsEstatus_OC: Observable<Estatus_de_Seguimiento[]>;
  hasOptionsEstatus_OC: boolean;
  isLoadingEstatus_OC: boolean;
  public varTipo_de_Transporte: Tipo_de_Transporte[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceDetalle_de_Generacion_de_Orden_de_Compra = new MatTableDataSource<Detalle_de_Generacion_de_OC>();
  Detalle_de_Generacion_de_Orden_de_CompraColumns = [
    { def: 'actions', hide: false },
    { def: 'No__de_Parte', hide: false },
    { def: 'N_Servicio_Descripcion', hide: false },
    { def: 'Materiales_Codigo_Descripcion', hide: false },
    { def: 'Herramientas_Codigo_Descripcion', hide: false },
    { def: 'Codigo_Descripcion', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Costo_Unitario', hide: false },
    { def: 'Costo_Total', hide: false },

  ];
  Detalle_de_Generacion_de_Orden_de_CompraData: Detalle_de_Generacion_de_OC[] = [];

  today = new Date;
  consult: boolean = false;
  imprimir: boolean = false;
  Detalle_de_Gestion_de_aprobacionOC: any;
  stringListadoCotizar: any
  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Generacion_de_Orden_de_ComprasService: Generacion_de_Orden_de_ComprasService,
    private Folios_Generacion_OCService: Folios_Generacion_OCService,
    private Spartan_UserService: Spartan_UserService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Detalle_de_Generacion_de_OCService: Detalle_de_Generacion_de_OCService,
    private PartesService: PartesService,
    private Catalogo_serviciosService: Catalogo_serviciosService,
    private Listado_de_MaterialesService: Listado_de_MaterialesService,
    private HerramientasService: HerramientasService,
    private ModelosService: ModelosService,
    private UnidadService: UnidadService,
    private MonedaService: MonedaService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,
    private Tipo_de_TransporteService: Tipo_de_TransporteService,
    private _seguridad: SeguridadService,
    private spartanFileService: SpartanFileService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private _SpartanService: SpartanService,
    renderer: Renderer2,
    private pdfCloudService: PdfCloudService,
  ) {
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId
    this.stringListadoCotizar = this.localStorageHelper.getItemFromLocalStorage("Detalle_de_Gestion_de_aprobacionOrdenCompra");


    this.model = new Generacion_de_Orden_de_Compras(this.fb);
    this.Generacion_de_Orden_de_ComprasForm = this.model.buildFormGroup();
    this.Detalle_de_Generacion_de_Orden_de_CompraItems.removeAt(0);

    this.Generacion_de_Orden_de_ComprasForm.get('Folio').disable();
    this.Generacion_de_Orden_de_ComprasForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();

    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Detalle_de_Generacion_de_Orden_de_CompraColumns.splice(0, 1);

        this.Generacion_de_Orden_de_ComprasForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Generacion_de_Orden_de_Compras).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Generacion_de_Orden_de_ComprasForm, 'FolioCorreo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Generacion_de_Orden_de_ComprasForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Generacion_de_Orden_de_ComprasForm, 'RFC', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Generacion_de_Orden_de_ComprasForm, 'Vendedor', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Generacion_de_Orden_de_ComprasForm, 'Direccion', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Generacion_de_Orden_de_ComprasForm, 'Telefono_del_Contacto', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Generacion_de_Orden_de_ComprasForm, 'Email', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Generacion_de_Orden_de_ComprasForm, 'Estatus_OC', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Generacion_de_Orden_de_ComprasForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Folio);
        } else {
          this.operation = "New";
        }
        this.rulesOnInit();
      });
  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 1, 'Generacion_de_Orden_de_Compras.Folio=' + id).toPromise();
    if (result.Generacion_de_Orden_de_Comprass.length > 0) {
      await this.Detalle_de_Generacion_de_OCService.listaSelAll(0, 1000, 'Generacion_de_Orden_de_Compras.Folio=' + id).toPromise().then(fDetalle_de_Generacion_de_Orden_de_Compra => {
        this.Detalle_de_Generacion_de_Orden_de_CompraData = fDetalle_de_Generacion_de_Orden_de_Compra.Detalle_de_Generacion_de_OCs;
        this.loadDetalle_de_Generacion_de_Orden_de_Compra(fDetalle_de_Generacion_de_Orden_de_Compra.Detalle_de_Generacion_de_OCs);
        this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra = new MatTableDataSource(fDetalle_de_Generacion_de_Orden_de_Compra.Detalle_de_Generacion_de_OCs);
        this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.paginator = this.paginator;
        this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.sort = this.sort;

      });

      this.model.fromObject(result.Generacion_de_Orden_de_Comprass[0]);
      this.Generacion_de_Orden_de_ComprasForm.get('FolioCorreo').setValue(
        result.Generacion_de_Orden_de_Comprass[0].FolioCorreo_Folios_Generacion_OC.FolioTexto,
        { onlySelf: false, emitEvent: true }
      );
      this.Generacion_de_Orden_de_ComprasForm.get('Proveedor').setValue(
        result.Generacion_de_Orden_de_Comprass[0].Proveedor_Creacion_de_Proveedores.Razon_social,
        { onlySelf: false, emitEvent: true }
      );
      this.Generacion_de_Orden_de_ComprasForm.get('RFC').setValue(
        result.Generacion_de_Orden_de_Comprass[0].RFC_Creacion_de_Proveedores.RFC,
        { onlySelf: false, emitEvent: true }
      );
      this.Generacion_de_Orden_de_ComprasForm.get('Vendedor').setValue(
        result.Generacion_de_Orden_de_Comprass[0].Vendedor_Creacion_de_Proveedores.Contacto,
        { onlySelf: false, emitEvent: true }
      );
      this.Generacion_de_Orden_de_ComprasForm.get('Direccion').setValue(
        result.Generacion_de_Orden_de_Comprass[0].Direccion_Creacion_de_Proveedores.Direccion_postal,
        { onlySelf: false, emitEvent: true }
      );
      this.Generacion_de_Orden_de_ComprasForm.get('Telefono_del_Contacto').setValue(
        result.Generacion_de_Orden_de_Comprass[0].Telefono_del_Contacto_Creacion_de_Proveedores.Telefono_de_contacto,
        { onlySelf: false, emitEvent: true }
      );
      this.Generacion_de_Orden_de_ComprasForm.get('Email').setValue(
        result.Generacion_de_Orden_de_Comprass[0].Email_Creacion_de_Proveedores.Correo_electronico,
        { onlySelf: false, emitEvent: true }
      );
      this.Generacion_de_Orden_de_ComprasForm.get('Estatus_OC').setValue(
        result.Generacion_de_Orden_de_Comprass[0].Estatus_OC_Estatus_de_Seguimiento.Descripcion,
        { onlySelf: false, emitEvent: true }
      );

      this.Generacion_de_Orden_de_ComprasForm.markAllAsTouched();
      this.Generacion_de_Orden_de_ComprasForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Detalle_de_Generacion_de_Orden_de_CompraItems() {
    return this.Generacion_de_Orden_de_ComprasForm.get('Detalle_de_Generacion_de_OCItems') as FormArray;
  }

  getDetalle_de_Generacion_de_Orden_de_CompraColumns(): string[] {
    return this.Detalle_de_Generacion_de_Orden_de_CompraColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadDetalle_de_Generacion_de_Orden_de_Compra(Detalle_de_Generacion_de_Orden_de_Compra: Detalle_de_Generacion_de_OC[]) {
    Detalle_de_Generacion_de_Orden_de_Compra.forEach(element => {
      this.addDetalle_de_Generacion_de_Orden_de_Compra(element);
    });
  }

  addDetalle_de_Generacion_de_Orden_de_CompraToMR() {
    const Detalle_de_Generacion_de_Orden_de_Compra = new Detalle_de_Generacion_de_OC(this.fb);
    this.Detalle_de_Generacion_de_Orden_de_CompraData.push(this.addDetalle_de_Generacion_de_Orden_de_Compra(Detalle_de_Generacion_de_Orden_de_Compra));
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data = this.Detalle_de_Generacion_de_Orden_de_CompraData;
    Detalle_de_Generacion_de_Orden_de_Compra.edit = true;
    Detalle_de_Generacion_de_Orden_de_Compra.isNew = true;
    const length = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.length;
    const index = length - 1;
    const formDetalle_de_Generacion_de_Orden_de_Compra = this.Detalle_de_Generacion_de_Orden_de_CompraItems.controls[index] as FormGroup;
    this.addFilterToControlNo__de_Parte_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.No__de_Parte, index);
    this.addFilterToControlN_Servicio_Descripcion_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.N_Servicio_Descripcion, index);
    this.addFilterToControlMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.Materiales_Codigo_Descripcion, index);
    this.addFilterToControlHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.Herramientas_Codigo_Descripcion, index);
    this.addFilterToControlModelo_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.Modelo, index);

    const page = Math.ceil(this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addDetalle_de_Generacion_de_Orden_de_Compra(entity: Detalle_de_Generacion_de_OC) {
    const Detalle_de_Generacion_de_Orden_de_Compra = new Detalle_de_Generacion_de_OC(this.fb);
    this.Detalle_de_Generacion_de_Orden_de_CompraItems.push(Detalle_de_Generacion_de_Orden_de_Compra.buildFormGroup());
    if (entity) {
      Detalle_de_Generacion_de_Orden_de_Compra.fromObject(entity);
    }
    return entity;
  }

  Detalle_de_Generacion_de_Orden_de_CompraItemsByFolio(Folio: number): FormGroup {
    return (this.Generacion_de_Orden_de_ComprasForm.get('Detalle_de_Generacion_de_OCItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Detalle_de_Generacion_de_Orden_de_CompraItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    let fb = this.Detalle_de_Generacion_de_Orden_de_CompraItems.controls[index] as FormGroup;
    return fb;
  }

  deleteDetalle_de_Generacion_de_Orden_de_Compra(element: any) {
    let index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].IsDeleted = true;
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data = this.Detalle_de_Generacion_de_Orden_de_CompraData;
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra._updateChangeSubscription();
    index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditDetalle_de_Generacion_de_Orden_de_Compra(element: any) {
    let index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Detalle_de_Generacion_de_Orden_de_CompraData[index].IsDeleted = true;
      this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data = this.Detalle_de_Generacion_de_Orden_de_CompraData;
      this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra._updateChangeSubscription();
      index = this.Detalle_de_Generacion_de_Orden_de_CompraData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveDetalle_de_Generacion_de_Orden_de_Compra(element: any) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    const formDetalle_de_Generacion_de_Orden_de_Compra = this.Detalle_de_Generacion_de_Orden_de_CompraItems.controls[index] as FormGroup;
    if (this.Detalle_de_Generacion_de_Orden_de_CompraData[index].No__de_Parte !== formDetalle_de_Generacion_de_Orden_de_Compra.value.No__de_Parte && formDetalle_de_Generacion_de_Orden_de_Compra.value.No__de_Parte > 0) {
      let partes = await this.PartesService.getById(formDetalle_de_Generacion_de_Orden_de_Compra.value.No__de_Parte).toPromise();
      this.Detalle_de_Generacion_de_Orden_de_CompraData[index].No__de_Parte_Partes = partes;
    }
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].No__de_Parte = formDetalle_de_Generacion_de_Orden_de_Compra.value.No__de_Parte;
    if (this.Detalle_de_Generacion_de_Orden_de_CompraData[index].N_Servicio_Descripcion !== formDetalle_de_Generacion_de_Orden_de_Compra.value.N_Servicio_Descripcion && formDetalle_de_Generacion_de_Orden_de_Compra.value.N_Servicio_Descripcion > 0) {
      let catalogo_servicios = await this.Catalogo_serviciosService.getById(formDetalle_de_Generacion_de_Orden_de_Compra.value.N_Servicio_Descripcion).toPromise();
      this.Detalle_de_Generacion_de_Orden_de_CompraData[index].N_Servicio_Descripcion_Catalogo_servicios = catalogo_servicios;
    }
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].N_Servicio_Descripcion = formDetalle_de_Generacion_de_Orden_de_Compra.value.N_Servicio_Descripcion;
    if (this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Materiales_Codigo_Descripcion !== formDetalle_de_Generacion_de_Orden_de_Compra.value.Materiales_Codigo_Descripcion && formDetalle_de_Generacion_de_Orden_de_Compra.value.Materiales_Codigo_Descripcion > 0) {
      let listado_de_materiales = await this.Listado_de_MaterialesService.getById(formDetalle_de_Generacion_de_Orden_de_Compra.value.Materiales_Codigo_Descripcion).toPromise();
      this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Materiales_Codigo_Descripcion_Listado_de_Materiales = listado_de_materiales;
    }
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Materiales_Codigo_Descripcion = formDetalle_de_Generacion_de_Orden_de_Compra.value.Materiales_Codigo_Descripcion;
    if (this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Herramientas_Codigo_Descripcion !== formDetalle_de_Generacion_de_Orden_de_Compra.value.Herramientas_Codigo_Descripcion && formDetalle_de_Generacion_de_Orden_de_Compra.value.Herramientas_Codigo_Descripcion > 0) {
      let herramientas = await this.HerramientasService.getById(formDetalle_de_Generacion_de_Orden_de_Compra.value.Herramientas_Codigo_Descripcion).toPromise();
      this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Herramientas_Codigo_Descripcion_Herramientas = herramientas;
    }
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Herramientas_Codigo_Descripcion = formDetalle_de_Generacion_de_Orden_de_Compra.value.Herramientas_Codigo_Descripcion;
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Codigo_Descripcion = formDetalle_de_Generacion_de_Orden_de_Compra.value.Codigo_Descripcion;
    if (this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Modelo !== formDetalle_de_Generacion_de_Orden_de_Compra.value.Modelo && formDetalle_de_Generacion_de_Orden_de_Compra.value.Modelo > 0) {
      let modelos = await this.ModelosService.getById(formDetalle_de_Generacion_de_Orden_de_Compra.value.Modelo).toPromise();
      this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Modelo_Modelos = modelos;
    }
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Modelo = formDetalle_de_Generacion_de_Orden_de_Compra.value.Modelo;
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Cantidad = formDetalle_de_Generacion_de_Orden_de_Compra.value.Cantidad;
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Unidad = formDetalle_de_Generacion_de_Orden_de_Compra.value.Unidad;
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Unidad_Unidad = formDetalle_de_Generacion_de_Orden_de_Compra.value.Unidad !== '' ?
      this.varUnidad.filter(d => d.Clave === formDetalle_de_Generacion_de_Orden_de_Compra.value.Unidad)[0] : null;
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Costo_Unitario = formDetalle_de_Generacion_de_Orden_de_Compra.value.Costo_Unitario;
    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].Costo_Total = formDetalle_de_Generacion_de_Orden_de_Compra.value.Costo_Total;

    this.Detalle_de_Generacion_de_Orden_de_CompraData[index].isNew = false;
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data = this.Detalle_de_Generacion_de_Orden_de_CompraData;
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra._updateChangeSubscription();
  }

  editDetalle_de_Generacion_de_Orden_de_Compra(element: any) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    const formDetalle_de_Generacion_de_Orden_de_Compra = this.Detalle_de_Generacion_de_Orden_de_CompraItems.controls[index] as FormGroup;
    this.SelectedNo__de_Parte_Detalle_de_Generacion_de_OC[index] = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data[index].No__de_Parte_Partes.Numero_de_parte_Descripcion;
    this.addFilterToControlNo__de_Parte_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.No__de_Parte, index);
    this.SelectedN_Servicio_Descripcion_Detalle_de_Generacion_de_OC[index] = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data[index].N_Servicio_Descripcion_Catalogo_servicios.Codigo_Descripcion;
    this.addFilterToControlN_Servicio_Descripcion_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.N_Servicio_Descripcion, index);
    this.SelectedMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index] = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data[index].Materiales_Codigo_Descripcion_Listado_de_Materiales.Codigo_Descripcion;
    this.addFilterToControlMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.Materiales_Codigo_Descripcion, index);
    this.SelectedHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index] = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data[index].Herramientas_Codigo_Descripcion_Herramientas.Codigo_Descripcion;
    this.addFilterToControlHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.Herramientas_Codigo_Descripcion, index);
    this.SelectedModelo_Detalle_de_Generacion_de_OC[index] = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_de_Generacion_de_OC(formDetalle_de_Generacion_de_Orden_de_Compra.controls.Modelo, index);

    element.edit = true;
  }

  async saveDetalle_de_Generacion_de_OC(Folio: number) {
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.forEach(async (d, index) => {
      const data = this.Detalle_de_Generacion_de_Orden_de_CompraItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Generacion_de_Orden_de_Compras = Folio;

      if (model.Folio === 0) {
        // Add Detalle de Generación de Orden de Compra
        let response = await this.Detalle_de_Generacion_de_OCService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formDetalle_de_Generacion_de_Orden_de_Compra = this.Detalle_de_Generacion_de_Orden_de_CompraItemsByFolio(model.Folio);
        if (formDetalle_de_Generacion_de_Orden_de_Compra.dirty) {
          // Update Detalle de Generación de Orden de Compra
          let response = await this.Detalle_de_Generacion_de_OCService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Detalle de Generación de Orden de Compra
        await this.Detalle_de_Generacion_de_OCService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectNo__de_Parte_Detalle_de_Generacion_de_OC(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__de_Parte_Detalle_de_Generacion_de_OC[index] = event.option.viewValue;
    let fgr = this.Generacion_de_Orden_de_ComprasForm.controls.Detalle_de_Generacion_de_OCItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.No__de_Parte.setValue(event.option.value);
    this.displayFnNo__de_Parte_Detalle_de_Generacion_de_OC(element);
  }

  displayFnNo__de_Parte_Detalle_de_Generacion_de_OC(this, element) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    return this.SelectedNo__de_Parte_Detalle_de_Generacion_de_OC[index];
  }

  updateOptionNo__de_Parte_Detalle_de_Generacion_de_OC(event, element: any) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    this.SelectedNo__de_Parte_Detalle_de_Generacion_de_OC[index] = event.source.viewValue;
  }

  _filterNo__de_Parte_Detalle_de_Generacion_de_OC(filter: any): Observable<Partes> {
    const where = filter !== '' ? "Partes.Numero_de_parte_Descripcion like '%" + filter + "%'" : '';
    return this.PartesService.listaSelAll(0, 20, where);
  }

  addFilterToControlNo__de_Parte_Detalle_de_Generacion_de_OC(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__de_Parte_Detalle_de_Generacion_de_OC = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__de_Parte_Detalle_de_Generacion_de_OC = true;
        return this._filterNo__de_Parte_Detalle_de_Generacion_de_OC(value || '');
      })
    ).subscribe(result => {
      this.varPartes = result.Partess;
      this.isLoadingNo__de_Parte_Detalle_de_Generacion_de_OC = false;
      this.searchNo__de_Parte_Detalle_de_Generacion_de_OCCompleted = true;
      this.SelectedNo__de_Parte_Detalle_de_Generacion_de_OC[index] = this.varPartes.length === 0 ? '' : this.SelectedNo__de_Parte_Detalle_de_Generacion_de_OC[index];
    });
  }

  public selectN_Servicio_Descripcion_Detalle_de_Generacion_de_OC(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_Servicio_Descripcion_Detalle_de_Generacion_de_OC[index] = event.option.viewValue;
    let fgr = this.Generacion_de_Orden_de_ComprasForm.controls.Detalle_de_Generacion_de_OCItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Servicio_Descripcion.setValue(event.option.value);
    this.displayFnN_Servicio_Descripcion_Detalle_de_Generacion_de_OC(element);
  }

  displayFnN_Servicio_Descripcion_Detalle_de_Generacion_de_OC(this, element) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    return this.SelectedN_Servicio_Descripcion_Detalle_de_Generacion_de_OC[index];
  }
  updateOptionN_Servicio_Descripcion_Detalle_de_Generacion_de_OC(event, element: any) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    this.SelectedN_Servicio_Descripcion_Detalle_de_Generacion_de_OC[index] = event.source.viewValue;
  }

  _filterN_Servicio_Descripcion_Detalle_de_Generacion_de_OC(filter: any): Observable<Catalogo_servicios> {
    const where = filter !== '' ? "Catalogo_servicios.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Catalogo_serviciosService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Servicio_Descripcion_Detalle_de_Generacion_de_OC(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Servicio_Descripcion_Detalle_de_Generacion_de_OC = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Servicio_Descripcion_Detalle_de_Generacion_de_OC = true;
        return this._filterN_Servicio_Descripcion_Detalle_de_Generacion_de_OC(value || '');
      })
    ).subscribe(result => {
      this.varCatalogo_servicios = result.Catalogo_servicioss;
      this.isLoadingN_Servicio_Descripcion_Detalle_de_Generacion_de_OC = false;
      this.searchN_Servicio_Descripcion_Detalle_de_Generacion_de_OCCompleted = true;
      this.SelectedN_Servicio_Descripcion_Detalle_de_Generacion_de_OC[index] = this.varCatalogo_servicios.length === 0 ? '' : this.SelectedN_Servicio_Descripcion_Detalle_de_Generacion_de_OC[index];
    });
  }
  public selectMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index] = event.option.viewValue;
    let fgr = this.Generacion_de_Orden_de_ComprasForm.controls.Detalle_de_Generacion_de_OCItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Materiales_Codigo_Descripcion.setValue(event.option.value);
    this.displayFnMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC(element);
  }

  displayFnMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC(this, element) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    return this.SelectedMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index];
  }
  updateOptionMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC(event, element: any) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    this.SelectedMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index] = event.source.viewValue;
  }

  _filterMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC(filter: any): Observable<Listado_de_Materiales> {
    const where = filter !== '' ? "Listado_de_Materiales.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Listado_de_MaterialesService.listaSelAll(0, 20, where);
  }

  addFilterToControlMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC = true;
        return this._filterMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC(value || '');
      })
    ).subscribe(result => {
      this.varListado_de_Materiales = result.Listado_de_Materialess;
      this.isLoadingMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC = false;
      this.searchMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OCCompleted = true;
      this.SelectedMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index] = this.varListado_de_Materiales.length === 0 ? '' : this.SelectedMateriales_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index];
    });
  }
  public selectHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index] = event.option.viewValue;
    let fgr = this.Generacion_de_Orden_de_ComprasForm.controls.Detalle_de_Generacion_de_OCItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Herramientas_Codigo_Descripcion.setValue(event.option.value);
    this.displayFnHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC(element);
  }

  displayFnHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC(this, element) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    return this.SelectedHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index];
  }
  updateOptionHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC(event, element: any) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    this.SelectedHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index] = event.source.viewValue;
  }

  _filterHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC(filter: any): Observable<Herramientas> {
    const where = filter !== '' ? "Herramientas.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.HerramientasService.listaSelAll(0, 20, where);
  }

  addFilterToControlHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC = true;
        return this._filterHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC(value || '');
      })
    ).subscribe(result => {
      this.varHerramientas = result.Herramientass;
      this.isLoadingHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC = false;
      this.searchHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OCCompleted = true;
      this.SelectedHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index] = this.varHerramientas.length === 0 ? '' : this.SelectedHerramientas_Codigo_Descripcion_Detalle_de_Generacion_de_OC[index];
    });
  }
  public selectModelo_Detalle_de_Generacion_de_OC(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_de_Generacion_de_OC[index] = event.option.viewValue;
    let fgr = this.Generacion_de_Orden_de_ComprasForm.controls.Detalle_de_Generacion_de_OCItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_de_Generacion_de_OC(element);
  }

  displayFnModelo_Detalle_de_Generacion_de_OC(this, element) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    return this.SelectedModelo_Detalle_de_Generacion_de_OC[index];
  }
  updateOptionModelo_Detalle_de_Generacion_de_OC(event, element: any) {
    const index = this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.data.indexOf(element);
    this.SelectedModelo_Detalle_de_Generacion_de_OC[index] = event.source.viewValue;
  }

  _filterModelo_Detalle_de_Generacion_de_OC(filter: any): Observable<Modelos> {
    const where = filter !== '' ? "Modelos.Descripcion like '%" + filter + "%'" : '';
    return this.ModelosService.listaSelAll(0, 20, where);
  }

  addFilterToControlModelo_Detalle_de_Generacion_de_OC(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_de_Generacion_de_OC = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_de_Generacion_de_OC = true;
        return this._filterModelo_Detalle_de_Generacion_de_OC(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_de_Generacion_de_OC = false;
      this.searchModelo_Detalle_de_Generacion_de_OCCompleted = true;
      this.SelectedModelo_Detalle_de_Generacion_de_OC[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_de_Generacion_de_OC[index];
    });
  }




  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Spartan_UserService.getAll());
    observablesArray.push(this.UnidadService.getAll());

    observablesArray.push(this.MonedaService.getAll());
    observablesArray.push(this.Tipo_de_TransporteService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varSpartan_User, varUnidad, varMoneda, varTipo_de_Transporte]) => {
          this.varSpartan_User = varSpartan_User;
          this.varUnidad = varUnidad;

          this.varMoneda = varMoneda;
          this.varTipo_de_Transporte = varTipo_de_Transporte;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Generacion_de_Orden_de_ComprasForm.get('FolioCorreo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingFolioCorreo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Folios_Generacion_OCService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Folios_Generacion_OCService.listaSelAll(0, 20, '');
          return this.Folios_Generacion_OCService.listaSelAll(0, 20,
            "Folios_Generacion_OC.FolioTexto like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Folios_Generacion_OCService.listaSelAll(0, 20,
          "Folios_Generacion_OC.FolioTexto like '%" + value.FolioTexto.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingFolioCorreo = false;
      this.hasOptionsFolioCorreo = result?.Folios_Generacion_OCs?.length > 0;
      this.Generacion_de_Orden_de_ComprasForm.get('FolioCorreo').setValue(result?.Folios_Generacion_OCs[0], { onlySelf: true, emitEvent: false });
      this.optionsFolioCorreo = of(result?.Folios_Generacion_OCs);
    }, error => {
      this.isLoadingFolioCorreo = false;
      this.hasOptionsFolioCorreo = false;
      this.optionsFolioCorreo = of([]);
    });

    this.Generacion_de_Orden_de_ComprasForm.get('Proveedor').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingProveedor = true),
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
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = result?.Creacion_de_Proveedoress?.length > 0;
      this.Generacion_de_Orden_de_ComprasForm.get('Proveedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
      this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });
    this.Generacion_de_Orden_de_ComprasForm.get('RFC').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingRFC = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.RFC like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.RFC like '%" + value.RFC.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingRFC = false;
      this.hasOptionsRFC = result?.Creacion_de_Proveedoress?.length > 0;
      this.Generacion_de_Orden_de_ComprasForm.get('RFC').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
      this.optionsRFC = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingRFC = false;
      this.hasOptionsRFC = false;
      this.optionsRFC = of([]);
    });
    this.Generacion_de_Orden_de_ComprasForm.get('Vendedor').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingVendedor = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Contacto like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Contacto like '%" + value.Contacto.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingVendedor = false;
      this.hasOptionsVendedor = result?.Creacion_de_Proveedoress?.length > 0;
      this.Generacion_de_Orden_de_ComprasForm.get('Vendedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
      this.optionsVendedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingVendedor = false;
      this.hasOptionsVendedor = false;
      this.optionsVendedor = of([]);
    });
    this.Generacion_de_Orden_de_ComprasForm.get('Direccion').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingDireccion = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Direccion_postal like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Direccion_postal like '%" + value.Direccion_postal.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingDireccion = false;
      this.hasOptionsDireccion = result?.Creacion_de_Proveedoress?.length > 0;
      this.Generacion_de_Orden_de_ComprasForm.get('Direccion').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
      this.optionsDireccion = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingDireccion = false;
      this.hasOptionsDireccion = false;
      this.optionsDireccion = of([]);
    });
    this.Generacion_de_Orden_de_ComprasForm.get('Telefono_del_Contacto').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingTelefono_del_Contacto = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Telefono_de_contacto like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Telefono_de_contacto like '%" + value.Telefono_de_contacto.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingTelefono_del_Contacto = false;
      this.hasOptionsTelefono_del_Contacto = result?.Creacion_de_Proveedoress?.length > 0;
      this.optionsTelefono_del_Contacto = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingTelefono_del_Contacto = false;
      this.hasOptionsTelefono_del_Contacto = false;
      this.optionsTelefono_del_Contacto = of([]);
    });
    this.Generacion_de_Orden_de_ComprasForm.get('Email').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEmail = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Correo_electronico like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Correo_electronico like '%" + value.Correo_electronico.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingEmail = false;
      this.hasOptionsEmail = result?.Creacion_de_Proveedoress?.length > 0;
      this.Generacion_de_Orden_de_ComprasForm.get('Email').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
      this.optionsEmail = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingEmail = false;
      this.hasOptionsEmail = false;
      this.optionsEmail = of([]);
    });
    this.Generacion_de_Orden_de_ComprasForm.get('Estatus_OC').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEstatus_OC = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Estatus_de_SeguimientoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Estatus_de_SeguimientoService.listaSelAll(0, 20, '');
          return this.Estatus_de_SeguimientoService.listaSelAll(0, 20,
            "Estatus_de_Seguimiento.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Estatus_de_SeguimientoService.listaSelAll(0, 20,
          "Estatus_de_Seguimiento.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingEstatus_OC = false;
      this.hasOptionsEstatus_OC = result?.Estatus_de_Seguimientos?.length > 0;
      this.Generacion_de_Orden_de_ComprasForm.get('Estatus_OC').setValue(result?.Estatus_de_Seguimientos[0], { onlySelf: true, emitEvent: false });
      this.optionsEstatus_OC = of(result?.Estatus_de_Seguimientos);
    }, error => {
      this.isLoadingEstatus_OC = false;
      this.hasOptionsEstatus_OC = false;
      this.optionsEstatus_OC = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Usuario_que_Registra': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Unidad': {
        this.UnidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUnidad = x.Unidads;
        });
        break;
      }

      case 'Moneda': {
        this.MonedaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varMoneda = x.Monedas;
        });
        break;
      }
      case 'Transporte': {
        this.Tipo_de_TransporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Transporte = x.Tipo_de_Transportes;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnFolioCorreo(option: Folios_Generacion_OC) {
    return option?.FolioTexto;
  }
  displayFnProveedor(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }
  displayFnRFC(option: Creacion_de_Proveedores) {
    return option?.RFC;
  }
  displayFnVendedor(option: Creacion_de_Proveedores) {
    return option?.Contacto;
  }
  displayFnDireccion(option: Creacion_de_Proveedores) {
    return option?.Direccion_postal;
  }
  displayFnTelefono_del_Contacto(option: Creacion_de_Proveedores) {
    return option?.Telefono_de_contacto;
  }
  displayFnEmail(option: Creacion_de_Proveedores) {
    return option?.Correo_electronico;
  }
  displayFnEstatus_OC(option: Estatus_de_Seguimiento) {
    return option?.Descripcion;
  }


  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      this.Generacion_de_Orden_de_ComprasForm.enable();
      const entity = this.Generacion_de_Orden_de_ComprasForm.value;
      entity.Folio = this.model.Folio;
      entity.FolioCorreo = this.Generacion_de_Orden_de_ComprasForm.get('FolioCorreo').value?.Folio;
      entity.Proveedor = this.Generacion_de_Orden_de_ComprasForm.get('Proveedor').value?.Clave;
      entity.RFC = this.Generacion_de_Orden_de_ComprasForm.get('RFC').value?.Clave;
      entity.Vendedor = this.Generacion_de_Orden_de_ComprasForm.get('Vendedor')?.value?.Clave;
      entity.Direccion = this.Generacion_de_Orden_de_ComprasForm.get('Direccion')?.value?.Clave;
      entity.Telefono_del_Contacto = this.Generacion_de_Orden_de_ComprasForm.get('Telefono_del_Contacto')?.value?.Clave;
      entity.Email = this.Generacion_de_Orden_de_ComprasForm.get('Email')?.value?.Clave;
      entity.Estatus_OC = this.Generacion_de_Orden_de_ComprasForm.get('Estatus_OC')?.value?.Folio;


      if (this.model.Folio > 0) {
        await this.Generacion_de_Orden_de_ComprasService.update(this.model.Folio, entity).toPromise().then(async id => {
          await this.saveDetalle_de_Generacion_de_OC(this.model.Folio);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());

          if (this.imprimir) {
            setTimeout(() => {
              this.PrintPDF(id);
            }, 2000);
          }
          else {
            this.localStorageHelper.setItemToLocalStorage("IsResetGestion_de_aprobacion", "1")
            this.rulesAfterSave();
            this.spinner.hide('loading');
          }

          return this.model.Folio;
        });

      } else {
        await (this.Generacion_de_Orden_de_ComprasService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Generacion_de_OC(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());

          if (this.imprimir) {
            setTimeout(() => {
              this.PrintPDF(id);
            }, 2000);
          }
          else {
            this.localStorageHelper.setItemToLocalStorage("IsResetGestion_de_aprobacion", "1")
            this.rulesAfterSave();
          }

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
    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Generacion_de_Orden_de_ComprasForm.reset();
      this.model = new Generacion_de_Orden_de_Compras(this.fb);
      this.Generacion_de_Orden_de_ComprasForm = this.model.buildFormGroup();
      this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra = new MatTableDataSource<Detalle_de_Generacion_de_OC>();
      this.Detalle_de_Generacion_de_Orden_de_CompraData = [];

    } else {
      this.router.navigate(['views/Generacion_de_Orden_de_Compras/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }

  cancel() {
    window.close()
    //this.goToList();
  }

  goToList() {
    this.router.navigate(['/Generacion_de_Orden_de_Compras/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  FolioCorreo_ExecuteBusinessRules(): void {
    //FolioCorreo_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Registro_ExecuteBusinessRules(): void {
    //Fecha_de_Registro_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Registro_ExecuteBusinessRules(): void {
    //Hora_de_Registro_FieldExecuteBusinessRulesEnd
  }
  Usuario_que_Registra_ExecuteBusinessRules(): void {
    //Usuario_que_Registra_FieldExecuteBusinessRulesEnd
  }
  Proveedor_ExecuteBusinessRules(): void {
    //Proveedor_FieldExecuteBusinessRulesEnd
  }
  RFC_ExecuteBusinessRules(): void {
    //RFC_FieldExecuteBusinessRulesEnd
  }
  Vendedor_ExecuteBusinessRules(): void {
    //Vendedor_FieldExecuteBusinessRulesEnd
  }
  Direccion_ExecuteBusinessRules(): void {
    //Direccion_FieldExecuteBusinessRulesEnd
  }
  Telefono_del_Contacto_ExecuteBusinessRules(): void {
    //Telefono_del_Contacto_FieldExecuteBusinessRulesEnd
  }
  Email_ExecuteBusinessRules(): void {
    //Email_FieldExecuteBusinessRulesEnd
  }
  Subtotal_ExecuteBusinessRules(): void {
    //Subtotal_FieldExecuteBusinessRulesEnd
  }
  Total_ExecuteBusinessRules(): void {
    //Total_FieldExecuteBusinessRulesEnd
  }
  Moneda_ExecuteBusinessRules(): void {
    //Moneda_FieldExecuteBusinessRulesEnd
  }
  Mensaje_de_correo_ExecuteBusinessRules(): void {
    //Mensaje_de_correo_FieldExecuteBusinessRulesEnd
  }
  Comentarios_Adicionales_ExecuteBusinessRules(): void {
    //Comentarios_Adicionales_FieldExecuteBusinessRulesEnd
  }
  Estatus_OC_ExecuteBusinessRules(): void {
    //Estatus_OC_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Envio_ExecuteBusinessRules(): void {
    //Tipo_de_Envio_FieldExecuteBusinessRulesEnd
  }
  Transporte_ExecuteBusinessRules(): void {
    //Transporte_FieldExecuteBusinessRulesEnd
  }
  FolioGeneracionOC_ExecuteBusinessRules(): void {
    //FolioGeneracionOC_FieldExecuteBusinessRulesEnd
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

    //#region BRID:4088 - Ocultar campos siempre.. - Autor: Lizeth Villa - Actualización: 7/8/2021 8:35:53 PM
    this.brf.HideFieldOfForm(this.Generacion_de_Orden_de_ComprasForm, "idPiezas");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "idPiezas");
    this.brf.HideFieldOfForm(this.Generacion_de_Orden_de_ComprasForm, "idServicios");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "idServicios");
    this.brf.HideFieldOfForm(this.Generacion_de_Orden_de_ComprasForm, "idComprasGenerales");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "idComprasGenerales");
    this.brf.HideFieldOfForm(this.Generacion_de_Orden_de_ComprasForm, "Estatus_OC");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Estatus_OC");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "idPiezas");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "idServicios");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "idComprasGenerales");
    this.brf.HideFieldOfForm(this.Generacion_de_Orden_de_ComprasForm, "FolioGeneracionOC");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "FolioGeneracionOC");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "FolioGeneracionOC");
    //#endregion 


    //#region BRID:4093 - Asignar no requeridos para demo - Autor: Lizeth Villa - Actualización: 7/8/2021 8:37:24 PM
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Folio");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "idPiezas");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "idServicios");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "idComprasGenerales");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Fecha_de_Registro");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Hora_de_Registro");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Usuario_que_Registra");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Folio_de_Orden_de_Compra");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Proveedor");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "RFC");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Vendedor");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Direccion");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Telefono_del_Contacto");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Email");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Subtotal__Pesos");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Subtotal__Dlls");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Total_Pesos");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Total_Dlls");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Comentarios_Adicionales");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Estatus_OC");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Folio");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "No__de_Parte");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Modelo");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Cantidad");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Unidad");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Costo__Pesos");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Costo__Dolares");
    //this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Tipo_de_Envio");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Transporte");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Generacion_de_Orden_de_Compras");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "FolioGeneracionOC");
    //#endregion


    //#region - BRID:4098 - Deshabilitar campos siempre - Autor: Lizeth Villa - Actualización: 10/7/2021 10:39:26 AM
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Fecha_de_Registro', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Hora_de_Registro', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Usuario_que_Registra', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Proveedor', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'RFC', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Vendedor', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Direccion', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Telefono_del_Contacto', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Email', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Subtotal__Pesos', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Subtotal__Dlls', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Total_Pesos', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Total_Dlls', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Subtotal', 0);
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Total', 0);
    //#endregion


    //#region BRID:4172 - Asignar no requerido y bloquedo  - Autor: Lizeth Villa - Actualización: 7/20/2021 1:49:31 PM
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "FolioCorreo");
    this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'FolioCorreo', 0);
    this.brf.HideFieldOfForm(this.Generacion_de_Orden_de_ComprasForm, "Folio");
    this.brf.SetNotRequiredControl(this.Generacion_de_Orden_de_ComprasForm, "Folio");
    //#endregion


    //#region BRID:4097 - Asignar usuario, fecha y hora de registro - Autor: Lizeth Villa - Actualización: 7/12/2021 10:38:06 AM
    if (this.operation == 'New') {

      this.Generacion_de_Orden_de_ComprasForm.controls["Usuario_que_Registra"].setValue(this.UserId)
      this.Generacion_de_Orden_de_ComprasForm.controls["Fecha_de_Registro"].setValue(this.today)
      var now = moment().format("HH:mm:ss");
      this.Generacion_de_Orden_de_ComprasForm.controls["Hora_de_Registro"].setValue(now)
    }
    //#endregion


    //#region - BRID:4162 - Deshabilitar campos en editar - Autor: Lizeth Villa - Actualización: 7/20/2021 1:47:06 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Fecha_de_Registro', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Hora_de_Registro', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Usuario_que_Registra', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Proveedor', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'RFC', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Vendedor', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Direccion', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Telefono_del_Contacto', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Email', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Subtotal__Pesos', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Subtotal__Dlls', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Total_Pesos', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Total_Dlls', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Comentarios_Adicionales', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Estatus_OC', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'No__de_Parte', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Modelo', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Cantidad', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Unidad', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Costo__Pesos', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Costo__Dolares', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Tipo_de_Envio', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Transporte', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Generacion_de_Orden_de_Compras', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'FolioGeneracionOC', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'N_Servicio_Descripcion', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Materiales_Codigo_Descripcion', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Herramientas_Codigo_Descripcion', 0);
      this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Codigo_Descripcion', 0);
    }
    //#endregion


    //INICIA - BRID:4180 - asignar nuevo folio - Autor: Lizeth Villa - Actualización: 7/20/2021 1:11:42 PM
    if (this.operation == 'New') {
      this.brf.SetValueFromQuery(this.Generacion_de_Orden_de_ComprasForm, "FolioCorreo", this.brf.EvaluaQuery("select top 1 foliotexto from Folios_generacion_oc WHERE FolioTexto order by folio desc", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:4180

    //Manual - Ocultar Columnas
    this.hideColumnsDataTable();

    this.getDetalle_de_Gestion_de_aprobacionOC();

    //INICIA - BRID:4115 - Asignar tipo de envio al crear con codigo manual (no desactivar) - Autor: Lizeth Villa - Actualización: 10/7/2021 9:35:16 AM
    if (this.operation == 'New') {
      //this.brf.SetValueFromQuery(this.Generacion_de_Orden_de_ComprasForm, "Tipo_de_Envio", this.brf.EvaluaQuery(`SELECT Tipo_de_Envio FROM Detalle_de_Agregar_Proveedor_Piezas where Seleccion_de_Proveedor = 1 and Comparativo_de_Proveedores = ${this.IdComparativoProveedores} `, 1, "ABC123"), 1, "ABC123");
      //this.brf.SetEnabledControl(this.Generacion_de_Orden_de_ComprasForm, 'Tipo_de_Envio', 0);
    }
    //TERMINA - BRID:4115

    //rulesOnInit_ExecuteBusinessRulesEnd

  }


  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    const KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)

    //INICIA - BRID:4101 - Asignar IdGeneracionOC despues de guardar con codigo manual (no desactivar) - Autor: Lizeth Villa - Actualización: 7/12/2021 2:53:17 PM
    if (this.operation == 'New') {
      this.Detalle_de_Gestion_de_aprobacionOC.forEach(element => {
        this.brf.EvaluaQuery(` UPDATE Detalle_de_Gestion_de_aprobacion SET IdGeneracionOC = ${KeyValueInserted} WHERE Folio = ${element.Folio}`, 1, "ABC123");
      });
    }
    //TERMINA - BRID:4101


    //INICIA - BRID:4102 - Asignar folio a FolioGneracionOC - Autor: Lizeth Villa - Actualización: 7/20/2021 1:40:25 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(` UPDATE Generacion_de_Orden_de_Compras SET FolioGeneracionOC = FOLIO WHERE FOLIO = ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4102


    //INICIA - BRID:4144 - Agregar registro en Listados de pagos de proveedores - Autor: ANgel Acuña - Actualización: 7/14/2021 4:19:06 PM
    if (this.operation == 'New') {
      let Proveedor = this.Generacion_de_Orden_de_ComprasForm.controls["Proveedor"].value.Clave
      this.brf.EvaluaQuery(` exec usp_InsDetalle_de_Listado_de_Pago_de_ProveedoresMR ${KeyValueInserted}, ${Proveedor}`, 1, "ABC123");
    }
    //TERMINA - BRID:4144


    //INICIA - BRID:4176 - Enviar correo de orden de compra - Autor: Lizeth Villa - Actualización: 7/22/2021 8:06:20 PM
    if (this.operation == 'New') {
      //this.brf.SendEmailQueryPrintFormat("VICS - Orden de Compra", this.brf.EvaluaQuery("select STUFF(( select ';' + Correo_electronico + '' from Creacion_de_Proveedores where Clave = FLD[Proveedor] for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado/a : '+ EvaluaQuery("select Razon_social from Creacion_de_Proveedores where Clave = FLD[Proveedor]")+ ' </p> <p>Para hacer de su conocimiento que se ha se ha enviado una Orden de Compra.</p> <p>Atentamente.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	",67,EvaluaQuery("test", 1, "ABC123"));
    }
    //TERMINA - BRID:4176


    //INICIA - BRID:4186 - Asignar folio consecutivo en campo folio correo - Autor: Lizeth Villa - Actualización: 7/20/2021 1:41:43 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(`usp_UpdateConsecutivoOC ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4186


    //INICIA - BRID:4340 - Enviar correo de orden de compra con redaccion - Autor: Lizeth Villa - Actualización: 7/22/2021 7:58:32 PM
    if (this.operation == 'New') {
      //this.brf.SendEmailQueryPrintFormat("VICS - Orden de Compra", this.brf.EvaluaQuery("select STUFF(( select ';' + Correo_electronico + '' from Creacion_de_Proveedores where Clave = FLD[Proveedor] for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>FLD[Mensaje_de_correo] </p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div></center></td></tr></table></body></html>	",67,EvaluaQuery("select FLDD[lblFolio]", 1, "ABC123"));
    }
    //TERMINA - BRID:4340


    //INICIA - BRID:6535 - Prueba nueva RDN, Enviar correo con formato y con sender - Autor: Francisco Javier Martínez Urbina - Actualización: 9/28/2021 6:00:05 PM
    if (this.operation == 'New') {
      //this.brf.SendEmailQueryPrintSenderFormat("test", this.brf.EvaluaQuery("df", 1, "ABC123"), "dsf",test,this.brf.EvaluaQuery("test", 1, "ABC123"),this.brf.EvaluaQuery("@@parameter6.value@@", 1, "ABC123"));
    }
    //TERMINA - BRID:6535

    //rulesAfterSave_ExecuteBusinessRulesEnd

    setTimeout(() => {
      this.cancel()
    }, 4000);


  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas

  //#region Enviar a Aprobar
  sendToApprove() {
    this.saveData()
  }
  //#endregion


  //#region Enviar a Aprobar
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


  //#region Obtener Detalle de Gestion de Aprobacion
  getDetalle_de_Gestion_de_aprobacionOC() {

    //const stringListadoCotizar = this.localStorageHelper.getItemFromLocalStorage("Detalle_de_Gestion_de_aprobacionOrdenCompra");
    var array = JSON.parse(this.stringListadoCotizar)

    if (array != null) {

      this.Detalle_de_Gestion_de_aprobacionOC = array

      if (this.operation == "New") {
        this.fnGetDatosGenerales("Proveedor", 1)
        this.fnGetDatosGenerales("RFC", 2)
        this.fnGetDatosGenerales("Vendedor", 3)
        this.fnGetDatosGenerales("Direccion", 4)
        this.fnGetDatosGenerales("Telefono_del_Contacto", 5)
        this.fnGetDatosGenerales("Email", 6)

        this.getDataTable();
      }

    }

  }
  //#endregion


  //#region Obtener DataTable
  getDataTable() {
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra = new MatTableDataSource([]);

    let data = [];
    if (this.Detalle_de_Gestion_de_aprobacionOC != null) {
      this.Detalle_de_Gestion_de_aprobacionOC.forEach((element, index) => {
        this.sqlModel.query = `spGetItemsGOC ${element.IdComparativoProveedores},${element.Folio},1`

        this._SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

          if (result == null || result.length == 0) {
            return
          }

          let dt = result[0].Table

          if(dt!=null && dt.length>0){
            for (var i = 0; i < dt.length; i++) {
              let resDt = dt[i];
  
              resDt.IsDeleted = false;
              resDt.edit = false;
              resDt.isNew = true;
              data.push(resDt);
            }
  
            if (index == this.Detalle_de_Gestion_de_aprobacionOC.length - 1) {
              this.generateMatTable(data)
              this.getTotales(data)
            }
          }        

        });

      });

    }

  }
  //#endregion


  //#region Generar Mat Table
  generateMatTable(array) {
    this.loadDetalle_de_Generacion_de_Orden_de_Compra(array);
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra = new MatTableDataSource(array);
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.paginator = this.paginator;
    this.dataSourceDetalle_de_Generacion_de_Orden_de_Compra.sort = this.sort;
  }
  //#endregion


  //#region Ocultar Columnas de la tabla
  hideColumnsDataTable() {
    this.brf.HideFieldofMultirenglon(this.Detalle_de_Generacion_de_Orden_de_CompraColumns, "actions");
    this.brf.HideFieldofMultirenglon(this.Detalle_de_Generacion_de_Orden_de_CompraColumns, "No__de_Parte");
    this.brf.HideFieldofMultirenglon(this.Detalle_de_Generacion_de_Orden_de_CompraColumns, "N_Servicio_Descripcion");
    this.brf.HideFieldofMultirenglon(this.Detalle_de_Generacion_de_Orden_de_CompraColumns, "Materiales_Codigo_Descripcion");
    this.brf.HideFieldofMultirenglon(this.Detalle_de_Generacion_de_Orden_de_CompraColumns, "Herramientas_Codigo_Descripcion");
  }
  //#endregion


  //#region Obtener Total y Subtotales
  getTotales(array) {
    let suma: number = 0
    array.forEach(element => {
      suma += element.Costo_Total
    });

    this.Generacion_de_Orden_de_ComprasForm.controls["Subtotal"].setValue(suma.toFixed(2))
    this.Generacion_de_Orden_de_ComprasForm.controls["Total"].setValue(suma.toFixed(2))

  }
  //#endregion


  //#region Imprimir PDF
  PrintPDF(RecordId) {
    const IdFormat = 67

    this.pdfCloudService.GeneratePDF(IdFormat, RecordId).subscribe((res) => {

      //Implementar Mensaje si no hay reportes
      saveByteArray('Formatos.pdf', base64ToArrayBuffer(res), 'application/pdf');

      if (this.operation == "New") {
        this.imprimir = false;
        this.disableFields();
      }
      this.spinner.hide('loading');
    });
  }
  //#endregion


  //#region Obtener Datos Generales
  fnGetDatosGenerales(controlName, numero) {
    let FolioDetalleGestionAprobacion = this.Detalle_de_Gestion_de_aprobacionOC[0].Folio;
    this.sqlModel.query = `EXEC usp_GetProveedorInfo  ${FolioDetalleGestionAprobacion},${numero}`

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe((result) => {
      this.Generacion_de_Orden_de_ComprasForm.controls[controlName].setValue(result)
    });
  }
  //#endregion


  //#region Deshabilitar Campos
  disableFields() {
    this.Generacion_de_Orden_de_ComprasForm.get("FolioCorreo").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Fecha_de_Registro").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Hora_de_Registro").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Usuario_que_Registra").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Proveedor").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("RFC").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Vendedor").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Direccion").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Telefono_del_Contacto").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Email").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Subtotal").disable();
    this.Generacion_de_Orden_de_ComprasForm.get("Total").disable();


  }
  //#endregion

}
