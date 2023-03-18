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
import { Configuracion_de_tecnicos_e_inspectoresService } from 'src/app/api-services/Configuracion_de_tecnicos_e_inspectores.service';
import { Configuracion_de_tecnicos_e_inspectores } from 'src/app/models/Configuracion_de_tecnicos_e_inspectores';
import { CargosService } from 'src/app/api-services/Cargos.service';
import { Cargos } from 'src/app/models/Cargos';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Tecnico_AeronaveService } from 'src/app/api-services/Tecnico_Aeronave.service';
import { Tecnico_Aeronave } from 'src/app/models/Tecnico_Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';

import { Creacion_de_UsuariosService } from 'src/app/api-services/Creacion_de_Usuarios.service';
import { Creacion_de_Usuarios } from 'src/app/models/Creacion_de_Usuarios';
import { PaisService } from 'src/app/api-services/Pais.service';
import { Pais } from 'src/app/models/Pais';
import { Detalle_de_Documentos_CursosService } from 'src/app/api-services/Detalle_de_Documentos_Cursos.service';
import { Detalle_de_Documentos_Cursos } from 'src/app/models/Detalle_de_Documentos_Cursos';
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

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Configuracion_de_tecnicos_e_inspectores',
  templateUrl: './Configuracion_de_tecnicos_e_inspectores.component.html',
  styleUrls: ['./Configuracion_de_tecnicos_e_inspectores.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Configuracion_de_tecnicos_e_inspectoresComponent implements OnInit, AfterViewInit {
MRaddCursos: boolean = false;
MRaddAeronaves: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Configuracion_de_tecnicos_e_inspectoresForm: FormGroup;
	public Editor = ClassicEditor;
	model: Configuracion_de_tecnicos_e_inspectores;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varCargos: Cargos[] = [];
	public varSpartan_User: Spartan_User[] = [];
	public varAeronave: Aeronave[] = [];

  autoAeronave_Tecnico_Aeronave = new FormControl();
  SelectedAeronave_Tecnico_Aeronave: string[] = [];
  isLoadingAeronave_Tecnico_Aeronave: boolean;
  searchAeronave_Tecnico_AeronaveCompleted: boolean;

	optionsUsuario_Relacionado: Observable<Creacion_de_Usuarios[]>;
	hasOptionsUsuario_Relacionado: boolean;
	isLoadingUsuario_Relacionado: boolean;
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
  Documento_Detalle_de_Documentos_Cursos: string[] = [];

  autoModelo_Detalle_de_Documentos_Cursos = new FormControl();
  SelectedModelo_Detalle_de_Documentos_Cursos: string[] = [];
  isLoadingModelo_Detalle_de_Documentos_Cursos: boolean;
  searchModelo_Detalle_de_Documentos_CursosCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;


  @ViewChild('PaginadorAeronaves', { read: MatPaginator }) paginadorAeronaves: MatPaginator;
  @ViewChild('PaginadorCursos', { read: MatPaginator }) paginadorCursos: MatPaginator;


	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceAeronaves = new MatTableDataSource<Tecnico_Aeronave>();
  AeronavesColumns = [
    { def: 'actions', hide: false },
    { def: 'Aeronave', hide: false },
	
  ];
  AeronavesData: Tecnico_Aeronave[] = [];
  dataSourceCursos = new MatTableDataSource<Detalle_de_Documentos_Cursos>();
  CursosColumns = [
    { def: 'actions', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Tipo_de_curso', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Fecha_de_Vencimiento', hide: false },
    { def: 'Documento', hide: false },
	
  ];
  CursosData: Detalle_de_Documentos_Cursos[] = [];
	
	today = new Date;
	consult: boolean = false;
  showButtonMR: boolean = true;
  maxDate = new Date(2200, 0, 1);
  Pais1Seleccionado: any = null;
  Pais2Seleccionado: any = null;
  Pais3Seleccionado: any = null;
  Pais4Seleccionado: any = null;
  requiredPasaporte1: boolean = false;
  requiredPasaporte2: boolean = false;
  requiredVisa1: boolean = false;
  requiredVisa2: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Configuracion_de_tecnicos_e_inspectoresService: Configuracion_de_tecnicos_e_inspectoresService,
    private CargosService: CargosService,
    private Spartan_UserService: Spartan_UserService,
    private Tecnico_AeronaveService: Tecnico_AeronaveService,
    private AeronaveService: AeronaveService,

    private Creacion_de_UsuariosService: Creacion_de_UsuariosService,
    private PaisService: PaisService,
    private Detalle_de_Documentos_CursosService: Detalle_de_Documentos_CursosService,
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
    this.model = new Configuracion_de_tecnicos_e_inspectores(this.fb);
    this.Configuracion_de_tecnicos_e_inspectoresForm = this.model.buildFormGroup();
    this.AeronavesItems.removeAt(0);
    this.CursosItems.removeAt(0);
	
	this.Configuracion_de_tecnicos_e_inspectoresForm.get('Folio').disable();
    this.Configuracion_de_tecnicos_e_inspectoresForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  getCountAeronaves(): number {
    return this.dataSourceAeronaves.data.length;
  }

  getCountCursos(): number {
    return this.dataSourceCursos.data.length;
  }
  
  ngAfterViewInit(): void {
    this.dataSourceAeronaves.paginator = this.paginadorAeronaves;
    this.dataSourceCursos.paginator = this.paginadorCursos;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.AeronavesColumns.splice(0, 1);
          this.CursosColumns.splice(0, 1);
		
          this.Configuracion_de_tecnicos_e_inspectoresForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Configuracion_de_tecnicos_e_inspectores)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Usuario_Relacionado', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	// this.brf.updateValidatorsToControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Pais_1', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	// this.brf.updateValidatorsToControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Pais_2', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	// this.brf.updateValidatorsToControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Pais_3', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	// this.brf.updateValidatorsToControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Pais_4', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Configuracion_de_tecnicos_e_inspectoresService.listaSelAll(0, 1, 'Configuracion_de_tecnicos_e_inspectores.Folio=' + id).toPromise();
	if (result.Configuracion_de_tecnicos_e_inspectoress.length > 0) {

        if(result.Configuracion_de_tecnicos_e_inspectoress[0].Numero_de_Pasaporte_1 != null && 
            result.Configuracion_de_tecnicos_e_inspectoress[0].Numero_de_Pasaporte_1.length > 0) {
          this.requiredPasaporte1 = true;
        }
        if(result.Configuracion_de_tecnicos_e_inspectoress[0].Numero_de_Pasaporte_2 != null && 
          result.Configuracion_de_tecnicos_e_inspectoress[0].Numero_de_Pasaporte_2.length > 0) {
          this.requiredPasaporte2 = true;
        }
        if(result.Configuracion_de_tecnicos_e_inspectoress[0].Numero_de_Visa_1 != null && 
          result.Configuracion_de_tecnicos_e_inspectoress[0].Numero_de_Visa_1.length > 0) {
          this.requiredVisa1 = true;
        }
        if(result.Configuracion_de_tecnicos_e_inspectoress[0].Numero_de_Visa_2 != null && 
          result.Configuracion_de_tecnicos_e_inspectoress[0].Numero_de_Visa_2.length > 0) {
          this.requiredVisa2 = true;
        }

        let fAeronaves = await this.Tecnico_AeronaveService.listaSelAll(0, 1000,'Configuracion_de_tecnicos_e_inspectores.Folio=' + id).toPromise();
            this.AeronavesData = fAeronaves.Tecnico_Aeronaves;
            this.loadAeronaves(fAeronaves.Tecnico_Aeronaves);
            this.dataSourceAeronaves = new MatTableDataSource(fAeronaves.Tecnico_Aeronaves);
            this.dataSourceAeronaves.paginator = this.paginadorAeronaves;
            this.dataSourceAeronaves.sort = this.sort;
        let fCursos = await this.Detalle_de_Documentos_CursosService.listaSelAll(0, 1000,'Configuracion_de_tecnicos_e_inspectores.Folio=' + id).toPromise();
            this.CursosData = fCursos.Detalle_de_Documentos_Cursoss;
            this.loadCursos(fCursos.Detalle_de_Documentos_Cursoss);
            this.dataSourceCursos = new MatTableDataSource(fCursos.Detalle_de_Documentos_Cursoss);
            this.dataSourceCursos.paginator = this.paginadorCursos;
            this.dataSourceCursos.sort = this.sort;
	  
        this.model.fromObject(result.Configuracion_de_tecnicos_e_inspectoress[0]);
        this.Configuracion_de_tecnicos_e_inspectoresForm.get('Usuario_Relacionado').setValue(
          result.Configuracion_de_tecnicos_e_inspectoress[0].Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo,
          { onlySelf: false, emitEvent: true }
        );
        if (this.model.Cargar_Licencia !== null && this.model.Cargar_Licencia !== undefined) {
          this.spartanFileService.getById(this.model.Cargar_Licencia).subscribe(f => {
            this.fileCargar_Licencia = f;
            this.Cargar_LicenciaName = f.Description;
            this.Configuracion_de_tecnicos_e_inspectoresForm.controls['Cargar_LicenciaFile'].setErrors(null);
          });
        }
        if (this.model.Cargar_Certificado_Medico !== null && this.model.Cargar_Certificado_Medico !== undefined) {
          this.spartanFileService.getById(this.model.Cargar_Certificado_Medico).subscribe(f => {
            this.fileCargar_Certificado_Medico = f;
            this.Cargar_Certificado_MedicoName = f.Description;
          });
        }
        this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_1').setValue(
          result.Configuracion_de_tecnicos_e_inspectoress[0].Pais_1_Pais.Nombre,
          { onlySelf: false, emitEvent: true }
        );
        if (this.model.Cargar_Pasaporte_1 !== null && this.model.Cargar_Pasaporte_1 !== undefined) {
          this.spartanFileService.getById(this.model.Cargar_Pasaporte_1).subscribe(f => {
            this.fileCargar_Pasaporte_1 = f;
            this.Cargar_Pasaporte_1Name = f.Description;
          });
        }
        this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_2').setValue(
          result.Configuracion_de_tecnicos_e_inspectoress[0].Pais_2_Pais.Nombre,
          { onlySelf: false, emitEvent: true }
        );
        if (this.model.Cargar_Pasaporte_2 !== null && this.model.Cargar_Pasaporte_2 !== undefined) {
          this.spartanFileService.getById(this.model.Cargar_Pasaporte_2).subscribe(f => {
            this.fileCargar_Pasaporte_2 = f;
            this.Cargar_Pasaporte_2Name = f.Description;
          });
        }
        this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_3').setValue(
          result.Configuracion_de_tecnicos_e_inspectoress[0].Pais_3_Pais.Nombre,
          { onlySelf: false, emitEvent: true }
        );
        if (this.model.Cargar_Visa_1 !== null && this.model.Cargar_Visa_1 !== undefined) {
          this.spartanFileService.getById(this.model.Cargar_Visa_1).subscribe(f => {
            this.fileCargar_Visa_1 = f;
            this.Cargar_Visa_1Name = f.Description;
          });
        }
        this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_4').setValue(
          result.Configuracion_de_tecnicos_e_inspectoress[0].Pais_4_Pais.Nombre,
          { onlySelf: false, emitEvent: true }
        );
        if (this.model.Cargar_Visa_2 !== null && this.model.Cargar_Visa_2 !== undefined) {
          this.spartanFileService.getById(this.model.Cargar_Visa_2).subscribe(f => {
            this.fileCargar_Visa_2 = f;
            this.Cargar_Visa_2Name = f.Description;
          });
        }

		this.Configuracion_de_tecnicos_e_inspectoresForm.markAllAsTouched();
		this.Configuracion_de_tecnicos_e_inspectoresForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get AeronavesItems() {
    return this.Configuracion_de_tecnicos_e_inspectoresForm.get('Tecnico_AeronaveItems') as FormArray;
  }

  getAeronavesColumns(): string[] {
    return this.AeronavesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadAeronaves(Aeronaves: Tecnico_Aeronave[]) {
    Aeronaves.forEach(element => {
      this.addAeronaves(element);
    });
  }

  addAeronavesToMR() {
    const Aeronaves = new Tecnico_Aeronave(this.fb);
    this.AeronavesData.push(this.addAeronaves(Aeronaves));
    this.dataSourceAeronaves.data = this.AeronavesData;
    Aeronaves.edit = true;
    Aeronaves.isNew = true;
    const length = this.dataSourceAeronaves.data.length;
    const index = length - 1;
    const formAeronaves = this.AeronavesItems.controls[index] as FormGroup;
	this.addFilterToControlAeronave_Tecnico_Aeronave(formAeronaves.controls.Aeronave, index);
    
    const page = Math.ceil(this.dataSourceAeronaves.data.filter(d => !d.IsDeleted).length / this.paginadorAeronaves.pageSize);
    if (page !== this.paginadorAeronaves.pageIndex) {
      this.paginadorAeronaves.pageIndex = page;
    }
  }

  addAeronaves(entity: Tecnico_Aeronave) {
    const Aeronaves = new Tecnico_Aeronave(this.fb);
    this.AeronavesItems.push(Aeronaves.buildFormGroup());
    if (entity) {
      Aeronaves.fromObject(entity);
    }
	return entity;
  }  

  AeronavesItemsByFolio(Folio: number): FormGroup {
    return (this.Configuracion_de_tecnicos_e_inspectoresForm.get('Tecnico_AeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
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
    this.dataSourceAeronaves.data.splice(index, 1);
    this.dataSourceAeronaves._updateChangeSubscription();
    index = this.dataSourceAeronaves.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorAeronaves.pageSize);
    if (page !== this.paginadorAeronaves.pageIndex) {
      this.paginadorAeronaves.pageIndex = page;
    }
  }
  
  cancelEditAeronaves(element: any) {
    let index = this.dataSourceAeronaves.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.AeronavesData[index].IsDeleted = true;
      this.dataSourceAeronaves.data = this.AeronavesData;
      this.dataSourceAeronaves.data.splice(index, 1);
      this.dataSourceAeronaves._updateChangeSubscription();
      index = this.AeronavesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorAeronaves.pageSize);
      if (page !== this.paginadorAeronaves.pageIndex) {
        this.paginadorAeronaves.pageIndex = page;
      }
    }
  }  

  validarAeronavesRepetidas(index, Aeronave: string): boolean {
    let respuesta: boolean = false;

    if(this.dataSourceAeronaves.data.filter(x => x.Aeronave == Aeronave).length > 0) {
      respuesta = true;
      alert("No es permitido capturar Aeronaves repetidas");
      this.deleteAeronaves(this.dataSourceAeronaves.data[index]);
    }

    return respuesta;
  }

  async saveAeronaves(element: any) {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    const formAeronaves = this.AeronavesItems.controls[index] as FormGroup;

    if(this.validarAeronavesRepetidas(index, formAeronaves.controls.Aeronave.value)) {
      return;
    }

    if (this.AeronavesData[index].Aeronave !== formAeronaves.value.Aeronave && formAeronaves.value.Aeronave > 0) {
		let aeronave = await this.AeronaveService.getById(formAeronaves.value.Aeronave).toPromise();
        this.AeronavesData[index].Aeronave_Aeronave = aeronave;
    }
    this.AeronavesData[index].Aeronave = formAeronaves.value.Aeronave;
	
    this.AeronavesData[index].isNew = false;
    this.dataSourceAeronaves.data = this.AeronavesData;
    this.dataSourceAeronaves._updateChangeSubscription();
  }
  
  editAeronaves(element: any) {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    const formAeronaves = this.AeronavesItems.controls[index] as FormGroup;
	this.SelectedAeronave_Tecnico_Aeronave[index] = this.dataSourceAeronaves.data[index].Aeronave_Aeronave.Matricula;
    this.addFilterToControlAeronave_Tecnico_Aeronave(formAeronaves.controls.Aeronave, index);
	    
    element.edit = true;
  }  

  async saveTecnico_Aeronave(Folio: number) {
    this.dataSourceAeronaves.data.forEach(async (d, index) => {
      const data = this.AeronavesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	    model.Configuracion_de_tecnicos_e_inspectores = Folio;
      model.Clave_tecnico = Folio;
      
      if (model.Folio === 0) {
        // Add Aeronaves
		let response = await this.Tecnico_AeronaveService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formAeronaves = this.AeronavesItemsByFolio(model.Folio);
        if (formAeronaves.dirty) {
          // Update Aeronaves
          let response = await this.Tecnico_AeronaveService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Aeronaves
        await this.Tecnico_AeronaveService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectAeronave_Tecnico_Aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAeronave_Tecnico_Aeronave[index] = event.option.viewValue;
	let fgr = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Tecnico_AeronaveItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Aeronave.setValue(event.option.value);
    this.displayFnAeronave_Tecnico_Aeronave(element);
  }  
  
  displayFnAeronave_Tecnico_Aeronave(this, element) {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    return this.SelectedAeronave_Tecnico_Aeronave[index];
  }
  updateOptionAeronave_Tecnico_Aeronave(event, element: any) {
    const index = this.dataSourceAeronaves.data.indexOf(element);
    this.SelectedAeronave_Tecnico_Aeronave[index] = event.source.viewValue;
  } 

	_filterAeronave_Tecnico_Aeronave(filter: any): Observable<Aeronave> {
		const where = filter !== '' ?  "Aeronave.Matricula like '%" + filter + "%'" : '';
		return this.AeronaveService.listaSelAll(0, 20, where);
	}

  addFilterToControlAeronave_Tecnico_Aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAeronave_Tecnico_Aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAeronave_Tecnico_Aeronave = true;
        return this._filterAeronave_Tecnico_Aeronave(value || '');
      })
    ).subscribe(result => {
      this.varAeronave = result.Aeronaves;
      this.isLoadingAeronave_Tecnico_Aeronave = false;
      this.searchAeronave_Tecnico_AeronaveCompleted = true;
      this.SelectedAeronave_Tecnico_Aeronave[index] = this.varAeronave.length === 0 ? '' : this.SelectedAeronave_Tecnico_Aeronave[index];
    });
  }

  get CursosItems() {
    return this.Configuracion_de_tecnicos_e_inspectoresForm.get('Detalle_de_Documentos_CursosItems') as FormArray;
  }

  getCursosColumns(): string[] {
    return this.CursosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadCursos(Cursos: Detalle_de_Documentos_Cursos[]) {
    Cursos.forEach(element => {
      this.addCursos(element);
    });
  }

  addCursosToMR() {
    const Cursos = new Detalle_de_Documentos_Cursos(this.fb);
    this.CursosData.push(this.addCursos(Cursos));
    this.dataSourceCursos.data = this.CursosData;
    Cursos.edit = true;
    Cursos.isNew = true;
    const length = this.dataSourceCursos.data.length;
    const index = length - 1;
    const formCursos = this.CursosItems.controls[index] as FormGroup;
	this.addFilterToControlModelo_Detalle_de_Documentos_Cursos(formCursos.controls.Modelo, index);
    
    const page = Math.ceil(this.dataSourceCursos.data.filter(d => !d.IsDeleted).length / this.paginadorCursos.pageSize);
    if (page !== this.paginadorCursos.pageIndex) {
      this.paginadorCursos.pageIndex = page;
    }
  }

  addCursos(entity: Detalle_de_Documentos_Cursos) {
    const Cursos = new Detalle_de_Documentos_Cursos(this.fb);
    this.CursosItems.push(Cursos.buildFormGroup());
    if (entity) {
      Cursos.fromObject(entity);
    }
	return entity;
  }  

  CursosItemsByFolio(Folio: number): FormGroup {
    return (this.Configuracion_de_tecnicos_e_inspectoresForm.get('Detalle_de_Documentos_CursosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
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
    this.dataSourceCursos._updateChangeSubscription();
    index = this.dataSourceCursos.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginadorCursos.pageSize);
    if (page !== this.paginadorCursos.pageIndex) {
      this.paginadorCursos.pageIndex = page;
    }
  }
  
  cancelEditCursos(element: any) {
    let index = this.dataSourceCursos.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.CursosData[index].IsDeleted = true;
      this.dataSourceCursos.data = this.CursosData;
      this.dataSourceCursos.data.splice(index, 1);
      this.dataSourceCursos._updateChangeSubscription();
      index = this.CursosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginadorCursos.pageSize);
      if (page !== this.paginadorCursos.pageIndex) {
        this.paginadorCursos.pageIndex = page;
      }
    }
  }  

  async saveCursos(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    const formCursos = this.CursosItems.controls[index] as FormGroup;
    if (this.CursosData[index].Modelo !== formCursos.value.Modelo && formCursos.value.Modelo > 0) {
		let modelos = await this.ModelosService.getById(formCursos.value.Modelo).toPromise();
        this.CursosData[index].Modelo_Modelos = modelos;
    }
    this.CursosData[index].Modelo = formCursos.value.Modelo;
    this.CursosData[index].Tipo_de_curso = formCursos.value.Tipo_de_curso;
    this.CursosData[index].Tipo_de_curso_Tipos_de_Curso = formCursos.value.Tipo_de_curso !== '' ?
     this.varTipos_de_Curso.filter(d => d.Clave === formCursos.value.Tipo_de_curso)[0] : null ;	
    this.CursosData[index].Descripcion = formCursos.value.Descripcion;
    this.CursosData[index].Fecha_de_Vencimiento = formCursos.value.Fecha_de_Vencimiento;
	
    this.CursosData[index].isNew = false;
    this.dataSourceCursos.data = this.CursosData;
    this.dataSourceCursos._updateChangeSubscription();
  }
  
  editCursos(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    const formCursos = this.CursosItems.controls[index] as FormGroup;
	this.SelectedModelo_Detalle_de_Documentos_Cursos[index] = this.dataSourceCursos.data[index].Modelo_Modelos.Descripcion;
    this.addFilterToControlModelo_Detalle_de_Documentos_Cursos(formCursos.controls.Modelo, index);
	    
    element.edit = true;
  }  

  async saveDetalle_de_Documentos_Cursos(Folio: number) {
    this.dataSourceCursos.data.forEach(async (d, index) => {
      const data = this.CursosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	    model.Configuracion_de_tecnicos_e_inspectores = Folio;
      model.IdConfiguracion = Folio;
	
	    const FolioDocumento = await this.saveDocumento_Detalle_de_Documentos_Cursos(index);
      d.Documento = FolioDocumento > 0 ? FolioDocumento : null;  
      
      if (model.Folio === 0) {
        // Add Cursos
		  let response = await this.Detalle_de_Documentos_CursosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formCursos = this.CursosItemsByFolio(model.Folio);
        if (formCursos.dirty) {
          // Update Cursos
          let response = await this.Detalle_de_Documentos_CursosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Cursos
        await this.Detalle_de_Documentos_CursosService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectModelo_Detalle_de_Documentos_Cursos(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCursos.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedModelo_Detalle_de_Documentos_Cursos[index] = event.option.viewValue;
	let fgr = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Detalle_de_Documentos_CursosItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Modelo.setValue(event.option.value);
    this.displayFnModelo_Detalle_de_Documentos_Cursos(element);
  }  
  
  displayFnModelo_Detalle_de_Documentos_Cursos(this, element) {
    const index = this.dataSourceCursos.data.indexOf(element);
    return this.SelectedModelo_Detalle_de_Documentos_Cursos[index];
  }
  updateOptionModelo_Detalle_de_Documentos_Cursos(event, element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    this.SelectedModelo_Detalle_de_Documentos_Cursos[index] = event.source.viewValue;
  } 

	_filterModelo_Detalle_de_Documentos_Cursos(filter: any): Observable<Modelos> {
		const where = filter !== '' ?  "Modelos.Descripcion like '%" + filter + "%'" : '';
		return this.ModelosService.listaSelAll(0, 20, where);
	}

  addFilterToControlModelo_Detalle_de_Documentos_Cursos(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingModelo_Detalle_de_Documentos_Cursos = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingModelo_Detalle_de_Documentos_Cursos = true;
        return this._filterModelo_Detalle_de_Documentos_Cursos(value || '');
      })
    ).subscribe(result => {
      this.varModelos = result.Modeloss;
      this.isLoadingModelo_Detalle_de_Documentos_Cursos = false;
      this.searchModelo_Detalle_de_Documentos_CursosCompleted = true;
      this.SelectedModelo_Detalle_de_Documentos_Cursos[index] = this.varModelos.length === 0 ? '' : this.SelectedModelo_Detalle_de_Documentos_Cursos[index];
    });
  }
  getDocumento_Detalle_de_Documentos_Cursos(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    const formDetalle_de_Documentos_Cursos = this.CursosItems.controls[index] as FormGroup;
    return formDetalle_de_Documentos_Cursos.controls.DocumentoFile.value && formDetalle_de_Documentos_Cursos.controls.DocumentoFile.value !== '' ?
      formDetalle_de_Documentos_Cursos.controls.DocumentoFile.value.files[0].name : '';
  }

  async getDocumento_Detalle_de_Documentos_CursosClick(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    const formDetalle_de_Documentos_Cursos = this.CursosItems.controls[index] as FormGroup;
    if (formDetalle_de_Documentos_Cursos.controls.DocumentoFile.valid
      && formDetalle_de_Documentos_Cursos.controls.DocumentoFile.dirty) {
      const Documento = formDetalle_de_Documentos_Cursos.controls.DocumentoFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Documento);
      this.helperService.dowloadFileFromArray(byteArray, Documento.name);
    }
  }

  removeDocumento_Detalle_de_Documentos_Cursos(element: any) {
    const index = this.dataSourceCursos.data.indexOf(element);
    this.Documento_Detalle_de_Documentos_Cursos[index] = '';
    this.CursosData[index].Documento = 0;

    const formDetalle_de_Documentos_Cursos = this.CursosItems.controls[index] as FormGroup;
    if (formDetalle_de_Documentos_Cursos.controls.DocumentoFile.valid
      && formDetalle_de_Documentos_Cursos.controls.DocumentoFile.dirty) {
      formDetalle_de_Documentos_Cursos.controls.DocumentoFile = null;
    }
  } 

  async saveDocumento_Detalle_de_Documentos_Cursos(index: number): Promise<number> {
    const formCursos = this.CursosItems.controls[index] as FormGroup;
    if (formCursos.controls.DocumentoFile.valid
      && formCursos.controls.DocumentoFile.dirty) {
      const Documento = formCursos.controls.DocumentoFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Documento);
      const spartanFile = {
        File: byteArray,
        Description: Documento.name,
        Date_Time: Documento.lastModifiedDate,
        File_Size: Documento.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return 0;
    }
  }

  hasDocumento_Detalle_de_Documentos_Cursos(element) {
    return this.getDocumento_Detalle_de_Documentos_Cursos(element) !== '' ||
      (element.Documento_Spartane_File && element.Documento_Spartane_File.File_Id > 0);
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Configuracion_de_tecnicos_e_inspectoresForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.CargosService.getAll());
    observablesArray.push(this.Spartan_UserService.getAll());

    observablesArray.push(this.Tipos_de_CursoService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varCargos , varSpartan_User  , varTipos_de_Curso  ]) => {
          this.varCargos = varCargos;
          this.varSpartan_User = varSpartan_User;

          this.varTipos_de_Curso = varTipos_de_Curso;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Configuracion_de_tecnicos_e_inspectoresForm.get('Usuario_Relacionado').valueChanges.pipe(
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
	  this.Configuracion_de_tecnicos_e_inspectoresForm.get('Usuario_Relacionado').setValue(result?.Creacion_de_Usuarioss[0], { onlySelf: true, emitEvent: false });
	  this.optionsUsuario_Relacionado = of(result?.Creacion_de_Usuarioss);
    }, error => {
      this.isLoadingUsuario_Relacionado = false;
      this.hasOptionsUsuario_Relacionado = false;
      this.optionsUsuario_Relacionado = of([]);
    });
    this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_1').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_1 = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.Pais1Seleccionado = value;
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
	  
      if(this.Pais1Seleccionado != null && this.Pais1Seleccionado != "") {
        this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_1').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      }

	    this.optionsPais_1 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_1 = false;
      this.hasOptionsPais_1 = false;
      this.optionsPais_1 = of([]);
    });
    this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_2').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_2 = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.Pais2Seleccionado = value;
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

      if(this.Pais2Seleccionado != null && this.Pais2Seleccionado != "") {
        this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_2').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      }
	    
	    this.optionsPais_2 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_2 = false;
      this.hasOptionsPais_2 = false;
      this.optionsPais_2 = of([]);
    });
    this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_3').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_3 = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.Pais3Seleccionado = value;
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
	    
      if(this.Pais3Seleccionado != null && this.Pais3Seleccionado != "") {
        this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_3').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      }

	    this.optionsPais_3 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_3 = false;
      this.hasOptionsPais_3 = false;
      this.optionsPais_3 = of([]);
    });
    this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_4').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_4 = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.Pais4Seleccionado = value;
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
	    
      if(this.Pais4Seleccionado != null && this.Pais4Seleccionado != "") {
        this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_4').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
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
      case 'Cargo_desempenado': {
        this.CargosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCargos = x.Cargoss;
        });
        break;
      }
      case 'Usuario_Registrado': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }

      case 'Tipo_de_curso': {
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

  async saveCargar_Licencia(): Promise<number> {
    if (this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_LicenciaFile.valid
      && this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_LicenciaFile.dirty) {
      const Cargar_Licencia = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_LicenciaFile.value.files[0];
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
    if (this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Certificado_MedicoFile.valid
      && this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Certificado_MedicoFile.dirty) {
      const Cargar_Certificado_Medico = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Certificado_MedicoFile.value.files[0];
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
  
  removeCargar_Certificado_Medico() {
    this.Cargar_Certificado_MedicoName = '';
    this.model.Cargar_Certificado_Medico = 0;
  }
  async saveCargar_Pasaporte_1(): Promise<number> {
    if (this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Pasaporte_1File.valid
      && this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Pasaporte_1File.dirty) {
      const Cargar_Pasaporte_1 = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Pasaporte_1File.value.files[0];
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
    if (this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Pasaporte_2File.valid
      && this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Pasaporte_2File.dirty) {
      const Cargar_Pasaporte_2 = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Pasaporte_2File.value.files[0];
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
    if (this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Visa_1File.valid
      && this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Visa_1File.dirty) {
      const Cargar_Visa_1 = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Visa_1File.value.files[0];
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
    if (this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Visa_2File.valid
      && this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Visa_2File.dirty) {
      const Cargar_Visa_2 = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargar_Visa_2File.value.files[0];
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
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Configuracion_de_tecnicos_e_inspectoresForm.value;
      entity.Folio = this.model.Folio;
      entity.Usuario_Relacionado = this.Configuracion_de_tecnicos_e_inspectoresForm.get('Usuario_Relacionado').value.Clave;
      
      entity.Pais_1 = this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_1').value == null ? null : this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_1').value.Clave;
      entity.Pais_2 = this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_2').value == null ? null : this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_2').value.Clave;
      entity.Pais_3 = this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_3').value == null ? null : this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_3').value.Clave;
      entity.Pais_4 = this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_4').value == null ? null : this.Configuracion_de_tecnicos_e_inspectoresForm.get('Pais_4').value.Clave;
	  	  
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

      entity.Apellido_materno = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Apellido_materno.value;
      entity.Apellido_paterno = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Apellido_paterno.value;
      entity.Cargo_desempenado = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Cargo_desempenado.value;
      entity.Nombre_completo = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Nombre_completo.value;
      entity.Nombres = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Nombres.value;
      entity.Correo_electronico = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Correo_electronico.value;
      entity.Celular = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Celular.value;
      entity.Telefono = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Telefono.value;
      entity.Direccion = this.Configuracion_de_tecnicos_e_inspectoresForm.controls.Direccion.value;

	  if (this.model.Folio > 0 ) {
        await this.Configuracion_de_tecnicos_e_inspectoresService.update(this.model.Folio, entity).toPromise();

        await this.saveTecnico_Aeronave(this.model.Folio);  
        await this.saveDetalle_de_Documentos_Cursos(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
      } else {
        await (this.Configuracion_de_tecnicos_e_inspectoresService.insert(entity).toPromise().then(async id => {
          await this.saveTecnico_Aeronave(id);
          await this.saveDetalle_de_Documentos_Cursos(id);

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
    if (this.model.Folio === 0 ) {
      this.Configuracion_de_tecnicos_e_inspectoresForm.reset();
      this.model = new Configuracion_de_tecnicos_e_inspectores(this.fb);
      this.Configuracion_de_tecnicos_e_inspectoresForm = this.model.buildFormGroup();
      this.dataSourceAeronaves = new MatTableDataSource<Tecnico_Aeronave>();
      this.AeronavesData = [];
      this.dataSourceCursos = new MatTableDataSource<Detalle_de_Documentos_Cursos>();
      this.CursosData = [];

    } else {
      this.router.navigate(['views/Configuracion_de_tecnicos_e_inspectores/add']);
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
    this.router.navigate(['/Configuracion_de_tecnicos_e_inspectores/list'], { state: { data: this.dataListConfig } });
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
        //Nombre_completo_FieldExecuteBusinessRulesEnd
    }
    Cargo_desempenado_ExecuteBusinessRules(): void {
        //Cargo_desempenado_FieldExecuteBusinessRulesEnd
    }
    Correo_electronico_ExecuteBusinessRules(): void {
        //Correo_electronico_FieldExecuteBusinessRulesEnd
    }
    Celular_ExecuteBusinessRules(): void {
        //Celular_FieldExecuteBusinessRulesEnd
    }
    Telefono_ExecuteBusinessRules(): void {
        //Telefono_FieldExecuteBusinessRulesEnd
    }
    Direccion_ExecuteBusinessRules(): void {
        //Direccion_FieldExecuteBusinessRulesEnd
    }
    Usuario_Registrado_ExecuteBusinessRules(): void {
        //Usuario_Registrado_FieldExecuteBusinessRulesEnd
    }
    Usuario_Relacionado_ExecuteBusinessRules(): void {
        //Usuario_Relacionado_FieldExecuteBusinessRulesEnd
    }
    Numero_de_Licencia_ExecuteBusinessRules(): void {
        //Numero_de_Licencia_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Emision_Licencia_ExecuteBusinessRules(): void {

//INICIA - BRID:6254 - Fecha de vencimiento no puede ser menor o igual a la fecha de emision 1.1 - Autor: Jose Caballero - Actualización: 9/13/2021 4:23:14 PM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Licencia]',105)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión");} else {}
//TERMINA - BRID:6254

//Fecha_de_Emision_Licencia_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_vencimiento_ExecuteBusinessRules(): void {

//INICIA - BRID:6255 - Fecha de vencimiento no peude ser menor o igual a la fecha de emision. 1.1 - Autor: Jose Caballero - Actualización: 9/13/2021 4:25:47 PM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Licencia]',105)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión");} else {}
//TERMINA - BRID:6255

//Fecha_de_vencimiento_FieldExecuteBusinessRulesEnd

    }
    Alerta_de_vencimiento_ExecuteBusinessRules(): void {
        //Alerta_de_vencimiento_FieldExecuteBusinessRulesEnd
    }
    Cargar_Licencia_ExecuteBusinessRules(): void {
        //Cargar_Licencia_FieldExecuteBusinessRulesEnd
    }
    Certificado_Medico_ExecuteBusinessRules(): void {
        //Certificado_Medico_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Emision_Certificado_ExecuteBusinessRules(): void {

//INICIA - BRID:6256 - La fecha de vencimiento certificado no puede ser menor o igual a la fecha de emisión. 1.1 - Autor: Jose Caballero - Actualización: 9/13/2021 4:30:09 PM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_cert]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Certificado]',105)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage("La fecha de vencimiento no puede ser menor o igual a la fecha de emisión");} else {}
//TERMINA - BRID:6256

//Fecha_de_Emision_Certificado_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_vencimiento_cert_ExecuteBusinessRules(): void {

    //INICIA - BRID:6257 - La fecha de vencimiento certificado no puede ser menor o igual a la fecha de emisión 1.1 - Autor: Jose Caballero - Actualización: 9/13/2021 4:36:24 PM
    if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_cert]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Certificado]',105)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage("Fecha de vencimiento no puede ser menor o igual a la fecha de emisión");} else {}
    //TERMINA - BRID:6257

    //Fecha_de_vencimiento_cert_FieldExecuteBusinessRulesEnd

    }
    Alerta_de_vencimiento_cert_ExecuteBusinessRules(): void {
        //Alerta_de_vencimiento_cert_FieldExecuteBusinessRulesEnd
    }
    Cargar_Certificado_Medico_ExecuteBusinessRules(): void {
        //Cargar_Certificado_Medico_FieldExecuteBusinessRulesEnd
    }
    Numero_de_Pasaporte_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1645 - obligatorio el cargar documento si tiene valor el campo seleccionar pasaporte o visa  - Autor: Administrador - Actualización: 3/18/2021 11:27:30 AM
    if( this.brf.GetValueByControlType(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Numero_de_Pasaporte_1')!=this.brf.TryParseInt('', '') ) { 
      this.brf.SetRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Pasaporte_1File");
      this.requiredPasaporte1 = true;
    } else { 
      this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Pasaporte_1File");
      this.requiredPasaporte1 = false;
    }
    //TERMINA - BRID:1645

    //Numero_de_Pasaporte_1_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_Emision_Pasaporte_1_ExecuteBusinessRules(): void {

//INICIA - BRID:1708 - fechas - Autor: Administrador - Actualización: 3/19/2021 10:25:37 AM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_Emision_Pasaporte_1]', 105))<= convert(date, 'FLD[Fecha_de_vencimiento_Pasaporte_1]',105)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.");

} else {}
//TERMINA - BRID:1708

//Fecha_de_Emision_Pasaporte_1_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_vencimiento_Pasaporte_1_ExecuteBusinessRules(): void {

//INICIA - BRID:1709 - Regla para validar fechas de emision y vencimiento pasaporte 1.111 - Autor: Administrador - Actualización: 3/19/2021 10:29:11 AM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Pasaporte_1]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Pasaporte_1]',105)) begin select 1 END", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.	");

} else {}
//TERMINA - BRID:1709

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

      //INICIA - BRID:1683 - 2.-obligatorio el cargar documento si tiene valor el campo seleccionar pasaporte o visa  - Autor: Administrador - Actualización: 3/18/2021 11:30:59 AM
      if( this.brf.GetValueByControlType(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Numero_de_Pasaporte_2')!=this.brf.TryParseInt('', '') ) { 
        this.brf.SetRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Pasaporte_2File");
        this.requiredPasaporte2 = true;
      } else { 
        this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Pasaporte_2File");
        this.requiredPasaporte2 = false;
      }
      //TERMINA - BRID:1683

      //Numero_de_Pasaporte_2_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_Emision_Pasaporte_2_ExecuteBusinessRules(): void {

//INICIA - BRID:1710 - Regla para validar fechas de emision y vencimiento pasaporteee - Autor: Administrador - Actualización: 3/19/2021 10:30:24 AM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_Emision_Pasaporte_2]', 105))<= convert(date, 'FLD[Fecha_de_vencimiento_Pasaporte_2]',105)) begin select 1 END", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.");

} else {}
//TERMINA - BRID:1710

//Fecha_de_Emision_Pasaporte_2_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_vencimiento_Pasaporte_2_ExecuteBusinessRules(): void {

//INICIA - BRID:1711 - Regla para validar fechas de emision y vencimiento pasaporte configuracion de tecnicos e inspectores - Autor: Administrador - Actualización: 3/19/2021 10:27:21 AM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Pasaporte_2]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Pasaporte_2]',105)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.");

} else {}
//TERMINA - BRID:1711

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

      //INICIA - BRID:1702 - 3.- obligatorio el cargar documento si tiene valor el campo seleccionar pasaporte o visa  - Autor: Administrador - Actualización: 3/18/2021 11:33:23 AM
      if( this.brf.GetValueByControlType(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Numero_de_Visa_1')!=this.brf.TryParseInt('', '') ) { 
        this.brf.SetRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Visa_1File");
        this.requiredVisa1 = true;
      } else { 
        this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Visa_1File");
        this.requiredVisa1 = false;
      }
      //TERMINA - BRID:1702

      //Numero_de_Visa_1_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_Emision_Visa_1_ExecuteBusinessRules(): void {

//INICIA - BRID:1712 - Regla para validar fechas de emision y vencimiento pasaporte 1.12345 - Autor: Administrador - Actualización: 3/19/2021 10:33:00 AM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_Emision_Visa_1]', 105))<= convert(date, 'FLD[Fecha_de_vencimiento_Visa_1]',105)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.");

} else {}
//TERMINA - BRID:1712

//Fecha_de_Emision_Visa_1_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_vencimiento_Visa_1_ExecuteBusinessRules(): void {

//INICIA - BRID:1713 - Regla para validar fechas de emision y vencimiento pasaporte 1.12548 - Autor: Administrador - Actualización: 3/19/2021 10:39:16 AM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Visa_1]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Visa_1]',105)) begin select 1 END", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.");

} else {}
//TERMINA - BRID:1713

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

      //INICIA - BRID:1707 - al seleccionar el campo visa 2, requerido el documento de lo contrario no requerido - Autor: Administrador - Actualización: 3/18/2021 3:28:07 PM
      if( this.brf.GetValueByControlType(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Numero_de_Visa_2')!=this.brf.TryParseInt('', '') ) { 
        this.brf.SetRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Visa_2File");
        this.requiredVisa2 = true;
      } else { 
        this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Visa_2File");
        this.requiredVisa2 = false;
      }
      //TERMINA - BRID:1707

      //Numero_de_Visa_2_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_Emision_Visa_2_ExecuteBusinessRules(): void {

//INICIA - BRID:1714 - Regla para validar fechas de emision y vencimiento pasaporte 1.14587 - Autor: Administrador - Actualización: 3/19/2021 10:40:15 AM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_Emision_Visa_2]', 105))<= convert(date, 'FLD[Fecha_de_vencimiento_Visa_2]',105)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.");

} else {}
//TERMINA - BRID:1714

//Fecha_de_Emision_Visa_2_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_vencimiento_Visa_2_ExecuteBusinessRules(): void {

//INICIA - BRID:1715 - La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.	 - Autor: Administrador - Actualización: 3/19/2021 10:41:04 AM
if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_Visa_2]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Visa_2]',105)) begin select 1 END", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.");

} else {}
//TERMINA - BRID:1715

//Fecha_de_vencimiento_Visa_2_FieldExecuteBusinessRulesEnd

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

//REGLA MANUAL PARA OCULTAR BOTON DE MR EN AERONAVES
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  if(this.operation == 'Consult'){
    this.showButtonMR = false;
  }
  if(this.operation == 'Update' && this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('19', '19') ){
    this.showButtonMR = false;
  }
} 
//TERMINA REGLA MANUAL

//INICIA - BRID:306 - Deshabilitar control nombre completo - Autor: Felipe Rodríguez - Actualización: 2/10/2021 5:20:18 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Nombre_completo', 0);
} 
//TERMINA - BRID:306


//INICIA - BRID:480 - Ocultar usuario registrado - Autor: Felipe Rodríguez - Actualización: 2/19/2021 2:56:30 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Usuario_Registrado"); this.brf.HideFieldOfForm(this.Configuracion_de_tecnicos_e_inspectoresForm, "Usuario_Registrado"); this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Usuario_Registrado");
} 
//TERMINA - BRID:480


