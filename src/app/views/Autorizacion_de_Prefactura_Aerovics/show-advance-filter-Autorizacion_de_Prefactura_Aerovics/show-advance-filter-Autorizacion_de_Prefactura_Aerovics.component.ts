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
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Estatus_autorizacion_de_prefactura } from 'src/app/models/Estatus_autorizacion_de_prefactura';
import { Estatus_autorizacion_de_prefacturaService } from 'src/app/api-services/Estatus_autorizacion_de_prefactura.service';


@Component({
  selector: 'app-show-advance-filter-Autorizacion_de_Prefactura_Aerovics',
  templateUrl: './show-advance-filter-Autorizacion_de_Prefactura_Aerovics.component.html',
  styleUrls: ['./show-advance-filter-Autorizacion_de_Prefactura_Aerovics.component.scss']
})
export class ShowAdvanceFilterAutorizacion_de_Prefactura_AerovicsComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Vuelos: Solicitud_de_Vuelo[] = [];
  public Pax_Solicitantes: Spartan_User[] = [];
  public Empresa_Solicitantes: Cliente[] = [];
  public Estatuss: Estatus_autorizacion_de_prefactura[] = [];
  public Usuario_que_autoriza_adms: Spartan_User[] = [];
  public Resultado_de_autorizacion_adms: Estatus_autorizacion_de_prefactura[] = [];
  public Usuario_que_autoriza_dgs: Spartan_User[] = [];
  public Resultado_de_autorizacion_dgs: Estatus_autorizacion_de_prefactura[] = [];
  public Usuario_que_autoriza_dcs: Spartan_User[] = [];
  public Resultado_de_autorizacion_dcs: Estatus_autorizacion_de_prefactura[] = [];

  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public spartan_users: Spartan_User;
  public clientes: Cliente;
  public estatus_autorizacion_de_prefacturas: Estatus_autorizacion_de_prefactura;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No_prefactura",
      "Vuelo",
      "Pax_Solicitante",
      "Empresa_Solicitante",
      "Fecha_de_Salida",
      "Fecha_de_Regreso",
      "Monto_de_Factura",
      "Estatus",
      "Motivo_de_rechazo_general",
      "Observaciones",
      "Fecha_de_autorizacion_adm",
      "Hora_de_autorizacion_adm",
      "Usuario_que_autoriza_adm",
      "Resultado_de_autorizacion_adm",
      "Motivo_de_rechazo_adm",
      "Observaciones_adm",
      "Fecha_de_autorizacion_dg",
      "Hora_de_autorizacion_dg",
      "Usuario_que_autoriza_dg",
      "Resultado_de_autorizacion_dg",
      "Motivo_de_rechazo_dg",
      "Observaciones_dg",
      "Fecha_de_autorizacion_dc",
      "Hora_de_autorizacion_dc",
      "Usuario_que_autoriza_dc",
      "Resultado_de_autorizacion_dc",
      "Motivo_de_rechazo_dc",
      "Observaciones_dc",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No_prefactura_filtro",
      "Vuelo_filtro",
      "Pax_Solicitante_filtro",
      "Empresa_Solicitante_filtro",
      "Fecha_de_Salida_filtro",
      "Fecha_de_Regreso_filtro",
      "Monto_de_Factura_filtro",
      "Estatus_filtro",
      "Motivo_de_rechazo_general_filtro",
      "Observaciones_filtro",
      "Fecha_de_autorizacion_adm_filtro",
      "Hora_de_autorizacion_adm_filtro",
      "Usuario_que_autoriza_adm_filtro",
      "Resultado_de_autorizacion_adm_filtro",
      "Motivo_de_rechazo_adm_filtro",
      "Observaciones_adm_filtro",
      "Fecha_de_autorizacion_dg_filtro",
      "Hora_de_autorizacion_dg_filtro",
      "Usuario_que_autoriza_dg_filtro",
      "Resultado_de_autorizacion_dg_filtro",
      "Motivo_de_rechazo_dg_filtro",
      "Observaciones_dg_filtro",
      "Fecha_de_autorizacion_dc_filtro",
      "Hora_de_autorizacion_dc_filtro",
      "Usuario_que_autoriza_dc_filtro",
      "Resultado_de_autorizacion_dc_filtro",
      "Motivo_de_rechazo_dc_filtro",
      "Observaciones_dc_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No_prefactura: "",
      Vuelo: "",
      Pax_Solicitante: "",
      Empresa_Solicitante: "",
      Fecha_de_Salida: null,
      Fecha_de_Regreso: null,
      Monto_de_Factura: "",
      Estatus: "",
      Motivo_de_rechazo_general: "",
      Observaciones: "",
      Fecha_de_autorizacion_adm: null,
      Hora_de_autorizacion_adm: "",
      Usuario_que_autoriza_adm: "",
      Resultado_de_autorizacion_adm: "",
      Motivo_de_rechazo_adm: "",
      Observaciones_adm: "",
      Fecha_de_autorizacion_dg: null,
      Hora_de_autorizacion_dg: "",
      Usuario_que_autoriza_dg: "",
      Resultado_de_autorizacion_dg: "",
      Motivo_de_rechazo_dg: "",
      Observaciones_dg: "",
      Fecha_de_autorizacion_dc: null,
      Hora_de_autorizacion_dc: "",
      Usuario_que_autoriza_dc: "",
      Resultado_de_autorizacion_dc: "",
      Motivo_de_rechazo_dc: "",
      Observaciones_dc: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromNo_prefactura: "",
      toNo_prefactura: "",
      VueloFilter: "",
      Vuelo: "",
      VueloMultiple: "",
      Pax_SolicitanteFilter: "",
      Pax_Solicitante: "",
      Pax_SolicitanteMultiple: "",
      Empresa_SolicitanteFilter: "",
      Empresa_Solicitante: "",
      Empresa_SolicitanteMultiple: "",
      fromFecha_de_Salida: "",
      toFecha_de_Salida: "",
      fromFecha_de_Regreso: "",
      toFecha_de_Regreso: "",
      fromMonto_de_Factura: "",
      toMonto_de_Factura: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromFecha_de_autorizacion_adm: "",
      toFecha_de_autorizacion_adm: "",
      fromHora_de_autorizacion_adm: "",
      toHora_de_autorizacion_adm: "",
      Usuario_que_autoriza_admFilter: "",
      Usuario_que_autoriza_adm: "",
      Usuario_que_autoriza_admMultiple: "",
      Resultado_de_autorizacion_admFilter: "",
      Resultado_de_autorizacion_adm: "",
      Resultado_de_autorizacion_admMultiple: "",
      fromFecha_de_autorizacion_dg: "",
      toFecha_de_autorizacion_dg: "",
      fromHora_de_autorizacion_dg: "",
      toHora_de_autorizacion_dg: "",
      Usuario_que_autoriza_dgFilter: "",
      Usuario_que_autoriza_dg: "",
      Usuario_que_autoriza_dgMultiple: "",
      Resultado_de_autorizacion_dgFilter: "",
      Resultado_de_autorizacion_dg: "",
      Resultado_de_autorizacion_dgMultiple: "",
      fromFecha_de_autorizacion_dc: "",
      toFecha_de_autorizacion_dc: "",
      fromHora_de_autorizacion_dc: "",
      toHora_de_autorizacion_dc: "",
      Usuario_que_autoriza_dcFilter: "",
      Usuario_que_autoriza_dc: "",
      Usuario_que_autoriza_dcMultiple: "",
      Resultado_de_autorizacion_dcFilter: "",
      Resultado_de_autorizacion_dc: "",
      Resultado_de_autorizacion_dcMultiple: "",

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
    private spartan_userService: Spartan_UserService,
    private clienteService: ClienteService,
    private estatus_autorizacion_de_prefacturaService: Estatus_autorizacion_de_prefacturaService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromNo_prefactura: [''],
      toNo_prefactura: [''],
      VueloFilter: [''],
      Vuelo: [''],
      VueloMultiple: [''],
      Pax_SolicitanteFilter: [''],
      Pax_Solicitante: [''],
      Pax_SolicitanteMultiple: [''],
      Empresa_SolicitanteFilter: [''],
      Empresa_Solicitante: [''],
      Empresa_SolicitanteMultiple: [''],
      fromFecha_de_Salida: [''],
      toFecha_de_Salida: [''],
      fromFecha_de_Regreso: [''],
      toFecha_de_Regreso: [''],
      fromMonto_de_Factura: [''],
      toMonto_de_Factura: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromFecha_de_autorizacion_adm: [''],
      toFecha_de_autorizacion_adm: [''],
      fromHora_de_autorizacion_adm: [''],
      toHora_de_autorizacion_adm: [''],
      Usuario_que_autoriza_admFilter: [''],
      Usuario_que_autoriza_adm: [''],
      Usuario_que_autoriza_admMultiple: [''],
      Resultado_de_autorizacion_admFilter: [''],
      Resultado_de_autorizacion_adm: [''],
      Resultado_de_autorizacion_admMultiple: [''],
      fromFecha_de_autorizacion_dg: [''],
      toFecha_de_autorizacion_dg: [''],
      fromHora_de_autorizacion_dg: [''],
      toHora_de_autorizacion_dg: [''],
      Usuario_que_autoriza_dgFilter: [''],
      Usuario_que_autoriza_dg: [''],
      Usuario_que_autoriza_dgMultiple: [''],
      Resultado_de_autorizacion_dgFilter: [''],
      Resultado_de_autorizacion_dg: [''],
      Resultado_de_autorizacion_dgMultiple: [''],
      fromFecha_de_autorizacion_dc: [''],
      toFecha_de_autorizacion_dc: [''],
      fromHora_de_autorizacion_dc: [''],
      toHora_de_autorizacion_dc: [''],
      Usuario_que_autoriza_dcFilter: [''],
      Usuario_que_autoriza_dc: [''],
      Usuario_que_autoriza_dcMultiple: [''],
      Resultado_de_autorizacion_dcFilter: [''],
      Resultado_de_autorizacion_dc: [''],
      Resultado_de_autorizacion_dcMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Autorizacion_de_Prefactura_Aerovics/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.clienteService.getAll());
    observablesArray.push(this.estatus_autorizacion_de_prefacturaService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_vuelos ,spartan_users ,clientes ,estatus_autorizacion_de_prefacturas ]) => {
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.spartan_users = spartan_users;
		  this.clientes = clientes;
		  this.estatus_autorizacion_de_prefacturas = estatus_autorizacion_de_prefacturas;
          

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
    this.dataListConfig.filterAdvanced.fromNo_prefactura = entity.fromNo_prefactura;
    this.dataListConfig.filterAdvanced.toNo_prefactura = entity.toNo_prefactura;
    this.dataListConfig.filterAdvanced.VueloFilter = entity.VueloFilter;
    this.dataListConfig.filterAdvanced.Vuelo = entity.Vuelo;
    this.dataListConfig.filterAdvanced.VueloMultiple = entity.VueloMultiple;
    this.dataListConfig.filterAdvanced.Pax_SolicitanteFilter = entity.Pax_SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Pax_Solicitante = entity.Pax_Solicitante;
    this.dataListConfig.filterAdvanced.Pax_SolicitanteMultiple = entity.Pax_SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.Empresa_SolicitanteFilter = entity.Empresa_SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Empresa_Solicitante = entity.Empresa_Solicitante;
    this.dataListConfig.filterAdvanced.Empresa_SolicitanteMultiple = entity.Empresa_SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Salida = entity.fromFecha_de_Salida;
    this.dataListConfig.filterAdvanced.toFecha_de_Salida = entity.toFecha_de_Salida;
    this.dataListConfig.filterAdvanced.fromFecha_de_Regreso = entity.fromFecha_de_Regreso;
    this.dataListConfig.filterAdvanced.toFecha_de_Regreso = entity.toFecha_de_Regreso;
    this.dataListConfig.filterAdvanced.fromMonto_de_Factura = entity.fromMonto_de_Factura;
    this.dataListConfig.filterAdvanced.toMonto_de_Factura = entity.toMonto_de_Factura;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
	this.dataListConfig.filterAdvanced.Motivo_de_rechazo_generalFilter = entity.Motivo_de_rechazo_generalFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_rechazo_general = entity.Motivo_de_rechazo_general;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
    this.dataListConfig.filterAdvanced.fromFecha_de_autorizacion_adm = entity.fromFecha_de_autorizacion_adm;
    this.dataListConfig.filterAdvanced.toFecha_de_autorizacion_adm = entity.toFecha_de_autorizacion_adm;
	this.dataListConfig.filterAdvanced.Hora_de_autorizacion_admFilter = entity.Hora_de_autorizacion_admFilter;
	this.dataListConfig.filterAdvanced.Hora_de_autorizacion_adm = entity.Hora_de_autorizacion_adm;
    this.dataListConfig.filterAdvanced.Usuario_que_autoriza_admFilter = entity.Usuario_que_autoriza_admFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_autoriza_adm = entity.Usuario_que_autoriza_adm;
    this.dataListConfig.filterAdvanced.Usuario_que_autoriza_admMultiple = entity.Usuario_que_autoriza_admMultiple;
    this.dataListConfig.filterAdvanced.Resultado_de_autorizacion_admFilter = entity.Resultado_de_autorizacion_admFilter;
    this.dataListConfig.filterAdvanced.Resultado_de_autorizacion_adm = entity.Resultado_de_autorizacion_adm;
    this.dataListConfig.filterAdvanced.Resultado_de_autorizacion_admMultiple = entity.Resultado_de_autorizacion_admMultiple;
	this.dataListConfig.filterAdvanced.Motivo_de_rechazo_admFilter = entity.Motivo_de_rechazo_admFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_rechazo_adm = entity.Motivo_de_rechazo_adm;
	this.dataListConfig.filterAdvanced.Observaciones_admFilter = entity.Observaciones_admFilter;
	this.dataListConfig.filterAdvanced.Observaciones_adm = entity.Observaciones_adm;
    this.dataListConfig.filterAdvanced.fromFecha_de_autorizacion_dg = entity.fromFecha_de_autorizacion_dg;
    this.dataListConfig.filterAdvanced.toFecha_de_autorizacion_dg = entity.toFecha_de_autorizacion_dg;
	this.dataListConfig.filterAdvanced.Hora_de_autorizacion_dgFilter = entity.Hora_de_autorizacion_dgFilter;
	this.dataListConfig.filterAdvanced.Hora_de_autorizacion_dg = entity.Hora_de_autorizacion_dg;
    this.dataListConfig.filterAdvanced.Usuario_que_autoriza_dgFilter = entity.Usuario_que_autoriza_dgFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_autoriza_dg = entity.Usuario_que_autoriza_dg;
    this.dataListConfig.filterAdvanced.Usuario_que_autoriza_dgMultiple = entity.Usuario_que_autoriza_dgMultiple;
    this.dataListConfig.filterAdvanced.Resultado_de_autorizacion_dgFilter = entity.Resultado_de_autorizacion_dgFilter;
    this.dataListConfig.filterAdvanced.Resultado_de_autorizacion_dg = entity.Resultado_de_autorizacion_dg;
    this.dataListConfig.filterAdvanced.Resultado_de_autorizacion_dgMultiple = entity.Resultado_de_autorizacion_dgMultiple;
	this.dataListConfig.filterAdvanced.Motivo_de_rechazo_dgFilter = entity.Motivo_de_rechazo_dgFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_rechazo_dg = entity.Motivo_de_rechazo_dg;
	this.dataListConfig.filterAdvanced.Observaciones_dgFilter = entity.Observaciones_dgFilter;
	this.dataListConfig.filterAdvanced.Observaciones_dg = entity.Observaciones_dg;
    this.dataListConfig.filterAdvanced.fromFecha_de_autorizacion_dc = entity.fromFecha_de_autorizacion_dc;
    this.dataListConfig.filterAdvanced.toFecha_de_autorizacion_dc = entity.toFecha_de_autorizacion_dc;
	this.dataListConfig.filterAdvanced.Hora_de_autorizacion_dcFilter = entity.Hora_de_autorizacion_dcFilter;
	this.dataListConfig.filterAdvanced.Hora_de_autorizacion_dc = entity.Hora_de_autorizacion_dc;
    this.dataListConfig.filterAdvanced.Usuario_que_autoriza_dcFilter = entity.Usuario_que_autoriza_dcFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_autoriza_dc = entity.Usuario_que_autoriza_dc;
    this.dataListConfig.filterAdvanced.Usuario_que_autoriza_dcMultiple = entity.Usuario_que_autoriza_dcMultiple;
    this.dataListConfig.filterAdvanced.Resultado_de_autorizacion_dcFilter = entity.Resultado_de_autorizacion_dcFilter;
    this.dataListConfig.filterAdvanced.Resultado_de_autorizacion_dc = entity.Resultado_de_autorizacion_dc;
    this.dataListConfig.filterAdvanced.Resultado_de_autorizacion_dcMultiple = entity.Resultado_de_autorizacion_dcMultiple;
	this.dataListConfig.filterAdvanced.Motivo_de_rechazo_dcFilter = entity.Motivo_de_rechazo_dcFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_rechazo_dc = entity.Motivo_de_rechazo_dc;
	this.dataListConfig.filterAdvanced.Observaciones_dcFilter = entity.Observaciones_dcFilter;
	this.dataListConfig.filterAdvanced.Observaciones_dc = entity.Observaciones_dc;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Autorizacion_de_Prefactura_Aerovics/list'], { state: { data: this.dataListConfig } });
  }
}
