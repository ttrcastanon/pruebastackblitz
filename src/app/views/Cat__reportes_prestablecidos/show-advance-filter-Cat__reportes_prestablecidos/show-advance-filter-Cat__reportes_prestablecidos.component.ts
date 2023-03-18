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
  selector: 'app-show-advance-filter-Cat__reportes_prestablecidos',
  templateUrl: './show-advance-filter-Cat__reportes_prestablecidos.component.html',
  styleUrls: ['./show-advance-filter-Cat__reportes_prestablecidos.component.scss']
})
export class ShowAdvanceFilterCat__reportes_prestablecidosComponent implements OnInit, AfterViewInit {

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
      "Reporte_de_inspeccion_de_entrada",
      "Tipo_de_reporte",
      "Prioridad",
      "Tipo_de_Codigo",
      "Codigo_NP",
      "Descripcion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Reporte_de_inspeccion_de_entrada_filtro",
      "Tipo_de_reporte_filtro",
      "Prioridad_filtro",
      "Tipo_de_Codigo_filtro",
      "Codigo_NP_filtro",
      "Descripcion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Reporte_de_inspeccion_de_entrada: "",
      Tipo_de_reporte: "",
      Prioridad: "",
      Tipo_de_Codigo: "",
      Codigo_NP: "",
      Descripcion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",

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

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Cat__reportes_prestablecidos/list']);
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
	this.dataListConfig.filterAdvanced.Reporte_de_inspeccion_de_entradaFilter = entity.Reporte_de_inspeccion_de_entradaFilter;
	this.dataListConfig.filterAdvanced.Reporte_de_inspeccion_de_entrada = entity.Reporte_de_inspeccion_de_entrada;
	this.dataListConfig.filterAdvanced.Tipo_de_reporteFilter = entity.Tipo_de_reporteFilter;
	this.dataListConfig.filterAdvanced.Tipo_de_reporte = entity.Tipo_de_reporte;
	this.dataListConfig.filterAdvanced.PrioridadFilter = entity.PrioridadFilter;
	this.dataListConfig.filterAdvanced.Prioridad = entity.Prioridad;
	this.dataListConfig.filterAdvanced.Tipo_de_CodigoFilter = entity.Tipo_de_CodigoFilter;
	this.dataListConfig.filterAdvanced.Tipo_de_Codigo = entity.Tipo_de_Codigo;
	this.dataListConfig.filterAdvanced.Codigo_NPFilter = entity.Codigo_NPFilter;
	this.dataListConfig.filterAdvanced.Codigo_NP = entity.Codigo_NP;
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Cat__reportes_prestablecidos/list'], { state: { data: this.dataListConfig } });
  }
}
