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
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Partes } from 'src/app/models/Partes';
import { PartesService } from 'src/app/api-services/Partes.service';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Urgencia } from 'src/app/models/Urgencia';
import { UrgenciaService } from 'src/app/api-services/Urgencia.service';


@Component({
  selector: 'app-show-advance-filter-Seguimiento_de_Solicitud_de_Compras',
  templateUrl: './show-advance-filter-Seguimiento_de_Solicitud_de_Compras.component.html',
  styleUrls: ['./show-advance-filter-Seguimiento_de_Solicitud_de_Compras.component.scss']
})
export class ShowAdvanceFilterSeguimiento_de_Solicitud_de_ComprasComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public Numero_de_Reportes: Crear_Reporte[] = [];
  public Numero_de_Partes: Partes[] = [];
  public Departamentos: Departamento[] = [];
  public Solicitantes: Spartan_User[] = [];
  public Urgencias: Urgencia[] = [];

  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public crear_reportes: Crear_Reporte;
  public partess: Partes;
  public departamentos: Departamento;
  public spartan_users: Spartan_User;
  public urgencias: Urgencia;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "Numero_de_Reporte",
      "Numero_de_Parte",
      "Departamento",
      "Solicitante",
      "Urgencia",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Numero_de_Reporte_filtro",
      "Numero_de_Parte_filtro",
      "Departamento_filtro",
      "Solicitante_filtro",
      "Urgencia_filtro",

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
      Numero_de_Reporte: "",
      Numero_de_Parte: "",
      Departamento: "",
      Solicitante: "",
      Urgencia: "",

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
      Numero_de_ReporteFilter: "",
      Numero_de_Reporte: "",
      Numero_de_ReporteMultiple: "",
      Numero_de_ParteFilter: "",
      Numero_de_Parte: "",
      Numero_de_ParteMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      UrgenciaFilter: "",
      Urgencia: "",
      UrgenciaMultiple: "",

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
    private partesService: PartesService,
    private departamentoService: DepartamentoService,
    private spartan_userService: Spartan_UserService,
    private urgenciaService: UrgenciaService,

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
      Numero_de_ReporteFilter: [''],
      Numero_de_Reporte: [''],
      Numero_de_ReporteMultiple: [''],
      Numero_de_ParteFilter: [''],
      Numero_de_Parte: [''],
      Numero_de_ParteMultiple: [''],
      DepartamentoFilter: [''],
      Departamento: [''],
      DepartamentoMultiple: [''],
      SolicitanteFilter: [''],
      Solicitante: [''],
      SolicitanteMultiple: [''],
      UrgenciaFilter: [''],
      Urgencia: [''],
      UrgenciaMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Seguimiento_de_Solicitud_de_Compras/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.crear_reporteService.getAll());
    observablesArray.push(this.partesService.getAll());
    observablesArray.push(this.departamentoService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.urgenciaService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeronaves ,modeloss ,crear_reportes ,partess ,departamentos ,spartan_users ,urgencias ]) => {
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.crear_reportes = crear_reportes;
		  this.partess = partess;
		  this.departamentos = departamentos;
		  this.spartan_users = spartan_users;
		  this.urgencias = urgencias;
          

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
    this.dataListConfig.filterAdvanced.Numero_de_ReporteFilter = entity.Numero_de_ReporteFilter;
    this.dataListConfig.filterAdvanced.Numero_de_Reporte = entity.Numero_de_Reporte;
    this.dataListConfig.filterAdvanced.Numero_de_ReporteMultiple = entity.Numero_de_ReporteMultiple;
    this.dataListConfig.filterAdvanced.Numero_de_ParteFilter = entity.Numero_de_ParteFilter;
    this.dataListConfig.filterAdvanced.Numero_de_Parte = entity.Numero_de_Parte;
    this.dataListConfig.filterAdvanced.Numero_de_ParteMultiple = entity.Numero_de_ParteMultiple;
    this.dataListConfig.filterAdvanced.DepartamentoFilter = entity.DepartamentoFilter;
    this.dataListConfig.filterAdvanced.Departamento = entity.Departamento;
    this.dataListConfig.filterAdvanced.DepartamentoMultiple = entity.DepartamentoMultiple;
    this.dataListConfig.filterAdvanced.SolicitanteFilter = entity.SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Solicitante = entity.Solicitante;
    this.dataListConfig.filterAdvanced.SolicitanteMultiple = entity.SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.UrgenciaFilter = entity.UrgenciaFilter;
    this.dataListConfig.filterAdvanced.Urgencia = entity.Urgencia;
    this.dataListConfig.filterAdvanced.UrgenciaMultiple = entity.UrgenciaMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Seguimiento_de_Solicitud_de_Compras/list'], { state: { data: this.dataListConfig } });
  }
}
