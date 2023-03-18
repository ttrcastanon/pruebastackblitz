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

import { Tipo_de_Transporte } from 'src/app/models/Tipo_de_Transporte';
import { Tipo_de_TransporteService } from 'src/app/api-services/Tipo_de_Transporte.service';
import { Tipo_de_Miscelaneas } from 'src/app/models/Tipo_de_Miscelaneas';
import { Tipo_de_MiscelaneasService } from 'src/app/api-services/Tipo_de_Miscelaneas.service';
import { Servicios_Aduanales } from 'src/app/models/Servicios_Aduanales';
import { Servicios_AduanalesService } from 'src/app/api-services/Servicios_Aduanales.service';


@Component({
  selector: 'app-show-advance-filter-Gestion_de_Importacion',
  templateUrl: './show-advance-filter-Gestion_de_Importacion.component.html',
  styleUrls: ['./show-advance-filter-Gestion_de_Importacion.component.scss']
})
export class ShowAdvanceFilterGestion_de_ImportacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Transportes: Tipo_de_Transporte[] = [];
  public Miscelaneas: Tipo_de_Miscelaneas[] = [];
  public Servicio_Aduanaless: Servicios_Aduanales[] = [];

  public tipo_de_transportes: Tipo_de_Transporte;
  public tipo_de_miscelaneass: Tipo_de_Miscelaneas;
  public servicios_aduanaless: Servicios_Aduanales;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__Items_asociados",
      "Transporte",
      "Clave_de_Pedimento",
      "No__de_Pedimento",
      "Miscelanea",
      "No__de_Guia",
      "Servicio_Aduanales",
      "FolioGestiondeImportacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__Items_asociados_filtro",
      "Transporte_filtro",
      "Clave_de_Pedimento_filtro",
      "No__de_Pedimento_filtro",
      "Miscelanea_filtro",
      "No__de_Guia_filtro",
      "Servicio_Aduanales_filtro",
      "FolioGestiondeImportacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No__Items_asociados: "",
      Transporte: "",
      Clave_de_Pedimento: "",
      No__de_Pedimento: "",
      Miscelanea: "",
      No__de_Guia: "",
      Servicio_Aduanales: "",
      FolioGestiondeImportacion: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromNo__Items_asociados: "",
      toNo__Items_asociados: "",
      TransporteFilter: "",
      Transporte: "",
      TransporteMultiple: "",
      fromNo__de_Pedimento: "",
      toNo__de_Pedimento: "",
      MiscelaneaFilter: "",
      Miscelanea: "",
      MiscelaneaMultiple: "",
      fromNo__de_Guia: "",
      toNo__de_Guia: "",
      Servicio_AduanalesFilter: "",
      Servicio_Aduanales: "",
      Servicio_AduanalesMultiple: "",

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
    private tipo_de_transporteService: Tipo_de_TransporteService,
    private tipo_de_miscelaneasService: Tipo_de_MiscelaneasService,
    private servicios_aduanalesService: Servicios_AduanalesService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      fromNo__Items_asociados: [''],
      toNo__Items_asociados: [''],
      TransporteFilter: [''],
      Transporte: [''],
      TransporteMultiple: [''],
      fromNo__de_Pedimento: [''],
      toNo__de_Pedimento: [''],
      MiscelaneaFilter: [''],
      Miscelanea: [''],
      MiscelaneaMultiple: [''],
      fromNo__de_Guia: [''],
      toNo__de_Guia: [''],
      Servicio_AduanalesFilter: [''],
      Servicio_Aduanales: [''],
      Servicio_AduanalesMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Gestion_de_Importacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.tipo_de_transporteService.getAll());
    observablesArray.push(this.tipo_de_miscelaneasService.getAll());
    observablesArray.push(this.servicios_aduanalesService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,tipo_de_transportes ,tipo_de_miscelaneass ,servicios_aduanaless ]) => {
		  this.tipo_de_transportes = tipo_de_transportes;
		  this.tipo_de_miscelaneass = tipo_de_miscelaneass;
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
    this.dataListConfig.filterAdvanced.fromNo__Items_asociados = entity.fromNo__Items_asociados;
    this.dataListConfig.filterAdvanced.toNo__Items_asociados = entity.toNo__Items_asociados;
    this.dataListConfig.filterAdvanced.TransporteFilter = entity.TransporteFilter;
    this.dataListConfig.filterAdvanced.Transporte = entity.Transporte;
    this.dataListConfig.filterAdvanced.TransporteMultiple = entity.TransporteMultiple;
	this.dataListConfig.filterAdvanced.Clave_de_PedimentoFilter = entity.Clave_de_PedimentoFilter;
	this.dataListConfig.filterAdvanced.Clave_de_Pedimento = entity.Clave_de_Pedimento;
    this.dataListConfig.filterAdvanced.fromNo__de_Pedimento = entity.fromNo__de_Pedimento;
    this.dataListConfig.filterAdvanced.toNo__de_Pedimento = entity.toNo__de_Pedimento;
    this.dataListConfig.filterAdvanced.MiscelaneaFilter = entity.MiscelaneaFilter;
    this.dataListConfig.filterAdvanced.Miscelanea = entity.Miscelanea;
    this.dataListConfig.filterAdvanced.MiscelaneaMultiple = entity.MiscelaneaMultiple;
    this.dataListConfig.filterAdvanced.fromNo__de_Guia = entity.fromNo__de_Guia;
    this.dataListConfig.filterAdvanced.toNo__de_Guia = entity.toNo__de_Guia;
    this.dataListConfig.filterAdvanced.Servicio_AduanalesFilter = entity.Servicio_AduanalesFilter;
    this.dataListConfig.filterAdvanced.Servicio_Aduanales = entity.Servicio_Aduanales;
    this.dataListConfig.filterAdvanced.Servicio_AduanalesMultiple = entity.Servicio_AduanalesMultiple;
	this.dataListConfig.filterAdvanced.FolioGestiondeImportacionFilter = entity.FolioGestiondeImportacionFilter;
	this.dataListConfig.filterAdvanced.FolioGestiondeImportacion = entity.FolioGestiondeImportacion;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Gestion_de_Importacion/list'], { state: { data: this.dataListConfig } });
  }
}
