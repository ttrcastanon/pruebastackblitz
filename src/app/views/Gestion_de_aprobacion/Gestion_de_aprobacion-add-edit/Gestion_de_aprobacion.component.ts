import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { GeneralService } from 'src/app/api-services/general.service';
import { Gestion_de_aprobacionService } from 'src/app/api-services/Gestion_de_aprobacion.service';
import { Gestion_de_aprobacion } from 'src/app/models/Gestion_de_aprobacion';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Departamento } from 'src/app/models/Departamento';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Detalle_de_Gestion_de_aprobacionService } from 'src/app/api-services/Detalle_de_Gestion_de_aprobacion.service';
import { Detalle_de_Gestion_de_aprobacion } from 'src/app/models/Detalle_de_Gestion_de_aprobacion';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { UrgenciaService } from 'src/app/api-services/Urgencia.service';
import { Urgencia } from 'src/app/models/Urgencia';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { Comparativo_de_Proveedores_PiezasService } from 'src/app/api-services/Comparativo_de_Proveedores_Piezas.service';
import { Comparativo_de_Proveedores_Piezas } from 'src/app/models/Comparativo_de_Proveedores_Piezas';
import { Gestion_de_ImportacionService } from 'src/app/api-services/Gestion_de_Importacion.service';
import { Gestion_de_Importacion } from 'src/app/models/Gestion_de_Importacion';
import { Gestion_de_ExportacionService } from 'src/app/api-services/Gestion_de_Exportacion.service';
import { Gestion_de_Exportacion } from 'src/app/models/Gestion_de_Exportacion';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';

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
import { DialogGeneracionDeOrdenDeComprasFormComponent } from '../../Generacion_de_Orden_de_Compras/dialog-Generacion_de_Orden_de_compras-form/dialog-Generacion_de_Orden_de_compras-form.component';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-Gestion_de_aprobacion',
  templateUrl: './Gestion_de_aprobacion.component.html',
  styleUrls: ['./Gestion_de_aprobacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class Gestion_de_aprobacionComponent implements OnInit, AfterViewInit, OnDestroy {
MRaddItems_Aprobados: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  public openWindows: any;

  Gestion_de_aprobacionForm: FormGroup;
  public Editor = ClassicEditor;
  model: Gestion_de_aprobacion;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  listaMatricula: Observable<Aeronave[]>;
  isLoadingMatricula: boolean = false;

  optionsModelo: Observable<Modelos[]>;
  hasOptionsModelo: boolean;
  listaModelo: Observable<Modelos[]>;
  isLoadingModelo: boolean = false;

  optionsNo__Reporte: Observable<Crear_Reporte[]>;
  hasOptionsNo__Reporte: boolean;
  listaNo__Reporte: Observable<Crear_Reporte[]>;
  isLoadingNo__Reporte: boolean = false;

  optionsDepartamento: Observable<Departamento[]>;
  hasOptionsDepartamento: boolean;
  listaDepartamento: Observable<Departamento[]>;
  isLoadingDepartamento: boolean = false;

  optionsSolicitante: Observable<Spartan_User[]>;
  hasOptionsSolicitante: boolean;
  listaSolicitante: Observable<Spartan_User[]>;
  isLoadingSolicitante: boolean = false;

  public varUnidad: Unidad[] = [];
  public varCreacion_de_Proveedores: Creacion_de_Proveedores[] = [];
  public varUrgencia: Urgencia[] = [];
  public varDepartamento: Departamento[] = [];
  public varPropietarios: Propietarios[] = [];
  public varAeronave: Aeronave[] = [];
  public varModelos: Modelos[] = [];
  public varCrear_Reporte: Crear_Reporte[] = [];
  public varOrden_de_Trabajo: Orden_de_Trabajo[] = [];
  public varSpartan_User: Spartan_User[] = [];
  public varEstatus_de_Seguimiento: Estatus_de_Seguimiento[] = [];
  public varComparativo_de_Proveedores_Piezas: Comparativo_de_Proveedores_Piezas[] = [];
  public varGestion_de_Importacion: Gestion_de_Importacion[] = [];
  public varGestion_de_Exportacion: Gestion_de_Exportacion[] = [];
  public varGeneracion_de_Orden_de_Compras: Generacion_de_Orden_de_Compras[] = [];

  autoProveedor_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedProveedor_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingProveedor_Detalle_de_Gestion_de_aprobacion: boolean;
  searchProveedor_Detalle_de_Gestion_de_aprobacionCompleted: boolean;
  autoPropietario_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedPropietario_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingPropietario_Detalle_de_Gestion_de_aprobacion: boolean;
  searchPropietario_Detalle_de_Gestion_de_aprobacionCompleted: boolean;
  autoMatricula_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedMatricula_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingMatricula_Detalle_de_Gestion_de_aprobacion: boolean;
  searchMatricula_Detalle_de_Gestion_de_aprobacionCompleted: boolean;
  autoModelo_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedModelo_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingModelo_Detalle_de_Gestion_de_aprobacion: boolean;
  searchModelo_Detalle_de_Gestion_de_aprobacionCompleted: boolean;
  autoNo__de_Reporte_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedNo__de_Reporte_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingNo__de_Reporte_Detalle_de_Gestion_de_aprobacion: boolean;
  searchNo__de_Reporte_Detalle_de_Gestion_de_aprobacionCompleted: boolean;
  autoNo__O_T_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedNo__O_T_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingNo__O_T_Detalle_de_Gestion_de_aprobacion: boolean;
  searchNo__O_T_Detalle_de_Gestion_de_aprobacionCompleted: boolean;
  autoIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion: boolean;
  searchIdComparativoProveedores_Detalle_de_Gestion_de_aprobacionCompleted: boolean;
  autoIdImportacion_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedIdImportacion_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingIdImportacion_Detalle_de_Gestion_de_aprobacion: boolean;
  searchIdImportacion_Detalle_de_Gestion_de_aprobacionCompleted: boolean;
  autoIdExportacion_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedIdExportacion_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingIdExportacion_Detalle_de_Gestion_de_aprobacion: boolean;
  searchIdExportacion_Detalle_de_Gestion_de_aprobacionCompleted: boolean;
  autoIdGeneracionOC_Detalle_de_Gestion_de_aprobacion = new FormControl();
  SelectedIdGeneracionOC_Detalle_de_Gestion_de_aprobacion: string[] = [];
  isLoadingIdGeneracionOC_Detalle_de_Gestion_de_aprobacion: boolean;
  searchIdGeneracionOC_Detalle_de_Gestion_de_aprobacionCompleted: boolean;


  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;

  public collapseAll = true;
  dataSourceItems_Aprobados = new MatTableDataSource<Detalle_de_Gestion_de_aprobacion>();

  Items_AprobadosColumns = [
    { def: 'actions', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Fecha_de_Entrega', hide: false },
    { def: 'Departamento', hide: false },
    { def: 'Razon_de_la_Solicitud', hide: false },
    { def: 'Propietario', hide: false },
    { def: 'Estatus', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'No__de_Reporte', hide: false },
    { def: 'No__O_T', hide: false },
    { def: 'Solicitante', hide: false },
    { def: 'No__Solicitud', hide: false },
    { def: 'Estatus_de_Flujo', hide: false },
    { def: 'IdComparativoProveedores', hide: false },
    { def: 'IdImportacion', hide: false },
    { def: 'IdExportacion', hide: false },
    { def: 'IdGeneracionOC', hide: false },
    { def: 'IdFolioDetalle', hide: false },
    { def: 'TipoMR', hide: false },
    { def: 'Generar_OC', hide: false },


  ];

  Items_AprobadosData: Detalle_de_Gestion_de_aprobacion[] = [];

  today = new Date;
  consult: boolean = false;
  timerStart: boolean = false;
  interval;
  notFound: string = "No se encontraron registros."
  loadingText: string = "Cargando..."

  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Gestion_de_aprobacionService: Gestion_de_aprobacionService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Crear_ReporteService: Crear_ReporteService,
    private DepartamentoService: DepartamentoService,
    private Spartan_UserService: Spartan_UserService,
    private Detalle_de_Gestion_de_aprobacionService: Detalle_de_Gestion_de_aprobacionService,
    private UnidadService: UnidadService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private UrgenciaService: UrgenciaService,
    private PropietariosService: PropietariosService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Estatus_de_SeguimientoService: Estatus_de_SeguimientoService,
    private Comparativo_de_Proveedores_PiezasService: Comparativo_de_Proveedores_PiezasService,
    private Gestion_de_ImportacionService: Gestion_de_ImportacionService,
    private Gestion_de_ExportacionService: Gestion_de_ExportacionService,
    private Generacion_de_Orden_de_ComprasService: Generacion_de_Orden_de_ComprasService,
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
    public dialog: MatDialog,
  ) {

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.model = new Gestion_de_aprobacion(this.fb);
    this.Gestion_de_aprobacionForm = this.model.buildFormGroup();
    this.Items_AprobadosItems.removeAt(0);

    this.Gestion_de_aprobacionForm.get('Folio').disable();
    this.Gestion_de_aprobacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngOnDestroy(): void {
    this.pauseTimer();
  }

  ngAfterViewInit(): void {
    this.dataSourceItems_Aprobados.paginator = this.paginator;

    this.rulesAfterViewInit();
  }


  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Items_AprobadosColumns.splice(0, 1);

        this.Gestion_de_aprobacionForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Gestion_de_aprobacion)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacionForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacionForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacionForm, 'No__Reporte', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacionForm, 'Departamento', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Gestion_de_aprobacionForm, 'Solicitante', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    if (!this.timerStart) {
      this.startTimer();
    }

    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Gestion_de_aprobacionService.listaSelAll(0, 1, 'Gestion_de_aprobacion.Folio=' + id).toPromise();
    if (result.Gestion_de_aprobacions.length > 0) {
      let fItems_Aprobados = await this.Detalle_de_Gestion_de_aprobacionService.listaSelAll(0, 1000, 'Gestion_de_aprobacion.Folio=' + id).toPromise();
      this.Items_AprobadosData = fItems_Aprobados.Detalle_de_Gestion_de_aprobacions;
      this.loadItems_Aprobados(fItems_Aprobados.Detalle_de_Gestion_de_aprobacions);
      this.dataSourceItems_Aprobados = new MatTableDataSource(fItems_Aprobados.Detalle_de_Gestion_de_aprobacions);
      this.dataSourceItems_Aprobados.paginator = this.paginator;
      this.dataSourceItems_Aprobados.sort = this.sort;

      this.model.fromObject(result.Gestion_de_aprobacions[0]);
      this.Gestion_de_aprobacionForm.get('Matricula').setValue(
        result.Gestion_de_aprobacions[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.Gestion_de_aprobacionForm.get('Modelo').setValue(
        result.Gestion_de_aprobacions[0].Modelo_Modelos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Gestion_de_aprobacionForm.get('No__Reporte').setValue(
        result.Gestion_de_aprobacions[0].No__Reporte_Crear_Reporte.No_Reporte,
        { onlySelf: false, emitEvent: true }
      );
      this.Gestion_de_aprobacionForm.get('Departamento').setValue(
        result.Gestion_de_aprobacions[0].Departamento_Departamento.Nombre,
        { onlySelf: false, emitEvent: true }
      );
      this.Gestion_de_aprobacionForm.get('Solicitante').setValue(
        result.Gestion_de_aprobacions[0].Solicitante_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );

      this.Gestion_de_aprobacionForm.markAllAsTouched();
      this.Gestion_de_aprobacionForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Items_AprobadosItems() {
    return this.Gestion_de_aprobacionForm.get('Detalle_de_Gestion_de_aprobacionItems') as FormArray;
  }

  getItems_AprobadosColumns(): string[] {
    return this.Items_AprobadosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadItems_Aprobados(Items_Aprobados: Detalle_de_Gestion_de_aprobacion[]) {
    Items_Aprobados.forEach(element => {
      this.addItems_Aprobados(element);
    });
  }

  addItems_AprobadosToMR() {
    const Items_Aprobados = new Detalle_de_Gestion_de_aprobacion(this.fb);
    this.Items_AprobadosData.push(this.addItems_Aprobados(Items_Aprobados));
    this.dataSourceItems_Aprobados.data = this.Items_AprobadosData;
    Items_Aprobados.edit = true;
    Items_Aprobados.isNew = true;
    const length = this.dataSourceItems_Aprobados.data.length;
    const index = length - 1;
    const formItems_Aprobados = this.Items_AprobadosItems.controls[index] as FormGroup;
    this.addFilterToControlProveedor_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.Proveedor, index);
    this.addFilterToControlPropietario_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.Propietario, index);
    this.addFilterToControlMatricula_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.Matricula, index);
    this.addFilterToControlModelo_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.Modelo, index);
    this.addFilterToControlNo__de_Reporte_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.No__de_Reporte, index);
    this.addFilterToControlNo__O_T_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.No__O_T, index);
    this.addFilterToControlIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.IdComparativoProveedores, index);
    this.addFilterToControlIdImportacion_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.IdImportacion, index);
    this.addFilterToControlIdExportacion_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.IdExportacion, index);
    this.addFilterToControlIdGeneracionOC_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.IdGeneracionOC, index);

    const page = Math.ceil(this.dataSourceItems_Aprobados.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addItems_Aprobados(entity: Detalle_de_Gestion_de_aprobacion) {
    const Items_Aprobados = new Detalle_de_Gestion_de_aprobacion(this.fb);
    this.Items_AprobadosItems.push(Items_Aprobados.buildFormGroup());
    if (entity) {
      Items_Aprobados.fromObject(entity);
    }
    return entity;
  }

  Items_AprobadosItemsByFolio(Folio: number): FormGroup {
    return (this.Gestion_de_aprobacionForm.get('Detalle_de_Gestion_de_aprobacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Items_AprobadosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    let fb = this.Items_AprobadosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteItems_Aprobados(element: any) {
    let index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.Items_AprobadosData[index].IsDeleted = true;
    this.dataSourceItems_Aprobados.data = this.Items_AprobadosData;
    this.dataSourceItems_Aprobados._updateChangeSubscription();
    index = this.dataSourceItems_Aprobados.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditItems_Aprobados(element: any) {
    let index = this.dataSourceItems_Aprobados.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Items_AprobadosData[index].IsDeleted = true;
      this.dataSourceItems_Aprobados.data = this.Items_AprobadosData;
      this.dataSourceItems_Aprobados._updateChangeSubscription();
      index = this.Items_AprobadosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveItems_Aprobados(element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    const formItems_Aprobados = this.Items_AprobadosItems.controls[index] as FormGroup;
    this.Items_AprobadosData[index].Descripcion = formItems_Aprobados.value.Descripcion;
    this.Items_AprobadosData[index].Cantidad = formItems_Aprobados.value.Cantidad;
    this.Items_AprobadosData[index].Unidad = formItems_Aprobados.value.Unidad;
    this.Items_AprobadosData[index].Unidad_Unidad = formItems_Aprobados.value.Unidad !== '' ?
      this.varUnidad.filter(d => d.Clave === formItems_Aprobados.value.Unidad)[0] : null;
    if (this.Items_AprobadosData[index].Proveedor !== formItems_Aprobados.value.Proveedor && formItems_Aprobados.value.Proveedor > 0) {
      let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formItems_Aprobados.value.Proveedor).toPromise();
      this.Items_AprobadosData[index].Proveedor_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Items_AprobadosData[index].Proveedor = formItems_Aprobados.value.Proveedor;
    this.Items_AprobadosData[index].Urgencia = formItems_Aprobados.value.Urgencia;
    this.Items_AprobadosData[index].Urgencia_Urgencia = formItems_Aprobados.value.Urgencia !== '' ?
      this.varUrgencia.filter(d => d.Folio === formItems_Aprobados.value.Urgencia)[0] : null;
    this.Items_AprobadosData[index].Fecha_de_Entrega = formItems_Aprobados.value.Fecha_de_Entrega;
    this.Items_AprobadosData[index].Departamento = formItems_Aprobados.value.Departamento;
    this.Items_AprobadosData[index].Departamento_Departamento = formItems_Aprobados.value.Departamento !== '' ?
      this.varDepartamento.filter(d => d.Folio === formItems_Aprobados.value.Departamento)[0] : null;
    this.Items_AprobadosData[index].Razon_de_la_Solicitud = formItems_Aprobados.value.Razon_de_la_Solicitud;
    if (this.Items_AprobadosData[index].Propietario !== formItems_Aprobados.value.Propietario && formItems_Aprobados.value.Propietario > 0) {
      let propietarios = await this.PropietariosService.getById(formItems_Aprobados.value.Propietario).toPromise();
      this.Items_AprobadosData[index].Propietario_Propietarios = propietarios;
    }
    this.Items_AprobadosData[index].Propietario = formItems_Aprobados.value.Propietario;
    this.Items_AprobadosData[index].Estatus = formItems_Aprobados.value.Estatus;
    if (this.Items_AprobadosData[index].Matricula !== formItems_Aprobados.value.Matricula && formItems_Aprobados.value.Matricula > 0) {
      let aeronave = await this.AeronaveService.getById(formItems_Aprobados.value.Matricula).toPromise();
      this.Items_AprobadosData[index].Matricula_Aeronave = aeronave;
    }
    this.Items_AprobadosData[index].Matricula = formItems_Aprobados.value.Matricula;
    if (this.Items_AprobadosData[index].Modelo !== formItems_Aprobados.value.Modelo && formItems_Aprobados.value.Modelo > 0) {
      let modelos = await this.ModelosService.getById(formItems_Aprobados.value.Modelo).toPromise();
      this.Items_AprobadosData[index].Modelo_Modelos = modelos;
    }
    this.Items_AprobadosData[index].Modelo = formItems_Aprobados.value.Modelo;
    if (this.Items_AprobadosData[index].No__de_Reporte !== formItems_Aprobados.value.No__de_Reporte && formItems_Aprobados.value.No__de_Reporte > 0) {
      let crear_reporte = await this.Crear_ReporteService.getById(formItems_Aprobados.value.No__de_Reporte).toPromise();
      this.Items_AprobadosData[index].No__de_Reporte_Crear_Reporte = crear_reporte;
    }
    this.Items_AprobadosData[index].No__de_Reporte = formItems_Aprobados.value.No__de_Reporte;
    if (this.Items_AprobadosData[index].No__O_T !== formItems_Aprobados.value.No__O_T && formItems_Aprobados.value.No__O_T > 0) {
      let orden_de_trabajo = await this.Orden_de_TrabajoService.getById(formItems_Aprobados.value.No__O_T).toPromise();
      this.Items_AprobadosData[index].No__O_T_Orden_de_Trabajo = orden_de_trabajo;
    }
    this.Items_AprobadosData[index].No__O_T = formItems_Aprobados.value.No__O_T;
    this.Items_AprobadosData[index].Solicitante = formItems_Aprobados.value.Solicitante;
    this.Items_AprobadosData[index].Solicitante_Spartan_User = formItems_Aprobados.value.Solicitante !== '' ?
      this.varSpartan_User.filter(d => d.Id_User === formItems_Aprobados.value.Solicitante)[0] : null;
    this.Items_AprobadosData[index].No__Solicitud = formItems_Aprobados.value.No__Solicitud;
    this.Items_AprobadosData[index].Estatus_de_Flujo = formItems_Aprobados.value.Estatus_de_Flujo;
    this.Items_AprobadosData[index].Estatus_de_Flujo_Estatus_de_Seguimiento = formItems_Aprobados.value.Estatus_de_Flujo !== '' ?
      this.varEstatus_de_Seguimiento.filter(d => d.Folio === formItems_Aprobados.value.Estatus_de_Flujo)[0] : null;
    if (this.Items_AprobadosData[index].IdComparativoProveedores !== formItems_Aprobados.value.IdComparativoProveedores && formItems_Aprobados.value.IdComparativoProveedores > 0) {
      let comparativo_de_proveedores_piezas = await this.Comparativo_de_Proveedores_PiezasService.getById(formItems_Aprobados.value.IdComparativoProveedores).toPromise();
      this.Items_AprobadosData[index].IdComparativoProveedores_Comparativo_de_Proveedores_Piezas = comparativo_de_proveedores_piezas;
    }
    this.Items_AprobadosData[index].IdComparativoProveedores = formItems_Aprobados.value.IdComparativoProveedores;
    if (this.Items_AprobadosData[index].IdImportacion !== formItems_Aprobados.value.IdImportacion && formItems_Aprobados.value.IdImportacion > 0) {
      let gestion_de_importacion = await this.Gestion_de_ImportacionService.getById(formItems_Aprobados.value.IdImportacion).toPromise();
      this.Items_AprobadosData[index].IdImportacion_Gestion_de_Importacion = gestion_de_importacion;
    }
    this.Items_AprobadosData[index].IdImportacion = formItems_Aprobados.value.IdImportacion;
    if (this.Items_AprobadosData[index].IdExportacion !== formItems_Aprobados.value.IdExportacion && formItems_Aprobados.value.IdExportacion > 0) {
      let gestion_de_exportacion = await this.Gestion_de_ExportacionService.getById(formItems_Aprobados.value.IdExportacion).toPromise();
      this.Items_AprobadosData[index].IdExportacion_Gestion_de_Exportacion = gestion_de_exportacion;
    }
    this.Items_AprobadosData[index].IdExportacion = formItems_Aprobados.value.IdExportacion;
    if (this.Items_AprobadosData[index].IdGeneracionOC !== formItems_Aprobados.value.IdGeneracionOC && formItems_Aprobados.value.IdGeneracionOC > 0) {
      let generacion_de_orden_de_compras = await this.Generacion_de_Orden_de_ComprasService.getById(formItems_Aprobados.value.IdGeneracionOC).toPromise();
      this.Items_AprobadosData[index].IdGeneracionOC_Generacion_de_Orden_de_Compras = generacion_de_orden_de_compras;
    }
    this.Items_AprobadosData[index].IdGeneracionOC = formItems_Aprobados.value.IdGeneracionOC;
    this.Items_AprobadosData[index].IdFolioDetalle = formItems_Aprobados.value.IdFolioDetalle;
    this.Items_AprobadosData[index].TipoMR = formItems_Aprobados.value.TipoMR;

    this.Items_AprobadosData[index].isNew = false;
    this.dataSourceItems_Aprobados.data = this.Items_AprobadosData;
    this.dataSourceItems_Aprobados._updateChangeSubscription();
  }

  editItems_Aprobados(element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    const formItems_Aprobados = this.Items_AprobadosItems.controls[index] as FormGroup;
    this.SelectedProveedor_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].Proveedor_Creacion_de_Proveedores.Razon_social;
    this.addFilterToControlProveedor_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.Proveedor, index);
    this.SelectedPropietario_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].Propietario_Propietarios.Nombre;
    this.addFilterToControlPropietario_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.Propietario, index);
    this.SelectedMatricula_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].Matricula_Aeronave.Matricula;
    this.addFilterToControlMatricula_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.Matricula, index);
    this.SelectedModelo_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.Modelo, index);
    this.SelectedNo__de_Reporte_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].No__de_Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlNo__de_Reporte_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.No__de_Reporte, index);
    this.SelectedNo__O_T_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].No__O_T_Orden_de_Trabajo.numero_de_orden;
    this.addFilterToControlNo__O_T_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.No__O_T, index);
    this.SelectedIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].IdComparativoProveedores_Comparativo_de_Proveedores_Piezas.FolioComparativoProv;
    this.addFilterToControlIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.IdComparativoProveedores, index);
    this.SelectedIdImportacion_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].IdImportacion_Gestion_de_Importacion.FolioGestiondeImportacion;
    this.addFilterToControlIdImportacion_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.IdImportacion, index);
    this.SelectedIdExportacion_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].IdExportacion_Gestion_de_Exportacion.FolioExportacion;
    this.addFilterToControlIdExportacion_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.IdExportacion, index);
    this.SelectedIdGeneracionOC_Detalle_de_Gestion_de_aprobacion[index] = this.dataSourceItems_Aprobados.data[index].IdGeneracionOC_Generacion_de_Orden_de_Compras.FolioGeneracionOC;
    this.addFilterToControlIdGeneracionOC_Detalle_de_Gestion_de_aprobacion(formItems_Aprobados.controls.IdGeneracionOC, index);

    element.edit = true;
  }

  async saveDetalle_de_Gestion_de_aprobacion(Folio: number) {
    this.dataSourceItems_Aprobados.data.forEach(async (d, index) => {
      const data = this.Items_AprobadosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Gestion_de_aprobacion = Folio;


      if (model.Folio === 0) {
        // Add Items Aprobados
        let response = await this.Detalle_de_Gestion_de_aprobacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formItems_Aprobados = this.Items_AprobadosItemsByFolio(model.Folio);
        if (formItems_Aprobados.dirty) {
          // Update Items Aprobados
          let response = await this.Detalle_de_Gestion_de_aprobacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Items Aprobados
        await this.Detalle_de_Gestion_de_aprobacionService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectProveedor_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Proveedor.setValue(event.option.value);
    this.displayFnProveedor_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnProveedor_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedProveedor_Detalle_de_Gestion_de_aprobacion[index];
  }

  updateOptionProveedor_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedProveedor_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterProveedor_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Creacion_de_Proveedores> {
    const where = filter !== '' ? "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
    return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
  }

  addFilterToControlProveedor_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterProveedor_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_Detalle_de_Gestion_de_aprobacion = false;
      this.searchProveedor_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedProveedor_Detalle_de_Gestion_de_aprobacion[index] = this.varCreacion_de_Proveedores.length === 0 ? '' : this.SelectedProveedor_Detalle_de_Gestion_de_aprobacion[index];
    });
  }

  public selectPropietario_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedPropietario_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Propietario.setValue(event.option.value);
    this.displayFnPropietario_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnPropietario_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedPropietario_Detalle_de_Gestion_de_aprobacion[index];
  }

  updateOptionPropietario_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedPropietario_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterPropietario_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Propietarios> {
    const where = filter !== '' ? "Propietarios.Nombre like '%" + filter + "%'" : '';
    return this.PropietariosService.listaSelAll(0, 20, where);
  }

  addFilterToControlPropietario_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingPropietario_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingPropietario_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterPropietario_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varPropietarios = result.Propietarioss;
      this.isLoadingPropietario_Detalle_de_Gestion_de_aprobacion = false;
      this.searchPropietario_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedPropietario_Detalle_de_Gestion_de_aprobacion[index] = this.varPropietarios.length === 0 ? '' : this.SelectedPropietario_Detalle_de_Gestion_de_aprobacion[index];
    });
  }

  public selectMatricula_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMatricula_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Matricula.setValue(event.option.value);
    this.displayFnMatricula_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnMatricula_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedMatricula_Detalle_de_Gestion_de_aprobacion[index];
  }

  updateOptionMatricula_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedMatricula_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterMatricula_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Aeronave> {
    const where = filter !== '' ? "Aeronave.Matricula like '%" + filter + "%'" : '';
    return this.AeronaveService.listaSelAll(0, 20, where);
  }

  addFilterToControlMatricula_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMatricula_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMatricula_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterMatricula_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingMatricula_Detalle_de_Gestion_de_aprobacion = false;
      this.searchMatricula_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedMatricula_Detalle_de_Gestion_de_aprobacion[index] = this.varAeronave.length === 0 ? '' : this.SelectedMatricula_Detalle_de_Gestion_de_aprobacion[index];
    });
  }

  public selectModelo_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnModelo_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedModelo_Detalle_de_Gestion_de_aprobacion[index];
  }

  updateOptionModelo_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedModelo_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterModelo_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Modelos> {
    const where = filter !== '' ? "Modelos.Descripcion like '%" + filter + "%'" : '';
    return this.ModelosService.listaSelAll(0, 20, where);
  }

  addFilterToControlModelo_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterModelo_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_de_Gestion_de_aprobacion = false;
      this.searchModelo_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedModelo_Detalle_de_Gestion_de_aprobacion[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_de_Gestion_de_aprobacion[index];
    });
  }

  public selectNo__de_Reporte_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__de_Reporte_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.No__de_Reporte.setValue(event.option.value);
    this.displayFnNo__de_Reporte_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnNo__de_Reporte_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedNo__de_Reporte_Detalle_de_Gestion_de_aprobacion[index];
  }

  updateOptionNo__de_Reporte_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedNo__de_Reporte_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterNo__de_Reporte_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Crear_Reporte> {
    const where = filter !== '' ? "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';
    return this.Crear_ReporteService.listaSelAll(0, 20, where);
  }

  addFilterToControlNo__de_Reporte_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__de_Reporte_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__de_Reporte_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterNo__de_Reporte_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingNo__de_Reporte_Detalle_de_Gestion_de_aprobacion = false;
      this.searchNo__de_Reporte_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedNo__de_Reporte_Detalle_de_Gestion_de_aprobacion[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedNo__de_Reporte_Detalle_de_Gestion_de_aprobacion[index];
    });
  }

  public selectNo__O_T_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo__O_T_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.No__O_T.setValue(event.option.value);
    this.displayFnNo__O_T_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnNo__O_T_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedNo__O_T_Detalle_de_Gestion_de_aprobacion[index];
  }

  updateOptionNo__O_T_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedNo__O_T_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterNo__O_T_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Orden_de_Trabajo> {
    const where = filter !== '' ? "Orden_de_Trabajo.numero_de_orden like '%" + filter + "%'" : '';
    return this.Orden_de_TrabajoService.listaSelAll(0, 20, where);
  }

  addFilterToControlNo__O_T_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo__O_T_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo__O_T_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterNo__O_T_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varOrden_de_Trabajo = result.Orden_de_Trabajos;
      this.isLoadingNo__O_T_Detalle_de_Gestion_de_aprobacion = false;
      this.searchNo__O_T_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedNo__O_T_Detalle_de_Gestion_de_aprobacion[index] = this.varOrden_de_Trabajo.length === 0 ? '' : this.SelectedNo__O_T_Detalle_de_Gestion_de_aprobacion[index];
    });
  }

  public selectIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.IdComparativoProveedores.setValue(event.option.value);
    this.displayFnIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion[index];
  }

  updateOptionIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Comparativo_de_Proveedores_Piezas> {
    const where = filter !== '' ? "Comparativo_de_Proveedores_Piezas.FolioComparativoProv like '%" + filter + "%'" : '';
    return this.Comparativo_de_Proveedores_PiezasService.listaSelAll(0, 20, where);
  }

  addFilterToControlIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varComparativo_de_Proveedores_Piezas = result.Comparativo_de_Proveedores_Piezass;
      this.isLoadingIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion = false;
      this.searchIdComparativoProveedores_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion[index] = this.varComparativo_de_Proveedores_Piezas.length === 0 ? '' : this.SelectedIdComparativoProveedores_Detalle_de_Gestion_de_aprobacion[index];
    });
  }

  public selectIdImportacion_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdImportacion_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.IdImportacion.setValue(event.option.value);
    this.displayFnIdImportacion_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnIdImportacion_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedIdImportacion_Detalle_de_Gestion_de_aprobacion[index];
  }

  updateOptionIdImportacion_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedIdImportacion_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterIdImportacion_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Gestion_de_Importacion> {
    const where = filter !== '' ? "Gestion_de_Importacion.FolioGestiondeImportacion like '%" + filter + "%'" : '';
    return this.Gestion_de_ImportacionService.listaSelAll(0, 20, where);
  }

  addFilterToControlIdImportacion_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdImportacion_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdImportacion_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterIdImportacion_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varGestion_de_Importacion = result.Gestion_de_Importacions;
      this.isLoadingIdImportacion_Detalle_de_Gestion_de_aprobacion = false;
      this.searchIdImportacion_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedIdImportacion_Detalle_de_Gestion_de_aprobacion[index] = this.varGestion_de_Importacion.length === 0 ? '' : this.SelectedIdImportacion_Detalle_de_Gestion_de_aprobacion[index];
    });
  }
  public selectIdExportacion_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdExportacion_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.IdExportacion.setValue(event.option.value);
    this.displayFnIdExportacion_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnIdExportacion_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedIdExportacion_Detalle_de_Gestion_de_aprobacion[index];
  }
  updateOptionIdExportacion_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedIdExportacion_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterIdExportacion_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Gestion_de_Exportacion> {
    const where = filter !== '' ? "Gestion_de_Exportacion.FolioExportacion like '%" + filter + "%'" : '';
    return this.Gestion_de_ExportacionService.listaSelAll(0, 20, where);
  }

  addFilterToControlIdExportacion_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdExportacion_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdExportacion_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterIdExportacion_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varGestion_de_Exportacion = result.Gestion_de_Exportacions;
      this.isLoadingIdExportacion_Detalle_de_Gestion_de_aprobacion = false;
      this.searchIdExportacion_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedIdExportacion_Detalle_de_Gestion_de_aprobacion[index] = this.varGestion_de_Exportacion.length === 0 ? '' : this.SelectedIdExportacion_Detalle_de_Gestion_de_aprobacion[index];
    });
  }

  public selectIdGeneracionOC_Detalle_de_Gestion_de_aprobacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedIdGeneracionOC_Detalle_de_Gestion_de_aprobacion[index] = event.option.viewValue;
    let fgr = this.Gestion_de_aprobacionForm.controls.Detalle_de_Gestion_de_aprobacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.IdGeneracionOC.setValue(event.option.value);
    this.displayFnIdGeneracionOC_Detalle_de_Gestion_de_aprobacion(element);
  }

  displayFnIdGeneracionOC_Detalle_de_Gestion_de_aprobacion(this, element) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    return this.SelectedIdGeneracionOC_Detalle_de_Gestion_de_aprobacion[index];
  }

  updateOptionIdGeneracionOC_Detalle_de_Gestion_de_aprobacion(event, element: any) {
    const index = this.dataSourceItems_Aprobados.data.indexOf(element);
    this.SelectedIdGeneracionOC_Detalle_de_Gestion_de_aprobacion[index] = event.source.viewValue;
  }

  _filterIdGeneracionOC_Detalle_de_Gestion_de_aprobacion(filter: any): Observable<Generacion_de_Orden_de_Compras> {
    const where = filter !== '' ? "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + filter + "%'" : '';
    return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, where);
  }

  addFilterToControlIdGeneracionOC_Detalle_de_Gestion_de_aprobacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingIdGeneracionOC_Detalle_de_Gestion_de_aprobacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingIdGeneracionOC_Detalle_de_Gestion_de_aprobacion = true;
        return this._filterIdGeneracionOC_Detalle_de_Gestion_de_aprobacion(value || '');
      })
    ).subscribe(result => {
      this.varGeneracion_de_Orden_de_Compras = result.Generacion_de_Orden_de_Comprass;
      this.isLoadingIdGeneracionOC_Detalle_de_Gestion_de_aprobacion = false;
      this.searchIdGeneracionOC_Detalle_de_Gestion_de_aprobacionCompleted = true;
      this.SelectedIdGeneracionOC_Detalle_de_Gestion_de_aprobacion[index] = this.varGeneracion_de_Orden_de_Compras.length === 0 ? '' : this.SelectedIdGeneracionOC_Detalle_de_Gestion_de_aprobacion[index];
    });
  }


  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Gestion_de_aprobacionForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.UrgenciaService.getAll());
    observablesArray.push(this.DepartamentoService.getAll());
    observablesArray.push(this.Spartan_UserService.getAll());
    observablesArray.push(this.Estatus_de_SeguimientoService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varUnidad, varUrgencia, varDepartamento, varSpartan_User, varEstatus_de_Seguimiento]) => {
          this.varUnidad = varUnidad;
          this.varUrgencia = varUrgencia;
          this.varDepartamento = varDepartamento;
          this.varSpartan_User = varSpartan_User;
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
      case 'Urgencia': {
        this.UrgenciaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUrgencia = x.Urgencias;
        });
        break;
      }
      case 'Departamento': {
        this.DepartamentoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDepartamento = x.Departamentos;
        });
        break;
      }
      case 'Solicitante': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Estatus_de_Flujo': {
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

  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
  displayFnNo__Reporte(option: Crear_Reporte) {
    return option?.No_Reporte;
  }
  displayFnDepartamento(option: Departamento) {
    return option?.Nombre;
  }
  displayFnSolicitante(option: Spartan_User) {
    return option?.Name;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Gestion_de_aprobacionForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Gestion_de_aprobacionForm.get('Matricula').value.Matricula;
      entity.Modelo = this.Gestion_de_aprobacionForm.get('Modelo').value.Clave;
      entity.No__Reporte = this.Gestion_de_aprobacionForm.get('No__Reporte').value.Folio;
      entity.Departamento = this.Gestion_de_aprobacionForm.get('Departamento').value.Folio;
      entity.Solicitante = this.Gestion_de_aprobacionForm.get('Solicitante').value.Id_User;


      if (this.model.Folio > 0) {
        await this.Gestion_de_aprobacionService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Gestion_de_aprobacion(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Gestion_de_aprobacionService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Gestion_de_aprobacion(id);

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
      this.Gestion_de_aprobacionForm.reset();
      this.model = new Gestion_de_aprobacion(this.fb);
      this.Gestion_de_aprobacionForm = this.model.buildFormGroup();
      this.dataSourceItems_Aprobados = new MatTableDataSource<Detalle_de_Gestion_de_aprobacion>();
      this.Items_AprobadosData = [];

    } else {
      this.router.navigate(['views/Gestion_de_aprobacion/add']);
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
    this.router.navigate(['/Gestion_de_aprobacion/list'], { state: { data: this.dataListConfig } });
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
  No__Reporte_ExecuteBusinessRules(): void {
    //No__Reporte_FieldExecuteBusinessRulesEnd
  }
  No__Parte_ExecuteBusinessRules(): void {
    //No__Parte_FieldExecuteBusinessRulesEnd
  }
  Departamento_ExecuteBusinessRules(): void {
    //Departamento_FieldExecuteBusinessRulesEnd
  }
  Solicitante_ExecuteBusinessRules(): void {

    //INICIA - BRID:4084 - Mostrar info en MR - Autor: Lizeth Villa - Actualización: 7/7/2021 4:32:19 PM
    this.brf.FillMultiRenglonfromQuery(this.dataSourceItems_Aprobados, "Detalle_de_Gestion_de_aprobacion", 1, "ABC123");
    //TERMINA - BRID:4084

    //Solicitante_FieldExecuteBusinessRulesEnd

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

    //#region BRID:4066 - Ocultar folio y asignar no requeridos  - Autor: Lizeth Villa - Actualización: 7/5/2021 5:39:07 PM
    this.brf.HideFieldOfForm(this.Gestion_de_aprobacionForm, "Folio");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "Folio");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "Fecha_de_Registro");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "Hora_de_Registro");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "Usuario_que_Registra");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "Matricula");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "Modelo");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "No__Reporte");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "No__Parte");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "Departamento");
    this.brf.SetNotRequiredControl(this.Gestion_de_aprobacionForm, "Solicitante");
    //#endregion


    //#region BRID:4085 - ocultar columna de mr - Autor: Lizeth Villa - Actualización: 7/19/2021 3:06:55 AM
    this.brf.HideFieldofMultirenglon(this.Items_AprobadosColumns, "Estatus_de_Flujo");
    this.brf.HideFieldofMultirenglon(this.Items_AprobadosColumns, "Estatus_de_Flujo");
    this.brf.HideFieldofMultirenglon(this.Items_AprobadosColumns, "IdGeneracionOC");
    /* this.brf.HideFieldofMultirenglon(this.Items_AprobadosColumns, "IdComparativoProveedores");
    this.brf.HideFieldofMultirenglon(this.Items_AprobadosColumns, "IdImportacion");
    this.brf.HideFieldofMultirenglon(this.Items_AprobadosColumns, "IdExportacion");*/
    //#endregion

    //#region Manual: Ocultar Columnas MR 
    this.brf.HideFieldofMultirenglon(this.Items_AprobadosColumns, "actions");
    this.brf.HideFieldofMultirenglon(this.Items_AprobadosColumns, "IdFolioDetalle");
    this.brf.HideFieldofMultirenglon(this.Items_AprobadosColumns, "TipoMR");
    //#endregion

    this.getDataTable();

    //rulesOnInit_ExecuteBusinessRulesEnd



  }

  disabledbtn: boolean = true

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

  //#region Funcionalidad Boton Limpiar Filtros
  fnClearFilter() {
    this.Gestion_de_aprobacionForm.reset();
    this.getDataTable();
    this.setDataFromSelects();
  }
  //#endregion


  //#region Funcionalidad Boton Consultar
  fnConsultar() {
    this.getDataTable()
  }
  //#endregion


  //#region Definir Mensajes
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
  //#endregion


  //#region Obtener DataTable
  getDataTable() {
    this.dataSourceItems_Aprobados = new MatTableDataSource([]);

    this.sqlModel.query = `EXEC spItemsGestiondeAprobacion '${this.getFilters()}' `

    this._SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      if (result == null || result.length == 0) {
        this.generateMatTable([])
        return
      }

      let dt = result[0].Table

      var data = []
      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];

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
        this.varDepartamento.forEach(dpto => {
          if (resDt.Departamento != null && dpto.Folio == resDt.Departamento)
            resDt["Departamento_Nombre"] = dpto.Nombre
        });
        this.varSpartan_User.forEach(user => {
          if (resDt.Solicitante != null && user.Id_User == resDt.Solicitante)
            resDt["Solicitante_Name"] = user.Name
        });

        resDt.IsDeleted = false;
        resDt.edit = false;
        resDt.isNew = true;
        data.push(resDt);
      }

      this.generateMatTable(data)

    });

  }
  //#endregion


  //#region Generar Mat Table
  generateMatTable(array) {
    this.dataSourceItems_Aprobados = new MatTableDataSource(array);
    this.dataSourceItems_Aprobados.paginator = this.paginator;
    this.dataSourceItems_Aprobados.sort = this.sort;
  }
  //#endregion


  //#region Filtros de Consulta
  getFilters(): string {
    var where = ""

    if (this.Gestion_de_aprobacionForm.controls["Matricula"].value) {
      where += `AND Matricula = ''${this.Gestion_de_aprobacionForm.controls["Matricula"].value}''`
    }
    if (this.Gestion_de_aprobacionForm.controls["Modelo"].value) {
      where += `AND Modelo = ''${this.Gestion_de_aprobacionForm.controls["Modelo"].value}''`
    }
    if (this.Gestion_de_aprobacionForm.controls["No__Reporte"].value) {
      where += `AND No__de_ReporteNo_Reporte = ''${this.Gestion_de_aprobacionForm.controls["No__Reporte"].value}''`
    }
    if (this.Gestion_de_aprobacionForm.controls["No__Parte"].value) {
      where += `AND Descripcion LIKE ''%${this.Gestion_de_aprobacionForm.controls["No__Parte"].value}%''`
    }
    if (this.Gestion_de_aprobacionForm.controls["Departamento"].value) {
      where += `AND Departamento = ''${this.Gestion_de_aprobacionForm.controls["Departamento"].value}''`
    }
    if (this.Gestion_de_aprobacionForm.controls["Solicitante"].value) {
      where += `AND Solicitante = ''${this.Gestion_de_aprobacionForm.controls["Solicitante"].value}''`
    }

    return where
  }
  //#endregion


  //#region Abrir Ventana Comparativo
  openWindowComparativo(element: any) {

    this.localStorageHelper.setItemToLocalStorage("fromGestion_de_Aprobacion", "true");

    const url = this.router.serializeUrl(this.router.createUrlTree([`#/Comparativo_de_Proveedores_Piezas/consult/${element.IdComparativoProveedores}`]));

    this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
    this.openWindows;
  }
  //#endregion


  //#region Abrir Ventana Importacion
  openWindowImportacion(element: any) {
    let url = ""

    if (element.IdImportacion == null) {
      url = this.router.serializeUrl(this.router.createUrlTree([`#/Gestion_de_Importacion/add`]));
    }
    else {
      url = this.router.serializeUrl(this.router.createUrlTree([`#/Gestion_de_Importacion/edit/${element.IdImportacion}`]));
    }
    this.localStorageHelper.setItemToLocalStorage("IsResetGestion_de_aprobacion", "0");
    this.localStorageHelper.setItemToLocalStorage("IdFolioDetalle", element.IdFolioDetalle.toString());

    this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
    this.openWindows;
  }
  //#endregion


  //#region Abrir Ventana Exportacion
  openWindowExportacion(element: any) {
    let url = ""

    if (element.IdExportacion == null) {
      url = this.router.serializeUrl(this.router.createUrlTree([`#/Gestion_de_Exportacion/add`]));
    }
    else {
      url = this.router.serializeUrl(this.router.createUrlTree([`#/Gestion_de_Exportacion/edit/${element.IdExportacion}`]));
    }

    this.localStorageHelper.setItemToLocalStorage("IsResetGestion_de_aprobacion", "0");
    this.localStorageHelper.setItemToLocalStorage("IdFolioDetalle", element.IdFolioDetalle.toString());

    this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
    this.openWindows;
  }
  //#endregion


  //#region Abrir Ventana Orden de Compra
  openWindowOrdenCompra(element: any) {
    let array = []
    array.push(element)

    this.localStorageHelper.setItemToLocalStorage("Detalle_de_Gestion_de_aprobacionOrdenCompra", JSON.stringify(array));
    this.localStorageHelper.setItemToLocalStorage("IsResetGestion_de_aprobacion", "0");

    const stringLista = this.localStorageHelper.getItemFromLocalStorage("Detalle_de_Gestion_de_aprobacionOrdenCompra");

    let url = ""
    if (element.IdGeneracionOC == null) {
      url = this.router.serializeUrl(this.router.createUrlTree([`#/Generacion_de_Orden_de_Compras/add`]));
    }
    else {
      url = this.router.serializeUrl(this.router.createUrlTree([`#/Generacion_de_Orden_de_Compras/edit/${element.IdGeneracionOC}`]));
    }

    this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
    this.openWindows;
  }
  //#endregion


  //#region Seleccionar Generar OC
  onChangeGenerar_OCChecked(event: any, element: any) {
    element.Generar_OC = event.checked
  }
  //#endregion


  //#region Refrescar Vista
  startTimer() {
    this.timerStart = true;
    this.interval = setInterval(() => {
      let Reset = +this.localStorageHelper.getItemFromLocalStorage("IsResetGestion_de_aprobacion");
      if (Reset == 1) {
        this.localStorageHelper.setItemToLocalStorage("IsResetGestion_de_aprobacion", "0");

        this.getDataTable();

        this.snackBar.open('Refrescando Vista.', '', {
          duration: 2000,
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


  //#region Generar OC Multiple
  fnGenerarOCMultiple() {

    let array = []
    let proveedores = []
    let url: string = ""
    let message: string = ""

    array = this.dataSourceItems_Aprobados.data.filter(element => element.Generar_OC);

    if (array.length > 0) {

      array.forEach(element => {
        proveedores.push(element.Proveedor)
      });

      let proveedoresUnicos = proveedores.filter((valor, indice, arreglo) => {
        return arreglo.indexOf(valor) == indice;
      })

      if (proveedoresUnicos.length > 1) {
        message = "Selecione items de un solo proveedor"
        this.ShowMessageType(message, "warning")
      }
      else {

        this.localStorageHelper.setItemToLocalStorage("Detalle_de_Gestion_de_aprobacionOrdenCompra", JSON.stringify(array));
        this.localStorageHelper.setItemToLocalStorage("IsResetGestion_de_aprobacion", "0");
        url = this.router.serializeUrl(this.router.createUrlTree([`#/Generacion_de_Orden_de_Compras/add`]));

        this.openWindows = window.open(decodeURIComponent(url), "_blank", "width=1200, height=768, top=100, left=400");
        this.openWindows;
      }
    }
    else {
      message = "No se encontró informacion de proveedor"
      this.ShowMessageType(message, "warning")
    }

  }
  //#endregion


  //#region Abrir Modal para Generar Orden de Compra
  async fnOpenModalGeneracionOC(element: any) {
    console.log(element)

    let array = []
    array.push(element)

    let operation = (element.IdGeneracionOC == null) ? "New" : "Update"

    const dialogRef = this.dialog.open(DialogGeneracionDeOrdenDeComprasFormComponent, {
      width: '100rem',
      disableClose: false,
      data: {
        Detalle_de_Gestion_de_aprobacionOrdenCompra: array,
        operation: operation,
        IdGeneracionOC: element.IdGeneracionOC
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.log(result)
      if (result !== undefined) {
        this.getDataTable();
      }
    });
  }
  //#endregion


  //#region Abrir Modal
  async fnOpenModalGeneracionOCMultiple() {

    let operation = "New"
    let array = []
    let proveedores = []
    let message: string = ""

    array = this.dataSourceItems_Aprobados.data.filter(element => element.Generar_OC);

    if (array.length > 0) {

      array.forEach(element => {
        proveedores.push(element.Proveedor)
      });

      let proveedoresUnicos = proveedores.filter((valor, indice, arreglo) => {
        return arreglo.indexOf(valor) == indice;
      })

      if (proveedoresUnicos.length > 1) {
        message = "Selecione items de un solo proveedor"
        this.ShowMessageType(message, "warning")
      }
      else {

        const dialogRef = this.dialog.open(DialogGeneracionDeOrdenDeComprasFormComponent, {
          width: '100rem',
          disableClose: false,
          data: {
            Detalle_de_Gestion_de_aprobacionOrdenCompra: array,
            operation: operation
          },
        });

        dialogRef.afterClosed().subscribe((result) => {
          console.log(result)
          if (result !== undefined) {
            this.getDataTable();
          }
        });

      }
    }
    else {
      message = "No se encontró informacion de proveedor"
      this.ShowMessageType(message, "warning")
    }

  }
  //#endregion


  //#region Completar información de Selects
  setDataFromSelects(): void {
    this.searchMatricula();
    this.searchModelo();
    this.searchNo__Reporte();
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
        result.Aeronaves = result.Aeronaves.filter(element => element.Matricula != "");
        this.listaMatricula = of(result?.Aeronaves);
      }, error => {
        this.isLoadingMatricula = false;
        this.listaMatricula = of([]);
      });;
    }
    else if (term != "") {
      this.AeronaveService.listaSelAll(0, 20, "Aeronave.Matricula like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingMatricula = false;
        result.Aeronaves = result.Aeronaves.filter(element => element.Matricula != "");
        this.listaMatricula = of(result?.Aeronaves);
      }, error => {
        this.isLoadingMatricula = false;
        this.listaMatricula = of([]);
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
        result.Modeloss = result.Modeloss.filter(element => element.Descripcion != "");
        this.listaModelo = of(result?.Modeloss);
      }, error => {
        this.isLoadingModelo = false;
        this.listaModelo = of([]);
      });;
    }
    else if (term != "") {
      this.ModelosService.listaSelAll(0, 20, "Modelos.Descripcion like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingModelo = false;
        result.Modeloss = result.Modeloss.filter(element => element.Descripcion != "");
        this.listaModelo = of(result?.Modeloss);
      }, error => {
        this.isLoadingModelo = false;
        this.listaModelo = of([]);
      });;
    }
  }
  //#endregion


  //#region Consulta de Numero de Reporte
  searchNo__Reporte(term?: string) {
    this.isLoadingNo__Reporte = true;
    if (term == "" || term == null || term == undefined) {
      this.Crear_ReporteService.listaSelAll(0, 20, '').subscribe((result: any) => {
        this.isLoadingNo__Reporte = false;
        result.Crear_Reportes = result.Crear_Reportes.filter(element => element.No_Reporte != "");
        this.listaNo__Reporte = of(result?.Crear_Reportes);
      }, error => {
        this.isLoadingNo__Reporte = false;
        this.listaNo__Reporte = of([]);
      });;
    }
    else if (term != "") {
      this.Crear_ReporteService.listaSelAll(0, 20, "Crear_Reporte.Folio like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingNo__Reporte = false;
        result.Crear_Reportes = result.Crear_Reportes.filter(element => element.No_Reporte != "");
        this.listaNo__Reporte = of(result?.Crear_Reportes);
      }, error => {
        this.isLoadingNo__Reporte = false;
        this.listaNo__Reporte = of([]);
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
        result.Departamentos = result.Departamentos.filter(element => element.Nombre != "");
        this.listaDepartamento = of(result?.Departamentos);
      }, error => {
        this.isLoadingDepartamento = false;
        this.listaDepartamento = of([]);
      });;
    }
    else if (term != "") {
      this.DepartamentoService.listaSelAll(0, 20, "Departamento.Nombre like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingDepartamento = false;
        result.Departamentos = result.Departamentos.filter(element => element.Nombre != "");
        this.listaDepartamento = of(result?.Departamentos);
      }, error => {
        this.isLoadingDepartamento = false;
        this.listaDepartamento = of([]);
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
        result.Spartan_Users = result.Spartan_Users.filter(element => element.Name != "");
        this.listaSolicitante = of(result?.Spartan_Users);
      }, error => {
        this.isLoadingSolicitante = false;
        this.listaSolicitante = of([]);
      });;
    }
    else if (term != "") {
      this.Spartan_UserService.listaSelAll(0, 20, "Spartan_User.Name like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingSolicitante = false;
        result.Spartan_Users = result.Spartan_Users.filter(element => element.Name != "");
        this.listaSolicitante = of(result?.Spartan_Users);
      }, error => {
        this.isLoadingSolicitante = false;
        this.listaSolicitante = of([]);
      });;
    }
  }
  //#endregion


}
