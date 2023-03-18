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
import { Tipo_de_Notificacion_Push } from 'src/app/models/Tipo_de_Notificacion_Push';
import { Tipo_de_Notificacion_PushService } from 'src/app/api-services/Tipo_de_Notificacion_Push.service';


@Component({
  selector: 'app-show-advance-filter-Notificaciones_Push',
  templateUrl: './show-advance-filter-Notificaciones_Push.component.html',
  styleUrls: ['./show-advance-filter-Notificaciones_Push.component.scss']
})
export class ShowAdvanceFilterNotificaciones_PushComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Destinatarios: Spartan_User[] = [];
  public Tipos: Tipo_de_Notificacion_Push[] = [];

  public spartan_users: Spartan_User;
  public tipo_de_notificacion_pushs: Tipo_de_Notificacion_Push;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha",
      "Hora",
      "Destinatario",
      "Parametros_Adicionales",
      "Notificacion",
      "Leida",
      "Titulo",
      "Tipo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_filtro",
      "Hora_filtro",
      "Destinatario_filtro",
      "Parametros_Adicionales_filtro",
      "Notificacion_filtro",
      "Leida_filtro",
      "Titulo_filtro",
      "Tipo_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Fecha: null,
      Hora: "",
      Destinatario: "",
      Parametros_Adicionales: "",
      Notificacion: "",
      Leida: "",
      Titulo: "",
      Tipo: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha: "",
      toFecha: "",
      fromHora: "",
      toHora: "",
      DestinatarioFilter: "",
      Destinatario: "",
      DestinatarioMultiple: "",
      TipoFilter: "",
      Tipo: "",
      TipoMultiple: "",

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
    private tipo_de_notificacion_pushService: Tipo_de_Notificacion_PushService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFecha: [''],
      toFecha: [''],
      fromHora: [''],
      toHora: [''],
      DestinatarioFilter: [''],
      Destinatario: [''],
      DestinatarioMultiple: [''],
      TipoFilter: [''],
      Tipo: [''],
      TipoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Notificaciones_Push/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.tipo_de_notificacion_pushService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,spartan_users ,tipo_de_notificacion_pushs ]) => {
		  this.spartan_users = spartan_users;
		  this.tipo_de_notificacion_pushs = tipo_de_notificacion_pushs;
          

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
    this.dataListConfig.filterAdvanced.fromFecha = entity.fromFecha;
    this.dataListConfig.filterAdvanced.toFecha = entity.toFecha;
	this.dataListConfig.filterAdvanced.HoraFilter = entity.HoraFilter;
	this.dataListConfig.filterAdvanced.Hora = entity.Hora;
    this.dataListConfig.filterAdvanced.DestinatarioFilter = entity.DestinatarioFilter;
    this.dataListConfig.filterAdvanced.Destinatario = entity.Destinatario;
    this.dataListConfig.filterAdvanced.DestinatarioMultiple = entity.DestinatarioMultiple;
	this.dataListConfig.filterAdvanced.Parametros_AdicionalesFilter = entity.Parametros_AdicionalesFilter;
	this.dataListConfig.filterAdvanced.Parametros_Adicionales = entity.Parametros_Adicionales;
	this.dataListConfig.filterAdvanced.NotificacionFilter = entity.NotificacionFilter;
	this.dataListConfig.filterAdvanced.Notificacion = entity.Notificacion;
	this.dataListConfig.filterAdvanced.TituloFilter = entity.TituloFilter;
	this.dataListConfig.filterAdvanced.Titulo = entity.Titulo;
    this.dataListConfig.filterAdvanced.TipoFilter = entity.TipoFilter;
    this.dataListConfig.filterAdvanced.Tipo = entity.Tipo;
    this.dataListConfig.filterAdvanced.TipoMultiple = entity.TipoMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Notificaciones_Push/list'], { state: { data: this.dataListConfig } });
  }
}
