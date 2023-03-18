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

import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';


@Component({
  selector: 'app-show-advance-filter-Inspeccion_Entrada_Aeronave',
  templateUrl: './show-advance-filter-Inspeccion_Entrada_Aeronave.component.html',
  styleUrls: ['./show-advance-filter-Inspeccion_Entrada_Aeronave.component.scss']
})
export class ShowAdvanceFilterInspeccion_Entrada_AeronaveComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Reportes: Crear_Reporte[] = [];
  public N_Orden_de_Trabajos: Orden_de_Trabajo[] = [];
  public Usuario_que_Registras: Spartan_User[] = [];
  public Modelos: Modelos[] = [];
  public Clientes: Cliente[] = [];
  public Se_realizo_evidencia_filmograficas: Respuesta[] = [];

  public crear_reportes: Crear_Reporte;
  public orden_de_trabajos: Orden_de_Trabajo;
  public spartan_users: Spartan_User;
  public modeloss: Modelos;
  public clientes: Cliente;
  public respuestas: Respuesta;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Reporte",
      "N_Orden_de_Trabajo",
      "Fecha_de_Entrega",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Aeronave",
      "Modelo",
      "Numero_de_Serie",
      "Cliente",
      "Se_realizo_evidencia_filmografica",
      "Cant__Combustible_en_la_recepcion",
      "Razon_de_ingreso",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Reporte_filtro",
      "N_Orden_de_Trabajo_filtro",
      "Fecha_de_Entrega_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Aeronave_filtro",
      "Modelo_filtro",
      "Numero_de_Serie_filtro",
      "Cliente_filtro",
      "Se_realizo_evidencia_filmografica_filtro",
      "Cant__Combustible_en_la_recepcion_filtro",
      "Razon_de_ingreso_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Reporte: "",
      N_Orden_de_Trabajo: "",
      Fecha_de_Entrega: null,
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Aeronave: "",
      Modelo: "",
      Numero_de_Serie: "",
      Cliente: "",
      Se_realizo_evidencia_filmografica: "",
      Cant__Combustible_en_la_recepcion: "",
      Razon_de_ingreso: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ReporteFilter: "",
      Reporte: "",
      ReporteMultiple: "",
      N_Orden_de_TrabajoFilter: "",
      N_Orden_de_Trabajo: "",
      N_Orden_de_TrabajoMultiple: "",
      fromFecha_de_Entrega: "",
      toFecha_de_Entrega: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      Se_realizo_evidencia_filmograficaFilter: "",
      Se_realizo_evidencia_filmografica: "",
      Se_realizo_evidencia_filmograficaMultiple: "",

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
    private crear_reporteService: Crear_ReporteService,
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private spartan_userService: Spartan_UserService,
    private modelosService: ModelosService,
    private clienteService: ClienteService,
    private respuestaService: RespuestaService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      ReporteFilter: [''],
      Reporte: [''],
      ReporteMultiple: [''],
      N_Orden_de_TrabajoFilter: [''],
      N_Orden_de_Trabajo: [''],
      N_Orden_de_TrabajoMultiple: [''],
      fromFecha_de_Entrega: [''],
      toFecha_de_Entrega: [''],
      fromFecha_de_Registro: [''],
      toFecha_de_Registro: [''],
      fromHora_de_Registro: [''],
      toHora_de_Registro: [''],
      Usuario_que_RegistraFilter: [''],
      Usuario_que_Registra: [''],
      Usuario_que_RegistraMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      ClienteFilter: [''],
      Cliente: [''],
      ClienteMultiple: [''],
      Se_realizo_evidencia_filmograficaFilter: [''],
      Se_realizo_evidencia_filmografica: [''],
      Se_realizo_evidencia_filmograficaMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Inspeccion_Entrada_Aeronave/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.crear_reporteService.getAll());
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.respuestaService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,crear_reportes ,orden_de_trabajos ,spartan_users ,modeloss ,clientes ,respuestas ]) => {
		  this.crear_reportes = crear_reportes;
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.spartan_users = spartan_users;
		  this.modeloss = modeloss;
		  this.clientes = clientes;
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
    this.dataListConfig.filterAdvanced.ReporteFilter = entity.ReporteFilter;
    this.dataListConfig.filterAdvanced.Reporte = entity.Reporte;
    this.dataListConfig.filterAdvanced.ReporteMultiple = entity.ReporteMultiple;
    this.dataListConfig.filterAdvanced.N_Orden_de_TrabajoFilter = entity.N_Orden_de_TrabajoFilter;
    this.dataListConfig.filterAdvanced.N_Orden_de_Trabajo = entity.N_Orden_de_Trabajo;
    this.dataListConfig.filterAdvanced.N_Orden_de_TrabajoMultiple = entity.N_Orden_de_TrabajoMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Entrega = entity.fromFecha_de_Entrega;
    this.dataListConfig.filterAdvanced.toFecha_de_Entrega = entity.toFecha_de_Entrega;
    this.dataListConfig.filterAdvanced.fromFecha_de_Registro = entity.fromFecha_de_Registro;
    this.dataListConfig.filterAdvanced.toFecha_de_Registro = entity.toFecha_de_Registro;
	this.dataListConfig.filterAdvanced.Hora_de_RegistroFilter = entity.Hora_de_RegistroFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Registro = entity.Hora_de_Registro;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraFilter = entity.Usuario_que_RegistraFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_Registra = entity.Usuario_que_Registra;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraMultiple = entity.Usuario_que_RegistraMultiple;
	this.dataListConfig.filterAdvanced.AeronaveFilter = entity.AeronaveFilter;
	this.dataListConfig.filterAdvanced.Aeronave = entity.Aeronave;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
	this.dataListConfig.filterAdvanced.Numero_de_SerieFilter = entity.Numero_de_SerieFilter;
	this.dataListConfig.filterAdvanced.Numero_de_Serie = entity.Numero_de_Serie;
    this.dataListConfig.filterAdvanced.ClienteFilter = entity.ClienteFilter;
    this.dataListConfig.filterAdvanced.Cliente = entity.Cliente;
    this.dataListConfig.filterAdvanced.ClienteMultiple = entity.ClienteMultiple;
    this.dataListConfig.filterAdvanced.Se_realizo_evidencia_filmograficaFilter = entity.Se_realizo_evidencia_filmograficaFilter;
    this.dataListConfig.filterAdvanced.Se_realizo_evidencia_filmografica = entity.Se_realizo_evidencia_filmografica;
    this.dataListConfig.filterAdvanced.Se_realizo_evidencia_filmograficaMultiple = entity.Se_realizo_evidencia_filmograficaMultiple;
	this.dataListConfig.filterAdvanced.Cant__Combustible_en_la_recepcionFilter = entity.Cant__Combustible_en_la_recepcionFilter;
	this.dataListConfig.filterAdvanced.Cant__Combustible_en_la_recepcion = entity.Cant__Combustible_en_la_recepcion;
	this.dataListConfig.filterAdvanced.Razon_de_ingresoFilter = entity.Razon_de_ingresoFilter;
	this.dataListConfig.filterAdvanced.Razon_de_ingreso = entity.Razon_de_ingreso;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Inspeccion_Entrada_Aeronave/list'], { state: { data: this.dataListConfig } });
  }
}
