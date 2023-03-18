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
import { Agrupacion_de_ReportesService } from 'src/app/api-services/Agrupacion_de_Reportes.service';
import { Agrupacion_de_Reportes } from 'src/app/models/Agrupacion_de_Reportes';
import { Modulos_reportesService } from 'src/app/api-services/Modulos_reportes.service';
import { Modulos_reportes } from 'src/app/models/Modulos_reportes';
import { Detalle_Agrupacion_de_ReportesService } from 'src/app/api-services/Detalle_Agrupacion_de_Reportes.service';
import { Detalle_Agrupacion_de_Reportes } from 'src/app/models/Detalle_Agrupacion_de_Reportes';
import { Catalogo_ReportesService } from 'src/app/api-services/Catalogo_Reportes.service';
import { Catalogo_Reportes } from 'src/app/models/Catalogo_Reportes';


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
  selector: 'app-Agrupacion_de_Reportes',
  templateUrl: './Agrupacion_de_Reportes.component.html',
  styleUrls: ['./Agrupacion_de_Reportes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Agrupacion_de_ReportesComponent implements OnInit, AfterViewInit {
MRaddReportes: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Agrupacion_de_ReportesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Agrupacion_de_Reportes;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varModulos_reportes: Modulos_reportes[] = [];
	public varCatalogo_Reportes: Catalogo_Reportes[] = [];



	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceReportes = new MatTableDataSource<Detalle_Agrupacion_de_Reportes>();
  ReportesColumns = [
    { def: 'actions', hide: false },
    { def: 'Reporte', hide: false },
    { def: 'Orden', hide: false },
	
  ];
  ReportesData: Detalle_Agrupacion_de_Reportes[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Agrupacion_de_ReportesService: Agrupacion_de_ReportesService,
    private Modulos_reportesService: Modulos_reportesService,
    private Detalle_Agrupacion_de_ReportesService: Detalle_Agrupacion_de_ReportesService,
    private Catalogo_ReportesService: Catalogo_ReportesService,


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
    this.model = new Agrupacion_de_Reportes(this.fb);
    this.Agrupacion_de_ReportesForm = this.model.buildFormGroup();
    this.ReportesItems.removeAt(0);
	
	this.Agrupacion_de_ReportesForm.get('Folio').disable();
    this.Agrupacion_de_ReportesForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceReportes.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.ReportesColumns.splice(0, 1);
		
          this.Agrupacion_de_ReportesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Agrupacion_de_Reportes)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Agrupacion_de_ReportesService.listaSelAll(0, 1, 'Agrupacion_de_Reportes.Folio=' + id).toPromise();
	if (result.Agrupacion_de_Reportess.length > 0) {
        let fReportes = await this.Detalle_Agrupacion_de_ReportesService.listaSelAll(0, 1000,'Agrupacion_de_Reportes.Folio=' + id).toPromise();
            this.ReportesData = fReportes.Detalle_Agrupacion_de_Reportess;
            this.loadReportes(fReportes.Detalle_Agrupacion_de_Reportess);
            this.dataSourceReportes = new MatTableDataSource(fReportes.Detalle_Agrupacion_de_Reportess);
            this.dataSourceReportes.paginator = this.paginator;
            this.dataSourceReportes.sort = this.sort;
	  
        this.model.fromObject(result.Agrupacion_de_Reportess[0]);

		this.Agrupacion_de_ReportesForm.markAllAsTouched();
		this.Agrupacion_de_ReportesForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get ReportesItems() {
    return this.Agrupacion_de_ReportesForm.get('Detalle_Agrupacion_de_ReportesItems') as FormArray;
  }

  getReportesColumns(): string[] {
    return this.ReportesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadReportes(Reportes: Detalle_Agrupacion_de_Reportes[]) {
    Reportes.forEach(element => {
      this.addReportes(element);
    });
  }

  addReportesToMR() {
    const Reportes = new Detalle_Agrupacion_de_Reportes(this.fb);
    this.ReportesData.push(this.addReportes(Reportes));
    this.dataSourceReportes.data = this.ReportesData;
    Reportes.edit = true;
    Reportes.isNew = true;
    const length = this.dataSourceReportes.data.length;
    const index = length - 1;
    const formReportes = this.ReportesItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceReportes.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addReportes(entity: Detalle_Agrupacion_de_Reportes) {
    const Reportes = new Detalle_Agrupacion_de_Reportes(this.fb);
    this.ReportesItems.push(Reportes.buildFormGroup());
    if (entity) {
      Reportes.fromObject(entity);
    }
	return entity;
  }  

  ReportesItemsByFolio(Folio: number): FormGroup {
    return (this.Agrupacion_de_ReportesForm.get('Detalle_Agrupacion_de_ReportesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  ReportesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceReportes.data.indexOf(element);
	let fb = this.ReportesItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteReportes(element: any) {
    let index = this.dataSourceReportes.data.indexOf(element);
    this.ReportesData[index].IsDeleted = true;
    this.dataSourceReportes.data = this.ReportesData;
    this.dataSourceReportes._updateChangeSubscription();
    index = this.dataSourceReportes.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditReportes(element: any) {
    let index = this.dataSourceReportes.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.ReportesData[index].IsDeleted = true;
      this.dataSourceReportes.data = this.ReportesData;
      this.dataSourceReportes._updateChangeSubscription();
      index = this.ReportesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveReportes(element: any) {
    const index = this.dataSourceReportes.data.indexOf(element);
    const formReportes = this.ReportesItems.controls[index] as FormGroup;
    this.ReportesData[index].Reporte = formReportes.value.Reporte;
    this.ReportesData[index].Reporte_Catalogo_Reportes = formReportes.value.Reporte !== '' ?
     this.varCatalogo_Reportes.filter(d => d.Clave === formReportes.value.Reporte)[0] : null ;	
    this.ReportesData[index].Orden = formReportes.value.Orden;
	
    this.ReportesData[index].isNew = false;
    this.dataSourceReportes.data = this.ReportesData;
    this.dataSourceReportes._updateChangeSubscription();
  }
  
  editReportes(element: any) {
    const index = this.dataSourceReportes.data.indexOf(element);
    const formReportes = this.ReportesItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_Agrupacion_de_Reportes(Folio: number) {
    this.dataSourceReportes.data.forEach(async (d, index) => {
      const data = this.ReportesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Agrupacion_de_Reportes = Folio;
	
      
      if (model.Folio === 0) {
        // Add Reportes
		let response = await this.Detalle_Agrupacion_de_ReportesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formReportes = this.ReportesItemsByFolio(model.Folio);
        if (formReportes.dirty) {
          // Update Reportes
          let response = await this.Detalle_Agrupacion_de_ReportesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Reportes
        await this.Detalle_Agrupacion_de_ReportesService.delete(model.Folio).toPromise();
      }
    });
  }



  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Agrupacion_de_ReportesForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Modulos_reportesService.getAll());
    observablesArray.push(this.Catalogo_ReportesService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varModulos_reportes , varCatalogo_Reportes  ]) => {
          this.varModulos_reportes = varModulos_reportes;
          this.varCatalogo_Reportes = varCatalogo_Reportes;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Modulo': {
        this.Modulos_reportesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varModulos_reportes = x.Modulos_reportess;
        });
        break;
      }
      case 'Reporte': {
        this.Catalogo_ReportesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCatalogo_Reportes = x.Catalogo_Reportess;
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
      const entity = this.Agrupacion_de_ReportesForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Agrupacion_de_ReportesService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Agrupacion_de_Reportes(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Agrupacion_de_ReportesService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Agrupacion_de_Reportes(id);

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
      this.Agrupacion_de_ReportesForm.reset();
      this.model = new Agrupacion_de_Reportes(this.fb);
      this.Agrupacion_de_ReportesForm = this.model.buildFormGroup();
      this.dataSourceReportes = new MatTableDataSource<Detalle_Agrupacion_de_Reportes>();
      this.ReportesData = [];

    } else {
      this.router.navigate(['views/Agrupacion_de_Reportes/add']);
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
    this.router.navigate(['/Agrupacion_de_Reportes/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Modulo_ExecuteBusinessRules(): void {
        //Modulo_FieldExecuteBusinessRulesEnd
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
