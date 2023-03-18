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

import { Folios_Generacion_OC } from 'src/app/models/Folios_Generacion_OC';
import { Folios_Generacion_OCService } from 'src/app/api-services/Folios_Generacion_OC.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Creacion_de_Proveedores } from 'src/app/models/Creacion_de_Proveedores';
import { Creacion_de_ProveedoresService } from 'src/app/api-services/Creacion_de_Proveedores.service';
import { Moneda } from 'src/app/models/Moneda';
import { MonedaService } from 'src/app/api-services/Moneda.service';
import { Estatus_de_Seguimiento } from 'src/app/models/Estatus_de_Seguimiento';
import { Estatus_de_SeguimientoService } from 'src/app/api-services/Estatus_de_Seguimiento.service';
import { Tipo_de_Transporte } from 'src/app/models/Tipo_de_Transporte';
import { Tipo_de_TransporteService } from 'src/app/api-services/Tipo_de_Transporte.service';


@Component({
  selector: 'app-show-advance-filter-Generacion_de_Orden_de_Compras',
  templateUrl: './show-advance-filter-Generacion_de_Orden_de_Compras.component.html',
  styleUrls: ['./show-advance-filter-Generacion_de_Orden_de_Compras.component.scss']
})
export class ShowAdvanceFilterGeneracion_de_Orden_de_ComprasComponent implements OnInit, AfterViewInit {

  // Form 1
  advancefilter: FormGroup;
  hide = true;
  agree = false;
  customForm: FormGroup;
  public filter: Filter[] = [];
  public FolioCorreos: Folios_Generacion_OC[] = [];
  public Usuario_que_Registras: Spartan_User[] = [];
  public Proveedors: Creacion_de_Proveedores[] = [];
  public RFCs: Creacion_de_Proveedores[] = [];
  public Vendedors: Creacion_de_Proveedores[] = [];
  public Direccions: Creacion_de_Proveedores[] = [];
  public Telefono_del_Contactos: Creacion_de_Proveedores[] = [];
  public Emails: Creacion_de_Proveedores[] = [];
  public Monedas: Moneda[] = [];
  public Estatus_OCs: Estatus_de_Seguimiento[] = [];
  public Transportes: Tipo_de_Transporte[] = [];

  public folios_generacion_ocs: Folios_Generacion_OC;
  public spartan_users: Spartan_User;
  public creacion_de_proveedoress: Creacion_de_Proveedores;
  public monedas: Moneda;
  public estatus_de_seguimientos: Estatus_de_Seguimiento;
  public tipo_de_transportes: Tipo_de_Transporte;

  private dataListConfig: any = null;
  public isLoading = false;

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "FolioCorreo",
      "Fecha_de_Registro",
      "Hora_de_Registro",
      "Usuario_que_Registra",
      "Proveedor",
      "RFC",
      "Vendedor",
      "Direccion",
      "Telefono_del_Contacto",
      "Email",
      "Subtotal",
      "Total",
      "Moneda",
      "Mensaje_de_correo",
      "Comentarios_Adicionales",
      "Estatus_OC",
      "Tipo_de_Envio",
      "Transporte",
      "FolioGeneracionOC",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "FolioCorreo_filtro",
      "Fecha_de_Registro_filtro",
      "Hora_de_Registro_filtro",
      "Usuario_que_Registra_filtro",
      "Proveedor_filtro",
      "RFC_filtro",
      "Vendedor_filtro",
      "Direccion_filtro",
      "Telefono_del_Contacto_filtro",
      "Email_filtro",
      "Subtotal_filtro",
      "Total_filtro",
      "Moneda_filtro",
      "Mensaje_de_correo_filtro",
      "Comentarios_Adicionales_filtro",
      "Estatus_OC_filtro",
      "Tipo_de_Envio_filtro",
      "Transporte_filtro",
      "FolioGeneracionOC_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      FolioCorreo: "",
      Fecha_de_Registro: "",
      Hora_de_Registro: "",
      Usuario_que_Registra: "",
      Proveedor: "",
      RFC: "",
      Vendedor: "",
      Direccion: "",
      Telefono_del_Contacto: "",
      Email: "",
      Subtotal: "",
      Total: "",
      Moneda: "",
      Mensaje_de_correo: "",
      Comentarios_Adicionales: "",
      Estatus_OC: "",
      Tipo_de_Envio: "",
      Transporte: "",
      FolioGeneracionOC: "",

    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      FolioCorreoFilter: "",
      FolioCorreo: "",
      FolioCorreoMultiple: "",
      fromHora_de_Registro: "",
      toHora_de_Registro: "",
      Usuario_que_RegistraFilter: "",
      Usuario_que_Registra: "",
      Usuario_que_RegistraMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      RFCFilter: "",
      RFC: "",
      RFCMultiple: "",
      VendedorFilter: "",
      Vendedor: "",
      VendedorMultiple: "",
      DireccionFilter: "",
      Direccion: "",
      DireccionMultiple: "",
      Telefono_del_ContactoFilter: "",
      Telefono_del_Contacto: "",
      Telefono_del_ContactoMultiple: "",
      EmailFilter: "",
      Email: "",
      EmailMultiple: "",
      fromSubtotal: "",
      toSubtotal: "",
      fromTotal: "",
      toTotal: "",
      MonedaFilter: "",
      Moneda: "",
      MonedaMultiple: "",
      Estatus_OCFilter: "",
      Estatus_OC: "",
      Estatus_OCMultiple: "",
      TransporteFilter: "",
      Transporte: "",
      TransporteMultiple: "",

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
    private folios_generacion_ocService: Folios_Generacion_OCService,
    private spartan_userService: Spartan_UserService,
    private creacion_de_proveedoresService: Creacion_de_ProveedoresService,
    private monedaService: MonedaService,
    private estatus_de_seguimientoService: Estatus_de_SeguimientoService,
    private tipo_de_transporteService: Tipo_de_TransporteService,

