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
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { Detalle_Pasajeros_Solicitud_de_VueloService } from 'src/app/api-services/Detalle_Pasajeros_Solicitud_de_Vuelo.service';
import { Detalle_Pasajeros_Solicitud_de_Vuelo } from 'src/app/models/Detalle_Pasajeros_Solicitud_de_Vuelo';
import { PasajerosService } from 'src/app/api-services/Pasajeros.service';
import { Pasajeros } from 'src/app/models/Pasajeros';

import { Estatus_de_Solicitud_de_VueloService } from 'src/app/api-services/Estatus_de_Solicitud_de_Vuelo.service';
import { Estatus_de_Solicitud_de_Vuelo } from 'src/app/models/Estatus_de_Solicitud_de_Vuelo';
import { Resultado_de_Autorizacion_de_VueloService } from 'src/app/api-services/Resultado_de_Autorizacion_de_Vuelo.service';
import { Resultado_de_Autorizacion_de_Vuelo } from 'src/app/models/Resultado_de_Autorizacion_de_Vuelo';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/api-services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";
import {MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS} from '@angular/material-moment-adapter';
import { solicitudVuelo } from '../../Calendario/models/modelSolicitudVuelo';
import { DatePipe } from '@angular/common';
import { ValidatorsHelper } from 'src/app/helpers/validators-helper';

