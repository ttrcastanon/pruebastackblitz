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
import { Solicitud_de_cotizacionService } from 'src/app/api-services/Solicitud_de_cotizacion.service';
import { Solicitud_de_cotizacion } from 'src/app/models/Solicitud_de_cotizacion';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { detalle_de_configuracion_de_proveedoresService } from 'src/app/api-services/detalle_de_configuracion_de_proveedores.service';
import { detalle_de_configuracion_de_proveedores } from 'src/app/models/detalle_de_configuracion_de_proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';

import { Detalle_Solicitud_de_CotizacionService } from 'src/app/api-services/Detalle_Solicitud_de_Cotizacion.service';
import { Detalle_Solicitud_de_Cotizacion } from 'src/app/models/Detalle_Solicitud_de_Cotizacion';
import { PartesService } from 'src/app/api-services/Partes.service';
import { Partes } from 'src/app/models/Partes';
import { Catalogo_serviciosService } from 'src/app/api-services/Catalogo_servicios.service';
import { Catalogo_servicios } from 'src/app/models/Catalogo_servicios';
import { Listado_de_MaterialesService } from 'src/app/api-services/Listado_de_Materiales.service';
import { Listado_de_Materiales } from 'src/app/models/Listado_de_Materiales';
import { HerramientasService } from 'src/app/api-services/Herramientas.service';
import { Herramientas } from 'src/app/models/Herramientas';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Unidad } from 'src/app/models/Unidad';

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
import * as moment from 'moment';
import { Pre_Solicitud_de_CotizacionService } from 'src/app/api-services/Pre_Solicitud_de_Cotizacion.service';
import { PdfCloudService } from 'src/app/api-services/pdf-cloud.service';
import { base64ToArrayBuffer, saveByteArray } from 'src/app/functions/blob-function';
import { MessagesHelper } from 'src/app/helpers/messages-helper';

