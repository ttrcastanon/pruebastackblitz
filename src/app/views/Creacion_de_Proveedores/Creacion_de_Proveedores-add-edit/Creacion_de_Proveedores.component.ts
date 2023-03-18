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
import { Router, ActivatedRoute } from '@angular/router';

import { GeneralService } from 'src/app/api-services/general.service';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Estatus_de_ProveedorService } from 'src/app/api-services/Estatus_de_Proveedor.service';
import { Estatus_de_Proveedor } from 'src/app/models/Estatus_de_Proveedor';
import { Tipos_de_proveedorService } from 'src/app/api-services/Tipos_de_proveedor.service';
import { Tipos_de_proveedor } from 'src/app/models/Tipos_de_proveedor';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { Clasificacion_de_proveedoresService } from 'src/app/api-services/Clasificacion_de_proveedores.service';
import { Clasificacion_de_proveedores } from 'src/app/models/Clasificacion_de_proveedores';

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
  selector: 'app-Creacion_de_Proveedores',
  templateUrl: './Creacion_de_Proveedores.component.html',
  styleUrls: ['./Creacion_de_Proveedores.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Creacion_de_ProveedoresComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Creacion_de_ProveedoresForm: FormGroup;
  public Editor = ClassicEditor;
  model: Creacion_de_Proveedores;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varEstatus_de_Proveedor: Estatus_de_Proveedor[] = [];
  public varTipos_de_proveedor: Tipos_de_proveedor[] = [];
  public varRespuesta: Respuesta[] = [];
  public varClasificacion_de_proveedores: Clasificacion_de_proveedores[] = [];
  Cargar_acuerdoSelectedFile: File;
  Cargar_acuerdoName = '';
  fileCargar_acuerdo: SpartanFile;

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

  emailEnpty: boolean = false;
  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Estatus_de_ProveedorService: Estatus_de_ProveedorService,
    private Tipos_de_proveedorService: Tipos_de_proveedorService,
    private RespuestaService: RespuestaService,
    private Clasificacion_de_proveedoresService: Clasificacion_de_proveedoresService,

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
    this.model = new Creacion_de_Proveedores(this.fb);
    this.Creacion_de_ProveedoresForm = this.model.buildFormGroup();

    this.Creacion_de_ProveedoresForm.get('Clave').disable();
    this.Creacion_de_ProveedoresForm.get('Clave').setValue('Auto');
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
          this.Creacion_de_ProveedoresForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Creacion_de_Proveedores).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Creacion_de_ProveedoresForm, 'Correo_electronico',[Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);
    //this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Creacion_de_ProveedoresService.listaSelAll(0, 1, 'Creacion_de_Proveedores.Clave=' + id).toPromise();
    if (result.Creacion_de_Proveedoress.length > 0) {

      this.model.fromObject(result.Creacion_de_Proveedoress[0]);
      if (this.model.Cargar_acuerdo !== null && this.model.Cargar_acuerdo !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_acuerdo).subscribe(f => {
          this.fileCargar_acuerdo = f;
          this.Cargar_acuerdoName = f.Description;
          this.Creacion_de_ProveedoresForm.controls['Cargar_acuerdoFile'].setErrors(null);
        });
      }

      this.Creacion_de_ProveedoresForm.markAllAsTouched();
      this.Creacion_de_ProveedoresForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else {
      this.spinner.hide('loading');
    }
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Clave = +params.get('id');

        if (this.model.Clave) {
          this.operation = !this.Creacion_de_ProveedoresForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Clave);
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
    observablesArray.push(this.Estatus_de_ProveedorService.getAll());
    observablesArray.push(this.Tipos_de_proveedorService.getAll());
    observablesArray.push(this.RespuestaService.getAll());
    observablesArray.push(this.Clasificacion_de_proveedoresService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varEstatus_de_Proveedor, varTipos_de_proveedor, varRespuesta, varClasificacion_de_proveedores]) => {
          this.varEstatus_de_Proveedor = varEstatus_de_Proveedor;
          this.varTipos_de_proveedor = varTipos_de_proveedor;
          this.varRespuesta = varRespuesta;
          this.varClasificacion_de_proveedores = varClasificacion_de_proveedores;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Estatus': {
        this.Estatus_de_ProveedorService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Proveedor = x.Estatus_de_Proveedors;
        });
        break;
      }
      case 'Tipo_de_proveedor': {
        this.Tipos_de_proveedorService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipos_de_proveedor = x.Tipos_de_proveedors;
        });
        break;
      }
      case 'Se_realizo_auditoria': {
        this.RespuestaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRespuesta = x.Respuestas;
        });
        break;
      }
      case 'Clasificacion_de_proveedor': {
        this.Clasificacion_de_proveedoresService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varClasificacion_de_proveedores = x.Clasificacion_de_proveedoress;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  async saveCargar_acuerdo(): Promise<number> {
    if (this.Creacion_de_ProveedoresForm.controls.Cargar_acuerdoFile.valid
      && this.Creacion_de_ProveedoresForm.controls.Cargar_acuerdoFile.dirty) {
      const Cargar_acuerdo = this.Creacion_de_ProveedoresForm.controls.Cargar_acuerdoFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_acuerdo);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_acuerdo.name,
        Date_Time: Cargar_acuerdo.lastModifiedDate,
        File_Size: Cargar_acuerdo.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_acuerdo > 0 ? this.model.Cargar_acuerdo : 0;
    }
  }

  Cargar_acuerdoUrl() {
    if (this.fileCargar_acuerdo)
      return this.spartanFileService.url(this.fileCargar_acuerdo.File_Id.toString(), this.fileCargar_acuerdo.Description);
    return '#';
  }

  getCargar_acuerdo() {
    this.helperService.dowloadFile(this.fileCargar_acuerdo.base64, this.Cargar_acuerdoName);
  }

  removeCargar_acuerdo() {
    this.Cargar_acuerdoName = '';
    this.model.Cargar_acuerdo = 0;
  }

  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Creacion_de_ProveedoresForm.value;
      entity.Clave = this.model.Clave;

      const FolioCargar_acuerdo = await this.saveCargar_acuerdo();
      entity.Cargar_acuerdo = FolioCargar_acuerdo > 0 ? FolioCargar_acuerdo : null;

      if (this.model.Clave > 0) {
        await this.Creacion_de_ProveedoresService.update(this.model.Clave, entity).toPromise();

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Clave.toString());
        this.spinner.hide('loading');
        return this.model.Clave;
      } else {
        await (this.Creacion_de_ProveedoresService.insert(entity).toPromise().then(async id => {

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
    if (this.model.Clave === 0) {
      this.Creacion_de_ProveedoresForm.reset();
      this.model = new Creacion_de_Proveedores(this.fb);
      this.Creacion_de_ProveedoresForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Creacion_de_Proveedores/add']);
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
    this.router.navigate(['/Creacion_de_Proveedores/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  validateEmail() {
    if(this.Creacion_de_ProveedoresForm.get('Correo_electronico').invalid){
      let email = this.Creacion_de_ProveedoresForm.get('Correo_electronico').value;
      this.emailEnpty = email.length > 0 ;

      //this.Creacion_de_UsuariosForm.get('Correo_electronico').setValue("");
    }
  }
  //No borrar el bloque de codigo siguiente
  //Inicio de Reglas

  ID_Dynamics_ExecuteBusinessRules(): void {
    //ID_Dynamics_FieldExecuteBusinessRulesEnd
  }
  Razon_social_ExecuteBusinessRules(): void {
    //Razon_social_FieldExecuteBusinessRulesEnd
  }
  RFC_ExecuteBusinessRules(): void {
    //RFC_FieldExecuteBusinessRulesEnd
  }
  Contacto_ExecuteBusinessRules(): void {
    //Contacto_FieldExecuteBusinessRulesEnd
  }
  Correo_electronico_ExecuteBusinessRules(): void {
    //Correo_electronico_FieldExecuteBusinessRulesEnd
  }
  Direccion_fiscal_ExecuteBusinessRules(): void {
    //Direccion_fiscal_FieldExecuteBusinessRulesEnd
  }
  Direccion_postal_ExecuteBusinessRules(): void {
    //Direccion_postal_FieldExecuteBusinessRulesEnd
  }
  Telefono_de_contacto_ExecuteBusinessRules(): void {
    //Telefono_de_contacto_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  Tiempo_de_pagos_negociado_ExecuteBusinessRules(): void {
    //Tiempo_de_pagos_negociado_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_proveedor_ExecuteBusinessRules(): void {
    //Tipo_de_proveedor_FieldExecuteBusinessRulesEnd
  }
  Se_realizo_auditoria_ExecuteBusinessRules(): void {
    //Se_realizo_auditoria_FieldExecuteBusinessRulesEnd
  }
  Clasificacion_de_proveedor_ExecuteBusinessRules(): void {
    //Clasificacion_de_proveedor_FieldExecuteBusinessRulesEnd
  }
  Cargar_acuerdo_ExecuteBusinessRules(): void {
    //Cargar_acuerdo_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:127 - NO REQUERIDO CAMPOS PROVEEDORES - Autor: Felipe Rodríguez - Actualización: 2/8/2021 5:33:52 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Clave");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Razon_social");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Contacto");
      //this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Correo_electronico");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Direccion_fiscal");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Direccion_postal");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Telefono_de_contacto");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "ID_Dynamics");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Estatus");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Tiempo_de_pagos_negociado");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Tipo_de_proveedor");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Se_realizo_auditoria");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Clasificacion_de_proveedor");
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Cargar_acuerdo");
    }
    //TERMINA - BRID:127


    //INICIA - BRID:222 - DESHABILITAR CONTROL DE CAMPOS - Autor: Administrador - Actualización: 3/9/2021 4:04:05 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.Creacion_de_ProveedoresForm, 'Clave', 0);
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, 'Cargar_acuerdoFile');//Cargar_acuerdoFile
      this.brf.SetEnabledControl(this.Creacion_de_ProveedoresForm, 'Razon_social', 1);
      this.brf.SetEnabledControl(this.Creacion_de_ProveedoresForm, 'Contacto', 1);
      //this.brf.SetEnabledControl(this.Creacion_de_ProveedoresForm, 'Correo_electronico', 1);
      this.brf.SetEnabledControl(this.Creacion_de_ProveedoresForm, 'Direccion_fiscal', 1);
      this.brf.SetEnabledControl(this.Creacion_de_ProveedoresForm, 'Direccion_postal', 1);
      this.brf.SetEnabledControl(this.Creacion_de_ProveedoresForm, 'Telefono_de_contacto', 1);
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Clave");
      this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Razon_social");
      this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Contacto");
      //this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Correo_electronico");
      this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Direccion_fiscal");
      this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Direccion_postal");
      this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Telefono_de_contacto");
      this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "ID_Dynamics");
    }
    //TERMINA - BRID:222


    //INICIA - BRID:2073 - no requeridos proveedores - Autor: Administrador - Actualización: 3/26/2021 12:14:17 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.Creacion_de_ProveedoresForm, "Cargar_acuerdo");
    }
    //TERMINA - BRID:2073


    //INICIA - BRID:2074 - cesar deshabilitar control  - Autor: Administrador - Actualización: 3/26/2021 12:15:41 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
    //  this.brf.SetEnabledControl(this.Creacion_de_ProveedoresForm, 'ID_Dynamics', 0);
    }
    //TERMINA - BRID:2074


    //INICIA - BRID:7247 - requerido - Autor: Administrador - Actualización: 12/19/2022 2:17:32 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Estatus");this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Tiempo_de_pagos_negociado");this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Tipo_de_proveedor");this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Se_realizo_auditoria");this.brf.SetRequiredControl(this.Creacion_de_ProveedoresForm, "Clasificacion_de_proveedor");
  } 
  //TERMINA - BRID:7247
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
