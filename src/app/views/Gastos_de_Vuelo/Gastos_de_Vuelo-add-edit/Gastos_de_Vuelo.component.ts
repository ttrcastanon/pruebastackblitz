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
import { off } from 'process';
import * as ts from 'typescript';

import { GeneralService } from 'src/app/api-services/general.service';
import { Gastos_de_VueloService } from 'src/app/api-services/Gastos_de_Vuelo.service';
import { Gastos_de_Vuelo } from 'src/app/models/Gastos_de_Vuelo';
import { Tipo_de_Ingreso_de_GastoService } from 'src/app/api-services/Tipo_de_Ingreso_de_Gasto.service';
import { Tipo_de_Ingreso_de_Gasto } from 'src/app/models/Tipo_de_Ingreso_de_Gasto';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Detalle_Anticipo_de_ViaticosService } from 'src/app/api-services/Detalle_Anticipo_de_Viaticos.service';
import { Detalle_Anticipo_de_Viaticos } from 'src/app/models/Detalle_Anticipo_de_Viaticos';
import { MonedaService } from 'src/app/api-services/Moneda.service';
import { Moneda } from 'src/app/models/Moneda';

import { Estatus_de_Gastos_de_VueloService } from 'src/app/api-services/Estatus_de_Gastos_de_Vuelo.service';
import { Estatus_de_Gastos_de_Vuelo } from 'src/app/models/Estatus_de_Gastos_de_Vuelo';
import { Detalle_Gastos_EmpleadoService } from 'src/app/api-services/Detalle_Gastos_Empleado.service';
import { Detalle_Gastos_Empleado } from 'src/app/models/Detalle_Gastos_Empleado';
import { Concepto_de_Gasto_de_EmpleadoService } from 'src/app/api-services/Concepto_de_Gasto_de_Empleado.service';
import { Concepto_de_Gasto_de_Empleado } from 'src/app/models/Concepto_de_Gasto_de_Empleado';
import { Forma_de_PagoService } from 'src/app/api-services/Forma_de_Pago.service';
import { Forma_de_Pago } from 'src/app/models/Forma_de_Pago';
import { Resultado_de_Autorizacion_de_VueloService } from 'src/app/api-services/Resultado_de_Autorizacion_de_Vuelo.service';
import { Resultado_de_Autorizacion_de_Vuelo } from 'src/app/models/Resultado_de_Autorizacion_de_Vuelo';

import { Detalle_Gastos_AeronaveService } from 'src/app/api-services/Detalle_Gastos_Aeronave.service';
import { Detalle_Gastos_Aeronave } from 'src/app/models/Detalle_Gastos_Aeronave';
import { Concepto_de_Gasto_de_AeronaveService } from 'src/app/api-services/Concepto_de_Gasto_de_Aeronave.service';
import { Concepto_de_Gasto_de_Aeronave } from 'src/app/models/Concepto_de_Gasto_de_Aeronave';

import { Detalle_Gastos_ResumenService } from 'src/app/api-services/Detalle_Gastos_Resumen.service';
import { Detalle_Gastos_Resumen } from 'src/app/models/Detalle_Gastos_Resumen';


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

