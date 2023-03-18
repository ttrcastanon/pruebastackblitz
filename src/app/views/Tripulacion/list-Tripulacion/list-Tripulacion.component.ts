import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { TripulacionService } from "src/app/api-services/Tripulacion.service";
import { Tripulacion } from "src/app/models/Tripulacion";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild,Renderer2 } from "@angular/core";
import { CollectionViewer } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of, throwError } from 'rxjs';
import { catchError, finalize, concatMap, switchMap, mergeMap, tap } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import * as AppConstants from "../../../app-constants";
import { StorageKeys } from "../../../app-constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { TripulacionIndexRules } from 'src/app/shared/businessRules/Tripulacion-index-rules';
import { DialogConfirmExportComponent } from "./../../../shared/views/dialogs/dialog-confirm-export/dialog-confirm-export.component";
import { Enumerations } from 'src/app/models/enumerations';
import _, { map } from 'underscore';
import { ExcelService } from "src/app/api-services/excel.service";
import * as momentJS from 'moment';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { DialogPrintFormatComponent } from './../../../shared/views/dialogs/dialog-print-format/dialog-print-format.component';
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { Router } from '@angular/router';
import { SpartanService } from 'src/app/api-services/spartan.service';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: "app-list-Tripulacion",
  templateUrl: "./list-Tripulacion.component.html",
  styleUrls: ["./list-Tripulacion.component.scss"],
})
export class ListTripulacionComponent extends TripulacionIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Clave",
    "Nombres",
    "Apellido_paterno",
    "Apellido_materno",
    "Nombre_completo",
    "Direccion",
    "Telefono",
    "Celular",
    "Correo_electronico",
    "Fecha_de_nacimiento",
    "Edad",
    "Nacionalidad_1",
    "Nacionalidad_2",
    "Genero",
    "Tipo_de_Tripulante",
    "Pertenece_al_grupo",
    "Estatus",
    "Usuario_Relacionado",
    "Numero_de_Licencia",
    "Fecha_de_Emision_Licencia",
    "Fecha_de_vencimiento_licencia",
    "Alerta_de_vencimiento_licencia",
    "Certificado_Medico",
    "Fecha_de_Emision_Certificado",
    "Fecha_de_vencimiento_certificado",
    "Alerta_de_vencimiento_certificado",
    "Numero_de_Pasaporte_1",
    "Fecha_de_Emision_Pasaporte_1",
    "Fecha_de_vencimiento_Pasaporte_1",
    "Alerta_de_vencimiento_Pasaporte_1",
    "Pais_1",
    "Numero_de_Pasaporte_2",
    "Fecha_de_Emision_Pasaporte_2",
    "Fecha_de_vencimiento_Pasaporte_2",
    "Alerta_de_vencimiento_Pasaporte_2",
    "Pais_2",
    "Numero_de_Visa_1",
    "Fecha_de_Emision_visa_1",
    "Fecha_de_vencimiento_Visa_1",
    "Alerta_de_vencimiento_Visa_1",
    "Pais_3",
    "Numero_de_Visa_2",
    "Fecha_de_Emision_Visa_2",
    "Fecha_de_vencimiento_Visa_2",
    "Alerta_de_vencimiento_Visa_2",
    "Pais_4",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      // "Clave",
      // "Nombres",
      // "Apellido_paterno",
      // "Apellido_materno",
       "Nombre_completo",
      //"Direccion",
      "Telefono",
      "Celular",
      "Correo_electronico"
      // "Fecha_de_nacimiento",
      // "Edad",
      // "Nacionalidad_1",
      // "Nacionalidad_2",
      // "Genero",
      // "Tipo_de_Tripulante",
      // "Pertenece_al_grupo",
      // "Estatus",
      // "Usuario_Relacionado",
      // "Fotografia",
      // "Numero_de_Licencia",
      // "Fecha_de_Emision_Licencia",
      // "Fecha_de_vencimiento_licencia",
      // "Alerta_de_vencimiento_licencia",
      // "Cargar_Licencia",
      // "Certificado_Medico",
      // "Fecha_de_Emision_Certificado",
      // "Fecha_de_vencimiento_certificado",
      // "Alerta_de_vencimiento_certificado",
      // "Cargar_Certificado_Medico",
      // "Numero_de_Pasaporte_1",
      // "Fecha_de_Emision_Pasaporte_1",
      // "Fecha_de_vencimiento_Pasaporte_1",
      // "Alerta_de_vencimiento_Pasaporte_1",
      // "Pais_1",
      // "Cargar_Pasaporte_1",
      // "Numero_de_Pasaporte_2",
      // "Fecha_de_Emision_Pasaporte_2",
      // "Fecha_de_vencimiento_Pasaporte_2",
      // "Alerta_de_vencimiento_Pasaporte_2",
      // "Pais_2",
      // "Cargar_Pasaporte_2",
      // "Numero_de_Visa_1",
      // "Fecha_de_Emision_visa_1",
      // "Fecha_de_vencimiento_Visa_1",
      // "Alerta_de_vencimiento_Visa_1",
      // "Pais_3",
      // "Cargar_Visa_1",
      // "Numero_de_Visa_2",
      // "Fecha_de_Emision_Visa_2",
      // "Fecha_de_vencimiento_Visa_2",
      // "Alerta_de_vencimiento_Visa_2",
      // "Pais_4",
      // "Cargar_Visa_2",

    ],
    columns_filters: [
      "acciones_filtro",
      // "Clave_filtro",
      // "Nombres_filtro",
      // "Apellido_paterno_filtro",
      // "Apellido_materno_filtro",
      "Nombre_completo_filtro",
      //"Direccion_filtro",
      "Telefono_filtro",
      "Celular_filtro",
      "Correo_electronico_filtro",
      // "Fecha_de_nacimiento_filtro",
      // "Edad_filtro",
      // "Nacionalidad_1_filtro",
      // "Nacionalidad_2_filtro",
      // "Genero_filtro",
      // "Tipo_de_Tripulante_filtro",
      // "Pertenece_al_grupo_filtro",
      // "Estatus_filtro",
      // "Usuario_Relacionado_filtro",
      // "Fotografia_filtro",
      // "Numero_de_Licencia_filtro",
      // "Fecha_de_Emision_Licencia_filtro",
      // "Fecha_de_vencimiento_licencia_filtro",
      // "Alerta_de_vencimiento_licencia_filtro",
      // "Cargar_Licencia_filtro",
      // "Certificado_Medico_filtro",
      // "Fecha_de_Emision_Certificado_filtro",
      // "Fecha_de_vencimiento_certificado_filtro",
      // "Alerta_de_vencimiento_certificado_filtro",
      // "Cargar_Certificado_Medico_filtro",
      // "Numero_de_Pasaporte_1_filtro",
      // "Fecha_de_Emision_Pasaporte_1_filtro",
      // "Fecha_de_vencimiento_Pasaporte_1_filtro",
      // "Alerta_de_vencimiento_Pasaporte_1_filtro",
      // "Pais_1_filtro",
      // "Cargar_Pasaporte_1_filtro",
      // "Numero_de_Pasaporte_2_filtro",
      // "Fecha_de_Emision_Pasaporte_2_filtro",
      // "Fecha_de_vencimiento_Pasaporte_2_filtro",
      // "Alerta_de_vencimiento_Pasaporte_2_filtro",
      // "Pais_2_filtro",
      // "Cargar_Pasaporte_2_filtro",
      // "Numero_de_Visa_1_filtro",
      // "Fecha_de_Emision_visa_1_filtro",
      // "Fecha_de_vencimiento_Visa_1_filtro",
      // "Alerta_de_vencimiento_Visa_1_filtro",
      // "Pais_3_filtro",
      // "Cargar_Visa_1_filtro",
      // "Numero_de_Visa_2_filtro",
      // "Fecha_de_Emision_Visa_2_filtro",
      // "Fecha_de_vencimiento_Visa_2_filtro",
      // "Alerta_de_vencimiento_Visa_2_filtro",
      // "Pais_4_filtro",
      // "Cargar_Visa_2_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      Nombres: "",
      Apellido_paterno: "",
      Apellido_materno: "",
      Nombre_completo: "",
      Direccion: "",
      Telefono: "",
      Celular: "",
      Correo_electronico: "",
      Fecha_de_nacimiento: null,
      Edad: "",
      Nacionalidad_1: "",
      Nacionalidad_2: "",
      Genero: "",
      Tipo_de_Tripulante: "",
      Pertenece_al_grupo: "",
      Estatus: "",
      Usuario_Relacionado: "",
      Numero_de_Licencia: "",
      Fecha_de_Emision_Licencia: null,
      Fecha_de_vencimiento_licencia: null,
      Alerta_de_vencimiento_licencia: "",
      Certificado_Medico: "",
      Fecha_de_Emision_Certificado: null,
      Fecha_de_vencimiento_certificado: null,
      Alerta_de_vencimiento_certificado: "",
      Numero_de_Pasaporte_1: "",
      Fecha_de_Emision_Pasaporte_1: null,
      Fecha_de_vencimiento_Pasaporte_1: null,
      Alerta_de_vencimiento_Pasaporte_1: "",
      Pais_1: "",
      Numero_de_Pasaporte_2: "",
      Fecha_de_Emision_Pasaporte_2: null,
      Fecha_de_vencimiento_Pasaporte_2: null,
      Alerta_de_vencimiento_Pasaporte_2: "",
      Pais_2: "",
      Numero_de_Visa_1: "",
      Fecha_de_Emision_visa_1: null,
      Fecha_de_vencimiento_Visa_1: null,
      Alerta_de_vencimiento_Visa_1: "",
      Pais_3: "",
      Numero_de_Visa_2: "",
      Fecha_de_Emision_Visa_2: null,
      Fecha_de_vencimiento_Visa_2: null,
      Alerta_de_vencimiento_Visa_2: "",
      Pais_4: "",

    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      fromFecha_de_nacimiento: "",
      toFecha_de_nacimiento: "",
      fromEdad: "",
      toEdad: "",
      Nacionalidad_1Filter: "",
      Nacionalidad_1: "",
      Nacionalidad_1Multiple: "",
      Nacionalidad_2Filter: "",
      Nacionalidad_2: "",
      Nacionalidad_2Multiple: "",
      GeneroFilter: "",
      Genero: "",
      GeneroMultiple: "",
      Tipo_de_TripulanteFilter: "",
      Tipo_de_Tripulante: "",
      Tipo_de_TripulanteMultiple: "",
      Pertenece_al_grupoFilter: "",
      Pertenece_al_grupo: "",
      Pertenece_al_grupoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      Usuario_RelacionadoFilter: "",
      Usuario_Relacionado: "",
      Usuario_RelacionadoMultiple: "",
      fromFecha_de_Emision_Licencia: "",
      toFecha_de_Emision_Licencia: "",
      fromFecha_de_vencimiento_licencia: "",
      toFecha_de_vencimiento_licencia: "",
      fromFecha_de_Emision_Certificado: "",
      toFecha_de_Emision_Certificado: "",
      fromFecha_de_vencimiento_certificado: "",
      toFecha_de_vencimiento_certificado: "",
      fromFecha_de_Emision_Pasaporte_1: "",
      toFecha_de_Emision_Pasaporte_1: "",
      fromFecha_de_vencimiento_Pasaporte_1: "",
      toFecha_de_vencimiento_Pasaporte_1: "",
      Pais_1Filter: "",
      Pais_1: "",
      Pais_1Multiple: "",
      fromFecha_de_Emision_Pasaporte_2: "",
      toFecha_de_Emision_Pasaporte_2: "",
      fromFecha_de_vencimiento_Pasaporte_2: "",
      toFecha_de_vencimiento_Pasaporte_2: "",
      Pais_2Filter: "",
      Pais_2: "",
      Pais_2Multiple: "",
      fromFecha_de_Emision_visa_1: "",
      toFecha_de_Emision_visa_1: "",
      fromFecha_de_vencimiento_Visa_1: "",
      toFecha_de_vencimiento_Visa_1: "",
      Pais_3Filter: "",
      Pais_3: "",
      Pais_3Multiple: "",
      fromFecha_de_Emision_Visa_2: "",
      toFecha_de_Emision_Visa_2: "",
      fromFecha_de_vencimiento_Visa_2: "",
      toFecha_de_vencimiento_Visa_2: "",
      Pais_4Filter: "",
      Pais_4: "",
      Pais_4Multiple: "",

    }
  };

  dataSource: TripulacionDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: TripulacionDataSource;
  dataClipboard: any;

  constructor(
    private _TripulacionService: TripulacionService,
    public _dialog: MatDialog,
    private _messages: MessagesHelper,
    private _seguridad: SeguridadService,
    private _translate: TranslateService,
    public _file: SpartanFileService,
    public dialogo: MatDialog,
    private excelService: ExcelService,
    _user: SpartanUserService,
    private _SpartanService: SpartanService,
    private localStorageHelper: LocalStorageHelper,
    route: Router, renderer: Renderer2
  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

  }

  ngOnInit() {
    this.rulesBeforeCreationList();
    this.dataSource = new TripulacionDataSource(
      this._TripulacionService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Tripulacion)
      .subscribe((response) => {
        this.permisos = response;
      });
  }

  ngAfterViewInit() {
    this.rulesAfterCreationList();
    merge(this.sort.sortChange, this.paginator.page)
      .pipe(
        tap(() => {
          this.listConfig.page = this.paginator.pageIndex;
          this.listConfig.size = this.paginator.pageSize;
          this.listConfig.sortField = this.sort.active;
          this.listConfig.sortDirecction = this.sort.direction;
          this.loadData();
        })
      )
      .subscribe();
    this.loadPaginatorTranslate();
  }

  ngAfterViewChecked() {
    this.rulesAfterViewChecked();
  }

  clearFilter() {
    this.listConfig.page = 0;
    this.listConfig.filter.Clave = "";
    this.listConfig.filter.Nombres = "";
    this.listConfig.filter.Apellido_paterno = "";
    this.listConfig.filter.Apellido_materno = "";
    this.listConfig.filter.Nombre_completo = "";
    this.listConfig.filter.Direccion = "";
    this.listConfig.filter.Telefono = "";
    this.listConfig.filter.Celular = "";
    this.listConfig.filter.Correo_electronico = "";
    this.listConfig.filter.Fecha_de_nacimiento = undefined;
    this.listConfig.filter.Edad = "";
    this.listConfig.filter.Nacionalidad_1 = "";
    this.listConfig.filter.Nacionalidad_2 = "";
    this.listConfig.filter.Genero = "";
    this.listConfig.filter.Tipo_de_Tripulante = "";
    this.listConfig.filter.Pertenece_al_grupo = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Usuario_Relacionado = "";
    this.listConfig.filter.Numero_de_Licencia = "";
    this.listConfig.filter.Fecha_de_Emision_Licencia = undefined;
    this.listConfig.filter.Fecha_de_vencimiento_licencia = undefined;
    this.listConfig.filter.Alerta_de_vencimiento_licencia = undefined;
    this.listConfig.filter.Certificado_Medico = "";
    this.listConfig.filter.Fecha_de_Emision_Certificado = undefined;
    this.listConfig.filter.Fecha_de_vencimiento_certificado = undefined;
    this.listConfig.filter.Alerta_de_vencimiento_certificado = undefined;
    this.listConfig.filter.Numero_de_Pasaporte_1 = "";
    this.listConfig.filter.Fecha_de_Emision_Pasaporte_1 = undefined;
    this.listConfig.filter.Fecha_de_vencimiento_Pasaporte_1 = undefined;
    this.listConfig.filter.Alerta_de_vencimiento_Pasaporte_1 = undefined;
    this.listConfig.filter.Pais_1 = "";
    this.listConfig.filter.Numero_de_Pasaporte_2 = "";
    this.listConfig.filter.Fecha_de_Emision_Pasaporte_2 = undefined;
    this.listConfig.filter.Fecha_de_vencimiento_Pasaporte_2 = undefined;
    this.listConfig.filter.Alerta_de_vencimiento_Pasaporte_2 = undefined;
    this.listConfig.filter.Pais_2 = "";
    this.listConfig.filter.Numero_de_Visa_1 = "";
    this.listConfig.filter.Fecha_de_Emision_visa_1 = undefined;
    this.listConfig.filter.Fecha_de_vencimiento_Visa_1 = undefined;
    this.listConfig.filter.Alerta_de_vencimiento_Visa_1 = undefined;
    this.listConfig.filter.Pais_3 = "";
    this.listConfig.filter.Numero_de_Visa_2 = "";
    this.listConfig.filter.Fecha_de_Emision_Visa_2 = undefined;
    this.listConfig.filter.Fecha_de_vencimiento_Visa_2 = undefined;
    this.listConfig.filter.Alerta_de_vencimiento_Visa_2 = undefined;
    this.listConfig.filter.Pais_4 = "";

    this.listConfig.page = 0;
    this.loadData();
  }

  refresh() {
    this.listConfig.page = 0;
    this.loadData();
  }

   //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  applyRules() { }

  rulesAfterCreationList() {
    //rulesAfterCreationList_ExecuteBusinessRulesInit
    //rulesAfterCreationList_ExecuteBusinessRulesEnd
  }

  rulesBeforeCreationList() {
    //rulesBeforeCreationList_ExecuteBusinessRulesInit

//INICIA - BRID:790 - Regla para filtrar pilotos y sobrecargos - Autor: Administrador - Actualización: 3/4/2021 12:13:03 PM
  this.brf.SetFilteronList(this.listConfig,"Tripulacion.Clave IN (SELECT Clave FROM dbo.Tripulacion WHERE Tipo_de_Tripulante IN (1, 2))");
//TERMINA - BRID:790

//rulesBeforeCreationList_ExecuteBusinessRulesEnd

  }

