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
import { Procedencia } from 'src/app/models/Procedencia';
import { ProcedenciaService } from 'src/app/api-services/Procedencia.service';
import { Tipo_de_urgencia } from 'src/app/models/Tipo_de_urgencia';
import { Tipo_de_urgenciaService } from 'src/app/api-services/Tipo_de_urgencia.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';


@Component({
  selector: 'app-show-advance-filter-Boletines_Directivas_aeronavegatibilidad',
  templateUrl: './show-advance-filter-Boletines_Directivas_aeronavegatibilidad.component.html',
  styleUrls: ['./show-advance-filter-Boletines_Directivas_aeronavegatibilidad.component.scss']
})
export class ShowAdvanceFilterBoletines_Directivas_aeronavegatibilidadComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Aeronaves: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public N_Series: Aeronave[] = [];
  public Procedencias: Procedencia[] = [];
  public Tipos: Tipo_de_urgencia[] = [];
  public Codigo_ATAs: Catalogo_codigo_ATA[] = [];

  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public procedencias: Procedencia;
  public tipo_de_urgencias: Tipo_de_urgencia;
  public catalogo_codigo_atas: Catalogo_codigo_ATA;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Aeronave",
      "Modelo",
      "N_Serie",
      "Procedencia",
      "Tipo",
      "N_de_boletin_directiva_aeronavegabilidad",
      "titulo_de_boletin_o_directiva",
      "Codigo_ATA",
      "Fecha_de_creacion",
      "Crear_reporte",
      "Horas",
      "Dias",
      "Meses",
      "Ciclos",
      "Es_recurrente",
      "LimitesEnDias",
      "DiasTranscurridos",
      "DiasFaltantes",
      "HorasFaltantes",
      "CiclosFaltantes",
      "Estatus",
      "HorasTranscurridas",
      "MesesTranscurridos",
      "MesesFaltantes",
      "CiclosTranscurridos",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Aeronave_filtro",
      "Modelo_filtro",
      "N_Serie_filtro",
      "Procedencia_filtro",
      "Tipo_filtro",
      "N_de_boletin_directiva_aeronavegabilidad_filtro",
      "titulo_de_boletin_o_directiva_filtro",
      "Codigo_ATA_filtro",
      "Fecha_de_creacion_filtro",
      "Crear_reporte_filtro",
      "Horas_filtro",
      "Dias_filtro",
      "Meses_filtro",
      "Ciclos_filtro",
      "Es_recurrente_filtro",
      "LimitesEnDias_filtro",
      "DiasTranscurridos_filtro",
      "DiasFaltantes_filtro",
      "HorasFaltantes_filtro",
      "CiclosFaltantes_filtro",
      "Estatus_filtro",
      "HorasTranscurridas_filtro",
      "MesesTranscurridos_filtro",
      "MesesFaltantes_filtro",
      "CiclosTranscurridos_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Aeronave: "",
      Modelo: "",
      N_Serie: "",
      Procedencia: "",
      Tipo: "",
      N_de_boletin_directiva_aeronavegabilidad: "",
      titulo_de_boletin_o_directiva: "",
      Codigo_ATA: "",
      Fecha_de_creacion: null,
      Crear_reporte: "",
      Horas: "",
      Dias: "",
      Meses: "",
      Ciclos: "",
      Es_recurrente: "",
      LimitesEnDias: "",
      DiasTranscurridos: "",
      DiasFaltantes: "",
      HorasFaltantes: "",
      CiclosFaltantes: "",
      Estatus: "",
      HorasTranscurridas: "",
      MesesTranscurridos: "",
      MesesFaltantes: "",
      CiclosTranscurridos: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      AeronaveFilter: "",
      Aeronave: "",
      AeronaveMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      N_SerieFilter: "",
      N_Serie: "",
      N_SerieMultiple: "",
      ProcedenciaFilter: "",
      Procedencia: "",
      ProcedenciaMultiple: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",
      Codigo_ATAFilter: "",
      Codigo_ATA: "",
      Codigo_ATAMultiple: "",
      fromFecha_de_creacion: "",
      toFecha_de_creacion: "",
      fromHoras: "",
      toHoras: "",
      fromDias: "",
      toDias: "",
      fromMeses: "",
      toMeses: "",
      fromCiclos: "",
      toCiclos: "",
      fromLimitesEnDias: "",
      toLimitesEnDias: "",
      fromDiasTranscurridos: "",
      toDiasTranscurridos: "",
      fromDiasFaltantes: "",
      toDiasFaltantes: "",
      fromHorasFaltantes: "",
      toHorasFaltantes: "",
      fromCiclosFaltantes: "",
      toCiclosFaltantes: "",
      fromHorasTranscurridas: "",
      toHorasTranscurridas: "",
      fromMesesTranscurridos: "",
      toMesesTranscurridos: "",
      fromMesesFaltantes: "",
      toMesesFaltantes: "",
      fromCiclosTranscurridos: "",
      toCiclosTranscurridos: "",

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
    private procedenciaService: ProcedenciaService,
    private tipo_de_urgenciaService: Tipo_de_urgenciaService,
    private catalogo_codigo_ataService: Catalogo_codigo_ATAService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      AeronaveFilter: [''],
      Aeronave: [''],
      AeronaveMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      N_SerieFilter: [''],
      N_Serie: [''],
      N_SerieMultiple: [''],
      ProcedenciaFilter: [''],
      Procedencia: [''],
      ProcedenciaMultiple: [''],
      TipoFilter: [''],
      Tipo: [''],
      TipoMultiple: [''],
      Codigo_ATAFilter: [''],
      Codigo_ATA: [''],
      Codigo_ATAMultiple: [''],
      fromFecha_de_creacion: [''],
      toFecha_de_creacion: [''],
      fromHoras: [''],
      toHoras: [''],
      fromDias: [''],
      toDias: [''],
      fromMeses: [''],
      toMeses: [''],
      fromCiclos: [''],
      toCiclos: [''],
      fromLimitesEnDias: [''],
      toLimitesEnDias: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Boletines_Directivas_aeronavegatibilidad/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.procedenciaService.getAll());
    observablesArray.push(this.tipo_de_urgenciaService.getAll());
    observablesArray.push(this.catalogo_codigo_ataService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeronaves ,modeloss ,procedencias ,tipo_de_urgencias ,catalogo_codigo_atas ]) => {
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.procedencias = procedencias;
		  this.tipo_de_urgencias = tipo_de_urgencias;
		  this.catalogo_codigo_atas = catalogo_codigo_atas;
          

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
    this.dataListConfig.filterAdvanced.AeronaveFilter = entity.AeronaveFilter;
    this.dataListConfig.filterAdvanced.Aeronave = entity.Aeronave;
    this.dataListConfig.filterAdvanced.AeronaveMultiple = entity.AeronaveMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.N_SerieFilter = entity.N_SerieFilter;
    this.dataListConfig.filterAdvanced.N_Serie = entity.N_Serie;
    this.dataListConfig.filterAdvanced.N_SerieMultiple = entity.N_SerieMultiple;
    this.dataListConfig.filterAdvanced.ProcedenciaFilter = entity.ProcedenciaFilter;
    this.dataListConfig.filterAdvanced.Procedencia = entity.Procedencia;
    this.dataListConfig.filterAdvanced.ProcedenciaMultiple = entity.ProcedenciaMultiple;
    this.dataListConfig.filterAdvanced.TipoFilter = entity.TipoFilter;
    this.dataListConfig.filterAdvanced.Tipo = entity.Tipo;
    this.dataListConfig.filterAdvanced.TipoMultiple = entity.TipoMultiple;
	this.dataListConfig.filterAdvanced.N_de_boletin_directiva_aeronavegabilidadFilter = entity.N_de_boletin_directiva_aeronavegabilidadFilter;
	this.dataListConfig.filterAdvanced.N_de_boletin_directiva_aeronavegabilidad = entity.N_de_boletin_directiva_aeronavegabilidad;
	this.dataListConfig.filterAdvanced.titulo_de_boletin_o_directivaFilter = entity.titulo_de_boletin_o_directivaFilter;
	this.dataListConfig.filterAdvanced.titulo_de_boletin_o_directiva = entity.titulo_de_boletin_o_directiva;
    this.dataListConfig.filterAdvanced.Codigo_ATAFilter = entity.Codigo_ATAFilter;
    this.dataListConfig.filterAdvanced.Codigo_ATA = entity.Codigo_ATA;
    this.dataListConfig.filterAdvanced.Codigo_ATAMultiple = entity.Codigo_ATAMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_creacion = entity.fromFecha_de_creacion;
    this.dataListConfig.filterAdvanced.toFecha_de_creacion = entity.toFecha_de_creacion;
    this.dataListConfig.filterAdvanced.fromHoras = entity.fromHoras;
    this.dataListConfig.filterAdvanced.toHoras = entity.toHoras;
    this.dataListConfig.filterAdvanced.fromDias = entity.fromDias;
    this.dataListConfig.filterAdvanced.toDias = entity.toDias;
    this.dataListConfig.filterAdvanced.fromMeses = entity.fromMeses;
    this.dataListConfig.filterAdvanced.toMeses = entity.toMeses;
    this.dataListConfig.filterAdvanced.fromCiclos = entity.fromCiclos;
    this.dataListConfig.filterAdvanced.toCiclos = entity.toCiclos;
    this.dataListConfig.filterAdvanced.fromLimitesEnDias = entity.fromLimitesEnDias;
    this.dataListConfig.filterAdvanced.toLimitesEnDias = entity.toLimitesEnDias;
    this.dataListConfig.filterAdvanced.fromDiasTranscurridos = entity.fromDiasTranscurridos;
    this.dataListConfig.filterAdvanced.toDiasTranscurridos = entity.toDiasTranscurridos;
    this.dataListConfig.filterAdvanced.fromDiasFaltantes = entity.fromDiasFaltantes;
    this.dataListConfig.filterAdvanced.toDiasFaltantes = entity.toDiasFaltantes;
    this.dataListConfig.filterAdvanced.fromHorasFaltantes = entity.fromHorasFaltantes;
    this.dataListConfig.filterAdvanced.toHorasFaltantes = entity.toHorasFaltantes;
    this.dataListConfig.filterAdvanced.fromCiclosFaltantes = entity.fromCiclosFaltantes;
    this.dataListConfig.filterAdvanced.toCiclosFaltantes = entity.toCiclosFaltantes;
	this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
	this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.fromHorasTranscurridas = entity.fromHorasTranscurridas;
    this.dataListConfig.filterAdvanced.toHorasTranscurridas = entity.toHorasTranscurridas;
    this.dataListConfig.filterAdvanced.fromMesesTranscurridos = entity.fromMesesTranscurridos;
    this.dataListConfig.filterAdvanced.toMesesTranscurridos = entity.toMesesTranscurridos;
    this.dataListConfig.filterAdvanced.fromMesesFaltantes = entity.fromMesesFaltantes;
    this.dataListConfig.filterAdvanced.toMesesFaltantes = entity.toMesesFaltantes;
    this.dataListConfig.filterAdvanced.fromCiclosTranscurridos = entity.fromCiclosTranscurridos;
    this.dataListConfig.filterAdvanced.toCiclosTranscurridos = entity.toCiclosTranscurridos;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Boletines_Directivas_aeronavegatibilidad/list'], { state: { data: this.dataListConfig } });
  }
}
