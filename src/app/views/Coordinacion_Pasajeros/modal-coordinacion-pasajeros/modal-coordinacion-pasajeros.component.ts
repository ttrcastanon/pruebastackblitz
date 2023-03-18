import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, Inject } from '@angular/core';
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
import { Coordinacion_PasajerosService } from 'src/app/api-services/Coordinacion_Pasajeros.service';
import { Coordinacion_Pasajeros } from 'src/app/models/Coordinacion_Pasajeros';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Detalle_Coordinacion_Paxs_ServiciosService } from 'src/app/api-services/Detalle_Coordinacion_Paxs_Servicios.service';
import { Detalle_Coordinacion_Paxs_Servicios } from 'src/app/models/Detalle_Coordinacion_Paxs_Servicios';
import { PasajerosService } from 'src/app/api-services/Pasajeros.service';
import { Pasajeros } from 'src/app/models/Pasajeros';
import { Estatus_de_ConfirmacionService } from 'src/app/api-services/Estatus_de_Confirmacion.service';
import { Estatus_de_Confirmacion } from 'src/app/models/Estatus_de_Confirmacion';

import { Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasService } from 'src/app/api-services/Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas.service';
import { Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas } from 'src/app/models/Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas';
import { Tipo_de_Medio_de_ComunicacionService } from 'src/app/api-services/Tipo_de_Medio_de_Comunicacion.service';
import { Tipo_de_Medio_de_Comunicacion } from 'src/app/models/Tipo_de_Medio_de_Comunicacion';
import { Medio_de_ComunicacionService } from 'src/app/api-services/Medio_de_Comunicacion.service';
import { Medio_de_Comunicacion } from 'src/app/models/Medio_de_Comunicacion';

import { Detalle_Coord_Paxs_Comisariato_NormalService } from 'src/app/api-services/Detalle_Coord_Paxs_Comisariato_Normal.service';
import { Detalle_Coord_Paxs_Comisariato_Normal } from 'src/app/models/Detalle_Coord_Paxs_Comisariato_Normal';

import { Detalle_Coord_Paxs_Comisariato_InstalacionesService } from 'src/app/api-services/Detalle_Coord_Paxs_Comisariato_Instalaciones.service';
import { Detalle_Coord_Paxs_Comisariato_Instalaciones } from 'src/app/models/Detalle_Coord_Paxs_Comisariato_Instalaciones';
import { Tipo_de_InstalacionService } from 'src/app/api-services/Tipo_de_Instalacion.service';
import { Tipo_de_Instalacion } from 'src/app/models/Tipo_de_Instalacion';

import { Detalle_Coord_Paxs_ReservacionesService } from 'src/app/api-services/Detalle_Coord_Paxs_Reservaciones.service';
import { Detalle_Coord_Paxs_Reservaciones } from 'src/app/models/Detalle_Coord_Paxs_Reservaciones';
import { Tipo_de_HospedajeService } from 'src/app/api-services/Tipo_de_Hospedaje.service';
import { Tipo_de_Hospedaje } from 'src/app/models/Tipo_de_Hospedaje';

import { Detalle_Coord_Paxs_TransportacionService } from 'src/app/api-services/Detalle_Coord_Paxs_Transportacion.service';
import { Detalle_Coord_Paxs_Transportacion } from 'src/app/models/Detalle_Coord_Paxs_Transportacion';
import { Tipo_de_TransportacionService } from 'src/app/api-services/Tipo_de_Transportacion.service';
import { Tipo_de_Transportacion } from 'src/app/models/Tipo_de_Transportacion';

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
import { SpartanQueryDictionary } from 'src/app/models/spartan-query-dictionary';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { element } from 'protractor';

