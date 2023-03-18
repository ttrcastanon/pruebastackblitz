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
import { GeneralService } from 'src/app/api-services/general.service';
import { CotizacionService } from 'src/app/api-services/Cotizacion.service';
import { Cotizacion } from 'src/app/models/Cotizacion';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Tipo_de_ReporteService } from 'src/app/api-services/Tipo_de_Reporte.service';
import { Tipo_de_Reporte } from 'src/app/models/Tipo_de_Reporte';
import { Tipo_de_Ingreso_a_CotizacionService } from 'src/app/api-services/Tipo_de_Ingreso_a_Cotizacion.service';
import { Tipo_de_Ingreso_a_Cotizacion } from 'src/app/models/Tipo_de_Ingreso_a_Cotizacion';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Estatus_de_CotizacionService } from 'src/app/api-services/Estatus_de_Cotizacion.service';
import { Estatus_de_Cotizacion } from 'src/app/models/Estatus_de_Cotizacion';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Motivo_de_Edicion_de_CotizacionService } from 'src/app/api-services/Motivo_de_Edicion_de_Cotizacion.service';
import { Motivo_de_Edicion_de_Cotizacion } from 'src/app/models/Motivo_de_Edicion_de_Cotizacion';
import { Detalle_Historial_Motivo_EdicionService } from 'src/app/api-services/Detalle_Historial_Motivo_Edicion.service';
import { Detalle_Historial_Motivo_Edicion } from 'src/app/models/Detalle_Historial_Motivo_Edicion';
import { Detalle_Codigos_Computarizados_Cotizacion } from 'src/app/models/Detalle_Codigos_Computarizados_Cotizacion';

import { Respuesta_del_Cliente_a_CotizacionService } from 'src/app/api-services/Respuesta_del_Cliente_a_Cotizacion.service';
import { Respuesta_del_Cliente_a_Cotizacion } from 'src/app/models/Respuesta_del_Cliente_a_Cotizacion';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { Console } from 'console';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { PoupCodigocomputarizadoComponent } from '../poup-codigocomputarizado/poup-codigocomputarizado.component';

