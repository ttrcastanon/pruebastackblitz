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

import { Tipo_de_Medio_de_Comunicacion } from 'src/app/models/Tipo_de_Medio_de_Comunicacion';
import { Tipo_de_Medio_de_ComunicacionService } from 'src/app/api-services/Tipo_de_Medio_de_Comunicacion.service';


@Component({
  selector: 'app-show-advance-filter-Medio_de_Comunicacion',
  templateUrl: './show-advance-filter-Medio_de_Comunicacion.component.html',
  styleUrls: ['./show-advance-filter-Medio_de_Comunicacion.component.scss']
})
export class ShowAdvanceFilterMedio_de_ComunicacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Tipos: Tipo_de_Medio_de_Comunicacion[] = [];

  public tipo_de_medio_de_comunicacions: Tipo_de_Medio_de_Comunicacion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Descripcion",
      "Tipo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Descripcion_filtro",
      "Tipo_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      Descripcion: "",
      Tipo: "",

    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",

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
    private tipo_de_medio_de_comunicacionService: Tipo_de_Medio_de_ComunicacionService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromClave: [''],
      toClave: [''],
      TipoFilter: [''],
      Tipo: [''],
      TipoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Medio_de_Comunicacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipo_de_medio_de_comunicacionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipo_de_medio_de_comunicacions ]) => {
		  this.tipo_de_medio_de_comunicacions = tipo_de_medio_de_comunicacions;
          

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
    this.dataListConfig.filterAdvanced.TipoFilter = entity.TipoFilter;
    this.dataListConfig.filterAdvanced.Tipo = entity.Tipo;
    this.dataListConfig.filterAdvanced.TipoMultiple = entity.TipoMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Medio_de_Comunicacion/list'], { state: { data: this.dataListConfig } });
  }
}
