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
import { Tipo_de_Bitacora_de_AeronaveService } from 'src/app/api-services/Tipo_de_Bitacora_de_Aeronave.service';
import { Tipo_de_Bitacora_de_Aeronave } from 'src/app/models/Tipo_de_Bitacora_de_Aeronave';
import { Detalle_Parametros_Tipo_Bitacora_AeronaveService } from 'src/app/api-services/Detalle_Parametros_Tipo_Bitacora_Aeronave.service';
import { Detalle_Parametros_Tipo_Bitacora_Aeronave } from 'src/app/models/Detalle_Parametros_Tipo_Bitacora_Aeronave';

import { Detalle_Componentes_Tipo_Bitacora_AeronaveService } from 'src/app/api-services/Detalle_Componentes_Tipo_Bitacora_Aeronave.service';
import { Detalle_Componentes_Tipo_Bitacora_Aeronave } from 'src/app/models/Detalle_Componentes_Tipo_Bitacora_Aeronave';

import { Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveService } from 'src/app/api-services/Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave.service';
import { Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave } from 'src/app/models/Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave';


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
  selector: 'app-Tipo_de_Bitacora_de_Aeronave',
  templateUrl: './Tipo_de_Bitacora_de_Aeronave.component.html',
  styleUrls: ['./Tipo_de_Bitacora_de_Aeronave.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Tipo_de_Bitacora_de_AeronaveComponent implements OnInit, AfterViewInit {
MRaddLectura_de_Altimetros: boolean = false;
MRaddComponentes: boolean = false;
MRaddParametros: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Tipo_de_Bitacora_de_AeronaveForm: FormGroup;
	public Editor = ClassicEditor;
	model: Tipo_de_Bitacora_de_Aeronave;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;







	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceParametros = new MatTableDataSource<Detalle_Parametros_Tipo_Bitacora_Aeronave>();
  ParametrosColumns = [
    { def: 'actions', hide: false },
    { def: 'Parametro', hide: false },
	
  ];
  ParametrosData: Detalle_Parametros_Tipo_Bitacora_Aeronave[] = [];
  dataSourceComponentes = new MatTableDataSource<Detalle_Componentes_Tipo_Bitacora_Aeronave>();
  ComponentesColumns = [
    { def: 'actions', hide: false },
    { def: 'Componente', hide: false },
	
  ];
  ComponentesData: Detalle_Componentes_Tipo_Bitacora_Aeronave[] = [];
  dataSourceLectura_de_Altimetros = new MatTableDataSource<Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave>();
  Lectura_de_AltimetrosColumns = [
    { def: 'actions', hide: false },
    { def: 'Concepto', hide: false },
	
  ];
  Lectura_de_AltimetrosData: Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Tipo_de_Bitacora_de_AeronaveService: Tipo_de_Bitacora_de_AeronaveService,
    private Detalle_Parametros_Tipo_Bitacora_AeronaveService: Detalle_Parametros_Tipo_Bitacora_AeronaveService,

    private Detalle_Componentes_Tipo_Bitacora_AeronaveService: Detalle_Componentes_Tipo_Bitacora_AeronaveService,

    private Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveService: Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveService,


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
    this.model = new Tipo_de_Bitacora_de_Aeronave(this.fb);
    this.Tipo_de_Bitacora_de_AeronaveForm = this.model.buildFormGroup();
    this.ParametrosItems.removeAt(0);
    this.ComponentesItems.removeAt(0);
    this.Lectura_de_AltimetrosItems.removeAt(0);
	
	this.Tipo_de_Bitacora_de_AeronaveForm.get('Clave').disable();
    this.Tipo_de_Bitacora_de_AeronaveForm.get('Clave').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceParametros.paginator = this.paginator;
    this.dataSourceComponentes.paginator = this.paginator;
    this.dataSourceLectura_de_Altimetros.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.ParametrosColumns.splice(0, 1);
          this.ComponentesColumns.splice(0, 1);
          this.Lectura_de_AltimetrosColumns.splice(0, 1);
		
          this.Tipo_de_Bitacora_de_AeronaveForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Tipo_de_Bitacora_de_Aeronave)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Tipo_de_Bitacora_de_AeronaveService.listaSelAll(0, 1, 'Tipo_de_Bitacora_de_Aeronave.Clave=' + id).toPromise();
	if (result.Tipo_de_Bitacora_de_Aeronaves.length > 0) {
        let fParametros = await this.Detalle_Parametros_Tipo_Bitacora_AeronaveService.listaSelAll(0, 1000,'Tipo_de_Bitacora_de_Aeronave.Clave=' + id).toPromise();
            this.ParametrosData = fParametros.Detalle_Parametros_Tipo_Bitacora_Aeronaves;
            this.loadParametros(fParametros.Detalle_Parametros_Tipo_Bitacora_Aeronaves);
            this.dataSourceParametros = new MatTableDataSource(fParametros.Detalle_Parametros_Tipo_Bitacora_Aeronaves);
            this.dataSourceParametros.paginator = this.paginator;
            this.dataSourceParametros.sort = this.sort;
        let fComponentes = await this.Detalle_Componentes_Tipo_Bitacora_AeronaveService.listaSelAll(0, 1000,'Tipo_de_Bitacora_de_Aeronave.Clave=' + id).toPromise();
            this.ComponentesData = fComponentes.Detalle_Componentes_Tipo_Bitacora_Aeronaves;
            this.loadComponentes(fComponentes.Detalle_Componentes_Tipo_Bitacora_Aeronaves);
            this.dataSourceComponentes = new MatTableDataSource(fComponentes.Detalle_Componentes_Tipo_Bitacora_Aeronaves);
            this.dataSourceComponentes.paginator = this.paginator;
            this.dataSourceComponentes.sort = this.sort;
        let fLectura_de_Altimetros = await this.Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveService.listaSelAll(0, 1000,'Tipo_de_Bitacora_de_Aeronave.Clave=' + id).toPromise();
            this.Lectura_de_AltimetrosData = fLectura_de_Altimetros.Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronaves;
            this.loadLectura_de_Altimetros(fLectura_de_Altimetros.Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronaves);
            this.dataSourceLectura_de_Altimetros = new MatTableDataSource(fLectura_de_Altimetros.Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronaves);
            this.dataSourceLectura_de_Altimetros.paginator = this.paginator;
            this.dataSourceLectura_de_Altimetros.sort = this.sort;
	  
        this.model.fromObject(result.Tipo_de_Bitacora_de_Aeronaves[0]);

		this.Tipo_de_Bitacora_de_AeronaveForm.markAllAsTouched();
		this.Tipo_de_Bitacora_de_AeronaveForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get ParametrosItems() {
    return this.Tipo_de_Bitacora_de_AeronaveForm.get('Detalle_Parametros_Tipo_Bitacora_AeronaveItems') as FormArray;
  }

  getParametrosColumns(): string[] {
    return this.ParametrosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadParametros(Parametros: Detalle_Parametros_Tipo_Bitacora_Aeronave[]) {
    Parametros.forEach(element => {
      this.addParametros(element);
    });
  }

  addParametrosToMR() {
    const Parametros = new Detalle_Parametros_Tipo_Bitacora_Aeronave(this.fb);
    this.ParametrosData.push(this.addParametros(Parametros));
    this.dataSourceParametros.data = this.ParametrosData;
    Parametros.edit = true;
    Parametros.isNew = true;
    const length = this.dataSourceParametros.data.length;
    const index = length - 1;
    const formParametros = this.ParametrosItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceParametros.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addParametros(entity: Detalle_Parametros_Tipo_Bitacora_Aeronave) {
    const Parametros = new Detalle_Parametros_Tipo_Bitacora_Aeronave(this.fb);
    this.ParametrosItems.push(Parametros.buildFormGroup());
    if (entity) {
      Parametros.fromObject(entity);
    }
	return entity;
  }  

  ParametrosItemsByFolio(Folio: number): FormGroup {
    return (this.Tipo_de_Bitacora_de_AeronaveForm.get('Detalle_Parametros_Tipo_Bitacora_AeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  ParametrosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceParametros.data.indexOf(element);
	let fb = this.ParametrosItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteParametros(element: any) {
    let index = this.dataSourceParametros.data.indexOf(element);
    this.ParametrosData[index].IsDeleted = true;
    this.dataSourceParametros.data = this.ParametrosData;
    this.dataSourceParametros._updateChangeSubscription();
    index = this.dataSourceParametros.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditParametros(element: any) {
    let index = this.dataSourceParametros.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.ParametrosData[index].IsDeleted = true;
      this.dataSourceParametros.data = this.ParametrosData;
      this.dataSourceParametros._updateChangeSubscription();
      index = this.ParametrosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveParametros(element: any) {
    const index = this.dataSourceParametros.data.indexOf(element);
    const formParametros = this.ParametrosItems.controls[index] as FormGroup;
    this.ParametrosData[index].Parametro = formParametros.value.Parametro;
	
    this.ParametrosData[index].isNew = false;
    this.dataSourceParametros.data = this.ParametrosData;
    this.dataSourceParametros._updateChangeSubscription();
  }
  
  editParametros(element: any) {
    const index = this.dataSourceParametros.data.indexOf(element);
    const formParametros = this.ParametrosItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_Parametros_Tipo_Bitacora_Aeronave(Folio: number) {
    this.dataSourceParametros.data.forEach(async (d, index) => {
      const data = this.ParametrosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Tipo_de_Bitacora_de_Aeronave = Folio;
	
      
      if (model.Folio === 0) {
        // Add Parámetros
		let response = await this.Detalle_Parametros_Tipo_Bitacora_AeronaveService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formParametros = this.ParametrosItemsByFolio(model.Folio);
        if (formParametros.dirty) {
          // Update Parámetros
          let response = await this.Detalle_Parametros_Tipo_Bitacora_AeronaveService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Parámetros
        await this.Detalle_Parametros_Tipo_Bitacora_AeronaveService.delete(model.Folio).toPromise();
      }
    });
  }


  get ComponentesItems() {
    return this.Tipo_de_Bitacora_de_AeronaveForm.get('Detalle_Componentes_Tipo_Bitacora_AeronaveItems') as FormArray;
  }

  getComponentesColumns(): string[] {
    return this.ComponentesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadComponentes(Componentes: Detalle_Componentes_Tipo_Bitacora_Aeronave[]) {
    Componentes.forEach(element => {
      this.addComponentes(element);
    });
  }

  addComponentesToMR() {
    const Componentes = new Detalle_Componentes_Tipo_Bitacora_Aeronave(this.fb);
    this.ComponentesData.push(this.addComponentes(Componentes));
    this.dataSourceComponentes.data = this.ComponentesData;
    Componentes.edit = true;
    Componentes.isNew = true;
    const length = this.dataSourceComponentes.data.length;
    const index = length - 1;
    const formComponentes = this.ComponentesItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceComponentes.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addComponentes(entity: Detalle_Componentes_Tipo_Bitacora_Aeronave) {
    const Componentes = new Detalle_Componentes_Tipo_Bitacora_Aeronave(this.fb);
    this.ComponentesItems.push(Componentes.buildFormGroup());
    if (entity) {
      Componentes.fromObject(entity);
    }
	return entity;
  }  

  ComponentesItemsByFolio(Folio: number): FormGroup {
    return (this.Tipo_de_Bitacora_de_AeronaveForm.get('Detalle_Componentes_Tipo_Bitacora_AeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  ComponentesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceComponentes.data.indexOf(element);
	let fb = this.ComponentesItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteComponentes(element: any) {
    let index = this.dataSourceComponentes.data.indexOf(element);
    this.ComponentesData[index].IsDeleted = true;
    this.dataSourceComponentes.data = this.ComponentesData;
    this.dataSourceComponentes._updateChangeSubscription();
    index = this.dataSourceComponentes.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditComponentes(element: any) {
    let index = this.dataSourceComponentes.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.ComponentesData[index].IsDeleted = true;
      this.dataSourceComponentes.data = this.ComponentesData;
      this.dataSourceComponentes._updateChangeSubscription();
      index = this.ComponentesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveComponentes(element: any) {
    const index = this.dataSourceComponentes.data.indexOf(element);
    const formComponentes = this.ComponentesItems.controls[index] as FormGroup;
    this.ComponentesData[index].Componente = formComponentes.value.Componente;
	
    this.ComponentesData[index].isNew = false;
    this.dataSourceComponentes.data = this.ComponentesData;
    this.dataSourceComponentes._updateChangeSubscription();
  }
  
  editComponentes(element: any) {
    const index = this.dataSourceComponentes.data.indexOf(element);
    const formComponentes = this.ComponentesItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_Componentes_Tipo_Bitacora_Aeronave(Folio: number) {
    this.dataSourceComponentes.data.forEach(async (d, index) => {
      const data = this.ComponentesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Tipo_de_Bitacora_de_Aeronave = Folio;
	
      
      if (model.Folio === 0) {
        // Add Componentes
		let response = await this.Detalle_Componentes_Tipo_Bitacora_AeronaveService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formComponentes = this.ComponentesItemsByFolio(model.Folio);
        if (formComponentes.dirty) {
          // Update Componentes
          let response = await this.Detalle_Componentes_Tipo_Bitacora_AeronaveService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Componentes
        await this.Detalle_Componentes_Tipo_Bitacora_AeronaveService.delete(model.Folio).toPromise();
      }
    });
  }


  get Lectura_de_AltimetrosItems() {
    return this.Tipo_de_Bitacora_de_AeronaveForm.get('Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveItems') as FormArray;
  }

  getLectura_de_AltimetrosColumns(): string[] {
    return this.Lectura_de_AltimetrosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadLectura_de_Altimetros(Lectura_de_Altimetros: Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave[]) {
    Lectura_de_Altimetros.forEach(element => {
      this.addLectura_de_Altimetros(element);
    });
  }

  addLectura_de_AltimetrosToMR() {
    const Lectura_de_Altimetros = new Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave(this.fb);
    this.Lectura_de_AltimetrosData.push(this.addLectura_de_Altimetros(Lectura_de_Altimetros));
    this.dataSourceLectura_de_Altimetros.data = this.Lectura_de_AltimetrosData;
    Lectura_de_Altimetros.edit = true;
    Lectura_de_Altimetros.isNew = true;
    const length = this.dataSourceLectura_de_Altimetros.data.length;
    const index = length - 1;
    const formLectura_de_Altimetros = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceLectura_de_Altimetros.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addLectura_de_Altimetros(entity: Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave) {
    const Lectura_de_Altimetros = new Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave(this.fb);
    this.Lectura_de_AltimetrosItems.push(Lectura_de_Altimetros.buildFormGroup());
    if (entity) {
      Lectura_de_Altimetros.fromObject(entity);
    }
	return entity;
  }  

  Lectura_de_AltimetrosItemsByFolio(Folio: number): FormGroup {
    return (this.Tipo_de_Bitacora_de_AeronaveForm.get('Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Lectura_de_AltimetrosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
	let fb = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteLectura_de_Altimetros(element: any) {
    let index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
    this.Lectura_de_AltimetrosData[index].IsDeleted = true;
    this.dataSourceLectura_de_Altimetros.data = this.Lectura_de_AltimetrosData;
    this.dataSourceLectura_de_Altimetros._updateChangeSubscription();
    index = this.dataSourceLectura_de_Altimetros.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditLectura_de_Altimetros(element: any) {
    let index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Lectura_de_AltimetrosData[index].IsDeleted = true;
      this.dataSourceLectura_de_Altimetros.data = this.Lectura_de_AltimetrosData;
      this.dataSourceLectura_de_Altimetros._updateChangeSubscription();
      index = this.Lectura_de_AltimetrosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveLectura_de_Altimetros(element: any) {
    const index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
    const formLectura_de_Altimetros = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;
    this.Lectura_de_AltimetrosData[index].Concepto = formLectura_de_Altimetros.value.Concepto;
	
    this.Lectura_de_AltimetrosData[index].isNew = false;
    this.dataSourceLectura_de_Altimetros.data = this.Lectura_de_AltimetrosData;
    this.dataSourceLectura_de_Altimetros._updateChangeSubscription();
  }
  
  editLectura_de_Altimetros(element: any) {
    const index = this.dataSourceLectura_de_Altimetros.data.indexOf(element);
    const formLectura_de_Altimetros = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave(Folio: number) {
    this.dataSourceLectura_de_Altimetros.data.forEach(async (d, index) => {
      const data = this.Lectura_de_AltimetrosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Tipo_de_Bitacora_de_Aeronave = Folio;
	
      
      if (model.Folio === 0) {
        // Add Lectura de Altímetros
		let response = await this.Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formLectura_de_Altimetros = this.Lectura_de_AltimetrosItemsByFolio(model.Folio);
        if (formLectura_de_Altimetros.dirty) {
          // Update Lectura de Altímetros
          let response = await this.Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Lectura de Altímetros
        await this.Detalle_Lectura_Altimetros_Tipo_Bitacora_AeronaveService.delete(model.Folio).toPromise();
      }
    });
  }



  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Clave = +params.get('id');

        if (this.model.Clave) {
          this.operation = !this.Tipo_de_Bitacora_de_AeronaveForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Clave);
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
        .subscribe(([  ]) => {




          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {




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
      const entity = this.Tipo_de_Bitacora_de_AeronaveForm.value;
      entity.Clave = this.model.Clave;
	  	  
	  
	  if (this.model.Clave > 0 ) {
        await this.Tipo_de_Bitacora_de_AeronaveService.update(this.model.Clave, entity).toPromise();

        await this.saveDetalle_Parametros_Tipo_Bitacora_Aeronave(this.model.Clave);  
        await this.saveDetalle_Componentes_Tipo_Bitacora_Aeronave(this.model.Clave);  
        await this.saveDetalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave(this.model.Clave);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Clave.toString());
        this.spinner.hide('loading');
        return this.model.Clave;
      } else {
        await (this.Tipo_de_Bitacora_de_AeronaveService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Parametros_Tipo_Bitacora_Aeronave(id);
          await this.saveDetalle_Componentes_Tipo_Bitacora_Aeronave(id);
          await this.saveDetalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave(id);

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
    if (this.model.Clave === 0 ) {
      this.Tipo_de_Bitacora_de_AeronaveForm.reset();
      this.model = new Tipo_de_Bitacora_de_Aeronave(this.fb);
      this.Tipo_de_Bitacora_de_AeronaveForm = this.model.buildFormGroup();
      this.dataSourceParametros = new MatTableDataSource<Detalle_Parametros_Tipo_Bitacora_Aeronave>();
      this.ParametrosData = [];
      this.dataSourceComponentes = new MatTableDataSource<Detalle_Componentes_Tipo_Bitacora_Aeronave>();
      this.ComponentesData = [];
      this.dataSourceLectura_de_Altimetros = new MatTableDataSource<Detalle_Lectura_Altimetros_Tipo_Bitacora_Aeronave>();
      this.Lectura_de_AltimetrosData = [];

    } else {
      this.router.navigate(['views/Tipo_de_Bitacora_de_Aeronave/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Clave = 0;

  }
  
  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Tipo_de_Bitacora_de_Aeronave/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
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
