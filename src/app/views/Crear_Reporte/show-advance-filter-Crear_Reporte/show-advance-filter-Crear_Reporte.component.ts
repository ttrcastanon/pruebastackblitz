import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from '@andufratu/ngx-custom-validators';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Filter } from 'src/app/models/filter';

import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_servicio } from 'src/app/models/Orden_de_servicio';
import { Orden_de_servicioService } from 'src/app/api-services/Orden_de_servicio.service';
import { Tipo_orden_de_servicio } from 'src/app/models/Tipo_orden_de_servicio';
import { Tipo_orden_de_servicioService } from 'src/app/api-services/Tipo_orden_de_servicio.service';
import { Prioridad_del_Reporte } from 'src/app/models/Prioridad_del_Reporte';
import { Prioridad_del_ReporteService } from 'src/app/api-services/Prioridad_del_Reporte.service';
import { Tipo_de_Orden_de_Trabajo } from 'src/app/models/Tipo_de_Orden_de_Trabajo';
import { Tipo_de_Orden_de_TrabajoService } from 'src/app/api-services/Tipo_de_Orden_de_Trabajo.service';
import { Estatus_de_Reporte } from 'src/app/models/Estatus_de_Reporte';
import { Estatus_de_ReporteService } from 'src/app/api-services/Estatus_de_Reporte.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Tipo_de_origen_del_reporte } from 'src/app/models/Tipo_de_origen_del_reporte';
import { Tipo_de_origen_del_reporteService } from 'src/app/api-services/Tipo_de_origen_del_reporte.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Tipo_de_Reporte } from 'src/app/models/Tipo_de_Reporte';
import { Tipo_de_ReporteService } from 'src/app/api-services/Tipo_de_Reporte.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Ayuda_de_respuesta_crear_reporte } from 'src/app/models/Ayuda_de_respuesta_crear_reporte';
import { Ayuda_de_respuesta_crear_reporteService } from 'src/app/api-services/Ayuda_de_respuesta_crear_reporte.service';
import { Resultado_aprobacion_crear_reporte } from 'src/app/models/Resultado_aprobacion_crear_reporte';
import { Resultado_aprobacion_crear_reporteService } from 'src/app/api-services/Resultado_aprobacion_crear_reporte.service';


