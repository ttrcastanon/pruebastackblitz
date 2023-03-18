import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { GeneralService } from 'src/app/api-services/general.service';
import { TripulacionService } from 'src/app/api-services/Tripulacion.service';
import { Tripulacion } from 'src/app/models/Tripulacion';
import { PaisService } from 'src/app/api-services/Pais.service';
import { Pais } from 'src/app/models/Pais';
import { GeneroService } from 'src/app/api-services/Genero.service';
import { Genero } from 'src/app/models/Genero';
import { Tipo_de_TripulanteService } from 'src/app/api-services/Tipo_de_Tripulante.service';
import { Tipo_de_Tripulante } from 'src/app/models/Tipo_de_Tripulante';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { Estatus_TripulacionService } from 'src/app/api-services/Estatus_Tripulacion.service';
import { Estatus_Tripulacion } from 'src/app/models/Estatus_Tripulacion';
import { Tripulacion_AeronaveService } from 'src/app/api-services/Tripulacion_Aeronave.service';
import { Tripulacion_Aeronave } from 'src/app/models/Tripulacion_Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';

import { Creacion_de_UsuariosService } from 'src/app/api-services/Creacion_de_Usuarios.service';
import { Creacion_de_Usuarios } from 'src/app/models/Creacion_de_Usuarios';
import { Detalle_Cursos_de_TripulacionService } from 'src/app/api-services/Detalle_Cursos_de_Tripulacion.service';
import { Detalle_Cursos_de_Tripulacion } from 'src/app/models/Detalle_Cursos_de_Tripulacion';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Tipos_de_CursoService } from 'src/app/api-services/Tipos_de_Curso.service';
import { Tipos_de_Curso } from 'src/app/models/Tipos_de_Curso';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';
import * as moment from 'moment';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../helpers/AppDateAdapter';
import { getDutchPaginatorIntl } from '../../../shared/base-views/dutch-paginator-intl';
import { DatePipe, registerLocaleData } from '@angular/common';
import esMX from '@angular/common/locales/es-MX';
registerLocaleData(esMX);
@Component({
  selector: 'app-Tripulacion',
  templateUrl: './Tripulacion.component.html',
  styleUrls: ['./Tripulacion.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl()}

  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class TripulacionComponent implements OnInit, AfterViewInit {
MRaddCursos: boolean = false;
MRaddAeronaves: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  TripulacionForm: FormGroup;
  public Editor = ClassicEditor;
  model: Tripulacion;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsNacionalidad_1: Observable<Pais[]>;
  hasOptionsNacionalidad_1: boolean;
  isLoadingNacionalidad_1: boolean;
  optionsNacionalidad_2: Observable<Pais[]>;
  hasOptionsNacionalidad_2: boolean;
  isLoadingNacionalidad_2: boolean;
  public varGenero: Genero[] = [];
  public varTipo_de_Tripulante: Tipo_de_Tripulante[] = [];
  public varRespuesta: Respuesta[] = [];
  public varEstatus_Tripulacion: Estatus_Tripulacion[] = [];
  public varAeronave: Aeronave[] = [];

  autoAeronave_Tripulacion_Aeronave = new FormControl();
  SelectedAeronave_Tripulacion_Aeronave: string[] = [];
  isLoadingAeronave_Tripulacion_Aeronave: boolean;
  searchAeronave_Tripulacion_AeronaveCompleted: boolean;

  optionsUsuario_Relacionado: Observable<Creacion_de_Usuarios[]>;
  hasOptionsUsuario_Relacionado: boolean;
  isLoadingUsuario_Relacionado: boolean;
  FotografiaSelectedFile: File;
  FotografiaName = '';
  fileFotografia: SpartanFile;
  Cargar_LicenciaSelectedFile: File;
  Cargar_LicenciaName = '';
  fileCargar_Licencia: SpartanFile;
  Cargar_Certificado_MedicoSelectedFile: File;
  Cargar_Certificado_MedicoName = '';
  fileCargar_Certificado_Medico: SpartanFile;
  optionsPais_1: Observable<Pais[]>;
  hasOptionsPais_1: boolean;
  isLoadingPais_1: boolean;
  Cargar_Pasaporte_1SelectedFile: File;
  Cargar_Pasaporte_1Name = '';
  fileCargar_Pasaporte_1: SpartanFile;
  optionsPais_2: Observable<Pais[]>;
  hasOptionsPais_2: boolean;
  isLoadingPais_2: boolean;
  Cargar_Pasaporte_2SelectedFile: File;
  Cargar_Pasaporte_2Name = '';
  fileCargar_Pasaporte_2: SpartanFile;
  optionsPais_3: Observable<Pais[]>;
  hasOptionsPais_3: boolean;
  isLoadingPais_3: boolean;
  Cargar_Visa_1SelectedFile: File;
  Cargar_Visa_1Name = '';
  fileCargar_Visa_1: SpartanFile;
  optionsPais_4: Observable<Pais[]>;
  hasOptionsPais_4: boolean;
  isLoadingPais_4: boolean;
  Cargar_Visa_2SelectedFile: File;
  Cargar_Visa_2Name = '';
  fileCargar_Visa_2: SpartanFile;
  public varModelos: Modelos[] = [];
  public varTipos_de_Curso: Tipos_de_Curso[] = [];
  DOCUMENTO_Detalle_Cursos_de_Tripulacion: string[] = [];

  autoMODELO_Detalle_Cursos_de_Tripulacion = new FormControl();
  SelectedMODELO_Detalle_Cursos_de_Tripulacion: string[] = [];
  isLoadingMODELO_Detalle_Cursos_de_Tripulacion: boolean;
  searchMODELO_Detalle_Cursos_de_TripulacionCompleted: boolean;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  isAeronaveOpen: boolean = false;
  isCursoOpen: boolean = false;
  aeronavesEliminadas: Tripulacion_Aeronave[] = []
  private tmpDocCurso:any;

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild('AeronavePaginator', { read: MatPaginator }) paginator: MatPaginator;
  @ViewChild('CursosPaginator', { read: MatPaginator }) paginatorCursos: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceAeronaves = new MatTableDataSource<Tripulacion_Aeronave>();
  AeronavesColumns = [
    { def: 'actions', hide: false },
    { def: 'Aeronave', hide: false },

  ];
  AeronavesData: Tripulacion_Aeronave[] = [];
  dataSourceCursos = new MatTableDataSource<Detalle_Cursos_de_Tripulacion>();
  CursosColumns = [
    { def: 'actions', hide: false },
    { def: 'MODELO', hide: false },
    { def: 'TIPO_DE_CURSO', hide: false },
    { def: 'DESCRIPCION', hide: false },
    { def: 'FECHA_DE_VENCIMIENT', hide: false },
    { def: 'DOCUMENTO', hide: false },

  ];
  CursosData: Detalle_Cursos_de_Tripulacion[] = [];

  today = new Date;
  consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private TripulacionService: TripulacionService,
    private PaisService: PaisService,
    private GeneroService: GeneroService,
    private Tipo_de_TripulanteService: Tipo_de_TripulanteService,
    private RespuestaService: RespuestaService,
    private Estatus_TripulacionService: Estatus_TripulacionService,
    private Tripulacion_AeronaveService: Tripulacion_AeronaveService,
    private AeronaveService: AeronaveService,

    private Creacion_de_UsuariosService: Creacion_de_UsuariosService,
    private Detalle_Cursos_de_TripulacionService: Detalle_Cursos_de_TripulacionService,
    private ModelosService: ModelosService,
    private Tipos_de_CursoService: Tipos_de_CursoService,


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
    this.model = new Tripulacion(this.fb);
    this.TripulacionForm = this.model.buildFormGroup();
    this.AeronavesItems.removeAt(0);
    this.CursosItems.removeAt(0);

    this.TripulacionForm.get('Clave').disable();
    this.TripulacionForm.get('Clave').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceAeronaves.paginator = this.paginator;
    this.dataSourceCursos.paginator = this.paginatorCursos;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.AeronavesColumns.splice(0, 1);
        this.CursosColumns.splice(0, 1);

        this.TripulacionForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Tripulacion)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.TripulacionForm, 'Nacionalidad_1', [CustomValidators.autocompleteObjectValidatorNoRquired(), Validators.required]);
    this.brf.updateValidatorsToControl(this.TripulacionForm, 'Nacionalidad_2', [CustomValidators.autocompleteObjectValidatorNoRquired()]);
    this.brf.updateValidatorsToControl(this.TripulacionForm, 'Usuario_Relacionado', [CustomValidators.autocompleteObjectValidatorNoRquired(), Validators.required]);
    this.brf.updateValidatorsToControl(this.TripulacionForm, 'Pais_1', [CustomValidators.autocompleteObjectValidatorNoRquired()]);
    this.brf.updateValidatorsToControl(this.TripulacionForm, 'Pais_2', [CustomValidators.autocompleteObjectValidatorNoRquired()]);
    this.brf.updateValidatorsToControl(this.TripulacionForm, 'Pais_3', [CustomValidators.autocompleteObjectValidatorNoRquired()]);
    this.brf.updateValidatorsToControl(this.TripulacionForm, 'Pais_4', [CustomValidators.autocompleteObjectValidatorNoRquired()]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.TripulacionService.listaSelAll(0, 1, 'Tripulacion.Clave=' + id).toPromise();
    if (result.Tripulacions.length > 0) {
      await this.Tripulacion_AeronaveService.listaSelAll(0, 1000, 'Tripulacion.Clave=' + id).toPromise().then((fAeronaves) => {
        this.AeronavesData = fAeronaves.Tripulacion_Aeronaves;
        this.loadAeronaves(fAeronaves.Tripulacion_Aeronaves);
        this.dataSourceAeronaves = new MatTableDataSource(fAeronaves.Tripulacion_Aeronaves);
        this.dataSourceAeronaves.paginator = this.paginator;
        this.dataSourceAeronaves.sort = this.sort;
      });


      await this.Detalle_Cursos_de_TripulacionService.listaSelAll(0, 1000, 'Tripulacion.Clave=' + id).toPromise().then((fCursos) => {
        this.CursosData = fCursos.Detalle_Cursos_de_Tripulacions;
        this.loadCursos(fCursos.Detalle_Cursos_de_Tripulacions);
        this.dataSourceCursos = new MatTableDataSource(fCursos.Detalle_Cursos_de_Tripulacions);
        this.dataSourceCursos.paginator = this.paginatorCursos;
        this.dataSourceCursos.sort = this.sort;
      })
      this.model.fromObject(result.Tripulacions[0]);
      
      if (result.Tripulacions[0]["Nacionalidad_1"] != null) {
        this.TripulacionForm.get('Nacionalidad_1').setValue(
          result.Tripulacions[0].Nacionalidad_1_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }

      var Nacionalidad2 = {
        Nacionalidad: result.Tripulacions[0].Nacionalidad_2_Pais.Nacionalidad,
        Clave: result.Tripulacions[0].Nacionalidad_2_Pais.Clave
      }

      if (Nacionalidad2.Nacionalidad != null) {
        this.TripulacionForm.get('Nacionalidad_2').setValue(
          Nacionalidad2,
          { onlySelf: false, emitEvent: true }
        );
      }
      this.TripulacionForm.get('Usuario_Relacionado').setValue(
        result.Tripulacions[0].Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo,
        { onlySelf: false, emitEvent: true }
      );
      if (this.model.Fotografia !== null && this.model.Fotografia !== undefined) {
        this.spartanFileService.getById(this.model.Fotografia).subscribe(f => {
          this.fileFotografia = f;
          this.FotografiaName = f.Description;
          this.TripulacionForm.controls['FotografiaFile'].setErrors(null);
        });
      }
      if (this.model.Cargar_Licencia !== null && this.model.Cargar_Licencia !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Licencia).subscribe(f => {
          this.fileCargar_Licencia = f;
          this.Cargar_LicenciaName = f.Description;
          this.TripulacionForm.controls['Cargar_LicenciaFile'].setErrors(null);
        });
      }
      if (this.model.Cargar_Certificado_Medico !== null && this.model.Cargar_Certificado_Medico !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Certificado_Medico).subscribe(f => {
          this.fileCargar_Certificado_Medico = f;
          this.Cargar_Certificado_MedicoName = f.Description;
          this.TripulacionForm.controls['Cargar_Certificado_MedicoFile'].setErrors(null);
        });
      }
      if (result.Tripulacions[0].Pais_1_Pais.Clave) {
        this.TripulacionForm.get('Pais_1').setValue(
          result.Tripulacions[0].Pais_1_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }
      if (this.model.Cargar_Pasaporte_1 !== null && this.model.Cargar_Pasaporte_1 !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Pasaporte_1).subscribe(f => {
          this.fileCargar_Pasaporte_1 = f;
          this.Cargar_Pasaporte_1Name = f.Description;
          this.TripulacionForm.controls['Cargar_Pasaporte_1File'].setErrors(null);
        });
      }
      if (result.Tripulacions[0].Pais_2_Pais.Clave) {
        this.TripulacionForm.get('Pais_2').setValue(
          result.Tripulacions[0].Pais_2_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }
      if (this.model.Cargar_Pasaporte_2 !== null && this.model.Cargar_Pasaporte_2 !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Pasaporte_2).subscribe(f => {
          this.fileCargar_Pasaporte_2 = f;
          this.Cargar_Pasaporte_2Name = f.Description;
          this.TripulacionForm.controls['Cargar_Pasaporte_2File'].setErrors(null);
        });
      }
      if (result.Tripulacions[0].Pais_3_Pais.Clave) {
        this.TripulacionForm.get('Pais_3').setValue(
          result.Tripulacions[0].Pais_3_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }
      if (this.model.Cargar_Visa_1 !== null && this.model.Cargar_Visa_1 !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Visa_1).subscribe(f => {
          this.fileCargar_Visa_1 = f;
          this.Cargar_Visa_1Name = f.Description;
          this.TripulacionForm.controls['Cargar_Visa_1File'].setErrors(null);
        });
      }
      if (result.Tripulacions[0].Pais_4_Pais.Clave) {
        this.TripulacionForm.get('Pais_4').setValue(
          result.Tripulacions[0].Pais_4_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }
      if (this.model.Cargar_Visa_2 !== null && this.model.Cargar_Visa_2 !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Visa_2).subscribe(f => {
          this.fileCargar_Visa_2 = f;
          this.Cargar_Visa_2Name = f.Description;
          this.TripulacionForm.controls['Cargar_Visa_2File'].setErrors(null);
        });
      }
      
      this.TripulacionForm.markAllAsTouched();
      this.TripulacionForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get AeronavesItems() {
    return this.TripulacionForm.get('Tripulacion_AeronaveItems') as FormArray;
  }

  getCountCursos(): number {
    return this.dataSourceCursos.data.length;
  }

  getCountAeronaves(): number {
    return this.dataSourceAeronaves.data.length;
  }

  getAeronavesColumns(): string[] {
    return this.AeronavesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadAeronaves(Aeronaves: Tripulacion_Aeronave[]) {
    Aeronaves.forEach(element => {
      this.addAeronaves(element);
    });
  }

  addAeronavesToMR() {
    const Aeronaves = new Tripulacion_Aeronave(this.fb);
    this.AeronavesData.push(this.addAeronaves(Aeronaves));
    this.dataSourceAeronaves.data = this.AeronavesData;
    Aeronaves.edit = true;
    Aeronaves.isNew = true;
    const length = this.dataSourceAeronaves.data.length;
    const index = length - 1;
    const formAeronaves = this.AeronavesItems.controls[index] as FormGroup;
    formAeronaves.reset();

    this.addFilterToControlAeronave_Tripulacion_Aeronave(formAeronaves.controls.Aeronave, index);

    const page = Math.ceil(this.dataSourceAeronaves.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
    this.isAeronaveOpen = true;
  }

  addAeronaves(entity: Tripulacion_Aeronave) {
    const Aeronaves = new Tripulacion_Aeronave(this.fb);
    this.AeronavesItems.push(Aeronaves.buildFormGroup());
    if (entity) {
      Aeronaves.fromObject(entity);
    }
    this.isAeronaveOpen = false;
    return entity;
  }

  AeronavesItemsByFolio(Folio: number): FormGroup {
    return (this.TripulacionForm.get('Tripulacion_AeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  AeronavesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    let fb = this.AeronavesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteAeronaves(element: any) {
    let index = this.dataSourceAeronaves.data.indexOf(element);
    this.AeronavesData[index].IsDeleted = true;
    this.dataSourceAeronaves.data = this.AeronavesData;
    debugger
    if(this.AeronavesData[index].Folio)this.aeronavesEliminadas.push( this.dataSourceAeronaves.data[index]);
    
    this.dataSourceAeronaves.data.splice(index, 1);
    let fgr = this.TripulacionForm.controls.Tripulacion_AeronaveItems as FormArray;
    fgr.removeAt(index);
    this.SelectedAeronave_Tripulacion_Aeronave[index] = "";
    this.dataSourceAeronaves._updateChangeSubscription();
    index = this.dataSourceAeronaves.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditAeronaves(element: any) {
    let index = this.dataSourceAeronaves.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.AeronavesData[index].IsDeleted = true;
      this.dataSourceAeronaves.data = this.AeronavesData;
      this.dataSourceAeronaves.data.splice(index, 1);
      let fgr = this.TripulacionForm.controls.Tripulacion_AeronaveItems as FormArray;
      fgr.removeAt(index);
      this.SelectedAeronave_Tripulacion_Aeronave[index] = "";
      this.dataSourceAeronaves._updateChangeSubscription();
      index = this.AeronavesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
    this.isAeronaveOpen = false;
  }

  async saveAeronaves(element: any) {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    const formAeronaves = this.AeronavesItems.controls[index] as FormGroup;

    if (this.AeronavesData[index].Aeronave !== formAeronaves.value.Aeronave && formAeronaves.value.Aeronave > 0) {
      let aeronave = await this.AeronaveService.getById(formAeronaves.value.Aeronave).toPromise();
      this.AeronavesData[index].Aeronave_Aeronave = aeronave;
    }

    this.AeronavesData[index].Aeronave = formAeronaves.value.Aeronave;
    this.AeronavesData[index].isNew = false;

    this.dataSourceAeronaves.data = this.AeronavesData;
    this.dataSourceAeronaves._updateChangeSubscription();
    this.isAeronaveOpen = false
  }

  editAeronaves(element: any) {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    const formAeronaves = this.AeronavesItems.controls[index] as FormGroup;
    this.SelectedAeronave_Tripulacion_Aeronave[index] = this.dataSourceAeronaves.data[index].Aeronave;
    this.addFilterToControlAeronave_Tripulacion_Aeronave(formAeronaves.controls.Aeronave, index);

    element.edit = true;
    this.isAeronaveOpen = true
  }

  async saveTripulacion_Aeronave(Folio: number) {
    this.AeronavesData = this.AeronavesData.concat(this.aeronavesEliminadas);
    this.AeronavesData.forEach(async (d, index) => {
      debugger

      let model = d;
      model.Clave_Tripulacion = Folio;

      if (model.Folio > 0 && model.IsDeleted) {
        await this.Tripulacion_AeronaveService.delete(model.Folio).toPromise();
      }else if(model.Folio === 0){
        await this.Tripulacion_AeronaveService.insert(model).toPromise();

      }else if(model.Folio > 0 && !model.IsDeleted){
        await this.Tripulacion_AeronaveService.update(model.Folio,model).toPromise();
      }


    });
  }

  public selectAeronave_Tripulacion_Aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAeronave_Tripulacion_Aeronave[index] = event.option.viewValue;
    let fgr = this.TripulacionForm.controls.Tripulacion_AeronaveItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Aeronave.setValue(event.option.value);
    this.displayFnAeronave_Tripulacion_Aeronave(element);
  }

  displayFnAeronave_Tripulacion_Aeronave(this, element) {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    return this.SelectedAeronave_Tripulacion_Aeronave[index];
  }
  updateOptionAeronave_Tripulacion_Aeronave(event, element: any) {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    this.SelectedAeronave_Tripulacion_Aeronave[index] = event.source.viewValue;
  }

  _filterAeronave_Tripulacion_Aeronave(filter: any): Observable<Aeronave> {
    const where = filter !== '' ? "Aeronave.Matricula like '%" + filter + "%'" : '';
    return this.AeronaveService.listaSelAll(0, 20, where);
  }

  addFilterToControlAeronave_Tripulacion_Aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAeronave_Tripulacion_Aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAeronave_Tripulacion_Aeronave = true;
        return this._filterAeronave_Tripulacion_Aeronave(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingAeronave_Tripulacion_Aeronave = false;
      this.searchAeronave_Tripulacion_AeronaveCompleted = true;
      this.SelectedAeronave_Tripulacion_Aeronave[index] = this.varAeronave.length === 0 ? '' : this.SelectedAeronave_Tripulacion_Aeronave[index];
    });
  }

  get CursosItems() {
    return this.TripulacionForm.get('Detalle_Cursos_de_TripulacionItems') as FormArray;
  }

  getCursosColumns(): string[] {
    return this.CursosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadCursos(Cursos: Detalle_Cursos_de_Tripulacion[]) {
    Cursos.forEach(element => {
      this.addCursos(element);
    });
  }

  addCursosToMR() {
    const Cursos = new Detalle_Cursos_de_Tripulacion(this.fb);
    this.CursosData.push(this.addCursos(Cursos));
    this.dataSourceCursos.data = this.CursosData;
    Cursos.edit = true;
    Cursos.isNew = true;
    const length = this.dataSourceCursos.data.length;
    const index = length - 1;
    const formCursos = this.CursosItems.controls[index] as FormGroup;
    formCursos.reset();
    this.addFilterToControlMODELO_Detalle_Cursos_de_Tripulacion(formCursos.controls.MODELO, index);

    const page = Math.ceil(this.dataSourceCursos.data.filter(d => !d.IsDeleted).length / this.paginatorCursos.pageSize);
    if (page !== this.paginatorCursos.pageIndex) {
      this.paginatorCursos.pageIndex = page;
    }
    this.isCursoOpen = true;
  }

  addCursos(entity: Detalle_Cursos_de_Tripulacion) {
    const Cursos = new Detalle_Cursos_de_Tripulacion(this.fb);
    this.CursosItems.push(Cursos.buildFormGroup());
    if (entity) {
      Cursos.fromObject(entity);
    }
    this.isCursoOpen = false;
    return entity;
  }

  CursosItemsByFolio(Folio: number): FormGroup {
    return (this.TripulacionForm.get('Detalle_Cursos_de_TripulacionItems') as FormArray).controls.find(c => c.get('Clave').value === Folio) as FormGroup;
  }

  CursosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceCursos.data.indexOf(element);
    let fb = this.CursosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteCursos(element: any) {
    let index = this.dataSourceCursos.data.indexOf(element);
    this.CursosData[index].IsDeleted = true;
    this.dataSourceCursos.data = this.CursosData;
    this.dataSourceCursos.data.splice(index, 1);
    let fgr = this.TripulacionForm.controls.Detalle_Cursos_de_TripulacionItems as FormArray;
      fgr.removeAt(index);
      this.SelectedMODELO_Detalle_Cursos_de_Tripulacion[index] = "";
    this.dataSourceCursos._updateChangeSubscription();
    index = this.dataSourceCursos.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorCursos.pageSize);
    if (page !== this.paginatorCursos.pageIndex) {
      this.paginatorCursos.pageIndex = page;
    }
  }

  cancelEditCursos(element: any) {
    let index = this.dataSourceCursos.data.indexOf(element);
    element.edit = false;
    element.DOCUMENTO_Spartane_File = this.tmpDocCurso;
    if (element.isNew) {
      this.CursosData[index].IsDeleted = true;
      this.CursosData.splice(index, 1);
      let fgr = this.TripulacionForm.controls.Detalle_Cursos_de_TripulacionItems as FormArray;
      fgr.removeAt(index);
      this.SelectedMODELO_Detalle_Cursos_de_Tripulacion[index] = "";

      this.dataSourceCursos.data = this.CursosData;
      this.dataSourceCursos._updateChangeSubscription();
      index = this.CursosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginatorCursos.pageSize);
      if (page !== this.paginatorCursos.pageIndex) {
        this.paginatorCursos.pageIndex = page;
      }
    }
    this.isCursoOpen = false;
  }

  async saveCursos(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    const formCursos = this.CursosItems.controls[index] as FormGroup;
    if (this.CursosData[index].MODELO !== formCursos.value.MODELO && formCursos.value.MODELO > 0) {
      let modelos = await this.ModelosService.getById(formCursos.value.MODELO).toPromise();
      this.CursosData[index].MODELO_Modelos = modelos;
    }
    this.CursosData[index].MODELO = formCursos.value.MODELO;
    this.CursosData[index].TIPO_DE_CURSO = formCursos.value.TIPO_DE_CURSO;
    this.CursosData[index].TIPO_DE_CURSO_Tipos_de_Curso = formCursos.value.TIPO_DE_CURSO !== '' ?
      this.varTipos_de_Curso.filter(d => d.Clave === formCursos.value.TIPO_DE_CURSO)[0] : null;
    this.CursosData[index].DESCRIPCION = formCursos.value.DESCRIPCION;
    this.CursosData[index].FECHA_DE_VENCIMIENT = formCursos.value.FECHA_DE_VENCIMIENT;

    this.CursosData[index].isNew = false;
    this.dataSourceCursos.data = this.CursosData;
    this.dataSourceCursos._updateChangeSubscription();
    this.isCursoOpen = false;
  }

  editCursos(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    const formCursos = this.CursosItems.controls[index] as FormGroup;
    this.SelectedMODELO_Detalle_Cursos_de_Tripulacion[index] = this.dataSourceCursos.data[index]?.MODELO_Modelos?.Descripcion;
    this.addFilterToControlMODELO_Detalle_Cursos_de_Tripulacion(formCursos.controls.MODELO, index);

    element.edit = true;
    this.isCursoOpen = true;
  }

  soloFecha(e) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
    const keyPressed = e.key;

    if (!allowedKeys.includes(keyPressed)) {
      e.preventDefault();
      return;
    }
    if (e.target.value.length >=10) {
      e.preventDefault();
      return;
    }
  }

  async saveDetalle_Cursos_de_Tripulacion(Folio: number) {

    this.sqlModel.query = ` DELETE Detalle_Cursos_de_Tripulacion WHERE IdTripulacion = ${Folio}`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {

        this.dataSourceCursos.data.forEach(async (d, index) => {
          let model = d
          model["Clave"] = 0
          model.IdTripulacion = Folio;

          const FolioDOCUMENTO = await this.saveDOCUMENTO_Detalle_Cursos_de_Tripulacion(index);
          d.DOCUMENTO = FolioDOCUMENTO > 0 ? FolioDOCUMENTO : null;

          await this.Detalle_Cursos_de_TripulacionService.insert(model).toPromise();

        });
      },
      error: err => {
        console.error(err);
      },
      complete: async () => {
      }
    })

  }

  public selectMODELO_Detalle_Cursos_de_Tripulacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCursos.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMODELO_Detalle_Cursos_de_Tripulacion[index] = event.option.viewValue;
    let fgr = this.TripulacionForm.controls.Detalle_Cursos_de_TripulacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.MODELO.setValue(event.option.value);
    this.displayFnMODELO_Detalle_Cursos_de_Tripulacion(element);
  }

  displayFnMODELO_Detalle_Cursos_de_Tripulacion(this, element) {
    const index = this.dataSourceCursos.data.indexOf(element);
    return this.SelectedMODELO_Detalle_Cursos_de_Tripulacion[index];
  }
  updateOptionMODELO_Detalle_Cursos_de_Tripulacion(event, element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    this.SelectedMODELO_Detalle_Cursos_de_Tripulacion[index] = event.source.viewValue;
  }

  _filterMODELO_Detalle_Cursos_de_Tripulacion(filter: any): Observable<Modelos> {
    const where = filter !== '' ? "Modelos.Descripcion like '%" + filter + "%'" : '';
    return this.ModelosService.listaSelAll(0, 20, where);
  }

  addFilterToControlMODELO_Detalle_Cursos_de_Tripulacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMODELO_Detalle_Cursos_de_Tripulacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMODELO_Detalle_Cursos_de_Tripulacion = true;
        return this._filterMODELO_Detalle_Cursos_de_Tripulacion(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingMODELO_Detalle_Cursos_de_Tripulacion = false;
      this.searchMODELO_Detalle_Cursos_de_TripulacionCompleted = true;
      this.SelectedMODELO_Detalle_Cursos_de_Tripulacion[index] = this.varModelos.length === 0 ? '' : this.SelectedMODELO_Detalle_Cursos_de_Tripulacion[index];
    });
  }

  getDOCUMENTO_Detalle_Cursos_de_Tripulacion(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);

    const formDetalle_Cursos_de_Tripulacion = this.CursosItems.controls[index] as FormGroup;
    return formDetalle_Cursos_de_Tripulacion.controls.DOCUMENTOFile?.value && formDetalle_Cursos_de_Tripulacion.controls.DOCUMENTOFile.value !== '' ?
      formDetalle_Cursos_de_Tripulacion.controls.DOCUMENTOFile.value.files[0].name : '';
  }

  async getDOCUMENTO_Detalle_Cursos_de_TripulacionClick(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    const formDetalle_Cursos_de_Tripulacion = this.CursosItems.controls[index] as FormGroup;
    if (formDetalle_Cursos_de_Tripulacion.controls.DOCUMENTOFile.valid
      && formDetalle_Cursos_de_Tripulacion.controls.DOCUMENTOFile.dirty) {
      const DOCUMENTO = formDetalle_Cursos_de_Tripulacion.controls.DOCUMENTOFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(DOCUMENTO);
      this.helperService.dowloadFileFromArray(byteArray, DOCUMENTO.name);
    }
  }

  removeDOCUMENTO_Detalle_Cursos_de_Tripulacion(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    // this.DOCUMENTO_Detalle_Cursos_de_Tripulacion[index] = '';
    // this.CursosData[index].DOCUMENTO = 0;
    this.tmpDocCurso = element.DOCUMENTO_Spartane_File;
    element.DOCUMENTO_Spartane_File = null;
    const formDetalle_Cursos_de_Tripulacion = this.CursosItems.controls[index] as FormGroup;
    formDetalle_Cursos_de_Tripulacion.get("IsDeleted").setValue(true);
    if (formDetalle_Cursos_de_Tripulacion.controls.DOCUMENTOFile.valid
      && formDetalle_Cursos_de_Tripulacion.controls.DOCUMENTOFile.dirty) {
      formDetalle_Cursos_de_Tripulacion.controls.DOCUMENTOFile.setValue(null);
    }
  }

  async saveDOCUMENTO_Detalle_Cursos_de_Tripulacion(index: number): Promise<number> {
    const formCursos = this.CursosItems.controls[index] as FormGroup;
    const documento = formCursos.get("DOCUMENTO").value;
    const IsDeleted = formCursos.get("IsDeleted").value;
    if (formCursos.controls.DOCUMENTOFile.valid
      && formCursos.controls.DOCUMENTOFile.dirty) {
      const DOCUMENTO = formCursos.controls.DOCUMENTOFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(DOCUMENTO);
      const spartanFile = {
        File: byteArray,
        Description: DOCUMENTO.name,
        Date_Time: DOCUMENTO.lastModifiedDate,
        File_Size: DOCUMENTO.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return (formCursos.controls.DOCUMENTOFile.valid && documento && !IsDeleted) ? documento : 0;
    }
  }

  hasDOCUMENTO_Detalle_Cursos_de_Tripulacion(element) {
    return this.getDOCUMENTO_Detalle_Cursos_de_Tripulacion(element) !== '' ||
      (element.DOCUMENTO_Spartane_File && element.DOCUMENTO_Spartane_File.File_Id > 0);
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Clave = +params.get('id');

        if (this.model.Clave) {
          this.operation = !this.TripulacionForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Clave);
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
    observablesArray.push(this.GeneroService.getAll());
    observablesArray.push(this.Tipo_de_TripulanteService.getAll());
    observablesArray.push(this.RespuestaService.getAll());
    observablesArray.push(this.Estatus_TripulacionService.getAll());

    observablesArray.push(this.Tipos_de_CursoService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varGenero, varTipo_de_Tripulante, varRespuesta, varEstatus_Tripulacion, varTipos_de_Curso]) => {
          this.varGenero = varGenero;
          this.varTipo_de_Tripulante = varTipo_de_Tripulante;
          this.varRespuesta = varRespuesta;
          this.varEstatus_Tripulacion = varEstatus_Tripulacion;

          this.varTipos_de_Curso = varTipos_de_Curso;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.TripulacionForm.get('Nacionalidad_1').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNacionalidad_1 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PaisService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PaisService.listaSelAll(0, 20, '');
          return this.PaisService.listaSelAll(0, 20,
            "Pais.Nacionalidad like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PaisService.listaSelAll(0, 20,
          "Pais.Nacionalidad like '%" + value.Nacionalidad.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNacionalidad_1 = false;
      this.hasOptionsNacionalidad_1 = result?.Paiss?.length > 0;
      if (this.operation == "New" || this.operation == "Consult") {
        this.TripulacionForm.get('Nacionalidad_1').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsNacionalidad_1 = of(result?.Paiss);
    }, error => {
      this.isLoadingNacionalidad_1 = false;
      this.hasOptionsNacionalidad_1 = false;
      this.optionsNacionalidad_1 = of([]);
    });
    this.TripulacionForm.get('Nacionalidad_2').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNacionalidad_2 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PaisService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PaisService.listaSelAll(0, 20, '');
          return this.PaisService.listaSelAll(0, 20,
            "Pais.Nacionalidad like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PaisService.listaSelAll(0, 20,
          "Pais.Nacionalidad like '%" + value.Nacionalidad.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNacionalidad_2 = false;
      this.hasOptionsNacionalidad_2 = result?.Paiss?.length > 0;
      if (this.operation == "New" || this.operation == "Consult") {
        this.TripulacionForm.get('Nacionalidad_2').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsNacionalidad_2 = of(result?.Paiss);
    }, error => {
      this.isLoadingNacionalidad_2 = false;
      this.hasOptionsNacionalidad_2 = false;
      this.optionsNacionalidad_2 = of([]);
    });
    this.TripulacionForm.get('Usuario_Relacionado').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUsuario_Relacionado = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_UsuariosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_UsuariosService.listaSelAll(0, 20, '');
          return this.Creacion_de_UsuariosService.listaSelAll(0, 20,
            "Creacion_de_Usuarios.Nombre_completo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_UsuariosService.listaSelAll(0, 20,
          "Creacion_de_Usuarios.Nombre_completo like '%" + value.Nombre_completo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingUsuario_Relacionado = false;
      this.hasOptionsUsuario_Relacionado = result?.Creacion_de_Usuarioss?.length > 0;
      // if (this.operation == "New" || this.operation == "Consult") {
      //   this.TripulacionForm.get('Usuario_Relacionado').setValue(result?.Creacion_de_Usuarioss[0], { onlySelf: true, emitEvent: false });
      // }
      this.optionsUsuario_Relacionado = of(result?.Creacion_de_Usuarioss);
    }, error => {
      this.isLoadingUsuario_Relacionado = false;
      this.hasOptionsUsuario_Relacionado = false;
      this.optionsUsuario_Relacionado = of([]);
    });
    this.TripulacionForm.get('Pais_1').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_1 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PaisService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PaisService.listaSelAll(0, 20, '');
          return this.PaisService.listaSelAll(0, 20,
            "Pais.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PaisService.listaSelAll(0, 20,
          "Pais.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPais_1 = false;
      this.hasOptionsPais_1 = result?.Paiss?.length > 0;
      if (this.operation == "New" || this.operation == "Consult") {
        this.TripulacionForm.get('Pais_1').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsPais_1 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_1 = false;
      this.hasOptionsPais_1 = false;
      this.optionsPais_1 = of([]);
    });
    this.TripulacionForm.get('Pais_2').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_2 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PaisService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PaisService.listaSelAll(0, 20, '');
          return this.PaisService.listaSelAll(0, 20,
            "Pais.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PaisService.listaSelAll(0, 20,
          "Pais.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPais_2 = false;
      this.hasOptionsPais_2 = result?.Paiss?.length > 0;
      if (this.operation == "New" || this.operation == "Consult") {
        this.TripulacionForm.get('Pais_2').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsPais_2 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_2 = false;
      this.hasOptionsPais_2 = false;
      this.optionsPais_2 = of([]);
    });
    this.TripulacionForm.get('Pais_3').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_3 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PaisService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PaisService.listaSelAll(0, 20, '');
          return this.PaisService.listaSelAll(0, 20,
            "Pais.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PaisService.listaSelAll(0, 20,
          "Pais.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPais_3 = false;
      this.hasOptionsPais_3 = result?.Paiss?.length > 0;
      if (this.operation == "New" || this.operation == "Consult") {
        this.TripulacionForm.get('Pais_3').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsPais_3 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_3 = false;
      this.hasOptionsPais_3 = false;
      this.optionsPais_3 = of([]);
    });
    this.TripulacionForm.get('Pais_4').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_4 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PaisService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PaisService.listaSelAll(0, 20, '');
          return this.PaisService.listaSelAll(0, 20,
            "Pais.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PaisService.listaSelAll(0, 20,
          "Pais.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPais_4 = false;
      this.hasOptionsPais_4 = result?.Paiss?.length > 0;
      if (this.operation == "New" || this.operation == "Consult") {
        this.TripulacionForm.get('Pais_4').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsPais_4 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_4 = false;
      this.hasOptionsPais_4 = false;
      this.optionsPais_4 = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Genero': {
        this.GeneroService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varGenero = x.Generos;
        });
        break;
      }
      case 'Tipo_de_Tripulante': {
        this.Tipo_de_TripulanteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Tripulante = x.Tipo_de_Tripulantes;
        });
        break;
      }
      case 'Pertenece_al_grupo': {
        this.RespuestaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRespuesta = x.Respuestas;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_TripulacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_Tripulacion = x.Estatus_Tripulacions;
        });
        break;
      }

      case 'TIPO_DE_CURSO': {
        this.Tipos_de_CursoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipos_de_Curso = x.Tipos_de_Cursos;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

  displayFnNacionalidad_1(option: Pais) {
    return option?.Nacionalidad;
  }
  displayFnNacionalidad_2(option: Pais) {
    return option?.Nacionalidad;
  }
  displayFnUsuario_Relacionado(option: Creacion_de_Usuarios) {
    return option?.Nombre_completo;
  }
  displayFnPais_1(option: Pais) {
    return option?.Nombre;
  }
  displayFnPais_2(option: Pais) {
    return option?.Nombre;
  }
  displayFnPais_3(option: Pais) {
    return option?.Nombre;
  }
  displayFnPais_4(option: Pais) {
    return option?.Nombre;
  }

  async saveFotografia(): Promise<number> {
    if (this.TripulacionForm.controls.FotografiaFile.valid
      && this.TripulacionForm.controls.FotografiaFile.dirty) {
      const Fotografia = this.TripulacionForm.controls.FotografiaFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Fotografia);
      const spartanFile = {
        File: byteArray,
        Description: Fotografia.name,
        Date_Time: Fotografia.lastModifiedDate,
        File_Size: Fotografia.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Fotografia > 0 ? this.model.Fotografia : 0;
    }
  }

  FotografiaUrl() {
    if (this.fileFotografia)
      return this.spartanFileService.url(this.fileFotografia.File_Id.toString(), this.fileFotografia.Description);
    return '#';
  }

  getFotografia() {
    this.helperService.dowloadFile(this.fileFotografia.base64, this.FotografiaName);
  }

  removeFotografia() {
    this.FotografiaName = '';
    this.model.Fotografia = 0;
  }

  async saveCargar_Licencia(): Promise<number> {
    if (this.TripulacionForm.controls.Cargar_LicenciaFile.valid
      && this.TripulacionForm.controls.Cargar_LicenciaFile.dirty) {
      const Cargar_Licencia = this.TripulacionForm.controls.Cargar_LicenciaFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Licencia);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Licencia.name,
        Date_Time: Cargar_Licencia.lastModifiedDate,
        File_Size: Cargar_Licencia.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Licencia > 0 ? this.model.Cargar_Licencia : 0;
    }
  }

  Cargar_LicenciaUrl() {
    if (this.fileCargar_Licencia)
      return this.spartanFileService.url(this.fileCargar_Licencia.File_Id.toString(), this.fileCargar_Licencia.Description);
    return '#';
  }

  getCargar_Licencia() {
    this.helperService.dowloadFile(this.fileCargar_Licencia.base64, this.Cargar_LicenciaName);
  }

  removeCargar_Licencia() {
    this.Cargar_LicenciaName = '';
    this.model.Cargar_Licencia = 0;
  }
  async saveCargar_Certificado_Medico(): Promise<number> {
    if (this.TripulacionForm.controls.Cargar_Certificado_MedicoFile.valid
      && this.TripulacionForm.controls.Cargar_Certificado_MedicoFile.dirty) {
      const Cargar_Certificado_Medico = this.TripulacionForm.controls.Cargar_Certificado_MedicoFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Certificado_Medico);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Certificado_Medico.name,
        Date_Time: Cargar_Certificado_Medico.lastModifiedDate,
        File_Size: Cargar_Certificado_Medico.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Certificado_Medico > 0 ? this.model.Cargar_Certificado_Medico : 0;
    }
  }

  Cargar_Certificado_MedicoUrl() {
    if (this.fileCargar_Certificado_Medico)
      return this.spartanFileService.url(this.fileCargar_Certificado_Medico.File_Id.toString(), this.fileCargar_Certificado_Medico.Description);
    return '#';
  }

  getCargar_Certificado_Medico() {
    this.helperService.dowloadFile(this.fileCargar_Certificado_Medico.base64, this.Cargar_Certificado_MedicoName);
  }


  closeWindowCancel(): void {
    console.log(this.TripulacionForm)
    //window.close();
  }

  closeWindowSave(): void {
    setTimeout(() => { window.close(); }, 2000);
  }

  removeCargar_Certificado_Medico() {
    this.Cargar_Certificado_MedicoName = '';
    this.model.Cargar_Certificado_Medico = 0;
  }
  async saveCargar_Pasaporte_1(): Promise<number> {
    if (this.TripulacionForm.controls.Cargar_Pasaporte_1File.valid
      && this.TripulacionForm.controls.Cargar_Pasaporte_1File.dirty) {
      const Cargar_Pasaporte_1 = this.TripulacionForm.controls.Cargar_Pasaporte_1File.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Pasaporte_1);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Pasaporte_1.name,
        Date_Time: Cargar_Pasaporte_1.lastModifiedDate,
        File_Size: Cargar_Pasaporte_1.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Pasaporte_1 > 0 ? this.model.Cargar_Pasaporte_1 : 0;
    }
  }

  Cargar_Pasaporte_1Url() {
    if (this.fileCargar_Pasaporte_1)
      return this.spartanFileService.url(this.fileCargar_Pasaporte_1.File_Id.toString(), this.fileCargar_Pasaporte_1.Description);
    return '#';
  }

  getCargar_Pasaporte_1() {
    this.helperService.dowloadFile(this.fileCargar_Pasaporte_1.base64, this.Cargar_Pasaporte_1Name);
  }

  removeCargar_Pasaporte_1() {
    this.Cargar_Pasaporte_1Name = '';
    this.model.Cargar_Pasaporte_1 = 0;
  }
  async saveCargar_Pasaporte_2(): Promise<number> {
    if (this.TripulacionForm.controls.Cargar_Pasaporte_2File.valid
      && this.TripulacionForm.controls.Cargar_Pasaporte_2File.dirty) {
      const Cargar_Pasaporte_2 = this.TripulacionForm.controls.Cargar_Pasaporte_2File.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Pasaporte_2);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Pasaporte_2.name,
        Date_Time: Cargar_Pasaporte_2.lastModifiedDate,
        File_Size: Cargar_Pasaporte_2.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Pasaporte_2 > 0 ? this.model.Cargar_Pasaporte_2 : 0;
    }
  }

  Cargar_Pasaporte_2Url() {
    if (this.fileCargar_Pasaporte_2)
      return this.spartanFileService.url(this.fileCargar_Pasaporte_2.File_Id.toString(), this.fileCargar_Pasaporte_2.Description);
    return '#';
  }

  getCargar_Pasaporte_2() {
    this.helperService.dowloadFile(this.fileCargar_Pasaporte_2.base64, this.Cargar_Pasaporte_2Name);
  }

  removeCargar_Pasaporte_2() {
    this.Cargar_Pasaporte_2Name = '';
    this.model.Cargar_Pasaporte_2 = 0;
  }
  async saveCargar_Visa_1(): Promise<number> {
    if (this.TripulacionForm.controls.Cargar_Visa_1File.valid
      && this.TripulacionForm.controls.Cargar_Visa_1File.dirty) {
      const Cargar_Visa_1 = this.TripulacionForm.controls.Cargar_Visa_1File.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Visa_1);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Visa_1.name,
        Date_Time: Cargar_Visa_1.lastModifiedDate,
        File_Size: Cargar_Visa_1.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Visa_1 > 0 ? this.model.Cargar_Visa_1 : 0;
    }
  }

  Cargar_Visa_1Url() {
    if (this.fileCargar_Visa_1)
      return this.spartanFileService.url(this.fileCargar_Visa_1.File_Id.toString(), this.fileCargar_Visa_1.Description);
    return '#';
  }

  getCargar_Visa_1() {
    this.helperService.dowloadFile(this.fileCargar_Visa_1.base64, this.Cargar_Visa_1Name);
  }

  removeCargar_Visa_1() {
    this.Cargar_Visa_1Name = '';
    this.model.Cargar_Visa_1 = 0;
  }
  async saveCargar_Visa_2(): Promise<number> {
    if (this.TripulacionForm.controls.Cargar_Visa_2File.valid
      && this.TripulacionForm.controls.Cargar_Visa_2File.dirty) {
      const Cargar_Visa_2 = this.TripulacionForm.controls.Cargar_Visa_2File.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Visa_2);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Visa_2.name,
        Date_Time: Cargar_Visa_2.lastModifiedDate,
        File_Size: Cargar_Visa_2.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Visa_2 > 0 ? this.model.Cargar_Visa_2 : 0;
    }
  }

  Cargar_Visa_2Url() {
    if (this.fileCargar_Visa_2)
      return this.spartanFileService.url(this.fileCargar_Visa_2.File_Id.toString(), this.fileCargar_Visa_2.Description);
    return '#';
  }

  getCargar_Visa_2() {
    this.helperService.dowloadFile(this.fileCargar_Visa_2.base64, this.Cargar_Visa_2Name);
  }

  removeCargar_Visa_2() {
    this.Cargar_Visa_2Name = '';
    this.model.Cargar_Visa_2 = 0;
  }

  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      this.TripulacionForm.enable();
      const entity = this.TripulacionForm.value;
      entity.Clave = this.model.Clave;
      entity.Nombres = this.TripulacionForm.get('Nombres').value;
      entity.Apellido_paterno = this.TripulacionForm.get('Apellido_paterno').value;
      entity.Apellido_materno = this.TripulacionForm.get('Apellido_materno').value;
      entity.Estatus = this.TripulacionForm.get('Estatus').value;
      entity.Tipo_de_Tripulante = this.TripulacionForm.controls['Tipo_de_Tripulante'].value;
      entity.Nombre_completo = this.TripulacionForm.get('Nombre_completo').value;
      entity.Direccion = this.TripulacionForm.get('Direccion').value;
      entity.Telefono = this.TripulacionForm.get('Telefono').value;
      entity.Celular = this.TripulacionForm.get('Celular').value;
      entity.Correo_electronico = this.TripulacionForm.get('Correo_electronico').value;
      entity.Fecha_de_nacimiento = this.TripulacionForm.get('Fecha_de_nacimiento').value;
      entity.Edad = this.TripulacionForm.get('Edad').value;
      if (this.TripulacionForm.get('Usuario_Relacionado').value) entity.Usuario_Relacionado = this.TripulacionForm.get('Usuario_Relacionado').value.Clave;
      // if (this.TripulacionForm.get('Nacionalidad_1').value?.Clave == 0 || this.TripulacionForm.get('Nacionalidad_1').value?.Clave == null) { entity.Nacionalidad_1 = null; } else { entity.Nacionalidad_1 = this.TripulacionForm.get('Nacionalidad_1').value["Clave"]; }
      // if (this.TripulacionForm.get('Nacionalidad_2').value?.Clave == 0 || this.TripulacionForm.get('Nacionalidad_2').value?.Clave == null) { entity.Nacionalidad_2 = null; } else { entity.Nacionalidad_2 = this.TripulacionForm.get('Nacionalidad_2').value["Clave"]; }
      // if (entity.Pais_1 == 0 || entity.Pais_1 == null) delete entity.Pais_1; else { entity.Pais_1 = this.TripulacionForm.get('Pais_1').value.Clave; }
      // if (entity.Pais_2 == 0 || entity.Pais_2 == null) delete entity.Pais_2; else { entity.Pais_2 = this.TripulacionForm.get('Pais_2').value.Clave; }
      // if (entity.Pais_3 == 0 || entity.Pais_3 == null) delete entity.Pais_3; else { entity.Pais_3 = this.TripulacionForm.get('Pais_3').value.Clave; }
      // if (entity.Pais_4 == 0 || entity.Pais_4 == null) delete entity.Pais_4; else { entity.Pais_4 = this.TripulacionForm.get('Pais_4').value.Clave; }
      if (this.TripulacionForm.get('Nacionalidad_1').value) entity.Nacionalidad_1 = this.TripulacionForm.get('Nacionalidad_1').value.Clave;
      if (this.TripulacionForm.get('Nacionalidad_2').value) entity.Nacionalidad_2 = this.TripulacionForm.get('Nacionalidad_2').value.Clave;
      if (this.TripulacionForm.get('Pais_1').value) entity.Pais_1 = this.TripulacionForm.get('Pais_1').value.Clave;
      if (this.TripulacionForm.get('Pais_2').value) entity.Pais_2 = this.TripulacionForm.get('Pais_2').value.Clave;
      if (this.TripulacionForm.get('Pais_3').value) entity.Pais_3 = this.TripulacionForm.get('Pais_3').value.Clave;
      if (this.TripulacionForm.get('Pais_4').value) entity.Pais_4 = this.TripulacionForm.get('Pais_4').value.Clave;
      if (entity.Ciudad == 0 || entity.Ciudad == null) delete entity.Ciudad;
      if (entity.Ciudad_mas_cercana == 0 || entity.Ciudad_mas_cercana == null) delete entity.Ciudad_mas_cercana;


      const FolioFotografia = await this.saveFotografia();
      entity.Fotografia = FolioFotografia > 0 ? FolioFotografia : null;
      const FolioCargar_Licencia = await this.saveCargar_Licencia();
      entity.Cargar_Licencia = FolioCargar_Licencia > 0 ? FolioCargar_Licencia : null;
      const FolioCargar_Certificado_Medico = await this.saveCargar_Certificado_Medico();
      entity.Cargar_Certificado_Medico = FolioCargar_Certificado_Medico > 0 ? FolioCargar_Certificado_Medico : null;
      const FolioCargar_Pasaporte_1 = await this.saveCargar_Pasaporte_1();
      entity.Cargar_Pasaporte_1 = FolioCargar_Pasaporte_1 > 0 ? FolioCargar_Pasaporte_1 : null;
      const FolioCargar_Pasaporte_2 = await this.saveCargar_Pasaporte_2();
      entity.Cargar_Pasaporte_2 = FolioCargar_Pasaporte_2 > 0 ? FolioCargar_Pasaporte_2 : null;
      const FolioCargar_Visa_1 = await this.saveCargar_Visa_1();
      entity.Cargar_Visa_1 = FolioCargar_Visa_1 > 0 ? FolioCargar_Visa_1 : null;
      const FolioCargar_Visa_2 = await this.saveCargar_Visa_2();
      entity.Cargar_Visa_2 = FolioCargar_Visa_2 > 0 ? FolioCargar_Visa_2 : null;

      if (this.model.Clave > 0) {
        await this.TripulacionService.update(this.model.Clave, entity).toPromise();

        await this.saveTripulacion_Aeronave(this.model.Clave);
        await this.saveDetalle_Cursos_de_Tripulacion(this.model.Clave);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Clave.toString());
        this.rulesAfterSave();
        this.isLoading = false;
        this.spinner.hide('loading');
        return this.model.Clave;
      } else {
        await (this.TripulacionService.insert(entity).toPromise().then(async id => {
          await this.saveTripulacion_Aeronave(id);
          await this.saveDetalle_Cursos_de_Tripulacion(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          this.rulesAfterSave();
          this.isLoading = false;
          this.spinner.hide('loading');
          return id;
        }));
      }
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });

    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Clave === 0) {
      this.TripulacionForm.reset();
      this.model = new Tripulacion(this.fb);
      this.TripulacionForm = this.model.buildFormGroup();
      this.dataSourceAeronaves = new MatTableDataSource<Tripulacion_Aeronave>();
      this.AeronavesData = [];
      this.dataSourceCursos = new MatTableDataSource<Detalle_Cursos_de_Tripulacion>();
      this.CursosData = [];

    } else {
      this.router.navigate(['views/Tripulacion/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Clave = 0;

  }

  cancel() {
    this.closeWindowCancel()
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Tripulacion/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Nombres_ExecuteBusinessRules(): void {
    //Nombres_FieldExecuteBusinessRulesEnd
  }
  Apellido_paterno_ExecuteBusinessRules(): void {
    //Apellido_paterno_FieldExecuteBusinessRulesEnd
  }
  Apellido_materno_ExecuteBusinessRules(): void {
    //Apellido_materno_FieldExecuteBusinessRulesEnd
  }
  Nombre_completo_ExecuteBusinessRules(): void {

    //INICIA - BRID:1446 - Cargar datos de usuario al change de nombre completo - Autor: Administrador - Actualización: 3/11/2021 1:05:43 PM
    this.brf.SetValueFromQuery(this.TripulacionForm, "Direccion", this.brf.EvaluaQuery(" SELECT Direccion FROM Creacion_de_Usuarios WHERE Nombre_completo = 'FLD[Nombre_completo]'", 1, "ABC123"), 1, "ABC123"); this.brf.SetValueFromQuery(this.TripulacionForm, "Telefono", this.brf.EvaluaQuery(" SELECT Telefono FROM Creacion_de_Usuarios WHERE Nombre_completo = 'FLD[Nombre_completo]'", 1, "ABC123"), 1, "ABC123"); this.brf.SetValueFromQuery(this.TripulacionForm, "Celular", this.brf.EvaluaQuery(" SELECT Celular FROM Creacion_de_Usuarios WHERE Nombre_completo = 'FLD[Nombre_completo]'", 1, "ABC123"), 1, "ABC123"); this.brf.SetValueFromQuery(this.TripulacionForm, "Correo_electronico", this.brf.EvaluaQuery(" SELECT Correo_electronico FROM Creacion_de_Usuarios WHERE Nombre_completo = 'FLD[Nombre_completo]'", 1, "ABC123"), 1, "ABC123"); this.brf.SetValueFromQuery(this.TripulacionForm, "Fecha_de_nacimiento", this.brf.EvaluaQuery(" SELECT convert (varchar(11),Fecha_de_Nacimiento,105) FROM Creacion_de_Usuarios WHERE Nombre_completo = 'FLD[Nombre_completo]'", 1, "ABC123"), 1, "ABC123");
    //TERMINA - BRID:1446

    //Nombre_completo_FieldExecuteBusinessRulesEnd

  }
  Direccion_ExecuteBusinessRules(): void {
    //Direccion_FieldExecuteBusinessRulesEnd
  }
  Telefono_ExecuteBusinessRules(): void {
    //Telefono_FieldExecuteBusinessRulesEnd
  }
  Celular_ExecuteBusinessRules(): void {
    //Celular_FieldExecuteBusinessRulesEnd
  }
  Correo_electronico_ExecuteBusinessRules(): void {
    //Correo_electronico_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_nacimiento_ExecuteBusinessRules(): void {

    //INICIA - BRID:296 - Asignar valor a edad - Autor: Felipe Rodríguez - Actualización: 2/10/2021 3:16:22 PM
    //this.brf.SetValueFromQuery(this.TripulacionForm, "Edad", this.brf.EvaluaQuery(" DECLARE @date date, @tmpdate date, @years int @LC@@LB@ SELECT @date = convert(date,(convert(varchar(10),'FLD[Fecha_de_nacimiento]',103)),103) @LC@@LB@ SELECT @tmpdate = @date @LC@@LB@ SELECT @years = DATEDIFF(yy, @tmpdate, GETDATE()) - CASE WHEN (MONTH(@date) > MONTH(GETDATE())) OR (MONTH(@date) = MONTH(GETDATE()) AND DAY(@date) > DAY(GETDATE())) @LC@@LB@ THEN 1 @LC@@LB@ ELSE 0 @LC@@LB@ END @LC@@LB@ SELECT @tmpdate = DATEADD(yy, @years, @tmpdate) @LC@@LB@ SELECT @years", 1, "ABC123"), 1, "ABC123");
    //TERMINA - BRID:296
    if (!this.TripulacionForm.controls['Fecha_de_Nacimiento'].value) return;
    let fecha = this.TripulacionForm.controls['Fecha_de_Nacimiento'].value//.toLocaleDateString();
    // this.brf.SetValueControl(this.Creacion_de_UsuariosForm, "Edad",
    //   await this.brf.EvaluaQueryAsync(`exec usptemporalidad '${fecha}'`, 1, "ABC123"));
    //this.calculateAge()
    //TERMINA - BRID:1435
    this.brf.SetValueControl(this.TripulacionForm, "Edad",this.calcularAñosMes(fecha));
    
  

    //INICIA - BRID:297 - No permitir fecha futura en tripulación - Autor: Felipe Rodríguez - Actualización: 2/10/2021 3:18:52 PM
    if (this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),GETDATE(),103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_nacimiento]',103),103))@LC@@LB@ ", 1, 'ABC123') > this.brf.TryParseInt('0', '0')) { this.brf.ShowMessage("Fecha de nacimiento inválida."); } else { }
    //TERMINA - BRID:297

    //Fecha_de_nacimiento_FieldExecuteBusinessRulesEnd


  }

  calcularAñosMes(f) {
    const fecha = moment(f);
    const fechaActual  = moment(this.today)
    let años = fechaActual.diff(fecha, "years")
    let meses = Math.trunc(((fechaActual.diff(fecha, "years",true)-años)+0.0001)*12)
    if(meses == 12){
        meses = 0;
        años += 1;
      }
    return años;
  } 

  Edad_ExecuteBusinessRules(): void {
    //Edad_FieldExecuteBusinessRulesEnd
  }
  Nacionalidad_1_ExecuteBusinessRules(): void {
    //Nacionalidad_1_FieldExecuteBusinessRulesEnd
  }
  Nacionalidad_2_ExecuteBusinessRules(): void {
    //Nacionalidad_2_FieldExecuteBusinessRulesEnd
  }
  Genero_ExecuteBusinessRules(): void {
    //Genero_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Tripulante_ExecuteBusinessRules(): void {
    //Tipo_de_Tripulante_FieldExecuteBusinessRulesEnd
  }
  Pertenece_al_grupo_ExecuteBusinessRules(): void {
    //Pertenece_al_grupo_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  Usuario_Relacionado_ExecuteBusinessRules(): void {
    //Usuario_Relacionado_FieldExecuteBusinessRulesEnd
  }
  Fotografia_ExecuteBusinessRules(): void {
    //Fotografia_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Licencia_ExecuteBusinessRules(): void {
    //Numero_de_Licencia_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Emision_Licencia_ExecuteBusinessRules(): void {

    //INICIA - BRID:1455 - Fecha de vencimiento no puede ser menor oigual a la fecha de emision - Autor: Ivan Yañez - Actualización: 3/15/2021 10:22:31 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_licencia]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Licencia]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage("La fecha de vencimiento no puede ser menor o igual a la fecha de emisión "); } else { }
    //TERMINA - BRID:1455
    if(!this.TripulacionForm.controls['Fecha_de_Emision_Licencia'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_Emision_Licencia'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_Emision_Licencia'].setValue('');
      return;
    }
    //Fecha_de_Emision_Licencia_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_licencia_ExecuteBusinessRules(): void {

    //INICIA - BRID:1454 - Fecha de vencimiento no peude ser menor o igual a la fecha de emision. - Autor: Ivan Yañez - Actualización: 3/15/2021 10:16:27 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_licencia]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Licencia]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la  fecha de emisión "); } else { }
    //TERMINA - BRID:1454
    if(!this.TripulacionForm.controls['Fecha_de_vencimiento_licencia'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_vencimiento_licencia'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_vencimiento_licencia'].setValue('');
      return;
    }
    //Fecha_de_vencimiento_licencia_FieldExecuteBusinessRulesEnd

  }
  Alerta_de_vencimiento_licencia_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_licencia_FieldExecuteBusinessRulesEnd
  }
  Cargar_Licencia_ExecuteBusinessRules(): void {
    //Cargar_Licencia_FieldExecuteBusinessRulesEnd
  }
  Certificado_Medico_ExecuteBusinessRules(): void {
    //Certificado_Medico_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Emision_Certificado_ExecuteBusinessRules(): void {

    //INICIA - BRID:1457 - La fecha de vencimiento certificado no puede ser menor o igual a la fecha de emisión.. - Autor: Ivan Yañez - Actualización: 3/15/2021 10:28:53 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_certificado]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Certificado]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión"); } else { }
    //TERMINA - BRID:1457
    if(!this.TripulacionForm.controls['Fecha_de_Emision_Certificado'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_Emision_Certificado'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_Emision_Certificado'].setValue('');
      return;
    }
    //Fecha_de_Emision_Certificado_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_certificado_ExecuteBusinessRules(): void {

    //INICIA - BRID:1456 - La fecha de vencimiento certificado no puede ser menor o igual a la fecha de emisión . - Autor: Ivan Yañez - Actualización: 3/15/2021 10:27:22 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_certificado]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Certificado]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage("  Fecha de vencimiento no puede ser menor oigual a la fecha de emision"); } else { }
    //TERMINA - BRID:1456
    if(!this.TripulacionForm.controls['Fecha_de_vencimiento_certificado'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_vencimiento_certificado'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_vencimiento_certificado'].setValue('');
      return;
    }
    //Fecha_de_vencimiento_certificado_FieldExecuteBusinessRulesEnd

  }
  Alerta_de_vencimiento_certificado_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_certificado_FieldExecuteBusinessRulesEnd
  }
  Cargar_Certificado_Medico_ExecuteBusinessRules(): void {
    //Cargar_Certificado_Medico_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Pasaporte_1_ExecuteBusinessRules(): void {

    // //INICIA - BRID:1862 - requerido el campo documento pasaporte 1 - Autor: Administrador - Actualización: 3/19/2021 10:19:32 AM
    // if (this.brf.GetValueByControlType(this.TripulacionForm, 'Numero_de_Pasaporte_1') != this.brf.TryParseInt('', '')) { this.brf.SetRequiredControl(this.TripulacionForm, "Cargar_Pasaporte_1"); } else { this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Pasaporte_1"); }
    // //TERMINA - BRID:1862

    //Numero_de_Pasaporte_1_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_Emision_Pasaporte_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1458 - La fecha de vencimiento pasaporte 1 no puede ser menor o igual a la fecha de emisión. - Autor: Ivan Yañez - Actualización: 3/15/2021 10:33:07 AM
    
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Pasaporte_1]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Pasaporte_1]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión"); } else { }
    //TERMINA - BRID:1458
    if(!this.TripulacionForm.controls['Fecha_de_Emision_Pasaporte_1'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_Emision_Pasaporte_1'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_Emision_Pasaporte_1'].setValue('');
      return;
    }
    //Fecha_de_Emision_Pasaporte_1_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_Pasaporte_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1459 - La fecha de vencimiento pasaporte 1  no puede ser menor o igual a la fecha de emisión.. - Autor: Ivan Yañez - Actualización: 3/15/2021 10:35:04 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Pasaporte_1]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Pasaporte_1]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión"); } else { }
    //TERMINA - BRID:1459
    if(!this.TripulacionForm.controls['Fecha_de_vencimiento_Pasaporte_1'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_vencimiento_Pasaporte_1'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_vencimiento_Pasaporte_1'].setValue('');
      return;
    }
    //Fecha_de_vencimiento_Pasaporte_1_FieldExecuteBusinessRulesEnd

  }
  Alerta_de_vencimiento_Pasaporte_1_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_Pasaporte_1_FieldExecuteBusinessRulesEnd
  }
  Pais_1_ExecuteBusinessRules(): void {
    //Pais_1_FieldExecuteBusinessRulesEnd
  }
  Cargar_Pasaporte_1_ExecuteBusinessRules(): void {
    //Cargar_Pasaporte_1_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Pasaporte_2_ExecuteBusinessRules(): void {

    // //INICIA - BRID:1863 - requerido documento pasaporte 2 - Autor: Administrador - Actualización: 3/19/2021 10:21:05 AM
    // if (this.brf.GetValueByControlType(this.TripulacionForm, 'Numero_de_Pasaporte_2') != this.brf.TryParseInt('', '')) { this.brf.SetRequiredControl(this.TripulacionForm, "Cargar_Pasaporte_2"); } else { this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Pasaporte_2"); }
    // //TERMINA - BRID:1863

    // //Numero_de_Pasaporte_2_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_Emision_Pasaporte_2_ExecuteBusinessRules(): void {

    //INICIA - BRID:1460 - La fecha de vencimiento pasaporte 2 no puede ser menor o igual a la fecha de emisión  - Autor: Ivan Yañez - Actualización: 3/15/2021 10:38:41 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Pasaporte_2]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Pasaporte_2]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento pasaporte 2 no puede ser menor o igual a la fecha de emisión "); } else { }
    //TERMINA - BRID:1460
    if(!this.TripulacionForm.controls['Fecha_de_Emision_Pasaporte_2'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_Emision_Pasaporte_2'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_Emision_Pasaporte_2'].setValue('');
      return;
    }
    //Fecha_de_Emision_Pasaporte_2_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_Pasaporte_2_ExecuteBusinessRules(): void {

    //INICIA - BRID:1461 - La fecha de vencimiento pasaporte 2 no puede ser menor o igual a la fecha de emisión . - Autor: Ivan Yañez - Actualización: 3/15/2021 10:40:14 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Pasaporte_2]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Pasaporte_2]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento pasaporte 2 no puede ser menor o igual a la fecha de emisión "); } else { }
    //TERMINA - BRID:1461
    if(!this.TripulacionForm.controls['Fecha_de_vencimiento_Pasaporte_2'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_vencimiento_Pasaporte_2'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_vencimiento_Pasaporte_2'].setValue('');
      return;
    }
    //Fecha_de_vencimiento_Pasaporte_2_FieldExecuteBusinessRulesEnd

  }
  Alerta_de_vencimiento_Pasaporte_2_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_Pasaporte_2_FieldExecuteBusinessRulesEnd
  }
  Pais_2_ExecuteBusinessRules(): void {
    //Pais_2_FieldExecuteBusinessRulesEnd
  }
  Cargar_Pasaporte_2_ExecuteBusinessRules(): void {
    //Cargar_Pasaporte_2_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Visa_1_ExecuteBusinessRules(): void {

    // //INICIA - BRID:1864 - requerido documento visa 1 - Autor: Administrador - Actualización: 3/19/2021 10:22:56 AM
    // if (this.brf.GetValueByControlType(this.TripulacionForm, 'Numero_de_Visa_1') != this.brf.TryParseInt('', '')) { this.brf.SetRequiredControl(this.TripulacionForm, "Cargar_Visa_1"); } else { this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Visa_1"); }
    // //TERMINA - BRID:1864

    //Numero_de_Visa_1_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_Emision_visa_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1462 - La fecha de vencimiento visa 1 no puede ser menor o igual a la fecha de emisión - Autor: Ivan Yañez - Actualización: 3/15/2021 10:47:07 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Visa_1]', 105))<= convert(date, 'FLD[Fecha_de_Emision_visa_1]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento visa 1 no puede ser menor o igual a la fecha de emisión"); } else { }
    //TERMINA - BRID:1462
    if(this.TripulacionForm.controls['Fecha_de_Emision_visa_1'].value){
    let fecha = this.TripulacionForm.controls['Fecha_de_Emision_visa_1'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_Emision_visa_1'].setValue('');
      return;
    }}
    //Fecha_de_Emision_visa_1_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_Visa_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1463 - La fecha de vencimiento visa 1 no puede ser menor o igual a la fecha de emisión. - Autor: Ivan Yañez - Actualización: 3/15/2021 10:48:50 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Visa_1]', 105))<= convert(date, 'FLD[Fecha_de_Emision_visa_1]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento visa 1 no puede ser menor o igual a la fecha de emisión"); } else { }
    //TERMINA - BRID:1463
    if(this.TripulacionForm.controls['Fecha_de_vencimiento_Visa_1'].value){
    let fecha = this.TripulacionForm.controls['Fecha_de_vencimiento_Visa_1'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_vencimiento_Visa_1'].setValue('');
      return;
    }}
    //Fecha_de_vencimiento_Visa_1_FieldExecuteBusinessRulesEnd

  }
  Alerta_de_vencimiento_Visa_1_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_Visa_1_FieldExecuteBusinessRulesEnd
  }
  Pais_3_ExecuteBusinessRules(): void {
    //Pais_3_FieldExecuteBusinessRulesEnd
  }
  Cargar_Visa_1_ExecuteBusinessRules(): void {
    //Cargar_Visa_1_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Visa_2_ExecuteBusinessRules(): void {

    // //INICIA - BRID:1865 - requerido documento visa 2 - Autor: Administrador - Actualización: 3/19/2021 10:24:31 AM
    // if (this.brf.GetValueByControlType(this.TripulacionForm, 'Numero_de_Visa_2') != this.brf.TryParseInt('', '')) { this.brf.SetRequiredControl(this.TripulacionForm, "Cargar_Visa_2"); } else { this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Visa_2"); }
    // //TERMINA - BRID:1865

    //Numero_de_Visa_2_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_Emision_Visa_2_ExecuteBusinessRules(): void {

    //INICIA - BRID:1464 - La fecha de vencimiento visa 2 no puede ser menor o igual a la fecha de emisión  - Autor: Ivan Yañez - Actualización: 3/15/2021 10:53:35 AM
  //  if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Visa_2]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Visa_2]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento visa 2 no puede ser menor o igual a la fecha de emisión"); } else { }
    //TERMINA - BRID:1464
    if(!this.TripulacionForm.controls['Fecha_de_Emision_Visa_2'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_Emision_Visa_2'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_Emision_Visa_2'].setValue('');
      return;
    }

    //Fecha_de_Emision_Visa_2_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_Visa_2_ExecuteBusinessRules(): void {

    //INICIA - BRID:1465 - La fecha de vencimiento visa 2 no puede ser menor o igual a la fecha de emisión . - Autor: Ivan Yañez - Actualización: 3/15/2021 10:55:04 AM
    //if (this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Visa_2]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Visa_2]',105)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) { this.brf.ShowMessage(" La fecha de vencimiento visa 2 no puede ser menor o igual a la fecha de emisión "); } else { }
    //TERMINA - BRID:1465
    //Fecha_de_vencimiento_Visa_2_FieldExecuteBusinessRulesEnd
    if(!this.TripulacionForm.controls['Fecha_de_vencimiento_Visa_2'].value)return;
    let fecha = this.TripulacionForm.controls['Fecha_de_vencimiento_Visa_2'].value
       
    if(fecha.toISOString().includes('+')) {
      this.TripulacionForm.controls['Fecha_de_vencimiento_Visa_2'].setValue('');
      return;
    }

  }
  Alerta_de_vencimiento_Visa_2_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_Visa_2_FieldExecuteBusinessRulesEnd
  }
  Pais_4_ExecuteBusinessRules(): void {
    //Pais_4_FieldExecuteBusinessRulesEnd
  }
  Cargar_Visa_2_ExecuteBusinessRules(): void {
    //Cargar_Visa_2_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:295 - Deshabilitar control de campo nombre completo y edad - Autor: Felipe Rodríguez - Actualización: 2/10/2021 3:09:58 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.TripulacionForm, 'Edad', 0);
      this.brf.SetEnabledControl(this.TripulacionForm, 'Nombre_completo', 0);
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Edad");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Nombre_completo");
    }
    //TERMINA - BRID:295


    //INICIA - BRID:1447 - Regla de negocio para quitar campos obligatorios al cargar - Autor: Administrador - Actualización: 3/11/2021 1:34:02 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //this.brf.SetNotRequiredControl(this.TripulacionForm, "Nacionalidad_2");
       this.brf.SetNotRequiredControl(this.TripulacionForm, "Numero_de_Pasaporte_2");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_vencimiento_pasaporte_2");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Alerta_de_vencimiento_pasaporte_2");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Pais_2");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Numero_de_Visa_2");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_vencimiento_visa_2");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Alerta_de_vencimiento_visa_2");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Visa_2");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_Emision_Visa_2");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Pasaporte_2");
    }
    //TERMINA - BRID:1447


    //INICIA - BRID:1451 - no requeridos los campos de la pestaña documentos - Autor: Administrador - Actualización: 3/12/2021 9:38:01 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Numero_de_Pasaporte_1");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_vencimiento_Pasaporte_1");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Alerta_de_vencimiento_Pasaporte_1");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Pasaporte_1File");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Numero_de_Pasaporte_2");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_vencimiento_Pasaporte_2");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Alerta_de_vencimiento_Pasaporte_2");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Pais_1");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Numero_de_Visa_1");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_vencimiento_Visa_1");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Alerta_de_vencimiento_Visa_1");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Visa_1File");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Pais_2");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Numero_de_Visa_2");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_vencimiento_Visa_2");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Alerta_de_vencimiento_Visa_2");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Visa_2File");
      //this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_Emision_Pasaporte_1");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_Emision_visa_1");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_Emision_Visa_2");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Pais_4");
      this.brf.SetNotRequiredControl(this.TripulacionForm, "Cargar_Pasaporte_2File");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Fecha_de_Emision_Pasaporte_2");
      // this.brf.SetNotRequiredControl(this.TripulacionForm, "Pais_3");
    }
    //TERMINA - BRID:1451


    //INICIA - BRID:1885 - Regla para ocultar usuario relacionado - Autor: Administrador - Actualización: 3/22/2021 4:11:51 PM
    this.brf.HideFieldOfForm(this.TripulacionForm, "Usuario_Relacionado");
    this.brf.SetNotRequiredControl(this.TripulacionForm, "Usuario_Relacionado");
    //TERMINA - BRID:1885


    //INICIA - BRID:1886 - Regla para deshabilitar campos que se deben llenar desde usuarios - Autor: Administrador - Actualización: 3/23/2021 12:06:31 PM
    this.brf.SetEnabledControl(this.TripulacionForm, 'Nombres', 0); this.brf.SetEnabledControl(this.TripulacionForm, 'Apellido_paterno', 0);
    this.brf.SetEnabledControl(this.TripulacionForm, 'Apellido_materno', 0); this.brf.SetEnabledControl(this.TripulacionForm, 'Direccion', 0);
    this.brf.SetEnabledControl(this.TripulacionForm, 'Telefono', 0);
    this.brf.SetEnabledControl(this.TripulacionForm, 'Celular', 0);
    this.brf.SetEnabledControl(this.TripulacionForm, 'Correo_electronico', 0); this.brf.SetEnabledControl(this.TripulacionForm, 'Fecha_de_nacimiento', 0);
    this.brf.SetEnabledControl(this.TripulacionForm, 'Edad', 0); this.brf.SetEnabledControl(this.TripulacionForm, 'Estatus', 0);
    this.brf.SetEnabledControl(this.TripulacionForm, 'Tipo_de_Tripulante', 0);
    //TERMINA - BRID:1886

    //INICIA - BRID:5616 - Variable sesion para traer cursos al abrir - Autor: Aaron - Actualización: 9/2/2021 3:22:53 PM
    if (this.operation == 'Update') {
      this.brf.CreateSessionVar("Cursos_Inicio", this.brf.EvaluaQuery(" Select Count(*) From Detalle_Cursos_de_Tripulacion Where IdTripulacion = 'FLDD[lblClave]'", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:5616
    //rulesOnInit_ExecuteBusinessRulesEnd


  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:5617 - Enviar Notificacion Push - Autor: Aaron - Actualización: 9/2/2021 3:42:37 PM
    if (this.operation == 'Update') {
      //if( this.brf.EvaluaQuery("SELECT GLOBAL[Cursos_Inicio]", 1, 'ABC123')<this.brf.EvaluaQuery("Select Count(*) From Detalle_Cursos_de_Tripulacion Where IdTripulacion = 'FLDD[lblClave]'", 1, 'ABC123') ) { this.brf.SendNotificationPush(this.brf.EvaluaQuery("Select 'Nuevo curso registrado'", ""ABC123""), this.brf.EvaluaQuery("Select C.Usuario_Registrado from Tripulacion  T Inner Join Creacion_de_Usuarios C ON C.Clave = T.Usuario_Relacionado WHERE T.Clave =  'FLDD[lblClave]'", 1, "ABC123") ,this.brf.EvaluaQuery("select '{\"id\":\"FLDD[lblClave]\"}'", 1, "ABC123"), this.brf.EvaluaQuery("SELECT 'Se ha agregado un nuevo curso.'", 1, "ABC123"),"null");} else {}
    }
    //TERMINA - BRID:5617
    this.goToList();

    //rulesAfterSave_ExecuteBusinessRulesEnd

  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    if(this.isAeronaveOpen) {
      alert("Has dejado un renglón sin guardar en Aeronaves");
      result = false;
    }
    if(this.isCursoOpen) {
      alert("Has dejado un renglón sin guardar en Cursos");
      result = false;
    }
    return result;
  }

  //Fin de reglas

}
