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
import { Tipo_de_Grupo } from 'src/app/models/Tipo_de_Grupo';
import { Tipo_de_GrupoService } from 'src/app/api-services/Tipo_de_Grupo.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Pasajeros } from 'src/app/models/Pasajeros';
import { PasajerosService } from 'src/app/api-services/Pasajeros.service';
import { Tripulacion } from 'src/app/models/Tripulacion';
import { TripulacionService } from 'src/app/api-services/Tripulacion.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';


@Component({
  selector: 'app-show-advance-filter-Filtros_de_reportes',
  templateUrl: './show-advance-filter-Filtros_de_reportes.component.html',
  styleUrls: ['./show-advance-filter-Filtros_de_reportes.component.scss']
})
export class ShowAdvanceFilterFiltros_de_reportesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Aeronavess: Aeronave[] = [];
  public Mostrar_Aeronaves: Tipo_de_Grupo[] = [];
  public Clientess: Cliente[] = [];
  public Mostrar_Clientes: Tipo_de_Grupo[] = [];
  public Pasajeross: Pasajeros[] = [];
  public Mostrar_Pasajeros: Tipo_de_Grupo[] = [];
  public Pilotoss: Tripulacion[] = [];
  public Mostrar_Pilotos: Tipo_de_Grupo[] = [];
  public Aeropuertos: Aeropuertos[] = [];
  public Aeropuerto_Destinos: Aeropuertos[] = [];

  public aeronaves: Aeronave;
  public tipo_de_grupos: Tipo_de_Grupo;
  public clientes: Cliente;
  public pasajeross: Pasajeros;
  public tripulacions: Tripulacion;
  public aeropuertoss: Aeropuertos;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha",
      "Aeronaves",
      "Imprimir_solo_aeronaves_activas",
      "Mostrar_Aeronave",
      "Clientes",
      "Imprimir_solo_clientes_activos",
      "Mostrar_Cliente",
      "Pasajeros",
      "Imprimir_solo_pasajeros_activos",
      "Mostrar_Pasajero",
      "Pilotos",
      "Imprimir_solo_pilotos_activos",
      "Mostrar_Piloto",
      "Vuelos_como_capitan_o_primer_oficial",
      "Aeropuerto",
      "Aeropuerto_Destino",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_filtro",
      "Aeronaves_filtro",
      "Imprimir_solo_aeronaves_activas_filtro",
      "Mostrar_Aeronave_filtro",
      "Clientes_filtro",
      "Imprimir_solo_clientes_activos_filtro",
      "Mostrar_Cliente_filtro",
      "Pasajeros_filtro",
      "Imprimir_solo_pasajeros_activos_filtro",
      "Mostrar_Pasajero_filtro",
      "Pilotos_filtro",
      "Imprimir_solo_pilotos_activos_filtro",
      "Mostrar_Piloto_filtro",
      "Vuelos_como_capitan_o_primer_oficial_filtro",
      "Aeropuerto_filtro",
      "Aeropuerto_Destino_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha: null,
      Aeronaves: "",
      Imprimir_solo_aeronaves_activas: "",
      Mostrar_Aeronave: "",
      Clientes: "",
      Imprimir_solo_clientes_activos: "",
      Mostrar_Cliente: "",
      Pasajeros: "",
      Imprimir_solo_pasajeros_activos: "",
      Mostrar_Pasajero: "",
      Pilotos: "",
      Imprimir_solo_pilotos_activos: "",
      Mostrar_Piloto: "",
      Vuelos_como_capitan_o_primer_oficial: "",
      Aeropuerto: "",
      Aeropuerto_Destino: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha: "",
      toFecha: "",
      AeronavesFilter: "",
      Aeronaves: "",
      AeronavesMultiple: "",
      Mostrar_AeronaveFilter: "",
      Mostrar_Aeronave: "",
      Mostrar_AeronaveMultiple: "",
      ClientesFilter: "",
      Clientes: "",
      ClientesMultiple: "",
      Mostrar_ClienteFilter: "",
      Mostrar_Cliente: "",
      Mostrar_ClienteMultiple: "",
      PasajerosFilter: "",
      Pasajeros: "",
      PasajerosMultiple: "",
      Mostrar_PasajeroFilter: "",
      Mostrar_Pasajero: "",
      Mostrar_PasajeroMultiple: "",
      PilotosFilter: "",
      Pilotos: "",
      PilotosMultiple: "",
      Mostrar_PilotoFilter: "",
      Mostrar_Piloto: "",
      Mostrar_PilotoMultiple: "",
      AeropuertoFilter: "",
      Aeropuerto: "",
      AeropuertoMultiple: "",
      Aeropuerto_DestinoFilter: "",
      Aeropuerto_Destino: "",
      Aeropuerto_DestinoMultiple: "",

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
    private tipo_de_grupoService: Tipo_de_GrupoService,
    private clienteService: ClienteService,
    private pasajerosService: PasajerosService,
    private tripulacionService: TripulacionService,
    private aeropuertosService: AeropuertosService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFecha: [''],
      toFecha: [''],
      AeronavesFilter: [''],
      Aeronaves: [''],
      AeronavesMultiple: [''],
      Mostrar_AeronaveFilter: [''],
      Mostrar_Aeronave: [''],
      Mostrar_AeronaveMultiple: [''],
      ClientesFilter: [''],
      Clientes: [''],
      ClientesMultiple: [''],
      Mostrar_ClienteFilter: [''],
      Mostrar_Cliente: [''],
      Mostrar_ClienteMultiple: [''],
      PasajerosFilter: [''],
      Pasajeros: [''],
      PasajerosMultiple: [''],
      Mostrar_PasajeroFilter: [''],
      Mostrar_Pasajero: [''],
      Mostrar_PasajeroMultiple: [''],
      PilotosFilter: [''],
      Pilotos: [''],
      PilotosMultiple: [''],
      Mostrar_PilotoFilter: [''],
      Mostrar_Piloto: [''],
      Mostrar_PilotoMultiple: [''],
      AeropuertoFilter: [''],
      Aeropuerto: [''],
      AeropuertoMultiple: [''],
      Aeropuerto_DestinoFilter: [''],
      Aeropuerto_Destino: [''],
      Aeropuerto_DestinoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Filtros_de_reportes/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.tipo_de_grupoService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.pasajerosService.getAll());
    observablesArray.push(this.tripulacionService.getAll());
    observablesArray.push(this.aeropuertosService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeronaves ,tipo_de_grupos ,clientes ,pasajeross ,tripulacions ,aeropuertoss ]) => {
		  this.aeronaves = aeronaves;
		  this.tipo_de_grupos = tipo_de_grupos;
		  this.clientes = clientes;
		  this.pasajeross = pasajeross;
		  this.tripulacions = tripulacions;
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
    this.dataListConfig.filterAdvanced.fromFecha = entity.fromFecha;
    this.dataListConfig.filterAdvanced.toFecha = entity.toFecha;
    this.dataListConfig.filterAdvanced.AeronavesFilter = entity.AeronavesFilter;
    this.dataListConfig.filterAdvanced.Aeronaves = entity.Aeronaves;
    this.dataListConfig.filterAdvanced.AeronavesMultiple = entity.AeronavesMultiple;
    this.dataListConfig.filterAdvanced.Mostrar_AeronaveFilter = entity.Mostrar_AeronaveFilter;
    this.dataListConfig.filterAdvanced.Mostrar_Aeronave = entity.Mostrar_Aeronave;
    this.dataListConfig.filterAdvanced.Mostrar_AeronaveMultiple = entity.Mostrar_AeronaveMultiple;
    this.dataListConfig.filterAdvanced.ClientesFilter = entity.ClientesFilter;
    this.dataListConfig.filterAdvanced.Clientes = entity.Clientes;
    this.dataListConfig.filterAdvanced.ClientesMultiple = entity.ClientesMultiple;
    this.dataListConfig.filterAdvanced.Mostrar_ClienteFilter = entity.Mostrar_ClienteFilter;
    this.dataListConfig.filterAdvanced.Mostrar_Cliente = entity.Mostrar_Cliente;
    this.dataListConfig.filterAdvanced.Mostrar_ClienteMultiple = entity.Mostrar_ClienteMultiple;
    this.dataListConfig.filterAdvanced.PasajerosFilter = entity.PasajerosFilter;
    this.dataListConfig.filterAdvanced.Pasajeros = entity.Pasajeros;
    this.dataListConfig.filterAdvanced.PasajerosMultiple = entity.PasajerosMultiple;
    this.dataListConfig.filterAdvanced.Mostrar_PasajeroFilter = entity.Mostrar_PasajeroFilter;
    this.dataListConfig.filterAdvanced.Mostrar_Pasajero = entity.Mostrar_Pasajero;
    this.dataListConfig.filterAdvanced.Mostrar_PasajeroMultiple = entity.Mostrar_PasajeroMultiple;
    this.dataListConfig.filterAdvanced.PilotosFilter = entity.PilotosFilter;
    this.dataListConfig.filterAdvanced.Pilotos = entity.Pilotos;
    this.dataListConfig.filterAdvanced.PilotosMultiple = entity.PilotosMultiple;
    this.dataListConfig.filterAdvanced.Mostrar_PilotoFilter = entity.Mostrar_PilotoFilter;
    this.dataListConfig.filterAdvanced.Mostrar_Piloto = entity.Mostrar_Piloto;
    this.dataListConfig.filterAdvanced.Mostrar_PilotoMultiple = entity.Mostrar_PilotoMultiple;
    this.dataListConfig.filterAdvanced.AeropuertoFilter = entity.AeropuertoFilter;
    this.dataListConfig.filterAdvanced.Aeropuerto = entity.Aeropuerto;
    this.dataListConfig.filterAdvanced.AeropuertoMultiple = entity.AeropuertoMultiple;
    this.dataListConfig.filterAdvanced.Aeropuerto_DestinoFilter = entity.Aeropuerto_DestinoFilter;
    this.dataListConfig.filterAdvanced.Aeropuerto_Destino = entity.Aeropuerto_Destino;
    this.dataListConfig.filterAdvanced.Aeropuerto_DestinoMultiple = entity.Aeropuerto_DestinoMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Filtros_de_reportes/list'], { state: { data: this.dataListConfig } });
  }
}
