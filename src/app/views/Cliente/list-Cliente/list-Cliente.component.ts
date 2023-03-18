import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { ClienteService } from "src/app/api-services/Cliente.service";
import { Cliente } from "src/app/models/Cliente";
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
import { ClienteIndexRules } from 'src/app/shared/businessRules/Cliente-index-rules';
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
  selector: "app-list-Cliente",
  templateUrl: "./list-Cliente.component.html",
  styleUrls: ["./list-Cliente.component.scss"],
})
export class ListClienteComponent extends ClienteIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Clave",
    "ID_Dynamics",
    "RFC",
    "Razon_Social",
    "Nombre_Corto",
    "Contacto",
    "Direccion_Fiscal",
    "Direccion_Postal",
    "Correo_Electronico",
    "Telefono_de_Contacto",
    "Telefono_de_Contacto_2",
    "Celular_de_Contacto",
    "Fax",
    "Estatus",
    "Pertenece_a_grupo_BAL",
    "Tipo_de_Cliente",
    "Vigencia_de_Contrato",
    "Cuota_de_mantenimiento",
    "Costo_de_Hora_Rampa",
    "Costos_Hora_Tecnico",
    "Part_en_div_por_tramo",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "ID_Dynamics",
      "RFC",
      "Razon_Social",
      "Nombre_Corto",
      "Contacto",
      "Direccion_Fiscal",
      "Direccion_Postal",
      "Correo_Electronico",
      "Telefono_de_Contacto",
      "Telefono_de_Contacto_2",
      "Celular_de_Contacto",
      "Fax",
      "Estatus",
      "Pertenece_a_grupo_BAL",
      "Tipo_de_Cliente",
      "Vigencia_de_Contrato",
      "Cuota_de_mantenimiento",
      "Costo_de_Hora_Rampa",
      "Costos_Hora_Tecnico",
      "Contrato",
      "Part_en_div_por_tramo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "ID_Dynamics_filtro",
      "RFC_filtro",
      "Razon_Social_filtro",
      "Nombre_Corto_filtro",
      "Contacto_filtro",
      "Direccion_Fiscal_filtro",
      "Direccion_Postal_filtro",
      "Correo_Electronico_filtro",
      "Telefono_de_Contacto_filtro",
      "Telefono_de_Contacto_2_filtro",
      "Celular_de_Contacto_filtro",
      "Fax_filtro",
      "Estatus_filtro",
      "Pertenece_a_grupo_BAL_filtro",
      "Tipo_de_Cliente_filtro",
      "Vigencia_de_Contrato_filtro",
      "Cuota_de_mantenimiento_filtro",
      "Costo_de_Hora_Rampa_filtro",
      "Costos_Hora_Tecnico_filtro",
      "Contrato_filtro",
      "Part_en_div_por_tramo_filtro",

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
      ID_Dynamics: "",
      RFC: "",
      Razon_Social: "",
      Nombre_Corto: "",
      Contacto: "",
      Direccion_Fiscal: "",
      Direccion_Postal: "",
      Correo_Electronico: "",
      Telefono_de_Contacto: "",
      Telefono_de_Contacto_2: "",
      Celular_de_Contacto: "",
      Fax: "",
      Estatus: "",
      Pertenece_a_grupo_BAL: "",
      Tipo_de_Cliente: "",
      Vigencia_de_Contrato: null,
      Cuota_de_mantenimiento: "",
      Costo_de_Hora_Rampa: "",
      Costos_Hora_Tecnico: "",
      Part_en_div_por_tramo: "",
		
    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      Pertenece_a_grupo_BALFilter: "",
      Pertenece_a_grupo_BAL: "",
      Pertenece_a_grupo_BALMultiple: "",
      Tipo_de_ClienteFilter: "",
      Tipo_de_Cliente: "",
      Tipo_de_ClienteMultiple: "",
      fromVigencia_de_Contrato: "",
      toVigencia_de_Contrato: "",
      fromCuota_de_mantenimiento: "",
      toCuota_de_mantenimiento: "",
      fromCosto_de_Hora_Rampa: "",
      toCosto_de_Hora_Rampa: "",
      fromCostos_Hora_Tecnico: "",
      toCostos_Hora_Tecnico: "",

    }
  };

  dataSource: ClienteDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: ClienteDataSource;
  dataClipboard: any;

  constructor(
    private _ClienteService: ClienteService,
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
    this.dataSource = new ClienteDataSource(
      this._ClienteService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Cliente)
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
    this.listConfig.filter.ID_Dynamics = "";
    this.listConfig.filter.RFC = "";
    this.listConfig.filter.Razon_Social = "";
    this.listConfig.filter.Nombre_Corto = "";
    this.listConfig.filter.Contacto = "";
    this.listConfig.filter.Direccion_Fiscal = "";
    this.listConfig.filter.Direccion_Postal = "";
    this.listConfig.filter.Correo_Electronico = "";
    this.listConfig.filter.Telefono_de_Contacto = "";
    this.listConfig.filter.Telefono_de_Contacto_2 = "";
    this.listConfig.filter.Celular_de_Contacto = "";
    this.listConfig.filter.Fax = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Pertenece_a_grupo_BAL = "";
    this.listConfig.filter.Tipo_de_Cliente = "";
    this.listConfig.filter.Vigencia_de_Contrato = undefined;
    this.listConfig.filter.Cuota_de_mantenimiento = "";
    this.listConfig.filter.Costo_de_Hora_Rampa = "";
    this.listConfig.filter.Costos_Hora_Tecnico = "";
    this.listConfig.filter.Part_en_div_por_tramo = undefined;

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

//INICIA - BRID:401 - Ocultar columnas Cliente - Autor: Administrador - Actualización: 2/17/2021 12:56:46 PM
if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Clave")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Clave")  } if( "false".trim() == "true" )  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Razon_Social")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Razon_Social")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"EstatusDescripcion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"EstatusDescripcion")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Pertenece_a_grupo_BALDescripcion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Pertenece_a_grupo_BALDescripcion")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Contacto")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Contacto")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Correo_Electronico")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Correo_Electronico")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Direccion_Fiscal")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Direccion_Fiscal")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Direccion_Postal")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Direccion_Postal")  } if("false".trim() == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Telefono_de_Contacto")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Telefono_de_Contacto")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"ID_Dynamics")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"ID_Dynamics")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Tipo_de_ClienteDescripcion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Tipo_de_ClienteDescripcion")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Vigencia_de_Contrato")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Vigencia_de_Contrato")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Cuota_de_mantenimiento")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Cuota_de_mantenimiento")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Contrato")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Contrato")  } if("false".trim() == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Telefono_de_Contacto_2")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Telefono_de_Contacto_2")  } if("false".trim() == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Celular_de_Contacto")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Celular_de_Contacto")  } if("false".trim() == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Fax")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Fax")  }
//TERMINA - BRID:401

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

  remove(row: Cliente) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._ClienteService
          .delete(+row.Clave)
          .pipe(
            catchError(e => {
              const error  = e.error;
              if(~error.indexOf('dbo.')){
              const nombreTablaP =error.substring(error.indexOf('dbo.')+4);
              const nombreTabla  =  nombreTablaP.substring(0,nombreTablaP.indexOf('"')).replaceAll('_',' ');
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
  ActionPrint(dataRow: Cliente) {

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
'Clave'
,'ID Dynamics'
,'RFC'
,'Razón Social'
,'Nombre Corto'
,'Contacto'
,'Dirección Fiscal'
,'Dirección Postal'
,'Correo Electrónico'
,'Teléfono de Contacto'
,'Teléfono de Contacto 2'
,'Celular de Contacto'
,'Fax'
,'Estatus'
,'¿Pertenece a grupo BAL?'
,'Tipo de Cliente'
,'Vigencia de Contrato'
,'Cuota de mantenimiento'
,'Costo de Hora Rampa'
,'Costos Hora Técnico'
,'Participa en división por tramo'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Clave
,x.ID_Dynamics
,x.RFC
,x.Razon_Social
,x.Nombre_Corto
,x.Contacto
,x.Direccion_Fiscal
,x.Direccion_Postal
,x.Correo_Electronico
,x.Telefono_de_Contacto
,x.Telefono_de_Contacto_2
,x.Celular_de_Contacto
,x.Fax
,x.Estatus_Estatus_de_Cliente.Descripcion
,x.Pertenece_a_grupo_BAL_Respuesta.Descripcion
,x.Tipo_de_Cliente_Tipo_de_Cliente.Descripcion
,x.Vigencia_de_Contrato
,x.Cuota_de_mantenimiento
,x.Costo_de_Hora_Rampa
,x.Costos_Hora_Tecnico
,x.Part_en_div_por_tramo
		  
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
    pdfMake.createPdf(pdfDefinition).download('Cliente.pdf');
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
          this._ClienteService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              response.Clientes.forEach(e => {
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
                
                e.Vigencia_de_Contrato = e.Vigencia_de_Contrato ? momentJS(e.Vigencia_de_Contrato).format('DD/MM/YYYY') : '';
                e.Part_en_div_por_tramo = e.Part_en_div_por_tramo ? 'SI' : 'NO';      
              });
              this.dataSourceTemp = response.Clientes;
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
          this._ClienteService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              response.Clientes.forEach(e => {
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
                
                e.Vigencia_de_Contrato = e.Vigencia_de_Contrato ? momentJS(e.Vigencia_de_Contrato).format('DD/MM/YYYY') : '';
                e.Part_en_div_por_tramo = e.Part_en_div_por_tramo ? 'SI' : 'NO';
        
               

              });
              this.dataSourceTemp = response.Clientes;
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
        'Clave ': fields.Clave,
        'ID Dynamics ': fields.ID_Dynamics,
        'RFC ': fields.RFC,
        'Razón Social ': fields.Razon_Social,
        'Nombre Corto ': fields.Nombre_Corto,
        'Contacto ': fields.Contacto,
        'Dirección Fiscal ': fields.Direccion_Fiscal,
        'Dirección Postal ': fields.Direccion_Postal,
        'Correo Electrónico ': fields.Correo_Electronico,
        'Teléfono de Contacto ': fields.Telefono_de_Contacto,
        'Teléfono de Contacto 2 ': fields.Telefono_de_Contacto_2,
        'Celular de Contacto ': fields.Celular_de_Contacto,
        'Fax ': fields.Fax,
        'Estatus ': fields.Estatus_Estatus_de_Cliente.Descripcion,
        '¿Pertenece a grupo BAL? ': fields.Pertenece_a_grupo_BAL_Respuesta.Descripcion,
        'Tipo de Cliente ': fields.Tipo_de_Cliente_Tipo_de_Cliente.Descripcion,
        'Vigencia de Contrato ': fields.Vigencia_de_Contrato ? momentJS(fields.Vigencia_de_Contrato).format('DD/MM/YYYY') : '',
        'Cuota de mantenimiento ': fields.Cuota_de_mantenimiento,
        'Costo de Hora Rampa ': fields.Costo_de_Hora_Rampa,
        'Costos Hora Técnico ': fields.Costos_Hora_Tecnico,
        ' Participa en división por tramo ': fields.Part_en_div_por_tramo ? 'SI' : 'NO',

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Cliente  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Clave: x.Clave,
      ID_Dynamics: x.ID_Dynamics,
      RFC: x.RFC,
      Razon_Social: x.Razon_Social,
      Nombre_Corto: x.Nombre_Corto,
      Contacto: x.Contacto,
      Direccion_Fiscal: x.Direccion_Fiscal,
      Direccion_Postal: x.Direccion_Postal,
      Correo_Electronico: x.Correo_Electronico,
      Telefono_de_Contacto: x.Telefono_de_Contacto,
      Telefono_de_Contacto_2: x.Telefono_de_Contacto_2,
      Celular_de_Contacto: x.Celular_de_Contacto,
      Fax: x.Fax,
      Estatus: x.Estatus_Estatus_de_Cliente.Descripcion,
      Pertenece_a_grupo_BAL: x.Pertenece_a_grupo_BAL_Respuesta.Descripcion,
      Tipo_de_Cliente: x.Tipo_de_Cliente_Tipo_de_Cliente.Descripcion,
      Vigencia_de_Contrato: x.Vigencia_de_Contrato,
      Cuota_de_mantenimiento: x.Cuota_de_mantenimiento,
      Costo_de_Hora_Rampa: x.Costo_de_Hora_Rampa,
      Costos_Hora_Tecnico: x.Costos_Hora_Tecnico,
      Part_en_div_por_tramo: x.Part_en_div_por_tramo,

    }));

    this.excelService.exportToCsv(result, 'Cliente',  ['Clave'    ,'ID_Dynamics'  ,'RFC'  ,'Razon_Social'  ,'Nombre_Corto'  ,'Contacto'  ,'Direccion_Fiscal'  ,'Direccion_Postal'  ,'Correo_Electronico'  ,'Telefono_de_Contacto'  ,'Telefono_de_Contacto_2'  ,'Celular_de_Contacto'  ,'Fax'  ,'Estatus'  ,'Pertenece_a_grupo_BAL'  ,'Tipo_de_Cliente'  ,'Vigencia_de_Contrato'  ,'Cuota_de_mantenimiento'  ,'Costo_de_Hora_Rampa'  ,'Costos_Hora_Tecnico'  ,'Part_en_div_por_tramo' ],
    [' Clave', ' ID Dynamics', ' RFC', ' Razón Social', ' Nombre Corto', ' Contacto', ' Dirección Fiscal', ' Dirección Postal', ' Correo Electrónico', ' Teléfono de Contacto', ' Teléfono de Contacto 2', ' Celular de Contacto', ' Fax', ' Estatus', ' ¿Pertenece a grupo BAL?', ' Tipo de Cliente', ' Vigencia de Contrato', ' Cuota de mantenimiento', ' Costo de Hora Rampa', ' Costos Hora Técnico', ' Participa en división por tramo']);
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
    template += '          <th>Clave</th>';
    template += '          <th>ID Dynamics</th>';
    template += '          <th>RFC</th>';
    template += '          <th>Razón Social</th>';
    template += '          <th>Nombre Corto</th>';
    template += '          <th>Contacto</th>';
    template += '          <th>Dirección Fiscal</th>';
    template += '          <th>Dirección Postal</th>';
    template += '          <th>Correo Electrónico</th>';
    template += '          <th>Teléfono de Contacto</th>';
    template += '          <th>Teléfono de Contacto 2</th>';
    template += '          <th>Celular de Contacto</th>';
    template += '          <th>Fax</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>¿Pertenece a grupo BAL?</th>';
    template += '          <th>Tipo de Cliente</th>';
    template += '          <th>Vigencia de Contrato</th>';
    template += '          <th>Cuota de mantenimiento</th>';
    template += '          <th>Costo de Hora Rampa</th>';
    template += '          <th>Costos Hora Técnico</th>';
    template += '          <th>Participa en división por tramo</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Clave + '</td>';
      template += '          <td>' + element.ID_Dynamics + '</td>';
      template += '          <td>' + element.RFC + '</td>';
      template += '          <td>' + element.Razon_Social + '</td>';
      template += '          <td>' + element.Nombre_Corto + '</td>';
      template += '          <td>' + element.Contacto + '</td>';
      template += '          <td>' + element.Direccion_Fiscal + '</td>';
      template += '          <td>' + element.Direccion_Postal + '</td>';
      template += '          <td>' + element.Correo_Electronico + '</td>';
      template += '          <td>' + element.Telefono_de_Contacto + '</td>';
      template += '          <td>' + element.Telefono_de_Contacto_2 + '</td>';
      template += '          <td>' + element.Celular_de_Contacto + '</td>';
      template += '          <td>' + element.Fax + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Cliente.Descripcion + '</td>';
      template += '          <td>' + element.Pertenece_a_grupo_BAL_Respuesta.Descripcion + '</td>';
      template += '          <td>' + element.Tipo_de_Cliente_Tipo_de_Cliente.Descripcion + '</td>';
      template += '          <td>' + element.Vigencia_de_Contrato + '</td>';
      template += '          <td>' + element.Cuota_de_mantenimiento + '</td>';
      template += '          <td>' + element.Costo_de_Hora_Rampa + '</td>';
      template += '          <td>' + element.Costos_Hora_Tecnico + '</td>';
      template += '          <td>' + element.Part_en_div_por_tramo + '</td>';
		  
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
	template += '\t Clave';
	template += '\t ID Dynamics';
	template += '\t RFC';
	template += '\t Razón Social';
	template += '\t Nombre Corto';
	template += '\t Contacto';
	template += '\t Dirección Fiscal';
	template += '\t Dirección Postal';
	template += '\t Correo Electrónico';
	template += '\t Teléfono de Contacto';
	template += '\t Teléfono de Contacto 2';
	template += '\t Celular de Contacto';
	template += '\t Fax';
	template += '\t Estatus';
	template += '\t ¿Pertenece a grupo BAL?';
	template += '\t Tipo de Cliente';
	template += '\t Vigencia de Contrato';
	template += '\t Cuota de mantenimiento';
	template += '\t Costo de Hora Rampa';
	template += '\t Costos Hora Técnico';
	template += '\t Participa en división por tramo';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Clave;
	  template += '\t ' + element.ID_Dynamics;
	  template += '\t ' + element.RFC;
	  template += '\t ' + element.Razon_Social;
	  template += '\t ' + element.Nombre_Corto;
	  template += '\t ' + element.Contacto;
	  template += '\t ' + element.Direccion_Fiscal;
	  template += '\t ' + element.Direccion_Postal;
	  template += '\t ' + element.Correo_Electronico;
	  template += '\t ' + element.Telefono_de_Contacto;
	  template += '\t ' + element.Telefono_de_Contacto_2;
	  template += '\t ' + element.Celular_de_Contacto;
	  template += '\t ' + element.Fax;
      template += '\t ' + element.Estatus_Estatus_de_Cliente.Descripcion;
      template += '\t ' + element.Pertenece_a_grupo_BAL_Respuesta.Descripcion;
      template += '\t ' + element.Tipo_de_Cliente_Tipo_de_Cliente.Descripcion;
	  template += '\t ' + element.Vigencia_de_Contrato;
	  template += '\t ' + element.Cuota_de_mantenimiento;
	  template += '\t ' + element.Costo_de_Hora_Rampa;
	  template += '\t ' + element.Costos_Hora_Tecnico;
	  template += '\t ' + element.Part_en_div_por_tramo;

	  template += '\n';
    });

    return template;
  }

}

