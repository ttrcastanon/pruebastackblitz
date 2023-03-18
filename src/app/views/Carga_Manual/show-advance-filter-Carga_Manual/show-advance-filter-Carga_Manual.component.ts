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
import { Tipo_de_carga } from 'src/app/models/Tipo_de_carga';
import { Tipo_de_cargaService } from 'src/app/api-services/Tipo_de_carga.service';


@Component({
  selector: 'app-show-advance-filter-Carga_Manual',
  templateUrl: './show-advance-filter-Carga_Manual.component.html',
  styleUrls: ['./show-advance-filter-Carga_Manual.component.scss']
})
export class ShowAdvanceFilterCarga_ManualComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Usuarios: Spartan_User[] = [];
  public Tipo_de_cargas: Tipo_de_carga[] = [];

  public spartan_users: Spartan_User;
  public tipo_de_cargas: Tipo_de_carga;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_carga",
      "Hora_de_carga",
      "Usuario",
      "Tipo_de_carga",
      "Archivo_a_cargar",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_carga_filtro",
      "Hora_de_carga_filtro",
      "Usuario_filtro",
      "Tipo_de_carga_filtro",
      "Archivo_a_cargar_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha_de_carga: null,
      Hora_de_carga: "",
      Usuario: "",
      Tipo_de_carga: "",
      Archivo_a_cargar: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_carga: "",
      toFecha_de_carga: "",
      fromHora_de_carga: "",
      toHora_de_carga: "",
      UsuarioFilter: "",
      Usuario: "",
      UsuarioMultiple: "",
      Tipo_de_cargaFilter: "",
      Tipo_de_carga: "",
      Tipo_de_cargaMultiple: "",

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
    private tipo_de_cargaService: Tipo_de_cargaService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFecha_de_carga: [''],
      toFecha_de_carga: [''],
      fromHora_de_carga: [''],
      toHora_de_carga: [''],
      UsuarioFilter: [''],
      Usuario: [''],
      UsuarioMultiple: [''],
      Tipo_de_cargaFilter: [''],
      Tipo_de_carga: [''],
      Tipo_de_cargaMultiple: [''],
      Archivo_a_cargarFilter: [''],
      Archivo_a_cargar_Completo: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Carga_Manual/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.tipo_de_cargaService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,tipo_de_cargas ]) => {
		  this.spartan_users = spartan_users;
		  this.tipo_de_cargas = tipo_de_cargas;
          

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
    this.dataListConfig.filterAdvanced.fromFecha_de_carga = entity.fromFecha_de_carga;
    this.dataListConfig.filterAdvanced.toFecha_de_carga = entity.toFecha_de_carga;
	this.dataListConfig.filterAdvanced.Hora_de_cargaFilter = entity.Hora_de_cargaFilter;
	this.dataListConfig.filterAdvanced.Hora_de_carga = entity.Hora_de_carga;
    this.dataListConfig.filterAdvanced.UsuarioFilter = entity.UsuarioFilter;
    this.dataListConfig.filterAdvanced.Usuario = entity.Usuario;
    this.dataListConfig.filterAdvanced.UsuarioMultiple = entity.UsuarioMultiple;
    this.dataListConfig.filterAdvanced.Tipo_de_cargaFilter = entity.Tipo_de_cargaFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_carga = entity.Tipo_de_carga;
    this.dataListConfig.filterAdvanced.Tipo_de_cargaMultiple = entity.Tipo_de_cargaMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Carga_Manual/list'], { state: { data: this.dataListConfig } });
  }
}
