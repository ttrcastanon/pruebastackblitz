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
  selector: 'app-show-advance-filter-Ingreso_de_Costos_de_Servicios',
  templateUrl: './show-advance-filter-Ingreso_de_Costos_de_Servicios.component.html',
  styleUrls: ['./show-advance-filter-Ingreso_de_Costos_de_Servicios.component.scss']
})
export class ShowAdvanceFilterIngreso_de_Costos_de_ServiciosComponent implements OnInit, AfterViewInit {

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
      "Costo_",
      "No__de_Factura",
      "Fecha_de_Factura",
      "FolioIngresoCostosServ",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Costo__filtro",
      "No__de_Factura_filtro",
      "Fecha_de_Factura_filtro",
      "FolioIngresoCostosServ_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Costo_: "",
      No__de_Factura: "",
      Fecha_de_Factura: null,
      FolioIngresoCostosServ: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromCosto_: "",
      toCosto_: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",

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
      fromCosto_: [''],
      toCosto_: [''],
      fromFecha_de_Factura: [''],
      toFecha_de_Factura: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Ingreso_de_Costos_de_Servicios/list']);
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
    this.dataListConfig.filterAdvanced.fromCosto_ = entity.fromCosto_;
    this.dataListConfig.filterAdvanced.toCosto_ = entity.toCosto_;
	this.dataListConfig.filterAdvanced.No__de_FacturaFilter = entity.No__de_FacturaFilter;
	this.dataListConfig.filterAdvanced.No__de_Factura = entity.No__de_Factura;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura = entity.fromFecha_de_Factura;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura = entity.toFecha_de_Factura;
	this.dataListConfig.filterAdvanced.FolioIngresoCostosServFilter = entity.FolioIngresoCostosServFilter;
	this.dataListConfig.filterAdvanced.FolioIngresoCostosServ = entity.FolioIngresoCostosServ;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Ingreso_de_Costos_de_Servicios/list'], { state: { data: this.dataListConfig } });
  }
}
