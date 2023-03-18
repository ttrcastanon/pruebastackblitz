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
import { Control_de_Herramientas__Materiales_y_Equipo_prestadoService } from 'src/app/api-services/Control_de_Herramientas__Materiales_y_Equipo_prestado.service';
import { Control_de_Herramientas__Materiales_y_Equipo_prestado } from 'src/app/models/Control_de_Herramientas__Materiales_y_Equipo_prestado';
import { Aplicacion__de_PrestamoService } from 'src/app/api-services/Aplicacion__de_Prestamo.service';
import { Aplicacion__de_Prestamo } from 'src/app/models/Aplicacion__de_Prestamo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_servicioService } from 'src/app/api-services/Orden_de_servicio.service';
import { Orden_de_servicio } from 'src/app/models/Orden_de_servicio';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Detalle_de_Herramientas_y_Equipo_PrestadoService } from 'src/app/api-services/Detalle_de_Herramientas_y_Equipo_Prestado.service';
import { Detalle_de_Herramientas_y_Equipo_Prestado } from 'src/app/models/Detalle_de_Herramientas_y_Equipo_Prestado';
import { HerramientasService } from 'src/app/api-services/Herramientas.service';
import { Herramientas } from 'src/app/models/Herramientas';

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

import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es')
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";



@Component({
  selector: 'app-Control_de_Herramientas__Materiales_y_Equipo_prestado',
  templateUrl: './Control_de_Herramientas__Materiales_y_Equipo_prestado.component.html',
  styleUrls: ['./Control_de_Herramientas__Materiales_y_Equipo_prestado.component.scss'],
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
export class Control_de_Herramientas__Materiales_y_Equipo_prestadoComponent implements OnInit, AfterViewInit {
MRaddHerramientas_y_Equipo_Prestado: boolean = false;

  //#region Variables 
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  message: string = "";
  typeMessage: string = ""
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }

  Control_de_Herramientas__Materiales_y_Equipo_prestadoForm: FormGroup;
  public Editor = ClassicEditor;
  model: Control_de_Herramientas__Materiales_y_Equipo_prestado;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsAplicacion: Observable<Aplicacion__de_Prestamo[]>;
  hasOptionsAplicacion: boolean;
  isLoadingAplicacion: boolean;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  optionsNo_O_T: Observable<Orden_de_Trabajo[]>;
  hasOptionsNo_O_T: boolean = false;
  isLoadingNo_O_T: boolean = false;

  optionsNo_O_S: Observable<Orden_de_servicio[]>;
  hasOptionsNo_O_S: boolean = false;
  isLoadingNo_O_S: boolean = false;

  optionsNo__Reporte: Observable<Crear_Reporte[]>;
  hasOptionsNo__Reporte: boolean;

  isLoadingNo__Reporte: boolean;
  optionsNo__Vuelo: Observable<Solicitud_de_Vuelo[]>;
  hasOptionsNo__Vuelo: boolean;
  isLoadingNo__Vuelo: boolean;
  optionsSolicitante: Observable<Spartan_User[]>;
  hasOptionsSolicitante: boolean;
  isLoadingSolicitante: boolean;
  public varHerramientas: Herramientas[] = [];
  public varSpartan_User: Spartan_User[] = [];

  autoNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado = new FormControl();
  SelectedNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado: string[] = [];
  isLoadingNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado: boolean;
  searchNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_PrestadoCompleted: boolean;
  isNo__de_Parte___DescripcionSelected: boolean = false;
  autoRecibio_Detalle_de_Herramientas_y_Equipo_Prestado = new FormControl();
  SelectedRecibio_Detalle_de_Herramientas_y_Equipo_Prestado: string[] = [];
  isLoadingRecibio_Detalle_de_Herramientas_y_Equipo_Prestado: boolean;
  searchRecibio_Detalle_de_Herramientas_y_Equipo_PrestadoCompleted: boolean;

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  dataSourceHerramientas_y_Equipo_Prestado = new MatTableDataSource<Detalle_de_Herramientas_y_Equipo_Prestado>();
  Herramientas_y_Equipo_PrestadoColumns = [
    { def: 'actions', hide: false },
    { def: 'No__de_Parte___Descripcion', hide: false },
    { def: 'No__de_Serie', hide: false },
    { def: 'Fecha_de_Solicitud', hide: false },
    { def: 'Fecha_de_Entrega', hide: false },
    { def: 'Observaciones', hide: false },
    //{ def: 'Recibio', hide: false },
  ];
  Herramientas_y_Equipo_PrestadoData: Detalle_de_Herramientas_y_Equipo_Prestado[] = [];
  isHerramientas_y_Equipo_PrestadoAdd: boolean = true;

  today = new Date;
  consult: boolean = false;
  minFecha_de_Entrega: Date

  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Control_de_Herramientas__Materiales_y_Equipo_prestadoService: Control_de_Herramientas__Materiales_y_Equipo_prestadoService,
    private Aplicacion__de_PrestamoService: Aplicacion__de_PrestamoService,
    private AeronaveService: AeronaveService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Orden_de_servicioService: Orden_de_servicioService,
    private Crear_ReporteService: Crear_ReporteService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private Spartan_UserService: Spartan_UserService,
    private Detalle_de_Herramientas_y_Equipo_PrestadoService: Detalle_de_Herramientas_y_Equipo_PrestadoService,
    private HerramientasService: HerramientasService,
    private _seguridad: SeguridadService,
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
    this.model = new Control_de_Herramientas__Materiales_y_Equipo_prestado(this.fb);
    this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm = this.model.buildFormGroup();
    this.Herramientas_y_Equipo_PrestadoItems.removeAt(0);

    this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Folio').disable();
    this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceHerramientas_y_Equipo_Prestado.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Herramientas_y_Equipo_PrestadoColumns.splice(0, 1);

        this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Control_de_Herramientas__Materiales_y_Equipo_prestado).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Aplicacion', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Solicitante', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Control_de_Herramientas__Materiales_y_Equipo_prestadoService.listaSelAll(0, 1, 'Control_de_Herramientas__Materiales_y_Equipo_prestado.Folio =' + id).toPromise();

    if (result.Control_de_Herramientas__Materiales_y_Equipo_prestados.length > 0) {

      let fHerramientas_y_Equipo_Prestado = await this.Detalle_de_Herramientas_y_Equipo_PrestadoService.listaSelAll(0, 1000, 'Control_de_Herramientas__Materiales_y_Equipo_prestado.Folio=' + id).toPromise();
      this.Herramientas_y_Equipo_PrestadoData = fHerramientas_y_Equipo_Prestado.Detalle_de_Herramientas_y_Equipo_Prestados;
      this.loadHerramientas_y_Equipo_Prestado(fHerramientas_y_Equipo_Prestado.Detalle_de_Herramientas_y_Equipo_Prestados);
      this.dataSourceHerramientas_y_Equipo_Prestado = new MatTableDataSource(fHerramientas_y_Equipo_Prestado.Detalle_de_Herramientas_y_Equipo_Prestados);
      this.dataSourceHerramientas_y_Equipo_Prestado.paginator = this.paginator;
      this.dataSourceHerramientas_y_Equipo_Prestado.sort = this.sort;

      this.model.fromObject(result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0]);

      //this.getNo_O_SOptions();
      //this.getNo_O_TOptions();
      //this.getNo__Vuelo();


      let Aplicacion = {
        Folio: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].Aplicacion_Aplicacion__de_Prestamo.Folio,
        Descripcion: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].Aplicacion_Aplicacion__de_Prestamo.Descripcion
      }

      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Aplicacion').setValue(Aplicacion, { onlySelf: false, emitEvent: true });

      let Matricula = {
        Folio: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].Matricula_Aeronave.Matricula,
        Matricula: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].Matricula_Aeronave.Matricula
      }

      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Matricula').setValue(Matricula, { onlySelf: false, emitEvent: true });

      let No_O_T = {
        Folio: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].No_O_T_Orden_de_Trabajo.Folio,
        numero_de_orden: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].No_O_T_Orden_de_Trabajo.numero_de_orden
      }
      No_O_T.numero_de_orden = No_O_T.numero_de_orden == null ? "" : No_O_T.numero_de_orden

      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No_O_T').setValue(No_O_T, { onlySelf: false, emitEvent: true });

      let No_O_S = {
        Folio: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].No_O_S_Orden_de_servicio.Folio,
        Folio_OS: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].No_O_S_Orden_de_servicio.Folio_OS
      }

      No_O_S.Folio_OS = No_O_S.Folio_OS == null ? "" : No_O_S.Folio_OS

      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No_O_S').setValue(No_O_S, { onlySelf: false, emitEvent: true });

      let No__Reporte = {
        Folio: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].No__Reporte_Crear_Reporte.Folio,
        No_Reporte: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].No__Reporte_Crear_Reporte.No_Reporte
      }

      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No__Reporte').setValue(No__Reporte, { onlySelf: false, emitEvent: true });

      let No__Vuelo = {
        Folio: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].No__Vuelo_Solicitud_de_Vuelo.Folio,
        Numero_de_Vuelo: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].No__Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
      }

      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No__Vuelo').setValue(No__Vuelo, { onlySelf: false, emitEvent: true });

      let Solicitante = {
        Id_User: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].Solicitante_Spartan_User.Id_User,
        Name: result.Control_de_Herramientas__Materiales_y_Equipo_prestados[0].Solicitante_Spartan_User.Name
      }

      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Solicitante').setValue(Solicitante, { onlySelf: false, emitEvent: true });

      this.getNo__Reporte(No_O_T.Folio, No_O_S.Folio);


      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.markAllAsTouched();
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Herramientas_y_Equipo_PrestadoItems() {
    return this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Detalle_de_Herramientas_y_Equipo_PrestadoItems') as FormArray;
  }

  getHerramientas_y_Equipo_PrestadoColumns(): string[] {
    return this.Herramientas_y_Equipo_PrestadoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadHerramientas_y_Equipo_Prestado(Herramientas_y_Equipo_Prestado: Detalle_de_Herramientas_y_Equipo_Prestado[]) {
    Herramientas_y_Equipo_Prestado.forEach(element => {
      this.addHerramientas_y_Equipo_Prestado(element);
    });
  }

  addHerramientas_y_Equipo_PrestadoToMR() {

    const Herramientas_y_Equipo_Prestado = new Detalle_de_Herramientas_y_Equipo_Prestado(this.fb);
    this.Herramientas_y_Equipo_PrestadoData.push(this.addHerramientas_y_Equipo_Prestado(Herramientas_y_Equipo_Prestado));
    this.dataSourceHerramientas_y_Equipo_Prestado.data = this.Herramientas_y_Equipo_PrestadoData;
    Herramientas_y_Equipo_Prestado.edit = true;
    Herramientas_y_Equipo_Prestado.isNew = true;
    const length = this.dataSourceHerramientas_y_Equipo_Prestado.data.length;
    const index = length - 1;
    const formHerramientas_y_Equipo_Prestado = this.Herramientas_y_Equipo_PrestadoItems.controls[index] as FormGroup;

    this.addFilterToControlNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado(formHerramientas_y_Equipo_Prestado.controls.No__de_Parte___Descripcion, index);
    this.addFilterToControlRecibio_Detalle_de_Herramientas_y_Equipo_Prestado(formHerramientas_y_Equipo_Prestado.controls.Recibio, index);

    const page = Math.ceil(this.dataSourceHerramientas_y_Equipo_Prestado.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }

    this.RulesForMR(index);
    this.isHerramientas_y_Equipo_PrestadoAdd = !this.isHerramientas_y_Equipo_PrestadoAdd
  }

  RulesForMR(index) {
    this.brf.SetDisabledControlMR(this.Herramientas_y_Equipo_PrestadoItems, index, "No__de_Serie");
    this.brf.SetNotValidatorControlMR(this.Herramientas_y_Equipo_PrestadoItems, index, "Fecha_de_Solicitud");
    this.brf.SetNotValidatorControlMR(this.Herramientas_y_Equipo_PrestadoItems, index, "Fecha_de_Entrega");
  }

  addHerramientas_y_Equipo_Prestado(entity: Detalle_de_Herramientas_y_Equipo_Prestado) {
    const Herramientas_y_Equipo_Prestado = new Detalle_de_Herramientas_y_Equipo_Prestado(this.fb);
    this.Herramientas_y_Equipo_PrestadoItems.push(Herramientas_y_Equipo_Prestado.buildFormGroup());
    if (entity) {
      Herramientas_y_Equipo_Prestado.fromObject(entity);
    }
    return entity;
  }

  Herramientas_y_Equipo_PrestadoItemsByFolio(Folio: number): FormGroup {
    return (this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Detalle_de_Herramientas_y_Equipo_PrestadoItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Herramientas_y_Equipo_PrestadoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    let fb = this.Herramientas_y_Equipo_PrestadoItems.controls[index] as FormGroup;
    return fb;
  }

  deleteHerramientas_y_Equipo_Prestado(element: any) {
    let index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    this.Herramientas_y_Equipo_PrestadoData[index].IsDeleted = true;
    this.dataSourceHerramientas_y_Equipo_Prestado.data = this.Herramientas_y_Equipo_PrestadoData;
    this.dataSourceHerramientas_y_Equipo_Prestado._updateChangeSubscription();
    index = this.dataSourceHerramientas_y_Equipo_Prestado.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);

    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditHerramientas_y_Equipo_Prestado(element: any) {
    this.isHerramientas_y_Equipo_PrestadoAdd = false
    let index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Herramientas_y_Equipo_PrestadoData[index].IsDeleted = true;
      this.dataSourceHerramientas_y_Equipo_Prestado.data = this.Herramientas_y_Equipo_PrestadoData;
      this.dataSourceHerramientas_y_Equipo_Prestado._updateChangeSubscription();
      index = this.Herramientas_y_Equipo_PrestadoData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }

    this.isHerramientas_y_Equipo_PrestadoAdd = true;
    this.isNo__de_Parte___DescripcionSelected = false;

  }

  async saveHerramientas_y_Equipo_Prestado(element: any) {

    const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    const formHerramientas_y_Equipo_Prestado = this.Herramientas_y_Equipo_PrestadoItems.controls[index] as FormGroup;
    if (this.Herramientas_y_Equipo_PrestadoData[index].No__de_Parte___Descripcion !== formHerramientas_y_Equipo_Prestado.value.No__de_Parte___Descripcion
      && formHerramientas_y_Equipo_Prestado.value.No__de_Parte___Descripcion > 0) {
      let herramientas = await this.HerramientasService.getById(formHerramientas_y_Equipo_Prestado.value.No__de_Parte___Descripcion).toPromise();
      this.Herramientas_y_Equipo_PrestadoData[index].No__de_Parte___Descripcion_Herramientas = herramientas;
    }
    else {
      this.message = "No. de Parte es Requerido."
      this.typeMessage = "warning"
      this.ShowMessageType(this.message, this.typeMessage);
      return
    }

    element.edit = false
    formHerramientas_y_Equipo_Prestado.enable();

    this.Herramientas_y_Equipo_PrestadoData[index].No__de_Parte___Descripcion = formHerramientas_y_Equipo_Prestado.value.No__de_Parte___Descripcion;
    this.Herramientas_y_Equipo_PrestadoData[index].No__de_Serie = formHerramientas_y_Equipo_Prestado.value.No__de_Serie;
    this.Herramientas_y_Equipo_PrestadoData[index].Fecha_de_Solicitud = formHerramientas_y_Equipo_Prestado.value.Fecha_de_Solicitud;
    this.Herramientas_y_Equipo_PrestadoData[index].Fecha_de_Entrega = formHerramientas_y_Equipo_Prestado.value.Fecha_de_Entrega;
    this.Herramientas_y_Equipo_PrestadoData[index].Observaciones = formHerramientas_y_Equipo_Prestado.value.Observaciones;
    if (this.Herramientas_y_Equipo_PrestadoData[index].Recibio !== formHerramientas_y_Equipo_Prestado.value.Recibio && formHerramientas_y_Equipo_Prestado.value.Recibio > 0) {
      let spartan_user = await this.Spartan_UserService.getById(formHerramientas_y_Equipo_Prestado.value.Recibio).toPromise();
      this.Herramientas_y_Equipo_PrestadoData[index].Recibio_Spartan_User = spartan_user;
    }

    this.Herramientas_y_Equipo_PrestadoData[index].Recibio = formHerramientas_y_Equipo_Prestado.value.Recibio;

    this.Herramientas_y_Equipo_PrestadoData[index].isNew = false;
    this.dataSourceHerramientas_y_Equipo_Prestado.data = this.Herramientas_y_Equipo_PrestadoData;
    this.dataSourceHerramientas_y_Equipo_Prestado._updateChangeSubscription();

    this.isHerramientas_y_Equipo_PrestadoAdd = true;
    this.isNo__de_Parte___DescripcionSelected = false;

  }

  editHerramientas_y_Equipo_Prestado(element: any) {

    const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    const formHerramientas_y_Equipo_Prestado = this.Herramientas_y_Equipo_PrestadoItems.controls[index] as FormGroup;
    this.SelectedNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado[index] = this.dataSourceHerramientas_y_Equipo_Prestado.data[index]?.No__de_Parte___Descripcion_Herramientas?.Codigo_Descripcion;
    this.addFilterToControlNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado(formHerramientas_y_Equipo_Prestado.controls.No__de_Parte___Descripcion, index);
    this.SelectedRecibio_Detalle_de_Herramientas_y_Equipo_Prestado[index] = this?.dataSourceHerramientas_y_Equipo_Prestado?.data[index]?.Recibio_Spartan_User?.Name;
    this.addFilterToControlRecibio_Detalle_de_Herramientas_y_Equipo_Prestado(formHerramientas_y_Equipo_Prestado?.controls?.Recibio, index);

    element.edit = true;

    this.setMinFecha_de_Entrega(index);

    this.RulesForMR(index);
    this.isNo__de_Parte___DescripcionSelected = true;
    this.isHerramientas_y_Equipo_PrestadoAdd = false;

  }

  async saveDetalle_de_Herramientas_y_Equipo_Prestado(Folio: number) {
    for (const d of this.dataSourceHerramientas_y_Equipo_Prestado.data) {
      const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(d);
      const data = this.Herramientas_y_Equipo_PrestadoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Herramientas_y_Equipo_Prestado = Folio;

      if (model.Folio === 0) {
        // Add Herramientas y Equipo Prestado
        let response = await this.Detalle_de_Herramientas_y_Equipo_PrestadoService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formHerramientas_y_Equipo_Prestado = this.Herramientas_y_Equipo_PrestadoItemsByFolio(model.Folio);
        if (formHerramientas_y_Equipo_Prestado.dirty) {
          // Update Herramientas y Equipo Prestado
          let response = await this.Detalle_de_Herramientas_y_Equipo_PrestadoService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Herramientas y Equipo Prestado
        await this.Detalle_de_Herramientas_y_Equipo_PrestadoService.delete(model.Folio).toPromise();
      }
    }
  }

  public selectNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado(event: MatAutocompleteSelectedEvent, element: any): void {

    const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado[index] = event.option.viewValue;
    let fgr = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls.Detalle_de_Herramientas_y_Equipo_PrestadoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.No__de_Parte___Descripcion.setValue(event.option.value);
    this.displayFnNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado(element);

    this.isNo__de_Parte___DescripcionSelected = true;

    this.setNo__de_Serie(index);
  }

  displayFnNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado(this, element) {
    const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    return this.SelectedNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado[index];
  }
  updateOptionNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado(event, element: any) {

    const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    this.SelectedNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado[index] = event.source.viewValue;
  }

  _filterNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado(filter: any): Observable<Herramientas> {
    const where = filter !== '' ? "Herramientas.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.HerramientasService.listaSelAll(0, 20, where);
  }

  addFilterToControlNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado = true;
        return this._filterNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado(value || '');
      })
    ).subscribe(result => {

      this.varHerramientas = result.Herramientass;
      this.isLoadingNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado = false;
      this.searchNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_PrestadoCompleted = true;
      this.SelectedNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado[index] = this.varHerramientas.length === 0 ? '' : this.SelectedNo__de_Parte___Descripcion_Detalle_de_Herramientas_y_Equipo_Prestado[index];
    });
  }
  public selectRecibio_Detalle_de_Herramientas_y_Equipo_Prestado(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedRecibio_Detalle_de_Herramientas_y_Equipo_Prestado[index] = event.option.viewValue;
    let fgr = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls.Detalle_de_Herramientas_y_Equipo_PrestadoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Recibio.setValue(event.option.value);
    this.displayFnRecibio_Detalle_de_Herramientas_y_Equipo_Prestado(element);
  }

  displayFnRecibio_Detalle_de_Herramientas_y_Equipo_Prestado(this, element) {
    const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    return this.SelectedRecibio_Detalle_de_Herramientas_y_Equipo_Prestado[index];
  }
  updateOptionRecibio_Detalle_de_Herramientas_y_Equipo_Prestado(event, element: any) {
    const index = this.dataSourceHerramientas_y_Equipo_Prestado.data.indexOf(element);
    this.SelectedRecibio_Detalle_de_Herramientas_y_Equipo_Prestado[index] = event.source.viewValue;
  }

  _filterRecibio_Detalle_de_Herramientas_y_Equipo_Prestado(filter: any): Observable<Spartan_User> {
    const where = filter !== '' ? "Spartan_User.Name like '%" + filter + "%'" : '';
    return this.Spartan_UserService.listaSelAll(0, 20, where);
  }

  addFilterToControlRecibio_Detalle_de_Herramientas_y_Equipo_Prestado(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingRecibio_Detalle_de_Herramientas_y_Equipo_Prestado = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingRecibio_Detalle_de_Herramientas_y_Equipo_Prestado = true;
        return this._filterRecibio_Detalle_de_Herramientas_y_Equipo_Prestado(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingRecibio_Detalle_de_Herramientas_y_Equipo_Prestado = false;
      this.searchRecibio_Detalle_de_Herramientas_y_Equipo_PrestadoCompleted = true;
      this.SelectedRecibio_Detalle_de_Herramientas_y_Equipo_Prestado[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedRecibio_Detalle_de_Herramientas_y_Equipo_Prestado[index];
    });
  }

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.disabled ? "Update" : this.operation;
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

    this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Aplicacion').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAplicacion = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Aplicacion__de_PrestamoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Aplicacion__de_PrestamoService.listaSelAll(0, 20, '');
          return this.Aplicacion__de_PrestamoService.listaSelAll(0, 20,
            "Aplicacion__de_Prestamo.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Aplicacion__de_PrestamoService.listaSelAll(0, 20,
          "Aplicacion__de_Prestamo.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingAplicacion = false;
      this.hasOptionsAplicacion = result?.Aplicacion__de_Prestamos?.length > 0;
      if (this.operation == "Update" || this.operation == "Consult") {
        this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Aplicacion').setValue(result?.Aplicacion__de_Prestamos[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsAplicacion = of(result?.Aplicacion__de_Prestamos);
    }, error => {
      this.isLoadingAplicacion = false;
      this.hasOptionsAplicacion = false;
      this.optionsAplicacion = of([]);
    });
    this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Matricula').valueChanges.pipe(
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
      if (this.operation == "Update" || this.operation == "Consult") {
        this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Solicitante').valueChanges.pipe(
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
      if (this.operation == "Update" || this.operation == "Consult") {
        this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Solicitante').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsSolicitante = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingSolicitante = false;
      this.hasOptionsSolicitante = false;
      this.optionsSolicitante = of([]);
    });

    this.getParamsFromUrl();
  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Solicitante': {
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

  displayFnAplicacion(option: Aplicacion__de_Prestamo) {
    return option?.Descripcion;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnNo_O_T(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
  displayFnNo_O_S(option: Orden_de_servicio) {
    return option?.Folio_OS;
  }
  displayFnNo__Reporte(option: Crear_Reporte) {
    return option?.No_Reporte;
  }
  displayFnNo__Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }
  displayFnSolicitante(option: Spartan_User) {
    return option?.Name;
  }


  async save() {
    await this.rulesBeforeSave();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');

    this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.enable();
    const entity = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.value;
    entity.Folio = this.model.Folio;
    entity.Aplicacion = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Aplicacion').value.Folio;
    entity.Matricula = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Matricula').value.Matricula;
    entity.No__Reporte = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No__Reporte').value.Folio;
    entity.No__Vuelo = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No__Vuelo').value.Folio;
    entity.Solicitante = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('Solicitante').value.Id_User;

    entity.No_O_T = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No_O_T').value.Folio;
    entity.No_O_S = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No_O_S').value.Folio;
    if (entity.No_O_T == 0) delete entity.No_O_T
    if (entity.No_O_S == 0) delete entity.No_O_S


    if (this.model.Folio > 0) {
      await this.Control_de_Herramientas__Materiales_y_Equipo_prestadoService.update(this.model.Folio, entity).toPromise().then(async id => {
        await this.saveDetalle_de_Herramientas_y_Equipo_Prestado(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.rulesAfterSave();

        this.spinner.hide('loading');
      });

    } else {
      await (this.Control_de_Herramientas__Materiales_y_Equipo_prestadoService.insert(entity).toPromise().then(async id => {
        await this.saveDetalle_de_Herramientas_y_Equipo_Prestado(id);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
        this.rulesAfterSave();
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
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.reset();
      this.model = new Control_de_Herramientas__Materiales_y_Equipo_prestado(this.fb);
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm = this.model.buildFormGroup();
      this.dataSourceHerramientas_y_Equipo_Prestado = new MatTableDataSource<Detalle_de_Herramientas_y_Equipo_Prestado>();
      this.Herramientas_y_Equipo_PrestadoData = [];

    } else {
      this.router.navigate(['views/Control_de_Herramientas__Materiales_y_Equipo_prestado/add']);
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
    this.router.navigate(['/Control_de_Herramientas__Materiales_y_Equipo_prestado/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Aplicacion_ExecuteBusinessRules(): void {

    //INICIA - BRID:7085 - Cuando aplicación es mantenimiento a terceros o a aeronaves propias - Autor: Eliud Hernandez - Actualización: 10/27/2021 7:19:46 PM
    /* if (this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Aplicacion'].value.Folio <= 0) {
      this.brf.SetRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_T");
      this.brf.SetRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_S");
    }
    else {
      this.brf.SetNotRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_T");
      this.brf.SetNotRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_S");
    } */
    //TERMINA - BRID:7085

    //Aplicacion_FieldExecuteBusinessRulesEnd

  }
  Matricula_ExecuteBusinessRules(): void {
    //INICIA - BRID:7099 - Filtrar campos correspondientes a la Matrícula - Autor: Aaron - Actualización: 10/13/2021 1:30:20 PM
    this.getNo_O_SOptions();
    this.getNo_O_TOptions();
    this.getNo__Vuelo();

    this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No__Reporte'].setValue("")
    let Empty: Observable<Crear_Reporte[]>
    this.optionsNo__Reporte = Empty
    //TERMINA - BRID:7099

    //Matricula_FieldExecuteBusinessRulesEnd

  }
  No_O_T_ExecuteBusinessRules(value: any): void {

    let No_O_T = value == "" ? null : value.Folio;
    let No_O_S = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No_O_S'].value?.Folio;

    //INICIA - BRID:7083 - Cuando tiene OT y OS pide obligatorio el N de Reporte. - Autor: Felipe Rodríguez - Actualización: 10/7/2021 5:17:28 PM
    if (No_O_T >= 1 && No_O_S >= 1) {
      this.brf.SetRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Reporte");
    } else {
      this.brf.SetNotRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Reporte");
    }
    //TERMINA - BRID:7083


    //BRID:7100 - Filtrar campo reportes acorde a OT o OS - Autor: Felipe Rodríguez - Actualización: 10/12/2021 5:25:34 PM
    this.getNo__Reporte(No_O_T, No_O_S)


    //No_O_T_FieldExecuteBusinessRulesEnd

  }

  No_O_S_ExecuteBusinessRules(value: any): void {

    let No_O_T = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No_O_T'].value?.Folio;
    let No_O_S = value == "" ? null : value.Folio;

    //INICIA - BRID:7084 - Cuando tiene OT y OS pide obligatorio el N de Reporte.. - Autor: Felipe Rodríguez - Actualización: 10/7/2021 5:19:37 PM
    if (No_O_T >= 1 && No_O_S >= 1) {
      this.brf.SetRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Reporte");
    } else {
      this.brf.SetNotRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Reporte");
    }
    //TERMINA - BRID:7084


    //BRID:7101 - Filtrar campo reportes acorde a OT o OS. - Autor: Felipe Rodríguez - Actualización: 10/12/2021 5:26:14 PM
    this.getNo__Reporte(No_O_T, No_O_S)

    //No_O_S_FieldExecuteBusinessRulesEnd


  }

  No__Reporte_ExecuteBusinessRules(): void {
    //No__Reporte_FieldExecuteBusinessRulesEnd
  }
  No__Vuelo_ExecuteBusinessRules(): void {
    //No__Vuelo_FieldExecuteBusinessRulesEnd
  }
  Fecha_Salida_ExecuteBusinessRules(): void {
    //Fecha_Salida_FieldExecuteBusinessRulesEnd
  }
  Solicitante_ExecuteBusinessRules(): void {
    //Solicitante_FieldExecuteBusinessRulesEnd
  }
  Contrasena_del_Solicitante_ExecuteBusinessRules(): void {
    //Contrasena_del_Solicitante_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    console.log(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm)
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
    //INICIA - BRID:7044 - ocultar folio de herramientas y materiales - Autor: Eliud Hernandez - Actualización: 10/5/2021 12:55:57 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfFormAfter(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "Folio");
    }
    //TERMINA - BRID:7044

    //INICIA - BRID:7103 - No requerido a campos de OT y OS - Autor: Aaron - Actualización: 10/13/2021 2:14:31 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetNotRequiredElementControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_T");
      this.brf.SetNotRequiredElementControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_S");
      this.brf.SetNotRequiredElementControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Reporte");
      this.brf.SetNotRequiredElementControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Vuelo");

    }
    //TERMINA - BRID:7103

  }

  rulesOnInit() {
    //rulesOnInit_ExecuteBusinessRulesInit

    //INICIA - BRID:7044 - ocultar folio de herramientas y materiales - Autor: Eliud Hernandez - Actualización: 10/5/2021 12:55:57 PM
    this.brf.SetNotRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "Folio");
    //TERMINA - BRID:7044

    //INICIA - BRID:7097 - no obligatorio campo matricula - Autor: Felipe Rodríguez - Actualización: 10/12/2021 2:17:12 PM
    this.brf.SetNotRequiredControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "Matricula");
    //TERMINA - BRID:7097

    //INICIA - BRID:7049 - Si el campo aplicación es mantenimiento a terceros o mantenimiento aeronaves propias (obligatorio matricula u orden de servicio y numero de reporte) - Autor: Eliud Hernandez - Actualización: 10/7/2021 1:21:44 PM
    if (this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Aplicacion'].value.Folio == this.brf.TryParseInt('2,3', '2,3')) {

      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "Folio");
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "Aplicacion");
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_T");
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_S");
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "Folio");
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Reporte");
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Vuelo");
    }
    //TERMINA - BRID:7049


    //INICIA - BRID:7061 - Deshabilitar campos de equipo prestado - Autor: Felipe Rodríguez - Actualización: 10/12/2021 2:17:11 PM
    if (this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'No__Vuelo', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Matricula', 0);
    }
    //TERMINA - BRID:7061


    //INICIA - BRID:7062 - Asignar valor a matricula - Autor: Eliud Hernandez - Actualización: 10/7/2021 12:37:29 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.brf.GetValueByControlType(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Aplicacion') == this.brf.TryParseInt('2', '2') || this.brf.GetValueByControlType(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Aplicacion') == this.brf.TryParseInt('3', '3')) {

      }
    }
    //TERMINA - BRID:7062

    //INICIA - BRID:7086 - Cuando tiene fecha de salida los campos que ya se capturaron se inhabilitan excepto Observaciones - Autor: Felipe Rodríguez - Actualización: 10/15/2021 10:18:07 AM
    if (this.operation == 'Update') {
      if (this.brf.EvaluaQuery("SELECT LEN('FLD[Fecha_Salida]') ", 1, 'ABC123') >= this.brf.TryParseInt('1', '1')) {
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Aplicacion', 0);
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'No_O_T', 0);
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'No_O_S', 0);
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'No__Reporte', 0);
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'No__Vuelo', 0);
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Fecha_Salida', 0);
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Solicitante', 0);
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Contrasena_del_Solicitante', 0);
        this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Matricula', 0);
      }
    }
    //TERMINA - BRID:7086

    //INICIA - BRID:7087 - Cuando tiene fecha de entrega se inhabilitan todos los campos, solo queda para consulta - Autor: Felipe Rodríguez - Actualización: 10/12/2021 1:18:48 PM
    if (this.operation == 'Update') {

      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Aplicacion', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'No_O_T', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'No_O_S', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'No__Reporte', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'No__Vuelo', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Fecha_Salida', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Solicitante', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Contrasena_del_Solicitante', 0);
      this.brf.SetEnabledControl(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, 'Matricula', 0);

      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Aplicacion'].disable();
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No_O_T'].disable();
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No_O_S'].disable();
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No__Reporte'].disable();
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No__Vuelo'].disable();
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Fecha_Salida'].disable();
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Solicitante'].disable();
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Contrasena_del_Solicitante'].disable();
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Matricula'].disable();


      //}
    }
    //TERMINA - BRID:7087


    //INICIA - BRID:7103 - No requerido a campos de OT y OS - Autor: Aaron - Actualización: 10/13/2021 2:14:31 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_T");
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No_O_S");
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Reporte");
      this.brf.SetNotValidatorControl2(this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm, "No__Vuelo");
      /* this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls["No_O_T"].clearValidators()
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls["No_O_S"].clearValidators()
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls["No__Reporte"].clearValidators()
      this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls["No__Vuelo"].clearValidators() */

    }
    //TERMINA - BRID:7103

    //rulesOnInit_ExecuteBusinessRulesEnd

  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit


    this.goToList();
    //rulesAfterSave_ExecuteBusinessRulesEnd
  }

  async rulesBeforeSave() {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    let Contrasena_del_Solicitante = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Contrasena_del_Solicitante'].value;
    let Solicitante = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Solicitante'].value.Id_User;
    let No_O_T = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No_O_T'].value.Folio;
    let No_O_S = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No_O_S'].value.Folio;
    let No__Reporte = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No__Reporte').value.Folio;
    let No__Vuelo = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.get('No__Vuelo').value.Folio;

    //INICIA - BRID:7052 - Validar si el usuario coincide con la contraseña. - Autor: Eliud Hernandez - Actualización: 10/6/2021 11:43:55 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (await this.brf.EvaluaQueryAsync(`DECLARE @Validacion INT SET @Validacion = 0 IF (SELECT SUBSTRING(dbo.fn_varbintohexstr(HashBytes('MD5', (SELECT convert(varchar(50), ('${Contrasena_del_Solicitante}' ))))), 3, 32)) = (SELECT Password FROM Spartan_User WHERE Id_User = ${Solicitante}) BEGIN SET @Validacion = 1 END SELECT @Validacion`, 1, 'ABC123') == this.brf.TryParseInt('0', '0')) {

        this.message = "La contraseña ingresada no coincide, favor de validar."
        this.typeMessage = "warning"
        this.ShowMessageType(this.message, this.typeMessage);

        result = false;
      }
    }
    //TERMINA - BRID:7052


    //INICIA - BRID:7105 - RDN 1 para OT y OS, Validar que si ambas estan vacias Mostrar mensaje y no guardar - Autor: Aaron - Actualización: 10/13/2021 1:40:18 PM
    if ((No_O_T == "" && No_O_S == "") || (!No_O_T && !No_O_S)) {

      this.message = "Para guardar debe especificar la OT o la OS."
      this.typeMessage = "warning"

      this.ShowMessageType(this.message, this.typeMessage);

      result = false;
    }
    //TERMINA - BRID:7105


    //INICIA - BRID:7107 - RDN 2 para OT y OS, Validar que si ambas estan llenas Mostrar mensaje y no guardar - Autor: Aaron - Actualización: 10/13/2021 1:37:32 PM
    if (No_O_T > 0 && No_O_S > 0) {

      this.message = "Para guardar debe especificar OT o OS, pero no ambas."
      this.typeMessage = "warning"

      this.ShowMessageType(this.message, this.typeMessage);

      result = false;
    }
    //TERMINA - BRID:7107


    //INICIA - BRID:7109 - Validar Minimo un campo de OT, OS, Reporte y No Vuelo - Autor: Aaron - Actualización: 10/13/2021 2:56:37 PM
    if ((No_O_T == "" && No_O_S == "" && No__Reporte == "" && No__Vuelo == "") || (!No_O_T && !No_O_S && !No__Reporte && !No__Vuelo)) {

      this.message = "Se debe seleccionar al menos una OS, OT, No. de Reporte o un No. de Vuelo."
      this.typeMessage = "warning"

      this.ShowMessageType(this.message, this.typeMessage);

      result = false;
    }
    //TERMINA - BRID:7109

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    if (await result) {
      this.saveData();
    }
  }

  //Fin de reglas

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
      duration: 3000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: ['mat-toolbar', type]
    });
  }


  //#region Formatear Lista de No_O_S
  setResponseNo_O_S(result: any) {
    let response: any = [];

    if (result) {
      //Se realiza el mapeo al modelo [{Clave, Description}]
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        response.push({ "Folio": element[0], "Folio_OS": element[1] }
        )
      });
    }
    else {
      response = []
    }

    return response
  }
  //#endregion

  //#region Formatear Lista de No_O_T
  setResponseNo_O_T(result: any) {
    let response: any = [];

    if (result) {
      //Se realiza el mapeo al modelo [{Clave, Description}]
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        response.push({ "Folio": element[0], "numero_de_orden": element[1] }
        )
      });
    }
    else {
      response = []
    }

    return response
  }
  //#endregion

  //#region Formatear Lista de No__Vuelo
  setResponseNo__Vuelo(result: any) {
    let response: any = [];

    if (result) {
      //Se realiza el mapeo al modelo [{Clave, Description}]
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        response.push({ "Folio": element[0], "Numero_de_Vuelo": element[1] }
        )
      });
    }
    else {
      response = []
    }

    return response
  }
  //#endregion

  //#region Formatear Lista de No_Reporte
  setResponseNo_Reporte(result: any) {
    let response: any = [];

    if (result) {
      //Se realiza el mapeo al modelo [{Clave, Description}]
      result = Object.keys(result).map((key) => [Number(key), result[key]]);
      result.forEach((element) => {
        response.push({ "Folio": element[0], "No_Reporte": element[1] }
        )
      });
    }
    else {
      response = []
    }

    return response
  }
  //#endregion

  //#region Obtener Listado de No_O_S
  getNo_O_SOptions() {
    let Matricula = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Matricula'].value
    if (typeof Matricula != 'string') {
      Matricula = Matricula.Matricula
    }
    this.sqlModel.query = `SELECT Folio, Folio_OS FROM Orden_de_servicio WHERE Matricula = '${Matricula}' AND Estatus = 2`;

    this._SpartanService.ExecuteQueryDictionary(this.sqlModel).subscribe({
      next: (data) => {

        this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No_O_S'].setValue("")
        let response = this.setResponseNo_O_S(data)
        this.optionsNo_O_S = response

      }
    })
  }
  //#endregion

  //#region Obtener Listado de No_O_T
  getNo_O_TOptions() {
    let Matricula = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Matricula'].value
    if (typeof Matricula != 'string') {
      Matricula = Matricula.Matricula
    }
    this.sqlModel.query = `SELECT Folio, numero_de_orden FROM Orden_de_Trabajo WHERE Matricula = '${Matricula}' AND Estatus = 2 `;

    this._SpartanService.ExecuteQueryDictionary(this.sqlModel).subscribe({
      next: (data) => {

        this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No_O_T'].setValue("")
        let response = this.setResponseNo_O_T(data)
        this.optionsNo_O_T = response

      }
    })
  }
  //#endregion

  //#region Obtener Numero de Vuelo
  getNo__Vuelo() {
    let Matricula = this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['Matricula'].value
    if (typeof Matricula != 'string') {
      Matricula = Matricula.Matricula
    }
    this.sqlModel.query = `SELECT Folio, Numero_de_Vuelo FROM Solicitud_de_Vuelo WHERE Folio IN (SELECT No_Vuelo FROM Registro_de_vuelo WHERE Matricula = '${Matricula}') `;

    this._SpartanService.ExecuteQueryDictionary(this.sqlModel).subscribe({
      next: (data) => {

        this.Control_de_Herramientas__Materiales_y_Equipo_prestadoForm.controls['No__Vuelo'].setValue("")
        let response = this.setResponseNo__Vuelo(data)
        this.optionsNo__Vuelo = response

      }
    })

  }
  //#endregion

  //#region Obtener Numero de Reporte
  getNo__Reporte(No_O_T, No_O_S) {

    if (typeof No_O_S != 'number') {
      No_O_S = null
    }
    if (typeof No_O_T != 'number') {
      No_O_T = null
    }

    this.sqlModel.query = `SELECT Folio, No_Reporte FROM Crear_Reporte WHERE Estatus = 1 AND N_Orden_de_Trabajo = ${No_O_T} OR No__de_Orden_de_Servicio = ${No_O_S} `;

    this._SpartanService.ExecuteQueryDictionary(this.sqlModel).subscribe({
      next: (data) => {

        let response = this.setResponseNo_Reporte(data)
        this.optionsNo__Reporte = response

      }
    })

  }
  //#endregion

  //#region Asignar Fecha Minima de Entrega
  setMinFecha_de_Entrega(index: any) {

    const control = this.Herramientas_y_Equipo_PrestadoItems.controls[index].get("Fecha_de_Solicitud")
    let Fecha_de_Solicitud = control.value

    this.minFecha_de_Entrega = new Date(Fecha_de_Solicitud)

  }
  //#endregion

  //#region Obtener Numero de Reporte
  setNo__de_Serie(index: any) {
    const control = this.Herramientas_y_Equipo_PrestadoItems.controls[index].get("No__de_Parte___Descripcion")
    let No__de_Parte___Descripcion = control.value

    if (typeof No__de_Parte___Descripcion != 'number') {
      No__de_Parte___Descripcion = No__de_Parte___Descripcion.Folio
    }

    this.sqlModel.query = `SELECT No_de_Serie FROM Herramientas WHERE Folio = ${No__de_Parte___Descripcion}  `;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {

        let controlNo__de_Serie = this.Herramientas_y_Equipo_PrestadoItems.controls[index].get("No__de_Serie")
        controlNo__de_Serie.setValue(response)

      }
    })

  }
  //#endregion


}
