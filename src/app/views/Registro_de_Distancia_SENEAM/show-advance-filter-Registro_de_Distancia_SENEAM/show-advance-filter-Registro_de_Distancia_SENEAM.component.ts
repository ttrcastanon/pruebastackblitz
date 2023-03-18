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

import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';


@Component({
  selector: 'app-show-advance-filter-Registro_de_Distancia_SENEAM',
  templateUrl: './show-advance-filter-Registro_de_Distancia_SENEAM.component.html',
  styleUrls: ['./show-advance-filter-Registro_de_Distancia_SENEAM.component.scss']
})
export class ShowAdvanceFilterRegistro_de_Distancia_SENEAMComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Aeropuerto_Origens: Aeropuertos[] = [];
  public Aeropuerto_Destinos: Aeropuertos[] = [];

  public aeropuertoss: Aeropuertos;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Aeropuerto_Origen",
      "Aeropuerto_Destino",
      "Distancia_SENEAM_KM",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Aeropuerto_Origen_filtro",
      "Aeropuerto_Destino_filtro",
      "Distancia_SENEAM_KM_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Aeropuerto_Origen: "",
      Aeropuerto_Destino: "",
      Distancia_SENEAM_KM: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Aeropuerto_OrigenFilter: "",
      Aeropuerto_Origen: "",
      Aeropuerto_OrigenMultiple: "",
      Aeropuerto_DestinoFilter: "",
      Aeropuerto_Destino: "",
      Aeropuerto_DestinoMultiple: "",
      fromDistancia_SENEAM_KM: "",
      toDistancia_SENEAM_KM: "",

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
    private aeropuertosService: AeropuertosService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      Aeropuerto_OrigenFilter: [''],
      Aeropuerto_Origen: [''],
      Aeropuerto_OrigenMultiple: [''],
      Aeropuerto_DestinoFilter: [''],
      Aeropuerto_Destino: [''],
      Aeropuerto_DestinoMultiple: [''],
      fromDistancia_SENEAM_KM: [''],
      toDistancia_SENEAM_KM: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Registro_de_Distancia_SENEAM/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.aeropuertosService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,aeropuertoss ]) => {
		  this.aeropuertoss = aeropuertoss;
          

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
    this.dataListConfig.filterAdvanced.Aeropuerto_OrigenFilter = entity.Aeropuerto_OrigenFilter;
    this.dataListConfig.filterAdvanced.Aeropuerto_Origen = entity.Aeropuerto_Origen;
    this.dataListConfig.filterAdvanced.Aeropuerto_OrigenMultiple = entity.Aeropuerto_OrigenMultiple;
    this.dataListConfig.filterAdvanced.Aeropuerto_DestinoFilter = entity.Aeropuerto_DestinoFilter;
    this.dataListConfig.filterAdvanced.Aeropuerto_Destino = entity.Aeropuerto_Destino;
    this.dataListConfig.filterAdvanced.Aeropuerto_DestinoMultiple = entity.Aeropuerto_DestinoMultiple;
    this.dataListConfig.filterAdvanced.fromDistancia_SENEAM_KM = entity.fromDistancia_SENEAM_KM;
    this.dataListConfig.filterAdvanced.toDistancia_SENEAM_KM = entity.toDistancia_SENEAM_KM;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Registro_de_Distancia_SENEAM/list'], { state: { data: this.dataListConfig } });
  }
}
