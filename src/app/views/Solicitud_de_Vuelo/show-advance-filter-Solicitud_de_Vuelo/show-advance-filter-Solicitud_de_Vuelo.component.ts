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
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Estatus_de_Solicitud_de_Vuelo } from 'src/app/models/Estatus_de_Solicitud_de_Vuelo';
import { Estatus_de_Solicitud_de_VueloService } from 'src/app/api-services/Estatus_de_Solicitud_de_Vuelo.service';
import { Resultado_de_Autorizacion_de_Vuelo } from 'src/app/models/Resultado_de_Autorizacion_de_Vuelo';
import { Resultado_de_Autorizacion_de_VueloService } from 'src/app/api-services/Resultado_de_Autorizacion_de_Vuelo.service';


@Component({
  selector: 'app-show-advance-filter-Solicitud_de_Vuelo',
  templateUrl: './show-advance-filter-Solicitud_de_Vuelo.component.html',
  styleUrls: ['./show-advance-filter-Solicitud_de_Vuelo.component.scss']
})
export class ShowAdvanceFilterSolicitud_de_VueloComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Solicitantes: Spartan_User[] = [];
  public Empresa_Solicitantes: Cliente[] = [];
  public Estatuss: Estatus_de_Solicitud_de_Vuelo[] = [];
  public Direccion_Usuario_Autorizacions: Spartan_User[] = [];
  public Direccion_Resultado_Autorizacions: Resultado_de_Autorizacion_de_Vuelo[] = [];
  public Presidencia_Usuario_Autorizacions: Spartan_User[] = [];
  public Presidencia_Resultado_Autorizacions: Resultado_de_Autorizacion_de_Vuelo[] = [];

  public spartan_users: Spartan_User;
  public clientes: Cliente;
  public estatus_de_solicitud_de_vuelos: Estatus_de_Solicitud_de_Vuelo;
  public resultado_de_autorizacion_de_vuelos: Resultado_de_Autorizacion_de_Vuelo;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Solicitud",
      "Hora_de_Solicitud",
      "Solicitante",
      "Empresa_Solicitante",
      "Motivo_de_viaje",
      "Fecha_de_Salida",
      "Hora_de_Salida",
      "Fecha_de_Regreso",
      "Hora_de_Regreso",
      "Numero_de_Vuelo",
      "Ruta_de_Vuelo",
      "Observaciones",
      "Estatus",
      "Tiempo_de_Vuelo",
      "Tiempo_de_Espera",
      "Espera_SIN_Cargo",
      "Espera_CON_Cargo",
      "Pernoctas",
      "Tiempo_de_Calzo",
      "Internacional",
      "Direccion_fecha_autorizacion",
      "Direccion_Hora_Autorizacion",
      "Direccion_Usuario_Autorizacion",
      "Direccion_Resultado_Autorizacion",
      "Direccion_Motivo_Rechazo",
      "Presidencia_Fecha_Autorizacion",
      "Presidencia_Hora_Autorizacion",
      "Vuelo_Reabierto",
      "Presidencia_Usuario_Autorizacion",
      "Tramos",
      "TuaNacionales",
      "TuaInternacionales",
      "Presidencia_Resultado_Autorizacion",
      "Presidencia_motivo_rechazo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Solicitud_filtro",
      "Hora_de_Solicitud_filtro",
      "Solicitante_filtro",
      "Empresa_Solicitante_filtro",
      "Motivo_de_viaje_filtro",
      "Fecha_de_Salida_filtro",
      "Hora_de_Salida_filtro",
      "Fecha_de_Regreso_filtro",
      "Hora_de_Regreso_filtro",
      "Numero_de_Vuelo_filtro",
      "Ruta_de_Vuelo_filtro",
      "Observaciones_filtro",
      "Estatus_filtro",
      "Tiempo_de_Vuelo_filtro",
      "Tiempo_de_Espera_filtro",
      "Espera_SIN_Cargo_filtro",
      "Espera_CON_Cargo_filtro",
      "Pernoctas_filtro",
      "Tiempo_de_Calzo_filtro",
      "Internacional_filtro",
      "Direccion_fecha_autorizacion_filtro",
      "Direccion_Hora_Autorizacion_filtro",
      "Direccion_Usuario_Autorizacion_filtro",
      "Direccion_Resultado_Autorizacion_filtro",
      "Direccion_Motivo_Rechazo_filtro",
      "Presidencia_Fecha_Autorizacion_filtro",
      "Presidencia_Hora_Autorizacion_filtro",
      "Vuelo_Reabierto_filtro",
      "Presidencia_Usuario_Autorizacion_filtro",
      "Tramos_filtro",
      "TuaNacionales_filtro",
      "TuaInternacionales_filtro",
      "Presidencia_Resultado_Autorizacion_filtro",
      "Presidencia_motivo_rechazo_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha_de_Solicitud: null,
      Hora_de_Solicitud: "",
      Solicitante: "",
      Empresa_Solicitante: "",
      Motivo_de_viaje: "",
      Fecha_de_Salida: null,
      Hora_de_Salida: "",
      Fecha_de_Regreso: null,
      Hora_de_Regreso: "",
      Numero_de_Vuelo: "",
      Ruta_de_Vuelo: "",
      Observaciones: "",
      Estatus: "",
      Tiempo_de_Vuelo: "",
      Tiempo_de_Espera: "",
      Espera_SIN_Cargo: "",
      Espera_CON_Cargo: "",
      Pernoctas: "",
      Tiempo_de_Calzo: "",
      Internacional: "",
      Direccion_fecha_autorizacion: null,
      Direccion_Hora_Autorizacion: "",
      Direccion_Usuario_Autorizacion: "",
      Direccion_Resultado_Autorizacion: "",
      Direccion_Motivo_Rechazo: "",
      Presidencia_Fecha_Autorizacion: null,
      Presidencia_Hora_Autorizacion: "",
      Vuelo_Reabierto: "",
      Presidencia_Usuario_Autorizacion: "",
      Tramos: "",
      TuaNacionales: "",
      TuaInternacionales: "",
      Presidencia_Resultado_Autorizacion: "",
      Presidencia_motivo_rechazo: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Solicitud: "",
      toFecha_de_Solicitud: "",
      fromHora_de_Solicitud: "",
      toHora_de_Solicitud: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      Empresa_SolicitanteFilter: "",
      Empresa_Solicitante: "",
      Empresa_SolicitanteMultiple: "",
      fromFecha_de_Salida: "",
      toFecha_de_Salida: "",
      fromHora_de_Salida: "",
      toHora_de_Salida: "",
      fromFecha_de_Regreso: "",
      toFecha_de_Regreso: "",
      fromHora_de_Regreso: "",
      toHora_de_Regreso: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromTiempo_de_Vuelo: "",
      toTiempo_de_Vuelo: "",
      fromTiempo_de_Espera: "",
      toTiempo_de_Espera: "",
      fromEspera_SIN_Cargo: "",
      toEspera_SIN_Cargo: "",
      fromEspera_CON_Cargo: "",
      toEspera_CON_Cargo: "",
      fromPernoctas: "",
      toPernoctas: "",
      fromTiempo_de_Calzo: "",
      toTiempo_de_Calzo: "",
      fromDireccion_fecha_autorizacion: "",
      toDireccion_fecha_autorizacion: "",
      fromDireccion_Hora_Autorizacion: "",
      toDireccion_Hora_Autorizacion: "",
      Direccion_Usuario_AutorizacionFilter: "",
      Direccion_Usuario_Autorizacion: "",
      Direccion_Usuario_AutorizacionMultiple: "",
      Direccion_Resultado_AutorizacionFilter: "",
      Direccion_Resultado_Autorizacion: "",
      Direccion_Resultado_AutorizacionMultiple: "",
      fromPresidencia_Fecha_Autorizacion: "",
      toPresidencia_Fecha_Autorizacion: "",
      fromPresidencia_Hora_Autorizacion: "",
      toPresidencia_Hora_Autorizacion: "",
      Presidencia_Usuario_AutorizacionFilter: "",
      Presidencia_Usuario_Autorizacion: "",
      Presidencia_Usuario_AutorizacionMultiple: "",
      fromTramos: "",
      toTramos: "",
      fromTuaNacionales: "",
      toTuaNacionales: "",
      fromTuaInternacionales: "",
      toTuaInternacionales: "",
      Presidencia_Resultado_AutorizacionFilter: "",
      Presidencia_Resultado_Autorizacion: "",
      Presidencia_Resultado_AutorizacionMultiple: "",

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
    private clienteService: ClienteService,
    private estatus_de_solicitud_de_vueloService: Estatus_de_Solicitud_de_VueloService,
    private resultado_de_autorizacion_de_vueloService: Resultado_de_Autorizacion_de_VueloService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFecha_de_Solicitud: [''],
      toFecha_de_Solicitud: [''],
      fromHora_de_Solicitud: [''],
      toHora_de_Solicitud: [''],
      SolicitanteFilter: [''],
      Solicitante: [''],
      SolicitanteMultiple: [''],
      Empresa_SolicitanteFilter: [''],
      Empresa_Solicitante: [''],
      Empresa_SolicitanteMultiple: [''],
      fromFecha_de_Salida: [''],
      toFecha_de_Salida: [''],
      fromHora_de_Salida: [''],
      toHora_de_Salida: [''],
      fromFecha_de_Regreso: [''],
      toFecha_de_Regreso: [''],
      fromHora_de_Regreso: [''],
      toHora_de_Regreso: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromTiempo_de_Vuelo: [''],
      toTiempo_de_Vuelo: [''],
      fromTiempo_de_Espera: [''],
      toTiempo_de_Espera: [''],
      fromEspera_SIN_Cargo: [''],
      toEspera_SIN_Cargo: [''],
      fromEspera_CON_Cargo: [''],
      toEspera_CON_Cargo: [''],
      fromPernoctas: [''],
      toPernoctas: [''],
      fromTiempo_de_Calzo: [''],
      toTiempo_de_Calzo: [''],
      fromDireccion_fecha_autorizacion: [''],
      toDireccion_fecha_autorizacion: [''],
      fromDireccion_Hora_Autorizacion: [''],
      toDireccion_Hora_Autorizacion: [''],
      Direccion_Usuario_AutorizacionFilter: [''],
      Direccion_Usuario_Autorizacion: [''],
      Direccion_Usuario_AutorizacionMultiple: [''],
      Direccion_Resultado_AutorizacionFilter: [''],
      Direccion_Resultado_Autorizacion: [''],
      Direccion_Resultado_AutorizacionMultiple: [''],
      fromPresidencia_Fecha_Autorizacion: [''],
      toPresidencia_Fecha_Autorizacion: [''],
      fromPresidencia_Hora_Autorizacion: [''],
      toPresidencia_Hora_Autorizacion: [''],
      Presidencia_Usuario_AutorizacionFilter: [''],
      Presidencia_Usuario_Autorizacion: [''],
      Presidencia_Usuario_AutorizacionMultiple: [''],
      fromTramos: [''],
      toTramos: [''],
      fromTuaNacionales: [''],
      toTuaNacionales: [''],
      fromTuaInternacionales: [''],
      toTuaInternacionales: [''],
      Presidencia_Resultado_AutorizacionFilter: [''],
      Presidencia_Resultado_Autorizacion: [''],
      Presidencia_Resultado_AutorizacionMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Solicitud_de_Vuelo/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.estatus_de_solicitud_de_vueloService.getAll());
    observablesArray.push(this.resultado_de_autorizacion_de_vueloService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,clientes ,estatus_de_solicitud_de_vuelos ,resultado_de_autorizacion_de_vuelos ]) => {
		  this.spartan_users = spartan_users;
		  this.clientes = clientes;
		  this.estatus_de_solicitud_de_vuelos = estatus_de_solicitud_de_vuelos;
		  this.resultado_de_autorizacion_de_vuelos = resultado_de_autorizacion_de_vuelos;
          

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
    this.dataListConfig.filterAdvanced.fromFecha_de_Solicitud = entity.fromFecha_de_Solicitud;
    this.dataListConfig.filterAdvanced.toFecha_de_Solicitud = entity.toFecha_de_Solicitud;
	this.dataListConfig.filterAdvanced.Hora_de_SolicitudFilter = entity.Hora_de_SolicitudFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Solicitud = entity.Hora_de_Solicitud;
    this.dataListConfig.filterAdvanced.SolicitanteFilter = entity.SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Solicitante = entity.Solicitante;
    this.dataListConfig.filterAdvanced.SolicitanteMultiple = entity.SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.Empresa_SolicitanteFilter = entity.Empresa_SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Empresa_Solicitante = entity.Empresa_Solicitante;
    this.dataListConfig.filterAdvanced.Empresa_SolicitanteMultiple = entity.Empresa_SolicitanteMultiple;
	this.dataListConfig.filterAdvanced.Motivo_de_viajeFilter = entity.Motivo_de_viajeFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_viaje = entity.Motivo_de_viaje;
    this.dataListConfig.filterAdvanced.fromFecha_de_Salida = entity.fromFecha_de_Salida;
    this.dataListConfig.filterAdvanced.toFecha_de_Salida = entity.toFecha_de_Salida;
	this.dataListConfig.filterAdvanced.Hora_de_SalidaFilter = entity.Hora_de_SalidaFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Salida = entity.Hora_de_Salida;
    this.dataListConfig.filterAdvanced.fromFecha_de_Regreso = entity.fromFecha_de_Regreso;
    this.dataListConfig.filterAdvanced.toFecha_de_Regreso = entity.toFecha_de_Regreso;
	this.dataListConfig.filterAdvanced.Hora_de_RegresoFilter = entity.Hora_de_RegresoFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Regreso = entity.Hora_de_Regreso;
	this.dataListConfig.filterAdvanced.Numero_de_VueloFilter = entity.Numero_de_VueloFilter;
	this.dataListConfig.filterAdvanced.Numero_de_Vuelo = entity.Numero_de_Vuelo;
	this.dataListConfig.filterAdvanced.Ruta_de_VueloFilter = entity.Ruta_de_VueloFilter;
	this.dataListConfig.filterAdvanced.Ruta_de_Vuelo = entity.Ruta_de_Vuelo;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
	this.dataListConfig.filterAdvanced.Tiempo_de_VueloFilter = entity.Tiempo_de_VueloFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Vuelo = entity.Tiempo_de_Vuelo;
	this.dataListConfig.filterAdvanced.Tiempo_de_EsperaFilter = entity.Tiempo_de_EsperaFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Espera = entity.Tiempo_de_Espera;
	this.dataListConfig.filterAdvanced.Espera_SIN_CargoFilter = entity.Espera_SIN_CargoFilter;
	this.dataListConfig.filterAdvanced.Espera_SIN_Cargo = entity.Espera_SIN_Cargo;
	this.dataListConfig.filterAdvanced.Espera_CON_CargoFilter = entity.Espera_CON_CargoFilter;
	this.dataListConfig.filterAdvanced.Espera_CON_Cargo = entity.Espera_CON_Cargo;
    this.dataListConfig.filterAdvanced.fromPernoctas = entity.fromPernoctas;
    this.dataListConfig.filterAdvanced.toPernoctas = entity.toPernoctas;
	this.dataListConfig.filterAdvanced.Tiempo_de_CalzoFilter = entity.Tiempo_de_CalzoFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Calzo = entity.Tiempo_de_Calzo;
    this.dataListConfig.filterAdvanced.fromDireccion_fecha_autorizacion = entity.fromDireccion_fecha_autorizacion;
    this.dataListConfig.filterAdvanced.toDireccion_fecha_autorizacion = entity.toDireccion_fecha_autorizacion;
	this.dataListConfig.filterAdvanced.Direccion_Hora_AutorizacionFilter = entity.Direccion_Hora_AutorizacionFilter;
	this.dataListConfig.filterAdvanced.Direccion_Hora_Autorizacion = entity.Direccion_Hora_Autorizacion;
    this.dataListConfig.filterAdvanced.Direccion_Usuario_AutorizacionFilter = entity.Direccion_Usuario_AutorizacionFilter;
    this.dataListConfig.filterAdvanced.Direccion_Usuario_Autorizacion = entity.Direccion_Usuario_Autorizacion;
    this.dataListConfig.filterAdvanced.Direccion_Usuario_AutorizacionMultiple = entity.Direccion_Usuario_AutorizacionMultiple;
    this.dataListConfig.filterAdvanced.Direccion_Resultado_AutorizacionFilter = entity.Direccion_Resultado_AutorizacionFilter;
    this.dataListConfig.filterAdvanced.Direccion_Resultado_Autorizacion = entity.Direccion_Resultado_Autorizacion;
    this.dataListConfig.filterAdvanced.Direccion_Resultado_AutorizacionMultiple = entity.Direccion_Resultado_AutorizacionMultiple;
	this.dataListConfig.filterAdvanced.Direccion_Motivo_RechazoFilter = entity.Direccion_Motivo_RechazoFilter;
	this.dataListConfig.filterAdvanced.Direccion_Motivo_Rechazo = entity.Direccion_Motivo_Rechazo;
    this.dataListConfig.filterAdvanced.fromPresidencia_Fecha_Autorizacion = entity.fromPresidencia_Fecha_Autorizacion;
    this.dataListConfig.filterAdvanced.toPresidencia_Fecha_Autorizacion = entity.toPresidencia_Fecha_Autorizacion;
	this.dataListConfig.filterAdvanced.Presidencia_Hora_AutorizacionFilter = entity.Presidencia_Hora_AutorizacionFilter;
	this.dataListConfig.filterAdvanced.Presidencia_Hora_Autorizacion = entity.Presidencia_Hora_Autorizacion;
    this.dataListConfig.filterAdvanced.Presidencia_Usuario_AutorizacionFilter = entity.Presidencia_Usuario_AutorizacionFilter;
    this.dataListConfig.filterAdvanced.Presidencia_Usuario_Autorizacion = entity.Presidencia_Usuario_Autorizacion;
    this.dataListConfig.filterAdvanced.Presidencia_Usuario_AutorizacionMultiple = entity.Presidencia_Usuario_AutorizacionMultiple;
    this.dataListConfig.filterAdvanced.fromTramos = entity.fromTramos;
    this.dataListConfig.filterAdvanced.toTramos = entity.toTramos;
    this.dataListConfig.filterAdvanced.fromTuaNacionales = entity.fromTuaNacionales;
    this.dataListConfig.filterAdvanced.toTuaNacionales = entity.toTuaNacionales;
    this.dataListConfig.filterAdvanced.fromTuaInternacionales = entity.fromTuaInternacionales;
    this.dataListConfig.filterAdvanced.toTuaInternacionales = entity.toTuaInternacionales;
    this.dataListConfig.filterAdvanced.Presidencia_Resultado_AutorizacionFilter = entity.Presidencia_Resultado_AutorizacionFilter;
    this.dataListConfig.filterAdvanced.Presidencia_Resultado_Autorizacion = entity.Presidencia_Resultado_Autorizacion;
    this.dataListConfig.filterAdvanced.Presidencia_Resultado_AutorizacionMultiple = entity.Presidencia_Resultado_AutorizacionMultiple;
	this.dataListConfig.filterAdvanced.Presidencia_motivo_rechazoFilter = entity.Presidencia_motivo_rechazoFilter;
	this.dataListConfig.filterAdvanced.Presidencia_motivo_rechazo = entity.Presidencia_motivo_rechazo;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Solicitud_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }
}
