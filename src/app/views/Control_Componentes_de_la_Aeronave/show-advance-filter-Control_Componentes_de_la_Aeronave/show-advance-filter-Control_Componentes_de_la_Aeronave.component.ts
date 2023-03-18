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

import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';


@Component({
  selector: 'app-show-advance-filter-Control_Componentes_de_la_Aeronave',
  templateUrl: './show-advance-filter-Control_Componentes_de_la_Aeronave.component.html',
  styleUrls: ['./show-advance-filter-Control_Componentes_de_la_Aeronave.component.scss']
})
export class ShowAdvanceFilterControl_Componentes_de_la_AeronaveComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public N_series: Aeronave[] = [];
  public Propietarios: Propietarios[] = [];
  public Usuario_que_actualizos: Spartan_User[] = [];

  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public propietarioss: Propietarios;
  public spartan_users: Spartan_User;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "N_serie",
      "Propietario",
      "Fecha_ultima_actualizacion",
      "Usuario_que_actualizo",
      "Codigo_Computarizado_Descripcion",
      "Codigo_ATA",
      "N_Parte",
      "N_de_Serie_Filtro",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "N_serie_filtro",
      "Propietario_filtro",
      "Fecha_ultima_actualizacion_filtro",
      "Usuario_que_actualizo_filtro",
      "Codigo_Computarizado_Descripcion_filtro",
      "Codigo_ATA_filtro",
      "N_Parte_filtro",
      "N_de_Serie_Filtro_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Matricula: "",
      Modelo: "",
      N_serie: "",
      Propietario: "",
      Fecha_ultima_actualizacion: null,
      Usuario_que_actualizo: "",
      Codigo_Computarizado_Descripcion: "",
      Codigo_ATA: "",
      N_Parte: "",
      N_de_Serie_Filtro: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      N_serieFilter: "",
      N_serie: "",
      N_serieMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      fromFecha_ultima_actualizacion: "",
      toFecha_ultima_actualizacion: "",
      Usuario_que_actualizoFilter: "",
      Usuario_que_actualizo: "",
      Usuario_que_actualizoMultiple: "",

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
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,
    private propietariosService: PropietariosService,
    private spartan_userService: Spartan_UserService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      N_serieFilter: [''],
      N_serie: [''],
      N_serieMultiple: [''],
      PropietarioFilter: [''],
      Propietario: [''],
      PropietarioMultiple: [''],
      fromFecha_ultima_actualizacion: [''],
      toFecha_ultima_actualizacion: [''],
      Usuario_que_actualizoFilter: [''],
      Usuario_que_actualizo: [''],
      Usuario_que_actualizoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Control_Componentes_de_la_Aeronave/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.propietariosService.getAll());
    observablesArray.push(this.spartan_userService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeronaves ,modeloss ,propietarioss ,spartan_users ]) => {
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.propietarioss = propietarioss;
		  this.spartan_users = spartan_users;
          

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
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.N_serieFilter = entity.N_serieFilter;
    this.dataListConfig.filterAdvanced.N_serie = entity.N_serie;
    this.dataListConfig.filterAdvanced.N_serieMultiple = entity.N_serieMultiple;
    this.dataListConfig.filterAdvanced.PropietarioFilter = entity.PropietarioFilter;
    this.dataListConfig.filterAdvanced.Propietario = entity.Propietario;
    this.dataListConfig.filterAdvanced.PropietarioMultiple = entity.PropietarioMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_ultima_actualizacion = entity.fromFecha_ultima_actualizacion;
    this.dataListConfig.filterAdvanced.toFecha_ultima_actualizacion = entity.toFecha_ultima_actualizacion;
    this.dataListConfig.filterAdvanced.Usuario_que_actualizoFilter = entity.Usuario_que_actualizoFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_actualizo = entity.Usuario_que_actualizo;
    this.dataListConfig.filterAdvanced.Usuario_que_actualizoMultiple = entity.Usuario_que_actualizoMultiple;
	this.dataListConfig.filterAdvanced.Codigo_Computarizado_DescripcionFilter = entity.Codigo_Computarizado_DescripcionFilter;
	this.dataListConfig.filterAdvanced.Codigo_Computarizado_Descripcion = entity.Codigo_Computarizado_Descripcion;
	this.dataListConfig.filterAdvanced.Codigo_ATAFilter = entity.Codigo_ATAFilter;
	this.dataListConfig.filterAdvanced.Codigo_ATA = entity.Codigo_ATA;
	this.dataListConfig.filterAdvanced.N_ParteFilter = entity.N_ParteFilter;
	this.dataListConfig.filterAdvanced.N_Parte = entity.N_Parte;
	this.dataListConfig.filterAdvanced.N_de_Serie_FiltroFilter = entity.N_de_Serie_FiltroFilter;
	this.dataListConfig.filterAdvanced.N_de_Serie_Filtro = entity.N_de_Serie_Filtro;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Control_Componentes_de_la_Aeronave/list'], { state: { data: this.dataListConfig } });
  }
}
