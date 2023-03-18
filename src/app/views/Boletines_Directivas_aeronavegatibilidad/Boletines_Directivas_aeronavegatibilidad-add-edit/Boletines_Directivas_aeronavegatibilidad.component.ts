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
import { Boletines_Directivas_aeronavegatibilidadService } from 'src/app/api-services/Boletines_Directivas_aeronavegatibilidad.service';
import { Boletines_Directivas_aeronavegatibilidad } from 'src/app/models/Boletines_Directivas_aeronavegatibilidad';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { ProcedenciaService } from 'src/app/api-services/Procedencia.service';
import { Procedencia } from 'src/app/models/Procedencia';
import { Tipo_de_urgenciaService } from 'src/app/api-services/Tipo_de_urgencia.service';
import { Tipo_de_urgencia } from 'src/app/models/Tipo_de_urgencia';
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { Detalle_cargar_instruccionesService } from 'src/app/api-services/Detalle_cargar_instrucciones.service';
import { Detalle_cargar_instrucciones } from 'src/app/models/Detalle_cargar_instrucciones';


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
  selector: 'app-Boletines_Directivas_aeronavegatibilidad',
  templateUrl: './Boletines_Directivas_aeronavegatibilidad.component.html',
  styleUrls: ['./Boletines_Directivas_aeronavegatibilidad.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Boletines_Directivas_aeronavegatibilidadComponent implements OnInit, AfterViewInit {
MRaddCargar_Instrucciones: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Boletines_Directivas_aeronavegatibilidadForm: FormGroup;
	public Editor = ClassicEditor;
	model: Boletines_Directivas_aeronavegatibilidad;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsAeronave: Observable<Aeronave[]>;
	hasOptionsAeronave: boolean;
	isLoadingAeronave: boolean;
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;
	optionsN_Serie: Observable<Aeronave[]>;
	hasOptionsN_Serie: boolean;
	isLoadingN_Serie: boolean;
	public varProcedencia: Procedencia[] = [];
	public varTipo_de_urgencia: Tipo_de_urgencia[] = [];
	optionsCodigo_ATA: Observable<Catalogo_codigo_ATA[]>;
	hasOptionsCodigo_ATA: boolean;
	isLoadingCodigo_ATA: boolean;
  Cargar_Instrucciones_Detalle_cargar_instrucciones: string[] = [];



	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceCargar_Instrucciones = new MatTableDataSource<Detalle_cargar_instrucciones>();
  Cargar_InstruccionesColumns = [
    { def: 'actions', hide: false },
    { def: 'Cargar_Instrucciones', hide: false },
	
  ];
  Cargar_InstruccionesData: Detalle_cargar_instrucciones[] = [];
	
	today = new Date;
	consult: boolean = false;
  AeronaveSeleccion: any = null;
  ModeloSeleccionado: any = null;
  NSerieSeleccionado: any = null;
  Codigo_ATASeleccionado: any = null;
  cargaMatriculaDesdeEdicion: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Boletines_Directivas_aeronavegatibilidadService: Boletines_Directivas_aeronavegatibilidadService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private ProcedenciaService: ProcedenciaService,
    private Tipo_de_urgenciaService: Tipo_de_urgenciaService,
    private Catalogo_codigo_ATAService: Catalogo_codigo_ATAService,
    private Detalle_cargar_instruccionesService: Detalle_cargar_instruccionesService,


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
    this.model = new Boletines_Directivas_aeronavegatibilidad(this.fb);
    this.Boletines_Directivas_aeronavegatibilidadForm = this.model.buildFormGroup();
    this.Cargar_InstruccionesItems.removeAt(0);
	
	this.Boletines_Directivas_aeronavegatibilidadForm.get('Folio').disable();
    this.Boletines_Directivas_aeronavegatibilidadForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  checkLength2(e, input, longitud) {
    console.log(input.value.length);

    const functionalKeys = ['Backspace', 'ArrowRight', 'ArrowLeft'];

    if (functionalKeys.indexOf(e.key) !== -1) {
      return;
    }

    const keyValue = +e.key;
    if (isNaN(keyValue)) {
      e.preventDefault();
      return;
    }

    const hasSelection = input.selectionStart !== input.selectionEnd && input.selectionStart !== null;
    let newValue;
    if (hasSelection) {
      newValue = this.replaceSelection(input, e.key)
    } else {
      newValue = input.value + keyValue.toString();
    }

    if (newValue.length > longitud) {
      e.preventDefault();
    }
  }

  replaceSelection(input, key) {
    const inputValue = input.value;
    const start = input.selectionStart;
    const end = input.selectionEnd || input.selectionStart;
    return inputValue.substring(0, start) + key + inputValue.substring(end + 1);
  }
  
  ngAfterViewInit(): void {
    this.dataSourceCargar_Instrucciones.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Cargar_InstruccionesColumns.splice(0, 1);
		
          this.Boletines_Directivas_aeronavegatibilidadForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Boletines_Directivas_aeronavegatibilidad)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Aeronave', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'N_Serie', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Codigo_ATA', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	  let result =  await this.Boletines_Directivas_aeronavegatibilidadService.listaSelAll(0, 1, 'Boletines_Directivas_aeronavegatibilidad.Folio=' + id).toPromise();
	  if (result.Boletines_Directivas_aeronavegatibilidads.length > 0) {
        let fCargar_Instrucciones = await this.Detalle_cargar_instruccionesService.listaSelAll(0, 1000,'Boletines_Directivas_aeronavegatibilidad.Folio=' + id).toPromise();

        this.cargaMatriculaDesdeEdicion = true;

        fCargar_Instrucciones.Detalle_cargar_instruccioness.forEach(async element => {
          element.Cargar_Instrucciones_Spartane_File = await this.brf.EvaluaQueryAsync(`SELECT ISNULL(Description, '') FROM Spartan_File WHERE File_Id = ${element.Cargar_Instrucciones}`, 1, "ABC123");
        });

        this.Cargar_InstruccionesData = fCargar_Instrucciones.Detalle_cargar_instruccioness;
        this.loadCargar_Instrucciones(fCargar_Instrucciones.Detalle_cargar_instruccioness);
        this.dataSourceCargar_Instrucciones = new MatTableDataSource(fCargar_Instrucciones.Detalle_cargar_instruccioness);
        this.dataSourceCargar_Instrucciones.paginator = this.paginator;
        this.dataSourceCargar_Instrucciones.sort = this.sort;
	  
        this.model.fromObject(result.Boletines_Directivas_aeronavegatibilidads[0]);
        this.Boletines_Directivas_aeronavegatibilidadForm.get('Aeronave').setValue(
          result.Boletines_Directivas_aeronavegatibilidads[0].Aeronave_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );
        this.Boletines_Directivas_aeronavegatibilidadForm.get('Modelo').setValue(
          result.Boletines_Directivas_aeronavegatibilidads[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Boletines_Directivas_aeronavegatibilidadForm.get('N_Serie').setValue(
          result.Boletines_Directivas_aeronavegatibilidads[0].N_Serie_Aeronave.Numero_de_Serie,
          { onlySelf: false, emitEvent: true }
        );
        this.Boletines_Directivas_aeronavegatibilidadForm.get('Codigo_ATA').setValue(
          result.Boletines_Directivas_aeronavegatibilidads[0].Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
          { onlySelf: false, emitEvent: true }
        );

		this.Boletines_Directivas_aeronavegatibilidadForm.markAllAsTouched();
		this.Boletines_Directivas_aeronavegatibilidadForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
      this.rulesOnInit();
  }
  
  get Cargar_InstruccionesItems() {
    return this.Boletines_Directivas_aeronavegatibilidadForm.get('Detalle_cargar_instruccionesItems') as FormArray;
  }

  getCargar_InstruccionesColumns(): string[] {
    return this.Cargar_InstruccionesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadCargar_Instrucciones(Cargar_Instrucciones: Detalle_cargar_instrucciones[]) {
    Cargar_Instrucciones.forEach(element => {
      this.addCargar_Instrucciones(element);
    });
  }

  addCargar_InstruccionesToMR() {
    const Cargar_Instrucciones = new Detalle_cargar_instrucciones(this.fb);
    this.Cargar_InstruccionesData.push(this.addCargar_Instrucciones(Cargar_Instrucciones));
    this.dataSourceCargar_Instrucciones.data = this.Cargar_InstruccionesData;
    Cargar_Instrucciones.edit = true;
    Cargar_Instrucciones.isNew = true;
    const length = this.dataSourceCargar_Instrucciones.data.length;
    const index = length - 1;
    const formCargar_Instrucciones = this.Cargar_InstruccionesItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceCargar_Instrucciones.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addCargar_Instrucciones(entity: Detalle_cargar_instrucciones) {
    const Cargar_Instrucciones = new Detalle_cargar_instrucciones(this.fb);
    this.Cargar_InstruccionesItems.push(Cargar_Instrucciones.buildFormGroup());
    if (entity) {
      Cargar_Instrucciones.fromObject(entity);
    }
	return entity;
  }  

  Cargar_InstruccionesItemsByFolio(Folio: number): FormGroup {
    return (this.Boletines_Directivas_aeronavegatibilidadForm.get('Detalle_cargar_instruccionesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Cargar_InstruccionesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceCargar_Instrucciones.data.indexOf(element);
	  let fb = this.Cargar_InstruccionesItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteCargar_Instrucciones(element: any) {
    let index = this.dataSourceCargar_Instrucciones.data.indexOf(element);
    this.Cargar_InstruccionesData[index].IsDeleted = true;
    this.dataSourceCargar_Instrucciones.data = this.Cargar_InstruccionesData;
    this.dataSourceCargar_Instrucciones.data.splice(index, 1);
    this.dataSourceCargar_Instrucciones._updateChangeSubscription();
    index = this.dataSourceCargar_Instrucciones.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditCargar_Instrucciones(element: any) {
    let index = this.dataSourceCargar_Instrucciones.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Cargar_InstruccionesData[index].IsDeleted = true;
      this.dataSourceCargar_Instrucciones.data = this.Cargar_InstruccionesData;
      this.dataSourceCargar_Instrucciones.data.splice(index, 1);
      this.dataSourceCargar_Instrucciones._updateChangeSubscription();
      index = this.Cargar_InstruccionesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveCargar_Instrucciones(element: any) {
    const index = this.dataSourceCargar_Instrucciones.data.indexOf(element);
    const formCargar_Instrucciones = this.Cargar_InstruccionesItems.controls[index] as FormGroup;
	
    this.Cargar_InstruccionesData[index].isNew = false;
    this.dataSourceCargar_Instrucciones.data = this.Cargar_InstruccionesData;
    this.dataSourceCargar_Instrucciones._updateChangeSubscription();
  }
  
  editCargar_Instrucciones(element: any) {
    const index = this.dataSourceCargar_Instrucciones.data.indexOf(element);
    const formCargar_Instrucciones = this.Cargar_InstruccionesItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_cargar_instrucciones(Folio: number) {
    this.dataSourceCargar_Instrucciones.data.forEach(async (d, index) => {
      const data = this.Cargar_InstruccionesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Boletines_Directivas_aeronavegatibilidad = Folio;
    model.IdBoletines_Directivas = Folio;
	
	  const FolioCargar_Instrucciones = await this.saveCargar_Instrucciones_Detalle_cargar_instrucciones(index);
      d.Cargar_Instrucciones = FolioCargar_Instrucciones > 0 ? FolioCargar_Instrucciones : null;  

      model.Cargar_Instrucciones = d.Cargar_Instrucciones;
      
      if (model.Folio === 0) {
        // Add Cargar Instrucciones
		let response = await this.Detalle_cargar_instruccionesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formCargar_Instrucciones = this.Cargar_InstruccionesItemsByFolio(model.Folio);
        if (formCargar_Instrucciones.dirty) {
          // Update Cargar Instrucciones
          let response = await this.Detalle_cargar_instruccionesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Cargar Instrucciones
        await this.Detalle_cargar_instruccionesService.delete(model.Folio).toPromise();
      }
    });
  }

  getCargar_Instrucciones_Detalle_cargar_instrucciones(element: any) {
    const index = this.dataSourceCargar_Instrucciones.data.indexOf(element);
    const formDetalle_cargar_instrucciones = this.Cargar_InstruccionesItems.controls[index] as FormGroup;
    return formDetalle_cargar_instrucciones.controls.Cargar_InstruccionesFile.value && formDetalle_cargar_instrucciones.controls.Cargar_InstruccionesFile.value !== '' ?
      formDetalle_cargar_instrucciones.controls.Cargar_InstruccionesFile.value.files[0].name : '';
  }

  async getCargar_Instrucciones_Detalle_cargar_instruccionesClick(element: any) {
    const index = this.dataSourceCargar_Instrucciones.data.indexOf(element);
    const formDetalle_cargar_instrucciones = this.Cargar_InstruccionesItems.controls[index] as FormGroup;
    if (formDetalle_cargar_instrucciones.controls.Cargar_InstruccionesFile.valid
      && formDetalle_cargar_instrucciones.controls.Cargar_InstruccionesFile.dirty) {
      const Cargar_Instrucciones = formDetalle_cargar_instrucciones.controls.Cargar_InstruccionesFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Instrucciones);
      this.helperService.dowloadFileFromArray(byteArray, Cargar_Instrucciones.name);
    }
  }

  removeCargar_Instrucciones_Detalle_cargar_instrucciones(element: any) {
    const index = this.dataSourceCargar_Instrucciones.data.indexOf(element);
    this.Cargar_Instrucciones_Detalle_cargar_instrucciones[index] = '';
    this.Cargar_InstruccionesData[index].Cargar_Instrucciones = 0;

    const formDetalle_cargar_instrucciones = this.Cargar_InstruccionesItems.controls[index] as FormGroup;
    if (formDetalle_cargar_instrucciones.controls.Cargar_InstruccionesFile.valid
      && formDetalle_cargar_instrucciones.controls.Cargar_InstruccionesFile.dirty) {
      formDetalle_cargar_instrucciones.controls.Cargar_InstruccionesFile = null;
    }
  } 

  async saveCargar_Instrucciones_Detalle_cargar_instrucciones(index: number): Promise<number> {
    const formCargar_Instrucciones = this.Cargar_InstruccionesItems.controls[index] as FormGroup;
    if (formCargar_Instrucciones.controls.Cargar_InstruccionesFile.valid
      && formCargar_Instrucciones.controls.Cargar_InstruccionesFile.dirty) {
      const Cargar_Instrucciones = formCargar_Instrucciones.controls.Cargar_InstruccionesFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Instrucciones);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Instrucciones.name,
        Date_Time: Cargar_Instrucciones.lastModifiedDate,
        File_Size: Cargar_Instrucciones.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return 0;
    }
  }

  hasCargar_Instrucciones_Detalle_cargar_instrucciones(element) {
    return this.getCargar_Instrucciones_Detalle_cargar_instrucciones(element) !== '' ||
      (element.Cargar_Instrucciones_Spartane_File && element.Cargar_Instrucciones_Spartane_File.File_Id > 0);
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Boletines_Directivas_aeronavegatibilidadForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.ProcedenciaService.getAll());
    observablesArray.push(this.Tipo_de_urgenciaService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varProcedencia , varTipo_de_urgencia  ]) => {
          this.varProcedencia = varProcedencia;
          this.varTipo_de_urgencia = varTipo_de_urgencia;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Boletines_Directivas_aeronavegatibilidadForm.get('Aeronave').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAeronave = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.AeronaveSeleccion = value;

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
      this.isLoadingAeronave = false;
      this.hasOptionsAeronave = result?.Aeronaves?.length > 0;

      if(this.AeronaveSeleccion != null && this.AeronaveSeleccion != "") {
        if(result.Aeronaves.length == 1) {
          this.Boletines_Directivas_aeronavegatibilidadForm.get('Aeronave').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
        }
      }
	    
	    this.optionsAeronave = of(result?.Aeronaves);

      if(this.cargaMatriculaDesdeEdicion) {
        this.cargaMatriculaDesdeEdicion = false;
      }

    }, error => {
      this.isLoadingAeronave = false;
      this.hasOptionsAeronave = false;
      this.optionsAeronave = of([]);
    });
    this.Boletines_Directivas_aeronavegatibilidadForm.get('Modelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingModelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.ModeloSeleccionado = value;
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

      if(this.ModeloSeleccionado != null && this.ModeloSeleccionado != "") {
        this.Boletines_Directivas_aeronavegatibilidadForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      }
	    
	    this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Boletines_Directivas_aeronavegatibilidadForm.get('N_Serie').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingN_Serie = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.NSerieSeleccionado = value;
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
      this.isLoadingN_Serie = false;
      this.hasOptionsN_Serie = result?.Aeronaves?.length > 0;

      if(this.NSerieSeleccionado != null && this.NSerieSeleccionado != "") {
        this.Boletines_Directivas_aeronavegatibilidadForm.get('N_Serie').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      }
	    
	    this.optionsN_Serie = of(result?.Aeronaves);
    }, error => {
      this.isLoadingN_Serie = false;
      this.hasOptionsN_Serie = false;
      this.optionsN_Serie = of([]);
    });
    this.Boletines_Directivas_aeronavegatibilidadForm.get('Codigo_ATA').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCodigo_ATA = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.Codigo_ATASeleccionado = value;
        if (!value) return this.Catalogo_codigo_ATAService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Catalogo_codigo_ATAService.listaSelAll(0, 20, '');
          return this.Catalogo_codigo_ATAService.listaSelAll(0, 20,
            "Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Catalogo_codigo_ATAService.listaSelAll(0, 20,
          "Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + value.Codigo_ATA_Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCodigo_ATA = false;
      this.hasOptionsCodigo_ATA = result?.Catalogo_codigo_ATAs?.length > 0;

      if(this.Codigo_ATASeleccionado != null && this.Codigo_ATASeleccionado != "") {
        this.Boletines_Directivas_aeronavegatibilidadForm.get('Codigo_ATA').setValue(result?.Catalogo_codigo_ATAs[0], { onlySelf: true, emitEvent: false });
      }
	    
	    this.optionsCodigo_ATA = of(result?.Catalogo_codigo_ATAs);
    }, error => {
      this.isLoadingCodigo_ATA = false;
      this.hasOptionsCodigo_ATA = false;
      this.optionsCodigo_ATA = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Procedencia': {
        this.ProcedenciaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varProcedencia = x.Procedencias;
        });
        break;
      }
      case 'Tipo': {
        this.Tipo_de_urgenciaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_urgencia = x.Tipo_de_urgencias;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

displayFnAeronave(option: Aeronave) {
    return option?.Matricula;
  }
displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
displayFnN_Serie(option: Aeronave) {
    return option?.Numero_de_Serie;
  }
displayFnCodigo_ATA(option: Catalogo_codigo_ATA) {
    return option?.Codigo_ATA_Descripcion;
  }


  async save() {
    if( await this.saveData() == false) { 
      return; 
    }
    else{
      this.goToList();
    }
  }

  async saveData(): Promise<boolean> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (await this.rulesBeforeSave()) {
      const entity = this.Boletines_Directivas_aeronavegatibilidadForm.value;
      entity.Folio = this.model.Folio;

      entity.Aeronave = this.Boletines_Directivas_aeronavegatibilidadForm.get('Aeronave').value.Matricula;
      entity.Modelo = this.Boletines_Directivas_aeronavegatibilidadForm.get('Modelo').value.Clave;
      entity.N_Serie = this.Boletines_Directivas_aeronavegatibilidadForm.get('N_Serie').value.Matricula;
      entity.Codigo_ATA = this.Boletines_Directivas_aeronavegatibilidadForm.get('Codigo_ATA').value.Folio;
      entity.Tipo = this.Boletines_Directivas_aeronavegatibilidadForm.get('Tipo').value;	  

      entity.Crear_reporte = this.Boletines_Directivas_aeronavegatibilidadForm.get('Crear_reporte').value;	
      entity.Es_recurrente = this.Boletines_Directivas_aeronavegatibilidadForm.get('Es_recurrente').value;	
      entity.Horas = this.Boletines_Directivas_aeronavegatibilidadForm.get('Horas').value;	
      entity.Dias = this.Boletines_Directivas_aeronavegatibilidadForm.get('Dias').value;	
      entity.Meses = this.Boletines_Directivas_aeronavegatibilidadForm.get('Meses').value;	
      entity.Ciclos = this.Boletines_Directivas_aeronavegatibilidadForm.get('Ciclos').value;	      
      entity.Fecha_de_creacion = this.Boletines_Directivas_aeronavegatibilidadForm.get('Fecha_de_creacion').value;
      entity.N_de_boletin_directiva_aeronavegabilidad = this.Boletines_Directivas_aeronavegatibilidadForm.get('N_de_boletin_directiva_aeronavegabilidad').value;
      entity.titulo_de_boletin_o_directiva = this.Boletines_Directivas_aeronavegatibilidadForm.get('titulo_de_boletin_o_directiva').value;
      entity.Procedencia = this.Boletines_Directivas_aeronavegatibilidadForm.get('Procedencia').value;
	  
	  if (this.model.Folio > 0 ) {
        await this.Boletines_Directivas_aeronavegatibilidadService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_cargar_instrucciones(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
      } else {
        await (this.Boletines_Directivas_aeronavegatibilidadService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_cargar_instrucciones(id);

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
      this.Boletines_Directivas_aeronavegatibilidadForm.reset();
      this.model = new Boletines_Directivas_aeronavegatibilidad(this.fb);
      this.Boletines_Directivas_aeronavegatibilidadForm = this.model.buildFormGroup();
      this.dataSourceCargar_Instrucciones = new MatTableDataSource<Detalle_cargar_instrucciones>();
      this.Cargar_InstruccionesData = [];

    } else {
      this.router.navigate(['views/Boletines_Directivas_aeronavegatibilidad/add']);
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
    this.router.navigate(['/Boletines_Directivas_aeronavegatibilidad/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

    async Aeronave_ExecuteBusinessRules(): Promise<void> {

    //INICIA - BRID:3130 - a seleccionar la aeronave cargar campos modelo n serie - Autor: Yamir - Actualización: 9/17/2021 6:26:10 PM

      setTimeout(async time => {
        let matricula = this.Boletines_Directivas_aeronavegatibilidadForm.controls.Aeronave.value.Matricula;
        let modelo = await this.brf.EvaluaQueryAsync(`SELECT Descripcion FROM Modelos WHERE Clave =(SELECT modelo FROM Aeronave where matricula ='${matricula}')`, 1, "ABC123");
        let serie = await this.brf.EvaluaQueryAsync(`SELECT Numero_de_Serie FROM Aeronave where matricula = '${matricula}'`, 1, "ABC123");

        this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Modelo", modelo);    
        this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm, "N_Serie", serie.toString());
      }, 500);

    //TERMINA - BRID:3130

    //Aeronave_FieldExecuteBusinessRulesEnd

    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    N_Serie_ExecuteBusinessRules(): void {
        //N_Serie_FieldExecuteBusinessRulesEnd
    }
    Procedencia_ExecuteBusinessRules(): void {

    //INICIA - BRID:3541 - Si procedencia es "Directiva" tipo debe ser "Obligatorio" - Autor: Administrador - Actualización: 5/27/2021 4:30:43 PM
    if( this.Boletines_Directivas_aeronavegatibilidadForm.get('Procedencia').value==this.brf.TryParseInt('2', '2') ) { 
      this.brf.ShowFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo"); 
      this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo", "4"); 
      this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Tipo', 0);
    } else { 
      this.brf.ShowFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo"); 
      this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Tipo', 1);
      this.Boletines_Directivas_aeronavegatibilidadForm.get('Tipo').setValue(0);
    }
    //TERMINA - BRID:3541

    //INICIA - BRID:3544 - Ocultar campo "Tipo" si "Procedencia" es Null - Autor: Administrador - Actualización: 5/27/2021 5:33:26 PM
    if( this.Boletines_Directivas_aeronavegatibilidadForm.get('Procedencia').value == undefined || this.Boletines_Directivas_aeronavegatibilidadForm.get('Procedencia').value == '' ) { 
      this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo"); 
      this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo");
      this.Boletines_Directivas_aeronavegatibilidadForm.get('Tipo').setValue(0);
    } 
    else { 
      this.brf.ShowFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo");
    }
    //TERMINA - BRID:3544

    //Procedencia_FieldExecuteBusinessRulesEnd

    }
    Tipo_ExecuteBusinessRules(): void {
        //Tipo_FieldExecuteBusinessRulesEnd
    }
    N_de_boletin_directiva_aeronavegabilidad_ExecuteBusinessRules(): void {
        //N_de_boletin_directiva_aeronavegabilidad_FieldExecuteBusinessRulesEnd
    }
    titulo_de_boletin_o_directiva_ExecuteBusinessRules(): void {
        //titulo_de_boletin_o_directiva_FieldExecuteBusinessRulesEnd
    }
    Codigo_ATA_ExecuteBusinessRules(): void {
        //Codigo_ATA_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_creacion_ExecuteBusinessRules(): void {
        //Fecha_de_creacion_FieldExecuteBusinessRulesEnd
    }
    Crear_reporte_ExecuteBusinessRules(): void {
        //Crear_reporte_FieldExecuteBusinessRulesEnd
    }
    Horas_ExecuteBusinessRules(): void {

    //INICIA - BRID:6125 - Asignar NO Requerido para meses y ciclos cuando hay valor en Horas - Autor: Aaron - Actualización: 9/15/2021 11:06:32 AM
    if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')!= '' ) { 
      this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
      this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos"); 
      this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
    } else {}
    //TERMINA - BRID:6125


    //INICIA - BRID:6126 - requeridos horas 1 - Autor: Aaron - Actualización: 9/15/2021 11:06:33 AM
    if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')== '' 
      && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')== '' 
      && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos')== '' ) { 
        this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
        this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
        this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos");
    } else {}
    //TERMINA - BRID:6126


    //INICIA - BRID:6142 - Requerido cuando se vacian los campos y Ciclos sigue con valor - Autor: Aaron - Actualización: 9/15/2021 11:06:29 AM
    if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos') != '' 
      && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')== '' 
      && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')== '' ) { 
        this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
        this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses"); 
        this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos");
    } else {}
    //TERMINA - BRID:6142


    //INICIA - BRID:6143 - Requerido cuando se vacian los campos y Meses sigue con valor - Autor: Aaron - Actualización: 9/15/2021 11:06:30 AM
    if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')== '' 
      && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos')== ''
      && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')!= '' ) { 
        this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
        this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos"); 
        this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
    } else {}
    //TERMINA - BRID:6143

    //Horas_FieldExecuteBusinessRulesEnd


    }
    Dias_ExecuteBusinessRules(): void {
        //Dias_FieldExecuteBusinessRulesEnd
    }
    Meses_ExecuteBusinessRules(): void {

//INICIA - BRID:6127 - asignar requerido meses - Autor: Aaron - Actualización: 9/15/2021 11:06:58 AM
if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')!= '' ) { 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos"); 
  this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
} else {}
//TERMINA - BRID:6127

//INICIA - BRID:6128 - Asignar requerido meses 1 - Autor: Aaron - Actualización: 9/15/2021 11:06:59 AM
if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')== ''
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')== '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos')== '' ) { 
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos");
  } else {}
//TERMINA - BRID:6128


//INICIA - BRID:6145 - Asignar requerido a Horas cuando se vacian los demas campos - Autor: Aaron - Actualización: 9/15/2021 11:06:55 AM
if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')!= ''
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')== '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos')== '' ) { 
    this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
    this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos"); 
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
} else {}
//TERMINA - BRID:6145


//INICIA - BRID:6146 - Asignar Requerido a Ciclos cuando se vacian los demas campos - Autor: Aaron - Actualización: 9/15/2021 11:06:56 AM
if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')== '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')!= '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos')== '' ) { 
    this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
    this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses"); 
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos");
} else {}
//TERMINA - BRID:6146

//Meses_FieldExecuteBusinessRulesEnd


    }
    Ciclos_ExecuteBusinessRules(): void {

//INICIA - BRID:6129 - Asignar NO requerido a Horas Meses cuando se selecciona Ciclos - Autor: Aaron - Actualización: 9/15/2021 11:07:28 AM
if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos')!= '' ) { 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses"); 
  this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos");
} else {}
//TERMINA - BRID:6129


//INICIA - BRID:6130 - asignar requerido ciclos 1 - Autor: Aaron - Actualización: 9/15/2021 11:07:30 AM
if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos')== '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')== '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')== '' ) { 
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos");
} else {}
//TERMINA - BRID:6130


//INICIA - BRID:6147 - Asignar requerido a Horas cuando se vacian los otros campos - Autor: Aaron - Actualización: 9/15/2021 11:07:25 AM
if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')!= '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')== '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos')== '' ) { 
    this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
    this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos"); 
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
} else {}
//TERMINA - BRID:6147


//INICIA - BRID:6148 - Asignar requerido a Meses cuando se vacian los otros campos - Autor: Aaron - Actualización: 9/15/2021 11:07:27 AM
if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas')== '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses')!= '' 
  && this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos')== '' ) { 
    this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
    this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos"); 
    this.brf.SetRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
} else {}
//TERMINA - BRID:6148

//Ciclos_FieldExecuteBusinessRulesEnd


    }
    Es_recurrente_ExecuteBusinessRules(): void {

//INICIA - BRID:6141 - Al seleccionar recurrencia como verdadero. - Autor: Eliud Hernandez - Actualización: 11/1/2021 10:13:48 AM
if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Es_recurrente')==this.brf.TryParseInt('true', 'true') ) { 
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas', 1);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses', 1);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos', 1);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Dias', 1);
} 
else { 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos");

  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas', 0);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses', 0);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos', 0);
   
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Horas", '');
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Meses",'');
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Ciclos", ''); 

  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Horas", null);
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Meses", null);
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Ciclos", null); 

  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Dias"); 

  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas', 0);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses', 0);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos', 0);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Dias', 0); 

  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Horas", '');
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Meses", '');
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Ciclos", '');
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Dias", '');

  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Horas", null);
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Meses", null);
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Ciclos", null); 
  this.brf.SetValueControl(this.Boletines_Directivas_aeronavegatibilidadForm,"Dias", null);
}
//TERMINA - BRID:6141

