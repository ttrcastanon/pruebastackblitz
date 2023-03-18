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

import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';


@Component({
  selector: 'app-show-advance-filter-Notificaciones_de_mantenimiento',
  templateUrl: './show-advance-filter-Notificaciones_de_mantenimiento.component.html',
  styleUrls: ['./show-advance-filter-Notificaciones_de_mantenimiento.component.scss']
})
export class ShowAdvanceFilterNotificaciones_de_mantenimientoComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Codigo_computarizados: Codigo_Computarizado[] = [];
  public Modelos: Modelos[] = [];
  public Propietarios: Propietarios[] = [];
  public Matriculas: Aeronave[] = [];

  public codigo_computarizados: Codigo_Computarizado;
  public modeloss: Modelos;
  public propietarioss: Propietarios;
  public aeronaves: Aeronave;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Codigo_computarizado",
      "Modelo",
      "Propietario",
      "Matricula",
      "ATA",
      "No__Bitacora",
      "Fecha_de_mantenimiento",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_computarizado_filtro",
      "Modelo_filtro",
      "Propietario_filtro",
      "Matricula_filtro",
      "ATA_filtro",
      "No__Bitacora_filtro",
      "Fecha_de_mantenimiento_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Codigo_computarizado: "",
      Modelo: "",
      Propietario: "",
      Matricula: "",
      ATA: "",
      No__Bitacora: "",
      Fecha_de_mantenimiento: null,

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Codigo_computarizadoFilter: "",
      Codigo_computarizado: "",
      Codigo_computarizadoMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromNo__Bitacora: "",
      toNo__Bitacora: "",
      fromFecha_de_mantenimiento: "",
      toFecha_de_mantenimiento: "",

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
    private codigo_computarizadoService: Codigo_ComputarizadoService,
    private modelosService: ModelosService,
    private propietariosService: PropietariosService,
    private aeronaveService: AeronaveService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Codigo_computarizadoFilter: [''],
      Codigo_computarizado: [''],
      Codigo_computarizadoMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      PropietarioFilter: [''],
      Propietario: [''],
      PropietarioMultiple: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      fromNo__Bitacora: [''],
      toNo__Bitacora: [''],
      fromFecha_de_mantenimiento: [''],
      toFecha_de_mantenimiento: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Notificaciones_de_mantenimiento/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.codigo_computarizadoService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.propietariosService.getAll());
    observablesArray.push(this.aeronaveService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,codigo_computarizados ,modeloss ,propietarioss ,aeronaves ]) => {
		  this.codigo_computarizados = codigo_computarizados;
		  this.modeloss = modeloss;
		  this.propietarioss = propietarioss;
		  this.aeronaves = aeronaves;
          

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
    this.dataListConfig.filterAdvanced.Codigo_computarizadoFilter = entity.Codigo_computarizadoFilter;
    this.dataListConfig.filterAdvanced.Codigo_computarizado = entity.Codigo_computarizado;
    this.dataListConfig.filterAdvanced.Codigo_computarizadoMultiple = entity.Codigo_computarizadoMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.PropietarioFilter = entity.PropietarioFilter;
    this.dataListConfig.filterAdvanced.Propietario = entity.Propietario;
    this.dataListConfig.filterAdvanced.PropietarioMultiple = entity.PropietarioMultiple;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
	this.dataListConfig.filterAdvanced.ATAFilter = entity.ATAFilter;
	this.dataListConfig.filterAdvanced.ATA = entity.ATA;
    this.dataListConfig.filterAdvanced.fromNo__Bitacora = entity.fromNo__Bitacora;
    this.dataListConfig.filterAdvanced.toNo__Bitacora = entity.toNo__Bitacora;
    this.dataListConfig.filterAdvanced.fromFecha_de_mantenimiento = entity.fromFecha_de_mantenimiento;
    this.dataListConfig.filterAdvanced.toFecha_de_mantenimiento = entity.toFecha_de_mantenimiento;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Notificaciones_de_mantenimiento/list'], { state: { data: this.dataListConfig } });
  }
}
