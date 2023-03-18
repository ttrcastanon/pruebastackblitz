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

import { Tipo_de_Posicion_de_Piezas } from 'src/app/models/Tipo_de_Posicion_de_Piezas';
import { Tipo_de_Posicion_de_PiezasService } from 'src/app/api-services/Tipo_de_Posicion_de_Piezas.service';


@Component({
  selector: 'app-show-advance-filter-Piezas',
  templateUrl: './show-advance-filter-Piezas.component.html',
  styleUrls: ['./show-advance-filter-Piezas.component.scss']
})
export class ShowAdvanceFilterPiezasComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Posicions: Tipo_de_Posicion_de_Piezas[] = [];

  public tipo_de_posicion_de_piezass: Tipo_de_Posicion_de_Piezas;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Codigo",
      "Descripcion",
      "Instalacion",
      "N_de_Serie",
      "Posicion",
      "OT",
      "Periodicidad_meses",
      "Vencimiento",
      "Descripcion_Busqueda",

    ],
    columns_filters: [
      "acciones_filtro",
      "Codigo_filtro",
      "Descripcion_filtro",
      "Instalacion_filtro",
      "N_de_Serie_filtro",
      "Posicion_filtro",
      "OT_filtro",
      "Periodicidad_meses_filtro",
      "Vencimiento_filtro",
      "Descripcion_Busqueda_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Codigo: "",
      Descripcion: "",
      Instalacion: null,
      N_de_Serie: "",
      Posicion: "",
      OT: "",
      Periodicidad_meses: "",
      Vencimiento: null,
      Descripcion_Busqueda: "",

    },
    filterAdvanced: {
      fromInstalacion: "",
      toInstalacion: "",
      PosicionFilter: "",
      Posicion: "",
      PosicionMultiple: "",
      fromOT: "",
      toOT: "",
      fromPeriodicidad_meses: "",
      toPeriodicidad_meses: "",
      fromVencimiento: "",
      toVencimiento: "",

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
    private tipo_de_posicion_de_piezasService: Tipo_de_Posicion_de_PiezasService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromInstalacion: [''],
      toInstalacion: [''],
      PosicionFilter: [''],
      Posicion: [''],
      PosicionMultiple: [''],
      fromOT: [''],
      toOT: [''],
      fromPeriodicidad_meses: [''],
      toPeriodicidad_meses: [''],
      fromVencimiento: [''],
      toVencimiento: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Piezas/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipo_de_posicion_de_piezasService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipo_de_posicion_de_piezass ]) => {
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
	this.dataListConfig.filterAdvanced.CodigoFilter = entity.CodigoFilter;
	this.dataListConfig.filterAdvanced.Codigo = entity.Codigo;
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
    this.dataListConfig.filterAdvanced.fromInstalacion = entity.fromInstalacion;
    this.dataListConfig.filterAdvanced.toInstalacion = entity.toInstalacion;
	this.dataListConfig.filterAdvanced.N_de_SerieFilter = entity.N_de_SerieFilter;
	this.dataListConfig.filterAdvanced.N_de_Serie = entity.N_de_Serie;
    this.dataListConfig.filterAdvanced.PosicionFilter = entity.PosicionFilter;
    this.dataListConfig.filterAdvanced.Posicion = entity.Posicion;
    this.dataListConfig.filterAdvanced.PosicionMultiple = entity.PosicionMultiple;
    this.dataListConfig.filterAdvanced.fromOT = entity.fromOT;
    this.dataListConfig.filterAdvanced.toOT = entity.toOT;
    this.dataListConfig.filterAdvanced.fromPeriodicidad_meses = entity.fromPeriodicidad_meses;
    this.dataListConfig.filterAdvanced.toPeriodicidad_meses = entity.toPeriodicidad_meses;
    this.dataListConfig.filterAdvanced.fromVencimiento = entity.fromVencimiento;
    this.dataListConfig.filterAdvanced.toVencimiento = entity.toVencimiento;
	this.dataListConfig.filterAdvanced.Descripcion_BusquedaFilter = entity.Descripcion_BusquedaFilter;
	this.dataListConfig.filterAdvanced.Descripcion_Busqueda = entity.Descripcion_Busqueda;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Piezas/list'], { state: { data: this.dataListConfig } });
  }
}
