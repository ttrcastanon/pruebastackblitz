import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, Inject } from '@angular/core';
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
import { Reabrir_vueloService } from 'src/app/api-services/Reabrir_vuelo.service';
import { Reabrir_vuelo } from 'src/app/models/Reabrir_vuelo';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';

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
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-Reabrir_vuelo',
  templateUrl: './modal-Reabrir_vuelo.component.html',
  styleUrls: ['./modal-Reabrir_vuelo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ModalReabrir_vueloComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Reabrir_vueloForm: FormGroup;
	public Editor = ClassicEditor;
	model: Reabrir_vuelo;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsUsuario_que_Registra: Observable<Spartan_User[]>;
	hasOptionsUsuario_que_Registra: boolean;
	isLoadingUsuario_que_Registra: boolean;
	optionsNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
	hasOptionsNumero_de_Vuelo: boolean;
	isLoadingNumero_de_Vuelo: boolean;

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

  spartan_users: Spartan_User[];

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Reabrir_vueloService: Reabrir_vueloService,
    private Spartan_UserService: Spartan_UserService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,

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
    public dialogRef: MatDialogRef<ModalReabrir_vueloComponent>,
    renderer: Renderer2,
    @Inject(MAT_DIALOG_DATA) public dataReabrirVuelo: any) {
	this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Reabrir_vuelo(this.fb);
    this.Reabrir_vueloForm = this.model.buildFormGroup();
	
	this.Reabrir_vueloForm.get('Folio').disable();
    this.Reabrir_vueloForm.get('Folio').setValue('Auto');
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
		
          this.Reabrir_vueloForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Reabrir_vuelo)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Reabrir_vueloForm, 'Usuario_que_Registra', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Reabrir_vueloForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Reabrir_vueloService.listaSelAll(0, 1, 'Reabrir_vuelo.Folio=' + id).toPromise();
	if (result.Reabrir_vuelos.length > 0) {
	  
        this.model.fromObject(result.Reabrir_vuelos[0]);
        this.Reabrir_vueloForm.get('Usuario_que_Registra').setValue(
          result.Reabrir_vuelos[0].Usuario_que_Registra_Spartan_User.Name,
          { onlySelf: false, emitEvent: true }
        );
        this.Reabrir_vueloForm.get('Numero_de_Vuelo').setValue(
          result.Reabrir_vuelos[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
          { onlySelf: false, emitEvent: true }
        );

		this.Reabrir_vueloForm.markAllAsTouched();
		this.Reabrir_vueloForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.operation = this.dataReabrirVuelo.operation;

    if (this.operation == "Update" || this.operation == "Consult") {
      this.model.Folio = this.dataReabrirVuelo?.Id
      this.populateModel(this.model.Folio);
      
      this.Reabrir_vueloForm.disable();
      this.consult = true;
    } 
    else{
      this.operation = "New";
    }

    this.rulesOnInit();
  }
  
  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  
  closeWindowCancel():void{
    window.close();
  }
  closeWindowSave():void{
    setTimeout(()=>{ window.close();}, 2000);
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

    this.Reabrir_vueloForm.get('Usuario_que_Registra').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUsuario_que_Registra = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Spartan_UserService.listaSelAll(0, 3000, '');
        if (typeof value === 'string') {
          if (value === '') return this.Spartan_UserService.listaSelAll(0, 3000, '');
          return this.Spartan_UserService.listaSelAll(0, 3000,
            "Spartan_User.Name like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Spartan_UserService.listaSelAll(0, 3000,
          "Spartan_User.Name like '%" + value.Name.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.spartan_users = result?.Spartan_Users;
      this.isLoadingUsuario_que_Registra = false;
      this.hasOptionsUsuario_que_Registra = result?.Spartan_Users?.length > 0;
	  this.Reabrir_vueloForm.get('Usuario_que_Registra').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
	  this.optionsUsuario_que_Registra = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingUsuario_que_Registra = false;
      this.hasOptionsUsuario_que_Registra = false;
      this.optionsUsuario_que_Registra = of([]);
    });
    this.Reabrir_vueloForm.get('Numero_de_Vuelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNumero_de_Vuelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
          return this.Solicitud_de_VueloService.listaSelAll(0, 20,
            "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Solicitud_de_VueloService.listaSelAll(0, 20,
          "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.Numero_de_Vuelo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = result?.Solicitud_de_Vuelos?.length > 0;
	  this.Reabrir_vueloForm.get('Numero_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
	  this.optionsNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = false;
      this.optionsNumero_de_Vuelo = of([]);
    });
  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

displayFnUsuario_que_Registra(option: Spartan_User) {
    return option?.Name;
  }
displayFnNumero_de_Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }


  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Reabrir_vueloForm.value;
      entity.Folio = this.model.Folio;
      entity.Fecha_de_Registro = this.Reabrir_vueloForm.get('Fecha_de_Registro').value;
      entity.Hora_de_Registro = this.Reabrir_vueloForm.get('Hora_de_Registro').value
      entity.Usuario_que_Registra = this.Reabrir_vueloForm.get('Usuario_que_Registra').value.Id_User;
      entity.Numero_de_Vuelo = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Reabrir_vueloService.update(this.model.Folio, entity).toPromise();

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        await this.rulesAfterSave();
      } else {
        await (this.Reabrir_vueloService.insert(entity).toPromise().then(async id => {
          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          await this.rulesAfterSave();
        }));
      }
    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0 ) {
      this.Reabrir_vueloForm.reset();
      this.model = new Reabrir_vuelo(this.fb);
      this.Reabrir_vueloForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Reabrir_vuelo/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

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
    Numero_de_Vuelo_ExecuteBusinessRules(): void {
        //Numero_de_Vuelo_FieldExecuteBusinessRulesEnd
    }
    Motivo_de_reapertura_ExecuteBusinessRules(): void {
        //Motivo_de_reapertura_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:5668 - Deshabilitar campos y ocultar folio siempre - Autor: Lizeth Villa - Actualización: 9/2/2021 6:45:13 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.SetEnabledControl(this.Reabrir_vueloForm, 'Folio', 0);
  this.brf.SetEnabledControl(this.Reabrir_vueloForm, 'Fecha_de_Registro', 0);
  this.brf.SetEnabledControl(this.Reabrir_vueloForm, 'Hora_de_Registro', 0);
  this.brf.SetEnabledControl(this.Reabrir_vueloForm, 'Usuario_que_Registra', 0);
  this.brf.SetEnabledControl(this.Reabrir_vueloForm, 'Numero_de_Vuelo', 0); 
  this.brf.HideFieldOfForm(this.Reabrir_vueloForm, "Folio"); 
  this.brf.SetNotRequiredControl(this.Reabrir_vueloForm, "Folio");
} 
//TERMINA - BRID:5668

//INICIA - BRID:5670 - Asignar numero de vuelo con ajuste manual (no desactivar) - Autor: Lizeth Villa - Actualización: 9/2/2021 7:02:41 PM
if(  this.operation == 'New' ) {

  let NumberFligth = {
    Folio: this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId'),
    Numero_de_Vuelo: this.localStorageHelper.getItemFromLocalStorage('NoVuelo')
  };

  console.log('reabrir vuelo: ', NumberFligth)

  this.Reabrir_vueloForm.get("Numero_de_Vuelo").setValue(NumberFligth, { onlySelf: true, emitEvent: false }); 

  //this._SpartanService.SetValueExecuteQuery(this.Reabrir_vueloForm,"Numero_de_Vuelo","select Folio, Numero_de_Vuelo from solicitud_de_vuelo where folio = "+ this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+"", 1, "ABC123");
} 
//TERMINA - BRID:5670

//INICIA - BRID:5625 - Asignar usuario, fecha y hora al abrir pantalla y deshabilitar campos en nuevo  - Autor: Lizeth Villa - Actualización: 9/2/2021 6:40:12 PM
if(  this.operation == 'New' ) {

  this.brf.SetCurrentDateToField(this.Reabrir_vueloForm, 'Fecha_de_Registro');
  this.brf.SetCurrentHourToField(this.Reabrir_vueloForm, 'Hora_de_Registro');
  setTimeout(() => { 

    let nameuser;
    this.spartan_users.forEach(element => {
      if(element.Id_User == this.localStorageHelper.getLoggedUserInfo().UserId){
        nameuser = element.Name;
      }
    });

    let userregistro = {
      Id_User: this.localStorageHelper.getLoggedUserInfo().UserId,
      Name: nameuser
    };
    console.log(userregistro);
    this.Reabrir_vueloForm.get("Usuario_que_Registra").setValue(userregistro, { onlySelf: true, emitEvent: false }); 
}, 400);

  //this.brf.SetValueFromQuery(this.Reabrir_vueloForm,"Fecha_de_Registro",this.brf.EvaluaQuery("select convert (varchar(11),getdate(),105)", 1, "ABC123"),1,"ABC123"); 
  //this.brf.SetValueFromQuery(this.Reabrir_vueloForm,"Hora_de_Registro",this.brf.EvaluaQuery("select convert (varchar(8),getdate(),108)", 1, "ABC123"),1,"ABC123"); 
  //this.brf.SetValueFromQuery(this.Reabrir_vueloForm,"Usuario_que_Registra",this.brf.EvaluaQuery("select id_user, name from Spartan_User where Id_User = GLOBAL[USERID]", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:5625

//rulesOnInit_ExecuteBusinessRulesEnd



  }
  
  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:5669 - Actualizar campo Vuelo reabierto y regresar estatus a Autorizado en solicitud de vuelo - Autor: Lizeth Villa - Actualización: 9/2/2021 7:33:48 PM
    if(  this.operation == 'New' ) {
      await this.brf.EvaluaQueryAsync("UPDATE solicitud_de_vuelo SET Vuelo_Reabierto = 1 where folio = "+ this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+"", 1, "ABC123"); 
      await this.brf.EvaluaQueryAsync("UPDATE solicitud_de_vuelo SET Estatus = 6 where folio = "+ this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" ", 1, "ABC123");
      await this.brf.EvaluaQueryAsync("UPDATE facturacion_de_vuelo SET Estatus = 3 where vuelo = "+ this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" ", 1, "ABC123");
    } 
    //TERMINA - BRID:5669


    //INICIA - BRID:5763 - En nuevo, despues de guardar, mandar folio de solicitu de vuelo SP uspGeneraReaperturaVuelo, Reabrir vuelo - Autor: Lizeth Villa - Actualización: 9/7/2021 5:24:25 PM
    if(  this.operation == 'New' ) {
      await this.brf.EvaluaQueryAsync(" exec uspGeneraReaperturaVuelo "+ this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+"", 1, "ABC123"); 
      await this.brf.EvaluaQueryAsync(" EXEC Cancela_Prefacturas_Reapertura_Vuelo "+ this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+"", 1, "ABC123");
    } 
    //TERMINA - BRID:5763

    setTimeout(() => {
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
      this.isLoading = false;
      this.spinner.hide('loading');

      this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearchReabrirVuelo", "1");
  
      this.fnCloseModal(1)
    }, 3000);

    //rulesAfterSave_ExecuteBusinessRulesEnd

  }
  
  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //#region Cerrar Modal
  fnCloseModal(result: number) {
    //1 Inserta
    if (result == 1) {
      this.dialogRef.close(result);
    }
    //Indefinido solo cierra
    else {
      this.dialogRef.close();
    }
  }
  //#endregion


  //Fin de reglas
  
}
