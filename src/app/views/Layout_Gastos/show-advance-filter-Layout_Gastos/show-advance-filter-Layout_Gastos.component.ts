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

import { Tipo_Concepto } from 'src/app/models/Tipo_Concepto';
import { Tipo_ConceptoService } from 'src/app/api-services/Tipo_Concepto.service';
import { Tipo_de_Gasto } from 'src/app/models/Tipo_de_Gasto';
import { Tipo_de_GastoService } from 'src/app/api-services/Tipo_de_Gasto.service';
import { Concepto } from 'src/app/models/Concepto';
import { ConceptoService } from 'src/app/api-services/Concepto.service';


@Component({
  selector: 'app-show-advance-filter-Layout_Gastos',
  templateUrl: './show-advance-filter-Layout_Gastos.component.html',
  styleUrls: ['./show-advance-filter-Layout_Gastos.component.scss']
})
export class ShowAdvanceFilterLayout_GastosComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public TipoConceptos: Tipo_Concepto[] = [];
  public TipoGastos: Tipo_de_Gasto[] = [];
  public Conceptos: Concepto[] = [];

  public tipo_conceptos: Tipo_Concepto;
  public tipo_de_gastos: Tipo_de_Gasto;
  public conceptos: Concepto;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "TipoConcepto",
      "TipoGasto",
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
      "TipoGasto_filtro",
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
      TipoGasto: "",
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
      TipoGastoFilter: "",
      TipoGasto: "",
      TipoGastoMultiple: "",
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
    private tipo_conceptoService: Tipo_ConceptoService,
    private tipo_de_gastoService: Tipo_de_GastoService,
    private conceptoService: ConceptoService,

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
      TipoGastoFilter: [''],
      TipoGasto: [''],
      TipoGastoMultiple: [''],
      ConceptoFilter: [''],
      Concepto: [''],
      ConceptoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Layout_Gastos/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipo_conceptoService.getAll());
    observablesArray.push(this.tipo_de_gastoService.getAll());
    observablesArray.push(this.conceptoService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipo_conceptos ,tipo_de_gastos ,conceptos ]) => {
		  this.tipo_conceptos = tipo_conceptos;
		  this.tipo_de_gastos = tipo_de_gastos;
		  this.conceptos = conceptos;
          

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
    this.dataListConfig.filterAdvanced.TipoGastoFilter = entity.TipoGastoFilter;
    this.dataListConfig.filterAdvanced.TipoGasto = entity.TipoGasto;
    this.dataListConfig.filterAdvanced.TipoGastoMultiple = entity.TipoGastoMultiple;
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
    this.router.navigate(['Layout_Gastos/list'], { state: { data: this.dataListConfig } });
  }
}
