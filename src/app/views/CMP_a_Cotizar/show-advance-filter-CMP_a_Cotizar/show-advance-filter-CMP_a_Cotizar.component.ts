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

import { Cotizacion } from 'src/app/models/Cotizacion';
import { CotizacionService } from 'src/app/api-services/Cotizacion.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Tipo_de_Reporte } from 'src/app/models/Tipo_de_Reporte';
import { Tipo_de_ReporteService } from 'src/app/api-services/Tipo_de_Reporte.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Estatus_de_CMP_a_Cotizar } from 'src/app/models/Estatus_de_CMP_a_Cotizar';
import { Estatus_de_CMP_a_CotizarService } from 'src/app/api-services/Estatus_de_CMP_a_Cotizar.service';


@Component({
  selector: 'app-show-advance-filter-CMP_a_Cotizar',
  templateUrl: './show-advance-filter-CMP_a_Cotizar.component.html',
  styleUrls: ['./show-advance-filter-CMP_a_Cotizar.component.scss']
})
export class ShowAdvanceFilterCMP_a_CotizarComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Cotizacions: Cotizacion[] = [];
  public Orden_de_Trabajos: Orden_de_Trabajo[] = [];
  public Tipo_de_Reportes: Tipo_de_Reporte[] = [];
  public Codigo_Computarizados: Codigo_Computarizado[] = [];
  public Estatuss: Estatus_de_CMP_a_Cotizar[] = [];

  public cotizacions: Cotizacion;
  public orden_de_trabajos: Orden_de_Trabajo;
  public tipo_de_reportes: Tipo_de_Reporte;
  public codigo_computarizados: Codigo_Computarizado;
  public estatus_de_cmp_a_cotizars: Estatus_de_CMP_a_Cotizar;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Cotizacion",
      "Orden_de_Trabajo",
      "Tipo_de_Reporte",
      "Codigo_Computarizado",
      "Tiempo_Estandar_de_Ejecucion",
      "tiempo_a_cobrar",
      "Tiempo_a_Cobrar_Rampa",
      "Costo_HR_Tecnico",
      "Costo_HR_Rampa",
      "Motivo_de_Cambio_de_Tarifa",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Cotizacion_filtro",
      "Orden_de_Trabajo_filtro",
      "Tipo_de_Reporte_filtro",
      "Codigo_Computarizado_filtro",
      "Tiempo_Estandar_de_Ejecucion_filtro",
      "tiempo_a_cobrar_filtro",
      "Tiempo_a_Cobrar_Rampa_filtro",
      "Costo_HR_Tecnico_filtro",
      "Costo_HR_Rampa_filtro",
      "Motivo_de_Cambio_de_Tarifa_filtro",
      "Estatus_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Cotizacion: "",
      Orden_de_Trabajo: "",
      Tipo_de_Reporte: "",
      Codigo_Computarizado: "",
      Tiempo_Estandar_de_Ejecucion: "",
      tiempo_a_cobrar: "",
      Tiempo_a_Cobrar_Rampa: "",
      Costo_HR_Tecnico: "",
      Costo_HR_Rampa: "",
      Motivo_de_Cambio_de_Tarifa: "",
      Estatus: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      CotizacionFilter: "",
      Cotizacion: "",
      CotizacionMultiple: "",
      Orden_de_TrabajoFilter: "",
      Orden_de_Trabajo: "",
      Orden_de_TrabajoMultiple: "",
      Tipo_de_ReporteFilter: "",
      Tipo_de_Reporte: "",
      Tipo_de_ReporteMultiple: "",
      Codigo_ComputarizadoFilter: "",
      Codigo_Computarizado: "",
      Codigo_ComputarizadoMultiple: "",
      fromTiempo_Estandar_de_Ejecucion: "",
      toTiempo_Estandar_de_Ejecucion: "",
      fromtiempo_a_cobrar: "",
      totiempo_a_cobrar: "",
      fromTiempo_a_Cobrar_Rampa: "",
      toTiempo_a_Cobrar_Rampa: "",
      fromCosto_HR_Tecnico: "",
      toCosto_HR_Tecnico: "",
      fromCosto_HR_Rampa: "",
      toCosto_HR_Rampa: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

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
    private cotizacionService: CotizacionService,
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private tipo_de_reporteService: Tipo_de_ReporteService,
    private codigo_computarizadoService: Codigo_ComputarizadoService,
    private estatus_de_cmp_a_cotizarService: Estatus_de_CMP_a_CotizarService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      CotizacionFilter: [''],
      Cotizacion: [''],
      CotizacionMultiple: [''],
      Orden_de_TrabajoFilter: [''],
      Orden_de_Trabajo: [''],
      Orden_de_TrabajoMultiple: [''],
      Tipo_de_ReporteFilter: [''],
      Tipo_de_Reporte: [''],
      Tipo_de_ReporteMultiple: [''],
      Codigo_ComputarizadoFilter: [''],
      Codigo_Computarizado: [''],
      Codigo_ComputarizadoMultiple: [''],
      fromTiempo_Estandar_de_Ejecucion: [''],
      toTiempo_Estandar_de_Ejecucion: [''],
      fromCosto_HR_Tecnico: [''],
      toCosto_HR_Tecnico: [''],
      fromCosto_HR_Rampa: [''],
      toCosto_HR_Rampa: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['CMP_a_Cotizar/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.cotizacionService.getAll());
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.tipo_de_reporteService.getAll());
    observablesArray.push(this.codigo_computarizadoService.getAll());
    observablesArray.push(this.estatus_de_cmp_a_cotizarService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,cotizacions ,orden_de_trabajos ,tipo_de_reportes ,codigo_computarizados ,estatus_de_cmp_a_cotizars ]) => {
		  this.cotizacions = cotizacions;
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.tipo_de_reportes = tipo_de_reportes;
		  this.codigo_computarizados = codigo_computarizados;
		  this.estatus_de_cmp_a_cotizars = estatus_de_cmp_a_cotizars;
          

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
    this.dataListConfig.filterAdvanced.CotizacionFilter = entity.CotizacionFilter;
    this.dataListConfig.filterAdvanced.Cotizacion = entity.Cotizacion;
    this.dataListConfig.filterAdvanced.CotizacionMultiple = entity.CotizacionMultiple;
    this.dataListConfig.filterAdvanced.Orden_de_TrabajoFilter = entity.Orden_de_TrabajoFilter;
    this.dataListConfig.filterAdvanced.Orden_de_Trabajo = entity.Orden_de_Trabajo;
    this.dataListConfig.filterAdvanced.Orden_de_TrabajoMultiple = entity.Orden_de_TrabajoMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_ReporteFilter = entity.Tipo_de_ReporteFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Reporte = entity.Tipo_de_Reporte;
    this.dataListConfig.filterAdvanced.Tipo_de_ReporteMultiple = entity.Tipo_de_ReporteMultiple;
    this.dataListConfig.filterAdvanced.Codigo_ComputarizadoFilter = entity.Codigo_ComputarizadoFilter;
    this.dataListConfig.filterAdvanced.Codigo_Computarizado = entity.Codigo_Computarizado;
    this.dataListConfig.filterAdvanced.Codigo_ComputarizadoMultiple = entity.Codigo_ComputarizadoMultiple;
	this.dataListConfig.filterAdvanced.Tiempo_Estandar_de_EjecucionFilter = entity.Tiempo_Estandar_de_EjecucionFilter;
	this.dataListConfig.filterAdvanced.Tiempo_Estandar_de_Ejecucion = entity.Tiempo_Estandar_de_Ejecucion;
    this.dataListConfig.filterAdvanced.fromtiempo_a_cobrar = entity.fromtiempo_a_cobrar;
    this.dataListConfig.filterAdvanced.totiempo_a_cobrar = entity.totiempo_a_cobrar;
    this.dataListConfig.filterAdvanced.fromTiempo_a_Cobrar_Rampa = entity.fromTiempo_a_Cobrar_Rampa;
    this.dataListConfig.filterAdvanced.toTiempo_a_Cobrar_Rampa = entity.toTiempo_a_Cobrar_Rampa;
    this.dataListConfig.filterAdvanced.fromCosto_HR_Tecnico = entity.fromCosto_HR_Tecnico;
    this.dataListConfig.filterAdvanced.toCosto_HR_Tecnico = entity.toCosto_HR_Tecnico;
    this.dataListConfig.filterAdvanced.fromCosto_HR_Rampa = entity.fromCosto_HR_Rampa;
    this.dataListConfig.filterAdvanced.toCosto_HR_Rampa = entity.toCosto_HR_Rampa;
	this.dataListConfig.filterAdvanced.Motivo_de_Cambio_de_TarifaFilter = entity.Motivo_de_Cambio_de_TarifaFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_Cambio_de_Tarifa = entity.Motivo_de_Cambio_de_Tarifa;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['CMP_a_Cotizar/list'], { state: { data: this.dataListConfig } });
  }
}
