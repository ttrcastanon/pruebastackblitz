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
import { Configuracion_de_NotificacionService } from 'src/app/api-services/Configuracion_de_Notificacion.service';
import { Configuracion_de_Notificacion } from 'src/app/models/Configuracion_de_Notificacion';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Roles_para_NotificarService } from 'src/app/api-services/Roles_para_Notificar.service';
import { Roles_para_Notificar } from 'src/app/models/Roles_para_Notificar';
import { Funcionalidades_para_NotificacionService } from 'src/app/api-services/Funcionalidades_para_Notificacion.service';
import { Funcionalidades_para_Notificacion } from 'src/app/models/Funcionalidades_para_Notificacion';
import { Tipo_de_NotificacionService } from 'src/app/api-services/Tipo_de_Notificacion.service';
import { Tipo_de_Notificacion } from 'src/app/models/Tipo_de_Notificacion';
import { Tipo_de_Accion_NotificacionService } from 'src/app/api-services/Tipo_de_Accion_Notificacion.service';
import { Tipo_de_Accion_Notificacion } from 'src/app/models/Tipo_de_Accion_Notificacion';
import { Tipo_de_Recordatorio_NotificacionService } from 'src/app/api-services/Tipo_de_Recordatorio_Notificacion.service';
import { Tipo_de_Recordatorio_Notificacion } from 'src/app/models/Tipo_de_Recordatorio_Notificacion';
import { Nombre_del_Campo_en_MSService } from 'src/app/api-services/Nombre_del_Campo_en_MS.service';
import { Nombre_del_Campo_en_MS } from 'src/app/models/Nombre_del_Campo_en_MS';
import { Estatus_NotificacionService } from 'src/app/api-services/Estatus_Notificacion.service';
import { Estatus_Notificacion } from 'src/app/models/Estatus_Notificacion';
import { Detalle_Frecuencia_NotificacionesService } from 'src/app/api-services/Detalle_Frecuencia_Notificaciones.service';
import { Detalle_Frecuencia_Notificaciones } from 'src/app/models/Detalle_Frecuencia_Notificaciones';
import { Tipo_Frecuencia_NotificacionService } from 'src/app/api-services/Tipo_Frecuencia_Notificacion.service';
import { Tipo_Frecuencia_Notificacion } from 'src/app/models/Tipo_Frecuencia_Notificacion';
import { Tipo_Dia_NotificacionService } from 'src/app/api-services/Tipo_Dia_Notificacion.service';
import { Tipo_Dia_Notificacion } from 'src/app/models/Tipo_Dia_Notificacion';


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
  selector: 'app-Configuracion_de_Notificacion',
  templateUrl: './Configuracion_de_Notificacion.component.html',
  styleUrls: ['./Configuracion_de_Notificacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Configuracion_de_NotificacionComponent implements OnInit, AfterViewInit {
MRaddFrecuencia_Notificacion: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Configuracion_de_NotificacionForm: FormGroup;
	public Editor = ClassicEditor;
	model: Configuracion_de_Notificacion;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsUsuario_que_Registra: Observable<Spartan_User[]>;
	hasOptionsUsuario_que_Registra: boolean;
	isLoadingUsuario_que_Registra: boolean;
	public varFuncionalidades_para_Notificacion: Funcionalidades_para_Notificacion[] = [];
	public varTipo_de_Notificacion: Tipo_de_Notificacion[] = [];
	public varTipo_de_Accion_Notificacion: Tipo_de_Accion_Notificacion[] = [];
	public varTipo_de_Recordatorio_Notificacion: Tipo_de_Recordatorio_Notificacion[] = [];
	public varNombre_del_Campo_en_MS: Nombre_del_Campo_en_MS[] = [];
	public varEstatus_Notificacion: Estatus_Notificacion[] = [];
	public varTipo_Frecuencia_Notificacion: Tipo_Frecuencia_Notificacion[] = [];
	public varTipo_Dia_Notificacion: Tipo_Dia_Notificacion[] = [];



	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceFrecuencia_Notificacion = new MatTableDataSource<Detalle_Frecuencia_Notificaciones>();
  Frecuencia_NotificacionColumns = [
    { def: 'actions', hide: false },
    { def: 'Frecuencia', hide: false },
    { def: 'Dia', hide: false },
    { def: 'Hora', hide: false },
	
  ];
  Frecuencia_NotificacionData: Detalle_Frecuencia_Notificaciones[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Configuracion_de_NotificacionService: Configuracion_de_NotificacionService,
    private Spartan_UserService: Spartan_UserService,
    private Roles_para_NotificarService: Roles_para_NotificarService,
    private Funcionalidades_para_NotificacionService: Funcionalidades_para_NotificacionService,
    private Tipo_de_NotificacionService: Tipo_de_NotificacionService,
    private Tipo_de_Accion_NotificacionService: Tipo_de_Accion_NotificacionService,
    private Tipo_de_Recordatorio_NotificacionService: Tipo_de_Recordatorio_NotificacionService,
    private Nombre_del_Campo_en_MSService: Nombre_del_Campo_en_MSService,
    private Estatus_NotificacionService: Estatus_NotificacionService,
    private Detalle_Frecuencia_NotificacionesService: Detalle_Frecuencia_NotificacionesService,
    private Tipo_Frecuencia_NotificacionService: Tipo_Frecuencia_NotificacionService,
    private Tipo_Dia_NotificacionService: Tipo_Dia_NotificacionService,


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
    this.model = new Configuracion_de_Notificacion(this.fb);
    this.Configuracion_de_NotificacionForm = this.model.buildFormGroup();
    this.Frecuencia_NotificacionItems.removeAt(0);
	
	this.Configuracion_de_NotificacionForm.get('Folio').disable();
    this.Configuracion_de_NotificacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceFrecuencia_Notificacion.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Frecuencia_NotificacionColumns.splice(0, 1);
		
          this.Configuracion_de_NotificacionForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Configuracion_de_Notificacion)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Configuracion_de_NotificacionForm, 'Usuario_que_Registra', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Configuracion_de_NotificacionService.listaSelAll(0, 1, 'Configuracion_de_Notificacion.Folio=' + id).toPromise();
	if (result.Configuracion_de_Notificacions.length > 0) {
        let fFrecuencia_Notificacion = await this.Detalle_Frecuencia_NotificacionesService.listaSelAll(0, 1000,'Configuracion_de_Notificacion.Folio=' + id).toPromise();
            this.Frecuencia_NotificacionData = fFrecuencia_Notificacion.Detalle_Frecuencia_Notificacioness;
            this.loadFrecuencia_Notificacion(fFrecuencia_Notificacion.Detalle_Frecuencia_Notificacioness);
            this.dataSourceFrecuencia_Notificacion = new MatTableDataSource(fFrecuencia_Notificacion.Detalle_Frecuencia_Notificacioness);
            this.dataSourceFrecuencia_Notificacion.paginator = this.paginator;
            this.dataSourceFrecuencia_Notificacion.sort = this.sort;
	  
        this.model.fromObject(result.Configuracion_de_Notificacions[0]);
        this.Configuracion_de_NotificacionForm.get('Usuario_que_Registra').setValue(
          result.Configuracion_de_Notificacions[0].Usuario_que_Registra_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );

		this.Configuracion_de_NotificacionForm.markAllAsTouched();
		this.Configuracion_de_NotificacionForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Frecuencia_NotificacionItems() {
    return this.Configuracion_de_NotificacionForm.get('Detalle_Frecuencia_NotificacionesItems') as FormArray;
  }

  getFrecuencia_NotificacionColumns(): string[] {
    return this.Frecuencia_NotificacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadFrecuencia_Notificacion(Frecuencia_Notificacion: Detalle_Frecuencia_Notificaciones[]) {
    Frecuencia_Notificacion.forEach(element => {
      this.addFrecuencia_Notificacion(element);
    });
  }

  addFrecuencia_NotificacionToMR() {
    const Frecuencia_Notificacion = new Detalle_Frecuencia_Notificaciones(this.fb);
    this.Frecuencia_NotificacionData.push(this.addFrecuencia_Notificacion(Frecuencia_Notificacion));
    this.dataSourceFrecuencia_Notificacion.data = this.Frecuencia_NotificacionData;
    Frecuencia_Notificacion.edit = true;
    Frecuencia_Notificacion.isNew = true;
    const length = this.dataSourceFrecuencia_Notificacion.data.length;
    const index = length - 1;
    const formFrecuencia_Notificacion = this.Frecuencia_NotificacionItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceFrecuencia_Notificacion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addFrecuencia_Notificacion(entity: Detalle_Frecuencia_Notificaciones) {
    const Frecuencia_Notificacion = new Detalle_Frecuencia_Notificaciones(this.fb);
    this.Frecuencia_NotificacionItems.push(Frecuencia_Notificacion.buildFormGroup());
    if (entity) {
      Frecuencia_Notificacion.fromObject(entity);
    }
	return entity;
  }  

  Frecuencia_NotificacionItemsByFolio(Folio: number): FormGroup {
    return (this.Configuracion_de_NotificacionForm.get('Detalle_Frecuencia_NotificacionesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Frecuencia_NotificacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceFrecuencia_Notificacion.data.indexOf(element);
	let fb = this.Frecuencia_NotificacionItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteFrecuencia_Notificacion(element: any) {
    let index = this.dataSourceFrecuencia_Notificacion.data.indexOf(element);
    this.Frecuencia_NotificacionData[index].IsDeleted = true;
    this.dataSourceFrecuencia_Notificacion.data = this.Frecuencia_NotificacionData;
    this.dataSourceFrecuencia_Notificacion._updateChangeSubscription();
    index = this.dataSourceFrecuencia_Notificacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditFrecuencia_Notificacion(element: any) {
    let index = this.dataSourceFrecuencia_Notificacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Frecuencia_NotificacionData[index].IsDeleted = true;
      this.dataSourceFrecuencia_Notificacion.data = this.Frecuencia_NotificacionData;
      this.dataSourceFrecuencia_Notificacion._updateChangeSubscription();
      index = this.Frecuencia_NotificacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveFrecuencia_Notificacion(element: any) {
    const index = this.dataSourceFrecuencia_Notificacion.data.indexOf(element);
    const formFrecuencia_Notificacion = this.Frecuencia_NotificacionItems.controls[index] as FormGroup;
    this.Frecuencia_NotificacionData[index].Frecuencia = formFrecuencia_Notificacion.value.Frecuencia;
    this.Frecuencia_NotificacionData[index].Frecuencia_Tipo_Frecuencia_Notificacion = formFrecuencia_Notificacion.value.Frecuencia !== '' ?
     this.varTipo_Frecuencia_Notificacion.filter(d => d.Clave === formFrecuencia_Notificacion.value.Frecuencia)[0] : null ;	
    this.Frecuencia_NotificacionData[index].Dia = formFrecuencia_Notificacion.value.Dia;
    this.Frecuencia_NotificacionData[index].Dia_Tipo_Dia_Notificacion = formFrecuencia_Notificacion.value.Dia !== '' ?
     this.varTipo_Dia_Notificacion.filter(d => d.Clave === formFrecuencia_Notificacion.value.Dia)[0] : null ;	
    this.Frecuencia_NotificacionData[index].Hora = formFrecuencia_Notificacion.value.Hora;
	
    this.Frecuencia_NotificacionData[index].isNew = false;
    this.dataSourceFrecuencia_Notificacion.data = this.Frecuencia_NotificacionData;
    this.dataSourceFrecuencia_Notificacion._updateChangeSubscription();
  }
  
  editFrecuencia_Notificacion(element: any) {
    const index = this.dataSourceFrecuencia_Notificacion.data.indexOf(element);
    const formFrecuencia_Notificacion = this.Frecuencia_NotificacionItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_Frecuencia_Notificaciones(Folio: number) {
    this.dataSourceFrecuencia_Notificacion.data.forEach(async (d, index) => {
      const data = this.Frecuencia_NotificacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Configuracion_de_Notificacion = Folio;
	
      
      if (model.Folio === 0) {
        // Add Frecuencia Notificación
		let response = await this.Detalle_Frecuencia_NotificacionesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formFrecuencia_Notificacion = this.Frecuencia_NotificacionItemsByFolio(model.Folio);
        if (formFrecuencia_Notificacion.dirty) {
          // Update Frecuencia Notificación
          let response = await this.Detalle_Frecuencia_NotificacionesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Frecuencia Notificación
        await this.Detalle_Frecuencia_NotificacionesService.delete(model.Folio).toPromise();
      }
    });
  }



  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Configuracion_de_NotificacionForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Funcionalidades_para_NotificacionService.getAll());
    observablesArray.push(this.Tipo_de_NotificacionService.getAll());
    observablesArray.push(this.Tipo_de_Accion_NotificacionService.getAll());
    observablesArray.push(this.Tipo_de_Recordatorio_NotificacionService.getAll());
    observablesArray.push(this.Nombre_del_Campo_en_MSService.getAll());
    observablesArray.push(this.Estatus_NotificacionService.getAll());
    observablesArray.push(this.Tipo_Frecuencia_NotificacionService.getAll());
    observablesArray.push(this.Tipo_Dia_NotificacionService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varFuncionalidades_para_Notificacion , varTipo_de_Notificacion , varTipo_de_Accion_Notificacion , varTipo_de_Recordatorio_Notificacion , varNombre_del_Campo_en_MS , varEstatus_Notificacion , varTipo_Frecuencia_Notificacion  , varTipo_Dia_Notificacion  ]) => {
          this.varFuncionalidades_para_Notificacion = varFuncionalidades_para_Notificacion;
          this.varTipo_de_Notificacion = varTipo_de_Notificacion;
          this.varTipo_de_Accion_Notificacion = varTipo_de_Accion_Notificacion;
          this.varTipo_de_Recordatorio_Notificacion = varTipo_de_Recordatorio_Notificacion;
          this.varNombre_del_Campo_en_MS = varNombre_del_Campo_en_MS;
          this.varEstatus_Notificacion = varEstatus_Notificacion;
          this.varTipo_Frecuencia_Notificacion = varTipo_Frecuencia_Notificacion;
          this.varTipo_Dia_Notificacion = varTipo_Dia_Notificacion;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Configuracion_de_NotificacionForm.get('Usuario_que_Registra').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUsuario_que_Registra = true),
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
      this.isLoadingUsuario_que_Registra = false;
      this.hasOptionsUsuario_que_Registra = result?.Spartan_Users?.length > 0;
	  this.Configuracion_de_NotificacionForm.get('Usuario_que_Registra').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
	  this.optionsUsuario_que_Registra = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingUsuario_que_Registra = false;
      this.hasOptionsUsuario_que_Registra = false;
      this.optionsUsuario_que_Registra = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Funcionalidad': {
        this.Funcionalidades_para_NotificacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varFuncionalidades_para_Notificacion = x.Funcionalidades_para_Notificacions;
        });
        break;
      }
      case 'Tipo_de_Notificacion': {
        this.Tipo_de_NotificacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Notificacion = x.Tipo_de_Notificacions;
        });
        break;
      }
      case 'Tipo_de_Accion': {
        this.Tipo_de_Accion_NotificacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Accion_Notificacion = x.Tipo_de_Accion_Notificacions;
        });
        break;
      }
      case 'Tipo_de_Recordatorio': {
        this.Tipo_de_Recordatorio_NotificacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Recordatorio_Notificacion = x.Tipo_de_Recordatorio_Notificacions;
        });
        break;
      }
      case 'Fecha_a_Validar': {
        this.Nombre_del_Campo_en_MSService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varNombre_del_Campo_en_MS = x.Nombre_del_Campo_en_MSs;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_NotificacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_Notificacion = x.Estatus_Notificacions;
        });
        break;
      }
      case 'Frecuencia': {
        this.Tipo_Frecuencia_NotificacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_Frecuencia_Notificacion = x.Tipo_Frecuencia_Notificacions;
        });
        break;
      }
      case 'Dia': {
        this.Tipo_Dia_NotificacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_Dia_Notificacion = x.Tipo_Dia_Notificacions;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

displayFnUsuario_que_Registra(option: Spartan_User) {
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
      const entity = this.Configuracion_de_NotificacionForm.value;
      entity.Folio = this.model.Folio;
      entity.Usuario_que_Registra = this.Configuracion_de_NotificacionForm.get('Usuario_que_Registra').value.Id_User;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Configuracion_de_NotificacionService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Frecuencia_Notificaciones(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Configuracion_de_NotificacionService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Frecuencia_Notificaciones(id);

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
      this.Configuracion_de_NotificacionForm.reset();
      this.model = new Configuracion_de_Notificacion(this.fb);
      this.Configuracion_de_NotificacionForm = this.model.buildFormGroup();
      this.dataSourceFrecuencia_Notificacion = new MatTableDataSource<Detalle_Frecuencia_Notificaciones>();
      this.Frecuencia_NotificacionData = [];

    } else {
      this.router.navigate(['views/Configuracion_de_Notificacion/add']);
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
    this.router.navigate(['/Configuracion_de_Notificacion/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Fecha_de_Registro_ExecuteBusinessRules(): void {
        //Fecha_de_Registro_FieldExecuteBusinessRulesEnd
    }
    Hora_de_Registro_ExecuteBusinessRules(): void {
        //Hora_de_Registro_FieldExecuteBusinessRulesEnd
    }
    Usuario_que_Registra_ExecuteBusinessRules(): void {
        //Usuario_que_Registra_FieldExecuteBusinessRulesEnd
    }
    Nombre_de_la_Notificacion_ExecuteBusinessRules(): void {
        //Nombre_de_la_Notificacion_FieldExecuteBusinessRulesEnd
    }
    Es_Permanente_ExecuteBusinessRules(): void {

//INICIA - BRID:1120 - regla para es permanente  - Autor: Administrador - Actualización: 3/5/2021 12:23:06 PM
if( this.brf.GetValueByControlType(this.Configuracion_de_NotificacionForm, 'Es_Permanente')==this.brf.TryParseInt('true', 'true') ) { this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tiene_Fecha_de_Finalizacion_Definida");this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar");this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar");this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_Fin"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tiene_Fecha_de_Finalizacion_Definida"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tiene_Fecha_de_Finalizacion_Definida");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Fecha_Fin"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_Fin");} else { this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tiene_Fecha_de_Finalizacion_Definida");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Fecha_Fin"); this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Tiene_Fecha_de_Finalizacion_Definida");this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar");this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar");this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_Fin");}
//TERMINA - BRID:1120

