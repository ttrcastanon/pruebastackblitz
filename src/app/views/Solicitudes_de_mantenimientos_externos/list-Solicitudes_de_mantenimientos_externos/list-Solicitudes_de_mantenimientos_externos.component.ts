import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Solicitudes_de_mantenimientos_externosService } from "src/app/api-services/Solicitudes_de_mantenimientos_externos.service";
import { Solicitudes_de_mantenimientos_externos } from "src/app/models/Solicitudes_de_mantenimientos_externos";
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
import { Solicitudes_de_mantenimientos_externosIndexRules } from 'src/app/shared/businessRules/Solicitudes_de_mantenimientos_externos-index-rules';
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
  selector: "app-list-Solicitudes_de_mantenimientos_externos",
  templateUrl: "./list-Solicitudes_de_mantenimientos_externos.component.html",
  styleUrls: ["./list-Solicitudes_de_mantenimientos_externos.component.scss"],
})
export class ListSolicitudes_de_mantenimientos_externosComponent extends Solicitudes_de_mantenimientos_externosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Matricula",
    "Modelo",
    "N_Reporte",
    "Propietario",
    "Proveedor",
    "N_Servicio",
    "Descripcion",
    "Costo_pieza",
    "Costo_total",
    "Nuevo_costo",
    "Nuevo_monto_negociado",
    "Observaciones",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "N_Reporte",
      "Propietario",
      "Proveedor",
      "N_Servicio",
      "Descripcion",
      "Costo_pieza",
      "Costo_total",
      "Nuevo_costo",
      "Nuevo_monto_negociado",
      "Observaciones",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "N_Reporte_filtro",
      "Propietario_filtro",
      "Proveedor_filtro",
      "N_Servicio_filtro",
      "Descripcion_filtro",
      "Costo_pieza_filtro",
      "Costo_total_filtro",
      "Nuevo_costo_filtro",
      "Nuevo_monto_negociado_filtro",
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
      Matricula: "",
      Modelo: "",
      N_Reporte: "",
      Propietario: "",
      Proveedor: "",
      N_Servicio: "",
      Descripcion: "",
      Costo_pieza: "",
      Costo_total: "",
      Nuevo_costo: "",
      Nuevo_monto_negociado: "",
      Observaciones: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      N_ReporteFilter: "",
      N_Reporte: "",
      N_ReporteMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      fromCosto_pieza: "",
      toCosto_pieza: "",
      fromCosto_total: "",
      toCosto_total: "",
      fromNuevo_costo: "",
      toNuevo_costo: "",
      fromNuevo_monto_negociado: "",
      toNuevo_monto_negociado: "",

    }
  };

  dataSource: Solicitudes_de_mantenimientos_externosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Solicitudes_de_mantenimientos_externosDataSource;
  dataClipboard: any;

  constructor(
    private _Solicitudes_de_mantenimientos_externosService: Solicitudes_de_mantenimientos_externosService,
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
    this.dataSource = new Solicitudes_de_mantenimientos_externosDataSource(
      this._Solicitudes_de_mantenimientos_externosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Solicitudes_de_mantenimientos_externos)
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
    this.listConfig.filter.Matricula = "";
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.N_Reporte = "";
    this.listConfig.filter.Propietario = "";
    this.listConfig.filter.Proveedor = "";
    this.listConfig.filter.N_Servicio = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.Costo_pieza = "";
    this.listConfig.filter.Costo_total = "";
    this.listConfig.filter.Nuevo_costo = "";
    this.listConfig.filter.Nuevo_monto_negociado = "";
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

  remove(row: Solicitudes_de_mantenimientos_externos) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Solicitudes_de_mantenimientos_externosService
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
  ActionPrint(dataRow: Solicitudes_de_mantenimientos_externos) {

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
,'Matrícula'
,'Modelo'
,'N° Reporte'
,'Propietario'
,'Proveedor'
,'N° Servicio'
,'Descripción'
,'Costo pieza $'
,'Costo total $'
,'Nuevo costo $'
,'Nuevo monto negociado $'
,'Observaciones'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Matricula_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.N_Reporte_Crear_Reporte.No_Reporte
,x.Propietario_Propietarios.Nombre
,x.Proveedor_Creacion_de_Proveedores.Razon_social
,x.N_Servicio
,x.Descripcion
,x.Costo_pieza
,x.Costo_total
,x.Nuevo_costo
,x.Nuevo_monto_negociado
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
    pdfMake.createPdf(pdfDefinition).download('Solicitudes_de_mantenimientos_externos.pdf');
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
          this._Solicitudes_de_mantenimientos_externosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitudes_de_mantenimientos_externoss;
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
          this._Solicitudes_de_mantenimientos_externosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitudes_de_mantenimientos_externoss;
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
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'N° Reporte ': fields.N_Reporte_Crear_Reporte.No_Reporte,
        'Propietario ': fields.Propietario_Propietarios.Nombre,
        'Proveedor ': fields.Proveedor_Creacion_de_Proveedores.Razon_social,
        'N° Servicio ': fields.N_Servicio,
        'Descripción ': fields.Descripcion,
        'Costo pieza $ ': fields.Costo_pieza,
        'Costo total $ ': fields.Costo_total,
        'Nuevo costo $ ': fields.Nuevo_costo,
        'Nuevo monto negociado $ ': fields.Nuevo_monto_negociado,
        'Observaciones ': fields.Observaciones,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Solicitudes_de_mantenimientos_externos  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      N_Reporte: x.N_Reporte_Crear_Reporte.No_Reporte,
      Propietario: x.Propietario_Propietarios.Nombre,
      Proveedor: x.Proveedor_Creacion_de_Proveedores.Razon_social,
      N_Servicio: x.N_Servicio,
      Descripcion: x.Descripcion,
      Costo_pieza: x.Costo_pieza,
      Costo_total: x.Costo_total,
      Nuevo_costo: x.Nuevo_costo,
      Nuevo_monto_negociado: x.Nuevo_monto_negociado,
      Observaciones: x.Observaciones,

    }));

    this.excelService.exportToCsv(result, 'Solicitudes_de_mantenimientos_externos',  ['Folio'    ,'Matricula'  ,'Modelo'  ,'N_Reporte'  ,'Propietario'  ,'Proveedor'  ,'N_Servicio'  ,'Descripcion'  ,'Costo_pieza'  ,'Costo_total'  ,'Nuevo_costo'  ,'Nuevo_monto_negociado'  ,'Observaciones' ]);
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
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>N° Reporte</th>';
    template += '          <th>Propietario</th>';
    template += '          <th>Proveedor</th>';
    template += '          <th>N° Servicio</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>Costo pieza $</th>';
    template += '          <th>Costo total $</th>';
    template += '          <th>Nuevo costo $</th>';
    template += '          <th>Nuevo monto negociado $</th>';
    template += '          <th>Observaciones</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.N_Reporte_Crear_Reporte.No_Reporte + '</td>';
      template += '          <td>' + element.Propietario_Propietarios.Nombre + '</td>';
      template += '          <td>' + element.Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.N_Servicio + '</td>';
      template += '          <td>' + element.Descripcion + '</td>';
      template += '          <td>' + element.Costo_pieza + '</td>';
      template += '          <td>' + element.Costo_total + '</td>';
      template += '          <td>' + element.Nuevo_costo + '</td>';
      template += '          <td>' + element.Nuevo_monto_negociado + '</td>';
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
	template += '\t Matrícula';
	template += '\t Modelo';
	template += '\t N° Reporte';
	template += '\t Propietario';
	template += '\t Proveedor';
	template += '\t N° Servicio';
	template += '\t Descripción';
	template += '\t Costo pieza $';
	template += '\t Costo total $';
	template += '\t Nuevo costo $';
	template += '\t Nuevo monto negociado $';
	template += '\t Observaciones';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.N_Reporte_Crear_Reporte.No_Reporte;
      template += '\t ' + element.Propietario_Propietarios.Nombre;
      template += '\t ' + element.Proveedor_Creacion_de_Proveedores.Razon_social;
	  template += '\t ' + element.N_Servicio;
	  template += '\t ' + element.Descripcion;
	  template += '\t ' + element.Costo_pieza;
	  template += '\t ' + element.Costo_total;
	  template += '\t ' + element.Nuevo_costo;
	  template += '\t ' + element.Nuevo_monto_negociado;
	  template += '\t ' + element.Observaciones;

	  template += '\n';
    });

    return template;
  }

}

