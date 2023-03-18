import { AfterViewInit, Component, ElementRef, LOCALE_ID, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { Solicitud_de_Servicios_para_OperacionesService } from 'src/app/api-services/Solicitud_de_Servicios_para_Operaciones.service';
import { Solicitud_de_Servicios_para_Operaciones } from 'src/app/models/Solicitud_de_Servicios_para_Operaciones';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { Estatus_de_Solicitud_de_ComprasService } from 'src/app/api-services/Estatus_de_Solicitud_de_Compras.service';
import { Estatus_de_Solicitud_de_Compras } from 'src/app/models/Estatus_de_Solicitud_de_Compras';
import { Tipo_de_Solicitud_de_ComprasService } from 'src/app/api-services/Tipo_de_Solicitud_de_Compras.service';
import { Tipo_de_Solicitud_de_Compras } from 'src/app/models/Tipo_de_Solicitud_de_Compras';
import { Detalle_de_Item_ServiciosService } from 'src/app/api-services/Detalle_de_Item_Servicios.service';
import { Detalle_de_Item_Servicios } from 'src/app/models/Detalle_de_Item_Servicios';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { UrgenciaService } from 'src/app/api-services/Urgencia.service';
import { Urgencia } from 'src/app/models/Urgencia';
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
import * as moment from 'moment';
import { SpartanQueryDictionary } from 'src/app/models/spartan-query-dictionary';

import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEs, 'es')
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";