//Es_Permanente_FieldExecuteBusinessRulesEnd

    }
    Funcionalidad_ExecuteBusinessRules(): void {
        //Funcionalidad_FieldExecuteBusinessRulesEnd
    }
    Tipo_de_Notificacion_ExecuteBusinessRules(): void {

//INICIA - BRID:1122 - Al realizar una acción	 - Autor: Administrador - Actualización: 3/5/2021 12:39:12 PM
if( this.brf.GetValueByControlType(this.Configuracion_de_NotificacionForm, 'Tipo_de_Notificacion')==this.brf.TryParseInt('1', '1') ) { this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion"); this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion"); this.brf.SetValueFromQuery(this.Configuracion_de_NotificacionForm,"Es_Permanente",this.brf.EvaluaQuery("select 'true'", 1, "ABC123"),1,"ABC123"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio"); } else { this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion"); this.brf.SetValueFromQuery(this.Configuracion_de_NotificacionForm,"Es_Permanente",this.brf.EvaluaQuery(" select 'false'", 1, "ABC123"),1,"ABC123"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio"); this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio"); }
//TERMINA - BRID:1122


//INICIA - BRID:1124 - 2.- recordatorio - Autor: Administrador - Actualización: 3/5/2021 1:54:58 PM
if( this.brf.GetValueByControlType(this.Configuracion_de_NotificacionForm, 'Tipo_de_Notificacion')==this.brf.TryParseInt('2', '2') ) { this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio"); this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio");  this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion"); this.brf.SetValueFromQuery(this.Configuracion_de_NotificacionForm,"Es_Permanente",this.brf.EvaluaQuery(" select 'false'", 1, "ABC123"),1,"ABC123");} else {}
//TERMINA - BRID:1124

