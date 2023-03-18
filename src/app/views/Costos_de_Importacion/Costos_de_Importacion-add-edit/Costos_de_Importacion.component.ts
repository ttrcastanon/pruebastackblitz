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

import { GeneralService } from 'src/app/api-services/general.service';
import { Costos_de_ImportacionService } from 'src/app/api-services/Costos_de_Importacion.service';
import { Costos_de_Importacion } from 'src/app/models/Costos_de_Importacion';
import { Tipo_de_MiscelaneasService } from 'src/app/api-services/Tipo_de_Miscelaneas.service';
import { Tipo_de_Miscelaneas } from 'src/app/models/Tipo_de_Miscelaneas';
import { Tipo_de_TransporteService } from 'src/app/api-services/Tipo_de_Transporte.service';
import { Tipo_de_Transporte } from 'src/app/models/Tipo_de_Transporte';
import { Servicios_AduanalesService } from 'src/app/api-services/Servicios_Aduanales.service';
import { Servicios_Aduanales } from 'src/app/models/Servicios_Aduanales';
import { Gestion_de_ImportacionService } from 'src/app/api-services/Gestion_de_Importacion.service';
import { Gestion_de_Importacion } from 'src/app/models/Gestion_de_Importacion';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Costos_de_Importacion',
  templateUrl: './Costos_de_Importacion.component.html',
  styleUrls: ['./Costos_de_Importacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Costos_de_ImportacionComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }

  Costos_de_ImportacionForm: FormGroup;
  public Editor = ClassicEditor;
  model: Costos_de_Importacion;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varTipo_de_Miscelaneas: Tipo_de_Miscelaneas[] = [];
  public varTipo_de_Transporte: Tipo_de_Transporte[] = [];
  public varServicios_Aduanales: Servicios_Aduanales[] = [];
  optionsFolioGestionIportacion: Observable<Gestion_de_Importacion[]>;
  hasOptionsFolioGestionIportacion: boolean;
  isLoadingFolioGestionIportacion: boolean;

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

  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Costos_de_ImportacionService: Costos_de_ImportacionService,
    private Tipo_de_MiscelaneasService: Tipo_de_MiscelaneasService,
    private Tipo_de_TransporteService: Tipo_de_TransporteService,
    private Servicios_AduanalesService: Servicios_AduanalesService,
    private Gestion_de_ImportacionService: Gestion_de_ImportacionService,

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

    this.model = new Costos_de_Importacion(this.fb);
    this.Costos_de_ImportacionForm = this.model.buildFormGroup();

    this.Costos_de_ImportacionForm.get('Folio').disable();
    this.Costos_de_ImportacionForm.get('Folio').setValue('Auto');
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

          this.Costos_de_ImportacionForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Costos_de_Importacion)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Costos_de_ImportacionForm, 'FolioGestionIportacion', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Costos_de_ImportacionService.listaSelAll(0, 1, 'Costos_de_Importacion.Folio=' + id).toPromise();
    if (result.Costos_de_Importacions.length > 0) {

      this.model.fromObject(result.Costos_de_Importacions[0]);
      this.Costos_de_ImportacionForm.get('FolioGestionIportacion').setValue(
        result.Costos_de_Importacions[0].FolioGestionIportacion_Gestion_de_Importacion.FolioGestiondeImportacion,
        { onlySelf: false, emitEvent: true }
      );

      this.Costos_de_ImportacionForm.markAllAsTouched();
      this.Costos_de_ImportacionForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }


  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Costos_de_ImportacionForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_de_MiscelaneasService.getAll());
    observablesArray.push(this.Tipo_de_TransporteService.getAll());
    observablesArray.push(this.Servicios_AduanalesService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varTipo_de_Miscelaneas, varTipo_de_Transporte, varServicios_Aduanales]) => {
          this.varTipo_de_Miscelaneas = varTipo_de_Miscelaneas;
          this.varTipo_de_Transporte = varTipo_de_Transporte;
          this.varServicios_Aduanales = varServicios_Aduanales;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Costos_de_ImportacionForm.get('FolioGestionIportacion').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingFolioGestionIportacion = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Gestion_de_ImportacionService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Gestion_de_ImportacionService.listaSelAll(0, 20, '');
          return this.Gestion_de_ImportacionService.listaSelAll(0, 20,
            "Gestion_de_Importacion.FolioGestiondeImportacion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Gestion_de_ImportacionService.listaSelAll(0, 20,
          "Gestion_de_Importacion.FolioGestiondeImportacion like '%" + value.FolioGestiondeImportacion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingFolioGestionIportacion = false;
      this.hasOptionsFolioGestionIportacion = result?.Gestion_de_Importacions?.length > 0;
      this.Costos_de_ImportacionForm.get('FolioGestionIportacion').setValue(result?.Gestion_de_Importacions[0], { onlySelf: true, emitEvent: false });
      this.optionsFolioGestionIportacion = of(result?.Gestion_de_Importacions);
    }, error => {
      this.isLoadingFolioGestionIportacion = false;
      this.hasOptionsFolioGestionIportacion = false;
      this.optionsFolioGestionIportacion = of([]);
    });

    this.rulesOnInit();
  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Miscelaneas': {
        this.Tipo_de_MiscelaneasService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Miscelaneas = x.Tipo_de_Miscelaneass;
        });
        break;
      }
      case 'Transporte': {
        this.Tipo_de_TransporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Transporte = x.Tipo_de_Transportes;
        });
        break;
      }
      case 'Servicios_Aduanales': {
        this.Servicios_AduanalesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varServicios_Aduanales = x.Servicios_Aduanaless;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnFolioGestionIportacion(option: Gestion_de_Importacion) {
    return option?.FolioGestiondeImportacion;
  }


  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      this.Costos_de_ImportacionForm.enable();
      const entity = this.Costos_de_ImportacionForm.value;
      entity.Folio = this.model.Folio;
      entity.FolioGestionIportacion = this.Costos_de_ImportacionForm.get('FolioGestionIportacion').value.Folio;

      
      if (this.model.Folio > 0) {
        await this.Costos_de_ImportacionService.update(this.model.Folio, entity).toPromise().then(async id => {
          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
          this.rulesAfterSave();
          this.spinner.hide('loading');
          return this.model.Folio;
        });
      } else {
        await (this.Costos_de_ImportacionService.insert(entity).toPromise().then(async id => {

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
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
      //this.rulesAfterSave();
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
      this.Costos_de_ImportacionForm.reset();
      this.model = new Costos_de_Importacion(this.fb);
      this.Costos_de_ImportacionForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Costos_de_Importacion/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }

  cancel() {
    this.closeWindowCancel()
  }

  goToList() {
    this.closeWindowCancel();
    this.router.navigate(['/Costos_de_Importacion/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  closeWindowCancel(): void {
    window.close();
  }

  closeWindowSave(): void {
    setTimeout(() => {
      window.close();
    }, 3000);
  }


  numberOnly(event,num:number): boolean {
    if(event.target.value.length > (num-1))
   {return false;}
    const charCode = (event.which) ? event.which : event.keyCode;
    if ((charCode > 31) && (charCode < 48 || charCode > 57)) {
      return false;
      }
    return true;
   }
  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Miscelaneas_ExecuteBusinessRules(): void {
    //Miscelaneas_FieldExecuteBusinessRulesEnd
  }
  No__items_asociados_ExecuteBusinessRules(): void {
    //No__items_asociados_FieldExecuteBusinessRulesEnd
  }
  Transporte_ExecuteBusinessRules(): void {
    //Transporte_FieldExecuteBusinessRulesEnd
  }
  Costo_flete__ExecuteBusinessRules(): void {
    //Costo_flete__FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Cambio_T_ExecuteBusinessRules(): void {
    //Tipo_de_Cambio_T_FieldExecuteBusinessRulesEnd
  }
  No__de_Factura_T_ExecuteBusinessRules(): void {
    //No__de_Factura_T_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Factura_T_ExecuteBusinessRules(): void {
    //Fecha_de_Factura_T_FieldExecuteBusinessRulesEnd
  }
  Servicios_Aduanales_ExecuteBusinessRules(): void {
    //Servicios_Aduanales_FieldExecuteBusinessRulesEnd
  }
  Costo_Servicios__ExecuteBusinessRules(): void {
    //Costo_Servicios__FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Cambio_SA_ExecuteBusinessRules(): void {
    //Tipo_de_Cambio_SA_FieldExecuteBusinessRulesEnd
  }
  No__de_Factura_SA_ExecuteBusinessRules(): void {
    //No__de_Factura_SA_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Factura_SA_ExecuteBusinessRules(): void {
    //Fecha_de_Factura_SA_FieldExecuteBusinessRulesEnd
  }
  Impuestos_Aduanales_ExecuteBusinessRules(): void {
    //Impuestos_Aduanales_FieldExecuteBusinessRulesEnd
  }
  Costo_Impuesto__ExecuteBusinessRules(): void {
    //Costo_Impuesto__FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Cambio_IA_ExecuteBusinessRules(): void {
    //Tipo_de_Cambio_IA_FieldExecuteBusinessRulesEnd
  }
  No__de_Factura_IA_ExecuteBusinessRules(): void {
    //No__de_Factura_IA_FieldExecuteBusinessRulesEnd
  }
  No__de_Factura_IA2_ExecuteBusinessRules(): void {
    //No__de_Factura_IA2_FieldExecuteBusinessRulesEnd
  }
  Clave_de_Pedimento_ExecuteBusinessRules(): void {
    //Clave_de_Pedimento_FieldExecuteBusinessRulesEnd
  }
  No__de_Pedimento_ExecuteBusinessRules(): void {
    //No__de_Pedimento_FieldExecuteBusinessRulesEnd
  }
  No__de_Guia_ExecuteBusinessRules(): void {
    //No__de_Guia_FieldExecuteBusinessRulesEnd
  }
  FolioGestionIportacion_ExecuteBusinessRules(): void {
    //FolioGestionIportacion_FieldExecuteBusinessRulesEnd
  }
  FolioCostosImportacion_ExecuteBusinessRules(): void {
    //FolioCostosImportacion_FieldExecuteBusinessRulesEnd
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


    //INICIA - BRID:4544 - Campos no requeridos para cost impo - Autor: Eliud Hernandez - Actualización: 7/29/2021 5:47:40 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.Costos_de_ImportacionForm, 'Miscelaneas', 0);
      this.brf.SetEnabledControl(this.Costos_de_ImportacionForm, 'No__items_asociados', 0);
      this.brf.SetEnabledControl(this.Costos_de_ImportacionForm, 'Transporte', 0);
      this.brf.SetEnabledControl(this.Costos_de_ImportacionForm, 'Servicios_Aduanales', 0);
      this.brf.SetEnabledControl(this.Costos_de_ImportacionForm, 'Clave_de_Pedimento', 0);
      this.brf.SetEnabledControl(this.Costos_de_ImportacionForm, 'No__de_Pedimento', 0);
      this.brf.SetEnabledControl(this.Costos_de_ImportacionForm, 'No__de_Guia', 0);
    }
    //TERMINA - BRID:4544


    //INICIA - BRID:4552 - Ocultar campo Costos de Imp - Autor: Lizeth Villa - Actualización: 8/5/2021 9:49:55 AM
    // if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
    //   this.brf.HideFieldOfForm(this.Costos_de_ImportacionForm, "Folio");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Folio");
    //   this.brf.HideFieldOfForm(this.Costos_de_ImportacionForm, "No__de_Factura_IA");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "No__de_Factura_IA");
    //   this.brf.HideFieldOfForm(this.Costos_de_ImportacionForm, "No__de_Factura_IA2");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "No__de_Factura_IA2");
    //   this.brf.HideFieldOfForm(this.Costos_de_ImportacionForm, "FolioGestionIportacion");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "FolioGestionIportacion");
    // }
    //TERMINA - BRID:4552


    //INICIA - BRID:4567 - Llenar campos de costos de importacion - Autor: Jose Caballero - Actualización: 8/3/2021 12:36:46 PM
    if (this.operation == 'New') {

      this.setCostosImportacion();

    }
    //TERMINA - BRID:4567


    //INICIA - BRID:4570 - OCULTAR FOLIO COSTOS IMPORTACIÓN - Autor: Felipe Rodríguez - Actualización: 8/3/2021 12:54:32 PM
    // if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
    //   this.brf.HideFieldOfForm(this.Costos_de_ImportacionForm, "FolioCostosImportacion");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "FolioCostosImportacion");
    // }
    //TERMINA - BRID:4570


    // //INICIA - BRID:4633 - Asignar no requerido costo de importacion - Autor: ANgel Acuña - Actualización: 8/4/2021 11:11:35 AM
    // if (this.operation == 'New' || this.operation == 'Update') {
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Miscelaneas");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "No__items_asociados");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Transporte");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Costo_flete_");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Tipo_de_Cambio_T");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "No__de_Factura_T");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Fecha_de_Factura_T");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Servicios_Aduanales");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Costo_Servicios_");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Tipo_de_Cambio_SA");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "No__de_Factura_SA");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Fecha_de_Factura_SA");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Impuestos_Aduanales");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Costo_Impuesto_");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Tipo_de_Cambio_IA");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "No__de_Factura_IA");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "No__de_Factura_IA2");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "Clave_de_Pedimento");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "No__de_Pedimento");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "No__de_Guia");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "FolioGestionIportacion");
    //   this.brf.SetNotRequiredControl(this.Costos_de_ImportacionForm, "FolioCostosImportacion");
    // }
    //TERMINA - BRID:4633

    //rulesOnInit_ExecuteBusinessRulesEnd

  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:4636 - Actualizar folio costos de importación - Autor: Felipe Rodríguez - Actualización: 8/4/2021 12:39:23 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery("EXEC ActFoliosCostosImportacion " + this.localStorageHelper.getItemFromLocalStorage("KeyValueInserted") + ", 1, 0", 1, "ABC123");
    }
    //TERMINA - BRID:4636


    //INICIA - BRID:4637 - ACTUALIZAR DETALLE LISTADO DE COMPRAS EN PROCESO (ESTÁ CORREGIDA A MANO) - Autor: Felipe Rodríguez - Actualización: 8/4/2021 12:37:41 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery("EXEC ActFoliosCostosImportacion " + this.localStorageHelper.getItemFromLocalStorage("KeyValueInserted") + ", 2, 0", 1, "ABC123");
    }
    //TERMINA - BRID:4637


    //INICIA - BRID:4638 - ACTUALIZAR DETALLE COMPRAS DE IMPORTACION (ESTÁ CORREGIDA A MANO) - Autor: Felipe Rodríguez - Actualización: 8/4/2021 12:37:17 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery("EXEC ActFoliosCostosImportacion " + this.localStorageHelper.getItemFromLocalStorage("KeyValueInserted") + ", 3, 0", 1, "ABC123");
    }
    //TERMINA - BRID:4638


    //INICIA - BRID:4910 - Actualizar datos de detalle de compras de importación (Cambio manual en reglas de negocio) - Autor: Jose Caballero - Actualización: 8/8/2021 9:13:17 AM
    if (this.operation == 'Update') {
      this.brf.EvaluaQuery(" EXEC sp_update_detalle_de_compras_de_importacion", 1, "ABC123");
    }
    //TERMINA - BRID:4910


    //INICIA - BRID:4935 - Despues de guardar, en editar, abriendo desde pantalla Listado de compras en proceso, actualizar MR de Detalle_de_Compras_de_Importacion, con codigo manual (NO DESACTIVAR) - Autor: Lizeth Villa - Actualización: 8/10/2021 1:04:10 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.EvaluaQuery("EXEC sp_update_Costos_Importacion_A_DetalleComprasImportacion ", 1, "ABC123");
    }
    //TERMINA - BRID:4935

    //rulesAfterSave_ExecuteBusinessRulesEnd


    this.closeWindowSave();


  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas


  setCostosImportacion() {

    //#region Asignar Miscelaneas
    this.sqlModel.query = ` SELECT Miscelanea FROM Gestion_de_importacion WHERE FolioGestiondeImportacion = 5`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.Costos_de_ImportacionForm.controls["Miscelaneas"].setValue(parseInt(response))
      }
    })
    //#endregion

    //#region Asignar No__items_asociados
    this.sqlModel.query = ` SELECT No__Items_asociados FROM Gestion_de_importacion WHERE FolioGestiondeImportacion = 5`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.Costos_de_ImportacionForm.controls["No__items_asociados"].setValue(response)
      }
    })
    //#endregion

    //#region Asignar Transporte
    this.sqlModel.query = ` SELECT Transporte FROM Gestion_de_importacion WHERE FolioGestiondeImportacion = 5`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.Costos_de_ImportacionForm.controls["Transporte"].setValue(parseInt(response))
      }
    })
    //#endregion

    //#region Asignar Servicios_Aduanales
    this.sqlModel.query = ` SELECT Servicio_Aduanales FROM Gestion_de_importacion WHERE FolioGestiondeImportacion = 5`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.Costos_de_ImportacionForm.controls["Servicios_Aduanales"].setValue(parseInt(response))
      }
    })
    //#endregion

    //#region Asignar Clave_de_Pedimento
    this.sqlModel.query = ` SELECT Clave_de_Pedimento FROM Gestion_de_importacion WHERE FolioGestiondeImportacion = 5`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.Costos_de_ImportacionForm.controls["Clave_de_Pedimento"].setValue(response)
      }
    })
    //#endregion

    //#region Asignar No__de_Pedimento
    this.sqlModel.query = ` SELECT No__de_Pedimento FROM Gestion_de_importacion WHERE FolioGestiondeImportacion = 5`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.Costos_de_ImportacionForm.controls["No__de_Pedimento"].setValue(response)
      }
    })
    //#endregion

    //#region Asignar No__de_Guia
    this.sqlModel.query = ` SELECT No__de_Guia FROM Gestion_de_importacion WHERE FolioGestiondeImportacion = 5`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.Costos_de_ImportacionForm.controls["No__de_Guia"].setValue(response)
      }
    })
    //#endregion
  }


}
