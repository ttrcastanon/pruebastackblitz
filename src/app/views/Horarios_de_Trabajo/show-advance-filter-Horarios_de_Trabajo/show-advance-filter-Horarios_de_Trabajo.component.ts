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



@Component({
  selector: 'app-show-advance-filter-Horarios_de_Trabajo',
  templateUrl: './show-advance-filter-Horarios_de_Trabajo.component.html',
  styleUrls: ['./show-advance-filter-Horarios_de_Trabajo.component.scss']
})
export class ShowAdvanceFilterHorarios_de_TrabajoComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];


  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Descripcion",
      "Horas_de_trabajo",
      "Inicio_de_hora_laboral",
      "Fin_de_hora_laboral",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Descripcion_filtro",
      "Horas_de_trabajo_filtro",
      "Inicio_de_hora_laboral_filtro",
      "Fin_de_hora_laboral_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      Descripcion: "",
      Horas_de_trabajo: "",
      Inicio_de_hora_laboral: "",
      Fin_de_hora_laboral: "",

    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      fromHoras_de_trabajo: "",
      toHoras_de_trabajo: "",
      fromInicio_de_hora_laboral: "",
      toInicio_de_hora_laboral: "",
      fromFin_de_hora_laboral: "",
      toFin_de_hora_laboral: "",

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

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromClave: [''],
      toClave: [''],
      fromInicio_de_hora_laboral: [''],
      toInicio_de_hora_laboral: [''],
      fromFin_de_hora_laboral: [''],
      toFin_de_hora_laboral: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Horarios_de_Trabajo/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ]) => {
          

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
    this.dataListConfig.filterAdvanced.fromClave = entity.fromClave;
    this.dataListConfig.filterAdvanced.toClave = entity.toClave;
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
    this.dataListConfig.filterAdvanced.fromHoras_de_trabajo = entity.fromHoras_de_trabajo;
    this.dataListConfig.filterAdvanced.toHoras_de_trabajo = entity.toHoras_de_trabajo;
	this.dataListConfig.filterAdvanced.Inicio_de_hora_laboralFilter = entity.Inicio_de_hora_laboralFilter;
	this.dataListConfig.filterAdvanced.Inicio_de_hora_laboral = entity.Inicio_de_hora_laboral;
	this.dataListConfig.filterAdvanced.Fin_de_hora_laboralFilter = entity.Fin_de_hora_laboralFilter;
	this.dataListConfig.filterAdvanced.Fin_de_hora_laboral = entity.Fin_de_hora_laboral;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Horarios_de_Trabajo/list'], { state: { data: this.dataListConfig } });
  }
}
