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
import { Respuesta } from 'src/app/models/Respuesta';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Estatus_Aeronave } from 'src/app/models/Estatus_Aeronave';
import { Estatus_AeronaveService } from 'src/app/api-services/Estatus_Aeronave.service';


@Component({
  selector: 'app-show-advance-filter-Pasajeros',
  templateUrl: './show-advance-filter-Pasajeros.component.html',
  styleUrls: ['./show-advance-filter-Pasajeros.component.scss']
})
export class ShowAdvanceFilterPasajerosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Nacionalidad_1s: Pais[] = [];
  public Nacionalidad_2s: Pais[] = [];
  public Generos: Genero[] = [];
  public Pertenece_al_grupos: Respuesta[] = [];
  public Activos: Estatus_Aeronave[] = [];
  public Paiss: Pais[] = [];
  public Pais_1s: Pais[] = [];
  public Pais_2s: Pais[] = [];
  public Pais_4s: Pais[] = [];

  public paiss: Pais;
  public generos: Genero;
  public respuestas: Respuesta;
  public estatus_aeronaves: Estatus_Aeronave;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Identificador_Alias",
      "Nombre_s",
      "Apellido_paterno",
      "Apellido_materno",
      "Nombre_completo",
      "Telefono",
      "Celular",
      "Correo_electronico",
      "Fecha_de_nacimiento",
      "Edad",
      "Nacionalidad_1",
      "Nacionalidad_2",
      "Genero",
      "Pertenece_al_grupo",
      "Activo",
      "Numero_de_Pasaporte_1",
      "Fecha_de_Emision_Pasaporte_1",
      "Fecha_de_vencimiento_pasaporte_1",
      "Alerta_de_vencimiento_pasaporte_1",
      "Pais",
      "Cargar_Pasaporte_1",
      "Numero_de_Pasaporte_2",
      "Fecha_de_Emision_Pasaporte_2",
      "Fecha_de_vencimiento_pasaporte_2",
      "Alerta_de_vencimiento_pasaporte_2",
      "Pais_1",
      "Cargar_Pasaporte_2",
      "Numero_de_Visa_1",
      "Fecha_de_Emision_Visa_1",
      "Fecha_de_vencimiento_visa_1",
      "Alerta_de_vencimiento_Visa_1",
      "Pais_2",
      "Cargar_Visa_1",
      "Numero_de_Visa_2",
      "Fecha_de_Emision_Visa_2",
      "Fecha_de_vencimiento_visa_2",
      "Alerta_de_vencimiento_visa_2",
      "Pais_4",
      "Cargar_Visa_2",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Identificador_Alias_filtro",
      "Nombre_s_filtro",
      "Apellido_paterno_filtro",
      "Apellido_materno_filtro",
      "Nombre_completo_filtro",
      "Telefono_filtro",
      "Celular_filtro",
      "Correo_electronico_filtro",
      "Fecha_de_nacimiento_filtro",
      "Edad_filtro",
      "Nacionalidad_1_filtro",
      "Nacionalidad_2_filtro",
      "Genero_filtro",
      "Pertenece_al_grupo_filtro",
      "Activo_filtro",
      "Numero_de_Pasaporte_1_filtro",
      "Fecha_de_Emision_Pasaporte_1_filtro",
      "Fecha_de_vencimiento_pasaporte_1_filtro",
      "Alerta_de_vencimiento_pasaporte_1_filtro",
      "Pais_filtro",
      "Cargar_Pasaporte_1_filtro",
      "Numero_de_Pasaporte_2_filtro",
      "Fecha_de_Emision_Pasaporte_2_filtro",
      "Fecha_de_vencimiento_pasaporte_2_filtro",
      "Alerta_de_vencimiento_pasaporte_2_filtro",
      "Pais_1_filtro",
      "Cargar_Pasaporte_2_filtro",
      "Numero_de_Visa_1_filtro",
      "Fecha_de_Emision_Visa_1_filtro",
      "Fecha_de_vencimiento_visa_1_filtro",
      "Alerta_de_vencimiento_Visa_1_filtro",
      "Pais_2_filtro",
      "Cargar_Visa_1_filtro",
      "Numero_de_Visa_2_filtro",
      "Fecha_de_Emision_Visa_2_filtro",
      "Fecha_de_vencimiento_visa_2_filtro",
      "Alerta_de_vencimiento_visa_2_filtro",
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
      Identificador_Alias: "",
      Nombre_s: "",
      Apellido_paterno: "",
      Apellido_materno: "",
      Nombre_completo: "",
      Telefono: "",
      Celular: "",
      Correo_electronico: "",
      Fecha_de_nacimiento: null,
      Edad: "",
      Nacionalidad_1: "",
      Nacionalidad_2: "",
      Genero: "",
      Pertenece_al_grupo: "",
      Activo: "",
      Numero_de_Pasaporte_1: "",
      Fecha_de_Emision_Pasaporte_1: null,
      Fecha_de_vencimiento_pasaporte_1: null,
      Alerta_de_vencimiento_pasaporte_1: "",
      Pais: "",
      Cargar_Pasaporte_1: "",
      Numero_de_Pasaporte_2: "",
      Fecha_de_Emision_Pasaporte_2: null,
      Fecha_de_vencimiento_pasaporte_2: null,
      Alerta_de_vencimiento_pasaporte_2: "",
      Pais_1: "",
      Cargar_Pasaporte_2: "",
      Numero_de_Visa_1: "",
      Fecha_de_Emision_Visa_1: null,
      Fecha_de_vencimiento_visa_1: null,
      Alerta_de_vencimiento_Visa_1: "",
      Pais_2: "",
      Cargar_Visa_1: "",
      Numero_de_Visa_2: "",
      Fecha_de_Emision_Visa_2: null,
      Fecha_de_vencimiento_visa_2: null,
      Alerta_de_vencimiento_visa_2: "",
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
      Pertenece_al_grupoFilter: "",
      Pertenece_al_grupo: "",
      Pertenece_al_grupoMultiple: "",
      ActivoFilter: "",
      Activo: "",
      ActivoMultiple: "",
      fromFecha_de_Emision_Pasaporte_1: "",
      toFecha_de_Emision_Pasaporte_1: "",
      fromFecha_de_vencimiento_pasaporte_1: "",
      toFecha_de_vencimiento_pasaporte_1: "",
      PaisFilter: "",
      Pais: "",
      PaisMultiple: "",
      fromFecha_de_Emision_Pasaporte_2: "",
      toFecha_de_Emision_Pasaporte_2: "",
      fromFecha_de_vencimiento_pasaporte_2: "",
      toFecha_de_vencimiento_pasaporte_2: "",
      Pais_1Filter: "",
      Pais_1: "",
      Pais_1Multiple: "",
      fromFecha_de_Emision_Visa_1: "",
      toFecha_de_Emision_Visa_1: "",
      fromFecha_de_vencimiento_visa_1: "",
      toFecha_de_vencimiento_visa_1: "",
      Pais_2Filter: "",
      Pais_2: "",
      Pais_2Multiple: "",
      fromFecha_de_Emision_Visa_2: "",
      toFecha_de_Emision_Visa_2: "",
      fromFecha_de_vencimiento_visa_2: "",
      toFecha_de_vencimiento_visa_2: "",
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
    private respuestaService: RespuestaService,
    private estatus_aeronaveService: Estatus_AeronaveService,

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
      Pertenece_al_grupoFilter: [''],
      Pertenece_al_grupo: [''],
      Pertenece_al_grupoMultiple: [''],
      ActivoFilter: [''],
      Activo: [''],
      ActivoMultiple: [''],
      fromFecha_de_Emision_Pasaporte_1: [''],
      toFecha_de_Emision_Pasaporte_1: [''],
      fromFecha_de_vencimiento_pasaporte_1: [''],
      toFecha_de_vencimiento_pasaporte_1: [''],
      PaisFilter: [''],
      Pais: [''],
      PaisMultiple: [''],
      Cargar_Pasaporte_1Filter: [''],
      Cargar_Pasaporte_1_Completo: [''],
      fromFecha_de_Emision_Pasaporte_2: [''],
      toFecha_de_Emision_Pasaporte_2: [''],
      fromFecha_de_vencimiento_pasaporte_2: [''],
      toFecha_de_vencimiento_pasaporte_2: [''],
      Pais_1Filter: [''],
      Pais_1: [''],
      Pais_1Multiple: [''],
      Cargar_Pasaporte_2Filter: [''],
      Cargar_Pasaporte_2_Completo: [''],
      fromFecha_de_Emision_Visa_1: [''],
      toFecha_de_Emision_Visa_1: [''],
      fromFecha_de_vencimiento_visa_1: [''],
      toFecha_de_vencimiento_visa_1: [''],
      Pais_2Filter: [''],
      Pais_2: [''],
      Pais_2Multiple: [''],
      Cargar_Visa_1Filter: [''],
      Cargar_Visa_1_Completo: [''],
      fromFecha_de_Emision_Visa_2: [''],
      toFecha_de_Emision_Visa_2: [''],
      fromFecha_de_vencimiento_visa_2: [''],
      toFecha_de_vencimiento_visa_2: [''],
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
    this.router.navigate(['Pasajeros/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.paisService.getAll());
    observablesArray.push(this.generoService.getAll());
    observablesArray.push(this.respuestaService.getAll());
    observablesArray.push(this.estatus_aeronaveService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,paiss ,generos ,respuestas ,estatus_aeronaves ]) => {
		  this.paiss = paiss;
		  this.generos = generos;
		  this.respuestas = respuestas;
		  this.estatus_aeronaves = estatus_aeronaves;
          

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
	this.dataListConfig.filterAdvanced.Identificador_AliasFilter = entity.Identificador_AliasFilter;
	this.dataListConfig.filterAdvanced.Identificador_Alias = entity.Identificador_Alias;
	this.dataListConfig.filterAdvanced.Nombre_sFilter = entity.Nombre_sFilter;
	this.dataListConfig.filterAdvanced.Nombre_s = entity.Nombre_s;
	this.dataListConfig.filterAdvanced.Apellido_paternoFilter = entity.Apellido_paternoFilter;
	this.dataListConfig.filterAdvanced.Apellido_paterno = entity.Apellido_paterno;
	this.dataListConfig.filterAdvanced.Apellido_maternoFilter = entity.Apellido_maternoFilter;
	this.dataListConfig.filterAdvanced.Apellido_materno = entity.Apellido_materno;
	this.dataListConfig.filterAdvanced.Nombre_completoFilter = entity.Nombre_completoFilter;
	this.dataListConfig.filterAdvanced.Nombre_completo = entity.Nombre_completo;
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
    this.dataListConfig.filterAdvanced.Pertenece_al_grupoFilter = entity.Pertenece_al_grupoFilter;
    this.dataListConfig.filterAdvanced.Pertenece_al_grupo = entity.Pertenece_al_grupo;
    this.dataListConfig.filterAdvanced.Pertenece_al_grupoMultiple = entity.Pertenece_al_grupoMultiple;
    this.dataListConfig.filterAdvanced.ActivoFilter = entity.ActivoFilter;
    this.dataListConfig.filterAdvanced.Activo = entity.Activo;
    this.dataListConfig.filterAdvanced.ActivoMultiple = entity.ActivoMultiple;
	this.dataListConfig.filterAdvanced.Numero_de_Pasaporte_1Filter = entity.Numero_de_Pasaporte_1Filter;
	this.dataListConfig.filterAdvanced.Numero_de_Pasaporte_1 = entity.Numero_de_Pasaporte_1;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Pasaporte_1 = entity.fromFecha_de_Emision_Pasaporte_1;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Pasaporte_1 = entity.toFecha_de_Emision_Pasaporte_1;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_pasaporte_1 = entity.fromFecha_de_vencimiento_pasaporte_1;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_pasaporte_1 = entity.toFecha_de_vencimiento_pasaporte_1;
    this.dataListConfig.filterAdvanced.PaisFilter = entity.PaisFilter;
    this.dataListConfig.filterAdvanced.Pais = entity.Pais;
    this.dataListConfig.filterAdvanced.PaisMultiple = entity.PaisMultiple;
	this.dataListConfig.filterAdvanced.Numero_de_Pasaporte_2Filter = entity.Numero_de_Pasaporte_2Filter;
	this.dataListConfig.filterAdvanced.Numero_de_Pasaporte_2 = entity.Numero_de_Pasaporte_2;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Pasaporte_2 = entity.fromFecha_de_Emision_Pasaporte_2;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Pasaporte_2 = entity.toFecha_de_Emision_Pasaporte_2;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_pasaporte_2 = entity.fromFecha_de_vencimiento_pasaporte_2;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_pasaporte_2 = entity.toFecha_de_vencimiento_pasaporte_2;
    this.dataListConfig.filterAdvanced.Pais_1Filter = entity.Pais_1Filter;
    this.dataListConfig.filterAdvanced.Pais_1 = entity.Pais_1;
    this.dataListConfig.filterAdvanced.Pais_1Multiple = entity.Pais_1Multiple;
	this.dataListConfig.filterAdvanced.Numero_de_Visa_1Filter = entity.Numero_de_Visa_1Filter;
	this.dataListConfig.filterAdvanced.Numero_de_Visa_1 = entity.Numero_de_Visa_1;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Visa_1 = entity.fromFecha_de_Emision_Visa_1;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Visa_1 = entity.toFecha_de_Emision_Visa_1;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_visa_1 = entity.fromFecha_de_vencimiento_visa_1;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_visa_1 = entity.toFecha_de_vencimiento_visa_1;
    this.dataListConfig.filterAdvanced.Pais_2Filter = entity.Pais_2Filter;
    this.dataListConfig.filterAdvanced.Pais_2 = entity.Pais_2;
    this.dataListConfig.filterAdvanced.Pais_2Multiple = entity.Pais_2Multiple;
	this.dataListConfig.filterAdvanced.Numero_de_Visa_2Filter = entity.Numero_de_Visa_2Filter;
	this.dataListConfig.filterAdvanced.Numero_de_Visa_2 = entity.Numero_de_Visa_2;
    this.dataListConfig.filterAdvanced.fromFecha_de_Emision_Visa_2 = entity.fromFecha_de_Emision_Visa_2;
    this.dataListConfig.filterAdvanced.toFecha_de_Emision_Visa_2 = entity.toFecha_de_Emision_Visa_2;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento_visa_2 = entity.fromFecha_de_vencimiento_visa_2;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento_visa_2 = entity.toFecha_de_vencimiento_visa_2;
    this.dataListConfig.filterAdvanced.Pais_4Filter = entity.Pais_4Filter;
    this.dataListConfig.filterAdvanced.Pais_4 = entity.Pais_4;
    this.dataListConfig.filterAdvanced.Pais_4Multiple = entity.Pais_4Multiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Pasajeros/list'], { state: { data: this.dataListConfig } });
  }
}
