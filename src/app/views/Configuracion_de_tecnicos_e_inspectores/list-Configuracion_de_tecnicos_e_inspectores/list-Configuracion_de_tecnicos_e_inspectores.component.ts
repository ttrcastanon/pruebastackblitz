import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Configuracion_de_tecnicos_e_inspectoresService } from "src/app/api-services/Configuracion_de_tecnicos_e_inspectores.service";
import { Configuracion_de_tecnicos_e_inspectores } from "src/app/models/Configuracion_de_tecnicos_e_inspectores";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild,Renderer2 } from "@angular/core";
import { CollectionViewer } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of } from "rxjs";
import { catchError, finalize, concatMap, switchMap, mergeMap, tap } from "rxjs/operators";
import { MatSort } from "@angular/material/sort";
import * as moment from "moment";
import { MatDialog } from "@angular/material/dialog";
import * as AppConstants from "../../../app-constants";
import { StorageKeys } from "../../../app-constants";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { Configuracion_de_tecnicos_e_inspectoresIndexRules } from 'src/app/shared/businessRules/Configuracion_de_tecnicos_e_inspectores-index-rules';
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
  selector: "app-list-Configuracion_de_tecnicos_e_inspectores",
  templateUrl: "./list-Configuracion_de_tecnicos_e_inspectores.component.html",
  styleUrls: ["./list-Configuracion_de_tecnicos_e_inspectores.component.scss"],
})
export class ListConfiguracion_de_tecnicos_e_inspectoresComponent extends Configuracion_de_tecnicos_e_inspectoresIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Nombres",
    "Apellido_paterno",
    "Apellido_materno",
    "Nombre_completo",
    "Cargo_desempenado",
    "Correo_electronico",
    "Celular",
    "Telefono",
    "Direccion",
    "Usuario_Registrado",
    "Usuario_Relacionado",
    "Numero_de_Licencia",
    "Fecha_de_Emision_Licencia",
    "Fecha_de_vencimiento",
    "Alerta_de_vencimiento",
    "Certificado_Medico",
    "Fecha_de_Emision_Certificado",
    "Fecha_de_vencimiento_cert",
    "Alerta_de_vencimiento_cert",
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
    "Fecha_de_Emision_Visa_1",
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
      "Folio",
      "Nombres",
      "Apellido_paterno",
      "Apellido_materno",
      "Nombre_completo",
      "Cargo_desempenado",
      "Correo_electronico",
      "Celular",
      "Telefono",
      "Direccion",
      "Usuario_Registrado",
      "Usuario_Relacionado",
      "Numero_de_Licencia",
      "Fecha_de_Emision_Licencia",
      "Fecha_de_vencimiento",
      "Alerta_de_vencimiento",
      "Cargar_Licencia",
      "Certificado_Medico",
      "Fecha_de_Emision_Certificado",
      "Fecha_de_vencimiento_cert",
      "Alerta_de_vencimiento_cert",
      "Cargar_Certificado_Medico",
      "Numero_de_Pasaporte_1",
      "Fecha_de_Emision_Pasaporte_1",
      "Fecha_de_vencimiento_Pasaporte_1",
      "Alerta_de_vencimiento_Pasaporte_1",
      "Pais_1",
      "Cargar_Pasaporte_1",
      "Numero_de_Pasaporte_2",
      "Fecha_de_Emision_Pasaporte_2",
      "Fecha_de_vencimiento_Pasaporte_2",
      "Alerta_de_vencimiento_Pasaporte_2",
      "Pais_2",
      "Cargar_Pasaporte_2",
      "Numero_de_Visa_1",
      "Fecha_de_Emision_Visa_1",
      "Fecha_de_vencimiento_Visa_1",
      "Alerta_de_vencimiento_Visa_1",
      "Pais_3",
      "Cargar_Visa_1",
      "Numero_de_Visa_2",
      "Fecha_de_Emision_Visa_2",
      "Fecha_de_vencimiento_Visa_2",
      "Alerta_de_vencimiento_Visa_2",
      "Pais_4",
      "Cargar_Visa_2",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Nombres_filtro",
      "Apellido_paterno_filtro",
      "Apellido_materno_filtro",
      "Nombre_completo_filtro",
      "Cargo_desempenado_filtro",
      "Correo_electronico_filtro",
      "Celular_filtro",
      "Telefono_filtro",
      "Direccion_filtro",
      "Usuario_Registrado_filtro",
      "Usuario_Relacionado_filtro",
      "Numero_de_Licencia_filtro",
      "Fecha_de_Emision_Licencia_filtro",
      "Fecha_de_vencimiento_filtro",
      "Alerta_de_vencimiento_filtro",
      "Cargar_Licencia_filtro",
      "Certificado_Medico_filtro",
      "Fecha_de_Emision_Certificado_filtro",
      "Fecha_de_vencimiento_cert_filtro",
      "Alerta_de_vencimiento_cert_filtro",
      "Cargar_Certificado_Medico_filtro",
      "Numero_de_Pasaporte_1_filtro",
      "Fecha_de_Emision_Pasaporte_1_filtro",
      "Fecha_de_vencimiento_Pasaporte_1_filtro",
      "Alerta_de_vencimiento_Pasaporte_1_filtro",
      "Pais_1_filtro",
      "Cargar_Pasaporte_1_filtro",
      "Numero_de_Pasaporte_2_filtro",
      "Fecha_de_Emision_Pasaporte_2_filtro",
      "Fecha_de_vencimiento_Pasaporte_2_filtro",
      "Alerta_de_vencimiento_Pasaporte_2_filtro",
      "Pais_2_filtro",
      "Cargar_Pasaporte_2_filtro",
      "Numero_de_Visa_1_filtro",
      "Fecha_de_Emision_Visa_1_filtro",
      "Fecha_de_vencimiento_Visa_1_filtro",
      "Alerta_de_vencimiento_Visa_1_filtro",
      "Pais_3_filtro",
      "Cargar_Visa_1_filtro",
      "Numero_de_Visa_2_filtro",
      "Fecha_de_Emision_Visa_2_filtro",
      "Fecha_de_vencimiento_Visa_2_filtro",
      "Alerta_de_vencimiento_Visa_2_filtro",
      "Pais_4_filtro",
      "Cargar_Visa_2_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Folio: "",
      Nombres: "",
      Apellido_paterno: "",
      Apellido_materno: "",
      Nombre_completo: "",
      Cargo_desempenado: "",
      Correo_electronico: "",
      Celular: "",
      Telefono: "",
      Direccion: "",
      Usuario_Registrado: "",
      Usuario_Relacionado: "",
      Numero_de_Licencia: "",
      Fecha_de_Emision_Licencia: null,
      Fecha_de_vencimiento: null,
      Alerta_de_vencimiento: "",
      Certificado_Medico: "",
      Fecha_de_Emision_Certificado: null,
      Fecha_de_vencimiento_cert: null,
      Alerta_de_vencimiento_cert: "",
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
      Fecha_de_Emision_Visa_1: null,
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
      fromFolio: "",
      toFolio: "",
      Cargo_desempenadoFilter: "",
      Cargo_desempenado: "",
      Cargo_desempenadoMultiple: "",
      Usuario_RegistradoFilter: "",
      Usuario_Registrado: "",
      Usuario_RegistradoMultiple: "",
      Usuario_RelacionadoFilter: "",
      Usuario_Relacionado: "",
      Usuario_RelacionadoMultiple: "",
      fromFecha_de_Emision_Licencia: "",
      toFecha_de_Emision_Licencia: "",
      fromFecha_de_vencimiento: "",
      toFecha_de_vencimiento: "",
      fromFecha_de_Emision_Certificado: "",
      toFecha_de_Emision_Certificado: "",
      fromFecha_de_vencimiento_cert: "",
      toFecha_de_vencimiento_cert: "",
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
      fromFecha_de_Emision_Visa_1: "",
      toFecha_de_Emision_Visa_1: "",
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

  dataSource: Configuracion_de_tecnicos_e_inspectoresDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Configuracion_de_tecnicos_e_inspectoresDataSource;
  dataClipboard: any;

  constructor(
    private _Configuracion_de_tecnicos_e_inspectoresService: Configuracion_de_tecnicos_e_inspectoresService,
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
    this.dataSource = new Configuracion_de_tecnicos_e_inspectoresDataSource(
      this._Configuracion_de_tecnicos_e_inspectoresService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Configuracion_de_tecnicos_e_inspectores)
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
    this.listConfig.filter.Folio = "";
    this.listConfig.filter.Nombres = "";
    this.listConfig.filter.Apellido_paterno = "";
    this.listConfig.filter.Apellido_materno = "";
    this.listConfig.filter.Nombre_completo = "";
    this.listConfig.filter.Cargo_desempenado = "";
    this.listConfig.filter.Correo_electronico = "";
    this.listConfig.filter.Celular = "";
    this.listConfig.filter.Telefono = "";
    this.listConfig.filter.Direccion = "";
    this.listConfig.filter.Usuario_Registrado = "";
    this.listConfig.filter.Usuario_Relacionado = "";
    this.listConfig.filter.Numero_de_Licencia = "";
    this.listConfig.filter.Fecha_de_Emision_Licencia = undefined;
    this.listConfig.filter.Fecha_de_vencimiento = undefined;
    this.listConfig.filter.Alerta_de_vencimiento = undefined;
    this.listConfig.filter.Certificado_Medico = "";
    this.listConfig.filter.Fecha_de_Emision_Certificado = undefined;
    this.listConfig.filter.Fecha_de_vencimiento_cert = undefined;
    this.listConfig.filter.Alerta_de_vencimiento_cert = undefined;
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
    this.listConfig.filter.Fecha_de_Emision_Visa_1 = undefined;
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

//INICIA - BRID:1443 - regla para cargar unicamente tecnicos e instructores - Autor: Administrador - Actualización: 3/10/2021 10:00:06 PM
this.brf.SetFilteronList(this.listConfig,"Configuracion_de_tecnicos_e_inspectores.Folio in (SELECT Folio FROM Configuracion_de_tecnicos_e_inspectores WHERE Cargo_desempenado IN(21))");
//TERMINA - BRID:1443

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

  remove(row: Configuracion_de_tecnicos_e_inspectores) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Configuracion_de_tecnicos_e_inspectoresService
          .delete(+row.Folio)
          .pipe(
            catchError(() => of([])),
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
  ActionPrint(dataRow: Configuracion_de_tecnicos_e_inspectores) {

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
'Técnico ID'
,'Nombre(s)'
,'Apellido paterno'
,'Apellido materno'
,'Nombre completo'
,'Rol en el Sistema'
,'Correo electrónico'
,'Celular'
,'Teléfono'
,'Dirección'
,'Usuario Registrado'
,'Usuario Relacionado'
,'Número de Licencia'
,'Fecha de Emisión Licencia'
,'Fecha de vencimiento'
,'Alerta de vencimiento'
,'Certificado Médico'
,'Fecha de Emisión Certificado'
,'Número de Pasaporte (1)'
,'Fecha de Emisión Pasaporte (1)'
,'Fecha de vencimiento Pasaporte (1)'
,'Alerta de vencimiento Pasaporte (1)'
,'País'
,'Número de Pasaporte (2)'
,'Fecha de Emisión Pasaporte (2)'
,'Fecha de vencimiento Pasaporte (2)'
,'Alerta de vencimiento Pasaporte (2)'
,'Número de Visa (1)'
,'Fecha de Emisión Visa (1)'
,'Fecha de vencimiento Visa (1)'
,'Alerta de vencimiento Visa (1)'
,'Número de Visa (2)'
,'Fecha de Emisión Visa (2)'
,'Fecha de vencimiento Visa (2)'
,'Alerta de vencimiento Visa (2)'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Nombres
,x.Apellido_paterno
,x.Apellido_materno
,x.Nombre_completo
,x.Cargo_desempenado_Cargos.Descripcion
,x.Correo_electronico
,x.Celular
,x.Telefono
,x.Direccion
,x.Usuario_Registrado_Spartan_User.Name
,x.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo
,x.Numero_de_Licencia
,x.Fecha_de_Emision_Licencia
,x.Fecha_de_vencimiento
,x.Alerta_de_vencimiento
,x.Certificado_Medico
,x.Fecha_de_Emision_Certificado
,x.Fecha_de_vencimiento_cert
,x.Alerta_de_vencimiento_cert
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
,x.Fecha_de_Emision_Visa_1
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
    pdfMake.createPdf(pdfDefinition).download('Configuracion_de_tecnicos_e_inspectores.pdf');
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
          this._Configuracion_de_tecnicos_e_inspectoresService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Configuracion_de_tecnicos_e_inspectoress;
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
          this._Configuracion_de_tecnicos_e_inspectoresService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Configuracion_de_tecnicos_e_inspectoress;
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
        'Técnico ID ': fields.Folio,
        'Nombre(s) ': fields.Nombres,
        'Apellido paterno ': fields.Apellido_paterno,
        'Apellido materno ': fields.Apellido_materno,
        'Nombre completo ': fields.Nombre_completo,
        'Rol en el Sistema ': fields.Cargo_desempenado_Cargos.Descripcion,
        'Correo electrónico ': fields.Correo_electronico,
        'Celular ': fields.Celular,
        'Teléfono ': fields.Telefono,
        'Dirección ': fields.Direccion,
        'Usuario Registrado ': fields.Usuario_Registrado_Spartan_User.Name,
        'Usuario Relacionado ': fields.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo,
        'Número de Licencia ': fields.Numero_de_Licencia,
        'Fecha de Emisión Licencia ': fields.Fecha_de_Emision_Licencia ? momentJS(fields.Fecha_de_Emision_Licencia).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento ': fields.Fecha_de_vencimiento ? momentJS(fields.Fecha_de_vencimiento).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento ': fields.Alerta_de_vencimiento ? 'SI' : 'NO',
        'Certificado Médico ': fields.Certificado_Medico,
        'Fecha de Emisión Certificado ': fields.Fecha_de_Emision_Certificado ? momentJS(fields.Fecha_de_Emision_Certificado).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento 1': fields.Fecha_de_vencimiento_cert ? momentJS(fields.Fecha_de_vencimiento_cert).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_cert ': fields.Alerta_de_vencimiento_cert ? 'SI' : 'NO',
        'Número de Pasaporte (1) ': fields.Numero_de_Pasaporte_1,
        'Fecha de Emisión Pasaporte (1) ': fields.Fecha_de_Emision_Pasaporte_1 ? momentJS(fields.Fecha_de_Emision_Pasaporte_1).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento Pasaporte (1) ': fields.Fecha_de_vencimiento_Pasaporte_1 ? momentJS(fields.Fecha_de_vencimiento_Pasaporte_1).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_Pasaporte_1 ': fields.Alerta_de_vencimiento_Pasaporte_1 ? 'SI' : 'NO',
        'País ': fields.Pais_1_Pais.Nombre,
        'Número de Pasaporte (2) ': fields.Numero_de_Pasaporte_2,
        'Fecha de Emisión Pasaporte (2) ': fields.Fecha_de_Emision_Pasaporte_2 ? momentJS(fields.Fecha_de_Emision_Pasaporte_2).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento Pasaporte (2) ': fields.Fecha_de_vencimiento_Pasaporte_2 ? momentJS(fields.Fecha_de_vencimiento_Pasaporte_2).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_Pasaporte_2 ': fields.Alerta_de_vencimiento_Pasaporte_2 ? 'SI' : 'NO',
        'País 1': fields.Pais_2_Pais.Nombre,
        'Número de Visa (1) ': fields.Numero_de_Visa_1,
        'Fecha de Emisión Visa (1) ': fields.Fecha_de_Emision_Visa_1 ? momentJS(fields.Fecha_de_Emision_Visa_1).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento Visa (1) ': fields.Fecha_de_vencimiento_Visa_1 ? momentJS(fields.Fecha_de_vencimiento_Visa_1).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_Visa_1 ': fields.Alerta_de_vencimiento_Visa_1 ? 'SI' : 'NO',
        'País 2': fields.Pais_3_Pais.Nombre,
        'Número de Visa (2) ': fields.Numero_de_Visa_2,
        'Fecha de Emisión Visa (2) ': fields.Fecha_de_Emision_Visa_2 ? momentJS(fields.Fecha_de_Emision_Visa_2).format('DD/MM/YYYY') : '',
        'Fecha de vencimiento Visa (2) ': fields.Fecha_de_vencimiento_Visa_2 ? momentJS(fields.Fecha_de_vencimiento_Visa_2).format('DD/MM/YYYY') : '',
        'Alerta_de_vencimiento_Visa_2 ': fields.Alerta_de_vencimiento_Visa_2 ? 'SI' : 'NO',
        'País 3': fields.Pais_4_Pais.Nombre,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Configuracion_de_tecnicos_e_inspectores  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Nombres: x.Nombres,
      Apellido_paterno: x.Apellido_paterno,
      Apellido_materno: x.Apellido_materno,
      Nombre_completo: x.Nombre_completo,
      Cargo_desempenado: x.Cargo_desempenado_Cargos.Descripcion,
      Correo_electronico: x.Correo_electronico,
      Celular: x.Celular,
      Telefono: x.Telefono,
      Direccion: x.Direccion,
      Usuario_Registrado: x.Usuario_Registrado_Spartan_User.Name,
      Usuario_Relacionado: x.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo,
      Numero_de_Licencia: x.Numero_de_Licencia,
      Fecha_de_Emision_Licencia: x.Fecha_de_Emision_Licencia,
      Fecha_de_vencimiento: x.Fecha_de_vencimiento,
      Alerta_de_vencimiento: x.Alerta_de_vencimiento,
      Certificado_Medico: x.Certificado_Medico,
      Fecha_de_Emision_Certificado: x.Fecha_de_Emision_Certificado,
      Fecha_de_vencimiento_cert: x.Fecha_de_vencimiento_cert,
      Alerta_de_vencimiento_cert: x.Alerta_de_vencimiento_cert,
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
      Fecha_de_Emision_Visa_1: x.Fecha_de_Emision_Visa_1,
      Fecha_de_vencimiento_Visa_1: x.Fecha_de_vencimiento_Visa_1,
      Alerta_de_vencimiento_Visa_1: x.Alerta_de_vencimiento_Visa_1,
      Pais_3: x.Pais_3_Pais.Nombre,
      Numero_de_Visa_2: x.Numero_de_Visa_2,
      Fecha_de_Emision_Visa_2: x.Fecha_de_Emision_Visa_2,
      Fecha_de_vencimiento_Visa_2: x.Fecha_de_vencimiento_Visa_2,
      Alerta_de_vencimiento_Visa_2: x.Alerta_de_vencimiento_Visa_2,
      Pais_4: x.Pais_4_Pais.Nombre,

    }));

    this.excelService.exportToCsv(result, 'Configuracion_de_tecnicos_e_inspectores',  ['Folio'    ,'Nombres'  ,'Apellido_paterno'  ,'Apellido_materno'  ,'Nombre_completo'  ,'Cargo_desempenado'  ,'Correo_electronico'  ,'Celular'  ,'Telefono'  ,'Direccion'  ,'Usuario_Registrado'  ,'Usuario_Relacionado'  ,'Numero_de_Licencia'  ,'Fecha_de_Emision_Licencia'  ,'Fecha_de_vencimiento'  ,'Alerta_de_vencimiento'  ,'Certificado_Medico'  ,'Fecha_de_Emision_Certificado'  ,'Fecha_de_vencimiento_cert'  ,'Alerta_de_vencimiento_cert'  ,'Numero_de_Pasaporte_1'  ,'Fecha_de_Emision_Pasaporte_1'  ,'Fecha_de_vencimiento_Pasaporte_1'  ,'Alerta_de_vencimiento_Pasaporte_1'  ,'Pais_1'  ,'Numero_de_Pasaporte_2'  ,'Fecha_de_Emision_Pasaporte_2'  ,'Fecha_de_vencimiento_Pasaporte_2'  ,'Alerta_de_vencimiento_Pasaporte_2'  ,'Pais_2'  ,'Numero_de_Visa_1'  ,'Fecha_de_Emision_Visa_1'  ,'Fecha_de_vencimiento_Visa_1'  ,'Alerta_de_vencimiento_Visa_1'  ,'Pais_3'  ,'Numero_de_Visa_2'  ,'Fecha_de_Emision_Visa_2'  ,'Fecha_de_vencimiento_Visa_2'  ,'Alerta_de_vencimiento_Visa_2'  ,'Pais_4' ]);
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
    template += '          <th>Técnico ID</th>';
    template += '          <th>Nombre(s)</th>';
    template += '          <th>Apellido paterno</th>';
    template += '          <th>Apellido materno</th>';
    template += '          <th>Nombre completo</th>';
    template += '          <th>Rol en el Sistema</th>';
    template += '          <th>Correo electrónico</th>';
    template += '          <th>Celular</th>';
    template += '          <th>Teléfono</th>';
    template += '          <th>Dirección</th>';
    template += '          <th>Usuario Registrado</th>';
    template += '          <th>Usuario Relacionado</th>';
    template += '          <th>Número de Licencia</th>';
    template += '          <th>Fecha de Emisión Licencia</th>';
    template += '          <th>Fecha de vencimiento</th>';
    template += '          <th>Alerta de vencimiento</th>';
    template += '          <th>Certificado Médico</th>';
    template += '          <th>Fecha de Emisión Certificado</th>';
    template += '          <th>Número de Pasaporte (1)</th>';
    template += '          <th>Fecha de Emisión Pasaporte (1)</th>';
    template += '          <th>Fecha de vencimiento Pasaporte (1)</th>';
    template += '          <th>Alerta de vencimiento Pasaporte (1)</th>';
    template += '          <th>País</th>';
    template += '          <th>Número de Pasaporte (2)</th>';
    template += '          <th>Fecha de Emisión Pasaporte (2)</th>';
    template += '          <th>Fecha de vencimiento Pasaporte (2)</th>';
    template += '          <th>Alerta de vencimiento Pasaporte (2)</th>';
    template += '          <th>Número de Visa (1)</th>';
    template += '          <th>Fecha de Emisión Visa (1)</th>';
    template += '          <th>Fecha de vencimiento Visa (1)</th>';
    template += '          <th>Alerta de vencimiento Visa (1)</th>';
    template += '          <th>Número de Visa (2)</th>';
    template += '          <th>Fecha de Emisión Visa (2)</th>';
    template += '          <th>Fecha de vencimiento Visa (2)</th>';
    template += '          <th>Alerta de vencimiento Visa (2)</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Nombres + '</td>';
      template += '          <td>' + element.Apellido_paterno + '</td>';
      template += '          <td>' + element.Apellido_materno + '</td>';
      template += '          <td>' + element.Nombre_completo + '</td>';
      template += '          <td>' + element.Cargo_desempenado_Cargos.Descripcion + '</td>';
      template += '          <td>' + element.Correo_electronico + '</td>';
      template += '          <td>' + element.Celular + '</td>';
      template += '          <td>' + element.Telefono + '</td>';
      template += '          <td>' + element.Direccion + '</td>';
      template += '          <td>' + element.Usuario_Registrado_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo + '</td>';
      template += '          <td>' + element.Numero_de_Licencia + '</td>';
      template += '          <td>' + element.Fecha_de_Emision_Licencia + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento + '</td>';
      template += '          <td>' + element.Certificado_Medico + '</td>';
      template += '          <td>' + element.Fecha_de_Emision_Certificado + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento_cert + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento_cert + '</td>';
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
      template += '          <td>' + element.Fecha_de_Emision_Visa_1 + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento_Visa_1 + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento_Visa_1 + '</td>';
      template += '          <td>' + element.Pais_3_Pais.Nombre + '</td>';
      template += '          <td>' + element.Numero_de_Visa_2 + '</td>';
      template += '          <td>' + element.Fecha_de_Emision_Visa_2 + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento_Visa_2 + '</td>';
      template += '          <td>' + element.Alerta_de_vencimiento_Visa_2 + '</td>';
      template += '          <td>' + element.Pais_4_Pais.Nombre + '</td>';
		  
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
	template += '\t Técnico ID';
	template += '\t Nombre(s)';
	template += '\t Apellido paterno';
	template += '\t Apellido materno';
	template += '\t Nombre completo';
	template += '\t Rol en el Sistema';
	template += '\t Correo electrónico';
	template += '\t Celular';
	template += '\t Teléfono';
	template += '\t Dirección';
	template += '\t Usuario Registrado';
	template += '\t Usuario Relacionado';
	template += '\t Número de Licencia';
	template += '\t Fecha de Emisión Licencia';
	template += '\t Fecha de vencimiento';
	template += '\t Alerta de vencimiento';
	template += '\t Certificado Médico';
	template += '\t Fecha de Emisión Certificado';
	template += '\t Número de Pasaporte (1)';
	template += '\t Fecha de Emisión Pasaporte (1)';
	template += '\t Fecha de vencimiento Pasaporte (1)';
	template += '\t Alerta de vencimiento Pasaporte (1)';
	template += '\t País';
	template += '\t Número de Pasaporte (2)';
	template += '\t Fecha de Emisión Pasaporte (2)';
	template += '\t Fecha de vencimiento Pasaporte (2)';
	template += '\t Alerta de vencimiento Pasaporte (2)';
	template += '\t Número de Visa (1)';
	template += '\t Fecha de Emisión Visa (1)';
	template += '\t Fecha de vencimiento Visa (1)';
	template += '\t Alerta de vencimiento Visa (1)';
	template += '\t Número de Visa (2)';
	template += '\t Fecha de Emisión Visa (2)';
	template += '\t Fecha de vencimiento Visa (2)';
	template += '\t Alerta de vencimiento Visa (2)';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Nombres;
	  template += '\t ' + element.Apellido_paterno;
	  template += '\t ' + element.Apellido_materno;
	  template += '\t ' + element.Nombre_completo;
      template += '\t ' + element.Cargo_desempenado_Cargos.Descripcion;
	  template += '\t ' + element.Correo_electronico;
	  template += '\t ' + element.Celular;
	  template += '\t ' + element.Telefono;
	  template += '\t ' + element.Direccion;
      template += '\t ' + element.Usuario_Registrado_Spartan_User.Name;
      template += '\t ' + element.Usuario_Relacionado_Creacion_de_Usuarios.Nombre_completo;
	  template += '\t ' + element.Numero_de_Licencia;
	  template += '\t ' + element.Fecha_de_Emision_Licencia;
	  template += '\t ' + element.Fecha_de_vencimiento;
	  template += '\t ' + element.Alerta_de_vencimiento;
	  template += '\t ' + element.Certificado_Medico;
	  template += '\t ' + element.Fecha_de_Emision_Certificado;
	  template += '\t ' + element.Fecha_de_vencimiento_cert;
	  template += '\t ' + element.Alerta_de_vencimiento_cert;
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
	  template += '\t ' + element.Fecha_de_Emision_Visa_1;
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

