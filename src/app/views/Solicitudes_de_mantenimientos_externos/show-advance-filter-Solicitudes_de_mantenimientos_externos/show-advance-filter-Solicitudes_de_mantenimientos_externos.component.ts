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

import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';


@Component({
  selector: 'app-show-advance-filter-Solicitudes_de_mantenimientos_externos',
  templateUrl: './show-advance-filter-Solicitudes_de_mantenimientos_externos.component.html',
  styleUrls: ['./show-advance-filter-Solicitudes_de_mantenimientos_externos.component.scss']
})
export class ShowAdvanceFilterSolicitudes_de_mantenimientos_externosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public N_Reportes: Crear_Reporte[] = [];
  public Propietarios: Propietarios[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];

  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public crear_reportes: Crear_Reporte;
  public propietarioss: Propietarios;
  public creacion_de_proveedoress: Creacion_de_Proveedores;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "N_Reporte",
      "Propietario",
      "Proveedor",
      "N_Servicio",
      "Descripcion",
      "Costo_pieza",
      "Costo_total",
      "Nuevo_costo",
      "Nuevo_monto_negociado",
      "Observaciones",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "N_Reporte_filtro",
      "Propietario_filtro",
      "Proveedor_filtro",
      "N_Servicio_filtro",
      "Descripcion_filtro",
      "Costo_pieza_filtro",
      "Costo_total_filtro",
      "Nuevo_costo_filtro",
      "Nuevo_monto_negociado_filtro",
      "Observaciones_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Matricula: "",
      Modelo: "",
      N_Reporte: "",
      Propietario: "",
      Proveedor: "",
      N_Servicio: "",
      Descripcion: "",
      Costo_pieza: "",
      Costo_total: "",
      Nuevo_costo: "",
      Nuevo_monto_negociado: "",
      Observaciones: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      N_ReporteFilter: "",
      N_Reporte: "",
      N_ReporteMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      fromCosto_pieza: "",
      toCosto_pieza: "",
      fromCosto_total: "",
      toCosto_total: "",
      fromNuevo_costo: "",
      toNuevo_costo: "",
      fromNuevo_monto_negociado: "",
      toNuevo_monto_negociado: "",

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
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,
    private crear_reporteService: Crear_ReporteService,
    private propietariosService: PropietariosService,
    private creacion_de_proveedoresService: Creacion_de_ProveedoresService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      N_ReporteFilter: [''],
      N_Reporte: [''],
      N_ReporteMultiple: [''],
      PropietarioFilter: [''],
      Propietario: [''],
      PropietarioMultiple: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Solicitudes_de_mantenimientos_externos/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.crear_reporteService.getAll());
    observablesArray.push(this.propietariosService.getAll());
    observablesArray.push(this.creacion_de_proveedoresService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeronaves ,modeloss ,crear_reportes ,propietarioss ,creacion_de_proveedoress ]) => {
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.crear_reportes = crear_reportes;
		  this.propietarioss = propietarioss;
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
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.N_ReporteFilter = entity.N_ReporteFilter;
    this.dataListConfig.filterAdvanced.N_Reporte = entity.N_Reporte;
    this.dataListConfig.filterAdvanced.N_ReporteMultiple = entity.N_ReporteMultiple;
    this.dataListConfig.filterAdvanced.PropietarioFilter = entity.PropietarioFilter;
    this.dataListConfig.filterAdvanced.Propietario = entity.Propietario;
    this.dataListConfig.filterAdvanced.PropietarioMultiple = entity.PropietarioMultiple;
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
	this.dataListConfig.filterAdvanced.N_ServicioFilter = entity.N_ServicioFilter;
	this.dataListConfig.filterAdvanced.N_Servicio = entity.N_Servicio;
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
    this.dataListConfig.filterAdvanced.fromCosto_pieza = entity.fromCosto_pieza;
    this.dataListConfig.filterAdvanced.toCosto_pieza = entity.toCosto_pieza;
    this.dataListConfig.filterAdvanced.fromCosto_total = entity.fromCosto_total;
    this.dataListConfig.filterAdvanced.toCosto_total = entity.toCosto_total;
    this.dataListConfig.filterAdvanced.fromNuevo_costo = entity.fromNuevo_costo;
    this.dataListConfig.filterAdvanced.toNuevo_costo = entity.toNuevo_costo;
    this.dataListConfig.filterAdvanced.fromNuevo_monto_negociado = entity.fromNuevo_monto_negociado;
    this.dataListConfig.filterAdvanced.toNuevo_monto_negociado = entity.toNuevo_monto_negociado;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Solicitudes_de_mantenimientos_externos/list'], { state: { data: this.dataListConfig } });
  }
}
