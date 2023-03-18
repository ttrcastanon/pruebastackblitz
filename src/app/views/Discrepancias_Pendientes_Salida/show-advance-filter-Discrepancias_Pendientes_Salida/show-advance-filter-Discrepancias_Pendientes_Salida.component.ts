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

import { Items } from 'src/app/models/Items';
import { ItemsService } from 'src/app/api-services/Items.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Catalogo_codigo_ATA } from 'src/app/models/Catalogo_codigo_ATA';
import { Catalogo_codigo_ATAService } from 'src/app/api-services/Catalogo_codigo_ATA.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';


@Component({
  selector: 'app-show-advance-filter-Discrepancias_Pendientes_Salida',
  templateUrl: './show-advance-filter-Discrepancias_Pendientes_Salida.component.html',
  styleUrls: ['./show-advance-filter-Discrepancias_Pendientes_Salida.component.scss']
})
export class ShowAdvanceFilterDiscrepancias_Pendientes_SalidaComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Items: Items[] = [];
  public Codigo_Computarizados: Codigo_Computarizado[] = [];
  public Codigo_ATAs: Catalogo_codigo_ATA[] = [];
  public Asignado_as: Spartan_User[] = [];

  public itemss: Items;
  public codigo_computarizados: Codigo_Computarizado;
  public catalogo_codigo_atas: Catalogo_codigo_ATA;
  public spartan_users: Spartan_User;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Item",
      "Id_Reporte",
      "Codigo_Computarizado",
      "Codigo_ATA",
      "Respuesta",
      "Asignado_a",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Item_filtro",
      "Id_Reporte_filtro",
      "Codigo_Computarizado_filtro",
      "Codigo_ATA_filtro",
      "Respuesta_filtro",
      "Asignado_a_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Item: "",
      Id_Reporte: "",
      Codigo_Computarizado: "",
      Codigo_ATA: "",
      Respuesta: "",
      Asignado_a: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ItemFilter: "",
      Item: "",
      ItemMultiple: "",
      fromId_Reporte: "",
      toId_Reporte: "",
      Codigo_ComputarizadoFilter: "",
      Codigo_Computarizado: "",
      Codigo_ComputarizadoMultiple: "",
      Codigo_ATAFilter: "",
      Codigo_ATA: "",
      Codigo_ATAMultiple: "",
      Asignado_aFilter: "",
      Asignado_a: "",
      Asignado_aMultiple: "",

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
    private itemsService: ItemsService,
    private codigo_computarizadoService: Codigo_ComputarizadoService,
    private catalogo_codigo_ataService: Catalogo_codigo_ATAService,
    private spartan_userService: Spartan_UserService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      ItemFilter: [''],
      Item: [''],
      ItemMultiple: [''],
      fromId_Reporte: [''],
      toId_Reporte: [''],
      Codigo_ComputarizadoFilter: [''],
      Codigo_Computarizado: [''],
      Codigo_ComputarizadoMultiple: [''],
      Codigo_ATAFilter: [''],
      Codigo_ATA: [''],
      Codigo_ATAMultiple: [''],
      Asignado_aFilter: [''],
      Asignado_a: [''],
      Asignado_aMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Discrepancias_Pendientes_Salida/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.itemsService.getAll());
    observablesArray.push(this.codigo_computarizadoService.getAll());
    observablesArray.push(this.catalogo_codigo_ataService.getAll());
    observablesArray.push(this.spartan_userService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,itemss ,codigo_computarizados ,catalogo_codigo_atas ,spartan_users ]) => {
		  this.itemss = itemss;
		  this.codigo_computarizados = codigo_computarizados;
		  this.catalogo_codigo_atas = catalogo_codigo_atas;
		  this.spartan_users = spartan_users;
          

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
    this.dataListConfig.filterAdvanced.ItemFilter = entity.ItemFilter;
    this.dataListConfig.filterAdvanced.Item = entity.Item;
    this.dataListConfig.filterAdvanced.ItemMultiple = entity.ItemMultiple;
    this.dataListConfig.filterAdvanced.fromId_Reporte = entity.fromId_Reporte;
    this.dataListConfig.filterAdvanced.toId_Reporte = entity.toId_Reporte;
    this.dataListConfig.filterAdvanced.Codigo_ComputarizadoFilter = entity.Codigo_ComputarizadoFilter;
    this.dataListConfig.filterAdvanced.Codigo_Computarizado = entity.Codigo_Computarizado;
    this.dataListConfig.filterAdvanced.Codigo_ComputarizadoMultiple = entity.Codigo_ComputarizadoMultiple;
    this.dataListConfig.filterAdvanced.Codigo_ATAFilter = entity.Codigo_ATAFilter;
    this.dataListConfig.filterAdvanced.Codigo_ATA = entity.Codigo_ATA;
    this.dataListConfig.filterAdvanced.Codigo_ATAMultiple = entity.Codigo_ATAMultiple;
	this.dataListConfig.filterAdvanced.RespuestaFilter = entity.RespuestaFilter;
	this.dataListConfig.filterAdvanced.Respuesta = entity.Respuesta;
    this.dataListConfig.filterAdvanced.Asignado_aFilter = entity.Asignado_aFilter;
    this.dataListConfig.filterAdvanced.Asignado_a = entity.Asignado_a;
    this.dataListConfig.filterAdvanced.Asignado_aMultiple = entity.Asignado_aMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Discrepancias_Pendientes_Salida/list'], { state: { data: this.dataListConfig } });
  }
}
