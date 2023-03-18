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
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';
import { Estatus_de_Solicitud_de_Compras } from 'src/app/models/Estatus_de_Solicitud_de_Compras';
import { Estatus_de_Solicitud_de_ComprasService } from 'src/app/api-services/Estatus_de_Solicitud_de_Compras.service';
import { Tipo_de_Solicitud_de_Compras } from 'src/app/models/Tipo_de_Solicitud_de_Compras';
import { Tipo_de_Solicitud_de_ComprasService } from 'src/app/api-services/Tipo_de_Solicitud_de_Compras.service';


@Component({
  selector: 'app-show-advance-filter-Solicitud_de_Servicios_para_Operaciones',
  templateUrl: './show-advance-filter-Solicitud_de_Servicios_para_Operaciones.component.html',
  styleUrls: ['./show-advance-filter-Solicitud_de_Servicios_para_Operaciones.component.scss']
})
export class ShowAdvanceFilterSolicitud_de_Servicios_para_OperacionesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Usuario_que_Registras: Spartan_User[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];
  public No__de_Vuelos: Solicitud_de_Vuelo[] = [];
  public Tramos: Registro_de_vuelo[] = [];
  public Estatuss: Estatus_de_Solicitud_de_Compras[] = [];
  public Tipos: Tipo_de_Solicitud_de_Compras[] = [];

  public spartan_users: Spartan_User;
  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public registro_de_vuelos: Registro_de_vuelo;
  public estatus_de_solicitud_de_comprass: Estatus_de_Solicitud_de_Compras;
  public tipo_de_solicitud_de_comprass: Tipo_de_Solicitud_de_Compras;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "No_de_Solicitud",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Proveedor",
      "No__de_Vuelo",
      "Tramo",
      "Observaciones",
      "Estatus",
      "Tipo",
      "No_Solicitud",

    ],
    columns_filters: [
      "acciones_filtro",
      "No_de_Solicitud_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Proveedor_filtro",
      "No__de_Vuelo_filtro",
      "Tramo_filtro",
      "Observaciones_filtro",
      "Estatus_filtro",
      "Tipo_filtro",
      "No_Solicitud_filtro",

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
      Proveedor: "",
      No__de_Vuelo: "",
      Tramo: "",
      Observaciones: "",
      Estatus: "",
      Tipo: "",
      No_Solicitud: "",

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
      No__de_VueloFilter: "",
      No__de_Vuelo: "",
      No__de_VueloMultiple: "",
      TramoFilter: "",
      Tramo: "",
      TramoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",

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
    private registro_de_vueloService: Registro_de_vueloService,
    private estatus_de_solicitud_de_comprasService: Estatus_de_Solicitud_de_ComprasService,
    private tipo_de_solicitud_de_comprasService: Tipo_de_Solicitud_de_ComprasService,

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
      No__de_VueloFilter: [''],
      No__de_Vuelo: [''],
      No__de_VueloMultiple: [''],
      TramoFilter: [''],
      Tramo: [''],
      TramoMultiple: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      TipoFilter: [''],
      Tipo: [''],
      TipoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Solicitud_de_Servicios_para_Operaciones/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.registro_de_vueloService.getAll());
    observablesArray.push(this.estatus_de_solicitud_de_comprasService.getAll());
    observablesArray.push(this.tipo_de_solicitud_de_comprasService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,creacion_de_proveedoress ,solicitud_de_vuelos ,registro_de_vuelos ,estatus_de_solicitud_de_comprass ,tipo_de_solicitud_de_comprass ]) => {
		  this.spartan_users = spartan_users;
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.registro_de_vuelos = registro_de_vuelos;
		  this.estatus_de_solicitud_de_comprass = estatus_de_solicitud_de_comprass;
		  this.tipo_de_solicitud_de_comprass = tipo_de_solicitud_de_comprass;
          

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
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
    this.dataListConfig.filterAdvanced.No__de_VueloFilter = entity.No__de_VueloFilter;
    this.dataListConfig.filterAdvanced.No__de_Vuelo = entity.No__de_Vuelo;
    this.dataListConfig.filterAdvanced.No__de_VueloMultiple = entity.No__de_VueloMultiple;
    this.dataListConfig.filterAdvanced.TramoFilter = entity.TramoFilter;
    this.dataListConfig.filterAdvanced.Tramo = entity.Tramo;
    this.dataListConfig.filterAdvanced.TramoMultiple = entity.TramoMultiple;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.TipoFilter = entity.TipoFilter;
    this.dataListConfig.filterAdvanced.Tipo = entity.Tipo;
    this.dataListConfig.filterAdvanced.TipoMultiple = entity.TipoMultiple;
	this.dataListConfig.filterAdvanced.No_SolicitudFilter = entity.No_SolicitudFilter;
	this.dataListConfig.filterAdvanced.No_Solicitud = entity.No_Solicitud;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Solicitud_de_Servicios_para_Operaciones/list'], { state: { data: this.dataListConfig } });
  }
}