//Es_recurrente_FieldExecuteBusinessRulesEnd

    }
    LimitesEnDias_ExecuteBusinessRules(): void {
        //LimitesEnDias_FieldExecuteBusinessRulesEnd
    }
    DiasTranscurridos_ExecuteBusinessRules(): void {
        //DiasTranscurridos_FieldExecuteBusinessRulesEnd
    }
    DiasFaltantes_ExecuteBusinessRules(): void {
        //DiasFaltantes_FieldExecuteBusinessRulesEnd
    }
    HorasFaltantes_ExecuteBusinessRules(): void {
        //HorasFaltantes_FieldExecuteBusinessRulesEnd
    }
    CiclosFaltantes_ExecuteBusinessRules(): void {
        //CiclosFaltantes_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
    }
    HorasTranscurridas_ExecuteBusinessRules(): void {
        //HorasTranscurridas_FieldExecuteBusinessRulesEnd
    }
    MesesTranscurridos_ExecuteBusinessRules(): void {
        //MesesTranscurridos_FieldExecuteBusinessRulesEnd
    }
    MesesFaltantes_ExecuteBusinessRules(): void {
        //MesesFaltantes_FieldExecuteBusinessRulesEnd
    }
    CiclosTranscurridos_ExecuteBusinessRules(): void {
        //CiclosTranscurridos_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:3135 - Deshabilitar campos y ocultar folio - Autor: Yamir - Actualización: 6/15/2021 12:24:42 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Folio"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Folio"); 
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Modelo', 0);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'N_Serie', 0);
} 
//TERMINA - BRID:3135

