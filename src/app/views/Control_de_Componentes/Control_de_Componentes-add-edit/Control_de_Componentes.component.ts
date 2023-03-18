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
import { Control_de_ComponentesService } from 'src/app/api-services/Control_de_Componentes.service';
import { Control_de_Componentes } from 'src/app/models/Control_de_Componentes';
import { Modulo_de_MantenimientoService } from 'src/app/api-services/Modulo_de_Mantenimiento.service';
import { Modulo_de_Mantenimiento } from 'src/app/models/Modulo_de_Mantenimiento';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { Estatus_de_componenteService } from 'src/app/api-services/Estatus_de_componente.service';
import { Estatus_de_componente } from 'src/app/models/Estatus_de_componente';
import { Detalle_Parte_Asociada_ComponentesService } from 'src/app/api-services/Detalle_Parte_Asociada_Componentes.service';
import { Detalle_Parte_Asociada_Componentes } from 'src/app/models/Detalle_Parte_Asociada_Componentes';
import { PiezasService } from 'src/app/api-services/Piezas.service';
import { Piezas } from 'src/app/models/Piezas';

import { Clasificacion_de_aeronavegabilidadService } from 'src/app/api-services/Clasificacion_de_aeronavegabilidad.service';
import { Clasificacion_de_aeronavegabilidad } from 'src/app/models/Clasificacion_de_aeronavegabilidad';
import { Detalle_Servicios_Asociados_ComponentesService } from 'src/app/api-services/Detalle_Servicios_Asociados_Componentes.service';
import { Detalle_Servicios_Asociados_Componentes } from 'src/app/models/Detalle_Servicios_Asociados_Componentes';
import { ServiciosService } from 'src/app/api-services/Servicios.service';
import { Servicios } from 'src/app/models/Servicios';


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
  selector: 'app-Control_de_Componentes',
  templateUrl: './Control_de_Componentes.component.html',
  styleUrls: ['./Control_de_Componentes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Control_de_ComponentesComponent implements OnInit, AfterViewInit {
MRaddServicio_asociado: boolean = false;
MRaddParte_asociada: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Control_de_ComponentesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Control_de_Componentes;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varModulo_de_Mantenimiento: Modulo_de_Mantenimiento[] = [];
	public varModelos: Modelos[] = [];
	public varCodigo_Computarizado: Codigo_Computarizado[] = [];
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;
	optionsNumero_de_serie: Observable<Aeronave[]>;
	hasOptionsNumero_de_serie: boolean;
	isLoadingNumero_de_serie: boolean;
	optionsCodigo_ATA: Observable<Catalogo_codigo_ATA[]>;
	hasOptionsCodigo_ATA: boolean;
	isLoadingCodigo_ATA: boolean;
	public varEstatus_de_componente: Estatus_de_componente[] = [];
	public varPiezas: Piezas[] = [];

  autoN_de_parte_Detalle_Parte_Asociada_Componentes = new FormControl();
  SelectedN_de_parte_Detalle_Parte_Asociada_Componentes: string[] = [];
  isLoadingN_de_parte_Detalle_Parte_Asociada_Componentes: boolean;
  searchN_de_parte_Detalle_Parte_Asociada_ComponentesCompleted: boolean;
  autoDescripcion_Detalle_Parte_Asociada_Componentes = new FormControl();
  SelectedDescripcion_Detalle_Parte_Asociada_Componentes: string[] = [];
  isLoadingDescripcion_Detalle_Parte_Asociada_Componentes: boolean;
  searchDescripcion_Detalle_Parte_Asociada_ComponentesCompleted: boolean;

	public varClasificacion_de_aeronavegabilidad: Clasificacion_de_aeronavegabilidad[] = [];
	public varServicios: Servicios[] = [];

  autoN_de_servicio_Detalle_Servicios_Asociados_Componentes = new FormControl();
  SelectedN_de_servicio_Detalle_Servicios_Asociados_Componentes: string[] = [];
  isLoadingN_de_servicio_Detalle_Servicios_Asociados_Componentes: boolean;
  searchN_de_servicio_Detalle_Servicios_Asociados_ComponentesCompleted: boolean;
  autoDescripcion_Detalle_Servicios_Asociados_Componentes = new FormControl();
  SelectedDescripcion_Detalle_Servicios_Asociados_Componentes: string[] = [];
  isLoadingDescripcion_Detalle_Servicios_Asociados_Componentes: boolean;
  searchDescripcion_Detalle_Servicios_Asociados_ComponentesCompleted: boolean;

	InstruccionesSelectedFile: File;
	InstruccionesName = '';
	fileInstrucciones: SpartanFile;

	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceParte_asociada = new MatTableDataSource<Detalle_Parte_Asociada_Componentes>();
  Parte_asociadaColumns = [
    { def: 'actions', hide: false },
    { def: 'N_de_parte', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Limite_de_Meses', hide: false },
    { def: 'Limite_de_Horas', hide: false },
    { def: 'Limite_de_ciclos', hide: false },
	
  ];
  Parte_asociadaData: Detalle_Parte_Asociada_Componentes[] = [];
  dataSourceServicio_asociado = new MatTableDataSource<Detalle_Servicios_Asociados_Componentes>();
  Servicio_asociadoColumns = [
    { def: 'actions', hide: false },
    { def: 'N_de_servicio', hide: false },
	
  ];
  Servicio_asociadoData: Detalle_Servicios_Asociados_Componentes[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Control_de_ComponentesService: Control_de_ComponentesService,
    private Modulo_de_MantenimientoService: Modulo_de_MantenimientoService,
    private ModelosService: ModelosService,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,
    private AeronaveService: AeronaveService,
    private Catalogo_codigo_ATAService: Catalogo_codigo_ATAService,
    private Estatus_de_componenteService: Estatus_de_componenteService,
    private Detalle_Parte_Asociada_ComponentesService: Detalle_Parte_Asociada_ComponentesService,
    private PiezasService: PiezasService,

    private Clasificacion_de_aeronavegabilidadService: Clasificacion_de_aeronavegabilidadService,
    private Detalle_Servicios_Asociados_ComponentesService: Detalle_Servicios_Asociados_ComponentesService,
    private ServiciosService: ServiciosService,


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
    this.model = new Control_de_Componentes(this.fb);
    this.Control_de_ComponentesForm = this.model.buildFormGroup();
    this.Parte_asociadaItems.removeAt(0);
    this.Servicio_asociadoItems.removeAt(0);
	
	this.Control_de_ComponentesForm.get('Folio').disable();
    this.Control_de_ComponentesForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceParte_asociada.paginator = this.paginator;
    this.dataSourceServicio_asociado.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Parte_asociadaColumns.splice(0, 1);
          this.Servicio_asociadoColumns.splice(0, 1);
		
          this.Control_de_ComponentesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Control_de_Componentes)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Control_de_ComponentesForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Control_de_ComponentesForm, 'Numero_de_serie', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Control_de_ComponentesForm, 'Codigo_ATA', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Control_de_ComponentesService.listaSelAll(0, 1, 'Control_de_Componentes.Folio=' + id).toPromise();
	if (result.Control_de_Componentess.length > 0) {
        let fParte_asociada = await this.Detalle_Parte_Asociada_ComponentesService.listaSelAll(0, 1000,'Control_de_Componentes.Folio=' + id).toPromise();
            this.Parte_asociadaData = fParte_asociada.Detalle_Parte_Asociada_Componentess;
            this.loadParte_asociada(fParte_asociada.Detalle_Parte_Asociada_Componentess);
            this.dataSourceParte_asociada = new MatTableDataSource(fParte_asociada.Detalle_Parte_Asociada_Componentess);
            this.dataSourceParte_asociada.paginator = this.paginator;
            this.dataSourceParte_asociada.sort = this.sort;
        let fServicio_asociado = await this.Detalle_Servicios_Asociados_ComponentesService.listaSelAll(0, 1000,'Control_de_Componentes.Folio=' + id).toPromise();
            this.Servicio_asociadoData = fServicio_asociado.Detalle_Servicios_Asociados_Componentess;
            this.loadServicio_asociado(fServicio_asociado.Detalle_Servicios_Asociados_Componentess);
            this.dataSourceServicio_asociado = new MatTableDataSource(fServicio_asociado.Detalle_Servicios_Asociados_Componentess);
            this.dataSourceServicio_asociado.paginator = this.paginator;
            this.dataSourceServicio_asociado.sort = this.sort;
	  
        this.model.fromObject(result.Control_de_Componentess[0]);
        this.Control_de_ComponentesForm.get('Matricula').setValue(
          result.Control_de_Componentess[0].Matricula_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );
        this.Control_de_ComponentesForm.get('Numero_de_serie').setValue(
          result.Control_de_Componentess[0].Numero_de_serie_Aeronave.Numero_de_Serie,
          { onlySelf: false, emitEvent: true }
        );
        this.Control_de_ComponentesForm.get('Codigo_ATA').setValue(
          result.Control_de_Componentess[0].Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        if (this.model.Instrucciones !== null && this.model.Instrucciones !== undefined) {
          this.spartanFileService.getById(this.model.Instrucciones).subscribe(f => {
            this.fileInstrucciones = f;
            this.InstruccionesName = f.Description;
          });
        }

		this.Control_de_ComponentesForm.markAllAsTouched();
		this.Control_de_ComponentesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Parte_asociadaItems() {
    return this.Control_de_ComponentesForm.get('Detalle_Parte_Asociada_ComponentesItems') as FormArray;
  }

  getParte_asociadaColumns(): string[] {
    return this.Parte_asociadaColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadParte_asociada(Parte_asociada: Detalle_Parte_Asociada_Componentes[]) {
    Parte_asociada.forEach(element => {
      this.addParte_asociada(element);
    });
  }

  addParte_asociadaToMR() {
    const Parte_asociada = new Detalle_Parte_Asociada_Componentes(this.fb);
    this.Parte_asociadaData.push(this.addParte_asociada(Parte_asociada));
    this.dataSourceParte_asociada.data = this.Parte_asociadaData;
    Parte_asociada.edit = true;
    Parte_asociada.isNew = true;
    const length = this.dataSourceParte_asociada.data.length;
    const index = length - 1;
    const formParte_asociada = this.Parte_asociadaItems.controls[index] as FormGroup;
	this.addFilterToControlN_de_parte_Detalle_Parte_Asociada_Componentes(formParte_asociada.controls.N_de_parte, index);
	this.addFilterToControlDescripcion_Detalle_Parte_Asociada_Componentes(formParte_asociada.controls.Descripcion, index);
    
    const page = Math.ceil(this.dataSourceParte_asociada.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addParte_asociada(entity: Detalle_Parte_Asociada_Componentes) {
    const Parte_asociada = new Detalle_Parte_Asociada_Componentes(this.fb);
    this.Parte_asociadaItems.push(Parte_asociada.buildFormGroup());
    if (entity) {
      Parte_asociada.fromObject(entity);
    }
	return entity;
  }  

  Parte_asociadaItemsByFolio(Folio: number): FormGroup {
    return (this.Control_de_ComponentesForm.get('Detalle_Parte_Asociada_ComponentesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Parte_asociadaItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceParte_asociada.data.indexOf(element);
	let fb = this.Parte_asociadaItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteParte_asociada(element: any) {
    let index = this.dataSourceParte_asociada.data.indexOf(element);
    this.Parte_asociadaData[index].IsDeleted = true;
    this.dataSourceParte_asociada.data = this.Parte_asociadaData;
    this.dataSourceParte_asociada._updateChangeSubscription();
    index = this.dataSourceParte_asociada.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditParte_asociada(element: any) {
    let index = this.dataSourceParte_asociada.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Parte_asociadaData[index].IsDeleted = true;
      this.dataSourceParte_asociada.data = this.Parte_asociadaData;
      this.dataSourceParte_asociada._updateChangeSubscription();
      index = this.Parte_asociadaData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveParte_asociada(element: any) {
    const index = this.dataSourceParte_asociada.data.indexOf(element);
    const formParte_asociada = this.Parte_asociadaItems.controls[index] as FormGroup;
    if (this.Parte_asociadaData[index].N_de_parte !== formParte_asociada.value.N_de_parte && formParte_asociada.value.N_de_parte > 0) {
		let piezas = await this.PiezasService.getById(formParte_asociada.value.N_de_parte).toPromise();
        this.Parte_asociadaData[index].N_de_parte_Piezas = piezas;
    }
    this.Parte_asociadaData[index].N_de_parte = formParte_asociada.value.N_de_parte;
    if (this.Parte_asociadaData[index].Descripcion !== formParte_asociada.value.Descripcion && formParte_asociada.value.Descripcion > 0) {
		let piezas = await this.PiezasService.getById(formParte_asociada.value.Descripcion).toPromise();
        this.Parte_asociadaData[index].Descripcion_Piezas = piezas;
    }
    this.Parte_asociadaData[index].Descripcion = formParte_asociada.value.Descripcion;
    this.Parte_asociadaData[index].Limite_de_Meses = formParte_asociada.value.Limite_de_Meses;
    this.Parte_asociadaData[index].Limite_de_Horas = formParte_asociada.value.Limite_de_Horas;
    this.Parte_asociadaData[index].Limite_de_ciclos = formParte_asociada.value.Limite_de_ciclos;
	
    this.Parte_asociadaData[index].isNew = false;
    this.dataSourceParte_asociada.data = this.Parte_asociadaData;
    this.dataSourceParte_asociada._updateChangeSubscription();
  }
  
  editParte_asociada(element: any) {
    const index = this.dataSourceParte_asociada.data.indexOf(element);
    const formParte_asociada = this.Parte_asociadaItems.controls[index] as FormGroup;
	this.SelectedN_de_parte_Detalle_Parte_Asociada_Componentes[index] = this.dataSourceParte_asociada.data[index].N_de_parte_Piezas.Descripcion;
    this.addFilterToControlN_de_parte_Detalle_Parte_Asociada_Componentes(formParte_asociada.controls.N_de_parte, index);
	this.SelectedDescripcion_Detalle_Parte_Asociada_Componentes[index] = this.dataSourceParte_asociada.data[index].Descripcion_Piezas.Descripcion;
    this.addFilterToControlDescripcion_Detalle_Parte_Asociada_Componentes(formParte_asociada.controls.Descripcion, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Parte_Asociada_Componentes(Folio: number) {
    this.dataSourceParte_asociada.data.forEach(async (d, index) => {
      const data = this.Parte_asociadaItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Control_de_Componentes = Folio;
	
      
      if (model.Folio === 0) {
        // Add Parte asociada
		let response = await this.Detalle_Parte_Asociada_ComponentesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formParte_asociada = this.Parte_asociadaItemsByFolio(model.Folio);
        if (formParte_asociada.dirty) {
          // Update Parte asociada
          let response = await this.Detalle_Parte_Asociada_ComponentesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Parte asociada
        await this.Detalle_Parte_Asociada_ComponentesService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectN_de_parte_Detalle_Parte_Asociada_Componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceParte_asociada.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_de_parte_Detalle_Parte_Asociada_Componentes[index] = event.option.viewValue;
	let fgr = this.Control_de_ComponentesForm.controls.Detalle_Parte_Asociada_ComponentesItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.N_de_parte.setValue(event.option.value);
    this.displayFnN_de_parte_Detalle_Parte_Asociada_Componentes(element);
  }  
  
  displayFnN_de_parte_Detalle_Parte_Asociada_Componentes(this, element) {
    const index = this.dataSourceParte_asociada.data.indexOf(element);
    return this.SelectedN_de_parte_Detalle_Parte_Asociada_Componentes[index];
  }
  updateOptionN_de_parte_Detalle_Parte_Asociada_Componentes(event, element: any) {
    const index = this.dataSourceParte_asociada.data.indexOf(element);
    this.SelectedN_de_parte_Detalle_Parte_Asociada_Componentes[index] = event.source.viewValue;
  } 

	_filterN_de_parte_Detalle_Parte_Asociada_Componentes(filter: any): Observable<Piezas> {
		const where = filter !== '' ?  "Piezas.Descripcion like '%" + filter + "%'" : '';
		return this.PiezasService.listaSelAll(0, 20, where);
	}

  addFilterToControlN_de_parte_Detalle_Parte_Asociada_Componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_de_parte_Detalle_Parte_Asociada_Componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_de_parte_Detalle_Parte_Asociada_Componentes = true;
        return this._filterN_de_parte_Detalle_Parte_Asociada_Componentes(value || '');
      })
    ).subscribe(result => {
      this.varPiezas = result.Piezass;
      this.isLoadingN_de_parte_Detalle_Parte_Asociada_Componentes = false;
      this.searchN_de_parte_Detalle_Parte_Asociada_ComponentesCompleted = true;
      this.SelectedN_de_parte_Detalle_Parte_Asociada_Componentes[index] = this.varPiezas.length === 0 ? '' : this.SelectedN_de_parte_Detalle_Parte_Asociada_Componentes[index];
    });
  }
  public selectDescripcion_Detalle_Parte_Asociada_Componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceParte_asociada.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedDescripcion_Detalle_Parte_Asociada_Componentes[index] = event.option.viewValue;
	let fgr = this.Control_de_ComponentesForm.controls.Detalle_Parte_Asociada_ComponentesItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Descripcion.setValue(event.option.value);
    this.displayFnDescripcion_Detalle_Parte_Asociada_Componentes(element);
  }  
  
  displayFnDescripcion_Detalle_Parte_Asociada_Componentes(this, element) {
    const index = this.dataSourceParte_asociada.data.indexOf(element);
    return this.SelectedDescripcion_Detalle_Parte_Asociada_Componentes[index];
  }
  updateOptionDescripcion_Detalle_Parte_Asociada_Componentes(event, element: any) {
    const index = this.dataSourceParte_asociada.data.indexOf(element);
    this.SelectedDescripcion_Detalle_Parte_Asociada_Componentes[index] = event.source.viewValue;
  } 

	_filterDescripcion_Detalle_Parte_Asociada_Componentes(filter: any): Observable<Piezas> {
		const where = filter !== '' ?  "Piezas.Descripcion like '%" + filter + "%'" : '';
		return this.PiezasService.listaSelAll(0, 20, where);
	}

  addFilterToControlDescripcion_Detalle_Parte_Asociada_Componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingDescripcion_Detalle_Parte_Asociada_Componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingDescripcion_Detalle_Parte_Asociada_Componentes = true;
        return this._filterDescripcion_Detalle_Parte_Asociada_Componentes(value || '');
      })
    ).subscribe(result => {
      this.varPiezas = result.Piezass;
      this.isLoadingDescripcion_Detalle_Parte_Asociada_Componentes = false;
      this.searchDescripcion_Detalle_Parte_Asociada_ComponentesCompleted = true;
      this.SelectedDescripcion_Detalle_Parte_Asociada_Componentes[index] = this.varPiezas.length === 0 ? '' : this.SelectedDescripcion_Detalle_Parte_Asociada_Componentes[index];
    });
  }

  get Servicio_asociadoItems() {
    return this.Control_de_ComponentesForm.get('Detalle_Servicios_Asociados_ComponentesItems') as FormArray;
  }

  getServicio_asociadoColumns(): string[] {
    return this.Servicio_asociadoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadServicio_asociado(Servicio_asociado: Detalle_Servicios_Asociados_Componentes[]) {
    Servicio_asociado.forEach(element => {
      this.addServicio_asociado(element);
    });
  }

  addServicio_asociadoToMR() {
    const Servicio_asociado = new Detalle_Servicios_Asociados_Componentes(this.fb);
    this.Servicio_asociadoData.push(this.addServicio_asociado(Servicio_asociado));
    this.dataSourceServicio_asociado.data = this.Servicio_asociadoData;
    Servicio_asociado.edit = true;
    Servicio_asociado.isNew = true;
    const length = this.dataSourceServicio_asociado.data.length;
    const index = length - 1;
    const formServicio_asociado = this.Servicio_asociadoItems.controls[index] as FormGroup;
	this.addFilterToControlN_de_servicio_Detalle_Servicios_Asociados_Componentes(formServicio_asociado.controls.N_de_servicio, index);
	this.addFilterToControlDescripcion_Detalle_Servicios_Asociados_Componentes(formServicio_asociado.controls.Descripcion, index);
    
    const page = Math.ceil(this.dataSourceServicio_asociado.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addServicio_asociado(entity: Detalle_Servicios_Asociados_Componentes) {
    const Servicio_asociado = new Detalle_Servicios_Asociados_Componentes(this.fb);
    this.Servicio_asociadoItems.push(Servicio_asociado.buildFormGroup());
    if (entity) {
      Servicio_asociado.fromObject(entity);
    }
	return entity;
  }  

  Servicio_asociadoItemsByFolio(Folio: number): FormGroup {
    return (this.Control_de_ComponentesForm.get('Detalle_Servicios_Asociados_ComponentesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Servicio_asociadoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceServicio_asociado.data.indexOf(element);
	let fb = this.Servicio_asociadoItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteServicio_asociado(element: any) {
    let index = this.dataSourceServicio_asociado.data.indexOf(element);
    this.Servicio_asociadoData[index].IsDeleted = true;
    this.dataSourceServicio_asociado.data = this.Servicio_asociadoData;
    this.dataSourceServicio_asociado._updateChangeSubscription();
    index = this.dataSourceServicio_asociado.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditServicio_asociado(element: any) {
    let index = this.dataSourceServicio_asociado.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Servicio_asociadoData[index].IsDeleted = true;
      this.dataSourceServicio_asociado.data = this.Servicio_asociadoData;
      this.dataSourceServicio_asociado._updateChangeSubscription();
      index = this.Servicio_asociadoData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveServicio_asociado(element: any) {
    const index = this.dataSourceServicio_asociado.data.indexOf(element);
    const formServicio_asociado = this.Servicio_asociadoItems.controls[index] as FormGroup;
    if (this.Servicio_asociadoData[index].N_de_servicio !== formServicio_asociado.value.N_de_servicio && formServicio_asociado.value.N_de_servicio > 0) {
		let servicios = await this.ServiciosService.getById(formServicio_asociado.value.N_de_servicio).toPromise();
        this.Servicio_asociadoData[index].N_de_servicio_Servicios = servicios;
    }
    this.Servicio_asociadoData[index].N_de_servicio = formServicio_asociado.value.N_de_servicio;
    if (this.Servicio_asociadoData[index].Descripcion !== formServicio_asociado.value.Descripcion && formServicio_asociado.value.Descripcion > 0) {
		let servicios = await this.ServiciosService.getById(formServicio_asociado.value.Descripcion).toPromise();
        this.Servicio_asociadoData[index].Descripcion_Servicios = servicios;
    }
    this.Servicio_asociadoData[index].Descripcion = formServicio_asociado.value.Descripcion;
	
    this.Servicio_asociadoData[index].isNew = false;
    this.dataSourceServicio_asociado.data = this.Servicio_asociadoData;
    this.dataSourceServicio_asociado._updateChangeSubscription();
  }
  
  editServicio_asociado(element: any) {
    const index = this.dataSourceServicio_asociado.data.indexOf(element);
    const formServicio_asociado = this.Servicio_asociadoItems.controls[index] as FormGroup;
	this.SelectedN_de_servicio_Detalle_Servicios_Asociados_Componentes[index] = this.dataSourceServicio_asociado.data[index].N_de_servicio_Servicios.Codigo;
    this.addFilterToControlN_de_servicio_Detalle_Servicios_Asociados_Componentes(formServicio_asociado.controls.N_de_servicio, index);
	this.SelectedDescripcion_Detalle_Servicios_Asociados_Componentes[index] = this.dataSourceServicio_asociado.data[index].Descripcion_Servicios.Descripcion;
    this.addFilterToControlDescripcion_Detalle_Servicios_Asociados_Componentes(formServicio_asociado.controls.Descripcion, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Servicios_Asociados_Componentes(Folio: number) {
    this.dataSourceServicio_asociado.data.forEach(async (d, index) => {
      const data = this.Servicio_asociadoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Control_de_Componentes = Folio;
	
      
      if (model.Folio === 0) {
        // Add Servicio asociado
		let response = await this.Detalle_Servicios_Asociados_ComponentesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formServicio_asociado = this.Servicio_asociadoItemsByFolio(model.Folio);
        if (formServicio_asociado.dirty) {
          // Update Servicio asociado
          let response = await this.Detalle_Servicios_Asociados_ComponentesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Servicio asociado
        await this.Detalle_Servicios_Asociados_ComponentesService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectN_de_servicio_Detalle_Servicios_Asociados_Componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceServicio_asociado.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_de_servicio_Detalle_Servicios_Asociados_Componentes[index] = event.option.viewValue;
	let fgr = this.Control_de_ComponentesForm.controls.Detalle_Servicios_Asociados_ComponentesItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.N_de_servicio.setValue(event.option.value);
    this.displayFnN_de_servicio_Detalle_Servicios_Asociados_Componentes(element);
  }  
  
  displayFnN_de_servicio_Detalle_Servicios_Asociados_Componentes(this, element) {
    const index = this.dataSourceServicio_asociado.data.indexOf(element);
    return this.SelectedN_de_servicio_Detalle_Servicios_Asociados_Componentes[index];
  }
  updateOptionN_de_servicio_Detalle_Servicios_Asociados_Componentes(event, element: any) {
    const index = this.dataSourceServicio_asociado.data.indexOf(element);
    this.SelectedN_de_servicio_Detalle_Servicios_Asociados_Componentes[index] = event.source.viewValue;
  } 

	_filterN_de_servicio_Detalle_Servicios_Asociados_Componentes(filter: any): Observable<Servicios> {
		const where = filter !== '' ?  "Servicios.Codigo like '%" + filter + "%'" : '';
		return this.ServiciosService.listaSelAll(0, 20, where);
	}

  addFilterToControlN_de_servicio_Detalle_Servicios_Asociados_Componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_de_servicio_Detalle_Servicios_Asociados_Componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_de_servicio_Detalle_Servicios_Asociados_Componentes = true;
        return this._filterN_de_servicio_Detalle_Servicios_Asociados_Componentes(value || '');
      })
    ).subscribe(result => {
      this.varServicios = result.Servicioss;
      this.isLoadingN_de_servicio_Detalle_Servicios_Asociados_Componentes = false;
      this.searchN_de_servicio_Detalle_Servicios_Asociados_ComponentesCompleted = true;
      this.SelectedN_de_servicio_Detalle_Servicios_Asociados_Componentes[index] = this.varServicios.length === 0 ? '' : this.SelectedN_de_servicio_Detalle_Servicios_Asociados_Componentes[index];
    });
  }
  public selectDescripcion_Detalle_Servicios_Asociados_Componentes(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceServicio_asociado.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedDescripcion_Detalle_Servicios_Asociados_Componentes[index] = event.option.viewValue;
	let fgr = this.Control_de_ComponentesForm.controls.Detalle_Servicios_Asociados_ComponentesItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Descripcion.setValue(event.option.value);
    this.displayFnDescripcion_Detalle_Servicios_Asociados_Componentes(element);
  }  
  
  displayFnDescripcion_Detalle_Servicios_Asociados_Componentes(this, element) {
    const index = this.dataSourceServicio_asociado.data.indexOf(element);
    return this.SelectedDescripcion_Detalle_Servicios_Asociados_Componentes[index];
  }
  updateOptionDescripcion_Detalle_Servicios_Asociados_Componentes(event, element: any) {
    const index = this.dataSourceServicio_asociado.data.indexOf(element);
    this.SelectedDescripcion_Detalle_Servicios_Asociados_Componentes[index] = event.source.viewValue;
  } 

	_filterDescripcion_Detalle_Servicios_Asociados_Componentes(filter: any): Observable<Servicios> {
		const where = filter !== '' ?  "Servicios.Descripcion like '%" + filter + "%'" : '';
		return this.ServiciosService.listaSelAll(0, 20, where);
	}

  addFilterToControlDescripcion_Detalle_Servicios_Asociados_Componentes(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingDescripcion_Detalle_Servicios_Asociados_Componentes = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingDescripcion_Detalle_Servicios_Asociados_Componentes = true;
        return this._filterDescripcion_Detalle_Servicios_Asociados_Componentes(value || '');
      })
    ).subscribe(result => {
      this.varServicios = result.Servicioss;
      this.isLoadingDescripcion_Detalle_Servicios_Asociados_Componentes = false;
      this.searchDescripcion_Detalle_Servicios_Asociados_ComponentesCompleted = true;
      this.SelectedDescripcion_Detalle_Servicios_Asociados_Componentes[index] = this.varServicios.length === 0 ? '' : this.SelectedDescripcion_Detalle_Servicios_Asociados_Componentes[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Control_de_ComponentesForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Modulo_de_MantenimientoService.getAll());
    observablesArray.push(this.ModelosService.getAll());
    observablesArray.push(this.Codigo_ComputarizadoService.getAll());
    observablesArray.push(this.Estatus_de_componenteService.getAll());

    observablesArray.push(this.Clasificacion_de_aeronavegabilidadService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varModulo_de_Mantenimiento , varModelos , varCodigo_Computarizado , varEstatus_de_componente  , varClasificacion_de_aeronavegabilidad  ]) => {
          this.varModulo_de_Mantenimiento = varModulo_de_Mantenimiento;
          this.varModelos = varModelos;
          this.varCodigo_Computarizado = varCodigo_Computarizado;
          this.varEstatus_de_componente = varEstatus_de_componente;

          this.varClasificacion_de_aeronavegabilidad = varClasificacion_de_aeronavegabilidad;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Control_de_ComponentesForm.get('Matricula').valueChanges.pipe(
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
	  this.Control_de_ComponentesForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
	  this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Control_de_ComponentesForm.get('Numero_de_serie').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNumero_de_serie = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeronaveService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeronaveService.listaSelAll(0, 20, '');
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Numero_de_Serie like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeronaveService.listaSelAll(0, 20,
          "Aeronave.Numero_de_Serie like '%" + value.Numero_de_Serie.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNumero_de_serie = false;
      this.hasOptionsNumero_de_serie = result?.Aeronaves?.length > 0;
	  this.Control_de_ComponentesForm.get('Numero_de_serie').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
	  this.optionsNumero_de_serie = of(result?.Aeronaves);
    }, error => {
      this.isLoadingNumero_de_serie = false;
      this.hasOptionsNumero_de_serie = false;
      this.optionsNumero_de_serie = of([]);
    });
    this.Control_de_ComponentesForm.get('Codigo_ATA').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCodigo_ATA = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Catalogo_codigo_ATAService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Catalogo_codigo_ATAService.listaSelAll(0, 20, '');
          return this.Catalogo_codigo_ATAService.listaSelAll(0, 20,
            "Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Catalogo_codigo_ATAService.listaSelAll(0, 20,
          "Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + value.Codigo_ATA_Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCodigo_ATA = false;
      this.hasOptionsCodigo_ATA = result?.Catalogo_codigo_ATAs?.length > 0;
	  this.Control_de_ComponentesForm.get('Codigo_ATA').setValue(result?.Catalogo_codigo_ATAs[0], { onlySelf: true, emitEvent: false });
	  this.optionsCodigo_ATA = of(result?.Catalogo_codigo_ATAs);
    }, error => {
      this.isLoadingCodigo_ATA = false;
      this.hasOptionsCodigo_ATA = false;
      this.optionsCodigo_ATA = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Id_Mantenimiento': {
        this.Modulo_de_MantenimientoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varModulo_de_Mantenimiento = x.Modulo_de_Mantenimientos;
        });
        break;
      }
      case 'Modelo_de_aeronave': {
        this.ModelosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varModelos = x.Modeloss;
        });
        break;
      }
      case 'Codigo_computarizado': {
        this.Codigo_ComputarizadoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCodigo_Computarizado = x.Codigo_Computarizados;
        });
        break;
      }
      case 'Estatus_de_componente': {
        this.Estatus_de_componenteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_componente = x.Estatus_de_componentes;
        });
        break;
      }

      case 'Clasificacion_de_aeronavegabilidad': {
        this.Clasificacion_de_aeronavegabilidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varClasificacion_de_aeronavegabilidad = x.Clasificacion_de_aeronavegabilidads;
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
displayFnNumero_de_serie(option: Aeronave) {
    return option?.Numero_de_Serie;
  }
displayFnCodigo_ATA(option: Catalogo_codigo_ATA) {
    return option?.Codigo_ATA_Descripcion;
  }

  async saveInstrucciones(): Promise<number> {
    if (this.Control_de_ComponentesForm.controls.InstruccionesFile.valid
      && this.Control_de_ComponentesForm.controls.InstruccionesFile.dirty) {
      const Instrucciones = this.Control_de_ComponentesForm.controls.InstruccionesFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Instrucciones);
      const spartanFile = {
        File: byteArray,
        Description: Instrucciones.name,
        Date_Time: Instrucciones.lastModifiedDate,
        File_Size: Instrucciones.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Instrucciones > 0 ? this.model.Instrucciones : 0;
    }
  }
  
  InstruccionesUrl() {
    if (this.fileInstrucciones)
      return this.spartanFileService.url(this.fileInstrucciones.File_Id.toString(), this.fileInstrucciones.Description);
    return '#';
  }  
  
  getInstrucciones() {
    this.helperService.dowloadFile(this.fileInstrucciones.base64, this.InstruccionesName);
  }
  
  removeInstrucciones() {
    this.InstruccionesName = '';
    this.model.Instrucciones = 0;
  }

  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Control_de_ComponentesForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Control_de_ComponentesForm.get('Matricula').value.Matricula;
      entity.Numero_de_serie = this.Control_de_ComponentesForm.get('Numero_de_serie').value.Matricula;
      entity.Codigo_ATA = this.Control_de_ComponentesForm.get('Codigo_ATA').value.Folio;
	  	  
      const FolioInstrucciones = await this.saveInstrucciones();
      entity.Instrucciones = FolioInstrucciones > 0 ? FolioInstrucciones : null;	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Control_de_ComponentesService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Parte_Asociada_Componentes(this.model.Folio);  
        await this.saveDetalle_Servicios_Asociados_Componentes(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Control_de_ComponentesService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Parte_Asociada_Componentes(id);
          await this.saveDetalle_Servicios_Asociados_Componentes(id);

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
      this.Control_de_ComponentesForm.reset();
      this.model = new Control_de_Componentes(this.fb);
      this.Control_de_ComponentesForm = this.model.buildFormGroup();
      this.dataSourceParte_asociada = new MatTableDataSource<Detalle_Parte_Asociada_Componentes>();
      this.Parte_asociadaData = [];
      this.dataSourceServicio_asociado = new MatTableDataSource<Detalle_Servicios_Asociados_Componentes>();
      this.Servicio_asociadoData = [];

    } else {
      this.router.navigate(['views/Control_de_Componentes/add']);
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
    this.router.navigate(['/Control_de_Componentes/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Id_Mantenimiento_ExecuteBusinessRules(): void {
        //Id_Mantenimiento_FieldExecuteBusinessRulesEnd
    }
    Modelo_de_aeronave_ExecuteBusinessRules(): void {
        //Modelo_de_aeronave_FieldExecuteBusinessRulesEnd
    }
    Codigo_computarizado_ExecuteBusinessRules(): void {
        //Codigo_computarizado_FieldExecuteBusinessRulesEnd
    }
    Matricula_ExecuteBusinessRules(): void {
        //Matricula_FieldExecuteBusinessRulesEnd
    }
    Numero_de_serie_ExecuteBusinessRules(): void {
        //Numero_de_serie_FieldExecuteBusinessRulesEnd
    }
    Capitulo_en_el_manual_ExecuteBusinessRules(): void {
        //Capitulo_en_el_manual_FieldExecuteBusinessRulesEnd
    }
    Codigo_ATA_ExecuteBusinessRules(): void {
        //Codigo_ATA_FieldExecuteBusinessRulesEnd
    }
    Descripcion_de_actividad_ExecuteBusinessRules(): void {
        //Descripcion_de_actividad_FieldExecuteBusinessRulesEnd
    }
    Estatus_de_componente_ExecuteBusinessRules(): void {
        //Estatus_de_componente_FieldExecuteBusinessRulesEnd
    }
    Tiempo_de_ejecucion_ExecuteBusinessRules(): void {
        //Tiempo_de_ejecucion_FieldExecuteBusinessRulesEnd
    }
    Velocidad_en_nudos_ExecuteBusinessRules(): void {
        //Velocidad_en_nudos_FieldExecuteBusinessRulesEnd
    }
    Color_de_la_cubierta_ExecuteBusinessRules(): void {
        //Color_de_la_cubierta_FieldExecuteBusinessRulesEnd
    }
    Color_de_la_aeronave_ExecuteBusinessRules(): void {
        //Color_de_la_aeronave_FieldExecuteBusinessRulesEnd
    }
    Clasificacion_de_aeronavegabilidad_ExecuteBusinessRules(): void {
        //Clasificacion_de_aeronavegabilidad_FieldExecuteBusinessRulesEnd
    }
    Instrucciones_ExecuteBusinessRules(): void {
        //Instrucciones_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:186 - NO REQUERIDOS CONTROL DE COMPONENTES - Autor: Felipe Rodríguez - Actualización: 2/6/2021 11:30:48 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Folio");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Modelo_de_aeronave");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Codigo_computarizado");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Capitulo_en_el_manual");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Codigo_ATA");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Descripcion_de_actividad");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Estatus_de_componente");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Tiempo_de_ejecucion");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Folio");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "IdComponente");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "N_de_parte");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Descripcion");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Limite_de_meses");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Limite_de_horas");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Limite_de_ciclos");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Folio");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "IdComponente");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "N_de_servicio");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Descripcion");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Clasificacion_de_aeronavegabilidad");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Instrucciones");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Matricula");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Numero_de_serie");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Velocidad_en_nudos");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Color_de_la_cubierta");this.brf.SetNotRequiredControl(this.Control_de_ComponentesForm, "Color_de_la_aeronave");
} 
//TERMINA - BRID:186

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
