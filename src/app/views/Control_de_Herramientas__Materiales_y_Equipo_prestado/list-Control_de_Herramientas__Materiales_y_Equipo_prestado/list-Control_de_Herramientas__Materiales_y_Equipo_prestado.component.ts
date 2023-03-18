import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Control_de_Herramientas__Materiales_y_Equipo_prestadoService } from "src/app/api-services/Control_de_Herramientas__Materiales_y_Equipo_prestado.service";
import { Control_de_Herramientas__Materiales_y_Equipo_prestado } from "src/app/models/Control_de_Herramientas__Materiales_y_Equipo_prestado";
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
import { Control_de_Herramientas__Materiales_y_Equipo_prestadoIndexRules } from 'src/app/shared/businessRules/Control_de_Herramientas__Materiales_y_Equipo_prestado-index-rules';
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
  selector: "app-list-Control_de_Herramientas__Materiales_y_Equipo_prestado",
  templateUrl: "./list-Control_de_Herramientas__Materiales_y_Equipo_prestado.component.html",
  styleUrls: ["./list-Control_de_Herramientas__Materiales_y_Equipo_prestado.component.scss"],
})
export class ListControl_de_Herramientas__Materiales_y_Equipo_prestadoComponent extends Control_de_Herramientas__Materiales_y_Equipo_prestadoIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Aplicacion",
    "Matricula",
    "No_O_T",
    "No_O_S",
    "No__Reporte",
    "No__Vuelo",
    "Fecha_Salida",
    "Solicitante",
    "Observaciones",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Aplicacion",
      "Matricula",
      "No_O_T",
      "No_O_S",
      "No__Reporte",
      "No__Vuelo",
      "Fecha_Salida",
      "Solicitante",
      "Observaciones",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Aplicacion_filtro",
      "Matricula_filtro",
      "No_O_T_filtro",
      "No_O_S_filtro",
      "No__Reporte_filtro",
      "No__Vuelo_filtro",
      "Fecha_Salida_filtro",
      "Solicitante_filtro",
      "Observaciones_filtro",

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
      Aplicacion: "",
      Matricula: "",
      No_O_T: "",
      No_O_S: "",
      No__Reporte: "",
      No__Vuelo: "",
      Fecha_Salida: null,
      Solicitante: "",
      Contrasena_del_Solicitante: "",
      Observaciones: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      AplicacionFilter: "",
      Aplicacion: "",
      AplicacionMultiple: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      No_O_TFilter: "",
      No_O_T: "",
      No_O_TMultiple: "",
      No_O_SFilter: "",
      No_O_S: "",
      No_O_SMultiple: "",
      No__ReporteFilter: "",
      No__Reporte: "",
      No__ReporteMultiple: "",
      No__VueloFilter: "",
      No__Vuelo: "",
      No__VueloMultiple: "",
      fromFecha_Salida: "",
      toFecha_Salida: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",

    }
  };

  dataSource: Control_de_Herramientas__Materiales_y_Equipo_prestadoDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Control_de_Herramientas__Materiales_y_Equipo_prestadoDataSource;
  dataClipboard: any;

  constructor(
    private _Control_de_Herramientas__Materiales_y_Equipo_prestadoService: Control_de_Herramientas__Materiales_y_Equipo_prestadoService,
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
    this.dataSource = new Control_de_Herramientas__Materiales_y_Equipo_prestadoDataSource(
      this._Control_de_Herramientas__Materiales_y_Equipo_prestadoService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Control_de_Herramientas__Materiales_y_Equipo_prestado)
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
    this.listConfig.filter.Aplicacion = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.No_O_T = "";
    this.listConfig.filter.No_O_S = "";
    this.listConfig.filter.No__Reporte = "";
    this.listConfig.filter.No__Vuelo = "";
    this.listConfig.filter.Fecha_Salida = undefined;
    this.listConfig.filter.Solicitante = "";
    this.listConfig.filter.Contrasena_del_Solicitante = "";
    this.listConfig.filter.Observaciones = "";

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

//INICIA - BRID:7210 - Ocultar campo contraseña - Autor: Lizeth Villa - Actualización: 10/28/2021 5:20:13 PM
if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Contrasena_del_Solicitante")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Contrasena_del_Solicitante")  }
//TERMINA - BRID:7210

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

  remove(row: Control_de_Herramientas__Materiales_y_Equipo_prestado) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Control_de_Herramientas__Materiales_y_Equipo_prestadoService
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
  ActionPrint(dataRow: Control_de_Herramientas__Materiales_y_Equipo_prestado) {

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
'Folio'
,'Aplicación'
,'Matrícula'
,'No.O/T'
,'No.O/S'
,'No. Reporte'
,'No. Vuelo'
,'Fecha de Solicitud'
,'Solicitante'
,'Contraseña del Solicitante'
,'Observaciones'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Aplicacion_Aplicacion__de_Prestamo.Descripcion
,x.Matricula_Aeronave.Matricula
,x.No_O_T_Orden_de_Trabajo.numero_de_orden
,x.No_O_S_Orden_de_servicio.Folio_OS
,x.No__Reporte_Crear_Reporte.No_Reporte
,x.No__Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
,x.Fecha_Salida
,x.Solicitante_Spartan_User.Name
,x.Contrasena_del_Solicitante
,x.Observaciones
		  
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
    pdfMake.createPdf(pdfDefinition).download('Control_de_Herramientas__Materiales_y_Equipo_prestado.pdf');
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
          this._Control_de_Herramientas__Materiales_y_Equipo_prestadoService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Control_de_Herramientas__Materiales_y_Equipo_prestados;
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
          this._Control_de_Herramientas__Materiales_y_Equipo_prestadoService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Control_de_Herramientas__Materiales_y_Equipo_prestados;
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
        'Folio ': fields.Folio,
        'Aplicación ': fields.Aplicacion_Aplicacion__de_Prestamo.Descripcion,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'No.O/T ': fields.No_O_T_Orden_de_Trabajo.numero_de_orden,
        'No.O/S ': fields.No_O_S_Orden_de_servicio.Folio_OS,
        'No. Reporte ': fields.No__Reporte_Crear_Reporte.No_Reporte,
        'No. Vuelo ': fields.No__Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Fecha de Solicitud ': fields.Fecha_Salida ? momentJS(fields.Fecha_Salida).format('DD/MM/YYYY') : '',
        'Solicitante ': fields.Solicitante_Spartan_User.Name,
        'Contraseña del Solicitante ': fields.Contrasena_del_Solicitante,
        'Observaciones ': fields.Observaciones,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Control_de_Herramientas__Materiales_y_Equipo_prestado  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Aplicacion: x.Aplicacion_Aplicacion__de_Prestamo.Descripcion,
      Matricula: x.Matricula_Aeronave.Matricula,
      No_O_T: x.No_O_T_Orden_de_Trabajo.numero_de_orden,
      No_O_S: x.No_O_S_Orden_de_servicio.Folio_OS,
      No__Reporte: x.No__Reporte_Crear_Reporte.No_Reporte,
      No__Vuelo: x.No__Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Fecha_Salida: x.Fecha_Salida,
      Solicitante: x.Solicitante_Spartan_User.Name,
      Contrasena_del_Solicitante: x.Contrasena_del_Solicitante,
      Observaciones: x.Observaciones,

    }));

    this.excelService.exportToCsv(result, 'Control_de_Herramientas__Materiales_y_Equipo_prestado',  ['Folio'    ,'Aplicacion'  ,'Matricula'  ,'No_O_T'  ,'No_O_S'  ,'No__Reporte'  ,'No__Vuelo'  ,'Fecha_Salida'  ,'Solicitante'  ,'Contrasena_del_Solicitante'  ,'Observaciones' ]);
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
    template += '          <th>Folio</th>';
    template += '          <th>Aplicación</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>No.O/T</th>';
    template += '          <th>No.O/S</th>';
    template += '          <th>No. Reporte</th>';
    template += '          <th>No. Vuelo</th>';
    template += '          <th>Fecha de Solicitud</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Contraseña del Solicitante</th>';
    template += '          <th>Observaciones</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Aplicacion_Aplicacion__de_Prestamo.Descripcion + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.No_O_T_Orden_de_Trabajo.numero_de_orden + '</td>';
      template += '          <td>' + element.No_O_S_Orden_de_servicio.Folio_OS + '</td>';
      template += '          <td>' + element.No__Reporte_Crear_Reporte.No_Reporte + '</td>';
      template += '          <td>' + element.No__Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Fecha_Salida + '</td>';
      template += '          <td>' + element.Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Contrasena_del_Solicitante + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
		  
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
	template += '\t Folio';
	template += '\t Aplicación';
	template += '\t Matrícula';
	template += '\t No.O/T';
	template += '\t No.O/S';
	template += '\t No. Reporte';
	template += '\t No. Vuelo';
	template += '\t Fecha de Solicitud';
	template += '\t Solicitante';
	template += '\t Contraseña del Solicitante';
	template += '\t Observaciones';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Aplicacion_Aplicacion__de_Prestamo.Descripcion;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.No_O_T_Orden_de_Trabajo.numero_de_orden;
      template += '\t ' + element.No_O_S_Orden_de_servicio.Folio_OS;
      template += '\t ' + element.No__Reporte_Crear_Reporte.No_Reporte;
      template += '\t ' + element.No__Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
	  template += '\t ' + element.Fecha_Salida;
      template += '\t ' + element.Solicitante_Spartan_User.Name;
	  template += '\t ' + element.Contrasena_del_Solicitante;
	  template += '\t ' + element.Observaciones;

	  template += '\n';
    });

    return template;
  }

}

