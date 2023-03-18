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

import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Tipo_de_Reporte } from 'src/app/models/Tipo_de_Reporte';
import { Tipo_de_ReporteService } from 'src/app/api-services/Tipo_de_Reporte.service';
import { Tipo_de_Ingreso_a_Cotizacion } from 'src/app/models/Tipo_de_Ingreso_a_Cotizacion';
import { Tipo_de_Ingreso_a_CotizacionService } from 'src/app/api-services/Tipo_de_Ingreso_a_Cotizacion.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Estatus_de_Cotizacion } from 'src/app/models/Estatus_de_Cotizacion';
import { Estatus_de_CotizacionService } from 'src/app/api-services/Estatus_de_Cotizacion.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Motivo_de_Edicion_de_Cotizacion } from 'src/app/models/Motivo_de_Edicion_de_Cotizacion';
import { Motivo_de_Edicion_de_CotizacionService } from 'src/app/api-services/Motivo_de_Edicion_de_Cotizacion.service';
import { Respuesta_del_Cliente_a_Cotizacion } from 'src/app/models/Respuesta_del_Cliente_a_Cotizacion';
import { Respuesta_del_Cliente_a_CotizacionService } from 'src/app/api-services/Respuesta_del_Cliente_a_Cotizacion.service';


@Component({
  selector: 'app-show-advance-filter-Cotizacion',
  templateUrl: './show-advance-filter-Cotizacion.component.html',
  styleUrls: ['./show-advance-filter-Cotizacion.component.scss']
})
export class ShowAdvanceFilterCotizacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Usuario_que_Registras: Spartan_User[] = [];
  public Orden_de_Trabajo_Origens: Orden_de_Trabajo[] = [];
  public Orden_de_Trabajo_Generadas: Orden_de_Trabajo[] = [];
  public Tipo_de_Reportes: Tipo_de_Reporte[] = [];
  public Tipo_de_ingresos: Tipo_de_Ingreso_a_Cotizacion[] = [];
  public Clientes: Cliente[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public Estatuss: Estatus_de_Cotizacion[] = [];
  public Reportes: Crear_Reporte[] = [];
  public Motivo_de_Edicions: Motivo_de_Edicion_de_Cotizacion[] = [];
  public Usuario_que_Registra_Respuestas: Spartan_User[] = [];
  public Respuestas: Respuesta_del_Cliente_a_Cotizacion[] = [];

  public spartan_users: Spartan_User;
  public orden_de_trabajos: Orden_de_Trabajo;
  public tipo_de_reportes: Tipo_de_Reporte;
  public tipo_de_ingreso_a_cotizacions: Tipo_de_Ingreso_a_Cotizacion;
  public clientes: Cliente;
  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public estatus_de_cotizacions: Estatus_de_Cotizacion;
  public crear_reportes: Crear_Reporte;
  public motivo_de_edicion_de_cotizacions: Motivo_de_Edicion_de_Cotizacion;
  public respuesta_del_cliente_a_cotizacions: Respuesta_del_Cliente_a_Cotizacion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Numero_de_Cotizacion",
      "Orden_de_Trabajo_Origen",
      "Orden_de_Trabajo_Generada",
      "Tipo_de_Reporte",
      "Tipo_de_ingreso",
      "Cliente",
      "Matricula",
      "Modelo",
      "Contacto",
      "Tiempo_de_Ejecucion",
      "Enviar_Cotizacion_a_Cliente",
      "Redaccion_Correo_para_Cliente",
      "Clausulas_Especificas",
      "Clausulas_Generales",
      "Estatus",
      "Mano_de_Obra",
      "Partes",
      "Consumibles",
      "Total",
      "Porcentaje_de_Consumibles",
      "Porcentaje_de_Anticipo",
      "Comentarios_Mantenimiento",
      "Reporte",
      "Item_de_Inspeccion",
      "Motivo_de_Edicion",
      "Observaciones",
      "Fecha_de_Respuesta",
      "Hora_de_Respuesta",
      "Usuario_que_Registra_Respuesta",
      "Respuesta",
      "Observaciones_Respeusta",
      "Dia_de_Llegada_del_Avion",
      "Hora_de_Llegada_del_Avion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Numero_de_Cotizacion_filtro",
      "Orden_de_Trabajo_Origen_filtro",
      "Orden_de_Trabajo_Generada_filtro",
      "Tipo_de_Reporte_filtro",
      "Tipo_de_ingreso_filtro",
      "Cliente_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Contacto_filtro",
      "Tiempo_de_Ejecucion_filtro",
      "Enviar_Cotizacion_a_Cliente_filtro",
      "Redaccion_Correo_para_Cliente_filtro",
      "Clausulas_Especificas_filtro",
      "Clausulas_Generales_filtro",
      "Estatus_filtro",
      "Mano_de_Obra_filtro",
      "Partes_filtro",
      "Consumibles_filtro",
      "Total_filtro",
      "Porcentaje_de_Consumibles_filtro",
      "Porcentaje_de_Anticipo_filtro",
      "Comentarios_Mantenimiento_filtro",
      "Reporte_filtro",
      "Item_de_Inspeccion_filtro",
      "Motivo_de_Edicion_filtro",
      "Observaciones_filtro",
      "Fecha_de_Respuesta_filtro",
      "Hora_de_Respuesta_filtro",
      "Usuario_que_Registra_Respuesta_filtro",
      "Respuesta_filtro",
      "Observaciones_Respeusta_filtro",
      "Dia_de_Llegada_del_Avion_filtro",
      "Hora_de_Llegada_del_Avion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Numero_de_Cotizacion: "",
      Orden_de_Trabajo_Origen: "",
      Orden_de_Trabajo_Generada: "",
      Tipo_de_Reporte: "",
      Tipo_de_ingreso: "",
      Cliente: "",
      Matricula: "",
      Modelo: "",
      Contacto: "",
      Tiempo_de_Ejecucion: "",
      Enviar_Cotizacion_a_Cliente: "",
      Redaccion_Correo_para_Cliente: "",
      Clausulas_Especificas: "",
      Clausulas_Generales: "",
      Estatus: "",
      Mano_de_Obra: "",
      Partes: "",
      Consumibles: "",
      Total: "",
      Porcentaje_de_Consumibles: "",
      Porcentaje_de_Anticipo: "",
      Comentarios_Mantenimiento: "",
      Reporte: "",
      Item_de_Inspeccion: "",
      Motivo_de_Edicion: "",
      Observaciones: "",
      Fecha_de_Respuesta: null,
      Hora_de_Respuesta: "",
      Usuario_que_Registra_Respuesta: "",
      Respuesta: "",
      Observaciones_Respeusta: "",
      Dia_de_Llegada_del_Avion: null,
      Hora_de_Llegada_del_Avion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      Orden_de_Trabajo_OrigenFilter: "",
      Orden_de_Trabajo_Origen: "",
      Orden_de_Trabajo_OrigenMultiple: "",
      Orden_de_Trabajo_GeneradaFilter: "",
      Orden_de_Trabajo_Generada: "",
      Orden_de_Trabajo_GeneradaMultiple: "",
      Tipo_de_ReporteFilter: "",
      Tipo_de_Reporte: "",
      Tipo_de_ReporteMultiple: "",
      Tipo_de_ingresoFilter: "",
      Tipo_de_ingreso: "",
      Tipo_de_ingresoMultiple: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromTiempo_de_Ejecucion: "",
      toTiempo_de_Ejecucion: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromMano_de_Obra: "",
      toMano_de_Obra: "",
      fromPartes: "",
      toPartes: "",
      fromConsumibles: "",
      toConsumibles: "",
      fromTotal: "",
      toTotal: "",
      fromPorcentaje_de_Consumibles: "",
      toPorcentaje_de_Consumibles: "",
      fromPorcentaje_de_Anticipo: "",
      toPorcentaje_de_Anticipo: "",
      ReporteFilter: "",
      Reporte: "",
      ReporteMultiple: "",
      fromItem_de_Inspeccion: "",
      toItem_de_Inspeccion: "",
      Motivo_de_EdicionFilter: "",
      Motivo_de_Edicion: "",
      Motivo_de_EdicionMultiple: "",
      fromFecha_de_Respuesta: "",
      toFecha_de_Respuesta: "",
      fromHora_de_Respuesta: "",
      toHora_de_Respuesta: "",
      Usuario_que_Registra_RespuestaFilter: "",
      Usuario_que_Registra_Respuesta: "",
      Usuario_que_Registra_RespuestaMultiple: "",
      RespuestaFilter: "",
      Respuesta: "",
      RespuestaMultiple: "",
      fromDia_de_Llegada_del_Avion: "",
      toDia_de_Llegada_del_Avion: "",
      fromHora_de_Llegada_del_Avion: "",
      toHora_de_Llegada_del_Avion: "",

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
    private spartan_userService: Spartan_UserService,
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private tipo_de_reporteService: Tipo_de_ReporteService,
    private tipo_de_ingreso_a_cotizacionService: Tipo_de_Ingreso_a_CotizacionService,
    private clienteService: ClienteService,
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,
    private estatus_de_cotizacionService: Estatus_de_CotizacionService,
    private crear_reporteService: Crear_ReporteService,
    private motivo_de_edicion_de_cotizacionService: Motivo_de_Edicion_de_CotizacionService,
    private respuesta_del_cliente_a_cotizacionService: Respuesta_del_Cliente_a_CotizacionService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFecha_de_Registro: [''],
      toFecha_de_Registro: [''],
      fromHora_de_Registro: [''],
      toHora_de_Registro: [''],
      Usuario_que_RegistraFilter: [''],
      Usuario_que_Registra: [''],
      Usuario_que_RegistraMultiple: [''],
      Orden_de_Trabajo_OrigenFilter: [''],
      Orden_de_Trabajo_Origen: [''],
      Orden_de_Trabajo_OrigenMultiple: [''],
      Orden_de_Trabajo_GeneradaFilter: [''],
      Orden_de_Trabajo_Generada: [''],
      Orden_de_Trabajo_GeneradaMultiple: [''],
      Tipo_de_ReporteFilter: [''],
      Tipo_de_Reporte: [''],
      Tipo_de_ReporteMultiple: [''],
      Tipo_de_ingresoFilter: [''],
      Tipo_de_ingreso: [''],
      Tipo_de_ingresoMultiple: [''],
      ClienteFilter: [''],
      Cliente: [''],
      ClienteMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      fromTiempo_de_Ejecucion: [''],
      toTiempo_de_Ejecucion: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromMano_de_Obra: [''],
      toMano_de_Obra: [''],
      fromPartes: [''],
      toPartes: [''],
      fromConsumibles: [''],
      toConsumibles: [''],
      fromTotal: [''],
      toTotal: [''],
      fromPorcentaje_de_Consumibles: [''],
      toPorcentaje_de_Consumibles: [''],
      fromPorcentaje_de_Anticipo: [''],
      toPorcentaje_de_Anticipo: [''],
      ReporteFilter: [''],
      Reporte: [''],
      ReporteMultiple: [''],
      fromItem_de_Inspeccion: [''],
      toItem_de_Inspeccion: [''],
      Motivo_de_EdicionFilter: [''],
      Motivo_de_Edicion: [''],
      Motivo_de_EdicionMultiple: [''],
      fromFecha_de_Respuesta: [''],
      toFecha_de_Respuesta: [''],
      fromHora_de_Respuesta: [''],
      toHora_de_Respuesta: [''],
      Usuario_que_Registra_RespuestaFilter: [''],
      Usuario_que_Registra_Respuesta: [''],
      Usuario_que_Registra_RespuestaMultiple: [''],
      RespuestaFilter: [''],
      Respuesta: [''],
      RespuestaMultiple: [''],
      fromDia_de_Llegada_del_Avion: [''],
      toDia_de_Llegada_del_Avion: [''],
      fromHora_de_Llegada_del_Avion: [''],
      toHora_de_Llegada_del_Avion: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Cotizacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.tipo_de_reporteService.getAll());
    observablesArray.push(this.tipo_de_ingreso_a_cotizacionService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.estatus_de_cotizacionService.getAll());
    observablesArray.push(this.crear_reporteService.getAll());
    observablesArray.push(this.motivo_de_edicion_de_cotizacionService.getAll());
    observablesArray.push(this.respuesta_del_cliente_a_cotizacionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,orden_de_trabajos ,tipo_de_reportes ,tipo_de_ingreso_a_cotizacions ,clientes ,aeronaves ,modeloss ,estatus_de_cotizacions ,crear_reportes ,motivo_de_edicion_de_cotizacions ,respuesta_del_cliente_a_cotizacions ]) => {
		  this.spartan_users = spartan_users;
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.tipo_de_reportes = tipo_de_reportes;
		  this.tipo_de_ingreso_a_cotizacions = tipo_de_ingreso_a_cotizacions;
		  this.clientes = clientes;
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.estatus_de_cotizacions = estatus_de_cotizacions;
		  this.crear_reportes = crear_reportes;
		  this.motivo_de_edicion_de_cotizacions = motivo_de_edicion_de_cotizacions;
		  this.respuesta_del_cliente_a_cotizacions = respuesta_del_cliente_a_cotizacions;
          

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
    this.dataListConfig.filterAdvanced.fromFecha_de_Registro = entity.fromFecha_de_Registro;
    this.dataListConfig.filterAdvanced.toFecha_de_Registro = entity.toFecha_de_Registro;
	this.dataListConfig.filterAdvanced.Hora_de_RegistroFilter = entity.Hora_de_RegistroFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Registro = entity.Hora_de_Registro;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraFilter = entity.Usuario_que_RegistraFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_Registra = entity.Usuario_que_Registra;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraMultiple = entity.Usuario_que_RegistraMultiple;
	this.dataListConfig.filterAdvanced.Numero_de_CotizacionFilter = entity.Numero_de_CotizacionFilter;
	this.dataListConfig.filterAdvanced.Numero_de_Cotizacion = entity.Numero_de_Cotizacion;
    this.dataListConfig.filterAdvanced.Orden_de_Trabajo_OrigenFilter = entity.Orden_de_Trabajo_OrigenFilter;
    this.dataListConfig.filterAdvanced.Orden_de_Trabajo_Origen = entity.Orden_de_Trabajo_Origen;
    this.dataListConfig.filterAdvanced.Orden_de_Trabajo_OrigenMultiple = entity.Orden_de_Trabajo_OrigenMultiple;
    this.dataListConfig.filterAdvanced.Orden_de_Trabajo_GeneradaFilter = entity.Orden_de_Trabajo_GeneradaFilter;
    this.dataListConfig.filterAdvanced.Orden_de_Trabajo_Generada = entity.Orden_de_Trabajo_Generada;
    this.dataListConfig.filterAdvanced.Orden_de_Trabajo_GeneradaMultiple = entity.Orden_de_Trabajo_GeneradaMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_ReporteFilter = entity.Tipo_de_ReporteFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Reporte = entity.Tipo_de_Reporte;
    this.dataListConfig.filterAdvanced.Tipo_de_ReporteMultiple = entity.Tipo_de_ReporteMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_ingresoFilter = entity.Tipo_de_ingresoFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_ingreso = entity.Tipo_de_ingreso;
    this.dataListConfig.filterAdvanced.Tipo_de_ingresoMultiple = entity.Tipo_de_ingresoMultiple;
    this.dataListConfig.filterAdvanced.ClienteFilter = entity.ClienteFilter;
    this.dataListConfig.filterAdvanced.Cliente = entity.Cliente;
    this.dataListConfig.filterAdvanced.ClienteMultiple = entity.ClienteMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
	this.dataListConfig.filterAdvanced.ContactoFilter = entity.ContactoFilter;
	this.dataListConfig.filterAdvanced.Contacto = entity.Contacto;
    this.dataListConfig.filterAdvanced.fromTiempo_de_Ejecucion = entity.fromTiempo_de_Ejecucion;
    this.dataListConfig.filterAdvanced.toTiempo_de_Ejecucion = entity.toTiempo_de_Ejecucion;
	this.dataListConfig.filterAdvanced.Redaccion_Correo_para_ClienteFilter = entity.Redaccion_Correo_para_ClienteFilter;
	this.dataListConfig.filterAdvanced.Redaccion_Correo_para_Cliente = entity.Redaccion_Correo_para_Cliente;
	this.dataListConfig.filterAdvanced.Clausulas_EspecificasFilter = entity.Clausulas_EspecificasFilter;
	this.dataListConfig.filterAdvanced.Clausulas_Especificas = entity.Clausulas_Especificas;
	this.dataListConfig.filterAdvanced.Clausulas_GeneralesFilter = entity.Clausulas_GeneralesFilter;
	this.dataListConfig.filterAdvanced.Clausulas_Generales = entity.Clausulas_Generales;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.fromMano_de_Obra = entity.fromMano_de_Obra;
    this.dataListConfig.filterAdvanced.toMano_de_Obra = entity.toMano_de_Obra;
    this.dataListConfig.filterAdvanced.fromPartes = entity.fromPartes;
    this.dataListConfig.filterAdvanced.toPartes = entity.toPartes;
    this.dataListConfig.filterAdvanced.fromConsumibles = entity.fromConsumibles;
    this.dataListConfig.filterAdvanced.toConsumibles = entity.toConsumibles;
    this.dataListConfig.filterAdvanced.fromTotal = entity.fromTotal;
    this.dataListConfig.filterAdvanced.toTotal = entity.toTotal;
    this.dataListConfig.filterAdvanced.fromPorcentaje_de_Consumibles = entity.fromPorcentaje_de_Consumibles;
    this.dataListConfig.filterAdvanced.toPorcentaje_de_Consumibles = entity.toPorcentaje_de_Consumibles;
    this.dataListConfig.filterAdvanced.fromPorcentaje_de_Anticipo = entity.fromPorcentaje_de_Anticipo;
    this.dataListConfig.filterAdvanced.toPorcentaje_de_Anticipo = entity.toPorcentaje_de_Anticipo;
	this.dataListConfig.filterAdvanced.Comentarios_MantenimientoFilter = entity.Comentarios_MantenimientoFilter;
	this.dataListConfig.filterAdvanced.Comentarios_Mantenimiento = entity.Comentarios_Mantenimiento;
    this.dataListConfig.filterAdvanced.ReporteFilter = entity.ReporteFilter;
    this.dataListConfig.filterAdvanced.Reporte = entity.Reporte;
    this.dataListConfig.filterAdvanced.ReporteMultiple = entity.ReporteMultiple;
    this.dataListConfig.filterAdvanced.fromItem_de_Inspeccion = entity.fromItem_de_Inspeccion;
    this.dataListConfig.filterAdvanced.toItem_de_Inspeccion = entity.toItem_de_Inspeccion;
    this.dataListConfig.filterAdvanced.Motivo_de_EdicionFilter = entity.Motivo_de_EdicionFilter;
    this.dataListConfig.filterAdvanced.Motivo_de_Edicion = entity.Motivo_de_Edicion;
    this.dataListConfig.filterAdvanced.Motivo_de_EdicionMultiple = entity.Motivo_de_EdicionMultiple;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
    this.dataListConfig.filterAdvanced.fromFecha_de_Respuesta = entity.fromFecha_de_Respuesta;
    this.dataListConfig.filterAdvanced.toFecha_de_Respuesta = entity.toFecha_de_Respuesta;
	this.dataListConfig.filterAdvanced.Hora_de_RespuestaFilter = entity.Hora_de_RespuestaFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Respuesta = entity.Hora_de_Respuesta;
    this.dataListConfig.filterAdvanced.Usuario_que_Registra_RespuestaFilter = entity.Usuario_que_Registra_RespuestaFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_Registra_Respuesta = entity.Usuario_que_Registra_Respuesta;
    this.dataListConfig.filterAdvanced.Usuario_que_Registra_RespuestaMultiple = entity.Usuario_que_Registra_RespuestaMultiple;
    this.dataListConfig.filterAdvanced.RespuestaFilter = entity.RespuestaFilter;
    this.dataListConfig.filterAdvanced.Respuesta = entity.Respuesta;
    this.dataListConfig.filterAdvanced.RespuestaMultiple = entity.RespuestaMultiple;
	this.dataListConfig.filterAdvanced.Observaciones_RespeustaFilter = entity.Observaciones_RespeustaFilter;
	this.dataListConfig.filterAdvanced.Observaciones_Respeusta = entity.Observaciones_Respeusta;
    this.dataListConfig.filterAdvanced.fromDia_de_Llegada_del_Avion = entity.fromDia_de_Llegada_del_Avion;
    this.dataListConfig.filterAdvanced.toDia_de_Llegada_del_Avion = entity.toDia_de_Llegada_del_Avion;
	this.dataListConfig.filterAdvanced.Hora_de_Llegada_del_AvionFilter = entity.Hora_de_Llegada_del_AvionFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Llegada_del_Avion = entity.Hora_de_Llegada_del_Avion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Cotizacion/list'], { state: { data: this.dataListConfig } });
  }
}