@Component({
  selector: 'app-Solicitud_de_Vuelo',
  templateUrl: './Solicitud_de_Vuelo.component.html',
  styleUrls: ['./Solicitud_de_Vuelo.component.scss'],
  providers: [
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_MOMENT_DATE_ADAPTER_OPTIONS, useValue: { useUtc: true } },
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
export class Solicitud_de_VueloComponent implements OnInit, AfterViewInit {
MRaddPasajero_Solicitante: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  phase: number = 1
  PhaseSelect: number = 0;
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }

  idKeySave: number;
  showTab = {
    "Datos_Generales": true, "Autorizacion_Direccion_General": true, "Autorizacion_Presidencia": true,
    "Datos_Generales_2": true, "Autorizacion_Presidencia_2": true, "Datos_Generales_3": true, "Autorizacion_Presidencia_3": true
  }

  Solicitud_de_VueloForm: FormGroup;
  public Editor = ClassicEditor;
  model: Solicitud_de_Vuelo;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;

  public varSpartan_User: Spartan_User[] = [];
  optionsEmpresa_Solicitante: Observable<Cliente[]>;
  hasOptionsEmpresa_Solicitante: boolean;
  isLoadingEmpresa_Solicitante: boolean;
  public varPasajeros: Pasajeros[] = [];

  autoPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo = new FormControl();
  SelectedPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo: string[] = [];
  isLoadingPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo: boolean;
  searchPasajero_Detalle_Pasajeros_Solicitud_de_VueloCompleted: boolean;

  public varEstatus_de_Solicitud_de_Vuelo: Estatus_de_Solicitud_de_Vuelo[] = [];
  public varResultado_de_Autorizacion_de_Vuelo: Resultado_de_Autorizacion_de_Vuelo[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourcePasajero_Solicitante = new MatTableDataSource<Detalle_Pasajeros_Solicitud_de_Vuelo>();
  Pasajero_SolicitanteColumns = [
    { def: 'actions', hide: false },
    { def: 'Pasajero', hide: false },
  ];
  Pasajero_SolicitanteData: Detalle_Pasajeros_Solicitud_de_Vuelo[] = [];

  today = new Date;
  todayFechaSalida = new Date;
  consult: boolean = false;
  pasajeroIsUsed: boolean = false;
  pasajeroButton: boolean = false;
  empresaSolicitanteEdit: number = 0;
  isPasajeroOpen: boolean = false;
  //#endregion


  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private Spartan_UserService: Spartan_UserService,
    private ClienteService: ClienteService,
    private Detalle_Pasajeros_Solicitud_de_VueloService: Detalle_Pasajeros_Solicitud_de_VueloService,
    private PasajerosService: PasajerosService,

    private Estatus_de_Solicitud_de_VueloService: Estatus_de_Solicitud_de_VueloService,
    private Resultado_de_Autorizacion_de_VueloService: Resultado_de_Autorizacion_de_VueloService,
    private validatorsHelper: ValidatorsHelper,
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
    public activatedRoute: ActivatedRoute) {

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);

    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Solicitud_de_Vuelo(this.fb);
    this.Solicitud_de_VueloForm = this.model.buildFormGroup();
    this.Pasajero_SolicitanteItems.removeAt(0);

    this.Solicitud_de_VueloForm.get('Folio').disable();
    this.Solicitud_de_VueloForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });

  }
  
  soloFecha(e) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
    const keyPressed = e.key;

    if (!allowedKeys.includes(keyPressed)) {
      e.preventDefault();
      return;
    }
    if (e.target.value.length >= 10) {
      e.preventDefault();
      return;
    }
  }

  ngAfterViewInit(): void {
    this.dataSourcePasajero_Solicitante.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.PhaseSelect = +this.localStorageHelper.getItemFromLocalStorage("QueryParam");
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Pasajero_SolicitanteColumns.splice(0, 1);

        this.Solicitud_de_VueloForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }

    });

    this.dataListConfig = history.state.data;
    this.phase = history.state.phase;

    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_Vuelo)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Solicitud_de_VueloForm, 'Empresa_Solicitante', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Solicitud_de_VueloService.listaSelAll(0, 1, 'Solicitud_de_Vuelo.Folio=' + id).toPromise();
    if (result.Solicitud_de_Vuelos.length > 0) {
      let fPasajero_Solicitante = await this.Detalle_Pasajeros_Solicitud_de_VueloService.listaSelAll(0, 1000, 'Solicitud_de_Vuelo.Folio=' + id).toPromise();
      this.Pasajero_SolicitanteData = fPasajero_Solicitante.Detalle_Pasajeros_Solicitud_de_Vuelos;
      this.loadPasajero_Solicitante(fPasajero_Solicitante.Detalle_Pasajeros_Solicitud_de_Vuelos);
      this.dataSourcePasajero_Solicitante = new MatTableDataSource(fPasajero_Solicitante.Detalle_Pasajeros_Solicitud_de_Vuelos);
      this.dataSourcePasajero_Solicitante.paginator = this.paginator;
      this.dataSourcePasajero_Solicitante.sort = this.sort;

      this.empresaSolicitanteEdit = result.Solicitud_de_Vuelos[0].Empresa_Solicitante;

      this.model.fromObject(result.Solicitud_de_Vuelos[0]);
      this.Solicitud_de_VueloForm.get('Empresa_Solicitante').setValue(
        result.Solicitud_de_Vuelos[0].Empresa_Solicitante_Cliente.Razon_Social,
        { onlySelf: false, emitEvent: true }
      );

      this.Solicitud_de_VueloForm.markAllAsTouched();
      this.Solicitud_de_VueloForm.updateValueAndValidity();
      this.spinner.hide('loading');
      this.rulesOnInit();
    } else {
      this.spinner.hide('loading');
      this.rulesOnInit();
    }
  }

  //#region Pasajeros
  get Pasajero_SolicitanteItems() {
    return this.Solicitud_de_VueloForm.get('Detalle_Pasajeros_Solicitud_de_VueloItems') as FormArray;
  }

  getPasajero_SolicitanteColumns(): string[] {
    return this.Pasajero_SolicitanteColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPasajero_Solicitante(Pasajero_Solicitante: Detalle_Pasajeros_Solicitud_de_Vuelo[]) {
    Pasajero_Solicitante.forEach(element => {
      this.addPasajero_Solicitante(element);
    });
  }

  checkPasajeroIsUsed(event) {
    if (event.isUserInput) {
      for (let i = 0; i <= this.dataSourcePasajero_Solicitante.data.length; i++) {
        this.pasajeroIsUsed = this.dataSourcePasajero_Solicitante.data[i]?.Pasajero_Pasajeros?.Identificador_Alias === event.source.viewValue;
        if (this.pasajeroIsUsed) {
          break;
        }
      }
      this.pasajeroIsUsed ? alert("No se puede capturar pasajeros repetidos") : "";
    }
  }

  addPasajero_SolicitanteToMR() {
    const Pasajero_Solicitante = new Detalle_Pasajeros_Solicitud_de_Vuelo(this.fb);
    Pasajero_Solicitante.edit = true;
    Pasajero_Solicitante.isNew = true;
    this.Pasajero_SolicitanteData.push(this.addPasajero_Solicitante(Pasajero_Solicitante));
    this.dataSourcePasajero_Solicitante.data = this.Pasajero_SolicitanteData;
    const length = this.dataSourcePasajero_Solicitante.data.length;
    const index = length - 1;
    const formPasajero_Solicitante = this.Pasajero_SolicitanteItems.controls[index] as FormGroup;
    this.addFilterToControlPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo(formPasajero_Solicitante.controls.Pasajero, index);

    const page = Math.ceil(this.dataSourcePasajero_Solicitante.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }

     this.isPasajeroOpen = true;
  }

  addPasajero_Solicitante(entity: Detalle_Pasajeros_Solicitud_de_Vuelo) {
    const Pasajero_Solicitante = new Detalle_Pasajeros_Solicitud_de_Vuelo(this.fb);
    this.Pasajero_SolicitanteItems.push(Pasajero_Solicitante.buildFormGroup());
    if (entity) {
      Pasajero_Solicitante.fromObject(entity);
    }
    this.isPasajeroOpen = false;
    return entity;
  }

  Pasajero_SolicitanteItemsByFolio(Folio: number): FormGroup {
    return (this.Solicitud_de_VueloForm.get('Detalle_Pasajeros_Solicitud_de_VueloItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Pasajero_SolicitanteItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePasajero_Solicitante.data.indexOf(element);
    let fb = this.Pasajero_SolicitanteItems.controls[index] as FormGroup;
    return fb;
  }

  deletePasajero_Solicitante(element: any) {
    let index = this.dataSourcePasajero_Solicitante.data.indexOf(element);
    this.Pasajero_SolicitanteData[index].IsDeleted = true;
    this.Pasajero_SolicitanteData.splice(index,1);
    this.dataSourcePasajero_Solicitante.data = this.Pasajero_SolicitanteData;
    this.dataSourcePasajero_Solicitante._updateChangeSubscription();
    index = this.dataSourcePasajero_Solicitante.data.filter(d => !d.IsDeleted).length;

    let fgr = this.Solicitud_de_VueloForm.controls.Detalle_Pasajeros_Solicitud_de_VueloItems as FormArray;
    fgr.removeAt(index);

    let spdpsv = this.SelectedPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo;
    spdpsv.splice(index, 1);
    
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
    
  }

  cancelEditPasajero_Solicitante(element: any) {
    let index = this.dataSourcePasajero_Solicitante.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Pasajero_SolicitanteData[index].IsDeleted = true;
      this.Pasajero_SolicitanteData.splice(index,1); //Cambio en Spartane
      this.dataSourcePasajero_Solicitante.data = this.Pasajero_SolicitanteData;
      this.dataSourcePasajero_Solicitante._updateChangeSubscription();
      index = this.Pasajero_SolicitanteData.filter(d => !d.IsDeleted).length;

      let fgr = this.Solicitud_de_VueloForm.controls.Detalle_Pasajeros_Solicitud_de_VueloItems as FormArray;
      fgr.removeAt(index);

      let spdpsv = this.SelectedPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo;
      spdpsv.splice(index, 1);

      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }

    this.isPasajeroOpen = false;
    
  }

  async savePasajero_Solicitante(element: any) {
    const index = this.dataSourcePasajero_Solicitante.data.indexOf(element);
    const formPasajero_Solicitante = this.Pasajero_SolicitanteItems.controls[index] as FormGroup;
    if (this.Pasajero_SolicitanteData[index].Pasajero !== formPasajero_Solicitante.value.Pasajero && formPasajero_Solicitante.value.Pasajero != null && formPasajero_Solicitante.value.Pasajero != undefined) {
      let pasajeros = await this.PasajerosService.getById(formPasajero_Solicitante.value.Pasajero).toPromise();
      this.Pasajero_SolicitanteData[index].Pasajero_Pasajeros = pasajeros;
    }
    this.Pasajero_SolicitanteData[index].Pasajero = formPasajero_Solicitante.value.Pasajero;

    this.Pasajero_SolicitanteData[index].isNew = false;
    this.dataSourcePasajero_Solicitante.data = this.Pasajero_SolicitanteData;
    this.dataSourcePasajero_Solicitante._updateChangeSubscription();
    this.isPasajeroOpen = false;
  }

  editPasajero_Solicitante(element: any) {
    const index = this.dataSourcePasajero_Solicitante.data.indexOf(element);
    const formPasajero_Solicitante = this.Pasajero_SolicitanteItems.controls[index] as FormGroup;
    this.SelectedPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo[index] = this.dataSourcePasajero_Solicitante.data[index].Pasajero_Pasajeros.Identificador_Alias;
    this.addFilterToControlPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo(formPasajero_Solicitante.controls.Pasajero, index);

    element.edit = true;
    this.isPasajeroOpen = true;
  }

  async saveDetalle_Pasajeros_Solicitud_de_Vuelo(Folio: number) {
    let values: string = '';
    this.dataSourcePasajero_Solicitante.data.forEach(async (d, index) => {
      const data = this.Pasajero_SolicitanteItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Solicitud_de_Vuelo = Folio;

      if (model.Folio === 0) {
        values = values + `(${model.Solicitud_de_Vuelo}, ${model.Pasajero}),`;
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPasajero_Solicitante = this.Pasajero_SolicitanteItemsByFolio(model.Folio);
        if (formPasajero_Solicitante.dirty) {
          // Update Pasajero Solicitante
          let response = await this.Detalle_Pasajeros_Solicitud_de_VueloService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Pasajero Solicitante
        this.Detalle_Pasajeros_Solicitud_de_VueloService.delete(model.Folio).toPromise();
      }
    });

    if(values != ''){
      this.brf.EvaluaQuery(`INSERT INTO Detalle_Pasajeros_Solicitud_de_Vuelo VALUES ${values.slice(0, -1)}`, 1, "ABC123");
    }

  }

  public selectPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo(event: MatAutocompleteSelectedEvent, element: any): void {

    if(this.pasajeroIsUsed) { return; }
    const index = this.dataSourcePasajero_Solicitante.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_VueloForm.controls.Detalle_Pasajeros_Solicitud_de_VueloItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Pasajero.setValue(event.option.value);
    this.displayFnPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo(element);
  }

  displayFnPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo(this, element) {
    const index = this.dataSourcePasajero_Solicitante.data.indexOf(element);
    return this.SelectedPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo[index];
  }

  updateOptionPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo(event, element: any) {
    const index = this.dataSourcePasajero_Solicitante.data.indexOf(element);
    this.SelectedPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo[index] = event.source.viewValue;
  }

  _filterPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo(filter: any): Observable<Pasajeros> {
    const where = filter !== '' ? "Pasajeros.Identificador_Alias like '%" + filter + "%'" : '';
    return this.PasajerosService.listaSelAll(0, 20, where);
  }

  addFilterToControlPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo = true;
        return this._filterPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo(value || '');
      })
    ).subscribe(result => {
      this.varPasajeros = result.Pasajeross;
      control.setValidators(this.validatorsHelper.autocompleteValidator(result.Pasajeross,"Clave"));
      this.isLoadingPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo = false;
      this.searchPasajero_Detalle_Pasajeros_Solicitud_de_VueloCompleted = true;
      this.SelectedPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo[index] = this.varPasajeros.length === 0 ? '' : this.SelectedPasajero_Detalle_Pasajeros_Solicitud_de_Vuelo[index];
    });
  }
  //#endregion

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Solicitud_de_VueloForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Spartan_UserService.getAll());

    observablesArray.push(this.Estatus_de_Solicitud_de_VueloService.getAll());
    observablesArray.push(this.Resultado_de_Autorizacion_de_VueloService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varSpartan_User, varEstatus_de_Solicitud_de_Vuelo, varResultado_de_Autorizacion_de_Vuelo]) => {
          //MOSTRAR SOLO ROLES DE Administrador del Sistema, Operaciones, Solicitante de Vuelo Y Presidencia
          this.varSpartan_User = varSpartan_User.filter(user => (user.Role == 9 || user.Role == 10 || user.Role == 12 || user.Role == 15 || user.Role == 30) && user.Status == 1);

          this.varEstatus_de_Solicitud_de_Vuelo = varEstatus_de_Solicitud_de_Vuelo;
          this.varResultado_de_Autorizacion_de_Vuelo = varResultado_de_Autorizacion_de_Vuelo.filter( x => x.Clave != 3 );

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    if(this.localStorageHelper.getLoggedUserInfo().RoleId == 12) {
      this.todayFechaSalida = new Date('1900-01-01');
    }

  }

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Solicitante': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }

      case 'Estatus': {
        this.Estatus_de_Solicitud_de_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Solicitud_de_Vuelo = x.Estatus_de_Solicitud_de_Vuelos;
        });
        break;
      }
      case 'Direccion_Usuario_Autorizacion': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Direccion_Resultado_Autorizacion': {
        this.Resultado_de_Autorizacion_de_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varResultado_de_Autorizacion_de_Vuelo = x.Resultado_de_Autorizacion_de_Vuelos;
        });
        break;
      }
      case 'Presidencia_Usuario_Autorizacion': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Presidencia_Resultado_Autorizacion': {
        this.Resultado_de_Autorizacion_de_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varResultado_de_Autorizacion_de_Vuelo = x.Resultado_de_Autorizacion_de_Vuelos;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnEmpresa_Solicitante(option: Cliente) {
    return option?.Razon_Social;
  }

  getDataToSave(entity: any) {
    entity.Fecha_de_Solicitud = this.Solicitud_de_VueloForm.get('Fecha_de_Solicitud').value;
    entity.Hora_de_Solicitud = this.Solicitud_de_VueloForm.get('Hora_de_Solicitud').value;
    entity.Direccion_fecha_autorizacion = this.Solicitud_de_VueloForm.get('Direccion_fecha_autorizacion').value;
    entity.Direccion_Hora_Autorizacion = this.Solicitud_de_VueloForm.get('Direccion_Hora_Autorizacion').value;
    entity.Direccion_Usuario_Autorizacion = this.Solicitud_de_VueloForm.get('Direccion_Usuario_Autorizacion').value;

    entity.Solicitante = this.model.Solicitante == null ? (entity.Solicitante == null ?
      this.Solicitud_de_VueloForm.get('Solicitante').value : entity.Solicitante) : this.model.Solicitante;

    entity.Presidencia_Fecha_Autorizacion = this.Solicitud_de_VueloForm.get('Presidencia_Fecha_Autorizacion').value;
    entity.Presidencia_Hora_Autorizacion = this.Solicitud_de_VueloForm.get('Presidencia_Hora_Autorizacion').value;
    entity.Presidencia_Usuario_Autorizacion = this.Solicitud_de_VueloForm.get('Presidencia_Usuario_Autorizacion').value;

    entity.Fecha_de_Regreso =  this.setFetchValue(this.Solicitud_de_VueloForm, 'Fecha_de_Regreso'); //this.model.Fecha_de_Regreso == "" ? entity.Fecha_de_Regreso : this.model.Fecha_de_Regreso;
    entity.Fecha_de_Salida = this.setFetchValue(this.Solicitud_de_VueloForm, 'Fecha_de_Salida'); // this.model.Fecha_de_Salida == "" ? entity.Fecha_de_Salida : this.model.Fecha_de_Salida;
    //entity.Hora_de_Regreso = this.model.Hora_de_Regreso == "" ? entity.Hora_de_Regreso : this.model.Hora_de_Regreso;
    entity.Hora_de_Regreso = this.Solicitud_de_VueloForm.get('Hora_de_Regreso').value;
    //entity.Hora_de_Salida = this.model.Hora_de_Salida == "" ? entity.Hora_de_Salida : this.model.Hora_de_Salida;  
    entity.Hora_de_Salida = this.Solicitud_de_VueloForm.get('Hora_de_Salida').value;
    //entity.Motivo_de_viaje = this.model.Motivo_de_viaje == "" ? entity.Motivo_de_viaje : this.model.Motivo_de_viaje;
    entity.Motivo_de_viaje = this.Solicitud_de_VueloForm.get('Motivo_de_viaje').value;
    entity.Numero_de_Vuelo = this.model.Numero_de_Vuelo == "" ? entity.Numero_de_Vuelo : this.model.Numero_de_Vuelo;
    //entity.Observaciones = this.model.Observaciones == "" ? entity.Observaciones : this.model.Observaciones;
    entity.Observaciones = this.Solicitud_de_VueloForm.get('Observaciones').value;
    //entity.Ruta_de_Vuelo = this.model.Ruta_de_Vuelo == "" ? entity.Ruta_de_Vuelo : this.model.Ruta_de_Vuelo;
    entity.Ruta_de_Vuelo = this.Solicitud_de_VueloForm.get('Ruta_de_Vuelo').value;
  }

  setFetchValue(formGroup: FormGroup, element: string){

    const today = formGroup.get(element).value;
    const pipe = new DatePipe('en-US')
    const control = formGroup.get(element)
    const ChangedFormat = pipe.transform(today, 'yyyy-MM-dd')
    const newDate = new Date(ChangedFormat + " 02:00");
    control?.setValue(newDate)
    return newDate;

  }

  async save() {

    if(this.isPasajeroOpen) {
      alert("Has dejado un renglón sin guardar Pasajero Solicitante");
      return false;
    }
    
    await this.saveData();
    if (this.localStorageHelper.getItemFromLocalStorage("Solicitud_de_VueloWindowsFloat") == "1") {
      this.localStorageHelper.setItemToLocalStorage("Solicitud_de_VueloWindowsFloat", "0");
      setTimeout(() => { window.close(); }, 8000);
    }
    else {
      this.goToList(1);
    }
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Solicitud_de_VueloForm.value;
      entity.Folio = this.model.Folio;
      entity.Empresa_Solicitante = this.Solicitud_de_VueloForm.get('Empresa_Solicitante').value.Clave;
      entity.Direccion_Resultado_Autorizacion = this.Solicitud_de_VueloForm.get('Direccion_Resultado_Autorizacion').value;
      entity.Direccion_Motivo_Rechazo = this.Solicitud_de_VueloForm.get('Direccion_Motivo_Rechazo').value;

      if (this.model.Folio > 0) {
        this.getDataToSave(entity);

        await this.Solicitud_de_VueloService.update(this.model.Folio, entity).toPromise();
        await this.saveDetalle_Pasajeros_Solicitud_de_Vuelo(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.idKeySave = this.model.Folio;
      } else {
        this.getDataToSave(entity);

        await (this.Solicitud_de_VueloService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Pasajeros_Solicitud_de_Vuelo(id);

          console.log('Fecha_de_Regreso: ', this.Solicitud_de_VueloForm.get('Fecha_de_Regreso').value , ' /  Fecha_de_Salida: ', this.Solicitud_de_VueloForm.get('Fecha_de_Salida').value);
          console.log('Fecha_de_Regreso C: ', entity.Fecha_de_Regreso , ' /  Fecha_de_Salida C: ', entity.Fecha_de_Salida);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          this.idKeySave = id;
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
      this.Solicitud_de_VueloForm.reset();
      this.model = new Solicitud_de_Vuelo(this.fb);
      this.Solicitud_de_VueloForm = this.model.buildFormGroup();
      this.dataSourcePasajero_Solicitante = new MatTableDataSource<Detalle_Pasajeros_Solicitud_de_Vuelo>();
      this.Pasajero_SolicitanteData = [];

    } else {
      this.router.navigate(['views/Solicitud_de_Vuelo/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;
  }

  onTabChanged(event) {
    const title = event.tab.title.normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim().replace(/ /g, '_');
    if (title == 'Autorizacion_Direccion_General') {
      if (this.operation == 'Update') {
        if (this.Solicitud_de_VueloForm.get('Estatus').value == this.brf.TryParseInt('2', '2')) {
          this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Direccion_Usuario_Autorizacion", this.localStorageHelper.getItemFromLocalStorage('USERID'));
          this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);
          this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);
          this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 0);
          this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
        }
      }
    }
    if (title == 'Autorizacion_Presidencia') {
      if (this.operation == 'Update') {
        if (this.Solicitud_de_VueloForm.get('Estatus').value == this.brf.TryParseInt('3', '3')) {

          this.brf.SetCurrentDateToField(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion");
          this.brf.SetCurrentHourToField(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion");
          this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion", this.localStorageHelper.getItemFromLocalStorage('USERID'));

          this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Fecha_Autorizacion', 0);
          this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Hora_Autorizacion', 0);
          this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Usuario_Autorizacion', 0);
        }
      }
    }
  }

  cancel() {
    if (this.localStorageHelper.getItemFromLocalStorage("Solicitud_de_VueloWindowsFloat") == "1") {
      this.localStorageHelper.setItemToLocalStorage("Solicitud_de_VueloWindowsFloat", "0");
      window.close();
    }
    else {
      this.goToList(0);
    }
  }

  goToList(option: any) { //option 0 : Cancelar | 1: Guardar

    let status = this.Solicitud_de_VueloForm.controls["Estatus"].value
    console.log(status)

    if (option == 0) {
      if (status == "") {
        status = 1
      }
      else if (status != 4) {
        status = parseInt(status) + 1
      }
    }

    //states = this.activatedRoute.paramMap.pipe(map(() => window.history.state))
    console.log(this.dataListConfig)
    console.log(this.phase)

    if(this.localStorageHelper.getItemFromLocalStorage('FromCalendar') == "Si"){
      this.localStorageHelper.setItemToLocalStorage("FromCalendar", "No");
      this.router.navigate([`/dashboard/main`]);
    }
    else{
      this.router.navigate([`/Solicitud_de_Vuelo/list/${status}`], { state: { data: this.dataListConfig } });
    }

    
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Fecha_de_Solicitud_ExecuteBusinessRules(): void {
    //Fecha_de_Solicitud_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Solicitud_ExecuteBusinessRules(): void {
    //Hora_de_Solicitud_FieldExecuteBusinessRulesEnd
  }
  
  async Solicitante_ExecuteBusinessRules() {
    const SolicitanteId = this.Solicitud_de_VueloForm.get('Solicitante').value;
    this.sqlModel.query = `SELECT STRING_AGG(Empresa, ',') from Creacion_de_Usuarios cu inner join Spartan_User su on su.Id_User = cu.Usuario_Registrado inner join Detalle_Empresas_Conf_Usuario decu on decu.Configuracion_de_usuarios = cu.Clave where su.Id_User = ${SolicitanteId}`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.ClienteService.listaSelAll(0, 20, "Cliente.Clave IN (" + response + ")").subscribe(result => {
          this.optionsEmpresa_Solicitante = of(result?.Clientes);

          if(this.operation != "New") {
            this.Solicitud_de_VueloForm.get('Empresa_Solicitante').setValue(result?.Clientes.filter( x => x.Clave == this.empresaSolicitanteEdit )[0], { onlySelf: true, emitEvent: false });
          }
          else{
            this.Solicitud_de_VueloForm.get('Empresa_Solicitante').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });
          }
          this.hasOptionsEmpresa_Solicitante = result?.Clientes?.length > 0;
        });
      }
    })

    //Solicitante_FieldExecuteBusinessRulesEnd
  }


  Empresa_Solicitante_ExecuteBusinessRules(): void {
    //Empresa_Solicitante_FieldExecuteBusinessRulesEnd
  }
  Motivo_de_viaje_ExecuteBusinessRules(): void {
    //Motivo_de_viaje_FieldExecuteBusinessRulesEnd
  }
  
  async Fecha_de_Salida_ExecuteBusinessRules(): Promise<void> {

    let fechaSalida = this.Solicitud_de_VueloForm.get('Fecha_de_Salida').value;
    let fechaRegreso = this.Solicitud_de_VueloForm.get('Fecha_de_Regreso').value;
    
    if(fechaSalida.toISOString().includes('+')) {
      this.Solicitud_de_VueloForm.get('Fecha_de_Salida').setValue('');
      return;
    }

    let fechaSalidaFormateada = fechaSalida.split != undefined && fechaSalida.split.length == 2 ? fechaSalida.split('T')[0] : fechaSalida.toISOString().split('T')[0];
    let fechaRegresoFormateada = fechaRegreso.split != undefined && fechaRegreso.split.length == 2 ? fechaRegreso.split('T')[0] : fechaRegreso.toISOString().split('T')[0];

    //INICIA - BRID:1425 - fecha de regreso es diferente de vacio y fecha de salida es mayor a fecha de regreso no dejar guardar.  - Autor: Neftali - Actualización: 3/30/2021 7:10:25 PM
    if (fechaRegreso != ""
      && await this.brf.EvaluaQueryAsync(`if ((select '${fechaRegresoFormateada}') < '${fechaSalidaFormateada}' )begin select 1 end`, 1, 'ABC123') == 
      this.brf.TryParseInt('1', '1')) {

        this.snackBar.open('Fecha regreso no debe ser menor a fecha salida.', '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success'
        });
        this.Solicitud_de_VueloForm.get('Fecha_de_Salida').reset();
    } 
    this.Hora_de_Salida_ExecuteBusinessRules();
    //TERMINA - BRID:1425

    //Fecha_de_Salida_FieldExecuteBusinessRulesEnd

  }

  async Hora_de_Salida_ExecuteBusinessRules(): Promise<void> {

    this.brf.SetFormatToHour(this.Solicitud_de_VueloForm, 'Hora_de_Salida', this.Solicitud_de_VueloForm.get('Hora_de_Salida').value);

    const fechaSalida = this.Solicitud_de_VueloForm.get('Fecha_de_Salida').value;
    const fechaRegreso = this.Solicitud_de_VueloForm.get('Fecha_de_Regreso').value;

    const horaSalida = this.Solicitud_de_VueloForm.get('Hora_de_Salida').value;
    const horaRegreso = this.Solicitud_de_VueloForm.get('Hora_de_Regreso').value;

    let horaSalidaParteHoras = horaSalida.substring(0, 2);
    let horaSalidaParteMinutos = horaSalida.substring(3, 5);

    let horaRegresoParteHoras = horaRegreso.substring(0, 2);
    let horaRegresoParteMinutos = horaRegreso.substring(3, 5);

    if(horaSalidaParteHoras == "" || horaSalidaParteMinutos == "") {
      this.Solicitud_de_VueloForm.get('Hora_de_Salida').setValue('');
      return;
    }

    fechaSalida.setHours(0, 0, 0, 0);
    fechaRegreso.setHours(0, 0, 0, 0);

    if (fechaSalida.getTime() == fechaRegreso.getTime()) {
      fechaSalida.setHours(horaSalidaParteHoras, horaSalidaParteMinutos, 0, 0);
      fechaRegreso.setHours(horaRegresoParteHoras, horaRegresoParteMinutos, 0, 0);
      if(horaRegreso != "") {
        if (fechaRegreso.getTime() <= fechaSalida.getTime()) {
          this.snackBar.open('Hora de regreso no puede ser menor a la hora de salida.', '', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'right',
            panelClass: 'success'
          });
          this.Solicitud_de_VueloForm.get('Hora_de_Salida').reset();
        }
      }
    }
    

    //Hora_de_Salida_FieldExecuteBusinessRulesEnd

  }

  async Fecha_de_Regreso_ExecuteBusinessRules(): Promise<void> {

    let fechaSalida = this.Solicitud_de_VueloForm.get('Fecha_de_Salida').value;
    let fechaRegreso = this.Solicitud_de_VueloForm.get('Fecha_de_Regreso').value;
    
    if(fechaRegreso.toISOString().includes('+')) {
      this.Solicitud_de_VueloForm.get('Fecha_de_Regreso').setValue('');
      return;
    }

    let fechaSalidaFormateada = fechaSalida.split != undefined && fechaSalida.split.length == 2 ? fechaSalida.split('T')[0] : fechaSalida.toISOString().split('T')[0];
    let fechaRegresoFormateada = fechaRegreso.split != undefined && fechaRegreso.split.length == 2 ? fechaRegreso.split('T')[0] : fechaRegreso.toISOString().split('T')[0];

    //INICIA - BRID:1181 - que la fecha de regreso no sea menor a la fecha de salida - Autor: Lizeth Villa - Actualización: 4/20/2021 1:19:35 PM
    if (fechaRegreso != "" 
        && await this.brf.EvaluaQueryAsync(`if ((select '${fechaRegresoFormateada}') < '${fechaSalidaFormateada}' )begin select 1 end`, 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {

      this.snackBar.open('Fecha regreso no debe ser menor a fecha salida', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
      this.Solicitud_de_VueloForm.get('Fecha_de_Regreso').reset();

    } else { }
    this.Hora_de_Regreso_ExecuteBusinessRules();
    //Fecha_de_Regreso_FieldExecuteBusinessRulesEnd

  }

  Hora_de_Regreso_ExecuteBusinessRules(): void {

    this.brf.SetFormatToHour(this.Solicitud_de_VueloForm, 'Hora_de_Regreso', this.Solicitud_de_VueloForm.get('Hora_de_Regreso').value);

    //INICIA - BRID:2292 - si la fecha de salida y fevha de regreso es el mismo dia,mostrar mensaje si la hora de regreso e smenor a la hora de salida.... - Autor: Ivan Yañez - Actualización: 3/30/2021 8:18:09 PM

    const fechaSalida = this.Solicitud_de_VueloForm.get('Fecha_de_Salida').value;
    const fechaRegreso = this.Solicitud_de_VueloForm.get('Fecha_de_Regreso').value;

    const horaSalida = this.Solicitud_de_VueloForm.get('Hora_de_Salida').value;
    const horaRegreso = this.Solicitud_de_VueloForm.get('Hora_de_Regreso').value;

    let horaSalidaParteHoras = horaSalida.substring(0, 2);
    let horaSalidaParteMinutos = horaSalida.substring(3, 5);

    let horaRegresoParteHoras = horaRegreso.substring(0, 2);
    let horaRegresoParteMinutos = horaRegreso.substring(3, 5);

    if(horaRegresoParteHoras == "" || horaRegresoParteMinutos == "") {
      this.Solicitud_de_VueloForm.get('Hora_de_Regreso').setValue('');
      return;
    }

    fechaSalida.setHours(0, 0, 0, 0);
    fechaRegreso.setHours(0, 0, 0, 0);

    if (fechaSalida.getTime() == fechaRegreso.getTime()) {
      fechaSalida.setHours(horaSalidaParteHoras, horaSalidaParteMinutos, 0, 0);
      fechaRegreso.setHours(horaRegresoParteHoras, horaRegresoParteMinutos, 0, 0);

      if (horaSalida != "" 
        && fechaRegreso.getTime() <= fechaSalida.getTime()) {
        this.snackBar.open('Hora de regreso no puede ser menor a la hora de salida.', '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success'
        });
        this.Solicitud_de_VueloForm.get('Hora_de_Regreso').reset();
      }
    }

    //TERMINA - BRID:2292

    //Hora_de_Regreso_FieldExecuteBusinessRulesEnd

  }
  Numero_de_Vuelo_ExecuteBusinessRules(): void {
    //Numero_de_Vuelo_FieldExecuteBusinessRulesEnd
  }
  Ruta_de_Vuelo_ExecuteBusinessRules(): void {
    //Ruta_de_Vuelo_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    //Observaciones_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  Tiempo_de_Vuelo_ExecuteBusinessRules(): void {
    //Tiempo_de_Vuelo_FieldExecuteBusinessRulesEnd
  }
  Tiempo_de_Espera_ExecuteBusinessRules(): void {
    //Tiempo_de_Espera_FieldExecuteBusinessRulesEnd
  }
  Espera_SIN_Cargo_ExecuteBusinessRules(): void {
    //Espera_SIN_Cargo_FieldExecuteBusinessRulesEnd
  }
  Espera_CON_Cargo_ExecuteBusinessRules(): void {
    //Espera_CON_Cargo_FieldExecuteBusinessRulesEnd
  }
  Pernoctas_ExecuteBusinessRules(): void {
    //Pernoctas_FieldExecuteBusinessRulesEnd
  }
  Tiempo_de_Calzo_ExecuteBusinessRules(): void {
    //Tiempo_de_Calzo_FieldExecuteBusinessRulesEnd
  }
  Internacional_ExecuteBusinessRules(): void {
    //Internacional_FieldExecuteBusinessRulesEnd
  }
  Direccion_fecha_autorizacion_ExecuteBusinessRules(): void {
    //Direccion_fecha_autorizacion_FieldExecuteBusinessRulesEnd
  }
  Direccion_Hora_Autorizacion_ExecuteBusinessRules(): void {
    //Direccion_Hora_Autorizacion_FieldExecuteBusinessRulesEnd
  }
  Direccion_Usuario_Autorizacion_ExecuteBusinessRules(): void {
    //Direccion_Usuario_Autorizacion_FieldExecuteBusinessRulesEnd
  }
  Direccion_Resultado_Autorizacion_ExecuteBusinessRules(): void {

    //INICIA - BRID:492 - Al seleccionar campo Resultado si es "Rechazado" en pestaña "Autorizacion Direccion General"* mostrar campo "Motivo de rechazo" y hacerlo obligatorio de lo contario ocultarlo - Autor: Lizeth Villa - Actualización: 3/29/2021 8:18:12 PM
    if (this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion') == this.brf.TryParseInt('2', '2')) {
      this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
    } else {
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
    }
    //TERMINA - BRID:492


    //INICIA - BRID:1219 - si el campo es autorizado=2 cambiar el estatus a por autotirzar presidencia=3 de lo contrario rechazado por presidencia=5 - Autor: Ivan Yañez - Actualización: 3/8/2021 2:07:16 AM
    if (this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion') == this.brf.TryParseInt('1', '1')) {
      this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Estatus", "3");
    }
    else {
      this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Estatus", "5");
      this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Estatus", "4");
    }
    //TERMINA - BRID:1219

    //Direccion_Resultado_Autorizacion_FieldExecuteBusinessRulesEnd


  }
  Direccion_Motivo_Rechazo_ExecuteBusinessRules(): void {
    //Direccion_Motivo_Rechazo_FieldExecuteBusinessRulesEnd
  }
  Presidencia_Fecha_Autorizacion_ExecuteBusinessRules(): void {
    //Presidencia_Fecha_Autorizacion_FieldExecuteBusinessRulesEnd
  }
  Presidencia_Hora_Autorizacion_ExecuteBusinessRules(): void {
    //Presidencia_Hora_Autorizacion_FieldExecuteBusinessRulesEnd
  }
  Vuelo_Reabierto_ExecuteBusinessRules(): void {
    //Vuelo_Reabierto_FieldExecuteBusinessRulesEnd
  }
  Presidencia_Usuario_Autorizacion_ExecuteBusinessRules(): void {
    //Presidencia_Usuario_Autorizacion_FieldExecuteBusinessRulesEnd
  }
  Tramos_ExecuteBusinessRules(): void {
    //Tramos_FieldExecuteBusinessRulesEnd
  }
  TuaNacionales_ExecuteBusinessRules(): void {
    //TuaNacionales_FieldExecuteBusinessRulesEnd
  }
  TuaInternacionales_ExecuteBusinessRules(): void {
    //TuaInternacionales_FieldExecuteBusinessRulesEnd
  }
  Presidencia_Resultado_Autorizacion_ExecuteBusinessRules(): void {

    //INICIA - BRID:493 - Al seleccionar campo Resultado si es "Rechazado" en pestaña "Autorizacion Presidencia"* mostrar campo "Motivo de rechazo" y hacerlo obligatorio de lo contario ocultarlo - Autor: Lizeth Villa - Actualización: 3/8/2021 3:42:19 PM
    if (this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion') != this.brf.TryParseInt('null', 'null')
      && this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion') == this.brf.TryParseInt('2', '2')) {
      this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
    }
    else {
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
    }
    //TERMINA - BRID:493


    //INICIA - BRID:1220 - si el resultado es autorizado=1 cambiar estatus a autorizado=6 de lo contrario a  rechazado por presidencia=5 - Autor: Ivan Yañez - Actualización: 3/8/2021 2:12:33 AM
    if (this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion') == this.brf.TryParseInt('1', '1')) {
      this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Estatus", "6");
    }
    else {
      this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Estatus", "5");
    }
    //TERMINA - BRID:1220

    //Presidencia_Resultado_Autorizacion_FieldExecuteBusinessRulesEnd


  }
  Presidencia_motivo_rechazo_ExecuteBusinessRules(): void {
    //Presidencia_motivo_rechazo_FieldExecuteBusinessRulesEnd
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

    this.setShowTab();

    //rulesOnInit_ExecuteBusinessRulesInit

    //INICIA - BRID:482 - En nuevo, modificar y consultar al abrir la pantalla:* Deshabilitar los campos Fecha de solicitud, Hora de Solicitud, Solicitante, Empresa Solicitante* Ocultar campo Estatus - Autor: Lizeth Villa - Actualización: 3/22/2021 12:14:25 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      const rolAutorize = [9,10,12,30]
      this.Solicitante_ExecuteBusinessRules();
      this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Solicitud', 0);
      this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Solicitud', 0);
      this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', rolAutorize.includes(this.localStorageHelper.getLoggedUserInfo().RoleId) ? 1 : 0);
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Estatus");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Estatus");
    }
    //TERMINA - BRID:482


    //INICIA - BRID:483 - En nuevo, al abrir la pantalla:* Asignar valores:Fecha de solicitud = fecha actualHora de Solicitud = hora actualSolicitante = usuario que entró al sistemaEmpresa Solicitante = empresa a la que esta suscrito el usuarioasignar Estatus = ""Por Ingresar Vuelo""* Ocultar pestañas ingreso de vuelo, autorizacion Direccion General, Autorizacion Presidencia* Y quitar obligatorio a todos lo - Autor: Lizeth Villa - Actualización: 3/29/2021 8:20:39 PM
    if (this.operation == 'New') {
      this.brf.SetCurrentDateToField(this.Solicitud_de_VueloForm, "Fecha_de_Solicitud");
      this.brf.SetCurrentHourToField(this.Solicitud_de_VueloForm, "Hora_de_Solicitud");
      this.Solicitud_de_VueloForm.controls["Solicitante"].setValue(this.UserId)
      this.Solicitante_ExecuteBusinessRules()

      this.brf.HideFolderNew("Ingreso_de_Vuelo");
      this.brf.HideFolderNew("Autorizacion_Direccion_General");
      this.brf.HideFolderNew("Autorizacion_Presidencia");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Numero_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Aeronave");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Observaciones_AEROVICS");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_fecha_autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Hora_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Usuario_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Resultado_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Resultado_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
    }
    //TERMINA - BRID:483


    //BRID:484 - En editar, al abrir la pantalla, si el estaus es "Por Autorizar Direccion General"*  //Mostar pestaña "Datos generales", "Ingreso de Vuelo" y "Autorizacion Direccion General"* Asignar valores:Fecha de autorización = fecha actualHora de autorización = hora actualUsuario que autoriza = usuario que entró al sistema* Deshabilitar los campos Fecha de autorización, Hora de autorización, Usuario - Autor: Lizeth Villa - Actualización: 3/22/2021 12:01:13 PM
    if (this.operation == 'Update') {
      if (this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Estatus') == this.brf.TryParseInt('2', '2')) {
        this.Solicitante_ExecuteBusinessRules();
        this.Solicitante_ExecuteBusinessRules();
        this.brf.ShowFolderNew("Autorizacion_Direccion_General"); this.brf.ShowFolderNew("Ingreso_de_Vuelo");

        this.brf.SetCurrentDateToField(this.Solicitud_de_VueloForm, "Direccion_fecha_autorizacion");
        this.brf.SetCurrentHourToField(this.Solicitud_de_VueloForm, "Direccion_Hora_Autorizacion");
        this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Direccion_Usuario_Autorizacion", this.localStorageHelper.getItemFromLocalStorage('USERID'))

        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 0);
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
      } else { }
    }
    //TERMINA - BRID:484


    //INICIA - BRID:485 - 7.-En editar, al abrir la pantalla, si el estatus es "Por Autorizar Presidencia"* Mostar pestaña "Datos generales", "Ingreso de Vuelo", "Autorizacion Direccion General", "Autorizacion Presidencia"* Asignar valores de pestaña "Autorizacion Presidencia"Fecha de autorización = fecha actualHora de autorización = hora actualUsuario que autoriza = usuario que entró al sistema* Deshabilitar - Autor: Lizeth Villa - Actualización: 5/14/2021 6:52:22 PM
    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Estatus') == this.brf.TryParseInt('3', '3')) {
        this.Solicitante_ExecuteBusinessRules();
        this.brf.ShowFolderNew("Ingreso_de_Vuelo");
        this.brf.ShowFolderNew("Autorizacion_Presidencia");

        //this.brf.SetValueFromQuery(this.Solicitud_de_VueloForm,"Presidencia_Fecha_Autorizacion",this.brf.EvaluaQuery(" select convert (varchar(11),getdate(),105)", 1, "ABC123"),1,"ABC123"); 
        //this.brf.SetValueFromQuery(this.Solicitud_de_VueloForm,"Presidencia_Hora_Autorizacion",this.brf.EvaluaQuery(" select convert (varchar(8),getdate(),108)", 1, "ABC123"),1,"ABC123"); 
        //this.brf.SetValueFromQuery(this.Solicitud_de_VueloForm,"Presidencia_Usuario_Autorizacion",this.brf.EvaluaQuery(" select GLOBAL[USERID]", 1, "ABC123"),1,"ABC123"); 

        this.brf.SetCurrentDateToField(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion");
        this.brf.SetCurrentHourToField(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion");
        this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion", this.localStorageHelper.getItemFromLocalStorage('USERID'))

        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Empresa_Solicitante', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Motivo_de_viaje', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Regreso', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitud_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Pasajero', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Ruta_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Aeronave', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Motivo_Rechazo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Fecha_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Usuario_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Enviar_a_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Salida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Regreso', 0);
        this.brf.ShowFolderNew("Autorizacion_Direccion_General");
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Motivo_Rechazo', 0);
      }
    }
    //TERMINA - BRID:485


    //INICIA - BRID:495 - Filtrar combo empresa solicitante. - Autor: Lizeth Villa - Actualización: 3/5/2021 10:42:34 AM
    if (this.operation == 'New' || this.operation == 'Update') {

    }
    //TERMINA - BRID:495


    //INICIA - BRID:755 - Fase 3 (Por autorizar dirección) - Autor: Felipe Rodríguez - Actualización: 3/3/2021 5:16:24 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select GLOBAL[Phase]", 1, 'ABC123') == this.brf.TryParseInt('3', '3')) {
        this.Solicitante_ExecuteBusinessRules();
        this.brf.ShowFolderNew("Datos_Generales");
        this.brf.ShowFolderNew("Ingreso_de_Vuelo");
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Empresa_Solicitante', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Motivo_de_viaje', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Regreso', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Pasajero_solicitante', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Ruta_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Enviar_a_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Aeronave', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Observaciones_AEROVICS', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Tramos_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Pasajeros', 0);
      }
    }
    //TERMINA - BRID:755


    //INICIA - BRID:881 - En modificacion al abrir la pantalla si el resultado de autorizacion presidencia es rechazado,mostrar y hacer obligatorio el motivo de rechazo de presidencia, de lo contrario ocultarlo. - Autor: Lizeth Villa - Actualización: 3/22/2021 12:01:19 PM
    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion') == this.brf.TryParseInt('1', '1')) {
        this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
      }
    }
    //TERMINA - BRID:881


    //INICIA - BRID:985 - Asignar no requerido campos Observaciones  - Autor: Lizeth Villa - Actualización: 3/22/2021 12:04:17 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Observaciones_AEROVICS");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Observaciones");
    }
    //TERMINA - BRID:985


    //INICIA - BRID:1162 - Deshabilitar campo - Autor: Lizeth Villa - Actualización: 3/22/2021 12:01:03 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Folio', 0);
    }
    //TERMINA - BRID:1162


    //INICIA - BRID:1214 - En nuevo ovultar pestaña autorizacion direccion general y autorizacion presidencia,tambien asignar los campos como no requeridos. - Autor: Lizeth Villa - Actualización: 3/29/2021 8:20:47 PM
    if (this.operation == 'New') {
      this.Solicitante_ExecuteBusinessRules();
      this.brf.HideFolderNew("Autorizacion_Direccion_General");
      this.brf.HideFolderNew("Autorizacion_Presidencia");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_fecha_autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Hora_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Usuario_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Resultado_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Resultado_Autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
    }
    //TERMINA - BRID:1214


    //INICIA - BRID:1215 - en modificacion al abrir pantalla si el estatus es rechazado por direccion=4 o rechazado por presidencia=5, deshabilitar todos los campos. - Autor: Lizeth Villa - Actualización: 3/22/2021 12:00:48 PM
    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      //if(  EvaluaOperatorIn (this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Estatus'), this.brf.TryParseInt('4,5', '4,5') ) ) { this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Solicitud', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Solicitud', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Empresa_Solicitante', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Motivo_de_viaje', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Salida', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Regreso', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Ruta_de_Vuelo', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Observaciones', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Estatus', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Numero_de_Vuelo', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Aeronave', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Motivo_Rechazo', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Fecha_Autorizacion', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Hora_Autorizacion', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Usuario_Autorizacion', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_motivo_rechazo', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Enviar_a_autorizacion', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Salida', 0);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Regreso', 0);} else {}
    }
    //TERMINA - BRID:1215


    //INICIA - BRID:1217 - en modificar asignar no tequerido observaciones de las pestañas autorizacion - Autor: Lizeth Villa - Actualización: 3/22/2021 11:59:39 AM
    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Observaciones");
    }
    //TERMINA - BRID:1217


    //INICIA - BRID:1218 - al abir pantalla en neuvo y la fase sea igual a 2,asignar estauts por autorizar direccion general=2 - Autor: Lizeth Villa - Actualización: 3/22/2021 12:00:41 PM
    if (this.operation == 'New') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("select GLOBAL[Phase]", 1, 'ABC123') == this.brf.TryParseInt('2', '2')) {
        this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Estatus", "2");
      }
    }
    //TERMINA - BRID:1218


    //INICIA - BRID:1268 - En nuevo y modificar al abrir pantalla ocultar los campos, numero de vuelo,aeronave,,enviar a autorizacion y asignar no requerido	 - Autor: Lizeth Villa - Actualización: 3/22/2021 12:00:29 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Numero_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Numero_de_Vuelo");
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Aeronave");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Aeronave");
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Enviar_a_autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Enviar_a_autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Numero_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Aeronave");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Enviar_a_autorizacion");
    }
    //TERMINA - BRID:1268


    //INICIA - BRID:1269 - en nuevo si el rol es solicitante de vuelo cambiar estatus a por autorizar direccion general=2 - Autor: Lizeth Villa - Actualización: 3/22/2021 12:00:22 PM
    if (this.operation == 'New') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('15', '15')) {
        this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Estatus", "2");
      }
    }
    //TERMINA - BRID:1269


    //INICIA - BRID:1300 - en la fase rechazado por presidencia=4 mostrar pestañas de autorizacion., - Autor: Lizeth Villa - Actualización: 3/22/2021 12:00:15 PM
    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("select GLOBAL[Phase]", 1, 'ABC123') == this.brf.TryParseInt('4', '4')) {
        this.brf.ShowFolderNew("Autorizacion_Direccion_General"); this.brf.ShowFolderNew("Autorizacion_Presidencia");
      }
    }
    //TERMINA - BRID:1300


    //INICIA - BRID:1406 - en modificacion al abrir pantalla si la fase es editar=4 y los roles son de operaciones(11,12) habilitar los campos de la pestaña datos generales  y asignarlos como requeridos. - Autor: Lizeth Villa - Actualización: 3/22/2021 11:59:50 AM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[Phase]", 1, 'ABC123')==this.brf.TryParseInt('4', '4') &&  EvaluaOperatorIn (this.brf.EvaluaQuery("select GLOBAL[USERROLEID]", 1, 'ABC123'), this.brf.TryParseInt('11,12', '11,12') ) ) { this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Empresa_Solicitante', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Motivo_de_viaje', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Salida', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Regreso', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitud_de_Vuelo', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Pasajero', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Ruta_de_Vuelo', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Observaciones', 1); this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Empresa_Solicitante");this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Motivo_de_viaje");this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Fecha_de_Salida");this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Fecha_de_Regreso");this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Solicitud_de_Vuelo");this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Pasajero");this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Ruta_de_Vuelo"); this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Observaciones");this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Hora_de_Regreso"); this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Salida', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Regreso', 1);} else {}
    }
    //TERMINA - BRID:1406


    //INICIA - BRID:1961 - Enmodificacion si la fase es igual a 4 no autorizado por direccion general y el role es operacioens y asistente de operacioens habilitar datos de la pestaña datos generales. - Autor: Ivan Yañez - Actualización: 3/25/2021 12:40:08 PM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[Phase]", 1, 'ABC123')==this.brf.TryParseInt('4', '4') &&  EvaluaOperatorIn (this.brf.EvaluaQuery("select GLOBAL[USERROLEID]", 1, 'ABC123'), this.brf.TryParseInt('11,12', '11,12') ) ) { this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Empresa_Solicitante', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Salida', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Regreso', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitud_de_Vuelo', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Pasajero', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Ruta_de_Vuelo', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Observaciones', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Salida', 1);this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Regreso', 1); this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Motivo_de_viaje', 1);} else {}
    }
    //TERMINA - BRID:1961


    //INICIA - BRID:2036 - al abrir pantalla en modificación si la fase es por autorizar dirección =3y el role es gerente de operaciones=11, deshabilitar los campos de pestaña datos generales, ocultar pestaña autorización dirección general y asignar no  requerido resultado - Autor: Ivan Yañez - Actualización: 3/25/2021 2:50:37 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") == this.brf.TryParseInt('3', '3')
        && this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('11', '11')) {
        this.Solicitante_ExecuteBusinessRules();
        this.brf.HideFolderNew("Autorizacion_Direccion_General");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Resultado_Autorizacion");
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', 1);
      }
    }
    //TERMINA - BRID:2036


    //INICIA - BRID:2090 - en nuevo si la fase es por ingresar vuelo=2 y el Role es operaciones12 o admin del sistema 9, deshabilitar el campo solicitante, para que operaciones pueda escoger el solicitante. - Autor: Lizeth Villa - Actualización: 8/30/2021 5:10:47 PM
    if (this.operation == 'New') {
      if( this.localStorageHelper.getItemFromLocalStorage("QueryParam")==this.brf.TryParseInt('2', '2') && (this.localStorageHelper.getItemFromLocalStorage("QueryParam") == this.brf.TryParseInt('9', '9') || this.localStorageHelper.getItemFromLocalStorage("QueryParam") == this.brf.TryParseInt('12', '12') )) { 
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', 1);
      } else {}
    }
    //TERMINA - BRID:2090


    //INICIA - BRID:2091 - Deshabilitar solicitante si operaciones crea una solicitud - Autor: Francisco Javier Martínez Urbina - Actualización: 10/21/2021 4:09:43 PM
    if (this.operation == 'New') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('11', '11')
        || this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('12', '12')) {
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', 1);
      }
      else {
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', 0);
      }
    }
    //TERMINA - BRID:2091


    //INICIA - BRID:2092 - Al abrir la pantalla los campos Número de Vuelo, Aeronave y Enviar autorización no deben ser visibles - Autor: Lizeth Villa - Actualización: 3/29/2021 11:48:43 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Numero_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Numero_de_Vuelo");
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Aeronave");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Aeronave");
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Enviar_a_autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Enviar_a_autorizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Numero_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Aeronave");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Enviar_a_autorizacion");
    }
    //TERMINA - BRID:2092


    //INICIA - BRID:2142 - Al Editar si el estatus es rechazado por direccion general (4) se asigna estatus Por autorizar Direccion general (2) y el rol es Operaciones o auxiliar - Autor: ANgel Acuña - Actualización: 3/29/2021 6:25:01 PM
    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      //if( this.brf.EvaluaQuery("select GLOBAL[Phase]", 1, 'ABC123')==this.brf.TryParseInt('4', '4') &&  EvaluaOperatorIn (this.brf.EvaluaQuery("select GLOBAL[USERROLEID]", 1, 'ABC123'), this.brf.TryParseInt('11,12', '11,12') ) ) { this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Estatus", "2");} else {}
    }
    //TERMINA - BRID:2142

    //INICIA - BRID:2541 - FASE 5 (POR AUTORIZAR DIRECCIÓN) Y ROL DG MOSTRAR PESTAÑA PARA AUTORIZAR - Autor: Felipe Rodríguez - Actualización: 4/6/2021 5:24:33 PM

    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") == "5" && +this.localStorageHelper.getLoggedUserInfo().RoleId == 10) {
        this.brf.ShowFolderNew("Autorizacion_Direccion_General");
        this.brf.SetRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
      }
    }
    //TERMINA - BRID:2541


    //INICIA - BRID:2658 - por autorizar dirección  no debe permitir autorizar desde el rol operaciones - Autor: Felipe Rodríguez - Actualización: 4/12/2021 3:34:22 PM
    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('12', '12')) {
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Motivo_Rechazo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Fecha_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Usuario_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_motivo_rechazo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Motivo_Rechazo', 0);
      }
    }
    //TERMINA - BRID:2658


    //INICIA - BRID:2766 - Ocultar y asignar no requerido a campos tiempos de vuelo - Autor: Neftali - Actualización: 4/19/2021 12:44:00 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Tiempo_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Tiempo_de_Espera");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Espera_SIN_Cargo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Espera_CON_Cargo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Pernoctas");
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Tiempo_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Tiempo_de_Vuelo");
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Tiempo_de_Espera");
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Espera_SIN_Cargo");
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Espera_CON_Cargo");
      this.brf.HideFieldOfForm(this.Solicitud_de_VueloForm, "Pernoctas");
    }
    //TERMINA - BRID:2766


    //INICIA - BRID:2800 - REGLAS CUANDO EL ESTATUS ES POR AUTORIZAR DIRECCIÓN - Autor: Neftali - Actualización: 4/28/2021 6:48:00 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Estatus') == this.brf.TryParseInt('2', '2')) {
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Resultado_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Fecha_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Usuario_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_motivo_rechazo', 0);
        this.brf.ShowFolderNew("Autorizacion_Presidencia");
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_motivo_rechazo', 0);
      } else { }
    }
    //TERMINA - BRID:2800


    //INICIA - BRID:2836 - Con rol presidencia no deberia tener habilitados los campos de la autorización de direccion general y llena campos en presidencia - Autor: Lizeth Villa - Actualización: 5/14/2021 7:54:05 PM
    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('30', '30')) {
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Resultado_Autorizacion");
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Motivo_Rechazo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Fecha_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Usuario_Autorizacion', 0);
        this.brf.SetValueFromQuery(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion", this.brf.EvaluaQuery(" select convert (varchar(11),getdate(),105)", 1, "ABC123"), 1, "ABC123");
        this.brf.SetValueFromQuery(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion", this.brf.EvaluaQuery(" select GLOBAL[USERID]", 1, "ABC123"), 1, "ABC123");
        this.brf.SetValueFromQuery(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion", this.brf.EvaluaQuery(" select convert (varchar(8),getdate(),108)", 1, "ABC123"), 1, "ABC123");
      }
    }
    //TERMINA - BRID:2836


    //INICIA - BRID:2851 - Con rol DG cuando ya se autorizo por direccion general y al volver a entrar muestra la autorización de presidencia y los campos deben estar deshabilitados - Autor: Neftali - Actualización: 5/17/2021 2:14:32 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('10', '10')
        && this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Estatus') == this.brf.TryParseInt('3', '3')) {
        this.Solicitante_ExecuteBusinessRules();
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_motivo_rechazo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 0);
      }
    }
    //TERMINA - BRID:2851


    //INICIA - BRID:2852 - Rol presidencia no debe tener permisos de editar la solicitud los datos generales deben estar deshabilitados - Autor: Lizeth Villa - Actualización: 5/14/2021 7:35:45 PM
    if (this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('30', '30')) {
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Empresa_Solicitante', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Motivo_de_viaje', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Salida', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Regreso', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Salida', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Regreso', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Ruta_de_Vuelo', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Observaciones', 1);
      }
    }
    //TERMINA - BRID:2852


    //INICIA - BRID:3094 - mostrar pestaña de direccion general en estatus por autorizar presidencia  - Autor: Lizeth Villa - Actualización: 5/14/2021 4:28:41 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('30', '30') || this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Estatus') == this.brf.TryParseInt('3', '3')) {
        this.Solicitante_ExecuteBusinessRules();
        this.brf.ShowFolderNew("Autorizacion_Direccion_General");
        this.Solicitud_de_VueloForm.get('Numero_de_Vuelo').disable();
        this.Solicitud_de_VueloForm.get('Direccion_fecha_autorizacion').disable();
        this.Solicitud_de_VueloForm.get('Direccion_Hora_Autorizacion').disable();
        this.Solicitud_de_VueloForm.get('Direccion_Usuario_Autorizacion').disable();
        this.Solicitud_de_VueloForm.get('Direccion_Resultado_Autorizacion').disable();
        this.Solicitud_de_VueloForm.get('Direccion_Motivo_Rechazo').disable();
        /* this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Motivo_Rechazo', 0); */
      }
    }
    //TERMINA - BRID:3094


    //INICIA - BRID:3095 - mostrar pestaña de direccion general en estatus por autorizar presidencia por estatus - Autor: Lizeth Villa - Actualización: 5/14/2021 7:59:20 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('30', '30') && this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Estatus') == this.brf.TryParseInt('3', '3')) {
        this.Solicitante_ExecuteBusinessRules();
        this.brf.ShowFolderNew("Autorizacion_Direccion_General");
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Numero_de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Motivo_Rechazo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Fecha_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Hora_Autorizacion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Usuario_Autorizacion', 0);
      }
    }
    //TERMINA - BRID:3095


    //INICIA - BRID:5738 - Habilitar campos, si el estatus es reabierto - Autor: Lizeth Villa - Actualización: 9/3/2021 3:39:46 PM
    if (this.operation == 'Update') {
      if ((this.localStorageHelper.getLoggedUserInfo().RoleId == 9 || this.localStorageHelper.getLoggedUserInfo().RoleId == 12) 
      && this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = 209", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.Solicitante_ExecuteBusinessRules();
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Fecha_de_Solicitud', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Hora_de_Solicitud', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_fecha_autorizacion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Hora_Autorizacion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Usuario_Autorizacion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Direccion_Motivo_Rechazo', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Fecha_Autorizacion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Hora_Autorizacion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Usuario_Autorizacion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion', 1);
        this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Presidencia_motivo_rechazo', 1);
      }
    }
    //TERMINA - BRID:5738


    //INICIA - BRID:5789 - WF:3 Rule - Phase: 2 (Solicitar vuelo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") == '2') {
        this.brf.HideFolderNew("Autorizacion_Direccion_General"); this.brf.HideFolderNew("Autorizacion_Presidencia");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_fecha_autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Hora_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Usuario_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Resultado_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Resultado_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
      }
    }
    //TERMINA - BRID:5789


    //INICIA - BRID:5791 - WF:3 Rule - Phase: 3 (Por Autorizar dirección) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") == '3') {
        this.brf.HideFolderNew("Autorizacion_Presidencia");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Resultado_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
      } else { }

      if ((this.operation == 'Consult' || this.operation == 'Update') && this.localStorageHelper.getLoggedUserInfo().RoleId == 10) {
        this.Solicitante_ExecuteBusinessRules();
        this.brf.HideFolderNew("Autorizacion_Presidencia");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Resultado_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
      }

    }
    //TERMINA - BRID:5791


    //INICIA - BRID:5793 - WF:3 Rule - Phase: 4 (No Autorizada por Dirección) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") == '4') {
        this.brf.HideFolderNew("Autorizacion_Presidencia");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Fecha_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Hora_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Usuario_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_Resultado_Autorizacion");
        this.brf.SetNotRequiredControl(this.Solicitud_de_VueloForm, "Presidencia_motivo_rechazo");
      }
    }
    //TERMINA - BRID:5793


    //INICIA - BRID:5795 - WF:3 Rule - Phase: 5 (Por Autorizar Presidencia) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getItemFromLocalStorage("QueryParam") == '5') {
        this.brf.SetDisabledToMRControl(this.Solicitud_de_VueloForm, "Direccion_fecha_autorizacion");
        this.brf.SetDisabledToMRControl(this.Solicitud_de_VueloForm, "Direccion_Hora_Autorizacion");
        this.brf.SetDisabledToMRControl(this.Solicitud_de_VueloForm, "Direccion_Usuario_Autorizacion");
        this.brf.SetDisabledToMRControl(this.Solicitud_de_VueloForm, "Direccion_Resultado_Autorizacion");
        this.brf.SetDisabledToMRControl(this.Solicitud_de_VueloForm, "Direccion_Motivo_Rechazo");
      }
    }
    //TERMINA - BRID:5795


    //INICIA - BRID:5797 - WF:3 Rule - Phase: 6 (No Autorizado) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '6'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:5797


    //INICIA - BRID:5799 - WF:3 Rule - Phase: 1 (Solicitar Vuelo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '1'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:5799


    //INICIA - BRID:5801 - WF:3 Rule - Phase: 7 (Autorizados) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '7'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:5801


    //INICIA - BRID:5803 - WF:3 Rule - Phase: 8 (En Proceso de Autorización) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '8'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:5803


    //INICIA - BRID:5805 - WF:3 Rule - Phase: 9 (Gestión de Vuelo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '9'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:5805


    //INICIA - BRID:5807 - WF:3 Rule - Phase: 10 (Vuelo Cerrado) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '10'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:5807


    //INICIA - BRID:5809 - WF:3 Rule - Phase: 11 (Cierre de Vuelo por Corregir) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '11'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:5809


    //INICIA - BRID:5811 - WF:3 Rule - Phase: 12 (Cierre de Vuelo por Autorizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '12'", 1, 'ABC123')) { }
    }
    //TERMINA - BRID:5811


    //INICIA - BRID:6305 - Filtrar solicitantes solo con rol Solicitante, Presidencia - Autor: Francisco Javier Martínez Urbina - Actualización: 10/21/2021 4:13:10 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.Solicitante_ExecuteBusinessRules();
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('12', '12')) { } else { }
    }
    //TERMINA - BRID:6305


    if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('1', '1')
      || this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('9', '9')) {
      this.brf.SetEnabledControl(this.Solicitud_de_VueloForm, 'Solicitante', 1);
    }

    //rulesOnInit_ExecuteBusinessRulesEnd


  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:1910 - Enviar correo a dirección general y operaciones - Autor: Lizeth Villa - Actualización: 3/26/2021 12:48:25 PM
    if (this.operation == 'New') {
      //this.brf.SendEmailQueryPrintFormat("VICS - Solicitud de Vuelo", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where Role in (10,11,12) for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "'<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>A quien corresponda, </p> <p>Se ha realizado una nueva solicitud de vuelo  para el día '+ EvaluaQuery("SET LANGUAGE spanish;  SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio =GLOBAL[keyvalueinserted]")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio =GLOBAL[keyvalueinserted]),105)")+ ', con la siguiente ruta de vuelo: FLD[Ruta_de_Vuelo] </p> <p>Solicitado por: FLDD[Solicitante]</p> <p>Gracias y Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div></center></td></tr></table></body></html>'",32,EvaluaQuery("select FLDD[lblFolio]", 1, "ABC123"));
    }
    //TERMINA - BRID:1910


    //INICIA - BRID:2064 - Al dar de alta una nueva solicitud de vuelo, después de guardar, insertar la coordinación del vuelo - Autor: Ivan Yañez - Actualización: 3/25/2021 9:25:22 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(" exec uspGeneraCoordinacionVuelo " + this.idKeySave, 1, "ABC123");
    }
    //TERMINA - BRID:2064


    //INICIA - BRID:2087 - Se envia correo a presidencia cuando dirección general aprueba una solicitud - Autor: Lizeth Villa - Actualización: 3/30/2021 11:22:06 AM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[USERROLEID]", 1, 'ABC123')==this.brf.TryParseInt('10', '10') && this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion')==this.brf.TryParseInt('1', '1') ) { this.brf.SendEmailQueryPrintFormat("VICS - Solicitud de Vuelo", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where Role in (30,11,12) for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>A quien corresponda: </p> <p>Se ha realizado una nueva solicitud de vuelo para el día '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio =FLDD[lblFolio] ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio =FLDD[lblFolio]),105)")+ ', con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo] </p> <p>Solicitado por FLDD[Solicitante]</p> <p>Gracias y Saludos.</p> <p>Atentamente.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	",32,EvaluaQuery("select FLDD[lblFolio]", 1, "ABC123"));} else {}
    }
    //TERMINA - BRID:2087


    //INICIA - BRID:2088 - Enviar correo de recibo exitoso de solicitud a solicitante  - Autor: Lizeth Villa - Actualización: 3/29/2021 8:50:16 AM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Estatus')==this.brf.TryParseInt('2', '2') ) { this.brf.SendEmailQuery("VICS - Solicitud de Vuelo", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where id_user = FLD[Solicitante] for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado (a) (Solicitante autorizado)</p> <p>Has ingresado correctamente tu solicitud de vuelo para el día '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = GLOBAL[keyvalueinserted]")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = GLOBAL[keyvalueinserted]),105)")+ ', con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo].</p> <p>Gracias y Saludos.</p> <p>Atentamente.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	");} else {}
    }
    //TERMINA - BRID:2088

    //INICIA - BRID:2089 - Se envía correo de recibo exitoso de solicitud a solicitante  de vuelo - Autor: Lizeth Villa - Actualización: 3/29/2021 8:58:19 AM
    if (this.operation == 'New') {
      if( this.localStorageHelper.getLoggedUserInfo().RoleId==11|| this.localStorageHelper.getLoggedUserInfo().RoleId==12) { 

        let folio = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted);
        let fecha = await this.brf.EvaluaQueryAsync(`SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = ${folio}`, 1, "ABC123");
        let fecha2 = await this.brf.EvaluaQueryAsync(`select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = ${folio}),105)`, 1, "ABC123");
        this._SpartanService.SendEmailQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where id_user = "+
          this.Solicitud_de_VueloForm.get('Solicitante').value+" for XML PATH('')	), 1, 1, '')", 1, "ABC123", "VICS - Solicitud de Vuelo", 
          `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"><meta http-equiv="X-UA-Compatible" content="IE=edge"><title>EmailTemplate-Fluid</title><style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style></head><body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"><table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"><tr><td><center style="width: 100%;"><!-- Visually Hidden Preheader Text : BEGIN --><div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div><!-- Visually Hidden Preheader Text : END --><div style="max-width: 600px;"><!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--><!-- Email Header : BEGIN --><table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"><tr><td width="40">&nbsp;</td><td width="260"><img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"/><td>&nbsp;</td><td width="40">&nbsp;</td></tr><tr><td width="40">&nbsp;</td><td width="260" style="border-top: 2px solid #325396">&nbsp;</td><td style="border-top: 2px solid #8FBFFE">&nbsp;</td><td width="40">&nbsp;</td></tr></table><!-- Email Header : END --><!-- Email Body : BEGIN --><table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"><!-- 1 Column Text : BEGIN --><tr><td><table cellspacing="0" cellpadding="0" border="0" width="100%"><tr><td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> ` +          `<p>Estimado (a) (Solicitante autorizado)</p><p>Has ingresado correctamente tu solicitud de vuelo para el día ${fecha}, ${fecha2}, con la siguiente ruta de vuelo ${this.Solicitud_de_VueloForm.get('Ruta_de_Vuelo').value}.</p><p>Gracias y Saludos.</p><p>Atentamente.</p></td></tr></table></td></tr><!-- 1 Column Text : BEGIN --></table><!-- Email Body : END --><!-- Email Footer : BEGIN --><table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"><tr><td width="40">&nbsp;</td><td width="40" align="right" valign="middle"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"><path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path></svg></td><td width="5">&nbsp;</td><td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td><td width="40">&nbsp;</td></tr></table><table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"><tr><td style="padding-top: 40px;"/></tr><tr><td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp;</td></tr></table><!-- Email Footer : END --><!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--></div></center></td></tr></table></body></html>`);
          } else {}
    
      }
    //TERMINA - BRID:2089


    //INICIA - BRID:2141 - Dirección General rechaza, le debe llegar un correo a Auxiliar de Operaciones con el rechazo. - Autor: Lizeth Villa - Actualización: 3/29/2021 6:11:59 PM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[USERROLEID]", 1, 'ABC123')==this.brf.TryParseInt('10', '10') && this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion')==this.brf.TryParseInt('2', '2') ) { this.brf.SendEmailQuery("VICS - Solicitud de vuelo NO Autorizada", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where Role in (11, 12) for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Para hacer de su conocimiento que la solicitud de vuelo por FLDD[Solicitante] para el día '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = FLDD[lblFolio] ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = FLDD[lblFolio]),105)")+ ' con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo] no fue autorizada por el motivo: FLDD[Direccion_Motivo_Rechazo] </p> <p>Favor de realizar las correcciones requeridas.</p> <p>Gracias y Saludos.</p> <p>Atentamente.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	");} else {}
    }
    //TERMINA - BRID:2141


    //INICIA - BRID:2143 - Auxiliar de Operaciones debe corregir y al guardar se vuelve a enviar a que lo autorice la dirección, le debe llegar correo a Dirección General, en el correo debe ir adjunto el formato de solicitud de vuelo. - Autor: Francisco Javier Martínez Urbina - Actualización: 3/30/2021 1:15:40 PM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[USERROLEID]", 1, 'ABC123')==this.brf.TryParseInt('11', '11') || this.brf.EvaluaQuery("select GLOBAL[USERROLEID]", 1, 'ABC123')==this.brf.TryParseInt('12', '12') ) { this.brf.SendEmailQueryPrintFormat("VICS - Solicitud de Vuelo", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where Role = 10 for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>A quien corresponda: </p> <p>Se ha realizado una nueva solicitud de vuelo para el día '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio =GLOBAL[keyvalueinserted]")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio =GLOBAL[keyvalueinserted]),105)")+ ', con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo] </p> <p>Solicitado por FLDD[Solicitante]</p> <p>Gracias y Saludos.</p> <p>Atentamente.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	",32,EvaluaQuery("select FLDD[lblFolio]", 1, "ABC123"));} else {}
    }
    //TERMINA - BRID:2143


    //INICIA - BRID:2349 - en neuvo despues de guardar actualizar  las pantallas de coordinacion de la solciitud de vuelo, campos ruta de vuelo y fecha y hora de salida. - Autor: Ivan Yañez - Actualización: 3/31/2021 12:48:20 PM
    if (this.operation == 'Update') {
      this._SpartanService.SetValueExecuteQueryFG(" exec usUpdateCoordinacionVuelo " + this.Solicitud_de_VueloForm.get('Folio').value, 1, "ABC123");
    }
    //TERMINA - BRID:2349


    //INICIA - BRID:2355 - en modificacion despues de guardar actualizar fecha de salida y hora de salida en el pimer tramo registrado en registro de tramo de solicitud de vuelo - Autor: Ivan Yañez - Actualización: 3/31/2021 2:31:19 PM
    if (this.operation == 'Update') {
      this._SpartanService.SetValueExecuteQueryFG("  exec uspUpdateFechaYhoraRegistrodeVuelo " + this.Solicitud_de_VueloForm.get('Folio').value, 1, "ABC123");
    }
    //TERMINA - BRID:2355


    //INICIA - BRID:2443 - ROL OPERACIONES MANDAR A ETAPA "POR AUTORIZAR DIRECCIÓN" AL GUARDAR EN NUEVO - Autor: Lizeth Villa - Actualización: 4/12/2021 12:25:16 PM
    if (this.operation == 'New') {
      this._SpartanService.SetValueExecuteQueryFG("UPDATE Solicitud_de_Vuelo SET ESTATUS = 2 WHERE FOLIO = " + this.idKeySave, 1, "ABC123");
    }
    //TERMINA - BRID:2443


    //INICIA - BRID:4987 - INSERTAR REGISTRO DE COMISARIATO Y NOTAS DE VUELO - Autor: Felipe Rodríguez - Actualización: 8/25/2021 3:35:04 PM
    if (this.operation == 'New') {
      this._SpartanService.SetValueExecuteQueryFG("EXEC insertComisariatoYNotasDeVuelo " + this.idKeySave, 1, "ABC123");
    }
    //TERMINA - BRID:4987


    //INICIA - BRID:5562 - Push Notificacion Se envia correo a presidencia cuando dirección general aprueba una solicitud									 - Autor: ANgel Acuña - Actualización: 9/6/2021 7:08:22 PM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[USERROLEID]@LC@@LB@ ", 1, 'ABC123')==this.brf.TryParseInt('10', '10') && this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Direccion_Resultado_Autorizacion')==this.brf.TryParseInt('1', '1') ) { this.brf.SendNotificationPush(this.brf.EvaluaQuery("select 'AEROVICS - solicitud de Vuelo'", ""ABC123""), this.brf.EvaluaQuery("select STUFF(( select ',' + CONVERT(VARCHAR(20), id_user) + '' from Spartan_User where Role in (30,11,12) for XML PATH('') ), 1, 1, '')@LC@@LB@ ", 1, "ABC123") ,this.brf.EvaluaQuery("select '{\"id\":\"FLD[Numero_de_Vuelo]\"}'", 1, "ABC123"), this.brf.EvaluaQuery("select 'Se ha realizado una nueva solicitud de vuelo para el día '") + EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio =FLDD[lblFolio] ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio =FLDD[lblFolio]),105)")+ EvaluaQuery("select ', con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo]. Solicitado por FLDD[Solicitante]. Gracias y Saludos'", 1, "ABC123"),"5");} else {}
    }
    //TERMINA - BRID:5562


    //INICIA - BRID:5585 - Notificacion Push - En Operaciones se envia Notificacion a direccion principal y a solictante - Autor: ANgel Acuña - Actualización: 9/6/2021 7:10:01 PM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[USERROLEID]", 1, 'ABC123')==this.brf.TryParseInt('12', '12') ) { this.brf.SendNotificationPush(this.brf.EvaluaQuery("select 'AEROVICS - Solicitud de Vuelo'", ""ABC123""), this.brf.EvaluaQuery("select STUFF(( select ',' + CONVERT(VARCHAR(20), id_user) + '' from Spartan_User where id_user = FLD[Solicitante] or role = 10 for XML PATH('') ), 1, 1, '')", 1, "ABC123") ,this.brf.EvaluaQuery("select '{\"id\":\"FLD[Numero_de_Vuelo]\"}'", 1, "ABC123"), this.brf.EvaluaQuery("select 'Se ha realizado una nueva solicitud de vuelo para el día '")+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio =GLOBAL[keyvalueinserted]")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio =GLOBAL[keyvalueinserted]),105)")+ EvaluaQuery("select ', con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo], Solicitado por FLDD[Solicitante]'", 1, "ABC123"),"5");} else {}
    }
    //TERMINA - BRID:5585


    //INICIA - BRID:5587 - Notificacion Push Enviar notificacion a dirección general y operaciones - Autor: ANgel Acuña - Actualización: 9/6/2021 7:10:00 PM
    if (this.operation == 'New') {
      //this.brf.SendNotificationPush(this.brf.EvaluaQuery("select 'AEROVICS - Solicitud de Vuelo'", ""ABC123""), this.brf.EvaluaQuery("select STUFF(( select ',' + CONVERT(VARCHAR(20), id_user)+ '' from Spartan_User where Role in (10,11,12) for XML PATH('') ), 1, 1, '')", 1, "ABC123") ,this.brf.EvaluaQuery("select '{\"id\":\"FLD[Numero_de_Vuelo]\"}'", 1, "ABC123"), this.brf.EvaluaQuery("select 'Se ha realizado una nueva solicitud de vuelo para el día '")+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio =GLOBAL[keyvalueinserted]")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio =GLOBAL[keyvalueinserted]),105)")+ EvaluaQuery("select ', con la siguiente ruta de vuelo: FLD[Ruta_de_Vuelo], Solicitado por: FLDD[Solicitante]'", 1, "ABC123"),"5");
    }
    //TERMINA - BRID:5587


    //INICIA - BRID:6112 - Actualizar solicitante si el vuelo es reabierto  - Autor: Lizeth Villa - Actualización: 9/9/2021 8:06:56 PM
    if (this.operation == 'Update') {
      if ((this.localStorageHelper.getLoggedUserInfo().RoleId == 9 || this.localStorageHelper.getLoggedUserInfo().RoleId == 12)
        && this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = " + this.idKeySave, 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.EvaluaQuery("update Registro_de_vuelo set Solicitante = "+ this.Solicitud_de_VueloForm.get('Solicitante').value +" where no_vuelo = " + this.idKeySave, 1, "ABC123");
        this.brf.EvaluaQuery(" update Registro_de_vuelo set Cliente = "+ this.Solicitud_de_VueloForm.get('Empresa_Solicitante').value+" where no_vuelo = " + this.idKeySave, 1, "ABC123");
      }
    }
    //TERMINA - BRID:6112

    //rulesAfterSave_ExecuteBusinessRulesEnd


  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:1545 - Asignar Numero de Vuelo - Autor: Lizeth Villa - Actualización: 3/23/2021 9:41:23 AM
    if (this.operation == 'New') {

      this._SpartanService.SetValueExecuteQuery(this.Solicitud_de_VueloForm, "Numero_de_Vuelo", " exec uspGenerarNumeroVuelo", 1, "ABC123");
    }
    //TERMINA - BRID:1545


    //INICIA - BRID:2076 - Enviar correo de presidencia al rechazar - Autor: Lizeth Villa - Actualización: 4/20/2021 12:17:22 PM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[USERROLEID]@LC@@LB@ ", 1, 'ABC123')==this.brf.TryParseInt('30', '30') && this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion')==this.brf.TryParseInt('2', '2') ) { this.brf.SendEmailQuery("VICS - Solicitud de Vuelo", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where id_user = FLD[Solicitante]  for XML PATH('')	), 1, 1, '')", 1, "ABC123"), " <!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado (a) FLDD[Solicitante]</p> <p>Para hacer de su conocimiento que la solicitud de vuelo para el día ' + EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = FLDD[lblFolio] ") + ', ' + EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = FLDD[lblFolio]),105)") + ' con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo] no fue autorizada.</p> <p>Gracias y Saludos,</p> <p>Atentamente.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>"); this.brf.SendEmailQuery("VICS - Solicitud de Vuelo", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where Role in (11,12) for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>A quien corresponda, </p> <p>Para hacer de su conocimiento que la solicitud realizada por FLDD[Solicitante] para el día '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = FLDD[lblFolio] ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = FLDD[lblFolio]),105)")+ ' con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo] no fue autorizada.</p> <p>Gracias y Saludos.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	");} else {}
    }
    //TERMINA - BRID:2076


    //INICIA - BRID:2086 - Enviar correo desde presidencia cuando atoriza - Autor: Lizeth Villa - Actualización: 4/20/2021 12:32:28 PM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[USERROLEID]", 1, 'ABC123')==this.brf.TryParseInt('30', '30') && this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion')==this.brf.TryParseInt('1', '1') ) { this.brf.SendEmailQuery("VICS - Solicitud de Vuelo", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where id_user = FLD[Solicitante] for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png"width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado (a) FLDD[Solicitante]</p> <p>Para hacer de su conocimiento que la solicitud de vuelo para el día '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = FLDD[lblFolio] ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = FLDD[lblFolio]),105)")+ ' con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo] fue autorizada.</p> <p>Gracias y Saludos,</p> <p>Atentamente.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	"); this.brf.SendEmailQuery("VICS - Solicitud de Vuelo	", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + ''	from Spartan_User where Role in (10,11,12) for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"><img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"></td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>A quien corresponda, </p> <p>Para hacer de su conocimiento que la solicitud realizada por FLDD[Solicitante] para el día '+ EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = FLDD[lblFolio] ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = FLDD[lblFolio]),105)")+ ' con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo] fue autorizada.</p> <p>Gracias y Saludos.</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" align="right" valign="middle"> <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" style="fill:#325396; transform:;-ms-filter:;"> <path d="M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z"> </path> </svg> </td> <td width="5">&nbsp;</td> <td><p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p></td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	");} else {}
    }
    //TERMINA - BRID:2086


    //INICIA - BRID:2347 - en nuevo y modificacion antes de guardar, si la fecha de salida y fecha de regreso es el mismo dia, no dejar guardar en hora de regreso una hora anterior a la hora de salida. - Autor: Ivan Yañez - Actualización: 3/30/2021 11:04:53 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_Regreso]', 105))= convert(date, 'FLD[Fecha_de_Salida]',105) )begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1') && this.brf.EvaluaQuery("if ('2021-03-07'+' '+ 'FLD[Hora_de_Regreso]'+':00.000'<= '2021-03-07'+' '+ 'FLD[Hora_de_Salida]'+':00.000' )begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.ShowMessage("Hora de regreso no puede ser menor a la hora de salida.");

        result = false;
      } else { }
    }
    //TERMINA - BRID:2347


    //INICIA - BRID:2771 - Fecha regreso no debe ser menor a fecha salida - Autor: Lizeth Villa - Actualización: 4/20/2021 12:47:26 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_Regreso]', 105))< convert(date, 'FLD[Fecha_de_Salida]',105) )begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.ShowMessage(" Fecha regreso no debe ser menor a fecha salida");

        result = false;
      } else { }
    }
    //TERMINA - BRID:2771


    //INICIA - BRID:2784 - Fecha de salida no debe ser menor a actual - Autor: Neftali - Actualización: 4/26/2021 7:08:21 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_Salida]', 105)) < Convert(DateTime, DATEDIFF(DAY, 0, GETDATE())) )begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1') && this.localStorageHelper.getLoggedUserInfo().RoleId != this.brf.TryParseInt('12', '12')) {
        this.brf.ShowMessage(" La fecha de salida no puede ser menor a la fecha actual");

        result = false;
      }
    }
    //TERMINA - BRID:2784


    //INICIA - BRID:5556 - Push Notification - Presidencia autoriza  - Autor: ANgel Acuña - Actualización: 9/6/2021 7:09:59 PM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("select GLOBAL[USERROLEID]@LC@@LB@ ", 1, 'ABC123')==this.brf.TryParseInt('30', '30') && this.brf.GetValueByControlType(this.Solicitud_de_VueloForm, 'Presidencia_Resultado_Autorizacion')==this.brf.TryParseInt('1', '1') ) { this.brf.SendNotificationPush(this.brf.EvaluaQuery("select 'AEROVICS - Solicitud de Vuelo'", ""ABC123""), this.brf.EvaluaQuery("select STUFF(( select ',' + CONVERT(VARCHAR(20), id_user)  + '' from Spartan_User  where id_user = FLD[Solicitante] for XML PATH('') ), 1, 1, '')", 1, "ABC123") ,this.brf.EvaluaQuery("select '{\"id\":\"FLD[Numero_de_Vuelo]\"}'", 1, "ABC123"), this.brf.EvaluaQuery("select 'Estimado (a) FLDD[Solicitante]. Para hacer de su conocimiento que la solicitud de vuelo para el día '") + EvaluaQuery("SET LANGUAGE spanish; SELECT DATENAME(weekday, Fecha_de_Salida) AS nombreDia from Solicitud_de_Vuelo where folio = FLDD[lblFolio] ")+', '+ EvaluaQuery("select convert (varchar(11),(select Fecha_de_Salida from Solicitud_de_Vuelo where folio = FLDD[lblFolio]),105)")+ EvaluaQuery("select ' con la siguiente ruta de vuelo FLD[Ruta_de_Vuelo] fue autorizada.'", 1, "ABC123"),"5");} else {}
    }
    //TERMINA - BRID:5556


    //INICIA - BRID:7090 - Asignar valor "Por Autorizar Direccion General" al estatus antes de guardar. - Autor: Aaron - Actualización: 10/15/2021 5:29:14 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.localStorageHelper.getLoggedUserInfo().RoleId == this.brf.TryParseInt('12', '12')) {
        this.brf.SetValueControl(this.Solicitud_de_VueloForm, "Estatus", "2");
      }
    }
    //TERMINA - BRID:7090

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //@@End.Keep.Implementation('//Fin de reglas')

  //Fin de reglas

  //#region Asignar que Pestañas se Muestran
  setShowTab() {
    if (this.consult) {
      this.showTab = {
        "Datos_Generales": true, "Autorizacion_Direccion_General": true, "Autorizacion_Presidencia": true,
        "Datos_Generales_2": true, "Autorizacion_Presidencia_2": true, "Datos_Generales_3": true, "Autorizacion_Presidencia_3": true
      }
    }

    //Rol de direccion: 10 - debe mostrar solo pestañas de Datos Generales, Autorizacion direccion general y autorizacion presidencia
    if (this.RoleId == 10) {
      this.showTab = {
        "Datos_Generales": true, "Autorizacion_Direccion_General": true, "Autorizacion_Presidencia": true,
        "Datos_Generales_2": false, "Autorizacion_Presidencia_2": false, "Datos_Generales_3": false, "Autorizacion_Presidencia_3": false
      }
    }

  }
  //#endregion


}
