import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  FormControl
} from '@angular/forms';
import { CustomValidators } from '@andufratu/ngx-custom-validators';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Filter } from 'src/app/models/filter';

import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';


@Component({
  selector: 'app-show-advance-filter-Ingreso_de_Costos',
  templateUrl: './show-advance-filter-Ingreso_de_Costos.component.html',
  styleUrls: ['./show-advance-filter-Ingreso_de_Costos.component.scss']
})
export class ShowAdvanceFilterIngreso_de_CostosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public No__de_OCs: Generacion_de_Orden_de_Compras[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];

  public generacion_de_orden_de_comprass: Generacion_de_Orden_de_Compras;
  public creacion_de_proveedoress: Creacion_de_Proveedores;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_OC",
      "Proveedor",
      "No__de_Factura",
      "Fecha_de_Factura",
      "Fecha_de_Pago",
      "Nota_de_Credito",
      "Total_de_Factura_",
      "Observaciones",
      "IdSolicitudPago",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_OC_filtro",
      "Proveedor_filtro",
      "No__de_Factura_filtro",
      "Fecha_de_Factura_filtro",
      "Fecha_de_Pago_filtro",
      "Nota_de_Credito_filtro",
      "Total_de_Factura__filtro",
      "Observaciones_filtro",
      "IdSolicitudPago_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No__de_OC: "",
      Proveedor: "",
      No__de_Factura: "",
      Fecha_de_Factura: null,
      Fecha_de_Pago: null,
      Nota_de_Credito: "",
      Total_de_Factura_: "",
      Observaciones: "",
      IdSolicitudPago: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      No__de_OCFilter: "",
      No__de_OC: "",
      No__de_OCMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",
      fromFecha_de_Pago: "",
      toFecha_de_Pago: "",
      fromTotal_de_Factura_: "",
      toTotal_de_Factura_: "",

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

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      No__de_OCFilter: [''],
      No__de_OC: [''],
      No__de_OCMultiple: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],
      fromFecha_de_Factura: [''],
      toFecha_de_Factura: [''],
      fromFecha_de_Pago: [''],
      toFecha_de_Pago: [''],
      fromTotal_de_Factura_: [''],
      toTotal_de_Factura_: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Ingreso_de_Costos/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.generacion_de_orden_de_comprasService.getAll());
    observablesArray.push(this.creacion_de_proveedoresService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,generacion_de_orden_de_comprass ,creacion_de_proveedoress ]) => {
		  this.generacion_de_orden_de_comprass = generacion_de_orden_de_comprass;
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
          

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
    this.dataListConfig.filterAdvanced.No__de_OCFilter = entity.No__de_OCFilter;
    this.dataListConfig.filterAdvanced.No__de_OC = entity.No__de_OC;
    this.dataListConfig.filterAdvanced.No__de_OCMultiple = entity.No__de_OCMultiple;
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
	this.dataListConfig.filterAdvanced.No__de_FacturaFilter = entity.No__de_FacturaFilter;
	this.dataListConfig.filterAdvanced.No__de_Factura = entity.No__de_Factura;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura = entity.fromFecha_de_Factura;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura = entity.toFecha_de_Factura;
    this.dataListConfig.filterAdvanced.fromFecha_de_Pago = entity.fromFecha_de_Pago;
    this.dataListConfig.filterAdvanced.toFecha_de_Pago = entity.toFecha_de_Pago;
	this.dataListConfig.filterAdvanced.Nota_de_CreditoFilter = entity.Nota_de_CreditoFilter;
	this.dataListConfig.filterAdvanced.Nota_de_Credito = entity.Nota_de_Credito;
    this.dataListConfig.filterAdvanced.fromTotal_de_Factura_ = entity.fromTotal_de_Factura_;
    this.dataListConfig.filterAdvanced.toTotal_de_Factura_ = entity.toTotal_de_Factura_;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
	this.dataListConfig.filterAdvanced.IdSolicitudPagoFilter = entity.IdSolicitudPagoFilter;
	this.dataListConfig.filterAdvanced.IdSolicitudPago = entity.IdSolicitudPago;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Ingreso_de_Costos/list'], { state: { data: this.dataListConfig } });
  }
}
