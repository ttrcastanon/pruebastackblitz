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
import { Salida_en_almacenService } from 'src/app/api-services/Salida_en_almacen.service';
import { Salida_en_almacen } from 'src/app/models/Salida_en_almacen';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';

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
  selector: 'app-Salida_en_almacen',
  templateUrl: './Salida_en_almacen.component.html',
  styleUrls: ['./Salida_en_almacen.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Salida_en_almacenComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Salida_en_almacenForm: FormGroup;
	public Editor = ClassicEditor;
	model: Salida_en_almacen;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varSpartan_User: Spartan_User[] = [];
	public varUnidad: Unidad[] = [];
	optionsEntregado_a: Observable<Spartan_User[]>;
	hasOptionsEntregado_a: boolean;
	isLoadingEntregado_a: boolean;

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
    private Salida_en_almacenService: Salida_en_almacenService,
    private Spartan_UserService: Spartan_UserService,
    private UnidadService: UnidadService,

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
    this.model = new Salida_en_almacen(this.fb);
    this.Salida_en_almacenForm = this.model.buildFormGroup();
	
	this.Salida_en_almacenForm.get('Folio').disable();
    this.Salida_en_almacenForm.get('Folio').setValue('Auto');
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
		
          this.Salida_en_almacenForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Salida_en_almacen)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Salida_en_almacenForm, 'Entregado_a', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Salida_en_almacenService.listaSelAll(0, 1, 'Salida_en_almacen.Folio=' + id).toPromise();
	if (result.Salida_en_almacens.length > 0) {
	  
        this.model.fromObject(result.Salida_en_almacens[0]);
        this.Salida_en_almacenForm.get('Entregado_a').setValue(
          result.Salida_en_almacens[0].Entregado_a_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );

		this.Salida_en_almacenForm.markAllAsTouched();
		this.Salida_en_almacenForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Salida_en_almacenForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Spartan_UserService.getAll());
    observablesArray.push(this.UnidadService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varSpartan_User , varUnidad ]) => {
          this.varSpartan_User = varSpartan_User;
          this.varUnidad = varUnidad;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Salida_en_almacenForm.get('Entregado_a').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEntregado_a = true),
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
      this.isLoadingEntregado_a = false;
      this.hasOptionsEntregado_a = result?.Spartan_Users?.length > 0;
	  this.Salida_en_almacenForm.get('Entregado_a').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
	  this.optionsEntregado_a = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingEntregado_a = false;
      this.hasOptionsEntregado_a = false;
      this.optionsEntregado_a = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Solicitante': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Und_': {
        this.UnidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUnidad = x.Unidads;
        });
        break;
      }
      case 'Und2': {
        this.UnidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUnidad = x.Unidads;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

displayFnEntregado_a(option: Spartan_User) {
    return option?.Name;
  }


  async save() {
    await this.saveData();
    this.cancel();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Salida_en_almacenForm.value;
      entity.Folio = this.model.Folio;
      entity.Entregado_a = this.Salida_en_almacenForm.get('Entregado_a').value.Id_User;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Salida_en_almacenService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Salida_en_almacenService.insert(entity).toPromise().then(async id => {

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
      this.Salida_en_almacenForm.reset();
      this.model = new Salida_en_almacen(this.fb);
      this.Salida_en_almacenForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Salida_en_almacen/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }
  
  cancel():void {
    window.top.close();
  }


  goToList() {
    this.router.navigate(['/Salida_en_almacen/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      No__de_Parte___Descripcion_ExecuteBusinessRules(): void {
        //No__de_Parte___Descripcion_FieldExecuteBusinessRulesEnd
    }
    Solicitante_ExecuteBusinessRules(): void {
        //Solicitante_FieldExecuteBusinessRulesEnd
    }
    Cant__Solicitada_ExecuteBusinessRules(): void {
        //Cant__Solicitada_FieldExecuteBusinessRulesEnd
    }
    Und__ExecuteBusinessRules(): void {
        //Und__FieldExecuteBusinessRulesEnd
    }
    Entregado_a_ExecuteBusinessRules(): void {
        //Entregado_a_FieldExecuteBusinessRulesEnd
    }
    Cant__a_entregar_ExecuteBusinessRules(): void {
        //Cant__a_entregar_FieldExecuteBusinessRulesEnd
    }
    Und2_ExecuteBusinessRules(): void {
        //Und2_FieldExecuteBusinessRulesEnd
    }
    IdSalidaAlmacen_ExecuteBusinessRules(): void {
        //IdSalidaAlmacen_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4136 - Salida_en_almacen campos - Autor: Lizeth Villa - Actualización: 8/4/2021 2:50:49 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4136


//INICIA - BRID:4641 - Ocultar campos folio y bloquear campos siempre - Autor: Lizeth Villa - Actualización: 8/4/2021 6:23:19 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Salida_en_almacenForm, "Folio"); this.brf.SetNotRequiredControl(this.Salida_en_almacenForm, "Folio");this.brf.HideFieldOfForm(this.Salida_en_almacenForm, "IdSalidaAlmacen"); this.brf.SetNotRequiredControl(this.Salida_en_almacenForm, "IdSalidaAlmacen"); this.brf.SetNotRequiredControl(this.Salida_en_almacenForm, "Folio");this.brf.SetNotRequiredControl(this.Salida_en_almacenForm, "IdSalidaAlmacen"); this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'No__de_Parte___Descripcion', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Cant__Solicitada', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Und_', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Solicitante', 0);
} 
//TERMINA - BRID:4641


//INICIA - BRID:4643 - Asignar valores en nuevo al abrir la pantalla (con codigo manual no desactivar) - Autor: Lizeth Villa - Actualización: 8/4/2021 3:11:45 PM
if(  this.operation == 'New' ) {
this.brf.SetValueControl(this.Salida_en_almacenForm, "No__de_Parte___Descripcion", "1"); this.brf.SetValueFromQuery(this.Salida_en_almacenForm,"Und_",this.brf.EvaluaQuery(" select 1", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:4643


//INICIA - BRID:4649 - deshabilitar botones si ya se genero la salida con código manual, no desactivar - Autor: Lizeth Villa - Actualización: 8/4/2021 6:28:17 PM
if(  this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Folio', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'No__de_Parte___Descripcion', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Cant__Solicitada', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Und_', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Cant__a_entregar', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Solicitante', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Entregado_a', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'Und2', 0);this.brf.SetEnabledControl(this.Salida_en_almacenForm, 'IdSalidaAlmacen', 0);
} 
//TERMINA - BRID:4649

//rulesOnInit_ExecuteBusinessRulesEnd




  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:4644 - Asignar mismo folio a idsalialamacen - Autor: Lizeth Villa - Actualización: 8/4/2021 3:24:18 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery(" UPDATE Salida_en_almacen SET idSalidaAlmacen = FOLIO WHERE FOLIO =  GLOBAL[KeyValueInserted]", 1, "ABC123");
} 
//TERMINA - BRID:4644


//INICIA - BRID:4645 - actualizar etatus (con codigo manual no desactivar) - Autor: Lizeth Villa - Actualización: 8/4/2021 4:52:55 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery(" UPDATE Detalle_de_Solicitud_de_partes_materiales_y_herramientas SET estatus = 3 WHERE FOLIO =  variable", 1, "ABC123");
} 
//TERMINA - BRID:4645


//INICIA - BRID:4646 - Asignar idsalidaenalmacen en mr despues de guardar (con codigo manual, no desactivar) - Autor: Lizeth Villa - Actualización: 8/4/2021 5:30:14 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery(" UPDATE Detalle_de_Solicitud_de_partes_materiales_y_herramientas SET idSalidaenAlmacen = GLOBAL[KeyValueInserted] WHERE FOLIO =  vriable", 1, "ABC123");
} 
//TERMINA - BRID:4646

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
