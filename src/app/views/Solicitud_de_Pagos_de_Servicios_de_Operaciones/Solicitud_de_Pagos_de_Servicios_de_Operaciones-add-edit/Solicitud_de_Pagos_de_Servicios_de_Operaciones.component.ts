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
import { Solicitud_de_Pagos_de_Servicios_de_OperacionesService } from 'src/app/api-services/Solicitud_de_Pagos_de_Servicios_de_Operaciones.service';
import { Solicitud_de_Pagos_de_Servicios_de_Operaciones } from 'src/app/models/Solicitud_de_Pagos_de_Servicios_de_Operaciones';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesService } from 'src/app/api-services/Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones.service';
import { Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones } from 'src/app/models/Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones';
import { Solicitud_de_Servicios_para_OperacionesService } from 'src/app/api-services/Solicitud_de_Servicios_para_Operaciones.service';
import { Solicitud_de_Servicios_para_Operaciones } from 'src/app/models/Solicitud_de_Servicios_para_Operaciones';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { Ingreso_de_Costos_de_ServiciosService } from 'src/app/api-services/Ingreso_de_Costos_de_Servicios.service';
import { Ingreso_de_Costos_de_Servicios } from 'src/app/models/Ingreso_de_Costos_de_Servicios';


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
  selector: 'app-Solicitud_de_Pagos_de_Servicios_de_Operaciones',
  templateUrl: './Solicitud_de_Pagos_de_Servicios_de_Operaciones.component.html',
  styleUrls: ['./Solicitud_de_Pagos_de_Servicios_de_Operaciones.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Solicitud_de_Pagos_de_Servicios_de_OperacionesComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Solicitud_de_Pagos_de_Servicios_de_OperacionesForm: FormGroup;
  public Editor = ClassicEditor;
  model: Solicitud_de_Pagos_de_Servicios_de_Operaciones;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsProveedor: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor: boolean;
  isLoadingProveedor: boolean;
  optionsNo__de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
  hasOptionsNo__de_Vuelo: boolean;
  isLoadingNo__de_Vuelo: boolean;
  optionsAeropuerto: Observable<Aeropuertos[]>;
  hasOptionsAeropuerto: boolean;
  isLoadingAeropuerto: boolean;
  optionsEstatus: Observable<Estatus_de_Seguimiento[]>;
  hasOptionsEstatus: boolean;
  isLoadingEstatus: boolean;
  public varSolicitud_de_Servicios_para_Operaciones: Solicitud_de_Servicios_para_Operaciones[] = [];
  public varCreacion_de_Proveedores: Creacion_de_Proveedores[] = [];
  public varSolicitud_de_Vuelo: Solicitud_de_Vuelo[] = [];
  public varAeropuertos: Aeropuertos[] = [];
  public varUnidad: Unidad[] = [];
  public varEstatus_de_Seguimiento: Estatus_de_Seguimiento[] = [];
  public varIngreso_de_Costos_de_Servicios: Ingreso_de_Costos_de_Servicios[] = [];

  autoNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = new FormControl();
  SelectedNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: string[] = [];
  isLoadingNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: boolean;
  searchNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted: boolean;
  autoProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = new FormControl();
  SelectedProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: string[] = [];
  isLoadingProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: boolean;
  searchProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted: boolean;
  autoNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = new FormControl();
  SelectedNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: string[] = [];
  isLoadingNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: boolean;
  searchNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted: boolean;
  autoAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = new FormControl();
  SelectedAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: string[] = [];
  isLoadingAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: boolean;
  searchAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted: boolean;
  autoEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = new FormControl();
  SelectedEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: string[] = [];
  isLoadingEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: boolean;
  searchEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted: boolean;
  autoFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = new FormControl();
  SelectedFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: string[] = [];
  isLoadingFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones: boolean;
  searchFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted: boolean;


  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceListado_Pagos_de_Servicios_Operaciones = new MatTableDataSource<Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones>();
  Listado_Pagos_de_Servicios_OperacionesColumns = [
    { def: 'actions', hide: false },
    { def: 'No__de_Solicitud', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'No__Vuelo', hide: false },
    { def: 'Aeropuerto', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Costo_', hide: false },
    { def: 'No__de_Factura', hide: false },
    { def: 'Fecha_de_Factura', hide: false },
    { def: 'Tiempos_de_Pago', hide: false },
    { def: 'Estatus', hide: false },
    { def: 'FolioIngresoCostosServicios', hide: true },
    { def: 'Solicitud_de_Pago', hide: false },

  ];
  Listado_Pagos_de_Servicios_OperacionesData: Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[] = [];

  today = new Date;
  consult: boolean = false;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Solicitud_de_Pagos_de_Servicios_de_OperacionesService: Solicitud_de_Pagos_de_Servicios_de_OperacionesService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeropuertosService: AeropuertosService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,
    private Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesService: Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesService,
    private Solicitud_de_Servicios_para_OperacionesService: Solicitud_de_Servicios_para_OperacionesService,
    private UnidadService: UnidadService,
    private Ingreso_de_Costos_de_ServiciosService: Ingreso_de_Costos_de_ServiciosService,


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
    this.model = new Solicitud_de_Pagos_de_Servicios_de_Operaciones(this.fb);
    this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm = this.model.buildFormGroup();
    this.Listado_Pagos_de_Servicios_OperacionesItems.removeAt(0);

    this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Folio').disable();
    this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceListado_Pagos_de_Servicios_Operaciones.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Listado_Pagos_de_Servicios_OperacionesColumns.splice(0, 1);

          this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_Pagos_de_Servicios_de_Operaciones)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, 'No__de_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, 'Aeropuerto', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, 'Estatus', [CustomValidators.autocompleteObjectValidator(), Validators.required]);



    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Solicitud_de_Pagos_de_Servicios_de_OperacionesService.listaSelAll(0, 1, 'Solicitud_de_Pagos_de_Servicios_de_Operaciones.Folio=' + id).toPromise();
    if (result.Solicitud_de_Pagos_de_Servicios_de_Operacioness.length > 0) {
      let fListado_Pagos_de_Servicios_Operaciones = await this.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesService.listaSelAll(0, 1000, 'Solicitud_de_Pagos_de_Servicios_de_Operaciones.Folio=' + id).toPromise();
      this.Listado_Pagos_de_Servicios_OperacionesData = fListado_Pagos_de_Servicios_Operaciones.Detalle_Listado_de_Pagos_de_Servicios_de_Operacioness;
      this.loadListado_Pagos_de_Servicios_Operaciones(fListado_Pagos_de_Servicios_Operaciones.Detalle_Listado_de_Pagos_de_Servicios_de_Operacioness);
      this.dataSourceListado_Pagos_de_Servicios_Operaciones = new MatTableDataSource(fListado_Pagos_de_Servicios_Operaciones.Detalle_Listado_de_Pagos_de_Servicios_de_Operacioness);
      this.dataSourceListado_Pagos_de_Servicios_Operaciones.paginator = this.paginator;
      this.dataSourceListado_Pagos_de_Servicios_Operaciones.sort = this.sort;

      this.model.fromObject(result.Solicitud_de_Pagos_de_Servicios_de_Operacioness[0]);
      this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Proveedor').setValue(
        result.Solicitud_de_Pagos_de_Servicios_de_Operacioness[0].Proveedor_Creacion_de_Proveedores.Razon_social,
        { onlySelf: false, emitEvent: true }
      );
      this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('No__de_Vuelo').setValue(
        result.Solicitud_de_Pagos_de_Servicios_de_Operacioness[0].No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        { onlySelf: false, emitEvent: true }
      );
      this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Aeropuerto').setValue(
        result.Solicitud_de_Pagos_de_Servicios_de_Operacioness[0].Aeropuerto_Aeropuertos.Nombre,
        { onlySelf: false, emitEvent: true }
      );
      this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Estatus').setValue(
        result.Solicitud_de_Pagos_de_Servicios_de_Operacioness[0].Estatus_Estatus_de_Seguimiento.Descripcion,
        { onlySelf: false, emitEvent: true }
      );

      this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.markAllAsTouched();
      this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Listado_Pagos_de_Servicios_OperacionesItems() {
    return this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems') as FormArray;
  }

  getListado_Pagos_de_Servicios_OperacionesColumns(): string[] {
    return this.Listado_Pagos_de_Servicios_OperacionesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadListado_Pagos_de_Servicios_Operaciones(Listado_Pagos_de_Servicios_Operaciones: Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[]) {
    Listado_Pagos_de_Servicios_Operaciones.forEach(element => {
      this.addListado_Pagos_de_Servicios_Operaciones(element);
    });
  }

  addListado_Pagos_de_Servicios_OperacionesToMR() {
    const Listado_Pagos_de_Servicios_Operaciones = new Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(this.fb);
    this.Listado_Pagos_de_Servicios_OperacionesData.push(this.addListado_Pagos_de_Servicios_Operaciones(Listado_Pagos_de_Servicios_Operaciones));
    this.dataSourceListado_Pagos_de_Servicios_Operaciones.data = this.Listado_Pagos_de_Servicios_OperacionesData;
    Listado_Pagos_de_Servicios_Operaciones.edit = true;
    Listado_Pagos_de_Servicios_Operaciones.isNew = true;
    const length = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.length;
    const index = length - 1;
    const formListado_Pagos_de_Servicios_Operaciones = this.Listado_Pagos_de_Servicios_OperacionesItems.controls[index] as FormGroup;
    this.addFilterToControlNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.No__de_Solicitud, index);
    this.addFilterToControlProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.Proveedor, index);
    this.addFilterToControlNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.No__Vuelo, index);
    this.addFilterToControlAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.Aeropuerto, index);
    this.addFilterToControlEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.Estatus, index);
    this.addFilterToControlFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.FolioIngresoCostosServicios, index);

    const page = Math.ceil(this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addListado_Pagos_de_Servicios_Operaciones(entity: Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones) {
    const Listado_Pagos_de_Servicios_Operaciones = new Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(this.fb);
    this.Listado_Pagos_de_Servicios_OperacionesItems.push(Listado_Pagos_de_Servicios_Operaciones.buildFormGroup());
    if (entity) {
      Listado_Pagos_de_Servicios_Operaciones.fromObject(entity);
    }
    return entity;
  }

  Listado_Pagos_de_Servicios_OperacionesItemsByFolio(Folio: number): FormGroup {
    return (this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Listado_Pagos_de_Servicios_OperacionesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    let fb = this.Listado_Pagos_de_Servicios_OperacionesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteListado_Pagos_de_Servicios_Operaciones(element: any) {
    let index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    this.Listado_Pagos_de_Servicios_OperacionesData[index].IsDeleted = true;
    this.dataSourceListado_Pagos_de_Servicios_Operaciones.data = this.Listado_Pagos_de_Servicios_OperacionesData;
    this.dataSourceListado_Pagos_de_Servicios_Operaciones._updateChangeSubscription();
    index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditListado_Pagos_de_Servicios_Operaciones(element: any) {
    let index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Listado_Pagos_de_Servicios_OperacionesData[index].IsDeleted = true;
      this.dataSourceListado_Pagos_de_Servicios_Operaciones.data = this.Listado_Pagos_de_Servicios_OperacionesData;
      this.dataSourceListado_Pagos_de_Servicios_Operaciones._updateChangeSubscription();
      index = this.Listado_Pagos_de_Servicios_OperacionesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveListado_Pagos_de_Servicios_Operaciones(element: any) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    const formListado_Pagos_de_Servicios_Operaciones = this.Listado_Pagos_de_Servicios_OperacionesItems.controls[index] as FormGroup;
    if (this.Listado_Pagos_de_Servicios_OperacionesData[index].No__de_Solicitud !== formListado_Pagos_de_Servicios_Operaciones.value.No__de_Solicitud && formListado_Pagos_de_Servicios_Operaciones.value.No__de_Solicitud > 0) {
      let solicitud_de_servicios_para_operaciones = await this.Solicitud_de_Servicios_para_OperacionesService.getById(formListado_Pagos_de_Servicios_Operaciones.value.No__de_Solicitud).toPromise();
      this.Listado_Pagos_de_Servicios_OperacionesData[index].No__de_Solicitud_Solicitud_de_Servicios_para_Operaciones = solicitud_de_servicios_para_operaciones;
    }
    this.Listado_Pagos_de_Servicios_OperacionesData[index].No__de_Solicitud = formListado_Pagos_de_Servicios_Operaciones.value.No__de_Solicitud;
    if (this.Listado_Pagos_de_Servicios_OperacionesData[index].Proveedor !== formListado_Pagos_de_Servicios_Operaciones.value.Proveedor && formListado_Pagos_de_Servicios_Operaciones.value.Proveedor > 0) {
      let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formListado_Pagos_de_Servicios_Operaciones.value.Proveedor).toPromise();
      this.Listado_Pagos_de_Servicios_OperacionesData[index].Proveedor_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Proveedor = formListado_Pagos_de_Servicios_Operaciones.value.Proveedor;
    if (this.Listado_Pagos_de_Servicios_OperacionesData[index].No__Vuelo !== formListado_Pagos_de_Servicios_Operaciones.value.No__Vuelo && formListado_Pagos_de_Servicios_Operaciones.value.No__Vuelo > 0) {
      let solicitud_de_vuelo = await this.Solicitud_de_VueloService.getById(formListado_Pagos_de_Servicios_Operaciones.value.No__Vuelo).toPromise();
      this.Listado_Pagos_de_Servicios_OperacionesData[index].No__Vuelo_Solicitud_de_Vuelo = solicitud_de_vuelo;
    }
    this.Listado_Pagos_de_Servicios_OperacionesData[index].No__Vuelo = formListado_Pagos_de_Servicios_Operaciones.value.No__Vuelo;
    if (this.Listado_Pagos_de_Servicios_OperacionesData[index].Aeropuerto !== formListado_Pagos_de_Servicios_Operaciones.value.Aeropuerto && formListado_Pagos_de_Servicios_Operaciones.value.Aeropuerto > 0) {
      let aeropuertos = await this.AeropuertosService.getById(formListado_Pagos_de_Servicios_Operaciones.value.Aeropuerto).toPromise();
      this.Listado_Pagos_de_Servicios_OperacionesData[index].Aeropuerto_Aeropuertos = aeropuertos;
    }
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Aeropuerto = formListado_Pagos_de_Servicios_Operaciones.value.Aeropuerto;
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Descripcion = formListado_Pagos_de_Servicios_Operaciones.value.Descripcion;
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Cantidad = formListado_Pagos_de_Servicios_Operaciones.value.Cantidad;
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Unidad = formListado_Pagos_de_Servicios_Operaciones.value.Unidad;
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Unidad_Unidad = formListado_Pagos_de_Servicios_Operaciones.value.Unidad !== '' ?
      this.varUnidad.filter(d => d.Clave === formListado_Pagos_de_Servicios_Operaciones.value.Unidad)[0] : null;
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Costo_ = formListado_Pagos_de_Servicios_Operaciones.value.Costo_;
    this.Listado_Pagos_de_Servicios_OperacionesData[index].No__de_Factura = formListado_Pagos_de_Servicios_Operaciones.value.No__de_Factura;
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Fecha_de_Factura = formListado_Pagos_de_Servicios_Operaciones.value.Fecha_de_Factura;
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Tiempos_de_Pago = formListado_Pagos_de_Servicios_Operaciones.value.Tiempos_de_Pago;
    if (this.Listado_Pagos_de_Servicios_OperacionesData[index].Estatus !== formListado_Pagos_de_Servicios_Operaciones.value.Estatus && formListado_Pagos_de_Servicios_Operaciones.value.Estatus > 0) {
      let estatus_de_seguimiento = await this.Estatus_de_SeguimientoService.getById(formListado_Pagos_de_Servicios_Operaciones.value.Estatus).toPromise();
      this.Listado_Pagos_de_Servicios_OperacionesData[index].Estatus_Estatus_de_Seguimiento = estatus_de_seguimiento;
    }
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Estatus = formListado_Pagos_de_Servicios_Operaciones.value.Estatus;
    if (this.Listado_Pagos_de_Servicios_OperacionesData[index].FolioIngresoCostosServicios !== formListado_Pagos_de_Servicios_Operaciones.value.FolioIngresoCostosServicios && formListado_Pagos_de_Servicios_Operaciones.value.FolioIngresoCostosServicios > 0) {
      let ingreso_de_costos_de_servicios = await this.Ingreso_de_Costos_de_ServiciosService.getById(formListado_Pagos_de_Servicios_Operaciones.value.FolioIngresoCostosServicios).toPromise();
      this.Listado_Pagos_de_Servicios_OperacionesData[index].FolioIngresoCostosServicios_Ingreso_de_Costos_de_Servicios = ingreso_de_costos_de_servicios;
    }
    this.Listado_Pagos_de_Servicios_OperacionesData[index].FolioIngresoCostosServicios = formListado_Pagos_de_Servicios_Operaciones.value.FolioIngresoCostosServicios;
    this.Listado_Pagos_de_Servicios_OperacionesData[index].Solicitud_de_Pago = formListado_Pagos_de_Servicios_Operaciones.value.Solicitud_de_Pago;

    this.Listado_Pagos_de_Servicios_OperacionesData[index].isNew = false;
    this.dataSourceListado_Pagos_de_Servicios_Operaciones.data = this.Listado_Pagos_de_Servicios_OperacionesData;
    this.dataSourceListado_Pagos_de_Servicios_Operaciones._updateChangeSubscription();
  }

  editListado_Pagos_de_Servicios_Operaciones(element: any) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    const formListado_Pagos_de_Servicios_Operaciones = this.Listado_Pagos_de_Servicios_OperacionesItems.controls[index] as FormGroup;
    this.SelectedNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data[index].No__de_Solicitud_Solicitud_de_Servicios_para_Operaciones.No_Solicitud;
    this.addFilterToControlNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.No__de_Solicitud, index);
    this.SelectedProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data[index].Proveedor_Creacion_de_Proveedores.Razon_social;
    this.addFilterToControlProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.Proveedor, index);
    this.SelectedNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data[index].No__Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
    this.addFilterToControlNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.No__Vuelo, index);
    this.SelectedAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data[index].Aeropuerto_Aeropuertos.Nombre;
    this.addFilterToControlAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.Aeropuerto, index);
    this.SelectedEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data[index].Estatus_Estatus_de_Seguimiento.Descripcion;
    this.addFilterToControlEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.Estatus, index);
    this.SelectedFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data[index].FolioIngresoCostosServicios_Ingreso_de_Costos_de_Servicios.FolioIngresoCostosServ;
    this.addFilterToControlFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(formListado_Pagos_de_Servicios_Operaciones.controls.FolioIngresoCostosServicios, index);

    element.edit = true;
  }

  async saveDetalle_Listado_de_Pagos_de_Servicios_de_Operaciones(Folio: number) {
    this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.forEach(async (d, index) => {
      const data = this.Listado_Pagos_de_Servicios_OperacionesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Solicitud_de_Pagos_de_Servicios_de_Operaciones = Folio;


      if (model.Folio === 0) {
        // Add Listado Pagos de Servicios Operaciones
        let response = await this.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formListado_Pagos_de_Servicios_Operaciones = this.Listado_Pagos_de_Servicios_OperacionesItemsByFolio(model.Folio);
        if (formListado_Pagos_de_Servicios_Operaciones.dirty) {
          // Update Listado Pagos de Servicios Operaciones
          let response = await this.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Listado Pagos de Servicios Operaciones
        await this.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.No__de_Solicitud.setValue(event.option.value);
    this.displayFnNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(element);
  }

  displayFnNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(this, element) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    return this.SelectedNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
  }
  updateOptionNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event, element: any) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    this.SelectedNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.source.viewValue;
  }

  _filterNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(filter: any): Observable<Solicitud_de_Servicios_para_Operaciones> {
    const where = filter !== '' ? "Solicitud_de_Servicios_para_Operaciones.No_Solicitud like '%" + filter + "%'" : '';
    return this.Solicitud_de_Servicios_para_OperacionesService.listaSelAll(0, 20, where);
  }

  addFilterToControlNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true;
        return this._filterNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(value || '');
      })
    ).subscribe(result => {
      this.varSolicitud_de_Servicios_para_Operaciones = result.Solicitud_de_Servicios_para_Operacioness;
      this.isLoadingNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = false;
      this.searchNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted = true;
      this.SelectedNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.varSolicitud_de_Servicios_para_Operaciones.length === 0 ? '' : this.SelectedNo__de_Solicitud_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
    });
  }
  public selectProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Proveedor.setValue(event.option.value);
    this.displayFnProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(element);
  }

  displayFnProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(this, element) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    return this.SelectedProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
  }
  updateOptionProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event, element: any) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    this.SelectedProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.source.viewValue;
  }

  _filterProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(filter: any): Observable<Creacion_de_Proveedores> {
    const where = filter !== '' ? "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
    return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
  }

  addFilterToControlProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true;
        return this._filterProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = false;
      this.searchProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted = true;
      this.SelectedProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.varCreacion_de_Proveedores.length === 0 ? '' : this.SelectedProveedor_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
    });
  }
  public selectNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.No__Vuelo.setValue(event.option.value);
    this.displayFnNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(element);
  }

  displayFnNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(this, element) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    return this.SelectedNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
  }
  updateOptionNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event, element: any) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    this.SelectedNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.source.viewValue;
  }

  _filterNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(filter: any): Observable<Solicitud_de_Vuelo> {
    const where = filter !== '' ? "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + filter + "%'" : '';
    return this.Solicitud_de_VueloService.listaSelAll(0, 20, where);
  }

  addFilterToControlNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true;
        return this._filterNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(value || '');
      })
    ).subscribe(result => {
      this.varSolicitud_de_Vuelo = result.Solicitud_de_Vuelos;
      this.isLoadingNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = false;
      this.searchNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted = true;
      this.SelectedNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.varSolicitud_de_Vuelo.length === 0 ? '' : this.SelectedNo__Vuelo_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
    });
  }
  public selectAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Aeropuerto.setValue(event.option.value);
    this.displayFnAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(element);
  }

  displayFnAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(this, element) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    return this.SelectedAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
  }
  updateOptionAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event, element: any) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    this.SelectedAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.source.viewValue;
  }

  _filterAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(filter: any): Observable<Aeropuertos> {
    const where = filter !== '' ? "Aeropuertos.Nombre like '%" + filter + "%'" : '';
    return this.AeropuertosService.listaSelAll(0, 20, where);
  }

  addFilterToControlAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true;
        return this._filterAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(value || '');
      })
    ).subscribe(result => {
      this.varAeropuertos = result.Aeropuertoss;
      this.isLoadingAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = false;
      this.searchAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted = true;
      this.SelectedAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.varAeropuertos.length === 0 ? '' : this.SelectedAeropuerto_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
    });
  }
  public selectEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Estatus.setValue(event.option.value);
    this.displayFnEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(element);
  }

  displayFnEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(this, element) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    return this.SelectedEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
  }
  updateOptionEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event, element: any) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    this.SelectedEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.source.viewValue;
  }

  _filterEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(filter: any): Observable<Estatus_de_Seguimiento> {
    const where = filter !== '' ? "Estatus_de_Seguimiento.Descripcion like '%" + filter + "%'" : '';
    return this.Estatus_de_SeguimientoService.listaSelAll(0, 20, where);
  }

  addFilterToControlEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true;
        return this._filterEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(value || '');
      })
    ).subscribe(result => {
      this.varEstatus_de_Seguimiento = result.Estatus_de_Seguimientos;
      this.isLoadingEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = false;
      this.searchEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted = true;
      this.SelectedEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.varEstatus_de_Seguimiento.length === 0 ? '' : this.SelectedEstatus_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
    });
  }
  public selectFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls.Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.FolioIngresoCostosServicios.setValue(event.option.value);
    this.displayFnFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(element);
  }

  displayFnFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(this, element) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    return this.SelectedFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
  }
  updateOptionFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(event, element: any) {
    const index = this.dataSourceListado_Pagos_de_Servicios_Operaciones.data.indexOf(element);
    this.SelectedFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = event.source.viewValue;
  }

  _filterFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(filter: any): Observable<Ingreso_de_Costos_de_Servicios> {
    const where = filter !== '' ? "Ingreso_de_Costos_de_Servicios.FolioIngresoCostosServ like '%" + filter + "%'" : '';
    return this.Ingreso_de_Costos_de_ServiciosService.listaSelAll(0, 20, where);
  }

  addFilterToControlFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = true;
        return this._filterFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones(value || '');
      })
    ).subscribe(result => {
      this.varIngreso_de_Costos_de_Servicios = result.Ingreso_de_Costos_de_Servicioss;
      this.isLoadingFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones = false;
      this.searchFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesCompleted = true;
      this.SelectedFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index] = this.varIngreso_de_Costos_de_Servicios.length === 0 ? '' : this.SelectedFolioIngresoCostosServicios_Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones[index];
    });
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.UnidadService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varUnidad]) => {
          this.varUnidad = varUnidad;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Proveedor').valueChanges.pipe(
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
      this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });
    this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('No__de_Vuelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo__de_Vuelo = true),
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
      this.isLoadingNo__de_Vuelo = false;
      this.hasOptionsNo__de_Vuelo = result?.Solicitud_de_Vuelos?.length > 0;
      this.optionsNo__de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNo__de_Vuelo = false;
      this.hasOptionsNo__de_Vuelo = false;
      this.optionsNo__de_Vuelo = of([]);
    });
    this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Aeropuerto').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAeropuerto = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingAeropuerto = false;
      this.hasOptionsAeropuerto = result?.Aeropuertoss?.length > 0;
      this.optionsAeropuerto = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingAeropuerto = false;
      this.hasOptionsAeropuerto = false;
      this.optionsAeropuerto = of([]);
    });
    this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Estatus').valueChanges.pipe(
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
      this.optionsEstatus = of(result?.Estatus_de_Seguimientos);
    }, error => {
      this.isLoadingEstatus = false;
      this.hasOptionsEstatus = false;
      this.optionsEstatus = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Unidad': {
        this.UnidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUnidad = x.Unidads;
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
  displayFnNo__de_Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }
  displayFnAeropuerto(option: Aeropuertos) {
    return option?.Nombre;
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
      const entity = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.value;
      entity.Folio = this.model.Folio;
      entity.Proveedor = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Proveedor').value.Clave;
      entity.No__de_Vuelo = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('No__de_Vuelo').value.Folio;
      entity.Aeropuerto = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Aeropuerto').value.Aeropuerto_ID;
      entity.Estatus = this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.get('Estatus').value.Folio;


      if (this.model.Folio > 0) {
        await this.Solicitud_de_Pagos_de_Servicios_de_OperacionesService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Listado_de_Pagos_de_Servicios_de_Operaciones(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Solicitud_de_Pagos_de_Servicios_de_OperacionesService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Listado_de_Pagos_de_Servicios_de_Operaciones(id);

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
      this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.reset();
      this.model = new Solicitud_de_Pagos_de_Servicios_de_Operaciones(this.fb);
      this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm = this.model.buildFormGroup();
      this.dataSourceListado_Pagos_de_Servicios_Operaciones = new MatTableDataSource<Detalle_Listado_de_Pagos_de_Servicios_de_Operaciones>();
      this.Listado_Pagos_de_Servicios_OperacionesData = [];

    } else {
      this.router.navigate(['views/Solicitud_de_Pagos_de_Servicios_de_Operaciones/add']);
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
    this.router.navigate(['/Solicitud_de_Pagos_de_Servicios_de_Operaciones/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Proveedor_ExecuteBusinessRules(): void {
    //Proveedor_FieldExecuteBusinessRulesEnd
  }
  No__de_Vuelo_ExecuteBusinessRules(): void {
    //No__de_Vuelo_FieldExecuteBusinessRulesEnd
  }
  Aeropuerto_ExecuteBusinessRules(): void {
    //Aeropuerto_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:4189 - ocultar campos siempre y asignar no requeridos - Autor: Lizeth Villa - Actualización: 7/20/2021 2:48:15 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, "Folio");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, "Proveedor");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, "No__de_Vuelo");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, "Aeropuerto");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, "Estatus");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, "Folio");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, "Proveedor");
      this.brf.HideFieldOfForm(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, "Folio");
      this.brf.SetNotRequiredControl(this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm, "Folio");
    }
    //TERMINA - BRID:4189

    //rulesOnInit_ExecuteBusinessRulesEnd

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

  //#region Obtener datos de Tabla
  getDataTable() {
    this.dataSourceListado_Pagos_de_Servicios_Operaciones = new MatTableDataSource([]);

    this.sqlModel.query = `EXEC usp_Detalle_Listado_de_Pagos_de_Servicios_de_OperacionesMR '${this.getFilters()}'`

    this._SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      if (result == null || result.length == 0) {
        return
      }

      let dt = result[0].Table

      const data = [];
      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];

        this.varUnidad.forEach(und => {
          if (resDt.Unidad != null && und.Clave == resDt.Unidad) {
            resDt["Unidad_Descripcion"] = und.Descripcion
          }
        });

        resDt.IsDeleted = false;
        resDt.edit = false;
        resDt.isNew = true;
        data.push(resDt);
      }

      this.dataSourceListado_Pagos_de_Servicios_Operaciones = new MatTableDataSource(data);
      this.dataSourceListado_Pagos_de_Servicios_Operaciones.paginator = this.paginator;
      this.dataSourceListado_Pagos_de_Servicios_Operaciones.sort = this.sort;
    });

  }
  //#endregion

  //#region Filtros de Consulta
  getFilters(): string {
    var where = ""

    if (this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls["Proveedor"].value) {
      where += `AND Proveedor = ''${this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls["Proveedor"].value.Clave}''`
    }
    if (this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls["No__de_Vuelo"].value) {
      where += `AND No__Vuelo  = ''${this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls["No__de_Vuelo"].value.Folio}''`
    }
    if (this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls["Aeropuerto"].value) {
      where += `AND Aeropuerto  = ''${this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls["Aeropuerto"].value.Aeropuerto_ID}''`
    }
    if (this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls["Estatus"].value) {
      where += `AND Estatus = ''${this.Solicitud_de_Pagos_de_Servicios_de_OperacionesForm.controls["Estatus"].value.Folio}''`
    }

    return where
  }
  //#endregion


}
