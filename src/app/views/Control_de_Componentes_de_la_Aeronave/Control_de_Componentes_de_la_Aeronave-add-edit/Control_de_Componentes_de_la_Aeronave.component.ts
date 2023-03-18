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
import { Control_de_Componentes_de_la_AeronaveService } from 'src/app/api-services/Control_de_Componentes_de_la_Aeronave.service';
import { Control_de_Componentes_de_la_Aeronave } from 'src/app/models/Control_de_Componentes_de_la_Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Detalle_Parte_Asociada_al_Componente_AeronaveService } from 'src/app/api-services/Detalle_Parte_Asociada_al_Componente_Aeronave.service';
import { Detalle_Parte_Asociada_al_Componente_Aeronave } from 'src/app/models/Detalle_Parte_Asociada_al_Componente_Aeronave';

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
  selector: 'app-Control_de_Componentes_de_la_Aeronave',
  templateUrl: './Control_de_Componentes_de_la_Aeronave.component.html',
  styleUrls: ['./Control_de_Componentes_de_la_Aeronave.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Control_de_Componentes_de_la_AeronaveComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Control_de_Componentes_de_la_AeronaveForm: FormGroup;
	public Editor = ClassicEditor;
	model: Control_de_Componentes_de_la_Aeronave;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varAeronave: Aeronave[] = [];
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;
	public varDetalle_Parte_Asociada_al_Componente_Aeronave: Detalle_Parte_Asociada_al_Componente_Aeronave[] = [];

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
    private Control_de_Componentes_de_la_AeronaveService: Control_de_Componentes_de_la_AeronaveService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Detalle_Parte_Asociada_al_Componente_AeronaveService: Detalle_Parte_Asociada_al_Componente_AeronaveService,

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
    this.model = new Control_de_Componentes_de_la_Aeronave(this.fb);
    this.Control_de_Componentes_de_la_AeronaveForm = this.model.buildFormGroup();
	
	this.Control_de_Componentes_de_la_AeronaveForm.get('Folio').disable();
    this.Control_de_Componentes_de_la_AeronaveForm.get('Folio').setValue('Auto');
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
		
          this.Control_de_Componentes_de_la_AeronaveForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Control_de_Componentes_de_la_Aeronave)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Control_de_Componentes_de_la_Aeronave	Form, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Control_de_Componentes_de_la_AeronaveService.listaSelAll(0, 1, 'Control_de_Componentes_de_la_Aeronave.Folio=' + id).toPromise();
	if (result.Control_de_Componentes_de_la_Aeronaves.length > 0) {
	  
        this.model.fromObject(result.Control_de_Componentes_de_la_Aeronaves[0]);
        this.Control_de_Componentes_de_la_Aeronave	Form.get('Modelo').setValue(
          result.Control_de_Componentes_de_la_Aeronave	s[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );

		this.Control_de_Componentes_de_la_AeronaveForm.markAllAsTouched();
		this.Control_de_Componentes_de_la_AeronaveForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Control_de_Componentes_de_la_AeronaveForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.AeronaveService.getAll());
    observablesArray.push(this.Detalle_Parte_Asociada_al_Componente_AeronaveService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varAeronave , varDetalle_Parte_Asociada_al_Componente_Aeronave ]) => {
          this.varAeronave = varAeronave;
          this.varDetalle_Parte_Asociada_al_Componente_Aeronave = varDetalle_Parte_Asociada_al_Componente_Aeronave;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Control_de_Componentes_de_la_Aeronave	Form.get('Modelo').valueChanges.pipe(
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
	  this.Control_de_Componentes_de_la_Aeronave	Form.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
	  this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Matricula': {
        this.AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAeronave = x.Aeronaves;
        });
        break;
      }
      case 'No_Parte_asociado_al_componente': {
        this.Detalle_Parte_Asociada_al_Componente_AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDetalle_Parte_Asociada_al_Componente_Aeronave = x.Detalle_Parte_Asociada_al_Componente_Aeronaves;
        });
        break;
      }

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
      const entity = this.Control_de_Componentes_de_la_AeronaveForm.value;
      entity.Folio = this.model.Folio;
      entity.Modelo = this.Control_de_Componentes_de_la_Aeronave	Form.get('Modelo').value.Clave;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Control_de_Componentes_de_la_Aeronave	Service.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Control_de_Componentes_de_la_AeronaveService.insert(entity).toPromise().then(async id => {

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
      this.Control_de_Componentes_de_la_AeronaveForm.reset();
      this.model = new Control_de_Componentes_de_la_Aeronave(this.fb);
      this.Control_de_Componentes_de_la_AeronaveForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Control_de_Componentes_de_la_Aeronave/add']);
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
    this.router.navigate(['/Control_de_Componentes_de_la_Aeronave/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Matricula_ExecuteBusinessRules(): void {
        //Matricula_FieldExecuteBusinessRulesEnd
    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    No_Parte_asociado_al_componente_ExecuteBusinessRules(): void {
        //No_Parte_asociado_al_componente_FieldExecuteBusinessRulesEnd
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
