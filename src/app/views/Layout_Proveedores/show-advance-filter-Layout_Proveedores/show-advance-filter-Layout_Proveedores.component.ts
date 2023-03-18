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


@Component({
  selector: 'app-show-advance-filter-Layout_Proveedores',
  templateUrl: './show-advance-filter-Layout_Proveedores.component.html',
  styleUrls: ['./show-advance-filter-Layout_Proveedores.component.scss']
})
export class ShowAdvanceFilterLayout_ProveedoresComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public ID_Proveedors: Creacion_de_Proveedores[] = [];
  public RFC_Proveedors: Creacion_de_Proveedores[] = [];

  public creacion_de_proveedoress: Creacion_de_Proveedores;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "ID_Proveedor",
      "RFC_Proveedor",
      "Descripcion_Proveedor",
      "Monto",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_de_carga_manual_filtro",
      "Fecha_filtro",
      "ID_Proveedor_filtro",
      "RFC_Proveedor_filtro",
      "Descripcion_Proveedor_filtro",
      "Monto_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Folio_de_carga_manual: "",
      Fecha: null,
      ID_Proveedor: "",
      RFC_Proveedor: "",
      Descripcion_Proveedor: "",
      Monto: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFolio_de_carga_manual: "",
      toFolio_de_carga_manual: "",
      fromFecha: "",
      toFecha: "",
      ID_ProveedorFilter: "",
      ID_Proveedor: "",
      ID_ProveedorMultiple: "",
      RFC_ProveedorFilter: "",
      RFC_Proveedor: "",
      RFC_ProveedorMultiple: "",
      fromMonto: "",
      toMonto: "",

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

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFolio_de_carga_manual: [''],
      toFolio_de_carga_manual: [''],
      fromFecha: [''],
      toFecha: [''],
      ID_ProveedorFilter: [''],
      ID_Proveedor: [''],
      ID_ProveedorMultiple: [''],
      RFC_ProveedorFilter: [''],
      RFC_Proveedor: [''],
      RFC_ProveedorMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Layout_Proveedores/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.creacion_de_proveedoresService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,creacion_de_proveedoress ]) => {
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
          

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
    this.dataListConfig.filterAdvanced.fromFolio_de_carga_manual = entity.fromFolio_de_carga_manual;
    this.dataListConfig.filterAdvanced.toFolio_de_carga_manual = entity.toFolio_de_carga_manual;
    this.dataListConfig.filterAdvanced.fromFecha = entity.fromFecha;
    this.dataListConfig.filterAdvanced.toFecha = entity.toFecha;
    this.dataListConfig.filterAdvanced.ID_ProveedorFilter = entity.ID_ProveedorFilter;
    this.dataListConfig.filterAdvanced.ID_Proveedor = entity.ID_Proveedor;
    this.dataListConfig.filterAdvanced.ID_ProveedorMultiple = entity.ID_ProveedorMultiple;
    this.dataListConfig.filterAdvanced.RFC_ProveedorFilter = entity.RFC_ProveedorFilter;
    this.dataListConfig.filterAdvanced.RFC_Proveedor = entity.RFC_Proveedor;
    this.dataListConfig.filterAdvanced.RFC_ProveedorMultiple = entity.RFC_ProveedorMultiple;
	this.dataListConfig.filterAdvanced.Descripcion_ProveedorFilter = entity.Descripcion_ProveedorFilter;
	this.dataListConfig.filterAdvanced.Descripcion_Proveedor = entity.Descripcion_Proveedor;
    this.dataListConfig.filterAdvanced.fromMonto = entity.fromMonto;
    this.dataListConfig.filterAdvanced.toMonto = entity.toMonto;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Layout_Proveedores/list'], { state: { data: this.dataListConfig } });
  }
}
