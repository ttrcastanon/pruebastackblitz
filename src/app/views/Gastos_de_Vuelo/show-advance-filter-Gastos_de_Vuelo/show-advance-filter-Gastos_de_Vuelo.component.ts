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

import { Tipo_de_Ingreso_de_Gasto } from 'src/app/models/Tipo_de_Ingreso_de_Gasto';
import { Tipo_de_Ingreso_de_GastoService } from 'src/app/api-services/Tipo_de_Ingreso_de_Gasto.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Estatus_de_Gastos_de_Vuelo } from 'src/app/models/Estatus_de_Gastos_de_Vuelo';
import { Estatus_de_Gastos_de_VueloService } from 'src/app/api-services/Estatus_de_Gastos_de_Vuelo.service';


@Component({
  selector: 'app-show-advance-filter-Gastos_de_Vuelo',
  templateUrl: './show-advance-filter-Gastos_de_Vuelo.component.html',
  styleUrls: ['./show-advance-filter-Gastos_de_Vuelo.component.scss']
})
export class ShowAdvanceFilterGastos_de_VueloComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Tipo_de_Ingreso_de_Gastos: Tipo_de_Ingreso_de_Gasto[] = [];
  public Orden_de_Trabajos: Orden_de_Trabajo[] = [];
  public Numero_de_Vuelos: Solicitud_de_Vuelo[] = [];
  public Matriculas: Aeronave[] = [];
  public Tramo_de_Vuelos: Registro_de_vuelo[] = [];
  public Salidas: Aeropuertos[] = [];
  public Destinos: Aeropuertos[] = [];
  public Empleados: Spartan_User[] = [];
  public Estatuss: Estatus_de_Gastos_de_Vuelo[] = [];

  public tipo_de_ingreso_de_gastos: Tipo_de_Ingreso_de_Gasto;
  public orden_de_trabajos: Orden_de_Trabajo;
  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public aeronaves: Aeronave;
  public registro_de_vuelos: Registro_de_vuelo;
  public aeropuertoss: Aeropuertos;
  public spartan_users: Spartan_User;
  public estatus_de_gastos_de_vuelos: Estatus_de_Gastos_de_Vuelo;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Registro",
      "Tipo_de_Ingreso_de_Gasto",
      "Orden_de_Trabajo",
      "Numero_de_Vuelo",
      "Matricula",
      "Tramo_de_Vuelo",
      "Salida",
      "Destino",
      "Empleado",
      "Estatus",
      "empleado_total_mxn",
      "empleado_total_usd",
      "empleado_total_eur",
      "empleado_total_libras",
      "empleado_total_cad",
      "aeronave_total_mxn",
      "aeronave_total_usd",
      "aeronave_total_eur",
      "aeronave_total_libras",
      "aeronave_total_cad",
      "Observaciones",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Registro_filtro",
      "Tipo_de_Ingreso_de_Gasto_filtro",
      "Orden_de_Trabajo_filtro",
      "Numero_de_Vuelo_filtro",
      "Matricula_filtro",
      "Tramo_de_Vuelo_filtro",
      "Salida_filtro",
      "Destino_filtro",
      "Empleado_filtro",
      "Estatus_filtro",
      "empleado_total_mxn_filtro",
      "empleado_total_usd_filtro",
      "empleado_total_eur_filtro",
      "empleado_total_libras_filtro",
      "empleado_total_cad_filtro",
      "aeronave_total_mxn_filtro",
      "aeronave_total_usd_filtro",
      "aeronave_total_eur_filtro",
      "aeronave_total_libras_filtro",
      "aeronave_total_cad_filtro",
      "Observaciones_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha_de_Registro: null,
      Tipo_de_Ingreso_de_Gasto: "",
      Orden_de_Trabajo: "",
      Numero_de_Vuelo: "",
      Matricula: "",
      Tramo_de_Vuelo: "",
      Salida: "",
      Destino: "",
      Empleado: "",
      Estatus: "",
      empleado_total_mxn: "",
      empleado_total_usd: "",
      empleado_total_eur: "",
      empleado_total_libras: "",
      empleado_total_cad: "",
      aeronave_total_mxn: "",
      aeronave_total_usd: "",
      aeronave_total_eur: "",
      aeronave_total_libras: "",
      aeronave_total_cad: "",
      Observaciones: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      Tipo_de_Ingreso_de_GastoFilter: "",
      Tipo_de_Ingreso_de_Gasto: "",
      Tipo_de_Ingreso_de_GastoMultiple: "",
      Orden_de_TrabajoFilter: "",
      Orden_de_Trabajo: "",
      Orden_de_TrabajoMultiple: "",
      Numero_de_VueloFilter: "",
      Numero_de_Vuelo: "",
      Numero_de_VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      Tramo_de_VueloFilter: "",
      Tramo_de_Vuelo: "",
      Tramo_de_VueloMultiple: "",
      SalidaFilter: "",
      Salida: "",
      SalidaMultiple: "",
      DestinoFilter: "",
      Destino: "",
      DestinoMultiple: "",
      EmpleadoFilter: "",
      Empleado: "",
      EmpleadoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromempleado_total_mxn: "",
      toempleado_total_mxn: "",
      fromempleado_total_usd: "",
      toempleado_total_usd: "",
      fromempleado_total_eur: "",
      toempleado_total_eur: "",
      fromempleado_total_libras: "",
      toempleado_total_libras: "",
      fromempleado_total_cad: "",
      toempleado_total_cad: "",
      fromaeronave_total_mxn: "",
      toaeronave_total_mxn: "",
      fromaeronave_total_usd: "",
      toaeronave_total_usd: "",
      fromaeronave_total_eur: "",
      toaeronave_total_eur: "",
      fromaeronave_total_libras: "",
      toaeronave_total_libras: "",
      fromaeronave_total_cad: "",
      toaeronave_total_cad: "",

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
    private tipo_de_ingreso_de_gastoService: Tipo_de_Ingreso_de_GastoService,
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private solicitud_de_vueloService: Solicitud_de_VueloService,
    private aeronaveService: AeronaveService,
    private registro_de_vueloService: Registro_de_vueloService,
    private aeropuertosService: AeropuertosService,
    private spartan_userService: Spartan_UserService,
    private estatus_de_gastos_de_vueloService: Estatus_de_Gastos_de_VueloService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFecha_de_Registro: [''],
      toFecha_de_Registro: [''],
      Tipo_de_Ingreso_de_GastoFilter: [''],
      Tipo_de_Ingreso_de_Gasto: [''],
      Tipo_de_Ingreso_de_GastoMultiple: [''],
      Orden_de_TrabajoFilter: [''],
      Orden_de_Trabajo: [''],
      Orden_de_TrabajoMultiple: [''],
      Numero_de_VueloFilter: [''],
      Numero_de_Vuelo: [''],
      Numero_de_VueloMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      Tramo_de_VueloFilter: [''],
      Tramo_de_Vuelo: [''],
      Tramo_de_VueloMultiple: [''],
      SalidaFilter: [''],
      Salida: [''],
      SalidaMultiple: [''],
      DestinoFilter: [''],
      Destino: [''],
      DestinoMultiple: [''],
      EmpleadoFilter: [''],
      Empleado: [''],
      EmpleadoMultiple: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromempleado_total_mxn: [''],
      toempleado_total_mxn: [''],
      fromempleado_total_usd: [''],
      toempleado_total_usd: [''],
      fromempleado_total_eur: [''],
      toempleado_total_eur: [''],
      fromempleado_total_libras: [''],
      toempleado_total_libras: [''],
      fromempleado_total_cad: [''],
      toempleado_total_cad: [''],
      fromaeronave_total_mxn: [''],
      toaeronave_total_mxn: [''],
      fromaeronave_total_usd: [''],
      toaeronave_total_usd: [''],
      fromaeronave_total_eur: [''],
      toaeronave_total_eur: [''],
      fromaeronave_total_libras: [''],
      toaeronave_total_libras: [''],
      fromaeronave_total_cad: [''],
      toaeronave_total_cad: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Gastos_de_Vuelo/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipo_de_ingreso_de_gastoService.getAll());
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.registro_de_vueloService.getAll());
    observablesArray.push(this.aeropuertosService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.estatus_de_gastos_de_vueloService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipo_de_ingreso_de_gastos ,orden_de_trabajos ,solicitud_de_vuelos ,aeronaves ,registro_de_vuelos ,aeropuertoss ,spartan_users ,estatus_de_gastos_de_vuelos ]) => {
		  this.tipo_de_ingreso_de_gastos = tipo_de_ingreso_de_gastos;
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.aeronaves = aeronaves;
		  this.registro_de_vuelos = registro_de_vuelos;
		  this.aeropuertoss = aeropuertoss;
		  this.spartan_users = spartan_users;
		  this.estatus_de_gastos_de_vuelos = estatus_de_gastos_de_vuelos;
          

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
    this.dataListConfig.filterAdvanced.Tipo_de_Ingreso_de_GastoFilter = entity.Tipo_de_Ingreso_de_GastoFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Ingreso_de_Gasto = entity.Tipo_de_Ingreso_de_Gasto;
    this.dataListConfig.filterAdvanced.Tipo_de_Ingreso_de_GastoMultiple = entity.Tipo_de_Ingreso_de_GastoMultiple;
    this.dataListConfig.filterAdvanced.Orden_de_TrabajoFilter = entity.Orden_de_TrabajoFilter;
    this.dataListConfig.filterAdvanced.Orden_de_Trabajo = entity.Orden_de_Trabajo;
    this.dataListConfig.filterAdvanced.Orden_de_TrabajoMultiple = entity.Orden_de_TrabajoMultiple;
    this.dataListConfig.filterAdvanced.Numero_de_VueloFilter = entity.Numero_de_VueloFilter;
    this.dataListConfig.filterAdvanced.Numero_de_Vuelo = entity.Numero_de_Vuelo;
    this.dataListConfig.filterAdvanced.Numero_de_VueloMultiple = entity.Numero_de_VueloMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.Tramo_de_VueloFilter = entity.Tramo_de_VueloFilter;
    this.dataListConfig.filterAdvanced.Tramo_de_Vuelo = entity.Tramo_de_Vuelo;
    this.dataListConfig.filterAdvanced.Tramo_de_VueloMultiple = entity.Tramo_de_VueloMultiple;
    this.dataListConfig.filterAdvanced.SalidaFilter = entity.SalidaFilter;
    this.dataListConfig.filterAdvanced.Salida = entity.Salida;
    this.dataListConfig.filterAdvanced.SalidaMultiple = entity.SalidaMultiple;
    this.dataListConfig.filterAdvanced.DestinoFilter = entity.DestinoFilter;
    this.dataListConfig.filterAdvanced.Destino = entity.Destino;
    this.dataListConfig.filterAdvanced.DestinoMultiple = entity.DestinoMultiple;
    this.dataListConfig.filterAdvanced.EmpleadoFilter = entity.EmpleadoFilter;
    this.dataListConfig.filterAdvanced.Empleado = entity.Empleado;
    this.dataListConfig.filterAdvanced.EmpleadoMultiple = entity.EmpleadoMultiple;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.fromempleado_total_mxn = entity.fromempleado_total_mxn;
    this.dataListConfig.filterAdvanced.toempleado_total_mxn = entity.toempleado_total_mxn;
    this.dataListConfig.filterAdvanced.fromempleado_total_usd = entity.fromempleado_total_usd;
    this.dataListConfig.filterAdvanced.toempleado_total_usd = entity.toempleado_total_usd;
    this.dataListConfig.filterAdvanced.fromempleado_total_eur = entity.fromempleado_total_eur;
    this.dataListConfig.filterAdvanced.toempleado_total_eur = entity.toempleado_total_eur;
    this.dataListConfig.filterAdvanced.fromempleado_total_libras = entity.fromempleado_total_libras;
    this.dataListConfig.filterAdvanced.toempleado_total_libras = entity.toempleado_total_libras;
    this.dataListConfig.filterAdvanced.fromempleado_total_cad = entity.fromempleado_total_cad;
    this.dataListConfig.filterAdvanced.toempleado_total_cad = entity.toempleado_total_cad;
    this.dataListConfig.filterAdvanced.fromaeronave_total_mxn = entity.fromaeronave_total_mxn;
    this.dataListConfig.filterAdvanced.toaeronave_total_mxn = entity.toaeronave_total_mxn;
    this.dataListConfig.filterAdvanced.fromaeronave_total_usd = entity.fromaeronave_total_usd;
    this.dataListConfig.filterAdvanced.toaeronave_total_usd = entity.toaeronave_total_usd;
    this.dataListConfig.filterAdvanced.fromaeronave_total_eur = entity.fromaeronave_total_eur;
    this.dataListConfig.filterAdvanced.toaeronave_total_eur = entity.toaeronave_total_eur;
    this.dataListConfig.filterAdvanced.fromaeronave_total_libras = entity.fromaeronave_total_libras;
    this.dataListConfig.filterAdvanced.toaeronave_total_libras = entity.toaeronave_total_libras;
    this.dataListConfig.filterAdvanced.fromaeronave_total_cad = entity.fromaeronave_total_cad;
    this.dataListConfig.filterAdvanced.toaeronave_total_cad = entity.toaeronave_total_cad;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Gastos_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }
}