//INICIA - BRID:1441 - filtrar usuarios para técnicos - Autor: Administrador - Actualización: 3/10/2021 9:17:32 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:1441


//INICIA - BRID:1449 - no requeridos a los campos de la pestaña de documentos. - Autor: Administrador - Actualización: 3/11/2021 3:52:03 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Numero_de_Pasaporte_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_vencimiento_Pasaporte_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_Emision_Pasaporte_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Alerta_de_vencimiento_Pasaporte_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Pais_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Pasaporte_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Numero_de_Pasaporte_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_vencimiento_Pasaporte_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_Emision_Pasaporte_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Alerta_de_vencimiento_Pasaporte_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Pais_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Pasaporte_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Numero_de_Visa_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_vencimiento_Visa_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_Emision_Visa_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Alerta_de_vencimiento_Visa_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Pais_3");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Visa_1");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Numero_de_Visa_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_vencimiento_Visa_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_Emision_Visa_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Alerta_de_vencimiento_Visa_2");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Pais_4");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Visa_2");
} 
//TERMINA - BRID:1449


//INICIA - BRID:1880 - ocultar combo de usuario relacionado - Autor: Administrador - Actualización: 3/22/2021 3:58:35 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Configuracion_de_tecnicos_e_inspectoresForm, "Usuario_Relacionado"); this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Usuario_Relacionado");
} 
//TERMINA - BRID:1880


