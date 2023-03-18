import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { GeneralService } from 'src/app/api-services/general.service';
import { Seguimiento_de_Solicitud_de_ComprasService } from 'src/app/api-services/Seguimiento_de_Solicitud_de_Compras.service';
import { Seguimiento_de_Solicitud_de_Compras } from 'src/app/models/Seguimiento_de_Solicitud_de_Compras';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { PartesService } from 'src/app/api-services/Partes.service';
import { Partes } from 'src/app/models/Partes';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Departamento } from 'src/app/models/Departamento';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { UrgenciaService } from 'src/app/api-services/Urgencia.service';
import { Urgencia } from 'src/app/models/Urgencia';
import { Detalle_de_Seguimiento_de_Solicitud_de_ComprasService } from 'src/app/api-services/Detalle_de_Seguimiento_de_Solicitud_de_Compras.service';
import { Detalle_de_Seguimiento_de_Solicitud_de_Compras } from 'src/app/models/Detalle_de_Seguimiento_de_Solicitud_de_Compras';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';

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
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-Seguimiento_de_Solicitud_de_Compras',
  templateUrl: './Seguimiento_de_Solicitud_de_Compras.component.html',
  styleUrls: ['./Seguimiento_de_Solicitud_de_Compras.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Seguimiento_de_Solicitud_de_ComprasComponent implements OnInit, AfterViewInit, OnDestroy {

  //#region Variables
  titlePage: string = ""
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  Phase: any;
  public openWindows: any;
  motivoRechazo: string = ""
  motivoCancelar = new FormControl("")


  Seguimiento_de_Solicitud_de_ComprasForm: FormGroup;
  public Editor = ClassicEditor;
  model: Seguimiento_de_Solicitud_de_Compras;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  optionsModelo: Observable<Modelos[]>;
  hasOptionsModelo: boolean;
  isLoadingModelo: boolean;
  optionsNumero_de_Reporte: Observable<Crear_Reporte[]>;
  hasOptionsNumero_de_Reporte: boolean;
  isLoadingNumero_de_Reporte: boolean;
  optionsNumero_de_Parte: Observable<Partes[]>;
  hasOptionsNumero_de_Parte: boolean;
  isLoadingNumero_de_Parte: boolean;
  optionsDepartamento: Observable<Departamento[]>;
  hasOptionsDepartamento: boolean;
  isLoadingDepartamento: boolean;
  optionsSolicitante: Observable<Spartan_User[]>;
  hasOptionsSolicitante: boolean;
  isLoadingSolicitante: boolean;
  optionsUrgencia: Observable<Urgencia[]>;
  hasOptionsUrgencia: boolean;
  isLoadingUrgencia: boolean;
  public varUnidad: Unidad[] = [];
  public varDepartamento: Departamento[] = [];
  public varUrgencia: Urgencia[] = [];
  public varEstatus_de_Seguimiento: Estatus_de_Seguimiento[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceListado_de_Solicitud_de_Compras = new MatTableDataSource<Detalle_de_Seguimiento_de_Solicitud_de_Compras>();
  Listado_de_Solicitud_de_ComprasColumns = [
    { def: 'Descripcion', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Condicion', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Departamento', hide: false },
    { def: 'Razon_de_la_Compra', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Fecha_de_Entrega', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'No__de_Reporte', hide: false },
    { def: 'No_O_T', hide: false },
    { def: 'Fecha_estimada_de_Mtto_', hide: false },
    { def: 'Estatus', hide: false },
    { def: 'Solicitante', hide: false },
    { def: 'No__de_Solicitud', hide: false },
    { def: 'Estatus_de_Seguimiento', hide: false },
    { def: 'Folio_de_detalle', hide: false },
    { def: 'Folio_de_solicitud', hide: false },
    { def: 'Tipo_MR', hide: false },
    { def: 'Motivo_de_Rechazo', hide: false },
    { def: 'Gestion_de_compras', hide: false },
    { def: 'Cotizar', hide: false },
    { def: 'Cancelar', hide: false },

  ];
  Listado_de_Solicitud_de_ComprasData: Detalle_de_Seguimiento_de_Solicitud_de_Compras[] = [];

  today = new Date;
  consult: boolean = false;
  timerStart: boolean = false;
  interval;
  notFound: string = "No se encontraron registros."
  loadingText: string = "Cargando..."
  cancelacion: boolean = false;
  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Seguimiento_de_Solicitud_de_ComprasService: Seguimiento_de_Solicitud_de_ComprasService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Crear_ReporteService: Crear_ReporteService,
    private PartesService: PartesService,
    private DepartamentoService: DepartamentoService,
    private Spartan_UserService: Spartan_UserService,
    private UrgenciaService: UrgenciaService,
    private Detalle_de_Seguimiento_de_Solicitud_de_ComprasService: Detalle_de_Seguimiento_de_Solicitud_de_ComprasService,
    private UnidadService: UnidadService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,
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
    private modalService: NgbModal,
  ) {
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Seguimiento_de_Solicitud_de_Compras(this.fb);
    this.Seguimiento_de_Solicitud_de_ComprasForm = this.model.buildFormGroup();
    this.Listado_de_Solicitud_de_ComprasItems.removeAt(0);

    this.Seguimiento_de_Solicitud_de_ComprasForm.get('Folio').disable();
    this.Seguimiento_de_Solicitud_de_ComprasForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceListado_de_Solicitud_de_Compras.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();

    var path = this.router.url.split("/");
    this.cancelacion = path[2] == "cancel" ? true : false;

    this.titlePage = !this.cancelacion ? "Seguimiento de Solicitud de Compras" : "Cancelación de Seguimiento de Solicitud de Compras"

    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Listado_de_Solicitud_de_ComprasColumns.splice(0, 1);

        this.Seguimiento_de_Solicitud_de_ComprasForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Seguimiento_de_Solicitud_de_Compras)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Seguimiento_de_Solicitud_de_ComprasForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Seguimiento_de_Solicitud_de_ComprasForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Seguimiento_de_Solicitud_de_ComprasForm, 'Numero_de_Reporte', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Seguimiento_de_Solicitud_de_ComprasForm, 'Numero_de_Parte', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Seguimiento_de_Solicitud_de_ComprasForm, 'Departamento', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Seguimiento_de_Solicitud_de_ComprasForm, 'Solicitante', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Seguimiento_de_Solicitud_de_ComprasForm, 'Urgencia', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    if (!this.timerStart) {
      this.startTimer();
    }

  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }


  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Seguimiento_de_Solicitud_de_ComprasService.listaSelAll(0, 1, 'Seguimiento_de_Solicitud_de_Compras.Folio=' + id).toPromise();
    if (result.Seguimiento_de_Solicitud_de_Comprass.length > 0) {
      let fListado_de_Solicitud_de_Compras = await this.Detalle_de_Seguimiento_de_Solicitud_de_ComprasService.listaSelAll(0, 1000, 'Seguimiento_de_Solicitud_de_Compras.Folio=' + id).toPromise();
      this.Listado_de_Solicitud_de_ComprasData = fListado_de_Solicitud_de_Compras.Detalle_de_Seguimiento_de_Solicitud_de_Comprass;
      this.loadListado_de_Solicitud_de_Compras(fListado_de_Solicitud_de_Compras.Detalle_de_Seguimiento_de_Solicitud_de_Comprass);
      this.dataSourceListado_de_Solicitud_de_Compras = new MatTableDataSource(fListado_de_Solicitud_de_Compras.Detalle_de_Seguimiento_de_Solicitud_de_Comprass);
      this.dataSourceListado_de_Solicitud_de_Compras.paginator = this.paginator;
      this.dataSourceListado_de_Solicitud_de_Compras.sort = this.sort;

      this.model.fromObject(result.Seguimiento_de_Solicitud_de_Comprass[0]);

      this.Seguimiento_de_Solicitud_de_ComprasForm.get('Matricula').setValue(
        result.Seguimiento_de_Solicitud_de_Comprass[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.Seguimiento_de_Solicitud_de_ComprasForm.get('Modelo').setValue(
        result.Seguimiento_de_Solicitud_de_Comprass[0].Modelo_Modelos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Seguimiento_de_Solicitud_de_ComprasForm.get('Numero_de_Reporte').setValue(
        result.Seguimiento_de_Solicitud_de_Comprass[0].Numero_de_Reporte_Crear_Reporte.No_Reporte,
        { onlySelf: false, emitEvent: true }
      );
      this.Seguimiento_de_Solicitud_de_ComprasForm.get('Numero_de_Parte').setValue(
        result.Seguimiento_de_Solicitud_de_Comprass[0].Numero_de_Parte_Partes.Numero_de_parte_Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Seguimiento_de_Solicitud_de_ComprasForm.get('Departamento').setValue(
        result.Seguimiento_de_Solicitud_de_Comprass[0].Departamento_Departamento.Nombre,
        { onlySelf: false, emitEvent: true }
      );
      this.Seguimiento_de_Solicitud_de_ComprasForm.get('Solicitante').setValue(
        result.Seguimiento_de_Solicitud_de_Comprass[0].Solicitante_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );
      this.Seguimiento_de_Solicitud_de_ComprasForm.get('Urgencia').setValue(
        result.Seguimiento_de_Solicitud_de_Comprass[0].Urgencia_Urgencia.Descripcion,
        { onlySelf: false, emitEvent: true }
      );

      this.Seguimiento_de_Solicitud_de_ComprasForm.markAllAsTouched();
      this.Seguimiento_de_Solicitud_de_ComprasForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Listado_de_Solicitud_de_ComprasItems() {
    return this.Seguimiento_de_Solicitud_de_ComprasForm.get('Detalle_de_Seguimiento_de_Solicitud_de_ComprasItems') as FormArray;
  }

  getListado_de_Solicitud_de_ComprasColumns(): string[] {
    return this.Listado_de_Solicitud_de_ComprasColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadListado_de_Solicitud_de_Compras(Listado_de_Solicitud_de_Compras: Detalle_de_Seguimiento_de_Solicitud_de_Compras[]) {
    Listado_de_Solicitud_de_Compras.forEach(element => {
      this.addListado_de_Solicitud_de_Compras(element);
    });
  }

  addListado_de_Solicitud_de_ComprasToMR() {
    const Listado_de_Solicitud_de_Compras = new Detalle_de_Seguimiento_de_Solicitud_de_Compras(this.fb);
    this.Listado_de_Solicitud_de_ComprasData.push(this.addListado_de_Solicitud_de_Compras(Listado_de_Solicitud_de_Compras));
    this.dataSourceListado_de_Solicitud_de_Compras.data = this.Listado_de_Solicitud_de_ComprasData;
    Listado_de_Solicitud_de_Compras.edit = true;
    Listado_de_Solicitud_de_Compras.isNew = true;
    const length = this.dataSourceListado_de_Solicitud_de_Compras.data.length;
    const index = length - 1;
    const formListado_de_Solicitud_de_Compras = this.Listado_de_Solicitud_de_ComprasItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceListado_de_Solicitud_de_Compras.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addListado_de_Solicitud_de_Compras(entity: Detalle_de_Seguimiento_de_Solicitud_de_Compras) {
    const Listado_de_Solicitud_de_Compras = new Detalle_de_Seguimiento_de_Solicitud_de_Compras(this.fb);
    this.Listado_de_Solicitud_de_ComprasItems.push(Listado_de_Solicitud_de_Compras.buildFormGroup());
    if (entity) {
      Listado_de_Solicitud_de_Compras.fromObject(entity);
    }
    return entity;
  }

  Listado_de_Solicitud_de_ComprasItemsByFolio(Folio: number): FormGroup {
    return (this.Seguimiento_de_Solicitud_de_ComprasForm.get('Detalle_de_Seguimiento_de_Solicitud_de_ComprasItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Listado_de_Solicitud_de_ComprasItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceListado_de_Solicitud_de_Compras.data.indexOf(element);
    let fb = this.Listado_de_Solicitud_de_ComprasItems.controls[index] as FormGroup;
    return fb;
  }

  deleteListado_de_Solicitud_de_Compras(element: any) {
    let index = this.dataSourceListado_de_Solicitud_de_Compras.data.indexOf(element);
    this.Listado_de_Solicitud_de_ComprasData[index].IsDeleted = true;
    this.dataSourceListado_de_Solicitud_de_Compras.data = this.Listado_de_Solicitud_de_ComprasData;
    this.dataSourceListado_de_Solicitud_de_Compras._updateChangeSubscription();
    index = this.dataSourceListado_de_Solicitud_de_Compras.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditListado_de_Solicitud_de_Compras(element: any) {
    let index = this.dataSourceListado_de_Solicitud_de_Compras.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Listado_de_Solicitud_de_ComprasData[index].IsDeleted = true;
      this.dataSourceListado_de_Solicitud_de_Compras.data = this.Listado_de_Solicitud_de_ComprasData;
      this.dataSourceListado_de_Solicitud_de_Compras._updateChangeSubscription();
      index = this.Listado_de_Solicitud_de_ComprasData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveListado_de_Solicitud_de_Compras(element: any) {
    const index = this.dataSourceListado_de_Solicitud_de_Compras.data.indexOf(element);
    const formListado_de_Solicitud_de_Compras = this.Listado_de_Solicitud_de_ComprasItems.controls[index] as FormGroup;
    this.Listado_de_Solicitud_de_ComprasData[index].Descripcion = formListado_de_Solicitud_de_Compras.value.Descripcion;
    this.Listado_de_Solicitud_de_ComprasData[index].Cantidad = formListado_de_Solicitud_de_Compras.value.Cantidad;
    this.Listado_de_Solicitud_de_ComprasData[index].Condicion = formListado_de_Solicitud_de_Compras.value.Condicion;
    this.Listado_de_Solicitud_de_ComprasData[index].Unidad = formListado_de_Solicitud_de_Compras.value.Unidad;
    this.Listado_de_Solicitud_de_ComprasData[index].Unidad_Unidad = formListado_de_Solicitud_de_Compras.value.Unidad !== '' ?
      this.varUnidad.filter(d => d.Clave === formListado_de_Solicitud_de_Compras.value.Unidad)[0] : null;
    this.Listado_de_Solicitud_de_ComprasData[index].Departamento = formListado_de_Solicitud_de_Compras.value.Departamento;
    this.Listado_de_Solicitud_de_ComprasData[index].Departamento_Departamento = formListado_de_Solicitud_de_Compras.value.Departamento !== '' ?
      this.varDepartamento.filter(d => d.Folio === formListado_de_Solicitud_de_Compras.value.Departamento)[0] : null;
    this.Listado_de_Solicitud_de_ComprasData[index].Razon_de_la_Compra = formListado_de_Solicitud_de_Compras.value.Razon_de_la_Compra;
    this.Listado_de_Solicitud_de_ComprasData[index].Urgencia = formListado_de_Solicitud_de_Compras.value.Urgencia;
    this.Listado_de_Solicitud_de_ComprasData[index].Urgencia_Urgencia = formListado_de_Solicitud_de_Compras.value.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === formListado_de_Solicitud_de_Compras.value.Urgencia)[0] : null;
    this.Listado_de_Solicitud_de_ComprasData[index].Fecha_de_Entrega = formListado_de_Solicitud_de_Compras.value.Fecha_de_Entrega;
    this.Listado_de_Solicitud_de_ComprasData[index].Matricula = formListado_de_Solicitud_de_Compras.value.Matricula;
    this.Listado_de_Solicitud_de_ComprasData[index].Modelo = formListado_de_Solicitud_de_Compras.value.Modelo;
    this.Listado_de_Solicitud_de_ComprasData[index].No__de_Reporte = formListado_de_Solicitud_de_Compras.value.No__de_Reporte;
    this.Listado_de_Solicitud_de_ComprasData[index].No_O_T = formListado_de_Solicitud_de_Compras.value.No_O_T;
    this.Listado_de_Solicitud_de_ComprasData[index].Fecha_estimada_de_Mtto_ = formListado_de_Solicitud_de_Compras.value.Fecha_estimada_de_Mtto_;
    this.Listado_de_Solicitud_de_ComprasData[index].Estatus = formListado_de_Solicitud_de_Compras.value.Estatus;
    this.Listado_de_Solicitud_de_ComprasData[index].Solicitante = formListado_de_Solicitud_de_Compras.value.Solicitante;
    this.Listado_de_Solicitud_de_ComprasData[index].No__de_Solicitud = formListado_de_Solicitud_de_Compras.value.No__de_Solicitud;
    this.Listado_de_Solicitud_de_ComprasData[index].Estatus_de_Seguimiento = formListado_de_Solicitud_de_Compras.value.Estatus_de_Seguimiento;
    this.Listado_de_Solicitud_de_ComprasData[index].Estatus_de_Seguimiento_Estatus_de_Seguimiento = formListado_de_Solicitud_de_Compras.value.Estatus_de_Seguimiento !== '' ?
      this.varEstatus_de_Seguimiento.filter(d => d.Folio === formListado_de_Solicitud_de_Compras.value.Estatus_de_Seguimiento)[0] : null;
    this.Listado_de_Solicitud_de_ComprasData[index].Folio_de_detalle = formListado_de_Solicitud_de_Compras.value.Folio_de_detalle;
    this.Listado_de_Solicitud_de_ComprasData[index].Folio_de_solicitud = formListado_de_Solicitud_de_Compras.value.Folio_de_solicitud;
    this.Listado_de_Solicitud_de_ComprasData[index].Tipo_MR = formListado_de_Solicitud_de_Compras.value.Tipo_MR;
    this.Listado_de_Solicitud_de_ComprasData[index].Motivo_de_Rechazo = formListado_de_Solicitud_de_Compras.value.Motivo_de_Rechazo;

    this.Listado_de_Solicitud_de_ComprasData[index].isNew = false;
    this.dataSourceListado_de_Solicitud_de_Compras.data = this.Listado_de_Solicitud_de_ComprasData;
    this.dataSourceListado_de_Solicitud_de_Compras._updateChangeSubscription();
  }

  editListado_de_Solicitud_de_Compras(element: any) {
    const index = this.dataSourceListado_de_Solicitud_de_Compras.data.indexOf(element);
    const formListado_de_Solicitud_de_Compras = this.Listado_de_Solicitud_de_ComprasItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_de_Seguimiento_de_Solicitud_de_Compras(Folio: number) {
    this.dataSourceListado_de_Solicitud_de_Compras.data.forEach(async (d, index) => {
      const data = this.Listado_de_Solicitud_de_ComprasItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Seguimiento_de_Solicitud_de_Compras = Folio;


      if (model.Folio === 0) {
        // Add Listado de Solicitud de Compras
        let response = await this.Detalle_de_Seguimiento_de_Solicitud_de_ComprasService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formListado_de_Solicitud_de_Compras = this.Listado_de_Solicitud_de_ComprasItemsByFolio(model.Folio);
        if (formListado_de_Solicitud_de_Compras.dirty) {
          // Update Listado de Solicitud de Compras
          let response = await this.Detalle_de_Seguimiento_de_Solicitud_de_ComprasService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Listado de Solicitud de Compras
        await this.Detalle_de_Seguimiento_de_Solicitud_de_ComprasService.delete(model.Folio).toPromise();
      }
    });
  }


  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Seguimiento_de_Solicitud_de_ComprasForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.DepartamentoService.getAll());
    observablesArray.push(this.UrgenciaService.getAll());
    observablesArray.push(this.Estatus_de_SeguimientoService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varUnidad, varDepartamento, varUrgencia, varEstatus_de_Seguimiento]) => {
          this.varUnidad = varUnidad;
          this.varDepartamento = varDepartamento;
          this.varUrgencia = varUrgencia;
          this.varEstatus_de_Seguimiento = varEstatus_de_Seguimiento;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }


    this.setDataFromSelects()

  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Unidad': {
        this.UnidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUnidad = x.Unidads;
        });
        break;
      }
      case 'Departamento': {
        this.DepartamentoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDepartamento = x.Departamentos;
        });
        break;
      }
      case 'Urgencia': {
        this.UrgenciaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUrgencia = x.Urgencias;
        });
        break;
      }
      case 'Estatus_de_Seguimiento': {
        this.Estatus_de_SeguimientoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Seguimiento = x.Estatus_de_Seguimientos;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Seguimiento_de_Solicitud_de_ComprasForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Seguimiento_de_Solicitud_de_ComprasForm.get('Matricula').value.Matricula;
      entity.Modelo = this.Seguimiento_de_Solicitud_de_ComprasForm.get('Modelo').value.Clave;
      entity.Numero_de_Reporte = this.Seguimiento_de_Solicitud_de_ComprasForm.get('Numero_de_Reporte').value.Folio;
      entity.Numero_de_Parte = this.Seguimiento_de_Solicitud_de_ComprasForm.get('Numero_de_Parte').value.Folio;
      entity.Departamento = this.Seguimiento_de_Solicitud_de_ComprasForm.get('Departamento').value.Folio;
      entity.Solicitante = this.Seguimiento_de_Solicitud_de_ComprasForm.get('Solicitante').value.Id_User;
      entity.Urgencia = this.Seguimiento_de_Solicitud_de_ComprasForm.get('Urgencia').value.Folio;


      if (this.model.Folio > 0) {
        await this.Seguimiento_de_Solicitud_de_ComprasService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Seguimiento_de_Solicitud_de_Compras(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Seguimiento_de_Solicitud_de_ComprasService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Seguimiento_de_Solicitud_de_Compras(id);

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
      this.Seguimiento_de_Solicitud_de_ComprasForm.reset();
      this.model = new Seguimiento_de_Solicitud_de_Compras(this.fb);
      this.Seguimiento_de_Solicitud_de_ComprasForm = this.model.buildFormGroup();
      this.dataSourceListado_de_Solicitud_de_Compras = new MatTableDataSource<Detalle_de_Seguimiento_de_Solicitud_de_Compras>();
      this.Listado_de_Solicitud_de_ComprasData = [];

    } else {
      this.router.navigate(['views/Seguimiento_de_Solicitud_de_Compras/add']);
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
    this.router.navigate(['/Seguimiento_de_Solicitud_de_Compras/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Matricula_ExecuteBusinessRules(): void {
    //Matricula_FieldExecuteBusinessRulesEnd
  }
  Modelo_ExecuteBusinessRules(): void {
    //Modelo_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Reporte_ExecuteBusinessRules(): void {
    //Numero_de_Reporte_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Parte_ExecuteBusinessRules(): void {
    //Numero_de_Parte_FieldExecuteBusinessRulesEnd
  }
  Departamento_ExecuteBusinessRules(): void {
    //Departamento_FieldExecuteBusinessRulesEnd
  }
  Solicitante_ExecuteBusinessRules(): void {

    //INICIA - BRID:3969 - Llenar MR - Autor: Lizeth Villa - Actualización: 6/21/2021 4:36:00 PM
    //this.brf.FillMultiRenglonfromQuery(this.dataSourceListado_de_Solicitud_de_Compras, "Detalle_de_Seguimiento_de_Solicitud_de_Compras", 1, "ABC123");


    //TERMINA - BRID:3969

    //Solicitante_FieldExecuteBusinessRulesEnd

  }
  Urgencia_ExecuteBusinessRules(): void {
    //Urgencia_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:3908 - Asignar no requeridos siempre - Autor: Lizeth Villa - Actualización: 6/24/2021 1:44:52 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.Seguimiento_de_Solicitud_de_ComprasForm, "Folio");
      this.brf.SetNotRequiredControl(this.Seguimiento_de_Solicitud_de_ComprasForm, "Folio");
      this.brf.SetNotRequiredControl(this.Seguimiento_de_Solicitud_de_ComprasForm, "Matricula");
      this.brf.SetNotRequiredControl(this.Seguimiento_de_Solicitud_de_ComprasForm, "Modelo");
      this.brf.SetNotRequiredControl(this.Seguimiento_de_Solicitud_de_ComprasForm, "Numero_de_Reporte");
      this.brf.SetNotRequiredControl(this.Seguimiento_de_Solicitud_de_ComprasForm, "Numero_de_Parte");
      this.brf.SetNotRequiredControl(this.Seguimiento_de_Solicitud_de_ComprasForm, "Departamento");
      this.brf.SetNotRequiredControl(this.Seguimiento_de_Solicitud_de_ComprasForm, "Solicitante");
      this.brf.SetNotRequiredControl(this.Seguimiento_de_Solicitud_de_ComprasForm, "Urgencia");
    }
    //TERMINA - BRID:3908


    //INICIA - BRID:4000 - Ocultar columnas de folio en mr - Autor: Lizeth Villa - Actualización: 6/25/2021 6:37:03 PM
    if (this.operation == 'New') {
      this.brf.HideFieldofMultirenglon(this.Listado_de_Solicitud_de_ComprasColumns, "Estatus_de_Seguimiento");
      this.brf.HideFieldofMultirenglon(this.Listado_de_Solicitud_de_ComprasColumns, "Folio_de_detalle");
      this.brf.HideFieldofMultirenglon(this.Listado_de_Solicitud_de_ComprasColumns, "Folio_de_solicitud");
      this.brf.HideFieldofMultirenglon(this.Listado_de_Solicitud_de_ComprasColumns, "Tipo_MR");
    }
    //TERMINA - BRID:4000

    if (this.cancelacion) {
      this.brf.HideFieldofMultirenglon(this.Listado_de_Solicitud_de_ComprasColumns, "Gestion_de_compras");
      this.brf.HideFieldofMultirenglon(this.Listado_de_Solicitud_de_ComprasColumns, "Cotizar");
      this.brf.HideFieldofMultirenglon(this.Listado_de_Solicitud_de_ComprasColumns, "Cancelar");

    }

    this.getDataTable();

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

  //#region Obtener datos de Tabla
  getDataTable() {

    this.sqlModel.query = `EXEC spFiltrosSeguimientoCompras '${this.getFilters()}'`

    this._SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      if (result == null || result.length == 0) {
        this.generateMatTable([]);
        return
      }

      let dt = result[0].Table

      const data = [];
      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];

        this.varDepartamento.forEach(dpto => {
          if (resDt.Departamento != null && dpto.Folio == resDt.Departamento)
            resDt["Departamento_Nombre"] = dpto.Nombre
        });
        this.varUnidad.forEach(und => {
          if (resDt.Unidad != null && und.Clave == resDt.Unidad) {
            resDt["Unidad_Descripcion"] = und.Descripcion
          }
        });
        this.varUrgencia.forEach(urg => {
          if (resDt.Urgencia != null && urg.Folio == resDt.Urgencia) {
            resDt["Urgencia_Descripcion"] = urg.Descripcion
          }
        });

        resDt.IsDeleted = false;
        resDt.edit = false;
        resDt.isNew = true;
        data.push(resDt);
      }

      this.generateMatTable(data);

    });

  }
  //#endregion


  //#region Generar Mat Table
  generateMatTable(array) {
    this.loadListado_de_Solicitud_de_Compras(array);
    this.dataSourceListado_de_Solicitud_de_Compras = new MatTableDataSource(array);
    this.dataSourceListado_de_Solicitud_de_Compras.paginator = this.paginator;
    this.dataSourceListado_de_Solicitud_de_Compras.sort = this.sort;
  }
  //#endregion


  //#region Filtros de Consulta
  getFilters(): string {
    var where = !this.cancelacion ? "WHERE Estatus_de_Seguimiento IN (5,4) " : "WHERE Estatus_de_Seguimiento IN (9) "

    if (this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Matricula"].value) {
      where += `AND Matricula = ''${this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Matricula"].value}''`
    }
    if (this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Modelo"].value) {
      where += `AND Modelo_clave = ''${this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Modelo"].value}''`
    }
    if (this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Numero_de_Reporte"].value) {
      where += `AND No__de_Reporte = ''${this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Numero_de_Reporte"].value}''`
    }
    if (this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Numero_de_Parte"].value) {
      where += `AND Descripcion_clave LIKE ''${this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Numero_de_Parte"].value}''`
    }
    if (this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Departamento"].value) {
      where += `AND Departamento = ''${this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Departamento"].value}''`
    }
    if (this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Solicitante"].value) {
      where += `AND Solicitante_clave = ''${this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Solicitante"].value}''`
    }
    if (this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Urgencia"].value) {
      where += `AND Urgencia_clave = ''${this.Seguimiento_de_Solicitud_de_ComprasForm.controls["Urgencia"].value}''`
    }
    return where
  }
  //#endregion


  setMotivo_de_Cancelacion(value: string) {
    this.motivoRechazo = value;
  }


  //#region Abrir Ventana de Informacion Poliza
  openWindowInfoPoliza(element: any) {

    let url = this.router.serializeUrl(this.router.createUrlTree([`#/Seguros_Asociados_a_la_Aeronave/add`]));

    this.localStorageHelper.setItemToLocalStorage("MatriculaInfoPoliza", element.Matricula);

    this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1000, height=800, top=100, left=500");
    this.openWindows;
  }
  //#endregion


  //#region Abrir Modal para Cancelar Solicitud
  openModalCancel(content: any, element: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
        //modal.close(result: any)
        if (result) {
          this.fnCancelarSolicitud(element.Folio_de_solicitud)
        }
      },
      (reason) => {
        //modal.dismiss(reason: any)
      },
    );
  }
  //#endregion


  //#region Funcionalidad Cancelar Solicitud
  fnCancelarSolicitud(Folio_de_solicitud) {

    var opcion = confirm("¿Está seguro de cancelar esta solicitud?");
    if (opcion == true) {
      if (this.motivoRechazo != undefined && this.motivoRechazo.length > 0) {

        //Funcion Cancelar
        this.sqlModel.query = `exec usp_updFiltrosSeguimientoCompras_Estatus ${Folio_de_solicitud}, '${this.motivoRechazo}' `;

        this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
          next: (response) => {
            this.getDataTable()
          },
          error: (e) => console.error(e),
          complete: () => {
            this.motivoRechazo = '';
            this.motivoCancelar.setValue("")
            this.modalService.dismissAll();
          },

        })

      }
      else {
        alert('El motivo es requerido');
      }
    }
  }
  //#endregion


  //#region Al seleccionar para cotizar
  onChangeCotizarChecked(event: any, element: any) {
    element.Cotizar = event.checked
  }
  //#endregion


  //#region Validar Cotizacion
  fnValidarCotizacion() {
    let array = this.dataSourceListado_de_Solicitud_de_Compras.data;

    array = array.filter(element => element.Cotizar == true);

    if (array.length == 0) {
      this.ShowMessageType("Debe seleccionar un item para cotizar.", "warning")
    }

    return array
  }
  //#endregion


  //#region Agregar a Cotización
  fnOpenWindowCotizacion() {

    let arrayCotizacion = this.fnValidarCotizacion();
    let arrayDetalle = []

    if (arrayCotizacion.length > 0) {

      arrayCotizacion.forEach(element => {
        arrayDetalle.push({
          Folio: element.Folio_de_detalle,
          Tipo_MR: element.Tipo_MR,
          Folio_de_solicitud: element.Folio_de_solicitud,
          Descripcion: element.Descripcion,
          Cantidad: element.Cantidad,
          Unidad: element.Unidad,
        })
      });

      let url = this.router.serializeUrl(this.router.createUrlTree([`#/Solicitud_de_cotizacion/add`]));

      this.localStorageHelper.setItemToLocalStorage("ListadoCotizar", JSON.stringify(arrayDetalle));

      this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
      this.openWindows;

    }

  }
  //#endregion


  //#region Al seleccionar para comparativo
  onChangeGestion_de_comprasChecked(event: any, element: any) {
    element.Gestion_de_compras = event.checked
  }
  //#endregion


  //#region Validar Comparativo
  fnValidarComparativo() {
    let listadoSolicitud = this.dataSourceListado_de_Solicitud_de_Compras.data;

    listadoSolicitud = listadoSolicitud.filter(element => element.Gestion_de_compras == true);

    if (listadoSolicitud.length == 0) {
      this.ShowMessageType("Debe seleccionar al menos un item en Gestión de compras.", "warning")
    }
    else {
      let No__de_Solicitud = listadoSolicitud[0].No__de_Solicitud
      listadoSolicitud.forEach(element => {
        if (element.No__de_Solicitud != No__de_Solicitud) {
          this.ShowMessageType("Los registros seleccionados deben ser de la misma solicitud.", "warning")
          listadoSolicitud = []
        }
      })

      let arrayMismaSolicitud = this.dataSourceListado_de_Solicitud_de_Compras.data;
      arrayMismaSolicitud = arrayMismaSolicitud.filter(element => element.No__de_Solicitud == No__de_Solicitud);

      if (arrayMismaSolicitud.length > listadoSolicitud.length && listadoSolicitud.length > 0) {
        alert("Hay más registros de la solicitud.")
      }
    }

    return listadoSolicitud
  }
  //#endregion


  //#region Abrir Ventana Comparativo
  fnOpenWindowComparativo() {

    let arrayComparativo = this.fnValidarComparativo();
    let arrayDetalle = []

    if (arrayComparativo.length > 0) {

      arrayComparativo.forEach(element => {
        arrayDetalle.push({
          FolioDetalle: element.Folio_de_detalle,
          No__de_Solicitud: element.No__de_Solicitud,
          Solicitante: element.Solicitante,
          Solicitante_clave: element.Solicitante_clave,
          Fecha_de_Entrega: element.Fecha_de_Entrega,
          Razon_de_la_Compra: element.Razon_de_la_Compra,
          Departamento: element.Departamento,
          No_O_T: element.No_O_T,
          Matricula: element.Matricula,
          Modelo: element.Modelo,
          No__de_Reporte: element.No__de_Reporte,
          Tipo_MR: element.Tipo_MR,
          Folio_de_solicitud: element.Folio_de_solicitud,
          Descripcion: element.Descripcion,
          Cantidad: element.Cantidad,
          Unidad: element.Unidad,
          Fecha_estimada_de_Mtto_: element.Fecha_estimada_de_Mtto_,
          Ciclos_del_componente_a_Remover: element.Ciclos_del_componente_a_Remover,
          Horas_del_Componente_a_Remover: element.Horas_del_Componente_a_Remover,
          Condicion_de_la_Pieza_Solicitada: element.Condicion
        })
      });

      let url = this.router.serializeUrl(this.router.createUrlTree([`#/Comparativo_de_Proveedores_Piezas/add`]));

      this.localStorageHelper.setItemToLocalStorage("ComparativoSeguimiento", "true");
      this.localStorageHelper.setItemToLocalStorage("ListadoComparativo", JSON.stringify(arrayDetalle));

      this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
      this.openWindows;

    }
  }
  //#endregion


  //#region Refrescar Vista
  startTimer() {
    this.timerStart = true;
    this.interval = setInterval(() => {
      let Reset = +this.localStorageHelper.getItemFromLocalStorage("IsResetSeguimiento");
      if (Reset == 1) {
        this.localStorageHelper.setItemToLocalStorage("IsResetSeguimiento", "0");

        this.getDataTable();

        this.snackBar.open('Refrescando Vista.', '', {
          duration: 3000,
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

  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
  displayFnNumero_de_Reporte(option: Crear_Reporte) {
    return option?.No_Reporte;
  }
  displayFnNumero_de_Parte(option: Partes) {
    return option?.Numero_de_parte_Descripcion;
  }
  displayFnDepartamento(option: Departamento) {
    return option?.Nombre;
  }
  displayFnSolicitante(option: Spartan_User) {
    return option?.Name;
  }
  displayFnUrgencia(option: Urgencia) {
    return option?.Descripcion;
  }


  //#region Funcionalidad Boton Limpiar Filtros
  fnClearFilter() {
    this.Seguimiento_de_Solicitud_de_ComprasForm.reset();
    this.getDataTable();
    this.setDataFromSelects();
  }
  //#endregion


  //#region Completar información de Selects
  setDataFromSelects(): void {
    this.searchMatricula();
    this.searchModelo();
    this.searchNumero_de_Reporte();
    this.searchNumero_de_Parte();
    this.searchDepartamento();
    this.searchSolicitante();

  }
  //#endregion


  //#region Consulta de Matriculas
  searchMatricula(term?: string) {
    this.isLoadingMatricula = true;
    if (term == "" || term == null || term == undefined) {
      this.AeronaveService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingMatricula = false;

        let response = result["Aeronaves"].filter(element => element.Matricula != null);

        this.optionsMatricula = of(response);
      }, error => {
        this.isLoadingMatricula = false;
        this.optionsMatricula = of([]);
      });;
    }
    else if (term != "") {
      this.AeronaveService.listaSelAll(0, 20, "Aeronave.Matricula like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingMatricula = false;

        let response = result["Aeronaves"].filter(element => element.Matricula != null);

        this.optionsMatricula = of(response);
      }, error => {
        this.isLoadingMatricula = false;
        this.optionsMatricula = of([]);
      });;
    }
  }
  //#endregion


  //#region Consulta de Modelos
  searchModelo(term?: string) {
    this.isLoadingModelo = true;
    if (term == "" || term == null || term == undefined) {
      this.ModelosService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingModelo = false;

        let response = result["Modeloss"].filter(element => element.Descripcion != null);

        this.optionsModelo = of(response);
      }, error => {
        this.isLoadingModelo = false;
        this.optionsModelo = of([]);
      });;
    }
    else if (term != "") {
      this.ModelosService.listaSelAll(0, 20, "Modelos.Descripcion like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingModelo = false;

        let response = result["Modeloss"].filter(element => element.Descripcion != null);

        this.optionsModelo = of(response);
      }, error => {
        this.isLoadingModelo = false;
        this.optionsModelo = of([]);
      });;
    }

  }
  //#endregion


  //#region Consulta de Numero de Reporte
  searchNumero_de_Reporte(term?: string) {
    this.isLoadingNumero_de_Reporte = true;
    if (term == "" || term == null || term == undefined) {
      this.Crear_ReporteService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingNumero_de_Reporte = false;

        let response = result["Crear_Reportes"].filter(element => element.Folio != null);

        this.optionsNumero_de_Reporte = of(response);
      }, error => {
        this.isLoadingNumero_de_Reporte = false;
        this.optionsNumero_de_Reporte = of([]);
      });;
    }
    else if (term != "") {
      this.Crear_ReporteService.listaSelAll(0, 20, "Crear_Reporte.Folio like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingNumero_de_Reporte = false;

        let response = result["Crear_Reportes"].filter(element => element.Folio != null);

        this.optionsNumero_de_Reporte = of(response);
      }, error => {
        this.isLoadingNumero_de_Reporte = false;
        this.optionsNumero_de_Reporte = of([]);
      });;
    }

  }
  //#endregion


  //#region Consulta de Numero_de_Partes
  searchNumero_de_Parte(term?: string) {
    this.isLoadingNumero_de_Parte = true;
    if (term == "" || term == null || term == undefined) {
      this.PartesService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingNumero_de_Parte = false;

        let response = result["Partess"].filter(element => element.Numero_de_parte_Descripcion != null);

        this.optionsNumero_de_Parte = of(response);
      }, error => {
        this.isLoadingNumero_de_Parte = false;
        this.optionsNumero_de_Parte = of([]);
      });;
    }
    else if (term != "") {
      this.PartesService.listaSelAll(0, 20, "Partes.Numero_de_parte_Descripcion like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingNumero_de_Parte = false;

        let response = result["Partess"].filter(element => element.Numero_de_parte_Descripcion != null);

        this.optionsNumero_de_Parte = of(response);
      }, error => {
        this.isLoadingNumero_de_Parte = false;
        this.optionsNumero_de_Parte = of([]);
      });;
    }

  }
  //#endregion


  //#region Consulta de Departamentos
  searchDepartamento(term?: string) {
    this.isLoadingDepartamento = true;
    if (term == "" || term == null || term == undefined) {
      this.DepartamentoService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingDepartamento = false;

        let response = result["Departamentos"].filter(element => element.Nombre != null);

        this.optionsDepartamento = of(response);
      }, error => {
        this.isLoadingDepartamento = false;
        this.optionsDepartamento = of([]);
      });;
    }
    else if (term != "") {
      this.DepartamentoService.listaSelAll(0, 20, "Departamento.Nombre like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingDepartamento = false;

        let response = result["Departamentos"].filter(element => element.Nombre != null);

        this.optionsDepartamento = of(response);
      }, error => {
        this.isLoadingDepartamento = false;
        this.optionsDepartamento = of([]);
      });;
    }
  }
  //#endregion


  //#region Consulta de Solicitantes
  searchSolicitante(term?: string) {
    this.isLoadingSolicitante = true;
    if (term == "" || term == null || term == undefined) {
      this.Spartan_UserService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingSolicitante = false;

        let response = result["Spartan_Users"].filter(element => element.Name != null);

        this.optionsSolicitante = of(response);
      }, error => {
        this.isLoadingSolicitante = false;
        this.optionsSolicitante = of([]);
      });;
    }
    else if (term != "") {
      this.Spartan_UserService.listaSelAll(0, 20, "Spartan_User.Name like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingSolicitante = false;

        let response = result["Spartan_Users"].filter(element => element.Name != null);

        this.optionsSolicitante = of(response);
      }, error => {
        this.isLoadingSolicitante = false;
        this.optionsSolicitante = of([]);
      });;
    }

  }
  //#endregion


}
