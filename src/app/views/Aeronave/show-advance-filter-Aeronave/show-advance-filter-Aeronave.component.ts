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

import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Fabricante } from 'src/app/models/Fabricante';
import { FabricanteService } from 'src/app/api-services/Fabricante.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Origen_de_Aeronave } from 'src/app/models/Origen_de_Aeronave';
import { Origen_de_AeronaveService } from 'src/app/api-services/Origen_de_Aeronave.service';
import { Estatus_Aeronave } from 'src/app/models/Estatus_Aeronave';
import { Estatus_AeronaveService } from 'src/app/api-services/Estatus_Aeronave.service';
import { Nivel_de_Ruido } from 'src/app/models/Nivel_de_Ruido';
import { Nivel_de_RuidoService } from 'src/app/api-services/Nivel_de_Ruido.service';
import { Turbulencia_de_Estela } from 'src/app/models/Turbulencia_de_Estela';
import { Turbulencia_de_EstelaService } from 'src/app/api-services/Turbulencia_de_Estela.service';
import { Equipo_de_Navegacion } from 'src/app/models/Equipo_de_Navegacion';
import { Equipo_de_NavegacionService } from 'src/app/api-services/Equipo_de_Navegacion.service';
import { Tipo_de_Ala } from 'src/app/models/Tipo_de_Ala';
import { Tipo_de_AlaService } from 'src/app/api-services/Tipo_de_Ala.service';
import { Tipo_de_Bitacora_de_Aeronave } from 'src/app/models/Tipo_de_Bitacora_de_Aeronave';
import { Tipo_de_Bitacora_de_AeronaveService } from 'src/app/api-services/Tipo_de_Bitacora_de_Aeronave.service';


