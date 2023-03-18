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
import { Notificaciones_de_mantenimientoService } from 'src/app/api-services/Notificaciones_de_mantenimiento.service';
import { Notificaciones_de_mantenimiento } from 'src/app/models/Notificaciones_de_mantenimiento';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';

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
  selector: 'app-Notificaciones_de_mantenimiento',
  templateUrl: './Notificaciones_de_mantenimiento.component.html',
  styleUrls: ['./Notificaciones_de_mantenimiento.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Notificaciones_de_mantenimientoComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Notificaciones_de_mantenimientoForm: FormGroup;
	public Editor = ClassicEditor;
	model: Notificaciones_de_mantenimiento;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varCodigo_Computarizado: Codigo_Computarizado[] = [];
	public varModelos: Modelos[] = [];
	public varPropietarios: Propietarios[] = [];
	public varAeronave: Aeronave[] = [];

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
    private Notificaciones_de_mantenimientoService: Notificaciones_de_mantenimientoService,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,
    private ModelosService: ModelosService,
    private PropietariosService: PropietariosService,
    private AeronaveService: AeronaveService,

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
    this.model = new Notificaciones_de_mantenimiento(this.fb);
    this.Notificaciones_de_mantenimientoForm = this.model.buildFormGroup();
	
	this.Notificaciones_de_mantenimientoForm.get('Folio').disable();
    this.Notificaciones_de_mantenimientoForm.get('Folio').setValue('Auto');
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
		
          this.Notificaciones_de_mantenimientoForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Notificaciones_de_mantenimiento)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Notificaciones_de_mantenimientoService.listaSelAll(0, 1, 'Notificaciones_de_mantenimiento.Folio=' + id).toPromise();
	if (result.Notificaciones_de_mantenimientos.length > 0) {
	  
        this.model.fromObject(result.Notificaciones_de_mantenimientos[0]);

		this.Notificaciones_de_mantenimientoForm.markAllAsTouched();
		this.Notificaciones_de_mantenimientoForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Notificaciones_de_mantenimientoForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.ModelosService.getAll());
    observablesArray.push(this.PropietariosService.getAll());
    observablesArray.push(this.AeronaveService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varCodigo_Computarizado , varModelos , varPropietarios , varAeronave ]) => {
          this.varCodigo_Computarizado = varCodigo_Computarizado;
          this.varModelos = varModelos;
          this.varPropietarios = varPropietarios;
          this.varAeronave = varAeronave;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Codigo_computarizado': {
        this.Codigo_ComputarizadoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCodigo_Computarizado = x.Codigo_Computarizados;
        });
        break;
      }
      case 'Modelo': {
        this.ModelosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varModelos = x.Modeloss;
        });
        break;
      }
      case 'Propietario': {
        this.PropietariosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varPropietarios = x.Propietarioss;
        });
        break;
      }
      case 'Matricula': {
        this.AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAeronave = x.Aeronaves;
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
      const entity = this.Notificaciones_de_mantenimientoForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Notificaciones_de_mantenimientoService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Notificaciones_de_mantenimientoService.insert(entity).toPromise().then(async id => {

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
      this.Notificaciones_de_mantenimientoForm.reset();
      this.model = new Notificaciones_de_mantenimiento(this.fb);
      this.Notificaciones_de_mantenimientoForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Notificaciones_de_mantenimiento/add']);
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
    this.router.navigate(['/Notificaciones_de_mantenimiento/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Codigo_computarizado_ExecuteBusinessRules(): void {
        //Codigo_computarizado_FieldExecuteBusinessRulesEnd
    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    Propietario_ExecuteBusinessRules(): void {
        //Propietario_FieldExecuteBusinessRulesEnd
    }
    Matricula_ExecuteBusinessRules(): void {
        //Matricula_FieldExecuteBusinessRulesEnd
    }
    ATA_ExecuteBusinessRules(): void {
        //ATA_FieldExecuteBusinessRulesEnd
    }
    No__Bitacora_ExecuteBusinessRules(): void {
        //No__Bitacora_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_mantenimiento_ExecuteBusinessRules(): void {
        //Fecha_de_mantenimiento_FieldExecuteBusinessRulesEnd
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
