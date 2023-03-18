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

import { Categoria_de_Partes } from 'src/app/models/Categoria_de_Partes';
import { Categoria_de_PartesService } from 'src/app/api-services/Categoria_de_Partes.service';


@Component({
  selector: 'app-show-advance-filter-Catalogo_servicios',
  templateUrl: './show-advance-filter-Catalogo_servicios.component.html',
  styleUrls: ['./show-advance-filter-Catalogo_servicios.component.scss']
})
export class ShowAdvanceFilterCatalogo_serviciosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Categorias: Categoria_de_Partes[] = [];

  public categoria_de_partess: Categoria_de_Partes;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Codigo",
      "Categoria",
      "Descripcion",
      "Codigo_Descripcion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_filtro",
      "Categoria_filtro",
      "Descripcion_filtro",
      "Codigo_Descripcion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Codigo: "",
      Categoria: "",
      Descripcion: "",
      Codigo_Descripcion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      CategoriaFilter: "",
      Categoria: "",
      CategoriaMultiple: "",

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
    private categoria_de_partesService: Categoria_de_PartesService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      CategoriaFilter: [''],
      Categoria: [''],
      CategoriaMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Catalogo_servicios/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.categoria_de_partesService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,categoria_de_partess ]) => {
		  this.categoria_de_partess = categoria_de_partess;
          

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
	this.dataListConfig.filterAdvanced.CodigoFilter = entity.CodigoFilter;
	this.dataListConfig.filterAdvanced.Codigo = entity.Codigo;
    this.dataListConfig.filterAdvanced.CategoriaFilter = entity.CategoriaFilter;
    this.dataListConfig.filterAdvanced.Categoria = entity.Categoria;
    this.dataListConfig.filterAdvanced.CategoriaMultiple = entity.CategoriaMultiple;
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
	this.dataListConfig.filterAdvanced.Codigo_DescripcionFilter = entity.Codigo_DescripcionFilter;
	this.dataListConfig.filterAdvanced.Codigo_Descripcion = entity.Codigo_Descripcion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Catalogo_servicios/list'], { state: { data: this.dataListConfig } });
  }
}
