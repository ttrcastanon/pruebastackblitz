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
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Moneda } from 'src/app/models/Moneda';
import { MonedaService } from 'src/app/api-services/Moneda.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Autorizacion } from 'src/app/models/Autorizacion';
import { AutorizacionService } from 'src/app/api-services/Autorizacion.service';


@Component({
  selector: 'app-show-advance-filter-Comparativo_de_Proveedores_Piezas',
  templateUrl: './show-advance-filter-Comparativo_de_Proveedores_Piezas.component.html',
  styleUrls: ['./show-advance-filter-Comparativo_de_Proveedores_Piezas.component.scss']
})
export class ShowAdvanceFilterComparativo_de_Proveedores_PiezasComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Solicitantes: Spartan_User[] = [];
  public Departamentos: Departamento[] = [];
  public Numero_de_Reportes: Crear_Reporte[] = [];
  public Numero_de_O_Ts: Orden_de_Trabajo[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public Proveedor1s: Creacion_de_Proveedores[] = [];
  public Tipo_de_Moneda1s: Moneda[] = [];
  public Proveedor2s: Creacion_de_Proveedores[] = [];
  public Tipo_de_Moneda2s: Moneda[] = [];
  public Proveedor3s: Creacion_de_Proveedores[] = [];
  public Tipo_de_Moneda3s: Moneda[] = [];
  public Proveedor4s: Creacion_de_Proveedores[] = [];
  public Tipo_de_Moneda4s: Moneda[] = [];
  public Tipo_de_Monedas: Moneda[] = [];
  public Estatus_de_Seguimientos: Estatus_de_Seguimiento[] = [];
  public Autorizado_pors: Spartan_User[] = [];
  public Resultados: Autorizacion[] = [];
  public Autorizado_por_DGs: Spartan_User[] = [];
  public Resultado_DGs: Autorizacion[] = [];
  public Autorizado_por_Adms: Spartan_User[] = [];
  public Resultado_Adms: Autorizacion[] = [];

  public spartan_users: Spartan_User;
  public departamentos: Departamento;
  public crear_reportes: Crear_Reporte;
  public orden_de_trabajos: Orden_de_Trabajo;
  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public monedas: Moneda;
  public estatus_de_seguimientos: Estatus_de_Seguimiento;
  public autorizacions: Autorizacion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__Solicitud",
      "Solicitante",
      "Fecha_de_Solicitud",
      "Razon_de_la_Compra",
      "Departamento",
      "Numero_de_Reporte",
      "Numero_de_O_T",
      "Matricula",
      "Modelo",
      "Estatus",
      "Proveedor1",
      "Total_Proveedor1",
      "Total_Cotizacion_Proveedor1",
      "Tipo_de_Moneda1",
      "Proveedor2",
      "Total_Proveedor2",
      "Total_Cotizacion_Proveedor2",
      "Tipo_de_Moneda2",
      "Proveedor3",
      "Total_Proveedor3",
      "Total_Cotizacion_Proveedor3",
      "Tipo_de_Moneda3",
      "Proveedor4",
      "Total_Proveedor4",
      "Total_Cotizacion_Proveedor4",
      "Tipo_de_Moneda4",
      "Total_Cotizacion",
      "Tipo_de_Cambio",
      "Tipo_de_Moneda",
      "Observaciones",
      "Estatus_de_Seguimiento",
      "idComprasGenerales",
      "idGestionAprobacionMantenimiento",
      "FolioComparativoProv",
      "Fecha_de_Autorizacion",
      "Hora_de_Autorizacion",
      "Autorizado_por",
      "Resultado",
      "Motivo_de_Rechazo",
      "Fecha_de_Autorizacion_DG",
      "Hora_de_Autorizacion_DG",
      "Autorizado_por_DG",
      "Resultado_DG",
      "Motivo_de_Rechazo_DG",
      "Fecha_de_Autorizacion_Adm",
      "Hora_de_Autorizacion_Adm",
      "Autorizado_por_Adm",
      "Resultado_Adm",
      "Motivo_de_Rechazo_Adm",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__Solicitud_filtro",
      "Solicitante_filtro",
      "Fecha_de_Solicitud_filtro",
      "Razon_de_la_Compra_filtro",
      "Departamento_filtro",
      "Numero_de_Reporte_filtro",
      "Numero_de_O_T_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Estatus_filtro",
      "Proveedor1_filtro",
      "Total_Proveedor1_filtro",
      "Total_Cotizacion_Proveedor1_filtro",
      "Tipo_de_Moneda1_filtro",
      "Proveedor2_filtro",
      "Total_Proveedor2_filtro",
      "Total_Cotizacion_Proveedor2_filtro",
      "Tipo_de_Moneda2_filtro",
      "Proveedor3_filtro",
      "Total_Proveedor3_filtro",
      "Total_Cotizacion_Proveedor3_filtro",
      "Tipo_de_Moneda3_filtro",
      "Proveedor4_filtro",
      "Total_Proveedor4_filtro",
      "Total_Cotizacion_Proveedor4_filtro",
      "Tipo_de_Moneda4_filtro",
      "Total_Cotizacion_filtro",
      "Tipo_de_Cambio_filtro",
      "Tipo_de_Moneda_filtro",
      "Observaciones_filtro",
      "Estatus_de_Seguimiento_filtro",
      "idComprasGenerales_filtro",
      "idGestionAprobacionMantenimiento_filtro",
      "FolioComparativoProv_filtro",
      "Fecha_de_Autorizacion_filtro",
      "Hora_de_Autorizacion_filtro",
      "Autorizado_por_filtro",
      "Resultado_filtro",
      "Motivo_de_Rechazo_filtro",
      "Fecha_de_Autorizacion_DG_filtro",
      "Hora_de_Autorizacion_DG_filtro",
      "Autorizado_por_DG_filtro",
      "Resultado_DG_filtro",
      "Motivo_de_Rechazo_DG_filtro",
      "Fecha_de_Autorizacion_Adm_filtro",
      "Hora_de_Autorizacion_Adm_filtro",
      "Autorizado_por_Adm_filtro",
      "Resultado_Adm_filtro",
      "Motivo_de_Rechazo_Adm_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No__Solicitud: "",
      Solicitante: "",
      Fecha_de_Solicitud: null,
      Razon_de_la_Compra: "",
      Departamento: "",
      Numero_de_Reporte: "",
      Numero_de_O_T: "",
      Matricula: "",
      Modelo: "",
      Estatus: "",
      Proveedor1: "",
      Total_Proveedor1: "",
      Total_Cotizacion_Proveedor1: "",
      Tipo_de_Moneda1: "",
      Proveedor2: "",
      Total_Proveedor2: "",
      Total_Cotizacion_Proveedor2: "",
      Tipo_de_Moneda2: "",
      Proveedor3: "",
      Total_Proveedor3: "",
      Total_Cotizacion_Proveedor3: "",
      Tipo_de_Moneda3: "",
      Proveedor4: "",
      Total_Proveedor4: "",
      Total_Cotizacion_Proveedor4: "",
      Tipo_de_Moneda4: "",
      Total_Cotizacion: "",
      Tipo_de_Cambio: "",
      Tipo_de_Moneda: "",
      Observaciones: "",
      Estatus_de_Seguimiento: "",
      idComprasGenerales: "",
      idGestionAprobacionMantenimiento: "",
      FolioComparativoProv: "",
      Fecha_de_Autorizacion: null,
      Hora_de_Autorizacion: "",
      Autorizado_por: "",
      Resultado: "",
      Motivo_de_Rechazo: "",
      Fecha_de_Autorizacion_DG: null,
      Hora_de_Autorizacion_DG: "",
      Autorizado_por_DG: "",
      Resultado_DG: "",
      Motivo_de_Rechazo_DG: "",
      Fecha_de_Autorizacion_Adm: null,
      Hora_de_Autorizacion_Adm: "",
      Autorizado_por_Adm: "",
      Resultado_Adm: "",
      Motivo_de_Rechazo_Adm: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromNo__Solicitud: "",
      toNo__Solicitud: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      fromFecha_de_Solicitud: "",
      toFecha_de_Solicitud: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      Numero_de_ReporteFilter: "",
      Numero_de_Reporte: "",
      Numero_de_ReporteMultiple: "",
      Numero_de_O_TFilter: "",
      Numero_de_O_T: "",
      Numero_de_O_TMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      Proveedor1Filter: "",
      Proveedor1: "",
      Proveedor1Multiple: "",
      fromTotal_Proveedor1: "",
      toTotal_Proveedor1: "",
      fromTotal_Cotizacion_Proveedor1: "",
      toTotal_Cotizacion_Proveedor1: "",
      Tipo_de_Moneda1Filter: "",
      Tipo_de_Moneda1: "",
      Tipo_de_Moneda1Multiple: "",
      Proveedor2Filter: "",
      Proveedor2: "",
      Proveedor2Multiple: "",
      fromTotal_Proveedor2: "",
      toTotal_Proveedor2: "",
      fromTotal_Cotizacion_Proveedor2: "",
      toTotal_Cotizacion_Proveedor2: "",
      Tipo_de_Moneda2Filter: "",
      Tipo_de_Moneda2: "",
      Tipo_de_Moneda2Multiple: "",
      Proveedor3Filter: "",
      Proveedor3: "",
      Proveedor3Multiple: "",
      fromTotal_Proveedor3: "",
      toTotal_Proveedor3: "",
      fromTotal_Cotizacion_Proveedor3: "",
      toTotal_Cotizacion_Proveedor3: "",
      Tipo_de_Moneda3Filter: "",
      Tipo_de_Moneda3: "",
      Tipo_de_Moneda3Multiple: "",
      Proveedor4Filter: "",
      Proveedor4: "",
      Proveedor4Multiple: "",
      fromTotal_Proveedor4: "",
      toTotal_Proveedor4: "",
      fromTotal_Cotizacion_Proveedor4: "",
      toTotal_Cotizacion_Proveedor4: "",
      Tipo_de_Moneda4Filter: "",
      Tipo_de_Moneda4: "",
      Tipo_de_Moneda4Multiple: "",
      fromTotal_Cotizacion: "",
      toTotal_Cotizacion: "",
      fromTipo_de_Cambio: "",
      toTipo_de_Cambio: "",
      Tipo_de_MonedaFilter: "",
      Tipo_de_Moneda: "",
      Tipo_de_MonedaMultiple: "",
      Estatus_de_SeguimientoFilter: "",
      Estatus_de_Seguimiento: "",
      Estatus_de_SeguimientoMultiple: "",
      fromidComprasGenerales: "",
      toidComprasGenerales: "",
      fromidGestionAprobacionMantenimiento: "",
      toidGestionAprobacionMantenimiento: "",
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
      fromFecha_de_Autorizacion_DG: "",
      toFecha_de_Autorizacion_DG: "",
      fromHora_de_Autorizacion_DG: "",
      toHora_de_Autorizacion_DG: "",
      Autorizado_por_DGFilter: "",
      Autorizado_por_DG: "",
      Autorizado_por_DGMultiple: "",
      Resultado_DGFilter: "",
      Resultado_DG: "",
      Resultado_DGMultiple: "",
      fromFecha_de_Autorizacion_Adm: "",
      toFecha_de_Autorizacion_Adm: "",
      fromHora_de_Autorizacion_Adm: "",
      toHora_de_Autorizacion_Adm: "",
      Autorizado_por_AdmFilter: "",
      Autorizado_por_Adm: "",
      Autorizado_por_AdmMultiple: "",
      Resultado_AdmFilter: "",
      Resultado_Adm: "",
      Resultado_AdmMultiple: "",

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
    private departamentoService: DepartamentoService,
    private crear_reporteService: Crear_ReporteService,
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,
    private creacion_de_proveedoresService: Creacion_de_ProveedoresService,
    private monedaService: MonedaService,
    private estatus_de_seguimientoService: Estatus_de_SeguimientoService,
    private autorizacionService: AutorizacionService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromNo__Solicitud: [''],
      toNo__Solicitud: [''],
      SolicitanteFilter: [''],
      Solicitante: [''],
      SolicitanteMultiple: [''],
      fromFecha_de_Solicitud: [''],
      toFecha_de_Solicitud: [''],
      DepartamentoFilter: [''],
      Departamento: [''],
      DepartamentoMultiple: [''],
      Numero_de_ReporteFilter: [''],
      Numero_de_Reporte: [''],
      Numero_de_ReporteMultiple: [''],
      Numero_de_O_TFilter: [''],
      Numero_de_O_T: [''],
      Numero_de_O_TMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      Proveedor1Filter: [''],
      Proveedor1: [''],
      Proveedor1Multiple: [''],
      fromTotal_Proveedor1: [''],
      toTotal_Proveedor1: [''],
      fromTotal_Cotizacion_Proveedor1: [''],
      toTotal_Cotizacion_Proveedor1: [''],
      Tipo_de_Moneda1Filter: [''],
      Tipo_de_Moneda1: [''],
      Tipo_de_Moneda1Multiple: [''],
      Proveedor2Filter: [''],
      Proveedor2: [''],
      Proveedor2Multiple: [''],
      fromTotal_Proveedor2: [''],
      toTotal_Proveedor2: [''],
      fromTotal_Cotizacion_Proveedor2: [''],
      toTotal_Cotizacion_Proveedor2: [''],
      Tipo_de_Moneda2Filter: [''],
      Tipo_de_Moneda2: [''],
      Tipo_de_Moneda2Multiple: [''],
      Proveedor3Filter: [''],
      Proveedor3: [''],
      Proveedor3Multiple: [''],
      fromTotal_Proveedor3: [''],
      toTotal_Proveedor3: [''],
      fromTotal_Cotizacion_Proveedor3: [''],
      toTotal_Cotizacion_Proveedor3: [''],
      Tipo_de_Moneda3Filter: [''],
      Tipo_de_Moneda3: [''],
      Tipo_de_Moneda3Multiple: [''],
      Proveedor4Filter: [''],
      Proveedor4: [''],
      Proveedor4Multiple: [''],
      fromTotal_Proveedor4: [''],
      toTotal_Proveedor4: [''],
      fromTotal_Cotizacion_Proveedor4: [''],
      toTotal_Cotizacion_Proveedor4: [''],
      Tipo_de_Moneda4Filter: [''],
      Tipo_de_Moneda4: [''],
      Tipo_de_Moneda4Multiple: [''],
      fromTotal_Cotizacion: [''],
      toTotal_Cotizacion: [''],
      fromTipo_de_Cambio: [''],
      toTipo_de_Cambio: [''],
      Tipo_de_MonedaFilter: [''],
      Tipo_de_Moneda: [''],
      Tipo_de_MonedaMultiple: [''],
      Estatus_de_SeguimientoFilter: [''],
      Estatus_de_Seguimiento: [''],
      Estatus_de_SeguimientoMultiple: [''],
      fromidComprasGenerales: [''],
      toidComprasGenerales: [''],
      fromidGestionAprobacionMantenimiento: [''],
      toidGestionAprobacionMantenimiento: [''],
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
      fromFecha_de_Autorizacion_DG: [''],
      toFecha_de_Autorizacion_DG: [''],
      fromHora_de_Autorizacion_DG: [''],
      toHora_de_Autorizacion_DG: [''],
      Autorizado_por_DGFilter: [''],
      Autorizado_por_DG: [''],
      Autorizado_por_DGMultiple: [''],
      Resultado_DGFilter: [''],
      Resultado_DG: [''],
      Resultado_DGMultiple: [''],
      fromFecha_de_Autorizacion_Adm: [''],
      toFecha_de_Autorizacion_Adm: [''],
      fromHora_de_Autorizacion_Adm: [''],
      toHora_de_Autorizacion_Adm: [''],
      Autorizado_por_AdmFilter: [''],
      Autorizado_por_Adm: [''],
      Autorizado_por_AdmMultiple: [''],
      Resultado_AdmFilter: [''],
      Resultado_Adm: [''],
      Resultado_AdmMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Comparativo_de_Proveedores_Piezas/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.departamentoService.getAll());
    observablesArray.push(this.crear_reporteService.getAll());
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.monedaService.getAll());
    observablesArray.push(this.estatus_de_seguimientoService.getAll());
    observablesArray.push(this.autorizacionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,departamentos ,crear_reportes ,orden_de_trabajos ,aeronaves ,modeloss ,creacion_de_proveedoress ,monedas ,estatus_de_seguimientos ,autorizacions ]) => {
		  this.spartan_users = spartan_users;
		  this.departamentos = departamentos;
		  this.crear_reportes = crear_reportes;
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
		  this.monedas = monedas;
		  this.estatus_de_seguimientos = estatus_de_seguimientos;
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
    this.dataListConfig.filterAdvanced.fromFolio = entity.fromFolio;
    this.dataListConfig.filterAdvanced.toFolio = entity.toFolio;
    this.dataListConfig.filterAdvanced.fromNo__Solicitud = entity.fromNo__Solicitud;
    this.dataListConfig.filterAdvanced.toNo__Solicitud = entity.toNo__Solicitud;
    this.dataListConfig.filterAdvanced.SolicitanteFilter = entity.SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Solicitante = entity.Solicitante;
    this.dataListConfig.filterAdvanced.SolicitanteMultiple = entity.SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Solicitud = entity.fromFecha_de_Solicitud;
    this.dataListConfig.filterAdvanced.toFecha_de_Solicitud = entity.toFecha_de_Solicitud;
	this.dataListConfig.filterAdvanced.Razon_de_la_CompraFilter = entity.Razon_de_la_CompraFilter;
	this.dataListConfig.filterAdvanced.Razon_de_la_Compra = entity.Razon_de_la_Compra;
    this.dataListConfig.filterAdvanced.DepartamentoFilter = entity.DepartamentoFilter;
    this.dataListConfig.filterAdvanced.Departamento = entity.Departamento;
    this.dataListConfig.filterAdvanced.DepartamentoMultiple = entity.DepartamentoMultiple;
    this.dataListConfig.filterAdvanced.Numero_de_ReporteFilter = entity.Numero_de_ReporteFilter;
    this.dataListConfig.filterAdvanced.Numero_de_Reporte = entity.Numero_de_Reporte;
    this.dataListConfig.filterAdvanced.Numero_de_ReporteMultiple = entity.Numero_de_ReporteMultiple;
    this.dataListConfig.filterAdvanced.Numero_de_O_TFilter = entity.Numero_de_O_TFilter;
    this.dataListConfig.filterAdvanced.Numero_de_O_T = entity.Numero_de_O_T;
    this.dataListConfig.filterAdvanced.Numero_de_O_TMultiple = entity.Numero_de_O_TMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
	this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
	this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.Proveedor1Filter = entity.Proveedor1Filter;
    this.dataListConfig.filterAdvanced.Proveedor1 = entity.Proveedor1;
    this.dataListConfig.filterAdvanced.Proveedor1Multiple = entity.Proveedor1Multiple;
    this.dataListConfig.filterAdvanced.fromTotal_Proveedor1 = entity.fromTotal_Proveedor1;
    this.dataListConfig.filterAdvanced.toTotal_Proveedor1 = entity.toTotal_Proveedor1;
    this.dataListConfig.filterAdvanced.fromTotal_Cotizacion_Proveedor1 = entity.fromTotal_Cotizacion_Proveedor1;
    this.dataListConfig.filterAdvanced.toTotal_Cotizacion_Proveedor1 = entity.toTotal_Cotizacion_Proveedor1;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda1Filter = entity.Tipo_de_Moneda1Filter;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda1 = entity.Tipo_de_Moneda1;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda1Multiple = entity.Tipo_de_Moneda1Multiple;
    this.dataListConfig.filterAdvanced.Proveedor2Filter = entity.Proveedor2Filter;
    this.dataListConfig.filterAdvanced.Proveedor2 = entity.Proveedor2;
    this.dataListConfig.filterAdvanced.Proveedor2Multiple = entity.Proveedor2Multiple;
    this.dataListConfig.filterAdvanced.fromTotal_Proveedor2 = entity.fromTotal_Proveedor2;
    this.dataListConfig.filterAdvanced.toTotal_Proveedor2 = entity.toTotal_Proveedor2;
    this.dataListConfig.filterAdvanced.fromTotal_Cotizacion_Proveedor2 = entity.fromTotal_Cotizacion_Proveedor2;
    this.dataListConfig.filterAdvanced.toTotal_Cotizacion_Proveedor2 = entity.toTotal_Cotizacion_Proveedor2;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda2Filter = entity.Tipo_de_Moneda2Filter;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda2 = entity.Tipo_de_Moneda2;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda2Multiple = entity.Tipo_de_Moneda2Multiple;
    this.dataListConfig.filterAdvanced.Proveedor3Filter = entity.Proveedor3Filter;
    this.dataListConfig.filterAdvanced.Proveedor3 = entity.Proveedor3;
    this.dataListConfig.filterAdvanced.Proveedor3Multiple = entity.Proveedor3Multiple;
    this.dataListConfig.filterAdvanced.fromTotal_Proveedor3 = entity.fromTotal_Proveedor3;
    this.dataListConfig.filterAdvanced.toTotal_Proveedor3 = entity.toTotal_Proveedor3;
    this.dataListConfig.filterAdvanced.fromTotal_Cotizacion_Proveedor3 = entity.fromTotal_Cotizacion_Proveedor3;
    this.dataListConfig.filterAdvanced.toTotal_Cotizacion_Proveedor3 = entity.toTotal_Cotizacion_Proveedor3;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda3Filter = entity.Tipo_de_Moneda3Filter;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda3 = entity.Tipo_de_Moneda3;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda3Multiple = entity.Tipo_de_Moneda3Multiple;
    this.dataListConfig.filterAdvanced.Proveedor4Filter = entity.Proveedor4Filter;
    this.dataListConfig.filterAdvanced.Proveedor4 = entity.Proveedor4;
    this.dataListConfig.filterAdvanced.Proveedor4Multiple = entity.Proveedor4Multiple;
    this.dataListConfig.filterAdvanced.fromTotal_Proveedor4 = entity.fromTotal_Proveedor4;
    this.dataListConfig.filterAdvanced.toTotal_Proveedor4 = entity.toTotal_Proveedor4;
    this.dataListConfig.filterAdvanced.fromTotal_Cotizacion_Proveedor4 = entity.fromTotal_Cotizacion_Proveedor4;
    this.dataListConfig.filterAdvanced.toTotal_Cotizacion_Proveedor4 = entity.toTotal_Cotizacion_Proveedor4;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda4Filter = entity.Tipo_de_Moneda4Filter;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda4 = entity.Tipo_de_Moneda4;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda4Multiple = entity.Tipo_de_Moneda4Multiple;
    this.dataListConfig.filterAdvanced.fromTotal_Cotizacion = entity.fromTotal_Cotizacion;
    this.dataListConfig.filterAdvanced.toTotal_Cotizacion = entity.toTotal_Cotizacion;
    this.dataListConfig.filterAdvanced.fromTipo_de_Cambio = entity.fromTipo_de_Cambio;
    this.dataListConfig.filterAdvanced.toTipo_de_Cambio = entity.toTipo_de_Cambio;
    this.dataListConfig.filterAdvanced.Tipo_de_MonedaFilter = entity.Tipo_de_MonedaFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Moneda = entity.Tipo_de_Moneda;
    this.dataListConfig.filterAdvanced.Tipo_de_MonedaMultiple = entity.Tipo_de_MonedaMultiple;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
    this.dataListConfig.filterAdvanced.Estatus_de_SeguimientoFilter = entity.Estatus_de_SeguimientoFilter;
    this.dataListConfig.filterAdvanced.Estatus_de_Seguimiento = entity.Estatus_de_Seguimiento;
    this.dataListConfig.filterAdvanced.Estatus_de_SeguimientoMultiple = entity.Estatus_de_SeguimientoMultiple;
    this.dataListConfig.filterAdvanced.fromidComprasGenerales = entity.fromidComprasGenerales;
    this.dataListConfig.filterAdvanced.toidComprasGenerales = entity.toidComprasGenerales;
    this.dataListConfig.filterAdvanced.fromidGestionAprobacionMantenimiento = entity.fromidGestionAprobacionMantenimiento;
    this.dataListConfig.filterAdvanced.toidGestionAprobacionMantenimiento = entity.toidGestionAprobacionMantenimiento;
	this.dataListConfig.filterAdvanced.FolioComparativoProvFilter = entity.FolioComparativoProvFilter;
	this.dataListConfig.filterAdvanced.FolioComparativoProv = entity.FolioComparativoProv;
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
	this.dataListConfig.filterAdvanced.Motivo_de_RechazoFilter = entity.Motivo_de_RechazoFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_Rechazo = entity.Motivo_de_Rechazo;
    this.dataListConfig.filterAdvanced.fromFecha_de_Autorizacion_DG = entity.fromFecha_de_Autorizacion_DG;
    this.dataListConfig.filterAdvanced.toFecha_de_Autorizacion_DG = entity.toFecha_de_Autorizacion_DG;
	this.dataListConfig.filterAdvanced.Hora_de_Autorizacion_DGFilter = entity.Hora_de_Autorizacion_DGFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Autorizacion_DG = entity.Hora_de_Autorizacion_DG;
    this.dataListConfig.filterAdvanced.Autorizado_por_DGFilter = entity.Autorizado_por_DGFilter;
    this.dataListConfig.filterAdvanced.Autorizado_por_DG = entity.Autorizado_por_DG;
    this.dataListConfig.filterAdvanced.Autorizado_por_DGMultiple = entity.Autorizado_por_DGMultiple;
    this.dataListConfig.filterAdvanced.Resultado_DGFilter = entity.Resultado_DGFilter;
    this.dataListConfig.filterAdvanced.Resultado_DG = entity.Resultado_DG;
    this.dataListConfig.filterAdvanced.Resultado_DGMultiple = entity.Resultado_DGMultiple;
	this.dataListConfig.filterAdvanced.Motivo_de_Rechazo_DGFilter = entity.Motivo_de_Rechazo_DGFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_Rechazo_DG = entity.Motivo_de_Rechazo_DG;
    this.dataListConfig.filterAdvanced.fromFecha_de_Autorizacion_Adm = entity.fromFecha_de_Autorizacion_Adm;
    this.dataListConfig.filterAdvanced.toFecha_de_Autorizacion_Adm = entity.toFecha_de_Autorizacion_Adm;
	this.dataListConfig.filterAdvanced.Hora_de_Autorizacion_AdmFilter = entity.Hora_de_Autorizacion_AdmFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Autorizacion_Adm = entity.Hora_de_Autorizacion_Adm;
    this.dataListConfig.filterAdvanced.Autorizado_por_AdmFilter = entity.Autorizado_por_AdmFilter;
    this.dataListConfig.filterAdvanced.Autorizado_por_Adm = entity.Autorizado_por_Adm;
    this.dataListConfig.filterAdvanced.Autorizado_por_AdmMultiple = entity.Autorizado_por_AdmMultiple;
    this.dataListConfig.filterAdvanced.Resultado_AdmFilter = entity.Resultado_AdmFilter;
    this.dataListConfig.filterAdvanced.Resultado_Adm = entity.Resultado_Adm;
    this.dataListConfig.filterAdvanced.Resultado_AdmMultiple = entity.Resultado_AdmMultiple;
	this.dataListConfig.filterAdvanced.Motivo_de_Rechazo_AdmFilter = entity.Motivo_de_Rechazo_AdmFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_Rechazo_Adm = entity.Motivo_de_Rechazo_Adm;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Comparativo_de_Proveedores_Piezas/list'], { state: { data: this.dataListConfig } });
  }
}
