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
import { Registro_de_Distancia_SENEAMService } from 'src/app/api-services/Registro_de_Distancia_SENEAM.service';
import { Registro_de_Distancia_SENEAM } from 'src/app/models/Registro_de_Distancia_SENEAM';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';

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
  selector: 'app-Registro_de_Distancia_SENEAM',
  templateUrl: './Registro_de_Distancia_SENEAM.component.html',
  styleUrls: ['./Registro_de_Distancia_SENEAM.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Registro_de_Distancia_SENEAMComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Registro_de_Distancia_SENEAMForm: FormGroup;
	public Editor = ClassicEditor;
	model: Registro_de_Distancia_SENEAM;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsAeropuerto_Origen: Observable<Aeropuertos[]>;
	hasOptionsAeropuerto_Origen: boolean;
	isLoadingAeropuerto_Origen: boolean;
	optionsAeropuerto_Destino: Observable<Aeropuertos[]>;
	hasOptionsAeropuerto_Destino: boolean;
	isLoadingAeropuerto_Destino: boolean;

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
    private Registro_de_Distancia_SENEAMService: Registro_de_Distancia_SENEAMService,
    private AeropuertosService: AeropuertosService,

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
    this.model = new Registro_de_Distancia_SENEAM(this.fb);
    this.Registro_de_Distancia_SENEAMForm = this.model.buildFormGroup();
	
	this.Registro_de_Distancia_SENEAMForm.get('Folio').disable();
    this.Registro_de_Distancia_SENEAMForm.get('Folio').setValue('Auto');
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
		
          this.Registro_de_Distancia_SENEAMForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Registro_de_Distancia_SENEAM)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Registro_de_Distancia_SENEAMForm, 'Aeropuerto_Origen', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Registro_de_Distancia_SENEAMForm, 'Aeropuerto_Destino', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Registro_de_Distancia_SENEAMService.listaSelAll(0, 1, 'Registro_de_Distancia_SENEAM.Folio=' + id).toPromise();
	if (result.Registro_de_Distancia_SENEAMs.length > 0) {
	  
        this.model.fromObject(result.Registro_de_Distancia_SENEAMs[0]);
        this.Registro_de_Distancia_SENEAMForm.get('Aeropuerto_Origen').setValue(
          result.Registro_de_Distancia_SENEAMs[0].Aeropuerto_Origen_Aeropuertos.Nombre,
          { onlySelf: false, emitEvent: true }
        );
        this.Registro_de_Distancia_SENEAMForm.get('Aeropuerto_Destino').setValue(
          result.Registro_de_Distancia_SENEAMs[0].Aeropuerto_Destino_Aeropuertos.Nombre,
          { onlySelf: false, emitEvent: true }
        );

		this.Registro_de_Distancia_SENEAMForm.markAllAsTouched();
		this.Registro_de_Distancia_SENEAMForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Registro_de_Distancia_SENEAMForm.disabled ? "Update" : this.operation;
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

    this.Registro_de_Distancia_SENEAMForm.get('Aeropuerto_Origen').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAeropuerto_Origen = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingAeropuerto_Origen = false;
      this.hasOptionsAeropuerto_Origen = result?.Aeropuertoss?.length > 0;
	  this.Registro_de_Distancia_SENEAMForm.get('Aeropuerto_Origen').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
	  this.optionsAeropuerto_Origen = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingAeropuerto_Origen = false;
      this.hasOptionsAeropuerto_Origen = false;
      this.optionsAeropuerto_Origen = of([]);
    });
    this.Registro_de_Distancia_SENEAMForm.get('Aeropuerto_Destino').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAeropuerto_Destino = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingAeropuerto_Destino = false;
      this.hasOptionsAeropuerto_Destino = result?.Aeropuertoss?.length > 0;
	  this.Registro_de_Distancia_SENEAMForm.get('Aeropuerto_Destino').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
	  this.optionsAeropuerto_Destino = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingAeropuerto_Destino = false;
      this.hasOptionsAeropuerto_Destino = false;
      this.optionsAeropuerto_Destino = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

displayFnAeropuerto_Origen(option: Aeropuertos) {
    return option?.Nombre;
  }
displayFnAeropuerto_Destino(option: Aeropuertos) {
    return option?.Nombre;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Registro_de_Distancia_SENEAMForm.value;
      entity.Folio = this.model.Folio;
      entity.Aeropuerto_Origen = this.Registro_de_Distancia_SENEAMForm.get('Aeropuerto_Origen').value.Aeropuerto_ID;
      entity.Aeropuerto_Destino = this.Registro_de_Distancia_SENEAMForm.get('Aeropuerto_Destino').value.Aeropuerto_ID;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Registro_de_Distancia_SENEAMService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Registro_de_Distancia_SENEAMService.insert(entity).toPromise().then(async id => {

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
      this.Registro_de_Distancia_SENEAMForm.reset();
      this.model = new Registro_de_Distancia_SENEAM(this.fb);
      this.Registro_de_Distancia_SENEAMForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Registro_de_Distancia_SENEAM/add']);
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
    this.router.navigate(['/Registro_de_Distancia_SENEAM/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Aeropuerto_Origen_ExecuteBusinessRules(): void {
        //Aeropuerto_Origen_FieldExecuteBusinessRulesEnd
    }
    Aeropuerto_Destino_ExecuteBusinessRules(): void {
        //Aeropuerto_Destino_FieldExecuteBusinessRulesEnd
    }
    Distancia_SENEAM_KM_ExecuteBusinessRules(): void {
        //Distancia_SENEAM_KM_FieldExecuteBusinessRulesEnd
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
