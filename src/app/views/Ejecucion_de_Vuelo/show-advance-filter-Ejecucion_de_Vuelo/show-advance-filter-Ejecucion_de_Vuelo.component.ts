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

import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Tipo_de_Ala } from 'src/app/models/Tipo_de_Ala';
import { Tipo_de_AlaService } from 'src/app/api-services/Tipo_de_Ala.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Tripulacion } from 'src/app/models/Tripulacion';
import { TripulacionService } from 'src/app/api-services/Tripulacion.service';
import { Tipo_de_vuelo } from 'src/app/models/Tipo_de_vuelo';
import { Tipo_de_vueloService } from 'src/app/api-services/Tipo_de_vuelo.service';


@Component({
  selector: 'app-show-advance-filter-Ejecucion_de_Vuelo',
  templateUrl: './show-advance-filter-Ejecucion_de_Vuelo.component.html',
  styleUrls: ['./show-advance-filter-Ejecucion_de_Vuelo.component.scss']
})
export class ShowAdvanceFilterEjecucion_de_VueloComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Numero_de_Vuelos: Solicitud_de_Vuelo[] = [];
  public Tramo_de_Vuelos: Registro_de_vuelo[] = [];
  public Matriculas: Aeronave[] = [];
  public Tipo_de_Alas: Tipo_de_Ala[] = [];
  public Origens: Aeropuertos[] = [];
  public Destinos: Aeropuertos[] = [];
  public Comandantes: Tripulacion[] = [];
  public Capitans: Tripulacion[] = [];
  public Primer_Capitans: Tripulacion[] = [];
  public Segundo_Capitans: Tripulacion[] = [];
  public Sobrecargos: Tripulacion[] = [];
  public Administrador_del_Vuelos: Tripulacion[] = [];
  public Tipo_de_Vuelos: Tipo_de_vuelo[] = [];

  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public registro_de_vuelos: Registro_de_vuelo;
  public aeronaves: Aeronave;
  public tipo_de_alas: Tipo_de_Ala;
  public aeropuertoss: Aeropuertos;
  public tripulacions: Tripulacion;
  public tipo_de_vuelos: Tipo_de_vuelo;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Numero_de_Vuelo",
      "Tramo_de_Vuelo",
      "Matricula",
      "Tipo_de_Ala",
      "Solicitud",
      "Origen",
      "Destino",
      "Distancia_FIR_Km",
      "Comandante",
      "Capitan",
      "Primer_Capitan",
      "Segundo_Capitan",
      "Sobrecargo",
      "Administrador_del_Vuelo",
      "Tipo_de_Vuelo",
      "Pasajeros_Adicionales",
      "Fecha_de_Salida",
      "Hora_de_Salida",
      "Fecha_de_Llegada",
      "Hora_de_Llegada",
      "Fecha_de_Despegue",
      "Hora_de_Despegue",
      "Fecha_de_Aterrizaje",
      "Hora_de_Aterrizaje",
      "Fecha_de_Salida_Local",
      "Hora_de_Salida_Local",
      "Fecha_de_Llegada_Local",
      "Hora_de_Llegada_Local",
      "Fecha_de_Despegue_Local",
      "Hora_de_Despegue_Local",
      "Fecha_de_Aterrizaje_Local",
      "Hora_de_Aterrizaje_Local",
      "Internacional",
      "Tiempo_de_Calzo",
      "Tiempo_de_Vuelo",
      "Distancia_en_Millas",
      "Combustible__Cargado",
      "Combustible__Despegue",
      "Combustible__Aterrizaje",
      "Combustible__Consumo",
      "Observaciones",
      "Reportes_de_la_Aeronave",
      "Tiempo_de_Espera_Paso",
      "Tiempo_de_Espera",
      "Tiempo_de_Espera_Con_Costo",
      "Tiempo_de_Espera_Sin_Costo",
      "Pernoctas",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Numero_de_Vuelo_filtro",
      "Tramo_de_Vuelo_filtro",
      "Matricula_filtro",
      "Tipo_de_Ala_filtro",
      "Solicitud_filtro",
      "Origen_filtro",
      "Destino_filtro",
      "Distancia_FIR_Km_filtro",
      "Comandante_filtro",
      "Capitan_filtro",
      "Primer_Capitan_filtro",
      "Segundo_Capitan_filtro",
      "Sobrecargo_filtro",
      "Administrador_del_Vuelo_filtro",
      "Tipo_de_Vuelo_filtro",
      "Pasajeros_Adicionales_filtro",
      "Fecha_de_Salida_filtro",
      "Hora_de_Salida_filtro",
      "Fecha_de_Llegada_filtro",
      "Hora_de_Llegada_filtro",
      "Fecha_de_Despegue_filtro",
      "Hora_de_Despegue_filtro",
      "Fecha_de_Aterrizaje_filtro",
      "Hora_de_Aterrizaje_filtro",
      "Fecha_de_Salida_Local_filtro",
      "Hora_de_Salida_Local_filtro",
      "Fecha_de_Llegada_Local_filtro",
      "Hora_de_Llegada_Local_filtro",
      "Fecha_de_Despegue_Local_filtro",
      "Hora_de_Despegue_Local_filtro",
      "Fecha_de_Aterrizaje_Local_filtro",
      "Hora_de_Aterrizaje_Local_filtro",
      "Internacional_filtro",
      "Tiempo_de_Calzo_filtro",
      "Tiempo_de_Vuelo_filtro",
      "Distancia_en_Millas_filtro",
      "Combustible__Cargado_filtro",
      "Combustible__Despegue_filtro",
      "Combustible__Aterrizaje_filtro",
      "Combustible__Consumo_filtro",
      "Observaciones_filtro",
      "Reportes_de_la_Aeronave_filtro",
      "Tiempo_de_Espera_Paso_filtro",
      "Tiempo_de_Espera_filtro",
      "Tiempo_de_Espera_Con_Costo_filtro",
      "Tiempo_de_Espera_Sin_Costo_filtro",
      "Pernoctas_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Numero_de_Vuelo: "",
      Tramo_de_Vuelo: "",
      Matricula: "",
      Tipo_de_Ala: "",
      Solicitud: null,
      Origen: "",
      Destino: "",
      Distancia_FIR_Km: "",
      Comandante: "",
      Capitan: "",
      Primer_Capitan: "",
      Segundo_Capitan: "",
      Sobrecargo: "",
      Administrador_del_Vuelo: "",
      Tipo_de_Vuelo: "",
      Pasajeros_Adicionales: "",
      Fecha_de_Salida: null,
      Hora_de_Salida: "",
      Fecha_de_Llegada: null,
      Hora_de_Llegada: "",
      Fecha_de_Despegue: null,
      Hora_de_Despegue: "",
      Fecha_de_Aterrizaje: null,
      Hora_de_Aterrizaje: "",
      Fecha_de_Salida_Local: null,
      Hora_de_Salida_Local: "",
      Fecha_de_Llegada_Local: null,
      Hora_de_Llegada_Local: "",
      Fecha_de_Despegue_Local: null,
      Hora_de_Despegue_Local: "",
      Fecha_de_Aterrizaje_Local: null,
      Hora_de_Aterrizaje_Local: "",
      Internacional: "",
      Tiempo_de_Calzo: "",
      Tiempo_de_Vuelo: "",
      Distancia_en_Millas: "",
      Combustible__Cargado: "",
      Combustible__Despegue: "",
      Combustible__Aterrizaje: "",
      Combustible__Consumo: "",
      Observaciones: "",
      Reportes_de_la_Aeronave: "",
      Tiempo_de_Espera_Paso: "",
      Tiempo_de_Espera: "",
      Tiempo_de_Espera_Con_Costo: "",
      Tiempo_de_Espera_Sin_Costo: "",
      Pernoctas: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Numero_de_VueloFilter: "",
      Numero_de_Vuelo: "",
      Numero_de_VueloMultiple: "",
      Tramo_de_VueloFilter: "",
      Tramo_de_Vuelo: "",
      Tramo_de_VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      Tipo_de_AlaFilter: "",
      Tipo_de_Ala: "",
      Tipo_de_AlaMultiple: "",
      fromSolicitud: "",
      toSolicitud: "",
      OrigenFilter: "",
      Origen: "",
      OrigenMultiple: "",
      DestinoFilter: "",
      Destino: "",
      DestinoMultiple: "",
      fromDistancia_FIR_Km: "",
      toDistancia_FIR_Km: "",
      ComandanteFilter: "",
      Comandante: "",
      ComandanteMultiple: "",
      CapitanFilter: "",
      Capitan: "",
      CapitanMultiple: "",
      Primer_CapitanFilter: "",
      Primer_Capitan: "",
      Primer_CapitanMultiple: "",
      Segundo_CapitanFilter: "",
      Segundo_Capitan: "",
      Segundo_CapitanMultiple: "",
      SobrecargoFilter: "",
      Sobrecargo: "",
      SobrecargoMultiple: "",
      Administrador_del_VueloFilter: "",
      Administrador_del_Vuelo: "",
      Administrador_del_VueloMultiple: "",
      Tipo_de_VueloFilter: "",
      Tipo_de_Vuelo: "",
      Tipo_de_VueloMultiple: "",
      fromPasajeros_Adicionales: "",
      toPasajeros_Adicionales: "",
      fromFecha_de_Salida: "",
      toFecha_de_Salida: "",
      fromHora_de_Salida: "",
      toHora_de_Salida: "",
      fromFecha_de_Llegada: "",
      toFecha_de_Llegada: "",
      fromHora_de_Llegada: "",
      toHora_de_Llegada: "",
      fromFecha_de_Despegue: "",
      toFecha_de_Despegue: "",
      fromHora_de_Despegue: "",
      toHora_de_Despegue: "",
      fromFecha_de_Aterrizaje: "",
      toFecha_de_Aterrizaje: "",
      fromHora_de_Aterrizaje: "",
      toHora_de_Aterrizaje: "",
      fromFecha_de_Salida_Local: "",
      toFecha_de_Salida_Local: "",
      fromHora_de_Salida_Local: "",
      toHora_de_Salida_Local: "",
      fromFecha_de_Llegada_Local: "",
      toFecha_de_Llegada_Local: "",
      fromHora_de_Llegada_Local: "",
      toHora_de_Llegada_Local: "",
      fromFecha_de_Despegue_Local: "",
      toFecha_de_Despegue_Local: "",
      fromHora_de_Despegue_Local: "",
      toHora_de_Despegue_Local: "",
      fromFecha_de_Aterrizaje_Local: "",
      toFecha_de_Aterrizaje_Local: "",
      fromHora_de_Aterrizaje_Local: "",
      toHora_de_Aterrizaje_Local: "",
      fromTiempo_de_Calzo: "",
      toTiempo_de_Calzo: "",
      fromTiempo_de_Vuelo: "",
      toTiempo_de_Vuelo: "",
      fromDistancia_en_Millas: "",
      toDistancia_en_Millas: "",
      fromCombustible__Cargado: "",
      toCombustible__Cargado: "",
      fromCombustible__Despegue: "",
      toCombustible__Despegue: "",
      fromCombustible__Aterrizaje: "",
      toCombustible__Aterrizaje: "",
      fromCombustible__Consumo: "",
      toCombustible__Consumo: "",
      fromTiempo_de_Espera_Paso: "",
      toTiempo_de_Espera_Paso: "",
      fromTiempo_de_Espera: "",
      toTiempo_de_Espera: "",
      fromPernoctas: "",
      toPernoctas: "",

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
    private solicitud_de_vueloService: Solicitud_de_VueloService,
    private registro_de_vueloService: Registro_de_vueloService,
    private aeronaveService: AeronaveService,
    private tipo_de_alaService: Tipo_de_AlaService,
    private aeropuertosService: AeropuertosService,
    private tripulacionService: TripulacionService,
    private tipo_de_vueloService: Tipo_de_vueloService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Numero_de_VueloFilter: [''],
      Numero_de_Vuelo: [''],
      Numero_de_VueloMultiple: [''],
      Tramo_de_VueloFilter: [''],
      Tramo_de_Vuelo: [''],
      Tramo_de_VueloMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      Tipo_de_AlaFilter: [''],
      Tipo_de_Ala: [''],
      Tipo_de_AlaMultiple: [''],
      fromSolicitud: [''],
      toSolicitud: [''],
      OrigenFilter: [''],
      Origen: [''],
      OrigenMultiple: [''],
      DestinoFilter: [''],
      Destino: [''],
      DestinoMultiple: [''],
      fromDistancia_FIR_Km: [''],
      toDistancia_FIR_Km: [''],
      ComandanteFilter: [''],
      Comandante: [''],
      ComandanteMultiple: [''],
      CapitanFilter: [''],
      Capitan: [''],
      CapitanMultiple: [''],
      Primer_CapitanFilter: [''],
      Primer_Capitan: [''],
      Primer_CapitanMultiple: [''],
      Segundo_CapitanFilter: [''],
      Segundo_Capitan: [''],
      Segundo_CapitanMultiple: [''],
      SobrecargoFilter: [''],
      Sobrecargo: [''],
      SobrecargoMultiple: [''],
      Administrador_del_VueloFilter: [''],
      Administrador_del_Vuelo: [''],
      Administrador_del_VueloMultiple: [''],
      Tipo_de_VueloFilter: [''],
      Tipo_de_Vuelo: [''],
      Tipo_de_VueloMultiple: [''],
      fromPasajeros_Adicionales: [''],
      toPasajeros_Adicionales: [''],
      fromFecha_de_Salida: [''],
      toFecha_de_Salida: [''],
      fromHora_de_Salida: [''],
      toHora_de_Salida: [''],
      fromFecha_de_Llegada: [''],
      toFecha_de_Llegada: [''],
      fromHora_de_Llegada: [''],
      toHora_de_Llegada: [''],
      fromFecha_de_Despegue: [''],
      toFecha_de_Despegue: [''],
      fromHora_de_Despegue: [''],
      toHora_de_Despegue: [''],
      fromFecha_de_Aterrizaje: [''],
      toFecha_de_Aterrizaje: [''],
      fromHora_de_Aterrizaje: [''],
      toHora_de_Aterrizaje: [''],
      fromFecha_de_Salida_Local: [''],
      toFecha_de_Salida_Local: [''],
      fromHora_de_Salida_Local: [''],
      toHora_de_Salida_Local: [''],
      fromFecha_de_Llegada_Local: [''],
      toFecha_de_Llegada_Local: [''],
      fromHora_de_Llegada_Local: [''],
      toHora_de_Llegada_Local: [''],
      fromFecha_de_Despegue_Local: [''],
      toFecha_de_Despegue_Local: [''],
      fromHora_de_Despegue_Local: [''],
      toHora_de_Despegue_Local: [''],
      fromFecha_de_Aterrizaje_Local: [''],
      toFecha_de_Aterrizaje_Local: [''],
      fromHora_de_Aterrizaje_Local: [''],
      toHora_de_Aterrizaje_Local: [''],
      fromTiempo_de_Calzo: [''],
      toTiempo_de_Calzo: [''],
      fromTiempo_de_Vuelo: [''],
      toTiempo_de_Vuelo: [''],
      fromCombustible__Cargado: [''],
      toCombustible__Cargado: [''],
      fromCombustible__Despegue: [''],
      toCombustible__Despegue: [''],
      fromCombustible__Aterrizaje: [''],
      toCombustible__Aterrizaje: [''],
      fromCombustible__Consumo: [''],
      toCombustible__Consumo: [''],
      fromTiempo_de_Espera_Paso: [''],
      toTiempo_de_Espera_Paso: [''],
      fromTiempo_de_Espera: [''],
      toTiempo_de_Espera: [''],
      fromPernoctas: [''],
      toPernoctas: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Ejecucion_de_Vuelo/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.registro_de_vueloService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.tipo_de_alaService.getAll());
    observablesArray.push(this.aeropuertosService.getAll());
    observablesArray.push(this.tripulacionService.getAll());
    observablesArray.push(this.tipo_de_vueloService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_vuelos ,registro_de_vuelos ,aeronaves ,tipo_de_alas ,aeropuertoss ,tripulacions ,tipo_de_vuelos ]) => {
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.registro_de_vuelos = registro_de_vuelos;
		  this.aeronaves = aeronaves;
		  this.tipo_de_alas = tipo_de_alas;
		  this.aeropuertoss = aeropuertoss;
		  this.tripulacions = tripulacions;
		  this.tipo_de_vuelos = tipo_de_vuelos;
          

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
    this.dataListConfig.filterAdvanced.Numero_de_VueloFilter = entity.Numero_de_VueloFilter;
    this.dataListConfig.filterAdvanced.Numero_de_Vuelo = entity.Numero_de_Vuelo;
    this.dataListConfig.filterAdvanced.Numero_de_VueloMultiple = entity.Numero_de_VueloMultiple;
    this.dataListConfig.filterAdvanced.Tramo_de_VueloFilter = entity.Tramo_de_VueloFilter;
    this.dataListConfig.filterAdvanced.Tramo_de_Vuelo = entity.Tramo_de_Vuelo;
    this.dataListConfig.filterAdvanced.Tramo_de_VueloMultiple = entity.Tramo_de_VueloMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_AlaFilter = entity.Tipo_de_AlaFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Ala = entity.Tipo_de_Ala;
    this.dataListConfig.filterAdvanced.Tipo_de_AlaMultiple = entity.Tipo_de_AlaMultiple;
    this.dataListConfig.filterAdvanced.fromSolicitud = entity.fromSolicitud;
    this.dataListConfig.filterAdvanced.toSolicitud = entity.toSolicitud;
    this.dataListConfig.filterAdvanced.OrigenFilter = entity.OrigenFilter;
    this.dataListConfig.filterAdvanced.Origen = entity.Origen;
    this.dataListConfig.filterAdvanced.OrigenMultiple = entity.OrigenMultiple;
    this.dataListConfig.filterAdvanced.DestinoFilter = entity.DestinoFilter;
    this.dataListConfig.filterAdvanced.Destino = entity.Destino;
    this.dataListConfig.filterAdvanced.DestinoMultiple = entity.DestinoMultiple;
    this.dataListConfig.filterAdvanced.fromDistancia_FIR_Km = entity.fromDistancia_FIR_Km;
    this.dataListConfig.filterAdvanced.toDistancia_FIR_Km = entity.toDistancia_FIR_Km;
    this.dataListConfig.filterAdvanced.ComandanteFilter = entity.ComandanteFilter;
    this.dataListConfig.filterAdvanced.Comandante = entity.Comandante;
    this.dataListConfig.filterAdvanced.ComandanteMultiple = entity.ComandanteMultiple;
    this.dataListConfig.filterAdvanced.CapitanFilter = entity.CapitanFilter;
    this.dataListConfig.filterAdvanced.Capitan = entity.Capitan;
    this.dataListConfig.filterAdvanced.CapitanMultiple = entity.CapitanMultiple;
    this.dataListConfig.filterAdvanced.Primer_CapitanFilter = entity.Primer_CapitanFilter;
    this.dataListConfig.filterAdvanced.Primer_Capitan = entity.Primer_Capitan;
    this.dataListConfig.filterAdvanced.Primer_CapitanMultiple = entity.Primer_CapitanMultiple;
    this.dataListConfig.filterAdvanced.Segundo_CapitanFilter = entity.Segundo_CapitanFilter;
    this.dataListConfig.filterAdvanced.Segundo_Capitan = entity.Segundo_Capitan;
    this.dataListConfig.filterAdvanced.Segundo_CapitanMultiple = entity.Segundo_CapitanMultiple;
    this.dataListConfig.filterAdvanced.SobrecargoFilter = entity.SobrecargoFilter;
    this.dataListConfig.filterAdvanced.Sobrecargo = entity.Sobrecargo;
    this.dataListConfig.filterAdvanced.SobrecargoMultiple = entity.SobrecargoMultiple;
    this.dataListConfig.filterAdvanced.Administrador_del_VueloFilter = entity.Administrador_del_VueloFilter;
    this.dataListConfig.filterAdvanced.Administrador_del_Vuelo = entity.Administrador_del_Vuelo;
    this.dataListConfig.filterAdvanced.Administrador_del_VueloMultiple = entity.Administrador_del_VueloMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_VueloFilter = entity.Tipo_de_VueloFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Vuelo = entity.Tipo_de_Vuelo;
    this.dataListConfig.filterAdvanced.Tipo_de_VueloMultiple = entity.Tipo_de_VueloMultiple;
    this.dataListConfig.filterAdvanced.fromPasajeros_Adicionales = entity.fromPasajeros_Adicionales;
    this.dataListConfig.filterAdvanced.toPasajeros_Adicionales = entity.toPasajeros_Adicionales;
    this.dataListConfig.filterAdvanced.fromFecha_de_Salida = entity.fromFecha_de_Salida;
    this.dataListConfig.filterAdvanced.toFecha_de_Salida = entity.toFecha_de_Salida;
	this.dataListConfig.filterAdvanced.Hora_de_SalidaFilter = entity.Hora_de_SalidaFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Salida = entity.Hora_de_Salida;
    this.dataListConfig.filterAdvanced.fromFecha_de_Llegada = entity.fromFecha_de_Llegada;
    this.dataListConfig.filterAdvanced.toFecha_de_Llegada = entity.toFecha_de_Llegada;
	this.dataListConfig.filterAdvanced.Hora_de_LlegadaFilter = entity.Hora_de_LlegadaFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Llegada = entity.Hora_de_Llegada;
    this.dataListConfig.filterAdvanced.fromFecha_de_Despegue = entity.fromFecha_de_Despegue;
    this.dataListConfig.filterAdvanced.toFecha_de_Despegue = entity.toFecha_de_Despegue;
	this.dataListConfig.filterAdvanced.Hora_de_DespegueFilter = entity.Hora_de_DespegueFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Despegue = entity.Hora_de_Despegue;
    this.dataListConfig.filterAdvanced.fromFecha_de_Aterrizaje = entity.fromFecha_de_Aterrizaje;
    this.dataListConfig.filterAdvanced.toFecha_de_Aterrizaje = entity.toFecha_de_Aterrizaje;
	this.dataListConfig.filterAdvanced.Hora_de_AterrizajeFilter = entity.Hora_de_AterrizajeFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Aterrizaje = entity.Hora_de_Aterrizaje;
    this.dataListConfig.filterAdvanced.fromFecha_de_Salida_Local = entity.fromFecha_de_Salida_Local;
    this.dataListConfig.filterAdvanced.toFecha_de_Salida_Local = entity.toFecha_de_Salida_Local;
	this.dataListConfig.filterAdvanced.Hora_de_Salida_LocalFilter = entity.Hora_de_Salida_LocalFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Salida_Local = entity.Hora_de_Salida_Local;
    this.dataListConfig.filterAdvanced.fromFecha_de_Llegada_Local = entity.fromFecha_de_Llegada_Local;
    this.dataListConfig.filterAdvanced.toFecha_de_Llegada_Local = entity.toFecha_de_Llegada_Local;
	this.dataListConfig.filterAdvanced.Hora_de_Llegada_LocalFilter = entity.Hora_de_Llegada_LocalFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Llegada_Local = entity.Hora_de_Llegada_Local;
    this.dataListConfig.filterAdvanced.fromFecha_de_Despegue_Local = entity.fromFecha_de_Despegue_Local;
    this.dataListConfig.filterAdvanced.toFecha_de_Despegue_Local = entity.toFecha_de_Despegue_Local;
	this.dataListConfig.filterAdvanced.Hora_de_Despegue_LocalFilter = entity.Hora_de_Despegue_LocalFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Despegue_Local = entity.Hora_de_Despegue_Local;
    this.dataListConfig.filterAdvanced.fromFecha_de_Aterrizaje_Local = entity.fromFecha_de_Aterrizaje_Local;
    this.dataListConfig.filterAdvanced.toFecha_de_Aterrizaje_Local = entity.toFecha_de_Aterrizaje_Local;
	this.dataListConfig.filterAdvanced.Hora_de_Aterrizaje_LocalFilter = entity.Hora_de_Aterrizaje_LocalFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Aterrizaje_Local = entity.Hora_de_Aterrizaje_Local;
	this.dataListConfig.filterAdvanced.Tiempo_de_CalzoFilter = entity.Tiempo_de_CalzoFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Calzo = entity.Tiempo_de_Calzo;
	this.dataListConfig.filterAdvanced.Tiempo_de_VueloFilter = entity.Tiempo_de_VueloFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Vuelo = entity.Tiempo_de_Vuelo;
    this.dataListConfig.filterAdvanced.fromDistancia_en_Millas = entity.fromDistancia_en_Millas;
    this.dataListConfig.filterAdvanced.toDistancia_en_Millas = entity.toDistancia_en_Millas;
    this.dataListConfig.filterAdvanced.fromCombustible__Cargado = entity.fromCombustible__Cargado;
    this.dataListConfig.filterAdvanced.toCombustible__Cargado = entity.toCombustible__Cargado;
    this.dataListConfig.filterAdvanced.fromCombustible__Despegue = entity.fromCombustible__Despegue;
    this.dataListConfig.filterAdvanced.toCombustible__Despegue = entity.toCombustible__Despegue;
    this.dataListConfig.filterAdvanced.fromCombustible__Aterrizaje = entity.fromCombustible__Aterrizaje;
    this.dataListConfig.filterAdvanced.toCombustible__Aterrizaje = entity.toCombustible__Aterrizaje;
    this.dataListConfig.filterAdvanced.fromCombustible__Consumo = entity.fromCombustible__Consumo;
    this.dataListConfig.filterAdvanced.toCombustible__Consumo = entity.toCombustible__Consumo;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
	this.dataListConfig.filterAdvanced.Reportes_de_la_AeronaveFilter = entity.Reportes_de_la_AeronaveFilter;
	this.dataListConfig.filterAdvanced.Reportes_de_la_Aeronave = entity.Reportes_de_la_Aeronave;
    this.dataListConfig.filterAdvanced.fromTiempo_de_Espera_Paso = entity.fromTiempo_de_Espera_Paso;
    this.dataListConfig.filterAdvanced.toTiempo_de_Espera_Paso = entity.toTiempo_de_Espera_Paso;
	this.dataListConfig.filterAdvanced.Tiempo_de_EsperaFilter = entity.Tiempo_de_EsperaFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Espera = entity.Tiempo_de_Espera;
	this.dataListConfig.filterAdvanced.Tiempo_de_Espera_Con_CostoFilter = entity.Tiempo_de_Espera_Con_CostoFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Espera_Con_Costo = entity.Tiempo_de_Espera_Con_Costo;
	this.dataListConfig.filterAdvanced.Tiempo_de_Espera_Sin_CostoFilter = entity.Tiempo_de_Espera_Sin_CostoFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Espera_Sin_Costo = entity.Tiempo_de_Espera_Sin_Costo;
    this.dataListConfig.filterAdvanced.fromPernoctas = entity.fromPernoctas;
    this.dataListConfig.filterAdvanced.toPernoctas = entity.toPernoctas;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Ejecucion_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }
}