@Component({
  selector: 'app-Solicitud_de_cotizacion',
  templateUrl: './Solicitud_de_cotizacion.component.html',
  styleUrls: ['./Solicitud_de_cotizacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Solicitud_de_cotizacionComponent implements OnInit, AfterViewInit {
MRaddListado_a_Cotizar: boolean = false;
MRaddSeleccionar_proveedor: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }

  Solicitud_de_cotizacionForm: FormGroup;
  public Editor = ClassicEditor;
  model: Solicitud_de_cotizacion;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varSpartan_User: Spartan_User[] = [];
  public varCreacion_de_Proveedores: Creacion_de_Proveedores[] = [];

  autoProveedor_detalle_de_configuracion_de_proveedores = new FormControl();
  SelectedProveedor_detalle_de_configuracion_de_proveedores: string[] = [];
  isLoadingProveedor_detalle_de_configuracion_de_proveedores: boolean;
  searchProveedor_detalle_de_configuracion_de_proveedoresCompleted: boolean;

  public varPartes: Partes[] = [];
  public varCatalogo_servicios: Catalogo_servicios[] = [];
  public varListado_de_Materiales: Listado_de_Materiales[] = [];
  public varHerramientas: Herramientas[] = [];
  public varUnidad: Unidad[] = [];

  autoNo_de_Parte_Detalle_Solicitud_de_Cotizacion = new FormControl();
  SelectedNo_de_Parte_Detalle_Solicitud_de_Cotizacion: string[] = [];
  isLoadingNo_de_Parte_Detalle_Solicitud_de_Cotizacion: boolean;
  searchNo_de_Parte_Detalle_Solicitud_de_CotizacionCompleted: boolean;
  autoN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion = new FormControl();
  SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion: string[] = [];
  isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion: boolean;
  searchN_Servicio_Descripcion_Detalle_Solicitud_de_CotizacionCompleted: boolean;
  autoMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion = new FormControl();
  SelectedMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion: string[] = [];
  isLoadingMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion: boolean;
  searchMateriales_Codigo_Descripcion_Detalle_Solicitud_de_CotizacionCompleted: boolean;
  autoHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion = new FormControl();
  SelectedHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion: string[] = [];
  isLoadingHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion: boolean;
  searchHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_CotizacionCompleted: boolean;


  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceSeleccionar_proveedor = new MatTableDataSource<detalle_de_configuracion_de_proveedores>();
  Seleccionar_proveedorColumns = [
    { def: 'actions', hide: false },
    { def: 'Proveedor', hide: false },

  ];
  Seleccionar_proveedorData: detalle_de_configuracion_de_proveedores[] = [];
  isSeleccionar_proveedorAdd: boolean = true;


  dataSourceListado_a_Cotizar = new MatTableDataSource<Detalle_Solicitud_de_Cotizacion>();
  Listado_a_CotizarColumns = [
    { def: 'actions', hide: false },
    { def: 'No_de_Parte', hide: false },
    { def: 'N_Servicio_Descripcion', hide: false },
    { def: 'Materiales_Codigo_Descripcion', hide: false },
    { def: 'Herramientas_Codigo_Descripcion', hide: false },
    { def: 'Descripcion', hide: false },
    { def: 'Cantidad', hide: false },
    { def: 'Condicion', hide: false },
    { def: 'Unidad', hide: false },

  ];
  Listado_a_CotizarData: Detalle_Solicitud_de_Cotizacion[] = [];
  isListado_a_CotizarAdd: boolean = true;


  today = new Date;
  consult: boolean = false;

  bValidProveedor: boolean = false
  bValidLine: boolean = true

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Solicitud_de_cotizacionService: Solicitud_de_cotizacionService,
    private Spartan_UserService: Spartan_UserService,
    private detalle_de_configuracion_de_proveedoresService: detalle_de_configuracion_de_proveedoresService,
    private Creacion_de_ProveedoresService: Creacion_de_ProveedoresService,
    private Detalle_Solicitud_de_CotizacionService: Detalle_Solicitud_de_CotizacionService,
    private PartesService: PartesService,
    private Catalogo_serviciosService: Catalogo_serviciosService,
    private Listado_de_MaterialesService: Listado_de_MaterialesService,
    private HerramientasService: HerramientasService,
    private UnidadService: UnidadService,
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
    renderer: Renderer2,
    private pre_Solicitud_de_CotizacionService: Pre_Solicitud_de_CotizacionService,
    private pdfCloudService: PdfCloudService,
    private _messages: MessagesHelper,
  ) {

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId

    this.model = new Solicitud_de_cotizacion(this.fb);
    this.Solicitud_de_cotizacionForm = this.model.buildFormGroup();
    this.Seleccionar_proveedorItems.removeAt(0);
    this.Listado_a_CotizarItems.removeAt(0);

    this.Solicitud_de_cotizacionForm.get('Folio').disable();
    this.Solicitud_de_cotizacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceSeleccionar_proveedor.paginator = this.paginator;
    this.dataSourceListado_a_Cotizar.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Seleccionar_proveedorColumns.splice(0, 1);
        this.Listado_a_CotizarColumns.splice(0, 1);

        this.Solicitud_de_cotizacionForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_cotizacion)
      .subscribe((response) => {
        this.permisos = response;
      });




    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Solicitud_de_cotizacionService.listaSelAll(0, 1, 'Solicitud_de_cotizacion.Folio=' + id).toPromise();
    if (result.Solicitud_de_cotizacions.length > 0) {
      let fSeleccionar_proveedor = await this.detalle_de_configuracion_de_proveedoresService.listaSelAll(0, 1000, 'Solicitud_de_cotizacion.Folio=' + id).toPromise();
      this.Seleccionar_proveedorData = fSeleccionar_proveedor.detalle_de_configuracion_de_proveedoress;
      this.loadSeleccionar_proveedor(fSeleccionar_proveedor.detalle_de_configuracion_de_proveedoress);
      this.dataSourceSeleccionar_proveedor = new MatTableDataSource(fSeleccionar_proveedor.detalle_de_configuracion_de_proveedoress);
      this.dataSourceSeleccionar_proveedor.paginator = this.paginator;
      this.dataSourceSeleccionar_proveedor.sort = this.sort;
      let fListado_a_Cotizar = await this.Detalle_Solicitud_de_CotizacionService.listaSelAll(0, 1000, 'Solicitud_de_cotizacion.Folio=' + id).toPromise();
      this.Listado_a_CotizarData = fListado_a_Cotizar.Detalle_Solicitud_de_Cotizacions;
      this.loadListado_a_Cotizar(fListado_a_Cotizar.Detalle_Solicitud_de_Cotizacions);
      this.dataSourceListado_a_Cotizar = new MatTableDataSource(fListado_a_Cotizar.Detalle_Solicitud_de_Cotizacions);
      this.dataSourceListado_a_Cotizar.paginator = this.paginator;
      this.dataSourceListado_a_Cotizar.sort = this.sort;

      this.model.fromObject(result.Solicitud_de_cotizacions[0]);

      this.Solicitud_de_cotizacionForm.markAllAsTouched();
      this.Solicitud_de_cotizacionForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Seleccionar_proveedorItems() {
    return this.Solicitud_de_cotizacionForm.get('detalle_de_configuracion_de_proveedoresItems') as FormArray;
  }


  getSeleccionar_proveedorColumns(): string[] {
    return this.Seleccionar_proveedorColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSeleccionar_proveedor(Seleccionar_proveedor: detalle_de_configuracion_de_proveedores[]) {
    Seleccionar_proveedor.forEach(element => {
      this.addSeleccionar_proveedor(element);
    });
  }

  addSeleccionar_proveedorToMR() {
    const Seleccionar_proveedor = new detalle_de_configuracion_de_proveedores(this.fb);
    this.Seleccionar_proveedorData.push(this.addSeleccionar_proveedor(Seleccionar_proveedor));
    this.dataSourceSeleccionar_proveedor.data = this.Seleccionar_proveedorData;
    Seleccionar_proveedor.edit = true;
    Seleccionar_proveedor.isNew = true;
    const length = this.dataSourceSeleccionar_proveedor.data.length;
    const index = length - 1;
    const formSeleccionar_proveedor = this.Seleccionar_proveedorItems.controls[index] as FormGroup;
    this.addFilterToControlProveedor_detalle_de_configuracion_de_proveedores(formSeleccionar_proveedor.controls.Proveedor, index);

    const page = Math.ceil(this.dataSourceSeleccionar_proveedor.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addSeleccionar_proveedor(entity: detalle_de_configuracion_de_proveedores) {
    const Seleccionar_proveedor = new detalle_de_configuracion_de_proveedores(this.fb);
    this.Seleccionar_proveedorItems.push(Seleccionar_proveedor.buildFormGroup());
    if (entity) {
      Seleccionar_proveedor.fromObject(entity);
    }
    return entity;
  }

  Seleccionar_proveedorItemsByFolio(Folio: number): FormGroup {
    return (this.Solicitud_de_cotizacionForm.get('detalle_de_configuracion_de_proveedoresItems') as FormArray).controls.find(c => c.get('Clave').value === Folio) as FormGroup;
  }

  Seleccionar_proveedorItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSeleccionar_proveedor.data.indexOf(element);
    let fb = this.Seleccionar_proveedorItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSeleccionar_proveedor(element: any) {

    this._messages.confirmation("¿Está seguro de que desea eliminar este registro?", "")
      .then(() => {
        let index = this.dataSourceSeleccionar_proveedor.data.indexOf(element);
        this.Seleccionar_proveedorData[index].IsDeleted = true;
        this.dataSourceSeleccionar_proveedor.data = this.Seleccionar_proveedorData;
        this.dataSourceSeleccionar_proveedor._updateChangeSubscription();
        index = this.dataSourceSeleccionar_proveedor.data.filter(d => !d.IsDeleted).length;
        const page = Math.ceil(index / this.paginator.pageSize);
        if (page !== this.paginator.pageIndex) {
          this.paginator.pageIndex = page;
        }
      })

  }

  cancelEditSeleccionar_proveedor(element: any) {
    let index = this.dataSourceSeleccionar_proveedor.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Seleccionar_proveedorData[index].IsDeleted = true;
      this.dataSourceSeleccionar_proveedor.data = this.Seleccionar_proveedorData;
      this.dataSourceSeleccionar_proveedor._updateChangeSubscription();
      index = this.Seleccionar_proveedorData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveSeleccionar_proveedor(element: any) {
    const index = this.dataSourceSeleccionar_proveedor.data.indexOf(element);
    const formSeleccionar_proveedor = this.Seleccionar_proveedorItems.controls[index] as FormGroup;
    if (this.Seleccionar_proveedorData[index].Proveedor !== formSeleccionar_proveedor.value.Proveedor && formSeleccionar_proveedor.value.Proveedor > 0) {
      let creacion_de_proveedores = await this.Creacion_de_ProveedoresService.getById(formSeleccionar_proveedor.value.Proveedor).toPromise();
      this.Seleccionar_proveedorData[index].Proveedor_Creacion_de_Proveedores = creacion_de_proveedores;
    }
    this.Seleccionar_proveedorData[index].Proveedor = formSeleccionar_proveedor.value.Proveedor;

    this.Seleccionar_proveedorData[index].isNew = false;
    this.dataSourceSeleccionar_proveedor.data = this.Seleccionar_proveedorData;
    this.dataSourceSeleccionar_proveedor._updateChangeSubscription();
  }

  editSeleccionar_proveedor(element: any) {
    const index = this.dataSourceSeleccionar_proveedor.data.indexOf(element);
    const formSeleccionar_proveedor = this.Seleccionar_proveedorItems.controls[index] as FormGroup;
    this.SelectedProveedor_detalle_de_configuracion_de_proveedores[index] = this.dataSourceSeleccionar_proveedor.data[index].Proveedor_Creacion_de_Proveedores.Razon_social;
    this.addFilterToControlProveedor_detalle_de_configuracion_de_proveedores(formSeleccionar_proveedor.controls.Proveedor, index);

    element.edit = true;
  }

  async savedetalle_de_configuracion_de_proveedores(Folio: number) {
    this.dataSourceSeleccionar_proveedor.data.forEach(async (d, index) => {
      const data = this.Seleccionar_proveedorItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Solicitud_de_cotizacion = Folio;


      if (model.Clave === 0) {
        // Add Seleccionar proveedor
        let response = await this.detalle_de_configuracion_de_proveedoresService.insert(model).toPromise();
      } else if (model.Clave > 0 && !d.IsDeleted) {
        const formSeleccionar_proveedor = this.Seleccionar_proveedorItemsByFolio(model.Clave);
        if (formSeleccionar_proveedor.dirty) {
          // Update Seleccionar proveedor
          let response = await this.detalle_de_configuracion_de_proveedoresService.update(model.Clave, model).toPromise();
        }
      } else if (model.Clave > 0 && d.IsDeleted) {
        // delete Seleccionar proveedor
        await this.detalle_de_configuracion_de_proveedoresService.delete(model.Clave).toPromise();
      }
    });
  }

  public selectProveedor_detalle_de_configuracion_de_proveedores(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceSeleccionar_proveedor.data.indexOf(element);
    if (!event.option) {
      return;
    }
    if (this.bValidProveedor) {
      this.SelectedProveedor_detalle_de_configuracion_de_proveedores[index] = event.option.viewValue;
      let fgr = this.Solicitud_de_cotizacionForm.controls.detalle_de_configuracion_de_proveedoresItems as FormArray;
      let data = fgr.controls[index] as FormGroup;
      data.controls.Proveedor.setValue(event.option.value);
      this.displayFnProveedor_detalle_de_configuracion_de_proveedores(element);
      this.bValidLine = true;
    }
    else {
      this.bValidLine = false
    }
  }

  displayFnProveedor_detalle_de_configuracion_de_proveedores(this, element) {
    const index = this.dataSourceSeleccionar_proveedor.data.indexOf(element);
    return this.SelectedProveedor_detalle_de_configuracion_de_proveedores[index];
  }
  updateOptionProveedor_detalle_de_configuracion_de_proveedores(event, element: any) {

    this.bValidProveedor = true;
    const index = this.dataSourceSeleccionar_proveedor.data.indexOf(element);

    this.dataSourceSeleccionar_proveedor.data.forEach(element => {

      if (!element["IsDeleted"] && element.Proveedor == event.source.value) {
        let message = "No es permitido capturar proveedores repetidos."
        this.snackBar.open(message, '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['mat-toolbar', 'mat-warn']
        });

        this.bValidProveedor = false
        this.bValidLine = false
      }

    });
    if (this.bValidProveedor) {
      this.SelectedProveedor_detalle_de_configuracion_de_proveedores[index] = event.source.viewValue;
    }
    else {
      let data = this.Seleccionar_proveedorItems.controls[index] as FormGroup;
      data.controls["Proveedor"].setValue(null)
    }

  }

  _filterProveedor_detalle_de_configuracion_de_proveedores(filter: any): Observable<Creacion_de_Proveedores> {
    const where = filter !== '' ? "Creacion_de_Proveedores.Razon_social like '%" + filter + "%'" : '';
    return this.Creacion_de_ProveedoresService.listaSelAll(0, 20, where);
  }

  addFilterToControlProveedor_detalle_de_configuracion_de_proveedores(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingProveedor_detalle_de_configuracion_de_proveedores = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingProveedor_detalle_de_configuracion_de_proveedores = true;
        return this._filterProveedor_detalle_de_configuracion_de_proveedores(value || '');
      })
    ).subscribe(result => {
      this.varCreacion_de_Proveedores = result.Creacion_de_Proveedoress;
      this.isLoadingProveedor_detalle_de_configuracion_de_proveedores = false;
      this.searchProveedor_detalle_de_configuracion_de_proveedoresCompleted = true;
      this.SelectedProveedor_detalle_de_configuracion_de_proveedores[index] = this.varCreacion_de_Proveedores.length === 0 ? '' : this.SelectedProveedor_detalle_de_configuracion_de_proveedores[index];
    });
  }

  get Listado_a_CotizarItems() {
    return this.Solicitud_de_cotizacionForm.get('Detalle_Solicitud_de_CotizacionItems') as FormArray;
  }

  getListado_a_CotizarColumns(): string[] {
    return this.Listado_a_CotizarColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadListado_a_Cotizar(Listado_a_Cotizar: Detalle_Solicitud_de_Cotizacion[]) {
    Listado_a_Cotizar.forEach(element => {
      this.addListado_a_Cotizar(element);
    });
  }

  addListado_a_CotizarToMR() {
    const Listado_a_Cotizar = new Detalle_Solicitud_de_Cotizacion(this.fb);
    this.Listado_a_CotizarData.push(this.addListado_a_Cotizar(Listado_a_Cotizar));
    this.dataSourceListado_a_Cotizar.data = this.Listado_a_CotizarData;
    Listado_a_Cotizar.edit = true;
    Listado_a_Cotizar.isNew = true;
    const length = this.dataSourceListado_a_Cotizar.data.length;
    const index = length - 1;
    const formListado_a_Cotizar = this.Listado_a_CotizarItems.controls[index] as FormGroup;
    this.addFilterToControlNo_de_Parte_Detalle_Solicitud_de_Cotizacion(formListado_a_Cotizar.controls.No_de_Parte, index);
    this.addFilterToControlN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion(formListado_a_Cotizar.controls.N_Servicio_Descripcion, index);
    this.addFilterToControlMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(formListado_a_Cotizar.controls.Materiales_Codigo_Descripcion, index);
    this.addFilterToControlHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(formListado_a_Cotizar.controls.Herramientas_Codigo_Descripcion, index);

    const page = Math.ceil(this.dataSourceListado_a_Cotizar.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addListado_a_Cotizar(entity: Detalle_Solicitud_de_Cotizacion) {
    const Listado_a_Cotizar = new Detalle_Solicitud_de_Cotizacion(this.fb);
    this.Listado_a_CotizarItems.push(Listado_a_Cotizar.buildFormGroup());
    if (entity) {
      Listado_a_Cotizar.fromObject(entity);
    }
    return entity;
  }

  Listado_a_CotizarItemsByFolio(Folio: number): FormGroup {
    return (this.Solicitud_de_cotizacionForm.get('Detalle_Solicitud_de_CotizacionItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Listado_a_CotizarItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    let fb = this.Listado_a_CotizarItems.controls[index] as FormGroup;
    return fb;
  }

  deleteListado_a_Cotizar(element: any) {
    let index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    this.Listado_a_CotizarData[index].IsDeleted = true;
    this.dataSourceListado_a_Cotizar.data = this.Listado_a_CotizarData;
    this.dataSourceListado_a_Cotizar._updateChangeSubscription();
    index = this.dataSourceListado_a_Cotizar.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditListado_a_Cotizar(element: any) {
    let index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Listado_a_CotizarData[index].IsDeleted = true;
      this.dataSourceListado_a_Cotizar.data = this.Listado_a_CotizarData;
      this.dataSourceListado_a_Cotizar._updateChangeSubscription();
      index = this.Listado_a_CotizarData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveListado_a_Cotizar(element: any) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    const formListado_a_Cotizar = this.Listado_a_CotizarItems.controls[index] as FormGroup;
    if (this.Listado_a_CotizarData[index].No_de_Parte !== formListado_a_Cotizar.value.No_de_Parte && formListado_a_Cotizar.value.No_de_Parte > 0) {
      let partes = await this.PartesService.getById(formListado_a_Cotizar.value.No_de_Parte).toPromise();
      this.Listado_a_CotizarData[index].No_de_Parte_Partes = partes;
    }
    this.Listado_a_CotizarData[index].No_de_Parte = formListado_a_Cotizar.value.No_de_Parte;
    if (this.Listado_a_CotizarData[index].N_Servicio_Descripcion !== formListado_a_Cotizar.value.N_Servicio_Descripcion && formListado_a_Cotizar.value.N_Servicio_Descripcion > 0) {
      let catalogo_servicios = await this.Catalogo_serviciosService.getById(formListado_a_Cotizar.value.N_Servicio_Descripcion).toPromise();
      this.Listado_a_CotizarData[index].N_Servicio_Descripcion_Catalogo_servicios = catalogo_servicios;
    }
    this.Listado_a_CotizarData[index].N_Servicio_Descripcion = formListado_a_Cotizar.value.N_Servicio_Descripcion;
    if (this.Listado_a_CotizarData[index].Materiales_Codigo_Descripcion !== formListado_a_Cotizar.value.Materiales_Codigo_Descripcion && formListado_a_Cotizar.value.Materiales_Codigo_Descripcion > 0) {
      let listado_de_materiales = await this.Listado_de_MaterialesService.getById(formListado_a_Cotizar.value.Materiales_Codigo_Descripcion).toPromise();
      this.Listado_a_CotizarData[index].Materiales_Codigo_Descripcion_Listado_de_Materiales = listado_de_materiales;
    }
    this.Listado_a_CotizarData[index].Materiales_Codigo_Descripcion = formListado_a_Cotizar.value.Materiales_Codigo_Descripcion;
    if (this.Listado_a_CotizarData[index].Herramientas_Codigo_Descripcion !== formListado_a_Cotizar.value.Herramientas_Codigo_Descripcion && formListado_a_Cotizar.value.Herramientas_Codigo_Descripcion > 0) {
      let herramientas = await this.HerramientasService.getById(formListado_a_Cotizar.value.Herramientas_Codigo_Descripcion).toPromise();
      this.Listado_a_CotizarData[index].Herramientas_Codigo_Descripcion_Herramientas = herramientas;
    }
    this.Listado_a_CotizarData[index].Herramientas_Codigo_Descripcion = formListado_a_Cotizar.value.Herramientas_Codigo_Descripcion;
    this.Listado_a_CotizarData[index].Descripcion = formListado_a_Cotizar.value.Descripcion;
    this.Listado_a_CotizarData[index].Cantidad = formListado_a_Cotizar.value.Cantidad;
    this.Listado_a_CotizarData[index].Condicion = formListado_a_Cotizar.value.Condicion;
    this.Listado_a_CotizarData[index].Unidad = formListado_a_Cotizar.value.Unidad;
    this.Listado_a_CotizarData[index].Unidad_Unidad = formListado_a_Cotizar.value.Unidad !== '' ?
      this.varUnidad.filter(d => d.Clave === formListado_a_Cotizar.value.Unidad)[0] : null;

    this.Listado_a_CotizarData[index].isNew = false;
    this.dataSourceListado_a_Cotizar.data = this.Listado_a_CotizarData;
    this.dataSourceListado_a_Cotizar._updateChangeSubscription();
  }

  editListado_a_Cotizar(element: any) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    const formListado_a_Cotizar = this.Listado_a_CotizarItems.controls[index] as FormGroup;
    this.SelectedNo_de_Parte_Detalle_Solicitud_de_Cotizacion[index] = this.dataSourceListado_a_Cotizar.data[index].No_de_Parte_Partes.Numero_de_parte_Descripcion;
    this.addFilterToControlNo_de_Parte_Detalle_Solicitud_de_Cotizacion(formListado_a_Cotizar.controls.No_de_Parte, index);
    this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = this.dataSourceListado_a_Cotizar.data[index].N_Servicio_Descripcion_Catalogo_servicios.Codigo_Descripcion;
    this.addFilterToControlN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion(formListado_a_Cotizar.controls.N_Servicio_Descripcion, index);
    this.SelectedMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = this.dataSourceListado_a_Cotizar.data[index].Materiales_Codigo_Descripcion_Listado_de_Materiales.Codigo_Descripcion;
    this.addFilterToControlMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(formListado_a_Cotizar.controls.Materiales_Codigo_Descripcion, index);
    this.SelectedHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = this.dataSourceListado_a_Cotizar.data[index].Herramientas_Codigo_Descripcion_Herramientas.Codigo_Descripcion;
    this.addFilterToControlHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(formListado_a_Cotizar.controls.Herramientas_Codigo_Descripcion, index);

    element.edit = true;
  }

  async saveDetalle_Solicitud_de_Cotizacion(Folio: number) {
    this.dataSourceListado_a_Cotizar.data.forEach(async (d, index) => {
      const data = this.Listado_a_CotizarItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Solicitud_de_cotizacion = Folio;


      if (model.Folio === 0 && !d.IsDeleted) {
        // Add Listado a Cotizar
        let response = await this.Detalle_Solicitud_de_CotizacionService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formListado_a_Cotizar = this.Listado_a_CotizarItemsByFolio(model.Folio);
        if (formListado_a_Cotizar.dirty) {
          // Update Listado a Cotizar
          let response = await this.Detalle_Solicitud_de_CotizacionService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Listado a Cotizar
        await this.Detalle_Solicitud_de_CotizacionService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectNo_de_Parte_Detalle_Solicitud_de_Cotizacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedNo_de_Parte_Detalle_Solicitud_de_Cotizacion[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_cotizacionForm.controls.Detalle_Solicitud_de_CotizacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.No_de_Parte.setValue(event.option.value);
    this.displayFnNo_de_Parte_Detalle_Solicitud_de_Cotizacion(element);
  }

  displayFnNo_de_Parte_Detalle_Solicitud_de_Cotizacion(this, element) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    return this.SelectedNo_de_Parte_Detalle_Solicitud_de_Cotizacion[index];
  }
  updateOptionNo_de_Parte_Detalle_Solicitud_de_Cotizacion(event, element: any) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    this.SelectedNo_de_Parte_Detalle_Solicitud_de_Cotizacion[index] = event.source.viewValue;
  }

  _filterNo_de_Parte_Detalle_Solicitud_de_Cotizacion(filter: any): Observable<Partes> {
    const where = filter !== '' ? "Partes.Numero_de_parte_Descripcion like '%" + filter + "%'" : '';
    return this.PartesService.listaSelAll(0, 20, where);
  }

  addFilterToControlNo_de_Parte_Detalle_Solicitud_de_Cotizacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingNo_de_Parte_Detalle_Solicitud_de_Cotizacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingNo_de_Parte_Detalle_Solicitud_de_Cotizacion = true;
        return this._filterNo_de_Parte_Detalle_Solicitud_de_Cotizacion(value || '');
      })
    ).subscribe(result => {
      this.varPartes = result.Partess;
      this.isLoadingNo_de_Parte_Detalle_Solicitud_de_Cotizacion = false;
      this.searchNo_de_Parte_Detalle_Solicitud_de_CotizacionCompleted = true;
      this.SelectedNo_de_Parte_Detalle_Solicitud_de_Cotizacion[index] = this.varPartes.length === 0 ? '' : this.SelectedNo_de_Parte_Detalle_Solicitud_de_Cotizacion[index];
    });
  }
  public selectN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_cotizacionForm.controls.Detalle_Solicitud_de_CotizacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.N_Servicio_Descripcion.setValue(event.option.value);
    this.displayFnN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion(element);
  }

  displayFnN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion(this, element) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    return this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion[index];
  }
  updateOptionN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion(event, element: any) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = event.source.viewValue;
  }

  _filterN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion(filter: any): Observable<Catalogo_servicios> {
    const where = filter !== '' ? "Catalogo_servicios.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Catalogo_serviciosService.listaSelAll(0, 20, where);
  }

  addFilterToControlN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion = true;
        return this._filterN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion(value || '');
      })
    ).subscribe(result => {
      this.varCatalogo_servicios = result.Catalogo_servicioss;
      this.isLoadingN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion = false;
      this.searchN_Servicio_Descripcion_Detalle_Solicitud_de_CotizacionCompleted = true;
      this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = this.varCatalogo_servicios.length === 0 ? '' : this.SelectedN_Servicio_Descripcion_Detalle_Solicitud_de_Cotizacion[index];
    });
  }
  public selectMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_cotizacionForm.controls.Detalle_Solicitud_de_CotizacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Materiales_Codigo_Descripcion.setValue(event.option.value);
    this.displayFnMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(element);
  }

  displayFnMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(this, element) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    return this.SelectedMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index];
  }
  updateOptionMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(event, element: any) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    this.SelectedMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = event.source.viewValue;
  }

  _filterMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(filter: any): Observable<Listado_de_Materiales> {
    const where = filter !== '' ? "Listado_de_Materiales.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.Listado_de_MaterialesService.listaSelAll(0, 20, where);
  }

  addFilterToControlMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion = true;
        return this._filterMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(value || '');
      })
    ).subscribe(result => {
      this.varListado_de_Materiales = result.Listado_de_Materialess;
      this.isLoadingMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion = false;
      this.searchMateriales_Codigo_Descripcion_Detalle_Solicitud_de_CotizacionCompleted = true;
      this.SelectedMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = this.varListado_de_Materiales.length === 0 ? '' : this.SelectedMateriales_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index];
    });
  }
  public selectHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = event.option.viewValue;
    let fgr = this.Solicitud_de_cotizacionForm.controls.Detalle_Solicitud_de_CotizacionItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Herramientas_Codigo_Descripcion.setValue(event.option.value);
    this.displayFnHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(element);
  }

  displayFnHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(this, element) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    return this.SelectedHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index];
  }
  updateOptionHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(event, element: any) {
    const index = this.dataSourceListado_a_Cotizar.data.indexOf(element);
    this.SelectedHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = event.source.viewValue;
  }

  _filterHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(filter: any): Observable<Herramientas> {
    const where = filter !== '' ? "Herramientas.Codigo_Descripcion like '%" + filter + "%'" : '';
    return this.HerramientasService.listaSelAll(0, 20, where);
  }

  addFilterToControlHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion = true;
        return this._filterHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion(value || '');
      })
    ).subscribe(result => {
      this.varHerramientas = result.Herramientass;
      this.isLoadingHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion = false;
      this.searchHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_CotizacionCompleted = true;
      this.SelectedHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index] = this.varHerramientas.length === 0 ? '' : this.SelectedHerramientas_Codigo_Descripcion_Detalle_Solicitud_de_Cotizacion[index];
    });
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Solicitud_de_cotizacionForm.disabled ? "Update" : this.operation;
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

    observablesArray.push(this.UnidadService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varSpartan_User, varUnidad]) => {
          this.varSpartan_User = varSpartan_User;

          this.varUnidad = varUnidad;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Usuario_que_Registra': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }

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

  validateSave(): boolean {
    var result: boolean = true
    let array: any = this.dataSourceSeleccionar_proveedor.data.filter(d => !d.IsDeleted)

    if (array.length == 0) {
      const message = "Falta agregar un proveedor."

      this.snackBar.open(message, '', {
        duration: 4000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: ['mat-toolbar', "mat-warn"]
      });
      result = false
    }

    return result
  }


  async save(type?: any) {

    if (this.validateSave()) {
      await this.saveData(type);
    }
  }

  async saveData(type): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Solicitud_de_cotizacionForm.value;
      entity.Folio = this.model.Folio;

      if (this.model.Folio > 0) {
        await this.Solicitud_de_cotizacionService.update(this.model.Folio, entity).toPromise();

        await this.savedetalle_de_configuracion_de_proveedores(this.model.Folio);
        await this.saveDetalle_Solicitud_de_Cotizacion(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Solicitud_de_cotizacionService.insert(entity).toPromise().then(async id => {
          await this.savedetalle_de_configuracion_de_proveedores(id);
          await this.saveDetalle_Solicitud_de_Cotizacion(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          this.createPreSolicitud(id, type)


          return id;
        }));
      }

      this.rulesAfterSave();
      this.isLoading = false;
    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData('send');
    if (this.model.Folio === 0) {
      this.Solicitud_de_cotizacionForm.reset();
      this.model = new Solicitud_de_cotizacion(this.fb);
      this.Solicitud_de_cotizacionForm = this.model.buildFormGroup();
      this.dataSourceSeleccionar_proveedor = new MatTableDataSource<detalle_de_configuracion_de_proveedores>();
      this.Seleccionar_proveedorData = [];
      this.dataSourceListado_a_Cotizar = new MatTableDataSource<Detalle_Solicitud_de_Cotizacion>();
      this.Listado_a_CotizarData = [];

    } else {
      this.router.navigate(['views/Solicitud_de_cotizacion/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData('send');
    this.model.Folio = 0;

  }

  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Solicitud_de_cotizacion/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Usuario_que_Registra_ExecuteBusinessRules(): void {
    //Usuario_que_Registra_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Registro_ExecuteBusinessRules(): void {
    //Fecha_de_Registro_FieldExecuteBusinessRulesEnd
  }
  Hora_de_Registro_ExecuteBusinessRules(): void {
    //Hora_de_Registro_FieldExecuteBusinessRulesEnd
  }
  Mensaje_de_correo_ExecuteBusinessRules(): void {
    //Mensaje_de_correo_FieldExecuteBusinessRulesEnd
  }
  Comentarios_Adicionales_ExecuteBusinessRules(): void {
    //Comentarios_Adicionales_FieldExecuteBusinessRulesEnd
  }
  Folio_Solicitud_de_Cotizacion_ExecuteBusinessRules(): void {
    //Folio_Solicitud_de_Cotizacion_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:3949 - Comentarios asignar no requerido  - Autor: Lizeth Villa - Actualización: 7/2/2021 12:53:32 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetNotRequiredControl(this.Solicitud_de_cotizacionForm, "Comentarios_Adicionales");
      this.brf.SetNotRequiredControl(this.Solicitud_de_cotizacionForm, "Folio_Solicitud_de_Cotizacion");
    }
    //TERMINA - BRID:3949


    //INICIA - BRID:4009 - Ocultar codigos de mr  - Autor: Lizeth Villa - Actualización: 7/5/2021 9:38:22 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldofMultirenglon(this.Listado_a_CotizarColumns, "actions");

      this.brf.HideFieldofMultirenglon(this.Listado_a_CotizarColumns, "No_de_Parte");
      this.brf.HideFieldofMultirenglon(this.Listado_a_CotizarColumns, "N_Servicio_Descripcion");
      this.brf.HideFieldofMultirenglon(this.Listado_a_CotizarColumns, "Materiales_Codigo_Descripcion");
      this.brf.HideFieldofMultirenglon(this.Listado_a_CotizarColumns, "Herramientas_Codigo_Descripcion");


    }
    //TERMINA - BRID:4009


    //INICIA - BRID:4056 - Asignar usuario, fecha, hora  - Autor: Lizeth Villa - Actualización: 7/2/2021 11:42:51 AM
    if (this.operation == 'New') {

      this.Solicitud_de_cotizacionForm.controls["Usuario_que_Registra"].setValue(this.UserId)
      this.Solicitud_de_cotizacionForm.controls["Fecha_de_Registro"].setValue(this.today)
      var now = moment().format("HH:mm:ss");
      this.Solicitud_de_cotizacionForm.controls["Hora_de_Registro"].setValue(now)

      /* this.brf.SetValueFromQuery(this.Solicitud_de_cotizacionForm, "Usuario_que_Registra", this.brf.EvaluaQuery(`select ${this.UserId}`, 1, "ABC123"), 1, "ABC123");
      this.brf.SetValueFromQuery(this.Solicitud_de_cotizacionForm, "Fecha_de_Registro", this.brf.EvaluaQuery(" select convert (varchar(11),getdate(),105)", 1, "ABC123"), 1, "ABC123");
      this.brf.SetValueFromQuery(this.Solicitud_de_cotizacionForm, "Hora_de_Registro", this.brf.EvaluaQuery(" select convert (varchar(8),getdate(),108)", 1, "ABC123"), 1, "ABC123"); */
    }
    //TERMINA - BRID:4056


    //INICIA - BRID:4058 - deshabilitar y ocultar campos siempre  - Autor: Lizeth Villa - Actualización: 7/2/2021 12:58:13 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.Solicitud_de_cotizacionForm, 'Folio_Solicitud_de_Cotizacion', 0);
      this.brf.SetEnabledControl(this.Solicitud_de_cotizacionForm, 'Usuario_que_Registra', 0);
      this.brf.SetEnabledControl(this.Solicitud_de_cotizacionForm, 'Fecha_de_Registro', 0);
      this.brf.SetEnabledControl(this.Solicitud_de_cotizacionForm, 'Hora_de_Registro', 0);
      this.brf.HideFieldOfForm(this.Solicitud_de_cotizacionForm, "Folio_Solicitud_de_Cotizacion");
      this.brf.SetNotRequiredControl(this.Solicitud_de_cotizacionForm, "Folio_Solicitud_de_Cotizacion");
    }
    //TERMINA - BRID:4058

    //INICIA - BRID:6376 - regla para guardar folio (formato de impresión) - Autor: Eliud Hernandez - Actualización: 9/22/2021 10:24:06 AM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery("EXEC ActFolioSolicitudCotizacion GLOBAL[KeyValueInserted]", 1, "ABC123");
    }
    //TERMINA - BRID:6376

    this.GetListadoACotizar()

    //rulesOnInit_ExecuteBusinessRulesEnd


  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    let KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted);
    //INICIA - BRID:4059 - Asignar folio a campo folio solicitud - Autor: Lizeth Villa - Actualización: 7/2/2021 12:55:54 PM
    if (this.operation == 'New') {
      this.brf.SetValueFromQuery(this.Solicitud_de_cotizacionForm, "Folio_Solicitud_de_Cotizacion", this.brf.EvaluaQuery(`UPDATE Solicitud_de_cotizacion SET Folio_Solicitud_de_Cotizacion = FOLIO WHERE FOLIO = ${KeyValueInserted}`, 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:4059


    //INICIA - BRID:7111 - Envíar correo solicitud de cotización - Autor: Agustín Administrador - Actualización: 10/13/2021 5:49:32 PM
    if (this.operation == 'New') {
      //this.brf.SendEmailQueryPrintSenderFormat("test", this.brf.EvaluaQuery("select Correo_electronico FROM Creacion_de_Proveedores where Clave = FLD[Proveedor]", 1, "ABC123"), "Correo de test de prueba sender",test,this.brf.EvaluaQuery("test", 1, "ABC123"),this.brf.EvaluaQuery("@@parameter6.value@@", 1, "ABC123"));
    }
    //TERMINA - BRID:7111


    //rulesAfterSave_ExecuteBusinessRulesEnd


  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas

  closeWindowCancel(): void {
    window.close();
  }

  disableFields() {
    this.brf.SetEnabledControl(this.Solicitud_de_cotizacionForm, 'Folio_Solicitud_de_Cotizacion', 0);
    this.brf.SetEnabledControl(this.Solicitud_de_cotizacionForm, 'Usuario_que_Registra', 0);
    this.brf.SetEnabledControl(this.Solicitud_de_cotizacionForm, 'Fecha_de_Registro', 0);
    this.brf.SetEnabledControl(this.Solicitud_de_cotizacionForm, 'Hora_de_Registro', 0);
    this.brf.HideFieldOfForm(this.Solicitud_de_cotizacionForm, "Folio_Solicitud_de_Cotizacion");
    this.brf.SetNotRequiredControl(this.Solicitud_de_cotizacionForm, "Folio_Solicitud_de_Cotizacion");
  }


  //#region Obtener Listado a Cotizar
  GetListadoACotizar() {
    const stringListadoCotizar = this.localStorageHelper.getItemFromLocalStorage("ListadoCotizar");

    var arrayListadoCotizar = JSON.parse(stringListadoCotizar)

    if (arrayListadoCotizar != null && arrayListadoCotizar.length > 0) {

      this.generateMatTable(arrayListadoCotizar)
    }

    this.localStorageHelper.removeItemFromLocalStorage("ListadoCotizar")

  }
  //#endregion


  //#region Generar Mat Table
  generateMatTable(array) {
    this.loadListado_a_Cotizar(array);
    this.dataSourceListado_a_Cotizar = new MatTableDataSource(array);
    this.dataSourceListado_a_Cotizar.paginator = this.paginator;
    this.dataSourceListado_a_Cotizar.sort = this.sort;
  }
  //#endregion


  //#region Crear Pre solicitud
  async createPreSolicitud(IdSolicitud, tipo) {

    let array: any = this.dataSourceSeleccionar_proveedor.data.filter(d => !d.IsDeleted)

    array.forEach((element, index) => {
      let entity: any = element
      entity.Folio = 0;
      entity.Folio_Proveedor = element.Clave
      entity.Folio_Solicitud_Cotizacion = IdSolicitud

      this.pre_Solicitud_de_CotizacionService.insert(entity).toPromise().then(async idPreSolicitud => {

        if (index == array.length - 1) {
          if (tipo == "send") {
            this.EnviarCorreo_sc(IdSolicitud)
          }
          else if (tipo == "print") {
            this.PrintPDF(idPreSolicitud)
          }
        }

      });

    });

  }
  //#endregion


  //#region Obtener Correo de usuario
  EnviarCorreo_sc(IdSolicitud) {

    let texto_personalizado = this.Solicitud_de_cotizacionForm.controls["Mensaje_de_correo"].value
    let correo_usuario: string = ""

    //Funcion Correo Usuario
    this.sqlModel.query = `SELECT email FROM Spartan_User WITH(NOLOCK) WHERE Id_User =  ${this.UserId}`;

    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        correo_usuario = response
      },
      error: (e) => console.error(e),
      complete: () => {
        let bodyMail = "<!doctype html><html><head> <meta charset='utf-8'> <meta name='viewport' content='width=device-width, initial-scale=1.0'> <meta http-equiv='X-UA-Compatible' content='IE=edge'> <title>EmailTemplate-Fluid</title> <style type='text/css'> html, body{margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important;}*{-ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%;}.ExternalClass{width: 100%;}div[style*='margin: 16px 0']{margin: 0 !important;}table, td{mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important;}table{border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important;}table table table{table-layout: auto;}img{-ms-interpolation-mode: bicubic;}.yshortcuts a{border-bottom: none !important;}a[x-apple-data-detectors]{color: inherit !important;}/* Estilos Hover para botones */ .button-td, .button-a{transition: all 100ms ease-in;}.button-td:hover, .button-a:hover{color: #000;}</style></head><body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'> <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0' style='border-collapse:collapse;'> <tr> <td> <center style='width: 100%;'> <div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'> Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div><div style='max-width: 600px;'> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'> <tr> <td width='40'>&nbsp;</td><td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr> <td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td> <table cellspacing='0' cellpadding='0' border='0' width='100%'> <tr> <td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'> <p>##texto_personalizado##</p></td></tr></table> </td></tr></table> <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'> <tr> <td width='40'>&nbsp;</td><td width='40' align='right' valign='middle'> <svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' style='fill:#325396;'> <path d='M3 18H21V20H3zM21.509 8.527c-.281-.844-1.192-1.3-2.036-1.019L15 9 7 6 5 7l6 4-4 2-4-2-1 1 4 4 14.547-5.455C21.358 10.24 21.783 9.35 21.509 8.527L21.509 8.527z'> </path> </svg> </td><td width='5'>&nbsp;</td><td> <p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'> Aerovics, S.A. de C.V.</p></td><td width='40'>&nbsp;</td></tr></table> <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%' style='max-width: 600px;'> <tr> <td style='padding-top: 40px;'></td></tr><tr> <td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'> &nbsp;</td></tr></table> </div></center> </td></tr></table></body></html>";
        bodyMail = bodyMail.replace("##texto_personalizado##", texto_personalizado);

        this.SendEmail(IdSolicitud, texto_personalizado, correo_usuario)
      },

    })

  }
  //#endregion


  //#region Correo segun solicitud
  SendEmail(IdSolicitud, texto, correo) {
    this.sqlModel.query = `SELECT cp.[Correo_electronico], psc.[Folio]  FROM [Pre_Solicitud_de_Cotizacion] psc LEFT JOIN [Creacion_de_Proveedores] cp ON psc.[Folio_Proveedor] = cp.[Clave] WHERE [Folio_Solicitud_Cotizacion] = ${IdSolicitud}`;

    this._SpartanService.GetRawQuery(this.sqlModel).subscribe({
      next: (response) => {
        //console.log(response)
      },
      error: (e) => console.error(e),
      complete: () => {
        this.spinner.hide('loading');

        const message = "Se han enviado los correos a los proveedores seleccionados"

        this.snackBar.open(message, '', {
          duration: 4000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: ['mat-toolbar', "mat-primary"]
        });

        this.closeWindowCancel();
      },
    })
  }
  //#endregion


  //#region Imprimir PDF
  PrintPDF(IdSolicitud) {
    const IdFormat = 63

    this.pdfCloudService.GeneratePDF(IdFormat, IdSolicitud).subscribe((res) => {

      this.disableFields()

      //Implementar Mensaje si no hay reportes
      saveByteArray('Formatos.pdf', base64ToArrayBuffer(res), 'application/pdf');
      this.spinner.hide('loading');
    });
  }
  //#endregion

}
