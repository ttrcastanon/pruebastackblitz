import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Creacion_de_UsuariosService } from "src/app/api-services/Creacion_de_Usuarios.service";
import { Creacion_de_Usuarios } from "src/app/models/Creacion_de_Usuarios";
import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild, Renderer2 } from "@angular/core";
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
import { Creacion_de_UsuariosIndexRules } from 'src/app/shared/businessRules/Creacion_de_Usuarios-index-rules';
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
  selector: "app-list-Creacion_de_Usuarios",
  templateUrl: "./list-Creacion_de_Usuarios.component.html",
  styleUrls: ["./list-Creacion_de_Usuarios.component.scss"],
})
export class ListCreacion_de_UsuariosComponent extends Creacion_de_UsuariosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Clave",
    "Nombres",
    "Apellido_paterno",
    "Apellido_materno",
    "Nombre_completo",
    "Curp",
    "Fecha_de_Nacimiento",
    "Fecha_de_Ingreso",
    "Creacion_de_Usuario",
    "Edad",
    "Tiempo_en_la_Empresa",
    "Cargo_desempenado",
    "Jefe_inmediato",
    "Departamento",
    "Usuario",
    "Contrasena",
    "Estatus",
    "Correo_electronico",
    "Telefono",
    "Celular",
    "Direccion",
    "Horario_de_trabajo",
    "Usuario_Registrado",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Nombres",
      "Apellido_paterno",
      "Apellido_materno",
      "Nombre_completo",
      "Curp",
      "Fecha_de_Nacimiento",
      "Fecha_de_Ingreso",
      "Creacion_de_Usuario",
      "Edad",
      "Tiempo_en_la_Empresa",
      "Cargo_desempenado",
      "Jefe_inmediato",
      "Departamento",
      "Usuario",
      "Contrasena",
      "Estatus",
      "Correo_electronico",
      "Telefono",
      "Celular",
      "Direccion",
      "Horario_de_trabajo",
      "Usuario_Registrado",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Nombres_filtro",
      "Apellido_paterno_filtro",
      "Apellido_materno_filtro",
      "Nombre_completo_filtro",
      "Curp_filtro",
      "Fecha_de_Nacimiento_filtro",
      "Fecha_de_Ingreso_filtro",
      "Creacion_de_Usuario_filtro",
      "Edad_filtro",
      "Tiempo_en_la_Empresa_filtro",
      "Cargo_desempenado_filtro",
      "Jefe_inmediato_filtro",
      "Departamento_filtro",
      "Usuario_filtro",
      "Contrasena_filtro",
      "Estatus_filtro",
      "Correo_electronico_filtro",
      "Telefono_filtro",
      "Celular_filtro",
      "Direccion_filtro",
      "Horario_de_trabajo_filtro",
      "Usuario_Registrado_filtro",

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
      Curp: "",
      Fecha_de_Nacimiento: null,
      Fecha_de_Ingreso: null,
      Creacion_de_Usuario: null,
      Edad: "",
      Tiempo_en_la_Empresa: "",
      Cargo_desempenado: "",
      Jefe_inmediato: "",
      Departamento: "",
      Usuario: "",
      Contrasena: "",
      Estatus: "",
      Correo_electronico: "",
      Telefono: "",
      Celular: "",
      Direccion: "",
      Horario_de_trabajo: "",
      Usuario_Registrado: "",

    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      fromFecha_de_Nacimiento: "",
      toFecha_de_Nacimiento: "",
      fromFecha_de_Ingreso: "",
      toFecha_de_Ingreso: "",
      fromCreacion_de_Usuario: "",
      toCreacion_de_Usuario: "",
      Cargo_desempenadoFilter: "",
      Cargo_desempenado: "",
      Cargo_desempenadoMultiple: "",
      Jefe_inmediatoFilter: "",
      Jefe_inmediato: "",
      Jefe_inmediatoMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      Horario_de_trabajoFilter: "",
      Horario_de_trabajo: "",
      Horario_de_trabajoMultiple: "",
      fromUsuario_Registrado: "",
      toUsuario_Registrado: "",

    }
  };

  dataSource: Creacion_de_UsuariosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Creacion_de_UsuariosDataSource;
  dataClipboard: any;

  constructor(
    private _Creacion_de_UsuariosService: Creacion_de_UsuariosService,
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
    this.dataSource = new Creacion_de_UsuariosDataSource(
      this._Creacion_de_UsuariosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Creacion_de_Usuarios)
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
    this.listConfig.filter.Curp = "";
    this.listConfig.filter.Fecha_de_Nacimiento = undefined;
    this.listConfig.filter.Fecha_de_Ingreso = undefined;
    this.listConfig.filter.Creacion_de_Usuario = undefined;
    this.listConfig.filter.Edad = "";
    this.listConfig.filter.Tiempo_en_la_Empresa = "";
    this.listConfig.filter.Cargo_desempenado = "";
    this.listConfig.filter.Jefe_inmediato = "";
    this.listConfig.filter.Departamento = "";
    this.listConfig.filter.Usuario = "";
    this.listConfig.filter.Contrasena = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Correo_electronico = "";
    this.listConfig.filter.Telefono = "";
    this.listConfig.filter.Celular = "";
    this.listConfig.filter.Direccion = "";
    this.listConfig.filter.Horario_de_trabajo = "";
    this.listConfig.filter.Usuario_Registrado = "";

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

   remove(row: Creacion_de_Usuarios) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(async () => {
        this.dataSource.loadingSubject.next(true);
        // await this.brf.EvaluaQueryAsync(`delete tripulacion where Usuario_Relacionado = ${+row.Clave}`, 1, "ABC123");
        // await this.brf.EvaluaQueryAsync(`delete Configuracion_de_tecnicos_e_inspectores where Usuario_Relacionado = ${+row.Clave}`, 1, "ABC123");
        this._Creacion_de_UsuariosService
        
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
  ActionPrint(dataRow: Creacion_de_Usuarios) {

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
      'Usuarios ID'
      , 'Nombre(s)'
      , 'Apellido paterno'
      , 'Apellido materno'
      , 'Nombre completo'
      , 'CURP'
      , 'Fecha de Nacimiento'
      , 'Fecha de Ingreso a la Empresa'
      , 'Creación de Usuario'
      , 'Edad'
      , 'Tiempo en la Empresa'
      , 'Rol en el Sistema'
      , 'Jefe inmediato'
      , 'Departamento'
      , 'Usuario'
      , 'Contraseña'
      , 'Estatus'
      , 'Correo electrónico'
      , 'Teléfono'
      , 'Celular'
      , 'Dirección'
      , 'Horario de trabajo'
      , 'Usuario Registrado'

    ]
    new_data.push(header);
    data.forEach(e => {
      for (const p in e) {
        if (e[p] == null) {
          e[p] = '';
        }
      }});
    data.forEach(x => {
      let new_content = [
        x.Clave
        , x.Nombres
        , x.Apellido_paterno
        , x.Apellido_materno
        , x.Nombre_completo
        , x.Curp
        , x.Fecha_de_Nacimiento ? momentJS(x.Fecha_de_Nacimiento).format('DD/MM/YYYY') : ''
        , x.Fecha_de_Ingreso ? momentJS(x.Fecha_de_Ingreso).format('DD/MM/YYYY') : ''
        , x.Creacion_de_Usuario ? momentJS(x.Creacion_de_Usuario).format('DD/MM/YYYY') : ''
        , x.Edad
        , x.Tiempo_en_la_Empresa
        , x.Cargo_desempenado_Cargos.Descripcion
        , x.Jefe_inmediato_Spartan_User.Name
        , x.Departamento_Departamento.Nombre
        , x.Usuario
        , x.Contrasena
        , x.Estatus_Estatus_de_Usuario.Descripcion
        , x.Correo_electronico
        , x.Telefono
        , x.Celular
        , x.Direccion
        , x.Horario_de_trabajo_Horarios_de_Trabajo.Descripcion
        , x.Usuario_Registrado

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
    pdfMake.createPdf(pdfDefinition).download('Creacion_de_Usuarios.pdf');
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
        buttonLabel = "Copiar";
        break;
      case 2: title = "Exportar Excel"; buttonLabel = "Exportar"; break;
      case 3: title = "Exportar CSV"; buttonLabel = "Exportar"; break;
      case 4: title = "Exportar PDF"; buttonLabel = "Exportar"; break;
      case 5: title = "Imprimir"; buttonLabel = "Imprimir"; break;
    }


    this.dialogo
      .open(DialogConfirmExportComponent, {
        data: {
          mensaje: `Seleccione una opción`,
          titulo: title,
          buttonLabel: buttonLabel
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
          this._Creacion_de_UsuariosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              response.Creacion_de_Usuarioss.forEach(e => {
                for (const p in e) {
                  if (e[p] == null) {
                    e[p] = '';
                  }
                }
                e.Fecha_de_Nacimiento ? momentJS(e.Fecha_de_Nacimiento).format('DD/MM/YYYY') : '';
                e.Fecha_de_Ingreso ? momentJS(e.Fecha_de_Ingreso).format('DD/MM/YYYY') : '';
                e.Creacion_de_Usuario ? momentJS(e.Creacion_de_Usuario).format('DD/MM/YYYY') : '';

              })
              this.dataSourceTemp = response.Creacion_de_Usuarioss;
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
          this._Creacion_de_UsuariosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              response.Creacion_de_Usuarioss.forEach(e => {
                for (const p in e) {
                  if (e[p] == null) {
                    e[p] = '';
                  }
                }
                e.Fecha_de_Nacimiento ? momentJS(e.Fecha_de_Nacimiento).format('DD/MM/YYYY') : '';
                e.Fecha_de_Ingreso ? momentJS(e.Fecha_de_Ingreso).format('DD/MM/YYYY') : '';
                e.Creacion_de_Usuario ? momentJS(e.Creacion_de_Usuario).format('DD/MM/YYYY') : '';

              })
              this.dataSourceTemp = response.Creacion_de_Usuarioss;
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
        'Usuarios ID ': fields.Clave,
        'Nombre(s) ': fields.Nombres,
        'Apellido paterno ': fields.Apellido_paterno,
        'Apellido materno ': fields.Apellido_materno,
        'Nombre completo ': fields.Nombre_completo,
        'CURP ': fields.Curp,
        'Fecha de Nacimiento ': fields.Fecha_de_Nacimiento ? fields.Fecha_de_Nacimiento : '',
        'Fecha de Ingreso a la Empresa ': fields.Fecha_de_Ingreso ? fields.Fecha_de_Ingreso : '',
        'Creación de Usuario ': fields.Creacion_de_Usuario ? fields.Creacion_de_Usuario : '',
        'Edad ': fields.Edad,
        'Tiempo en la Empresa ': fields.Tiempo_en_la_Empresa,
        'Rol en el Sistema ': fields.Cargo_desempenado_Cargos.Descripcion,
        'Jefe inmediato ': fields.Jefe_inmediato_Spartan_User.Name,
        'Departamento ': fields.Departamento_Departamento.Nombre,
        'Usuario ': fields.Usuario,
        'Contraseña ': fields.Contrasena,
        'Estatus ': fields.Estatus_Estatus_de_Usuario.Descripcion,
        'Correo electrónico ': fields.Correo_electronico,
        'Teléfono ': fields.Telefono,
        'Celular ': fields.Celular,
        'Dirección ': fields.Direccion,
        'Horario de trabajo ': fields.Horario_de_trabajo_Horarios_de_Trabajo.Descripcion,
        'Usuario Registrado ': fields.Usuario_Registrado,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Creacion_de_Usuarios  ${new Date().toLocaleString()}`);
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
      Curp: x.Curp,
      Fecha_de_Nacimiento: x.Fecha_de_Nacimiento ? x.Fecha_de_Nacimiento : '',
      Fecha_de_Ingreso: x.Fecha_de_Ingreso ? x.Fecha_de_Ingreso: '',
      Creacion_de_Usuario: x.Creacion_de_Usuario ? x.Creacion_de_Usuario : '',
      Edad: x.Edad,
      Tiempo_en_la_Empresa: x.Tiempo_en_la_Empresa,
      Cargo_desempenado: x.Cargo_desempenado_Cargos.Descripcion,
      Jefe_inmediato: x.Jefe_inmediato_Spartan_User.Name,
      Departamento: x.Departamento_Departamento.Nombre,
      Usuario: x.Usuario,
      Contrasena: x.Contrasena,
      Estatus: x.Estatus_Estatus_de_Usuario.Descripcion,
      Correo_electronico: x.Correo_electronico,
      Telefono: x.Telefono,
      Celular: x.Celular,
      Direccion: x.Direccion,
      Horario_de_trabajo: x.Horario_de_trabajo_Horarios_de_Trabajo.Descripcion,
      Usuario_Registrado: x.Usuario_Registrado,

    }));

    this.excelService.exportToCsv(result, 'Creacion_de_Usuarios', 
    ['Clave', 'Nombres', 'Apellido_paterno', 'Apellido_materno', 'Nombre_completo', 'Curp', 'Fecha_de_Nacimiento', 'Fecha_de_Ingreso', 'Creacion_de_Usuario', 'Edad', 'Tiempo_en_la_Empresa', 'Cargo_desempenado', 'Jefe_inmediato', 'Departamento', 'Usuario', 'Contrasena', 'Estatus', 'Correo_electronico', 'Telefono', 'Celular', 'Direccion', 'Horario_de_trabajo', 'Usuario_Registrado'],
    ['Usuarios ID', 'Nombre(s)', 'Apellido paterno', 'Apellido materno', 'Nombre completo', 'CURP', 'Fecha de Nacimiento', 'Fecha de Ingreso a la Empresa', 'Creación de Usuario', 'Edad', 'Tiempo en la Empresa', 'Rol en el Sistema', 'Jefe inmediato', 'Departamento', 'Usuario', 'Contrasena', 'Estatus', 'Correo electrónico', 'Teléfono', 'Celular', 'Dirección', 'Horario de trabajo', 'Usuario Registrado']);
  }

  /**
   * Construir tabla con datos a exportar (XLS | CSV | PDF | PTR)
   * @param data : Contenedor de datos
   */
  SetTableExport(data: any): string {
    data.forEach(e => {
      for (const p in e) {
        if (e[p] == null) {
          e[p] = '';
        }
      }
      e.Fecha_de_Nacimiento = e.Fecha_de_Nacimiento ? momentJS(e.Fecha_de_Nacimiento).format('DD/MM/YYYY') : '';
      e.Fecha_de_Ingreso = e.Fecha_de_Ingreso ? momentJS(e.Fecha_de_Ingreso).format('DD/MM/YYYY') : '';
      e.Creacion_de_Usuario = e.Creacion_de_Usuario ? momentJS(e.Creacion_de_Usuario).format('DD/MM/YYYY') : '';

    })
    let template: string;

    template = '<table id="xxx" boder="1">';
    template += '  <thead>';
    template += '      <tr>';
    template += '          <th>Usuarios ID</th>';
    template += '          <th>Nombre(s)</th>';
    template += '          <th>Apellido paterno</th>';
    template += '          <th>Apellido materno</th>';
    template += '          <th>Nombre completo</th>';
    template += '          <th>CURP</th>';
    template += '          <th>Fecha de Nacimiento</th>';
    template += '          <th>Fecha de Ingreso a la Empresa</th>';
    template += '          <th>Creación de Usuario</th>';
    template += '          <th>Edad</th>';
    template += '          <th>Tiempo en la Empresa</th>';
    template += '          <th>Rol en el Sistema</th>';
    template += '          <th>Jefe inmediato</th>';
    template += '          <th>Departamento</th>';
    template += '          <th>Usuario</th>';
    template += '          <th>Contraseña</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Correo electrónico</th>';
    template += '          <th>Teléfono</th>';
    template += '          <th>Celular</th>';
    template += '          <th>Dirección</th>';
    template += '          <th>Horario de trabajo</th>';
    template += '          <th>Usuario Registrado</th>';

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
      template += '          <td>' + element.Curp + '</td>';
      template += '          <td>' + element.Fecha_de_Nacimiento  + '</td>';
      template += '          <td>' + element.Fecha_de_Ingreso + '</td>';
      template += '          <td>' + element.Creacion_de_Usuario + '</td>';
      template += '          <td>' + element.Edad + '</td>';
      template += '          <td>' + element.Tiempo_en_la_Empresa + '</td>';
      template += '          <td>' + element.Cargo_desempenado_Cargos.Descripcion + '</td>';
      template += '          <td>' + element.Jefe_inmediato_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Departamento_Departamento.Nombre + '</td>';
      template += '          <td>' + element.Usuario + '</td>';
      template += '          <td>' + element.Contrasena + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Usuario.Descripcion + '</td>';
      template += '          <td>' + element.Correo_electronico + '</td>';
      template += '          <td>' + element.Telefono + '</td>';
      template += '          <td>' + element.Celular + '</td>';
      template += '          <td>' + element.Direccion + '</td>';
      template += '          <td>' + element.Horario_de_trabajo_Horarios_de_Trabajo.Descripcion + '</td>';
      template += '          <td>' + element.Usuario_Registrado + '</td>';

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
    template += 'Usuarios ID';
    template += '\t Nombre(s)';
    template += '\t Apellido paterno';
    template += '\t Apellido materno';
    template += '\t Nombre completo';
    template += '\t CURP';
    template += '\t Fecha de Nacimiento';
    template += '\t Fecha de Ingreso a la Empresa';
    template += '\t Creación de Usuario';
    template += '\t Edad';
    template += '\t Tiempo en la Empresa';
    template += '\t Rol en el Sistema';
    template += '\t Jefe inmediato';
    template += '\t Departamento';
    template += '\t Usuario';
    template += '\t Contraseña';
    template += '\t Estatus';
    template += '\t Correo electrónico';
    template += '\t Teléfono';
    template += '\t Celular';
    template += '\t Dirección';
    template += '\t Horario de trabajo';
    template += '\t Usuario Registrado';

    template += '\n';

    data.forEach(element => {

      element.Nombres = element.Nombres != null ? element.Nombres : ""
      element.Apellido_paterno = element.Apellido_paterno != null ? element.Apellido_paterno : ""
      element.Apellido_materno = element.Apellido_materno != null ? element.Apellido_materno : ""
      element.Nombre_completo = element.Nombre_completo != null ? element.Nombre_completo : ""
      element.Curp = element.Curp != null ? element.Curp : ""
      element.Fecha_de_Nacimiento = element.Fecha_de_Nacimiento != null ? element.Fecha_de_Nacimiento.substring(0, 10) : ""
      element.Fecha_de_Ingreso = element.Fecha_de_Ingreso != null ? element.Fecha_de_Ingreso.substring(0, 10) : ""
      element.Creacion_de_Usuario = element.Creacion_de_Usuario != null ? element.Creacion_de_Usuario.substring(0, 10) : ""
      element.Edad = element.Edad != null ? element.Edad : ""
      element.Tiempo_en_la_Empresa = element.Tiempo_en_la_Empresa != null ? element.Tiempo_en_la_Empresa : ""
      element.Cargo_desempenado_Cargos.Descripcion = element.Cargo_desempenado_Cargos.Descripcion != null ? element.Cargo_desempenado_Cargos.Descripcion : ""
      element.Jefe_inmediato_Spartan_User.Name = element.Jefe_inmediato_Spartan_User.Name != null ? element.Jefe_inmediato_Spartan_User.Name : ""
      element.Departamento_Departamento.Nombre = element.Departamento_Departamento.Nombre != null ? element.Departamento_Departamento.Nombre : ""
      element.Usuario = element.Usuario != null ? element.Usuario : ""
      element.Contrasena = element.Contrasena != null ? element.Contrasena : ""
      element.Estatus_Estatus_de_Usuario.Descripcion = element.Estatus_Estatus_de_Usuario.Descripcion != null ? element.Estatus_Estatus_de_Usuario.Descripcion : ""
      element.Correo_electronico = element.Correo_electronico != null ? element.Correo_electronico : ""
      element.Telefono = element.Telefono != null ? element.Telefono : ""
      element.Celular = element.Celular != null ? element.Celular : ""
      element.Direccion = element.Direccion != null ? element.Direccion.replaceAll("\n", " ").replaceAll("\r", " ") : ""
      element.Horario_de_trabajo_Horarios_de_Trabajo.Descripcion = element.Horario_de_trabajo_Horarios_de_Trabajo.Descripcion != null ? element.Horario_de_trabajo_Horarios_de_Trabajo.Descripcion : ""
      element.Usuario_Registrado = element.Usuario_Registrado != null ? element.Usuario_Registrado : ""

      template += element.Clave;
      template += '\t ' + element.Nombres;
      template += '\t ' + element.Apellido_paterno;
      template += '\t ' + element.Apellido_materno;
      template += '\t ' + element.Nombre_completo;
      template += '\t ' + element.Curp;
      template += '\t ' + element.Fecha_de_Nacimiento;
      template += '\t ' + element.Fecha_de_Ingreso;
      template += '\t ' + element.Creacion_de_Usuario;
      template += '\t ' + element.Edad;
      template += '\t ' + element.Tiempo_en_la_Empresa;
      template += '\t ' + element.Cargo_desempenado_Cargos.Descripcion;
      template += '\t ' + element.Jefe_inmediato_Spartan_User.Name;
      template += '\t ' + element.Departamento_Departamento.Nombre;
      template += '\t ' + element.Usuario;
      template += '\t ' + element.Contrasena;
      template += '\t ' + element.Estatus_Estatus_de_Usuario.Descripcion;
      template += '\t ' + element.Correo_electronico;
      template += '\t ' + element.Telefono;
      template += '\t ' + element.Celular;
      template += '\t ' + element.Direccion;
      template += '\t ' + element.Horario_de_trabajo_Horarios_de_Trabajo.Descripcion;
      template += '\t ' + element.Usuario_Registrado;

      template += '\n';
    });

    return template;
  }

}

export class Creacion_de_UsuariosDataSource implements DataSource<Creacion_de_Usuarios>
{
  private subject = new BehaviorSubject<Creacion_de_Usuarios[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Creacion_de_UsuariosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Creacion_de_Usuarios[]> {
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
    if (data.MRWhere.length > 0) {
      if (condition != null && condition.length > 0) {
        condition = condition + " AND " + data.MRWhere;
      }
      if (condition == null || condition.length == 0) {
        condition = data.MRWhere;
      }
    }

    if (data.MRSort.length > 0) {
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
          } else if (column != 'acciones' && column != 'Firma_digital') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Creacion_de_Usuarioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false || column === 'Paquete_de_beneficios') { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Creacion_de_Usuarioss);
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
      condition += " and Creacion_de_Usuarios.Clave = " + data.filter.Clave;
    if (data.filter.Nombres != "")
      condition += " and Creacion_de_Usuarios.Nombres like '%" + data.filter.Nombres + "%' ";
    if (data.filter.Apellido_paterno != "")
      condition += " and Creacion_de_Usuarios.Apellido_paterno like '%" + data.filter.Apellido_paterno + "%' ";
    if (data.filter.Apellido_materno != "")
      condition += " and Creacion_de_Usuarios.Apellido_materno like '%" + data.filter.Apellido_materno + "%' ";
    if (data.filter.Nombre_completo != "")
      condition += " and Creacion_de_Usuarios.Nombre_completo like '%" + data.filter.Nombre_completo + "%' ";
    if (data.filter.Curp != "")
      condition += " and Creacion_de_Usuarios.Curp like '%" + data.filter.Curp + "%' ";
    if (data.filter.Fecha_de_Nacimiento)
      condition += " and CONVERT(VARCHAR(10), Creacion_de_Usuarios.Fecha_de_Nacimiento, 102)  = '" + moment(data.filter.Fecha_de_Nacimiento).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_Ingreso)
      condition += " and CONVERT(VARCHAR(10), Creacion_de_Usuarios.Fecha_de_Ingreso, 102)  = '" + moment(data.filter.Fecha_de_Ingreso).format("YYYY.MM.DD") + "'";
    if (data.filter.Creacion_de_Usuario)
      condition += " and CONVERT(VARCHAR(10), Creacion_de_Usuarios.Creacion_de_Usuario, 102)  = '" + moment(data.filter.Creacion_de_Usuario).format("YYYY.MM.DD") + "'";
    if (data.filter.Edad != "")
      condition += " and Creacion_de_Usuarios.Edad like '%" + data.filter.Edad + "%' ";
    if (data.filter.Tiempo_en_la_Empresa != "")
      condition += " and Creacion_de_Usuarios.Tiempo_en_la_Empresa like '%" + data.filter.Tiempo_en_la_Empresa + "%' ";
    if (data.filter.Cargo_desempenado != "")
      condition += " and Cargos.Descripcion like '%" + data.filter.Cargo_desempenado + "%' ";
    if (data.filter.Jefe_inmediato != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Jefe_inmediato + "%' ";
    if (data.filter.Departamento != "")
      condition += " and Departamento.Nombre like '%" + data.filter.Departamento + "%' ";
    if (data.filter.Usuario != "")
      condition += " and Creacion_de_Usuarios.Usuario like '%" + data.filter.Usuario + "%' ";
    if (data.filter.Contrasena != "")
      condition += " and Creacion_de_Usuarios.Contrasena like '%" + data.filter.Contrasena + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Usuario.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Correo_electronico != "")
      condition += " and Creacion_de_Usuarios.Correo_electronico like '%" + data.filter.Correo_electronico + "%' ";
    if (data.filter.Telefono != "")
      condition += " and Creacion_de_Usuarios.Telefono like '%" + data.filter.Telefono + "%' ";
    if (data.filter.Celular != "")
      condition += " and Creacion_de_Usuarios.Celular like '%" + data.filter.Celular + "%' ";
    if (data.filter.Direccion != "")
      condition += " and Creacion_de_Usuarios.Direccion like '%" + data.filter.Direccion + "%' ";
    if (data.filter.Horario_de_trabajo != "")
      condition += " and Horarios_de_Trabajo.Descripcion like '%" + data.filter.Horario_de_trabajo + "%' ";
    if (data.filter.Usuario_Registrado != "")
      condition += " and Creacion_de_Usuarios.Usuario_Registrado = " + data.filter.Usuario_Registrado;

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
        sort = " Creacion_de_Usuarios.Clave " + data.sortDirecction;
        break;
      case "Nombres":
        sort = " Creacion_de_Usuarios.Nombres " + data.sortDirecction;
        break;
      case "Apellido_paterno":
        sort = " Creacion_de_Usuarios.Apellido_paterno " + data.sortDirecction;
        break;
      case "Apellido_materno":
        sort = " Creacion_de_Usuarios.Apellido_materno " + data.sortDirecction;
        break;
      case "Nombre_completo":
        sort = " Creacion_de_Usuarios.Nombre_completo " + data.sortDirecction;
        break;
      case "Curp":
        sort = " Creacion_de_Usuarios.Curp " + data.sortDirecction;
        break;
      case "Fecha_de_Nacimiento":
        sort = " Creacion_de_Usuarios.Fecha_de_Nacimiento " + data.sortDirecction;
        break;
      case "Fecha_de_Ingreso":
        sort = " Creacion_de_Usuarios.Fecha_de_Ingreso " + data.sortDirecction;
        break;
      case "Creacion_de_Usuario":
        sort = " Creacion_de_Usuarios.Creacion_de_Usuario " + data.sortDirecction;
        break;
      case "Edad":
        sort = " Creacion_de_Usuarios.Edad " + data.sortDirecction;
        break;
      case "Tiempo_en_la_Empresa":
        sort = " Creacion_de_Usuarios.Tiempo_en_la_Empresa " + data.sortDirecction;
        break;
      case "Cargo_desempenado":
        sort = " Cargos.Descripcion " + data.sortDirecction;
        break;
      case "Jefe_inmediato":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Departamento":
        sort = " Departamento.Nombre " + data.sortDirecction;
        break;
      case "Usuario":
        sort = " Creacion_de_Usuarios.Usuario " + data.sortDirecction;
        break;
      case "Contrasena":
        sort = " Creacion_de_Usuarios.Contrasena " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Usuario.Descripcion " + data.sortDirecction;
        break;
      case "Correo_electronico":
        sort = " Creacion_de_Usuarios.Correo_electronico " + data.sortDirecction;
        break;
      case "Telefono":
        sort = " Creacion_de_Usuarios.Telefono " + data.sortDirecction;
        break;
      case "Celular":
        sort = " Creacion_de_Usuarios.Celular " + data.sortDirecction;
        break;
      case "Direccion":
        sort = " Creacion_de_Usuarios.Direccion " + data.sortDirecction;
        break;
      case "Horario_de_trabajo":
        sort = " Horarios_de_Trabajo.Descripcion " + data.sortDirecction;
        break;
      case "Usuario_Registrado":
        sort = " Creacion_de_Usuarios.Usuario_Registrado " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromClave != 'undefined' && data.filterAdvanced.fromClave)
      || (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave)) {
      if (typeof data.filterAdvanced.fromClave != 'undefined' && data.filterAdvanced.fromClave)
        condition += " AND Creacion_de_Usuarios.Clave >= " + data.filterAdvanced.fromClave;

      if (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave)
        condition += " AND Creacion_de_Usuarios.Clave <= " + data.filterAdvanced.toClave;
    }
    switch (data.filterAdvanced.NombresFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Nombres LIKE '" + data.filterAdvanced.Nombres + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Nombres LIKE '%" + data.filterAdvanced.Nombres + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Nombres LIKE '%" + data.filterAdvanced.Nombres + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Nombres = '" + data.filterAdvanced.Nombres + "'";
        break;
    }
    switch (data.filterAdvanced.Apellido_paternoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Apellido_paterno LIKE '" + data.filterAdvanced.Apellido_paterno + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Apellido_paterno LIKE '%" + data.filterAdvanced.Apellido_paterno + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Apellido_paterno LIKE '%" + data.filterAdvanced.Apellido_paterno + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Apellido_paterno = '" + data.filterAdvanced.Apellido_paterno + "'";
        break;
    }
    switch (data.filterAdvanced.Apellido_maternoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Apellido_materno LIKE '" + data.filterAdvanced.Apellido_materno + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Apellido_materno LIKE '%" + data.filterAdvanced.Apellido_materno + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Apellido_materno LIKE '%" + data.filterAdvanced.Apellido_materno + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Apellido_materno = '" + data.filterAdvanced.Apellido_materno + "'";
        break;
    }
    switch (data.filterAdvanced.Nombre_completoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '" + data.filterAdvanced.Nombre_completo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '%" + data.filterAdvanced.Nombre_completo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '%" + data.filterAdvanced.Nombre_completo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Nombre_completo = '" + data.filterAdvanced.Nombre_completo + "'";
        break;
    }
    switch (data.filterAdvanced.CurpFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Curp LIKE '" + data.filterAdvanced.Curp + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Curp LIKE '%" + data.filterAdvanced.Curp + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Curp LIKE '%" + data.filterAdvanced.Curp + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Curp = '" + data.filterAdvanced.Curp + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Nacimiento != 'undefined' && data.filterAdvanced.fromFecha_de_Nacimiento)
      || (typeof data.filterAdvanced.toFecha_de_Nacimiento != 'undefined' && data.filterAdvanced.toFecha_de_Nacimiento)) {
      if (typeof data.filterAdvanced.fromFecha_de_Nacimiento != 'undefined' && data.filterAdvanced.fromFecha_de_Nacimiento)
        condition += " and CONVERT(VARCHAR(10), Creacion_de_Usuarios.Fecha_de_Nacimiento, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Nacimiento).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Nacimiento != 'undefined' && data.filterAdvanced.toFecha_de_Nacimiento)
        condition += " and CONVERT(VARCHAR(10), Creacion_de_Usuarios.Fecha_de_Nacimiento, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Nacimiento).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Ingreso != 'undefined' && data.filterAdvanced.fromFecha_de_Ingreso)
      || (typeof data.filterAdvanced.toFecha_de_Ingreso != 'undefined' && data.filterAdvanced.toFecha_de_Ingreso)) {
      if (typeof data.filterAdvanced.fromFecha_de_Ingreso != 'undefined' && data.filterAdvanced.fromFecha_de_Ingreso)
        condition += " and CONVERT(VARCHAR(10), Creacion_de_Usuarios.Fecha_de_Ingreso, 102)  >= '" + moment(data.filterAdvanced.fromFecha_de_Ingreso).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toFecha_de_Ingreso != 'undefined' && data.filterAdvanced.toFecha_de_Ingreso)
        condition += " and CONVERT(VARCHAR(10), Creacion_de_Usuarios.Fecha_de_Ingreso, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Ingreso).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromCreacion_de_Usuario != 'undefined' && data.filterAdvanced.fromCreacion_de_Usuario)
      || (typeof data.filterAdvanced.toCreacion_de_Usuario != 'undefined' && data.filterAdvanced.toCreacion_de_Usuario)) {
      if (typeof data.filterAdvanced.fromCreacion_de_Usuario != 'undefined' && data.filterAdvanced.fromCreacion_de_Usuario)
        condition += " and CONVERT(VARCHAR(10), Creacion_de_Usuarios.Creacion_de_Usuario, 102)  >= '" + moment(data.filterAdvanced.fromCreacion_de_Usuario).format("YYYY.MM.DD") + "'";

      if (typeof data.filterAdvanced.toCreacion_de_Usuario != 'undefined' && data.filterAdvanced.toCreacion_de_Usuario)
        condition += " and CONVERT(VARCHAR(10), Creacion_de_Usuarios.Creacion_de_Usuario, 102)  <= '" + moment(data.filterAdvanced.toCreacion_de_Usuario).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.EdadFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Edad LIKE '" + data.filterAdvanced.Edad + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Edad LIKE '%" + data.filterAdvanced.Edad + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Edad LIKE '%" + data.filterAdvanced.Edad + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Edad = '" + data.filterAdvanced.Edad + "'";
        break;
    }
    switch (data.filterAdvanced.Tiempo_en_la_EmpresaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Tiempo_en_la_Empresa LIKE '" + data.filterAdvanced.Tiempo_en_la_Empresa + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Tiempo_en_la_Empresa LIKE '%" + data.filterAdvanced.Tiempo_en_la_Empresa + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Tiempo_en_la_Empresa LIKE '%" + data.filterAdvanced.Tiempo_en_la_Empresa + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Tiempo_en_la_Empresa = '" + data.filterAdvanced.Tiempo_en_la_Empresa + "'";
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
      condition += " AND Creacion_de_Usuarios.Cargo_desempenado In (" + Cargo_desempenadods + ")";
    }
    if ((typeof data.filterAdvanced.Jefe_inmediato != 'undefined' && data.filterAdvanced.Jefe_inmediato)) {
      switch (data.filterAdvanced.Jefe_inmediatoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Jefe_inmediato + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Jefe_inmediato + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Jefe_inmediato + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Jefe_inmediato + "'";
          break;
      }
    } else if (data.filterAdvanced.Jefe_inmediatoMultiple != null && data.filterAdvanced.Jefe_inmediatoMultiple.length > 0) {
      var Jefe_inmediatods = data.filterAdvanced.Jefe_inmediatoMultiple.join(",");
      condition += " AND Creacion_de_Usuarios.Jefe_inmediato In (" + Jefe_inmediatods + ")";
    }
    if ((typeof data.filterAdvanced.Departamento != 'undefined' && data.filterAdvanced.Departamento)) {
      switch (data.filterAdvanced.DepartamentoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Departamento.Nombre LIKE '" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Departamento.Nombre = '" + data.filterAdvanced.Departamento + "'";
          break;
      }
    } else if (data.filterAdvanced.DepartamentoMultiple != null && data.filterAdvanced.DepartamentoMultiple.length > 0) {
      var Departamentods = data.filterAdvanced.DepartamentoMultiple.join(",");
      condition += " AND Creacion_de_Usuarios.Departamento In (" + Departamentods + ")";
    }
    switch (data.filterAdvanced.UsuarioFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Usuario LIKE '" + data.filterAdvanced.Usuario + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Usuario LIKE '%" + data.filterAdvanced.Usuario + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Usuario LIKE '%" + data.filterAdvanced.Usuario + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Usuario = '" + data.filterAdvanced.Usuario + "'";
        break;
    }
    switch (data.filterAdvanced.ContrasenaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Contrasena LIKE '" + data.filterAdvanced.Contrasena + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Contrasena LIKE '%" + data.filterAdvanced.Contrasena + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Contrasena LIKE '%" + data.filterAdvanced.Contrasena + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Contrasena = '" + data.filterAdvanced.Contrasena + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Usuario.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Usuario.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Usuario.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Usuario.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Creacion_de_Usuarios.Estatus In (" + Estatusds + ")";
    }
    switch (data.filterAdvanced.Correo_electronicoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Correo_electronico LIKE '" + data.filterAdvanced.Correo_electronico + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Correo_electronico LIKE '%" + data.filterAdvanced.Correo_electronico + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Correo_electronico LIKE '%" + data.filterAdvanced.Correo_electronico + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Correo_electronico = '" + data.filterAdvanced.Correo_electronico + "'";
        break;
    }
    switch (data.filterAdvanced.TelefonoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Telefono LIKE '" + data.filterAdvanced.Telefono + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Telefono LIKE '%" + data.filterAdvanced.Telefono + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Telefono LIKE '%" + data.filterAdvanced.Telefono + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Telefono = '" + data.filterAdvanced.Telefono + "'";
        break;
    }
    switch (data.filterAdvanced.CelularFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Celular LIKE '" + data.filterAdvanced.Celular + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Celular LIKE '%" + data.filterAdvanced.Celular + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Celular LIKE '%" + data.filterAdvanced.Celular + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Celular = '" + data.filterAdvanced.Celular + "'";
        break;
    }
    switch (data.filterAdvanced.DireccionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Usuarios.Direccion LIKE '" + data.filterAdvanced.Direccion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Usuarios.Direccion LIKE '%" + data.filterAdvanced.Direccion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Usuarios.Direccion LIKE '%" + data.filterAdvanced.Direccion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Usuarios.Direccion = '" + data.filterAdvanced.Direccion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Horario_de_trabajo != 'undefined' && data.filterAdvanced.Horario_de_trabajo)) {
      switch (data.filterAdvanced.Horario_de_trabajoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Horarios_de_Trabajo.Descripcion LIKE '" + data.filterAdvanced.Horario_de_trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Horarios_de_Trabajo.Descripcion LIKE '%" + data.filterAdvanced.Horario_de_trabajo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Horarios_de_Trabajo.Descripcion LIKE '%" + data.filterAdvanced.Horario_de_trabajo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Horarios_de_Trabajo.Descripcion = '" + data.filterAdvanced.Horario_de_trabajo + "'";
          break;
      }
    } else if (data.filterAdvanced.Horario_de_trabajoMultiple != null && data.filterAdvanced.Horario_de_trabajoMultiple.length > 0) {
      var Horario_de_trabajods = data.filterAdvanced.Horario_de_trabajoMultiple.join(",");
      condition += " AND Creacion_de_Usuarios.Horario_de_trabajo In (" + Horario_de_trabajods + ")";
    }
    if ((typeof data.filterAdvanced.fromUsuario_Registrado != 'undefined' && data.filterAdvanced.fromUsuario_Registrado)
      || (typeof data.filterAdvanced.toUsuario_Registrado != 'undefined' && data.filterAdvanced.toUsuario_Registrado)) {
      if (typeof data.filterAdvanced.fromUsuario_Registrado != 'undefined' && data.filterAdvanced.fromUsuario_Registrado)
        condition += " AND Creacion_de_Usuarios.Usuario_Registrado >= " + data.filterAdvanced.fromUsuario_Registrado;

      if (typeof data.filterAdvanced.toUsuario_Registrado != 'undefined' && data.filterAdvanced.toUsuario_Registrado)
        condition += " AND Creacion_de_Usuarios.Usuario_Registrado <= " + data.filterAdvanced.toUsuario_Registrado;
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
          } else if (column != 'acciones' && column != 'Firma_digital') { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Creacion_de_Usuarioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false || column === 'Paquete_de_beneficios') { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Creacion_de_Usuarioss);
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
