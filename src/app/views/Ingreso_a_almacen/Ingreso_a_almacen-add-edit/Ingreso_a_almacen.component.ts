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
import { Ingreso_a_almacenService } from 'src/app/api-services/Ingreso_a_almacen.service';
import { Ingreso_a_almacen } from 'src/app/models/Ingreso_a_almacen';
import { Categoria_de_PartesService } from 'src/app/api-services/Categoria_de_Partes.service';
import { Categoria_de_Partes } from 'src/app/models/Categoria_de_Partes';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { Estatus_de_RequeridoService } from 'src/app/api-services/Estatus_de_Requerido.service';
import { Estatus_de_Requerido } from 'src/app/models/Estatus_de_Requerido';
import { Condicion_del_itemService } from 'src/app/api-services/Condicion_del_item.service';
import { Condicion_del_item } from 'src/app/models/Condicion_del_item';
import { Detalle_Cargar_inspecciones_de_calidadService } from 'src/app/api-services/Detalle_Cargar_inspecciones_de_calidad.service';
import { Detalle_Cargar_inspecciones_de_calidad } from 'src/app/models/Detalle_Cargar_inspecciones_de_calidad';
import { Documentos_RequeridosService } from 'src/app/api-services/Documentos_Requeridos.service';
import { Documentos_Requeridos } from 'src/app/models/Documentos_Requeridos';


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
  selector: 'app-Ingreso_a_almacen',
  templateUrl: './Ingreso_a_almacen.component.html',
  styleUrls: ['./Ingreso_a_almacen.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Ingreso_a_almacenComponent implements OnInit, AfterViewInit {
MRaddCargar_inspecciones_de_calidad: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Ingreso_a_almacenForm: FormGroup;
	public Editor = ClassicEditor;
	model: Ingreso_a_almacen;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsCategoria: Observable<Categoria_de_Partes[]>;
	hasOptionsCategoria: boolean;
	isLoadingCategoria: boolean;
	optionsUnidad_CS: Observable<Unidad[]>;
	hasOptionsUnidad_CS: boolean;
	isLoadingUnidad_CS: boolean;
	optionsUnidad_CR: Observable<Unidad[]>;
	hasOptionsUnidad_CR: boolean;
	isLoadingUnidad_CR: boolean;
	public varEstatus_de_Requerido: Estatus_de_Requerido[] = [];
	public varCondicion_del_item: Condicion_del_item[] = [];
  Inspeccion_de_Calidad_Detalle_Cargar_inspecciones_de_calidad: string[] = [];
	public varDocumentos_Requeridos: Documentos_Requeridos[] = [];

  autoNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad = new FormControl();
  SelectedNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad: string[] = [];
  isLoadingNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad: boolean;
  searchNombre_de_documento_Detalle_Cargar_inspecciones_de_calidadCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceCargar_inspecciones_de_calidad = new MatTableDataSource<Detalle_Cargar_inspecciones_de_calidad>();
  Cargar_inspecciones_de_calidadColumns = [
    { def: 'actions', hide: false },
    { def: 'Inspeccion_de_Calidad', hide: false },
    { def: 'Nombre_de_documento', hide: false },
	
  ];
  Cargar_inspecciones_de_calidadData: Detalle_Cargar_inspecciones_de_calidad[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Ingreso_a_almacenService: Ingreso_a_almacenService,
    private Categoria_de_PartesService: Categoria_de_PartesService,
    private UnidadService: UnidadService,
    private Estatus_de_RequeridoService: Estatus_de_RequeridoService,
    private Condicion_del_itemService: Condicion_del_itemService,
    private Detalle_Cargar_inspecciones_de_calidadService: Detalle_Cargar_inspecciones_de_calidadService,
    private Documentos_RequeridosService: Documentos_RequeridosService,


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
    this.model = new Ingreso_a_almacen(this.fb);
    this.Ingreso_a_almacenForm = this.model.buildFormGroup();
    this.Cargar_inspecciones_de_calidadItems.removeAt(0);
	
	this.Ingreso_a_almacenForm.get('Folio').disable();
    this.Ingreso_a_almacenForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceCargar_inspecciones_de_calidad.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Cargar_inspecciones_de_calidadColumns.splice(0, 1);
		
          this.Ingreso_a_almacenForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Ingreso_a_almacen)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Ingreso_a_almacenForm, 'Categoria', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Ingreso_a_almacenForm, 'Unidad_CS', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Ingreso_a_almacenForm, 'Unidad_CR', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Ingreso_a_almacenService.listaSelAll(0, 1, 'Ingreso_a_almacen.Folio=' + id).toPromise();
	if (result.Ingreso_a_almacens.length > 0) {
        let fCargar_inspecciones_de_calidad = await this.Detalle_Cargar_inspecciones_de_calidadService.listaSelAll(0, 1000,'Ingreso_a_almacen.Folio=' + id).toPromise();
            this.Cargar_inspecciones_de_calidadData = fCargar_inspecciones_de_calidad.Detalle_Cargar_inspecciones_de_calidads;
            this.loadCargar_inspecciones_de_calidad(fCargar_inspecciones_de_calidad.Detalle_Cargar_inspecciones_de_calidads);
            this.dataSourceCargar_inspecciones_de_calidad = new MatTableDataSource(fCargar_inspecciones_de_calidad.Detalle_Cargar_inspecciones_de_calidads);
            this.dataSourceCargar_inspecciones_de_calidad.paginator = this.paginator;
            this.dataSourceCargar_inspecciones_de_calidad.sort = this.sort;
	  
        this.model.fromObject(result.Ingreso_a_almacens[0]);
        this.Ingreso_a_almacenForm.get('Categoria').setValue(
          result.Ingreso_a_almacens[0].Categoria_Categoria_de_Partes.Categoria,
          { onlySelf: false, emitEvent: true }
        );
        this.Ingreso_a_almacenForm.get('Unidad_CS').setValue(
          result.Ingreso_a_almacens[0].Unidad_CS_Unidad.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Ingreso_a_almacenForm.get('Unidad_CR').setValue(
          result.Ingreso_a_almacens[0].Unidad_CR_Unidad.Descripcion,
          { onlySelf: false, emitEvent: true }
        );

		this.Ingreso_a_almacenForm.markAllAsTouched();
		this.Ingreso_a_almacenForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Cargar_inspecciones_de_calidadItems() {
    return this.Ingreso_a_almacenForm.get('Detalle_Cargar_inspecciones_de_calidadItems') as FormArray;
  }

  getCargar_inspecciones_de_calidadColumns(): string[] {
    return this.Cargar_inspecciones_de_calidadColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadCargar_inspecciones_de_calidad(Cargar_inspecciones_de_calidad: Detalle_Cargar_inspecciones_de_calidad[]) {
    Cargar_inspecciones_de_calidad.forEach(element => {
      this.addCargar_inspecciones_de_calidad(element);
    });
  }

  addCargar_inspecciones_de_calidadToMR() {
    const Cargar_inspecciones_de_calidad = new Detalle_Cargar_inspecciones_de_calidad(this.fb);
    this.Cargar_inspecciones_de_calidadData.push(this.addCargar_inspecciones_de_calidad(Cargar_inspecciones_de_calidad));
    this.dataSourceCargar_inspecciones_de_calidad.data = this.Cargar_inspecciones_de_calidadData;
    Cargar_inspecciones_de_calidad.edit = true;
    Cargar_inspecciones_de_calidad.isNew = true;
    const length = this.dataSourceCargar_inspecciones_de_calidad.data.length;
    const index = length - 1;
    const formCargar_inspecciones_de_calidad = this.Cargar_inspecciones_de_calidadItems.controls[index] as FormGroup;
	this.addFilterToControlNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad(formCargar_inspecciones_de_calidad.controls.Nombre_de_documento, index);
    
    const page = Math.ceil(this.dataSourceCargar_inspecciones_de_calidad.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addCargar_inspecciones_de_calidad(entity: Detalle_Cargar_inspecciones_de_calidad) {
    const Cargar_inspecciones_de_calidad = new Detalle_Cargar_inspecciones_de_calidad(this.fb);
    this.Cargar_inspecciones_de_calidadItems.push(Cargar_inspecciones_de_calidad.buildFormGroup());
    if (entity) {
      Cargar_inspecciones_de_calidad.fromObject(entity);
    }
	return entity;
  }  

  Cargar_inspecciones_de_calidadItemsByFolio(Folio: number): FormGroup {
    return (this.Ingreso_a_almacenForm.get('Detalle_Cargar_inspecciones_de_calidadItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Cargar_inspecciones_de_calidadItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
	let fb = this.Cargar_inspecciones_de_calidadItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteCargar_inspecciones_de_calidad(element: any) {
    let index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    this.Cargar_inspecciones_de_calidadData[index].IsDeleted = true;
    this.dataSourceCargar_inspecciones_de_calidad.data = this.Cargar_inspecciones_de_calidadData;
    this.dataSourceCargar_inspecciones_de_calidad._updateChangeSubscription();
    index = this.dataSourceCargar_inspecciones_de_calidad.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditCargar_inspecciones_de_calidad(element: any) {
    let index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Cargar_inspecciones_de_calidadData[index].IsDeleted = true;
      this.dataSourceCargar_inspecciones_de_calidad.data = this.Cargar_inspecciones_de_calidadData;
      this.dataSourceCargar_inspecciones_de_calidad._updateChangeSubscription();
      index = this.Cargar_inspecciones_de_calidadData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveCargar_inspecciones_de_calidad(element: any) {
    const index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    const formCargar_inspecciones_de_calidad = this.Cargar_inspecciones_de_calidadItems.controls[index] as FormGroup;
    if (this.Cargar_inspecciones_de_calidadData[index].Nombre_de_documento !== formCargar_inspecciones_de_calidad.value.Nombre_de_documento && formCargar_inspecciones_de_calidad.value.Nombre_de_documento > 0) {
		let documentos_requeridos = await this.Documentos_RequeridosService.getById(formCargar_inspecciones_de_calidad.value.Nombre_de_documento).toPromise();
        this.Cargar_inspecciones_de_calidadData[index].Nombre_de_documento_Documentos_Requeridos = documentos_requeridos;
    }
    this.Cargar_inspecciones_de_calidadData[index].Nombre_de_documento = formCargar_inspecciones_de_calidad.value.Nombre_de_documento;
	
    this.Cargar_inspecciones_de_calidadData[index].isNew = false;
    this.dataSourceCargar_inspecciones_de_calidad.data = this.Cargar_inspecciones_de_calidadData;
    this.dataSourceCargar_inspecciones_de_calidad._updateChangeSubscription();
  }
  
  editCargar_inspecciones_de_calidad(element: any) {
    const index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    const formCargar_inspecciones_de_calidad = this.Cargar_inspecciones_de_calidadItems.controls[index] as FormGroup;
	this.SelectedNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad[index] = this.dataSourceCargar_inspecciones_de_calidad.data[index].Nombre_de_documento_Documentos_Requeridos.Nombre_de_Documento;
    this.addFilterToControlNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad(formCargar_inspecciones_de_calidad.controls.Nombre_de_documento, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Cargar_inspecciones_de_calidad(Folio: number) {
    this.dataSourceCargar_inspecciones_de_calidad.data.forEach(async (d, index) => {
      const data = this.Cargar_inspecciones_de_calidadItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Ingreso_a_almacen = Folio;
	
	  const FolioInspeccion_de_Calidad = await this.saveInspeccion_de_Calidad_Detalle_Cargar_inspecciones_de_calidad(index);
      d.Inspeccion_de_Calidad = FolioInspeccion_de_Calidad > 0 ? FolioInspeccion_de_Calidad : null;  
      
      if (model.Folio === 0) {
        // Add Cargar inspecciones de calidad
		let response = await this.Detalle_Cargar_inspecciones_de_calidadService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formCargar_inspecciones_de_calidad = this.Cargar_inspecciones_de_calidadItemsByFolio(model.Folio);
        if (formCargar_inspecciones_de_calidad.dirty) {
          // Update Cargar inspecciones de calidad
          let response = await this.Detalle_Cargar_inspecciones_de_calidadService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Cargar inspecciones de calidad
        await this.Detalle_Cargar_inspecciones_de_calidadService.delete(model.Folio).toPromise();
      }
    });
  }

  getInspeccion_de_Calidad_Detalle_Cargar_inspecciones_de_calidad(element: any) {
    const index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    const formDetalle_Cargar_inspecciones_de_calidad = this.Cargar_inspecciones_de_calidadItems.controls[index] as FormGroup;
    return formDetalle_Cargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.value && formDetalle_Cargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.value !== '' ?
      formDetalle_Cargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.value.files[0].name : '';
  }

  async getInspeccion_de_Calidad_Detalle_Cargar_inspecciones_de_calidadClick(element: any) {
    const index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    const formDetalle_Cargar_inspecciones_de_calidad = this.Cargar_inspecciones_de_calidadItems.controls[index] as FormGroup;
    if (formDetalle_Cargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.valid
      && formDetalle_Cargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.dirty) {
      const Inspeccion_de_Calidad = formDetalle_Cargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Inspeccion_de_Calidad);
      this.helperService.dowloadFileFromArray(byteArray, Inspeccion_de_Calidad.name);
    }
  }

  removeInspeccion_de_Calidad_Detalle_Cargar_inspecciones_de_calidad(element: any) {
    ;
    const index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    this.Inspeccion_de_Calidad_Detalle_Cargar_inspecciones_de_calidad[index] = '';
    this.Cargar_inspecciones_de_calidadData[index].Inspeccion_de_Calidad = 0;

    const formDetalle_Cargar_inspecciones_de_calidad = this.Cargar_inspecciones_de_calidadItems.controls[index] as FormGroup;
    if (formDetalle_Cargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.valid
      && formDetalle_Cargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.dirty) {
      formDetalle_Cargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile = null;
    }
  } 

  async saveInspeccion_de_Calidad_Detalle_Cargar_inspecciones_de_calidad(index: number): Promise<number> {
    const formCargar_inspecciones_de_calidad = this.Cargar_inspecciones_de_calidadItems.controls[index] as FormGroup;
    if (formCargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.valid
      && formCargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.dirty) {
      const Inspeccion_de_Calidad = formCargar_inspecciones_de_calidad.controls.Inspeccion_de_CalidadFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Inspeccion_de_Calidad);
      const spartanFile = {
        File: byteArray,
        Description: Inspeccion_de_Calidad.name,
        Date_Time: Inspeccion_de_Calidad.lastModifiedDate,
        File_Size: Inspeccion_de_Calidad.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return 0;
    }
  }

  hasInspeccion_de_Calidad_Detalle_Cargar_inspecciones_de_calidad(element) {
    return this.getInspeccion_de_Calidad_Detalle_Cargar_inspecciones_de_calidad(element) !== '' ||
      (element.Inspeccion_de_Calidad_Spartane_File && element.Inspeccion_de_Calidad_Spartane_File.File_Id > 0);
  }
  public selectNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad[index] = event.option.viewValue;
	let fgr = this.Ingreso_a_almacenForm.controls.Detalle_Cargar_inspecciones_de_calidadItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Nombre_de_documento.setValue(event.option.value);
    this.displayFnNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad(element);
  }  
  
  displayFnNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad(this, element) {
    const index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    return this.SelectedNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad[index];
  }
  updateOptionNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad(event, element: any) {
    const index = this.dataSourceCargar_inspecciones_de_calidad.data.indexOf(element);
    this.SelectedNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad[index] = event.source.viewValue;
  } 

	_filterNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad(filter: any): Observable<Documentos_Requeridos> {
		const where = filter !== '' ?  "Documentos_Requeridos.Nombre_de_Documento like '%" + filter + "%'" : '';
		return this.Documentos_RequeridosService.listaSelAll(0, 20, where);
	}

  addFilterToControlNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad = true;
        return this._filterNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad(value || '');
      })
    ).subscribe(result => {
      this.varDocumentos_Requeridos = result.Documentos_Requeridoss;
      this.isLoadingNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad = false;
      this.searchNombre_de_documento_Detalle_Cargar_inspecciones_de_calidadCompleted = true;
      this.SelectedNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad[index] = this.varDocumentos_Requeridos.length === 0 ? '' : this.SelectedNombre_de_documento_Detalle_Cargar_inspecciones_de_calidad[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Ingreso_a_almacenForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Estatus_de_RequeridoService.getAll());
    observablesArray.push(this.Condicion_del_itemService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varEstatus_de_Requerido , varCondicion_del_item  ]) => {
          this.varEstatus_de_Requerido = varEstatus_de_Requerido;
          this.varCondicion_del_item = varCondicion_del_item;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Ingreso_a_almacenForm.get('Categoria').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCategoria = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Categoria_de_PartesService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Categoria_de_PartesService.listaSelAll(0, 20, '');
          return this.Categoria_de_PartesService.listaSelAll(0, 20,
            "Categoria_de_Partes.Categoria like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Categoria_de_PartesService.listaSelAll(0, 20,
          "Categoria_de_Partes.Categoria like '%" + value.Categoria.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCategoria = false;
      this.hasOptionsCategoria = result?.Categoria_de_Partess?.length > 0;
	  this.Ingreso_a_almacenForm.get('Categoria').setValue(result?.Categoria_de_Partess[0], { onlySelf: true, emitEvent: false });
	  this.optionsCategoria = of(result?.Categoria_de_Partess);
    }, error => {
      this.isLoadingCategoria = false;
      this.hasOptionsCategoria = false;
      this.optionsCategoria = of([]);
    });
    this.Ingreso_a_almacenForm.get('Unidad_CS').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUnidad_CS = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.UnidadService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.UnidadService.listaSelAll(0, 20, '');
          return this.UnidadService.listaSelAll(0, 20,
            "Unidad.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.UnidadService.listaSelAll(0, 20,
          "Unidad.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingUnidad_CS = false;
      this.hasOptionsUnidad_CS = result?.Unidads?.length > 0;
	  this.Ingreso_a_almacenForm.get('Unidad_CS').setValue(result?.Unidads[0], { onlySelf: true, emitEvent: false });
	  this.optionsUnidad_CS = of(result?.Unidads);
    }, error => {
      this.isLoadingUnidad_CS = false;
      this.hasOptionsUnidad_CS = false;
      this.optionsUnidad_CS = of([]);
    });
    this.Ingreso_a_almacenForm.get('Unidad_CR').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUnidad_CR = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.UnidadService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.UnidadService.listaSelAll(0, 20, '');
          return this.UnidadService.listaSelAll(0, 20,
            "Unidad.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.UnidadService.listaSelAll(0, 20,
          "Unidad.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingUnidad_CR = false;
      this.hasOptionsUnidad_CR = result?.Unidads?.length > 0;
	  this.Ingreso_a_almacenForm.get('Unidad_CR').setValue(result?.Unidads[0], { onlySelf: true, emitEvent: false });
	  this.optionsUnidad_CR = of(result?.Unidads);
    }, error => {
      this.isLoadingUnidad_CR = false;
      this.hasOptionsUnidad_CR = false;
      this.optionsUnidad_CR = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Se_mantiene_el_No__de_Parte': {
        this.Estatus_de_RequeridoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Requerido = x.Estatus_de_Requeridos;
        });
        break;
      }
      case 'Condicion': {
        this.Condicion_del_itemService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCondicion_del_item = x.Condicion_del_items;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

displayFnCategoria(option: Categoria_de_Partes) {
    return option?.Categoria;
  }
displayFnUnidad_CS(option: Unidad) {
    return option?.Descripcion;
  }
displayFnUnidad_CR(option: Unidad) {
    return option?.Descripcion;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Ingreso_a_almacenForm.value;
      entity.Folio = this.model.Folio;
      entity.Categoria = this.Ingreso_a_almacenForm.get('Categoria').value.Folio;
      entity.Unidad_CS = this.Ingreso_a_almacenForm.get('Unidad_CS').value.Clave;
      entity.Unidad_CR = this.Ingreso_a_almacenForm.get('Unidad_CR').value.Clave;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Ingreso_a_almacenService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Cargar_inspecciones_de_calidad(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Ingreso_a_almacenService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Cargar_inspecciones_de_calidad(id);

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
      this.Ingreso_a_almacenForm.reset();
      this.model = new Ingreso_a_almacen(this.fb);
      this.Ingreso_a_almacenForm = this.model.buildFormGroup();
      this.dataSourceCargar_inspecciones_de_calidad = new MatTableDataSource<Detalle_Cargar_inspecciones_de_calidad>();
      this.Cargar_inspecciones_de_calidadData = [];

    } else {
      this.router.navigate(['views/Ingreso_a_almacen/add']);
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
    window.close();
    this.router.navigate(['/Ingreso_a_almacen/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  maxNumber(event, num: number): boolean {
    if (event.target.value.length > (num - 1)) {      
      return false;
    }
    return true;
 }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      No__de_parte___Descripcion_ExecuteBusinessRules(): void {
        //No__de_parte___Descripcion_FieldExecuteBusinessRulesEnd
    }
    Categoria_ExecuteBusinessRules(): void {
        //Categoria_FieldExecuteBusinessRulesEnd
    }
    Cant__Solicitada_ExecuteBusinessRules(): void {
        //Cant__Solicitada_FieldExecuteBusinessRulesEnd
    }
    Unidad_CS_ExecuteBusinessRules(): void {
        //Unidad_CS_FieldExecuteBusinessRulesEnd
    }
    Cant__Recibida_ExecuteBusinessRules(): void {
        //Cant__Recibida_FieldExecuteBusinessRulesEnd
    }
    Unidad_CR_ExecuteBusinessRules(): void {
        //Unidad_CR_FieldExecuteBusinessRulesEnd
    }
    Costo_de_Material__ExecuteBusinessRules(): void {
        //Costo_de_Material__FieldExecuteBusinessRulesEnd
    }
    No__de_Factura_ExecuteBusinessRules(): void {
        //No__de_Factura_FieldExecuteBusinessRulesEnd
    }
    Costo_en_Factura__ExecuteBusinessRules(): void {
        //Costo_en_Factura__FieldExecuteBusinessRulesEnd
    }
    Tipo_de_Cambio_ExecuteBusinessRules(): void {
        //Tipo_de_Cambio_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Factura_ExecuteBusinessRules(): void {
        //Fecha_de_Factura_FieldExecuteBusinessRulesEnd
    }
    Fecha_Estimada_de_llegada_ExecuteBusinessRules(): void {
        //Fecha_Estimada_de_llegada_FieldExecuteBusinessRulesEnd
    }
    Fecha_Real_de_llegada_ExecuteBusinessRules(): void {
        //Fecha_Real_de_llegada_FieldExecuteBusinessRulesEnd
    }
    Se_mantiene_el_No__de_Parte_ExecuteBusinessRules(): void {
        //Se_mantiene_el_No__de_Parte_FieldExecuteBusinessRulesEnd
    }
    No__de_Serie_ExecuteBusinessRules(): void {
        //No__de_Serie_FieldExecuteBusinessRulesEnd
    }
    No__de_Lote_ExecuteBusinessRules(): void {
        //No__de_Lote_FieldExecuteBusinessRulesEnd
    }
    Horas_acumuladas_ExecuteBusinessRules(): void {
        //Horas_acumuladas_FieldExecuteBusinessRulesEnd
    }
    Ciclos_acumulados_ExecuteBusinessRules(): void {
        //Ciclos_acumulados_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_vencimiento_ExecuteBusinessRules(): void {
        //Fecha_de_vencimiento_FieldExecuteBusinessRulesEnd
    }
    Ubicacion_en_Almacen_ExecuteBusinessRules(): void {
        //Ubicacion_en_Almacen_FieldExecuteBusinessRulesEnd
    }
    Linea_de_Almacen_ExecuteBusinessRules(): void {
        //Linea_de_Almacen_FieldExecuteBusinessRulesEnd
    }
    Ubicacion_ExecuteBusinessRules(): void {
        //Ubicacion_FieldExecuteBusinessRulesEnd
    }
    Condicion_ExecuteBusinessRules(): void {
        //Condicion_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Expiracion_ExecuteBusinessRules(): void {
        //Fecha_de_Expiracion_FieldExecuteBusinessRulesEnd
    }
    Control_de_Temperatura_ExecuteBusinessRules(): void {
        //Control_de_Temperatura_FieldExecuteBusinessRulesEnd
    }
    Identificacion_de_Herramienta_ExecuteBusinessRules(): void {
        //Identificacion_de_Herramienta_FieldExecuteBusinessRulesEnd
    }
    No__Parte_Nuevo_ExecuteBusinessRules(): void {
        //No__Parte_Nuevo_FieldExecuteBusinessRulesEnd
    }
    IdIngresoAlmacen_ExecuteBusinessRules(): void {
        //IdIngresoAlmacen_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4145 - tamaño de campos almacén - Autor: Lizeth Villa - Actualización: 8/6/2021 12:09:24 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4145


//INICIA - BRID:4556 - Ocultar campo de folio ingreso a almacen - Autor: ANgel Acuña - Actualización: 8/2/2021 10:32:34 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Ingreso_a_almacenForm, "Folio"); this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Folio");
} 
//TERMINA - BRID:4556


//INICIA - BRID:4557 - Quitar requerido ingreso al almacen - Autor: ANgel Acuña - Actualización: 8/2/2021 10:34:15 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "No__de_parte___Descripcion");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Cant__Solicitada");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Unidad_CS");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Cant__Recibida");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Unidad_CR");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Costo_de_Material_");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "No__de_Factura");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Costo_en_Factura_");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Tipo_de_Cambio");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Fecha_de_Factura");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Fecha_Estimada_de_llegada");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Fecha_Real_de_llegada");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Se_mantiene_el_No__de_Parte");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "No__de_Serie");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "No__de_Lote");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Horas_acumuladas");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Ciclos_acumulados");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Fecha_de_vencimiento");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Ubicacion_en_Almacen");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Linea_de_Almacen");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Ubicacion");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Condicion");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Fecha_de_Expiracion");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Control_de_Temperatura");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Identificacion_de_Herramienta");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Folio");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Inspeccion_de_Calidad");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "No__Parte_Nuevo");this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "Cargar_inspecciones_de_calidad");
} 
//TERMINA - BRID:4557


//INICIA - BRID:4559 - deshabilitar campos ing reso de almacen - Autor: ANgel Acuña - Actualización: 8/4/2021 7:34:18 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'No__de_parte___Descripcion', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Cant__Solicitada', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Unidad_CS', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Costo_de_Material_', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Fecha_Estimada_de_llegada', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Categoria', 0);
} 
//TERMINA - BRID:4559


//INICIA - BRID:4626 - Ocultar campo - Autor: Eliud Hernandez - Actualización: 8/3/2021 6:20:57 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Ingreso_a_almacenForm, "IdIngresoAlmacen"); this.brf.SetNotRequiredControl(this.Ingreso_a_almacenForm, "IdIngresoAlmacen");
} 
//TERMINA - BRID:4626


//INICIA - BRID:4627 - Traer valores manual - Autor: Eliud Hernandez - Actualización: 8/4/2021 3:26:10 PM
if(  this.operation == 'New' ) {
this.brf.SetValueFromQuery(this.Ingreso_a_almacenForm,"No__de_parte___Descripcion",this.brf.EvaluaQuery("select Codigo_Descripcion from Detalle_de_Generacion_de_OC where Generacion_de_Orden_de_Compras=47	", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Ingreso_a_almacenForm,"Cant__Solicitada",this.brf.EvaluaQuery("select Cantidad from Detalle_de_Generacion_de_OC where Generacion_de_Orden_de_Compras=47", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Ingreso_a_almacenForm,"Unidad_CS",this.brf.EvaluaQuery(" select Unidad from Detalle_de_Generacion_de_OC where Generacion_de_Orden_de_Compras=47	", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Ingreso_a_almacenForm,"Costo_de_Material_",this.brf.EvaluaQuery("select Costo__Pesos from Detalle_de_Generacion_de_OC where Generacion_de_Orden_de_Compras=47", 1, "ABC123"),1,"ABC123"); this.brf.SetValueFromQuery(this.Ingreso_a_almacenForm,"Fecha_Estimada_de_llegada",this.brf.EvaluaQuery("select Fecha_de_Entrega from Detalle_de_Gestion_de_aprobacion where folio =47", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:4627


//INICIA - BRID:7112 - Llenar MR con documentos requeridos dependiendo de la categoria - Autor: Lizeth Villa - Actualización: 10/13/2021 7:11:57 PM
if(  this.operation == 'New' ) {
this.brf.FillMultiRenglonfromQuery(this.dataSourceCargar_inspecciones_de_calidad,"Detalle_Cargar_inspecciones_de_calidad",1,"ABC123");
} 
//TERMINA - BRID:7112


//INICIA - BRID:7157 - Al editar, bloquear todos los campos excepto MR  - Autor: Lizeth Villa - Actualización: 10/19/2021 11:26:46 AM
if(  this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'No__de_parte___Descripcion', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Cant__Solicitada', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Unidad_CS', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Cant__Recibida', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Unidad_CR', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Costo_de_Material_', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'No__de_Factura', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Costo_en_Factura_', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Tipo_de_Cambio', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Fecha_de_Factura', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Fecha_Estimada_de_llegada', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Fecha_Real_de_llegada', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Se_mantiene_el_No__de_Parte', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'No__de_Serie', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'No__de_Lote', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Horas_acumuladas', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Ciclos_acumulados', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Fecha_de_vencimiento', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Ubicacion_en_Almacen', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Linea_de_Almacen', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Ubicacion', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Condicion', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Fecha_de_Expiracion', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Control_de_Temperatura', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Identificacion_de_Herramienta', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'No__Parte_Nuevo', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'IdIngresoAlmacen', 0);this.brf.SetEnabledControl(this.Ingreso_a_almacenForm, 'Categoria', 0);
} 
//TERMINA - BRID:7157

//rulesOnInit_ExecuteBusinessRulesEnd








  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:4572 - Insert en mr Detalle_de_Solicitud_de_partes_materiales_y_herramientas despues de guardar, en nuevocon codigo manual, NO DESACTIVAR - Autor: Lizeth Villa - Actualización: 8/4/2021 7:02:49 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery("EXEC usp_InsDetalle_de_Solicitud_de_partes_materiales_y_herramientas GLOBAL[KeyValueInserted], FLD[No__de_parte___Descripcion], 'FLD[Fecha_de_vencimiento]', FLD[Ubicacion_en_Almacen]", 1, "ABC123");
} 
//TERMINA - BRID:4572


//INICIA - BRID:4628 - Cambiar  - Autor: Eliud Hernandez - Actualización: 8/3/2021 8:35:18 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery("UPDATE Detalle_Listado_de_compras_en_proceso SET IdIngresoAlmacen = GLOBAL[KeyValueInserted] where folio = IdIngresoAlmacen@LC@@LB@ ", 1, "ABC123");
} 
//TERMINA - BRID:4628

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
