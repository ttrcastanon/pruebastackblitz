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
  selector: 'app-show-advance-filter-Layout_Cuentas_por_pagar',
  templateUrl: './show-advance-filter-Layout_Cuentas_por_pagar.component.html',
  styleUrls: ['./show-advance-filter-Layout_Cuentas_por_pagar.component.scss']
})
export class ShowAdvanceFilterLayout_Cuentas_por_pagarComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public RFC_Clientes: Cliente[] = [];
  public Descripcion_Clientes: Cliente[] = [];

  public clientes: Cliente;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "RFC_Cliente",
      "Descripcion_Cliente",
      "Facturacion",
      "Cobranza",
      "Saldo30dias",
      "Saldo60dias",
      "Saldo90dias",
      "SaldoMayor180dias",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_de_carga_manual_filtro",
      "Fecha_filtro",
      "RFC_Cliente_filtro",
      "Descripcion_Cliente_filtro",
      "Facturacion_filtro",
      "Cobranza_filtro",
      "Saldo30dias_filtro",
      "Saldo60dias_filtro",
      "Saldo90dias_filtro",
      "SaldoMayor180dias_filtro",

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
      RFC_Cliente: "",
      Descripcion_Cliente: "",
      Facturacion: "",
      Cobranza: "",
      Saldo30dias: "",
      Saldo60dias: "",
      Saldo90dias: "",
      SaldoMayor180dias: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFolio_de_carga_manual: "",
      toFolio_de_carga_manual: "",
      fromFecha: "",
      toFecha: "",
      RFC_ClienteFilter: "",
      RFC_Cliente: "",
      RFC_ClienteMultiple: "",
      Descripcion_ClienteFilter: "",
      Descripcion_Cliente: "",
      Descripcion_ClienteMultiple: "",
      fromFacturacion: "",
      toFacturacion: "",
      fromCobranza: "",
      toCobranza: "",
      fromSaldo30dias: "",
      toSaldo30dias: "",
      fromSaldo60dias: "",
      toSaldo60dias: "",
      fromSaldo90dias: "",
      toSaldo90dias: "",
      fromSaldoMayor180dias: "",
      toSaldoMayor180dias: "",

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
      fromFolio_de_carga_manual: [''],
      toFolio_de_carga_manual: [''],
      fromFecha: [''],
      toFecha: [''],
      RFC_ClienteFilter: [''],
      RFC_Cliente: [''],
      RFC_ClienteMultiple: [''],
      Descripcion_ClienteFilter: [''],
      Descripcion_Cliente: [''],
      Descripcion_ClienteMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Layout_Cuentas_por_pagar/list']);
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
    this.dataListConfig.filterAdvanced.fromFolio_de_carga_manual = entity.fromFolio_de_carga_manual;
    this.dataListConfig.filterAdvanced.toFolio_de_carga_manual = entity.toFolio_de_carga_manual;
    this.dataListConfig.filterAdvanced.fromFecha = entity.fromFecha;
    this.dataListConfig.filterAdvanced.toFecha = entity.toFecha;
    this.dataListConfig.filterAdvanced.RFC_ClienteFilter = entity.RFC_ClienteFilter;
    this.dataListConfig.filterAdvanced.RFC_Cliente = entity.RFC_Cliente;
    this.dataListConfig.filterAdvanced.RFC_ClienteMultiple = entity.RFC_ClienteMultiple;
    this.dataListConfig.filterAdvanced.Descripcion_ClienteFilter = entity.Descripcion_ClienteFilter;
    this.dataListConfig.filterAdvanced.Descripcion_Cliente = entity.Descripcion_Cliente;
    this.dataListConfig.filterAdvanced.Descripcion_ClienteMultiple = entity.Descripcion_ClienteMultiple;
    this.dataListConfig.filterAdvanced.fromFacturacion = entity.fromFacturacion;
    this.dataListConfig.filterAdvanced.toFacturacion = entity.toFacturacion;
    this.dataListConfig.filterAdvanced.fromCobranza = entity.fromCobranza;
    this.dataListConfig.filterAdvanced.toCobranza = entity.toCobranza;
    this.dataListConfig.filterAdvanced.fromSaldo30dias = entity.fromSaldo30dias;
    this.dataListConfig.filterAdvanced.toSaldo30dias = entity.toSaldo30dias;
    this.dataListConfig.filterAdvanced.fromSaldo60dias = entity.fromSaldo60dias;
    this.dataListConfig.filterAdvanced.toSaldo60dias = entity.toSaldo60dias;
    this.dataListConfig.filterAdvanced.fromSaldo90dias = entity.fromSaldo90dias;
    this.dataListConfig.filterAdvanced.toSaldo90dias = entity.toSaldo90dias;
    this.dataListConfig.filterAdvanced.fromSaldoMayor180dias = entity.fromSaldoMayor180dias;
    this.dataListConfig.filterAdvanced.toSaldoMayor180dias = entity.toSaldoMayor180dias;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Layout_Cuentas_por_pagar/list'], { state: { data: this.dataListConfig } });
  }
}
