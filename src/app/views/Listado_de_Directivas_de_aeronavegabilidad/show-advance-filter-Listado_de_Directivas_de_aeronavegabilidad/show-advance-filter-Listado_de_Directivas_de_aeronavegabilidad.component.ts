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


@Component({
  selector: 'app-show-advance-filter-Listado_de_Directivas_de_aeronavegabilidad',
  templateUrl: './show-advance-filter-Listado_de_Directivas_de_aeronavegabilidad.component.html',
  styleUrls: ['./show-advance-filter-Listado_de_Directivas_de_aeronavegabilidad.component.scss']
})
export class ShowAdvanceFilterListado_de_Directivas_de_aeronavegabilidadComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Matriculas: Aeronave[] = [];

  public aeronaves: Aeronave;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Fecha_de_Creacion",
      "Ingrese_N_de_Directiva_aeronavegabilidad",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Fecha_de_Creacion_filtro",
      "Ingrese_N_de_Directiva_aeronavegabilidad_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Matricula: "",
      Fecha_de_Creacion: null,
      Ingrese_N_de_Directiva_aeronavegabilidad: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromFecha_de_Creacion: "",
      toFecha_de_Creacion: "",

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

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      fromFecha_de_Creacion: [''],
      toFecha_de_Creacion: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Listado_de_Directivas_de_aeronavegabilidad/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeronaves ]) => {
		  this.aeronaves = aeronaves;
          

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
    this.dataListConfig.filterAdvanced.fromFecha_de_Creacion = entity.fromFecha_de_Creacion;
    this.dataListConfig.filterAdvanced.toFecha_de_Creacion = entity.toFecha_de_Creacion;
	this.dataListConfig.filterAdvanced.Ingrese_N_de_Directiva_aeronavegabilidadFilter = entity.Ingrese_N_de_Directiva_aeronavegabilidadFilter;
	this.dataListConfig.filterAdvanced.Ingrese_N_de_Directiva_aeronavegabilidad = entity.Ingrese_N_de_Directiva_aeronavegabilidad;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Listado_de_Directivas_de_aeronavegabilidad/list'], { state: { data: this.dataListConfig } });
  }
}
