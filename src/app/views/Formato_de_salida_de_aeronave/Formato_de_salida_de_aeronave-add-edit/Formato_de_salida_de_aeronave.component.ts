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
import { Formato_de_salida_de_aeronaveService } from 'src/app/api-services/Formato_de_salida_de_aeronave.service';
import { Formato_de_salida_de_aeronave } from 'src/app/models/Formato_de_salida_de_aeronave';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Detalle_Inspeccion_SalidaService } from 'src/app/api-services/Detalle_Inspeccion_Salida.service';
import { Detalle_Inspeccion_Salida } from 'src/app/models/Detalle_Inspeccion_Salida';
import { ItemsService } from 'src/app/api-services/Items.service';
import { Items } from 'src/app/models/Items';


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
import { truncate } from 'fs';

@Component({
  selector: 'app-Formato_de_salida_de_aeronave',
  templateUrl: './Formato_de_salida_de_aeronave.component.html',
  styleUrls: ['./Formato_de_salida_de_aeronave.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Formato_de_salida_de_aeronaveComponent implements OnInit, AfterViewInit {
MRaddDiscrepancias: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Formato_de_salida_de_aeronaveForm: FormGroup;
	public Editor = ClassicEditor;
	model: Formato_de_salida_de_aeronave;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsOrden_de_Trabajo: Observable<Orden_de_Trabajo[]>;
	hasOptionsOrden_de_Trabajo: boolean;
	isLoadingOrden_de_Trabajo: boolean;
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;
	optionsModelo: Observable<Modelos[]>;
	hasOptionsModelo: boolean;
	isLoadingModelo: boolean;
	optionsCliente: Observable<Cliente[]>;
	hasOptionsCliente: boolean;
	isLoadingCliente: boolean;
	optionsUsuario_que_registra: Observable<Spartan_User[]>;
	hasOptionsUsuario_que_registra: boolean;
	isLoadingUsuario_que_registra: boolean;
	public varItems: Items[] = [];

  autoItem_Detalle_Inspeccion_Salida = new FormControl();
  SelectedItem_Detalle_Inspeccion_Salida: string[] = [];
  isLoadingItem_Detalle_Inspeccion_Salida: boolean;
  searchItem_Detalle_Inspeccion_SalidaCompleted: boolean;


	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceDiscrepancias = new MatTableDataSource<Detalle_Inspeccion_Salida>();
  DiscrepanciasColumns = [
    { def: 'actions', hide: true },
    { def: 'Item', hide: false },
    { def: 'Reporte', hide: false },
    { def: 'Codigo_Computarizado', hide: false },
    { def: 'Codigo_ATA', hide: false },
    { def: 'Respuesta', hide: false },
    { def: 'Asignado_a', hide: false },
	
  ];
  DiscrepanciasData: Detalle_Inspeccion_Salida[] = [];
	
	today = new Date;
	consult: boolean = false;
  OrdendeTrabajo: any = null;
  MatriculaSeleccionada: any = null;
  ModeloSeleccionado: any = null;
  ClienteSeleccionado: any = null;
  UsuarioRegistraSeleccionado: any = null;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Formato_de_salida_de_aeronaveService: Formato_de_salida_de_aeronaveService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private ClienteService: ClienteService,
    private Spartan_UserService: Spartan_UserService,
    private Detalle_Inspeccion_SalidaService: Detalle_Inspeccion_SalidaService,
    private ItemsService: ItemsService,


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
    this.model = new Formato_de_salida_de_aeronave(this.fb);
    this.Formato_de_salida_de_aeronaveForm = this.model.buildFormGroup();
    //this.DiscrepanciasItems.removeAt(0);
	
	this.Formato_de_salida_de_aeronaveForm.get('Folio').disable();
    this.Formato_de_salida_de_aeronaveForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceDiscrepancias.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.DiscrepanciasColumns.splice(0, 1);
		
          this.Formato_de_salida_de_aeronaveForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Formato_de_salida_de_aeronave)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Formato_de_salida_de_aeronaveForm, 'Orden_de_Trabajo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Formato_de_salida_de_aeronaveForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Formato_de_salida_de_aeronaveForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Formato_de_salida_de_aeronaveForm, 'Cliente', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Formato_de_salida_de_aeronaveForm, 'Usuario_que_registra', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Formato_de_salida_de_aeronaveService.listaSelAll(0, 1, 'Formato_de_salida_de_aeronave.Folio=' + id).toPromise();
	if (result.Formato_de_salida_de_aeronaves.length > 0) {
        let fDiscrepancias = await this.Detalle_Inspeccion_SalidaService.listaSelAll(0, 1000,'Formato_de_salida_de_aeronave.Folio=' + id).toPromise();
            this.DiscrepanciasData = fDiscrepancias.Detalle_Inspeccion_Salidas;
            this.loadDiscrepancias(fDiscrepancias.Detalle_Inspeccion_Salidas);
            this.dataSourceDiscrepancias = new MatTableDataSource(fDiscrepancias.Detalle_Inspeccion_Salidas);
            this.dataSourceDiscrepancias.paginator = this.paginator;
            this.dataSourceDiscrepancias.sort = this.sort;
	  
        this.model.fromObject(result.Formato_de_salida_de_aeronaves[0]);
        this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').setValue(
          result.Formato_de_salida_de_aeronaves[0].Orden_de_Trabajo_Orden_de_Trabajo.numero_de_orden,
          { onlySelf: false, emitEvent: true }
        );
        this.Formato_de_salida_de_aeronaveForm.get('Matricula').setValue(
          result.Formato_de_salida_de_aeronaves[0].Matricula_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );
        this.Formato_de_salida_de_aeronaveForm.get('Modelo').setValue(
          result.Formato_de_salida_de_aeronaves[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Formato_de_salida_de_aeronaveForm.get('Cliente').setValue(
          result.Formato_de_salida_de_aeronaves[0].Cliente_Cliente.Razon_Social,
          { onlySelf: false, emitEvent: true }
        );
        this.Formato_de_salida_de_aeronaveForm.get('Usuario_que_registra').setValue(
          result.Formato_de_salida_de_aeronaves[0].Usuario_que_registra_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );

		this.Formato_de_salida_de_aeronaveForm.markAllAsTouched();
		this.Formato_de_salida_de_aeronaveForm.updateValueAndValidity();
        this.spinner.hide('loading');

        this.rulesOnInit();

      } else { this.spinner.hide('loading'); }
  }
  
  get DiscrepanciasItems() {
    return this.Formato_de_salida_de_aeronaveForm.get('Detalle_Inspeccion_SalidaItems') as FormArray;
  }

  getDiscrepanciasColumns(): string[] {
    return this.DiscrepanciasColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadDiscrepancias(Discrepancias: Detalle_Inspeccion_Salida[]) {
    Discrepancias.forEach(element => {
      this.addDiscrepancias(element);
    });
  }

  addDiscrepanciasToMR() {
    const Discrepancias = new Detalle_Inspeccion_Salida(this.fb);
    this.DiscrepanciasData.push(this.addDiscrepancias(Discrepancias));
    this.dataSourceDiscrepancias.data = this.DiscrepanciasData;
    Discrepancias.edit = true;
    Discrepancias.isNew = true;
    const length = this.dataSourceDiscrepancias.data.length;
    const index = length - 1;
    const formDiscrepancias = this.DiscrepanciasItems.controls[index] as FormGroup;
	this.addFilterToControlItem_Detalle_Inspeccion_Salida(formDiscrepancias.controls.Item, index);
    
    const page = Math.ceil(this.dataSourceDiscrepancias.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addDiscrepancias(entity: Detalle_Inspeccion_Salida) {
    const Discrepancias = new Detalle_Inspeccion_Salida(this.fb);
    this.DiscrepanciasItems.push(Discrepancias.buildFormGroup());
    if (entity) {
      Discrepancias.fromObject(entity);
    }
	return entity;
  }  

  DiscrepanciasItemsByFolio(Folio: number): FormGroup {
    return (this.Formato_de_salida_de_aeronaveForm.get('Detalle_Inspeccion_SalidaItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  DiscrepanciasItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceDiscrepancias.data.indexOf(element);
	let fb = this.DiscrepanciasItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteDiscrepancias(element: any) {
    let index = this.dataSourceDiscrepancias.data.indexOf(element);
    this.DiscrepanciasData[index].IsDeleted = true;
    this.dataSourceDiscrepancias.data = this.DiscrepanciasData;
    this.dataSourceDiscrepancias._updateChangeSubscription();
    index = this.dataSourceDiscrepancias.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditDiscrepancias(element: any) {
    let index = this.dataSourceDiscrepancias.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.DiscrepanciasData[index].IsDeleted = true;
      this.dataSourceDiscrepancias.data = this.DiscrepanciasData;
      this.dataSourceDiscrepancias._updateChangeSubscription();
      index = this.DiscrepanciasData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveDiscrepancias(element: any) {
    const index = this.dataSourceDiscrepancias.data.indexOf(element);
    const formDiscrepancias = this.DiscrepanciasItems.controls[index] as FormGroup;
    if (this.DiscrepanciasData[index].Item !== formDiscrepancias.value.Item && formDiscrepancias.value.Item > 0) {
		let items = await this.ItemsService.getById(formDiscrepancias.value.Item).toPromise();
        this.DiscrepanciasData[index].Item_Items = items;
    }
    this.DiscrepanciasData[index].Item = formDiscrepancias.value.Item;
    this.DiscrepanciasData[index].Reporte = formDiscrepancias.value.Reporte;
    this.DiscrepanciasData[index].Codigo_Computarizado = formDiscrepancias.value.Codigo_Computarizado;
    this.DiscrepanciasData[index].Codigo_ATA = formDiscrepancias.value.Codigo_ATA;
    this.DiscrepanciasData[index].Respuesta = formDiscrepancias.value.Respuesta;
    this.DiscrepanciasData[index].Asignado_a = formDiscrepancias.value.Asignado_a;
	
    this.DiscrepanciasData[index].isNew = false;
    this.dataSourceDiscrepancias.data = this.DiscrepanciasData;
    this.dataSourceDiscrepancias._updateChangeSubscription();
  }
  
  editDiscrepancias(element: any) {
    const index = this.dataSourceDiscrepancias.data.indexOf(element);
    const formDiscrepancias = this.DiscrepanciasItems.controls[index] as FormGroup;
	this.SelectedItem_Detalle_Inspeccion_Salida[index] = this.dataSourceDiscrepancias.data[index].Item_Items.Descripcion;
    this.addFilterToControlItem_Detalle_Inspeccion_Salida(formDiscrepancias.controls.Item, index);
	    
    element.edit = true;
  }  

  async saveDetalle_Inspeccion_Salida(Folio: number) {
    this.dataSourceDiscrepancias.data.forEach(async (d, index) => {
      const data = this.DiscrepanciasItems.controls[index] as FormGroup;
      let model = data.getRawValue();

	    model.Formato_de_salida_de_aeronave = Folio;
      model.Id_Inspeccion = Folio;	

      model.Asignado_a = d.Asignado_a;
      model.Codigo_ATA = d.Codigo_ATA;
      model.Codigo_Computarizado = d.Codigo_Computarizado;
      model.Item = d.Item;
      model.Reporte = d.Reporte;
      model.Respuesta = d.Respuesta;

      
      if (model.Folio === 0) {
        // Add Discrepancias No Resueltas durante esta visita
		let response = await this.Detalle_Inspeccion_SalidaService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formDiscrepancias = this.DiscrepanciasItemsByFolio(model.Folio);
        if (formDiscrepancias.dirty) {
          // Update Discrepancias No Resueltas durante esta visita
          let response = await this.Detalle_Inspeccion_SalidaService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Discrepancias No Resueltas durante esta visita
        await this.Detalle_Inspeccion_SalidaService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectItem_Detalle_Inspeccion_Salida(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDiscrepancias.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedItem_Detalle_Inspeccion_Salida[index] = event.option.viewValue;
	let fgr = this.Formato_de_salida_de_aeronaveForm.controls.Detalle_Inspeccion_SalidaItems as FormArray;
	let data = fgr.controls[index] as FormGroup;
	data.controls.Item.setValue(event.option.value);
    this.displayFnItem_Detalle_Inspeccion_Salida(element);
  }  
  
  displayFnItem_Detalle_Inspeccion_Salida(this, element) {
    const index = this.dataSourceDiscrepancias.data.indexOf(element);
    return this.SelectedItem_Detalle_Inspeccion_Salida[index];
  }
  updateOptionItem_Detalle_Inspeccion_Salida(event, element: any) {
    const index = this.dataSourceDiscrepancias.data.indexOf(element);
    this.SelectedItem_Detalle_Inspeccion_Salida[index] = event.source.viewValue;
  } 

	_filterItem_Detalle_Inspeccion_Salida(filter: any): Observable<Items> {
		const where = filter !== '' ?  "Items.Descripcion like '%" + filter + "%'" : '';
		return this.ItemsService.listaSelAll(0, 20, where);
	}

  addFilterToControlItem_Detalle_Inspeccion_Salida(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingItem_Detalle_Inspeccion_Salida = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingItem_Detalle_Inspeccion_Salida = true;
        return this._filterItem_Detalle_Inspeccion_Salida(value || '');
      })
    ).subscribe(result => {
      this.varItems = result.Itemss;
      this.isLoadingItem_Detalle_Inspeccion_Salida = false;
      this.searchItem_Detalle_Inspeccion_SalidaCompleted = true;
      this.SelectedItem_Detalle_Inspeccion_Salida[index] = this.varItems.length === 0 ? '' : this.SelectedItem_Detalle_Inspeccion_Salida[index];
    });
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Formato_de_salida_de_aeronaveForm.disabled ? "Update" : this.operation;
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

    this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingOrden_de_Trabajo = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.OrdendeTrabajo = value;
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
      this.isLoadingOrden_de_Trabajo = false;
      this.hasOptionsOrden_de_Trabajo = result?.Orden_de_Trabajos?.length > 0;

      if(this.OrdendeTrabajo != null && this.OrdendeTrabajo != "") {
        this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').setValue(result?.Orden_de_Trabajos[0], { onlySelf: true, emitEvent: false });
      }
      
	    this.optionsOrden_de_Trabajo = of(result?.Orden_de_Trabajos);
    }, error => {
      this.isLoadingOrden_de_Trabajo = false;
      this.hasOptionsOrden_de_Trabajo = false;
      this.optionsOrden_de_Trabajo = of([]);
    });
    this.Formato_de_salida_de_aeronaveForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.MatriculaSeleccionada = value;
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

      if(this.MatriculaSeleccionada != null && this.MatriculaSeleccionada != "") {
        this.Formato_de_salida_de_aeronaveForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      }
	  
	    this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Formato_de_salida_de_aeronaveForm.get('Modelo').valueChanges.pipe(
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
        this.Formato_de_salida_de_aeronaveForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      }

	    this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Formato_de_salida_de_aeronaveForm.get('Cliente').valueChanges.pipe(
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
        this.Formato_de_salida_de_aeronaveForm.get('Cliente').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });
      }
	  
	    this.optionsCliente = of(result?.Clientes);
    }, error => {
      this.isLoadingCliente = false;
      this.hasOptionsCliente = false;
      this.optionsCliente = of([]);
    });
    this.Formato_de_salida_de_aeronaveForm.get('Usuario_que_registra').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUsuario_que_registra = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.UsuarioRegistraSeleccionado = value;
        if (!value) return this.Spartan_UserService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Spartan_UserService.listaSelAll(0, 20, '');
          return this.Spartan_UserService.listaSelAll(0, 20,
            "Spartan_User.Name like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Spartan_UserService.listaSelAll(0, 20,
          "Spartan_User.Name like '%" + value.Name.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingUsuario_que_registra = false;
      this.hasOptionsUsuario_que_registra = result?.Spartan_Users?.length > 0;

      if(this.UsuarioRegistraSeleccionado != null && this.UsuarioRegistraSeleccionado != "") {
        this.Formato_de_salida_de_aeronaveForm.get('Usuario_que_registra').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      }
	    
	    this.optionsUsuario_que_registra = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingUsuario_que_registra = false;
      this.hasOptionsUsuario_que_registra = false;
      this.optionsUsuario_que_registra = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {


      default: {
        break;
      }
    }
  }

displayFnOrden_de_Trabajo(option: Orden_de_Trabajo) {
    return option?.numero_de_orden;
  }
displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
displayFnCliente(option: Cliente) {
    return option?.Razon_Social;
  }
displayFnUsuario_que_registra(option: Spartan_User) {
    return option?.Name;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Formato_de_salida_de_aeronaveForm.value;
      entity.Folio = this.model.Folio;
      entity.Orden_de_Trabajo = this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').value.Folio;
      entity.Matricula = this.Formato_de_salida_de_aeronaveForm.get('Matricula').value.Matricula;
      entity.Modelo = this.Formato_de_salida_de_aeronaveForm.get('Modelo').value.Clave;
      entity.Cliente = this.Formato_de_salida_de_aeronaveForm.get('Cliente').value.Clave;
      entity.Usuario_que_registra = this.Formato_de_salida_de_aeronaveForm.get('Usuario_que_registra').value.Id_User;

      entity.Fecha_de_Inspeccion = this.Formato_de_salida_de_aeronaveForm.get('Fecha_de_Inspeccion').value;	  	  
      entity.Numero_de_serie = this.Formato_de_salida_de_aeronaveForm.get('Numero_de_serie').value;	 
      entity.Rol_de_usuario = this.Formato_de_salida_de_aeronaveForm.get('Rol_de_usuario').value;	 
      entity.Hora = this.Formato_de_salida_de_aeronaveForm.get('Hora').value;	       
	  
	  if (this.model.Folio > 0 ) {
        await this.Formato_de_salida_de_aeronaveService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Inspeccion_Salida(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
      } else {
        await (this.Formato_de_salida_de_aeronaveService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Inspeccion_Salida(id);

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
      this.Formato_de_salida_de_aeronaveForm.reset();
      this.model = new Formato_de_salida_de_aeronave(this.fb);
      this.Formato_de_salida_de_aeronaveForm = this.model.buildFormGroup();
      this.dataSourceDiscrepancias = new MatTableDataSource<Detalle_Inspeccion_Salida>();
      this.DiscrepanciasData = [];

    } else {
      this.router.navigate(['views/Formato_de_salida_de_aeronave/add']);
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
    this.router.navigate(['/Formato_de_salida_de_aeronave/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      async Orden_de_Trabajo_ExecuteBusinessRules(): Promise<void> {

        //INICIA - BRID:3984 - Filtrar Matricula a partir de OT - Autor: Aaron - Actualización: 9/10/2021 2:31:05 PM
        if( this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').value.Folio > this.brf.TryParseInt('0', '0') ) { 

          let ordenTrabajo = this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').value.Folio;
          let matricula = this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').value.Matricula.trimLeft().trimRight();
          let modelo = this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').value.Modelo_Modelos.Descripcion.trimLeft().trimRight();
          let numeroSerie = await this.brf.EvaluaQueryAsync(`Select Numero_de_Serie from aeronave A Inner Join Orden_de_Trabajo  OT ON A.Matricula  = OT.Matricula  Where Folio = ${ordenTrabajo}`, 1, "ABC123");
          let cliente = await this.brf.EvaluaQueryAsync(`select Razon_Social from Cliente C Inner Join Aeronave A ON C.Clave = A.Cliente Inner Join Orden_de_Trabajo  OT ON A.Matricula  = OT.Matricula Where Folio = ${ordenTrabajo}`, 1, "ABC123");

          this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm,"Matricula", matricula);
          this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm,"Modelo", modelo);
          this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm,"Numero_de_serie", numeroSerie);
          this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm,"Cliente", cliente);

        } else {}
        //TERMINA - BRID:3984


        //INICIA - BRID:3985 - Cargar MR con Reportes que quedaron pendientes en esta OT - Autor: Aaron - Actualización: 9/10/2021 1:56:32 PM
        if( this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').value.Folio > this.brf.TryParseInt('0', '0') ) { 

          let ordenTrabajo = this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').value.Folio;
          let dataSourceDiscrepanciasPaso = new MatTableDataSource<Detalle_Inspeccion_Salida>();          
          
          await this.brf.FillMultiRenglonfromQueryAsync(dataSourceDiscrepanciasPaso,` EXEC spLlenaMRDiscrepancias ${ordenTrabajo} `, 1, "ABC123");

          let fDiscrepancias = await this.Detalle_Inspeccion_SalidaService.listaSelAll(0, dataSourceDiscrepanciasPaso.data.length, '').toPromise();

          if(fDiscrepancias.Detalle_Inspeccion_Salidas.length > 0) {
            fDiscrepancias.Detalle_Inspeccion_Salidas.forEach((e, i) => {

              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Asignado_a = dataSourceDiscrepanciasPaso.data[i].Asignado_a;
              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Codigo_ATA = dataSourceDiscrepanciasPaso.data[i].Codigo_ATA;
              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Codigo_Computarizado = dataSourceDiscrepanciasPaso.data[i].Codigo_Computarizado;
              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Folio = 0;
              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Id_Inspeccion = null;
              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Id_Inspeccion_Formato_de_salida_de_aeronave = null;

              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Item = dataSourceDiscrepanciasPaso.data[i].Item;
              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Item_Items.Folio = dataSourceDiscrepanciasPaso.data[i].Item;
              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Item_Items.Descripcion = dataSourceDiscrepanciasPaso.data[i].ItemDescripcion;

              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Reporte = dataSourceDiscrepanciasPaso.data[i].Reporte;
              fDiscrepancias.Detalle_Inspeccion_Salidas[i].Respuesta = dataSourceDiscrepanciasPaso.data[i].Respuesta;

            });
          }
          this.DiscrepanciasData = fDiscrepancias.Detalle_Inspeccion_Salidas;
          this.loadDiscrepancias(fDiscrepancias.Detalle_Inspeccion_Salidas);
          this.dataSourceDiscrepancias = new MatTableDataSource(fDiscrepancias.Detalle_Inspeccion_Salidas);

        } else {}
        //TERMINA - BRID:3985

        //Orden_de_Trabajo_FieldExecuteBusinessRulesEnd

    }
    Fecha_de_Inspeccion_ExecuteBusinessRules(): void {
        //Fecha_de_Inspeccion_FieldExecuteBusinessRulesEnd
    }
    async Matricula_ExecuteBusinessRules(): Promise<void> {

      //INICIA - BRID:3978 - Filtrar No Serie y Tipo de Aeronave a partir de Matricula - Autor: Aaron - Actualización: 9/10/2021 2:20:19 PM

      let matricula = this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').value.Matricula.trimLeft().trimRight();
      let cliente = await this.brf.EvaluaQueryAsync(`SELECT Razon_Social FROM Cliente WITH(NOLOCK) WHERE Clave = (SELECT Cliente FROM Aeronave WITH(NOLOCK) WHERE Matricula = ${matricula}`, 1, "ABC123");
      let modelo = this.Formato_de_salida_de_aeronaveForm.get('Orden_de_Trabajo').value.Modelo_Modelos.Descripcion.trimLeft().trimRight();
      let numeroSerie = await this.brf.EvaluaQueryAsync(`SELECT Numero_de_serie FROM Aeronave WITH(NOLOCK) WHERE Matricula = ${matricula}`, 1, "ABC123");

      this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm,"Cliente", cliente);
      this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm,"Modelo", modelo);
      this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm,"Numero_de_serie", numeroSerie);

      //TERMINA - BRID:3978

      //Matricula_FieldExecuteBusinessRulesEnd

    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    Numero_de_serie_ExecuteBusinessRules(): void {
        //Numero_de_serie_FieldExecuteBusinessRulesEnd
    }
    Cliente_ExecuteBusinessRules(): void {
        //Cliente_FieldExecuteBusinessRulesEnd
    }
    Usuario_que_registra_ExecuteBusinessRules(): void {
        //Usuario_que_registra_FieldExecuteBusinessRulesEnd
    }
    Rol_de_usuario_ExecuteBusinessRules(): void {
        //Rol_de_usuario_FieldExecuteBusinessRulesEnd
    }
    Hora_ExecuteBusinessRules(): void {
        //Hora_FieldExecuteBusinessRulesEnd
    }
    Prevuelo_Efectuado_ExecuteBusinessRules(): void {
        //Prevuelo_Efectuado_FieldExecuteBusinessRulesEnd
    }
    Liberado_despues_de_reparacion_mayor_ExecuteBusinessRules(): void {
        //Liberado_despues_de_reparacion_mayor_FieldExecuteBusinessRulesEnd
    }
    Liberado_despues_de_inspeccion_ExecuteBusinessRules(): void {
        //Liberado_despues_de_inspeccion_FieldExecuteBusinessRulesEnd
    }
    Liberado_despues_de_modificacion_mayor_ExecuteBusinessRules(): void {
        //Liberado_despues_de_modificacion_mayor_FieldExecuteBusinessRulesEnd
    }
    Liberado_despues_de_trabajos_menores_ExecuteBusinessRules(): void {
        //Liberado_despues_de_trabajos_menores_FieldExecuteBusinessRulesEnd
    }
    Tipo_de_inspeccion_ExecuteBusinessRules(): void {
        //Tipo_de_inspeccion_FieldExecuteBusinessRulesEnd
    }
    Combustible_LH_ExecuteBusinessRules(): void {
        //Combustible_LH_FieldExecuteBusinessRulesEnd
    }
    Combustible_RH_ExecuteBusinessRules(): void {
        //Combustible_RH_FieldExecuteBusinessRulesEnd
    }
    Regresar_a_servicio_ExecuteBusinessRules(): void {

    //INICIA - BRID:4068 - Limpiar Checks de salida dependiendo de seleccion: Regresar a Servicio - Autor: Aaron - Actualización: 7/19/2021 1:07:18 PM
    // if( this.brf.GetValueByControlType(this.Formato_de_salida_de_aeronaveForm, 'Regresar_a_servicio')==this.brf.TryParseInt('true', 'true') ) { 
    //     this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm, "Vuelo_de_evaluacion", "0");
    //     this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm, "Salida", "0");
    // } else {}
    //TERMINA - BRID:4068

    //Regresar_a_servicio_FieldExecuteBusinessRulesEnd

    }
    Vuelo_de_evaluacion_ExecuteBusinessRules(): void {

    //INICIA - BRID:4071 - Limpiar Checks de salida dependiendo de selección Vuelo de Evaluación - Autor: Aaron - Actualización: 7/19/2021 1:07:26 PM
    // if( this.brf.GetValueByControlType(this.Formato_de_salida_de_aeronaveForm, 'Vuelo_de_evaluacion')==this.brf.TryParseInt('true', 'true') ) { 
    //   this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm, "Regresar_a_servicio", "0");
    //   this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm, "Salida", "0");
    // } else {}
    //TERMINA - BRID:4071

    //Vuelo_de_evaluacion_FieldExecuteBusinessRulesEnd

    }
    Salida_ExecuteBusinessRules(): void {

    //INICIA - BRID:4072 - Limpiar Checks de salida dependiendo de seleccion: Salida - Autor: Aaron - Actualización: 7/19/2021 1:07:36 PM
    // if( this.brf.GetValueByControlType(this.Formato_de_salida_de_aeronaveForm, 'Salida')==this.brf.TryParseInt('true', 'true') ) { 
    //   this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm, "Regresar_a_servicio", "0");
    //   this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm, "Vuelo_de_evaluacion", "0");
    // } else {}
    //TERMINA - BRID:4072

    //Salida_FieldExecuteBusinessRulesEnd

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

//INICIA - BRID:3977 - Acomodo y ajustar tamaño de campos - Autor: Aaron - Actualización: 7/12/2021 10:45:52 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:3977


//INICIA - BRID:3980 - Deshabilitar campos automaticos - Autor: Aaron - Actualización: 7/6/2021 2:08:25 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Cliente', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Modelo', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Numero_de_serie', 0); 
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Usuario_que_registra', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Rol_de_usuario', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Fecha', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Hora', 0); 
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Matricula', 0); 
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Fecha_de_Inspeccion', 0);
} 
//TERMINA - BRID:3980


//INICIA - BRID:3981 - Cargar datos a usuario que registra al nuevo - Autor: Aaron - Actualización: 7/6/2021 2:10:08 PM
if(  this.operation == 'New' ) {

  let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`, 1, "ABC123");
  let descriptionrole = await this.brf.EvaluaQueryAsync(`SELECT Description FROM Spartan_User_Role WHERE User_Role_Id = ${this.localStorageHelper.getItemFromLocalStorage('USERROLEID')}`, 1, "ABC123");

  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Cliente', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Modelo', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Numero_de_serie', 0); 
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Usuario_que_registra', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Rol_de_usuario', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Fecha', 0);
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Hora', 0); 
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Matricula', 0); 
  this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Fecha_de_Inspeccion', 0);

  this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm, "Usuario_que_registra", username);
  this.brf.SetValueControl(this.Formato_de_salida_de_aeronaveForm,"Rol_de_usuario", descriptionrole);
  this.brf.SetCurrentDateToField(this.Formato_de_salida_de_aeronaveForm,"Fecha_de_Inspeccion");

} 
//TERMINA - BRID:3981


//INICIA - BRID:3982 - Ocultar campos de fecha y hora  - Autor: Aaron - Actualización: 7/12/2021 10:42:14 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.HideFieldOfForm(this.Formato_de_salida_de_aeronaveForm, "Hora"); 
  this.brf.SetNotRequiredControl(this.Formato_de_salida_de_aeronaveForm, "Hora");
  this.brf.HideFieldOfForm(this.Formato_de_salida_de_aeronaveForm, "No_Certificado"); 
  this.brf.SetNotRequiredControl(this.Formato_de_salida_de_aeronaveForm, "No_Certificado");
} 
//TERMINA - BRID:3982


//INICIA - BRID:3989 - Deshabilitar OT al editar - Autor: Administrador - Actualización: 6/24/2021 5:35:45 PM
if(  this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetEnabledControl(this.Formato_de_salida_de_aeronaveForm, 'Orden_de_Trabajo', 0);
} 
//TERMINA - BRID:3989


//INICIA - BRID:4073 - Acomodo de Campos Inspeccion de Salida - Autor: Aaron - Actualización: 7/6/2021 2:08:24 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4073


//INICIA - BRID:6131 - Filtra autocomplete de OT - Autor: Aaron - Actualización: 9/10/2021 12:32:30 PM
if(  this.operation == 'New' ) {

} 
//TERMINA - BRID:6131


//rulesOnInit_ExecuteBusinessRulesEnd



  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:4371 - Envio de correo para inspección de salida - Autor: Aaron - Actualización: 7/30/2021 7:32:53 PM
if(  this.operation == 'New' ) {
  //this.brf.SendEmailQuery("Aviso de Inspección de Salida realizada", 
  //  this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (9,17,19,43)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User = GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <title>EmailTemplate-Fluid</title> <style type='text/css'> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*='margin: 16px 0'] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'> <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0' style='border-collapse:collapse;'> <tr> <td> <center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --> <div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'> Aerovics </div> <!-- Visually Hidden Preheader Text : END --> <div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'> <tr> <td width='40'>&nbsp;</td> <td width='260'> <img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'> </td> <td>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> <tr> <td width='40'>&nbsp;</td> <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td> <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing='0' cellpadding='0' border='0' width='100%'> <tr>  <td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'>  <p>Buenos días</p> <p>Se ha realizado una inspección de salida para la siguiente aeronave:</p> <br> <br><p><strong>Matricula:</strong> GLOBAL[matricula] </p> <br><p><strong>No. de Orden de Trabajo:</strong> GLOBAL[numero_ot]</p> <br> <p><strong>No. de serie:</strong> GLOBAL[numero_de_serie]</p> <br> <p><strong> Tipo de inspección </strong> GLOBAL[tipo_inspeccion]</p> <br><br><p><strong>Atentamente:</strong> GLOBAL[nombre_usuario]</p> <p>Favor de enviar acuse de recibido.</p>  <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN -->  <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'>  <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'>  </td>  <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>GLOBAL[nombre_usuario]</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Mantenimiento.</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>  ");
} 
//TERMINA - BRID:4371

//rulesAfterSave_ExecuteBusinessRulesEnd

  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:4075 - Ingresar Fecha y Hora de Guardado - Autor: Aaron - Actualización: 7/6/2021 2:20:21 PM
if(  this.operation == 'New' ) {

  this.brf.SetCurrentDateToField(this.Formato_de_salida_de_aeronaveForm,"Fecha_de_Inspeccion");
  this.brf.SetCurrentHourToField(this.Formato_de_salida_de_aeronaveForm,"Hora");

} 
//TERMINA - BRID:4075


//INICIA - BRID:4642 - Variables de sesión para el envio de correos Insp salida - Autor: Administrador - Actualización: 8/4/2021 5:11:40 PM
if(  this.operation == 'New' ) {
  // this.brf.CreateSessionVar("numero_ot",this.brf.EvaluaQuery("  Select FLD[N_Orden_de_Trabajo]", 1, "ABC123"), 1,"ABC123"); 
  // this.brf.CreateSessionVar("matricula",this.brf.EvaluaQuery("  Select 'FLD[Aeronave]'", 1, "ABC123"), 1,"ABC123"); 
  // this.brf.CreateSessionVar("numero_de_serie",this.brf.EvaluaQuery("  Select FLDD[Numero_de_Serie]", 1, "ABC123"), 1,"ABC123"); 
  // this.brf.CreateSessionVar("nombre_usuario",this.brf.EvaluaQuery("  Select Name From Spartan_User Where id_user = GLOBAL[USERID]", 1, "ABC123"), 1,"ABC123"); 
  // this.brf.CreateSessionVar("tipo_inspeccion",this.brf.EvaluaQuery("  Select 'FLD[Tipo_de_inspeccion]'", 1, "ABC123"), 1,"ABC123");
} 
//TERMINA - BRID:4642

//rulesBeforeSave_ExecuteBusinessRulesEnd


    return result;
  }

  //Fin de reglas
  
}
