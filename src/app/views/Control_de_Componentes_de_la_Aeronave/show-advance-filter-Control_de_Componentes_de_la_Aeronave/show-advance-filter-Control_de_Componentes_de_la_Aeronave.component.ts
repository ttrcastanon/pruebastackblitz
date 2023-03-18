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

import { Aeronave } from 'src/app/models/Aeronave';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Modelos } from 'src/app/models/Modelos';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Detalle_Parte_Asociada_al_Componente_Aeronave } from 'src/app/models/Detalle_Parte_Asociada_al_Componente_Aeronave';
import { Detalle_Parte_Asociada_al_Componente_AeronaveService } from 'src/app/api-services/Detalle_Parte_Asociada_al_Componente_Aeronave.service';


@Component({
  selector: 'app-show-advance-filter-Control_de_Componentes_de_la_Aeronave',
  templateUrl: './show-advance-filter-Control_de_Componentes_de_la_Aeronave.component.html',
  styleUrls: ['./show-advance-filter-Control_de_Componentes_de_la_Aeronave.component.scss']
})
export class ShowAdvanceFilterControl_de_Componentes_de_la_AeronaveComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Matriculas: Aeronave[] = [];
  public Modelos: Modelos[] = [];
  public No_Parte_asociado_al_componentes: Detalle_Parte_Asociada_al_Componente_Aeronave[] = [];

  public aeronaves: Aeronave;
  public modeloss: Modelos;
  public detalle_parte_asociada_al_componente_aeronaves: Detalle_Parte_Asociada_al_Componente_Aeronave;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "No_Parte_asociado_al_componente",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "No_Parte_asociado_al_componente_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Matricula: "",
      Modelo: "",
      No_Parte_asociado_al_componente: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      No_Parte_asociado_al_componenteFilter: "",
      No_Parte_asociado_al_componente: "",
      No_Parte_asociado_al_componenteMultiple: "",

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
    private aeronaveService: AeronaveService,
    private modelosService: ModelosService,
    private detalle_parte_asociada_al_componente_aeronaveService: Detalle_Parte_Asociada_al_Componente_AeronaveService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      MatriculaFilter: [''],
      Matricula: [''],
      MatriculaMultiple: [''],
      ModeloFilter: [''],
      Modelo: [''],
      ModeloMultiple: [''],
      No_Parte_asociado_al_componenteFilter: [''],
      No_Parte_asociado_al_componente: [''],
      No_Parte_asociado_al_componenteMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Control_de_Componentes_de_la_Aeronave/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeronaveService.getAll());
    observablesArray.push(this.modelosService.getAll());
    observablesArray.push(this.detalle_parte_asociada_al_componente_aeronaveService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeronaves ,modeloss ,detalle_parte_asociada_al_componente_aeronaves ]) => {
		  this.aeronaves = aeronaves;
		  this.modeloss = modeloss;
		  this.detalle_parte_asociada_al_componente_aeronaves = detalle_parte_asociada_al_componente_aeronaves;
          

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
    this.dataListConfig.filterAdvanced.MatriculaFilter = entity.MatriculaFilter;
    this.dataListConfig.filterAdvanced.Matricula = entity.Matricula;
    this.dataListConfig.filterAdvanced.MatriculaMultiple = entity.MatriculaMultiple;
    this.dataListConfig.filterAdvanced.ModeloFilter = entity.ModeloFilter;
    this.dataListConfig.filterAdvanced.Modelo = entity.Modelo;
    this.dataListConfig.filterAdvanced.ModeloMultiple = entity.ModeloMultiple;
    this.dataListConfig.filterAdvanced.No_Parte_asociado_al_componenteFilter = entity.No_Parte_asociado_al_componenteFilter;
    this.dataListConfig.filterAdvanced.No_Parte_asociado_al_componente = entity.No_Parte_asociado_al_componente;
    this.dataListConfig.filterAdvanced.No_Parte_asociado_al_componenteMultiple = entity.No_Parte_asociado_al_componenteMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Control_de_Componentes_de_la_Aeronave/list'], { state: { data: this.dataListConfig } });
  }
}