    private spinner: NgxSpinnerService,
    private fb: FormBuilder,
    private router: Router) {

    this.advancefilter = this.fb.group({
      fromFolio: [''],
      toFolio: [''],
      FolioCorreoFilter: [''],
      FolioCorreo: [''],
      FolioCorreoMultiple: [''],
      fromHora_de_Registro: [''],
      toHora_de_Registro: [''],
      Usuario_que_RegistraFilter: [''],
      Usuario_que_Registra: [''],
      Usuario_que_RegistraMultiple: [''],
      ProveedorFilter: [''],
      Proveedor: [''],
      ProveedorMultiple: [''],
      RFCFilter: [''],
      RFC: [''],
      RFCMultiple: [''],
      VendedorFilter: [''],
      Vendedor: [''],
      VendedorMultiple: [''],
      DireccionFilter: [''],
      Direccion: [''],
      DireccionMultiple: [''],
      Telefono_del_ContactoFilter: [''],
      Telefono_del_Contacto: [''],
      Telefono_del_ContactoMultiple: [''],
      EmailFilter: [''],
      Email: [''],
      EmailMultiple: [''],
      fromSubtotal: [''],
      toSubtotal: [''],
      fromTotal: [''],
      toTotal: [''],
      MonedaFilter: [''],
      Moneda: [''],
      MonedaMultiple: [''],
      Estatus_OCFilter: [''],
      Estatus_OC: [''],
      Estatus_OCMultiple: [''],
      TransporteFilter: [''],
      Transporte: [''],
      TransporteMultiple: [''],

    });

  }
  onadvancefilter() {
    console.log('Form Value', this.advancefilter.value);
  }

  goToList() {
    this.router.navigate(['Generacion_de_Orden_de_Compras/list']);
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.folios_generacion_ocService.getAll());
    observablesArray.push(this.spartan_userService.getAll());
    observablesArray.push(this.creacion_de_proveedoresService.getAll());
    observablesArray.push(this.monedaService.getAll());
    observablesArray.push(this.estatus_de_seguimientoService.getAll());
    observablesArray.push(this.tipo_de_transporteService.getAll());



    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([inicio ,folios_generacion_ocs ,spartan_users ,creacion_de_proveedoress ,monedas ,estatus_de_seguimientos ,tipo_de_transportes ]) => {
		  this.folios_generacion_ocs = folios_generacion_ocs;
		  this.spartan_users = spartan_users;
		  this.creacion_de_proveedoress = creacion_de_proveedoress;
		  this.monedas = monedas;
		  this.estatus_de_seguimientos = estatus_de_seguimientos;
		  this.tipo_de_transportes = tipo_de_transportes;
          

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
    this.dataListConfig.filterAdvanced.FolioCorreoFilter = entity.FolioCorreoFilter;
    this.dataListConfig.filterAdvanced.FolioCorreo = entity.FolioCorreo;
    this.dataListConfig.filterAdvanced.FolioCorreoMultiple = entity.FolioCorreoMultiple;
	this.dataListConfig.filterAdvanced.Fecha_de_RegistroFilter = entity.Fecha_de_RegistroFilter;
	this.dataListConfig.filterAdvanced.Fecha_de_Registro = entity.Fecha_de_Registro;
	this.dataListConfig.filterAdvanced.Hora_de_RegistroFilter = entity.Hora_de_RegistroFilter;
	this.dataListConfig.filterAdvanced.Hora_de_Registro = entity.Hora_de_Registro;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraFilter = entity.Usuario_que_RegistraFilter;
    this.dataListConfig.filterAdvanced.Usuario_que_Registra = entity.Usuario_que_Registra;
    this.dataListConfig.filterAdvanced.Usuario_que_RegistraMultiple = entity.Usuario_que_RegistraMultiple;
    this.dataListConfig.filterAdvanced.ProveedorFilter = entity.ProveedorFilter;
    this.dataListConfig.filterAdvanced.Proveedor = entity.Proveedor;
    this.dataListConfig.filterAdvanced.ProveedorMultiple = entity.ProveedorMultiple;
    this.dataListConfig.filterAdvanced.RFCFilter = entity.RFCFilter;
    this.dataListConfig.filterAdvanced.RFC = entity.RFC;
    this.dataListConfig.filterAdvanced.RFCMultiple = entity.RFCMultiple;
    this.dataListConfig.filterAdvanced.VendedorFilter = entity.VendedorFilter;
    this.dataListConfig.filterAdvanced.Vendedor = entity.Vendedor;
    this.dataListConfig.filterAdvanced.VendedorMultiple = entity.VendedorMultiple;
    this.dataListConfig.filterAdvanced.DireccionFilter = entity.DireccionFilter;
    this.dataListConfig.filterAdvanced.Direccion = entity.Direccion;
    this.dataListConfig.filterAdvanced.DireccionMultiple = entity.DireccionMultiple;
    this.dataListConfig.filterAdvanced.Telefono_del_ContactoFilter = entity.Telefono_del_ContactoFilter;
    this.dataListConfig.filterAdvanced.Telefono_del_Contacto = entity.Telefono_del_Contacto;
    this.dataListConfig.filterAdvanced.Telefono_del_ContactoMultiple = entity.Telefono_del_ContactoMultiple;
    this.dataListConfig.filterAdvanced.EmailFilter = entity.EmailFilter;
    this.dataListConfig.filterAdvanced.Email = entity.Email;
    this.dataListConfig.filterAdvanced.EmailMultiple = entity.EmailMultiple;
    this.dataListConfig.filterAdvanced.fromSubtotal = entity.fromSubtotal;
    this.dataListConfig.filterAdvanced.toSubtotal = entity.toSubtotal;
    this.dataListConfig.filterAdvanced.fromTotal = entity.fromTotal;
    this.dataListConfig.filterAdvanced.toTotal = entity.toTotal;
    this.dataListConfig.filterAdvanced.MonedaFilter = entity.MonedaFilter;
    this.dataListConfig.filterAdvanced.Moneda = entity.Moneda;
    this.dataListConfig.filterAdvanced.MonedaMultiple = entity.MonedaMultiple;
	this.dataListConfig.filterAdvanced.Mensaje_de_correoFilter = entity.Mensaje_de_correoFilter;
	this.dataListConfig.filterAdvanced.Mensaje_de_correo = entity.Mensaje_de_correo;
	this.dataListConfig.filterAdvanced.Comentarios_AdicionalesFilter = entity.Comentarios_AdicionalesFilter;
	this.dataListConfig.filterAdvanced.Comentarios_Adicionales = entity.Comentarios_Adicionales;
    this.dataListConfig.filterAdvanced.Estatus_OCFilter = entity.Estatus_OCFilter;
    this.dataListConfig.filterAdvanced.Estatus_OC = entity.Estatus_OC;
    this.dataListConfig.filterAdvanced.Estatus_OCMultiple = entity.Estatus_OCMultiple;
	this.dataListConfig.filterAdvanced.Tipo_de_EnvioFilter = entity.Tipo_de_EnvioFilter;
	this.dataListConfig.filterAdvanced.Tipo_de_Envio = entity.Tipo_de_Envio;
    this.dataListConfig.filterAdvanced.TransporteFilter = entity.TransporteFilter;
    this.dataListConfig.filterAdvanced.Transporte = entity.Transporte;
    this.dataListConfig.filterAdvanced.TransporteMultiple = entity.TransporteMultiple;
	this.dataListConfig.filterAdvanced.FolioGeneracionOCFilter = entity.FolioGeneracionOCFilter;
	this.dataListConfig.filterAdvanced.FolioGeneracionOC = entity.FolioGeneracionOC;

	
    this.isLoading = false;
    this.spinner.hide('loading');
    /**
     * TODO: Se cambia la ruta de la ubicación
     */
    this.router.navigate(['Generacion_de_Orden_de_Compras/list'], { state: { data: this.dataListConfig } });
  }
}
