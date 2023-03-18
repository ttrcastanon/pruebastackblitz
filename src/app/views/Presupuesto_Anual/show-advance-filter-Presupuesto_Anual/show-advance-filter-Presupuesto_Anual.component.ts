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

import { Cliente } from 'src/app/models/Cliente';
import { ClienteService } from 'src/app/api-services/Cliente.service';


@Component({
  selector: 'app-show-advance-filter-Presupuesto_Anual',
  templateUrl: './show-advance-filter-Presupuesto_Anual.component.html',
  styleUrls: ['./show-advance-filter-Presupuesto_Anual.component.scss']
})
export class ShowAdvanceFilterPresupuesto_AnualComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Empresas: Cliente[] = [];

  public clientes: Cliente;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Empresa",
      "Ano_en_curso",
      "Monto_Pres__Inicial_Ano",
      "Porcentaje_Pres__Ano",
      "Gasto_Real_Facturado",
      "Pto__Estimado_acumulado",
      "Porcentaje_Estimado_Acumulado",
      "Porcentaje_Gasto_Real_Acumulado",
      "Porcentaje_Diferencia",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Empresa_filtro",
      "Ano_en_curso_filtro",
      "Monto_Pres__Inicial_Ano_filtro",
      "Porcentaje_Pres__Ano_filtro",
      "Gasto_Real_Facturado_filtro",
      "Pto__Estimado_acumulado_filtro",
      "Porcentaje_Estimado_Acumulado_filtro",
      "Porcentaje_Gasto_Real_Acumulado_filtro",
      "Porcentaje_Diferencia_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Empresa: "",
      Ano_en_curso: "",
      Monto_Pres__Inicial_Ano: "",
      Porcentaje_Pres__Ano: "",
      Gasto_Real_Facturado: "",
      Pto__Estimado_acumulado: "",
      Porcentaje_Estimado_Acumulado: "",
      Porcentaje_Gasto_Real_Acumulado: "",
      Porcentaje_Diferencia: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      EmpresaFilter: "",
      Empresa: "",
      EmpresaMultiple: "",
      fromAno_en_curso: "",
      toAno_en_curso: "",
      fromMonto_Pres__Inicial_Ano: "",
      toMonto_Pres__Inicial_Ano: "",
      fromPorcentaje_Pres__Ano: "",
      toPorcentaje_Pres__Ano: "",
      fromGasto_Real_Facturado: "",
      toGasto_Real_Facturado: "",
      fromPto__Estimado_acumulado: "",
      toPto__Estimado_acumulado: "",
      fromPorcentaje_Estimado_Acumulado: "",
      toPorcentaje_Estimado_Acumulado: "",
      fromPorcentaje_Gasto_Real_Acumulado: "",
      toPorcentaje_Gasto_Real_Acumulado: "",
      fromPorcentaje_Diferencia: "",
      toPorcentaje_Diferencia: "",

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
    private clienteService: ClienteService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      EmpresaFilter: [''],
      Empresa: [''],
      EmpresaMultiple: [''],
      fromAno_en_curso: [''],
      toAno_en_curso: [''],
      fromMonto_Pres__Inicial_Ano: [''],
      toMonto_Pres__Inicial_Ano: [''],
      fromPorcentaje_Pres__Ano: [''],
      toPorcentaje_Pres__Ano: [''],
      fromGasto_Real_Facturado: [''],
      toGasto_Real_Facturado: [''],
      fromPto__Estimado_acumulado: [''],
      toPto__Estimado_acumulado: [''],
      fromPorcentaje_Estimado_Acumulado: [''],
      toPorcentaje_Estimado_Acumulado: [''],
      fromPorcentaje_Gasto_Real_Acumulado: [''],
      toPorcentaje_Gasto_Real_Acumulado: [''],
      fromPorcentaje_Diferencia: [''],
      toPorcentaje_Diferencia: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Presupuesto_Anual/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.clienteService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,clientes ]) => {
		  this.clientes = clientes;
          

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
    this.dataListConfig.filterAdvanced.EmpresaFilter = entity.EmpresaFilter;
    this.dataListConfig.filterAdvanced.Empresa = entity.Empresa;
    this.dataListConfig.filterAdvanced.EmpresaMultiple = entity.EmpresaMultiple;
    this.dataListConfig.filterAdvanced.fromAno_en_curso = entity.fromAno_en_curso;
    this.dataListConfig.filterAdvanced.toAno_en_curso = entity.toAno_en_curso;
    this.dataListConfig.filterAdvanced.fromMonto_Pres__Inicial_Ano = entity.fromMonto_Pres__Inicial_Ano;
    this.dataListConfig.filterAdvanced.toMonto_Pres__Inicial_Ano = entity.toMonto_Pres__Inicial_Ano;
    this.dataListConfig.filterAdvanced.fromPorcentaje_Pres__Ano = entity.fromPorcentaje_Pres__Ano;
    this.dataListConfig.filterAdvanced.toPorcentaje_Pres__Ano = entity.toPorcentaje_Pres__Ano;
    this.dataListConfig.filterAdvanced.fromGasto_Real_Facturado = entity.fromGasto_Real_Facturado;
    this.dataListConfig.filterAdvanced.toGasto_Real_Facturado = entity.toGasto_Real_Facturado;
    this.dataListConfig.filterAdvanced.fromPto__Estimado_acumulado = entity.fromPto__Estimado_acumulado;
    this.dataListConfig.filterAdvanced.toPto__Estimado_acumulado = entity.toPto__Estimado_acumulado;
    this.dataListConfig.filterAdvanced.fromPorcentaje_Estimado_Acumulado = entity.fromPorcentaje_Estimado_Acumulado;
    this.dataListConfig.filterAdvanced.toPorcentaje_Estimado_Acumulado = entity.toPorcentaje_Estimado_Acumulado;
    this.dataListConfig.filterAdvanced.fromPorcentaje_Gasto_Real_Acumulado = entity.fromPorcentaje_Gasto_Real_Acumulado;
    this.dataListConfig.filterAdvanced.toPorcentaje_Gasto_Real_Acumulado = entity.toPorcentaje_Gasto_Real_Acumulado;
    this.dataListConfig.filterAdvanced.fromPorcentaje_Diferencia = entity.fromPorcentaje_Diferencia;
    this.dataListConfig.filterAdvanced.toPorcentaje_Diferencia = entity.toPorcentaje_Diferencia;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Presupuesto_Anual/list'], { state: { data: this.dataListConfig } });
  }
}
