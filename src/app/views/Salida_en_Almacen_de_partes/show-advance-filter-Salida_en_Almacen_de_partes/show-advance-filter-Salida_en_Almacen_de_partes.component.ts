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

import { Estatus_de_Requerido } from 'src/app/models/Estatus_de_Requerido';
import { Estatus_de_RequeridoService } from 'src/app/api-services/Estatus_de_Requerido.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';


@Component({
  selector: 'app-show-advance-filter-Salida_en_Almacen_de_partes',
  templateUrl: './show-advance-filter-Salida_en_Almacen_de_partes.component.html',
  styleUrls: ['./show-advance-filter-Salida_en_Almacen_de_partes.component.scss']
})
export class ShowAdvanceFilterSalida_en_Almacen_de_partesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Se_mantiene_el_No__de_Partes: Estatus_de_Requerido[] = [];
  public Solicitantes: Spartan_User[] = [];
  public No__de_OTs: Orden_de_Trabajo[] = [];
  public No__de_Reportes: Crear_Reporte[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];

  public estatus_de_requeridos: Estatus_de_Requerido;
  public spartan_users: Spartan_User;
  public orden_de_trabajos: Orden_de_Trabajo;
  public crear_reportes: Crear_Reporte;
  public aeronaves: Aeronave;
  public modeloss: Modelos;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_Parte___Descripcion",
      "Se_mantiene_el_No__de_Parte",
      "No__de_parte_nuevo",
      "No__de_serie",
      "No__de_lote",
      "Hora_acumuladas",
      "Ciclos_acumulados",
      "Fecha_de_Vencimiento",
      "Ubicacion",
      "Solicitante",
      "No__de_OT",
      "No__de_Reporte",
      "Matricula",
      "Modelo",
      "IdAsignacionPartes",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_Parte___Descripcion_filtro",
      "Se_mantiene_el_No__de_Parte_filtro",
      "No__de_parte_nuevo_filtro",
      "No__de_serie_filtro",
      "No__de_lote_filtro",
      "Hora_acumuladas_filtro",
      "Ciclos_acumulados_filtro",
      "Fecha_de_Vencimiento_filtro",
      "Ubicacion_filtro",
      "Solicitante_filtro",
      "No__de_OT_filtro",
      "No__de_Reporte_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "IdAsignacionPartes_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No__de_Parte___Descripcion: "",
      Se_mantiene_el_No__de_Parte: "",
      No__de_parte_nuevo: "",
      No__de_serie: "",
      No__de_lote: "",
      Hora_acumuladas: "",
      Ciclos_acumulados: "",
      Fecha_de_Vencimiento: null,
      Ubicacion: "",
      Solicitante: "",
      No__de_OT: "",
      No__de_Reporte: "",
      Matricula: "",
      Modelo: "",
      IdAsignacionPartes: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Se_mantiene_el_No__de_ParteFilter: "",
      Se_mantiene_el_No__de_Parte: "",
      Se_mantiene_el_No__de_ParteMultiple: "",
      fromHora_acumuladas: "",
      toHora_acumuladas: "",
      fromCiclos_acumulados: "",
      toCiclos_acumulados: "",
      fromFecha_de_Vencimiento: "",
      toFecha_de_Vencimiento: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      No__de_OTFilter: "",
      No__de_OT: "",
      No__de_OTMultiple: "",
      No__de_ReporteFilter: "",
      No__de_Reporte: "",
      No__de_ReporteMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",

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
    private estatus_de_requeridoService: Estatus_de_RequeridoService,
    private spartan_userService: Spartan_UserService,
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private crear_reporteService: Crear_ReporteService,
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Se_mantiene_el_No__de_ParteFilter: [''],
      Se_mantiene_el_No__de_Parte: [''],
      Se_mantiene_el_No__de_ParteMultiple: [''],
      fromCiclos_acumulados: [''],
      toCiclos_acumulados: [''],
      fromFecha_de_Vencimiento: [''],
      toFecha_de_Vencimiento: [''],
      SolicitanteFilter: [''],
      Solicitante: [''],
      SolicitanteMultiple: [''],
      No__de_OTFilter: [''],
      No__de_OT: [''],
      No__de_OTMultiple: [''],
      No__de_ReporteFilter: [''],
      No__de_Reporte: [''],
      No__de_ReporteMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Salida_en_Almacen_de_partes/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.estatus_de_requeridoService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.crear_reporteService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,estatus_de_requeridos ,spartan_users ,orden_de_trabajos ,crear_reportes ,aeronaves ,modeloss ]) => {
		  this.estatus_de_requeridos = estatus_de_requeridos;
		  this.spartan_users = spartan_users;
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.crear_reportes = crear_reportes;
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
	this.dataListConfig.filterAdvanced.No__de_Parte___DescripcionFilter = entity.No__de_Parte___DescripcionFilter;
	this.dataListConfig.filterAdvanced.No__de_Parte___Descripcion = entity.No__de_Parte___Descripcion;
    this.dataListConfig.filterAdvanced.Se_mantiene_el_No__de_ParteFilter = entity.Se_mantiene_el_No__de_ParteFilter;
    this.dataListConfig.filterAdvanced.Se_mantiene_el_No__de_Parte = entity.Se_mantiene_el_No__de_Parte;
    this.dataListConfig.filterAdvanced.Se_mantiene_el_No__de_ParteMultiple = entity.Se_mantiene_el_No__de_ParteMultiple;
	this.dataListConfig.filterAdvanced.No__de_parte_nuevoFilter = entity.No__de_parte_nuevoFilter;
	this.dataListConfig.filterAdvanced.No__de_parte_nuevo = entity.No__de_parte_nuevo;
	this.dataListConfig.filterAdvanced.No__de_serieFilter = entity.No__de_serieFilter;
	this.dataListConfig.filterAdvanced.No__de_serie = entity.No__de_serie;
	this.dataListConfig.filterAdvanced.No__de_loteFilter = entity.No__de_loteFilter;
	this.dataListConfig.filterAdvanced.No__de_lote = entity.No__de_lote;
    this.dataListConfig.filterAdvanced.fromHora_acumuladas = entity.fromHora_acumuladas;
    this.dataListConfig.filterAdvanced.toHora_acumuladas = entity.toHora_acumuladas;
    this.dataListConfig.filterAdvanced.fromCiclos_acumulados = entity.fromCiclos_acumulados;
    this.dataListConfig.filterAdvanced.toCiclos_acumulados = entity.toCiclos_acumulados;
    this.dataListConfig.filterAdvanced.fromFecha_de_Vencimiento = entity.fromFecha_de_Vencimiento;
    this.dataListConfig.filterAdvanced.toFecha_de_Vencimiento = entity.toFecha_de_Vencimiento;
	this.dataListConfig.filterAdvanced.UbicacionFilter = entity.UbicacionFilter;
	this.dataListConfig.filterAdvanced.Ubicacion = entity.Ubicacion;
    this.dataListConfig.filterAdvanced.SolicitanteFilter = entity.SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Solicitante = entity.Solicitante;
    this.dataListConfig.filterAdvanced.SolicitanteMultiple = entity.SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.No__de_OTFilter = entity.No__de_OTFilter;
    this.dataListConfig.filterAdvanced.No__de_OT = entity.No__de_OT;
    this.dataListConfig.filterAdvanced.No__de_OTMultiple = entity.No__de_OTMultiple;
    this.dataListConfig.filterAdvanced.No__de_ReporteFilter = entity.No__de_ReporteFilter;
    this.dataListConfig.filterAdvanced.No__de_Reporte = entity.No__de_Reporte;
    this.dataListConfig.filterAdvanced.No__de_ReporteMultiple = entity.No__de_ReporteMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
	this.dataListConfig.filterAdvanced.IdAsignacionPartesFilter = entity.IdAsignacionPartesFilter;
	this.dataListConfig.filterAdvanced.IdAsignacionPartes = entity.IdAsignacionPartes;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Salida_en_Almacen_de_partes/list'], { state: { data: this.dataListConfig } });
  }
}
