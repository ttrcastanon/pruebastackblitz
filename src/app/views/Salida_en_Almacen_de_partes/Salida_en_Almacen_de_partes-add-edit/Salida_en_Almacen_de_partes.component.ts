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
import { Salida_en_Almacen_de_partesService } from 'src/app/api-services/Salida_en_Almacen_de_partes.service';
import { Salida_en_Almacen_de_partes } from 'src/app/models/Salida_en_Almacen_de_partes';
import { Estatus_de_RequeridoService } from 'src/app/api-services/Estatus_de_Requerido.service';
import { Estatus_de_Requerido } from 'src/app/models/Estatus_de_Requerido';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';

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
  selector: 'app-Salida_en_Almacen_de_partes',
  templateUrl: './Salida_en_Almacen_de_partes.component.html',
  styleUrls: ['./Salida_en_Almacen_de_partes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Salida_en_Almacen_de_partesComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Salida_en_Almacen_de_partesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Salida_en_Almacen_de_partes;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsSe_mantiene_el_No__de_Parte: Observable<Estatus_de_Requerido[]>;
	hasOptionsSe_mantiene_el_No__de_Parte: boolean;
	isLoadingSe_mantiene_el_No__de_Parte: boolean;
	public varSpartan_User: Spartan_User[] = [];
	optionsNo__de_OT: Observable<Orden_de_Trabajo[]>;
	hasOptionsNo__de_OT: boolean;
	isLoadingNo__de_OT: boolean;
	optionsNo__de_Reporte: Observable<Crear_Reporte[]>;
	hasOptionsNo__de_Reporte: boolean;
	isLoadingNo__de_Reporte: boolean;
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;

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
    private Salida_en_Almacen_de_partesService: Salida_en_Almacen_de_partesService,
    private Estatus_de_RequeridoService: Estatus_de_RequeridoService,
    private Spartan_UserService: Spartan_UserService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Crear_ReporteService: Crear_ReporteService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,

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
    this.model = new Salida_en_Almacen_de_partes(this.fb);
    this.Salida_en_Almacen_de_partesForm = this.model.buildFormGroup();
	
	this.Salida_en_Almacen_de_partesForm.get('Folio').disable();
    this.Salida_en_Almacen_de_partesForm.get('Folio').setValue('Auto');
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
		
          this.Salida_en_Almacen_de_partesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Salida_en_Almacen_de_partes)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Salida_en_Almacen_de_partesForm, 'Se_mantiene_el_No__de_Parte', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Salida_en_Almacen_de_partesForm, 'No__de_OT', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Salida_en_Almacen_de_partesForm, 'No__de_Reporte', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Salida_en_Almacen_de_partesForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Salida_en_Almacen_de_partesForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Salida_en_Almacen_de_partesService.listaSelAll(0, 1, 'Salida_en_Almacen_de_partes.Folio=' + id).toPromise();
	if (result.Salida_en_Almacen_de_partess.length > 0) {
	  
        this.model.fromObject(result.Salida_en_Almacen_de_partess[0]);
        this.Salida_en_Almacen_de_partesForm.get('Se_mantiene_el_No__de_Parte').setValue(
          result.Salida_en_Almacen_de_partess[0].Se_mantiene_el_No__de_Parte_Estatus_de_Requerido.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Salida_en_Almacen_de_partesForm.get('No__de_OT').setValue(
          result.Salida_en_Almacen_de_partess[0].No__de_OT_Orden_de_Trabajo.numero_de_orden,
          { onlySelf: false, emitEvent: true }
        );
        this.Salida_en_Almacen_de_partesForm.get('No__de_Reporte').setValue(
          result.Salida_en_Almacen_de_partess[0].No__de_Reporte_Crear_Reporte.No_Reporte,
          { onlySelf: false, emitEvent: true }
        );
        this.Salida_en_Almacen_de_partesForm.get('Matricula').setValue(
          result.Salida_en_Almacen_de_partess[0].Matricula_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );
        this.Salida_en_Almacen_de_partesForm.get('Modelo').setValue(
          result.Salida_en_Almacen_de_partess[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );

		this.Salida_en_Almacen_de_partesForm.markAllAsTouched();
		this.Salida_en_Almacen_de_partesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Salida_en_Almacen_de_partesForm.disabled ? "Update" : this.operation;
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

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varSpartan_User ]) => {
          this.varSpartan_User = varSpartan_User;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Salida_en_Almacen_de_partesForm.get('Se_mantiene_el_No__de_Parte').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingSe_mantiene_el_No__de_Parte = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Estatus_de_RequeridoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Estatus_de_RequeridoService.listaSelAll(0, 20, '');
          return this.Estatus_de_RequeridoService.listaSelAll(0, 20,
            "Estatus_de_Requerido.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Estatus_de_RequeridoService.listaSelAll(0, 20,
          "Estatus_de_Requerido.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingSe_mantiene_el_No__de_Parte = false;
      this.hasOptionsSe_mantiene_el_No__de_Parte = result?.Estatus_de_Requeridos?.length > 0;
	  this.Salida_en_Almacen_de_partesForm.get('Se_mantiene_el_No__de_Parte').setValue(result?.Estatus_de_Requeridos[0], { onlySelf: true, emitEvent: false });
	  this.optionsSe_mantiene_el_No__de_Parte = of(result?.Estatus_de_Requeridos);
    }, error => {
      this.isLoadingSe_mantiene_el_No__de_Parte = false;
      this.hasOptionsSe_mantiene_el_No__de_Parte = false;
      this.optionsSe_mantiene_el_No__de_Parte = of([]);
    });
    this.Salida_en_Almacen_de_partesForm.get('No__de_OT').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo__de_OT = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
          return this.Orden_de_TrabajoService.listaSelAll(0, 20,
            "Orden_de_Trabajo.numero_de_orden like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Orden_de_TrabajoService.listaSelAll(0, 20,
          "Orden_de_Trabajo.numero_de_orden like '%" + value.numero_de_orden.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNo__de_OT = false;
      this.hasOptionsNo__de_OT = result?.Orden_de_Trabajos?.length > 0;
	  this.Salida_en_Almacen_de_partesForm.get('No__de_OT').setValue(result?.Orden_de_Trabajos[0], { onlySelf: true, emitEvent: false });
	  this.optionsNo__de_OT = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingNo__de_OT = false;
      this.hasOptionsNo__de_OT = false;
      this.optionsNo__de_OT = of([]);
    });
    this.Salida_en_Almacen_de_partesForm.get('No__de_Reporte').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo__de_Reporte = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Crear_ReporteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Crear_ReporteService.listaSelAll(0, 20, '');
          return this.Crear_ReporteService.listaSelAll(0, 20,
            "Crear_Reporte.No_Reporte like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Crear_ReporteService.listaSelAll(0, 20,
          "Crear_Reporte.No_Reporte like '%" + value.No_Reporte.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNo__de_Reporte = false;
      this.hasOptionsNo__de_Reporte = result?.Crear_Reportes?.length > 0;
	  this.Salida_en_Almacen_de_partesForm.get('No__de_Reporte').setValue(result?.Crear_Reportes[0], { onlySelf: true, emitEvent: false });
	  this.optionsNo__de_Reporte = of(result?.Crear_Reportes);
    }, error => {
      this.isLoadingNo__de_Reporte = false;
      this.hasOptionsNo__de_Reporte = false;
      this.optionsNo__de_Reporte = of([]);
    });
    this.Salida_en_Almacen_de_partesForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeronaveService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeronaveService.listaSelAll(0, 20, '');
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Matricula like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeronaveService.listaSelAll(0, 20,
          "Aeronave.Matricula like '%" + value.Matricula.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = result?.Aeronaves?.length > 0;
	  this.Salida_en_Almacen_de_partesForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
	  this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Salida_en_Almacen_de_partesForm.get('Modelo').valueChanges.pipe(
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
	  this.Salida_en_Almacen_de_partesForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
	  this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });


  }

  //Open Salida de almacen
  OpenSalidaView(){
    let url = this.router.serializeUrl(this.router.createUrlTree([`#/Salida_en_almacen/edit/${this.model.Folio}`]));
    window.open(decodeURIComponent(url), "_blank", "width=800, height=600, top=200, left=500");
  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Solicitante': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

displayFnSe_mantiene_el_No__de_Parte(option: Estatus_de_Requerido) {
    return option?.Descripcion;
  }
displayFnNo__de_OT(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
displayFnNo__de_Reporte(option: Crear_Reporte) {
    return option?.No_Reporte;
  }
displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }


  async save() {
    await this.saveData();
    this.cancel();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Salida_en_Almacen_de_partesForm.value;
      entity.Folio = this.model.Folio;
      entity.Se_mantiene_el_No__de_Parte = this.Salida_en_Almacen_de_partesForm.get('Se_mantiene_el_No__de_Parte').value.Folio;
      entity.No__de_OT = this.Salida_en_Almacen_de_partesForm.get('No__de_OT').value.Folio;
      entity.No__de_Reporte = this.Salida_en_Almacen_de_partesForm.get('No__de_Reporte').value.Folio;
      entity.Matricula = this.Salida_en_Almacen_de_partesForm.get('Matricula').value.Matricula;
      entity.Modelo = this.Salida_en_Almacen_de_partesForm.get('Modelo').value.Clave;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Salida_en_Almacen_de_partesService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Salida_en_Almacen_de_partesService.insert(entity).toPromise().then(async id => {

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
      this.Salida_en_Almacen_de_partesForm.reset();
      this.model = new Salida_en_Almacen_de_partes(this.fb);
      this.Salida_en_Almacen_de_partesForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Salida_en_Almacen_de_partes/add']);
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
    this.router.navigate(['/Salida_en_Almacen_de_partes/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      No__de_Parte___Descripcion_ExecuteBusinessRules(): void {
        //No__de_Parte___Descripcion_FieldExecuteBusinessRulesEnd
    }
    Se_mantiene_el_No__de_Parte_ExecuteBusinessRules(): void {
        //Se_mantiene_el_No__de_Parte_FieldExecuteBusinessRulesEnd
    }
    No__de_parte_nuevo_ExecuteBusinessRules(): void {
        //No__de_parte_nuevo_FieldExecuteBusinessRulesEnd
    }
    No__de_serie_ExecuteBusinessRules(): void {
        //No__de_serie_FieldExecuteBusinessRulesEnd
    }
    No__de_lote_ExecuteBusinessRules(): void {
        //No__de_lote_FieldExecuteBusinessRulesEnd
    }
    Hora_acumuladas_ExecuteBusinessRules(): void {
        //Hora_acumuladas_FieldExecuteBusinessRulesEnd
    }
    Ciclos_acumulados_ExecuteBusinessRules(): void {
        //Ciclos_acumulados_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Vencimiento_ExecuteBusinessRules(): void {
        //Fecha_de_Vencimiento_FieldExecuteBusinessRulesEnd
    }
    Ubicacion_ExecuteBusinessRules(): void {
        //Ubicacion_FieldExecuteBusinessRulesEnd
    }
    Solicitante_ExecuteBusinessRules(): void {
        //Solicitante_FieldExecuteBusinessRulesEnd
    }
    No__de_OT_ExecuteBusinessRules(): void {
        //No__de_OT_FieldExecuteBusinessRulesEnd
    }
    No__de_Reporte_ExecuteBusinessRules(): void {
        //No__de_Reporte_FieldExecuteBusinessRulesEnd
    }
    Matricula_ExecuteBusinessRules(): void {
        //Matricula_FieldExecuteBusinessRulesEnd
    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    IdAsignacionPartes_ExecuteBusinessRules(): void {
        //IdAsignacionPartes_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4137 - Salida_en_Almacen_de_partes campos - Autor: Eliud Hernandez - Actualización: 7/14/2021 5:47:31 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4137


//INICIA - BRID:4631 - Ocultar campos folio, bloquear campos siempre  - Autor: Lizeth Villa - Actualización: 8/4/2021 11:12:41 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Salida_en_Almacen_de_partesForm, "Folio"); this.brf.SetNotRequiredControl(this.Salida_en_Almacen_de_partesForm, "Folio");this.brf.HideFieldOfForm(this.Salida_en_Almacen_de_partesForm, "IdAsignacionPartes"); this.brf.SetNotRequiredControl(this.Salida_en_Almacen_de_partesForm, "IdAsignacionPartes"); this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'No__de_Parte___Descripcion', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'Se_mantiene_el_No__de_Parte', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'No__de_parte_nuevo', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'Hora_acumuladas', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'Ciclos_acumulados', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'Fecha_de_Vencimiento', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'Ubicacion', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'Solicitante', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'No__de_OT', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'No__de_Reporte', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'Matricula', 0);this.brf.SetEnabledControl(this.Salida_en_Almacen_de_partesForm, 'Modelo', 0); this.brf.SetNotRequiredControl(this.Salida_en_Almacen_de_partesForm, "Folio");this.brf.SetNotRequiredControl(this.Salida_en_Almacen_de_partesForm, "IdAsignacionPartes");
} 
//TERMINA - BRID:4631


//INICIA - BRID:4639 - Asignar valores del mr en nuevo (con codigo manual, no desactivar) - Autor: Lizeth Villa - Actualización: 8/4/2021 1:17:17 PM
if(  this.operation == 'New' ) {
this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"No__de_Parte___Descripcion",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"Se_mantiene_el_No__de_Parte",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"No__de_parte_nuevo",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"Hora_acumuladas",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"Ciclos_acumulados",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"Fecha_de_Vencimiento",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"Ubicacion",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"Solicitante",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"No__de_OT",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"No__de_Reporte",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"Matricula",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Salida_en_Almacen_de_partesForm,"Modelo",this.brf.EvaluaQuery(" select variables manuales", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:4639

//rulesOnInit_ExecuteBusinessRulesEnd



  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:4632 - Asignar mismo id a campo idasignaciondepartes despues de guardar - Autor: Lizeth Villa - Actualización: 8/4/2021 11:56:11 AM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery("UPDATE Salida_en_Almacen_de_partes SET idAsignacionPartes = FOLIO WHERE FOLIO =  GLOBAL[KeyValueInserted]@LC@@LB@ ", 1, "ABC123");
} 
//TERMINA - BRID:4632

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
