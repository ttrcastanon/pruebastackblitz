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
import { PartesService } from 'src/app/api-services/Partes.service';
import { Partes } from 'src/app/models/Partes';
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
  selector: 'app-Partes',
  templateUrl: './Partes.component.html',
  styleUrls: ['./Partes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class PartesComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	PartesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Partes;
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
    private PartesService: PartesService,
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
    this.model = new Partes(this.fb);
    this.PartesForm = this.model.buildFormGroup();
	
	this.PartesForm.get('Folio').disable();
    this.PartesForm.get('Folio').setValue('Auto');
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
		
          this.PartesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Partes)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.PartesService.listaSelAll(0, 1, 'Partes.Folio=' + id).toPromise();
	if (result.Partess.length > 0) {
	  
        this.model.fromObject(result.Partess[0]);

		this.PartesForm.markAllAsTouched();
		this.PartesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.PartesForm.disabled ? "Update" : this.operation;
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
      const entity = this.PartesForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.PartesService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.PartesService.insert(entity).toPromise().then(async id => {

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
      this.PartesForm.reset();
      this.model = new Partes(this.fb);
      this.PartesForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Partes/add']);
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
    this.router.navigate(['/Partes/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Numero_de_parte_ExecuteBusinessRules(): void {
        //Numero_de_parte_FieldExecuteBusinessRulesEnd
    }
    Categoria_ExecuteBusinessRules(): void {

//INICIA - BRID:4941 - filtrar sin opción sin categoría - Autor: Lizeth Villa - Actualización: 8/10/2021 6:57:55 PM
      //if( this.brf.GetValueByControlType(this.PartesForm, 'Categoria')!=this.brf.TryParseInt('', '') ) { } else {}
//TERMINA - BRID:4941

//Categoria_FieldExecuteBusinessRulesEnd

    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Numero_de_parte_Descripcion_ExecuteBusinessRules(): void {
        //Numero_de_parte_Descripcion_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:3933 - acomodo de campos  partes - Autor: Agustín Administrador - Actualización: 7/30/2021 3:36:17 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:3933


//INICIA - BRID:3938 - Ocultar y quitar requerido numero de parte/descripcion - Autor: Administrador - Actualización: 6/17/2021 2:22:27 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.SetNotRequiredControl(this.PartesForm, "Numero_de_parte_Descripcion"); 
  this.brf.HideFieldOfForm(this.PartesForm, "Numero_de_parte_Descripcion"); 
  this.brf.SetNotRequiredControl(this.PartesForm, "Numero_de_parte_Descripcion");
} 
//TERMINA - BRID:3938


//INICIA - BRID:3940 - Ocultar folio partes - Autor: Administrador - Actualización: 6/17/2021 2:35:49 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.HideFieldOfForm(this.PartesForm, "Folio"); 
  this.brf.SetNotRequiredControl(this.PartesForm, "Folio");
} 
//TERMINA - BRID:3940


//INICIA - BRID:4942 - filtrar combo categoria - Autor: Lizeth Villa - Actualización: 8/10/2021 6:59:04 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {

} 
//TERMINA - BRID:4942

//rulesOnInit_ExecuteBusinessRulesEnd




  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit
//rulesAfterSave_ExecuteBusinessRulesEnd
  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:3937 - Antes de guardar concatenar numero de parte y descripción - Autor: Administrador - Actualización: 6/17/2021 2:40:35 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.PartesForm.get('Numero_de_parte_Descripcion').setValue(this.PartesForm.get('Numero_de_parte').value + " - " + this.PartesForm.get('Descripcion').value);
  //this.brf.SetValueFromQuery(this.PartesForm,"Numero_de_parte_Descripcion",this.brf.EvaluaQuery(" SELECT ('FLD[Numero_de_parte]'+ ' - ' + 'FLD[Descripcion]')", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:3937

//rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas
  
}