export class Solicitudes_de_mantenimientos_externosDataSource implements DataSource<Solicitudes_de_mantenimientos_externos>
{
  private subject = new BehaviorSubject<Solicitudes_de_mantenimientos_externos[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Solicitudes_de_mantenimientos_externosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Solicitudes_de_mantenimientos_externos[]> {
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
              const longest = result.Solicitudes_de_mantenimientos_externoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitudes_de_mantenimientos_externoss);
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
      condition += " and Solicitudes_de_mantenimientos_externos.Folio = " + data.filter.Folio;
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.N_Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.N_Reporte + "%' ";
    if (data.filter.Propietario != "")
      condition += " and Propietarios.Nombre like '%" + data.filter.Propietario + "%' ";
    if (data.filter.Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor + "%' ";
    if (data.filter.N_Servicio != "")
      condition += " and Solicitudes_de_mantenimientos_externos.N_Servicio like '%" + data.filter.N_Servicio + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Solicitudes_de_mantenimientos_externos.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Costo_pieza != "")
      condition += " and Solicitudes_de_mantenimientos_externos.Costo_pieza = " + data.filter.Costo_pieza;
    if (data.filter.Costo_total != "")
      condition += " and Solicitudes_de_mantenimientos_externos.Costo_total = " + data.filter.Costo_total;
    if (data.filter.Nuevo_costo != "")
      condition += " and Solicitudes_de_mantenimientos_externos.Nuevo_costo = " + data.filter.Nuevo_costo;
    if (data.filter.Nuevo_monto_negociado != "")
      condition += " and Solicitudes_de_mantenimientos_externos.Nuevo_monto_negociado = " + data.filter.Nuevo_monto_negociado;
    if (data.filter.Observaciones != "")
      condition += " and Solicitudes_de_mantenimientos_externos.Observaciones like '%" + data.filter.Observaciones + "%' ";

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
        sort = " Solicitudes_de_mantenimientos_externos.Folio " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "N_Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "Propietario":
        sort = " Propietarios.Nombre " + data.sortDirecction;
        break;
      case "Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "N_Servicio":
        sort = " Solicitudes_de_mantenimientos_externos.N_Servicio " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Solicitudes_de_mantenimientos_externos.Descripcion " + data.sortDirecction;
        break;
      case "Costo_pieza":
        sort = " Solicitudes_de_mantenimientos_externos.Costo_pieza " + data.sortDirecction;
        break;
      case "Costo_total":
        sort = " Solicitudes_de_mantenimientos_externos.Costo_total " + data.sortDirecction;
        break;
      case "Nuevo_costo":
        sort = " Solicitudes_de_mantenimientos_externos.Nuevo_costo " + data.sortDirecction;
        break;
      case "Nuevo_monto_negociado":
        sort = " Solicitudes_de_mantenimientos_externos.Nuevo_monto_negociado " + data.sortDirecction;
        break;
      case "Observaciones":
        sort = " Solicitudes_de_mantenimientos_externos.Observaciones " + data.sortDirecction;
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
        condition += " AND Solicitudes_de_mantenimientos_externos.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Solicitudes_de_mantenimientos_externos.Folio <= " + data.filterAdvanced.toFolio;
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
      condition += " AND Solicitudes_de_mantenimientos_externos.Matricula In (" + Matriculads + ")";
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
      condition += " AND Solicitudes_de_mantenimientos_externos.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.N_Reporte != 'undefined' && data.filterAdvanced.N_Reporte)) {
      switch (data.filterAdvanced.N_ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.N_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.N_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.N_Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.N_Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.N_ReporteMultiple != null && data.filterAdvanced.N_ReporteMultiple.length > 0) {
      var N_Reporteds = data.filterAdvanced.N_ReporteMultiple.join(",");
      condition += " AND Solicitudes_de_mantenimientos_externos.N_Reporte In (" + N_Reporteds + ")";
    }
    if ((typeof data.filterAdvanced.Propietario != 'undefined' && data.filterAdvanced.Propietario)) {
      switch (data.filterAdvanced.PropietarioFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Propietarios.Nombre LIKE '" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Propietarios.Nombre = '" + data.filterAdvanced.Propietario + "'";
          break;
      }
    } else if (data.filterAdvanced.PropietarioMultiple != null && data.filterAdvanced.PropietarioMultiple.length > 0) {
      var Propietariods = data.filterAdvanced.PropietarioMultiple.join(",");
      condition += " AND Solicitudes_de_mantenimientos_externos.Propietario In (" + Propietariods + ")";
    }
    if ((typeof data.filterAdvanced.Proveedor != 'undefined' && data.filterAdvanced.Proveedor)) {
      switch (data.filterAdvanced.ProveedorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '" + data.filterAdvanced.Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Proveedores.Razon_social LIKE '%" + data.filterAdvanced.Proveedor + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Proveedores.Razon_social = '" + data.filterAdvanced.Proveedor + "'";
          break;
      }
    } else if (data.filterAdvanced.ProveedorMultiple != null && data.filterAdvanced.ProveedorMultiple.length > 0) {
      var Proveedords = data.filterAdvanced.ProveedorMultiple.join(",");
      condition += " AND Solicitudes_de_mantenimientos_externos.Proveedor In (" + Proveedords + ")";
    }
    switch (data.filterAdvanced.N_ServicioFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitudes_de_mantenimientos_externos.N_Servicio LIKE '" + data.filterAdvanced.N_Servicio + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitudes_de_mantenimientos_externos.N_Servicio LIKE '%" + data.filterAdvanced.N_Servicio + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitudes_de_mantenimientos_externos.N_Servicio LIKE '%" + data.filterAdvanced.N_Servicio + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitudes_de_mantenimientos_externos.N_Servicio = '" + data.filterAdvanced.N_Servicio + "'";
        break;
    }
    switch (data.filterAdvanced.DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitudes_de_mantenimientos_externos.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitudes_de_mantenimientos_externos.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitudes_de_mantenimientos_externos.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitudes_de_mantenimientos_externos.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromCosto_pieza != 'undefined' && data.filterAdvanced.fromCosto_pieza)
	|| (typeof data.filterAdvanced.toCosto_pieza != 'undefined' && data.filterAdvanced.toCosto_pieza)) 
	{
      if (typeof data.filterAdvanced.fromCosto_pieza != 'undefined' && data.filterAdvanced.fromCosto_pieza)
        condition += " AND Solicitudes_de_mantenimientos_externos.Costo_pieza >= " + data.filterAdvanced.fromCosto_pieza;

      if (typeof data.filterAdvanced.toCosto_pieza != 'undefined' && data.filterAdvanced.toCosto_pieza) 
        condition += " AND Solicitudes_de_mantenimientos_externos.Costo_pieza <= " + data.filterAdvanced.toCosto_pieza;
    }
    if ((typeof data.filterAdvanced.fromCosto_total != 'undefined' && data.filterAdvanced.fromCosto_total)
	|| (typeof data.filterAdvanced.toCosto_total != 'undefined' && data.filterAdvanced.toCosto_total)) 
	{
      if (typeof data.filterAdvanced.fromCosto_total != 'undefined' && data.filterAdvanced.fromCosto_total)
        condition += " AND Solicitudes_de_mantenimientos_externos.Costo_total >= " + data.filterAdvanced.fromCosto_total;

      if (typeof data.filterAdvanced.toCosto_total != 'undefined' && data.filterAdvanced.toCosto_total) 
        condition += " AND Solicitudes_de_mantenimientos_externos.Costo_total <= " + data.filterAdvanced.toCosto_total;
    }
    if ((typeof data.filterAdvanced.fromNuevo_costo != 'undefined' && data.filterAdvanced.fromNuevo_costo)
	|| (typeof data.filterAdvanced.toNuevo_costo != 'undefined' && data.filterAdvanced.toNuevo_costo)) 
	{
      if (typeof data.filterAdvanced.fromNuevo_costo != 'undefined' && data.filterAdvanced.fromNuevo_costo)
        condition += " AND Solicitudes_de_mantenimientos_externos.Nuevo_costo >= " + data.filterAdvanced.fromNuevo_costo;

      if (typeof data.filterAdvanced.toNuevo_costo != 'undefined' && data.filterAdvanced.toNuevo_costo) 
        condition += " AND Solicitudes_de_mantenimientos_externos.Nuevo_costo <= " + data.filterAdvanced.toNuevo_costo;
    }
    if ((typeof data.filterAdvanced.fromNuevo_monto_negociado != 'undefined' && data.filterAdvanced.fromNuevo_monto_negociado)
	|| (typeof data.filterAdvanced.toNuevo_monto_negociado != 'undefined' && data.filterAdvanced.toNuevo_monto_negociado)) 
	{
      if (typeof data.filterAdvanced.fromNuevo_monto_negociado != 'undefined' && data.filterAdvanced.fromNuevo_monto_negociado)
        condition += " AND Solicitudes_de_mantenimientos_externos.Nuevo_monto_negociado >= " + data.filterAdvanced.fromNuevo_monto_negociado;

      if (typeof data.filterAdvanced.toNuevo_monto_negociado != 'undefined' && data.filterAdvanced.toNuevo_monto_negociado) 
        condition += " AND Solicitudes_de_mantenimientos_externos.Nuevo_monto_negociado <= " + data.filterAdvanced.toNuevo_monto_negociado;
    }
    switch (data.filterAdvanced.ObservacionesFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitudes_de_mantenimientos_externos.Observaciones LIKE '" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitudes_de_mantenimientos_externos.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitudes_de_mantenimientos_externos.Observaciones LIKE '%" + data.filterAdvanced.Observaciones + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitudes_de_mantenimientos_externos.Observaciones = '" + data.filterAdvanced.Observaciones + "'";
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
              const longest = result.Solicitudes_de_mantenimientos_externoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitudes_de_mantenimientos_externoss);
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
