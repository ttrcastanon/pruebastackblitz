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
  selector: 'app-show-advance-filter-Politicas_de_Precios_y_Descuentos',
  templateUrl: './show-advance-filter-Politicas_de_Precios_y_Descuentos.component.html',
  styleUrls: ['./show-advance-filter-Politicas_de_Precios_y_Descuentos.component.scss']
})
export class ShowAdvanceFilterPoliticas_de_Precios_y_DescuentosComponent implements OnInit, AfterViewInit {

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
      "Folio",
      "contrato_tarifa_tecnico",
      "contrato_tarifa_rampa",
      "sin_contrato_tarifa_tecnico",
      "sin_contrato_tarifa_rampa",
      "Clausulas_de_Cotizacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "contrato_tarifa_tecnico_filtro",
      "contrato_tarifa_rampa_filtro",
      "sin_contrato_tarifa_tecnico_filtro",
      "sin_contrato_tarifa_rampa_filtro",
      "Clausulas_de_Cotizacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      contrato_tarifa_tecnico: "",
      contrato_tarifa_rampa: "",
      sin_contrato_tarifa_tecnico: "",
      sin_contrato_tarifa_rampa: "",
      Clausulas_de_Cotizacion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromcontrato_tarifa_tecnico: "",
      tocontrato_tarifa_tecnico: "",
      fromcontrato_tarifa_rampa: "",
      tocontrato_tarifa_rampa: "",
      fromsin_contrato_tarifa_tecnico: "",
      tosin_contrato_tarifa_tecnico: "",
      fromsin_contrato_tarifa_rampa: "",
      tosin_contrato_tarifa_rampa: "",

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
      fromFolio: [''],
      toFolio: [''],
      fromcontrato_tarifa_tecnico: [''],
      tocontrato_tarifa_tecnico: [''],
      fromcontrato_tarifa_rampa: [''],
      tocontrato_tarifa_rampa: [''],
      fromsin_contrato_tarifa_tecnico: [''],
      tosin_contrato_tarifa_tecnico: [''],
      fromsin_contrato_tarifa_rampa: [''],
      tosin_contrato_tarifa_rampa: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Politicas_de_Precios_y_Descuentos/list']);
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
    this.dataListConfig.filterAdvanced.fromFolio = entity.fromFolio;
    this.dataListConfig.filterAdvanced.toFolio = entity.toFolio;
    this.dataListConfig.filterAdvanced.fromcontrato_tarifa_tecnico = entity.fromcontrato_tarifa_tecnico;
    this.dataListConfig.filterAdvanced.tocontrato_tarifa_tecnico = entity.tocontrato_tarifa_tecnico;
    this.dataListConfig.filterAdvanced.fromcontrato_tarifa_rampa = entity.fromcontrato_tarifa_rampa;
    this.dataListConfig.filterAdvanced.tocontrato_tarifa_rampa = entity.tocontrato_tarifa_rampa;
    this.dataListConfig.filterAdvanced.fromsin_contrato_tarifa_tecnico = entity.fromsin_contrato_tarifa_tecnico;
    this.dataListConfig.filterAdvanced.tosin_contrato_tarifa_tecnico = entity.tosin_contrato_tarifa_tecnico;
    this.dataListConfig.filterAdvanced.fromsin_contrato_tarifa_rampa = entity.fromsin_contrato_tarifa_rampa;
    this.dataListConfig.filterAdvanced.tosin_contrato_tarifa_rampa = entity.tosin_contrato_tarifa_rampa;
	this.dataListConfig.filterAdvanced.Clausulas_de_CotizacionFilter = entity.Clausulas_de_CotizacionFilter;
	this.dataListConfig.filterAdvanced.Clausulas_de_Cotizacion = entity.Clausulas_de_Cotizacion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Politicas_de_Precios_y_Descuentos/list'], { state: { data: this.dataListConfig } });
  }
}
