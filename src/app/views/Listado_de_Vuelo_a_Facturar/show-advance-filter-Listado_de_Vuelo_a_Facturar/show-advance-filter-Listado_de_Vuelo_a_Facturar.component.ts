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

import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Tipo_de_vuelo } from 'src/app/models/Tipo_de_vuelo';
import { Tipo_de_vueloService } from 'src/app/api-services/Tipo_de_vuelo.service';
import { Pasajeros } from 'src/app/models/Pasajeros';
import { PasajerosService } from 'src/app/api-services/Pasajeros.service';


@Component({
  selector: 'app-show-advance-filter-Listado_de_Vuelo_a_Facturar',
  templateUrl: './show-advance-filter-Listado_de_Vuelo_a_Facturar.component.html',
  styleUrls: ['./show-advance-filter-Listado_de_Vuelo_a_Facturar.component.scss']
})
export class ShowAdvanceFilterListado_de_Vuelo_a_FacturarComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Vuelos: Solicitud_de_Vuelo[] = [];
  public Matriculas: Aeronave[] = [];
  public Tipos: Tipo_de_vuelo[] = [];
  public Pasajeross: Pasajeros[] = [];

  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public aeronaves: Aeronave;
  public tipo_de_vuelos: Tipo_de_vuelo;
  public pasajeross: Pasajeros;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Vuelo",
      "Matricula",
      "Tipo",
      "Pasajeros",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Vuelo_filtro",
      "Matricula_filtro",
      "Tipo_filtro",
      "Pasajeros_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Vuelo: "",
      Matricula: "",
      Tipo: "",
      Pasajeros: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      VueloFilter: "",
      Vuelo: "",
      VueloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",
      PasajerosFilter: "",
      Pasajeros: "",
      PasajerosMultiple: "",

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
    private solicitud_de_vueloService: Solicitud_de_VueloService,
    private aeronaveService: AeronaveService,
    private tipo_de_vueloService: Tipo_de_vueloService,
    private pasajerosService: PasajerosService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      VueloFilter: [''],
      Vuelo: [''],
      VueloMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      TipoFilter: [''],
      Tipo: [''],
      TipoMultiple: [''],
      PasajerosFilter: [''],
      Pasajeros: [''],
      PasajerosMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Listado_de_Vuelo_a_Facturar/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.tipo_de_vueloService.getAll());
    observablesArray.push(this.pasajerosService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_vuelos ,aeronaves ,tipo_de_vuelos ,pasajeross ]) => {
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.aeronaves = aeronaves;
		  this.tipo_de_vuelos = tipo_de_vuelos;
		  this.pasajeross = pasajeross;
          

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
    this.dataListConfig.filterAdvanced.VueloFilter = entity.VueloFilter;
    this.dataListConfig.filterAdvanced.Vuelo = entity.Vuelo;
    this.dataListConfig.filterAdvanced.VueloMultiple = entity.VueloMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.TipoFilter = entity.TipoFilter;
    this.dataListConfig.filterAdvanced.Tipo = entity.Tipo;
    this.dataListConfig.filterAdvanced.TipoMultiple = entity.TipoMultiple;
    this.dataListConfig.filterAdvanced.PasajerosFilter = entity.PasajerosFilter;
    this.dataListConfig.filterAdvanced.Pasajeros = entity.Pasajeros;
    this.dataListConfig.filterAdvanced.PasajerosMultiple = entity.PasajerosMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Listado_de_Vuelo_a_Facturar/list'], { state: { data: this.dataListConfig } });
  }
}
