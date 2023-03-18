import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Listado_de_compras_en_procesoService } from "src/app/api-services/Listado_de_compras_en_proceso.service";
import { Listado_de_compras_en_proceso } from "src/app/models/Listado_de_compras_en_proceso";
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
import { Listado_de_compras_en_procesoIndexRules } from 'src/app/shared/businessRules/Listado_de_compras_en_proceso-index-rules';
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
  selector: "app-list-Listado_de_compras_en_proceso",
  templateUrl: "./list-Listado_de_compras_en_proceso.component.html",
  styleUrls: ["./list-Listado_de_compras_en_proceso.component.scss"],
})
export class ListListado_de_compras_en_procesoComponent extends Listado_de_compras_en_procesoIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No__de_OC",
    "Proveedor",
    "Departamento",
    "Categoria",
    "Estatus",
    "Fecha_de_Entrega_Inicial",
    "Fecha_de_Entrega_Final",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_OC",
      "Proveedor",
      "Departamento",
      "Categoria",
      "Estatus",
      "Fecha_de_Entrega_Inicial",
      "Fecha_de_Entrega_Final",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_OC_filtro",
      "Proveedor_filtro",
      "Departamento_filtro",
      "Categoria_filtro",
      "Estatus_filtro",
      "Fecha_de_Entrega_Inicial_filtro",
      "Fecha_de_Entrega_Final_filtro",

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
      No__de_OC: "",
      Proveedor: "",
      Departamento: "",
      Categoria: "",
      Estatus: "",
      Fecha_de_Entrega_Inicial: null,
      Fecha_de_Entrega_Final: null,
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      No__de_OCFilter: "",
      No__de_OC: "",
      No__de_OCMultiple: "",
      ProveedorFilter: "",
      Proveedor: "",
      ProveedorMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      CategoriaFilter: "",
      Categoria: "",
      CategoriaMultiple: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      fromFecha_de_Entrega_Inicial: "",
      toFecha_de_Entrega_Inicial: "",
      fromFecha_de_Entrega_Final: "",
      toFecha_de_Entrega_Final: "",

    }
  };

  dataSource: Listado_de_compras_en_procesoDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Listado_de_compras_en_procesoDataSource;
  dataClipboard: any;

  constructor(
    private _Listado_de_compras_en_procesoService: Listado_de_compras_en_procesoService,
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
    this.dataSource = new Listado_de_compras_en_procesoDataSource(
      this._Listado_de_compras_en_procesoService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Listado_de_compras_en_proceso)
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
    this.listConfig.filter.No__de_OC = "";
    this.listConfig.filter.Proveedor = "";
    this.listConfig.filter.Departamento = "";
    this.listConfig.filter.Categoria = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Fecha_de_Entrega_Inicial = undefined;
    this.listConfig.filter.Fecha_de_Entrega_Final = undefined;

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

  remove(row: Listado_de_compras_en_proceso) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Listado_de_compras_en_procesoService
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
  ActionPrint(dataRow: Listado_de_compras_en_proceso) {

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
,'Estatus'
,'Fecha de Entrega Inicial'
,'Fecha de Entrega Final'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC
,x.Proveedor_Creacion_de_Proveedores.Razon_social
,x.Departamento_Departamento.Nombre
,x.Categoria_Categoria_de_Partes.Categoria
,x.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion
,x.Fecha_de_Entrega_Inicial
,x.Fecha_de_Entrega_Final
		  
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
    pdfMake.createPdf(pdfDefinition).download('Listado_de_compras_en_proceso.pdf');
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
          this._Listado_de_compras_en_procesoService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Listado_de_compras_en_procesos;
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
          this._Listado_de_compras_en_procesoService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Listado_de_compras_en_procesos;
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
        'No. de OC ': fields.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
        'Proveedor ': fields.Proveedor_Creacion_de_Proveedores.Razon_social,
        'Departamento ': fields.Departamento_Departamento.Nombre,
        'Categoría ': fields.Categoria_Categoria_de_Partes.Categoria,
        'Estatus ': fields.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion,
        'Fecha de Entrega Inicial ': fields.Fecha_de_Entrega_Inicial ? momentJS(fields.Fecha_de_Entrega_Inicial).format('DD/MM/YYYY') : '',
        'Fecha de Entrega Final ': fields.Fecha_de_Entrega_Final ? momentJS(fields.Fecha_de_Entrega_Final).format('DD/MM/YYYY') : '',

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Listado_de_compras_en_proceso  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No__de_OC: x.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC,
      Proveedor: x.Proveedor_Creacion_de_Proveedores.Razon_social,
      Departamento: x.Departamento_Departamento.Nombre,
      Categoria: x.Categoria_Categoria_de_Partes.Categoria,
      Estatus: x.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion,
      Fecha_de_Entrega_Inicial: x.Fecha_de_Entrega_Inicial,
      Fecha_de_Entrega_Final: x.Fecha_de_Entrega_Final,

    }));

    this.excelService.exportToCsv(result, 'Listado_de_compras_en_proceso',  ['Folio'    ,'No__de_OC'  ,'Proveedor'  ,'Departamento'  ,'Categoria'  ,'Estatus'  ,'Fecha_de_Entrega_Inicial'  ,'Fecha_de_Entrega_Final' ]);
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
    template += '          <th>Estatus</th>';
    template += '          <th>Fecha de Entrega Inicial</th>';
    template += '          <th>Fecha de Entrega Final</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC + '</td>';
      template += '          <td>' + element.Proveedor_Creacion_de_Proveedores.Razon_social + '</td>';
      template += '          <td>' + element.Departamento_Departamento.Nombre + '</td>';
      template += '          <td>' + element.Categoria_Categoria_de_Partes.Categoria + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_de_Entrega_Inicial + '</td>';
      template += '          <td>' + element.Fecha_de_Entrega_Final + '</td>';
		  
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
	template += '\t Estatus';
	template += '\t Fecha de Entrega Inicial';
	template += '\t Fecha de Entrega Final';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.No__de_OC_Generacion_de_Orden_de_Compras.FolioGeneracionOC;
      template += '\t ' + element.Proveedor_Creacion_de_Proveedores.Razon_social;
      template += '\t ' + element.Departamento_Departamento.Nombre;
      template += '\t ' + element.Categoria_Categoria_de_Partes.Categoria;
      template += '\t ' + element.Estatus_Estatus_de_Seguimiento_de_Materiales.Descripcion;
	  template += '\t ' + element.Fecha_de_Entrega_Inicial;
	  template += '\t ' + element.Fecha_de_Entrega_Final;

	  template += '\n';
    });

    return template;
  }

}

