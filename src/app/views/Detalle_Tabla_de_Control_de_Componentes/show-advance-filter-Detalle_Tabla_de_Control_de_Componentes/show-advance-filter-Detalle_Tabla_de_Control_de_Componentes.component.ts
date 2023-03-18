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

import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';


@Component({
  selector: 'app-show-advance-filter-Detalle_Tabla_de_Control_de_Componentes',
  templateUrl: './show-advance-filter-Detalle_Tabla_de_Control_de_Componentes.component.html',
  styleUrls: ['./show-advance-filter-Detalle_Tabla_de_Control_de_Componentes.component.scss']
})
export class ShowAdvanceFilterDetalle_Tabla_de_Control_de_ComponentesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Codigo_Computarizados: Codigo_Computarizado[] = [];
  public Descripcions: Codigo_Computarizado[] = [];

  public codigo_computarizados: Codigo_Computarizado;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Codigo_Computarizado",
      "Descripcion",
      "No_Parte",
      "Posicion",
      "No_Serie",
      "Horas_Acumuladas_Parte",
      "Ciclos_Acumulados_Parte",
      "Horas_Acumuladas_Aeronave",
      "Ciclos_Acumulados_Aeronave",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_Computarizado_filtro",
      "Descripcion_filtro",
      "No_Parte_filtro",
      "Posicion_filtro",
      "No_Serie_filtro",
      "Horas_Acumuladas_Parte_filtro",
      "Ciclos_Acumulados_Parte_filtro",
      "Horas_Acumuladas_Aeronave_filtro",
      "Ciclos_Acumulados_Aeronave_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Codigo_Computarizado: "",
      Descripcion: "",
      No_Parte: "",
      Posicion: "",
      No_Serie: "",
      Horas_Acumuladas_Parte: "",
      Ciclos_Acumulados_Parte: "",
      Horas_Acumuladas_Aeronave: "",
      Ciclos_Acumulados_Aeronave: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Codigo_ComputarizadoFilter: "",
      Codigo_Computarizado: "",
      Codigo_ComputarizadoMultiple: "",
      DescripcionFilter: "",
      Descripcion: "",
      DescripcionMultiple: "",

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
    private codigo_computarizadoService: Codigo_ComputarizadoService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Codigo_ComputarizadoFilter: [''],
      Codigo_Computarizado: [''],
      Codigo_ComputarizadoMultiple: [''],
      DescripcionFilter: [''],
      Descripcion: [''],
      DescripcionMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Detalle_Tabla_de_Control_de_Componentes/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.codigo_computarizadoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,codigo_computarizados ]) => {
		  this.codigo_computarizados = codigo_computarizados;
          

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
    this.dataListConfig.filterAdvanced.Codigo_ComputarizadoFilter = entity.Codigo_ComputarizadoFilter;
    this.dataListConfig.filterAdvanced.Codigo_Computarizado = entity.Codigo_Computarizado;
    this.dataListConfig.filterAdvanced.Codigo_ComputarizadoMultiple = entity.Codigo_ComputarizadoMultiple;
    this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
    this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
    this.dataListConfig.filterAdvanced.DescripcionMultiple = entity.DescripcionMultiple;
	this.dataListConfig.filterAdvanced.No_ParteFilter = entity.No_ParteFilter;
	this.dataListConfig.filterAdvanced.No_Parte = entity.No_Parte;
	this.dataListConfig.filterAdvanced.PosicionFilter = entity.PosicionFilter;
	this.dataListConfig.filterAdvanced.Posicion = entity.Posicion;
	this.dataListConfig.filterAdvanced.No_SerieFilter = entity.No_SerieFilter;
	this.dataListConfig.filterAdvanced.No_Serie = entity.No_Serie;
	this.dataListConfig.filterAdvanced.Horas_Acumuladas_ParteFilter = entity.Horas_Acumuladas_ParteFilter;
	this.dataListConfig.filterAdvanced.Horas_Acumuladas_Parte = entity.Horas_Acumuladas_Parte;
	this.dataListConfig.filterAdvanced.Ciclos_Acumulados_ParteFilter = entity.Ciclos_Acumulados_ParteFilter;
	this.dataListConfig.filterAdvanced.Ciclos_Acumulados_Parte = entity.Ciclos_Acumulados_Parte;
	this.dataListConfig.filterAdvanced.Horas_Acumuladas_AeronaveFilter = entity.Horas_Acumuladas_AeronaveFilter;
	this.dataListConfig.filterAdvanced.Horas_Acumuladas_Aeronave = entity.Horas_Acumuladas_Aeronave;
	this.dataListConfig.filterAdvanced.Ciclos_Acumulados_AeronaveFilter = entity.Ciclos_Acumulados_AeronaveFilter;
	this.dataListConfig.filterAdvanced.Ciclos_Acumulados_Aeronave = entity.Ciclos_Acumulados_Aeronave;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Detalle_Tabla_de_Control_de_Componentes/list'], { state: { data: this.dataListConfig } });
  }
}
