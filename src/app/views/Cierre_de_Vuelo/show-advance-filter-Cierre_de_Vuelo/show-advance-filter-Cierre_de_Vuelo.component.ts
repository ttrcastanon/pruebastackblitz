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
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';


@Component({
  selector: 'app-show-advance-filter-Cierre_de_Vuelo',
  templateUrl: './show-advance-filter-Cierre_de_Vuelo.component.html',
  styleUrls: ['./show-advance-filter-Cierre_de_Vuelo.component.scss']
})
export class ShowAdvanceFilterCierre_de_VueloComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Numero_de_Vuelos: Solicitud_de_Vuelo[] = [];
  public Matriculas: Aeronave[] = [];
  public Tramo_de_Vuelos: Registro_de_vuelo[] = [];
  public Origens: Aeropuertos[] = [];
  public Destinos: Aeropuertos[] = [];
  public cerrar_vuelos: Respuesta[] = [];

  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public aeronaves: Aeronave;
  public registro_de_vuelos: Registro_de_vuelo;
  public aeropuertoss: Aeropuertos;
  public respuestas: Respuesta;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Numero_de_Vuelo",
      "Matricula",
      "Solicitud",
      "Tramo_de_Vuelo",
      "Origen",
      "Destino",
      "Fecha_Salida",
      "Hora_Salida",
      "Fecha_Despegue",
      "Hora_Despegue",
      "Fecha_Aterrizaje",
      "Hora_Aterrizaje",
      "Fecha_Llegada",
      "Hora_Llegada",
      "Pasajeros_Adicionales",
      "Combustible_Inicial",
      "Cumbustible_Final_Consumido",
      "Combustible_Total_Consumido",
      "Notas_de_Tramo",
      "cerrar_vuelo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Numero_de_Vuelo_filtro",
      "Matricula_filtro",
      "Solicitud_filtro",
      "Tramo_de_Vuelo_filtro",
      "Origen_filtro",
      "Destino_filtro",
      "Fecha_Salida_filtro",
      "Hora_Salida_filtro",
      "Fecha_Despegue_filtro",
      "Hora_Despegue_filtro",
      "Fecha_Aterrizaje_filtro",
      "Hora_Aterrizaje_filtro",
      "Fecha_Llegada_filtro",
      "Hora_Llegada_filtro",
      "Pasajeros_Adicionales_filtro",
      "Combustible_Inicial_filtro",
      "Cumbustible_Final_Consumido_filtro",
      "Combustible_Total_Consumido_filtro",
      "Notas_de_Tramo_filtro",
      "cerrar_vuelo_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Numero_de_Vuelo: "",
      Matricula: "",
      Solicitud: null,
      Tramo_de_Vuelo: "",
      Origen: "",
      Destino: "",
      Fecha_Salida: null,
      Hora_Salida: "",
      Fecha_Despegue: null,
      Hora_Despegue: "",
      Fecha_Aterrizaje: null,
      Hora_Aterrizaje: "",
      Fecha_Llegada: null,
      Hora_Llegada: "",
      Pasajeros_Adicionales: "",
      Combustible_Inicial: "",
      Cumbustible_Final_Consumido: "",
      Combustible_Total_Consumido: "",
      Notas_de_Tramo: "",
      cerrar_vuelo: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Numero_de_VueloFilter: "",
      Numero_de_Vuelo: "",
      Numero_de_VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromSolicitud: "",
      toSolicitud: "",
      Tramo_de_VueloFilter: "",
      Tramo_de_Vuelo: "",
      Tramo_de_VueloMultiple: "",
      OrigenFilter: "",
      Origen: "",
      OrigenMultiple: "",
      DestinoFilter: "",
      Destino: "",
      DestinoMultiple: "",
      fromFecha_Salida: "",
      toFecha_Salida: "",
      fromHora_Salida: "",
      toHora_Salida: "",
      fromFecha_Despegue: "",
      toFecha_Despegue: "",
      fromHora_Despegue: "",
      toHora_Despegue: "",
      fromFecha_Aterrizaje: "",
      toFecha_Aterrizaje: "",
      fromHora_Aterrizaje: "",
      toHora_Aterrizaje: "",
      fromFecha_Llegada: "",
      toFecha_Llegada: "",
      fromHora_Llegada: "",
      toHora_Llegada: "",
      fromPasajeros_Adicionales: "",
      toPasajeros_Adicionales: "",
      fromCombustible_Inicial: "",
      toCombustible_Inicial: "",
      fromCumbustible_Final_Consumido: "",
      toCumbustible_Final_Consumido: "",
      fromCombustible_Total_Consumido: "",
      toCombustible_Total_Consumido: "",
      cerrar_vueloFilter: "",
      cerrar_vuelo: "",
      cerrar_vueloMultiple: "",

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
    private aeronaveService: AeronaveService,
    private registro_de_vueloService: Registro_de_vueloService,
    private aeropuertosService: AeropuertosService,
    private respuestaService: RespuestaService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Numero_de_VueloFilter: [''],
      Numero_de_Vuelo: [''],
      Numero_de_VueloMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      fromSolicitud: [''],
      toSolicitud: [''],
      Tramo_de_VueloFilter: [''],
      Tramo_de_Vuelo: [''],
      Tramo_de_VueloMultiple: [''],
      OrigenFilter: [''],
      Origen: [''],
      OrigenMultiple: [''],
      DestinoFilter: [''],
      Destino: [''],
      DestinoMultiple: [''],
      fromFecha_Salida: [''],
      toFecha_Salida: [''],
      fromHora_Salida: [''],
      toHora_Salida: [''],
      fromFecha_Despegue: [''],
      toFecha_Despegue: [''],
      fromHora_Despegue: [''],
      toHora_Despegue: [''],
      fromFecha_Aterrizaje: [''],
      toFecha_Aterrizaje: [''],
      fromHora_Aterrizaje: [''],
      toHora_Aterrizaje: [''],
      fromFecha_Llegada: [''],
      toFecha_Llegada: [''],
      fromHora_Llegada: [''],
      toHora_Llegada: [''],
      fromPasajeros_Adicionales: [''],
      toPasajeros_Adicionales: [''],
      cerrar_vueloFilter: [''],
      cerrar_vuelo: [''],
      cerrar_vueloMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Cierre_de_Vuelo/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.registro_de_vueloService.getAll());
    observablesArray.push(this.aeropuertosService.getAll());
    observablesArray.push(this.respuestaService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_vuelos ,aeronaves ,registro_de_vuelos ,aeropuertoss ,respuestas ]) => {
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.aeronaves = aeronaves;
		  this.registro_de_vuelos = registro_de_vuelos;
		  this.aeropuertoss = aeropuertoss;
		  this.respuestas = respuestas;
          

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
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.fromSolicitud = entity.fromSolicitud;
    this.dataListConfig.filterAdvanced.toSolicitud = entity.toSolicitud;
    this.dataListConfig.filterAdvanced.Tramo_de_VueloFilter = entity.Tramo_de_VueloFilter;
    this.dataListConfig.filterAdvanced.Tramo_de_Vuelo = entity.Tramo_de_Vuelo;
    this.dataListConfig.filterAdvanced.Tramo_de_VueloMultiple = entity.Tramo_de_VueloMultiple;
    this.dataListConfig.filterAdvanced.OrigenFilter = entity.OrigenFilter;
    this.dataListConfig.filterAdvanced.Origen = entity.Origen;
    this.dataListConfig.filterAdvanced.OrigenMultiple = entity.OrigenMultiple;
    this.dataListConfig.filterAdvanced.DestinoFilter = entity.DestinoFilter;
    this.dataListConfig.filterAdvanced.Destino = entity.Destino;
    this.dataListConfig.filterAdvanced.DestinoMultiple = entity.DestinoMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_Salida = entity.fromFecha_Salida;
    this.dataListConfig.filterAdvanced.toFecha_Salida = entity.toFecha_Salida;
	this.dataListConfig.filterAdvanced.Hora_SalidaFilter = entity.Hora_SalidaFilter;
	this.dataListConfig.filterAdvanced.Hora_Salida = entity.Hora_Salida;
    this.dataListConfig.filterAdvanced.fromFecha_Despegue = entity.fromFecha_Despegue;
    this.dataListConfig.filterAdvanced.toFecha_Despegue = entity.toFecha_Despegue;
	this.dataListConfig.filterAdvanced.Hora_DespegueFilter = entity.Hora_DespegueFilter;
	this.dataListConfig.filterAdvanced.Hora_Despegue = entity.Hora_Despegue;
    this.dataListConfig.filterAdvanced.fromFecha_Aterrizaje = entity.fromFecha_Aterrizaje;
    this.dataListConfig.filterAdvanced.toFecha_Aterrizaje = entity.toFecha_Aterrizaje;
	this.dataListConfig.filterAdvanced.Hora_AterrizajeFilter = entity.Hora_AterrizajeFilter;
	this.dataListConfig.filterAdvanced.Hora_Aterrizaje = entity.Hora_Aterrizaje;
    this.dataListConfig.filterAdvanced.fromFecha_Llegada = entity.fromFecha_Llegada;
    this.dataListConfig.filterAdvanced.toFecha_Llegada = entity.toFecha_Llegada;
	this.dataListConfig.filterAdvanced.Hora_LlegadaFilter = entity.Hora_LlegadaFilter;
	this.dataListConfig.filterAdvanced.Hora_Llegada = entity.Hora_Llegada;
    this.dataListConfig.filterAdvanced.fromPasajeros_Adicionales = entity.fromPasajeros_Adicionales;
    this.dataListConfig.filterAdvanced.toPasajeros_Adicionales = entity.toPasajeros_Adicionales;
    this.dataListConfig.filterAdvanced.fromCombustible_Inicial = entity.fromCombustible_Inicial;
    this.dataListConfig.filterAdvanced.toCombustible_Inicial = entity.toCombustible_Inicial;
    this.dataListConfig.filterAdvanced.fromCumbustible_Final_Consumido = entity.fromCumbustible_Final_Consumido;
    this.dataListConfig.filterAdvanced.toCumbustible_Final_Consumido = entity.toCumbustible_Final_Consumido;
    this.dataListConfig.filterAdvanced.fromCombustible_Total_Consumido = entity.fromCombustible_Total_Consumido;
    this.dataListConfig.filterAdvanced.toCombustible_Total_Consumido = entity.toCombustible_Total_Consumido;
	this.dataListConfig.filterAdvanced.Notas_de_TramoFilter = entity.Notas_de_TramoFilter;
	this.dataListConfig.filterAdvanced.Notas_de_Tramo = entity.Notas_de_Tramo;
    this.dataListConfig.filterAdvanced.cerrar_vueloFilter = entity.cerrar_vueloFilter;
    this.dataListConfig.filterAdvanced.cerrar_vuelo = entity.cerrar_vuelo;
    this.dataListConfig.filterAdvanced.cerrar_vueloMultiple = entity.cerrar_vueloMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Cierre_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }
}
