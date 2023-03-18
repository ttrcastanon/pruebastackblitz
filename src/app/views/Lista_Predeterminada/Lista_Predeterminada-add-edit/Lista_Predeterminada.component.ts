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
import { Lista_PredeterminadaService } from 'src/app/api-services/Lista_Predeterminada.service';
import { Lista_Predeterminada } from 'src/app/models/Lista_Predeterminada';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Detalle_de_Lista_PredeterminadaService } from 'src/app/api-services/Detalle_de_Lista_Predeterminada.service';
import { Detalle_de_Lista_Predeterminada } from 'src/app/models/Detalle_de_Lista_Predeterminada';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';
import { UrgenciaService } from 'src/app/api-services/Urgencia.service';
import { Urgencia } from 'src/app/models/Urgencia';
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
import * as moment from 'moment';
import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";
import { LOCALE_ID } from '@angular/core';
import localeEs from '@angular/common/locales/es';
import { registerLocaleData } from '@angular/common';
import { MessagesHelper } from 'src/app/helpers/messages-helper';
registerLocaleData(localeEs, 'es')


@Component({
  selector: 'app-Lista_Predeterminada',
  templateUrl: './Lista_Predeterminada.component.html',
  styleUrls: ['./Lista_Predeterminada.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})

export class Lista_PredeterminadaComponent implements OnInit, AfterViewInit {
MRaddLista_Predeterminada_Detalle: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }

  Lista_PredeterminadaForm: FormGroup;
  public Editor = ClassicEditor;
  model: Lista_Predeterminada;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varSpartan_User: Spartan_User[] = [];
  public varUnidad: Unidad[] = [];
  public varUrgencia: Urgencia[] = [];

  autoUnidad_de_Medida_Detalle_de_Lista_Predeterminada = new FormControl();
  SelectedUnidad_de_Medida_Detalle_de_Lista_Predeterminada: string[] = [];
  isLoadingUnidad_de_Medida_Detalle_de_Lista_Predeterminada: boolean;
  searchUnidad_de_Medida_Detalle_de_Lista_PredeterminadaCompleted: boolean;
  autoUrgencia_Detalle_de_Lista_Predeterminada = new FormControl();
  SelectedUrgencia_Detalle_de_Lista_Predeterminada: string[] = [];
  isLoadingUrgencia_Detalle_de_Lista_Predeterminada: boolean;
  searchUrgencia_Detalle_de_Lista_PredeterminadaCompleted: boolean;


  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator, { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceLista_Predeterminada_Detalle = new MatTableDataSource<Detalle_de_Lista_Predeterminada>();
  Lista_Predeterminada_DetalleColumns = [
    { def: 'actions', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Cantidad_Requerida', hide: false },
    { def: 'Unidad_de_Medida', hide: false },
    { def: 'Urgencia', hide: false },
    { def: 'Aplicacion_y_Justificacion', hide: false },
    { def: 'Fecha_requerida', hide: false },
    { def: 'Observaciones', hide: false },

  ];
  Lista_Predeterminada_DetalleData: Detalle_de_Lista_Predeterminada[] = [];

  isLista_Predeterminada_DetalleAdd: boolean = true;

  today = new Date;
  consult: boolean = false;
  notFound: string = "No se encontraron registros."
  loadingText: string = "Cargando..."

  varUnidadMedida: any
  varUrgenciaArray: any
  length = 0
  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Lista_PredeterminadaService: Lista_PredeterminadaService,
    private Spartan_UserService: Spartan_UserService,
    private Detalle_de_Lista_PredeterminadaService: Detalle_de_Lista_PredeterminadaService,
    private UnidadService: UnidadService,
    private UrgenciaService: UrgenciaService,
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
    private _messages: MessagesHelper,
    renderer: Renderer2) {

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.model = new Lista_Predeterminada(this.fb);
    this.Lista_PredeterminadaForm = this.model.buildFormGroup();
    this.Lista_Predeterminada_DetalleItems.removeAt(0);

    this.Lista_PredeterminadaForm.get('Folio').disable();
    this.Lista_PredeterminadaForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceLista_Predeterminada_Detalle.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Lista_Predeterminada_DetalleColumns.splice(0, 1);

          this.Lista_PredeterminadaForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Lista_Predeterminada)
      .subscribe((response) => {
        this.permisos = response;
      });




    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Lista_PredeterminadaService.listaSelAll(0, 1, 'Lista_Predeterminada.Folio=' + id).toPromise();
    if (result.Lista_Predeterminadas.length > 0) {
      let fLista_Predeterminada_Detalle = await this.Detalle_de_Lista_PredeterminadaService.listaSelAll(0, 1000, 'Lista_Predeterminada.Folio=' + id).toPromise();
      this.Lista_Predeterminada_DetalleData = fLista_Predeterminada_Detalle.Detalle_de_Lista_Predeterminadas;
      this.loadLista_Predeterminada_Detalle(fLista_Predeterminada_Detalle.Detalle_de_Lista_Predeterminadas);
      this.dataSourceLista_Predeterminada_Detalle = new MatTableDataSource(fLista_Predeterminada_Detalle.Detalle_de_Lista_Predeterminadas);
      this.dataSourceLista_Predeterminada_Detalle.paginator = this.paginator;
      this.dataSourceLista_Predeterminada_Detalle.sort = this.sort;

      this.model.fromObject(result.Lista_Predeterminadas[0]);

      this.Lista_PredeterminadaForm.markAllAsTouched();
      this.Lista_PredeterminadaForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Lista_Predeterminada_DetalleItems() {
    return this.Lista_PredeterminadaForm.get('Detalle_de_Lista_PredeterminadaItems') as FormArray;
  }

  getLista_Predeterminada_DetalleColumns(): string[] {
    return this.Lista_Predeterminada_DetalleColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadLista_Predeterminada_Detalle(Lista_Predeterminada_Detalle: Detalle_de_Lista_Predeterminada[]) {
    Lista_Predeterminada_Detalle.forEach(element => {
      this.addLista_Predeterminada_Detalle(element);
    });
  }

  addLista_Predeterminada_DetalleToMR() {
    const Lista_Predeterminada_Detalle = new Detalle_de_Lista_Predeterminada(this.fb);
    this.Lista_Predeterminada_DetalleData.push(this.addLista_Predeterminada_Detalle(Lista_Predeterminada_Detalle));
    this.dataSourceLista_Predeterminada_Detalle.data = this.Lista_Predeterminada_DetalleData;
    Lista_Predeterminada_Detalle.edit = true;
    Lista_Predeterminada_Detalle.isNew = true;
    const length = this.dataSourceLista_Predeterminada_Detalle.data.length;
    const index = length - 1;
    const formLista_Predeterminada_Detalle = this.Lista_Predeterminada_DetalleItems.controls[index] as FormGroup;
    this.addFilterToControlUnidad_de_Medida_Detalle_de_Lista_Predeterminada(formLista_Predeterminada_Detalle.controls.Unidad_de_Medida, index);
    this.addFilterToControlUrgencia_Detalle_de_Lista_Predeterminada(formLista_Predeterminada_Detalle.controls.Urgencia, index);

    const page = Math.ceil(this.dataSourceLista_Predeterminada_Detalle.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }

    this.isLista_Predeterminada_DetalleAdd = !this.isLista_Predeterminada_DetalleAdd

  }

  addLista_Predeterminada_Detalle(entity: Detalle_de_Lista_Predeterminada) {
    const Lista_Predeterminada_Detalle = new Detalle_de_Lista_Predeterminada(this.fb);
    this.Lista_Predeterminada_DetalleItems.push(Lista_Predeterminada_Detalle.buildFormGroup());
    if (entity) {
      Lista_Predeterminada_Detalle.fromObject(entity);
    }
    return entity;
  }

  Lista_Predeterminada_DetalleItemsByFolio(Folio: number): FormGroup {
    return (this.Lista_PredeterminadaForm.get('Detalle_de_Lista_PredeterminadaItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Lista_Predeterminada_DetalleItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    let fb = this.Lista_Predeterminada_DetalleItems.controls[index] as FormGroup;
    return fb;
  }

  deleteLista_Predeterminada_Detalle(element: any) {

    this._messages.confirmation("¿Está seguro de que desea eliminar este registro?", "")
      .then(() => {
        let index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
        this.Lista_Predeterminada_DetalleData[index].IsDeleted = true;
        this.dataSourceLista_Predeterminada_Detalle.data = this.Lista_Predeterminada_DetalleData;
        this.dataSourceLista_Predeterminada_Detalle._updateChangeSubscription();
        index = this.dataSourceLista_Predeterminada_Detalle.data.filter(d => !d.IsDeleted).length;
        const page = Math.ceil(index / this.paginator.pageSize);
        if (page !== this.paginator.pageIndex) {
          this.paginator.pageIndex = page;
        }
        this.length = index
        this.dataSourceLista_Predeterminada_Detalle.paginator = this.paginator;
      });

  }

  cancelEditLista_Predeterminada_Detalle(element: any) {
    let index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Lista_Predeterminada_DetalleData[index].IsDeleted = true;
      this.dataSourceLista_Predeterminada_Detalle.data = this.Lista_Predeterminada_DetalleData;
      this.dataSourceLista_Predeterminada_Detalle._updateChangeSubscription();
      index = this.Lista_Predeterminada_DetalleData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
    this.isLista_Predeterminada_DetalleAdd = true

  }

  async saveLista_Predeterminada_Detalle(element: any) {
    const index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    const formLista_Predeterminada_Detalle = this.Lista_Predeterminada_DetalleItems.controls[index] as FormGroup;
    this.Lista_Predeterminada_DetalleData[index].Descripcion = formLista_Predeterminada_Detalle.value.Descripcion;
    this.Lista_Predeterminada_DetalleData[index].Cantidad_Requerida = formLista_Predeterminada_Detalle.value.Cantidad_Requerida;
    if (this.Lista_Predeterminada_DetalleData[index].Unidad_de_Medida !== formLista_Predeterminada_Detalle.value.Unidad_de_Medida && formLista_Predeterminada_Detalle.value.Unidad_de_Medida > 0) {
      let unidad = await this.UnidadService.getById(formLista_Predeterminada_Detalle.value.Unidad_de_Medida).toPromise();
      this.Lista_Predeterminada_DetalleData[index].Unidad_de_Medida_Unidad = unidad;
    }
    this.Lista_Predeterminada_DetalleData[index].Unidad_de_Medida = formLista_Predeterminada_Detalle.value.Unidad_de_Medida;
    if (this.Lista_Predeterminada_DetalleData[index].Urgencia !== formLista_Predeterminada_Detalle.value.Urgencia && formLista_Predeterminada_Detalle.value.Urgencia > 0) {
      let urgencia = await this.UrgenciaService.getById(formLista_Predeterminada_Detalle.value.Urgencia).toPromise();
      this.Lista_Predeterminada_DetalleData[index].Urgencia_Urgencia = urgencia;
    }
    this.Lista_Predeterminada_DetalleData[index].Urgencia = formLista_Predeterminada_Detalle.value.Urgencia;
    this.Lista_Predeterminada_DetalleData[index].Aplicacion_y_Justificacion = formLista_Predeterminada_Detalle.value.Aplicacion_y_Justificacion;
    this.Lista_Predeterminada_DetalleData[index].Fecha_requerida = formLista_Predeterminada_Detalle.value.Fecha_requerida;
    this.Lista_Predeterminada_DetalleData[index].Observaciones = formLista_Predeterminada_Detalle.value.Observaciones;

    this.Lista_Predeterminada_DetalleData[index].isNew = false;
    this.dataSourceLista_Predeterminada_Detalle.data = this.Lista_Predeterminada_DetalleData;
    this.dataSourceLista_Predeterminada_Detalle._updateChangeSubscription();

    this.isLista_Predeterminada_DetalleAdd = !this.isLista_Predeterminada_DetalleAdd

  }

  editLista_Predeterminada_Detalle(element: any) {
    const index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    const formLista_Predeterminada_Detalle = this.Lista_Predeterminada_DetalleItems.controls[index] as FormGroup;
    this.SelectedUnidad_de_Medida_Detalle_de_Lista_Predeterminada[index] = this.dataSourceLista_Predeterminada_Detalle.data[index].Unidad_de_Medida_Unidad.Descripcion;
    this.addFilterToControlUnidad_de_Medida_Detalle_de_Lista_Predeterminada(formLista_Predeterminada_Detalle.controls.Unidad_de_Medida, index);
    this.SelectedUrgencia_Detalle_de_Lista_Predeterminada[index] = this.dataSourceLista_Predeterminada_Detalle.data[index].Urgencia_Urgencia.Descripcion;
    this.addFilterToControlUrgencia_Detalle_de_Lista_Predeterminada(formLista_Predeterminada_Detalle.controls.Urgencia, index);

    element.edit = true;
    this.isLista_Predeterminada_DetalleAdd = !this.isLista_Predeterminada_DetalleAdd

  }

  async saveDetalle_de_Lista_Predeterminada(Folio: number) {
    this.dataSourceLista_Predeterminada_Detalle.data.forEach(async (d, index) => {
      const data = this.Lista_Predeterminada_DetalleItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Lista_Predeterminada = Folio;

      if (model.Folio === 0 && !d.IsDeleted) {
        // Add Item de Lista Predeterminada
        let response = await this.Detalle_de_Lista_PredeterminadaService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formLista_Predeterminada_Detalle = this.Lista_Predeterminada_DetalleItemsByFolio(model.Folio);
        if (formLista_Predeterminada_Detalle.dirty) {
          // Update Item de Lista Predeterminada
          let response = await this.Detalle_de_Lista_PredeterminadaService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Item de Lista Predeterminada
        await this.Detalle_de_Lista_PredeterminadaService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectUnidad_de_Medida_Detalle_de_Lista_Predeterminada(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUnidad_de_Medida_Detalle_de_Lista_Predeterminada[index] = event.option.viewValue;
    let fgr = this.Lista_PredeterminadaForm.controls.Detalle_de_Lista_PredeterminadaItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Unidad_de_Medida.setValue(event.option.value);
    this.displayFnUnidad_de_Medida_Detalle_de_Lista_Predeterminada(element);
  }

  displayFnUnidad_de_Medida_Detalle_de_Lista_Predeterminada(this, element) {
    const index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    return this.SelectedUnidad_de_Medida_Detalle_de_Lista_Predeterminada[index];
  }
  updateOptionUnidad_de_Medida_Detalle_de_Lista_Predeterminada(event, element: any) {
    const index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    this.SelectedUnidad_de_Medida_Detalle_de_Lista_Predeterminada[index] = event.source.viewValue;
  }

  _filterUnidad_de_Medida_Detalle_de_Lista_Predeterminada(filter: any): Observable<Unidad> {
    const where = filter !== '' ? "Unidad.Descripcion like '%" + filter + "%'" : '';
    return this.UnidadService.listaSelAll(0, 20, where);
  }

  addFilterToControlUnidad_de_Medida_Detalle_de_Lista_Predeterminada(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUnidad_de_Medida_Detalle_de_Lista_Predeterminada = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUnidad_de_Medida_Detalle_de_Lista_Predeterminada = true;
        return this._filterUnidad_de_Medida_Detalle_de_Lista_Predeterminada(value || '');
      })
    ).subscribe(result => {
      this.varUnidad = result.Unidads;
      this.isLoadingUnidad_de_Medida_Detalle_de_Lista_Predeterminada = false;
      this.searchUnidad_de_Medida_Detalle_de_Lista_PredeterminadaCompleted = true;
      this.SelectedUnidad_de_Medida_Detalle_de_Lista_Predeterminada[index] = this.varUnidad.length === 0 ? '' : this.SelectedUnidad_de_Medida_Detalle_de_Lista_Predeterminada[index];
    });
  }
  public selectUrgencia_Detalle_de_Lista_Predeterminada(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedUrgencia_Detalle_de_Lista_Predeterminada[index] = event.option.viewValue;
    let fgr = this.Lista_PredeterminadaForm.controls.Detalle_de_Lista_PredeterminadaItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Urgencia.setValue(event.option.value);
    this.displayFnUrgencia_Detalle_de_Lista_Predeterminada(element);
  }

  displayFnUrgencia_Detalle_de_Lista_Predeterminada(this, element) {
    const index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    return this.SelectedUrgencia_Detalle_de_Lista_Predeterminada[index];
  }
  updateOptionUrgencia_Detalle_de_Lista_Predeterminada(event, element: any) {
    const index = this.dataSourceLista_Predeterminada_Detalle.data.indexOf(element);
    this.SelectedUrgencia_Detalle_de_Lista_Predeterminada[index] = event.source.viewValue;
  }

  _filterUrgencia_Detalle_de_Lista_Predeterminada(filter: any): Observable<Urgencia> {
    const where = filter !== '' ? "Urgencia.Descripcion like '%" + filter + "%'" : '';
    return this.UrgenciaService.listaSelAll(0, 20, where);
  }

  addFilterToControlUrgencia_Detalle_de_Lista_Predeterminada(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingUrgencia_Detalle_de_Lista_Predeterminada = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingUrgencia_Detalle_de_Lista_Predeterminada = true;
        return this._filterUrgencia_Detalle_de_Lista_Predeterminada(value || '');
      })
    ).subscribe(result => {
      this.varUrgencia = result.Urgencias;
      this.isLoadingUrgencia_Detalle_de_Lista_Predeterminada = false;
      this.searchUrgencia_Detalle_de_Lista_PredeterminadaCompleted = true;
      this.SelectedUrgencia_Detalle_de_Lista_Predeterminada[index] = this.varUrgencia.length === 0 ? '' : this.SelectedUrgencia_Detalle_de_Lista_Predeterminada[index];
    });
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Lista_PredeterminadaForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Spartan_UserService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varSpartan_User]) => {
          this.varSpartan_User = varSpartan_User;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.getUnidadMedida()
    this.getUrgenciaArray();

  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Usuario_que_Registra': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
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
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (await this.rulesBeforeSave()) {

      this.Lista_PredeterminadaForm.enable();
      const entity = this.Lista_PredeterminadaForm.value;
      entity.Folio = this.model.Folio;

      if (this.model.Folio > 0) {
        await this.Lista_PredeterminadaService.update(this.model.Folio, entity).toPromise().then(async id => {

          await this.saveDetalle_de_Lista_Predeterminada(this.model.Folio);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
          this.rulesAfterSave();

          return this.model.Folio;
        });


      } else {
        await (this.Lista_PredeterminadaService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Lista_Predeterminada(id);

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

    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Lista_PredeterminadaForm.reset();
      this.model = new Lista_Predeterminada(this.fb);
      this.Lista_PredeterminadaForm = this.model.buildFormGroup();
      this.dataSourceLista_Predeterminada_Detalle = new MatTableDataSource<Detalle_de_Lista_Predeterminada>();
      this.Lista_Predeterminada_DetalleData = [];

    } else {
      this.router.navigate(['views/Lista_Predeterminada/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }

  cancel() {

    let Reset = this.localStorageHelper.getItemFromLocalStorage("IsResetSolicitud_de_Compras");
    this.spinner.hide('loading');

    if (Reset == "0") {
      this.localStorageHelper.setItemToLocalStorage("IsResetSolicitud_de_Compras", "1");
      window.close();
    } else {
      this.goToList();
    }

  }

  goToList() {
    this.router.navigate(['/Lista_Predeterminada/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Fecha_de_Registro_ExecuteBusinessRules(): void {
    //Fecha_de_Registro_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Registro_ExecuteBusinessRules(): void {
    //Hora_de_Registro_FieldExecuteBusinessRulesEnd
  }
  Usuario_que_Registra_ExecuteBusinessRules(): void {
    //Usuario_que_Registra_FieldExecuteBusinessRulesEnd
  }
  Nombre_de_Lista_Predeterminada_ExecuteBusinessRules(): void {
    //Nombre_de_Lista_Predeterminada_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:3210 - Ocultar Folio de lista predeterminada - Autor: Neftali - Actualización: 5/26/2021 11:21:36 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.HideFieldOfForm(this.Lista_PredeterminadaForm, "Folio"); this.brf.SetNotRequiredControl(this.Lista_PredeterminadaForm, "Folio");
    }
    //TERMINA - BRID:3210


    //INICIA - BRID:3214 - Asignar usuario , hora y fecha de registro en lista predeterminada - Autor: Neftali - Actualización: 5/26/2021 1:56:48 PM
    if (this.operation == 'New') {
      this.Lista_PredeterminadaForm.controls["Usuario_que_Registra"].setValue(this.UserId)
      this.Lista_PredeterminadaForm.controls["Fecha_de_Registro"].setValue(this.today)
      var now = moment().format("HH:mm:ss");
      this.Lista_PredeterminadaForm.controls["Hora_de_Registro"].setValue(now)

      //this.brf.SetValueFromQuery(this.Lista_PredeterminadaForm, "Fecha_de_Registro", this.brf.EvaluaQuery("select convert (varchar(11),getdate(),105)", 1, "ABC123"), 1, "ABC123");
      //this.brf.SetValueFromQuery(this.Lista_PredeterminadaForm, "Hora_de_Registro", this.brf.EvaluaQuery("select convert (varchar(8),getdate(),108)", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:3214


    //INICIA - BRID:3215 - Deshabilitar campos lista predeterminada - Autor: Neftali - Actualización: 5/26/2021 2:19:47 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetNotRequiredControl(this.Lista_PredeterminadaForm, "Fecha_de_Registro");
      this.brf.SetNotRequiredControl(this.Lista_PredeterminadaForm, "Hora_de_Registro");
      this.brf.SetNotRequiredControl(this.Lista_PredeterminadaForm, "Usuario_que_Registra");
      this.brf.SetEnabledControl(this.Lista_PredeterminadaForm, 'Fecha_de_Registro', 0);
      this.brf.SetEnabledControl(this.Lista_PredeterminadaForm, 'Hora_de_Registro', 0);
      this.brf.SetEnabledControl(this.Lista_PredeterminadaForm, 'Usuario_que_Registra', 0);
    }
    //TERMINA - BRID:3215

    //rulesOnInit_ExecuteBusinessRulesEnd


  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    setTimeout(() => {
      this.cancel();
    }, 4000);
    //rulesAfterSave_ExecuteBusinessRulesEnd
  }

  async rulesBeforeSave(): Promise<boolean> {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:3273 - Regla para verificar que la lista predeterminada contenga al menos un item - Autor: Neftali - Actualización: 5/26/2021 3:18:31 PM
    let lengthItem = this.dataSourceLista_Predeterminada_Detalle.data.filter(d => !d.IsDeleted).length;

    if (lengthItem == 0) {

      let message = "Debe capturar al menos 1 ítem"
      this.snackBar.open(message, '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['mat-toolbar', 'mat-warn']
      });

      result = false;
    }
    //TERMINA - BRID:3273

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas

  //#region Obtener Unidad de Medida
  getUnidadMedida() {

    this.sqlModel.query = `SELECT Clave, Descripcion FROM Unidad `

    this._SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      this.varUnidadMedida = result[0].Table

    });

  }
  //#endregion

  //#region Obtener Urgencia
  getUrgenciaArray() {

    this.sqlModel.query = `SELECT Folio, Descripcion FROM Urgencia `

    this._SpartanService.GetJsonQuery(this.sqlModel).subscribe((result) => {

      this.varUrgenciaArray = result[0].Table

    });

  }
  //#endregion

}
