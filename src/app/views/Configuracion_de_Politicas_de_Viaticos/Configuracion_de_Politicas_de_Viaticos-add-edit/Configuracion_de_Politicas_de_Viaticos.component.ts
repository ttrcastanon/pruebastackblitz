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
import { Configuracion_de_Politicas_de_ViaticosService } from 'src/app/api-services/Configuracion_de_Politicas_de_Viaticos.service';
import { Configuracion_de_Politicas_de_Viaticos } from 'src/app/models/Configuracion_de_Politicas_de_Viaticos';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Tipo_de_vueloService } from 'src/app/api-services/Tipo_de_vuelo.service';
import { Tipo_de_vuelo } from 'src/app/models/Tipo_de_vuelo';
import { Concepto_de_Gasto_de_EmpleadoService } from 'src/app/api-services/Concepto_de_Gasto_de_Empleado.service';
import { Concepto_de_Gasto_de_Empleado } from 'src/app/models/Concepto_de_Gasto_de_Empleado';
import { Detalle_Configuracion_de_Politicas_de_ViaticosService } from 'src/app/api-services/Detalle_Configuracion_de_Politicas_de_Viaticos.service';
import { Detalle_Configuracion_de_Politicas_de_Viaticos } from 'src/app/models/Detalle_Configuracion_de_Politicas_de_Viaticos';
import { Tipo_de_DestinoService } from 'src/app/api-services/Tipo_de_Destino.service';
import { Tipo_de_Destino } from 'src/app/models/Tipo_de_Destino';
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
import { element } from 'protractor';

