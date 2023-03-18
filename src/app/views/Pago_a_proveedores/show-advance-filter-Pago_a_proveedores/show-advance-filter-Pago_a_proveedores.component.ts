import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from '@andufratu/ngx-custom-validators';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Filter } from 'src/app/models/filter';

import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';


@Component({
  selector: 'app-show-advance-filter-Pago_a_proveedores',
  templateUrl: './show-advance-filter-Pago_a_proveedores.component.html',
  styleUrls: ['./show-advance-filter-Pago_a_proveedores.component.scss']
})
export class ShowAdvanceFilterPago_a_proveedoresComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public No_de_OCs: Generacion_de_Orden_de_Compras[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];
  public Estatuss: Estatus_de_Seguimiento[] = [];

  public generacion_de_orden_de_comprass: Generacion_de_Orden_de_Compras;
  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public estatus_de_seguimientos: Estatus_de_Seguimiento;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "IdLisPagPro",
      "No_de_OC",
      "Proveedor",
      "No_de_Factura",
      "Nota_de_Credito",
      "Total_de_Factura",
      "Fecha_de_Factura",
      "Tiempos_de_Pago",
      "Fecha_de_Pago",
      "Observaciones",
      "Estatus",
      "No_de_Referencia",
      "Fecha_de_Ejecucion_del_Pago",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "IdLisPagPro_filtro",
      "No_de_OC_filtro",
      "Proveedor_filtro",
      "No_de_Factura_filtro",
      "Nota_de_Credito_filtro",
      "Total_de_Factura_filtro",
      "Fecha_de_Factura_filtro",
      "Tiempos_de_Pago_filtro",
      "Fecha_de_Pago_filtro",
      "Observaciones_filtro",
      "Estatus_filtro",
      "No_de_Referencia_filtro",
      "Fecha_de_Ejecucion_del_Pago_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      IdLisPagPro: "",
      No_de_OC: "",
      Proveedor: "",
      No_de_Factura: "",
      Nota_de_Credito: "",
      Total_de_Factura: "",
      Fecha_de_Factura: null,
      Tiempos_de_Pago: "",
      Fecha_de_Pago: null,
      Observaciones: "",
      Estatus: "",
      No_de_Referencia: "",
      Fecha_de_Ejecucion_del_Pago: null,

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromIdLisPagPro: "",
      toIdLisPagPro: "",
      No_de_OCFilter: "",
      No_de_OC: "",
      No_de_OCMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      fromTotal_de_Factura: "",
      toTotal_de_Factura: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",
      fromTiempos_de_Pago: "",
      toTiempos_de_Pago: "",
      fromFecha_de_Pago: "",
      toFecha_de_Pago: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromFecha_de_Ejecucion_del_Pago: "",
      toFecha_de_Ejecucion_del_Pago: "",

    }
  };

  ngAfterViewInit(): void {
  }

  ngOnInit(): void {
    var empezarCon = new Filter;
    empezarCon.Clave = 1;
    empezarCon.Descripcion = "Empezar con";
    this.filter.push(empezarCon);

    var terminarCon = new Filter;
    terminarCon.Clave = 2;
    terminarCon.Descripcion = "Terminar con";
    this.filter.push(terminarCon);

    var contiene = new Filter;
    contiene.Clave = 3;
    contiene.Descripcion = "Contiene";
    this.filter.push(contiene);

    var exacto = new Filter;
    exacto.Clave = 4;
    exacto.Descripcion = "Exacto";
    this.filter.push(exacto);
    this.populateControls();
    this.dataListConfig = history.state.data;
    this.init();
  }

  init() {
    const initConfig = history.state.data;

    if (initConfig) {
      this.listConfig = initConfig;
    }
  }

  constructor(
    private generacion_de_orden_de_comprasService: Generacion_de_Orden_de_ComprasService,
    private creacion_de_proveedoresService: Creacion_de_ProveedoresService,
    private estatus_de_seguimientoService: Estatus_de_SeguimientoService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromIdLisPagPro: [''],
      toIdLisPagPro: [''],
      No_de_OCFilter: [''],
      No_de_OC: [''],
      No_de_OCMultiple: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],
      fromTotal_de_Factura: [''],
      toTotal_de_Factura: [''],
      fromFecha_de_Factura: [''],
      toFecha_de_Factura: [''],
      fromTiempos_de_Pago: [''],
      toTiempos_de_Pago: [''],
      fromFecha_de_Pago: [''],
      toFecha_de_Pago: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromFecha_de_Ejecucion_del_Pago: [''],
      toFecha_de_Ejecucion_del_Pago: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Pago_a_proveedores/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.generacion_de_orden_de_comprasService.getAll());
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.estatus_de_seguimientoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio, generacion_de_orden_de_comprass, creacion_de_proveedoress, estatus_de_seguimientos]) => {
          this.generacion_de_orden_de_comprass = generacion_de_orden_de_comprass;
          this.creacion_de_proveedoress = creacion_de_proveedoress;
          this.estatus_de_seguimientos = estatus_de_seguimientos;


        });
    }
  }

  buscar() {
    this.isLoading = true;
    this.spinner.show('loading');
    const entity = this.advancefilter.value;

    const initConfig = history.state.data;

    if (!initConfig) {
      this.dataListConfig = this.listConfig;
    } else {
      this.dataListConfig = history.state.data;
    }

    this.dataListConfig.advancedSearch = true;
    this.dataListConfig.filterAdvanced.fromFolio = entity.fromFolio;
    this.dataListConfig.filterAdvanced.toFolio = entity.toFolio;
    this.dataListConfig.filterAdvanced.fromIdLisPagPro = entity.fromIdLisPagPro;
    this.dataListConfig.filterAdvanced.toIdLisPagPro = entity.toIdLisPagPro;
    this.dataListConfig.filterAdvanced.No_de_OCFilter = entity.No_de_OCFilter;
    this.dataListConfig.filterAdvanced.No_de_OC = entity.No_de_OC;
    this.dataListConfig.filterAdvanced.No_de_OCMultiple = entity.No_de_OCMultiple;
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
    this.dataListConfig.filterAdvanced.No_de_FacturaFilter = entity.No_de_FacturaFilter;
    this.dataListConfig.filterAdvanced.No_de_Factura = entity.No_de_Factura;
    this.dataListConfig.filterAdvanced.Nota_de_CreditoFilter = entity.Nota_de_CreditoFilter;
    this.dataListConfig.filterAdvanced.Nota_de_Credito = entity.Nota_de_Credito;
    this.dataListConfig.filterAdvanced.fromTotal_de_Factura = entity.fromTotal_de_Factura;
    this.dataListConfig.filterAdvanced.toTotal_de_Factura = entity.toTotal_de_Factura;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura = entity.fromFecha_de_Factura;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura = entity.toFecha_de_Factura;
    this.dataListConfig.filterAdvanced.fromTiempos_de_Pago = entity.fromTiempos_de_Pago;
    this.dataListConfig.filterAdvanced.toTiempos_de_Pago = entity.toTiempos_de_Pago;
    this.dataListConfig.filterAdvanced.fromFecha_de_Pago = entity.fromFecha_de_Pago;
    this.dataListConfig.filterAdvanced.toFecha_de_Pago = entity.toFecha_de_Pago;
    this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
    this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.No_de_ReferenciaFilter = entity.No_de_ReferenciaFilter;
    this.dataListConfig.filterAdvanced.No_de_Referencia = entity.No_de_Referencia;
    this.dataListConfig.filterAdvanced.fromFecha_de_Ejecucion_del_Pago = entity.fromFecha_de_Ejecucion_del_Pago;
    this.dataListConfig.filterAdvanced.toFecha_de_Ejecucion_del_Pago = entity.toFecha_de_Ejecucion_del_Pago;


    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Pago_a_proveedores/list'], { state: { data: this.dataListConfig } });
  }
}
