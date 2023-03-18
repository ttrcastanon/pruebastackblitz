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
import { Detalle_Tabla_de_Control_de_ComponentesService } from 'src/app/api-services/Detalle_Tabla_de_Control_de_Componentes.service';
import { Detalle_Tabla_de_Control_de_Componentes } from 'src/app/models/Detalle_Tabla_de_Control_de_Componentes';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';

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
  selector: 'app-Detalle_Tabla_de_Control_de_Componentes',
  templateUrl: './Detalle_Tabla_de_Control_de_Componentes.component.html',
  styleUrls: ['./Detalle_Tabla_de_Control_de_Componentes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Detalle_Tabla_de_Control_de_ComponentesComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Detalle_Tabla_de_Control_de_ComponentesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Detalle_Tabla_de_Control_de_Componentes;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varCodigo_Computarizado: Codigo_Computarizado[] = [];

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
    private Detalle_Tabla_de_Control_de_ComponentesService: Detalle_Tabla_de_Control_de_ComponentesService,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,

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
    this.model = new Detalle_Tabla_de_Control_de_Componentes(this.fb);
    this.Detalle_Tabla_de_Control_de_ComponentesForm = this.model.buildFormGroup();
	
	this.Detalle_Tabla_de_Control_de_ComponentesForm.get('Folio').disable();
    this.Detalle_Tabla_de_Control_de_ComponentesForm.get('Folio').setValue('Auto');
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
		
          this.Detalle_Tabla_de_Control_de_ComponentesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Detalle_Tabla_de_Control_de_Componentes)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Detalle_Tabla_de_Control_de_ComponentesService.listaSelAll(0, 1, 'Detalle_Tabla_de_Control_de_Componentes.Folio=' + id).toPromise();
	if (result.Detalle_Tabla_de_Control_de_Componentess.length > 0) {
	  
        this.model.fromObject(result.Detalle_Tabla_de_Control_de_Componentess[0]);

		this.Detalle_Tabla_de_Control_de_ComponentesForm.markAllAsTouched();
		this.Detalle_Tabla_de_Control_de_ComponentesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Detalle_Tabla_de_Control_de_ComponentesForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Codigo_ComputarizadoService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varCodigo_Computarizado ]) => {
          this.varCodigo_Computarizado = varCodigo_Computarizado;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Codigo_Computarizado': {
        this.Codigo_ComputarizadoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCodigo_Computarizado = x.Codigo_Computarizados;
        });
        break;
      }
      case 'Descripcion': {
        this.Codigo_ComputarizadoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCodigo_Computarizado = x.Codigo_Computarizados;
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
      const entity = this.Detalle_Tabla_de_Control_de_ComponentesForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Detalle_Tabla_de_Control_de_ComponentesService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Detalle_Tabla_de_Control_de_ComponentesService.insert(entity).toPromise().then(async id => {

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
      this.Detalle_Tabla_de_Control_de_ComponentesForm.reset();
      this.model = new Detalle_Tabla_de_Control_de_Componentes(this.fb);
      this.Detalle_Tabla_de_Control_de_ComponentesForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Detalle_Tabla_de_Control_de_Componentes/add']);
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
    this.router.navigate(['/Detalle_Tabla_de_Control_de_Componentes/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Codigo_Computarizado_ExecuteBusinessRules(): void {
        //Codigo_Computarizado_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    No_Parte_ExecuteBusinessRules(): void {
        //No_Parte_FieldExecuteBusinessRulesEnd
    }
    Posicion_ExecuteBusinessRules(): void {
        //Posicion_FieldExecuteBusinessRulesEnd
    }
    No_Serie_ExecuteBusinessRules(): void {
        //No_Serie_FieldExecuteBusinessRulesEnd
    }
    Horas_Acumuladas_Parte_ExecuteBusinessRules(): void {
        //Horas_Acumuladas_Parte_FieldExecuteBusinessRulesEnd
    }
    Ciclos_Acumulados_Parte_ExecuteBusinessRules(): void {
        //Ciclos_Acumulados_Parte_FieldExecuteBusinessRulesEnd
    }
    Horas_Acumuladas_Aeronave_ExecuteBusinessRules(): void {
        //Horas_Acumuladas_Aeronave_FieldExecuteBusinessRulesEnd
    }
    Ciclos_Acumulados_Aeronave_ExecuteBusinessRules(): void {
        //Ciclos_Acumulados_Aeronave_FieldExecuteBusinessRulesEnd
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
