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

import { Modulo_de_Mantenimiento } from 'src/app/models/Modulo_de_Mantenimiento';
import { Modulo_de_MantenimientoService } from 'src/app/api-services/Modulo_de_Mantenimiento.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';
import { Estatus_de_componente } from 'src/app/models/Estatus_de_componente';
import { Estatus_de_componenteService } from 'src/app/api-services/Estatus_de_componente.service';
import { Clasificacion_de_aeronavegabilidad } from 'src/app/models/Clasificacion_de_aeronavegabilidad';
import { Clasificacion_de_aeronavegabilidadService } from 'src/app/api-services/Clasificacion_de_aeronavegabilidad.service';


@Component({
  selector: 'app-show-advance-filter-Control_de_Componentes',
  templateUrl: './show-advance-filter-Control_de_Componentes.component.html',
  styleUrls: ['./show-advance-filter-Control_de_Componentes.component.scss']
})
export class ShowAdvanceFilterControl_de_ComponentesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Id_Mantenimientos: Modulo_de_Mantenimiento[] = [];
  public Modelo_de_aeronaves: Modelos[] = [];
  public Codigo_computarizados: Codigo_Computarizado[] = [];
  public Matriculas: Aeronave[] = [];
  public Numero_de_series: Aeronave[] = [];
  public Codigo_ATAs: Catalogo_codigo_ATA[] = [];
  public Estatus_de_componentes: Estatus_de_componente[] = [];
  public Clasificacion_de_aeronavegabilidads: Clasificacion_de_aeronavegabilidad[] = [];

  public modulo_de_mantenimientos: Modulo_de_Mantenimiento;
  public modeloss: Modelos;
  public codigo_computarizados: Codigo_Computarizado;
  public aeronaves: Aeronave;
  public catalogo_codigo_atas: Catalogo_codigo_ATA;
  public estatus_de_componentes: Estatus_de_componente;
  public clasificacion_de_aeronavegabilidads: Clasificacion_de_aeronavegabilidad;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Id_Mantenimiento",
      "Modelo_de_aeronave",
      "Codigo_computarizado",
      "Matricula",
      "Numero_de_serie",
      "Capitulo_en_el_manual",
      "Codigo_ATA",
      "Descripcion_de_actividad",
      "Estatus_de_componente",
      "Tiempo_de_ejecucion",
      "Velocidad_en_nudos",
      "Color_de_la_cubierta",
      "Color_de_la_aeronave",
      "Clasificacion_de_aeronavegabilidad",
      "Instrucciones",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Id_Mantenimiento_filtro",
      "Modelo_de_aeronave_filtro",
      "Codigo_computarizado_filtro",
      "Matricula_filtro",
      "Numero_de_serie_filtro",
      "Capitulo_en_el_manual_filtro",
      "Codigo_ATA_filtro",
      "Descripcion_de_actividad_filtro",
      "Estatus_de_componente_filtro",
      "Tiempo_de_ejecucion_filtro",
      "Velocidad_en_nudos_filtro",
      "Color_de_la_cubierta_filtro",
      "Color_de_la_aeronave_filtro",
      "Clasificacion_de_aeronavegabilidad_filtro",
      "Instrucciones_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Id_Mantenimiento: "",
      Modelo_de_aeronave: "",
      Codigo_computarizado: "",
      Matricula: "",
      Numero_de_serie: "",
      Capitulo_en_el_manual: "",
      Codigo_ATA: "",
      Descripcion_de_actividad: "",
      Estatus_de_componente: "",
      Tiempo_de_ejecucion: "",
      Velocidad_en_nudos: "",
      Color_de_la_cubierta: "",
      Color_de_la_aeronave: "",
      Clasificacion_de_aeronavegabilidad: "",
      Instrucciones: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Id_MantenimientoFilter: "",
      Id_Mantenimiento: "",
      Id_MantenimientoMultiple: "",
      Modelo_de_aeronaveFilter: "",
      Modelo_de_aeronave: "",
      Modelo_de_aeronaveMultiple: "",
      Codigo_computarizadoFilter: "",
      Codigo_computarizado: "",
      Codigo_computarizadoMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      Numero_de_serieFilter: "",
      Numero_de_serie: "",
      Numero_de_serieMultiple: "",
      Codigo_ATAFilter: "",
      Codigo_ATA: "",
      Codigo_ATAMultiple: "",
      Estatus_de_componenteFilter: "",
      Estatus_de_componente: "",
      Estatus_de_componenteMultiple: "",
      Clasificacion_de_aeronavegabilidadFilter: "",
      Clasificacion_de_aeronavegabilidad: "",
      Clasificacion_de_aeronavegabilidadMultiple: "",

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
    private modulo_de_mantenimientoService: Modulo_de_MantenimientoService,
    private modelosService: ModelosService,
    private codigo_computarizadoService: Codigo_ComputarizadoService,
    private aeronaveService: AeronaveService,
    private catalogo_codigo_ataService: Catalogo_codigo_ATAService,
    private estatus_de_componenteService: Estatus_de_componenteService,
    private clasificacion_de_aeronavegabilidadService: Clasificacion_de_aeronavegabilidadService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Id_MantenimientoFilter: [''],
      Id_Mantenimiento: [''],
      Id_MantenimientoMultiple: [''],
      Modelo_de_aeronaveFilter: [''],
      Modelo_de_aeronave: [''],
      Modelo_de_aeronaveMultiple: [''],
      Codigo_computarizadoFilter: [''],
      Codigo_computarizado: [''],
      Codigo_computarizadoMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      Numero_de_serieFilter: [''],
      Numero_de_serie: [''],
      Numero_de_serieMultiple: [''],
      Codigo_ATAFilter: [''],
      Codigo_ATA: [''],
      Codigo_ATAMultiple: [''],
      Estatus_de_componenteFilter: [''],
      Estatus_de_componente: [''],
      Estatus_de_componenteMultiple: [''],
      Clasificacion_de_aeronavegabilidadFilter: [''],
      Clasificacion_de_aeronavegabilidad: [''],
      Clasificacion_de_aeronavegabilidadMultiple: [''],
      InstruccionesFilter: [''],
      Instrucciones_Completo: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Control_de_Componentes/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.modulo_de_mantenimientoService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.codigo_computarizadoService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.catalogo_codigo_ataService.getAll());
    observablesArray.push(this.estatus_de_componenteService.getAll());
    observablesArray.push(this.clasificacion_de_aeronavegabilidadService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,modulo_de_mantenimientos ,modeloss ,codigo_computarizados ,aeronaves ,catalogo_codigo_atas ,estatus_de_componentes ,clasificacion_de_aeronavegabilidads ]) => {
		  this.modulo_de_mantenimientos = modulo_de_mantenimientos;
		  this.modeloss = modeloss;
		  this.codigo_computarizados = codigo_computarizados;
		  this.aeronaves = aeronaves;
		  this.catalogo_codigo_atas = catalogo_codigo_atas;
		  this.estatus_de_componentes = estatus_de_componentes;
		  this.clasificacion_de_aeronavegabilidads = clasificacion_de_aeronavegabilidads;
          

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
    this.dataListConfig.filterAdvanced.Id_MantenimientoFilter = entity.Id_MantenimientoFilter;
    this.dataListConfig.filterAdvanced.Id_Mantenimiento = entity.Id_Mantenimiento;
    this.dataListConfig.filterAdvanced.Id_MantenimientoMultiple = entity.Id_MantenimientoMultiple;
    this.dataListConfig.filterAdvanced.Modelo_de_aeronaveFilter = entity.Modelo_de_aeronaveFilter;
    this.dataListConfig.filterAdvanced.Modelo_de_aeronave = entity.Modelo_de_aeronave;
    this.dataListConfig.filterAdvanced.Modelo_de_aeronaveMultiple = entity.Modelo_de_aeronaveMultiple;
    this.dataListConfig.filterAdvanced.Codigo_computarizadoFilter = entity.Codigo_computarizadoFilter;
    this.dataListConfig.filterAdvanced.Codigo_computarizado = entity.Codigo_computarizado;
    this.dataListConfig.filterAdvanced.Codigo_computarizadoMultiple = entity.Codigo_computarizadoMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.Numero_de_serieFilter = entity.Numero_de_serieFilter;
    this.dataListConfig.filterAdvanced.Numero_de_serie = entity.Numero_de_serie;
    this.dataListConfig.filterAdvanced.Numero_de_serieMultiple = entity.Numero_de_serieMultiple;
	this.dataListConfig.filterAdvanced.Capitulo_en_el_manualFilter = entity.Capitulo_en_el_manualFilter;
	this.dataListConfig.filterAdvanced.Capitulo_en_el_manual = entity.Capitulo_en_el_manual;
    this.dataListConfig.filterAdvanced.Codigo_ATAFilter = entity.Codigo_ATAFilter;
    this.dataListConfig.filterAdvanced.Codigo_ATA = entity.Codigo_ATA;
    this.dataListConfig.filterAdvanced.Codigo_ATAMultiple = entity.Codigo_ATAMultiple;
	this.dataListConfig.filterAdvanced.Descripcion_de_actividadFilter = entity.Descripcion_de_actividadFilter;
	this.dataListConfig.filterAdvanced.Descripcion_de_actividad = entity.Descripcion_de_actividad;
    this.dataListConfig.filterAdvanced.Estatus_de_componenteFilter = entity.Estatus_de_componenteFilter;
    this.dataListConfig.filterAdvanced.Estatus_de_componente = entity.Estatus_de_componente;
    this.dataListConfig.filterAdvanced.Estatus_de_componenteMultiple = entity.Estatus_de_componenteMultiple;
	this.dataListConfig.filterAdvanced.Tiempo_de_ejecucionFilter = entity.Tiempo_de_ejecucionFilter;
	this.dataListConfig.filterAdvanced.Tiempo_de_ejecucion = entity.Tiempo_de_ejecucion;
	this.dataListConfig.filterAdvanced.Velocidad_en_nudosFilter = entity.Velocidad_en_nudosFilter;
	this.dataListConfig.filterAdvanced.Velocidad_en_nudos = entity.Velocidad_en_nudos;
	this.dataListConfig.filterAdvanced.Color_de_la_cubiertaFilter = entity.Color_de_la_cubiertaFilter;
	this.dataListConfig.filterAdvanced.Color_de_la_cubierta = entity.Color_de_la_cubierta;
	this.dataListConfig.filterAdvanced.Color_de_la_aeronaveFilter = entity.Color_de_la_aeronaveFilter;
	this.dataListConfig.filterAdvanced.Color_de_la_aeronave = entity.Color_de_la_aeronave;
    this.dataListConfig.filterAdvanced.Clasificacion_de_aeronavegabilidadFilter = entity.Clasificacion_de_aeronavegabilidadFilter;
    this.dataListConfig.filterAdvanced.Clasificacion_de_aeronavegabilidad = entity.Clasificacion_de_aeronavegabilidad;
    this.dataListConfig.filterAdvanced.Clasificacion_de_aeronavegabilidadMultiple = entity.Clasificacion_de_aeronavegabilidadMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Control_de_Componentes/list'], { state: { data: this.dataListConfig } });
  }
}
