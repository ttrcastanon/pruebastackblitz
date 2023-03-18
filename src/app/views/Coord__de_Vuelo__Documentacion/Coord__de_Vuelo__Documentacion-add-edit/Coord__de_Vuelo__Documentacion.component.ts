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
import { Coord__de_Vuelo__DocumentacionService } from 'src/app/api-services/Coord__de_Vuelo__Documentacion.service';
import { Coord__de_Vuelo__Documentacion } from 'src/app/models/Coord__de_Vuelo__Documentacion';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Detalle_Coord_Documentacion_AeronaveService } from 'src/app/api-services/Detalle_Coord_Documentacion_Aeronave.service';
import { Detalle_Coord_Documentacion_Aeronave } from 'src/app/models/Detalle_Coord_Documentacion_Aeronave';
import { Estatus_de_ConfirmacionService } from 'src/app/api-services/Estatus_de_Confirmacion.service';
import { Estatus_de_Confirmacion } from 'src/app/models/Estatus_de_Confirmacion';

import { Detalle_Coord_Documentacion_PAXsService } from 'src/app/api-services/Detalle_Coord_Documentacion_PAXs.service';
import { Detalle_Coord_Documentacion_PAXs } from 'src/app/models/Detalle_Coord_Documentacion_PAXs';


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
  selector: 'app-Coord__de_Vuelo__Documentacion',
  templateUrl: './Coord__de_Vuelo__Documentacion.component.html',
  styleUrls: ['./Coord__de_Vuelo__Documentacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Coord__de_Vuelo__DocumentacionComponent implements OnInit, AfterViewInit {
MRaddPAXS_Documentacion: boolean = false;
MRaddAeronave_Documentacion: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Coord__de_Vuelo__DocumentacionForm: FormGroup;
	public Editor = ClassicEditor;
	model: Coord__de_Vuelo__Documentacion;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
	hasOptionsNumero_de_Vuelo: boolean;
	isLoadingNumero_de_Vuelo: boolean;
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;
	public varEstatus_de_Confirmacion: Estatus_de_Confirmacion[] = [];





	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	
	@ViewChild('PaginadorAeronave', { read: MatPaginator }) paginadorAeronave: MatPaginator;
        @ViewChild('PaginadorPAX', { read: MatPaginator }) paginadorPAX: MatPaginator;
	
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceAeronave_Documentacion = new MatTableDataSource<Detalle_Coord_Documentacion_Aeronave>();
  Aeronave_DocumentacionColumns = [
    { def: 'actions', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Confirmado', hide: false },
	
  ];
  Aeronave_DocumentacionData: Detalle_Coord_Documentacion_Aeronave[] = [];
  dataSourcePAXS_Documentacion = new MatTableDataSource<Detalle_Coord_Documentacion_PAXs>();
  PAXS_DocumentacionColumns = [
    { def: 'actions', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Confirmado', hide: false },
	
  ];
  PAXS_DocumentacionData: Detalle_Coord_Documentacion_PAXs[] = [];
	
	today = new Date;
	consult: boolean = false;
  enableButtonAdd: boolean = false;
  enableButtonDelete: boolean = false;
  AeronaveSeleccion: any = null;
  cargaMatriculaDesdeEdicion: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Coord__de_Vuelo__DocumentacionService: Coord__de_Vuelo__DocumentacionService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeronaveService: AeronaveService,
    private Detalle_Coord_Documentacion_AeronaveService: Detalle_Coord_Documentacion_AeronaveService,
    private Estatus_de_ConfirmacionService: Estatus_de_ConfirmacionService,

    private Detalle_Coord_Documentacion_PAXsService: Detalle_Coord_Documentacion_PAXsService,


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
    this.model = new Coord__de_Vuelo__Documentacion(this.fb);
    this.Coord__de_Vuelo__DocumentacionForm = this.model.buildFormGroup();
    this.Aeronave_DocumentacionItems.removeAt(0);
    this.PAXS_DocumentacionItems.removeAt(0);
	
	this.Coord__de_Vuelo__DocumentacionForm.get('Folio').disable();
    this.Coord__de_Vuelo__DocumentacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
	
  getCountAeronaves(): number {
    return this.dataSourceAeronave_Documentacion.data.length;
  }

  getCountPAX(): number {
    return this.dataSourcePAXS_Documentacion.data.length;
  }
  
  ngAfterViewInit(): void {
    this.dataSourceAeronave_Documentacion.paginator = this.paginadorAeronave;
    this.dataSourcePAXS_Documentacion.paginator = this.paginadorPAX;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Aeronave_DocumentacionColumns.splice(0, 1);
          this.PAXS_DocumentacionColumns.splice(0, 1);
		
          this.Coord__de_Vuelo__DocumentacionForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Coord__de_Vuelo__Documentacion)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Coord__de_Vuelo__DocumentacionForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Coord__de_Vuelo__DocumentacionForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Coord__de_Vuelo__DocumentacionService.listaSelAll(0, 1, 'Coord__de_Vuelo__Documentacion.Folio=' + id).toPromise();
	if (result.Coord__de_Vuelo__Documentacions.length > 0) {

        this.cargaMatriculaDesdeEdicion = true;

        let fAeronave_Documentacion = await this.Detalle_Coord_Documentacion_AeronaveService.listaSelAll(0, 1000,'Coord__de_Vuelo__Documentacion.Folio=' + id).toPromise();
            this.Aeronave_DocumentacionData = fAeronave_Documentacion.Detalle_Coord_Documentacion_Aeronaves;
            this.loadAeronave_Documentacion(fAeronave_Documentacion.Detalle_Coord_Documentacion_Aeronaves);
            this.dataSourceAeronave_Documentacion = new MatTableDataSource(fAeronave_Documentacion.Detalle_Coord_Documentacion_Aeronaves);
            this.dataSourceAeronave_Documentacion.paginator = this.paginadorAeronave;
            this.dataSourceAeronave_Documentacion.sort = this.sort;
        let fPAXS_Documentacion = await this.Detalle_Coord_Documentacion_PAXsService.listaSelAll(0, 1000,'Coord__de_Vuelo__Documentacion.Folio=' + id).toPromise();
            this.PAXS_DocumentacionData = fPAXS_Documentacion.Detalle_Coord_Documentacion_PAXss;
            this.loadPAXS_Documentacion(fPAXS_Documentacion.Detalle_Coord_Documentacion_PAXss);
            this.dataSourcePAXS_Documentacion = new MatTableDataSource(fPAXS_Documentacion.Detalle_Coord_Documentacion_PAXss);
            this.dataSourcePAXS_Documentacion.paginator = this.paginadorPAX;
            this.dataSourcePAXS_Documentacion.sort = this.sort;
	  
        this.model.fromObject(result.Coord__de_Vuelo__Documentacions[0]);
        this.Coord__de_Vuelo__DocumentacionForm.get('Numero_de_Vuelo').setValue(
          result.Coord__de_Vuelo__Documentacions[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
          { onlySelf: false, emitEvent: true }
        );
        this.Coord__de_Vuelo__DocumentacionForm.get('Matricula').setValue(
          result.Coord__de_Vuelo__Documentacions[0].Matricula_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );

		this.Coord__de_Vuelo__DocumentacionForm.markAllAsTouched();
		this.Coord__de_Vuelo__DocumentacionForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Aeronave_DocumentacionItems() {
    return this.Coord__de_Vuelo__DocumentacionForm.get('Detalle_Coord_Documentacion_AeronaveItems') as FormArray;
  }
  
  closeWindowCancel():void{
    window.close();
  }
  closeWindowSave():void{
    setTimeout(()=>{ window.close();}, 2000);
  }

  getAeronave_DocumentacionColumns(): string[] {
    return this.Aeronave_DocumentacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadAeronave_Documentacion(Aeronave_Documentacion: Detalle_Coord_Documentacion_Aeronave[]) {
    Aeronave_Documentacion.forEach(element => {
      this.addAeronave_Documentacion(element);
    });
  }

  addAeronave_DocumentacionToMR() {
    const Aeronave_Documentacion = new Detalle_Coord_Documentacion_Aeronave(this.fb);
    this.Aeronave_DocumentacionData.push(this.addAeronave_Documentacion(Aeronave_Documentacion));
    this.dataSourceAeronave_Documentacion.data = this.Aeronave_DocumentacionData;
    Aeronave_Documentacion.edit = true;
    Aeronave_Documentacion.isNew = true;
    const length = this.dataSourceAeronave_Documentacion.data.length;
    const index = length - 1;
    const formAeronave_Documentacion = this.Aeronave_DocumentacionItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceAeronave_Documentacion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addAeronave_Documentacion(entity: Detalle_Coord_Documentacion_Aeronave) {
    const Aeronave_Documentacion = new Detalle_Coord_Documentacion_Aeronave(this.fb);
    this.Aeronave_DocumentacionItems.push(Aeronave_Documentacion.buildFormGroup());
    if (entity) {
      Aeronave_Documentacion.fromObject(entity);
    }
	return entity;
  }  

  Aeronave_DocumentacionItemsByFolio(Folio: number): FormGroup {
    return (this.Coord__de_Vuelo__DocumentacionForm.get('Detalle_Coord_Documentacion_AeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Aeronave_DocumentacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceAeronave_Documentacion.data.indexOf(element);
	let fb = this.Aeronave_DocumentacionItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteAeronave_Documentacion(element: any) {
    let index = this.dataSourceAeronave_Documentacion.data.indexOf(element);
    this.Aeronave_DocumentacionData[index].IsDeleted = true;
    this.dataSourceAeronave_Documentacion.data = this.Aeronave_DocumentacionData;
    this.dataSourceAeronave_Documentacion.data.splice(index, 1);
    this.dataSourceAeronave_Documentacion._updateChangeSubscription();
    index = this.dataSourceAeronave_Documentacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditAeronave_Documentacion(element: any) {
    let index = this.dataSourceAeronave_Documentacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Aeronave_DocumentacionData[index].IsDeleted = true;
      this.dataSourceAeronave_Documentacion.data = this.Aeronave_DocumentacionData;
      this.dataSourceAeronave_Documentacion.data.splice(index, 1);
      this.dataSourceAeronave_Documentacion._updateChangeSubscription();
      index = this.Aeronave_DocumentacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveAeronave_Documentacion(element: any) {
    const index = this.dataSourceAeronave_Documentacion.data.indexOf(element);
    const formAeronave_Documentacion = this.Aeronave_DocumentacionItems.controls[index] as FormGroup;
    formAeronave_Documentacion.get('Descripcion').enable()
    this.Aeronave_DocumentacionData[index].Descripcion = formAeronave_Documentacion.value.Descripcion;
    this.Aeronave_DocumentacionData[index].Confirmado = formAeronave_Documentacion.value.Confirmado;
    this.Aeronave_DocumentacionData[index].Confirmado_Estatus_de_Confirmacion = formAeronave_Documentacion.value.Confirmado !== '' ?
     this.varEstatus_de_Confirmacion.filter(d => d.Clave === formAeronave_Documentacion.value.Confirmado)[0] : null ;	
	
    this.Aeronave_DocumentacionData[index].isNew = false;
    this.dataSourceAeronave_Documentacion.data = this.Aeronave_DocumentacionData;
    this.dataSourceAeronave_Documentacion._updateChangeSubscription();
  }
  
  editAeronave_Documentacion(element: any) {
    const index = this.dataSourceAeronave_Documentacion.data.indexOf(element);
    const formAeronave_Documentacion = this.Aeronave_DocumentacionItems.controls[index] as FormGroup;
    formAeronave_Documentacion.get('Descripcion').disable()
    element.edit = true;
  }  

  async saveDetalle_Coord_Documentacion_Aeronave(Folio: number) {
    this.dataSourceAeronave_Documentacion.data.forEach(async (d, index) => {
      const data = this.Aeronave_DocumentacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	    model.Coord__de_Vuelo__Documentacion = Folio;
      
      if (model.Folio === 0) {
        // Add Documentación
        model.Coordinacion_Documentacion = model.Coord__de_Vuelo__Documentacion;
		    let response = await this.Detalle_Coord_Documentacion_AeronaveService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formAeronave_Documentacion = this.Aeronave_DocumentacionItemsByFolio(model.Folio);
        if (formAeronave_Documentacion.dirty) {
          // Update Documentación
          model.Coordinacion_Documentacion = model.Coord__de_Vuelo__Documentacion;
          let response = await this.Detalle_Coord_Documentacion_AeronaveService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Documentación
        await this.Detalle_Coord_Documentacion_AeronaveService.delete(model.Folio).toPromise();
      }
    });
  }


  get PAXS_DocumentacionItems() {
    return this.Coord__de_Vuelo__DocumentacionForm.get('Detalle_Coord_Documentacion_PAXsItems') as FormArray;
  }

  getPAXS_DocumentacionColumns(): string[] {
    return this.PAXS_DocumentacionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPAXS_Documentacion(PAXS_Documentacion: Detalle_Coord_Documentacion_PAXs[]) {
    PAXS_Documentacion.forEach(element => {
      this.addPAXS_Documentacion(element);
    });
  }

  addPAXS_DocumentacionToMR() {
    const PAXS_Documentacion = new Detalle_Coord_Documentacion_PAXs(this.fb);
    this.PAXS_DocumentacionData.push(this.addPAXS_Documentacion(PAXS_Documentacion));
    this.dataSourcePAXS_Documentacion.data = this.PAXS_DocumentacionData;
    PAXS_Documentacion.edit = true;
    PAXS_Documentacion.isNew = true;
    const length = this.dataSourcePAXS_Documentacion.data.length;
    const index = length - 1;
    const formPAXS_Documentacion = this.PAXS_DocumentacionItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourcePAXS_Documentacion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addPAXS_Documentacion(entity: Detalle_Coord_Documentacion_PAXs) {
    const PAXS_Documentacion = new Detalle_Coord_Documentacion_PAXs(this.fb);
    this.PAXS_DocumentacionItems.push(PAXS_Documentacion.buildFormGroup());
    if (entity) {
      PAXS_Documentacion.fromObject(entity);
    }
    
	return entity;
  }  

  PAXS_DocumentacionItemsByFolio(Folio: number): FormGroup {
    return (this.Coord__de_Vuelo__DocumentacionForm.get('Detalle_Coord_Documentacion_PAXsItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  PAXS_DocumentacionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePAXS_Documentacion.data.indexOf(element);
	let fb = this.PAXS_DocumentacionItems.controls[index] as FormGroup;
    return fb;
  }  

  deletePAXS_Documentacion(element: any) {
    let index = this.dataSourcePAXS_Documentacion.data.indexOf(element);
    this.PAXS_DocumentacionData[index].IsDeleted = true;
    this.dataSourcePAXS_Documentacion.data = this.PAXS_DocumentacionData;
    this.dataSourcePAXS_Documentacion.data.splice(index, 1);
    this.dataSourcePAXS_Documentacion._updateChangeSubscription();
    index = this.dataSourcePAXS_Documentacion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditPAXS_Documentacion(element: any) {
    let index = this.dataSourcePAXS_Documentacion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.PAXS_DocumentacionData[index].IsDeleted = true;
      this.dataSourcePAXS_Documentacion.data = this.PAXS_DocumentacionData;
      this.dataSourcePAXS_Documentacion.data.splice(index, 1);
      this.dataSourcePAXS_Documentacion._updateChangeSubscription();
      index = this.PAXS_DocumentacionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async savePAXS_Documentacion(element: any) {
    const index = this.dataSourcePAXS_Documentacion.data.indexOf(element);
    const formPAXS_Documentacion = this.PAXS_DocumentacionItems.controls[index] as FormGroup;
    formPAXS_Documentacion.get('Descripcion').disable()
    this.PAXS_DocumentacionData[index].Descripcion = formPAXS_Documentacion.controls.Descripcion.value;
    this.PAXS_DocumentacionData[index].Confirmado = formPAXS_Documentacion.value.Confirmado;
    this.PAXS_DocumentacionData[index].Confirmado_Estatus_de_Confirmacion = formPAXS_Documentacion.value.Confirmado !== '' ?
     this.varEstatus_de_Confirmacion.filter(d => d.Clave === formPAXS_Documentacion.value.Confirmado)[0] : null ;	
	
    this.PAXS_DocumentacionData[index].isNew = false;
    this.dataSourcePAXS_Documentacion.data = this.PAXS_DocumentacionData;
    this.dataSourcePAXS_Documentacion._updateChangeSubscription();
  }
  
  editPAXS_Documentacion(element: any) {

    const index = this.dataSourcePAXS_Documentacion.data.indexOf(element);
    const formPAXS_Documentacion = this.PAXS_DocumentacionItems.controls[index] as FormGroup;
    formPAXS_Documentacion.get('Descripcion').disable()
    element.edit = true;
  }  

  async saveDetalle_Coord_Documentacion_PAXs(Folio: number) {
    this.dataSourcePAXS_Documentacion.data.forEach(async (d, index) => {
      const data = this.PAXS_DocumentacionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	    model.Coord__de_Vuelo__Documentacion = Folio;
      
      if (model.Folio === 0) {
        // Add Documentación
        model.Coordinacion_Documentacion = model.Coord__de_Vuelo__Documentacion;
		    let response = await this.Detalle_Coord_Documentacion_PAXsService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPAXS_Documentacion = this.PAXS_DocumentacionItemsByFolio(model.Folio);
        if (formPAXS_Documentacion.dirty) {
          // Update Documentación
          model.Coordinacion_Documentacion = model.Coord__de_Vuelo__Documentacion;
          let response = await this.Detalle_Coord_Documentacion_PAXsService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Documentación
        await this.Detalle_Coord_Documentacion_PAXsService.delete(model.Folio).toPromise();
      }
    });
  }



  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Coord__de_Vuelo__DocumentacionForm.disabled ? "Update" : this.operation;
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



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varEstatus_de_Confirmacion  ]) => {
          this.varEstatus_de_Confirmacion = varEstatus_de_Confirmacion;



          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Coord__de_Vuelo__DocumentacionForm.get('Numero_de_Vuelo').valueChanges.pipe(
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
	  this.Coord__de_Vuelo__DocumentacionForm.get('Numero_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
	  this.optionsNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = false;
      this.optionsNumero_de_Vuelo = of([]);
    });
    this.Coord__de_Vuelo__DocumentacionForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {

        this.AeronaveSeleccion = value;

        if(this.cargaMatriculaDesdeEdicion) { 
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Matricula = '" + value.trimLeft().trimRight() + "'");
        }

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

      if(this.AeronaveSeleccion != null && this.AeronaveSeleccion != "") {
        if(result.Aeronaves.length == 1) {
          this.Coord__de_Vuelo__DocumentacionForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
        }
      }

	    this.optionsMatricula = of(result?.Aeronaves);

      if(this.cargaMatriculaDesdeEdicion) {
        this.cargaMatriculaDesdeEdicion = false;
      }
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


   save() {
    this.saveData().then(() => {
         if(this.localStorageHelper.getItemFromLocalStorage("Coord__de_Vuelo__DocumentacionWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Coord__de_Vuelo__DocumentacionWindowsFloat", "0");
      setTimeout(()=>{ this.isLoading = false;
        this.spinner.hide('loading');
        window.close();}, 2000);
    }
    else{
      this.goToList();
      this.isLoading = false;
      this.spinner.hide('loading');
    }
    });
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Coord__de_Vuelo__DocumentacionForm.value;
      entity.Folio = this.model.Folio;
      entity.Numero_de_Vuelo = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');
      
      if(this.Coord__de_Vuelo__DocumentacionForm.get('Matricula').value != null) {
        entity.Matricula = this.Coord__de_Vuelo__DocumentacionForm.get('Matricula').value.Matricula;
      }
	    
      entity.Ruta_de_Vuelo = this.Coord__de_Vuelo__DocumentacionForm.get('Ruta_de_Vuelo').value;
      entity.Fecha_y_Hora_de_Salida = this.Coord__de_Vuelo__DocumentacionForm.get('Fecha_y_Hora_de_Salida').value;
      entity.Calificacion = this.Coord__de_Vuelo__DocumentacionForm.get('Calificacion').value;
	  
	  if (this.model.Folio > 0 ) {
        await this.Coord__de_Vuelo__DocumentacionService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Coord_Documentacion_Aeronave(this.model.Folio);  
        await this.saveDetalle_Coord_Documentacion_PAXs(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
        //return this.model.Folio;
      } else {
        await (this.Coord__de_Vuelo__DocumentacionService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Coord_Documentacion_Aeronave(id);
          await this.saveDetalle_Coord_Documentacion_PAXs(id);
	  await this.rulesAfterSave();

          setTimeout(()=>{ 
            this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
            this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
            //return id;
          }, 3000);     

        }));
      }
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
      this.rulesAfterSave();
    } 
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0 ) {
      this.Coord__de_Vuelo__DocumentacionForm.reset();
      this.model = new Coord__de_Vuelo__Documentacion(this.fb);
      this.Coord__de_Vuelo__DocumentacionForm = this.model.buildFormGroup();
      this.dataSourceAeronave_Documentacion = new MatTableDataSource<Detalle_Coord_Documentacion_Aeronave>();
      this.Aeronave_DocumentacionData = [];
      this.dataSourcePAXS_Documentacion = new MatTableDataSource<Detalle_Coord_Documentacion_PAXs>();
      this.PAXS_DocumentacionData = [];

    } else {
      this.router.navigate(['views/Coord__de_Vuelo__Documentacion/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }
  
  cancel() {
    if(this.localStorageHelper.getItemFromLocalStorage("Coord__de_Vuelo__DocumentacionWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Coord__de_Vuelo__DocumentacionWindowsFloat", "0");
      window.close();
    }
    else{
      this.goToList();
    }
  }

  goToList() {
    this.router.navigate(['/Coord__de_Vuelo__Documentacion/list'], { state: { data: this.dataListConfig } });
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

//INICIA - BRID:1900 - en neuvo al abrir pantalla ocultar numero de vuelo y asignar no requerido. - Autor: Ivan Yañez - Actualización: 3/23/2021 3:09:20 PM
if(  this.operation == 'New' ) {
this.brf.HideFieldOfForm(this.Coord__de_Vuelo__DocumentacionForm, "Numero_de_Vuelo"); this.brf.SetNotRequiredControl(this.Coord__de_Vuelo__DocumentacionForm, "Numero_de_Vuelo"); this.brf.SetNotRequiredControl(this.Coord__de_Vuelo__DocumentacionForm, "Numero_de_Vuelo");
} 
//TERMINA - BRID:1900


//INICIA - BRID:2059 - Al abrir la pantalla, en nuevo y modificar* Matricula, Ruta de Vuelo, Fecha y Hora de Salida, Calificación y Número de Vuelo siempre deshabilitados* Número de vuelo VISIBLE* Observaciones No Obligatorio - Autor: Ivan Yañez - Actualización: 3/26/2021 9:36:42 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Numero_de_Vuelo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Matricula', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Ruta_de_Vuelo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Fecha_y_Hora_de_Salida', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Calificacion', 0); this.brf.HideFieldOfForm(this.Coord__de_Vuelo__DocumentacionForm, "Numero_de_Vuelo"); this.brf.SetNotRequiredControl(this.Coord__de_Vuelo__DocumentacionForm, "Observaciones");
} 
//TERMINA - BRID:2059


//INICIA - BRID:2177 - acomodar campos de coordinación documentación - Autor: Administrador - Actualización: 3/30/2021 1:31:58 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:2177


//INICIA - BRID:2617 - Ocultar folioo - Autor: Lizeth Villa - Actualización: 4/7/2021 10:07:54 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Coord__de_Vuelo__DocumentacionForm, "Folio"); this.brf.SetNotRequiredControl(this.Coord__de_Vuelo__DocumentacionForm, "Folio");
} 
//TERMINA - BRID:2617


//INICIA - BRID:2831 - si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje con ajuste manual, no desactivar. - Autor: Administrador - Actualización: 5/3/2021 4:28:03 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
if( this.brf.EvaluaQuery("SELECT COUNT(*) from Solicitud_de_Vuelo where folio = "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" and estatus = 9	", 1, 'ABC123')==this.brf.TryParseInt('1', '1') && this.brf.EvaluaQuery("if ( "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 1 or "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 9 ) begin select 1 end	", 1, 'ABC123')!=this.brf.TryParseInt('1', '1') ) { this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Folio', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Numero_de_Vuelo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Matricula', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Ruta_de_Vuelo', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Fecha_y_Hora_de_Salida', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Calificacion', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Observaciones', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Folio', 0);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Coordinacion_Documentacion', 0);

this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Confirmado', 0);
this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Folio', 0);
this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Coordinacion_Documentacion', 0);
this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Confirmado', 0);  
 this.brf.ShowMessage("El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar");} else {}
} 
//TERMINA - BRID:2831


//INICIA - BRID:5683 - si el vuelo esta reabierto, habilitar campos - Autor: Lizeth Villa - Actualización: 9/3/2021 5:19:03 PM
if(  this.operation == 'Update' ) {
if( this.brf.EvaluaQuery("if ( ( "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 9) or  ( "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 12)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') && this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" ", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Matricula', 1);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Ruta_de_Vuelo', 1);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Fecha_y_Hora_de_Salida', 1);this.brf.SetEnabledControl(this.Coord__de_Vuelo__DocumentacionForm, 'Calificacion', 1);} else {}
} 
//TERMINA - BRID:5683

//rulesOnInit_ExecuteBusinessRulesEnd






  }
  
  async rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:1899 - en nuevo después de guardar actualizar numero de vuelo - Autor: Ivan Yañez - Actualización: 3/23/2021 3:07:55 PM
if(  this.operation == 'New' ) {
  await this.brf.EvaluaQueryAsync(" update Coord__de_Vuelo__Documentacion set Numero_de_Vuelo="+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" where Folio="+this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)+"", 1, "ABC123");
} 
//TERMINA - BRID:1899


//INICIA - BRID:2636 - al dar de alta o modificar, después de guardar ejecutar el SP: exec uspAsignaCalificacionCoordinacion "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+",5 - Autor: Felipe Rodríguez - Actualización: 4/8/2021 10:10:32 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this._SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+",5", 1, "ABC123");
} 
//TERMINA - BRID:2636

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
