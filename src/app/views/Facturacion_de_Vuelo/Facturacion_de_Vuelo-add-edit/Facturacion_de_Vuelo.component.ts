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
import { Facturacion_de_VueloService } from 'src/app/api-services/Facturacion_de_Vuelo.service';
import { Facturacion_de_Vuelo } from 'src/app/models/Facturacion_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Detalle_de_tramos_a_facturarService } from 'src/app/api-services/Detalle_de_tramos_a_facturar.service';
import { Detalle_de_tramos_a_facturar } from 'src/app/models/Detalle_de_tramos_a_facturar';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';

import { Estatus_de_facturacion_de_vueloService } from 'src/app/api-services/Estatus_de_facturacion_de_vuelo.service';
import { Estatus_de_facturacion_de_vuelo } from 'src/app/models/Estatus_de_facturacion_de_vuelo';
import { Facturacion_de_vuelos_por_tramoService } from 'src/app/api-services/Facturacion_de_vuelos_por_tramo.service';
import { Facturacion_de_vuelos_por_tramo } from 'src/app/models/Facturacion_de_vuelos_por_tramo';
import { Cliente_FacturacionService } from 'src/app/api-services/Cliente_Facturacion.service';
import { Cliente_Facturacion } from 'src/app/models/Cliente_Facturacion';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { SpartanService } from "src/app/api-services/spartan.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { q } from 'src/app/models/business-rules/business-rule-query.model';