@Component({
  selector: 'app-Gastos_de_Vuelo',
  templateUrl: './Gastos_de_Vuelo.component.html',
  styleUrls: ['./Gastos_de_Vuelo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Gastos_de_VueloComponent implements OnInit, AfterViewInit {
MRaddResumen_de_Gastos: boolean = false;
MRaddConcepto_de_Gasto_de_Aeronave: boolean = false;
MRaddConcepto_de_Gasto_por_Empleado: boolean = false;
MRaddAnticipo_de_Viaticos: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Gastos_de_VueloForm: FormGroup;
  public Editor = ClassicEditor;
  model: Gastos_de_Vuelo;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varTipo_de_Ingreso_de_Gasto: Tipo_de_Ingreso_de_Gasto[] = [];
  optionsOrden_de_Trabajo: Observable<Orden_de_Trabajo[]>;
  hasOptionsOrden_de_Trabajo: boolean;
  isLoadingOrden_de_Trabajo: boolean;
  optionsNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
  hasOptionsNumero_de_Vuelo: boolean;
  isLoadingNumero_de_Vuelo: boolean;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  optionsTramo_de_Vuelo: Observable<Registro_de_vuelo[]>;
  hasOptionsTramo_de_Vuelo: boolean;
  isLoadingTramo_de_Vuelo: boolean;
  optionsSalida: Observable<Aeropuertos[]>;
  hasOptionsSalida: boolean;
  isLoadingSalida: boolean;
  optionsDestino: Observable<Aeropuertos[]>;
  hasOptionsDestino: boolean;
  isLoadingDestino: boolean;
  optionsEmpleado: Observable<Spartan_User[]>;
  hasOptionsEmpleado: boolean;
  isLoadingEmpleado: boolean;
  IsDisableEdit: boolean;
  public varMoneda: Moneda[] = [];


  public varEstatus_de_Gastos_de_Vuelo: Estatus_de_Gastos_de_Vuelo[] = [];
  public varConcepto_de_Gasto_de_Empleado: Concepto_de_Gasto_de_Empleado[] = [];
  public varForma_de_Pago: Forma_de_Pago[] = [];
  Comprobante_Detalle_Gastos_Empleado: string[] = [];
  public varResultado_de_Autorizacion_de_Vuelo: Resultado_de_Autorizacion_de_Vuelo[] = [];


  public varConcepto_de_Gasto_de_Aeronave: Concepto_de_Gasto_de_Aeronave[] = [];
  Comprobante_Detalle_Gastos_Aeronave: string[] = [];





  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('PaginadorAnticipos', { read: MatPaginator }) paginadorAnticipos: MatPaginator;
  @ViewChild('PaginadorGastosEmpleados', { read: MatPaginator }) paginadorGastosEmpleados: MatPaginator;
  @ViewChild('PaginadorGastosAeronaves', { read: MatPaginator }) paginadorGastosAeronaves: MatPaginator;
  @ViewChild('PaginadorResumenGastos', { read: MatPaginator }) paginadorResumenGastos: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceAnticipo_de_Viaticos = new MatTableDataSource<Detalle_Anticipo_de_Viaticos>();
  Anticipo_de_ViaticosColumns = [
    { def: 'actions', hide: false },
    { def: 'Monto', hide: false },
    { def: 'Moneda', hide: false },

  ];
  Anticipo_de_ViaticosData: Detalle_Anticipo_de_Viaticos[] = [];
  dataSourceConcepto_de_Gasto_por_Empleado = new MatTableDataSource<Detalle_Gastos_Empleado>();
  Concepto_de_Gasto_por_EmpleadoColumns = [
    { def: 'actions', hide: false },
    { def: 'Fecha_de_gasto', hide: false },
    { def: 'Concepto', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Monto', hide: false },
    { def: 'Moneda', hide: false },
    { def: 'Forma_de_Pago', hide: false },
    { def: 'Comprobante', hide: false },
    { def: 'Autorizacion', hide: false },
    { def: 'Observaciones', hide: false },

  ];
  Concepto_de_Gasto_por_EmpleadoData: Detalle_Gastos_Empleado[] = [];
  dataSourceConcepto_de_Gasto_de_Aeronave = new MatTableDataSource<Detalle_Gastos_Aeronave>();
  Concepto_de_Gasto_de_AeronaveColumns = [
    { def: 'actions', hide: false },
    { def: 'Fecha_de_gasto', hide: false },
    { def: 'Concepto_Aeronave', hide: false },
    { def: 'Descripcion_Aeronave', hide: false },
    { def: 'Monto_Aeronave', hide: false },
    { def: 'Moneda_Aeronave', hide: false },
    { def: 'Forma_de_Pago_Aeronave', hide: false },
    { def: 'Comprobante_Aeronave', hide: false },
    { def: 'Autorizacion_Aeronave', hide: false },
    { def: 'Observaciones_Aeronave', hide: false },

  ];
  Concepto_de_Gasto_de_AeronaveData: Detalle_Gastos_Aeronave[] = [];
  dataSourceResumen_de_Gastos = new MatTableDataSource<Detalle_Gastos_Resumen>();
  Resumen_de_GastosColumns = [
    { def: 'actions', hide: true },
    { def: 'Concepto', hide: false },
    { def: 'MXN', hide: false },
    { def: 'USD', hide: false },
    { def: 'EUR', hide: false },
    { def: 'LIBRA', hide: false },
    { def: 'CAD', hide: false },
  ];


  Resumen_de_GastosData: Detalle_Gastos_Resumen[] = [];

  today = new Date;
  consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Gastos_de_VueloService: Gastos_de_VueloService,
    private Tipo_de_Ingreso_de_GastoService: Tipo_de_Ingreso_de_GastoService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeronaveService: AeronaveService,
    private Registro_de_vueloService: Registro_de_vueloService,
    private AeropuertosService: AeropuertosService,
    private Spartan_UserService: Spartan_UserService,
    private Detalle_Anticipo_de_ViaticosService: Detalle_Anticipo_de_ViaticosService,
    private MonedaService: MonedaService,

    private Estatus_de_Gastos_de_VueloService: Estatus_de_Gastos_de_VueloService,
    private Detalle_Gastos_EmpleadoService: Detalle_Gastos_EmpleadoService,
    private Concepto_de_Gasto_de_EmpleadoService: Concepto_de_Gasto_de_EmpleadoService,
    private Forma_de_PagoService: Forma_de_PagoService,
    private Resultado_de_Autorizacion_de_VueloService: Resultado_de_Autorizacion_de_VueloService,

    private Detalle_Gastos_AeronaveService: Detalle_Gastos_AeronaveService,
    private Concepto_de_Gasto_de_AeronaveService: Concepto_de_Gasto_de_AeronaveService,

    private Detalle_Gastos_ResumenService: Detalle_Gastos_ResumenService,


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
    renderer: Renderer2) {
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Gastos_de_Vuelo(this.fb);
    this.Gastos_de_VueloForm = this.model.buildFormGroup();
    this.Anticipo_de_ViaticosItems.removeAt(0);
    this.Concepto_de_Gasto_por_EmpleadoItems.removeAt(0);
    this.Concepto_de_Gasto_de_AeronaveItems.removeAt(0);
    this.Resumen_de_GastosItems.removeAt(0);
    this.IsDisableEdit = true;

    this.Gastos_de_VueloForm.get('Folio').disable();
    this.Gastos_de_VueloForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  getCountAnticipos(): number {
    return this.dataSourceAnticipo_de_Viaticos.data.length;
  }

  getCountGastosEmpleado(): number {
    return this.dataSourceConcepto_de_Gasto_por_Empleado.data.length;
  }

  getCountGastosAeronave(): number {
    return this.dataSourceConcepto_de_Gasto_de_Aeronave.data.length;
  }

  getCountResumenGastos(): number {
    return this.dataSourceResumen_de_Gastos.data.length;
  }

  ngAfterViewInit(): void {
    this.dataSourceAnticipo_de_Viaticos.paginator = this.paginadorAnticipos;
    this.dataSourceConcepto_de_Gasto_por_Empleado.paginator = this.paginadorGastosEmpleados;
    this.dataSourceConcepto_de_Gasto_de_Aeronave.paginator = this.paginadorGastosAeronaves;
    this.dataSourceResumen_de_Gastos.paginator = this.paginadorResumenGastos;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Anticipo_de_ViaticosColumns.splice(0, 1);
          this.Concepto_de_Gasto_por_EmpleadoColumns.splice(0, 1);
          this.Concepto_de_Gasto_de_AeronaveColumns.splice(0, 1);
          this.Resumen_de_GastosColumns.splice(0, 1);

          this.Gastos_de_VueloForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Gastos_de_Vuelo)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Gastos_de_VueloForm, 'Orden_de_Trabajo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gastos_de_VueloForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gastos_de_VueloForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gastos_de_VueloForm, 'Tramo_de_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gastos_de_VueloForm, 'Salida', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gastos_de_VueloForm, 'Destino', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gastos_de_VueloForm, 'Empleado', [CustomValidators.autocompleteObjectValidator(), Validators.required]);



    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Gastos_de_VueloService.listaSelAll(0, 1, 'Gastos_de_Vuelo.Folio=' + id).toPromise();
    if (result.Gastos_de_Vuelos.length > 0) {
      let fAnticipo_de_Viaticos = await this.Detalle_Anticipo_de_ViaticosService.listaSelAll(0, 1000, 'Gastos_de_Vuelo.Folio=' + id).toPromise();
      this.Anticipo_de_ViaticosData = fAnticipo_de_Viaticos.Detalle_Anticipo_de_Viaticoss;
      this.loadAnticipo_de_Viaticos(fAnticipo_de_Viaticos.Detalle_Anticipo_de_Viaticoss);
      this.dataSourceAnticipo_de_Viaticos = new MatTableDataSource(fAnticipo_de_Viaticos.Detalle_Anticipo_de_Viaticoss);
      this.dataSourceAnticipo_de_Viaticos.paginator = this.paginadorAnticipos;
      this.dataSourceAnticipo_de_Viaticos.sort = this.sort;
      let fConcepto_de_Gasto_por_Empleado = await this.Detalle_Gastos_EmpleadoService.listaSelAll(0, 1000, 'Gastos_de_Vuelo.Folio=' + id).toPromise();

      fConcepto_de_Gasto_por_Empleado.Detalle_Gastos_Empleados.forEach(async element => {
        element.Comprobante_Spartane_File = await this.brf.EvaluaQueryAsync(`SELECT ISNULL(Description, '') FROM Spartan_File WHERE File_Id = ${element.Comprobante}`, 1, "ABC123");
      });

      this.Concepto_de_Gasto_por_EmpleadoData = fConcepto_de_Gasto_por_Empleado.Detalle_Gastos_Empleados;
      this.loadConcepto_de_Gasto_por_Empleado(fConcepto_de_Gasto_por_Empleado.Detalle_Gastos_Empleados);
      this.dataSourceConcepto_de_Gasto_por_Empleado = new MatTableDataSource(fConcepto_de_Gasto_por_Empleado.Detalle_Gastos_Empleados);
      this.dataSourceConcepto_de_Gasto_por_Empleado.paginator = this.paginadorGastosEmpleados;
      this.dataSourceConcepto_de_Gasto_por_Empleado.sort = this.sort;
      let fConcepto_de_Gasto_de_Aeronave = await this.Detalle_Gastos_AeronaveService.listaSelAll(0, 1000, 'Gastos_de_Vuelo.Folio=' + id).toPromise();

      fConcepto_de_Gasto_de_Aeronave.Detalle_Gastos_Aeronaves.forEach(async element => {
        element.Comprobante_Spartane_File = await this.brf.EvaluaQueryAsync(`SELECT ISNULL(Description, '') FROM Spartan_File WHERE File_Id = ${element.Comprobante}`, 1, "ABC123");
      });

      this.Concepto_de_Gasto_de_AeronaveData = fConcepto_de_Gasto_de_Aeronave.Detalle_Gastos_Aeronaves;
      this.loadConcepto_de_Gasto_de_Aeronave(fConcepto_de_Gasto_de_Aeronave.Detalle_Gastos_Aeronaves);
      this.dataSourceConcepto_de_Gasto_de_Aeronave = new MatTableDataSource(fConcepto_de_Gasto_de_Aeronave.Detalle_Gastos_Aeronaves);
      this.dataSourceConcepto_de_Gasto_de_Aeronave.paginator = this.paginadorGastosAeronaves;
      this.dataSourceConcepto_de_Gasto_de_Aeronave.sort = this.sort;
      let fResumen_de_Gastos = await this.Detalle_Gastos_ResumenService.listaSelAll(0, 1000, 'Gastos_de_Vuelo.Folio=' + id).toPromise();
      this.Resumen_de_GastosData = fResumen_de_Gastos.Detalle_Gastos_Resumens;
      this.loadResumen_de_Gastos(fResumen_de_Gastos.Detalle_Gastos_Resumens);
      this.dataSourceResumen_de_Gastos = new MatTableDataSource(fResumen_de_Gastos.Detalle_Gastos_Resumens);
      this.dataSourceResumen_de_Gastos.paginator = this.paginadorResumenGastos;
      this.dataSourceResumen_de_Gastos.sort = this.sort;

      this.model.fromObject(result.Gastos_de_Vuelos[0]);
      this.Gastos_de_VueloForm.get('Orden_de_Trabajo').setValue(
        result.Gastos_de_Vuelos[0].Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
        { onlySelf: false, emitEvent: true }
      );
      this.Gastos_de_VueloForm.get('Numero_de_Vuelo').setValue(
        result.Gastos_de_Vuelos[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        { onlySelf: false, emitEvent: true }
      );
      this.Gastos_de_VueloForm.get('Matricula').setValue(
        result.Gastos_de_Vuelos[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').setValue(
        result.Gastos_de_Vuelos[0].Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo,
        { onlySelf: false, emitEvent: true }
      );
      this.Gastos_de_VueloForm.get('Salida').setValue(
        result.Gastos_de_Vuelos[0].Salida_Aeropuertos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Gastos_de_VueloForm.get('Destino').setValue(
        result.Gastos_de_Vuelos[0].Destino_Aeropuertos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Gastos_de_VueloForm.get('Empleado').setValue(
        result.Gastos_de_Vuelos[0].Empleado_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );

      this.Gastos_de_VueloForm.markAllAsTouched();
      this.Gastos_de_VueloForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Anticipo_de_ViaticosItems() {
    return this.Gastos_de_VueloForm.get('Detalle_Anticipo_de_ViaticosItems') as FormArray;
  }

  getAnticipo_de_ViaticosColumns(): string[] {
    return this.Anticipo_de_ViaticosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadAnticipo_de_Viaticos(Anticipo_de_Viaticos: Detalle_Anticipo_de_Viaticos[]) {
    Anticipo_de_Viaticos.forEach(element => {
      this.addAnticipo_de_Viaticos(element);
    });
  }

  addAnticipo_de_ViaticosToMR() {
    const Anticipo_de_Viaticos = new Detalle_Anticipo_de_Viaticos(this.fb);
    this.Anticipo_de_ViaticosData.push(this.addAnticipo_de_Viaticos(Anticipo_de_Viaticos));
    this.dataSourceAnticipo_de_Viaticos.data = this.Anticipo_de_ViaticosData;
    Anticipo_de_Viaticos.edit = true;
    Anticipo_de_Viaticos.isNew = true;
    const length = this.dataSourceAnticipo_de_Viaticos.data.length;
    const index = length - 1;
    const formAnticipo_de_Viaticos = this.Anticipo_de_ViaticosItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceAnticipo_de_Viaticos.data.filter(d => !d.IsDeleted).length / this.paginadorAnticipos.pageSize);
    if (page !== this.paginadorAnticipos.pageIndex) {
      this.paginadorAnticipos.pageIndex = page;
    }

    this.Anticipo_de_ViaticosRulesForMR(index);
  }

  Anticipo_de_ViaticosRulesForMR(index) {
    this.brf.SetDisabledControlMR(this.Anticipo_de_ViaticosItems, index, "Moneda");
  }

  closeWindowCancel(): void {
    setTimeout(() => { window.close(); }, 1000);
  }
  closeWindowSave(): void {
    //setTimeout(()=>{ window.close();}, 5000);
  }

  addAnticipo_de_Viaticos(entity: Detalle_Anticipo_de_Viaticos) {
    const Anticipo_de_Viaticos = new Detalle_Anticipo_de_Viaticos(this.fb);
    this.Anticipo_de_ViaticosItems.push(Anticipo_de_Viaticos.buildFormGroup());
    if (entity) {
      Anticipo_de_Viaticos.fromObject(entity);
    }
    return entity;
  }

  Anticipo_de_ViaticosItemsByFolio(Folio: number): FormGroup {
    return (this.Gastos_de_VueloForm.get('Detalle_Anticipo_de_ViaticosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Anticipo_de_ViaticosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceAnticipo_de_Viaticos.data.indexOf(element);
    let fb = this.Anticipo_de_ViaticosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteAnticipo_de_Viaticos(element: any) {
    let index = this.dataSourceAnticipo_de_Viaticos.data.indexOf(element);
    this.Anticipo_de_ViaticosData[index].IsDeleted = true;
    this.dataSourceAnticipo_de_Viaticos.data = this.Anticipo_de_ViaticosData;
    this.dataSourceAnticipo_de_Viaticos.data.splice(index, 1);
    this.dataSourceAnticipo_de_Viaticos._updateChangeSubscription();
    index = this.dataSourceAnticipo_de_Viaticos.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorAnticipos.pageSize);
    if (page !== this.paginadorAnticipos.pageIndex) {
      this.paginadorAnticipos.pageIndex = page;
    }
  }

  cancelEditAnticipo_de_Viaticos(element: any) {
    let index = this.dataSourceAnticipo_de_Viaticos.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Anticipo_de_ViaticosData[index].IsDeleted = true;
      this.dataSourceAnticipo_de_Viaticos.data = this.Anticipo_de_ViaticosData;
      this.dataSourceAnticipo_de_Viaticos.data.splice(index, 1);
      this.dataSourceAnticipo_de_Viaticos._updateChangeSubscription();
      index = this.Anticipo_de_ViaticosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorAnticipos.pageSize);
      if (page !== this.paginadorAnticipos.pageIndex) {
        this.paginadorAnticipos.pageIndex = page;
      }
    }
  }

  async saveAnticipo_de_Viaticos(element: any) {
    const index = this.dataSourceAnticipo_de_Viaticos.data.indexOf(element);
    const formAnticipo_de_Viaticos = this.Anticipo_de_ViaticosItems.controls[index] as FormGroup;
    this.Anticipo_de_ViaticosData[index].Monto = formAnticipo_de_Viaticos.value.Monto;
    this.Anticipo_de_ViaticosData[index].Moneda = formAnticipo_de_Viaticos.controls['Moneda'].value;
    this.Anticipo_de_ViaticosData[index].Moneda_Moneda = formAnticipo_de_Viaticos.value.Moneda !== '' ?
      this.varMoneda.filter(d => d.Clave === formAnticipo_de_Viaticos.controls['Moneda'].value)[0] : null;

    this.Anticipo_de_ViaticosData[index].isNew = false;
    this.dataSourceAnticipo_de_Viaticos.data = this.Anticipo_de_ViaticosData;
    this.dataSourceAnticipo_de_Viaticos._updateChangeSubscription();
    this.calculateResumenGastos();
  }

  editAnticipo_de_Viaticos(element: any) {
    const index = this.dataSourceAnticipo_de_Viaticos.data.indexOf(element);
    const formAnticipo_de_Viaticos = this.Anticipo_de_ViaticosItems.controls[index] as FormGroup;

    element.edit = true;

    this.Anticipo_de_ViaticosRulesForMR(index);
  }

  async saveDetalle_Anticipo_de_Viaticos(Folio: number) {
    this.dataSourceAnticipo_de_Viaticos.data.forEach(async (d, index) => {
      const data = this.Anticipo_de_ViaticosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Gastos_de_Vuelo = Folio;


      if (model.Folio === 0) {
        // Add Anticipo de Viáticos
        let response = await this.Detalle_Anticipo_de_ViaticosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formAnticipo_de_Viaticos = this.Anticipo_de_ViaticosItemsByFolio(model.Folio);
        if (formAnticipo_de_Viaticos.dirty) {
          // Update Anticipo de Viáticos
          let response = await this.Detalle_Anticipo_de_ViaticosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Anticipo de Viáticos
        await this.Detalle_Anticipo_de_ViaticosService.delete(model.Folio).toPromise();
      }
    });
  }


  get Concepto_de_Gasto_por_EmpleadoItems() {
    return this.Gastos_de_VueloForm.get('Detalle_Gastos_EmpleadoItems') as FormArray;
  }

  getConcepto_de_Gasto_por_EmpleadoColumns(): string[] {
    return this.Concepto_de_Gasto_por_EmpleadoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadConcepto_de_Gasto_por_Empleado(Concepto_de_Gasto_por_Empleado: Detalle_Gastos_Empleado[]) {
    Concepto_de_Gasto_por_Empleado.forEach(element => {
      this.addConcepto_de_Gasto_por_Empleado(element);
    });
  }

  addConcepto_de_Gasto_por_EmpleadoToMR() {
    const Concepto_de_Gasto_por_Empleado = new Detalle_Gastos_Empleado(this.fb);
    this.Concepto_de_Gasto_por_EmpleadoData.push(this.addConcepto_de_Gasto_por_Empleado(Concepto_de_Gasto_por_Empleado));
    this.dataSourceConcepto_de_Gasto_por_Empleado.data = this.Concepto_de_Gasto_por_EmpleadoData;
    Concepto_de_Gasto_por_Empleado.edit = true;
    Concepto_de_Gasto_por_Empleado.isNew = true;
    const length = this.dataSourceConcepto_de_Gasto_por_Empleado.data.length;
    const index = length - 1;
    const formConcepto_de_Gasto_por_Empleado = this.Concepto_de_Gasto_por_EmpleadoItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceConcepto_de_Gasto_por_Empleado.data.filter(d => !d.IsDeleted).length / this.paginadorGastosEmpleados.pageSize);
    if (page !== this.paginadorGastosEmpleados.pageIndex) {
      this.paginadorGastosEmpleados.pageIndex = page;
    }
  }

  addConcepto_de_Gasto_por_Empleado(entity: Detalle_Gastos_Empleado) {
    const Concepto_de_Gasto_por_Empleado = new Detalle_Gastos_Empleado(this.fb);
    this.Concepto_de_Gasto_por_EmpleadoItems.push(Concepto_de_Gasto_por_Empleado.buildFormGroup());
    if (entity) {
      Concepto_de_Gasto_por_Empleado.fromObject(entity);
    }
    return entity;
  }

  Concepto_de_Gasto_por_EmpleadoItemsByFolio(Folio: number): FormGroup {
    return (this.Gastos_de_VueloForm.get('Detalle_Gastos_EmpleadoItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Concepto_de_Gasto_por_EmpleadoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceConcepto_de_Gasto_por_Empleado.data.indexOf(element);
    let fb = this.Concepto_de_Gasto_por_EmpleadoItems.controls[index] as FormGroup;
    return fb;
  }

  deleteConcepto_de_Gasto_por_Empleado(element: any) {
    let index = this.dataSourceConcepto_de_Gasto_por_Empleado.data.indexOf(element);
    this.Concepto_de_Gasto_por_EmpleadoData[index].IsDeleted = true;
    this.dataSourceConcepto_de_Gasto_por_Empleado.data = this.Concepto_de_Gasto_por_EmpleadoData;
    this.dataSourceConcepto_de_Gasto_por_Empleado.data.splice(index, 1);
    this.dataSourceConcepto_de_Gasto_por_Empleado._updateChangeSubscription();
    index = this.dataSourceConcepto_de_Gasto_por_Empleado.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorGastosEmpleados.pageSize);
    if (page !== this.paginadorGastosEmpleados.pageIndex) {
      this.paginadorGastosEmpleados.pageIndex = page;
    }
    this.CalculateConceptoEmpleado();
  }

  cancelEditConcepto_de_Gasto_por_Empleado(element: any) {
    let index = this.dataSourceConcepto_de_Gasto_por_Empleado.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Concepto_de_Gasto_por_EmpleadoData[index].IsDeleted = true;
      this.dataSourceConcepto_de_Gasto_por_Empleado.data = this.Concepto_de_Gasto_por_EmpleadoData;
      this.dataSourceConcepto_de_Gasto_por_Empleado.data.splice(index, 1);
      this.dataSourceConcepto_de_Gasto_por_Empleado._updateChangeSubscription();
      index = this.Concepto_de_Gasto_por_EmpleadoData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorGastosEmpleados.pageSize);
      if (page !== this.paginadorGastosEmpleados.pageIndex) {
        this.paginadorGastosEmpleados.pageIndex = page;
      }
    }
    this.CalculateConceptoEmpleado();
  }

  async saveConcepto_de_Gasto_por_Empleado(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_por_Empleado.data.indexOf(element);
    const formConcepto_de_Gasto_por_Empleado = this.Concepto_de_Gasto_por_EmpleadoItems.controls[index] as FormGroup;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Fecha_de_gasto = formConcepto_de_Gasto_por_Empleado.value.Fecha_de_gasto;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Concepto = formConcepto_de_Gasto_por_Empleado.value.Concepto;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Concepto_Concepto_de_Gasto_de_Empleado = formConcepto_de_Gasto_por_Empleado.value.Concepto !== '' ?
      this.varConcepto_de_Gasto_de_Empleado.filter(d => d.Clave === formConcepto_de_Gasto_por_Empleado.value.Concepto)[0] : null;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Descripcion = formConcepto_de_Gasto_por_Empleado.value.Descripcion;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Monto = formConcepto_de_Gasto_por_Empleado.value.Monto;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Moneda = formConcepto_de_Gasto_por_Empleado.value.Moneda;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Moneda_Moneda = formConcepto_de_Gasto_por_Empleado.value.Moneda !== '' ?
      this.varMoneda.filter(d => d.Clave === formConcepto_de_Gasto_por_Empleado.value.Moneda)[0] : null;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Forma_de_Pago = formConcepto_de_Gasto_por_Empleado.value.Forma_de_Pago;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Forma_de_Pago_Forma_de_Pago = formConcepto_de_Gasto_por_Empleado.value.Forma_de_Pago !== '' ?
      this.varForma_de_Pago.filter(d => d.Clave === formConcepto_de_Gasto_por_Empleado.value.Forma_de_Pago)[0] : null;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Autorizacion = formConcepto_de_Gasto_por_Empleado.value.Autorizacion;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Autorizacion_Resultado_de_Autorizacion_de_Vuelo = formConcepto_de_Gasto_por_Empleado.value.Autorizacion !== '' ?
      this.varResultado_de_Autorizacion_de_Vuelo.filter(d => d.Clave === formConcepto_de_Gasto_por_Empleado.value.Autorizacion)[0] : null;
    this.Concepto_de_Gasto_por_EmpleadoData[index].Observaciones = formConcepto_de_Gasto_por_Empleado.value.Observaciones;

    this.Concepto_de_Gasto_por_EmpleadoData[index].isNew = false;
    this.dataSourceConcepto_de_Gasto_por_Empleado.data = this.Concepto_de_Gasto_por_EmpleadoData;
    this.dataSourceConcepto_de_Gasto_por_Empleado._updateChangeSubscription();
    this.CalculateConceptoEmpleado();
  }

  CalculateConceptoEmpleado() {

    let totalEmpleadoMXN = 0;
    let totalEmpleadoUSD = 0;
    let totalEmpleadoEUR = 0;
    let totalEmpleadoCAD = 0;
    let totalEmpleadoLIB = 0;

    this.dataSourceConcepto_de_Gasto_por_Empleado.data.forEach(element => {

      if (element.Moneda == 1 && !element.IsDeleted) { //MXN
        totalEmpleadoMXN = +totalEmpleadoMXN + +element.Monto;
      }
      if (element.Moneda == 2 && !element.IsDeleted) { //USD
        totalEmpleadoUSD = +totalEmpleadoUSD + +element.Monto;
      }
      if (element.Moneda == 3 && !element.IsDeleted) { //EUROS
        totalEmpleadoEUR = +totalEmpleadoEUR + +element.Monto;
      }
      if (element.Moneda == 4 && !element.IsDeleted) { //CAD
        totalEmpleadoCAD = +totalEmpleadoCAD + +element.Monto;
      }
      if (element.Moneda == 5 && !element.IsDeleted) { //LIB
        totalEmpleadoLIB = +totalEmpleadoLIB + +element.Monto;
      }


    });

    this.Gastos_de_VueloForm.get('empleado_total_mxn').setValue(totalEmpleadoMXN);
    this.Gastos_de_VueloForm.get('empleado_total_usd').setValue(totalEmpleadoUSD);
    this.Gastos_de_VueloForm.get('empleado_total_eur').setValue(totalEmpleadoEUR);
    this.Gastos_de_VueloForm.get('empleado_total_libras').setValue(totalEmpleadoLIB);
    this.Gastos_de_VueloForm.get('empleado_total_cad').setValue(totalEmpleadoCAD);

    this.calculateResumenGastos();
  }

  editConcepto_de_Gasto_por_Empleado(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_por_Empleado.data.indexOf(element);
    const formConcepto_de_Gasto_por_Empleado = this.Concepto_de_Gasto_por_EmpleadoItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Gastos_Empleado(Folio: number) {
    this.dataSourceConcepto_de_Gasto_por_Empleado.data.forEach(async (d, index) => {
      const data = this.Concepto_de_Gasto_por_EmpleadoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Gastos_de_Vuelo = Folio;

      const FolioComprobante = await this.saveComprobante_Detalle_Gastos_Empleado(index);
      d.Comprobante = FolioComprobante > 0 ? FolioComprobante : null;
      model.Comprobante = d.Comprobante;

      if (model.Folio === 0) {
        // Add Concepto de Gasto por Empleado
        let response = await this.Detalle_Gastos_EmpleadoService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formConcepto_de_Gasto_por_Empleado = this.Concepto_de_Gasto_por_EmpleadoItemsByFolio(model.Folio);
        if (formConcepto_de_Gasto_por_Empleado.dirty) {
          // Update Concepto de Gasto por Empleado
          let response = await this.Detalle_Gastos_EmpleadoService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Concepto de Gasto por Empleado
        await this.Detalle_Gastos_EmpleadoService.delete(model.Folio).toPromise();
      }
    });
  }

  getComprobante_Detalle_Gastos_Empleado(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_por_Empleado.data.indexOf(element);
    const formDetalle_Gastos_Empleado = this.Concepto_de_Gasto_por_EmpleadoItems.controls[index] as FormGroup;
    return formDetalle_Gastos_Empleado.controls.ComprobanteFile.value && formDetalle_Gastos_Empleado.controls.ComprobanteFile.value !== '' ?
      formDetalle_Gastos_Empleado.controls.ComprobanteFile.value.files[0].name : '';
  }

  async getComprobante_Detalle_Gastos_EmpleadoClick(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_por_Empleado.data.indexOf(element);
    const formDetalle_Gastos_Empleado = this.Concepto_de_Gasto_por_EmpleadoItems.controls[index] as FormGroup;
    if (formDetalle_Gastos_Empleado.controls.ComprobanteFile.valid
      && formDetalle_Gastos_Empleado.controls.ComprobanteFile.dirty) {
      const Comprobante = formDetalle_Gastos_Empleado.controls.ComprobanteFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Comprobante);
      this.helperService.dowloadFileFromArray(byteArray, Comprobante.name);
    }
  }

  removeComprobante_Detalle_Gastos_Empleado(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_por_Empleado.data.indexOf(element);
    this.Comprobante_Detalle_Gastos_Empleado[index] = '';
    this.Concepto_de_Gasto_por_EmpleadoData[index].Comprobante = 0;

    const formDetalle_Gastos_Empleado = this.Concepto_de_Gasto_por_EmpleadoItems.controls[index] as FormGroup;
    if (formDetalle_Gastos_Empleado.controls.ComprobanteFile.valid
      && formDetalle_Gastos_Empleado.controls.ComprobanteFile.dirty) {
      formDetalle_Gastos_Empleado.controls.ComprobanteFile = null;
    }
  }

  async saveComprobante_Detalle_Gastos_Empleado(index: number): Promise<number> {
    const formConcepto_de_Gasto_por_Empleado = this.Concepto_de_Gasto_por_EmpleadoItems.controls[index] as FormGroup;
    if (formConcepto_de_Gasto_por_Empleado.controls.ComprobanteFile.valid
      && formConcepto_de_Gasto_por_Empleado.controls.ComprobanteFile.dirty) {
      const Comprobante = formConcepto_de_Gasto_por_Empleado.controls.ComprobanteFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Comprobante);
      const spartanFile = {
        File: byteArray,
        Description: Comprobante.name,
        Date_Time: Comprobante.lastModifiedDate,
        File_Size: Comprobante.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return 0;
    }
  }

  hasComprobante_Detalle_Gastos_Empleado(element) {
    return this.getComprobante_Detalle_Gastos_Empleado(element) !== '' ||
      (element.Comprobante_Spartane_File && element.Comprobante_Spartane_File.File_Id > 0);
  }

  get Concepto_de_Gasto_de_AeronaveItems() {
    return this.Gastos_de_VueloForm.get('Detalle_Gastos_AeronaveItems') as FormArray;
  }

  getConcepto_de_Gasto_de_AeronaveColumns(): string[] {
    return this.Concepto_de_Gasto_de_AeronaveColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadConcepto_de_Gasto_de_Aeronave(Concepto_de_Gasto_de_Aeronave: Detalle_Gastos_Aeronave[]) {
    Concepto_de_Gasto_de_Aeronave.forEach(element => {
      this.addConcepto_de_Gasto_de_Aeronave(element);
    });
  }

  addConcepto_de_Gasto_de_AeronaveToMR() {
    const Concepto_de_Gasto_de_Aeronave = new Detalle_Gastos_Aeronave(this.fb);
    this.Concepto_de_Gasto_de_AeronaveData.push(this.addConcepto_de_Gasto_de_Aeronave(Concepto_de_Gasto_de_Aeronave));
    this.dataSourceConcepto_de_Gasto_de_Aeronave.data = this.Concepto_de_Gasto_de_AeronaveData;
    Concepto_de_Gasto_de_Aeronave.edit = true;
    Concepto_de_Gasto_de_Aeronave.isNew = true;
    const length = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.length;
    const index = length - 1;
    const formConcepto_de_Gasto_de_Aeronave = this.Concepto_de_Gasto_de_AeronaveItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceConcepto_de_Gasto_de_Aeronave.data.filter(d => !d.IsDeleted).length / this.paginadorGastosAeronaves.pageSize);
    if (page !== this.paginadorGastosAeronaves.pageIndex) {
      this.paginadorGastosAeronaves.pageIndex = page;
    }
  }

  calculateGastosAeronaves() {

    let totalGastosAeronavesMXN = 0;
    let totalGastosAeronavesUSD = 0;
    let totalGastosAeronavesEUR = 0;
    let totalGastosAeronavesCAD = 0;
    let totalGastosAeronavesLIB = 0;

    this.dataSourceConcepto_de_Gasto_de_Aeronave.data.forEach(element => {

      if (element.Moneda == 1 && !element.IsDeleted) { //MXN
        totalGastosAeronavesMXN = +totalGastosAeronavesMXN + +element.Monto;
      }
      if (element.Moneda == 2 && !element.IsDeleted) { //USD
        totalGastosAeronavesUSD = +totalGastosAeronavesUSD + +element.Monto;
      }
      if (element.Moneda == 3 && !element.IsDeleted) { //EUR
        totalGastosAeronavesEUR = +totalGastosAeronavesEUR + +element.Monto;
      }
      if (element.Moneda == 4 && !element.IsDeleted) { //CAD
        totalGastosAeronavesCAD = +totalGastosAeronavesCAD + +element.Monto;
      }
      if (element.Moneda == 5 && !element.IsDeleted) { //LIB
        totalGastosAeronavesLIB = +totalGastosAeronavesLIB + +element.Monto;
      }

    });

    this.Gastos_de_VueloForm.get('aeronave_total_mxn').setValue(totalGastosAeronavesMXN);
    this.Gastos_de_VueloForm.get('aeronave_total_usd').setValue(totalGastosAeronavesUSD);
    this.Gastos_de_VueloForm.get('aeronave_total_eur').setValue(totalGastosAeronavesEUR);
    this.Gastos_de_VueloForm.get('aeronave_total_libras').setValue(totalGastosAeronavesLIB);
    this.Gastos_de_VueloForm.get('aeronave_total_cad').setValue(totalGastosAeronavesCAD);

    this.calculateResumenGastos();

  }


  calculateResumenGastos() {

    let TCMXN = 0;
    let TCUSD = 0;
    let TCEUR = 0;
    let TCCAD = 0;
    let TCLIB = 0;
    let cashMXN = 0;
    let cashUSD = 0;
    let cashEUR = 0;
    let cashCAD = 0;
    let cashLIB = 0;
    let anticipoMXN = 0;
    let anticipoUSD = 0;
    let anticipoEUR = 0;
    let anticipoCAD = 0;
    let anticipoLIB = 0;
    let importeMXN = 0;
    let importeUSD = 0;
    let importeEUR = 0;
    let importeCAD = 0;
    let importeLIB = 0;
    let saldoMXN = 0;
    let saldoUSD = 0;
    let saldoEUR = 0;
    let saldoCAD = 0;
    let saldoLIB = 0;

    this.dataSourceConcepto_de_Gasto_de_Aeronave.data.forEach(element => {

      if (element.Moneda == 1 && !element.IsDeleted && element.Forma_de_Pago == 1) { //MXN Cash
        cashMXN = +cashMXN + +element.Monto;
      }
      if (element.Moneda == 1 && !element.IsDeleted && element.Forma_de_Pago == 2) { //MXN TC
        TCMXN = +TCMXN + +element.Monto;
      }
      if (element.Moneda == 2 && !element.IsDeleted && element.Forma_de_Pago == 1) { //USD Cash
        cashUSD = +cashUSD + +element.Monto;
      }
      if (element.Moneda == 2 && !element.IsDeleted && element.Forma_de_Pago == 2) { //USD TC
        TCUSD = +TCUSD + +element.Monto;
      }
      if (element.Moneda == 3 && !element.IsDeleted && element.Forma_de_Pago == 1) { //EUR CASH
        cashEUR = +cashEUR + +element.Monto;
      }
      if (element.Moneda == 3 && !element.IsDeleted && element.Forma_de_Pago == 2) { //EUR TC
        TCEUR = +TCEUR + +element.Monto;
      }
      if (element.Moneda == 4 && !element.IsDeleted && element.Forma_de_Pago == 1) { //CAD Cash
        cashCAD = +cashCAD + +element.Monto;
      }
      if (element.Moneda == 4 && !element.IsDeleted && element.Forma_de_Pago == 2) { //CAD TC
        TCCAD = +TCCAD + +element.Monto;
      }
      if (element.Moneda == 5 && !element.IsDeleted && element.Forma_de_Pago == 1) { //LIB Cash
        cashLIB = +cashLIB + +element.Monto;
      }
      if (element.Moneda == 5 && !element.IsDeleted && element.Forma_de_Pago == 2) { //LIB TC
        TCLIB = +TCLIB + +element.Monto;
      }

    });

    this.dataSourceConcepto_de_Gasto_por_Empleado.data.forEach(element => {

      if (element.Moneda == 1 && !element.IsDeleted && element.Forma_de_Pago == 1) { //MXN Cash
        cashMXN = +cashMXN + +element.Monto;
      }
      if (element.Moneda == 1 && !element.IsDeleted && element.Forma_de_Pago == 2) { //MXN TC
        TCMXN = +TCMXN + +element.Monto;
      }
      if (element.Moneda == 2 && !element.IsDeleted && element.Forma_de_Pago == 1) { //USD Cash
        cashUSD = +cashUSD + +element.Monto;
      }
      if (element.Moneda == 2 && !element.IsDeleted && element.Forma_de_Pago == 2) { //USD TC
        TCUSD = +TCUSD + +element.Monto;
      }
      if (element.Moneda == 3 && !element.IsDeleted && element.Forma_de_Pago == 1) { //EUR CASH
        cashEUR = +cashEUR + +element.Monto;
      }
      if (element.Moneda == 3 && !element.IsDeleted && element.Forma_de_Pago == 2) { //EUR TC
        TCEUR = +TCEUR + +element.Monto;
      }
      if (element.Moneda == 4 && !element.IsDeleted && element.Forma_de_Pago == 1) { //CAD Cash
        cashCAD = +cashCAD + +element.Monto;
      }
      if (element.Moneda == 4 && !element.IsDeleted && element.Forma_de_Pago == 2) { //CAD TC
        TCCAD = +TCCAD + +element.Monto;
      }
      if (element.Moneda == 5 && !element.IsDeleted && element.Forma_de_Pago == 1) { //LIB Cash
        cashLIB = +cashLIB + +element.Monto;
      }
      if (element.Moneda == 5 && !element.IsDeleted && element.Forma_de_Pago == 2) { //LIB TC
        TCLIB = +TCLIB + +element.Monto;
      }

    });

    this.dataSourceAnticipo_de_Viaticos.data.forEach(element => {

      if (element.Moneda == 1 && !element.IsDeleted) { //MXN Cash
        anticipoMXN = +anticipoMXN + +element.Monto;
      }
      if (element.Moneda == 2 && !element.IsDeleted) { //USD Cash
        anticipoUSD = +anticipoUSD + +element.Monto;
      }
      if (element.Moneda == 3 && !element.IsDeleted) { //EUR CASH
        anticipoEUR = +anticipoEUR + +element.Monto;
      }
      if (element.Moneda == 4 && !element.IsDeleted) { //CAD Cash
        anticipoCAD = +anticipoCAD + +element.Monto;
      }
      if (element.Moneda == 5 && !element.IsDeleted) { //LIB Cash
        anticipoLIB = +anticipoLIB + +element.Monto;
      }
    });

    //TDC
    this.dataSourceResumen_de_Gastos.data[0].MXN = TCMXN;
    this.dataSourceResumen_de_Gastos.data[0].USD = TCUSD;
    this.dataSourceResumen_de_Gastos.data[0].EUR = TCEUR;
    this.dataSourceResumen_de_Gastos.data[0].CAD = TCCAD;
    this.dataSourceResumen_de_Gastos.data[0].LIBRA = TCLIB;

    //CASH
    this.dataSourceResumen_de_Gastos.data[1].MXN = cashMXN;
    this.dataSourceResumen_de_Gastos.data[1].USD = cashUSD;
    this.dataSourceResumen_de_Gastos.data[1].EUR = cashEUR;
    this.dataSourceResumen_de_Gastos.data[1].CAD = cashCAD;
    this.dataSourceResumen_de_Gastos.data[1].LIBRA = cashLIB;

    //ANTICIPO
    this.dataSourceResumen_de_Gastos.data[2].MXN = anticipoMXN;
    this.dataSourceResumen_de_Gastos.data[2].USD = anticipoUSD;
    this.dataSourceResumen_de_Gastos.data[2].EUR = anticipoEUR;
    this.dataSourceResumen_de_Gastos.data[2].CAD = anticipoCAD;
    this.dataSourceResumen_de_Gastos.data[2].LIBRA = anticipoLIB;

    //IMPORTE DEVUELTO 
    this.dataSourceResumen_de_Gastos.data[3].MXN = anticipoMXN - cashMXN;
    this.dataSourceResumen_de_Gastos.data[3].USD = anticipoUSD - cashUSD;
    this.dataSourceResumen_de_Gastos.data[3].EUR = anticipoEUR - cashEUR;
    this.dataSourceResumen_de_Gastos.data[3].CAD = anticipoCAD - cashCAD;
    this.dataSourceResumen_de_Gastos.data[3].LIBRA = anticipoLIB - cashLIB;

    //SALDO A FAVOR O EN CONTRA
    this.dataSourceResumen_de_Gastos.data[4].MXN = anticipoMXN - (cashMXN + TCMXN);
    this.dataSourceResumen_de_Gastos.data[4].USD = anticipoUSD - (cashUSD + TCUSD);
    this.dataSourceResumen_de_Gastos.data[4].EUR = anticipoEUR - (cashEUR + TCEUR);
    this.dataSourceResumen_de_Gastos.data[4].CAD = anticipoCAD - (cashCAD + TCCAD);
    this.dataSourceResumen_de_Gastos.data[4].LIBRA = anticipoLIB - (cashLIB + TCLIB);
  }

  addConcepto_de_Gasto_de_Aeronave(entity: Detalle_Gastos_Aeronave) {
    const Concepto_de_Gasto_de_Aeronave = new Detalle_Gastos_Aeronave(this.fb);
    this.Concepto_de_Gasto_de_AeronaveItems.push(Concepto_de_Gasto_de_Aeronave.buildFormGroup());
    if (entity) {
      Concepto_de_Gasto_de_Aeronave.fromObject(entity);
    }
    return entity;
  }

  Concepto_de_Gasto_de_AeronaveItemsByFolio(Folio: number): FormGroup {
    return (this.Gastos_de_VueloForm.get('Detalle_Gastos_AeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Concepto_de_Gasto_de_AeronaveItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.indexOf(element);
    let fb = this.Concepto_de_Gasto_de_AeronaveItems.controls[index] as FormGroup;
    return fb;
  }

  deleteConcepto_de_Gasto_de_Aeronave(element: any) {
    let index = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.indexOf(element);
    this.Concepto_de_Gasto_de_AeronaveData[index].IsDeleted = true;
    this.dataSourceConcepto_de_Gasto_de_Aeronave.data = this.Concepto_de_Gasto_de_AeronaveData;
    this.dataSourceConcepto_de_Gasto_de_Aeronave.data.splice(index, 1);
    this.dataSourceConcepto_de_Gasto_de_Aeronave._updateChangeSubscription();
    index = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorGastosAeronaves.pageSize);
    if (page !== this.paginadorGastosAeronaves.pageIndex) {
      this.paginadorGastosAeronaves.pageIndex = page;
    }
    this.calculateGastosAeronaves();
  }

  cancelEditConcepto_de_Gasto_de_Aeronave(element: any) {
    let index = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Concepto_de_Gasto_de_AeronaveData[index].IsDeleted = true;
      this.dataSourceConcepto_de_Gasto_de_Aeronave.data = this.Concepto_de_Gasto_de_AeronaveData;
      this.dataSourceConcepto_de_Gasto_de_Aeronave.data.splice(index, 1);
      this.dataSourceConcepto_de_Gasto_de_Aeronave._updateChangeSubscription();
      index = this.Concepto_de_Gasto_de_AeronaveData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorGastosAeronaves.pageSize);
      if (page !== this.paginadorGastosAeronaves.pageIndex) {
        this.paginadorGastosAeronaves.pageIndex = page;
      }
    }
    this.calculateGastosAeronaves();
  }

  async saveConcepto_de_Gasto_de_Aeronave(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.indexOf(element);
    const formConcepto_de_Gasto_de_Aeronave = this.Concepto_de_Gasto_de_AeronaveItems.controls[index] as FormGroup;
    this.Concepto_de_Gasto_de_AeronaveData[index].Fecha_de_gasto = formConcepto_de_Gasto_de_Aeronave.value.Fecha_de_gasto;
    this.Concepto_de_Gasto_de_AeronaveData[index].Concepto = formConcepto_de_Gasto_de_Aeronave.value.Concepto;
    this.Concepto_de_Gasto_de_AeronaveData[index].Concepto_Concepto_de_Gasto_de_Aeronave = formConcepto_de_Gasto_de_Aeronave.value.Concepto !== '' ?
      this.varConcepto_de_Gasto_de_Aeronave.filter(d => d.Clave === formConcepto_de_Gasto_de_Aeronave.value.Concepto)[0] : null;
    this.Concepto_de_Gasto_de_AeronaveData[index].Descripcion = formConcepto_de_Gasto_de_Aeronave.value.Descripcion;
    this.Concepto_de_Gasto_de_AeronaveData[index].Monto = formConcepto_de_Gasto_de_Aeronave.value.Monto;
    this.Concepto_de_Gasto_de_AeronaveData[index].Moneda = formConcepto_de_Gasto_de_Aeronave.value.Moneda;
    this.Concepto_de_Gasto_de_AeronaveData[index].Moneda_Moneda = formConcepto_de_Gasto_de_Aeronave.value.Moneda !== '' ?
      this.varMoneda.filter(d => d.Clave === formConcepto_de_Gasto_de_Aeronave.value.Moneda)[0] : null;
    this.Concepto_de_Gasto_de_AeronaveData[index].Forma_de_Pago = formConcepto_de_Gasto_de_Aeronave.value.Forma_de_Pago;
    this.Concepto_de_Gasto_de_AeronaveData[index].Forma_de_Pago_Forma_de_Pago = formConcepto_de_Gasto_de_Aeronave.value.Forma_de_Pago !== '' ?
      this.varForma_de_Pago.filter(d => d.Clave === formConcepto_de_Gasto_de_Aeronave.value.Forma_de_Pago)[0] : null;
    this.Concepto_de_Gasto_de_AeronaveData[index].Autorizacion = formConcepto_de_Gasto_de_Aeronave.value.Autorizacion;
    this.Concepto_de_Gasto_de_AeronaveData[index].Autorizacion_Resultado_de_Autorizacion_de_Vuelo = formConcepto_de_Gasto_de_Aeronave.value.Autorizacion !== '' ?
      this.varResultado_de_Autorizacion_de_Vuelo.filter(d => d.Clave === formConcepto_de_Gasto_de_Aeronave.value.Autorizacion)[0] : null;
    this.Concepto_de_Gasto_de_AeronaveData[index].Observaciones = formConcepto_de_Gasto_de_Aeronave.value.Observaciones;

    this.Concepto_de_Gasto_de_AeronaveData[index].isNew = false;
    this.dataSourceConcepto_de_Gasto_de_Aeronave.data = this.Concepto_de_Gasto_de_AeronaveData;
    this.dataSourceConcepto_de_Gasto_de_Aeronave._updateChangeSubscription();
    this.calculateGastosAeronaves();
  }

  editConcepto_de_Gasto_de_Aeronave(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.indexOf(element);
    const formConcepto_de_Gasto_de_Aeronave = this.Concepto_de_Gasto_de_AeronaveItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Gastos_Aeronave(Folio: number) {
    this.dataSourceConcepto_de_Gasto_de_Aeronave.data.forEach(async (d, index) => {
      const data = this.Concepto_de_Gasto_de_AeronaveItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Gastos_de_Vuelo = Folio;

      const FolioComprobante = await this.saveComprobante_Detalle_Gastos_Aeronave(index);
      d.Comprobante = FolioComprobante > 0 ? FolioComprobante : null;
      model.Comprobante = d.Comprobante;

      if (model.Folio === 0) {
        // Add Concepto de Gasto de Aeronave
        let response = await this.Detalle_Gastos_AeronaveService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formConcepto_de_Gasto_de_Aeronave = this.Concepto_de_Gasto_de_AeronaveItemsByFolio(model.Folio);
        if (formConcepto_de_Gasto_de_Aeronave.dirty) {
          // Update Concepto de Gasto de Aeronave
          let response = await this.Detalle_Gastos_AeronaveService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Concepto de Gasto de Aeronave
        await this.Detalle_Gastos_AeronaveService.delete(model.Folio).toPromise();
      }
    });
  }

  getComprobante_Detalle_Gastos_Aeronave(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.indexOf(element);
    const formDetalle_Gastos_Aeronave = this.Concepto_de_Gasto_de_AeronaveItems.controls[index] as FormGroup;
    return formDetalle_Gastos_Aeronave.controls.ComprobanteFile.value && formDetalle_Gastos_Aeronave.controls.ComprobanteFile.value !== '' ?
      formDetalle_Gastos_Aeronave.controls.ComprobanteFile.value.files[0].name : '';
  }

  async getComprobante_Detalle_Gastos_AeronaveClick(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.indexOf(element);
    const formDetalle_Gastos_Aeronave = this.Concepto_de_Gasto_de_AeronaveItems.controls[index] as FormGroup;
    if (formDetalle_Gastos_Aeronave.controls.ComprobanteFile.valid
      && formDetalle_Gastos_Aeronave.controls.ComprobanteFile.dirty) {
      const Comprobante = formDetalle_Gastos_Aeronave.controls.ComprobanteFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Comprobante);
      this.helperService.dowloadFileFromArray(byteArray, Comprobante.name);
    }
  }

  removeComprobante_Detalle_Gastos_Aeronave(element: any) {
    const index = this.dataSourceConcepto_de_Gasto_de_Aeronave.data.indexOf(element);
    this.Comprobante_Detalle_Gastos_Aeronave[index] = '';
    this.Concepto_de_Gasto_de_AeronaveData[index].Comprobante = 0;

    const formDetalle_Gastos_Aeronave = this.Concepto_de_Gasto_de_AeronaveItems.controls[index] as FormGroup;
    if (formDetalle_Gastos_Aeronave.controls.ComprobanteFile.valid
      && formDetalle_Gastos_Aeronave.controls.ComprobanteFile.dirty) {
      formDetalle_Gastos_Aeronave.controls.ComprobanteFile = null;
    }
  }

  async saveComprobante_Detalle_Gastos_Aeronave(index: number): Promise<number> {
    const formConcepto_de_Gasto_de_Aeronave = this.Concepto_de_Gasto_de_AeronaveItems.controls[index] as FormGroup;
    if (formConcepto_de_Gasto_de_Aeronave.controls.ComprobanteFile.valid
      && formConcepto_de_Gasto_de_Aeronave.controls.ComprobanteFile.dirty) {
      const Comprobante = formConcepto_de_Gasto_de_Aeronave.controls.ComprobanteFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Comprobante);
      const spartanFile = {
        File: byteArray,
        Description: Comprobante.name,
        Date_Time: Comprobante.lastModifiedDate,
        File_Size: Comprobante.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return 0;
    }
  }

  hasComprobante_Detalle_Gastos_Aeronave(element) {
    return this.getComprobante_Detalle_Gastos_Aeronave(element) !== '' ||
      (element.Comprobante_Spartane_File && element.Comprobante_Spartane_File.File_Id > 0);
  }

  get Resumen_de_GastosItems() {
    return this.Gastos_de_VueloForm.get('Detalle_Gastos_ResumenItems') as FormArray;
  }

  getResumen_de_GastosColumns(): string[] {
    return this.Resumen_de_GastosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadResumen_de_Gastos(Resumen_de_Gastos: Detalle_Gastos_Resumen[]) {
    Resumen_de_Gastos.forEach(element => {
      this.addResumen_de_Gastos(element);
    });
  }

  addResumen_de_GastosToMR() {
    const Resumen_de_Gastos = new Detalle_Gastos_Resumen(this.fb);
    this.Resumen_de_GastosData.push(this.addResumen_de_Gastos(Resumen_de_Gastos));
    this.dataSourceResumen_de_Gastos.data = this.Resumen_de_GastosData;
    Resumen_de_Gastos.edit = true;
    Resumen_de_Gastos.isNew = true;
    const length = this.dataSourceResumen_de_Gastos.data.length;
    const index = length - 1;
    const formResumen_de_Gastos = this.Resumen_de_GastosItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceResumen_de_Gastos.data.filter(d => !d.IsDeleted).length / this.paginadorResumenGastos.pageSize);
    if (page !== this.paginadorResumenGastos.pageIndex) {
      this.paginadorResumenGastos.pageIndex = page;
    }

    this.RulesForMR(index);
  }


  RulesForMR(index) {
    this.brf.SetDisabledControlMR(this.Resumen_de_GastosItems, index, "MXN");
  }

  addResumen_de_Gastos(entity: Detalle_Gastos_Resumen) {
    const Resumen_de_Gastos = new Detalle_Gastos_Resumen(this.fb);
    this.Resumen_de_GastosItems.push(Resumen_de_Gastos.buildFormGroup());
    if (entity) {
      Resumen_de_Gastos.fromObject(entity);
    }
    return entity;
  }

  Resumen_de_GastosItemsByFolio(Folio: number): FormGroup {
    return (this.Gastos_de_VueloForm.get('Detalle_Gastos_ResumenItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Resumen_de_GastosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceResumen_de_Gastos.data.indexOf(element);
    let fb = this.Resumen_de_GastosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteResumen_de_Gastos(element: any) {
    let index = this.dataSourceResumen_de_Gastos.data.indexOf(element);
    this.Resumen_de_GastosData[index].IsDeleted = true;
    this.dataSourceResumen_de_Gastos.data = this.Resumen_de_GastosData;
    this.dataSourceResumen_de_Gastos.data.splice(index, 1);
    this.dataSourceResumen_de_Gastos._updateChangeSubscription();
    index = this.dataSourceResumen_de_Gastos.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorResumenGastos.pageSize);
    if (page !== this.paginadorResumenGastos.pageIndex) {
      this.paginadorResumenGastos.pageIndex = page;
    }
  }

  cancelEditResumen_de_Gastos(element: any) {
    let index = this.dataSourceResumen_de_Gastos.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Resumen_de_GastosData[index].IsDeleted = true;
      this.dataSourceResumen_de_Gastos.data = this.Resumen_de_GastosData;
      this.dataSourceResumen_de_Gastos.data.splice(index, 1);
      this.dataSourceResumen_de_Gastos._updateChangeSubscription();
      index = this.Resumen_de_GastosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorResumenGastos.pageSize);
      if (page !== this.paginadorResumenGastos.pageIndex) {
        this.paginadorResumenGastos.pageIndex = page;
      }
    }
  }

  async saveResumen_de_Gastos(element: any) {
    const index = this.dataSourceResumen_de_Gastos.data.indexOf(element);
    const formResumen_de_Gastos = this.Resumen_de_GastosItems.controls[index] as FormGroup;
    this.Resumen_de_GastosData[index].Concepto = formResumen_de_Gastos.value.Concepto;
    this.Resumen_de_GastosData[index].MXN = formResumen_de_Gastos.value.MXN;
    this.Resumen_de_GastosData[index].USD = formResumen_de_Gastos.value.USD;
    this.Resumen_de_GastosData[index].EUR = formResumen_de_Gastos.value.EUR;
    this.Resumen_de_GastosData[index].LIBRA = formResumen_de_Gastos.value.LIBRA;
    this.Resumen_de_GastosData[index].CAD = formResumen_de_Gastos.value.CAD;

    this.Resumen_de_GastosData[index].isNew = false;
    this.dataSourceResumen_de_Gastos.data = this.Resumen_de_GastosData;
    this.dataSourceResumen_de_Gastos._updateChangeSubscription();
  }

  editResumen_de_Gastos(element: any) {
    const index = this.dataSourceResumen_de_Gastos.data.indexOf(element);
    const formResumen_de_Gastos = this.Resumen_de_GastosItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Gastos_Resumen(Folio: number) {
    this.dataSourceResumen_de_Gastos.data.forEach(async (d, index) => {
      const data = this.Resumen_de_GastosItems.controls[index] as FormGroup;
      let model = d;
      model.Gastos_de_Vuelo = Folio;

      if (model.Folio === 0) {
        // Add Resumen de Gastos
        let response = await this.Detalle_Gastos_ResumenService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        // Update Resumen de Gastos
        let response = await this.Detalle_Gastos_ResumenService.update(model.Folio, model).toPromise();
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Resumen de Gastos
        await this.Detalle_Gastos_ResumenService.delete(model.Folio).toPromise();
      }
    });
  }




  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Gastos_de_VueloForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_de_Ingreso_de_GastoService.getAll());
    observablesArray.push(this.MonedaService.getAll());

    observablesArray.push(this.Estatus_de_Gastos_de_VueloService.getAll());
    observablesArray.push(this.Concepto_de_Gasto_de_EmpleadoService.getAll());
    observablesArray.push(this.Forma_de_PagoService.getAll());
    observablesArray.push(this.Resultado_de_Autorizacion_de_VueloService.getAll());

    observablesArray.push(this.Concepto_de_Gasto_de_AeronaveService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varTipo_de_Ingreso_de_Gasto, varMoneda, varEstatus_de_Gastos_de_Vuelo, varConcepto_de_Gasto_de_Empleado, varForma_de_Pago, varResultado_de_Autorizacion_de_Vuelo, varConcepto_de_Gasto_de_Aeronave]) => {
          this.varTipo_de_Ingreso_de_Gasto = varTipo_de_Ingreso_de_Gasto;
          this.varMoneda = varMoneda;

          this.varEstatus_de_Gastos_de_Vuelo = varEstatus_de_Gastos_de_Vuelo;
          this.varConcepto_de_Gasto_de_Empleado = varConcepto_de_Gasto_de_Empleado;
          this.varForma_de_Pago = varForma_de_Pago;
          this.varResultado_de_Autorizacion_de_Vuelo = varResultado_de_Autorizacion_de_Vuelo;

          this.varConcepto_de_Gasto_de_Aeronave = varConcepto_de_Gasto_de_Aeronave;



          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Gastos_de_VueloForm.get('Orden_de_Trabajo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingOrden_de_Trabajo = true),
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
      this.isLoadingOrden_de_Trabajo = false;
      this.hasOptionsOrden_de_Trabajo = result?.Orden_de_Trabajos?.length > 0;
      this.Gastos_de_VueloForm.get('Orden_de_Trabajo').setValue(result?.Orden_de_Trabajos[0], { onlySelf: true, emitEvent: false });
      this.optionsOrden_de_Trabajo = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingOrden_de_Trabajo = false;
      this.hasOptionsOrden_de_Trabajo = false;
      this.optionsOrden_de_Trabajo = of([]);
    });
    this.Gastos_de_VueloForm.get('Numero_de_Vuelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNumero_de_Vuelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
          return this.Solicitud_de_VueloService.listaSelAll(0, 20,
            "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Solicitud_de_VueloService.listaSelAll(0, 20,
          "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.Numero_de_Vuelo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = result?.Solicitud_de_Vuelos?.length > 0;
      this.Gastos_de_VueloForm.get('Numero_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
      this.optionsNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = false;
      this.optionsNumero_de_Vuelo = of([]);
    });
    this.Gastos_de_VueloForm.get('Matricula').valueChanges.pipe(
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
      this.Gastos_de_VueloForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingTramo_de_Vuelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Registro_de_vueloService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Registro_de_vueloService.listaSelAll(0, 20, '');
          return this.Registro_de_vueloService.listaSelAll(0, 20,
            "Registro_de_vuelo.Numero_de_Tramo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Registro_de_vueloService.listaSelAll(0, 20,
          "Registro_de_vuelo.Numero_de_Tramo like '%" + value.Numero_de_Tramo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingTramo_de_Vuelo = false;
      this.hasOptionsTramo_de_Vuelo = result?.Registro_de_vuelos?.length > 0;
      this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').setValue(result?.Registro_de_vuelos[0], { onlySelf: true, emitEvent: false });
      this.optionsTramo_de_Vuelo = of(result?.Registro_de_vuelos);
    }, error => {
      this.isLoadingTramo_de_Vuelo = false;
      this.hasOptionsTramo_de_Vuelo = false;
      this.optionsTramo_de_Vuelo = of([]);
    });
    this.Gastos_de_VueloForm.get('Salida').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingSalida = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingSalida = false;
      this.hasOptionsSalida = result?.Aeropuertoss?.length > 0;
      this.Gastos_de_VueloForm.get('Salida').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
      this.optionsSalida = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingSalida = false;
      this.hasOptionsSalida = false;
      this.optionsSalida = of([]);
    });
    this.Gastos_de_VueloForm.get('Destino').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingDestino = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingDestino = false;
      this.hasOptionsDestino = result?.Aeropuertoss?.length > 0;
      this.Gastos_de_VueloForm.get('Destino').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
      this.optionsDestino = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingDestino = false;
      this.hasOptionsDestino = false;
      this.optionsDestino = of([]);
    });
    this.Gastos_de_VueloForm.get('Empleado').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEmpleado = true),
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
      this.isLoadingEmpleado = false;
      this.hasOptionsEmpleado = result?.Spartan_Users?.length > 0;
      this.Gastos_de_VueloForm.get('Empleado').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      this.optionsEmpleado = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingEmpleado = false;
      this.hasOptionsEmpleado = false;
      this.optionsEmpleado = of([]);
    });
  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tipo_de_Ingreso_de_Gasto': {
        this.Tipo_de_Ingreso_de_GastoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Ingreso_de_Gasto = x.Tipo_de_Ingreso_de_Gastos;
        });
        break;
      }
      case 'Moneda': {
        this.MonedaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varMoneda = x.Monedas;
        });
        break;
      }

      case 'Estatus': {
        this.Estatus_de_Gastos_de_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Gastos_de_Vuelo = x.Estatus_de_Gastos_de_Vuelos;
        });
        break;
      }
      case 'Concepto': {
        this.Concepto_de_Gasto_de_EmpleadoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varConcepto_de_Gasto_de_Empleado = x.Concepto_de_Gasto_de_Empleados;
        });
        break;
      }
      case 'Forma_de_Pago': {
        this.Forma_de_PagoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varForma_de_Pago = x.Forma_de_Pagos;
        });
        break;
      }
      case 'Autorizacion': {
        this.Resultado_de_Autorizacion_de_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varResultado_de_Autorizacion_de_Vuelo = x.Resultado_de_Autorizacion_de_Vuelos;
        });
        break;
      }

      case 'Concepto': {
        this.Concepto_de_Gasto_de_AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varConcepto_de_Gasto_de_Aeronave = x.Concepto_de_Gasto_de_Aeronaves;
        });
        break;
      }



      default: {
        break;
      }
    }
  }

  displayFnOrden_de_Trabajo(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
  displayFnNumero_de_Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnTramo_de_Vuelo(option: Registro_de_vuelo) {
    return option?.Numero_de_Tramo;
  }
  displayFnSalida(option: Aeropuertos) {
    return option?.Descripcion;
  }
  displayFnDestino(option: Aeropuertos) {
    return option?.Descripcion;
  }
  displayFnEmpleado(option: Spartan_User) {
    return option?.Name;
  }


  async save() {
    await this.saveData();
    if (this.localStorageHelper.getItemFromLocalStorage("Gastos_de_VueloWindowsFloat") == "1") {
      setTimeout(() => { window.close(); }, 5000);
    }
    else {
      this.goToList();
    }
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Gastos_de_VueloForm.value;
      entity.Folio = this.model.Folio;
      entity.Orden_de_Trabajo = this.Gastos_de_VueloForm.get('Orden_de_Trabajo').value.Folio;
      entity.Numero_de_Vuelo = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');
      entity.Matricula = this.Gastos_de_VueloForm.get('Matricula').value.Matricula;
      entity.Tramo_de_Vuelo = this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value.Folio;
      entity.Salida = this.Gastos_de_VueloForm.get('Salida').value.Aeropuerto_ID;
      entity.Destino = this.Gastos_de_VueloForm.get('Destino').value.Aeropuerto_ID;
      entity.Empleado = this.Gastos_de_VueloForm.get('Empleado').value.Id_User;
      entity.Fecha_de_Registro = this.Gastos_de_VueloForm.get('Fecha_de_Registro').value;
      entity.Tipo_de_Ingreso_de_Gasto = this.Gastos_de_VueloForm.get('Tipo_de_Ingreso_de_Gasto').value;

      //Datos Faltantes
      entity.empleado_total_mxn = this.Gastos_de_VueloForm.get('empleado_total_mxn').value;
      entity.empleado_total_usd = this.Gastos_de_VueloForm.get('empleado_total_usd').value;
      entity.empleado_total_eur = this.Gastos_de_VueloForm.get('empleado_total_eur').value;
      entity.empleado_total_libras = this.Gastos_de_VueloForm.get('empleado_total_libras').value;
      entity.empleado_total_cad = this.Gastos_de_VueloForm.get('empleado_total_cad').value;

      entity.aeronave_total_mxn = this.Gastos_de_VueloForm.get('aeronave_total_mxn').value;
      entity.aeronave_total_usd = this.Gastos_de_VueloForm.get('aeronave_total_usd').value;
      entity.aeronave_total_eur = this.Gastos_de_VueloForm.get('aeronave_total_eur').value;
      entity.aeronave_total_libras = this.Gastos_de_VueloForm.get('aeronave_total_libras').value;
      entity.aeronave_total_cad = this.Gastos_de_VueloForm.get('aeronave_total_cad').value;


      if (this.model.Folio > 0) {
        await this.Gastos_de_VueloService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Anticipo_de_Viaticos(this.model.Folio);
        await this.saveDetalle_Gastos_Empleado(this.model.Folio);
        await this.saveDetalle_Gastos_Aeronave(this.model.Folio);
        await this.saveDetalle_Gastos_Resumen(this.model.Folio);

        setTimeout(() => {
          this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
          this.spinner.hide('loading');

          this.snackBar.open('Registro guardado con éxito', '', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'success'
          });

          return this.model.Folio;
        }, 5000);

      } else {
        await (this.Gastos_de_VueloService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Anticipo_de_Viaticos(id);
          await this.saveDetalle_Gastos_Empleado(id);
          await this.saveDetalle_Gastos_Aeronave(id);
          await this.saveDetalle_Gastos_Resumen(id);

          setTimeout(() => {
            this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
            this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
            this.spinner.hide('loading');

            this.snackBar.open('Registro guardado con éxito', '', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: 'success'
            });

            return id;
          }, 5000);
        }));
      }
      // this.snackBar.open('Registro guardado con éxito', '', {
      //   duration: 2000,
      //   verticalPosition: 'top',
      //   horizontalPosition: 'right',
      //   panelClass: 'success'
      // });
      this.rulesAfterSave();
      this.isLoading = false;
      //this.spinner.hide('loading');
    } else {
      this.isLoading = false;
      //this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Gastos_de_VueloForm.reset();
      this.model = new Gastos_de_Vuelo(this.fb);
      this.Gastos_de_VueloForm = this.model.buildFormGroup();
      this.dataSourceAnticipo_de_Viaticos = new MatTableDataSource<Detalle_Anticipo_de_Viaticos>();
      this.Anticipo_de_ViaticosData = [];
      this.dataSourceConcepto_de_Gasto_por_Empleado = new MatTableDataSource<Detalle_Gastos_Empleado>();
      this.Concepto_de_Gasto_por_EmpleadoData = [];
      this.dataSourceConcepto_de_Gasto_de_Aeronave = new MatTableDataSource<Detalle_Gastos_Aeronave>();
      this.Concepto_de_Gasto_de_AeronaveData = [];
      this.dataSourceResumen_de_Gastos = new MatTableDataSource<Detalle_Gastos_Resumen>();
      this.Resumen_de_GastosData = [];

    } else {
      this.router.navigate(['views/Gastos_de_Vuelo/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }

  cancel() {
    if (this.localStorageHelper.getItemFromLocalStorage("Gastos_de_VueloWindowsFloat") == "1") {
      this.localStorageHelper.setItemToLocalStorage("Gastos_de_VueloWindowsFloat", "0");
      setTimeout(() => { window.close(); }, 5000);
    }
    else {
      this.goToList();
    }
  }

  goToList() {
    this.router.navigate(['/Gastos_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Fecha_de_Registro_ExecuteBusinessRules(): void {
    //Fecha_de_Registro_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Ingreso_de_Gasto_ExecuteBusinessRules(): void {

    //INICIA - BRID:2801 - 3.- Al seleccionar el tipo de ingreso de gasto, si el tipo de ingreso de gasto es mantenimiento hacer visible y obligatorio el combo de orden de trabajo, de lo contrario, ocultarlo. - Autor: Felipe Rodríguez - Actualización: 4/23/2021 12:32:27 PM
    if (this.Gastos_de_VueloForm.get('Tipo_de_Ingreso_de_Gasto').value == this.brf.TryParseInt('2', '2')) {
      this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
      this.brf.SetRequiredControl(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
    } else {
      this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
    }
    //TERMINA - BRID:2801

    //Tipo_de_Ingreso_de_Gasto_FieldExecuteBusinessRulesEnd

  }
  Orden_de_Trabajo_ExecuteBusinessRules(): void {
    //Orden_de_Trabajo_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Vuelo_ExecuteBusinessRules(): void {

    //INICIA - BRID:2810 - FILTRAR TRAMO DE VUELO A ROL PILOTO - Autor: Felipe Rodríguez - Actualización: 4/23/2021 3:42:07 PM

    //TERMINA - BRID:2810


    //INICIA - BRID:2825 - Asignara matricula con codigo manual(no desactivar) - Autor: Lizeth Villa - Actualización: 4/27/2021 1:54:55 PM

    //TERMINA - BRID:2825


    //INICIA - BRID:2866 - ASIGNAR VALOR A SALIDA Y DESTINO - Autor: Felipe Rodríguez - Actualización: 5/4/2021 9:25:49 AM
    this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Salida", this.brf.EvaluaQuery(" SELECT DESCRIPCION FROM Aeropuertos A WHERE A.Aeropuerto_ID = (SELECT edv.Origen FROM Ejecucion_de_Vuelo edv WHERE edv.Numero_de_Vuelo = " + this.Gastos_de_VueloForm.get('Numero_de_Vuelo').value + " AND edv.Tramo_de_Vuelo = " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")", 1, "ABC123"), 1, "ABC123");
    this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Destino", this.brf.EvaluaQuery(" SELECT DESCRIPCION FROM Aeropuertos A WHERE A.Aeropuerto_ID = (SELECT edv.Destino FROM Ejecucion_de_Vuelo edv WHERE edv.Numero_de_Vuelo = " + this.Gastos_de_VueloForm.get('Numero_de_Vuelo').value + " AND edv.Tramo_de_Vuelo = " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")", 1, "ABC123"), 1, "ABC123");
    //TERMINA - BRID:2866

    //Numero_de_Vuelo_FieldExecuteBusinessRulesEnd



  }
  Matricula_ExecuteBusinessRules(): void {
    //Matricula_FieldExecuteBusinessRulesEnd
  }
  Tramo_de_Vuelo_ExecuteBusinessRules(): void {

    //INICIA - BRID:2804 - Al seleccionar el tramo de vuelo llenar en automatico salida y destino - Autor: Administrador - Actualización: 7/14/2021 4:58:51 AM
    if (this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value > this.brf.TryParseInt('0', '0')) {
      this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Salida", this.brf.EvaluaQuery(" select Descripcion from Aeropuertos with(nolock) where Aeropuerto_ID = (select Origen from Registro_de_vuelo where folio= " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")", 1, "ABC123"), 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Destino", this.brf.EvaluaQuery(" select Descripcion from Aeropuertos with(nolock) where Aeropuerto_ID = (select Destino from Registro_de_vuelo where folio= " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")", 1, "ABC123"), 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Salida", this.brf.EvaluaQuery(" select Descripcion from Aeropuertos with(nolock) where Aeropuerto_ID = (select Origen from Registro_de_vuelo where folio= " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")	", 1, "ABC123"), 1, "ABC123");
    } else { }
    //TERMINA - BRID:2804


    //INICIA - BRID:2817 - Al seleccionar el tramo de vuelo llenar en automatico salida y destino. - Autor: Lizeth Villa - Actualización: 4/26/2021 2:29:51 PM
    if (this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value != this.brf.TryParseInt('', '')) {
      this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Salida", this.brf.EvaluaQuery(" select Descripcion from Aeropuertos with(nolock) where Aeropuerto_ID = (select Origen from Registro_de_vuelo where folio= " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")	", 1, "ABC123"), 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Destino", this.brf.EvaluaQuery(" select Descripcion from Aeropuertos with(nolock) where Aeropuerto_ID = (select Destino from Registro_de_vuelo where folio= " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")	", 1, "ABC123"), 1, "ABC123");
    } else { }
    //TERMINA - BRID:2817


    //INICIA - BRID:2818 - Al seleccionar el tramo de vuelo llenar en automatico salida y destino.. - Autor: Lizeth Villa - Actualización: 4/26/2021 5:09:21 PM
    if (this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value > this.brf.TryParseInt('0', '0')) {
      this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Salida", this.brf.EvaluaQuery(" select Descripcion from Aeropuertos with(nolock) where Aeropuerto_ID = (select Origen from Registro_de_vuelo where folio= " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")	", 1, "ABC123"), 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Destino", this.brf.EvaluaQuery(" select Descripcion from Aeropuertos with(nolock) where Aeropuerto_ID = (select Destino from Registro_de_vuelo where folio= " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")	", 1, "ABC123"), 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Salida", this.brf.EvaluaQuery(" select Descripcion from Aeropuertos with(nolock) where Aeropuerto_ID = (select Origen from Registro_de_vuelo where folio= " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")	", 1, "ABC123"), 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Destino", this.brf.EvaluaQuery(" select Descripcion from Aeropuertos with(nolock) where Aeropuerto_ID = (select Destino from Registro_de_vuelo where folio= " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")	", 1, "ABC123"), 1, "ABC123");
    } else { }
    //TERMINA - BRID:2818


    //INICIA - BRID:2867 - ASIGNAR SALIDA Y DESTINO AL SELECCIONAR TRAMO DE VUELO - Autor: Felipe Rodríguez - Actualización: 8/20/2021 1:21:15 PM
    this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Salida", this.brf.EvaluaQuery("exec uspGetOrigenVuelo " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + "", 1, "ABC123"), 1, "ABC123");
    this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Destino", this.brf.EvaluaQuery("exec uspGetDestinoVuelo " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + "", 1, "ABC123"), 1, "ABC123");
    //TERMINA - BRID:2867


    //INICIA - BRID:2872 - SI EL TRAMO NO EXISTE EN EJECUCIÓN DE VUELO, ASIGNA NULOS - Autor: Administrador - Actualización: 7/14/2021 4:57:45 AM
    if (this.brf.EvaluaQuery("SELECT DESCRIPCION FROM Aeropuertos A WHERE A.Aeropuerto_ID = (SELECT edv.Origen FROM Ejecucion_de_Vuelo edv WHERE edv.Numero_de_Vuelo = " + this.Gastos_de_VueloForm.get('Numero_de_Vuelo').value + " AND edv.Tramo_de_Vuelo = " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")", 1, 'ABC123') == this.brf.TryParseInt('null', 'null') || this.brf.EvaluaQuery("SELECT DESCRIPCION FROM Aeropuertos A WHERE A.Aeropuerto_ID = (SELECT edv.Destino FROM Ejecucion_de_Vuelo edv WHERE edv.Numero_de_Vuelo = " + this.Gastos_de_VueloForm.get('Numero_de_Vuelo').value + " AND edv.Tramo_de_Vuelo = " + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + ")", 1, 'ABC123') == this.brf.TryParseInt('null', 'null')) { } else { }
    //TERMINA - BRID:2872

    //Tramo_de_Vuelo_FieldExecuteBusinessRulesEnd





  }
  Salida_ExecuteBusinessRules(): void {
    //Salida_FieldExecuteBusinessRulesEnd
  }
  Destino_ExecuteBusinessRules(): void {
    //Destino_FieldExecuteBusinessRulesEnd
  }
  Empleado_ExecuteBusinessRules(): void {

    //INICIA - BRID:5874 - Filtrar empleado - Autor: Lizeth Villa - Actualización: 9/7/2021 11:22:02 AM
    if (this.Gastos_de_VueloForm.get('Empleado').value != this.brf.TryParseInt('', '')) { } else { }
    //TERMINA - BRID:5874

    //Empleado_FieldExecuteBusinessRulesEnd

  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  empleado_total_mxn_ExecuteBusinessRules(): void {
    //empleado_total_mxn_FieldExecuteBusinessRulesEnd
  }
  empleado_total_usd_ExecuteBusinessRules(): void {
    //empleado_total_usd_FieldExecuteBusinessRulesEnd
  }
  empleado_total_eur_ExecuteBusinessRules(): void {
    //empleado_total_eur_FieldExecuteBusinessRulesEnd
  }
  empleado_total_libras_ExecuteBusinessRules(): void {
    //empleado_total_libras_FieldExecuteBusinessRulesEnd
  }
  empleado_total_cad_ExecuteBusinessRules(): void {
    //empleado_total_cad_FieldExecuteBusinessRulesEnd
  }
  aeronave_total_mxn_ExecuteBusinessRules(): void {
    //aeronave_total_mxn_FieldExecuteBusinessRulesEnd
  }
  aeronave_total_usd_ExecuteBusinessRules(): void {
    //aeronave_total_usd_FieldExecuteBusinessRulesEnd
  }
  aeronave_total_eur_ExecuteBusinessRules(): void {
    //aeronave_total_eur_FieldExecuteBusinessRulesEnd
  }
  aeronave_total_libras_ExecuteBusinessRules(): void {
    //aeronave_total_libras_FieldExecuteBusinessRulesEnd
  }
  aeronave_total_cad_ExecuteBusinessRules(): void {
    //aeronave_total_cad_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    //Observaciones_FieldExecuteBusinessRulesEnd
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
    if (this.operation == 'Update') {
      console.log(this.localStorageHelper.getLoggedUserInfo().RoleId)
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 12) {
        this.IsDisableEdit = false;
      }
    }
    //INICIA - BRID:1879 - En nuevo ocultar numero de vuelo  - Autor: Lizeth Villa - Actualización: 4/27/2021 2:14:14 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId != 13) {
        this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Numero_de_Vuelo");
        this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Numero_de_Vuelo");
        this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Numero_de_Vuelo");
      }
      else { }
    }
    //TERMINA - BRID:1879


    //INICIA - BRID:1904 - en  nuevo y modificacion filtrar tramos de vuelo  - Autor: ANgel Acuña - Actualización: 3/30/2021 6:11:47 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId != 13) { } else { }
    }
    //TERMINA - BRID:1904


    //INICIA - BRID:1906 - Al abrir la pantalla, en nuevo y edición, filtrar el campo Empleado para que solo muestre usuarios que su rol sea piloto y sobrecargo. - Autor: Lizeth Villa - Actualización: 9/7/2021 12:32:29 PM
    if (this.operation == 'New' || this.operation == 'Update') {

    }
    //TERMINA - BRID:1906


    //INICIA - BRID:1908 - Al abrir la pantalla, en nuevo, si el rol es piloto o sobrecargo, se selecciona el empleado en automático y se deshabilita - Autor: Lizeth Villa - Actualización: 3/24/2021 12:09:07 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 13 || this.localStorageHelper.getLoggedUserInfo().RoleId == 14) {
        this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Empleado", this.brf.EvaluaQuery(" select " + this.localStorageHelper.getLoggedUserInfo().Id, 1, "ABC123"), 1, "ABC123");
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Empleado', 0);
      }
      else {
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Empleado', 0);
      }
    }
    //TERMINA - BRID:1908


    //INICIA - BRID:1909 - Al abrir la pantalla, en nuevo, si el rol es DIFERENTE de piloto o sobrecargo, se habilita el empleado. - Autor: Lizeth Villa - Actualización: 3/24/2021 12:08:34 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId != 13 || this.localStorageHelper.getLoggedUserInfo().RoleId != 14) { this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Empleado', 1); } else { }
    }
    //TERMINA - BRID:1909


    //INICIA - BRID:2178 - acomodo de campos en gastos de vuelo - Autor: Francisco Javier Martínez Urbina - Actualización: 9/23/2021 5:24:28 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2178


    //INICIA - BRID:2241 - En nuevo y Editar se filtra combo de tramo por los que esta asignado el piloto - Autor: ANgel Acuña - Actualización: 3/30/2021 6:26:44 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 13) { } else { }
    }
    //TERMINA - BRID:2241


    //INICIA - BRID:2623 - Ocultar Folio... - Autor: Lizeth Villa - Actualización: 4/7/2021 10:23:14 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Folio"); this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Folio");
    }
    //TERMINA - BRID:2623


    //INICIA - BRID:2802 - Al abrir la pantalla, en modificación, si el rol es DISTINTO DE PILOTO* Deshabilitar los campos: - Autor: Lizeth Villa - Actualización: 8/26/2021 12:00:24 AM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId != 13) {
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Tipo_de_Ingreso_de_Gasto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Orden_de_Trabajo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Tramo_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Fecha_de_Registro', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Empleado', 0);
        //this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Anticipo_de_Viaticos', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Moneda', 0);
      } else { }
    }
    //TERMINA - BRID:2802


    //INICIA - BRID:2803 - 4.- Al abrir la pantalla, en nuevo- fecha de registro por defecto el día de hoy- estatus = Por autorizar- llenar el MR de Resumen de Gastos con con los siguientes conceptos:Pago con Tarjeta de CréditoPago en Efectivo (Cash)Menos AnticipoImporte Devuelto - Recibo No.Saldo a favor (o en contra)y los campos de MXN, USD, EUR y Libra en 0 (cero) - Autor: Felipe Rodríguez - Actualización: 4/23/2021 1:26:59 PM
    if (this.operation == 'New') {
      this.brf.SetCurrentDateToField(this.Gastos_de_VueloForm, "Fecha_de_Registro");
      this.brf.SetValueControl(this.Gastos_de_VueloForm, "Estatus", "1");
      this.brf.FillMultiRenglonfromQuery(this.dataSourceResumen_de_Gastos, "SELECT * FROM Detalle_Gastos_Resumen", 1, "ABC123");
    }
    //TERMINA - BRID:2803


    //INICIA - BRID:2805 - 5.- Al abrir la pantalla, en nuevo, modificar y consultadeshabilitar matricula, salida y destinodeshabilitar total MXN, total USD, total EUR y total LIBRAS de la pestaña de gastos de empleado y gastos de aeronaveocultar estatusobservaciones no obligatorio - Autor: Lizeth Villa - Actualización: 4/30/2021 7:08:47 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      /* this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Salida', 0);
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Destino', 0); */
      this.Gastos_de_VueloForm.get('Matricula').disable();
      this.Gastos_de_VueloForm.get('Salida').disable();
      this.Gastos_de_VueloForm.get('Destino').disable();
      this.Gastos_de_VueloForm.get('Numero_de_Vuelo').disable();
      /* this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_mxn', 0);
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_usd', 0);
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_eur', 0);
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_libras', 0); 
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_cad', 0); */
      this.Gastos_de_VueloForm.get('aeronave_total_mxn').disable();
      this.Gastos_de_VueloForm.get('aeronave_total_usd').disable();
      this.Gastos_de_VueloForm.get('aeronave_total_eur').disable();
      this.Gastos_de_VueloForm.get('aeronave_total_libras').disable();
      this.Gastos_de_VueloForm.get('aeronave_total_cad').disable();
      this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Estatus");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Estatus");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Observaciones");
      this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Observaciones");
      /*   this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_mxn', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_usd', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_eur', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_libras', 0); 
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_cad', 0); */
      this.Gastos_de_VueloForm.get('empleado_total_mxn').disable();
      this.Gastos_de_VueloForm.get('empleado_total_usd').disable();
      this.Gastos_de_VueloForm.get('empleado_total_eur').disable();
      this.Gastos_de_VueloForm.get('empleado_total_libras').disable();
      this.Gastos_de_VueloForm.get('empleado_total_cad').disable();
    }
    //TERMINA - BRID:2805


    //INICIA - BRID:2806 - 6.- al abrir la pantalla en NUEVO si el rol de usuario ES PILOTOseleccionar en automático el empleado con el usuario que entró al sistema - Autor: Felipe Rodríguez - Actualización: 4/23/2021 2:20:36 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 13) {
        this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Empleado", this.brf.EvaluaQuery(" select " + this.localStorageHelper.getLoggedUserInfo().Id, 1, "ABC123"), 1, "ABC123");
      } else { }
    }
    //TERMINA - BRID:2806


    //INICIA - BRID:2807 - 8.- al abrir la pantalla, en nuevo y modificar, si el rol de usuario ES PILOTOmostrar el campo de vuelo y obligatoriofiltrar el campo de vuelo para que solo aparezcan los vuelos donde el piloto esté como tripulantedeshabilitar el empleado - Autor: Francisco Javier Martínez Urbina - Actualización: 9/24/2021 7:15:52 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 13) {
        this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Numero_de_Vuelo");
        this.brf.SetRequiredControl(this.Gastos_de_VueloForm, "Numero_de_Vuelo");
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Empleado', 0);
      } else { }
    }
    //TERMINA - BRID:2807


    //INICIA - BRID:2808 - 7.- al abrir la pantalla, en modificar si el rol de usuario ES PILOTOfiltrar tramo para que solo aparezcan los tramos del vuelo seleccionado. - Autor: Felipe Rodríguez - Actualización: 4/23/2021 3:37:45 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 13) { } else { }
    }
    //TERMINA - BRID:2808


    //INICIA - BRID:2812 - PRUEBA FELIPE NO BORRAR - Autor: Felipe Rodríguez - Actualización: 4/23/2021 5:58:02 PM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.Gastos_de_VueloForm, "Folio", "1");
    }
    //TERMINA - BRID:2812


    //INICIA - BRID:2813 - 3.- Si el tipo de ingreso de gasto es mantenimiento hacer visible y obligatorio el combo de orden de trabajo, de lo contrario, ocultarlo. - Autor: Felipe Rodríguez - Actualización: 4/24/2021 12:15:37 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.Gastos_de_VueloForm.get('Tipo_de_Ingreso_de_Gasto').value == this.brf.TryParseInt('2', '2')) {
        this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
        this.brf.SetRequiredControl(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
      }
      else {
        this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
        this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
        this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Orden_de_Trabajo");
      }
    }
    //TERMINA - BRID:2813


    //INICIA - BRID:2824 - Asignar matricula - Autor: Lizeth Villa - Actualización: 4/27/2021 1:49:03 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId != 13) {
        this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Matricula", this.brf.EvaluaQuery(" select top 1 MATRICULA FROM Registro_de_vuelo WHERE  NO_VUELO = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123"), 1, "ABC123");
      } else { }
    }
    //TERMINA - BRID:2824


    //INICIA - BRID:2832 - si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje con codigo manual, no desactivar. - Autor: Administrador - Actualización: 5/3/2021 4:33:28 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("SELECT COUNT(*) from Solicitud_de_Vuelo where folio = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + " and estatus = 9	", 1, 'ABC123') == this.brf.TryParseInt('1', '1') &&
        this.brf.EvaluaQuery("if ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 1 or " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 9 ) begin select 1 end	", 1, 'ABC123') != this.brf.TryParseInt('1', '1')) {
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Tipo_de_Ingreso_de_Gasto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Orden_de_Trabajo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Tramo_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Salida', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Destino', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Fecha_de_Registro', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Empleado', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Anticipo_de_Viaticos', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Moneda', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Gastos_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Concepto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Monto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Moneda', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Forma_de_Pago', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Comprobante', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Autorizacion', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Gastos_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Concepto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Monto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Moneda', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Forma_de_Pago', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Comprobante', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Autorizacion', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Gastos_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Concepto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'MXN', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'USD', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'EUR', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'LIBRA', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_mxn', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_usd', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_eur', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_libras', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_mxn', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_usd', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_eur', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_libras', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Observaciones', 0);
        this.brf.ShowMessage("El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar");
      } else { }
    }
    //TERMINA - BRID:2832


    //INICIA - BRID:2850 - Si el rol es operaciones, deshabilitar todos los campos y ocultar el botón guardar. - Autor: Lizeth Villa - Actualización: 8/25/2021 7:40:43 PM
    if (this.operation == 'Update') {
      if (this.brf.EvaluaQuery("if " + this.localStorageHelper.getLoggedUserInfo().RoleId + " = 12 begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Tipo_de_Ingreso_de_Gasto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Orden_de_Trabajo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Tramo_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Salida', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Destino', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Fecha_de_Registro', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Empleado', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Anticipo_de_Viaticos', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Moneda', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Gastos_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Concepto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Monto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Moneda', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Forma_de_Pago', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Comprobante', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Autorizacion', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Gastos_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Concepto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Monto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Moneda', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Forma_de_Pago', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Comprobante', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Autorizacion', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Gastos_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Concepto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'MXN', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'USD', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'EUR', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'LIBRA', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_mxn', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_usd', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_eur', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_libras', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_mxn', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_usd', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_eur', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_libras', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Observaciones', 0);
      } else { }
    }
    //TERMINA - BRID:2850


    //INICIA - BRID:2869 - Filtrar combo Numero de Vuelo - Autor: Francisco Javier Martínez Urbina - Actualización: 9/24/2021 7:20:45 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 13) { } else { }
    }
    //TERMINA - BRID:2869


    //INICIA - BRID:3131 - ppp - Autor: Lizeth Villa - Actualización: 5/17/2021 11:30:01 AM
    if (this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Estatus");
    }
    //TERMINA - BRID:3131


    //INICIA - BRID:4120 - Al dar de alta y editar, si el rol es Operaciones filtrar los tramos y los tripulantes del vuelo con el que se está trabajando - Autor: ANgel Acuña - Actualización: 9/3/2021 12:59:56 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 12 || this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('9', '9')) { } else { }
    }
    //TERMINA - BRID:4120


    //INICIA - BRID:5678 - Habilitar todos los campos si es el vuelo es reabierto - Autor: Lizeth Villa - Actualización: 9/3/2021 5:34:29 PM
    if (this.operation == 'Update') {
      if (this.brf.EvaluaQuery("if ( ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 9) or  ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 12)) begin select 1 end ", 1, 'ABC123') == this.brf.TryParseInt('1', '1') &&
        this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + "", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Matricula', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Salida', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Destino', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_mxn', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_usd', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_eur', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_libras', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_mxn', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_usd', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_eur', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_libras', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'empleado_total_cad', 1);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'aeronave_total_cad', 1);
      } else { }
    }
    //TERMINA - BRID:5678


    //INICIA - BRID:6258 - asignar numero de vuelo para operaciones - Autor: Lizeth Villa - Actualización: 9/13/2021 5:29:44 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('12', '12')) {
        this._SpartanService.SetValueExecuteQuery(this.Gastos_de_VueloForm, "Numero_de_Vuelo", this.brf.EvaluaQuery(" select folio,numero_de_vuelo from Solicitud_de_Vuelo where  folio =  " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + " ", 1, "ABC123"), 1, "ABC123");
      } else { }
    }
    //TERMINA - BRID:6258


    //INICIA - BRID:6424 - Ocultar siempre los campos Tramo de vuelo, Salida y Destino. - Autor: Francisco Javier Martínez Urbina - Actualización: 9/23/2021 3:18:35 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Tramo_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Salida");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Destino");
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Tramo_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Salida', 0);
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Destino', 0);
      this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Tramo_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, 'Observaciones');
      this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Tramo_de_Vuelo");
      this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Salida");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Salida");
      this.brf.HideFieldOfForm(this.Gastos_de_VueloForm, "Destino");
      this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Destino");
    }
    //TERMINA - BRID:6424


    //INICIA - BRID:6426 - 3.- Al editar si el Rol es operaciones o Administrador del Sistema deshabilitar los campos Tipo de Ingreso de Gasto y Número de vuelo. - Autor: Francisco Javier Martínez Urbina - Actualización: 9/23/2021 3:30:30 PM
    if (this.operation == 'Update') {
      //if(  EvaluaOperatorIn (this.localStorageHelper.getLoggedUserInfo().RoleId, this.brf.TryParseInt('12,9', '12,9') ) ) { this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Tipo_de_Ingreso_de_Gasto', 0);this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Numero_de_Vuelo', 0); this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Tipo_de_Ingreso_de_Gasto");this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Numero_de_Vuelo");} else {}
    }
    //TERMINA - BRID:6426


    //INICIA - BRID:6428 - 7.- Al editar, si el Rol es distinto de Operaciones y distinto de Administrador del Sistema:Deshabilitar los campos: Tipo de Ingreso de Gasto, Número de Vuelo, Matrícula y Empleado. - Autor: Francisco Javier Martínez Urbina - Actualización: 9/23/2021 4:03:35 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId != this.brf.TryParseInt('12', '12') && this.localStorageHelper.getLoggedUserInfo().RoleId != this.brf.TryParseInt('9', '9')) {
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Tipo_de_Ingreso_de_Gasto', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Empleado', 0);
        this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Tipo_de_Ingreso_de_Gasto");
        this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Numero_de_Vuelo");
        this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Matricula");
        this.brf.SetNotRequiredControl(this.Gastos_de_VueloForm, "Empleado");
      } else { }
    }
    //TERMINA - BRID:6428


    //INICIA - BRID:6430 - 9.- Al editar, si es Operaciones o Administrador del Sistema, en el campo de Empleado le deben aparecer todos los que integren la tripulación del vuelo. uspObtenerTripulacionVuelo - Autor: Francisco Javier Martínez Urbina - Actualización: 9/24/2021 10:53:48 AM
    if (this.operation == 'Update') {
      //if(  EvaluaOperatorIn (this.localStorageHelper.getLoggedUserInfo().RoleId, this.brf.TryParseInt('9,12', '9,12') ) ) { } else {}
    }
    //TERMINA - BRID:6430


    //INICIA - BRID:6435 - Al editar, desabilitar el campo Fecha de Registro y no obligatorio - Autor: Francisco Javier Martínez Urbina - Actualización: 9/24/2021 9:48:12 AM
    if (this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Fecha_de_Registro', 0);
    }
    //TERMINA - BRID:6435


    //INICIA - BRID:6520 - Deshabilitar campo empleado con rol piloto y operaciones - Autor: Lizeth Villa - Actualización: 9/27/2021 4:57:45 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 13 || this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('12', '12')) { this.brf.SetEnabledControl(this.Gastos_de_VueloForm, 'Empleado', 0); } else { }
    }
    //TERMINA - BRID:6520

    //rulesOnInit_ExecuteBusinessRulesEnd






























  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:1878 - En nuevo, después de guardar asignar numero de vuelo - Autor: Lizeth Villa - Actualización: 4/28/2021 9:08:20 PM
    if (this.operation == 'New') {
      this._SpartanService.SetValueExecuteQueryFG(" update Gastos_de_Vuelo set Numero_de_Vuelo= " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + " where Folio= " + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted), 1, "ABC123");
    }
    //TERMINA - BRID:1878

    //rulesAfterSave_ExecuteBusinessRulesEnd

  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:2809 -  Al dar de alta, antes de guardar, si existe otro registro para el mismo vuelo y mismo tramo y mismo empleado pero distinta fecha que aparezca el mensaje y no dejar guardar. - Autor: Lizeth Villa - Actualización: 4/26/2021 10:40:06 AM
    if (this.operation == 'New') {
      if (this.brf.EvaluaQuery("SELECT COUNT(*) FROM Gastos_de_Vuelo WHERE Numero_de_Vuelo = '" + this.Gastos_de_VueloForm.get('Numero_de_Vuelo').value + "' and TRAMO_DE_VUELO = '" + this.Gastos_de_VueloForm.get('Tramo_de_Vuelo').value + "' and Empleado = '" + this.Gastos_de_VueloForm.get('Empleado').value + "' and Fecha_de_Registro = convert(date, '" + this.Gastos_de_VueloForm.get('Fecha_de_Registro').value + "', 105) ", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.ShowMessage(" Ya existe un registro de gastos de vuelo en la misma fecha, favor de revisar");

        result = false;
      } else { }
    }
    //TERMINA - BRID:2809


    //INICIA - BRID:2873 - Mostrar mensaje cuando salida o destino están nulos  - Autor: Francisco Javier Martínez Urbina - Actualización: 9/24/2021 7:58:38 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.Gastos_de_VueloForm.get('Salida').value == this.brf.TryParseInt('null', 'null') || this.Gastos_de_VueloForm.get('Destino').value == this.brf.TryParseInt('null', 'null')) {
        this.brf.ShowMessage("No es posible registrar gastos de vuelo si el tramo seleccionado no tiene una ejecución de vuelo. Favor de revisar.");

        result = false;
      } else { }
    }
    //TERMINA - BRID:2873

    //rulesBeforeSave_ExecuteBusinessRulesEnd


    return result;
  }

  //Fin de reglas

}
