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
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';


@Component({
  selector: 'app-show-advance-filter-Listado_de_Pago_de_Proveedores',
  templateUrl: './show-advance-filter-Listado_de_Pago_de_Proveedores.component.html',
  styleUrls: ['./show-advance-filter-Listado_de_Pago_de_Proveedores.component.scss']
})
export class ShowAdvanceFilterListado_de_Pago_de_ProveedoresComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];
  public No__de_OCs: Generacion_de_Orden_de_Compras[] = [];
  public Estatuss: Estatus_de_Seguimiento[] = [];

  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public generacion_de_orden_de_comprass: Generacion_de_Orden_de_Compras;
  public estatus_de_seguimientos: Estatus_de_Seguimiento;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Proveedor",
      "No__de_OC",
      "Fecha_Requerida",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Proveedor_filtro",
      "No__de_OC_filtro",
      "Fecha_Requerida_filtro",
      "Estatus_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Proveedor: "",
      No__de_OC: "",
      Fecha_Requerida: null,
      Estatus: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      No__de_OCFilter: "",
      No__de_OC: "",
      No__de_OCMultiple: "",
      fromFecha_Requerida: "",
      toFecha_Requerida: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

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
    private estatus_de_seguimientoService: Estatus_de_SeguimientoService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],
      No__de_OCFilter: [''],
      No__de_OC: [''],
      No__de_OCMultiple: [''],
      fromFecha_Requerida: [''],
      toFecha_Requerida: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Listado_de_Pago_de_Proveedores/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.generacion_de_orden_de_comprasService.getAll());
    observablesArray.push(this.estatus_de_seguimientoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,creacion_de_proveedoress ,generacion_de_orden_de_comprass ,estatus_de_seguimientos ]) => {
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
		  this.generacion_de_orden_de_comprass = generacion_de_orden_de_comprass;
		  this.estatus_de_seguimientos = estatus_de_seguimientos;
          

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
    this.dataListConfig.filterAdvanced.No__de_OCFilter = entity.No__de_OCFilter;
    this.dataListConfig.filterAdvanced.No__de_OC = entity.No__de_OC;
    this.dataListConfig.filterAdvanced.No__de_OCMultiple = entity.No__de_OCMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_Requerida = entity.fromFecha_Requerida;
    this.dataListConfig.filterAdvanced.toFecha_Requerida = entity.toFecha_Requerida;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Listado_de_Pago_de_Proveedores/list'], { state: { data: this.dataListConfig } });
  }
}