@Component({
  selector: 'app-Solicitud_de_Servicios_para_Operaciones',
  templateUrl: './Solicitud_de_Servicios_para_Operaciones.component.html',
  styleUrls: ['./Solicitud_de_Servicios_para_Operaciones.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
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
export class Solicitud_de_Servicios_para_OperacionesComponent implements OnInit, AfterViewInit {
MRaddItem_Servicios: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Solicitud_de_Servicios_para_OperacionesForm: FormGroup;
  public Editor = ClassicEditor;
  model: Solicitud_de_Servicios_para_Operaciones;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varSpartan_User: Spartan_User[] = [];
  optionsProveedor: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor: boolean;
  isLoadingProveedor: boolean;
  optionsNo__de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
  hasOptionsNo__de_Vuelo: boolean;
  isLoadingNo__de_Vuelo: boolean;
  optionsTramo: Observable<Registro_de_vuelo[]>;
  hasOptionsTramo: boolean;
  isLoadingTramo: boolean;
  public varEstatus_de_Solicitud_de_Compras: Estatus_de_Solicitud_de_Compras[] = [];
  public varTipo_de_Solicitud_de_Compras: Tipo_de_Solicitud_de_Compras[] = [];
  public varUnidad: Unidad[] = [];
  public varUrgencia: Urgencia[] = [];

  autoUrgencia_Detalle_de_Item_Servicios = new FormControl();
  SelectedUrgencia_Detalle_de_Item_Servicios: string[] = [];
  isLoadingUrgencia_Detalle_de_Item_Servicios: boolean;
  searchUrgencia_Detalle_de_Item_ServiciosCompleted: boolean;


  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceItem_Servicios = new MatTableDataSource<Detalle_de_Item_Servicios>();
  Item_ServiciosColumns = [
    { def: 'actions', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad_de_Medida', hide: false },
    { def: 'Precio', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Fecha_requerida', hide: false },
    { def: 'VoBo', hide: false },
    { def: 'Observaciones', hide: false },

  ];
  Item_ServiciosData: Detalle_de_Item_Servicios[] = [];

  today = new Date;
  consult: boolean = false;

  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  optionsTramo_de_Vuelo: SpartanQueryDictionary[] = [];

  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Solicitud_de_Servicios_para_OperacionesService: Solicitud_de_Servicios_para_OperacionesService,
    private Spartan_UserService: Spartan_UserService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private Registro_de_vueloService: Registro_de_vueloService,
    private Estatus_de_Solicitud_de_ComprasService: Estatus_de_Solicitud_de_ComprasService,
    private Tipo_de_Solicitud_de_ComprasService: Tipo_de_Solicitud_de_ComprasService,
    private Detalle_de_Item_ServiciosService: Detalle_de_Item_ServiciosService,
    private UnidadService: UnidadService,
    private UrgenciaService: UrgenciaService,
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

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.model = new Solicitud_de_Servicios_para_Operaciones(this.fb);
    this.Solicitud_de_Servicios_para_OperacionesForm = this.model.buildFormGroup();
    this.Item_ServiciosItems.removeAt(0);

    this.Solicitud_de_Servicios_para_OperacionesForm.get('No_de_Solicitud').disable();
    this.Solicitud_de_Servicios_para_OperacionesForm.get('No_de_Solicitud').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceItem_Servicios.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Item_ServiciosColumns.splice(0, 1);

        this.Solicitud_de_Servicios_para_OperacionesForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Solicitud_de_Servicios_para_Operaciones).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'No__de_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Tramo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Solicitud_de_Servicios_para_OperacionesService.listaSelAll(0, 1, 'Solicitud_de_Servicios_para_Operaciones.No_de_Solicitud=' + id).toPromise();
    if (result.Solicitud_de_Servicios_para_Operacioness.length > 0) {
      let fItem_Servicios = await this.Detalle_de_Item_ServiciosService.listaSelAll(0, 1000, 'Solicitud_de_Servicios_para_Operaciones.No_de_Solicitud=' + id).toPromise();
      this.Item_ServiciosData = fItem_Servicios.Detalle_de_Item_Servicioss;
      this.loadItem_Servicios(fItem_Servicios.Detalle_de_Item_Servicioss);
      this.dataSourceItem_Servicios = new MatTableDataSource(fItem_Servicios.Detalle_de_Item_Servicioss);
      this.dataSourceItem_Servicios.paginator = this.paginator;
      this.dataSourceItem_Servicios.sort = this.sort;

      this.model.fromObject(result.Solicitud_de_Servicios_para_Operacioness[0]);

      let Proveedor = {
        Razon_social: result.Solicitud_de_Servicios_para_Operacioness[0].Proveedor_Creacion_de_Proveedores.Razon_social,
        Clave: result.Solicitud_de_Servicios_para_Operacioness[0].Proveedor_Creacion_de_Proveedores.Clave,
      }

      let No__de_Vuelo = {
        Numero_de_Vuelo: result.Solicitud_de_Servicios_para_Operacioness[0].No__de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        Folio: result.Solicitud_de_Servicios_para_Operacioness[0].No__de_Vuelo_Solicitud_de_Vuelo.Folio,
      }

      let tramoDesc = await this.brf.EvaluaQueryAsync(`SELECT ICAO_IATA FROM Registro_de_vuelo(NOLOCK) rv INNER JOIN Aeropuertos(NOLOCK) a ON a.Aeropuerto_ID = rv.Destino WHERE rv.Folio = ${result.Solicitud_de_Servicios_para_Operacioness[0].Tramo_Registro_de_vuelo.Folio}`, 1, "ABC123");

      let Tramo = {
        Numero_de_Tramo: result.Solicitud_de_Servicios_para_Operacioness[0].Tramo_Registro_de_vuelo.Numero_de_Tramo,
        Folio: result.Solicitud_de_Servicios_para_Operacioness[0].Tramo_Registro_de_vuelo?.Folio,
        Clave: result.Solicitud_de_Servicios_para_Operacioness[0].Tramo_Registro_de_vuelo?.Folio,
        Description: tramoDesc
      }

      this.Solicitud_de_Servicios_para_OperacionesForm.get('Proveedor').setValue(Proveedor, { onlySelf: false, emitEvent: true });
      this.Solicitud_de_Servicios_para_OperacionesForm.get('No__de_Vuelo').setValue(No__de_Vuelo, { onlySelf: false, emitEvent: true });
      this.Solicitud_de_Servicios_para_OperacionesForm.get('Tramo').setValue(Tramo, { onlySelf: false, emitEvent: true });

      this.initAnotherEstatus()
      this.filterTramos()

      this.Solicitud_de_Servicios_para_OperacionesForm.markAllAsTouched();
      this.Solicitud_de_Servicios_para_OperacionesForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Item_ServiciosItems() {
    return this.Solicitud_de_Servicios_para_OperacionesForm.get('Detalle_de_Item_ServiciosItems') as FormArray;
  }

  getItem_ServiciosColumns(): string[] {
    return this.Item_ServiciosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadItem_Servicios(Item_Servicios: Detalle_de_Item_Servicios[]) {
    Item_Servicios.forEach(element => {
      this.addItem_Servicios(element);
    });
  }

  addItem_ServiciosToMR() {
    const Item_Servicios = new Detalle_de_Item_Servicios(this.fb);
    this.Item_ServiciosData.push(this.addItem_Servicios(Item_Servicios));
    this.dataSourceItem_Servicios.data = this.Item_ServiciosData;
    Item_Servicios.edit = true;
    Item_Servicios.isNew = true;
    const length = this.dataSourceItem_Servicios.data.length;
    const index = length - 1;
    const formItem_Servicios = this.Item_ServiciosItems.controls[index] as FormGroup;
    this.addFilterToControlUrgencia_Detalle_de_Item_Servicios(formItem_Servicios.controls.Urgencia, index);

    const page = Math.ceil(this.dataSourceItem_Servicios.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addItem_Servicios(entity: Detalle_de_Item_Servicios) {
    const Item_Servicios = new Detalle_de_Item_Servicios(this.fb);
    this.Item_ServiciosItems.push(Item_Servicios.buildFormGroup());
    if (entity) {
      Item_Servicios.fromObject(entity);
    }
    return entity;
  }

  Item_ServiciosItemsByFolio(Folio: number): FormGroup {
    return (this.Solicitud_de_Servicios_para_OperacionesForm.get('Detalle_de_Item_ServiciosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Item_ServiciosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceItem_Servicios.data.indexOf(element);
    let fb = this.Item_ServiciosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteItem_Servicios(element: any) {
    let index = this.dataSourceItem_Servicios.data.indexOf(element);
    this.Item_ServiciosData[index].IsDeleted = true;
    this.dataSourceItem_Servicios.data = this.Item_ServiciosData;
    this.dataSourceItem_Servicios._updateChangeSubscription();
    index = this.dataSourceItem_Servicios.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditItem_Servicios(element: any) {
    let index = this.dataSourceItem_Servicios.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Item_ServiciosData[index].IsDeleted = true;
      this.dataSourceItem_Servicios.data = this.Item_ServiciosData;
      this.dataSourceItem_Servicios._updateChangeSubscription();
      index = this.Item_ServiciosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveItem_Servicios(element: any) {
    const index = this.dataSourceItem_Servicios.data.indexOf(element);
    const formItem_Servicios = this.Item_ServiciosItems.controls[index] as FormGroup;
    this.Item_ServiciosData[index].Descripcion = formItem_Servicios.value.Descripcion;
    this.Item_ServiciosData[index].Cantidad = formItem_Servicios.value.Cantidad;
    this.Item_ServiciosData[index].Unidad_de_Medida = formItem_Servicios.value.Unidad_de_Medida;
    this.Item_ServiciosData[index].Unidad_de_Medida_Unidad = formItem_Servicios.value.Unidad_de_Medida !== '' ?
      this.varUnidad.filter(d => d.Clave === formItem_Servicios.value.Unidad_de_Medida)[0] : null;
    this.Item_ServiciosData[index].Precio = formItem_Servicios.value.Precio;
    if (this.Item_ServiciosData[index].Urgencia !== formItem_Servicios.value.Urgencia && formItem_Servicios.value.Urgencia > 0) {
      let urgencia = await this.UrgenciaService.getById(formItem_Servicios.value.Urgencia).toPromise();
      this.Item_ServiciosData[index].Urgencia_Urgencia = urgencia;
    }
    this.Item_ServiciosData[index].Urgencia = formItem_Servicios.value.Urgencia;
    this.Item_ServiciosData[index].Fecha_requerida = formItem_Servicios.value.Fecha_requerida;
    this.Item_ServiciosData[index].VoBo = formItem_Servicios.value.VoBo;
    this.Item_ServiciosData[index].Observaciones = formItem_Servicios.value.Observaciones;

    this.Item_ServiciosData[index].isNew = false;
    this.dataSourceItem_Servicios.data = this.Item_ServiciosData;
    this.dataSourceItem_Servicios._updateChangeSubscription();
  }

  editItem_Servicios(element: any) {
    const index = this.dataSourceItem_Servicios.data.indexOf(element);
    const formItem_Servicios = this.Item_ServiciosItems.controls[index] as FormGroup;
    this.SelectedUrgencia_Detalle_de_Item_Servicios[index] = this.dataSourceItem_Servicios.data[index].Urgencia_Urgencia.Descripcion;
    this.addFilterToControlUrgencia_Detalle_de_Item_Servicios(formItem_Servicios.controls.Urgencia, index);

    element.edit = true;
  }

  async saveDetalle_de_Item_Servicios(Folio: number) {
    this.dataSourceItem_Servicios.data.forEach(async (d, index) => {
      const data = this.Item_ServiciosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Solicitud_de_Servicios_para_Operaciones = Folio;

      if (model.Folio === 0 && !d.IsDeleted) {
        // Add Item Servicios
        let response = await this.Detalle_de_Item_ServiciosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formItem_Servicios = this.Item_ServiciosItemsByFolio(model.Folio);
        if (formItem_Servicios.dirty) {
          // Update Item Servicios
          let response = await this.Detalle_de_Item_ServiciosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Item Servicios
        await this.Detalle_de_Item_ServiciosService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectUrgencia_Detalle_de_Item_Servicios(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItem_Servicios.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUrgencia_Detalle_de_Item_Servicios[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_Servicios_para_OperacionesForm.controls.Detalle_de_Item_ServiciosItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Urgencia.setValue(event.option.value);
    this.displayFnUrgencia_Detalle_de_Item_Servicios(element);
  }

  displayFnUrgencia_Detalle_de_Item_Servicios(this, element) {
    const index = this.dataSourceItem_Servicios.data.indexOf(element);
    return this.SelectedUrgencia_Detalle_de_Item_Servicios[index];
  }
  updateOptionUrgencia_Detalle_de_Item_Servicios(event, element: any) {
    const index = this.dataSourceItem_Servicios.data.indexOf(element);
    this.SelectedUrgencia_Detalle_de_Item_Servicios[index] = event.source.viewValue;
  }

  _filterUrgencia_Detalle_de_Item_Servicios(filter: any): Observable<Urgencia> {
    const where = filter !== '' ? "Urgencia.Descripcion like '%" + filter + "%'" : '';
    return this.UrgenciaService.listaSelAll(0, 20, where);
  }

  addFilterToControlUrgencia_Detalle_de_Item_Servicios(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUrgencia_Detalle_de_Item_Servicios = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUrgencia_Detalle_de_Item_Servicios = true;
        return this._filterUrgencia_Detalle_de_Item_Servicios(value || '');
      })
    ).subscribe(result => {
      this.varUrgencia = result.Urgencias;
      this.isLoadingUrgencia_Detalle_de_Item_Servicios = false;
      this.searchUrgencia_Detalle_de_Item_ServiciosCompleted = true;
      this.SelectedUrgencia_Detalle_de_Item_Servicios[index] = this.varUrgencia.length === 0 ? '' : this.SelectedUrgencia_Detalle_de_Item_Servicios[index];
    });
  }


  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.No_de_Solicitud = +params.get('id');

        if (this.model.No_de_Solicitud) {
          this.operation = !this.Solicitud_de_Servicios_para_OperacionesForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.No_de_Solicitud);
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
    observablesArray.push(this.Estatus_de_Solicitud_de_ComprasService.getAll());
    observablesArray.push(this.Tipo_de_Solicitud_de_ComprasService.getAll());
    observablesArray.push(this.UnidadService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varSpartan_User, varEstatus_de_Solicitud_de_Compras, varTipo_de_Solicitud_de_Compras, varUnidad]) => {
          this.varSpartan_User = varSpartan_User;
          this.varEstatus_de_Solicitud_de_Compras = varEstatus_de_Solicitud_de_Compras;
          this.varTipo_de_Solicitud_de_Compras = varTipo_de_Solicitud_de_Compras;
          this.varUnidad = varUnidad;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Solicitud_de_Servicios_para_OperacionesForm.get('Proveedor').valueChanges.pipe(
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
    this.Solicitud_de_Servicios_para_OperacionesForm.get('No__de_Vuelo').valueChanges.pipe(
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


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Usuario_que_Registra': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_de_Solicitud_de_ComprasService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Solicitud_de_Compras = x.Estatus_de_Solicitud_de_Comprass;
        });
        break;
      }
      case 'Tipo': {
        this.Tipo_de_Solicitud_de_ComprasService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Solicitud_de_Compras = x.Tipo_de_Solicitud_de_Comprass;
        });
        break;
      }
      case 'Unidad_de_Medida': {
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
  displayFnTramo(option: any) {
    return option?.Description;
  }


  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      this.Solicitud_de_Servicios_para_OperacionesForm.enable();
      const entity = this.Solicitud_de_Servicios_para_OperacionesForm.value;
      entity.No_de_Solicitud = this.model.No_de_Solicitud;
      entity.Proveedor = this.Solicitud_de_Servicios_para_OperacionesForm.get('Proveedor').value?.Clave;
      entity.No__de_Vuelo = this.Solicitud_de_Servicios_para_OperacionesForm.get('No__de_Vuelo').value?.Folio;
      entity.Tramo = this.Solicitud_de_Servicios_para_OperacionesForm.get('Tramo').value?.Clave;

      if (this.model.No_de_Solicitud > 0) {
        await this.Solicitud_de_Servicios_para_OperacionesService.update(this.model.No_de_Solicitud, entity).toPromise();

        await this.saveDetalle_de_Item_Servicios(this.model.No_de_Solicitud);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.No_de_Solicitud.toString());
        this.rulesAfterSave();

        return this.model.No_de_Solicitud;
      } else {
        await (this.Solicitud_de_Servicios_para_OperacionesService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Item_Servicios(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          this.rulesAfterSave();

          return id;
        }));
      }

    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.No_de_Solicitud === 0) {
      this.Solicitud_de_Servicios_para_OperacionesForm.reset();
      this.model = new Solicitud_de_Servicios_para_Operaciones(this.fb);
      this.Solicitud_de_Servicios_para_OperacionesForm = this.model.buildFormGroup();
      this.dataSourceItem_Servicios = new MatTableDataSource<Detalle_de_Item_Servicios>();
      this.Item_ServiciosData = [];

    } else {
      this.router.navigate(['views/Solicitud_de_Servicios_para_Operaciones/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.No_de_Solicitud = 0;

  }

  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Solicitud_de_Servicios_para_Operaciones/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

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
  No__de_Vuelo_ExecuteBusinessRules(): void {

    //INICIA - BRID:3187 - Al seleccionar el vuelo, filtrar los tramos del vuelo seleccionado - Autor: Antonio Lopez - Actualización: 10/13/2021 2:55:30 PM

    //TERMINA - BRID:3187


    //INICIA - BRID:7106 - Al seleccionar el vuelo, filtrar los ICAO_IATA del vuelo seleccionado - Autor: Antonio Lopez - Actualización: 10/13/2021 2:55:32 PM

    //TERMINA - BRID:7106

    //No__de_Vuelo_FieldExecuteBusinessRulesEnd


  }
  Tramo_ExecuteBusinessRules(): void {
    //Tramo_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    //Observaciones_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  Tipo_ExecuteBusinessRules(): void {
    //Tipo_FieldExecuteBusinessRulesEnd
  }
  No_Solicitud_ExecuteBusinessRules(): void {
    //No_Solicitud_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:3186 - Asignar usuario que solicita, hora, fecha de registro y deshabilitar campos - Autor: Lizeth Villa - Actualización: 5/24/2021 12:52:31 PM
    if (this.operation == 'New') {

      this.Solicitud_de_Servicios_para_OperacionesForm.controls["Usuario_que_Registra"].setValue(this.UserId)
      this.Solicitud_de_Servicios_para_OperacionesForm.controls["Fecha_de_Registro"].setValue(this.today)
      var now = moment().format("HH:mm:ss");
      this.Solicitud_de_Servicios_para_OperacionesForm.controls["Hora_de_Registro"].setValue(now)

      this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Usuario_que_Registra', 0);
      this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Fecha_de_Registro', 0);
      this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Hora_de_Registro', 0);
    }
    //TERMINA - BRID:3186


    //INICIA - BRID:3197 - Al crear asignar tipo de solicitud - servicio - Autor: Lizeth Villa - Actualización: 5/24/2021 3:58:53 PM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.Solicitud_de_Servicios_para_OperacionesForm, "Tipo", "1");
      this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Tipo', 0);
    }
    //TERMINA - BRID:3197


    //INICIA - BRID:3198 - Deshabilitar campos siempre - Autor: Lizeth Villa - Actualización: 5/24/2021 6:42:43 PM
    this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Tipo', 0);
    this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Fecha_de_Registro', 0);
    this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Hora_de_Registro', 0);
    this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Usuario_que_Registra', 0);
    this.brf.SetNotRequiredControl(this.Solicitud_de_Servicios_para_OperacionesForm, "Observaciones");
    //TERMINA - BRID:3198


    //INICIA - BRID:3199 - Al ser Nuevo Registro el estatus por default es Abierta   - Autor: Lizeth Villa - Actualización: 5/24/2021 4:51:10 PM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.Solicitud_de_Servicios_para_OperacionesForm, "Estatus", "1");
      this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Estatus', 0);
    }
    //TERMINA - BRID:3199

    //INICIA - BRID:4199 - Ocultar folio siempre y no requerido - Autor: Lizeth Villa - Actualización: 7/21/2021 3:35:33 PM
    this.brf.HideFieldOfForm(this.Solicitud_de_Servicios_para_OperacionesForm, "No_Solicitud");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Servicios_para_OperacionesForm, "No_Solicitud");
    this.brf.SetNotRequiredControl(this.Solicitud_de_Servicios_para_OperacionesForm, "No_Solicitud");
    //TERMINA - BRID:4199

    //rulesOnInit_ExecuteBusinessRulesEnd


  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    let KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)
    //INICIA - BRID:4210 - Insertar  items a Solicitud de Pagos de Servicios de Operaciones cuando el estatus es cerrado - Autor: Lizeth Villa - Actualización: 7/22/2021 11:01:49 AM
    if (this.operation == 'Update') {
      if (this.Solicitud_de_Servicios_para_OperacionesForm.controls['Estatus'].value == this.brf.TryParseInt('2', '2')) {
        this.brf.EvaluaQuery(` exec usp_InsSolicitud_de_Pagos_de_Servicios_de_OperacionessMR  ${KeyValueInserted}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:4210


    //INICIA - BRID:4211 - Actualizar id - Autor: Lizeth Villa - Actualización: 7/22/2021 11:26:50 AM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(` UPDATE Solicitud_de_Servicios_para_Operaciones SET No_Solicitud = No_de_Solicitud WHERE No_de_Solicitud = ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4211

    //rulesAfterSave_ExecuteBusinessRulesEnd

    this.isLoading = false;
    this.spinner.hide('loading');
    this.snackBar.open('Registro guardado con éxito', '', {
      duration: 2000,
      verticalPosition: 'top',
      horizontalPosition: 'right',
      panelClass: 'success'
    });
    this.goToList();

  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:3205 - Debe de capturarse al menos 1 item - Autor: Lizeth Villa - Actualización: 5/25/2021 11:43:35 AM
    if (this.operation == 'New') {
      if (this.Item_ServiciosData.length == 0) {
        this.snackBar.open('Debe capturar al menos 1 item', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'warning'
        });
        result = false;
      }
    }
    //TERMINA - BRID:3205


    //INICIA - BRID:3206 - Al modificar no debe dejar eliminar todos los registros con código manual (no desactivar) - Autor: Lizeth Villa - Actualización: 5/25/2021 12:41:02 PM
    if (this.operation == 'Update') {
      let array = this.Item_ServiciosData.filter(element => !element["IsDeleted"]);
      if (array.length == 0) {
        this.snackBar.open('No puede eliminar todos los ítems, debe dejar al menos uno ', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'warning'
        });

        result = false;
      }
    }
    //TERMINA - BRID:3206


    //INICIA - BRID:3207 - Para poder cerrar la Solicitud debe de tener todos los check box del Item seleccionados con codigo manual (no desactivar) - Autor: Lizeth Villa - Actualización: 5/25/2021 1:01:13 PM
    if (this.operation == 'Update') {
      if (this.Solicitud_de_Servicios_para_OperacionesForm.controls['Estatus'].value == 2) {
        this.snackBar.open('Para poder cerrar la solicitud debe tener todos los check box seleccionados de los ítems', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'warning'
        });

        result = false;
      }
    }
    //TERMINA - BRID:3207


    //INICIA - BRID:4215 - Si en Items de servicio falta uno de VoBo no se puede cambiar el estatus a cerrada - Autor: ANgel Acuña - Actualización: 7/22/2021 12:47:35 PM //FLDD[lblNo_de_Solicitud]
    if (this.operation == 'Update') {
      if (this.Solicitud_de_Servicios_para_OperacionesForm.controls['Estatus'].value == 2 &&
        this.brf.EvaluaQuery(`select count(*) from Detalle_de_Item_Servicios where vobo = 0 and Solicitud_de_Servicios_para_Operaciones = model.Folio`, 1, 'ABC123') > this.brf.TryParseInt('0', '0')) {

        this.snackBar.open('Es necesario que todos los items tenga VoBo', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'warning'
        });

        result = false;
      }
    }
    //TERMINA - BRID:4215


    //INICIA - BRID:4216 - Solo operaciones puede cambiar el estatus a cerrar a una solicitud - Autor: ANgel Acuña - Actualización: 7/22/2021 1:26:37 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') != "12"
        && this.Solicitud_de_Servicios_para_OperacionesForm.controls['Estatus'].value == 2) {
        this.brf.ShowMessage(" Solo el rol de Operaciones puede cerrar una solicitud");

        result = false;
      }
    }
    //TERMINA - BRID:4216

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas

  initAnotherEstatus() {

    //INICIA - BRID:4188 - si ele status es cerrada - Autor: Lizeth Villa - Actualización: 7/20/2021 2:36:07 PM
    if (this.operation == 'Update') {
      if (this.Solicitud_de_Servicios_para_OperacionesForm.controls['Estatus'].value == 2) {
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'No_de_Solicitud', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Fecha_de_Registro', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Hora_de_Registro', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Usuario_que_Registra', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Proveedor', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'No__de_Vuelo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Tramo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Observaciones', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Tipo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Folio', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Solicitud_de_Servicios_para_Operaciones', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Descripcion', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Cantidad', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Unidad_de_Medida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Precio', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Urgencia', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Fecha_requerida', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'VoBo', 0);
        this.brf.SetEnabledControl(this.Solicitud_de_Servicios_para_OperacionesForm, 'Observaciones', 0);
      }
    }
    //TERMINA - BRID:4188
  }


  filterTramos() {
    let result = []
    let Numero_de_Vuelo = this.Solicitud_de_Servicios_para_OperacionesForm.controls['No__de_Vuelo'].value;

    result = this.brf.EvaluaQueryDictionary(`EXEC uspFiltraIcaoIataVuelo ${Numero_de_Vuelo.Folio}`, 1, 'ABC123')
    this.optionsTramo_de_Vuelo = result

  }


}