//Tipo_de_Notificacion_FieldExecuteBusinessRulesEnd


    }
    Tipo_de_Accion_ExecuteBusinessRules(): void {
        //Tipo_de_Accion_FieldExecuteBusinessRulesEnd
    }
    Tipo_de_Recordatorio_ExecuteBusinessRules(): void {
        //Tipo_de_Recordatorio_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Inicio_ExecuteBusinessRules(): void {
        //Fecha_de_Inicio_FieldExecuteBusinessRulesEnd
    }
    Tiene_Fecha_de_Finalizacion_Definida_ExecuteBusinessRules(): void {

//INICIA - BRID:1125 - 1.-Tiene fecha definida - Autor: Administrador - Actualización: 3/5/2021 4:39:29 PM
if( this.brf.GetValueByControlType(this.Configuracion_de_NotificacionForm, 'Tiene_Fecha_de_Finalizacion_Definida')==this.brf.TryParseInt('true', 'true') ) { this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Fecha_Fin"); this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_Fin"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar");} else { this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar"); this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar");this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Fecha_Fin"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_Fin");}
//TERMINA - BRID:1125

//Tiene_Fecha_de_Finalizacion_Definida_FieldExecuteBusinessRulesEnd

    }
    Cantidad_de_Dias_a_Validar_ExecuteBusinessRules(): void {
        //Cantidad_de_Dias_a_Validar_FieldExecuteBusinessRulesEnd
    }
    Fecha_a_Validar_ExecuteBusinessRules(): void {
        //Fecha_a_Validar_FieldExecuteBusinessRulesEnd
    }
    Fecha_Fin_ExecuteBusinessRules(): void {
        //Fecha_Fin_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
    }
    Notificar__por_Correo_ExecuteBusinessRules(): void {

//INICIA - BRID:1123 - 1.- enviar correo activo - Autor: Administrador - Actualización: 3/5/2021 1:45:23 PM
if( this.brf.GetValueByControlType(this.Configuracion_de_NotificacionForm, 'Notificar__por_Correo')==this.brf.TryParseInt('true', 'true') ) { this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo"); this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo");} else { this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo");}
//TERMINA - BRID:1123

//Notificar__por_Correo_FieldExecuteBusinessRulesEnd

    }
    Texto_que_llevara_el_Correo_ExecuteBusinessRules(): void {
        //Texto_que_llevara_el_Correo_FieldExecuteBusinessRulesEnd
    }
    Notificacion_push_ExecuteBusinessRules(): void {

//INICIA - BRID:1131 - regla para notificacion push - Autor: Administrador - Actualización: 3/5/2021 6:55:14 PM
if( this.brf.GetValueByControlType(this.Configuracion_de_NotificacionForm, 'Notificacion_push')==this.brf.TryParseInt('true', 'true') ) { this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Texto_a_Mostrar_en_la_Notificacion_push"); this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_a_Mostrar_en_la_Notificacion_push");} else { this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_a_Mostrar_en_la_Notificacion_push"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Texto_a_Mostrar_en_la_Notificacion_push"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_a_Mostrar_en_la_Notificacion_push");}
//TERMINA - BRID:1131

//Notificacion_push_FieldExecuteBusinessRulesEnd

    }
    Texto_a_Mostrar_en_la_Notificacion_push_ExecuteBusinessRules(): void {
        //Texto_a_Mostrar_en_la_Notificacion_push_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:1031 - campos ocultos al nuevo - Autor: Administrador - Actualización: 3/5/2021 12:09:16 PM
if(  this.operation == 'New' ) {
this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion");this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio");this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tiene_Fecha_de_Finalizacion_Definida");this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar");this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar");this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo");this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_a_Mostrar_en_la_Notificacion_push"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Accion");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tipo_de_Recordatorio");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Tiene_Fecha_de_Finalizacion_Definida"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Tiene_Fecha_de_Finalizacion_Definida");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Cantidad_de_Dias_a_Validar");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Fecha_a_Validar");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo");this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Texto_a_Mostrar_en_la_Notificacion_push"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_a_Mostrar_en_la_Notificacion_push");  this.brf.SetValueFromQuery(this.Configuracion_de_NotificacionForm,"Fecha_de_Inicio",this.brf.EvaluaQuery(" select convert (varchar(11),getdate(),105)	", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:1031


//INICIA - BRID:1119 - valor del campo enviar correo = true al editar - Autor: Administrador - Actualización: 3/5/2021 12:09:14 PM
if(  this.operation == 'Update' ) {
if( this.brf.GetValueByControlType(this.Configuracion_de_NotificacionForm, 'Notificar__por_Correo')==this.brf.TryParseInt('true', 'true') ) { this.brf.SetRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo");} else { this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo"); this.brf.HideFieldOfForm(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo"); this.brf.SetNotRequiredControl(this.Configuracion_de_NotificacionForm, "Texto_que_llevara_el_Correo");}
} 
//TERMINA - BRID:1119


//INICIA - BRID:1121 - .-En nuevo y editar, al abrir la pantalla Fecha de Registro = Fecha Actual, Hora de Registro = Hora Actual, Usuario que Registra  = Usuario que entró en el sistema. asi como también deshabilitar los campos fecha de registro, hora de registro y usuario que registra. - Autor: Administrador - Actualización: 3/5/2021 1:05:53 PM
if(  this.operation == 'New' ) {
this.brf.SetCurrentDateToField(this.Configuracion_de_NotificacionForm, "Fecha_de_Registro"); this.brf.SetCurrentHourToField(this.Configuracion_de_NotificacionForm, "Hora_de_Registro"); this.brf.SetValueFromQuery(this.Configuracion_de_NotificacionForm,"Usuario_que_Registra",this.brf.EvaluaQuery("SELECT name FROM Spartan_User WHERE Id_User = GLOBAL[USERID]", 1, "ABC123"),1,"ABC123"); this.brf.SetEnabledControl(this.Configuracion_de_NotificacionForm, 'Fecha_de_Registro', 0);this.brf.SetEnabledControl(this.Configuracion_de_NotificacionForm, 'Hora_de_Registro', 0);this.brf.SetEnabledControl(this.Configuracion_de_NotificacionForm, 'Usuario_que_Registra', 0);
} 
//TERMINA - BRID:1121

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
