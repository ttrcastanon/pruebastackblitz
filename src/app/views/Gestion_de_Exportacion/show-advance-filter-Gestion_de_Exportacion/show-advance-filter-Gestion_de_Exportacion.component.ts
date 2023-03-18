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

import { Servicios_Aduanales } from 'src/app/models/Servicios_Aduanales';
import { Servicios_AduanalesService } from 'src/app/api-services/Servicios_Aduanales.service';


@Component({
  selector: 'app-show-advance-filter-Gestion_de_Exportacion',
  templateUrl: './show-advance-filter-Gestion_de_Exportacion.component.html',
  styleUrls: ['./show-advance-filter-Gestion_de_Exportacion.component.scss']
})
export class ShowAdvanceFilterGestion_de_ExportacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Servicios_aduanaless: Servicios_Aduanales[] = [];

  public servicios_aduanaless: Servicios_Aduanales;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Transporte",
      "Costo_Flete_",
      "Tipo_de_Cambio_Transp_",
      "No__Factura",
      "Fecha_de_Factura",
      "Servicios_aduanales",
      "Costo_Servicios_",
      "Tipo_de_Cambio_Aduanales",
      "No__Factura_SA",
      "Fecha_de_Factura_2",
      "Impuestos_Aduanales",
      "Costo_Impuestos_",
      "Tipo_de_Cambio_Imp_",
      "Clave_de_Pedimento",
      "No__de_Pedimento",
      "No__De_Guia",
      "Aplicacion",
      "FolioExportacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Transporte_filtro",
      "Costo_Flete__filtro",
      "Tipo_de_Cambio_Transp__filtro",
      "No__Factura_filtro",
      "Fecha_de_Factura_filtro",
      "Servicios_aduanales_filtro",
      "Costo_Servicios__filtro",
      "Tipo_de_Cambio_Aduanales_filtro",
      "No__Factura_SA_filtro",
      "Fecha_de_Factura_2_filtro",
      "Impuestos_Aduanales_filtro",
      "Costo_Impuestos__filtro",
      "Tipo_de_Cambio_Imp__filtro",
      "Clave_de_Pedimento_filtro",
      "No__de_Pedimento_filtro",
      "No__De_Guia_filtro",
      "Aplicacion_filtro",
      "FolioExportacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Transporte: "",
      Costo_Flete_: "",
      Tipo_de_Cambio_Transp_: "",
      No__Factura: "",
      Fecha_de_Factura: null,
      Servicios_aduanales: "",
      Costo_Servicios_: "",
      Tipo_de_Cambio_Aduanales: "",
      No__Factura_SA: "",
      Fecha_de_Factura_2: null,
      Impuestos_Aduanales: "",
      Costo_Impuestos_: "",
      Tipo_de_Cambio_Imp_: "",
      Clave_de_Pedimento: "",
      No__de_Pedimento: "",
      No__De_Guia: "",
      Aplicacion: "",
      FolioExportacion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromCosto_Flete_: "",
      toCosto_Flete_: "",
      fromTipo_de_Cambio_Transp_: "",
      toTipo_de_Cambio_Transp_: "",
      fromNo__Factura: "",
      toNo__Factura: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",
      Servicios_aduanalesFilter: "",
      Servicios_aduanales: "",
      Servicios_aduanalesMultiple: "",
      fromCosto_Servicios_: "",
      toCosto_Servicios_: "",
      fromTipo_de_Cambio_Aduanales: "",
      toTipo_de_Cambio_Aduanales: "",
      fromNo__Factura_SA: "",
      toNo__Factura_SA: "",
      fromFecha_de_Factura_2: "",
      toFecha_de_Factura_2: "",
      fromImpuestos_Aduanales: "",
      toImpuestos_Aduanales: "",
      fromCosto_Impuestos_: "",
      toCosto_Impuestos_: "",
      fromTipo_de_Cambio_Imp_: "",
      toTipo_de_Cambio_Imp_: "",
      fromNo__de_Pedimento: "",
      toNo__de_Pedimento: "",
      fromNo__De_Guia: "",
      toNo__De_Guia: "",

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
    private servicios_aduanalesService: Servicios_AduanalesService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromCosto_Flete_: [''],
      toCosto_Flete_: [''],
      fromNo__Factura: [''],
      toNo__Factura: [''],
      fromFecha_de_Factura: [''],
      toFecha_de_Factura: [''],
      Servicios_aduanalesFilter: [''],
      Servicios_aduanales: [''],
      Servicios_aduanalesMultiple: [''],
      fromCosto_Servicios_: [''],
      toCosto_Servicios_: [''],
      fromNo__Factura_SA: [''],
      toNo__Factura_SA: [''],
      fromFecha_de_Factura_2: [''],
      toFecha_de_Factura_2: [''],
      fromImpuestos_Aduanales: [''],
      toImpuestos_Aduanales: [''],
      fromCosto_Impuestos_: [''],
      toCosto_Impuestos_: [''],
      fromNo__de_Pedimento: [''],
      toNo__de_Pedimento: [''],
      fromNo__De_Guia: [''],
      toNo__De_Guia: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Gestion_de_Exportacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.servicios_aduanalesService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,servicios_aduanaless ]) => {
		  this.servicios_aduanaless = servicios_aduanaless;
          

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
	this.dataListConfig.filterAdvanced.TransporteFilter = entity.TransporteFilter;
	this.dataListConfig.filterAdvanced.Transporte = entity.Transporte;
    this.dataListConfig.filterAdvanced.fromCosto_Flete_ = entity.fromCosto_Flete_;
    this.dataListConfig.filterAdvanced.toCosto_Flete_ = entity.toCosto_Flete_;
    this.dataListConfig.filterAdvanced.fromTipo_de_Cambio_Transp_ = entity.fromTipo_de_Cambio_Transp_;
    this.dataListConfig.filterAdvanced.toTipo_de_Cambio_Transp_ = entity.toTipo_de_Cambio_Transp_;
    this.dataListConfig.filterAdvanced.fromNo__Factura = entity.fromNo__Factura;
    this.dataListConfig.filterAdvanced.toNo__Factura = entity.toNo__Factura;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura = entity.fromFecha_de_Factura;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura = entity.toFecha_de_Factura;
    this.dataListConfig.filterAdvanced.Servicios_aduanalesFilter = entity.Servicios_aduanalesFilter;
    this.dataListConfig.filterAdvanced.Servicios_aduanales = entity.Servicios_aduanales;
    this.dataListConfig.filterAdvanced.Servicios_aduanalesMultiple = entity.Servicios_aduanalesMultiple;
    this.dataListConfig.filterAdvanced.fromCosto_Servicios_ = entity.fromCosto_Servicios_;
    this.dataListConfig.filterAdvanced.toCosto_Servicios_ = entity.toCosto_Servicios_;
    this.dataListConfig.filterAdvanced.fromTipo_de_Cambio_Aduanales = entity.fromTipo_de_Cambio_Aduanales;
    this.dataListConfig.filterAdvanced.toTipo_de_Cambio_Aduanales = entity.toTipo_de_Cambio_Aduanales;
    this.dataListConfig.filterAdvanced.fromNo__Factura_SA = entity.fromNo__Factura_SA;
    this.dataListConfig.filterAdvanced.toNo__Factura_SA = entity.toNo__Factura_SA;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura_2 = entity.fromFecha_de_Factura_2;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura_2 = entity.toFecha_de_Factura_2;
    this.dataListConfig.filterAdvanced.fromImpuestos_Aduanales = entity.fromImpuestos_Aduanales;
    this.dataListConfig.filterAdvanced.toImpuestos_Aduanales = entity.toImpuestos_Aduanales;
    this.dataListConfig.filterAdvanced.fromCosto_Impuestos_ = entity.fromCosto_Impuestos_;
    this.dataListConfig.filterAdvanced.toCosto_Impuestos_ = entity.toCosto_Impuestos_;
    this.dataListConfig.filterAdvanced.fromTipo_de_Cambio_Imp_ = entity.fromTipo_de_Cambio_Imp_;
    this.dataListConfig.filterAdvanced.toTipo_de_Cambio_Imp_ = entity.toTipo_de_Cambio_Imp_;
	this.dataListConfig.filterAdvanced.Clave_de_PedimentoFilter = entity.Clave_de_PedimentoFilter;
	this.dataListConfig.filterAdvanced.Clave_de_Pedimento = entity.Clave_de_Pedimento;
    this.dataListConfig.filterAdvanced.fromNo__de_Pedimento = entity.fromNo__de_Pedimento;
    this.dataListConfig.filterAdvanced.toNo__de_Pedimento = entity.toNo__de_Pedimento;
    this.dataListConfig.filterAdvanced.fromNo__De_Guia = entity.fromNo__De_Guia;
    this.dataListConfig.filterAdvanced.toNo__De_Guia = entity.toNo__De_Guia;
	this.dataListConfig.filterAdvanced.AplicacionFilter = entity.AplicacionFilter;
	this.dataListConfig.filterAdvanced.Aplicacion = entity.Aplicacion;
	this.dataListConfig.filterAdvanced.FolioExportacionFilter = entity.FolioExportacionFilter;
	this.dataListConfig.filterAdvanced.FolioExportacion = entity.FolioExportacion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Gestion_de_Exportacion/list'], { state: { data: this.dataListConfig } });
  }
}
