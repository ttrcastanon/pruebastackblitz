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

import { Respuesta } from 'src/app/models/Respuesta';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';


@Component({
  selector: 'app-show-advance-filter-Modulos_reportes',
  templateUrl: './show-advance-filter-Modulos_reportes.component.html',
  styleUrls: ['./show-advance-filter-Modulos_reportes.component.scss']
})
export class ShowAdvanceFilterModulos_reportesComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public IDModulos: Respuesta[] = [];

  public respuestas: Respuesta;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Nombre",
      "IDModulo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Nombre_filtro",
      "IDModulo_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      Nombre: "",
      IDModulo: "",

    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      IDModuloFilter: "",
      IDModulo: "",
      IDModuloMultiple: "",

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
    private respuestaService: RespuestaService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromClave: [''],
      toClave: [''],
      IDModuloFilter: [''],
      IDModulo: [''],
      IDModuloMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Modulos_reportes/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.respuestaService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,respuestas ]) => {
		  this.respuestas = respuestas;
          

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
	this.dataListConfig.filterAdvanced.NombreFilter = entity.NombreFilter;
	this.dataListConfig.filterAdvanced.Nombre = entity.Nombre;
    this.dataListConfig.filterAdvanced.IDModuloFilter = entity.IDModuloFilter;
    this.dataListConfig.filterAdvanced.IDModulo = entity.IDModulo;
    this.dataListConfig.filterAdvanced.IDModuloMultiple = entity.IDModuloMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Modulos_reportes/list'], { state: { data: this.dataListConfig } });
  }
}
