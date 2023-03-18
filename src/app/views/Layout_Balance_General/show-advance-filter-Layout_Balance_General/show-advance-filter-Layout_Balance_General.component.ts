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

import { Tipo_de_Concepto_Balance_General } from 'src/app/models/Tipo_de_Concepto_Balance_General';
import { Tipo_de_Concepto_Balance_GeneralService } from 'src/app/api-services/Tipo_de_Concepto_Balance_General.service';
import { Agrupacion_Concepto_Balance_General } from 'src/app/models/Agrupacion_Concepto_Balance_General';
import { Agrupacion_Concepto_Balance_GeneralService } from 'src/app/api-services/Agrupacion_Concepto_Balance_General.service';
import { Concepto_Balance_General } from 'src/app/models/Concepto_Balance_General';
import { Concepto_Balance_GeneralService } from 'src/app/api-services/Concepto_Balance_General.service';


@Component({
  selector: 'app-show-advance-filter-Layout_Balance_General',
  templateUrl: './show-advance-filter-Layout_Balance_General.component.html',
  styleUrls: ['./show-advance-filter-Layout_Balance_General.component.scss']
})
export class ShowAdvanceFilterLayout_Balance_GeneralComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public TipoConceptos: Tipo_de_Concepto_Balance_General[] = [];
  public AgrupacionConceptos: Agrupacion_Concepto_Balance_General[] = [];
  public Conceptos: Concepto_Balance_General[] = [];

  public tipo_de_concepto_balance_generals: Tipo_de_Concepto_Balance_General;
  public agrupacion_concepto_balance_generals: Agrupacion_Concepto_Balance_General;
  public concepto_balance_generals: Concepto_Balance_General;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "TipoConcepto",
      "AgrupacionConcepto",
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
      "AgrupacionConcepto_filtro",
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
      AgrupacionConcepto: "",
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
      AgrupacionConceptoFilter: "",
      AgrupacionConcepto: "",
      AgrupacionConceptoMultiple: "",
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
    private tipo_de_concepto_balance_generalService: Tipo_de_Concepto_Balance_GeneralService,
    private agrupacion_concepto_balance_generalService: Agrupacion_Concepto_Balance_GeneralService,
    private concepto_balance_generalService: Concepto_Balance_GeneralService,

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
      AgrupacionConceptoFilter: [''],
      AgrupacionConcepto: [''],
      AgrupacionConceptoMultiple: [''],
      ConceptoFilter: [''],
      Concepto: [''],
      ConceptoMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Layout_Balance_General/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipo_de_concepto_balance_generalService.getAll());
    observablesArray.push(this.agrupacion_concepto_balance_generalService.getAll());
    observablesArray.push(this.concepto_balance_generalService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipo_de_concepto_balance_generals ,agrupacion_concepto_balance_generals ,concepto_balance_generals ]) => {
		  this.tipo_de_concepto_balance_generals = tipo_de_concepto_balance_generals;
		  this.agrupacion_concepto_balance_generals = agrupacion_concepto_balance_generals;
		  this.concepto_balance_generals = concepto_balance_generals;
          

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
    this.dataListConfig.filterAdvanced.AgrupacionConceptoFilter = entity.AgrupacionConceptoFilter;
    this.dataListConfig.filterAdvanced.AgrupacionConcepto = entity.AgrupacionConcepto;
    this.dataListConfig.filterAdvanced.AgrupacionConceptoMultiple = entity.AgrupacionConceptoMultiple;
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
    this.router.navigate(['Layout_Balance_General/list'], { state: { data: this.dataListConfig } });
  }
}
