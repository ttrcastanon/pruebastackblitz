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
import { Comisariato_y_notas_de_vueloService } from 'src/app/api-services/Comisariato_y_notas_de_vuelo.service';
import { Comisariato_y_notas_de_vuelo } from 'src/app/models/Comisariato_y_notas_de_vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';

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
  selector: 'app-Comisariato_y_notas_de_vuelo',
  templateUrl: './Comisariato_y_notas_de_vuelo.component.html',
  styleUrls: ['./Comisariato_y_notas_de_vuelo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Comisariato_y_notas_de_vueloComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Comisariato_y_notas_de_vueloForm: FormGroup;
	public Editor = ClassicEditor;
	model: Comisariato_y_notas_de_vuelo;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
	hasOptionsNumero_de_Vuelo: boolean;
	isLoadingNumero_de_Vuelo: boolean;

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
    private Comisariato_y_notas_de_vueloService: Comisariato_y_notas_de_vueloService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,

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
    this.model = new Comisariato_y_notas_de_vuelo(this.fb);
    this.Comisariato_y_notas_de_vueloForm = this.model.buildFormGroup();
	
	this.Comisariato_y_notas_de_vueloForm.get('Folio').disable();
    this.Comisariato_y_notas_de_vueloForm.get('Folio').setValue('Auto');
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
		
          this.Comisariato_y_notas_de_vueloForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Comisariato_y_notas_de_vuelo)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Comisariato_y_notas_de_vueloForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Comisariato_y_notas_de_vueloService.listaSelAll(0, 1, 'Comisariato_y_notas_de_vuelo.Folio=' + id).toPromise();
	if (result.Comisariato_y_notas_de_vuelos.length > 0) {
	  
        this.model.fromObject(result.Comisariato_y_notas_de_vuelos[0]);
        this.Comisariato_y_notas_de_vueloForm.get('Numero_de_Vuelo').setValue(
          result.Comisariato_y_notas_de_vuelos[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
          { onlySelf: false, emitEvent: true }
        );

		this.Comisariato_y_notas_de_vueloForm.markAllAsTouched();
		this.Comisariato_y_notas_de_vueloForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Comisariato_y_notas_de_vueloForm.disabled ? "Update" : this.operation;
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
  
  closeWindowCancel():void{
    window.close();
  }
  closeWindowSave():void{
    setTimeout(()=>{ window.close();}, 2000);
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

    this.Comisariato_y_notas_de_vueloForm.get('Numero_de_Vuelo').valueChanges.pipe(
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
	  this.Comisariato_y_notas_de_vueloForm.get('Numero_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
	  this.optionsNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = false;
      this.optionsNumero_de_Vuelo = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

displayFnNumero_de_Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }


  async save() {
    await this.saveData();
    if(this.localStorageHelper.getItemFromLocalStorage("Comisariato_y_notas_de_vueloWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Comisariato_y_notas_de_vueloWindowsFloat", "0");
      setTimeout(() => { window.close(); }, 5000);
    }
    else{
      this.goToList();
    }
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Comisariato_y_notas_de_vueloForm.value;
      entity.Folio = this.model.Folio;
      entity.Numero_de_Vuelo = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Comisariato_y_notas_de_vueloService.update(this.model.Folio, entity).toPromise();

        this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Comisariato_y_notas_de_vueloService.insert(entity).toPromise().then(async id => {
          this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
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
      this.Comisariato_y_notas_de_vueloForm.reset();
      this.model = new Comisariato_y_notas_de_vuelo(this.fb);
      this.Comisariato_y_notas_de_vueloForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Comisariato_y_notas_de_vuelo/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }
  
  cancel() {
    if(this.localStorageHelper.getItemFromLocalStorage("Comisariato_y_notas_de_vueloWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Comisariato_y_notas_de_vueloWindowsFloat", "0");
      window.close();
    }
    else{
      this.goToList();
    }
  }

  goToList() {
    this.router.navigate(['/Comisariato_y_notas_de_vuelo/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Numero_de_Vuelo_ExecuteBusinessRules(): void {
        //Numero_de_Vuelo_FieldExecuteBusinessRulesEnd
    }
    Comisariato_ExecuteBusinessRules(): void {
        //Comisariato_FieldExecuteBusinessRulesEnd
    }
    Notas_de_vuelo_ExecuteBusinessRules(): void {
        //Notas_de_vuelo_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4986 - Ocultar siempre folio  - Autor: Felipe Rodríguez - Actualización: 8/16/2021 9:47:17 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.HideFieldOfForm(this.Comisariato_y_notas_de_vueloForm, "Folio"); 
  this.brf.SetNotRequiredControl(this.Comisariato_y_notas_de_vueloForm, "Folio");
} 
//TERMINA - BRID:4986


//INICIA - BRID:4990 - DESHBAILITAR NUMERO DE VUELO - Autor: Felipe Rodríguez - Actualización: 8/16/2021 1:27:05 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.SetEnabledControl(this.Comisariato_y_notas_de_vueloForm, 'Numero_de_Vuelo', 0); this.brf.SetNotRequiredControl(this.Comisariato_y_notas_de_vueloForm, "Numero_de_Vuelo");
} 
//TERMINA - BRID:4990


//INICIA - BRID:4991 - NO REQUERIDO CAMPOS - Autor: Felipe Rodríguez - Actualización: 8/16/2021 1:28:12 PM

if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.SetNotRequiredControl(this.Comisariato_y_notas_de_vueloForm, "Comisariato");
  this.brf.SetNotRequiredControl(this.Comisariato_y_notas_de_vueloForm, "Notas_de_vuelo");
} 
//TERMINA - BRID:4991

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
