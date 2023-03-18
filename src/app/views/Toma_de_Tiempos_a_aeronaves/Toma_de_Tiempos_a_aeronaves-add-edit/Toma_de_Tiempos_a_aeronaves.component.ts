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
import { Toma_de_Tiempos_a_aeronavesService } from 'src/app/api-services/Toma_de_Tiempos_a_aeronaves.service';
import { Toma_de_Tiempos_a_aeronaves } from 'src/app/models/Toma_de_Tiempos_a_aeronaves';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Detalle_Toma_de_Tiempos_ComponentesService } from 'src/app/api-services/Detalle_Toma_de_Tiempos_Componentes.service';
import { Detalle_Toma_de_Tiempos_Componentes } from 'src/app/models/Detalle_Toma_de_Tiempos_Componentes';


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
  selector: 'app-Toma_de_Tiempos_a_aeronaves',
  templateUrl: './Toma_de_Tiempos_a_aeronaves.component.html',
  styleUrls: ['./Toma_de_Tiempos_a_aeronaves.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Toma_de_Tiempos_a_aeronavesComponent implements OnInit, AfterViewInit {
MRaddComponentes: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Toma_de_Tiempos_a_aeronavesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Toma_de_Tiempos_a_aeronaves;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varSpartan_User: Spartan_User[] = [];
	optionsMatricula: Observable<Aeronave[]>;
	hasOptionsMatricula: boolean;
	isLoadingMatricula: boolean;



	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceComponentes = new MatTableDataSource<Detalle_Toma_de_Tiempos_Componentes>();
  ComponentesColumns = [
    { def: 'actions', hide: false },
    { def: 'Componente', hide: false },
    { def: 'turm', hide: false },
    { def: 'T_T_', hide: false },
    { def: 'CICLOS', hide: false },
	
  ];
  ComponentesData: Detalle_Toma_de_Tiempos_Componentes[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Toma_de_Tiempos_a_aeronavesService: Toma_de_Tiempos_a_aeronavesService,
    private Spartan_UserService: Spartan_UserService,
    private AeronaveService: AeronaveService,
    private Detalle_Toma_de_Tiempos_ComponentesService: Detalle_Toma_de_Tiempos_ComponentesService,


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
    this.model = new Toma_de_Tiempos_a_aeronaves(this.fb);
    this.Toma_de_Tiempos_a_aeronavesForm = this.model.buildFormGroup();
    this.ComponentesItems.removeAt(0);
	
	this.Toma_de_Tiempos_a_aeronavesForm.get('Folio').disable();
    this.Toma_de_Tiempos_a_aeronavesForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceComponentes.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.ComponentesColumns.splice(0, 1);
		
          this.Toma_de_Tiempos_a_aeronavesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Toma_de_Tiempos_a_aeronaves)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Toma_de_Tiempos_a_aeronavesForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Toma_de_Tiempos_a_aeronavesService.listaSelAll(0, 1, 'Toma_de_Tiempos_a_aeronaves.Folio=' + id).toPromise();
	if (result.Toma_de_Tiempos_a_aeronavess.length > 0) {
        let fComponentes = await this.Detalle_Toma_de_Tiempos_ComponentesService.listaSelAll(0, 1000,'Toma_de_Tiempos_a_aeronaves.Folio=' + id).toPromise();
            this.ComponentesData = fComponentes.Detalle_Toma_de_Tiempos_Componentess;
            this.loadComponentes(fComponentes.Detalle_Toma_de_Tiempos_Componentess);
            this.dataSourceComponentes = new MatTableDataSource(fComponentes.Detalle_Toma_de_Tiempos_Componentess);
            this.dataSourceComponentes.paginator = this.paginator;
            this.dataSourceComponentes.sort = this.sort;
	  
        this.model.fromObject(result.Toma_de_Tiempos_a_aeronavess[0]);
        this.Toma_de_Tiempos_a_aeronavesForm.get('Matricula').setValue(
          result.Toma_de_Tiempos_a_aeronavess[0].Matricula_Aeronave.Matricula,
          { onlySelf: false, emitEvent: true }
        );

		this.Toma_de_Tiempos_a_aeronavesForm.markAllAsTouched();
		this.Toma_de_Tiempos_a_aeronavesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get ComponentesItems() {
    return this.Toma_de_Tiempos_a_aeronavesForm.get('Detalle_Toma_de_Tiempos_ComponentesItems') as FormArray;
  }

  getComponentesColumns(): string[] {
    return this.ComponentesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadComponentes(Componentes: Detalle_Toma_de_Tiempos_Componentes[]) {
    Componentes.forEach(element => {
      this.addComponentes(element);
    });
  }

  addComponentesToMR() {
    const Componentes = new Detalle_Toma_de_Tiempos_Componentes(this.fb);
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

  addComponentes(entity: Detalle_Toma_de_Tiempos_Componentes) {
    const Componentes = new Detalle_Toma_de_Tiempos_Componentes(this.fb);
    this.ComponentesItems.push(Componentes.buildFormGroup());
    if (entity) {
      Componentes.fromObject(entity);
    }
	return entity;
  }  

  ComponentesItemsByFolio(Folio: number): FormGroup {
    return (this.Toma_de_Tiempos_a_aeronavesForm.get('Detalle_Toma_de_Tiempos_ComponentesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
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
    this.ComponentesData[index].turm = formComponentes.value.turm;
    this.ComponentesData[index].T_T_ = formComponentes.value.T_T_;
    this.ComponentesData[index].CICLOS = formComponentes.value.CICLOS;
	
    this.ComponentesData[index].isNew = false;
    this.dataSourceComponentes.data = this.ComponentesData;
    this.dataSourceComponentes._updateChangeSubscription();
  }
  
  editComponentes(element: any) {
    const index = this.dataSourceComponentes.data.indexOf(element);
    const formComponentes = this.ComponentesItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_Toma_de_Tiempos_Componentes(Folio: number) {
    this.dataSourceComponentes.data.forEach(async (d, index) => {
      const data = this.ComponentesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Toma_de_Tiempos_a_aeronaves = Folio;
	
      
      if (model.Folio === 0) {
        // Add Componentes
		let response = await this.Detalle_Toma_de_Tiempos_ComponentesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formComponentes = this.ComponentesItemsByFolio(model.Folio);
        if (formComponentes.dirty) {
          // Update Componentes
          let response = await this.Detalle_Toma_de_Tiempos_ComponentesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Componentes
        await this.Detalle_Toma_de_Tiempos_ComponentesService.delete(model.Folio).toPromise();
      }
    });
  }



  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Toma_de_Tiempos_a_aeronavesForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Spartan_UserService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varSpartan_User  ]) => {
          this.varSpartan_User = varSpartan_User;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Toma_de_Tiempos_a_aeronavesForm.get('Matricula').valueChanges.pipe(
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
	  this.Toma_de_Tiempos_a_aeronavesForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
	  this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Usuario_que_Registra': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Toma_de_Tiempos_a_aeronavesForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Toma_de_Tiempos_a_aeronavesForm.get('Matricula').value.Matricula;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Toma_de_Tiempos_a_aeronavesService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Toma_de_Tiempos_Componentes(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Toma_de_Tiempos_a_aeronavesService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Toma_de_Tiempos_Componentes(id);

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
      this.Toma_de_Tiempos_a_aeronavesForm.reset();
      this.model = new Toma_de_Tiempos_a_aeronaves(this.fb);
      this.Toma_de_Tiempos_a_aeronavesForm = this.model.buildFormGroup();
      this.dataSourceComponentes = new MatTableDataSource<Detalle_Toma_de_Tiempos_Componentes>();
      this.ComponentesData = [];

    } else {
      this.router.navigate(['views/Toma_de_Tiempos_a_aeronaves/add']);
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
    this.router.navigate(['/Toma_de_Tiempos_a_aeronaves/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Fecha_de_Registro_ExecuteBusinessRules(): void {
        //Fecha_de_Registro_FieldExecuteBusinessRulesEnd
    }
    Hora_de_Registro_ExecuteBusinessRules(): void {
        //Hora_de_Registro_FieldExecuteBusinessRulesEnd
    }
    Usuario_que_Registra_ExecuteBusinessRules(): void {
        //Usuario_que_Registra_FieldExecuteBusinessRulesEnd
    }
    Matricula_ExecuteBusinessRules(): void {
        //Matricula_FieldExecuteBusinessRulesEnd
    }
    Modelo_ExecuteBusinessRules(): void {
        //Modelo_FieldExecuteBusinessRulesEnd
    }
    Propietario_ExecuteBusinessRules(): void {
        //Propietario_FieldExecuteBusinessRulesEnd
    }
    Reportes_de_la_Aeronave_ExecuteBusinessRules(): void {
        //Reportes_de_la_Aeronave_FieldExecuteBusinessRulesEnd
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
