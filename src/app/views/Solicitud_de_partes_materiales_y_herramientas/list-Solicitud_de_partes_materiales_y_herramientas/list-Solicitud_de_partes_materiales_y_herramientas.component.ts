import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Solicitud_de_partes_materiales_y_herramientasService } from "src/app/api-services/Solicitud_de_partes_materiales_y_herramientas.service";
import { Solicitud_de_partes_materiales_y_herramientas } from "src/app/models/Solicitud_de_partes_materiales_y_herramientas";
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
import { Solicitud_de_partes_materiales_y_herramientasIndexRules } from 'src/app/shared/businessRules/Solicitud_de_partes_materiales_y_herramientas-index-rules';
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
  selector: "app-list-Solicitud_de_partes_materiales_y_herramientas",
  templateUrl: "./list-Solicitud_de_partes_materiales_y_herramientas.component.html",
  styleUrls: ["./list-Solicitud_de_partes_materiales_y_herramientas.component.scss"],
})
export class ListSolicitud_de_partes_materiales_y_herramientasComponent extends Solicitud_de_partes_materiales_y_herramientasIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No_de_OC",
    "Proveedor",
    "Departamento",
    "Categoria",
    "No__de_Parte___Descripcion",
    "Fecha_de_Vencimiento",
    "Ubicacion_almacen",
    "Estatus",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No_de_OC",
      "Proveedor",
      "Departamento",
      "Categoria",
      "No__de_Parte___Descripcion",
      "Fecha_de_Vencimiento",
      "Ubicacion_almacen",
      "Estatus",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No_de_OC_filtro",
      "Proveedor_filtro",
      "Departamento_filtro",
      "Categoria_filtro",
      "No__de_Parte___Descripcion_filtro",
      "Fecha_de_Vencimiento_filtro",
      "Ubicacion_almacen_filtro",
      "Estatus_filtro",

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
      No_de_OC: "",
      Proveedor: "",
      Departamento: "",
      Categoria: "",
      No__de_Parte___Descripcion: "",
      Fecha_de_Vencimiento: null,
      Ubicacion_almacen: "",
      Estatus: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      No_de_OCFilter: "",
      No_de_OC: "",
      No_de_OCMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      CategoriaFilter: "",
      Categoria: "",
      CategoriaMultiple: "",
      fromFecha_de_Vencimiento: "",
      toFecha_de_Vencimiento: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",

    }
  };

  dataSource: Solicitud_de_partes_materiales_y_herramientasDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Solicitud_de_partes_materiales_y_herramientasDataSource;
  dataClipboard: any;

  constructor(
    private _Solicitud_de_partes_materiales_y_herramientasService: Solicitud_de_partes_materiales_y_herramientasService,
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
    this.dataSource = new Solicitud_de_partes_materiales_y_herramientasDataSource(
      this._Solicitud_de_partes_materiales_y_herramientasService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Solicitud_de_partes_materiales_y_herramientas)
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
    this.listConfig.filter.No_de_OC = "";
    this.listConfig.filter.Proveedor = "";
    this.listConfig.filter.Departamento = "";
    this.listConfig.filter.Categoria = "";
    this.listConfig.filter.No__de_Parte___Descripcion = "";
    this.listConfig.filter.Fecha_de_Vencimiento = undefined;
    this.listConfig.filter.Ubicacion_almacen = "";
    this.listConfig.filter.Estatus = "";

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

  remove(row: Solicitud_de_partes_materiales_y_herramientas) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Solicitud_de_partes_materiales_y_herramientasService
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
  ActionPrint(dataRow: Solicitud_de_partes_materiales_y_herramientas) {

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
,'No. de OC'
,'Proveedor'
,'Departamento'
,'Categoría'
,'No. de Parte / Descripción'
,'Fecha de Vencimiento'
,'Ubicación almacén'
,'Estatus'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.No_de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC
,x.Proveedor_Creacion_de_Proveedores.Razon_social
,x.Departamento_Departamento.Nombre
,x.Categoria_Categoria_de_Partes.Categoria
,x.No__de_Parte___Descripcion
,x.Fecha_de_Vencimiento
,x.Ubicacion_almacen
,x.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Solicitud_de_partes_materiales_y_herramientas.pdf');
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
          this._Solicitud_de_partes_materiales_y_herramientasService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_partes_materiales_y_herramientass;
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
          this._Solicitud_de_partes_materiales_y_herramientasService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Solicitud_de_partes_materiales_y_herramientass;
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
        'No. de OC ': fields.No_de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
        'Proveedor ': fields.Proveedor_Creacion_de_Proveedores.Razon_social,
        'Departamento ': fields.Departamento_Departamento.Nombre,
        'Categoría ': fields.Categoria_Categoria_de_Partes.Categoria,
        'No. de Parte / Descripción ': fields.No__de_Parte___Descripcion,
        'Fecha de Vencimiento ': fields.Fecha_de_Vencimiento ? momentJS(fields.Fecha_de_Vencimiento).format('DD/MM/YYYY') : '',
        'Ubicación almacén ': fields.Ubicacion_almacen,
        'Estatus ': fields.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Solicitud_de_partes_materiales_y_herramientas  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No_de_OC: x.No_de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
      Proveedor: x.Proveedor_Creacion_de_Proveedores.Razon_social,
      Departamento: x.Departamento_Departamento.Nombre,
      Categoria: x.Categoria_Categoria_de_Partes.Categoria,
      No__de_Parte___Descripcion: x.No__de_Parte___Descripcion,
      Fecha_de_Vencimiento: x.Fecha_de_Vencimiento,
      Ubicacion_almacen: x.Ubicacion_almacen,
      Estatus: x.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Solicitud_de_partes_materiales_y_herramientas',  ['Folio'    ,'No_de_OC'  ,'Proveedor'  ,'Departamento'  ,'Categoria'  ,'No__de_Parte___Descripcion'  ,'Fecha_de_Vencimiento'  ,'Ubicacion_almacen'  ,'Estatus' ]);
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
    template += '          <th>No. de OC</th>';
    template += '          <th>Proveedor</th>';
    template += '          <th>Departamento</th>';
    template += '          <th>Categoría</th>';
    template += '          <th>No. de Parte / Descripción</th>';
    template += '          <th>Fecha de Vencimiento</th>';
    template += '          <th>Ubicación almacén</th>';
    template += '          <th>Estatus</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No_de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC + '</td>';
      template += '          <td>' + element.Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.Departamento_Departamento.Nombre + '</td>';
      template += '          <td>' + element.Categoria_Categoria_de_Partes.Categoria + '</td>';
      template += '          <td>' + element.No__de_Parte___Descripcion + '</td>';
      template += '          <td>' + element.Fecha_de_Vencimiento + '</td>';
      template += '          <td>' + element.Ubicacion_almacen + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion + '</td>';
		  
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
	template += '\t No. de OC';
	template += '\t Proveedor';
	template += '\t Departamento';
	template += '\t Categoría';
	template += '\t No. de Parte / Descripción';
	template += '\t Fecha de Vencimiento';
	template += '\t Ubicación almacén';
	template += '\t Estatus';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.No_de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC;
      template += '\t ' + element.Proveedor_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.Departamento_Departamento.Nombre;
      template += '\t ' + element.Categoria_Categoria_de_Partes.Categoria;
	  template += '\t ' + element.No__de_Parte___Descripcion;
	  template += '\t ' + element.Fecha_de_Vencimiento;
	  template += '\t ' + element.Ubicacion_almacen;
      template += '\t ' + element.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Solicitud_de_partes_materiales_y_herramientasDataSource implements DataSource<Solicitud_de_partes_materiales_y_herramientas>
{
  private subject = new BehaviorSubject<Solicitud_de_partes_materiales_y_herramientas[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Solicitud_de_partes_materiales_y_herramientasService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Solicitud_de_partes_materiales_y_herramientas[]> {
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
              const longest = result.Solicitud_de_partes_materiales_y_herramientass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_partes_materiales_y_herramientass);
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
      condition += " and Solicitud_de_partes_materiales_y_herramientas.Folio = " + data.filter.Folio;
    if (data.filter.No_de_OC != "")
      condition += " and Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + data.filter.No_de_OC + "%' ";
    if (data.filter.Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor + "%' ";
    if (data.filter.Departamento != "")
      condition += " and Departamento.Nombre like '%" + data.filter.Departamento + "%' ";
    if (data.filter.Categoria != "")
      condition += " and Categoria_de_Partes.Categoria like '%" + data.filter.Categoria + "%' ";
    if (data.filter.No__de_Parte___Descripcion != "")
      condition += " and Solicitud_de_partes_materiales_y_herramientas.No__de_Parte___Descripcion like '%" + data.filter.No__de_Parte___Descripcion + "%' ";
    if (data.filter.Fecha_de_Vencimiento)
      condition += " and CONVERT(VARCHAR(10), Solicitud_de_partes_materiales_y_herramientas.Fecha_de_Vencimiento, 102)  = '" + moment(data.filter.Fecha_de_Vencimiento).format("YYYY.MM.DD") + "'";
    if (data.filter.Ubicacion_almacen != "")
      condition += " and Solicitud_de_partes_materiales_y_herramientas.Ubicacion_almacen like '%" + data.filter.Ubicacion_almacen + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Seguimiento_de_Materiales.Descripcion like '%" + data.filter.Estatus + "%' ";

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
        sort = " Solicitud_de_partes_materiales_y_herramientas.Folio " + data.sortDirecction;
        break;
      case "No_de_OC":
        sort = " Generacion_de_Orden_de_Compras.FolioGeneracionOC " + data.sortDirecction;
        break;
      case "Proveedor":
        sort = " Creacion_de_Proveedores.Razon_social " + data.sortDirecction;
        break;
      case "Departamento":
        sort = " Departamento.Nombre " + data.sortDirecction;
        break;
      case "Categoria":
        sort = " Categoria_de_Partes.Categoria " + data.sortDirecction;
        break;
      case "No__de_Parte___Descripcion":
        sort = " Solicitud_de_partes_materiales_y_herramientas.No__de_Parte___Descripcion " + data.sortDirecction;
        break;
      case "Fecha_de_Vencimiento":
        sort = " Solicitud_de_partes_materiales_y_herramientas.Fecha_de_Vencimiento " + data.sortDirecction;
        break;
      case "Ubicacion_almacen":
        sort = " Solicitud_de_partes_materiales_y_herramientas.Ubicacion_almacen " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Seguimiento_de_Materiales.Descripcion " + data.sortDirecction;
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
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.No_de_OC != 'undefined' && data.filterAdvanced.No_de_OC)) {
      switch (data.filterAdvanced.No_de_OCFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '" + data.filterAdvanced.No_de_OC + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '%" + data.filterAdvanced.No_de_OC + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '%" + data.filterAdvanced.No_de_OC + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC = '" + data.filterAdvanced.No_de_OC + "'";
          break;
      }
    } else if (data.filterAdvanced.No_de_OCMultiple != null && data.filterAdvanced.No_de_OCMultiple.length > 0) {
      var No_de_OCds = data.filterAdvanced.No_de_OCMultiple.join(",");
      condition += " AND Solicitud_de_partes_materiales_y_herramientas.No_de_OC In (" + No_de_OCds + ")";
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
      condition += " AND Solicitud_de_partes_materiales_y_herramientas.Proveedor In (" + Proveedords + ")";
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
      condition += " AND Solicitud_de_partes_materiales_y_herramientas.Departamento In (" + Departamentods + ")";
    }
    if ((typeof data.filterAdvanced.Categoria != 'undefined' && data.filterAdvanced.Categoria)) {
      switch (data.filterAdvanced.CategoriaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Categoria_de_Partes.Categoria LIKE '" + data.filterAdvanced.Categoria + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Categoria_de_Partes.Categoria LIKE '%" + data.filterAdvanced.Categoria + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Categoria_de_Partes.Categoria LIKE '%" + data.filterAdvanced.Categoria + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Categoria_de_Partes.Categoria = '" + data.filterAdvanced.Categoria + "'";
          break;
      }
    } else if (data.filterAdvanced.CategoriaMultiple != null && data.filterAdvanced.CategoriaMultiple.length > 0) {
      var Categoriads = data.filterAdvanced.CategoriaMultiple.join(",");
      condition += " AND Solicitud_de_partes_materiales_y_herramientas.Categoria In (" + Categoriads + ")";
    }
    switch (data.filterAdvanced.No__de_Parte___DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.No__de_Parte___Descripcion LIKE '" + data.filterAdvanced.No__de_Parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.No__de_Parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_Parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.No__de_Parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_Parte___Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.No__de_Parte___Descripcion = '" + data.filterAdvanced.No__de_Parte___Descripcion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_Vencimiento)
	|| (typeof data.filterAdvanced.toFecha_de_Vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_Vencimiento)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_Vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_partes_materiales_y_herramientas.Fecha_de_Vencimiento, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Vencimiento).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_Vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Solicitud_de_partes_materiales_y_herramientas.Fecha_de_Vencimiento, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Vencimiento).format("YYYY.MM.DD") + "'";
    }
    switch (data.filterAdvanced.Ubicacion_almacenFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.Ubicacion_almacen LIKE '" + data.filterAdvanced.Ubicacion_almacen + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.Ubicacion_almacen LIKE '%" + data.filterAdvanced.Ubicacion_almacen + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.Ubicacion_almacen LIKE '%" + data.filterAdvanced.Ubicacion_almacen + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Solicitud_de_partes_materiales_y_herramientas.Ubicacion_almacen = '" + data.filterAdvanced.Ubicacion_almacen + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Seguimiento_de_Materiales.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Seguimiento_de_Materiales.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Seguimiento_de_Materiales.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Seguimiento_de_Materiales.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Solicitud_de_partes_materiales_y_herramientas.Estatus In (" + Estatusds + ")";
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
              const longest = result.Solicitud_de_partes_materiales_y_herramientass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Solicitud_de_partes_materiales_y_herramientass);
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