//INICIA - BRID:3540 - ocultar campo crear reporte - Autor: Administrador - Actualización: 5/27/2021 2:05:39 PM
if(  this.operation == 'New' ) {
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Crear_reporte"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Crear_reporte");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo"); 
} 
//TERMINA - BRID:3540

//INICIA - BRID:3545 - Al abrir pantalla ocultar "Tipo" si "Procedencia" es null - Autor: Administrador - Actualización: 5/27/2021 5:37:38 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  if( this.Boletines_Directivas_aeronavegatibilidadForm.get('Procedencia').value == null || this.Boletines_Directivas_aeronavegatibilidadForm.get('Procedencia').value == undefined) {  
    this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo");
  } else {}
} 
//TERMINA - BRID:3545

//INICIA - BRID:5592 - al seleccionar es recurrente - Autor: Eliud Hernandez - Actualización: 11/1/2021 10:12:52 AM
if(  this.operation == 'Update' ) {
  if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Es_recurrente')==this.brf.TryParseInt('true', 'true') ) { 
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas', 1);
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses', 1);
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos', 1);
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Dias', 1);
  } else { 
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas', 0);
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses', 0);
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos', 0); 
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas', 0);
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses', 0);
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos', 0);
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Dias', 0);
  }

  if( this.Boletines_Directivas_aeronavegatibilidadForm.get('Procedencia').value==this.brf.TryParseInt('2', '2') ) { 
    this.brf.ShowFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo");
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Tipo', 0);
  } else { 
    this.brf.ShowFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Tipo"); 
    this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Tipo', 1);
  }

} 
//TERMINA - BRID:5592