//INICIA - BRID:1881 - Bloquea controles que solo deben cargarse desde usuarios - Autor: Administrador - Actualización: 3/23/2021 11:29:50 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Cargo_desempenado', 0);this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Correo_electronico', 0);this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Telefono', 0);this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Direccion', 0);this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Celular', 0); this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Nombres', 0);this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Apellido_paterno', 0);this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Apellido_materno', 0);this.brf.SetEnabledControl(this.Configuracion_de_tecnicos_e_inspectoresForm, 'Nombre_completo', 0);
} 
//TERMINA - BRID:1881


//INICIA - BRID:2369 - Regla para acomodar controles en pantalla al cargar - Autor: Administrador - Actualización: 4/13/2021 5:22:27 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:2369


//INICIA - BRID:2692 - acomodo de t3cnicos e inspectores - Autor: Administrador - Actualización: 4/13/2021 5:54:08 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:2692


//INICIA - BRID:2705 - separador documentos técnicos e inspectores - Autor: Administrador - Actualización: 5/19/2021 2:46:38 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:2705


//INICIA - BRID:6252 - acomodo e campos de licencia y certificado medico. - Autor: Yamir - Actualización: 9/13/2021 4:14:55 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:6252


//INICIA - BRID:6253 - asignar sesiones a licencia y certificado medico - Autor: Yamir - Actualización: 9/13/2021 4:17:54 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:6253


//INICIA - BRID:6260 - asignar no requerido para técnicos e inspectores la sesión de certificado medico - Autor: Administrador - Actualización: 9/13/2021 6:37:39 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Certificado_Medico");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_Emision_Certificado");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Fecha_de_vencimiento_cert");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Alerta_de_vencimiento_cert");this.brf.SetNotRequiredControl(this.Configuracion_de_tecnicos_e_inspectoresForm, "Cargar_Certificado_Medico");
} 
//TERMINA - BRID:6260

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
  
}
