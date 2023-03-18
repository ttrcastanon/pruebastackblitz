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
import { Listado_Inspeccion_InicalService } from 'src/app/api-services/Listado_Inspeccion_Inical.service';
import { Listado_Inspeccion_Inical } from 'src/app/models/Listado_Inspeccion_Inical';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { Detalle_Listado_Inspeccion_InicalService } from 'src/app/api-services/Detalle_Listado_Inspeccion_Inical.service';
import { Detalle_Listado_Inspeccion_Inical } from 'src/app/models/Detalle_Listado_Inspeccion_Inical';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';


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
  selector: 'app-Listado_Inspeccion_Inical',
  templateUrl: './Listado_Inspeccion_Inical.component.html',
  styleUrls: ['./Listado_Inspeccion_Inical.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Listado_Inspeccion_InicalComponent implements OnInit, AfterViewInit {
MRaddDetalle_Listado_Inspeccion: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Listado_Inspeccion_InicalForm: FormGroup;
	public Editor = ClassicEditor;
	model: Listado_Inspeccion_Inical;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varAeronave: Aeronave[] = [];
	public varModelos: Modelos[] = [];
	public varCliente: Cliente[] = [];
	public varCodigo_Computarizado: Codigo_Computarizado[] = [];



	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceDetalle_Listado_Inspeccion = new MatTableDataSource<Detalle_Listado_Inspeccion_Inical>();
  Detalle_Listado_InspeccionColumns = [
    { def: 'actions', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Cliente', hide: false },
    { def: 'Fecha_Inspeccion', hide: false },
    { def: 'No_Serie', hide: false },
    { def: 'Codigo_Computarizado', hide: false },
    { def: 'Descripcion', hide: false },
	
  ];
  Detalle_Listado_InspeccionData: Detalle_Listado_Inspeccion_Inical[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Listado_Inspeccion_InicalService: Listado_Inspeccion_InicalService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private ClienteService: ClienteService,
    private Detalle_Listado_Inspeccion_InicalService: Detalle_Listado_Inspeccion_InicalService,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,


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
    this.model = new Listado_Inspeccion_Inical(this.fb);
    this.Listado_Inspeccion_InicalForm = this.model.buildFormGroup();
    this.Detalle_Listado_InspeccionItems.removeAt(0);
	
	this.Listado_Inspeccion_InicalForm.get('Folio').disable();
    this.Listado_Inspeccion_InicalForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceDetalle_Listado_Inspeccion.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Detalle_Listado_InspeccionColumns.splice(0, 1);
		
          this.Listado_Inspeccion_InicalForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Listado_Inspeccion_Inical)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Listado_Inspeccion_InicalService.listaSelAll(0, 1, 'Listado_Inspeccion_Inical.Folio=' + id).toPromise();
	if (result.Listado_Inspeccion_Inicals.length > 0) {
        let fDetalle_Listado_Inspeccion = await this.Detalle_Listado_Inspeccion_InicalService.listaSelAll(0, 1000,'Listado_Inspeccion_Inical.Folio=' + id).toPromise();
            this.Detalle_Listado_InspeccionData = fDetalle_Listado_Inspeccion.Detalle_Listado_Inspeccion_Inicals;
            this.loadDetalle_Listado_Inspeccion(fDetalle_Listado_Inspeccion.Detalle_Listado_Inspeccion_Inicals);
            this.dataSourceDetalle_Listado_Inspeccion = new MatTableDataSource(fDetalle_Listado_Inspeccion.Detalle_Listado_Inspeccion_Inicals);
            this.dataSourceDetalle_Listado_Inspeccion.paginator = this.paginator;
            this.dataSourceDetalle_Listado_Inspeccion.sort = this.sort;
	  
        this.model.fromObject(result.Listado_Inspeccion_Inicals[0]);

		this.Listado_Inspeccion_InicalForm.markAllAsTouched();
		this.Listado_Inspeccion_InicalForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get Detalle_Listado_InspeccionItems() {
    return this.Listado_Inspeccion_InicalForm.get('Detalle_Listado_Inspeccion_InicalItems') as FormArray;
  }

  getDetalle_Listado_InspeccionColumns(): string[] {
    return this.Detalle_Listado_InspeccionColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadDetalle_Listado_Inspeccion(Detalle_Listado_Inspeccion: Detalle_Listado_Inspeccion_Inical[]) {
    Detalle_Listado_Inspeccion.forEach(element => {
      this.addDetalle_Listado_Inspeccion(element);
    });
  }

  addDetalle_Listado_InspeccionToMR() {
    const Detalle_Listado_Inspeccion = new Detalle_Listado_Inspeccion_Inical(this.fb);
    this.Detalle_Listado_InspeccionData.push(this.addDetalle_Listado_Inspeccion(Detalle_Listado_Inspeccion));
    this.dataSourceDetalle_Listado_Inspeccion.data = this.Detalle_Listado_InspeccionData;
    Detalle_Listado_Inspeccion.edit = true;
    Detalle_Listado_Inspeccion.isNew = true;
    const length = this.dataSourceDetalle_Listado_Inspeccion.data.length;
    const index = length - 1;
    const formDetalle_Listado_Inspeccion = this.Detalle_Listado_InspeccionItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceDetalle_Listado_Inspeccion.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addDetalle_Listado_Inspeccion(entity: Detalle_Listado_Inspeccion_Inical) {
    const Detalle_Listado_Inspeccion = new Detalle_Listado_Inspeccion_Inical(this.fb);
    this.Detalle_Listado_InspeccionItems.push(Detalle_Listado_Inspeccion.buildFormGroup());
    if (entity) {
      Detalle_Listado_Inspeccion.fromObject(entity);
    }
	return entity;
  }  

  Detalle_Listado_InspeccionItemsByFolio(Folio: number): FormGroup {
    return (this.Listado_Inspeccion_InicalForm.get('Detalle_Listado_Inspeccion_InicalItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Detalle_Listado_InspeccionItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceDetalle_Listado_Inspeccion.data.indexOf(element);
	let fb = this.Detalle_Listado_InspeccionItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteDetalle_Listado_Inspeccion(element: any) {
    let index = this.dataSourceDetalle_Listado_Inspeccion.data.indexOf(element);
    this.Detalle_Listado_InspeccionData[index].IsDeleted = true;
    this.dataSourceDetalle_Listado_Inspeccion.data = this.Detalle_Listado_InspeccionData;
    this.dataSourceDetalle_Listado_Inspeccion._updateChangeSubscription();
    index = this.dataSourceDetalle_Listado_Inspeccion.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditDetalle_Listado_Inspeccion(element: any) {
    let index = this.dataSourceDetalle_Listado_Inspeccion.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Detalle_Listado_InspeccionData[index].IsDeleted = true;
      this.dataSourceDetalle_Listado_Inspeccion.data = this.Detalle_Listado_InspeccionData;
      this.dataSourceDetalle_Listado_Inspeccion._updateChangeSubscription();
      index = this.Detalle_Listado_InspeccionData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveDetalle_Listado_Inspeccion(element: any) {
    const index = this.dataSourceDetalle_Listado_Inspeccion.data.indexOf(element);
    const formDetalle_Listado_Inspeccion = this.Detalle_Listado_InspeccionItems.controls[index] as FormGroup;
    this.Detalle_Listado_InspeccionData[index].Matricula = formDetalle_Listado_Inspeccion.value.Matricula;
    this.Detalle_Listado_InspeccionData[index].Matricula_Aeronave = formDetalle_Listado_Inspeccion.value.Matricula !== '' ?
     this.varAeronave.filter(d => d.Matricula === formDetalle_Listado_Inspeccion.value.Matricula)[0] : null ;	
    this.Detalle_Listado_InspeccionData[index].Modelo = formDetalle_Listado_Inspeccion.value.Modelo;
    this.Detalle_Listado_InspeccionData[index].Modelo_Modelos = formDetalle_Listado_Inspeccion.value.Modelo !== '' ?
     this.varModelos.filter(d => d.Clave === formDetalle_Listado_Inspeccion.value.Modelo)[0] : null ;	
    this.Detalle_Listado_InspeccionData[index].Cliente = formDetalle_Listado_Inspeccion.value.Cliente;
    this.Detalle_Listado_InspeccionData[index].Cliente_Cliente = formDetalle_Listado_Inspeccion.value.Cliente !== '' ?
     this.varCliente.filter(d => d.Clave === formDetalle_Listado_Inspeccion.value.Cliente)[0] : null ;	
    this.Detalle_Listado_InspeccionData[index].Fecha_Inspeccion = formDetalle_Listado_Inspeccion.value.Fecha_Inspeccion;
    this.Detalle_Listado_InspeccionData[index].No_Serie = formDetalle_Listado_Inspeccion.value.No_Serie;
    this.Detalle_Listado_InspeccionData[index].Codigo_Computarizado = formDetalle_Listado_Inspeccion.value.Codigo_Computarizado;
    this.Detalle_Listado_InspeccionData[index].Codigo_Computarizado_Codigo_Computarizado = formDetalle_Listado_Inspeccion.value.Codigo_Computarizado !== '' ?
     this.varCodigo_Computarizado.filter(d => d.Codigo === formDetalle_Listado_Inspeccion.value.Codigo_Computarizado)[0] : null ;	
    this.Detalle_Listado_InspeccionData[index].Descripcion = formDetalle_Listado_Inspeccion.value.Descripcion;
    this.Detalle_Listado_InspeccionData[index].Descripcion_Codigo_Computarizado = formDetalle_Listado_Inspeccion.value.Descripcion !== '' ?
     this.varCodigo_Computarizado.filter(d => d.Codigo === formDetalle_Listado_Inspeccion.value.Descripcion)[0] : null ;	
	
    this.Detalle_Listado_InspeccionData[index].isNew = false;
    this.dataSourceDetalle_Listado_Inspeccion.data = this.Detalle_Listado_InspeccionData;
    this.dataSourceDetalle_Listado_Inspeccion._updateChangeSubscription();
  }
  
  editDetalle_Listado_Inspeccion(element: any) {
    const index = this.dataSourceDetalle_Listado_Inspeccion.data.indexOf(element);
    const formDetalle_Listado_Inspeccion = this.Detalle_Listado_InspeccionItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_Listado_Inspeccion_Inical(Folio: number) {
    this.dataSourceDetalle_Listado_Inspeccion.data.forEach(async (d, index) => {
      const data = this.Detalle_Listado_InspeccionItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Listado_Inspeccion_Inical = Folio;
	
      
      if (model.Folio === 0) {
        // Add Detalle Listado Inspección
		let response = await this.Detalle_Listado_Inspeccion_InicalService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formDetalle_Listado_Inspeccion = this.Detalle_Listado_InspeccionItemsByFolio(model.Folio);
        if (formDetalle_Listado_Inspeccion.dirty) {
          // Update Detalle Listado Inspección
          let response = await this.Detalle_Listado_Inspeccion_InicalService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Detalle Listado Inspección
        await this.Detalle_Listado_Inspeccion_InicalService.delete(model.Folio).toPromise();
      }
    });
  }



  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Listado_Inspeccion_InicalForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.AeronaveService.getAll());
    observablesArray.push(this.ModelosService.getAll());
    observablesArray.push(this.ClienteService.getAll());
    observablesArray.push(this.Codigo_ComputarizadoService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varAeronave , varModelos , varCliente  , varCodigo_Computarizado  ]) => {
          this.varAeronave = varAeronave;
          this.varModelos = varModelos;
          this.varCliente = varCliente;
          this.varCodigo_Computarizado = varCodigo_Computarizado;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
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
      case 'Cliente': {
        this.ClienteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCliente = x.Clientes;
        });
        break;
      }
      case 'Codigo_Computarizado': {
        this.Codigo_ComputarizadoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCodigo_Computarizado = x.Codigo_Computarizados;
        });
        break;
      }
      case 'Descripcion': {
        this.Codigo_ComputarizadoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCodigo_Computarizado = x.Codigo_Computarizados;
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
      const entity = this.Listado_Inspeccion_InicalForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Listado_Inspeccion_InicalService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Listado_Inspeccion_Inical(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Listado_Inspeccion_InicalService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Listado_Inspeccion_Inical(id);

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
      this.Listado_Inspeccion_InicalForm.reset();
      this.model = new Listado_Inspeccion_Inical(this.fb);
      this.Listado_Inspeccion_InicalForm = this.model.buildFormGroup();
      this.dataSourceDetalle_Listado_Inspeccion = new MatTableDataSource<Detalle_Listado_Inspeccion_Inical>();
      this.Detalle_Listado_InspeccionData = [];

    } else {
      this.router.navigate(['views/Listado_Inspeccion_Inical/add']);
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
    this.router.navigate(['/Listado_Inspeccion_Inical/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Matricula_ExecuteBusinessRules(): void {
        //Matricula_FieldExecuteBusinessRulesEnd
    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    Cliente_ExecuteBusinessRules(): void {
        //Cliente_FieldExecuteBusinessRulesEnd
    }
    Fecha_Estimada_de_Entrega_ExecuteBusinessRules(): void {
        //Fecha_Estimada_de_Entrega_FieldExecuteBusinessRulesEnd
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
