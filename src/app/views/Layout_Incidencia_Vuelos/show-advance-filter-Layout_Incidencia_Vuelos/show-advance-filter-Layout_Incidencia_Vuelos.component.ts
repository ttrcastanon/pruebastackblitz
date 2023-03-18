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
import { Tipo_Incidencia_Vuelos } from 'src/app/models/Tipo_Incidencia_Vuelos';
import { Tipo_Incidencia_VuelosService } from 'src/app/api-services/Tipo_Incidencia_Vuelos.service';
import { Responsable_Incidencia_Vuelo } from 'src/app/models/Responsable_Incidencia_Vuelo';
import { Responsable_Incidencia_VueloService } from 'src/app/api-services/Responsable_Incidencia_Vuelo.service';


@Component({
  selector: 'app-show-advance-filter-Layout_Incidencia_Vuelos',
  templateUrl: './show-advance-filter-Layout_Incidencia_Vuelos.component.html',
  styleUrls: ['./show-advance-filter-Layout_Incidencia_Vuelos.component.scss']
})
export class ShowAdvanceFilterLayout_Incidencia_VuelosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Vuelos: Solicitud_de_Vuelo[] = [];
  public TipoIncidencias: Tipo_Incidencia_Vuelos[] = [];
  public Responsables: Responsable_Incidencia_Vuelo[] = [];

  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public tipo_incidencia_vueloss: Tipo_Incidencia_Vuelos;
  public responsable_incidencia_vuelos: Responsable_Incidencia_Vuelo;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "Vuelo",
      "TipoIncidencia",
      "Responsable",
      "Motivo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_de_carga_manual_filtro",
      "Fecha_filtro",
      "Vuelo_filtro",
      "TipoIncidencia_filtro",
      "Responsable_filtro",
      "Motivo_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Folio_de_carga_manual: "",
      Fecha: null,
      Vuelo: "",
      TipoIncidencia: "",
      Responsable: "",
      Motivo: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFolio_de_carga_manual: "",
      toFolio_de_carga_manual: "",
      fromFecha: "",
      toFecha: "",
      VueloFilter: "",
      Vuelo: "",
      VueloMultiple: "",
      TipoIncidenciaFilter: "",
      TipoIncidencia: "",
      TipoIncidenciaMultiple: "",
      ResponsableFilter: "",
      Responsable: "",
      ResponsableMultiple: "",

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
    private tipo_incidencia_vuelosService: Tipo_Incidencia_VuelosService,
    private responsable_incidencia_vueloService: Responsable_Incidencia_VueloService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFolio_de_carga_manual: [''],
      toFolio_de_carga_manual: [''],
      fromFecha: [''],
      toFecha: [''],
      VueloFilter: [''],
      Vuelo: [''],
      VueloMultiple: [''],
      TipoIncidenciaFilter: [''],
      TipoIncidencia: [''],
      TipoIncidenciaMultiple: [''],
      ResponsableFilter: [''],
      Responsable: [''],
      ResponsableMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Layout_Incidencia_Vuelos/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.tipo_incidencia_vuelosService.getAll());
    observablesArray.push(this.responsable_incidencia_vueloService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_vuelos ,tipo_incidencia_vueloss ,responsable_incidencia_vuelos ]) => {
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.tipo_incidencia_vueloss = tipo_incidencia_vueloss;
		  this.responsable_incidencia_vuelos = responsable_incidencia_vuelos;
          

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
    this.dataListConfig.filterAdvanced.fromFolio_de_carga_manual = entity.fromFolio_de_carga_manual;
    this.dataListConfig.filterAdvanced.toFolio_de_carga_manual = entity.toFolio_de_carga_manual;
    this.dataListConfig.filterAdvanced.fromFecha = entity.fromFecha;
    this.dataListConfig.filterAdvanced.toFecha = entity.toFecha;
    this.dataListConfig.filterAdvanced.VueloFilter = entity.VueloFilter;
    this.dataListConfig.filterAdvanced.Vuelo = entity.Vuelo;
    this.dataListConfig.filterAdvanced.VueloMultiple = entity.VueloMultiple;
    this.dataListConfig.filterAdvanced.TipoIncidenciaFilter = entity.TipoIncidenciaFilter;
    this.dataListConfig.filterAdvanced.TipoIncidencia = entity.TipoIncidencia;
    this.dataListConfig.filterAdvanced.TipoIncidenciaMultiple = entity.TipoIncidenciaMultiple;
    this.dataListConfig.filterAdvanced.ResponsableFilter = entity.ResponsableFilter;
    this.dataListConfig.filterAdvanced.Responsable = entity.Responsable;
    this.dataListConfig.filterAdvanced.ResponsableMultiple = entity.ResponsableMultiple;
	this.dataListConfig.filterAdvanced.MotivoFilter = entity.MotivoFilter;
	this.dataListConfig.filterAdvanced.Motivo = entity.Motivo;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Layout_Incidencia_Vuelos/list'], { state: { data: this.dataListConfig } });
  }
}
