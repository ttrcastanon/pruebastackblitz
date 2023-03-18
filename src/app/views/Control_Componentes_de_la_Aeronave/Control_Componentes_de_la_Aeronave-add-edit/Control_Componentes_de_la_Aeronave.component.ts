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
import { off } from 'process';
import * as ts from 'typescript';

import { GeneralService } from 'src/app/api-services/general.service';
import { Control_Componentes_de_la_AeronaveService } from 'src/app/api-services/Control_Componentes_de_la_Aeronave.service';
import { Control_Componentes_de_la_Aeronave } from 'src/app/models/Control_Componentes_de_la_Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Detalle_Parte_Asociada_al_Componente_AeronaveService } from 'src/app/api-services/Detalle_Parte_Asociada_al_Componente_Aeronave.service';
import { Detalle_Parte_Asociada_al_Componente_Aeronave } from 'src/app/models/Detalle_Parte_Asociada_al_Componente_Aeronave';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { Tipos_de_Origen_del_ComponenteService } from 'src/app/api-services/Tipos_de_Origen_del_Componente.service';
import { Tipos_de_Origen_del_Componente } from 'src/app/models/Tipos_de_Origen_del_Componente';


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
  selector: 'app-Control_Componentes_de_la_Aeronave',
  templateUrl: './Control_Componentes_de_la_Aeronave.component.html',
  styleUrls: ['./Control_Componentes_de_la_Aeronave.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Control_Componentes_de_la_AeronaveComponent implements OnInit, AfterViewInit {
MRaddN_Parte_asociado_al_componente: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Control_Componentes_de_la_AeronaveForm: FormGroup;
  public Editor = ClassicEditor;
  model: Control_Componentes_de_la_Aeronave;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  optionsModelo: Observable<Modelos[]>;
  hasOptionsModelo: boolean;
  isLoadingModelo: boolean;
  optionsN_serie: Observable<Aeronave[]>;
  hasOptionsN_serie: boolean;
  isLoadingN_serie: boolean;
  public varPropietarios: Propietarios[] = [];
  optionsUsuario_que_actualizo: Observable<Spartan_User[]>;
  hasOptionsUsuario_que_actualizo: boolean;
  isLoadingUsuario_que_actualizo: boolean;
  public varCodigo_Computarizado: Codigo_Computarizado[] = [];
  public varCatalogo_codigo_ATA: Catalogo_codigo_ATA[] = [];
  public varTipos_de_Origen_del_Componente: Tipos_de_Origen_del_Componente[] = [];

  autoCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave = new FormControl();
  SelectedCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave: string[] = [];
  isLoadingCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave: boolean;
  searchCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_AeronaveCompleted: boolean;
  autoCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave = new FormControl();
  SelectedCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave: string[] = [];
  isLoadingCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave: boolean;
  searchCodigo_ATA_Detalle_Parte_Asociada_al_Componente_AeronaveCompleted: boolean;


  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceN_Parte_asociado_al_componente = new MatTableDataSource<Detalle_Parte_Asociada_al_Componente_Aeronave>();
  N_Parte_asociado_al_componenteColumns = [
    { def: 'actions', hide: false },
    { def: 'Codigo_Computarizado', hide: false },
    { def: 'Codigo_ATA', hide: false },
    { def: 'N_Parte', hide: false },
    { def: 'Descripcion_de_la_parte', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Origen_del_componente', hide: false },
    { def: 'N_de_Serie', hide: false },
    { def: 'Posicion_de_la_pieza', hide: false },
    { def: 'Fecha_de_fabricacion', hide: false },
    { def: 'Fecha_de_instalacion', hide: false },
    { def: 'Fecha_de_reparacion', hide: false },
    { def: 'Horas_acumuladas_parte', hide: false },
    { def: 'Dias_acumulados_parte', hide: false },
    { def: 'Ciclos_acumulados_parte', hide: false },
    { def: 'Horas_acumuladas_aeronave', hide: false },
    { def: 'Ciclos_acumulados_aeronave', hide: false },
    { def: 'Limite_de_meses', hide: false },
    { def: 'Limite_de_horas', hide: false },
    { def: 'Limite_de_ciclos', hide: false },
    { def: 'N_OT', hide: false },
    // { def: 'N_Reporte', hide: true },
    // { def: 'HorasInicialesAeronave', hide: true },
    // { def: 'CiclosInicialesAeronave', hide: true },
    // { def: 'LimitesEnDias', hide: true },
    // { def: 'DiasTranscurridos', hide: true },
    // { def: 'DiasFaltantes', hide: true },
    // { def: 'HorasFaltantes', hide: true },
    { def: 'CiclosFaltantes', hide: false },
    { def: 'Estatus', hide: false },

  ];
  N_Parte_asociado_al_componenteData: Detalle_Parte_Asociada_al_Componente_Aeronave[] = [];

  today = new Date;
  consult: boolean = false;

  MatriculaSeleccion: any = null;
  ModeloSeleccion: any = null;
  NoSerieSeleccion: any = null;
  UsuarioSeleccion: any = null;
  ButtonSaveMRComponentes: boolean = true;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Control_Componentes_de_la_AeronaveService: Control_Componentes_de_la_AeronaveService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private PropietariosService: PropietariosService,
    private Spartan_UserService: Spartan_UserService,
    private Detalle_Parte_Asociada_al_Componente_AeronaveService: Detalle_Parte_Asociada_al_Componente_AeronaveService,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,
    private Catalogo_codigo_ATAService: Catalogo_codigo_ATAService,
    private Tipos_de_Origen_del_ComponenteService: Tipos_de_Origen_del_ComponenteService,


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
    this.model = new Control_Componentes_de_la_Aeronave(this.fb);
    this.Control_Componentes_de_la_AeronaveForm = this.model.buildFormGroup();
    this.N_Parte_asociado_al_componenteItems.removeAt(0);

    this.Control_Componentes_de_la_AeronaveForm.get('Folio').disable();
    this.Control_Componentes_de_la_AeronaveForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  Origen_del_componente_ExecuteBusinessRules(event) {
    const length = this.dataSourceN_Parte_asociado_al_componente.data.length;
    const index = length - 1;
    const formN_Parte_asociado_al_componente = this.N_Parte_asociado_al_componenteItems.controls[index] as FormGroup;

    if (event.value == 1) {
      this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Fecha_de_reparacion");
      this.brf.SetValueControl(formN_Parte_asociado_al_componente, "Fecha_de_reparacion", null);
    }
    else {
      this.brf.SetEnableToMRControl(formN_Parte_asociado_al_componente, "Fecha_de_reparacion");
    }
  }

  async RegresaValoresBusqueda() {
    let matricula: string = "";
    let codigoComputarizado: string = "";
    let codigoATA: string = "";
    let noParte: string = "";
    let noSerie: string = "";
    let where: string = " 1 = 1 ";

    matricula = this.Control_Componentes_de_la_AeronaveForm.get('Matricula').value.Matricula;
    codigoComputarizado = this.Control_Componentes_de_la_AeronaveForm.get('Codigo_Computarizado_Descripcion').value;
    codigoATA = this.Control_Componentes_de_la_AeronaveForm.get('Codigo_ATA').value;
    noParte = this.Control_Componentes_de_la_AeronaveForm.get('N_Parte').value;
    noSerie = this.Control_Componentes_de_la_AeronaveForm.get('N_de_Serie_Filtro').value;

    if (matricula != undefined && matricula != "") {
      where += `and ( Matricula like '${matricula}')`;
    }

    if (codigoComputarizado != undefined && codigoComputarizado != "") {
      where += `and ( Detalle_Parte_Asociada_al_Componente_Aeronave.Codigo_Computarizado like '` + codigoComputarizado + `' or Codigo_Computarizado.Descripcion_Busqueda like'` + codigoComputarizado + `' )`;
    }

    if (codigoATA != undefined && codigoATA != "") {
      where += `and ( Detalle_Parte_Asociada_al_Componente_Aeronave.Codigo_ATA like '` + codigoATA + `' or Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '` + codigoATA + `' )  `;
    }

    if (noParte != undefined && noParte != "") {
      where += `and ( Detalle_Parte_Asociada_al_Componente_Aeronave.N_Parte like '` + noSerie + `'  or Detalle_Parte_Asociada_al_Componente_Aeronave.Descripcion_de_la_parte like'` + noSerie + `') `;
    }

    if (noSerie != undefined && noSerie != "") {
      where += `and ( Detalle_Parte_Asociada_al_Componente_Aeronave.N_de_Serie like '` + noSerie + `')`;
    }

    let fN_Parte_asociado_al_componente = await this.Detalle_Parte_Asociada_al_Componente_AeronaveService.listaSelAll(0, 1000, where).toPromise();
    this.N_Parte_asociado_al_componenteData = fN_Parte_asociado_al_componente.Detalle_Parte_Asociada_al_Componente_Aeronaves;
    this.loadN_Parte_asociado_al_componente(fN_Parte_asociado_al_componente.Detalle_Parte_Asociada_al_Componente_Aeronaves);
    this.dataSourceN_Parte_asociado_al_componente = new MatTableDataSource(fN_Parte_asociado_al_componente.Detalle_Parte_Asociada_al_Componente_Aeronaves);
    this.dataSourceN_Parte_asociado_al_componente.paginator = this.paginator;
    this.dataSourceN_Parte_asociado_al_componente.sort = this.sort;

    console.log(where);
  }

  ngAfterViewInit(): void {
    this.dataSourceN_Parte_asociado_al_componente.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.N_Parte_asociado_al_componenteColumns.splice(0, 1);

          this.Control_Componentes_de_la_AeronaveForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Control_Componentes_de_la_Aeronave)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Control_Componentes_de_la_AeronaveForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Control_Componentes_de_la_AeronaveForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Control_Componentes_de_la_AeronaveForm, 'N_serie', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Control_Componentes_de_la_AeronaveForm, 'Usuario_que_actualizo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Control_Componentes_de_la_AeronaveService.listaSelAll(0, 1, 'Control_Componentes_de_la_Aeronave.Folio=' + id).toPromise();
    if (result.Control_Componentes_de_la_Aeronaves.length > 0) {
      let fN_Parte_asociado_al_componente = await this.Detalle_Parte_Asociada_al_Componente_AeronaveService.listaSelAll(0, 1000, 'Control_Componentes_de_la_Aeronave.Folio=' + id).toPromise();
      this.N_Parte_asociado_al_componenteData = fN_Parte_asociado_al_componente.Detalle_Parte_Asociada_al_Componente_Aeronaves;
      this.loadN_Parte_asociado_al_componente(fN_Parte_asociado_al_componente.Detalle_Parte_Asociada_al_Componente_Aeronaves);
      this.dataSourceN_Parte_asociado_al_componente = new MatTableDataSource(fN_Parte_asociado_al_componente.Detalle_Parte_Asociada_al_Componente_Aeronaves);
      this.dataSourceN_Parte_asociado_al_componente.paginator = this.paginator;
      this.dataSourceN_Parte_asociado_al_componente.sort = this.sort;

      this.model.fromObject(result.Control_Componentes_de_la_Aeronaves[0]);
      this.Control_Componentes_de_la_AeronaveForm.get('Matricula').setValue(
        result.Control_Componentes_de_la_Aeronaves[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.Control_Componentes_de_la_AeronaveForm.get('Modelo').setValue(
        result.Control_Componentes_de_la_Aeronaves[0].Modelo_Modelos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Control_Componentes_de_la_AeronaveForm.get('N_serie').setValue(
        result.Control_Componentes_de_la_Aeronaves[0].N_serie_Aeronave.Numero_de_Serie,
        { onlySelf: false, emitEvent: true }
      );
      this.Control_Componentes_de_la_AeronaveForm.get('Usuario_que_actualizo').setValue(
        result.Control_Componentes_de_la_Aeronaves[0].Usuario_que_actualizo_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      );

      this.Control_Componentes_de_la_AeronaveForm.markAllAsTouched();
      this.Control_Componentes_de_la_AeronaveForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get N_Parte_asociado_al_componenteItems() {
    return this.Control_Componentes_de_la_AeronaveForm.get('Detalle_Parte_Asociada_al_Componente_AeronaveItems') as FormArray;
  }

  getN_Parte_asociado_al_componenteColumns(): string[] {
    return this.N_Parte_asociado_al_componenteColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadN_Parte_asociado_al_componente(N_Parte_asociado_al_componente: Detalle_Parte_Asociada_al_Componente_Aeronave[]) {
    N_Parte_asociado_al_componente.forEach(element => {
      this.addN_Parte_asociado_al_componente(element);
    });
  }

  async addN_Parte_asociado_al_componenteToMR() {
    const N_Parte_asociado_al_componente = new Detalle_Parte_Asociada_al_Componente_Aeronave(this.fb);
    this.N_Parte_asociado_al_componenteData.push(this.addN_Parte_asociado_al_componente(N_Parte_asociado_al_componente));
    this.dataSourceN_Parte_asociado_al_componente.data = this.N_Parte_asociado_al_componenteData;
    N_Parte_asociado_al_componente.edit = true;
    N_Parte_asociado_al_componente.isNew = true;
    const length = this.dataSourceN_Parte_asociado_al_componente.data.length;
    const index = length - 1;
    const formN_Parte_asociado_al_componente = this.N_Parte_asociado_al_componenteItems.controls[index] as FormGroup;
    this.addFilterToControlCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave(formN_Parte_asociado_al_componente.controls.Codigo_Computarizado, index);
    this.addFilterToControlCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave(formN_Parte_asociado_al_componente.controls.Codigo_ATA, index);

    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Fecha_de_reparacion");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Horas_acumuladas_parte");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Dias_acumulados_parte");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Ciclos_acumulados_parte");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Horas_acumuladas_aeronave");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Ciclos_acumulados_aeronave");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "N_OT");

    let matricula = this.Control_Componentes_de_la_AeronaveForm.get('Matricula').value.Matricula;

    let HorasAcumuladasAeronave = await this.brf.EvaluaQueryAsync(`SELECT datepart(hour, Horas_actuales) FROM Aeronave where matricula = '${matricula}'`, 1, "ABC123");
    let CiclosAcumuladosAeronave = await this.brf.EvaluaQueryAsync(`SELECT Ciclos_actuales FROM Aeronave where matricula = '${matricula}'`, 1, "ABC123");

    this.brf.SetValueControl(formN_Parte_asociado_al_componente, "Horas_acumuladas_aeronave", HorasAcumuladasAeronave);
    this.brf.SetValueControl(formN_Parte_asociado_al_componente, "Ciclos_acumulados_aeronave", CiclosAcumuladosAeronave);

    const page = Math.ceil(this.dataSourceN_Parte_asociado_al_componente.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addN_Parte_asociado_al_componente(entity: Detalle_Parte_Asociada_al_Componente_Aeronave) {
    const N_Parte_asociado_al_componente = new Detalle_Parte_Asociada_al_Componente_Aeronave(this.fb);
    this.N_Parte_asociado_al_componenteItems.push(N_Parte_asociado_al_componente.buildFormGroup());
    if (entity) {
      N_Parte_asociado_al_componente.fromObject(entity);
    }
    return entity;
  }

  N_Parte_asociado_al_componenteItemsByFolio(Folio: number): FormGroup {
    return (this.Control_Componentes_de_la_AeronaveForm.get('Detalle_Parte_Asociada_al_Componente_AeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  N_Parte_asociado_al_componenteItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    let fb = this.N_Parte_asociado_al_componenteItems.controls[index] as FormGroup;
    return fb;
  }

  deleteN_Parte_asociado_al_componente(element: any) {
    let index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    this.N_Parte_asociado_al_componenteData[index].IsDeleted = true;
    this.dataSourceN_Parte_asociado_al_componente.data = this.N_Parte_asociado_al_componenteData;
    this.dataSourceN_Parte_asociado_al_componente.data.splice(index, 1);
    this.dataSourceN_Parte_asociado_al_componente._updateChangeSubscription();
    index = this.dataSourceN_Parte_asociado_al_componente.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditN_Parte_asociado_al_componente(element: any) {
    let index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.N_Parte_asociado_al_componenteData[index].IsDeleted = true;
      this.dataSourceN_Parte_asociado_al_componente.data = this.N_Parte_asociado_al_componenteData;
      this.dataSourceN_Parte_asociado_al_componente.data.splice(index, 1);
      this.dataSourceN_Parte_asociado_al_componente._updateChangeSubscription();
      index = this.N_Parte_asociado_al_componenteData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveN_Parte_asociado_al_componente(element: any) {
    const index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    const formN_Parte_asociado_al_componente = this.N_Parte_asociado_al_componenteItems.controls[index] as FormGroup;
    if (this.N_Parte_asociado_al_componenteData[index].Codigo_Computarizado !== formN_Parte_asociado_al_componente.value.Codigo_Computarizado && formN_Parte_asociado_al_componente.value.Codigo_Computarizado > 0) {
      let codigo_computarizado = await this.Codigo_ComputarizadoService.getById(formN_Parte_asociado_al_componente.value.Codigo_Computarizado).toPromise();
      this.N_Parte_asociado_al_componenteData[index].Codigo_Computarizado_Codigo_Computarizado = codigo_computarizado;
    }
    this.N_Parte_asociado_al_componenteData[index].Codigo_Computarizado = formN_Parte_asociado_al_componente.value.Codigo_Computarizado;
    if (this.N_Parte_asociado_al_componenteData[index].Codigo_ATA !== formN_Parte_asociado_al_componente.value.Codigo_ATA && formN_Parte_asociado_al_componente.value.Codigo_ATA > 0) {
      let catalogo_codigo_ata = await this.Catalogo_codigo_ATAService.getById(formN_Parte_asociado_al_componente.value.Codigo_ATA).toPromise();
      this.N_Parte_asociado_al_componenteData[index].Codigo_ATA_Catalogo_codigo_ATA = catalogo_codigo_ata;
    }
    this.N_Parte_asociado_al_componenteData[index].Codigo_ATA = formN_Parte_asociado_al_componente.value.Codigo_ATA;
    this.N_Parte_asociado_al_componenteData[index].N_Parte = formN_Parte_asociado_al_componente.value.N_Parte;
    this.N_Parte_asociado_al_componenteData[index].Descripcion_de_la_parte = formN_Parte_asociado_al_componente.value.Descripcion_de_la_parte;
    this.N_Parte_asociado_al_componenteData[index].Modelo = formN_Parte_asociado_al_componente.value.Modelo;
    this.N_Parte_asociado_al_componenteData[index].Origen_del_componente = formN_Parte_asociado_al_componente.value.Origen_del_componente;
    this.N_Parte_asociado_al_componenteData[index].Origen_del_componente_Tipos_de_Origen_del_Componente = formN_Parte_asociado_al_componente.value.Origen_del_componente !== '' ?
      this.varTipos_de_Origen_del_Componente.filter(d => d.Clave === formN_Parte_asociado_al_componente.value.Origen_del_componente)[0] : null;
    this.N_Parte_asociado_al_componenteData[index].N_de_Serie = formN_Parte_asociado_al_componente.value.N_de_Serie;
    this.N_Parte_asociado_al_componenteData[index].Posicion_de_la_pieza = formN_Parte_asociado_al_componente.value.Posicion_de_la_pieza;
    this.N_Parte_asociado_al_componenteData[index].Fecha_de_fabricacion = formN_Parte_asociado_al_componente.value.Fecha_de_fabricacion;
    this.N_Parte_asociado_al_componenteData[index].Fecha_de_instalacion = formN_Parte_asociado_al_componente.value.Fecha_de_instalacion;



    this.N_Parte_asociado_al_componenteData[index].Fecha_de_reparacion = formN_Parte_asociado_al_componente.value.Fecha_de_reparacion;
    this.N_Parte_asociado_al_componenteData[index].Horas_acumuladas_parte = formN_Parte_asociado_al_componente.controls.Horas_acumuladas_parte.value;
    this.N_Parte_asociado_al_componenteData[index].Dias_acumulados_parte = formN_Parte_asociado_al_componente.controls.Dias_acumulados_parte.value;
    this.N_Parte_asociado_al_componenteData[index].Ciclos_acumulados_parte = formN_Parte_asociado_al_componente.controls.Ciclos_acumulados_parte.value;
    this.N_Parte_asociado_al_componenteData[index].Horas_acumuladas_aeronave = formN_Parte_asociado_al_componente.controls.Horas_acumuladas_aeronave.value;
    this.N_Parte_asociado_al_componenteData[index].Ciclos_acumulados_aeronave = formN_Parte_asociado_al_componente.controls.Ciclos_acumulados_aeronave.value;
    this.N_Parte_asociado_al_componenteData[index].N_OT = formN_Parte_asociado_al_componente.controls.N_OT.value;



    this.N_Parte_asociado_al_componenteData[index].Limite_de_meses = formN_Parte_asociado_al_componente.value.Limite_de_meses;
    this.N_Parte_asociado_al_componenteData[index].Limite_de_horas = formN_Parte_asociado_al_componente.value.Limite_de_horas;
    this.N_Parte_asociado_al_componenteData[index].Limite_de_ciclos = formN_Parte_asociado_al_componente.value.Limite_de_ciclos;
    // this.N_Parte_asociado_al_componenteData[index].N_Reporte = formN_Parte_asociado_al_componente.value.N_Reporte;
    // this.N_Parte_asociado_al_componenteData[index].HorasInicialesAeronave = formN_Parte_asociado_al_componente.value.HorasInicialesAeronave;
    // this.N_Parte_asociado_al_componenteData[index].CiclosInicialesAeronave = formN_Parte_asociado_al_componente.value.CiclosInicialesAeronave;
    // this.N_Parte_asociado_al_componenteData[index].LimitesEnDias = formN_Parte_asociado_al_componente.value.LimitesEnDias;
    // this.N_Parte_asociado_al_componenteData[index].DiasTranscurridos = formN_Parte_asociado_al_componente.value.DiasTranscurridos;
    // this.N_Parte_asociado_al_componenteData[index].DiasFaltantes = formN_Parte_asociado_al_componente.value.DiasFaltantes;
    // this.N_Parte_asociado_al_componenteData[index].HorasFaltantes = formN_Parte_asociado_al_componente.value.HorasFaltantes;
    this.N_Parte_asociado_al_componenteData[index].CiclosFaltantes = formN_Parte_asociado_al_componente.value.CiclosFaltantes;
    this.N_Parte_asociado_al_componenteData[index].Estatus = formN_Parte_asociado_al_componente.value.Estatus;

    this.N_Parte_asociado_al_componenteData[index].isNew = false;
    this.dataSourceN_Parte_asociado_al_componente.data = this.N_Parte_asociado_al_componenteData;
    this.dataSourceN_Parte_asociado_al_componente._updateChangeSubscription();

    this.ButtonSaveMRComponentes = true;
  }

  VerificarComponentes() {
    let count = this.Control_Componentes_de_la_AeronaveForm.get("Detalle_Parte_Asociada_al_Componente_AeronaveItems").value.length;

    let N_Parte = this.Control_Componentes_de_la_AeronaveForm.get("Detalle_Parte_Asociada_al_Componente_AeronaveItems").value[count - 1]['N_Parte'];
    let Descripcion_de_la_parte = this.Control_Componentes_de_la_AeronaveForm.get("Detalle_Parte_Asociada_al_Componente_AeronaveItems").value[count - 1]['Descripcion_de_la_parte'];
    let Origen_del_componente = this.Control_Componentes_de_la_AeronaveForm.get("Detalle_Parte_Asociada_al_Componente_AeronaveItems").value[count - 1]['Origen_del_componente'];
    let N_de_Serie = this.Control_Componentes_de_la_AeronaveForm.get("Detalle_Parte_Asociada_al_Componente_AeronaveItems").value[count - 1]['N_de_Serie'];
    let Posicion_de_la_pieza = this.Control_Componentes_de_la_AeronaveForm.get("Detalle_Parte_Asociada_al_Componente_AeronaveItems").value[count - 1]['Posicion_de_la_pieza'];
    let Limite_de_meses = this.Control_Componentes_de_la_AeronaveForm.get("Detalle_Parte_Asociada_al_Componente_AeronaveItems").value[count - 1]['Limite_de_meses'];

    if (N_Parte && Descripcion_de_la_parte && Origen_del_componente != 0 && N_de_Serie && Posicion_de_la_pieza && Limite_de_meses) {
      this.ButtonSaveMRComponentes = false;
    }
    else {
      this.ButtonSaveMRComponentes = true
    }
  }

  editN_Parte_asociado_al_componente(element: any) {
    const index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    const formN_Parte_asociado_al_componente = this.N_Parte_asociado_al_componenteItems.controls[index] as FormGroup;
    this.SelectedCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave[index] = this.dataSourceN_Parte_asociado_al_componente.data[index].Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda;
    this.addFilterToControlCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave(formN_Parte_asociado_al_componente.controls.Codigo_Computarizado, index);
    this.SelectedCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave[index] = this.dataSourceN_Parte_asociado_al_componente.data[index].Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion;
    this.addFilterToControlCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave(formN_Parte_asociado_al_componente.controls.Codigo_ATA, index);

    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Fecha_de_reparacion");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Horas_acumuladas_parte");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Dias_acumulados_parte");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Ciclos_acumulados_parte");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Horas_acumuladas_aeronave");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "Ciclos_acumulados_aeronave");
    this.brf.SetDisabledToMRControl(formN_Parte_asociado_al_componente, "N_OT");

    this.ButtonSaveMRComponentes = false;

    element.edit = true;
  }

  async saveDetalle_Parte_Asociada_al_Componente_Aeronave(Folio: number) {
    this.dataSourceN_Parte_asociado_al_componente.data.forEach(async (d, index) => {
      const data = this.N_Parte_asociado_al_componenteItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Control_Componentes_de_la_Aeronave = Folio;
      model.IdControl = Folio;

      if (model.Folio === 0) {
        // Add Ingreso de Componente
        let response = await this.Detalle_Parte_Asociada_al_Componente_AeronaveService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formN_Parte_asociado_al_componente = this.N_Parte_asociado_al_componenteItemsByFolio(model.Folio);
        if (formN_Parte_asociado_al_componente.dirty) {
          // Update Ingreso de Componente
          let response = await this.Detalle_Parte_Asociada_al_Componente_AeronaveService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Ingreso de Componente
        await this.Detalle_Parte_Asociada_al_Componente_AeronaveService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave[index] = event.option.viewValue;
    let fgr = this.Control_Componentes_de_la_AeronaveForm.controls.Detalle_Parte_Asociada_al_Componente_AeronaveItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Codigo_Computarizado.setValue(event.option.value);
    this.displayFnCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave(element);
  }

  displayFnCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave(this, element) {
    const index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    return this.SelectedCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave[index];
  }
  updateOptionCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave(event, element: any) {
    const index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    this.SelectedCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave[index] = event.source.viewValue;
  }

  _filterCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave(filter: any): Observable<Codigo_Computarizado> {
    const where = filter !== '' ? "Codigo_Computarizado.Descripcion_Busqueda like '%" + filter + "%'" : '';
    return this.Codigo_ComputarizadoService.listaSelAll(0, 20, where);
  }

  addFilterToControlCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave = true;
        return this._filterCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave(value || '');
      })
    ).subscribe(result => {
      this.varCodigo_Computarizado = result.Codigo_Computarizados;
      this.isLoadingCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave = false;
      this.searchCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_AeronaveCompleted = true;
      this.SelectedCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave[index] = this.varCodigo_Computarizado.length === 0 ? '' : this.SelectedCodigo_Computarizado_Detalle_Parte_Asociada_al_Componente_Aeronave[index];
    });
  }
  public selectCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave[index] = event.option.viewValue;
    let fgr = this.Control_Componentes_de_la_AeronaveForm.controls.Detalle_Parte_Asociada_al_Componente_AeronaveItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Codigo_ATA.setValue(event.option.value);
    this.displayFnCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave(element);
  }

  displayFnCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave(this, element) {
    const index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    return this.SelectedCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave[index];
  }
  updateOptionCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave(event, element: any) {
    const index = this.dataSourceN_Parte_asociado_al_componente.data.indexOf(element);
    this.SelectedCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave[index] = event.source.viewValue;
  }

  _filterCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave(filter: any): Observable<Catalogo_codigo_ATA> {
    const where = filter !== '' ? "Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + filter + "%'" : '';
    return this.Catalogo_codigo_ATAService.listaSelAll(0, 20, where);
  }

  addFilterToControlCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave = true;
        return this._filterCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave(value || '');
      })
    ).subscribe(result => {
      this.varCatalogo_codigo_ATA = result.Catalogo_codigo_ATAs;
      this.isLoadingCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave = false;
      this.searchCodigo_ATA_Detalle_Parte_Asociada_al_Componente_AeronaveCompleted = true;
      this.SelectedCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave[index] = this.varCatalogo_codigo_ATA.length === 0 ? '' : this.SelectedCodigo_ATA_Detalle_Parte_Asociada_al_Componente_Aeronave[index];
    });
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Control_Componentes_de_la_AeronaveForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.PropietariosService.getAll());
    observablesArray.push(this.Tipos_de_Origen_del_ComponenteService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varPropietarios, varTipos_de_Origen_del_Componente]) => {
          this.varPropietarios = varPropietarios;
          this.varTipos_de_Origen_del_Componente = varTipos_de_Origen_del_Componente;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Control_Componentes_de_la_AeronaveForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.MatriculaSeleccion = value;
        if (!value) return this.AeronaveService.listaSelAll(0, 0, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeronaveService.listaSelAll(0, 0, '');
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Matricula like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeronaveService.listaSelAll(0, 20,
          "Aeronave.Matricula like '%" + value.Matricula.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = result?.Aeronaves?.length > 0;

      if (this.MatriculaSeleccion != null && this.MatriculaSeleccion != "") {
        if (result.Aeronaves.length == 1 || this.operation == "Update") {
          this.Control_Componentes_de_la_AeronaveForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
        }
      }

      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Control_Componentes_de_la_AeronaveForm.get('Modelo').valueChanges.pipe(
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

      if (this.ModeloSeleccion != null && this.ModeloSeleccion != "") {
        this.Control_Componentes_de_la_AeronaveForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      }

      this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Control_Componentes_de_la_AeronaveForm.get('N_serie').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingN_serie = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.NoSerieSeleccion = value;
        if (!value) return this.AeronaveService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeronaveService.listaSelAll(0, 20, '');
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Numero_de_Serie like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeronaveService.listaSelAll(0, 20,
          "Aeronave.Numero_de_Serie like '%" + value.Numero_de_Serie.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingN_serie = false;
      this.hasOptionsN_serie = result?.Aeronaves?.length > 0;

      if (this.NoSerieSeleccion != null && this.NoSerieSeleccion != "") {
        this.Control_Componentes_de_la_AeronaveForm.get('N_serie').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      }

      this.optionsN_serie = of(result?.Aeronaves);
    }, error => {
      this.isLoadingN_serie = false;
      this.hasOptionsN_serie = false;
      this.optionsN_serie = of([]);
    });
    this.Control_Componentes_de_la_AeronaveForm.get('Usuario_que_actualizo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUsuario_que_actualizo = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.UsuarioSeleccion = value;
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
      this.isLoadingUsuario_que_actualizo = false;
      this.hasOptionsUsuario_que_actualizo = result?.Spartan_Users?.length > 0;

      if (this.UsuarioSeleccion != null && this.UsuarioSeleccion != "") {
        this.Control_Componentes_de_la_AeronaveForm.get('Usuario_que_actualizo').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      }

      this.optionsUsuario_que_actualizo = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingUsuario_que_actualizo = false;
      this.hasOptionsUsuario_que_actualizo = false;
      this.optionsUsuario_que_actualizo = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Propietario': {
        this.PropietariosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varPropietarios = x.Propietarioss;
        });
        break;
      }
      case 'Origen_del_componente': {
        this.Tipos_de_Origen_del_ComponenteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipos_de_Origen_del_Componente = x.Tipos_de_Origen_del_Componentes;
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
  displayFnN_serie(option: Aeronave) {
    return option?.Numero_de_Serie;
  }
  displayFnUsuario_que_actualizo(option: Spartan_User) {
    return option?.Name;
  }


  async save() {
    await this.saveData();
    setTimeout(() => { this.goToList(); }, 2000);
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Control_Componentes_de_la_AeronaveForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Control_Componentes_de_la_AeronaveForm.get('Matricula').value.Matricula;
      entity.Modelo = this.Control_Componentes_de_la_AeronaveForm.get('Modelo').value.Clave;
      entity.N_serie = this.Control_Componentes_de_la_AeronaveForm.get('N_serie').value.Matricula;
      entity.Usuario_que_actualizo = this.Control_Componentes_de_la_AeronaveForm.get('Usuario_que_actualizo').value.Id_User;
      entity.Propietario = this.Control_Componentes_de_la_AeronaveForm.get('Propietario').value;
      entity.Fecha_ultima_actualizacion = this.Control_Componentes_de_la_AeronaveForm.get('Fecha_ultima_actualizacion').value;

      entity.Codigo_Computarizado_Descripcion = ""; //this.Control_Componentes_de_la_AeronaveForm.get('Codigo_Computarizado_Descripcion').value;
      entity.Codigo_ATA = ""; //this.Control_Componentes_de_la_AeronaveForm.get('Codigo_ATA').value;
      entity.N_Parte = ""; //this.Control_Componentes_de_la_AeronaveForm.get('N_Parte').value;
      entity.N_de_Serie_Filtro = ""; //this.Control_Componentes_de_la_AeronaveForm.get('N_de_Serie_Filtro').value;

      if (this.model.Folio > 0) {
        await this.Control_Componentes_de_la_AeronaveService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Parte_Asociada_al_Componente_Aeronave(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
      } else {
        await (this.Control_Componentes_de_la_AeronaveService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Parte_Asociada_al_Componente_Aeronave(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
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
      this.Control_Componentes_de_la_AeronaveForm.reset();
      this.model = new Control_Componentes_de_la_Aeronave(this.fb);
      this.Control_Componentes_de_la_AeronaveForm = this.model.buildFormGroup();
      this.dataSourceN_Parte_asociado_al_componente = new MatTableDataSource<Detalle_Parte_Asociada_al_Componente_Aeronave>();
      this.N_Parte_asociado_al_componenteData = [];

    } else {
      this.router.navigate(['views/Control_Componentes_de_la_Aeronave/add']);
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
    this.router.navigate(['/Control_Componentes_de_la_Aeronave/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  async Matricula_ExecuteBusinessRules(): Promise<void> {

    //INICIA - BRID:3133 - filtro modelo y propietario (tiene un cambio manual) - Autor: Jose Caballero - Actualización: 9/13/2021 1:28:30 PM
    let matricula = this.Control_Componentes_de_la_AeronaveForm.get('Matricula').value.Matricula;
    let propietario = await this.brf.EvaluaQueryAsync(`SELECT Nombre FROM propietarios WHERE Folio =(SELECT propietario FROM Aeronave where matricula ='${matricula}')`, 1, "ABC123");
    let modelo = await this.brf.EvaluaQueryAsync(`SELECT Descripcion FROM Modelos WHERE Clave =(SELECT modelo FROM Aeronave where matricula ='${matricula}')`, 1, "ABC123");
    let no_serie = await this.brf.EvaluaQueryAsync(`SELECT Numero_de_Serie FROM Aeronave where matricula ='${matricula}'`, 1, "ABC123");

    this.brf.SetValueControl(this.Control_Componentes_de_la_AeronaveForm, "Propietario", propietario);
    this.brf.SetValueControl(this.Control_Componentes_de_la_AeronaveForm, "Modelo", modelo);
    this.brf.SetValueControl(this.Control_Componentes_de_la_AeronaveForm, "N_serie", no_serie.toString());
    //TERMINA - BRID:3133

    this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'Codigo_Computarizado_Descripcion', 1);
    this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'Codigo_ATA', 1);
    this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'N_Parte', 1);
    this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'N_de_Serie_Filtro', 1);

    //INICIA - BRID:4161 - no debe de permitir seleccionar una matricula existente  - Autor: Yamir - Actualización: 7/16/2021 10:20:54 AM
    if (await this.brf.EvaluaQueryAsync(`Select count(*) from Control_Componentes_de_la_Aeronave where Matricula='${matricula}'`, 1, 'ABC123') >= this.brf.TryParseInt('1', '1')) {
      alert("El sistema no permite ingresar una matrícula existente; ingresar una distinta");
      this.brf.SetValueControl(this.Control_Componentes_de_la_AeronaveForm, "Matricula", "");
    } else { }
    //TERMINA - BRID:4161

    //Matricula_FieldExecuteBusinessRulesEnd

  }
  Modelo_ExecuteBusinessRules(): void {
    //Modelo_FieldExecuteBusinessRulesEnd
  }
  N_serie_ExecuteBusinessRules(): void {
    //N_serie_FieldExecuteBusinessRulesEnd
  }
  Propietario_ExecuteBusinessRules(): void {
    //Propietario_FieldExecuteBusinessRulesEnd
  }
  Fecha_ultima_actualizacion_ExecuteBusinessRules(): void {
    //Fecha_ultima_actualizacion_FieldExecuteBusinessRulesEnd
  }
  Usuario_que_actualizo_ExecuteBusinessRules(): void {
    //Usuario_que_actualizo_FieldExecuteBusinessRulesEnd
  }
  Codigo_Computarizado_Descripcion_ExecuteBusinessRules(): void {
    //Codigo_Computarizado_Descripcion_FieldExecuteBusinessRulesEnd
  }
  Codigo_ATA_ExecuteBusinessRules(): void {
    //Codigo_ATA_FieldExecuteBusinessRulesEnd
  }
  N_Parte_ExecuteBusinessRules(): void {
    //N_Parte_FieldExecuteBusinessRulesEnd
  }
  N_de_Serie_Filtro_ExecuteBusinessRules(): void {
    //N_de_Serie_Filtro_FieldExecuteBusinessRulesEnd
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

    if (this.operation == 'New') {
      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'Codigo_Computarizado_Descripcion', 0);
      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'Codigo_ATA', 0);
      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'N_Parte', 0);
      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'N_de_Serie_Filtro', 0);
    }

    //INICIA - BRID:3122 - fecha y usuario desab, y defaul - Autor: Administrador - Actualización: 5/17/2021 10:03:46 AM
    if (this.operation == 'New' || this.operation == 'Update') {

      let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`, 1, "ABC123");

      this.brf.SetCurrentDateToField(this.Control_Componentes_de_la_AeronaveForm, "Fecha_ultima_actualizacion");
      this.brf.SetValueControl(this.Control_Componentes_de_la_AeronaveForm, "Usuario_que_actualizo", username);

      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'Fecha_ultima_actualizacion', 0);
      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'Usuario_que_actualizo', 0);
    }
    //TERMINA - BRID:3122


    //INICIA - BRID:3134 - deshabilitar  - Autor: Yamir - Actualización: 6/11/2021 7:05:57 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'Modelo', 0);
      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'Propietario', 0);
      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'N_serie', 0);
      this.brf.HideFieldOfForm(this.Control_Componentes_de_la_AeronaveForm, "Folio");
      this.brf.SetNotRequiredControl(this.Control_Componentes_de_la_AeronaveForm, "Folio");
    }
    //TERMINA - BRID:3134


    //INICIA - BRID:3185 - Acomodo de campos superiores - Autor: Yamir - Actualización: 6/11/2021 7:03:52 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:3185


    //INICIA - BRID:3538 - al editar el listado de las aeronaves por componentes no modificar el campo matricula  - Autor: Administrador - Actualización: 5/27/2021 1:32:14 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.Control_Componentes_de_la_AeronaveForm, 'Matricula', 0);
    }
    //TERMINA - BRID:3538

    if (this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.Control_Componentes_de_la_AeronaveForm, 'Codigo_Computarizado_Descripcion');
      this.brf.SetNotRequiredControl(this.Control_Componentes_de_la_AeronaveForm, 'Codigo_ATA');
      this.brf.SetNotRequiredControl(this.Control_Componentes_de_la_AeronaveForm, 'N_Parte');
      this.brf.SetNotRequiredControl(this.Control_Componentes_de_la_AeronaveForm, 'N_de_Serie_Filtro');
    }



    //rulesOnInit_ExecuteBusinessRulesEnd

  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    //rulesAfterSave_ExecuteBusinessRulesEnd
  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:3970 - no dejar guardar  si seleccionas una matricula que ya exista  - Autor: Yamir - Actualización: 7/16/2021 10:22:19 AM
    if (this.operation == 'New') {
      let matricula = this.Control_Componentes_de_la_AeronaveForm.get('Matricula').value.Matricula;
      if (this.brf.EvaluaQuery(`Select count(*) from Control_Componentes_de_la_Aeronave where Matricula='${matricula}'`, 1, 'ABC123') >= this.brf.TryParseInt('1', '1')) {
        this.brf.ShowMessage("El sistema no permite ingresar una matrícula existente; ingresar una distinta");
        this.brf.SetValueControl(this.Control_Componentes_de_la_AeronaveForm, "Matricula", "");
        result = false;
      } 
    }
    //TERMINA - BRID:3970

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas

}
