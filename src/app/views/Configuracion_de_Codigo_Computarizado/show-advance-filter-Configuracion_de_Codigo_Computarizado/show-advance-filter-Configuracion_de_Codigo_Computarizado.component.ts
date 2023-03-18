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
  selector: 'app-show-advance-filter-Configuracion_de_Codigo_Computarizado',
  templateUrl: './show-advance-filter-Configuracion_de_Codigo_Computarizado.component.html',
  styleUrls: ['./show-advance-filter-Configuracion_de_Codigo_Computarizado.component.scss']
})
export class ShowAdvanceFilterConfiguracion_de_Codigo_ComputarizadoComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Codigo_Computarizados: Codigo_Computarizado[] = [];

  public codigo_computarizados: Codigo_Computarizado;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Codigo_Computarizado",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_Computarizado_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Codigo_Computarizado: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Codigo_ComputarizadoFilter: "",
      Codigo_Computarizado: "",
      Codigo_ComputarizadoMultiple: "",

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

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Configuracion_de_Codigo_Computarizado/list']);
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

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Configuracion_de_Codigo_Computarizado/list'], { state: { data: this.dataListConfig } });
  }
}