//INICIA - BRID:6144 - no requeridos los campos. - Autor: Eliud Hernandez - Actualización: 11/1/2021 5:07:53 PM
if(  this.operation == 'New' ) {
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Horas', 0);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Meses', 0);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Ciclos', 0);
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Dias', 0);
} 
//TERMINA - BRID:6144

//INICIA - BRID:6309 - ocultar columnas de cálculos para boletines en notificaciones de mantenimiento  - Autor: Yamir - Actualización: 9/17/2021 5:38:48 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "LimitesEnDias"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "LimitesEnDias");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "DiasTranscurridos"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "DiasTranscurridos");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "DiasFaltantes"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "DiasFaltantes");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "HorasFaltantes"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "HorasFaltantes");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "CiclosFaltantes"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "CiclosFaltantes");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "Estatus"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Estatus");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "HorasTranscurridas"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "HorasTranscurridas");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "MesesTranscurridos"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "MesesTranscurridos");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "MesesFaltantes"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "MesesFaltantes");
  this.brf.HideFieldOfForm(this.Boletines_Directivas_aeronavegatibilidadForm, "CiclosTranscurridos"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "CiclosTranscurridos"); 
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "LimitesEnDias");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "DiasTranscurridos");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "DiasFaltantes");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "HorasFaltantes");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "CiclosFaltantes");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Estatus");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "HorasTranscurridas");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "MesesTranscurridos");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "MesesFaltantes");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "CiclosTranscurridos");
} 
//TERMINA - BRID:6309

