import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { CustomValidators } from '@andufratu/ngx-custom-validators';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin, Observable, of } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';
import { Filter } from 'src/app/models/filter';

import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';


@Component({
  selector: 'app-show-advance-filter-Codigo_Computarizado',
  templateUrl: './show-advance-filter-Codigo_Computarizado.component.html',
  styleUrls: ['./show-advance-filter-Codigo_Computarizado.component.scss']
})
export class ShowAdvanceFilterCodigo_ComputarizadoComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Modelos: Modelos[] = [];

  public modeloss: Modelos;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Modelo",
      "Codigo",
      "Descripcion",
      "Tiempo_Estandar",
      "Descripcion_Busqueda",
      "Por_Defecto_en_Cotizacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Modelo_filtro",
      "Codigo_filtro",
      "Descripcion_filtro",
      "Tiempo_Estandar_filtro",
      "Descripcion_Busqueda_filtro",
      "Por_Defecto_en_Cotizacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Modelo: "",
      Codigo: "",
      Descripcion: "",
      Tiempo_Estandar: "",
      Descripcion_Busqueda: "",
      Por_Defecto_en_Cotizacion: "",

    },
    filterAdvanced: {
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromTiempo_Estandar: "",
      toTiempo_Estandar: "",

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
    private modelosService: ModelosService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      fromTiempo_Estandar: [''],
      toTiempo_Estandar: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Codigo_Computarizado/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.modelosService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio, modeloss]) => {
          this.modeloss = modeloss;


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
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.CodigoFilter = entity.CodigoFilter;
    this.dataListConfig.filterAdvanced.Codigo = entity.Codigo;
    this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
    this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
    this.dataListConfig.filterAdvanced.Tiempo_EstandarFilter = entity.Tiempo_EstandarFilter;
    this.dataListConfig.filterAdvanced.Tiempo_Estandar = entity.Tiempo_Estandar;
    this.dataListConfig.filterAdvanced.Descripcion_BusquedaFilter = entity.Descripcion_BusquedaFilter;
    this.dataListConfig.filterAdvanced.Descripcion_Busqueda = entity.Descripcion_Busqueda;


    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Codigo_Computarizado/list'], { state: { data: this.dataListConfig } });
  }
}
