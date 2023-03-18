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
import { Funcionalidades_para_Notificacion } from 'src/app/models/Funcionalidades_para_Notificacion';
import { Funcionalidades_para_NotificacionService } from 'src/app/api-services/Funcionalidades_para_Notificacion.service';
import { Tipo_de_Notificacion } from 'src/app/models/Tipo_de_Notificacion';
import { Tipo_de_NotificacionService } from 'src/app/api-services/Tipo_de_Notificacion.service';
import { Tipo_de_Accion_Notificacion } from 'src/app/models/Tipo_de_Accion_Notificacion';
import { Tipo_de_Accion_NotificacionService } from 'src/app/api-services/Tipo_de_Accion_Notificacion.service';
import { Tipo_de_Recordatorio_Notificacion } from 'src/app/models/Tipo_de_Recordatorio_Notificacion';
import { Tipo_de_Recordatorio_NotificacionService } from 'src/app/api-services/Tipo_de_Recordatorio_Notificacion.service';
import { Nombre_del_Campo_en_MS } from 'src/app/models/Nombre_del_Campo_en_MS';
import { Nombre_del_Campo_en_MSService } from 'src/app/api-services/Nombre_del_Campo_en_MS.service';
import { Estatus_Notificacion } from 'src/app/models/Estatus_Notificacion';
import { Estatus_NotificacionService } from 'src/app/api-services/Estatus_Notificacion.service';