//INICIA - BRID:7089 - Deshabilitar Crear Reporte al nuevo Boletines_Directivas_aeronavegatibilidad - Autor: Agustín Administrador - Actualización: 10/8/2021 4:26:39 PM
if(  this.operation == 'New' ) {
  this.brf.SetEnabledControl(this.Boletines_Directivas_aeronavegatibilidadForm, 'Crear_reporte', 0);
} 
//TERMINA - BRID:7089

//INICIA - BRID:7242 - Asignar no requeridos a los campos - Autor: Eliud Hernandez - Actualización: 11/1/2021 5:20:32 PM
if(  this.operation == 'Update' ) {
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Horas");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Meses");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Ciclos");
  this.brf.SetNotRequiredControl(this.Boletines_Directivas_aeronavegatibilidadForm, "Dias");
} 
//TERMINA - BRID:7242

//rulesOnInit_ExecuteBusinessRulesEnd

  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:3539 - ejecutar SP que inserta registro en la pantalla de crear reporte - Autor: Administrador - Actualización: 7/14/2021 3:17:41 PM
if(  this.operation == 'Update' ) {
  if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Crear_reporte')==this.brf.TryParseInt('true', 'true') ) { 
    this.brf.EvaluaQuery(`exec Crear_reportes_de_boletin_y_directiva ${this.model.Folio}`, 1, "ABC123");
  } else {}
} 
//TERMINA - BRID:3539