//Fin de reglas



  loadPaginatorTranslate() {

    this._translate.get("general").subscribe(() => {
      this.paginator._intl.itemsPerPageLabel = this._translate.instant("general.items_per_page");
      this.paginator._intl.nextPageLabel = this._translate.instant("general.next_page");
      this.paginator._intl.previousPageLabel = this._translate.instant("general.previus_page");
      this.paginator._intl.firstPageLabel = this._translate.instant("general.first_page");
      this.paginator._intl.lastPageLabel = this._translate.instant("general.last_page");

    })

  }
  init() {
    const initConfig = history.state.data;

    if (initConfig) {
      this.listConfig = initConfig;
    }

    if (this.listConfig.advancedSearch === true) {
      this.loadDataAdvanced();
    } else {
      this.loadData();
    }
  }

  public loadData() {
    this.dataSource.load(this.listConfig);
  }

  public loadDataAdvanced() {
    this.dataSource.loadAdvanced(this.listConfig);
  }

  remove(row: Tripulacion) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._TripulacionService
          .delete(+row.Clave)
          .pipe(
            catchError(e => {
              let error  = e.error;
              if(~error.indexOf('dbo.')){
              let nombreTablaP =error.substring(error.indexOf('dbo.')+4);
              let nombreTabla  =  nombreTablaP.substring(0,nombreTablaP.indexOf('"')).replaceAll('_',' ');
              this._messages.error(`No se pudo eliminar ya que tiene relación con ${nombreTabla}`);
              }
              return throwError(e);
            }),
            finalize(() => this.dataSource.loadingSubject.next(false))
          )
          .subscribe((result: any) => {
            this._messages.success("Registro eliminado correctamente");
            this.loadData();
          });
      });
  }

  /**
   * Imprimir
   * @param dataRow : Información de Formato
   */
  ActionPrint(dataRow: Tripulacion) {

    this.dialogo
      .open(DialogPrintFormatComponent, {
        data: dataRow
      })
      .afterClosed()
      .subscribe((optionSelected: boolean) => {
        if (optionSelected) {
          alert('Pendiente de implementar.');
        }
      });

  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

Editor_HTML(title: string, info: string) {
    const data = {
      titleDialog: title,
      infoDialog: info
    }
    this._dialog.open(HtmlEditorDialogComponent, { data });
  }

/** Construir tabla con datos a exportar (PDF)
   * @param data : Contenedor de datos
   */

  SetTableExportPdf(data: any) {
    let new_data = [];
    let header = [
'Piloto ID'
,'Nombre(s)'
,'Apellido paterno'
,'Apellido materno'
,'Nombre completo'
,'Dirección'
,'Teléfono'
,'Celular'
,'Correo electrónico'
,'Fecha de nacimiento'
,'Edad'
,'Nacionalidad (1)'
,'Nacionalidad (2)'
,'Género'
,'Tipo de Tripulante'
,'Pertenece al grupo'
,'Estatus'
,'Usuario Relacionado'
,'Número de Licencia'
,'Fecha de Emisión Licencia'
,'Fecha de vencimiento'
,'Alerta de vencimiento'
,'Certificado Médico'
,'Fecha de Emisión Certificado'
,'Fecha de vencimiento Certificado'
,'Alerta de vencimiento Certificado'
,'Número de Pasaporte (1)'
,'Fecha de Emisión Pasaporte (1)'
,'Fecha de vencimiento Pasaporte (1)'
,'Alerta de vencimiento Pasaporte (1)'
,'País'
,'Número de Pasaporte (2)'
,'Fecha de Emisión Pasaporte (2)'
,'Fecha de vencimiento Pasaporte (2)'
,'Alerta de vencimiento Pasaporte (2)'
,'País'
,'Número de Visa (1)'
,'Fecha de Emisión visa (1)'
,'Fecha de vencimiento Visa (1)'
,'Alerta de vencimiento Visa (1)'
,'País'
,'Número de Visa (2)'
,'Fecha de Emisión Visa (2)'
,'Fecha de vencimiento Visa (2)'
,'Alerta de vencimiento Visa (2)'
,'País'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Clave
,x.Nombres
,x.Apellido_paterno
,x.Apellido_materno
,x.Nombre_completo
,x.Direccion
,x.Telefono
,x.Celular
,x.Correo_electronico
,x.Fecha_de_nacimiento
,x.Edad
,x.Nacionalidad_1_Pais.Nacionalidad
,x.Nacionalidad_2_Pais.Nacionalidad
,x.Genero_Genero.Descripcion
,x.Tipo_de_Tripulante_Tipo_de_Tripulante.Descripcion
,x.Pertenece_al_grupo_Respuesta.Descripcion
,x.Estatus_Estatus_Tripulacion.Descripcion
,x.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo
,x.Numero_de_Licencia
,x.Fecha_de_Emision_Licencia
,x.Fecha_de_vencimiento_licencia
,x.Alerta_de_vencimiento_licencia
,x.Certificado_Medico
,x.Fecha_de_Emision_Certificado
,x.Fecha_de_vencimiento_certificado
,x.Alerta_de_vencimiento_certificado
,x.Numero_de_Pasaporte_1
,x.Fecha_de_Emision_Pasaporte_1
,x.Fecha_de_vencimiento_Pasaporte_1
,x.Alerta_de_vencimiento_Pasaporte_1
,x.Pais_1_Pais.Nombre
,x.Numero_de_Pasaporte_2
,x.Fecha_de_Emision_Pasaporte_2
,x.Fecha_de_vencimiento_Pasaporte_2
,x.Alerta_de_vencimiento_Pasaporte_2
,x.Pais_2_Pais.Nombre
,x.Numero_de_Visa_1
,x.Fecha_de_Emision_visa_1
,x.Fecha_de_vencimiento_Visa_1
,x.Alerta_de_vencimiento_Visa_1
,x.Pais_3_Pais.Nombre
,x.Numero_de_Visa_2
,x.Fecha_de_Emision_Visa_2
,x.Fecha_de_vencimiento_Visa_2
,x.Alerta_de_vencimiento_Visa_2
,x.Pais_4_Pais.Nombre

      ]
      new_data.push(new_content);
    });


    const pdfDefinition: any = {
      pageOrientation: 'landscape',
      content: [
        {
          table: {
            // widths:['*',200,'auto'],
            body: new_data
          }
        }
      ]
    }
    pdfMake.createPdf(pdfDefinition).download('Tripulacion.pdf');
  }


  /**
   * Exportar información
   * @param exportType : Tipo de exportación (MEM|XLS|CSV|PDF|PTR)
   */
  ActionExport(exportType: number) {

    let title: string = "";
    let buttonLabel: string = "";
    switch (exportType) {
      case 1:
        title = "Copiar";
        buttonLabel="Copiar";
      break;
      case 2: title = "Exportar Excel"; buttonLabel="Exportar"; break;
      case 3: title = "Exportar CSV"; buttonLabel="Exportar"; break;
      case 4: title = "Exportar PDF"; buttonLabel="Exportar"; break;
      case 5: title = "Imprimir"; buttonLabel="Imprimir"; break;
    }


    this.dialogo
      .open(DialogConfirmExportComponent, {
        data: {
          mensaje: `Seleccione una opción`,
          titulo: title,
          buttonLabel:buttonLabel
        },

      })
      .afterClosed()
      .subscribe((optionSelected: string) => {

        if (optionSelected == '1') {
          let condition = this.dataSource.SetWhereClause(this.listConfig);
          let sort = this.dataSource.SetOrderClause(this.listConfig);
          let page = this.listConfig.page + 1;
          let starRowIndex = page * this.listConfig.size - this.listConfig.size + 1;
          let maximumRows = page * this.listConfig.size;
          this._TripulacionService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              console.log(response.Tripulacions)
              response.Tripulacions.forEach(e => {
                for (const p in e) {
                  if (typeof e[p] === 'object') {
                    for (const i in e[p]) {
                      if (e[p][i] == null) {
                        e[p][i] = '';
                      }
                    }
                  }
                  if (e[p] == null) {
                    e[p] = '';
                  }
                }

                e.Fecha_de_nacimiento = e.Fecha_de_nacimiento ? momentJS(e.Fecha_de_nacimiento).format('DD/MM/YYYY') : '';
                e.Fecha_de_Emision_Licencia  =  e.Fecha_de_Emision_Licencia ? momentJS(e.Fecha_de_Emision_Licencia).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_licencia = e.Fecha_de_vencimiento_licencia ? momentJS(e.Fecha_de_vencimiento_licencia).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_licencia  = e.Alerta_de_vencimiento_licencia ? 'SI' : 'NO';
                e.Fecha_de_Emision_Certificado= e.Fecha_de_Emision_Certificado ? momentJS(e.Fecha_de_Emision_Certificado).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_certificado= e.Fecha_de_vencimiento_certificado ? momentJS(e.Fecha_de_vencimiento_certificado).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_certificado= e.Alerta_de_vencimiento_certificado ? 'SI' : 'NO';
                e.Fecha_de_Emision_Pasaporte_1= e.Fecha_de_Emision_Pasaporte_1 ? momentJS(e.Fecha_de_Emision_Pasaporte_1).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_Pasaporte_1= e.Fecha_de_vencimiento_Pasaporte_1 ? momentJS(e.Fecha_de_vencimiento_Pasaporte_1).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_Pasaporte_1= e.Alerta_de_vencimiento_Pasaporte_1 ? 'SI' : 'NO';
                e.Fecha_de_Emision_Pasaporte_2= e.Fecha_de_Emision_Pasaporte_2 ? momentJS(e.Fecha_de_Emision_Pasaporte_2).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_Pasaporte_2= e.Fecha_de_vencimiento_Pasaporte_2 ? momentJS(e.Fecha_de_vencimiento_Pasaporte_2).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_Pasaporte_2= e.Alerta_de_vencimiento_Pasaporte_2 ? 'SI' : 'NO';
                e.Fecha_de_Emision_visa_1= e.Fecha_de_Emision_visa_1 ? momentJS(e.Fecha_de_Emision_visa_1).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_Visa_1= e.Fecha_de_vencimiento_Visa_1 ? momentJS(e.Fecha_de_vencimiento_Visa_1).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_Visa_1= e.Alerta_de_vencimiento_Visa_1 ? 'SI' : 'NO';
                e.Fecha_de_Emision_Visa_2= e.Fecha_de_Emision_Visa_2 ? momentJS(e.Fecha_de_Emision_Visa_2).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_Visa_2= e.Fecha_de_vencimiento_Visa_2 ? momentJS(e.Fecha_de_vencimiento_Visa_2).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_Visa_2= e.Alerta_de_vencimiento_Visa_2 ? 'SI' : 'NO';

              });
              this.dataSourceTemp = response.Tripulacions;
              const dataToRender = this.SetTableExport(this.dataSourceTemp);

              switch (exportType) {
                case Enumerations.Enums.ExportType.MEM:
                  {
                    const selBox = document.createElement('textarea');
                    selBox.style.position = 'fixed';
                    selBox.style.left = '0';
                    selBox.style.top = '0';
                    selBox.style.opacity = '0';
                    selBox.value = this.SetTableExportToClipboard(this.dataSourceTemp);
                    document.body.appendChild(selBox);
                    selBox.focus();
                    selBox.select();
                    document.execCommand('copy');
                    document.body.removeChild(selBox);
                    break;
                  }
                case Enumerations.Enums.ExportType.XLS:
                  {
                    this.ExportToExcel(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.CSV:
                  {
                    this.ExportToCSV(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.PDF:
                  {
					this.SetTableExportPdf(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.PTR:
                  {
                    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
                    WindowPrt.document.write(dataToRender);
                    WindowPrt.document.close();
                    WindowPrt.focus();
                    WindowPrt.print();
                    WindowPrt.close();
                    break;
                  }
              }
            }, error => {

            });
        } else if (optionSelected == '2') {
          this._TripulacionService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              response.Tripulacions.forEach(e => {
                for (const p in e) {
                  if (typeof e[p] === 'object') {
                    for (const i in e[p]) {
                      if (e[p][i] == null) {
                        e[p][i] = '';
                      }
                    }
                  }
                  if (e[p] == null) {
                    e[p] = '';
                  }
                }


                e.Fecha_de_nacimiento = e.Fecha_de_nacimiento ? momentJS(e.Fecha_de_nacimiento).format('DD/MM/YYYY') : '';
                e.Fecha_de_Emision_Licencia  =  e.Fecha_de_Emision_Licencia ? momentJS(e.Fecha_de_Emision_Licencia).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_licencia = e.Fecha_de_vencimiento_licencia ? momentJS(e.Fecha_de_vencimiento_licencia).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_licencia  = e.Alerta_de_vencimiento_licencia ? 'SI' : 'NO';
                e.Fecha_de_Emision_Certificado= e.Fecha_de_Emision_Certificado ? momentJS(e.Fecha_de_Emision_Certificado).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_certificado= e.Fecha_de_vencimiento_certificado ? momentJS(e.Fecha_de_vencimiento_certificado).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_certificado= e.Alerta_de_vencimiento_certificado ? 'SI' : 'NO';
                e.Fecha_de_Emision_Pasaporte_1= e.Fecha_de_Emision_Pasaporte_1 ? momentJS(e.Fecha_de_Emision_Pasaporte_1).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_Pasaporte_1= e.Fecha_de_vencimiento_Pasaporte_1 ? momentJS(e.Fecha_de_vencimiento_Pasaporte_1).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_Pasaporte_1= e.Alerta_de_vencimiento_Pasaporte_1 ? 'SI' : 'NO';
                e.Fecha_de_Emision_Pasaporte_2= e.Fecha_de_Emision_Pasaporte_2 ? momentJS(e.Fecha_de_Emision_Pasaporte_2).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_Pasaporte_2= e.Fecha_de_vencimiento_Pasaporte_2 ? momentJS(e.Fecha_de_vencimiento_Pasaporte_2).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_Pasaporte_2= e.Alerta_de_vencimiento_Pasaporte_2 ? 'SI' : 'NO';
                e.Fecha_de_Emision_visa_1= e.Fecha_de_Emision_visa_1 ? momentJS(e.Fecha_de_Emision_visa_1).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_Visa_1= e.Fecha_de_vencimiento_Visa_1 ? momentJS(e.Fecha_de_vencimiento_Visa_1).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_Visa_1= e.Alerta_de_vencimiento_Visa_1 ? 'SI' : 'NO';
                e.Fecha_de_Emision_Visa_2= e.Fecha_de_Emision_Visa_2 ? momentJS(e.Fecha_de_Emision_Visa_2).format('DD/MM/YYYY') : '';
                e.Fecha_de_vencimiento_Visa_2= e.Fecha_de_vencimiento_Visa_2 ? momentJS(e.Fecha_de_vencimiento_Visa_2).format('DD/MM/YYYY') : '';
                e.Alerta_de_vencimiento_Visa_2= e.Alerta_de_vencimiento_Visa_2 ? 'SI' : 'NO';

              });
              this.dataSourceTemp = response.Tripulacions;
              const dataToRender = this.SetTableExport(this.dataSourceTemp);

              switch (exportType) {
                case Enumerations.Enums.ExportType.MEM:
                  {
                    const selBox = document.createElement('textarea');
                    selBox.style.position = 'fixed';
                    selBox.style.left = '0';
                    selBox.style.top = '0';
                    selBox.style.opacity = '0';
                    selBox.value = this.SetTableExportToClipboard(this.dataSourceTemp);
                    document.body.appendChild(selBox);
                    selBox.focus();
                    selBox.select();
                    document.execCommand('copy');
                    document.body.removeChild(selBox);
                    break;
                  }
                case Enumerations.Enums.ExportType.XLS:
                  {
                    this.ExportToExcel(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.CSV:
                  {
                    this.ExportToCSV(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.PDF:
                  {
					this.SetTableExportPdf(this.dataSourceTemp);
                    break;
                  }
                case Enumerations.Enums.ExportType.PTR:
                  {
                    const WindowPrt = window.open('', '', 'left=0,top=0,width=900,height=900,toolbar=0,scrollbars=0,status=0');
                    WindowPrt.document.write(dataToRender);
                    WindowPrt.document.close();
                    WindowPrt.focus();
                    WindowPrt.print();
                    WindowPrt.close();
                    break;
                  }
              }
            }, error => {

            });

        }
      });

  }

  /**
   * Exportar a Excel
   * @param data : Data a exportar
   */
  ExportToExcel(data: any) {
    const that = this;
    const excelData = _.map(data, function (fields) {
      return {
        'Piloto ID ': fields.Clave,
        'Nombre(s) ': fields.Nombres,
        'Apellido paterno ': fields.Apellido_paterno,
        'Apellido materno ': fields.Apellido_materno,
        'Nombre completo ': fields.Nombre_completo,
        'Dirección ': fields.Direccion,
        'Teléfono ': fields.Telefono,
        'Celular ': fields.Celular,
        'Correo electrónico ': fields.Correo_electronico,
        'Fecha de nacimiento ': fields.Fecha_de_nacimiento ? momentJS(fields.Fecha_de_nacimiento).format('DD/MM/YYYY') : '',
        'Edad ': fields.Edad,
        'Nacionalidad (1) ': fields.Nacionalidad_1_Pais.Nacionalidad,
        'Nacionalidad (2) 1': fields.Nacionalidad_2_Pais.Nacionalidad,
        'Género ': fields.Genero_Genero.Descripcion,
        'Tipo de Tripulante ': fields.Tipo_de_Tripulante_Tipo_de_Tripulante.Descripcion,
        'Pertenece al grupo ': fields.Pertenece_al_grupo_Respuesta.Descripcion,
        'Estatus ': fields.Estatus_Estatus_Tripulacion.Descripcion,
        'Usuario Relacionado ': fields.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo,
        'Número de Licencia ': fields.Numero_de_Licencia,
        'Fecha de Emisión Licencia ': fields.Fecha_de_Emision_Licencia ? momentJS(fields.Fecha_de_Emision_Licencia).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento ': fields.Fecha_de_vencimiento_licencia ? momentJS(fields.Fecha_de_vencimiento_licencia).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_licencia ': fields.Alerta_de_vencimiento_licencia ? 'SI' : 'NO',
        'Certificado Médico ': fields.Certificado_Medico,
        'Fecha de Emisión Certificado ': fields.Fecha_de_Emision_Certificado ? momentJS(fields.Fecha_de_Emision_Certificado).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento1 ': fields.Fecha_de_vencimiento_certificado ? momentJS(fields.Fecha_de_vencimiento_certificado).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_certificado ': fields.Alerta_de_vencimiento_certificado ? 'SI' : 'NO',
        'Número de Pasaporte (1) ': fields.Numero_de_Pasaporte_1,
        'Fecha de Emisión Pasaporte (1) ': fields.Fecha_de_Emision_Pasaporte_1 ? momentJS(fields.Fecha_de_Emision_Pasaporte_1).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento Pasaporte (1) ': fields.Fecha_de_vencimiento_Pasaporte_1 ? momentJS(fields.Fecha_de_vencimiento_Pasaporte_1).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_Pasaporte_1 ': fields.Alerta_de_vencimiento_Pasaporte_1 ? 'SI' : 'NO',
        'País 2': fields.Pais_1_Pais.Nombre,
        'Número de Pasaporte (2) ': fields.Numero_de_Pasaporte_2,
        'Fecha de Emisión Pasaporte (2) ': fields.Fecha_de_Emision_Pasaporte_2 ? momentJS(fields.Fecha_de_Emision_Pasaporte_2).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento Pasaporte (2) ': fields.Fecha_de_vencimiento_Pasaporte_2 ? momentJS(fields.Fecha_de_vencimiento_Pasaporte_2).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_Pasaporte_2 ': fields.Alerta_de_vencimiento_Pasaporte_2 ? 'SI' : 'NO',
        'País 3': fields.Pais_2_Pais.Nombre,
        'Número de Visa (1) ': fields.Numero_de_Visa_1,
        'Fecha de Emisión visa (1) ': fields.Fecha_de_Emision_visa_1 ? momentJS(fields.Fecha_de_Emision_visa_1).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento Visa (1) ': fields.Fecha_de_vencimiento_Visa_1 ? momentJS(fields.Fecha_de_vencimiento_Visa_1).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_Visa_1 ': fields.Alerta_de_vencimiento_Visa_1 ? 'SI' : 'NO',
        'País 5': fields.Pais_3_Pais.Nombre,
        'Número de Visa (2) ': fields.Numero_de_Visa_2,
        'Fecha de Emisión Visa (2) ': fields.Fecha_de_Emision_Visa_2 ? momentJS(fields.Fecha_de_Emision_Visa_2).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento Visa (2) ': fields.Fecha_de_vencimiento_Visa_2 ? momentJS(fields.Fecha_de_vencimiento_Visa_2).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_Visa_2 ': fields.Alerta_de_vencimiento_Visa_2 ? 'SI' : 'NO',
        'País 4': fields.Pais_4_Pais.Nombre,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Tripulacion  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Clave: x.Clave,
      Nombres: x.Nombres,
      Apellido_paterno: x.Apellido_paterno,
      Apellido_materno: x.Apellido_materno,
      Nombre_completo: x.Nombre_completo,
      Direccion: x.Direccion,
      Telefono: x.Telefono,
      Celular: x.Celular,
      Correo_electronico: x.Correo_electronico,
      Fecha_de_nacimiento: x.Fecha_de_nacimiento,
      Edad: x.Edad,
      Nacionalidad_1: x.Nacionalidad_1_Pais.Nacionalidad,
      Nacionalidad_2: x.Nacionalidad_2_Pais.Nacionalidad,
      Genero: x.Genero_Genero.Descripcion,
      Tipo_de_Tripulante: x.Tipo_de_Tripulante_Tipo_de_Tripulante.Descripcion,
      Pertenece_al_grupo: x.Pertenece_al_grupo_Respuesta.Descripcion,
      Estatus: x.Estatus_Estatus_Tripulacion.Descripcion,
      Usuario_Relacionado: x.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo,
      Numero_de_Licencia: x.Numero_de_Licencia,
      Fecha_de_Emision_Licencia: x.Fecha_de_Emision_Licencia,
      Fecha_de_vencimiento_licencia: x.Fecha_de_vencimiento_licencia,
      Alerta_de_vencimiento_licencia: x.Alerta_de_vencimiento_licencia,
      Certificado_Medico: x.Certificado_Medico,
      Fecha_de_Emision_Certificado: x.Fecha_de_Emision_Certificado,
      Fecha_de_vencimiento_certificado: x.Fecha_de_vencimiento_certificado,
      Alerta_de_vencimiento_certificado: x.Alerta_de_vencimiento_certificado,
      Numero_de_Pasaporte_1: x.Numero_de_Pasaporte_1,
      Fecha_de_Emision_Pasaporte_1: x.Fecha_de_Emision_Pasaporte_1,
      Fecha_de_vencimiento_Pasaporte_1: x.Fecha_de_vencimiento_Pasaporte_1,
      Alerta_de_vencimiento_Pasaporte_1: x.Alerta_de_vencimiento_Pasaporte_1,
      Pais_1: x.Pais_1_Pais.Nombre,
      Numero_de_Pasaporte_2: x.Numero_de_Pasaporte_2,
      Fecha_de_Emision_Pasaporte_2: x.Fecha_de_Emision_Pasaporte_2,
      Fecha_de_vencimiento_Pasaporte_2: x.Fecha_de_vencimiento_Pasaporte_2,
      Alerta_de_vencimiento_Pasaporte_2: x.Alerta_de_vencimiento_Pasaporte_2,
      Pais_2: x.Pais_2_Pais.Nombre,
      Numero_de_Visa_1: x.Numero_de_Visa_1,
      Fecha_de_Emision_visa_1: x.Fecha_de_Emision_visa_1,
      Fecha_de_vencimiento_Visa_1: x.Fecha_de_vencimiento_Visa_1,
      Alerta_de_vencimiento_Visa_1: x.Alerta_de_vencimiento_Visa_1,
      Pais_3: x.Pais_3_Pais.Nombre,
      Numero_de_Visa_2: x.Numero_de_Visa_2,
      Fecha_de_Emision_Visa_2: x.Fecha_de_Emision_Visa_2,
      Fecha_de_vencimiento_Visa_2: x.Fecha_de_vencimiento_Visa_2,
      Alerta_de_vencimiento_Visa_2: x.Alerta_de_vencimiento_Visa_2,
      Pais_4: x.Pais_4_Pais.Nombre,

    }));

    this.excelService.exportToCsv(result, 'Tripulacion',  ['Clave'    ,'Nombres'  ,'Apellido_paterno'  ,'Apellido_materno'  ,'Nombre_completo'  ,'Direccion'  ,'Telefono'  ,'Celular'  ,'Correo_electronico'  ,'Fecha_de_nacimiento'  ,'Edad'  ,'Nacionalidad_1'  ,'Nacionalidad_2'  ,'Genero'  ,'Tipo_de_Tripulante'  ,'Pertenece_al_grupo'  ,'Estatus'  ,'Usuario_Relacionado'  ,'Numero_de_Licencia'  ,'Fecha_de_Emision_Licencia'  ,'Fecha_de_vencimiento_licencia'  ,'Alerta_de_vencimiento_licencia'  ,'Certificado_Medico'  ,'Fecha_de_Emision_Certificado'  ,'Fecha_de_vencimiento_certificado'  ,'Alerta_de_vencimiento_certificado'  ,'Numero_de_Pasaporte_1'  ,'Fecha_de_Emision_Pasaporte_1'  ,'Fecha_de_vencimiento_Pasaporte_1'  ,'Alerta_de_vencimiento_Pasaporte_1'  ,'Pais_1'  ,'Numero_de_Pasaporte_2'  ,'Fecha_de_Emision_Pasaporte_2'  ,'Fecha_de_vencimiento_Pasaporte_2'  ,'Alerta_de_vencimiento_Pasaporte_2'  ,'Pais_2'  ,'Numero_de_Visa_1'  ,'Fecha_de_Emision_visa_1'  ,'Fecha_de_vencimiento_Visa_1'  ,'Alerta_de_vencimiento_Visa_1'  ,'Pais_3'  ,'Numero_de_Visa_2'  ,'Fecha_de_Emision_Visa_2'  ,'Fecha_de_vencimiento_Visa_2'  ,'Alerta_de_vencimiento_Visa_2'  ,'Pais_4' ],
    [' Piloto ID',' Nombre(s)',' Apellido paterno',' Apellido materno',' Nombre completo',' Dirección',' Teléfono',' Celular',' Correo electrónico',' Fecha de nacimiento',' Edad',' Nacionalidad (1)',' Nacionalidad (2)',' Género',' Tipo de Tripulante',' Pertenece al grupo',' Estatus',' Usuario Relacionado',' Número de Licencia',' Fecha de Emisión Licencia',' Fecha de vencimiento',' Alerta de vencimiento',' Certificado Médico',' Fecha de Emisión Certificado',' Fecha de vencimiento Certificado',' Alerta de vencimiento Certificado',' Número de Pasaporte (1)',' Fecha de Emisión Pasaporte (1)',' Fecha de vencimiento Pasaporte (1)',' Alerta de vencimiento Pasaporte (1)',' País',' Número de Pasaporte (2)',' Fecha de Emisión Pasaporte (2)',' Fecha de vencimiento Pasaporte (2)',' Alerta de vencimiento Pasaporte (2)',' País',' Número de Visa (1)',' Fecha de Emisión visa (1)',' Fecha de vencimiento Visa (1)',' Alerta de vencimiento Visa (1)',' País',' Número de Visa (2)',' Fecha de Emisión Visa (2)',' Fecha de vencimiento Visa (2)',' Alerta de vencimiento Visa (2)',' País']);
  }

  /**
   * Construir tabla con datos a exportar (XLS | CSV | PDF | PTR)
   * @param data : Contenedor de datos
   */
  SetTableExport(data: any): string {
    
    let template: string;

    template = '<table id="xxx" boder="1">';
    template += '  <thead>';
    template += '      <tr>';
    template += '          <th>Piloto ID</th>';
    template += '          <th>Nombre(s)</th>';
    template += '          <th>Apellido paterno</th>';
    template += '          <th>Apellido materno</th>';
    template += '          <th>Nombre completo</th>';
    template += '          <th>Dirección</th>';
    template += '          <th>Teléfono</th>';
    template += '          <th>Celular</th>';
    template += '          <th>Correo electrónico</th>';
    template += '          <th>Fecha de nacimiento</th>';
    template += '          <th>Edad</th>';
    template += '          <th>Nacionalidad (1)</th>';
    template += '          <th>Nacionalidad (2)</th>';
    template += '          <th>Género</th>';
    template += '          <th>Tipo de Tripulante</th>';
    template += '          <th>Pertenece al grupo</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Usuario Relacionado</th>';
    template += '          <th>Número de Licencia</th>';
    template += '          <th>Fecha de Emisión Licencia</th>';
    template += '          <th>Fecha de vencimiento Licencia</th>';
    template += '          <th>Alerta de vencimiento</th>';
    template += '          <th>Certificado Médico</th>';
    template += '          <th>Fecha de Emisión Certificado</th>';
    template += '          <th>Fecha de vencimiento Certificado</th>';
    template += '          <th>Número de Pasaporte (1)</th>';
    template += '          <th>Fecha de Emisión Pasaporte (1)</th>';
    template += '          <th>Fecha de vencimiento Pasaporte (1)</th>';
    template += '          <th>Alerta de vencimiento Pasaporte (1)</th>';
    template += '          <th>País</th>';
    template += '          <th>Número de Pasaporte (2)</th>';
    template += '          <th>Fecha de Emisión Pasaporte (2)</th>';
    template += '          <th>Fecha de vencimiento Pasaporte (2)</th>';
    template += '          <th>Alerta de vencimiento Pasaporte (2)</th>';
    template += '          <th>País</th>';
    template += '          <th>Número de Visa (1)</th>';
    template += '          <th>Fecha de Emisión visa (1)</th>';
    template += '          <th>Fecha de vencimiento Visa (1)</th>';
    template += '          <th>Alerta de vencimiento Visa (1)</th>';
    template += '          <th>País</th>';
    template += '          <th>Número de Visa (2)</th>';
    template += '          <th>Fecha de Emisión Visa (2)</th>';
    template += '          <th>Fecha de vencimiento Visa (2)</th>';
    template += '          <th>Alerta de vencimiento Visa (2)</th>';
    template += '          <th>País</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Clave + '</td>';
      template += '          <td>' + element.Nombres + '</td>';
      template += '          <td>' + element.Apellido_paterno + '</td>';
      template += '          <td>' + element.Apellido_materno + '</td>';
      template += '          <td>' + element.Nombre_completo + '</td>';
      template += '          <td>' + element.Direccion + '</td>';
      template += '          <td>' + element.Telefono + '</td>';
      template += '          <td>' + element.Celular + '</td>';
      template += '          <td>' + element.Correo_electronico + '</td>';
      template += '          <td>' + element.Fecha_de_nacimiento + '</td>';
      template += '          <td>' + element.Edad + '</td>';
      template += '          <td>' + element.Nacionalidad_1_Pais.Nacionalidad + '</td>';
      template += '          <td>' + element.Nacionalidad_2_Pais.Nacionalidad + '</td>';
      template += '          <td>' + element.Genero_Genero.Descripcion + '</td>';
      template += '          <td>' + element.Tipo_de_Tripulante_Tipo_de_Tripulante.Descripcion + '</td>';
      template += '          <td>' + element.Pertenece_al_grupo_Respuesta.Descripcion + '</td>';
      template += '          <td>' + element.Estatus_Estatus_Tripulacion.Descripcion + '</td>';
      template += '          <td>' + element.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo + '</td>';
      template += '          <td>' + element.Numero_de_Licencia + '</td>';
      template += '          <td>' + element.Fecha_de_Emision_Licencia + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento_licencia + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento_licencia + '</td>';
      template += '          <td>' + element.Certificado_Medico + '</td>';
      template += '          <td>' + element.Fecha_de_Emision_Certificado + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento_certificado + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento_certificado + '</td>';
      template += '          <td>' + element.Numero_de_Pasaporte_1 + '</td>';
      template += '          <td>' + element.Fecha_de_Emision_Pasaporte_1 + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento_Pasaporte_1 + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento_Pasaporte_1 + '</td>';
      template += '          <td>' + element.Pais_1_Pais.Nombre + '</td>';
      template += '          <td>' + element.Numero_de_Pasaporte_2 + '</td>';
      template += '          <td>' + element.Fecha_de_Emision_Pasaporte_2 + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento_Pasaporte_2 + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento_Pasaporte_2 + '</td>';
      template += '          <td>' + element.Pais_2_Pais.Nombre + '</td>';
      template += '          <td>' + element.Numero_de_Visa_1 + '</td>';
      template += '          <td>' + element.Fecha_de_Emision_visa_1 + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento_Visa_1 + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento_Visa_1 + '</td>';
      template += '          <td>' + element.Pais_3_Pais.Nombre + '</td>';
      template += '          <td>' + element.Numero_de_Visa_2 + '</td>';
      template += '          <td>' + element.Fecha_de_Emision_Visa_2 + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento_Visa_2 + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento_Visa_2 + '</td>';

      template += '      </tr>';
    });

    template += '  </tbody>';
    template += '</table>';

    return template;
  }

  /**
   * Construir tabla con datos a exportar (Portapapeles)
   * @param data : Contenedor de datos
   */
  SetTableExportToClipboard(data: any): string {
    let template: string;
    template = '';
	template += '\t Piloto ID';
	template += '\t Nombre(s)';
	template += '\t Apellido paterno';
	template += '\t Apellido materno';
	template += '\t Nombre completo';
	template += '\t Dirección';
	template += '\t Teléfono';
	template += '\t Celular';
	template += '\t Correo electrónico';
	template += '\t Fecha de nacimiento';
	template += '\t Edad';
	template += '\t Nacionalidad (1)';
	template += '\t Nacionalidad (2)';
	template += '\t Género';
	template += '\t Tipo de Tripulante';
	template += '\t Pertenece al grupo';
	template += '\t Estatus';
	template += '\t Usuario Relacionado';
	template += '\t Número de Licencia';
	template += '\t Fecha de Emisión Licencia';
	template += '\t Fecha de vencimiento';
	template += '\t Alerta de vencimiento';
	template += '\t Certificado Médico';
	template += '\t Fecha de Emisión Certificado';
	template += '\t Fecha de vencimiento Certificado';
	template += '\t Alerta de vencimiento Certificado';
	template += '\t Número de Pasaporte (1)';
	template += '\t Fecha de Emisión Pasaporte (1)';
	template += '\t Fecha de vencimiento Pasaporte (1)';
	template += '\t Alerta de vencimiento Pasaporte (1)';
	template += '\t País';
	template += '\t Número de Pasaporte (2)';
	template += '\t Fecha de Emisión Pasaporte (2)';
	template += '\t Fecha de vencimiento Pasaporte (2)';
	template += '\t Alerta de vencimiento Pasaporte (2)';
  template += '\t País';
	template += '\t Número de Visa (1)';
	template += '\t Fecha de Emisión visa (1)';
	template += '\t Fecha de vencimiento Visa (1)';
	template += '\t Alerta de vencimiento Visa (1)';
  template += '\t País';
	template += '\t Número de Visa (2)';
	template += '\t Fecha de Emisión Visa (2)';
	template += '\t Fecha de vencimiento Visa (2)';
	template += '\t Alerta de vencimiento Visa (2)';
  template += '\t País';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Clave;
	  template += '\t ' + element.Nombres;
	  template += '\t ' + element.Apellido_paterno;
	  template += '\t ' + element.Apellido_materno;
	  template += '\t ' + element.Nombre_completo;
	  template += '\t ' + element.Direccion;
	  template += '\t ' + element.Telefono;
	  template += '\t ' + element.Celular;
	  template += '\t ' + element.Correo_electronico;
	  template += '\t ' + element.Fecha_de_nacimiento;
	  template += '\t ' + element.Edad;
      template += '\t ' + element.Nacionalidad_1_Pais.Nacionalidad;
      template += '\t ' + element.Nacionalidad_2_Pais.Nacionalidad;
      template += '\t ' + element.Genero_Genero.Descripcion;
      template += '\t ' + element.Tipo_de_Tripulante_Tipo_de_Tripulante.Descripcion;
      template += '\t ' + element.Pertenece_al_grupo_Respuesta.Descripcion;
      template += '\t ' + element.Estatus_Estatus_Tripulacion.Descripcion;
      template += '\t ' + element.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo;
	  template += '\t ' + element.Numero_de_Licencia;
	  template += '\t ' + element.Fecha_de_Emision_Licencia;
	  template += '\t ' + element.Fecha_de_vencimiento_licencia;
	  template += '\t ' + element.Alerta_de_vencimiento_licencia;
	  template += '\t ' + element.Certificado_Medico;
	  template += '\t ' + element.Fecha_de_Emision_Certificado;
	  template += '\t ' + element.Fecha_de_vencimiento_certificado;
	  template += '\t ' + element.Alerta_de_vencimiento_certificado;
	  template += '\t ' + element.Numero_de_Pasaporte_1;
	  template += '\t ' + element.Fecha_de_Emision_Pasaporte_1;
	  template += '\t ' + element.Fecha_de_vencimiento_Pasaporte_1;
	  template += '\t ' + element.Alerta_de_vencimiento_Pasaporte_1;
      template += '\t ' + element.Pais_1_Pais.Nombre;
	  template += '\t ' + element.Numero_de_Pasaporte_2;
	  template += '\t ' + element.Fecha_de_Emision_Pasaporte_2;
	  template += '\t ' + element.Fecha_de_vencimiento_Pasaporte_2;
	  template += '\t ' + element.Alerta_de_vencimiento_Pasaporte_2;
      template += '\t ' + element.Pais_2_Pais.Nombre;
	  template += '\t ' + element.Numero_de_Visa_1;
	  template += '\t ' + element.Fecha_de_Emision_visa_1;
	  template += '\t ' + element.Fecha_de_vencimiento_Visa_1;
	  template += '\t ' + element.Alerta_de_vencimiento_Visa_1;
      template += '\t ' + element.Pais_3_Pais.Nombre;
	  template += '\t ' + element.Numero_de_Visa_2;
	  template += '\t ' + element.Fecha_de_Emision_Visa_2;
	  template += '\t ' + element.Fecha_de_vencimiento_Visa_2;
	  template += '\t ' + element.Alerta_de_vencimiento_Visa_2;
      template += '\t ' + element.Pais_4_Pais.Nombre;

	  template += '\n';
    });

    return template;
  }

}

export class TripulacionDataSource implements DataSource<Tripulacion>
{
  private subject = new BehaviorSubject<Tripulacion[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: TripulacionService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Tripulacion[]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
    this.loadingSubject.complete();
  }

  load(data: any) {
console.log(data);
    let condition = this.SetWhereClause(data);
    let sort = this.SetOrderClause(data);

    this.loadingSubject.next(true);
if (data.MRWhere.length > 0){
        if(condition != null && condition.length > 0){
          condition = condition + " AND " + data.MRWhere;
        }
        if(condition == null || condition.length == 0){
          condition = data.MRWhere;
        }
      }

      if(data.MRSort.length > 0){
        sort = data.MRSort;
      }
    let page = data.page + 1;
    this.service
      .listaSelAll(
        page * data.size - data.size + 1,
        page * data.size,
        condition,
        sort
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: any) => {
        data.styles = [];
        data.columns.forEach((column, index) => {
          if (column === 'Clave') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones'  && column != 'Fotografia'  && column != 'Cargar_Licencia'  && column != 'Cargar_Certificado_Medico'  && column != 'Cargar_Pasaporte_1'  && column != 'Cargar_Pasaporte_2'  && column != 'Cargar_Visa_1'  && column != 'Cargar_Visa_2' ) { // Campos que no son acciones ni HTML ni Archivos
            try {
              const longest = result.Tripulacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Tripulacions);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Clave != "")
      condition += " and Tripulacion.Clave = " + data.filter.Clave;
    if (data.filter.Nombres != "")
      condition += " and Tripulacion.Nombres like '%" + data.filter.Nombres + "%' ";
    if (data.filter.Apellido_paterno != "")
      condition += " and Tripulacion.Apellido_paterno like '%" + data.filter.Apellido_paterno + "%' ";
    if (data.filter.Apellido_materno != "")
      condition += " and Tripulacion.Apellido_materno like '%" + data.filter.Apellido_materno + "%' ";
    if (data.filter.Nombre_completo != "")
      condition += " and Tripulacion.Nombre_completo like '%" + data.filter.Nombre_completo + "%' ";
    if (data.filter.Direccion != "")
      condition += " and Tripulacion.Direccion like '%" + data.filter.Direccion + "%' ";
    if (data.filter.Telefono != "")
      condition += " and Tripulacion.Telefono like '%" + data.filter.Telefono + "%' ";
    if (data.filter.Celular != "")
      condition += " and Tripulacion.Celular like '%" + data.filter.Celular + "%' ";
    if (data.filter.Correo_electronico != "")
      condition += " and Tripulacion.Correo_electronico like '%" + data.filter.Correo_electronico + "%' ";
    if (data.filter.Fecha_de_nacimiento)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_nacimiento, 102)  = '" + moment(data.filter.Fecha_de_nacimiento).format("YYYY.MM.DD") + "'";
    if (data.filter.Edad != "")
      condition += " and Tripulacion.Edad = " + data.filter.Edad;
    if (data.filter.Nacionalidad_1 != "")
      condition += " and Pais.Nacionalidad like '%" + data.filter.Nacionalidad_1 + "%' ";
    if (data.filter.Nacionalidad_2 != "")
      condition += " and Pais.Nacionalidad like '%" + data.filter.Nacionalidad_2 + "%' ";
    if (data.filter.Genero != "")
      condition += " and Genero.Descripcion like '%" + data.filter.Genero + "%' ";
    if (data.filter.Tipo_de_Tripulante != "")
      condition += " and Tipo_de_Tripulante.Descripcion like '%" + data.filter.Tipo_de_Tripulante + "%' ";
    if (data.filter.Pertenece_al_grupo != "")
      condition += " and Respuesta.Descripcion like '%" + data.filter.Pertenece_al_grupo + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_Tripulacion.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Usuario_Relacionado != "")
      condition += " and Creacion_de_Usuarios.Nombre_completo like '%" + data.filter.Usuario_Relacionado + "%' ";
    if (data.filter.Numero_de_Licencia != "")
      condition += " and Tripulacion.Numero_de_Licencia like '%" + data.filter.Numero_de_Licencia + "%' ";
    if (data.filter.Fecha_de_Emision_Licencia)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Licencia, 102)  = '" + moment(data.filter.Fecha_de_Emision_Licencia).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_licencia)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_licencia, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_licencia).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_licencia && data.filter.Alerta_de_vencimiento_licencia != "2") {
      if (data.filter.Alerta_de_vencimiento_licencia == "0" || data.filter.Alerta_de_vencimiento_licencia == "") {
        condition += " and (Tripulacion.Alerta_de_vencimiento_licencia = 0 or Tripulacion.Alerta_de_vencimiento_licencia is null)";
      } else {
        condition += " and Tripulacion.Alerta_de_vencimiento_licencia = 1";
      }
    }
    if (data.filter.Certificado_Medico != "")
      condition += " and Tripulacion.Certificado_Medico like '%" + data.filter.Certificado_Medico + "%' ";
    if (data.filter.Fecha_de_Emision_Certificado)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Certificado, 102)  = '" + moment(data.filter.Fecha_de_Emision_Certificado).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_certificado)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_certificado, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_certificado).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_certificado && data.filter.Alerta_de_vencimiento_certificado != "2") {
      if (data.filter.Alerta_de_vencimiento_certificado == "0" || data.filter.Alerta_de_vencimiento_certificado == "") {
        condition += " and (Tripulacion.Alerta_de_vencimiento_certificado = 0 or Tripulacion.Alerta_de_vencimiento_certificado is null)";
      } else {
        condition += " and Tripulacion.Alerta_de_vencimiento_certificado = 1";
      }
    }
    if (data.filter.Numero_de_Pasaporte_1 != "")
      condition += " and Tripulacion.Numero_de_Pasaporte_1 like '%" + data.filter.Numero_de_Pasaporte_1 + "%' ";
    if (data.filter.Fecha_de_Emision_Pasaporte_1)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Pasaporte_1, 102)  = '" + moment(data.filter.Fecha_de_Emision_Pasaporte_1).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_Pasaporte_1)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Pasaporte_1, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_Pasaporte_1).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_Pasaporte_1 && data.filter.Alerta_de_vencimiento_Pasaporte_1 != "2") {
      if (data.filter.Alerta_de_vencimiento_Pasaporte_1 == "0" || data.filter.Alerta_de_vencimiento_Pasaporte_1 == "") {
        condition += " and (Tripulacion.Alerta_de_vencimiento_Pasaporte_1 = 0 or Tripulacion.Alerta_de_vencimiento_Pasaporte_1 is null)";
      } else {
        condition += " and Tripulacion.Alerta_de_vencimiento_Pasaporte_1 = 1";
      }
    }
    if (data.filter.Pais_1 != "")
      condition += " and Pais.Nombre like '%" + data.filter.Pais_1 + "%' ";
    if (data.filter.Numero_de_Pasaporte_2 != "")
      condition += " and Tripulacion.Numero_de_Pasaporte_2 like '%" + data.filter.Numero_de_Pasaporte_2 + "%' ";
    if (data.filter.Fecha_de_Emision_Pasaporte_2)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Pasaporte_2, 102)  = '" + moment(data.filter.Fecha_de_Emision_Pasaporte_2).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_Pasaporte_2)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Pasaporte_2, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_Pasaporte_2).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_Pasaporte_2 && data.filter.Alerta_de_vencimiento_Pasaporte_2 != "2") {
      if (data.filter.Alerta_de_vencimiento_Pasaporte_2 == "0" || data.filter.Alerta_de_vencimiento_Pasaporte_2 == "") {
        condition += " and (Tripulacion.Alerta_de_vencimiento_Pasaporte_2 = 0 or Tripulacion.Alerta_de_vencimiento_Pasaporte_2 is null)";
      } else {
        condition += " and Tripulacion.Alerta_de_vencimiento_Pasaporte_2 = 1";
      }
    }
    if (data.filter.Pais_2 != "")
      condition += " and Pais.Nombre like '%" + data.filter.Pais_2 + "%' ";
    if (data.filter.Numero_de_Visa_1 != "")
      condition += " and Tripulacion.Numero_de_Visa_1 like '%" + data.filter.Numero_de_Visa_1 + "%' ";
    if (data.filter.Fecha_de_Emision_visa_1)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_visa_1, 102)  = '" + moment(data.filter.Fecha_de_Emision_visa_1).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_Visa_1)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Visa_1, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_Visa_1).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_Visa_1 && data.filter.Alerta_de_vencimiento_Visa_1 != "2") {
      if (data.filter.Alerta_de_vencimiento_Visa_1 == "0" || data.filter.Alerta_de_vencimiento_Visa_1 == "") {
        condition += " and (Tripulacion.Alerta_de_vencimiento_Visa_1 = 0 or Tripulacion.Alerta_de_vencimiento_Visa_1 is null)";
      } else {
        condition += " and Tripulacion.Alerta_de_vencimiento_Visa_1 = 1";
      }
    }
    if (data.filter.Pais_3 != "")
      condition += " and Pais.Nombre like '%" + data.filter.Pais_3 + "%' ";
    if (data.filter.Numero_de_Visa_2 != "")
      condition += " and Tripulacion.Numero_de_Visa_2 like '%" + data.filter.Numero_de_Visa_2 + "%' ";
    if (data.filter.Fecha_de_Emision_Visa_2)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Visa_2, 102)  = '" + moment(data.filter.Fecha_de_Emision_Visa_2).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_Visa_2)
      condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Visa_2, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_Visa_2).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_Visa_2 && data.filter.Alerta_de_vencimiento_Visa_2 != "2") {
      if (data.filter.Alerta_de_vencimiento_Visa_2 == "0" || data.filter.Alerta_de_vencimiento_Visa_2 == "") {
        condition += " and (Tripulacion.Alerta_de_vencimiento_Visa_2 = 0 or Tripulacion.Alerta_de_vencimiento_Visa_2 is null)";
      } else {
        condition += " and Tripulacion.Alerta_de_vencimiento_Visa_2 = 1";
      }
    }
    if (data.filter.Pais_4 != "")
      condition += " and Pais.Nombre like '%" + data.filter.Pais_4 + "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "Clave":
        sort = " Tripulacion.Clave " + data.sortDirecction;
        break;
      case "Nombres":
        sort = " Tripulacion.Nombres " + data.sortDirecction;
        break;
      case "Apellido_paterno":
        sort = " Tripulacion.Apellido_paterno " + data.sortDirecction;
        break;
      case "Apellido_materno":
        sort = " Tripulacion.Apellido_materno " + data.sortDirecction;
        break;
      case "Nombre_completo":
        sort = " Tripulacion.Nombre_completo " + data.sortDirecction;
        break;
      case "Direccion":
        sort = " Tripulacion.Direccion " + data.sortDirecction;
        break;
      case "Telefono":
        sort = " Tripulacion.Telefono " + data.sortDirecction;
        break;
      case "Celular":
        sort = " Tripulacion.Celular " + data.sortDirecction;
        break;
      case "Correo_electronico":
        sort = " Tripulacion.Correo_electronico " + data.sortDirecction;
        break;
      case "Fecha_de_nacimiento":
        sort = " Tripulacion.Fecha_de_nacimiento " + data.sortDirecction;
        break;
      case "Edad":
        sort = " Tripulacion.Edad " + data.sortDirecction;
        break;
      case "Nacionalidad_1":
        sort = " Pais.Nacionalidad " + data.sortDirecction;
        break;
      case "Nacionalidad_2":
        sort = " Pais.Nacionalidad " + data.sortDirecction;
        break;
      case "Genero":
        sort = " Genero.Descripcion " + data.sortDirecction;
        break;
      case "Tipo_de_Tripulante":
        sort = " Tipo_de_Tripulante.Descripcion " + data.sortDirecction;
        break;
      case "Pertenece_al_grupo":
        sort = " Respuesta.Descripcion " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_Tripulacion.Descripcion " + data.sortDirecction;
        break;
      case "Usuario_Relacionado":
        sort = " Creacion_de_Usuarios.Nombre_completo " + data.sortDirecction;
        break;
      case "Numero_de_Licencia":
        sort = " Tripulacion.Numero_de_Licencia " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Licencia":
        sort = " Tripulacion.Fecha_de_Emision_Licencia " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_licencia":
        sort = " Tripulacion.Fecha_de_vencimiento_licencia " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_licencia":
        sort = " Tripulacion.Alerta_de_vencimiento_licencia " + data.sortDirecction;
        break;
      case "Certificado_Medico":
        sort = " Tripulacion.Certificado_Medico " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Certificado":
        sort = " Tripulacion.Fecha_de_Emision_Certificado " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_certificado":
        sort = " Tripulacion.Fecha_de_vencimiento_certificado " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_certificado":
        sort = " Tripulacion.Alerta_de_vencimiento_certificado " + data.sortDirecction;
        break;
      case "Numero_de_Pasaporte_1":
        sort = " Tripulacion.Numero_de_Pasaporte_1 " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Pasaporte_1":
        sort = " Tripulacion.Fecha_de_Emision_Pasaporte_1 " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_Pasaporte_1":
        sort = " Tripulacion.Fecha_de_vencimiento_Pasaporte_1 " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_Pasaporte_1":
        sort = " Tripulacion.Alerta_de_vencimiento_Pasaporte_1 " + data.sortDirecction;
        break;
      case "Pais_1":
        sort = " Pais.Nombre " + data.sortDirecction;
        break;
      case "Numero_de_Pasaporte_2":
        sort = " Tripulacion.Numero_de_Pasaporte_2 " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Pasaporte_2":
        sort = " Tripulacion.Fecha_de_Emision_Pasaporte_2 " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_Pasaporte_2":
        sort = " Tripulacion.Fecha_de_vencimiento_Pasaporte_2 " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_Pasaporte_2":
        sort = " Tripulacion.Alerta_de_vencimiento_Pasaporte_2 " + data.sortDirecction;
        break;
      case "Pais_2":
        sort = " Pais.Nombre " + data.sortDirecction;
        break;
      case "Numero_de_Visa_1":
        sort = " Tripulacion.Numero_de_Visa_1 " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_visa_1":
        sort = " Tripulacion.Fecha_de_Emision_visa_1 " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_Visa_1":
        sort = " Tripulacion.Fecha_de_vencimiento_Visa_1 " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_Visa_1":
        sort = " Tripulacion.Alerta_de_vencimiento_Visa_1 " + data.sortDirecction;
        break;
      case "Pais_3":
        sort = " Pais.Nombre " + data.sortDirecction;
        break;
      case "Numero_de_Visa_2":
        sort = " Tripulacion.Numero_de_Visa_2 " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Visa_2":
        sort = " Tripulacion.Fecha_de_Emision_Visa_2 " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_Visa_2":
        sort = " Tripulacion.Fecha_de_vencimiento_Visa_2 " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_Visa_2":
        sort = " Tripulacion.Alerta_de_vencimiento_Visa_2 " + data.sortDirecction;
        break;
      case "Pais_4":
        sort = " Pais.Nombre " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromClave != 'undefined' && data.filterAdvanced.fromClave)
	|| (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave))
	{
      if (typeof data.filterAdvanced.fromClave != 'undefined' && data.filterAdvanced.fromClave)
        condition += " AND Tripulacion.Clave >= " + data.filterAdvanced.fromClave;

      if (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave)
        condition += " AND Tripulacion.Clave <= " + data.filterAdvanced.toClave;
    }
    switch (data.filterAdvanced.NombresFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Nombres LIKE '" + data.filterAdvanced.Nombres + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Nombres LIKE '%" + data.filterAdvanced.Nombres + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Nombres LIKE '%" + data.filterAdvanced.Nombres + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Nombres = '" + data.filterAdvanced.Nombres + "'";
        break;
    }
    switch (data.filterAdvanced.Apellido_paternoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Apellido_paterno LIKE '" + data.filterAdvanced.Apellido_paterno + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Apellido_paterno LIKE '%" + data.filterAdvanced.Apellido_paterno + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Apellido_paterno LIKE '%" + data.filterAdvanced.Apellido_paterno + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Apellido_paterno = '" + data.filterAdvanced.Apellido_paterno + "'";
        break;
    }
    switch (data.filterAdvanced.Apellido_maternoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Apellido_materno LIKE '" + data.filterAdvanced.Apellido_materno + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Apellido_materno LIKE '%" + data.filterAdvanced.Apellido_materno + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Apellido_materno LIKE '%" + data.filterAdvanced.Apellido_materno + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Apellido_materno = '" + data.filterAdvanced.Apellido_materno + "'";
        break;
    }
    switch (data.filterAdvanced.Nombre_completoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Nombre_completo LIKE '" + data.filterAdvanced.Nombre_completo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Nombre_completo LIKE '%" + data.filterAdvanced.Nombre_completo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Nombre_completo LIKE '%" + data.filterAdvanced.Nombre_completo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Nombre_completo = '" + data.filterAdvanced.Nombre_completo + "'";
        break;
    }
    switch (data.filterAdvanced.DireccionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Direccion LIKE '" + data.filterAdvanced.Direccion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Direccion LIKE '%" + data.filterAdvanced.Direccion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Direccion LIKE '%" + data.filterAdvanced.Direccion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Direccion = '" + data.filterAdvanced.Direccion + "'";
        break;
    }
    switch (data.filterAdvanced.TelefonoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Telefono LIKE '" + data.filterAdvanced.Telefono + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Telefono LIKE '%" + data.filterAdvanced.Telefono + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Telefono LIKE '%" + data.filterAdvanced.Telefono + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Telefono = '" + data.filterAdvanced.Telefono + "'";
        break;
    }
    switch (data.filterAdvanced.CelularFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Celular LIKE '" + data.filterAdvanced.Celular + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Celular LIKE '%" + data.filterAdvanced.Celular + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Celular LIKE '%" + data.filterAdvanced.Celular + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Celular = '" + data.filterAdvanced.Celular + "'";
        break;
    }
    switch (data.filterAdvanced.Correo_electronicoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Correo_electronico LIKE '" + data.filterAdvanced.Correo_electronico + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Correo_electronico LIKE '%" + data.filterAdvanced.Correo_electronico + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Correo_electronico LIKE '%" + data.filterAdvanced.Correo_electronico + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Correo_electronico = '" + data.filterAdvanced.Correo_electronico + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_nacimiento != 'undefined' && data.filterAdvanced.fromFecha_de_nacimiento)
	|| (typeof data.filterAdvanced.toFecha_de_nacimiento != 'undefined' && data.filterAdvanced.toFecha_de_nacimiento))
	{
      if (typeof data.filterAdvanced.fromFecha_de_nacimiento != 'undefined' && data.filterAdvanced.fromFecha_de_nacimiento)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_nacimiento, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_nacimiento).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_nacimiento != 'undefined' && data.filterAdvanced.toFecha_de_nacimiento)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_nacimiento, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_nacimiento).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromEdad != 'undefined' && data.filterAdvanced.fromEdad)
	|| (typeof data.filterAdvanced.toEdad != 'undefined' && data.filterAdvanced.toEdad))
	{
      if (typeof data.filterAdvanced.fromEdad != 'undefined' && data.filterAdvanced.fromEdad)
        condition += " AND Tripulacion.Edad >= " + data.filterAdvanced.fromEdad;

      if (typeof data.filterAdvanced.toEdad != 'undefined' && data.filterAdvanced.toEdad)
        condition += " AND Tripulacion.Edad <= " + data.filterAdvanced.toEdad;
    }
    if ((typeof data.filterAdvanced.Nacionalidad_1 != 'undefined' && data.filterAdvanced.Nacionalidad_1)) {
      switch (data.filterAdvanced.Nacionalidad_1Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Pais.Nacionalidad LIKE '" + data.filterAdvanced.Nacionalidad_1 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Pais.Nacionalidad LIKE '%" + data.filterAdvanced.Nacionalidad_1 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Pais.Nacionalidad LIKE '%" + data.filterAdvanced.Nacionalidad_1 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Pais.Nacionalidad = '" + data.filterAdvanced.Nacionalidad_1 + "'";
          break;
      }
    } else if (data.filterAdvanced.Nacionalidad_1Multiple != null && data.filterAdvanced.Nacionalidad_1Multiple.length > 0) {
      var Nacionalidad_1ds = data.filterAdvanced.Nacionalidad_1Multiple.join(",");
      condition += " AND Tripulacion.Nacionalidad_1 In (" + Nacionalidad_1ds + ")";
    }
    if ((typeof data.filterAdvanced.Nacionalidad_2 != 'undefined' && data.filterAdvanced.Nacionalidad_2)) {
      switch (data.filterAdvanced.Nacionalidad_2Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Pais.Nacionalidad LIKE '" + data.filterAdvanced.Nacionalidad_2 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Pais.Nacionalidad LIKE '%" + data.filterAdvanced.Nacionalidad_2 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Pais.Nacionalidad LIKE '%" + data.filterAdvanced.Nacionalidad_2 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Pais.Nacionalidad = '" + data.filterAdvanced.Nacionalidad_2 + "'";
          break;
      }
    } else if (data.filterAdvanced.Nacionalidad_2Multiple != null && data.filterAdvanced.Nacionalidad_2Multiple.length > 0) {
      var Nacionalidad_2ds = data.filterAdvanced.Nacionalidad_2Multiple.join(",");
      condition += " AND Tripulacion.Nacionalidad_2 In (" + Nacionalidad_2ds + ")";
    }
    if ((typeof data.filterAdvanced.Genero != 'undefined' && data.filterAdvanced.Genero)) {
      switch (data.filterAdvanced.GeneroFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Genero.Descripcion LIKE '" + data.filterAdvanced.Genero + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Genero.Descripcion LIKE '%" + data.filterAdvanced.Genero + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Genero.Descripcion LIKE '%" + data.filterAdvanced.Genero + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Genero.Descripcion = '" + data.filterAdvanced.Genero + "'";
          break;
      }
    } else if (data.filterAdvanced.GeneroMultiple != null && data.filterAdvanced.GeneroMultiple.length > 0) {
      var Generods = data.filterAdvanced.GeneroMultiple.join(",");
      condition += " AND Tripulacion.Genero In (" + Generods + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_Tripulante != 'undefined' && data.filterAdvanced.Tipo_de_Tripulante)) {
      switch (data.filterAdvanced.Tipo_de_TripulanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Tripulante.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Tripulante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Tripulante.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Tripulante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Tripulante.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Tripulante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Tripulante.Descripcion = '" + data.filterAdvanced.Tipo_de_Tripulante + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_TripulanteMultiple != null && data.filterAdvanced.Tipo_de_TripulanteMultiple.length > 0) {
      var Tipo_de_Tripulanteds = data.filterAdvanced.Tipo_de_TripulanteMultiple.join(",");
      condition += " AND Tripulacion.Tipo_de_Tripulante In (" + Tipo_de_Tripulanteds + ")";
    }
    if ((typeof data.filterAdvanced.Pertenece_al_grupo != 'undefined' && data.filterAdvanced.Pertenece_al_grupo)) {
      switch (data.filterAdvanced.Pertenece_al_grupoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Respuesta.Descripcion LIKE '" + data.filterAdvanced.Pertenece_al_grupo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Pertenece_al_grupo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Pertenece_al_grupo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Respuesta.Descripcion = '" + data.filterAdvanced.Pertenece_al_grupo + "'";
          break;
      }
    } else if (data.filterAdvanced.Pertenece_al_grupoMultiple != null && data.filterAdvanced.Pertenece_al_grupoMultiple.length > 0) {
      var Pertenece_al_grupods = data.filterAdvanced.Pertenece_al_grupoMultiple.join(",");
      condition += " AND Tripulacion.Pertenece_al_grupo In (" + Pertenece_al_grupods + ")";
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_Tripulacion.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_Tripulacion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_Tripulacion.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_Tripulacion.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Tripulacion.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.Usuario_Relacionado != 'undefined' && data.filterAdvanced.Usuario_Relacionado)) {
      switch (data.filterAdvanced.Usuario_RelacionadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '" + data.filterAdvanced.Usuario_Relacionado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '%" + data.filterAdvanced.Usuario_Relacionado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '%" + data.filterAdvanced.Usuario_Relacionado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Usuarios.Nombre_completo = '" + data.filterAdvanced.Usuario_Relacionado + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_RelacionadoMultiple != null && data.filterAdvanced.Usuario_RelacionadoMultiple.length > 0) {
      var Usuario_Relacionadods = data.filterAdvanced.Usuario_RelacionadoMultiple.join(",");
      condition += " AND Tripulacion.Usuario_Relacionado In (" + Usuario_Relacionadods + ")";
    }
    switch (data.filterAdvanced.Numero_de_LicenciaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Numero_de_Licencia LIKE '" + data.filterAdvanced.Numero_de_Licencia + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Numero_de_Licencia LIKE '%" + data.filterAdvanced.Numero_de_Licencia + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Numero_de_Licencia LIKE '%" + data.filterAdvanced.Numero_de_Licencia + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Numero_de_Licencia = '" + data.filterAdvanced.Numero_de_Licencia + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Licencia != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Licencia)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Licencia != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Licencia))
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Licencia != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Licencia)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Licencia, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Licencia).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Emision_Licencia != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Licencia)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Licencia, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Licencia).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_licencia != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_licencia)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_licencia != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_licencia))
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_licencia != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_licencia)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_licencia, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_licencia).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_vencimiento_licencia != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_licencia)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_licencia, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_licencia).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Certificado_MedicoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Certificado_Medico LIKE '" + data.filterAdvanced.Certificado_Medico + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Certificado_Medico LIKE '%" + data.filterAdvanced.Certificado_Medico + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Certificado_Medico LIKE '%" + data.filterAdvanced.Certificado_Medico + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Certificado_Medico = '" + data.filterAdvanced.Certificado_Medico + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Certificado != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Certificado)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Certificado != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Certificado))
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Certificado != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Certificado)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Certificado, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Certificado).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Emision_Certificado != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Certificado)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Certificado, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Certificado).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_certificado != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_certificado)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_certificado != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_certificado))
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_certificado != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_certificado)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_certificado, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_certificado).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_vencimiento_certificado != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_certificado)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_certificado, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_certificado).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Numero_de_Pasaporte_1Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Numero_de_Pasaporte_1 LIKE '" + data.filterAdvanced.Numero_de_Pasaporte_1 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Numero_de_Pasaporte_1 LIKE '%" + data.filterAdvanced.Numero_de_Pasaporte_1 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Numero_de_Pasaporte_1 LIKE '%" + data.filterAdvanced.Numero_de_Pasaporte_1 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Numero_de_Pasaporte_1 = '" + data.filterAdvanced.Numero_de_Pasaporte_1 + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Pasaporte_1 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Pasaporte_1))
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Pasaporte_1, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Emision_Pasaporte_1 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Pasaporte_1)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Pasaporte_1, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Pasaporte_1).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1))
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Pasaporte_1, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Pasaporte_1, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Pais_1 != 'undefined' && data.filterAdvanced.Pais_1)) {
      switch (data.filterAdvanced.Pais_1Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Pais.Nombre LIKE '" + data.filterAdvanced.Pais_1 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais_1 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais_1 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Pais.Nombre = '" + data.filterAdvanced.Pais_1 + "'";
          break;
      }
    } else if (data.filterAdvanced.Pais_1Multiple != null && data.filterAdvanced.Pais_1Multiple.length > 0) {
      var Pais_1ds = data.filterAdvanced.Pais_1Multiple.join(",");
      condition += " AND Tripulacion.Pais_1 In (" + Pais_1ds + ")";
    }
    switch (data.filterAdvanced.Numero_de_Pasaporte_2Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Numero_de_Pasaporte_2 LIKE '" + data.filterAdvanced.Numero_de_Pasaporte_2 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Numero_de_Pasaporte_2 LIKE '%" + data.filterAdvanced.Numero_de_Pasaporte_2 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Numero_de_Pasaporte_2 LIKE '%" + data.filterAdvanced.Numero_de_Pasaporte_2 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Numero_de_Pasaporte_2 = '" + data.filterAdvanced.Numero_de_Pasaporte_2 + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Pasaporte_2 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Pasaporte_2))
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Pasaporte_2, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Emision_Pasaporte_2 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Pasaporte_2)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Pasaporte_2, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Pasaporte_2).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2))
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Pasaporte_2, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Pasaporte_2, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Pais_2 != 'undefined' && data.filterAdvanced.Pais_2)) {
      switch (data.filterAdvanced.Pais_2Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Pais.Nombre LIKE '" + data.filterAdvanced.Pais_2 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais_2 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais_2 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Pais.Nombre = '" + data.filterAdvanced.Pais_2 + "'";
          break;
      }
    } else if (data.filterAdvanced.Pais_2Multiple != null && data.filterAdvanced.Pais_2Multiple.length > 0) {
      var Pais_2ds = data.filterAdvanced.Pais_2Multiple.join(",");
      condition += " AND Tripulacion.Pais_2 In (" + Pais_2ds + ")";
    }
    switch (data.filterAdvanced.Numero_de_Visa_1Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Numero_de_Visa_1 LIKE '" + data.filterAdvanced.Numero_de_Visa_1 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Numero_de_Visa_1 LIKE '%" + data.filterAdvanced.Numero_de_Visa_1 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Numero_de_Visa_1 LIKE '%" + data.filterAdvanced.Numero_de_Visa_1 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Numero_de_Visa_1 = '" + data.filterAdvanced.Numero_de_Visa_1 + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_visa_1 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_visa_1)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_visa_1 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_visa_1))
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_visa_1 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_visa_1)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_visa_1, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_visa_1).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Emision_visa_1 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_visa_1)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_visa_1, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_visa_1).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_Visa_1 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Visa_1)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_Visa_1 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Visa_1))
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_Visa_1 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Visa_1)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Visa_1, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_Visa_1).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_vencimiento_Visa_1 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Visa_1)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Visa_1, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_Visa_1).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Pais_3 != 'undefined' && data.filterAdvanced.Pais_3)) {
      switch (data.filterAdvanced.Pais_3Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Pais.Nombre LIKE '" + data.filterAdvanced.Pais_3 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais_3 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais_3 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Pais.Nombre = '" + data.filterAdvanced.Pais_3 + "'";
          break;
      }
    } else if (data.filterAdvanced.Pais_3Multiple != null && data.filterAdvanced.Pais_3Multiple.length > 0) {
      var Pais_3ds = data.filterAdvanced.Pais_3Multiple.join(",");
      condition += " AND Tripulacion.Pais_3 In (" + Pais_3ds + ")";
    }
    switch (data.filterAdvanced.Numero_de_Visa_2Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Tripulacion.Numero_de_Visa_2 LIKE '" + data.filterAdvanced.Numero_de_Visa_2 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Tripulacion.Numero_de_Visa_2 LIKE '%" + data.filterAdvanced.Numero_de_Visa_2 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Tripulacion.Numero_de_Visa_2 LIKE '%" + data.filterAdvanced.Numero_de_Visa_2 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Tripulacion.Numero_de_Visa_2 = '" + data.filterAdvanced.Numero_de_Visa_2 + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Visa_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Visa_2)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Visa_2 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Visa_2))
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Visa_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Visa_2)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Visa_2, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Visa_2).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Emision_Visa_2 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Visa_2)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_Emision_Visa_2, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Visa_2).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_Visa_2 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Visa_2)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_Visa_2 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Visa_2))
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_Visa_2 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Visa_2)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Visa_2, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_Visa_2).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_vencimiento_Visa_2 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Visa_2)
        condition += " and CONVERT(VARCHAR(10), Tripulacion.Fecha_de_vencimiento_Visa_2, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_Visa_2).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Pais_4 != 'undefined' && data.filterAdvanced.Pais_4)) {
      switch (data.filterAdvanced.Pais_4Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Pais.Nombre LIKE '" + data.filterAdvanced.Pais_4 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais_4 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Pais.Nombre LIKE '%" + data.filterAdvanced.Pais_4 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Pais.Nombre = '" + data.filterAdvanced.Pais_4 + "'";
          break;
      }
    } else if (data.filterAdvanced.Pais_4Multiple != null && data.filterAdvanced.Pais_4Multiple.length > 0) {
      var Pais_4ds = data.filterAdvanced.Pais_4Multiple.join(",");
      condition += " AND Tripulacion.Pais_4 In (" + Pais_4ds + ")";
    }


    this.loadingSubject.next(true);
    let page = data.page + 1;
    this.service
      .listaSelAll(
        page * data.size - data.size + 1,
        page * data.size,
        condition,
        sort
      )
      .pipe(
        catchError(() => of([])),
        finalize(() => this.loadingSubject.next(false))
      )
      .subscribe((result: any) => {
        data.styles = [];
        data.columns.forEach((column, index) => {
          if (column === 'Clave') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones'  && column != 'Fotografia'  && column != 'Cargar_Licencia'  && column != 'Cargar_Certificado_Medico'  && column != 'Cargar_Pasaporte_1'  && column != 'Cargar_Pasaporte_2'  && column != 'Cargar_Visa_1'  && column != 'Cargar_Visa_2' ) { // Campos que no son acciones ni HTML ni Archivos
            try {
              const longest = result.Tripulacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Tripulacions);
        this.totalSubject.next(result.RowCount);
      });
  }

  ShowFile(key: number | string) {
    const id = parseInt(key.toString());
    const file = this._file.getById(id).subscribe(
      data => {
        const url = this._file.url(data.File_Id.toString(), data.Description);
        window.open(url, '_blank');
      }
    );
  }

}