@Component({
  selector: 'app-show-advance-filter-Configuracion_de_Notificacion',
  templateUrl: './show-advance-filter-Configuracion_de_Notificacion.component.html',
  styleUrls: ['./show-advance-filter-Configuracion_de_Notificacion.component.scss']
})
export class ShowAdvanceFilterConfiguracion_de_NotificacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Usuario_que_Registras: Spartan_User[] = [];
  public Funcionalidads: Funcionalidades_para_Notificacion[] = [];
  public Tipo_de_Notificacions: Tipo_de_Notificacion[] = [];
  public Tipo_de_Accions: Tipo_de_Accion_Notificacion[] = [];
  public Tipo_de_Recordatorios: Tipo_de_Recordatorio_Notificacion[] = [];
  public Fecha_a_Validars: Nombre_del_Campo_en_MS[] = [];
  public Estatuss: Estatus_Notificacion[] = [];

  public spartan_users: Spartan_User;
  public funcionalidades_para_notificacions: Funcionalidades_para_Notificacion;
  public tipo_de_notificacions: Tipo_de_Notificacion;
  public tipo_de_accion_notificacions: Tipo_de_Accion_Notificacion;
  public tipo_de_recordatorio_notificacions: Tipo_de_Recordatorio_Notificacion;
  public nombre_del_campo_en_mss: Nombre_del_Campo_en_MS;
  public estatus_notificacions: Estatus_Notificacion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Nombre_de_la_Notificacion",
      "Es_Permanente",
      "Funcionalidad",
      "Tipo_de_Notificacion",
      "Tipo_de_Accion",
      "Tipo_de_Recordatorio",
      "Fecha_de_Inicio",
      "Tiene_Fecha_de_Finalizacion_Definida",
      "Cantidad_de_Dias_a_Validar",
      "Fecha_a_Validar",
      "Fecha_Fin",
      "Estatus",
      "Notificar__por_Correo",
      "Texto_que_llevara_el_Correo",
      "Notificacion_push",
      "Texto_a_Mostrar_en_la_Notificacion_push",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Nombre_de_la_Notificacion_filtro",
      "Es_Permanente_filtro",
      "Funcionalidad_filtro",
      "Tipo_de_Notificacion_filtro",
      "Tipo_de_Accion_filtro",
      "Tipo_de_Recordatorio_filtro",
      "Fecha_de_Inicio_filtro",
      "Tiene_Fecha_de_Finalizacion_Definida_filtro",
      "Cantidad_de_Dias_a_Validar_filtro",
      "Fecha_a_Validar_filtro",
      "Fecha_Fin_filtro",
      "Estatus_filtro",
      "Notificar__por_Correo_filtro",
      "Texto_que_llevara_el_Correo_filtro",
      "Notificacion_push_filtro",
      "Texto_a_Mostrar_en_la_Notificacion_push_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Nombre_de_la_Notificacion: "",
      Es_Permanente: "",
      Funcionalidad: "",
      Tipo_de_Notificacion: "",
      Tipo_de_Accion: "",
      Tipo_de_Recordatorio: "",
      Fecha_de_Inicio: null,
      Tiene_Fecha_de_Finalizacion_Definida: "",
      Cantidad_de_Dias_a_Validar: "",
      Fecha_a_Validar: "",
      Fecha_Fin: null,
      Estatus: "",
      Notificar__por_Correo: "",
      Texto_que_llevara_el_Correo: "",
      Notificacion_push: "",
      Texto_a_Mostrar_en_la_Notificacion_push: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      FuncionalidadFilter: "",
      Funcionalidad: "",
      FuncionalidadMultiple: "",
      Tipo_de_NotificacionFilter: "",
      Tipo_de_Notificacion: "",
      Tipo_de_NotificacionMultiple: "",
      Tipo_de_AccionFilter: "",
      Tipo_de_Accion: "",
      Tipo_de_AccionMultiple: "",
      Tipo_de_RecordatorioFilter: "",
      Tipo_de_Recordatorio: "",
      Tipo_de_RecordatorioMultiple: "",
      fromFecha_de_Inicio: "",
      toFecha_de_Inicio: "",
      fromCantidad_de_Dias_a_Validar: "",
      toCantidad_de_Dias_a_Validar: "",
      Fecha_a_ValidarFilter: "",
      Fecha_a_Validar: "",
      Fecha_a_ValidarMultiple: "",
      fromFecha_Fin: "",
      toFecha_Fin: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

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
    private funcionalidades_para_notificacionService: Funcionalidades_para_NotificacionService,
    private tipo_de_notificacionService: Tipo_de_NotificacionService,
    private tipo_de_accion_notificacionService: Tipo_de_Accion_NotificacionService,
    private tipo_de_recordatorio_notificacionService: Tipo_de_Recordatorio_NotificacionService,
    private nombre_del_campo_en_msService: Nombre_del_Campo_en_MSService,
    private estatus_notificacionService: Estatus_NotificacionService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFecha_de_Registro: [''],
      toFecha_de_Registro: [''],
      fromHora_de_Registro: [''],
      toHora_de_Registro: [''],
      Usuario_que_RegistraFilter: [''],
      Usuario_que_Registra: [''],
      Usuario_que_RegistraMultiple: [''],
      FuncionalidadFilter: [''],
      Funcionalidad: [''],
      FuncionalidadMultiple: [''],
      Tipo_de_NotificacionFilter: [''],
      Tipo_de_Notificacion: [''],
      Tipo_de_NotificacionMultiple: [''],
      Tipo_de_AccionFilter: [''],
      Tipo_de_Accion: [''],
      Tipo_de_AccionMultiple: [''],
      Tipo_de_RecordatorioFilter: [''],
      Tipo_de_Recordatorio: [''],
      Tipo_de_RecordatorioMultiple: [''],
      fromFecha_de_Inicio: [''],
      toFecha_de_Inicio: [''],
      fromCantidad_de_Dias_a_Validar: [''],
      toCantidad_de_Dias_a_Validar: [''],
      Fecha_a_ValidarFilter: [''],
      Fecha_a_Validar: [''],
      Fecha_a_ValidarMultiple: [''],
      fromFecha_Fin: [''],
      toFecha_Fin: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Configuracion_de_Notificacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.funcionalidades_para_notificacionService.getAll());
    observablesArray.push(this.tipo_de_notificacionService.getAll());
    observablesArray.push(this.tipo_de_accion_notificacionService.getAll());
    observablesArray.push(this.tipo_de_recordatorio_notificacionService.getAll());
    observablesArray.push(this.nombre_del_campo_en_msService.getAll());
    observablesArray.push(this.estatus_notificacionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,funcionalidades_para_notificacions ,tipo_de_notificacions ,tipo_de_accion_notificacions ,tipo_de_recordatorio_notificacions ,nombre_del_campo_en_mss ,estatus_notificacions ]) => {
		  this.spartan_users = spartan_users;
		  this.funcionalidades_para_notificacions = funcionalidades_para_notificacions;
		  this.tipo_de_notificacions = tipo_de_notificacions;
		  this.tipo_de_accion_notificacions = tipo_de_accion_notificacions;
		  this.tipo_de_recordatorio_notificacions = tipo_de_recordatorio_notificacions;
		  this.nombre_del_campo_en_mss = nombre_del_campo_en_mss;
		  this.estatus_notificacions = estatus_notificacions;
          

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
    this.dataListConfig.filterAdvanced.fromFecha_de_Registro = entity.fromFecha_de_Registro;
    this.dataListConfig.filterAdvanced.toFecha_de_Registro = entity.toFecha_de_Registro;
	this.dataListConfig.filterAdvanced.Hora_de_RegistroFilter = entity.Hora_de_RegistroFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Registro = entity.Hora_de_Registro;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraFilter = entity.Usuario_que_RegistraFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_Registra = entity.Usuario_que_Registra;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraMultiple = entity.Usuario_que_RegistraMultiple;
	this.dataListConfig.filterAdvanced.Nombre_de_la_NotificacionFilter = entity.Nombre_de_la_NotificacionFilter;
	this.dataListConfig.filterAdvanced.Nombre_de_la_Notificacion = entity.Nombre_de_la_Notificacion;
    this.dataListConfig.filterAdvanced.FuncionalidadFilter = entity.FuncionalidadFilter;
    this.dataListConfig.filterAdvanced.Funcionalidad = entity.Funcionalidad;
    this.dataListConfig.filterAdvanced.FuncionalidadMultiple = entity.FuncionalidadMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_NotificacionFilter = entity.Tipo_de_NotificacionFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Notificacion = entity.Tipo_de_Notificacion;
    this.dataListConfig.filterAdvanced.Tipo_de_NotificacionMultiple = entity.Tipo_de_NotificacionMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_AccionFilter = entity.Tipo_de_AccionFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Accion = entity.Tipo_de_Accion;
    this.dataListConfig.filterAdvanced.Tipo_de_AccionMultiple = entity.Tipo_de_AccionMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_RecordatorioFilter = entity.Tipo_de_RecordatorioFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Recordatorio = entity.Tipo_de_Recordatorio;
    this.dataListConfig.filterAdvanced.Tipo_de_RecordatorioMultiple = entity.Tipo_de_RecordatorioMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Inicio = entity.fromFecha_de_Inicio;
    this.dataListConfig.filterAdvanced.toFecha_de_Inicio = entity.toFecha_de_Inicio;
    this.dataListConfig.filterAdvanced.fromCantidad_de_Dias_a_Validar = entity.fromCantidad_de_Dias_a_Validar;
    this.dataListConfig.filterAdvanced.toCantidad_de_Dias_a_Validar = entity.toCantidad_de_Dias_a_Validar;
    this.dataListConfig.filterAdvanced.Fecha_a_ValidarFilter = entity.Fecha_a_ValidarFilter;
    this.dataListConfig.filterAdvanced.Fecha_a_Validar = entity.Fecha_a_Validar;
    this.dataListConfig.filterAdvanced.Fecha_a_ValidarMultiple = entity.Fecha_a_ValidarMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_Fin = entity.fromFecha_Fin;
    this.dataListConfig.filterAdvanced.toFecha_Fin = entity.toFecha_Fin;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
	this.dataListConfig.filterAdvanced.Texto_que_llevara_el_CorreoFilter = entity.Texto_que_llevara_el_CorreoFilter;
	this.dataListConfig.filterAdvanced.Texto_que_llevara_el_Correo = entity.Texto_que_llevara_el_Correo;
	this.dataListConfig.filterAdvanced.Texto_a_Mostrar_en_la_Notificacion_pushFilter = entity.Texto_a_Mostrar_en_la_Notificacion_pushFilter;
	this.dataListConfig.filterAdvanced.Texto_a_Mostrar_en_la_Notificacion_push = entity.Texto_a_Mostrar_en_la_Notificacion_push;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Configuracion_de_Notificacion/list'], { state: { data: this.dataListConfig } });
  }
}
