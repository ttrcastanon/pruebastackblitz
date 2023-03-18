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
import { Detalle_Cursos_PasajerosService } from 'src/app/api-services/Detalle_Cursos_Pasajeros.service';
import { Detalle_Cursos_Pasajeros } from 'src/app/models/Detalle_Cursos_Pasajeros';

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
  selector: 'app-Detalle_Cursos_Pasajeros',
  templateUrl: './Detalle_Cursos_Pasajeros.component.html',
  styleUrls: ['./Detalle_Cursos_Pasajeros.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Detalle_Cursos_PasajerosComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Detalle_Cursos_PasajerosForm: FormGroup;
	public Editor = ClassicEditor;
	model: Detalle_Cursos_Pasajeros;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	Cargar_documentoSelectedFile: File;
	Cargar_documentoName = '';
	fileCargar_documento: SpartanFile;

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
    private Detalle_Cursos_PasajerosService: Detalle_Cursos_PasajerosService,

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
    this.model = new Detalle_Cursos_Pasajeros(this.fb);
    this.Detalle_Cursos_PasajerosForm = this.model.buildFormGroup();
	
	this.Detalle_Cursos_PasajerosForm.get('Folio').disable();
    this.Detalle_Cursos_PasajerosForm.get('Folio').setValue('Auto');
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
		
          this.Detalle_Cursos_PasajerosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Detalle_Cursos_Pasajeros)
      .subscribe((response) => {
        this.permisos = response;
      });

	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Detalle_Cursos_PasajerosService.listaSelAll(0, 1, 'Detalle_Cursos_Pasajeros.Folio=' + id).toPromise();
	if (result.Detalle_Cursos_Pasajeross.length > 0) {
	  
        this.model.fromObject(result.Detalle_Cursos_Pasajeross[0]);
        if (this.model.Cargar_documento !== null && this.model.Cargar_documento !== undefined) {
          this.spartanFileService.getById(this.model.Cargar_documento).subscribe(f => {
            this.fileCargar_documento = f;
            this.Cargar_documentoName = f.Description;
          });
        }

		this.Detalle_Cursos_PasajerosForm.markAllAsTouched();
		this.Detalle_Cursos_PasajerosForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Detalle_Cursos_PasajerosForm.disabled ? "Update" : this.operation;
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



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }


  async saveCargar_documento(): Promise<number> {
    if (this.Detalle_Cursos_PasajerosForm.controls.Cargar_documentoFile.valid
      && this.Detalle_Cursos_PasajerosForm.controls.Cargar_documentoFile.dirty) {
      const Cargar_documento = this.Detalle_Cursos_PasajerosForm.controls.Cargar_documentoFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_documento);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_documento.name,
        Date_Time: Cargar_documento.lastModifiedDate,
        File_Size: Cargar_documento.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_documento > 0 ? this.model.Cargar_documento : 0;
    }
  }
  
  Cargar_documentoUrl() {
    if (this.fileCargar_documento)
      return this.spartanFileService.url(this.fileCargar_documento.File_Id.toString(), this.fileCargar_documento.Description);
    return '#';
  }  
  
  getCargar_documento() {
    this.helperService.dowloadFile(this.fileCargar_documento.base64, this.Cargar_documentoName);
  }
  
  removeCargar_documento() {
    this.Cargar_documentoName = '';
    this.model.Cargar_documento = 0;
  }

  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Detalle_Cursos_PasajerosForm.value;
      entity.Folio = this.model.Folio;
	  	  
      const FolioCargar_documento = await this.saveCargar_documento();
      entity.Cargar_documento = FolioCargar_documento > 0 ? FolioCargar_documento : null;	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Detalle_Cursos_PasajerosService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Detalle_Cursos_PasajerosService.insert(entity).toPromise().then(async id => {

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
      this.Detalle_Cursos_PasajerosForm.reset();
      this.model = new Detalle_Cursos_Pasajeros(this.fb);
      this.Detalle_Cursos_PasajerosForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Detalle_Cursos_Pasajeros/add']);
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
    this.router.navigate(['/Detalle_Cursos_Pasajeros/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      Curso_ExecuteBusinessRules(): void {
        //Curso_FieldExecuteBusinessRulesEnd
    }
    Descripcion_del_Curso_ExecuteBusinessRules(): void {
        //Descripcion_del_Curso_FieldExecuteBusinessRulesEnd
    }
    Fecha_del_Curso_ExecuteBusinessRules(): void {
        //Fecha_del_Curso_FieldExecuteBusinessRulesEnd
    }
    Vencimiento_ExecuteBusinessRules(): void {
        //Vencimiento_FieldExecuteBusinessRulesEnd
    }
    Fecha_de_Vencimiento_ExecuteBusinessRules(): void {
        //Fecha_de_Vencimiento_FieldExecuteBusinessRulesEnd
    }
    Cargar_documento_ExecuteBusinessRules(): void {
        //Cargar_documento_FieldExecuteBusinessRulesEnd
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
