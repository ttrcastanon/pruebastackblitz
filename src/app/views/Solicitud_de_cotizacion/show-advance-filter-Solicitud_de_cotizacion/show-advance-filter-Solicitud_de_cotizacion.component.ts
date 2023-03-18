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
  selector: 'app-show-advance-filter-Solicitud_de_cotizacion',
  templateUrl: './show-advance-filter-Solicitud_de_cotizacion.component.html',
  styleUrls: ['./show-advance-filter-Solicitud_de_cotizacion.component.scss']
})
export class ShowAdvanceFilterSolicitud_de_cotizacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Usuario_que_Registras: Spartan_User[] = [];

  public spartan_users: Spartan_User;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Usuario_que_Registra",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Mensaje_de_correo",
      "Comentarios_Adicionales",
      "Folio_Solicitud_de_Cotizacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Usuario_que_Registra_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Mensaje_de_correo_filtro",
      "Comentarios_Adicionales_filtro",
      "Folio_Solicitud_de_Cotizacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Usuario_que_Registra: "",
      Fecha_de_Registro: null,
      Hora_de_Registro: "",
      Mensaje_de_correo: "",
      Comentarios_Adicionales: "",
      Folio_Solicitud_de_Cotizacion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      fromFecha_de_Registro: "",
      toFecha_de_Registro: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",

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
      fromFolio: [''],
      toFolio: [''],
      Usuario_que_RegistraFilter: [''],
      Usuario_que_Registra: [''],
      Usuario_que_RegistraMultiple: [''],
      fromFecha_de_Registro: [''],
      toFecha_de_Registro: [''],
      fromHora_de_Registro: [''],
      toHora_de_Registro: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Solicitud_de_cotizacion/list']);
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
    this.dataListConfig.filterAdvanced.fromFolio = entity.fromFolio;
    this.dataListConfig.filterAdvanced.toFolio = entity.toFolio;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraFilter = entity.Usuario_que_RegistraFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_Registra = entity.Usuario_que_Registra;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraMultiple = entity.Usuario_que_RegistraMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Registro = entity.fromFecha_de_Registro;
    this.dataListConfig.filterAdvanced.toFecha_de_Registro = entity.toFecha_de_Registro;
	this.dataListConfig.filterAdvanced.Hora_de_RegistroFilter = entity.Hora_de_RegistroFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Registro = entity.Hora_de_Registro;
	this.dataListConfig.filterAdvanced.Mensaje_de_correoFilter = entity.Mensaje_de_correoFilter;
	this.dataListConfig.filterAdvanced.Mensaje_de_correo = entity.Mensaje_de_correo;
	this.dataListConfig.filterAdvanced.Comentarios_AdicionalesFilter = entity.Comentarios_AdicionalesFilter;
	this.dataListConfig.filterAdvanced.Comentarios_Adicionales = entity.Comentarios_Adicionales;
	this.dataListConfig.filterAdvanced.Folio_Solicitud_de_CotizacionFilter = entity.Folio_Solicitud_de_CotizacionFilter;
	this.dataListConfig.filterAdvanced.Folio_Solicitud_de_Cotizacion = entity.Folio_Solicitud_de_Cotizacion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Solicitud_de_cotizacion/list'], { state: { data: this.dataListConfig } });
  }
}
