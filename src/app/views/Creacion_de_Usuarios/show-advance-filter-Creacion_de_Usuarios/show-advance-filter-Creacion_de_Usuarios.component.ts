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
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Estatus_de_Usuario } from 'src/app/models/Estatus_de_Usuario';
import { Estatus_de_UsuarioService } from 'src/app/api-services/Estatus_de_Usuario.service';
import { Horarios_de_Trabajo } from 'src/app/models/Horarios_de_Trabajo';
import { Horarios_de_TrabajoService } from 'src/app/api-services/Horarios_de_Trabajo.service';


@Component({
  selector: 'app-show-advance-filter-Creacion_de_Usuarios',
  templateUrl: './show-advance-filter-Creacion_de_Usuarios.component.html',
  styleUrls: ['./show-advance-filter-Creacion_de_Usuarios.component.scss']
})
export class ShowAdvanceFilterCreacion_de_UsuariosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Cargo_desempenados: Cargos[] = [];
  public Jefe_inmediatos: Spartan_User[] = [];
  public Departamentos: Departamento[] = [];
  public Estatuss: Estatus_de_Usuario[] = [];
  public Horario_de_trabajos: Horarios_de_Trabajo[] = [];

  public cargoss: Cargos;
  public spartan_users: Spartan_User;
  public departamentos: Departamento;
  public estatus_de_usuarios: Estatus_de_Usuario;
  public horarios_de_trabajos: Horarios_de_Trabajo;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Nombres",
      "Apellido_paterno",
      "Apellido_materno",
      "Nombre_completo",
      "Curp",
      "Fecha_de_Nacimiento",
      "Fecha_de_Ingreso",
      "Creacion_de_Usuario",
      "Edad",
      "Tiempo_en_la_Empresa",
      "Cargo_desempenado",
      "Jefe_inmediato",
      "Departamento",
      "Usuario",
      "Contrasena",
      "Estatus",
      "Correo_electronico",
      "Telefono",
      "Celular",
      "Direccion",
      "Horario_de_trabajo",
      "Firma_digital",
      "Usuario_Registrado",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Nombres_filtro",
      "Apellido_paterno_filtro",
      "Apellido_materno_filtro",
      "Nombre_completo_filtro",
      "Curp_filtro",
      "Fecha_de_Nacimiento_filtro",
      "Fecha_de_Ingreso_filtro",
      "Creacion_de_Usuario_filtro",
      "Edad_filtro",
      "Tiempo_en_la_Empresa_filtro",
      "Cargo_desempenado_filtro",
      "Jefe_inmediato_filtro",
      "Departamento_filtro",
      "Usuario_filtro",
      "Contrasena_filtro",
      "Estatus_filtro",
      "Correo_electronico_filtro",
      "Telefono_filtro",
      "Celular_filtro",
      "Direccion_filtro",
      "Horario_de_trabajo_filtro",
      "Firma_digital_filtro",
      "Usuario_Registrado_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      Nombres: "",
      Apellido_paterno: "",
      Apellido_materno: "",
      Nombre_completo: "",
      Curp: "",
      Fecha_de_Nacimiento: null,
      Fecha_de_Ingreso: null,
      Creacion_de_Usuario: null,
      Edad: "",
      Tiempo_en_la_Empresa: "",
      Cargo_desempenado: "",
      Jefe_inmediato: "",
      Departamento: "",
      Usuario: "",
      Contrasena: "",
      Estatus: "",
      Correo_electronico: "",
      Telefono: "",
      Celular: "",
      Direccion: "",
      Horario_de_trabajo: "",
      Firma_digital: "",
      Usuario_Registrado: "",

    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      fromFecha_de_Nacimiento: "",
      toFecha_de_Nacimiento: "",
      fromFecha_de_Ingreso: "",
      toFecha_de_Ingreso: "",
      fromCreacion_de_Usuario: "",
      toCreacion_de_Usuario: "",
      Cargo_desempenadoFilter: "",
      Cargo_desempenado: "",
      Cargo_desempenadoMultiple: "",
      Jefe_inmediatoFilter: "",
      Jefe_inmediato: "",
      Jefe_inmediatoMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      Horario_de_trabajoFilter: "",
      Horario_de_trabajo: "",
      Horario_de_trabajoMultiple: "",
      fromUsuario_Registrado: "",
      toUsuario_Registrado: "",

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
    private departamentoService: DepartamentoService,
    private estatus_de_usuarioService: Estatus_de_UsuarioService,
    private horarios_de_trabajoService: Horarios_de_TrabajoService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromClave: [''],
      toClave: [''],
      fromFecha_de_Nacimiento: [''],
      toFecha_de_Nacimiento: [''],
      fromFecha_de_Ingreso: [''],
      toFecha_de_Ingreso: [''],
      fromCreacion_de_Usuario: [''],
      toCreacion_de_Usuario: [''],
      Cargo_desempenadoFilter: [''],
      Cargo_desempenado: [''],
      Cargo_desempenadoMultiple: [''],
      Jefe_inmediatoFilter: [''],
      Jefe_inmediato: [''],
      Jefe_inmediatoMultiple: [''],
      DepartamentoFilter: [''],
      Departamento: [''],
      DepartamentoMultiple: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      Horario_de_trabajoFilter: [''],
      Horario_de_trabajo: [''],
      Horario_de_trabajoMultiple: [''],
      Firma_digitalFilter: [''],
      Firma_digital_Completo: [''],
      fromUsuario_Registrado: [''],
      toUsuario_Registrado: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Creacion_de_Usuarios/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.cargosService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.departamentoService.getAll());
    observablesArray.push(this.estatus_de_usuarioService.getAll());
    observablesArray.push(this.horarios_de_trabajoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,cargoss ,spartan_users ,departamentos ,estatus_de_usuarios ,horarios_de_trabajos ]) => {
		  this.cargoss = cargoss;
		  this.spartan_users = spartan_users;
		  this.departamentos = departamentos;
		  this.estatus_de_usuarios = estatus_de_usuarios;
		  this.horarios_de_trabajos = horarios_de_trabajos;
          

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
	this.dataListConfig.filterAdvanced.NombresFilter = entity.NombresFilter;
	this.dataListConfig.filterAdvanced.Nombres = entity.Nombres;
	this.dataListConfig.filterAdvanced.Apellido_paternoFilter = entity.Apellido_paternoFilter;
	this.dataListConfig.filterAdvanced.Apellido_paterno = entity.Apellido_paterno;
	this.dataListConfig.filterAdvanced.Apellido_maternoFilter = entity.Apellido_maternoFilter;
	this.dataListConfig.filterAdvanced.Apellido_materno = entity.Apellido_materno;
	this.dataListConfig.filterAdvanced.Nombre_completoFilter = entity.Nombre_completoFilter;
	this.dataListConfig.filterAdvanced.Nombre_completo = entity.Nombre_completo;
	this.dataListConfig.filterAdvanced.CurpFilter = entity.CurpFilter;
	this.dataListConfig.filterAdvanced.Curp = entity.Curp;
    this.dataListConfig.filterAdvanced.fromFecha_de_Nacimiento = entity.fromFecha_de_Nacimiento;
    this.dataListConfig.filterAdvanced.toFecha_de_Nacimiento = entity.toFecha_de_Nacimiento;
    this.dataListConfig.filterAdvanced.fromFecha_de_Ingreso = entity.fromFecha_de_Ingreso;
    this.dataListConfig.filterAdvanced.toFecha_de_Ingreso = entity.toFecha_de_Ingreso;
    this.dataListConfig.filterAdvanced.fromCreacion_de_Usuario = entity.fromCreacion_de_Usuario;
    this.dataListConfig.filterAdvanced.toCreacion_de_Usuario = entity.toCreacion_de_Usuario;
	this.dataListConfig.filterAdvanced.EdadFilter = entity.EdadFilter;
	this.dataListConfig.filterAdvanced.Edad = entity.Edad;
	this.dataListConfig.filterAdvanced.Tiempo_en_la_EmpresaFilter = entity.Tiempo_en_la_EmpresaFilter;
	this.dataListConfig.filterAdvanced.Tiempo_en_la_Empresa = entity.Tiempo_en_la_Empresa;
    this.dataListConfig.filterAdvanced.Cargo_desempenadoFilter = entity.Cargo_desempenadoFilter;
    this.dataListConfig.filterAdvanced.Cargo_desempenado = entity.Cargo_desempenado;
    this.dataListConfig.filterAdvanced.Cargo_desempenadoMultiple = entity.Cargo_desempenadoMultiple;
    this.dataListConfig.filterAdvanced.Jefe_inmediatoFilter = entity.Jefe_inmediatoFilter;
    this.dataListConfig.filterAdvanced.Jefe_inmediato = entity.Jefe_inmediato;
    this.dataListConfig.filterAdvanced.Jefe_inmediatoMultiple = entity.Jefe_inmediatoMultiple;
    this.dataListConfig.filterAdvanced.DepartamentoFilter = entity.DepartamentoFilter;
    this.dataListConfig.filterAdvanced.Departamento = entity.Departamento;
    this.dataListConfig.filterAdvanced.DepartamentoMultiple = entity.DepartamentoMultiple;
	this.dataListConfig.filterAdvanced.UsuarioFilter = entity.UsuarioFilter;
	this.dataListConfig.filterAdvanced.Usuario = entity.Usuario;
	this.dataListConfig.filterAdvanced.ContrasenaFilter = entity.ContrasenaFilter;
	this.dataListConfig.filterAdvanced.Contrasena = entity.Contrasena;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
	this.dataListConfig.filterAdvanced.Correo_electronicoFilter = entity.Correo_electronicoFilter;
	this.dataListConfig.filterAdvanced.Correo_electronico = entity.Correo_electronico;
	this.dataListConfig.filterAdvanced.TelefonoFilter = entity.TelefonoFilter;
	this.dataListConfig.filterAdvanced.Telefono = entity.Telefono;
	this.dataListConfig.filterAdvanced.CelularFilter = entity.CelularFilter;
	this.dataListConfig.filterAdvanced.Celular = entity.Celular;
	this.dataListConfig.filterAdvanced.DireccionFilter = entity.DireccionFilter;
	this.dataListConfig.filterAdvanced.Direccion = entity.Direccion;
    this.dataListConfig.filterAdvanced.Horario_de_trabajoFilter = entity.Horario_de_trabajoFilter;
    this.dataListConfig.filterAdvanced.Horario_de_trabajo = entity.Horario_de_trabajo;
    this.dataListConfig.filterAdvanced.Horario_de_trabajoMultiple = entity.Horario_de_trabajoMultiple;
    this.dataListConfig.filterAdvanced.fromUsuario_Registrado = entity.fromUsuario_Registrado;
    this.dataListConfig.filterAdvanced.toUsuario_Registrado = entity.toUsuario_Registrado;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Creacion_de_Usuarios/list'], { state: { data: this.dataListConfig } });
  }
}
