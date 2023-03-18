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


@Component({
  selector: 'app-show-advance-filter-Tipo_de_Cambio',
  templateUrl: './show-advance-filter-Tipo_de_Cambio.component.html',
  styleUrls: ['./show-advance-filter-Tipo_de_Cambio.component.scss']
})
export class ShowAdvanceFilterTipo_de_CambioComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Usuario_que_Editas: Spartan_User[] = [];

  public spartan_users: Spartan_User;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Fecha",
      "T_C__USD",
      "T_C__EUR",
      "T_C__LIBRA",
      "T_C__CAD",
      "Fecha_de_Edicion",
      "Hora_de_Edicion",
      "Usuario_que_Edita",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Fecha_filtro",
      "T_C__USD_filtro",
      "T_C__EUR_filtro",
      "T_C__LIBRA_filtro",
      "T_C__CAD_filtro",
      "Fecha_de_Edicion_filtro",
      "Hora_de_Edicion_filtro",
      "Usuario_que_Edita_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      Fecha: null,
      T_C__USD: "",
      T_C__EUR: "",
      T_C__LIBRA: "",
      T_C__CAD: "",
      Fecha_de_Edicion: null,
      Hora_de_Edicion: "",
      Usuario_que_Edita: "",

    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      fromFecha: "",
      toFecha: "",
      fromT_C__USD: "",
      toT_C__USD: "",
      fromT_C__EUR: "",
      toT_C__EUR: "",
      fromT_C__LIBRA: "",
      toT_C__LIBRA: "",
      fromT_C__CAD: "",
      toT_C__CAD: "",
      fromFecha_de_Edicion: "",
      toFecha_de_Edicion: "",
      fromHora_de_Edicion: "",
      toHora_de_Edicion: "",
      Usuario_que_EditaFilter: "",
      Usuario_que_Edita: "",
      Usuario_que_EditaMultiple: "",

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

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromClave: [''],
      toClave: [''],
      fromFecha: [''],
      toFecha: [''],
      fromT_C__USD: [''],
      toT_C__USD: [''],
      fromT_C__EUR: [''],
      toT_C__EUR: [''],
      fromT_C__LIBRA: [''],
      toT_C__LIBRA: [''],
      fromT_C__CAD: [''],
      toT_C__CAD: [''],
      fromFecha_de_Edicion: [''],
      toFecha_de_Edicion: [''],
      fromHora_de_Edicion: [''],
      toHora_de_Edicion: [''],
      Usuario_que_EditaFilter: [''],
      Usuario_que_Edita: [''],
      Usuario_que_EditaMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Tipo_de_Cambio/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ]) => {
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
    this.dataListConfig.filterAdvanced.fromClave = entity.fromClave;
    this.dataListConfig.filterAdvanced.toClave = entity.toClave;
    this.dataListConfig.filterAdvanced.fromFecha = entity.fromFecha;
    this.dataListConfig.filterAdvanced.toFecha = entity.toFecha;
    this.dataListConfig.filterAdvanced.fromT_C__USD = entity.fromT_C__USD;
    this.dataListConfig.filterAdvanced.toT_C__USD = entity.toT_C__USD;
    this.dataListConfig.filterAdvanced.fromT_C__EUR = entity.fromT_C__EUR;
    this.dataListConfig.filterAdvanced.toT_C__EUR = entity.toT_C__EUR;
    this.dataListConfig.filterAdvanced.fromT_C__LIBRA = entity.fromT_C__LIBRA;
    this.dataListConfig.filterAdvanced.toT_C__LIBRA = entity.toT_C__LIBRA;
    this.dataListConfig.filterAdvanced.fromT_C__CAD = entity.fromT_C__CAD;
    this.dataListConfig.filterAdvanced.toT_C__CAD = entity.toT_C__CAD;
    this.dataListConfig.filterAdvanced.fromFecha_de_Edicion = entity.fromFecha_de_Edicion;
    this.dataListConfig.filterAdvanced.toFecha_de_Edicion = entity.toFecha_de_Edicion;
	this.dataListConfig.filterAdvanced.Hora_de_EdicionFilter = entity.Hora_de_EdicionFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Edicion = entity.Hora_de_Edicion;
    this.dataListConfig.filterAdvanced.Usuario_que_EditaFilter = entity.Usuario_que_EditaFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_Edita = entity.Usuario_que_Edita;
    this.dataListConfig.filterAdvanced.Usuario_que_EditaMultiple = entity.Usuario_que_EditaMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Tipo_de_Cambio/list'], { state: { data: this.dataListConfig } });
  }
}
