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
import { Listado_de_Pago_de_ProveedoresService } from 'src/app/api-services/Listado_de_Pago_de_Proveedores.service';
import { Listado_de_Pago_de_Proveedores } from 'src/app/models/Listado_de_Pago_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { Detalle_de_Listado_de_Pago_de_ProveedoresService } from 'src/app/api-services/Detalle_de_Listado_de_Pago_de_Proveedores.service';
import { Detalle_de_Listado_de_Pago_de_Proveedores } from 'src/app/models/Detalle_de_Listado_de_Pago_de_Proveedores';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { MonedaService } from 'src/app/api-services/Moneda.service';
import { Moneda } from 'src/app/models/Moneda';
import { Ingreso_de_CostosService } from 'src/app/api-services/Ingreso_de_Costos.service';
import { Ingreso_de_Costos } from 'src/app/models/Ingreso_de_Costos';

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

import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es')
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";
import { MessagesHelper } from 'src/app/helpers/messages-helper';

@Component({
  selector: 'app-Listado_de_Pago_de_Proveedores',
  templateUrl: './Listado_de_Pago_de_Proveedores.component.html',
  styleUrls: ['./Listado_de_Pago_de_Proveedores.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
})
export class Listado_de_Pago_de_ProveedoresComponent implements OnInit, AfterViewInit {
MRaddPago_de_Proveedores: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  public openWindows: any;

  Listado_de_Pago_de_ProveedoresForm: FormGroup;
  public Editor = ClassicEditor;
  model: Listado_de_Pago_de_Proveedores;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsProveedor: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor: boolean;
  isLoadingProveedor: boolean = false;
  listaProveedor: Observable<Creacion_de_Proveedores[]>;

  optionsNo__de_OC: Observable<Generacion_de_Orden_de_Compras[]>;
  hasOptionsNo__de_OC: boolean;
  isLoadingNo__de_OC: boolean;
  listaNo__de_OC: Observable<Generacion_de_Orden_de_Compras[]>;

  optionsEstatus: Observable<Estatus_de_Seguimiento[]>;
  hasOptionsEstatus: boolean;
  isLoadingEstatus: boolean = false;
  listaEstatus: Observable<Estatus_de_Seguimiento[]>;

  public varCreacion_de_Proveedores: Creacion_de_Proveedores[] = [];
  public varAeronave: Aeronave[] = [];
  public varMoneda: Moneda[] = [];
  public varGeneracion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras[] = [];
  public varEstatus_de_Seguimiento: Estatus_de_Seguimiento[] = [];
  public varIngreso_de_Costos: Ingreso_de_Costos[] = [];

  autoProveedor_Detalle_de_Listado_de_Pago_de_Proveedores = new FormControl();
  SelectedProveedor_Detalle_de_Listado_de_Pago_de_Proveedores: string[] = [];
  isLoadingProveedor_Detalle_de_Listado_de_Pago_de_Proveedores: boolean;
  searchProveedor_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted: boolean;
  autoMatricula_Detalle_de_Listado_de_Pago_de_Proveedores = new FormControl();
  SelectedMatricula_Detalle_de_Listado_de_Pago_de_Proveedores: string[] = [];
  isLoadingMatricula_Detalle_de_Listado_de_Pago_de_Proveedores: boolean;
  searchMatricula_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted: boolean;
  autoMoneda_Detalle_de_Listado_de_Pago_de_Proveedores = new FormControl();
  SelectedMoneda_Detalle_de_Listado_de_Pago_de_Proveedores: string[] = [];
  isLoadingMoneda_Detalle_de_Listado_de_Pago_de_Proveedores: boolean;
  searchMoneda_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted: boolean;
  autoNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores = new FormControl();
  SelectedNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores: string[] = [];
  isLoadingNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores: boolean;
  searchNo__de_OC_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted: boolean;
  autoEstatus_Detalle_de_Listado_de_Pago_de_Proveedores = new FormControl();
  SelectedEstatus_Detalle_de_Listado_de_Pago_de_Proveedores: string[] = [];
  isLoadingEstatus_Detalle_de_Listado_de_Pago_de_Proveedores: boolean;
  searchEstatus_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted: boolean;

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourcePago_de_Proveedores = new MatTableDataSource<Detalle_de_Listado_de_Pago_de_Proveedores>();
  Pago_de_ProveedoresColumns = [
    { def: 'actions', hide: false },
    { def: 'Partida', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'No__de_Factura', hide: false },
    { def: 'Fecha_de_Factura', hide: false },
    { def: 'Total_de_Factura_', hide: false },
    { def: 'Moneda', hide: false },
    { def: 'No__de_OC', hide: false },
    { def: 'Fecha_de_Pago', hide: false },
    { def: 'Fecha_Requerida', hide: false },
    { def: 'Tiempos_de_Pago', hide: false },
    { def: 'Nota_de_Credito', hide: false },
    { def: 'Observaciones', hide: false },
    { def: 'Estatus', hide: false },
    { def: 'Solicitud_de_Pago', hide: false },
    { def: 'IdSolicitudPago', hide: false },
    { def: 'EsPrincipal', hide: false },

  ];
  Pago_de_ProveedoresData: Detalle_de_Listado_de_Pago_de_Proveedores[] = [];
  isPago_de_ProveedoresAdd: boolean = true;

  today = new Date;
  consult: boolean = false;
  timerStart: boolean = false;
  interval;

  notFound: string = "No se encontraron registros."
  loadingText: string = "Cargando..."
  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Listado_de_Pago_de_ProveedoresService: Listado_de_Pago_de_ProveedoresService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Generacion_de_Orden_de_ComprasService: Generacion_de_Orden_de_ComprasService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,
    private Detalle_de_Listado_de_Pago_de_ProveedoresService: Detalle_de_Listado_de_Pago_de_ProveedoresService,
    private AeronaveService: AeronaveService,
    private MonedaService: MonedaService,
    private Ingreso_de_CostosService: Ingreso_de_CostosService,
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
    private _messages: MessagesHelper,
    renderer: Renderer2) {

    this.brf = new BusinessRulesFunctions(renderer, spartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.model = new Listado_de_Pago_de_Proveedores(this.fb);
    this.Listado_de_Pago_de_ProveedoresForm = this.model.buildFormGroup();
    this.Pago_de_ProveedoresItems.removeAt(0);

    this.Listado_de_Pago_de_ProveedoresForm.get('Folio').disable();
    this.Listado_de_Pago_de_ProveedoresForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourcePago_de_Proveedores.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Pago_de_ProveedoresColumns.splice(0, 1);

          this.Listado_de_Pago_de_ProveedoresForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Listado_de_Pago_de_Proveedores)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Listado_de_Pago_de_ProveedoresForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Listado_de_Pago_de_ProveedoresForm, 'No__de_OC', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Listado_de_Pago_de_ProveedoresForm, 'Estatus', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    if (!this.timerStart) {
      this.startTimer();
    }

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Listado_de_Pago_de_ProveedoresService.listaSelAll(0, 1, 'Listado_de_Pago_de_Proveedores.Folio=' + id).toPromise();
    if (result.Listado_de_Pago_de_Proveedoress.length > 0) {
      let fPago_de_Proveedores = await this.Detalle_de_Listado_de_Pago_de_ProveedoresService.listaSelAll(0, 1000, 'Listado_de_Pago_de_Proveedores.Folio=' + id).toPromise();
      this.Pago_de_ProveedoresData = fPago_de_Proveedores.Detalle_de_Listado_de_Pago_de_Proveedoress;
      this.loadPago_de_Proveedores(fPago_de_Proveedores.Detalle_de_Listado_de_Pago_de_Proveedoress);
      this.dataSourcePago_de_Proveedores = new MatTableDataSource(fPago_de_Proveedores.Detalle_de_Listado_de_Pago_de_Proveedoress);
      this.dataSourcePago_de_Proveedores.paginator = this.paginator;
      this.dataSourcePago_de_Proveedores.sort = this.sort;

      this.model.fromObject(result.Listado_de_Pago_de_Proveedoress[0]);
      this.Listado_de_Pago_de_ProveedoresForm.get('Proveedor').setValue(
        result.Listado_de_Pago_de_Proveedoress[0].Proveedor_Creacion_de_Proveedores.Razon_social,
        { onlySelf: false, emitEvent: true }
      );
      this.Listado_de_Pago_de_ProveedoresForm.get('No__de_OC').setValue(
        result.Listado_de_Pago_de_Proveedoress[0].No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
        { onlySelf: false, emitEvent: true }
      );
      this.Listado_de_Pago_de_ProveedoresForm.get('Estatus').setValue(
        result.Listado_de_Pago_de_Proveedoress[0].Estatus_Estatus_de_Seguimiento.Descripcion,
        { onlySelf: false, emitEvent: true }
      );

      this.Listado_de_Pago_de_ProveedoresForm.markAllAsTouched();
      this.Listado_de_Pago_de_ProveedoresForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Pago_de_ProveedoresItems() {
    return this.Listado_de_Pago_de_ProveedoresForm.get('Detalle_de_Listado_de_Pago_de_ProveedoresItems') as FormArray;
  }

  getPago_de_ProveedoresColumns(): string[] {
    return this.Pago_de_ProveedoresColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPago_de_Proveedores(Pago_de_Proveedores: Detalle_de_Listado_de_Pago_de_Proveedores[]) {
    Pago_de_Proveedores.forEach(element => {
      this.addPago_de_Proveedores(element);
    });
  }

  addPago_de_ProveedoresToMR() {
    const Pago_de_Proveedores = new Detalle_de_Listado_de_Pago_de_Proveedores(this.fb);
    this.Pago_de_ProveedoresData.push(this.addPago_de_Proveedores(Pago_de_Proveedores));
    this.dataSourcePago_de_Proveedores.data = this.Pago_de_ProveedoresData;
    Pago_de_Proveedores.edit = true;
    Pago_de_Proveedores.isNew = true;
    const length = this.dataSourcePago_de_Proveedores.data.length;
    const index = length - 1;
    const formPago_de_Proveedores = this.Pago_de_ProveedoresItems.controls[index] as FormGroup;
    this.addFilterToControlProveedor_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.Proveedor, index);
    this.addFilterToControlMatricula_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.Matricula, index);
    this.addFilterToControlMoneda_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.Moneda, index);
    this.addFilterToControlNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.No__de_OC, index);
    this.addFilterToControlEstatus_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.Estatus, index);

    const page = Math.ceil(this.dataSourcePago_de_Proveedores.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addPago_de_Proveedores(entity: Detalle_de_Listado_de_Pago_de_Proveedores) {
    const Pago_de_Proveedores = new Detalle_de_Listado_de_Pago_de_Proveedores(this.fb);
    this.Pago_de_ProveedoresItems.push(Pago_de_Proveedores.buildFormGroup());
    if (entity) {
      Pago_de_Proveedores.fromObject(entity);
    }
    return entity;
  }

  Pago_de_ProveedoresItemsByFolio(Folio: number): FormGroup {
    return (this.Listado_de_Pago_de_ProveedoresForm.get('Detalle_de_Listado_de_Pago_de_ProveedoresItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Pago_de_ProveedoresItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    let fb = this.Pago_de_ProveedoresItems.controls[index] as FormGroup;
    return fb;
  }

  deletePago_de_Proveedores(element: any) {
    let index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    this.Pago_de_ProveedoresData[index].IsDeleted = true;
    this.dataSourcePago_de_Proveedores.data = this.Pago_de_ProveedoresData;
    this.dataSourcePago_de_Proveedores._updateChangeSubscription();
    index = this.dataSourcePago_de_Proveedores.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditPago_de_Proveedores(element: any) {
    let index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Pago_de_ProveedoresData[index].IsDeleted = true;
      this.dataSourcePago_de_Proveedores.data = this.Pago_de_ProveedoresData;
      this.dataSourcePago_de_Proveedores._updateChangeSubscription();
      index = this.Pago_de_ProveedoresData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async savePago_de_Proveedores(element: any) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    const formPago_de_Proveedores = this.Pago_de_ProveedoresItems.controls[index] as FormGroup;
    this.Pago_de_ProveedoresData[index].Partida = formPago_de_Proveedores.value.Partida;
    if (this.Pago_de_ProveedoresData[index].Proveedor !== formPago_de_Proveedores.value.Proveedor && formPago_de_Proveedores.value.Proveedor > 0) {
      let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formPago_de_Proveedores.value.Proveedor).toPromise();
      this.Pago_de_ProveedoresData[index].Proveedor_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Pago_de_ProveedoresData[index].Proveedor = formPago_de_Proveedores.value.Proveedor;
    if (this.Pago_de_ProveedoresData[index].Matricula !== formPago_de_Proveedores.value.Matricula && formPago_de_Proveedores.value.Matricula > 0) {
      let aeronave = await this.AeronaveService.getById(formPago_de_Proveedores.value.Matricula).toPromise();
      this.Pago_de_ProveedoresData[index].Matricula_Aeronave = aeronave;
    }
    this.Pago_de_ProveedoresData[index].Matricula = formPago_de_Proveedores.value.Matricula;
    this.Pago_de_ProveedoresData[index].No__de_Factura = formPago_de_Proveedores.value.No__de_Factura;
    this.Pago_de_ProveedoresData[index].Fecha_de_Factura = formPago_de_Proveedores.value.Fecha_de_Factura;
    this.Pago_de_ProveedoresData[index].Total_de_Factura_ = formPago_de_Proveedores.value.Total_de_Factura_;
    if (this.Pago_de_ProveedoresData[index].Moneda !== formPago_de_Proveedores.value.Moneda && formPago_de_Proveedores.value.Moneda > 0) {
      let moneda = await this.MonedaService.getById(formPago_de_Proveedores.value.Moneda).toPromise();
      this.Pago_de_ProveedoresData[index].Moneda_Moneda = moneda;
    }
    this.Pago_de_ProveedoresData[index].Moneda = formPago_de_Proveedores.value.Moneda;
    if (this.Pago_de_ProveedoresData[index].No__de_OC !== formPago_de_Proveedores.value.No__de_OC && formPago_de_Proveedores.value.No__de_OC > 0) {
      let generacion_de_orden_de_compras = await this.Generacion_de_Orden_de_ComprasService.getById(formPago_de_Proveedores.value.No__de_OC).toPromise();
      this.Pago_de_ProveedoresData[index].No__de_OC_Generacion_de_Orden_de_Compras = generacion_de_orden_de_compras;
    }
    this.Pago_de_ProveedoresData[index].No__de_OC = formPago_de_Proveedores.value.No__de_OC;
    this.Pago_de_ProveedoresData[index].Fecha_de_Pago = formPago_de_Proveedores.value.Fecha_de_Pago;
    this.Pago_de_ProveedoresData[index].Fecha_Requerida = formPago_de_Proveedores.value.Fecha_Requerida;
    this.Pago_de_ProveedoresData[index].Tiempos_de_Pago = formPago_de_Proveedores.value.Tiempos_de_Pago;
    this.Pago_de_ProveedoresData[index].Nota_de_Credito = formPago_de_Proveedores.value.Nota_de_Credito;
    this.Pago_de_ProveedoresData[index].Observaciones = formPago_de_Proveedores.value.Observaciones;
    if (this.Pago_de_ProveedoresData[index].Estatus !== formPago_de_Proveedores.value.Estatus && formPago_de_Proveedores.value.Estatus > 0) {
      let estatus_de_seguimiento = await this.Estatus_de_SeguimientoService.getById(formPago_de_Proveedores.value.Estatus).toPromise();
      this.Pago_de_ProveedoresData[index].Estatus_Estatus_de_Seguimiento = estatus_de_seguimiento;
    }
    this.Pago_de_ProveedoresData[index].Estatus = formPago_de_Proveedores.value.Estatus;
    this.Pago_de_ProveedoresData[index].Solicitud_de_Pago = formPago_de_Proveedores.value.Solicitud_de_Pago;
    this.Pago_de_ProveedoresData[index].IdSolicitudPago = formPago_de_Proveedores.value.IdSolicitudPago;
    this.Pago_de_ProveedoresData[index].IdSolicitudPago_Ingreso_de_Costos = formPago_de_Proveedores.value.IdSolicitudPago !== '' ?
      this.varIngreso_de_Costos.filter(d => d.Folio === formPago_de_Proveedores.value.IdSolicitudPago)[0] : null;
    this.Pago_de_ProveedoresData[index].EsPrincipal = formPago_de_Proveedores.value.EsPrincipal;

    this.Pago_de_ProveedoresData[index].isNew = false;
    this.dataSourcePago_de_Proveedores.data = this.Pago_de_ProveedoresData;
    this.dataSourcePago_de_Proveedores._updateChangeSubscription();
  }

  editPago_de_Proveedores(element: any) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    const formPago_de_Proveedores = this.Pago_de_ProveedoresItems.controls[index] as FormGroup;
    this.SelectedProveedor_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.dataSourcePago_de_Proveedores.data[index].Proveedor_Creacion_de_Proveedores.Razon_social;
    this.addFilterToControlProveedor_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.Proveedor, index);
    this.SelectedMatricula_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.dataSourcePago_de_Proveedores.data[index].Matricula_Aeronave.Matricula;
    this.addFilterToControlMatricula_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.Matricula, index);
    this.SelectedMoneda_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.dataSourcePago_de_Proveedores.data[index].Moneda_Moneda.Descripcion;
    this.addFilterToControlMoneda_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.Moneda, index);
    this.SelectedNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.dataSourcePago_de_Proveedores.data[index].No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC;
    this.addFilterToControlNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.No__de_OC, index);
    this.SelectedEstatus_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.dataSourcePago_de_Proveedores.data[index].Estatus_Estatus_de_Seguimiento.Descripcion;
    this.addFilterToControlEstatus_Detalle_de_Listado_de_Pago_de_Proveedores(formPago_de_Proveedores.controls.Estatus, index);

    element.edit = true;
  }

  async saveDetalle_de_Listado_de_Pago_de_Proveedores(Folio: number) {
    this.dataSourcePago_de_Proveedores.data.forEach(async (d, index) => {
      const data = this.Pago_de_ProveedoresItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Listado_de_Pago_de_Proveedores = Folio;


      if (model.Folio === 0) {
        // Add Pago de Proveedores
        let response = await this.Detalle_de_Listado_de_Pago_de_ProveedoresService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPago_de_Proveedores = this.Pago_de_ProveedoresItemsByFolio(model.Folio);
        if (formPago_de_Proveedores.dirty) {
          // Update Pago de Proveedores
          let response = await this.Detalle_de_Listado_de_Pago_de_ProveedoresService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Pago de Proveedores
        await this.Detalle_de_Listado_de_Pago_de_ProveedoresService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectProveedor_Detalle_de_Listado_de_Pago_de_Proveedores(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.option.viewValue;
    let fgr = this.Listado_de_Pago_de_ProveedoresForm.controls.Detalle_de_Listado_de_Pago_de_ProveedoresItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Proveedor.setValue(event.option.value);
    this.displayFnProveedor_Detalle_de_Listado_de_Pago_de_Proveedores(element);
  }

  displayFnProveedor_Detalle_de_Listado_de_Pago_de_Proveedores(this, element) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    return this.SelectedProveedor_Detalle_de_Listado_de_Pago_de_Proveedores[index];
  }
  updateOptionProveedor_Detalle_de_Listado_de_Pago_de_Proveedores(event, element: any) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    this.SelectedProveedor_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.source.viewValue;
  }

  _filterProveedor_Detalle_de_Listado_de_Pago_de_Proveedores(filter: any): Observable<Creacion_de_Proveedores> {
    const where = filter !== '' ? "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
    return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
  }

  addFilterToControlProveedor_Detalle_de_Listado_de_Pago_de_Proveedores(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_Detalle_de_Listado_de_Pago_de_Proveedores = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_Detalle_de_Listado_de_Pago_de_Proveedores = true;
        return this._filterProveedor_Detalle_de_Listado_de_Pago_de_Proveedores(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_Detalle_de_Listado_de_Pago_de_Proveedores = false;
      this.searchProveedor_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted = true;
      this.SelectedProveedor_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.varCreacion_de_Proveedores.length === 0 ? '' : this.SelectedProveedor_Detalle_de_Listado_de_Pago_de_Proveedores[index];
    });
  }
  public selectMatricula_Detalle_de_Listado_de_Pago_de_Proveedores(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMatricula_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.option.viewValue;
    let fgr = this.Listado_de_Pago_de_ProveedoresForm.controls.Detalle_de_Listado_de_Pago_de_ProveedoresItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Matricula.setValue(event.option.value);
    this.displayFnMatricula_Detalle_de_Listado_de_Pago_de_Proveedores(element);
  }

  displayFnMatricula_Detalle_de_Listado_de_Pago_de_Proveedores(this, element) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    return this.SelectedMatricula_Detalle_de_Listado_de_Pago_de_Proveedores[index];
  }
  updateOptionMatricula_Detalle_de_Listado_de_Pago_de_Proveedores(event, element: any) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    this.SelectedMatricula_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.source.viewValue;
  }

  _filterMatricula_Detalle_de_Listado_de_Pago_de_Proveedores(filter: any): Observable<Aeronave> {
    const where = filter !== '' ? "Aeronave.Matricula like '%" + filter + "%'" : '';
    return this.AeronaveService.listaSelAll(0, 20, where);
  }

  addFilterToControlMatricula_Detalle_de_Listado_de_Pago_de_Proveedores(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMatricula_Detalle_de_Listado_de_Pago_de_Proveedores = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMatricula_Detalle_de_Listado_de_Pago_de_Proveedores = true;
        return this._filterMatricula_Detalle_de_Listado_de_Pago_de_Proveedores(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingMatricula_Detalle_de_Listado_de_Pago_de_Proveedores = false;
      this.searchMatricula_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted = true;
      this.SelectedMatricula_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.varAeronave.length === 0 ? '' : this.SelectedMatricula_Detalle_de_Listado_de_Pago_de_Proveedores[index];
    });
  }
  public selectMoneda_Detalle_de_Listado_de_Pago_de_Proveedores(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMoneda_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.option.viewValue;
    let fgr = this.Listado_de_Pago_de_ProveedoresForm.controls.Detalle_de_Listado_de_Pago_de_ProveedoresItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Moneda.setValue(event.option.value);
    this.displayFnMoneda_Detalle_de_Listado_de_Pago_de_Proveedores(element);
  }

  displayFnMoneda_Detalle_de_Listado_de_Pago_de_Proveedores(this, element) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    return this.SelectedMoneda_Detalle_de_Listado_de_Pago_de_Proveedores[index];
  }
  updateOptionMoneda_Detalle_de_Listado_de_Pago_de_Proveedores(event, element: any) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    this.SelectedMoneda_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.source.viewValue;
  }

  _filterMoneda_Detalle_de_Listado_de_Pago_de_Proveedores(filter: any): Observable<Moneda> {
    const where = filter !== '' ? "Moneda.Descripcion like '%" + filter + "%'" : '';
    return this.MonedaService.listaSelAll(0, 20, where);
  }

  addFilterToControlMoneda_Detalle_de_Listado_de_Pago_de_Proveedores(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMoneda_Detalle_de_Listado_de_Pago_de_Proveedores = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMoneda_Detalle_de_Listado_de_Pago_de_Proveedores = true;
        return this._filterMoneda_Detalle_de_Listado_de_Pago_de_Proveedores(value || '');
      })
    ).subscribe(result => {
      this.varMoneda = result.Monedas;
      this.isLoadingMoneda_Detalle_de_Listado_de_Pago_de_Proveedores = false;
      this.searchMoneda_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted = true;
      this.SelectedMoneda_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.varMoneda.length === 0 ? '' : this.SelectedMoneda_Detalle_de_Listado_de_Pago_de_Proveedores[index];
    });
  }
  public selectNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.option.viewValue;
    let fgr = this.Listado_de_Pago_de_ProveedoresForm.controls.Detalle_de_Listado_de_Pago_de_ProveedoresItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.No__de_OC.setValue(event.option.value);
    this.displayFnNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores(element);
  }

  displayFnNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores(this, element) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    return this.SelectedNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores[index];
  }
  updateOptionNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores(event, element: any) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    this.SelectedNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.source.viewValue;
  }

  _filterNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores(filter: any): Observable<Generacion_de_Orden_de_Compras> {
    const where = filter !== '' ? "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + filter + "%'" : '';
    return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, where);
  }

  addFilterToControlNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores = true;
        return this._filterNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores(value || '');
      })
    ).subscribe(result => {
      this.varGeneracion_de_Orden_de_Compras = result.Generacion_de_Orden_de_Comprass;
      this.isLoadingNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores = false;
      this.searchNo__de_OC_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted = true;
      this.SelectedNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.varGeneracion_de_Orden_de_Compras.length === 0 ? '' : this.SelectedNo__de_OC_Detalle_de_Listado_de_Pago_de_Proveedores[index];
    });
  }
  public selectEstatus_Detalle_de_Listado_de_Pago_de_Proveedores(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedEstatus_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.option.viewValue;
    let fgr = this.Listado_de_Pago_de_ProveedoresForm.controls.Detalle_de_Listado_de_Pago_de_ProveedoresItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Estatus.setValue(event.option.value);
    this.displayFnEstatus_Detalle_de_Listado_de_Pago_de_Proveedores(element);
  }

  displayFnEstatus_Detalle_de_Listado_de_Pago_de_Proveedores(this, element) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    return this.SelectedEstatus_Detalle_de_Listado_de_Pago_de_Proveedores[index];
  }
  updateOptionEstatus_Detalle_de_Listado_de_Pago_de_Proveedores(event, element: any) {
    const index = this.dataSourcePago_de_Proveedores.data.indexOf(element);
    this.SelectedEstatus_Detalle_de_Listado_de_Pago_de_Proveedores[index] = event.source.viewValue;
  }

  _filterEstatus_Detalle_de_Listado_de_Pago_de_Proveedores(filter: any): Observable<Estatus_de_Seguimiento> {
    const where = filter !== '' ? "Estatus_de_Seguimiento.Descripcion like '%" + filter + "%'" : '';
    return this.Estatus_de_SeguimientoService.listaSelAll(0, 20, where);
  }

  addFilterToControlEstatus_Detalle_de_Listado_de_Pago_de_Proveedores(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingEstatus_Detalle_de_Listado_de_Pago_de_Proveedores = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingEstatus_Detalle_de_Listado_de_Pago_de_Proveedores = true;
        return this._filterEstatus_Detalle_de_Listado_de_Pago_de_Proveedores(value || '');
      })
    ).subscribe(result => {
      this.varEstatus_de_Seguimiento = result.Estatus_de_Seguimientos;
      this.isLoadingEstatus_Detalle_de_Listado_de_Pago_de_Proveedores = false;
      this.searchEstatus_Detalle_de_Listado_de_Pago_de_ProveedoresCompleted = true;
      this.SelectedEstatus_Detalle_de_Listado_de_Pago_de_Proveedores[index] = this.varEstatus_de_Seguimiento.length === 0 ? '' : this.SelectedEstatus_Detalle_de_Listado_de_Pago_de_Proveedores[index];
    });
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Listado_de_Pago_de_ProveedoresForm.disabled ? "Update" : this.operation;
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

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Ingreso_de_CostosService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varIngreso_de_Costos]) => {
          this.varIngreso_de_Costos = varIngreso_de_Costos;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.setDataFromSelects()


    this.Listado_de_Pago_de_ProveedoresForm.get('Estatus').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEstatus = true),
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
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = result?.Estatus_de_Seguimientos?.length > 0;
      //this.Listado_de_Pago_de_ProveedoresForm.get('Estatus').setValue(result?.Estatus_de_Seguimientos[0], { onlySelf: true, emitEvent: false });
      this.optionsEstatus = of(result?.Estatus_de_Seguimientos);
    }, error => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = false;
      this.optionsEstatus = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'IdSolicitudPago': {
        this.Ingreso_de_CostosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varIngreso_de_Costos = x.Ingreso_de_Costoss;
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
  displayFnNo__de_OC(option: Generacion_de_Orden_de_Compras) {
    return option?.FolioGeneracionOC;
  }
  displayFnEstatus(option: Estatus_de_Seguimiento) {
    return option?.Descripcion;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Listado_de_Pago_de_ProveedoresForm.value;
      entity.Folio = this.model.Folio;
      entity.Proveedor = this.Listado_de_Pago_de_ProveedoresForm.get('Proveedor').value.Clave;
      entity.No__de_OC = this.Listado_de_Pago_de_ProveedoresForm.get('No__de_OC').value.Folio;
      entity.Estatus = this.Listado_de_Pago_de_ProveedoresForm.get('Estatus').value.Folio;


      if (this.model.Folio > 0) {
        await this.Listado_de_Pago_de_ProveedoresService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Listado_de_Pago_de_Proveedores(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Listado_de_Pago_de_ProveedoresService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Listado_de_Pago_de_Proveedores(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          return id;
        }));
      }
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
      this.rulesAfterSave();
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
    if (this.model.Folio === 0) {
      this.Listado_de_Pago_de_ProveedoresForm.reset();
      this.model = new Listado_de_Pago_de_Proveedores(this.fb);
      this.Listado_de_Pago_de_ProveedoresForm = this.model.buildFormGroup();
      this.dataSourcePago_de_Proveedores = new MatTableDataSource<Detalle_de_Listado_de_Pago_de_Proveedores>();
      this.Pago_de_ProveedoresData = [];

    } else {
      this.router.navigate(['views/Listado_de_Pago_de_Proveedores/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }

  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Listado_de_Pago_de_Proveedores/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Proveedor_ExecuteBusinessRules(): void {
    //Proveedor_FieldExecuteBusinessRulesEnd
  }
  No__de_OC_ExecuteBusinessRules(): void {
    //No__de_OC_FieldExecuteBusinessRulesEnd
  }
  Fecha_Requerida_ExecuteBusinessRules(): void {
    //Fecha_Requerida_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
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


    //INICIA - BRID:4118 - Ocultar campos folio y accion - Autor: ANgel Acuña - Actualización: 7/14/2021 2:28:07 PM
    this.brf.HideFieldOfForm(this.Listado_de_Pago_de_ProveedoresForm, "Folio");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Folio");
    this.brf.HideFieldOfForm(this.Listado_de_Pago_de_ProveedoresForm, "Folio");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Folio");
    //TERMINA - BRID:4118


    //INICIA - BRID:4119 - Asignar no requerido a todos los campos - Autor: ANgel Acuña - Actualización: 7/16/2021 6:28:16 PM
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Folio");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Proveedor");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "No__de_OC");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Fecha_Requerida");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Estatus");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Listado_de_Pago_de_Proveedores");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Matricula");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "No__de_Factura");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Nota_de_Credito");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Total_de_Factura_");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Fecha_de_Factura");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Tiempos_de_Pago");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Fecha_de_Pago");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Observaciones");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Solicitud_de_Pago");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "IdSolicitudPago");
    //TERMINA - BRID:4119


    //INICIA - BRID:4151 - Ocultar FolioPrincipal - Autor: ANgel Acuña - Actualización: 7/15/2021 9:53:15 AM
    this.brf.HideFieldOfForm(this.Listado_de_Pago_de_ProveedoresForm, "Folio");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Folio");
    //TERMINA - BRID:4151


    //INICIA - BRID:4209 - Ocultar campo fecha requerida - Autor: ANgel Acuña - Actualización: 7/22/2021 9:52:44 AM
    this.brf.HideFieldOfForm(this.Listado_de_Pago_de_ProveedoresForm, "Fecha_Requerida");
    this.brf.SetNotRequiredControl(this.Listado_de_Pago_de_ProveedoresForm, "Fecha_Requerida");
    //TERMINA - BRID:4209


    //INICIA - BRID:4998 - ocultar campos no necesarios - Autor: Jose Caballero - Actualización: 8/18/2021 11:07:45 AM
    this.brf.HideFieldofMultirenglon(this.Pago_de_ProveedoresColumns, "IdSolicitudPago");
    this.brf.HideFieldofMultirenglon(this.Pago_de_ProveedoresColumns, "EsPrincipal");
    //TERMINA - BRID:4998

    //rulesOnInit_ExecuteBusinessRulesEnd


    //Manual - Ocultar Columnas
    this.brf.HideFieldofMultirenglon(this.Pago_de_ProveedoresColumns, "Matricula");

    this.getDataTable();

  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    //rulesAfterSave_ExecuteBusinessRulesEnd
  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas

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


  //#region Obtener DataTable
  getDataTable() {

    this.sqlModel.query = `EXEC uspPagodeProveedoresDetail '${this.getFilters()}' `

    this.spartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      if (result == null || result.length == 0) {
        this.generateMatTable([])
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

      this.generateMatTable(data)

    });

  }
  //#endregion


  //#region Generar MatTable
  generateMatTable(array) {
    this.dataSourcePago_de_Proveedores = new MatTableDataSource(array);
    this.dataSourcePago_de_Proveedores.paginator = this.paginator;
    this.dataSourcePago_de_Proveedores.sort = this.sort;
  }
  //#endregion


  //#region Filtros de Consulta
  getFilters(): string {
    var where = ""

    if (this.Listado_de_Pago_de_ProveedoresForm.controls["Proveedor"].value) {
      where += `AND Proveedor = ''${this.Listado_de_Pago_de_ProveedoresForm.controls["Proveedor"].value}''`
    }
    if (this.Listado_de_Pago_de_ProveedoresForm.controls["No__de_OC"].value) {
      where += `AND No__de_OC = ''${this.Listado_de_Pago_de_ProveedoresForm.controls["No__de_OC"].value}''`
    }
    if (this.Listado_de_Pago_de_ProveedoresForm.controls["Estatus"].value) {
      where += `AND Estatus = ''${this.Listado_de_Pago_de_ProveedoresForm.controls["Estatus"].value}''`
    }

    return where
  }
  //#endregion


  //#region Abrir Ventana Ingreso de Costos
  openWindowIngreso_de_Costos(element: any) {
    let itemSelected = []
    itemSelected.push(element)

    this.localStorageHelper.setItemToLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresSolcitud_de_Pago", JSON.stringify(itemSelected));
    this.localStorageHelper.setItemToLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresOption", "Item");

    this.localStorageHelper.setItemToLocalStorage("IsWindowIngresoCosto", "0");
    const stringLista = this.localStorageHelper.getItemFromLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresSolcitud_de_Pago");

    let url = ""

    if (element.IdSolicitudPago == null) {
      url = this.router.serializeUrl(this.router.createUrlTree([`#/Ingreso_de_Costos/add`]));
    }
    else {
      url = this.router.serializeUrl(this.router.createUrlTree([`#/Ingreso_de_Costos/edit/${element.IdSolicitudPago}`]));
    }

    this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
    this.openWindows;
  }
  //#endregion


  //#region Refrescar Vista
  startTimer() {
    this.timerStart = true;
    this.interval = setInterval(() => {
      let Reset = +this.localStorageHelper.getItemFromLocalStorage("IsResetListado_de_Pago_de_Proveedores");
      if (Reset == 1) {
        this.localStorageHelper.setItemToLocalStorage("IsResetListado_de_Pago_de_Proveedores", "0");

        this.getDataTable();

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


  //#region Funcionalidad de Solicitud de Pago
  fnSolicitudDePago(element: any) {
    console.log(element)
    if (element.IdSolicitudPago == null) {
      let message = "Favor de completar todos los datos. Fecha de factura,No de factura,Total de factura"
      this.ShowMessageType(message, "warning")
    }
    else {

      this.sqlModel.query = `EXEC usp_Listado_de_Pago_Proveedores_Pago_a_proveedores ${element.Folio}`

      this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
        next: (response) => {
        },
        error: (e) => console.error(e),
        complete: () => {
          this.getDataTable();

        },
      })

    }
  }
  //#endregion


  //#region Funcionalidad Agregar Solicitud de Pago
  addSolicitudPago(element: any) {

    let itemSelected = []
    itemSelected.push(element)

    this.localStorageHelper.setItemToLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresSolcitud_de_Pago", JSON.stringify(itemSelected));
    this.localStorageHelper.setItemToLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresOption", "NewItem");

    this.localStorageHelper.setItemToLocalStorage("IsWindowIngresoCosto", "0");

    let url = ""

    url = this.router.serializeUrl(this.router.createUrlTree([`#/Ingreso_de_Costos/add`]));

    this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
    this.openWindows;
  }
  //#endregion


  //#region Seleccionar Generar OC
  onChangeSolicitud_de_Pago(event: any, element: any) {
    element.Solicitud_de_Pago = event.checked
  }
  //#endregion


  //#region Eliminar Solicitud de Pago
  deleteSolicitudPago(element) {

    this._messages.confirmation("¿Está seguro de que desea eliminar este registro?", "")
      .then(() => {
        this.brf.EvaluaQuery(` exec uspRemListado_de_Pago_Proveedor_facturacion  ${element.IdSolicitudPago}`, 1, "ABC123");
        //this.brf.EvaluaQuery(` exec uspRemListado_de_Pago_Proveedor_facturacion  ${element.Partida}`, 1, "ABC123");
        //this.brf.EvaluaQuery(` DELETE Ingreso_de_Costos WHERE Folio = ${element.IdSolicitudPago}`, 1, "ABC123");
        this.getDataTable();
      });

  }
  //#endregion


  //#region Funcionalidad de Solicitud de Pago Multiple
  GenerarSolicitudPagoMultiple() {
    let array = []
    let proveedores = []
    let message: string = ""
    let bValidoDatos: boolean = true

    array = this.dataSourcePago_de_Proveedores.data.filter(element => element.Solicitud_de_Pago);
    if (array.length > 0) {

      array.forEach(element => {
        proveedores.push(element.Proveedor)
      });

      let proveedoresUnicos = proveedores.filter((valor, indice, arreglo) => {
        return arreglo.indexOf(valor) == indice;
      })

      if (proveedoresUnicos.length > 1) {
        message = "Selecione items de un solo proveedor"
        this.ShowMessageType(message, "warning")
      }
      else {
        array.forEach(element => {
          if (element.IdSolicitudPago == null) {
            bValidoDatos = false;
            let message = "Favor de completar todos los datos. Fecha de factura,No de factura,Total de factura"
            this.ShowMessageType(message, "warning")
          }
        });

        if (bValidoDatos) {
          array.forEach((element, index) => {

            this.sqlModel.query = `EXEC usp_Listado_de_Pago_Proveedores_Pago_a_proveedores ${element.Folio}`

            this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
              next: (response) => {
              },
              error: (e) => console.error(e),
              complete: () => {
                if (index == array.length - 1) {
                  this.getDataTable();
                }
              },
            })

          });
        }
      }
    }
    else {
      let message = "Seleccionar las solicitudes de pago que desea realizar el Pago Multiple."
      this.ShowMessageType(message, "warning")
    }

  }
  //#endregion


  //#region Registro Factura
  fnRegistroFactura() {
    let array = []
    let proveedores = []
    let message: string = ""
    let bValidoDatos: boolean = true

    array = this.dataSourcePago_de_Proveedores.data.filter(element => element.Solicitud_de_Pago);
    if (array.length > 0) {

      array.forEach(element => {
        proveedores.push(element.Proveedor)
      });

      let proveedoresUnicos = proveedores.filter((valor, indice, arreglo) => {
        return arreglo.indexOf(valor) == indice;
      })

      if (proveedoresUnicos.length > 1) {
        message = "Selecione items de un solo proveedor"
        this.ShowMessageType(message, "warning")
      }
      else {
        array.forEach(element => {
          if (element.IdSolicitudPago == null) {
            bValidoDatos = false;
            let message = "Favor de completar todos los datos. Fecha de factura,No de factura,Total de factura"
            this.ShowMessageType(message, "warning")
          }
        });

        if (bValidoDatos) {

          this.localStorageHelper.setItemToLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresSolcitud_de_Pago", JSON.stringify(array));
          this.localStorageHelper.setItemToLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresOption", "Multiple Item");

          this.localStorageHelper.setItemToLocalStorage("IsWindowIngresoCosto", "0");
          const stringLista = this.localStorageHelper.getItemFromLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresSolcitud_de_Pago");

          let url = this.router.serializeUrl(this.router.createUrlTree([`#/Ingreso_de_Costos/add`]));

          this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
          this.openWindows;

        }
      }
    }
    else {
      let message = "Seleccionar las solicitudes de pago que desea Registrar Factura."
      this.ShowMessageType(message, "warning")
    }
  }
  //#endregion


  //#region Funcionalidad Boton Limpiar Filtros
  fnClearFilter() {
    this.Listado_de_Pago_de_ProveedoresForm.reset();
    this.getDataTable();
    this.setDataFromSelects();
  }
  //#endregion


  //#region Completar información de Selects
  setDataFromSelects(): void {
    this.searchProveedor();
    this.searchNo__de_OC();
    this.searchEstatus();
  }
  //#endregion


  //#region Consulta de Proveedores
  searchProveedor(term?: string) {
    this.isLoadingProveedor = true;
    if (term == "" || term == null || term == undefined) {
      this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingProveedor = false;

        let response = result["Creacion_de_Proveedoress"].filter(element => element.Razon_social != null);

        this.listaProveedor = of(response);
      }, error => {
        this.isLoadingProveedor = false;
        this.listaProveedor = of([]);
      });;
    }
    else if (term != "") {
      this.Creacion_de_ProveedoresService.listaSelAll(0, 20, "Creacion_de_Proveedores.Razon_social like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingProveedor = false;

        let response = result["Creacion_de_Proveedoress"].filter(element => element.Razon_social != null);

        this.listaProveedor = of(response);
      }, error => {
        this.isLoadingProveedor = false;
        this.listaProveedor = of([]);
      });;
    }
  }
  //#endregion


  //#region Consulta de No. de OC
  searchNo__de_OC(term?: string) {
    this.isLoadingNo__de_OC = true;
    if (term == "" || term == null || term == undefined) {
      this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingNo__de_OC = false;

        let response = result["Generacion_de_Orden_de_Comprass"].filter(element => element.FolioGeneracionOC != null);

        this.listaNo__de_OC = of(response);
      }, error => {
        this.isLoadingNo__de_OC = false;
        this.listaNo__de_OC = of([]);
      });;
    }
    else if (term != "") {
      this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingNo__de_OC = false;

        let response = result["Generacion_de_Orden_de_Comprass"].filter(element => element.FolioGeneracionOC != null);

        this.listaNo__de_OC = of(response);
      }, error => {
        this.isLoadingNo__de_OC = false;
        this.listaNo__de_OC = of([]);
      });;
    }
  }
  //#endregion


  //#region Consulta de Estatuses
  searchEstatus(term?: string) {
    this.isLoadingEstatus = true;
    if (term == "" || term == null || term == undefined) {
      this.Estatus_de_SeguimientoService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingEstatus = false;

        let response = result["Estatus_de_Seguimientos"].filter(element => element.Descripcion != null);

        this.listaEstatus = of(response);
      }, error => {
        this.isLoadingEstatus = false;
        this.listaEstatus = of([]);
      });;
    }
    else if (term != "") {
      this.Estatus_de_SeguimientoService.listaSelAll(0, 20, "Estatus_de_Seguimiento.Descripcion like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingEstatus = false;

        let response = result["Estatus_de_Seguimientos"].filter(element => element.Descripcion != null);

        this.listaEstatus = of(response);
      }, error => {
        this.isLoadingEstatus = false;
        this.listaEstatus = of([]);
      });;
    }
  }
  //#endregion

}
