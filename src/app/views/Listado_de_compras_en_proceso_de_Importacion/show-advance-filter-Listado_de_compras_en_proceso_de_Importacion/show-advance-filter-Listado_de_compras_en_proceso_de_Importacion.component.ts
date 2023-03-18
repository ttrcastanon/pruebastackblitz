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

import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Generacion_de_Orden_de_Compras } from 'src/app/models/Generacion_de_Orden_de_Compras';
import { Generacion_de_Orden_de_ComprasService } from 'src/app/api-services/Generacion_de_Orden_de_Compras.service';


@Component({
  selector: 'app-show-advance-filter-Listado_de_compras_en_proceso_de_Importacion',
  templateUrl: './show-advance-filter-Listado_de_compras_en_proceso_de_Importacion.component.html',
  styleUrls: ['./show-advance-filter-Listado_de_compras_en_proceso_de_Importacion.component.scss']
})
export class ShowAdvanceFilterListado_de_compras_en_proceso_de_ImportacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];
  public No__Orden_de_Compras: Generacion_de_Orden_de_Compras[] = [];

  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public generacion_de_orden_de_comprass: Generacion_de_Orden_de_Compras;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Proveedor",
      "No__Orden_de_Compra",
      "Fecha_de_Factura",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Proveedor_filtro",
      "No__Orden_de_Compra_filtro",
      "Fecha_de_Factura_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Proveedor: "",
      No__Orden_de_Compra: "",
      Fecha_de_Factura: null,

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      No__Orden_de_CompraFilter: "",
      No__Orden_de_Compra: "",
      No__Orden_de_CompraMultiple: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",

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
    private creacion_de_proveedoresService: Creacion_de_ProveedoresService,
    private generacion_de_orden_de_comprasService: Generacion_de_Orden_de_ComprasService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],
      No__Orden_de_CompraFilter: [''],
      No__Orden_de_Compra: [''],
      No__Orden_de_CompraMultiple: [''],
      fromFecha_de_Factura: [''],
      toFecha_de_Factura: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Listado_de_compras_en_proceso_de_Importacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.generacion_de_orden_de_comprasService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,creacion_de_proveedoress ,generacion_de_orden_de_comprass ]) => {
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
		  this.generacion_de_orden_de_comprass = generacion_de_orden_de_comprass;
          

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
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
    this.dataListConfig.filterAdvanced.No__Orden_de_CompraFilter = entity.No__Orden_de_CompraFilter;
    this.dataListConfig.filterAdvanced.No__Orden_de_Compra = entity.No__Orden_de_Compra;
    this.dataListConfig.filterAdvanced.No__Orden_de_CompraMultiple = entity.No__Orden_de_CompraMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura = entity.fromFecha_de_Factura;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura = entity.toFecha_de_Factura;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Listado_de_compras_en_proceso_de_Importacion/list'], { state: { data: this.dataListConfig } });
  }
}
