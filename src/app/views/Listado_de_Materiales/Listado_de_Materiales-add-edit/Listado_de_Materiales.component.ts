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
import { Listado_de_MaterialesService } from 'src/app/api-services/Listado_de_Materiales.service';
import { Listado_de_Materiales } from 'src/app/models/Listado_de_Materiales';
import { Categoria_de_PartesService } from 'src/app/api-services/Categoria_de_Partes.service';
import { Categoria_de_Partes } from 'src/app/models/Categoria_de_Partes';

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
  selector: 'app-Listado_de_Materiales',
  templateUrl: './Listado_de_Materiales.component.html',
  styleUrls: ['./Listado_de_Materiales.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Listado_de_MaterialesComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Listado_de_MaterialesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Listado_de_Materiales;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varCategoria_de_Partes: Categoria_de_Partes[] = [];

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

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Listado_de_MaterialesService: Listado_de_MaterialesService,
    private Categoria_de_PartesService: Categoria_de_PartesService,

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
    this.model = new Listado_de_Materiales(this.fb);
    this.Listado_de_MaterialesForm = this.model.buildFormGroup();
	
	this.Listado_de_MaterialesForm.get('Folio').disable();
    this.Listado_de_MaterialesForm.get('Folio').setValue('Auto');
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
		
          this.Listado_de_MaterialesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Listado_de_Materiales)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Listado_de_MaterialesService.listaSelAll(0, 1, 'Listado_de_Materiales.Folio=' + id).toPromise();
	if (result.Listado_de_Materialess.length > 0) {
	  
        this.model.fromObject(result.Listado_de_Materialess[0]);

		this.Listado_de_MaterialesForm.markAllAsTouched();
		this.Listado_de_MaterialesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Listado_de_MaterialesForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Categoria_de_PartesService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varCategoria_de_Partes ]) => {
          this.varCategoria_de_Partes = varCategoria_de_Partes;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Categoria': {
        this.Categoria_de_PartesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCategoria_de_Partes = x.Categoria_de_Partess;
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
      const entity = this.Listado_de_MaterialesForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Listado_de_MaterialesService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Listado_de_MaterialesService.insert(entity).toPromise().then(async id => {

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
      this.Listado_de_MaterialesForm.reset();
      this.model = new Listado_de_Materiales(this.fb);
      this.Listado_de_MaterialesForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Listado_de_Materiales/add']);
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
    this.router.navigate(['/Listado_de_Materiales/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Codigo_ExecuteBusinessRules(): void {
        this.Listado_de_MaterialesForm.get('Codigo_Descripcion').setValue(`${this.Listado_de_MaterialesForm.get('Codigo').value} - ${this.Listado_de_MaterialesForm.get('Descripcion').value}`);
        //Codigo_FieldExecuteBusinessRulesEnd
    }
    Categoria_ExecuteBusinessRules(): void {
        //Categoria_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
      this.Listado_de_MaterialesForm.get('Codigo_Descripcion').setValue(`${this.Listado_de_MaterialesForm.get('Codigo').value} - ${this.Listado_de_MaterialesForm.get('Descripcion').value}`);
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Codigo_Descripcion_ExecuteBusinessRules(): void {
        //Codigo_Descripcion_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:3935 - acomodo de campos  materiales - Autor: Agustín Administrador - Actualización: 8/3/2021 5:14:31 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:3935


//INICIA - BRID:3941 - Ocultar folio materiales - Autor: Administrador - Actualización: 6/17/2021 2:43:29 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Listado_de_MaterialesForm, "Folio"); this.brf.SetNotRequiredControl(this.Listado_de_MaterialesForm, "Folio");
} 
//TERMINA - BRID:3941


//INICIA - BRID:3942 - Ocultar y quitar requerido codigo/descripcion - Autor: Administrador - Actualización: 6/17/2021 2:45:20 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetNotRequiredControl(this.Listado_de_MaterialesForm, "Codigo_Descripcion"); this.brf.HideFieldOfForm(this.Listado_de_MaterialesForm, "Codigo_Descripcion"); this.brf.SetNotRequiredControl(this.Listado_de_MaterialesForm, "Codigo_Descripcion");
} 
//TERMINA - BRID:3942


//INICIA - BRID:4944 - Filtrar combo categoría  - Autor: Lizeth Villa - Actualización: 8/10/2021 7:02:44 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {

} 
//TERMINA - BRID:4944

//rulesOnInit_ExecuteBusinessRulesEnd




  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit
//rulesAfterSave_ExecuteBusinessRulesEnd
  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:3943 - Concatenar codigo y descripción antes de guardar - Autor: Administrador - Actualización: 6/17/2021 2:47:47 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetValueFromQuery(this.Listado_de_MaterialesForm,"Codigo_Descripcion",this.brf.EvaluaQuery("SELECT ('FLD[Codigo]'+ ' - ' + 'FLD[Descripcion]')", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:3943

//rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas
  
}
