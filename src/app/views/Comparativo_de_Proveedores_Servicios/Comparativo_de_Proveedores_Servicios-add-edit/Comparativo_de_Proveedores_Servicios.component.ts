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
import { Comparativo_de_Proveedores_ServiciosService } from 'src/app/api-services/Comparativo_de_Proveedores_Servicios.service';
import { Comparativo_de_Proveedores_Servicios } from 'src/app/models/Comparativo_de_Proveedores_Servicios';
import { Detalle_de_Solicitud_de_Servicios_Herramientas_MaterialesService } from 'src/app/api-services/Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.service';
import { Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales } from 'src/app/models/Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
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
  selector: 'app-Comparativo_de_Proveedores_Servicios',
  templateUrl: './Comparativo_de_Proveedores_Servicios.component.html',
  styleUrls: ['./Comparativo_de_Proveedores_Servicios.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Comparativo_de_Proveedores_ServiciosComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Comparativo_de_Proveedores_ServiciosForm: FormGroup;
	public Editor = ClassicEditor;
	model: Comparativo_de_Proveedores_Servicios;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varDetalle_de_Solicitud_de_Servicios_Herramientas_Materiales: Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales[] = [];
	public varAeronave: Aeronave[] = [];
	public varModelos: Modelos[] = [];
	public varSpartan_User: Spartan_User[] = [];

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
    private Comparativo_de_Proveedores_ServiciosService: Comparativo_de_Proveedores_ServiciosService,
    private Detalle_de_Solicitud_de_Servicios_Herramientas_MaterialesService: Detalle_de_Solicitud_de_Servicios_Herramientas_MaterialesService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
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
    this.model = new Comparativo_de_Proveedores_Servicios(this.fb);
    this.Comparativo_de_Proveedores_ServiciosForm = this.model.buildFormGroup();
	
	this.Comparativo_de_Proveedores_ServiciosForm.get('Folio').disable();
    this.Comparativo_de_Proveedores_ServiciosForm.get('Folio').setValue('Auto');
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
		
          this.Comparativo_de_Proveedores_ServiciosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Comparativo_de_Proveedores_Servicios)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Comparativo_de_Proveedores_ServiciosService.listaSelAll(0, 1, 'Comparativo_de_Proveedores_Servicios.Folio=' + id).toPromise();
	if (result.Comparativo_de_Proveedores_Servicioss.length > 0) {
	  
        this.model.fromObject(result.Comparativo_de_Proveedores_Servicioss[0]);

		this.Comparativo_de_Proveedores_ServiciosForm.markAllAsTouched();
		this.Comparativo_de_Proveedores_ServiciosForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Comparativo_de_Proveedores_ServiciosForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Detalle_de_Solicitud_de_Servicios_Herramientas_MaterialesService.getAll());
    observablesArray.push(this.AeronaveService.getAll());
    observablesArray.push(this.ModelosService.getAll());
    observablesArray.push(this.Spartan_UserService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varDetalle_de_Solicitud_de_Servicios_Herramientas_Materiales , varAeronave , varModelos , varSpartan_User ]) => {
          this.varDetalle_de_Solicitud_de_Servicios_Herramientas_Materiales = varDetalle_de_Solicitud_de_Servicios_Herramientas_Materiales;
          this.varAeronave = varAeronave;
          this.varModelos = varModelos;
          this.varSpartan_User = varSpartan_User;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Folio_MR_Servicios': {
        this.Detalle_de_Solicitud_de_Servicios_Herramientas_MaterialesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDetalle_de_Solicitud_de_Servicios_Herramientas_Materiales = x.Detalle_de_Solicitud_de_Servicios_Herramientas_Materialess;
        });
        break;
      }
      case 'Folio_MR_Fila_Servicios': {
        this.Detalle_de_Solicitud_de_Servicios_Herramientas_MaterialesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDetalle_de_Solicitud_de_Servicios_Herramientas_Materiales = x.Detalle_de_Solicitud_de_Servicios_Herramientas_Materialess;
        });
        break;
      }
      case 'Matricula': {
        this.AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAeronave = x.Aeronaves;
        });
        break;
      }
      case 'Modelo': {
        this.ModelosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varModelos = x.Modeloss;
        });
        break;
      }
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



  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Comparativo_de_Proveedores_ServiciosForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Comparativo_de_Proveedores_ServiciosService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Comparativo_de_Proveedores_ServiciosService.insert(entity).toPromise().then(async id => {

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
      this.Comparativo_de_Proveedores_ServiciosForm.reset();
      this.model = new Comparativo_de_Proveedores_Servicios(this.fb);
      this.Comparativo_de_Proveedores_ServiciosForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Comparativo_de_Proveedores_Servicios/add']);
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
    this.router.navigate(['/Comparativo_de_Proveedores_Servicios/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Folio_MR_Servicios_ExecuteBusinessRules(): void {
        //Folio_MR_Servicios_FieldExecuteBusinessRulesEnd
    }
    Folio_MR_Fila_Servicios_ExecuteBusinessRules(): void {
        //Folio_MR_Fila_Servicios_FieldExecuteBusinessRulesEnd
    }
    No__de_Parte_ExecuteBusinessRules(): void {
        //No__de_Parte_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Numero_de_Reporte_ExecuteBusinessRules(): void {
        //Numero_de_Reporte_FieldExecuteBusinessRulesEnd
    }
    Numero_de_O_T_ExecuteBusinessRules(): void {
        //Numero_de_O_T_FieldExecuteBusinessRulesEnd
    }
    Matricula_ExecuteBusinessRules(): void {
        //Matricula_FieldExecuteBusinessRulesEnd
    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    Fecha_Estimada_del_Mtto_ExecuteBusinessRules(): void {
        //Fecha_Estimada_del_Mtto_FieldExecuteBusinessRulesEnd
    }
    No__Solicitud_ExecuteBusinessRules(): void {
        //No__Solicitud_FieldExecuteBusinessRulesEnd
    }
    Solicitante_ExecuteBusinessRules(): void {
        //Solicitante_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Solicitud_ExecuteBusinessRules(): void {
        //Fecha_de_Solicitud_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
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
