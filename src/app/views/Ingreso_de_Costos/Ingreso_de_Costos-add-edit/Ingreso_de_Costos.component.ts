import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, debounceTime, distinctUntilChanged, tap, switchMap, } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Ingreso_de_CostosService } from 'src/app/api-services/Ingreso_de_Costos.service';
import { Ingreso_de_Costos } from 'src/app/models/Ingreso_de_Costos';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Ingreso_de_Costos',
  templateUrl: './Ingreso_de_Costos.component.html',
  styleUrls: ['./Ingreso_de_Costos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class Ingreso_de_CostosComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Ingreso_de_CostosForm: FormGroup;
  public Editor = ClassicEditor;
  model: Ingreso_de_Costos;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsNo__de_OC: Observable<Generacion_de_Orden_de_Compras[]>;
  hasOptionsNo__de_OC: boolean;
  isLoadingNo__de_OC: boolean;
  optionsProveedor: Observable<Creacion_de_Proveedores[]>;
  hasOptionsProveedor: boolean;
  isLoadingProveedor: boolean;

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
  Detalle_de_Listado_de_Pago_de_ProveedoresSolcitud_de_Pago: any
  optionSolicitudPago
  //#endregion

  constructor(private fb: FormBuilder,
    private Ingreso_de_CostosService: Ingreso_de_CostosService,
    private Generacion_de_Orden_de_ComprasService: Generacion_de_Orden_de_ComprasService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private _seguridad: SeguridadService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private _SpartanService: SpartanService,
    renderer: Renderer2
  ) {

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Ingreso_de_Costos(this.fb);
    this.Ingreso_de_CostosForm = this.model.buildFormGroup();

    this.Ingreso_de_CostosForm.get('Folio').disable();
    this.Ingreso_de_CostosForm.get('Folio').setValue('Auto');

    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.rulesAfterViewInit();
  }

  async ngOnInit() {
    this.populateControls();

    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Ingreso_de_CostosForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Ingreso_de_Costos).subscribe((response) => {
      this.permisos = response;
    });

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Ingreso_de_CostosService.listaSelAll(0, 1, 'Ingreso_de_Costos.Folio=' + id).toPromise();
    if (result.Ingreso_de_Costoss.length > 0) {

      this.model.fromObject(result.Ingreso_de_Costoss[0]);
      this.Ingreso_de_CostosForm.get('No__de_OC').setValue(
        result.Ingreso_de_Costoss[0].No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
        { onlySelf: false, emitEvent: true }
      );
      this.Ingreso_de_CostosForm.get('Proveedor').setValue(
        result.Ingreso_de_Costoss[0].Proveedor_Creacion_de_Proveedores.Razon_social,
        { onlySelf: false, emitEvent: true }
      );

      this.Ingreso_de_CostosForm.markAllAsTouched();
      this.Ingreso_de_CostosForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else {
      this.spinner.hide('loading');
    }
  }

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Ingreso_de_CostosForm.disabled ? "Update" : this.operation;
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

    this.Ingreso_de_CostosForm.get('No__de_OC').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo__de_OC = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20, '');
          return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20,
            "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Generacion_de_Orden_de_ComprasService.listaSelAll(0, 20,
          "Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + value.FolioGeneracionOC.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNo__de_OC = false;
      this.hasOptionsNo__de_OC = result?.Generacion_de_Orden_de_Comprass?.length > 0;
      this.Ingreso_de_CostosForm.get('No__de_OC').setValue(result?.Generacion_de_Orden_de_Comprass[0], { onlySelf: true, emitEvent: false });
      this.optionsNo__de_OC = of(result?.Generacion_de_Orden_de_Comprass);
    }, error => {
      this.isLoadingNo__de_OC = false;
      this.hasOptionsNo__de_OC = false;
      this.optionsNo__de_OC = of([]);
    });
    this.Ingreso_de_CostosForm.get('Proveedor').valueChanges.pipe(
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
      this.Ingreso_de_CostosForm.get('Proveedor').setValue(result?.Creacion_de_Proveedoress[0], { onlySelf: true, emitEvent: false });
      this.optionsProveedor = of(result?.Creacion_de_Proveedoress);
    }, error => {
      this.isLoadingProveedor = false;
      this.hasOptionsProveedor = false;
      this.optionsProveedor = of([]);
    });

    this.getParamsFromUrl();

  }

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

  displayFnNo__de_OC(option: Generacion_de_Orden_de_Compras) {
    return option?.FolioGeneracionOC;
  }

  displayFnProveedor(option: Creacion_de_Proveedores) {
    return option?.Razon_social;
  }

  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Ingreso_de_CostosForm.value;
      entity.Folio = this.model.Folio;
      entity.No__de_OC = this.Ingreso_de_CostosForm.get('No__de_OC').value?.Folio;
      entity.Proveedor = this.Ingreso_de_CostosForm.get('Proveedor').value?.Clave;

      if (this.model.Folio > 0) {
        await this.Ingreso_de_CostosService.update(this.model.Folio, entity).toPromise();

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.localStorageHelper.setItemToLocalStorage("IsResetListado_de_Pago_de_Proveedores", "1");
        this.rulesAfterSave();
        return this.model.Folio;
      } else {
        await (this.Ingreso_de_CostosService.insert(entity).toPromise().then(async id => {

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          this.localStorageHelper.setItemToLocalStorage("IsResetListado_de_Pago_de_Proveedores", "1");
          this.rulesAfterSave();
          return id;
        }));
      }

      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });

    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }

  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Ingreso_de_CostosForm.reset();
      this.model = new Ingreso_de_Costos(this.fb);
      this.Ingreso_de_CostosForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Ingreso_de_Costos/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }

  cancel() {
    window.close()
    //this.goToList();
  }

  goToList() {
    this.router.navigate(['/Ingreso_de_Costos/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  No__de_OC_ExecuteBusinessRules(): void {
    //No__de_OC_FieldExecuteBusinessRulesEnd
  }
  Proveedor_ExecuteBusinessRules(): void {
    //Proveedor_FieldExecuteBusinessRulesEnd
  }
  No__de_Factura_ExecuteBusinessRules(): void {
    this.brf.SetNotValidatorControl(this.Ingreso_de_CostosForm, "Nota_de_Credito");
    this.brf.SetNotValidatorControl(this.Ingreso_de_CostosForm, "Observaciones");
  }

  Fecha_de_Factura_ExecuteBusinessRules(): void {
    //Fecha_de_Factura_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Pago_ExecuteBusinessRules(): void {
    //Fecha_de_Pago_FieldExecuteBusinessRulesEnd
  }
  Nota_de_Credito_ExecuteBusinessRules(): void {
    //Nota_de_Credito_FieldExecuteBusinessRulesEnd
  }
  Total_de_Factura__ExecuteBusinessRules(): void {
    //Total_de_Factura__FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    //Observaciones_FieldExecuteBusinessRulesEnd
  }
  IdSolicitudPago_ExecuteBusinessRules(): void {
    //IdSolicitudPago_FieldExecuteBusinessRulesEnd
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
    console.log(this.Ingreso_de_CostosForm)
    this.brf.SetNotRequiredElementControl(this.Ingreso_de_CostosForm, "Folio");
    this.brf.SetNotRequiredElementControl(this.Ingreso_de_CostosForm, "IdSolicitudPago");
    this.brf.SetNotRequiredElementControl(this.Ingreso_de_CostosForm, "Nota_de_Credito");
    this.brf.SetNotRequiredElementControl(this.Ingreso_de_CostosForm, "Observaciones");

    this.brf.HideFieldOfFormAfter(this.Ingreso_de_CostosForm, "Folio");
    this.brf.HideFieldOfFormAfter(this.Ingreso_de_CostosForm, "IdSolicitudPago");

  }

  rulesOnInit() {
    //rulesOnInit_ExecuteBusinessRulesInit

    this.brf.SetNotValidatorControl2(this.Ingreso_de_CostosForm, "Folio");
    this.Ingreso_de_CostosForm.controls["IdSolicitudPago"].disable();
    this.brf.SetNotValidatorControl2(this.Ingreso_de_CostosForm, "IdSolicitudPago");
    this.brf.SetNotValidatorControl2(this.Ingreso_de_CostosForm, "Nota_de_Credito");
    this.brf.SetNotValidatorControl2(this.Ingreso_de_CostosForm, "Observaciones");


    //INICIA - BRID:4166 - Dehabiliat y acomodar no de oc y proveedor - Autor: ANgel Acuña - Actualización: 7/16/2021 6:13:14 PM
    this.brf.SetEnabledControl(this.Ingreso_de_CostosForm, 'No__de_OC', 0);
    this.brf.SetEnabledControl(this.Ingreso_de_CostosForm, 'Proveedor', 0);
    //TERMINA - BRID:4166

    //rulesOnInit_ExecuteBusinessRulesEnd

    this.fnGetDetalleDatosGenerales()

  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    const KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)

    //INICIA - BRID:4146 - Agregar IdSolicitudPago con relacion a listado de pago de proveedores (Codigo manual, no borrar) - Autor: ANgel Acuña - Actualización: 7/14/2021 6:43:16 PM
    if (this.operation == 'New') {
      this.Detalle_de_Listado_de_Pago_de_ProveedoresSolcitud_de_Pago.forEach(element => {
        if (this.optionSolicitudPago == "Item") {
          this.brf.EvaluaQuery(` UPDATE Detalle_de_Listado_de_Pago_de_Proveedores set IdSolicitudPago = ${KeyValueInserted} where Folio = ${element.Folio}`, 1, "ABC123");
          this.brf.EvaluaQuery(` EXEC spNumerodePartida ${element.Folio}`, 1, "ABC123");
        }
      });
    }
    //TERMINA - BRID:4146


    //#region BRID:4170 - En nuevo despues de guardar, agregar un registro al listado de pagos (codigo manual) - Autor: ANgel Acuña - Actualización: 7/16/2021 8:01:28 PM
    if (this.operation == 'New' && this.optionSolicitudPago == "NewItem") {
      this.brf.EvaluaQuery(` exec usp_InsDetalle_de_Listado_de_Pago_de_ProveedoresFrmIngresos ${KeyValueInserted}`, 1, "ABC123");
    }
    //#endregion

    //rulesAfterSave_ExecuteBusinessRulesEnd

    setTimeout(() => {
      this.successSave()
    }, 3000);


  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas

  successSave() {
    this.isLoading = false;
    this.spinner.hide('loading');
    this.cancel()
  }

  //#region Obtener Detalle de Solicitud de Pago
  fnGetDetalleDatosGenerales() {
    const stringLista = this.localStorageHelper.getItemFromLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresSolcitud_de_Pago");
    this.optionSolicitudPago = this.localStorageHelper.getItemFromLocalStorage("Detalle_de_Listado_de_Pago_de_ProveedoresOption");

    var array = JSON.parse(stringLista)
    console.log(array)

    if (array != null) {

      this.Detalle_de_Listado_de_Pago_de_ProveedoresSolcitud_de_Pago = array

      if (this.operation == "New") {
        console.log(array)
        this.fnSetDatosGenerales(array);
      }

    }

  }
  //#endregion


  //#region Asignar Datos Generales
  fnSetDatosGenerales(array) {
    this.Ingreso_de_CostosForm.controls["No__de_OC"].setValue(array[0].No__de_OCFolioGeneracionOC)
    this.Ingreso_de_CostosForm.controls["Proveedor"].setValue(array[0].ProveedorRazon_social)
  }
  //#endregion



}
