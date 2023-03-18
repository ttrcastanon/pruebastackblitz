import { AfterViewInit, Component, ElementRef, LOCALE_ID, Inject, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';
import { animate, state, style, transition, trigger, query } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise, ignoreElements } from 'rxjs/operators';

import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import * as momentJS from 'moment';

import { Ejecucion_de_VueloService } from 'src/app/api-services/Ejecucion_de_Vuelo.service';
import { Ejecucion_de_Vuelo } from 'src/app/models/Ejecucion_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Tipo_de_AlaService } from 'src/app/api-services/Tipo_de_Ala.service';
import { Tipo_de_Ala } from 'src/app/models/Tipo_de_Ala';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { TripulacionService } from 'src/app/api-services/Tripulacion.service';
import { Tripulacion } from 'src/app/models/Tripulacion';
import { Tipo_de_vueloService } from 'src/app/api-services/Tipo_de_vuelo.service';
import { Tipo_de_vuelo } from 'src/app/models/Tipo_de_vuelo';
import { Detalle_Ejecucion_de_vuelo_pasajerosService } from 'src/app/api-services/Detalle_Ejecucion_de_vuelo_pasajeros.service';
import { Detalle_Ejecucion_de_vuelo_pasajeros } from 'src/app/models/Detalle_Ejecucion_de_vuelo_pasajeros';
import { PasajerosService } from 'src/app/api-services/Pasajeros.service';
import { Pasajeros } from 'src/app/models/Pasajeros';

import { Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesService } from 'src/app/api-services/Detalle_Ejecucion_de_vuelo_pasajeros_adicionales.service';
import { Detalle_Ejecucion_de_vuelo_pasajeros_adicionales } from 'src/app/models/Detalle_Ejecucion_de_vuelo_pasajeros_adicionales';

import { Detalle_Ejecucion_Vuelo_ParametrosService } from 'src/app/api-services/Detalle_Ejecucion_Vuelo_Parametros.service';
import { Detalle_Ejecucion_Vuelo_Parametros } from 'src/app/models/Detalle_Ejecucion_Vuelo_Parametros';

import { Detalle_Ejecucion_Vuelo_ComponentesService } from 'src/app/api-services/Detalle_Ejecucion_Vuelo_Componentes.service';
import { Detalle_Ejecucion_Vuelo_Componentes } from 'src/app/models/Detalle_Ejecucion_Vuelo_Componentes';

import { Detalle_Ejecucion_Vuelo_AltimetrosService } from 'src/app/api-services/Detalle_Ejecucion_Vuelo_Altimetros.service';
import { Detalle_Ejecucion_Vuelo_Altimetros } from 'src/app/models/Detalle_Ejecucion_Vuelo_Altimetros';

//import { DistanceService } from 'src/app/api-services/Distance.service';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanService } from "src/app/api-services/spartan.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';

import { SpartanQueryDictionary } from 'src/app/models/spartan-query-dictionary';
import { Query } from '../../Calendario/models/modelQueryParameter';

import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { element } from 'protractor';
import { getDutchPaginatorIntl } from 'src/app/shared/base-views/dutch-paginator-intl';
registerLocaleData(localeEs, 'es')

