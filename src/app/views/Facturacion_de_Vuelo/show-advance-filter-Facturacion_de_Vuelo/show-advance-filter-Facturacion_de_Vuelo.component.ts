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
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Estatus_de_facturacion_de_vuelo } from 'src/app/models/Estatus_de_facturacion_de_vuelo';
import { Estatus_de_facturacion_de_vueloService } from 'src/app/api-services/Estatus_de_facturacion_de_vuelo.service';


@Component({
  selector: 'app-show-advance-filter-Facturacion_de_Vuelo',
  templateUrl: './show-advance-filter-Facturacion_de_Vuelo.component.html',
  styleUrls: ['./show-advance-filter-Facturacion_de_Vuelo.component.scss']
})
export class ShowAdvanceFilterFacturacion_de_VueloComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Vuelos: Solicitud_de_Vuelo[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public Clientes: Cliente[] = [];
  public Solicitante_1s: Spartan_User[] = [];
  public Estatuss: Estatus_de_facturacion_de_vuelo[] = [];

  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public clientes: Cliente;
  public spartan_users: Spartan_User;
  public estatus_de_facturacion_de_vuelos: Estatus_de_facturacion_de_vuelo;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha",
      "Hora",
      "Vuelo",
      "Seccion",
      "Tipo",
      "Matricula",
      "Modelo",
      "Ano",
      "Cliente",
      "Solicitante_1",
      "Horas_de_vuelo",
      "Horas_de_Espera",
      "Percnota",
      "Estatus",
      "Fecha_de_la_factura",
      "Servicios_Terminal_Total",
      "Comisariato_Total",
      "Despacho",
      "TUA_Nacional",
      "TUA_Nacional_Total",
      "TUA_Internacional",
      "TUA_Internacional_Total",
      "IVA_Frontera",
      "IVA_Frontera_Total",
      "IVA_Nacional",
      "IVA_Nacional_Total",
      "SubTotal",
      "Tiempo_de_Vuelo",
      "Tiempo_de_Vuelo_Total",
      "Tiempo_de_Espera",
      "Espera_sin_Cargo",
      "Espera_con_Cargo",
      "Espera_con_Cargo_Total",
      "Pernocta",
      "Pernoctas_Total",
      "IVA_Nacional_Servicios",
      "IVA_Nacional_Servicios_Total",
      "IVA",
      "IVA_Internacional_Total",
      "Cargo_vuelo_int_",
      "Cargo_Vuelo_Int__Total",
      "IVA_vuelo_int_",
      "IVA_Vuelo_Int__Total",
      "SubTotal_1",
      "Servicios_de_Terminal",
      "Comisariato_1",
      "Despacho_1",
      "Margen",
      "Total_a_pagar",
      "SAPSA_Monto",
      "SAPSA_Porcentaje",
      "GNP_Monto",
      "GNP_Porcentaje",
      "PH_Monto",
      "PH_Porcentaje",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_filtro",
      "Hora_filtro",
      "Vuelo_filtro",
      "Seccion_filtro",
      "Tipo_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Ano_filtro",
      "Cliente_filtro",
      "Solicitante_1_filtro",
      "Horas_de_vuelo_filtro",
      "Horas_de_Espera_filtro",
      "Percnota_filtro",
      "Estatus_filtro",
      "Fecha_de_la_factura_filtro",
      "Servicios_Terminal_Total_filtro",
      "Comisariato_Total_filtro",
      "Despacho_filtro",
      "TUA_Nacional_filtro",
      "TUA_Nacional_Total_filtro",
      "TUA_Internacional_filtro",
      "TUA_Internacional_Total_filtro",
      "IVA_Frontera_filtro",
      "IVA_Frontera_Total_filtro",
      "IVA_Nacional_filtro",
      "IVA_Nacional_Total_filtro",
      "SubTotal_filtro",
      "Tiempo_de_Vuelo_filtro",
      "Tiempo_de_Vuelo_Total_filtro",
      "Tiempo_de_Espera_filtro",
      "Espera_sin_Cargo_filtro",
      "Espera_con_Cargo_filtro",
      "Espera_con_Cargo_Total_filtro",
      "Pernocta_filtro",
      "Pernoctas_Total_filtro",
      "IVA_Nacional_Servicios_filtro",
      "IVA_Nacional_Servicios_Total_filtro",
      "IVA_filtro",
      "IVA_Internacional_Total_filtro",
      "Cargo_vuelo_int__filtro",
      "Cargo_Vuelo_Int__Total_filtro",
      "IVA_vuelo_int__filtro",
      "IVA_Vuelo_Int__Total_filtro",
      "SubTotal_1_filtro",
      "Servicios_de_Terminal_filtro",
      "Comisariato_1_filtro",
      "Despacho_1_filtro",
      "Margen_filtro",
      "Total_a_pagar_filtro",
      "SAPSA_Monto_filtro",
      "SAPSA_Porcentaje_filtro",
      "GNP_Monto_filtro",
      "GNP_Porcentaje_filtro",
      "PH_Monto_filtro",
      "PH_Porcentaje_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha: null,
      Hora: "",
      Vuelo: "",
      Seccion: "",
      Tipo: "",
      Matricula: "",
      Modelo: "",
      Ano: "",
      Cliente: "",
      Solicitante_1: "",
      Horas_de_vuelo: "",
      Horas_de_Espera: "",
      Percnota: "",
      Estatus: "",
      Fecha_de_la_factura: null,
      Servicios_Terminal_Total: "",
      Comisariato_Total: "",
      Despacho: "",
      TUA_Nacional: "",
      TUA_Nacional_Total: "",
      TUA_Internacional: "",
      TUA_Internacional_Total: "",
      IVA_Frontera: "",
      IVA_Frontera_Total: "",
      IVA_Nacional: "",
      IVA_Nacional_Total: "",
      SubTotal: "",
      Tiempo_de_Vuelo: "",
      Tiempo_de_Vuelo_Total: "",
      Tiempo_de_Espera: "",
      Espera_sin_Cargo: "",
      Espera_con_Cargo: "",
      Espera_con_Cargo_Total: "",
      Pernocta: "",
      Pernoctas_Total: "",
      IVA_Nacional_Servicios: "",
      IVA_Nacional_Servicios_Total: "",
      IVA: "",
      IVA_Internacional_Total: "",
      Cargo_vuelo_int_: "",
      Cargo_Vuelo_Int__Total: "",
      IVA_vuelo_int_: "",
      IVA_Vuelo_Int__Total: "",
      SubTotal_1: "",
      Servicios_de_Terminal: "",
      Comisariato_1: "",
      Despacho_1: "",
      Margen: "",
      Total_a_pagar: "",
      SAPSA_Monto: "",
      SAPSA_Porcentaje: "",
      GNP_Monto: "",
      GNP_Porcentaje: "",
      PH_Monto: "",
      PH_Porcentaje: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha: "",
      toFecha: "",
      fromHora: "",
      toHora: "",
      VueloFilter: "",
      Vuelo: "",
      VueloMultiple: "",
      fromSeccion: "",
      toSeccion: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromAno: "",
      toAno: "",
      ClienteFilter: "",
      Cliente: "",
      ClienteMultiple: "",
      Solicitante_1Filter: "",
      Solicitante_1: "",
      Solicitante_1Multiple: "",
      fromHoras_de_vuelo: "",
      toHoras_de_vuelo: "",
      fromHoras_de_Espera: "",
      toHoras_de_Espera: "",
      fromPercnota: "",
      toPercnota: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromFecha_de_la_factura: "",
      toFecha_de_la_factura: "",
      fromServicios_Terminal_Total: "",
      toServicios_Terminal_Total: "",
      fromComisariato_Total: "",
      toComisariato_Total: "",
      fromDespacho: "",
      toDespacho: "",
      fromTUA_Nacional: "",
      toTUA_Nacional: "",
      fromTUA_Nacional_Total: "",
      toTUA_Nacional_Total: "",
      fromTUA_Internacional: "",
      toTUA_Internacional: "",
      fromTUA_Internacional_Total: "",
      toTUA_Internacional_Total: "",
      fromIVA_Frontera: "",
      toIVA_Frontera: "",
      fromIVA_Frontera_Total: "",
      toIVA_Frontera_Total: "",
      fromIVA_Nacional: "",
      toIVA_Nacional: "",
      fromIVA_Nacional_Total: "",
      toIVA_Nacional_Total: "",
      fromSubTotal: "",
      toSubTotal: "",
      fromTiempo_de_Vuelo: "",
      toTiempo_de_Vuelo: "",
      fromTiempo_de_Vuelo_Total: "",
      toTiempo_de_Vuelo_Total: "",
      fromTiempo_de_Espera: "",
      toTiempo_de_Espera: "",
      fromEspera_sin_Cargo: "",
      toEspera_sin_Cargo: "",
      fromEspera_con_Cargo: "",
      toEspera_con_Cargo: "",
      fromEspera_con_Cargo_Total: "",
      toEspera_con_Cargo_Total: "",
      fromPernocta: "",
      toPernocta: "",
      fromPernoctas_Total: "",
      toPernoctas_Total: "",
      fromIVA_Nacional_Servicios: "",
      toIVA_Nacional_Servicios: "",
      fromIVA_Nacional_Servicios_Total: "",
      toIVA_Nacional_Servicios_Total: "",
      fromIVA: "",
      toIVA: "",
      fromIVA_Internacional_Total: "",
      toIVA_Internacional_Total: "",
      fromCargo_vuelo_int_: "",
      toCargo_vuelo_int_: "",
      fromCargo_Vuelo_Int__Total: "",
      toCargo_Vuelo_Int__Total: "",
      fromIVA_vuelo_int_: "",
      toIVA_vuelo_int_: "",
      fromIVA_Vuelo_Int__Total: "",
      toIVA_Vuelo_Int__Total: "",
      fromSubTotal_1: "",
      toSubTotal_1: "",
      fromServicios_de_Terminal: "",
      toServicios_de_Terminal: "",
      fromComisariato_1: "",
      toComisariato_1: "",
      fromDespacho_1: "",
      toDespacho_1: "",
      fromMargen: "",
      toMargen: "",
      fromTotal_a_pagar: "",
      toTotal_a_pagar: "",
      fromSAPSA_Monto: "",
      toSAPSA_Monto: "",
      fromSAPSA_Porcentaje: "",
      toSAPSA_Porcentaje: "",
      fromGNP_Monto: "",
      toGNP_Monto: "",
      fromGNP_Porcentaje: "",
      toGNP_Porcentaje: "",
      fromPH_Monto: "",
      toPH_Monto: "",
      fromPH_Porcentaje: "",
      toPH_Porcentaje: "",

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
    private modelosService: ModelosService,
    private clienteService: ClienteService,
    private spartan_userService: Spartan_UserService,
    private estatus_de_facturacion_de_vueloService: Estatus_de_facturacion_de_vueloService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFecha: [''],
      toFecha: [''],
      fromHora: [''],
      toHora: [''],
      VueloFilter: [''],
      Vuelo: [''],
      VueloMultiple: [''],
      fromSeccion: [''],
      toSeccion: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      fromAno: [''],
      toAno: [''],
      ClienteFilter: [''],
      Cliente: [''],
      ClienteMultiple: [''],
      Solicitante_1Filter: [''],
      Solicitante_1: [''],
      Solicitante_1Multiple: [''],
      fromHoras_de_vuelo: [''],
      toHoras_de_vuelo: [''],
      fromHoras_de_Espera: [''],
      toHoras_de_Espera: [''],
      fromPercnota: [''],
      toPercnota: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromFecha_de_la_factura: [''],
      toFecha_de_la_factura: [''],
      fromServicios_Terminal_Total: [''],
      toServicios_Terminal_Total: [''],
      fromComisariato_Total: [''],
      toComisariato_Total: [''],
      fromDespacho: [''],
      toDespacho: [''],
      fromTUA_Nacional: [''],
      toTUA_Nacional: [''],
      fromTUA_Nacional_Total: [''],
      toTUA_Nacional_Total: [''],
      fromTUA_Internacional: [''],
      toTUA_Internacional: [''],
      fromTUA_Internacional_Total: [''],
      toTUA_Internacional_Total: [''],
      fromIVA_Frontera: [''],
      toIVA_Frontera: [''],
      fromIVA_Frontera_Total: [''],
      toIVA_Frontera_Total: [''],
      fromIVA_Nacional: [''],
      toIVA_Nacional: [''],
      fromIVA_Nacional_Total: [''],
      toIVA_Nacional_Total: [''],
      fromSubTotal: [''],
      toSubTotal: [''],
      fromTiempo_de_Vuelo: [''],
      toTiempo_de_Vuelo: [''],
      fromTiempo_de_Vuelo_Total: [''],
      toTiempo_de_Vuelo_Total: [''],
      fromTiempo_de_Espera: [''],
      toTiempo_de_Espera: [''],
      fromEspera_sin_Cargo: [''],
      toEspera_sin_Cargo: [''],
      fromEspera_con_Cargo: [''],
      toEspera_con_Cargo: [''],
      fromEspera_con_Cargo_Total: [''],
      toEspera_con_Cargo_Total: [''],
      fromPernocta: [''],
      toPernocta: [''],
      fromPernoctas_Total: [''],
      toPernoctas_Total: [''],
      fromIVA_Nacional_Servicios_Total: [''],
      toIVA_Nacional_Servicios_Total: [''],
      fromIVA: [''],
      toIVA: [''],
      fromIVA_Internacional_Total: [''],
      toIVA_Internacional_Total: [''],
      fromCargo_vuelo_int_: [''],
      toCargo_vuelo_int_: [''],
      fromCargo_Vuelo_Int__Total: [''],
      toCargo_Vuelo_Int__Total: [''],
      fromIVA_vuelo_int_: [''],
      toIVA_vuelo_int_: [''],
      fromIVA_Vuelo_Int__Total: [''],
      toIVA_Vuelo_Int__Total: [''],
      fromSubTotal_1: [''],
      toSubTotal_1: [''],
      fromServicios_de_Terminal: [''],
      toServicios_de_Terminal: [''],
      fromComisariato_1: [''],
      toComisariato_1: [''],
      fromDespacho_1: [''],
      toDespacho_1: [''],
      fromTotal_a_pagar: [''],
      toTotal_a_pagar: [''],
      fromSAPSA_Monto: [''],
      toSAPSA_Monto: [''],
      fromGNP_Monto: [''],
      toGNP_Monto: [''],
      fromPH_Monto: [''],
      toPH_Monto: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Facturacion_de_Vuelo/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.estatus_de_facturacion_de_vueloService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_vuelos ,aeronaves ,modeloss ,clientes ,spartan_users ,estatus_de_facturacion_de_vuelos ]) => {
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.clientes = clientes;
		  this.spartan_users = spartan_users;
		  this.estatus_de_facturacion_de_vuelos = estatus_de_facturacion_de_vuelos;
          

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
	this.dataListConfig.filterAdvanced.HoraFilter = entity.HoraFilter;
	this.dataListConfig.filterAdvanced.Hora = entity.Hora;
    this.dataListConfig.filterAdvanced.VueloFilter = entity.VueloFilter;
    this.dataListConfig.filterAdvanced.Vuelo = entity.Vuelo;
    this.dataListConfig.filterAdvanced.VueloMultiple = entity.VueloMultiple;
    this.dataListConfig.filterAdvanced.fromSeccion = entity.fromSeccion;
    this.dataListConfig.filterAdvanced.toSeccion = entity.toSeccion;
	this.dataListConfig.filterAdvanced.TipoFilter = entity.TipoFilter;
	this.dataListConfig.filterAdvanced.Tipo = entity.Tipo;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.fromAno = entity.fromAno;
    this.dataListConfig.filterAdvanced.toAno = entity.toAno;
    this.dataListConfig.filterAdvanced.ClienteFilter = entity.ClienteFilter;
    this.dataListConfig.filterAdvanced.Cliente = entity.Cliente;
    this.dataListConfig.filterAdvanced.ClienteMultiple = entity.ClienteMultiple;
    this.dataListConfig.filterAdvanced.Solicitante_1Filter = entity.Solicitante_1Filter;
    this.dataListConfig.filterAdvanced.Solicitante_1 = entity.Solicitante_1;
    this.dataListConfig.filterAdvanced.Solicitante_1Multiple = entity.Solicitante_1Multiple;
    this.dataListConfig.filterAdvanced.fromHoras_de_vuelo = entity.fromHoras_de_vuelo;
    this.dataListConfig.filterAdvanced.toHoras_de_vuelo = entity.toHoras_de_vuelo;
    this.dataListConfig.filterAdvanced.fromHoras_de_Espera = entity.fromHoras_de_Espera;
    this.dataListConfig.filterAdvanced.toHoras_de_Espera = entity.toHoras_de_Espera;
    this.dataListConfig.filterAdvanced.fromPercnota = entity.fromPercnota;
    this.dataListConfig.filterAdvanced.toPercnota = entity.toPercnota;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_la_factura = entity.fromFecha_de_la_factura;
    this.dataListConfig.filterAdvanced.toFecha_de_la_factura = entity.toFecha_de_la_factura;
    this.dataListConfig.filterAdvanced.fromServicios_Terminal_Total = entity.fromServicios_Terminal_Total;
    this.dataListConfig.filterAdvanced.toServicios_Terminal_Total = entity.toServicios_Terminal_Total;
    this.dataListConfig.filterAdvanced.fromComisariato_Total = entity.fromComisariato_Total;
    this.dataListConfig.filterAdvanced.toComisariato_Total = entity.toComisariato_Total;
    this.dataListConfig.filterAdvanced.fromDespacho = entity.fromDespacho;
    this.dataListConfig.filterAdvanced.toDespacho = entity.toDespacho;
    this.dataListConfig.filterAdvanced.fromTUA_Nacional = entity.fromTUA_Nacional;
    this.dataListConfig.filterAdvanced.toTUA_Nacional = entity.toTUA_Nacional;
    this.dataListConfig.filterAdvanced.fromTUA_Nacional_Total = entity.fromTUA_Nacional_Total;
    this.dataListConfig.filterAdvanced.toTUA_Nacional_Total = entity.toTUA_Nacional_Total;
    this.dataListConfig.filterAdvanced.fromTUA_Internacional = entity.fromTUA_Internacional;
    this.dataListConfig.filterAdvanced.toTUA_Internacional = entity.toTUA_Internacional;
    this.dataListConfig.filterAdvanced.fromTUA_Internacional_Total = entity.fromTUA_Internacional_Total;
    this.dataListConfig.filterAdvanced.toTUA_Internacional_Total = entity.toTUA_Internacional_Total;
    this.dataListConfig.filterAdvanced.fromIVA_Frontera = entity.fromIVA_Frontera;
    this.dataListConfig.filterAdvanced.toIVA_Frontera = entity.toIVA_Frontera;
    this.dataListConfig.filterAdvanced.fromIVA_Frontera_Total = entity.fromIVA_Frontera_Total;
    this.dataListConfig.filterAdvanced.toIVA_Frontera_Total = entity.toIVA_Frontera_Total;
    this.dataListConfig.filterAdvanced.fromIVA_Nacional = entity.fromIVA_Nacional;
    this.dataListConfig.filterAdvanced.toIVA_Nacional = entity.toIVA_Nacional;
    this.dataListConfig.filterAdvanced.fromIVA_Nacional_Total = entity.fromIVA_Nacional_Total;
    this.dataListConfig.filterAdvanced.toIVA_Nacional_Total = entity.toIVA_Nacional_Total;
    this.dataListConfig.filterAdvanced.fromSubTotal = entity.fromSubTotal;
    this.dataListConfig.filterAdvanced.toSubTotal = entity.toSubTotal;
	this.dataListConfig.filterAdvanced.Tiempo_de_VueloFilter = entity.Tiempo_de_VueloFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Vuelo = entity.Tiempo_de_Vuelo;
    this.dataListConfig.filterAdvanced.fromTiempo_de_Vuelo_Total = entity.fromTiempo_de_Vuelo_Total;
    this.dataListConfig.filterAdvanced.toTiempo_de_Vuelo_Total = entity.toTiempo_de_Vuelo_Total;
	this.dataListConfig.filterAdvanced.Tiempo_de_EsperaFilter = entity.Tiempo_de_EsperaFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_Espera = entity.Tiempo_de_Espera;
	this.dataListConfig.filterAdvanced.Espera_sin_CargoFilter = entity.Espera_sin_CargoFilter;
	this.dataListConfig.filterAdvanced.Espera_sin_Cargo = entity.Espera_sin_Cargo;
	this.dataListConfig.filterAdvanced.Espera_con_CargoFilter = entity.Espera_con_CargoFilter;
	this.dataListConfig.filterAdvanced.Espera_con_Cargo = entity.Espera_con_Cargo;
    this.dataListConfig.filterAdvanced.fromEspera_con_Cargo_Total = entity.fromEspera_con_Cargo_Total;
    this.dataListConfig.filterAdvanced.toEspera_con_Cargo_Total = entity.toEspera_con_Cargo_Total;
    this.dataListConfig.filterAdvanced.fromPernocta = entity.fromPernocta;
    this.dataListConfig.filterAdvanced.toPernocta = entity.toPernocta;
    this.dataListConfig.filterAdvanced.fromPernoctas_Total = entity.fromPernoctas_Total;
    this.dataListConfig.filterAdvanced.toPernoctas_Total = entity.toPernoctas_Total;
    this.dataListConfig.filterAdvanced.fromIVA_Nacional_Servicios = entity.fromIVA_Nacional_Servicios;
    this.dataListConfig.filterAdvanced.toIVA_Nacional_Servicios = entity.toIVA_Nacional_Servicios;
    this.dataListConfig.filterAdvanced.fromIVA_Nacional_Servicios_Total = entity.fromIVA_Nacional_Servicios_Total;
    this.dataListConfig.filterAdvanced.toIVA_Nacional_Servicios_Total = entity.toIVA_Nacional_Servicios_Total;
    this.dataListConfig.filterAdvanced.fromIVA = entity.fromIVA;
    this.dataListConfig.filterAdvanced.toIVA = entity.toIVA;
    this.dataListConfig.filterAdvanced.fromIVA_Internacional_Total = entity.fromIVA_Internacional_Total;
    this.dataListConfig.filterAdvanced.toIVA_Internacional_Total = entity.toIVA_Internacional_Total;
    this.dataListConfig.filterAdvanced.fromCargo_vuelo_int_ = entity.fromCargo_vuelo_int_;
    this.dataListConfig.filterAdvanced.toCargo_vuelo_int_ = entity.toCargo_vuelo_int_;
    this.dataListConfig.filterAdvanced.fromCargo_Vuelo_Int__Total = entity.fromCargo_Vuelo_Int__Total;
    this.dataListConfig.filterAdvanced.toCargo_Vuelo_Int__Total = entity.toCargo_Vuelo_Int__Total;
    this.dataListConfig.filterAdvanced.fromIVA_vuelo_int_ = entity.fromIVA_vuelo_int_;
    this.dataListConfig.filterAdvanced.toIVA_vuelo_int_ = entity.toIVA_vuelo_int_;
    this.dataListConfig.filterAdvanced.fromIVA_Vuelo_Int__Total = entity.fromIVA_Vuelo_Int__Total;
    this.dataListConfig.filterAdvanced.toIVA_Vuelo_Int__Total = entity.toIVA_Vuelo_Int__Total;
    this.dataListConfig.filterAdvanced.fromSubTotal_1 = entity.fromSubTotal_1;
    this.dataListConfig.filterAdvanced.toSubTotal_1 = entity.toSubTotal_1;
    this.dataListConfig.filterAdvanced.fromServicios_de_Terminal = entity.fromServicios_de_Terminal;
    this.dataListConfig.filterAdvanced.toServicios_de_Terminal = entity.toServicios_de_Terminal;
    this.dataListConfig.filterAdvanced.fromComisariato_1 = entity.fromComisariato_1;
    this.dataListConfig.filterAdvanced.toComisariato_1 = entity.toComisariato_1;
    this.dataListConfig.filterAdvanced.fromDespacho_1 = entity.fromDespacho_1;
    this.dataListConfig.filterAdvanced.toDespacho_1 = entity.toDespacho_1;
    this.dataListConfig.filterAdvanced.fromMargen = entity.fromMargen;
    this.dataListConfig.filterAdvanced.toMargen = entity.toMargen;
    this.dataListConfig.filterAdvanced.fromTotal_a_pagar = entity.fromTotal_a_pagar;
    this.dataListConfig.filterAdvanced.toTotal_a_pagar = entity.toTotal_a_pagar;
    this.dataListConfig.filterAdvanced.fromSAPSA_Monto = entity.fromSAPSA_Monto;
    this.dataListConfig.filterAdvanced.toSAPSA_Monto = entity.toSAPSA_Monto;
    this.dataListConfig.filterAdvanced.fromSAPSA_Porcentaje = entity.fromSAPSA_Porcentaje;
    this.dataListConfig.filterAdvanced.toSAPSA_Porcentaje = entity.toSAPSA_Porcentaje;
    this.dataListConfig.filterAdvanced.fromGNP_Monto = entity.fromGNP_Monto;
    this.dataListConfig.filterAdvanced.toGNP_Monto = entity.toGNP_Monto;
    this.dataListConfig.filterAdvanced.fromGNP_Porcentaje = entity.fromGNP_Porcentaje;
    this.dataListConfig.filterAdvanced.toGNP_Porcentaje = entity.toGNP_Porcentaje;
    this.dataListConfig.filterAdvanced.fromPH_Monto = entity.fromPH_Monto;
    this.dataListConfig.filterAdvanced.toPH_Monto = entity.toPH_Monto;
    this.dataListConfig.filterAdvanced.fromPH_Porcentaje = entity.fromPH_Porcentaje;
    this.dataListConfig.filterAdvanced.toPH_Porcentaje = entity.toPH_Porcentaje;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Facturacion_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }
}
