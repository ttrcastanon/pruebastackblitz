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



@Component({
  selector: 'app-show-advance-filter-Estatus_de_Funcionalidad_para_Notificacion',
  templateUrl: './show-advance-filter-Estatus_de_Funcionalidad_para_Notificacion.component.html',
  styleUrls: ['./show-advance-filter-Estatus_de_Funcionalidad_para_Notificacion.component.scss']
})
export class ShowAdvanceFilterEstatus_de_Funcionalidad_para_NotificacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];


  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Campo_para_Estatus",
      "Nombre_Fisico_del_Campo",
      "Nombre_Fisico_de_la_Tabla",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Campo_para_Estatus_filtro",
      "Nombre_Fisico_del_Campo_filtro",
      "Nombre_Fisico_de_la_Tabla_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Campo_para_Estatus: "",
      Nombre_Fisico_del_Campo: "",
      Nombre_Fisico_de_la_Tabla: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",

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

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Estatus_de_Funcionalidad_para_Notificacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ]) => {
          

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
	this.dataListConfig.filterAdvanced.Campo_para_EstatusFilter = entity.Campo_para_EstatusFilter;
	this.dataListConfig.filterAdvanced.Campo_para_Estatus = entity.Campo_para_Estatus;
	this.dataListConfig.filterAdvanced.Nombre_Fisico_del_CampoFilter = entity.Nombre_Fisico_del_CampoFilter;
	this.dataListConfig.filterAdvanced.Nombre_Fisico_del_Campo = entity.Nombre_Fisico_del_Campo;
	this.dataListConfig.filterAdvanced.Nombre_Fisico_de_la_TablaFilter = entity.Nombre_Fisico_de_la_TablaFilter;
	this.dataListConfig.filterAdvanced.Nombre_Fisico_de_la_Tabla = entity.Nombre_Fisico_de_la_Tabla;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Estatus_de_Funcionalidad_para_Notificacion/list'], { state: { data: this.dataListConfig } });
  }
}
