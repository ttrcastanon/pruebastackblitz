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
import { Comparativo_de_Proveedores_MaterialesService } from 'src/app/api-services/Comparativo_de_Proveedores_Materiales.service';
import { Comparativo_de_Proveedores_Materiales } from 'src/app/models/Comparativo_de_Proveedores_Materiales';
import { Detalle_de_MaterialesService } from 'src/app/api-services/Detalle_de_Materiales.service';
import { Detalle_de_Materiales } from 'src/app/models/Detalle_de_Materiales';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Detalle_de_Agregar_Proveedor_MaterialesService } from 'src/app/api-services/Detalle_de_Agregar_Proveedor_Materiales.service';
import { Detalle_de_Agregar_Proveedor_Materiales } from 'src/app/models/Detalle_de_Agregar_Proveedor_Materiales';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Departamento } from 'src/app/models/Departamento';


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
  selector: 'app-Comparativo_de_Proveedores_Materiales',
  templateUrl: './Comparativo_de_Proveedores_Materiales.component.html',
  styleUrls: ['./Comparativo_de_Proveedores_Materiales.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Comparativo_de_Proveedores_MaterialesComponent implements OnInit, AfterViewInit {
MRaddAgregar_Proveedor: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Comparativo_de_Proveedores_MaterialesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Comparativo_de_Proveedores_Materiales;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varDetalle_de_Materiales: Detalle_de_Materiales[] = [];
	public varAeronave: Aeronave[] = [];
	public varModelos: Modelos[] = [];
	public varCreacion_de_Proveedores: Creacion_de_Proveedores[] = [];
	public varDepartamento: Departamento[] = [];



	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceAgregar_Proveedor = new MatTableDataSource<Detalle_de_Agregar_Proveedor_Materiales>();
  Agregar_ProveedorColumns = [
    { def: 'actions', hide: false },
    { def: 'Proveedor', hide: false },
    { def: 'Precio', hide: false },
    { def: 'Tipo_de_Cambio', hide: false },
    { def: 'Departamento', hide: false },
    { def: 'Tipo_de_Envio', hide: false },
    { def: 'Fecha_de_Entrega', hide: false },
    { def: 'Seleccion_de_Proveedor', hide: false },
	
  ];
  Agregar_ProveedorData: Detalle_de_Agregar_Proveedor_Materiales[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Comparativo_de_Proveedores_MaterialesService: Comparativo_de_Proveedores_MaterialesService,
    private Detalle_de_MaterialesService: Detalle_de_MaterialesService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private Detalle_de_Agregar_Proveedor_MaterialesService: Detalle_de_Agregar_Proveedor_MaterialesService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private DepartamentoService: DepartamentoService,


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
    this.model = new Comparativo_de_Proveedores_Materiales(this.fb);
    this.Comparativo_de_Proveedores_MaterialesForm = this.model.buildFormGroup();
    this.Agregar_ProveedorItems.removeAt(0);
	
	this.Comparativo_de_Proveedores_MaterialesForm.get('Folio').disable();
    this.Comparativo_de_Proveedores_MaterialesForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceAgregar_Proveedor.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Agregar_ProveedorColumns.splice(0, 1);
		
          this.Comparativo_de_Proveedores_MaterialesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Comparativo_de_Proveedores_Materiales)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Comparativo_de_Proveedores_MaterialesService.listaSelAll(0, 1, 'Comparativo_de_Proveedores_Materiales.Folio=' + id).toPromise();
	if (result.Comparativo_de_Proveedores_Materialess.length > 0) {
        let fAgregar_Proveedor = await this.Detalle_de_Agregar_Proveedor_MaterialesService.listaSelAll(0, 1000,'Comparativo_de_Proveedores_Materiales.Folio=' + id).toPromise();
            this.Agregar_ProveedorData = fAgregar_Proveedor.Detalle_de_Agregar_Proveedor_Materialess;
            this.loadAgregar_Proveedor(fAgregar_Proveedor.Detalle_de_Agregar_Proveedor_Materialess);
            this.dataSourceAgregar_Proveedor = new MatTableDataSource(fAgregar_Proveedor.Detalle_de_Agregar_Proveedor_Materialess);
            this.dataSourceAgregar_Proveedor.paginator = this.paginator;
            this.dataSourceAgregar_Proveedor.sort = this.sort;
	  
        this.model.fromObject(result.Comparativo_de_Proveedores_Materialess[0]);

		this.Comparativo_de_Proveedores_MaterialesForm.markAllAsTouched();
		this.Comparativo_de_Proveedores_MaterialesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Agregar_ProveedorItems() {
    return this.Comparativo_de_Proveedores_MaterialesForm.get('Detalle_de_Agregar_Proveedor_MaterialesItems') as FormArray;
  }

  getAgregar_ProveedorColumns(): string[] {
    return this.Agregar_ProveedorColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadAgregar_Proveedor(Agregar_Proveedor: Detalle_de_Agregar_Proveedor_Materiales[]) {
    Agregar_Proveedor.forEach(element => {
      this.addAgregar_Proveedor(element);
    });
  }

  addAgregar_ProveedorToMR() {
    const Agregar_Proveedor = new Detalle_de_Agregar_Proveedor_Materiales(this.fb);
    this.Agregar_ProveedorData.push(this.addAgregar_Proveedor(Agregar_Proveedor));
    this.dataSourceAgregar_Proveedor.data = this.Agregar_ProveedorData;
    Agregar_Proveedor.edit = true;
    Agregar_Proveedor.isNew = true;
    const length = this.dataSourceAgregar_Proveedor.data.length;
    const index = length - 1;
    const formAgregar_Proveedor = this.Agregar_ProveedorItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceAgregar_Proveedor.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addAgregar_Proveedor(entity: Detalle_de_Agregar_Proveedor_Materiales) {
    const Agregar_Proveedor = new Detalle_de_Agregar_Proveedor_Materiales(this.fb);
    this.Agregar_ProveedorItems.push(Agregar_Proveedor.buildFormGroup());
    if (entity) {
      Agregar_Proveedor.fromObject(entity);
    }
	return entity;
  }  

  Agregar_ProveedorItemsByFolio(Folio: number): FormGroup {
    return (this.Comparativo_de_Proveedores_MaterialesForm.get('Detalle_de_Agregar_Proveedor_MaterialesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Agregar_ProveedorItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceAgregar_Proveedor.data.indexOf(element);
	let fb = this.Agregar_ProveedorItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteAgregar_Proveedor(element: any) {
    let index = this.dataSourceAgregar_Proveedor.data.indexOf(element);
    this.Agregar_ProveedorData[index].IsDeleted = true;
    this.dataSourceAgregar_Proveedor.data = this.Agregar_ProveedorData;
    this.dataSourceAgregar_Proveedor._updateChangeSubscription();
    index = this.dataSourceAgregar_Proveedor.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditAgregar_Proveedor(element: any) {
    let index = this.dataSourceAgregar_Proveedor.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Agregar_ProveedorData[index].IsDeleted = true;
      this.dataSourceAgregar_Proveedor.data = this.Agregar_ProveedorData;
      this.dataSourceAgregar_Proveedor._updateChangeSubscription();
      index = this.Agregar_ProveedorData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveAgregar_Proveedor(element: any) {
    const index = this.dataSourceAgregar_Proveedor.data.indexOf(element);
    const formAgregar_Proveedor = this.Agregar_ProveedorItems.controls[index] as FormGroup;
    this.Agregar_ProveedorData[index].Proveedor = formAgregar_Proveedor.value.Proveedor;
    this.Agregar_ProveedorData[index].Proveedor_Creacion_de_Proveedores = formAgregar_Proveedor.value.Proveedor !== '' ?
     this.varCreacion_de_Proveedores.filter(d => d.Clave === formAgregar_Proveedor.value.Proveedor)[0] : null ;	
    this.Agregar_ProveedorData[index].Precio = formAgregar_Proveedor.value.Precio;
    this.Agregar_ProveedorData[index].Tipo_de_Cambio = formAgregar_Proveedor.value.Tipo_de_Cambio;
    this.Agregar_ProveedorData[index].Departamento = formAgregar_Proveedor.value.Departamento;
    this.Agregar_ProveedorData[index].Departamento_Departamento = formAgregar_Proveedor.value.Departamento !== '' ?
     this.varDepartamento.filter(d => d.Folio === formAgregar_Proveedor.value.Departamento)[0] : null ;	
    this.Agregar_ProveedorData[index].Tipo_de_Envio = formAgregar_Proveedor.value.Tipo_de_Envio;
    this.Agregar_ProveedorData[index].Fecha_de_Entrega = formAgregar_Proveedor.value.Fecha_de_Entrega;
    this.Agregar_ProveedorData[index].Seleccion_de_Proveedor = formAgregar_Proveedor.value.Seleccion_de_Proveedor;
	
    this.Agregar_ProveedorData[index].isNew = false;
    this.dataSourceAgregar_Proveedor.data = this.Agregar_ProveedorData;
    this.dataSourceAgregar_Proveedor._updateChangeSubscription();
  }
  
  editAgregar_Proveedor(element: any) {
    const index = this.dataSourceAgregar_Proveedor.data.indexOf(element);
    const formAgregar_Proveedor = this.Agregar_ProveedorItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_de_Agregar_Proveedor_Materiales(Folio: number) {
    this.dataSourceAgregar_Proveedor.data.forEach(async (d, index) => {
      const data = this.Agregar_ProveedorItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Comparativo_de_Proveedores_Materiales = Folio;
	
      
      if (model.Folio === 0) {
        // Add Agregar Proveedor
		let response = await this.Detalle_de_Agregar_Proveedor_MaterialesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formAgregar_Proveedor = this.Agregar_ProveedorItemsByFolio(model.Folio);
        if (formAgregar_Proveedor.dirty) {
          // Update Agregar Proveedor
          let response = await this.Detalle_de_Agregar_Proveedor_MaterialesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Agregar Proveedor
        await this.Detalle_de_Agregar_Proveedor_MaterialesService.delete(model.Folio).toPromise();
      }
    });
  }



  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Comparativo_de_Proveedores_MaterialesForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Detalle_de_MaterialesService.getAll());
    observablesArray.push(this.AeronaveService.getAll());
    observablesArray.push(this.ModelosService.getAll());
    observablesArray.push(this.Creacion_de_ProveedoresService.getAll());
    observablesArray.push(this.DepartamentoService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varDetalle_de_Materiales , varAeronave , varModelos , varCreacion_de_Proveedores  , varDepartamento  ]) => {
          this.varDetalle_de_Materiales = varDetalle_de_Materiales;
          this.varAeronave = varAeronave;
          this.varModelos = varModelos;
          this.varCreacion_de_Proveedores = varCreacion_de_Proveedores;
          this.varDepartamento = varDepartamento;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Folio_MR_Materiales': {
        this.Detalle_de_MaterialesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDetalle_de_Materiales = x.Detalle_de_Materialess;
        });
        break;
      }
      case 'Folio_MR_Fila_Materiales': {
        this.Detalle_de_MaterialesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDetalle_de_Materiales = x.Detalle_de_Materialess;
        });
        break;
      }
      case 'Matricula': {
        this.AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAeronave = x.Aeronaves;
        });
        break;
      }
      case 'Modelo': {
        this.ModelosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varModelos = x.Modeloss;
        });
        break;
      }
      case 'Proveedor': {
        this.Creacion_de_ProveedoresService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCreacion_de_Proveedores = x.Creacion_de_Proveedoress;
        });
        break;
      }
      case 'Departamento': {
        this.DepartamentoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDepartamento = x.Departamentos;
        });
        break;
      }


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
      const entity = this.Comparativo_de_Proveedores_MaterialesForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Comparativo_de_Proveedores_MaterialesService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Agregar_Proveedor_Materiales(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Comparativo_de_Proveedores_MaterialesService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Agregar_Proveedor_Materiales(id);

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
      this.Comparativo_de_Proveedores_MaterialesForm.reset();
      this.model = new Comparativo_de_Proveedores_Materiales(this.fb);
      this.Comparativo_de_Proveedores_MaterialesForm = this.model.buildFormGroup();
      this.dataSourceAgregar_Proveedor = new MatTableDataSource<Detalle_de_Agregar_Proveedor_Materiales>();
      this.Agregar_ProveedorData = [];

    } else {
      this.router.navigate(['views/Comparativo_de_Proveedores_Materiales/add']);
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
    this.router.navigate(['/Comparativo_de_Proveedores_Materiales/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Folio_MR_Materiales_ExecuteBusinessRules(): void {
        //Folio_MR_Materiales_FieldExecuteBusinessRulesEnd
    }
    Folio_MR_Fila_Materiales_ExecuteBusinessRules(): void {
        //Folio_MR_Fila_Materiales_FieldExecuteBusinessRulesEnd
    }
    No__Solicitud_ExecuteBusinessRules(): void {
        //No__Solicitud_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
    }
    Cantidad_ExecuteBusinessRules(): void {
        //Cantidad_FieldExecuteBusinessRulesEnd
    }
    Matricula_ExecuteBusinessRules(): void {
        //Matricula_FieldExecuteBusinessRulesEnd
    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    No_Reporte_ExecuteBusinessRules(): void {
        //No_Reporte_FieldExecuteBusinessRulesEnd
    }
    Condicion_de_la_parte_ExecuteBusinessRules(): void {
        //Condicion_de_la_parte_FieldExecuteBusinessRulesEnd
    }
    Razon_de_la_Solicitud_ExecuteBusinessRules(): void {
        //Razon_de_la_Solicitud_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
    }
    Observaciones_ExecuteBusinessRules(): void {
        //Observaciones_FieldExecuteBusinessRulesEnd
    }
    Estatus2_ExecuteBusinessRules(): void {
        //Estatus2_FieldExecuteBusinessRulesEnd
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
