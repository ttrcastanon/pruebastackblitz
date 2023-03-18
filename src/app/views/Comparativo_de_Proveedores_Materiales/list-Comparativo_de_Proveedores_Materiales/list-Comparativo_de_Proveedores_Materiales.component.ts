import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Comparativo_de_Proveedores_MaterialesService } from "src/app/api-services/Comparativo_de_Proveedores_Materiales.service";
import { Comparativo_de_Proveedores_Materiales } from "src/app/models/Comparativo_de_Proveedores_Materiales";
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
import { Comparativo_de_Proveedores_MaterialesIndexRules } from 'src/app/shared/businessRules/Comparativo_de_Proveedores_Materiales-index-rules';
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
  selector: "app-list-Comparativo_de_Proveedores_Materiales",
  templateUrl: "./list-Comparativo_de_Proveedores_Materiales.component.html",
  styleUrls: ["./list-Comparativo_de_Proveedores_Materiales.component.scss"],
})
export class ListComparativo_de_Proveedores_MaterialesComponent extends Comparativo_de_Proveedores_MaterialesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Folio_MR_Materiales",
    "Folio_MR_Fila_Materiales",
    "No__Solicitud",
    "Descripcion",
    "Cantidad",
    "Matricula",
    "Modelo",
    "No_Reporte",
    "Condicion_de_la_parte",
    "Razon_de_la_Solicitud",
    "Estatus",
    "Observaciones",
    "Estatus2",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_MR_Materiales",
      "Folio_MR_Fila_Materiales",
      "No__Solicitud",
      "Descripcion",
      "Cantidad",
      "Matricula",
      "Modelo",
      "No_Reporte",
      "Condicion_de_la_parte",
      "Razon_de_la_Solicitud",
      "Estatus",
      "Observaciones",
      "Estatus2",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_MR_Materiales_filtro",
      "Folio_MR_Fila_Materiales_filtro",
      "No__Solicitud_filtro",
      "Descripcion_filtro",
      "Cantidad_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "No_Reporte_filtro",
      "Condicion_de_la_parte_filtro",
      "Razon_de_la_Solicitud_filtro",
      "Estatus_filtro",
      "Observaciones_filtro",
      "Estatus2_filtro",

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
      Folio_MR_Materiales: "",
      Folio_MR_Fila_Materiales: "",
      No__Solicitud: "",
      Descripcion: "",
      Cantidad: "",
      Matricula: "",
      Modelo: "",
      No_Reporte: "",
      Condicion_de_la_parte: "",
      Razon_de_la_Solicitud: "",
      Estatus: "",
      Observaciones: "",
      Estatus2: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Folio_MR_MaterialesFilter: "",
      Folio_MR_Materiales: "",
      Folio_MR_MaterialesMultiple: "",
      Folio_MR_Fila_MaterialesFilter: "",
      Folio_MR_Fila_Materiales: "",
      Folio_MR_Fila_MaterialesMultiple: "",
      fromNo__Solicitud: "",
      toNo__Solicitud: "",
      fromCantidad: "",
      toCantidad: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromNo_Reporte: "",
      toNo_Reporte: "",
      fromCondicion_de_la_parte: "",
      toCondicion_de_la_parte: "",

    }
  };

  dataSource: Comparativo_de_Proveedores_MaterialesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Comparativo_de_Proveedores_MaterialesDataSource;
  dataClipboard: any;

  constructor(
    private _Comparativo_de_Proveedores_MaterialesService: Comparativo_de_Proveedores_MaterialesService,
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
    this.dataSource = new Comparativo_de_Proveedores_MaterialesDataSource(
      this._Comparativo_de_Proveedores_MaterialesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Comparativo_de_Proveedores_Materiales)
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
    this.listConfig.filter.Folio_MR_Materiales = "";
    this.listConfig.filter.Folio_MR_Fila_Materiales = "";
    this.listConfig.filter.No__Solicitud = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Cantidad = "";
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.No_Reporte = "";
    this.listConfig.filter.Condicion_de_la_parte = "";
    this.listConfig.filter.Razon_de_la_Solicitud = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Observaciones = "";
    this.listConfig.filter.Estatus2 = "";

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

  remove(row: Comparativo_de_Proveedores_Materiales) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Comparativo_de_Proveedores_MaterialesService
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
  ActionPrint(dataRow: Comparativo_de_Proveedores_Materiales) {

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
,'Folio MR Materiales'
,'Folio MR Fila Materiales'
,'No. Solicitud'
,'Descripción'
,'Cantidad'
,'Matrícula'
,'Modelo'
,'No Reporte'
,'Condición de la parte'
,'Razón de la Solicitud'
,'Estatus'
,'Observaciones'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Folio_MR_Materiales_Detalle_de_Materiales.Folio_MR_Materiales
,x.Folio_MR_Fila_Materiales_Detalle_de_Materiales.Folio_MR_fila_Materiales
,x.No__Solicitud
,x.Descripcion
,x.Cantidad
,x.Matricula_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.No_Reporte
,x.Condicion_de_la_parte
,x.Razon_de_la_Solicitud
,x.Estatus
,x.Observaciones
,x.Estatus2
		  
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
    pdfMake.createPdf(pdfDefinition).download('Comparativo_de_Proveedores_Materiales.pdf');
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
          this._Comparativo_de_Proveedores_MaterialesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Comparativo_de_Proveedores_Materialess;
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
          this._Comparativo_de_Proveedores_MaterialesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Comparativo_de_Proveedores_Materialess;
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
        'Folio MR Materiales ': fields.Folio_MR_Materiales_Detalle_de_Materiales.Folio_MR_Materiales,
        'Folio MR Fila Materiales 1': fields.Folio_MR_Fila_Materiales_Detalle_de_Materiales.Folio_MR_fila_Materiales,
        'No. Solicitud ': fields.No__Solicitud,
        'Descripción ': fields.Descripcion,
        'Cantidad ': fields.Cantidad,
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'No Reporte ': fields.No_Reporte,
        'Condición de la parte ': fields.Condicion_de_la_parte,
        'Razón de la Solicitud ': fields.Razon_de_la_Solicitud,
        'Estatus ': fields.Estatus,
        'Observaciones ': fields.Observaciones,
        'Estatus 1 ': fields.Estatus2,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Comparativo_de_Proveedores_Materiales  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Folio_MR_Materiales: x.Folio_MR_Materiales_Detalle_de_Materiales.Folio_MR_Materiales,
      Folio_MR_Fila_Materiales: x.Folio_MR_Fila_Materiales_Detalle_de_Materiales.Folio_MR_fila_Materiales,
      No__Solicitud: x.No__Solicitud,
      Descripcion: x.Descripcion,
      Cantidad: x.Cantidad,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      No_Reporte: x.No_Reporte,
      Condicion_de_la_parte: x.Condicion_de_la_parte,
      Razon_de_la_Solicitud: x.Razon_de_la_Solicitud,
      Estatus: x.Estatus,
      Observaciones: x.Observaciones,
      Estatus2: x.Estatus2,

    }));

    this.excelService.exportToCsv(result, 'Comparativo_de_Proveedores_Materiales',  ['Folio'    ,'Folio_MR_Materiales'  ,'Folio_MR_Fila_Materiales'  ,'No__Solicitud'  ,'Descripcion'  ,'Cantidad'  ,'Matricula'  ,'Modelo'  ,'No_Reporte'  ,'Condicion_de_la_parte'  ,'Razon_de_la_Solicitud'  ,'Estatus'  ,'Observaciones'  ,'Estatus2' ]);
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
    template += '          <th>Folio MR Materiales</th>';
    template += '          <th>Folio MR Fila Materiales</th>';
    template += '          <th>No. Solicitud</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>Cantidad</th>';
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>No Reporte</th>';
    template += '          <th>Condición de la parte</th>';
    template += '          <th>Razón de la Solicitud</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>Observaciones</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Folio_MR_Materiales_Detalle_de_Materiales.Folio_MR_Materiales + '</td>';
      template += '          <td>' + element.Folio_MR_Fila_Materiales_Detalle_de_Materiales.Folio_MR_fila_Materiales + '</td>';
      template += '          <td>' + element.No__Solicitud + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.Cantidad + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.No_Reporte + '</td>';
      template += '          <td>' + element.Condicion_de_la_parte + '</td>';
      template += '          <td>' + element.Razon_de_la_Solicitud + '</td>';
      template += '          <td>' + element.Estatus + '</td>';
      template += '          <td>' + element.Observaciones + '</td>';
      template += '          <td>' + element.Estatus2 + '</td>';
		  
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
	template += '\t Folio MR Materiales';
	template += '\t Folio MR Fila Materiales';
	template += '\t No. Solicitud';
	template += '\t Descripción';
	template += '\t Cantidad';
	template += '\t Matrícula';
	template += '\t Modelo';
	template += '\t No Reporte';
	template += '\t Condición de la parte';
	template += '\t Razón de la Solicitud';
	template += '\t Estatus';
	template += '\t Observaciones';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Folio_MR_Materiales_Detalle_de_Materiales.Folio_MR_Materiales;
      template += '\t ' + element.Folio_MR_Fila_Materiales_Detalle_de_Materiales.Folio_MR_fila_Materiales;
	  template += '\t ' + element.No__Solicitud;
	  template += '\t ' + element.Descripcion;
	  template += '\t ' + element.Cantidad;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
	  template += '\t ' + element.No_Reporte;
	  template += '\t ' + element.Condicion_de_la_parte;
	  template += '\t ' + element.Razon_de_la_Solicitud;
	  template += '\t ' + element.Estatus;
	  template += '\t ' + element.Observaciones;
	  template += '\t ' + element.Estatus2;

	  template += '\n';
    });

    return template;
  }

}

