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

import { GeneralService } from 'src/app/api-services/general.service';
import { Seguros_Asociados_a_la_AeronaveService } from 'src/app/api-services/Seguros_Asociados_a_la_Aeronave.service';
import { Seguros_Asociados_a_la_Aeronave } from 'src/app/models/Seguros_Asociados_a_la_Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Detalle_de_Seguros_AsociadosService } from 'src/app/api-services/Detalle_de_Seguros_Asociados.service';
import { Detalle_de_Seguros_Asociados } from 'src/app/models/Detalle_de_Seguros_Asociados';
import { Proveedores_de_SegurosService } from 'src/app/api-services/Proveedores_de_Seguros.service';
import { Proveedores_de_Seguros } from 'src/app/models/Proveedores_de_Seguros';
import { Tipo_de_SeguroService } from 'src/app/api-services/Tipo_de_Seguro.service';
import { Tipo_de_Seguro } from 'src/app/models/Tipo_de_Seguro';
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
  selector: 'app-Seguros_Asociados_a_la_Aeronave',
  templateUrl: './Seguros_Asociados_a_la_Aeronave.component.html',
  styleUrls: ['./Seguros_Asociados_a_la_Aeronave.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Seguros_Asociados_a_la_AeronaveComponent implements OnInit, AfterViewInit {
MRaddSeguros_Asociados: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Seguros_Asociados_a_la_AeronaveForm: FormGroup;
  public Editor = ClassicEditor;
  model: Seguros_Asociados_a_la_Aeronave;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varAeronave: Aeronave[] = [];
  public varProveedores_de_Seguros: Proveedores_de_Seguros[] = [];
  public varTipo_de_Seguro: Tipo_de_Seguro[] = [];

  autoProveedor_de_Seguro_Detalle_de_Seguros_Asociados = new FormControl();
  SelectedProveedor_de_Seguro_Detalle_de_Seguros_Asociados: string[] = [];
  isLoadingProveedor_de_Seguro_Detalle_de_Seguros_Asociados: boolean;
  searchProveedor_de_Seguro_Detalle_de_Seguros_AsociadosCompleted: boolean;
  autoTipo_de_Seguro_Detalle_de_Seguros_Asociados = new FormControl();
  SelectedTipo_de_Seguro_Detalle_de_Seguros_Asociados: string[] = [];
  isLoadingTipo_de_Seguro_Detalle_de_Seguros_Asociados: boolean;
  searchTipo_de_Seguro_Detalle_de_Seguros_AsociadosCompleted: boolean;


  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceSeguros_Asociados = new MatTableDataSource<Detalle_de_Seguros_Asociados>();

  Seguros_AsociadosColumns = [
    //{ def: 'actions', hide: false },
    { def: 'Proveedor_de_Seguro', hide: false },
    { def: 'Tipo_de_Seguro', hide: false },
    { def: 'No__Poliza', hide: false },
    { def: 'Fecha_de_Vigencia', hide: false },
  ];

  Seguros_AsociadosData: Detalle_de_Seguros_Asociados[] = [];

  today = new Date;
  consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Seguros_Asociados_a_la_AeronaveService: Seguros_Asociados_a_la_AeronaveService,
    private AeronaveService: AeronaveService,
    private Detalle_de_Seguros_AsociadosService: Detalle_de_Seguros_AsociadosService,
    private Proveedores_de_SegurosService: Proveedores_de_SegurosService,
    private Tipo_de_SeguroService: Tipo_de_SeguroService,
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




    this.model = new Seguros_Asociados_a_la_Aeronave(this.fb);
    this.Seguros_Asociados_a_la_AeronaveForm = this.model.buildFormGroup();
    this.Seguros_AsociadosItems.removeAt(0);

    this.Seguros_Asociados_a_la_AeronaveForm.get('Folio').disable();
    this.Seguros_Asociados_a_la_AeronaveForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceSeguros_Asociados.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Seguros_AsociadosColumns.splice(0, 1);

          this.Seguros_Asociados_a_la_AeronaveForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Seguros_Asociados_a_la_Aeronave)
      .subscribe((response) => {
        this.permisos = response;
      });




    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Seguros_Asociados_a_la_AeronaveService.listaSelAll(0, 1, 'Seguros_Asociados_a_la_Aeronave.Folio=' + id).toPromise();
    if (result.Seguros_Asociados_a_la_Aeronaves.length > 0) {
      let fSeguros_Asociados = await this.Detalle_de_Seguros_AsociadosService.listaSelAll(0, 1000, 'Seguros_Asociados_a_la_Aeronave.Folio=' + id).toPromise();
      this.Seguros_AsociadosData = fSeguros_Asociados.Detalle_de_Seguros_Asociadoss;
      this.loadSeguros_Asociados(fSeguros_Asociados.Detalle_de_Seguros_Asociadoss);
      this.dataSourceSeguros_Asociados = new MatTableDataSource(fSeguros_Asociados.Detalle_de_Seguros_Asociadoss);
      this.dataSourceSeguros_Asociados.paginator = this.paginator;
      this.dataSourceSeguros_Asociados.sort = this.sort;

      this.model.fromObject(result.Seguros_Asociados_a_la_Aeronaves[0]);

      this.Seguros_Asociados_a_la_AeronaveForm.markAllAsTouched();
      this.Seguros_Asociados_a_la_AeronaveForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Seguros_AsociadosItems() {
    return this.Seguros_Asociados_a_la_AeronaveForm.get('Detalle_de_Seguros_AsociadosItems') as FormArray;
  }

  getSeguros_AsociadosColumns(): string[] {
    return this.Seguros_AsociadosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSeguros_Asociados(Seguros_Asociados: Detalle_de_Seguros_Asociados[]) {
    Seguros_Asociados.forEach(element => {
      this.addSeguros_Asociados(element);
    });
  }

  addSeguros_AsociadosToMR() {
    const Seguros_Asociados = new Detalle_de_Seguros_Asociados(this.fb);
    this.Seguros_AsociadosData.push(this.addSeguros_Asociados(Seguros_Asociados));
    this.dataSourceSeguros_Asociados.data = this.Seguros_AsociadosData;
    Seguros_Asociados.edit = true;
    Seguros_Asociados.isNew = true;
    const length = this.dataSourceSeguros_Asociados.data.length;
    const index = length - 1;
    const formSeguros_Asociados = this.Seguros_AsociadosItems.controls[index] as FormGroup;
    this.addFilterToControlProveedor_de_Seguro_Detalle_de_Seguros_Asociados(formSeguros_Asociados.controls.Proveedor_de_Seguro, index);
    this.addFilterToControlTipo_de_Seguro_Detalle_de_Seguros_Asociados(formSeguros_Asociados.controls.Tipo_de_Seguro, index);

    const page = Math.ceil(this.dataSourceSeguros_Asociados.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addSeguros_Asociados(entity: Detalle_de_Seguros_Asociados) {
    const Seguros_Asociados = new Detalle_de_Seguros_Asociados(this.fb);
    this.Seguros_AsociadosItems.push(Seguros_Asociados.buildFormGroup());
    if (entity) {
      Seguros_Asociados.fromObject(entity);
    }
    return entity;
  }

  Seguros_AsociadosItemsByFolio(Folio: number): FormGroup {
    return (this.Seguros_Asociados_a_la_AeronaveForm.get('Detalle_de_Seguros_AsociadosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Seguros_AsociadosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    let fb = this.Seguros_AsociadosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSeguros_Asociados(element: any) {
    let index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    this.Seguros_AsociadosData[index].IsDeleted = true;
    this.dataSourceSeguros_Asociados.data = this.Seguros_AsociadosData;
    this.dataSourceSeguros_Asociados._updateChangeSubscription();
    index = this.dataSourceSeguros_Asociados.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditSeguros_Asociados(element: any) {
    let index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Seguros_AsociadosData[index].IsDeleted = true;
      this.dataSourceSeguros_Asociados.data = this.Seguros_AsociadosData;
      this.dataSourceSeguros_Asociados._updateChangeSubscription();
      index = this.Seguros_AsociadosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveSeguros_Asociados(element: any) {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    const formSeguros_Asociados = this.Seguros_AsociadosItems.controls[index] as FormGroup;
    if (this.Seguros_AsociadosData[index].Proveedor_de_Seguro !== formSeguros_Asociados.value.Proveedor_de_Seguro && formSeguros_Asociados.value.Proveedor_de_Seguro > 0) {
      let proveedores_de_seguros = await this.Proveedores_de_SegurosService.getById(formSeguros_Asociados.value.Proveedor_de_Seguro).toPromise();
      this.Seguros_AsociadosData[index].Proveedor_de_Seguro_Proveedores_de_Seguros = proveedores_de_seguros;
    }
    this.Seguros_AsociadosData[index].Proveedor_de_Seguro = formSeguros_Asociados.value.Proveedor_de_Seguro;
    if (this.Seguros_AsociadosData[index].Tipo_de_Seguro !== formSeguros_Asociados.value.Tipo_de_Seguro && formSeguros_Asociados.value.Tipo_de_Seguro > 0) {
      let tipo_de_seguro = await this.Tipo_de_SeguroService.getById(formSeguros_Asociados.value.Tipo_de_Seguro).toPromise();
      this.Seguros_AsociadosData[index].Tipo_de_Seguro_Tipo_de_Seguro = tipo_de_seguro;
    }
    this.Seguros_AsociadosData[index].Tipo_de_Seguro = formSeguros_Asociados.value.Tipo_de_Seguro;
    this.Seguros_AsociadosData[index].No__Poliza = formSeguros_Asociados.value.No__Poliza;
    this.Seguros_AsociadosData[index].Fecha_de_Vigencia = formSeguros_Asociados.value.Fecha_de_Vigencia;

    this.Seguros_AsociadosData[index].isNew = false;
    this.dataSourceSeguros_Asociados.data = this.Seguros_AsociadosData;
    this.dataSourceSeguros_Asociados._updateChangeSubscription();
  }

  editSeguros_Asociados(element: any) {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    const formSeguros_Asociados = this.Seguros_AsociadosItems.controls[index] as FormGroup;
    this.SelectedProveedor_de_Seguro_Detalle_de_Seguros_Asociados[index] = this.dataSourceSeguros_Asociados.data[index].Proveedor_de_Seguro_Proveedores_de_Seguros.Nombre;
    this.addFilterToControlProveedor_de_Seguro_Detalle_de_Seguros_Asociados(formSeguros_Asociados.controls.Proveedor_de_Seguro, index);
    this.SelectedTipo_de_Seguro_Detalle_de_Seguros_Asociados[index] = this.dataSourceSeguros_Asociados.data[index].Tipo_de_Seguro_Tipo_de_Seguro.Descripcion;
    this.addFilterToControlTipo_de_Seguro_Detalle_de_Seguros_Asociados(formSeguros_Asociados.controls.Tipo_de_Seguro, index);

    element.edit = true;
  }

  async saveDetalle_de_Seguros_Asociados(Folio: number) {
    this.dataSourceSeguros_Asociados.data.forEach(async (d, index) => {
      const data = this.Seguros_AsociadosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Seguros_Asociados_a_la_Aeronave = Folio;


      if (model.Folio === 0) {
        // Add Seguros Asociados
        let response = await this.Detalle_de_Seguros_AsociadosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSeguros_Asociados = this.Seguros_AsociadosItemsByFolio(model.Folio);
        if (formSeguros_Asociados.dirty) {
          // Update Seguros Asociados
          let response = await this.Detalle_de_Seguros_AsociadosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Seguros Asociados
        await this.Detalle_de_Seguros_AsociadosService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectProveedor_de_Seguro_Detalle_de_Seguros_Asociados(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedProveedor_de_Seguro_Detalle_de_Seguros_Asociados[index] = event.option.viewValue;
    let fgr = this.Seguros_Asociados_a_la_AeronaveForm.controls.Detalle_de_Seguros_AsociadosItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Proveedor_de_Seguro.setValue(event.option.value);
    this.displayFnProveedor_de_Seguro_Detalle_de_Seguros_Asociados(element);
  }

  displayFnProveedor_de_Seguro_Detalle_de_Seguros_Asociados(this, element) {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    return this.SelectedProveedor_de_Seguro_Detalle_de_Seguros_Asociados[index];
  }
  updateOptionProveedor_de_Seguro_Detalle_de_Seguros_Asociados(event, element: any) {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    this.SelectedProveedor_de_Seguro_Detalle_de_Seguros_Asociados[index] = event.source.viewValue;
  }

  _filterProveedor_de_Seguro_Detalle_de_Seguros_Asociados(filter: any): Observable<Proveedores_de_Seguros> {
    const where = filter !== '' ? "Proveedores_de_Seguros.Nombre like '%" + filter + "%'" : '';
    return this.Proveedores_de_SegurosService.listaSelAll(0, 20, where);
  }

  addFilterToControlProveedor_de_Seguro_Detalle_de_Seguros_Asociados(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_de_Seguro_Detalle_de_Seguros_Asociados = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_de_Seguro_Detalle_de_Seguros_Asociados = true;
        return this._filterProveedor_de_Seguro_Detalle_de_Seguros_Asociados(value || '');
      })
    ).subscribe(result => {
      this.varProveedores_de_Seguros = result.Proveedores_de_Seguross;
      this.isLoadingProveedor_de_Seguro_Detalle_de_Seguros_Asociados = false;
      this.searchProveedor_de_Seguro_Detalle_de_Seguros_AsociadosCompleted = true;
      this.SelectedProveedor_de_Seguro_Detalle_de_Seguros_Asociados[index] = this.varProveedores_de_Seguros.length === 0 ? '' : this.SelectedProveedor_de_Seguro_Detalle_de_Seguros_Asociados[index];
    });
  }
  public selectTipo_de_Seguro_Detalle_de_Seguros_Asociados(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedTipo_de_Seguro_Detalle_de_Seguros_Asociados[index] = event.option.viewValue;
    let fgr = this.Seguros_Asociados_a_la_AeronaveForm.controls.Detalle_de_Seguros_AsociadosItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Tipo_de_Seguro.setValue(event.option.value);
    this.displayFnTipo_de_Seguro_Detalle_de_Seguros_Asociados(element);
  }

  displayFnTipo_de_Seguro_Detalle_de_Seguros_Asociados(this, element) {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    return this.SelectedTipo_de_Seguro_Detalle_de_Seguros_Asociados[index];
  }
  updateOptionTipo_de_Seguro_Detalle_de_Seguros_Asociados(event, element: any) {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    this.SelectedTipo_de_Seguro_Detalle_de_Seguros_Asociados[index] = event.source.viewValue;
  }

  _filterTipo_de_Seguro_Detalle_de_Seguros_Asociados(filter: any): Observable<Tipo_de_Seguro> {
    const where = filter !== '' ? "Tipo_de_Seguro.Descripcion like '%" + filter + "%'" : '';
    return this.Tipo_de_SeguroService.listaSelAll(0, 20, where);
  }

  addFilterToControlTipo_de_Seguro_Detalle_de_Seguros_Asociados(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingTipo_de_Seguro_Detalle_de_Seguros_Asociados = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingTipo_de_Seguro_Detalle_de_Seguros_Asociados = true;
        return this._filterTipo_de_Seguro_Detalle_de_Seguros_Asociados(value || '');
      })
    ).subscribe(result => {
      this.varTipo_de_Seguro = result.Tipo_de_Seguros;
      this.isLoadingTipo_de_Seguro_Detalle_de_Seguros_Asociados = false;
      this.searchTipo_de_Seguro_Detalle_de_Seguros_AsociadosCompleted = true;
      this.SelectedTipo_de_Seguro_Detalle_de_Seguros_Asociados[index] = this.varTipo_de_Seguro.length === 0 ? '' : this.SelectedTipo_de_Seguro_Detalle_de_Seguros_Asociados[index];
    });
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Seguros_Asociados_a_la_AeronaveForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.AeronaveService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varAeronave]) => {
          this.varAeronave = varAeronave;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Matricula': {
        this.AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varAeronave = x.Aeronaves;
        });
        break;
      }


      default: {
        break;
      }
    }
  }



  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Seguros_Asociados_a_la_AeronaveForm.value;
      entity.Folio = this.model.Folio;


      if (this.model.Folio > 0) {
        await this.Seguros_Asociados_a_la_AeronaveService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Seguros_Asociados(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Seguros_Asociados_a_la_AeronaveService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Seguros_Asociados(id);

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
      this.Seguros_Asociados_a_la_AeronaveForm.reset();
      this.model = new Seguros_Asociados_a_la_Aeronave(this.fb);
      this.Seguros_Asociados_a_la_AeronaveForm = this.model.buildFormGroup();
      this.dataSourceSeguros_Asociados = new MatTableDataSource<Detalle_de_Seguros_Asociados>();
      this.Seguros_AsociadosData = [];

    } else {
      this.router.navigate(['views/Seguros_Asociados_a_la_Aeronave/add']);
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
    this.router.navigate(['/Seguros_Asociados_a_la_Aeronave/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Matricula_ExecuteBusinessRules(): void {

    //INICIA - BRID:4003 - llenar mr seguros 2 - Autor: Lizeth Villa - Actualización: 6/25/2021 5:24:18 PM
    if (this.brf.GetValueByControlType(this.Seguros_Asociados_a_la_AeronaveForm, 'Matricula') != this.brf.TryParseInt('null', 'null')) { this.brf.FillMultiRenglonfromQuery(this.dataSourceSeguros_Asociados, "Detalle_de_Seguros_Asociados", 1, "ABC123"); } else { }
    //TERMINA - BRID:4003

    //Matricula_FieldExecuteBusinessRulesEnd

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

    //INICIA - BRID:4001 - Bloquear campos - Autor: Lizeth Villa - Actualización: 6/25/2021 5:23:17 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.Seguros_Asociados_a_la_AeronaveForm, 'Matricula', 0);
    }
    //TERMINA - BRID:4001

    const Matricula = this.localStorageHelper.getItemFromLocalStorage("MatriculaInfoPoliza");
    this.Seguros_Asociados_a_la_AeronaveForm.controls["Matricula"].setValue(Matricula)

    let Query = `select DISTINCT NULL as Folio,NULL as Seguros_Asociados_a_la_aeronave, ds.Proveedor_de_Seguro, s.Nombre as Proveedor_de_SeguroNombre, ds.Tipo_de_Seguro, ts.Descripcion as Tipo_de_SeguroDescripcion, ds.Numero_de_Poliza as No__Poliza, convert (varchar(11),ds.Fecha_De_Vigencia,105) as Fecha_de_Vigencia from Detalle_Seguros_Asociados_a ds left join Proveedores_de_Seguros s on s.Clave=ds.Proveedor_de_Seguro left join Tipo_de_Seguro ts on ts.Clave=ds.Tipo_de_Seguro where idMatricula = '${Matricula}'`

    //INICIA - BRID:4002 - Llenar MR de seguros - Autor: Lizeth Villa - Actualización: 6/25/2021 4:23:24 PM
    if (this.operation == 'New') {
      this.brf.FillMultiRenglonfromQuery(this.dataSourceSeguros_Asociados, Query, 1, "ABC123");

      //this.brf.FillMultiRenglonfromQuery(this.dataSourceSeguros_Asociados, "Detalle_de_Seguros_Asociados", 1, "ABC123");
    }
    //TERMINA - BRID:4002


    //INICIA - BRID:4004 - Asignar matricula con codigo manual - Autor: Lizeth Villa - Actualización: 6/25/2021 4:12:12 PM
    if (this.operation == 'New') {
      //this.brf.SetValueFromQuery(this.Seguros_Asociados_a_la_AeronaveForm, "Matricula", this.brf.EvaluaQuery(" SELECT Matricula FROM  Detalle_Solicitud_de_Piezas where Folio = 1", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:4004


    //INICIA - BRID:4005 - Ocultar folio-- - Autor: Lizeth Villa - Actualización: 6/25/2021 6:14:35 PM
    if (this.operation == 'New') {
      this.brf.HideFieldOfForm(this.Seguros_Asociados_a_la_AeronaveForm, "Folio");
      this.brf.SetNotRequiredControl(this.Seguros_Asociados_a_la_AeronaveForm, "Folio");
    }
    //TERMINA - BRID:4005

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

  async closeWindows() {
    window.close();
  }


}
