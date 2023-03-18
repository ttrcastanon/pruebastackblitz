import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/api-services/general.service';
import { Gestion_de_ImportacionService } from 'src/app/api-services/Gestion_de_Importacion.service';
import { Gestion_de_Importacion } from 'src/app/models/Gestion_de_Importacion';
import { Tipo_de_TransporteService } from 'src/app/api-services/Tipo_de_Transporte.service';
import { Tipo_de_Transporte } from 'src/app/models/Tipo_de_Transporte';
import { Tipo_de_MiscelaneasService } from 'src/app/api-services/Tipo_de_Miscelaneas.service';
import { Tipo_de_Miscelaneas } from 'src/app/models/Tipo_de_Miscelaneas';
import { Servicios_AduanalesService } from 'src/app/api-services/Servicios_Aduanales.service';
import { Servicios_Aduanales } from 'src/app/models/Servicios_Aduanales';

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
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Gestion_de_Importacion',
  templateUrl: './Gestion_de_Importacion.component.html',
  styleUrls: ['./Gestion_de_Importacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Gestion_de_ImportacionComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Gestion_de_ImportacionForm: FormGroup;
  public Editor = ClassicEditor;
  model: Gestion_de_Importacion;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varTipo_de_Transporte: Tipo_de_Transporte[] = [];
  public varTipo_de_Miscelaneas: Tipo_de_Miscelaneas[] = [];
  public varServicios_Aduanales: Servicios_Aduanales[] = [];

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
  fromGestion_de_aprobacion: any

  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Gestion_de_ImportacionService: Gestion_de_ImportacionService,
    private Tipo_de_TransporteService: Tipo_de_TransporteService,
    private Tipo_de_MiscelaneasService: Tipo_de_MiscelaneasService,
    private Servicios_AduanalesService: Servicios_AduanalesService,
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
    this.fromGestion_de_aprobacion = this.localStorageHelper.getItemFromLocalStorage("IsResetGestion_de_aprobacion") == "0" ? true : false

    this.model = new Gestion_de_Importacion(this.fb);
    this.Gestion_de_ImportacionForm = this.model.buildFormGroup();

    this.Gestion_de_ImportacionForm.get('Folio').disable();
    this.Gestion_de_ImportacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {

        this.Gestion_de_ImportacionForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Gestion_de_Importacion).subscribe((response) => {
      this.permisos = response;
    });

  }

  async populateModel(id: number) {
    this.spinner.show('loading');
    let result = await this.Gestion_de_ImportacionService.listaSelAll(0, 1, 'Gestion_de_Importacion.Folio=' + id).toPromise();

    if (result.Gestion_de_Importacions.length > 0) {
      this.model.fromObject(result.Gestion_de_Importacions[0]);
      this.Gestion_de_ImportacionForm.markAllAsTouched();
      this.Gestion_de_ImportacionForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Gestion_de_ImportacionForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_de_TransporteService.getAll());
    observablesArray.push(this.Tipo_de_MiscelaneasService.getAll());
    observablesArray.push(this.Servicios_AduanalesService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varTipo_de_Transporte, varTipo_de_Miscelaneas, varServicios_Aduanales]) => {
          this.varTipo_de_Transporte = varTipo_de_Transporte;
          this.varTipo_de_Miscelaneas = varTipo_de_Miscelaneas;
          this.varServicios_Aduanales = varServicios_Aduanales;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }
  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Transporte': {
        this.Tipo_de_TransporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Transporte = x.Tipo_de_Transportes;
        });
        break;
      }
      case 'Miscelanea': {
        this.Tipo_de_MiscelaneasService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Miscelaneas = x.Tipo_de_Miscelaneass;
        });
        break;
      }
      case 'Servicio_Aduanales': {
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

  async save() {
    const res = await this.saveData();

  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    try {
      if (this.rulesBeforeSave()) {
        const entity = this.Gestion_de_ImportacionForm.value;
        entity.Folio = this.model.Folio;

        if (this.model.Folio > 0) {
          await this.Gestion_de_ImportacionService.update(this.model.Folio, entity).toPromise().then(async id => {
            this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());

            this.spinner.hide('loading');

            this.rulesAfterSave();

            return this.model.Folio;
          });

        } else {
          await (this.Gestion_de_ImportacionService.insert(entity).toPromise().then(async id => {

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

        this.isLoading = false;
        this.spinner.hide('loading');
      } else {
        this.isLoading = false;
        this.spinner.hide('loading');
        return false;
      }
    } catch (error) {
      this.snackBar.open('Error al querer guardar', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'error'
      });

      this.rulesAfterSave();
      this.isLoading = false;
      this.spinner.hide('loading');

      return false
    }

    return true
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Gestion_de_ImportacionForm.reset();
      this.model = new Gestion_de_Importacion(this.fb);
      this.Gestion_de_ImportacionForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Gestion_de_Importacion/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;
  }

  cancel() {
    let Reset = this.localStorageHelper.getItemFromLocalStorage("IsResetGestion_de_aprobacion");

    if (Reset == "0") {
      this.localStorageHelper.setItemToLocalStorage("IsResetGestion_de_aprobacion", "1");
      window.close();
    } else {
      this.goToList();
    }

  }

  goToList() {
    this.router.navigate(['/Gestion_de_Importacion/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  No__Items_asociados_ExecuteBusinessRules(): void { /*No__Items_asociados_FieldExecuteBusinessRulesEnd*/ }
  Transporte_ExecuteBusinessRules(): void { /*Transporte_FieldExecuteBusinessRulesEnd*/ }
  Clave_de_Pedimento_ExecuteBusinessRules(): void { /*Clave_de_Pedimento_FieldExecuteBusinessRulesEnd*/ }
  No__de_Pedimento_ExecuteBusinessRules(): void { /*No__de_Pedimento_FieldExecuteBusinessRulesEnd*/ }
  Miscelanea_ExecuteBusinessRules(): void { /*Miscelanea_FieldExecuteBusinessRulesEnd*/ }
  No__de_Guia_ExecuteBusinessRules(): void { /*No__de_Guia_FieldExecuteBusinessRulesEnd*/ }
  Servicio_Aduanales_ExecuteBusinessRules(): void { /*Servicio_Aduanales_FieldExecuteBusinessRulesEnd*/ }
  FolioGestiondeImportacion_ExecuteBusinessRules(): void { /*FolioGestiondeImportacion_FieldExecuteBusinessRulesEnd*/ }

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

    //INICIA - BRID:4104 - Ocultar a asignar no requeridos simpre - Autor: Lizeth Villa - Actualización: 7/15/2021 7:23:28 PM
    this.brf.HideFieldOfForm(this.Gestion_de_ImportacionForm, "Folio");
    this.brf.SetNotRequiredControl(this.Gestion_de_ImportacionForm, "Folio");
    this.brf.HideFieldOfForm(this.Gestion_de_ImportacionForm, "FolioGestiondeImportacion");
    this.brf.SetNotRequiredControl(this.Gestion_de_ImportacionForm, "FolioGestiondeImportacion");
    this.brf.SetNotRequiredControl(this.Gestion_de_ImportacionForm, "FolioGestiondeImportacion");
    //TERMINA - BRID:4104


    //INICIA - BRID:4978 - Asignar vacio a FolioGestiondeImportacion - Autor: Jose Caballero - Actualización: 8/12/2021 8:41:48 PM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.Gestion_de_ImportacionForm, "FolioGestiondeImportacion", "");
    }
    //TERMINA - BRID:4978

    //rulesOnInit_ExecuteBusinessRulesEnd
  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    let KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)
    let IdFolioDetalle = this.localStorageHelper.getItemFromLocalStorage("IdFolioDetalle")

    //INICIA - BRID:4108 - asignar folio gestionimportacion despues de guardar - Autor: Lizeth Villa - Actualización: 7/12/2021 7:52:11 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(`UPDATE Gestion_de_Importacion SET FolioGestiondeImportacion = FOLIO WHERE FOLIO = ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4108

    //INICIA - BRID:4109 - Asignar IdImportacion a Detalle_de_Gestion_de_aprobacion con codigo manual (no desactivar) - Autor: ANgel Acuña - Actualización: 8/6/2021 5:40:39 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(` UPDATE Detalle_de_Gestion_de_aprobacion SET IdImportacion = ${KeyValueInserted} WHERE IdFolioDetalle = ${IdFolioDetalle} `, 1, "ABC123");
    }
    //TERMINA - BRID:4109

    //INICIA - BRID:4565 - Insert en MR Detalle_de_Compras_en_importacion - Autor: Jose Caballero - Actualización: 8/3/2021 1:32:53 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(` EXEC usp_InsDetalle_de_Compras_de_importacion ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4565
   
    
    setTimeout(() => {
      this.cancel()
    }, 2000);

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
