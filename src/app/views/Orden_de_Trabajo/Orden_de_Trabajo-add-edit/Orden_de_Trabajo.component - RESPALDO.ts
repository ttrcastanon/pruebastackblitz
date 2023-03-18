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
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Tipo_de_Orden_de_TrabajoService } from 'src/app/api-services/Tipo_de_Orden_de_Trabajo.service';
import { Tipo_de_Orden_de_Trabajo } from 'src/app/models/Tipo_de_Orden_de_Trabajo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { Estatus_ReporteService } from 'src/app/api-services/Estatus_Reporte.service';
import { Estatus_Reporte } from 'src/app/models/Estatus_Reporte';
import { Detalle_de_Reportes_PrestablecidosService } from 'src/app/api-services/Detalle_de_Reportes_Prestablecidos.service';
import { Detalle_de_Reportes_Prestablecidos } from 'src/app/models/Detalle_de_Reportes_Prestablecidos';

import { Detalles_de_trabajo_de_OTService } from 'src/app/api-services/Detalles_de_trabajo_de_OT.service';
import { Detalles_de_trabajo_de_OT } from 'src/app/models/Detalles_de_trabajo_de_OT';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Estatus_de_ReporteService } from 'src/app/api-services/Estatus_de_Reporte.service';
import { Estatus_de_Reporte } from 'src/app/models/Estatus_de_Reporte';


import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { SpartanService } from "src/app/api-services/spartan.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';

