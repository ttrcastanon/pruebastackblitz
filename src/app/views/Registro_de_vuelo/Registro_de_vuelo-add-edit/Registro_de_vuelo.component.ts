import { AfterViewInit, Component, ElementRef, Inject, OnInit, DoCheck, Renderer2, ViewChild, Output, EventEmitter, Input } from '@angular/core';
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
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Tipo_de_vueloService } from 'src/app/api-services/Tipo_de_vuelo.service';
import { Tipo_de_vuelo } from 'src/app/models/Tipo_de_vuelo';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { Detalle_Registro_Vuelo_TripulacionService } from 'src/app/api-services/Detalle_Registro_Vuelo_Tripulacion.service';
import { Detalle_Registro_Vuelo_Tripulacion } from 'src/app/models/Detalle_Registro_Vuelo_Tripulacion';
import { Cargo_de_TripulanteService } from 'src/app/api-services/Cargo_de_Tripulante.service';
import { Cargo_de_Tripulante } from 'src/app/models/Cargo_de_Tripulante';
import { TripulacionService } from 'src/app/api-services/Tripulacion.service';
import { Tripulacion } from 'src/app/models/Tripulacion';

import { Detalle_Registro_Vuelo_PasajerosService } from 'src/app/api-services/Detalle_Registro_Vuelo_Pasajeros.service';
import { Detalle_Registro_Vuelo_Pasajeros } from 'src/app/models/Detalle_Registro_Vuelo_Pasajeros';

import { Detalle_Pasajeros_Solicitud_de_VueloService } from 'src/app/api-services/Detalle_Pasajeros_Solicitud_de_Vuelo.service';

import { PasajerosService } from 'src/app/api-services/Pasajeros.service';
import { Pasajeros } from 'src/app/models/Pasajeros';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { SpartanQueryDictionary } from 'src/app/models/spartan-query-dictionary';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import * as momentJS from 'moment';
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";

