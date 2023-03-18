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
import { Productividad_del_area_de_mantenimientoService } from 'src/app/api-services/Productividad_del_area_de_mantenimiento.service';
import { Productividad_del_area_de_mantenimiento } from 'src/app/models/Productividad_del_area_de_mantenimiento';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Estatus_de_ReporteService } from 'src/app/api-services/Estatus_de_Reporte.service';
import { Estatus_de_Reporte } from 'src/app/models/Estatus_de_Reporte';
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
  selector: 'app-Productividad_del_area_de_mantenimiento',
  templateUrl: './Productividad_del_area_de_mantenimiento.component.html',
  styleUrls: ['./Productividad_del_area_de_mantenimiento.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Productividad_del_area_de_mantenimientoComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Productividad_del_area_de_mantenimientoForm: FormGroup;
	public Editor = ClassicEditor;
	model: Productividad_del_area_de_mantenimiento;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varAeronave: Aeronave[] = [];
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;
	public varEstatus_de_Reporte: Estatus_de_Reporte[] = [];
	optionsAsignado_a: Observable<Spartan_User[]>;
	hasOptionsAsignado_a: boolean;
	isLoadingAsignado_a: boolean;
	optionsAsignar_ejecutante: Observable<Spartan_User[]>;
	hasOptionsAsignar_ejecutante: boolean;
	isLoadingAsignar_ejecutante: boolean;

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
    private Productividad_del_area_de_mantenimientoService: Productividad_del_area_de_mantenimientoService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Estatus_de_ReporteService: Estatus_de_ReporteService,
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
    this.model = new Productividad_del_area_de_mantenimiento(this.fb);
    this.Productividad_del_area_de_mantenimientoForm = this.model.buildFormGroup();
	
	this.Productividad_del_area_de_mantenimientoForm.get('Folio').disable();
    this.Productividad_del_area_de_mantenimientoForm.get('Folio').setValue('Auto');
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
		
          this.Productividad_del_area_de_mantenimientoForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Productividad_del_area_de_mantenimiento)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Productividad_del_area_de_mantenimientoForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Productividad_del_area_de_mantenimientoForm, 'Asignado_a', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Productividad_del_area_de_mantenimientoForm, 'Asignar_ejecutante', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Productividad_del_area_de_mantenimientoService.listaSelAll(0, 1, 'Productividad_del_area_de_mantenimiento.Folio=' + id).toPromise();
	if (result.Productividad_del_area_de_mantenimientos.length > 0) {
	  
        this.model.fromObject(result.Productividad_del_area_de_mantenimientos[0]);
        this.Productividad_del_area_de_mantenimientoForm.get('Modelo').setValue(
          result.Productividad_del_area_de_mantenimientos[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Productividad_del_area_de_mantenimientoForm.get('Asignado_a').setValue(
          result.Productividad_del_area_de_mantenimientos[0].Asignado_a_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );
        this.Productividad_del_area_de_mantenimientoForm.get('Asignar_ejecutante').setValue(
          result.Productividad_del_area_de_mantenimientos[0].Asignar_ejecutante_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );

		this.Productividad_del_area_de_mantenimientoForm.markAllAsTouched();
		this.Productividad_del_area_de_mantenimientoForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Productividad_del_area_de_mantenimientoForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Estatus_de_ReporteService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varAeronave , varEstatus_de_Reporte ]) => {
          this.varAeronave = varAeronave;
          this.varEstatus_de_Reporte = varEstatus_de_Reporte;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Productividad_del_area_de_mantenimientoForm.get('Modelo').valueChanges.pipe(
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
	  this.Productividad_del_area_de_mantenimientoForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
	  this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Productividad_del_area_de_mantenimientoForm.get('Asignado_a').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAsignado_a = true),
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
      this.isLoadingAsignado_a = false;
      this.hasOptionsAsignado_a = result?.Spartan_Users?.length > 0;
	  this.Productividad_del_area_de_mantenimientoForm.get('Asignado_a').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
	  this.optionsAsignado_a = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingAsignado_a = false;
      this.hasOptionsAsignado_a = false;
      this.optionsAsignado_a = of([]);
    });
    this.Productividad_del_area_de_mantenimientoForm.get('Asignar_ejecutante').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAsignar_ejecutante = true),
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
      this.isLoadingAsignar_ejecutante = false;
      this.hasOptionsAsignar_ejecutante = result?.Spartan_Users?.length > 0;
	  this.Productividad_del_area_de_mantenimientoForm.get('Asignar_ejecutante').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
	  this.optionsAsignar_ejecutante = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingAsignar_ejecutante = false;
      this.hasOptionsAsignar_ejecutante = false;
      this.optionsAsignar_ejecutante = of([]);
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
      case 'Estatus': {
        this.Estatus_de_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Reporte = x.Estatus_de_Reportes;
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
displayFnAsignado_a(option: Spartan_User) {
    return option?.Name;
  }
displayFnAsignar_ejecutante(option: Spartan_User) {
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
      const entity = this.Productividad_del_area_de_mantenimientoForm.value;
      entity.Folio = this.model.Folio;
      entity.Modelo = this.Productividad_del_area_de_mantenimientoForm.get('Modelo').value.Clave;
      entity.Asignado_a = this.Productividad_del_area_de_mantenimientoForm.get('Asignado_a').value.Id_User;
      entity.Asignar_ejecutante = this.Productividad_del_area_de_mantenimientoForm.get('Asignar_ejecutante').value.Id_User;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Productividad_del_area_de_mantenimientoService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Productividad_del_area_de_mantenimientoService.insert(entity).toPromise().then(async id => {

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
      this.Productividad_del_area_de_mantenimientoForm.reset();
      this.model = new Productividad_del_area_de_mantenimiento(this.fb);
      this.Productividad_del_area_de_mantenimientoForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Productividad_del_area_de_mantenimiento/add']);
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
    this.router.navigate(['/Productividad_del_area_de_mantenimiento/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Matricula_ExecuteBusinessRules(): void {

//INICIA - BRID:3889 - al seleccionar matricula cargar modelo - Autor: Administrador - Actualización: 6/9/2021 5:25:24 PM
this.brf.SetValueFromQuery(this.Productividad_del_area_de_mantenimientoForm,"Modelo",this.brf.EvaluaQuery("SELECT Descripcion FROM modelos where Clave = (select modelo from aeronave where matricula= FLDD[Matricula])", 1, "ABC123"),1,"ABC123");
//TERMINA - BRID:3889

//Matricula_FieldExecuteBusinessRulesEnd

    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_vencimiento_ExecuteBusinessRules(): void {
        //Fecha_de_vencimiento_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
    }
    N_Reporte_ExecuteBusinessRules(): void {
        //N_Reporte_FieldExecuteBusinessRulesEnd
    }
    Asignado_a_ExecuteBusinessRules(): void {
        //Asignado_a_FieldExecuteBusinessRulesEnd
    }
    Tiempo_estimado_de_ejecucion_ExecuteBusinessRules(): void {
        //Tiempo_estimado_de_ejecucion_FieldExecuteBusinessRulesEnd
    }
    Tiempo_real_de_ejecucion_ExecuteBusinessRules(): void {
        //Tiempo_real_de_ejecucion_FieldExecuteBusinessRulesEnd
    }
    Asignar_ejecutante_ExecuteBusinessRules(): void {
        //Asignar_ejecutante_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:3890 - deshabilitar campo modelo - Autor: Administrador - Actualización: 6/4/2021 7:16:04 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetEnabledControl(this.Productividad_del_area_de_mantenimientoForm, 'Modelo', 0);
} 
//TERMINA - BRID:3890


//INICIA - BRID:3905 - filtrar modelos  - Autor: Administrador - Actualización: 6/9/2021 5:21:55 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {

} 
//TERMINA - BRID:3905


//INICIA - BRID:3956 - acomodo de campos, productividad del area de mantenimiento - Autor: Administrador - Actualización: 6/18/2021 4:00:06 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Productividad_del_area_de_mantenimientoForm, "Folio"); this.brf.SetNotRequiredControl(this.Productividad_del_area_de_mantenimientoForm, "Folio");
} 
//TERMINA - BRID:3956

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
