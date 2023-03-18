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
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/api-services/general.service';
import { Politicas_de_Precios_y_DescuentosService } from 'src/app/api-services/Politicas_de_Precios_y_Descuentos.service';
import { Politicas_de_Precios_y_Descuentos } from 'src/app/models/Politicas_de_Precios_y_Descuentos';
import { Detalle_Politicas_Mano_de_ObraService } from 'src/app/api-services/Detalle_Politicas_Mano_de_Obra.service';
import { Detalle_Politicas_Mano_de_Obra } from 'src/app/models/Detalle_Politicas_Mano_de_Obra';
import { UtilidadService } from 'src/app/api-services/Utilidad.service';
import { Utilidad } from 'src/app/models/Utilidad';

import { Detalle_Politicas_Cuota_ConsumiblesService } from 'src/app/api-services/Detalle_Politicas_Cuota_Consumibles.service';
import { Detalle_Politicas_Cuota_Consumibles } from 'src/app/models/Detalle_Politicas_Cuota_Consumibles';

import { Detalle_Politicas_Partes_Cliente_ContratoService } from 'src/app/api-services/Detalle_Politicas_Partes_Cliente_Contrato.service';
import { Detalle_Politicas_Partes_Cliente_Contrato } from 'src/app/models/Detalle_Politicas_Partes_Cliente_Contrato';

import { Detalle_Politicas_Partes_Cliente_No_ContratoService } from 'src/app/api-services/Detalle_Politicas_Partes_Cliente_No_Contrato.service';
import { Detalle_Politicas_Partes_Cliente_No_Contrato } from 'src/app/models/Detalle_Politicas_Partes_Cliente_No_Contrato';

