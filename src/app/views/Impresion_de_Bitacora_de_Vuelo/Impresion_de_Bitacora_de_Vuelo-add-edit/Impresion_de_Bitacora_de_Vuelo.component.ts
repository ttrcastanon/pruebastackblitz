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
import { Impresion_de_Bitacora_de_VueloService } from 'src/app/api-services/Impresion_de_Bitacora_de_Vuelo.service';
import { Impresion_de_Bitacora_de_Vuelo } from 'src/app/models/Impresion_de_Bitacora_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';

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
  selector: 'app-Impresion_de_Bitacora_de_Vuelo',
  templateUrl: './Impresion_de_Bitacora_de_Vuelo.component.html',
  styleUrls: ['./Impresion_de_Bitacora_de_Vuelo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Impresion_de_Bitacora_de_VueloComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Impresion_de_Bitacora_de_VueloForm: FormGroup;
	public Editor = ClassicEditor;
	model: Impresion_de_Bitacora_de_Vuelo;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varSolicitud_de_Vuelo: Solicitud_de_Vuelo[] = [];
	public varRegistro_de_vuelo: Registro_de_vuelo[] = [];

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
    private Impresion_de_Bitacora_de_VueloService: Impresion_de_Bitacora_de_VueloService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private Registro_de_vueloService: Registro_de_vueloService,

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
    this.model = new Impresion_de_Bitacora_de_Vuelo(this.fb);
    this.Impresion_de_Bitacora_de_VueloForm = this.model.buildFormGroup();
	
	this.Impresion_de_Bitacora_de_VueloForm.get('Folio').disable();
    this.Impresion_de_Bitacora_de_VueloForm.get('Folio').setValue('Auto');
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
		
          this.Impresion_de_Bitacora_de_VueloForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Impresion_de_Bitacora_de_Vuelo)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Impresion_de_Bitacora_de_VueloService.listaSelAll(0, 1, 'Impresion_de_Bitacora_de_Vuelo.Folio=' + id).toPromise();
	if (result.Impresion_de_Bitacora_de_Vuelos.length > 0) {
	  
        this.model.fromObject(result.Impresion_de_Bitacora_de_Vuelos[0]);

		this.Impresion_de_Bitacora_de_VueloForm.markAllAsTouched();
		this.Impresion_de_Bitacora_de_VueloForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Impresion_de_Bitacora_de_VueloForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Solicitud_de_VueloService.getAll());
    observablesArray.push(this.Registro_de_vueloService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varSolicitud_de_Vuelo , varRegistro_de_vuelo ]) => {
          this.varSolicitud_de_Vuelo = varSolicitud_de_Vuelo;
          this.varRegistro_de_vuelo = varRegistro_de_vuelo;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Vuelo': {
        this.Solicitud_de_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSolicitud_de_Vuelo = x.Solicitud_de_Vuelos;
        });
        break;
      }
      case 'Tramo1': {
        this.Registro_de_vueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRegistro_de_vuelo = x.Registro_de_vuelos;
        });
        break;
      }
      case 'Tramo2': {
        this.Registro_de_vueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRegistro_de_vuelo = x.Registro_de_vuelos;
        });
        break;
      }
      case 'Tramo3': {
        this.Registro_de_vueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRegistro_de_vuelo = x.Registro_de_vuelos;
        });
        break;
      }
      case 'Tramo4': {
        this.Registro_de_vueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRegistro_de_vuelo = x.Registro_de_vuelos;
        });
        break;
      }
      case 'Tramo5': {
        this.Registro_de_vueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRegistro_de_vuelo = x.Registro_de_vuelos;
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
      const entity = this.Impresion_de_Bitacora_de_VueloForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Impresion_de_Bitacora_de_VueloService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Impresion_de_Bitacora_de_VueloService.insert(entity).toPromise().then(async id => {

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
      this.Impresion_de_Bitacora_de_VueloForm.reset();
      this.model = new Impresion_de_Bitacora_de_Vuelo(this.fb);
      this.Impresion_de_Bitacora_de_VueloForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Impresion_de_Bitacora_de_Vuelo/add']);
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
    this.router.navigate(['/Impresion_de_Bitacora_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Vuelo_ExecuteBusinessRules(): void {
        //Vuelo_FieldExecuteBusinessRulesEnd
    }
    Fecha_ExecuteBusinessRules(): void {
        //Fecha_FieldExecuteBusinessRulesEnd
    }
    Tramo1_ExecuteBusinessRules(): void {
        //Tramo1_FieldExecuteBusinessRulesEnd
    }
    Tramo2_ExecuteBusinessRules(): void {
        //Tramo2_FieldExecuteBusinessRulesEnd
    }
    Tramo3_ExecuteBusinessRules(): void {
        //Tramo3_FieldExecuteBusinessRulesEnd
    }
    Tramo4_ExecuteBusinessRules(): void {
        //Tramo4_FieldExecuteBusinessRulesEnd
    }
    Tramo5_ExecuteBusinessRules(): void {
        //Tramo5_FieldExecuteBusinessRulesEnd
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
