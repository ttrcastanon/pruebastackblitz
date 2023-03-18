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
import { Listado_de_Ordenes_de_TrabajoService } from 'src/app/api-services/Listado_de_Ordenes_de_Trabajo.service';
import { Listado_de_Ordenes_de_Trabajo } from 'src/app/models/Listado_de_Ordenes_de_Trabajo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Estatus_de_Orden_de_TrabajoService } from 'src/app/api-services/Estatus_de_Orden_de_Trabajo.service';
import { Estatus_de_Orden_de_Trabajo } from 'src/app/models/Estatus_de_Orden_de_Trabajo';


import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { SpartanService } from "src/app/api-services/spartan.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';

@Component({
  selector: 'app-Listado_de_Ordenes_de_Trabajo',
  templateUrl: './Listado_de_Ordenes_de_Trabajo.component.html',
  styleUrls: ['./Listado_de_Ordenes_de_Trabajo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Listado_de_Ordenes_de_TrabajoComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Listado_de_Ordenes_de_TrabajoForm: FormGroup;
	public Editor = ClassicEditor;
	model: Listado_de_Ordenes_de_Trabajo;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varAeronave: Aeronave[] = [];
	public varModelos: Modelos[] = [];

	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Listado_de_Ordenes_de_TrabajoService: Listado_de_Ordenes_de_TrabajoService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,

    private _seguridad: SeguridadService,	
    private spartanFileService: SpartanFileService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private SpartanService: SpartanService,
    renderer: Renderer2) {
	this.brf = new BusinessRulesFunctions(renderer, SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Listado_de_Ordenes_de_Trabajo(this.fb);
    this.Listado_de_Ordenes_de_TrabajoForm = this.model.buildFormGroup();
	this.Listado_de_Ordenes_de_TrabajoForm.get('Folio').disable();
    this.Listado_de_Ordenes_de_TrabajoForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    //this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Listado_de_Ordenes_de_TrabajoForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Listado_de_Ordenes_de_Trabajo)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	//this.rulesOnInit();	  
  }

  populateModel(id: number) {
  
    this.spinner.show('loading');
    this.Listado_de_Ordenes_de_TrabajoService.listaSelAll(0, 1, 'Listado_de_Ordenes_de_Trabajo.Folio=' + id).subscribe(async result => {
      if (result.Listado_de_Ordenes_de_Trabajos.length > 0) {
        this.model.fromObject(result.Listado_de_Ordenes_de_Trabajos[0]);

        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
    });
  }
  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Listado_de_Ordenes_de_TrabajoForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Folio);
        } else {
          this.operation = "New";
        }
        //this.rulesOnInit();
      });
  }
  
  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.AeronaveService.getAll());
    observablesArray.push(this.ModelosService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varAeronave , varModelos ]) => {
          this.varAeronave = varAeronave;
          this.varModelos = varModelos;

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
      const entity = this.Listado_de_Ordenes_de_TrabajoForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Listado_de_Ordenes_de_TrabajoService.update(this.model.Folio, entity).toPromise();

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Listado_de_Ordenes_de_TrabajoService.insert(entity).toPromise().then(async id => {
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
      this.Listado_de_Ordenes_de_TrabajoForm.reset();
      this.model = new Listado_de_Ordenes_de_Trabajo(this.fb);
      this.Listado_de_Ordenes_de_TrabajoForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Listado_de_Ordenes_de_Trabajo/add']);
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
    this.router.navigate(['/Listado_de_Ordenes_de_Trabajo/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas
  //@@Begin.Keep.Implementation('applyRules()')
  
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
  }
  
  rulesAfterSave() {
  }
  
  rulesBeforeSave(): boolean {
    const result = true;
    return result;
  }
  
  //@@End.Keep.Implementation('//Fin de reglas')

//Fin de reglas
  
}
