import { AfterViewInit, Component, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, ValidatorFn, AbstractControl } from '@angular/forms';
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
import { startWith, debounceTime, map, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { GeneralService } from 'src/app/api-services/general.service';
import { Coordinacion_HandlingService } from 'src/app/api-services/Coordinacion_Handling.service';
import { Coordinacion_Handling } from 'src/app/models/Coordinacion_Handling';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Detalle_Coordinacion_HandlingService } from 'src/app/api-services/Detalle_Coordinacion_Handling.service';
import { Detalle_Coordinacion_Handling } from 'src/app/models/Detalle_Coordinacion_Handling';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { Estatus_de_ConfirmacionService } from 'src/app/api-services/Estatus_de_Confirmacion.service';
import { Estatus_de_Confirmacion } from 'src/app/models/Estatus_de_Confirmacion';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { ValidatorsHelper } from 'src/app/helpers/validators-helper';

import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { SpartanQueryDictionary } from 'src/app/models/spartan-query-dictionary';


@Component({
  selector: 'app-Coordinacion_Handling',
  templateUrl: './Coordinacion_Handling.component.html',
  styleUrls: ['./Coordinacion_Handling.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Coordinacion_HandlingComponent implements OnInit, AfterViewInit {
MRaddHandler: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Coordinacion_HandlingForm: FormGroup;
  public Editor = ClassicEditor;
  model: Coordinacion_Handling;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
  hasOptionsNumero_de_Vuelo: boolean;
  isLoadingNumero_de_Vuelo: boolean;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  public varAeropuertos: Aeropuertos[] = [];
  public varEstatus_de_Confirmacion: Estatus_de_Confirmacion[] = [];

  optionsAeropuertosFiltered: Observable<SpartanQueryDictionary[]>;
  optionsAeropuertos: SpartanQueryDictionary[] = [];

  autoDestino_Detalle_Coordinacion_Handling = new FormControl();
  SelectedDestino_Detalle_Coordinacion_Handling: string[] = [];
  isLoadingDestino_Detalle_Coordinacion_Handling: boolean;
  searchDestino_Detalle_Coordinacion_HandlingCompleted: boolean;

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  dataSourceHandler = new MatTableDataSource<Detalle_Coordinacion_Handling>();
  HandlerColumns = [
    { def: 'actions', hide: false },
    { def: 'Destino', hide: false },
    { def: 'Handler', hide: false },
    { def: 'No__De_Telefono', hide: false },
    { def: 'Fecha_de_Solicitud', hide: false },
    { def: 'Confirmado_por_Correo', hide: false },
    { def: 'Confirmado_por_Telefono', hide: false },
    { def: 'Confirmado', hide: false },

  ];
  HandlerData: Detalle_Coordinacion_Handling[] = [];

  today = new Date;
  consult: boolean = false;
  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Coordinacion_HandlingService: Coordinacion_HandlingService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeronaveService: AeronaveService,
    private Detalle_Coordinacion_HandlingService: Detalle_Coordinacion_HandlingService,
    private AeropuertosService: AeropuertosService,
    private Estatus_de_ConfirmacionService: Estatus_de_ConfirmacionService,
    private _seguridad: SeguridadService,
    private spartanFileService: SpartanFileService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private validatorsHelper: ValidatorsHelper,

    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private _SpartanService: SpartanService,
    renderer: Renderer2) {

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Coordinacion_Handling(this.fb);
    this.Coordinacion_HandlingForm = this.model.buildFormGroup();
    this.HandlerItems.removeAt(0);

    this.Coordinacion_HandlingForm.get('Folio').disable();
    this.Coordinacion_HandlingForm.get('Folio').setValue('Auto');
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

    console.log(e.target.value);

    if (e.target.value.length >= 10) {
      e.preventDefault();
      return;
    }
  }

  ngAfterViewInit(): void {
    this.dataSourceHandler.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.HandlerColumns.splice(0, 1);

        this.Coordinacion_HandlingForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Coordinacion_Handling).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Coordinacion_HandlingForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Coordinacion_HandlingForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Coordinacion_HandlingService.listaSelAll(0, 1, 'Coordinacion_Handling.Folio=' + id).toPromise();
    if (result.Coordinacion_Handlings.length > 0) {

      await this.Detalle_Coordinacion_HandlingService.listaSelAll(0, 1000, 'Coordinacion_Handling.Folio=' + id).toPromise().then(fHandler => {
        this.HandlerData = fHandler.Detalle_Coordinacion_Handlings;
        this.loadHandler(fHandler.Detalle_Coordinacion_Handlings);
        this.dataSourceHandler = new MatTableDataSource(fHandler.Detalle_Coordinacion_Handlings);
        this.dataSourceHandler.paginator = this.paginator;
        this.dataSourceHandler.sort = this.sort;
      });

      this.model.fromObject(result.Coordinacion_Handlings[0]);

      this.Coordinacion_HandlingForm.get('Numero_de_Vuelo').setValue(
        result.Coordinacion_Handlings[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        { onlySelf: false, emitEvent: true }
      );

      this.Coordinacion_HandlingForm.get('Matricula').setValue(
        result.Coordinacion_Handlings[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );

      this.Coordinacion_HandlingForm.markAllAsTouched();
      this.Coordinacion_HandlingForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else {
      this.spinner.hide('loading');
    }
  }

  get HandlerItems() {
    return this.Coordinacion_HandlingForm.get('Detalle_Coordinacion_HandlingItems') as FormArray;
  }

  getHandlerColumns(): string[] {
    return this.HandlerColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadHandler(Handler: Detalle_Coordinacion_Handling[]) {
    Handler.forEach(element => {
      this.addHandler(element);
    });
  }

  addBusinessRulesToMR(index) {
    /* this.brf.SetRequiredControlMR(this.HandlerItems, index, "Destino");
    this.brf.SetRequiredControlMR(this.HandlerItems, index, "Handler");
    this.brf.SetRequiredControlMR(this.HandlerItems, index, "No__De_Telefono");
    this.brf.SetRequiredControlMR(this.HandlerItems, index, "Confirmado"); */
  }

  addHandlerToMR() {
    const Handler = new Detalle_Coordinacion_Handling(this.fb);
    this.HandlerData.push(this.addHandler(Handler));
    this.dataSourceHandler.data = this.HandlerData;
    Handler.edit = true;
    Handler.isNew = true;
    const length = this.dataSourceHandler.data.length;
    const index = length - 1;
    const formHandler = this.HandlerItems.controls[index] as FormGroup;
    this.addFilterToControlDestino_Detalle_Coordinacion_Handling(formHandler.controls.Destino, index);

    this.addBusinessRulesToMR(index);

    const page = Math.ceil(this.dataSourceHandler.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
    formHandler.enable();

  }

  addHandler(entity: Detalle_Coordinacion_Handling) {
    const Handler = new Detalle_Coordinacion_Handling(this.fb);
    this.HandlerItems.push(Handler.buildFormGroup());
    if (entity) {
      Handler.fromObject(entity);
    }
    return entity;
  }

  HandlerItemsByFolio(Folio: number): FormGroup {
    return (this.Coordinacion_HandlingForm.get('Detalle_Coordinacion_HandlingItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  HandlerItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceHandler.data.indexOf(element);
    let fb = this.HandlerItems.controls[index] as FormGroup;
    return fb;
  }

  deleteHandler(element: any) {
    let index = this.dataSourceHandler.data.indexOf(element);
    this.HandlerData[index].IsDeleted = true;
    this.dataSourceHandler.data = this.HandlerData;
    this.dataSourceHandler._updateChangeSubscription();
    index = this.dataSourceHandler.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditHandler(element: any) {
    let index = this.dataSourceHandler.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.HandlerData[index].IsDeleted = true;
      this.dataSourceHandler.data = this.HandlerData;
      this.dataSourceHandler._updateChangeSubscription();
      index = this.HandlerData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
    const formHandler = this.HandlerItems.controls[index] as FormGroup;
    formHandler.disable();
  }

  async saveHandler(element: any) {
    const index = this.dataSourceHandler.data.indexOf(element);
    const formHandler = this.HandlerItems.controls[index] as FormGroup;
    if (this.HandlerData[index].Destino !== formHandler.value.Destino && formHandler.value.Destino > 0) {
      let aeropuertos = await this.AeropuertosService.getById(formHandler.value.Destino).toPromise();
      this.HandlerData[index].Destino_Aeropuertos = aeropuertos;
    }
    this.HandlerData[index].Destino = formHandler.value.Destino;
    this.HandlerData[index].Handler = formHandler.value.Handler;
    this.HandlerData[index].No__De_Telefono = formHandler.value.No__De_Telefono;
    this.HandlerData[index].Fecha_de_Solicitud = formHandler.value.Fecha_de_Solicitud;
    this.HandlerData[index].Confirmado_por_Correo = formHandler.value.Confirmado_por_Correo;
    this.HandlerData[index].Confirmado_por_Telefono = formHandler.value.Confirmado_por_Telefono;
    this.HandlerData[index].Confirmado = formHandler.value.Confirmado;
    this.HandlerData[index].Confirmado_Estatus_de_Confirmacion = formHandler.value.Confirmado !== '' ?
      this.varEstatus_de_Confirmacion.filter(d => d.Clave === formHandler.value.Confirmado)[0] : null;

    this.HandlerData[index].isNew = false;
    this.dataSourceHandler.data = this.HandlerData;
    this.dataSourceHandler._updateChangeSubscription();
  }

  editHandler(element: any) {
    const index = this.dataSourceHandler.data.indexOf(element);
    const formHandler = this.HandlerItems.controls[index] as FormGroup;
    this.SelectedDestino_Detalle_Coordinacion_Handling[index] = this.dataSourceHandler.data[index]?.Destino_Aeropuertos?.Descripcion;
    this.addFilterToControlDestino_Detalle_Coordinacion_Handling(formHandler.controls.Destino, index);

    element.edit = true;
  }

  async saveDetalle_Coordinacion_Handling(Folio: number) {
    this.dataSourceHandler.data.forEach(async (d, index) => {
      const data = this.HandlerItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Coordinacion_Handling = Folio;


      if (model.Folio === 0 && !d.IsDeleted) {
        // Add Handler
        let response = await this.Detalle_Coordinacion_HandlingService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formHandler = this.HandlerItemsByFolio(model.Folio);
        if (formHandler.dirty) {
          // Update Handler
          let response = await this.Detalle_Coordinacion_HandlingService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Handler
        await this.Detalle_Coordinacion_HandlingService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectDestino_Detalle_Coordinacion_Handling(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceHandler.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedDestino_Detalle_Coordinacion_Handling[index] = event.option.viewValue;
    let fgr = this.Coordinacion_HandlingForm.controls.Detalle_Coordinacion_HandlingItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Destino.setValue(event.option.value);
    this.displayFnDestino_Detalle_Coordinacion_Handling(element);
  }

  displayFnDestino_Detalle_Coordinacion_Handling(this, element) {
    const index = this.dataSourceHandler.data.indexOf(element);
    return this.SelectedDestino_Detalle_Coordinacion_Handling[index];
  }

  updateOptionDestino_Detalle_Coordinacion_Handling(event, element: any) {
    const index = this.dataSourceHandler.data.indexOf(element);
    this.SelectedDestino_Detalle_Coordinacion_Handling[index] = event.source.viewValue;
  }

  _filterDestino_Detalle_Coordinacion_Handling(filter: any): Observable<Aeropuertos> {
    const where = filter !== '' ? "Aeropuertos.Descripcion like '%" + filter + "%'" : '';
    return this.AeropuertosService.listaSelAll(0, 20, where);
  }

  private filterAeropuertos(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.optionsAeropuertos.filter(option => option.Description.toLowerCase().includes(filterValue));
  }

  getAeropuertos() {
    let result = []

    result = this.brf.EvaluaQueryDictionary(`uspObtenerDestinosVuelo ${this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')}`, 1, 'ABC123')

    this.optionsAeropuertos = result
    this.optionsAeropuertosFiltered = of(result);

    this.optionsAeropuertosFiltered = this.Coordinacion_HandlingForm.get('Destino').valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this.filterAeropuertos(name as string) : this.optionsAeropuertos.slice();
      }),
    );

  }

  displayFnAeropuertos(option: any) {
    return option?.Description;
  }


  autocompleteStringValidator(arrayOptions: Array<string>): ValidatorFn {
    let validOptions = []

    arrayOptions.forEach(element => {
      validOptions.push(element["Aeropuerto_ID"])
    });

    return (control: AbstractControl): { [key: string]: any } | null => {
      if (validOptions.indexOf(control.value) !== -1) {
        return null
      }
      return { 'invalidAutocompleteString': { value: control.value } }
    }
  }

  addFilterToControlDestino_Detalle_Coordinacion_Handling(control: any, index) {

    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingDestino_Detalle_Coordinacion_Handling = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingDestino_Detalle_Coordinacion_Handling = true;
        return this._filterDestino_Detalle_Coordinacion_Handling(value || '');
      })
    ).subscribe(result => {
      this.varAeropuertos = result.Aeropuertoss;
      //control.setValidators(this.autocompleteStringValidator(result.Aeropuertoss));
      control.setValidators(this.validatorsHelper.autocompleteValidator(result.Aeropuertoss,"Aeropuerto_ID"));

      this.isLoadingDestino_Detalle_Coordinacion_Handling = false;
      this.searchDestino_Detalle_Coordinacion_HandlingCompleted = true;
      this.SelectedDestino_Detalle_Coordinacion_Handling[index] = this.varAeropuertos.length === 0 ? '' : this.SelectedDestino_Detalle_Coordinacion_Handling[index];
    });
  }

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Coordinacion_HandlingForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Folio);
        } else {
          this.operation = "New";
        }
        this.rulesOnInit();
      });
  }

  closeWindowCancel(): void {
    window.close();
  }
  closeWindowSave(): void {
    setTimeout(() => { window.close(); }, 2000);
  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Estatus_de_ConfirmacionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varEstatus_de_Confirmacion]) => {
          this.varEstatus_de_Confirmacion = varEstatus_de_Confirmacion;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Coordinacion_HandlingForm.get('Numero_de_Vuelo').valueChanges.pipe(
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
      this.Coordinacion_HandlingForm.get('Numero_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
      this.optionsNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = false;
      this.optionsNumero_de_Vuelo = of([]);
    });
    this.Coordinacion_HandlingForm.get('Matricula').valueChanges.pipe(
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
      this.Coordinacion_HandlingForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Confirmado': {
        this.Estatus_de_ConfirmacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Confirmacion = x.Estatus_de_Confirmacions;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

  displayFnNumero_de_Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }


  async save() {
    await this.saveData();
    if (this.localStorageHelper.getItemFromLocalStorage("Coordinacion_HandlingWindowsFloat") == "1") {
      this.localStorageHelper.setItemToLocalStorage("Coordinacion_HandlingWindowsFloat", "0");
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
      const entity = this.Coordinacion_HandlingForm.value;
      entity.Folio = this.model.Folio;
      entity.Numero_de_Vuelo = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');
      entity.Matricula = this.Coordinacion_HandlingForm.get('Matricula').value.Matricula;
      entity.Ruta_de_Vuelo = this.Coordinacion_HandlingForm.controls.Ruta_de_Vuelo.value;
      entity.Fecha_y_Hora_de_Salida = this.Coordinacion_HandlingForm.controls.Fecha_y_Hora_de_Salida.value;
      entity.Calificacion = this.Coordinacion_HandlingForm.controls.Calificacion.value;

      if (this.model.Folio > 0) {
        await this.Coordinacion_HandlingService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Coordinacion_Handling(this.model.Folio);
        this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        this.rulesAfterSave();
        return this.model.Folio;
      } else {
        await (this.Coordinacion_HandlingService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Coordinacion_Handling(id);
          this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
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
      this.Coordinacion_HandlingForm.reset();
      this.model = new Coordinacion_Handling(this.fb);
      this.Coordinacion_HandlingForm = this.model.buildFormGroup();
      this.dataSourceHandler = new MatTableDataSource<Detalle_Coordinacion_Handling>();
      this.HandlerData = [];

    } else {
      this.router.navigate(['views/Coordinacion_Handling/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }

  cancel() {
    if (this.localStorageHelper.getItemFromLocalStorage("Coordinacion_HandlingWindowsFloat") == "1") {
      this.localStorageHelper.setItemToLocalStorage("Coordinacion_HandlingWindowsFloat", "0");
      window.close();
    }
    else {
      this.goToList();
    }
  }

  goToList() {
    this.router.navigate(['/Coordinacion_Handling/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Numero_de_Vuelo_ExecuteBusinessRules(): void {
    //Numero_de_Vuelo_FieldExecuteBusinessRulesEnd
  }
  Matricula_ExecuteBusinessRules(): void {
    //Matricula_FieldExecuteBusinessRulesEnd
  }
  Ruta_de_Vuelo_ExecuteBusinessRules(): void {
    //Ruta_de_Vuelo_FieldExecuteBusinessRulesEnd
  }
  Fecha_y_Hora_de_Salida_ExecuteBusinessRules(): void {
    //Fecha_y_Hora_de_Salida_FieldExecuteBusinessRulesEnd
  }
  Calificacion_ExecuteBusinessRules(): void {
    //Calificacion_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:1876 - En nuevo, ocultar numero de vuelo - Autor: Lizeth Villa - Actualización: 3/25/2021 5:06:50 PM
    if (this.operation == 'New') {
      this.brf.HideFieldOfForm(this.Coordinacion_HandlingForm, "Numero_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Coordinacion_HandlingForm, "Numero_de_Vuelo");
    }
    //TERMINA - BRID:1876


    //INICIA - BRID:1877 - Observaciones asignar no requerido - Autor: Lizeth Villa - Actualización: 3/22/2021 2:45:38 PM
    this.brf.SetNotRequiredControl(this.Coordinacion_HandlingForm, "Observaciones");
    //TERMINA - BRID:1877


    //INICIA - BRID:2039 - Al abrir la pantalla, en nuevo y modificar* Matricula, Ruta de Vuelo, Fecha y Hora de Salida, Calificación y Número de Vuelo siempre deshabilitados* Número de vuelo VISIBLE - Autor: Lizeth Villa - Actualización: 3/25/2021 3:06:38 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Numero_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Ruta_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Fecha_y_Hora_de_Salida', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Calificacion', 0);
    }
    //TERMINA - BRID:2039

    //INICIA - BRID:2618 - Ocultar Folio. siempre - Autor: Lizeth Villa - Actualización: 4/7/2021 10:09:44 AM
    this.brf.HideFieldOfForm(this.Coordinacion_HandlingForm, "Folio");
    this.brf.SetNotRequiredControl(this.Coordinacion_HandlingForm, "Folio");
    //TERMINA - BRID:2618


    //INICIA - BRID:2828 - si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje con código manual (no desactivar) - Autor: Administrador - Actualización: 5/3/2021 4:13:16 PM
    if (this.brf.EvaluaQuery("SELECT COUNT(*) from Solicitud_de_Vuelo where folio = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + " and estatus = 9	", 1, 'ABC123') == this.brf.TryParseInt('1', '1')
      && this.brf.EvaluaQuery("if ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 1 or " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 9 ) begin select 1 end	", 1, 'ABC123') != this.brf.TryParseInt('1', '1')) {
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Folio', 0); this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Numero_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Ruta_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Fecha_y_Hora_de_Salida', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Calificacion', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Observaciones', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Coordinacion_Handling', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Destino', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Handler', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'No__De_Telefono', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Fecha_de_Solicitud', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Confirmado_por_Correo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Confirmado_por_Telefono', 0);
      this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Confirmado', 0);
      this.brf.ShowMessage("El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar");
    }
    //TERMINA - BRID:2828


    //INICIA - BRID:5680 - si el vuelo esta reabierto habiltar todos los campos - Autor: Lizeth Villa - Actualización: 9/3/2021 5:15:32 PM
    if (this.operation == 'Update') {
      if (this.brf.EvaluaQuery("if ( ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 9) or  ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 12)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1') &&
        this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + "", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Matricula', 1);
        this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Ruta_de_Vuelo', 1);
        this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Fecha_y_Hora_de_Salida', 1);
        this.brf.SetEnabledControl(this.Coordinacion_HandlingForm, 'Calificacion', 1);
      }
    }
    //TERMINA - BRID:5680

    //rulesOnInit_ExecuteBusinessRulesEnd

    this.getAeropuertos();
  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:1875 - En nuevo despues de guardar asignar numero de vuelo - Autor: Lizeth Villa - Actualización: 3/22/2021 2:43:01 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery("update Coordinacion_Handling set Numero_de_Vuelo= " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + " where Folio=" + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted), 1, "ABC123");
    }
    //TERMINA - BRID:1875


    //INICIA - BRID:2632 - al dar de alta o modificar, después de guardar ejecutar el SP: exec uspAsignaCalificacionCoordinacion "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+",2 esto es para asignar la calificación. - Autor: Felipe Rodríguez - Actualización: 4/7/2021 4:19:21 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this._SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + ",2", 1, "ABC123");
    }
    //TERMINA - BRID:2632

    //rulesAfterSave_ExecuteBusinessRulesEnd


  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas

}
