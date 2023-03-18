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

import { Detalle_de_Materiales } from 'src/app/models/Detalle_de_Materiales';
import { Detalle_de_MaterialesService } from 'src/app/api-services/Detalle_de_Materiales.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';


@Component({
  selector: 'app-show-advance-filter-Comparativo_de_Proveedores_Materiales',
  templateUrl: './show-advance-filter-Comparativo_de_Proveedores_Materiales.component.html',
  styleUrls: ['./show-advance-filter-Comparativo_de_Proveedores_Materiales.component.scss']
})
export class ShowAdvanceFilterComparativo_de_Proveedores_MaterialesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Folio_MR_Materialess: Detalle_de_Materiales[] = [];
  public Folio_MR_Fila_Materialess: Detalle_de_Materiales[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];

  public detalle_de_materialess: Detalle_de_Materiales;
  public aeronaves: Aeronave;
  public modeloss: Modelos;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_MR_Materiales",
      "Folio_MR_Fila_Materiales",
      "No__Solicitud",
      "Descripcion",
      "Cantidad",
      "Matricula",
      "Modelo",
      "No_Reporte",
      "Condicion_de_la_parte",
      "Razon_de_la_Solicitud",
      "Estatus",
      "Observaciones",
      "Estatus2",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_MR_Materiales_filtro",
      "Folio_MR_Fila_Materiales_filtro",
      "No__Solicitud_filtro",
      "Descripcion_filtro",
      "Cantidad_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "No_Reporte_filtro",
      "Condicion_de_la_parte_filtro",
      "Razon_de_la_Solicitud_filtro",
      "Estatus_filtro",
      "Observaciones_filtro",
      "Estatus2_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Folio_MR_Materiales: "",
      Folio_MR_Fila_Materiales: "",
      No__Solicitud: "",
      Descripcion: "",
      Cantidad: "",
      Matricula: "",
      Modelo: "",
      No_Reporte: "",
      Condicion_de_la_parte: "",
      Razon_de_la_Solicitud: "",
      Estatus: "",
      Observaciones: "",
      Estatus2: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Folio_MR_MaterialesFilter: "",
      Folio_MR_Materiales: "",
      Folio_MR_MaterialesMultiple: "",
      Folio_MR_Fila_MaterialesFilter: "",
      Folio_MR_Fila_Materiales: "",
      Folio_MR_Fila_MaterialesMultiple: "",
      fromNo__Solicitud: "",
      toNo__Solicitud: "",
      fromCantidad: "",
      toCantidad: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromNo_Reporte: "",
      toNo_Reporte: "",
      fromCondicion_de_la_parte: "",
      toCondicion_de_la_parte: "",

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
    private detalle_de_materialesService: Detalle_de_MaterialesService,
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Folio_MR_MaterialesFilter: [''],
      Folio_MR_Materiales: [''],
      Folio_MR_MaterialesMultiple: [''],
      Folio_MR_Fila_MaterialesFilter: [''],
      Folio_MR_Fila_Materiales: [''],
      Folio_MR_Fila_MaterialesMultiple: [''],
      fromNo__Solicitud: [''],
      toNo__Solicitud: [''],
      fromCantidad: [''],
      toCantidad: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      fromNo_Reporte: [''],
      toNo_Reporte: [''],
      fromCondicion_de_la_parte: [''],
      toCondicion_de_la_parte: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Comparativo_de_Proveedores_Materiales/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.detalle_de_materialesService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,detalle_de_materialess ,aeronaves ,modeloss ]) => {
		  this.detalle_de_materialess = detalle_de_materialess;
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
          

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
    this.dataListConfig.filterAdvanced.Folio_MR_MaterialesFilter = entity.Folio_MR_MaterialesFilter;
    this.dataListConfig.filterAdvanced.Folio_MR_Materiales = entity.Folio_MR_Materiales;
    this.dataListConfig.filterAdvanced.Folio_MR_MaterialesMultiple = entity.Folio_MR_MaterialesMultiple;
    this.dataListConfig.filterAdvanced.Folio_MR_Fila_MaterialesFilter = entity.Folio_MR_Fila_MaterialesFilter;
    this.dataListConfig.filterAdvanced.Folio_MR_Fila_Materiales = entity.Folio_MR_Fila_Materiales;
    this.dataListConfig.filterAdvanced.Folio_MR_Fila_MaterialesMultiple = entity.Folio_MR_Fila_MaterialesMultiple;
    this.dataListConfig.filterAdvanced.fromNo__Solicitud = entity.fromNo__Solicitud;
    this.dataListConfig.filterAdvanced.toNo__Solicitud = entity.toNo__Solicitud;
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
    this.dataListConfig.filterAdvanced.fromCantidad = entity.fromCantidad;
    this.dataListConfig.filterAdvanced.toCantidad = entity.toCantidad;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.fromNo_Reporte = entity.fromNo_Reporte;
    this.dataListConfig.filterAdvanced.toNo_Reporte = entity.toNo_Reporte;
    this.dataListConfig.filterAdvanced.fromCondicion_de_la_parte = entity.fromCondicion_de_la_parte;
    this.dataListConfig.filterAdvanced.toCondicion_de_la_parte = entity.toCondicion_de_la_parte;
	this.dataListConfig.filterAdvanced.Razon_de_la_SolicitudFilter = entity.Razon_de_la_SolicitudFilter;
	this.dataListConfig.filterAdvanced.Razon_de_la_Solicitud = entity.Razon_de_la_Solicitud;
	this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
	this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
	this.dataListConfig.filterAdvanced.ObservacionesFilter = entity.ObservacionesFilter;
	this.dataListConfig.filterAdvanced.Observaciones = entity.Observaciones;
	this.dataListConfig.filterAdvanced.Estatus2Filter = entity.Estatus2Filter;
	this.dataListConfig.filterAdvanced.Estatus2 = entity.Estatus2;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Comparativo_de_Proveedores_Materiales/list'], { state: { data: this.dataListConfig } });
  }
}
