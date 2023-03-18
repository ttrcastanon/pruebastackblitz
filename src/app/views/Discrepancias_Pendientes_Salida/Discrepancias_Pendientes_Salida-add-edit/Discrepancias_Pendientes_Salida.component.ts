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
import { Discrepancias_Pendientes_SalidaService } from 'src/app/api-services/Discrepancias_Pendientes_Salida.service';
import { Discrepancias_Pendientes_Salida } from 'src/app/models/Discrepancias_Pendientes_Salida';
import { ItemsService } from 'src/app/api-services/Items.service';
import { Items } from 'src/app/models/Items';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';

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
  selector: 'app-Discrepancias_Pendientes_Salida',
  templateUrl: './Discrepancias_Pendientes_Salida.component.html',
  styleUrls: ['./Discrepancias_Pendientes_Salida.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Discrepancias_Pendientes_SalidaComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Discrepancias_Pendientes_SalidaForm: FormGroup;
	public Editor = ClassicEditor;
	model: Discrepancias_Pendientes_Salida;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varItems: Items[] = [];
	public varCodigo_Computarizado: Codigo_Computarizado[] = [];
	optionsCodigo_ATA: Observable<Catalogo_codigo_ATA[]>;
	hasOptionsCodigo_ATA: boolean;
	isLoadingCodigo_ATA: boolean;
	optionsAsignado_a: Observable<Spartan_User[]>;
	hasOptionsAsignado_a: boolean;
	isLoadingAsignado_a: boolean;

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
    private Discrepancias_Pendientes_SalidaService: Discrepancias_Pendientes_SalidaService,
    private ItemsService: ItemsService,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,
    private Catalogo_codigo_ATAService: Catalogo_codigo_ATAService,
    private Spartan_UserService: Spartan_UserService,

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
    this.model = new Discrepancias_Pendientes_Salida(this.fb);
    this.Discrepancias_Pendientes_SalidaForm = this.model.buildFormGroup();
	this.Discrepancias_Pendientes_SalidaForm.get('Folio').disable();
    this.Discrepancias_Pendientes_SalidaForm.get('Folio').setValue('Auto');
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
          this.Discrepancias_Pendientes_SalidaForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Discrepancias_Pendientes_Salida)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Discrepancias_Pendientes_SalidaForm, 'Codigo_ATA', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Discrepancias_Pendientes_SalidaForm, 'Asignado_a', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	//this.rulesOnInit();	  
  }
  
  populateModel(id: number) {
    this.spinner.show('loading');
    this.Discrepancias_Pendientes_SalidaService.listaSelAll(0, 1, 'Discrepancias_Pendientes_Salida.Folio=' + id).subscribe(async result => {
      if (result.Discrepancias_Pendientes_Salidas.length > 0) {
        this.model.fromObject(result.Discrepancias_Pendientes_Salidas[0]);
        this.Discrepancias_Pendientes_SalidaForm.get('Codigo_ATA').setValue(
          result.Discrepancias_Pendientes_Salidas[0].Codigo_ATA_Catalogo_codigo_ATA.Codigo_ATA_Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Discrepancias_Pendientes_SalidaForm.get('Asignado_a').setValue(
          result.Discrepancias_Pendientes_Salidas[0].Asignado_a_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );

        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
    });
  }
  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Discrepancias_Pendientes_SalidaForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.ItemsService.getAll());
    observablesArray.push(this.Codigo_ComputarizadoService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varItems , varCodigo_Computarizado ]) => {
          this.varItems = varItems;
          this.varCodigo_Computarizado = varCodigo_Computarizado;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Discrepancias_Pendientes_SalidaForm.get('Codigo_ATA').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCodigo_ATA = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Catalogo_codigo_ATAService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Catalogo_codigo_ATAService.listaSelAll(0, 20, '');
          return this.Catalogo_codigo_ATAService.listaSelAll(0, 20,
            "Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Catalogo_codigo_ATAService.listaSelAll(0, 20,
          "Catalogo_codigo_ATA.Codigo_ATA_Descripcion like '%" + value.Codigo_ATA_Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCodigo_ATA = false;
      this.hasOptionsCodigo_ATA = result?.Catalogo_codigo_ATAs?.length > 0;
      const value = this.Discrepancias_Pendientes_SalidaForm.get('Codigo_ATA').value;
      if (result?.Catalogo_codigo_ATAs?.length === 1 && value.length === result?.Catalogo_codigo_ATAs[0].Codigo_ATA_Descripcion.length)
        this.Discrepancias_Pendientes_SalidaForm.get('Codigo_ATA').setValue(result?.Catalogo_codigo_ATAs[0], { onlySelf: true, emitEvent: false });
      this.optionsCodigo_ATA = of(result?.Catalogo_codigo_ATAs);
    }, error => {
      this.isLoadingCodigo_ATA = false;
      this.hasOptionsCodigo_ATA = false;
      this.optionsCodigo_ATA = of([]);
    });
    this.Discrepancias_Pendientes_SalidaForm.get('Asignado_a').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingAsignado_a = true),
      distinctUntilChanged(),
      switchMap(value => {
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
      this.isLoadingAsignado_a = false;
      this.hasOptionsAsignado_a = result?.Spartan_Users?.length > 0;
      const value = this.Discrepancias_Pendientes_SalidaForm.get('Asignado_a').value;
      if (result?.Spartan_Users?.length === 1 && value.length === result?.Spartan_Users[0].Name.length)
        this.Discrepancias_Pendientes_SalidaForm.get('Asignado_a').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      this.optionsAsignado_a = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingAsignado_a = false;
      this.hasOptionsAsignado_a = false;
      this.optionsAsignado_a = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Item': {
        this.ItemsService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varItems = x.Itemss;
        });
        break;
      }
      case 'Codigo_Computarizado': {
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

displayFnCodigo_ATA(option: Catalogo_codigo_ATA) {
    return option?.Codigo_ATA_Descripcion;
  }
displayFnAsignado_a(option: Spartan_User) {
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
      const entity = this.Discrepancias_Pendientes_SalidaForm.value;
      entity.Folio = this.model.Folio;
      entity.Codigo_ATA = this.Discrepancias_Pendientes_SalidaForm.get('Codigo_ATA').value.Folio;
      entity.Asignado_a = this.Discrepancias_Pendientes_SalidaForm.get('Asignado_a').value.Id_User;
	  	  
	  
	  if (this.model.Folio > 0) {
        await this.Discrepancias_Pendientes_SalidaService.update(this.model.Folio, entity).toPromise();
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Discrepancias_Pendientes_SalidaService.insert(entity).toPromise().then(async id => {
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
    if (this.model.Folio === 0) {
      this.Discrepancias_Pendientes_SalidaForm.reset();
      this.model = new Discrepancias_Pendientes_Salida(this.fb);
      this.Discrepancias_Pendientes_SalidaForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Discrepancias_Pendientes_Salida/add']);
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
    this.router.navigate(['/Discrepancias_Pendientes_Salida/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas
  
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
  
  
  //Fin de reglas
  
}
