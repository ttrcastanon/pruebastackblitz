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
import { Moneda } from 'src/app/models/Moneda';
import { MonedaService } from 'src/app/api-services/Moneda.service';


@Component({
  selector: 'app-show-advance-filter-Tarifas_de_Vuelo_de_Aeronave',
  templateUrl: './show-advance-filter-Tarifas_de_Vuelo_de_Aeronave.component.html',
  styleUrls: ['./show-advance-filter-Tarifas_de_Vuelo_de_Aeronave.component.scss']
})
export class ShowAdvanceFilterTarifas_de_Vuelo_de_AeronaveComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Matriculas: Aeronave[] = [];
  public Monedas: Moneda[] = [];

  public aeronaves: Aeronave;
  public monedas: Moneda;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Tarifa_Normal",
      "Tarifa_Reducida",
      "Tarifa_en_Espera",
      "Percnota",
      "Moneda",
      "Ultima_Modificacion",
      "Hora_de_ultima_modificacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Tarifa_Normal_filtro",
      "Tarifa_Reducida_filtro",
      "Tarifa_en_Espera_filtro",
      "Percnota_filtro",
      "Moneda_filtro",
      "Ultima_Modificacion_filtro",
      "Hora_de_ultima_modificacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Matricula: "",
      Tarifa_Normal: "",
      Tarifa_Reducida: "",
      Tarifa_en_Espera: "",
      Percnota: "",
      Moneda: "",
      Ultima_Modificacion: null,
      Hora_de_ultima_modificacion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromTarifa_Normal: "",
      toTarifa_Normal: "",
      fromTarifa_Reducida: "",
      toTarifa_Reducida: "",
      fromTarifa_en_Espera: "",
      toTarifa_en_Espera: "",
      fromPercnota: "",
      toPercnota: "",
      MonedaFilter: "",
      Moneda: "",
      MonedaMultiple: "",
      fromUltima_Modificacion: "",
      toUltima_Modificacion: "",
      fromHora_de_ultima_modificacion: "",
      toHora_de_ultima_modificacion: "",

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
    private monedaService: MonedaService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      fromTarifa_Normal: [''],
      toTarifa_Normal: [''],
      fromTarifa_Reducida: [''],
      toTarifa_Reducida: [''],
      fromTarifa_en_Espera: [''],
      toTarifa_en_Espera: [''],
      fromPercnota: [''],
      toPercnota: [''],
      MonedaFilter: [''],
      Moneda: [''],
      MonedaMultiple: [''],
      fromUltima_Modificacion: [''],
      toUltima_Modificacion: [''],
      fromHora_de_ultima_modificacion: [''],
      toHora_de_ultima_modificacion: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Tarifas_de_Vuelo_de_Aeronave/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.monedaService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeronaves ,monedas ]) => {
		  this.aeronaves = aeronaves;
		  this.monedas = monedas;
          

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
    this.dataListConfig.filterAdvanced.fromTarifa_Normal = entity.fromTarifa_Normal;
    this.dataListConfig.filterAdvanced.toTarifa_Normal = entity.toTarifa_Normal;
    this.dataListConfig.filterAdvanced.fromTarifa_Reducida = entity.fromTarifa_Reducida;
    this.dataListConfig.filterAdvanced.toTarifa_Reducida = entity.toTarifa_Reducida;
    this.dataListConfig.filterAdvanced.fromTarifa_en_Espera = entity.fromTarifa_en_Espera;
    this.dataListConfig.filterAdvanced.toTarifa_en_Espera = entity.toTarifa_en_Espera;
    this.dataListConfig.filterAdvanced.fromPercnota = entity.fromPercnota;
    this.dataListConfig.filterAdvanced.toPercnota = entity.toPercnota;
    this.dataListConfig.filterAdvanced.MonedaFilter = entity.MonedaFilter;
    this.dataListConfig.filterAdvanced.Moneda = entity.Moneda;
    this.dataListConfig.filterAdvanced.MonedaMultiple = entity.MonedaMultiple;
    this.dataListConfig.filterAdvanced.fromUltima_Modificacion = entity.fromUltima_Modificacion;
    this.dataListConfig.filterAdvanced.toUltima_Modificacion = entity.toUltima_Modificacion;
	this.dataListConfig.filterAdvanced.Hora_de_ultima_modificacionFilter = entity.Hora_de_ultima_modificacionFilter;
	this.dataListConfig.filterAdvanced.Hora_de_ultima_modificacion = entity.Hora_de_ultima_modificacion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Tarifas_de_Vuelo_de_Aeronave/list'], { state: { data: this.dataListConfig } });
  }
}
