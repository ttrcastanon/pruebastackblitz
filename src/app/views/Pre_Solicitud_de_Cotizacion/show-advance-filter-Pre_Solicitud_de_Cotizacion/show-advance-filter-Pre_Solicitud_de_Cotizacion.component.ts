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

import { Solicitud_de_cotizacion } from 'src/app/models/Solicitud_de_cotizacion';
import { Solicitud_de_cotizacionService } from 'src/app/api-services/Solicitud_de_cotizacion.service';


@Component({
  selector: 'app-show-advance-filter-Pre_Solicitud_de_Cotizacion',
  templateUrl: './show-advance-filter-Pre_Solicitud_de_Cotizacion.component.html',
  styleUrls: ['./show-advance-filter-Pre_Solicitud_de_Cotizacion.component.scss']
})
export class ShowAdvanceFilterPre_Solicitud_de_CotizacionComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Folio_Solicitud_Cotizacions: Solicitud_de_cotizacion[] = [];

  public solicitud_de_cotizacions: Solicitud_de_cotizacion;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_Solicitud_Cotizacion",
      "Folio_Proveedor",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_Solicitud_Cotizacion_filtro",
      "Folio_Proveedor_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Folio_Solicitud_Cotizacion: "",
      Folio_Proveedor: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Folio_Solicitud_CotizacionFilter: "",
      Folio_Solicitud_Cotizacion: "",
      Folio_Solicitud_CotizacionMultiple: "",
      fromFolio_Proveedor: "",
      toFolio_Proveedor: "",

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
    private solicitud_de_cotizacionService: Solicitud_de_cotizacionService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Folio_Solicitud_CotizacionFilter: [''],
      Folio_Solicitud_Cotizacion: [''],
      Folio_Solicitud_CotizacionMultiple: [''],
      fromFolio_Proveedor: [''],
      toFolio_Proveedor: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Pre_Solicitud_de_Cotizacion/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.solicitud_de_cotizacionService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,solicitud_de_cotizacions ]) => {
		  this.solicitud_de_cotizacions = solicitud_de_cotizacions;
          

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
    this.dataListConfig.filterAdvanced.Folio_Solicitud_CotizacionFilter = entity.Folio_Solicitud_CotizacionFilter;
    this.dataListConfig.filterAdvanced.Folio_Solicitud_Cotizacion = entity.Folio_Solicitud_Cotizacion;
    this.dataListConfig.filterAdvanced.Folio_Solicitud_CotizacionMultiple = entity.Folio_Solicitud_CotizacionMultiple;
    this.dataListConfig.filterAdvanced.fromFolio_Proveedor = entity.fromFolio_Proveedor;
    this.dataListConfig.filterAdvanced.toFolio_Proveedor = entity.toFolio_Proveedor;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Pre_Solicitud_de_Cotizacion/list'], { state: { data: this.dataListConfig } });
  }
}