export class Listado_de_compras_en_procesoDataSource implements DataSource<Listado_de_compras_en_proceso>
{
  private subject = new BehaviorSubject<Listado_de_compras_en_proceso[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Listado_de_compras_en_procesoService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Listado_de_compras_en_proceso[]> {
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
              const longest = result.Listado_de_compras_en_procesos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Listado_de_compras_en_procesos);
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
      condition += " and Listado_de_compras_en_proceso.Folio = " + data.filter.Folio;
    if (data.filter.No__de_OC != "")
      condition += " and Generacion_de_Orden_de_Compras.FolioGeneracionOC like '%" + data.filter.No__de_OC + "%' ";
    if (data.filter.Proveedor != "")
      condition += " and Creacion_de_Proveedores.Razon_social like '%" + data.filter.Proveedor + "%' ";
    if (data.filter.Departamento != "")
      condition += " and Departamento.Nombre like '%" + data.filter.Departamento + "%' ";
    if (data.filter.Categoria != "")
      condition += " and Categoria_de_Partes.Categoria like '%" + data.filter.Categoria + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Seguimiento_de_Materiales.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Fecha_de_Entrega_Inicial)
      condition += " and CONVERT(VARCHAR(10), Listado_de_compras_en_proceso.Fecha_de_Entrega_Inicial, 102)  = '" + moment(data.filter.Fecha_de_Entrega_Inicial).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_de_Entrega_Final)
      condition += " and CONVERT(VARCHAR(10), Listado_de_compras_en_proceso.Fecha_de_Entrega_Final, 102)  = '" + moment(data.filter.Fecha_de_Entrega_Final).format("YYYY.MM.DD") + "'";

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
        sort = " Listado_de_compras_en_proceso.Folio " + data.sortDirecction;
        break;
      case "No__de_OC":
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
      case "Estatus":
        sort = " Estatus_de_Seguimiento_de_Materiales.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_de_Entrega_Inicial":
        sort = " Listado_de_compras_en_proceso.Fecha_de_Entrega_Inicial " + data.sortDirecction;
        break;
      case "Fecha_de_Entrega_Final":
        sort = " Listado_de_compras_en_proceso.Fecha_de_Entrega_Final " + data.sortDirecction;
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
        condition += " AND Listado_de_compras_en_proceso.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Listado_de_compras_en_proceso.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.No__de_OC != 'undefined' && data.filterAdvanced.No__de_OC)) {
      switch (data.filterAdvanced.No__de_OCFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '" + data.filterAdvanced.No__de_OC + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '%" + data.filterAdvanced.No__de_OC + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC LIKE '%" + data.filterAdvanced.No__de_OC + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Generacion_de_Orden_de_Compras.FolioGeneracionOC = '" + data.filterAdvanced.No__de_OC + "'";
          break;
      }
    } else if (data.filterAdvanced.No__de_OCMultiple != null && data.filterAdvanced.No__de_OCMultiple.length > 0) {
      var No__de_OCds = data.filterAdvanced.No__de_OCMultiple.join(",");
      condition += " AND Listado_de_compras_en_proceso.No__de_OC In (" + No__de_OCds + ")";
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
      condition += " AND Listado_de_compras_en_proceso.Proveedor In (" + Proveedords + ")";
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
      condition += " AND Listado_de_compras_en_proceso.Departamento In (" + Departamentods + ")";
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
      condition += " AND Listado_de_compras_en_proceso.Categoria In (" + Categoriads + ")";
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
      condition += " AND Listado_de_compras_en_proceso.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Entrega_Inicial != 'undefined' && data.filterAdvanced.fromFecha_de_Entrega_Inicial)
	|| (typeof data.filterAdvanced.toFecha_de_Entrega_Inicial != 'undefined' && data.filterAdvanced.toFecha_de_Entrega_Inicial)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Entrega_Inicial != 'undefined' && data.filterAdvanced.fromFecha_de_Entrega_Inicial) 
        condition += " and CONVERT(VARCHAR(10), Listado_de_compras_en_proceso.Fecha_de_Entrega_Inicial, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Entrega_Inicial).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Entrega_Inicial != 'undefined' && data.filterAdvanced.toFecha_de_Entrega_Inicial) 
        condition += " and CONVERT(VARCHAR(10), Listado_de_compras_en_proceso.Fecha_de_Entrega_Inicial, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Entrega_Inicial).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Entrega_Final != 'undefined' && data.filterAdvanced.fromFecha_de_Entrega_Final)
	|| (typeof data.filterAdvanced.toFecha_de_Entrega_Final != 'undefined' && data.filterAdvanced.toFecha_de_Entrega_Final)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Entrega_Final != 'undefined' && data.filterAdvanced.fromFecha_de_Entrega_Final) 
        condition += " and CONVERT(VARCHAR(10), Listado_de_compras_en_proceso.Fecha_de_Entrega_Final, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Entrega_Final).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Entrega_Final != 'undefined' && data.filterAdvanced.toFecha_de_Entrega_Final) 
        condition += " and CONVERT(VARCHAR(10), Listado_de_compras_en_proceso.Fecha_de_Entrega_Final, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Entrega_Final).format("YYYY.MM.DD") + "'";
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
              const longest = result.Listado_de_compras_en_procesos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Listado_de_compras_en_procesos);
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
