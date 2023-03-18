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
import { Carga_ManualService } from 'src/app/api-services/Carga_Manual.service';
import { Carga_Manual } from 'src/app/models/Carga_Manual';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Tipo_de_cargaService } from 'src/app/api-services/Tipo_de_carga.service';
import { Tipo_de_carga } from 'src/app/models/Tipo_de_carga';

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
  selector: 'app-Carga_Manual',
  templateUrl: './Carga_Manual.component.html',
  styleUrls: ['./Carga_Manual.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Carga_ManualComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Carga_ManualForm: FormGroup;
	public Editor = ClassicEditor;
	model: Carga_Manual;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varSpartan_User: Spartan_User[] = [];
	public varTipo_de_carga: Tipo_de_carga[] = [];
	Archivo_a_cargarSelectedFile: File;
	Archivo_a_cargarName = '';
	fileArchivo_a_cargar: SpartanFile;

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
    private Carga_ManualService: Carga_ManualService,
    private Spartan_UserService: Spartan_UserService,
    private Tipo_de_cargaService: Tipo_de_cargaService,

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
    this.model = new Carga_Manual(this.fb);
    this.Carga_ManualForm = this.model.buildFormGroup();
	
	this.Carga_ManualForm.get('Folio').disable();
    this.Carga_ManualForm.get('Folio').setValue('Auto');
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
		
          this.Carga_ManualForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Carga_Manual)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Carga_ManualService.listaSelAll(0, 1, 'Carga_Manual.Folio=' + id).toPromise();
	if (result.Carga_Manuals.length > 0) {
	  
        this.model.fromObject(result.Carga_Manuals[0]);
        if (this.model.Archivo_a_cargar !== null && this.model.Archivo_a_cargar !== undefined) {
          this.spartanFileService.getById(this.model.Archivo_a_cargar).subscribe(f => {
            this.fileArchivo_a_cargar = f;
            this.Archivo_a_cargarName = f.Description;
          });
        }

		this.Carga_ManualForm.markAllAsTouched();
		this.Carga_ManualForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Carga_ManualForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_de_cargaService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varSpartan_User , varTipo_de_carga ]) => {
          this.varSpartan_User = varSpartan_User;
          this.varTipo_de_carga = varTipo_de_carga;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Usuario': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Tipo_de_carga': {
        this.Tipo_de_cargaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_carga = x.Tipo_de_cargas;
        });
        break;
      }

      default: {
        break;
      }
    }
  }


  async saveArchivo_a_cargar(): Promise<number> {
    if (this.Carga_ManualForm.controls.Archivo_a_cargarFile.valid
      && this.Carga_ManualForm.controls.Archivo_a_cargarFile.dirty) {
      const Archivo_a_cargar = this.Carga_ManualForm.controls.Archivo_a_cargarFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Archivo_a_cargar);
      const spartanFile = {
        File: byteArray,
        Description: Archivo_a_cargar.name,
        Date_Time: Archivo_a_cargar.lastModifiedDate,
        File_Size: Archivo_a_cargar.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Archivo_a_cargar > 0 ? this.model.Archivo_a_cargar : 0;
    }
  }
  
  Archivo_a_cargarUrl() {
    if (this.fileArchivo_a_cargar)
      return this.spartanFileService.url(this.fileArchivo_a_cargar.File_Id.toString(), this.fileArchivo_a_cargar.Description);
    return '#';
  }  
  
  getArchivo_a_cargar() {
    this.helperService.dowloadFile(this.fileArchivo_a_cargar.base64, this.Archivo_a_cargarName);
  }
  
  removeArchivo_a_cargar() {
    this.Archivo_a_cargarName = '';
    this.model.Archivo_a_cargar = 0;
  }

  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Carga_ManualForm.value;
      entity.Folio = this.model.Folio;
	  	  
      const FolioArchivo_a_cargar = await this.saveArchivo_a_cargar();
      entity.Archivo_a_cargar = FolioArchivo_a_cargar > 0 ? FolioArchivo_a_cargar : null;	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Carga_ManualService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Carga_ManualService.insert(entity).toPromise().then(async id => {

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
      this.Carga_ManualForm.reset();
      this.model = new Carga_Manual(this.fb);
      this.Carga_ManualForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Carga_Manual/add']);
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
    this.router.navigate(['/Carga_Manual/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Fecha_de_carga_ExecuteBusinessRules(): void {
        //Fecha_de_carga_FieldExecuteBusinessRulesEnd
    }
    Hora_de_carga_ExecuteBusinessRules(): void {
        //Hora_de_carga_FieldExecuteBusinessRulesEnd
    }
    Usuario_ExecuteBusinessRules(): void {
        //Usuario_FieldExecuteBusinessRulesEnd
    }
    Tipo_de_carga_ExecuteBusinessRules(): void {
        //Tipo_de_carga_FieldExecuteBusinessRulesEnd
    }
    Archivo_a_cargar_ExecuteBusinessRules(): void {
        //Archivo_a_cargar_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:6294 - Asignar fecha - Autor: Roberto Rodríguez - Actualización: 9/15/2021 3:48:50 PM
if(  this.operation == 'New' ) {
this.brf.SetValueFromQuery(this.Carga_ManualForm,"Fecha_de_carga",this.brf.EvaluaQuery(" select convert(varchar,getdate(),105)", 1, "ABC123"),1,"ABC123"); this.brf.SetEnabledControl(this.Carga_ManualForm, 'Fecha_de_carga', 0);
} 
//TERMINA - BRID:6294


//INICIA - BRID:6295 - asignar hora - Autor: Roberto Rodríguez - Actualización: 9/15/2021 3:48:56 PM
if(  this.operation == 'New' ) {
this.brf.SetValueFromQuery(this.Carga_ManualForm,"Hora_de_carga",this.brf.EvaluaQuery(" @LC@@LB@ select convert(varchar,getdate(),108)@LC@@LB@ ", 1, "ABC123"),1,"ABC123"); this.brf.SetEnabledControl(this.Carga_ManualForm, 'Hora_de_carga', 0);
} 
//TERMINA - BRID:6295


//INICIA - BRID:6296 - Asignar usuario - Autor: Roberto Rodríguez - Actualización: 9/15/2021 3:39:43 PM
if(  this.operation == 'New' ) {
this.brf.SetEnabledControl(this.Carga_ManualForm, 'Usuario', 0); this.brf.SetValueFromQuery(this.Carga_ManualForm,"Usuario",this.brf.EvaluaQuery("GLOBAL[USERID]", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:6296


//INICIA - BRID:6297 - OCULTAR FOLIO CARGA MANUAL - Autor: Roberto Rodríguez - Actualización: 9/15/2021 3:49:43 PM
if(  this.operation == 'New' ) {
this.brf.HideFieldOfForm(this.Carga_ManualForm, "Folio"); this.brf.SetNotRequiredControl(this.Carga_ManualForm, "Folio");
} 
//TERMINA - BRID:6297

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