@Component({
  selector: 'app-Registro_de_vuelo',
  templateUrl: './Registro_de_vuelo.component.html',
  styleUrls: ['./Registro_de_vuelo.component.scss'],
  providers: [
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


export class Registro_de_vueloComponent implements OnInit, AfterViewInit, DoCheck {
MRaddPasajeros: boolean = false;
MRaddTripulacion: boolean = false;

  @Input() parentCount: number;
  @Output() valueChange = new EventEmitter();
  counter = 0;

  //#region  Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  SpartanOperationId: any
  Folio: any
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  sqlModelSV: any = { id: 1, securityCode: "ABC123", query: "" }
  sqlModelAeropuertos: any = { id: 1, securityCode: "ABC123", query: "" }

  Registro_de_vueloForm: FormGroup;
  public Editor = ClassicEditor;
  model: Registro_de_vuelo;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varSolicitud_de_Vuelo: Solicitud_de_Vuelo[] = [];

  optionsMatricula: SpartanQueryDictionary[] = [];
  optionsMatriculaFiltered: Observable<SpartanQueryDictionary[]>;

  optionsCliente: Observable<Cliente[]>;
  hasOptionsCliente: boolean;
  isLoadingCliente: boolean;
  public varSpartan_User: Spartan_User[] = [];
  public varTipo_de_vuelo: Tipo_de_vuelo[] = [];

  optionsOrigen: Observable<Aeropuertos[]>;
  hasOptionsOrigen: boolean;
  isLoadingOrigen: boolean;
  optionsDestino: Observable<Aeropuertos[]>;
  hasOptionsDestino: boolean;
  isLoadingDestino: boolean;
  tripulanteIsUsed: boolean = false;
  pasajeroIsUsed: boolean = false;
  public varCargo_de_Tripulante: Cargo_de_Tripulante[] = [];
  public varTripulacion: Tripulacion[] = [];

  autoTripulante_Detalle_Registro_Vuelo_Tripulacion = new FormControl();
  SelectedTripulante_Detalle_Registro_Vuelo_Tripulacion: string[] = [];
  SelectedCargo: string[] = [];
  isLoadingTripulante_Detalle_Registro_Vuelo_Tripulacion: boolean;
  searchTripulante_Detalle_Registro_Vuelo_TripulacionCompleted: boolean;

  public varPasajeros: Pasajeros[] = [];

  autoPasajero_Detalle_Registro_Vuelo_Pasajeros = new FormControl();
  SelectedPasajero_Detalle_Registro_Vuelo_Pasajeros: string[] = [];
  isLoadingPasajero_Detalle_Registro_Vuelo_Pasajeros: boolean;
  searchPasajero_Detalle_Registro_Vuelo_PasajerosCompleted: boolean;

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceTripulacion = new MatTableDataSource<Detalle_Registro_Vuelo_Tripulacion>();
  TripulacionColumns = [
    { def: 'actions', hide: false },
    { def: 'Cargo', hide: false },
    { def: 'Tripulante', hide: false },
    { def: 'Vencimiento_Pasaporte', hide: false },
    { def: 'Vencimiento_Licencia', hide: false },
    { def: 'Vencimiento_Certificado_Medico', hide: false },

  ];
  TripulacionData: Detalle_Registro_Vuelo_Tripulacion[] = [];
  dataSourcePasajeros = new MatTableDataSource<Detalle_Registro_Vuelo_Pasajeros>();
  PasajerosColumns = [
    { def: 'actions', hide: false },
    { def: 'Pasajero', hide: false },

  ];
  PasajerosData: Detalle_Registro_Vuelo_Pasajeros[] = [];

  today = new Date();
  minFecha_de_salida = new Date();
  consult: boolean = false;
  matriculaActual: any = undefined;
  contadorMatricula: any = 0;

  consultaAeropuertos: any;

  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Registro_de_vueloService: Registro_de_vueloService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeronaveService: AeronaveService,
    private ClienteService: ClienteService,
    private Spartan_UserService: Spartan_UserService,
    private Tipo_de_vueloService: Tipo_de_vueloService,
    private AeropuertosService: AeropuertosService,
    private Detalle_Registro_Vuelo_TripulacionService: Detalle_Registro_Vuelo_TripulacionService,
    private Cargo_de_TripulanteService: Cargo_de_TripulanteService,
    private TripulacionService: TripulacionService,
    private Detalle_Registro_Vuelo_PasajerosService: Detalle_Registro_Vuelo_PasajerosService,
    private Detalle_Pasajeros_Solicitud_de_VueloService: Detalle_Pasajeros_Solicitud_de_VueloService,
    private PasajerosService: PasajerosService,
    private _seguridad: SeguridadService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private spartanService: SpartanService,
    renderer: Renderer2,
    //public dialogRef: MatDialogRef<Registro_de_vueloComponent>,
    //@Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.brf = new BusinessRulesFunctions(renderer, spartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Registro_de_vuelo(this.fb);
    this.Registro_de_vueloForm = this.model.buildFormGroup();
    this.TripulacionItems.removeAt(0);
    this.PasajerosItems.removeAt(0);

    this.Registro_de_vueloForm.get('Folio').disable();
    this.Registro_de_vueloForm.get('Folio').setValue('Auto');

    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceTripulacion.paginator = this.paginator;
    this.dataSourcePasajeros.paginator = this.paginator;

    this.rulesAfterViewInit();
  }


  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.TripulacionColumns.splice(0, 1);
        this.PasajerosColumns.splice(0, 1);

        this.Registro_de_vueloForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });



    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Registro_de_vuelo)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Registro_de_vueloForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Registro_de_vueloForm, 'Cliente', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Registro_de_vueloForm, 'Origen', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Registro_de_vueloForm, 'Destino', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    this.rulesOnInit();
  }

  ngDoCheck(): void {

    if (this.operation == 'Update') {
      if (this.matriculaActual == "" || this.matriculaActual == undefined) {
        this.matriculaActual = this.Registro_de_vueloForm.get("Matricula").value;
        //console.log(this.matriculaActual);
      }
    }
  }

  valueChanged() {
    this.counter += 1;
    this.valueChange.emit(this.counter);
  }


  closeWindowCancel(): void {
    window.close();
  }

  closeWindowSave(): void {
    if (this.localStorageHelper.getItemFromLocalStorage("Registro_de_vueloWindowsFloat") == "1") {
      this.spinner.show('loading');
      this.localStorageHelper.setItemToLocalStorage("Registro_de_vueloWindowsFloat", "0");
      setTimeout(() => { window.close(); }, 3000);
      this.spinner.hide('loading');
    }
    else {
      this.goToList();
    }

  }

  result:Registro_de_vuelo[] = [];

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Registro_de_vueloService.listaSelAll(0, 1, 'Registro_de_vuelo.Folio=' + id).toPromise();
    if (result.Registro_de_vuelos.length > 0) {
      this.result = result.Registro_de_vuelos;

      await this.Detalle_Registro_Vuelo_TripulacionService.listaSelAll(0, 1000, 'Registro_de_vuelo.Folio=' + id).toPromise().then(fTripulacion => {

        this.TripulacionData = fTripulacion.Detalle_Registro_Vuelo_Tripulacions;
        this.loadTripulacion(fTripulacion.Detalle_Registro_Vuelo_Tripulacions);
        this.dataSourceTripulacion = new MatTableDataSource(fTripulacion.Detalle_Registro_Vuelo_Tripulacions);
        this.dataSourceTripulacion.paginator = this.paginator;
        this.dataSourceTripulacion.sort = this.sort;
      });


      await this.Detalle_Registro_Vuelo_PasajerosService.listaSelAll(0, 1000, 'Registro_de_vuelo.Folio=' + id).toPromise().then(fPasajeros => {
        this.PasajerosData = fPasajeros.Detalle_Registro_Vuelo_Pasajeross;
        this.loadPasajeros(fPasajeros.Detalle_Registro_Vuelo_Pasajeross);
        this.dataSourcePasajeros = new MatTableDataSource(fPasajeros.Detalle_Registro_Vuelo_Pasajeross);
        this.dataSourcePasajeros.paginator = this.paginator;
        this.dataSourcePasajeros.sort = this.sort;
      });


      this.model.fromObject(result.Registro_de_vuelos[0]);

      let Matricula = {
        Clave: result.Registro_de_vuelos[0].Matricula_Aeronave.Matricula,
        Description: result.Registro_de_vuelos[0].Matricula_Aeronave.Matricula
      }

      let Origen = {
        Aeropuerto_ID: result.Registro_de_vuelos[0].Origen_Aeropuertos.Aeropuerto_ID,
        Descripcion: result.Registro_de_vuelos[0].Origen_Aeropuertos.Descripcion
      }

      let Destino = {
        Aeropuerto_ID: result.Registro_de_vuelos[0].Destino_Aeropuertos.Aeropuerto_ID,
        Descripcion: result.Registro_de_vuelos[0].Destino_Aeropuertos.Descripcion
      }

      this.Registro_de_vueloForm.get('No_Vuelo').setValue(result.Registro_de_vuelos[0].No_Vuelo_Solicitud_de_Vuelo, {onlySelf: false, emitEvent: true});
      this.Registro_de_vueloForm.get('Matricula').setValue(Matricula, { onlySelf: false, emitEvent: true });
      this.Registro_de_vueloForm.get('Cliente').setValue(result.Registro_de_vuelos[0].Cliente_Cliente.Razon_Social, { onlySelf: false, emitEvent: true });

      this.Registro_de_vueloForm.get('Origen').setValue(Origen, { onlySelf: false, emitEvent: true });
      this.Registro_de_vueloForm.get('Destino').setValue(Destino, { onlySelf: false, emitEvent: true });

      this.Registro_de_vueloForm.markAllAsTouched();
      this.Registro_de_vueloForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else {
      this.spinner.hide('loading');
    }
  }

  //#region Tripulante
  get TripulacionItems() {
    return this.Registro_de_vueloForm.get('Detalle_Registro_Vuelo_TripulacionItems') as FormArray;
  }

  getTripulacionColumns(): string[] {
    return this.TripulacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadTripulacion(Tripulacion: Detalle_Registro_Vuelo_Tripulacion[]) {
    Tripulacion.forEach(element => {
      this.addTripulacion(element);
    });
  }

  addTripulacionToMR() {
    const Tripulacion = new Detalle_Registro_Vuelo_Tripulacion(this.fb);
    this.TripulacionData.push(this.addTripulacion(Tripulacion));
    this.dataSourceTripulacion.data = this.TripulacionData;
    Tripulacion.edit = true;
    Tripulacion.isNew = true;
    const length = this.dataSourceTripulacion.data.length;
    const index = length - 1;
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
    this.addFilterToControlTripulante_Detalle_Registro_Vuelo_Tripulacion(formTripulacion.controls.Tripulante, index);

    const page = Math.ceil(this.dataSourceTripulacion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addTripulacion(entity: Detalle_Registro_Vuelo_Tripulacion) {
    const Tripulacion = new Detalle_Registro_Vuelo_Tripulacion(this.fb);
    this.TripulacionItems.push(Tripulacion.buildFormGroup());
    if (entity) {
      Tripulacion.fromObject(entity);
    }
    return entity;
  }

  TripulacionItemsByFolio(Folio: number): FormGroup {
    return (this.Registro_de_vueloForm.get('Detalle_Registro_Vuelo_TripulacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  TripulacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    let fb = this.TripulacionItems.controls[index] as FormGroup;
    return fb;
  }

  deleteTripulacion(element: any) {
    let index = this.dataSourceTripulacion.data.indexOf(element);

    this.TripulacionData[index].IsDeleted = true;
    this.TripulacionData.splice(index, 1);
    this.dataSourceTripulacion.data = this.TripulacionData;
    this.dataSourceTripulacion.data.splice(index, 1);
    this.dataSourceTripulacion._updateChangeSubscription();
    index = this.dataSourceTripulacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditTripulacion(element: any) {
    let index = this.dataSourceTripulacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.TripulacionData[index].IsDeleted = true;
      this.dataSourceTripulacion.data = this.TripulacionData;
      this.dataSourceTripulacion.data.splice(index, 1);
      this.dataSourceTripulacion._updateChangeSubscription();
      index = this.TripulacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }


  async saveTripulacion(element: any) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
    this.TripulacionData[index].Cargo = formTripulacion.value.Cargo;
    this.TripulacionData[index].Cargo_Cargo_de_Tripulante = formTripulacion.value.Cargo !== '' ?
      this.varCargo_de_Tripulante.filter(d => d.Clave === formTripulacion.value.Cargo)[0] : null;
    if (this.TripulacionData[index].Tripulante !== formTripulacion.value.Tripulante && formTripulacion.value.Tripulante > 0) {
      let tripulacion = await this.TripulacionService.getById(formTripulacion.value.Tripulante).toPromise();
      this.TripulacionData[index].Tripulante_Tripulacion = tripulacion;
    }


    this.TripulacionData[index].Tripulante = formTripulacion.value.Tripulante;
    this.TripulacionData[index].Vencimiento_Pasaporte = formTripulacion.value.Vencimiento_Pasaporte;
    this.TripulacionData[index].Vencimiento_Licencia = formTripulacion.value.Vencimiento_Licencia;
    this.TripulacionData[index].Vencimiento_Certificado_Medico = formTripulacion.value.Vencimiento_Certificado_Medico;

    this.TripulacionData[index].isNew = false;
    this.dataSourceTripulacion.data = this.TripulacionData;
    this.dataSourceTripulacion._updateChangeSubscription();
  }

  editTripulacion(element: any) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
    this.SelectedTripulante_Detalle_Registro_Vuelo_Tripulacion[index] = this.dataSourceTripulacion.data[index]?.Tripulante_Tripulacion?.Nombre_completo;
    this.addFilterToControlTripulante_Detalle_Registro_Vuelo_Tripulacion(formTripulacion.controls.Tripulante, index);

    element.edit = true;
  }

  async saveDetalle_Registro_Vuelo_Tripulacion(Folio: number) {
    this.dataSourceTripulacion.data.forEach(async (d, index) => {
      const data = this.TripulacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Registro_de_vuelo = Folio;

      if (model.Folio === 0) {
        // Add Tripulacion
        let response = await this.Detalle_Registro_Vuelo_TripulacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formTripulacion = this.TripulacionItemsByFolio(model.Folio);

        if (formTripulacion.dirty) {
          // Update Tripulacion
          let response = await this.Detalle_Registro_Vuelo_TripulacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Tripulacion
        await this.Detalle_Registro_Vuelo_TripulacionService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectTripulante_Detalle_Registro_Vuelo_Tripulacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedTripulante_Detalle_Registro_Vuelo_Tripulacion[index] = event.option.viewValue;
    let fgr = this.Registro_de_vueloForm.controls.Detalle_Registro_Vuelo_TripulacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Tripulante.setValue(event.option.value);
    this.displayFnTripulante_Detalle_Registro_Vuelo_Tripulacion(element);

    this.setPasaportes(index);
  }

  displayFnTripulante_Detalle_Registro_Vuelo_Tripulacion(this, element) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    return this.SelectedTripulante_Detalle_Registro_Vuelo_Tripulacion[index];
  }

  updateOptionTripulante_Detalle_Registro_Vuelo_Tripulacion(event, element: any) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    this.SelectedTripulante_Detalle_Registro_Vuelo_Tripulacion[index] = event.source.viewValue;
  }

  checkTripulanteIsUsed(event) {
    if (event.isUserInput) {
      for (let i = 0; i <= this.TripulacionData.length; i++) {
        this.tripulanteIsUsed = this.TripulacionData[i]?.Tripulante_Tripulacion?.Nombre_completo === event.source.viewValue;
        if (this.tripulanteIsUsed) {
          break;
        }
      }
      this.tripulanteIsUsed ? alert("No se puede capturar tripulantes repetidos") : "";
    }
  }


  checkPasajeroIsUsed(event) {
    if (event.isUserInput) {
      for (let i = 0; i <= this.PasajerosData.length; i++) {
        this.pasajeroIsUsed = this.PasajerosData[i]?.Pasajero_Pasajeros?.Identificador_Alias === event.source.viewValue;

        if (this.pasajeroIsUsed) {
          break;
        }
      }
      this.pasajeroIsUsed ? alert("No se puede capturar pasajeros repetidos") : "";
    }
  }

  _filterTripulante_Detalle_Registro_Vuelo_Tripulacion(filter: any): Observable<Tripulacion> {
    const where = filter !== '' ? "Tripulacion.Nombre_completo like '%" + filter + "%'" : '';
    return this.TripulacionService.listaSelAll(0, 20, where);
  }

  addFilterToControlTripulante_Detalle_Registro_Vuelo_Tripulacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingTripulante_Detalle_Registro_Vuelo_Tripulacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        let Matricula = this.Registro_de_vueloForm.get('Matricula').value;
        let Fecha_de_salida = this.Registro_de_vueloForm.controls['Fecha_de_salida'].value;
        const where = value !== '' && value.length > 0 ? " and t.Nombre_completo like '%" + value + "%'" : '';

        this.sqlModel.query = `select t.Clave, t.Nombre_completo from Tripulacion_Aeronave ta left join Tripulacion t on t.Clave = ta.Clave_Tripulacion ` +
          ` where t.estatus = 2 and Aeronave = '${Matricula.Description}' ` + where;

        this.isLoadingTripulante_Detalle_Registro_Vuelo_Tripulacion = true;
        return this.spartanService.ExecuteQueryDictionary(this.sqlModel);
      })
    ).subscribe(result => {
      let response = this.setResponseTripulante(result);
      this.varTripulacion = response;
      this.isLoadingTripulante_Detalle_Registro_Vuelo_Tripulacion = false;
      this.searchTripulante_Detalle_Registro_Vuelo_TripulacionCompleted = true;
      this.SelectedTripulante_Detalle_Registro_Vuelo_Tripulacion[index] = this.varTripulacion.length === 0 ? '' : this.SelectedTripulante_Detalle_Registro_Vuelo_Tripulacion[index];
    });
  }
  //#endregion

  //#region  Pasajeros
  get PasajerosItems() {
    return this.Registro_de_vueloForm.get('Detalle_Registro_Vuelo_PasajerosItems') as FormArray;
  }

  getPasajerosColumns(): string[] {
    return this.PasajerosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPasajeros(Pasajeros: Detalle_Registro_Vuelo_Pasajeros[]) {
    Pasajeros.forEach(element => {
      this.addPasajeros(element);
    });
  }

  addPasajerosToMR() {
    const Pasajeros = new Detalle_Registro_Vuelo_Pasajeros(this.fb);
    this.PasajerosData.push(this.addPasajeros(Pasajeros));
    this.dataSourcePasajeros.data = this.PasajerosData;
    Pasajeros.edit = true;
    Pasajeros.isNew = true;
    const length = this.dataSourcePasajeros.data.length;
    const index = length - 1;
    const formPasajeros = this.PasajerosItems.controls[index] as FormGroup;
    this.addFilterToControlPasajero_Detalle_Registro_Vuelo_Pasajeros(formPasajeros.controls.Pasajero, index);

    const page = Math.ceil(this.dataSourcePasajeros.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addPasajeros(entity: Detalle_Registro_Vuelo_Pasajeros) {
    const Pasajeros = new Detalle_Registro_Vuelo_Pasajeros(this.fb);
    this.PasajerosItems.push(Pasajeros.buildFormGroup());
    if (entity) {
      Pasajeros.fromObject(entity);
    }
    return entity;
  }

  PasajerosItemsByFolio(Folio: number): FormGroup {
    return (this.Registro_de_vueloForm.get('Detalle_Registro_Vuelo_PasajerosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  PasajerosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    let fb = this.PasajerosItems.controls[index] as FormGroup;
    return fb;
  }

  deletePasajeros(element: any) {
    let index = this.dataSourcePasajeros.data.indexOf(element);
    this.PasajerosData[index].IsDeleted = true;
    this.PasajerosData.splice(index, 1);
    this.dataSourcePasajeros.data = this.PasajerosData;
    this.dataSourcePasajeros.data.splice(index, 1);
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
      this.dataSourcePasajeros.data.splice(index, 1);
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

    if (this.PasajerosData[index].Pasajero !== formPasajeros.value.Pasajero && formPasajeros.value.Pasajero > 0) {
      let pasajeros = await this.PasajerosService.getById(formPasajeros.value.Pasajero).toPromise();
      this.PasajerosData[index].Pasajero_Pasajeros = pasajeros;
    }

    this.PasajerosData[index].Pasajero = formPasajeros.value.Pasajero;
    this.PasajerosData[index].Vencimiento_Pasaporte = formPasajeros.value.Vencimiento_Pasaporte;

    this.PasajerosData[index].isNew = false;
    this.dataSourcePasajeros.data = this.PasajerosData;
    this.dataSourcePasajeros._updateChangeSubscription();
  }

  editPasajeros(element: any) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    const formPasajeros = this.PasajerosItems.controls[index] as FormGroup;
    this.SelectedPasajero_Detalle_Registro_Vuelo_Pasajeros[index] = this.dataSourcePasajeros.data[index].Pasajero_Pasajeros.Identificador_Alias;
    this.addFilterToControlPasajero_Detalle_Registro_Vuelo_Pasajeros(formPasajeros.controls.Pasajero, index);

    element.edit = true;
  }

  async saveDetalle_Registro_Vuelo_Pasajeros(Folio: number) {
    this.dataSourcePasajeros.data.forEach(async (d, index) => {
      const data = this.PasajerosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Registro_de_vuelo = Folio;


      if (model.Folio === 0) {
        // Add Pasajeros
        let response = await this.Detalle_Registro_Vuelo_PasajerosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPasajeros = this.PasajerosItemsByFolio(model.Folio);
        if (formPasajeros.dirty) {
          // Update Pasajeros
          let response = await this.Detalle_Registro_Vuelo_PasajerosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Pasajeros
        await this.Detalle_Registro_Vuelo_PasajerosService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectPasajero_Detalle_Registro_Vuelo_Pasajeros(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedPasajero_Detalle_Registro_Vuelo_Pasajeros[index] = event.option.viewValue;
    let fgr = this.Registro_de_vueloForm.controls.Detalle_Registro_Vuelo_PasajerosItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Pasajero.setValue(event.option.value);
    this.displayFnPasajero_Detalle_Registro_Vuelo_Pasajeros(element);
  }

  displayFnPasajero_Detalle_Registro_Vuelo_Pasajeros(this, element) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    return this.SelectedPasajero_Detalle_Registro_Vuelo_Pasajeros[index];
  }

  updateOptionPasajero_Detalle_Registro_Vuelo_Pasajeros(event, element: any) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    this.SelectedPasajero_Detalle_Registro_Vuelo_Pasajeros[index] = event.source.viewValue;
  }

  _filterPasajero_Detalle_Registro_Vuelo_Pasajeros(filter: any): Observable<Pasajeros> {
    const where = filter !== '' ? "Pasajeros.Identificador_Alias like '%" + filter + "%'" : '';
    return this.PasajerosService.listaSelAll(0, 20, where);
  }

  addFilterToControlPasajero_Detalle_Registro_Vuelo_Pasajeros(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingPasajero_Detalle_Registro_Vuelo_Pasajeros = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingPasajero_Detalle_Registro_Vuelo_Pasajeros = true;
        return this._filterPasajero_Detalle_Registro_Vuelo_Pasajeros(value || '');
      })
    ).subscribe(result => {
      this.varPasajeros = result.Pasajeross;
      this.isLoadingPasajero_Detalle_Registro_Vuelo_Pasajeros = false;
      this.searchPasajero_Detalle_Registro_Vuelo_PasajerosCompleted = true;
      this.SelectedPasajero_Detalle_Registro_Vuelo_Pasajeros[index] = this.varPasajeros.length === 0 ? '' : this.SelectedPasajero_Detalle_Registro_Vuelo_Pasajeros[index];
    });
  }

  quantityPasajeros(): number {
    let quantity: number = 0;
    let arrayPasajeros;

    if (this.PasajerosData.length > 0) {
      arrayPasajeros = this.PasajerosData.filter(element => (element.IsDeleted == false || element.IsDeleted == undefined));
      quantity = arrayPasajeros.length
    }

    return quantity
  }


  countTripulante(): number{
    let quantity: number = 0;
    let arrayTripulante;

    if (this.TripulacionData.length > 0) {
      arrayTripulante = this.TripulacionData.filter(element => (element.IsDeleted == false || element.IsDeleted == undefined));
      quantity = arrayTripulante.length
    }

    return quantity
  }
  //#endregion

  getParamsFromUrl() {
    /* if (this.SpartanOperationId != undefined) {
      this.model.Folio = this.Folio
      if (this.model.Folio) {
        this.operation = !this.Registro_de_vueloForm.disabled ? "Update" : this.operation;
        this.populateModel(this.model.Folio);
      } else {
        this.operation = "New";
      }
      this.rulesOnInit();
    }
    else { */
    this.route.paramMap.subscribe(
      params => {
        this.SpartanOperationId = +params.get('SpartanOperationId');
        this.Folio = +params.get('id');
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Registro_de_vueloForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Folio);
        } else {
          this.operation = "New";
        }
        this.rulesOnInit();
      });
    //}

  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  getAeropuertos(valor): any {
    let aeropuertosFiltrados: any;

    if (valor.Descripcion != undefined) {
      valor = valor.Descripcion;
    }

    aeropuertosFiltrados = this.consultaAeropuertos.Aeropuertoss.filter(aeropuerto => aeropuerto.Descripcion == valor);

    if (aeropuertosFiltrados.length > 0) {
      return aeropuertosFiltrados;
    }
    else {
      let regex = new RegExp(valor, 'i');
      aeropuertosFiltrados = this.consultaAeropuertos.Aeropuertoss.filter(aeropuerto => regex.test(aeropuerto.Descripcion));
    }

    return aeropuertosFiltrados;
  }

  setResponseSolicitudVuelo(result: any) {
    let response: any = [];

    if (result) {
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        response.push(
          {
            "Folio": element[0],
            "Numero_de_Vuelo": element[1]
          }
        )
      });
    }
    else {
      response = []
    }
    return response
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Solicitud_de_VueloService.getAll());
    observablesArray.push(this.Spartan_UserService.getAll());
    observablesArray.push(this.Tipo_de_vueloService.getAll());
    observablesArray.push(this.Cargo_de_TripulanteService.getAll());
    observablesArray.push(this.AeropuertosService.listaSelAll(0, 200000, ''));
    observablesArray.push(this.TripulacionService.listaSelAll(0, 20000, ''));

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([
          resAeropuertos
        ]) => {
          this.consultaAeropuertos = resAeropuertos;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.getUsuarios()

    this.Registro_de_vueloForm.get('Cliente').valueChanges.pipe(
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

      this.optionsCliente = of(result?.Clientes);

      this.Registro_de_vueloForm.get('Cliente').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });

    }, error => {
      this.isLoadingCliente = false;
      this.hasOptionsCliente = false;
      this.optionsCliente = of([]);
    });

    this.Registro_de_vueloForm.get('Origen').valueChanges.pipe(
      startWith(''),
      debounceTime(1800),
      tap(() => this.isLoadingOrigen = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Descripcion like '%" + value.trimLeft().trimRight().replace('\'','\'\'') + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight().replace('\'','\'\'') + "%'");
      })
    ).subscribe(result => {
      this.isLoadingOrigen = false;
      this.hasOptionsOrigen = result?.Aeropuertoss?.length > 0;
      //this.Registro_de_vueloForm.get('Origen').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
      this.optionsOrigen = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingOrigen = false;
      this.hasOptionsOrigen = false;
      this.optionsOrigen = of([]);
    });

    this.Registro_de_vueloForm.get('Destino').valueChanges.pipe(
      startWith(''),
      debounceTime(1800),
      tap(() => this.isLoadingDestino = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Descripcion like '%" + value.trimLeft().trimRight().replace('\'','\'\'') + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight().replace('\'','\'\'') + "%'");
      })
    ).subscribe(result => {
      this.isLoadingDestino = false;
      this.hasOptionsDestino = result?.Aeropuertoss?.length > 0;
      //this.Registro_de_vueloForm.get('Destino').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
      this.optionsDestino = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingDestino = false;
      this.hasOptionsDestino = false;
      this.optionsDestino = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'No_Vuelo': {
        this.Solicitud_de_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSolicitud_de_Vuelo = x.Solicitud_de_Vuelos;
        });
        break;
      }
      case 'Solicitante': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Tipo_de_vuelo': {
        this.Tipo_de_vueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_vuelo = x.Tipo_de_vuelos;
        });
        break;
      }
      case 'Cargo': {
        this.Cargo_de_TripulanteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCargo_de_Tripulante = x.Cargo_de_Tripulantes;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnMatricula(option: any) {
    return option?.Description;
  }
  displayFnCliente(option: Cliente) {
    return option?.Razon_Social;
  }
  displayFnOrigen(option: Aeropuertos) {
    return option?.Descripcion;
  }
  displayFnDestino(option: Aeropuertos) {
    return option?.Descripcion;
  }


  async save() {
    await this.rulesBeforeSave();
  }

  async saveData(): Promise<any> {

    this.Registro_de_vueloForm.enable();
    const entity = this.Registro_de_vueloForm.value;
    entity.Folio = this.model.Folio;
    entity.Matricula = this.Registro_de_vueloForm.get('Matricula').value.Description;
    entity.Cliente = this.Registro_de_vueloForm.get('Cliente').value.Clave;
    entity.Origen = this.Registro_de_vueloForm.get('Origen').value.Aeropuerto_ID;
    entity.Destino = this.Registro_de_vueloForm.get('Destino').value.Aeropuerto_ID;
    entity.Tipo_de_vuelo = this.Registro_de_vueloForm.get('Tipo_de_vuelo').value;
    entity.Cantidad_de_Pasajeros = this.quantityPasajeros();

    console.log("Tripulantes: ", this.countTripulante());
    if(this.countTripulante() == 0){
      alert("Falta agregar la tripulación al tramo");
      this.spinner.hide('loading');
      return;
    }

    console.log(entity)
    console.log(this.model.Folio)

    if (this.model.Folio > 0) {
      await this.Registro_de_vueloService.update(this.model.Folio, entity).toPromise();
      await this.saveDetalle_Registro_Vuelo_Tripulacion(this.model.Folio);
      await this.saveDetalle_Registro_Vuelo_Pasajeros(this.model.Folio);

      this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
      this.localStorageHelper.setItemToLocalStorage("IDFolio", this.model.Folio.toString());
      this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
      this.brf.EvaluaQuery("EXEC uspGeneraGastosVuelo "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
      this.rulesAfterSave();
      this.spinner.hide('loading');
      return this.model.Folio;

    } else {
      await (this.Registro_de_vueloService.insert(entity).toPromise().then(async id => {
        await this.saveDetalle_Registro_Vuelo_Tripulacion(id);
        await this.saveDetalle_Registro_Vuelo_Pasajeros(id);
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
        this.localStorageHelper.setItemToLocalStorage("IDFolio", id.toString());
        this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
        this.brf.EvaluaQuery("EXEC uspGeneraGastosVuelo "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
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
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Registro_de_vueloForm.reset();
      this.model = new Registro_de_vuelo(this.fb);
      this.Registro_de_vueloForm = this.model.buildFormGroup();
      this.dataSourceTripulacion = new MatTableDataSource<Detalle_Registro_Vuelo_Tripulacion>();
      this.TripulacionData = [];
      this.dataSourcePasajeros = new MatTableDataSource<Detalle_Registro_Vuelo_Pasajeros>();
      this.PasajerosData = [];

    } else {
      this.router.navigate(['views/Registro_de_vuelo/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }

  cancel() {
    if (this.localStorageHelper.getItemFromLocalStorage("Registro_de_vueloWindowsFloat") == "1") {
      setTimeout(() => { this.localStorageHelper.setItemToLocalStorage("Registro_de_vueloWindowsFloat", "0"); window.close(); }, 6000);
    }
    else {
      this.goToList();
    }
  }

  goToList() {
    this.router.navigate(['/Registro_de_vuelo/list'], { state: { data: this.dataListConfig } });
  }

  goBack(option?: any) {
    if (this.localStorageHelper.getItemFromLocalStorage("Registro_de_vueloWindowsFloat") == "1") {
      this.spinner.show('loading');
      this.localStorageHelper.setItemToLocalStorage("Registro_de_vueloWindowsFloat", "0");
      setTimeout(() => { window.close(); }, 5000);
      this.spinner.hide('loading');
    }
    else {
      this.goToList();
    }
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  No_Vuelo_ExecuteBusinessRules(): void {
    //No_Vuelo_FieldExecuteBusinessRulesEnd
  }


  Matricula_ExecuteBusinessRules(event) {

    if ((this.operation == 'Update' || this.operation == 'New') && this.Registro_de_vueloForm.get('Matricula').value.Description != undefined) {
      if (event.isUserInput) {
        if (confirm("La tripulación actual será eliminada, ¿Desea continuar?")) {

          this.TripulacionData.forEach(function (element) {
            element.IsDeleted = true;
          });

          for (let i = 0; i <= this.dataSourceTripulacion.data.length; i++) {
            let index;
            this.dataSourceTripulacion.data = this.TripulacionData;
            this.dataSourceTripulacion._updateChangeSubscription();
            index = this.dataSourceTripulacion.data.filter(d => !d.IsDeleted).length;
            const page = Math.ceil(index / this.paginator.pageSize);
            if (page !== this.paginator.pageIndex) {
              this.paginator.pageIndex = page;
            }
          }
        } else {
          this.Registro_de_vueloForm.get("Matricula").setValue(this.matriculaActual);
        }
      }
    }
  }

  Fecha_de_solicitud_ExecuteBusinessRules(): void {
    //Fecha_de_solicitud_FieldExecuteBusinessRulesEnd
  }
  Cliente_ExecuteBusinessRules(): void {
    //Cliente_FieldExecuteBusinessRulesEnd
  }
  Solicitante_ExecuteBusinessRules(): void {

    //INICIA - BRID:6300 - Filtrar empresas a las que pertenece el usuario - Autor: Lizeth Villa - Actualización: 9/15/2021 6:20:12 PM
    if (this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = FLD[No_Vuelo]", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {

    }
    //TERMINA - BRID:6300

    //Solicitante_FieldExecuteBusinessRulesEnd

  }
  Tipo_de_vuelo_ExecuteBusinessRules(): void {
    //Tipo_de_vuelo_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Tramo_ExecuteBusinessRules(): void {
    //Numero_de_Tramo_FieldExecuteBusinessRulesEnd
  }
  Origen_ExecuteBusinessRules(): void {
    //Origen_FieldExecuteBusinessRulesEnd
  }
  Destino_ExecuteBusinessRules(): void {
    //Destino_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_salida_ExecuteBusinessRules(): void {
    let Numero_de_Tramo = this.Registro_de_vueloForm.controls['Numero_de_Tramo'].value;
    let Fecha_de_salida = this.Registro_de_vueloForm.controls['Fecha_de_salida'].value;

    let formatFecha_de_salida = momentJS(Fecha_de_salida).format('DD-MM-YYYY')

    //INICIA - BRID:2085 - al agregar una registro y si este ya tiene 1 o mas registros no dejar guardar fecha  menor al registro anterior. - Autor: Lizeth Villa - Actualización: 4/7/2021 2:18:24 PM
    if (this.brf.EvaluaQuery(`EXEC spValidacionFechaAnterior ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}, ${Numero_de_Tramo}, '${formatFecha_de_salida}' `, 1, 'ABC123') >= 1) {
      this.Registro_de_vueloForm.controls['Fecha_de_salida'].setValue("");
      this.brf.ShowMessage("Fecha de salida no debe ser menor a fecha salida de tramo anterior.");
    }
    //TERMINA - BRID:2085

    //Fecha_de_salida_FieldExecuteBusinessRulesEnd

  }
  Hora_de_salida_ExecuteBusinessRules(): void {
    this.brf.SetFormatToHour(this.Registro_de_vueloForm, 'Hora_de_salida', this.Registro_de_vueloForm.get('Hora_de_salida').value);
    //Hora_de_salida_FieldExecuteBusinessRulesEnd
  }
  Cantidad_de_Pasajeros_ExecuteBusinessRules(): void {
    //Cantidad_de_Pasajeros_FieldExecuteBusinessRulesEnd
  }
  Ultimo_Tramo_notificar_ExecuteBusinessRules(): void {
    //Ultimo_Tramo_notificar_FieldExecuteBusinessRulesEnd
  }
  Comisariato_ExecuteBusinessRules(): void {
    //Comisariato_FieldExecuteBusinessRulesEnd
  }
  Notas_de_vuelo_ExecuteBusinessRules(): void {
    //Notas_de_vuelo_FieldExecuteBusinessRulesEnd
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
    this.spinner.show('loading');
    

    //#region BRID:1866 - En nuevo, modificar y consultar al abrir la pantalla:* Deshabilitar y asignar no requerido - Autor: Lizeth Villa - Actualización: 3/19/2021 3:32:31 PM    
    this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Folio', 0);
    this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'No_Vuelo', 0);
    this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Fecha_de_solicitud', 0);
    this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Cliente', 0);
    this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Solicitante', 0);
    this.brf.SetNotRequiredControl(this.Registro_de_vueloForm, "Notas_de_Comisariato");
    this.brf.SetNotRequiredControl(this.Registro_de_vueloForm, "Comisariato");
    this.brf.SetNotRequiredControl(this.Registro_de_vueloForm, "Notas_de_vuelo");
    //#endregion


    if (this.operation == 'New') {
      this.getVuelos()
      //BRID:1897 - En nuevo al abrir pantalla ocultar numero de vuelo - Autor: Lizeth Villa - Actualización: 5/5/2021 4:03:40 PM
      this.brf.HideFieldOfForm(this.Registro_de_vueloForm, "No_Vuelo");
      this.brf.SetNotRequiredControl(this.Registro_de_vueloForm, "No_Vuelo");

      //BRID:2042 - Al abrir pantalla en nuevo executar query para asignar numero de tramo - Autor: Ivan Yañez - Actualización: 3/25/2021 4:15:10 PM     
      this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Numero_de_Tramo", 'select dbo.fncGeneraTramoVuelo('+this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")+')' , 1, 'ABC123');

      //BRID:2046 - Al abrir pantalla en nuevo asignar valor a los combos fecha de solicitud, cliente, solicitante. - Autor: Ivan Yañez - Actualización: 3/25/2021 6:12:57 PM
      this.setFecha_de_Solicitud();
      //this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Fecha_de_solicitud", `this.brf.EvaluaQuery('SELECT convert (varchar(11),(select Fecha_de_Solicitud from Solicitud_de_Vuelo WITH(NOLOCK) where Folio = ${this.SpartanOperationId} ),105)', 1, 'ABC123')`, 1, "ABC123");
      //this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Solicitante", `SELECT Solicitante FROM Solicitud_de_Vuelo WITH(NOLOCK) where Folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`, 1, "ABC123");
      this.Registro_de_vueloForm.controls["Solicitante"].setValue(this.UserId)
      this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Cliente", `SELECT Razon_Social FROM Cliente WITH(NOLOCK) where Clave=(select Empresa_Solicitante from Solicitud_de_Vuelo WITH(NOLOCK) where Folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} )`, 1, "ABC123");

      //this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Hora_de_salida", ` SELECT Hora_de_Salida FROM Solicitud_de_Vuelo WITH(NOLOCK) where Folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`, 1, 'ABC123');
      //BRID:2354: En Nuevo al abrir pantalla si es el primer registro de tramo de vuelo
      if (await this.brf.EvaluaQueryAsync(`SELECT COUNT(*) from Registro_de_Vuelo where No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} `, 1, 'ABC123') == 0) {
        //BRID:2354 Asignar fecha de salida y hora de salida de la solicitud del vuelo. - Autor: Ivan Yañez - Actualización: 3/31/2021 2:01:26 PM
        this.setFecha_de_salida(0);
        this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Hora_de_salida", `this.brf.EvaluaQuery(' SELECT Hora_de_Salida FROM Solicitud_de_Vuelo WITH(NOLOCK) where Folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}', 1, 'ABC123')`, 1, "ABC123");
        //this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Fecha_de_salida", `SELECT CONVERT (varchar(11),Fecha_de_Salida,105) FROM Solicitud_de_Vuelo WITH(NOLOCK) where Folio = ${this.SpartanOperationId}`, 1, "ABC123");
        let fPasajeros: any;
        fPasajeros = await this.Detalle_Pasajeros_Solicitud_de_VueloService.listaSelAll(0, 1000, `Detalle_Pasajeros_Solicitud_de_Vuelo.Solicitud_de_Vuelo='${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}'`).toPromise();
        if (fPasajeros.Detalle_Pasajeros_Solicitud_de_Vuelos.length > 0) {
          let fPasajerosPaso = await this.Detalle_Registro_Vuelo_PasajerosService.listaSelAll(0, fPasajeros.Detalle_Pasajeros_Solicitud_de_Vuelos.length, '').toPromise();
          console.log(fPasajerosPaso);
          fPasajerosPaso.Detalle_Registro_Vuelo_Pasajeross.forEach((e, i) => {
            fPasajerosPaso.Detalle_Registro_Vuelo_Pasajeross[i].Folio = 0;
            fPasajerosPaso.Detalle_Registro_Vuelo_Pasajeross[i].Pasajero = fPasajeros.Detalle_Pasajeros_Solicitud_de_Vuelos[i].Pasajero;
            fPasajerosPaso.Detalle_Registro_Vuelo_Pasajeross[i].Registro_de_Vuelo = null;
            fPasajerosPaso.Detalle_Registro_Vuelo_Pasajeross[i].Pasajero_Pasajeros.Clave = fPasajeros.Detalle_Pasajeros_Solicitud_de_Vuelos[i].Pasajero_Pasajeros.Clave;
            fPasajerosPaso.Detalle_Registro_Vuelo_Pasajeross[i].Pasajero_Pasajeros.Identificador_Alias = fPasajeros.Detalle_Pasajeros_Solicitud_de_Vuelos[i].Pasajero_Pasajeros.Identificador_Alias;
          })

          this.PasajerosData = fPasajerosPaso.Detalle_Registro_Vuelo_Pasajeross;
          this.loadPasajeros(fPasajerosPaso.Detalle_Registro_Vuelo_Pasajeross);
          this.dataSourcePasajeros = new MatTableDataSource(fPasajerosPaso.Detalle_Registro_Vuelo_Pasajeross);
        }
      }

      //BRID:2058 | 2170: En Nuevo si el registro de vuelo ya tiene registros asignados
      else if (await this.brf.EvaluaQueryAsync(`SELECT COUNT(*) FROM Registro_de_Vuelo where No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`, 1, 'ABC123') >= 1) {
        //BRID:2058 - Asignar el origen con el campo destino y la fecha de salida del tramo anterior  - Autor: Lizeth Villa - Actualización: 5/6/2021 5:38:42 PM
        let origin = await this.brf.EvaluaQueryAsync(` SELECT Descripcion from Aeropuertos WITH(NOLOCK) WHERE Aeropuerto_ID = ( SELECT TOP 1 Destino FROM Registro_de_Vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ORDER BY Folio desc)`, 1, "ABC123");
        let airportID = await this.brf.EvaluaQueryAsync(` SELECT Aeropuerto_ID from Aeropuertos WITH(NOLOCK) WHERE Aeropuerto_ID = ( SELECT TOP 1 Destino FROM Registro_de_Vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ORDER BY Folio desc)`, 1, "ABC123");
        origin = {Descripcion: origin, Aeropuerto_ID: airportID};
        this.brf.SetValueControl(this.Registro_de_vueloForm, "Origen", origin);
        
        this.setFecha_de_salida(0);
        //this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Hora_de_salida", ` SELECT Hora_de_Salida FROM Solicitud_de_Vuelo WITH(NOLOCK) where Folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`, 1, 'ABC123');

        //BRID:2067 - Asignar en automatico asignar la matricula del registro anterior y deshabilitar campo. - Autor: Lizeth Villa - Actualización: 4/26/2021 12:36:08 PM
        //this.spartanService.SetValueExecuteQueryAsync(this.Registro_de_vueloForm, "Matricula", ` SELECT TOP 1 Matricula from Registro_de_Vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ORDER BY Folio desc`, 1, "ABC123");
        let dataMatricula = await this.brf.EvaluaQueryAsync(`SELECT TOP 1 Matricula from Registro_de_Vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ORDER BY Folio desc`, 1, "ABC123");
        dataMatricula = { Clave: dataMatricula, Description: dataMatricula };
        this.brf.SetValueControl(this.Registro_de_vueloForm, "Matricula", dataMatricula);

        //BRID:2144 - En Nuevo, al abrir la pantalla, asignar el ultimo tipo de vuelo ingresado para ese registro - Autor: Lizeth Villa - Actualización: 3/29/2021 11:44:53 PM
        let tipo = await this.brf.EvaluaQueryAsync(`SELECT TOP 1 Tipo_de_vuelo FROM Registro_de_Vuelo WITH(NOLOCK) where No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ORDER BY Folio desc`, 1, "ABC123");
        this.Registro_de_vueloForm.get('Tipo_de_vuelo').setValue(+tipo);
        this.Registro_de_vueloForm.get('Tipo_de_vuelo').disable;
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Tipo_de_vuelo', 0);
        //this.brf.SetValueControl(this.Registro_de_vueloForm, "Tipo_de_vuelo", tipo);
        //this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Tipo_de_vuelo", `SELECT TOP 1 Tipo_de_vuelo FROM Registro_de_Vuelo WITH(NOLOCK) where No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ORDER BY Folio desc`, 1, "ABC123");

        //this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Matricula', 0);

        this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Comisariato", ` SELECT TOP 1 Comisariato from Registro_de_Vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ORDER BY Folio desc`, 1, "ABC123");
        this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Notas_de_vuelo", ` SELECT TOP 1 Notas_de_vuelo from Registro_de_Vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ORDER BY Folio desc`, 1, "ABC123");


        //BRID:2170 - Llenar mr tripulación con el ultimo registro capturado. - Autor: Ivan Yañez - Actualización: 3/30/2021 12:08:05 PM        
        /*this.brf.FillMultiRenglonfromQuery2(this.dataSourceTripulacion, `select null as Folio, Cargo,Tripulante, Vencimiento_Pasaporte, ` +
          `Fecha_de_vencimiento_licencia as Vencimiento_Licencia, Fecha_de_vencimiento_certificado as Vencimiento_Certificado_Medico ` +
          `from Detalle_Registro_Vuelo_Tripulacion with(nolock) LEFT JOIN dbo.Tripulacion ON Clave = Tripulante where Registro_de_Vuelo= `+ 
          `(select top 1 Folio from Registro_de_Vuelo with(nolock) where No_Vuelo='${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}' order by Folio desc)`, 
          1, "ABC123", fTripulacion.Detalle_Registro_Vuelo_Tripulacions);*/

        let ultimoFolio = await this.brf.EvaluaQueryAsync(`select top 1 Folio from Registro_de_Vuelo with(nolock) where No_Vuelo= '${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}' ORDER BY Folio DESC`, 1, "ABC123");
        let fTripulacion = await this.Detalle_Registro_Vuelo_TripulacionService.listaSelAll(0, 1000, 'Registro_de_vuelo.Folio=' + ultimoFolio).toPromise();
        fTripulacion.Detalle_Registro_Vuelo_Tripulacions.forEach(e => e.Folio = 0);
        this.TripulacionData = fTripulacion.Detalle_Registro_Vuelo_Tripulacions;
        this.loadTripulacion(fTripulacion.Detalle_Registro_Vuelo_Tripulacions);
        this.dataSourceTripulacion = new MatTableDataSource(fTripulacion.Detalle_Registro_Vuelo_Tripulacions);


        //BRID:3136 - asignar pasajeros despues del segundo tramo con codigo manual - Autor: Lizeth Villa - Actualización: 5/17/2021 5:08:10 PM
        let fPasajeros: any;
        let cantidadRegistros = await this.brf.EvaluaQueryAsync(`select count(*) from Registro_de_Vuelo where No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`, 1, "ABC123");

        if (cantidadRegistros >= this.brf.TryParseInt('1', '1')) {
          fPasajeros = await this.Detalle_Registro_Vuelo_PasajerosService.listaSelAll(0, 1000, 'Registro_de_vuelo.Folio=' + ultimoFolio).toPromise();
          fPasajeros.Detalle_Registro_Vuelo_Pasajeross.forEach(e => e.Folio = 0);
          this.PasajerosData = fPasajeros.Detalle_Registro_Vuelo_Pasajeross;
          this.loadPasajeros(fPasajeros.Detalle_Registro_Vuelo_Pasajeross);
          this.dataSourcePasajeros = new MatTableDataSource(fPasajeros.Detalle_Registro_Vuelo_Pasajeross);
        }

        //BRID:2654 - En nuevo con mas de un tramo de vuelo asignar matricula automaticamente - Autor: Neftali - Actualización: 4/28/2021 3:23:30 PM
        //this.spartanService.SetValueExecuteQuery(this.Registro_de_vueloForm, "Matricula", `this.brf.EvaluaQuery(' SELECT TOP 1 Matricula as Descripcion FROM Registro_de_vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.SpartanOperationId} ORDER BY Folio desc', 1, "ABC123")`, 1, "ABC123");

      }

      //BRID:2083 - al abrir pantalla llenar mr pasajeros con los pasajeros de la solicitud de vuelo - Autor: Ivan Yañez - Actualización: 3/27/2021 2:08:40 PM
      //this.brf.FillMultiRenglonfromQuery(this.dataSourcePasajeros, "Detalle_Registro_Vuelo_Pasajeros", 1, "ABC123");

    }


    else if (this.operation == 'Update') {

      if (await this.brf.EvaluaQueryAsync(`SELECT COUNT(*) FROM Registro_de_Vuelo where No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`, 1, 'ABC123') >= 1) {
        //BRID:2058 - Asignar el origen con el campo destino y la fecha de salida del tramo anterior  - Autor: Lizeth Villa - Actualización: 5/6/2021 5:38:42 PM

        /* await this.spartanService.SetValueExecuteQueryAsync(this.Registro_de_vueloForm, "Origen",
          ` SELECT Descripcion from Aeropuertos WITH(NOLOCK) WHERE Aeropuerto_ID = ( SELECT TOP 1 Origen FROM Registro_de_Vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} AND Folio = ${this.localStorageHelper.getItemFromLocalStorage("FolioRegistroVuelo")})`, 1, "ABC123");

        await this.spartanService.SetValueExecuteQueryAsync(this.Registro_de_vueloForm, "Destino",
          ` SELECT Descripcion from Aeropuertos WITH(NOLOCK) WHERE Aeropuerto_ID = ( SELECT TOP 1 Destino FROM Registro_de_Vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} AND Folio = ${this.localStorageHelper.getItemFromLocalStorage("FolioRegistroVuelo")})`, 1, "ABC123"); */
      }

      //BRID:2069 -  al editar deshabilitar campo matricula - Autor: Neftali - Actualización: 4/27/2021 11:42:13 AM
      //this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Matricula', 0);

      //BRID:2433 - Al editar bloquea el campo Origen - Autor: Lizeth Villa - Actualización: 5/3/2021 2:04:49 PM
      //this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Origen', 0);

      //BRID:5674 - Si el estatus es autorizado y el campo es reabierto y el rol es operaciones o admin habllitar campos - Autor: Lizeth Villa - Actualización: 9/3/2021 5:11:42 PM
      if ((this.RoleId == 9 || this.RoleId == 12) && (this.brf.EvaluaQuery(`SELECT Vuelo_reabierto from solicitud_de_vuelo where folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} `, 1, 'ABC123') == 1)) {
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Matricula', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Fecha_de_solicitud', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Cliente', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Solicitante', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Numero_de_Tramo', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Cantidad_de_Pasajeros', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Vencimiento_Pasaporte', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Vencimiento_Pasaporte', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Vencimiento_Licencia', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Vencimiento_Certificado_Medico', 1);
        this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Vencimiento_Pasaporte', 1);

      }

    }

    else if (this.operation == 'Consult') {

    }

    this.getMatricula()
    this.getTiposVuelo()
    this.getCargoTripulante()

    //BRID:2041 - Des habilitar numero de tramo - Autor: Ivan Yañez - Actualización: 3/25/2021 3:46:38 PM
    this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Numero_de_Tramo', 0);

    //BRID:2053 - en nuevo y editar des habilitar y asignar no requerido a cantidad de pasajeros - Autor: Ivan Yañez - Actualización: 3/25/2021 6:41:15 PM
    this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Cantidad_de_Pasajeros', 0);
    this.brf.SetNotRequiredControl(this.Registro_de_vueloForm, "Cantidad_de_Pasajeros");

    //BRID:2615 - Ocultar folio. - Autor: Lizeth Villa - Actualización: 4/7/2021 12:02:07 PM    
    this.brf.HideFieldOfForm(this.Registro_de_vueloForm, "Folio");
    this.brf.SetNotRequiredControl(this.Registro_de_vueloForm, "Folio");

    //BRID:2819 - Si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje  - Autor: Administrador - Actualización: 5/3/2021 4:04:15 PM
    if ((this.brf.EvaluaQuery(`SELECT COUNT(*) FROM Solicitud_de_Vuelo where folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}  and estatus = 9 `, 1, 'ABC123') == 1)
      && (this.RoleId == 9 || this.RoleId == 12)) {
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Registro_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Cargo', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Tripulante', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Vencimiento_Pasaporte', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Pasajero', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'No_Vuelo', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Fecha_de_solicitud', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Cliente', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Solicitante', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Tipo_de_vuelo', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Numero_de_Tramo', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Origen', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Destino', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Fecha_de_salida', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Hora_de_salida', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Cantidad_de_Pasajeros', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Comisariato', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Notas_de_vuelo', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Ultimo_Tramo_notificar', 0);
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Vencimiento_Licencia', 0);
      this.brf.ShowMessage(" El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar");
    }

    //#region BRID:4988 - OCULTAR COMISARIATO Y NOTAS DE VUELO - Autor: Felipe Rodríguez - Actualización: 8/16/2021 1:09:14 PM
    this.brf.HideFolder("Comisariato"); this.brf.HideFolder("Notas_de_vuelo");
    this.brf.SetNotRequiredControl(this.Registro_de_vueloForm, "Comisariato");
    this.brf.SetNotRequiredControl(this.Registro_de_vueloForm, "Notas_de_vuelo");
    this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Comisariato', 0);
    this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Notas_de_vuelo', 0);
    this.brf.HideFieldOfForm(this.Registro_de_vueloForm, "Comisariato");
    this.brf.HideFieldOfForm(this.Registro_de_vueloForm, "Notas_de_vuelo");
    //#endregion

    //BRID:5673 - Ocultar check de ultimo tramo siempre - Autor: Lizeth Villa - Actualización: 9/2/2021 8:02:59 PM
    this.brf.HideFieldOfForm(this.Registro_de_vueloForm, "Ultimo_Tramo_notificar");
    this.brf.SetNotRequiredControl(this.Registro_de_vueloForm, "Ultimo_Tramo_notificar");

    //BRID:7093 - Desabilitar boton guarda vuelo si el vuelo esta reabierto, con ajuste manual - Autor: Lizeth Villa - Actualización: 10/11/2021 2:05:43 PM
    if (this.brf.EvaluaQuery(`SELECT Vuelo_reabierto from Solicitud_de_Vuelo where Folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`, 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Folio', 0);
    }

    //BRID:7094 - Desabilitar Guardar vuelo cuando este cerrado con ajuste manual - Autor: Lizeth Villa - Actualización: 10/11/2021 2:22:25 PM
    if (this.brf.EvaluaQuery(`SELECT estatus from Solicitud_de_Vuelo where folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`, 1, 'ABC123') == this.brf.TryParseInt('9', '9')) {
      this.brf.SetEnabledControl(this.Registro_de_vueloForm, 'Folio', 0);
    }

    if(this.operation == 'New'){

      if(this.Registro_de_vueloForm.get('Numero_de_Tramo').value == 1){
        this.brf.SetCurrentHourToField(this.Registro_de_vueloForm, 'Hora_de_salida');
      }

    }

    this.spinner.hide('loading');
    //rulesOnInit_ExecuteBusinessRulesEnd

  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    let KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)
    let Folio_Solicitud = this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")
    let Folio_Registro = this.localStorageHelper.getItemFromLocalStorage("IDFolio")
    //INICIA - BRID:491 - Regla para enviar asignacion de vuelo al editar. - Autor: Administrador - Actualización: 3/2/2021 2:48:37 PM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Registro_de_vueloForm, 'Enviar_asignacion_de_vuelo')==this.brf.TryParseInt('true', 'true') && this.brf.TryParseInt(this.brf.ReplaceVAR('USERROLEID'), this.brf.ReplaceVAR('USERROLEID'))==this.brf.TryParseInt('10', '10') ) { this.brf.SendEmailQueryPrintFormat("Asignación de Vuelo", this.brf.EvaluaQuery("a@correo.com", 1, "ABC123"), "html test",test,EvaluaQuery("test", 1, "ABC123"));} else {}
    }
    //TERMINA - BRID:491


    //INICIA - BRID:494 - Regla para actualizar tramos al editar - Autor: Administrador - Actualización: 3/2/2021 6:03:30 PM
    if (this.operation == 'Update') {
      this.brf.EvaluaQuery(" EXEC UspActualizarTramosVuelos  " + Folio_Registro, 1, "ABC123");
    }
    //TERMINA - BRID:494


    if (this.operation == 'New') {
      //BRID:1898 - En nuevo despues de guardar actualizar numero de vuelo - Autor: Ivan Yañez - Actualización: 3/24/2021 9:06:58 AM
      this.brf.EvaluaQuery(` UPDATE Registro_de_Vuelo set No_Vuelo = ${Folio_Solicitud} where Folio = ${KeyValueInserted}`, 1, "ABC123");

      //BRID:1902 - En nuevo después de guardar si el campo No_de_Vuelo de la pantalla solicitud_de_Vuelo es null executar so que genera el numero de vuelo y actualizar numero de Vuelo en Registro de Vuelo - Autor: Ivan Yañez - Actualización: 3/24/2021 9:06:54 AM
      this.brf.EvaluaQuery(` DECLARE @Numero_de_Vuelo NVARCHAR(250) SELECT @Numero_de_Vuelo = Numero_de_Vuelo FROM Solicitud_de_Vuelo WHERE Folio = ${this.localStorageHelper.getItemFromLocalStorage("idTablero")} IF (@Numero_de_Vuelo IS NULL) BEGIN DECLARE @numero INT EXEC uspGenerarNumeroVuelo @numerodevuelo = @numero OUTPUT UPDATE Solicitud_de_Vuelo SET Numero_de_Vuelo = @numero where Folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} END `, 1, "ABC123");

      //BRID:2056 - En nuevo, después de guardar, actualizar el campo de Cantidad de pasajeros con la cantidad de pasajeros capturados. - Autor: Ivan Yañez - Actualización: 3/25/2021 7:19:11 PM

      this.brf.EvaluaQuery(` UPDATE Registro_de_Vuelo set Cantidad_de_Pasajeros = ${this.quantityPasajeros()} where Folio = ${Folio_Registro} `, 1, "ABC123");

    }
    //TERMINA - BRID:1898

    //INICIA - BRID:2057 - En modificar, después de guardar, actualizar el campo de Cantidad de pasajeros con la cantidad de pasajeros capturados. - Autor: Ivan Yañez - Actualización: 3/25/2021 7:02:28 PM
    if (this.operation == 'Update') {
      this.brf.EvaluaQuery(` Declare @cantidad int set @cantidad=(select count(*)from Detalle_Registro_Vuelo_Pasajeros WITH(NOLOCK) where Registro_de_Vuelo = ${Folio_Registro}) update Registro_de_Vuelo set Cantidad_de_Pasajeros=@cantidad where Folio = ${Folio_Registro}`, 1, "ABC123");
    }
    //TERMINA - BRID:2057


    //INICIA - BRID:2065 - En nuevo y modificar, despues de guardar, ejecutar el siguiente SP:exec uspAsignaMatriculaCoordinacionVuelo GLOBAL[SpartanOperationId] - Autor: Ivan Yañez - Actualización: 3/25/2021 9:36:55 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.EvaluaQuery(` exec uspAsignaMatriculaCoordinacionVuelo ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} `, 1, "ABC123");
    }
    //TERMINA - BRID:2065


    //INICIA - BRID:2629 - ACTUALIZAR PASAJEROS DEL VUELO POR CADA ACTUALIZACIÓN A UN TRAMO - Autor: Felipe Rodríguez - Actualización: 4/7/2021 11:31:46 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.EvaluaQuery(` EXEC sp_ActualizaPasajerosVueloPorTramo ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} `, 1, "ABC123");
    }
    //TERMINA - BRID:2629


    //INICIA - BRID:2638 -  Al editar vuelo si está encendido el checkbox especificado en el punto anterior le llegue un correo a todos los tripulantes  - Autor: Lizeth Villa - Actualización: 4/15/2021 12:32:03 PM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Registro_de_vueloForm, 'Ultimo_Tramo_notificar')==this.brf.TryParseInt('true', 'true') ) { this.brf.SendEmailQueryPrintFormat("VICS - Asignacion de Vuelo", this.brf.EvaluaQuery("SELECT STUFF(( select ';'+ k +'' from( select distinct correo_electronico as k from Registro_de_vuelo rv WITH(NOLOCK) inner join Detalle_Registro_Vuelo_Tripulacion d WITH(NOLOCK) on rv.Folio = d.Registro_de_Vuelo inner join Tripulacion p WITH(NOLOCK) on d.tripulante = p.clave where rv.no_vuelo= FLD[No_Vuelo] UNION ALL SELECT Email as k from Spartan_User as I where Role in (10,12)) as k FOR XML PATH('')),1,1,'')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimada Tripulación:</p> <p>Envío asignación de vuelo '+ EvaluaQuery("select numero_de_vuelo from Solicitud_de_Vuelo WITH(NOLOCK) where folio = FLD[No_Vuelo]")+ ' para el próximo '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = FLDD[lblFolio] ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = FLDD[lblFolio]),105)")+ ' en la aeronave FLD[Matricula] favor de indicarnos los viáticos y requerimientos para el vuelo.</p> <p>Favor de enviar acuse de recibido.</p> <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style="fill:#325396;transform:;-ms-filter:"> <path fill="none" d="M12,8c-1.178,0-2,0.822-2,2s0.822,2,2,2s2-0.822,2-2S13.178,8,12,8z"> </path> <path fill="none" d="M12,4c-4.337,0-8,3.663-8,8c0,2.176,0.923,4.182,2.39,5.641c0.757-1.8,2.538-3.068,4.61-3.068h2 c2.072,0,3.854,1.269,4.61,3.068C19.077,16.182,20,14.176,20,12C20,7.663,16.337,4,12,4z M12,14c-2.28,0-4-1.72-4-4s1.72-4,4-4 s4,1.72,4,4S14.28,14,12,14z"> </path> <path fill="none" d="M13,16.572h-2c-1.432,0-2.629,1.01-2.926,2.354C9.242,19.604,10.584,20,12,20s2.758-0.396,3.926-1.073 C15.629,17.582,14.432,16.572,13,16.572z"> </path> <path d="M12,2C6.579,2,2,6.579,2,12c0,3.189,1.592,6.078,4,7.924V20h0.102C7.77,21.245,9.813,22,12,22s4.23-0.755,5.898-2H18 v-0.076c2.408-1.846,4-4.734,4-7.924C22,6.579,17.421,2,12,2z M8.074,18.927c0.297-1.345,1.494-2.354,2.926-2.354h2 c1.432,0,2.629,1.01,2.926,2.354C14.758,19.604,13.416,20,12,20S9.242,19.604,8.074,18.927z M17.61,17.641 c-0.757-1.8-2.538-3.068-4.61-3.068h-2c-2.072,0-3.854,1.269-4.61,3.068C4.923,16.182,4,14.176,4,12c0-4.337,3.663-8,8-8 s8,3.663,8,8C20,14.176,19.077,16.182,17.61,17.641z"> </path> <path d="M12,6c-2.28,0-4,1.72-4,4s1.72,4,4,4s4-1.72,4-4S14.28,6,12,6z M12,12c-1.178,0-2-0.822-2-2s0.822-2,2-2s2,0.822,2,2 S13.178,12,12,12z"> </path> </svg></td> <td width="5">&nbsp;</td> <td> <p style="font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;"> '+ EvaluaQuery("select name from spartan_user where id_user = GLOBAL[USERID]")+ ' </p> </td> <td width="40">&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td> <p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p> </td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px"> &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	",35,EvaluaQuery("select FLDD[lblFolio]", 1, "ABC123"));} else {}
    }
    //TERMINA - BRID:2638


    //INICIA - BRID:2640 -  Al guardar en nuevo un registro de vuelo si está encendido el checkbox especificado en el punto anterior le llegue un correo a todos los tripulantes  - Autor: Lizeth Villa - Actualización: 4/15/2021 12:14:30 PM
    if (this.operation == 'New') {
      //if( this.brf.GetValueByControlType(this.Registro_de_vueloForm, 'Ultimo_Tramo_notificar')==this.brf.TryParseInt('true', 'true') ) { this.brf.SendEmailQueryPrintFormat("VICS - Asignacion de Vuelo", this.brf.EvaluaQuery("SELECT STUFF(( select ';'+ k +'' from( select distinct correo_electronico as k from Registro_de_vuelo rv WITH(NOLOCK) inner join Detalle_Registro_Vuelo_Tripulacion d WITH(NOLOCK) on rv.Folio = d.Registro_de_Vuelo inner join Tripulacion p WITH(NOLOCK) on d.tripulante = p.clave where rv.no_vuelo= (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted] ) UNION ALL SELECT Email as k from Spartan_User as I where Role in (10,12)) as k FOR XML PATH('')),1,1,'')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimada Tripulación:</p> <p>Envío asignación de vuelo '+ EvaluaQuery("select numero_de_vuelo from Solicitud_de_Vuelo WITH(NOLOCK) where folio = (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted])")+ ' para el próximo '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted]) ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted])),105)")+ ' en la aeronave FLD[Matricula] favor de indicarnos los viáticos y requerimientos para el vuelo.</p> <p>Favor de enviar acuse de recibido.</p> <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"><svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" style="fill:#325396;transform:;-ms-filter:"> <path fill="none" d="M12,8c-1.178,0-2,0.822-2,2s0.822,2,2,2s2-0.822,2-2S13.178,8,12,8z"> </path> <path fill="none" d="M12,4c-4.337,0-8,3.663-8,8c0,2.176,0.923,4.182,2.39,5.641c0.757-1.8,2.538-3.068,4.61-3.068h2 c2.072,0,3.854,1.269,4.61,3.068C19.077,16.182,20,14.176,20,12C20,7.663,16.337,4,12,4z M12,14c-2.28,0-4-1.72-4-4s1.72-4,4-4 s4,1.72,4,4S14.28,14,12,14z"> </path> <path fill="none" d="M13,16.572h-2c-1.432,0-2.629,1.01-2.926,2.354C9.242,19.604,10.584,20,12,20s2.758-0.396,3.926-1.073 C15.629,17.582,14.432,16.572,13,16.572z"> </path> <path d="M12,2C6.579,2,2,6.579,2,12c0,3.189,1.592,6.078,4,7.924V20h0.102C7.77,21.245,9.813,22,12,22s4.23-0.755,5.898-2H18 v-0.076c2.408-1.846,4-4.734,4-7.924C22,6.579,17.421,2,12,2z M8.074,18.927c0.297-1.345,1.494-2.354,2.926-2.354h2 c1.432,0,2.629,1.01,2.926,2.354C14.758,19.604,13.416,20,12,20S9.242,19.604,8.074,18.927z M17.61,17.641 c-0.757-1.8-2.538-3.068-4.61-3.068h-2c-2.072,0-3.854,1.269-4.61,3.068C4.923,16.182,4,14.176,4,12c0-4.337,3.663-8,8-8 s8,3.663,8,8C20,14.176,19.077,16.182,17.61,17.641z"> </path> <path d="M12,6c-2.28,0-4,1.72-4,4s1.72,4,4,4s4-1.72,4-4S14.28,6,12,6z M12,12c-1.178,0-2-0.822-2-2s0.822-2,2-2s2,0.822,2,2 S13.178,12,12,12z"> </path> </svg></td> <td width="5">&nbsp;</td> <td> <p style="font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;"> '+ EvaluaQuery("select name from spartan_user where id_user = GLOBAL[USERID]")+ ' </p> </td> <td width="40">&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td> <p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p> </td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px"> &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	",35,EvaluaQuery("select GLOBAL[keyvalueinserted]", 1, "ABC123"));} else {}
    }
    //TERMINA - BRID:2640


    //INICIA - BRID:5594 - Noitificacion Push Al editar vuelo si está encendido el checkbox especificado en el punto anterior le llegue una notificacion a todos los tripulantes  - Autor: ANgel Acuña - Actualización: 9/7/2021 5:17:22 PM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Registro_de_vueloForm, 'Ultimo_Tramo_notificar')==this.brf.TryParseInt('true', 'true') ) { this.brf.SendNotificationPush(this.brf.EvaluaQuery("select 'AEROVICS - Registro de Tramo'", "ABC123"), this.brf.EvaluaQuery("SELECT STUFF(( select ','+ k +'' from( select distinct CONVERT(VARCHAR(20), usuario_relacionado) as k from Registro_de_vuelo rv WITH(NOLOCK) inner join Detalle_Registro_Vuelo_Tripulacion d WITH(NOLOCK) on rv.Folio = d.Registro_de_Vuelo inner join Tripulacion p WITH(NOLOCK) on d.tripulante = p.clave where rv.no_vuelo= FLD[No_Vuelo] UNION ALL SELECT CONVERT(VARCHAR(20), id_user) as k from Spartan_User as I where Role in (10,12)) as k FOR XML PATH('')),1,1,'')", 1, "ABC123") ,this.brf.EvaluaQuery("select '{\"id\":\"FLD[Folio]\"}'", 1, "ABC123"), this.brf.EvaluaQuery("select 'Estimada Tripulación: Envío asignación de vuelo '")+ EvaluaQuery("select numero_de_vuelo from Solicitud_de_Vuelo WITH(NOLOCK) where folio = (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted])")+ EvaluaQuery("select ' para el próximo '")+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted]) ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted])),105)")+ EvaluaQuery("select ' en la aeronave FLD[Matricula] favor de indicarnos los viáticos y requerimientos para el vuelo.'", 1, "ABC123"),"1");} else {}
    }
    //TERMINA - BRID:5594


    //INICIA - BRID:6113 - Actualizar Solicitante y empresa si el vuelo esta reabierto antes de guardar - Autor: Lizeth Villa - Actualización: 9/9/2021 7:57:43 PM
    if (this.operation == 'Update') {
      if((this.localStorageHelper.getLoggedUserInfo().RoleId == 9 || this.localStorageHelper.getLoggedUserInfo().RoleId == 12) && 
      this.brf.EvaluaQuery(`select Vuelo_reabierto from solicitud_de_vuelo where folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`, 1, 'ABC123') == this.brf.TryParseInt('1', '1')){
        this.brf.EvaluaQuery(` update Registro_de_vuelo set Solicitante = ${this.Registro_de_vueloForm.get('Solicitante').value} where no_vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} `, 1, "ABC123");
        this.brf.EvaluaQuery(`update Solicitud_de_Vuelo set Solicitante = ${this.Registro_de_vueloForm.get('Solicitante').value} where folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} `, 1, "ABC123");
        this.brf.EvaluaQuery(` update Solicitud_de_Vuelo set Empresa_Solicitante = ${this.Registro_de_vueloForm.get('Cliente').value} where folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} `, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6113


    //INICIA - BRID:6423 - Despues de guardar en nuevo y edicion Si el check Ultimo_Tramo_notificar esta encendido  mandar a llamar el SP: uspGeneraGastosVuelo y como parámetro enviar el id del vuelo - Autor: Francisco Javier Martínez Urbina - Actualización: 9/23/2021 8:09:45 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.EvaluaQuery("EXEC uspGeneraGastosVuelo "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
    }
    //TERMINA - BRID:6423


    //INICIA - BRID:7207 - Noitificacion Push en nuevo, si está encendido el checkbox o boton manual guardar veulo, le llegue una notificacion a todos los tripulantes - Autor: Lizeth Villa - Actualización: 10/22/2021 1:26:21 PM
    if (this.operation == 'New') {
      //if( this.brf.GetValueByControlType(this.Registro_de_vueloForm, 'Ultimo_Tramo_notificar')==this.brf.TryParseInt('true', 'true') ) { this.brf.SendNotificationPush(this.brf.EvaluaQuery("select 'AEROVICS - Registro de Tramo'", ""ABC123""), this.brf.EvaluaQuery("SELECT STUFF(( select ','+ k +'' from( select distinct CONVERT(VARCHAR(20), usuario_relacionado) as k from Registro_de_vuelo rv WITH(NOLOCK) inner join Detalle_Registro_Vuelo_Tripulacion d WITH(NOLOCK) on rv.Folio = d.Registro_de_Vuelo inner join Tripulacion p WITH(NOLOCK) on d.tripulante = p.clave where rv.no_vuelo= GLOBAL[SpartanOperationId] UNION ALL SELECT CONVERT(VARCHAR(20), id_user) as k from Spartan_User as I where Role in (10,12)) as k FOR XML PATH('')),1,1,'')", 1, "ABC123") ,this.brf.EvaluaQuery("select '{\"id\":\"GLOBAL[keyvalueinserted]\"}", 1, "ABC123"), this.brf.EvaluaQuery("select 'Estimada Tripulación: Envío asignación de vuelo '")+ EvaluaQuery("select numero_de_vuelo from Solicitud_de_Vuelo WITH(NOLOCK) where folio = (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted])")+ EvaluaQuery("select ' para el próximo '")+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted]) ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = (select no_vuelo from Registro_de_vuelo where folio = GLOBAL[keyvalueinserted])),105)")+ EvaluaQuery("select ' en la aeronave FLD[Matricula] favor de indicarnos los viáticos y requerimientos para el vuelo.'", 1, "ABC123")," 1");} else {}
    }
    //TERMINA - BRID:7207

    //rulesAfterSave_ExecuteBusinessRulesEnd

    this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");

    this.closeWindowSave();
  }

  rulesBeforeSave(boton: string = null) {
    let result = true;

    if (boton == 'GuardarVuelo') {
      this.Registro_de_vueloForm.get('Ultimo_Tramo_notificar').setValue('true');
      this.brf.EvaluaQuery("EXEC uspGeneraGastosVuelo "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'), 1, "ABC123");
    }

    this.isLoading = true;
    this.spinner.show('loading');

    //rulesBeforeSave_ExecuteBusinessRulesInit
    let Numero_de_Tramo = this.Registro_de_vueloForm.controls['Numero_de_Tramo'].value;
    let Fecha_de_salida = this.Registro_de_vueloForm.controls['Fecha_de_salida'].value;

    let formatFecha_de_salida = momentJS(Fecha_de_salida).format('DD-MM-YYYY')

    //INICIA - BRID:5545 - Validacion de fechas, no puede ser menor a la fecha del tramo anterior - Autor: Lizeth Villa - Actualización: 8/30/2021 11:40:26 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.brf.EvaluaQuery(`EXEC spValidacionFechaAnterior ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}, ${Numero_de_Tramo}, '${formatFecha_de_salida}' `, 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.ShowMessage("La fecha de salida no puede ser menor a la fecha de salida del tramo anterior.");

        result = false;
      }
    }
    //TERMINA - BRID:5545

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    if (result) {
      this.saveData();
    }
    else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }

  }

  //Fin de reglas

  private filterMatricula(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.optionsMatricula.filter(option => option.Description.toLowerCase().includes(filterValue));
  }

  //#region Obtener Matricula
  getMatricula() {
    let result = []

    result = this.brf.EvaluaQueryDictionary(`SELECT Matricula, Matricula FROM dbo.Aeronave WHERE Estatus = 2`, 1, 'ABC123')

    this.optionsMatricula = result
    this.optionsMatriculaFiltered = of(result);

    this.optionsMatriculaFiltered = this.Registro_de_vueloForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this.filterMatricula(name as string) : this.optionsMatricula.slice();
      }),
    );

  }
  //#endregion

  getVuelos() {
    this.sqlModelSV.query = `SELECT sv.Folio, sv.Numero_de_Vuelo FROM Registro_de_vuelo(NOLOCK) rv INNER JOIN Solicitud_de_Vuelo (NOLOCK) sv ON sv.Folio = rv.No_Vuelo WHERE rv.Folio = ${this.localStorageHelper.getItemFromLocalStorage("FolioRegistroVuelo")}`;
    this.spartanService.ExecuteQueryDictionary(this.sqlModelSV).subscribe(result => {
      let responseSolicitudVuelo = this.setResponseSolicitudVuelo(result);
      this.varSolicitud_de_Vuelo = responseSolicitudVuelo;
    });
  }

  getTiposVuelo() {
    this.Tipo_de_vueloService.getAll().subscribe(result => {
      this.varTipo_de_vuelo = result;
    });
  }

  getUsuarios() {
    this.Spartan_UserService.getAll().subscribe(varSpartan_User => {
      this.varSpartan_User = varSpartan_User.filter((user:any) => user.Status == 1);
    });
  }

  getCargoTripulante() {
    this.Cargo_de_TripulanteService.getAll().subscribe(varCargo_de_Tripulante => {
      this.varCargo_de_Tripulante = varCargo_de_Tripulante;
    });
  }

  //#region Al Cambiar o elegir Matricula
  // onChangeMatricula(option: number) {
  //   //Limpiar tripulación

  //   //option : 0 = Desde Input | 1: Desde AutoComplete
  //   let Matricula = this.Registro_de_vueloForm.controls['Matricula'].value;
  //   Matricula = (option == 0) ? Matricula : Matricula.Description

  //   if (this.optionsMatricula.length > 0) {
  //     this.optionsMatricula.forEach(element => {
  //       if (typeof Matricula == 'string' && (Matricula.toUpperCase() == element.Description.toUpperCase())) {
  //         this.Registro_de_vueloForm.controls['Matricula'].setValue(element)
  //       }
  //     });
  //   }

  // }
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

  setRefactorDateSalida(paramDate, option) {
    //Formatear Fecha 
    let formatDate = momentJS(paramDate, 'DD-MM-YYYY').format('YYYY-MM-DD')

    var date = new Date(formatDate)
    date.setMinutes(date.getMinutes() + date.getTimezoneOffset());
    //Asignar Fecha como +1 día (Por el datepicker)
    if(option == 0){
      date.setDate(date.getDate())
    }
    if(option == 1){
      date.setDate(date.getDate())
    }

    return date
  }
  //#endregion

  //#region Asignar Fecha de Solicitud
  setFecha_de_Solicitud() {

    //Fecha de Solicitud
    this.sqlModel.query = `SELECT convert (varchar(11),(select Fecha_de_Solicitud from Solicitud_de_Vuelo WITH(NOLOCK) where Folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ),105)`;

    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        let formatDate = this.setRefactorDate(response)
        this.Registro_de_vueloForm.controls["Fecha_de_solicitud"].setValue(formatDate)
      }
    })
  }
  //#endregion

  //#region Asignar Fecha de Salida
  setFecha_de_salida(option) {

    //Fecha de Solicitud
    if (option == 0) {
      this.sqlModel.query = `SELECT CONVERT (varchar(11),Fecha_de_Salida,105) FROM Solicitud_de_Vuelo WITH(NOLOCK) WHERE Folio = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")}`;
    }
    else if (option == 1) {
      this.sqlModel.query = `SELECT CONVERT (varchar(11),(SELECT TOP 1 Fecha_de_salida FROM Registro_de_Vuelo WITH(NOLOCK) WHERE No_Vuelo = ${this.localStorageHelper.getItemFromLocalStorage("Folio_Solicitud")} ORDER BY Folio DESC),105)`
    }

    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        let formatDate = this.setRefactorDateSalida(response, option);
        this.Registro_de_vueloForm.controls["Fecha_de_salida"].setValue(formatDate);
        if (option == 1) {
          this.minFecha_de_salida = new Date(formatDate);
        }
      }
    })
  }
  //#endregion

  //#region Asignar Tripulantes
  filterTripulante(index: any) {
    let Matricula = this.Registro_de_vueloForm.controls['Matricula'].value;
    let Fecha_de_salida = this.Registro_de_vueloForm.controls['Fecha_de_salida'].value;

    this.sqlModel.query = `select t.Clave, t.Nombre_completo from Tripulacion_Aeronave ta left join Tripulacion t on t.Clave = ta.Clave_Tripulacion ` +
      ` where t.estatus = 2 and Aeronave = '${Matricula.Description}'`;

    this.spartanService.ExecuteQueryDictionary(this.sqlModel).subscribe({
      next: (data) => {
        let response = this.setResponseTripulante(data)
        this.varTripulacion = response
      },
      error: e => console.error(e),
      complete: () => {
      }
    })

  }
  //#endregion

  //#region Formatear Tripulante
  setResponseTripulante(result: any) {
    let response: any = [];

    if (result) {
      //Se realiza el mapeo al modelo [{Clave, Description}]
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        response.push(
          {
            "Clave": element[0],
            "Nombre_completo": element[1]
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

  //#region Asignar Pasaportes
  setPasaportes(index) {
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
    let Tripulante = formTripulacion.value.Tripulante;

    //Vencimiento_Pasaporte
    this.sqlModel.query = `select convert (varchar(11),(select Fecha_de_Vencimiento_Pasaporte_1 from Tripulacion with(nolock) where Clave = ${Tripulante} ),105)`;

    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        let formatDate = this.setRefactorDate(response)
        formTripulacion.controls["Vencimiento_Pasaporte"].setValue(formatDate)
      }
    })

    //Vencimiento_Licencia
    this.sqlModel.query = `select convert (varchar(11),(select Fecha_de_vencimiento_licencia  from Tripulacion with(nolock) where Clave = ${Tripulante} ),105)`;

    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        let formatDate = this.setRefactorDate(response)
        formTripulacion.controls["Vencimiento_Licencia"].setValue(formatDate)

      }
    })

    //Vencimiento_Certificado_Medico
    this.sqlModel.query = `select convert (varchar(11),(select Fecha_de_vencimiento_certificado  from Tripulacion with(nolock) where Clave = ${Tripulante} ),105)`;

    this.spartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        let formatDate = this.setRefactorDate(response)
        formTripulacion.controls["Vencimiento_Certificado_Medico"].setValue(formatDate)

      }
    })

  }
  //#endregion


}
