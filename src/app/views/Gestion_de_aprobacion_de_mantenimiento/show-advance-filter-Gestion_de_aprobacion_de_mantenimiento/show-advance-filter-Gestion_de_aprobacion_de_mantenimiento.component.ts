import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from '@andufratu/ngx-custom-validators';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Filter } from 'src/app/models/filter';

import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Estatus_Gestion_Aprobacion } from 'src/app/models/Estatus_Gestion_Aprobacion';
import { Estatus_Gestion_AprobacionService } from 'src/app/api-services/Estatus_Gestion_Aprobacion.service';


@Component({
  selector: 'app-show-advance-filter-Gestion_de_aprobacion_de_mantenimiento',
  templateUrl: './show-advance-filter-Gestion_de_aprobacion_de_mantenimiento.component.html',
  styleUrls: ['./show-advance-filter-Gestion_de_aprobacion_de_mantenimiento.component.scss']
})
export class ShowAdvanceFilterGestion_de_aprobacion_de_mantenimientoComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public N_Reportes: Crear_Reporte[] = [];
  public Solicitantes: Spartan_User[] = [];
  public Departamentos: Departamento[] = [];
  public Estatuss: Estatus_Gestion_Aprobacion[] = [];

  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public crear_reportes: Crear_Reporte;
  public spartan_users: Spartan_User;
  public departamentos: Departamento;
  public estatus_gestion_aprobacions: Estatus_Gestion_Aprobacion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "N_Reporte",
      "Solicitante",
      "Departamento",
      "Fecha_de_solicitud",
      "Motivo_de_Cancelacion",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "N_Reporte_filtro",
      "Solicitante_filtro",
      "Departamento_filtro",
      "Fecha_de_solicitud_filtro",
      "Motivo_de_Cancelacion_filtro",
      "Estatus_filtro",

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
      N_Reporte: "",
      Solicitante: "",
      Departamento: "",
      Fecha_de_solicitud: null,
      Motivo_de_Cancelacion: "",
      Estatus: "",

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
      N_ReporteFilter: "",
      N_Reporte: "",
      N_ReporteMultiple: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      fromFecha_de_solicitud: "",
      toFecha_de_solicitud: "",
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
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,
    private crear_reporteService: Crear_ReporteService,
    private spartan_userService: Spartan_UserService,
    private departamentoService: DepartamentoService,
    private estatus_gestion_aprobacionService: Estatus_Gestion_AprobacionService,

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
      N_ReporteFilter: [''],
      N_Reporte: [''],
      N_ReporteMultiple: [''],
      SolicitanteFilter: [''],
      Solicitante: [''],
      SolicitanteMultiple: [''],
      DepartamentoFilter: [''],
      Departamento: [''],
      DepartamentoMultiple: [''],
      fromFecha_de_solicitud: [''],
      toFecha_de_solicitud: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Gestion_de_aprobacion_de_mantenimiento/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.crear_reporteService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.departamentoService.getAll());
    observablesArray.push(this.estatus_gestion_aprobacionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio, aeronaves, modeloss, crear_reportes, spartan_users, departamentos, estatus_gestion_aprobacions]) => {
          this.aeronaves = aeronaves;
          this.modeloss = modeloss;
          this.crear_reportes = crear_reportes;
          this.spartan_users = spartan_users;
          this.departamentos = departamentos;
          this.estatus_gestion_aprobacions = estatus_gestion_aprobacions;


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
    this.dataListConfig.filterAdvanced.N_ReporteFilter = entity.N_ReporteFilter;
    this.dataListConfig.filterAdvanced.N_Reporte = entity.N_Reporte;
    this.dataListConfig.filterAdvanced.N_ReporteMultiple = entity.N_ReporteMultiple;
    this.dataListConfig.filterAdvanced.SolicitanteFilter = entity.SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Solicitante = entity.Solicitante;
    this.dataListConfig.filterAdvanced.SolicitanteMultiple = entity.SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.DepartamentoFilter = entity.DepartamentoFilter;
    this.dataListConfig.filterAdvanced.Departamento = entity.Departamento;
    this.dataListConfig.filterAdvanced.DepartamentoMultiple = entity.DepartamentoMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_solicitud = entity.fromFecha_de_solicitud;
    this.dataListConfig.filterAdvanced.toFecha_de_solicitud = entity.toFecha_de_solicitud;
    this.dataListConfig.filterAdvanced.Motivo_de_CancelacionFilter = entity.Motivo_de_CancelacionFilter;
    this.dataListConfig.filterAdvanced.Motivo_de_Cancelacion = entity.Motivo_de_Cancelacion;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;


    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Gestion_de_aprobacion_de_mantenimiento/list'], { state: { data: this.dataListConfig } });
  }
}
