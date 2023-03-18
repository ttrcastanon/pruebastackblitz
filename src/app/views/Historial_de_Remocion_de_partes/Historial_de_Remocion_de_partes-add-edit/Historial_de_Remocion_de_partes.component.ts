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
import { Historial_de_Remocion_de_partesService } from 'src/app/api-services/Historial_de_Remocion_de_partes.service';
import { Historial_de_Remocion_de_partes } from 'src/app/models/Historial_de_Remocion_de_partes';
import { Estatus_de_remocionService } from 'src/app/api-services/Estatus_de_remocion.service';
import { Estatus_de_remocion } from 'src/app/models/Estatus_de_remocion';
import { Causa_de_remocionService } from 'src/app/api-services/Causa_de_remocion.service';
import { Causa_de_remocion } from 'src/app/models/Causa_de_remocion';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Tiempo_de_remocionService } from 'src/app/api-services/Tiempo_de_remocion.service';
import { Tiempo_de_remocion } from 'src/app/models/Tiempo_de_remocion';

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
  selector: 'app-Historial_de_Remocion_de_partes',
  templateUrl: './Historial_de_Remocion_de_partes.component.html',
  styleUrls: ['./Historial_de_Remocion_de_partes.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Historial_de_Remocion_de_partesComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Historial_de_Remocion_de_partesForm: FormGroup;
	public Editor = ClassicEditor;
	model: Historial_de_Remocion_de_partes;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varEstatus_de_remocion: Estatus_de_remocion[] = [];
	public varCausa_de_remocion: Causa_de_remocion[] = [];
	optionsUsuario_que_realiza_la_remocion: Observable<Spartan_User[]>;
	hasOptionsUsuario_que_realiza_la_remocion: boolean;
	isLoadingUsuario_que_realiza_la_remocion: boolean;
	public varTiempo_de_remocion: Tiempo_de_remocion[] = [];

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
    private Historial_de_Remocion_de_partesService: Historial_de_Remocion_de_partesService,
    private Estatus_de_remocionService: Estatus_de_remocionService,
    private Causa_de_remocionService: Causa_de_remocionService,
    private Spartan_UserService: Spartan_UserService,
    private Tiempo_de_remocionService: Tiempo_de_remocionService,

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
    this.model = new Historial_de_Remocion_de_partes(this.fb);
    this.Historial_de_Remocion_de_partesForm = this.model.buildFormGroup();
	this.Historial_de_Remocion_de_partesForm.get('Folio').disable();
    this.Historial_de_Remocion_de_partesForm.get('Folio').setValue('Auto');
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
          this.Historial_de_Remocion_de_partesForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Historial_de_Remocion_de_partes)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Historial_de_Remocion_de_partesForm, 'Usuario_que_realiza_la_remocion', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	//this.rulesOnInit();	  
  }
  
  populateModel(id: number) {
    this.spinner.show('loading');
    this.Historial_de_Remocion_de_partesService.listaSelAll(0, 1, 'Historial_de_Remocion_de_partes.Folio=' + id).subscribe(async result => {
      if (result.Historial_de_Remocion_de_partess.length > 0) {
        this.model.fromObject(result.Historial_de_Remocion_de_partess[0]);
        this.Historial_de_Remocion_de_partesForm.get('Usuario_que_realiza_la_remocion').setValue(
          result.Historial_de_Remocion_de_partess[0].Usuario_que_realiza_la_remocion_Spartan_User.Name,
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
          this.operation = !this.Historial_de_Remocion_de_partesForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Estatus_de_remocionService.getAll());
    observablesArray.push(this.Causa_de_remocionService.getAll());
    observablesArray.push(this.Tiempo_de_remocionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varEstatus_de_remocion , varCausa_de_remocion , varTiempo_de_remocion ]) => {
          this.varEstatus_de_remocion = varEstatus_de_remocion;
          this.varCausa_de_remocion = varCausa_de_remocion;
          this.varTiempo_de_remocion = varTiempo_de_remocion;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Historial_de_Remocion_de_partesForm.get('Usuario_que_realiza_la_remocion').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUsuario_que_realiza_la_remocion = true),
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
      this.isLoadingUsuario_que_realiza_la_remocion = false;
      this.hasOptionsUsuario_que_realiza_la_remocion = result?.Spartan_Users?.length > 0;
      const value = this.Historial_de_Remocion_de_partesForm.get('Usuario_que_realiza_la_remocion').value;
      if (result?.Spartan_Users?.length === 1 && value.length === result?.Spartan_Users[0].Name.length)
        this.Historial_de_Remocion_de_partesForm.get('Usuario_que_realiza_la_remocion').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      this.optionsUsuario_que_realiza_la_remocion = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingUsuario_que_realiza_la_remocion = false;
      this.hasOptionsUsuario_que_realiza_la_remocion = false;
      this.optionsUsuario_que_realiza_la_remocion = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Estatus': {
        this.Estatus_de_remocionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_remocion = x.Estatus_de_remocions;
        });
        break;
      }
      case 'Causa_de_remocion': {
        this.Causa_de_remocionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCausa_de_remocion = x.Causa_de_remocions;
        });
        break;
      }
      case 'Tiempo_de_remocion': {
        this.Tiempo_de_remocionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTiempo_de_remocion = x.Tiempo_de_remocions;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

displayFnUsuario_que_realiza_la_remocion(option: Spartan_User) {
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
      const entity = this.Historial_de_Remocion_de_partesForm.value;
      entity.Folio = this.model.Folio;
      entity.Usuario_que_realiza_la_remocion = this.Historial_de_Remocion_de_partesForm.get('Usuario_que_realiza_la_remocion').value.Id_User;
	  	  
	  
	  if (this.model.Folio > 0) {
        await this.Historial_de_Remocion_de_partesService.update(this.model.Folio, entity).toPromise();
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Historial_de_Remocion_de_partesService.insert(entity).toPromise().then(async id => {
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
      this.Historial_de_Remocion_de_partesForm.reset();
      this.model = new Historial_de_Remocion_de_partes(this.fb);
      this.Historial_de_Remocion_de_partesForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Historial_de_Remocion_de_partes/add']);
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
    this.router.navigate(['/Historial_de_Remocion_de_partes/list'], { state: { data: this.dataListConfig } });
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