@Component({
  selector: 'app-Facturacion_de_Vuelo',
  templateUrl: './Facturacion_de_Vuelo.component.html',
  styleUrls: ['./Facturacion_de_Vuelo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Facturacion_de_VueloComponent implements OnInit, AfterViewInit {
MRaddFacturacion_de_vuelo_por_tramo: boolean = false;
MRaddTramos_a_Facturar: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  isValidCompany: boolean = false;

  Facturacion_de_VueloForm: FormGroup;
  public Editor = ClassicEditor;
  model: Facturacion_de_Vuelo;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsVuelo: Observable<Solicitud_de_Vuelo[]>;
  hasOptionsVuelo: boolean;
  isLoadingVuelo: boolean;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  optionsModelo: Observable<Modelos[]>;
  hasOptionsModelo: boolean;
  isLoadingModelo: boolean;
  optionsCliente: Observable<Cliente[]>;
  hasOptionsCliente: boolean;
  isLoadingCliente: boolean;
  optionsSolicitante_1: Observable<Spartan_User[]>;
  hasOptionsSolicitante_1: boolean;
  isLoadingSolicitante_1: boolean;
  public varAeropuertos: Aeropuertos[] = [];
  public varRegistro_de_vuelo: Registro_de_vuelo[] = [];

  autoOrigen_Detalle_de_tramos_a_facturar = new FormControl();
  SelectedOrigen_Detalle_de_tramos_a_facturar: string[] = [];
  isLoadingOrigen_Detalle_de_tramos_a_facturar: boolean;
  searchOrigen_Detalle_de_tramos_a_facturarCompleted: boolean;
  autoDestino_Detalle_de_tramos_a_facturar = new FormControl();
  SelectedDestino_Detalle_de_tramos_a_facturar: string[] = [];
  isLoadingDestino_Detalle_de_tramos_a_facturar: boolean;
  searchDestino_Detalle_de_tramos_a_facturarCompleted: boolean;

  optionsEstatus: Observable<Estatus_de_facturacion_de_vuelo[]>;
  hasOptionsEstatus: boolean;
  isLoadingEstatus: boolean;
  public varCliente_Facturacion: Cliente_Facturacion[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceTramos_a_Facturar = new MatTableDataSource<Detalle_de_tramos_a_facturar>();
  Tramos_a_FacturarColumns = [
    { def: 'actions', hide: false },
    { def: 'Origen', hide: false },
    { def: 'Destino', hide: false },
    { def: 'Pasajeros', hide: false },
    { def: 'Salida', hide: false },
    { def: 'Llegada', hide: false },
    { def: 'Vuelo', hide: false },
    { def: 'Calzo', hide: false },
    { def: 'Espera', hide: false },
    { def: 'Espera_real', hide: false },
    { def: 'Pernocta', hide: false },
    { def: 'Tramo', hide: false },

  ];
  Tramos_a_FacturarData: Detalle_de_tramos_a_facturar[] = [];
  dataSourceFacturacion_de_vuelo_por_tramo = new MatTableDataSource<Facturacion_de_vuelos_por_tramo>();
  Facturacion_de_vuelo_por_tramoColumns = [
    { def: 'actions', hide: false },
    { def: 'Numero_de_Tramo', hide: false },
    { def: 'Monto_de_Tramo', hide: false },
    { def: 'Porcentaje', hide: false },
    { def: 'Empresa_Sugerida', hide: false },
    { def: 'Empresa_Seleccionada', hide: false },

  ];
  Facturacion_de_vuelo_por_tramoData: Facturacion_de_vuelos_por_tramo[] = [];

  today = new Date;
  consult: boolean = false;
  isDisabled: boolean = true;
  isHidden: boolean = true;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Facturacion_de_VueloService: Facturacion_de_VueloService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private ClienteService: ClienteService,
    private Spartan_UserService: Spartan_UserService,
    private Detalle_de_tramos_a_facturarService: Detalle_de_tramos_a_facturarService,
    private AeropuertosService: AeropuertosService,
    private Registro_de_vueloService: Registro_de_vueloService,
    private Estatus_de_facturacion_de_vueloService: Estatus_de_facturacion_de_vueloService,
    private Facturacion_de_vuelos_por_tramoService: Facturacion_de_vuelos_por_tramoService,
    private Cliente_FacturacionService: Cliente_FacturacionService,
    private _seguridad: SeguridadService,

    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private SpartanService: SpartanService,
    renderer: Renderer2) {

    this.brf = new BusinessRulesFunctions(renderer, SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Facturacion_de_Vuelo(this.fb);
    this.Facturacion_de_VueloForm = this.model.buildFormGroup();
    this.Tramos_a_FacturarItems.removeAt(0);
    this.Facturacion_de_vuelo_por_tramoItems.removeAt(0);

    this.Facturacion_de_VueloForm.get('Folio').disable();
    this.Facturacion_de_VueloForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceTramos_a_Facturar.paginator = this.paginator;
    this.dataSourceFacturacion_de_vuelo_por_tramo.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Tramos_a_FacturarColumns.splice(0, 1);
        this.Facturacion_de_vuelo_por_tramoColumns.splice(0, 1);

        this.Facturacion_de_VueloForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Facturacion_de_Vuelo).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Facturacion_de_VueloForm, 'Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Facturacion_de_VueloForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Facturacion_de_VueloForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Facturacion_de_VueloForm, 'Cliente', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Facturacion_de_VueloForm, 'Solicitante_1', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Facturacion_de_VueloForm, 'Estatus', [CustomValidators.autocompleteObjectValidator(), Validators.required]);


    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Facturacion_de_VueloService.listaSelAll(0, 1, 'Facturacion_de_Vuelo.Folio=' + id).toPromise();
    if (result.Facturacion_de_Vuelos.length > 0) {
      let fTramos_a_Facturar = await this.Detalle_de_tramos_a_facturarService.listaSelAll(0, 1000, 'Facturacion_de_Vuelo.Folio=' + id).toPromise();
      this.Tramos_a_FacturarData = fTramos_a_Facturar.Detalle_de_tramos_a_facturars;
      this.loadTramos_a_Facturar(fTramos_a_Facturar.Detalle_de_tramos_a_facturars);
      this.dataSourceTramos_a_Facturar = new MatTableDataSource(fTramos_a_Facturar.Detalle_de_tramos_a_facturars);
      this.dataSourceTramos_a_Facturar.paginator = this.paginator;
      this.dataSourceTramos_a_Facturar.sort = this.sort;

      await this.Facturacion_de_vuelos_por_tramoService
        .listaSelAll(0, 1000, 'Facturacion_de_Vuelo.Folio=' + id).toPromise().then(fFacturacion_de_vuelo_por_tramo => {

          this.Facturacion_de_vuelo_por_tramoData = fFacturacion_de_vuelo_por_tramo.Facturacion_de_vuelos_por_tramos;

          fFacturacion_de_vuelo_por_tramo.Facturacion_de_vuelos_por_tramos.forEach(element => {
            this.varCliente_Facturacion.forEach(option => {
              if (element.Empresa_Seleccionada_Cliente_Facturacion.Clave == option.Clave) {
                element.Empresa_Seleccionada_Cliente_Facturacion.Nombre = option.Nombre
              }
            });
          });

          console.log(fFacturacion_de_vuelo_por_tramo)
          console.log(fFacturacion_de_vuelo_por_tramo.Facturacion_de_vuelos_por_tramos)

          this.loadFacturacion_de_vuelo_por_tramo(fFacturacion_de_vuelo_por_tramo.Facturacion_de_vuelos_por_tramos);
          this.dataSourceFacturacion_de_vuelo_por_tramo = new MatTableDataSource(fFacturacion_de_vuelo_por_tramo.Facturacion_de_vuelos_por_tramos);
          this.dataSourceFacturacion_de_vuelo_por_tramo.paginator = this.paginator;
          this.dataSourceFacturacion_de_vuelo_por_tramo.sort = this.sort;
        });

      this.model.fromObject(result.Facturacion_de_Vuelos[0]);

      if (this.operation == 'Update') {
        this.brf.SetCurrentDateToField(this.Facturacion_de_VueloForm, "Fecha");
        this.brf.SetCurrentHourToField(this.Facturacion_de_VueloForm, "Hora");
        this.brf.SetCurrentDateToField(this.Facturacion_de_VueloForm, "Fecha_de_la_factura");
      }

      this.Facturacion_de_VueloForm.get('Vuelo').setValue(
        result.Facturacion_de_Vuelos[0].Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        { onlySelf: false, emitEvent: true }
      );
      this.Facturacion_de_VueloForm.get('Matricula').setValue(
        result.Facturacion_de_Vuelos[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.Facturacion_de_VueloForm.get('Modelo').setValue(
        result.Facturacion_de_Vuelos[0].Modelo_Modelos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Facturacion_de_VueloForm.get('Cliente').setValue(
        result.Facturacion_de_Vuelos[0].Cliente_Cliente.Razon_Social,
        { onlySelf: false, emitEvent: true }
      );
      this.Facturacion_de_VueloForm.get('Solicitante_1').setValue(
        result.Facturacion_de_Vuelos[0].Solicitante_1_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );

      this.Facturacion_de_VueloForm.get('Estatus').setValue(
        result.Facturacion_de_Vuelos[0].Estatus_Estatus_de_facturacion_de_vuelo,
        { onlySelf: false, emitEvent: true }
      );

      this.showMessageByEstatus();

      this.Facturacion_de_VueloForm.markAllAsTouched();
      this.Facturacion_de_VueloForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  //#region Tramos a Facturar

  get Tramos_a_FacturarItems() {
    return this.Facturacion_de_VueloForm.get('Detalle_de_tramos_a_facturarItems') as FormArray;
  }

  getTramos_a_FacturarColumns(): string[] {
    return this.Tramos_a_FacturarColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadTramos_a_Facturar(Tramos_a_Facturar: Detalle_de_tramos_a_facturar[]) {
    Tramos_a_Facturar.forEach(element => {
      this.addTramos_a_Facturar(element);
    });
  }

  addTramos_a_FacturarToMR() {
    const Tramos_a_Facturar = new Detalle_de_tramos_a_facturar(this.fb);
    this.Tramos_a_FacturarData.push(this.addTramos_a_Facturar(Tramos_a_Facturar));
    this.dataSourceTramos_a_Facturar.data = this.Tramos_a_FacturarData;
    Tramos_a_Facturar.edit = true;
    Tramos_a_Facturar.isNew = true;
    const length = this.dataSourceTramos_a_Facturar.data.length;
    const index = length - 1;
    const formTramos_a_Facturar = this.Tramos_a_FacturarItems.controls[index] as FormGroup;
    this.addFilterToControlOrigen_Detalle_de_tramos_a_facturar(formTramos_a_Facturar.controls.Origen, index);
    this.addFilterToControlDestino_Detalle_de_tramos_a_facturar(formTramos_a_Facturar.controls.Destino, index);

    const page = Math.ceil(this.dataSourceTramos_a_Facturar.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addTramos_a_Facturar(entity: Detalle_de_tramos_a_facturar) {
    const Tramos_a_Facturar = new Detalle_de_tramos_a_facturar(this.fb);
    this.Tramos_a_FacturarItems.push(Tramos_a_Facturar.buildFormGroup());
    if (entity) {
      Tramos_a_Facturar.fromObject(entity);
    }
    return entity;
  }

  Tramos_a_FacturarItemsByFolio(Folio: number): FormGroup {
    return (this.Facturacion_de_VueloForm.get('Detalle_de_tramos_a_facturarItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Tramos_a_FacturarItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    let fb = this.Tramos_a_FacturarItems.controls[index] as FormGroup;
    return fb;
  }

  deleteTramos_a_Facturar(element: any) {
    let index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    this.Tramos_a_FacturarData[index].IsDeleted = true;
    this.dataSourceTramos_a_Facturar.data = this.Tramos_a_FacturarData;
    this.dataSourceTramos_a_Facturar._updateChangeSubscription();
    index = this.dataSourceTramos_a_Facturar.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditTramos_a_Facturar(element: any) {
    let index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Tramos_a_FacturarData[index].IsDeleted = true;
      this.dataSourceTramos_a_Facturar.data = this.Tramos_a_FacturarData;
      this.dataSourceTramos_a_Facturar._updateChangeSubscription();
      index = this.Tramos_a_FacturarData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveTramos_a_Facturar(element: any) {
    const index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    const formTramos_a_Facturar = this.Tramos_a_FacturarItems.controls[index] as FormGroup;
    if (this.Tramos_a_FacturarData[index].Origen !== formTramos_a_Facturar.value.Origen && formTramos_a_Facturar.value.Origen > 0) {
      let aeropuertos = await this.AeropuertosService.getById(formTramos_a_Facturar.value.Origen).toPromise();
      this.Tramos_a_FacturarData[index].Origen_Aeropuertos = aeropuertos;
    }
    this.Tramos_a_FacturarData[index].Origen = formTramos_a_Facturar.value.Origen;
    if (this.Tramos_a_FacturarData[index].Destino !== formTramos_a_Facturar.value.Destino && formTramos_a_Facturar.value.Destino > 0) {
      let aeropuertos = await this.AeropuertosService.getById(formTramos_a_Facturar.value.Destino).toPromise();
      this.Tramos_a_FacturarData[index].Destino_Aeropuertos = aeropuertos;
    }
    this.Tramos_a_FacturarData[index].Destino = formTramos_a_Facturar.value.Destino;
    this.Tramos_a_FacturarData[index].Pasajeros = formTramos_a_Facturar.value.Pasajeros;
    this.Tramos_a_FacturarData[index].Salida = formTramos_a_Facturar.value.Salida;
    this.Tramos_a_FacturarData[index].Llegada = formTramos_a_Facturar.value.Llegada;
    this.Tramos_a_FacturarData[index].Vuelo = formTramos_a_Facturar.value.Vuelo;
    this.Tramos_a_FacturarData[index].Calzo = formTramos_a_Facturar.value.Calzo;
    this.Tramos_a_FacturarData[index].Espera = formTramos_a_Facturar.value.Espera;
    this.Tramos_a_FacturarData[index].Espera_real = formTramos_a_Facturar.value.Espera_real;
    this.Tramos_a_FacturarData[index].Pernocta = formTramos_a_Facturar.value.Pernocta;
    this.Tramos_a_FacturarData[index].Tramo = formTramos_a_Facturar.value.Tramo;
    this.Tramos_a_FacturarData[index].Tramo_Registro_de_vuelo = formTramos_a_Facturar.value.Tramo !== '' ?
      this.varRegistro_de_vuelo.filter(d => d.Folio === formTramos_a_Facturar.value.Tramo)[0] : null;

    this.Tramos_a_FacturarData[index].isNew = false;
    this.dataSourceTramos_a_Facturar.data = this.Tramos_a_FacturarData;
    this.dataSourceTramos_a_Facturar._updateChangeSubscription();
  }

  editTramos_a_Facturar(element: any) {
    const index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    const formTramos_a_Facturar = this.Tramos_a_FacturarItems.controls[index] as FormGroup;
    this.SelectedOrigen_Detalle_de_tramos_a_facturar[index] = this.dataSourceTramos_a_Facturar.data[index].Origen_Aeropuertos.Nombre;
    this.addFilterToControlOrigen_Detalle_de_tramos_a_facturar(formTramos_a_Facturar.controls.Origen, index);
    this.SelectedDestino_Detalle_de_tramos_a_facturar[index] = this.dataSourceTramos_a_Facturar.data[index].Destino_Aeropuertos.Nombre;
    this.addFilterToControlDestino_Detalle_de_tramos_a_facturar(formTramos_a_Facturar.controls.Destino, index);

    element.edit = true;
  }

  async saveDetalle_de_tramos_a_facturar(Folio: number) {
    this.dataSourceTramos_a_Facturar.data.forEach(async (d, index) => {
      const data = this.Tramos_a_FacturarItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Facturacion_de_Vuelo = Folio;

      if (model.Folio === 0) {
        // Add Tramos de vuelo
        let response = await this.Detalle_de_tramos_a_facturarService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formTramos_a_Facturar = this.Tramos_a_FacturarItemsByFolio(model.Folio);
        if (formTramos_a_Facturar.dirty) {
          // Update Tramos de vuelo
          let response = await this.Detalle_de_tramos_a_facturarService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Tramos de vuelo
        await this.Detalle_de_tramos_a_facturarService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectOrigen_Detalle_de_tramos_a_facturar(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedOrigen_Detalle_de_tramos_a_facturar[index] = event.option.viewValue;
    let fgr = this.Facturacion_de_VueloForm.controls.Detalle_de_tramos_a_facturarItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Origen.setValue(event.option.value);
    this.displayFnOrigen_Detalle_de_tramos_a_facturar(element);
  }

  displayFnOrigen_Detalle_de_tramos_a_facturar(this, element) {
    const index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    return this.SelectedOrigen_Detalle_de_tramos_a_facturar[index];
  }

  updateOptionOrigen_Detalle_de_tramos_a_facturar(event, element: any) {
    const index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    this.SelectedOrigen_Detalle_de_tramos_a_facturar[index] = event.source.viewValue;
  }

  _filterOrigen_Detalle_de_tramos_a_facturar(filter: any): Observable<Aeropuertos> {
    const where = filter !== '' ? "Aeropuertos.Nombre like '%" + filter + "%'" : '';
    return this.AeropuertosService.listaSelAll(0, 20, where);
  }

  addFilterToControlOrigen_Detalle_de_tramos_a_facturar(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingOrigen_Detalle_de_tramos_a_facturar = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingOrigen_Detalle_de_tramos_a_facturar = true;
        return this._filterOrigen_Detalle_de_tramos_a_facturar(value || '');
      })
    ).subscribe(result => {
      this.varAeropuertos = result.Aeropuertoss;
      this.isLoadingOrigen_Detalle_de_tramos_a_facturar = false;
      this.searchOrigen_Detalle_de_tramos_a_facturarCompleted = true;
      this.SelectedOrigen_Detalle_de_tramos_a_facturar[index] = this.varAeropuertos.length === 0 ? '' : this.SelectedOrigen_Detalle_de_tramos_a_facturar[index];
    });
  }

  public selectDestino_Detalle_de_tramos_a_facturar(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedDestino_Detalle_de_tramos_a_facturar[index] = event.option.viewValue;
    let fgr = this.Facturacion_de_VueloForm.controls.Detalle_de_tramos_a_facturarItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Destino.setValue(event.option.value);
    this.displayFnDestino_Detalle_de_tramos_a_facturar(element);
  }

  displayFnDestino_Detalle_de_tramos_a_facturar(this, element) {
    const index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    return this.SelectedDestino_Detalle_de_tramos_a_facturar[index];
  }

  updateOptionDestino_Detalle_de_tramos_a_facturar(event, element: any) {
    const index = this.dataSourceTramos_a_Facturar.data.indexOf(element);
    this.SelectedDestino_Detalle_de_tramos_a_facturar[index] = event.source.viewValue;
  }

  _filterDestino_Detalle_de_tramos_a_facturar(filter: any): Observable<Aeropuertos> {
    const where = filter !== '' ? "Aeropuertos.Nombre like '%" + filter + "%'" : '';
    return this.AeropuertosService.listaSelAll(0, 20, where);
  }

  addFilterToControlDestino_Detalle_de_tramos_a_facturar(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingDestino_Detalle_de_tramos_a_facturar = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingDestino_Detalle_de_tramos_a_facturar = true;
        return this._filterDestino_Detalle_de_tramos_a_facturar(value || '');
      })
    ).subscribe(result => {
      this.varAeropuertos = result.Aeropuertoss;
      this.isLoadingDestino_Detalle_de_tramos_a_facturar = false;
      this.searchDestino_Detalle_de_tramos_a_facturarCompleted = true;
      this.SelectedDestino_Detalle_de_tramos_a_facturar[index] = this.varAeropuertos.length === 0 ? '' : this.SelectedDestino_Detalle_de_tramos_a_facturar[index];
    });
  }

  //#endregion

  //#region Facturacion de Vuelo por Tramo

  get Facturacion_de_vuelo_por_tramoItems() {
    return this.Facturacion_de_VueloForm.get('Facturacion_de_vuelos_por_tramoItems') as FormArray;
  }

  getFacturacion_de_vuelo_por_tramoColumns(): string[] {
    return this.Facturacion_de_vuelo_por_tramoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadFacturacion_de_vuelo_por_tramo(Facturacion_de_vuelo_por_tramo: Facturacion_de_vuelos_por_tramo[]) {
    Facturacion_de_vuelo_por_tramo.forEach(element => {
      this.addFacturacion_de_vuelo_por_tramo(element);
    });
  }

  addFacturacion_de_vuelo_por_tramoToMR() {
    const Facturacion_de_vuelo_por_tramo = new Facturacion_de_vuelos_por_tramo(this.fb);
    this.Facturacion_de_vuelo_por_tramoData.push(this.addFacturacion_de_vuelo_por_tramo(Facturacion_de_vuelo_por_tramo));
    this.dataSourceFacturacion_de_vuelo_por_tramo.data = this.Facturacion_de_vuelo_por_tramoData;
    Facturacion_de_vuelo_por_tramo.edit = true;
    Facturacion_de_vuelo_por_tramo.isNew = true;
    const length = this.dataSourceFacturacion_de_vuelo_por_tramo.data.length;
    const index = length - 1;
    const formFacturacion_de_vuelo_por_tramo = this.Facturacion_de_vuelo_por_tramoItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceFacturacion_de_vuelo_por_tramo.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addFacturacion_de_vuelo_por_tramo(entity: Facturacion_de_vuelos_por_tramo) {
    const Facturacion_de_vuelo_por_tramo = new Facturacion_de_vuelos_por_tramo(this.fb);
    this.Facturacion_de_vuelo_por_tramoItems.push(Facturacion_de_vuelo_por_tramo.buildFormGroup());
    if (entity) {
      Facturacion_de_vuelo_por_tramo.fromObject(entity);
    }
    return entity;
  }

  Facturacion_de_vuelo_por_tramoItemsByFolio(Folio: number): FormGroup {
    return (this.Facturacion_de_VueloForm.get('Facturacion_de_vuelos_por_tramoItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Facturacion_de_vuelo_por_tramoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceFacturacion_de_vuelo_por_tramo.data.indexOf(element);
    let fb = this.Facturacion_de_vuelo_por_tramoItems.controls[index] as FormGroup;
    return fb;
  }

  deleteFacturacion_de_vuelo_por_tramo(element: any) {
    let index = this.dataSourceFacturacion_de_vuelo_por_tramo.data.indexOf(element);
    this.Facturacion_de_vuelo_por_tramoData[index].IsDeleted = true;
    this.dataSourceFacturacion_de_vuelo_por_tramo.data = this.Facturacion_de_vuelo_por_tramoData;
    this.dataSourceFacturacion_de_vuelo_por_tramo._updateChangeSubscription();
    index = this.dataSourceFacturacion_de_vuelo_por_tramo.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditFacturacion_de_vuelo_por_tramo(element: any) {
    let index = this.dataSourceFacturacion_de_vuelo_por_tramo.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Facturacion_de_vuelo_por_tramoData[index].IsDeleted = true;
      this.dataSourceFacturacion_de_vuelo_por_tramo.data = this.Facturacion_de_vuelo_por_tramoData;
      this.dataSourceFacturacion_de_vuelo_por_tramo._updateChangeSubscription();
      index = this.Facturacion_de_vuelo_por_tramoData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveFacturacion_de_vuelo_por_tramo(element: any) {
    const index = this.dataSourceFacturacion_de_vuelo_por_tramo.data.indexOf(element);
    const formFacturacion_de_vuelo_por_tramo = this.Facturacion_de_vuelo_por_tramoItems.controls[index] as FormGroup;
    this.Facturacion_de_vuelo_por_tramoData[index].Numero_de_Tramo = formFacturacion_de_vuelo_por_tramo.value.Numero_de_Tramo;
    this.Facturacion_de_vuelo_por_tramoData[index].Tramo = formFacturacion_de_vuelo_por_tramo.value.Tramo;
    this.Facturacion_de_vuelo_por_tramoData[index].Monto_de_Tramo = formFacturacion_de_vuelo_por_tramo.value.Monto_de_Tramo;
    this.Facturacion_de_vuelo_por_tramoData[index].Porcentaje = formFacturacion_de_vuelo_por_tramo.value.Porcentaje;
    this.Facturacion_de_vuelo_por_tramoData[index].Empresa_Sugerida = formFacturacion_de_vuelo_por_tramo.value.Empresa_Sugerida;
    this.Facturacion_de_vuelo_por_tramoData[index].Empresa_Sugerida_Cliente_Facturacion = formFacturacion_de_vuelo_por_tramo.value.Empresa_Sugerida !== '' ?
      this.varCliente_Facturacion.filter(d => d.Clave === formFacturacion_de_vuelo_por_tramo.value.Empresa_Sugerida)[0] : null;
    this.Facturacion_de_vuelo_por_tramoData[index].Empresa_Seleccionada = formFacturacion_de_vuelo_por_tramo.value.Empresa_Seleccionada;
    this.Facturacion_de_vuelo_por_tramoData[index].Empresa_Seleccionada_Cliente_Facturacion = formFacturacion_de_vuelo_por_tramo.value.Empresa_Seleccionada !== '' ?
      this.varCliente_Facturacion.filter(d => d.Clave === formFacturacion_de_vuelo_por_tramo.value.Empresa_Seleccionada)[0] : null;

    this.Facturacion_de_vuelo_por_tramoData[index].isNew = false;
    this.dataSourceFacturacion_de_vuelo_por_tramo.data = this.Facturacion_de_vuelo_por_tramoData;
    this.dataSourceFacturacion_de_vuelo_por_tramo._updateChangeSubscription();
  }

  editFacturacion_de_vuelo_por_tramo(element: any) {
    const index = this.dataSourceFacturacion_de_vuelo_por_tramo.data.indexOf(element);
    const formFacturacion_de_vuelo_por_tramo = this.Facturacion_de_vuelo_por_tramoItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveFacturacion_de_vuelos_por_tramo(Folio: number) {
    this.dataSourceFacturacion_de_vuelo_por_tramo.data.forEach(async (element, index) => {

      const data = this.Facturacion_de_vuelo_por_tramoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Facturacion_de_Vuelo = Folio;

      model.Empresa_Seleccionada = element.Empresa_Seleccionada
      model.id_Facturacion_de_vuelo = Folio;

      if (model.Folio === 0) {
        // Add Facturación de vuelo por tramo
        let response = await this.Facturacion_de_vuelos_por_tramoService.insert(model).toPromise();
      } else if (model.Folio > 0 && !element.IsDeleted) {
        const formFacturacion_de_vuelo_por_tramo = this.Facturacion_de_vuelo_por_tramoItemsByFolio(model.Folio);
        if (formFacturacion_de_vuelo_por_tramo) {
          // Update Facturación de vuelo por tramo
          let response = await this.Facturacion_de_vuelos_por_tramoService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && element.IsDeleted) {
        // delete Facturación de vuelo por tramo
        await this.Facturacion_de_vuelos_por_tramoService.delete(model.Folio).toPromise();
      }
    });
  }

  //#endregion

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Facturacion_de_VueloForm.disabled ? "Update" : this.operation;
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
    this.spinner.show('loading');
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Registro_de_vueloService.getAll());
    observablesArray.push(this.Cliente_FacturacionService.getAll());

    if (observablesArray.length > 0) {

      forkJoin(observablesArray)
        .subscribe(([varRegistro_de_vuelo,]) => {
          this.varRegistro_de_vuelo = varRegistro_de_vuelo;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Facturacion_de_VueloForm.get('Vuelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingVuelo = true),
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
      this.isLoadingVuelo = false;
      this.hasOptionsVuelo = result?.Solicitud_de_Vuelos?.length > 0;
      this.Facturacion_de_VueloForm.get('Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
      this.optionsVuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingVuelo = false;
      this.hasOptionsVuelo = false;
      this.optionsVuelo = of([]);
    });
    this.Facturacion_de_VueloForm.get('Matricula').valueChanges.pipe(
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
      this.Facturacion_de_VueloForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Facturacion_de_VueloForm.get('Modelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingModelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.ModelosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.ModelosService.listaSelAll(0, 20, '');
          return this.ModelosService.listaSelAll(0, 20,
            "Modelos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.ModelosService.listaSelAll(0, 20,
          "Modelos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = result?.Modeloss?.length > 0;
      this.Facturacion_de_VueloForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Facturacion_de_VueloForm.get('Cliente').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCliente = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.ClienteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.ClienteService.listaSelAll(0, 20, '');
          return this.ClienteService.listaSelAll(0, 20,
            "Cliente.Razon_Social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.ClienteService.listaSelAll(0, 20,
          "Cliente.Razon_Social like '%" + value.Razon_Social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCliente = false;
      this.hasOptionsCliente = result?.Clientes?.length > 0;
      this.Facturacion_de_VueloForm.get('Cliente').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });
      this.optionsCliente = of(result?.Clientes);
    }, error => {
      this.isLoadingCliente = false;
      this.hasOptionsCliente = false;
      this.optionsCliente = of([]);
    });
    this.Facturacion_de_VueloForm.get('Solicitante_1').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingSolicitante_1 = true),
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
      this.isLoadingSolicitante_1 = false;
      this.hasOptionsSolicitante_1 = result?.Spartan_Users?.length > 0;
      this.Facturacion_de_VueloForm.get('Solicitante_1').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      this.optionsSolicitante_1 = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingSolicitante_1 = false;
      this.hasOptionsSolicitante_1 = false;
      this.optionsSolicitante_1 = of([]);
    });
    this.Facturacion_de_VueloForm.get('Estatus').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEstatus = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Estatus_de_facturacion_de_vueloService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Estatus_de_facturacion_de_vueloService.listaSelAll(0, 20, '');
          return this.Estatus_de_facturacion_de_vueloService.listaSelAll(0, 20,
            "Estatus_de_facturacion_de_vuelo.Estatus like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Estatus_de_facturacion_de_vueloService.listaSelAll(0, 20,
          "Estatus_de_facturacion_de_vuelo.Estatus like '%" + value.Estatus.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = result?.Estatus_de_facturacion_de_vuelos?.length > 0;
      this.Facturacion_de_VueloForm.get('Estatus').setValue(result?.Estatus_de_facturacion_de_vuelos[0], { onlySelf: true, emitEvent: false });
      this.optionsEstatus = of(result?.Estatus_de_facturacion_de_vuelos);
    }, error => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = false;
      this.optionsEstatus = of([]);
    });

    console.log("populate: ", this.Facturacion_de_VueloForm);
  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tramo': {
        this.Registro_de_vueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRegistro_de_vuelo = x.Registro_de_vuelos;
        });
        break;
      }

      case 'Empresa_Sugerida': {
        this.Cliente_FacturacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCliente_Facturacion = x.Cliente_Facturacions;
        });
        break;
      }
      case 'Empresa_Seleccionada': {
        this.Cliente_FacturacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCliente_Facturacion = x.Cliente_Facturacions;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

  displayFnVuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
  displayFnCliente(option: Cliente) {
    return option?.Razon_Social;
  }
  displayFnSolicitante_1(option: Spartan_User) {
    return option?.Name;
  }
  displayFnEstatus(option: Estatus_de_facturacion_de_vuelo) {
    return option?.Estatus;
  }


  async save() {
    await this.saveData();

  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      console.log("Save: ", this.Facturacion_de_VueloForm);
      const entity = this.Facturacion_de_VueloForm.value;
      entity.Folio = this.model.Folio;
      entity.Vuelo = this.Facturacion_de_VueloForm.get('Vuelo').value.Folio;
      entity.Matricula = this.Facturacion_de_VueloForm.get('Matricula').value.Matricula;
      entity.Modelo = this.Facturacion_de_VueloForm.get('Modelo').value.Clave;
      entity.Cliente = this.Facturacion_de_VueloForm.get('Cliente').value.Clave;
      entity.Solicitante_1 = this.Facturacion_de_VueloForm.get('Solicitante_1').value.Id_User;
      entity.Estatus = this.Facturacion_de_VueloForm.get('Estatus').value.Clave;

      //Agregar datos correctos para el modelo: Leonardo Manrique.
      entity.Fecha = this.Facturacion_de_VueloForm.get('Fecha').value;
      entity.Hora = this.Facturacion_de_VueloForm.get('Hora').value;
      entity.Seccion = this.Facturacion_de_VueloForm.get('Seccion').value;
      entity.Tipo = this.Facturacion_de_VueloForm.get('Tipo').value;
      entity.Ano = this.Facturacion_de_VueloForm.get('Ano').value;
      //entity.Solicitante = this.Facturacion_de_VueloForm.get('Solicitante').value;
      entity.Horas_de_vuelo = this.Facturacion_de_VueloForm.get('Horas_de_vuelo').value;
      entity.Horas_de_Espera = this.Facturacion_de_VueloForm.get('Horas_de_Espera').value;
      entity.Percnota = this.Facturacion_de_VueloForm.get('Percnota').value;
      entity.Fecha_de_la_factura = this.Facturacion_de_VueloForm.get('Fecha_de_la_factura').value;
      entity.Servicios_Terminal_Total = this.Facturacion_de_VueloForm.get('Servicios_Terminal_Total').value;
      entity.Comisariato_Total = this.Facturacion_de_VueloForm.get('Comisariato_Total').value;
      entity.Despacho = this.Facturacion_de_VueloForm.get('Despacho').value;
      entity.TUA_Nacional = this.Facturacion_de_VueloForm.get('TUA_Nacional').value;
      entity.TUA_Nacional_Total = this.Facturacion_de_VueloForm.get('TUA_Nacional_Total').value;
      entity.TUA_Internacional = this.Facturacion_de_VueloForm.get('TUA_Internacional').value;
      entity.TUA_Internacional_Total = this.Facturacion_de_VueloForm.get('TUA_Internacional_Total').value;
      entity.IVA_Frontera = this.Facturacion_de_VueloForm.get('IVA_Frontera').value;
      entity.IVA_Frontera_Total = this.Facturacion_de_VueloForm.get('IVA_Frontera_Total').value;
      entity.IVA_Nacional = this.Facturacion_de_VueloForm.get('IVA_Nacional').value;
      entity.IVA_Nacional_Total = this.Facturacion_de_VueloForm.get('IVA_Nacional_Total').value;
      entity.SubTotal = this.Facturacion_de_VueloForm.get('SubTotal').value;
      entity.Tiempo_de_Vuelo = this.Facturacion_de_VueloForm.get('Tiempo_de_Vuelo').value;
      entity.Tiempo_de_Vuelo_Total = this.Facturacion_de_VueloForm.get('Tiempo_de_Vuelo_Total').value;
      entity.Tiempo_de_Espera = this.Facturacion_de_VueloForm.get('Tiempo_de_Espera').value;
      entity.Espera_sin_Cargo = this.Facturacion_de_VueloForm.get('Espera_sin_Cargo').value;
      entity.Espera_con_Cargo = this.Facturacion_de_VueloForm.get('Espera_con_Cargo').value;
      entity.Espera_con_Cargo_Total = this.Facturacion_de_VueloForm.get('Espera_con_Cargo_Total').value;
      entity.Pernocta = this.Facturacion_de_VueloForm.get('Pernocta').value;
      entity.Pernoctas_Total = this.Facturacion_de_VueloForm.get('Pernoctas_Total').value;
      entity.IVA_Nacional_Servicios = this.Facturacion_de_VueloForm.get('IVA_Nacional_Servicios').value;
      entity.IVA_Nacional_Servicios_Total = this.Facturacion_de_VueloForm.get('IVA_Nacional_Servicios_Total').value;
      entity.IVA = this.Facturacion_de_VueloForm.get('IVA').value;
      entity.IVA_Internacional_Total = this.Facturacion_de_VueloForm.get('IVA_Internacional_Total').value;
      entity.Cargo_vuelo_int_ = this.Facturacion_de_VueloForm.get('Cargo_vuelo_int_').value;
      entity.Cargo_Vuelo_Int__Total = this.Facturacion_de_VueloForm.get('Cargo_Vuelo_Int__Total').value;
      entity.IVA_vuelo_int_ = this.Facturacion_de_VueloForm.get('IVA_vuelo_int_').value;
      entity.IVA_Vuelo_Int__Total = this.Facturacion_de_VueloForm.get('IVA_Vuelo_Int__Total').value;
      entity.SubTotal_1 = this.Facturacion_de_VueloForm.get('SubTotal_1').value;
      entity.Servicios_de_Terminal = this.Facturacion_de_VueloForm.get('Servicios_de_Terminal').value;
      entity.Comisariato_1 = this.Facturacion_de_VueloForm.get('Comisariato_1').value;
      entity.Despacho_1 = this.Facturacion_de_VueloForm.get('Despacho_1').value;
      entity.Margen = this.Facturacion_de_VueloForm.get('Margen').value;
      entity.Total_a_pagar = this.Facturacion_de_VueloForm.get('Total_a_pagar').value;
      entity.SAPSA_Monto = this.Facturacion_de_VueloForm.get('SAPSA_Monto').value;
      entity.SAPSA_Porcentaje = this.Facturacion_de_VueloForm.get('SAPSA_Porcentaje').value;
      entity.GNP_Monto = this.Facturacion_de_VueloForm.get('GNP_Monto').value;
      entity.GNP_Porcentaje = this.Facturacion_de_VueloForm.get('GNP_Porcentaje').value;
      entity.PH_Monto = this.Facturacion_de_VueloForm.get('PH_Monto').value;
      entity.PH_Porcentaje = this.Facturacion_de_VueloForm.get('PH_Porcentaje').value;


      if (this.model.Folio > 0) {
        await this.Facturacion_de_VueloService.update(this.model.Folio, entity).toPromise().then(async id => {

          await this.saveDetalle_de_tramos_a_facturar(this.model.Folio);
          await this.saveFacturacion_de_vuelos_por_tramo(this.model.Folio);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
          this.spinner.hide('loading');

          this.rulesAfterSave();
          return this.model.Folio;
        });

      } else {
        await (this.Facturacion_de_VueloService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_tramos_a_facturar(id);
          await this.saveFacturacion_de_vuelos_por_tramo(id);

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
    if (this.model.Folio === 0) {
      this.Facturacion_de_VueloForm.reset();
      this.model = new Facturacion_de_Vuelo(this.fb);
      this.Facturacion_de_VueloForm = this.model.buildFormGroup();
      this.dataSourceTramos_a_Facturar = new MatTableDataSource<Detalle_de_tramos_a_facturar>();
      this.Tramos_a_FacturarData = [];
      this.dataSourceFacturacion_de_vuelo_por_tramo = new MatTableDataSource<Facturacion_de_vuelos_por_tramo>();
      this.Facturacion_de_vuelo_por_tramoData = [];

    } else {
      this.router.navigate(['views/Facturacion_de_Vuelo/add']);
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
    this.router.navigate(['/Facturacion_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  onTabChanged(event) {
    if (event.tab.ariaLabel == 'Detalle_de_Factura') {
      if (this.operation == 'Update' || this.operation == 'Consult') {
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Fecha_de_la_factura', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Servicios_Terminal_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Comisariato_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Despacho', 0);

        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'TUA_Nacional', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'TUA_Nacional_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'TUA_Internacional', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'TUA_Internacional_Total', 0);

        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Frontera', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Frontera_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Nacional', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Nacional_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SubTotal', 0);

        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Total_a_pagar', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Tiempo_de_Vuelo', 0);

        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Tiempo_de_Vuelo_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Tiempo_de_Espera', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Espera_sin_Cargo', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Espera_con_Cargo', 0);

        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Espera_con_Cargo_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Pernocta', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Pernoctas_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Nacional_Servicios', 0);

        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Nacional_Servicios_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Internacional_Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Cargo_vuelo_int_', 0);

        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Cargo_Vuelo_Int__Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_vuelo_int_', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Vuelo_Int__Total', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SubTotal_1', 0);
      }
    }
    if (event.tab.ariaLabel == 'Facturacion_por_tramo') {
      if (this.operation == 'Update' || this.operation == 'Consult') {

        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SAPSA_Monto', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SAPSA_Porcentaje', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'GNP_Monto', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'GNP_Porcentaje', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'PH_Monto', 0);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'PH_Porcentaje', 0);
      }
    }
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas
  //@@Begin.Keep.Implementation('applyRules()')

  applyRules() { }

  filterComboObservable(): Observable<FilterCombo> {
    return this.filterComboEmiter.asObservable();
  }

  filterCombo(nameCombo: string, filter: string) {
    const filterCombo: FilterCombo = { nameCombo, filter };
    this.filterComboEmiter.next(filterCombo);
  }

  rulesAfterViewInit() {

    //this.brf.SetNotValidatorControl(this.Facturacion_de_VueloForm, "Margen");

  }

  rulesOnInit() {
    //rulesOnInit_ExecuteBusinessRulesInit

    //INICIA - BRID:4356 - sesión de Datos de la Aeronave - Autor: Yamir - Actualización: 7/23/2021 2:22:08 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //WriteLabelOnDiv('Matricula','Datos de la Aeronave'); WriteLabelOnDiv('Cliente','Datos del Cliente'); WriteLabelOnDiv('Horas_de_vuelo','Tarifas'); WriteLabelOnDiv('Fecha_de_la_factura','Servicios extraordinarios'); WriteLabelOnDiv('Tiempo_de_Vuelo','Servicios de Vuelo'); WriteLabelOnDiv('Servicios_de_Terminal','Cargos Adicionales');
      //Verificar
    }
    //TERMINA - BRID:4356


    //INICIA - BRID:4358 - acomodo de campos factura de vuelos 1.1 - Autor: Aaron - Actualización: 8/11/2021 2:59:14 PM
    this.brf.HideFieldOfForm(this.Facturacion_de_VueloForm, "Folio");
    this.brf.SetNotRequiredControl(this.Facturacion_de_VueloForm, "Folio");
    //TERMINA - BRID:4358


    //INICIA - BRID:4359 - acomodo de campos para facturación 1.2 - Autor: Yamir - Actualización: 9/15/2021 4:21:59 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.Facturacion_de_VueloForm, "Folio");
      this.brf.SetNotRequiredControl(this.Facturacion_de_VueloForm, "Folio");
    }
    //TERMINA - BRID:4359

    //INICIA - BRID:4938 - deshabilitar campos modelo y año al  seleccionar Matricula  - Autor: Aaron - Actualización: 8/12/2021 6:39:42 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Modelo', 0);
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Ano', 0);
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Matricula', 0);
    }
    //TERMINA - BRID:4938


    //INICIA - BRID:4946 - Deshabilitar campos de sección de Servicios Extraordinarios - Autor: Agustín Administrador - Actualización: 8/17/2021 12:15:47 PM
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'TUA_Nacional', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'TUA_Internacional', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Frontera', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Nacional', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SubTotal', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Servicios_Terminal_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Comisariato_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'TUA_Nacional_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'TUA_Internacional_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Frontera_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Nacional_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Despacho', 0);
    //TERMINA - BRID:4946


    //INICIA - BRID:4947 - Deshabilitar campos de Tarifas - Autor: Aaron - Actualización: 8/17/2021 4:59:44 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Horas_de_vuelo', 0);
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Horas_de_Espera', 0);
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Percnota', 0);
    }
    //TERMINA - BRID:4947


    //INICIA - BRID:4949 - Deshabilitar campos de Cliente - Autor: Agustín Administrador - Actualización: 8/20/2021 3:00:43 PM
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Cliente', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Fecha', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Hora', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Seccion', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Tipo', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Solicitante_1', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Vuelo', 0);
    this.brf.HideFieldOfForm(this.Facturacion_de_VueloForm, "Estatus");
    this.brf.SetNotRequiredControl(this.Facturacion_de_VueloForm, "Estatus");
    //TERMINA - BRID:4949


    //INICIA - BRID:4951 - Deshabilitar campos de servicios de vuelo - Autor: Agustín Administrador - Actualización: 9/8/2021 12:58:59 PM
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Frontera', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Tiempo_de_Vuelo', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Tiempo_de_Espera', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Espera_con_Cargo', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Espera_sin_Cargo', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Pernocta', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Cargo_vuelo_int_', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_vuelo_int_', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SubTotal_1', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Nacional_Servicios', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Nacional_Servicios_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Tiempo_de_Vuelo_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Tiempo_de_Espera_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Espera_sin_Cargo_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Espera_con_Cargo_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Pernoctas_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Internacional_Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Cargo_Vuelo_Int__Total', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'IVA_Vuelo_Int__Total', 0);
    //TERMINA - BRID:4951


    //INICIA - BRID:4952 - Cargar Impuestos en servicios Extraordinarios - Autor: Felipe Rodríguez - Actualización: 9/13/2021 3:56:28 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "IVA_Nacional", "this.brf.EvaluaQuery('Select Top 1 IVA_Nacional From Impuestos', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "TUA_Nacional", "this.brf.EvaluaQuery('Select Top 1 TUA_Nacional From Impuestos', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "TUA_Internacional", "this.brf.EvaluaQuery(' Select Top 1 TUA_Internacional From Impuestos', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "IVA_Frontera", "this.brf.EvaluaQuery(' Select Top 1 IVA_Frontera From Impuestos', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "Cargo_vuelo_int_", "this.brf.EvaluaQuery(' Select Top 1 Cargos_por_vuelo_internacional From Impuestos', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "IVA", "this.brf.EvaluaQuery(' Select Top 1 IVA_Internacional From Impuestos', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "IVA_vuelo_int_", "this.brf.EvaluaQuery(' Select Top 1 IVA_Internacional From Impuestos', 1, 'ABC123')", 1, "ABC123");
    }
    //TERMINA - BRID:4952


    //INICIA - BRID:4960 - sumar campo sub total y subtotal 1 - Autor: Felipe Rodríguez - Actualización: 9/13/2021 3:58:36 PM
    if (this.operation == 'Update') {
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "Total_a_pagar", "this.brf.EvaluaQuery('SELECT ISNULL(FLD[SubTotal],0) + ISNULL(FLD[SubTotal_1],0)', 1, 'ABC123')", 1, "ABC123");
    }
    //TERMINA - BRID:4960


    //INICIA - BRID:4997 - Cargar 0 en campos que se calculan en automatico - Autor: Aaron - Actualización: 8/18/2021 6:41:19 PM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Despacho", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "SubTotal", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "SubTotal_1", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Total_a_pagar", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Servicios_de_Terminal", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Comisariato_1", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Despacho_1", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Servicios_Terminal_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Comisariato_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "TUA_Nacional_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "TUA_Internacional_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "IVA_Frontera_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "IVA_Nacional_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Margen", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Tiempo_de_Vuelo_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Espera_con_Cargo_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Pernoctas_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "IVA_Internacional_Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Cargo_Vuelo_Int__Total", "0.00");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "IVA_Vuelo_Int__Total", "0.00");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "Tiempo_de_Vuelo", "this.brf.EvaluaQuery(' Select '00:00'', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "Tiempo_de_Espera", "this.brf.EvaluaQuery(' Select '00:00'', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "Espera_con_Cargo", "this.brf.EvaluaQuery(' Select '00:00'', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "Espera_sin_Cargo", "this.brf.EvaluaQuery(' Select '00:00'', 1, 'ABC123')", 1, "ABC123");
      this.brf.SetValueControl(this.Facturacion_de_VueloForm, "Pernocta", "0");
    }
    //TERMINA - BRID:4997

    //INICIA - BRID:5007 - Deshabilitar Porcentaje de particiones por empresa - Autor: Aaron - Actualización: 8/20/2021 7:51:15 PM
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SAPSA_Monto', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SAPSA_Porcentaje', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'GNP_Monto', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'GNP_Porcentaje', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'PH_Monto', 0);
    this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'PH_Porcentaje', 0);
    //TERMINA - BRID:5007


    //INICIA - BRID:5012 - Habilitar campos para el Contador - Autor: Yamir - Actualización: 8/23/2021 3:11:22 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == "24") {
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SAPSA_Monto', 1);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SAPSA_Porcentaje', 1);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'GNP_Monto', 1);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'GNP_Porcentaje', 1);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'PH_Monto', 1);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'PH_Porcentaje', 1);
        this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'Estatus', 1);
      }
    }
    //TERMINA - BRID:5012


    // //INICIA - BRID:5019 - Llenar el MR Facturación de vuelo por tramo al abrir la pantalla - Autor: Felipe Rodríguez - Actualización: 9/13/2021 3:55:49 PM
    // if (this.operation == 'Update') {
    //   if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == "9" || this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == "24"
    //     && this.brf.EvaluaQuery(`EXEC usp_Solicitante_es_A1 ${this.model.Folio}`, 1, 'ABC123') == "1") {
    //     this.brf.ShowFolder("Facturacion_por_tramo");
    //   } else {
    //     this.brf.HideFolder("Facturacion_por_tramo");
    //   }
    // }
    // //TERMINA - BRID:5019


    //INICIA - BRID:5558 - Poner Fecha y Hora Facturacion_de_Vuelo - Autor: Agustín Administrador - Actualización: 8/30/2021 5:18:47 PM
    if (this.operation == 'Update') {
      this.brf.SetCurrentDateToField(this.Facturacion_de_VueloForm, "Fecha");
      this.brf.SetCurrentHourToField(this.Facturacion_de_VueloForm, "Hora");
    }
    //TERMINA - BRID:5558


    //INICIA - BRID:5565 - Deshabilitar campos de presupuestos - Autor: Agustín Administrador - Actualización: 8/30/2021 8:23:56 PM
    if (this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SAPSA_Monto', 0);
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'SAPSA_Porcentaje', 0);
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'GNP_Monto', 0);
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'GNP_Porcentaje', 0);
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'PH_Monto', 0);
      this.brf.SetEnabledControl(this.Facturacion_de_VueloForm, 'PH_Porcentaje', 0);
    }
    //TERMINA - BRID:5565


    //INICIA - BRID:5737 - Prueba TUAS - Autor: Agustín Administrador - Actualización: 9/8/2021 11:41:31 AM
    if (this.operation == 'Update') {
      this.brf.CreateSessionVar("TUASNACIONALES", "this.brf.EvaluaQuery('EXEC Get_TUAS_Por_Vuelo FLD[Vuelo],'NACIONAL'', 1, 'ABC123')", 1, "ABC123");
      this.brf.CreateSessionVar("TUASINTERNACIONALES", "this.brf.EvaluaQuery('EXEC Get_TUAS_Por_Vuelo FLD[Vuelo],'INTERNACIONAL'', 1, 'ABC123')", 1, "ABC123");
    }
    //TERMINA - BRID:5737


    //INICIA - BRID:5872 - Campos cargos adicionales no requeridos - Autor: Agustín Administrador - Actualización: 9/6/2021 4:58:32 PM
    if (this.operation == 'Update') {
      this.brf.SetNotRequiredControl(this.Facturacion_de_VueloForm, "Despacho");
      this.brf.SetNotRequiredControl(this.Facturacion_de_VueloForm, "Servicios_de_Terminal");
      this.brf.SetNotRequiredControl(this.Facturacion_de_VueloForm, "Comisariato_1");
      this.brf.SetNotRequiredControl(this.Facturacion_de_VueloForm, "Margen");
    }
    //TERMINA - BRID:5872


    //INICIA - BRID:6298 - ocultar campo sección - Autor: Jose Caballero - Actualización: 9/15/2021 4:05:29 PM
    this.brf.HideFieldOfForm(this.Facturacion_de_VueloForm, "Seccion");
    this.brf.SetNotRequiredControl(this.Facturacion_de_VueloForm, "Seccion");
    //TERMINA - BRID:6298


    //INICIA - BRID:6299 - prueba guardado y copia acomodo  de campos (copia de la RDN 4359) - Autor: Yamir - Actualización: 9/15/2021 4:21:54 PM
    this.brf.HideFieldOfForm(this.Facturacion_de_VueloForm, "Folio");
    this.brf.SetNotRequiredControl(this.Facturacion_de_VueloForm, "Folio");
    //TERMINA - BRID:6299


    //INICIA - BRID:6539 - Establecer fecha de la factura al editar Facturacion_de_Vuelo - Autor: Agustín Administrador - Actualización: 9/29/2021 3:19:02 PM
    if (this.operation == 'Update') {
      this.brf.SetCurrentDateToField(this.Facturacion_de_VueloForm, "Fecha_de_la_factura");
      //this.brf.SetValueFromQuery(this.Facturacion_de_VueloForm, "Fecha_de_la_factura", "this.brf.EvaluaQuery('SELECT CONVERT(varchar(11),getdate(),105)', 1, 'ABC123')", 1, "ABC123");
    }
    //TERMINA - BRID:6539


    //INICIA - BRID:6580 - WF:14 Rule - Phase: 1 (Prefacturas Generadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '1'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:6580


    //INICIA - BRID:6582 - WF:14 Rule - Phase: 2 (Prefacturas Canceladas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '2'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:6582

    //rulesOnInit_ExecuteBusinessRulesEnd

    this.getClienteFacturacion()
  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:5010 - Después de guardar, en editar, si el rol es Contador, ejecutar el SP que actualiza el monto anual - Autor: Francisco Javier Martínez Urbina - Actualización: 8/21/2021 2:48:05 PM
    if (this.operation == 'Update') {
      if (+this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == 24) {
        this.brf.EvaluaQuery('EXEC usp_UpdtMontosAnuales ' + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted), 1, 'ABC123');
      }
    }
    //TERMINA - BRID:5010


    //INICIA - BRID:5016 - Después de guardar, en editar, si el rol es Contador enviar correo a los roles 10 y 44 - Autor: Francisco Javier Martínez Urbina - Actualización: 8/21/2021 4:25:38 PM
    if (this.operation == 'Update') {
      //if( this.brf.TryParseInt(this.brf.ReplaceVARS(this.Facturacion_de_VueloForm, 'USERROLEID'), this.brf.ReplaceVARS(this.Facturacion_de_VueloForm,'USERROLEID'))==this.brf.TryParseInt('24', '24') ) { SendEmailQuery('Notificación de Pre facturas generadas', EvaluaQuery("select STUFF((		select ';' + Email + ''		from Spartan_User		where role in (10, 44) 	for XML PATH('')	), 1, 1, '')"), '<!doctype html> <html>​<head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title>​<style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; }​* { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; }​.ExternalClass { width: 100%; }​div[style*="margin: 16px 0"] { margin: 0 !important; }​table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; }​table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; }​table table table { table-layout: auto; }​img { -ms-interpolation-mode: bicubic; }​.yshortcuts a { border-bottom: none !important; }​a[x-apple-data-detectors] { color: inherit !important; }​/* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; }​.button-td:hover, .button-a:hover { color: #000; } </style> </head>​<body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;">​<!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END -->​<div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]-->​<!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END -->​<!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;">​<!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado (a) Administrativo, Dirección General</p> <p>Se le informa que se ha generado la prefactura correspondiente al vuelo FLD[Vuelo] para su revisión.</p> <p>Atentamente. </p> <p>Contabilidad </p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN -->​​</table> <!-- Email Body : END -->​<!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table>​<table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp;</td> </tr> </table> <!-- Email Footer : END -->​<!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body>​</html>	');} else {}
    }
    //TERMINA - BRID:5016


    //INICIA - BRID:5017 - Guardar registro en Autorización_de_Prefactura_Aervics - Autor: Agustín Administrador - Actualización: 8/25/2021 4:15:36 PM

    if (this.operation == 'Update') {
      this.brf.EvaluaQuery(' EXEC sp_Insertar_Autorizacion_de_Prefactura_Aerovics ' + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted), 1, 'ABC123');
    }
    //TERMINA - BRID:5017


    //INICIA - BRID:5384 - Asingar prefacturado antes de guardar Facturacion_de_Vuelo - Autor: Agustín Administrador - Actualización: 8/25/2021 6:17:10 PM
    if (this.operation == 'Update') {
      this.brf.EvaluaQuery("UPDATE Facturacion_de_Vuelo SET Estatus = 2 WHERE Folio = '" + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted) + "'", 1, 'ABC123');
    }
    //TERMINA - BRID:5384

    this.goToList();
    //rulesAfterSave_ExecuteBusinessRulesEnd
  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    let Estatus = this.Facturacion_de_VueloForm.controls['Estatus'].value.Clave;

    //INICIA - BRID:5460 - No guardar cuando el estatus es prefacturado o autorizado Facturacion_de_Vuelo - Autor: Agustín Administrador - Actualización: 9/6/2021 12:01:44 PM
    if (this.operation == 'Update') {
      if (Estatus == 2 || Estatus == 4) {

        this.brf.ShowMessage("El estatus de este registro debe ser diferente de \"Prefacturado\" o \"Autorizado\" para poder guardarlo.");

        result = false;
      }
    }
    //TERMINA - BRID:5460

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //@@End.Keep.Implementation('//Fin de reglas')

  //Fin de reglas


  /**
   * #### Description
   * Save internal the index of the sprint to invice to company
   * #### Author
   * Enrique Fernandez
   * #### Date
   * 13-11-2022
   */
  private editCompanyIndex

  /**
   * #### editFacturacion_de_vuelo_change_company
   * @param element : Facturacion_de_vuelos_por_tramo
   * 
   * #### Description
   * Save in the private variable the row that we can to change the invoice company
   * #### Author
   * Enrique Fernandez
  * #### Date
   * 13-11-2022
   */
  public async editFacturacion_de_vuelo_change_company(element: Facturacion_de_vuelos_por_tramo) {

    this.editCompanyIndex = this.dataSourceFacturacion_de_vuelo_por_tramo.data.indexOf(element);
  }
  /**
   * #### save_changeCompany_Facturacion_de_vuelo_por_tramo
   * @param element : Cliente_Facturacion
   * 
   * #### Description 
   * add to the sprint company invoice the selection from the user
   * #### Author
   * Enrique Fernandez
   * #### Date
   * 13-11-2022
   */
  public async save_changeCompany_Facturacion_de_vuelo_por_tramo(element: Cliente_Facturacion) {
    this.Facturacion_de_vuelo_por_tramoData[this.editCompanyIndex].Empresa_Seleccionada = element != null ? element.Clave : null;
    this.Facturacion_de_vuelo_por_tramoData[this.editCompanyIndex].Empresa_Seleccionada_Cliente_Facturacion = element;
    this.Facturacion_de_vuelo_por_tramoItems.controls[this.editCompanyIndex]
    this.validateCompanys();

    this.check_sprint_fly_invoice_amounts()
  }

  validateCompanys() {
    this.Facturacion_de_vuelo_por_tramoData.forEach(element => {
      if (element.Empresa_Seleccionada == null || element.Empresa_Seleccionada == 61) {
        this.isValidCompany = false;
        return
      }
      else {
        this.isValidCompany = true;
      }
    });
  }

  /**
   * #### check_sprint_fly_invoice_amounts
   * 
   * #### Description 
   * Generate the amount and percentage to each company from the sprint fly to invoice
   * #### Author
   * Enrique Fernandez
   * #### Date
   * 13-11-2022
   */
  private check_sprint_fly_invoice_amounts(): void {
    this.Facturacion_de_VueloForm.controls["SAPSA_Monto"].patchValue(this.get_Filtered_Sprint_Fly_Invoice(174).reduce((acumulator, el) => { return acumulator + el.amount }, 0))
    this.Facturacion_de_VueloForm.controls["SAPSA_Porcentaje"].patchValue(this.get_Filtered_Sprint_Fly_Invoice(174).reduce((acumulator, el) => { return acumulator + el.percentage }, 0))
    this.Facturacion_de_VueloForm.controls["GNP_Monto"].patchValue(this.get_Filtered_Sprint_Fly_Invoice(163).reduce((acumulator, el) => { return acumulator + el.amount }, 0))
    this.Facturacion_de_VueloForm.controls["GNP_Porcentaje"].patchValue(this.get_Filtered_Sprint_Fly_Invoice(163).reduce((acumulator, el) => { return acumulator + el.percentage }, 0))
    this.Facturacion_de_VueloForm.controls["PH_Monto"].patchValue(this.get_Filtered_Sprint_Fly_Invoice(3).reduce((acumulator, el) => { return acumulator + el.amount }, 0))
    this.Facturacion_de_VueloForm.controls["PH_Porcentaje"].patchValue(this.get_Filtered_Sprint_Fly_Invoice(3).reduce((acumulator, el) => { return acumulator + el.percentage }, 0))
  }


  /**
   * #### get_Filtered_Sprint_Fly_Invoice
   * @param idC : number-idCompany
   * 
   * #### Description 
   * return the sprint fly to add at company
   * #### Author
   * Enrique Fernandez
   * #### Date
   * 13-11-2022
   */
  private get_Filtered_Sprint_Fly_Invoice(idC: number): Array<{ idC: number, amount: number, percentage: number }> {
    return this.dataSourceFacturacion_de_vuelo_por_tramo.data
      .filter(x => x.Empresa_Seleccionada == idC)
      .map(r => {
        return {
          idC: r.Empresa_Seleccionada,
          amount: r.Monto_de_Tramo,
          percentage: r.Porcentaje
        }
      });
  }

  //#region Mostrar Mensaje por Estatus
  showMessageByEstatus() {
    if (this.operation == 'Update') {

      let Estatus = this.Facturacion_de_VueloForm.controls['Estatus'].value.Clave;

      //BRID:5458 - Mostrar alerta de no puede guardar si el estatus es prefacturado Facturacion_de_Vuelo - Autor: Agustín Administrador - Actualización: 9/6/2021 2:05:57 PM
      if (Estatus == 2) {
        let message = "Este registro tiene el estatus \"Prefacturado\", y los cambios realizados ya no seran guardados."
        this.snackBar.open(message, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });
      }

      //BRID:5459 - Mostrar alerta de no puede guardar si el estatus es Autorizado Facturacion_de_Vuelo - Autor: Agustín Administrador - Actualización: 9/6/2021 2:06:18 PM
      else if (Estatus == 4) {
        let message = "Este registro tiene el estatus \"Autorizado\", y los cambios realizados ya no seran guardados."
        this.snackBar.open(message, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
        });

      }

    }

  }
  //#endregion

  getClienteFacturacion() {
    this.Cliente_FacturacionService.listaSelAll(1, 1000, "").subscribe(x => {
      this.varCliente_Facturacion = x.Cliente_Facturacions;
    });
  }

  maxNumero_de_Tramo(index: any, max: number): boolean {
    if (this.Facturacion_de_vuelo_por_tramoItems.value[index].Numero_de_Tramo > (max - 1)) {
      return false;
    }
    return true;
  }

  maxTramo(index: any, max: number): boolean {
    if (this.Facturacion_de_vuelo_por_tramoItems.value[index].Tramo.length > (max - 1)) {
      return false;
    }
    return true;
  }

  maxMonto_de_Tramo(index: any, max: number): boolean {
    if (this.Facturacion_de_vuelo_por_tramoItems.value[index].Monto_de_Tramo.length > (max - 1)) {
      return false;
    }
    return true;
  }

  maxPorcentaje(index: any, max: number): boolean {
    if (this.Facturacion_de_vuelo_por_tramoItems.value[index].Porcentaje.length > (max - 1)) {
      return false;
    }
    return true;
  }

  async Servicios_de_Terminal_ExecuteBusinessRules(): Promise<void> {

    await this.FnAplicaValoresCargosAdicionales();
    //let query = `EXEC usp_ObtenerMR_FacturacionDeVuelo ${this.model.Folio}, ${this.Facturacion_de_VueloForm.get('SubTotal').value}, 1`;
    //await this.brf.FillMultiRenglonfromQueryAsync(this.dataSourceFacturacion_de_vuelo_por_tramo, query, 1, "ABC123");
    //Servicios_de_Terminal_ExecuteBusinessRulesEnd
  }

  async Comisariato_1_ExecuteBusinessRules(): Promise<void> {

    await this.FnAplicaValoresCargosAdicionales();
    //Comisariato_1_ExecuteBusinessRulesEnd
  }

  async Despacho_1_ExecuteBusinessRules(): Promise<void> {

    await this.FnAplicaValoresCargosAdicionales();
    //Despacho_1_ExecuteBusinessRulesEnd
  }

  async Margen_ExecuteBusinessRules(): Promise<void> {

    await this.FnAplicaValoresCargosAdicionales();
    //Margen_ExecuteBusinessRulesEnd
  }

  async FnAplicaValoresCargosAdicionales() {
    const model: q = new q();
    let vuelo = this.Facturacion_de_VueloForm.get('Vuelo').value.Folio;
    let serviciosTerminal = this.Facturacion_de_VueloForm.get('Servicios_de_Terminal').value;
    let comisariato = this.Facturacion_de_VueloForm.get('Comisariato_1').value;
    let despacho = this.Facturacion_de_VueloForm.get('Despacho_1').value;
    let margen = this.Facturacion_de_VueloForm.get('Margen').value;

    model.id = 1;
    model.query = `EXEC Insert_Factura_Vuelo ${vuelo}, ${serviciosTerminal}, ${comisariato}, ${despacho}, ${margen}, 2`;
    model.securityCode = "ABC123";

    await this.SpartanService.GetRawQuery(model).toPromise().then((result) => {
      if (result == null) {
        return;
      }

      let dt = JSON.parse(result.replace('\\', ''))

      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];
        this.Facturacion_de_VueloForm.get('Comisariato_Total').setValue(resDt.Comisariato_Total);
        this.Facturacion_de_VueloForm.get('Despacho').setValue(resDt.Despacho);
        this.Facturacion_de_VueloForm.get('IVA_Frontera_Total').setValue(resDt.IVA_Frontera_Total);
        this.Facturacion_de_VueloForm.get('IVA_Nacional_Total').setValue(resDt.IVA_Nacional_Total);
        this.Facturacion_de_VueloForm.get('Servicios_Terminal_Total').setValue(resDt.Servicios_Terminal_Total);
        this.Facturacion_de_VueloForm.get('SubTotal').setValue(resDt.SubTotal);
        this.Facturacion_de_VueloForm.get('TUA_Internacional_Total').setValue(resDt.TUA_Internacional_Total);
        this.Facturacion_de_VueloForm.get('TUA_Nacional_Total').setValue(resDt.TUA_Nacional_Total);
        this.Facturacion_de_VueloForm.get('Total_a_pagar').setValue(resDt.Total_a_pagar);
      }
    });
  }

}