export class ClienteDataSource implements DataSource<Cliente>
{
  private subject = new BehaviorSubject<Cliente[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: ClienteService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Cliente[]> {
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
          if (column === 'Clave') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones'  && column != 'Contrato' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Clientes.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Clientes);
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
      condition += " and Cliente.Clave = " + data.filter.Clave;
    if (data.filter.ID_Dynamics != "")
      condition += " and Cliente.ID_Dynamics like '%" + data.filter.ID_Dynamics + "%' ";
    if (data.filter.RFC != "")
      condition += " and Cliente.RFC like '%" + data.filter.RFC + "%' ";
    if (data.filter.Razon_Social != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Razon_Social + "%' ";
    if (data.filter.Nombre_Corto != "")
      condition += " and Cliente.Nombre_Corto like '%" + data.filter.Nombre_Corto + "%' ";
    if (data.filter.Contacto != "")
      condition += " and Cliente.Contacto like '%" + data.filter.Contacto + "%' ";
    if (data.filter.Direccion_Fiscal != "")
      condition += " and Cliente.Direccion_Fiscal like '%" + data.filter.Direccion_Fiscal + "%' ";
    if (data.filter.Direccion_Postal != "")
      condition += " and Cliente.Direccion_Postal like '%" + data.filter.Direccion_Postal + "%' ";
    if (data.filter.Correo_Electronico != "")
      condition += " and Cliente.Correo_Electronico like '%" + data.filter.Correo_Electronico + "%' ";
    if (data.filter.Telefono_de_Contacto != "")
      condition += " and Cliente.Telefono_de_Contacto like '%" + data.filter.Telefono_de_Contacto + "%' ";
    if (data.filter.Telefono_de_Contacto_2 != "")
      condition += " and Cliente.Telefono_de_Contacto_2 like '%" + data.filter.Telefono_de_Contacto_2 + "%' ";
    if (data.filter.Celular_de_Contacto != "")
      condition += " and Cliente.Celular_de_Contacto like '%" + data.filter.Celular_de_Contacto + "%' ";
    if (data.filter.Fax != "")
      condition += " and Cliente.Fax like '%" + data.filter.Fax + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Cliente.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Pertenece_a_grupo_BAL != "")
      condition += " and Respuesta.Descripcion like '%" + data.filter.Pertenece_a_grupo_BAL + "%' ";
    if (data.filter.Tipo_de_Cliente != "")
      condition += " and Tipo_de_Cliente.Descripcion like '%" + data.filter.Tipo_de_Cliente + "%' ";
    if (data.filter.Vigencia_de_Contrato)
      condition += " and CONVERT(VARCHAR(10), Cliente.Vigencia_de_Contrato, 102)  = '" + moment(data.filter.Vigencia_de_Contrato).format("YYYY.MM.DD") + "'";
    if (data.filter.Cuota_de_mantenimiento != "")
      condition += " and Cliente.Cuota_de_mantenimiento = " + data.filter.Cuota_de_mantenimiento;
    if (data.filter.Costo_de_Hora_Rampa != "")
      condition += " and Cliente.Costo_de_Hora_Rampa = " + data.filter.Costo_de_Hora_Rampa;
    if (data.filter.Costos_Hora_Tecnico != "")
      condition += " and Cliente.Costos_Hora_Tecnico = " + data.filter.Costos_Hora_Tecnico;
    if (data.filter.Part_en_div_por_tramo && data.filter.Part_en_div_por_tramo != "2") {
      if (data.filter.Part_en_div_por_tramo == "0" || data.filter.Part_en_div_por_tramo == "") {
        condition += " and (Cliente.Part_en_div_por_tramo = 0 or Cliente.Part_en_div_por_tramo is null)";
      } else {
        condition += " and Cliente.Part_en_div_por_tramo = 1";
      }
    }

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
        sort = " Cliente.Clave " + data.sortDirecction;
        break;
      case "ID_Dynamics":
        sort = " Cliente.ID_Dynamics " + data.sortDirecction;
        break;
      case "RFC":
        sort = " Cliente.RFC " + data.sortDirecction;
        break;
      case "Razon_Social":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Nombre_Corto":
        sort = " Cliente.Nombre_Corto " + data.sortDirecction;
        break;
      case "Contacto":
        sort = " Cliente.Contacto " + data.sortDirecction;
        break;
      case "Direccion_Fiscal":
        sort = " Cliente.Direccion_Fiscal " + data.sortDirecction;
        break;
      case "Direccion_Postal":
        sort = " Cliente.Direccion_Postal " + data.sortDirecction;
        break;
      case "Correo_Electronico":
        sort = " Cliente.Correo_Electronico " + data.sortDirecction;
        break;
      case "Telefono_de_Contacto":
        sort = " Cliente.Telefono_de_Contacto " + data.sortDirecction;
        break;
      case "Telefono_de_Contacto_2":
        sort = " Cliente.Telefono_de_Contacto_2 " + data.sortDirecction;
        break;
      case "Celular_de_Contacto":
        sort = " Cliente.Celular_de_Contacto " + data.sortDirecction;
        break;
      case "Fax":
        sort = " Cliente.Fax " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Cliente.Descripcion " + data.sortDirecction;
        break;
      case "Pertenece_a_grupo_BAL":
        sort = " Respuesta.Descripcion " + data.sortDirecction;
        break;
      case "Tipo_de_Cliente":
        sort = " Tipo_de_Cliente.Descripcion " + data.sortDirecction;
        break;
      case "Vigencia_de_Contrato":
        sort = " Cliente.Vigencia_de_Contrato " + data.sortDirecction;
        break;
      case "Cuota_de_mantenimiento":
        sort = " Cliente.Cuota_de_mantenimiento " + data.sortDirecction;
        break;
      case "Costo_de_Hora_Rampa":
        sort = " Cliente.Costo_de_Hora_Rampa " + data.sortDirecction;
        break;
      case "Costos_Hora_Tecnico":
        sort = " Cliente.Costos_Hora_Tecnico " + data.sortDirecction;
        break;
      case "Part_en_div_por_tramo":
        sort = " Cliente.Part_en_div_por_tramo " + data.sortDirecction;
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
        condition += " AND Cliente.Clave >= " + data.filterAdvanced.fromClave;

      if (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave) 
        condition += " AND Cliente.Clave <= " + data.filterAdvanced.toClave;
    }
    switch (data.filterAdvanced.ID_DynamicsFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.ID_Dynamics LIKE '" + data.filterAdvanced.ID_Dynamics + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.ID_Dynamics LIKE '%" + data.filterAdvanced.ID_Dynamics + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.ID_Dynamics LIKE '%" + data.filterAdvanced.ID_Dynamics + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.ID_Dynamics = '" + data.filterAdvanced.ID_Dynamics + "'";
        break;
    }
    switch (data.filterAdvanced.RFCFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.RFC LIKE '" + data.filterAdvanced.RFC + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.RFC LIKE '%" + data.filterAdvanced.RFC + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.RFC LIKE '%" + data.filterAdvanced.RFC + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.RFC = '" + data.filterAdvanced.RFC + "'";
        break;
    }
    switch (data.filterAdvanced.Razon_SocialFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.Razon_Social + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Razon_Social + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Razon_Social + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.Razon_Social + "'";
        break;
    }
    switch (data.filterAdvanced.Nombre_CortoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Nombre_Corto LIKE '" + data.filterAdvanced.Nombre_Corto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Nombre_Corto LIKE '%" + data.filterAdvanced.Nombre_Corto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Nombre_Corto LIKE '%" + data.filterAdvanced.Nombre_Corto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Nombre_Corto = '" + data.filterAdvanced.Nombre_Corto + "'";
        break;
    }
    switch (data.filterAdvanced.ContactoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Contacto LIKE '" + data.filterAdvanced.Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Contacto LIKE '%" + data.filterAdvanced.Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Contacto LIKE '%" + data.filterAdvanced.Contacto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Contacto = '" + data.filterAdvanced.Contacto + "'";
        break;
    }
    switch (data.filterAdvanced.Direccion_FiscalFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Direccion_Fiscal LIKE '" + data.filterAdvanced.Direccion_Fiscal + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Direccion_Fiscal LIKE '%" + data.filterAdvanced.Direccion_Fiscal + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Direccion_Fiscal LIKE '%" + data.filterAdvanced.Direccion_Fiscal + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Direccion_Fiscal = '" + data.filterAdvanced.Direccion_Fiscal + "'";
        break;
    }
    switch (data.filterAdvanced.Direccion_PostalFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Direccion_Postal LIKE '" + data.filterAdvanced.Direccion_Postal + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Direccion_Postal LIKE '%" + data.filterAdvanced.Direccion_Postal + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Direccion_Postal LIKE '%" + data.filterAdvanced.Direccion_Postal + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Direccion_Postal = '" + data.filterAdvanced.Direccion_Postal + "'";
        break;
    }
    switch (data.filterAdvanced.Correo_ElectronicoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Correo_Electronico LIKE '" + data.filterAdvanced.Correo_Electronico + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Correo_Electronico LIKE '%" + data.filterAdvanced.Correo_Electronico + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Correo_Electronico LIKE '%" + data.filterAdvanced.Correo_Electronico + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Correo_Electronico = '" + data.filterAdvanced.Correo_Electronico + "'";
        break;
    }
    switch (data.filterAdvanced.Telefono_de_ContactoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Telefono_de_Contacto LIKE '" + data.filterAdvanced.Telefono_de_Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Telefono_de_Contacto LIKE '%" + data.filterAdvanced.Telefono_de_Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Telefono_de_Contacto LIKE '%" + data.filterAdvanced.Telefono_de_Contacto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Telefono_de_Contacto = '" + data.filterAdvanced.Telefono_de_Contacto + "'";
        break;
    }
    switch (data.filterAdvanced.Telefono_de_Contacto_2Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Telefono_de_Contacto_2 LIKE '" + data.filterAdvanced.Telefono_de_Contacto_2 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Telefono_de_Contacto_2 LIKE '%" + data.filterAdvanced.Telefono_de_Contacto_2 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Telefono_de_Contacto_2 LIKE '%" + data.filterAdvanced.Telefono_de_Contacto_2 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Telefono_de_Contacto_2 = '" + data.filterAdvanced.Telefono_de_Contacto_2 + "'";
        break;
    }
    switch (data.filterAdvanced.Celular_de_ContactoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Celular_de_Contacto LIKE '" + data.filterAdvanced.Celular_de_Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Celular_de_Contacto LIKE '%" + data.filterAdvanced.Celular_de_Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Celular_de_Contacto LIKE '%" + data.filterAdvanced.Celular_de_Contacto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Celular_de_Contacto = '" + data.filterAdvanced.Celular_de_Contacto + "'";
        break;
    }
    switch (data.filterAdvanced.FaxFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Cliente.Fax LIKE '" + data.filterAdvanced.Fax + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Cliente.Fax LIKE '%" + data.filterAdvanced.Fax + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Cliente.Fax LIKE '%" + data.filterAdvanced.Fax + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Cliente.Fax = '" + data.filterAdvanced.Fax + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Cliente.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Cliente.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Cliente.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Cliente.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Cliente.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.Pertenece_a_grupo_BAL != 'undefined' && data.filterAdvanced.Pertenece_a_grupo_BAL)) {
      switch (data.filterAdvanced.Pertenece_a_grupo_BALFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Respuesta.Descripcion LIKE '" + data.filterAdvanced.Pertenece_a_grupo_BAL + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Pertenece_a_grupo_BAL + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Pertenece_a_grupo_BAL + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Respuesta.Descripcion = '" + data.filterAdvanced.Pertenece_a_grupo_BAL + "'";
          break;
      }
    } else if (data.filterAdvanced.Pertenece_a_grupo_BALMultiple != null && data.filterAdvanced.Pertenece_a_grupo_BALMultiple.length > 0) {
      var Pertenece_a_grupo_BALds = data.filterAdvanced.Pertenece_a_grupo_BALMultiple.join(",");
      condition += " AND Cliente.Pertenece_a_grupo_BAL In (" + Pertenece_a_grupo_BALds + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_Cliente != 'undefined' && data.filterAdvanced.Tipo_de_Cliente)) {
      switch (data.filterAdvanced.Tipo_de_ClienteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Cliente.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Cliente.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Cliente + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Cliente.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_Cliente + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Cliente.Descripcion = '" + data.filterAdvanced.Tipo_de_Cliente + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_ClienteMultiple != null && data.filterAdvanced.Tipo_de_ClienteMultiple.length > 0) {
      var Tipo_de_Clienteds = data.filterAdvanced.Tipo_de_ClienteMultiple.join(",");
      condition += " AND Cliente.Tipo_de_Cliente In (" + Tipo_de_Clienteds + ")";
    }
    if ((typeof data.filterAdvanced.fromVigencia_de_Contrato != 'undefined' && data.filterAdvanced.fromVigencia_de_Contrato)
	|| (typeof data.filterAdvanced.toVigencia_de_Contrato != 'undefined' && data.filterAdvanced.toVigencia_de_Contrato)) 
	{
      if (typeof data.filterAdvanced.fromVigencia_de_Contrato != 'undefined' && data.filterAdvanced.fromVigencia_de_Contrato) 
        condition += " and CONVERT(VARCHAR(10), Cliente.Vigencia_de_Contrato, 102)  >= '" +  moment(data.filterAdvanced.fromVigencia_de_Contrato).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toVigencia_de_Contrato != 'undefined' && data.filterAdvanced.toVigencia_de_Contrato) 
        condition += " and CONVERT(VARCHAR(10), Cliente.Vigencia_de_Contrato, 102)  <= '" + moment(data.filterAdvanced.toVigencia_de_Contrato).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromCuota_de_mantenimiento != 'undefined' && data.filterAdvanced.fromCuota_de_mantenimiento)
	|| (typeof data.filterAdvanced.toCuota_de_mantenimiento != 'undefined' && data.filterAdvanced.toCuota_de_mantenimiento)) 
	{
      if (typeof data.filterAdvanced.fromCuota_de_mantenimiento != 'undefined' && data.filterAdvanced.fromCuota_de_mantenimiento)
        condition += " AND Cliente.Cuota_de_mantenimiento >= " + data.filterAdvanced.fromCuota_de_mantenimiento;

      if (typeof data.filterAdvanced.toCuota_de_mantenimiento != 'undefined' && data.filterAdvanced.toCuota_de_mantenimiento) 
        condition += " AND Cliente.Cuota_de_mantenimiento <= " + data.filterAdvanced.toCuota_de_mantenimiento;
    }
    if ((typeof data.filterAdvanced.fromCosto_de_Hora_Rampa != 'undefined' && data.filterAdvanced.fromCosto_de_Hora_Rampa)
	|| (typeof data.filterAdvanced.toCosto_de_Hora_Rampa != 'undefined' && data.filterAdvanced.toCosto_de_Hora_Rampa)) 
	{
      if (typeof data.filterAdvanced.fromCosto_de_Hora_Rampa != 'undefined' && data.filterAdvanced.fromCosto_de_Hora_Rampa)
        condition += " AND Cliente.Costo_de_Hora_Rampa >= " + data.filterAdvanced.fromCosto_de_Hora_Rampa;

      if (typeof data.filterAdvanced.toCosto_de_Hora_Rampa != 'undefined' && data.filterAdvanced.toCosto_de_Hora_Rampa) 
        condition += " AND Cliente.Costo_de_Hora_Rampa <= " + data.filterAdvanced.toCosto_de_Hora_Rampa;
    }
    if ((typeof data.filterAdvanced.fromCostos_Hora_Tecnico != 'undefined' && data.filterAdvanced.fromCostos_Hora_Tecnico)
	|| (typeof data.filterAdvanced.toCostos_Hora_Tecnico != 'undefined' && data.filterAdvanced.toCostos_Hora_Tecnico)) 
	{
      if (typeof data.filterAdvanced.fromCostos_Hora_Tecnico != 'undefined' && data.filterAdvanced.fromCostos_Hora_Tecnico)
        condition += " AND Cliente.Costos_Hora_Tecnico >= " + data.filterAdvanced.fromCostos_Hora_Tecnico;

      if (typeof data.filterAdvanced.toCostos_Hora_Tecnico != 'undefined' && data.filterAdvanced.toCostos_Hora_Tecnico) 
        condition += " AND Cliente.Costos_Hora_Tecnico <= " + data.filterAdvanced.toCostos_Hora_Tecnico;
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
          } else if (column != 'acciones'  && column != 'Contrato' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Clientes.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false  || column === 'Paquete_de_beneficios' ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Clientes);
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
