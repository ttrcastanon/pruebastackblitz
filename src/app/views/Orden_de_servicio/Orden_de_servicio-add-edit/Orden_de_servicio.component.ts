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
import { Orden_de_servicioService } from 'src/app/api-services/Orden_de_servicio.service';
import { Orden_de_servicio } from 'src/app/models/Orden_de_servicio';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { Estatus_ReporteService } from 'src/app/api-services/Estatus_Reporte.service';
import { Estatus_Reporte } from 'src/app/models/Estatus_Reporte';
import { Detalle_de_reportes_por_componentesService } from 'src/app/api-services/Detalle_de_reportes_por_componentes.service';
import { Detalle_de_reportes_por_componentes } from 'src/app/models/Detalle_de_reportes_por_componentes';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Reportes_para_OSService } from 'src/app/api-services/Reportes_para_OS.service';
import { Reportes_para_OS } from 'src/app/models/Reportes_para_OS';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';

import { Detalle_de_reportes_por_aeronaveService } from 'src/app/api-services/Detalle_de_reportes_por_aeronave.service';
import { Detalle_de_reportes_por_aeronave } from 'src/app/models/Detalle_de_reportes_por_aeronave';


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
import { MatSelectChange } from '@angular/material/select';

@Component({
  selector: 'app-Orden_de_servicio',
  templateUrl: './Orden_de_servicio.component.html',
  styleUrls: ['./Orden_de_servicio.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Orden_de_servicioComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Orden_de_servicioForm: FormGroup;
	public Editor = ClassicEditor;
	model: Orden_de_servicio;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsNumero_de_OT: Observable<Orden_de_Trabajo[]>;
	hasOptionsNumero_de_OT: boolean;
	isLoadingNumero_de_OT: boolean;
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;
	optionsPropietario: Observable<Propietarios[]>;
	hasOptionsPropietario: boolean;
	isLoadingPropietario: boolean;
	public varEstatus_Reporte: Estatus_Reporte[] = [];
	public varCrear_Reporte: Crear_Reporte[] = [];
	public varReportes_para_OS: Reportes_para_OS[] = [];
	public varSpartan_User: Spartan_User[] = [];

  autoReporte_Detalle_de_reportes_por_componentes = new FormControl();
  SelectedReporte_Detalle_de_reportes_por_componentes: string[] = [];
  isLoadingReporte_Detalle_de_reportes_por_componentes: boolean;
  searchReporte_Detalle_de_reportes_por_componentesCompleted: boolean;
  autoAsignado_a_Detalle_de_reportes_por_componentes = new FormControl();
  SelectedAsignado_a_Detalle_de_reportes_por_componentes: string[] = [];
  isLoadingAsignado_a_Detalle_de_reportes_por_componentes: boolean;
  searchAsignado_a_Detalle_de_reportes_por_componentesCompleted: boolean;
  autoAsignado_a_1_Detalle_de_reportes_por_componentes = new FormControl();
  SelectedAsignado_a_1_Detalle_de_reportes_por_componentes: string[] = [];
  isLoadingAsignado_a_1_Detalle_de_reportes_por_componentes: boolean;
  searchAsignado_a_1_Detalle_de_reportes_por_componentesCompleted: boolean;
  autoAsignado_a_2_Detalle_de_reportes_por_componentes = new FormControl();
  SelectedAsignado_a_2_Detalle_de_reportes_por_componentes: string[] = [];
  isLoadingAsignado_a_2_Detalle_de_reportes_por_componentes: boolean;
  searchAsignado_a_2_Detalle_de_reportes_por_componentesCompleted: boolean;
  autoAsignado_a_3_Detalle_de_reportes_por_componentes = new FormControl();
  SelectedAsignado_a_3_Detalle_de_reportes_por_componentes: string[] = [];
  isLoadingAsignado_a_3_Detalle_de_reportes_por_componentes: boolean;
  searchAsignado_a_3_Detalle_de_reportes_por_componentesCompleted: boolean;
  autoAsignado_a_4_Detalle_de_reportes_por_componentes = new FormControl();
  SelectedAsignado_a_4_Detalle_de_reportes_por_componentes: string[] = [];
  isLoadingAsignado_a_4_Detalle_de_reportes_por_componentes: boolean;
  searchAsignado_a_4_Detalle_de_reportes_por_componentesCompleted: boolean;


  autoReporte_Detalle_de_reportes_por_aeronave = new FormControl();
  SelectedReporte_Detalle_de_reportes_por_aeronave: string[] = [];
  isLoadingReporte_Detalle_de_reportes_por_aeronave: boolean;
  searchReporte_Detalle_de_reportes_por_aeronaveCompleted: boolean;
  autoAsignado_a_Detalle_de_reportes_por_aeronave = new FormControl();
  SelectedAsignado_a_Detalle_de_reportes_por_aeronave: string[] = [];
  isLoadingAsignado_a_Detalle_de_reportes_por_aeronave: boolean;
  searchAsignado_a_Detalle_de_reportes_por_aeronaveCompleted: boolean;
  autoAsignado_a_1_Detalle_de_reportes_por_aeronave = new FormControl();
  SelectedAsignado_a_1_Detalle_de_reportes_por_aeronave: string[] = [];
  isLoadingAsignado_a_1_Detalle_de_reportes_por_aeronave: boolean;
  searchAsignado_a_1_Detalle_de_reportes_por_aeronaveCompleted: boolean;
  autoAsignado_a_2_Detalle_de_reportes_por_aeronave = new FormControl();
  SelectedAsignado_a_2_Detalle_de_reportes_por_aeronave: string[] = [];
  isLoadingAsignado_a_2_Detalle_de_reportes_por_aeronave: boolean;
  searchAsignado_a_2_Detalle_de_reportes_por_aeronaveCompleted: boolean;
  autoAsignado_a_3_Detalle_de_reportes_por_aeronave = new FormControl();
  SelectedAsignado_a_3_Detalle_de_reportes_por_aeronave: string[] = [];
  isLoadingAsignado_a_3_Detalle_de_reportes_por_aeronave: boolean;
  searchAsignado_a_3_Detalle_de_reportes_por_aeronaveCompleted: boolean;
  autoAsignado_a_4_Detalle_de_reportes_por_aeronave = new FormControl();
  SelectedAsignado_a_4_Detalle_de_reportes_por_aeronave: string[] = [];
  isLoadingAsignado_a_4_Detalle_de_reportes_por_aeronave: boolean;
  searchAsignado_a_4_Detalle_de_reportes_por_aeronaveCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceReportes_por_Componentes = new MatTableDataSource<Detalle_de_reportes_por_componentes>();
  Reportes_por_ComponentesColumns = [
    { def: 'actions', hide: false },
    { def: 'Reporte', hide: false },
    { def: 'Tipo_de_OS', hide: false },
    { def: 'Descripcion_de_Reporte', hide: false },
    { def: 'Descripcion_del_componente', hide: false },
    { def: 'Numero_de_parte', hide: false },
    { def: 'Numero_de_serie', hide: false },
    { def: 'Datos_del_cliente', hide: false },
    { def: 'Asignado_a', hide: false },
    { def: 'Asignado_a_1', hide: false },
    { def: 'Asignado_a_2', hide: false },
    { def: 'Asignado_a_3', hide: false },
    { def: 'Asignado_a_4', hide: false },
    { def: 'Notificado', hide: true },
	
  ];
  Reportes_por_ComponentesData: Detalle_de_reportes_por_componentes[] = [];
  dataSourceReportes_por_Aeronave = new MatTableDataSource<Detalle_de_reportes_por_aeronave>();
  Reportes_por_AeronaveColumns = [
    // { def: 'actions', hide: false },
    // { def: 'Matricula', hide: false },
    // { def: 'Modelo', hide: false },
    
    { def: 'actions', hide: false },
    { def: 'Reporte', hide: false },
    { def: 'Tipo_de_OS', hide: false },
    { def: 'Descripcion_de_Reporte', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Numero_de_serie', hide: false },
    { def: 'Datos_del_cliente', hide: false },
    { def: 'Asignado_a', hide: false },
    { def: 'Asignado_a_1', hide: false },
    { def: 'Asignado_a_2', hide: false },
    { def: 'Asignado_a_3', hide: false },
    { def: 'Asignado_a_4', hide: false },
  ];
  Reportes_por_AeronaveData: Detalle_de_reportes_por_aeronave[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Orden_de_servicioService: Orden_de_servicioService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private ModelosService: ModelosService,
    private AeronaveService: AeronaveService,
    private PropietariosService: PropietariosService,
    private Estatus_ReporteService: Estatus_ReporteService,
    private Detalle_de_reportes_por_componentesService: Detalle_de_reportes_por_componentesService,
    private Crear_ReporteService: Crear_ReporteService,
    private Reportes_para_OSService: Reportes_para_OSService,
    private Spartan_UserService: Spartan_UserService,

    private Detalle_de_reportes_por_aeronaveService: Detalle_de_reportes_por_aeronaveService,


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
    renderer: Renderer2) 
  {
	  this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Orden_de_servicio(this.fb);
    this.Orden_de_servicioForm = this.model.buildFormGroup();
    this.Reportes_por_ComponentesItems.removeAt(0);
    this.Reportes_por_AeronaveItems.removeAt(0);
	
	  this.Orden_de_servicioForm.get('Folio').disable();
    this.Orden_de_servicioForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceReportes_por_Componentes.paginator = this.paginator;
    this.dataSourceReportes_por_Aeronave.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Reportes_por_ComponentesColumns.splice(0, 1);
          this.Reportes_por_AeronaveColumns.splice(0, 1);
		
          this.Orden_de_servicioForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Orden_de_servicio)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Orden_de_servicioForm, 'Numero_de_OT', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
    this.brf.updateValidatorsToControl(this.Orden_de_servicioForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
    this.brf.updateValidatorsToControl(this.Orden_de_servicioForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
    this.brf.updateValidatorsToControl(this.Orden_de_servicioForm, 'Propietario', [CustomValidators.autocompleteObjectValidator(),Validators.required]);

	  this.rulesOnInit();	  
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
	  let result =  await this.Orden_de_servicioService.listaSelAll(0, 1, 'Orden_de_servicio.Folio=' + id).toPromise();
	  
    if (result.Orden_de_servicios.length > 0) {
      let fReportes_por_Componentes = await this.Detalle_de_reportes_por_componentesService.listaSelAll(0, 1000,'Orden_de_servicio.Folio=' + id).toPromise();
      this.Reportes_por_ComponentesData = fReportes_por_Componentes.Detalle_de_reportes_por_componentess;
      this.loadReportes_por_Componentes(fReportes_por_Componentes.Detalle_de_reportes_por_componentess);
      this.dataSourceReportes_por_Componentes = new MatTableDataSource(fReportes_por_Componentes.Detalle_de_reportes_por_componentess);
      this.dataSourceReportes_por_Componentes.paginator = this.paginator;
      this.dataSourceReportes_por_Componentes.sort = this.sort;
      let fReportes_por_Aeronave = await this.Detalle_de_reportes_por_aeronaveService.listaSelAll(0, 1000,'Orden_de_servicio.Folio=' + id).toPromise();
      this.Reportes_por_AeronaveData = fReportes_por_Aeronave.Detalle_de_reportes_por_aeronaves;
      this.loadReportes_por_Aeronave(fReportes_por_Aeronave.Detalle_de_reportes_por_aeronaves);
      this.dataSourceReportes_por_Aeronave = new MatTableDataSource(fReportes_por_Aeronave.Detalle_de_reportes_por_aeronaves);
      this.dataSourceReportes_por_Aeronave.paginator = this.paginator;
      this.dataSourceReportes_por_Aeronave.sort = this.sort;
  
      this.model.fromObject(result.Orden_de_servicios[0]);
      this.Orden_de_servicioForm.get('Numero_de_OT').setValue(
        result.Orden_de_servicios[0].Numero_de_OT_Orden_de_Trabajo.numero_de_orden,
        { onlySelf: false, emitEvent: true }
      );
      this.Orden_de_servicioForm.get('Modelo').setValue(
        result.Orden_de_servicios[0].Modelo_Modelos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Orden_de_servicioForm.get('Matricula').setValue(
        result.Orden_de_servicios[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.Orden_de_servicioForm.get('Propietario').setValue(
        result.Orden_de_servicios[0].Propietario_Propietarios.Nombre,
        { onlySelf: false, emitEvent: true }
      );

      this.Orden_de_servicioForm.markAllAsTouched();
      this.Orden_de_servicioForm.updateValueAndValidity();
        this.spinner.hide('loading');
    } 
    else { 
      this.spinner.hide('loading'); 
    }
  }
  
  get Reportes_por_ComponentesItems() {
    return this.Orden_de_servicioForm.get('Detalle_de_reportes_por_componentesItems') as FormArray;
  }

  get can_add_mr_aeronaves(): boolean {
    const matricula = this.Orden_de_servicioForm.controls.Matricula.value.Matricula

    return !!matricula
  }
  
  get can_add_mr_componentes(): boolean {
    const matricula = this.Orden_de_servicioForm.controls.Matricula.value.Matricula

    return !!matricula
  }

  getReportes_por_ComponentesColumns(): string[] {
    return this.Reportes_por_ComponentesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadReportes_por_Componentes(Reportes_por_Componentes: Detalle_de_reportes_por_componentes[]) {
    Reportes_por_Componentes.forEach(element => {
      this.addReportes_por_Componentes(element);
    });
  }

  addReportes_por_ComponentesToMR() {
    const Reportes_por_Componentes = new Detalle_de_reportes_por_componentes(this.fb);
    this.Reportes_por_ComponentesData.push(this.addReportes_por_Componentes(Reportes_por_Componentes));
    this.dataSourceReportes_por_Componentes.data = this.Reportes_por_ComponentesData;
    Reportes_por_Componentes.edit = true;
    Reportes_por_Componentes.isNew = true;
    const length = this.dataSourceReportes_por_Componentes.data.length;
    const index = length - 1;
    const formReportes_por_Componentes = this.Reportes_por_ComponentesItems.controls[index] as FormGroup;
    
    this.addDatosCliente_Reporte_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Datos_del_cliente, index);
    this.addFilterToControlReporte_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Reporte, index);
    this.addFilterToControlAsignado_a_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a, index);
    this.addFilterToControlAsignado_a_1_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a_1, index);
    this.addFilterToControlAsignado_a_2_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a_2, index);
    this.addFilterToControlAsignado_a_3_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a_3, index);
    this.addFilterToControlAsignado_a_4_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a_4, index);
    
    const page = Math.ceil(this.dataSourceReportes_por_Componentes.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);

    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }

    this.brf.SetDisabledControlMR(this.Reportes_por_ComponentesItems,index ,'Descripcion_de_Reporte');
    this.brf.SetDisabledControlMR(this.Reportes_por_ComponentesItems, index,'Datos_del_cliente');
    this.brf.SetDisabledControlMR(this.Reportes_por_ComponentesItems, index,'Reporte');
  }

  addReportes_por_Componentes(entity: Detalle_de_reportes_por_componentes) {
    const Reportes_por_Componentes = new Detalle_de_reportes_por_componentes(this.fb);
    this.Reportes_por_ComponentesItems.push(Reportes_por_Componentes.buildFormGroup());

    if (entity) {
      Reportes_por_Componentes.fromObject(entity);
    }

	  return entity;
  }  

  Reportes_por_ComponentesItemsByFolio(Folio: number): FormGroup {
    return (this.Orden_de_servicioForm.get('Detalle_de_reportes_por_componentesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Reportes_por_ComponentesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
	  let fb = this.Reportes_por_ComponentesItems.controls[index] as FormGroup;

    return fb;
  }  

  deleteReportes_por_Componentes(element: any) {
    let index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    this.Reportes_por_ComponentesData[index].IsDeleted = true;
    this.dataSourceReportes_por_Componentes.data = this.Reportes_por_ComponentesData;
    this.dataSourceReportes_por_Componentes._updateChangeSubscription();
    index = this.dataSourceReportes_por_Componentes.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);

    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditReportes_por_Componentes(element: any) {
    let index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    element.edit = false;

    if (element.isNew) {
      this.Reportes_por_ComponentesData[index].IsDeleted = true;
      this.dataSourceReportes_por_Componentes.data = this.Reportes_por_ComponentesData;
      this.dataSourceReportes_por_Componentes._updateChangeSubscription();
      index = this.Reportes_por_ComponentesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveReportes_por_Componentes(element: any) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    const formReportes_por_Componentes = this.Reportes_por_ComponentesItems.controls[index] as FormGroup;
    
    if (this.Reportes_por_ComponentesData[index].Reporte !== formReportes_por_Componentes.value.Reporte && formReportes_por_Componentes.value.Reporte > 0) {
		let crear_reporte = await this.Crear_ReporteService.getById(formReportes_por_Componentes.value.Reporte).toPromise();
        this.Reportes_por_ComponentesData[index].Reporte_Crear_Reporte = crear_reporte;
    }

    this.Reportes_por_ComponentesData[index].Reporte = formReportes_por_Componentes.value.Reporte;
    this.Reportes_por_ComponentesData[index].Tipo_de_OS = formReportes_por_Componentes.value.Tipo_de_OS;
    this.Reportes_por_ComponentesData[index].Tipo_de_OS_Reportes_para_OS = formReportes_por_Componentes.value.Tipo_de_OS !== '' ?
    this.varReportes_para_OS.filter(d => d.Folio === formReportes_por_Componentes.value.Tipo_de_OS)[0] : null ;	
    this.Reportes_por_ComponentesData[index].Descripcion_de_Reporte = formReportes_por_Componentes.value.Descripcion_de_Reporte;
    this.Reportes_por_ComponentesData[index].Descripcion_del_componente = formReportes_por_Componentes.value.Descripcion_del_componente;
    this.Reportes_por_ComponentesData[index].Numero_de_parte = formReportes_por_Componentes.value.Numero_de_parte;
    this.Reportes_por_ComponentesData[index].Numero_de_serie = formReportes_por_Componentes.value.Numero_de_serie;
    this.Reportes_por_ComponentesData[index].Datos_del_cliente = formReportes_por_Componentes.value.Datos_del_cliente;
    
    if (this.Reportes_por_ComponentesData[index].Asignado_a !== formReportes_por_Componentes.value.Asignado_a && formReportes_por_Componentes.value.Asignado_a > 0) {
		  let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Componentes.value.Asignado_a).toPromise();
      this.Reportes_por_ComponentesData[index].Asignado_a_Spartan_User = spartan_user;
    }
    this.Reportes_por_ComponentesData[index].Asignado_a = formReportes_por_Componentes.value.Asignado_a;
    if (this.Reportes_por_ComponentesData[index].Asignado_a_1 !== formReportes_por_Componentes.value.Asignado_a_1 && formReportes_por_Componentes.value.Asignado_a_1 > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Componentes.value.Asignado_a_1).toPromise();
        this.Reportes_por_ComponentesData[index].Asignado_a_1_Spartan_User = spartan_user;
    }
    this.Reportes_por_ComponentesData[index].Asignado_a_1 = formReportes_por_Componentes.value.Asignado_a_1;
    if (this.Reportes_por_ComponentesData[index].Asignado_a_2 !== formReportes_por_Componentes.value.Asignado_a_2 && formReportes_por_Componentes.value.Asignado_a_2 > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Componentes.value.Asignado_a_2).toPromise();
        this.Reportes_por_ComponentesData[index].Asignado_a_2_Spartan_User = spartan_user;
    }
    this.Reportes_por_ComponentesData[index].Asignado_a_2 = formReportes_por_Componentes.value.Asignado_a_2;
    if (this.Reportes_por_ComponentesData[index].Asignado_a_3 !== formReportes_por_Componentes.value.Asignado_a_3 && formReportes_por_Componentes.value.Asignado_a_3 > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Componentes.value.Asignado_a_3).toPromise();
        this.Reportes_por_ComponentesData[index].Asignado_a_3_Spartan_User = spartan_user;
    }
    this.Reportes_por_ComponentesData[index].Asignado_a_3 = formReportes_por_Componentes.value.Asignado_a_3;
    if (this.Reportes_por_ComponentesData[index].Asignado_a_4 !== formReportes_por_Componentes.value.Asignado_a_4 && formReportes_por_Componentes.value.Asignado_a_4 > 0) {
		let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Componentes.value.Asignado_a_4).toPromise();
        this.Reportes_por_ComponentesData[index].Asignado_a_4_Spartan_User = spartan_user;
    }
    this.Reportes_por_ComponentesData[index].Asignado_a_4 = formReportes_por_Componentes.value.Asignado_a_4;
    this.Reportes_por_ComponentesData[index].Notificado = formReportes_por_Componentes.value.Notificado;
	
    this.Reportes_por_ComponentesData[index].isNew = false;
    this.dataSourceReportes_por_Componentes.data = this.Reportes_por_ComponentesData;
    this.dataSourceReportes_por_Componentes._updateChangeSubscription();
  }
  
  editReportes_por_Componentes(element: any) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    const formReportes_por_Componentes = this.Reportes_por_ComponentesItems.controls[index] as FormGroup;
    this.SelectedReporte_Detalle_de_reportes_por_componentes[index] = this.dataSourceReportes_por_Componentes.data[index].Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlReporte_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Reporte, index);
    this.SelectedAsignado_a_Detalle_de_reportes_por_componentes[index] = this.dataSourceReportes_por_Componentes.data[index].Asignado_a_Spartan_User.Name;
    this.addFilterToControlAsignado_a_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a, index);
    this.SelectedAsignado_a_1_Detalle_de_reportes_por_componentes[index] = this.dataSourceReportes_por_Componentes.data[index].Asignado_a_1_Spartan_User.Name;
    this.addFilterToControlAsignado_a_1_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a_1, index);
    this.SelectedAsignado_a_2_Detalle_de_reportes_por_componentes[index] = this.dataSourceReportes_por_Componentes.data[index].Asignado_a_2_Spartan_User.Name;
    this.addFilterToControlAsignado_a_2_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a_2, index);
    this.SelectedAsignado_a_3_Detalle_de_reportes_por_componentes[index] = this.dataSourceReportes_por_Componentes.data[index].Asignado_a_3_Spartan_User.Name;
    this.addFilterToControlAsignado_a_3_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a_3, index);
    this.SelectedAsignado_a_4_Detalle_de_reportes_por_componentes[index] = this.dataSourceReportes_por_Componentes.data[index].Asignado_a_4_Spartan_User.Name;
    this.addFilterToControlAsignado_a_4_Detalle_de_reportes_por_componentes(formReportes_por_Componentes.controls.Asignado_a_4, index);
	    
    element.edit = true;
  }  

  async saveDetalle_de_reportes_por_componentes(Folio: number) {
    this.dataSourceReportes_por_Componentes.data.forEach(async (d, index) => {
      const data = this.Reportes_por_ComponentesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	    
      model.Orden_de_servicio = Folio;
      model.ID_orden_servicio = Folio;
	
      if (model.Folio === 0) {
        // Add Reportes por Componentes
		    let response = await this.Detalle_de_reportes_por_componentesService.insert(model).toPromise();
      } 
      else if (model.Folio > 0 && !d.IsDeleted) {
        const formReportes_por_Componentes = this.Reportes_por_ComponentesItemsByFolio(model.Folio);
        if (formReportes_por_Componentes.dirty) {
          // Update Reportes por Componentes
          let response = await this.Detalle_de_reportes_por_componentesService.update(model.Folio, model).toPromise();
        }
      } 
      else if (model.Folio > 0 && d.IsDeleted) {
        // delete Reportes por Componentes
        await this.Detalle_de_reportes_por_componentesService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectReporte_Detalle_de_reportes_por_componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedReporte_Detalle_de_reportes_por_componentes[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_componentesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Reporte.setValue(event.option.value);
    this.displayFnReporte_Detalle_de_reportes_por_componentes(element);
  }  
  
  displayFnReporte_Detalle_de_reportes_por_componentes(this, element) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);

    return this.SelectedReporte_Detalle_de_reportes_por_componentes[index];
  }

  updateOptionReporte_Detalle_de_reportes_por_componentes(event, element: any) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    this.SelectedReporte_Detalle_de_reportes_por_componentes[index] = event.source.viewValue;
  } 

	_filterReporte_Detalle_de_reportes_por_componentes(filter: any): Observable<Crear_Reporte> {
		const where = filter !== '' ?  "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';

		return this.Crear_ReporteService.listaSelAll(0, 20, where);
	}

  async addDatosCliente_Reporte_Detalle_de_reportes_por_componentes(control: any, index:number){
    const matricula = this.Orden_de_servicioForm.controls.Matricula.value.Matricula

    if( !!matricula ){
      
      const queryCliente = `Select Razon_Social from Aeronave A Inner JOin Cliente C on A.Cliente = C.Clave Where Matricula = '${matricula}'`
      
      const cliente = await this.brf.EvaluaQueryAsync(queryCliente, 1, "ABC123")
      control.setValue(cliente)
    }
    else {
      control.setValue('')
    }
  }

  addFilterToControlReporte_Detalle_de_reportes_por_componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingReporte_Detalle_de_reportes_por_componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingReporte_Detalle_de_reportes_por_componentes = true;
        return this._filterReporte_Detalle_de_reportes_por_componentes(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingReporte_Detalle_de_reportes_por_componentes = false;
      this.searchReporte_Detalle_de_reportes_por_componentesCompleted = true;
      this.SelectedReporte_Detalle_de_reportes_por_componentes[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedReporte_Detalle_de_reportes_por_componentes[index];
    });
  }

  selectTipo_de_OS_Detalle_de_reportes_por_componentes(event: MatSelectChange, element: any){
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);

    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_componentesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;

    if(event.value === 10)
      data.controls.Descripcion_de_Reporte.enable()
    else{
      data.controls.Descripcion_de_Reporte.setValue('')
      data.controls.Descripcion_de_Reporte.disable()
    }
  }

  public selectAsignado_a_Detalle_de_reportes_por_componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_Detalle_de_reportes_por_componentes[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_componentesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
	  data.controls.Asignado_a.setValue(event.option.value);
    this.displayFnAsignado_a_Detalle_de_reportes_por_componentes(element);
  }  
  
  displayFnAsignado_a_Detalle_de_reportes_por_componentes(this, element) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);

    return this.SelectedAsignado_a_Detalle_de_reportes_por_componentes[index];
  }

  updateOptionAsignado_a_Detalle_de_reportes_por_componentes(event, element: any) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    this.SelectedAsignado_a_Detalle_de_reportes_por_componentes[index] = event.source.viewValue;
  } 

  _filterAsignado_a(filter?: number | string): Observable<Spartan_User> {
		let where = '';

    if(typeof filter === 'number') where = `Spartan_User.Id_User = ${filter}`;
    if(typeof filter === 'string') where = `Spartan_User.Name like '%${filter}%'`;

		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

	_filterAsignado_a_Detalle_de_reportes_por_componentes(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';

		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_Detalle_de_reportes_por_componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_Detalle_de_reportes_por_componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_Detalle_de_reportes_por_componentes = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      this.Reportes_por_ComponentesData[index].users = result.Spartan_Users
      // this.varSpartan_User = result.Spartan_Users;
      this.isLoadingAsignado_a_Detalle_de_reportes_por_componentes = false;
      this.searchAsignado_a_Detalle_de_reportes_por_componentesCompleted = true;
      this.SelectedAsignado_a_Detalle_de_reportes_por_componentes[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_Detalle_de_reportes_por_componentes[index];
    });
  }

  public selectAsignado_a_1_Detalle_de_reportes_por_componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_1_Detalle_de_reportes_por_componentes[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_componentesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_1.setValue(event.option.value);
    this.displayFnAsignado_a_1_Detalle_de_reportes_por_componentes(element);
  }  
  
  displayFnAsignado_a_1_Detalle_de_reportes_por_componentes(this, element) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    return this.SelectedAsignado_a_1_Detalle_de_reportes_por_componentes[index];
  }

  updateOptionAsignado_a_1_Detalle_de_reportes_por_componentes(event, element: any) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    this.SelectedAsignado_a_1_Detalle_de_reportes_por_componentes[index] = event.source.viewValue;
  } 

	_filterAsignado_a_1_Detalle_de_reportes_por_componentes(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_1_Detalle_de_reportes_por_componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_1_Detalle_de_reportes_por_componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_1_Detalle_de_reportes_por_componentes = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      // this.varSpartan_User = result.Spartan_Users;
      this.Reportes_por_ComponentesData[index].users1 = result.Spartan_Users
      this.isLoadingAsignado_a_1_Detalle_de_reportes_por_componentes = false;
      this.searchAsignado_a_1_Detalle_de_reportes_por_componentesCompleted = true;
      this.SelectedAsignado_a_1_Detalle_de_reportes_por_componentes[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_1_Detalle_de_reportes_por_componentes[index];
    });
  }

  public selectAsignado_a_2_Detalle_de_reportes_por_componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_2_Detalle_de_reportes_por_componentes[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_componentesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_2.setValue(event.option.value);
    this.displayFnAsignado_a_2_Detalle_de_reportes_por_componentes(element);
  }  
  
  displayFnAsignado_a_2_Detalle_de_reportes_por_componentes(this, element) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);

    return this.SelectedAsignado_a_2_Detalle_de_reportes_por_componentes[index];
  }

  updateOptionAsignado_a_2_Detalle_de_reportes_por_componentes(event, element: any) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    this.SelectedAsignado_a_2_Detalle_de_reportes_por_componentes[index] = event.source.viewValue;
  } 

	_filterAsignado_a_2_Detalle_de_reportes_por_componentes(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';

		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_2_Detalle_de_reportes_por_componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_2_Detalle_de_reportes_por_componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_2_Detalle_de_reportes_por_componentes = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      // this.varSpartan_User = result.Spartan_Users;
      this.Reportes_por_ComponentesData[index].users2 = result.Spartan_Users
      this.isLoadingAsignado_a_2_Detalle_de_reportes_por_componentes = false;
      this.searchAsignado_a_2_Detalle_de_reportes_por_componentesCompleted = true;
      this.SelectedAsignado_a_2_Detalle_de_reportes_por_componentes[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_2_Detalle_de_reportes_por_componentes[index];
    });
  }

  public selectAsignado_a_3_Detalle_de_reportes_por_componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_3_Detalle_de_reportes_por_componentes[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_componentesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_3.setValue(event.option.value);
    this.displayFnAsignado_a_3_Detalle_de_reportes_por_componentes(element);
  }  
  
  displayFnAsignado_a_3_Detalle_de_reportes_por_componentes(this, element) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    return this.SelectedAsignado_a_3_Detalle_de_reportes_por_componentes[index];
  }

  updateOptionAsignado_a_3_Detalle_de_reportes_por_componentes(event, element: any) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    this.SelectedAsignado_a_3_Detalle_de_reportes_por_componentes[index] = event.source.viewValue;
  } 

	_filterAsignado_a_3_Detalle_de_reportes_por_componentes(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_3_Detalle_de_reportes_por_componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_3_Detalle_de_reportes_por_componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_3_Detalle_de_reportes_por_componentes = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      // this.varSpartan_User = result.Spartan_Users;
      this.Reportes_por_ComponentesData[index].users3 = result.Spartan_Users
      this.isLoadingAsignado_a_3_Detalle_de_reportes_por_componentes = false;
      this.searchAsignado_a_3_Detalle_de_reportes_por_componentesCompleted = true;
      this.SelectedAsignado_a_3_Detalle_de_reportes_por_componentes[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_3_Detalle_de_reportes_por_componentes[index];
    });
  }

  public selectAsignado_a_4_Detalle_de_reportes_por_componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_4_Detalle_de_reportes_por_componentes[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_componentesItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_4.setValue(event.option.value);
    this.displayFnAsignado_a_4_Detalle_de_reportes_por_componentes(element);
  }  
  
  displayFnAsignado_a_4_Detalle_de_reportes_por_componentes(this, element) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    return this.SelectedAsignado_a_4_Detalle_de_reportes_por_componentes[index];
  }

  updateOptionAsignado_a_4_Detalle_de_reportes_por_componentes(event, element: any) {
    const index = this.dataSourceReportes_por_Componentes.data.indexOf(element);
    this.SelectedAsignado_a_4_Detalle_de_reportes_por_componentes[index] = event.source.viewValue;
  } 

	_filterAsignado_a_4_Detalle_de_reportes_por_componentes(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_4_Detalle_de_reportes_por_componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_4_Detalle_de_reportes_por_componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_4_Detalle_de_reportes_por_componentes = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      // this.varSpartan_User = result.Spartan_Users;
      this.Reportes_por_ComponentesData[index].users4 = result.Spartan_Users
      this.isLoadingAsignado_a_4_Detalle_de_reportes_por_componentes = false;
      this.searchAsignado_a_4_Detalle_de_reportes_por_componentesCompleted = true;
      this.SelectedAsignado_a_4_Detalle_de_reportes_por_componentes[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_4_Detalle_de_reportes_por_componentes[index];
    });
  }

  get Reportes_por_AeronaveItems() {
    return this.Orden_de_servicioForm.get('Detalle_de_reportes_por_aeronaveItems') as FormArray;
  }

  getReportes_por_AeronaveColumns(): string[] {
    return this.Reportes_por_AeronaveColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadReportes_por_Aeronave(Reportes_por_Aeronave: Detalle_de_reportes_por_aeronave[]) {
    Reportes_por_Aeronave.forEach(element => {
      this.addReportes_por_Aeronave(element);
    });
  }

  addReportes_por_AeronaveToMR() {
    const Reportes_por_Aeronave = new Detalle_de_reportes_por_aeronave(this.fb);
    this.Reportes_por_AeronaveData.push(this.addReportes_por_Aeronave(Reportes_por_Aeronave));
    this.dataSourceReportes_por_Aeronave.data = this.Reportes_por_AeronaveData;
    Reportes_por_Aeronave.edit = true;
    Reportes_por_Aeronave.isNew = true;
    const length = this.dataSourceReportes_por_Aeronave.data.length;
    const index = length - 1;
    const formReportes_por_Aeronave = this.Reportes_por_AeronaveItems.controls[index] as FormGroup;
  
    this.addDatos_Reporte_Detalle_de_reportes_por_areanave(formReportes_por_Aeronave.controls, index);
    this.addFilterToControlReporte_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Reporte, index);
    this.addFilterToControlAsignado_a_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a, index);
    this.addFilterToControlAsignado_a_1_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a_1, index);
    this.addFilterToControlAsignado_a_2_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a_2, index);
    this.addFilterToControlAsignado_a_3_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a_3, index);
    this.addFilterToControlAsignado_a_4_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a_4, index);
    
    const page = Math.ceil(this.dataSourceReportes_por_Aeronave.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }

    this.brf.SetDisabledControlMR(this.Reportes_por_AeronaveItems,index ,'Descripcion_de_Reporte');
    this.brf.SetDisabledControlMR(this.Reportes_por_AeronaveItems,index ,'Matricula');
    this.brf.SetDisabledControlMR(this.Reportes_por_AeronaveItems,index ,'Modelo');
    this.brf.SetDisabledControlMR(this.Reportes_por_AeronaveItems, index,'Numero_de_serie');
    this.brf.SetDisabledControlMR(this.Reportes_por_AeronaveItems, index,'Datos_del_cliente');
    this.brf.SetDisabledControlMR(this.Reportes_por_AeronaveItems, index,'Reporte');
  }

  async addDatos_Reporte_Detalle_de_reportes_por_areanave(control: any, index:number){
    const matricula = this.Orden_de_servicioForm.controls.Matricula.value.Matricula

    if( !!matricula ){
      
      const queryCliente = `Select Razon_Social from Aeronave A Inner JOin Cliente C on A.Cliente = C.Clave Where Matricula = '${matricula}'`
      const queryNoSerie = `Select Numero_de_Serie From Aeronave Where Matricula = '${matricula}'`
      const queryModelo = `SELECT Descripcion FROM Modelos WHERE Clave =(SELECT modelo FROM Aeronave where matricula ='${matricula}')`

      const cliente = await this.brf.EvaluaQueryAsync(queryCliente, 1, "ABC123")
      const noSerie = await this.brf.EvaluaQueryAsync(queryNoSerie, 1, "ABC123")
      const modelo = await this.brf.EvaluaQueryAsync(queryModelo, 1, "ABC123")

      control.Datos_del_cliente.setValue(cliente)
      control.Numero_de_serie.setValue(noSerie)
      control.Matricula.setValue(matricula)
      control.Modelo.setValue(modelo)
    }
    else {
      control.setValue('')
    }
  }

  addReportes_por_Aeronave(entity: Detalle_de_reportes_por_aeronave) {
    const Reportes_por_Aeronave = new Detalle_de_reportes_por_aeronave(this.fb);
    this.Reportes_por_AeronaveItems.push(Reportes_por_Aeronave.buildFormGroup());
    if (entity) {
      Reportes_por_Aeronave.fromObject(entity);
    }

	  return entity;
  }  

  Reportes_por_AeronaveItemsByFolio(Folio: number): FormGroup {
    return (this.Orden_de_servicioForm.get('Detalle_de_reportes_por_aeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Reportes_por_AeronaveItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
	  let fb = this.Reportes_por_AeronaveItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteReportes_por_Aeronave(element: any) {
    let index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    this.Reportes_por_AeronaveData[index].IsDeleted = true;
    this.dataSourceReportes_por_Aeronave.data = this.Reportes_por_AeronaveData;
    this.dataSourceReportes_por_Aeronave._updateChangeSubscription();
    index = this.dataSourceReportes_por_Aeronave.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditReportes_por_Aeronave(element: any) {
    let index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Reportes_por_AeronaveData[index].IsDeleted = true;
      this.dataSourceReportes_por_Aeronave.data = this.Reportes_por_AeronaveData;
      this.dataSourceReportes_por_Aeronave._updateChangeSubscription();
      index = this.Reportes_por_AeronaveData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveReportes_por_Aeronave(element: any) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    const formReportes_por_Aeronave = this.Reportes_por_AeronaveItems.controls[index] as FormGroup;
    if (this.Reportes_por_AeronaveData[index].Reporte !== formReportes_por_Aeronave.value.Reporte && formReportes_por_Aeronave.value.Reporte > 0) {
		  let crear_reporte = await this.Crear_ReporteService.getById(formReportes_por_Aeronave.value.Reporte).toPromise();
      this.Reportes_por_AeronaveData[index].Reporte_Crear_Reporte = crear_reporte;
    }
    this.Reportes_por_AeronaveData[index].Reporte = formReportes_por_Aeronave.value.Reporte;
    this.Reportes_por_AeronaveData[index].Tipo_de_OS = formReportes_por_Aeronave.value.Tipo_de_OS;
    this.Reportes_por_AeronaveData[index].Tipo_de_OS_Reportes_para_OS = formReportes_por_Aeronave.value.Tipo_de_OS !== '' ?
    this.varReportes_para_OS.filter(d => d.Folio === formReportes_por_Aeronave.value.Tipo_de_OS)[0] : null ;	
    this.Reportes_por_AeronaveData[index].Descripcion_de_Reporte = formReportes_por_Aeronave.value.Descripcion_de_Reporte;
    this.Reportes_por_AeronaveData[index].Matricula = formReportes_por_Aeronave.value.Matricula;
    this.Reportes_por_AeronaveData[index].Modelo = formReportes_por_Aeronave.value.Modelo;
    this.Reportes_por_AeronaveData[index].Numero_de_serie = formReportes_por_Aeronave.value.Numero_de_serie;
    this.Reportes_por_AeronaveData[index].Datos_del_cliente = formReportes_por_Aeronave.value.Datos_del_cliente;
    if (this.Reportes_por_AeronaveData[index].Asignado_a !== formReportes_por_Aeronave.value.Asignado_a && formReportes_por_Aeronave.value.Asignado_a > 0) {
		  let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Aeronave.value.Asignado_a).toPromise();
      this.Reportes_por_AeronaveData[index].Asignado_a_Spartan_User = spartan_user;
    }
    this.Reportes_por_AeronaveData[index].Asignado_a = formReportes_por_Aeronave.value.Asignado_a;
    if (this.Reportes_por_AeronaveData[index].Asignado_a_1 !== formReportes_por_Aeronave.value.Asignado_a_1 && formReportes_por_Aeronave.value.Asignado_a_1 > 0) {
		  let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Aeronave.value.Asignado_a_1).toPromise();
      this.Reportes_por_AeronaveData[index].Asignado_a_1_Spartan_User = spartan_user;
    }
    this.Reportes_por_AeronaveData[index].Asignado_a_1 = formReportes_por_Aeronave.value.Asignado_a_1;
    if (this.Reportes_por_AeronaveData[index].Asignado_a_2 !== formReportes_por_Aeronave.value.Asignado_a_2 && formReportes_por_Aeronave.value.Asignado_a_2 > 0) {
		  let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Aeronave.value.Asignado_a_2).toPromise();
      this.Reportes_por_AeronaveData[index].Asignado_a_2_Spartan_User = spartan_user;
    }
    this.Reportes_por_AeronaveData[index].Asignado_a_2 = formReportes_por_Aeronave.value.Asignado_a_2;
    if (this.Reportes_por_AeronaveData[index].Asignado_a_3 !== formReportes_por_Aeronave.value.Asignado_a_3 && formReportes_por_Aeronave.value.Asignado_a_3 > 0) {
		  let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Aeronave.value.Asignado_a_3).toPromise();
      this.Reportes_por_AeronaveData[index].Asignado_a_3_Spartan_User = spartan_user;
    }
    this.Reportes_por_AeronaveData[index].Asignado_a_3 = formReportes_por_Aeronave.value.Asignado_a_3;
    if (this.Reportes_por_AeronaveData[index].Asignado_a_4 !== formReportes_por_Aeronave.value.Asignado_a_4 && formReportes_por_Aeronave.value.Asignado_a_4 > 0) {
		  let spartan_user = await this.Spartan_UserService.getById(formReportes_por_Aeronave.value.Asignado_a_4).toPromise();
      this.Reportes_por_AeronaveData[index].Asignado_a_4_Spartan_User = spartan_user;
    }
    this.Reportes_por_AeronaveData[index].Asignado_a_4 = formReportes_por_Aeronave.value.Asignado_a_4;
    this.Reportes_por_AeronaveData[index].Notificado = formReportes_por_Aeronave.value.Notificado;
	
    this.Reportes_por_AeronaveData[index].isNew = false;
    this.dataSourceReportes_por_Aeronave.data = this.Reportes_por_AeronaveData;
    this.dataSourceReportes_por_Aeronave._updateChangeSubscription();
  }
  
  editReportes_por_Aeronave(element: any) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    const formReportes_por_Aeronave = this.Reportes_por_AeronaveItems.controls[index] as FormGroup;

    this.SelectedReporte_Detalle_de_reportes_por_aeronave[index] = this.dataSourceReportes_por_Aeronave.data[index].Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlReporte_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Reporte, index);
    this.SelectedAsignado_a_Detalle_de_reportes_por_aeronave[index] = this.dataSourceReportes_por_Aeronave.data[index].Asignado_a_Spartan_User.Name;
    this.addFilterToControlAsignado_a_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a, index);
    this.SelectedAsignado_a_1_Detalle_de_reportes_por_aeronave[index] = this.dataSourceReportes_por_Aeronave.data[index].Asignado_a_1_Spartan_User.Name;
    this.addFilterToControlAsignado_a_1_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a_1, index);
    this.SelectedAsignado_a_2_Detalle_de_reportes_por_aeronave[index] = this.dataSourceReportes_por_Aeronave.data[index].Asignado_a_2_Spartan_User.Name;
    this.addFilterToControlAsignado_a_2_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a_2, index);
    this.SelectedAsignado_a_3_Detalle_de_reportes_por_aeronave[index] = this.dataSourceReportes_por_Aeronave.data[index].Asignado_a_3_Spartan_User.Name;
    this.addFilterToControlAsignado_a_3_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a_3, index);
    this.SelectedAsignado_a_4_Detalle_de_reportes_por_aeronave[index] = this.dataSourceReportes_por_Aeronave.data[index].Asignado_a_4_Spartan_User.Name;
    this.addFilterToControlAsignado_a_4_Detalle_de_reportes_por_aeronave(formReportes_por_Aeronave.controls.Asignado_a_4, index);
	    
    element.edit = true;
  }  

  async saveDetalle_de_reportes_por_aeronave(Folio: number) {
    this.dataSourceReportes_por_Aeronave.data.forEach(async (d, index) => {
      const data = this.Reportes_por_AeronaveItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	    model.Orden_de_servicio = Folio;
	
      
      if (model.Folio === 0) {
        // Add Reportes por Aeronave
		    let response = await this.Detalle_de_reportes_por_aeronaveService.insert(model).toPromise();
      } 
      else if (model.Folio > 0 && !d.IsDeleted) {
        const formReportes_por_Aeronave = this.Reportes_por_AeronaveItemsByFolio(model.Folio);
        if (formReportes_por_Aeronave.dirty) {
          // Update Reportes por Aeronave
          let response = await this.Detalle_de_reportes_por_aeronaveService.update(model.Folio, model).toPromise();
        }
      } 
      else if (model.Folio > 0 && d.IsDeleted) {
        // delete Reportes por Aeronave
        await this.Detalle_de_reportes_por_aeronaveService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectReporte_Detalle_de_reportes_por_aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedReporte_Detalle_de_reportes_por_aeronave[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_aeronaveItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Reporte.setValue(event.option.value);
    this.displayFnReporte_Detalle_de_reportes_por_aeronave(element);
  }  
  
  displayFnReporte_Detalle_de_reportes_por_aeronave(this, element) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    return this.SelectedReporte_Detalle_de_reportes_por_aeronave[index];
  }

  updateOptionReporte_Detalle_de_reportes_por_aeronave(event, element: any) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    this.SelectedReporte_Detalle_de_reportes_por_aeronave[index] = event.source.viewValue;
  } 

	_filterReporte_Detalle_de_reportes_por_aeronave(filter: any): Observable<Crear_Reporte> {
		const where = filter !== '' ?  "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';
		return this.Crear_ReporteService.listaSelAll(0, 20, where);
	}

  addFilterToControlReporte_Detalle_de_reportes_por_aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingReporte_Detalle_de_reportes_por_aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingReporte_Detalle_de_reportes_por_aeronave = true;
        return this._filterReporte_Detalle_de_reportes_por_aeronave(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingReporte_Detalle_de_reportes_por_aeronave = false;
      this.searchReporte_Detalle_de_reportes_por_aeronaveCompleted = true;
      this.SelectedReporte_Detalle_de_reportes_por_aeronave[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedReporte_Detalle_de_reportes_por_aeronave[index];
    });
  }

  public selectAsignado_a_Detalle_de_reportes_por_aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_Detalle_de_reportes_por_aeronave[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_aeronaveItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a.setValue(event.option.value);
    this.displayFnAsignado_a_Detalle_de_reportes_por_aeronave(element);
  }  
  
  displayFnAsignado_a_Detalle_de_reportes_por_aeronave(this, element) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    return this.SelectedAsignado_a_Detalle_de_reportes_por_aeronave[index];
  }

  updateOptionAsignado_a_Detalle_de_reportes_por_aeronave(event, element: any) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    this.SelectedAsignado_a_Detalle_de_reportes_por_aeronave[index] = event.source.viewValue;
  } 

	_filterAsignado_a_Detalle_de_reportes_por_aeronave(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_Detalle_de_reportes_por_aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_Detalle_de_reportes_por_aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_Detalle_de_reportes_por_aeronave = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      // this.varSpartan_User = result.Spartan_Users;
      this.Reportes_por_AeronaveData[index].users = result.Spartan_Users
      this.isLoadingAsignado_a_Detalle_de_reportes_por_aeronave = false;
      this.searchAsignado_a_Detalle_de_reportes_por_aeronaveCompleted = true;
      this.SelectedAsignado_a_Detalle_de_reportes_por_aeronave[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_Detalle_de_reportes_por_aeronave[index];
    });
  }

  public selectAsignado_a_1_Detalle_de_reportes_por_aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_1_Detalle_de_reportes_por_aeronave[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_aeronaveItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_1.setValue(event.option.value);
    this.displayFnAsignado_a_1_Detalle_de_reportes_por_aeronave(element);
  }  
  
  displayFnAsignado_a_1_Detalle_de_reportes_por_aeronave(this, element) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    return this.SelectedAsignado_a_1_Detalle_de_reportes_por_aeronave[index];
  }

  updateOptionAsignado_a_1_Detalle_de_reportes_por_aeronave(event, element: any) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    this.SelectedAsignado_a_1_Detalle_de_reportes_por_aeronave[index] = event.source.viewValue;
  } 

	_filterAsignado_a_1_Detalle_de_reportes_por_aeronave(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_1_Detalle_de_reportes_por_aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_1_Detalle_de_reportes_por_aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_1_Detalle_de_reportes_por_aeronave = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      // this.varSpartan_User = result.Spartan_Users;
      this.Reportes_por_AeronaveData[index].users1 = result.Spartan_Users
      this.isLoadingAsignado_a_1_Detalle_de_reportes_por_aeronave = false;
      this.searchAsignado_a_1_Detalle_de_reportes_por_aeronaveCompleted = true;
      this.SelectedAsignado_a_1_Detalle_de_reportes_por_aeronave[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_1_Detalle_de_reportes_por_aeronave[index];
    });
  }

  public selectAsignado_a_2_Detalle_de_reportes_por_aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_2_Detalle_de_reportes_por_aeronave[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_aeronaveItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_2.setValue(event.option.value);
    this.displayFnAsignado_a_2_Detalle_de_reportes_por_aeronave(element);
  }  
  
  displayFnAsignado_a_2_Detalle_de_reportes_por_aeronave(this, element) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    return this.SelectedAsignado_a_2_Detalle_de_reportes_por_aeronave[index];
  }

  updateOptionAsignado_a_2_Detalle_de_reportes_por_aeronave(event, element: any) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    this.SelectedAsignado_a_2_Detalle_de_reportes_por_aeronave[index] = event.source.viewValue;
  } 

	_filterAsignado_a_2_Detalle_de_reportes_por_aeronave(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_2_Detalle_de_reportes_por_aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_2_Detalle_de_reportes_por_aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_2_Detalle_de_reportes_por_aeronave = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      // this.varSpartan_User = result.Spartan_Users;
      this.Reportes_por_AeronaveData[index].users2 = result.Spartan_Users
      this.isLoadingAsignado_a_2_Detalle_de_reportes_por_aeronave = false;
      this.searchAsignado_a_2_Detalle_de_reportes_por_aeronaveCompleted = true;
      this.SelectedAsignado_a_2_Detalle_de_reportes_por_aeronave[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_2_Detalle_de_reportes_por_aeronave[index];
    });
  }

  public selectAsignado_a_3_Detalle_de_reportes_por_aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_3_Detalle_de_reportes_por_aeronave[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_aeronaveItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_3.setValue(event.option.value);
    this.displayFnAsignado_a_3_Detalle_de_reportes_por_aeronave(element);
  }  
  
  displayFnAsignado_a_3_Detalle_de_reportes_por_aeronave(this, element) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    return this.SelectedAsignado_a_3_Detalle_de_reportes_por_aeronave[index];
  }

  updateOptionAsignado_a_3_Detalle_de_reportes_por_aeronave(event, element: any) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    this.SelectedAsignado_a_3_Detalle_de_reportes_por_aeronave[index] = event.source.viewValue;
  } 

	_filterAsignado_a_3_Detalle_de_reportes_por_aeronave(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_3_Detalle_de_reportes_por_aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_3_Detalle_de_reportes_por_aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_3_Detalle_de_reportes_por_aeronave = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      // this.varSpartan_User = result.Spartan_Users;
      this.Reportes_por_AeronaveData[index].users3 = result.Spartan_Users
      this.isLoadingAsignado_a_3_Detalle_de_reportes_por_aeronave = false;
      this.searchAsignado_a_3_Detalle_de_reportes_por_aeronaveCompleted = true;
      this.SelectedAsignado_a_3_Detalle_de_reportes_por_aeronave[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_3_Detalle_de_reportes_por_aeronave[index];
    });
  }

  public selectAsignado_a_4_Detalle_de_reportes_por_aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_4_Detalle_de_reportes_por_aeronave[index] = event.option.viewValue;
    let fgr = this.Orden_de_servicioForm.controls.Detalle_de_reportes_por_aeronaveItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_4.setValue(event.option.value);
    this.displayFnAsignado_a_4_Detalle_de_reportes_por_aeronave(element);
  }  
  
  displayFnAsignado_a_4_Detalle_de_reportes_por_aeronave(this, element) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    return this.SelectedAsignado_a_4_Detalle_de_reportes_por_aeronave[index];
  }

  updateOptionAsignado_a_4_Detalle_de_reportes_por_aeronave(event, element: any) {
    const index = this.dataSourceReportes_por_Aeronave.data.indexOf(element);
    this.SelectedAsignado_a_4_Detalle_de_reportes_por_aeronave[index] = event.source.viewValue;
  } 

	_filterAsignado_a_4_Detalle_de_reportes_por_aeronave(filter: any): Observable<Spartan_User> {
		const where = filter !== '' ?  "Spartan_User.Name like '%" + filter + "%'" : '';
		return this.Spartan_UserService.listaSelAll(0, 20, where);
	}

  addFilterToControlAsignado_a_4_Detalle_de_reportes_por_aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_4_Detalle_de_reportes_por_aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_4_Detalle_de_reportes_por_aeronave = true;
        return this._filterAsignado_a(value);
      })
    ).subscribe(result => {
      // this.varSpartan_User = result.Spartan_Users;
      this.Reportes_por_AeronaveData[index].users4 = result.Spartan_Users
      this.isLoadingAsignado_a_4_Detalle_de_reportes_por_aeronave = false;
      this.searchAsignado_a_4_Detalle_de_reportes_por_aeronaveCompleted = true;
      this.SelectedAsignado_a_4_Detalle_de_reportes_por_aeronave[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_4_Detalle_de_reportes_por_aeronave[index];
    });
  }

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Orden_de_servicioForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Estatus_ReporteService.getAll());
    observablesArray.push(this.Reportes_para_OSService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varEstatus_Reporte , varReportes_para_OS   ]) => {
          this.varEstatus_Reporte = varEstatus_Reporte;
          this.varReportes_para_OS = varReportes_para_OS;



          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Orden_de_servicioForm.get('Numero_de_OT').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      // tap(() => this.isLoadingNumero_de_OT = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.isLoadingNumero_de_OT = true
        const Matricula = this.Orden_de_servicioForm.controls.Matricula.value?.Matricula
        if(!Matricula){ 
          return of({ 
            Orden_de_Trabajos: []
          })
        }
        
        const whereMatricula = `Orden_de_Trabajo.Matricula = '${Matricula}'`
        const whereLike = 'and Orden_de_Trabajo.numero_de_orden like'
        
        if(typeof value === 'string' && value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, `${whereMatricula} ${whereLike} '%${value.trim()}%'`);
        if(typeof value !== 'string' && value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, `${whereMatricula} ${whereLike} '%${value.numero_de_orden.trim()}%'`);

        return this.Orden_de_TrabajoService.listaSelAll(0, 20, whereMatricula);
        // if (!value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
        // if (typeof value === 'string') {
        //   if (value === '') return this.Orden_de_TrabajoService.listaSelAll(0, 20, whereMatricula);
        //   return this.Orden_de_TrabajoService.listaSelAll(0, 20,
        //     "Orden_de_Trabajo.numero_de_orden like '%" + value.trimLeft().trimRight() + "%' and " + whereMatricula );
        // }
        // return this.Orden_de_TrabajoService.listaSelAll(0, 20,
        //   "Orden_de_Trabajo.numero_de_orden like '%" + value.numero_de_orden.trimLeft().trimRight() + "%' and " + whereMatricula);
      })
    ).subscribe(result => {
      console.log('result', result)
      this.isLoadingNumero_de_OT = false;
      this.hasOptionsNumero_de_OT = result?.Orden_de_Trabajos?.length > 0;
      // if(  this.operation != 'New'){
        // this.Orden_de_servicioForm.get('Numero_de_OT').setValue(result?.Orden_de_Trabajos[0], { onlySelf: false, emitEvent: false });
        this.optionsNumero_de_OT = of(result?.Orden_de_Trabajos);
      // }
    }, error => {
      this.isLoadingNumero_de_OT = false;
      this.hasOptionsNumero_de_OT = false;
      this.optionsNumero_de_OT = of([]);
    });
    // this.Orden_de_servicioForm.get('Modelo').valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(1),
    //   tap(() => this.isLoadingModelo = true),
    //   distinctUntilChanged(),
    //   switchMap(value => {
    //     if (!value) return this.ModelosService.listaSelAll(0, 20, '');
    //     if (typeof value === 'string') {
    //       if (value === '') return this.ModelosService.listaSelAll(0, 20, '');
    //       return this.ModelosService.listaSelAll(0, 20,
    //         "Modelos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
    //     }
    //     return this.ModelosService.listaSelAll(0, 20,
    //       "Modelos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
    //   })
    // ).subscribe(result => {
    //   this.isLoadingModelo = false;
    //   this.hasOptionsModelo = result?.Modeloss?.length > 0;
    //   // this.Orden_de_servicioForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
    //   this.optionsModelo = of(result?.Modeloss);
    // }, error => {
    //   this.isLoadingModelo = false;
    //   this.hasOptionsModelo = false;
    //   this.optionsModelo = of([]);
    // });
    this.Orden_de_servicioForm.get('Matricula').valueChanges.pipe(
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
      // this.Orden_de_servicioForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    // this.Orden_de_servicioForm.get('Propietario').valueChanges.pipe(
    //   startWith(''),
    //   debounceTime(1),
    //   tap(() => this.isLoadingPropietario = true),
    //   distinctUntilChanged(),
    //   switchMap(value => {
    //     if (!value) return this.PropietariosService.listaSelAll(0, 20, '');
    //     if (typeof value === 'string') {
    //       if (value === '') return this.PropietariosService.listaSelAll(0, 20, '');
    //       return this.PropietariosService.listaSelAll(0, 20,
    //         "Propietarios.Nombre like '%" + value.trimLeft().trimRight() + "%'");
    //     }
    //     return this.PropietariosService.listaSelAll(0, 20,
    //       "Propietarios.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
    //   })
    // ).subscribe(result => {
    //   this.isLoadingPropietario = false;
    //   this.hasOptionsPropietario = result?.Propietarioss?.length > 0;
	  //   // this.Orden_de_servicioForm.get('Propietario').setValue(result?.Propietarioss[0], { onlySelf: true, emitEvent: false });
	  //   this.optionsPropietario = of(result?.Propietarioss);
    // }, error => {
    //   this.isLoadingPropietario = false;
    //   this.hasOptionsPropietario = false;
    //   this.optionsPropietario = of([]);
    // });
  }
  
  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Estatus': {
        this.Estatus_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_Reporte = x.Estatus_Reportes;
        });
        break;
      }
      case 'Tipo_de_OS': {
        this.Reportes_para_OSService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varReportes_para_OS = x.Reportes_para_OSs;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnNumero_de_OT(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
  displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
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
      const entity = this.Orden_de_servicioForm.value;
      entity.Folio = this.model.Folio;
      entity.Numero_de_OT = this.Orden_de_servicioForm.get('Numero_de_OT').value.Folio;
      entity.Modelo = this.Orden_de_servicioForm.get('Modelo').value.Clave;
      entity.Matricula = this.Orden_de_servicioForm.get('Matricula').value.Matricula;
      entity.Propietario = this.Orden_de_servicioForm.controls.Propietario.value?.Clave ?? '';
      entity.Estatus = this.Orden_de_servicioForm.controls.Estatus.value;entity.Folio = this.model.Folio;
      entity.Numero_de_OT = this.Orden_de_servicioForm.get('Numero_de_OT').value.Folio;
      entity.Modelo = this.Orden_de_servicioForm.get('Modelo').value.Clave;
      entity.Matricula = this.Orden_de_servicioForm.get('Matricula').value.Matricula;
      entity.Propietario = this.Orden_de_servicioForm.controls.Propietario.value?.Clave ?? '';
      entity.Estatus = this.Orden_de_servicioForm.controls.Estatus.value;
	  	  
	    if (this.model.Folio > 0 ) {
        await this.Orden_de_servicioService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_reportes_por_componentes(this.model.Folio);  
        await this.saveDetalle_de_reportes_por_aeronave(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Orden_de_servicioService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_reportes_por_componentes(id);
          await this.saveDetalle_de_reportes_por_aeronave(id);

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
      this.Orden_de_servicioForm.reset();
      this.model = new Orden_de_servicio(this.fb);
      this.Orden_de_servicioForm = this.model.buildFormGroup();
      this.dataSourceReportes_por_Componentes = new MatTableDataSource<Detalle_de_reportes_por_componentes>();
      this.Reportes_por_ComponentesData = [];
      this.dataSourceReportes_por_Aeronave = new MatTableDataSource<Detalle_de_reportes_por_aeronave>();
      this.Reportes_por_AeronaveData = [];

    } else {
      this.router.navigate(['views/Orden_de_servicio/add']);
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
    this.router.navigate(['/Orden_de_servicio/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas
  Folio_OS_ExecuteBusinessRules(): void {
    //Folio_OS_FieldExecuteBusinessRulesEnd
  }
  Numero_de_OT_ExecuteBusinessRules(): void {
    //Numero_de_OT_FieldExecuteBusinessRulesEnd
  }
  Modelo_ExecuteBusinessRules(): void {
    //Modelo_FieldExecuteBusinessRulesEnd
  }
  async Matricula_ExecuteBusinessRules(): Promise<void> {
    const matricula = this.Orden_de_servicioForm.controls.Matricula.value.Matricula
    
    if( !!matricula ){
      
      const queryModelo = `SELECT Clave, Descripcion FROM Modelos WHERE Clave =(SELECT modelo FROM Aeronave where matricula ='${matricula}')`
      const queryPropietario = `SELECT Folio, Nombre FROM propietarios WHERE Folio =(SELECT propietario FROM Aeronave where matricula ='${matricula}')`
      // const queryOrdenTrabajo = `Select Folio,numero_de_orden from Orden_de_Trabajo Where Matricula = '${matricula}' AND Estatus = 2 AND Folio NOT IN(Select Numero_de_OT From Orden_de_Servicio Where Numero_de_OT IS NOT NULL )`
      
      const modelo = await this.brf.EvaluaQueryDictionaryAsync(queryModelo, 1, "ABC123")
      const propietario = await this.brf.EvaluaQueryDictionaryAsync(queryPropietario, 1, "ABC123")
      const ordenesTrabajo = await this.Orden_de_TrabajoService.listaSelAll(0, 20, `Orden_de_Trabajo.Matricula = '${matricula}'`).toPromise()

      this.brf.SetValueControl(this.Orden_de_servicioForm,"Modelo", modelo[0] ?? null )
      this.brf.SetValueControl(this.Orden_de_servicioForm,"Propietario", propietario[0] ?? null )
      
      this.hasOptionsNumero_de_OT = ordenesTrabajo?.Orden_de_Trabajos?.length > 0;
      this.optionsNumero_de_OT = of(ordenesTrabajo?.Orden_de_Trabajos);
      this.brf.SetValueControl(this.Orden_de_servicioForm,"Numero_de_OT", null )
      this.isLoadingNumero_de_OT = false

      //INICIA - BRID:4462 - al seleccionar la matricula traer los datos por default  modelo y propietario..  - Autor: Jose Caballero - Actualización: 9/13/2021 12:29:24 PM
      // this.brf.SetValueControl(this.Orden_de_servicioForm, 'Modelo', await this.brf.EvaluaQueryAsync(queryModelo, 1, 'ABC123'))
      // this.brf.SetValueControl(this.Orden_de_servicioForm, 'Propietario', await this.brf.EvaluaQueryAsync(queryPropietario, 1, 'ABC123'))
      
      // this.SetValueFromQuery('Numero_de_OT', this.EvaluaQuery(queryOrdenTrabajo))
      // this.brf.SetValueFromQuery(this.Orden_de_servicioForm,"Modelo",await this.brf.EvaluaQueryAsync(queryModelo, 1, "ABC123"),1,"ABC123"); 
      // this.brf.SetValueFromQuery(this.Orden_de_servicioForm,"Propietario",this.brf.EvaluaQuery("SELECT Folio, Nombre FROM propietarios WHERE Folio =(SELECT propietario FROM Aeronave where matricula ='FLD[Matricula]')", 1, "ABC123"),1,"ABC123");
      //TERMINA - BRID:4462
  
      //INICIA - BRID:6259 - Filtrar OT por Matricula  - Autor: Aaron - Actualización: 9/14/2021 11:53:54 AM
      this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Numero_de_OT', 1); 
      this.brf.SetRequiredControl(this.Orden_de_servicioForm, "Numero_de_OT");
    }
    else { 
      this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Numero_de_OT', 0);
    }
    //TERMINA - BRID:6259

    //Matricula_FieldExecuteBusinessRulesEnd


  }
   

  Propietario_ExecuteBusinessRules(): void {
    //Propietario_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_apertura_ExecuteBusinessRules(): void {
    //INICIA - BRID:6264 - Validar que fecha de apertura sea menor a la fecha de Cierre en Orden   - Autor: Administrador - Actualización: 9/13/2021 7:22:47 PM
    if( this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_apertura]',103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_cierre]',103),103))", 1, 'ABC123')>=this.brf.TryParseInt('0', '0') ) {
    } else { 
      this.brf.ShowMessage("La Fecha de apertura no puede ser mayora la Fecha de cierre, por favor valide nuevamente");
    }
    //TERMINA - BRID:6264

    //Fecha_de_apertura_FieldExecuteBusinessRulesEnd
  }
  
  Fecha_de_cierre_ExecuteBusinessRules(): void {
    //INICIA - BRID:6261 - Validar que Fecha de apertura sea menor a la fecha de Cierre de servicio  - Autor: Administrador - Actualización: 9/13/2021 7:02:52 PM
    if( this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_apertura]',103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_cierre]',103),103))", 1, 'ABC123')>=this.brf.TryParseInt('0', '0') ) {
    } else { 
      this.brf.SetValueFromQuery(this.Orden_de_servicioForm,"Fecha_de_cierre",this.brf.EvaluaQuery(" Select ''", 1, "ABC123"),1,"ABC123"); this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery("Select 'La Fecha de cierre no puede ser menor a la Fecha de apertura, por favor valide nuevamente.'", 1, "ABC123"),1,"ABC123");
    }
    //TERMINA - BRID:6261

    //INICIA - BRID:6263 - Validar que Fecha de apertura sea menor a la fecha de Cierre   - Autor: Administrador - Actualización: 9/13/2021 7:05:03 PM
    if( this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_apertura]',103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_cierre]',103),103))", 1, 'ABC123')>=this.brf.TryParseInt('0', '0') ) {
    } else { 
      this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery("Select 'La Fecha de cierre no puede ser menor a la Fecha de apertura, por favor valide nuevamente.'", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Orden_de_servicioForm,"Fecha_de_cierre",this.brf.EvaluaQuery("Select ''", 1, "ABC123"),1,"ABC123"); this.brf.SetValueControl(this.Orden_de_servicioForm, "Fecha_de_cierre", " ");
    }
    //TERMINA - BRID:6263
    //Fecha_de_cierre_FieldExecuteBusinessRulesEnd
  }

  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }

  onMatriculaChange(e): void {
    if(e.target.value == ''){
      console.log(this.Orden_de_servicioForm.controls.Matricula)
      this.brf.SetValueControl(this.Orden_de_servicioForm,"Modelo", null )
      this.brf.SetValueControl(this.Orden_de_servicioForm,"Propietario", null )
    }
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

    //INICIA - BRID:4077 - acomodo de campos orden de servicio - Autor: Aaron - Actualización: 9/6/2021 10:54:22 AM

    if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
    }
    //TERMINA - BRID:4077

    //INICIA - BRID:4463 - RDN, en nuevo y edición deshabilitar los campos modelo y propietario, y una vez seleccionada la matricula no va a poder seleccionar otra diferente.. - Autor: Yamir - Actualización: 7/27/2021 3:32:30 PM
    if(  this.operation == 'New' || this.operation == 'Update' ) {
      this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Modelo', 0);
      this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Propietario', 0);
    } 
    //TERMINA - BRID:4463

    //INICIA - BRID:4464 - no va a poder seleccionar otra diferente matricula - Autor: Yamir - Actualización: 7/27/2021 3:39:10 PM
    if(  this.operation == 'Update' ) {
    this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Matricula', 0);
    } 
    //TERMINA - BRID:4464

    //INICIA - BRID:4579 - Deshabilitar Status y colocar Abierto por default - Autor: Aaron - Actualización: 8/3/2021 1:20:43 PM
    if(  this.operation == 'New' ) {
      this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Estatus', 0); 
      this.brf.SetValueControl(this.Orden_de_servicioForm, "Estatus", "2");
    } 
    //TERMINA - BRID:4579

    //INICIA - BRID:5489 - Deshabilitar campo estatus cuando el usuario no sea Programador - Autor: Aaron - Actualización: 8/30/2021 9:01:51 AM
    if(  this.operation == 'Update' ) {
      if( this.brf.EvaluaQuery("SELECT GLOBAL[USERROLEID]", 1, 'ABC123')!=this.brf.TryParseInt('25', '25') ) { 
        this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Estatus', 0);
      } else { 
        this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Estatus', 0);
      }
    } 
    //TERMINA - BRID:5489

    //INICIA - BRID:5837 - Ocultar Campo Folio en OS - Autor: Aaron - Actualización: 9/6/2021 10:47:35 AM
    if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
      this.brf.HideFieldOfForm(this.Orden_de_servicioForm, "Folio"); 
      this.brf.SetNotRequiredControl(this.Orden_de_servicioForm, "Folio"); 
      this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Folio_OS', 0);
      this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Numero_de_OT', 0);
    } 
    //TERMINA - BRID:5837

    //INICIA - BRID:5839 - Filtrar Combo de Matricula - Autor: Aaron - Actualización: 9/13/2021 5:31:11 PM
    if(  this.operation == 'New' ) {

    } 
    //TERMINA - BRID:5839

    //INICIA - BRID:6149 - Deshabilitar campo Fecha Apertura al Editar - Autor: Aaron - Actualización: 9/13/2021 11:45:15 AM
    if(  this.operation == 'Update' || this.operation == 'Consult' ) {
      this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Fecha_de_apertura', 0);
      this.brf.SetEnabledControl(this.Orden_de_servicioForm, 'Fecha_de_cierre', 0);
    } 
    //TERMINA - BRID:6149

    //rulesOnInit_ExecuteBusinessRulesEnd
  }
  
  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    let USERROLEID = this.localStorageHelper.getItemFromLocalStorage('USERROLEID')
    let KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)

    //INICIA - BRID:4015 - Ejecutar SP para guardar No OS igual al Folio - Autor: Aaron - Actualización: 8/2/2021 5:46:43 PM
    if(  this.operation == 'New' ) {
      this.brf.EvaluaQuery(`EXEC upsGuardarNumeroOrdenServicio ${KeyValueInserted}`, 1, "ABC123");
    } 
    //TERMINA - BRID:4015


    //INICIA - BRID:4582 - Ejecutar SP, para insertar reportes desde una OS - Autor: Aaron - Actualización: 9/23/2021 7:00:51 PM
    if(  this.operation == 'New' ) {
      this.brf.EvaluaQuery(`EXEC Insert_Reportes_Orden_de_Servicio_Aeronave ${KeyValueInserted},${USERROLEID}`, 1, "ABC123"); 
      this.brf.EvaluaQuery(`EXEC Insert_Reportes_Orden_de_Servicio_Componente ${KeyValueInserted},${USERROLEID}`, 1, "ABC123");
    } 
    //TERMINA - BRID:4582


    //INICIA - BRID:4583 - Ejecutar SP para insertar reportes desde una OS al editar - Autor: Aaron - Actualización: 9/23/2021 6:58:49 PM
    if(  this.operation == 'Update' ) {
      this.brf.EvaluaQuery(`EXEC Insert_Reportes_Orden_de_Servicio_Aeronave '${KeyValueInserted}',${USERROLEID}`, 1, "ABC123"); 
      this.brf.EvaluaQuery(`EXEC Insert_Reportes_Orden_de_Servicio_Componente '${KeyValueInserted}',${USERROLEID}`, 1, "ABC123");
    } 
    //TERMINA - BRID:4583

    //rulesAfterSave_ExecuteBusinessRulesEnd
  }
  
  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:4568 - Crear variables de sesion para envio de correos OS - Autor: Aaron - Actualización: 8/3/2021 2:10:59 PM
    if(  this.operation == 'New' || this.operation == 'Update' ) {
      // this.brf.CreateSessionVar("matricula",this.brf.EvaluaQuery(" Select 'FLD[Matricula]'", 1, "ABC123"), 1,"ABC123"); 
      // this.brf.CreateSessionVar("numero_os",this.brf.EvaluaQuery(" Select 'FLDD[lblFolio]'", 1, "ABC123"), 1,"ABC123"); 
      // this.brf.CreateSessionVar("numero_de_serie",this.brf.EvaluaQuery(" Select Numero_de_Serie From Aeronave Where Matricula = 'FLD[Matricula]'", 1, "ABC123"), 1,"ABC123");
    } 
    //TERMINA - BRID:4568

    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas
}