import { Detalle_Politicas_TercerosService } from 'src/app/api-services/Detalle_Politicas_Terceros.service';
import { Detalle_Politicas_Terceros } from 'src/app/models/Detalle_Politicas_Terceros';


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
  selector: 'app-Politicas_de_Precios_y_Descuentos',
  templateUrl: './Politicas_de_Precios_y_Descuentos.component.html',
  styleUrls: ['./Politicas_de_Precios_y_Descuentos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Politicas_de_Precios_y_DescuentosComponent implements OnInit, AfterViewInit {
MRaddservicios_terceros: boolean = false;
MRaddadquiridos_cliente_sin_contrato: boolean = false;
MRaddadquiridos_cliente_contrato: boolean = false;
MRaddCuota_de_Consumibles: boolean = false;
MRaddutilizados_durante_el_servicio: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Politicas_de_Precios_y_DescuentosForm: FormGroup;
  public Editor = ClassicEditor;
  model: Politicas_de_Precios_y_Descuentos;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varUtilidad: Utilidad[] = [];











  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceutilizados_durante_el_servicio = new MatTableDataSource<Detalle_Politicas_Mano_de_Obra>();
  utilizados_durante_el_servicioColumns = [
    { def: 'actions', hide: false },
    { def: 'Costo_Desde', hide: false },
    { def: 'Costo_Hasta', hide: false },
    { def: 'Porcentaje_de_Utilidad_Minimo', hide: false },

  ];
  utilizados_durante_el_servicioData: Detalle_Politicas_Mano_de_Obra[] = [];
  dataSourceCuota_de_Consumibles = new MatTableDataSource<Detalle_Politicas_Cuota_Consumibles>();
  Cuota_de_ConsumiblesColumns = [
    { def: 'actions', hide: false },
    { def: 'Cuota_Monto', hide: false },
    { def: 'Cuota_Minima_Porcentaje', hide: false },
    { def: 'Tope_Maximo', hide: false },

  ];
  Cuota_de_ConsumiblesData: Detalle_Politicas_Cuota_Consumibles[] = [];
  dataSourceadquiridos_cliente_contrato = new MatTableDataSource<Detalle_Politicas_Partes_Cliente_Contrato>();
  adquiridos_cliente_contratoColumns = [
    { def: 'actions', hide: false },
    { def: 'cargo_minimo', hide: false },
    { def: 'Tope_Horas_Tecnico', hide: false },

  ];
  adquiridos_cliente_contratoData: Detalle_Politicas_Partes_Cliente_Contrato[] = [];
  dataSourceadquiridos_cliente_sin_contrato = new MatTableDataSource<Detalle_Politicas_Partes_Cliente_No_Contrato>();
  adquiridos_cliente_sin_contratoColumns = [
    { def: 'actions', hide: false },

  ];
  adquiridos_cliente_sin_contratoData: Detalle_Politicas_Partes_Cliente_No_Contrato[] = [];
  dataSourceservicios_terceros = new MatTableDataSource<Detalle_Politicas_Terceros>();
  servicios_tercerosColumns = [
    { def: 'actions', hide: false },
    { def: 'importe_desde', hide: false },
    { def: 'importe_hasta', hide: false },

  ];
  servicios_tercerosData: Detalle_Politicas_Terceros[] = [];

  today = new Date;
  consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Politicas_de_Precios_y_DescuentosService: Politicas_de_Precios_y_DescuentosService,
    private Detalle_Politicas_Mano_de_ObraService: Detalle_Politicas_Mano_de_ObraService,
    private UtilidadService: UtilidadService,

    private Detalle_Politicas_Cuota_ConsumiblesService: Detalle_Politicas_Cuota_ConsumiblesService,

    private Detalle_Politicas_Partes_Cliente_ContratoService: Detalle_Politicas_Partes_Cliente_ContratoService,

    private Detalle_Politicas_Partes_Cliente_No_ContratoService: Detalle_Politicas_Partes_Cliente_No_ContratoService,

    private Detalle_Politicas_TercerosService: Detalle_Politicas_TercerosService,


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
    this.model = new Politicas_de_Precios_y_Descuentos(this.fb);
    this.Politicas_de_Precios_y_DescuentosForm = this.model.buildFormGroup();
    this.utilizados_durante_el_servicioItems.removeAt(0);
    this.Cuota_de_ConsumiblesItems.removeAt(0);
    this.adquiridos_cliente_contratoItems.removeAt(0);
    this.adquiridos_cliente_sin_contratoItems.removeAt(0);
    this.servicios_tercerosItems.removeAt(0);

    this.Politicas_de_Precios_y_DescuentosForm.get('Folio').disable();
    this.Politicas_de_Precios_y_DescuentosForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceutilizados_durante_el_servicio.paginator = this.paginator;
    this.dataSourceCuota_de_Consumibles.paginator = this.paginator;
    this.dataSourceadquiridos_cliente_contrato.paginator = this.paginator;
    this.dataSourceadquiridos_cliente_sin_contrato.paginator = this.paginator;
    this.dataSourceservicios_terceros.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.utilizados_durante_el_servicioColumns.splice(0, 1);
          this.Cuota_de_ConsumiblesColumns.splice(0, 1);
          this.adquiridos_cliente_contratoColumns.splice(0, 1);
          this.adquiridos_cliente_sin_contratoColumns.splice(0, 1);
          this.servicios_tercerosColumns.splice(0, 1);

          this.Politicas_de_Precios_y_DescuentosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Politicas_de_Precios_y_Descuentos)
      .subscribe((response) => {
        this.permisos = response;
      });

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Politicas_de_Precios_y_DescuentosService.listaSelAll(0, 1, 'Politicas_de_Precios_y_Descuentos.Folio=' + id).toPromise();
    if (result.Politicas_de_Precios_y_Descuentoss.length > 0) {
      let futilizados_durante_el_servicio = await this.Detalle_Politicas_Mano_de_ObraService.listaSelAll(0, 1000, 'Politicas_de_Precios_y_Descuentos.Folio=' + id).toPromise();
      this.utilizados_durante_el_servicioData = futilizados_durante_el_servicio.Detalle_Politicas_Mano_de_Obras;
      this.loadutilizados_durante_el_servicio(futilizados_durante_el_servicio.Detalle_Politicas_Mano_de_Obras);
      this.dataSourceutilizados_durante_el_servicio = new MatTableDataSource(futilizados_durante_el_servicio.Detalle_Politicas_Mano_de_Obras);
      this.dataSourceutilizados_durante_el_servicio.paginator = this.paginator;
      this.dataSourceutilizados_durante_el_servicio.sort = this.sort;
      let fCuota_de_Consumibles = await this.Detalle_Politicas_Cuota_ConsumiblesService.listaSelAll(0, 1000, 'Politicas_de_Precios_y_Descuentos.Folio=' + id).toPromise();
      this.Cuota_de_ConsumiblesData = fCuota_de_Consumibles.Detalle_Politicas_Cuota_Consumibless;
      this.loadCuota_de_Consumibles(fCuota_de_Consumibles.Detalle_Politicas_Cuota_Consumibless);
      this.dataSourceCuota_de_Consumibles = new MatTableDataSource(fCuota_de_Consumibles.Detalle_Politicas_Cuota_Consumibless);
      this.dataSourceCuota_de_Consumibles.paginator = this.paginator;
      this.dataSourceCuota_de_Consumibles.sort = this.sort;
      let fadquiridos_cliente_contrato = await this.Detalle_Politicas_Partes_Cliente_ContratoService.listaSelAll(0, 1000, 'Politicas_de_Precios_y_Descuentos.Folio=' + id).toPromise();
      this.adquiridos_cliente_contratoData = fadquiridos_cliente_contrato.Detalle_Politicas_Partes_Cliente_Contratos;
      this.loadadquiridos_cliente_contrato(fadquiridos_cliente_contrato.Detalle_Politicas_Partes_Cliente_Contratos);
      this.dataSourceadquiridos_cliente_contrato = new MatTableDataSource(fadquiridos_cliente_contrato.Detalle_Politicas_Partes_Cliente_Contratos);
      this.dataSourceadquiridos_cliente_contrato.paginator = this.paginator;
      this.dataSourceadquiridos_cliente_contrato.sort = this.sort;
      let fadquiridos_cliente_sin_contrato = await this.Detalle_Politicas_Partes_Cliente_No_ContratoService.listaSelAll(0, 1000, 'Politicas_de_Precios_y_Descuentos.Folio=' + id).toPromise();
      this.adquiridos_cliente_sin_contratoData = fadquiridos_cliente_sin_contrato.Detalle_Politicas_Partes_Cliente_No_Contratos;
      this.loadadquiridos_cliente_sin_contrato(fadquiridos_cliente_sin_contrato.Detalle_Politicas_Partes_Cliente_No_Contratos);
      this.dataSourceadquiridos_cliente_sin_contrato = new MatTableDataSource(fadquiridos_cliente_sin_contrato.Detalle_Politicas_Partes_Cliente_No_Contratos);
      this.dataSourceadquiridos_cliente_sin_contrato.paginator = this.paginator;
      this.dataSourceadquiridos_cliente_sin_contrato.sort = this.sort;
      let fservicios_terceros = await this.Detalle_Politicas_TercerosService.listaSelAll(0, 1000, 'Politicas_de_Precios_y_Descuentos.Folio=' + id).toPromise();
      this.servicios_tercerosData = fservicios_terceros.Detalle_Politicas_Terceross;
      this.loadservicios_terceros(fservicios_terceros.Detalle_Politicas_Terceross);
      this.dataSourceservicios_terceros = new MatTableDataSource(fservicios_terceros.Detalle_Politicas_Terceross);
      this.dataSourceservicios_terceros.paginator = this.paginator;
      this.dataSourceservicios_terceros.sort = this.sort;

      this.model.fromObject(result.Politicas_de_Precios_y_Descuentoss[0]);

      this.Politicas_de_Precios_y_DescuentosForm.markAllAsTouched();
      this.Politicas_de_Precios_y_DescuentosForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get utilizados_durante_el_servicioItems() {
    return this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_Mano_de_ObraItems') as FormArray;
  }

  getutilizados_durante_el_servicioColumns(): string[] {
    return this.utilizados_durante_el_servicioColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadutilizados_durante_el_servicio(utilizados_durante_el_servicio: Detalle_Politicas_Mano_de_Obra[]) {
    utilizados_durante_el_servicio.forEach(element => {
      this.addutilizados_durante_el_servicio(element);
    });
  }

  addutilizados_durante_el_servicioToMR() {
    const utilizados_durante_el_servicio = new Detalle_Politicas_Mano_de_Obra(this.fb);
    this.utilizados_durante_el_servicioData.push(this.addutilizados_durante_el_servicio(utilizados_durante_el_servicio));
    this.dataSourceutilizados_durante_el_servicio.data = this.utilizados_durante_el_servicioData;
    utilizados_durante_el_servicio.edit = true;
    utilizados_durante_el_servicio.isNew = true;
    const length = this.dataSourceutilizados_durante_el_servicio.data.length;
    const index = length - 1;
    const formutilizados_durante_el_servicio = this.utilizados_durante_el_servicioItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceutilizados_durante_el_servicio.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addutilizados_durante_el_servicio(entity: Detalle_Politicas_Mano_de_Obra) {
    const utilizados_durante_el_servicio = new Detalle_Politicas_Mano_de_Obra(this.fb);
    this.utilizados_durante_el_servicioItems.push(utilizados_durante_el_servicio.buildFormGroup());
    if (entity) {
      utilizados_durante_el_servicio.fromObject(entity);
    }
    return entity;
  }

  utilizados_durante_el_servicioItemsByFolio(Folio: number): FormGroup {
    return (this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_Mano_de_ObraItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  utilizados_durante_el_servicioItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceutilizados_durante_el_servicio.data.indexOf(element);
    let fb = this.utilizados_durante_el_servicioItems.controls[index] as FormGroup;
    return fb;
  }

  deleteutilizados_durante_el_servicio(element: any) {
    let index = this.dataSourceutilizados_durante_el_servicio.data.indexOf(element);
    this.utilizados_durante_el_servicioData[index].IsDeleted = true;
    this.dataSourceutilizados_durante_el_servicio.data = this.utilizados_durante_el_servicioData;
    this.dataSourceutilizados_durante_el_servicio._updateChangeSubscription();
    index = this.dataSourceutilizados_durante_el_servicio.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditutilizados_durante_el_servicio(element: any) {
    let index = this.dataSourceutilizados_durante_el_servicio.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.utilizados_durante_el_servicioData[index].IsDeleted = true;
      this.dataSourceutilizados_durante_el_servicio.data = this.utilizados_durante_el_servicioData;
      this.dataSourceutilizados_durante_el_servicio._updateChangeSubscription();
      index = this.utilizados_durante_el_servicioData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveutilizados_durante_el_servicio(element: any) {
    const index = this.dataSourceutilizados_durante_el_servicio.data.indexOf(element);
    const formutilizados_durante_el_servicio = this.utilizados_durante_el_servicioItems.controls[index] as FormGroup;
    this.utilizados_durante_el_servicioData[index].Costo_Desde = formutilizados_durante_el_servicio.value.Costo_Desde;
    this.utilizados_durante_el_servicioData[index].Costo_Hasta = formutilizados_durante_el_servicio.value.Costo_Hasta;
    this.utilizados_durante_el_servicioData[index].Porcentaje_de_Utilidad_Minimo = formutilizados_durante_el_servicio.value.Porcentaje_de_Utilidad_Minimo;
    this.utilizados_durante_el_servicioData[index].Porcentaje_de_Utilidad_Minimo_Utilidad = formutilizados_durante_el_servicio.value.Porcentaje_de_Utilidad_Minimo !== '' ?
      this.varUtilidad.filter(d => d.Clave === formutilizados_durante_el_servicio.value.Porcentaje_de_Utilidad_Minimo)[0] : null;

    this.utilizados_durante_el_servicioData[index].isNew = false;
    this.dataSourceutilizados_durante_el_servicio.data = this.utilizados_durante_el_servicioData;
    this.dataSourceutilizados_durante_el_servicio._updateChangeSubscription();
  }

  editutilizados_durante_el_servicio(element: any) {
    const index = this.dataSourceutilizados_durante_el_servicio.data.indexOf(element);
    const formutilizados_durante_el_servicio = this.utilizados_durante_el_servicioItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Politicas_Mano_de_Obra(Folio: number) {
    this.dataSourceutilizados_durante_el_servicio.data.forEach(async (d, index) => {
      const data = this.utilizados_durante_el_servicioItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Politicas_de_Precios_y_Descuentos = Folio;


      if (model.Folio === 0) {
        // Add Partes y Materiales utilizados durante el servicio
        let response = await this.Detalle_Politicas_Mano_de_ObraService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formutilizados_durante_el_servicio = this.utilizados_durante_el_servicioItemsByFolio(model.Folio);
        if (formutilizados_durante_el_servicio.dirty) {
          // Update Partes y Materiales utilizados durante el servicio
          let response = await this.Detalle_Politicas_Mano_de_ObraService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Partes y Materiales utilizados durante el servicio
        await this.Detalle_Politicas_Mano_de_ObraService.delete(model.Folio).toPromise();
      }
    });
  }


  get Cuota_de_ConsumiblesItems() {
    return this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_Cuota_ConsumiblesItems') as FormArray;
  }

  getCuota_de_ConsumiblesColumns(): string[] {
    return this.Cuota_de_ConsumiblesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadCuota_de_Consumibles(Cuota_de_Consumibles: Detalle_Politicas_Cuota_Consumibles[]) {
    Cuota_de_Consumibles.forEach(element => {
      this.addCuota_de_Consumibles(element);
    });
  }

  addCuota_de_ConsumiblesToMR() {
    const Cuota_de_Consumibles = new Detalle_Politicas_Cuota_Consumibles(this.fb);
    this.Cuota_de_ConsumiblesData.push(this.addCuota_de_Consumibles(Cuota_de_Consumibles));
    this.dataSourceCuota_de_Consumibles.data = this.Cuota_de_ConsumiblesData;
    Cuota_de_Consumibles.edit = true;
    Cuota_de_Consumibles.isNew = true;
    const length = this.dataSourceCuota_de_Consumibles.data.length;
    const index = length - 1;
    const formCuota_de_Consumibles = this.Cuota_de_ConsumiblesItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceCuota_de_Consumibles.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addCuota_de_Consumibles(entity: Detalle_Politicas_Cuota_Consumibles) {
    const Cuota_de_Consumibles = new Detalle_Politicas_Cuota_Consumibles(this.fb);
    this.Cuota_de_ConsumiblesItems.push(Cuota_de_Consumibles.buildFormGroup());
    if (entity) {
      Cuota_de_Consumibles.fromObject(entity);
    }
    return entity;
  }

  Cuota_de_ConsumiblesItemsByFolio(Folio: number): FormGroup {
    return (this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_Cuota_ConsumiblesItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Cuota_de_ConsumiblesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceCuota_de_Consumibles.data.indexOf(element);
    let fb = this.Cuota_de_ConsumiblesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteCuota_de_Consumibles(element: any) {
    let index = this.dataSourceCuota_de_Consumibles.data.indexOf(element);
    this.Cuota_de_ConsumiblesData[index].IsDeleted = true;
    this.dataSourceCuota_de_Consumibles.data = this.Cuota_de_ConsumiblesData;
    this.dataSourceCuota_de_Consumibles._updateChangeSubscription();
    index = this.dataSourceCuota_de_Consumibles.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditCuota_de_Consumibles(element: any) {
    let index = this.dataSourceCuota_de_Consumibles.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Cuota_de_ConsumiblesData[index].IsDeleted = true;
      this.dataSourceCuota_de_Consumibles.data = this.Cuota_de_ConsumiblesData;
      this.dataSourceCuota_de_Consumibles._updateChangeSubscription();
      index = this.Cuota_de_ConsumiblesData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveCuota_de_Consumibles(element: any) {
    const index = this.dataSourceCuota_de_Consumibles.data.indexOf(element);
    const formCuota_de_Consumibles = this.Cuota_de_ConsumiblesItems.controls[index] as FormGroup;
    this.Cuota_de_ConsumiblesData[index].Costo_Desde = formCuota_de_Consumibles.value.Costo_Desde;
    this.Cuota_de_ConsumiblesData[index].Costo_Hasta = formCuota_de_Consumibles.value.Costo_Hasta;
    this.Cuota_de_ConsumiblesData[index].Cuota_Monto = formCuota_de_Consumibles.value.Cuota_Monto;
    this.Cuota_de_ConsumiblesData[index].Cuota_Minima_Porcentaje = formCuota_de_Consumibles.value.Cuota_Minima_Porcentaje;
    this.Cuota_de_ConsumiblesData[index].Tope_Maximo = formCuota_de_Consumibles.value.Tope_Maximo;

    this.Cuota_de_ConsumiblesData[index].isNew = false;
    this.dataSourceCuota_de_Consumibles.data = this.Cuota_de_ConsumiblesData;
    this.dataSourceCuota_de_Consumibles._updateChangeSubscription();
  }

  editCuota_de_Consumibles(element: any) {
    const index = this.dataSourceCuota_de_Consumibles.data.indexOf(element);
    const formCuota_de_Consumibles = this.Cuota_de_ConsumiblesItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Politicas_Cuota_Consumibles(Folio: number) {
    this.dataSourceCuota_de_Consumibles.data.forEach(async (d, index) => {
      const data = this.Cuota_de_ConsumiblesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Politicas_de_Precios_y_Descuentos = Folio;


      if (model.Folio === 0) {
        // Add Cuota de Consumibles
        let response = await this.Detalle_Politicas_Cuota_ConsumiblesService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formCuota_de_Consumibles = this.Cuota_de_ConsumiblesItemsByFolio(model.Folio);
        if (formCuota_de_Consumibles.dirty) {
          // Update Cuota de Consumibles
          let response = await this.Detalle_Politicas_Cuota_ConsumiblesService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Cuota de Consumibles
        await this.Detalle_Politicas_Cuota_ConsumiblesService.delete(model.Folio).toPromise();
      }
    });
  }


  get adquiridos_cliente_contratoItems() {
    return this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_Partes_Cliente_ContratoItems') as FormArray;
  }

  getadquiridos_cliente_contratoColumns(): string[] {
    return this.adquiridos_cliente_contratoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadadquiridos_cliente_contrato(adquiridos_cliente_contrato: Detalle_Politicas_Partes_Cliente_Contrato[]) {
    adquiridos_cliente_contrato.forEach(element => {
      this.addadquiridos_cliente_contrato(element);
    });
  }

  addadquiridos_cliente_contratoToMR() {
    const adquiridos_cliente_contrato = new Detalle_Politicas_Partes_Cliente_Contrato(this.fb);
    this.adquiridos_cliente_contratoData.push(this.addadquiridos_cliente_contrato(adquiridos_cliente_contrato));
    this.dataSourceadquiridos_cliente_contrato.data = this.adquiridos_cliente_contratoData;
    adquiridos_cliente_contrato.edit = true;
    adquiridos_cliente_contrato.isNew = true;
    const length = this.dataSourceadquiridos_cliente_contrato.data.length;
    const index = length - 1;
    const formadquiridos_cliente_contrato = this.adquiridos_cliente_contratoItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceadquiridos_cliente_contrato.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addadquiridos_cliente_contrato(entity: Detalle_Politicas_Partes_Cliente_Contrato) {
    const adquiridos_cliente_contrato = new Detalle_Politicas_Partes_Cliente_Contrato(this.fb);
    this.adquiridos_cliente_contratoItems.push(adquiridos_cliente_contrato.buildFormGroup());
    if (entity) {
      adquiridos_cliente_contrato.fromObject(entity);
    }
    return entity;
  }

  adquiridos_cliente_contratoItemsByFolio(Folio: number): FormGroup {
    return (this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_Partes_Cliente_ContratoItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  adquiridos_cliente_contratoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceadquiridos_cliente_contrato.data.indexOf(element);
    let fb = this.adquiridos_cliente_contratoItems.controls[index] as FormGroup;
    return fb;
  }

  deleteadquiridos_cliente_contrato(element: any) {
    let index = this.dataSourceadquiridos_cliente_contrato.data.indexOf(element);
    this.adquiridos_cliente_contratoData[index].IsDeleted = true;
    this.dataSourceadquiridos_cliente_contrato.data = this.adquiridos_cliente_contratoData;
    this.dataSourceadquiridos_cliente_contrato._updateChangeSubscription();
    index = this.dataSourceadquiridos_cliente_contrato.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditadquiridos_cliente_contrato(element: any) {
    let index = this.dataSourceadquiridos_cliente_contrato.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.adquiridos_cliente_contratoData[index].IsDeleted = true;
      this.dataSourceadquiridos_cliente_contrato.data = this.adquiridos_cliente_contratoData;
      this.dataSourceadquiridos_cliente_contrato._updateChangeSubscription();
      index = this.adquiridos_cliente_contratoData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveadquiridos_cliente_contrato(element: any) {
    const index = this.dataSourceadquiridos_cliente_contrato.data.indexOf(element);
    const formadquiridos_cliente_contrato = this.adquiridos_cliente_contratoItems.controls[index] as FormGroup;
    this.adquiridos_cliente_contratoData[index].Costo_Desde = formadquiridos_cliente_contrato.value.Costo_Desde;
    this.adquiridos_cliente_contratoData[index].Costo_Hasta = formadquiridos_cliente_contrato.value.Costo_Hasta;
    this.adquiridos_cliente_contratoData[index].cargo_minimo = formadquiridos_cliente_contrato.value.cargo_minimo;
    this.adquiridos_cliente_contratoData[index].Tope_Horas_Tecnico = formadquiridos_cliente_contrato.value.Tope_Horas_Tecnico;

    this.adquiridos_cliente_contratoData[index].isNew = false;
    this.dataSourceadquiridos_cliente_contrato.data = this.adquiridos_cliente_contratoData;
    this.dataSourceadquiridos_cliente_contrato._updateChangeSubscription();
  }

  editadquiridos_cliente_contrato(element: any) {
    const index = this.dataSourceadquiridos_cliente_contrato.data.indexOf(element);
    const formadquiridos_cliente_contrato = this.adquiridos_cliente_contratoItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Politicas_Partes_Cliente_Contrato(Folio: number) {
    this.dataSourceadquiridos_cliente_contrato.data.forEach(async (d, index) => {
      const data = this.adquiridos_cliente_contratoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Politicas_de_Precios_y_Descuentos = Folio;


      if (model.Folio === 0) {
        // Add Partes o Materiales adquiridos por el cliente (Con Contrato)
        let response = await this.Detalle_Politicas_Partes_Cliente_ContratoService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formadquiridos_cliente_contrato = this.adquiridos_cliente_contratoItemsByFolio(model.Folio);
        if (formadquiridos_cliente_contrato.dirty) {
          // Update Partes o Materiales adquiridos por el cliente (Con Contrato)
          let response = await this.Detalle_Politicas_Partes_Cliente_ContratoService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Partes o Materiales adquiridos por el cliente (Con Contrato)
        await this.Detalle_Politicas_Partes_Cliente_ContratoService.delete(model.Folio).toPromise();
      }
    });
  }


  get adquiridos_cliente_sin_contratoItems() {
    return this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_Partes_Cliente_No_ContratoItems') as FormArray;
  }

  getadquiridos_cliente_sin_contratoColumns(): string[] {
    return this.adquiridos_cliente_sin_contratoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadadquiridos_cliente_sin_contrato(adquiridos_cliente_sin_contrato: Detalle_Politicas_Partes_Cliente_No_Contrato[]) {
    adquiridos_cliente_sin_contrato.forEach(element => {
      this.addadquiridos_cliente_sin_contrato(element);
    });
  }

  addadquiridos_cliente_sin_contratoToMR() {
    const adquiridos_cliente_sin_contrato = new Detalle_Politicas_Partes_Cliente_No_Contrato(this.fb);
    this.adquiridos_cliente_sin_contratoData.push(this.addadquiridos_cliente_sin_contrato(adquiridos_cliente_sin_contrato));
    this.dataSourceadquiridos_cliente_sin_contrato.data = this.adquiridos_cliente_sin_contratoData;
    adquiridos_cliente_sin_contrato.edit = true;
    adquiridos_cliente_sin_contrato.isNew = true;
    const length = this.dataSourceadquiridos_cliente_sin_contrato.data.length;
    const index = length - 1;
    const formadquiridos_cliente_sin_contrato = this.adquiridos_cliente_sin_contratoItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceadquiridos_cliente_sin_contrato.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addadquiridos_cliente_sin_contrato(entity: Detalle_Politicas_Partes_Cliente_No_Contrato) {
    const adquiridos_cliente_sin_contrato = new Detalle_Politicas_Partes_Cliente_No_Contrato(this.fb);
    this.adquiridos_cliente_sin_contratoItems.push(adquiridos_cliente_sin_contrato.buildFormGroup());
    if (entity) {
      adquiridos_cliente_sin_contrato.fromObject(entity);
    }
    return entity;
  }

  adquiridos_cliente_sin_contratoItemsByFolio(Folio: number): FormGroup {
    return (this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_Partes_Cliente_No_ContratoItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  adquiridos_cliente_sin_contratoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceadquiridos_cliente_sin_contrato.data.indexOf(element);
    let fb = this.adquiridos_cliente_sin_contratoItems.controls[index] as FormGroup;
    return fb;
  }

  deleteadquiridos_cliente_sin_contrato(element: any) {
    let index = this.dataSourceadquiridos_cliente_sin_contrato.data.indexOf(element);
    this.adquiridos_cliente_sin_contratoData[index].IsDeleted = true;
    this.dataSourceadquiridos_cliente_sin_contrato.data = this.adquiridos_cliente_sin_contratoData;
    this.dataSourceadquiridos_cliente_sin_contrato._updateChangeSubscription();
    index = this.dataSourceadquiridos_cliente_sin_contrato.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditadquiridos_cliente_sin_contrato(element: any) {
    let index = this.dataSourceadquiridos_cliente_sin_contrato.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.adquiridos_cliente_sin_contratoData[index].IsDeleted = true;
      this.dataSourceadquiridos_cliente_sin_contrato.data = this.adquiridos_cliente_sin_contratoData;
      this.dataSourceadquiridos_cliente_sin_contrato._updateChangeSubscription();
      index = this.adquiridos_cliente_sin_contratoData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveadquiridos_cliente_sin_contrato(element: any) {
    const index = this.dataSourceadquiridos_cliente_sin_contrato.data.indexOf(element);
    const formadquiridos_cliente_sin_contrato = this.adquiridos_cliente_sin_contratoItems.controls[index] as FormGroup;
    this.adquiridos_cliente_sin_contratoData[index].Costo_Desde = formadquiridos_cliente_sin_contrato.value.Costo_Desde;
    this.adquiridos_cliente_sin_contratoData[index].Costo_Hasta = formadquiridos_cliente_sin_contrato.value.Costo_Hasta;
    this.adquiridos_cliente_sin_contratoData[index].cargo_minimo = formadquiridos_cliente_sin_contrato.value.cargo_minimo;

    this.adquiridos_cliente_sin_contratoData[index].isNew = false;
    this.dataSourceadquiridos_cliente_sin_contrato.data = this.adquiridos_cliente_sin_contratoData;
    this.dataSourceadquiridos_cliente_sin_contrato._updateChangeSubscription();
  }

  editadquiridos_cliente_sin_contrato(element: any) {
    const index = this.dataSourceadquiridos_cliente_sin_contrato.data.indexOf(element);
    const formadquiridos_cliente_sin_contrato = this.adquiridos_cliente_sin_contratoItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Politicas_Partes_Cliente_No_Contrato(Folio: number) {
    this.dataSourceadquiridos_cliente_sin_contrato.data.forEach(async (d, index) => {
      const data = this.adquiridos_cliente_sin_contratoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Politicas_de_Precios_y_Descuentos = Folio;


      if (model.Folio === 0) {
        // Add Partes o Materiales adquiridos por el cliente (SIN Contrato)
        let response = await this.Detalle_Politicas_Partes_Cliente_No_ContratoService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formadquiridos_cliente_sin_contrato = this.adquiridos_cliente_sin_contratoItemsByFolio(model.Folio);
        if (formadquiridos_cliente_sin_contrato.dirty) {
          // Update Partes o Materiales adquiridos por el cliente (SIN Contrato)
          let response = await this.Detalle_Politicas_Partes_Cliente_No_ContratoService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Partes o Materiales adquiridos por el cliente (SIN Contrato)
        await this.Detalle_Politicas_Partes_Cliente_No_ContratoService.delete(model.Folio).toPromise();
      }
    });
  }


  get servicios_tercerosItems() {
    return this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_TercerosItems') as FormArray;
  }

  getservicios_tercerosColumns(): string[] {
    return this.servicios_tercerosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadservicios_terceros(servicios_terceros: Detalle_Politicas_Terceros[]) {
    servicios_terceros.forEach(element => {
      this.addservicios_terceros(element);
    });
  }

  addservicios_tercerosToMR() {
    const servicios_terceros = new Detalle_Politicas_Terceros(this.fb);
    this.servicios_tercerosData.push(this.addservicios_terceros(servicios_terceros));
    this.dataSourceservicios_terceros.data = this.servicios_tercerosData;
    servicios_terceros.edit = true;
    servicios_terceros.isNew = true;
    const length = this.dataSourceservicios_terceros.data.length;
    const index = length - 1;
    const formservicios_terceros = this.servicios_tercerosItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceservicios_terceros.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addservicios_terceros(entity: Detalle_Politicas_Terceros) {
    const servicios_terceros = new Detalle_Politicas_Terceros(this.fb);
    this.servicios_tercerosItems.push(servicios_terceros.buildFormGroup());
    if (entity) {
      servicios_terceros.fromObject(entity);
    }
    return entity;
  }

  servicios_tercerosItemsByFolio(Folio: number): FormGroup {
    return (this.Politicas_de_Precios_y_DescuentosForm.get('Detalle_Politicas_TercerosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  servicios_tercerosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceservicios_terceros.data.indexOf(element);
    let fb = this.servicios_tercerosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteservicios_terceros(element: any) {
    let index = this.dataSourceservicios_terceros.data.indexOf(element);
    this.servicios_tercerosData[index].IsDeleted = true;
    this.dataSourceservicios_terceros.data = this.servicios_tercerosData;
    this.dataSourceservicios_terceros._updateChangeSubscription();
    index = this.dataSourceservicios_terceros.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditservicios_terceros(element: any) {
    let index = this.dataSourceservicios_terceros.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.servicios_tercerosData[index].IsDeleted = true;
      this.dataSourceservicios_terceros.data = this.servicios_tercerosData;
      this.dataSourceservicios_terceros._updateChangeSubscription();
      index = this.servicios_tercerosData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveservicios_terceros(element: any) {
    const index = this.dataSourceservicios_terceros.data.indexOf(element);
    const formservicios_terceros = this.servicios_tercerosItems.controls[index] as FormGroup;
    this.servicios_tercerosData[index].importe_desde = formservicios_terceros.value.importe_desde;
    this.servicios_tercerosData[index].importe_hasta = formservicios_terceros.value.importe_hasta;
    this.servicios_tercerosData[index].Porcentaje_de_Utilidad_Minimo = formservicios_terceros.value.Porcentaje_de_Utilidad_Minimo;
    this.servicios_tercerosData[index].Porcentaje_de_Utilidad_Minimo_Utilidad = formservicios_terceros.value.Porcentaje_de_Utilidad_Minimo !== '' ?
      this.varUtilidad.filter(d => d.Clave === formservicios_terceros.value.Porcentaje_de_Utilidad_Minimo)[0] : null;

    this.servicios_tercerosData[index].isNew = false;
    this.dataSourceservicios_terceros.data = this.servicios_tercerosData;
    this.dataSourceservicios_terceros._updateChangeSubscription();
  }

  editservicios_terceros(element: any) {
    const index = this.dataSourceservicios_terceros.data.indexOf(element);
    const formservicios_terceros = this.servicios_tercerosItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Politicas_Terceros(Folio: number) {
    this.dataSourceservicios_terceros.data.forEach(async (d, index) => {
      const data = this.servicios_tercerosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Politicas_de_Precios_y_Descuentos = Folio;


      if (model.Folio === 0) {
        // Add Servicios realizados por terceros externos
        let response = await this.Detalle_Politicas_TercerosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formservicios_terceros = this.servicios_tercerosItemsByFolio(model.Folio);
        if (formservicios_terceros.dirty) {
          // Update Servicios realizados por terceros externos
          let response = await this.Detalle_Politicas_TercerosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Servicios realizados por terceros externos
        await this.Detalle_Politicas_TercerosService.delete(model.Folio).toPromise();
      }
    });
  }


  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Politicas_de_Precios_y_DescuentosForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.UtilidadService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varUtilidad]) => {
          this.varUtilidad = varUtilidad;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Porcentaje_de_Utilidad_Minimo': {
        this.UtilidadService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varUtilidad = x.Utilidads;
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
    if (this.rulesBeforeSave()) {
      const entity = this.Politicas_de_Precios_y_DescuentosForm.value;
      entity.Folio = this.model.Folio;


      if (this.model.Folio > 0) {
        await this.Politicas_de_Precios_y_DescuentosService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Politicas_Mano_de_Obra(this.model.Folio);
        await this.saveDetalle_Politicas_Cuota_Consumibles(this.model.Folio);
        await this.saveDetalle_Politicas_Partes_Cliente_Contrato(this.model.Folio);
        await this.saveDetalle_Politicas_Partes_Cliente_No_Contrato(this.model.Folio);
        await this.saveDetalle_Politicas_Terceros(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.rulesAfterSave();
        this.spinner.hide('loading');

        return this.model.Folio;
      } else {
        await (this.Politicas_de_Precios_y_DescuentosService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Politicas_Mano_de_Obra(id);
          await this.saveDetalle_Politicas_Cuota_Consumibles(id);
          await this.saveDetalle_Politicas_Partes_Cliente_Contrato(id);
          await this.saveDetalle_Politicas_Partes_Cliente_No_Contrato(id);
          await this.saveDetalle_Politicas_Terceros(id);

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
      this.Politicas_de_Precios_y_DescuentosForm.reset();
      this.model = new Politicas_de_Precios_y_Descuentos(this.fb);
      this.Politicas_de_Precios_y_DescuentosForm = this.model.buildFormGroup();
      this.dataSourceutilizados_durante_el_servicio = new MatTableDataSource<Detalle_Politicas_Mano_de_Obra>();
      this.utilizados_durante_el_servicioData = [];
      this.dataSourceCuota_de_Consumibles = new MatTableDataSource<Detalle_Politicas_Cuota_Consumibles>();
      this.Cuota_de_ConsumiblesData = [];
      this.dataSourceadquiridos_cliente_contrato = new MatTableDataSource<Detalle_Politicas_Partes_Cliente_Contrato>();
      this.adquiridos_cliente_contratoData = [];
      this.dataSourceadquiridos_cliente_sin_contrato = new MatTableDataSource<Detalle_Politicas_Partes_Cliente_No_Contrato>();
      this.adquiridos_cliente_sin_contratoData = [];
      this.dataSourceservicios_terceros = new MatTableDataSource<Detalle_Politicas_Terceros>();
      this.servicios_tercerosData = [];

    } else {
      this.router.navigate(['views/Politicas_de_Precios_y_Descuentos/add']);
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
    this.router.navigate(['/Politicas_de_Precios_y_Descuentos/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  contrato_tarifa_tecnico_ExecuteBusinessRules(): void {
    //contrato_tarifa_tecnico_FieldExecuteBusinessRulesEnd
  }
  contrato_tarifa_rampa_ExecuteBusinessRules(): void {
    //contrato_tarifa_rampa_FieldExecuteBusinessRulesEnd
  }
  sin_contrato_tarifa_tecnico_ExecuteBusinessRules(): void {
    //sin_contrato_tarifa_tecnico_FieldExecuteBusinessRulesEnd
  }
  sin_contrato_tarifa_rampa_ExecuteBusinessRules(): void {
    //sin_contrato_tarifa_rampa_FieldExecuteBusinessRulesEnd
  }
  Clausulas_de_Cotizacion_ExecuteBusinessRules(): void {
    //Clausulas_de_Cotizacion_FieldExecuteBusinessRulesEnd
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
