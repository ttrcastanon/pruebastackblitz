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
import { startWith, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { GeneralService } from 'src/app/api-services/general.service';
import { Configuracion_de_Codigo_ComputarizadoService } from 'src/app/api-services/Configuracion_de_Codigo_Computarizado.service';
import { Configuracion_de_Codigo_Computarizado } from 'src/app/models/Configuracion_de_Codigo_Computarizado';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Detalle_Config_Partes_AsociadasService } from 'src/app/api-services/Detalle_Config_Partes_Asociadas.service';
import { Detalle_Config_Partes_Asociadas } from 'src/app/models/Detalle_Config_Partes_Asociadas';
import { PiezasService } from 'src/app/api-services/Piezas.service';
import { Piezas } from 'src/app/models/Piezas';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';

import { Detalle_Config_Servicios_AsociadosService } from 'src/app/api-services/Detalle_Config_Servicios_Asociados.service';
import { Detalle_Config_Servicios_Asociados } from 'src/app/models/Detalle_Config_Servicios_Asociados';
import { ServiciosService } from 'src/app/api-services/Servicios.service';
import { Servicios } from 'src/app/models/Servicios';


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
import { debug } from 'console';

@Component({
  selector: 'app-Configuracion_de_Codigo_Computarizado',
  templateUrl: './Configuracion_de_Codigo_Computarizado.component.html',
  styleUrls: ['./Configuracion_de_Codigo_Computarizado.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Configuracion_de_Codigo_ComputarizadoComponent implements OnInit, AfterViewInit {
MRaddServicios_Asociados_por_Defecto: boolean = false;
MRaddPartes_Asociadas_por_Defecto: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Configuracion_de_Codigo_ComputarizadoForm: FormGroup;
  public Editor = ClassicEditor;
  model: Configuracion_de_Codigo_Computarizado;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsCodigo_Computarizado: Observable<Codigo_Computarizado[]>;
  hasOptionsCodigo_Computarizado: boolean;
  isLoadingCodigo_Computarizado: boolean;
  public varPiezas: Piezas[] = [];
  public varUnidad: Unidad[] = [];

  public PAD:boolean = false;
  public SAD:boolean = false;

  autoNumero_de_Parte_Detalle_Config_Partes_Asociadas = new FormControl();
  SelectedNumero_de_Parte_Detalle_Config_Partes_Asociadas: string[] = [];
  isLoadingNumero_de_Parte_Detalle_Config_Partes_Asociadas: boolean;
  searchNumero_de_Parte_Detalle_Config_Partes_AsociadasCompleted: boolean;

  public varServicios: Servicios[] = [];

  autoCodigo_de_Servicio_Detalle_Config_Servicios_Asociados = new FormControl();
  SelectedCodigo_de_Servicio_Detalle_Config_Servicios_Asociados: string[] = [];
  isLoadingCodigo_de_Servicio_Detalle_Config_Servicios_Asociados: boolean;
  searchCodigo_de_Servicio_Detalle_Config_Servicios_AsociadosCompleted: boolean;


  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  dataSourcePartes_Asociadas_por_Defecto = new MatTableDataSource<Detalle_Config_Partes_Asociadas>();
  Partes_Asociadas_por_DefectoColumns = [
    { def: 'actions', hide: false },
    { def: 'Numero_de_Parte', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Unidad', hide: false },

  ];
  Partes_Asociadas_por_DefectoData: Detalle_Config_Partes_Asociadas[] = [];
  @ViewChild('paginatorPartes_Asociadas') paginatorPartes_Asociadas: MatPaginator;


  dataSourceServicios_Asociados_por_Defecto = new MatTableDataSource<Detalle_Config_Servicios_Asociados>();
  Servicios_Asociados_por_DefectoColumns = [
    { def: 'actions', hide: false },
    { def: 'Codigo_de_Servicio', hide: false },

  ];
  Servicios_Asociados_por_DefectoData: Detalle_Config_Servicios_Asociados[] = [];
  @ViewChild('paginatorServicios_Asociados') paginatorServicios_Asociados: MatPaginator;


  today = new Date;
  consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Configuracion_de_Codigo_ComputarizadoService: Configuracion_de_Codigo_ComputarizadoService,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,
    private Detalle_Config_Partes_AsociadasService: Detalle_Config_Partes_AsociadasService,
    private PiezasService: PiezasService,
    private UnidadService: UnidadService,
    private Detalle_Config_Servicios_AsociadosService: Detalle_Config_Servicios_AsociadosService,
    private ServiciosService: ServiciosService,
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

    this.model = new Configuracion_de_Codigo_Computarizado(this.fb);
    this.Configuracion_de_Codigo_ComputarizadoForm = this.model.buildFormGroup();
    this.Partes_Asociadas_por_DefectoItems.removeAt(0);
    this.Servicios_Asociados_por_DefectoItems.removeAt(0);




    this.Configuracion_de_Codigo_ComputarizadoForm.get('Folio').disable();
    this.Configuracion_de_Codigo_ComputarizadoForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  getCountServicios_Asociados(): number {
    return this.dataSourceServicios_Asociados_por_Defecto.data.length;
  }

  getCountPartes_Asociadas(): number {
    return this.dataSourcePartes_Asociadas_por_Defecto.data.length;
  }

  ngAfterViewInit(): void {
    this.dataSourcePartes_Asociadas_por_Defecto.paginator = this.paginatorPartes_Asociadas;
    this.dataSourceServicios_Asociados_por_Defecto.paginator = this.paginatorServicios_Asociados;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Partes_Asociadas_por_DefectoColumns.splice(0, 1);
          this.Servicios_Asociados_por_DefectoColumns.splice(0, 1);

          this.Configuracion_de_Codigo_ComputarizadoForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Configuracion_de_Codigo_Computarizado)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Configuracion_de_Codigo_ComputarizadoForm, 'Codigo_Computarizado', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Configuracion_de_Codigo_ComputarizadoService.listaSelAll(0, 1, 'Configuracion_de_Codigo_Computarizado.Folio=' + id).toPromise();
    if (result.Configuracion_de_Codigo_Computarizados.length > 0) {

      let fPartes_Asociadas_por_Defecto = await this.Detalle_Config_Partes_AsociadasService.listaSelAll(0, 1000, 'Configuracion_de_Codigo_Computarizado.Folio=' + id).toPromise();
      this.Partes_Asociadas_por_DefectoData = fPartes_Asociadas_por_Defecto.Detalle_Config_Partes_Asociadass;
      this.loadPartes_Asociadas_por_Defecto(fPartes_Asociadas_por_Defecto.Detalle_Config_Partes_Asociadass);
      this.dataSourcePartes_Asociadas_por_Defecto = new MatTableDataSource(fPartes_Asociadas_por_Defecto.Detalle_Config_Partes_Asociadass);
      this.dataSourcePartes_Asociadas_por_Defecto.paginator = this.paginatorPartes_Asociadas;
      this.dataSourcePartes_Asociadas_por_Defecto.sort = this.sort;

      let fServicios_Asociados_por_Defecto = await this.Detalle_Config_Servicios_AsociadosService.listaSelAll(0, 1000, 'Configuracion_de_Codigo_Computarizado.Folio=' + id).toPromise();
      this.Servicios_Asociados_por_DefectoData = fServicios_Asociados_por_Defecto.Detalle_Config_Servicios_Asociadoss;
      this.loadServicios_Asociados_por_Defecto(fServicios_Asociados_por_Defecto.Detalle_Config_Servicios_Asociadoss);
      this.dataSourceServicios_Asociados_por_Defecto = new MatTableDataSource(fServicios_Asociados_por_Defecto.Detalle_Config_Servicios_Asociadoss);
      this.dataSourceServicios_Asociados_por_Defecto.paginator = this.paginatorServicios_Asociados;
      this.dataSourceServicios_Asociados_por_Defecto.sort = this.sort;

      this.model.fromObject(result.Configuracion_de_Codigo_Computarizados[0]);
      this.Configuracion_de_Codigo_ComputarizadoForm.get('Codigo_Computarizado').setValue(
        result.Configuracion_de_Codigo_Computarizados[0].Codigo_Computarizado_Codigo_Computarizado.Descripcion_Busqueda,
        { onlySelf: false, emitEvent: true }
      );

      this.Configuracion_de_Codigo_ComputarizadoForm.markAllAsTouched();
      this.Configuracion_de_Codigo_ComputarizadoForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  //#region Partes_Asociadas_por_Defecto

  get Partes_Asociadas_por_DefectoItems() {
    return this.Configuracion_de_Codigo_ComputarizadoForm.get('Detalle_Config_Partes_AsociadasItems') as FormArray;
  }

  getPartes_Asociadas_por_DefectoColumns(): string[] {
    return this.Partes_Asociadas_por_DefectoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPartes_Asociadas_por_Defecto(Partes_Asociadas_por_Defecto: Detalle_Config_Partes_Asociadas[]) {
    Partes_Asociadas_por_Defecto.forEach(element => {
      this.addPartes_Asociadas_por_Defecto(element);
    });
  }

  addPartes_Asociadas_por_DefectoToMR() {
    this.PAD = true;
    const Partes_Asociadas_por_Defecto = new Detalle_Config_Partes_Asociadas(this.fb);
    this.Partes_Asociadas_por_DefectoData.push(this.addPartes_Asociadas_por_Defecto(Partes_Asociadas_por_Defecto));
    this.dataSourcePartes_Asociadas_por_Defecto.data = this.Partes_Asociadas_por_DefectoData;
    Partes_Asociadas_por_Defecto.edit = true;
    Partes_Asociadas_por_Defecto.isNew = true;
    const length = this.dataSourcePartes_Asociadas_por_Defecto.data.length;
    const index = length - 1;
    const formPartes_Asociadas_por_Defecto = this.Partes_Asociadas_por_DefectoItems.controls[index] as FormGroup;
    
    this.addFilterToControlNumero_de_Parte_Detalle_Config_Partes_Asociadas(formPartes_Asociadas_por_Defecto.controls.Numero_de_Parte, index);

    const page = Math.ceil(this.dataSourcePartes_Asociadas_por_Defecto.data.filter(d => !d.IsDeleted).length / this.paginatorPartes_Asociadas.pageSize);
    if (page !== this.paginatorPartes_Asociadas.pageIndex) {
      this.paginatorPartes_Asociadas.pageIndex = page;
    }
  }

  addPartes_Asociadas_por_Defecto(entity: Detalle_Config_Partes_Asociadas) {
    const Partes_Asociadas_por_Defecto = new Detalle_Config_Partes_Asociadas(this.fb);
    this.Partes_Asociadas_por_DefectoItems.push(Partes_Asociadas_por_Defecto.buildFormGroup());
    if (entity) {
      Partes_Asociadas_por_Defecto.fromObject(entity);
    }
    return entity;
  }

  Partes_Asociadas_por_DefectoItemsByFolio(Folio: number): FormGroup {
    return (this.Configuracion_de_Codigo_ComputarizadoForm.get('Detalle_Config_Partes_AsociadasItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Partes_Asociadas_por_DefectoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePartes_Asociadas_por_Defecto.data.indexOf(element);
    let fb = this.Partes_Asociadas_por_DefectoItems.controls[index] as FormGroup;
    return fb;
  }

  deletePartes_Asociadas_por_Defecto(element: any) {
    
    let index = this.dataSourcePartes_Asociadas_por_Defecto.data.indexOf(element);
    this.Partes_Asociadas_por_DefectoData[index].Numero_de_Parte = '';
    this.Partes_Asociadas_por_DefectoData[index].Cantidad = 0;
    this.Partes_Asociadas_por_DefectoData[index].Unidad = '';
   
    this.Partes_Asociadas_por_DefectoData[index].IsDeleted = true;
    this.dataSourcePartes_Asociadas_por_Defecto.data = this.Partes_Asociadas_por_DefectoData;
   
    this.dataSourcePartes_Asociadas_por_Defecto._updateChangeSubscription();
    index = this.dataSourcePartes_Asociadas_por_Defecto.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorPartes_Asociadas.pageSize);
    if (page !== this.paginatorPartes_Asociadas.pageIndex) {
      this.paginatorPartes_Asociadas.pageIndex = page;
    }
  }

  cancelEditPartes_Asociadas_por_Defecto(element: any) {
    this.PAD = false;
    let index = this.dataSourcePartes_Asociadas_por_Defecto.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Partes_Asociadas_por_DefectoData[index].IsDeleted = true;
      this.dataSourcePartes_Asociadas_por_Defecto.data = this.Partes_Asociadas_por_DefectoData;
      this.dataSourcePartes_Asociadas_por_Defecto.data.splice(index, 1);
      this.dataSourcePartes_Asociadas_por_Defecto._updateChangeSubscription();
      index = this.Partes_Asociadas_por_DefectoData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginatorPartes_Asociadas.pageSize);
      if (page !== this.paginatorPartes_Asociadas.pageIndex) {
        this.paginatorPartes_Asociadas.pageIndex = page;
      }
    }
  }

  async savePartes_Asociadas_por_Defecto(element: any) {
    this.PAD = false;
    const index = this.dataSourcePartes_Asociadas_por_Defecto.data.indexOf(element);
    const formPartes_Asociadas_por_Defecto = this.Partes_Asociadas_por_DefectoItems.controls[index] as FormGroup;

    if (!this.validatePartes_Asociadas_por_Defecto(element)) {
      return this.cancelEditServicios_Asociados_por_Defecto(element);
    }

    if (this.Partes_Asociadas_por_DefectoData[index].Numero_de_Parte !== formPartes_Asociadas_por_Defecto.value.Numero_de_Parte) {
      let piezas = await this.PiezasService.getById(formPartes_Asociadas_por_Defecto.value.Numero_de_Parte).toPromise();
      this.Partes_Asociadas_por_DefectoData[index].Numero_de_Parte_Piezas = piezas;
    }
    this.Partes_Asociadas_por_DefectoData[index].Numero_de_Parte = formPartes_Asociadas_por_Defecto.value.Numero_de_Parte;
    this.Partes_Asociadas_por_DefectoData[index].Cantidad = formPartes_Asociadas_por_Defecto.value.Cantidad;
    this.Partes_Asociadas_por_DefectoData[index].Unidad = formPartes_Asociadas_por_Defecto.value.Unidad;
    this.Partes_Asociadas_por_DefectoData[index].Unidad_Unidad = formPartes_Asociadas_por_Defecto.value.Unidad !== '' ?
      this.varUnidad.filter(d => d.Clave === formPartes_Asociadas_por_Defecto.value.Unidad)[0] : null;

    this.Partes_Asociadas_por_DefectoData[index].isNew = false;
    this.dataSourcePartes_Asociadas_por_Defecto.data = this.Partes_Asociadas_por_DefectoData;
    this.dataSourcePartes_Asociadas_por_Defecto._updateChangeSubscription();
  }

  validatePartes_Asociadas_por_Defecto(element: any): boolean {
    let valid: boolean = true;
    const index = this.dataSourcePartes_Asociadas_por_Defecto.data.indexOf(element);
    const formPartes_Asociadas_por_Defecto = this.Partes_Asociadas_por_DefectoItems.controls[index] as FormGroup;

    if (formPartes_Asociadas_por_Defecto.value.Numero_de_Parte == "" || formPartes_Asociadas_por_Defecto.value.Cantidad == 0) {
      valid = false
    }
    return valid;
  }

  editPartes_Asociadas_por_Defecto(element: any) {
    this.PAD = true;
    const index = this.dataSourcePartes_Asociadas_por_Defecto.data.indexOf(element);
    const formPartes_Asociadas_por_Defecto = this.Partes_Asociadas_por_DefectoItems.controls[index] as FormGroup;
    this.SelectedNumero_de_Parte_Detalle_Config_Partes_Asociadas[index] = this.dataSourcePartes_Asociadas_por_Defecto.data[index].Numero_de_Parte_Piezas.Descripcion_Busqueda;
    this.addFilterToControlNumero_de_Parte_Detalle_Config_Partes_Asociadas(formPartes_Asociadas_por_Defecto.controls.Numero_de_Parte, index);

    element.edit = true;
  }

  async saveDetalle_Config_Partes_Asociadas(Folio: number) {
    this.dataSourcePartes_Asociadas_por_Defecto.data.forEach(async (d, index) => {
      const data = this.Partes_Asociadas_por_DefectoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Configuracion_de_Codigo_Computarizado = Folio;
      model.Configuracion = Folio;


      if (model.Folio === 0) {
        // Add Partes Asociadas por Defecto
        let response = await this.Detalle_Config_Partes_AsociadasService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formPartes_Asociadas_por_Defecto = this.Partes_Asociadas_por_DefectoItemsByFolio(model.Folio);
        if (formPartes_Asociadas_por_Defecto.dirty) {
          // Update Partes Asociadas por Defecto
          let response = await this.Detalle_Config_Partes_AsociadasService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Partes Asociadas por Defecto
        await this.Detalle_Config_Partes_AsociadasService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectNumero_de_Parte_Detalle_Config_Partes_Asociadas(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourcePartes_Asociadas_por_Defecto.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNumero_de_Parte_Detalle_Config_Partes_Asociadas[index] = event.option.viewValue;
    let fgr = this.Configuracion_de_Codigo_ComputarizadoForm.controls.Detalle_Config_Partes_AsociadasItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Numero_de_Parte.setValue(event.option.value);
    this.displayFnNumero_de_Parte_Detalle_Config_Partes_Asociadas(element);
  }

  displayFnNumero_de_Parte_Detalle_Config_Partes_Asociadas(this, element) {
    const index = this.dataSourcePartes_Asociadas_por_Defecto.data.indexOf(element);
    return this.SelectedNumero_de_Parte_Detalle_Config_Partes_Asociadas[index];
  }

  updateOptionNumero_de_Parte_Detalle_Config_Partes_Asociadas(event, element: any) {
    const index = this.dataSourcePartes_Asociadas_por_Defecto.data.indexOf(element);
    this.SelectedNumero_de_Parte_Detalle_Config_Partes_Asociadas[index] = event.source.viewValue;
  }

  _filterNumero_de_Parte_Detalle_Config_Partes_Asociadas(filter: any): Observable<Piezas> {
    const where = filter !== '' ? "Piezas.Descripcion like '%" + filter + "%'" : '';
    return this.PiezasService.listaSelAll(0, 20, where);
  }

  addFilterToControlNumero_de_Parte_Detalle_Config_Partes_Asociadas(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNumero_de_Parte_Detalle_Config_Partes_Asociadas = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNumero_de_Parte_Detalle_Config_Partes_Asociadas = true;
        return this._filterNumero_de_Parte_Detalle_Config_Partes_Asociadas(value || '');
      })
    ).subscribe(result => {
      this.varPiezas = result.Piezass;
      this.isLoadingNumero_de_Parte_Detalle_Config_Partes_Asociadas = false;
      this.searchNumero_de_Parte_Detalle_Config_Partes_AsociadasCompleted = true;
      this.SelectedNumero_de_Parte_Detalle_Config_Partes_Asociadas[index] = this.varPiezas.length === 0 ? '' : this.SelectedNumero_de_Parte_Detalle_Config_Partes_Asociadas[index];
    });
  }

  //#endregion

  //#region Servicios_Asociados_por_Defecto
  get Servicios_Asociados_por_DefectoItems() {
    return this.Configuracion_de_Codigo_ComputarizadoForm.get('Detalle_Config_Servicios_AsociadosItems') as FormArray;
  }

  getServicios_Asociados_por_DefectoColumns(): string[] {
    return this.Servicios_Asociados_por_DefectoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadServicios_Asociados_por_Defecto(Servicios_Asociados_por_Defecto: Detalle_Config_Servicios_Asociados[]) {
    Servicios_Asociados_por_Defecto.forEach(element => {
      this.addServicios_Asociados_por_Defecto(element);
    });
  }

  addServicios_Asociados_por_DefectoToMR() {
    this.SAD = true;
    const Servicios_Asociados_por_Defecto = new Detalle_Config_Servicios_Asociados(this.fb);
    this.Servicios_Asociados_por_DefectoData.push(this.addServicios_Asociados_por_Defecto(Servicios_Asociados_por_Defecto));
    this.dataSourceServicios_Asociados_por_Defecto.data = this.Servicios_Asociados_por_DefectoData;
    Servicios_Asociados_por_Defecto.edit = true;
    Servicios_Asociados_por_Defecto.isNew = true;
    const length = this.dataSourceServicios_Asociados_por_Defecto.data.length;
    const index = length - 1;
    const formServicios_Asociados_por_Defecto = this.Servicios_Asociados_por_DefectoItems.controls[index] as FormGroup;
    this.addFilterToControlCodigo_de_Servicio_Detalle_Config_Servicios_Asociados(formServicios_Asociados_por_Defecto.controls.Codigo_de_Servicio, index);

    const page = Math.ceil(this.dataSourceServicios_Asociados_por_Defecto.data.filter(d => !d.IsDeleted).length / this.paginatorServicios_Asociados.pageSize);
    if (page !== this.paginatorServicios_Asociados.pageIndex) {
      this.paginatorServicios_Asociados.pageIndex = page;
    }

  }

  addServicios_Asociados_por_Defecto(entity: Detalle_Config_Servicios_Asociados) {
    const Servicios_Asociados_por_Defecto = new Detalle_Config_Servicios_Asociados(this.fb);

    this.Servicios_Asociados_por_DefectoItems.push(Servicios_Asociados_por_Defecto.buildFormGroup());
    if (entity) {
      Servicios_Asociados_por_Defecto.fromObject(entity);
    }

    return entity;
  }

  Servicios_Asociados_por_DefectoItemsByFolio(Folio: number): FormGroup {
    return (this.Configuracion_de_Codigo_ComputarizadoForm.get('Detalle_Config_Servicios_AsociadosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Servicios_Asociados_por_DefectoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceServicios_Asociados_por_Defecto.data.indexOf(element);
    let fb = this.Servicios_Asociados_por_DefectoItems.controls[index] as FormGroup;
    return fb;
  }

  deleteServicios_Asociados_por_Defecto(element: any) {
    let index = this.dataSourceServicios_Asociados_por_Defecto.data.indexOf(element);
    this.Servicios_Asociados_por_DefectoData[index].IsDeleted = true;
    this.dataSourceServicios_Asociados_por_Defecto.data = this.Servicios_Asociados_por_DefectoData;
    this.dataSourceServicios_Asociados_por_Defecto.data.splice(index, 1);
    this.dataSourceServicios_Asociados_por_Defecto._updateChangeSubscription();
    index = this.dataSourceServicios_Asociados_por_Defecto.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginatorServicios_Asociados.pageSize);
    if (page !== this.paginatorServicios_Asociados.pageIndex) {
      this.paginatorServicios_Asociados.pageIndex = page;
    }
  }

  cancelEditServicios_Asociados_por_Defecto(element: any) {
    this.SAD = false;
    let index = this.dataSourceServicios_Asociados_por_Defecto.data.indexOf(element);
    element.edit = false;
    console.log("Cancel")
    console.log(element)
    if (element.isNew) {
      this.Servicios_Asociados_por_DefectoData[index].IsDeleted = true;
      this.dataSourceServicios_Asociados_por_Defecto.data = this.Servicios_Asociados_por_DefectoData;
      this.dataSourceServicios_Asociados_por_Defecto.data.splice(index, 1);
      this.dataSourceServicios_Asociados_por_Defecto._updateChangeSubscription();
      index = this.Servicios_Asociados_por_DefectoData.filter(d => !d.IsDeleted).length;

      const page = Math.ceil(index / this.paginatorServicios_Asociados.pageSize);
      if (page !== this.paginatorServicios_Asociados.pageIndex) {
        this.paginatorServicios_Asociados.pageIndex = page;
      }
    }
  }

  async saveServicios_Asociados_por_Defecto(element: any) {
    this.SAD = false;
    const index = this.dataSourceServicios_Asociados_por_Defecto.data.indexOf(element);
    const formServicios_Asociados_por_Defecto = this.Servicios_Asociados_por_DefectoItems.controls[index] as FormGroup;

    if (!this.validateServicios_Asociados_por_Defecto(element)) {
      this.cancelEditServicios_Asociados_por_Defecto(element);
      return
    }

    if (this.Servicios_Asociados_por_DefectoData[index].Codigo_de_Servicio !== formServicios_Asociados_por_Defecto.value.Codigo_de_Servicio) {
      let servicios = await this.ServiciosService.getById(formServicios_Asociados_por_Defecto.value.Codigo_de_Servicio).toPromise();
      this.Servicios_Asociados_por_DefectoData[index].Codigo_de_Servicio_Servicios = servicios;
    }
    this.Servicios_Asociados_por_DefectoData[index].Codigo_de_Servicio = formServicios_Asociados_por_Defecto.value.Codigo_de_Servicio;
    this.Servicios_Asociados_por_DefectoData[index].Cantidad = formServicios_Asociados_por_Defecto.value.Cantidad;

    this.Servicios_Asociados_por_DefectoData[index].isNew = false;
    this.dataSourceServicios_Asociados_por_Defecto.data = this.Servicios_Asociados_por_DefectoData;
    this.dataSourceServicios_Asociados_por_Defecto._updateChangeSubscription();
  }

  validateServicios_Asociados_por_Defecto(element: any): boolean {
    let valid: boolean = true;;
    const index = this.dataSourceServicios_Asociados_por_Defecto.data.indexOf(element);
    const formServicios_Asociados_por_Defecto = this.Servicios_Asociados_por_DefectoItems.controls[index] as FormGroup;

    if (formServicios_Asociados_por_Defecto.value.Codigo_de_Servicio == "" || this.varServicios.length == 0) {
      valid = false
    }
    return valid
  }

  editServicios_Asociados_por_Defecto(element: any) {
    this.SAD = true;
    const index = this.dataSourceServicios_Asociados_por_Defecto.data.indexOf(element);
    const formServicios_Asociados_por_Defecto = this.Servicios_Asociados_por_DefectoItems.controls[index] as FormGroup;
    this.SelectedCodigo_de_Servicio_Detalle_Config_Servicios_Asociados[index] = this.dataSourceServicios_Asociados_por_Defecto.data[index].Codigo_de_Servicio_Servicios.Descripcion_Busqueda;
    this.addFilterToControlCodigo_de_Servicio_Detalle_Config_Servicios_Asociados(formServicios_Asociados_por_Defecto.controls.Codigo_de_Servicio, index);

    element.edit = true;
  }

  async saveDetalle_Config_Servicios_Asociados(Folio: number) {
    this.dataSourceServicios_Asociados_por_Defecto.data.forEach(async (d, index) => {
      const data = this.Servicios_Asociados_por_DefectoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Configuracion_de_Codigo_Computarizado = Folio;
      model.Configuracion = Folio;


      if (model.Folio === 0) {
        // Add Servicios Asociados por Defecto
        let response = await this.Detalle_Config_Servicios_AsociadosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formServicios_Asociados_por_Defecto = this.Servicios_Asociados_por_DefectoItemsByFolio(model.Folio);
        if (formServicios_Asociados_por_Defecto.dirty) {
          // Update Servicios Asociados por Defecto
          let response = await this.Detalle_Config_Servicios_AsociadosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Servicios Asociados por Defecto
        await this.Detalle_Config_Servicios_AsociadosService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectCodigo_de_Servicio_Detalle_Config_Servicios_Asociados(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceServicios_Asociados_por_Defecto.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedCodigo_de_Servicio_Detalle_Config_Servicios_Asociados[index] = event.option.viewValue;
    let fgr = this.Configuracion_de_Codigo_ComputarizadoForm.controls.Detalle_Config_Servicios_AsociadosItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Codigo_de_Servicio.setValue(event.option.value);
    this.displayFnCodigo_de_Servicio_Detalle_Config_Servicios_Asociados(element);
  }

  displayFnCodigo_de_Servicio_Detalle_Config_Servicios_Asociados(this, element) {
    const index = this.dataSourceServicios_Asociados_por_Defecto.data.indexOf(element);
    return this.SelectedCodigo_de_Servicio_Detalle_Config_Servicios_Asociados[index];
  }

  updateOptionCodigo_de_Servicio_Detalle_Config_Servicios_Asociados(event, element: any) {
    const index = this.dataSourceServicios_Asociados_por_Defecto.data.indexOf(element);
    this.SelectedCodigo_de_Servicio_Detalle_Config_Servicios_Asociados[index] = event.source.viewValue;
  }

  _filterCodigo_de_Servicio_Detalle_Config_Servicios_Asociados(filter: any): Observable<Servicios> {
    const where = filter !== '' ? "Servicios.Descripcion_Busqueda like '%" + filter + "%'" : '';
    return this.ServiciosService.listaSelAll(0, 20, where);
  }

  addFilterToControlCodigo_de_Servicio_Detalle_Config_Servicios_Asociados(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingCodigo_de_Servicio_Detalle_Config_Servicios_Asociados = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingCodigo_de_Servicio_Detalle_Config_Servicios_Asociados = true;
        return this._filterCodigo_de_Servicio_Detalle_Config_Servicios_Asociados(value || '');
      })
    ).subscribe(result => {
      this.varServicios = result.Servicioss;
      this.isLoadingCodigo_de_Servicio_Detalle_Config_Servicios_Asociados = false;
      this.searchCodigo_de_Servicio_Detalle_Config_Servicios_AsociadosCompleted = true;
      this.SelectedCodigo_de_Servicio_Detalle_Config_Servicios_Asociados[index] = this.varServicios.length === 0 ? '' : this.SelectedCodigo_de_Servicio_Detalle_Config_Servicios_Asociados[index];
    });
  }

  //#endregion

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Configuracion_de_Codigo_ComputarizadoForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.UnidadService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varUnidad]) => {
          this.varUnidad = varUnidad;



          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Configuracion_de_Codigo_ComputarizadoForm.get('Codigo_Computarizado').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCodigo_Computarizado = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Codigo_ComputarizadoService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Codigo_ComputarizadoService.listaSelAll(0, 20, '');
          return this.Codigo_ComputarizadoService.listaSelAll(0, 20,
            "Codigo_Computarizado.Descripcion_Busqueda like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Codigo_ComputarizadoService.listaSelAll(0, 20,
          "Codigo_Computarizado.Descripcion_Busqueda like '%" + value.Descripcion_Busqueda.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingCodigo_Computarizado = false;
      this.hasOptionsCodigo_Computarizado = result?.Codigo_Computarizados?.length > 0;
      if(this.operation == "Update" || this.operation == "Consult"){
        this.Configuracion_de_Codigo_ComputarizadoForm.get('Codigo_Computarizado').setValue(result?.Codigo_Computarizados[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsCodigo_Computarizado = of(result?.Codigo_Computarizados);
    }, error => {
      this.isLoadingCodigo_Computarizado = false;
      this.hasOptionsCodigo_Computarizado = false;
      this.optionsCodigo_Computarizado = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Unidad': {
        this.UnidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUnidad = x.Unidads;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnCodigo_Computarizado(option: Codigo_Computarizado) {
    return option?.Descripcion_Busqueda;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Configuracion_de_Codigo_ComputarizadoForm.value;
      entity.Folio = this.model.Folio;
      entity.Codigo_Computarizado = this.Configuracion_de_Codigo_ComputarizadoForm.get('Codigo_Computarizado').value.Codigo;


      if (this.model.Folio > 0) {
        await this.Configuracion_de_Codigo_ComputarizadoService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Config_Partes_Asociadas(this.model.Folio);
        await this.saveDetalle_Config_Servicios_Asociados(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Configuracion_de_Codigo_ComputarizadoService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Config_Partes_Asociadas(id);
          await this.saveDetalle_Config_Servicios_Asociados(id);
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
      this.Configuracion_de_Codigo_ComputarizadoForm.reset();
      this.model = new Configuracion_de_Codigo_Computarizado(this.fb);
      this.Configuracion_de_Codigo_ComputarizadoForm = this.model.buildFormGroup();
      this.dataSourcePartes_Asociadas_por_Defecto = new MatTableDataSource<Detalle_Config_Partes_Asociadas>();
      this.Partes_Asociadas_por_DefectoData = [];
      this.dataSourceServicios_Asociados_por_Defecto = new MatTableDataSource<Detalle_Config_Servicios_Asociados>();
      this.Servicios_Asociados_por_DefectoData = [];

    } else {
      this.router.navigate(['views/Configuracion_de_Codigo_Computarizado/add']);
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
    this.router.navigate(['/Configuracion_de_Codigo_Computarizado/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
    
  }


   validarDatosPartes_Asociadas_por_Defecto(i){
   let valid;
   
   this.Partes_Asociadas_por_DefectoItems.value[i].Cantidad > 0 ? valid =  this.Partes_Asociadas_por_DefectoItems.valid : valid = false;
    return valid
  }

  maxNumber(event, num: number): boolean {
    if (event.target.value.length > (num - 1)) {      
      return false;
    }
    return true;
 }
  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Codigo_Computarizado_ExecuteBusinessRules(): void {

    //INICIA - BRID:8 - Asiganar descripcion - Autor: Ivan Yañez - Actualización: 2/4/2021 12:52:01 PM
    if (this.brf.GetValueByControlType(this.Configuracion_de_Codigo_ComputarizadoForm, 'Codigo_Computarizado') != this.brf.TryParseInt('null', 'null')) { } else { }
    //TERMINA - BRID:8


    //INICIA - BRID:25 - Asignar descripción de código computarizado. - Autor: Ivan Yañez - Actualización: 2/4/2021 12:48:39 PM
    //this.brf.SetValueFromQuery(this.Configuracion_de_Codigo_ComputarizadoForm,"Descripcion",this.brf.EvaluaQuery(" select Descripcion From Codigo_Computarizado with(nolock) where Codigo='FLD[Codigo_Computarizado]'", 1, "ABC123"),1,"ABC123");
    //TERMINA - BRID:25

    //Codigo_Computarizado_FieldExecuteBusinessRulesEnd

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
