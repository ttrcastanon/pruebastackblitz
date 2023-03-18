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

import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Estatus_Reporte } from 'src/app/models/Estatus_Reporte';
import { Estatus_ReporteService } from 'src/app/api-services/Estatus_Reporte.service';


@Component({
  selector: 'app-show-advance-filter-Orden_de_servicio',
  templateUrl: './show-advance-filter-Orden_de_servicio.component.html',
  styleUrls: ['./show-advance-filter-Orden_de_servicio.component.scss']
})
export class ShowAdvanceFilterOrden_de_servicioComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Numero_de_OTs: Orden_de_Trabajo[] = [];
  public Modelos: Modelos[] = [];
  public Matriculas: Aeronave[] = [];
  public Propietarios: Propietarios[] = [];
  public Estatuss: Estatus_Reporte[] = [];

  public orden_de_trabajos: Orden_de_Trabajo;
  public modeloss: Modelos;
  public aeronaves: Aeronave;
  public propietarioss: Propietarios;
  public estatus_reportes: Estatus_Reporte;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_OS",
      "Numero_de_OT",
      "Modelo",
      "Matricula",
      "Propietario",
      "Fecha_de_apertura",
      "Fecha_de_cierre",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_OS_filtro",
      "Numero_de_OT_filtro",
      "Modelo_filtro",
      "Matricula_filtro",
      "Propietario_filtro",
      "Fecha_de_apertura_filtro",
      "Fecha_de_cierre_filtro",
      "Estatus_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Folio_OS: "",
      Numero_de_OT: "",
      Modelo: "",
      Matricula: "",
      Propietario: "",
      Fecha_de_apertura: null,
      Fecha_de_cierre: null,
      Estatus: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Numero_de_OTFilter: "",
      Numero_de_OT: "",
      Numero_de_OTMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      fromFecha_de_apertura: "",
      toFecha_de_apertura: "",
      fromFecha_de_cierre: "",
      toFecha_de_cierre: "",
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
    private orden_de_trabajoService: Orden_de_TrabajoService,
    private modelosService: ModelosService,
    private aeronaveService: AeronaveService,
    private propietariosService: PropietariosService,
    private estatus_reporteService: Estatus_ReporteService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Numero_de_OTFilter: [''],
      Numero_de_OT: [''],
      Numero_de_OTMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      PropietarioFilter: [''],
      Propietario: [''],
      PropietarioMultiple: [''],
      fromFecha_de_apertura: [''],
      toFecha_de_apertura: [''],
      fromFecha_de_cierre: [''],
      toFecha_de_cierre: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Orden_de_servicio/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.orden_de_trabajoService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.propietariosService.getAll());
    observablesArray.push(this.estatus_reporteService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,orden_de_trabajos ,modeloss ,aeronaves ,propietarioss ,estatus_reportes ]) => {
		  this.orden_de_trabajos = orden_de_trabajos;
		  this.modeloss = modeloss;
		  this.aeronaves = aeronaves;
		  this.propietarioss = propietarioss;
		  this.estatus_reportes = estatus_reportes;
          

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
	this.dataListConfig.filterAdvanced.Folio_OSFilter = entity.Folio_OSFilter;
	this.dataListConfig.filterAdvanced.Folio_OS = entity.Folio_OS;
    this.dataListConfig.filterAdvanced.Numero_de_OTFilter = entity.Numero_de_OTFilter;
    this.dataListConfig.filterAdvanced.Numero_de_OT = entity.Numero_de_OT;
    this.dataListConfig.filterAdvanced.Numero_de_OTMultiple = entity.Numero_de_OTMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.PropietarioFilter = entity.PropietarioFilter;
    this.dataListConfig.filterAdvanced.Propietario = entity.Propietario;
    this.dataListConfig.filterAdvanced.PropietarioMultiple = entity.PropietarioMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_apertura = entity.fromFecha_de_apertura;
    this.dataListConfig.filterAdvanced.toFecha_de_apertura = entity.toFecha_de_apertura;
    this.dataListConfig.filterAdvanced.fromFecha_de_cierre = entity.fromFecha_de_cierre;
    this.dataListConfig.filterAdvanced.toFecha_de_cierre = entity.toFecha_de_cierre;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Orden_de_servicio/list'], { state: { data: this.dataListConfig } });
  }
}
