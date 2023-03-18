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

import { Tipos_de_Origen_del_Componente } from 'src/app/models/Tipos_de_Origen_del_Componente';
import { Tipos_de_Origen_del_ComponenteService } from 'src/app/api-services/Tipos_de_Origen_del_Componente.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Catalogo_Tipo_de_Vencimiento } from 'src/app/models/Catalogo_Tipo_de_Vencimiento';
import { Catalogo_Tipo_de_VencimientoService } from 'src/app/api-services/Catalogo_Tipo_de_Vencimiento.service';


@Component({
  selector: 'app-show-advance-filter-Historial_de_Instalacion_de_partes',
  templateUrl: './show-advance-filter-Historial_de_Instalacion_de_partes.component.html',
  styleUrls: ['./show-advance-filter-Historial_de_Instalacion_de_partes.component.scss']
})
export class ShowAdvanceFilterHistorial_de_Instalacion_de_partesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Estatuss: Tipos_de_Origen_del_Componente[] = [];
  public Usuario_que_realiza_la_instalacions: Spartan_User[] = [];
  public Tipo_de_vencimientos: Catalogo_Tipo_de_Vencimiento[] = [];

  public tipos_de_origen_del_componentes: Tipos_de_Origen_del_Componente;
  public spartan_users: Spartan_User;
  public catalogo_tipo_de_vencimientos: Catalogo_Tipo_de_Vencimiento;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Descripcion",
      "N_de_parte",
      "N_de_serie",
      "Modelo",
      "Posicion",
      "Estatus",
      "Horas_acumuladas_parte",
      "Ciclos_acumulados_parte",
      "Fecha_de_Fabricacion",
      "Fecha_de_Instalacion",
      "Fecha_Reparacion",
      "Usuario_que_realiza_la_instalacion",
      "Meses_acumulados_parte",
      "Tipo_de_vencimiento",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Descripcion_filtro",
      "N_de_parte_filtro",
      "N_de_serie_filtro",
      "Modelo_filtro",
      "Posicion_filtro",
      "Estatus_filtro",
      "Horas_acumuladas_parte_filtro",
      "Ciclos_acumulados_parte_filtro",
      "Fecha_de_Fabricacion_filtro",
      "Fecha_de_Instalacion_filtro",
      "Fecha_Reparacion_filtro",
      "Usuario_que_realiza_la_instalacion_filtro",
      "Meses_acumulados_parte_filtro",
      "Tipo_de_vencimiento_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Descripcion: "",
      N_de_parte: "",
      N_de_serie: "",
      Modelo: "",
      Posicion: "",
      Estatus: "",
      Horas_acumuladas_parte: "",
      Ciclos_acumulados_parte: "",
      Fecha_de_Fabricacion: null,
      Fecha_de_Instalacion: null,
      Fecha_Reparacion: null,
      Usuario_que_realiza_la_instalacion: "",
      Meses_acumulados_parte: "",
      Tipo_de_vencimiento: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromHoras_acumuladas_parte: "",
      toHoras_acumuladas_parte: "",
      fromCiclos_acumulados_parte: "",
      toCiclos_acumulados_parte: "",
      fromFecha_de_Fabricacion: "",
      toFecha_de_Fabricacion: "",
      fromFecha_de_Instalacion: "",
      toFecha_de_Instalacion: "",
      fromFecha_Reparacion: "",
      toFecha_Reparacion: "",
      Usuario_que_realiza_la_instalacionFilter: "",
      Usuario_que_realiza_la_instalacion: "",
      Usuario_que_realiza_la_instalacionMultiple: "",
      fromMeses_acumulados_parte: "",
      toMeses_acumulados_parte: "",
      Tipo_de_vencimientoFilter: "",
      Tipo_de_vencimiento: "",
      Tipo_de_vencimientoMultiple: "",

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
    private tipos_de_origen_del_componenteService: Tipos_de_Origen_del_ComponenteService,
    private spartan_userService: Spartan_UserService,
    private catalogo_tipo_de_vencimientoService: Catalogo_Tipo_de_VencimientoService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromHoras_acumuladas_parte: [''],
      toHoras_acumuladas_parte: [''],
      fromCiclos_acumulados_parte: [''],
      toCiclos_acumulados_parte: [''],
      fromFecha_de_Fabricacion: [''],
      toFecha_de_Fabricacion: [''],
      fromFecha_de_Instalacion: [''],
      toFecha_de_Instalacion: [''],
      fromFecha_Reparacion: [''],
      toFecha_Reparacion: [''],
      Usuario_que_realiza_la_instalacionFilter: [''],
      Usuario_que_realiza_la_instalacion: [''],
      Usuario_que_realiza_la_instalacionMultiple: [''],
      fromMeses_acumulados_parte: [''],
      toMeses_acumulados_parte: [''],
      Tipo_de_vencimientoFilter: [''],
      Tipo_de_vencimiento: [''],
      Tipo_de_vencimientoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Historial_de_Instalacion_de_partes/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipos_de_origen_del_componenteService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.catalogo_tipo_de_vencimientoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipos_de_origen_del_componentes ,spartan_users ,catalogo_tipo_de_vencimientos ]) => {
		  this.tipos_de_origen_del_componentes = tipos_de_origen_del_componentes;
		  this.spartan_users = spartan_users;
		  this.catalogo_tipo_de_vencimientos = catalogo_tipo_de_vencimientos;
          

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
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
	this.dataListConfig.filterAdvanced.N_de_parteFilter = entity.N_de_parteFilter;
	this.dataListConfig.filterAdvanced.N_de_parte = entity.N_de_parte;
	this.dataListConfig.filterAdvanced.N_de_serieFilter = entity.N_de_serieFilter;
	this.dataListConfig.filterAdvanced.N_de_serie = entity.N_de_serie;
	this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
	this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
	this.dataListConfig.filterAdvanced.PosicionFilter = entity.PosicionFilter;
	this.dataListConfig.filterAdvanced.Posicion = entity.Posicion;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.fromHoras_acumuladas_parte = entity.fromHoras_acumuladas_parte;
    this.dataListConfig.filterAdvanced.toHoras_acumuladas_parte = entity.toHoras_acumuladas_parte;
    this.dataListConfig.filterAdvanced.fromCiclos_acumulados_parte = entity.fromCiclos_acumulados_parte;
    this.dataListConfig.filterAdvanced.toCiclos_acumulados_parte = entity.toCiclos_acumulados_parte;
    this.dataListConfig.filterAdvanced.fromFecha_de_Fabricacion = entity.fromFecha_de_Fabricacion;
    this.dataListConfig.filterAdvanced.toFecha_de_Fabricacion = entity.toFecha_de_Fabricacion;
    this.dataListConfig.filterAdvanced.fromFecha_de_Instalacion = entity.fromFecha_de_Instalacion;
    this.dataListConfig.filterAdvanced.toFecha_de_Instalacion = entity.toFecha_de_Instalacion;
    this.dataListConfig.filterAdvanced.fromFecha_Reparacion = entity.fromFecha_Reparacion;
    this.dataListConfig.filterAdvanced.toFecha_Reparacion = entity.toFecha_Reparacion;
    this.dataListConfig.filterAdvanced.Usuario_que_realiza_la_instalacionFilter = entity.Usuario_que_realiza_la_instalacionFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_realiza_la_instalacion = entity.Usuario_que_realiza_la_instalacion;
    this.dataListConfig.filterAdvanced.Usuario_que_realiza_la_instalacionMultiple = entity.Usuario_que_realiza_la_instalacionMultiple;
    this.dataListConfig.filterAdvanced.fromMeses_acumulados_parte = entity.fromMeses_acumulados_parte;
    this.dataListConfig.filterAdvanced.toMeses_acumulados_parte = entity.toMeses_acumulados_parte;
    this.dataListConfig.filterAdvanced.Tipo_de_vencimientoFilter = entity.Tipo_de_vencimientoFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_vencimiento = entity.Tipo_de_vencimiento;
    this.dataListConfig.filterAdvanced.Tipo_de_vencimientoMultiple = entity.Tipo_de_vencimientoMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Historial_de_Instalacion_de_partes/list'], { state: { data: this.dataListConfig } });
  }
}
