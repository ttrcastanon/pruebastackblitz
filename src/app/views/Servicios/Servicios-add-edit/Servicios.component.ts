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
import { ServiciosService } from 'src/app/api-services/Servicios.service';
import { Servicios } from 'src/app/models/Servicios';

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
  selector: 'app-Servicios',
  templateUrl: './Servicios.component.html',
  styleUrls: ['./Servicios.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ServiciosComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	ServiciosForm: FormGroup;
	public Editor = ClassicEditor;
	model: Servicios;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;

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
    private ServiciosService: ServiciosService,

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
    this.model = new Servicios(this.fb);
    this.ServiciosForm = this.model.buildFormGroup();
	
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
	    
    this.rulesAfterViewInit();
  }

  async ngOnInit(): Promise<void> {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
		
          this.ServiciosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Servicios)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	await this.rulesOnInit();	  
  }

  async populateModel(id: string) {
  
    this.spinner.show('loading');
	let result =  await this.ServiciosService.listaSelAll(0, 1, 'Servicios.Codigo=\'' + id+"\'").toPromise();
	if (result.Servicioss.length > 0) {
	  
        this.model.fromObject(result.Servicioss[0]);

		this.ServiciosForm.markAllAsTouched();
		this.ServiciosForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  async getParamsFromUrl() {
    this.route.paramMap.subscribe(
      async params => {
        this.model.Codigo = params.get('id');

        if (this.model.Codigo) {
          this.operation = !this.ServiciosForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Codigo);
        } else {
          this.operation = "New";
        }
        await this.rulesOnInit();
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



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

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
      const entity = this.ServiciosForm.value;
      if(this.operation = 'New'){
        entity.Codigo = this.ServiciosForm.get('Codigo').value;
      }
      else{
        entity.Codigo = this.model.Codigo;
      }
      
	  
	  if (this.model.Codigo != '' && this.model.Codigo != null ) {
      try{
        await this.ServiciosService.updateString(this.model.Codigo, entity).toPromise();
      }
      catch(ex){
        console.log(ex);
      }
       
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Codigo.toString());
        this.spinner.hide('loading');
        return this.model.Codigo;
      } else {
        await this.ServiciosService.insert(entity).toPromise();
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
    if (this.model.Codigo === '0' ) {
      this.ServiciosForm.reset();
      this.model = new Servicios(this.fb);
      this.ServiciosForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Servicios/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Codigo = '0';

  }
  
  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Servicios/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Codigo_ExecuteBusinessRules(): void {
        //Codigo_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Descripcion_Busqueda_ExecuteBusinessRules(): void {
        //Descripcion_Busqueda_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:255 - Al abrir la pantalla en nuevo, modificar y consultar ocultar el campo Descripción Búsqueda. - Autor: Administrador - Actualización: 6/17/2021 1:51:26 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.ServiciosForm.get('Descripcion_Busqueda').disable;
  console.log(this.ServiciosForm.get('Descripcion_Busqueda').value);
} 
//TERMINA - BRID:255


//INICIA - BRID:3936 - acomodo de campos Servicios.. - Autor: Yamir - Actualización: 6/17/2021 1:41:50 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:3936

//rulesOnInit_ExecuteBusinessRulesEnd


  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit
//rulesAfterSave_ExecuteBusinessRulesEnd
  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:254 - Antes de guardar en nuevo y modificar, concatenar el código y la descripción - Autor: Administrador - Actualización: 6/17/2021 1:54:14 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.ServiciosForm.get('Descripcion_Busqueda').setValue(this.ServiciosForm.get('Codigo').value +" - "+ this.ServiciosForm.get('Descripcion').value);
} 
//TERMINA - BRID:254

//rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas
  
}
