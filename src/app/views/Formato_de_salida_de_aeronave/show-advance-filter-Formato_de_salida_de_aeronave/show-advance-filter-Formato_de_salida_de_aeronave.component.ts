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

import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';


@Component({
  selector: 'app-show-advance-filter-Formato_de_salida_de_aeronave',
  templateUrl: './show-advance-filter-Formato_de_salida_de_aeronave.component.html',
  styleUrls: ['./show-advance-filter-Formato_de_salida_de_aeronave.component.scss']
})
export class ShowAdvanceFilterFormato_de_salida_de_aeronaveComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Orden_de_Trabajos: Orden_de_Trabajo[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public Clientes: Cliente[] = [];
  public Usuario_que_registras: Spartan_User[] = [];

  public orden_de_trabajos: Orden_de_Trabajo;
  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public clientes: Cliente;
  public spartan_users: Spartan_User;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Orden_de_Trabajo",
      "Fecha_de_Inspeccion",
      "Matricula",
      "Modelo",
      "Numero_de_serie",
      "Cliente",
      "Usuario_que_registra",
      "Rol_de_usuario",
      "Hora",
      "Prevuelo_Efectuado",
      "Liberado_despues_de_reparacion_mayor",
      "Liberado_despues_de_inspeccion",
      "Liberado_despues_de_modificacion_mayor",
      "Liberado_despues_de_trabajos_menores",
      "Tipo_de_inspeccion",
      "Combustible_LH",
      "Combustible_RH",
      "Regresar_a_servicio",
      "Vuelo_de_evaluacion",
      "Salida",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Orden_de_Trabajo_filtro",
      "Fecha_de_Inspeccion_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Numero_de_serie_filtro",
      "Cliente_filtro",
      "Usuario_que_registra_filtro",
      "Rol_de_usuario_filtro",
      "Hora_filtro",
      "Prevuelo_Efectuado_filtro",
      "Liberado_despues_de_reparacion_mayor_filtro",
      "Liberado_despues_de_inspeccion_filtro",
      "Liberado_despues_de_modificacion_mayor_filtro",
      "Liberado_despues_de_trabajos_menores_filtro",
      "Tipo_de_inspeccion_filtro",
      "Combustible_LH_filtro",
      "Combustible_RH_filtro",
      "Regresar_a_servicio_filtro",
      "Vuelo_de_evaluacion_filtro",
      "Salida_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Orden_de_Trabajo: "",
      Fecha_de_Inspeccion: null,
      Matricula: "",
      Modelo: "",
      Numero_de_serie: "",
      Cliente: "",
      Usuario_que_registra: "",
      Rol_de_usuario: "",
      Hora: "",
      Prevuelo_Efectuado: "",
      Liberado_despues_de_reparacion_mayor: "",
      Liberado_despues_de_inspeccion: "",
      Liberado_despues_de_modificacion_mayor: "",
      Liberado_despues_de_trabajos_menores: "",
      Tipo_de_inspeccion: "",
      Combustible_LH: "",
      Combustible_RH: "",
      Regresar_a_servicio: "",
      Vuelo_de_evaluacion: "",
      Salida: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Orden_de_TrabajoFilter: "",
      Orden_de_Trabajo: "",
      Orden_de_TrabajoMultiple: "",
      fromFecha_de_Inspeccion: "",
      toFecha_de_Inspeccion: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      Usuario_que_registraFilter: "",
      Usuario_que_registra: "",
      Usuario_que_registraMultiple: "",
      fromHora: "",
      toHora: "",

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
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,
    private clienteService: ClienteService,
    private spartan_userService: Spartan_UserService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Orden_de_TrabajoFilter: [''],
      Orden_de_Trabajo: [''],
      Orden_de_TrabajoMultiple: [''],
      fromFecha_de_Inspeccion: [''],
      toFecha_de_Inspeccion: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      ClienteFilter: [''],
      Cliente: [''],
      ClienteMultiple: [''],
      Usuario_que_registraFilter: [''],
      Usuario_que_registra: [''],
      Usuario_que_registraMultiple: [''],
      fromHora: [''],
      toHora: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Formato_de_salida_de_aeronave/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.spartan_userService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,orden_de_trabajos ,aeronaves ,modeloss ,clientes ,spartan_users ]) => {
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.clientes = clientes;
		  this.spartan_users = spartan_users;
          

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
    this.dataListConfig.filterAdvanced.Orden_de_TrabajoFilter = entity.Orden_de_TrabajoFilter;
    this.dataListConfig.filterAdvanced.Orden_de_Trabajo = entity.Orden_de_Trabajo;
    this.dataListConfig.filterAdvanced.Orden_de_TrabajoMultiple = entity.Orden_de_TrabajoMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Inspeccion = entity.fromFecha_de_Inspeccion;
    this.dataListConfig.filterAdvanced.toFecha_de_Inspeccion = entity.toFecha_de_Inspeccion;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
	this.dataListConfig.filterAdvanced.Numero_de_serieFilter = entity.Numero_de_serieFilter;
	this.dataListConfig.filterAdvanced.Numero_de_serie = entity.Numero_de_serie;
    this.dataListConfig.filterAdvanced.ClienteFilter = entity.ClienteFilter;
    this.dataListConfig.filterAdvanced.Cliente = entity.Cliente;
    this.dataListConfig.filterAdvanced.ClienteMultiple = entity.ClienteMultiple;
    this.dataListConfig.filterAdvanced.Usuario_que_registraFilter = entity.Usuario_que_registraFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_registra = entity.Usuario_que_registra;
    this.dataListConfig.filterAdvanced.Usuario_que_registraMultiple = entity.Usuario_que_registraMultiple;
	this.dataListConfig.filterAdvanced.Rol_de_usuarioFilter = entity.Rol_de_usuarioFilter;
	this.dataListConfig.filterAdvanced.Rol_de_usuario = entity.Rol_de_usuario;
	this.dataListConfig.filterAdvanced.HoraFilter = entity.HoraFilter;
	this.dataListConfig.filterAdvanced.Hora = entity.Hora;
	this.dataListConfig.filterAdvanced.Tipo_de_inspeccionFilter = entity.Tipo_de_inspeccionFilter;
	this.dataListConfig.filterAdvanced.Tipo_de_inspeccion = entity.Tipo_de_inspeccion;
	this.dataListConfig.filterAdvanced.Combustible_LHFilter = entity.Combustible_LHFilter;
	this.dataListConfig.filterAdvanced.Combustible_LH = entity.Combustible_LH;
	this.dataListConfig.filterAdvanced.Combustible_RHFilter = entity.Combustible_RHFilter;
	this.dataListConfig.filterAdvanced.Combustible_RH = entity.Combustible_RH;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Formato_de_salida_de_aeronave/list'], { state: { data: this.dataListConfig } });
  }
}
