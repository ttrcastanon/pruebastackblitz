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

import { Categoria_de_Partes } from 'src/app/models/Categoria_de_Partes';
import { Categoria_de_PartesService } from 'src/app/api-services/Categoria_de_Partes.service';
import { Unidad } from 'src/app/models/Unidad';
import { UnidadService } from 'src/app/api-services/Unidad.service';
import { Estatus_de_Requerido } from 'src/app/models/Estatus_de_Requerido';
import { Estatus_de_RequeridoService } from 'src/app/api-services/Estatus_de_Requerido.service';
import { Condicion_del_item } from 'src/app/models/Condicion_del_item';
import { Condicion_del_itemService } from 'src/app/api-services/Condicion_del_item.service';


@Component({
  selector: 'app-show-advance-filter-Ingreso_a_almacen',
  templateUrl: './show-advance-filter-Ingreso_a_almacen.component.html',
  styleUrls: ['./show-advance-filter-Ingreso_a_almacen.component.scss']
})
export class ShowAdvanceFilterIngreso_a_almacenComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Categorias: Categoria_de_Partes[] = [];
  public Unidad_CSs: Unidad[] = [];
  public Unidad_CRs: Unidad[] = [];
  public Se_mantiene_el_No__de_Partes: Estatus_de_Requerido[] = [];
  public Condicions: Condicion_del_item[] = [];

  public categoria_de_partess: Categoria_de_Partes;
  public unidads: Unidad;
  public estatus_de_requeridos: Estatus_de_Requerido;
  public condicion_del_items: Condicion_del_item;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_parte___Descripcion",
      "Categoria",
      "Cant__Solicitada",
      "Unidad_CS",
      "Cant__Recibida",
      "Unidad_CR",
      "Costo_de_Material_",
      "No__de_Factura",
      "Costo_en_Factura_",
      "Tipo_de_Cambio",
      "Fecha_de_Factura",
      "Fecha_Estimada_de_llegada",
      "Fecha_Real_de_llegada",
      "Se_mantiene_el_No__de_Parte",
      "No__de_Serie",
      "No__de_Lote",
      "Horas_acumuladas",
      "Ciclos_acumulados",
      "Fecha_de_vencimiento",
      "Ubicacion_en_Almacen",
      "Linea_de_Almacen",
      "Ubicacion",
      "Condicion",
      "Fecha_de_Expiracion",
      "Control_de_Temperatura",
      "Identificacion_de_Herramienta",
      "No__Parte_Nuevo",
      "IdIngresoAlmacen",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_parte___Descripcion_filtro",
      "Categoria_filtro",
      "Cant__Solicitada_filtro",
      "Unidad_CS_filtro",
      "Cant__Recibida_filtro",
      "Unidad_CR_filtro",
      "Costo_de_Material__filtro",
      "No__de_Factura_filtro",
      "Costo_en_Factura__filtro",
      "Tipo_de_Cambio_filtro",
      "Fecha_de_Factura_filtro",
      "Fecha_Estimada_de_llegada_filtro",
      "Fecha_Real_de_llegada_filtro",
      "Se_mantiene_el_No__de_Parte_filtro",
      "No__de_Serie_filtro",
      "No__de_Lote_filtro",
      "Horas_acumuladas_filtro",
      "Ciclos_acumulados_filtro",
      "Fecha_de_vencimiento_filtro",
      "Ubicacion_en_Almacen_filtro",
      "Linea_de_Almacen_filtro",
      "Ubicacion_filtro",
      "Condicion_filtro",
      "Fecha_de_Expiracion_filtro",
      "Control_de_Temperatura_filtro",
      "Identificacion_de_Herramienta_filtro",
      "No__Parte_Nuevo_filtro",
      "IdIngresoAlmacen_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      No__de_parte___Descripcion: "",
      Categoria: "",
      Cant__Solicitada: "",
      Unidad_CS: "",
      Cant__Recibida: "",
      Unidad_CR: "",
      Costo_de_Material_: "",
      No__de_Factura: "",
      Costo_en_Factura_: "",
      Tipo_de_Cambio: "",
      Fecha_de_Factura: null,
      Fecha_Estimada_de_llegada: null,
      Fecha_Real_de_llegada: null,
      Se_mantiene_el_No__de_Parte: "",
      No__de_Serie: "",
      No__de_Lote: "",
      Horas_acumuladas: "",
      Ciclos_acumulados: "",
      Fecha_de_vencimiento: null,
      Ubicacion_en_Almacen: "",
      Linea_de_Almacen: "",
      Ubicacion: "",
      Condicion: "",
      Fecha_de_Expiracion: null,
      Control_de_Temperatura: "",
      Identificacion_de_Herramienta: "",
      No__Parte_Nuevo: "",
      IdIngresoAlmacen: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      CategoriaFilter: "",
      Categoria: "",
      CategoriaMultiple: "",
      fromCant__Solicitada: "",
      toCant__Solicitada: "",
      Unidad_CSFilter: "",
      Unidad_CS: "",
      Unidad_CSMultiple: "",
      fromCant__Recibida: "",
      toCant__Recibida: "",
      Unidad_CRFilter: "",
      Unidad_CR: "",
      Unidad_CRMultiple: "",
      fromCosto_de_Material_: "",
      toCosto_de_Material_: "",
      fromCosto_en_Factura_: "",
      toCosto_en_Factura_: "",
      fromTipo_de_Cambio: "",
      toTipo_de_Cambio: "",
      fromFecha_de_Factura: "",
      toFecha_de_Factura: "",
      fromFecha_Estimada_de_llegada: "",
      toFecha_Estimada_de_llegada: "",
      fromFecha_Real_de_llegada: "",
      toFecha_Real_de_llegada: "",
      Se_mantiene_el_No__de_ParteFilter: "",
      Se_mantiene_el_No__de_Parte: "",
      Se_mantiene_el_No__de_ParteMultiple: "",
      fromHoras_acumuladas: "",
      toHoras_acumuladas: "",
      fromCiclos_acumulados: "",
      toCiclos_acumulados: "",
      fromFecha_de_vencimiento: "",
      toFecha_de_vencimiento: "",
      CondicionFilter: "",
      Condicion: "",
      CondicionMultiple: "",
      fromFecha_de_Expiracion: "",
      toFecha_de_Expiracion: "",
      fromControl_de_Temperatura: "",
      toControl_de_Temperatura: "",

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
    private categoria_de_partesService: Categoria_de_PartesService,
    private unidadService: UnidadService,
    private estatus_de_requeridoService: Estatus_de_RequeridoService,
    private condicion_del_itemService: Condicion_del_itemService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      CategoriaFilter: [''],
      Categoria: [''],
      CategoriaMultiple: [''],
      fromCant__Solicitada: [''],
      toCant__Solicitada: [''],
      Unidad_CSFilter: [''],
      Unidad_CS: [''],
      Unidad_CSMultiple: [''],
      fromCant__Recibida: [''],
      toCant__Recibida: [''],
      Unidad_CRFilter: [''],
      Unidad_CR: [''],
      Unidad_CRMultiple: [''],
      fromCosto_de_Material_: [''],
      toCosto_de_Material_: [''],
      fromCosto_en_Factura_: [''],
      toCosto_en_Factura_: [''],
      fromFecha_de_Factura: [''],
      toFecha_de_Factura: [''],
      fromFecha_Estimada_de_llegada: [''],
      toFecha_Estimada_de_llegada: [''],
      fromFecha_Real_de_llegada: [''],
      toFecha_Real_de_llegada: [''],
      Se_mantiene_el_No__de_ParteFilter: [''],
      Se_mantiene_el_No__de_Parte: [''],
      Se_mantiene_el_No__de_ParteMultiple: [''],
      fromFecha_de_vencimiento: [''],
      toFecha_de_vencimiento: [''],
      CondicionFilter: [''],
      Condicion: [''],
      CondicionMultiple: [''],
      fromFecha_de_Expiracion: [''],
      toFecha_de_Expiracion: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Ingreso_a_almacen/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.categoria_de_partesService.getAll());
    observablesArray.push(this.unidadService.getAll());
    observablesArray.push(this.estatus_de_requeridoService.getAll());
    observablesArray.push(this.condicion_del_itemService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,categoria_de_partess ,unidads ,estatus_de_requeridos ,condicion_del_items ]) => {
		  this.categoria_de_partess = categoria_de_partess;
		  this.unidads = unidads;
		  this.estatus_de_requeridos = estatus_de_requeridos;
		  this.condicion_del_items = condicion_del_items;
          

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
	this.dataListConfig.filterAdvanced.No__de_parte___DescripcionFilter = entity.No__de_parte___DescripcionFilter;
	this.dataListConfig.filterAdvanced.No__de_parte___Descripcion = entity.No__de_parte___Descripcion;
    this.dataListConfig.filterAdvanced.CategoriaFilter = entity.CategoriaFilter;
    this.dataListConfig.filterAdvanced.Categoria = entity.Categoria;
    this.dataListConfig.filterAdvanced.CategoriaMultiple = entity.CategoriaMultiple;
    this.dataListConfig.filterAdvanced.fromCant__Solicitada = entity.fromCant__Solicitada;
    this.dataListConfig.filterAdvanced.toCant__Solicitada = entity.toCant__Solicitada;
    this.dataListConfig.filterAdvanced.Unidad_CSFilter = entity.Unidad_CSFilter;
    this.dataListConfig.filterAdvanced.Unidad_CS = entity.Unidad_CS;
    this.dataListConfig.filterAdvanced.Unidad_CSMultiple = entity.Unidad_CSMultiple;
    this.dataListConfig.filterAdvanced.fromCant__Recibida = entity.fromCant__Recibida;
    this.dataListConfig.filterAdvanced.toCant__Recibida = entity.toCant__Recibida;
    this.dataListConfig.filterAdvanced.Unidad_CRFilter = entity.Unidad_CRFilter;
    this.dataListConfig.filterAdvanced.Unidad_CR = entity.Unidad_CR;
    this.dataListConfig.filterAdvanced.Unidad_CRMultiple = entity.Unidad_CRMultiple;
    this.dataListConfig.filterAdvanced.fromCosto_de_Material_ = entity.fromCosto_de_Material_;
    this.dataListConfig.filterAdvanced.toCosto_de_Material_ = entity.toCosto_de_Material_;
	this.dataListConfig.filterAdvanced.No__de_FacturaFilter = entity.No__de_FacturaFilter;
	this.dataListConfig.filterAdvanced.No__de_Factura = entity.No__de_Factura;
    this.dataListConfig.filterAdvanced.fromCosto_en_Factura_ = entity.fromCosto_en_Factura_;
    this.dataListConfig.filterAdvanced.toCosto_en_Factura_ = entity.toCosto_en_Factura_;
    this.dataListConfig.filterAdvanced.fromTipo_de_Cambio = entity.fromTipo_de_Cambio;
    this.dataListConfig.filterAdvanced.toTipo_de_Cambio = entity.toTipo_de_Cambio;
    this.dataListConfig.filterAdvanced.fromFecha_de_Factura = entity.fromFecha_de_Factura;
    this.dataListConfig.filterAdvanced.toFecha_de_Factura = entity.toFecha_de_Factura;
    this.dataListConfig.filterAdvanced.fromFecha_Estimada_de_llegada = entity.fromFecha_Estimada_de_llegada;
    this.dataListConfig.filterAdvanced.toFecha_Estimada_de_llegada = entity.toFecha_Estimada_de_llegada;
    this.dataListConfig.filterAdvanced.fromFecha_Real_de_llegada = entity.fromFecha_Real_de_llegada;
    this.dataListConfig.filterAdvanced.toFecha_Real_de_llegada = entity.toFecha_Real_de_llegada;
    this.dataListConfig.filterAdvanced.Se_mantiene_el_No__de_ParteFilter = entity.Se_mantiene_el_No__de_ParteFilter;
    this.dataListConfig.filterAdvanced.Se_mantiene_el_No__de_Parte = entity.Se_mantiene_el_No__de_Parte;
    this.dataListConfig.filterAdvanced.Se_mantiene_el_No__de_ParteMultiple = entity.Se_mantiene_el_No__de_ParteMultiple;
	this.dataListConfig.filterAdvanced.No__de_SerieFilter = entity.No__de_SerieFilter;
	this.dataListConfig.filterAdvanced.No__de_Serie = entity.No__de_Serie;
	this.dataListConfig.filterAdvanced.No__de_LoteFilter = entity.No__de_LoteFilter;
	this.dataListConfig.filterAdvanced.No__de_Lote = entity.No__de_Lote;
    this.dataListConfig.filterAdvanced.fromHoras_acumuladas = entity.fromHoras_acumuladas;
    this.dataListConfig.filterAdvanced.toHoras_acumuladas = entity.toHoras_acumuladas;
    this.dataListConfig.filterAdvanced.fromCiclos_acumulados = entity.fromCiclos_acumulados;
    this.dataListConfig.filterAdvanced.toCiclos_acumulados = entity.toCiclos_acumulados;
    this.dataListConfig.filterAdvanced.fromFecha_de_vencimiento = entity.fromFecha_de_vencimiento;
    this.dataListConfig.filterAdvanced.toFecha_de_vencimiento = entity.toFecha_de_vencimiento;
	this.dataListConfig.filterAdvanced.Ubicacion_en_AlmacenFilter = entity.Ubicacion_en_AlmacenFilter;
	this.dataListConfig.filterAdvanced.Ubicacion_en_Almacen = entity.Ubicacion_en_Almacen;
	this.dataListConfig.filterAdvanced.Linea_de_AlmacenFilter = entity.Linea_de_AlmacenFilter;
	this.dataListConfig.filterAdvanced.Linea_de_Almacen = entity.Linea_de_Almacen;
	this.dataListConfig.filterAdvanced.UbicacionFilter = entity.UbicacionFilter;
	this.dataListConfig.filterAdvanced.Ubicacion = entity.Ubicacion;
    this.dataListConfig.filterAdvanced.CondicionFilter = entity.CondicionFilter;
    this.dataListConfig.filterAdvanced.Condicion = entity.Condicion;
    this.dataListConfig.filterAdvanced.CondicionMultiple = entity.CondicionMultiple;
    this.dataListConfig.filterAdvanced.fromFecha_de_Expiracion = entity.fromFecha_de_Expiracion;
    this.dataListConfig.filterAdvanced.toFecha_de_Expiracion = entity.toFecha_de_Expiracion;
    this.dataListConfig.filterAdvanced.fromControl_de_Temperatura = entity.fromControl_de_Temperatura;
    this.dataListConfig.filterAdvanced.toControl_de_Temperatura = entity.toControl_de_Temperatura;
	this.dataListConfig.filterAdvanced.Identificacion_de_HerramientaFilter = entity.Identificacion_de_HerramientaFilter;
	this.dataListConfig.filterAdvanced.Identificacion_de_Herramienta = entity.Identificacion_de_Herramienta;
	this.dataListConfig.filterAdvanced.No__Parte_NuevoFilter = entity.No__Parte_NuevoFilter;
	this.dataListConfig.filterAdvanced.No__Parte_Nuevo = entity.No__Parte_Nuevo;
	this.dataListConfig.filterAdvanced.IdIngresoAlmacenFilter = entity.IdIngresoAlmacenFilter;
	this.dataListConfig.filterAdvanced.IdIngresoAlmacen = entity.IdIngresoAlmacen;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Ingreso_a_almacen/list'], { state: { data: this.dataListConfig } });
  }
}
