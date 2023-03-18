﻿import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
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
import { Notificaciones_PushService } from 'src/app/api-services/Notificaciones_Push.service';
import { Notificaciones_Push } from 'src/app/models/Notificaciones_Push';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Tipo_de_Notificacion_PushService } from 'src/app/api-services/Tipo_de_Notificacion_Push.service';
import { Tipo_de_Notificacion_Push } from 'src/app/models/Tipo_de_Notificacion_Push';

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
  selector: 'app-Notificaciones_Push',
  templateUrl: './Notificaciones_Push.component.html',
  styleUrls: ['./Notificaciones_Push.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Notificaciones_PushComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Notificaciones_PushForm: FormGroup;
	public Editor = ClassicEditor;
	model: Notificaciones_Push;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsDestinatario: Observable<Spartan_User[]>;
	hasOptionsDestinatario: boolean;
	isLoadingDestinatario: boolean;
	public varTipo_de_Notificacion_Push: Tipo_de_Notificacion_Push[] = [];

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
    private Notificaciones_PushService: Notificaciones_PushService,
    private Spartan_UserService: Spartan_UserService,
    private Tipo_de_Notificacion_PushService: Tipo_de_Notificacion_PushService,

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
    this.model = new Notificaciones_Push(this.fb);
    this.Notificaciones_PushForm = this.model.buildFormGroup();
	
	this.Notificaciones_PushForm.get('Folio').disable();
    this.Notificaciones_PushForm.get('Folio').setValue('Auto');
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
		
          this.Notificaciones_PushForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Notificaciones_Push)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Notificaciones_PushForm, 'Destinatario', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Notificaciones_PushService.listaSelAll(0, 1, 'Notificaciones_Push.Folio=' + id).toPromise();
	if (result.Notificaciones_Pushs.length > 0) {
	  
        this.model.fromObject(result.Notificaciones_Pushs[0]);
        this.Notificaciones_PushForm.get('Destinatario').setValue(
          result.Notificaciones_Pushs[0].Destinatario_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );

		this.Notificaciones_PushForm.markAllAsTouched();
		this.Notificaciones_PushForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Notificaciones_PushForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_de_Notificacion_PushService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varTipo_de_Notificacion_Push ]) => {
          this.varTipo_de_Notificacion_Push = varTipo_de_Notificacion_Push;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Notificaciones_PushForm.get('Destinatario').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingDestinatario = true),
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
      this.isLoadingDestinatario = false;
      this.hasOptionsDestinatario = result?.Spartan_Users?.length > 0;
	  this.Notificaciones_PushForm.get('Destinatario').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
	  this.optionsDestinatario = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingDestinatario = false;
      this.hasOptionsDestinatario = false;
      this.optionsDestinatario = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tipo': {
        this.Tipo_de_Notificacion_PushService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Notificacion_Push = x.Tipo_de_Notificacion_Pushs;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

displayFnDestinatario(option: Spartan_User) {
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
      const entity = this.Notificaciones_PushForm.value;
      entity.Folio = this.model.Folio;
      entity.Destinatario = this.Notificaciones_PushForm.get('Destinatario').value.Id_User;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Notificaciones_PushService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Notificaciones_PushService.insert(entity).toPromise().then(async id => {

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
      this.Notificaciones_PushForm.reset();
      this.model = new Notificaciones_Push(this.fb);
      this.Notificaciones_PushForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Notificaciones_Push/add']);
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
    this.router.navigate(['/Notificaciones_Push/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Fecha_ExecuteBusinessRules(): void {
        //Fecha_FieldExecuteBusinessRulesEnd
    }
    Hora_ExecuteBusinessRules(): void {
        //Hora_FieldExecuteBusinessRulesEnd
    }
    Destinatario_ExecuteBusinessRules(): void {
        //Destinatario_FieldExecuteBusinessRulesEnd
    }
    Parametros_Adicionales_ExecuteBusinessRules(): void {
        //Parametros_Adicionales_FieldExecuteBusinessRulesEnd
    }
    Notificacion_ExecuteBusinessRules(): void {
        //Notificacion_FieldExecuteBusinessRulesEnd
    }
    Leida_ExecuteBusinessRules(): void {
        //Leida_FieldExecuteBusinessRulesEnd
    }
    Titulo_ExecuteBusinessRules(): void {
        //Titulo_FieldExecuteBusinessRulesEnd
    }
    Tipo_ExecuteBusinessRules(): void {
        //Tipo_FieldExecuteBusinessRulesEnd
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
