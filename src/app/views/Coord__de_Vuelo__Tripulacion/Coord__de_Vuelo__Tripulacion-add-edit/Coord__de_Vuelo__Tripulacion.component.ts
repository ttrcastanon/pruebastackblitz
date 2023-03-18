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
import { Coord__de_Vuelo__TripulacionService } from 'src/app/api-services/Coord__de_Vuelo__Tripulacion.service';
import { Coord__de_Vuelo__Tripulacion } from 'src/app/models/Coord__de_Vuelo__Tripulacion';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Detalle_Coord_TripulacionService } from 'src/app/api-services/Detalle_Coord_Tripulacion.service';
import { Detalle_Coord_Tripulacion } from 'src/app/models/Detalle_Coord_Tripulacion';
import { TripulacionService } from 'src/app/api-services/Tripulacion.service';
import { Tripulacion } from 'src/app/models/Tripulacion';
import { Estatus_de_ConfirmacionService } from 'src/app/api-services/Estatus_de_Confirmacion.service';
import { Estatus_de_Confirmacion } from 'src/app/models/Estatus_de_Confirmacion';

import { Detalle_Coord_Tripulacion_ReservacionesService } from 'src/app/api-services/Detalle_Coord_Tripulacion_Reservaciones.service';
import { Detalle_Coord_Tripulacion_Reservaciones } from 'src/app/models/Detalle_Coord_Tripulacion_Reservaciones';
import { Tipo_de_HospedajeService } from 'src/app/api-services/Tipo_de_Hospedaje.service';
import { Tipo_de_Hospedaje } from 'src/app/models/Tipo_de_Hospedaje';

import { Detalle_Coord_Tripulacion_TransportacionService } from 'src/app/api-services/Detalle_Coord_Tripulacion_Transportacion.service';
import { Detalle_Coord_Tripulacion_Transportacion } from 'src/app/models/Detalle_Coord_Tripulacion_Transportacion';
import { Tipo_de_TransportacionService } from 'src/app/api-services/Tipo_de_Transportacion.service';
import { Tipo_de_Transportacion } from 'src/app/models/Tipo_de_Transportacion';


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
import { SpartanQueryDictionary } from 'src/app/models/spartan-query-dictionary';

