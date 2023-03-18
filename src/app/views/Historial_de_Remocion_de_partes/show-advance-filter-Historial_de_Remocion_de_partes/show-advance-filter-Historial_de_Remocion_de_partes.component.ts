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

import { Estatus_de_remocion } from 'src/app/models/Estatus_de_remocion';
import { Estatus_de_remocionService } from 'src/app/api-services/Estatus_de_remocion.service';
import { Causa_de_remocion } from 'src/app/models/Causa_de_remocion';
import { Causa_de_remocionService } from 'src/app/api-services/Causa_de_remocion.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Tiempo_de_remocion } from 'src/app/models/Tiempo_de_remocion';
import { Tiempo_de_remocionService } from 'src/app/api-services/Tiempo_de_remocion.service';


@Component({
  selector: 'app-show-advance-filter-Historial_de_Remocion_de_partes',
  templateUrl: './show-advance-filter-Historial_de_Remocion_de_partes.component.html',
  styleUrls: ['./show-advance-filter-Historial_de_Remocion_de_partes.component.scss']
})
export class ShowAdvanceFilterHistorial_de_Remocion_de_partesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Estatuss: Estatus_de_remocion[] = [];
  public Causa_de_remocions: Causa_de_remocion[] = [];
  public Usuario_que_realiza_la_remocions: Spartan_User[] = [];
  public Tiempo_de_remocions: Tiempo_de_remocion[] = [];

  public estatus_de_remocions: Estatus_de_remocion;
  public causa_de_remocions: Causa_de_remocion;
  public spartan_users: Spartan_User;
  public tiempo_de_remocions: Tiempo_de_remocion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Descripcion",
      "N_de_parte",
      "N_Serie",
      "Modelo",
      "Posicion",
      "Estatus",
      "Horas_actuales",
      "Ciclos_actuales",
      "Causa_de_remocion",
      "Fecha_de_Remocion",
      "Usuario_que_realiza_la_remocion",
      "Tiempo_de_remocion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Descripcion_filtro",
      "N_de_parte_filtro",
      "N_Serie_filtro",
      "Modelo_filtro",
      "Posicion_filtro",
      "Estatus_filtro",
      "Horas_actuales_filtro",
      "Ciclos_actuales_filtro",
      "Causa_de_remocion_filtro",
      "Fecha_de_Remocion_filtro",
      "Usuario_que_realiza_la_remocion_filtro",
      "Tiempo_de_remocion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Descripcion: "",
      N_de_parte: "",
      N_Serie: "",
      Modelo: "",
      Posicion: "",
      Estatus: "",
      Horas_actuales: "",
      Ciclos_actuales: "",
      Causa_de_remocion: "",
      Fecha_de_Remocion: null,
      Usuario_que_realiza_la_remocion: "",
      Tiempo_de_remocion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromHoras_actuales: "",
      toHoras_actuales: "",
      fromCiclos_actuales: "",
      toCiclos_actuales: "",
      Causa_de_remocionFilter: "",
      Causa_de_remocion: "",
      Causa_de_remocionMultiple: "",
      fromFecha_de_Remocion: "",
      toFecha_de_Remocion: "",
      Usuario_que_realiza_la_remocionFilter: "",
      Usuario_que_realiza_la_remocion: "",
      Usuario_que_realiza_la_remocionMultiple: "",
      Tiempo_de_remocionFilter: "",
      Tiempo_de_remocion: "",
      Tiempo_de_remocionMultiple: "",

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
    private estatus_de_remocionService: Estatus_de_remocionService,
    private causa_de_remocionService: Causa_de_remocionService,
    private spartan_userService: Spartan_UserService,
    private tiempo_de_remocionService: Tiempo_de_remocionService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromHoras_actuales: [''],
      toHoras_actuales: [''],
      fromCiclos_actuales: [''],
      toCiclos_actuales: [''],
      Causa_de_remocionFilter: [''],
      Causa_de_remocion: [''],
      Causa_de_remocionMultiple: [''],
      fromFecha_de_Remocion: [''],
      toFecha_de_Remocion: [''],
      Usuario_que_realiza_la_remocionFilter: [''],
      Usuario_que_realiza_la_remocion: [''],
      Usuario_que_realiza_la_remocionMultiple: [''],
      Tiempo_de_remocionFilter: [''],
      Tiempo_de_remocion: [''],
      Tiempo_de_remocionMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Historial_de_Remocion_de_partes/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.estatus_de_remocionService.getAll());
    observablesArray.push(this.causa_de_remocionService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.tiempo_de_remocionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,estatus_de_remocions ,causa_de_remocions ,spartan_users ,tiempo_de_remocions ]) => {
		  this.estatus_de_remocions = estatus_de_remocions;
		  this.causa_de_remocions = causa_de_remocions;
		  this.spartan_users = spartan_users;
		  this.tiempo_de_remocions = tiempo_de_remocions;
          

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
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
	this.dataListConfig.filterAdvanced.N_de_parteFilter = entity.N_de_parteFilter;
	this.dataListConfig.filterAdvanced.N_de_parte = entity.N_de_parte;
	this.dataListConfig.filterAdvanced.N_SerieFilter = entity.N_SerieFilter;
	this.dataListConfig.filterAdvanced.N_Serie = entity.N_Serie;
	this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
	this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
	this.dataListConfig.filterAdvanced.PosicionFilter = entity.PosicionFilter;
	this.dataListConfig.filterAdvanced.Posicion = entity.Posicion;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.fromHoras_actuales = entity.fromHoras_actuales;
    this.dataListConfig.filterAdvanced.toHoras_actuales = entity.toHoras_actuales;
    this.dataListConfig.filterAdvanced.fromCiclos_actuales = entity.fromCiclos_actuales;
    this.dataListConfig.filterAdvanced.toCiclos_actuales = entity.toCiclos_actuales;
    this.dataListConfig.filterAdvanced.Causa_de_remocionFilter = entity.Causa_de_remocionFilter;
    this.dataListConfig.filterAdvanced.Causa_de_remocion = entity.Causa_de_remocion;
    this.dataListConfig.filterAdvanced.Causa_de_remocionMultiple = entity.Causa_de_remocionMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Remocion = entity.fromFecha_de_Remocion;
    this.dataListConfig.filterAdvanced.toFecha_de_Remocion = entity.toFecha_de_Remocion;
    this.dataListConfig.filterAdvanced.Usuario_que_realiza_la_remocionFilter = entity.Usuario_que_realiza_la_remocionFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_realiza_la_remocion = entity.Usuario_que_realiza_la_remocion;
    this.dataListConfig.filterAdvanced.Usuario_que_realiza_la_remocionMultiple = entity.Usuario_que_realiza_la_remocionMultiple;
    this.dataListConfig.filterAdvanced.Tiempo_de_remocionFilter = entity.Tiempo_de_remocionFilter;
    this.dataListConfig.filterAdvanced.Tiempo_de_remocion = entity.Tiempo_de_remocion;
    this.dataListConfig.filterAdvanced.Tiempo_de_remocionMultiple = entity.Tiempo_de_remocionMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Historial_de_Remocion_de_partes/list'], { state: { data: this.dataListConfig } });
  }
}
