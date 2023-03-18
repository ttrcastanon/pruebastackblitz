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
import { Presupuesto_AnualService } from 'src/app/api-services/Presupuesto_Anual.service';
import { Presupuesto_Anual } from 'src/app/models/Presupuesto_Anual';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Presupuesto_Anual',
  templateUrl: './Presupuesto_Anual.component.html',
  styleUrls: ['./Presupuesto_Anual.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Presupuesto_AnualComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }

  Presupuesto_AnualForm: FormGroup;
  public Editor = ClassicEditor;
  model: Presupuesto_Anual;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsEmpresa: Observable<Cliente[]>;
  hasOptionsEmpresa: boolean;
  isLoadingEmpresa: boolean;

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
    private Presupuesto_AnualService: Presupuesto_AnualService,
    private ClienteService: ClienteService,
    private _seguridad: SeguridadService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private _spartanService: SpartanService,
    renderer: Renderer2) {

    this.brf = new BusinessRulesFunctions(renderer, _spartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Presupuesto_Anual(this.fb);
    this.Presupuesto_AnualForm = this.model.buildFormGroup();

    this.Presupuesto_AnualForm.get('Folio').disable();
    this.Presupuesto_AnualForm.get('Folio').setValue('Auto');

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
          this.Presupuesto_AnualForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Presupuesto_Anual)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Presupuesto_AnualForm, 'Empresa', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Presupuesto_AnualService.listaSelAll(0, 1, 'Presupuesto_Anual.Folio=' + id).toPromise();
    if (result.Presupuesto_Anuals.length > 0) {

      this.model.fromObject(result.Presupuesto_Anuals[0]);
      this.Presupuesto_AnualForm.get('Empresa').setValue(
        result.Presupuesto_Anuals[0].Empresa_Cliente,
        { onlySelf: false, emitEvent: true }
      );

      this.Presupuesto_AnualForm.markAllAsTouched();
      this.Presupuesto_AnualForm.updateValueAndValidity();
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
          this.operation = !this.Presupuesto_AnualForm.disabled ? "Update" : this.operation;
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

    this.Presupuesto_AnualForm.get('Empresa').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEmpresa = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.ClienteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.ClienteService.listaSelAll(0, 20, '');
          return this.ClienteService.listaSelAll(0, 20,
            "Cliente.Razon_Social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.ClienteService.listaSelAll(0, 20,
          "Cliente.Razon_Social like '%" + value.Razon_Social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingEmpresa = false;
      this.hasOptionsEmpresa = result?.Clientes?.length > 0;
      //this.Presupuesto_AnualForm.get('Empresa').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });
      this.optionsEmpresa = of(result?.Clientes);
    }, error => {
      this.isLoadingEmpresa = false;
      this.hasOptionsEmpresa = false;
      this.optionsEmpresa = of([]);
    });

  }

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

  displayFnEmpresa(option: Cliente) {
    return option?.Razon_Social;
  }

  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      this.Presupuesto_AnualForm.enable();
      const entity = this.Presupuesto_AnualForm.value;
      entity.Folio = this.model.Folio;
      entity.Empresa = this.Presupuesto_AnualForm.get('Empresa').value?.Clave;

      if (this.model.Folio > 0) {
        await this.Presupuesto_AnualService.update(this.model.Folio, entity).toPromise();

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Presupuesto_AnualService.insert(entity).toPromise().then(async id => {

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
    if (this.model.Folio === 0) {
      this.Presupuesto_AnualForm.reset();
      this.model = new Presupuesto_Anual(this.fb);
      this.Presupuesto_AnualForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Presupuesto_Anual/add']);
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
    this.router.navigate(['/Presupuesto_Anual/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Empresa_ExecuteBusinessRules(): void {
    //Empresa_FieldExecuteBusinessRulesEnd
  }
  Ano_en_curso_ExecuteBusinessRules(): void {
    let Ano_en_curso = this.Presupuesto_AnualForm.controls["Ano_en_curso"].value
    if (Ano_en_curso < 0) {
      let year = new Date().getFullYear();
      this.Presupuesto_AnualForm.controls["Ano_en_curso"].setValue(year)
    }
    //Ano_en_curso_FieldExecuteBusinessRulesEnd
  }
  Monto_Pres__Inicial_Ano_ExecuteBusinessRules(): void {
    //Monto_Pres__Inicial_Ano_FieldExecuteBusinessRulesEnd
  }
  Porcentaje_Pres__Ano_ExecuteBusinessRules(): void {
    //Porcentaje_Pres__Ano_FieldExecuteBusinessRulesEnd
  }
  Gasto_Real_Facturado_ExecuteBusinessRules(): void {
    //Gasto_Real_Facturado_FieldExecuteBusinessRulesEnd
  }
  Pto__Estimado_acumulado_ExecuteBusinessRules(): void {
    //Pto__Estimado_acumulado_FieldExecuteBusinessRulesEnd
  }
  Porcentaje_Estimado_Acumulado_ExecuteBusinessRules(): void {
    //Porcentaje_Estimado_Acumulado_FieldExecuteBusinessRulesEnd
  }
  Porcentaje_Gasto_Real_Acumulado_ExecuteBusinessRules(): void {
    //Porcentaje_Gasto_Real_Acumulado_FieldExecuteBusinessRulesEnd
  }
  Porcentaje_Diferencia_ExecuteBusinessRules(): void {
    //Porcentaje_Diferencia_FieldExecuteBusinessRulesEnd
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

    //BRID:4196 - acomodo de campos y ocultar folios  - Autor: Agustín Administrador - Actualización: 8/19/2021 5:55:27 PM
    this.brf.HideFieldOfForm(this.Presupuesto_AnualForm, "Folio");

  }

  rulesOnInit() {
    //rulesOnInit_ExecuteBusinessRulesInit

    //BRID:4542 - Deshabilitar campos Presupuesto_Anual - Autor: Agustín Administrador - Actualización: 7/29/2021 3:57:07 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.Presupuesto_AnualForm.controls['Porcentaje_Pres__Ano'].disable()
      this.Presupuesto_AnualForm.controls['Gasto_Real_Facturado'].disable()
      this.Presupuesto_AnualForm.controls['Pto__Estimado_acumulado'].disable()
      this.Presupuesto_AnualForm.controls['Porcentaje_Estimado_Acumulado'].disable()
      this.Presupuesto_AnualForm.controls['Porcentaje_Gasto_Real_Acumulado'].disable()
      this.Presupuesto_AnualForm.controls['Porcentaje_Diferencia'].disable()
    }


    //rulesOnInit_ExecuteBusinessRulesEnd

  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:5250 - Actualizar el porcentaje del presupuesto anual - Autor: Aaron - Actualización: 8/24/2021 2:09:18 PM
    if (this.operation == 'Update') {
      this.brf.EvaluaQuery(" EXEC Update_Porcentajes_Pres_Ano", 1, "ABC123");
    }
    //TERMINA - BRID:5250
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

  maxDigits(value: any, max: number): boolean {
    if (value.substring(value.length - 3, value.length - 2) == ".") {
      max = max + 3
    }

    if (value.replaceAll(",", "").length > (max - 1)) {
      return false;
    }
    return true;
  }



}
