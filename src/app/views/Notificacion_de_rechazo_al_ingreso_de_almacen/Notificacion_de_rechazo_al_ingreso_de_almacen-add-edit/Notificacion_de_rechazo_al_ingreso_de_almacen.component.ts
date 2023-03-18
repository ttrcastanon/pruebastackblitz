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
import { Notificacion_de_rechazo_al_ingreso_de_almacenService } from 'src/app/api-services/Notificacion_de_rechazo_al_ingreso_de_almacen.service';
import { Notificacion_de_rechazo_al_ingreso_de_almacen } from 'src/app/models/Notificacion_de_rechazo_al_ingreso_de_almacen';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Razon_de_Rechazo_a_AlmacenService } from 'src/app/api-services/Razon_de_Rechazo_a_Almacen.service';
import { Razon_de_Rechazo_a_Almacen } from 'src/app/models/Razon_de_Rechazo_a_Almacen';

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
  selector: 'app-Notificacion_de_rechazo_al_ingreso_de_almacen',
  templateUrl: './Notificacion_de_rechazo_al_ingreso_de_almacen.component.html',
  styleUrls: ['./Notificacion_de_rechazo_al_ingreso_de_almacen.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Notificacion_de_rechazo_al_ingreso_de_almacenComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Notificacion_de_rechazo_al_ingreso_de_almacenForm: FormGroup;
	public Editor = ClassicEditor;
	model: Notificacion_de_rechazo_al_ingreso_de_almacen;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsProveedor: Observable<Creacion_de_Proveedores[]>;
	hasOptionsProveedor: boolean;
	isLoadingProveedor: boolean;
	public varRazon_de_Rechazo_a_Almacen: Razon_de_Rechazo_a_Almacen[] = [];

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
    private Notificacion_de_rechazo_al_ingreso_de_almacenService: Notificacion_de_rechazo_al_ingreso_de_almacenService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Razon_de_Rechazo_a_AlmacenService: Razon_de_Rechazo_a_AlmacenService,

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
    this.model = new Notificacion_de_rechazo_al_ingreso_de_almacen(this.fb);
    this.Notificacion_de_rechazo_al_ingreso_de_almacenForm = this.model.buildFormGroup();
	
	this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.get('Folio').disable();
    this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.get('Folio').setValue('Auto');
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
		
          this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Notificacion_de_rechazo_al_ingreso_de_almacen)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm, 'Proveedor', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Notificacion_de_rechazo_al_ingreso_de_almacenService.listaSelAll(0, 1, 'Notificacion_de_rechazo_al_ingreso_de_almacen.Folio=' + id).toPromise();
	if (result.Notificacion_de_rechazo_al_ingreso_de_almacens.length > 0) {
	  
        this.model.fromObject(result.Notificacion_de_rechazo_al_ingreso_de_almacens[0]);
        this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.get('Proveedor').setValue(
          result.Notificacion_de_rechazo_al_ingreso_de_almacens[0].Proveedor_Creacion_de_Proveedores.Razon_social,
          { onlySelf: false, emitEvent: true }
        );

		this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.markAllAsTouched();
		this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Razon_de_Rechazo_a_AlmacenService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varRazon_de_Rechazo_a_Almacen ]) => {
          this.varRazon_de_Rechazo_a_Almacen = varRazon_de_Rechazo_a_Almacen;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.get('Proveedor').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingProveedor = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, '');
          return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
            "Creacion_de_Proveedores.Razon_social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_ProveedoresService.listaSelAll(0, 20,
          "Creacion_de_Proveedores.Razon_social like '%" + value.Razon_social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = result?.Creacion_de_Proveedoress?.length > 0;
	  this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.get('Proveedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
	  this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Razon': {
        this.Razon_de_Rechazo_a_AlmacenService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRazon_de_Rechazo_a_Almacen = x.Razon_de_Rechazo_a_Almacens;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

displayFnProveedor(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.value;
      entity.Folio = this.model.Folio;
      entity.Proveedor = this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.get('Proveedor').value.Clave;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Notificacion_de_rechazo_al_ingreso_de_almacenService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Notificacion_de_rechazo_al_ingreso_de_almacenService.insert(entity).toPromise().then(async id => {

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
      this.Notificacion_de_rechazo_al_ingreso_de_almacenForm.reset();
      this.model = new Notificacion_de_rechazo_al_ingreso_de_almacen(this.fb);
      this.Notificacion_de_rechazo_al_ingreso_de_almacenForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Notificacion_de_rechazo_al_ingreso_de_almacen/add']);
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
    window.close();
    this.router.navigate(['/Notificacion_de_rechazo_al_ingreso_de_almacen/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      No__de_Parte___Descripcion_ExecuteBusinessRules(): void {
        //No__de_Parte___Descripcion_FieldExecuteBusinessRulesEnd
    }
    Proveedor_ExecuteBusinessRules(): void {
        //Proveedor_FieldExecuteBusinessRulesEnd
    }
    Razon_ExecuteBusinessRules(): void {
        //Razon_FieldExecuteBusinessRulesEnd
    }
    Motivo_de_devolucion_ExecuteBusinessRules(): void {
        //Motivo_de_devolucion_FieldExecuteBusinessRulesEnd
    }
    IdNotificacionRechazoIA_ExecuteBusinessRules(): void {
        //IdNotificacionRechazoIA_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:4135 - Tamaño camp rehzado - Autor: Eliud Hernandez - Actualización: 7/14/2021 1:02:05 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4135


//INICIA - BRID:4560 - ocultar campo de folio notificacion de rechazo - Autor: ANgel Acuña - Actualización: 8/2/2021 12:04:05 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
this.brf.HideFieldOfForm(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm, "Folio"); this.brf.SetNotRequiredControl(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm, "Folio");
} 
//TERMINA - BRID:4560


//INICIA - BRID:4561 - Deshabilitar campos notificacion de rechazo - Autor: ANgel Acuña - Actualización: 8/2/2021 12:04:58 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetEnabledControl(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm, 'No__de_Parte___Descripcion', 0);this.brf.SetEnabledControl(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm, 'Proveedor', 0);
} 
//TERMINA - BRID:4561


//INICIA - BRID:4566 - Quitar campos no requeridos notificacion - Autor: ANgel Acuña - Actualización: 8/3/2021 11:15:22 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this.brf.SetNotRequiredControl(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm, "Motivo_de_devolucion"); this.brf.HideFieldOfForm(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm, "IdNotificacionRechazoIA"); this.brf.SetNotRequiredControl(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm, "IdNotificacionRechazoIA");
} 
//TERMINA - BRID:4566


//INICIA - BRID:4569 - En nuevo, cargar informacion de numero de parte y provedor (manual) - Autor: ANgel Acuña - Actualización: 8/3/2021 12:54:10 PM
if(  this.operation == 'New' ) {
this.brf.SetValueFromQuery(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm,"No__de_Parte___Descripcion",this.brf.EvaluaQuery(" select ''", 1, "ABC123"),1,"ABC123");this.brf.SetValueFromQuery(this.Notificacion_de_rechazo_al_ingreso_de_almacenForm,"Proveedor",this.brf.EvaluaQuery(" select ''", 1, "ABC123"),1,"ABC123");
} 
//TERMINA - BRID:4569

//rulesOnInit_ExecuteBusinessRulesEnd





  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:4573 - Actualizar Detalle_Listado_de_compras_en_proceso con Id (Manual) - Autor: ANgel Acuña - Actualización: 8/3/2021 1:02:48 PM
if(  this.operation == 'New' ) {
this.brf.EvaluaQuery(" Select ''", 1, "ABC123");
} 
//TERMINA - BRID:4573


//INICIA - BRID:4640 - Enviar correo rol de compras  - Autor: ANgel Acuña - Actualización: 8/4/2021 1:27:27 PM
if(  this.operation == 'New' ) {
//this.brf.SendEmailQuery("Notificación de rechazo al ingreso de almacén", this.brf.EvaluaQuery("select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (42)) A for XML PATH('') ), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <title>Aerovics</title> <style type='text/css'> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*='margin: 16px 0'] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'> <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0' style='border-collapse:collapse;'> <tr> <td> <center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --> <div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'> Aerovics - Almacen </div> <!-- Visually Hidden Preheader Text : END --> <div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'> <tr> <td width='40'>&nbsp;</td> <td width='260'><img src='logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td> <td>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> <tr> <td width='40'>&nbsp;</td> <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td> <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td> <td width='40'>&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing='0' cellpadding='0' border='0' width='100%'> <tr> <td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'> <p>A quien corresponda:</p> <p>Se hace de su conocimiento que la parte  + EvaluaQuery("SELECT FLD[No__de_Parte___Descripcion]") + para ingreso al almacén fue revisada por inspección de calidad y esta no cumplió con las características necesarias + EvaluaQuery("select Descripcion from Razon_de_Rechazo_a_Almacen where Folio = FLD[Razon]") +. Motivo de Rechazo: + EvaluaQuery("SELECT FLD[Motivo_de_devolucion]") + </p> <p>Atentamente</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN --> </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN --> <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'> <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle'> <img style='width: 40px; height: 40px;' src='mail-user.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'> + EvaluaQuery("SELECT name FROM Spartan_User WHERE Id_User = GLOBAL[USERID]") +</p> <p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'> Almacen</p> </td> <td width='40'>&nbsp;</td> </tr> <tr> <td width='40'>&nbsp;</td> <td width='40' valign='middle' style='text-align: right;'> <img style='width: 24px; height: 24px;' src='mail-plane.png'/> </td> <td width='5'>&nbsp;</td> <td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p> </td> <td width='40'>&nbsp;</td> </tr> </table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td> </tr> <tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>&nbsp; </td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td> </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>");
} 
//TERMINA - BRID:4640

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