export class Configuracion_de_tecnicos_e_inspectoresDataSource implements DataSource<Configuracion_de_tecnicos_e_inspectores>
{
  private subject = new BehaviorSubject<Configuracion_de_tecnicos_e_inspectores[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Configuracion_de_tecnicos_e_inspectoresService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Configuracion_de_tecnicos_e_inspectores[]> {
    return this.subject.asObservable();
  }

  disconnect(collectionViewer: CollectionViewer): void {
    this.subject.complete();
    this.loadingSubject.complete();
  }

  load(data: any) {

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
          if (column === 'Folio') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones'  && column != 'Cargar_Licencia'  && column != 'Cargar_Certificado_Medico'  && column != 'Cargar_Pasaporte_1'  && column != 'Cargar_Pasaporte_2'  && column != 'Cargar_Visa_1'  && column != 'Cargar_Visa_2' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Configuracion_de_tecnicos_e_inspectoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Configuracion_de_tecnicos_e_inspectoress);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Folio != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Folio = " + data.filter.Folio;
    if (data.filter.Nombres != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Nombres like '%" + data.filter.Nombres + "%' ";
    if (data.filter.Apellido_paterno != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Apellido_paterno like '%" + data.filter.Apellido_paterno + "%' ";
    if (data.filter.Apellido_materno != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Apellido_materno like '%" + data.filter.Apellido_materno + "%' ";
    if (data.filter.Nombre_completo != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Nombre_completo like '%" + data.filter.Nombre_completo + "%' ";
    if (data.filter.Cargo_desempenado != "")
      condition += " and Cargos.Descripcion like '%" + data.filter.Cargo_desempenado + "%' ";
    if (data.filter.Correo_electronico != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Correo_electronico like '%" + data.filter.Correo_electronico + "%' ";
    if (data.filter.Celular != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Celular like '%" + data.filter.Celular + "%' ";
    if (data.filter.Telefono != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Telefono like '%" + data.filter.Telefono + "%' ";
    if (data.filter.Direccion != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Direccion like '%" + data.filter.Direccion + "%' ";
    if (data.filter.Usuario_Registrado != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_Registrado + "%' ";
    if (data.filter.Usuario_Relacionado != "")
      condition += " and Creacion_de_Usuarios.Nombre_completo like '%" + data.filter.Usuario_Relacionado + "%' ";
    if (data.filter.Numero_de_Licencia != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Numero_de_Licencia like '%" + data.filter.Numero_de_Licencia + "%' ";
    if (data.filter.Fecha_de_Emision_Licencia)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Licencia, 102)  = '" + moment(data.filter.Fecha_de_Emision_Licencia).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento, 102)  = '" + moment(data.filter.Fecha_de_vencimiento).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento && data.filter.Alerta_de_vencimiento != "2") {
      if (data.filter.Alerta_de_vencimiento == "0" || data.filter.Alerta_de_vencimiento == "") {
        condition += " and (Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento = 0 or Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento is null)";
      } else {
        condition += " and Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento = 1";
      }
    }
    if (data.filter.Certificado_Medico != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Certificado_Medico like '%" + data.filter.Certificado_Medico + "%' ";
    if (data.filter.Fecha_de_Emision_Certificado)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Certificado, 102)  = '" + moment(data.filter.Fecha_de_Emision_Certificado).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_cert)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_cert, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_cert).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_cert && data.filter.Alerta_de_vencimiento_cert != "2") {
      if (data.filter.Alerta_de_vencimiento_cert == "0" || data.filter.Alerta_de_vencimiento_cert == "") {
        condition += " and (Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_cert = 0 or Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_cert is null)";
      } else {
        condition += " and Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_cert = 1";
      }
    }
    if (data.filter.Numero_de_Pasaporte_1 != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_1 like '%" + data.filter.Numero_de_Pasaporte_1 + "%' ";
    if (data.filter.Fecha_de_Emision_Pasaporte_1)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Pasaporte_1, 102)  = '" + moment(data.filter.Fecha_de_Emision_Pasaporte_1).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_Pasaporte_1)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Pasaporte_1, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_Pasaporte_1).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_Pasaporte_1 && data.filter.Alerta_de_vencimiento_Pasaporte_1 != "2") {
      if (data.filter.Alerta_de_vencimiento_Pasaporte_1 == "0" || data.filter.Alerta_de_vencimiento_Pasaporte_1 == "") {
        condition += " and (Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Pasaporte_1 = 0 or Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Pasaporte_1 is null)";
      } else {
        condition += " and Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Pasaporte_1 = 1";
      }
    }
    if (data.filter.Pais_1 != "")
      condition += " and Pais.Nombre like '%" + data.filter.Pais_1 + "%' ";
    if (data.filter.Numero_de_Pasaporte_2 != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_2 like '%" + data.filter.Numero_de_Pasaporte_2 + "%' ";
    if (data.filter.Fecha_de_Emision_Pasaporte_2)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Pasaporte_2, 102)  = '" + moment(data.filter.Fecha_de_Emision_Pasaporte_2).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_Pasaporte_2)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Pasaporte_2, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_Pasaporte_2).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_Pasaporte_2 && data.filter.Alerta_de_vencimiento_Pasaporte_2 != "2") {
      if (data.filter.Alerta_de_vencimiento_Pasaporte_2 == "0" || data.filter.Alerta_de_vencimiento_Pasaporte_2 == "") {
        condition += " and (Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Pasaporte_2 = 0 or Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Pasaporte_2 is null)";
      } else {
        condition += " and Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Pasaporte_2 = 1";
      }
    }
    if (data.filter.Pais_2 != "")
      condition += " and Pais.Nombre like '%" + data.filter.Pais_2 + "%' ";
    if (data.filter.Numero_de_Visa_1 != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_1 like '%" + data.filter.Numero_de_Visa_1 + "%' ";
    if (data.filter.Fecha_de_Emision_Visa_1)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Visa_1, 102)  = '" + moment(data.filter.Fecha_de_Emision_Visa_1).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_Visa_1)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Visa_1, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_Visa_1).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_Visa_1 && data.filter.Alerta_de_vencimiento_Visa_1 != "2") {
      if (data.filter.Alerta_de_vencimiento_Visa_1 == "0" || data.filter.Alerta_de_vencimiento_Visa_1 == "") {
        condition += " and (Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Visa_1 = 0 or Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Visa_1 is null)";
      } else {
        condition += " and Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Visa_1 = 1";
      }
    }
    if (data.filter.Pais_3 != "")
      condition += " and Pais.Nombre like '%" + data.filter.Pais_3 + "%' ";
    if (data.filter.Numero_de_Visa_2 != "")
      condition += " and Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_2 like '%" + data.filter.Numero_de_Visa_2 + "%' ";
    if (data.filter.Fecha_de_Emision_Visa_2)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Visa_2, 102)  = '" + moment(data.filter.Fecha_de_Emision_Visa_2).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_vencimiento_Visa_2)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Visa_2, 102)  = '" + moment(data.filter.Fecha_de_vencimiento_Visa_2).format("YYYY.MM.DD") + "'";
    if (data.filter.Alerta_de_vencimiento_Visa_2 && data.filter.Alerta_de_vencimiento_Visa_2 != "2") {
      if (data.filter.Alerta_de_vencimiento_Visa_2 == "0" || data.filter.Alerta_de_vencimiento_Visa_2 == "") {
        condition += " and (Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Visa_2 = 0 or Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Visa_2 is null)";
      } else {
        condition += " and Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Visa_2 = 1";
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
      case "Folio":
        sort = " Configuracion_de_tecnicos_e_inspectores.Folio " + data.sortDirecction;
        break;
      case "Nombres":
        sort = " Configuracion_de_tecnicos_e_inspectores.Nombres " + data.sortDirecction;
        break;
      case "Apellido_paterno":
        sort = " Configuracion_de_tecnicos_e_inspectores.Apellido_paterno " + data.sortDirecction;
        break;
      case "Apellido_materno":
        sort = " Configuracion_de_tecnicos_e_inspectores.Apellido_materno " + data.sortDirecction;
        break;
      case "Nombre_completo":
        sort = " Configuracion_de_tecnicos_e_inspectores.Nombre_completo " + data.sortDirecction;
        break;
      case "Cargo_desempenado":
        sort = " Cargos.Descripcion " + data.sortDirecction;
        break;
      case "Correo_electronico":
        sort = " Configuracion_de_tecnicos_e_inspectores.Correo_electronico " + data.sortDirecction;
        break;
      case "Celular":
        sort = " Configuracion_de_tecnicos_e_inspectores.Celular " + data.sortDirecction;
        break;
      case "Telefono":
        sort = " Configuracion_de_tecnicos_e_inspectores.Telefono " + data.sortDirecction;
        break;
      case "Direccion":
        sort = " Configuracion_de_tecnicos_e_inspectores.Direccion " + data.sortDirecction;
        break;
      case "Usuario_Registrado":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Usuario_Relacionado":
        sort = " Creacion_de_Usuarios.Nombre_completo " + data.sortDirecction;
        break;
      case "Numero_de_Licencia":
        sort = " Configuracion_de_tecnicos_e_inspectores.Numero_de_Licencia " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Licencia":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Licencia " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento":
        sort = " Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento " + data.sortDirecction;
        break;
      case "Certificado_Medico":
        sort = " Configuracion_de_tecnicos_e_inspectores.Certificado_Medico " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Certificado":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Certificado " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_cert":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_cert " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_cert":
        sort = " Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_cert " + data.sortDirecction;
        break;
      case "Numero_de_Pasaporte_1":
        sort = " Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_1 " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Pasaporte_1":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Pasaporte_1 " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_Pasaporte_1":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Pasaporte_1 " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_Pasaporte_1":
        sort = " Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Pasaporte_1 " + data.sortDirecction;
        break;
      case "Pais_1":
        sort = " Pais.Nombre " + data.sortDirecction;
        break;
      case "Numero_de_Pasaporte_2":
        sort = " Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_2 " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Pasaporte_2":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Pasaporte_2 " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_Pasaporte_2":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Pasaporte_2 " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_Pasaporte_2":
        sort = " Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Pasaporte_2 " + data.sortDirecction;
        break;
      case "Pais_2":
        sort = " Pais.Nombre " + data.sortDirecction;
        break;
      case "Numero_de_Visa_1":
        sort = " Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_1 " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Visa_1":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Visa_1 " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_Visa_1":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Visa_1 " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_Visa_1":
        sort = " Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Visa_1 " + data.sortDirecction;
        break;
      case "Pais_3":
        sort = " Pais.Nombre " + data.sortDirecction;
        break;
      case "Numero_de_Visa_2":
        sort = " Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_2 " + data.sortDirecction;
        break;
      case "Fecha_de_Emision_Visa_2":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Visa_2 " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento_Visa_2":
        sort = " Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Visa_2 " + data.sortDirecction;
        break;
      case "Alerta_de_vencimiento_Visa_2":
        sort = " Configuracion_de_tecnicos_e_inspectores.Alerta_de_vencimiento_Visa_2 " + data.sortDirecction;
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
    if ((typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
	|| (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio)) 
	{
      if (typeof data.filterAdvanced.fromFolio != 'undefined' && data.filterAdvanced.fromFolio)
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.NombresFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Nombres LIKE '" + data.filterAdvanced.Nombres + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Nombres LIKE '%" + data.filterAdvanced.Nombres + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Nombres LIKE '%" + data.filterAdvanced.Nombres + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Nombres = '" + data.filterAdvanced.Nombres + "'";
        break;
    }
    switch (data.filterAdvanced.Apellido_paternoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Apellido_paterno LIKE '" + data.filterAdvanced.Apellido_paterno + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Apellido_paterno LIKE '%" + data.filterAdvanced.Apellido_paterno + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Apellido_paterno LIKE '%" + data.filterAdvanced.Apellido_paterno + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Apellido_paterno = '" + data.filterAdvanced.Apellido_paterno + "'";
        break;
    }
    switch (data.filterAdvanced.Apellido_maternoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Apellido_materno LIKE '" + data.filterAdvanced.Apellido_materno + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Apellido_materno LIKE '%" + data.filterAdvanced.Apellido_materno + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Apellido_materno LIKE '%" + data.filterAdvanced.Apellido_materno + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Apellido_materno = '" + data.filterAdvanced.Apellido_materno + "'";
        break;
    }
    switch (data.filterAdvanced.Nombre_completoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Nombre_completo LIKE '" + data.filterAdvanced.Nombre_completo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Nombre_completo LIKE '%" + data.filterAdvanced.Nombre_completo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Nombre_completo LIKE '%" + data.filterAdvanced.Nombre_completo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Nombre_completo = '" + data.filterAdvanced.Nombre_completo + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Cargo_desempenado != 'undefined' && data.filterAdvanced.Cargo_desempenado)) {
      switch (data.filterAdvanced.Cargo_desempenadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cargos.Descripcion LIKE '" + data.filterAdvanced.Cargo_desempenado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cargos.Descripcion LIKE '%" + data.filterAdvanced.Cargo_desempenado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cargos.Descripcion LIKE '%" + data.filterAdvanced.Cargo_desempenado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cargos.Descripcion = '" + data.filterAdvanced.Cargo_desempenado + "'";
          break;
      }
    } else if (data.filterAdvanced.Cargo_desempenadoMultiple != null && data.filterAdvanced.Cargo_desempenadoMultiple.length > 0) {
      var Cargo_desempenadods = data.filterAdvanced.Cargo_desempenadoMultiple.join(",");
      condition += " AND Configuracion_de_tecnicos_e_inspectores.Cargo_desempenado In (" + Cargo_desempenadods + ")";
    }
    switch (data.filterAdvanced.Correo_electronicoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Correo_electronico LIKE '" + data.filterAdvanced.Correo_electronico + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Correo_electronico LIKE '%" + data.filterAdvanced.Correo_electronico + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Correo_electronico LIKE '%" + data.filterAdvanced.Correo_electronico + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Correo_electronico = '" + data.filterAdvanced.Correo_electronico + "'";
        break;
    }
    switch (data.filterAdvanced.CelularFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Celular LIKE '" + data.filterAdvanced.Celular + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Celular LIKE '%" + data.filterAdvanced.Celular + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Celular LIKE '%" + data.filterAdvanced.Celular + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Celular = '" + data.filterAdvanced.Celular + "'";
        break;
    }
    switch (data.filterAdvanced.TelefonoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Telefono LIKE '" + data.filterAdvanced.Telefono + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Telefono LIKE '%" + data.filterAdvanced.Telefono + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Telefono LIKE '%" + data.filterAdvanced.Telefono + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Telefono = '" + data.filterAdvanced.Telefono + "'";
        break;
    }
    switch (data.filterAdvanced.DireccionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Direccion LIKE '" + data.filterAdvanced.Direccion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Direccion LIKE '%" + data.filterAdvanced.Direccion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Direccion LIKE '%" + data.filterAdvanced.Direccion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Direccion = '" + data.filterAdvanced.Direccion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Usuario_Registrado != 'undefined' && data.filterAdvanced.Usuario_Registrado)) {
      switch (data.filterAdvanced.Usuario_RegistradoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_Registrado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_Registrado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_Registrado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_Registrado + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_RegistradoMultiple != null && data.filterAdvanced.Usuario_RegistradoMultiple.length > 0) {
      var Usuario_Registradods = data.filterAdvanced.Usuario_RegistradoMultiple.join(",");
      condition += " AND Configuracion_de_tecnicos_e_inspectores.Usuario_Registrado In (" + Usuario_Registradods + ")";
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
      condition += " AND Configuracion_de_tecnicos_e_inspectores.Usuario_Relacionado In (" + Usuario_Relacionadods + ")";
    }
    switch (data.filterAdvanced.Numero_de_LicenciaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Licencia LIKE '" + data.filterAdvanced.Numero_de_Licencia + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Licencia LIKE '%" + data.filterAdvanced.Numero_de_Licencia + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Licencia LIKE '%" + data.filterAdvanced.Numero_de_Licencia + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Licencia = '" + data.filterAdvanced.Numero_de_Licencia + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Licencia != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Licencia)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Licencia != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Licencia)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Licencia != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Licencia) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Licencia, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Licencia).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Emision_Licencia != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Licencia) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Licencia, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Licencia).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Certificado_MedicoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Certificado_Medico LIKE '" + data.filterAdvanced.Certificado_Medico + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Certificado_Medico LIKE '%" + data.filterAdvanced.Certificado_Medico + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Certificado_Medico LIKE '%" + data.filterAdvanced.Certificado_Medico + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Certificado_Medico = '" + data.filterAdvanced.Certificado_Medico + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Certificado != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Certificado)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Certificado != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Certificado)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Certificado != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Certificado) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Certificado, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Certificado).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Emision_Certificado != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Certificado) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Certificado, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Certificado).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_cert != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_cert)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_cert != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_cert)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_cert != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_cert) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_cert, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_cert).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_vencimiento_cert != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_cert) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_cert, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_cert).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Numero_de_Pasaporte_1Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_1 LIKE '" + data.filterAdvanced.Numero_de_Pasaporte_1 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_1 LIKE '%" + data.filterAdvanced.Numero_de_Pasaporte_1 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_1 LIKE '%" + data.filterAdvanced.Numero_de_Pasaporte_1 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_1 = '" + data.filterAdvanced.Numero_de_Pasaporte_1 + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Pasaporte_1 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Pasaporte_1)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Pasaporte_1, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Pasaporte_1).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Emision_Pasaporte_1 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Pasaporte_1) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Pasaporte_1, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Pasaporte_1).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Pasaporte_1, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_1).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Pasaporte_1, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_1).format("YYYY.MM.DD") + "'";
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
      condition += " AND Configuracion_de_tecnicos_e_inspectores.Pais_1 In (" + Pais_1ds + ")";
    }
    switch (data.filterAdvanced.Numero_de_Pasaporte_2Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_2 LIKE '" + data.filterAdvanced.Numero_de_Pasaporte_2 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_2 LIKE '%" + data.filterAdvanced.Numero_de_Pasaporte_2 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_2 LIKE '%" + data.filterAdvanced.Numero_de_Pasaporte_2 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Pasaporte_2 = '" + data.filterAdvanced.Numero_de_Pasaporte_2 + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Pasaporte_2 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Pasaporte_2)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Pasaporte_2, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Pasaporte_2).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Emision_Pasaporte_2 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Pasaporte_2) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Pasaporte_2, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Pasaporte_2).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Pasaporte_2, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_Pasaporte_2).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Pasaporte_2, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_Pasaporte_2).format("YYYY.MM.DD") + "'";
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
      condition += " AND Configuracion_de_tecnicos_e_inspectores.Pais_2 In (" + Pais_2ds + ")";
    }
    switch (data.filterAdvanced.Numero_de_Visa_1Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_1 LIKE '" + data.filterAdvanced.Numero_de_Visa_1 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_1 LIKE '%" + data.filterAdvanced.Numero_de_Visa_1 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_1 LIKE '%" + data.filterAdvanced.Numero_de_Visa_1 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_1 = '" + data.filterAdvanced.Numero_de_Visa_1 + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Visa_1 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Visa_1)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Visa_1 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Visa_1)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Visa_1 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Visa_1) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Visa_1, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Visa_1).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Emision_Visa_1 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Visa_1) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Visa_1, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Visa_1).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_Visa_1 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Visa_1)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_Visa_1 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Visa_1)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_Visa_1 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Visa_1) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Visa_1, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_Visa_1).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_vencimiento_Visa_1 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Visa_1) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Visa_1, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_Visa_1).format("YYYY.MM.DD") + "'";
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
      condition += " AND Configuracion_de_tecnicos_e_inspectores.Pais_3 In (" + Pais_3ds + ")";
    }
    switch (data.filterAdvanced.Numero_de_Visa_2Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_2 LIKE '" + data.filterAdvanced.Numero_de_Visa_2 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_2 LIKE '%" + data.filterAdvanced.Numero_de_Visa_2 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_2 LIKE '%" + data.filterAdvanced.Numero_de_Visa_2 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Configuracion_de_tecnicos_e_inspectores.Numero_de_Visa_2 = '" + data.filterAdvanced.Numero_de_Visa_2 + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Emision_Visa_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Visa_2)
	|| (typeof data.filterAdvanced.toFecha_de_Emision_Visa_2 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Visa_2)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Emision_Visa_2 != 'undefined' && data.filterAdvanced.fromFecha_de_Emision_Visa_2) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Visa_2, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Emision_Visa_2).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Emision_Visa_2 != 'undefined' && data.filterAdvanced.toFecha_de_Emision_Visa_2) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_Emision_Visa_2, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Emision_Visa_2).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento_Visa_2 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Visa_2)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento_Visa_2 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Visa_2)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento_Visa_2 != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento_Visa_2) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Visa_2, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento_Visa_2).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_vencimiento_Visa_2 != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento_Visa_2) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_tecnicos_e_inspectores.Fecha_de_vencimiento_Visa_2, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento_Visa_2).format("YYYY.MM.DD") + "'";
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
      condition += " AND Configuracion_de_tecnicos_e_inspectores.Pais_4 In (" + Pais_4ds + ")";
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
          if (column === 'Folio') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones'  && column != 'Cargar_Licencia'  && column != 'Cargar_Certificado_Medico'  && column != 'Cargar_Pasaporte_1'  && column != 'Cargar_Pasaporte_2'  && column != 'Cargar_Visa_1'  && column != 'Cargar_Visa_2' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Configuracion_de_tecnicos_e_inspectoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Configuracion_de_tecnicos_e_inspectoress);
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
