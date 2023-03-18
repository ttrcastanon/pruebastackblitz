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
import { Inspeccion_Entrada_AeronaveService } from 'src/app/api-services/Inspeccion_Entrada_Aeronave.service';
import { Inspeccion_Entrada_Aeronave } from 'src/app/models/Inspeccion_Entrada_Aeronave';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { Detalle_Inspeccion_Entrada_AeronaveService } from 'src/app/api-services/Detalle_Inspeccion_Entrada_Aeronave.service';
import { Detalle_Inspeccion_Entrada_Aeronave } from 'src/app/models/Detalle_Inspeccion_Entrada_Aeronave';
import { ItemsService } from 'src/app/api-services/Items.service';
import { Items } from 'src/app/models/Items';
import { Condicion_del_itemService } from 'src/app/api-services/Condicion_del_item.service';
import { Condicion_del_item } from 'src/app/models/Condicion_del_item';


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
import { NULL } from 'sass';

@Component({
  selector: 'app-Inspeccion_Entrada_Aeronave',
  templateUrl: './Inspeccion_Entrada_Aeronave.component.html',
  styleUrls: ['./Inspeccion_Entrada_Aeronave.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Inspeccion_Entrada_AeronaveComponent implements OnInit, AfterViewInit {
MRaddInspeccion_de_los_items: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Inspeccion_Entrada_AeronaveForm: FormGroup;
	public Editor = ClassicEditor;
	model: Inspeccion_Entrada_Aeronave;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsReporte: Observable<Crear_Reporte[]>;
	hasOptionsReporte: boolean;
	isLoadingReporte: boolean;
	optionsN_Orden_de_Trabajo: Observable<Orden_de_Trabajo[]>;
	hasOptionsN_Orden_de_Trabajo: boolean;
	isLoadingN_Orden_de_Trabajo: boolean;
	optionsUsuario_que_Registra: Observable<Spartan_User[]>;
	hasOptionsUsuario_que_Registra: boolean;
	isLoadingUsuario_que_Registra: boolean;
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;
	optionsCliente: Observable<Cliente[]>;
	hasOptionsCliente: boolean;
	isLoadingCliente: boolean;
	public varRespuesta: Respuesta[] = [];
	public varItems: Items[] = [];
	public varCondicion_del_item: Condicion_del_item[] = [];
  Fotografia_Detalle_Inspeccion_Entrada_Aeronave: string[] = [];

  autoItems_Detalle_Inspeccion_Entrada_Aeronave = new FormControl();
  SelectedItems_Detalle_Inspeccion_Entrada_Aeronave: string[] = [];
  isLoadingItems_Detalle_Inspeccion_Entrada_Aeronave: boolean;
  searchItems_Detalle_Inspeccion_Entrada_AeronaveCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceInspeccion_de_los_items = new MatTableDataSource<Detalle_Inspeccion_Entrada_Aeronave>();
  Inspeccion_de_los_itemsColumns = [
    { def: 'actions', hide: false },
    { def: 'Items', hide: false },
    { def: 'Condicion_del_item', hide: false },
    { def: 'Fotografia', hide: false },
    { def: 'Observaciones', hide: false },
    { def: 'IdReporte', hide: true },
    { def: 'Notificado', hide: true },
	
  ];
  Inspeccion_de_los_itemsData: Detalle_Inspeccion_Entrada_Aeronave[] = [];
	
	today = new Date;
	consult: boolean = false;
  UsuarioQueRegistra: any = null;
  ReporteFiltro: any = null;
  NOrdenDeTrabajo: any = null;
  ModeloSeleccionado: any = null;
  ClienteSeleccionado: any = null;
  dataSetReportesPorOT: any = null;
  NOrdendeTrabajoValueBusqueda: any = null;
  ButtonSaveInspeccionItems: boolean = true;
  FromEditar: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Inspeccion_Entrada_AeronaveService: Inspeccion_Entrada_AeronaveService,
    private Crear_ReporteService: Crear_ReporteService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Spartan_UserService: Spartan_UserService,
    private ModelosService: ModelosService,
    private ClienteService: ClienteService,
    private RespuestaService: RespuestaService,
    private Detalle_Inspeccion_Entrada_AeronaveService: Detalle_Inspeccion_Entrada_AeronaveService,
    private ItemsService: ItemsService,
    private Condicion_del_itemService: Condicion_del_itemService,


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
    this.model = new Inspeccion_Entrada_Aeronave(this.fb);
    this.Inspeccion_Entrada_AeronaveForm = this.model.buildFormGroup();
    this.Inspeccion_de_los_itemsItems.removeAt(0);
	
	this.Inspeccion_Entrada_AeronaveForm.get('Folio').disable();
    this.Inspeccion_Entrada_AeronaveForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
      
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceInspeccion_de_los_items.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Inspeccion_de_los_itemsColumns.splice(0, 1);
		
          this.Inspeccion_Entrada_AeronaveForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Inspeccion_Entrada_Aeronave)
      .subscribe((response) => {
        this.permisos = response;
      });

	//this.brf.updateValidatorsToControl(this.Inspeccion_Entrada_AeronaveForm, 'Reporte', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Inspeccion_Entrada_AeronaveForm, 'N_Orden_de_Trabajo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Inspeccion_Entrada_AeronaveForm, 'Usuario_que_Registra', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Inspeccion_Entrada_AeronaveForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Inspeccion_Entrada_AeronaveForm, 'Cliente', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Inspeccion_Entrada_AeronaveService.listaSelAll(0, 1, 'Inspeccion_Entrada_Aeronave.Folio=' + id).toPromise();
	if (result.Inspeccion_Entrada_Aeronaves.length > 0) {

        let fInspeccion_de_los_items = await this.Detalle_Inspeccion_Entrada_AeronaveService.listaSelAll(0, 1000,'Inspeccion_Entrada_Aeronave.Folio=' + id).toPromise();
        this.Inspeccion_de_los_itemsData = fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves;
        this.loadInspeccion_de_los_items(fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves);
        this.dataSourceInspeccion_de_los_items = new MatTableDataSource(fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves);
        this.dataSourceInspeccion_de_los_items.paginator = this.paginator;
        this.dataSourceInspeccion_de_los_items.sort = this.sort;
	  
        this.model.fromObject(result.Inspeccion_Entrada_Aeronaves[0]);
        this.Inspeccion_Entrada_AeronaveForm.get('Reporte').setValue(
          result.Inspeccion_Entrada_Aeronaves[0].Reporte_Crear_Reporte.No_Reporte,
          { onlySelf: false, emitEvent: true }
        );
        this.Inspeccion_Entrada_AeronaveForm.get('N_Orden_de_Trabajo').setValue(
          result.Inspeccion_Entrada_Aeronaves[0].N_Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
          { onlySelf: false, emitEvent: true }
        );
        this.Inspeccion_Entrada_AeronaveForm.get('Usuario_que_Registra').setValue(
          result.Inspeccion_Entrada_Aeronaves[0].Usuario_que_Registra_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );
        this.Inspeccion_Entrada_AeronaveForm.get('Modelo').setValue(
          result.Inspeccion_Entrada_Aeronaves[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Inspeccion_Entrada_AeronaveForm.get('Cliente').setValue(
          result.Inspeccion_Entrada_Aeronaves[0].Cliente_Cliente.Razon_Social,
          { onlySelf: false, emitEvent: true }
        );

		this.Inspeccion_Entrada_AeronaveForm.markAllAsTouched();
		this.Inspeccion_Entrada_AeronaveForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Inspeccion_de_los_itemsItems() {
    return this.Inspeccion_Entrada_AeronaveForm.get('Detalle_Inspeccion_Entrada_AeronaveItems') as FormArray;
  }

  getInspeccion_de_los_itemsColumns(): string[] {
    return this.Inspeccion_de_los_itemsColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadInspeccion_de_los_items(Inspeccion_de_los_items: Detalle_Inspeccion_Entrada_Aeronave[]) {
    Inspeccion_de_los_items.forEach(element => {
      this.addInspeccion_de_los_items(element);
    });
  }

  addInspeccion_de_los_itemsToMR() {
    const Inspeccion_de_los_items = new Detalle_Inspeccion_Entrada_Aeronave(this.fb);
    this.Inspeccion_de_los_itemsData.push(this.addInspeccion_de_los_items(Inspeccion_de_los_items));
    this.dataSourceInspeccion_de_los_items.data = this.Inspeccion_de_los_itemsData;
    Inspeccion_de_los_items.edit = true;
    Inspeccion_de_los_items.isNew = true;
    const length = this.dataSourceInspeccion_de_los_items.data.length;
    const index = length - 1;
    const formInspeccion_de_los_items = this.Inspeccion_de_los_itemsItems.controls[index] as FormGroup;
	this.addFilterToControlItems_Detalle_Inspeccion_Entrada_Aeronave(formInspeccion_de_los_items.controls.Items, index);
    
    const page = Math.ceil(this.dataSourceInspeccion_de_los_items.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addInspeccion_de_los_items(entity: Detalle_Inspeccion_Entrada_Aeronave) {
    const Inspeccion_de_los_items = new Detalle_Inspeccion_Entrada_Aeronave(this.fb);
    this.Inspeccion_de_los_itemsItems.push(Inspeccion_de_los_items.buildFormGroup());
    if (entity) {
      Inspeccion_de_los_items.fromObject(entity);
    }
	return entity;
  }  

  Inspeccion_de_los_itemsItemsByFolio(Folio: number): FormGroup {
    return (this.Inspeccion_Entrada_AeronaveForm.get('Detalle_Inspeccion_Entrada_AeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Inspeccion_de_los_itemsItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
	let fb = this.Inspeccion_de_los_itemsItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteInspeccion_de_los_items(element: any) {
    let index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    this.Inspeccion_de_los_itemsData[index].IsDeleted = true;
    this.dataSourceInspeccion_de_los_items.data = this.Inspeccion_de_los_itemsData;
    this.dataSourceInspeccion_de_los_items._updateChangeSubscription();
    index = this.dataSourceInspeccion_de_los_items.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditInspeccion_de_los_items(element: any) {

    this.FromEditar = false;

    let index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Inspeccion_de_los_itemsData[index].IsDeleted = true;
      this.dataSourceInspeccion_de_los_items.data = this.Inspeccion_de_los_itemsData;
      this.dataSourceInspeccion_de_los_items._updateChangeSubscription();
      index = this.Inspeccion_de_los_itemsData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveInspeccion_de_los_items(element: any) {
    const index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    const formInspeccion_de_los_items = this.Inspeccion_de_los_itemsItems.controls[index] as FormGroup;
    if (this.Inspeccion_de_los_itemsData[index].Items !== formInspeccion_de_los_items.value.Items && formInspeccion_de_los_items.value.Items > 0) {
		let items = await this.ItemsService.getById(formInspeccion_de_los_items.value.Items).toPromise();
        this.Inspeccion_de_los_itemsData[index].Items_Items = items;
    }
    this.Inspeccion_de_los_itemsData[index].Items = formInspeccion_de_los_items.value.Items;
    this.Inspeccion_de_los_itemsData[index].Condicion_del_item = formInspeccion_de_los_items.value.Condicion_del_item;
    this.Inspeccion_de_los_itemsData[index].Condicion_del_item_Condicion_del_item = formInspeccion_de_los_items.value.Condicion_del_item !== '' ?
     this.varCondicion_del_item.filter(d => d.Folio === formInspeccion_de_los_items.value.Condicion_del_item)[0] : null ;	
    this.Inspeccion_de_los_itemsData[index].Observaciones = formInspeccion_de_los_items.value.Observaciones;
    this.Inspeccion_de_los_itemsData[index].IdReporte = formInspeccion_de_los_items.value.IdReporte;
    this.Inspeccion_de_los_itemsData[index].Notificado = formInspeccion_de_los_items.value.Notificado;
	
    this.Inspeccion_de_los_itemsData[index].isNew = false;
    this.dataSourceInspeccion_de_los_items.data = this.Inspeccion_de_los_itemsData;
    this.dataSourceInspeccion_de_los_items._updateChangeSubscription();
  }
  
  editInspeccion_de_los_items(element: any) {
    this.FromEditar = true;
    const index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    const formInspeccion_de_los_items = this.Inspeccion_de_los_itemsItems.controls[index] as FormGroup;
	this.SelectedItems_Detalle_Inspeccion_Entrada_Aeronave[index] = this.dataSourceInspeccion_de_los_items.data[index].Items_Items.Descripcion;
    this.addFilterToControlItems_Detalle_Inspeccion_Entrada_Aeronave(formInspeccion_de_los_items.controls.Items, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Inspeccion_Entrada_Aeronave(Folio: number) {
    this.dataSourceInspeccion_de_los_items.data.forEach(async (d, index) => {
    const data = this.Inspeccion_de_los_itemsItems.controls[index] as FormGroup;
    let model = data.getRawValue();
	  model.Inspeccion_Entrada_Aeronave = Folio;
    model.id_Inspeccion_Entrada_Aeronave = Folio;
    model.Folio = model.Folio == null ? 0 : model.Folio;
	
	  const FolioFotografia = await this.saveFotografia_Detalle_Inspeccion_Entrada_Aeronave(index);
      d.Fotografia = FolioFotografia > 0 ? FolioFotografia : null;  
      
      if (model.Folio === 0) {
        // Add Realizar inspección de los siguientes ítems
		let response = await this.Detalle_Inspeccion_Entrada_AeronaveService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formInspeccion_de_los_items = this.Inspeccion_de_los_itemsItemsByFolio(model.Folio);
        if (formInspeccion_de_los_items.dirty) {
          // Update Realizar inspección de los siguientes ítems
          let response = await this.Detalle_Inspeccion_Entrada_AeronaveService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Realizar inspección de los siguientes ítems
        await this.Detalle_Inspeccion_Entrada_AeronaveService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectItems_Detalle_Inspeccion_Entrada_Aeronave(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedItems_Detalle_Inspeccion_Entrada_Aeronave[index] = event.option.viewValue;
	let fgr = this.Inspeccion_Entrada_AeronaveForm.controls.Detalle_Inspeccion_Entrada_AeronaveItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Items.setValue(event.option.value);
    this.displayFnItems_Detalle_Inspeccion_Entrada_Aeronave(element);
  }  
  
  displayFnItems_Detalle_Inspeccion_Entrada_Aeronave(this, element) {
    const index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    return this.SelectedItems_Detalle_Inspeccion_Entrada_Aeronave[index];
  }
  updateOptionItems_Detalle_Inspeccion_Entrada_Aeronave(event, element: any) {
    const index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    this.SelectedItems_Detalle_Inspeccion_Entrada_Aeronave[index] = event.source.viewValue;
  } 

	_filterItems_Detalle_Inspeccion_Entrada_Aeronave(filter: any): Observable<Items> {
		const where = filter !== '' ?  "Items.Descripcion like '%" + filter + "%'" : '';
		return this.ItemsService.listaSelAll(0, 20, where);
	}

  addFilterToControlItems_Detalle_Inspeccion_Entrada_Aeronave(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingItems_Detalle_Inspeccion_Entrada_Aeronave = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingItems_Detalle_Inspeccion_Entrada_Aeronave = true;
        return this._filterItems_Detalle_Inspeccion_Entrada_Aeronave(value || '');
      })
    ).subscribe(result => {
      this.varItems = result.Itemss;
      this.isLoadingItems_Detalle_Inspeccion_Entrada_Aeronave = false;
      this.searchItems_Detalle_Inspeccion_Entrada_AeronaveCompleted = true;
      this.SelectedItems_Detalle_Inspeccion_Entrada_Aeronave[index] = this.varItems.length === 0 ? '' : this.SelectedItems_Detalle_Inspeccion_Entrada_Aeronave[index];
    });
  }
  getFotografia_Detalle_Inspeccion_Entrada_Aeronave(element: any) {
    const index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    const formDetalle_Inspeccion_Entrada_Aeronave = this.Inspeccion_de_los_itemsItems.controls[index] as FormGroup;
    return formDetalle_Inspeccion_Entrada_Aeronave.controls.FotografiaFile.value && formDetalle_Inspeccion_Entrada_Aeronave.controls.FotografiaFile.value !== '' ?
      formDetalle_Inspeccion_Entrada_Aeronave.controls.FotografiaFile.value.files[0].name : '';
  }

  async getFotografia_Detalle_Inspeccion_Entrada_AeronaveClick(element: any) {
    const index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    const formDetalle_Inspeccion_Entrada_Aeronave = this.Inspeccion_de_los_itemsItems.controls[index] as FormGroup;
    if (formDetalle_Inspeccion_Entrada_Aeronave.controls.FotografiaFile.valid
      && formDetalle_Inspeccion_Entrada_Aeronave.controls.FotografiaFile.dirty) {
      const Fotografia = formDetalle_Inspeccion_Entrada_Aeronave.controls.FotografiaFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Fotografia);
      this.helperService.dowloadFileFromArray(byteArray, Fotografia.name);
    }
  }

  removeFotografia_Detalle_Inspeccion_Entrada_Aeronave(element: any) {
    const index = this.dataSourceInspeccion_de_los_items.data.indexOf(element);
    this.Fotografia_Detalle_Inspeccion_Entrada_Aeronave[index] = '';
    this.Inspeccion_de_los_itemsData[index].Fotografia = 0;

    const formDetalle_Inspeccion_Entrada_Aeronave = this.Inspeccion_de_los_itemsItems.controls[index] as FormGroup;
    if (formDetalle_Inspeccion_Entrada_Aeronave.controls.FotografiaFile.valid
      && formDetalle_Inspeccion_Entrada_Aeronave.controls.FotografiaFile.dirty) {
      formDetalle_Inspeccion_Entrada_Aeronave.controls.FotografiaFile = null;
    }
  } 

  async saveFotografia_Detalle_Inspeccion_Entrada_Aeronave(index: number): Promise<number> {
    const formInspeccion_de_los_items = this.Inspeccion_de_los_itemsItems.controls[index] as FormGroup;
    if (formInspeccion_de_los_items.controls.FotografiaFile.valid
      && formInspeccion_de_los_items.controls.FotografiaFile.dirty) {
      const Fotografia = formInspeccion_de_los_items.controls.FotografiaFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Fotografia);
      const spartanFile = {
        File: byteArray,
        Description: Fotografia.name,
        Date_Time: Fotografia.lastModifiedDate,
        File_Size: Fotografia.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return 0;
    }
  }

  hasFotografia_Detalle_Inspeccion_Entrada_Aeronave(element) {
    return this.getFotografia_Detalle_Inspeccion_Entrada_Aeronave(element) !== '' ||
      (element.Fotografia_Spartane_File && element.Fotografia_Spartane_File.File_Id > 0);
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Inspeccion_Entrada_AeronaveForm.disabled ? "Update" : this.operation;
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

  CargarValoresControlReporte(NOrdendeTrabajoValue) {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Crear_ReporteService.listaSelAll(0, 1000, ` N_Orden_de_Trabajo = ${NOrdendeTrabajoValue} `));  
    forkJoin(observablesArray)
        .subscribe(([ varRespuesta ]) => {
          this.dataSetReportesPorOT = varRespuesta;
          this.optionsReporte = of(this.dataSetReportesPorOT?.Crear_Reportes);
          this.NOrdendeTrabajoValueBusqueda = NOrdendeTrabajoValue;
        });
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.RespuestaService.getAll());
    observablesArray.push(this.Condicion_del_itemService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varRespuesta , varCondicion_del_item  ]) => {
          this.varRespuesta = varRespuesta;
          this.varCondicion_del_item = varCondicion_del_item;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Inspeccion_Entrada_AeronaveForm.get('Reporte').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingReporte = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.ReporteFiltro = value;

        if(this.dataSetReportesPorOT != null) {
          let valorBusqueda = value;
          let valorOT = value.N_Orden_de_Trabajo == undefined ? this.NOrdendeTrabajoValueBusqueda: value.N_Orden_de_Trabajo;

          if(valorBusqueda.No_Reporte != undefined){
            valorBusqueda = valorBusqueda.No_Reporte;
          }
          return this.Crear_ReporteService.listaSelAll(0, 1000, "Crear_Reporte.No_Reporte like '%" + valorBusqueda.trimLeft().trimRight() + "%' " + 
            `AND N_Orden_de_Trabajo = ${valorOT}`);
        }

        if (!value) return this.Crear_ReporteService.listaSelAll(0, 0, '');
        if (typeof value === 'string') {
          if (value === '') return this.Crear_ReporteService.listaSelAll(0, 0, '');
          return this.Crear_ReporteService.listaSelAll(0, 20,
            "Crear_Reporte.No_Reporte like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Crear_ReporteService.listaSelAll(0, 20,
          "Crear_Reporte.No_Reporte like '%" + value.No_Reporte.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingReporte = false;
      this.hasOptionsReporte = result?.Crear_Reportes?.length > 0;
      if(this.ReporteFiltro != null && this.ReporteFiltro != "") {
        this.Inspeccion_Entrada_AeronaveForm.get('Reporte').setValue(result?.Crear_Reportes[0], { onlySelf: true, emitEvent: false });
      }
	    this.optionsReporte = of(result?.Crear_Reportes);
    }, error => {
      this.isLoadingReporte = false;
      this.hasOptionsReporte = false;
      this.optionsReporte = of([]);
      
      if(this.dataSetReportesPorOT?.Crear_Reportes.length > 0) {
        this.optionsReporte = of(this.dataSetReportesPorOT?.Crear_Reportes);
      }
      
    });
    this.Inspeccion_Entrada_AeronaveForm.get('N_Orden_de_Trabajo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingN_Orden_de_Trabajo = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.NOrdenDeTrabajo = value;
        if (!value) return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Orden_de_TrabajoService.listaSelAll(0, 20, '');
          return this.Orden_de_TrabajoService.listaSelAll(0, 20,
            "Orden_de_Trabajo.numero_de_orden like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Orden_de_TrabajoService.listaSelAll(0, 20,
          "Orden_de_Trabajo.numero_de_orden like '%" + value.numero_de_orden.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingN_Orden_de_Trabajo = false;
      this.hasOptionsN_Orden_de_Trabajo = result?.Orden_de_Trabajos?.length > 0;

      if(this.NOrdenDeTrabajo != null && this.NOrdenDeTrabajo != "") {
        this.Inspeccion_Entrada_AeronaveForm.get('N_Orden_de_Trabajo').setValue(result?.Orden_de_Trabajos[0], { onlySelf: true, emitEvent: false });
      }

	    this.optionsN_Orden_de_Trabajo = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingN_Orden_de_Trabajo = false;
      this.hasOptionsN_Orden_de_Trabajo = false;
      this.optionsN_Orden_de_Trabajo = of([]);
    });
    this.Inspeccion_Entrada_AeronaveForm.get('Usuario_que_Registra').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUsuario_que_Registra = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.UsuarioQueRegistra = value;
        if (!value) return this.Spartan_UserService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Spartan_UserService.listaSelAll(0, 20, '');
          return this.Spartan_UserService.listaSelAll(0, 20,
            "Spartan_User.Name = '" + value.trimLeft().trimRight() + "'");
        }
        return this.Spartan_UserService.listaSelAll(0, 20,
          "Spartan_User.Name like '%" + value.Name.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingUsuario_que_Registra = false;
      this.hasOptionsUsuario_que_Registra = result?.Spartan_Users?.length > 0;

      if(this.UsuarioQueRegistra != null && this.UsuarioQueRegistra != "") {
        this.Inspeccion_Entrada_AeronaveForm.get('Usuario_que_Registra').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      }
	    
	    this.optionsUsuario_que_Registra = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingUsuario_que_Registra = false;
      this.hasOptionsUsuario_que_Registra = false;
      this.optionsUsuario_que_Registra = of([]);
    });
    this.Inspeccion_Entrada_AeronaveForm.get('Modelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingModelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.ModeloSeleccionado = value;
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

      if(this.ModeloSeleccionado != null && this.ModeloSeleccionado != "") {
        this.Inspeccion_Entrada_AeronaveForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      }
	    
	    this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Inspeccion_Entrada_AeronaveForm.get('Cliente').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCliente = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.ClienteSeleccionado = value;
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
      this.isLoadingCliente = false;
      this.hasOptionsCliente = result?.Clientes?.length > 0;

      if(this.ClienteSeleccionado != null && this.ClienteSeleccionado != "") {
        this.Inspeccion_Entrada_AeronaveForm.get('Cliente').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });
      }
	    
	    this.optionsCliente = of(result?.Clientes);
    }, error => {
      this.isLoadingCliente = false;
      this.hasOptionsCliente = false;
      this.optionsCliente = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Se_realizo_evidencia_filmografica': {
        this.RespuestaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRespuesta = x.Respuestas;
        });
        break;
      }
      case 'Condicion_del_item': {
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

displayFnReporte(option: Crear_Reporte) {
    return option?.No_Reporte;
  }
displayFnN_Orden_de_Trabajo(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
displayFnUsuario_que_Registra(option: Spartan_User) {
    return option?.Name;
  }
displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
displayFnCliente(option: Cliente) {
    return option?.Razon_Social;
  }


  async save() {
    await this.saveData();
    setTimeout(()=>{ this.goToList(); }, 2000);
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Inspeccion_Entrada_AeronaveForm.value;
      entity.Folio = this.model.Folio;
      entity.Reporte = this.Inspeccion_Entrada_AeronaveForm.get('Reporte').value.Folio;
      entity.N_Orden_de_Trabajo = this.Inspeccion_Entrada_AeronaveForm.get('N_Orden_de_Trabajo').value.Folio;
      
      entity.Fecha_de_Entrega = this.Inspeccion_Entrada_AeronaveForm.get('Fecha_de_Entrega').value
      entity.Fecha_de_Registro = this.Inspeccion_Entrada_AeronaveForm.get('Fecha_de_Registro').value
      entity.Hora_de_Registro = this.Inspeccion_Entrada_AeronaveForm.get('Hora_de_Registro').value;	 
      entity.Usuario_que_Registra = this.Inspeccion_Entrada_AeronaveForm.controls.Usuario_que_Registra.value.Id_User;
      entity.Aeronave = this.Inspeccion_Entrada_AeronaveForm.controls.Aeronave.value;
      entity.Modelo = this.Inspeccion_Entrada_AeronaveForm.controls.Modelo.value.Clave;
      entity.Numero_de_Serie = this.Inspeccion_Entrada_AeronaveForm.controls.Numero_de_Serie.value;
      entity.Cliente = this.Inspeccion_Entrada_AeronaveForm.controls.Cliente.value.Clave;
      entity.Se_realizo_evidencia_filmografica = this.Inspeccion_Entrada_AeronaveForm.controls.Se_realizo_evidencia_filmografica.value;
      entity.Cant__Combustible_en_la_recepcion = this.Inspeccion_Entrada_AeronaveForm.controls.Cant__Combustible_en_la_recepcion.value;
      entity.Razon_de_ingreso = this.Inspeccion_Entrada_AeronaveForm.controls.Razon_de_ingreso.value;
	  
	  if (this.model.Folio > 0 ) {
        await this.Inspeccion_Entrada_AeronaveService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Inspeccion_Entrada_Aeronave(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
      } else {
        await (this.Inspeccion_Entrada_AeronaveService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Inspeccion_Entrada_Aeronave(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
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
      this.Inspeccion_Entrada_AeronaveForm.reset();
      this.model = new Inspeccion_Entrada_Aeronave(this.fb);
      this.Inspeccion_Entrada_AeronaveForm = this.model.buildFormGroup();
      this.dataSourceInspeccion_de_los_items = new MatTableDataSource<Detalle_Inspeccion_Entrada_Aeronave>();
      this.Inspeccion_de_los_itemsData = [];

    } else {
      this.router.navigate(['views/Inspeccion_Entrada_Aeronave/add']);
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
    this.router.navigate(['/Inspeccion_Entrada_Aeronave/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      async Reporte_ExecuteBusinessRules(): Promise<void> {

      //INICIA - BRID:4545 - Obtener OT a partir de reporte - Autor: Jose Caballero - Actualización: 9/8/2021 4:17:40 PM
      if( this.Inspeccion_Entrada_AeronaveForm.get("Reporte").value != '' ) { 
        //await this.brf.SetValueFromQueryAsync(this.Inspeccion_Entrada_AeronaveForm, "N_Orden_de_Trabajo", `Select N_Orden_de_Trabajo from crear_reporte Where Folio = 'FLD[Reporte]'` ,1,"ABC123");
      } else {}
      //TERMINA - BRID:4545

      //Reporte_FieldExecuteBusinessRulesEnd

    }

    async N_Orden_de_Trabajo_ExecuteBusinessRules(): Promise<void> {

      let NOrdendeTrabajoValue = null;

      //INICIA - BRID:4483 - Cargar campos automáticos al selecciona una OT - Autor: Jose Caballero - Actualización: 9/8/2021 5:03:31 PM
      if( this.Inspeccion_Entrada_AeronaveForm.get('N_Orden_de_Trabajo').value != '' ) { 
        NOrdendeTrabajoValue = this.Inspeccion_Entrada_AeronaveForm.get('N_Orden_de_Trabajo').value.Folio;

        await this.brf.SetValueFromQueryAsync(this.Inspeccion_Entrada_AeronaveForm,"Aeronave", `Select Matricula from Orden_de_Trabajo Where Folio = ${NOrdendeTrabajoValue}`, 1, "ABC123");
        await this.brf.SetValueFromQueryAsync(this.Inspeccion_Entrada_AeronaveForm,"Numero_de_Serie", `Select Numero_de_Serie from aeronave Where Matricula = (Select Matricula from Orden_de_Trabajo Where Folio = ${NOrdendeTrabajoValue})`, 1, "ABC123"); 
        await this.brf.SetValueFromQueryAsync(this.Inspeccion_Entrada_AeronaveForm,"Cliente", `Select Razon_Social From Cliente Where Clave = (Select Cliente from aeronave Where Matricula = (Select Matricula from Orden_de_Trabajo Where Folio =${NOrdendeTrabajoValue}))`,1,"ABC123"); 
        await this.brf.SetValueFromQueryAsync(this.Inspeccion_Entrada_AeronaveForm,"Fecha_de_Entrega",`select convert (varchar(11), Fecha_de_entrega ,105) from Orden_de_Trabajo Where Folio = ${NOrdendeTrabajoValue}`, 1, "ABC123");
      
        this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Reporte', 1);

        this.CargarValoresControlReporte(NOrdendeTrabajoValue);

      } else {}
      //TERMINA - BRID:4483
      

      //INICIA - BRID:6107 - Cargar modelo (tiene código manual) - Autor: Jose Caballero - Actualización: 9/8/2021 5:05:20 PM
      //await this.brf.SetValueFromQueryAsync(this.Inspeccion_Entrada_AeronaveForm,"Modelo", `SELECT Clave, Descripcion FROM Modelos WHERE Clave =(SELECT modelo FROM Aeronave where matricula ='FLD[Matricula]'`, 1, "ABC123");
      let matricula = await this.brf.EvaluaQueryAsync(`Select Matricula from Orden_de_Trabajo Where Folio =${NOrdendeTrabajoValue}`, 1, "ABC123");
      let modelo = await this.brf.EvaluaQueryAsync(`SELECT Descripcion FROM Modelos WHERE Clave =(SELECT modelo FROM Aeronave where matricula ='${matricula}')`, 1, "ABC123");
      this.brf.SetValueControl(this.Inspeccion_Entrada_AeronaveForm, "Modelo", modelo);
      //TERMINA - BRID:6107

      //N_Orden_de_Trabajo_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_Entrega_ExecuteBusinessRules(): void {
        //Fecha_de_Entrega_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Registro_ExecuteBusinessRules(): void {
        //Fecha_de_Registro_FieldExecuteBusinessRulesEnd
    }
    Hora_de_Registro_ExecuteBusinessRules(): void {
        //Hora_de_Registro_FieldExecuteBusinessRulesEnd
    }
    Usuario_que_Registra_ExecuteBusinessRules(): void {
        //Usuario_que_Registra_FieldExecuteBusinessRulesEnd
    }

    async Aeronave_ExecuteBusinessRules(): Promise<void> {

      //INICIA - BRID:3139 - al seleccionar matricula traer los datos marcados en el RFP - Autor: Jose Caballero - Actualización: 9/8/2021 4:26:08 PM
      await this.brf.SetValueFromQueryAsync(this.Inspeccion_Entrada_AeronaveForm,"Numero_de_Serie", `SELECT Numero_de_serie FROM Aeronave WITH(NOLOCK) WHERE Matricula = 'FLD[Aeronave]'`, 1, "ABC123"); 
      await this.brf.SetValueFromQueryAsync(this.Inspeccion_Entrada_AeronaveForm,"Cliente", `SELECT Razon_Social FROM Cliente WITH(NOLOCK) WHERE Clave =(SELECT Cliente FROM Aeronave WITH(NOLOCK) WHERE Matricula = 'FLD[Aeronave]')`,1,"ABC123");
      //TERMINA - BRID:3139

      //Aeronave_FieldExecuteBusinessRulesEnd

    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    Numero_de_Serie_ExecuteBusinessRules(): void {
        //Numero_de_Serie_FieldExecuteBusinessRulesEnd
    }
    Cliente_ExecuteBusinessRules(): void {
        //Cliente_FieldExecuteBusinessRulesEnd
    }
    Se_realizo_evidencia_filmografica_ExecuteBusinessRules(): void {
        //Se_realizo_evidencia_filmografica_FieldExecuteBusinessRulesEnd
    }
    Cant__Combustible_en_la_recepcion_ExecuteBusinessRules(): void {
        //Cant__Combustible_en_la_recepcion_FieldExecuteBusinessRulesEnd
    }
    Razon_de_ingreso_ExecuteBusinessRules(): void {
        //Razon_de_ingreso_FieldExecuteBusinessRulesEnd
    }


    Condicion_del_item_ExecuteBusinessRules(element, event): void {      
      this.VerificaGuardadoItems(element, event, "Condicion");

      //Condicion_del_item_ExecuteBusinessRulesEnd
    }

  VerificaGuardadoItems(element, event, value: string = "") {
        
    if(value == "Observaciones"  && event.currentTarget.value.trim().length > 0) {
      this.ButtonSaveInspeccionItems = false;
    }
    if(value == "Observaciones"  && event.currentTarget.value.trim().length == 0) {
      this.ButtonSaveInspeccionItems = true;
    }

    if(value == "Condicion" && this.FromEditar) { 
      this.ButtonSaveInspeccionItems = false; 
    }

    if(event.isUserInput) {   
      this.FromEditar = false;
      if(value == "Condicion" && event.source.value == 1) { 
        this.ButtonSaveInspeccionItems = false; 
      }

      this.Inspeccion_de_los_itemsItems.controls.forEach(x => { 
        let data = x as FormGroup; 
        let dataItem = element.Items == undefined ? element.Items_Items.Folio : element.Items;
  
        if(data.controls.Items.value == dataItem) {

          //let fotografia = data.controls.Fotografia.value;
          //let fotografiaFile = data.controls.FotografiaFile.value;
          let observaciones = data.controls.Observaciones.value;

          //BUENA
          if(event.source.value == 1) {
            data.controls.Fotografia.enable();
            data.controls.FotografiaFile.enable();
            data.controls.Observaciones.enable();
            this.ButtonSaveInspeccionItems = false;
          }
          //MALA
          if(event.source.value == 2) {
            data.controls.Fotografia.enable();
            data.controls.FotografiaFile.enable();
            data.controls.Observaciones.enable();
            this.ButtonSaveInspeccionItems = true;

            // if(fotografia != null && fotografiaFile != '' && observaciones != null) {
            //   this.ButtonSaveInspeccionItems = false;
            // }
            if(observaciones != null && observaciones.trim().length > 0) {
              this.ButtonSaveInspeccionItems = false;
            }
            else {
              this.ButtonSaveInspeccionItems = true;
            }
          }
          //NO APLICA
          if(event.source.value == 3) {
            data.controls.Fotografia.disable();
            data.controls.FotografiaFile.disable();
            data.controls.Observaciones.disable();
            this.ButtonSaveInspeccionItems = false;
          }
        }
      });
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
  
  async rulesOnInit() {
//rulesOnInit_ExecuteBusinessRulesInit

//INICIA - BRID:3183 - llenar MR de Ítems - Autor: Aaron - Actualización: 7/30/2021 4:12:32 PM
if(  this.operation == 'New' ) {

  let dataSourceItemsPaso = new MatTableDataSource<Detalle_Inspeccion_Entrada_Aeronave>();

  await this.brf.FillMultiRenglonfromQueryAsync(dataSourceItemsPaso,
    "select null as Folio, null as id_Inspeccion_Entrada_Aeronave, Folio AS Items, Descripcion as ItemsDescripcion, null as Condicion_del_item, null as FotografiaFileInfo, null as Fotografia, null as Observaciones, null as IdReporte, null as Notificado from Items with(nolock)",1,"ABC123");

  let fInspeccion_de_los_items = await this.Detalle_Inspeccion_Entrada_AeronaveService.listaSelAll(0, dataSourceItemsPaso.data.length,'').toPromise();
  
  if(fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves.length > 0) {
    fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves.forEach((e, i) => {
      
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Condicion_del_item = 1;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Condicion_del_item_Condicion_del_item.Condicion = "Buena condición";
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Condicion_del_item_Condicion_del_item.Folio = 1;

      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Folio = dataSourceItemsPaso.data[i].Folio;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Fotografia = dataSourceItemsPaso.data[i].Fotografia;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Fotografia_Spartane_File = null;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Fotografia_URL = null;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Id = null;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].IdReporte = dataSourceItemsPaso.data[i].IdReporte;

      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Items = dataSourceItemsPaso.data[i].Items;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Items_Items.Descripcion = dataSourceItemsPaso.data[i].ItemsDescripcion;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Items_Items.Folio = dataSourceItemsPaso.data[i].Items;

      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Notificado = dataSourceItemsPaso.data[i].Notificado;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].Observaciones = dataSourceItemsPaso.data[i].Observaciones;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].id_Inspeccion_Entrada_Aeronave = dataSourceItemsPaso.data[i].id_Inspeccion_Entrada_Aeronave;
      fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves[i].id_Inspeccion_Entrada_Aeronave_Inspeccion_Entrada_Aeronave = null;
    });
  }

  this.Inspeccion_de_los_itemsData = fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves;
  this.loadInspeccion_de_los_items(fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves);
  this.dataSourceInspeccion_de_los_items = new MatTableDataSource(fInspeccion_de_los_items.Detalle_Inspeccion_Entrada_Aeronaves);

  this.Inspeccion_de_los_itemsItems.controls.forEach(x => { 
    let data = x as FormGroup; 
    data.controls.Items.disable(); 
  });

} 

//TERMINA - BRID:3183


//INICIA - BRID:4099 - Deshabilitar campos de Fecha, Hora y Usuario - Autor: Aaron - Actualización: 10/12/2021 12:37:07 PM
if(  this.operation == 'New' ) {
  this.brf.SetCurrentDateToField(this.Inspeccion_Entrada_AeronaveForm, "Fecha_de_Registro");
  this.brf.SetCurrentHourToField(this.Inspeccion_Entrada_AeronaveForm, "Hora_de_Registro");
} 
//TERMINA - BRID:4099


//INICIA - BRID:4156 - Ocultar campos Cuando ya se edito la pantalla - Autor: Aaron - Actualización: 7/28/2021 12:10:03 PM
if(  this.operation == 'Update' ) {
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Se_realizo_evidencia_filmografica', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Cant__Combustible_en_la_recepcion', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Razon_de_ingreso', 0);

  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'N_Orden_de_Trabajo', 0); 
} 
//TERMINA - BRID:4156


//INICIA - BRID:4481 - Deshabilitar campos automaticos Inspección de entrada - Autor: Aaron - Actualización: 10/12/2021 12:39:23 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Folio', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Aeronave', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Modelo', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Numero_de_Serie', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Cliente', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Fecha_de_Entrega', 0); 
  //this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'N_Orden_de_Trabajo', 0); 
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Fecha_de_Registro', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Hora_de_Registro', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Usuario_que_Registra', 0);
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Reporte', 0);
} 
//TERMINA - BRID:4481


//INICIA - BRID:4543 - Acomodo de Campos - Autor: Aaron - Actualización: 7/29/2021 5:30:50 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4543


//INICIA - BRID:6106 - llenar datos por default al cargar pantalla (regla corregida a mano) - Autor: Jose Caballero - Actualización: 9/8/2021 4:05:52 PM
if(  this.operation == 'New' ) {
  let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`, 1, "ABC123");
  this.brf.SetValueControl(this.Inspeccion_Entrada_AeronaveForm, "Usuario_que_Registra", username);
} 
//TERMINA - BRID:6106


//INICIA - BRID:6138 - Filtrar Combo  de reportes con reportes que aun no tienen inspección de entrada - Autor: Aaron - Actualización: 9/10/2021 4:56:24 PM
if(  this.operation == 'New' ) {

} 
//TERMINA - BRID:6138


//INICIA - BRID:6306 - Deshabilitar campo de Reporte - Autor: Aaron - Actualización: 9/17/2021 2:05:09 PM
if(  this.operation == 'Update' ) {
  this.brf.SetEnabledControl(this.Inspeccion_Entrada_AeronaveForm, 'Reporte', 0);
} 
//TERMINA - BRID:6306


//INICIA - BRID:6383 - Ocultar columnas en MR - Autor: Aaron - Actualización: 9/21/2021 5:22:43 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.HideFieldofMultirenglon(this.Inspeccion_de_los_itemsColumns,"IdReporte");
  this.brf.HideFieldofMultirenglon(this.Inspeccion_de_los_itemsColumns,"Notificado");
} 
//TERMINA - BRID:6383

//rulesOnInit_ExecuteBusinessRulesEnd

  }
  
  async rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:4116 - Enviar correo de al terminar Inspección de Entrada - Autor: Aaron - Actualización: 7/30/2021 7:16:25 PM
if(  this.operation == 'New' ) {
  //this.brf.SendEmailQuery("Aviso de Inspección de entrada realizada", this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (9,19,43,25)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User = GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <title>EmailTemplate-Fluid</title> <style type='text/css'> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*='margin: 16px 0'] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'> <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0' style='border-collapse:collapse;'> <tr> <td> <center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --> <div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'> Aerovics </div> <!-- Visually Hidden Preheader Text : END --> <div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'> <tr> <td width='40'>&nbsp;</td> <td width='260'> <img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'> </td> <td>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> <tr> <td width='40'>&nbsp;</td> <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td> <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing='0' cellpadding='0' border='0' width='100%'> <tr>  <td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'>  <p>Buenos días</p> <p>Se ha realizado una inspección de entrada para la siguiente aeronave:</p> <br> <p><strong>Reporte de Inspección:</strong> GLOBAL[reporte_inspeccion] </p> <br><p><strong>Matricula:</strong> GLOBAL[matricula] </p> <br><p><strong>No. de Orden de Trabajo:</strong> GLOBAL[numero_ot]</p> <br> <p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p> <br> <p><strong> Razón de ingreso:  </strong> GLOBAL[razon_ingreso]</p> <br><br><p><strong>Atentamente:</strong> GLOBAL[nombre_usuario]</p> <p>Favor de enviar acuse de recibido.</p>  <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>  </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>  ");
} 
//TERMINA - BRID:4116


//INICIA - BRID:4546 - Ejecutar SP para enviar discreapancias a reportes - Autor: Aaron - Actualización: 7/29/2021 6:37:38 PM
if(  this.operation == 'New' ) {
  await this.brf.EvaluaQueryAsync(` EXEC Insert_Reportes_Inspeccion_Entrada_Aeronave ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)} `, 1, "ABC123");
} 
//TERMINA - BRID:4546


//INICIA - BRID:4547 - Ejecutar SP enviar discrepancias a reportes al Editar - Autor: Aaron - Actualización: 7/29/2021 7:23:25 PM
if(  this.operation == 'Update' ) {
  await this.brf.EvaluaQueryAsync(`EXEC Insert_Reportes_Inspeccion_Entrada_Aeronave '${this.model.Folio}'`, 1, "ABC123");
} 
//TERMINA - BRID:4547


//INICIA - BRID:4551 - Enviar Correo a los reportes Generados con Inspeccion de Entrada - Autor: Aaron - Actualización: 7/30/2021 4:46:58 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  //this.brf.SendEmailQuery("Aviso de creación de reporte", this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (9,17,19,43)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User = GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <title>EmailTemplate-Fluid</title> <style type='text/css'> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*='margin: 16px 0'] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'> <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0' style='border-collapse:collapse;'> <tr> <td> <center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --> <div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'> Aerovics </div> <!-- Visually Hidden Preheader Text : END --> <div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'> <tr> <td width='40'>&nbsp;</td> <td width='260'> <img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'> </td> <td>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> <tr> <td width='40'>&nbsp;</td> <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td> <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing='0' cellpadding='0' border='0' width='100%'> <tr>  <td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'>  <p>Buenos días</p> <p>Ha sido registrado un nuevo reporte en la base de datos con la siguiente Información:</p> <br> <p><strong>No. de reporte:</strong> </p> <br><p><strong>No. de Orden de Trabajo:</strong> GLOBAL[numero_ot]</p> <br><p><strong>Matrícula:</strong> GLOBAL[matricula]</p> <br> <p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p> <br> <p><strong> Descripción:  </strong> </p> <br><br><p><strong>Atentamente:</strong> GLOBAL[nombre_usuario]</p> <p>Favor de enviar acuse de recibido.</p>  <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>  </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>  ");
} 
//TERMINA - BRID:4551

//rulesAfterSave_ExecuteBusinessRulesEnd


  }
  
  async rulesBeforeSave(): Promise<boolean> {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:4369 - Variables de sesión para envío de correo - Autor: Aaron - Actualización: 7/30/2021 7:17:48 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.CreateSessionVar("numero_ot",this.brf.EvaluaQuery(" Select FLD[N_Orden_de_Trabajo]", 1, "ABC123"), 1,"ABC123"); 
  this.brf.CreateSessionVar("matricula",this.brf.EvaluaQuery(" Select 'FLD[Aeronave]'", 1, "ABC123"), 1,"ABC123"); 
  this.brf.CreateSessionVar("numero_de_serie",this.brf.EvaluaQuery("Select FLDD[Numero_de_Serie]", 1, "ABC123"), 1,"ABC123"); 
  this.brf.CreateSessionVar("nombre_usuario",this.brf.EvaluaQuery("Select Name From Spartan_User Where id_user = GLOBAL[USERID]", 1, "ABC123"), 1,"ABC123"); 
  this.brf.CreateSessionVar("razon_ingreso",this.brf.EvaluaQuery(" Select 'FLD[Razon_de_ingreso]'", 1, "ABC123"), 1,"ABC123"); 
  this.brf.CreateSessionVar("reporte_inspeccion",this.brf.EvaluaQuery(" Select FLD[Reporte]", 1, "ABC123"), 1,"ABC123");
} 
//TERMINA - BRID:4369


//INICIA - BRID:7095 - Hora y fecha actual a campos de Fecha y hora de registro, al nuevo - Autor: Aaron - Actualización: 10/12/2021 12:54:38 PM
if(  this.operation == 'New' ) {
  this.brf.SetCurrentDateToField(this.Inspeccion_Entrada_AeronaveForm, "Fecha_de_Registro");
  this.brf.SetCurrentHourToField(this.Inspeccion_Entrada_AeronaveForm, "Hora_de_Registro");
} 
//TERMINA - BRID:7095

//rulesBeforeSave_ExecuteBusinessRulesEnd


    return result;
  }

  //Fin de reglas
  
}
