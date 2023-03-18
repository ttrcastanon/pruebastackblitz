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
import { Catalago_Manual_de_Usuario } from 'src/app/models/Catalago_Manual_de_Usuario';
import { Catalago_Manual_de_UsuarioService } from 'src/app/api-services/Catalago_Manual_de_Usuario.service';


@Component({
  selector: 'app-show-advance-filter-Herramientas',
  templateUrl: './show-advance-filter-Herramientas.component.html',
  styleUrls: ['./show-advance-filter-Herramientas.component.scss']
})
export class ShowAdvanceFilterHerramientasComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Categorias: Categoria_de_Partes[] = [];
  public Manual_del_Usuarios: Catalago_Manual_de_Usuario[] = [];

  public categoria_de_partess: Categoria_de_Partes;
  public catalago_manual_de_usuarios: Catalago_Manual_de_Usuario;

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
      "No_de_Serie",
      "Codigo_de_calibracion",
      "Manual_del_Usuario",
      "Alcance",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_filtro",
      "Categoria_filtro",
      "Descripcion_filtro",
      "Codigo_Descripcion_filtro",
      "No_de_Serie_filtro",
      "Codigo_de_calibracion_filtro",
      "Manual_del_Usuario_filtro",
      "Alcance_filtro",

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
      No_de_Serie: "",
      Codigo_de_calibracion: "",
      Manual_del_Usuario: "",
      Alcance: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      CategoriaFilter: "",
      Categoria: "",
      CategoriaMultiple: "",
      Manual_del_UsuarioFilter: "",
      Manual_del_Usuario: "",
      Manual_del_UsuarioMultiple: "",

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
    private catalago_manual_de_usuarioService: Catalago_Manual_de_UsuarioService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      CategoriaFilter: [''],
      Categoria: [''],
      CategoriaMultiple: [''],
      Manual_del_UsuarioFilter: [''],
      Manual_del_Usuario: [''],
      Manual_del_UsuarioMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Herramientas/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.categoria_de_partesService.getAll());
    observablesArray.push(this.catalago_manual_de_usuarioService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,categoria_de_partess ,catalago_manual_de_usuarios ]) => {
		  this.categoria_de_partess = categoria_de_partess;
		  this.catalago_manual_de_usuarios = catalago_manual_de_usuarios;
          

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
	this.dataListConfig.filterAdvanced.No_de_SerieFilter = entity.No_de_SerieFilter;
	this.dataListConfig.filterAdvanced.No_de_Serie = entity.No_de_Serie;
	this.dataListConfig.filterAdvanced.Codigo_de_calibracionFilter = entity.Codigo_de_calibracionFilter;
	this.dataListConfig.filterAdvanced.Codigo_de_calibracion = entity.Codigo_de_calibracion;
    this.dataListConfig.filterAdvanced.Manual_del_UsuarioFilter = entity.Manual_del_UsuarioFilter;
    this.dataListConfig.filterAdvanced.Manual_del_Usuario = entity.Manual_del_Usuario;
    this.dataListConfig.filterAdvanced.Manual_del_UsuarioMultiple = entity.Manual_del_UsuarioMultiple;
	this.dataListConfig.filterAdvanced.AlcanceFilter = entity.AlcanceFilter;
	this.dataListConfig.filterAdvanced.Alcance = entity.Alcance;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Herramientas/list'], { state: { data: this.dataListConfig } });
  }
}
