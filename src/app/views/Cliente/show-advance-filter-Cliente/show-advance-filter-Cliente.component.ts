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

import { Estatus_de_Cliente } from 'src/app/models/Estatus_de_Cliente';
import { Estatus_de_ClienteService } from 'src/app/api-services/Estatus_de_Cliente.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Tipo_de_Cliente } from 'src/app/models/Tipo_de_Cliente';
import { Tipo_de_ClienteService } from 'src/app/api-services/Tipo_de_Cliente.service';


@Component({
  selector: 'app-show-advance-filter-Cliente',
  templateUrl: './show-advance-filter-Cliente.component.html',
  styleUrls: ['./show-advance-filter-Cliente.component.scss']
})
export class ShowAdvanceFilterClienteComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Estatuss: Estatus_de_Cliente[] = [];
  public Pertenece_a_grupo_BALs: Respuesta[] = [];
  public Tipo_de_Clientes: Tipo_de_Cliente[] = [];

  public estatus_de_clientes: Estatus_de_Cliente;
  public respuestas: Respuesta;
  public tipo_de_clientes: Tipo_de_Cliente;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "ID_Dynamics",
      "RFC",
      "Razon_Social",
      "Nombre_Corto",
      "Contacto",
      "Direccion_Fiscal",
      "Direccion_Postal",
      "Correo_Electronico",
      "Telefono_de_Contacto",
      "Telefono_de_Contacto_2",
      "Celular_de_Contacto",
      "Fax",
      "Estatus",
      "Pertenece_a_grupo_BAL",
      "Tipo_de_Cliente",
      "Vigencia_de_Contrato",
      "Cuota_de_mantenimiento",
      "Costo_de_Hora_Rampa",
      "Costos_Hora_Tecnico",
      "Contrato",
      "Part_en_div_por_tramo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "ID_Dynamics_filtro",
      "RFC_filtro",
      "Razon_Social_filtro",
      "Nombre_Corto_filtro",
      "Contacto_filtro",
      "Direccion_Fiscal_filtro",
      "Direccion_Postal_filtro",
      "Correo_Electronico_filtro",
      "Telefono_de_Contacto_filtro",
      "Telefono_de_Contacto_2_filtro",
      "Celular_de_Contacto_filtro",
      "Fax_filtro",
      "Estatus_filtro",
      "Pertenece_a_grupo_BAL_filtro",
      "Tipo_de_Cliente_filtro",
      "Vigencia_de_Contrato_filtro",
      "Cuota_de_mantenimiento_filtro",
      "Costo_de_Hora_Rampa_filtro",
      "Costos_Hora_Tecnico_filtro",
      "Contrato_filtro",
      "Part_en_div_por_tramo_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      ID_Dynamics: "",
      RFC: "",
      Razon_Social: "",
      Nombre_Corto: "",
      Contacto: "",
      Direccion_Fiscal: "",
      Direccion_Postal: "",
      Correo_Electronico: "",
      Telefono_de_Contacto: "",
      Telefono_de_Contacto_2: "",
      Celular_de_Contacto: "",
      Fax: "",
      Estatus: "",
      Pertenece_a_grupo_BAL: "",
      Tipo_de_Cliente: "",
      Vigencia_de_Contrato: null,
      Cuota_de_mantenimiento: "",
      Costo_de_Hora_Rampa: "",
      Costos_Hora_Tecnico: "",
      Contrato: "",
      Part_en_div_por_tramo: "",

    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      Pertenece_a_grupo_BALFilter: "",
      Pertenece_a_grupo_BAL: "",
      Pertenece_a_grupo_BALMultiple: "",
      Tipo_de_ClienteFilter: "",
      Tipo_de_Cliente: "",
      Tipo_de_ClienteMultiple: "",
      fromVigencia_de_Contrato: "",
      toVigencia_de_Contrato: "",
      fromCuota_de_mantenimiento: "",
      toCuota_de_mantenimiento: "",
      fromCosto_de_Hora_Rampa: "",
      toCosto_de_Hora_Rampa: "",
      fromCostos_Hora_Tecnico: "",
      toCostos_Hora_Tecnico: "",

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
    private estatus_de_clienteService: Estatus_de_ClienteService,
    private respuestaService: RespuestaService,
    private tipo_de_clienteService: Tipo_de_ClienteService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromClave: [''],
      toClave: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      Pertenece_a_grupo_BALFilter: [''],
      Pertenece_a_grupo_BAL: [''],
      Pertenece_a_grupo_BALMultiple: [''],
      Tipo_de_ClienteFilter: [''],
      Tipo_de_Cliente: [''],
      Tipo_de_ClienteMultiple: [''],
      fromVigencia_de_Contrato: [''],
      toVigencia_de_Contrato: [''],
      fromCuota_de_mantenimiento: [''],
      toCuota_de_mantenimiento: [''],
      fromCosto_de_Hora_Rampa: [''],
      toCosto_de_Hora_Rampa: [''],
      fromCostos_Hora_Tecnico: [''],
      toCostos_Hora_Tecnico: [''],
      ContratoFilter: [''],
      Contrato_Completo: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Cliente/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.estatus_de_clienteService.getAll());
    observablesArray.push(this.respuestaService.getAll());
    observablesArray.push(this.tipo_de_clienteService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,estatus_de_clientes ,respuestas ,tipo_de_clientes ]) => {
		  this.estatus_de_clientes = estatus_de_clientes;
		  this.respuestas = respuestas;
		  this.tipo_de_clientes = tipo_de_clientes;
          

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
    this.dataListConfig.filterAdvanced.fromClave = entity.fromClave;
    this.dataListConfig.filterAdvanced.toClave = entity.toClave;
	this.dataListConfig.filterAdvanced.ID_DynamicsFilter = entity.ID_DynamicsFilter;
	this.dataListConfig.filterAdvanced.ID_Dynamics = entity.ID_Dynamics;
	this.dataListConfig.filterAdvanced.RFCFilter = entity.RFCFilter;
	this.dataListConfig.filterAdvanced.RFC = entity.RFC;
	this.dataListConfig.filterAdvanced.Razon_SocialFilter = entity.Razon_SocialFilter;
	this.dataListConfig.filterAdvanced.Razon_Social = entity.Razon_Social;
	this.dataListConfig.filterAdvanced.Nombre_CortoFilter = entity.Nombre_CortoFilter;
	this.dataListConfig.filterAdvanced.Nombre_Corto = entity.Nombre_Corto;
	this.dataListConfig.filterAdvanced.ContactoFilter = entity.ContactoFilter;
	this.dataListConfig.filterAdvanced.Contacto = entity.Contacto;
	this.dataListConfig.filterAdvanced.Direccion_FiscalFilter = entity.Direccion_FiscalFilter;
	this.dataListConfig.filterAdvanced.Direccion_Fiscal = entity.Direccion_Fiscal;
	this.dataListConfig.filterAdvanced.Direccion_PostalFilter = entity.Direccion_PostalFilter;
	this.dataListConfig.filterAdvanced.Direccion_Postal = entity.Direccion_Postal;
	this.dataListConfig.filterAdvanced.Correo_ElectronicoFilter = entity.Correo_ElectronicoFilter;
	this.dataListConfig.filterAdvanced.Correo_Electronico = entity.Correo_Electronico;
	this.dataListConfig.filterAdvanced.Telefono_de_ContactoFilter = entity.Telefono_de_ContactoFilter;
	this.dataListConfig.filterAdvanced.Telefono_de_Contacto = entity.Telefono_de_Contacto;
	this.dataListConfig.filterAdvanced.Telefono_de_Contacto_2Filter = entity.Telefono_de_Contacto_2Filter;
	this.dataListConfig.filterAdvanced.Telefono_de_Contacto_2 = entity.Telefono_de_Contacto_2;
	this.dataListConfig.filterAdvanced.Celular_de_ContactoFilter = entity.Celular_de_ContactoFilter;
	this.dataListConfig.filterAdvanced.Celular_de_Contacto = entity.Celular_de_Contacto;
	this.dataListConfig.filterAdvanced.FaxFilter = entity.FaxFilter;
	this.dataListConfig.filterAdvanced.Fax = entity.Fax;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.Pertenece_a_grupo_BALFilter = entity.Pertenece_a_grupo_BALFilter;
    this.dataListConfig.filterAdvanced.Pertenece_a_grupo_BAL = entity.Pertenece_a_grupo_BAL;
    this.dataListConfig.filterAdvanced.Pertenece_a_grupo_BALMultiple = entity.Pertenece_a_grupo_BALMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_ClienteFilter = entity.Tipo_de_ClienteFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Cliente = entity.Tipo_de_Cliente;
    this.dataListConfig.filterAdvanced.Tipo_de_ClienteMultiple = entity.Tipo_de_ClienteMultiple;
    this.dataListConfig.filterAdvanced.fromVigencia_de_Contrato = entity.fromVigencia_de_Contrato;
    this.dataListConfig.filterAdvanced.toVigencia_de_Contrato = entity.toVigencia_de_Contrato;
    this.dataListConfig.filterAdvanced.fromCuota_de_mantenimiento = entity.fromCuota_de_mantenimiento;
    this.dataListConfig.filterAdvanced.toCuota_de_mantenimiento = entity.toCuota_de_mantenimiento;
    this.dataListConfig.filterAdvanced.fromCosto_de_Hora_Rampa = entity.fromCosto_de_Hora_Rampa;
    this.dataListConfig.filterAdvanced.toCosto_de_Hora_Rampa = entity.toCosto_de_Hora_Rampa;
    this.dataListConfig.filterAdvanced.fromCostos_Hora_Tecnico = entity.fromCostos_Hora_Tecnico;
    this.dataListConfig.filterAdvanced.toCostos_Hora_Tecnico = entity.toCostos_Hora_Tecnico;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Cliente/list'], { state: { data: this.dataListConfig } });
  }
}