@Component({
  selector: 'app-Orden_de_Trabajo',
  templateUrl: './Orden_de_Trabajo.component.html',
  styleUrls: ['./Orden_de_Trabajo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Orden_de_TrabajoComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Orden_de_TrabajoForm: FormGroup;
	public Editor = ClassicEditor;
	model: Orden_de_Trabajo;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varTipo_de_Orden_de_Trabajo: Tipo_de_Orden_de_Trabajo[] = [];
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;
	optionsPropietario: Observable<Propietarios[]>;
	hasOptionsPropietario: boolean;
	isLoadingPropietario: boolean;
	public varEstatus_Reporte: Estatus_Reporte[] = [];


	public varCrear_Reporte: Crear_Reporte[] = [];
	public varSpartan_User: Spartan_User[] = [];
	public varEstatus_de_Reporte: Estatus_de_Reporte[] = [];

  autoFolio_de_Reporte_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingFolio_de_Reporte_Detalles_de_trabajo_de_OT: boolean;
  searchFolio_de_Reporte_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_1_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_1_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_1_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_1_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_2_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_2_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_2_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_2_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_3_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_3_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_3_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_3_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_4_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_4_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_4_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_4_Detalles_de_trabajo_de_OTCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceReportes_Prestablecidos_OT = new MatTableDataSource<Detalle_de_Reportes_Prestablecidos>();
  Reportes_Prestablecidos_OTColumns = [
    { def: 'actions', hide: false },
    { def: 'Seleccionar', hide: false },
    { def: 'Reporte_de_inspeccion_de_entrada', hide: false },
    { def: 'Tipo_de_reporte', hide: false },
    { def: 'Prioridad', hide: false },
    { def: 'Tipo_de_Codigo', hide: false },
    { def: 'Codigo_NP', hide: false },
    { def: 'Descripcion', hide: false },
	
  ];
  Reportes_Prestablecidos_OTData: Detalle_de_Reportes_Prestablecidos[] = [];
  dataSourceDetalle_de_Reportes_de_OT = new MatTableDataSource<Detalles_de_trabajo_de_OT>();
  Detalle_de_Reportes_de_OTColumns = [
    { def: 'actions', hide: false },
    { def: 'Tipo_de_Reporte', hide: false },
    { def: 'Folio_de_Reporte', hide: false },
    { def: 'Descripcion_de_Reporte', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Codigo_Computarizado', hide: false },
    { def: 'Codigo_ATA', hide: false },
    { def: 'Origen_del_Reporte', hide: false },
    { def: 'Respuesta_Total', hide: false },
    { def: 'Asignado_a', hide: false },
    { def: 'Asignado_a_1', hide: false },
    { def: 'Asignado_a_2', hide: false },
    { def: 'Asignado_a_3', hide: false },
    { def: 'Asignado_a_4', hide: false },
    { def: 'Estatus', hide: false },
    { def: 'Notificado', hide: false },
	
  ];
  Detalle_de_Reportes_de_OTData: Detalles_de_trabajo_de_OT[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Tipo_de_Orden_de_TrabajoService: Tipo_de_Orden_de_TrabajoService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private PropietariosService: PropietariosService,
    private Estatus_ReporteService: Estatus_ReporteService,
    private Detalle_de_Reportes_PrestablecidosService: Detalle_de_Reportes_PrestablecidosService,

    private Detalles_de_trabajo_de_OTService: Detalles_de_trabajo_de_OTService,
    private Crear_ReporteService: Crear_ReporteService,
    private Spartan_UserService: Spartan_UserService,
    private Estatus_de_ReporteService: Estatus_de_ReporteService,


    private _seguridad: SeguridadService,	
    private spartanFileService: SpartanFileService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private SpartanService: SpartanService,
    renderer: Renderer2) {
	this.brf = new BusinessRulesFunctions(renderer, SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Orden_de_Trabajo(this.fb);
    this.Orden_de_TrabajoForm = this.model.buildFormGroup();
    this.Reportes_Prestablecidos_OTItems.removeAt(0);
    this.Detalle_de_Reportes_de_OTItems.removeAt(0);
	
	this.Orden_de_TrabajoForm.get('Folio').disable();
    this.Orden_de_TrabajoForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceReportes_Prestablecidos_OT.paginator = this.paginator;
    this.dataSourceDetalle_de_Reportes_de_OT.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Reportes_Prestablecidos_OTColumns.splice(0, 1);
          this.Detalle_de_Reportes_de_OTColumns.splice(0, 1);
		
          this.Orden_de_TrabajoForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Orden_de_Trabajo)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Orden_de_TrabajoForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Orden_de_TrabajoForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Orden_de_TrabajoForm, 'Propietario', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Orden_de_TrabajoService.listaSelAll(0, 1, 'Orden_de_Trabajo.Folio=' + id).toPromise();
	if (result.Orden_de_Trabajos.length > 0) {
        let fReportes_Prestablecidos_OT = await this.Detalle_de_Reportes_PrestablecidosService.listaSelAll(0, 1000,'Orden_de_Trabajo.Folio=' + id).toPromise();
            this.Reportes_Prestablecidos_OTData = fReportes_Prestablecidos_OT.Detalle_de_Reportes_Prestablecidoss;
            this.loadReportes_Prestablecidos_OT(fReportes_Prestablecidos_OT.Detalle_de_Reportes_Prestablecidoss);
            this.dataSourceReportes_Prestablecidos_OT = new MatTableDataSource(fReportes_Prestablecidos_OT.Detalle_de_Reportes_Prestablecidoss);
            this.dataSourceReportes_Prestablecidos_OT.paginator = this.paginator;
            this.dataSourceReportes_Prestablecidos_OT.sort = this.sort;
        let fDetalle_de_Reportes_de_OT = await this.Detalles_de_trabajo_de_OTService.listaSelAll(0, 1000,'Orden_de_Trabajo.Folio=' + id).toPromise();
            this.Detalle_de_Reportes_de_OTData = fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs;
            this.loadDetalle_de_Reportes_de_OT(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs);
            this.dataSourceDetalle_de_Reportes_de_OT = new MatTableDataSource(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs);
            this.dataSourceDetalle_de_Reportes_de_OT.paginator = this.paginator;
            this.dataSourceDetalle_de_Reportes_de_OT.sort = this.sort;
	  
        this.model.fromObject(result.Orden_de_Trabajos[0]);
        this.Orden_de_TrabajoForm.get('Matricula').setValue(
          result.Orden_de_Trabajos[0].Matricula_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );
        this.Orden_de_TrabajoForm.get('Modelo').setValue(
          result.Orden_de_Trabajos[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Orden_de_TrabajoForm.get('Propietario').setValue(
          result.Orden_de_Trabajos[0].Propietario_Propietarios.Nombre,
          { onlySelf: false, emitEvent: true }
        );

		this.Orden_de_TrabajoForm.markAllAsTouched();
		this.Orden_de_TrabajoForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Reportes_Prestablecidos_OTItems() {
    return this.Orden_de_TrabajoForm.get('Detalle_de_Reportes_PrestablecidosItems') as FormArray;
  }

  getReportes_Prestablecidos_OTColumns(): string[] {
    return this.Reportes_Prestablecidos_OTColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadReportes_Prestablecidos_OT(Reportes_Prestablecidos_OT: Detalle_de_Reportes_Prestablecidos[]) {
    Reportes_Prestablecidos_OT.forEach(element => {
      this.addReportes_Prestablecidos_OT(element);
    });
  }

  addReportes_Prestablecidos_OTToMR() {
    const Reportes_Prestablecidos_OT = new Detalle_de_Reportes_Prestablecidos(this.fb);
    this.Reportes_Prestablecidos_OTData.push(this.addReportes_Prestablecidos_OT(Reportes_Prestablecidos_OT));
    this.dataSourceReportes_Prestablecidos_OT.data = this.Reportes_Prestablecidos_OTData;
    Reportes_Prestablecidos_OT.edit = true;
    Reportes_Prestablecidos_OT.isNew = true;
    const length = this.dataSourceReportes_Prestablecidos_OT.data.length;
    const index = length - 1;
    const formReportes_Prestablecidos_OT = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceReportes_Prestablecidos_OT.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addReportes_Prestablecidos_OT(entity: Detalle_de_Reportes_Prestablecidos) {
    const Reportes_Prestablecidos_OT = new Detalle_de_Reportes_Prestablecidos(this.fb);
    this.Reportes_Prestablecidos_OTItems.push(Reportes_Prestablecidos_OT.buildFormGroup());
    if (entity) {
      Reportes_Prestablecidos_OT.fromObject(entity);
    }
	return entity;
  }  

  Reportes_Prestablecidos_OTItemsByFolio(Folio: number): FormGroup {
    return (this.Orden_de_TrabajoForm.get('Detalle_de_Reportes_PrestablecidosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Reportes_Prestablecidos_OTItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
	let fb = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteReportes_Prestablecidos_OT(element: any) {
    let index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    this.Reportes_Prestablecidos_OTData[index].IsDeleted = true;
    this.dataSourceReportes_Prestablecidos_OT.data = this.Reportes_Prestablecidos_OTData;
    this.dataSourceReportes_Prestablecidos_OT._updateChangeSubscription();
    index = this.dataSourceReportes_Prestablecidos_OT.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditReportes_Prestablecidos_OT(element: any) {
    let index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Reportes_Prestablecidos_OTData[index].IsDeleted = true;
      this.dataSourceReportes_Prestablecidos_OT.data = this.Reportes_Prestablecidos_OTData;
      this.dataSourceReportes_Prestablecidos_OT._updateChangeSubscription();
      index = this.Reportes_Prestablecidos_OTData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveReportes_Prestablecidos_OT(element: any) {
    const index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    const formReportes_Prestablecidos_OT = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;
    this.Reportes_Prestablecidos_OTData[index].Seleccionar = formReportes_Prestablecidos_OT.value.Seleccionar;
    this.Reportes_Prestablecidos_OTData[index].Reporte_de_inspeccion_de_entrada = formReportes_Prestablecidos_OT.value.Reporte_de_inspeccion_de_entrada;
    this.Reportes_Prestablecidos_OTData[index].Tipo_de_reporte = formReportes_Prestablecidos_OT.value.Tipo_de_reporte;
    this.Reportes_Prestablecidos_OTData[index].Prioridad = formReportes_Prestablecidos_OT.value.Prioridad;
    this.Reportes_Prestablecidos_OTData[index].Tipo_de_Codigo = formReportes_Prestablecidos_OT.value.Tipo_de_Codigo;
    this.Reportes_Prestablecidos_OTData[index].Codigo_NP = formReportes_Prestablecidos_OT.value.Codigo_NP;
    this.Reportes_Prestablecidos_OTData[index].Descripcion = formReportes_Prestablecidos_OT.value.Descripcion;
	
    this.Reportes_Prestablecidos_OTData[index].isNew = false;
    this.dataSourceReportes_Prestablecidos_OT.data = this.Reportes_Prestablecidos_OTData;
    this.dataSourceReportes_Prestablecidos_OT._updateChangeSubscription();
  }
  
  editReportes_Prestablecidos_OT(element: any) {
    const index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    const formReportes_Prestablecidos_OT = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_de_Reportes_Prestablecidos(Folio: number) {
    this.dataSourceReportes_Prestablecidos_OT.data.forEach(async (d, index) => {
      const data = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Orden_de_Trabajo = Folio;
	
      
      if (model.Folio === 0) {
        // Add Reportes Preestablecidos OT
		let response = await this.Detalle_de_Reportes_PrestablecidosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formReportes_Prestablecidos_OT = this.Reportes_Prestablecidos_OTItemsByFolio(model.Folio);
        if (formReportes_Prestablecidos_OT.dirty) {
          // Update Reportes Preestablecidos OT
          let response = await this.Detalle_de_Reportes_PrestablecidosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Reportes Preestablecidos OT
        await this.Detalle_de_Reportes_PrestablecidosService.delete(model.Folio).toPromise();
      }
    });
  }


  get Detalle_de_Reportes_de_OTItems() {
    return this.Orden_de_TrabajoForm.get('Detalles_de_trabajo_de_OTItems') as FormArray;
  }

  getDetalle_de_Reportes_de_OTColumns(): string[] {
    return this.Detalle_de_Reportes_de_OTColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadDetalle_de_Reportes_de_OT(Detalle_de_Reportes_de_OT: Detalles_de_trabajo_de_OT[]) {
    Detalle_de_Reportes_de_OT.forEach(element => {
      this.addDetalle_de_Reportes_de_OT(element);
    });
  }

  addDetalle_de_Reportes_de_OTToMR() {
    const Detalle_de_Reportes_de_OT = new Detalles_de_trabajo_de_OT(this.fb);
    this.Detalle_de_Reportes_de_OTData.push(this.addDetalle_de_Reportes_de_OT(Detalle_de_Reportes_de_OT));
    this.dataSourceDetalle_de_Reportes_de_OT.data = this.Detalle_de_Reportes_de_OTData;
    Detalle_de_Reportes_de_OT.edit = true;
    Detalle_de_Reportes_de_OT.isNew = true;
    const length = this.dataSourceDetalle_de_Reportes_de_OT.data.length;
    const index = length - 1;
    const formDetalle_de_Reportes_de_OT = this.Detalle_de_Reportes_de_OTItems.controls[index] as FormGroup;
	this.addFilterToControlFolio_de_Reporte_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Folio_de_Reporte, index);
	this.addFilterToControlAsignado_a_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a, index);
	this.addFilterToControlAsignado_a_1_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_1, index);
	this.addFilterToControlAsignado_a_2_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_2, index);
	this.addFilterToControlAsignado_a_3_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_3, index);
	this.addFilterToControlAsignado_a_4_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_4, index);
    
    const page = Math.ceil(this.dataSourceDetalle_de_Reportes_de_OT.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addDetalle_de_Reportes_de_OT(entity: Detalles_de_trabajo_de_OT) {
    const Detalle_de_Reportes_de_OT = new Detalles_de_trabajo_de_OT(this.fb);
    this.Detalle_de_Reportes_de_OTItems.push(Detalle_de_Reportes_de_OT.buildFormGroup());
    if (entity) {
      Detalle_de_Reportes_de_OT.fromObject(entity);
    }
	return entity;
  }  

  Detalle_de_Reportes_de_OTItemsByFolio(Folio: number): FormGroup {
    return (this.Orden_de_TrabajoForm.get('Detalles_de_trabajo_de_OTItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Detalle_de_Reportes_de_OTItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
	let fb = this.Detalle_de_Reportes_de_OTItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteDetalle_de_Reportes_de_OT(element: any) {
    let index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.Detalle_de_Reportes_de_OTData[index].IsDeleted = true;
    this.dataSourceDetalle_de_Reportes_de_OT.data = this.Detalle_de_Reportes_de_OTData;
    this.dataSourceDetalle_de_Reportes_de_OT._updateChangeSubscription();
    index = this.dataSourceDetalle_de_Reportes_de_OT.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditDetalle_de_Reportes_de_OT(element: any) {
    let index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Detalle_de_Reportes_de_OTData[index].IsDeleted = true;
      this.dataSourceDetalle_de_Reportes_de_OT.data = this.Detalle_de_Reportes_de_OTData;
      this.dataSourceDetalle_de_Reportes_de_OT._updateChangeSubscription();
      index = this.Detalle_de_Reportes_de_OTData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveDetalle_de_Reportes_de_OT(element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    const formDetalle_de_Reportes_de_OT = this.Detalle_de_Reportes_de_OTItems.controls[index] as FormGroup;
    this.Detalle_de_Reportes_de_OTData[index].Tipo_de_Reporte = formDetalle_de_Reportes_de_OT.value.Tipo_de_Reporte;
    if (this.Detalle_de_Reportes_de_OTData[index].Folio_de_Reporte !== formDetalle_de_Reportes_de_OT.value.Folio_de_Reporte && formDetalle_de_Reportes_de_OT.value.Folio_de_Reporte > 0) {
		let crear_reporte = await this.Crear_ReporteService.getById(formDetalle_de_Reportes_de_OT.value.Folio_de_Reporte).toPromise();
        this.Detalle_de_Reportes_de_OTData[index].Folio_de_Reporte_Crear_Reporte = crear_reporte;
    }
    this.Detalle_de_Reportes_de_OTData[index].Folio_de_Reporte = formDetalle_de_Reportes_de_OT.value.Folio_de_Reporte;
    this.Detalle_de_Reportes_de_OTData[index].Descripcion_de_Reporte = formDetalle_de_Reportes_de_OT.value.Descripcion_de_Reporte;
    this.Detalle_de_Reportes_de_OTData[index].Matricula = formDetalle_de_Reportes_de_OT.value.Matricula;
    this.Detalle_de_Reportes_de_OTData[index].Modelo = formDetalle_de_Reportes_de_OT.value.Modelo;
    this.Detalle_de_Reportes_de_OTData[index].Codigo_Computarizado = formDetalle_de_Reportes_de_OT.value.Codigo_Computarizado;
    this.Detalle_de_Reportes_de_OTData[index].Codigo_ATA = formDetalle_de_Reportes_de_OT.value.Codigo_ATA;
    this.Detalle_de_Reportes_de_OTData[index].Origen_del_Reporte = formDetalle_de_Reportes_de_OT.value.Origen_del_Reporte;
    this.Detalle_de_Reportes_de_OTData[index].Respuesta_Total = formDetalle_de_Reportes_de_OT.value.Respuesta_Total;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a !== formDetalle_de_Reportes_de_OT.value.Asignado_a && formDetalle_de_Reportes_de_OT.value.Asignado_a > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a).toPromise();
        this.Detalle_de_Reportes_de_OTData[index].Asignado_a_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a = formDetalle_de_Reportes_de_OT.value.Asignado_a;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a_1 !== formDetalle_de_Reportes_de_OT.value.Asignado_a_1 && formDetalle_de_Reportes_de_OT.value.Asignado_a_1 > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a_1).toPromise();
        this.Detalle_de_Reportes_de_OTData[index].Asignado_a_1_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a_1 = formDetalle_de_Reportes_de_OT.value.Asignado_a_1;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a_2 !== formDetalle_de_Reportes_de_OT.value.Asignado_a_2 && formDetalle_de_Reportes_de_OT.value.Asignado_a_2 > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a_2).toPromise();
        this.Detalle_de_Reportes_de_OTData[index].Asignado_a_2_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a_2 = formDetalle_de_Reportes_de_OT.value.Asignado_a_2;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a_3 !== formDetalle_de_Reportes_de_OT.value.Asignado_a_3 && formDetalle_de_Reportes_de_OT.value.Asignado_a_3 > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a_3).toPromise();
        this.Detalle_de_Reportes_de_OTData[index].Asignado_a_3_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a_3 = formDetalle_de_Reportes_de_OT.value.Asignado_a_3;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a_4 !== formDetalle_de_Reportes_de_OT.value.Asignado_a_4 && formDetalle_de_Reportes_de_OT.value.Asignado_a_4 > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a_4).toPromise();
        this.Detalle_de_Reportes_de_OTData[index].Asignado_a_4_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a_4 = formDetalle_de_Reportes_de_OT.value.Asignado_a_4;
    this.Detalle_de_Reportes_de_OTData[index].Estatus = formDetalle_de_Reportes_de_OT.value.Estatus;
    this.Detalle_de_Reportes_de_OTData[index].Estatus_Estatus_de_Reporte = formDetalle_de_Reportes_de_OT.value.Estatus !== '' ?
     this.varEstatus_de_Reporte.filter(d => d.Folio === formDetalle_de_Reportes_de_OT.value.Estatus)[0] : null ;	
    this.Detalle_de_Reportes_de_OTData[index].Notificado = formDetalle_de_Reportes_de_OT.value.Notificado;
	
    this.Detalle_de_Reportes_de_OTData[index].isNew = false;
    this.dataSourceDetalle_de_Reportes_de_OT.data = this.Detalle_de_Reportes_de_OTData;
    this.dataSourceDetalle_de_Reportes_de_OT._updateChangeSubscription();
  }
  
  editDetalle_de_Reportes_de_OT(element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    const formDetalle_de_Reportes_de_OT = this.Detalle_de_Reportes_de_OTItems.controls[index] as FormGroup;
	this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Folio_de_Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlFolio_de_Reporte_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Folio_de_Reporte, index);
	this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_Spartan_User.Name;
    this.addFilterToControlAsignado_a_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a, index);
	this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_1_Spartan_User.Name;
    this.addFilterToControlAsignado_a_1_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_1, index);
	this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_2_Spartan_User.Name;
    this.addFilterToControlAsignado_a_2_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_2, index);
	this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_3_Spartan_User.Name;
    this.addFilterToControlAsignado_a_3_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_3, index);
	this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_4_Spartan_User.Name;
    this.addFilterToControlAsignado_a_4_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_4, index);
	    
    element.edit = true;
  }  

  async saveDetalles_de_trabajo_de_OT(Folio: number) {
    this.dataSourceDetalle_de_Reportes_de_OT.data.forEach(async (d, index) => {
      const data = this.Detalle_de_Reportes_de_OTItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Orden_de_Trabajo = Folio;
	
      
      if (model.Folio === 0) {
        // Add Reportes de OT 
		let response = await this.Detalles_de_trabajo_de_OTService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formDetalle_de_Reportes_de_OT = this.Detalle_de_Reportes_de_OTItemsByFolio(model.Folio);
        if (formDetalle_de_Reportes_de_OT.dirty) {
          // Update Reportes de OT 
          let response = await this.Detalles_de_trabajo_de_OTService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Reportes de OT 
        await this.Detalles_de_trabajo_de_OTService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectFolio_de_Reporte_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
	let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Folio_de_Reporte.setValue(event.option.value);
    this.displayFnFolio_de_Reporte_Detalles_de_trabajo_de_OT(element);
  }  
  
  displayFnFolio_de_Reporte_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionFolio_de_Reporte_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  } 

	_filterFolio_de_Reporte_Detalles_de_trabajo_de_OT(filter: any): Observable<Crear_Reporte> {
		const where = filter !== '' ?  "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';
		return this.Crear_ReporteService.listaSelAll(0, 20, where);
	}

  addFilterToControlFolio_de_Reporte_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingFolio_de_Reporte_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingFolio_de_Reporte_Detalles_de_trabajo_de_OT = true;
        return this._filterFolio_de_Reporte_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingFolio_de_Reporte_Detalles_de_trabajo_de_OT = false;
      this.searchFolio_de_Reporte_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
	let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Asignado_a.setValue(event.option.value);
    this.displayFnAsignado_a_Detalles_de_trabajo_de_OT(element);
  }  
  
  displayFnAsignado_a_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  } 

	_filterAsignado_a_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingAsignado_a_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_1_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
	let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Asignado_a_1.setValue(event.option.value);
    this.displayFnAsignado_a_1_Detalles_de_trabajo_de_OT(element);
  }  
  
  displayFnAsignado_a_1_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_1_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  } 

	_filterAsignado_a_1_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_1_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_1_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_1_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_1_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingAsignado_a_1_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_1_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_2_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
	let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Asignado_a_2.setValue(event.option.value);
    this.displayFnAsignado_a_2_Detalles_de_trabajo_de_OT(element);
  }  
  
  displayFnAsignado_a_2_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_2_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  } 

	_filterAsignado_a_2_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_2_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_2_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_2_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_2_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingAsignado_a_2_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_2_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_3_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
	let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Asignado_a_3.setValue(event.option.value);
    this.displayFnAsignado_a_3_Detalles_de_trabajo_de_OT(element);
  }  
  
  displayFnAsignado_a_3_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_3_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  } 

	_filterAsignado_a_3_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_3_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_3_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_3_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_3_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingAsignado_a_3_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_3_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_4_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
	let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Asignado_a_4.setValue(event.option.value);
    this.displayFnAsignado_a_4_Detalles_de_trabajo_de_OT(element);
  }  
  
  displayFnAsignado_a_4_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_4_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  } 

	_filterAsignado_a_4_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_4_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_4_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_4_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_4_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.isLoadingAsignado_a_4_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_4_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Orden_de_TrabajoForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_de_Orden_de_TrabajoService.getAll());
    observablesArray.push(this.Estatus_ReporteService.getAll());

    observablesArray.push(this.Estatus_de_ReporteService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varTipo_de_Orden_de_Trabajo , varEstatus_Reporte  , varEstatus_de_Reporte  ]) => {
          this.varTipo_de_Orden_de_Trabajo = varTipo_de_Orden_de_Trabajo;
          this.varEstatus_Reporte = varEstatus_Reporte;

          this.varEstatus_de_Reporte = varEstatus_de_Reporte;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Orden_de_TrabajoForm.get('Matricula').valueChanges.pipe(
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
	  this.Orden_de_TrabajoForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
	  this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Orden_de_TrabajoForm.get('Modelo').valueChanges.pipe(
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
	  this.Orden_de_TrabajoForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
	  this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Orden_de_TrabajoForm.get('Propietario').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPropietario = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PropietariosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PropietariosService.listaSelAll(0, 20, '');
          return this.PropietariosService.listaSelAll(0, 20,
            "Propietarios.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PropietariosService.listaSelAll(0, 20,
          "Propietarios.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPropietario = false;
      this.hasOptionsPropietario = result?.Propietarioss?.length > 0;
	  this.Orden_de_TrabajoForm.get('Propietario').setValue(result?.Propietarioss[0], { onlySelf: true, emitEvent: false });
	  this.optionsPropietario = of(result?.Propietarioss);
    }, error => {
      this.isLoadingPropietario = false;
      this.hasOptionsPropietario = false;
      this.optionsPropietario = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tipo_de_orden': {
        this.Tipo_de_Orden_de_TrabajoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Orden_de_Trabajo = x.Tipo_de_Orden_de_Trabajos;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_Reporte = x.Estatus_Reportes;
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

displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
displayFnPropietario(option: Propietarios) {
    return option?.Nombre;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Orden_de_TrabajoForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Orden_de_TrabajoForm.get('Matricula').value.Matricula;
      entity.Modelo = this.Orden_de_TrabajoForm.get('Modelo').value.Clave;
      entity.Propietario = this.Orden_de_TrabajoForm.get('Propietario').value.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Orden_de_TrabajoService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Reportes_Prestablecidos(this.model.Folio);  
        await this.saveDetalles_de_trabajo_de_OT(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Orden_de_TrabajoService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Reportes_Prestablecidos(id);
          await this.saveDetalles_de_trabajo_de_OT(id);

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
      this.Orden_de_TrabajoForm.reset();
      this.model = new Orden_de_Trabajo(this.fb);
      this.Orden_de_TrabajoForm = this.model.buildFormGroup();
      this.dataSourceReportes_Prestablecidos_OT = new MatTableDataSource<Detalle_de_Reportes_Prestablecidos>();
      this.Reportes_Prestablecidos_OTData = [];
      this.dataSourceDetalle_de_Reportes_de_OT = new MatTableDataSource<Detalles_de_trabajo_de_OT>();
      this.Detalle_de_Reportes_de_OTData = [];

    } else {
      this.router.navigate(['views/Orden_de_Trabajo/add']);
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
    this.router.navigate(['/Orden_de_Trabajo/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas
  ')
  
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
  }
  
  rulesAfterSave() {
  }
  
  rulesBeforeSave(): boolean {
    const result = true;
    return result;
  }
  
  

//Fin de reglas
  
}