@Component({
  selector: 'app-modal-ejecucion-de-vuelo',
  templateUrl: './modal-Ejecucion-de-Vuelo.component.html',
  styleUrls: ['./modal-Ejecucion-de-Vuelo.component.scss'],
  providers:[
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl()}
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class ModalEjecucionDeVueloComponent implements OnInit, AfterViewInit {


  //#region Variables
  firstLoad: boolean = true;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  RoleId: number = 0;
  UserId: number = 0;
  operation: string = "";
  FolioPantalla: any
  IdMatricula: any
  showDistancia_FIR_Km: boolean = false;

  distancia_FIR_KmFIR: string = "";
  origenFIR: string = "";
  destinoFIR: string = "";

  showLectura_de_Altimetros: boolean = false;
  showParametros: boolean = false;
  IdEjecucion_de_Vuelo: number = 0
  todayDate = new Date();
  minFecha_de_Llegada: any
  minFecha_de_Aterrizaje: any;

  maxFecha_de_Aterrizaje: any

  saveButtonPasajeros: boolean = true;

  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Ejecucion_de_VueloForm: FormGroup;
  public Editor = ClassicEditor;
  model: Ejecucion_de_Vuelo;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;

  optionsNumero_de_Vuelo: SpartanQueryDictionary[] = [];
  optionsTramo_de_Vuelo: SpartanQueryDictionary[] = [];

  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  firstLoadMatricula: boolean = true;

  optionsOrigen: Observable<Aeropuertos[]>;
  hasOptionsOrigen: boolean;
  isLoadingOrigen: boolean;
  firstLoadOrigen: boolean = true;

  optionsDestino: Observable<Aeropuertos[]>;
  hasOptionsDestino: boolean;
  isLoadingDestino: boolean;
  firstLoadDestino: boolean = true;

  optionsAdministrador_del_Vuelo: Observable<Tripulacion[]>;
  hasOptionsAdministrador_del_Vuelo: boolean;
  isLoadingAdministrador_del_Vuelo: boolean;


  public varTipo_de_Ala: Tipo_de_Ala[] = [];
  public varTripulacion: SpartanQueryDictionary[] = [];
  public varTipo_de_vuelo: Tipo_de_vuelo[] = [];
  public varPasajeros: Pasajeros[] = [];

  autoPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros = new FormControl();
  SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros: string[] = [];
  isLoadingPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros: boolean;
  searchPasajeros_Detalle_Ejecucion_de_vuelo_pasajerosCompleted: boolean;

  autoPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales = new FormControl();
  SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales: string[] = [];
  isLoadingPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales: boolean;
  searchPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesCompleted: boolean;

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  dataSourcePasajeros = new MatTableDataSource<Detalle_Ejecucion_de_vuelo_pasajeros>();
  PasajerosColumns = [
    { def: 'actions', hide: false },
    { def: 'Pasajeros', hide: false },

  ];
  PasajerosData: Detalle_Ejecucion_de_vuelo_pasajeros[] = [];

  dataSourcePasajeros_Adicionales_MR = new MatTableDataSource<Detalle_Ejecucion_de_vuelo_pasajeros_adicionales>();
  Pasajeros_Adicionales_MRColumns = [
    { def: 'actions', hide: false },

  ];
  Pasajeros_Adicionales_MRData: Detalle_Ejecucion_de_vuelo_pasajeros_adicionales[] = [];

  dataSourceParametros = new MatTableDataSource<Detalle_Ejecucion_Vuelo_Parametros>();
  ParametrosColumns = [
    { def: 'actions', hide: false },
    { def: 'Parametro', hide: false },
    { def: 'MOT_1', hide: false },
    { def: 'MOT_2', hide: false },
  ];
  ParametrosData: Detalle_Ejecucion_Vuelo_Parametros[] = [];

  dataSourceComponentes = new MatTableDataSource<Detalle_Ejecucion_Vuelo_Componentes>();
  ComponentesColumns = [
    { def: 'actions', hide: false },
    { def: 'Componente', hide: false },
    { def: 'turm', hide: false },
    { def: 'tt', hide: false },
    { def: 'CICLOS', hide: false },

  ];
  ComponentesData: Detalle_Ejecucion_Vuelo_Componentes[] = [];

  dataSourceLectura_de_Altimetros = new MatTableDataSource<Detalle_Ejecucion_Vuelo_Altimetros>();
  Lectura_de_AltimetrosColumns = [
    { def: 'actions', hide: false },
    { def: 'Concepto', hide: false },
    { def: 'ALTIM_1', hide: false },
    { def: 'ALTIM_2', hide: false },
    { def: 'ALTIM_AUX', hide: false },

  ];
  Lectura_de_AltimetrosData: Detalle_Ejecucion_Vuelo_Altimetros[] = [];

  today = new Date;
  consult: boolean = false;
  PageTitle: any;
  SpartanOperationId: any
  dataParametros: any;
  tipo_Ala: number;
  //#endregion

  constructor(
    private fb: FormBuilder,
    private Ejecucion_de_VueloService: Ejecucion_de_VueloService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private Registro_de_vueloService: Registro_de_vueloService,
    private AeronaveService: AeronaveService,
    private Tipo_de_AlaService: Tipo_de_AlaService,
    private AeropuertosService: AeropuertosService,
    private TripulacionService: TripulacionService,
    private Tipo_de_vueloService: Tipo_de_vueloService,
    private Detalle_Ejecucion_de_vuelo_pasajerosService: Detalle_Ejecucion_de_vuelo_pasajerosService,
    private PasajerosService: PasajerosService,

    private Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesService: Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesService,
    private Detalle_Ejecucion_Vuelo_ParametrosService: Detalle_Ejecucion_Vuelo_ParametrosService,
    private Detalle_Ejecucion_Vuelo_ComponentesService: Detalle_Ejecucion_Vuelo_ComponentesService,
    private Detalle_Ejecucion_Vuelo_AltimetrosService: Detalle_Ejecucion_Vuelo_AltimetrosService,

    private _seguridad: SeguridadService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private spartanService: SpartanService,
    renderer: Renderer2,
    private datePipe: DatePipe,
    public dialogRef: MatDialogRef<ModalEjecucionDeVueloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,

    //private distanceService: DistanceService
  ) {

    const user = this.localStorageHelper.getLoggedUserInfo();

    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.brf = new BusinessRulesFunctions(renderer, spartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Ejecucion_de_Vuelo(this.fb);
    this.Ejecucion_de_VueloForm = this.model.buildFormGroup();

    this.PasajerosItems.removeAt(0);
    this.Pasajeros_Adicionales_MRItems.removeAt(0);
    this.ParametrosItems.removeAt(0);
    this.ComponentesItems.removeAt(0);
    this.Lectura_de_AltimetrosItems.removeAt(0);

    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });

  }

  onTabChanged(event) {
    if (event.tab.ariaLabel == 'tabBitacora' && (this.operation == "Update" || this.operation == "Consult")) {
      let test = this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_Vuelo_ParametrosItems') as FormArray;
      let MOT_1 = "";
      let MOT_2 = "";
      
      test.controls.forEach( x => { 
        let controles:FormGroup = x as FormGroup; 
        let valorBuscado = controles.controls.Parametro.value;
        MOT_1 = this.dataParametros.filter(x => x.Ejecucion_de_Vuelo == this.model.Folio && x.Parametro == valorBuscado).length > 0 ? this.dataParametros.filter(x => x.Ejecucion_de_Vuelo == this.model.Folio && x.Parametro == valorBuscado)[0].MOT_1 : "";
        MOT_2 = this.dataParametros.filter(x => x.Ejecucion_de_Vuelo == this.model.Folio && x.Parametro == valorBuscado).length > 0 ? this.dataParametros.filter(x => x.Ejecucion_de_Vuelo == this.model.Folio && x.Parametro == valorBuscado)[0].MOT_2 : "";

        controles.controls.MOT_1.setValue(MOT_1);
        controles.controls.MOT_2.setValue(MOT_2);
      })
    }
  }

  ngAfterViewInit(): void {
    this.dataSourcePasajeros.paginator = this.paginator;
    this.dataSourcePasajeros_Adicionales_MR.paginator = this.paginator;
    this.dataSourceParametros.paginator = this.paginator;
    this.dataSourceComponentes.paginator = this.paginator;
    this.dataSourceLectura_de_Altimetros.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {

    this.populateControls()

    console.log("estoy recargando")

    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.PasajerosColumns.splice(0, 1);
        this.Pasajeros_Adicionales_MRColumns.splice(0, 1);
        this.ParametrosColumns.splice(0, 1);
        this.ComponentesColumns.splice(0, 1);
        this.Lectura_de_AltimetrosColumns.splice(0, 1);

        this.Ejecucion_de_VueloForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Ejecucion_de_Vuelo).subscribe((response) => {
      this.permisos = response;
    });

    this.PageTitle = "Cierre de Vuelo";

    this.brf.updateValidatorsToControl(this.Ejecucion_de_VueloForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Ejecucion_de_VueloForm, 'Tramo_de_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Ejecucion_de_VueloForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Ejecucion_de_VueloForm, 'Origen', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Ejecucion_de_VueloForm, 'Destino', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Ejecucion_de_VueloForm, 'Administrador_del_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Tipo_de_AlaService.getAll());
    observablesArray.push(this.Tipo_de_vueloService.getAll());

    await forkJoin(observablesArray).subscribe(([varTipo_de_Ala, varTipo_de_vuelo]) => {
      this.varTipo_de_Ala = varTipo_de_Ala;
      this.varTipo_de_vuelo = varTipo_de_vuelo;
      this.getParamsFromUrl();
    });

    this.Ejecucion_de_VueloForm.get('Matricula').valueChanges.pipe(
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
      //Despues de la Primera carga
      if (!this.firstLoadMatricula) {
        this.Ejecucion_de_VueloForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsMatricula = of(result?.Aeronaves);
      this.firstLoadMatricula = false;

    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });

    this.Ejecucion_de_VueloForm.get('Origen').valueChanges.pipe(
      startWith(''),
      debounceTime(1800),
      tap(() => this.isLoadingOrigen = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Descripcion like '%" + value.trimLeft().trimRight().replace('\'', '\'\'') + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight().replace('\'', '\'\'') + "%'");
      })
    ).subscribe(result => {
      this.isLoadingOrigen = false;
      this.hasOptionsOrigen = result?.Aeropuertoss?.length > 0;
      //this.Ejecucion_de_VueloForm.get('Origen').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
      this.optionsOrigen = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingOrigen = false;
      this.hasOptionsOrigen = false;
      this.optionsOrigen = of([]);
    });

    this.Ejecucion_de_VueloForm.get('Destino').valueChanges.pipe(
      startWith(''),
      debounceTime(1800),
      tap(() => this.isLoadingDestino = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Descripcion like '%" + value.trimLeft().trimRight().replace('\'', '\'\'') + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight().replace('\'', '\'\'') + "%'");
      })
    ).subscribe(result => {
      this.isLoadingDestino = false;
      this.hasOptionsDestino = result?.Aeropuertoss?.length > 0;
      //this.Ejecucion_de_VueloForm.get('Destino').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
      this.optionsDestino = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingDestino = false;
      this.hasOptionsDestino = false;
      this.optionsDestino = of([]);
    });

    //this.onChangeTramo_de_Vuelo(0);


  }


  getParamsFromUrl() {

    this.operation = this.data.operation
    //this.Folio_Solicitud = this.data.Folio_Solicitud
    this.SpartanOperationId = this.data.SpartanOperationId;

    if (this.operation == "Update" || this.operation == "Consult") {
      this.model.Folio = this.data?.Id
      this.populateModel(this.model.Folio);
    }
    this.rulesOnInit();

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Ejecucion_de_VueloService.listaSelAll(0, 1, 'Ejecucion_de_Vuelo.Folio=' + id).toPromise();
    if (result.Ejecucion_de_Vuelos.length > 0) {
      console.log(result);
      let fPasajeros = await this.Detalle_Ejecucion_de_vuelo_pasajerosService.listaSelAll(0, 1000, 'Ejecucion_de_Vuelo.Folio=' + id).toPromise();
      this.PasajerosData = fPasajeros.Detalle_Ejecucion_de_vuelo_pasajeross;
      this.loadPasajeros(fPasajeros.Detalle_Ejecucion_de_vuelo_pasajeross);
      this.dataSourcePasajeros = new MatTableDataSource(fPasajeros.Detalle_Ejecucion_de_vuelo_pasajeross);
      this.dataSourcePasajeros.paginator = this.paginator;
      this.dataSourcePasajeros.sort = this.sort;
      let fPasajeros_Adicionales_MR = await this.Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesService.listaSelAll(0, 1000, 'Ejecucion_de_Vuelo.Folio=' + id).toPromise();
      this.Pasajeros_Adicionales_MRData = fPasajeros_Adicionales_MR.Detalle_Ejecucion_de_vuelo_pasajeros_adicionaless;
      this.loadPasajeros_Adicionales_MR(fPasajeros_Adicionales_MR.Detalle_Ejecucion_de_vuelo_pasajeros_adicionaless);
      this.dataSourcePasajeros_Adicionales_MR = new MatTableDataSource(fPasajeros_Adicionales_MR.Detalle_Ejecucion_de_vuelo_pasajeros_adicionaless);
      this.dataSourcePasajeros_Adicionales_MR.paginator = this.paginator;
      this.dataSourcePasajeros_Adicionales_MR.sort = this.sort;
      
      let fParametros = await this.Detalle_Ejecucion_Vuelo_ParametrosService.listaSelAll(0, 1000, 'Ejecucion_de_Vuelo.Folio=' + id).toPromise();
      // this.ParametrosData = fParametros.Detalle_Ejecucion_Vuelo_Parametross;
      // this.loadParametros(fParametros.Detalle_Ejecucion_Vuelo_Parametross);      
      let xData = new MatTableDataSource(fParametros.Detalle_Ejecucion_Vuelo_Parametross);
      // this.dataSourceParametros.paginator = this.paginator;
      // this.dataSourceParametros.sort = this.sort;
      this.dataParametros = xData.data;

      let fComponentes = await this.Detalle_Ejecucion_Vuelo_ComponentesService.listaSelAll(0, 1000, 'Ejecucion_de_Vuelo.Folio=' + id).toPromise();
      this.ComponentesData = fComponentes.Detalle_Ejecucion_Vuelo_Componentess;
      this.loadComponentes(fComponentes.Detalle_Ejecucion_Vuelo_Componentess);
      this.dataSourceComponentes = new MatTableDataSource(fComponentes.Detalle_Ejecucion_Vuelo_Componentess);
      this.dataSourceComponentes.paginator = this.paginator;
      this.dataSourceComponentes.sort = this.sort;

      let fLectura_de_Altimetros = await this.Detalle_Ejecucion_Vuelo_AltimetrosService.listaSelAll(0, 1000, 'Ejecucion_de_Vuelo.Folio=' + id).toPromise();
      this.Lectura_de_AltimetrosData = fLectura_de_Altimetros.Detalle_Ejecucion_Vuelo_Altimetross;
      this.loadLectura_de_Altimetros(fLectura_de_Altimetros.Detalle_Ejecucion_Vuelo_Altimetross);
      this.dataSourceLectura_de_Altimetros = new MatTableDataSource(fLectura_de_Altimetros.Detalle_Ejecucion_Vuelo_Altimetross);
      this.dataSourceLectura_de_Altimetros.paginator = this.paginator;
      this.dataSourceLectura_de_Altimetros.sort = this.sort;

      this.model.fromObject(result.Ejecucion_de_Vuelos[0]);

      let Numero_de_Vuelo = {
        Clave: result.Ejecucion_de_Vuelos[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Folio,
        Description: result.Ejecucion_de_Vuelos[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
      }

      this.Ejecucion_de_VueloForm.get('Numero_de_Vuelo').setValue(Numero_de_Vuelo, { onlySelf: false, emitEvent: true });

      await this.onChangeNumero_de_Vuelo(0)

      let Tramo_de_Vuelo = {
        Clave: result.Ejecucion_de_Vuelos[0].Tramo_de_Vuelo_Registro_de_vuelo.Folio,
        Description: result.Ejecucion_de_Vuelos[0].Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo
      }

      this.Ejecucion_de_VueloForm.get('Tramo_de_Vuelo').setValue(Tramo_de_Vuelo, { onlySelf: false, emitEvent: true });

      await this.onChangeTramo_de_Vuelo(0);

      this.Ejecucion_de_VueloForm.get('Matricula').setValue(
        result.Ejecucion_de_Vuelos[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );

      let Origen = {
        Aeropuerto_ID: result.Ejecucion_de_Vuelos[0].Origen_Aeropuertos.Aeropuerto_ID,
        Descripcion: result.Ejecucion_de_Vuelos[0].Origen_Aeropuertos.Descripcion
      }

      this.Ejecucion_de_VueloForm.get('Origen').setValue(Origen, { onlySelf: false, emitEvent: true });

      let Destino = {
        Aeropuerto_ID: result.Ejecucion_de_Vuelos[0].Destino_Aeropuertos.Aeropuerto_ID,
        Descripcion: result.Ejecucion_de_Vuelos[0].Destino_Aeropuertos.Descripcion
      }

      this.Ejecucion_de_VueloForm.get('Destino').setValue(Destino, { onlySelf: false, emitEvent: true });

      //Administrador_del_Vuelo
      let Administrador_del_Vuelo = {
        Clave: result.Ejecucion_de_Vuelos[0].Administrador_del_Vuelo_Tripulacion.Clave,
        Description: result.Ejecucion_de_Vuelos[0].Administrador_del_Vuelo_Tripulacion.Nombre_completo
      }

      this.Ejecucion_de_VueloForm.get('Administrador_del_Vuelo').setValue(Administrador_del_Vuelo, { onlySelf: false, emitEvent: true });

      //Comandante
      let Comandante = {
        Clave: result.Ejecucion_de_Vuelos[0].Comandante_Tripulacion.Clave,
        Description: result.Ejecucion_de_Vuelos[0].Comandante_Tripulacion.Nombre_completo
      }

      this.Ejecucion_de_VueloForm.get('Comandante').setValue(Comandante.Clave, { onlySelf: false, emitEvent: true });

      //Capitan
      let Capitan = {
        Clave: result.Ejecucion_de_Vuelos[0].Capitan_Tripulacion.Clave,
        Description: result.Ejecucion_de_Vuelos[0].Capitan_Tripulacion.Nombre_completo
      }

      this.Ejecucion_de_VueloForm.get('Capitan').setValue(Capitan.Clave, { onlySelf: false, emitEvent: true });

      //Primer_Capitan
      let Primer_Capitan = {
        Clave: result.Ejecucion_de_Vuelos[0].Primer_Capitan_Tripulacion.Clave,
        Description: result.Ejecucion_de_Vuelos[0].Primer_Capitan_Tripulacion.Nombre_completo
      }

      this.Ejecucion_de_VueloForm.get('Primer_Capitan').setValue(Primer_Capitan.Clave, { onlySelf: false, emitEvent: true });

      //Segundo_Capitan
      let Segundo_Capitan = {
        Clave: result.Ejecucion_de_Vuelos[0].Segundo_Capitan_Tripulacion.Clave,
        Description: result.Ejecucion_de_Vuelos[0].Segundo_Capitan_Tripulacion.Nombre_completo
      }

      this.Ejecucion_de_VueloForm.get('Segundo_Capitan').setValue(Segundo_Capitan.Clave, { onlySelf: false, emitEvent: true });

      //Segundo_Capitan
      let Sobrecargo = {
        Clave: result.Ejecucion_de_Vuelos[0].Sobrecargo_Tripulacion.Clave,
        Description: result.Ejecucion_de_Vuelos[0].Sobrecargo_Tripulacion.Nombre_completo
      }

      this.Ejecucion_de_VueloForm.get('Sobrecargo').setValue(Sobrecargo.Clave, { onlySelf: false, emitEvent: true });

      this.minFecha_de_Aterrizaje = new Date(result.Ejecucion_de_Vuelos[0].Fecha_de_Aterrizaje)
      this.minFecha_de_Llegada = new Date(result.Ejecucion_de_Vuelos[0].Fecha_de_Llegada)

      this.Ejecucion_de_VueloForm.markAllAsTouched();
      this.Ejecucion_de_VueloForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  //#region Pasajeros

  get PasajerosItems(): FormArray {
    return this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_de_vuelo_pasajerosItems') as FormArray;
  }

  getPasajerosColumns(): string[] {
    return this.PasajerosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPasajeros(Pasajeros: Detalle_Ejecucion_de_vuelo_pasajeros[]) {
    Pasajeros.forEach(element => {
      this.addPasajeros(element);
    });
  }

  addPasajerosToMR() {
    const Pasajeros = new Detalle_Ejecucion_de_vuelo_pasajeros(this.fb);
    this.PasajerosData.push(this.addPasajeros(Pasajeros));
    this.dataSourcePasajeros.data = this.PasajerosData;
    Pasajeros.edit = true;
    Pasajeros.isNew = true;
    const length = this.dataSourcePasajeros.data.length;
    const index = length - 1;
    const formPasajeros = this.PasajerosItems.controls[index] as FormGroup;
    this.addFilterToControlPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros(formPasajeros.controls.Pasajeros, index);

    const page = Math.ceil(this.dataSourcePasajeros.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addPasajeros(entity: Detalle_Ejecucion_de_vuelo_pasajeros) {
    const Pasajeros = new Detalle_Ejecucion_de_vuelo_pasajeros(this.fb);

    this.PasajerosItems.push(Pasajeros.buildFormGroup());

    if (entity) {
      Pasajeros.fromObject(entity);
    }
    return entity;
  }

  PasajerosItemsByFolio(Folio: number): FormGroup {
    return (this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_de_vuelo_pasajerosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  PasajerosItemsByElemet(element: any): FormGroup {

    const index = this.dataSourcePasajeros.data.indexOf(element);
    let fb = this.PasajerosItems.controls[index] as FormGroup;

    return fb;
  }

  deletePasajeros(element: any) {
    let index = this.dataSourcePasajeros.data.indexOf(element);
    this.PasajerosData[index].IsDeleted = true;
    this.dataSourcePasajeros.data = this.PasajerosData;
    this.dataSourcePasajeros._updateChangeSubscription();
    index = this.dataSourcePasajeros.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditPasajeros(element: any) {
    let index = this.dataSourcePasajeros.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.PasajerosData[index].IsDeleted = true;
      this.dataSourcePasajeros.data = this.PasajerosData;
      this.dataSourcePasajeros._updateChangeSubscription();
      index = this.PasajerosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async savePasajeros(element: any) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    const formPasajeros = this.PasajerosItems.controls[index] as FormGroup;

    if (this.PasajerosData[index].Pasajeros !== formPasajeros.value.Pasajeros && formPasajeros.value.Pasajeros > 0) {
      let pasajeros = await this.PasajerosService.getById(formPasajeros.value.Pasajeros).toPromise();

      for (let index = 0; index < this.PasajerosData.length; index++) {
        if (this.PasajerosData[index].Pasajeros == pasajeros.Clave) {
          this.snackBar.open('No se pueden guardar pasajeros repetidos.', '', {
            duration: 2000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: ['warning']
          });
          this.deletePasajeros(element)
          return false;
        }
      }
      this.PasajerosData[index].Pasajeros_Pasajeros = pasajeros;
    }
    this.PasajerosData[index].Pasajeros = formPasajeros.value.Pasajeros;

    this.PasajerosData[index].isNew = false;
    this.dataSourcePasajeros.data = this.PasajerosData;
    this.dataSourcePasajeros._updateChangeSubscription();
    this.saveButtonPasajeros = true;
  }

  editPasajeros(element: any) {
    element.edit = true;

    const index = this.dataSourcePasajeros.data.indexOf(element);
    const formPasajeros = this.PasajerosItems.controls[index] as FormGroup;
    this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros[index] = this.dataSourcePasajeros.data[index].Pasajeros_Pasajeros.Nombre_completo;
    this.addFilterToControlPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros(formPasajeros.controls.Pasajeros, index);

  }


  async saveDetalle_Ejecucion_de_vuelo_pasajeros(Folio: number) {
    this.dataSourcePasajeros.data.forEach(async (d, index) => {
      const data = this.PasajerosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Ejecucion_de_Vuelo = Folio;
      model.Tramo_de_vuelo = Folio;

      if (model.Folio === 0) {
        // Add Pasajeros
        let response = await this.Detalle_Ejecucion_de_vuelo_pasajerosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPasajeros = this.PasajerosItemsByFolio(model.Folio);
        if (formPasajeros.dirty) {
          // Update Pasajeros
          let response = await this.Detalle_Ejecucion_de_vuelo_pasajerosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Pasajeros
        await this.Detalle_Ejecucion_de_vuelo_pasajerosService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    this.VerificarPasajeros();
    if (!event.option) {
      return;
    }
    this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros[index] = event.option.viewValue;
    let fgr = this.Ejecucion_de_VueloForm.controls.Detalle_Ejecucion_de_vuelo_pasajerosItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Pasajeros.setValue(event.option.value);
    this.displayFnPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros(element);
  }

  displayFnPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros(this, element) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    return this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros[index];
  }

  updateOptionPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros(event, element: any) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros[index] = event.source.viewValue;
  }

  _filterPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros(filter: any): Observable<Pasajeros> {
    const where = filter !== '' ? "Pasajeros.Nombre_completo like '%" + filter + "%'" : '';
    return this.PasajerosService.listaSelAll(0, 20, where);
  }

  addFilterToControlPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros(control: any, index) {

    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros = true;
        return this._filterPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros(value || '');
      })
    ).subscribe(result => {

      this.varPasajeros = result.Pasajeross;
      this.isLoadingPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros = false;
      this.searchPasajeros_Detalle_Ejecucion_de_vuelo_pasajerosCompleted = true;
      this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros[index] = this.varPasajeros.length === 0 ? '' : this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros[index];
    });


  }

  //#endregion


  //#region Pasajeros Adicionales
  get Pasajeros_Adicionales_MRItems() {
    return this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesItems') as FormArray;
  }

  getPasajeros_Adicionales_MRColumns(): string[] {
    return this.Pasajeros_Adicionales_MRColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPasajeros_Adicionales_MR(Pasajeros_Adicionales_MR: Detalle_Ejecucion_de_vuelo_pasajeros_adicionales[]) {
    Pasajeros_Adicionales_MR.forEach(element => {
      this.addPasajeros_Adicionales_MR(element);
    });
  }

  addPasajeros_Adicionales_MRToMR() {
    const Pasajeros_Adicionales_MR = new Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(this.fb);
    this.Pasajeros_Adicionales_MRData.push(this.addPasajeros_Adicionales_MR(Pasajeros_Adicionales_MR));
    this.dataSourcePasajeros_Adicionales_MR.data = this.Pasajeros_Adicionales_MRData;
    Pasajeros_Adicionales_MR.edit = true;
    Pasajeros_Adicionales_MR.isNew = true;
    const length = this.dataSourcePasajeros_Adicionales_MR.data.length;
    const index = length - 1;
    const formPasajeros_Adicionales_MR = this.Pasajeros_Adicionales_MRItems.controls[index] as FormGroup;
    this.addFilterToControlPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(formPasajeros_Adicionales_MR.controls.Pasajeros, index);

    const page = Math.ceil(this.dataSourcePasajeros_Adicionales_MR.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addPasajeros_Adicionales_MR(entity: Detalle_Ejecucion_de_vuelo_pasajeros_adicionales) {
    const Pasajeros_Adicionales_MR = new Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(this.fb);
    this.Pasajeros_Adicionales_MRItems.push(Pasajeros_Adicionales_MR.buildFormGroup());
    if (entity) {
      Pasajeros_Adicionales_MR.fromObject(entity);
    }
    return entity;
  }

  Pasajeros_Adicionales_MRItemsByFolio(Folio: number): FormGroup {
    return (this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Pasajeros_Adicionales_MRItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePasajeros_Adicionales_MR.data.indexOf(element);
    let fb = this.Pasajeros_Adicionales_MRItems.controls[index] as FormGroup;
    return fb;
  }

  deletePasajeros_Adicionales_MR(element: any) {
    let index = this.dataSourcePasajeros_Adicionales_MR.data.indexOf(element);
    this.Pasajeros_Adicionales_MRData[index].IsDeleted = true;
    this.dataSourcePasajeros_Adicionales_MR.data = this.Pasajeros_Adicionales_MRData;
    this.dataSourcePasajeros_Adicionales_MR._updateChangeSubscription();
    index = this.dataSourcePasajeros_Adicionales_MR.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditPasajeros_Adicionales_MR(element: any) {
    let index = this.dataSourcePasajeros_Adicionales_MR.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Pasajeros_Adicionales_MRData[index].IsDeleted = true;
      this.dataSourcePasajeros_Adicionales_MR.data = this.Pasajeros_Adicionales_MRData;
      this.dataSourcePasajeros_Adicionales_MR._updateChangeSubscription();
      index = this.Pasajeros_Adicionales_MRData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async savePasajeros_Adicionales_MR(element: any) {
    const index = this.dataSourcePasajeros_Adicionales_MR.data.indexOf(element);
    const formPasajeros_Adicionales_MR = this.Pasajeros_Adicionales_MRItems.controls[index] as FormGroup;
    if (this.Pasajeros_Adicionales_MRData[index].Pasajeros !== formPasajeros_Adicionales_MR.value.Pasajeros && formPasajeros_Adicionales_MR.value.Pasajeros > 0) {
      let pasajeros = await this.PasajerosService.getById(formPasajeros_Adicionales_MR.value.Pasajeros).toPromise();
      this.Pasajeros_Adicionales_MRData[index].Pasajeros_Pasajeros = pasajeros;
    }
    this.Pasajeros_Adicionales_MRData[index].Pasajeros = formPasajeros_Adicionales_MR.value.Pasajeros;

    this.Pasajeros_Adicionales_MRData[index].isNew = false;
    this.dataSourcePasajeros_Adicionales_MR.data = this.Pasajeros_Adicionales_MRData;
    this.dataSourcePasajeros_Adicionales_MR._updateChangeSubscription();
  }

  editPasajeros_Adicionales_MR(element: any) {
    const index = this.dataSourcePasajeros_Adicionales_MR.data.indexOf(element);
    const formPasajeros_Adicionales_MR = this.Pasajeros_Adicionales_MRItems.controls[index] as FormGroup;
    this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales[index] = this.dataSourcePasajeros_Adicionales_MR.data[index].Pasajeros_Pasajeros.Nombre_completo;
    this.addFilterToControlPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(formPasajeros_Adicionales_MR.controls.Pasajeros, index);

    element.edit = true;
  }

  async saveDetalle_Ejecucion_de_vuelo_pasajeros_adicionales(Folio: number) {
    this.dataSourcePasajeros_Adicionales_MR.data.forEach(async (d, index) => {
      const data = this.Pasajeros_Adicionales_MRItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Ejecucion_de_Vuelo = Folio;
      model.Tramo_de_vuelo = Folio;


      if (model.Folio === 0) {
        // Add Pasajeros Adicionales
        let response = await this.Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPasajeros_Adicionales_MR = this.Pasajeros_Adicionales_MRItemsByFolio(model.Folio);
        if (formPasajeros_Adicionales_MR.dirty) {
          // Update Pasajeros Adicionales
          let response = await this.Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Pasajeros Adicionales
        await this.Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePasajeros_Adicionales_MR.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales[index] = event.option.viewValue;
    let fgr = this.Ejecucion_de_VueloForm.controls.Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Pasajeros.setValue(event.option.value);
    this.displayFnPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(element);
  }

  displayFnPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(this, element) {
    const index = this.dataSourcePasajeros_Adicionales_MR.data.indexOf(element);
    return this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales[index];
  }

  updateOptionPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(event, element: any) {
    const index = this.dataSourcePasajeros_Adicionales_MR.data.indexOf(element);
    this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales[index] = event.source.viewValue;
  }

  _filterPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(filter: any): Observable<Pasajeros> {
    const where = filter !== '' ? "Pasajeros.Nombre_completo like '%" + filter + "%'" : '';
    return this.PasajerosService.listaSelAll(0, 20, where);
  }

  addFilterToControlPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales = true;
        return this._filterPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales(value || '');
      })
    ).subscribe(result => {
      this.varPasajeros = result.Pasajeross;
      this.isLoadingPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales = false;
      this.searchPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionalesCompleted = true;
      this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales[index] = this.varPasajeros.length === 0 ? '' : this.SelectedPasajeros_Detalle_Ejecucion_de_vuelo_pasajeros_adicionales[index];
    });
  }

  //#endregion


  //#region Parametros
  get ParametrosItems() {
    return this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_Vuelo_ParametrosItems') as FormArray;
  }

  getParametrosColumns(): string[] {
    return this.ParametrosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadParametros(Parametros: Detalle_Ejecucion_Vuelo_Parametros[]) {
    Parametros.forEach(element => {
      this.addParametros(element);
    });
  }

  addParametrosToMR() {
    const Parametros = new Detalle_Ejecucion_Vuelo_Parametros(this.fb);
    this.ParametrosData.push(this.addParametros(Parametros));
    this.dataSourceParametros.data = this.ParametrosData;
    Parametros.edit = true;
    Parametros.isNew = true;
    const length = this.dataSourceParametros.data.length;
    const index = length - 1;
    const formParametros = this.ParametrosItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceParametros.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addParametros(entity: Detalle_Ejecucion_Vuelo_Parametros) {
    const Parametros = new Detalle_Ejecucion_Vuelo_Parametros(this.fb);
    this.ParametrosItems.push(Parametros.buildFormGroup());
    if (entity) {
      Parametros.fromObject(entity);
    }
    return entity;
  }

  ParametrosItemsByFolio(Folio: number): FormGroup {
    return (this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_Vuelo_ParametrosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  ParametrosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceParametros.data.indexOf(element);
    let fb = this.ParametrosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteParametros(element: any) {
    let index = this.dataSourceParametros.data.indexOf(element);
    this.ParametrosData[index].IsDeleted = true;
    this.dataSourceParametros.data = this.ParametrosData;
    this.dataSourceParametros._updateChangeSubscription();
    index = this.dataSourceParametros.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditParametros(element: any) {
    let index = this.dataSourceParametros.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.ParametrosData[index].IsDeleted = true;
      this.dataSourceParametros.data = this.ParametrosData;
      this.dataSourceParametros._updateChangeSubscription();
      index = this.ParametrosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveParametros(element: any) {
    const index = this.dataSourceParametros.data.indexOf(element);
    const formParametros = this.ParametrosItems.controls[index] as FormGroup;
    this.ParametrosData[index].Parametro = formParametros.value.Parametro;
    this.ParametrosData[index].MOT_1 = formParametros.value.MOT_1;
    this.ParametrosData[index].MOT_2 = formParametros.value.MOT_2;

    this.ParametrosData[index].isNew = false;
    this.dataSourceParametros.data = this.ParametrosData;
    this.dataSourceParametros._updateChangeSubscription();
  }

  editParametros(element: any) {
    const index = this.dataSourceParametros.data.indexOf(element);
    const formParametros = this.ParametrosItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Ejecucion_Vuelo_Parametros(Folio: number) {
    this.dataSourceParametros.data.forEach(async (d, index) => {
      const data = this.ParametrosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Ejecucion_de_Vuelo = Folio;

      if (model.Folio === 0) {
        // Add Parámetros
        let response = await this.Detalle_Ejecucion_Vuelo_ParametrosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formParametros = this.ParametrosItemsByFolio(model.Folio);
        if (formParametros.dirty) {
          // Update Parámetros
          let response = await this.Detalle_Ejecucion_Vuelo_ParametrosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Parámetros
        await this.Detalle_Ejecucion_Vuelo_ParametrosService.delete(model.Folio).toPromise();
      }
    });
  }

  //#endregion


  //#region Componentes
  get ComponentesItems() {
    return this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_Vuelo_ComponentesItems') as FormArray;
  }

  getComponentesColumns(): string[] {
    return this.ComponentesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadComponentes(Componentes: Detalle_Ejecucion_Vuelo_Componentes[]) {
    Componentes.forEach(element => {
      this.addComponentes(element);
    });
  }

  addComponentesToMR() {
    const Componentes = new Detalle_Ejecucion_Vuelo_Componentes(this.fb);
    this.ComponentesData.push(this.addComponentes(Componentes));
    this.dataSourceComponentes.data = this.ComponentesData;
    Componentes.edit = true;
    Componentes.isNew = true;
    const length = this.dataSourceComponentes.data.length;
    const index = length - 1;
    const formComponentes = this.ComponentesItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceComponentes.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addComponentes(entity: Detalle_Ejecucion_Vuelo_Componentes) {
    const Componentes = new Detalle_Ejecucion_Vuelo_Componentes(this.fb);
    this.ComponentesItems.push(Componentes.buildFormGroup());
    if (entity) {
      Componentes.fromObject(entity);
    }
    return entity;
  }

  ComponentesItemsByFolio(Folio: number): FormGroup {
    return (this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_Vuelo_ComponentesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  ComponentesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceComponentes.data.indexOf(element);
    let fb = this.ComponentesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteComponentes(element: any) {
    let index = this.dataSourceComponentes.data.indexOf(element);
    this.ComponentesData[index].IsDeleted = true;
    this.dataSourceComponentes.data = this.ComponentesData;
    this.dataSourceComponentes._updateChangeSubscription();
    index = this.dataSourceComponentes.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditComponentes(element: any) {
    let index = this.dataSourceComponentes.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.ComponentesData[index].IsDeleted = true;
      this.dataSourceComponentes.data = this.ComponentesData;
      this.dataSourceComponentes._updateChangeSubscription();
      index = this.ComponentesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveComponentes(element: any) {
    const index = this.dataSourceComponentes.data.indexOf(element);
    const formComponentes = this.ComponentesItems.controls[index] as FormGroup;
    this.ComponentesData[index].Componente = formComponentes.value.Componente;
    this.ComponentesData[index].turm = formComponentes.value.turm;
    this.ComponentesData[index].tt = formComponentes.value.tt;
    this.ComponentesData[index].CICLOS = formComponentes.value.CICLOS;

    this.ComponentesData[index].isNew = false;
    this.dataSourceComponentes.data = this.ComponentesData;
    this.dataSourceComponentes._updateChangeSubscription();
  }

  editComponentes(element: any) {
    const index = this.dataSourceComponentes.data.indexOf(element);
    const formComponentes = this.ComponentesItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Ejecucion_Vuelo_Componentes(Folio: number) {
    this.dataSourceComponentes.data.forEach(async (d, index) => {
      const data = this.ComponentesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Ejecucion_de_Vuelo = Folio;


      if (model.Folio === 0) {
        // Add Componentes
        let response = await this.Detalle_Ejecucion_Vuelo_ComponentesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formComponentes = this.ComponentesItemsByFolio(model.Folio);
        if (formComponentes.dirty) {
          // Update Componentes
          let response = await this.Detalle_Ejecucion_Vuelo_ComponentesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Componentes
        await this.Detalle_Ejecucion_Vuelo_ComponentesService.delete(model.Folio).toPromise();
      }
    });
  }

  //#endregion


  //#region Lectura de Altimetros
  get Lectura_de_AltimetrosItems() {
    return this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_Vuelo_AltimetrosItems') as FormArray;
  }

  getLectura_de_AltimetrosColumns(): string[] {
    return this.Lectura_de_AltimetrosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadLectura_de_Altimetros(Lectura_de_Altimetros: Detalle_Ejecucion_Vuelo_Altimetros[]) {
    Lectura_de_Altimetros.forEach(element => {
      this.addLectura_de_Altimetros(element);
    });
  }

  addLectura_de_AltimetrosToMR() {
    const Lectura_de_Altimetros = new Detalle_Ejecucion_Vuelo_Altimetros(this.fb);
    this.Lectura_de_AltimetrosData.push(this.addLectura_de_Altimetros(Lectura_de_Altimetros));
    this.dataSourceLectura_de_Altimetros.data = this.Lectura_de_AltimetrosData;
    Lectura_de_Altimetros.edit = true;
    Lectura_de_Altimetros.isNew = true;
    const length = this.dataSourceLectura_de_Altimetros.data.length;
    const index = length - 1;
    const formLectura_de_Altimetros = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceLectura_de_Altimetros.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addLectura_de_Altimetros(entity: Detalle_Ejecucion_Vuelo_Altimetros) {
    const Lectura_de_Altimetros = new Detalle_Ejecucion_Vuelo_Altimetros(this.fb);
    this.Lectura_de_AltimetrosItems.push(Lectura_de_Altimetros.buildFormGroup());
    if (entity) {
      Lectura_de_Altimetros.fromObject(entity);
    }
    return entity;
  }

  Lectura_de_AltimetrosItemsByFolio(Folio: number): FormGroup {
    return (this.Ejecucion_de_VueloForm.get('Detalle_Ejecucion_Vuelo_AltimetrosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Lectura_de_AltimetrosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
    let fb = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteLectura_de_Altimetros(element: any) {
    let index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
    this.Lectura_de_AltimetrosData[index].IsDeleted = true;
    this.dataSourceLectura_de_Altimetros.data = this.Lectura_de_AltimetrosData;
    this.dataSourceLectura_de_Altimetros._updateChangeSubscription();
    index = this.dataSourceLectura_de_Altimetros.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditLectura_de_Altimetros(element: any) {
    let index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Lectura_de_AltimetrosData[index].IsDeleted = true;
      this.dataSourceLectura_de_Altimetros.data = this.Lectura_de_AltimetrosData;
      this.dataSourceLectura_de_Altimetros._updateChangeSubscription();
      index = this.Lectura_de_AltimetrosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveLectura_de_Altimetros(element: any) {
    const index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
    const formLectura_de_Altimetros = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;
    this.Lectura_de_AltimetrosData[index].Concepto = formLectura_de_Altimetros.value.Concepto;
    this.Lectura_de_AltimetrosData[index].ALTIM_1 = formLectura_de_Altimetros.value.ALTIM_1;
    this.Lectura_de_AltimetrosData[index].ALTIM_2 = formLectura_de_Altimetros.value.ALTIM_2;
    this.Lectura_de_AltimetrosData[index].ALTIM_AUX = formLectura_de_Altimetros.value.ALTIM_AUX;

    this.Lectura_de_AltimetrosData[index].isNew = false;
    this.dataSourceLectura_de_Altimetros.data = this.Lectura_de_AltimetrosData;
    this.dataSourceLectura_de_Altimetros._updateChangeSubscription();
  }

  editLectura_de_Altimetros(element: any) {
    const index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
    const formLectura_de_Altimetros = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Ejecucion_Vuelo_Altimetros(Folio: number) {
    this.dataSourceLectura_de_Altimetros.data.forEach(async (d, index) => {
      const data = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Ejecucion_de_Vuelo = Folio;


      if (model.Folio === 0) {
        // Add Lectura de Altímetros
        let response = await this.Detalle_Ejecucion_Vuelo_AltimetrosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formLectura_de_Altimetros = this.Lectura_de_AltimetrosItemsByFolio(model.Folio);
        if (formLectura_de_Altimetros.dirty) {
          // Update Lectura de Altímetros
          let response = await this.Detalle_Ejecucion_Vuelo_AltimetrosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Lectura de Altímetros
        await this.Detalle_Ejecucion_Vuelo_AltimetrosService.delete(model.Folio).toPromise();
      }
    });
  }
  //#endregion


  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tipo_de_Ala': {
        this.Tipo_de_AlaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Ala = x.Tipo_de_Alas;
        });
        break;
      }
      case 'Tipo_de_Vuelo': {
        this.Tipo_de_vueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_vuelo = x.Tipo_de_vuelos;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnNumero_de_Vuelo(option: any) {
    return option?.Description;
  }
  displayFnTramo_de_Vuelo(option: any) {
    return option?.Description;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnOrigen(option: Aeropuertos) {
    return option?.Descripcion;
  }
  displayFnDestino(option: Aeropuertos) {
    return option?.Descripcion;
  }
  displayFnAdministrador_del_Vuelo(option: any) {
    return option?.Description;
  }

  fnSetAdministradorDeVuelo(event) {
    let comandante;
    this.varTripulacion.forEach(element => {
      if (event.value == element.Clave) {
        comandante = element
      }
    });
    this.Ejecucion_de_VueloForm.controls["Administrador_del_Vuelo"].setValue(comandante)
  }

  async save() {
    await this.rulesBeforeSave();
  }

  async saveData(): Promise<any> {

    this.Ejecucion_de_VueloForm.enable();
    const entity = this.Ejecucion_de_VueloForm.value;
    entity.Folio = this.model.Folio;
    entity.Numero_de_Vuelo = this.Ejecucion_de_VueloForm.get('Numero_de_Vuelo').value.Clave;
    entity.Tramo_de_Vuelo = this.Ejecucion_de_VueloForm.get('Tramo_de_Vuelo').value.Clave;
    entity.Matricula = this.Ejecucion_de_VueloForm.get('Matricula').value.Matricula;
    entity.Origen = this.Ejecucion_de_VueloForm.get('Origen').value.Aeropuerto_ID;
    entity.Destino = this.Ejecucion_de_VueloForm.get('Destino').value.Aeropuerto_ID;
    entity.Administrador_del_Vuelo = this.Ejecucion_de_VueloForm.get('Administrador_del_Vuelo')?.value?.Clave;
    entity.Distancia_FIR_Km = this.distancia_FIR_KmFIR;
    entity.Observaciones = this.Ejecucion_de_VueloForm.get('Observaciones').value;
    entity.Tipo_de_Ala = this.Ejecucion_de_VueloForm.get('Tipo_de_Ala')?.value?.Clave;

    entity.Tiempo_de_Vuelo = this.setValidHour(entity.Tiempo_de_Vuelo)
    entity.Tiempo_de_Calzo = this.setValidHour(entity.Tiempo_de_Calzo)

    entity.Hora_de_Aterrizaje = this.setValidHour(entity.Hora_de_Aterrizaje)
    entity.Hora_de_Despegue = this.setValidHour(entity.Hora_de_Despegue)
    entity.Hora_de_Llegada = this.setValidHour(entity.Hora_de_Llegada)
    entity.Hora_de_Salida = this.setValidHour(entity.Hora_de_Salida)


    console.log(this.model.Folio)


    //Actualizar
    if (this.model.Folio > 0) {
      await this.Ejecucion_de_VueloService.update(this.model.Folio, entity).toPromise().then(async id => {

        await this.saveDetalle_Ejecucion_de_vuelo_pasajeros(this.model.Folio);
        await this.saveDetalle_Ejecucion_de_vuelo_pasajeros_adicionales(this.model.Folio);
        await this.saveDetalle_Ejecucion_Vuelo_Parametros(this.model.Folio);
        await this.saveDetalle_Ejecucion_Vuelo_Componentes(this.model.Folio);
        await this.saveDetalle_Ejecucion_Vuelo_Altimetros(this.model.Folio);
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());

        this.rulesAfterSave();

        return this.model.Folio;

      });

    }
    //Guardar Nuevo
    else {
      await (this.Ejecucion_de_VueloService.insert(entity).toPromise().then(async id => {
        this.model.Folio = id
        await this.saveDetalle_Ejecucion_de_vuelo_pasajeros(id);
        if (this.RoleId != 13) {
          await this.saveDetalle_Ejecucion_de_vuelo_pasajeros_adicionales(id);
        }
        await this.saveDetalle_Ejecucion_Vuelo_Parametros(id);
        await this.saveDetalle_Ejecucion_Vuelo_Componentes(id);
        await this.saveDetalle_Ejecucion_Vuelo_Altimetros(id);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());

        this.rulesAfterSave();

        return id;
      }));
    }


  }


  VerificarPasajeros() {
    let count = this.Ejecucion_de_VueloForm.get("Detalle_Ejecucion_de_vuelo_pasajerosItems").value.length;
    let pasajeros = this.Ejecucion_de_VueloForm.get("Detalle_Ejecucion_de_vuelo_pasajerosItems").value[count - 1]['Pasajeros'];

    if (pasajeros) {
      this.saveButtonPasajeros = false;
    }
    else {
      this.saveButtonPasajeros = true
    }
  }

  //#region Cerrar Modal
  fnCloseModal(result: number) {
    //1 Inserta
    if (result == 1) {
      this.dialogRef.close(result);
    }
    //Indefinido solo cierra
    else {
      this.dialogRef.close();
    }
  }
  //#endregion

  cancel() {
    if (this.localStorageHelper.getItemFromLocalStorage("Ejecucion_de_VueloWindowsFloat") == "1") {
      this.localStorageHelper.setItemToLocalStorage("Ejecucion_de_VueloWindowsFloat", "0");
      window.close();
    }
    else {
      this.goToList();
    }
  }

  goToList() {
    this.router.navigate(['/Ejecucion_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //#region Inicio de Reglas
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
  }

  rulesOnInit() {

    //rulesOnInit_ExecuteBusinessRulesInit

    //#region Reglas de Negocio en cualquier caso

    this.onChangeTramo_de_Vuelo(0);
    //#region BRID:2614 - Ocultar folio - Autor: Lizeth Villa - Actualización: 4/7/2021 10:00:21 AM 
    this.brf.HideFieldOfForm(this.Ejecucion_de_VueloForm, "Folio");
    this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Folio");
    //#endregion BRID:2614

    //#region - BRID:2232 -  Los campos Matrícula, Tipo de Ala, Solicitud, Origen, Destino, Tipo de Vuelo, Tiempo de Calzo, Tiempo de Vuelo, Combustible Consumo Combustible - 
    //SIEMPRE deben estar deshabilitados (DISABLED). - Autor: Neftali - Actualización: 08/11/2022 1:50:44 PM

    this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Matricula', 0);
    this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tipo_de_Ala', 0);
    this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Solicitud', 0);
    this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Calzo', 0);
    this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Vuelo', 0);
    this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tipo_de_Vuelo', 0);
    this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Consumo', 0);

    //#endregion - BRID:2232

    //BRID:2691 - Los campos no deben ser obligatorios:Primer oficialSegundo tripulanteSobrecargo - Autor: Lizeth Villa - Actualización: 4/13/2021 5:25:41 PM    
    this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Capitan");
    this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Primer_Capitan");
    this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Segundo_Capitan");
    this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Sobrecargo");

    //BRID:5553 - No requerido campo administrador de vuelo - Autor: Felipe Rodríguez - Actualización: 8/30/2021 12:52:48 PM    
    this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Administrador_del_Vuelo");


    //#region - BRID:4133 - Asignar ancho a campo dstancia en millas y desabilitar - Autor: Lizeth Villa - Actualización: 7/14/2021 12:57:21 PM
    this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Distancia_en_Millas");
    this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Distancia_en_Millas', 0);
    //#endregion


    //#endregion


    //Nuevo
    if (this.operation == 'New') {

    }
    //Editar
    else if (this.operation == 'Update') {

      //VERIFICAR - BRID:2871 - Filtrar aeropuertos al editar - Autor: Neftali - Actualización: 5/4/2021 10:53:01 AM

      //#region - BRID:5677 - Si el vuelo esta reabierto, habilitar todos los campos - Autor: Lizeth Villa - Actualización: 9/3/2021 5:36:22 PM *IMPORTANTE      
      if (this.brf.EvaluaQuery('if ( ( ' + this.localStorageHelper.getLoggedUserInfo().RoleId + '= 9) or  ( ' + this.localStorageHelper.getLoggedUserInfo().RoleId + '= 12)) begin select 1 end', 1, 'ABC123') == this.brf.TryParseInt('1', '1')
        && this.brf.EvaluaQuery('select Vuelo_reabierto from solicitud_de_vuelo where folio = ' + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Matricula', 1);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tipo_de_Ala', 1);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Solicitud', 1);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Calzo', 1);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Vuelo', 1);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tipo_de_Vuelo', 1);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Consumo', 1);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Pasajeros_Adicionales', 1);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Distancia_en_Millas', 1);
      }
      //#endregion - BRID:5677

      //#region - BRID:6438 - Deshabilitar control del campo Tramo de Vuelo al editar. - Autor: Felipe Rodríguez - Actualización: 9/24/2021 4:35:10 PM
      /* if (this.operation == 'Update') {
        if (this.brf.GetValueByControlType(this.Ejecucion_de_VueloForm, 'Tramo_de_Vuelo') >= this.brf.TryParseInt('1', '1')) {
          this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tramo_de_Vuelo', 0);
        }
      } */
      //#endregion


    }
    //Consultar
    else if (this.operation == 'Consult') {

      //#region - BRID:2859 - Deshabilitar campo origen y destino - Autor: Neftali - Actualización: 4/30/2021 1:50:42 PM
      this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Origen', 0);
      this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Destino', 0);
      //#endregion - BRID:2859

      //VERIFICAR - BRID:3052 - filtar campos al consultar con codigo manual no desactivar - Autor: Lizeth Villa - Actualización: 5/13/2021 5:44:35 PM
    }

    //#region Rol : Piloto
    if (this.RoleId == 13 || this.RoleId == 12 || this.RoleId == 9) {
      this.getNumero_de_Vuelo();

    }
    //#endregion 


    //VERIFICAR - BRID:6111 - Ocultar pestaña de Pasajeros adicionales para todos - Autor: ANgel Acuña - Actualización: 9/9/2021 1:51:28 PM
    //VERIFICAR - BRID:6152 - Ocultar siempre campos pasajeros adicionales - Autor: Lizeth Villa - Actualización: 9/13/2021 12:24:45 P



    //INICIA - BRID:2348 - En el MR de Pasajeros filtrar los pasajeros para que solo aparezcan los pasajeros del vuelo. - Autor: Lizeth Villa - Actualización: 4/22/2021 12:54:38 PM
    if (this.operation == 'New') {
      this.brf.FillMultiRenglonfromQuery(this.dataSourcePasajeros, "SELECT * FROM Detalle_Ejecucion_de_vuelo_pasajeros", 1, "ABC123");
    }
    //TERMINA - BRID:2348



    //INICIA - BRID:2659 - -Al abrir la pantalla, en alta, si el rol es distinto de piloto:* llenar en automático los campos Matrícula, Tipo de Ala, Solicitud y Tipo de Vuelo. - Autor: Lizeth Villa - Actualización: 4/12/2021 4:39:52 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId != this.brf.TryParseInt('13', '13')) {
        this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Matricula", "select top 1 matricula from Registro_de_vuelo with(nolock) where no_vuelo = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
        this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Tipo_de_Ala", "select top 1 Tipo_de_Ala from aeronave with(nolock) where matricula = (select top 1 matricula from Registro_de_vuelo with(nolock) where no_vuelo = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
        this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Solicitud", "select top 1 convert(nvarchar(11), Fecha_de_Solicitud, 105) from Solicitud_de_Vuelo where folio= " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
        this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Tipo_de_Vuelo", "select top 1 Tipo_de_Vuelo from Registro_de_vuelo with(nolock) where no_vuelo = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
      }
    }
    //TERMINA - BRID:2659


    //INICIA - BRID:2709 - Traer información al editar y consultar. - Autor: Lizeth Villa - Actualización: 5/12/2021 5:17:28 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Comandante", `SELECT COMANDANTE FROM EJECUCION_DE_VUELO WHERE FOLIO = ${this.Ejecucion_de_VueloForm.get('Folio').value}`, 1, "ABC123");
      this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Capitan", `SELECT CAPITAN FROM EJECUCION_DE_VUELO WHERE FOLIO =  ${this.Ejecucion_de_VueloForm.get('Folio').value} `, 1, "ABC123");
      this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Primer_Capitan", `SELECT PRIMER_CAPITAN FROM EJECUCION_DE_VUELO WHERE FOLIO = ${this.Ejecucion_de_VueloForm.get('Folio').value}  `, 1, "ABC123");
      this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Segundo_Capitan", ` SELECT SEGUNDO_CAPITAN FROM EJECUCION_DE_VUELO WHERE FOLIO = ${this.Ejecucion_de_VueloForm.get('Folio').value} `, 1, "ABC123");
      this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Sobrecargo", ` SELECT SOBRECARGO FROM EJECUCION_DE_VUELO WHERE FOLIO =  ${this.Ejecucion_de_VueloForm.get('Folio').value} `, 1, "ABC123");
    }
    //TERMINA - BRID:2709


    //INICIA - BRID:2758 - En la pantalla de ejecución de vuelo, al dar de alta, si el rol es distinto de piloto entonces debe llenar los MR con la bitácora que corresponde al avión - Autor: Lizeth Villa - Actualización: 4/16/2021 2:19:55 PM
    if (this.operation == 'New') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId != 13) {
        this.brf.FillMultiRenglonfromQuery(this.dataSourceParametros, "SELECT * FROM Detalle_Ejecucion_Vuelo_Parametros", 1, "ABC123");
        this.brf.FillMultiRenglonfromQuery(this.dataSourceComponentes, "SELECT * FROM Detalle_Ejecucion_Vuelo_Componentes", 1, "ABC123");
        this.brf.FillMultiRenglonfromQuery(this.dataSourceLectura_de_Altimetros, "SELECT * FROM Detalle_Ejecucion_Vuelo_Altimetros", 1, "ABC123");
      }
    }
    //TERMINA - BRID:2758


    //INICIA - BRID:2820 - si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje con codigo manual - Autor: Administrador - Actualización: 5/3/2021 4:30:44 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery('SELECT COUNT(*)  from Solicitud_de_Vuelo where folio = ' + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + '  and estatus = 9 ', 1, 'ABC123') == this.brf.TryParseInt('1', '1')
        && this.brf.EvaluaQuery('if ( ' + this.localStorageHelper.getLoggedUserInfo().RoleId + ' = 1 or  ' + this.localStorageHelper.getLoggedUserInfo().RoleId + ' = 9 ) begin select 1 end ', 1, 'ABC123') != this.brf.TryParseInt('1', '1')) {
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Numero_de_Vuelo', 0);


        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tipo_de_Ala', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Solicitud', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tramo_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Origen', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Destino', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Comandante', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Capitan', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Primer_Capitan', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Segundo_Capitan', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Sobrecargo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Salida', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Calzo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Llegada', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Llegada', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Aterrizaje', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Aterrizaje', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Despegue', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Despegue', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tipo_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Despegue', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Aterrizaje', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Consumo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Cargado', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tramo_de_vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Pasajeros', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Ejecucion_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Parametro', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'MOT_1', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'MOT_2', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Ejecucion_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Componente', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'turm', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'tt', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'CICLOS', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Ejecucion_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Concepto', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'ALTIM_1', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'ALTIM_2', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'ALTIM_AUX', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Reportes_de_la_Aeronave', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Espera', 0);
        // verificar
        this.brf.ShowMessage("DecodifyText('El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar', rowIndex, nameOfTable)");
      }
    }
    //TERMINA - BRID:2820


    //INICIA - BRID:2835 - al editar si es operaciones se debe deshabilitar todo y ocultar el botón de guardar - Autor: Lizeth Villa - Actualización: 4/28/2021 10:32:33 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 12) {
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Comandante', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Primer_Capitan', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Segundo_Capitan', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Sobrecargo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Llegada', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Salida', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Llegada', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Aterrizaje', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Aterrizaje', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Despegue', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Despegue', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Despegue', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Aterrizaje', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Consumo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tramo_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Capitan', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Cargado', 0);
        //verificar
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Reportes_de_la_Aeronave', 0);
      }
    }
    //TERMINA - BRID:2835



    //INICIA - BRID:2875 - ROL OPERACIONES SOLO PUEDE AGREGAR PASASJEROS ADICIONALES - Autor: Administrador - Actualización: 5/6/2021 12:10:37 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 12) {
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tramo_de_Vuelo', 0);

        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tipo_de_Ala', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Solicitud', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Origen', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Destino', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Comandante', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Capitan', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Primer_Capitan', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Segundo_Capitan', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Sobrecargo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tipo_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Pasajeros_Adicionales', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Salida', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Despegue', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Despegue', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Aterrizaje', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Aterrizaje', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Fecha_de_Llegada', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Hora_de_Llegada', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Calzo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Cargado', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Despegue', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Aterrizaje', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Combustible__Consumo', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Parametros', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Componentes', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Lectura_de_Altimetros', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Pasajeros', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Reportes_de_la_Aeronave', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Tiempo_de_Espera', 0);
        this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Pernoctas', 0);

        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Reportes_de_la_Aeronave");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Tiempo_de_Espera");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Pernoctas");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Folio");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Numero_de_Vuelo");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Tramo_de_Vuelo");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Matricula");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Tipo_de_Ala");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Solicitud");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Origen");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Destino");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Comandante");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Capitan");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Primer_Capitan");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Segundo_Capitan");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Sobrecargo");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Tipo_de_Vuelo");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Pasajeros_Adicionales");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Fecha_de_Salida");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Hora_de_Salida");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Fecha_de_Despegue");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Hora_de_Despegue");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Fecha_de_Aterrizaje");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Hora_de_Aterrizaje");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Fecha_de_Llegada");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Hora_de_Llegada");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Tiempo_de_Calzo");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Tiempo_de_Vuelo");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Combustible__Cargado");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Combustible__Despegue");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Combustible__Aterrizaje");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Combustible__Consumo");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Pasajeros");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Parametros");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Componentes");
        this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Lectura_de_Altimetros");
      }
    }
    //TERMINA - BRID:2875


    //INICIA - BRID:5464 - Asignar  numero de vuelo si es cierre ( Rol de operaciones ) (Manual no modificar) - Autor: ANgel Acuña - Actualización: 8/27/2021 7:18:58 PM
    /* if (this.operation == 'New') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == 12) {
        this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Numero_de_Vuelo", ` select numero_de_vuelo from solicitud_de_vuelo where folio = ${this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')}`, 1, "ABC123");
      }
    } */
    //TERMINA - BRID:5464

    //rulesOnInit_ExecuteBusinessRulesEnd
  }

  rulesAfterSave() {
    let IdEjecucion_de_Vuelo = this.model.Folio;

    let Numero_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Numero_de_Vuelo'].value;
    let Tramo_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Tramo_de_Vuelo'].value;

    //rulesAfterSave_ExecuteBusinessRulesInit
    ``

    //INICIA - BRID:2792 - 1.- En ejecución de vuelo, después de guardar, en nuevo, ejecutar el query:exec uspGeneraCierreVuelo GLOBAL[keyvalueinserted]NOTA: Es para que cuando den de alta una ejecución de vuelo al guardar vaya y se inserte el cierre de vuelo para ese vuelo y tramo, incluyendo pasajeros y tripulación. - Autor: Felipe Rodríguez - Actualización: 4/22/2021 9:46:26 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(` EXEC uspGeneraCierreVuelo ${this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')}`, 1, 'ABC123');
    }
    //TERMINA - BRID:2792


    //INICIA - BRID:2793 - 2.- En ejecución de vuelo, después de guardar, en modificar, ejecutar el query:exec uspGeneraCierreVuelo "+this.Ejecucion_de_VueloForm.get('Folio').value+"NOTA: Es para que si actualizas la ejecución de vuelo, también se actualice en el cierre de vuelo para ese vuelo y para ese tramo, se va a actualizar todo, incluyendo pasajeros y tripulación.  - Autor: Felipe Rodríguez - Actualización: 4/22/2021 9:46:40 PM
    if (this.operation == 'Update') {
      this.brf.EvaluaQuery(` exec uspGeneraCierreVuelo ${this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')}`, 1, 'ABC123');
    }
    //TERMINA - BRID:2793


    if (this.operation == 'New' || this.operation == 'Update') {
      //BRID:2816 - ejecutar sp uspCalcularTiempos_de_Ejecucion_de_Vuelo despues de guardado para calcular tiempos de cargo y sin cargo, vuelo y espera, pernoctas para solicitud de vuelo  - Autor: Neftali - Actualización: 4/27/2021 3:34:36 PM
      this.brf.EvaluaQuery(` EXEC uspCalcularTiempos_de_Ejecucion_de_Vuelo ${this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')}`, 1, 'ABC123');
      this.setDistancia_en_Millas();
      //BRID:2878 - Actualizar pasajeros adicionales - Autor: Lizeth Villa - Actualización: 5/6/2021 2:33:10 PM
      this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Pasajeros_Adicionales", `EXEC ActPasajerosAdicionalesEjecucion ${this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')} `, 1, "ABC123");
      //BRID:2890 - Actualizar registro de tramo - Autor: Lizeth Villa - Actualización: 5/11/2021 10:52:02 AM
      this.brf.EvaluaQuery(` EXEC UspActualizarRegistrodeTramo ${Numero_de_Vuelo.Clave}, ${Tramo_de_Vuelo.Clave}`, 1, 'ABC123');
    }

    //BRID:5544 - En nuevo y modificar, después de guardar, si el campo ﻿"Distancia FIR (Km)" tiene valor entonces debes ejecutar el SP uspRegistraDistanciaSENEAM enviando como parametro el origen, destino y distancia FIR - Autor: Felipe Rodríguez - Actualización: 8/30/2021 11:06:41 AM
    //if (this.showDistancia_FIR_Km) {
    if (this.distancia_FIR_KmFIR != '') {
      //this.brf.EvaluaQuery('exec uspRegistraDistanciaSENEAM ' + this.Ejecucion_de_VueloForm.get('Origen').value + ', ' + this.Ejecucion_de_VueloForm.get('Destino').value + ', ' + this.Ejecucion_de_VueloForm.get('Distancia_FIR_Km').value + '', 1, 'ABC123');
      this.brf.EvaluaQuery('exec uspRegistraDistanciaSENEAM ' + this.origenFIR + ', ' + this.destinoFIR + ', ' + this.distancia_FIR_KmFIR + '', 1, 'ABC123');
    }


    //rulesAfterSave_ExecuteBusinessRulesEnd
    this.snackBar.open('Registro guardado con éxito', '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['success']
    });

    this.isLoading = false;
    this.spinner.hide('loading');
    this.fnCloseModal(1);
  }

  rulesBeforeSave() {
    let result = true;
    this.isLoading = true;
    this.spinner.show('loading');

    //rulesBeforeSave_ExecuteBusinessRulesInit
    let Tramo_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Tramo_de_Vuelo'].value

    //INICIA - BRID:2693 - no debe permitir capturar el mismo tramo 2 veces - Autor: Lizeth Villa - Actualización: 4/28/2021 12:56:51 PM
    if (this.operation == 'New') {

      //Asignar Comandante
      this.sqlModel.query = ` SELECT COUNT(*) FROM Ejecucion_de_Vuelo WHERE TRAMO_DE_VUELO = ${Tramo_de_Vuelo.Clave}`;

      this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
        next: (data) => {
          if (data >= 1) {
            this.snackBar.open('No se pueden guardar tramos de vuelo repetidos.', '', {
              duration: 2000,
              verticalPosition: 'top',
              horizontalPosition: 'right',
              panelClass: ['warning']
            });
            result = false;
          }
          else {
            result = true;
          }
        },
        error: (e) => console.error(e),
        complete: () => {

          if (result) {
            this.saveData();
          }
          else {
            this.isLoading = false;
            this.spinner.hide('loading');
            return false;
          }

        }
      })

    }
    else if (this.operation == 'Update') {
      this.saveData();
    }


  }

  //@@End.Keep.Implementation('//Fin de reglas')

  //#endregion Fin de reglas



  setResponseQuery(result: any) {
    let response: any = [];

    if (result) {
      //Se realiza el mapeo al modelo [{Clave, Description}]
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        response.push(
          {
            Clave: element[0],
            Description: element[1]
          }
        )
      });

    }
    else {
      response = []
    }

    return response
  }

  //#region Formatear Lista de Origen y Destino
  setResponseOrigenDestino(result: any) {
    let response: any = [];

    if (result) {
      //Se realiza el mapeo al modelo [{Clave, Description}]
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        response.push(
          {
            "Aeropuerto_ID": element[0],
            "Descripcion": element[1]
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

  //#region Refactorizar Fecha para el DatePicker
  setRefactorDate(paramDate) {
    //Formatear Fecha 
    let formatDate = momentJS(paramDate, 'DD-MM-YYYY').format('YYYY-MM-DD')

    var date = new Date(formatDate)
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    //Asignar Fecha como +1 día (Por el datepicker)
    date.setDate(date.getDate())

    return date
  }
  //#endregion

  //#region Existencia de Listas
  //Lista de Numero de vuelo
  get hasOptionsNumero_de_Vuelo(): boolean {
    return this.optionsNumero_de_Vuelo.length > 0 ? true : false
  }
  //Lista de Tramo de Vuelo
  get hasOptionsTramo_de_Vuelo(): boolean {
    if (!this.Ejecucion_de_VueloForm.get('Numero_de_Vuelo').hasError('required') && !this.Ejecucion_de_VueloForm.get('Numero_de_Vuelo').hasError('invalidAutocompleteValue')
      && this.optionsTramo_de_Vuelo.length > 0) {
      return true
    }
    else {
      return false
    }
  }
  //#endregion

  //#region Obtener Numero de Vuelo
  async getNumero_de_Vuelo() {

    //BRID:2240 - Cuando se registra una nueva ejecución de vuelo si el rol es piloto, solo mostrar los vuelos en los que es tripulante - Autor: Administrador - Actualización: 3/30/2021 9:46:40 PM
    let result: SpartanQueryDictionary[];
    if (this.RoleId == 13 || this.RoleId == 9) {
      result = this.brf.EvaluaQueryDictionary(`EXEC uspFillVuelosTripulante ${this.UserId}`, 1, 'ABC123')
    }
    else {
      result = [{
        Clave: this.localStorageHelper.getItemFromLocalStorage("SpartanOperationId"),
        Description: this.data.NumVuelo
        //this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")
      }]
    }
    console.log("result: ", result)
    //aqui result en new cierre es solicitud de vuelo
    this.optionsNumero_de_Vuelo = result

    if (this.data = !null) {
      this.Ejecucion_de_VueloForm.get('Numero_de_Vuelo').setValue(result[0], { onlySelf: false, emitEvent: true });
      await this.onChangeNumero_de_Vuelo(0)
    }
  }
  //#endregion

  //#region Al Cambiar o elegir Número de Vuelo
  async onChangeNumero_de_Vuelo(option: number) {

    this.clearControls(1)

    //option : 0 = Desde Input | 1: Desde AutoComplete
    let Numero_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Numero_de_Vuelo'].value;
    Numero_de_Vuelo = (option == 0) ? Numero_de_Vuelo : Numero_de_Vuelo.Description
    let Tripulacion = []

    //VERIFICAR
    if (this.optionsNumero_de_Vuelo.length > 0) {

      this.optionsNumero_de_Vuelo.forEach(element => {
        if (Numero_de_Vuelo == element.Clave) {
          //Asignar Folio al elegir numero de vuelo
          this.Ejecucion_de_VueloForm.controls['Folio'].setValue(element.Clave)
          //Asignar número de vuelo si es que no eligio desde el autocomplete
          this.Ejecucion_de_VueloForm.controls['Numero_de_Vuelo'].setValue(element)
        }
      });
      this.getTramo_de_Vuelo();
    }

    ///BRID:2646 - Obtener Tripulación cuando es Piloto
    //if (this.RoleId == 13) {

    Numero_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Numero_de_Vuelo'].value; //Equivalente al folio o clave de numero de vuelo   
    //Tripulacion = this.brf.EvaluaQueryDictionary(`EXEC uspObtenerTripulacionVuelo ${Numero_de_Vuelo.Clave}`, 1, 'ABC123')
    //console.log(Tripulacion);

    await this.brf.EvaluaQueryDictionaryAsync(`EXEC uspObtenerTripulacionVuelo ${Numero_de_Vuelo.Clave}`, 1, 'ABC123').then(async res => {
      this.varTripulacion = res.filter(x => x.Description != null);
    });

    //this.Ejecucion_de_VueloForm.controls['Comandante'].setValue(this.varTripulacion[1], { onlySelf: false, emitEvent: true });


    //this.varTripulacion = Tripulacion
    //}
    //VERIFICAR - BRID:2645 - Al abrir la pantalla, en alta o modificar, si el rol es distinto de piloto debe filtrar los combos Comandante, Capitán, Primer Capitán, Segundo Capitán y Sobrecargo con los tripulantes del vuelo exec uspObtenerTripulacionVuelo "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" - Autor: Lizeth Villa - Actualización: 4/13/2021 5:13:18 PM


    //BRID: 2236 - Asignar Valores de Matricula, Tipo de Ala, Fecha de Solicitud y Tipo de Vuelo    
    
    this.setTipo_de_Vuelo(Numero_de_Vuelo)


    this.setFechaSolicitud();
    this.setMatriculaId();

    await this.setTipo_de_Ala(Numero_de_Vuelo);

    this.clearControls(2);

    setTimeout(() => {
      const toSelect = this.varTipo_de_Ala.find(c => c.Clave == this.tipo_Ala);
      this.Ejecucion_de_VueloForm.get('Tipo_de_Ala').setValue(toSelect);
    }, 500);

  }
  //#endregion

  //#region Asignar Fecha de Solicitud
  setFechaSolicitud() {
    let Numero_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Numero_de_Vuelo'].value;

    const model: any = {}
    model.id = 1;
    model.securityCode = "ABC123";

    //Fecha de Solicitud
    model.query = `SELECT TOP 1 convert(nvarchar(11), Fecha_de_Solicitud, 105) FROM Solicitud_de_Vuelo WHERE folio = ${Numero_de_Vuelo.Clave}`;

    this.spartanService.ExecuteQuery(model).subscribe({
      next: (response) => {
        let formatDate = this.setRefactorDate(response)
        this.Ejecucion_de_VueloForm.controls["Solicitud"].setValue(formatDate)
      }
    })
  }
  //#endregion

  //#region Obtener Tramo de Vuelo
  getTramo_de_Vuelo() {
    //BRID:2346 - Al abrir la pantalla, en alta, si el rol es piloto:* filtrar los tramos de vuelo con el vuelo con el que se está trabajando (exec uspFiltraTramosVuelo FLD[Numero_de_Vuelo])
    let result = []
    if (this.RoleId == 13 || this.RoleId == 12 || this.RoleId == 9) {
      let Numero_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Numero_de_Vuelo'].value; //Equivalente al folio o clave de numero de vuelo   
      result = this.brf.EvaluaQueryDictionary(`EXEC uspFiltraTramosVuelo ${Numero_de_Vuelo.Clave}`, 1, 'ABC123')
    }

    //VERIFICAR - BRID:1903 - En nuevo y modificacion filtrar tramo de vuelo - Autor: Lizeth Villa - Actualización: 3/31/2021 5:22:11 PM
    //VERIFICAR - BRID:2643 - Al abrir la pantalla, en alta, si el rol es distinto de piloto:* filtrar los tramos de vuelo con el vuelo con el que se está trabajando (exec uspFiltraTramosVuelo "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+") - Autor: Lizeth Villa - Actualización: 4/9/2021 6:19:25 PM  
    //VERIFICAR - BRID:2644 - Al abrir la pantalla, en modificar, si el rol de usuario es distinto de piloto:* filtrar los tramos de vuelo con el vuelo con el que se está trabajando (exec uspFiltraTramosVuelo "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+") - Autor: Lizeth Villa - Actualización: 4/12/2021 4:55:54 PM

    this.optionsTramo_de_Vuelo = result
  }
  //#endregion

  //#region Al Cambiar o elegir Tramo de Vuelo
  onChangeTramo_de_Vuelo(option: number) {

    this.clearControls(2)

    //option : 0 = Desde Input | 1: Desde AutoComplete
    let Tramo_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Tramo_de_Vuelo'].value;
    Tramo_de_Vuelo = (option == 0) ? Tramo_de_Vuelo : Tramo_de_Vuelo.Description

    if (this.optionsTramo_de_Vuelo.length > 0) {
      this.optionsTramo_de_Vuelo.forEach(element => {
        if (Tramo_de_Vuelo == element.Description) {
          //Asignar número de vuelo si es que no eligio desde el autocomplete
          this.Ejecucion_de_VueloForm.controls['Tramo_de_Vuelo'].setValue(element)
        }
      });
    }

    if(this.operation == "New"){
      this.setTripulacion()
    }
    this.setOrigenDestino()
    this.setTimeSalidaLlegada();
    this.setDatasourcePasajeros()
  }
  //#endregion

  //#region Asignar Valor Tripulacion
  setTripulacion() {
    let Tramo_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Tramo_de_Vuelo'].value

    let itemsetCo = {
      Clave: 0,
      Description: ""
    }

    let itemsetCa = {
      Clave: 0,
      Description: ""
    }

    let itemsetPo = {
      Clave: 0,
      Description: ""
    }

    let itemsetSt = {
      Clave: 0,
      Description: ""
    }

    let itemsetSo = {
      Clave: 0,
      Description: ""
    }


    //Asignar Comandante
    this.sqlModel.query = ` EXEC uspGetTripulanteAsignado ${Tramo_de_Vuelo.Clave},1`;

    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (data) => {
        this.varTripulacion.forEach(element => {
          if (data == element.Clave) {
            itemsetCo.Clave = element.Clave;
            itemsetCo.Description = element.Description;
          }
        });
      },
      error: (e) => console.error(e),
      complete: () => {
        this.Ejecucion_de_VueloForm.get("Comandante").setValue(itemsetCo.Clave);
        this.Ejecucion_de_VueloForm.get("Administrador_del_Vuelo").setValue(itemsetCo, { onlySelf: false, emitEvent: true })
      }
    });

    //Asignar Capitan
    this.sqlModel.query = ` EXEC uspGetTripulanteAsignado ${Tramo_de_Vuelo.Clave},8`;
    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (data) => {
        this.varTripulacion.forEach(element => {
          if (data == element.Clave) {
            itemsetCa.Clave = element.Clave;
            itemsetCa.Description = element.Description;
          }
        });
      },
      error: (e) => console.error(e),
      complete: () => {
        this.Ejecucion_de_VueloForm.get("Capitan").setValue(itemsetCa.Clave, { onlySelf: false, emitEvent: true });
      }
    });
    
    //Asignar Primer Oficial
    this.sqlModel.query = ` EXEC uspGetTripulanteAsignado ${Tramo_de_Vuelo.Clave},2`;
    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (data) => {
        this.varTripulacion.forEach(element => {
          if (data == element.Clave) {
            itemsetPo.Clave = element.Clave;
            itemsetPo.Description = element.Description;
          }
        });
      },
      error: (e) => console.error(e),
      complete: () => {
        this.Ejecucion_de_VueloForm.get("Primer_Capitan").setValue(itemsetPo.Clave, { onlySelf: false, emitEvent: true });
      }
    });

    //Asignar Segundo Tripulante
    this.sqlModel.query = ` EXEC uspGetTripulanteAsignado ${Tramo_de_Vuelo.Clave},10`;
    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (data) => {
        this.varTripulacion.forEach(element => {
          if (data == element.Clave) {
            itemsetSt.Clave = element.Clave;
            itemsetSt.Description = element.Description;
          }
        });
      },
      error: (e) => console.error(e),
      complete: () => {
        this.Ejecucion_de_VueloForm.get("Segundo_Capitan").setValue(itemsetSt.Clave, { onlySelf: false, emitEvent: true });
      }
    });

    //Asignar Sobrecargo
    this.sqlModel.query = ` EXEC uspGetTripulanteAsignado ${Tramo_de_Vuelo.Clave},5`;
    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (data) => {
        this.varTripulacion.forEach(element => {
          if (data == element.Clave) {
            itemsetSo.Clave = element.Clave;
            itemsetSo.Description = element.Description;
          }
        });
      },
      error: (e) => console.error(e),
      complete: () => {
        this.Ejecucion_de_VueloForm.get("Sobrecargo").setValue(itemsetSo.Clave, { onlySelf: false, emitEvent: true });
      }
    });

  }
  //#endregion

  //#region Asignar Valor Origen - Destino
  setOrigenDestino() {
    let Tramo_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Tramo_de_Vuelo'].value

    const model: any = {}
    model.id = 1;
    model.securityCode = "ABC123";

    //Origen
    model.query = `SELECT Aeropuerto_ID, Descripcion from Aeropuertos WITH(NOLOCK) WHERE Aeropuerto_ID = (SELECT Origen FROM Registro_de_vuelo WHERE folio= ${Tramo_de_Vuelo.Clave})`;

    this.spartanService.ExecuteQueryDictionary(model).subscribe({
      next: (data) => {

        let response = this.setResponseOrigenDestino(data)
        this.optionsOrigen = response
        this.Ejecucion_de_VueloForm.controls["Origen"].setValue(response[0])

      }
    })

    //Destino
    model.query = `SELECT Aeropuerto_ID, Descripcion from Aeropuertos WITH(NOLOCK) WHERE Aeropuerto_ID = (SELECT Destino FROM Registro_de_vuelo WHERE folio= ${Tramo_de_Vuelo.Clave})`;

    this.spartanService.ExecuteQueryDictionary(model).subscribe({
      next: (data) => {

        let response = this.setResponseOrigenDestino(data)
        this.optionsDestino = response
        this.Ejecucion_de_VueloForm.controls["Destino"].setValue(response[0])

      },
      error: e => console.error(e),
      complete: () => {
        var origen = this.Ejecucion_de_VueloForm.controls["Origen"].value?.Aeropuerto_ID
        var destino = this.Ejecucion_de_VueloForm.controls["Destino"].value?.Aeropuerto_ID
        this.validateDistancia_FIR_Km(origen, destino)
      }
    })

  }
  //#endregion

  //#region Asignar Valor Fecha/Hora de Salida y Llegada
  setTimeSalidaLlegada() {
    let Tramo_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Tramo_de_Vuelo'].value

    const model: any = {}
    model.id = 1;
    model.securityCode = "ABC123";

    //Asignar Fecha de Salida
    model.query = `SELECT CONVERT(NVARCHAR(11), Fecha_de_salida, 105) FROM Registro_de_vuelo WHERE folio =  ${Tramo_de_Vuelo.Clave}`;

    this.spartanService.ExecuteQuery(model).subscribe({
      next: (response) => {
        this.Ejecucion_de_VueloForm.controls["Fecha_de_Salida"].setValue(this.setRefactorDate(response))
      }
    })

    //Asignar Hora de Salida
    model.query = `SELECT Hora_de_Salida FROM Registro_de_vuelo WHERE folio =  ${Tramo_de_Vuelo.Clave}`;

    this.spartanService.ExecuteQuery(model).subscribe({
      next: (response) => {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Salida"].setValue(response)
      }
    })
    
    if (this.operation) {

      if (this.operation == 'Update' || this.operation == "Consult") {
        //Asignar Fecha de Llegada en Edit
        model.query = `SELECT CONVERT(NVARCHAR(11),(SELECT Fecha_de_llegada FROM ejecucion_de_vuelo where folio = ${this.model.Folio}), 105)`;
        //console.log(this.operation + 'FECHA_DE_LLEGADA_EDIT_MODE')

      } else if (this.operation == 'New') {
        //Asignar Fecha de Llegada en New
        model.query = `SELECT CONVERT(NVARCHAR(11),(SELECT Fecha_de_Regreso FROM Solicitud_de_Vuelo with(nolock) WHERE folio = (SELECT no_vuelo FROM Registro_de_vuelo WITH(NOLOCK) WHERE folio = ${Tramo_de_Vuelo.Clave} )), 105)`;
        //console.log(this.operation + 'FECHA_DE_LLEGADA_NEW_MODE')
      }

      this.spartanService.ExecuteQuery(model).subscribe({
        next: (response) => {
          this.Ejecucion_de_VueloForm.controls["Fecha_de_Llegada"].setValue(this.setRefactorDate(response))
        }
      })

    }

    if (this.operation) {

      if (this.operation == 'Update' || this.operation == "Consult") {
        //Asignar Hora de Llegada en Edit
        model.query = `SELECT Hora_de_llegada FROM ejecucion_de_vuelo where folio = ${this.model.Folio}`;
        //console.log(this.operation + 'HORA_DE_LLEGADA_EDIT_MODE')

      } else if (this.operation == 'New') {
        //Asignar Hora de Llegada/Regreso
        model.query = `SELECT Hora_de_Regreso FROM Solicitud_de_Vuelo  WITH(NOLOCK) WHERE folio = (SELECT no_vuelo FROM Registro_de_vuelo WITH(NOLOCK) WHERE folio = ${Tramo_de_Vuelo.Clave})`;
        //console.log(this.operation + 'HORA_DE_LLEGADA_NEW_MODE')
      }

      this.spartanService.ExecuteQuery(model).subscribe({
        next: (response) => {
          this.Ejecucion_de_VueloForm.controls["Hora_de_Llegada"].setValue(response)
        },
        complete: () => {
          //Asignar Tiempo de Calzo
          setTimeout(() => {
            this.setTiempo_de_Calzo();
            this.setTiempo_de_Vuelo();
          }, 2000);
        }
      })

    }

  }
  //#endregion

  //#region Al Cambiar Origen o Destino
  onChangeOrigenDestino(origenValue: any, destinoValue: any) {

    this.Ejecucion_de_VueloForm.get('Origen').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingOrigen = true),
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

      this.isLoadingOrigen = false;
      this.hasOptionsOrigen = result?.Aeropuertoss?.length > 0;

      this.Ejecucion_de_VueloForm.get('Origen').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });

      this.optionsOrigen = of(result?.Aeropuertoss);
      this.firstLoadOrigen = false;
    }, error => {
      this.isLoadingOrigen = false;
      this.hasOptionsOrigen = false;
      this.optionsOrigen = of([]);
    });

    this.Ejecucion_de_VueloForm.get('Destino').valueChanges.pipe(
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

      this.Ejecucion_de_VueloForm.get('Destino').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });

      this.optionsDestino = of(result?.Aeropuertoss);
      this.firstLoadDestino = false;

    }, error => {
      this.isLoadingDestino = false;
      this.hasOptionsDestino = false;
      this.optionsDestino = of([]);
    });
  }
  //#endregion

  //#region Obtener Diferencia Horaria
  getTimeDifference(date1: any, time1: string, date2: any, time2: string) {
    let TimeDifference: string = "";

    let EndDate = new Date(date1);
    let StartDate = new Date(date2);
    time1 = (time1.includes(":")) ? time1.replace(":", "") : time1
    time2 = (time2.includes(":")) ? time2.replace(":", "") : time2

    EndDate.setHours(parseInt(time1.substring(0, 2)))
    EndDate.setMinutes(parseInt(time1.substring(2, 4)))
    EndDate.setSeconds(0)

    StartDate.setHours(parseInt(time2.substring(0, 2)))
    StartDate.setMinutes(parseInt(time2.substring(2, 4)))
    StartDate.setSeconds(0)


    //let HoursDifference = (EndDate.getTime() - StartDate.getTime()) / (1000 * 60 * 60)

    let startTime = momentJS(StartDate, 'HH:mm:ss a');
    let endTime = momentJS(EndDate, 'HH:mm:ss a');

    let Duration = momentJS.duration(endTime.diff(startTime));
    var Hours = Math.trunc(Duration.asHours());
    var Minutes = Duration.asMinutes() % 60;

    //let Hours = Math.trunc(HoursDifference)
    //let Minutes = 60 * (HoursDifference - Hours)

    let MinutesFormat = Minutes.toString().padStart(2, "0")
    let HoursFormat = Hours.toString().padStart(2, "0")

    TimeDifference = `${HoursFormat}${MinutesFormat}`
    return TimeDifference
  }
  //#endregion


  //#region Validar Tiempo y Hora
  validateFechaHora(date1: any, _time1: string, date2: any, _time2: string, tipoComparacion: number) {
    let inValid: boolean = false;

    let dateValue1 = new Date(this.Ejecucion_de_VueloForm.controls[date1].value)
    let dateValue2 = new Date(this.Ejecucion_de_VueloForm.controls[date2].value)
    let timeValue1 = this.setValidHour(this.Ejecucion_de_VueloForm.controls[_time1].value)
    let timeValue2 = this.setValidHour(this.Ejecucion_de_VueloForm.controls[_time2].value)

    let time1 = (timeValue1.includes(":")) ? timeValue1.replace(":", "") : _time1
    let time2 = (timeValue2.includes(":")) ? timeValue2.replace(":", "") : _time2

    dateValue1.setHours(parseInt(time1.substring(0, 2)))
    dateValue1.setMinutes(parseInt(time1.substring(2, 4)))
    dateValue2.setHours(parseInt(time2.substring(0, 2)))
    dateValue2.setMinutes(parseInt(time2.substring(2, 4)))

    let startTime = momentJS(dateValue1, 'HH:mm:ss a');
    let endTime = momentJS(dateValue2, 'HH:mm:ss a');

    if (this.Ejecucion_de_VueloForm.get(date1).hasError('required') ||
      this.Ejecucion_de_VueloForm.get(_time1).hasError('required') ||
      this.Ejecucion_de_VueloForm.get(date2).hasError('required') ||
      this.Ejecucion_de_VueloForm.get(_time2).hasError('required')) {
      inValid = true
    }

    //modo 1: fecha hora 1 mayorQue la fecha hora 2
    if (tipoComparacion == 1) {
      //if ((dateValue1.getTime() == dateValue2.getTime()) && (parseInt(timeValue1.replace(":", "")) > parseInt(timeValue2.replace(":", "")))) {
      if (startTime.isAfter(endTime)) {
        this.snackBar.open(`La Fecha y ${_time1.replace(/_/g, " ")}, no pueden ser mayor a la Fecha y ${_time2.replace(/_/g, " ")}`, '', {
          duration: 7000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['warning']
        });

        //this.fechaHoraAterrizajeGlobalIsValid = false;
        inValid = true;
        return inValid;
      }
    }

    //modo 2: fecha hora 1 menorQue la fecha hora 2
    if (tipoComparacion == 2) {
      //if ((dateValue1.getTime() == dateValue2.getTime()) && (parseInt(timeValue1.replace(":", "")) < parseInt(timeValue2.replace(":", "")))) {
      if (startTime.isBefore(endTime)) {
        this.snackBar.open(`La Fecha y ${_time1.replace(/_/g, " ")}, no pueden ser menor a la Fecha y ${_time2.replace(/_/g, " ")}`, '', {
          duration: 7000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['warning']
        });


        //this.fechaHoraAterrizajeGlobalIsValid = false;
        inValid = true;
        return inValid;
      }
    }

    //this.fechaHoraAterrizajeGlobalIsValid = true;
    return inValid;
  }
  //#endregion

  //#region Asignar Tiempo de Calzo
  setTiempo_de_Calzo() {

    let Tiempo_de_Calzo: string = "";
    let Fecha_de_Llegada = this.Ejecucion_de_VueloForm.controls['Fecha_de_Llegada'].value
    let Hora_de_Llegada = this.Ejecucion_de_VueloForm.controls['Hora_de_Llegada'].value
    let Fecha_de_Salida = this.Ejecucion_de_VueloForm.controls['Fecha_de_Salida'].value
    let Hora_de_Salida = this.Ejecucion_de_VueloForm.controls['Hora_de_Salida'].value

    this.minFecha_de_Llegada = new Date(Fecha_de_Salida)

    if (!this.validateFechaHora("Fecha_de_Llegada", "Hora_de_Llegada", "Fecha_de_Salida", "Hora_de_Salida", 2)) {
      Tiempo_de_Calzo = this.getTimeDifference(Fecha_de_Llegada, Hora_de_Llegada, Fecha_de_Salida, Hora_de_Salida)
      this.Ejecucion_de_VueloForm.controls['Tiempo_de_Calzo'].setValue(Tiempo_de_Calzo);
      this.brf.SetFormatToHour(this.Ejecucion_de_VueloForm, 'Tiempo_de_Calzo', this.Ejecucion_de_VueloForm.get('Tiempo_de_Calzo').value);
    }
    else {
      this.Ejecucion_de_VueloForm.controls['Tiempo_de_Calzo'].setValue("")
    }
  }
  //#endregion

  //#region Asignar Tiempo de Vuelo
  setTiempo_de_Vuelo() {

    let Tiempo_de_Vuelo: string = "";
    let Fecha_de_Aterrizaje = this.Ejecucion_de_VueloForm.controls['Fecha_de_Aterrizaje'].value
    let Hora_de_Aterrizaje = this.Ejecucion_de_VueloForm.controls['Hora_de_Aterrizaje'].value
    let Fecha_de_Despegue = this.Ejecucion_de_VueloForm.controls['Fecha_de_Despegue'].value
    let Hora_de_Despegue = this.Ejecucion_de_VueloForm.controls['Hora_de_Despegue'].value

    let Fecha_de_Llegada = this.Ejecucion_de_VueloForm.controls['Fecha_de_Llegada'].value

    this.minFecha_de_Aterrizaje = new Date(Fecha_de_Despegue)
    this.maxFecha_de_Aterrizaje = new Date(Fecha_de_Llegada)

    console.log("entre");

    if (!this.validateFechaHora("Fecha_de_Aterrizaje", "Hora_de_Aterrizaje", "Fecha_de_Despegue", "Hora_de_Despegue", 2)) {
      Tiempo_de_Vuelo = this.getTimeDifference(Fecha_de_Aterrizaje, Hora_de_Aterrizaje, Fecha_de_Despegue, Hora_de_Despegue)
      console.log("en la condicion: ", Tiempo_de_Vuelo);
      this.Ejecucion_de_VueloForm.controls['Tiempo_de_Vuelo'].setValue(Tiempo_de_Vuelo);

    }
    else {
      this.Ejecucion_de_VueloForm.controls['Tiempo_de_Vuelo'].setValue("")
    }
  }
  //#endregion

  //#region Validar Hora de Salida
  validaFechaHoraSalida() {
    //si entra es invalido;

    if (this.validateFechaHora("Fecha_de_Salida", "Hora_de_Salida", "Fecha_de_Llegada", "Hora_de_Llegada", 1)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Llegada"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Salida"].setValue("")
      }
      return
    }

    if (this.validateFechaHora("Fecha_de_Salida", "Hora_de_Salida", "Fecha_de_Despegue", "Hora_de_Despegue", 1)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Despegue"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Salida"].setValue("")
      }
      return
    }

    if (this.validateFechaHora("Fecha_de_Salida", "Hora_de_Salida", "Fecha_de_Aterrizaje", "Hora_de_Aterrizaje", 1)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Aterrizaje"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Salida"].setValue("")
      }
      return
    }
    this.setTiempo_de_Vuelo();
  }
  //#endregion

  //#region Validar Hora de Llegada
  validaFechaHoraLlegada() {
    if (this.validateFechaHora("Fecha_de_Llegada", "Hora_de_Llegada", "Fecha_de_Salida", "Hora_de_Salida", 2)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Salida"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Llegada"].setValue("")
      }
      return
    }

    if (this.validateFechaHora("Fecha_de_Llegada", "Hora_de_Llegada", "Fecha_de_Despegue", "Hora_de_Despegue", 2)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Despegue"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Llegada"].setValue("")
      }
      return
    }

    if (this.validateFechaHora("Fecha_de_Llegada", "Hora_de_Llegada", "Fecha_de_Aterrizaje", "Hora_de_Aterrizaje", 2)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Aterrizaje"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Llegada"].setValue("")
      }
      return
    }
    this.setTiempo_de_Vuelo();
  }
  //#endregion

  //#region Validar Hora de Despegue
  validaFechaHoraDespegue() {
    // si entra es invalido: interpreta como: "si 1er fecha (2:es menor/fail) si 1er fecha (1:es mayor/fail)"

    if (this.validateFechaHora("Fecha_de_Despegue", "Hora_de_Despegue", "Fecha_de_Salida", "Hora_de_Salida", 2)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Salida"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Despegue"].setValue("")
      }
      return
    }

    if (this.validateFechaHora("Fecha_de_Despegue", "Hora_de_Despegue", "Fecha_de_Llegada", "Hora_de_Llegada", 1)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Llegada"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Despegue"].setValue("")
      }
      return
    }

    if (this.validateFechaHora("Fecha_de_Despegue", "Hora_de_Despegue", "Fecha_de_Aterrizaje", "Hora_de_Aterrizaje", 1)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Aterrizaje"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Despegue"].setValue("")
      }
      return
    }
    this.setTiempo_de_Vuelo();
  }
  //#endregion

  //#region Validar Hora de Aterrizaje
  validaFechaHoraAterrizaje() {
    if (this.validateFechaHora("Fecha_de_Aterrizaje", "Hora_de_Aterrizaje", "Fecha_de_Salida", "Hora_de_Salida", 2)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Salida"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Aterrizaje"].setValue("")
      }
      return
    }

    if (this.validateFechaHora("Fecha_de_Aterrizaje", "Hora_de_Aterrizaje", "Fecha_de_Despegue", "Hora_de_Despegue", 2)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Despegue"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Aterrizaje"].setValue("")
      }
      return
    }

    if (this.validateFechaHora("Fecha_de_Aterrizaje", "Hora_de_Aterrizaje", "Fecha_de_Llegada", "Hora_de_Llegada", 1)) {
      if (this.Ejecucion_de_VueloForm.controls["Hora_de_Llegada"].value) {
        this.Ejecucion_de_VueloForm.controls["Hora_de_Aterrizaje"].setValue("")
      }
      return
    }
    this.setTiempo_de_Vuelo();
  }
  //#endregion


  //#region Validar FIR Km
  validateDistancia_FIR_Km(origen: string, destino: string) {

    const model: any = {}
    model.id = 1;
    model.securityCode = "ABC123";
    model.query = `EXEC uspValidaFIR ${origen}, ${destino}`

    this.spartanService.ExecuteQuery(model).subscribe({
      next: (response) => {
        //BRID:5517/5490
        if (response == "0") {
          this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Distancia_FIR_Km");
          this.showDistancia_FIR_Km = false;


        }
        //BRID:5518/5491
        else if (response == "1") {

          // this.showDistancia_FIR_Km = true;
          // this.brf.SetRequiredControl(this.Ejecucion_de_VueloForm, "Distancia_FIR_Km");
          // this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Distancia_FIR_Km', 1);

          this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Distancia_FIR_Km");
          this.showDistancia_FIR_Km = false;

          //AW - add preguntar si con "1" tambien debe ejecutar (no responde nada)
          //this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Distancia_FIR_Km",
          //`EXEC uspGetDistanciaSENEAM ${origen}, ${destino}`, 1, "ABC123");

          this.sqlModel.query = `EXEC uspGetDistanciaSENEAM ${origen}, ${destino}`;
          this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
            next: (data) => {
              this.distancia_FIR_KmFIR = data;
              this.origenFIR = origen;
              this.destinoFIR = destino;
            }
          })

        }

        // BRID:5516/5543 - Al abrir la pantalla en nuevo, consultar y modificación
        //si el resultado de ejecutar el sp uspValidaFIR enviando como parámetro el origen y destino  = 2:
        // - ﻿hacer visible, obligatorio y deshabilitado el campo ﻿"Distancia FIR (Km)" ﻿- asignar al campo ﻿"Distancia FIR (Km)" el valor del sp uspGetDistanciaSENEAM FLD[Origen], FLD[Destino] - Autor: Felipe Rodríguez - Actualización: 8/30/2021 10:25:30 AM

        else if (response == "2") {
          // this.showDistancia_FIR_Km = true;
          // this.brf.SetRequiredControl(this.Ejecucion_de_VueloForm, "Distancia_FIR_Km");
          // this.brf.SetEnabledControl(this.Ejecucion_de_VueloForm, 'Distancia_FIR_Km', 1);

          // this.spartanService.SetValueExecuteQuery(this.Ejecucion_de_VueloForm, "Distancia_FIR_Km",
          // `EXEC uspGetDistanciaSENEAM ${origen}, ${destino}`, 1, "ABC123");

          this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Distancia_FIR_Km");
          this.showDistancia_FIR_Km = false;

          this.sqlModel.query = `EXEC uspGetDistanciaSENEAM ${origen}, ${destino}`;
          this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
            next: (data) => {
              this.distancia_FIR_KmFIR = data;
              this.origenFIR = origen;
              this.destinoFIR = destino;
            }
          })
        }

      }
    })

  }
  //#endregion

  //#region Asignar Tabla Pasajeros
  setDatasourcePasajeros() {
    const model: any = {}
    let Tramo_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Tramo_de_Vuelo'].value
    model.id = 1;
    model.securityCode = "ABC123";

    model.query = `select Pasajeros.clave as Clave, Pasajeros.Nombre_completo as Description from Detalle_Registro_Vuelo_Pasajeros rv WITH(NOLOCK) LEFT JOIN Pasajeros on Pasajeros.Clave = rv.Pasajero WHERE rv.registro_de_vuelo = '${Tramo_de_Vuelo.Clave}' `

    this.spartanService.GetEnumerable(model).subscribe({
      next: (response) => {

        this.PasajerosItems.clear();
        let Pasajeros = []

        if (response != null && response?.length > 0) {

          response.forEach(element => {

            Pasajeros.push({
              Pasajeros: element.Clave,
              Folio: 0,
              Tramo_de_vuelo: Tramo_de_Vuelo.Clave,
              Pasajeros_Pasajeros: { Clave: element.Clave, Nombre_completo: element.Description },
              isNew: true
            })

          });

          Pasajeros.forEach(element => {
            this.PasajerosData.push(this.addPasajeros(element));
          });

          this.dataSourcePasajeros.data = this.PasajerosData;
          this.dataSourcePasajeros = new MatTableDataSource(Pasajeros)
          this.dataSourcePasajeros.sort = this.sort;
          this.dataSourcePasajeros.paginator = this.paginator;

        }
        else {
          this.PasajerosData = []
          this.dataSourcePasajeros = new MatTableDataSource()
        }

      },
      error: (e) => console.error(e),
      complete: () => {

      },

    })
  }
  //#endregion

  //#region Asignar Combustible Consumo
  setCombustible__Consumo() {
    let Combustible__Cargado = this.Ejecucion_de_VueloForm.controls['Combustible__Cargado'].value
    let Combustible__Aterrizaje = this.Ejecucion_de_VueloForm.controls['Combustible__Aterrizaje'].value

    let Combustible__Consumo = Number(Combustible__Cargado) - Number(Combustible__Aterrizaje)

    this.Ejecucion_de_VueloForm.controls['Combustible__Consumo'].setValue(Combustible__Consumo)

  }
  //#endregion

  //#region Limpiar Controles
  clearControls(option: number) {
    //option=> 1: Al cambiar numero de vuelo | 2: Al cambiar Tramo de Vuelo
    if (option == 1) {
      this.Ejecucion_de_VueloForm.controls['Matricula'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Tipo_de_Ala'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Solicitud'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Tipo_de_Vuelo'].setValue("")

      this.Ejecucion_de_VueloForm.controls['Tramo_de_Vuelo'].setValue("")
    }
    if (option == 2) {

      this.Ejecucion_de_VueloForm.controls['Distancia_FIR_Km'].setValue("")
      this.brf.SetNotRequiredControl(this.Ejecucion_de_VueloForm, "Distancia_FIR_Km");
      this.showDistancia_FIR_Km = false;

      this.Ejecucion_de_VueloForm.controls['Origen'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Destino'].setValue("")

      this.Ejecucion_de_VueloForm.controls['Comandante'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Capitan'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Primer_Capitan'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Segundo_Capitan'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Sobrecargo'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Administrador_del_Vuelo'].setValue("")

      this.Ejecucion_de_VueloForm.controls['Fecha_de_Salida'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Hora_de_Salida'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Fecha_de_Llegada'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Hora_de_Llegada'].setValue("")
      this.Ejecucion_de_VueloForm.controls['Tiempo_de_Calzo'].setValue("")

    }

  }
  //#endregion

  //#region Asignar Distancia en Millas (DESPUES DE GUARDAR)
  async setDistancia_en_Millas() {
    var Origen = this.Ejecucion_de_VueloForm.controls["Origen"].value.Aeropuerto_ID
    var Destino = this.Ejecucion_de_VueloForm.controls["Destino"].value.Aeropuerto_ID

    let OLT, OLG, DLT, DLG;
    if (parseInt(Origen) > 0 && parseInt(Destino) > 0) {

      //Obtener Latitud de Origen
      this.sqlModel.query = ` SELECT Latitud FROM dbo.Aeropuertos WHERE Aeropuerto_ID = ${Origen}`;

      this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
        next: (data) => {
          OLT = data
        }
      })

      //Obtener Longitud de Origen
      this.sqlModel.query = ` SELECT Longitud FROM dbo.Aeropuertos WHERE Aeropuerto_ID = ${Origen}`;

      this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
        next: (data) => {
          OLG = data
        }
      })

      //Obtener Latitud de Destino
      this.sqlModel.query = ` SELECT Latitud FROM dbo.Aeropuertos WHERE Aeropuerto_ID = ${Destino}`;

      this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
        next: (data) => {
          DLT = data
        }
      })

      //Obtener Longitud de Destino
      this.sqlModel.query = ` SELECT Latitud FROM dbo.Aeropuertos WHERE Aeropuerto_ID = ${Destino}`;

      this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
        next: (data) => {
          DLG = data
        },
        error: (e) => console.error(e),
        complete: () => {
          if (parseFloat(OLT) != 0 && parseFloat(OLG) != 0 && parseFloat(DLT) != 0 && parseFloat(DLG) != 0) {

            this.CalculoDistancia(OLT, OLG, DLT, DLG);

          }
        }
      })

    }
  }
  //#endregion

  CalculoDistancia(OLT: any, OLG: any, DLT: any, DLG: any): any {

    var distance: any
    /* this.distanceService.getDistance(OLT, OLG, DLT, DLG).subscribe({
      next: (data) => {
        distance = data
      },
      error: (e) => console.error(e),
      complete: () => {
   
        if (parseFloat(distance) > 0) {
          this.brf.EvaluaQuery(`UPDATE dbo.Ejecucion_de_Vuelo SET Distancia_en_Millas = ${distance} WHERE Folio = ${this.IdEjecucion_de_Vuelo}`, 1, "ABC123");;
        }
   
      }
    }) */

  }

  //#region Obtener Matricula
  setMatriculaId() {
    let Numero_de_Vuelo = this.Ejecucion_de_VueloForm.controls['Numero_de_Vuelo'].value

    const model: any = {}
    model.id = 1;
    model.securityCode = "ABC123";

    //Asignar Id Matricula
    model.query = `SELECT TOP 1 matricula FROM Registro_de_vuelo WITH(NOLOCK) WHERE no_vuelo= ${Numero_de_Vuelo.Clave}`;

    this.spartanService.ExecuteQuery(model).subscribe({
      next: (response) => {
        this.IdMatricula = response;
        this.Ejecucion_de_VueloForm.controls["Matricula"].setValue(this.IdMatricula)
      },
      error: (e) => console.error(e),
      complete: () => {

        this.setDatasourceParametros();
        this.setDatasourceLectura_de_Altimetros()
      },

    })

  }
  //#endregion

  //#region Asignar Tabla de Parametros
  setDatasourceParametros() {
    const model: any = {}
    model.id = 1;
    model.securityCode = "ABC123";

    if(this.operation == "New"){
      model.query = `select  '', Parametro from Detalle_Parametros_Tipo_Bitacora_Aeronave with(nolock) where bitacora = (select bitacora from aeronave with(nolock) where Matricula = (select top 1 matricula from Registro_de_vuelo with(nolock) where Matricula = '${this.IdMatricula}' ))`;
    }
    else {
      model.query = `SELECT Folio as Clave, Parametro FROM Detalle_Ejecucion_Vuelo_Parametros WHERE ejecucion_de_vuelo = ${this.model.Folio}`
    }

    this.spartanService.GetEnumerable(model).subscribe({
      next: (response) => {

        this.ParametrosItems.clear();

        let Parametros = []

        if (response.length > 0) {

          this.showParametros = true;

          response.forEach(element => {
            Parametros.push({
              Folio: this.operation == "New" ? 0 : element.Clave,
              Ejecucion_de_Vuelo: null,
              Parametro: element.Description,
              MOT_1: null,
              MOT_2: null,
            })

          });

          Parametros.forEach(element => {
            this.ParametrosData.push(this.addParametros(element));
          });

          this.dataSourceParametros.data = this.ParametrosData;
          this.dataSourceParametros = new MatTableDataSource(Parametros)
          this.dataSourceParametros.sort = this.sort;
          this.dataSourceParametros.paginator = this.paginator;

        }
        else {
          this.ParametrosData = []
          this.dataSourceParametros = new MatTableDataSource()
          this.showParametros = false;
        }

      },
      error: (e) => console.error(e),
      complete: () => {

      },

    })
  }
  //#endregion

  //#region Asignar Tabla Lectura de Altimetros
  setDatasourceLectura_de_Altimetros() {
    const model: any = {}
    model.id = 1;
    model.securityCode = "ABC123";

    //model.query = `select '' , Concepto from Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave with(nolock) where bitacora = (select bitacora from aeronave with(nolock) where Matricula = (select top 1 matricula from Registro_de_vuelo with(nolock) where Matricula = '${this.IdMatricula}' ))`
    model.query = 'select  Concepto  from Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave with(nolock)  where bitacora = (select bitacora from aeronave with(nolock) where Matricula =  (select top 1 matricula from Registro_de_vuelo with(nolock) where no_vuelo =  ' + this.IdMatricula + '))'

    this.spartanService.GetEnumerable(model).subscribe({
      next: (response) => {

        let Lectura_de_Altimetros = []
        this.Lectura_de_AltimetrosItems.clear();

        if (response != null && response.length > 0) {
          this.showLectura_de_Altimetros = true;

          response.forEach(element => {
            Lectura_de_Altimetros.push({
              Folio: 0,
              Ejecucion_de_Vuelo: null,
              Concepto: element.Description,
              ALTIM_1: null,
              ALTIM_2: null,
              ALTIM_AUX: null,
            })
          });

          Lectura_de_Altimetros.forEach(element => {
            this.Lectura_de_AltimetrosData.push(this.addLectura_de_Altimetros(element));
          });

          this.dataSourceLectura_de_Altimetros.data = this.Lectura_de_AltimetrosData;
          this.dataSourceLectura_de_Altimetros = new MatTableDataSource(Lectura_de_Altimetros)

        }
        else {
          this.Lectura_de_AltimetrosData = []
          this.dataSourceLectura_de_Altimetros = new MatTableDataSource()
          this.showLectura_de_Altimetros = false;
        }

      },
      error: (e) => console.error(e),
      complete: () => {


      },

    })
  }
  //#endregion

  //#region Asignar Tipo De Ala 
  async setTipo_de_Ala(Numero_de_Vuelo) {

    let query = ` SELECT TOP 1 Tipo_de_Ala FROM aeronave with(nolock) WHERE matricula = (select top 1 matricula FROM Registro_de_vuelo with(nolock) where no_vuelo = ${Numero_de_Vuelo.Clave})`;

    let tipoDeAla = await this.brf.EvaluaQueryAsync(query, 1, "ABC123");

    this.tipo_Ala = tipoDeAla;
  }
  //#endregion

  //#region Asignar Tipo De Vuelo
  setTipo_de_Vuelo(Numero_de_Vuelo) {

    this.sqlModel.query = ` SELECT TOP 1 Tipo_de_Vuelo FROM Registro_de_vuelo with(nolock) WHERE no_vuelo = ${Numero_de_Vuelo.Clave}`;

    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (data) => {
        this.Ejecucion_de_VueloForm.controls["Tipo_de_Vuelo"].setValue(parseInt(data))
      },
    })
  }
  //#endregion

  //#region Asegurar Formato de Las Horas
  setValidHour(hourInput): string {
    let hourOutput: string = "";
    if (hourInput != undefined && hourInput.length == 4) {
      hourOutput = hourInput.substring(0, 2)
      hourOutput = hourOutput + (":")
      hourOutput = hourOutput + hourInput.substring(2, 4)
    }
    else if (hourInput.length > 5) {
      hourOutput = hourInput.substring(0, 5)
    }
    else {
      hourOutput = hourInput
    }

    return hourOutput;
  }
  //#endregion

}
