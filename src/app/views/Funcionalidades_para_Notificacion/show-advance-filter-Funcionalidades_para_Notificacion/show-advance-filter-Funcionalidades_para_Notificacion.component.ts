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

import { Estatus_de_Funcionalidad_para_Notificacion } from 'src/app/models/Estatus_de_Funcionalidad_para_Notificacion';
import { Estatus_de_Funcionalidad_para_NotificacionService } from 'src/app/api-services/Estatus_de_Funcionalidad_para_Notificacion.service';


@Component({
  selector: 'app-show-advance-filter-Funcionalidades_para_Notificacion',
  templateUrl: './show-advance-filter-Funcionalidades_para_Notificacion.component.html',
  styleUrls: ['./show-advance-filter-Funcionalidades_para_Notificacion.component.scss']
})
export class ShowAdvanceFilterFuncionalidades_para_NotificacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Campos_de_Estatuss: Estatus_de_Funcionalidad_para_Notificacion[] = [];

  public estatus_de_funcionalidad_para_notificacions: Estatus_de_Funcionalidad_para_Notificacion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Funcionalidad",
      "Nombre_de_la_Tabla",
      "Campos_de_Estatus",
      "Validacion_Obligatoria",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Funcionalidad_filtro",
      "Nombre_de_la_Tabla_filtro",
      "Campos_de_Estatus_filtro",
      "Validacion_Obligatoria_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Funcionalidad: "",
      Nombre_de_la_Tabla: "",
      Campos_de_Estatus: "",
      Validacion_Obligatoria: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Campos_de_EstatusFilter: "",
      Campos_de_Estatus: "",
      Campos_de_EstatusMultiple: "",

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
    private estatus_de_funcionalidad_para_notificacionService: Estatus_de_Funcionalidad_para_NotificacionService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Campos_de_EstatusFilter: [''],
      Campos_de_Estatus: [''],
      Campos_de_EstatusMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Funcionalidades_para_Notificacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.estatus_de_funcionalidad_para_notificacionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,estatus_de_funcionalidad_para_notificacions ]) => {
		  this.estatus_de_funcionalidad_para_notificacions = estatus_de_funcionalidad_para_notificacions;
          

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
	this.dataListConfig.filterAdvanced.FuncionalidadFilter = entity.FuncionalidadFilter;
	this.dataListConfig.filterAdvanced.Funcionalidad = entity.Funcionalidad;
	this.dataListConfig.filterAdvanced.Nombre_de_la_TablaFilter = entity.Nombre_de_la_TablaFilter;
	this.dataListConfig.filterAdvanced.Nombre_de_la_Tabla = entity.Nombre_de_la_Tabla;
    this.dataListConfig.filterAdvanced.Campos_de_EstatusFilter = entity.Campos_de_EstatusFilter;
    this.dataListConfig.filterAdvanced.Campos_de_Estatus = entity.Campos_de_Estatus;
    this.dataListConfig.filterAdvanced.Campos_de_EstatusMultiple = entity.Campos_de_EstatusMultiple;
	this.dataListConfig.filterAdvanced.Validacion_ObligatoriaFilter = entity.Validacion_ObligatoriaFilter;
	this.dataListConfig.filterAdvanced.Validacion_Obligatoria = entity.Validacion_Obligatoria;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Funcionalidades_para_Notificacion/list'], { state: { data: this.dataListConfig } });
  }
}
