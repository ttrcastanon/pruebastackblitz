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

import { Creacion_de_Usuarios } from 'src/app/models/Creacion_de_Usuarios';
import { Creacion_de_UsuariosService } from 'src/app/api-services/Creacion_de_Usuarios.service';
import { Cargos } from 'src/app/models/Cargos';
import { CargosService } from 'src/app/api-services/Cargos.service';
import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';


@Component({
  selector: 'app-show-advance-filter-Actividades_de_los_Colaboradores',
  templateUrl: './show-advance-filter-Actividades_de_los_Colaboradores.component.html',
  styleUrls: ['./show-advance-filter-Actividades_de_los_Colaboradores.component.scss']
})
export class ShowAdvanceFilterActividades_de_los_ColaboradoresComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Colaboradors: Creacion_de_Usuarios[] = [];
  public Puestos: Cargos[] = [];
  public Empresas: Cliente[] = [];

  public creacion_de_usuarioss: Creacion_de_Usuarios;
  public cargoss: Cargos;
  public clientes: Cliente;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Colaborador",
      "Puesto",
      "Empresa",
      "Inicio_Horario_Laboral",
      "Fin_Horario_Laboral",
      "Fecha_de_Reporte",
      "Horas_Registradas",
      "Horas_Faltantes",
      "Horas_Extras",
      "Dia_Inhabil",
      "No_Actividad",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Colaborador_filtro",
      "Puesto_filtro",
      "Empresa_filtro",
      "Inicio_Horario_Laboral_filtro",
      "Fin_Horario_Laboral_filtro",
      "Fecha_de_Reporte_filtro",
      "Horas_Registradas_filtro",
      "Horas_Faltantes_filtro",
      "Horas_Extras_filtro",
      "Dia_Inhabil_filtro",
      "No_Actividad_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Colaborador: "",
      Puesto: "",
      Empresa: "",
      Inicio_Horario_Laboral: "",
      Fin_Horario_Laboral: "",
      Fecha_de_Reporte: null,
      Horas_Registradas: "",
      Horas_Faltantes: "",
      Horas_Extras: "",
      Dia_Inhabil: "",
      No_Actividad: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ColaboradorFilter: "",
      Colaborador: "",
      ColaboradorMultiple: "",
      PuestoFilter: "",
      Puesto: "",
      PuestoMultiple: "",
      EmpresaFilter: "",
      Empresa: "",
      EmpresaMultiple: "",
      fromInicio_Horario_Laboral: "",
      toInicio_Horario_Laboral: "",
      fromFin_Horario_Laboral: "",
      toFin_Horario_Laboral: "",
      fromFecha_de_Reporte: "",
      toFecha_de_Reporte: "",
      fromHoras_Registradas: "",
      toHoras_Registradas: "",
      fromHoras_Faltantes: "",
      toHoras_Faltantes: "",
      fromHoras_Extras: "",
      toHoras_Extras: "",

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
    private creacion_de_usuariosService: Creacion_de_UsuariosService,
    private cargosService: CargosService,
    private clienteService: ClienteService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      ColaboradorFilter: [''],
      Colaborador: [''],
      ColaboradorMultiple: [''],
      PuestoFilter: [''],
      Puesto: [''],
      PuestoMultiple: [''],
      EmpresaFilter: [''],
      Empresa: [''],
      EmpresaMultiple: [''],
      fromInicio_Horario_Laboral: [''],
      toInicio_Horario_Laboral: [''],
      fromFin_Horario_Laboral: [''],
      toFin_Horario_Laboral: [''],
      fromFecha_de_Reporte: [''],
      toFecha_de_Reporte: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Actividades_de_los_Colaboradores/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.creacion_de_usuariosService.getAll());
    observablesArray.push(this.cargosService.getAll());
    observablesArray.push(this.clienteService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,creacion_de_usuarioss ,cargoss ,clientes ]) => {
		  this.creacion_de_usuarioss = creacion_de_usuarioss;
		  this.cargoss = cargoss;
		  this.clientes = clientes;
          

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
    this.dataListConfig.filterAdvanced.ColaboradorFilter = entity.ColaboradorFilter;
    this.dataListConfig.filterAdvanced.Colaborador = entity.Colaborador;
    this.dataListConfig.filterAdvanced.ColaboradorMultiple = entity.ColaboradorMultiple;
    this.dataListConfig.filterAdvanced.PuestoFilter = entity.PuestoFilter;
    this.dataListConfig.filterAdvanced.Puesto = entity.Puesto;
    this.dataListConfig.filterAdvanced.PuestoMultiple = entity.PuestoMultiple;
    this.dataListConfig.filterAdvanced.EmpresaFilter = entity.EmpresaFilter;
    this.dataListConfig.filterAdvanced.Empresa = entity.Empresa;
    this.dataListConfig.filterAdvanced.EmpresaMultiple = entity.EmpresaMultiple;
	this.dataListConfig.filterAdvanced.Inicio_Horario_LaboralFilter = entity.Inicio_Horario_LaboralFilter;
	this.dataListConfig.filterAdvanced.Inicio_Horario_Laboral = entity.Inicio_Horario_Laboral;
	this.dataListConfig.filterAdvanced.Fin_Horario_LaboralFilter = entity.Fin_Horario_LaboralFilter;
	this.dataListConfig.filterAdvanced.Fin_Horario_Laboral = entity.Fin_Horario_Laboral;
    this.dataListConfig.filterAdvanced.fromFecha_de_Reporte = entity.fromFecha_de_Reporte;
    this.dataListConfig.filterAdvanced.toFecha_de_Reporte = entity.toFecha_de_Reporte;
    this.dataListConfig.filterAdvanced.fromHoras_Registradas = entity.fromHoras_Registradas;
    this.dataListConfig.filterAdvanced.toHoras_Registradas = entity.toHoras_Registradas;
    this.dataListConfig.filterAdvanced.fromHoras_Faltantes = entity.fromHoras_Faltantes;
    this.dataListConfig.filterAdvanced.toHoras_Faltantes = entity.toHoras_Faltantes;
    this.dataListConfig.filterAdvanced.fromHoras_Extras = entity.fromHoras_Extras;
    this.dataListConfig.filterAdvanced.toHoras_Extras = entity.toHoras_Extras;
	this.dataListConfig.filterAdvanced.No_ActividadFilter = entity.No_ActividadFilter;
	this.dataListConfig.filterAdvanced.No_Actividad = entity.No_Actividad;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Actividades_de_los_Colaboradores/list'], { state: { data: this.dataListConfig } });
  }
}