@Component({
  selector: 'app-show-advance-filter-Crear_Reporte',
  templateUrl: './show-advance-filter-Crear_Reporte.component.html',
  styleUrls: ['./show-advance-filter-Crear_Reporte.component.scss']
})
export class ShowAdvanceFilterCrear_ReporteComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public N_Orden_de_Trabajos: Orden_de_Trabajo[] = [];
  public No__de_Orden_de_Servicios: Orden_de_servicio[] = [];
  public Tipo_de_reporte_OSs: Tipo_orden_de_servicio[] = [];
  public Prioridad_del_reportes: Prioridad_del_Reporte[] = [];
  public Tipo_de_orden_de_trabajos: Tipo_de_Orden_de_Trabajo[] = [];
  public Estatuss: Estatus_de_Reporte[] = [];
  public Matriculas: Aeronave[] = [];
  public Origen_del_reportes: Tipo_de_origen_del_reporte[] = [];
  public Codigo_computarizado_Descripcions: Codigo_Computarizado[] = [];
  public Tipo_de_reportes: Tipo_de_Reporte[] = [];
  public Codigo_ATAs: Catalogo_codigo_ATA[] = [];
  public Respondiente_resps: Spartan_User[] = [];
  public Ayuda_de_respuesta_resps: Ayuda_de_respuesta_crear_reporte[] = [];
  public Supervisors: Spartan_User[] = [];
  public Resultado_sups: Resultado_aprobacion_crear_reporte[] = [];
  public Inspectors: Spartan_User[] = [];
  public Resultado_inss: Resultado_aprobacion_crear_reporte[] = [];
  public Programador_de_mantenimientos: Spartan_User[] = [];
  public Resultado_pros: Resultado_aprobacion_crear_reporte[] = [];

  public orden_de_trabajos: Orden_de_Trabajo;
  public orden_de_servicios: Orden_de_servicio;
  public tipo_orden_de_servicios: Tipo_orden_de_servicio;
  public prioridad_del_reportes: Prioridad_del_Reporte;
  public tipo_de_orden_de_trabajos: Tipo_de_Orden_de_Trabajo;
  public estatus_de_reportes: Estatus_de_Reporte;
  public aeronaves: Aeronave;
  public tipo_de_origen_del_reportes: Tipo_de_origen_del_reporte;
  public codigo_computarizados: Codigo_Computarizado;
  public tipo_de_reportes: Tipo_de_Reporte;
  public catalogo_codigo_atas: Catalogo_codigo_ATA;
  public spartan_users: Spartan_User;
  public ayuda_de_respuesta_crear_reportes: Ayuda_de_respuesta_crear_reporte;
  public resultado_aprobacion_crear_reportes: Resultado_aprobacion_crear_reporte;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No_Reporte",
      "N_Orden_de_Trabajo",
      "No__de_Orden_de_Servicio",
      "Descripcion_breve",
      "Tipo_de_reporte_OS",
      "Descripcion_del_componente",
      "Numero_de_parte",
      "Numero_de_serie",
      "Fecha_requerida",
      "Promedio_de_ejecucion",
      "Prioridad_del_reporte",
      "Tipo_de_orden_de_trabajo",
      "Estatus",
      "Matricula",
      "Origen_del_reporte",
      "Codigo_computarizado_Descripcion",
      "Ciclos_restantes",
      "Horas_restantes",
      "N_boletin_directiva",
      "Titulo_boletin_directiva",
      "Tipo_de_reporte",
      "Reporte_de_aeronave",
      "N_de_bitacora",
      "Codigo_ATA",
      "IdDiscrepancia",
      "Id_Inspeccion_de_Entrada",
      "IdCotizacion",
      "Fecha_de_Creacion_del_Reporte",
      "Hora_de_Creacion_del_Reporte",
      "Fecha_de_Asignacion",
      "Hora_de_Asignacion",
      "Notas",
      "Tiempo_total_de_ejecucion",
      "Fecha_resp",
      "Hora_resp",
      "Respondiente_resp",
      "Ayuda_de_respuesta_resp",
      "Respuesta_resp",
      "Fecha_sup",
      "Hora_sup",
      "Supervisor",
      "Resultado_sup",
      "Tiempo_ejecucion_Hrs_sup",
      "Observaciones_sup",
      "Fecha_ins",
      "Hora_ins",
      "Inspector",
      "Resultado_ins",
      "Tiempo_ejecucion_Hrs_ins",
      "Observaciones_ins",
      "Fecha_pro",
      "Hora_pro",
      "Programador_de_mantenimiento",
      "Resultado_pro",
      "Tiempo_ejecucion_Hrs_pro",
      "Observaciones_pro",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No_Reporte_filtro",
      "N_Orden_de_Trabajo_filtro",
      "No__de_Orden_de_Servicio_filtro",
      "Descripcion_breve_filtro",
      "Tipo_de_reporte_OS_filtro",
      "Descripcion_del_componente_filtro",
      "Numero_de_parte_filtro",
      "Numero_de_serie_filtro",
      "Fecha_requerida_filtro",
      "Promedio_de_ejecucion_filtro",
      "Prioridad_del_reporte_filtro",
      "Tipo_de_orden_de_trabajo_filtro",
      "Estatus_filtro",
      "Matricula_filtro",
      "Origen_del_reporte_filtro",
      "Codigo_computarizado_Descripcion_filtro",
      "Ciclos_restantes_filtro",
      "Horas_restantes_filtro",
      "N_boletin_directiva_filtro",
      "Titulo_boletin_directiva_filtro",
      "Tipo_de_reporte_filtro",
      "Reporte_de_aeronave_filtro",
      "N_de_bitacora_filtro",
      "Codigo_ATA_filtro",
      "IdDiscrepancia_filtro",
      "Id_Inspeccion_de_Entrada_filtro",
      "IdCotizacion_filtro",
      "Fecha_de_Creacion_del_Reporte_filtro",
      "Hora_de_Creacion_del_Reporte_filtro",
      "Fecha_de_Asignacion_filtro",
      "Hora_de_Asignacion_filtro",
      "Notas_filtro",
      "Tiempo_total_de_ejecucion_filtro",
      "Fecha_resp_filtro",
      "Hora_resp_filtro",
      "Respondiente_resp_filtro",
      "Ayuda_de_respuesta_resp_filtro",
      "Respuesta_resp_filtro",
      "Fecha_sup_filtro",
      "Hora_sup_filtro",
      "Supervisor_filtro",
      "Resultado_sup_filtro",
      "Tiempo_ejecucion_Hrs_sup_filtro",
      "Observaciones_sup_filtro",
      "Fecha_ins_filtro",
      "Hora_ins_filtro",
      "Inspector_filtro",
      "Resultado_ins_filtro",
      "Tiempo_ejecucion_Hrs_ins_filtro",
      "Observaciones_ins_filtro",
      "Fecha_pro_filtro",
      "Hora_pro_filtro",
      "Programador_de_mantenimiento_filtro",
      "Resultado_pro_filtro",
      "Tiempo_ejecucion_Hrs_pro_filtro",
      "Observaciones_pro_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No_Reporte: "",
      N_Orden_de_Trabajo: "",
      No__de_Orden_de_Servicio: "",
      Descripcion_breve: "",
      Tipo_de_reporte_OS: "",
      Descripcion_del_componente: "",
      Numero_de_parte: "",
      Numero_de_serie: "",
      Fecha_requerida: "",
      Promedio_de_ejecucion: "",
      Prioridad_del_reporte: "",
      Tipo_de_orden_de_trabajo: "",
      Estatus: "",
      Matricula: "",
      Origen_del_reporte: "",
      Codigo_computarizado_Descripcion: "",
      Ciclos_restantes: "",
      Horas_restantes: "",
      N_boletin_directiva: "",
      Titulo_boletin_directiva: "",
      Tipo_de_reporte: "",
      Reporte_de_aeronave: "",
      N_de_bitacora: "",
      Codigo_ATA: "",
      IdDiscrepancia: "",
      Id_Inspeccion_de_Entrada: "",
      IdCotizacion: "",
      Fecha_de_Creacion_del_Reporte: null,
      Hora_de_Creacion_del_Reporte: "",
      Fecha_de_Asignacion: null,
      Hora_de_Asignacion: "",
      Notas: "",
      Tiempo_total_de_ejecucion: "",
      Fecha_resp: null,
      Hora_resp: "",
      Respondiente_resp: "",
      Ayuda_de_respuesta_resp: "",
      Respuesta_resp: "",
      Fecha_sup: null,
      Hora_sup: "",
      Supervisor: "",
      Resultado_sup: "",
      Tiempo_ejecucion_Hrs_sup: "",
      Observaciones_sup: "",
      Fecha_ins: null,
      Hora_ins: "",
      Inspector: "",
      Resultado_ins: "",
      Tiempo_ejecucion_Hrs_ins: "",
      Observaciones_ins: "",
      Fecha_pro: null,
      Hora_pro: "",
      Programador_de_mantenimiento: "",
      Resultado_pro: "",
      Tiempo_ejecucion_Hrs_pro: "",
      Observaciones_pro: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      N_Orden_de_TrabajoFilter: "",
      N_Orden_de_Trabajo: "",
      N_Orden_de_TrabajoMultiple: "",
      No__de_Orden_de_ServicioFilter: "",
      No__de_Orden_de_Servicio: "",
      No__de_Orden_de_ServicioMultiple: "",
      Tipo_de_reporte_OSFilter: "",
      Tipo_de_reporte_OS: "",
      Tipo_de_reporte_OSMultiple: "",
      fromPromedio_de_ejecucion: "",
      toPromedio_de_ejecucion: "",
      Prioridad_del_reporteFilter: "",
      Prioridad_del_reporte: "",
      Prioridad_del_reporteMultiple: "",
      Tipo_de_orden_de_trabajoFilter: "",
      Tipo_de_orden_de_trabajo: "",
      Tipo_de_orden_de_trabajoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      Origen_del_reporteFilter: "",
      Origen_del_reporte: "",
      Origen_del_reporteMultiple: "",
      Codigo_computarizado_DescripcionFilter: "",
      Codigo_computarizado_Descripcion: "",
      Codigo_computarizado_DescripcionMultiple: "",
      fromCiclos_restantes: "",
      toCiclos_restantes: "",
      fromHoras_restantes: "",
      toHoras_restantes: "",
      Tipo_de_reporteFilter: "",
      Tipo_de_reporte: "",
      Tipo_de_reporteMultiple: "",
      Codigo_ATAFilter: "",
      Codigo_ATA: "",
      Codigo_ATAMultiple: "",
      fromIdDiscrepancia: "",
      toIdDiscrepancia: "",
      fromId_Inspeccion_de_Entrada: "",
      toId_Inspeccion_de_Entrada: "",
      fromIdCotizacion: "",
      toIdCotizacion: "",
      fromFecha_de_Creacion_del_Reporte: "",
      toFecha_de_Creacion_del_Reporte: "",
      fromHora_de_Creacion_del_Reporte: "",
      toHora_de_Creacion_del_Reporte: "",
      fromFecha_de_Asignacion: "",
      toFecha_de_Asignacion: "",
      fromHora_de_Asignacion: "",
      toHora_de_Asignacion: "",
      fromTiempo_total_de_ejecucion: "",
      toTiempo_total_de_ejecucion: "",
      fromFecha_resp: "",
      toFecha_resp: "",
      fromHora_resp: "",
      toHora_resp: "",
      Respondiente_respFilter: "",
      Respondiente_resp: "",
      Respondiente_respMultiple: "",
      Ayuda_de_respuesta_respFilter: "",
      Ayuda_de_respuesta_resp: "",
      Ayuda_de_respuesta_respMultiple: "",
      fromFecha_sup: "",
      toFecha_sup: "",
      fromHora_sup: "",
      toHora_sup: "",
      SupervisorFilter: "",
      Supervisor: "",
      SupervisorMultiple: "",
      Resultado_supFilter: "",
      Resultado_sup: "",
      Resultado_supMultiple: "",
      fromTiempo_ejecucion_Hrs_sup: "",
      toTiempo_ejecucion_Hrs_sup: "",
      fromFecha_ins: "",
      toFecha_ins: "",
      fromHora_ins: "",
      toHora_ins: "",
      InspectorFilter: "",
      Inspector: "",
      InspectorMultiple: "",
      Resultado_insFilter: "",
      Resultado_ins: "",
      Resultado_insMultiple: "",
      fromTiempo_ejecucion_Hrs_ins: "",
      toTiempo_ejecucion_Hrs_ins: "",
      fromFecha_pro: "",
      toFecha_pro: "",
      fromHora_pro: "",
      toHora_pro: "",
      Programador_de_mantenimientoFilter: "",
      Programador_de_mantenimiento: "",
      Programador_de_mantenimientoMultiple: "",
      Resultado_proFilter: "",
      Resultado_pro: "",
      Resultado_proMultiple: "",
      fromTiempo_ejecucion_Hrs_pro: "",
      toTiempo_ejecucion_Hrs_pro: "",

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
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private orden_de_servicioService: Orden_de_servicioService,
    private tipo_orden_de_servicioService: Tipo_orden_de_servicioService,
    private prioridad_del_reporteService: Prioridad_del_ReporteService,
    private tipo_de_orden_de_trabajoService: Tipo_de_Orden_de_TrabajoService,
    private estatus_de_reporteService: Estatus_de_ReporteService,
    private aeronaveService: AeronaveService,
    private tipo_de_origen_del_reporteService: Tipo_de_origen_del_reporteService,
    private codigo_computarizadoService: Codigo_ComputarizadoService,
    private tipo_de_reporteService: Tipo_de_ReporteService,
    private catalogo_codigo_ataService: Catalogo_codigo_ATAService,
    private spartan_userService: Spartan_UserService,
    private ayuda_de_respuesta_crear_reporteService: Ayuda_de_respuesta_crear_reporteService,
    private resultado_aprobacion_crear_reporteService: Resultado_aprobacion_crear_reporteService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      N_Orden_de_TrabajoFilter: [''],
      N_Orden_de_Trabajo: [''],
      N_Orden_de_TrabajoMultiple: [''],
      No__de_Orden_de_ServicioFilter: [''],
      No__de_Orden_de_Servicio: [''],
      No__de_Orden_de_ServicioMultiple: [''],
      Tipo_de_reporte_OSFilter: [''],
      Tipo_de_reporte_OS: [''],
      Tipo_de_reporte_OSMultiple: [''],
      Prioridad_del_reporteFilter: [''],
      Prioridad_del_reporte: [''],
      Prioridad_del_reporteMultiple: [''],
      Tipo_de_orden_de_trabajoFilter: [''],
      Tipo_de_orden_de_trabajo: [''],
      Tipo_de_orden_de_trabajoMultiple: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      Origen_del_reporteFilter: [''],
      Origen_del_reporte: [''],
      Origen_del_reporteMultiple: [''],
      Codigo_computarizado_DescripcionFilter: [''],
      Codigo_computarizado_Descripcion: [''],
      Codigo_computarizado_DescripcionMultiple: [''],
      fromCiclos_restantes: [''],
      toCiclos_restantes: [''],
      fromHoras_restantes: [''],
      toHoras_restantes: [''],
      Tipo_de_reporteFilter: [''],
      Tipo_de_reporte: [''],
      Tipo_de_reporteMultiple: [''],
      Codigo_ATAFilter: [''],
      Codigo_ATA: [''],
      Codigo_ATAMultiple: [''],
      fromIdDiscrepancia: [''],
      toIdDiscrepancia: [''],
      fromId_Inspeccion_de_Entrada: [''],
      toId_Inspeccion_de_Entrada: [''],
      fromIdCotizacion: [''],
      toIdCotizacion: [''],
      fromFecha_de_Creacion_del_Reporte: [''],
      toFecha_de_Creacion_del_Reporte: [''],
      fromHora_de_Creacion_del_Reporte: [''],
      toHora_de_Creacion_del_Reporte: [''],
      fromFecha_de_Asignacion: [''],
      toFecha_de_Asignacion: [''],
      fromHora_de_Asignacion: [''],
      toHora_de_Asignacion: [''],
      fromFecha_resp: [''],
      toFecha_resp: [''],
      fromHora_resp: [''],
      toHora_resp: [''],
      Respondiente_respFilter: [''],
      Respondiente_resp: [''],
      Respondiente_respMultiple: [''],
      Ayuda_de_respuesta_respFilter: [''],
      Ayuda_de_respuesta_resp: [''],
      Ayuda_de_respuesta_respMultiple: [''],
      fromFecha_sup: [''],
      toFecha_sup: [''],
      fromHora_sup: [''],
      toHora_sup: [''],
      SupervisorFilter: [''],
      Supervisor: [''],
      SupervisorMultiple: [''],
      Resultado_supFilter: [''],
      Resultado_sup: [''],
      Resultado_supMultiple: [''],
      fromTiempo_ejecucion_Hrs_sup: [''],
      toTiempo_ejecucion_Hrs_sup: [''],
      fromFecha_ins: [''],
      toFecha_ins: [''],
      fromHora_ins: [''],
      toHora_ins: [''],
      InspectorFilter: [''],
      Inspector: [''],
      InspectorMultiple: [''],
      Resultado_insFilter: [''],
      Resultado_ins: [''],
      Resultado_insMultiple: [''],
      fromTiempo_ejecucion_Hrs_ins: [''],
      toTiempo_ejecucion_Hrs_ins: [''],
      fromFecha_pro: [''],
      toFecha_pro: [''],
      fromHora_pro: [''],
      toHora_pro: [''],
      Programador_de_mantenimientoFilter: [''],
      Programador_de_mantenimiento: [''],
      Programador_de_mantenimientoMultiple: [''],
      Resultado_proFilter: [''],
      Resultado_pro: [''],
      Resultado_proMultiple: [''],
      fromTiempo_ejecucion_Hrs_pro: [''],
      toTiempo_ejecucion_Hrs_pro: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Crear_Reporte/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.orden_de_servicioService.getAll());
    observablesArray.push(this.tipo_orden_de_servicioService.getAll());
    observablesArray.push(this.prioridad_del_reporteService.getAll());
    observablesArray.push(this.tipo_de_orden_de_trabajoService.getAll());
    observablesArray.push(this.estatus_de_reporteService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.tipo_de_origen_del_reporteService.getAll());
    observablesArray.push(this.codigo_computarizadoService.getAll());
    observablesArray.push(this.tipo_de_reporteService.getAll());
    observablesArray.push(this.catalogo_codigo_ataService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.ayuda_de_respuesta_crear_reporteService.getAll());
    observablesArray.push(this.resultado_aprobacion_crear_reporteService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio, orden_de_trabajos, orden_de_servicios, tipo_orden_de_servicios, prioridad_del_reportes, tipo_de_orden_de_trabajos, estatus_de_reportes, aeronaves, tipo_de_origen_del_reportes, codigo_computarizados, tipo_de_reportes, catalogo_codigo_atas, spartan_users, ayuda_de_respuesta_crear_reportes, resultado_aprobacion_crear_reportes]) => {
          this.orden_de_trabajos = orden_de_trabajos;
          this.orden_de_servicios = orden_de_servicios;
          this.tipo_orden_de_servicios = tipo_orden_de_servicios;
          this.prioridad_del_reportes = prioridad_del_reportes;
          this.tipo_de_orden_de_trabajos = tipo_de_orden_de_trabajos;
          this.estatus_de_reportes = estatus_de_reportes;
          this.aeronaves = aeronaves;
          this.tipo_de_origen_del_reportes = tipo_de_origen_del_reportes;
          this.codigo_computarizados = codigo_computarizados;
          this.tipo_de_reportes = tipo_de_reportes;
          this.catalogo_codigo_atas = catalogo_codigo_atas;
          this.spartan_users = spartan_users;
          this.ayuda_de_respuesta_crear_reportes = ayuda_de_respuesta_crear_reportes;
          this.resultado_aprobacion_crear_reportes = resultado_aprobacion_crear_reportes;


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
    this.dataListConfig.filterAdvanced.No_ReporteFilter = entity.No_ReporteFilter;
    this.dataListConfig.filterAdvanced.No_Reporte = entity.No_Reporte;
    this.dataListConfig.filterAdvanced.N_Orden_de_TrabajoFilter = entity.N_Orden_de_TrabajoFilter;
    this.dataListConfig.filterAdvanced.N_Orden_de_Trabajo = entity.N_Orden_de_Trabajo;
    this.dataListConfig.filterAdvanced.N_Orden_de_TrabajoMultiple = entity.N_Orden_de_TrabajoMultiple;
    this.dataListConfig.filterAdvanced.No__de_Orden_de_ServicioFilter = entity.No__de_Orden_de_ServicioFilter;
    this.dataListConfig.filterAdvanced.No__de_Orden_de_Servicio = entity.No__de_Orden_de_Servicio;
    this.dataListConfig.filterAdvanced.No__de_Orden_de_ServicioMultiple = entity.No__de_Orden_de_ServicioMultiple;
    this.dataListConfig.filterAdvanced.Descripcion_breveFilter = entity.Descripcion_breveFilter;
    this.dataListConfig.filterAdvanced.Descripcion_breve = entity.Descripcion_breve;
    this.dataListConfig.filterAdvanced.Tipo_de_reporte_OSFilter = entity.Tipo_de_reporte_OSFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_reporte_OS = entity.Tipo_de_reporte_OS;
    this.dataListConfig.filterAdvanced.Tipo_de_reporte_OSMultiple = entity.Tipo_de_reporte_OSMultiple;
    this.dataListConfig.filterAdvanced.Descripcion_del_componenteFilter = entity.Descripcion_del_componenteFilter;
    this.dataListConfig.filterAdvanced.Descripcion_del_componente = entity.Descripcion_del_componente;
    this.dataListConfig.filterAdvanced.Numero_de_parteFilter = entity.Numero_de_parteFilter;
    this.dataListConfig.filterAdvanced.Numero_de_parte = entity.Numero_de_parte;
    this.dataListConfig.filterAdvanced.Numero_de_serieFilter = entity.Numero_de_serieFilter;
    this.dataListConfig.filterAdvanced.Numero_de_serie = entity.Numero_de_serie;
    this.dataListConfig.filterAdvanced.Fecha_requeridaFilter = entity.Fecha_requeridaFilter;
    this.dataListConfig.filterAdvanced.Fecha_requerida = entity.Fecha_requerida;
    this.dataListConfig.filterAdvanced.fromPromedio_de_ejecucion = entity.fromPromedio_de_ejecucion;
    this.dataListConfig.filterAdvanced.toPromedio_de_ejecucion = entity.toPromedio_de_ejecucion;
    this.dataListConfig.filterAdvanced.Prioridad_del_reporteFilter = entity.Prioridad_del_reporteFilter;
    this.dataListConfig.filterAdvanced.Prioridad_del_reporte = entity.Prioridad_del_reporte;
    this.dataListConfig.filterAdvanced.Prioridad_del_reporteMultiple = entity.Prioridad_del_reporteMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_orden_de_trabajoFilter = entity.Tipo_de_orden_de_trabajoFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_orden_de_trabajo = entity.Tipo_de_orden_de_trabajo;
    this.dataListConfig.filterAdvanced.Tipo_de_orden_de_trabajoMultiple = entity.Tipo_de_orden_de_trabajoMultiple;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.Origen_del_reporteFilter = entity.Origen_del_reporteFilter;
    this.dataListConfig.filterAdvanced.Origen_del_reporte = entity.Origen_del_reporte;
    this.dataListConfig.filterAdvanced.Origen_del_reporteMultiple = entity.Origen_del_reporteMultiple;
    this.dataListConfig.filterAdvanced.Codigo_computarizado_DescripcionFilter = entity.Codigo_computarizado_DescripcionFilter;
    this.dataListConfig.filterAdvanced.Codigo_computarizado_Descripcion = entity.Codigo_computarizado_Descripcion;
    this.dataListConfig.filterAdvanced.Codigo_computarizado_DescripcionMultiple = entity.Codigo_computarizado_DescripcionMultiple;
    this.dataListConfig.filterAdvanced.fromCiclos_restantes = entity.fromCiclos_restantes;
    this.dataListConfig.filterAdvanced.toCiclos_restantes = entity.toCiclos_restantes;
    this.dataListConfig.filterAdvanced.fromHoras_restantes = entity.fromHoras_restantes;
    this.dataListConfig.filterAdvanced.toHoras_restantes = entity.toHoras_restantes;
    this.dataListConfig.filterAdvanced.N_boletin_directivaFilter = entity.N_boletin_directivaFilter;
    this.dataListConfig.filterAdvanced.N_boletin_directiva = entity.N_boletin_directiva;
    this.dataListConfig.filterAdvanced.Titulo_boletin_directivaFilter = entity.Titulo_boletin_directivaFilter;
    this.dataListConfig.filterAdvanced.Titulo_boletin_directiva = entity.Titulo_boletin_directiva;
    this.dataListConfig.filterAdvanced.Tipo_de_reporteFilter = entity.Tipo_de_reporteFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_reporte = entity.Tipo_de_reporte;
    this.dataListConfig.filterAdvanced.Tipo_de_reporteMultiple = entity.Tipo_de_reporteMultiple;
    this.dataListConfig.filterAdvanced.Reporte_de_aeronaveFilter = entity.Reporte_de_aeronaveFilter;
    this.dataListConfig.filterAdvanced.Reporte_de_aeronave = entity.Reporte_de_aeronave;
    this.dataListConfig.filterAdvanced.N_de_bitacoraFilter = entity.N_de_bitacoraFilter;
    this.dataListConfig.filterAdvanced.N_de_bitacora = entity.N_de_bitacora;
    this.dataListConfig.filterAdvanced.Codigo_ATAFilter = entity.Codigo_ATAFilter;
    this.dataListConfig.filterAdvanced.Codigo_ATA = entity.Codigo_ATA;
    this.dataListConfig.filterAdvanced.Codigo_ATAMultiple = entity.Codigo_ATAMultiple;
    this.dataListConfig.filterAdvanced.fromIdDiscrepancia = entity.fromIdDiscrepancia;
    this.dataListConfig.filterAdvanced.toIdDiscrepancia = entity.toIdDiscrepancia;
    this.dataListConfig.filterAdvanced.fromId_Inspeccion_de_Entrada = entity.fromId_Inspeccion_de_Entrada;
    this.dataListConfig.filterAdvanced.toId_Inspeccion_de_Entrada = entity.toId_Inspeccion_de_Entrada;
    this.dataListConfig.filterAdvanced.fromIdCotizacion = entity.fromIdCotizacion;
    this.dataListConfig.filterAdvanced.toIdCotizacion = entity.toIdCotizacion;
    this.dataListConfig.filterAdvanced.fromFecha_de_Creacion_del_Reporte = entity.fromFecha_de_Creacion_del_Reporte;
    this.dataListConfig.filterAdvanced.toFecha_de_Creacion_del_Reporte = entity.toFecha_de_Creacion_del_Reporte;
    this.dataListConfig.filterAdvanced.Hora_de_Creacion_del_ReporteFilter = entity.Hora_de_Creacion_del_ReporteFilter;
    this.dataListConfig.filterAdvanced.Hora_de_Creacion_del_Reporte = entity.Hora_de_Creacion_del_Reporte;
    this.dataListConfig.filterAdvanced.fromFecha_de_Asignacion = entity.fromFecha_de_Asignacion;
    this.dataListConfig.filterAdvanced.toFecha_de_Asignacion = entity.toFecha_de_Asignacion;
    this.dataListConfig.filterAdvanced.Hora_de_AsignacionFilter = entity.Hora_de_AsignacionFilter;
    this.dataListConfig.filterAdvanced.Hora_de_Asignacion = entity.Hora_de_Asignacion;
    this.dataListConfig.filterAdvanced.NotasFilter = entity.NotasFilter;
    this.dataListConfig.filterAdvanced.Notas = entity.Notas;
    this.dataListConfig.filterAdvanced.fromTiempo_total_de_ejecucion = entity.fromTiempo_total_de_ejecucion;
    this.dataListConfig.filterAdvanced.toTiempo_total_de_ejecucion = entity.toTiempo_total_de_ejecucion;
    this.dataListConfig.filterAdvanced.fromFecha_resp = entity.fromFecha_resp;
    this.dataListConfig.filterAdvanced.toFecha_resp = entity.toFecha_resp;
    this.dataListConfig.filterAdvanced.Hora_respFilter = entity.Hora_respFilter;
    this.dataListConfig.filterAdvanced.Hora_resp = entity.Hora_resp;
    this.dataListConfig.filterAdvanced.Respondiente_respFilter = entity.Respondiente_respFilter;
    this.dataListConfig.filterAdvanced.Respondiente_resp = entity.Respondiente_resp;
    this.dataListConfig.filterAdvanced.Respondiente_respMultiple = entity.Respondiente_respMultiple;
    this.dataListConfig.filterAdvanced.Ayuda_de_respuesta_respFilter = entity.Ayuda_de_respuesta_respFilter;
    this.dataListConfig.filterAdvanced.Ayuda_de_respuesta_resp = entity.Ayuda_de_respuesta_resp;
    this.dataListConfig.filterAdvanced.Ayuda_de_respuesta_respMultiple = entity.Ayuda_de_respuesta_respMultiple;
    this.dataListConfig.filterAdvanced.Respuesta_respFilter = entity.Respuesta_respFilter;
    this.dataListConfig.filterAdvanced.Respuesta_resp = entity.Respuesta_resp;
    this.dataListConfig.filterAdvanced.fromFecha_sup = entity.fromFecha_sup;
    this.dataListConfig.filterAdvanced.toFecha_sup = entity.toFecha_sup;
    this.dataListConfig.filterAdvanced.Hora_supFilter = entity.Hora_supFilter;
    this.dataListConfig.filterAdvanced.Hora_sup = entity.Hora_sup;
    this.dataListConfig.filterAdvanced.SupervisorFilter = entity.SupervisorFilter;
    this.dataListConfig.filterAdvanced.Supervisor = entity.Supervisor;
    this.dataListConfig.filterAdvanced.SupervisorMultiple = entity.SupervisorMultiple;
    this.dataListConfig.filterAdvanced.Resultado_supFilter = entity.Resultado_supFilter;
    this.dataListConfig.filterAdvanced.Resultado_sup = entity.Resultado_sup;
    this.dataListConfig.filterAdvanced.Resultado_supMultiple = entity.Resultado_supMultiple;
    this.dataListConfig.filterAdvanced.fromTiempo_ejecucion_Hrs_sup = entity.fromTiempo_ejecucion_Hrs_sup;
    this.dataListConfig.filterAdvanced.toTiempo_ejecucion_Hrs_sup = entity.toTiempo_ejecucion_Hrs_sup;
    this.dataListConfig.filterAdvanced.Observaciones_supFilter = entity.Observaciones_supFilter;
    this.dataListConfig.filterAdvanced.Observaciones_sup = entity.Observaciones_sup;
    this.dataListConfig.filterAdvanced.fromFecha_ins = entity.fromFecha_ins;
    this.dataListConfig.filterAdvanced.toFecha_ins = entity.toFecha_ins;
    this.dataListConfig.filterAdvanced.Hora_insFilter = entity.Hora_insFilter;
    this.dataListConfig.filterAdvanced.Hora_ins = entity.Hora_ins;
    this.dataListConfig.filterAdvanced.InspectorFilter = entity.InspectorFilter;
    this.dataListConfig.filterAdvanced.Inspector = entity.Inspector;
    this.dataListConfig.filterAdvanced.InspectorMultiple = entity.InspectorMultiple;
    this.dataListConfig.filterAdvanced.Resultado_insFilter = entity.Resultado_insFilter;
    this.dataListConfig.filterAdvanced.Resultado_ins = entity.Resultado_ins;
    this.dataListConfig.filterAdvanced.Resultado_insMultiple = entity.Resultado_insMultiple;
    this.dataListConfig.filterAdvanced.fromTiempo_ejecucion_Hrs_ins = entity.fromTiempo_ejecucion_Hrs_ins;
    this.dataListConfig.filterAdvanced.toTiempo_ejecucion_Hrs_ins = entity.toTiempo_ejecucion_Hrs_ins;
    this.dataListConfig.filterAdvanced.Observaciones_insFilter = entity.Observaciones_insFilter;
    this.dataListConfig.filterAdvanced.Observaciones_ins = entity.Observaciones_ins;
    this.dataListConfig.filterAdvanced.fromFecha_pro = entity.fromFecha_pro;
    this.dataListConfig.filterAdvanced.toFecha_pro = entity.toFecha_pro;
    this.dataListConfig.filterAdvanced.Hora_proFilter = entity.Hora_proFilter;
    this.dataListConfig.filterAdvanced.Hora_pro = entity.Hora_pro;
    this.dataListConfig.filterAdvanced.Programador_de_mantenimientoFilter = entity.Programador_de_mantenimientoFilter;
    this.dataListConfig.filterAdvanced.Programador_de_mantenimiento = entity.Programador_de_mantenimiento;
    this.dataListConfig.filterAdvanced.Programador_de_mantenimientoMultiple = entity.Programador_de_mantenimientoMultiple;
    this.dataListConfig.filterAdvanced.Resultado_proFilter = entity.Resultado_proFilter;
    this.dataListConfig.filterAdvanced.Resultado_pro = entity.Resultado_pro;
    this.dataListConfig.filterAdvanced.Resultado_proMultiple = entity.Resultado_proMultiple;
    this.dataListConfig.filterAdvanced.fromTiempo_ejecucion_Hrs_pro = entity.fromTiempo_ejecucion_Hrs_pro;
    this.dataListConfig.filterAdvanced.toTiempo_ejecucion_Hrs_pro = entity.toTiempo_ejecucion_Hrs_pro;
    this.dataListConfig.filterAdvanced.Observaciones_proFilter = entity.Observaciones_proFilter;
    this.dataListConfig.filterAdvanced.Observaciones_pro = entity.Observaciones_pro;


    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Crear_Reporte/list'], { state: { data: this.dataListConfig } });
  }
}
