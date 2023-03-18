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
  selector: 'app-show-advance-filter-Impuestos',
  templateUrl: './show-advance-filter-Impuestos.component.html',
  styleUrls: ['./show-advance-filter-Impuestos.component.scss']
})
export class ShowAdvanceFilterImpuestosComponent implements OnInit, AfterViewInit {

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
      "IVA_Nacional",
      "IVA_Internacional",
      "IVA_Frontera",
      "TUA_Nacional",
      "TUA_Internacional",
      "Cargos_por_vuelo_internacional",
      "Derechos_por_servicios_migratorios",
      "Fecha_ultima_modificacion",
      "Hora_ultima_modificacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "IVA_Nacional_filtro",
      "IVA_Internacional_filtro",
      "IVA_Frontera_filtro",
      "TUA_Nacional_filtro",
      "TUA_Internacional_filtro",
      "Cargos_por_vuelo_internacional_filtro",
      "Derechos_por_servicios_migratorios_filtro",
      "Fecha_ultima_modificacion_filtro",
      "Hora_ultima_modificacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      IVA_Nacional: "",
      IVA_Internacional: "",
      IVA_Frontera: "",
      TUA_Nacional: "",
      TUA_Internacional: "",
      Cargos_por_vuelo_internacional: "",
      Derechos_por_servicios_migratorios: "",
      Fecha_ultima_modificacion: null,
      Hora_ultima_modificacion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromIVA_Nacional: "",
      toIVA_Nacional: "",
      fromIVA_Internacional: "",
      toIVA_Internacional: "",
      fromIVA_Frontera: "",
      toIVA_Frontera: "",
      fromTUA_Nacional: "",
      toTUA_Nacional: "",
      fromTUA_Internacional: "",
      toTUA_Internacional: "",
      fromCargos_por_vuelo_internacional: "",
      toCargos_por_vuelo_internacional: "",
      fromDerechos_por_servicios_migratorios: "",
      toDerechos_por_servicios_migratorios: "",
      fromFecha_ultima_modificacion: "",
      toFecha_ultima_modificacion: "",
      fromHora_ultima_modificacion: "",
      toHora_ultima_modificacion: "",

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
      fromIVA_Nacional: [''],
      toIVA_Nacional: [''],
      fromIVA_Internacional: [''],
      toIVA_Internacional: [''],
      fromIVA_Frontera: [''],
      toIVA_Frontera: [''],
      fromTUA_Nacional: [''],
      toTUA_Nacional: [''],
      fromTUA_Internacional: [''],
      toTUA_Internacional: [''],
      fromCargos_por_vuelo_internacional: [''],
      toCargos_por_vuelo_internacional: [''],
      fromDerechos_por_servicios_migratorios: [''],
      toDerechos_por_servicios_migratorios: [''],
      fromFecha_ultima_modificacion: [''],
      toFecha_ultima_modificacion: [''],
      fromHora_ultima_modificacion: [''],
      toHora_ultima_modificacion: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Impuestos/list']);
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
    this.dataListConfig.filterAdvanced.fromIVA_Nacional = entity.fromIVA_Nacional;
    this.dataListConfig.filterAdvanced.toIVA_Nacional = entity.toIVA_Nacional;
    this.dataListConfig.filterAdvanced.fromIVA_Internacional = entity.fromIVA_Internacional;
    this.dataListConfig.filterAdvanced.toIVA_Internacional = entity.toIVA_Internacional;
    this.dataListConfig.filterAdvanced.fromIVA_Frontera = entity.fromIVA_Frontera;
    this.dataListConfig.filterAdvanced.toIVA_Frontera = entity.toIVA_Frontera;
    this.dataListConfig.filterAdvanced.fromTUA_Nacional = entity.fromTUA_Nacional;
    this.dataListConfig.filterAdvanced.toTUA_Nacional = entity.toTUA_Nacional;
    this.dataListConfig.filterAdvanced.fromTUA_Internacional = entity.fromTUA_Internacional;
    this.dataListConfig.filterAdvanced.toTUA_Internacional = entity.toTUA_Internacional;
    this.dataListConfig.filterAdvanced.fromCargos_por_vuelo_internacional = entity.fromCargos_por_vuelo_internacional;
    this.dataListConfig.filterAdvanced.toCargos_por_vuelo_internacional = entity.toCargos_por_vuelo_internacional;
    this.dataListConfig.filterAdvanced.fromDerechos_por_servicios_migratorios = entity.fromDerechos_por_servicios_migratorios;
    this.dataListConfig.filterAdvanced.toDerechos_por_servicios_migratorios = entity.toDerechos_por_servicios_migratorios;
    this.dataListConfig.filterAdvanced.fromFecha_ultima_modificacion = entity.fromFecha_ultima_modificacion;
    this.dataListConfig.filterAdvanced.toFecha_ultima_modificacion = entity.toFecha_ultima_modificacion;
	this.dataListConfig.filterAdvanced.Hora_ultima_modificacionFilter = entity.Hora_ultima_modificacionFilter;
	this.dataListConfig.filterAdvanced.Hora_ultima_modificacion = entity.Hora_ultima_modificacion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Impuestos/list'], { state: { data: this.dataListConfig } });
  }
}
