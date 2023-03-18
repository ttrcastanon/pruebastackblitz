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
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';

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
  selector: 'app-Catalogo_codigo_ATA',
  templateUrl: './Catalogo_codigo_ATA.component.html',
  styleUrls: ['./Catalogo_codigo_ATA.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Catalogo_codigo_ATAComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Catalogo_codigo_ATAForm: FormGroup;
	public Editor = ClassicEditor;
	model: Catalogo_codigo_ATA;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;

	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
	
	today = new Date;
	consult: boolean = false;
  cargaModelo: boolean = true;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Catalogo_codigo_ATAService: Catalogo_codigo_ATAService,
    private ModelosService: ModelosService,

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
    this.model = new Catalogo_codigo_ATA(this.fb);
    this.Catalogo_codigo_ATAForm = this.model.buildFormGroup();
	
	this.Catalogo_codigo_ATAForm.get('Folio').disable();
    this.Catalogo_codigo_ATAForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
		
          this.Catalogo_codigo_ATAForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Catalogo_codigo_ATA)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Catalogo_codigo_ATAForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Catalogo_codigo_ATAService.listaSelAll(0, 1, 'Catalogo_codigo_ATA.Folio=' + id).toPromise();
	if (result.Catalogo_codigo_ATAs.length > 0) {
	  
        this.model.fromObject(result.Catalogo_codigo_ATAs[0]);
        this.Catalogo_codigo_ATAForm.get('Modelo').setValue(
          result.Catalogo_codigo_ATAs[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );

		this.Catalogo_codigo_ATAForm.markAllAsTouched();
		this.Catalogo_codigo_ATAForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Catalogo_codigo_ATAForm.disabled ? "Update" : this.operation;
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

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([]) => {

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Catalogo_codigo_ATAForm.get('Modelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingModelo = true),
      distinctUntilChanged(),
      switchMap(value => {
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
	    if(this.model.Folio > 0 && (this.cargaModelo || result?.Modeloss?.length == 1)) {
        this.cargaModelo = false;
        this.Catalogo_codigo_ATAForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      }
	    this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

displayFnModelo(option: Modelos) {
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
      const entity = this.Catalogo_codigo_ATAForm.value;
      entity.Folio = this.model.Folio;
      entity.Modelo = this.Catalogo_codigo_ATAForm.get('Modelo').value.Clave;
	  	entity.Codigo_ATA_Descripcion = `${entity.Codigo_ATA} - ${entity.Descripcion}`;
	  
	  if (this.model.Folio > 0 ) {
        await this.Catalogo_codigo_ATAService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Catalogo_codigo_ATAService.insert(entity).toPromise().then(async id => {

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
    if (this.model.Folio === 0 ) {
      this.Catalogo_codigo_ATAForm.reset();
      this.model = new Catalogo_codigo_ATA(this.fb);
      this.Catalogo_codigo_ATAForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Catalogo_codigo_ATA/add']);
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
    this.router.navigate(['/Catalogo_codigo_ATA/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Codigo_ATA_ExecuteBusinessRules(): void {
        //Codigo_ATA_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Codigo_ATA_Descripcion_ExecuteBusinessRules(): void {
        //Codigo_ATA_Descripcion_FieldExecuteBusinessRulesEnd
    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4181 - Ocultar "Folio" Catalogo codigo ATA - Autor: Administrador - Actualización: 7/20/2021 1:12:16 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Catalogo_codigo_ATAForm, "Folio"); this.brf.SetNotRequiredControl(this.Catalogo_codigo_ATAForm, "Folio");
} 
//TERMINA - BRID:4181


//INICIA - BRID:4182 - Ocultar y quitar requerido "Codigo_ATA_Descripcion" - Autor: Administrador - Actualización: 7/20/2021 1:13:55 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetNotRequiredControl(this.Catalogo_codigo_ATAForm, "Codigo_ATA_Descripcion"); this.brf.HideFieldOfForm(this.Catalogo_codigo_ATAForm, "Codigo_ATA_Descripcion"); this.brf.SetNotRequiredControl(this.Catalogo_codigo_ATAForm, "Codigo_ATA_Descripcion");
} 
//TERMINA - BRID:4182


//INICIA - BRID:4183 - Acomodo de campos Catalogo_codigo_ATA - Autor: Administrador - Actualización: 7/20/2021 1:16:41 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4183

//rulesOnInit_ExecuteBusinessRulesEnd



  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit
//rulesAfterSave_ExecuteBusinessRulesEnd
  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:4179 - Antes de guardar concatenar "Código ATA" y "Descripción" - Autor: Administrador - Actualización: 7/20/2021 1:10:37 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetValueFromQuery(this.Catalogo_codigo_ATAForm,"Codigo_ATA_Descripcion",this.brf.EvaluaQuery("SELECT ('FLD[Codigo_ATA]'+ ' - ' + 'FLD[Descripcion]')", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:4179

//rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas
  
}
