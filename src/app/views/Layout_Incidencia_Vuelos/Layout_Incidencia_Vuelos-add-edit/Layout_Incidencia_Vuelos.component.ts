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
import { Layout_Incidencia_VuelosService } from 'src/app/api-services/Layout_Incidencia_Vuelos.service';
import { Layout_Incidencia_Vuelos } from 'src/app/models/Layout_Incidencia_Vuelos';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Tipo_Incidencia_VuelosService } from 'src/app/api-services/Tipo_Incidencia_Vuelos.service';
import { Tipo_Incidencia_Vuelos } from 'src/app/models/Tipo_Incidencia_Vuelos';
import { Responsable_Incidencia_VueloService } from 'src/app/api-services/Responsable_Incidencia_Vuelo.service';
import { Responsable_Incidencia_Vuelo } from 'src/app/models/Responsable_Incidencia_Vuelo';

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
  selector: 'app-Layout_Incidencia_Vuelos',
  templateUrl: './Layout_Incidencia_Vuelos.component.html',
  styleUrls: ['./Layout_Incidencia_Vuelos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Layout_Incidencia_VuelosComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Layout_Incidencia_VuelosForm: FormGroup;
	public Editor = ClassicEditor;
	model: Layout_Incidencia_Vuelos;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varSolicitud_de_Vuelo: Solicitud_de_Vuelo[] = [];
	public varTipo_Incidencia_Vuelos: Tipo_Incidencia_Vuelos[] = [];
	public varResponsable_Incidencia_Vuelo: Responsable_Incidencia_Vuelo[] = [];

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
    private Layout_Incidencia_VuelosService: Layout_Incidencia_VuelosService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private Tipo_Incidencia_VuelosService: Tipo_Incidencia_VuelosService,
    private Responsable_Incidencia_VueloService: Responsable_Incidencia_VueloService,

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
    this.model = new Layout_Incidencia_Vuelos(this.fb);
    this.Layout_Incidencia_VuelosForm = this.model.buildFormGroup();
	
	this.Layout_Incidencia_VuelosForm.get('Folio').disable();
    this.Layout_Incidencia_VuelosForm.get('Folio').setValue('Auto');
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
		
          this.Layout_Incidencia_VuelosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Layout_Incidencia_Vuelos)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Layout_Incidencia_VuelosService.listaSelAll(0, 1, 'Layout_Incidencia_Vuelos.Folio=' + id).toPromise();
	if (result.Layout_Incidencia_Vueloss.length > 0) {
	  
        this.model.fromObject(result.Layout_Incidencia_Vueloss[0]);

		this.Layout_Incidencia_VuelosForm.markAllAsTouched();
		this.Layout_Incidencia_VuelosForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Layout_Incidencia_VuelosForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_Incidencia_VuelosService.getAll());
    observablesArray.push(this.Responsable_Incidencia_VueloService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varSolicitud_de_Vuelo , varTipo_Incidencia_Vuelos , varResponsable_Incidencia_Vuelo ]) => {
          this.varSolicitud_de_Vuelo = varSolicitud_de_Vuelo;
          this.varTipo_Incidencia_Vuelos = varTipo_Incidencia_Vuelos;
          this.varResponsable_Incidencia_Vuelo = varResponsable_Incidencia_Vuelo;

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
      case 'TipoIncidencia': {
        this.Tipo_Incidencia_VuelosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_Incidencia_Vuelos = x.Tipo_Incidencia_Vueloss;
        });
        break;
      }
      case 'Responsable': {
        this.Responsable_Incidencia_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varResponsable_Incidencia_Vuelo = x.Responsable_Incidencia_Vuelos;
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
      const entity = this.Layout_Incidencia_VuelosForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Layout_Incidencia_VuelosService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Layout_Incidencia_VuelosService.insert(entity).toPromise().then(async id => {

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
      this.Layout_Incidencia_VuelosForm.reset();
      this.model = new Layout_Incidencia_Vuelos(this.fb);
      this.Layout_Incidencia_VuelosForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Layout_Incidencia_Vuelos/add']);
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
    this.router.navigate(['/Layout_Incidencia_Vuelos/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Folio_de_carga_manual_ExecuteBusinessRules(): void {
        //Folio_de_carga_manual_FieldExecuteBusinessRulesEnd
    }
    Fecha_ExecuteBusinessRules(): void {
        //Fecha_FieldExecuteBusinessRulesEnd
    }
    Vuelo_ExecuteBusinessRules(): void {
        //Vuelo_FieldExecuteBusinessRulesEnd
    }
    TipoIncidencia_ExecuteBusinessRules(): void {
        //TipoIncidencia_FieldExecuteBusinessRulesEnd
    }
    Responsable_ExecuteBusinessRules(): void {
        //Responsable_FieldExecuteBusinessRulesEnd
    }
    Motivo_ExecuteBusinessRules(): void {
        //Motivo_FieldExecuteBusinessRulesEnd
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
