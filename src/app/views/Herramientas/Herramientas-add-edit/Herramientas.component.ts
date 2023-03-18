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
import { HerramientasService } from 'src/app/api-services/Herramientas.service';
import { Herramientas } from 'src/app/models/Herramientas';
import { Categoria_de_PartesService } from 'src/app/api-services/Categoria_de_Partes.service';
import { Categoria_de_Partes } from 'src/app/models/Categoria_de_Partes';
import { Catalago_Manual_de_UsuarioService } from 'src/app/api-services/Catalago_Manual_de_Usuario.service';
import { Catalago_Manual_de_Usuario } from 'src/app/models/Catalago_Manual_de_Usuario';

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
  selector: 'app-Herramientas',
  templateUrl: './Herramientas.component.html',
  styleUrls: ['./Herramientas.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class HerramientasComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	HerramientasForm: FormGroup;
	public Editor = ClassicEditor;
	model: Herramientas;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varCategoria_de_Partes: Categoria_de_Partes[] = [];
	public varCatalago_Manual_de_Usuario: Catalago_Manual_de_Usuario[] = [];

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
    private HerramientasService: HerramientasService,
    private Categoria_de_PartesService: Categoria_de_PartesService,
    private Catalago_Manual_de_UsuarioService: Catalago_Manual_de_UsuarioService,

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
    this.model = new Herramientas(this.fb);
    this.HerramientasForm = this.model.buildFormGroup();
	
	this.HerramientasForm.get('Folio').disable();
    this.HerramientasForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
		
          this.HerramientasForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Herramientas)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.HerramientasService.listaSelAll(0, 1, 'Herramientas.Folio=' + id).toPromise();
	if (result.Herramientass.length > 0) {
	  
        this.model.fromObject(result.Herramientass[0]);

		this.HerramientasForm.markAllAsTouched();
		this.HerramientasForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.HerramientasForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Categoria_de_PartesService.getAll());
    observablesArray.push(this.Catalago_Manual_de_UsuarioService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varCategoria_de_Partes , varCatalago_Manual_de_Usuario ]) => {
          this.varCategoria_de_Partes = varCategoria_de_Partes;
          this.varCatalago_Manual_de_Usuario = varCatalago_Manual_de_Usuario;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Categoria': {
        this.Categoria_de_PartesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCategoria_de_Partes = x.Categoria_de_Partess;
        });
        break;
      }
      case 'Manual_del_Usuario': {
        this.Catalago_Manual_de_UsuarioService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCatalago_Manual_de_Usuario = x.Catalago_Manual_de_Usuarios;
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
      const entity = this.HerramientasForm.value;
      entity.Folio = this.model.Folio;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.HerramientasService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.HerramientasService.insert(entity).toPromise().then(async id => {

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
      this.HerramientasForm.reset();
      this.model = new Herramientas(this.fb);
      this.HerramientasForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Herramientas/add']);
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
    this.router.navigate(['/Herramientas/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Codigo_ExecuteBusinessRules(): void {
       this.HerramientasForm.get('Codigo_Descripcion').setValue(`${this.HerramientasForm.get('Codigo').value} - ${this.HerramientasForm.get('Descripcion').value}`);
    }
    Categoria_ExecuteBusinessRules(): void {
        //Categoria_FieldExecuteBusinessRulesEnd
    }
    Descripcion_ExecuteBusinessRules(): void {
        //Descripcion_FieldExecuteBusinessRulesEnd
        this.HerramientasForm.get('Codigo_Descripcion').setValue(`${this.HerramientasForm.get('Codigo').value} - ${this.HerramientasForm.get('Descripcion').value}`);
    }
    Codigo_Descripcion_ExecuteBusinessRules(): void {
        //Codigo_Descripcion_FieldExecuteBusinessRulesEnd
    }
    No_de_Serie_ExecuteBusinessRules(): void {
        //No_de_Serie_FieldExecuteBusinessRulesEnd
    }
    Codigo_de_calibracion_ExecuteBusinessRules(): void {
        //Codigo_de_calibracion_FieldExecuteBusinessRulesEnd
    }
    Manual_del_Usuario_ExecuteBusinessRules(): void {
        //Manual_del_Usuario_FieldExecuteBusinessRulesEnd
    }
    Alcance_ExecuteBusinessRules(): void {
        //Alcance_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:3934 - acomodo de campos herramientas - Autor: Agustín Administrador - Actualización: 8/3/2021 5:13:44 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:3934


//INICIA - BRID:3945 - Ocultar folio herramientas - Autor: Administrador - Actualización: 6/17/2021 2:51:28 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.HerramientasForm, "Folio"); this.brf.SetNotRequiredControl(this.HerramientasForm, "Folio");
} 
//TERMINA - BRID:3945


//INICIA - BRID:3946 - Ocultar y quitar requerido codigo/descripcion herramientas - Autor: Administrador - Actualización: 6/17/2021 3:00:21 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.SetNotRequiredControl(this.HerramientasForm, "Codigo_Descripcion"); this.brf.HideFieldOfForm(this.HerramientasForm, "Codigo_Descripcion"); this.brf.SetNotRequiredControl(this.HerramientasForm, "Codigo_Descripcion");
} 
//TERMINA - BRID:3946


//INICIA - BRID:4945 - Filtrar campo categoría  - Autor: Lizeth Villa - Actualización: 8/10/2021 7:04:27 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {

} 
//TERMINA - BRID:4945

//rulesOnInit_ExecuteBusinessRulesEnd




  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit
//rulesAfterSave_ExecuteBusinessRulesEnd
  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:3947 - Concatenar Codigo y Descripcion herramientas - Autor: Administrador - Actualización: 6/17/2021 3:02:18 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetValueFromQuery(this.HerramientasForm,"Codigo_Descripcion",this.brf.EvaluaQuery("SELECT ('FLD[Codigo]'+ ' - ' + 'FLD[Descripcion]')", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:3947

//rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas
  
}
