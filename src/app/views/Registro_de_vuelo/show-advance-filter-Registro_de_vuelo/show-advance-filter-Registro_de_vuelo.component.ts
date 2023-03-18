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
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Tipo_de_vuelo } from 'src/app/models/Tipo_de_vuelo';
import { Tipo_de_vueloService } from 'src/app/api-services/Tipo_de_vuelo.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';


@Component({
  selector: 'app-show-advance-filter-Registro_de_vuelo',
  templateUrl: './show-advance-filter-Registro_de_vuelo.component.html',
  styleUrls: ['./show-advance-filter-Registro_de_vuelo.component.scss']
})
export class ShowAdvanceFilterRegistro_de_vueloComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public No_Vuelos: Solicitud_de_Vuelo[] = [];
  public Matriculas: Aeronave[] = [];
  public Clientes: Cliente[] = [];
  public Solicitantes: Spartan_User[] = [];
  public Tipo_de_vuelos: Tipo_de_vuelo[] = [];
  public Origens: Aeropuertos[] = [];
  public Destinos: Aeropuertos[] = [];

  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public aeronaves: Aeronave;
  public clientes: Cliente;
  public spartan_users: Spartan_User;
  public tipo_de_vuelos: Tipo_de_vuelo;
  public aeropuertoss: Aeropuertos;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No_Vuelo",
      "Matricula",
      "Fecha_de_solicitud",
      "Cliente",
      "Solicitante",
      "Tipo_de_vuelo",
      "Numero_de_Tramo",
      "Origen",
      "Destino",
      "Fecha_de_salida",
      "Hora_de_salida",
      "Cantidad_de_Pasajeros",
      "Ultimo_Tramo_notificar",
      "Comisariato",
      "Notas_de_vuelo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No_Vuelo_filtro",
      "Matricula_filtro",
      "Fecha_de_solicitud_filtro",
      "Cliente_filtro",
      "Solicitante_filtro",
      "Tipo_de_vuelo_filtro",
      "Numero_de_Tramo_filtro",
      "Origen_filtro",
      "Destino_filtro",
      "Fecha_de_salida_filtro",
      "Hora_de_salida_filtro",
      "Cantidad_de_Pasajeros_filtro",
      "Ultimo_Tramo_notificar_filtro",
      "Comisariato_filtro",
      "Notas_de_vuelo_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No_Vuelo: "",
      Matricula: "",
      Fecha_de_solicitud: null,
      Cliente: "",
      Solicitante: "",
      Tipo_de_vuelo: "",
      Numero_de_Tramo: "",
      Origen: "",
      Destino: "",
      Fecha_de_salida: null,
      Hora_de_salida: "",
      Cantidad_de_Pasajeros: "",
      Ultimo_Tramo_notificar: "",
      Comisariato: "",
      Notas_de_vuelo: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      No_VueloFilter: "",
      No_Vuelo: "",
      No_VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromFecha_de_solicitud: "",
      toFecha_de_solicitud: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      Tipo_de_vueloFilter: "",
      Tipo_de_vuelo: "",
      Tipo_de_vueloMultiple: "",
      OrigenFilter: "",
      Origen: "",
      OrigenMultiple: "",
      DestinoFilter: "",
      Destino: "",
      DestinoMultiple: "",
      fromFecha_de_salida: "",
      toFecha_de_salida: "",
      fromHora_de_salida: "",
      toHora_de_salida: "",
      fromCantidad_de_Pasajeros: "",
      toCantidad_de_Pasajeros: "",

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
    private clienteService: ClienteService,
    private spartan_userService: Spartan_UserService,
    private tipo_de_vueloService: Tipo_de_vueloService,
    private aeropuertosService: AeropuertosService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      No_VueloFilter: [''],
      No_Vuelo: [''],
      No_VueloMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      fromFecha_de_solicitud: [''],
      toFecha_de_solicitud: [''],
      ClienteFilter: [''],
      Cliente: [''],
      ClienteMultiple: [''],
      SolicitanteFilter: [''],
      Solicitante: [''],
      SolicitanteMultiple: [''],
      Tipo_de_vueloFilter: [''],
      Tipo_de_vuelo: [''],
      Tipo_de_vueloMultiple: [''],
      OrigenFilter: [''],
      Origen: [''],
      OrigenMultiple: [''],
      DestinoFilter: [''],
      Destino: [''],
      DestinoMultiple: [''],
      fromFecha_de_salida: [''],
      toFecha_de_salida: [''],
      fromHora_de_salida: [''],
      toHora_de_salida: [''],
      fromCantidad_de_Pasajeros: [''],
      toCantidad_de_Pasajeros: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Registro_de_vuelo/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.tipo_de_vueloService.getAll());
    observablesArray.push(this.aeropuertosService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_vuelos ,aeronaves ,clientes ,spartan_users ,tipo_de_vuelos ,aeropuertoss ]) => {
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.aeronaves = aeronaves;
		  this.clientes = clientes;
		  this.spartan_users = spartan_users;
		  this.tipo_de_vuelos = tipo_de_vuelos;
		  this.aeropuertoss = aeropuertoss;
          

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
    this.dataListConfig.filterAdvanced.No_VueloFilter = entity.No_VueloFilter;
    this.dataListConfig.filterAdvanced.No_Vuelo = entity.No_Vuelo;
    this.dataListConfig.filterAdvanced.No_VueloMultiple = entity.No_VueloMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_solicitud = entity.fromFecha_de_solicitud;
    this.dataListConfig.filterAdvanced.toFecha_de_solicitud = entity.toFecha_de_solicitud;
    this.dataListConfig.filterAdvanced.ClienteFilter = entity.ClienteFilter;
    this.dataListConfig.filterAdvanced.Cliente = entity.Cliente;
    this.dataListConfig.filterAdvanced.ClienteMultiple = entity.ClienteMultiple;
    this.dataListConfig.filterAdvanced.SolicitanteFilter = entity.SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Solicitante = entity.Solicitante;
    this.dataListConfig.filterAdvanced.SolicitanteMultiple = entity.SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_vueloFilter = entity.Tipo_de_vueloFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_vuelo = entity.Tipo_de_vuelo;
    this.dataListConfig.filterAdvanced.Tipo_de_vueloMultiple = entity.Tipo_de_vueloMultiple;
	this.dataListConfig.filterAdvanced.Numero_de_TramoFilter = entity.Numero_de_TramoFilter;
	this.dataListConfig.filterAdvanced.Numero_de_Tramo = entity.Numero_de_Tramo;
    this.dataListConfig.filterAdvanced.OrigenFilter = entity.OrigenFilter;
    this.dataListConfig.filterAdvanced.Origen = entity.Origen;
    this.dataListConfig.filterAdvanced.OrigenMultiple = entity.OrigenMultiple;
    this.dataListConfig.filterAdvanced.DestinoFilter = entity.DestinoFilter;
    this.dataListConfig.filterAdvanced.Destino = entity.Destino;
    this.dataListConfig.filterAdvanced.DestinoMultiple = entity.DestinoMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_salida = entity.fromFecha_de_salida;
    this.dataListConfig.filterAdvanced.toFecha_de_salida = entity.toFecha_de_salida;
	this.dataListConfig.filterAdvanced.Hora_de_salidaFilter = entity.Hora_de_salidaFilter;
	this.dataListConfig.filterAdvanced.Hora_de_salida = entity.Hora_de_salida;
    this.dataListConfig.filterAdvanced.fromCantidad_de_Pasajeros = entity.fromCantidad_de_Pasajeros;
    this.dataListConfig.filterAdvanced.toCantidad_de_Pasajeros = entity.toCantidad_de_Pasajeros;
	this.dataListConfig.filterAdvanced.ComisariatoFilter = entity.ComisariatoFilter;
	this.dataListConfig.filterAdvanced.Comisariato = entity.Comisariato;
	this.dataListConfig.filterAdvanced.Notas_de_vueloFilter = entity.Notas_de_vueloFilter;
	this.dataListConfig.filterAdvanced.Notas_de_vuelo = entity.Notas_de_vuelo;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Registro_de_vuelo/list'], { state: { data: this.dataListConfig } });
  }
}
