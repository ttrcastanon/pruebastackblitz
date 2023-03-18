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

import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Departamento } from 'src/app/models/Departamento';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Categoria_de_Partes } from 'src/app/models/Categoria_de_Partes';
import { Categoria_de_PartesService } from 'src/app/api-services/Categoria_de_Partes.service';
import { Estatus_de_Seguimiento_de_Materiales } from 'src/app/models/Estatus_de_Seguimiento_de_Materiales';
import { Estatus_de_Seguimiento_de_MaterialesService } from 'src/app/api-services/Estatus_de_Seguimiento_de_Materiales.service';


@Component({
  selector: 'app-show-advance-filter-Listado_de_compras_en_proceso',
  templateUrl: './show-advance-filter-Listado_de_compras_en_proceso.component.html',
  styleUrls: ['./show-advance-filter-Listado_de_compras_en_proceso.component.scss']
})
export class ShowAdvanceFilterListado_de_compras_en_procesoComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public No__de_OCs: Generacion_de_Orden_de_Compras[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];
  public Departamentos: Departamento[] = [];
  public Categorias: Categoria_de_Partes[] = [];
  public Estatuss: Estatus_de_Seguimiento_de_Materiales[] = [];

  public generacion_de_orden_de_comprass: Generacion_de_Orden_de_Compras;
  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public departamentos: Departamento;
  public categoria_de_partess: Categoria_de_Partes;
  public estatus_de_seguimiento_de_materialess: Estatus_de_Seguimiento_de_Materiales;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_OC",
      "Proveedor",
      "Departamento",
      "Categoria",
      "Estatus",
      "Fecha_de_Entrega_Inicial",
      "Fecha_de_Entrega_Final",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_OC_filtro",
      "Proveedor_filtro",
      "Departamento_filtro",
      "Categoria_filtro",
      "Estatus_filtro",
      "Fecha_de_Entrega_Inicial_filtro",
      "Fecha_de_Entrega_Final_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No__de_OC: "",
      Proveedor: "",
      Departamento: "",
      Categoria: "",
      Estatus: "",
      Fecha_de_Entrega_Inicial: null,
      Fecha_de_Entrega_Final: null,

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      No__de_OCFilter: "",
      No__de_OC: "",
      No__de_OCMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      CategoriaFilter: "",
      Categoria: "",
      CategoriaMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromFecha_de_Entrega_Inicial: "",
      toFecha_de_Entrega_Inicial: "",
      fromFecha_de_Entrega_Final: "",
      toFecha_de_Entrega_Final: "",

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
    private generacion_de_orden_de_comprasService: Generacion_de_Orden_de_ComprasService,
    private creacion_de_proveedoresService: Creacion_de_ProveedoresService,
    private departamentoService: DepartamentoService,
    private categoria_de_partesService: Categoria_de_PartesService,
    private estatus_de_seguimiento_de_materialesService: Estatus_de_Seguimiento_de_MaterialesService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      No__de_OCFilter: [''],
      No__de_OC: [''],
      No__de_OCMultiple: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],
      DepartamentoFilter: [''],
      Departamento: [''],
      DepartamentoMultiple: [''],
      CategoriaFilter: [''],
      Categoria: [''],
      CategoriaMultiple: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromFecha_de_Entrega_Inicial: [''],
      toFecha_de_Entrega_Inicial: [''],
      fromFecha_de_Entrega_Final: [''],
      toFecha_de_Entrega_Final: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Listado_de_compras_en_proceso/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.generacion_de_orden_de_comprasService.getAll());
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.departamentoService.getAll());
    observablesArray.push(this.categoria_de_partesService.getAll());
    observablesArray.push(this.estatus_de_seguimiento_de_materialesService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,generacion_de_orden_de_comprass ,creacion_de_proveedoress ,departamentos ,categoria_de_partess ,estatus_de_seguimiento_de_materialess ]) => {
		  this.generacion_de_orden_de_comprass = generacion_de_orden_de_comprass;
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
		  this.departamentos = departamentos;
		  this.categoria_de_partess = categoria_de_partess;
		  this.estatus_de_seguimiento_de_materialess = estatus_de_seguimiento_de_materialess;
          

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
    this.dataListConfig.filterAdvanced.No__de_OCFilter = entity.No__de_OCFilter;
    this.dataListConfig.filterAdvanced.No__de_OC = entity.No__de_OC;
    this.dataListConfig.filterAdvanced.No__de_OCMultiple = entity.No__de_OCMultiple;
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
    this.dataListConfig.filterAdvanced.DepartamentoFilter = entity.DepartamentoFilter;
    this.dataListConfig.filterAdvanced.Departamento = entity.Departamento;
    this.dataListConfig.filterAdvanced.DepartamentoMultiple = entity.DepartamentoMultiple;
    this.dataListConfig.filterAdvanced.CategoriaFilter = entity.CategoriaFilter;
    this.dataListConfig.filterAdvanced.Categoria = entity.Categoria;
    this.dataListConfig.filterAdvanced.CategoriaMultiple = entity.CategoriaMultiple;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Entrega_Inicial = entity.fromFecha_de_Entrega_Inicial;
    this.dataListConfig.filterAdvanced.toFecha_de_Entrega_Inicial = entity.toFecha_de_Entrega_Inicial;
    this.dataListConfig.filterAdvanced.fromFecha_de_Entrega_Final = entity.fromFecha_de_Entrega_Final;
    this.dataListConfig.filterAdvanced.toFecha_de_Entrega_Final = entity.toFecha_de_Entrega_Final;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Listado_de_compras_en_proceso/list'], { state: { data: this.dataListConfig } });
  }
}
