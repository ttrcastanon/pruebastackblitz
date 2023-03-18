import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
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
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { Estatus_de_ClienteService } from 'src/app/api-services/Estatus_de_Cliente.service';
import { Estatus_de_Cliente } from 'src/app/models/Estatus_de_Cliente';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { Tipo_de_ClienteService } from 'src/app/api-services/Tipo_de_Cliente.service';
import { Tipo_de_Cliente } from 'src/app/models/Tipo_de_Cliente';

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
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { AppDateAdapter, APP_DATE_FORMATS } from '../../../helpers/AppDateAdapter';
import { getDutchPaginatorIntl } from '../../../shared/base-views/dutch-paginator-intl';

@Component({
  selector: 'app-Cliente',
  templateUrl: './Cliente.component.html',
  styleUrls: ['./Cliente.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl()}

  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ClienteComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	ClienteForm: FormGroup;
	public Editor = ClassicEditor;
	model: Cliente;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	public varEstatus_de_Cliente: Estatus_de_Cliente[] = [];
	public varRespuesta: Respuesta[] = [];
	public varTipo_de_Cliente: Tipo_de_Cliente[] = [];
	ContratoSelectedFile: File;
	ContratoName = '';
	fileContrato: SpartanFile;

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
  emailEnpty: boolean;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private ClienteService: ClienteService,
    private Estatus_de_ClienteService: Estatus_de_ClienteService,
    private RespuestaService: RespuestaService,
    private Tipo_de_ClienteService: Tipo_de_ClienteService,

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
    this.model = new Cliente(this.fb);
    this.ClienteForm = this.model.buildFormGroup();
	
	this.ClienteForm.get('Clave').disable();
    this.ClienteForm.get('Clave').setValue('Auto');
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
		
          this.ClienteForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Cliente)
      .subscribe((response) => {
        this.permisos = response;
      });

      this.brf.updateValidatorsToControl(this.ClienteForm, 'Correo_Electronico',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);

	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.ClienteService.listaSelAll(0, 1, 'Cliente.Clave=' + id).toPromise();
	if (result.Clientes.length > 0) {
	  
        this.model.fromObject(result.Clientes[0]);
        if (this.model.Contrato !== null && this.model.Contrato !== undefined) {
          this.spartanFileService.getById(this.model.Contrato).subscribe(f => {
            this.fileContrato = f;
            this.ContratoName = f.Description;
          });
        }

		this.ClienteForm.markAllAsTouched();
		this.ClienteForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Clave = +params.get('id');

        if (this.model.Clave) {
          this.operation = !this.ClienteForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Clave);
        } else {
          this.operation = "New";
        }
        this.rulesOnInit();
      });
  }

  validateEmail() {
    if(this.ClienteForm.get('Correo_Electronico').invalid){
      let email = this.ClienteForm.get('Correo_Electronico').value;
      this.emailEnpty = email.length > 0;
      this.ClienteForm.get('Correo_Electronico').setValue("");
    }
  }
  
  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Estatus_de_ClienteService.getAll());
    observablesArray.push(this.RespuestaService.getAll());
    observablesArray.push(this.Tipo_de_ClienteService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varEstatus_de_Cliente , varRespuesta , varTipo_de_Cliente ]) => {
          this.varEstatus_de_Cliente = varEstatus_de_Cliente;
          this.varRespuesta = varRespuesta;
          this.varTipo_de_Cliente = varTipo_de_Cliente;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Estatus': {
        this.Estatus_de_ClienteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Cliente = x.Estatus_de_Clientes;
        });
        break;
      }
      case 'Pertenece_a_grupo_BAL': {
        this.RespuestaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRespuesta = x.Respuestas;
        });
        break;
      }
      case 'Tipo_de_Cliente': {
        this.Tipo_de_ClienteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Cliente = x.Tipo_de_Clientes;
        });
        break;
      }

      default: {
        break;
      }
    }
  }


  async saveContrato(): Promise<number> {
    if (this.ClienteForm.controls.ContratoFile.valid
      && this.ClienteForm.controls.ContratoFile.dirty) {
      const Contrato = this.ClienteForm.controls.ContratoFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Contrato);
      const spartanFile = {
        File: byteArray,
        Description: Contrato.name,
        Date_Time: Contrato.lastModifiedDate,
        File_Size: Contrato.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Contrato > 0 ? this.model.Contrato : 0;
    }
  }
  
  ContratoUrl() {
    if (this.fileContrato)
      return this.spartanFileService.url(this.fileContrato.File_Id.toString(), this.fileContrato.Description);
    return '#';
  }  
  
  getContrato() {
    this.helperService.dowloadFile(this.fileContrato.base64, this.ContratoName);
  }
  
  removeContrato() {
    this.ContratoName = '';
    this.model.Contrato = 0;
  }

  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.ClienteForm.value;
      entity.Clave = this.model.Clave;
	  	  
      const FolioContrato = await this.saveContrato();
      entity.Contrato = FolioContrato > 0 ? FolioContrato : null;	  
	  
	  if (this.model.Clave > 0 ) {
        await this.ClienteService.update(this.model.Clave, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Clave.toString());
        this.spinner.hide('loading');
        return this.model.Clave;
      } else {
        await (this.ClienteService.insert(entity).toPromise().then(async id => {

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
    if (this.model.Clave === 0 ) {
      this.ClienteForm.reset();
      this.model = new Cliente(this.fb);
      this.ClienteForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Cliente/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Clave = 0;

  }
  
  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Cliente/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  soloFecha(e) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
    const keyPressed = e.key;

    if (!allowedKeys.includes(keyPressed)) {
      e.preventDefault();
      return;
    }
    if (e.target.value.length >10) {
      e.preventDefault();
      return;
    }
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      ID_Dynamics_ExecuteBusinessRules(): void {
        //ID_Dynamics_FieldExecuteBusinessRulesEnd
    }
    RFC_ExecuteBusinessRules(): void {
        //RFC_FieldExecuteBusinessRulesEnd
    }
    Razon_Social_ExecuteBusinessRules(): void {
        //Razon_Social_FieldExecuteBusinessRulesEnd
    }
    Nombre_Corto_ExecuteBusinessRules(): void {
        //Nombre_Corto_FieldExecuteBusinessRulesEnd
    }
    Contacto_ExecuteBusinessRules(): void {
        //Contacto_FieldExecuteBusinessRulesEnd
    }
    Direccion_Fiscal_ExecuteBusinessRules(): void {
        //Direccion_Fiscal_FieldExecuteBusinessRulesEnd
    }
    Direccion_Postal_ExecuteBusinessRules(): void {
        //Direccion_Postal_FieldExecuteBusinessRulesEnd
    }
    Correo_Electronico_ExecuteBusinessRules(): void {
        //Correo_Electronico_FieldExecuteBusinessRulesEnd
    }
    Telefono_de_Contacto_ExecuteBusinessRules(): void {
        //Telefono_de_Contacto_FieldExecuteBusinessRulesEnd
    }
    Telefono_de_Contacto_2_ExecuteBusinessRules(): void {
        //Telefono_de_Contacto_2_FieldExecuteBusinessRulesEnd
    }
    Celular_de_Contacto_ExecuteBusinessRules(): void {
        //Celular_de_Contacto_FieldExecuteBusinessRulesEnd
    }
    Fax_ExecuteBusinessRules(): void {
        //Fax_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
    }
    Pertenece_a_grupo_BAL_ExecuteBusinessRules(): void {
        //Pertenece_a_grupo_BAL_FieldExecuteBusinessRulesEnd
    }
    Tipo_de_Cliente_ExecuteBusinessRules(): void {
        //Tipo_de_Cliente_FieldExecuteBusinessRulesEnd
    }
  Vigencia_de_Contrato_ExecuteBusinessRules(): void {
console.log(this.ClienteForm)
    //INICIA - BRID:6132 - Validar fecha de vigencia de contrato - Autor: ANgel Acuña - Actualización: 9/10/2021 1:42:20 PM
    //if( this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),GETDATE(),103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Vigencia_de_Contrato]',103),103))", 1, 'ABC123')<this.brf.TryParseInt('0', '0') && this.brf.GetValueByControlType(this.ClienteForm, 'Vigencia_de_Contrato')!=this.brf.TryParseInt('null', 'null') ) { this.brf.SetValueFromQuery(this.ClienteForm,"Vigencia_de_Contrato",this.brf.EvaluaQuery(" select ''", 1, "ABC123"),1,"ABC123"); this.brf.ShowMessage(" No se puede seleccionar una fecha menor al dia de hoy");} else {}
    //TERMINA - BRID:6132
    if (!this.ClienteForm.controls['Vigencia_de_Contrato'].value) return;
    let fecha = this.ClienteForm.controls['Vigencia_de_Contrato'].value//.toLocaleDateString();
    if (fecha.toISOString().includes('+')) {
      this.ClienteForm.controls['Vigencia_de_Contrato'].setValue('');
    }

      //Vigencia_de_Contrato_FieldExecuteBusinessRulesEnd

    }
    Cuota_de_mantenimiento_ExecuteBusinessRules(): void {
        //Cuota_de_mantenimiento_FieldExecuteBusinessRulesEnd
    }
    Costo_de_Hora_Rampa_ExecuteBusinessRules(): void {
        //Costo_de_Hora_Rampa_FieldExecuteBusinessRulesEnd
    }
    Costos_Hora_Tecnico_ExecuteBusinessRules(): void {
        //Costos_Hora_Tecnico_FieldExecuteBusinessRulesEnd
    }
    Contrato_ExecuteBusinessRules(): void {
        //Contrato_FieldExecuteBusinessRulesEnd
    }
    Part_en_div_por_tramo_ExecuteBusinessRules(): void {
        //Part_en_div_por_tramo_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:2070 - campos no requerido catalogo clientes. - Autor: Administrador - Actualización: 3/29/2021 4:01:58 PM
// if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
//   this.brf.SetNotRequiredControl(this.ClienteForm, "Direccion_Fiscal");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "Direccion_Postal");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "Vigencia_de_Contrato");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "Cuota_de_mantenimiento");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "Telefono_de_Contacto_2");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "Celular_de_Contacto");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "Fax");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "Costo_de_Hora_Rampa");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "Costos_Hora_Tecnico");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "RFC");
//   this.brf.SetNotRequiredControl(this.ClienteForm, "ContratoFile")
// } 
//TERMINA - BRID:2070


//INICIA - BRID:2438 - acomodo de campos cliente - Autor: Administrador - Actualización: 4/13/2021 1:14:31 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:2438


//INICIA - BRID:2657 - quitar requerido  - Autor: Administrador - Actualización: 4/12/2021 11:31:57 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
//this.brf.SetNotRequiredControl(this.ClienteForm, "Contrato");
} 
//TERMINA - BRID:2657


//INICIA - BRID:2685 - acomodo clientes1.1 - Autor: Administrador - Actualización: 4/13/2021 1:26:30 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:2685

//INICIA - BRID:7248 - id dynamics no requerido - Autor: Administrador - Actualización: 12/19/2022 3:53:11 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  //this.brf.SetNotRequiredControl(this.ClienteForm, "ID_Dynamics");
  } 
  //TERMINA - BRID:7248

//rulesOnInit_ExecuteBusinessRulesEnd




  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:6248 - Update si el cliente editado es EL PALACIO DE HIERRO S.A. DE C.V. o PROFUTURO GNP  S.A.B. DE C.V. o SERVICIOS ADMINISTRATIVOS PEÑOLES, S.A. DE C.V. - Autor: Felipe Rodríguez - Actualización: 9/13/2021 3:49:00 PM
if(  this.operation == 'Update' ) {
  if(this.ClienteForm.get('Clave').value == 3 || this.ClienteForm.get('Clave').value==163|| this.ClienteForm.get('Clave').value==174 ) { 
    this.brf.EvaluaQuery(" UPDATE dbo.Cliente_Facturacion SET Nombre = C.Razon_Social	 FROM dbo.Cliente AS C@LC@@LB@  WHERE dbo.Cliente_Facturacion.Clave = C.Clave AND dbo.Cliente_Facturacion.Clave IN (3,163,174)", 1, "ABC123");} else {}
} 
//TERMINA - BRID:6248

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