@Component({
  selector: 'app-modal-coordinacion-pasajeros',
  templateUrl: './modal-coordinacion-pasajeros.component.html',
  styleUrls: ['./modal-coordinacion-pasajeros.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ModalCoordinacionPasajerosComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Coordinacion_PasajerosForm: FormGroup;
  public Editor = ClassicEditor;
  model: Coordinacion_Pasajeros;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
  hasOptionsNumero_de_Vuelo: boolean;
  isLoadingNumero_de_Vuelo: boolean;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  public varPasajeros: Pasajeros[] = [];
  public varEstatus_de_Confirmacion: Estatus_de_Confirmacion[] = [];

  optionsPasajerosFiltered: Observable<SpartanQueryDictionary[]>;
  optionsPasajeros: SpartanQueryDictionary[] = [];

  autoPasajero_Detalle_Coordinacion_Paxs_Servicios = new FormControl();
  SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios: string[] = [];
  isLoadingPasajero_Detalle_Coordinacion_Paxs_Servicios: boolean;
  searchPasajero_Detalle_Coordinacion_Paxs_ServiciosCompleted: boolean;

  public varTipo_de_Medio_de_Comunicacion: Tipo_de_Medio_de_Comunicacion[] = [];
  public varMedio_de_Comunicacion: Medio_de_Comunicacion[] = [];
  public varTipo_de_Instalacion: Tipo_de_Instalacion[] = [];
  public varTipo_de_Hospedaje: Tipo_de_Hospedaje[] = [];
  public varTipo_de_Transportacion: Tipo_de_Transportacion[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  dataSourceServicios = new MatTableDataSource<Detalle_Coordinacion_Paxs_Servicios>();
  ServiciosColumns = [
    { def: 'actions', hide: false },
    { def: 'Pasajero', hide: false },
    { def: 'Ruta', hide: false },
    { def: 'Comisariato_C', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'Fecha_de_Solicitud', hide: false },
    { def: 'Confirmado_por_Correo', hide: false },
    { def: 'Confirmado_por_Telefono', hide: false },
    { def: 'Confirmado', hide: false },

  ];
  ServiciosData: Detalle_Coordinacion_Paxs_Servicios[] = [];
  @ViewChild('paginatorServicios') paginatorServicios: MatPaginator;
  isServiciosAdd: boolean = true;

  dataSourcePeriodico_y_Revistas = new MatTableDataSource<Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas>();
  Periodico_y_RevistasColumns = [
    { def: 'actions', hide: false },
    { def: 'Tipo_de_Medio', hide: false },
    { def: 'Medio', hide: false },
    { def: 'Otro', hide: false },
    { def: 'SC', hide: false },
    { def: 'Fecha', hide: false },
    { def: 'Confirmado', hide: false },

  ];
  Periodico_y_RevistasData: Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas[] = [];
  @ViewChild('paginatorPeriodico_y_Revistas') paginatorPeriodico_y_Revistas: MatPaginator;
  isPeriodico_y_RevistasAdd: boolean = true;

  dataSourceNormal = new MatTableDataSource<Detalle_Coord_Paxs_Comisariato_Normal>();
  NormalColumns = [
    { def: 'actions', hide: false },
    { def: 'Concepto', hide: false },
    { def: 'SC', hide: false },
    { def: 'Fecha', hide: false },
    { def: 'Confirmado', hide: false },
  ];
  NormalData: Detalle_Coord_Paxs_Comisariato_Normal[] = [];
  @ViewChild('paginatorNormal') paginatorNormal: MatPaginator;
  isNormalAdd: boolean = true;

  dataSourceInstalaciones = new MatTableDataSource<Detalle_Coord_Paxs_Comisariato_Instalaciones>();
  InstalacionesColumns = [
    { def: 'actions', hide: false },
    { def: 'Instalacion', hide: false },
    { def: 'Observaciones', hide: false },
    { def: 'No_Aplica', hide: false },
    { def: 'Confirmado', hide: false },
  ];
  InstalacionesData: Detalle_Coord_Paxs_Comisariato_Instalaciones[] = [];
  @ViewChild('paginatorInstalaciones') paginatorInstalaciones: MatPaginator;
  isInstalacionesAdd: boolean = true;

  dataSourceReservaciones = new MatTableDataSource<Detalle_Coord_Paxs_Reservaciones>();
  ReservacionesColumns = [
    { def: 'actions', hide: false },
    { def: 'Hospedaje', hide: false },
    { def: 'Nombre_del_Hotel', hide: false },
    { def: 'Especificaciones', hide: false },
    { def: 'Telefono', hide: false },
    { def: 'Numero_de_Confirmacion', hide: false },
    { def: 'Confirmado_por_Correo', hide: false },
    { def: 'Confirmado_por_Telefono', hide: false },
    { def: 'Confirmado', hide: false },

  ];
  ReservacionesData: Detalle_Coord_Paxs_Reservaciones[] = [];
  @ViewChild('paginatorReservaciones') paginatorReservaciones: MatPaginator;
  isReservacionesAdd: boolean = true;

  dataSourceTransportacion = new MatTableDataSource<Detalle_Coord_Paxs_Transportacion>();
  TransportacionColumns = [
    { def: 'actions', hide: false },
    { def: 'Transportacion', hide: false },
    { def: 'Especificaciones', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'Telefono', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Conductor_Piloto', hide: false },
    { def: 'Confirmado_por_Correo', hide: false },
    { def: 'Confirmado_por_Telefono', hide: false },
    { def: 'Confirmado', hide: false },

  ];
  TransportacionData: Detalle_Coord_Paxs_Transportacion[] = [];
  @ViewChild('paginatorTransportacion') paginatorTransportacion: MatPaginator;
  isTransportacionAdd: boolean = true;

  today = new Date;
  consult: boolean = false;
  SpartanOperationId: any
  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Coordinacion_PasajerosService: Coordinacion_PasajerosService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeronaveService: AeronaveService,
    private Detalle_Coordinacion_Paxs_ServiciosService: Detalle_Coordinacion_Paxs_ServiciosService,
    private PasajerosService: PasajerosService,
    private Estatus_de_ConfirmacionService: Estatus_de_ConfirmacionService,
    private Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasService: Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasService,
    private Tipo_de_Medio_de_ComunicacionService: Tipo_de_Medio_de_ComunicacionService,
    private Medio_de_ComunicacionService: Medio_de_ComunicacionService,
    private Detalle_Coord_Paxs_Comisariato_NormalService: Detalle_Coord_Paxs_Comisariato_NormalService,
    private Detalle_Coord_Paxs_Comisariato_InstalacionesService: Detalle_Coord_Paxs_Comisariato_InstalacionesService,
    private Tipo_de_InstalacionService: Tipo_de_InstalacionService,
    private Detalle_Coord_Paxs_ReservacionesService: Detalle_Coord_Paxs_ReservacionesService,
    private Tipo_de_HospedajeService: Tipo_de_HospedajeService,
    private Detalle_Coord_Paxs_TransportacionService: Detalle_Coord_Paxs_TransportacionService,
    private Tipo_de_TransportacionService: Tipo_de_TransportacionService,
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
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<ModalCoordinacionPasajerosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Coordinacion_Pasajeros(this.fb);
    this.Coordinacion_PasajerosForm = this.model.buildFormGroup();

    this.ServiciosItems.removeAt(0);
    this.Periodico_y_RevistasItems.removeAt(0);
    this.NormalItems.removeAt(0);
    this.InstalacionesItems.removeAt(0);
    this.ReservacionesItems.removeAt(0);
    this.TransportacionItems.removeAt(0);

    this.Coordinacion_PasajerosForm.get('Folio').disable();
    this.Coordinacion_PasajerosForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceServicios.paginator = this.paginatorServicios;
    this.dataSourcePeriodico_y_Revistas.paginator = this.paginatorPeriodico_y_Revistas;
    this.dataSourceNormal.paginator = this.paginatorNormal;
    this.dataSourceInstalaciones.paginator = this.paginatorInstalaciones;
    this.dataSourceReservaciones.paginator = this.paginatorReservaciones;
    this.dataSourceTransportacion.paginator = this.paginatorTransportacion;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Coordinacion_Pasajeros).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Coordinacion_PasajerosForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Coordinacion_PasajerosForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Coordinacion_PasajerosService.listaSelAll(0, 1, 'Coordinacion_Pasajeros.Folio=' + id).toPromise();
    if (result.Coordinacion_Pasajeross.length > 0) {

      await this.Detalle_Coordinacion_Paxs_ServiciosService.listaSelAll(0, 1000, 'Coordinacion_Pasajeros.Folio=' + id).toPromise().then((fServicios) => {
        this.ServiciosData = fServicios.Detalle_Coordinacion_Paxs_Servicioss;
        this.loadServicios(fServicios.Detalle_Coordinacion_Paxs_Servicioss);
        this.dataSourceServicios = new MatTableDataSource(fServicios.Detalle_Coordinacion_Paxs_Servicioss);
        this.dataSourceServicios.paginator = this.paginatorServicios;
        this.dataSourceServicios.sort = this.sort;
      });


      await this.Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasService.listaSelAll(0, 1000, 'Coordinacion_Pasajeros.Folio=' + id).toPromise().then((fPeriodico_y_Revistas) => {
        this.Periodico_y_RevistasData = fPeriodico_y_Revistas.Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistass;
        this.loadPeriodico_y_Revistas(fPeriodico_y_Revistas.Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistass);
        this.dataSourcePeriodico_y_Revistas = new MatTableDataSource(fPeriodico_y_Revistas.Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistass);
        this.dataSourcePeriodico_y_Revistas.paginator = this.paginatorPeriodico_y_Revistas;
        this.dataSourcePeriodico_y_Revistas.sort = this.sort;
      });

      await this.Detalle_Coord_Paxs_Comisariato_NormalService.listaSelAll(0, 1000, 'Coordinacion_Pasajeros.Folio=' + id).toPromise().then((fNormal) => {
        this.NormalData = fNormal.Detalle_Coord_Paxs_Comisariato_Normals;
        this.loadNormal(fNormal.Detalle_Coord_Paxs_Comisariato_Normals);
        this.dataSourceNormal = new MatTableDataSource(fNormal.Detalle_Coord_Paxs_Comisariato_Normals);
        this.dataSourceNormal.paginator = this.paginatorNormal;
        this.dataSourceNormal.sort = this.sort;
      });

      await this.Detalle_Coord_Paxs_Comisariato_InstalacionesService.listaSelAll(0, 1000, 'Coordinacion_Pasajeros.Folio=' + id).toPromise().then((fInstalaciones) => {
        this.InstalacionesData = fInstalaciones.Detalle_Coord_Paxs_Comisariato_Instalacioness;
        this.loadInstalaciones(fInstalaciones.Detalle_Coord_Paxs_Comisariato_Instalacioness);
        this.dataSourceInstalaciones = new MatTableDataSource(fInstalaciones.Detalle_Coord_Paxs_Comisariato_Instalacioness);
        this.dataSourceInstalaciones.paginator = this.paginatorInstalaciones;
        this.dataSourceInstalaciones.sort = this.sort;
      });

      await this.Detalle_Coord_Paxs_ReservacionesService.listaSelAll(0, 1000, 'Coordinacion_Pasajeros.Folio=' + id).toPromise().then((fReservaciones) => {
        this.ReservacionesData = fReservaciones.Detalle_Coord_Paxs_Reservacioness;
        this.loadReservaciones(fReservaciones.Detalle_Coord_Paxs_Reservacioness);
        this.dataSourceReservaciones = new MatTableDataSource(fReservaciones.Detalle_Coord_Paxs_Reservacioness);
        this.dataSourceReservaciones.paginator = this.paginatorReservaciones;
        this.dataSourceReservaciones.sort = this.sort;
      });;

      await this.Detalle_Coord_Paxs_TransportacionService.listaSelAll(0, 1000, 'Coordinacion_Pasajeros.Folio=' + id).toPromise().then((fTransportacion) => {
        this.TransportacionData = fTransportacion.Detalle_Coord_Paxs_Transportacions;
        this.loadTransportacion(fTransportacion.Detalle_Coord_Paxs_Transportacions);
        this.dataSourceTransportacion = new MatTableDataSource(fTransportacion.Detalle_Coord_Paxs_Transportacions);
        this.dataSourceTransportacion.paginator = this.paginatorTransportacion;
        this.dataSourceTransportacion.sort = this.sort;
      });;


      this.model.fromObject(result.Coordinacion_Pasajeross[0]);
      this.Coordinacion_PasajerosForm.get('Numero_de_Vuelo').setValue(
        result.Coordinacion_Pasajeross[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        { onlySelf: false, emitEvent: true }
      );
      this.Coordinacion_PasajerosForm.get('Matricula').setValue(
        result.Coordinacion_Pasajeross[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );

      this.Coordinacion_PasajerosForm.markAllAsTouched();
      this.Coordinacion_PasajerosForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { 
      this.spinner.hide('loading'); 
    }
  }

  //#region Servicios Items
  get ServiciosItems() {
    return this.Coordinacion_PasajerosForm.get('Detalle_Coordinacion_Paxs_ServiciosItems') as FormArray;
  }

  getServiciosColumns(): string[] {
    return this.ServiciosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadServicios(Servicios: Detalle_Coordinacion_Paxs_Servicios[]) {
    Servicios.forEach(element => {
      this.addServicios(element);
    });
  }

  addServiciosToMR() {

    const Servicios = new Detalle_Coordinacion_Paxs_Servicios(this.fb);
    this.ServiciosData.push(this.addServicios(Servicios));
    this.dataSourceServicios.data = this.ServiciosData;
    Servicios.edit = true;
    Servicios.isNew = true;
    const length = this.dataSourceServicios.data.length;
    const index = length - 1;
    const formServicios = this.ServiciosItems.controls[index] as FormGroup;
    this.addFilterToControlPasajero_Detalle_Coordinacion_Paxs_Servicios(formServicios.controls.Pasajero, index);

    const page = Math.ceil(this.dataSourceServicios.data.filter(d => !d.IsDeleted).length / this.paginatorServicios.pageSize);
    if (page !== this.paginatorServicios.pageIndex) {
      this.paginatorServicios.pageIndex = page;
    }
    formServicios.enable();
    this.isServiciosAdd = !this.isServiciosAdd
  }

  addServicios(entity: Detalle_Coordinacion_Paxs_Servicios) {
    const Servicios = new Detalle_Coordinacion_Paxs_Servicios(this.fb);
    this.ServiciosItems.push(Servicios.buildFormGroup());
    if (entity) {
      Servicios.fromObject(entity);
    }
    return entity;
  }

  ServiciosItemsByFolio(Folio: number): FormGroup {
    return (this.Coordinacion_PasajerosForm.get('Detalle_Coordinacion_Paxs_ServiciosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  ServiciosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceServicios.data.indexOf(element);
    let fb = this.ServiciosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteServicios(element: any) {
    let index = this.dataSourceServicios.data.indexOf(element);
    this.ServiciosData[index].IsDeleted = true;
    this.ServiciosData.splice(index, 1);
    this.dataSourceServicios.data = this.ServiciosData;
    this.dataSourceServicios._updateChangeSubscription();
    index = this.dataSourceServicios.data.filter(d => !d.IsDeleted).length;

    let fgr = this.Coordinacion_PasajerosForm.controls.Detalle_Coordinacion_Paxs_ServiciosItems as FormArray;
    fgr.removeAt(index);
    let sddch = this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios;
    sddch.splice(index, 1);
    
    const page = Math.ceil(index / this.paginatorServicios.pageSize);
    if (page !== this.paginatorServicios.pageIndex) {
      this.paginatorServicios.pageIndex = page;
    }
  }

  cancelEditServicios(element: any) {
    let index = this.dataSourceServicios.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.ServiciosData[index].IsDeleted = true;
      this.ServiciosData.splice(index, 1);
      this.dataSourceServicios.data = this.ServiciosData;
      this.dataSourceServicios._updateChangeSubscription();
      index = this.ServiciosData.filter(d => !d.IsDeleted).length;

      let fgr = this.Coordinacion_PasajerosForm.controls.Detalle_Coordinacion_Paxs_ServiciosItems as FormArray;
      fgr.removeAt(index);
      let sddch = this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios;
      sddch.splice(index, 1);

      const page = Math.ceil(index / this.paginatorServicios.pageSize);
      if (page !== this.paginatorServicios.pageIndex) {
        this.paginatorServicios.pageIndex = page;
      }
    }
    //const formServicios = this.ServiciosItems.controls[index] as FormGroup;
    //formServicios.disable();
    this.isServiciosAdd = !this.isServiciosAdd

  }

  async saveServicios(element: any) {
    const index = this.dataSourceServicios.data.indexOf(element);
    const formServicios = this.ServiciosItems.controls[index] as FormGroup;
    if (this.ServiciosData[index].Pasajero !== formServicios.value.Pasajero && formServicios.value.Pasajero > 0) {
      let pasajeros = await this.PasajerosService.getById(formServicios.value.Pasajero).toPromise();
      this.ServiciosData[index].Pasajero_Pasajeros = pasajeros;
    }
    this.ServiciosData[index].Pasajero = formServicios.value.Pasajero;
    this.ServiciosData[index].Ruta = formServicios.value.Ruta;
    this.ServiciosData[index].Comisariato_C = formServicios.value.Comisariato_C;
    this.ServiciosData[index].Proveedor = formServicios.value.Proveedor;
    this.ServiciosData[index].Fecha_de_Solicitud = formServicios.value.Fecha_de_Solicitud;
    this.ServiciosData[index].Confirmado_por_Correo = formServicios.value.Confirmado_por_Correo;
    this.ServiciosData[index].Confirmado_por_Telefono = formServicios.value.Confirmado_por_Telefono;
    this.ServiciosData[index].Confirmado = formServicios.value.Confirmado;
    this.ServiciosData[index].Confirmado_Estatus_de_Confirmacion = formServicios.value.Confirmado !== '' ?
      this.varEstatus_de_Confirmacion.filter(d => d.Clave === formServicios.value.Confirmado)[0] : null;

    this.ServiciosData[index].isNew = false;
    this.dataSourceServicios.data = this.ServiciosData;
    this.dataSourceServicios._updateChangeSubscription();
    this.isServiciosAdd = !this.isServiciosAdd

  }

  editServicios(element: any) {
    const index = this.dataSourceServicios.data.indexOf(element);
    const formServicios = this.ServiciosItems.controls[index] as FormGroup;
    this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios[index] = this.dataSourceServicios.data[index].Pasajero_Pasajeros.Nombre_completo;
    this.addFilterToControlPasajero_Detalle_Coordinacion_Paxs_Servicios(formServicios.controls.Pasajero, index);

    element.edit = true;
    this.isServiciosAdd = !this.isServiciosAdd
  }

  async saveDetalle_Coordinacion_Paxs_Servicios(Folio: number) {
    this.dataSourceServicios.data.forEach(async (d, index) => {
      const data = this.ServiciosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Coordinacion_Pasajeros = Folio;

      if (model.Folio > 0) {
        await this.Detalle_Coordinacion_Paxs_ServiciosService.delete(model.Folio).toPromise();
      }

      await this.Detalle_Coordinacion_Paxs_ServiciosService.insert(model).toPromise();

    });
  }

  ValidarSeleccionServiciosPasajero(element){
    const index = this.dataSourceServicios.data.indexOf(element);
    if(this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios[index] == undefined || this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios[index] == ""){
      this.ServiciosItems.controls[index].get('Pasajero').setValue("");
    }
  }

  public selectPasajero_Detalle_Coordinacion_Paxs_Servicios(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceServicios.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios[index] = event.option.viewValue;
    let fgr = this.Coordinacion_PasajerosForm.controls.Detalle_Coordinacion_Paxs_ServiciosItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Pasajero.setValue(event.option.value);
    this.displayFnPasajero_Detalle_Coordinacion_Paxs_Servicios(element);
  }

  displayFnPasajero_Detalle_Coordinacion_Paxs_Servicios(this, element) {
    const index = this.dataSourceServicios.data.indexOf(element);
    return this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios[index];
  }

  updateOptionPasajero_Detalle_Coordinacion_Paxs_Servicios(event, element: any) {
    const index = this.dataSourceServicios.data.indexOf(element);
    this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios[index] = event.source.viewValue;
  }

  private filterPasajeros(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.optionsPasajeros.filter(option => option.Description.toLowerCase().includes(filterValue));
  }

  getPasajeros() {
    let result = []

    result = this.brf.EvaluaQueryDictionary(`uspObtenerPasajerosVuelo ${this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')}`, 1, 'ABC123')

    this.optionsPasajeros = result
    this.optionsPasajerosFiltered = of(result);

    this.optionsPasajerosFiltered = this.Coordinacion_PasajerosForm.get('Pasajero').valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this.filterPasajeros(name as string) : this.optionsPasajeros.slice();
      }),
    );

  }

  _filterPasajero_Detalle_Coordinacion_Paxs_Servicios(filter: any): Observable<Pasajeros> {
    const where = filter !== '' ? "Pasajeros.Nombre_completo like '%" + filter + "%'" : '';
    return this.PasajerosService.listaSelAll(0, 20, where);
  }

  addFilterToControlPasajero_Detalle_Coordinacion_Paxs_Servicios(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingPasajero_Detalle_Coordinacion_Paxs_Servicios = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingPasajero_Detalle_Coordinacion_Paxs_Servicios = true;
        return this._filterPasajero_Detalle_Coordinacion_Paxs_Servicios(value || '');
      })
    ).subscribe(result => {
      this.varPasajeros = result.Pasajeross;
      this.isLoadingPasajero_Detalle_Coordinacion_Paxs_Servicios = false;
      this.searchPasajero_Detalle_Coordinacion_Paxs_ServiciosCompleted = true;
      this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios[index] = this.varPasajeros.length === 0 ? '' : this.SelectedPasajero_Detalle_Coordinacion_Paxs_Servicios[index];
    });
  }

  //#endregion

  //#region Periodico y Revistas Items

  get Periodico_y_RevistasItems() {
    return this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasItems') as FormArray;
  }

  getPeriodico_y_RevistasColumns(): string[] {
    return this.Periodico_y_RevistasColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPeriodico_y_Revistas(Periodico_y_Revistas: Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas[]) {
    Periodico_y_Revistas.forEach(element => {
      this.addPeriodico_y_Revistas(element);
    });
  }

  addPeriodico_y_RevistasToMR() {
    const Periodico_y_Revistas = new Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas(this.fb);
    this.Periodico_y_RevistasData.push(this.addPeriodico_y_Revistas(Periodico_y_Revistas));
    //this.dataSourcePeriodico_y_Revistas = new MatTableDataSource<any>(this.Periodico_y_RevistasData);

    this.dataSourcePeriodico_y_Revistas.data = this.Periodico_y_RevistasData;
    Periodico_y_Revistas.edit = true;
    Periodico_y_Revistas.isNew = true;
    const length = this.dataSourcePeriodico_y_Revistas.data.length;
    const index = length - 1;
    const formPeriodico_y_Revistas = this.Periodico_y_RevistasItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourcePeriodico_y_Revistas.data.filter(d => !d.IsDeleted).length / this.paginatorPeriodico_y_Revistas.pageSize);
    if (page !== this.paginatorPeriodico_y_Revistas.pageIndex) {
      this.paginatorPeriodico_y_Revistas.pageIndex = page;
    }
    formPeriodico_y_Revistas.enable();
    this.isPeriodico_y_RevistasAdd = !this.isPeriodico_y_RevistasAdd
  }

  addPeriodico_y_Revistas(entity: Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas) {
    const Periodico_y_Revistas = new Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas(this.fb);
    this.Periodico_y_RevistasItems.push(Periodico_y_Revistas.buildFormGroup());
    if (entity) {
      Periodico_y_Revistas.fromObject(entity);
    }
    return entity;
  }

  Periodico_y_RevistasItemsByFolio(Folio: number): FormGroup {
    return (this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Periodico_y_RevistasItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePeriodico_y_Revistas.data.indexOf(element);
    let fb = this.Periodico_y_RevistasItems.controls[index] as FormGroup;
    return fb;
  }

  deletePeriodico_y_Revistas(element: any) {
    let index = this.dataSourcePeriodico_y_Revistas.data.indexOf(element);
    this.Periodico_y_RevistasData[index].IsDeleted = true;
    this.dataSourcePeriodico_y_Revistas.data = this.Periodico_y_RevistasData;
    this.dataSourcePeriodico_y_Revistas._updateChangeSubscription();
    index = this.dataSourcePeriodico_y_Revistas.data.filter(d => !d.IsDeleted).length;

    
    
    const page = Math.ceil(index / this.paginatorPeriodico_y_Revistas.pageSize);
    if (page !== this.paginatorPeriodico_y_Revistas.pageIndex) {
      this.paginatorPeriodico_y_Revistas.pageIndex = page;
    }
  }

  cancelEditPeriodico_y_Revistas(element: any) {
    let index = this.dataSourcePeriodico_y_Revistas.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Periodico_y_RevistasData[index].IsDeleted = true;
      this.dataSourcePeriodico_y_Revistas.data = this.Periodico_y_RevistasData;
      this.dataSourcePeriodico_y_Revistas._updateChangeSubscription();
      index = this.Periodico_y_RevistasData.filter(d => !d.IsDeleted).length;
      
      let fgr = this.Coordinacion_PasajerosForm.controls.Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasItems as FormArray;
      fgr.removeAt(index);

      const page = Math.ceil(index / this.paginatorPeriodico_y_Revistas.pageSize);
      if (page !== this.paginatorPeriodico_y_Revistas.pageIndex) {
        this.paginatorPeriodico_y_Revistas.pageIndex = page;
      }
    }
    //const formPeriodico_y_Revistas = this.Periodico_y_RevistasItems.controls[index] as FormGroup;
    //formPeriodico_y_Revistas.disable()
    this.isPeriodico_y_RevistasAdd = !this.isPeriodico_y_RevistasAdd

  }

  async savePeriodico_y_Revistas(element: any) {
    const index = this.dataSourcePeriodico_y_Revistas.data.indexOf(element);
    const formPeriodico_y_Revistas = this.Periodico_y_RevistasItems.controls[index] as FormGroup;
    this.Periodico_y_RevistasData[index].Tipo_de_Medio = formPeriodico_y_Revistas.value.Tipo_de_Medio;
    this.Periodico_y_RevistasData[index].Tipo_de_Medio_Tipo_de_Medio_de_Comunicacion = formPeriodico_y_Revistas.value.Tipo_de_Medio !== '' ?
      this.varTipo_de_Medio_de_Comunicacion.filter(d => d.Clave === formPeriodico_y_Revistas.value.Tipo_de_Medio)[0] : null;
    this.Periodico_y_RevistasData[index].Medio = formPeriodico_y_Revistas.value.Medio;
    this.Periodico_y_RevistasData[index].Medio_Medio_de_Comunicacion = formPeriodico_y_Revistas.value.Medio !== '' ?
      this.varMedio_de_Comunicacion.filter(d => d.Clave === formPeriodico_y_Revistas.value.Medio)[0] : null;
    this.Periodico_y_RevistasData[index].Otro = formPeriodico_y_Revistas.value.Otro;
    this.Periodico_y_RevistasData[index].SC = formPeriodico_y_Revistas.value.SC;
    this.Periodico_y_RevistasData[index].Fecha = formPeriodico_y_Revistas.value.Fecha;
    this.Periodico_y_RevistasData[index].Confirmado = formPeriodico_y_Revistas.value.Confirmado;
    this.Periodico_y_RevistasData[index].Confirmado_Estatus_de_Confirmacion = formPeriodico_y_Revistas.value.Confirmado !== '' ?
      this.varEstatus_de_Confirmacion.filter(d => d.Clave === formPeriodico_y_Revistas.value.Confirmado)[0] : null;

    this.Periodico_y_RevistasData[index].isNew = false;
    this.dataSourcePeriodico_y_Revistas.data = this.Periodico_y_RevistasData;
    this.dataSourcePeriodico_y_Revistas._updateChangeSubscription();
    this.isPeriodico_y_RevistasAdd = !this.isPeriodico_y_RevistasAdd

  }

  editPeriodico_y_Revistas(element: any) {
    const index = this.dataSourcePeriodico_y_Revistas.data.indexOf(element);
    const formPeriodico_y_Revistas = this.Periodico_y_RevistasItems.controls[index] as FormGroup;

    element.edit = true;
    this.isPeriodico_y_RevistasAdd = !this.isPeriodico_y_RevistasAdd

  }

  async saveDetalle_Coord_Paxs_Comisariato_Periodico_y_Revistas(Folio: number) {
    this.dataSourcePeriodico_y_Revistas.data.forEach(async (d, index) => {
      const data = this.Periodico_y_RevistasItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Coordinacion_Pasajeros = Folio;


      if (model.Folio === 0 && !d.IsDeleted) {
        // Add Periódico y Revistas
        let response = await this.Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPeriodico_y_Revistas = this.Periodico_y_RevistasItemsByFolio(model.Folio);
        if (formPeriodico_y_Revistas.dirty) {
          // Update Periódico y Revistas
          let response = await this.Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Periódico y Revistas
        await this.Detalle_Coord_Paxs_Comisariato_Periodico_y_RevistasService.delete(model.Folio).toPromise();
      }
    });
  }
  //#endregion

  //#region Normal Items
  get NormalItems() {
    return this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_Comisariato_NormalItems') as FormArray;
  }

  getNormalColumns(): string[] {
    return this.NormalColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadNormal(Normal: Detalle_Coord_Paxs_Comisariato_Normal[]) {
    Normal.forEach(element => {
      this.addNormal(element);
    });
  }

  addNormalToMR() {
    const Normal = new Detalle_Coord_Paxs_Comisariato_Normal(this.fb);
    this.NormalData.push(this.addNormal(Normal));
    this.dataSourceNormal.data = this.NormalData;
    Normal.edit = true;
    Normal.isNew = true;
    const length = this.dataSourceNormal.data.length;
    const index = length - 1;
    const formNormal = this.NormalItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceNormal.data.filter(d => !d.IsDeleted).length / this.paginatorNormal.pageSize);
    if (page !== this.paginatorNormal.pageIndex) {
      this.paginatorNormal.pageIndex = page;
    }
    formNormal.enable()
    this.isNormalAdd = !this.isNormalAdd

  }

  addNormal(entity: Detalle_Coord_Paxs_Comisariato_Normal) {
    const Normal = new Detalle_Coord_Paxs_Comisariato_Normal(this.fb);
    this.NormalItems.push(Normal.buildFormGroup());
    if (entity) {
      Normal.fromObject(entity);
    }
    return entity;
  }

  NormalItemsByFolio(Folio: number): FormGroup {
    return (this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_Comisariato_NormalItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  NormalItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceNormal.data.indexOf(element);
    let fb = this.NormalItems.controls[index] as FormGroup;
    return fb;
  }

  deleteNormal(element: any) {
    let index = this.dataSourceNormal.data.indexOf(element);
    this.NormalData[index].IsDeleted = true;
    this.dataSourceNormal.data = this.NormalData;
    this.dataSourceNormal._updateChangeSubscription();
    index = this.dataSourceNormal.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorNormal.pageSize);
    if (page !== this.paginatorNormal.pageIndex) {
      this.paginatorNormal.pageIndex = page;
    }
  }

  cancelEditNormal(element: any) {
    let index = this.dataSourceNormal.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.NormalData[index].IsDeleted = true;
      this.dataSourceNormal.data = this.NormalData;
      this.dataSourceNormal._updateChangeSubscription();
      index = this.NormalData.filter(d => !d.IsDeleted).length;
      
      let fgr = this.Coordinacion_PasajerosForm.controls.Detalle_Coord_Paxs_Comisariato_NormalItems as FormArray;
      fgr.removeAt(index);
      
      const page = Math.ceil(index / this.paginatorNormal.pageSize);
      if (page !== this.paginatorNormal.pageIndex) {
        this.paginatorNormal.pageIndex = page;
      }
    }
    //const formNormal = this.NormalItems.controls[index] as FormGroup;
    //formNormal.disable();
    this.isNormalAdd = !this.isNormalAdd

  }

  async saveNormal(element: any) {
    const index = this.dataSourceNormal.data.indexOf(element);
    const formNormal = this.NormalItems.controls[index] as FormGroup;
    this.NormalData[index].Concepto = formNormal.value.Concepto;
    this.NormalData[index].SC = formNormal.value.SC;
    this.NormalData[index].Fecha = formNormal.value.Fecha;
    this.NormalData[index].Confirmado = formNormal.value.Confirmado;
    this.NormalData[index].Confirmado_Estatus_de_Confirmacion = formNormal.value.Confirmado !== '' ?
      this.varEstatus_de_Confirmacion.filter(d => d.Clave === formNormal.value.Confirmado)[0] : null;

    this.NormalData[index].isNew = false;
    this.dataSourceNormal.data = this.NormalData;
    this.dataSourceNormal._updateChangeSubscription();
    this.isNormalAdd = !this.isNormalAdd

  }

  editNormal(element: any) {
    const index = this.dataSourceNormal.data.indexOf(element);
    const formNormal = this.NormalItems.controls[index] as FormGroup;

    element.edit = true;
    this.isNormalAdd = !this.isNormalAdd

  }

  async saveDetalle_Coord_Paxs_Comisariato_Normal(Folio: number) {
    this.dataSourceNormal.data.forEach(async (d, index) => {
      const data = this.NormalItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Coordinacion_Pasajeros = Folio;


      if (model.Folio === 0 && !d.IsDeleted) {
        // Add COMISARIATO NORMAL
        let response = await this.Detalle_Coord_Paxs_Comisariato_NormalService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formNormal = this.NormalItemsByFolio(model.Folio);
        if (formNormal.dirty) {
          // Update COMISARIATO NORMAL
          let response = await this.Detalle_Coord_Paxs_Comisariato_NormalService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete COMISARIATO NORMAL
        await this.Detalle_Coord_Paxs_Comisariato_NormalService.delete(model.Folio).toPromise();
      }
    });
  }

  //#endregion

  //#region Instalaciones Items

  get InstalacionesItems() {
    return this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_Comisariato_InstalacionesItems') as FormArray;
  }

  getInstalacionesColumns(): string[] {
    return this.InstalacionesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadInstalaciones(Instalaciones: Detalle_Coord_Paxs_Comisariato_Instalaciones[]) {
    Instalaciones.forEach(element => {
      this.addInstalaciones(element);
    });
  }

  addInstalacionesToMR() {
    const Instalaciones = new Detalle_Coord_Paxs_Comisariato_Instalaciones(this.fb);
    this.InstalacionesData.push(this.addInstalaciones(Instalaciones));
    this.dataSourceInstalaciones.data = this.InstalacionesData;
    Instalaciones.edit = true;
    Instalaciones.isNew = true;
    const length = this.dataSourceInstalaciones.data.length;
    const index = length - 1;
    const formInstalaciones = this.InstalacionesItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceInstalaciones.data.filter(d => !d.IsDeleted).length / this.paginatorInstalaciones.pageSize);
    if (page !== this.paginatorInstalaciones.pageIndex) {
      this.paginatorInstalaciones.pageIndex = page;
    }
    formInstalaciones.enable();
    this.isInstalacionesAdd = !this.isInstalacionesAdd

  }

  addInstalaciones(entity: Detalle_Coord_Paxs_Comisariato_Instalaciones) {
    const Instalaciones = new Detalle_Coord_Paxs_Comisariato_Instalaciones(this.fb);
    this.InstalacionesItems.push(Instalaciones.buildFormGroup());
    if (entity) {
      Instalaciones.fromObject(entity);
    }
    return entity;
  }

  InstalacionesItemsByFolio(Folio: number): FormGroup {
    return (this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_Comisariato_InstalacionesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  InstalacionesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceInstalaciones.data.indexOf(element);
    let fb = this.InstalacionesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteInstalaciones(element: any) {
    let index = this.dataSourceInstalaciones.data.indexOf(element);
    this.InstalacionesData[index].IsDeleted = true;
    this.dataSourceInstalaciones.data = this.InstalacionesData;
    this.dataSourceInstalaciones._updateChangeSubscription();
    index = this.dataSourceInstalaciones.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorInstalaciones.pageSize);
    if (page !== this.paginatorInstalaciones.pageIndex) {
      this.paginatorInstalaciones.pageIndex = page;
    }
  }

  cancelEditInstalaciones(element: any) {
    let index = this.dataSourceInstalaciones.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.InstalacionesData[index].IsDeleted = true;
      this.dataSourceInstalaciones.data = this.InstalacionesData;
      this.dataSourceInstalaciones._updateChangeSubscription();
      index = this.InstalacionesData.filter(d => !d.IsDeleted).length;
      
      let fgr = this.Coordinacion_PasajerosForm.controls.Detalle_Coord_Paxs_Comisariato_InstalacionesItems as FormArray;
      fgr.removeAt(index);
      
      const page = Math.ceil(index / this.paginatorInstalaciones.pageSize);
      if (page !== this.paginatorInstalaciones.pageIndex) {
        this.paginatorInstalaciones.pageIndex = page;
      }
    }
    //const formInstalaciones = this.InstalacionesItems.controls[index] as FormGroup;
    //formInstalaciones.disable();
    this.isInstalacionesAdd = !this.isInstalacionesAdd

  }

  async saveInstalaciones(element: any) {
    const index = this.dataSourceInstalaciones.data.indexOf(element);
    const formInstalaciones = this.InstalacionesItems.controls[index] as FormGroup;
    this.InstalacionesData[index].Instalacion = formInstalaciones.value.Instalacion;
    this.InstalacionesData[index].Instalacion_Tipo_de_Instalacion = formInstalaciones.value.Instalacion !== '' ?
      this.varTipo_de_Instalacion.filter(d => d.Clave === formInstalaciones.value.Instalacion)[0] : null;
    this.InstalacionesData[index].Observaciones = formInstalaciones.value.Observaciones;
    this.InstalacionesData[index].No_Aplica = formInstalaciones.value.No_Aplica;
    this.InstalacionesData[index].Confirmado = formInstalaciones.value.Confirmado;
    this.InstalacionesData[index].Confirmado_Estatus_de_Confirmacion = formInstalaciones.value.Confirmado !== '' ?
      this.varEstatus_de_Confirmacion.filter(d => d.Clave === formInstalaciones.value.Confirmado)[0] : null;

    this.InstalacionesData[index].isNew = false;
    this.dataSourceInstalaciones.data = this.InstalacionesData;
    this.dataSourceInstalaciones._updateChangeSubscription();
    this.isInstalacionesAdd = !this.isInstalacionesAdd

  }

  editInstalaciones(element: any) {
    const index = this.dataSourceInstalaciones.data.indexOf(element);
    const formInstalaciones = this.InstalacionesItems.controls[index] as FormGroup;

    element.edit = true;
    this.isInstalacionesAdd = !this.isInstalacionesAdd

  }

  async saveDetalle_Coord_Paxs_Comisariato_Instalaciones(Folio: number) {
    this.dataSourceInstalaciones.data.forEach(async (d, index) => {
      const data = this.InstalacionesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Coordinacion_Pasajeros = Folio;


      if (model.Folio === 0 && !d.IsDeleted) {
        // Add Instalaciones
        let response = await this.Detalle_Coord_Paxs_Comisariato_InstalacionesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formInstalaciones = this.InstalacionesItemsByFolio(model.Folio);
        if (formInstalaciones.dirty) {
          // Update Instalaciones
          let response = await this.Detalle_Coord_Paxs_Comisariato_InstalacionesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Instalaciones
        await this.Detalle_Coord_Paxs_Comisariato_InstalacionesService.delete(model.Folio).toPromise();
      }
    });
  }

  //#endregion

  //#region Reservaciones Items

  get ReservacionesItems() {
    return this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_ReservacionesItems') as FormArray;
  }

  getReservacionesColumns(): string[] {
    return this.ReservacionesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadReservaciones(Reservaciones: Detalle_Coord_Paxs_Reservaciones[]) {
    Reservaciones.forEach(element => {
      this.addReservaciones(element);
    });
  }

  addReservacionesToMR() {
    const Reservaciones = new Detalle_Coord_Paxs_Reservaciones(this.fb);
    this.ReservacionesData.push(this.addReservaciones(Reservaciones));
    this.dataSourceReservaciones.data = this.ReservacionesData;
    Reservaciones.edit = true;
    Reservaciones.isNew = true;
    const length = this.dataSourceReservaciones.data.length;
    const index = length - 1;
    const formReservaciones = this.ReservacionesItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceReservaciones.data.filter(d => !d.IsDeleted).length / this.paginatorReservaciones.pageSize);
    if (page !== this.paginatorReservaciones.pageIndex) {
      this.paginatorReservaciones.pageIndex = page;
    }
    formReservaciones.enable();
    this.isReservacionesAdd = !this.isReservacionesAdd
  }

  addReservaciones(entity: Detalle_Coord_Paxs_Reservaciones) {
    const Reservaciones = new Detalle_Coord_Paxs_Reservaciones(this.fb);
    this.ReservacionesItems.push(Reservaciones.buildFormGroup());
    if (entity) {
      Reservaciones.fromObject(entity);
    }
    return entity;
  }

  ReservacionesItemsByFolio(Folio: number): FormGroup {
    return (this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_ReservacionesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  ReservacionesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceReservaciones.data.indexOf(element);
    let fb = this.ReservacionesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteReservaciones(element: any) {
    let index = this.dataSourceReservaciones.data.indexOf(element);
    this.ReservacionesData[index].IsDeleted = true;
    this.dataSourceReservaciones.data = this.ReservacionesData;
    this.dataSourceReservaciones._updateChangeSubscription();
    index = this.dataSourceReservaciones.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorReservaciones.pageSize);
    if (page !== this.paginatorReservaciones.pageIndex) {
      this.paginatorReservaciones.pageIndex = page;
    }
  }

  cancelEditReservaciones(element: any) {
    let index = this.dataSourceReservaciones.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.ReservacionesData[index].IsDeleted = true;
      this.dataSourceReservaciones.data = this.ReservacionesData;
      this.dataSourceReservaciones._updateChangeSubscription();
      index = this.ReservacionesData.filter(d => !d.IsDeleted).length;
      
      let fgr = this.Coordinacion_PasajerosForm.controls.Detalle_Coord_Paxs_ReservacionesItems as FormArray;
      fgr.removeAt(index);
      
      const page = Math.ceil(index / this.paginatorReservaciones.pageSize);
      if (page !== this.paginatorReservaciones.pageIndex) {
        this.paginatorReservaciones.pageIndex = page;
      }
    }
    //const formReservaciones = this.ReservacionesItems.controls[index] as FormGroup;
    //formReservaciones.disable()
    this.isReservacionesAdd = !this.isReservacionesAdd

  }

  async saveReservaciones(element: any) {
    const index = this.dataSourceReservaciones.data.indexOf(element);
    const formReservaciones = this.ReservacionesItems.controls[index] as FormGroup;
    this.ReservacionesData[index].Hospedaje = formReservaciones.value.Hospedaje;
    this.ReservacionesData[index].Hospedaje_Tipo_de_Hospedaje = formReservaciones.value.Hospedaje !== '' ?
      this.varTipo_de_Hospedaje.filter(d => d.Clave === formReservaciones.value.Hospedaje)[0] : null;
    this.ReservacionesData[index].Nombre_del_Hotel = formReservaciones.value.Nombre_del_Hotel;
    this.ReservacionesData[index].Especificaciones = formReservaciones.value.Especificaciones;
    this.ReservacionesData[index].Telefono = formReservaciones.value.Telefono;
    this.ReservacionesData[index].Numero_de_Confirmacion = formReservaciones.value.Numero_de_Confirmacion;
    this.ReservacionesData[index].Confirmado_por_Correo = formReservaciones.value.Confirmado_por_Correo;
    this.ReservacionesData[index].Confirmado_por_Telefono = formReservaciones.value.Confirmado_por_Telefono;
    this.ReservacionesData[index].Confirmado = formReservaciones.value.Confirmado;
    this.ReservacionesData[index].Confirmado_Estatus_de_Confirmacion = formReservaciones.value.Confirmado !== '' ?
      this.varEstatus_de_Confirmacion.filter(d => d.Clave === formReservaciones.value.Confirmado)[0] : null;

    this.ReservacionesData[index].isNew = false;
    this.dataSourceReservaciones.data = this.ReservacionesData;
    this.dataSourceReservaciones._updateChangeSubscription();
    this.isReservacionesAdd = !this.isReservacionesAdd

  }

  editReservaciones(element: any) {
    const index = this.dataSourceReservaciones.data.indexOf(element);
    const formReservaciones = this.ReservacionesItems.controls[index] as FormGroup;

    element.edit = true;
    this.isReservacionesAdd = !this.isReservacionesAdd

  }

  async saveDetalle_Coord_Paxs_Reservaciones(Folio: number) {
    this.dataSourceReservaciones.data.forEach(async (d, index) => {
      const data = this.ReservacionesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Coordinacion_Pasajeros = Folio;


      if (model.Folio === 0) {
        // Add Reservaciones
        let response = await this.Detalle_Coord_Paxs_ReservacionesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formReservaciones = this.ReservacionesItemsByFolio(model.Folio);
        if (formReservaciones.dirty) {
          // Update Reservaciones
          let response = await this.Detalle_Coord_Paxs_ReservacionesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Reservaciones
        await this.Detalle_Coord_Paxs_ReservacionesService.delete(model.Folio).toPromise();
      }
    });
  }

  //#endregion

  //#region Transportacion Items

  get TransportacionItems() {
    return this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_TransportacionItems') as FormArray;
  }

  getTransportacionColumns(): string[] {
    return this.TransportacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadTransportacion(Transportacion: Detalle_Coord_Paxs_Transportacion[]) {
    Transportacion.forEach(element => {
      this.addTransportacion(element);
    });
  }

  addTransportacionToMR() {
    const Transportacion = new Detalle_Coord_Paxs_Transportacion(this.fb);
    this.TransportacionData.push(this.addTransportacion(Transportacion));
    this.dataSourceTransportacion.data = this.TransportacionData;
    Transportacion.edit = true;
    Transportacion.isNew = true;
    const length = this.dataSourceTransportacion.data.length;
    const index = length - 1;
    const formTransportacion = this.TransportacionItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceTransportacion.data.filter(d => !d.IsDeleted).length / this.paginatorTransportacion.pageSize);
    if (page !== this.paginatorTransportacion.pageIndex) {
      this.paginatorTransportacion.pageIndex = page;
    }
    formTransportacion.enable();
    this.isTransportacionAdd = !this.isTransportacionAdd

  }

  addTransportacion(entity: Detalle_Coord_Paxs_Transportacion) {
    const Transportacion = new Detalle_Coord_Paxs_Transportacion(this.fb);
    this.TransportacionItems.push(Transportacion.buildFormGroup());
    if (entity) {
      Transportacion.fromObject(entity);
    }
    return entity;
  }

  TransportacionItemsByFolio(Folio: number): FormGroup {
    return (this.Coordinacion_PasajerosForm.get('Detalle_Coord_Paxs_TransportacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  TransportacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceTransportacion.data.indexOf(element);
    let fb = this.TransportacionItems.controls[index] as FormGroup;
    return fb;
  }

  deleteTransportacion(element: any) {
    let index = this.dataSourceTransportacion.data.indexOf(element);
    this.TransportacionData[index].IsDeleted = true;
    this.dataSourceTransportacion.data = this.TransportacionData;
    this.dataSourceTransportacion._updateChangeSubscription();
    index = this.dataSourceTransportacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorTransportacion.pageSize);
    if (page !== this.paginatorTransportacion.pageIndex) {
      this.paginatorTransportacion.pageIndex = page;
    }
  }

  cancelEditTransportacion(element: any) {
    let index = this.dataSourceTransportacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.TransportacionData[index].IsDeleted = true;
      this.dataSourceTransportacion.data = this.TransportacionData;
      this.dataSourceTransportacion._updateChangeSubscription();
      index = this.TransportacionData.filter(d => !d.IsDeleted).length;
      
      let fgr = this.Coordinacion_PasajerosForm.controls.Detalle_Coord_Paxs_TransportacionItems as FormArray;
      fgr.removeAt(index);
      
      const page = Math.ceil(index / this.paginatorTransportacion.pageSize);
      if (page !== this.paginatorTransportacion.pageIndex) {
        this.paginatorTransportacion.pageIndex = page;
      }
    }
    //const formTransportacion = this.TransportacionItems.controls[index] as FormGroup;
    //formTransportacion.disable();
    this.isTransportacionAdd = !this.isTransportacionAdd
  }

  async saveTransportacion(element: any) {
    const index = this.dataSourceTransportacion.data.indexOf(element);
    const formTransportacion = this.TransportacionItems.controls[index] as FormGroup;
    this.TransportacionData[index].Transportacion = formTransportacion.value.Transportacion;
    this.TransportacionData[index].Transportacion_Tipo_de_Transportacion = formTransportacion.value.Transportacion !== '' ?
      this.varTipo_de_Transportacion.filter(d => d.Clave === formTransportacion.value.Transportacion)[0] : null;
    this.TransportacionData[index].Especificaciones = formTransportacion.value.Especificaciones;
    this.TransportacionData[index].Proveedor = formTransportacion.value.Proveedor;
    this.TransportacionData[index].Telefono = formTransportacion.value.Telefono;
    this.TransportacionData[index].Matricula = formTransportacion.value.Matricula;
    this.TransportacionData[index].Conductor_Piloto = formTransportacion.value.Conductor_Piloto;
    this.TransportacionData[index].Confirmado_por_Correo = formTransportacion.value.Confirmado_por_Correo;
    this.TransportacionData[index].Confirmado_por_Telefono = formTransportacion.value.Confirmado_por_Telefono;
    this.TransportacionData[index].Confirmado = formTransportacion.value.Confirmado;
    this.TransportacionData[index].Confirmado_Estatus_de_Confirmacion = formTransportacion.value.Confirmado !== '' ?
      this.varEstatus_de_Confirmacion.filter(d => d.Clave === formTransportacion.value.Confirmado)[0] : null;

    this.TransportacionData[index].isNew = false;
    this.dataSourceTransportacion.data = this.TransportacionData;
    this.dataSourceTransportacion._updateChangeSubscription();
    this.isTransportacionAdd = !this.isTransportacionAdd

  }

  editTransportacion(element: any) {
    const index = this.dataSourceTransportacion.data.indexOf(element);
    const formTransportacion = this.TransportacionItems.controls[index] as FormGroup;

    element.edit = true;
    this.isTransportacionAdd = !this.isTransportacionAdd

  }

  async saveDetalle_Coord_Paxs_Transportacion(Folio: number) {
    this.dataSourceTransportacion.data.forEach(async (d, index) => {
      const data = this.TransportacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Coordinacion_Pasajeros = Folio;

      if (model.Folio === 0) {
        // Add Transportación
        let response = await this.Detalle_Coord_Paxs_TransportacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formTransportacion = this.TransportacionItemsByFolio(model.Folio);
        if (formTransportacion.dirty) {
          // Update Transportación
          let response = await this.Detalle_Coord_Paxs_TransportacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Transportación
        await this.Detalle_Coord_Paxs_TransportacionService.delete(model.Folio).toPromise();
      }
    });
  }
  //#endregion

  getParamsFromUrl() {
    this.operation = this.data.operation
    this.SpartanOperationId = this.data.SpartanOperationId;

    if (this.operation == "Update" || this.operation == "Consult") {
      this.model.Folio = this.data?.Id
      this.populateModel(this.model.Folio);
    }

    if (this.operation == "Consult") {
      this.ServiciosColumns.splice(0, 1);
      this.Periodico_y_RevistasColumns.splice(0, 1);
      this.NormalColumns.splice(0, 1);
      this.InstalacionesColumns.splice(0, 1);
      this.ReservacionesColumns.splice(0, 1);
      this.TransportacionColumns.splice(0, 1);

      this.Coordinacion_PasajerosForm.disable();
      this.operation = "Consult";
    }

    this.rulesOnInit();
  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Estatus_de_ConfirmacionService.getAll());
    observablesArray.push(this.Tipo_de_Medio_de_ComunicacionService.getAll());
    observablesArray.push(this.Medio_de_ComunicacionService.getAll());
    observablesArray.push(this.Tipo_de_InstalacionService.getAll());
    observablesArray.push(this.Tipo_de_HospedajeService.getAll());
    observablesArray.push(this.Tipo_de_TransportacionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varEstatus_de_Confirmacion, varTipo_de_Medio_de_Comunicacion, varMedio_de_Comunicacion, varTipo_de_Instalacion, varTipo_de_Hospedaje, varTipo_de_Transportacion]) => {
          this.varEstatus_de_Confirmacion = varEstatus_de_Confirmacion;
          this.varTipo_de_Medio_de_Comunicacion = varTipo_de_Medio_de_Comunicacion;
          this.varMedio_de_Comunicacion = varMedio_de_Comunicacion;
          this.varTipo_de_Instalacion = varTipo_de_Instalacion;
          this.varTipo_de_Hospedaje = varTipo_de_Hospedaje;
          this.varTipo_de_Transportacion = varTipo_de_Transportacion;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Coordinacion_PasajerosForm.get('Numero_de_Vuelo').valueChanges.pipe(
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
      this.Coordinacion_PasajerosForm.get('Numero_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
      this.optionsNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = false;
      this.optionsNumero_de_Vuelo = of([]);
    });

    this.Coordinacion_PasajerosForm.get('Matricula').valueChanges.pipe(
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
      this.Coordinacion_PasajerosForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
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
      case 'Tipo_de_Medio': {
        this.Tipo_de_Medio_de_ComunicacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Medio_de_Comunicacion = x.Tipo_de_Medio_de_Comunicacions;
        });
        break;
      }
      case 'Medio': {
        this.Medio_de_ComunicacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varMedio_de_Comunicacion = x.Medio_de_Comunicacions;
        });
        break;
      }
      case 'Instalacion': {
        this.Tipo_de_InstalacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Instalacion = x.Tipo_de_Instalacions;
        });
        break;
      }
      case 'Hospedaje': {
        this.Tipo_de_HospedajeService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Hospedaje = x.Tipo_de_Hospedajes;
        });
        break;
      }
      case 'Transportacion': {
        this.Tipo_de_TransportacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Transportacion = x.Tipo_de_Transportacions;
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

  closeWindowCancel(): void {
    window.close();
  }

  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Coordinacion_PasajerosForm.value;
      entity.Folio = this.model.Folio;
      entity.Numero_de_Vuelo = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');
      entity.Matricula = this.Coordinacion_PasajerosForm.get('Matricula').value.Matricula;
      entity.Ruta_de_Vuelo = this.Coordinacion_PasajerosForm.controls.Ruta_de_Vuelo.value;
      entity.Fecha_y_Hora_de_Salida = this.Coordinacion_PasajerosForm.controls.Fecha_y_Hora_de_Salida.value;
      entity.Calificacion = this.Coordinacion_PasajerosForm.controls.Calificacion.value;

      if (this.model.Folio > 0) {
        await this.Coordinacion_PasajerosService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Coordinacion_Paxs_Servicios(this.model.Folio);
        await this.saveDetalle_Coord_Paxs_Comisariato_Periodico_y_Revistas(this.model.Folio);
        await this.saveDetalle_Coord_Paxs_Comisariato_Normal(this.model.Folio);
        await this.saveDetalle_Coord_Paxs_Comisariato_Instalaciones(this.model.Folio);
        await this.saveDetalle_Coord_Paxs_Reservaciones(this.model.Folio);
        await this.saveDetalle_Coord_Paxs_Transportacion(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());

        this.rulesAfterSave();
      } else {
        await (this.Coordinacion_PasajerosService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Coordinacion_Paxs_Servicios(id);
          await this.saveDetalle_Coord_Paxs_Comisariato_Periodico_y_Revistas(id);
          await this.saveDetalle_Coord_Paxs_Comisariato_Normal(id);
          await this.saveDetalle_Coord_Paxs_Comisariato_Instalaciones(id);
          await this.saveDetalle_Coord_Paxs_Reservaciones(id);
          await this.saveDetalle_Coord_Paxs_Transportacion(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());

          this.rulesAfterSave();
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
    if (this.model.Folio === 0) {
      this.Coordinacion_PasajerosForm.reset();
      this.model = new Coordinacion_Pasajeros(this.fb);
      this.Coordinacion_PasajerosForm = this.model.buildFormGroup();
      this.dataSourceServicios = new MatTableDataSource<Detalle_Coordinacion_Paxs_Servicios>();
      this.ServiciosData = [];
      this.dataSourcePeriodico_y_Revistas = new MatTableDataSource<Detalle_Coord_Paxs_Comisariato_Periodico_y_Revistas>();
      this.Periodico_y_RevistasData = [];
      this.dataSourceNormal = new MatTableDataSource<Detalle_Coord_Paxs_Comisariato_Normal>();
      this.NormalData = [];
      this.dataSourceInstalaciones = new MatTableDataSource<Detalle_Coord_Paxs_Comisariato_Instalaciones>();
      this.InstalacionesData = [];
      this.dataSourceReservaciones = new MatTableDataSource<Detalle_Coord_Paxs_Reservaciones>();
      this.ReservacionesData = [];
      this.dataSourceTransportacion = new MatTableDataSource<Detalle_Coord_Paxs_Transportacion>();
      this.TransportacionData = [];

    } else {
      this.router.navigate(['views/Coordinacion_Pasajeros/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;
  }

  cancel() {
    if (this.localStorageHelper.getItemFromLocalStorage("Coordinacion_PasajerosWindowsFloat") == "1") {
      this.localStorageHelper.setItemToLocalStorage("Coordinacion_PasajerosWindowsFloat", "0");
      window.close();
    }
    else {
      this.goToList();
    }
  }

  goToList() {
    this.router.navigate(['/Coordinacion_Pasajeros/list'], { state: { data: this.dataListConfig } });
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
  Notas_C_ExecuteBusinessRules(): void {
    //Notas_C_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:1890 - En nuevo ocultar campo numero de vuelo, matricula, ruta de vuelo, fecha y hora de salida, calificación - Autor: Neftali - Actualización: 3/25/2021 4:55:24 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetNotRequiredControl(this.Coordinacion_PasajerosForm, "Numero_de_Vuelo");
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Numero_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Ruta_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Fecha_y_Hora_de_Salida', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Calificacion', 0);
      this.brf.SetNotRequiredControl(this.Coordinacion_PasajerosForm, "Observaciones");
    }
    //TERMINA - BRID:1890


    //INICIA - BRID:2619 - Ocultar Folio siempre - Autor: Lizeth Villa - Actualización: 4/7/2021 10:11:16 AM
    this.brf.HideFieldOfForm(this.Coordinacion_PasajerosForm, "Folio");
    this.brf.SetNotRequiredControl(this.Coordinacion_PasajerosForm, "Folio");
    //TERMINA - BRID:2619


    //INICIA - BRID:2791 - Asignar no requerido a campo nota - Autor: Felipe Rodríguez - Actualización: 5/3/2021 4:28:06 PM
    this.brf.SetNotRequiredControl(this.Coordinacion_PasajerosForm, "Notas_C");
    //TERMINA - BRID:2791


    //INICIA - BRID:2829 - si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje con codigo manual, no desactivar - Autor: Lizeth Villa - Actualización: 4/27/2021 7:58:47 PM
    if (this.brf.EvaluaQuery("SELECT COUNT(*) from Solicitud_de_Vuelo where folio = " + this.Coordinacion_PasajerosForm.get(StorageKeys.KeyValueInserted) + " and estatus = 9	", 1, 'ABC123') == 1 && this.brf.EvaluaQuery("if ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 1 or " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 9 ) begin select 1 end	", 1, 'ABC123') != 1) {
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Numero_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Ruta_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Coordinacion_Pasajeros', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Tipo_de_Medio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Medio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Otro', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'SC', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Fecha', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Coordinacion_Pasajeros', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Concepto', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'SC', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Fecha', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Coordinacion_Pasajeros', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Instalacion', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Observaciones', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'No_Aplica', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Coordinacion_Pasajeros', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Hospedaje', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Nombre_del_Hotel', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Especificaciones', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Telefono', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Numero_de_Confirmacion', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado_por_Correo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado_por_Telefono', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Coordinacion_Pasajeros', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Transportacion', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Especificaciones', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Proveedor', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Telefono', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Conductor_Piloto', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado_por_Correo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado_por_Telefono', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Fecha_y_Hora_de_Salida', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Calificacion', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Observaciones', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Notas', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Coordinacion_Pasajeros', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Pasajero', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Ruta', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Comisariato', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Proveedor', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Fecha_de_Solicitud', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado_por_Correo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado_por_Telefono', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Confirmado', 0);
      this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Folio', 0);
      this.brf.ShowMessage(" El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar");
    }
    //TERMINA - BRID:2829


    //INICIA - BRID:5681 - En editar, Habilitar campos si el vuelo esta reabierto - Autor: Lizeth Villa - Actualización: 9/3/2021 5:16:44 PM
    if (this.operation == 'Update') {
      if (+this.brf.EvaluaQuery("if ( ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 9) or  ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 12)) begin select 1 end", 1, 'ABC123') == 1 && +this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = " + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted) + " ", 1, 'ABC123') == 1) {
        this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Matricula', 1);
        this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Ruta_de_Vuelo', 1);
        this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Fecha_y_Hora_de_Salida', 1);
        this.brf.SetEnabledControl(this.Coordinacion_PasajerosForm, 'Calificacion', 1);
      }
    }
    //TERMINA - BRID:5681

    //rulesOnInit_ExecuteBusinessRulesEnd

    this.getPasajeros();

  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    let SpartanOperationId = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')
    let KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)

    //INICIA - BRID:1889 - En nuevo, después de guardar, asignar numero de vuelo - Autor: Lizeth Villa - Actualización: 3/22/2021 5:18:51 PM
    if (this.operation == 'New') {
      await this.brf.EvaluaQueryAsync(" update Coordinacion_Pasajeros set Numero_de_Vuelo= " + SpartanOperationId + " where Folio=" + KeyValueInserted + "", 1, "ABC123");
    }
    //TERMINA - BRID:1889


    //INICIA - BRID:2633 - al dar de alta o modificar, después de guardar ejecutar el SP: exec uspAsignaCalificacionCoordinacion "+this. Coordinacion_PasajerosForm.get(StorageKeys.KeyValueInserted)+",3 esto es para asignar la calificación. - Autor: Felipe Rodríguez - Actualización: 4/7/2021 4:43:31 PM
    this._SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + ",3", 1, "ABC123");
    //TERMINA - BRID:2633

    setTimeout(() => { 

      this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
      
      //rulesAfterSave_ExecuteBusinessRulesEnd
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
      this.isLoading = false;
      this.spinner.hide('loading');
      this.fnCloseModal(1)
    
    }, 5000);
  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas

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


}
