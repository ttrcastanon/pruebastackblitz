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

import { Tipo_de_Miscelaneas } from 'src/app/models/Tipo_de_Miscelaneas';
import { Tipo_de_MiscelaneasService } from 'src/app/api-services/Tipo_de_Miscelaneas.service';
import { Tipo_de_Transporte } from 'src/app/models/Tipo_de_Transporte';
import { Tipo_de_TransporteService } from 'src/app/api-services/Tipo_de_Transporte.service';
import { Servicios_Aduanales } from 'src/app/models/Servicios_Aduanales';
import { Servicios_AduanalesService } from 'src/app/api-services/Servicios_Aduanales.service';
import { Gestion_de_Importacion } from 'src/app/models/Gestion_de_Importacion';
import { Gestion_de_ImportacionService } from 'src/app/api-services/Gestion_de_Importacion.service';


@Component({
  selector: 'app-show-advance-filter-Costos_de_Importacion',
  templateUrl: './show-advance-filter-Costos_de_Importacion.component.html',
  styleUrls: ['./show-advance-filter-Costos_de_Importacion.component.scss']
})
export class ShowAdvanceFilterCostos_de_ImportacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Miscelaneass: Tipo_de_Miscelaneas[] = [];
  public Transportes: Tipo_de_Transporte[] = [];
  public Servicios_Aduanaless: Servicios_Aduanales[] = [];
  public FolioGestionIportacions: Gestion_de_Importacion[] = [];

  public tipo_de_miscelaneass: Tipo_de_Miscelaneas;
  public tipo_de_transportes: Tipo_de_Transporte;
  public servicios_aduanaless: Servicios_Aduanales;
  public gestion_de_importacions: Gestion_de_Importacion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Miscelaneas",
      "No__items_asociados",
      "Transporte",
      "Costo_flete_",
      "Tipo_de_Cambio_T",
      "No__de_Factura_T",
      "Fecha_de_Factura_T",
      "Servicios_Aduanales",
      "Costo_Servicios_",
      "Tipo_de_Cambio_SA",
      "No__de_Factura_SA",
      "Fecha_de_Factura_SA",
      "Impuestos_Aduanales",
      "Costo_Impuesto_",
      "Tipo_de_Cambio_IA",
      "No__de_Factura_IA",
      "No__de_Factura_IA2",
      "Clave_de_Pedimento",
      "No__de_Pedimento",
      "No__de_Guia",
      "FolioGestionIportacion",
      "FolioCostosImportacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Miscelaneas_filtro",
      "No__items_asociados_filtro",
      "Transporte_filtro",
      "Costo_flete__filtro",
      "Tipo_de_Cambio_T_filtro",
      "No__de_Factura_T_filtro",
      "Fecha_de_Factura_T_filtro",
      "Servicios_Aduanales_filtro",
      "Costo_Servicios__filtro",
      "Tipo_de_Cambio_SA_filtro",
      "No__de_Factura_SA_filtro",
      "Fecha_de_Factura_SA_filtro",
      "Impuestos_Aduanales_filtro",
      "Costo_Impuesto__filtro",
      "Tipo_de_Cambio_IA_filtro",
      "No__de_Factura_IA_filtro",
      "No__de_Factura_IA2_filtro",
      "Clave_de_Pedimento_filtro",
      "No__de_Pedimento_filtro",
      "No__de_Guia_filtro",
      "FolioGestionIportacion_filtro",
      "FolioCostosImportacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Miscelaneas: "",
      No__items_asociados: "",
      Transporte: "",
      Costo_flete_: "",
      Tipo_de_Cambio_T: "",
      No__de_Factura_T: "",
      Fecha_de_Factura_T: null,
      Servicios_Aduanales: "",
      Costo_Servicios_: "",
      Tipo_de_Cambio_SA: "",
      No__de_Factura_SA: "",
      Fecha_de_Factura_SA: null,
      Impuestos_Aduanales: "",
      Costo_Impuesto_: "",
      Tipo_de_Cambio_IA: "",
      No__de_Factura_IA: "",
      No__de_Factura_IA2: null,
      Clave_de_Pedimento: "",
      No__de_Pedimento: "",
      No__de_Guia: "",
      FolioGestionIportacion: "",
      FolioCostosImportacion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MiscelaneasFilter: "",
      Miscelaneas: "",
      MiscelaneasMultiple: "",
      fromNo__items_asociados: "",
      toNo__items_asociados: "",
      TransporteFilter: "",
      Transporte: "",
      TransporteMultiple: "",
      fromCosto_flete_: "",
      toCosto_flete_: "",
      fromTipo_de_Cambio_T: "",
      toTipo_de_Cambio_T: "",
      fromFecha_de_Factura_T: "",
      toFecha_de_Factura_T: "",
      Servicios_AduanalesFilter: "",
      Servicios_Aduanales: "",
      Servicios_AduanalesMultiple: "",
      fromCosto_Servicios_: "",
      toCosto_Servicios_: "",
      fromTipo_de_Cambio_SA: "",
      toTipo_de_Cambio_SA: "",
      fromFecha_de_Factura_SA: "",
      toFecha_de_Factura_SA: "",
      fromCosto_Impuesto_: "",
      toCosto_Impuesto_: "",
      fromTipo_de_Cambio_IA: "",
      toTipo_de_Cambio_IA: "",
      fromNo__de_Factura_IA2: "",
      toNo__de_Factura_IA2: "",
      fromNo__de_Pedimento: "",
      toNo__de_Pedimento: "",
      fromNo__de_Guia: "",
      toNo__de_Guia: "",
      FolioGestionIportacionFilter: "",
      FolioGestionIportacion: "",
      FolioGestionIportacionMultiple: "",

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
    private tipo_de_miscelaneasService: Tipo_de_MiscelaneasService,
    private tipo_de_transporteService: Tipo_de_TransporteService,
    private servicios_aduanalesService: Servicios_AduanalesService,
    private gestion_de_importacionService: Gestion_de_ImportacionService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      MiscelaneasFilter: [''],
      Miscelaneas: [''],
      MiscelaneasMultiple: [''],
      fromNo__items_asociados: [''],
      toNo__items_asociados: [''],
      TransporteFilter: [''],
      Transporte: [''],
      TransporteMultiple: [''],
      fromCosto_flete_: [''],
      toCosto_flete_: [''],
      fromFecha_de_Factura_T: [''],
      toFecha_de_Factura_T: [''],
      Servicios_AduanalesFilter: [''],
      Servicios_Aduanales: [''],
      Servicios_AduanalesMultiple: [''],
      fromCosto_Servicios_: [''],
      toCosto_Servicios_: [''],
      fromFecha_de_Factura_SA: [''],
      toFecha_de_Factura_SA: [''],
      fromCosto_Impuesto_: [''],
      toCosto_Impuesto_: [''],
      fromNo__de_Factura_IA2: [''],
      toNo__de_Factura_IA2: [''],
      fromNo__de_Pedimento: [''],
      toNo__de_Pedimento: [''],
      fromNo__de_Guia: [''],
      toNo__de_Guia: [''],
      FolioGestionIportacionFilter: [''],
      FolioGestionIportacion: [''],
      FolioGestionIportacionMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Costos_de_Importacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipo_de_miscelaneasService.getAll());
    observablesArray.push(this.tipo_de_transporteService.getAll());
    observablesArray.push(this.servicios_aduanalesService.getAll());
    observablesArray.push(this.gestion_de_importacionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipo_de_miscelaneass ,tipo_de_transportes ,servicios_aduanaless ,gestion_de_importacions ]) => {
		  this.tipo_de_miscelaneass = tipo_de_miscelaneass;
		  this.tipo_de_transportes = tipo_de_transportes;
		  this.servicios_aduanaless = servicios_aduanaless;
		  this.gestion_de_importacions = gestion_de_importacions;
          

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
    this.dataListConfig.filterAdvanced.MiscelaneasFilter = entity.MiscelaneasFilter;
    this.dataListConfig.filterAdvanced.Miscelaneas = entity.Miscelaneas;
    this.dataListConfig.filterAdvanced.MiscelaneasMultiple = entity.MiscelaneasMultiple;
    this.dataListConfig.filterAdvanced.fromNo__items_asociados = entity.fromNo__items_asociados;
    this.dataListConfig.filterAdvanced.toNo__items_asociados = entity.toNo__items_asociados;
    this.dataListConfig.filterAdvanced.TransporteFilter = entity.TransporteFilter;
    this.dataListConfig.filterAdvanced.Transporte = entity.Transporte;
    this.dataListConfig.filterAdvanced.TransporteMultiple = entity.TransporteMultiple;
    this.dataListConfig.filterAdvanced.fromCosto_flete_ = entity.fromCosto_flete_;
    this.dataListConfig.filterAdvanced.toCosto_flete_ = entity.toCosto_flete_;
    this.dataListConfig.filterAdvanced.fromTipo_de_Cambio_T = entity.fromTipo_de_Cambio_T;
    this.dataListConfig.filterAdvanced.toTipo_de_Cambio_T = entity.toTipo_de_Cambio_T;
	this.dataListConfig.filterAdvanced.No__de_Factura_TFilter = entity.No__de_Factura_TFilter;
	this.dataListConfig.filterAdvanced.No__de_Factura_T = entity.No__de_Factura_T;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura_T = entity.fromFecha_de_Factura_T;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura_T = entity.toFecha_de_Factura_T;
    this.dataListConfig.filterAdvanced.Servicios_AduanalesFilter = entity.Servicios_AduanalesFilter;
    this.dataListConfig.filterAdvanced.Servicios_Aduanales = entity.Servicios_Aduanales;
    this.dataListConfig.filterAdvanced.Servicios_AduanalesMultiple = entity.Servicios_AduanalesMultiple;
    this.dataListConfig.filterAdvanced.fromCosto_Servicios_ = entity.fromCosto_Servicios_;
    this.dataListConfig.filterAdvanced.toCosto_Servicios_ = entity.toCosto_Servicios_;
    this.dataListConfig.filterAdvanced.fromTipo_de_Cambio_SA = entity.fromTipo_de_Cambio_SA;
    this.dataListConfig.filterAdvanced.toTipo_de_Cambio_SA = entity.toTipo_de_Cambio_SA;
	this.dataListConfig.filterAdvanced.No__de_Factura_SAFilter = entity.No__de_Factura_SAFilter;
	this.dataListConfig.filterAdvanced.No__de_Factura_SA = entity.No__de_Factura_SA;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura_SA = entity.fromFecha_de_Factura_SA;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura_SA = entity.toFecha_de_Factura_SA;
	this.dataListConfig.filterAdvanced.Impuestos_AduanalesFilter = entity.Impuestos_AduanalesFilter;
	this.dataListConfig.filterAdvanced.Impuestos_Aduanales = entity.Impuestos_Aduanales;
    this.dataListConfig.filterAdvanced.fromCosto_Impuesto_ = entity.fromCosto_Impuesto_;
    this.dataListConfig.filterAdvanced.toCosto_Impuesto_ = entity.toCosto_Impuesto_;
    this.dataListConfig.filterAdvanced.fromTipo_de_Cambio_IA = entity.fromTipo_de_Cambio_IA;
    this.dataListConfig.filterAdvanced.toTipo_de_Cambio_IA = entity.toTipo_de_Cambio_IA;
	this.dataListConfig.filterAdvanced.No__de_Factura_IAFilter = entity.No__de_Factura_IAFilter;
	this.dataListConfig.filterAdvanced.No__de_Factura_IA = entity.No__de_Factura_IA;
    this.dataListConfig.filterAdvanced.fromNo__de_Factura_IA2 = entity.fromNo__de_Factura_IA2;
    this.dataListConfig.filterAdvanced.toNo__de_Factura_IA2 = entity.toNo__de_Factura_IA2;
	this.dataListConfig.filterAdvanced.Clave_de_PedimentoFilter = entity.Clave_de_PedimentoFilter;
	this.dataListConfig.filterAdvanced.Clave_de_Pedimento = entity.Clave_de_Pedimento;
    this.dataListConfig.filterAdvanced.fromNo__de_Pedimento = entity.fromNo__de_Pedimento;
    this.dataListConfig.filterAdvanced.toNo__de_Pedimento = entity.toNo__de_Pedimento;
    this.dataListConfig.filterAdvanced.fromNo__de_Guia = entity.fromNo__de_Guia;
    this.dataListConfig.filterAdvanced.toNo__de_Guia = entity.toNo__de_Guia;
    this.dataListConfig.filterAdvanced.FolioGestionIportacionFilter = entity.FolioGestionIportacionFilter;
    this.dataListConfig.filterAdvanced.FolioGestionIportacion = entity.FolioGestionIportacion;
    this.dataListConfig.filterAdvanced.FolioGestionIportacionMultiple = entity.FolioGestionIportacionMultiple;
	this.dataListConfig.filterAdvanced.FolioCostosImportacionFilter = entity.FolioCostosImportacionFilter;
	this.dataListConfig.filterAdvanced.FolioCostosImportacion = entity.FolioCostosImportacion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Costos_de_Importacion/list'], { state: { data: this.dataListConfig } });
  }
}
