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
  selector: 'app-show-advance-filter-Husos_de_horarios',
  templateUrl: './show-advance-filter-Husos_de_horarios.component.html',
  styleUrls: ['./show-advance-filter-Husos_de_horarios.component.scss']
})
export class ShowAdvanceFilterHusos_de_horariosComponent implements OnInit, AfterViewInit {

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
      "Ano",
      "Fecha_inicio_horario_verano",
      "Fecha_fin_horario_verano",
      "Diferencia_hora_verano",
      "Fecha_inicio_horario_invierno",
      "Fecha_fin_horario_invierno",
      "Diferencia_hora_invierno",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Ano_filtro",
      "Fecha_inicio_horario_verano_filtro",
      "Fecha_fin_horario_verano_filtro",
      "Diferencia_hora_verano_filtro",
      "Fecha_inicio_horario_invierno_filtro",
      "Fecha_fin_horario_invierno_filtro",
      "Diferencia_hora_invierno_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Ano: "",
      Fecha_inicio_horario_verano: null,
      Fecha_fin_horario_verano: null,
      Diferencia_hora_verano: "",
      Fecha_inicio_horario_invierno: null,
      Fecha_fin_horario_invierno: null,
      Diferencia_hora_invierno: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromAno: "",
      toAno: "",
      fromFecha_inicio_horario_verano: "",
      toFecha_inicio_horario_verano: "",
      fromFecha_fin_horario_verano: "",
      toFecha_fin_horario_verano: "",
      fromDiferencia_hora_verano: "",
      toDiferencia_hora_verano: "",
      fromFecha_inicio_horario_invierno: "",
      toFecha_inicio_horario_invierno: "",
      fromFecha_fin_horario_invierno: "",
      toFecha_fin_horario_invierno: "",
      fromDiferencia_hora_invierno: "",
      toDiferencia_hora_invierno: "",

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
      fromAno: [''],
      toAno: [''],
      fromFecha_inicio_horario_verano: [''],
      toFecha_inicio_horario_verano: [''],
      fromFecha_fin_horario_verano: [''],
      toFecha_fin_horario_verano: [''],
      fromDiferencia_hora_verano: [''],
      toDiferencia_hora_verano: [''],
      fromFecha_inicio_horario_invierno: [''],
      toFecha_inicio_horario_invierno: [''],
      fromFecha_fin_horario_invierno: [''],
      toFecha_fin_horario_invierno: [''],
      fromDiferencia_hora_invierno: [''],
      toDiferencia_hora_invierno: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Husos_de_horarios/list']);
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
    this.dataListConfig.filterAdvanced.fromAno = entity.fromAno;
    this.dataListConfig.filterAdvanced.toAno = entity.toAno;
    this.dataListConfig.filterAdvanced.fromFecha_inicio_horario_verano = entity.fromFecha_inicio_horario_verano;
    this.dataListConfig.filterAdvanced.toFecha_inicio_horario_verano = entity.toFecha_inicio_horario_verano;
    this.dataListConfig.filterAdvanced.fromFecha_fin_horario_verano = entity.fromFecha_fin_horario_verano;
    this.dataListConfig.filterAdvanced.toFecha_fin_horario_verano = entity.toFecha_fin_horario_verano;
    this.dataListConfig.filterAdvanced.fromDiferencia_hora_verano = entity.fromDiferencia_hora_verano;
    this.dataListConfig.filterAdvanced.toDiferencia_hora_verano = entity.toDiferencia_hora_verano;
    this.dataListConfig.filterAdvanced.fromFecha_inicio_horario_invierno = entity.fromFecha_inicio_horario_invierno;
    this.dataListConfig.filterAdvanced.toFecha_inicio_horario_invierno = entity.toFecha_inicio_horario_invierno;
    this.dataListConfig.filterAdvanced.fromFecha_fin_horario_invierno = entity.fromFecha_fin_horario_invierno;
    this.dataListConfig.filterAdvanced.toFecha_fin_horario_invierno = entity.toFecha_fin_horario_invierno;
    this.dataListConfig.filterAdvanced.fromDiferencia_hora_invierno = entity.fromDiferencia_hora_invierno;
    this.dataListConfig.filterAdvanced.toDiferencia_hora_invierno = entity.toDiferencia_hora_invierno;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Husos_de_horarios/list'], { state: { data: this.dataListConfig } });
  }
}
