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

import { Actividades_de_los_Colaboradores } from 'src/app/models/Actividades_de_los_Colaboradores';
import { Actividades_de_los_ColaboradoresService } from 'src/app/api-services/Actividades_de_los_Colaboradores.service';
import { Creacion_de_Usuarios } from 'src/app/models/Creacion_de_Usuarios';
import { Creacion_de_UsuariosService } from 'src/app/api-services/Creacion_de_Usuarios.service';
import { Cargos } from 'src/app/models/Cargos';
import { CargosService } from 'src/app/api-services/Cargos.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_servicio } from 'src/app/models/Orden_de_servicio';
import { Orden_de_servicioService } from 'src/app/api-services/Orden_de_servicio.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Catalogo_Actividades_de_Colaboradores } from 'src/app/models/Catalogo_Actividades_de_Colaboradores';
import { Catalogo_Actividades_de_ColaboradoresService } from 'src/app/api-services/Catalogo_Actividades_de_Colaboradores.service';


@Component({
  selector: 'app-show-advance-filter-Detalle_de_Actividades_de_Colaboradores',
  templateUrl: './show-advance-filter-Detalle_de_Actividades_de_Colaboradores.component.html',
  styleUrls: ['./show-advance-filter-Detalle_de_Actividades_de_Colaboradores.component.scss']
})
export class ShowAdvanceFilterDetalle_de_Actividades_de_ColaboradoresComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Id_Actividads: Actividades_de_los_Colaboradores[] = [];
  public Colaboradors: Creacion_de_Usuarios[] = [];
  public Puestos: Cargos[] = [];
  public Empresas: Cliente[] = [];
  public No_OTs: Orden_de_Trabajo[] = [];
  public No_OSs: Orden_de_servicio[] = [];
  public No_Vuelos: Solicitud_de_Vuelo[] = [];
  public No_Reportes: Crear_Reporte[] = [];
  public Matriculas: Aeronave[] = [];
  public Conceptos: Catalogo_Actividades_de_Colaboradores[] = [];

  public actividades_de_los_colaboradoress: Actividades_de_los_Colaboradores;
  public creacion_de_usuarioss: Creacion_de_Usuarios;
  public cargoss: Cargos;
  public clientes: Cliente;
  public orden_de_trabajos: Orden_de_Trabajo;
  public orden_de_servicios: Orden_de_servicio;
  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public crear_reportes: Crear_Reporte;
  public aeronaves: Aeronave;
  public catalogo_actividades_de_colaboradoress: Catalogo_Actividades_de_Colaboradores;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Id_Actividad",
      "Fecha_de_Reporte",
      "Dia_Inhabil",
      "Colaborador",
      "Puesto",
      "Empresa",
      "Inicio_Horario_Laboral",
      "Fin_Horario_Laboral",
      "No_OT",
      "No_OS",
      "No_Vuelo",
      "No_Reporte",
      "Hora_Inicial",
      "Hora_Final",
      "Matricula",
      "Concepto",
      "Hora_Normal",
      "Horas_Extra",
      "Tiempo_Normal",
      "Tiempo_Extra",
      "Aeronave_Propia",
      "Observaciones",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Id_Actividad_filtro",
      "Fecha_de_Reporte_filtro",
      "Dia_Inhabil_filtro",
      "Colaborador_filtro",
      "Puesto_filtro",
      "Empresa_filtro",
      "Inicio_Horario_Laboral_filtro",
      "Fin_Horario_Laboral_filtro",
      "No_OT_filtro",
      "No_OS_filtro",
      "No_Vuelo_filtro",
      "No_Reporte_filtro",
      "Hora_Inicial_filtro",
      "Hora_Final_filtro",
      "Matricula_filtro",
      "Concepto_filtro",
      "Hora_Normal_filtro",
      "Horas_Extra_filtro",
      "Tiempo_Normal_filtro",
      "Tiempo_Extra_filtro",
      "Aeronave_Propia_filtro",
      "Observaciones_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Id_Actividad: "",
      Fecha_de_Reporte: null,
      Dia_Inhabil: "",
      Colaborador: "",
      Puesto: "",
      Empresa: "",
      Inicio_Horario_Laboral: "",
      Fin_Horario_Laboral: "",
      No_OT: "",
      No_OS: "",
      No_Vuelo: "",
      No_Reporte: "",
      Hora_Inicial: "",
      Hora_Final: "",
      Matricula: "",
      Concepto: "",
      Hora_Normal: "",
      Horas_Extra: "",
      Tiempo_Normal: "",
      Tiempo_Extra: "",
      Aeronave_Propia: "",
      Observaciones: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Id_ActividadFilter: "",
      Id_Actividad: "",
      Id_ActividadMultiple: "",
      fromFecha_de_Reporte: "",
      toFecha_de_Reporte: "",
      ColaboradorFilter: "",
      Colaborador: "",
      ColaboradorMultiple: "",
      PuestoFilter: "",
      Puesto: "",
      PuestoMultiple: "",
      EmpresaFilter: "",
      Empresa: "",
      EmpresaMultiple: "",
      fromInicio_Horario_Laboral: "",
      toInicio_Horario_Laboral: "",
      fromFin_Horario_Laboral: "",
      toFin_Horario_Laboral: "",
      No_OTFilter: "",
      No_OT: "",
      No_OTMultiple: "",
      No_OSFilter: "",
      No_OS: "",
      No_OSMultiple: "",
      No_VueloFilter: "",
      No_Vuelo: "",
      No_VueloMultiple: "",
      No_ReporteFilter: "",
      No_Reporte: "",
      No_ReporteMultiple: "",
      fromHora_Inicial: "",
      toHora_Inicial: "",
      fromHora_Final: "",
      toHora_Final: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ConceptoFilter: "",
      Concepto: "",
      ConceptoMultiple: "",
      fromHora_Normal: "",
      toHora_Normal: "",
      fromHoras_Extra: "",
      toHoras_Extra: "",

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
    private actividades_de_los_colaboradoresService: Actividades_de_los_ColaboradoresService,
    private creacion_de_usuariosService: Creacion_de_UsuariosService,
    private cargosService: CargosService,
    private clienteService: ClienteService,
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private orden_de_servicioService: Orden_de_servicioService,
    private solicitud_de_vueloService: Solicitud_de_VueloService,
    private crear_reporteService: Crear_ReporteService,
    private aeronaveService: AeronaveService,
    private catalogo_actividades_de_colaboradoresService: Catalogo_Actividades_de_ColaboradoresService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Id_ActividadFilter: [''],
      Id_Actividad: [''],
      Id_ActividadMultiple: [''],
      fromFecha_de_Reporte: [''],
      toFecha_de_Reporte: [''],
      ColaboradorFilter: [''],
      Colaborador: [''],
      ColaboradorMultiple: [''],
      PuestoFilter: [''],
      Puesto: [''],
      PuestoMultiple: [''],
      EmpresaFilter: [''],
      Empresa: [''],
      EmpresaMultiple: [''],
      fromInicio_Horario_Laboral: [''],
      toInicio_Horario_Laboral: [''],
      fromFin_Horario_Laboral: [''],
      toFin_Horario_Laboral: [''],
      No_OTFilter: [''],
      No_OT: [''],
      No_OTMultiple: [''],
      No_OSFilter: [''],
      No_OS: [''],
      No_OSMultiple: [''],
      No_VueloFilter: [''],
      No_Vuelo: [''],
      No_VueloMultiple: [''],
      No_ReporteFilter: [''],
      No_Reporte: [''],
      No_ReporteMultiple: [''],
      fromHora_Inicial: [''],
      toHora_Inicial: [''],
      fromHora_Final: [''],
      toHora_Final: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ConceptoFilter: [''],
      Concepto: [''],
      ConceptoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Detalle_de_Actividades_de_Colaboradores/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.actividades_de_los_colaboradoresService.getAll());
    observablesArray.push(this.creacion_de_usuariosService.getAll());
    observablesArray.push(this.cargosService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.orden_de_servicioService.getAll());
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.crear_reporteService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.catalogo_actividades_de_colaboradoresService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,actividades_de_los_colaboradoress ,creacion_de_usuarioss ,cargoss ,clientes ,orden_de_trabajos ,orden_de_servicios ,solicitud_de_vuelos ,crear_reportes ,aeronaves ,catalogo_actividades_de_colaboradoress ]) => {
		  this.actividades_de_los_colaboradoress = actividades_de_los_colaboradoress;
		  this.creacion_de_usuarioss = creacion_de_usuarioss;
		  this.cargoss = cargoss;
		  this.clientes = clientes;
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.orden_de_servicios = orden_de_servicios;
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.crear_reportes = crear_reportes;
		  this.aeronaves = aeronaves;
		  this.catalogo_actividades_de_colaboradoress = catalogo_actividades_de_colaboradoress;
          

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
    this.dataListConfig.filterAdvanced.Id_ActividadFilter = entity.Id_ActividadFilter;
    this.dataListConfig.filterAdvanced.Id_Actividad = entity.Id_Actividad;
    this.dataListConfig.filterAdvanced.Id_ActividadMultiple = entity.Id_ActividadMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Reporte = entity.fromFecha_de_Reporte;
    this.dataListConfig.filterAdvanced.toFecha_de_Reporte = entity.toFecha_de_Reporte;
    this.dataListConfig.filterAdvanced.ColaboradorFilter = entity.ColaboradorFilter;
    this.dataListConfig.filterAdvanced.Colaborador = entity.Colaborador;
    this.dataListConfig.filterAdvanced.ColaboradorMultiple = entity.ColaboradorMultiple;
    this.dataListConfig.filterAdvanced.PuestoFilter = entity.PuestoFilter;
    this.dataListConfig.filterAdvanced.Puesto = entity.Puesto;
    this.dataListConfig.filterAdvanced.PuestoMultiple = entity.PuestoMultiple;
    this.dataListConfig.filterAdvanced.EmpresaFilter = entity.EmpresaFilter;
    this.dataListConfig.filterAdvanced.Empresa = entity.Empresa;
    this.dataListConfig.filterAdvanced.EmpresaMultiple = entity.EmpresaMultiple;
	this.dataListConfig.filterAdvanced.Inicio_Horario_LaboralFilter = entity.Inicio_Horario_LaboralFilter;
	this.dataListConfig.filterAdvanced.Inicio_Horario_Laboral = entity.Inicio_Horario_Laboral;
	this.dataListConfig.filterAdvanced.Fin_Horario_LaboralFilter = entity.Fin_Horario_LaboralFilter;
	this.dataListConfig.filterAdvanced.Fin_Horario_Laboral = entity.Fin_Horario_Laboral;
    this.dataListConfig.filterAdvanced.No_OTFilter = entity.No_OTFilter;
    this.dataListConfig.filterAdvanced.No_OT = entity.No_OT;
    this.dataListConfig.filterAdvanced.No_OTMultiple = entity.No_OTMultiple;
    this.dataListConfig.filterAdvanced.No_OSFilter = entity.No_OSFilter;
    this.dataListConfig.filterAdvanced.No_OS = entity.No_OS;
    this.dataListConfig.filterAdvanced.No_OSMultiple = entity.No_OSMultiple;
    this.dataListConfig.filterAdvanced.No_VueloFilter = entity.No_VueloFilter;
    this.dataListConfig.filterAdvanced.No_Vuelo = entity.No_Vuelo;
    this.dataListConfig.filterAdvanced.No_VueloMultiple = entity.No_VueloMultiple;
    this.dataListConfig.filterAdvanced.No_ReporteFilter = entity.No_ReporteFilter;
    this.dataListConfig.filterAdvanced.No_Reporte = entity.No_Reporte;
    this.dataListConfig.filterAdvanced.No_ReporteMultiple = entity.No_ReporteMultiple;
	this.dataListConfig.filterAdvanced.Hora_InicialFilter = entity.Hora_InicialFilter;
	this.dataListConfig.filterAdvanced.Hora_Inicial = entity.Hora_Inicial;
	this.dataListConfig.filterAdvanced.Hora_FinalFilter = entity.Hora_FinalFilter;
	this.dataListConfig.filterAdvanced.Hora_Final = entity.Hora_Final;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ConceptoFilter = entity.ConceptoFilter;
    this.dataListConfig.filterAdvanced.Concepto = entity.Concepto;
    this.dataListConfig.filterAdvanced.ConceptoMultiple = entity.ConceptoMultiple;
    this.dataListConfig.filterAdvanced.fromHora_Normal = entity.fromHora_Normal;
    this.dataListConfig.filterAdvanced.toHora_Normal = entity.toHora_Normal;
    this.dataListConfig.filterAdvanced.fromHoras_Extra = entity.fromHoras_Extra;
    this.dataListConfig.filterAdvanced.toHoras_Extra = entity.toHoras_Extra;
	this.dataListConfig.filterAdvanced.Tiempo_NormalFilter = entity.Tiempo_NormalFilter;
	this.dataListConfig.filterAdvanced.Tiempo_Normal = entity.Tiempo_Normal;
	this.dataListConfig.filterAdvanced.Tiempo_ExtraFilter = entity.Tiempo_ExtraFilter;
	this.dataListConfig.filterAdvanced.Tiempo_Extra = entity.Tiempo_Extra;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Detalle_de_Actividades_de_Colaboradores/list'], { state: { data: this.dataListConfig } });
  }
}