export class Control_de_Herramientas__Materiales_y_Equipo_prestadoDataSource implements DataSource<Control_de_Herramientas__Materiales_y_Equipo_prestado>
{
  private subject = new BehaviorSubject<Control_de_Herramientas__Materiales_y_Equipo_prestado[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Control_de_Herramientas__Materiales_y_Equipo_prestadoService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Control_de_Herramientas__Materiales_y_Equipo_prestado[]> {
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
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Control_de_Herramientas__Materiales_y_Equipo_prestados.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Control_de_Herramientas__Materiales_y_Equipo_prestados);
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
      condition += " and Control_de_Herramientas__Materiales_y_Equipo_prestado.Folio = " + data.filter.Folio;
    if (data.filter.Aplicacion != "")
      condition += " and Aplicacion__de_Prestamo.Descripcion like '%" + data.filter.Aplicacion + "%' ";
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.No_O_T != "")
      condition += " and Orden_de_Trabajo.numero_de_orden like '%" + data.filter.No_O_T + "%' ";
    if (data.filter.No_O_S != "")
      condition += " and Orden_de_servicio.Folio_OS like '%" + data.filter.No_O_S + "%' ";
    if (data.filter.No__Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.No__Reporte + "%' ";
    if (data.filter.No__Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.No__Vuelo + "%' ";
    if (data.filter.Fecha_Salida)
      condition += " and CONVERT(VARCHAR(10), Control_de_Herramientas__Materiales_y_Equipo_prestado.Fecha_Salida, 102)  = '" + moment(data.filter.Fecha_Salida).format("YYYY.MM.DD") + "'";
    if (data.filter.Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante + "%' ";
    if (data.filter.Contrasena_del_Solicitante != "")
      condition += " and Control_de_Herramientas__Materiales_y_Equipo_prestado.Contrasena_del_Solicitante like '%" + data.filter.Contrasena_del_Solicitante + "%' ";
    if (data.filter.Observaciones != "")
      condition += " and Control_de_Herramientas__Materiales_y_Equipo_prestado.Observaciones like '%" + data.filter.Observaciones + "%' ";

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
        sort = " Control_de_Herramientas__Materiales_y_Equipo_prestado.Folio " + data.sortDirecction;
        break;
      case "Aplicacion":
        sort = " Aplicacion__de_Prestamo.Descripcion " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "No_O_T":
        sort = " Orden_de_Trabajo.numero_de_orden " + data.sortDirecction;
        break;
      case "No_O_S":
        sort = " Orden_de_servicio.Folio_OS " + data.sortDirecction;
        break;
      case "No__Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "No__Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Fecha_Salida":
        sort = " Control_de_Herramientas__Materiales_y_Equipo_prestado.Fecha_Salida " + data.sortDirecction;
        break;
      case "Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Contrasena_del_Solicitante":
        sort = " Control_de_Herramientas__Materiales_y_Equipo_prestado.Contrasena_del_Solicitante " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Control_de_Herramientas__Materiales_y_Equipo_prestado.Observaciones " + data.sortDirecction;
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
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Aplicacion != 'undefined' && data.filterAdvanced.Aplicacion)) {
      switch (data.filterAdvanced.AplicacionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aplicacion__de_Prestamo.Descripcion LIKE '" + data.filterAdvanced.Aplicacion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aplicacion__de_Prestamo.Descripcion LIKE '%" + data.filterAdvanced.Aplicacion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aplicacion__de_Prestamo.Descripcion LIKE '%" + data.filterAdvanced.Aplicacion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aplicacion__de_Prestamo.Descripcion = '" + data.filterAdvanced.Aplicacion + "'";
          break;
      }
    } else if (data.filterAdvanced.AplicacionMultiple != null && data.filterAdvanced.AplicacionMultiple.length > 0) {
      var Aplicacionds = data.filterAdvanced.AplicacionMultiple.join(",");
      condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Aplicacion In (" + Aplicacionds + ")";
    }
    if ((typeof data.filterAdvanced.Matricula != 'undefined' && data.filterAdvanced.Matricula)) {
      switch (data.filterAdvanced.MatriculaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeronave.Matricula LIKE '" + data.filterAdvanced.Matricula + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Matricula + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeronave.Matricula LIKE '%" + data.filterAdvanced.Matricula + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeronave.Matricula = '" + data.filterAdvanced.Matricula + "'";
          break;
      }
    } else if (data.filterAdvanced.MatriculaMultiple != null && data.filterAdvanced.MatriculaMultiple.length > 0) {
      var Matriculads = data.filterAdvanced.MatriculaMultiple.join(",");
      condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.No_O_T != 'undefined' && data.filterAdvanced.No_O_T)) {
      switch (data.filterAdvanced.No_O_TFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '" + data.filterAdvanced.No_O_T + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.No_O_T + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_Trabajo.numero_de_orden LIKE '%" + data.filterAdvanced.No_O_T + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_Trabajo.numero_de_orden = '" + data.filterAdvanced.No_O_T + "'";
          break;
      }
    } else if (data.filterAdvanced.No_O_TMultiple != null && data.filterAdvanced.No_O_TMultiple.length > 0) {
      var No_O_Tds = data.filterAdvanced.No_O_TMultiple.join(",");
      condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.No_O_T In (" + No_O_Tds + ")";
    }
    if ((typeof data.filterAdvanced.No_O_S != 'undefined' && data.filterAdvanced.No_O_S)) {
      switch (data.filterAdvanced.No_O_SFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '" + data.filterAdvanced.No_O_S + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '%" + data.filterAdvanced.No_O_S + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Orden_de_servicio.Folio_OS LIKE '%" + data.filterAdvanced.No_O_S + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Orden_de_servicio.Folio_OS = '" + data.filterAdvanced.No_O_S + "'";
          break;
      }
    } else if (data.filterAdvanced.No_O_SMultiple != null && data.filterAdvanced.No_O_SMultiple.length > 0) {
      var No_O_Sds = data.filterAdvanced.No_O_SMultiple.join(",");
      condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.No_O_S In (" + No_O_Sds + ")";
    }
    if ((typeof data.filterAdvanced.No__Reporte != 'undefined' && data.filterAdvanced.No__Reporte)) {
      switch (data.filterAdvanced.No__ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.No__Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.No__Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.No__Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.No__Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.No__ReporteMultiple != null && data.filterAdvanced.No__ReporteMultiple.length > 0) {
      var No__Reporteds = data.filterAdvanced.No__ReporteMultiple.join(",");
      condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.No__Reporte In (" + No__Reporteds + ")";
    }
    if ((typeof data.filterAdvanced.No__Vuelo != 'undefined' && data.filterAdvanced.No__Vuelo)) {
      switch (data.filterAdvanced.No__VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.No__Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No__Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.No__Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.No__Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.No__VueloMultiple != null && data.filterAdvanced.No__VueloMultiple.length > 0) {
      var No__Vuelods = data.filterAdvanced.No__VueloMultiple.join(",");
      condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.No__Vuelo In (" + No__Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_Salida != 'undefined' && data.filterAdvanced.fromFecha_Salida)
	|| (typeof data.filterAdvanced.toFecha_Salida != 'undefined' && data.filterAdvanced.toFecha_Salida)) 
	{
      if (typeof data.filterAdvanced.fromFecha_Salida != 'undefined' && data.filterAdvanced.fromFecha_Salida) 
        condition += " and CONVERT(VARCHAR(10), Control_de_Herramientas__Materiales_y_Equipo_prestado.Fecha_Salida, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_Salida).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_Salida != 'undefined' && data.filterAdvanced.toFecha_Salida) 
        condition += " and CONVERT(VARCHAR(10), Control_de_Herramientas__Materiales_y_Equipo_prestado.Fecha_Salida, 102)  <= '" + moment(data.filterAdvanced.toFecha_Salida).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Solicitante != 'undefined' && data.filterAdvanced.Solicitante)) {
      switch (data.filterAdvanced.SolicitanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Solicitante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Solicitante + "'";
          break;
      }
    } else if (data.filterAdvanced.SolicitanteMultiple != null && data.filterAdvanced.SolicitanteMultiple.length > 0) {
      var Solicitanteds = data.filterAdvanced.SolicitanteMultiple.join(",");
      condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Solicitante In (" + Solicitanteds + ")";
    }
    switch (data.filterAdvanced.Contrasena_del_SolicitanteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Contrasena_del_Solicitante LIKE '" + data.filterAdvanced.Contrasena_del_Solicitante + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Contrasena_del_Solicitante LIKE '%" + data.filterAdvanced.Contrasena_del_Solicitante + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Contrasena_del_Solicitante LIKE '%" + data.filterAdvanced.Contrasena_del_Solicitante + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Contrasena_del_Solicitante = '" + data.filterAdvanced.Contrasena_del_Solicitante + "'";
        break;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_de_Herramientas__Materiales_y_Equipo_prestado.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
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
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Control_de_Herramientas__Materiales_y_Equipo_prestados.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Control_de_Herramientas__Materiales_y_Equipo_prestados);
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
