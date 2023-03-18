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
import { Cierre_de_VueloService } from 'src/app/api-services/Cierre_de_Vuelo.service';
import { Cierre_de_Vuelo } from 'src/app/models/Cierre_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { Detalle_Cierre_TripulacionService } from 'src/app/api-services/Detalle_Cierre_Tripulacion.service';
import { Detalle_Cierre_Tripulacion } from 'src/app/models/Detalle_Cierre_Tripulacion';
import { Cargo_de_TripulanteService } from 'src/app/api-services/Cargo_de_Tripulante.service';
import { Cargo_de_Tripulante } from 'src/app/models/Cargo_de_Tripulante';
import { TripulacionService } from 'src/app/api-services/Tripulacion.service';
import { Tripulacion } from 'src/app/models/Tripulacion';

import { Detalle_Cierre_PasajerosService } from 'src/app/api-services/Detalle_Cierre_Pasajeros.service';
import { Detalle_Cierre_Pasajeros } from 'src/app/models/Detalle_Cierre_Pasajeros';
import { PasajerosService } from 'src/app/api-services/Pasajeros.service';
import { Pasajeros } from 'src/app/models/Pasajeros';


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
  selector: 'app-Cierre_de_Vuelo',
  templateUrl: './Cierre_de_Vuelo.component.html',
  styleUrls: ['./Cierre_de_Vuelo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Cierre_de_VueloComponent implements OnInit, AfterViewInit {
MRaddPasajeros: boolean = false;
MRaddTripulacion: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Cierre_de_VueloForm: FormGroup;
	public Editor = ClassicEditor;
	model: Cierre_de_Vuelo;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
	hasOptionsNumero_de_Vuelo: boolean;
	isLoadingNumero_de_Vuelo: boolean;
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;
	optionsTramo_de_Vuelo: Observable<Registro_de_vuelo[]>;
	hasOptionsTramo_de_Vuelo: boolean;
	isLoadingTramo_de_Vuelo: boolean;
	optionsOrigen: Observable<Aeropuertos[]>;
	hasOptionsOrigen: boolean;
	isLoadingOrigen: boolean;
	optionsDestino: Observable<Aeropuertos[]>;
	hasOptionsDestino: boolean;
	isLoadingDestino: boolean;
	public varRespuesta: Respuesta[] = [];
	public varCargo_de_Tripulante: Cargo_de_Tripulante[] = [];
	public varTripulacion: Tripulacion[] = [];

  autoTripulante_Detalle_Cierre_Tripulacion = new FormControl();
  SelectedTripulante_Detalle_Cierre_Tripulacion: string[] = [];
  isLoadingTripulante_Detalle_Cierre_Tripulacion: boolean;
  searchTripulante_Detalle_Cierre_TripulacionCompleted: boolean;

	public varPasajeros: Pasajeros[] = [];

  autoPasajero_Detalle_Cierre_Pasajeros = new FormControl();
  SelectedPasajero_Detalle_Cierre_Pasajeros: string[] = [];
  isLoadingPasajero_Detalle_Cierre_Pasajeros: boolean;
  searchPasajero_Detalle_Cierre_PasajerosCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceTripulacion = new MatTableDataSource<Detalle_Cierre_Tripulacion>();
  TripulacionColumns = [
    { def: 'actions', hide: false },
    { def: 'Cargo', hide: false },
    { def: 'Tripulante', hide: false },
	
  ];
  TripulacionData: Detalle_Cierre_Tripulacion[] = [];
  dataSourcePasajeros = new MatTableDataSource<Detalle_Cierre_Pasajeros>();
  PasajerosColumns = [
    { def: 'actions', hide: false },
    { def: 'Pasajero', hide: false },
    { def: 'PasajeroEjecucionId', hide: false },
	
  ];
  PasajerosData: Detalle_Cierre_Pasajeros[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Cierre_de_VueloService: Cierre_de_VueloService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeronaveService: AeronaveService,
    private Registro_de_vueloService: Registro_de_vueloService,
    private AeropuertosService: AeropuertosService,
    private RespuestaService: RespuestaService,
    private Detalle_Cierre_TripulacionService: Detalle_Cierre_TripulacionService,
    private Cargo_de_TripulanteService: Cargo_de_TripulanteService,
    private TripulacionService: TripulacionService,

    private Detalle_Cierre_PasajerosService: Detalle_Cierre_PasajerosService,
    private PasajerosService: PasajerosService,


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
    this.model = new Cierre_de_Vuelo(this.fb);
    this.Cierre_de_VueloForm = this.model.buildFormGroup();
    this.TripulacionItems.removeAt(0);
    this.PasajerosItems.removeAt(0);
	
	this.Cierre_de_VueloForm.get('Folio').disable();
    this.Cierre_de_VueloForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceTripulacion.paginator = this.paginator;
    this.dataSourcePasajeros.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.TripulacionColumns.splice(0, 1);
          this.PasajerosColumns.splice(0, 1);
		
          this.Cierre_de_VueloForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Cierre_de_Vuelo)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Cierre_de_VueloForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Cierre_de_VueloForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Cierre_de_VueloForm, 'Tramo_de_Vuelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Cierre_de_VueloForm, 'Origen', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Cierre_de_VueloForm, 'Destino', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Cierre_de_VueloService.listaSelAll(0, 1, 'Cierre_de_Vuelo.Folio=' + id).toPromise();
	if (result.Cierre_de_Vuelos.length > 0) {
        let fTripulacion = await this.Detalle_Cierre_TripulacionService.listaSelAll(0, 1000,'Cierre_de_Vuelo.Folio=' + id).toPromise();
            this.TripulacionData = fTripulacion.Detalle_Cierre_Tripulacions;
            this.loadTripulacion(fTripulacion.Detalle_Cierre_Tripulacions);
            this.dataSourceTripulacion = new MatTableDataSource(fTripulacion.Detalle_Cierre_Tripulacions);
            this.dataSourceTripulacion.paginator = this.paginator;
            this.dataSourceTripulacion.sort = this.sort;
        let fPasajeros = await this.Detalle_Cierre_PasajerosService.listaSelAll(0, 1000,'Cierre_de_Vuelo.Folio=' + id).toPromise();
            this.PasajerosData = fPasajeros.Detalle_Cierre_Pasajeross;
            this.loadPasajeros(fPasajeros.Detalle_Cierre_Pasajeross);
            this.dataSourcePasajeros = new MatTableDataSource(fPasajeros.Detalle_Cierre_Pasajeross);
            this.dataSourcePasajeros.paginator = this.paginator;
            this.dataSourcePasajeros.sort = this.sort;
	  
        this.model.fromObject(result.Cierre_de_Vuelos[0]);
        this.Cierre_de_VueloForm.get('Numero_de_Vuelo').setValue(
          result.Cierre_de_Vuelos[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
          { onlySelf: false, emitEvent: true }
        );
        this.Cierre_de_VueloForm.get('Matricula').setValue(
          result.Cierre_de_Vuelos[0].Matricula_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );
        this.Cierre_de_VueloForm.get('Tramo_de_Vuelo').setValue(
          result.Cierre_de_Vuelos[0].Tramo_de_Vuelo_Registro_de_vuelo.Numero_de_Tramo,
          { onlySelf: false, emitEvent: true }
        );
        this.Cierre_de_VueloForm.get('Origen').setValue(
          result.Cierre_de_Vuelos[0].Origen_Aeropuertos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Cierre_de_VueloForm.get('Destino').setValue(
          result.Cierre_de_Vuelos[0].Destino_Aeropuertos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );

		this.Cierre_de_VueloForm.markAllAsTouched();
		this.Cierre_de_VueloForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get TripulacionItems() {
    return this.Cierre_de_VueloForm.get('Detalle_Cierre_TripulacionItems') as FormArray;
  }

  getTripulacionColumns(): string[] {
    return this.TripulacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadTripulacion(Tripulacion: Detalle_Cierre_Tripulacion[]) {
    Tripulacion.forEach(element => {
      this.addTripulacion(element);
    });
  }

  addTripulacionToMR() {
    const Tripulacion = new Detalle_Cierre_Tripulacion(this.fb);
    this.TripulacionData.push(this.addTripulacion(Tripulacion));
    this.dataSourceTripulacion.data = this.TripulacionData;
    Tripulacion.edit = true;
    Tripulacion.isNew = true;
    const length = this.dataSourceTripulacion.data.length;
    const index = length - 1;
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
	this.addFilterToControlTripulante_Detalle_Cierre_Tripulacion(formTripulacion.controls.Tripulante, index);
    
    const page = Math.ceil(this.dataSourceTripulacion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addTripulacion(entity: Detalle_Cierre_Tripulacion) {
    const Tripulacion = new Detalle_Cierre_Tripulacion(this.fb);
    this.TripulacionItems.push(Tripulacion.buildFormGroup());
    if (entity) {
      Tripulacion.fromObject(entity);
    }
	return entity;
  }  

  TripulacionItemsByFolio(Folio: number): FormGroup {
    return (this.Cierre_de_VueloForm.get('Detalle_Cierre_TripulacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  TripulacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceTripulacion.data.indexOf(element);
	let fb = this.TripulacionItems.controls[index] as FormGroup;
    return fb;
  }  

  
  closeWindowCancel():void{
    window.close();
  }
  closeWindowSave():void{
    setTimeout(()=>{ window.close();}, 2000);
  }

  deleteTripulacion(element: any) {
    let index = this.dataSourceTripulacion.data.indexOf(element);
    this.TripulacionData[index].IsDeleted = true;
    this.dataSourceTripulacion.data = this.TripulacionData;
    this.dataSourceTripulacion._updateChangeSubscription();
    index = this.dataSourceTripulacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditTripulacion(element: any) {
    let index = this.dataSourceTripulacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.TripulacionData[index].IsDeleted = true;
      this.dataSourceTripulacion.data = this.TripulacionData;
      this.dataSourceTripulacion._updateChangeSubscription();
      index = this.TripulacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveTripulacion(element: any) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
    this.TripulacionData[index].Cargo = formTripulacion.value.Cargo;
    this.TripulacionData[index].Cargo_Cargo_de_Tripulante = formTripulacion.value.Cargo !== '' ?
     this.varCargo_de_Tripulante.filter(d => d.Clave === formTripulacion.value.Cargo)[0] : null ;	
    if (this.TripulacionData[index].Tripulante !== formTripulacion.value.Tripulante && formTripulacion.value.Tripulante > 0) {
		let tripulacion = await this.TripulacionService.getById(formTripulacion.value.Tripulante).toPromise();
        this.TripulacionData[index].Tripulante_Tripulacion = tripulacion;
    }
    this.TripulacionData[index].Tripulante = formTripulacion.value.Tripulante;
	
    this.TripulacionData[index].isNew = false;
    this.dataSourceTripulacion.data = this.TripulacionData;
    this.dataSourceTripulacion._updateChangeSubscription();
  }
  
  editTripulacion(element: any) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
	this.SelectedTripulante_Detalle_Cierre_Tripulacion[index] = this.dataSourceTripulacion.data[index].Tripulante_Tripulacion.Nombre_completo;
    this.addFilterToControlTripulante_Detalle_Cierre_Tripulacion(formTripulacion.controls.Tripulante, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Cierre_Tripulacion(Folio: number) {
    this.dataSourceTripulacion.data.forEach(async (d, index) => {
      const data = this.TripulacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Cierre_de_Vuelo = Folio;
	
      
      if (model.Folio === 0) {
        // Add Tripulación
		let response = await this.Detalle_Cierre_TripulacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formTripulacion = this.TripulacionItemsByFolio(model.Folio);
        if (formTripulacion.dirty) {
          // Update Tripulación
          let response = await this.Detalle_Cierre_TripulacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Tripulación
        await this.Detalle_Cierre_TripulacionService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectTripulante_Detalle_Cierre_Tripulacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedTripulante_Detalle_Cierre_Tripulacion[index] = event.option.viewValue;
	let fgr = this.Cierre_de_VueloForm.controls.Detalle_Cierre_TripulacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Tripulante.setValue(event.option.value);
    this.displayFnTripulante_Detalle_Cierre_Tripulacion(element);
  }  
  
  displayFnTripulante_Detalle_Cierre_Tripulacion(this, element) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    return this.SelectedTripulante_Detalle_Cierre_Tripulacion[index];
  }
  updateOptionTripulante_Detalle_Cierre_Tripulacion(event, element: any) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    this.SelectedTripulante_Detalle_Cierre_Tripulacion[index] = event.source.viewValue;
  } 

	_filterTripulante_Detalle_Cierre_Tripulacion(filter: any): Observable<Tripulacion> {
		const where = filter !== '' ?  "Tripulacion.Nombre_completo like '%" + filter + "%'" : '';
		return this.TripulacionService.listaSelAll(0, 20, where);
	}

  addFilterToControlTripulante_Detalle_Cierre_Tripulacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingTripulante_Detalle_Cierre_Tripulacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingTripulante_Detalle_Cierre_Tripulacion = true;
        return this._filterTripulante_Detalle_Cierre_Tripulacion(value || '');
      })
    ).subscribe(result => {
      this.varTripulacion = result.Tripulacions;
      this.isLoadingTripulante_Detalle_Cierre_Tripulacion = false;
      this.searchTripulante_Detalle_Cierre_TripulacionCompleted = true;
      this.SelectedTripulante_Detalle_Cierre_Tripulacion[index] = this.varTripulacion.length === 0 ? '' : this.SelectedTripulante_Detalle_Cierre_Tripulacion[index];
    });
  }

  get PasajerosItems() {
    return this.Cierre_de_VueloForm.get('Detalle_Cierre_PasajerosItems') as FormArray;
  }

  getPasajerosColumns(): string[] {
    return this.PasajerosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPasajeros(Pasajeros: Detalle_Cierre_Pasajeros[]) {
    Pasajeros.forEach(element => {
      this.addPasajeros(element);
    });
  }

  addPasajerosToMR() {
    const Pasajeros = new Detalle_Cierre_Pasajeros(this.fb);
    this.PasajerosData.push(this.addPasajeros(Pasajeros));
    this.dataSourcePasajeros.data = this.PasajerosData;
    Pasajeros.edit = true;
    Pasajeros.isNew = true;
    const length = this.dataSourcePasajeros.data.length;
    const index = length - 1;
    const formPasajeros = this.PasajerosItems.controls[index] as FormGroup;
	this.addFilterToControlPasajero_Detalle_Cierre_Pasajeros(formPasajeros.controls.Pasajero, index);
    
    const page = Math.ceil(this.dataSourcePasajeros.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addPasajeros(entity: Detalle_Cierre_Pasajeros) {
    const Pasajeros = new Detalle_Cierre_Pasajeros(this.fb);
    this.PasajerosItems.push(Pasajeros.buildFormGroup());
    if (entity) {
      Pasajeros.fromObject(entity);
    }
	return entity;
  }  

  PasajerosItemsByFolio(Folio: number): FormGroup {
    return (this.Cierre_de_VueloForm.get('Detalle_Cierre_PasajerosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  PasajerosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePasajeros.data.indexOf(element);
	let fb = this.PasajerosItems.controls[index] as FormGroup;
    return fb;
  }  

  deletePasajeros(element: any) {
    let index = this.dataSourcePasajeros.data.indexOf(element);
    this.PasajerosData[index].IsDeleted = true;
    this.dataSourcePasajeros.data = this.PasajerosData;
    this.dataSourcePasajeros._updateChangeSubscription();
    index = this.dataSourcePasajeros.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditPasajeros(element: any) {
    let index = this.dataSourcePasajeros.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.PasajerosData[index].IsDeleted = true;
      this.dataSourcePasajeros.data = this.PasajerosData;
      this.dataSourcePasajeros._updateChangeSubscription();
      index = this.PasajerosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async savePasajeros(element: any) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    const formPasajeros = this.PasajerosItems.controls[index] as FormGroup;
    if (this.PasajerosData[index].Pasajero !== formPasajeros.value.Pasajero && formPasajeros.value.Pasajero > 0) {
		let pasajeros = await this.PasajerosService.getById(formPasajeros.value.Pasajero).toPromise();
        this.PasajerosData[index].Pasajero_Pasajeros = pasajeros;
    }
    this.PasajerosData[index].Pasajero = formPasajeros.value.Pasajero;
    this.PasajerosData[index].PasajeroEjecucionId = formPasajeros.value.PasajeroEjecucionId;
	
    this.PasajerosData[index].isNew = false;
    this.dataSourcePasajeros.data = this.PasajerosData;
    this.dataSourcePasajeros._updateChangeSubscription();
  }
  
  editPasajeros(element: any) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    const formPasajeros = this.PasajerosItems.controls[index] as FormGroup;
	this.SelectedPasajero_Detalle_Cierre_Pasajeros[index] = this.dataSourcePasajeros.data[index].Pasajero_Pasajeros.Nombre_completo;
    this.addFilterToControlPasajero_Detalle_Cierre_Pasajeros(formPasajeros.controls.Pasajero, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Cierre_Pasajeros(Folio: number) {
    this.dataSourcePasajeros.data.forEach(async (d, index) => {
      const data = this.PasajerosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Cierre_de_Vuelo = Folio;
	
      
      if (model.Folio === 0) {
        // Add Pasajeros
		let response = await this.Detalle_Cierre_PasajerosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPasajeros = this.PasajerosItemsByFolio(model.Folio);
        if (formPasajeros.dirty) {
          // Update Pasajeros
          let response = await this.Detalle_Cierre_PasajerosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Pasajeros
        await this.Detalle_Cierre_PasajerosService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectPasajero_Detalle_Cierre_Pasajeros(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedPasajero_Detalle_Cierre_Pasajeros[index] = event.option.viewValue;
	let fgr = this.Cierre_de_VueloForm.controls.Detalle_Cierre_PasajerosItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Pasajero.setValue(event.option.value);
    this.displayFnPasajero_Detalle_Cierre_Pasajeros(element);
  }  
  
  displayFnPasajero_Detalle_Cierre_Pasajeros(this, element) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    return this.SelectedPasajero_Detalle_Cierre_Pasajeros[index];
  }
  updateOptionPasajero_Detalle_Cierre_Pasajeros(event, element: any) {
    const index = this.dataSourcePasajeros.data.indexOf(element);
    this.SelectedPasajero_Detalle_Cierre_Pasajeros[index] = event.source.viewValue;
  } 

	_filterPasajero_Detalle_Cierre_Pasajeros(filter: any): Observable<Pasajeros> {
		const where = filter !== '' ?  "Pasajeros.Nombre_completo like '%" + filter + "%'" : '';
		return this.PasajerosService.listaSelAll(0, 20, where);
	}

  addFilterToControlPasajero_Detalle_Cierre_Pasajeros(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingPasajero_Detalle_Cierre_Pasajeros = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingPasajero_Detalle_Cierre_Pasajeros = true;
        return this._filterPasajero_Detalle_Cierre_Pasajeros(value || '');
      })
    ).subscribe(result => {
      this.varPasajeros = result.Pasajeross;
      this.isLoadingPasajero_Detalle_Cierre_Pasajeros = false;
      this.searchPasajero_Detalle_Cierre_PasajerosCompleted = true;
      this.SelectedPasajero_Detalle_Cierre_Pasajeros[index] = this.varPasajeros.length === 0 ? '' : this.SelectedPasajero_Detalle_Cierre_Pasajeros[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Cierre_de_VueloForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.RespuestaService.getAll());
    observablesArray.push(this.Cargo_de_TripulanteService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varRespuesta , varCargo_de_Tripulante   ]) => {
          this.varRespuesta = varRespuesta;
          this.varCargo_de_Tripulante = varCargo_de_Tripulante;



          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Cierre_de_VueloForm.get('Numero_de_Vuelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNumero_de_Vuelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
          return this.Solicitud_de_VueloService.listaSelAll(0, 20,
            "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Solicitud_de_VueloService.listaSelAll(0, 20,
          "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.Numero_de_Vuelo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = result?.Solicitud_de_Vuelos?.length > 0;
	  this.Cierre_de_VueloForm.get('Numero_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
	  this.optionsNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = false;
      this.optionsNumero_de_Vuelo = of([]);
    });
    this.Cierre_de_VueloForm.get('Matricula').valueChanges.pipe(
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
	  this.Cierre_de_VueloForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
	  this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Cierre_de_VueloForm.get('Tramo_de_Vuelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingTramo_de_Vuelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Registro_de_vueloService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Registro_de_vueloService.listaSelAll(0, 20, '');
          return this.Registro_de_vueloService.listaSelAll(0, 20,
            "Registro_de_vuelo.Numero_de_Tramo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Registro_de_vueloService.listaSelAll(0, 20,
          "Registro_de_vuelo.Numero_de_Tramo like '%" + value.Numero_de_Tramo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingTramo_de_Vuelo = false;
      this.hasOptionsTramo_de_Vuelo = result?.Registro_de_vuelos?.length > 0;
	  this.Cierre_de_VueloForm.get('Tramo_de_Vuelo').setValue(result?.Registro_de_vuelos[0], { onlySelf: true, emitEvent: false });
	  this.optionsTramo_de_Vuelo = of(result?.Registro_de_vuelos);
    }, error => {
      this.isLoadingTramo_de_Vuelo = false;
      this.hasOptionsTramo_de_Vuelo = false;
      this.optionsTramo_de_Vuelo = of([]);
    });
    this.Cierre_de_VueloForm.get('Origen').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingOrigen = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingOrigen = false;
      this.hasOptionsOrigen = result?.Aeropuertoss?.length > 0;
	  this.Cierre_de_VueloForm.get('Origen').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
	  this.optionsOrigen = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingOrigen = false;
      this.hasOptionsOrigen = false;
      this.optionsOrigen = of([]);
    });
    this.Cierre_de_VueloForm.get('Destino').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingDestino = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingDestino = false;
      this.hasOptionsDestino = result?.Aeropuertoss?.length > 0;
	  this.Cierre_de_VueloForm.get('Destino').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
	  this.optionsDestino = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingDestino = false;
      this.hasOptionsDestino = false;
      this.optionsDestino = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'cerrar_vuelo': {
        this.RespuestaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRespuesta = x.Respuestas;
        });
        break;
      }
      case 'Cargo': {
        this.Cargo_de_TripulanteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCargo_de_Tripulante = x.Cargo_de_Tripulantes;
        });
        break;
      }



      default: {
        break;
      }
    }
  }

displayFnNumero_de_Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }
displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
displayFnTramo_de_Vuelo(option: Registro_de_vuelo) {
    return option?.Numero_de_Tramo;
  }
displayFnOrigen(option: Aeropuertos) {
    return option?.Descripcion;
  }
displayFnDestino(option: Aeropuertos) {
    return option?.Descripcion;
  }


  async save() {
    await this.saveData();
    if(this.localStorageHelper.getItemFromLocalStorage("Cierre_de_VueloWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Cierre_de_VueloWindowsFloat", "0");
      window.close();
    }
    else{
      this.goToList();
    }
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Cierre_de_VueloForm.value;
      entity.Folio = this.model.Folio;
      entity.Numero_de_Vuelo = this.Cierre_de_VueloForm.get('Numero_de_Vuelo').value.Folio;
      entity.Matricula = this.Cierre_de_VueloForm.get('Matricula').value.Matricula;
      entity.Tramo_de_Vuelo = this.Cierre_de_VueloForm.get('Tramo_de_Vuelo').value.Folio;
      entity.Origen = this.Cierre_de_VueloForm.get('Origen').value.Aeropuerto_ID;
      entity.Destino = this.Cierre_de_VueloForm.get('Destino').value.Aeropuerto_ID;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Cierre_de_VueloService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Cierre_Tripulacion(this.model.Folio);  
        await this.saveDetalle_Cierre_Pasajeros(this.model.Folio);  
        this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Cierre_de_VueloService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Cierre_Tripulacion(id);
          await this.saveDetalle_Cierre_Pasajeros(id);
          this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
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
      this.Cierre_de_VueloForm.reset();
      this.model = new Cierre_de_Vuelo(this.fb);
      this.Cierre_de_VueloForm = this.model.buildFormGroup();
      this.dataSourceTripulacion = new MatTableDataSource<Detalle_Cierre_Tripulacion>();
      this.TripulacionData = [];
      this.dataSourcePasajeros = new MatTableDataSource<Detalle_Cierre_Pasajeros>();
      this.PasajerosData = [];

    } else {
      this.router.navigate(['views/Cierre_de_Vuelo/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }
  
  cancel() {
    if(this.localStorageHelper.getItemFromLocalStorage("Cierre_de_VueloWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Cierre_de_VueloWindowsFloat", "0");
      window.close();
    }
    else{
      this.goToList();
    }
  }

  goToList() {
    this.router.navigate(['/Cierre_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Numero_de_Vuelo_ExecuteBusinessRules(): void {
        //Numero_de_Vuelo_FieldExecuteBusinessRulesEnd
    }
    Matricula_ExecuteBusinessRules(): void {
        //Matricula_FieldExecuteBusinessRulesEnd
    }
    Solicitud_ExecuteBusinessRules(): void {
        //Solicitud_FieldExecuteBusinessRulesEnd
    }
    Tramo_de_Vuelo_ExecuteBusinessRules(): void {
        //Tramo_de_Vuelo_FieldExecuteBusinessRulesEnd
    }
    Origen_ExecuteBusinessRules(): void {
        //Origen_FieldExecuteBusinessRulesEnd
    }
    Destino_ExecuteBusinessRules(): void {
        //Destino_FieldExecuteBusinessRulesEnd
    }
    Fecha_Salida_ExecuteBusinessRules(): void {
        //Fecha_Salida_FieldExecuteBusinessRulesEnd
    }
    Hora_Salida_ExecuteBusinessRules(): void {
        //Hora_Salida_FieldExecuteBusinessRulesEnd
    }
    Fecha_Despegue_ExecuteBusinessRules(): void {
        //Fecha_Despegue_FieldExecuteBusinessRulesEnd
    }
    Hora_Despegue_ExecuteBusinessRules(): void {
        //Hora_Despegue_FieldExecuteBusinessRulesEnd
    }
    Fecha_Aterrizaje_ExecuteBusinessRules(): void {
        //Fecha_Aterrizaje_FieldExecuteBusinessRulesEnd
    }
    Hora_Aterrizaje_ExecuteBusinessRules(): void {
        //Hora_Aterrizaje_FieldExecuteBusinessRulesEnd
    }
    Fecha_Llegada_ExecuteBusinessRules(): void {
        //Fecha_Llegada_FieldExecuteBusinessRulesEnd
    }
    Hora_Llegada_ExecuteBusinessRules(): void {
        //Hora_Llegada_FieldExecuteBusinessRulesEnd
    }
    Pasajeros_Adicionales_ExecuteBusinessRules(): void {
        //Pasajeros_Adicionales_FieldExecuteBusinessRulesEnd
    }
    Combustible_Inicial_ExecuteBusinessRules(): void {
        //Combustible_Inicial_FieldExecuteBusinessRulesEnd
    }
    Cumbustible_Final_Consumido_ExecuteBusinessRules(): void {
        //Cumbustible_Final_Consumido_FieldExecuteBusinessRulesEnd
    }
    Combustible_Total_Consumido_ExecuteBusinessRules(): void {
        //Combustible_Total_Consumido_FieldExecuteBusinessRulesEnd
    }
    Notas_de_Tramo_ExecuteBusinessRules(): void {
        //Notas_de_Tramo_FieldExecuteBusinessRulesEnd
    }
    cerrar_vuelo_ExecuteBusinessRules(): void {
        //cerrar_vuelo_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:1884 - En nuevo ocultar numero de vuelo. - Autor: Lizeth Villa - Actualización: 3/22/2021 4:09:48 PM
if(  this.operation == 'New' ) {
this.brf.SetNotRequiredControl(this.Cierre_de_VueloForm, "Numero_de_Vuelo"); this.brf.HideFieldOfForm(this.Cierre_de_VueloForm, "Numero_de_Vuelo"); this.brf.SetNotRequiredControl(this.Cierre_de_VueloForm, "Numero_de_Vuelo");
} 
//TERMINA - BRID:1884


//INICIA - BRID:1905 - Al nuevo y modificacion filtrar tramo de vuelo. - Autor: Ivan Yañez - Actualización: 3/24/2021 10:19:41 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {

} 
//TERMINA - BRID:1905


//INICIA - BRID:2229 - al editaral abir pantalla, deshabilitar todos los campos de la pestaña datos generales. - Autor: Ivan Yañez - Actualización: 3/30/2021 4:09:49 PM
if(  this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Matricula', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Tramo_de_Vuelo', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Origen', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Destino', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Fecha_Salida', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Hora_Salida', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Fecha_Llegada', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Hora_Llegada', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Fecha_Despegue', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Hora_Despegue', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Fecha_Aterrizaje', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Hora_Aterrizaje', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Pasajeros_Adicionales', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Combustible_Inicial', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Cumbustible_Final_Consumido', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Combustible_Total_Consumido', 0); this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Solicitud', 0); this.brf.SetNotRequiredControl(this.Cierre_de_VueloForm, "Notas_de_Tramo"); this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Numero_de_Vuelo', 0);
} 
//TERMINA - BRID:2229


//INICIA - BRID:2625 - Ocultar Folio siempre,, - Autor: Lizeth Villa - Actualización: 4/7/2021 10:24:40 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Cierre_de_VueloForm, "Folio"); this.brf.SetNotRequiredControl(this.Cierre_de_VueloForm, "Folio");
} 
//TERMINA - BRID:2625


//INICIA - BRID:2794 - 1.- En el MR de Pasajeros ocultar siempre la columna PasajeroEjecucionId y no obligatoria. - Autor: Felipe Rodríguez - Actualización: 4/27/2021 9:26:48 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldofMultirenglon(this.PasajerosColumns,"PasajeroEjecucionId"); this.brf.SetNotRequiredControl(this.Cierre_de_VueloForm, "PasajeroEjecucionId");
} 
//TERMINA - BRID:2794


//INICIA - BRID:2796 - 2.- En nuevo, modificar y consulta- ocultar folio y número de vuelo- deshabilitar matricula, solicitud, tramo de vuelo, origen, destino - Autor: Felipe Rodríguez - Actualización: 4/23/2021 11:47:42 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Cierre_de_VueloForm, "Folio"); this.brf.SetNotRequiredControl(this.Cierre_de_VueloForm, "Folio");this.brf.HideFieldOfForm(this.Cierre_de_VueloForm, "Numero_de_Vuelo"); this.brf.SetNotRequiredControl(this.Cierre_de_VueloForm, "Numero_de_Vuelo"); this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Matricula', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Solicitud', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Tramo_de_Vuelo', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Origen', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Destino', 0);
} 
//TERMINA - BRID:2796


//INICIA - BRID:2833 - si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje con código manual, no desactivar. - Autor: Administrador - Actualización: 5/3/2021 4:35:41 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
if( this.brf.EvaluaQuery("SELECT COUNT(*) from Solicitud_de_Vuelo where folio = GLOBAL[SpartanOperationId] and estatus = 9	", 1, 'ABC123')==this.brf.TryParseInt('1', '1') && this.brf.EvaluaQuery("if ( GLOBAL[USERROLEID]= 1 or GLOBAL[USERROLEID]= 9 ) begin select 1 end	", 1, 'ABC123')!=this.brf.TryParseInt('1', '1') ) { this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Folio', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Numero_de_Vuelo', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Matricula', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Solicitud', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Tramo_de_Vuelo', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Origen', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Destino', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Fecha_Salida', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Folio', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Cierre_de_Vuelo', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Cargo', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Tripulante', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Folio', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Cierre_de_Vuelo', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Pasajero', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Hora_Salida', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Fecha_Llegada', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Hora_Llegada', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Fecha_Despegue', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Hora_Despegue', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Fecha_Aterrizaje', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Hora_Aterrizaje', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Pasajeros_Adicionales', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Combustible_Inicial', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Cumbustible_Final_Consumido', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Combustible_Total_Consumido', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'cerrar_vuelo', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'Notas_de_Tramo', 0);this.brf.SetEnabledControl(this.Cierre_de_VueloForm, 'PasajeroEjecucionId', 0);   this.brf.ShowMessage(" El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar");} else {}
} 
//TERMINA - BRID:2833

//rulesOnInit_ExecuteBusinessRulesEnd







  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:1883 - En nuevo, despues de guardar asignar numero de vuelo - Autor: Lizeth Villa - Actualización: 3/22/2021 4:08:31 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery("update Cierre_de_Vuelo set Numero_de_Vuelo= GLOBAL[SpartanOperationId] where Folio=GLOBAL[keyvalueinserted]", 1, "ABC123");
} 
//TERMINA - BRID:1883


//INICIA - BRID:2234 - despues de guardar , si el campo "Desea cerrar el vuelo"="SI". actualizar el estatus de la solicitud de vuelo a cerrado - Autor: Ivan Yañez - Actualización: 3/30/2021 3:53:52 PM
if(  this.operation == 'Update' ) {
if( this.brf.EvaluaQuery("select FLD[cerrar_vuelo]", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.EvaluaQuery("update Solicitud_de_Vuelo@LC@@LB@ set Estatus=9@LC@@LB@ where Folio=GLOBAL[SpartanOperationId]", 1, "ABC123");} else {}
} 
//TERMINA - BRID:2234


//INICIA - BRID:2797 - 3.- En nuevo, despues de  guardar ejecutar el query: exec uspCalcularPasajerosAdicionalesTramo GLOBAL[keyvalueinserted] - Autor: Felipe Rodríguez - Actualización: 4/27/2021 9:27:47 AM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery("exec uspCalcularPasajerosAdicionalesTramo GLOBAL[keyvalueinserted]", 1, "ABC123");
} 
//TERMINA - BRID:2797


//INICIA - BRID:2798 - 4.- En modificar, despues de guardar ejecutar el query: exec uspCalcularPasajerosAdicionalesTramo FLDD[lblFolio] - Autor: Felipe Rodríguez - Actualización: 4/23/2021 9:42:19 AM
if(  this.operation == 'Update' ) {
this.brf.EvaluaQuery("exec uspCalcularPasajerosAdicionalesTramo FLDD[lblFolio]", 1, "ABC123");
} 
//TERMINA - BRID:2798


//INICIA - BRID:2799 - 5.- Después de guardar, en modificar, si el campo cerrar vuelo = SI entonces ejecutar el siguiente query:exec uspCierraVuelo FLDD[lblFolio] - Autor: Felipe Rodríguez - Actualización: 4/23/2021 9:46:19 AM
if(  this.operation == 'Update' ) {
if( this.brf.GetValueByControlType(this.Cierre_de_VueloForm, 'cerrar_vuelo')==this.brf.TryParseInt('1', '1') ) { this.brf.EvaluaQuery(" exec uspCierraVuelo FLDD[lblFolio]", 1, "ABC123");} else {}
} 
//TERMINA - BRID:2799

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
