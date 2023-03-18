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
import { Filtros_de_reportesService } from 'src/app/api-services/Filtros_de_reportes.service';
import { Filtros_de_reportes } from 'src/app/models/Filtros_de_reportes';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Tipo_de_GrupoService } from 'src/app/api-services/Tipo_de_Grupo.service';
import { Tipo_de_Grupo } from 'src/app/models/Tipo_de_Grupo';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { PasajerosService } from 'src/app/api-services/Pasajeros.service';
import { Pasajeros } from 'src/app/models/Pasajeros';
import { TripulacionService } from 'src/app/api-services/Tripulacion.service';
import { Tripulacion } from 'src/app/models/Tripulacion';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';

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
  selector: 'app-Filtros_de_reportes',
  templateUrl: './Filtros_de_reportes.component.html',
  styleUrls: ['./Filtros_de_reportes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Filtros_de_reportesComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Filtros_de_reportesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Filtros_de_reportes;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsAeronaves: Observable<Aeronave[]>;
	hasOptionsAeronaves: boolean;
	isLoadingAeronaves: boolean;
	optionsMostrar_Aeronave: Observable<Tipo_de_Grupo[]>;
	hasOptionsMostrar_Aeronave: boolean;
	isLoadingMostrar_Aeronave: boolean;
	optionsClientes: Observable<Cliente[]>;
	hasOptionsClientes: boolean;
	isLoadingClientes: boolean;
	optionsMostrar_Cliente: Observable<Tipo_de_Grupo[]>;
	hasOptionsMostrar_Cliente: boolean;
	isLoadingMostrar_Cliente: boolean;
	optionsPasajeros: Observable<Pasajeros[]>;
	hasOptionsPasajeros: boolean;
	isLoadingPasajeros: boolean;
	optionsMostrar_Pasajero: Observable<Tipo_de_Grupo[]>;
	hasOptionsMostrar_Pasajero: boolean;
	isLoadingMostrar_Pasajero: boolean;
	optionsPilotos: Observable<Tripulacion[]>;
	hasOptionsPilotos: boolean;
	isLoadingPilotos: boolean;
	optionsMostrar_Piloto: Observable<Tipo_de_Grupo[]>;
	hasOptionsMostrar_Piloto: boolean;
	isLoadingMostrar_Piloto: boolean;
	optionsAeropuerto: Observable<Aeropuertos[]>;
	hasOptionsAeropuerto: boolean;
	isLoadingAeropuerto: boolean;
	optionsAeropuerto_Destino: Observable<Aeropuertos[]>;
	hasOptionsAeropuerto_Destino: boolean;
	isLoadingAeropuerto_Destino: boolean;

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
    private Filtros_de_reportesService: Filtros_de_reportesService,
    private AeronaveService: AeronaveService,
    private Tipo_de_GrupoService: Tipo_de_GrupoService,
    private ClienteService: ClienteService,
    private PasajerosService: PasajerosService,
    private TripulacionService: TripulacionService,
    private AeropuertosService: AeropuertosService,

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
    this.model = new Filtros_de_reportes(this.fb);
    this.Filtros_de_reportesForm = this.model.buildFormGroup();
	
	this.Filtros_de_reportesForm.get('Folio').disable();
    this.Filtros_de_reportesForm.get('Folio').setValue('Auto');
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
		
          this.Filtros_de_reportesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Filtros_de_reportes)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Aeronaves', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Mostrar_Aeronave', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Clientes', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Mostrar_Cliente', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Pasajeros', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Mostrar_Pasajero', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Pilotos', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Mostrar_Piloto', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Aeropuerto', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Filtros_de_reportesForm, 'Aeropuerto_Destino', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Filtros_de_reportesService.listaSelAll(0, 1, 'Filtros_de_reportes.Folio=' + id).toPromise();
	if (result.Filtros_de_reportess.length > 0) {
	  
        this.model.fromObject(result.Filtros_de_reportess[0]);
        this.Filtros_de_reportesForm.get('Aeronaves').setValue(
          result.Filtros_de_reportess[0].Aeronaves_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );
        this.Filtros_de_reportesForm.get('Mostrar_Aeronave').setValue(
          result.Filtros_de_reportess[0].Mostrar_Aeronave_Tipo_de_Grupo.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Filtros_de_reportesForm.get('Clientes').setValue(
          result.Filtros_de_reportess[0].Clientes_Cliente.Razon_Social,
          { onlySelf: false, emitEvent: true }
        );
        this.Filtros_de_reportesForm.get('Mostrar_Cliente').setValue(
          result.Filtros_de_reportess[0].Mostrar_Cliente_Tipo_de_Grupo.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Filtros_de_reportesForm.get('Pasajeros').setValue(
          result.Filtros_de_reportess[0].Pasajeros_Pasajeros.Nombre_completo,
          { onlySelf: false, emitEvent: true }
        );
        this.Filtros_de_reportesForm.get('Mostrar_Pasajero').setValue(
          result.Filtros_de_reportess[0].Mostrar_Pasajero_Tipo_de_Grupo.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Filtros_de_reportesForm.get('Pilotos').setValue(
          result.Filtros_de_reportess[0].Pilotos_Tripulacion.Nombre_completo,
          { onlySelf: false, emitEvent: true }
        );
        this.Filtros_de_reportesForm.get('Mostrar_Piloto').setValue(
          result.Filtros_de_reportess[0].Mostrar_Piloto_Tipo_de_Grupo.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Filtros_de_reportesForm.get('Aeropuerto').setValue(
          result.Filtros_de_reportess[0].Aeropuerto_Aeropuertos.Nombre,
          { onlySelf: false, emitEvent: true }
        );
        this.Filtros_de_reportesForm.get('Aeropuerto_Destino').setValue(
          result.Filtros_de_reportess[0].Aeropuerto_Destino_Aeropuertos.Nombre,
          { onlySelf: false, emitEvent: true }
        );

		this.Filtros_de_reportesForm.markAllAsTouched();
		this.Filtros_de_reportesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Filtros_de_reportesForm.disabled ? "Update" : this.operation;
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

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([]) => {

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Filtros_de_reportesForm.get('Aeronaves').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAeronaves = true),
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
      this.isLoadingAeronaves = false;
      this.hasOptionsAeronaves = result?.Aeronaves?.length > 0;
	  this.Filtros_de_reportesForm.get('Aeronaves').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
	  this.optionsAeronaves = of(result?.Aeronaves);
    }, error => {
      this.isLoadingAeronaves = false;
      this.hasOptionsAeronaves = false;
      this.optionsAeronaves = of([]);
    });
    this.Filtros_de_reportesForm.get('Mostrar_Aeronave').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMostrar_Aeronave = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Tipo_de_GrupoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Tipo_de_GrupoService.listaSelAll(0, 20, '');
          return this.Tipo_de_GrupoService.listaSelAll(0, 20,
            "Tipo_de_Grupo.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Tipo_de_GrupoService.listaSelAll(0, 20,
          "Tipo_de_Grupo.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMostrar_Aeronave = false;
      this.hasOptionsMostrar_Aeronave = result?.Tipo_de_Grupos?.length > 0;
	  this.Filtros_de_reportesForm.get('Mostrar_Aeronave').setValue(result?.Tipo_de_Grupos[0], { onlySelf: true, emitEvent: false });
	  this.optionsMostrar_Aeronave = of(result?.Tipo_de_Grupos);
    }, error => {
      this.isLoadingMostrar_Aeronave = false;
      this.hasOptionsMostrar_Aeronave = false;
      this.optionsMostrar_Aeronave = of([]);
    });
    this.Filtros_de_reportesForm.get('Clientes').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingClientes = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.ClienteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.ClienteService.listaSelAll(0, 20, '');
          return this.ClienteService.listaSelAll(0, 20,
            "Cliente.Razon_Social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.ClienteService.listaSelAll(0, 20,
          "Cliente.Razon_Social like '%" + value.Razon_Social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingClientes = false;
      this.hasOptionsClientes = result?.Clientes?.length > 0;
	  this.Filtros_de_reportesForm.get('Clientes').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });
	  this.optionsClientes = of(result?.Clientes);
    }, error => {
      this.isLoadingClientes = false;
      this.hasOptionsClientes = false;
      this.optionsClientes = of([]);
    });
    this.Filtros_de_reportesForm.get('Mostrar_Cliente').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMostrar_Cliente = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Tipo_de_GrupoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Tipo_de_GrupoService.listaSelAll(0, 20, '');
          return this.Tipo_de_GrupoService.listaSelAll(0, 20,
            "Tipo_de_Grupo.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Tipo_de_GrupoService.listaSelAll(0, 20,
          "Tipo_de_Grupo.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMostrar_Cliente = false;
      this.hasOptionsMostrar_Cliente = result?.Tipo_de_Grupos?.length > 0;
	  this.Filtros_de_reportesForm.get('Mostrar_Cliente').setValue(result?.Tipo_de_Grupos[0], { onlySelf: true, emitEvent: false });
	  this.optionsMostrar_Cliente = of(result?.Tipo_de_Grupos);
    }, error => {
      this.isLoadingMostrar_Cliente = false;
      this.hasOptionsMostrar_Cliente = false;
      this.optionsMostrar_Cliente = of([]);
    });
    this.Filtros_de_reportesForm.get('Pasajeros').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPasajeros = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PasajerosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PasajerosService.listaSelAll(0, 20, '');
          return this.PasajerosService.listaSelAll(0, 20,
            "Pasajeros.Nombre_completo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PasajerosService.listaSelAll(0, 20,
          "Pasajeros.Nombre_completo like '%" + value.Nombre_completo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPasajeros = false;
      this.hasOptionsPasajeros = result?.Pasajeross?.length > 0;
	  this.Filtros_de_reportesForm.get('Pasajeros').setValue(result?.Pasajeross[0], { onlySelf: true, emitEvent: false });
	  this.optionsPasajeros = of(result?.Pasajeross);
    }, error => {
      this.isLoadingPasajeros = false;
      this.hasOptionsPasajeros = false;
      this.optionsPasajeros = of([]);
    });
    this.Filtros_de_reportesForm.get('Mostrar_Pasajero').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMostrar_Pasajero = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Tipo_de_GrupoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Tipo_de_GrupoService.listaSelAll(0, 20, '');
          return this.Tipo_de_GrupoService.listaSelAll(0, 20,
            "Tipo_de_Grupo.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Tipo_de_GrupoService.listaSelAll(0, 20,
          "Tipo_de_Grupo.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMostrar_Pasajero = false;
      this.hasOptionsMostrar_Pasajero = result?.Tipo_de_Grupos?.length > 0;
	  this.Filtros_de_reportesForm.get('Mostrar_Pasajero').setValue(result?.Tipo_de_Grupos[0], { onlySelf: true, emitEvent: false });
	  this.optionsMostrar_Pasajero = of(result?.Tipo_de_Grupos);
    }, error => {
      this.isLoadingMostrar_Pasajero = false;
      this.hasOptionsMostrar_Pasajero = false;
      this.optionsMostrar_Pasajero = of([]);
    });
    this.Filtros_de_reportesForm.get('Pilotos').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPilotos = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.TripulacionService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.TripulacionService.listaSelAll(0, 20, '');
          return this.TripulacionService.listaSelAll(0, 20,
            "Tripulacion.Nombre_completo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.TripulacionService.listaSelAll(0, 20,
          "Tripulacion.Nombre_completo like '%" + value.Nombre_completo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPilotos = false;
      this.hasOptionsPilotos = result?.Tripulacions?.length > 0;
	  this.Filtros_de_reportesForm.get('Pilotos').setValue(result?.Tripulacions[0], { onlySelf: true, emitEvent: false });
	  this.optionsPilotos = of(result?.Tripulacions);
    }, error => {
      this.isLoadingPilotos = false;
      this.hasOptionsPilotos = false;
      this.optionsPilotos = of([]);
    });
    this.Filtros_de_reportesForm.get('Mostrar_Piloto').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMostrar_Piloto = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Tipo_de_GrupoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Tipo_de_GrupoService.listaSelAll(0, 20, '');
          return this.Tipo_de_GrupoService.listaSelAll(0, 20,
            "Tipo_de_Grupo.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Tipo_de_GrupoService.listaSelAll(0, 20,
          "Tipo_de_Grupo.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMostrar_Piloto = false;
      this.hasOptionsMostrar_Piloto = result?.Tipo_de_Grupos?.length > 0;
	  this.Filtros_de_reportesForm.get('Mostrar_Piloto').setValue(result?.Tipo_de_Grupos[0], { onlySelf: true, emitEvent: false });
	  this.optionsMostrar_Piloto = of(result?.Tipo_de_Grupos);
    }, error => {
      this.isLoadingMostrar_Piloto = false;
      this.hasOptionsMostrar_Piloto = false;
      this.optionsMostrar_Piloto = of([]);
    });
    this.Filtros_de_reportesForm.get('Aeropuerto').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAeropuerto = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingAeropuerto = false;
      this.hasOptionsAeropuerto = result?.Aeropuertoss?.length > 0;
	  this.Filtros_de_reportesForm.get('Aeropuerto').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
	  this.optionsAeropuerto = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingAeropuerto = false;
      this.hasOptionsAeropuerto = false;
      this.optionsAeropuerto = of([]);
    });
    this.Filtros_de_reportesForm.get('Aeropuerto_Destino').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAeropuerto_Destino = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeropuertosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeropuertosService.listaSelAll(0, 20, '');
          return this.AeropuertosService.listaSelAll(0, 20,
            "Aeropuertos.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeropuertosService.listaSelAll(0, 20,
          "Aeropuertos.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingAeropuerto_Destino = false;
      this.hasOptionsAeropuerto_Destino = result?.Aeropuertoss?.length > 0;
	  this.Filtros_de_reportesForm.get('Aeropuerto_Destino').setValue(result?.Aeropuertoss[0], { onlySelf: true, emitEvent: false });
	  this.optionsAeropuerto_Destino = of(result?.Aeropuertoss);
    }, error => {
      this.isLoadingAeropuerto_Destino = false;
      this.hasOptionsAeropuerto_Destino = false;
      this.optionsAeropuerto_Destino = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

displayFnAeronaves(option: Aeronave) {
    return option?.Matricula;
  }
displayFnMostrar_Aeronave(option: Tipo_de_Grupo) {
    return option?.Descripcion;
  }
displayFnClientes(option: Cliente) {
    return option?.Razon_Social;
  }
displayFnMostrar_Cliente(option: Tipo_de_Grupo) {
    return option?.Descripcion;
  }
displayFnPasajeros(option: Pasajeros) {
    return option?.Nombre_completo;
  }
displayFnMostrar_Pasajero(option: Tipo_de_Grupo) {
    return option?.Descripcion;
  }
displayFnPilotos(option: Tripulacion) {
    return option?.Nombre_completo;
  }
displayFnMostrar_Piloto(option: Tipo_de_Grupo) {
    return option?.Descripcion;
  }
displayFnAeropuerto(option: Aeropuertos) {
    return option?.Nombre;
  }
displayFnAeropuerto_Destino(option: Aeropuertos) {
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
      const entity = this.Filtros_de_reportesForm.value;
      entity.Folio = this.model.Folio;
      entity.Aeronaves = this.Filtros_de_reportesForm.get('Aeronaves').value.Matricula;
      entity.Mostrar_Aeronave = this.Filtros_de_reportesForm.get('Mostrar_Aeronave').value.Clave;
      entity.Clientes = this.Filtros_de_reportesForm.get('Clientes').value.Clave;
      entity.Mostrar_Cliente = this.Filtros_de_reportesForm.get('Mostrar_Cliente').value.Clave;
      entity.Pasajeros = this.Filtros_de_reportesForm.get('Pasajeros').value.Clave;
      entity.Mostrar_Pasajero = this.Filtros_de_reportesForm.get('Mostrar_Pasajero').value.Clave;
      entity.Pilotos = this.Filtros_de_reportesForm.get('Pilotos').value.Clave;
      entity.Mostrar_Piloto = this.Filtros_de_reportesForm.get('Mostrar_Piloto').value.Clave;
      entity.Aeropuerto = this.Filtros_de_reportesForm.get('Aeropuerto').value.Aeropuerto_ID;
      entity.Aeropuerto_Destino = this.Filtros_de_reportesForm.get('Aeropuerto_Destino').value.Aeropuerto_ID;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Filtros_de_reportesService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Filtros_de_reportesService.insert(entity).toPromise().then(async id => {

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
      this.Filtros_de_reportesForm.reset();
      this.model = new Filtros_de_reportes(this.fb);
      this.Filtros_de_reportesForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Filtros_de_reportes/add']);
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
    this.router.navigate(['/Filtros_de_reportes/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Fecha_ExecuteBusinessRules(): void {
        //Fecha_FieldExecuteBusinessRulesEnd
    }
    Aeronaves_ExecuteBusinessRules(): void {
        //Aeronaves_FieldExecuteBusinessRulesEnd
    }
    Imprimir_solo_aeronaves_activas_ExecuteBusinessRules(): void {
        //Imprimir_solo_aeronaves_activas_FieldExecuteBusinessRulesEnd
    }
    Mostrar_Aeronave_ExecuteBusinessRules(): void {
        //Mostrar_Aeronave_FieldExecuteBusinessRulesEnd
    }
    Clientes_ExecuteBusinessRules(): void {
        //Clientes_FieldExecuteBusinessRulesEnd
    }
    Imprimir_solo_clientes_activos_ExecuteBusinessRules(): void {
        //Imprimir_solo_clientes_activos_FieldExecuteBusinessRulesEnd
    }
    Mostrar_Cliente_ExecuteBusinessRules(): void {
        //Mostrar_Cliente_FieldExecuteBusinessRulesEnd
    }
    Pasajeros_ExecuteBusinessRules(): void {
        //Pasajeros_FieldExecuteBusinessRulesEnd
    }
    Imprimir_solo_pasajeros_activos_ExecuteBusinessRules(): void {
        //Imprimir_solo_pasajeros_activos_FieldExecuteBusinessRulesEnd
    }
    Mostrar_Pasajero_ExecuteBusinessRules(): void {
        //Mostrar_Pasajero_FieldExecuteBusinessRulesEnd
    }
    Pilotos_ExecuteBusinessRules(): void {
        //Pilotos_FieldExecuteBusinessRulesEnd
    }
    Imprimir_solo_pilotos_activos_ExecuteBusinessRules(): void {
        //Imprimir_solo_pilotos_activos_FieldExecuteBusinessRulesEnd
    }
    Mostrar_Piloto_ExecuteBusinessRules(): void {
        //Mostrar_Piloto_FieldExecuteBusinessRulesEnd
    }
    Vuelos_como_capitan_o_primer_oficial_ExecuteBusinessRules(): void {
        //Vuelos_como_capitan_o_primer_oficial_FieldExecuteBusinessRulesEnd
    }
    Aeropuerto_ExecuteBusinessRules(): void {
        //Aeropuerto_FieldExecuteBusinessRulesEnd
    }
    Aeropuerto_Destino_ExecuteBusinessRules(): void {
        //Aeropuerto_Destino_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:5005 - cliente filter text - Autor: Yamir - Actualización: 8/20/2021 11:41:46 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {

} 
//TERMINA - BRID:5005

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
