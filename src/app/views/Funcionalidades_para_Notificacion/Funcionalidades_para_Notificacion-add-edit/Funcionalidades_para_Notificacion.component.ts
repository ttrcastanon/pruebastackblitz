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
import { Funcionalidades_para_NotificacionService } from 'src/app/api-services/Funcionalidades_para_Notificacion.service';
import { Funcionalidades_para_Notificacion } from 'src/app/models/Funcionalidades_para_Notificacion';
import { MS_Campos_por_FuncionalidadService } from 'src/app/api-services/MS_Campos_por_Funcionalidad.service';
import { MS_Campos_por_Funcionalidad } from 'src/app/models/MS_Campos_por_Funcionalidad';
import { Nombre_del_Campo_en_MSService } from 'src/app/api-services/Nombre_del_Campo_en_MS.service';
import { Nombre_del_Campo_en_MS } from 'src/app/models/Nombre_del_Campo_en_MS';

import { Estatus_de_Funcionalidad_para_NotificacionService } from 'src/app/api-services/Estatus_de_Funcionalidad_para_Notificacion.service';
import { Estatus_de_Funcionalidad_para_Notificacion } from 'src/app/models/Estatus_de_Funcionalidad_para_Notificacion';

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
  selector: 'app-Funcionalidades_para_Notificacion',
  templateUrl: './Funcionalidades_para_Notificacion.component.html',
  styleUrls: ['./Funcionalidades_para_Notificacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Funcionalidades_para_NotificacionComponent implements OnInit, AfterViewInit {
MRaddCampos_para_Vigencia: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Funcionalidades_para_NotificacionForm: FormGroup;
	public Editor = ClassicEditor;
	model: Funcionalidades_para_Notificacion;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varNombre_del_Campo_en_MS: Nombre_del_Campo_en_MS[] = [];


	public varEstatus_de_Funcionalidad_para_Notificacion: Estatus_de_Funcionalidad_para_Notificacion[] = [];

	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceCampos_para_Vigencia = new MatTableDataSource<MS_Campos_por_Funcionalidad>();
  Campos_para_VigenciaColumns = [
    { def: 'actions', hide: false },
    { def: 'Campo', hide: false },
	
  ];
  Campos_para_VigenciaData: MS_Campos_por_Funcionalidad[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Funcionalidades_para_NotificacionService: Funcionalidades_para_NotificacionService,
    private MS_Campos_por_FuncionalidadService: MS_Campos_por_FuncionalidadService,
    private Nombre_del_Campo_en_MSService: Nombre_del_Campo_en_MSService,

    private Estatus_de_Funcionalidad_para_NotificacionService: Estatus_de_Funcionalidad_para_NotificacionService,

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
    this.model = new Funcionalidades_para_Notificacion(this.fb);
    this.Funcionalidades_para_NotificacionForm = this.model.buildFormGroup();
    this.Campos_para_VigenciaItems.removeAt(0);
	
	this.Funcionalidades_para_NotificacionForm.get('Folio').disable();
    this.Funcionalidades_para_NotificacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceCampos_para_Vigencia.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Campos_para_VigenciaColumns.splice(0, 1);
		
          this.Funcionalidades_para_NotificacionForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Funcionalidades_para_Notificacion)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Funcionalidades_para_NotificacionService.listaSelAll(0, 1, 'Funcionalidades_para_Notificacion.Folio=' + id).toPromise();
	if (result.Funcionalidades_para_Notificacions.length > 0) {
        let fCampos_para_Vigencia = await this.MS_Campos_por_FuncionalidadService.listaSelAll(0, 1000,'Funcionalidades_para_Notificacion.Folio=' + id).toPromise();
            this.Campos_para_VigenciaData = fCampos_para_Vigencia.MS_Campos_por_Funcionalidads;
            this.loadCampos_para_Vigencia(fCampos_para_Vigencia.MS_Campos_por_Funcionalidads);
            this.dataSourceCampos_para_Vigencia = new MatTableDataSource(fCampos_para_Vigencia.MS_Campos_por_Funcionalidads);
            this.dataSourceCampos_para_Vigencia.paginator = this.paginator;
            this.dataSourceCampos_para_Vigencia.sort = this.sort;
	  
        this.model.fromObject(result.Funcionalidades_para_Notificacions[0]);

		this.Funcionalidades_para_NotificacionForm.markAllAsTouched();
		this.Funcionalidades_para_NotificacionForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Campos_para_VigenciaItems() {
    return this.Funcionalidades_para_NotificacionForm.get('MS_Campos_por_FuncionalidadItems') as FormArray;
  }

  getCampos_para_VigenciaColumns(): string[] {
    return this.Campos_para_VigenciaColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadCampos_para_Vigencia(Campos_para_Vigencia: MS_Campos_por_Funcionalidad[]) {
    Campos_para_Vigencia.forEach(element => {
      this.addCampos_para_Vigencia(element);
    });
  }

  addCampos_para_VigenciaToMR() {
    const Campos_para_Vigencia = new MS_Campos_por_Funcionalidad(this.fb);
    this.Campos_para_VigenciaData.push(this.addCampos_para_Vigencia(Campos_para_Vigencia));
    this.dataSourceCampos_para_Vigencia.data = this.Campos_para_VigenciaData;
    Campos_para_Vigencia.edit = true;
    Campos_para_Vigencia.isNew = true;
    const length = this.dataSourceCampos_para_Vigencia.data.length;
    const index = length - 1;
    const formCampos_para_Vigencia = this.Campos_para_VigenciaItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceCampos_para_Vigencia.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addCampos_para_Vigencia(entity: MS_Campos_por_Funcionalidad) {
    const Campos_para_Vigencia = new MS_Campos_por_Funcionalidad(this.fb);
    this.Campos_para_VigenciaItems.push(Campos_para_Vigencia.buildFormGroup());
    if (entity) {
      Campos_para_Vigencia.fromObject(entity);
    }
	return entity;
  }  

  Campos_para_VigenciaItemsByFolio(Folio: number): FormGroup {
    return (this.Funcionalidades_para_NotificacionForm.get('MS_Campos_por_FuncionalidadItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Campos_para_VigenciaItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceCampos_para_Vigencia.data.indexOf(element);
	let fb = this.Campos_para_VigenciaItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteCampos_para_Vigencia(element: any) {
    let index = this.dataSourceCampos_para_Vigencia.data.indexOf(element);
    this.Campos_para_VigenciaData[index].IsDeleted = true;
    this.dataSourceCampos_para_Vigencia.data = this.Campos_para_VigenciaData;
    this.dataSourceCampos_para_Vigencia._updateChangeSubscription();
    index = this.dataSourceCampos_para_Vigencia.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditCampos_para_Vigencia(element: any) {
    let index = this.dataSourceCampos_para_Vigencia.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Campos_para_VigenciaData[index].IsDeleted = true;
      this.dataSourceCampos_para_Vigencia.data = this.Campos_para_VigenciaData;
      this.dataSourceCampos_para_Vigencia._updateChangeSubscription();
      index = this.Campos_para_VigenciaData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveCampos_para_Vigencia(element: any) {
    const index = this.dataSourceCampos_para_Vigencia.data.indexOf(element);
    const formCampos_para_Vigencia = this.Campos_para_VigenciaItems.controls[index] as FormGroup;
    this.Campos_para_VigenciaData[index].Campo = formCampos_para_Vigencia.value.Campo;
    this.Campos_para_VigenciaData[index].Campo_Nombre_del_Campo_en_MS = formCampos_para_Vigencia.value.Campo !== '' ?
     this.varNombre_del_Campo_en_MS.filter(d => d.Clave === formCampos_para_Vigencia.value.Campo)[0] : null ;	
	
    this.Campos_para_VigenciaData[index].isNew = false;
    this.dataSourceCampos_para_Vigencia.data = this.Campos_para_VigenciaData;
    this.dataSourceCampos_para_Vigencia._updateChangeSubscription();
  }
  
  editCampos_para_Vigencia(element: any) {
    const index = this.dataSourceCampos_para_Vigencia.data.indexOf(element);
    const formCampos_para_Vigencia = this.Campos_para_VigenciaItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveMS_Campos_por_Funcionalidad(Folio: number) {
    this.dataSourceCampos_para_Vigencia.data.forEach(async (d, index) => {
      const data = this.Campos_para_VigenciaItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Funcionalidades_para_Notificacion = Folio;
	
      
      if (model.Folio === 0) {
        // Add Campos para Vigencia
		let response = await this.MS_Campos_por_FuncionalidadService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formCampos_para_Vigencia = this.Campos_para_VigenciaItemsByFolio(model.Folio);
        if (formCampos_para_Vigencia.dirty) {
          // Update Campos para Vigencia
          let response = await this.MS_Campos_por_FuncionalidadService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Campos para Vigencia
        await this.MS_Campos_por_FuncionalidadService.delete(model.Folio).toPromise();
      }
    });
  }



  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Funcionalidades_para_NotificacionForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Nombre_del_Campo_en_MSService.getAll());

    observablesArray.push(this.Estatus_de_Funcionalidad_para_NotificacionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varNombre_del_Campo_en_MS  , varEstatus_de_Funcionalidad_para_Notificacion ]) => {
          this.varNombre_del_Campo_en_MS = varNombre_del_Campo_en_MS;

          this.varEstatus_de_Funcionalidad_para_Notificacion = varEstatus_de_Funcionalidad_para_Notificacion;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Campo': {
        this.Nombre_del_Campo_en_MSService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varNombre_del_Campo_en_MS = x.Nombre_del_Campo_en_MSs;
        });
        break;
      }

      case 'Campos_de_Estatus': {
        this.Estatus_de_Funcionalidad_para_NotificacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Funcionalidad_para_Notificacion = x.Estatus_de_Funcionalidad_para_Notificacions;
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
      const entity = this.Funcionalidades_para_NotificacionForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Funcionalidades_para_NotificacionService.update(this.model.Folio, entity).toPromise();

        await this.saveMS_Campos_por_Funcionalidad(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Funcionalidades_para_NotificacionService.insert(entity).toPromise().then(async id => {
          await this.saveMS_Campos_por_Funcionalidad(id);

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
      this.Funcionalidades_para_NotificacionForm.reset();
      this.model = new Funcionalidades_para_Notificacion(this.fb);
      this.Funcionalidades_para_NotificacionForm = this.model.buildFormGroup();
      this.dataSourceCampos_para_Vigencia = new MatTableDataSource<MS_Campos_por_Funcionalidad>();
      this.Campos_para_VigenciaData = [];

    } else {
      this.router.navigate(['views/Funcionalidades_para_Notificacion/add']);
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
    this.router.navigate(['/Funcionalidades_para_Notificacion/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Funcionalidad_ExecuteBusinessRules(): void {
        //Funcionalidad_FieldExecuteBusinessRulesEnd
    }
    Nombre_de_la_Tabla_ExecuteBusinessRules(): void {
        //Nombre_de_la_Tabla_FieldExecuteBusinessRulesEnd
    }
    Campos_de_Estatus_ExecuteBusinessRules(): void {
        //Campos_de_Estatus_FieldExecuteBusinessRulesEnd
    }
    Validacion_Obligatoria_ExecuteBusinessRules(): void {
        //Validacion_Obligatoria_FieldExecuteBusinessRulesEnd
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
