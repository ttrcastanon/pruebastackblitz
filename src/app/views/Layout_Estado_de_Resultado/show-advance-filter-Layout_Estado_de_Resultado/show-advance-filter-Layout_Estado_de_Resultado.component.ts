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

import { Tipo_Concepto_Estado_Resultado } from 'src/app/models/Tipo_Concepto_Estado_Resultado';
import { Tipo_Concepto_Estado_ResultadoService } from 'src/app/api-services/Tipo_Concepto_Estado_Resultado.service';
import { Concepto_Estado_de_Resultado } from 'src/app/models/Concepto_Estado_de_Resultado';
import { Concepto_Estado_de_ResultadoService } from 'src/app/api-services/Concepto_Estado_de_Resultado.service';


@Component({
  selector: 'app-show-advance-filter-Layout_Estado_de_Resultado',
  templateUrl: './show-advance-filter-Layout_Estado_de_Resultado.component.html',
  styleUrls: ['./show-advance-filter-Layout_Estado_de_Resultado.component.scss']
})
export class ShowAdvanceFilterLayout_Estado_de_ResultadoComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public TipoConceptos: Tipo_Concepto_Estado_Resultado[] = [];
  public Conceptos: Concepto_Estado_de_Resultado[] = [];

  public tipo_concepto_estado_resultados: Tipo_Concepto_Estado_Resultado;
  public concepto_estado_de_resultados: Concepto_Estado_de_Resultado;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "TipoConcepto",
      "Concepto",
      "Real",
      "Presupuesto",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_de_carga_manual_filtro",
      "Fecha_filtro",
      "TipoConcepto_filtro",
      "Concepto_filtro",
      "Real_filtro",
      "Presupuesto_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Folio_de_carga_manual: "",
      Fecha: null,
      TipoConcepto: "",
      Concepto: "",
      Real: "",
      Presupuesto: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFolio_de_carga_manual: "",
      toFolio_de_carga_manual: "",
      fromFecha: "",
      toFecha: "",
      TipoConceptoFilter: "",
      TipoConcepto: "",
      TipoConceptoMultiple: "",
      ConceptoFilter: "",
      Concepto: "",
      ConceptoMultiple: "",
      fromReal: "",
      toReal: "",
      fromPresupuesto: "",
      toPresupuesto: "",

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
    private tipo_concepto_estado_resultadoService: Tipo_Concepto_Estado_ResultadoService,
    private concepto_estado_de_resultadoService: Concepto_Estado_de_ResultadoService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromFolio_de_carga_manual: [''],
      toFolio_de_carga_manual: [''],
      fromFecha: [''],
      toFecha: [''],
      TipoConceptoFilter: [''],
      TipoConcepto: [''],
      TipoConceptoMultiple: [''],
      ConceptoFilter: [''],
      Concepto: [''],
      ConceptoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Layout_Estado_de_Resultado/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipo_concepto_estado_resultadoService.getAll());
    observablesArray.push(this.concepto_estado_de_resultadoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipo_concepto_estado_resultados ,concepto_estado_de_resultados ]) => {
		  this.tipo_concepto_estado_resultados = tipo_concepto_estado_resultados;
		  this.concepto_estado_de_resultados = concepto_estado_de_resultados;
          

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
    this.dataListConfig.filterAdvanced.fromFolio_de_carga_manual = entity.fromFolio_de_carga_manual;
    this.dataListConfig.filterAdvanced.toFolio_de_carga_manual = entity.toFolio_de_carga_manual;
    this.dataListConfig.filterAdvanced.fromFecha = entity.fromFecha;
    this.dataListConfig.filterAdvanced.toFecha = entity.toFecha;
    this.dataListConfig.filterAdvanced.TipoConceptoFilter = entity.TipoConceptoFilter;
    this.dataListConfig.filterAdvanced.TipoConcepto = entity.TipoConcepto;
    this.dataListConfig.filterAdvanced.TipoConceptoMultiple = entity.TipoConceptoMultiple;
    this.dataListConfig.filterAdvanced.ConceptoFilter = entity.ConceptoFilter;
    this.dataListConfig.filterAdvanced.Concepto = entity.Concepto;
    this.dataListConfig.filterAdvanced.ConceptoMultiple = entity.ConceptoMultiple;
    this.dataListConfig.filterAdvanced.fromReal = entity.fromReal;
    this.dataListConfig.filterAdvanced.toReal = entity.toReal;
    this.dataListConfig.filterAdvanced.fromPresupuesto = entity.fromPresupuesto;
    this.dataListConfig.filterAdvanced.toPresupuesto = entity.toPresupuesto;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Layout_Estado_de_Resultado/list'], { state: { data: this.dataListConfig } });
  }
}
