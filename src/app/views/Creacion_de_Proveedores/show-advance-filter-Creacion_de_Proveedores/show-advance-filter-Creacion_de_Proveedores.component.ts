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

import { Estatus_de_Proveedor } from 'src/app/models/Estatus_de_Proveedor';
import { Estatus_de_ProveedorService } from 'src/app/api-services/Estatus_de_Proveedor.service';
import { Tipos_de_proveedor } from 'src/app/models/Tipos_de_proveedor';
import { Tipos_de_proveedorService } from 'src/app/api-services/Tipos_de_proveedor.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Clasificacion_de_proveedores } from 'src/app/models/Clasificacion_de_proveedores';
import { Clasificacion_de_proveedoresService } from 'src/app/api-services/Clasificacion_de_proveedores.service';


@Component({
  selector: 'app-show-advance-filter-Creacion_de_Proveedores',
  templateUrl: './show-advance-filter-Creacion_de_Proveedores.component.html',
  styleUrls: ['./show-advance-filter-Creacion_de_Proveedores.component.scss']
})
export class ShowAdvanceFilterCreacion_de_ProveedoresComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public Estatuss: Estatus_de_Proveedor[] = [];
  public Tipo_de_proveedors: Tipos_de_proveedor[] = [];
  public Se_realizo_auditorias: Respuesta[] = [];
  public Clasificacion_de_proveedors: Clasificacion_de_proveedores[] = [];

  public estatus_de_proveedors: Estatus_de_Proveedor;
  public tipos_de_proveedors: Tipos_de_proveedor;
  public respuestas: Respuesta;
  public clasificacion_de_proveedoress: Clasificacion_de_proveedores;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "ID_Dynamics",
      "Razon_social",
      "RFC",
      "Contacto",
      "Correo_electronico",
      "Direccion_fiscal",
      "Direccion_postal",
      "Telefono_de_contacto",
      "Estatus",
      "Tiempo_de_pagos_negociado",
      "Tipo_de_proveedor",
      "Se_realizo_auditoria",
      "Clasificacion_de_proveedor",
      "Cargar_acuerdo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "ID_Dynamics_filtro",
      "Razon_social_filtro",
      "RFC_filtro",
      "Contacto_filtro",
      "Correo_electronico_filtro",
      "Direccion_fiscal_filtro",
      "Direccion_postal_filtro",
      "Telefono_de_contacto_filtro",
      "Estatus_filtro",
      "Tiempo_de_pagos_negociado_filtro",
      "Tipo_de_proveedor_filtro",
      "Se_realizo_auditoria_filtro",
      "Clasificacion_de_proveedor_filtro",
      "Cargar_acuerdo_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      ID_Dynamics: "",
      Razon_social: "",
      RFC: "",
      Contacto: "",
      Correo_electronico: "",
      Direccion_fiscal: "",
      Direccion_postal: "",
      Telefono_de_contacto: "",
      Estatus: "",
      Tiempo_de_pagos_negociado: "",
      Tipo_de_proveedor: "",
      Se_realizo_auditoria: "",
      Clasificacion_de_proveedor: "",
      Cargar_acuerdo: "",

    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromTiempo_de_pagos_negociado: "",
      toTiempo_de_pagos_negociado: "",
      Tipo_de_proveedorFilter: "",
      Tipo_de_proveedor: "",
      Tipo_de_proveedorMultiple: "",
      Se_realizo_auditoriaFilter: "",
      Se_realizo_auditoria: "",
      Se_realizo_auditoriaMultiple: "",
      Clasificacion_de_proveedorFilter: "",
      Clasificacion_de_proveedor: "",
      Clasificacion_de_proveedorMultiple: "",

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
    private estatus_de_proveedorService: Estatus_de_ProveedorService,
    private tipos_de_proveedorService: Tipos_de_proveedorService,
    private respuestaService: RespuestaService,
    private clasificacion_de_proveedoresService: Clasificacion_de_proveedoresService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromClave: [''],
      toClave: [''],
      EstatusFilter: [''],
      Estatus: [''],
      EstatusMultiple: [''],
      fromTiempo_de_pagos_negociado: [''],
      toTiempo_de_pagos_negociado: [''],
      Tipo_de_proveedorFilter: [''],
      Tipo_de_proveedor: [''],
      Tipo_de_proveedorMultiple: [''],
      Se_realizo_auditoriaFilter: [''],
      Se_realizo_auditoria: [''],
      Se_realizo_auditoriaMultiple: [''],
      Clasificacion_de_proveedorFilter: [''],
      Clasificacion_de_proveedor: [''],
      Clasificacion_de_proveedorMultiple: [''],
      Cargar_acuerdoFilter: [''],
      Cargar_acuerdo_Completo: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Creacion_de_Proveedores/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.estatus_de_proveedorService.getAll());
    observablesArray.push(this.tipos_de_proveedorService.getAll());
    observablesArray.push(this.respuestaService.getAll());
    observablesArray.push(this.clasificacion_de_proveedoresService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,estatus_de_proveedors ,tipos_de_proveedors ,respuestas ,clasificacion_de_proveedoress ]) => {
		  this.estatus_de_proveedors = estatus_de_proveedors;
		  this.tipos_de_proveedors = tipos_de_proveedors;
		  this.respuestas = respuestas;
		  this.clasificacion_de_proveedoress = clasificacion_de_proveedoress;
          

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
    this.dataListConfig.filterAdvanced.fromClave = entity.fromClave;
    this.dataListConfig.filterAdvanced.toClave = entity.toClave;
	this.dataListConfig.filterAdvanced.ID_DynamicsFilter = entity.ID_DynamicsFilter;
	this.dataListConfig.filterAdvanced.ID_Dynamics = entity.ID_Dynamics;
	this.dataListConfig.filterAdvanced.Razon_socialFilter = entity.Razon_socialFilter;
	this.dataListConfig.filterAdvanced.Razon_social = entity.Razon_social;
	this.dataListConfig.filterAdvanced.RFCFilter = entity.RFCFilter;
	this.dataListConfig.filterAdvanced.RFC = entity.RFC;
	this.dataListConfig.filterAdvanced.ContactoFilter = entity.ContactoFilter;
	this.dataListConfig.filterAdvanced.Contacto = entity.Contacto;
	this.dataListConfig.filterAdvanced.Correo_electronicoFilter = entity.Correo_electronicoFilter;
	this.dataListConfig.filterAdvanced.Correo_electronico = entity.Correo_electronico;
	this.dataListConfig.filterAdvanced.Direccion_fiscalFilter = entity.Direccion_fiscalFilter;
	this.dataListConfig.filterAdvanced.Direccion_fiscal = entity.Direccion_fiscal;
	this.dataListConfig.filterAdvanced.Direccion_postalFilter = entity.Direccion_postalFilter;
	this.dataListConfig.filterAdvanced.Direccion_postal = entity.Direccion_postal;
	this.dataListConfig.filterAdvanced.Telefono_de_contactoFilter = entity.Telefono_de_contactoFilter;
	this.dataListConfig.filterAdvanced.Telefono_de_contacto = entity.Telefono_de_contacto;
    this.dataListConfig.filterAdvanced.EstatusFilter = entity.EstatusFilter;
    this.dataListConfig.filterAdvanced.Estatus = entity.Estatus;
    this.dataListConfig.filterAdvanced.EstatusMultiple = entity.EstatusMultiple;
    this.dataListConfig.filterAdvanced.fromTiempo_de_pagos_negociado = entity.fromTiempo_de_pagos_negociado;
    this.dataListConfig.filterAdvanced.toTiempo_de_pagos_negociado = entity.toTiempo_de_pagos_negociado;
    this.dataListConfig.filterAdvanced.Tipo_de_proveedorFilter = entity.Tipo_de_proveedorFilter;
    this.dataListConfig.filterAdvanced.Tipo_de_proveedor = entity.Tipo_de_proveedor;
    this.dataListConfig.filterAdvanced.Tipo_de_proveedorMultiple = entity.Tipo_de_proveedorMultiple;
    this.dataListConfig.filterAdvanced.Se_realizo_auditoriaFilter = entity.Se_realizo_auditoriaFilter;
    this.dataListConfig.filterAdvanced.Se_realizo_auditoria = entity.Se_realizo_auditoria;
    this.dataListConfig.filterAdvanced.Se_realizo_auditoriaMultiple = entity.Se_realizo_auditoriaMultiple;
    this.dataListConfig.filterAdvanced.Clasificacion_de_proveedorFilter = entity.Clasificacion_de_proveedorFilter;
    this.dataListConfig.filterAdvanced.Clasificacion_de_proveedor = entity.Clasificacion_de_proveedor;
    this.dataListConfig.filterAdvanced.Clasificacion_de_proveedorMultiple = entity.Clasificacion_de_proveedorMultiple;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Creacion_de_Proveedores/list'], { state: { data: this.dataListConfig } });
  }
}
