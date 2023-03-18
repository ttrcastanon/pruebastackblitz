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


@Component({
  selector: 'app-show-advance-filter-Creacion_de_Clientes',
  templateUrl: './show-advance-filter-Creacion_de_Clientes.component.html',
  styleUrls: ['./show-advance-filter-Creacion_de_Clientes.component.scss']
})
export class ShowAdvanceFilterCreacion_de_ClientesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Estatuss: Estatus_de_Cliente[] = [];
  public Pertenece_a_grupo_BALs: Respuesta[] = [];

  public estatus_de_clientes: Estatus_de_Cliente;
  public respuestas: Respuesta;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Razon_Social",
      "Contacto",
      "Correo_Electronico",
      "Direccion_Fiscal",
      "Direccion_Postal",
      "Telefono_de_Contacto",
      "ID_Dynamics",
      "Estatus",
      "Pertenece_a_grupo_BAL",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Razon_Social_filtro",
      "Contacto_filtro",
      "Correo_Electronico_filtro",
      "Direccion_Fiscal_filtro",
      "Direccion_Postal_filtro",
      "Telefono_de_Contacto_filtro",
      "ID_Dynamics_filtro",
      "Estatus_filtro",
      "Pertenece_a_grupo_BAL_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      Razon_Social: "",
      Contacto: "",
      Correo_Electronico: "",
      Direccion_Fiscal: "",
      Direccion_Postal: "",
      Telefono_de_Contacto: "",
      ID_Dynamics: "",
      Estatus: "",
      Pertenece_a_grupo_BAL: "",

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

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Creacion_de_Clientes/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.estatus_de_clienteService.getAll());
    observablesArray.push(this.respuestaService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,estatus_de_clientes ,respuestas ]) => {
		  this.estatus_de_clientes = estatus_de_clientes;
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
    this.dataListConfig.filterAdvanced.fromClave = entity.fromClave;
    this.dataListConfig.filterAdvanced.toClave = entity.toClave;
	this.dataListConfig.filterAdvanced.Razon_SocialFilter = entity.Razon_SocialFilter;
	this.dataListConfig.filterAdvanced.Razon_Social = entity.Razon_Social;
	this.dataListConfig.filterAdvanced.ContactoFilter = entity.ContactoFilter;
	this.dataListConfig.filterAdvanced.Contacto = entity.Contacto;
	this.dataListConfig.filterAdvanced.Correo_ElectronicoFilter = entity.Correo_ElectronicoFilter;
	this.dataListConfig.filterAdvanced.Correo_Electronico = entity.Correo_Electronico;
	this.dataListConfig.filterAdvanced.Direccion_FiscalFilter = entity.Direccion_FiscalFilter;
	this.dataListConfig.filterAdvanced.Direccion_Fiscal = entity.Direccion_Fiscal;
	this.dataListConfig.filterAdvanced.Direccion_PostalFilter = entity.Direccion_PostalFilter;
	this.dataListConfig.filterAdvanced.Direccion_Postal = entity.Direccion_Postal;
	this.dataListConfig.filterAdvanced.Telefono_de_ContactoFilter = entity.Telefono_de_ContactoFilter;
	this.dataListConfig.filterAdvanced.Telefono_de_Contacto = entity.Telefono_de_Contacto;
	this.dataListConfig.filterAdvanced.ID_DynamicsFilter = entity.ID_DynamicsFilter;
	this.dataListConfig.filterAdvanced.ID_Dynamics = entity.ID_Dynamics;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.Pertenece_a_grupo_BALFilter = entity.Pertenece_a_grupo_BALFilter;
    this.dataListConfig.filterAdvanced.Pertenece_a_grupo_BAL = entity.Pertenece_a_grupo_BAL;
    this.dataListConfig.filterAdvanced.Pertenece_a_grupo_BALMultiple = entity.Pertenece_a_grupo_BALMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Creacion_de_Clientes/list'], { state: { data: this.dataListConfig } });
  }
}
