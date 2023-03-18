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
import { Estado } from 'src/app/models/Estado';
import { EstadoService } from 'src/app/api-services/Estado.service';
import { Ciudad } from 'src/app/models/Ciudad';
import { CiudadService } from 'src/app/api-services/Ciudad.service';
import { Tipo_de_Aeropuerto } from 'src/app/models/Tipo_de_Aeropuerto';
import { Tipo_de_AeropuertoService } from 'src/app/api-services/Tipo_de_Aeropuerto.service';


@Component({
  selector: 'app-show-advance-filter-Aeropuertos',
  templateUrl: './show-advance-filter-Aeropuertos.component.html',
  styleUrls: ['./show-advance-filter-Aeropuertos.component.scss']
})
export class ShowAdvanceFilterAeropuertosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Paiss: Pais[] = [];
  public Estados: Estado[] = [];
  public Ciudads: Ciudad[] = [];
  public Tipo_de_Aeropuertos: Tipo_de_Aeropuerto[] = [];
  public Ciudad_mas_cercanas: Ciudad[] = [];

  public paiss: Pais;
  public estados: Estado;
  public ciudads: Ciudad;
  public tipo_de_aeropuertos: Tipo_de_Aeropuerto;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Aeropuerto_ID",
      "ICAO",
      "IATA",
      "FAA",
      "Nombre",
      "Pais",
      "Estado",
      "Ciudad",
      "Horario_de_operaciones",
      "Latitud",
      "Longitud",
      "Elevacion_pies",
      "Variacion",
      "Tipo_de_Aeropuerto",
      "Ciudad_mas_cercana",
      "Distancia_en_KM",
      "Aeropuerto_Controlado",
      "UTC_Estandar",
      "UTC_Estandar_Inicio",
      "UTC_Estandar_Fin",
      "UTC_DLTS",
      "UTC_DLTS_Inicio",
      "UTC_DLTS_Fin",
      "UTC__Amanecer",
      "UTC__Atardecer",
      "Local_Amanecer",
      "Local_Atardecer",
      "TWR",
      "GND",
      "UNICOM",
      "CARDEL_1",
      "CARDEL_2",
      "APPR",
      "DEP",
      "ATIS",
      "ATIS_Phone",
      "ASOS",
      "ASOS_Phone",
      "AWOS",
      "AWOS_Phone",
      "AWOS_Type",
      "Codigo_de_area___Lada",
      "Administracion_Aeropuerto",
      "Comandancia",
      "Despacho",
      "Torre_de_Control",
      "Descripcion",
      "Notas",
      "ICAO_IATA",

    ],
    columns_filters: [
      "acciones_filtro",
      "Aeropuerto_ID_filtro",
      "ICAO_filtro",
      "IATA_filtro",
      "FAA_filtro",
      "Nombre_filtro",
      "Pais_filtro",
      "Estado_filtro",
      "Ciudad_filtro",
      "Horario_de_operaciones_filtro",
      "Latitud_filtro",
      "Longitud_filtro",
      "Elevacion_pies_filtro",
      "Variacion_filtro",
      "Tipo_de_Aeropuerto_filtro",
      "Ciudad_mas_cercana_filtro",
      "Distancia_en_KM_filtro",
      "Aeropuerto_Controlado_filtro",
      "UTC_Estandar_filtro",
      "UTC_Estandar_Inicio_filtro",
      "UTC_Estandar_Fin_filtro",
      "UTC_DLTS_filtro",
      "UTC_DLTS_Inicio_filtro",
      "UTC_DLTS_Fin_filtro",
      "UTC__Amanecer_filtro",
      "UTC__Atardecer_filtro",
      "Local_Amanecer_filtro",
      "Local_Atardecer_filtro",
      "TWR_filtro",
      "GND_filtro",
      "UNICOM_filtro",
      "CARDEL_1_filtro",
      "CARDEL_2_filtro",
      "APPR_filtro",
      "DEP_filtro",
      "ATIS_filtro",
      "ATIS_Phone_filtro",
      "ASOS_filtro",
      "ASOS_Phone_filtro",
      "AWOS_filtro",
      "AWOS_Phone_filtro",
      "AWOS_Type_filtro",
      "Codigo_de_area___Lada_filtro",
      "Administracion_Aeropuerto_filtro",
      "Comandancia_filtro",
      "Despacho_filtro",
      "Torre_de_Control_filtro",
      "Descripcion_filtro",
      "Notas_filtro",
      "ICAO_IATA_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Aeropuerto_ID: "",
      ICAO: "",
      IATA: "",
      FAA: "",
      Nombre: "",
      Pais: "",
      Estado: "",
      Ciudad: "",
      Horario_de_operaciones: "",
      Latitud: "",
      Longitud: "",
      Elevacion_pies: "",
      Variacion: "",
      Tipo_de_Aeropuerto: "",
      Ciudad_mas_cercana: "",
      Distancia_en_KM: "",
      Aeropuerto_Controlado: "",
      UTC_Estandar: "",
      UTC_Estandar_Inicio: null,
      UTC_Estandar_Fin: null,
      UTC_DLTS: "",
      UTC_DLTS_Inicio: null,
      UTC_DLTS_Fin: null,
      UTC__Amanecer: "",
      UTC__Atardecer: "",
      Local_Amanecer: "",
      Local_Atardecer: "",
      TWR: "",
      GND: "",
      UNICOM: "",
      CARDEL_1: "",
      CARDEL_2: "",
      APPR: "",
      DEP: "",
      ATIS: "",
      ATIS_Phone: "",
      ASOS: "",
      ASOS_Phone: "",
      AWOS: "",
      AWOS_Phone: "",
      AWOS_Type: "",
      Codigo_de_area___Lada: "",
      Administracion_Aeropuerto: "",
      Comandancia: "",
      Despacho: "",
      Torre_de_Control: "",
      Descripcion: "",
      Notas: "",
      ICAO_IATA: "",

    },
    filterAdvanced: {
      fromAeropuerto_ID: "",
      toAeropuerto_ID: "",
      PaisFilter: "",
      Pais: "",
      PaisMultiple: "",
      EstadoFilter: "",
      Estado: "",
      EstadoMultiple: "",
      CiudadFilter: "",
      Ciudad: "",
      CiudadMultiple: "",
      fromElevacion_pies: "",
      toElevacion_pies: "",
      Tipo_de_AeropuertoFilter: "",
      Tipo_de_Aeropuerto: "",
      Tipo_de_AeropuertoMultiple: "",
      Ciudad_mas_cercanaFilter: "",
      Ciudad_mas_cercana: "",
      Ciudad_mas_cercanaMultiple: "",
      fromDistancia_en_KM: "",
      toDistancia_en_KM: "",
      fromUTC_Estandar_Inicio: "",
      toUTC_Estandar_Inicio: "",
      fromUTC_Estandar_Fin: "",
      toUTC_Estandar_Fin: "",
      fromUTC_DLTS_Inicio: "",
      toUTC_DLTS_Inicio: "",
      fromUTC_DLTS_Fin: "",
      toUTC_DLTS_Fin: "",
      fromUTC__Amanecer: "",
      toUTC__Amanecer: "",
      fromUTC__Atardecer: "",
      toUTC__Atardecer: "",
      fromLocal_Amanecer: "",
      toLocal_Amanecer: "",
      fromLocal_Atardecer: "",
      toLocal_Atardecer: "",
      fromTWR: "",
      toTWR: "",
      fromGND: "",
      toGND: "",
      fromAPPR: "",
      toAPPR: "",
      fromDEP: "",
      toDEP: "",

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
    private estadoService: EstadoService,
    private ciudadService: CiudadService,
    private tipo_de_aeropuertoService: Tipo_de_AeropuertoService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromAeropuerto_ID: [''],
      toAeropuerto_ID: [''],
      PaisFilter: [''],
      Pais: [''],
      PaisMultiple: [''],
      EstadoFilter: [''],
      Estado: [''],
      EstadoMultiple: [''],
      CiudadFilter: [''],
      Ciudad: [''],
      CiudadMultiple: [''],
      fromElevacion_pies: [''],
      toElevacion_pies: [''],
      Tipo_de_AeropuertoFilter: [''],
      Tipo_de_Aeropuerto: [''],
      Tipo_de_AeropuertoMultiple: [''],
      Ciudad_mas_cercanaFilter: [''],
      Ciudad_mas_cercana: [''],
      Ciudad_mas_cercanaMultiple: [''],
      fromUTC_Estandar_Inicio: [''],
      toUTC_Estandar_Inicio: [''],
      fromUTC_Estandar_Fin: [''],
      toUTC_Estandar_Fin: [''],
      fromUTC_DLTS_Inicio: [''],
      toUTC_DLTS_Inicio: [''],
      fromUTC_DLTS_Fin: [''],
      toUTC_DLTS_Fin: [''],
      fromUTC__Amanecer: [''],
      toUTC__Amanecer: [''],
      fromUTC__Atardecer: [''],
      toUTC__Atardecer: [''],
      fromLocal_Amanecer: [''],
      toLocal_Amanecer: [''],
      fromLocal_Atardecer: [''],
      toLocal_Atardecer: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Aeropuertos/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.paisService.getAll());
    observablesArray.push(this.estadoService.getAll());
    observablesArray.push(this.ciudadService.getAll());
    observablesArray.push(this.tipo_de_aeropuertoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,paiss ,estados ,ciudads ,tipo_de_aeropuertos ]) => {
		  this.paiss = paiss;
		  this.estados = estados;
		  this.ciudads = ciudads;
		  this.tipo_de_aeropuertos = tipo_de_aeropuertos;
          

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
    this.dataListConfig.filterAdvanced.fromAeropuerto_ID = entity.fromAeropuerto_ID;
    this.dataListConfig.filterAdvanced.toAeropuerto_ID = entity.toAeropuerto_ID;
	this.dataListConfig.filterAdvanced.ICAOFilter = entity.ICAOFilter;
	this.dataListConfig.filterAdvanced.ICAO = entity.ICAO;
	this.dataListConfig.filterAdvanced.IATAFilter = entity.IATAFilter;
	this.dataListConfig.filterAdvanced.IATA = entity.IATA;
	this.dataListConfig.filterAdvanced.FAAFilter = entity.FAAFilter;
	this.dataListConfig.filterAdvanced.FAA = entity.FAA;
	this.dataListConfig.filterAdvanced.NombreFilter = entity.NombreFilter;
	this.dataListConfig.filterAdvanced.Nombre = entity.Nombre;
    this.dataListConfig.filterAdvanced.PaisFilter = entity.PaisFilter;
    this.dataListConfig.filterAdvanced.Pais = entity.Pais;
    this.dataListConfig.filterAdvanced.PaisMultiple = entity.PaisMultiple;
    this.dataListConfig.filterAdvanced.EstadoFilter = entity.EstadoFilter;
    this.dataListConfig.filterAdvanced.Estado = entity.Estado;
    this.dataListConfig.filterAdvanced.EstadoMultiple = entity.EstadoMultiple;
    this.dataListConfig.filterAdvanced.CiudadFilter = entity.CiudadFilter;
    this.dataListConfig.filterAdvanced.Ciudad = entity.Ciudad;
    this.dataListConfig.filterAdvanced.CiudadMultiple = entity.CiudadMultiple;
	this.dataListConfig.filterAdvanced.Horario_de_operacionesFilter = entity.Horario_de_operacionesFilter;
	this.dataListConfig.filterAdvanced.Horario_de_operaciones = entity.Horario_de_operaciones;
	this.dataListConfig.filterAdvanced.LatitudFilter = entity.LatitudFilter;
	this.dataListConfig.filterAdvanced.Latitud = entity.Latitud;
	this.dataListConfig.filterAdvanced.LongitudFilter = entity.LongitudFilter;
	this.dataListConfig.filterAdvanced.Longitud = entity.Longitud;
    this.dataListConfig.filterAdvanced.fromElevacion_pies = entity.fromElevacion_pies;
    this.dataListConfig.filterAdvanced.toElevacion_pies = entity.toElevacion_pies;
	this.dataListConfig.filterAdvanced.VariacionFilter = entity.VariacionFilter;
	this.dataListConfig.filterAdvanced.Variacion = entity.Variacion;
    this.dataListConfig.filterAdvanced.Tipo_de_AeropuertoFilter = entity.Tipo_de_AeropuertoFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_Aeropuerto = entity.Tipo_de_Aeropuerto;
    this.dataListConfig.filterAdvanced.Tipo_de_AeropuertoMultiple = entity.Tipo_de_AeropuertoMultiple;
    this.dataListConfig.filterAdvanced.Ciudad_mas_cercanaFilter = entity.Ciudad_mas_cercanaFilter;
    this.dataListConfig.filterAdvanced.Ciudad_mas_cercana = entity.Ciudad_mas_cercana;
    this.dataListConfig.filterAdvanced.Ciudad_mas_cercanaMultiple = entity.Ciudad_mas_cercanaMultiple;
    this.dataListConfig.filterAdvanced.fromDistancia_en_KM = entity.fromDistancia_en_KM;
    this.dataListConfig.filterAdvanced.toDistancia_en_KM = entity.toDistancia_en_KM;
	this.dataListConfig.filterAdvanced.UTC_EstandarFilter = entity.UTC_EstandarFilter;
	this.dataListConfig.filterAdvanced.UTC_Estandar = entity.UTC_Estandar;
    this.dataListConfig.filterAdvanced.fromUTC_Estandar_Inicio = entity.fromUTC_Estandar_Inicio;
    this.dataListConfig.filterAdvanced.toUTC_Estandar_Inicio = entity.toUTC_Estandar_Inicio;
    this.dataListConfig.filterAdvanced.fromUTC_Estandar_Fin = entity.fromUTC_Estandar_Fin;
    this.dataListConfig.filterAdvanced.toUTC_Estandar_Fin = entity.toUTC_Estandar_Fin;
	this.dataListConfig.filterAdvanced.UTC_DLTSFilter = entity.UTC_DLTSFilter;
	this.dataListConfig.filterAdvanced.UTC_DLTS = entity.UTC_DLTS;
    this.dataListConfig.filterAdvanced.fromUTC_DLTS_Inicio = entity.fromUTC_DLTS_Inicio;
    this.dataListConfig.filterAdvanced.toUTC_DLTS_Inicio = entity.toUTC_DLTS_Inicio;
    this.dataListConfig.filterAdvanced.fromUTC_DLTS_Fin = entity.fromUTC_DLTS_Fin;
    this.dataListConfig.filterAdvanced.toUTC_DLTS_Fin = entity.toUTC_DLTS_Fin;
	this.dataListConfig.filterAdvanced.UTC__AmanecerFilter = entity.UTC__AmanecerFilter;
	this.dataListConfig.filterAdvanced.UTC__Amanecer = entity.UTC__Amanecer;
	this.dataListConfig.filterAdvanced.UTC__AtardecerFilter = entity.UTC__AtardecerFilter;
	this.dataListConfig.filterAdvanced.UTC__Atardecer = entity.UTC__Atardecer;
	this.dataListConfig.filterAdvanced.Local_AmanecerFilter = entity.Local_AmanecerFilter;
	this.dataListConfig.filterAdvanced.Local_Amanecer = entity.Local_Amanecer;
	this.dataListConfig.filterAdvanced.Local_AtardecerFilter = entity.Local_AtardecerFilter;
	this.dataListConfig.filterAdvanced.Local_Atardecer = entity.Local_Atardecer;
    this.dataListConfig.filterAdvanced.fromTWR = entity.fromTWR;
    this.dataListConfig.filterAdvanced.toTWR = entity.toTWR;
    this.dataListConfig.filterAdvanced.fromGND = entity.fromGND;
    this.dataListConfig.filterAdvanced.toGND = entity.toGND;
	this.dataListConfig.filterAdvanced.UNICOMFilter = entity.UNICOMFilter;
	this.dataListConfig.filterAdvanced.UNICOM = entity.UNICOM;
	this.dataListConfig.filterAdvanced.CARDEL_1Filter = entity.CARDEL_1Filter;
	this.dataListConfig.filterAdvanced.CARDEL_1 = entity.CARDEL_1;
	this.dataListConfig.filterAdvanced.CARDEL_2Filter = entity.CARDEL_2Filter;
	this.dataListConfig.filterAdvanced.CARDEL_2 = entity.CARDEL_2;
    this.dataListConfig.filterAdvanced.fromAPPR = entity.fromAPPR;
    this.dataListConfig.filterAdvanced.toAPPR = entity.toAPPR;
    this.dataListConfig.filterAdvanced.fromDEP = entity.fromDEP;
    this.dataListConfig.filterAdvanced.toDEP = entity.toDEP;
	this.dataListConfig.filterAdvanced.ATISFilter = entity.ATISFilter;
	this.dataListConfig.filterAdvanced.ATIS = entity.ATIS;
	this.dataListConfig.filterAdvanced.ATIS_PhoneFilter = entity.ATIS_PhoneFilter;
	this.dataListConfig.filterAdvanced.ATIS_Phone = entity.ATIS_Phone;
	this.dataListConfig.filterAdvanced.ASOSFilter = entity.ASOSFilter;
	this.dataListConfig.filterAdvanced.ASOS = entity.ASOS;
	this.dataListConfig.filterAdvanced.ASOS_PhoneFilter = entity.ASOS_PhoneFilter;
	this.dataListConfig.filterAdvanced.ASOS_Phone = entity.ASOS_Phone;
	this.dataListConfig.filterAdvanced.AWOSFilter = entity.AWOSFilter;
	this.dataListConfig.filterAdvanced.AWOS = entity.AWOS;
	this.dataListConfig.filterAdvanced.AWOS_PhoneFilter = entity.AWOS_PhoneFilter;
	this.dataListConfig.filterAdvanced.AWOS_Phone = entity.AWOS_Phone;
	this.dataListConfig.filterAdvanced.AWOS_TypeFilter = entity.AWOS_TypeFilter;
	this.dataListConfig.filterAdvanced.AWOS_Type = entity.AWOS_Type;
	this.dataListConfig.filterAdvanced.Codigo_de_area___LadaFilter = entity.Codigo_de_area___LadaFilter;
	this.dataListConfig.filterAdvanced.Codigo_de_area___Lada = entity.Codigo_de_area___Lada;
	this.dataListConfig.filterAdvanced.Administracion_AeropuertoFilter = entity.Administracion_AeropuertoFilter;
	this.dataListConfig.filterAdvanced.Administracion_Aeropuerto = entity.Administracion_Aeropuerto;
	this.dataListConfig.filterAdvanced.ComandanciaFilter = entity.ComandanciaFilter;
	this.dataListConfig.filterAdvanced.Comandancia = entity.Comandancia;
	this.dataListConfig.filterAdvanced.DespachoFilter = entity.DespachoFilter;
	this.dataListConfig.filterAdvanced.Despacho = entity.Despacho;
	this.dataListConfig.filterAdvanced.Torre_de_ControlFilter = entity.Torre_de_ControlFilter;
	this.dataListConfig.filterAdvanced.Torre_de_Control = entity.Torre_de_Control;
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
	this.dataListConfig.filterAdvanced.NotasFilter = entity.NotasFilter;
	this.dataListConfig.filterAdvanced.Notas = entity.Notas;
	this.dataListConfig.filterAdvanced.ICAO_IATAFilter = entity.ICAO_IATAFilter;
	this.dataListConfig.filterAdvanced.ICAO_IATA = entity.ICAO_IATA;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Aeropuertos/list'], { state: { data: this.dataListConfig } });
  }
}
