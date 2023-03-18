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
import { Razon_de_Rechazo_a_Almacen } from 'src/app/models/Razon_de_Rechazo_a_Almacen';
import { Razon_de_Rechazo_a_AlmacenService } from 'src/app/api-services/Razon_de_Rechazo_a_Almacen.service';


@Component({
  selector: 'app-show-advance-filter-Notificacion_de_rechazo_al_ingreso_de_almacen',
  templateUrl: './show-advance-filter-Notificacion_de_rechazo_al_ingreso_de_almacen.component.html',
  styleUrls: ['./show-advance-filter-Notificacion_de_rechazo_al_ingreso_de_almacen.component.scss']
})
export class ShowAdvanceFilterNotificacion_de_rechazo_al_ingreso_de_almacenComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];
  public Razons: Razon_de_Rechazo_a_Almacen[] = [];

  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public razon_de_rechazo_a_almacens: Razon_de_Rechazo_a_Almacen;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_Parte___Descripcion",
      "Proveedor",
      "Razon",
      "Motivo_de_devolucion",
      "IdNotificacionRechazoIA",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_Parte___Descripcion_filtro",
      "Proveedor_filtro",
      "Razon_filtro",
      "Motivo_de_devolucion_filtro",
      "IdNotificacionRechazoIA_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No__de_Parte___Descripcion: "",
      Proveedor: "",
      Razon: "",
      Motivo_de_devolucion: "",
      IdNotificacionRechazoIA: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      RazonFilter: "",
      Razon: "",
      RazonMultiple: "",

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
    private razon_de_rechazo_a_almacenService: Razon_de_Rechazo_a_AlmacenService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],
      RazonFilter: [''],
      Razon: [''],
      RazonMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Notificacion_de_rechazo_al_ingreso_de_almacen/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.razon_de_rechazo_a_almacenService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,creacion_de_proveedoress ,razon_de_rechazo_a_almacens ]) => {
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
		  this.razon_de_rechazo_a_almacens = razon_de_rechazo_a_almacens;
          

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
	this.dataListConfig.filterAdvanced.No__de_Parte___DescripcionFilter = entity.No__de_Parte___DescripcionFilter;
	this.dataListConfig.filterAdvanced.No__de_Parte___Descripcion = entity.No__de_Parte___Descripcion;
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
    this.dataListConfig.filterAdvanced.RazonFilter = entity.RazonFilter;
    this.dataListConfig.filterAdvanced.Razon = entity.Razon;
    this.dataListConfig.filterAdvanced.RazonMultiple = entity.RazonMultiple;
	this.dataListConfig.filterAdvanced.Motivo_de_devolucionFilter = entity.Motivo_de_devolucionFilter;
	this.dataListConfig.filterAdvanced.Motivo_de_devolucion = entity.Motivo_de_devolucion;
	this.dataListConfig.filterAdvanced.IdNotificacionRechazoIAFilter = entity.IdNotificacionRechazoIAFilter;
	this.dataListConfig.filterAdvanced.IdNotificacionRechazoIA = entity.IdNotificacionRechazoIA;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Notificacion_de_rechazo_al_ingreso_de_almacen/list'], { state: { data: this.dataListConfig } });
  }
}