@Component({
  selector: 'app-Configuracion_de_Politicas_de_Viaticos',
  templateUrl: './Configuracion_de_Politicas_de_Viaticos.component.html',
  styleUrls: ['./Configuracion_de_Politicas_de_Viaticos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Configuracion_de_Politicas_de_ViaticosComponent implements OnInit, AfterViewInit {
MRaddDetalle: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Configuracion_de_Politicas_de_ViaticosForm: FormGroup;
  public Editor = ClassicEditor;
  model: Configuracion_de_Politicas_de_Viaticos;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsUsuario_que_Modifica: Observable<Spartan_User[]>;
  hasOptionsUsuario_que_Modifica: boolean;
  isLoadingUsuario_que_Modifica: boolean;
  public varTipo_de_vuelo: Tipo_de_vuelo[] = [];
  public varConcepto_de_Gasto_de_Empleado: Concepto_de_Gasto_de_Empleado[] = [];
  public varTipo_de_Destino: Tipo_de_Destino[] = [];
  public varMoneda: Moneda[] = [];
  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceDetalle = new MatTableDataSource<Detalle_Configuracion_de_Politicas_de_Viaticos>();
  DetalleColumns = [
    { def: 'actions', hide: false },
    { def: 'Tipo_de_Destino', hide: false },
    { def: 'Monto_Diario_Autorizado', hide: false },
    { def: 'Tipo_de_Moneda', hide: false },

  ];
  DetalleData: Detalle_Configuracion_de_Politicas_de_Viaticos[] = [];

  today = new Date;
  consult: boolean = false;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }


  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Configuracion_de_Politicas_de_ViaticosService: Configuracion_de_Politicas_de_ViaticosService,
    private Spartan_UserService: Spartan_UserService,
    private Tipo_de_vueloService: Tipo_de_vueloService,
    private Concepto_de_Gasto_de_EmpleadoService: Concepto_de_Gasto_de_EmpleadoService,
    private Detalle_Configuracion_de_Politicas_de_ViaticosService: Detalle_Configuracion_de_Politicas_de_ViaticosService,
    private Tipo_de_DestinoService: Tipo_de_DestinoService,
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
    this.model = new Configuracion_de_Politicas_de_Viaticos(this.fb);

    this.Configuracion_de_Politicas_de_ViaticosForm = this.model.buildFormGroup();
    this.DetalleItems.removeAt(0);

    this.Configuracion_de_Politicas_de_ViaticosForm.get('Folio').disable();
    this.Configuracion_de_Politicas_de_ViaticosForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceDetalle.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.DetalleColumns.splice(0, 1);

          this.Configuracion_de_Politicas_de_ViaticosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Configuracion_de_Politicas_de_Viaticos)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Configuracion_de_Politicas_de_ViaticosForm, 'Usuario_que_Modifica', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Configuracion_de_Politicas_de_ViaticosService.listaSelAll(0, 1, 'Configuracion_de_Politicas_de_Viaticos.Folio=' + id).toPromise();
    if (result.Configuracion_de_Politicas_de_Viaticoss.length > 0) {
      let fDetalle = await this.Detalle_Configuracion_de_Politicas_de_ViaticosService.listaSelAll(0, 1000, 'Configuracion_de_Politicas_de_Viaticos.Folio=' + id).toPromise();
      this.DetalleData = fDetalle.Detalle_Configuracion_de_Politicas_de_Viaticoss;
      this.loadDetalle(fDetalle.Detalle_Configuracion_de_Politicas_de_Viaticoss);
      this.dataSourceDetalle = new MatTableDataSource(fDetalle.Detalle_Configuracion_de_Politicas_de_Viaticoss);
      this.dataSourceDetalle.paginator = this.paginator;
      this.dataSourceDetalle.sort = this.sort;

      this.model.fromObject(result.Configuracion_de_Politicas_de_Viaticoss[0]);
      this.setUsuario_que_Modifica()
      /* this.Configuracion_de_Politicas_de_ViaticosForm.get('Usuario_que_Modifica').setValue(
        result.Configuracion_de_Politicas_de_Viaticoss[0].Usuario_que_Modifica_Spartan_User.Name,
        { onlySelf: false, emitEvent: true }
      ); */

      this.Configuracion_de_Politicas_de_ViaticosForm.markAllAsTouched();
      this.Configuracion_de_Politicas_de_ViaticosForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get DetalleItems() {
    return this.Configuracion_de_Politicas_de_ViaticosForm.get('Detalle_Configuracion_de_Politicas_de_ViaticosItems') as FormArray;
  }

  getDetalleColumns(): string[] {
    return this.DetalleColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadDetalle(Detalle: Detalle_Configuracion_de_Politicas_de_Viaticos[]) {
    Detalle.forEach(element => {
      this.addDetalle(element);
    });
  }

  addDetalleToMR() {
    const Detalle = new Detalle_Configuracion_de_Politicas_de_Viaticos(this.fb);
    this.DetalleData.push(this.addDetalle(Detalle));
    this.dataSourceDetalle.data = this.DetalleData;
    Detalle.edit = true;
    Detalle.isNew = true;
    const length = this.dataSourceDetalle.data.length;
    const index = length - 1;
    const formDetalle = this.DetalleItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceDetalle.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addDetalle(entity: Detalle_Configuracion_de_Politicas_de_Viaticos) {
    const Detalle = new Detalle_Configuracion_de_Politicas_de_Viaticos(this.fb);
    this.DetalleItems.push(Detalle.buildFormGroup());
    if (entity) {
      Detalle.fromObject(entity);
    }
    return entity;
  }

  DetalleItemsByFolio(Folio: number): FormGroup {
    return (this.Configuracion_de_Politicas_de_ViaticosForm.get('Detalle_Configuracion_de_Politicas_de_ViaticosItems') as FormArray).controls.find(c => c.get('Clave').value === Folio) as FormGroup;
  }

  DetalleItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceDetalle.data.indexOf(element);
    let fb = this.DetalleItems.controls[index] as FormGroup;
    return fb;
  }

  deleteDetalle(element: any) {
    let index = this.dataSourceDetalle.data.indexOf(element);
    this.DetalleData[index].IsDeleted = true;
    this.dataSourceDetalle.data = this.DetalleData;
    this.dataSourceDetalle._updateChangeSubscription();
    index = this.dataSourceDetalle.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditDetalle(element: any) {
    let index = this.dataSourceDetalle.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.DetalleData[index].IsDeleted = true;
      this.dataSourceDetalle.data = this.DetalleData;
      this.dataSourceDetalle._updateChangeSubscription();
      index = this.DetalleData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveDetalle(element: any) {
    const index = this.dataSourceDetalle.data.indexOf(element);
    const formDetalle = this.DetalleItems.controls[index] as FormGroup;
    this.DetalleData[index].Tipo_de_Destino = formDetalle.value.Tipo_de_Destino;
    this.DetalleData[index].Tipo_de_Destino_Tipo_de_Destino = formDetalle.value.Tipo_de_Destino !== '' ?
      this.varTipo_de_Destino.filter(d => d.Clave === formDetalle.value.Tipo_de_Destino)[0] : null;
    this.DetalleData[index].Monto_Diario_Autorizado = formDetalle.value.Monto_Diario_Autorizado;
    this.DetalleData[index].Tipo_de_Moneda = formDetalle.value.Tipo_de_Moneda;
    this.DetalleData[index].Tipo_de_Moneda_Moneda = formDetalle.value.Tipo_de_Moneda !== '' ?
      this.varMoneda.filter(d => d.Clave === formDetalle.value.Tipo_de_Moneda)[0] : null;

    this.DetalleData[index].isNew = false;
    this.dataSourceDetalle.data = this.DetalleData;
    this.dataSourceDetalle._updateChangeSubscription();
  }

  editDetalle(element: any) {
    const index = this.dataSourceDetalle.data.indexOf(element);
    const formDetalle = this.DetalleItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Configuracion_de_Politicas_de_Viaticos(Folio: number) {
    this.dataSourceDetalle.data.forEach(async (d, index) => {
      const data = this.DetalleItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Configuracion_de_Politicas_de_Viaticos = Folio;
      model.ID_Configuracion = Folio;

      if (model.Clave === 0) {
        // Add Detalle
        let response = await this.Detalle_Configuracion_de_Politicas_de_ViaticosService.insert(model).toPromise();
      } else if (model.Clave > 0 && !d.IsDeleted) {
        const formDetalle = this.DetalleItemsByFolio(model.Clave);
        if (formDetalle.dirty) {
          // Update Detalle
          let response = await this.Detalle_Configuracion_de_Politicas_de_ViaticosService.update(model.Clave, model).toPromise();
        }
      } else if (model.Clave > 0 && d.IsDeleted) {
        // delete Detalle
        await this.Detalle_Configuracion_de_Politicas_de_ViaticosService.delete(model.Clave).toPromise();
      }
    });
  }


  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Configuracion_de_Politicas_de_ViaticosForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_de_vueloService.getAll());
    observablesArray.push(this.Concepto_de_Gasto_de_EmpleadoService.getAll());
    observablesArray.push(this.Tipo_de_DestinoService.getAll());
    observablesArray.push(this.MonedaService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varTipo_de_vuelo, varConcepto_de_Gasto_de_Empleado, varTipo_de_Destino, varMoneda]) => {
          this.varTipo_de_vuelo = varTipo_de_vuelo;
          this.varConcepto_de_Gasto_de_Empleado = varConcepto_de_Gasto_de_Empleado;
          this.varTipo_de_Destino = varTipo_de_Destino;
          this.varMoneda = varMoneda;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Configuracion_de_Politicas_de_ViaticosForm.get('Usuario_que_Modifica').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingUsuario_que_Modifica = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Spartan_UserService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Spartan_UserService.listaSelAll(0, 20, '');
          return this.Spartan_UserService.listaSelAll(0, 20,
            "Spartan_User.Name like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Spartan_UserService.listaSelAll(0, 20,
          "Spartan_User.Name like '%" + value.Name.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingUsuario_que_Modifica = false;
      this.hasOptionsUsuario_que_Modifica = result?.Spartan_Users?.length > 0;
      this.optionsUsuario_que_Modifica = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingUsuario_que_Modifica = false;
      this.hasOptionsUsuario_que_Modifica = false;
      this.optionsUsuario_que_Modifica = of([]);
    });

  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tipo_de_vuelo': {
        this.Tipo_de_vueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_vuelo = x.Tipo_de_vuelos;
        });
        break;
      }
      case 'Concepto': {
        this.Concepto_de_Gasto_de_EmpleadoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varConcepto_de_Gasto_de_Empleado = x.Concepto_de_Gasto_de_Empleados;
        });
        break;
      }
      case 'Tipo_de_Destino': {
        this.Tipo_de_DestinoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Destino = x.Tipo_de_Destinos;
        });
        break;
      }
      case 'Tipo_de_Moneda': {
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

  displayFnUsuario_que_Modifica(option: Spartan_User) {
    return option?.Name;
  }


  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      this.Configuracion_de_Politicas_de_ViaticosForm.enable();
      const entity = this.Configuracion_de_Politicas_de_ViaticosForm.value;
      entity.Folio = this.model.Folio;
      entity.Usuario_que_Modifica = this.Configuracion_de_Politicas_de_ViaticosForm.get('Usuario_que_Modifica').value.Id_User;

      if (this.model.Folio > 0) {
        await this.Configuracion_de_Politicas_de_ViaticosService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Configuracion_de_Politicas_de_Viaticos(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.rulesAfterSave();

        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Configuracion_de_Politicas_de_ViaticosService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Configuracion_de_Politicas_de_Viaticos(id);

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
      this.Configuracion_de_Politicas_de_ViaticosForm.reset();
      this.model = new Configuracion_de_Politicas_de_Viaticos(this.fb);
      this.Configuracion_de_Politicas_de_ViaticosForm = this.model.buildFormGroup();
      this.dataSourceDetalle = new MatTableDataSource<Detalle_Configuracion_de_Politicas_de_Viaticos>();
      this.DetalleData = [];

    } else {
      this.router.navigate(['views/Configuracion_de_Politicas_de_Viaticos/add']);
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
    this.router.navigate(['/Configuracion_de_Politicas_de_Viaticos/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  maxNumberMonto_Diario_Autorizado(index: any, num: number): boolean {
    if (this.DetalleItems.value[index].Monto_Diario_Autorizado.length > (num - 1)) {
      return false;
    }
    return true;
  }

  setNumberMonto_Diario_Autorizado(index) {
    let fg = this.DetalleItems.controls[index] as any
    fg.controls["Monto_Diario_Autorizado"] = this.DetalleItems.value[index].Monto_Diario_Autorizado.toFixed(2);
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Fecha_de_Ultima_Modificacion_ExecuteBusinessRules(): void {
    //Fecha_de_Ultima_Modificacion_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Ultima_Modificacion_ExecuteBusinessRules(): void {
    //Hora_de_Ultima_Modificacion_FieldExecuteBusinessRulesEnd
  }
  Usuario_que_Modifica_ExecuteBusinessRules(): void {
    //Usuario_que_Modifica_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_vuelo_ExecuteBusinessRules(): void {
    //Tipo_de_vuelo_FieldExecuteBusinessRulesEnd
  }
  Concepto_ExecuteBusinessRules(): void {
    //Concepto_FieldExecuteBusinessRulesEnd
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

  async rulesOnInit() {
    //rulesOnInit_ExecuteBusinessRulesInit

    //INICIA - BRID:2865 - ASIGNAR FECHA, HORA Y USUARIO QUE MODIFICA - Autor: Felipe Rodríguez - Actualización: 5/3/2021 10:43:16 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Configuracion_de_Politicas_de_ViaticosForm, 'Fecha_de_Ultima_Modificacion', 0);
      this.brf.SetNotRequiredControl(this.Configuracion_de_Politicas_de_ViaticosForm, "Fecha_de_Ultima_Modificacion");
      this.brf.SetNotRequiredControl(this.Configuracion_de_Politicas_de_ViaticosForm, "Hora_de_Ultima_Modificacion");
      this.brf.SetNotRequiredControl(this.Configuracion_de_Politicas_de_ViaticosForm, "Usuario_que_Modifica");

      this.brf.SetEnabledControl(this.Configuracion_de_Politicas_de_ViaticosForm, 'Hora_de_Ultima_Modificacion', 0);
      this.brf.SetEnabledControl(this.Configuracion_de_Politicas_de_ViaticosForm, 'Usuario_que_Modifica', 0);
      this.brf.SetCurrentDateToField(this.Configuracion_de_Politicas_de_ViaticosForm, "Fecha_de_Ultima_Modificacion");
      this.brf.SetCurrentHourToField(this.Configuracion_de_Politicas_de_ViaticosForm, "Hora_de_Ultima_Modificacion");

      this.setUsuario_que_Modifica()

    }
    //TERMINA - BRID:2865

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

  async setUsuario_que_Modifica() {
    this.sqlModel.query = `SELECT Name FROM Spartan_User WHERE Id_User = ${this.localStorageHelper.getItemFromLocalStorage('USERID')}`

    await this._SpartanService.ExecuteQuery(this.sqlModel).toPromise().then((result) => {
      let array = {
        Id_User: this.localStorageHelper.getItemFromLocalStorage('USERID'),
        Name: result
      }
      this.Configuracion_de_Politicas_de_ViaticosForm.controls["Usuario_que_Modifica"].setValue(array);
    });

  }


}
