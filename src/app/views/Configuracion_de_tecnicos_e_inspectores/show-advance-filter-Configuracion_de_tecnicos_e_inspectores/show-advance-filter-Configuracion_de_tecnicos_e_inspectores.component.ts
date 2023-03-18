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

import { Cargos } from 'src/app/models/Cargos';
import { CargosService } from 'src/app/api-services/Cargos.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Creacion_de_Usuarios } from 'src/app/models/Creacion_de_Usuarios';
import { Creacion_de_UsuariosService } from 'src/app/api-services/Creacion_de_Usuarios.service';
import { Pais } from 'src/app/models/Pais';
import { PaisService } from 'src/app/api-services/Pais.service';


@Component({
  selector: 'app-show-advance-filter-Configuracion_de_tecnicos_e_inspectores',
  templateUrl: './show-advance-filter-Configuracion_de_tecnicos_e_inspectores.component.html',
  styleUrls: ['./show-advance-filter-Configuracion_de_tecnicos_e_inspectores.component.scss']
})
export class ShowAdvanceFilterConfiguracion_de_tecnicos_e_inspectoresComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Cargo_desempenados: Cargos[] = [];
  public Usuario_Registrados: Spartan_User[] = [];
  public Usuario_Relacionados: Creacion_de_Usuarios[] = [];
  public Pais_1s: Pais[] = [];
  public Pais_2s: Pais[] = [];
  public Pais_3s: Pais[] = [];
  public Pais_4s: Pais[] = [];

  public cargoss: Cargos;
  public spartan_users: Spartan_User;
  public creacion_de_usuarioss: Creacion_de_Usuarios;
  public paiss: Pais;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Nombres",
      "Apellido_paterno",
      "Apellido_materno",
      "Nombre_completo",
      "Cargo_desempenado",
      "Correo_electronico",
      "Celular",
      "Telefono",
      "Direccion",
      "Usuario_Registrado",
      "Usuario_Relacionado",
      "Numero_de_Licencia",
      "Fecha_de_Emision_Licencia",
      "Fecha_de_vencimiento",
      "Alerta_de_vencimiento",
      "Cargar_Licencia",
      "Certificado_Medico",
      "Fecha_de_Emision_Certificado",
      "Fecha_de_vencimiento_cert",
      "Alerta_de_vencimiento_cert",
      "Cargar_Certificado_Medico",
      "Numero_de_Pasaporte_1",
      "Fecha_de_Emision_Pasaporte_1",
      "Fecha_de_vencimiento_Pasaporte_1",
      "Alerta_de_vencimiento_Pasaporte_1",
      "Pais_1",
      "Cargar_Pasaporte_1",
      "Numero_de_Pasaporte_2",
      "Fecha_de_Emision_Pasaporte_2",
      "Fecha_de_vencimiento_Pasaporte_2",
      "Alerta_de_vencimiento_Pasaporte_2",
      "Pais_2",
      "Cargar_Pasaporte_2",
      "Numero_de_Visa_1",
      "Fecha_de_Emision_Visa_1",
      "Fecha_de_vencimiento_Visa_1",
      "Alerta_de_vencimiento_Visa_1",
      "Pais_3",
      "Cargar_Visa_1",
      "Numero_de_Visa_2",
      "Fecha_de_Emision_Visa_2",
      "Fecha_de_vencimiento_Visa_2",
      "Alerta_de_vencimiento_Visa_2",
      "Pais_4",
      "Cargar_Visa_2",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Nombres_filtro",
      "Apellido_paterno_filtro",
      "Apellido_materno_filtro",
      "Nombre_completo_filtro",
      "Cargo_desempenado_filtro",
      "Correo_electronico_filtro",
      "Celular_filtro",
      "Telefono_filtro",
      "Direccion_filtro",
      "Usuario_Registrado_filtro",
      "Usuario_Relacionado_filtro",
      "Numero_de_Licencia_filtro",
      "Fecha_de_Emision_Licencia_filtro",
      "Fecha_de_vencimiento_filtro",
      "Alerta_de_vencimiento_filtro",
      "Cargar_Licencia_filtro",
      "Certificado_Medico_filtro",
      "Fecha_de_Emision_Certificado_filtro",
      "Fecha_de_vencimiento_cert_filtro",
      "Alerta_de_vencimiento_cert_filtro",
      "Cargar_Certificado_Medico_filtro",
      "Numero_de_Pasaporte_1_filtro",
      "Fecha_de_Emision_Pasaporte_1_filtro",
      "Fecha_de_vencimiento_Pasaporte_1_filtro",
      "Alerta_de_vencimiento_Pasaporte_1_filtro",
      "Pais_1_filtro",
      "Cargar_Pasaporte_1_filtro",
      "Numero_de_Pasaporte_2_filtro",
      "Fecha_de_Emision_Pasaporte_2_filtro",
      "Fecha_de_vencimiento_Pasaporte_2_filtro",
      "Alerta_de_vencimiento_Pasaporte_2_filtro",
      "Pais_2_filtro",
      "Cargar_Pasaporte_2_filtro",
      "Numero_de_Visa_1_filtro",
      "Fecha_de_Emision_Visa_1_filtro",
      "Fecha_de_vencimiento_Visa_1_filtro",
      "Alerta_de_vencimiento_Visa_1_filtro",
      "Pais_3_filtro",
      "Cargar_Visa_1_filtro",
      "Numero_de_Visa_2_filtro",
      "Fecha_de_Emision_Visa_2_filtro",
      "Fecha_de_vencimiento_Visa_2_filtro",
      "Alerta_de_vencimiento_Visa_2_filtro",
      "Pais_4_filtro",
      "Cargar_Visa_2_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Nombres: "",
      Apellido_paterno: "",
      Apellido_materno: "",
      Nombre_completo: "",
      Cargo_desempenado: "",
      Correo_electronico: "",
      Celular: "",
      Telefono: "",
      Direccion: "",
      Usuario_Registrado: "",
      Usuario_Relacionado: "",
      Numero_de_Licencia: "",
      Fecha_de_Emision_Licencia: null,
      Fecha_de_vencimiento: null,
      Alerta_de_vencimiento: "",
      Cargar_Licencia: "",
      Certificado_Medico: "",
      Fecha_de_Emision_Certificado: null,
      Fecha_de_vencimiento_cert: null,
      Alerta_de_vencimiento_cert: "",
      Cargar_Certificado_Medico: "",
      Numero_de_Pasaporte_1: "",
      Fecha_de_Emision_Pasaporte_1: null,
      Fecha_de_vencimiento_Pasaporte_1: null,
      Alerta_de_vencimiento_Pasaporte_1: "",
      Pais_1: "",
      Cargar_Pasaporte_1: "",
      Numero_de_Pasaporte_2: "",
      Fecha_de_Emision_Pasaporte_2: null,
      Fecha_de_vencimiento_Pasaporte_2: null,
      Alerta_de_vencimiento_Pasaporte_2: "",
      Pais_2: "",
      Cargar_Pasaporte_2: "",
      Numero_de_Visa_1: "",
      Fecha_de_Emision_Visa_1: null,
      Fecha_de_vencimiento_Visa_1: null,
      Alerta_de_vencimiento_Visa_1: "",
      Pais_3: "",
      Cargar_Visa_1: "",
      Numero_de_Visa_2: "",
      Fecha_de_Emision_Visa_2: null,
      Fecha_de_vencimiento_Visa_2: null,
      Alerta_de_vencimiento_Visa_2: "",
      Pais_4: "",
      Cargar_Visa_2: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Cargo_desempenadoFilter: "",
      Cargo_desempenado: "",
      Cargo_desempenadoMultiple: "",
      Usuario_RegistradoFilter: "",
      Usuario_Registrado: "",
      Usuario_RegistradoMultiple: "",
      Usuario_RelacionadoFilter: "",
      Usuario_Relacionado: "",
      Usuario_RelacionadoMultiple: "",
      fromFecha_de_Emision_Licencia: "",
      toFecha_de_Emision_Licencia: "",
      fromFecha_de_vencimiento: "",
      toFecha_de_vencimiento: "",
      fromFecha_de_Emision_Certificado: "",
      toFecha_de_Emision_Certificado: "",
      fromFecha_de_vencimiento_cert: "",
      toFecha_de_vencimiento_cert: "",
      fromFecha_de_Emision_Pasaporte_1: "",
      toFecha_de_Emision_Pasaporte_1: "",
      fromFecha_de_vencimiento_Pasaporte_1: "",
      toFecha_de_vencimiento_Pasaporte_1: "",
      Pais_1Filter: "",
      Pais_1: "",
      Pais_1Multiple: "",
      fromFecha_de_Emision_Pasaporte_2: "",
      toFecha_de_Emision_Pasaporte_2: "",
      fromFecha_de_vencimiento_Pasaporte_2: "",
      toFecha_de_vencimiento_Pasaporte_2: "",
      Pais_2Filter: "",
      Pais_2: "",
      Pais_2Multiple: "",
      fromFecha_de_Emision_Visa_1: "",
      toFecha_de_Emision_Visa_1: "",
      fromFecha_de_vencimiento_Visa_1: "",
      toFecha_de_vencimiento_Visa_1: "",
      Pais_3Filter: "",
      Pais_3: "",
      Pais_3Multiple: "",
      fromFecha_de_Emision_Visa_2: "",
      toFecha_de_Emision_Visa_2: "",
      fromFecha_de_vencimiento_Visa_2: "",
      toFecha_de_vencimiento_Visa_2: "",
      Pais_4Filter: "",
      Pais_4: "",
      Pais_4Multiple: "",

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
    private cargosService: CargosService,
    private spartan_userService: Spartan_UserService,
    private creacion_de_usuariosService: Creacion_de_UsuariosService,
    private paisService: PaisService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Cargo_desempenadoFilter: [''],
      Cargo_desempenado: [''],
      Cargo_desempenadoMultiple: [''],
      Usuario_RegistradoFilter: [''],
      Usuario_Registrado: [''],
      Usuario_RegistradoMultiple: [''],
      Usuario_RelacionadoFilter: [''],
      Usuario_Relacionado: [''],
      Usuario_RelacionadoMultiple: [''],
      fromFecha_de_Emision_Licencia: [''],
      toFecha_de_Emision_Licencia: [''],
      fromFecha_de_vencimiento: [''],
      toFecha_de_vencimiento: [''],
      Cargar_LicenciaFilter: [''],
      Cargar_Licencia_Completo: [''],
      fromFecha_de_Emision_Certificado: [''],
      toFecha_de_Emision_Certificado: [''],
      fromFecha_de_vencimiento_cert: [''],
      toFecha_de_vencimiento_cert: [''],
      Cargar_Certificado_MedicoFilter: [''],
      Cargar_Certificado_Medico_Completo: [''],
      fromFecha_de_Emision_Pasaporte_1: [''],
      toFecha_de_Emision_Pasaporte_1: [''],
      fromFecha_de_vencimiento_Pasaporte_1: [''],
      toFecha_de_vencimiento_Pasaporte_1: [''],
      Pais_1Filter: [''],
      Pais_1: [''],
      Pais_1Multiple: [''],
      Cargar_Pasaporte_1Filter: [''],
      Cargar_Pasaporte_1_Completo: [''],
      fromFecha_de_Emision_Pasaporte_2: [''],
      toFecha_de_Emision_Pasaporte_2: [''],
      fromFecha_de_vencimiento_Pasaporte_2: [''],
      toFecha_de_vencimiento_Pasaporte_2: [''],
      Pais_2Filter: [''],
      Pais_2: [''],
      Pais_2Multiple: [''],
      Cargar_Pasaporte_2Filter: [''],
      Cargar_Pasaporte_2_Completo: [''],
      fromFecha_de_Emision_Visa_1: [''],
      toFecha_de_Emision_Visa_1: [''],
      fromFecha_de_vencimiento_Visa_1: [''],
      toFecha_de_vencimiento_Visa_1: [''],
      Pais_3Filter: [''],
      Pais_3: [''],
      Pais_3Multiple: [''],
      Cargar_Visa_1Filter: [''],
      Cargar_Visa_1_Completo: [''],
      fromFecha_de_Emision_Visa_2: [''],
      toFecha_de_Emision_Visa_2: [''],
      fromFecha_de_vencimiento_Visa_2: [''],
      toFecha_de_vencimiento_Visa_2: [''],
      Pais_4Filter: [''],
      Pais_4: [''],
      Pais_4Multiple: [''],
      Cargar_Visa_2Filter: [''],
      Cargar_Visa_2_Completo: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Configuracion_de_tecnicos_e_inspectores/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.cargosService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.creacion_de_usuariosService.getAll());
    observablesArray.push(this.paisService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,cargoss ,spartan_users ,creacion_de_usuarioss ,paiss ]) => {
		  this.cargoss = cargoss;
		  this.spartan_users = spartan_users;
		  this.creacion_de_usuarioss = creacion_de_usuarioss;
		  this.paiss = paiss;
          

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
	this.dataListConfig.filterAdvanced.NombresFilter = entity.NombresFilter;
	this.dataListConfig.filterAdvanced.Nombres = entity.Nombres;
	this.dataListConfig.filterAdvanced.Apellido_paternoFilter = entity.Apellido_paternoFilter;
	this.dataListConfig.filterAdvanced.Apellido_paterno = entity.Apellido_paterno;
	this.dataListConfig.filterAdvanced.Apellido_maternoFilter = entity.Apellido_maternoFilter;
	this.dataListConfig.filterAdvanced.Apellido_materno = entity.Apellido_materno;
	this.dataListConfig.filterAdvanced.Nombre_completoFilter = entity.Nombre_completoFilter;
	this.dataListConfig.filterAdvanced.Nombre_completo = entity.Nombre_completo;
    this.dataListConfig.filterAdvanced.Cargo_desempenadoFilter = entity.Cargo_desempenadoFilter;
    this.dataListConfig.filterAdvanced.Cargo_desempenado = entity.Cargo_desempenado;
    this.dataListConfig.filterAdvanced.Cargo_desempenadoMultiple = entity.Cargo_desempenadoMultiple;
	this.dataListConfig.filterAdvanced.Correo_electronicoFilter = entity.Correo_electronicoFilter;
	this.dataListConfig.filterAdvanced.Correo_electronico = entity.Correo_electronico;
	this.dataListConfig.filterAdvanced.CelularFilter = entity.CelularFilter;
	this.dataListConfig.filterAdvanced.Celular = entity.Celular;
	this.dataListConfig.filterAdvanced.TelefonoFilter = entity.TelefonoFilter;
	this.dataListConfig.filterAdvanced.Telefono = entity.Telefono;
	this.dataListConfig.filterAdvanced.DireccionFilter = entity.DireccionFilter;
	this.dataListConfig.filterAdvanced.Direccion = entity.Direccion;
    this.dataListConfig.filterAdvanced.Usuario_RegistradoFilter = entity.Usuario_RegistradoFilter;
    this.dataListConfig.filterAdvanced.Usuario_Registrado = entity.Usuario_Registrado;
    this.dataListConfig.filterAdvanced.Usuario_RegistradoMultiple = entity.Usuario_RegistradoMultiple;
    this.dataListConfig.filterAdvanced.Usuario_RelacionadoFilter = entity.Usuario_RelacionadoFilter;
    this.dataListConfig.filterAdvanced.Usuario_Relacionado = entity.Usuario_Relacionado;
    this.dataListConfig.filterAdvanced.Usuario_RelacionadoMultiple = entity.Usuario_RelacionadoMultiple;
	this.dataListConfig.filterAdvanced.Numero_de_LicenciaFilter = entity.Numero_de_LicenciaFilter;
	this.dataListConfig.filterAdvanced.Numero_de_Licencia = entity.Numero_de_Licencia;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Licencia = entity.fromFecha_de_Emision_Licencia;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Licencia = entity.toFecha_de_Emision_Licencia;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento = entity.fromFecha_de_vencimiento;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento = entity.toFecha_de_vencimiento;
	this.dataListConfig.filterAdvanced.Certificado_MedicoFilter = entity.Certificado_MedicoFilter;
	this.dataListConfig.filterAdvanced.Certificado_Medico = entity.Certificado_Medico;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Certificado = entity.fromFecha_de_Emision_Certificado;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Certificado = entity.toFecha_de_Emision_Certificado;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_cert = entity.fromFecha_de_vencimiento_cert;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_cert = entity.toFecha_de_vencimiento_cert;
	this.dataListConfig.filterAdvanced.Numero_de_Pasaporte_1Filter = entity.Numero_de_Pasaporte_1Filter;
	this.dataListConfig.filterAdvanced.Numero_de_Pasaporte_1 = entity.Numero_de_Pasaporte_1;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Pasaporte_1 = entity.fromFecha_de_Emision_Pasaporte_1;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Pasaporte_1 = entity.toFecha_de_Emision_Pasaporte_1;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1 = entity.fromFecha_de_vencimiento_Pasaporte_1;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1 = entity.toFecha_de_vencimiento_Pasaporte_1;
    this.dataListConfig.filterAdvanced.Pais_1Filter = entity.Pais_1Filter;
    this.dataListConfig.filterAdvanced.Pais_1 = entity.Pais_1;
    this.dataListConfig.filterAdvanced.Pais_1Multiple = entity.Pais_1Multiple;
	this.dataListConfig.filterAdvanced.Numero_de_Pasaporte_2Filter = entity.Numero_de_Pasaporte_2Filter;
	this.dataListConfig.filterAdvanced.Numero_de_Pasaporte_2 = entity.Numero_de_Pasaporte_2;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Pasaporte_2 = entity.fromFecha_de_Emision_Pasaporte_2;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Pasaporte_2 = entity.toFecha_de_Emision_Pasaporte_2;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2 = entity.fromFecha_de_vencimiento_Pasaporte_2;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2 = entity.toFecha_de_vencimiento_Pasaporte_2;
    this.dataListConfig.filterAdvanced.Pais_2Filter = entity.Pais_2Filter;
    this.dataListConfig.filterAdvanced.Pais_2 = entity.Pais_2;
    this.dataListConfig.filterAdvanced.Pais_2Multiple = entity.Pais_2Multiple;
	this.dataListConfig.filterAdvanced.Numero_de_Visa_1Filter = entity.Numero_de_Visa_1Filter;
	this.dataListConfig.filterAdvanced.Numero_de_Visa_1 = entity.Numero_de_Visa_1;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Visa_1 = entity.fromFecha_de_Emision_Visa_1;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Visa_1 = entity.toFecha_de_Emision_Visa_1;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_Visa_1 = entity.fromFecha_de_vencimiento_Visa_1;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_Visa_1 = entity.toFecha_de_vencimiento_Visa_1;
    this.dataListConfig.filterAdvanced.Pais_3Filter = entity.Pais_3Filter;
    this.dataListConfig.filterAdvanced.Pais_3 = entity.Pais_3;
    this.dataListConfig.filterAdvanced.Pais_3Multiple = entity.Pais_3Multiple;
	this.dataListConfig.filterAdvanced.Numero_de_Visa_2Filter = entity.Numero_de_Visa_2Filter;
	this.dataListConfig.filterAdvanced.Numero_de_Visa_2 = entity.Numero_de_Visa_2;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Visa_2 = entity.fromFecha_de_Emision_Visa_2;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Visa_2 = entity.toFecha_de_Emision_Visa_2;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_Visa_2 = entity.fromFecha_de_vencimiento_Visa_2;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_Visa_2 = entity.toFecha_de_vencimiento_Visa_2;
    this.dataListConfig.filterAdvanced.Pais_4Filter = entity.Pais_4Filter;
    this.dataListConfig.filterAdvanced.Pais_4 = entity.Pais_4;
    this.dataListConfig.filterAdvanced.Pais_4Multiple = entity.Pais_4Multiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Configuracion_de_tecnicos_e_inspectores/list'], { state: { data: this.dataListConfig } });
  }
}