//INICIA - BRID:4539 - Enviar correo al generar un nuevo Boletin o Directiva - Autor: Aaron - Actualización: 7/29/2021 3:06:44 PM
if(  this.operation == 'Update' ) {
  // if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Crear_reporte')==this.brf.TryParseInt('true', 'true') ) { 
  //   this.brf.SendEmailQuery("Aviso de creación de reporte", 
  //     this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (19,9,43,17)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User = GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <title>EmailTemplate-Fluid</title> <style type='text/css'> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*='margin: 16px 0'] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'> <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0' style='border-collapse:collapse;'> <tr> <td> <center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --> <div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'> Aerovics </div> <!-- Visually Hidden Preheader Text : END --> <div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'> <tr> <td width='40'>&nbsp;</td> <td width='260'> <img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'> </td> <td>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> <tr> <td width='40'>&nbsp;</td> <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td> <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing='0' cellpadding='0' border='0' width='100%'> <tr>  <td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'>  <p>Buenos días</p> <p>Ha sido registrado un nuevo reporte en la base de datos con la siguiente Información:</p> <br> <p><strong>No. de reporte:</strong> GLOBAL[KeyValueInserted]</p> <br><p><strong>Matrícula:</strong> GLOBAL[matricula]</p> <br> <p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p> <br><p><strong>Tipo de código:</strong> Código ATA</p> <br> <p><strong>Código:</strong> GLOBAL[codigo_ata]</p><br> <p><strong> Descripción:  </strong> Boletines y Directivas</p> <br><br><p><strong>Trabajo Por Realizar: </strong> Revisar el reporte generado a partir de Boletines y Directivas</p> <br><p><strong>Atentamente:</strong> GLOBAL[nombre_usuario]</p> <p>Favor de enviar acuse de recibido.</p>  <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>  </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>");
  // } else {}
} 
//TERMINA - BRID:4539


