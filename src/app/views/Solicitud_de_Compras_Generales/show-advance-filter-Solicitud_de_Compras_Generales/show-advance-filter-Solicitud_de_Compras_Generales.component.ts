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
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Orden_de_servicio } from 'src/app/models/Orden_de_servicio';
import { Orden_de_servicioService } from 'src/app/api-services/Orden_de_servicio.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Tipo_de_Solicitud_de_Compras } from 'src/app/models/Tipo_de_Solicitud_de_Compras';
import { Tipo_de_Solicitud_de_ComprasService } from 'src/app/api-services/Tipo_de_Solicitud_de_Compras.service';
import { Estatus_de_Solicitud_de_Compras_Generales } from 'src/app/models/Estatus_de_Solicitud_de_Compras_Generales';
import { Estatus_de_Solicitud_de_Compras_GeneralesService } from 'src/app/api-services/Estatus_de_Solicitud_de_Compras_Generales.service';
import { Autorizacion } from 'src/app/models/Autorizacion';
import { AutorizacionService } from 'src/app/api-services/Autorizacion.service';


@Component({
  selector: 'app-show-advance-filter-Solicitud_de_Compras_Generales',
  templateUrl: './show-advance-filter-Solicitud_de_Compras_Generales.component.html',
  styleUrls: ['./show-advance-filter-Solicitud_de_Compras_Generales.component.scss']
})
export class ShowAdvanceFilterSolicitud_de_Compras_GeneralesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Usuario_que_Registras: Spartan_User[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];
  public No_de_Vuelos: Solicitud_de_Vuelo[] = [];
  public Tramos: Aeropuertos[] = [];
  public Numero_de_O_Ss: Orden_de_servicio[] = [];
  public Numero_de_O_Ts: Orden_de_Trabajo[] = [];
  public Departamentos: Departamento[] = [];
  public Tipos: Tipo_de_Solicitud_de_Compras[] = [];
  public Estatus_de_Solicituds: Estatus_de_Solicitud_de_Compras_Generales[] = [];
  public Autorizado_pors: Spartan_User[] = [];
  public Resultados: Autorizacion[] = [];

  public spartan_users: Spartan_User;
  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public aeropuertoss: Aeropuertos;
  public orden_de_servicios: Orden_de_servicio;
  public orden_de_trabajos: Orden_de_Trabajo;
  public departamentos: Departamento;
  public tipo_de_solicitud_de_comprass: Tipo_de_Solicitud_de_Compras;
  public estatus_de_solicitud_de_compras_generaless: Estatus_de_Solicitud_de_Compras_Generales;
  public autorizacions: Autorizacion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "No_de_Solicitud",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Razon_de_la_Compra",
      "Proveedor",
      "No_de_Vuelo",
      "Tramo",
      "Numero_de_O_S",
      "Numero_de_O_T",
      "Departamento",
      "Tipo",
      "Observaciones",
      "Motivo_de_Cancelacion",
      "Enviar_Solicitud",
      "Estatus_de_Solicitud",
      "Fecha_de_Autorizacion",
      "Hora_de_Autorizacion",
      "Autorizado_por",
      "Resultado",
      "Observacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "No_de_Solicitud_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Razon_de_la_Compra_filtro",
      "Proveedor_filtro",
      "No_de_Vuelo_filtro",
      "Tramo_filtro",
      "Numero_de_O_S_filtro",
      "Numero_de_O_T_filtro",
      "Departamento_filtro",
      "Tipo_filtro",
      "Observaciones_filtro",
      "Motivo_de_Cancelacion_filtro",
      "Enviar_Solicitud_filtro",
      "Estatus_de_Solicitud_filtro",
      "Fecha_de_Autorizacion_filtro",
      "Hora_de_Autorizacion_filtro",
      "Autorizado_por_filtro",
      "Resultado_filtro",
      "Observacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      No_de_Solicitud: "",
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Razon_de_la_Compra: "",
      Proveedor: "",
      No_de_Vuelo: "",
      Tramo: "",
      Numero_de_O_S: "",
      Numero_de_O_T: "",
      Departamento: "",
      Tipo: "",
      Observaciones: "",
      Motivo_de_Cancelacion: "",
      Enviar_Solicitud: "",
      Estatus_de_Solicitud: "",
      Fecha_de_Autorizacion: null,
      Hora_de_Autorizacion: "",
      Autorizado_por: "",
      Resultado: "",
      Observacion: "",

    },
    filterAdvanced: {
      fromNo_de_Solicitud: "",
      toNo_de_Solicitud: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      No_de_VueloFilter: "",
      No_de_Vuelo: "",
      No_de_VueloMultiple: "",
      TramoFilter: "",
      Tramo: "",
      TramoMultiple: "",
      Numero_de_O_SFilter: "",
      Numero_de_O_S: "",
      Numero_de_O_SMultiple: "",
      Numero_de_O_TFilter: "",
      Numero_de_O_T: "",
      Numero_de_O_TMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",
      Estatus_de_SolicitudFilter: "",
      Estatus_de_Solicitud: "",
      Estatus_de_SolicitudMultiple: "",
      fromFecha_de_Autorizacion: "",
      toFecha_de_Autorizacion: "",
      fromHora_de_Autorizacion: "",
      toHora_de_Autorizacion: "",
      Autorizado_porFilter: "",
      Autorizado_por: "",
      Autorizado_porMultiple: "",
      ResultadoFilter: "",
      Resultado: "",
      ResultadoMultiple: "",

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
    private creacion_de_proveedoresService: Creacion_de_ProveedoresService,
    private solicitud_de_vueloService: Solicitud_de_VueloService,
    private aeropuertosService: AeropuertosService,
    private orden_de_servicioService: Orden_de_servicioService,
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private departamentoService: DepartamentoService,
    private tipo_de_solicitud_de_comprasService: Tipo_de_Solicitud_de_ComprasService,
    private estatus_de_solicitud_de_compras_generalesService: Estatus_de_Solicitud_de_Compras_GeneralesService,
    private autorizacionService: AutorizacionService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromNo_de_Solicitud: [''],
      toNo_de_Solicitud: [''],
      fromFecha_de_Registro: [''],
      toFecha_de_Registro: [''],
      fromHora_de_Registro: [''],
      toHora_de_Registro: [''],
      Usuario_que_RegistraFilter: [''],
      Usuario_que_Registra: [''],
      Usuario_que_RegistraMultiple: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],
      No_de_VueloFilter: [''],
      No_de_Vuelo: [''],
      No_de_VueloMultiple: [''],
      TramoFilter: [''],
      Tramo: [''],
      TramoMultiple: [''],
      Numero_de_O_SFilter: [''],
      Numero_de_O_S: [''],
      Numero_de_O_SMultiple: [''],
      Numero_de_O_TFilter: [''],
      Numero_de_O_T: [''],
      Numero_de_O_TMultiple: [''],
      DepartamentoFilter: [''],
      Departamento: [''],
      DepartamentoMultiple: [''],
      TipoFilter: [''],
      Tipo: [''],
      TipoMultiple: [''],
      Estatus_de_SolicitudFilter: [''],
      Estatus_de_Solicitud: [''],
      Estatus_de_SolicitudMultiple: [''],
      fromFecha_de_Autorizacion: [''],
      toFecha_de_Autorizacion: [''],
      fromHora_de_Autorizacion: [''],
      toHora_de_Autorizacion: [''],
      Autorizado_porFilter: [''],
      Autorizado_por: [''],
      Autorizado_porMultiple: [''],
      ResultadoFilter: [''],
      Resultado: [''],
      ResultadoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Solicitud_de_Compras_Generales/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.aeropuertosService.getAll());
    observablesArray.push(this.orden_de_servicioService.getAll());
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.departamentoService.getAll());
    observablesArray.push(this.tipo_de_solicitud_de_comprasService.getAll());
    observablesArray.push(this.estatus_de_solicitud_de_compras_generalesService.getAll());
    observablesArray.push(this.autorizacionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,creacion_de_proveedoress ,solicitud_de_vuelos ,aeropuertoss ,orden_de_servicios ,orden_de_trabajos ,departamentos ,tipo_de_solicitud_de_comprass ,estatus_de_solicitud_de_compras_generaless ,autorizacions ]) => {
		  this.spartan_users = spartan_users;
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.aeropuertoss = aeropuertoss;
		  this.orden_de_servicios = orden_de_servicios;
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.departamentos = departamentos;
		  this.tipo_de_solicitud_de_comprass = tipo_de_solicitud_de_comprass;
		  this.estatus_de_solicitud_de_compras_generaless = estatus_de_solicitud_de_compras_generaless;
		  this.autorizacions = autorizacions;
          

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
    this.dataListConfig.filterAdvanced.fromNo_de_Solicitud = entity.fromNo_de_Solicitud;
    this.dataListConfig.filterAdvanced.toNo_de_Solicitud = entity.toNo_de_Solicitud;
    this.dataListConfig.filterAdvanced.fromFecha_de_Registro = entity.fromFecha_de_Registro;
    this.dataListConfig.filterAdvanced.toFecha_de_Registro = entity.toFecha_de_Registro;
	this.dataListConfig.filterAdvanced.Hora_de_RegistroFilter = entity.Hora_de_RegistroFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Registro = entity.Hora_de_Registro;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraFilter = entity.Usuario_que_RegistraFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_Registra = entity.Usuario_que_Registra;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraMultiple = entity.Usuario_que_RegistraMultiple;
	this.dataListConfig.filterAdvanced.Razon_de_la_CompraFilter = entity.Razon_de_la_CompraFilter;
	this.dataListConfig.filterAdvanced.Razon_de_la_Compra = entity.Razon_de_la_Compra;
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
    this.dataListConfig.filterAdvanced.No_de_VueloFilter = entity.No_de_VueloFilter;
    this.dataListConfig.filterAdvanced.No_de_Vuelo = entity.No_de_Vuelo;
    this.dataListConfig.filterAdvanced.No_de_VueloMultiple = entity.No_de_VueloMultiple;
    this.dataListConfig.filterAdvanced.TramoFilter = entity.TramoFilter;
    this.dataListConfig.filterAdvanced.Tramo = entity.Tramo;
    this.dataListConfig.filterAdvanced.TramoMultiple = entity.TramoMultiple;
    this.dataListConfig.filterAdvanced.Numero_de_O_SFilter = entity.Numero_de_O_SFilter;
    this.dataListConfig.filterAdvanced.Numero_de_O_S = entity.Numero_de_O_S;
    this.dataListConfig.filterAdvanced.Numero_de_O_SMultiple = entity.Numero_de_O_SMultiple;
    this.dataListConfig.filterAdvanced.Numero_de_O_TFilter = entity.Numero_de_O_TFilter;
    this.dataListConfig.filterAdvanced.Numero_de_O_T = entity.Numero_de_O_T;
    this.dataListConfig.filterAdvanced.Numero_de_O_TMultiple = entity.Numero_de_O_TMultiple;
    this.dataListConfig.filterAdvanced.DepartamentoFilter = entity.DepartamentoFilter;
    this.dataListConfig.filterAdvanced.Departamento = entity.Departamento;
    this.dataListConfig.filterAdvanced.DepartamentoMultiple = entity.DepartamentoMultiple;
    this.dataListConfig.filterAdvanced.TipoFilter = entity.TipoFilter;
    this.dataListConfig.filterAdvanced.Tipo = entity.Tipo;
    this.dataListConfig.filterAdvanced.TipoMultiple = entity.TipoMultiple;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
	this.dataListConfig.filterAdvanced.Motivo_de_CancelacionFilter = entity.Motivo_de_CancelacionFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_Cancelacion = entity.Motivo_de_Cancelacion;
    this.dataListConfig.filterAdvanced.Estatus_de_SolicitudFilter = entity.Estatus_de_SolicitudFilter;
    this.dataListConfig.filterAdvanced.Estatus_de_Solicitud = entity.Estatus_de_Solicitud;
    this.dataListConfig.filterAdvanced.Estatus_de_SolicitudMultiple = entity.Estatus_de_SolicitudMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Autorizacion = entity.fromFecha_de_Autorizacion;
    this.dataListConfig.filterAdvanced.toFecha_de_Autorizacion = entity.toFecha_de_Autorizacion;
	this.dataListConfig.filterAdvanced.Hora_de_AutorizacionFilter = entity.Hora_de_AutorizacionFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Autorizacion = entity.Hora_de_Autorizacion;
    this.dataListConfig.filterAdvanced.Autorizado_porFilter = entity.Autorizado_porFilter;
    this.dataListConfig.filterAdvanced.Autorizado_por = entity.Autorizado_por;
    this.dataListConfig.filterAdvanced.Autorizado_porMultiple = entity.Autorizado_porMultiple;
    this.dataListConfig.filterAdvanced.ResultadoFilter = entity.ResultadoFilter;
    this.dataListConfig.filterAdvanced.Resultado = entity.Resultado;
    this.dataListConfig.filterAdvanced.ResultadoMultiple = entity.ResultadoMultiple;
	this.dataListConfig.filterAdvanced.ObservacionFilter = entity.ObservacionFilter;
	this.dataListConfig.filterAdvanced.Observacion = entity.Observacion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Solicitud_de_Compras_Generales/list'], { state: { data: this.dataListConfig } });
  }
}
