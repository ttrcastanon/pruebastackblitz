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

import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Tipo_de_vuelo } from 'src/app/models/Tipo_de_vuelo';
import { Tipo_de_vueloService } from 'src/app/api-services/Tipo_de_vuelo.service';
import { Concepto_de_Gasto_de_Empleado } from 'src/app/models/Concepto_de_Gasto_de_Empleado';
import { Concepto_de_Gasto_de_EmpleadoService } from 'src/app/api-services/Concepto_de_Gasto_de_Empleado.service';


@Component({
  selector: 'app-show-advance-filter-Configuracion_de_Politicas_de_Viaticos',
  templateUrl: './show-advance-filter-Configuracion_de_Politicas_de_Viaticos.component.html',
  styleUrls: ['./show-advance-filter-Configuracion_de_Politicas_de_Viaticos.component.scss']
})
export class ShowAdvanceFilterConfiguracion_de_Politicas_de_ViaticosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Usuario_que_Modificas: Spartan_User[] = [];
  public Tipo_de_vuelos: Tipo_de_vuelo[] = [];
  public Conceptos: Concepto_de_Gasto_de_Empleado[] = [];

  public spartan_users: Spartan_User;
  public tipo_de_vuelos: Tipo_de_vuelo;
  public concepto_de_gasto_de_empleados: Concepto_de_Gasto_de_Empleado;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Ultima_Modificacion",
      "Hora_de_Ultima_Modificacion",
      "Usuario_que_Modifica",
      "Tipo_de_vuelo",
      "Concepto",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Ultima_Modificacion_filtro",
      "Hora_de_Ultima_Modificacion_filtro",
      "Usuario_que_Modifica_filtro",
      "Tipo_de_vuelo_filtro",
      "Concepto_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha_de_Ultima_Modificacion: null,
      Hora_de_Ultima_Modificacion: "",
      Usuario_que_Modifica: "",
      Tipo_de_vuelo: "",
      Concepto: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Ultima_Modificacion: "",
      toFecha_de_Ultima_Modificacion: "",
      fromHora_de_Ultima_Modificacion: "",
      toHora_de_Ultima_Modificacion: "",
      Usuario_que_ModificaFilter: "",
      Usuario_que_Modifica: "",
      Usuario_que_ModificaMultiple: "",
      Tipo_de_vueloFilter: "",
      Tipo_de_vuelo: "",
      Tipo_de_vueloMultiple: "",
      ConceptoFilter: "",
      Concepto: "",
      ConceptoMultiple: "",

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
    private spartan_userService: Spartan_UserService,
    private tipo_de_vueloService: Tipo_de_vueloService,
    private concepto_de_gasto_de_empleadoService: Concepto_de_Gasto_de_EmpleadoService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFecha_de_Ultima_Modificacion: [''],
      toFecha_de_Ultima_Modificacion: [''],
      fromHora_de_Ultima_Modificacion: [''],
      toHora_de_Ultima_Modificacion: [''],
      Usuario_que_ModificaFilter: [''],
      Usuario_que_Modifica: [''],
      Usuario_que_ModificaMultiple: [''],
      Tipo_de_vueloFilter: [''],
      Tipo_de_vuelo: [''],
      Tipo_de_vueloMultiple: [''],
      ConceptoFilter: [''],
      Concepto: [''],
      ConceptoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Configuracion_de_Politicas_de_Viaticos/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.tipo_de_vueloService.getAll());
    observablesArray.push(this.concepto_de_gasto_de_empleadoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,tipo_de_vuelos ,concepto_de_gasto_de_empleados ]) => {
		  this.spartan_users = spartan_users;
		  this.tipo_de_vuelos = tipo_de_vuelos;
		  this.concepto_de_gasto_de_empleados = concepto_de_gasto_de_empleados;
          

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
    this.dataListConfig.filterAdvanced.fromFecha_de_Ultima_Modificacion = entity.fromFecha_de_Ultima_Modificacion;
    this.dataListConfig.filterAdvanced.toFecha_de_Ultima_Modificacion = entity.toFecha_de_Ultima_Modificacion;
	this.dataListConfig.filterAdvanced.Hora_de_Ultima_ModificacionFilter = entity.Hora_de_Ultima_ModificacionFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Ultima_Modificacion = entity.Hora_de_Ultima_Modificacion;
    this.dataListConfig.filterAdvanced.Usuario_que_ModificaFilter = entity.Usuario_que_ModificaFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_Modifica = entity.Usuario_que_Modifica;
    this.dataListConfig.filterAdvanced.Usuario_que_ModificaMultiple = entity.Usuario_que_ModificaMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_vueloFilter = entity.Tipo_de_vueloFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_vuelo = entity.Tipo_de_vuelo;
    this.dataListConfig.filterAdvanced.Tipo_de_vueloMultiple = entity.Tipo_de_vueloMultiple;
    this.dataListConfig.filterAdvanced.ConceptoFilter = entity.ConceptoFilter;
    this.dataListConfig.filterAdvanced.Concepto = entity.Concepto;
    this.dataListConfig.filterAdvanced.ConceptoMultiple = entity.ConceptoMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Configuracion_de_Politicas_de_Viaticos/list'], { state: { data: this.dataListConfig } });
  }
}