//INICIA - BRID:5671 - limpiar campos cuando no es recurrente  - Autor: Yamir - Actualización: 9/2/2021 7:16:13 PM
if(  this.operation == 'Update' ) {
  if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Es_recurrente')==this.brf.TryParseInt('false', 'false') ) { 
    this.brf.EvaluaQuery(`exec sp_limpiar_campos_horas_meses_ciclos '${this.model.Folio}'`, 1, "ABC123");
  } else {}
} 
//TERMINA - BRID:5671

//rulesAfterSave_ExecuteBusinessRulesEnd

  }
  
  async rulesBeforeSave(): Promise<boolean> {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:4537 - Crear variables de sesión para envío de correos Boletines y Directivas - Autor: Aaron - Actualización: 7/29/2021 2:39:57 PM
if(  this.operation == 'Update' ) {
  // this.brf.CreateSessionVar("matricula",this.brf.EvaluaQuery("Select 'FLD[Aeronave]'", 1, "ABC123"), 1,"ABC123"); 
  // this.brf.CreateSessionVar("numero_de_serie",this.brf.EvaluaQuery("  Select Numero_de_Serie From Aeronave Where Matricula = 'FLD[Aeronave]'", 1, "ABC123"), 1,"ABC123"); 
  // this.brf.CreateSessionVar("codigo_ata",this.brf.EvaluaQuery(" Select 'FLD[Codigo_ATA]'", 1, "ABC123"), 1,"ABC123"); 
  // this.brf.CreateSessionVar("boletin",this.brf.EvaluaQuery(" Select 'FLDD[Folio]'", 1, "ABC123"), 1,"ABC123");
} 
//TERMINA - BRID:4537


// //INICIA - BRID:5595 - Horas, meses y ciclos 123 - Autor: Aaron - Actualización: 9/2/2021 4:50:45 PM
// if(  this.operation == 'New' || this.operation == 'Update' ) {

//   let horas = this.Boletines_Directivas_aeronavegatibilidadForm.get('Horas').value;
//   let ciclos = this.Boletines_Directivas_aeronavegatibilidadForm.get('Ciclos').value;
//   let meses = this.Boletines_Directivas_aeronavegatibilidadForm.get('Meses').value;

//   if( await this.brf.EvaluaQueryAsync(` EXEC ValidarHorasCiclosMeses ${horas}, ${ciclos}, ${meses} `, 1, 'ABC123')==this.brf.TryParseInt('0', '0') ) { 
//     alert("Se debe de seleccionar dos opciones entre Horas, Meses y Ciclos.");
//     result=false;
//   } else {}
// } 
// //TERMINA - BRID:5595


//INICIA - BRID:7238 - validar que se utilice un valor de los 4 campos. - Autor: Eliud Hernandez - Actualización: 11/1/2021 12:50:52 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  if( this.brf.GetValueByControlType(this.Boletines_Directivas_aeronavegatibilidadForm, 'Es_recurrente')==this.brf.TryParseInt('true', 'true') 
    && this.Boletines_Directivas_aeronavegatibilidadForm.get('Horas').value == '' 
    && this.Boletines_Directivas_aeronavegatibilidadForm.get('Dias').value == '' 
    && this.Boletines_Directivas_aeronavegatibilidadForm.get('Ciclos').value == '' 
    && this.Boletines_Directivas_aeronavegatibilidadForm.get('Meses').value == '' ) { 

      alert('Para guardar debe especificar ya sea Horas, Dias, ciclos o Meses');
      result=false;
  } else {}
} 
//TERMINA - BRID:7238

//rulesBeforeSave_ExecuteBusinessRulesEnd



    return result;
  }

  //Fin de reglas
  
}
