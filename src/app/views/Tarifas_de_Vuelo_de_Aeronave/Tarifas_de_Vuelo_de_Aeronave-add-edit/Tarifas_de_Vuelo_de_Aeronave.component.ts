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
import { Tarifas_de_Vuelo_de_AeronaveService } from 'src/app/api-services/Tarifas_de_Vuelo_de_Aeronave.service';
import { Tarifas_de_Vuelo_de_Aeronave } from 'src/app/models/Tarifas_de_Vuelo_de_Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { MonedaService } from 'src/app/api-services/Moneda.service';
import { Moneda } from 'src/app/models/Moneda';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Tarifas_de_Vuelo_de_Aeronave',
  templateUrl: './Tarifas_de_Vuelo_de_Aeronave.component.html',
  styleUrls: ['./Tarifas_de_Vuelo_de_Aeronave.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Tarifas_de_Vuelo_de_AeronaveComponent implements OnInit, AfterViewInit {

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Tarifas_de_Vuelo_de_AeronaveForm: FormGroup;
  public Editor = ClassicEditor;
  model: Tarifas_de_Vuelo_de_Aeronave;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  public varMoneda: Moneda[] = [];

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
    private Tarifas_de_Vuelo_de_AeronaveService: Tarifas_de_Vuelo_de_AeronaveService,
    private AeronaveService: AeronaveService,
    private MonedaService: MonedaService,
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

    this.model = new Tarifas_de_Vuelo_de_Aeronave(this.fb);
    this.Tarifas_de_Vuelo_de_AeronaveForm = this.model.buildFormGroup();

    this.Tarifas_de_Vuelo_de_AeronaveForm.get('Folio').disable();
    this.Tarifas_de_Vuelo_de_AeronaveForm.get('Folio').setValue('Auto');
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

        this.Tarifas_de_Vuelo_de_AeronaveForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Tarifas_de_Vuelo_de_Aeronave).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Tarifas_de_Vuelo_de_AeronaveForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Tarifas_de_Vuelo_de_AeronaveService.listaSelAll(0, 1, 'Tarifas_de_Vuelo_de_Aeronave.Folio=' + id).toPromise();
    if (result.Tarifas_de_Vuelo_de_Aeronaves.length > 0) {

      this.model.fromObject(result.Tarifas_de_Vuelo_de_Aeronaves[0]);

      this.Tarifas_de_Vuelo_de_AeronaveForm.get('Tarifa_Normal').setValue(result.Tarifas_de_Vuelo_de_Aeronaves[0].Tarifa_Normal.toFixed(2))
      this.Tarifas_de_Vuelo_de_AeronaveForm.get('Tarifa_Reducida').setValue(result.Tarifas_de_Vuelo_de_Aeronaves[0].Tarifa_Reducida.toFixed(2))
      this.Tarifas_de_Vuelo_de_AeronaveForm.get('Tarifa_en_Espera').setValue(result.Tarifas_de_Vuelo_de_Aeronaves[0].Tarifa_en_Espera.toFixed(2))
      this.Tarifas_de_Vuelo_de_AeronaveForm.get('Percnota').setValue(result.Tarifas_de_Vuelo_de_Aeronaves[0].Percnota.toFixed(2))


      this.Tarifas_de_Vuelo_de_AeronaveForm.get('Matricula').setValue(
        result.Tarifas_de_Vuelo_de_Aeronaves[0].Matricula_Aeronave,
        { onlySelf: false, emitEvent: true }
      );

      this.Tarifas_de_Vuelo_de_AeronaveForm.markAllAsTouched();
      this.Tarifas_de_Vuelo_de_AeronaveForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Tarifas_de_Vuelo_de_AeronaveForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.MonedaService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varMoneda]) => {
          this.varMoneda = varMoneda;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Tarifas_de_Vuelo_de_AeronaveForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeronaveService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeronaveService.listaSelAll(0, 20, '');
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Matricula like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeronaveService.listaSelAll(0, 20,
          "Aeronave.Matricula like '%" + value.Matricula.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = result?.Aeronaves?.length > 0;
      //this.Tarifas_de_Vuelo_de_AeronaveForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Moneda': {
        this.MonedaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varMoneda = x.Monedas;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }


  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      this.Tarifas_de_Vuelo_de_AeronaveForm.enable();
      const entity = this.Tarifas_de_Vuelo_de_AeronaveForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Tarifas_de_Vuelo_de_AeronaveForm.get('Matricula').value.Matricula;
      entity.Ultima_Modificacion = this.Tarifas_de_Vuelo_de_AeronaveForm.get('Ultima_Modificacion').value;
      entity.Hora_de_ultima_modificacion = this.Tarifas_de_Vuelo_de_AeronaveForm.get('Hora_de_ultima_modificacion').value;

      if (this.model.Folio > 0) {
        await this.Tarifas_de_Vuelo_de_AeronaveService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Tarifas_de_Vuelo_de_AeronaveService.insert(entity).toPromise().then(async id => {

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
      this.Tarifas_de_Vuelo_de_AeronaveForm.reset();
      this.model = new Tarifas_de_Vuelo_de_Aeronave(this.fb);
      this.Tarifas_de_Vuelo_de_AeronaveForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Tarifas_de_Vuelo_de_Aeronave/add']);
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
    this.router.navigate(['/Tarifas_de_Vuelo_de_Aeronave/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Matricula_ExecuteBusinessRules(): void {

    //INICIA - BRID:4954 - Validar que la matricula no cuente con una tarifa - Autor: Aaron - Actualización: 8/11/2021 3:14:02 PM
    if (this.brf.EvaluaQuery("Select count(Folio) From Tarifas_de_Vuelo_de_Aeronave Where Matricula = 'FLD[Matricula]'", 1, 'ABC123') > this.brf.TryParseInt('0', '0')) {
      this.brf.ShowMessage(" La matrícula seleccionada ya cuenta con una tarifa establecida. Ingrese una matrícula diferente.");
      this.brf.SetValueFromQuery(this.Tarifas_de_Vuelo_de_AeronaveForm, "Matricula", this.brf.EvaluaQuery(" Select ''", 1, "ABC123"), 1, "ABC123");
    } else { }
    //TERMINA - BRID:4954

    //Matricula_FieldExecuteBusinessRulesEnd

  }
  Tarifa_Normal_ExecuteBusinessRules(): void {
    console.log("change")

    let Tarifa_Normal = this.Tarifas_de_Vuelo_de_AeronaveForm.controls["Tarifa_Normal"].value
    this.Tarifas_de_Vuelo_de_AeronaveForm.controls["Tarifa_Normal"].setValue(Number.parseFloat(Tarifa_Normal).toFixed(2))

    //Tarifa_Normal_FieldExecuteBusinessRulesEnd
  }
  soloFecha(e) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
    const keyPressed = e.key;

    if (!allowedKeys.includes(keyPressed)) {
      e.preventDefault();
      return;
    }
    if (e.target.value.length >= 10) {
      e.preventDefault();
      return;
    }
  }
  maxDigits(value: any, max: number): boolean {
    if (value.substring(value.length - 3, value.length - 2) == ".") {
      max = max + 3
    }

    if (value.replaceAll(",", "").length > (max - 1)) {
      return false;
    }
    return true;
  }

  Tarifa_Reducida_ExecuteBusinessRules(): void {
    let Tarifa_Reducida = this.Tarifas_de_Vuelo_de_AeronaveForm.controls["Tarifa_Reducida"].value
    this.Tarifas_de_Vuelo_de_AeronaveForm.controls["Tarifa_Reducida"].setValue(Number.parseFloat(Tarifa_Reducida).toFixed(2))
    //Tarifa_Reducida_FieldExecuteBusinessRulesEnd
  }
  Tarifa_en_Espera_ExecuteBusinessRules(): void {
    let Tarifa_en_Espera = this.Tarifas_de_Vuelo_de_AeronaveForm.controls["Tarifa_en_Espera"].value
    this.Tarifas_de_Vuelo_de_AeronaveForm.controls["Tarifa_en_Espera"].setValue(Number.parseFloat(Tarifa_en_Espera).toFixed(2))
    //Tarifa_en_Espera_FieldExecuteBusinessRulesEnd
  }
  Percnota_ExecuteBusinessRules(): void {
    let Percnota = this.Tarifas_de_Vuelo_de_AeronaveForm.controls["Percnota"].value
    this.Tarifas_de_Vuelo_de_AeronaveForm.controls["Percnota"].setValue(Number.parseFloat(Percnota).toFixed(2))
    //Percnota_FieldExecuteBusinessRulesEnd
  }
  Moneda_ExecuteBusinessRules(): void {
    //Moneda_FieldExecuteBusinessRulesEnd
  }
  Ultima_Modificacion_ExecuteBusinessRules(): void {
    //Ultima_Modificacion_FieldExecuteBusinessRulesEnd
  }
  Hora_de_ultima_modificacion_ExecuteBusinessRules(): void {
    //Hora_de_ultima_modificacion_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:4200 - acomodo de campos y ocultar folio - Autor: Aaron - Actualización: 8/11/2021 3:05:46 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.Tarifas_de_Vuelo_de_AeronaveForm, "Folio");
      this.brf.SetNotRequiredControl(this.Tarifas_de_Vuelo_de_AeronaveForm, "Folio");
      this.brf.SetEnabledControl(this.Tarifas_de_Vuelo_de_AeronaveForm, 'Ultima_Modificacion', 0);
      this.brf.SetEnabledControl(this.Tarifas_de_Vuelo_de_AeronaveForm, 'Hora_de_ultima_modificacion', 0);
    }
    //TERMINA - BRID:4200


    //INICIA - BRID:4955 - Deshabilitar matrícula al editar - Autor: Aaron - Actualización: 8/11/2021 3:27:49 PM
    if (this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Tarifas_de_Vuelo_de_AeronaveForm, 'Matricula', 0);
    }
    //TERMINA - BRID:4955


    //INICIA - BRID:4956 - asignar fecha crear nuevo y al editar por fefault - Autor: Yamir - Actualización: 8/11/2021 5:18:39 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetCurrentDateToField(this.Tarifas_de_Vuelo_de_AeronaveForm, 'Ultima_Modificacion');
      this.brf.SetCurrentHourToField(this.Tarifas_de_Vuelo_de_AeronaveForm, 'Hora_de_ultima_modificacion');
    }
    //TERMINA - BRID:4956

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

    //INICIA - BRID:4953 - Guardar Fecha y hora de ultima actualización  - Autor: Aaron - Actualización: 8/11/2021 3:08:03 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetCurrentDateToField(this.Tarifas_de_Vuelo_de_AeronaveForm, 'Ultima_Modificacion');
      this.brf.SetCurrentHourToField(this.Tarifas_de_Vuelo_de_AeronaveForm, 'Hora_de_ultima_modificacion');
    }
    //TERMINA - BRID:4953

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas

}
