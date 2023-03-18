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

import { Pais } from 'src/app/models/Pais';
import { PaisService } from 'src/app/api-services/Pais.service';
import { Genero } from 'src/app/models/Genero';
import { GeneroService } from 'src/app/api-services/Genero.service';
import { Tipo_de_Tripulante } from 'src/app/models/Tipo_de_Tripulante';
import { Tipo_de_TripulanteService } from 'src/app/api-services/Tipo_de_Tripulante.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Estatus_Tripulacion } from 'src/app/models/Estatus_Tripulacion';
import { Estatus_TripulacionService } from 'src/app/api-services/Estatus_Tripulacion.service';
import { Creacion_de_Usuarios } from 'src/app/models/Creacion_de_Usuarios';
import { Creacion_de_UsuariosService } from 'src/app/api-services/Creacion_de_Usuarios.service';


@Component({
  selector: 'app-show-advance-filter-Tripulacion',
  templateUrl: './show-advance-filter-Tripulacion.component.html',
  styleUrls: ['./show-advance-filter-Tripulacion.component.scss']
})
export class ShowAdvanceFilterTripulacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Nacionalidad_1s: Pais[] = [];
  public Nacionalidad_2s: Pais[] = [];
  public Generos: Genero[] = [];
  public Tipo_de_Tripulantes: Tipo_de_Tripulante[] = [];
  public Pertenece_al_grupos: Respuesta[] = [];
  public Estatuss: Estatus_Tripulacion[] = [];
  public Usuario_Relacionados: Creacion_de_Usuarios[] = [];
  public Pais_1s: Pais[] = [];
  public Pais_2s: Pais[] = [];
  public Pais_3s: Pais[] = [];
  public Pais_4s: Pais[] = [];

  public paiss: Pais;
  public generos: Genero;
  public tipo_de_tripulantes: Tipo_de_Tripulante;
  public respuestas: Respuesta;
  public estatus_tripulacions: Estatus_Tripulacion;
  public creacion_de_usuarioss: Creacion_de_Usuarios;

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
      "Direccion",
      "Telefono",
      "Celular",
      "Correo_electronico",
      "Fecha_de_nacimiento",
      "Edad",
      "Nacionalidad_1",
      "Nacionalidad_2",
      "Genero",
      "Tipo_de_Tripulante",
      "Pertenece_al_grupo",
      "Estatus",
      "Usuario_Relacionado",
      "Fotografia",
      "Numero_de_Licencia",
      "Fecha_de_Emision_Licencia",
      "Fecha_de_vencimiento_licencia",
      "Alerta_de_vencimiento_licencia",
      "Cargar_Licencia",
      "Certificado_Medico",
      "Fecha_de_Emision_Certificado",
      "Fecha_de_vencimiento_certificado",
      "Alerta_de_vencimiento_certificado",
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
      "Fecha_de_Emision_visa_1",
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
      "Clave_filtro",
      "Nombres_filtro",
      "Apellido_paterno_filtro",
      "Apellido_materno_filtro",
      "Nombre_completo_filtro",
      "Direccion_filtro",
      "Telefono_filtro",
      "Celular_filtro",
      "Correo_electronico_filtro",
      "Fecha_de_nacimiento_filtro",
      "Edad_filtro",
      "Nacionalidad_1_filtro",
      "Nacionalidad_2_filtro",
      "Genero_filtro",
      "Tipo_de_Tripulante_filtro",
      "Pertenece_al_grupo_filtro",
      "Estatus_filtro",
      "Usuario_Relacionado_filtro",
      "Fotografia_filtro",
      "Numero_de_Licencia_filtro",
      "Fecha_de_Emision_Licencia_filtro",
      "Fecha_de_vencimiento_licencia_filtro",
      "Alerta_de_vencimiento_licencia_filtro",
      "Cargar_Licencia_filtro",
      "Certificado_Medico_filtro",
      "Fecha_de_Emision_Certificado_filtro",
      "Fecha_de_vencimiento_certificado_filtro",
      "Alerta_de_vencimiento_certificado_filtro",
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
      "Fecha_de_Emision_visa_1_filtro",
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
      Clave: "",
      Nombres: "",
      Apellido_paterno: "",
      Apellido_materno: "",
      Nombre_completo: "",
      Direccion: "",
      Telefono: "",
      Celular: "",
      Correo_electronico: "",
      Fecha_de_nacimiento: null,
      Edad: "",
      Nacionalidad_1: "",
      Nacionalidad_2: "",
      Genero: "",
      Tipo_de_Tripulante: "",
      Pertenece_al_grupo: "",
      Estatus: "",
      Usuario_Relacionado: "",
      Fotografia: "",
      Numero_de_Licencia: "",
      Fecha_de_Emision_Licencia: null,
      Fecha_de_vencimiento_licencia: null,
      Alerta_de_vencimiento_licencia: "",
      Cargar_Licencia: "",
      Certificado_Medico: "",
      Fecha_de_Emision_Certificado: null,
      Fecha_de_vencimiento_certificado: null,
      Alerta_de_vencimiento_certificado: "",
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
      Fecha_de_Emision_visa_1: null,
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
      fromClave: "",
      toClave: "",
      fromFecha_de_nacimiento: "",
      toFecha_de_nacimiento: "",
      fromEdad: "",
      toEdad: "",
      Nacionalidad_1Filter: "",
      Nacionalidad_1: "",
      Nacionalidad_1Multiple: "",
      Nacionalidad_2Filter: "",
      Nacionalidad_2: "",
      Nacionalidad_2Multiple: "",
      GeneroFilter: "",
      Genero: "",
      GeneroMultiple: "",
      Tipo_de_TripulanteFilter: "",
      Tipo_de_Tripulante: "",
      Tipo_de_TripulanteMultiple: "",
      Pertenece_al_grupoFilter: "",
      Pertenece_al_grupo: "",
      Pertenece_al_grupoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      Usuario_RelacionadoFilter: "",
      Usuario_Relacionado: "",
      Usuario_RelacionadoMultiple: "",
      fromFecha_de_Emision_Licencia: "",
      toFecha_de_Emision_Licencia: "",
      fromFecha_de_vencimiento_licencia: "",
      toFecha_de_vencimiento_licencia: "",
      fromFecha_de_Emision_Certificado: "",
      toFecha_de_Emision_Certificado: "",
      fromFecha_de_vencimiento_certificado: "",
      toFecha_de_vencimiento_certificado: "",
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
      fromFecha_de_Emision_visa_1: "",
      toFecha_de_Emision_visa_1: "",
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
    private paisService: PaisService,
    private generoService: GeneroService,
    private tipo_de_tripulanteService: Tipo_de_TripulanteService,
    private respuestaService: RespuestaService,
    private estatus_tripulacionService: Estatus_TripulacionService,
    private creacion_de_usuariosService: Creacion_de_UsuariosService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromClave: [''],
      toClave: [''],
      fromFecha_de_nacimiento: [''],
      toFecha_de_nacimiento: [''],
      fromEdad: [''],
      toEdad: [''],
      Nacionalidad_1Filter: [''],
      Nacionalidad_1: [''],
      Nacionalidad_1Multiple: [''],
      Nacionalidad_2Filter: [''],
      Nacionalidad_2: [''],
      Nacionalidad_2Multiple: [''],
      GeneroFilter: [''],
      Genero: [''],
      GeneroMultiple: [''],
      Tipo_de_TripulanteFilter: [''],
      Tipo_de_Tripulante: [''],
      Tipo_de_TripulanteMultiple: [''],
      Pertenece_al_grupoFilter: [''],
      Pertenece_al_grupo: [''],
      Pertenece_al_grupoMultiple: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      Usuario_RelacionadoFilter: [''],
      Usuario_Relacionado: [''],
      Usuario_RelacionadoMultiple: [''],
      FotografiaFilter: [''],
      Fotografia_Completo: [''],
      fromFecha_de_Emision_Licencia: [''],
      toFecha_de_Emision_Licencia: [''],
      fromFecha_de_vencimiento_licencia: [''],
      toFecha_de_vencimiento_licencia: [''],
      Cargar_LicenciaFilter: [''],
      Cargar_Licencia_Completo: [''],
      fromFecha_de_Emision_Certificado: [''],
      toFecha_de_Emision_Certificado: [''],
      fromFecha_de_vencimiento_certificado: [''],
      toFecha_de_vencimiento_certificado: [''],
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
      fromFecha_de_Emision_visa_1: [''],
      toFecha_de_Emision_visa_1: [''],
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
    this.router.navigate(['Tripulacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.paisService.getAll());
    observablesArray.push(this.generoService.getAll());
    observablesArray.push(this.tipo_de_tripulanteService.getAll());
    observablesArray.push(this.respuestaService.getAll());
    observablesArray.push(this.estatus_tripulacionService.getAll());
    observablesArray.push(this.creacion_de_usuariosService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,paiss ,generos ,tipo_de_tripulantes ,respuestas ,estatus_tripulacions ,creacion_de_usuarioss ]) => {
		  this.paiss = paiss;
		  this.generos = generos;
		  this.tipo_de_tripulantes = tipo_de_tripulantes;
		  this.respuestas = respuestas;
		  this.estatus_tripulacions = estatus_tripulacions;
		  this.creacion_de_usuarioss = creacion_de_usuarioss;
          

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
	this.dataListConfig.filterAdvanced.DireccionFilter = entity.DireccionFilter;
	this.dataListConfig.filterAdvanced.Direccion = entity.Direccion;
	this.dataListConfig.filterAdvanced.TelefonoFilter = entity.TelefonoFilter;
	this.dataListConfig.filterAdvanced.Telefono = entity.Telefono;
	this.dataListConfig.filterAdvanced.CelularFilter = entity.CelularFilter;
	this.dataListConfig.filterAdvanced.Celular = entity.Celular;
	this.dataListConfig.filterAdvanced.Correo_electronicoFilter = entity.Correo_electronicoFilter;
	this.dataListConfig.filterAdvanced.Correo_electronico = entity.Correo_electronico;
    this.dataListConfig.filterAdvanced.fromFecha_de_nacimiento = entity.fromFecha_de_nacimiento;
    this.dataListConfig.filterAdvanced.toFecha_de_nacimiento = entity.toFecha_de_nacimiento;
    this.dataListConfig.filterAdvanced.fromEdad = entity.fromEdad;
    this.dataListConfig.filterAdvanced.toEdad = entity.toEdad;
    this.dataListConfig.filterAdvanced.Nacionalidad_1Filter = entity.Nacionalidad_1Filter;
    this.dataListConfig.filterAdvanced.Nacionalidad_1 = entity.Nacionalidad_1;
    this.dataListConfig.filterAdvanced.Nacionalidad_1Multiple = entity.Nacionalidad_1Multiple;
    this.dataListConfig.filterAdvanced.Nacionalidad_2Filter = entity.Nacionalidad_2Filter;
    this.dataListConfig.filterAdvanced.Nacionalidad_2 = entity.Nacionalidad_2;
    this.dataListConfig.filterAdvanced.Nacionalidad_2Multiple = entity.Nacionalidad_2Multiple;
    this.dataListConfig.filterAdvanced.GeneroFilter = entity.GeneroFilter;
    this.dataListConfig.filterAdvanced.Genero = entity.Genero;
    this.dataListConfig.filterAdvanced.GeneroMultiple = entity.GeneroMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_TripulanteFilter = entity.Tipo_de_TripulanteFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Tripulante = entity.Tipo_de_Tripulante;
    this.dataListConfig.filterAdvanced.Tipo_de_TripulanteMultiple = entity.Tipo_de_TripulanteMultiple;
    this.dataListConfig.filterAdvanced.Pertenece_al_grupoFilter = entity.Pertenece_al_grupoFilter;
    this.dataListConfig.filterAdvanced.Pertenece_al_grupo = entity.Pertenece_al_grupo;
    this.dataListConfig.filterAdvanced.Pertenece_al_grupoMultiple = entity.Pertenece_al_grupoMultiple;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.Usuario_RelacionadoFilter = entity.Usuario_RelacionadoFilter;
    this.dataListConfig.filterAdvanced.Usuario_Relacionado = entity.Usuario_Relacionado;
    this.dataListConfig.filterAdvanced.Usuario_RelacionadoMultiple = entity.Usuario_RelacionadoMultiple;
	this.dataListConfig.filterAdvanced.Numero_de_LicenciaFilter = entity.Numero_de_LicenciaFilter;
	this.dataListConfig.filterAdvanced.Numero_de_Licencia = entity.Numero_de_Licencia;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Licencia = entity.fromFecha_de_Emision_Licencia;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Licencia = entity.toFecha_de_Emision_Licencia;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_licencia = entity.fromFecha_de_vencimiento_licencia;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_licencia = entity.toFecha_de_vencimiento_licencia;
	this.dataListConfig.filterAdvanced.Certificado_MedicoFilter = entity.Certificado_MedicoFilter;
	this.dataListConfig.filterAdvanced.Certificado_Medico = entity.Certificado_Medico;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Certificado = entity.fromFecha_de_Emision_Certificado;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Certificado = entity.toFecha_de_Emision_Certificado;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_certificado = entity.fromFecha_de_vencimiento_certificado;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_certificado = entity.toFecha_de_vencimiento_certificado;
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
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_visa_1 = entity.fromFecha_de_Emision_visa_1;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_visa_1 = entity.toFecha_de_Emision_visa_1;
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
    this.router.navigate(['Tripulacion/list'], { state: { data: this.dataListConfig } });
  }
}
