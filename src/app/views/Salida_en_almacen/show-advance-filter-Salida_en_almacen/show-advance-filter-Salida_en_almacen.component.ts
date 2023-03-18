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
import { Unidad } from 'src/app/models/Unidad';
import { UnidadService } from 'src/app/api-services/Unidad.service';


@Component({
  selector: 'app-show-advance-filter-Salida_en_almacen',
  templateUrl: './show-advance-filter-Salida_en_almacen.component.html',
  styleUrls: ['./show-advance-filter-Salida_en_almacen.component.scss']
})
export class ShowAdvanceFilterSalida_en_almacenComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Solicitantes: Spartan_User[] = [];
  public Und_s: Unidad[] = [];
  public Entregado_as: Spartan_User[] = [];
  public Und2s: Unidad[] = [];

  public spartan_users: Spartan_User;
  public unidads: Unidad;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_Parte___Descripcion",
      "Solicitante",
      "Cant__Solicitada",
      "Und_",
      "Entregado_a",
      "Cant__a_entregar",
      "Und2",
      "IdSalidaAlmacen",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_Parte___Descripcion_filtro",
      "Solicitante_filtro",
      "Cant__Solicitada_filtro",
      "Und__filtro",
      "Entregado_a_filtro",
      "Cant__a_entregar_filtro",
      "Und2_filtro",
      "IdSalidaAlmacen_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No__de_Parte___Descripcion: "",
      Solicitante: "",
      Cant__Solicitada: "",
      Und_: "",
      Entregado_a: "",
      Cant__a_entregar: "",
      Und2: "",
      IdSalidaAlmacen: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      fromCant__Solicitada: "",
      toCant__Solicitada: "",
      Und_Filter: "",
      Und_: "",
      Und_Multiple: "",
      Entregado_aFilter: "",
      Entregado_a: "",
      Entregado_aMultiple: "",
      fromCant__a_entregar: "",
      toCant__a_entregar: "",
      Und2Filter: "",
      Und2: "",
      Und2Multiple: "",

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
    private unidadService: UnidadService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      SolicitanteFilter: [''],
      Solicitante: [''],
      SolicitanteMultiple: [''],
      Und_Filter: [''],
      Und_: [''],
      Und_Multiple: [''],
      Entregado_aFilter: [''],
      Entregado_a: [''],
      Entregado_aMultiple: [''],
      fromCant__a_entregar: [''],
      toCant__a_entregar: [''],
      Und2Filter: [''],
      Und2: [''],
      Und2Multiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Salida_en_almacen/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.unidadService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,unidads ]) => {
		  this.spartan_users = spartan_users;
		  this.unidads = unidads;
          

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
    this.dataListConfig.filterAdvanced.SolicitanteFilter = entity.SolicitanteFilter;
    this.dataListConfig.filterAdvanced.Solicitante = entity.Solicitante;
    this.dataListConfig.filterAdvanced.SolicitanteMultiple = entity.SolicitanteMultiple;
    this.dataListConfig.filterAdvanced.fromCant__Solicitada = entity.fromCant__Solicitada;
    this.dataListConfig.filterAdvanced.toCant__Solicitada = entity.toCant__Solicitada;
    this.dataListConfig.filterAdvanced.Und_Filter = entity.Und_Filter;
    this.dataListConfig.filterAdvanced.Und_ = entity.Und_;
    this.dataListConfig.filterAdvanced.Und_Multiple = entity.Und_Multiple;
    this.dataListConfig.filterAdvanced.Entregado_aFilter = entity.Entregado_aFilter;
    this.dataListConfig.filterAdvanced.Entregado_a = entity.Entregado_a;
    this.dataListConfig.filterAdvanced.Entregado_aMultiple = entity.Entregado_aMultiple;
    this.dataListConfig.filterAdvanced.fromCant__a_entregar = entity.fromCant__a_entregar;
    this.dataListConfig.filterAdvanced.toCant__a_entregar = entity.toCant__a_entregar;
    this.dataListConfig.filterAdvanced.Und2Filter = entity.Und2Filter;
    this.dataListConfig.filterAdvanced.Und2 = entity.Und2;
    this.dataListConfig.filterAdvanced.Und2Multiple = entity.Und2Multiple;
	this.dataListConfig.filterAdvanced.IdSalidaAlmacenFilter = entity.IdSalidaAlmacenFilter;
	this.dataListConfig.filterAdvanced.IdSalidaAlmacen = entity.IdSalidaAlmacen;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Salida_en_almacen/list'], { state: { data: this.dataListConfig } });
  }
}
