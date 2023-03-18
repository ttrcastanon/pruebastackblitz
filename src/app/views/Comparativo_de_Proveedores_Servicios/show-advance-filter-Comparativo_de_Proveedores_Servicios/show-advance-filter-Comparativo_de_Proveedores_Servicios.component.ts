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

import { Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales } from 'src/app/models/Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales';
import { Detalle_de_Solicitud_de_Servicios_Herramientas_MaterialesService } from 'src/app/api-services/Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';


@Component({
  selector: 'app-show-advance-filter-Comparativo_de_Proveedores_Servicios',
  templateUrl: './show-advance-filter-Comparativo_de_Proveedores_Servicios.component.html',
  styleUrls: ['./show-advance-filter-Comparativo_de_Proveedores_Servicios.component.scss']
})
export class ShowAdvanceFilterComparativo_de_Proveedores_ServiciosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Folio_MR_Servicioss: Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales[] = [];
  public Folio_MR_Fila_Servicioss: Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public Solicitantes: Spartan_User[] = [];

  public detalle_de_solicitud_de_servicios_herramientas_materialess: Detalle_de_Solicitud_de_Servicios_Herramientas_Materiales;
  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public spartan_users: Spartan_User;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_MR_Servicios",
      "Folio_MR_Fila_Servicios",
      "No__de_Parte",
      "Descripcion",
      "Numero_de_Reporte",
      "Numero_de_O_T",
      "Matricula",
      "Modelo",
      "Fecha_Estimada_del_Mtto",
      "No__Solicitud",
      "Solicitante",
      "Fecha_de_Solicitud",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_MR_Servicios_filtro",
      "Folio_MR_Fila_Servicios_filtro",
      "No__de_Parte_filtro",
      "Descripcion_filtro",
      "Numero_de_Reporte_filtro",
      "Numero_de_O_T_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Fecha_Estimada_del_Mtto_filtro",
      "No__Solicitud_filtro",
      "Solicitante_filtro",
      "Fecha_de_Solicitud_filtro",
      "Estatus_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Folio_MR_Servicios: "",
      Folio_MR_Fila_Servicios: "",
      No__de_Parte: "",
      Descripcion: "",
      Numero_de_Reporte: "",
      Numero_de_O_T: "",
      Matricula: "",
      Modelo: "",
      Fecha_Estimada_del_Mtto: null,
      No__Solicitud: "",
      Solicitante: "",
      Fecha_de_Solicitud: null,
      Estatus: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Folio_MR_ServiciosFilter: "",
      Folio_MR_Servicios: "",
      Folio_MR_ServiciosMultiple: "",
      Folio_MR_Fila_ServiciosFilter: "",
      Folio_MR_Fila_Servicios: "",
      Folio_MR_Fila_ServiciosMultiple: "",
      fromNo__de_Parte: "",
      toNo__de_Parte: "",
      fromNumero_de_Reporte: "",
      toNumero_de_Reporte: "",
      fromNumero_de_O_T: "",
      toNumero_de_O_T: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromFecha_Estimada_del_Mtto: "",
      toFecha_Estimada_del_Mtto: "",
      fromNo__Solicitud: "",
      toNo__Solicitud: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      fromFecha_de_Solicitud: "",
      toFecha_de_Solicitud: "",

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
    private detalle_de_solicitud_de_servicios_herramientas_materialesService: Detalle_de_Solicitud_de_Servicios_Herramientas_MaterialesService,
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,
    private spartan_userService: Spartan_UserService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Folio_MR_ServiciosFilter: [''],
      Folio_MR_Servicios: [''],
      Folio_MR_ServiciosMultiple: [''],
      Folio_MR_Fila_ServiciosFilter: [''],
      Folio_MR_Fila_Servicios: [''],
      Folio_MR_Fila_ServiciosMultiple: [''],
      fromNo__de_Parte: [''],
      toNo__de_Parte: [''],
      fromNumero_de_Reporte: [''],
      toNumero_de_Reporte: [''],
      fromNumero_de_O_T: [''],
      toNumero_de_O_T: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      fromFecha_Estimada_del_Mtto: [''],
      toFecha_Estimada_del_Mtto: [''],
      fromNo__Solicitud: [''],
      toNo__Solicitud: [''],
      SolicitanteFilter: [''],
      Solicitante: [''],
      SolicitanteMultiple: [''],
      fromFecha_de_Solicitud: [''],
      toFecha_de_Solicitud: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Comparativo_de_Proveedores_Servicios/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.detalle_de_solicitud_de_servicios_herramientas_materialesService.getAll());
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.spartan_userService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,detalle_de_solicitud_de_servicios_herramientas_materialess ,aeronaves ,modeloss ,spartan_users ]) => {
		  this.detalle_de_solicitud_de_servicios_herramientas_materialess = detalle_de_solicitud_de_servicios_herramientas_materialess;
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.spartan_users = spartan_users;
          

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
    this.dataListConfig.filterAdvanced.Folio_MR_ServiciosFilter = entity.Folio_MR_ServiciosFilter;
    this.dataListConfig.filterAdvanced.Folio_MR_Servicios = entity.Folio_MR_Servicios;
    this.dataListConfig.filterAdvanced.Folio_MR_ServiciosMultiple = entity.Folio_MR_ServiciosMultiple;
    this.dataListConfig.filterAdvanced.Folio_MR_Fila_ServiciosFilter = entity.Folio_MR_Fila_ServiciosFilter;
    this.dataListConfig.filterAdvanced.Folio_MR_Fila_Servicios = entity.Folio_MR_Fila_Servicios;
    this.dataListConfig.filterAdvanced.Folio_MR_Fila_ServiciosMultiple = entity.Folio_MR_Fila_ServiciosMultiple;
    this.dataListConfig.filterAdvanced.fromNo__de_Parte = entity.fromNo__de_Parte;
    this.dataListConfig.filterAdvanced.toNo__de_Parte = entity.toNo__de_Parte;
	this.dataListConfig.filterAdvanced.DescripcionFilter = entity.DescripcionFilter;
	this.dataListConfig.filterAdvanced.Descripcion = entity.Descripcion;
    this.dataListConfig.filterAdvanced.fromNumero_de_Reporte = entity.fromNumero_de_Reporte;
    this.dataListConfig.filterAdvanced.toNumero_de_Reporte = entity.toNumero_de_Reporte;
    this.dataListConfig.filterAdvanced.fromNumero_de_O_T = entity.fromNumero_de_O_T;
    this.dataListConfig.filterAdvanced.toNumero_de_O_T = entity.toNumero_de_O_T;
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_Estimada_del_Mtto = entity.fromFecha_Estimada_del_Mtto;
    this.dataListConfig.filterAdvanced.toFecha_Estimada_del_Mtto = entity.toFecha_Estimada_del_Mtto;
    this.dataListConfig.filterAdvanced.fromNo__Solicitud = entity.fromNo__Solicitud;
    this.dataListConfig.filterAdvanced.toNo__Solicitud = entity.toNo__Solicitud;
    this.dataListConfig.filterAdvanced.SolicitanteFilter = entity.SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Solicitante = entity.Solicitante;
    this.dataListConfig.filterAdvanced.SolicitanteMultiple = entity.SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Solicitud = entity.fromFecha_de_Solicitud;
    this.dataListConfig.filterAdvanced.toFecha_de_Solicitud = entity.toFecha_de_Solicitud;
	this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
	this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Comparativo_de_Proveedores_Servicios/list'], { state: { data: this.dataListConfig } });
  }
}
