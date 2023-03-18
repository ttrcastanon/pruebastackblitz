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
import { Registro_de_vuelo } from 'src/app/models/Registro_de_vuelo';
import { Registro_de_vueloService } from 'src/app/api-services/Registro_de_vuelo.service';


@Component({
  selector: 'app-show-advance-filter-Impresion_de_Bitacora_de_Vuelo',
  templateUrl: './show-advance-filter-Impresion_de_Bitacora_de_Vuelo.component.html',
  styleUrls: ['./show-advance-filter-Impresion_de_Bitacora_de_Vuelo.component.scss']
})
export class ShowAdvanceFilterImpresion_de_Bitacora_de_VueloComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Vuelos: Solicitud_de_Vuelo[] = [];
  public Tramo1s: Registro_de_vuelo[] = [];
  public Tramo2s: Registro_de_vuelo[] = [];
  public Tramo3s: Registro_de_vuelo[] = [];
  public Tramo4s: Registro_de_vuelo[] = [];
  public Tramo5s: Registro_de_vuelo[] = [];

  public solicitud_de_vuelos: Solicitud_de_Vuelo;
  public registro_de_vuelos: Registro_de_vuelo;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Vuelo",
      "Fecha",
      "Tramo1",
      "Tramo2",
      "Tramo3",
      "Tramo4",
      "Tramo5",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Vuelo_filtro",
      "Fecha_filtro",
      "Tramo1_filtro",
      "Tramo2_filtro",
      "Tramo3_filtro",
      "Tramo4_filtro",
      "Tramo5_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Vuelo: "",
      Fecha: null,
      Tramo1: "",
      Tramo2: "",
      Tramo3: "",
      Tramo4: "",
      Tramo5: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      VueloFilter: "",
      Vuelo: "",
      VueloMultiple: "",
      fromFecha: "",
      toFecha: "",
      Tramo1Filter: "",
      Tramo1: "",
      Tramo1Multiple: "",
      Tramo2Filter: "",
      Tramo2: "",
      Tramo2Multiple: "",
      Tramo3Filter: "",
      Tramo3: "",
      Tramo3Multiple: "",
      Tramo4Filter: "",
      Tramo4: "",
      Tramo4Multiple: "",
      Tramo5Filter: "",
      Tramo5: "",
      Tramo5Multiple: "",

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
    private registro_de_vueloService: Registro_de_vueloService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      VueloFilter: [''],
      Vuelo: [''],
      VueloMultiple: [''],
      fromFecha: [''],
      toFecha: [''],
      Tramo1Filter: [''],
      Tramo1: [''],
      Tramo1Multiple: [''],
      Tramo2Filter: [''],
      Tramo2: [''],
      Tramo2Multiple: [''],
      Tramo3Filter: [''],
      Tramo3: [''],
      Tramo3Multiple: [''],
      Tramo4Filter: [''],
      Tramo4: [''],
      Tramo4Multiple: [''],
      Tramo5Filter: [''],
      Tramo5: [''],
      Tramo5Multiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Impresion_de_Bitacora_de_Vuelo/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_vueloService.getAll());
    observablesArray.push(this.registro_de_vueloService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_vuelos ,registro_de_vuelos ]) => {
		  this.solicitud_de_vuelos = solicitud_de_vuelos;
		  this.registro_de_vuelos = registro_de_vuelos;
          

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
    this.dataListConfig.filterAdvanced.fromFecha = entity.fromFecha;
    this.dataListConfig.filterAdvanced.toFecha = entity.toFecha;
    this.dataListConfig.filterAdvanced.Tramo1Filter = entity.Tramo1Filter;
    this.dataListConfig.filterAdvanced.Tramo1 = entity.Tramo1;
    this.dataListConfig.filterAdvanced.Tramo1Multiple = entity.Tramo1Multiple;
    this.dataListConfig.filterAdvanced.Tramo2Filter = entity.Tramo2Filter;
    this.dataListConfig.filterAdvanced.Tramo2 = entity.Tramo2;
    this.dataListConfig.filterAdvanced.Tramo2Multiple = entity.Tramo2Multiple;
    this.dataListConfig.filterAdvanced.Tramo3Filter = entity.Tramo3Filter;
    this.dataListConfig.filterAdvanced.Tramo3 = entity.Tramo3;
    this.dataListConfig.filterAdvanced.Tramo3Multiple = entity.Tramo3Multiple;
    this.dataListConfig.filterAdvanced.Tramo4Filter = entity.Tramo4Filter;
    this.dataListConfig.filterAdvanced.Tramo4 = entity.Tramo4;
    this.dataListConfig.filterAdvanced.Tramo4Multiple = entity.Tramo4Multiple;
    this.dataListConfig.filterAdvanced.Tramo5Filter = entity.Tramo5Filter;
    this.dataListConfig.filterAdvanced.Tramo5 = entity.Tramo5;
    this.dataListConfig.filterAdvanced.Tramo5Multiple = entity.Tramo5Multiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Impresion_de_Bitacora_de_Vuelo/list'], { state: { data: this.dataListConfig } });
  }
}
