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
import { Estatus_de_Reporte } from 'src/app/models/Estatus_de_Reporte';
import { Estatus_de_ReporteService } from 'src/app/api-services/Estatus_de_Reporte.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';


@Component({
  selector: 'app-show-advance-filter-Productividad_del_area_de_mantenimiento',
  templateUrl: './show-advance-filter-Productividad_del_area_de_mantenimiento.component.html',
  styleUrls: ['./show-advance-filter-Productividad_del_area_de_mantenimiento.component.scss']
})
export class ShowAdvanceFilterProductividad_del_area_de_mantenimientoComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public Estatuss: Estatus_de_Reporte[] = [];
  public Asignado_as: Spartan_User[] = [];
  public Asignar_ejecutantes: Spartan_User[] = [];

  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public estatus_de_reportes: Estatus_de_Reporte;
  public spartan_users: Spartan_User;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "Fecha_de_vencimiento",
      "Estatus",
      "N_Reporte",
      "Asignado_a",
      "Tiempo_estimado_de_ejecucion",
      "Tiempo_real_de_ejecucion",
      "Asignar_ejecutante",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Fecha_de_vencimiento_filtro",
      "Estatus_filtro",
      "N_Reporte_filtro",
      "Asignado_a_filtro",
      "Tiempo_estimado_de_ejecucion_filtro",
      "Tiempo_real_de_ejecucion_filtro",
      "Asignar_ejecutante_filtro",

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
      Fecha_de_vencimiento: null,
      Estatus: "",
      N_Reporte: "",
      Asignado_a: "",
      Tiempo_estimado_de_ejecucion: "",
      Tiempo_real_de_ejecucion: "",
      Asignar_ejecutante: "",

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
      fromFecha_de_vencimiento: "",
      toFecha_de_vencimiento: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      Asignado_aFilter: "",
      Asignado_a: "",
      Asignado_aMultiple: "",
      Asignar_ejecutanteFilter: "",
      Asignar_ejecutante: "",
      Asignar_ejecutanteMultiple: "",

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
    private estatus_de_reporteService: Estatus_de_ReporteService,
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
      fromFecha_de_vencimiento: [''],
      toFecha_de_vencimiento: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      Asignado_aFilter: [''],
      Asignado_a: [''],
      Asignado_aMultiple: [''],
      Asignar_ejecutanteFilter: [''],
      Asignar_ejecutante: [''],
      Asignar_ejecutanteMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Productividad_del_area_de_mantenimiento/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.estatus_de_reporteService.getAll());
    observablesArray.push(this.spartan_userService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeronaves ,modeloss ,estatus_de_reportes ,spartan_users ]) => {
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.estatus_de_reportes = estatus_de_reportes;
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
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento = entity.fromFecha_de_vencimiento;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento = entity.toFecha_de_vencimiento;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
	this.dataListConfig.filterAdvanced.N_ReporteFilter = entity.N_ReporteFilter;
	this.dataListConfig.filterAdvanced.N_Reporte = entity.N_Reporte;
    this.dataListConfig.filterAdvanced.Asignado_aFilter = entity.Asignado_aFilter;
    this.dataListConfig.filterAdvanced.Asignado_a = entity.Asignado_a;
    this.dataListConfig.filterAdvanced.Asignado_aMultiple = entity.Asignado_aMultiple;
	this.dataListConfig.filterAdvanced.Tiempo_estimado_de_ejecucionFilter = entity.Tiempo_estimado_de_ejecucionFilter;
	this.dataListConfig.filterAdvanced.Tiempo_estimado_de_ejecucion = entity.Tiempo_estimado_de_ejecucion;
	this.dataListConfig.filterAdvanced.Tiempo_real_de_ejecucionFilter = entity.Tiempo_real_de_ejecucionFilter;
	this.dataListConfig.filterAdvanced.Tiempo_real_de_ejecucion = entity.Tiempo_real_de_ejecucion;
    this.dataListConfig.filterAdvanced.Asignar_ejecutanteFilter = entity.Asignar_ejecutanteFilter;
    this.dataListConfig.filterAdvanced.Asignar_ejecutante = entity.Asignar_ejecutante;
    this.dataListConfig.filterAdvanced.Asignar_ejecutanteMultiple = entity.Asignar_ejecutanteMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Productividad_del_area_de_mantenimiento/list'], { state: { data: this.dataListConfig } });
  }
}