@Component({
  selector: 'app-show-advance-filter-Aeronave',
  templateUrl: './show-advance-filter-Aeronave.component.html',
  styleUrls: ['./show-advance-filter-Aeronave.component.scss']
})
export class ShowAdvanceFilterAeronaveComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Modelos: Modelos[] = [];
  public Propietarios: Propietarios[] = [];
  public Fabricantes: Fabricante[] = [];
  public Clientes: Cliente[] = [];
  public Origen_de_Aeronaves: Origen_de_Aeronave[] = [];
  public Estatuss: Estatus_Aeronave[] = [];
  public Nivel_de_ruidos: Nivel_de_Ruido[] = [];
  public Turbulencias: Turbulencia_de_Estela[] = [];
  public Equipo_de_navegacions: Equipo_de_Navegacion[] = [];
  public Tipo_de_Alas: Tipo_de_Ala[] = [];
  public Bitacoras: Tipo_de_Bitacora_de_Aeronave[] = [];

  public modeloss: Modelos;
  public propietarioss: Propietarios;
  public fabricantes: Fabricante;
  public clientes: Cliente;
  public origen_de_aeronaves: Origen_de_Aeronave;
  public estatus_aeronaves: Estatus_Aeronave;
  public nivel_de_ruidos: Nivel_de_Ruido;
  public turbulencia_de_estelas: Turbulencia_de_Estela;
  public equipo_de_navegacions: Equipo_de_Navegacion;
  public tipo_de_alas: Tipo_de_Ala;
  public tipo_de_bitacora_de_aeronaves: Tipo_de_Bitacora_de_Aeronave;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Matricula",
      "Modelo",
      "Propietario",
      "Fabricante",
      "Numero_de_Serie",
      "Cliente",
      "Ano_de_Fabricacion",
      "Origen_de_Aeronave",
      "Propia",
      "Estatus",
      "Operaciones",
      "Mantenimiento",
      "Capacidad_de_pasajeros",
      "Nivel_de_ruido",
      "Turbulencia",
      "Equipo_de_navegacion",
      "UHV",
      "VHF",
      "ELT",
      "Desierto",
      "Polar",
      "Selva",
      "Maritimo",
      "Chalecos_salvavidas",
      "Numero_de_lanchas_salvavidas",
      "Capacidad",
      "Color_de_la_aeronave",
      "Color_cubierta_de_los_botes",
      "Velocidad",
      "Tipo_de_Ala",
      "UPA",
      "UPA_MODELO",
      "UPA_SERIE",
      "Ciclos_iniciales",
      "Ciclos_actuales",
      "Horas_iniciales",
      "Horas_actuales",
      "Inicio_de_operaciones",
      "Bitacora",

    ],
    columns_filters: [
      "acciones_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Propietario_filtro",
      "Fabricante_filtro",
      "Numero_de_Serie_filtro",
      "Cliente_filtro",
      "Ano_de_Fabricacion_filtro",
      "Origen_de_Aeronave_filtro",
      "Propia_filtro",
      "Estatus_filtro",
      "Operaciones_filtro",
      "Mantenimiento_filtro",
      "Capacidad_de_pasajeros_filtro",
      "Nivel_de_ruido_filtro",
      "Turbulencia_filtro",
      "Equipo_de_navegacion_filtro",
      "UHV_filtro",
      "VHF_filtro",
      "ELT_filtro",
      "Desierto_filtro",
      "Polar_filtro",
      "Selva_filtro",
      "Maritimo_filtro",
      "Chalecos_salvavidas_filtro",
      "Numero_de_lanchas_salvavidas_filtro",
      "Capacidad_filtro",
      "Color_de_la_aeronave_filtro",
      "Color_cubierta_de_los_botes_filtro",
      "Velocidad_filtro",
      "Tipo_de_Ala_filtro",
      "UPA_filtro",
      "UPA_MODELO_filtro",
      "UPA_SERIE_filtro",
      "Ciclos_iniciales_filtro",
      "Ciclos_actuales_filtro",
      "Horas_iniciales_filtro",
      "Horas_actuales_filtro",
      "Inicio_de_operaciones_filtro",
      "Bitacora_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Matricula: "",
      Modelo: "",
      Propietario: "",
      Fabricante: "",
      Numero_de_Serie: "",
      Cliente: "",
      Ano_de_Fabricacion: "",
      Origen_de_Aeronave: "",
      Propia: "",
      Estatus: "",
      Operaciones: "",
      Mantenimiento: "",
      Capacidad_de_pasajeros: "",
      Nivel_de_ruido: "",
      Turbulencia: "",
      Equipo_de_navegacion: "",
      UHV: "",
      VHF: "",
      ELT: "",
      Desierto: "",
      Polar: "",
      Selva: "",
      Maritimo: "",
      Chalecos_salvavidas: "",
      Numero_de_lanchas_salvavidas: "",
      Capacidad: "",
      Color_de_la_aeronave: "",
      Color_cubierta_de_los_botes: "",
      Velocidad: "",
      Tipo_de_Ala: "",
      UPA: "",
      UPA_MODELO: "",
      UPA_SERIE: "",
      Ciclos_iniciales: "",
      Ciclos_actuales: "",
      Horas_iniciales: "",
      Horas_actuales: "",
      Inicio_de_operaciones: null,
      Bitacora: "",

    },
    filterAdvanced: {
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      FabricanteFilter: "",
      Fabricante: "",
      FabricanteMultiple: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      fromAno_de_Fabricacion: "",
      toAno_de_Fabricacion: "",
      Origen_de_AeronaveFilter: "",
      Origen_de_Aeronave: "",
      Origen_de_AeronaveMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromCapacidad_de_pasajeros: "",
      toCapacidad_de_pasajeros: "",
      Nivel_de_ruidoFilter: "",
      Nivel_de_ruido: "",
      Nivel_de_ruidoMultiple: "",
      TurbulenciaFilter: "",
      Turbulencia: "",
      TurbulenciaMultiple: "",
      Equipo_de_navegacionFilter: "",
      Equipo_de_navegacion: "",
      Equipo_de_navegacionMultiple: "",
      fromChalecos_salvavidas: "",
      toChalecos_salvavidas: "",
      fromNumero_de_lanchas_salvavidas: "",
      toNumero_de_lanchas_salvavidas: "",
      fromCapacidad: "",
      toCapacidad: "",
      fromVelocidad: "",
      toVelocidad: "",
      Tipo_de_AlaFilter: "",
      Tipo_de_Ala: "",
      Tipo_de_AlaMultiple: "",
      fromCiclos_iniciales: "",
      toCiclos_iniciales: "",
      fromCiclos_actuales: "",
      toCiclos_actuales: "",
      fromHoras_iniciales: "",
      toHoras_iniciales: "",
      fromHoras_actuales: "",
      toHoras_actuales: "",
      fromInicio_de_operaciones: "",
      toInicio_de_operaciones: "",
      BitacoraFilter: "",
      Bitacora: "",
      BitacoraMultiple: "",

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
    private modelosService: ModelosService,
    private propietariosService: PropietariosService,
    private fabricanteService: FabricanteService,
    private clienteService: ClienteService,
    private origen_de_aeronaveService: Origen_de_AeronaveService,
    private estatus_aeronaveService: Estatus_AeronaveService,
    private nivel_de_ruidoService: Nivel_de_RuidoService,
    private turbulencia_de_estelaService: Turbulencia_de_EstelaService,
    private equipo_de_navegacionService: Equipo_de_NavegacionService,
    private tipo_de_alaService: Tipo_de_AlaService,
    private tipo_de_bitacora_de_aeronaveService: Tipo_de_Bitacora_de_AeronaveService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      PropietarioFilter: [''],
      Propietario: [''],
      PropietarioMultiple: [''],
      FabricanteFilter: [''],
      Fabricante: [''],
      FabricanteMultiple: [''],
      ClienteFilter: [''],
      Cliente: [''],
      ClienteMultiple: [''],
      fromAno_de_Fabricacion: [''],
      toAno_de_Fabricacion: [''],
      Origen_de_AeronaveFilter: [''],
      Origen_de_Aeronave: [''],
      Origen_de_AeronaveMultiple: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromCapacidad_de_pasajeros: [''],
      toCapacidad_de_pasajeros: [''],
      Nivel_de_ruidoFilter: [''],
      Nivel_de_ruido: [''],
      Nivel_de_ruidoMultiple: [''],
      TurbulenciaFilter: [''],
      Turbulencia: [''],
      TurbulenciaMultiple: [''],
      Equipo_de_navegacionFilter: [''],
      Equipo_de_navegacion: [''],
      Equipo_de_navegacionMultiple: [''],
      fromChalecos_salvavidas: [''],
      toChalecos_salvavidas: [''],
      fromNumero_de_lanchas_salvavidas: [''],
      toNumero_de_lanchas_salvavidas: [''],
      fromCapacidad: [''],
      toCapacidad: [''],
      fromVelocidad: [''],
      toVelocidad: [''],
      Tipo_de_AlaFilter: [''],
      Tipo_de_Ala: [''],
      Tipo_de_AlaMultiple: [''],
      fromCiclos_iniciales: [''],
      toCiclos_iniciales: [''],
      fromCiclos_actuales: [''],
      toCiclos_actuales: [''],
      fromHoras_iniciales: [''],
      toHoras_iniciales: [''],
      fromHoras_actuales: [''],
      toHoras_actuales: [''],
      fromInicio_de_operaciones: [''],
      toInicio_de_operaciones: [''],
      BitacoraFilter: [''],
      Bitacora: [''],
      BitacoraMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Aeronave/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.propietariosService.getAll());
    observablesArray.push(this.fabricanteService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.origen_de_aeronaveService.getAll());
    observablesArray.push(this.estatus_aeronaveService.getAll());
    observablesArray.push(this.nivel_de_ruidoService.getAll());
    observablesArray.push(this.turbulencia_de_estelaService.getAll());
    observablesArray.push(this.equipo_de_navegacionService.getAll());
    observablesArray.push(this.tipo_de_alaService.getAll());
    observablesArray.push(this.tipo_de_bitacora_de_aeronaveService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,modeloss ,propietarioss ,fabricantes ,clientes ,origen_de_aeronaves ,estatus_aeronaves ,nivel_de_ruidos ,turbulencia_de_estelas ,equipo_de_navegacions ,tipo_de_alas ,tipo_de_bitacora_de_aeronaves ]) => {
		  this.modeloss = modeloss;
		  this.propietarioss = propietarioss;
		  this.fabricantes = fabricantes;
		  this.clientes = clientes;
		  this.origen_de_aeronaves = origen_de_aeronaves;
		  this.estatus_aeronaves = estatus_aeronaves;
		  this.nivel_de_ruidos = nivel_de_ruidos;
		  this.turbulencia_de_estelas = turbulencia_de_estelas;
		  this.equipo_de_navegacions = equipo_de_navegacions;
		  this.tipo_de_alas = tipo_de_alas;
		  this.tipo_de_bitacora_de_aeronaves = tipo_de_bitacora_de_aeronaves;
          

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
	this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
	this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.PropietarioFilter = entity.PropietarioFilter;
    this.dataListConfig.filterAdvanced.Propietario = entity.Propietario;
    this.dataListConfig.filterAdvanced.PropietarioMultiple = entity.PropietarioMultiple;
    this.dataListConfig.filterAdvanced.FabricanteFilter = entity.FabricanteFilter;
    this.dataListConfig.filterAdvanced.Fabricante = entity.Fabricante;
    this.dataListConfig.filterAdvanced.FabricanteMultiple = entity.FabricanteMultiple;
	this.dataListConfig.filterAdvanced.Numero_de_SerieFilter = entity.Numero_de_SerieFilter;
	this.dataListConfig.filterAdvanced.Numero_de_Serie = entity.Numero_de_Serie;
    this.dataListConfig.filterAdvanced.ClienteFilter = entity.ClienteFilter;
    this.dataListConfig.filterAdvanced.Cliente = entity.Cliente;
    this.dataListConfig.filterAdvanced.ClienteMultiple = entity.ClienteMultiple;
    this.dataListConfig.filterAdvanced.fromAno_de_Fabricacion = entity.fromAno_de_Fabricacion;
    this.dataListConfig.filterAdvanced.toAno_de_Fabricacion = entity.toAno_de_Fabricacion;
    this.dataListConfig.filterAdvanced.Origen_de_AeronaveFilter = entity.Origen_de_AeronaveFilter;
    this.dataListConfig.filterAdvanced.Origen_de_Aeronave = entity.Origen_de_Aeronave;
    this.dataListConfig.filterAdvanced.Origen_de_AeronaveMultiple = entity.Origen_de_AeronaveMultiple;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.fromCapacidad_de_pasajeros = entity.fromCapacidad_de_pasajeros;
    this.dataListConfig.filterAdvanced.toCapacidad_de_pasajeros = entity.toCapacidad_de_pasajeros;
    this.dataListConfig.filterAdvanced.Nivel_de_ruidoFilter = entity.Nivel_de_ruidoFilter;
    this.dataListConfig.filterAdvanced.Nivel_de_ruido = entity.Nivel_de_ruido;
    this.dataListConfig.filterAdvanced.Nivel_de_ruidoMultiple = entity.Nivel_de_ruidoMultiple;
    this.dataListConfig.filterAdvanced.TurbulenciaFilter = entity.TurbulenciaFilter;
    this.dataListConfig.filterAdvanced.Turbulencia = entity.Turbulencia;
    this.dataListConfig.filterAdvanced.TurbulenciaMultiple = entity.TurbulenciaMultiple;
    this.dataListConfig.filterAdvanced.Equipo_de_navegacionFilter = entity.Equipo_de_navegacionFilter;
    this.dataListConfig.filterAdvanced.Equipo_de_navegacion = entity.Equipo_de_navegacion;
    this.dataListConfig.filterAdvanced.Equipo_de_navegacionMultiple = entity.Equipo_de_navegacionMultiple;
    this.dataListConfig.filterAdvanced.fromChalecos_salvavidas = entity.fromChalecos_salvavidas;
    this.dataListConfig.filterAdvanced.toChalecos_salvavidas = entity.toChalecos_salvavidas;
    this.dataListConfig.filterAdvanced.fromNumero_de_lanchas_salvavidas = entity.fromNumero_de_lanchas_salvavidas;
    this.dataListConfig.filterAdvanced.toNumero_de_lanchas_salvavidas = entity.toNumero_de_lanchas_salvavidas;
    this.dataListConfig.filterAdvanced.fromCapacidad = entity.fromCapacidad;
    this.dataListConfig.filterAdvanced.toCapacidad = entity.toCapacidad;
	this.dataListConfig.filterAdvanced.Color_de_la_aeronaveFilter = entity.Color_de_la_aeronaveFilter;
	this.dataListConfig.filterAdvanced.Color_de_la_aeronave = entity.Color_de_la_aeronave;
	this.dataListConfig.filterAdvanced.Color_cubierta_de_los_botesFilter = entity.Color_cubierta_de_los_botesFilter;
	this.dataListConfig.filterAdvanced.Color_cubierta_de_los_botes = entity.Color_cubierta_de_los_botes;
    this.dataListConfig.filterAdvanced.fromVelocidad = entity.fromVelocidad;
    this.dataListConfig.filterAdvanced.toVelocidad = entity.toVelocidad;
    this.dataListConfig.filterAdvanced.Tipo_de_AlaFilter = entity.Tipo_de_AlaFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Ala = entity.Tipo_de_Ala;
    this.dataListConfig.filterAdvanced.Tipo_de_AlaMultiple = entity.Tipo_de_AlaMultiple;
	this.dataListConfig.filterAdvanced.UPAFilter = entity.UPAFilter;
	this.dataListConfig.filterAdvanced.UPA = entity.UPA;
	this.dataListConfig.filterAdvanced.UPA_MODELOFilter = entity.UPA_MODELOFilter;
	this.dataListConfig.filterAdvanced.UPA_MODELO = entity.UPA_MODELO;
	this.dataListConfig.filterAdvanced.UPA_SERIEFilter = entity.UPA_SERIEFilter;
	this.dataListConfig.filterAdvanced.UPA_SERIE = entity.UPA_SERIE;
    this.dataListConfig.filterAdvanced.fromCiclos_iniciales = entity.fromCiclos_iniciales;
    this.dataListConfig.filterAdvanced.toCiclos_iniciales = entity.toCiclos_iniciales;
    this.dataListConfig.filterAdvanced.fromCiclos_actuales = entity.fromCiclos_actuales;
    this.dataListConfig.filterAdvanced.toCiclos_actuales = entity.toCiclos_actuales;
	this.dataListConfig.filterAdvanced.Horas_inicialesFilter = entity.Horas_inicialesFilter;
	this.dataListConfig.filterAdvanced.Horas_iniciales = entity.Horas_iniciales;
	this.dataListConfig.filterAdvanced.Horas_actualesFilter = entity.Horas_actualesFilter;
	this.dataListConfig.filterAdvanced.Horas_actuales = entity.Horas_actuales;
    this.dataListConfig.filterAdvanced.fromInicio_de_operaciones = entity.fromInicio_de_operaciones;
    this.dataListConfig.filterAdvanced.toInicio_de_operaciones = entity.toInicio_de_operaciones;
    this.dataListConfig.filterAdvanced.BitacoraFilter = entity.BitacoraFilter;
    this.dataListConfig.filterAdvanced.Bitacora = entity.Bitacora;
    this.dataListConfig.filterAdvanced.BitacoraMultiple = entity.BitacoraMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Aeronave/list'], { state: { data: this.dataListConfig } });
  }
}
