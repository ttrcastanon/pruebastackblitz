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

import { Tipo_de_Orden_de_Trabajo } from 'src/app/models/Tipo_de_Orden_de_Trabajo';
import { Tipo_de_Orden_de_TrabajoService } from 'src/app/api-services/Tipo_de_Orden_de_Trabajo.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Estatus_Reporte } from 'src/app/models/Estatus_Reporte';
import { Estatus_ReporteService } from 'src/app/api-services/Estatus_Reporte.service';


@Component({
  selector: 'app-show-advance-filter-Orden_de_Trabajo',
  templateUrl: './show-advance-filter-Orden_de_Trabajo.component.html',
  styleUrls: ['./show-advance-filter-Orden_de_Trabajo.component.scss']
})
export class ShowAdvanceFilterOrden_de_TrabajoComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Tipo_de_ordens: Tipo_de_Orden_de_Trabajo[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public Propietarios: Propietarios[] = [];
  public Estatuss: Estatus_Reporte[] = [];

  public tipo_de_orden_de_trabajos: Tipo_de_Orden_de_Trabajo;
  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public propietarioss: Propietarios;
  public estatus_reportes: Estatus_Reporte;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Tipo_de_orden",
      "Matricula",
      "Modelo",
      "Propietario",
      "Fecha_de_Creacion",
      "Fecha_de_entrega",
      "Cant_de_reportes_pendientes",
      "Cant_de_reportes_asignados",
      "Cant_de_reportes_cerrados",
      "Cant_de_rpts_mandatorios_abiertos",
      "Horas_acumuladas",
      "Ciclos_acumulados",
      "Estatus",
      "Causa_de_Cancelacion",
      "numero_de_orden",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Tipo_de_orden_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Propietario_filtro",
      "Fecha_de_Creacion_filtro",
      "Fecha_de_entrega_filtro",
      "Cant_de_reportes_pendientes_filtro",
      "Cant_de_reportes_asignados_filtro",
      "Cant_de_reportes_cerrados_filtro",
      "Cant_de_rpts_mandatorios_abiertos_filtro",
      "Horas_acumuladas_filtro",
      "Ciclos_acumulados_filtro",
      "Estatus_filtro",
      "Causa_de_Cancelacion_filtro",
      "numero_de_orden_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Tipo_de_orden: "",
      Matricula: "",
      Modelo: "",
      Propietario: "",
      Fecha_de_Creacion: null,
      Fecha_de_entrega: null,
      Cant_de_reportes_pendientes: "",
      Cant_de_reportes_asignados: "",
      Cant_de_reportes_cerrados: "",
      Cant_de_rpts_mandatorios_abiertos: "",
      Horas_acumuladas: "",
      Ciclos_acumulados: "",
      Estatus: "",
      Causa_de_Cancelacion: "",
      numero_de_orden: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Tipo_de_ordenFilter: "",
      Tipo_de_orden: "",
      Tipo_de_ordenMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      fromFecha_de_Creacion: "",
      toFecha_de_Creacion: "",
      fromFecha_de_entrega: "",
      toFecha_de_entrega: "",
      fromCant_de_reportes_pendientes: "",
      toCant_de_reportes_pendientes: "",
      fromCant_de_reportes_asignados: "",
      toCant_de_reportes_asignados: "",
      fromCant_de_reportes_cerrados: "",
      toCant_de_reportes_cerrados: "",
      fromCant_de_rpts_mandatorios_abiertos: "",
      toCant_de_rpts_mandatorios_abiertos: "",
      fromHoras_acumuladas: "",
      toHoras_acumuladas: "",
      fromCiclos_acumulados: "",
      toCiclos_acumulados: "",
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
    private tipo_de_orden_de_trabajoService: Tipo_de_Orden_de_TrabajoService,
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,
    private propietariosService: PropietariosService,
    private estatus_reporteService: Estatus_ReporteService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Tipo_de_ordenFilter: [''],
      Tipo_de_orden: [''],
      Tipo_de_ordenMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      PropietarioFilter: [''],
      Propietario: [''],
      PropietarioMultiple: [''],
      fromFecha_de_Creacion: [''],
      toFecha_de_Creacion: [''],
      fromFecha_de_entrega: [''],
      toFecha_de_entrega: [''],
      fromCant_de_reportes_pendientes: [''],
      toCant_de_reportes_pendientes: [''],
      fromCant_de_reportes_asignados: [''],
      toCant_de_reportes_asignados: [''],
      fromCant_de_reportes_cerrados: [''],
      toCant_de_reportes_cerrados: [''],
      fromCant_de_rpts_mandatorios_abiertos: [''],
      toCant_de_rpts_mandatorios_abiertos: [''],
      fromHoras_acumuladas: [''],
      toHoras_acumuladas: [''],
      fromCiclos_acumulados: [''],
      toCiclos_acumulados: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Orden_de_Trabajo/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipo_de_orden_de_trabajoService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.propietariosService.getAll());
    observablesArray.push(this.estatus_reporteService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipo_de_orden_de_trabajos ,aeronaves ,modeloss ,propietarioss ,estatus_reportes ]) => {
		  this.tipo_de_orden_de_trabajos = tipo_de_orden_de_trabajos;
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.propietarioss = propietarioss;
		  this.estatus_reportes = estatus_reportes;
          

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
    this.dataListConfig.filterAdvanced.Tipo_de_ordenFilter = entity.Tipo_de_ordenFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_orden = entity.Tipo_de_orden;
    this.dataListConfig.filterAdvanced.Tipo_de_ordenMultiple = entity.Tipo_de_ordenMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.PropietarioFilter = entity.PropietarioFilter;
    this.dataListConfig.filterAdvanced.Propietario = entity.Propietario;
    this.dataListConfig.filterAdvanced.PropietarioMultiple = entity.PropietarioMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Creacion = entity.fromFecha_de_Creacion;
    this.dataListConfig.filterAdvanced.toFecha_de_Creacion = entity.toFecha_de_Creacion;
    this.dataListConfig.filterAdvanced.fromFecha_de_entrega = entity.fromFecha_de_entrega;
    this.dataListConfig.filterAdvanced.toFecha_de_entrega = entity.toFecha_de_entrega;
    this.dataListConfig.filterAdvanced.fromCant_de_reportes_pendientes = entity.fromCant_de_reportes_pendientes;
    this.dataListConfig.filterAdvanced.toCant_de_reportes_pendientes = entity.toCant_de_reportes_pendientes;
    this.dataListConfig.filterAdvanced.fromCant_de_reportes_asignados = entity.fromCant_de_reportes_asignados;
    this.dataListConfig.filterAdvanced.toCant_de_reportes_asignados = entity.toCant_de_reportes_asignados;
    this.dataListConfig.filterAdvanced.fromCant_de_reportes_cerrados = entity.fromCant_de_reportes_cerrados;
    this.dataListConfig.filterAdvanced.toCant_de_reportes_cerrados = entity.toCant_de_reportes_cerrados;
    this.dataListConfig.filterAdvanced.fromCant_de_rpts_mandatorios_abiertos = entity.fromCant_de_rpts_mandatorios_abiertos;
    this.dataListConfig.filterAdvanced.toCant_de_rpts_mandatorios_abiertos = entity.toCant_de_rpts_mandatorios_abiertos;
    this.dataListConfig.filterAdvanced.fromHoras_acumuladas = entity.fromHoras_acumuladas;
    this.dataListConfig.filterAdvanced.toHoras_acumuladas = entity.toHoras_acumuladas;
    this.dataListConfig.filterAdvanced.fromCiclos_acumulados = entity.fromCiclos_acumulados;
    this.dataListConfig.filterAdvanced.toCiclos_acumulados = entity.toCiclos_acumulados;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
	this.dataListConfig.filterAdvanced.Causa_de_CancelacionFilter = entity.Causa_de_CancelacionFilter;
	this.dataListConfig.filterAdvanced.Causa_de_Cancelacion = entity.Causa_de_Cancelacion;
	this.dataListConfig.filterAdvanced.numero_de_ordenFilter = entity.numero_de_ordenFilter;
	this.dataListConfig.filterAdvanced.numero_de_orden = entity.numero_de_orden;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Orden_de_Trabajo/list'], { state: { data: this.dataListConfig } });
  }
}
