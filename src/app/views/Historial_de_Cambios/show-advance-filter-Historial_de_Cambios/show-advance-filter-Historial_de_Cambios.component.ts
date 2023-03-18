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


@Component({
  selector: 'app-show-advance-filter-Historial_de_Cambios',
  templateUrl: './show-advance-filter-Historial_de_Cambios.component.html',
  styleUrls: ['./show-advance-filter-Historial_de_Cambios.component.scss']
})
export class ShowAdvanceFilterHistorial_de_CambiosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Numero_de_Vuelos: Solicitud_de_Vuelo[] = [];

  public solicitud_de_vuelos: Solicitud_de_Vuelo;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Numero_de_Vuelo",
      "Fecha",
      "Hora",
      "Cambio_Realizado",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Numero_de_Vuelo_filtro",
      "Fecha_filtro",
      "Hora_filtro",
      "Cambio_Realizado_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Numero_de_Vuelo: "",
      Fecha: null,
      Hora: "",
      Cambio_Realizado: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Numero_de_VueloFilter: "",
      Numero_de_Vuelo: "",
      Numero_de_VueloMultiple: "",
      fromFecha: "",
      toFecha: "",
      fromHora: "",
      toHora: "",

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

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Numero_de_VueloFilter: [''],
      Numero_de_Vuelo: [''],
      Numero_de_VueloMultiple: [''],
      fromFecha: [''],
      toFecha: [''],
      fromHora: [''],
      toHora: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Historial_de_Cambios/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_vueloService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_vuelos ]) => {
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
          

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
    this.dataListConfig.filterAdvanced.Numero_de_VueloFilter = entity.Numero_de_VueloFilter;
    this.dataListConfig.filterAdvanced.Numero_de_Vuelo = entity.Numero_de_Vuelo;
    this.dataListConfig.filterAdvanced.Numero_de_VueloMultiple = entity.Numero_de_VueloMultiple;
    this.dataListConfig.filterAdvanced.fromFecha = entity.fromFecha;
    this.dataListConfig.filterAdvanced.toFecha = entity.toFecha;
	this.dataListConfig.filterAdvanced.HoraFilter = entity.HoraFilter;
	this.dataListConfig.filterAdvanced.Hora = entity.Hora;
	this.dataListConfig.filterAdvanced.Cambio_RealizadoFilter = entity.Cambio_RealizadoFilter;
	this.dataListConfig.filterAdvanced.Cambio_Realizado = entity.Cambio_Realizado;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Historial_de_Cambios/list'], { state: { data: this.dataListConfig } });
  }
}