@Component({
  selector: 'app-Cotizacion',
  templateUrl: './Cotizacion.component.html',
  styleUrls: ['./Cotizacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class CotizacionComponent implements OnInit, AfterViewInit {
MRaddHistorial: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  CotizacionForm: FormGroup;
  public Editor = ClassicEditor;
  model: Cotizacion;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varSpartan_User: Spartan_User[] = [];
  optionsOrden_de_Trabajo_Origen: Observable<Orden_de_Trabajo[]>;
  hasOptionsOrden_de_Trabajo_Origen: boolean;
  isLoadingOrden_de_Trabajo_Origen: boolean;
  optionsOrden_de_Trabajo_Generada: Observable<Orden_de_Trabajo[]>;
  hasOptionsOrden_de_Trabajo_Generada: boolean;
  isLoadingOrden_de_Trabajo_Generada: boolean;
  public varTipo_de_Reporte: Tipo_de_Reporte[] = [];
  public varTipo_de_Ingreso_a_Cotizacion: Tipo_de_Ingreso_a_Cotizacion[] = [];
  optionsCliente: Observable<Cliente[]>;
  hasOptionsCliente: boolean;
  isLoadingCliente: boolean;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  optionsModelo: Observable<Modelos[]>;
  hasOptionsModelo: boolean;
  isLoadingModelo: boolean;
  public varEstatus_de_Cotizacion: Estatus_de_Cotizacion[] = [];
  optionsReporte: Observable<Crear_Reporte[]>;
  hasOptionsReporte: boolean;
  isLoadingReporte: boolean;
  public varMotivo_de_Edicion_de_Cotizacion: Motivo_de_Edicion_de_Cotizacion[] = [];
  public varRespuesta_del_Cliente_a_Cotizacion: Respuesta_del_Cliente_a_Cotizacion[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceHistorial = new MatTableDataSource<Detalle_Historial_Motivo_Edicion>();
  HistorialColumns = [
    { def: 'actions', hide: false },
    { def: 'Motivo_de_Edicion', hide: false },
    { def: 'Observaciones', hide: false },
    { def: 'Fecha', hide: false },
    { def: 'Hora', hide: false },
    { def: 'Usuario', hide: false },

  ];
  HistorialData: Detalle_Historial_Motivo_Edicion[] = [];

  dataSourceCodigos_Computarizado = new MatTableDataSource<Detalle_Codigos_Computarizados_Cotizacion>();
  Codigos_ComputarizadoColumns = [
    { def: 'actions', hide: false },
    { def: 'No.', hide: false },
    { def: 'Codigo_Computarizado', hide: false },
    { def: 'Monto_Partes', hide: false },
    { def: 'Monto_Servicios', hide: false },
    { def: 'Tiempo_Hr_Tecnico', hide: false },
    { def: 'Tiempo_Hr_Rampa', hide: false },
    { def: 'Monto_Mtto', hide: false },

  ];
  Codigos_ComputarizadoData: Detalle_Codigos_Computarizados_Cotizacion[] = [];

  today = new Date;
  consult: boolean = false;
  Phase: any;
  ClienteSeleccion: any = null;
  MatriculaSeleccion: any = null;
  ModeloSeleccion: any = null;
  cargaMatriculaDesdeEdicion: boolean = false;
  OTSeleccion: any = null;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private CotizacionService: CotizacionService,
    private Spartan_UserService: Spartan_UserService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Tipo_de_ReporteService: Tipo_de_ReporteService,
    private Tipo_de_Ingreso_a_CotizacionService: Tipo_de_Ingreso_a_CotizacionService,
    private ClienteService: ClienteService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Estatus_de_CotizacionService: Estatus_de_CotizacionService,
    private Crear_ReporteService: Crear_ReporteService,
    private Motivo_de_Edicion_de_CotizacionService: Motivo_de_Edicion_de_CotizacionService,
    private Detalle_Historial_Motivo_EdicionService: Detalle_Historial_Motivo_EdicionService,
    private Respuesta_del_Cliente_a_CotizacionService: Respuesta_del_Cliente_a_CotizacionService,
    private _seguridad: SeguridadService,
    private spartanFileService: SpartanFileService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    public localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private SpartanService: SpartanService,
    renderer: Renderer2,
    public dialog: MatDialog) {
    this.brf = new BusinessRulesFunctions(renderer, SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.Phase = this.localStorageHelper.getItemFromLocalStorage('Phase');
    this.model = new Cotizacion(this.fb);
    this.CotizacionForm = this.model.buildFormGroup();
    this.HistorialItems.removeAt(0);

    this.CotizacionForm.get('Folio').disable();
    this.CotizacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceHistorial.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.HistorialColumns.splice(0, 1);
        this.Codigos_ComputarizadoColumns.splice(0, 1);

        this.CotizacionForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Cotizacion).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.CotizacionForm, 'Orden_de_Trabajo_Origen', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.CotizacionForm, 'Orden_de_Trabajo_Generada', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.CotizacionForm, 'Cliente', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.CotizacionForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.CotizacionForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.CotizacionForm, 'Reporte', [CustomValidators.autocompleteObjectValidator(), Validators.required]);


    this.startTimer();
    // this.rulesOnInit();	  
  }

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.CotizacionForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Folio);
        } else {
          this.operation = "New";
          this.rulesOnInit();
        }
      });
  }

  // Esto permite el refrescado automatico si se inserta un nuevo registro en la BD para cualquier pesta#a del DynamicSearch
  interval;
  startTimer() {
    this.interval = setInterval(() => {
      let folios = this.localStorageHelper.getItemFromLocalStorage('GetCogidosSeleccionados');
      if (folios) {
        this.addToCodigos_Computarizados(folios);
      }
    }, 2000)
  }

  pauseTimer() {
    clearInterval(this.interval);
  }


  addToCodigos_Computarizados(data: string) {

    const dataS = this.dataSourceCodigos_Computarizado.data;
    let lista = data.split(',');
    for (let i = 0; i < lista.length; i++) {
      if (lista[i] != null || lista[i] != "") {
        const Codigos = new Detalle_Codigos_Computarizados_Cotizacion(this.fb);
        Codigos.No = i;
        Codigos.Codigo_Computarizado = lista[i];
        Codigos.Monto_Partes = this.getRandomArbitrary(0, 10000);
        Codigos.Monto_Servicios = this.getRandomArbitrary(0, 10000);;
        Codigos.Tiempo_Hr_Tecnico = this.getRandomArbitrary(0, 10000);;
        Codigos.Tiempo_Hr_Rampa = this.getRandomArbitrary(0, 10000);;
        Codigos.Monto_Mtto = this.getRandomArbitrary(0, 10000);;

        dataS.push(Codigos);
      }
    }

    this.dataSourceCodigos_Computarizado.data = dataS;

    let TotalPartes = 0;
    let TotalServicios = 0;
    let TiempoTecnico = 0;
    let TiempoRampa = 0;
    let MontoMtto = 0;

    this.dataSourceCodigos_Computarizado.data.forEach(element => {
      TotalPartes = TotalPartes + element.Monto_Partes;
      TotalServicios = TotalServicios + element.Monto_Servicios;
      TiempoTecnico = TiempoTecnico + element.Tiempo_Hr_Tecnico;
      TiempoRampa = TiempoRampa + element.Tiempo_Hr_Rampa;
      MontoMtto = MontoMtto + element.Monto_Mtto;
    });

    let manodeobra = TotalServicios + TiempoTecnico;
    let consumible = TiempoRampa + MontoMtto;
    let totaltotal = manodeobra + consumible + TotalPartes;


    this.CotizacionForm.get('Mano_de_Obra').setValue(manodeobra);
    this.CotizacionForm.get('Partes').setValue(TotalPartes);
    this.CotizacionForm.get('Consumibles').setValue(consumible);
    this.CotizacionForm.get('Total').setValue(totaltotal);

    this.localStorageHelper.setItemToLocalStorage('GetCogidosSeleccionados', "");
  }

  getRandomArbitrary(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.CotizacionService.listaSelAll(0, 1, 'Cotizacion.Folio=' + id).toPromise();
    if (result.Cotizacions.length > 0) {

      this.cargaMatriculaDesdeEdicion = true;

      let fHistorial = await this.Detalle_Historial_Motivo_EdicionService.listaSelAll(0, 1000, 'Cotizacion.Folio=' + id).toPromise();
      this.HistorialData = fHistorial.Detalle_Historial_Motivo_Edicions;
      this.loadHistorial(fHistorial.Detalle_Historial_Motivo_Edicions);
      this.dataSourceHistorial = new MatTableDataSource(fHistorial.Detalle_Historial_Motivo_Edicions);
      this.dataSourceHistorial.paginator = this.paginator;
      this.dataSourceHistorial.sort = this.sort;

      this.model.fromObject(result.Cotizacions[0]);
      this.CotizacionForm.get('Orden_de_Trabajo_Origen').setValue(
        result.Cotizacions[0].Orden_de_Trabajo_Origen_Orden_de_Trabajo.numero_de_orden,
        { onlySelf: false, emitEvent: true }
      );
      this.CotizacionForm.get('Orden_de_Trabajo_Generada').setValue(
        result.Cotizacions[0].Orden_de_Trabajo_Generada_Orden_de_Trabajo.numero_de_orden,
        { onlySelf: false, emitEvent: true }
      );
      this.CotizacionForm.get('Cliente').setValue(
        result.Cotizacions[0].Cliente_Cliente.Razon_Social,
        { onlySelf: false, emitEvent: true }
      );
      this.CotizacionForm.get('Matricula').setValue(
        result.Cotizacions[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.CotizacionForm.get('Modelo').setValue(
        result.Cotizacions[0].Modelo_Modelos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.CotizacionForm.get('Reporte').setValue(
        result.Cotizacions[0].Reporte_Crear_Reporte.No_Reporte,
        { onlySelf: false, emitEvent: true }
      );
      this.rulesOnInit();
      this.CotizacionForm.markAllAsTouched();
      this.CotizacionForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get HistorialItems() {
    return this.CotizacionForm.get('Detalle_Historial_Motivo_EdicionItems') as FormArray;
  }

  get Codigos_ComputarizadosItems() {
    return this.CotizacionForm.get('Detalle_Codigos_Computarizados_Cotizacion') as FormArray;
  }

  getHistorialColumns(): string[] {
    return this.HistorialColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  getCodigos_ComputarizadoColumns(): string[] {
    return this.Codigos_ComputarizadoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadHistorial(Historial: Detalle_Historial_Motivo_Edicion[]) {
    Historial.forEach(element => {
      this.addHistorial(element);
    });
  }

  addHistorialToMR() {
    const Historial = new Detalle_Historial_Motivo_Edicion(this.fb);
    this.HistorialData.push(this.addHistorial(Historial));
    this.dataSourceHistorial.data = this.HistorialData;
    Historial.edit = true;
    Historial.isNew = true;
    const length = this.dataSourceHistorial.data.length;
    const index = length - 1;
    const formHistorial = this.HistorialItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceHistorial.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addHistorial(entity: Detalle_Historial_Motivo_Edicion) {
    const Historial = new Detalle_Historial_Motivo_Edicion(this.fb);
    this.HistorialItems.push(Historial.buildFormGroup());
    if (entity) {
      Historial.fromObject(entity);
    }
    return entity;
  }

  addCodigos(entity: Detalle_Codigos_Computarizados_Cotizacion) {
    const Codigo = new Detalle_Codigos_Computarizados_Cotizacion(this.fb);
    this.Codigos_ComputarizadosItems.push(Codigo.buildFormGroup());
    if (entity) {
      Codigo.fromObject(entity);
    }
    return entity;
  }

  HistorialItemsByFolio(Folio: number): FormGroup {
    return (this.CotizacionForm.get('Detalle_Historial_Motivo_EdicionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  HistorialItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceHistorial.data.indexOf(element);
    let fb = this.HistorialItems.controls[index] as FormGroup;
    return fb;
  }

  deleteHistorial(element: any) {
    let index = this.dataSourceHistorial.data.indexOf(element);
    this.HistorialData[index].IsDeleted = true;
    this.dataSourceHistorial.data = this.HistorialData;
    this.dataSourceHistorial._updateChangeSubscription();
    index = this.dataSourceHistorial.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditHistorial(element: any) {
    let index = this.dataSourceHistorial.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.HistorialData[index].IsDeleted = true;
      this.dataSourceHistorial.data = this.HistorialData;
      this.dataSourceHistorial._updateChangeSubscription();
      index = this.HistorialData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveHistorial(element: any) {
    const index = this.dataSourceHistorial.data.indexOf(element);
    const formHistorial = this.HistorialItems.controls[index] as FormGroup;
    this.HistorialData[index].Motivo_de_Edicion = formHistorial.value.Motivo_de_Edicion;
    this.HistorialData[index].Motivo_de_Edicion_Motivo_de_Edicion_de_Cotizacion = formHistorial.value.Motivo_de_Edicion !== '' ?
      this.varMotivo_de_Edicion_de_Cotizacion.filter(d => d.Clave === formHistorial.value.Motivo_de_Edicion)[0] : null;
    this.HistorialData[index].Observaciones = formHistorial.value.Observaciones;
    this.HistorialData[index].Fecha = formHistorial.value.Fecha;
    this.HistorialData[index].Hora = formHistorial.value.Hora;
    this.HistorialData[index].Usuario = formHistorial.value.Usuario;
    this.HistorialData[index].Usuario_Spartan_User = formHistorial.value.Usuario !== '' ?
      this.varSpartan_User.filter(d => d.Id_User === formHistorial.value.Usuario)[0] : null;

    this.HistorialData[index].isNew = false;
    this.dataSourceHistorial.data = this.HistorialData;
    this.dataSourceHistorial._updateChangeSubscription();
  }

  editHistorial(element: any) {
    const index = this.dataSourceHistorial.data.indexOf(element);
    const formHistorial = this.HistorialItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Historial_Motivo_Edicion(Folio: number) {
    this.dataSourceHistorial.data.forEach(async (d, index) => {
      const data = this.HistorialItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Cotizacion = Folio;


      if (model.Folio === 0) {
        // Add Historial
        let response = await this.Detalle_Historial_Motivo_EdicionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formHistorial = this.HistorialItemsByFolio(model.Folio);
        if (formHistorial.dirty) {
          // Update Historial
          let response = await this.Detalle_Historial_Motivo_EdicionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Historial
        await this.Detalle_Historial_Motivo_EdicionService.delete(model.Folio).toPromise();
      }
    });
  }


  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Spartan_UserService.getAll());
    observablesArray.push(this.Tipo_de_ReporteService.getAll());
    observablesArray.push(this.Tipo_de_Ingreso_a_CotizacionService.getAll());
    observablesArray.push(this.Estatus_de_CotizacionService.getAll());
    observablesArray.push(this.Motivo_de_Edicion_de_CotizacionService.getAll());

    observablesArray.push(this.Respuesta_del_Cliente_a_CotizacionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varSpartan_User, varTipo_de_Reporte, varTipo_de_Ingreso_a_Cotizacion, varEstatus_de_Cotizacion, varMotivo_de_Edicion_de_Cotizacion, varRespuesta_del_Cliente_a_Cotizacion]) => {
          this.varSpartan_User = varSpartan_User;
          this.varTipo_de_Reporte = varTipo_de_Reporte;
          this.varTipo_de_Ingreso_a_Cotizacion = varTipo_de_Ingreso_a_Cotizacion;
          this.varEstatus_de_Cotizacion = varEstatus_de_Cotizacion;
          this.varMotivo_de_Edicion_de_Cotizacion = varMotivo_de_Edicion_de_Cotizacion;

          this.varRespuesta_del_Cliente_a_Cotizacion = varRespuesta_del_Cliente_a_Cotizacion;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.CotizacionForm.get('Orden_de_Trabajo_Origen').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingOrden_de_Trabajo_Origen = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
          return this.Orden_de_TrabajoService.listaSelAll(0, 20,
            "Orden_de_Trabajo.numero_de_orden like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Orden_de_TrabajoService.listaSelAll(0, 20,
          "Orden_de_Trabajo.numero_de_orden like '%" + value.numero_de_orden.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingOrden_de_Trabajo_Origen = false;
      this.hasOptionsOrden_de_Trabajo_Origen = result?.Orden_de_Trabajos?.length > 0;
      this.CotizacionForm.get('Orden_de_Trabajo_Origen').setValue(result?.Orden_de_Trabajos[0], { onlySelf: true, emitEvent: false });
      this.optionsOrden_de_Trabajo_Origen = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingOrden_de_Trabajo_Origen = false;
      this.hasOptionsOrden_de_Trabajo_Origen = false;
      this.optionsOrden_de_Trabajo_Origen = of([]);
    });
    this.CotizacionForm.get('Orden_de_Trabajo_Generada').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingOrden_de_Trabajo_Generada = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.OTSeleccion = value;
        if (!value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
          return this.Orden_de_TrabajoService.listaSelAll(0, 20,
            "Orden_de_Trabajo.numero_de_orden like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Orden_de_TrabajoService.listaSelAll(0, 20,
          "Orden_de_Trabajo.numero_de_orden like '%" + value.numero_de_orden.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingOrden_de_Trabajo_Generada = false;
      this.hasOptionsOrden_de_Trabajo_Generada = result?.Orden_de_Trabajos?.length > 0;

      if(this.OTSeleccion != null && this.OTSeleccion != "") {
        this.CotizacionForm.get('Orden_de_Trabajo_Generada').setValue(result?.Orden_de_Trabajos[0], { onlySelf: true, emitEvent: false });
      }
      
      this.optionsOrden_de_Trabajo_Generada = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingOrden_de_Trabajo_Generada = false;
      this.hasOptionsOrden_de_Trabajo_Generada = false;
      this.optionsOrden_de_Trabajo_Generada = of([]);
    });
    this.CotizacionForm.get('Cliente').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCliente = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.ClienteSeleccion = value;
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

      if(this.ClienteSeleccion != null && this.ClienteSeleccion != "") {
        this.CotizacionForm.get('Cliente').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });
      }
      
      this.optionsCliente = of(result?.Clientes);
    }, error => {
      this.isLoadingCliente = false;
      this.hasOptionsCliente = false;
      this.optionsCliente = of([]);
    });
    this.CotizacionForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.MatriculaSeleccion = value;

        if(this.cargaMatriculaDesdeEdicion) { 
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Matricula = '" + value.trimLeft().trimRight() + "'");
        }

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

      if(this.MatriculaSeleccion != null && this.MatriculaSeleccion != "") {
        if(result.Aeronaves.length == 1) {
          this.CotizacionForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
        }
      }
      
      this.optionsMatricula = of(result?.Aeronaves);

      if(this.cargaMatriculaDesdeEdicion) {
        this.cargaMatriculaDesdeEdicion = false;
      }

    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.CotizacionForm.get('Modelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingModelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.ModeloSeleccion = value;
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

      if(this.ModeloSeleccion != null && this.ModeloSeleccion != "") {
        this.CotizacionForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      }      

      this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.CotizacionForm.get('Reporte').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingReporte = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Crear_ReporteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Crear_ReporteService.listaSelAll(0, 20, '');
          return this.Crear_ReporteService.listaSelAll(0, 20,
            "Crear_Reporte.No_Reporte like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Crear_ReporteService.listaSelAll(0, 20,
          "Crear_Reporte.No_Reporte like '%" + value.No_Reporte.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingReporte = false;
      this.hasOptionsReporte = result?.Crear_Reportes?.length > 0;
      this.CotizacionForm.get('Reporte').setValue(result?.Crear_Reportes[0], { onlySelf: true, emitEvent: false });
      this.optionsReporte = of(result?.Crear_Reportes);
    }, error => {
      this.isLoadingReporte = false;
      this.hasOptionsReporte = false;
      this.optionsReporte = of([]);
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
      case 'Tipo_de_Reporte': {
        this.Tipo_de_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Reporte = x.Tipo_de_Reportes;
        });
        break;
      }
      case 'Tipo_de_ingreso': {
        this.Tipo_de_Ingreso_a_CotizacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Ingreso_a_Cotizacion = x.Tipo_de_Ingreso_a_Cotizacions;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_de_CotizacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Cotizacion = x.Estatus_de_Cotizacions;
        });
        break;
      }
      case 'Motivo_de_Edicion': {
        this.Motivo_de_Edicion_de_CotizacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varMotivo_de_Edicion_de_Cotizacion = x.Motivo_de_Edicion_de_Cotizacions;
        });
        break;
      }
      case 'Usuario': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }

      case 'Usuario_que_Registra_Respuesta': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Respuesta': {
        this.Respuesta_del_Cliente_a_CotizacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRespuesta_del_Cliente_a_Cotizacion = x.Respuesta_del_Cliente_a_Cotizacions;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnOrden_de_Trabajo_Origen(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
  displayFnOrden_de_Trabajo_Generada(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
  displayFnCliente(option: Cliente) {
    return option?.Razon_Social;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
  displayFnReporte(option: Crear_Reporte) {
    return option?.No_Reporte;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.CotizacionForm.value;
      entity.Folio = this.model.Folio;
      entity.Orden_de_Trabajo_Origen = this.CotizacionForm.get('Orden_de_Trabajo_Origen').value.Folio;
      entity.Orden_de_Trabajo_Generada = this.CotizacionForm.get('Orden_de_Trabajo_Generada').value.Folio;
      entity.Cliente = this.CotizacionForm.get('Cliente').value.Clave;
      entity.Matricula = this.CotizacionForm.get('Matricula').value.Matricula;
      entity.Modelo = this.CotizacionForm.get('Modelo').value.Clave;
      entity.Reporte = this.CotizacionForm.get('Reporte').value.Folio;
      entity.Mano_de_Obra = this.CotizacionForm.get('Mano_de_Obra').value;
      entity.Partes = this.CotizacionForm.get('Partes').value;
      entity.consumible = this.CotizacionForm.get('Consumibles').value;
      entity.Total = this.CotizacionForm.get('Total').value;
      entity.Fecha_de_Registro = this.CotizacionForm.get('Fecha_de_Registro').value;
      entity.Hora_de_Registro = this.CotizacionForm.get('Hora_de_Registro').value;
      entity.Usuario_que_Registra = this.CotizacionForm.get('Hora_de_Registro').value.Id_User;
      entity.Numero_de_Cotizacion = this.CotizacionForm.get('Numero_de_Cotizacion').value;
      entity.Fecha_de_Respuesta = this.CotizacionForm.get('Fecha_de_Respuesta').value;
      entity.Hora_de_Respuesta = this.CotizacionForm.get('Hora_de_Respuesta').value;
      entity.Usuario_que_Registra_Respuesta = this.CotizacionForm.get('Usuario_que_Registra_Respuesta').value;
      entity.Estatus = this.CotizacionForm.get('Estatus').value;


      if (this.model.Folio > 0) {
        await this.CotizacionService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Historial_Motivo_Edicion(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.CotizacionService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Historial_Motivo_Edicion(id);

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
      this.CotizacionForm.reset();
      this.model = new Cotizacion(this.fb);
      this.CotizacionForm = this.model.buildFormGroup();
      this.dataSourceHistorial = new MatTableDataSource<Detalle_Historial_Motivo_Edicion>();
      this.HistorialData = [];

    } else {
      this.router.navigate(['views/Cotizacion/add']);
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
    this.router.navigate(['/Cotizacion/list/' + this.Phase], { state: { data: this.dataListConfig } });
  }

  configure() {
    //console.log("configurando");
  }

  maxClausulas_Especificas(n: number) {
    if (this.CotizacionForm.get('Clausulas_Especificas').value != null) {
      const primertTextoHTML = this.CotizacionForm.get('Clausulas_Especificas').value.replaceAll('&nbsp;', ' ').replace(/<[^>]*>|/g, '');
      const noCaracteres = primertTextoHTML.length
      if (noCaracteres <= n) {
        return true;
      }

    }

    return false;
  }

  maxClausulas_Generales(n: number) {
    if (this.CotizacionForm.get('Clausulas_Generales').value != null) {
      const primertTextoHTML = this.CotizacionForm.get('Clausulas_Generales').value.replaceAll('&nbsp;', ' ').replace(/<[^>]*>|/g, '');
      const noCaracteres = primertTextoHTML.length
      if (noCaracteres <= n) {
        return true;
      }
    }
    return false;
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
  Numero_de_Cotizacion_ExecuteBusinessRules(): void {
    //Numero_de_Cotizacion_FieldExecuteBusinessRulesEnd
  }
  Orden_de_Trabajo_Origen_ExecuteBusinessRules(): void {
    //Orden_de_Trabajo_Origen_FieldExecuteBusinessRulesEnd
  }
  Orden_de_Trabajo_Generada_ExecuteBusinessRules(): void {
    //Orden_de_Trabajo_Generada_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Reporte_ExecuteBusinessRules(): void {
    //Tipo_de_Reporte_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_ingreso_ExecuteBusinessRules(): void {
    //Tipo_de_ingreso_FieldExecuteBusinessRulesEnd
  }
  Cliente_ExecuteBusinessRules(): void {

    //INICIA - BRID:479 - Al seleccionar cliente filtrar sus matriculas - Autor: Lizeth Villa - Actualización: 2/18/2021 1:35:12 PM
    if (this.CotizacionForm.get('Cliente') != this.brf.TryParseInt('null', 'null')) { } else { }
    //TERMINA - BRID:479


    //INICIA - BRID:732 - asignar valor a contacto. - Autor: Ivan Yañez - Actualización: 3/3/2021 4:13:40 PM
    this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Contacto", this.brf.EvaluaQuery("select Contacto from Cliente with(nolock) where " + this.CotizacionForm.get('Cliente').value, 1, "ABC123"), 1, "ABC123");
    //TERMINA - BRID:732

    //Cliente_FieldExecuteBusinessRulesEnd


  }

  async setDatosMatricula() {
    let matricula = await this.CotizacionForm.get('Matricula').value.Matricula;

    for (let index = 0; index < 50; index++) {
      matricula = this.CotizacionForm.get('Matricula').value.Matricula;
      if(matricula != undefined){
        break;
      }
    }

    let modelo = await this.brf.EvaluaQueryAsync(`exec uspGetModeloAeronave '${matricula}'`, 1, "ABC123");

    if(modelo != this.CotizacionForm.get('Modelo').value){
      this.CotizacionForm.get('Modelo').setValue(modelo);
    }

    let cliente = await this.brf.EvaluaQueryAsync(`SELECT c.Razon_Social FROM Aeronave(NOLOCK) a INNER JOIN Cliente(NOLOCK) c on c.Clave = a.Cliente WHERE a.Matricula = '${matricula}'`, 1, "ABC123");
    
    if(cliente != this.CotizacionForm.get('Cliente').value.Razon_Social){
      this.CotizacionForm.get('Cliente').setValue(cliente);
    }
  }

  Matricula_ExecuteBusinessRules(): void {

    this.setDatosMatricula();

    //Matricula_FieldExecuteBusinessRulesEnd

  }
  Modelo_ExecuteBusinessRules(): void {
    //Modelo_FieldExecuteBusinessRulesEnd
  }
  Contacto_ExecuteBusinessRules(): void {
    //Contacto_FieldExecuteBusinessRulesEnd
  }
  Tiempo_de_Ejecucion_ExecuteBusinessRules(): void {
    //Tiempo_de_Ejecucion_FieldExecuteBusinessRulesEnd
  }
  Enviar_Cotizacion_a_Cliente_ExecuteBusinessRules(): void {

    //INICIA - BRID:77 - si el chexkbox esta entendido hacer visible el campo redaccion de correo y hacerlo obligatorio de lo contrario ocultar. - Autor: Ivan Yañez - Actualización: 2/5/2021 3:02:48 PM
    //console.log(this.CotizacionForm.get('Enviar_Cotizacion_a_Cliente').value);
    if (this.CotizacionForm.get('Enviar_Cotizacion_a_Cliente').value == true) {
      this.brf.ShowFieldOfForm(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
      this.brf.SetRequiredControl(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
    } else {
      this.brf.HideFieldOfForm(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
    }
    //TERMINA - BRID:77

    //Enviar_Cotizacion_a_Cliente_FieldExecuteBusinessRulesEnd

  }
  Redaccion_Correo_para_Cliente_ExecuteBusinessRules(): void {
    //Redaccion_Correo_para_Cliente_FieldExecuteBusinessRulesEnd
  }
  Clausulas_Especificas_ExecuteBusinessRules(): void {
    //Clausulas_Especificas_FieldExecuteBusinessRulesEnd
  }
  Clausulas_Generales_ExecuteBusinessRules(): void {
    //Clausulas_Generales_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  Mano_de_Obra_ExecuteBusinessRules(): void {
    //Mano_de_Obra_FieldExecuteBusinessRulesEnd
  }
  Partes_ExecuteBusinessRules(): void {
    //Partes_FieldExecuteBusinessRulesEnd
  }
  Consumibles_ExecuteBusinessRules(): void {
    //Consumibles_FieldExecuteBusinessRulesEnd
  }
  Total_ExecuteBusinessRules(): void {
    //Total_FieldExecuteBusinessRulesEnd
  }
  Porcentaje_de_Consumibles_ExecuteBusinessRules(): void {

    //INICIA - BRID:76 - recalcular consumibles al modificar porcentaje de consumibles - Autor: Ivan Yañez - Actualización: 2/5/2021 2:43:31 PM
    if (this.CotizacionForm.get('Mano_de_Obra') != this.brf.TryParseInt('null', 'null')) { this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Consumibles", this.brf.EvaluaQuery(" exec uspconsumibles '" + this.CotizacionForm.get('Mano_de_Obra').value + "','" + this.CotizacionForm.get('Porcentaje_de_Consumibles').value + "'", 1, "ABC123"), 1, "ABC123"); } else { }
    //TERMINA - BRID:76


    //INICIA - BRID:397 - calcular total al modificar porccentaje de consumibles.	 - Autor: Ivan Yañez - Actualización: 2/16/2021 8:49:18 AM
    this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Total", this.brf.EvaluaQuery("exec usptotalcotizacion '" + this.CotizacionForm.get('Mano_de_Obra').value + "','" + this.CotizacionForm.get('Partes').value + "','" + this.CotizacionForm.get('Consumibles').value + "'", 1, "ABC123"), 1, "ABC123");
    //TERMINA - BRID:397

    //Porcentaje_de_Consumibles_FieldExecuteBusinessRulesEnd


  }
  Porcentaje_de_Anticipo_ExecuteBusinessRules(): void {
    //Porcentaje_de_Anticipo_FieldExecuteBusinessRulesEnd
  }
  Comentarios_Mantenimiento_ExecuteBusinessRules(): void {
    //Comentarios_Mantenimiento_FieldExecuteBusinessRulesEnd
  }
  Reporte_ExecuteBusinessRules(): void {
    //Reporte_FieldExecuteBusinessRulesEnd
  }
  Item_de_Inspeccion_ExecuteBusinessRules(): void {
    //Item_de_Inspeccion_FieldExecuteBusinessRulesEnd
  }
  Motivo_de_Edicion_ExecuteBusinessRules(): void {
    //Motivo_de_Edicion_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    //Observaciones_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Respuesta_ExecuteBusinessRules(): void {
    //Fecha_de_Respuesta_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Respuesta_ExecuteBusinessRules(): void {
    //Hora_de_Respuesta_FieldExecuteBusinessRulesEnd
  }
  Usuario_que_Registra_Respuesta_ExecuteBusinessRules(): void {
    //Usuario_que_Registra_Respuesta_FieldExecuteBusinessRulesEnd
  }
  Respuesta_ExecuteBusinessRules(): void {

    //INICIA - BRID:86 - Al seleccionar un valor en el campo "Respuesta" si el campo "Respuesta" es autorizado: - Autor: Lizeth Villa - Actualización: 2/6/2021 3:46:07 PM
    if (this.CotizacionForm.get('Respuesta').value == this.brf.TryParseInt('1', '1')) {
      this.brf.ShowFieldOfForm(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
      this.brf.ShowFieldOfForm(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
      this.brf.SetRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
      this.brf.SetRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
      this.brf.SetCurrentDateToField(this.CotizacionForm, "Fecha_de_Respuesta");
      this.brf.SetCurrentHourToField(this.CotizacionForm, "Hora_de_Respuesta");
      this.CotizacionForm.get('Usuario_que_Registra_Respuesta').setValue(this.localStorageHelper.getLoggedUserInfo().UserId);
      //this.SpartanService.SetValueExecuteQuery(this.CotizacionForm,"Usuario_que_Registra_Respuesta",this.brf.EvaluaQuery(" select "+this.localStorageHelper.getLoggedUserInfo().UserId+"", 1, "ABC123"),1,"ABC123");
    } 
    //TERMINA - BRID:86


    //INICIA - BRID:88 - Al seleccionar un valor en el campo "Respuesta" si el campo "Respuesta" es Rechazado:Limpiar y ocultar los campos Día de Llegada del Avión y Hora de Llegada del AviónLlenar los campos Fecha de Respuesta, Hora de Respuesta y Usuario que Registra - Autor: Lizeth Villa - Actualización: 2/6/2021 4:12:46 PM
    if (this.CotizacionForm.get('Respuesta').value == this.brf.TryParseInt('2', '2')) {
      this.CotizacionForm.get('Dia_de_Llegada_del_Avion').setValue("");
      this.CotizacionForm.get('Hora_de_Llegada_del_Avion').setValue("");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
      this.brf.SetCurrentDateToField(this.CotizacionForm, "Fecha_de_Respuesta");
      this.brf.SetCurrentHourToField(this.CotizacionForm, "Hora_de_Respuesta");
      this.CotizacionForm.get('Usuario_que_Registra_Respuesta').setValue(this.localStorageHelper.getLoggedUserInfo().UserId);
      //this.SpartanService.SetValueExecuteQuery(this.CotizacionForm,"Usuario_que_Registra_Respuesta",this.brf.EvaluaQuery(" select "+this.localStorageHelper.getLoggedUserInfo().UserId+"", 1, "ABC123"),1,"ABC123");
    } 
    //TERMINA - BRID:88


    //INICIA - BRID:89 - Al seleccionar un valor en el campo "Respuesta" si el campo "Respuesta" está vacío entonces:Hacer visible la pestaña Motivo de Edición y los campos Motivo de Edición y Observaciones deben estar visibles y obligatorios.Limpiar y ocultar los campos Día de Llegada del Avión y Hora de Llegada del Avión - Autor: Lizeth Villa - Actualización: 2/6/2021 4:21:21 PM
    if (this.CotizacionForm.get('Respuesta').value == 0) {
      this.brf.ShowFolder("Motivos_de_Edicion");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Motivo_de_Edicion");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Observaciones");
      this.brf.SetRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");
      this.brf.SetRequiredControl(this.CotizacionForm, "Observaciones");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
      this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Dia_de_Llegada_del_Avion", this.brf.EvaluaQuery(" ", 1, "ABC123"), 1, "ABC123");
      this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Hora_de_Llegada_del_Avion", this.brf.EvaluaQuery(" ", 1, "ABC123"), 1, "ABC123");
    } 
    //TERMINA - BRID:89


    //INICIA - BRID:350 - si la respuesta es 1 0 2 asignar no requerido el campo motivo de edicion y observaciones,limpar campos y ocultar pestaña - Autor: Ivan Yañez - Actualización: 2/12/2021 9:06:48 AM
    //if(  EvaluaOperatorIn (this.CotizacionForm.get('Respuesta').value, this.brf.TryParseInt('1,2', '1,2') ) ) { this.brf.SetNotRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");this.brf.SetNotRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones"); this.brf.HideFolder("Motivos_de_Edicion"); this.brf.SetValueControl(this.CotizacionForm, "Observaciones", ".");this.brf.SetValueControl(this.CotizacionForm, "Observaciones", "."); this.SpartanService.SetValueExecuteQuery(this.CotizacionForm,"Motivo_de_Edicion",this.brf.EvaluaQuery(" select ' '", 1, "ABC123"),1,"ABC123");this.SpartanService.SetValueExecuteQuery(this.CotizacionForm,"Motivo_de_Edicion",this.brf.EvaluaQuery(" select ' '", 1, "ABC123"),1,"ABC123");} else {}
    //TERMINA - BRID:350

    //Respuesta_FieldExecuteBusinessRulesEnd




  }
  Observaciones_Respeusta_ExecuteBusinessRules(): void {
    //Observaciones_Respeusta_FieldExecuteBusinessRulesEnd
  }
  Dia_de_Llegada_del_Avion_ExecuteBusinessRules(): void {

    //INICIA - BRID:7239 - Colocar alerta de llegada si es menor a la fecha del día - Autor: Antonio Lopez - Actualización: 11/1/2021 6:06:29 PM
    if (this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),GETDATE(),103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'" + this.CotizacionForm.get('Dia_de_Llegada_del_Avion').value + "',103),103))", 1, 'ABC123') < this.brf.TryParseInt('0', '0')) { this.brf.ShowMessage("La fecha de llegada del avión es menor a la actual"); } else { }
    //TERMINA - BRID:7239

    //Dia_de_Llegada_del_Avion_FieldExecuteBusinessRulesEnd

  }
  Hora_de_Llegada_del_Avion_ExecuteBusinessRules(): void {
    //Hora_de_Llegada_del_Avion_FieldExecuteBusinessRulesEnd
  }



  applyRules() { }

  filterComboObservable(): Observable<FilterCombo> {
    return this.filterComboEmiter.asObservable();
  }

  filterCombo(nameCombo: string, filter: string) {
    const filterCombo: FilterCombo = { nameCombo, filter };
    this.filterComboEmiter.next(filterCombo);
  }

  rulesAfterViewInit() { }

  rulesOnInit() {
    //rulesOnInit_ExecuteBusinessRulesInit
    //console.log(this.localStorageHelper.getLoggedUserInfo().RoleId);

    //INICIA - BRID:13 - Deshabilitados - Autor: Lizeth Villa - Actualización: 2/3/2021 5:34:56 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.CotizacionForm, 'Fecha_de_Registro', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Hora_de_Registro', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Numero_de_Cotizacion', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Cliente', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Modelo', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Contacto', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Mano_de_Obra', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Partes', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Consumibles', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Total', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Usuario_que_Registra', 0);
    }
    //TERMINA - BRID:13


    //INICIA - BRID:14 - No obligatorios - Autor: Lizeth Villa - Actualización: 2/3/2021 5:51:55 PM
    this.brf.SetNotRequiredControl(this.CotizacionForm, "Clausulas_Especificas");
    this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones_Respeusta");
    //TERMINA - BRID:14


    //INICIA - BRID:16 - Deshabilitados y llenarse en automático - Autor: Lizeth Villa - Actualización: 2/5/2021 8:36:48 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.CotizacionForm, 'Fecha_de_Respuesta', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Hora_de_Respuesta', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Usuario_que_Registra_Respuesta', 0);
      this.brf.SetCurrentDateToField(this.CotizacionForm, "Fecha_de_Registro");
      this.brf.SetCurrentHourToField(this.CotizacionForm, "Hora_de_Registro");
      this.CotizacionForm.get('Usuario_que_Registra').setValue(this.localStorageHelper.getLoggedUserInfo().UserId);
    }
    //TERMINA - BRID:16


    //INICIA - BRID:73 - En modificación al abrir pantalla,deshabilitar campos fecha,hora y usuario que registra,nuemro de cotizacion ,cliente,matricula,modelo,contacto,mano de obra,partes,consumibles,total,estatus,fecha de respuesta,, hora de respuesta, usuario que registra (en pestaña "respuesta del cliente")- no obligatorio Cláusulas Específicas, Observaciones- Ocultar campo Claúsulas Generales- Apagar el checkbo - Autor: Ivan Yañez - Actualización: 2/11/2021 3:42:17 PM
    if (this.operation == 'Update') {
      this.brf.SetEnabledControl(this.CotizacionForm, 'Fecha_de_Registro', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Hora_de_Registro', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Numero_de_Cotizacion', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Cliente', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Modelo', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Contacto', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Mano_de_Obra', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Partes', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Consumibles', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Total', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Estatus', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Fecha_de_Respuesta', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Hora_de_Respuesta', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Usuario_que_Registra', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Usuario_que_Registra_Respuesta', 0);
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Clausulas_Especificas");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Clausulas_Generales");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Clausulas_Generales");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Clausulas_Generales");
      this.brf.SetValueControl(this.CotizacionForm, "Enviar_Cotizacion_a_Cliente", "false");
    }
    //TERMINA - BRID:73


    //INICIA - BRID:74 - en modificar ocultar y limpiar campo redacción de correo para el cliente. - Autor: Felipe Rodríguez - Actualización: 9/7/2021 11:25:37 AM
    if (this.operation == 'Update') {
      this.brf.HideFieldOfForm(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
      this.brf.SetValueControl(this.CotizacionForm, "Redaccion_Correo_para_Cliente", "' '");
    }
    //TERMINA - BRID:74


    //INICIA - BRID:75 - Al abrir la pantalla en edición si Orden de Trabajo Generada tiene valor entonces debe ser visible y deshabilitada, de lo contrario invisible - Autor: Lizeth Villa - Actualización: 6/14/2021 1:18:16 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Orden_de_Trabajo_Generada').value != this.brf.TryParseInt('null', 'null')) {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Orden_de_Trabajo_Generada");
        this.brf.SetEnabledControl(this.CotizacionForm, 'Orden_de_Trabajo_Generada', 0);
      } else {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Orden_de_Trabajo_Generada");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Generada");
      }
    }
    //TERMINA - BRID:75


    //INICIA - BRID:78 - Al abrir la pantalla, en edición, si el estatus Por Autorizar:- Hacer visible la pestaña Respuesta del Cliente - Quitar obligatorio a todos los campos de la pestaña Respuesta de Cliente - Autor: Cesar M Administrador - Actualización: 2/6/2021 12:11:51 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Orden_de_Trabajo_Generada').value == this.brf.TryParseInt('2', '2')) {
        this.brf.ShowFolder("Respuesta_del_Cliente");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Fecha_de_Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Generada");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Usuario_que_Registra");
      } else { }
    }
    //TERMINA - BRID:78


    //INICIA - BRID:87 - Al abrir la pantalla, en edición y consulta, si el campo "Respuesta" es "Autorizado": Hacer visibles y obligatorios los campos Día de Llegada del Avión y Hora de Llegada del Avión - Autor: Lizeth Villa - Actualización: 2/5/2021 6:43:30 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.CotizacionForm.get('Respuesta').value == this.brf.TryParseInt('1', '1')) {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
        this.brf.HideFieldOfForm(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
        this.brf.SetRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
        this.brf.SetRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
      } else { }
    }
    //TERMINA - BRID:87


    //INICIA - BRID:322 - en modificacion al abrir la pantalla si el estatus es por enviar al cliente,asignar no requerido,respuesta dia y hroa de llegado del avion - Autor: Ivan Yañez - Actualización: 2/10/2021 7:05:53 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Estatus').value == this.brf.TryParseInt('1', '1')) {
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
      } else { }
    }
    //TERMINA - BRID:322


    //INICIA - BRID:358 - al abrir pantalla en modificacion si el valor dele status es 2 ocultar pestaña motivo de edicion y respuesta del cliente, tambien asignar no requeridos campos de las pestañas - Autor: Ivan Yañez - Actualización: 2/12/2021 5:43:58 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Estatus').value == this.brf.TryParseInt('1', '1')) {
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Fecha_de_Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Generada");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones_Respeusta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Usuario_que_Registra_Respuesta");
        this.brf.HideFolder("Motivos_de_Edicion"); this.brf.HideFolder("Respuesta_del_Cliente");
      } else { }
    }
    //TERMINA - BRID:358


    //INICIA - BRID:399 - Al crear, habilitar campos Cliente, matricula, modelo y contacto - Autor: Lizeth Villa - Actualización: 2/17/2021 6:20:55 PM
    if (this.operation == 'New') {
      this.brf.SetEnabledControl(this.CotizacionForm, 'Cliente', 1);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Matricula', 1);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Modelo', 1);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Contacto', 1);
    }
    //TERMINA - BRID:399


    //INICIA - BRID:433 - En nuevo al abrir la pantalla asignar estatus nueva cotizacion - Autor: Lizeth Villa - Actualización: 3/3/2021 10:09:59 AM
    if (this.operation == 'New') {
      //this.brf.SetValueControl(this.CotizacionForm, "Estatus", "5");
      this.CotizacionForm.get('Estatus').setValue(5)
    }
    //TERMINA - BRID:433


    //INICIA - BRID:546 - En nuevo asignar por enviar - Autor: Lizeth Villa - Actualización: 3/3/2021 10:13:31 AM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.CotizacionForm, "Estatus", "1");
      this.CotizacionForm.get('Estatus').setValue(1)
    }
    //TERMINA - BRID:546


    //INICIA - BRID:547 - Al abrir ocultar campo de enviar a cliente - Autor: Lizeth Villa - Actualización: 3/3/2021 10:20:39 AM
    if (this.operation == 'New') {
      this.brf.HideFieldOfForm(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
    }
    //TERMINA - BRID:547


    //INICIA - BRID:548 - en nuevo al abrir pantalla,deshabilitar campo estatus,ocultar clausules generales,asignar no requerido,clausulas generales,motivo de edicion,observaciones,respeusta del cliente,observaciones, diay hroa de llegada de avion,orden de trabajo generada. - Autor: Lizeth Villa - Actualización: 6/14/2021 1:17:45 PM
    if (this.operation == 'New') {
      this.brf.SetEnabledControl(this.CotizacionForm, 'Estatus', 0);
      this.brf.HideFieldOfForm(this.CotizacionForm, "Clausulas_Generales");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Clausulas_Generales");
      this.brf.HideFolder("Motivos_de_Edicion");
      this.brf.HideFolder("Respuesta_del_Cliente");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Clausulas_Generales");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones_Respeusta");
    }
    //TERMINA - BRID:548


    //INICIA - BRID:549 - en nuevo al abrir pantalla asignar no requerido respuesta del cliente y orden de trabajo generada. - Autor: Ivan Yañez - Actualización: 3/3/2021 11:43:48 AM
    if (this.operation == 'New') {
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Respuesta");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Generada");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones_Respeusta");
    }
    //TERMINA - BRID:549


    //INICIA - BRID:792 - Asignar clausulas generales. - Autor: Lizeth Villa - Actualización: 3/4/2021 7:29:50 PM
    if (this.operation == 'New') {
      this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Clausulas_Generales", "select Clausulas_de_cotizacion from Politicas_de_Precios_y_Descuentos with(nolock) where folio=1", 1, "ABC123");
    }
    //TERMINA - BRID:792


    //INICIA - BRID:908 - al abir pantalla en modificacion si la fase es 4 por autorizar,limpiar motivo de edicion y observaciones en edicion - Autor: Ivan Yañez - Actualización: 3/4/2021 4:23:41 PM
    if (this.operation == 'Update') { //QueryParam
      if (this.localStorageHelper.getItemFromLocalStorage('QueryParam') == this.brf.TryParseInt('4', '4')) {
        this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Motivo_de_Edicion", this.brf.EvaluaQuery(" select ' '", 1, "ABC123"), 1, "ABC123");
        this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Motivo_de_Edicion", this.brf.EvaluaQuery(" select ' '", 1, "ABC123"), 1, "ABC123");
        this.CotizacionForm.get('Observaciones').setValue('.');
        /* this.brf.SetValueControl(this.CotizacionForm, "Observaciones", ".");
        this.brf.SetValueControl(this.CotizacionForm, "Observaciones", "."); */
      } else { }
    }
    //TERMINA - BRID:908


    //INICIA - BRID:1426 - Al modificar en por cotizar ocultar pestañas motivo de edición y  respuesta del cliente y asignar campos no requeridos - Autor: Lizeth Villa - Actualización: 3/9/2021 4:40:32 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Estatus').value == this.brf.TryParseInt('6', '6')) {
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Clausulas_Generales");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Estatus")
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Cotizacion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Fecha")
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Usuario");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Fecha_de_Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Generada");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones_Respeusta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Usuario_que_Registra");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Usuario_que_Registra_Respuesta");
        this.brf.HideFolder("Motivos_de_Edicion");
        this.brf.HideFolder("Respuesta_del_Cliente");
      } else { }
    }
    //TERMINA - BRID:1426


    //INICIA - BRID:1427 - El campo tiempo de ejecución no debe ser obligatorio - Autor: Lizeth Villa - Actualización: 3/10/2021 9:29:15 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Tiempo_de_Ejecucion");
    }
    //TERMINA - BRID:1427


    //INICIA - BRID:1453 - en nuevo y editar asignar no requerido en tipo de reporte y tipo de ingreso - Autor: Ivan Yañez - Actualización: 3/12/2021 4:04:57 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Tipo_de_ingreso"); this.brf.SetNotRequiredControl(this.CotizacionForm, "Tipo_de_Reporte");
    }
    //TERMINA - BRID:1453


    //INICIA - BRID:1608 - Al dar de alta, tipo de reporte debe ser oculto, tipo de ingreso debe ser manual, campo orden de trabajo origen debe ser oculto - Autor: Lizeth Villa - Actualización: 3/18/2021 4:45:45 PM
    if (this.operation == 'New') {
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Origen");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Tipo_de_Reporte");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Tipo_de_Reporte");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Orden_de_Trabajo_Origen");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Origen");
      this.brf.SetValueControl(this.CotizacionForm, "Tipo_de_ingreso", "2");
      this.brf.SetEnabledControl(this.CotizacionForm, 'Tipo_de_ingreso', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Orden_de_Trabajo_Generada', 0);
      this.brf.SetEnabledControl(this.CotizacionForm, 'Tipo_de_ingreso', 0);
    }
    //TERMINA - BRID:1608


    //INICIA - BRID:1646 - Al editar, si el tipo de ingreso es inspección entonces debe de mostrar orden de trabajo origen y tipo de reporte y  deshabilitarlos - Autor: Lizeth Villa - Actualización: 3/18/2021 4:48:08 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Tipo_de_ingreso').value == this.brf.TryParseInt('1', '1')) {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Tipo_de_Reporte");
        this.brf.HideFieldOfForm(this.CotizacionForm, "Orden_de_Trabajo_Origen");
        this.brf.SetEnabledControl(this.CotizacionForm, 'Tipo_de_Reporte', 0);
        this.brf.SetEnabledControl(this.CotizacionForm, 'Orden_de_Trabajo_Origen', 0);
      } else {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Tipo_de_Reporte");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Tipo_de_Reporte");
        this.brf.HideFieldOfForm(this.CotizacionForm, "Orden_de_Trabajo_Origen");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Origen");
      }
    }
    //TERMINA - BRID:1646


    //INICIA - BRID:1703 -  Al editar, si el estatus es autorizada y la orden de trabajo origen esta vacía entonces debe de mostrar a orden de trabajo generada - Autor: Lizeth Villa - Actualización: 3/18/2021 4:41:58 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Estatus').value == this.brf.TryParseInt('3', '3') && this.CotizacionForm.get('Orden_de_Trabajo_Origen').value == this.brf.TryParseInt('null', 'null')) {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Orden_de_Trabajo_Generada");
      } else {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Orden_de_Trabajo_Generada");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Generada");
      }
    }
    //TERMINA - BRID:1703


    //INICIA - BRID:1704 - Ocultar campos y asignar no requeridos tipo de reporte y orden de trabajo origen - Autor: Lizeth Villa - Actualización: 6/14/2021 1:16:27 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Tipo_de_Reporte");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Origen");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Tipo_de_Reporte");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Tipo_de_Reporte");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Orden_de_Trabajo_Origen");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Origen");
      this.brf.SetEnabledControl(this.CotizacionForm, 'Tipo_de_ingreso', 0);
    }
    //TERMINA - BRID:1704


    //INICIA - BRID:1705 - en nuevo y modificar des habilitar modelo - Autor: Ivan Yañez - Actualización: 3/18/2021 3:20:58 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.CotizacionForm, 'Modelo', 0);
    }
    //TERMINA - BRID:1705


    //INICIA - BRID:1737 - Deshabilitar tipo de ingreso - Autor: Lizeth Villa - Actualización: 3/18/2021 4:40:41 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.CotizacionForm, 'Tipo_de_ingreso', 0);
    }
    //TERMINA - BRID:1737


    //INICIA - BRID:6291 - Mostrar campo Orden_de_Trabajo_Origen si es por inspeccion y el estatus es por cotizar - Autor: Lizeth Villa - Actualización: 9/14/2021 4:38:46 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.CotizacionForm.get('Estatus').value == this.brf.TryParseInt('6', '6') && this.CotizacionForm.get('Tipo_de_ingreso').value == this.brf.TryParseInt('1', '1')) {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Orden_de_Trabajo_Origen");
        this.brf.HideFieldOfForm(this.CotizacionForm, "Tipo_de_Reporte");
      } else { }
    }
    //TERMINA - BRID:6291


    //INICIA - BRID:6292 - Asignar tamaños a campos - Autor: Lizeth Villa - Actualización: 9/17/2021 10:18:50 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:6292


    //INICIA - BRID:6416 - Ocultar campos Reporte y Items de inspeccion - Autor: ANgel Acuña - Actualización: 9/22/2021 6:30:03 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.CotizacionForm, "Reporte");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Reporte");
      this.brf.HideFieldOfForm(this.CotizacionForm, "Item_de_Inspeccion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Item_de_Inspeccion");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Reporte");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Item_de_Inspeccion");
    }
    //TERMINA - BRID:6416


    //INICIA - BRID:6417 - En nuevo Ocultar campo  de comentarios de mantenimiento - Autor: ANgel Acuña - Actualización: 9/22/2021 6:30:04 PM
    if (this.operation == 'New') {
      this.brf.HideFieldOfForm(this.CotizacionForm, "Comentarios_Mantenimiento");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Comentarios_Mantenimiento");
      this.brf.SetNotRequiredControl(this.CotizacionForm, "Comentarios_Mantenimiento");
    }
    //TERMINA - BRID:6417


    //INICIA - BRID:6418 - En modificacion o consulta si Orden de trabajo es diferente de null, mostrar comentarios mantenimiento sino ocultar - Autor: ANgel Acuña - Actualizació  n: 9/23/2021 9:52:08 AM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.CotizacionForm.get('Orden_de_Trabajo_Origen').value == this.brf.TryParseInt('null', 'null')) {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Comentarios_Mantenimiento");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Comentarios_Mantenimiento");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Comentarios_Mantenimiento");
        this.brf.SetEnabledControl(this.CotizacionForm, 'Comentarios_Mantenimiento', 0);
      } else {
        this.brf.HideFieldOfForm(this.CotizacionForm, "Comentarios_Mantenimiento");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Comentarios_Mantenimiento");
        this.brf.SetEnabledControl(this.CotizacionForm, 'Comentarios_Mantenimiento', 1);
      }
    }
    //TERMINA - BRID:6418


    //INICIA - BRID:6516 - Filtrar el numero de reporte, por que no se mira - Codigo Manual - Autor: ANgel Acuña - Actualización: 9/27/2021 1:28:21 PM
    if (this.operation == 'Update') {

    }
    //TERMINA - BRID:6516


    //INICIA - BRID:7114 - WF:2 Rule - Phase: 3 (Por enviar a Cliente) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('QueryParam') == "3") {
        this.brf.HideFolder("Motivos_de_Edicion"); this.brf.HideFolder("Respuesta_del_Cliente");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Motivo_de_Edicion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Fecha_de_Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Respuesta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Dia_de_Llegada_del_Avion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Llegada_del_Avion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Observaciones_Respeusta");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Usuario_que_Registra_Respuesta");
      } else { }
    }
    //TERMINA - BRID:7114


    //INICIA - BRID:7116 - WF:2 Rule - Phase: 4 (Por Autorizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('QueryParam') == "4") { } else { }
    }
    //TERMINA - BRID:7116


    //INICIA - BRID:7118 - WF:2 Rule - Phase: 5 (Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('QueryParam') == "5") {
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Folio");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Fecha_de_Registro");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Hora_de_Registro");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Numero_de_Cotizacion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Cliente");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Matricula");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Modelo");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Contacto");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Tiempo_de_Ejecucion");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Clausulas_Especificas");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Clausulas_Generales");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Estatus");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Usuario_que_Registra");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Enviar_Cotizacion_a_Cliente");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Redaccion_Correo_para_Cliente");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Tipo_de_ingreso");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Tipo_de_Reporte");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Origen");
        this.brf.SetNotRequiredControl(this.CotizacionForm, "Orden_de_Trabajo_Generada");
      } else { }
    }
    //TERMINA - BRID:7118


    //INICIA - BRID:7120 - WF:2 Rule - Phase: 6 (Canceladas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('QueryParam') == "6") { } else { }
    }
    //TERMINA - BRID:7120


    //INICIA - BRID:7122 - WF:2 Rule - Phase: 1 (Nueva Cotización) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('QueryParam') == "1") { } else { }
    }
    //TERMINA - BRID:7122


    //INICIA - BRID:7124 - WF:2 Rule - Phase: 2 (Por Cotizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('QueryParam') == "2") { } else { }
    }
    //TERMINA - BRID:7124


    //INICIA - BRID:7240 - Asignar valor a los campos "Porcentaje de Consumibles" y "Porcentaje de Anticipo" pero se puede editar - Autor: Eliud Hernandez - Actualización: 11/1/2021 4:26:42 PM
    if (this.operation == 'New') {
      this.CotizacionForm.get('Porcentaje_de_Consumibles').setValue("4")
      this.CotizacionForm.get('Porcentaje_de_Anticipo').setValue("60")
      /* this.brf.SetValueControl(this.CotizacionForm, "Porcentaje_de_Consumibles", "4"); 
      this.brf.SetValueControl(this.CotizacionForm, "Porcentaje_de_Anticipo", "60"); */
    }
    //TERMINA - BRID:7240


    //INICIA - BRID:7244 - Asignar valor a los campos "Porcentaje de Consumibles" y "Porcentaje de Anticipo" pero se puede editar (fase dos) - Autor: Eliud Hernandez - Actualización: 11/1/2021 6:44:46 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('QueryParam') == "2") {
        this.CotizacionForm.get('Porcentaje_de_Consumibles').setValue("4")
        this.CotizacionForm.get('Porcentaje_de_Anticipo').setValue("60")
  /* this.brf.SetValueControl(this.CotizacionForm, "Porcentaje_de_Consumibles", "4"); 
  this.brf.SetValueControl(this.CotizacionForm, "Porcentaje_de_Anticipo", "60"); */} else { }
    }


    this.brf.HideFolder("Motivos_de_Edicion");
    //TERMINA - BRID:7244


    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Estatus').value == this.brf.TryParseInt('6', '6')) {
        this.brf.HideFolder("Respuesta_del_Cliente");
      }
    }

    //rulesOnInit_ExecuteBusinessRulesEnd









































  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:91 - En modificación, después de guardar, si el estatus es "Por Autorizar" y el campo "Respuesta" = "Cancelado":Actualizar el estatus a Cancelado - Autor: Lizeth Villa - Actualización: 2/9/2021 8:56:38 AM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Estatus').value == this.brf.TryParseInt('2', '2') && this.CotizacionForm.get('Respuesta').value == this.brf.TryParseInt('2', '2')) { this.brf.EvaluaQuery("update Cotizacion set Estatus = 4 WHERE Folio = " + this.CotizacionForm.get('Folio').value + "", 1, "ABC123"); } else { }
    }
    //TERMINA - BRID:91


    //INICIA - BRID:180 - 8.- En modificar, después de guardar si el campo "Motivo de Edición" es distinto de vacío entonces:- insertar un registro en la tabla del MR de Historial.- Actualizar el registro y limpiar el campo Motivo de Edición y Observaciones - Autor: Ivan Yañez - Actualización: 2/16/2021 12:30:26 AM
    if (this.operation == 'Update') {
      if (this.brf.EvaluaQuery("select " + this.CotizacionForm.get('Motivo_de_Edicion').value + "", 1, 'ABC123') != this.brf.TryParseInt('null', 'null')) { this.brf.EvaluaQuery(" exec usphistorialedicioncotizacion " + this.CotizacionForm.get('Folio').value + "," + this.CotizacionForm.get('Motivo_de_Edicion').value + ",'" + this.CotizacionForm.get('Observaciones').value + "'," + this.localStorageHelper.getLoggedUserInfo().UserId + "", 1, "ABC123"); } else { }
    }
    //TERMINA - BRID:180


    //INICIA - BRID:216 - En modificación, después de guardar, si el estatus es "Por Autorizar" y el campo "Respuesta" = "Autorizado":- actualizar estatus a autorizado- enviar un correo a todos los usuarios de los roles: "Gerente de mantenimiento / Supervisor de mantenimiento", "Técnico de mantenimiento" y "Jefe de control y programación del mantenimiento" con la siguiente redacción:('"se modifico créate rule en el c - Autor: Lizeth Villa - Actualización: 9/29/2021 1:27:27 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Estatus').value == this.brf.TryParseInt('2', '2') && this.CotizacionForm.get('Respuesta').value == this.brf.TryParseInt('1', '1')) {
        this.brf.EvaluaQuery(" update Cotizacion set Estatus=3 Where Folio=" + this.CotizacionForm.get('Folio').value + "", 1, "ABC123");
        //this.brf.SendEmailQuery("VICS - Nueva Cotización Autorizada por Cliente", this.brf.EvaluaQuery("select STUFF(( select ';' + Email + '' from Spartan_User where Role in (19,20,16) for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; width: 100% !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" height="100%" bgcolor="#e0e0e0" style="margin: 0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td><center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;"> <tr> <td style="padding: 20px 0; text-align: center"><img src="http://192.168.1.101/MVCvics/images/logo-aerovics.png" width="300" height="auto" alt="alt_text" border="0"></td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td><table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Por este medio se les informa que el cliente ha autorizado la cotización de trabajos a realizar para la Orden de Trabajo No. FLDD[Orden_de_Trabajo_Generada] , favor de acceder al sistema VICS para ver el detalle</p> </td> </tr> </table></td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;"> <tr> <td style="padding: 40px 10px;width: 100%;font-size: 12px; font-family: sans-serif; mso-height-rule: exactly; line-height:18px; text-align: center; color: #888888;"> <p>FLDD[Usuario_que_Registra]<br> Ventas / Atención a Clientes.<br> <p>Aerovics, S.A. de C.V.</p> </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center></td> </tr> </table> </body> </html>	");
      } else { }
    }
    //TERMINA - BRID:216


    //INICIA - BRID:368 - 6.- En modificación, despues de guardar, si el checkbox "Enviar Cotización a Cliente" está activado:- Enviar correo al Cliente poniendo de redacción el campo "Redacción Correo para Cliente" y enviando el formato de carta de cotización. También se les debe enviar copia del correo a todos los usuarios de los role de ventas y cliente - Autor: Lizeth Villa - Actualización: 9/29/2021 12:29:41 PM
    if (this.operation == 'Update') {
      //if( this.CotizacionForm.get('Enviar_Cotizacion_a_Cliente')==this.brf.TryParseInt('true', 'true') ) { this.brf.SendEmailQueryPrintFormat("VICS - Cotización No. FLD[Numero_de_Cotizacion] para su autorización", this.brf.EvaluaQuery("SELECT STUFF(( select ';'+ k +'' from( SELECT Email as k from Spartan_User as I where Role = 39 UNION ALL SELECT Correo_Electronico as k from Cliente as j where Clave=FLD[Cliente] ) as k FOR XML PATH('') ),1,1,'')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; width: 100% !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" height="100%" bgcolor="#e0e0e0" style="margin: 0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td><center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;"> <tr> <td style="padding: 20px 0; text-align: center"><img src="http://192.168.1.101/MVCvics/images/logo-aerovics.png" width="300" height="auto" alt="alt_text" border="0"></td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td><table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado FLD[Contacto]</p> <p>FLD[Redaccion_Correo_para_Cliente]</p> <p>Gracias y Saludos,</p> </td> </tr> </table></td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;"> <tr> <td style="padding: 40px 10px;width: 100%;font-size: 12px; font-family: sans-serif; mso-height-rule: exactly; line-height:18px; text-align: center; color: #888888;"> <p>FLDD[Usuario_que_Registra]<br> Ventas / Atención a Clientes.<br> <p>Aerovics, S.A. de C.V.</p> </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center></td> </tr> </table> </body> </html>,12,EvaluaQuery("select "+this.CotizacionForm.get('Folio').value+"", 1, "ABC123"));} else {}
    }
    //TERMINA - BRID:368


    //INICIA - BRID:478 - En editar, despues de guardar, si el estatus es por autorizar y el chek de enviar a cliente no esta activado, asignar Por enviar al cliente  - Autor: Lizeth Villa - Actualización: 9/29/2021 2:08:20 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Estatus').value == this.brf.TryParseInt('6', '6') && this.CotizacionForm.get('Enviar_Cotizacion_a_Cliente').value == this.brf.TryParseInt('false', 'false')) {
        this.brf.EvaluaQuery("UPDATE Cotizacion SET Estatus = 1 where folio = " + this.CotizacionForm.get('Folio').value + "", 1, "ABC123");
      } else { }
    }
    //TERMINA - BRID:478


    //INICIA - BRID:724 - En Nuevo, despues de guardar, si el checkbox "Enviar Cotización a Cliente" está activado:Enviar correo al Cliente poniendo de redacción el campo "Redacción Correo para Cliente" y enviando el formato de carta de cotización con copia del correo a los usuarios de ventas y cliente - Autor: Lizeth Villa - Actualización: 9/30/2021 6:41:38 PM
    if (this.operation == 'New') {
      if (this.CotizacionForm.get('Enviar_Cotizacion_a_Cliente').value == this.brf.TryParseInt('true', 'true')) {
        this.brf.EvaluaQuery("exec usp_CotizacionClausulasGenerales " + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted) + "", 1, "ABC123");
        //this.brf.SendEmailQueryPrintFormat("VICS - Cotización No. '+ EvaluaQuery("select Numero_de_cotizacion from Cotizacion where folio = "+this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)+" ")+' para su autorización", this.brf.EvaluaQuery("SELECT STUFF(( select ';'+ k +'' from( SELECT Email as k from Spartan_User as I where Role = 39 UNION ALL SELECT Correo_Electronico as k from Cliente as j where Clave=FLD[Cliente] ) as k FOR XML PATH('') ),1,1,'')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 0 !important; padding: 0 !important; height: 100% !important; width: 100% !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" height="100%" bgcolor="#e0e0e0" style="margin: 0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td><center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Texto para previsualizar en el lector de correo. No se ve en el correo </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;"> <tr> <td style="padding: 20px 0; text-align: center"><img src="http://192.168.1.101/MVCvics/images/logo-aerovics.png" width="300" height="auto" alt="alt_text" border="0"></td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td><table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Estimado FLD[Contacto]</p> <p>FLD[Redaccion_Correo_para_Cliente]</p> <p>Gracias y Saludos,</p> </td> </tr> </table></td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;"> <tr> <td style="padding: 40px 10px;width: 100%;font-size: 12px; font-family: sans-serif; mso-height-rule: exactly; line-height:18px; text-align: center; color: #888888;"> <p>FLDD[Usuario_que_Registra]<br> Ventas / Atención a Clientes.<br> <p>Aerovics, S.A. de C.V.</p> </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center></td> </tr> </table> </body> </html>	,12,EvaluaQuery(""+this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)+"", 1, "ABC123"));
      } else { }
    }
    //TERMINA - BRID:724


    //INICIA - BRID:789 - actualizar numero de cotizacion despues de crear un nuevo registro. - Autor: Ivan Yañez - Actualización: 3/4/2021 8:41:08 AM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(" exec uspfoliocotizacion " + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted) + "", 1, "ABC123");
    }
    //TERMINA - BRID:789


    //INICIA - BRID:1030 - Asignar clausulas general  - Autor: Lizeth Villa - Actualización: 3/4/2021 7:46:09 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery("exec usp_CotizacionClausulasGenerales " + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted) + "", 1, "ABC123");
    }
    //TERMINA - BRID:1030


    //INICIA - BRID:6525 - Al modificar si el estatus es Autorizada (3), ejecutar SP y enviar correo - Autor: ANgel Acuña - Actualización: 9/29/2021 7:17:14 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Respuesta').value == this.brf.TryParseInt('1', '1')) {
        this.brf.EvaluaQuery(" exec uspActualizaReporteCotizacion " + this.CotizacionForm.get('Folio').value + "", 1, "ABC123");
        //this.brf.SendEmailQuery("Ha sido aprobada una cotización", this.brf.EvaluaQuery("select STUFF((select ';' + Email + '' from Spartan_User where Role in (17,19) for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #E0E0E0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#E0E0E0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#FFFFFF" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"> <img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"> </td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#FFFFFF" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Buenos días</p> <p>Ha sido aprobada una cotización para el siguiente reporte:</p> <br> <p><strong>Número de Reporte:</strong> FLD[Reporte] </p> <br> <p><strong>Número de Cotización:</strong> FLD[Numero_de_Cotizacion] </p><br><p><strong>Matricula:</strong> "+this.CotizacionForm.get('Matricula').value+" </p> <br><p><strong>No. de Orden de Trabajo:</strong> FLD[Orden_de_Trabajo_Origen]</p> <br> <br><p><strong>Atentamente:</strong> ' + EvaluaQuery("select name from spartan_user where id_user = FLD[Usuario_que_Registra]") +'</p> <p>Favor de enviar acuse de recibido.</p> <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" valign="middle" style="text-align: right;"> </td> <td width="5">&nbsp;</td> <td> <p style="font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;">' + EvaluaQuery("select name from spartan_user where id_user = FLD[Usuario_que_Registra]") +'</p> <p style="font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;"> Ventas.</p> </td> <td width="40">&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width="40" valign="middle" style="text-align: right;"> <img style="width: 24px; height: 24px;" src="http://108.60.201.12/vicsdemoventas3/images/mail-plane.png"/> </td> <td width="5">&nbsp;</td> <td> <p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p> </td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#FFFFFF" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px"> &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	");
      } else { }
    }
    //TERMINA - BRID:6525


    //INICIA - BRID:6526 - En modificar si el estatus es rechazado (4) enviar correo y ejecutar SP - Autor: ANgel Acuña - Actualización: 9/29/2021 7:17:15 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Respuesta').value == this.brf.TryParseInt('2', '2')) {
        this.brf.EvaluaQuery(" exec uspActualizaReporteCotizacion " + this.CotizacionForm.get('Folio').value + "", 1, "ABC123");
        //this.brf.SendEmailQuery("Ha sido Rechazada una cotización", this.brf.EvaluaQuery("select STUFF((select ';' + Email + '' from Spartan_User where Role in (17,19) for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #E0E0E0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#E0E0E0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#FFFFFF" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"> <img src="http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"> </td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#FFFFFF" width="100%" style="max-width: 600px;"> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr> <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;"> <p>Buenos días</p> <p>Ha sido rechazada una cotización para el siguiente reporte:</p> <br> <p><strong>Número de Reporte:</strong> FLD[Reporte] </p> <br> <p><strong>Número de Cotización:</strong> FLD[Numero_de_Cotizacion] </p><br><p><strong>Matricula:</strong> "+this.CotizacionForm.get('Matricula').value+" </p> <br><p><strong>No. de Orden de Trabajo:</strong> FLD[Orden_de_Trabajo_Origen]</p> <br> <br><p><strong>Atentamente:</strong> ' + EvaluaQuery("select name from spartan_user where id_user = FLD[Usuario_que_Registra]") +' </p> <p>Favor de enviar acuse de recibido.</p> <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;"> <tr> <td width="40">&nbsp;</td> <td width="40" valign="middle" style="text-align: right;"> </td> <td width="5">&nbsp;</td> <td> <p style="font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;">' + EvaluaQuery("select name from spartan_user where id_user = FLD[Usuario_que_Registra]") +']</p> <p style="font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;"> Ventas.</p> </td> <td width="40">&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width="40" valign="middle" style="text-align: right;"> <img style="width: 24px; height: 24px;" src="http://108.60.201.12/vicsdemoventas3/images/mail-plane.png"/> </td> <td width="5">&nbsp;</td> <td> <p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p> </td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#FFFFFF" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px"> &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>	");
      } else { }
    }
    //TERMINA - BRID:6526


    //INICIA - BRID:6559 - ejecutar sp uspGeneraReportedesdeVentas al autorizar la cotizacion - Autor: ANgel Acuña - Actualización: 9/29/2021 6:13:39 PM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Respuesta').value == this.brf.TryParseInt('1', '1')) { this.brf.EvaluaQuery(" exec uspGeneraReportedesdeVentas " + this.CotizacionForm.get('Folio').value + "", 1, "ABC123"); } else { }
    }
    //TERMINA - BRID:6559

    //rulesAfterSave_ExecuteBusinessRulesEnd











  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:193 - Si se edita una cotización enviada al cliente, al guardar se debe cancelar la actual y mantener la información y generar una nueva con las modificaciones realizadas - Autor: Ivan Yañez - Actualización: 2/16/2021 12:30:15 AM
    if (this.operation == 'Update') {
      if (this.CotizacionForm.get('Estatus') == this.brf.TryParseInt('2', '2') && this.brf.EvaluaQuery("select " + this.CotizacionForm.get('Motivo_de_Edicion').value + "", 1, 'ABC123') != this.brf.TryParseInt('null', 'null')) { this.brf.CreateSessionVar("folionuevacotizacion", "EXEC uspCancelarCotizacionyGenerarNueva " + this.CotizacionForm.get('Folio').value + "", 1, "ABC123"); this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Folio", this.brf.EvaluaQuery(" select GLOBAL[folionuevacotizacion]", 1, "ABC123"), 1, "ABC123"); } else { }
    }
    //TERMINA - BRID:193


    //INICIA - BRID:220 - 6.- En modificación, antes de guardar, si el checkbox "Enviar Cotización a Cliente" está activado:- cambiar el estatus a "Por Autorizar"- Enviar correo al Cliente poniendo de redacción el campo "Redacción Correo para Cliente" y enviando el formato de carta de cotización. También se les debe enviar copia del correo a todos los usuarios de los roles de usuario:a) Gerente de mantenimiento / Sup - Autor: Ivan Yañez - Actualización: 2/15/2021 5:39:40 PM
    if (this.operation == 'Update') {
      //if( this.CotizacionForm.get('Enviar_Cotizacion_a_Cliente')==this.brf.TryParseInt('true', 'true') ) { this.SpartanService.SetValueExecuteQuery(this.CotizacionForm,"Estatus",this.brf.EvaluaQuery(" select 2", 1, "ABC123"),1,"ABC123"); this.brf.SendEmailQueryPrintFormat("VICS - Cotización No. FLD[Numero_de_Cotizacion] para su autorización", this.brf.EvaluaQuery("SELECT  STUFF((@LC@@LB@     select ';'+ k +'' from(@LC@@LB@ @LC@@LB@     SELECT   Email as k from Spartan_User as I where Role in (19,20,16,17,27,22,23)@LC@@LB@     UNION ALL@LC@@LB@     SELECT  Correo_Electronico as k from Cliente as j where Clave=FLD[Cliente]@LC@@LB@     ) as k@LC@@LB@     FOR XML PATH('')@LC@@LB@     ),1,1,'')", 1, "ABC123"), "<!doctype html>@LC@@LB@ <html>@LC@@LB@ <head>@LC@@LB@ <meta charset="utf-8">@LC@@LB@ <meta name="viewport" content="width=device-width, initial-scale=1.0">@LC@@LB@ <meta http-equiv="X-UA-Compatible" content="IE=edge">@LC@@LB@ <title>EmailTemplate-Fluid</title>@LC@@LB@ <style type="text/css">@LC@@LB@ html, body {@LC@@LB@ 	margin: 0 !important;@LC@@LB@ 	padding: 0 !important;@LC@@LB@ 	height: 100% !important;@LC@@LB@ 	width: 100% !important;@LC@@LB@ }@LC@@LB@ * {@LC@@LB@ 	-ms-text-size-adjust: 100%;@LC@@LB@ 	-webkit-text-size-adjust: 100%;@LC@@LB@ }@LC@@LB@ .ExternalClass {@LC@@LB@ 	width: 100%;@LC@@LB@ }@LC@@LB@ div[style*="margin: 16px 0"] {@LC@@LB@ 	margin: 0 !important;@LC@@LB@ }@LC@@LB@ table, td {@LC@@LB@ 	mso-table-lspace: 0pt !important;@LC@@LB@ 	mso-table-rspace: 0pt !important;@LC@@LB@ }@LC@@LB@ table {@LC@@LB@ 	border-spacing: 0 !important;@LC@@LB@ 	border-collapse: collapse !important;@LC@@LB@ 	table-layout: fixed !important;@LC@@LB@ 	margin: 0 auto !important;@LC@@LB@ }@LC@@LB@ table table table {@LC@@LB@ 	table-layout: auto;@LC@@LB@ }@LC@@LB@ img {@LC@@LB@ 	-ms-interpolation-mode: bicubic;@LC@@LB@ }@LC@@LB@ .yshortcuts a {@LC@@LB@ 	border-bottom: none !important;@LC@@LB@ }@LC@@LB@ a[x-apple-data-detectors] {@LC@@LB@ 	color: inherit !important;@LC@@LB@ }@LC@@LB@ /* Estilos Hover para botones */@LC@@LB@ .button-td, .button-a {@LC@@LB@ 	transition: all 100ms ease-in;@LC@@LB@ }@LC@@LB@ .button-td:hover, .button-a:hover {@LC@@LB@ 	color: #000;@LC@@LB@ }@LC@@LB@ </style>@LC@@LB@ </head>@LC@@LB@ <body width="100%" height="100%" bgcolor="#e0e0e0" style="margin: 0;" yahoo="yahoo">@LC@@LB@ <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;">@LC@@LB@   <tr>@LC@@LB@     <td><center style="width: 100%;">@LC@@LB@         <!-- Visually Hidden Preheader Text : BEGIN -->@LC@@LB@         <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Texto para previsualizar en el lector de correo. No se ve en el correo </div>@LC@@LB@         <!-- Visually Hidden Preheader Text : END -->@LC@@LB@         <div style="max-width: 600px;"> @LC@@LB@           <!--[if (gte mso 9)|(IE)]>@LC@@LB@             <table cellspacing="0" cellpadding="0" border="0" width="600" align="center">@LC@@LB@             <tr>@LC@@LB@             <td>@LC@@LB@             <![endif]--> @LC@@LB@           <!-- Email Header : BEGIN -->@LC@@LB@           <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 600px;">@LC@@LB@             <tr>@LC@@LB@               <td style="padding: 20px 0; text-align: center"><img src="http://192.168.1.101/MVCvics/images/logo-aerovics.png" width="300" height="auto" alt="alt_text" border="0"></td>@LC@@LB@             </tr>@LC@@LB@           </table>@LC@@LB@           <!-- Email Header : END --> @LC@@LB@           <!-- Email Body : BEGIN -->@LC@@LB@           <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;">@LC@@LB@             <!-- 1 Column Text : BEGIN -->@LC@@LB@             <tr>@LC@@LB@               <td><table cellspacing="0" cellpadding="0" border="0" width="100%">@LC@@LB@                   <tr>@LC@@LB@                     <td style="padding: 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;">@LC@@LB@ 						<p>Estimado FLD[Contacto]</p>@LC@@LB@ 						<p>FLD[Redaccion_Correo_para_Cliente]</p>@LC@@LB@ 						<p>Gracias y Saludos,</p>@LC@@LB@ 					  </td>@LC@@LB@                   </tr>@LC@@LB@                 </table></td>@LC@@LB@             </tr>@LC@@LB@             <!-- 1 Column Text : BEGIN --> @LC@@LB@           </table>@LC@@LB@           <!-- Email Body : END --> @LC@@LB@           <!-- Email Footer : BEGIN -->@LC@@LB@           <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" style="max-width: 680px;">@LC@@LB@             <tr>@LC@@LB@               <td style="padding: 40px 10px;width: 100%;font-size: 12px; font-family: sans-serif; mso-height-rule: exactly; line-height:18px; text-align: center; color: #888888;">@LC@@LB@ 				  <p>FLDD[Usuario_que_Registra]<br>@LC@@LB@ Ventas / Atención a Clientes.<br>@LC@@LB@ <p>Aerovics, S.A. de C.V.</p>@LC@@LB@ 				</td>@LC@@LB@             </tr>@LC@@LB@           </table>@LC@@LB@           <!-- Email Footer : END --> @LC@@LB@           <!--[if (gte mso 9)|(IE)]>@LC@@LB@             </td>@LC@@LB@             </tr>@LC@@LB@             </table>@LC@@LB@             <![endif]--> @LC@@LB@         </div>@LC@@LB@       </center></td>@LC@@LB@   </tr>@LC@@LB@ </table>@LC@@LB@ </body>@LC@@LB@ </html>,12,EvaluaQuery("select "+this.CotizacionForm.get('Folio').value+"", 1, "ABC123"));} else {}
    }
    //TERMINA - BRID:220


    //INICIA - BRID:398 - 6.- En nuevo y modificación, antes de guardar, si el checkbox "Enviar Cotización a Cliente" está activado: - cambiar el estatus a "Por Autorizar"	 - Autor: Ivan Yañez - Actualización: 3/3/2021 12:00:52 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.CotizacionForm.get('Enviar_Cotizacion_a_Cliente') == this.brf.TryParseInt('true', 'true')) { this.SpartanService.SetValueExecuteQuery(this.CotizacionForm, "Estatus", this.brf.EvaluaQuery("select 2", 1, "ABC123"), 1, "ABC123"); } else { }
    }
    //TERMINA - BRID:398


    //INICIA - BRID:5873 - Actualizar observaciones antes de guardar - Autor: Lizeth Villa - Actualización: 9/6/2021 6:52:21 PM
    if (this.operation == 'Update') {
      this.brf.EvaluaQuery("UPDATE Cotizacion SET motivo_de_edicion = '" + this.CotizacionForm.get('Observaciones').value + "' where folio = '" + this.CotizacionForm.get('Folio').value + "'", 1, "ABC123");
    }
    //TERMINA - BRID:5873


    //INICIA - BRID:7241 - Se valida si tiempo ejecucion esta vacio y checkbox enviar cotización , preguntar al ususario si desea guardar - Autor: Antonio Lopez - Actualización: 11/1/2021 5:56:25 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.CotizacionForm.get('Enviar_Cotizacion_a_Cliente') == this.brf.TryParseInt('true', 'true') && this.CotizacionForm.get('Tiempo_de_Ejecucion') == this.brf.EvaluaQuery("SELECT ''", 1, 'ABC123')) { this.brf.ShowMessage(" Se enviara cotización a cliente sin tiempo de ejecución"); } else { }
    }
    //TERMINA - BRID:7241

    //rulesBeforeSave_ExecuteBusinessRulesEnd





    return result;
  }

  //Fin de reglas

  public openCodigoComputarizado() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.height = '90%';
    dialogConfig.width = '90%';
    let vrCliente = this.CotizacionForm.get('Cliente').value.Clave;
    //console.log(vrCliente)
    this.localStorageHelper.setItemToLocalStorage("ClienteSeleccionado", vrCliente);

    const dialogRef = this.dialog.open(PoupCodigocomputarizadoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(
      data => {
        this.localStorageHelper.setItemToLocalStorage("GetCogidosSeleccionados", "");
        this.localStorageHelper.setItemToLocalStorage("ClienteSeleccionado", "");
      }, error => {
        //console.log("error");
        this.localStorageHelper.setItemToLocalStorage("GetCogidosSeleccionados", "");
        this.localStorageHelper.setItemToLocalStorage("ClienteSeleccionado", "");
      });
  }


}
