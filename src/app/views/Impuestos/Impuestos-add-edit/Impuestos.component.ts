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
import { Router, ActivatedRoute } from '@angular/router';

import { GeneralService } from 'src/app/api-services/general.service';
import { ImpuestosService } from 'src/app/api-services/Impuestos.service';
import { Impuestos } from 'src/app/models/Impuestos';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Impuestos',
  templateUrl: './Impuestos.component.html',
  styleUrls: ['./Impuestos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ImpuestosComponent implements OnInit, AfterViewInit {

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  ImpuestosForm: FormGroup;
  public Editor = ClassicEditor;
  model: Impuestos;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;

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
    private ImpuestosService: ImpuestosService,

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

    this.model = new Impuestos(this.fb);
    this.ImpuestosForm = this.model.buildFormGroup();

    this.ImpuestosForm.get('Folio').disable();
    this.ImpuestosForm.get('Folio').setValue('Auto');
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

          this.ImpuestosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Impuestos)
      .subscribe((response) => {
        this.permisos = response;
      });

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.ImpuestosService.listaSelAll(0, 1, 'Impuestos.Folio=' + id).toPromise();
    if (result.Impuestoss.length > 0) {
      result.Impuestoss[0].Hora_ultima_modificacion =
        result.Impuestoss[0].Hora_ultima_modificacion == null ? result.Impuestoss[0].Fecha_ultima_modificacion.substring(11) : result.Impuestoss[0].Hora_ultima_modificacion;
      this.model.fromObject(result.Impuestoss[0]);

      this.ImpuestosForm.markAllAsTouched();
      this.ImpuestosForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
    this.rulesOnInit();
  }

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.ImpuestosForm.disabled ? "Update" : this.operation;
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


  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.ImpuestosForm.value;
      entity.Folio = this.model.Folio;
      entity.Fecha_ultima_modificacion = new Date();
      entity.Hora_ultima_modificacion = this.ImpuestosForm.get('Hora_ultima_modificacion').value;

      if (this.model.Folio > 0) {
        await this.ImpuestosService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        this.rulesAfterSave();

        return this.model.Folio;
      } else {
        await (this.ImpuestosService.insert(entity).toPromise().then(async id => {

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
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.ImpuestosForm.reset();
      this.model = new Impuestos(this.fb);
      this.ImpuestosForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Impuestos/add']);
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
    this.router.navigate(['/Impuestos/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  IVA_Nacional_ExecuteBusinessRules(): void {
    //IVA_Nacional_FieldExecuteBusinessRulesEnd
  }
  IVA_Internacional_ExecuteBusinessRules(): void {
    //IVA_Internacional_FieldExecuteBusinessRulesEnd
  }
  IVA_Frontera_ExecuteBusinessRules(): void {
    //IVA_Frontera_FieldExecuteBusinessRulesEnd
  }
  TUA_Nacional_ExecuteBusinessRules(): void {
    //TUA_Nacional_FieldExecuteBusinessRulesEnd
  }
  TUA_Internacional_ExecuteBusinessRules(): void {
    //TUA_Internacional_FieldExecuteBusinessRulesEnd
  }
  Cargos_por_vuelo_internacional_ExecuteBusinessRules(): void {
    //Cargos_por_vuelo_internacional_FieldExecuteBusinessRulesEnd
  }
  Derechos_por_servicios_migratorios_ExecuteBusinessRules(): void {
    //Derechos_por_servicios_migratorios_FieldExecuteBusinessRulesEnd
  }
  Fecha_ultima_modificacion_ExecuteBusinessRules(): void {
    //Fecha_ultima_modificacion_FieldExecuteBusinessRulesEnd
  }
  Hora_ultima_modificacion_ExecuteBusinessRules(): void {
    //Hora_ultima_modificacion_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:4201 - acomodar campos y ocultar folio impuestos  - Autor: Yamir - Actualización: 8/11/2021 5:03:44 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.ImpuestosForm, "Folio");
      this.brf.SetNotRequiredControl(this.ImpuestosForm, "Folio");
    }
    //TERMINA - BRID:4201


    //INICIA - BRID:4957 - deshabilitar campos y asignar valores por default - Autor: Yamir - Actualización: 8/11/2021 5:25:53 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetCurrentDateToField(this.ImpuestosForm, 'Fecha_ultima_modificacion');
      this.brf.SetCurrentHourToField(this.ImpuestosForm, 'Hora_ultima_modificacion');
      this.ImpuestosForm.get('Fecha_ultima_modificacion').disable();
      this.ImpuestosForm.get('Hora_ultima_modificacion').disable();
    }
    //TERMINA - BRID:4957

    //rulesOnInit_ExecuteBusinessRulesEnd
  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    this.goToList();
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