@Component({
  selector: 'app-Coord__de_Vuelo__Tripulacion',
  templateUrl: './Coord__de_Vuelo__Tripulacion.component.html',
  styleUrls: ['./Coord__de_Vuelo__Tripulacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Coord__de_Vuelo__TripulacionComponent implements OnInit, AfterViewInit {
MRaddTransportacion: boolean = false;
MRaddReservaciones: boolean = false;
MRaddTripulacion: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Coord__de_Vuelo__TripulacionForm: FormGroup;
	public Editor = ClassicEditor;
	model: Coord__de_Vuelo__Tripulacion;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
	hasOptionsNumero_de_Vuelo: boolean;
	isLoadingNumero_de_Vuelo: boolean;
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;
	public varTripulacion: Tripulacion[] = [];
	public varEstatus_de_Confirmacion: Estatus_de_Confirmacion[] = [];

  optionsTripulacionFiltered: Observable<SpartanQueryDictionary[]>;
  optionsTripulacion: SpartanQueryDictionary[] = [];

  auto_Tripulante_Detalle_Coord_Tripulacion = new FormControl();
  Selected_Tripulante_Detalle_Coord_Tripulacion: string[] = [];
  isLoading_Tripulante_Detalle_Coord_Tripulacion: boolean;
  search_Tripulante_Detalle_Coord_TripulacionCompleted: boolean;

	public varTipo_de_Hospedaje: Tipo_de_Hospedaje[] = [];


	public varTipo_de_Transportacion: Tipo_de_Transportacion[] = [];



	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceTripulacion = new MatTableDataSource<Detalle_Coord_Tripulacion>();
  TripulacionColumns = [
    { def: 'actions', hide: false },
    { def: '_Tripulante', hide: false },
    { def: 'Comisariato', hide: false },
    { def: 'Fecha_de_Solicitud', hide: false },
    { def: 'No_Solicitud', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'Confirmado_por_Correo', hide: false },
    { def: 'Confirmado_por_Telefono', hide: false },
    { def: 'Confirmado', hide: false },
	
  ];
  TripulacionData: Detalle_Coord_Tripulacion[] = [];
  dataSourceReservaciones = new MatTableDataSource<Detalle_Coord_Tripulacion_Reservaciones>();
  ReservacionesColumns = [
    { def: 'actions', hide: false },
    { def: 'Hospedaje', hide: false },
    { def: 'Nombre_del_Hotel', hide: false },
    { def: 'Telefono', hide: false },
    { def: 'Numero_de_Confirmacion', hide: false },
    { def: 'Confirmado_por_Correo', hide: false },
    { def: 'Confirmado_por_Telefono', hide: false },
    { def: 'Confirmado', hide: false },
	
  ];
  ReservacionesData: Detalle_Coord_Tripulacion_Reservaciones[] = [];
  dataSourceTransportacion = new MatTableDataSource<Detalle_Coord_Tripulacion_Transportacion>();
  TransportacionColumns = [
    { def: 'actions', hide: false },
    { def: 'Transportacion', hide: false },
    { def: 'Especificaciones', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'Telefono', hide: false },
    { def: 'Numero_de_Confirmacion', hide: false },
    { def: 'Confirmado', hide: false },
	
  ];
  TransportacionData: Detalle_Coord_Tripulacion_Transportacion[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Coord__de_Vuelo__TripulacionService: Coord__de_Vuelo__TripulacionService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeronaveService: AeronaveService,
    private Detalle_Coord_TripulacionService: Detalle_Coord_TripulacionService,
    private TripulacionService: TripulacionService,
    private Estatus_de_ConfirmacionService: Estatus_de_ConfirmacionService,

    private Detalle_Coord_Tripulacion_ReservacionesService: Detalle_Coord_Tripulacion_ReservacionesService,
    private Tipo_de_HospedajeService: Tipo_de_HospedajeService,

    private Detalle_Coord_Tripulacion_TransportacionService: Detalle_Coord_Tripulacion_TransportacionService,
    private Tipo_de_TransportacionService: Tipo_de_TransportacionService,


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
    this.model = new Coord__de_Vuelo__Tripulacion(this.fb);
    this.Coord__de_Vuelo__TripulacionForm = this.model.buildFormGroup();
    this.TripulacionItems.removeAt(0);
    this.ReservacionesItems.removeAt(0);
    this.TransportacionItems.removeAt(0);
	
	this.Coord__de_Vuelo__TripulacionForm.get('Folio').disable();
    this.Coord__de_Vuelo__TripulacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceTripulacion.paginator = this.paginator;
    this.dataSourceReservaciones.paginator = this.paginator;
    this.dataSourceTransportacion.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.TripulacionColumns.splice(0, 1);
          this.ReservacionesColumns.splice(0, 1);
          this.TransportacionColumns.splice(0, 1);
		
          this.Coord__de_Vuelo__TripulacionForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Coord__de_Vuelo__Tripulacion)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Coord__de_Vuelo__TripulacionForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Coord__de_Vuelo__TripulacionForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	 
  this.getTripulacion(); 

  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Coord__de_Vuelo__TripulacionService.listaSelAll(0, 1, 'Coord__de_Vuelo__Tripulacion.Folio=' + id).toPromise();
	if (result.Coord__de_Vuelo__Tripulacions.length > 0) {
        let fTripulacion = await this.Detalle_Coord_TripulacionService.listaSelAll(0, 1000,'Coord__de_Vuelo__Tripulacion.Folio=' + id).toPromise();
            this.TripulacionData = fTripulacion.Detalle_Coord_Tripulacions;
            this.loadTripulacion(fTripulacion.Detalle_Coord_Tripulacions);
            this.dataSourceTripulacion = new MatTableDataSource(fTripulacion.Detalle_Coord_Tripulacions);
            this.dataSourceTripulacion.paginator = this.paginator;
            this.dataSourceTripulacion.sort = this.sort;
        let fReservaciones = await this.Detalle_Coord_Tripulacion_ReservacionesService.listaSelAll(0, 1000,'Coord__de_Vuelo__Tripulacion.Folio=' + id).toPromise();
            this.ReservacionesData = fReservaciones.Detalle_Coord_Tripulacion_Reservacioness;
            this.loadReservaciones(fReservaciones.Detalle_Coord_Tripulacion_Reservacioness);
            this.dataSourceReservaciones = new MatTableDataSource(fReservaciones.Detalle_Coord_Tripulacion_Reservacioness);
            this.dataSourceReservaciones.paginator = this.paginator;
            this.dataSourceReservaciones.sort = this.sort;
        let fTransportacion = await this.Detalle_Coord_Tripulacion_TransportacionService.listaSelAll(0, 1000,'Coord__de_Vuelo__Tripulacion.Folio=' + id).toPromise();
            this.TransportacionData = fTransportacion.Detalle_Coord_Tripulacion_Transportacions;
            this.loadTransportacion(fTransportacion.Detalle_Coord_Tripulacion_Transportacions);
            this.dataSourceTransportacion = new MatTableDataSource(fTransportacion.Detalle_Coord_Tripulacion_Transportacions);
            this.dataSourceTransportacion.paginator = this.paginator;
            this.dataSourceTransportacion.sort = this.sort;
	  
        this.model.fromObject(result.Coord__de_Vuelo__Tripulacions[0]);
        this.Coord__de_Vuelo__TripulacionForm.get('Numero_de_Vuelo').setValue(
          result.Coord__de_Vuelo__Tripulacions[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
          { onlySelf: false, emitEvent: true }
        );
        this.Coord__de_Vuelo__TripulacionForm.get('Matricula').setValue(
          result.Coord__de_Vuelo__Tripulacions[0].Matricula_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );

		this.Coord__de_Vuelo__TripulacionForm.markAllAsTouched();
		this.Coord__de_Vuelo__TripulacionForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get TripulacionItems() {
    return this.Coord__de_Vuelo__TripulacionForm.get('Detalle_Coord_TripulacionItems') as FormArray;
  }

  getTripulacionColumns(): string[] {
    return this.TripulacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadTripulacion(Tripulacion: Detalle_Coord_Tripulacion[]) {
    Tripulacion.forEach(element => {
      this.addTripulacion(element);
    });
  }

  
  closeWindowCancel():void{
    window.close();
  }
  closeWindowSave():void{
    setTimeout(()=>{ window.close();}, 2000);
  }

  addTripulacionToMR() {
    const Tripulacion = new Detalle_Coord_Tripulacion(this.fb);
    this.TripulacionData.push(this.addTripulacion(Tripulacion));
    this.dataSourceTripulacion.data = this.TripulacionData;
    Tripulacion.edit = true;
    Tripulacion.isNew = true;
    const length = this.dataSourceTripulacion.data.length;
    const index = length - 1;
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
    formTripulacion.enable();
	this.addFilterToControl_Tripulante_Detalle_Coord_Tripulacion(formTripulacion.controls._Tripulante, index);
    
    const page = Math.ceil(this.dataSourceTripulacion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addTripulacion(entity: Detalle_Coord_Tripulacion) {
    const Tripulacion = new Detalle_Coord_Tripulacion(this.fb);
    this.TripulacionItems.push(Tripulacion.buildFormGroup());
    if (entity) {
      Tripulacion.fromObject(entity);
    }
	return entity;
  }  

  TripulacionItemsByFolio(Folio: number): FormGroup {
    return (this.Coord__de_Vuelo__TripulacionForm.get('Detalle_Coord_TripulacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  TripulacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceTripulacion.data.indexOf(element);
	let fb = this.TripulacionItems.controls[index] as FormGroup;
    return fb;
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
      this.TripulacionData.splice(index,1);
      this.dataSourceTripulacion.data = this.TripulacionData;
      this.dataSourceTripulacion._updateChangeSubscription();
      index = this.TripulacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }

    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
    formTripulacion.disable();

  }  

  async saveTripulacion(element: any) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
    if (this.TripulacionData[index]._Tripulante !== formTripulacion.value._Tripulante && formTripulacion.value._Tripulante > 0) {
		let tripulacion = await this.TripulacionService.getById(formTripulacion.value._Tripulante).toPromise();
        this.TripulacionData[index]._Tripulante_Tripulacion = tripulacion;
    }
    this.TripulacionData[index]._Tripulante = formTripulacion.value._Tripulante;
    this.TripulacionData[index].Comisariato = formTripulacion.value.Comisariato;
    this.TripulacionData[index].Fecha_de_Solicitud = formTripulacion.value.Fecha_de_Solicitud;
    this.TripulacionData[index].No_Solicitud = formTripulacion.value.No_Solicitud;
    this.TripulacionData[index].Proveedor = formTripulacion.value.Proveedor;
    this.TripulacionData[index].Confirmado_por_Correo = formTripulacion.value.Confirmado_por_Correo;
    this.TripulacionData[index].Confirmado_por_Telefono = formTripulacion.value.Confirmado_por_Telefono;
    this.TripulacionData[index].Confirmado = formTripulacion.value.Confirmado;
    this.TripulacionData[index].Confirmado_Estatus_de_Confirmacion = formTripulacion.value.Confirmado !== '' ?
     this.varEstatus_de_Confirmacion.filter(d => d.Clave === formTripulacion.value.Confirmado)[0] : null ;	
	
    this.TripulacionData[index].isNew = false;
    this.dataSourceTripulacion.data = this.TripulacionData;
    this.dataSourceTripulacion._updateChangeSubscription();
  }
  
  editTripulacion(element: any) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    const formTripulacion = this.TripulacionItems.controls[index] as FormGroup;
	this.Selected_Tripulante_Detalle_Coord_Tripulacion[index] = this.dataSourceTripulacion.data[index]._Tripulante_Tripulacion.Nombre_completo;
    this.addFilterToControl_Tripulante_Detalle_Coord_Tripulacion(formTripulacion.controls._Tripulante, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Coord_Tripulacion(Folio: number) {
    this.dataSourceTripulacion.data.forEach(async (d, index) => {
      const data = this.TripulacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Coord__de_Vuelo__Tripulacion = Folio;
	
      
      if (model.Folio === 0) {
        // Add Tripulación
        model.Coordinacion_Tripulacion = model.Coord__de_Vuelo__Tripulacion;
		    let response = await this.Detalle_Coord_TripulacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formTripulacion = this.TripulacionItemsByFolio(model.Folio);
        if (formTripulacion.dirty) {
          // Update Tripulación
          model.Coordinacion_Tripulacion = model.Coord__de_Vuelo__Tripulacion;
          let response = await this.Detalle_Coord_TripulacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Tripulación
        await this.Detalle_Coord_TripulacionService.delete(model.Folio).toPromise();
      }
    });
  }

  public select_Tripulante_Detalle_Coord_Tripulacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.Selected_Tripulante_Detalle_Coord_Tripulacion[index] = event.option.viewValue;
	let fgr = this.Coord__de_Vuelo__TripulacionForm.controls.Detalle_Coord_TripulacionItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls._Tripulante.setValue(event.option.value);
    this.displayFn_Tripulante_Detalle_Coord_Tripulacion(element);
  }  
  
  displayFn_Tripulante_Detalle_Coord_Tripulacion(this, element) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    return this.Selected_Tripulante_Detalle_Coord_Tripulacion[index];
  }
  updateOption_Tripulante_Detalle_Coord_Tripulacion(event, element: any) {
    const index = this.dataSourceTripulacion.data.indexOf(element);
    this.Selected_Tripulante_Detalle_Coord_Tripulacion[index] = event.source.viewValue;
  } 

	_filter_Tripulante_Detalle_Coord_Tripulacion(filter: any): Observable<Tripulacion> {
		const where = filter !== '' ?  "Tripulacion.Nombre_completo like '%" + filter + "%'" : '';
		return this.TripulacionService.listaSelAll(0, 20, where);
	}

  addFilterToControl_Tripulante_Detalle_Coord_Tripulacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoading_Tripulante_Detalle_Coord_Tripulacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoading_Tripulante_Detalle_Coord_Tripulacion = true;
        return this._filter_Tripulante_Detalle_Coord_Tripulacion(value || '');
      })
    ).subscribe(result => {
      this.varTripulacion = result.Tripulacions;
      this.isLoading_Tripulante_Detalle_Coord_Tripulacion = false;
      this.search_Tripulante_Detalle_Coord_TripulacionCompleted = true;
      this.Selected_Tripulante_Detalle_Coord_Tripulacion[index] = this.varTripulacion.length === 0 ? '' : this.Selected_Tripulante_Detalle_Coord_Tripulacion[index];
    });
  }

  get ReservacionesItems() {
    return this.Coord__de_Vuelo__TripulacionForm.get('Detalle_Coord_Tripulacion_ReservacionesItems') as FormArray;
  }

  getReservacionesColumns(): string[] {
    return this.ReservacionesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadReservaciones(Reservaciones: Detalle_Coord_Tripulacion_Reservaciones[]) {
    Reservaciones.forEach(element => {
      this.addReservaciones(element);
    });
  }

  addReservacionesToMR() {
    const Reservaciones = new Detalle_Coord_Tripulacion_Reservaciones(this.fb);
    this.ReservacionesData.push(this.addReservaciones(Reservaciones));
    this.dataSourceReservaciones.data = this.ReservacionesData;
    Reservaciones.edit = true;
    Reservaciones.isNew = true;
    const length = this.dataSourceReservaciones.data.length;
    const index = length - 1;
    const formReservaciones = this.ReservacionesItems.controls[index] as FormGroup;
    formReservaciones.enable();
    
    const page = Math.ceil(this.dataSourceReservaciones.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addReservaciones(entity: Detalle_Coord_Tripulacion_Reservaciones) {
    const Reservaciones = new Detalle_Coord_Tripulacion_Reservaciones(this.fb);
    this.ReservacionesItems.push(Reservaciones.buildFormGroup());
    if (entity) {
      Reservaciones.fromObject(entity);
    }
	return entity;
  }  

  ReservacionesItemsByFolio(Folio: number): FormGroup {
    return (this.Coord__de_Vuelo__TripulacionForm.get('Detalle_Coord_Tripulacion_ReservacionesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  ReservacionesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceReservaciones.data.indexOf(element);
	let fb = this.ReservacionesItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteReservaciones(element: any) {
    let index = this.dataSourceReservaciones.data.indexOf(element);
    this.ReservacionesData[index].IsDeleted = true;
    this.dataSourceReservaciones.data = this.ReservacionesData;
    this.dataSourceReservaciones._updateChangeSubscription();
    index = this.dataSourceReservaciones.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditReservaciones(element: any) {
    let index = this.dataSourceReservaciones.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.ReservacionesData[index].IsDeleted = true;
      this.dataSourceReservaciones.data = this.ReservacionesData;
      this.dataSourceReservaciones._updateChangeSubscription();
      index = this.ReservacionesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }

    const formReservaciones = this.ReservacionesItems.controls[index] as FormGroup;
    formReservaciones.disable();
  }  

  async saveReservaciones(element: any) {
    const index = this.dataSourceReservaciones.data.indexOf(element);
    const formReservaciones = this.ReservacionesItems.controls[index] as FormGroup;
    this.ReservacionesData[index].Hospedaje = formReservaciones.value.Hospedaje;
    this.ReservacionesData[index].Hospedaje_Tipo_de_Hospedaje = formReservaciones.value.Hospedaje !== '' ?
     this.varTipo_de_Hospedaje.filter(d => d.Clave === formReservaciones.value.Hospedaje)[0] : null ;	
    this.ReservacionesData[index].Nombre_del_Hotel = formReservaciones.value.Nombre_del_Hotel;
    this.ReservacionesData[index].Telefono = formReservaciones.value.Telefono;
    this.ReservacionesData[index].Numero_de_Confirmacion = formReservaciones.value.Numero_de_Confirmacion;
    this.ReservacionesData[index].Confirmado_por_Correo = formReservaciones.value.Confirmado_por_Correo;
    this.ReservacionesData[index].Confirmado_por_Telefono = formReservaciones.value.Confirmado_por_Telefono;
    this.ReservacionesData[index].Confirmado = formReservaciones.value.Confirmado;
    this.ReservacionesData[index].Confirmado_Estatus_de_Confirmacion = formReservaciones.value.Confirmado !== '' ?
     this.varEstatus_de_Confirmacion.filter(d => d.Clave === formReservaciones.value.Confirmado)[0] : null ;	
	
    this.ReservacionesData[index].isNew = false;
    this.dataSourceReservaciones.data = this.ReservacionesData;
    this.dataSourceReservaciones._updateChangeSubscription();
  }
  
  editReservaciones(element: any) {
    const index = this.dataSourceReservaciones.data.indexOf(element);
    const formReservaciones = this.ReservacionesItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_Coord_Tripulacion_Reservaciones(Folio: number) {
    this.dataSourceReservaciones.data.forEach(async (d, index) => {
      const data = this.ReservacionesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Coord__de_Vuelo__Tripulacion = Folio;
	
      
      if (model.Folio === 0) {
        // Add Reservaciones
        model.Coordinacion_Tripulacion = model.Coord__de_Vuelo__Tripulacion;
		    let response = await this.Detalle_Coord_Tripulacion_ReservacionesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formReservaciones = this.ReservacionesItemsByFolio(model.Folio);
        if (formReservaciones.dirty) {
          // Update Reservaciones
          model.Coordinacion_Tripulacion = model.Coord__de_Vuelo__Tripulacion;
          let response = await this.Detalle_Coord_Tripulacion_ReservacionesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Reservaciones
        await this.Detalle_Coord_Tripulacion_ReservacionesService.delete(model.Folio).toPromise();
      }
    });
  }


  get TransportacionItems() {
    return this.Coord__de_Vuelo__TripulacionForm.get('Detalle_Coord_Tripulacion_TransportacionItems') as FormArray;
  }

  getTransportacionColumns(): string[] {
    return this.TransportacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadTransportacion(Transportacion: Detalle_Coord_Tripulacion_Transportacion[]) {
    Transportacion.forEach(element => {
      this.addTransportacion(element);
    });
  }

  addTransportacionToMR() {
    const Transportacion = new Detalle_Coord_Tripulacion_Transportacion(this.fb);
    this.TransportacionData.push(this.addTransportacion(Transportacion));
    this.dataSourceTransportacion.data = this.TransportacionData;
    Transportacion.edit = true;
    Transportacion.isNew = true;
    const length = this.dataSourceTransportacion.data.length;
    const index = length - 1;
    const formTransportacion = this.TransportacionItems.controls[index] as FormGroup;
    formTransportacion.enable();
    
    const page = Math.ceil(this.dataSourceTransportacion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addTransportacion(entity: Detalle_Coord_Tripulacion_Transportacion) {
    const Transportacion = new Detalle_Coord_Tripulacion_Transportacion(this.fb);
    this.TransportacionItems.push(Transportacion.buildFormGroup());
    if (entity) {
      Transportacion.fromObject(entity);
    }
	return entity;
  }  

  TransportacionItemsByFolio(Folio: number): FormGroup {
    return (this.Coord__de_Vuelo__TripulacionForm.get('Detalle_Coord_Tripulacion_TransportacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  TransportacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceTransportacion.data.indexOf(element);
	let fb = this.TransportacionItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteTransportacion(element: any) {
    let index = this.dataSourceTransportacion.data.indexOf(element);
    this.TransportacionData[index].IsDeleted = true;
    this.dataSourceTransportacion.data = this.TransportacionData;
    this.dataSourceTransportacion._updateChangeSubscription();
    index = this.dataSourceTransportacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditTransportacion(element: any) {
    let index = this.dataSourceTransportacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.TransportacionData[index].IsDeleted = true;
      this.TransportacionData.splice(index,1)
      this.dataSourceTransportacion.data = this.TransportacionData;
      this.dataSourceTransportacion._updateChangeSubscription();
      index = this.TransportacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
    const formTransportacion = this.TransportacionItems.controls[index] as FormGroup;
    formTransportacion.disable();
  }  

  async saveTransportacion(element: any) {
    const index = this.dataSourceTransportacion.data.indexOf(element);
    const formTransportacion = this.TransportacionItems.controls[index] as FormGroup;
    this.TransportacionData[index].Transportacion = formTransportacion.value.Transportacion;
    this.TransportacionData[index].Transportacion_Tipo_de_Transportacion = formTransportacion.value.Transportacion !== '' ?
     this.varTipo_de_Transportacion.filter(d => d.Clave === formTransportacion.value.Transportacion)[0] : null ;	
    this.TransportacionData[index].Especificaciones = formTransportacion.value.Especificaciones;
    this.TransportacionData[index].Proveedor = formTransportacion.value.Proveedor;
    this.TransportacionData[index].Telefono = formTransportacion.value.Telefono;
    this.TransportacionData[index].Numero_de_Confirmacion = formTransportacion.value.Numero_de_Confirmacion;
    this.TransportacionData[index].Confirmado = formTransportacion.value.Confirmado;
    this.TransportacionData[index].Confirmado_Estatus_de_Confirmacion = formTransportacion.value.Confirmado !== '' ?
     this.varEstatus_de_Confirmacion.filter(d => d.Clave === formTransportacion.value.Confirmado)[0] : null ;	
	
    this.TransportacionData[index].isNew = false;
    this.dataSourceTransportacion.data = this.TransportacionData;
    this.dataSourceTransportacion._updateChangeSubscription();
  }
  
  editTransportacion(element: any) {
    const index = this.dataSourceTransportacion.data.indexOf(element);
    const formTransportacion = this.TransportacionItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_Coord_Tripulacion_Transportacion(Folio: number) {
    this.dataSourceTransportacion.data.forEach(async (d, index) => {
      const data = this.TransportacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Coord__de_Vuelo__Tripulacion = Folio;
	
      
      if (model.Folio === 0) {
        // Add Transportación
        model.Coordinacion_Tripulacion = model.Coord__de_Vuelo__Tripulacion;
		    let response = await this.Detalle_Coord_Tripulacion_TransportacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formTransportacion = this.TransportacionItemsByFolio(model.Folio);
        if (formTransportacion.dirty) {
          // Update Transportación
          model.Coordinacion_Tripulacion = model.Coord__de_Vuelo__Tripulacion;
          let response = await this.Detalle_Coord_Tripulacion_TransportacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Transportación
        await this.Detalle_Coord_Tripulacion_TransportacionService.delete(model.Folio).toPromise();
      }
    });
  }


  private filterTripulacion(name: string): any[] {
    const filterValue = name.toLowerCase();

    return this.optionsTripulacion.filter(option => option.Description.toLowerCase().includes(filterValue));
  }

  getTripulacion() {
    let result = []

    result = this.brf.EvaluaQueryDictionary(`uspObtenerTripulacionVuelo ${this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')}`, 1, 'ABC123')

    this.optionsTripulacion = result
    this.optionsTripulacionFiltered = of(result);

    this.optionsTripulacionFiltered = this.Coord__de_Vuelo__TripulacionForm.get('_Tripulante').valueChanges.pipe(
      startWith(''),
      map(value => {
        const name = typeof value === 'string' ? value : value?.name;
        return name ? this.filterTripulacion(name as string) : this.optionsTripulacion.slice();
      }),
    );

  }

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Coord__de_Vuelo__TripulacionForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Estatus_de_ConfirmacionService.getAll());

    observablesArray.push(this.Tipo_de_HospedajeService.getAll());

    observablesArray.push(this.Tipo_de_TransportacionService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varEstatus_de_Confirmacion  , varTipo_de_Hospedaje   , varTipo_de_Transportacion  ]) => {
          this.varEstatus_de_Confirmacion = varEstatus_de_Confirmacion;

          this.varTipo_de_Hospedaje = varTipo_de_Hospedaje;

          this.varTipo_de_Transportacion = varTipo_de_Transportacion;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Coord__de_Vuelo__TripulacionForm.get('Numero_de_Vuelo').valueChanges.pipe(
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
	  this.Coord__de_Vuelo__TripulacionForm.get('Numero_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
	  this.optionsNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = false;
      this.optionsNumero_de_Vuelo = of([]);
    });
    this.Coord__de_Vuelo__TripulacionForm.get('Matricula').valueChanges.pipe(
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
	  this.Coord__de_Vuelo__TripulacionForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
	  this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Confirmado': {
        this.Estatus_de_ConfirmacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Confirmacion = x.Estatus_de_Confirmacions;
        });
        break;
      }

      case 'Hospedaje': {
        this.Tipo_de_HospedajeService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Hospedaje = x.Tipo_de_Hospedajes;
        });
        break;
      }

      case 'Transportacion': {
        this.Tipo_de_TransportacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Transportacion = x.Tipo_de_Transportacions;
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


  async save() {
    await this.saveData();
    if(this.localStorageHelper.getItemFromLocalStorage("Coord__de_Vuelo__TripulacionWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Coord__de_Vuelo__TripulacionWindowsFloat", "0");
      setTimeout(()=>{ window.close();}, 5000);
    }
    else{
      this.goToList();
    }
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Coord__de_Vuelo__TripulacionForm.value;
      entity.Folio = this.model.Folio;
      entity.Numero_de_Vuelo = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');
      entity.Matricula = this.Coord__de_Vuelo__TripulacionForm.get('Matricula').value.Matricula;
      entity.Ruta_de_Vuelo = this.Coord__de_Vuelo__TripulacionForm.controls.Ruta_de_Vuelo.value;
      entity.Fecha_y_Hora_de_Salida = this.Coord__de_Vuelo__TripulacionForm.controls.Fecha_y_Hora_de_Salida.value;
      entity.Calificacion = this.Coord__de_Vuelo__TripulacionForm.controls.Calificacion.value;	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Coord__de_Vuelo__TripulacionService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Coord_Tripulacion(this.model.Folio);  
        await this.saveDetalle_Coord_Tripulacion_Reservaciones(this.model.Folio);  
        await this.saveDetalle_Coord_Tripulacion_Transportacion(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Coord__de_Vuelo__TripulacionService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Coord_Tripulacion(id);
          await this.saveDetalle_Coord_Tripulacion_Reservaciones(id);
          await this.saveDetalle_Coord_Tripulacion_Transportacion(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
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
      this.Coord__de_Vuelo__TripulacionForm.reset();
      this.model = new Coord__de_Vuelo__Tripulacion(this.fb);
      this.Coord__de_Vuelo__TripulacionForm = this.model.buildFormGroup();
      this.dataSourceTripulacion = new MatTableDataSource<Detalle_Coord_Tripulacion>();
      this.TripulacionData = [];
      this.dataSourceReservaciones = new MatTableDataSource<Detalle_Coord_Tripulacion_Reservaciones>();
      this.ReservacionesData = [];
      this.dataSourceTransportacion = new MatTableDataSource<Detalle_Coord_Tripulacion_Transportacion>();
      this.TransportacionData = [];

    } else {
      this.router.navigate(['views/Coord__de_Vuelo__Tripulacion/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }
  
  cancel() {
    if(this.localStorageHelper.getItemFromLocalStorage("Coord__de_Vuelo__TripulacionWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Coord__de_Vuelo__TripulacionWindowsFloat", "0");
      window.close();
    }
    else{
      this.goToList();
    }
  }

  goToList() {
    this.router.navigate(['/Coord__de_Vuelo__Tripulacion/list'], { state: { data: this.dataListConfig } });
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
    Ruta_de_Vuelo_ExecuteBusinessRules(): void {
        //Ruta_de_Vuelo_FieldExecuteBusinessRulesEnd
    }
    Fecha_y_Hora_de_Salida_ExecuteBusinessRules(): void {
        //Fecha_y_Hora_de_Salida_FieldExecuteBusinessRulesEnd
    }
    Calificacion_ExecuteBusinessRules(): void {
        //Calificacion_FieldExecuteBusinessRulesEnd
    }
    Observaciones_ExecuteBusinessRules(): void {
        //Observaciones_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:1894 - En nuevo ocultar numero de vuelo- - Autor: Lizeth Villa - Actualización: 3/25/2021 6:11:24 PM
if(  this.operation == 'New' ) {
this.brf.HideFieldOfForm(this.Coord__de_Vuelo__TripulacionForm, "Numero_de_Vuelo"); this.brf.SetNotRequiredControl(this.Coord__de_Vuelo__TripulacionForm, "Numero_de_Vuelo"); this.brf.SetNotRequiredControl(this.Coord__de_Vuelo__TripulacionForm, "Numero_de_Vuelo");
} 
//TERMINA - BRID:1894


//INICIA - BRID:2045 -  Al abrir la pantalla, en nuevo y modificar* Matricula, Ruta de Vuelo, Fecha y Hora de Salida, Calificación y Número de Vuelo siempre deshabilitados* Número de vuelo VISIBLE* Observaciones No Obligatorio - Autor: Lizeth Villa - Actualización: 3/25/2021 6:12:49 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Numero_de_Vuelo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Matricula', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Ruta_de_Vuelo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Fecha_y_Hora_de_Salida', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Calificacion', 0); this.brf.SetNotRequiredControl(this.Coord__de_Vuelo__TripulacionForm, "Observaciones");
} 
//TERMINA - BRID:2045


//INICIA - BRID:2176 - acomodar campos en coordinación tripulación - Autor: Administrador - Actualización: 3/30/2021 1:29:21 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:2176


//INICIA - BRID:2620 - Ocultar Folio siempre. - Autor: Lizeth Villa - Actualización: 4/7/2021 10:13:01 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Coord__de_Vuelo__TripulacionForm, "Folio"); this.brf.SetNotRequiredControl(this.Coord__de_Vuelo__TripulacionForm, "Folio");
} 
//TERMINA - BRID:2620


//INICIA - BRID:2830 - si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje con ajuste manual, no desactivar - Autor: Administrador - Actualización: 5/3/2021 4:24:17 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
if( this.brf.EvaluaQuery("SELECT COUNT(*) from Solicitud_de_Vuelo where folio = "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" and estatus = 9	", 1, 'ABC123')==this.brf.TryParseInt('1', '1') && this.brf.EvaluaQuery("if ( "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 1 or "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 9 ) begin select 1 end	", 1, 'ABC123')!=this.brf.TryParseInt('1', '1') ) { this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Folio', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Numero_de_Vuelo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Matricula', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Ruta_de_Vuelo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Fecha_y_Hora_de_Salida', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Calificacion', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Observaciones', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Folio', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Coordinacion_Tripulacion', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, '_Tripulante', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Comisariato', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Proveedor', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Fecha_de_Solicitud', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Confirmado_por_Correo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Confirmado_por_Telefono', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Confirmado', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Coordinacion_Tripulacion', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Hospedaje', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Nombre_del_Hotel', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Telefono', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Numero_de_Confirmacion', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Confirmado_por_Correo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Confirmado_por_Telefono', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Confirmado', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Folio', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Coordinacion_Tripulacion', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Transportacion', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Especificaciones', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Proveedor', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Telefono', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Numero_de_Confirmacion', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Confirmado', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Folio', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'No_Solicitud', 0);    this.brf.ShowMessage("El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar");} else {}
} 
//TERMINA - BRID:2830


//INICIA - BRID:5682 - Habilitar campos si el vuelo esta reabierto. - Autor: Lizeth Villa - Actualización: 9/3/2021 5:17:41 PM
if(  this.operation == 'Update' ) {
if( this.brf.EvaluaQuery("if ( ( "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 9) or  ( "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 12)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') && this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+"", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Matricula', 1);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Ruta_de_Vuelo', 1);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Fecha_y_Hora_de_Salida', 1);this.brf.SetEnabledControl(this.Coord__de_Vuelo__TripulacionForm, 'Calificacion', 1);} else {}
} 
//TERMINA - BRID:5682

//rulesOnInit_ExecuteBusinessRulesEnd






  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:1892 - En nuevo después de guardar, asignar numero de vuelo - Autor: Lizeth Villa - Actualización: 3/22/2021 5:38:41 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery(" update Coord__de_Vuelo__Tripulacion set Numero_de_Vuelo= "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" where Folio="+this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)+"", 1, "ABC123");
} 
//TERMINA - BRID:1892


//INICIA - BRID:2635 - En la pantalla "Coord de Vuelo - Tripulación" al dar de alta o modificar, después de guardar ejecutar el SP: exec uspAsignaCalificacionCoordinacion "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+",4esto es para asignar la calificación. - Autor: Lizeth Villa - Actualización: 4/8/2021 10:07:39 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this._SpartanService.SetValueExecuteQueryFG(" exec uspAsignaCalificacionCoordinacion "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+",4", 1, "ABC123");
} 
//TERMINA - BRID:2635

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
