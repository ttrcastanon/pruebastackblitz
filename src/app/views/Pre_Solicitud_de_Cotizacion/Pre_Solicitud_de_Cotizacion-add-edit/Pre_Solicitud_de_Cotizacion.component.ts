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
import { Pre_Solicitud_de_CotizacionService } from 'src/app/api-services/Pre_Solicitud_de_Cotizacion.service';
import { Pre_Solicitud_de_Cotizacion } from 'src/app/models/Pre_Solicitud_de_Cotizacion';
import { Solicitud_de_cotizacionService } from 'src/app/api-services/Solicitud_de_cotizacion.service';
import { Solicitud_de_cotizacion } from 'src/app/models/Solicitud_de_cotizacion';

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
  selector: 'app-Pre_Solicitud_de_Cotizacion',
  templateUrl: './Pre_Solicitud_de_Cotizacion.component.html',
  styleUrls: ['./Pre_Solicitud_de_Cotizacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Pre_Solicitud_de_CotizacionComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Pre_Solicitud_de_CotizacionForm: FormGroup;
	public Editor = ClassicEditor;
	model: Pre_Solicitud_de_Cotizacion;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsFolio_Solicitud_Cotizacion: Observable<Solicitud_de_cotizacion[]>;
	hasOptionsFolio_Solicitud_Cotizacion: boolean;
	isLoadingFolio_Solicitud_Cotizacion: boolean;

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
    private Pre_Solicitud_de_CotizacionService: Pre_Solicitud_de_CotizacionService,
    private Solicitud_de_cotizacionService: Solicitud_de_cotizacionService,

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
    this.model = new Pre_Solicitud_de_Cotizacion(this.fb);
    this.Pre_Solicitud_de_CotizacionForm = this.model.buildFormGroup();
	
	this.Pre_Solicitud_de_CotizacionForm.get('Folio').disable();
    this.Pre_Solicitud_de_CotizacionForm.get('Folio').setValue('Auto');
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
		
          this.Pre_Solicitud_de_CotizacionForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Pre_Solicitud_de_Cotizacion)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Pre_Solicitud_de_CotizacionForm, 'Folio_Solicitud_Cotizacion', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Pre_Solicitud_de_CotizacionService.listaSelAll(0, 1, 'Pre_Solicitud_de_Cotizacion.Folio=' + id).toPromise();
	if (result.Pre_Solicitud_de_Cotizacions.length > 0) {
	  
        this.model.fromObject(result.Pre_Solicitud_de_Cotizacions[0]);
        this.Pre_Solicitud_de_CotizacionForm.get('Folio_Solicitud_Cotizacion').setValue(
          result.Pre_Solicitud_de_Cotizacions[0].Folio_Solicitud_Cotizacion_Solicitud_de_cotizacion.Folio_Solicitud_de_Cotizacion,
          { onlySelf: false, emitEvent: true }
        );

		this.Pre_Solicitud_de_CotizacionForm.markAllAsTouched();
		this.Pre_Solicitud_de_CotizacionForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Pre_Solicitud_de_CotizacionForm.disabled ? "Update" : this.operation;
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

    this.Pre_Solicitud_de_CotizacionForm.get('Folio_Solicitud_Cotizacion').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingFolio_Solicitud_Cotizacion = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Solicitud_de_cotizacionService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Solicitud_de_cotizacionService.listaSelAll(0, 20, '');
          return this.Solicitud_de_cotizacionService.listaSelAll(0, 20,
            "Solicitud_de_cotizacion.Folio_Solicitud_de_Cotizacion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Solicitud_de_cotizacionService.listaSelAll(0, 20,
          "Solicitud_de_cotizacion.Folio_Solicitud_de_Cotizacion like '%" + value.Folio_Solicitud_de_Cotizacion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingFolio_Solicitud_Cotizacion = false;
      this.hasOptionsFolio_Solicitud_Cotizacion = result?.Solicitud_de_cotizacions?.length > 0;
	  this.Pre_Solicitud_de_CotizacionForm.get('Folio_Solicitud_Cotizacion').setValue(result?.Solicitud_de_cotizacions[0], { onlySelf: true, emitEvent: false });
	  this.optionsFolio_Solicitud_Cotizacion = of(result?.Solicitud_de_cotizacions);
    }, error => {
      this.isLoadingFolio_Solicitud_Cotizacion = false;
      this.hasOptionsFolio_Solicitud_Cotizacion = false;
      this.optionsFolio_Solicitud_Cotizacion = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

displayFnFolio_Solicitud_Cotizacion(option: Solicitud_de_cotizacion) {
    return option?.Folio_Solicitud_de_Cotizacion;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Pre_Solicitud_de_CotizacionForm.value;
      entity.Folio = this.model.Folio;
      entity.Folio_Solicitud_Cotizacion = this.Pre_Solicitud_de_CotizacionForm.get('Folio_Solicitud_Cotizacion').value.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Pre_Solicitud_de_CotizacionService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Pre_Solicitud_de_CotizacionService.insert(entity).toPromise().then(async id => {

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
      this.Pre_Solicitud_de_CotizacionForm.reset();
      this.model = new Pre_Solicitud_de_Cotizacion(this.fb);
      this.Pre_Solicitud_de_CotizacionForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Pre_Solicitud_de_Cotizacion/add']);
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
    this.router.navigate(['/Pre_Solicitud_de_Cotizacion/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Folio_Solicitud_Cotizacion_ExecuteBusinessRules(): void {
        //Folio_Solicitud_Cotizacion_FieldExecuteBusinessRulesEnd
    }
    Folio_Proveedor_ExecuteBusinessRules(): void {
        //Folio_Proveedor_FieldExecuteBusinessRulesEnd
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
