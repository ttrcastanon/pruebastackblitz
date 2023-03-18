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

import { Piezas } from 'src/app/models/Piezas';
import { PiezasService } from 'src/app/api-services/Piezas.service';
import { Tipos_de_Origen_del_Componente } from 'src/app/models/Tipos_de_Origen_del_Componente';
import { Tipos_de_Origen_del_ComponenteService } from 'src/app/api-services/Tipos_de_Origen_del_Componente.service';
import { Estatus_Parte_Asociada_al_Componente } from 'src/app/models/Estatus_Parte_Asociada_al_Componente';
import { Estatus_Parte_Asociada_al_ComponenteService } from 'src/app/api-services/Estatus_Parte_Asociada_al_Componente.service';
import { Tipo_de_Posicion_de_Piezas } from 'src/app/models/Tipo_de_Posicion_de_Piezas';
import { Tipo_de_Posicion_de_PiezasService } from 'src/app/api-services/Tipo_de_Posicion_de_Piezas.service';


@Component({
  selector: 'app-show-advance-filter-Ingreso_de_Componente',
  templateUrl: './show-advance-filter-Ingreso_de_Componente.component.html',
  styleUrls: ['./show-advance-filter-Ingreso_de_Componente.component.scss']
})
export class ShowAdvanceFilterIngreso_de_ComponenteComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public N_Partes: Piezas[] = [];
  public Descripcions: Piezas[] = [];
  public Origen_del_Componentes: Tipos_de_Origen_del_Componente[] = [];
  public Estatuss: Estatus_Parte_Asociada_al_Componente[] = [];
  public N_de_Series: Piezas[] = [];
  public Posicion_de_la_piezas: Tipo_de_Posicion_de_Piezas[] = [];

  public piezass: Piezas;
  public tipos_de_origen_del_componentes: Tipos_de_Origen_del_Componente;
  public estatus_parte_asociada_al_componentes: Estatus_Parte_Asociada_al_Componente;
  public tipo_de_posicion_de_piezass: Tipo_de_Posicion_de_Piezas;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "N_Parte",
      "Descripcion",
      "Origen_del_Componente",
      "Estatus",
      "N_de_Serie",
      "Posicion_de_la_pieza",
      "Fecha_de_Fabricacion",
      "Fecha_de_Instalacion",
      "Fecha_Reparacion",
      "Horas_acumuladas_parte",
      "Ciclos_acumulados_parte",
      "Horas_Acumuladas_Aeronave",
      "Ciclos_Acumulados_Aeronave",
      "N_OT",
      "N_Reporte",
      "Alerta_en_horas_acumuladas",
      "Alerta_en_ciclos_acumulados",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "N_Parte_filtro",
      "Descripcion_filtro",
      "Origen_del_Componente_filtro",
      "Estatus_filtro",
      "N_de_Serie_filtro",
      "Posicion_de_la_pieza_filtro",
      "Fecha_de_Fabricacion_filtro",
      "Fecha_de_Instalacion_filtro",
      "Fecha_Reparacion_filtro",
      "Horas_acumuladas_parte_filtro",
      "Ciclos_acumulados_parte_filtro",
      "Horas_Acumuladas_Aeronave_filtro",
      "Ciclos_Acumulados_Aeronave_filtro",
      "N_OT_filtro",
      "N_Reporte_filtro",
      "Alerta_en_horas_acumuladas_filtro",
      "Alerta_en_ciclos_acumulados_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      N_Parte: "",
      Descripcion: "",
      Origen_del_Componente: "",
      Estatus: "",
      N_de_Serie: "",
      Posicion_de_la_pieza: "",
      Fecha_de_Fabricacion: null,
      Fecha_de_Instalacion: null,
      Fecha_Reparacion: null,
      Horas_acumuladas_parte: "",
      Ciclos_acumulados_parte: "",
      Horas_Acumuladas_Aeronave: "",
      Ciclos_Acumulados_Aeronave: "",
      N_OT: "",
      N_Reporte: "",
      Alerta_en_horas_acumuladas: "",
      Alerta_en_ciclos_acumulados: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      N_ParteFilter: "",
      N_Parte: "",
      N_ParteMultiple: "",
      DescripcionFilter: "",
      Descripcion: "",
      DescripcionMultiple: "",
      Origen_del_ComponenteFilter: "",
      Origen_del_Componente: "",
      Origen_del_ComponenteMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      N_de_SerieFilter: "",
      N_de_Serie: "",
      N_de_SerieMultiple: "",
      Posicion_de_la_piezaFilter: "",
      Posicion_de_la_pieza: "",
      Posicion_de_la_piezaMultiple: "",
      fromFecha_de_Fabricacion: "",
      toFecha_de_Fabricacion: "",
      fromFecha_de_Instalacion: "",
      toFecha_de_Instalacion: "",
      fromFecha_Reparacion: "",
      toFecha_Reparacion: "",
      fromHoras_acumuladas_parte: "",
      toHoras_acumuladas_parte: "",
      fromCiclos_acumulados_parte: "",
      toCiclos_acumulados_parte: "",
      fromHoras_Acumuladas_Aeronave: "",
      toHoras_Acumuladas_Aeronave: "",
      fromCiclos_Acumulados_Aeronave: "",
      toCiclos_Acumulados_Aeronave: "",

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
    private piezasService: PiezasService,
    private tipos_de_origen_del_componenteService: Tipos_de_Origen_del_ComponenteService,
    private estatus_parte_asociada_al_componenteService: Estatus_Parte_Asociada_al_ComponenteService,
    private tipo_de_posicion_de_piezasService: Tipo_de_Posicion_de_PiezasService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      N_ParteFilter: [''],
      N_Parte: [''],
      N_ParteMultiple: [''],
      DescripcionFilter: [''],
      Descripcion: [''],
      DescripcionMultiple: [''],
      Origen_del_ComponenteFilter: [''],
      Origen_del_Componente: [''],
      Origen_del_ComponenteMultiple: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      N_de_SerieFilter: [''],
      N_de_Serie: [''],
      N_de_SerieMultiple: [''],
      Posicion_de_la_piezaFilter: [''],
      Posicion_de_la_pieza: [''],
      Posicion_de_la_piezaMultiple: [''],
      fromFecha_de_Fabricacion: [''],
      toFecha_de_Fabricacion: [''],
      fromFecha_de_Instalacion: [''],
      toFecha_de_Instalacion: [''],
      fromFecha_Reparacion: [''],
      toFecha_Reparacion: [''],
      fromHoras_acumuladas_parte: [''],
      toHoras_acumuladas_parte: [''],
      fromCiclos_acumulados_parte: [''],
      toCiclos_acumulados_parte: [''],
      fromHoras_Acumuladas_Aeronave: [''],
      toHoras_Acumuladas_Aeronave: [''],
      fromCiclos_Acumulados_Aeronave: [''],
      toCiclos_Acumulados_Aeronave: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Ingreso_de_Componente/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.piezasService.getAll());
    observablesArray.push(this.tipos_de_origen_del_componenteService.getAll());
    observablesArray.push(this.estatus_parte_asociada_al_componenteService.getAll());
    observablesArray.push(this.tipo_de_posicion_de_piezasService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,piezass ,tipos_de_origen_del_componentes ,estatus_parte_asociada_al_componentes ,tipo_de_posicion_de_piezass ]) => {
		  this.piezass = piezass;
		  this.tipos_de_origen_del_componentes = tipos_de_origen_del_componentes;
		  this.estatus_parte_asociada_al_componentes = estatus_parte_asociada_al_componentes;
		  this.tipo_de_posicion_de_piezass = tipo_de_posicion_de_piezass;
          

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
    this.dataListConfig.filterAdvanced.N_ParteFilter = entity.N_ParteFilter;
    this.dataListConfig.filterAdvanced.N_Parte = entity.N_Parte;
    this.dataListConfig.filterAdvanced.N_ParteMultiple = entity.N_ParteMultiple;
    this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
    this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
    this.dataListConfig.filterAdvanced.DescripcionMultiple = entity.DescripcionMultiple;
    this.dataListConfig.filterAdvanced.Origen_del_ComponenteFilter = entity.Origen_del_ComponenteFilter;
    this.dataListConfig.filterAdvanced.Origen_del_Componente = entity.Origen_del_Componente;
    this.dataListConfig.filterAdvanced.Origen_del_ComponenteMultiple = entity.Origen_del_ComponenteMultiple;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.N_de_SerieFilter = entity.N_de_SerieFilter;
    this.dataListConfig.filterAdvanced.N_de_Serie = entity.N_de_Serie;
    this.dataListConfig.filterAdvanced.N_de_SerieMultiple = entity.N_de_SerieMultiple;
    this.dataListConfig.filterAdvanced.Posicion_de_la_piezaFilter = entity.Posicion_de_la_piezaFilter;
    this.dataListConfig.filterAdvanced.Posicion_de_la_pieza = entity.Posicion_de_la_pieza;
    this.dataListConfig.filterAdvanced.Posicion_de_la_piezaMultiple = entity.Posicion_de_la_piezaMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Fabricacion = entity.fromFecha_de_Fabricacion;
    this.dataListConfig.filterAdvanced.toFecha_de_Fabricacion = entity.toFecha_de_Fabricacion;
    this.dataListConfig.filterAdvanced.fromFecha_de_Instalacion = entity.fromFecha_de_Instalacion;
    this.dataListConfig.filterAdvanced.toFecha_de_Instalacion = entity.toFecha_de_Instalacion;
    this.dataListConfig.filterAdvanced.fromFecha_Reparacion = entity.fromFecha_Reparacion;
    this.dataListConfig.filterAdvanced.toFecha_Reparacion = entity.toFecha_Reparacion;
    this.dataListConfig.filterAdvanced.fromHoras_acumuladas_parte = entity.fromHoras_acumuladas_parte;
    this.dataListConfig.filterAdvanced.toHoras_acumuladas_parte = entity.toHoras_acumuladas_parte;
    this.dataListConfig.filterAdvanced.fromCiclos_acumulados_parte = entity.fromCiclos_acumulados_parte;
    this.dataListConfig.filterAdvanced.toCiclos_acumulados_parte = entity.toCiclos_acumulados_parte;
    this.dataListConfig.filterAdvanced.fromHoras_Acumuladas_Aeronave = entity.fromHoras_Acumuladas_Aeronave;
    this.dataListConfig.filterAdvanced.toHoras_Acumuladas_Aeronave = entity.toHoras_Acumuladas_Aeronave;
    this.dataListConfig.filterAdvanced.fromCiclos_Acumulados_Aeronave = entity.fromCiclos_Acumulados_Aeronave;
    this.dataListConfig.filterAdvanced.toCiclos_Acumulados_Aeronave = entity.toCiclos_Acumulados_Aeronave;
	this.dataListConfig.filterAdvanced.N_OTFilter = entity.N_OTFilter;
	this.dataListConfig.filterAdvanced.N_OT = entity.N_OT;
	this.dataListConfig.filterAdvanced.N_ReporteFilter = entity.N_ReporteFilter;
	this.dataListConfig.filterAdvanced.N_Reporte = entity.N_Reporte;
	this.dataListConfig.filterAdvanced.Alerta_en_horas_acumuladasFilter = entity.Alerta_en_horas_acumuladasFilter;
	this.dataListConfig.filterAdvanced.Alerta_en_horas_acumuladas = entity.Alerta_en_horas_acumuladas;
	this.dataListConfig.filterAdvanced.Alerta_en_ciclos_acumuladosFilter = entity.Alerta_en_ciclos_acumuladosFilter;
	this.dataListConfig.filterAdvanced.Alerta_en_ciclos_acumulados = entity.Alerta_en_ciclos_acumulados;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Ingreso_de_Componente/list'], { state: { data: this.dataListConfig } });
  }
}