export class Comparativo_de_Proveedores_MaterialesDataSource implements DataSource<Comparativo_de_Proveedores_Materiales>
{
  private subject = new BehaviorSubject<Comparativo_de_Proveedores_Materiales[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Comparativo_de_Proveedores_MaterialesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Comparativo_de_Proveedores_Materiales[]> {
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
              const longest = result.Comparativo_de_Proveedores_Materialess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Comparativo_de_Proveedores_Materialess);
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
      condition += " and Comparativo_de_Proveedores_Materiales.Folio = " + data.filter.Folio;
    if (data.filter.Folio_MR_Materiales != "")
      condition += " and Detalle_de_Materiales.Folio_MR_Materiales like '%" + data.filter.Folio_MR_Materiales + "%' ";
    if (data.filter.Folio_MR_Fila_Materiales != "")
      condition += " and Detalle_de_Materiales.Folio_MR_fila_Materiales like '%" + data.filter.Folio_MR_Fila_Materiales + "%' ";
    if (data.filter.No__Solicitud != "")
      condition += " and Comparativo_de_Proveedores_Materiales.No__Solicitud = " + data.filter.No__Solicitud;
    if (data.filter.Descripcion != "")
      condition += " and Comparativo_de_Proveedores_Materiales.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Cantidad != "")
      condition += " and Comparativo_de_Proveedores_Materiales.Cantidad = " + data.filter.Cantidad;
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.No_Reporte != "")
      condition += " and Comparativo_de_Proveedores_Materiales.No_Reporte = " + data.filter.No_Reporte;
    if (data.filter.Condicion_de_la_parte != "")
      condition += " and Comparativo_de_Proveedores_Materiales.Condicion_de_la_parte = " + data.filter.Condicion_de_la_parte;
    if (data.filter.Razon_de_la_Solicitud != "")
      condition += " and Comparativo_de_Proveedores_Materiales.Razon_de_la_Solicitud like '%" + data.filter.Razon_de_la_Solicitud + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Comparativo_de_Proveedores_Materiales.Estatus like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Observaciones != "")
      condition += " and Comparativo_de_Proveedores_Materiales.Observaciones like '%" + data.filter.Observaciones + "%' ";
    if (data.filter.Estatus2 != "")
      condition += " and Comparativo_de_Proveedores_Materiales.Estatus2 like '%" + data.filter.Estatus2 + "%' ";

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
        sort = " Comparativo_de_Proveedores_Materiales.Folio " + data.sortDirecction;
        break;
      case "Folio_MR_Materiales":
        sort = " Detalle_de_Materiales.Folio_MR_Materiales " + data.sortDirecction;
        break;
      case "Folio_MR_Fila_Materiales":
        sort = " Detalle_de_Materiales.Folio_MR_fila_Materiales " + data.sortDirecction;
        break;
      case "No__Solicitud":
        sort = " Comparativo_de_Proveedores_Materiales.No__Solicitud " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Comparativo_de_Proveedores_Materiales.Descripcion " + data.sortDirecction;
        break;
      case "Cantidad":
        sort = " Comparativo_de_Proveedores_Materiales.Cantidad " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "No_Reporte":
        sort = " Comparativo_de_Proveedores_Materiales.No_Reporte " + data.sortDirecction;
        break;
      case "Condicion_de_la_parte":
        sort = " Comparativo_de_Proveedores_Materiales.Condicion_de_la_parte " + data.sortDirecction;
        break;
      case "Razon_de_la_Solicitud":
        sort = " Comparativo_de_Proveedores_Materiales.Razon_de_la_Solicitud " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Comparativo_de_Proveedores_Materiales.Estatus " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Comparativo_de_Proveedores_Materiales.Observaciones " + data.sortDirecction;
        break;
      case "Estatus2":
        sort = " Comparativo_de_Proveedores_Materiales.Estatus2 " + data.sortDirecction;
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
        condition += " AND Comparativo_de_Proveedores_Materiales.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Comparativo_de_Proveedores_Materiales.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Folio_MR_Materiales != 'undefined' && data.filterAdvanced.Folio_MR_Materiales)) {
      switch (data.filterAdvanced.Folio_MR_MaterialesFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Detalle_de_Materiales.Folio_MR_Materiales LIKE '" + data.filterAdvanced.Folio_MR_Materiales + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Detalle_de_Materiales.Folio_MR_Materiales LIKE '%" + data.filterAdvanced.Folio_MR_Materiales + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Detalle_de_Materiales.Folio_MR_Materiales LIKE '%" + data.filterAdvanced.Folio_MR_Materiales + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Detalle_de_Materiales.Folio_MR_Materiales = '" + data.filterAdvanced.Folio_MR_Materiales + "'";
          break;
      }
    } else if (data.filterAdvanced.Folio_MR_MaterialesMultiple != null && data.filterAdvanced.Folio_MR_MaterialesMultiple.length > 0) {
      var Folio_MR_Materialesds = data.filterAdvanced.Folio_MR_MaterialesMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Materiales.Folio_MR_Materiales In (" + Folio_MR_Materialesds + ")";
    }
    if ((typeof data.filterAdvanced.Folio_MR_Fila_Materiales != 'undefined' && data.filterAdvanced.Folio_MR_Fila_Materiales)) {
      switch (data.filterAdvanced.Folio_MR_Fila_MaterialesFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Detalle_de_Materiales.Folio_MR_fila_Materiales LIKE '" + data.filterAdvanced.Folio_MR_Fila_Materiales + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Detalle_de_Materiales.Folio_MR_fila_Materiales LIKE '%" + data.filterAdvanced.Folio_MR_Fila_Materiales + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Detalle_de_Materiales.Folio_MR_fila_Materiales LIKE '%" + data.filterAdvanced.Folio_MR_Fila_Materiales + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Detalle_de_Materiales.Folio_MR_fila_Materiales = '" + data.filterAdvanced.Folio_MR_Fila_Materiales + "'";
          break;
      }
    } else if (data.filterAdvanced.Folio_MR_Fila_MaterialesMultiple != null && data.filterAdvanced.Folio_MR_Fila_MaterialesMultiple.length > 0) {
      var Folio_MR_Fila_Materialesds = data.filterAdvanced.Folio_MR_Fila_MaterialesMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Materiales.Folio_MR_Fila_Materiales In (" + Folio_MR_Fila_Materialesds + ")";
    }
    if ((typeof data.filterAdvanced.fromNo__Solicitud != 'undefined' && data.filterAdvanced.fromNo__Solicitud)
	|| (typeof data.filterAdvanced.toNo__Solicitud != 'undefined' && data.filterAdvanced.toNo__Solicitud)) 
	{
      if (typeof data.filterAdvanced.fromNo__Solicitud != 'undefined' && data.filterAdvanced.fromNo__Solicitud)
        condition += " AND Comparativo_de_Proveedores_Materiales.No__Solicitud >= " + data.filterAdvanced.fromNo__Solicitud;

      if (typeof data.filterAdvanced.toNo__Solicitud != 'undefined' && data.filterAdvanced.toNo__Solicitud) 
        condition += " AND Comparativo_de_Proveedores_Materiales.No__Solicitud <= " + data.filterAdvanced.toNo__Solicitud;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Materiales.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Materiales.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromCantidad != 'undefined' && data.filterAdvanced.fromCantidad)
	|| (typeof data.filterAdvanced.toCantidad != 'undefined' && data.filterAdvanced.toCantidad)) 
	{
      if (typeof data.filterAdvanced.fromCantidad != 'undefined' && data.filterAdvanced.fromCantidad)
        condition += " AND Comparativo_de_Proveedores_Materiales.Cantidad >= " + data.filterAdvanced.fromCantidad;

      if (typeof data.filterAdvanced.toCantidad != 'undefined' && data.filterAdvanced.toCantidad) 
        condition += " AND Comparativo_de_Proveedores_Materiales.Cantidad <= " + data.filterAdvanced.toCantidad;
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
      condition += " AND Comparativo_de_Proveedores_Materiales.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.Modelo != 'undefined' && data.filterAdvanced.Modelo)) {
      switch (data.filterAdvanced.ModeloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Modelos.Descripcion LIKE '" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Modelos.Descripcion = '" + data.filterAdvanced.Modelo + "'";
          break;
      }
    } else if (data.filterAdvanced.ModeloMultiple != null && data.filterAdvanced.ModeloMultiple.length > 0) {
      var Modelods = data.filterAdvanced.ModeloMultiple.join(",");
      condition += " AND Comparativo_de_Proveedores_Materiales.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.fromNo_Reporte != 'undefined' && data.filterAdvanced.fromNo_Reporte)
	|| (typeof data.filterAdvanced.toNo_Reporte != 'undefined' && data.filterAdvanced.toNo_Reporte)) 
	{
      if (typeof data.filterAdvanced.fromNo_Reporte != 'undefined' && data.filterAdvanced.fromNo_Reporte)
        condition += " AND Comparativo_de_Proveedores_Materiales.No_Reporte >= " + data.filterAdvanced.fromNo_Reporte;

      if (typeof data.filterAdvanced.toNo_Reporte != 'undefined' && data.filterAdvanced.toNo_Reporte) 
        condition += " AND Comparativo_de_Proveedores_Materiales.No_Reporte <= " + data.filterAdvanced.toNo_Reporte;
    }
    if ((typeof data.filterAdvanced.fromCondicion_de_la_parte != 'undefined' && data.filterAdvanced.fromCondicion_de_la_parte)
	|| (typeof data.filterAdvanced.toCondicion_de_la_parte != 'undefined' && data.filterAdvanced.toCondicion_de_la_parte)) 
	{
      if (typeof data.filterAdvanced.fromCondicion_de_la_parte != 'undefined' && data.filterAdvanced.fromCondicion_de_la_parte)
        condition += " AND Comparativo_de_Proveedores_Materiales.Condicion_de_la_parte >= " + data.filterAdvanced.fromCondicion_de_la_parte;

      if (typeof data.filterAdvanced.toCondicion_de_la_parte != 'undefined' && data.filterAdvanced.toCondicion_de_la_parte) 
        condition += " AND Comparativo_de_Proveedores_Materiales.Condicion_de_la_parte <= " + data.filterAdvanced.toCondicion_de_la_parte;
    }
    switch (data.filterAdvanced.Razon_de_la_SolicitudFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Razon_de_la_Solicitud LIKE '" + data.filterAdvanced.Razon_de_la_Solicitud + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Materiales.Razon_de_la_Solicitud LIKE '%" + data.filterAdvanced.Razon_de_la_Solicitud + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Razon_de_la_Solicitud LIKE '%" + data.filterAdvanced.Razon_de_la_Solicitud + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Materiales.Razon_de_la_Solicitud = '" + data.filterAdvanced.Razon_de_la_Solicitud + "'";
        break;
    }
    switch (data.filterAdvanced.EstatusFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Estatus LIKE '" + data.filterAdvanced.Estatus + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Materiales.Estatus LIKE '%" + data.filterAdvanced.Estatus + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Estatus LIKE '%" + data.filterAdvanced.Estatus + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Materiales.Estatus = '" + data.filterAdvanced.Estatus + "'";
        break;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Materiales.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Materiales.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
        break;
    }
    switch (data.filterAdvanced.Estatus2Filter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Estatus2 LIKE '" + data.filterAdvanced.Estatus2 + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comparativo_de_Proveedores_Materiales.Estatus2 LIKE '%" + data.filterAdvanced.Estatus2 + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comparativo_de_Proveedores_Materiales.Estatus2 LIKE '%" + data.filterAdvanced.Estatus2 + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comparativo_de_Proveedores_Materiales.Estatus2 = '" + data.filterAdvanced.Estatus2 + "'";
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
              const longest = result.Comparativo_de_Proveedores_Materialess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Comparativo_de_Proveedores_Materialess);
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
