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

import { Solicitud_de_Servicios_para_Operaciones } from 'src/app/models/Solicitud_de_Servicios_para_Operaciones';
import { Solicitud_de_Servicios_para_OperacionesService } from 'src/app/api-services/Solicitud_de_Servicios_para_Operaciones.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Unidad } from 'src/app/models/Unidad';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';


@Component({
  selector: 'app-show-advance-filter-Pago_de_servicios_de_operaciones',
  templateUrl: './show-advance-filter-Pago_de_servicios_de_operaciones.component.html',
  styleUrls: ['./show-advance-filter-Pago_de_servicios_de_operaciones.component.scss']
})
export class ShowAdvanceFilterPago_de_servicios_de_operacionesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public No_de_Solicituds: Solicitud_de_Servicios_para_Operaciones[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];
  public No_Vuelos: Solicitud_de_Vuelo[] = [];
  public Aeropuertos: Aeropuertos[] = [];
  public Unidads: Unidad[] = [];
  public Estatuss: Estatus_de_Seguimiento[] = [];

  public solicitud_de_servicios_para_operacioness: Solicitud_de_Servicios_para_Operaciones;
  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public aeropuertoss: Aeropuertos;
  public unidads: Unidad;
  public estatus_de_seguimientos: Estatus_de_Seguimiento;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "IdLisPagServOp",
      "No_de_Solicitud",
      "Proveedor",
      "No_Vuelo",
      "Aeropuerto",
      "Descripcion",
      "Cantidad",
      "Unidad",
      "Costo",
      "No_de_Factura",
      "Fecha_de_Factura",
      "Tiempos_de_Pago",
      "Estatus",
      "No_de_Referencia",
      "Fecha_de_Ejecucion_del_Pago",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "IdLisPagServOp_filtro",
      "No_de_Solicitud_filtro",
      "Proveedor_filtro",
      "No_Vuelo_filtro",
      "Aeropuerto_filtro",
      "Descripcion_filtro",
      "Cantidad_filtro",
      "Unidad_filtro",
      "Costo_filtro",
      "No_de_Factura_filtro",
      "Fecha_de_Factura_filtro",
      "Tiempos_de_Pago_filtro",
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
      IdLisPagServOp: "",
      No_de_Solicitud: "",
      Proveedor: "",
      No_Vuelo: "",
      Aeropuerto: "",
      Descripcion: "",
      Cantidad: "",
      Unidad: "",
      Costo: "",
      No_de_Factura: "",
      Fecha_de_Factura: null,
      Tiempos_de_Pago: "",
      Estatus: "",
      No_de_Referencia: "",
      Fecha_de_Ejecucion_del_Pago: null,

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromIdLisPagServOp: "",
      toIdLisPagServOp: "",
      No_de_SolicitudFilter: "",
      No_de_Solicitud: "",
      No_de_SolicitudMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      No_VueloFilter: "",
      No_Vuelo: "",
      No_VueloMultiple: "",
      AeropuertoFilter: "",
      Aeropuerto: "",
      AeropuertoMultiple: "",
      fromCantidad: "",
      toCantidad: "",
      UnidadFilter: "",
      Unidad: "",
      UnidadMultiple: "",
      fromCosto: "",
      toCosto: "",
      fromNo_de_Factura: "",
      toNo_de_Factura: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",
      fromTiempos_de_Pago: "",
      toTiempos_de_Pago: "",
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
    private solicitud_de_servicios_para_operacionesService: Solicitud_de_Servicios_para_OperacionesService,
    private creacion_de_proveedoresService: Creacion_de_ProveedoresService,
    private solicitud_de_vueloService: Solicitud_de_VueloService,
    private aeropuertosService: AeropuertosService,
    private unidadService: UnidadService,
    private estatus_de_seguimientoService: Estatus_de_SeguimientoService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromIdLisPagServOp: [''],
      toIdLisPagServOp: [''],
      No_de_SolicitudFilter: [''],
      No_de_Solicitud: [''],
      No_de_SolicitudMultiple: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],
      No_VueloFilter: [''],
      No_Vuelo: [''],
      No_VueloMultiple: [''],
      AeropuertoFilter: [''],
      Aeropuerto: [''],
      AeropuertoMultiple: [''],
      fromCantidad: [''],
      toCantidad: [''],
      UnidadFilter: [''],
      Unidad: [''],
      UnidadMultiple: [''],
      fromCosto: [''],
      toCosto: [''],
      fromNo_de_Factura: [''],
      toNo_de_Factura: [''],
      fromFecha_de_Factura: [''],
      toFecha_de_Factura: [''],
      fromTiempos_de_Pago: [''],
      toTiempos_de_Pago: [''],
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
    this.router.navigate(['Pago_de_servicios_de_operaciones/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_servicios_para_operacionesService.getAll());
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.aeropuertosService.getAll());
    observablesArray.push(this.unidadService.getAll());
    observablesArray.push(this.estatus_de_seguimientoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_servicios_para_operacioness ,creacion_de_proveedoress ,solicitud_de_vuelos ,aeropuertoss ,unidads ,estatus_de_seguimientos ]) => {
		  this.solicitud_de_servicios_para_operacioness = solicitud_de_servicios_para_operacioness;
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.aeropuertoss = aeropuertoss;
		  this.unidads = unidads;
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
    this.dataListConfig.filterAdvanced.fromIdLisPagServOp = entity.fromIdLisPagServOp;
    this.dataListConfig.filterAdvanced.toIdLisPagServOp = entity.toIdLisPagServOp;
    this.dataListConfig.filterAdvanced.No_de_SolicitudFilter = entity.No_de_SolicitudFilter;
    this.dataListConfig.filterAdvanced.No_de_Solicitud = entity.No_de_Solicitud;
    this.dataListConfig.filterAdvanced.No_de_SolicitudMultiple = entity.No_de_SolicitudMultiple;
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
    this.dataListConfig.filterAdvanced.No_VueloFilter = entity.No_VueloFilter;
    this.dataListConfig.filterAdvanced.No_Vuelo = entity.No_Vuelo;
    this.dataListConfig.filterAdvanced.No_VueloMultiple = entity.No_VueloMultiple;
    this.dataListConfig.filterAdvanced.AeropuertoFilter = entity.AeropuertoFilter;
    this.dataListConfig.filterAdvanced.Aeropuerto = entity.Aeropuerto;
    this.dataListConfig.filterAdvanced.AeropuertoMultiple = entity.AeropuertoMultiple;
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
    this.dataListConfig.filterAdvanced.fromCantidad = entity.fromCantidad;
    this.dataListConfig.filterAdvanced.toCantidad = entity.toCantidad;
    this.dataListConfig.filterAdvanced.UnidadFilter = entity.UnidadFilter;
    this.dataListConfig.filterAdvanced.Unidad = entity.Unidad;
    this.dataListConfig.filterAdvanced.UnidadMultiple = entity.UnidadMultiple;
    this.dataListConfig.filterAdvanced.fromCosto = entity.fromCosto;
    this.dataListConfig.filterAdvanced.toCosto = entity.toCosto;
    this.dataListConfig.filterAdvanced.fromNo_de_Factura = entity.fromNo_de_Factura;
    this.dataListConfig.filterAdvanced.toNo_de_Factura = entity.toNo_de_Factura;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura = entity.fromFecha_de_Factura;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura = entity.toFecha_de_Factura;
    this.dataListConfig.filterAdvanced.fromTiempos_de_Pago = entity.fromTiempos_de_Pago;
    this.dataListConfig.filterAdvanced.toTiempos_de_Pago = entity.toTiempos_de_Pago;
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
    this.router.navigate(['Pago_de_servicios_de_operaciones/list'], { state: { data: this.dataListConfig } });
  }
}
