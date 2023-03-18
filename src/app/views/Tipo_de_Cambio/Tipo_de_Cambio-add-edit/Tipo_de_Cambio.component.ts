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
import { Tipo_de_CambioService } from 'src/app/api-services/Tipo_de_Cambio.service';
import { Tipo_de_Cambio } from 'src/app/models/Tipo_de_Cambio';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';

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
  selector: 'app-Tipo_de_Cambio',
  templateUrl: './Tipo_de_Cambio.component.html',
  styleUrls: ['./Tipo_de_Cambio.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Tipo_de_CambioComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Tipo_de_CambioForm: FormGroup;
	public Editor = ClassicEditor;
	model: Tipo_de_Cambio;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsUsuario_que_Edita: Observable<Spartan_User[]>;
	hasOptionsUsuario_que_Edita: boolean;
	isLoadingUsuario_que_Edita: boolean;

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
    private Tipo_de_CambioService: Tipo_de_CambioService,
    private Spartan_UserService: Spartan_UserService,

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
    this.model = new Tipo_de_Cambio(this.fb);
    this.Tipo_de_CambioForm = this.model.buildFormGroup();
	
	this.Tipo_de_CambioForm.get('Clave').disable();
    this.Tipo_de_CambioForm.get('Clave').setValue('Auto');
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
		
          this.Tipo_de_CambioForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Tipo_de_Cambio)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Tipo_de_CambioForm, 'Usuario_que_Edita', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Tipo_de_CambioService.listaSelAll(0, 1, 'Tipo_de_Cambio.Clave=' + id).toPromise();
	if (result.Tipo_de_Cambios.length > 0) {
	  
        this.model.fromObject(result.Tipo_de_Cambios[0]);
        this.Tipo_de_CambioForm.get('Usuario_que_Edita').setValue(
          result.Tipo_de_Cambios[0].Usuario_que_Edita_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );

		this.Tipo_de_CambioForm.markAllAsTouched();
		this.Tipo_de_CambioForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Clave = +params.get('id');

        if (this.model.Clave) {
          this.operation = !this.Tipo_de_CambioForm.disabled ? "Update" : this.operation;
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

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([]) => {

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Tipo_de_CambioForm.get('Usuario_que_Edita').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUsuario_que_Edita = true),
      distinctUntilChanged(),
      switchMap(value => {
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
      this.isLoadingUsuario_que_Edita = false;
      this.hasOptionsUsuario_que_Edita = result?.Spartan_Users?.length > 0;
	  this.Tipo_de_CambioForm.get('Usuario_que_Edita').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
	  this.optionsUsuario_que_Edita = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingUsuario_que_Edita = false;
      this.hasOptionsUsuario_que_Edita = false;
      this.optionsUsuario_que_Edita = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

displayFnUsuario_que_Edita(option: Spartan_User) {
    return option?.Name;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Tipo_de_CambioForm.value;
      entity.Clave = this.model.Clave;
      entity.Usuario_que_Edita = this.Tipo_de_CambioForm.get('Usuario_que_Edita').value.Id_User;
	  	  
	  
	  if (this.model.Clave > 0 ) {
        await this.Tipo_de_CambioService.update(this.model.Clave, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Clave.toString());
        this.spinner.hide('loading');
        return this.model.Clave;
      } else {
        await (this.Tipo_de_CambioService.insert(entity).toPromise().then(async id => {

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
    if (this.model.Clave === 0 ) {
      this.Tipo_de_CambioForm.reset();
      this.model = new Tipo_de_Cambio(this.fb);
      this.Tipo_de_CambioForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Tipo_de_Cambio/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Clave = 0;

  }
  
  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Tipo_de_Cambio/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Fecha_ExecuteBusinessRules(): void {
        //Fecha_FieldExecuteBusinessRulesEnd
    }
    T_C__USD_ExecuteBusinessRules(): void {
        //T_C__USD_FieldExecuteBusinessRulesEnd
    }
    T_C__EUR_ExecuteBusinessRules(): void {
        //T_C__EUR_FieldExecuteBusinessRulesEnd
    }
    T_C__LIBRA_ExecuteBusinessRules(): void {
        //T_C__LIBRA_FieldExecuteBusinessRulesEnd
    }
    T_C__CAD_ExecuteBusinessRules(): void {
        //T_C__CAD_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Edicion_ExecuteBusinessRules(): void {
        //Fecha_de_Edicion_FieldExecuteBusinessRulesEnd
    }
    Hora_de_Edicion_ExecuteBusinessRules(): void {
        //Hora_de_Edicion_FieldExecuteBusinessRulesEnd
    }
    Usuario_que_Edita_ExecuteBusinessRules(): void {
        //Usuario_que_Edita_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:338 - Asignar valor a campos Fecha, Hora y Usuario que Edita - Autor: Felipe Rodríguez - Actualización: 2/11/2021 10:37:01 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetCurrentDateToField(this.Tipo_de_CambioForm, "Fecha_de_Edicion"); this.brf.SetCurrentHourToField(this.Tipo_de_CambioForm, "Hora_de_Edicion"); this.brf.SetValueFromQuery(this.Tipo_de_CambioForm,"Usuario_que_Edita",this.brf.EvaluaQuery("SELECT Name from Spartan_User where Id_User = GLOBAL[USERID]", 1, "ABC123"),1,"ABC123"); this.brf.SetEnabledControl(this.Tipo_de_CambioForm, 'Fecha_de_Edicion', 0);this.brf.SetEnabledControl(this.Tipo_de_CambioForm, 'Hora_de_Edicion', 0);this.brf.SetEnabledControl(this.Tipo_de_CambioForm, 'Usuario_que_Edita', 0);
} 
//TERMINA - BRID:338


//INICIA - BRID:339 - Asignar valor a Fecha - Autor: Felipe Rodríguez - Actualización: 2/11/2021 10:37:36 AM
if(  this.operation == 'New' ) {
this.brf.SetCurrentDateToField(this.Tipo_de_CambioForm, "Fecha"); this.brf.SetEnabledControl(this.Tipo_de_CambioForm, 'Fecha', 0);
} 
//TERMINA - BRID:339


//INICIA - BRID:340 - Deshabilitar control Fecha - Autor: Felipe Rodríguez - Actualización: 2/11/2021 10:46:35 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.Tipo_de_CambioForm, 'Fecha', 0);
} 
//TERMINA - BRID:340


//INICIA - BRID:2694 - acomodo de campos tipo de cambio - Autor: Administrador - Actualización: 4/13/2021 7:22:24 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:2694

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
