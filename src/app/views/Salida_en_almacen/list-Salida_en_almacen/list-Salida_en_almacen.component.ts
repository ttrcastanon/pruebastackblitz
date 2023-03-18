import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Salida_en_almacenService } from "src/app/api-services/Salida_en_almacen.service";
import { Salida_en_almacen } from "src/app/models/Salida_en_almacen";
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
import { Salida_en_almacenIndexRules } from 'src/app/shared/businessRules/Salida_en_almacen-index-rules';
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
  selector: "app-list-Salida_en_almacen",
  templateUrl: "./list-Salida_en_almacen.component.html",
  styleUrls: ["./list-Salida_en_almacen.component.scss"],
})
export class ListSalida_en_almacenComponent extends Salida_en_almacenIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No__de_Parte___Descripcion",
    "Solicitante",
    "Cant__Solicitada",
    "Und_",
    "Entregado_a",
    "Cant__a_entregar",
    "Und2",
    "IdSalidaAlmacen",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__de_Parte___Descripcion",
      "Solicitante",
      "Cant__Solicitada",
      "Und_",
      "Entregado_a",
      "Cant__a_entregar",
      "Und2",
      "IdSalidaAlmacen",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__de_Parte___Descripcion_filtro",
      "Solicitante_filtro",
      "Cant__Solicitada_filtro",
      "Und__filtro",
      "Entregado_a_filtro",
      "Cant__a_entregar_filtro",
      "Und2_filtro",
      "IdSalidaAlmacen_filtro",

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
      No__de_Parte___Descripcion: "",
      Solicitante: "",
      Cant__Solicitada: "",
      Und_: "",
      Entregado_a: "",
      Cant__a_entregar: "",
      Und2: "",
      IdSalidaAlmacen: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      fromCant__Solicitada: "",
      toCant__Solicitada: "",
      Und_Filter: "",
      Und_: "",
      Und_Multiple: "",
      Entregado_aFilter: "",
      Entregado_a: "",
      Entregado_aMultiple: "",
      fromCant__a_entregar: "",
      toCant__a_entregar: "",
      Und2Filter: "",
      Und2: "",
      Und2Multiple: "",

    }
  };

  dataSource: Salida_en_almacenDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Salida_en_almacenDataSource;
  dataClipboard: any;

  constructor(
    private _Salida_en_almacenService: Salida_en_almacenService,
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
    this.dataSource = new Salida_en_almacenDataSource(
      this._Salida_en_almacenService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Salida_en_almacen)
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
    this.listConfig.filter.No__de_Parte___Descripcion = "";
    this.listConfig.filter.Solicitante = "";
    this.listConfig.filter.Cant__Solicitada = "";
    this.listConfig.filter.Und_ = "";
    this.listConfig.filter.Entregado_a = "";
    this.listConfig.filter.Cant__a_entregar = "";
    this.listConfig.filter.Und2 = "";
    this.listConfig.filter.IdSalidaAlmacen = "";

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

  remove(row: Salida_en_almacen) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Salida_en_almacenService
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
  ActionPrint(dataRow: Salida_en_almacen) {

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
,'No. de Parte / Descripción'
,'Solicitante'
,'Cant. Solicitada'
,'Und.'
,'Entregado a:'
,'Cant. a entregar'
,'IdSalidaAlmacen'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.No__de_Parte___Descripcion
,x.Solicitante_Spartan_User.Name
,x.Cant__Solicitada
,x.Und__Unidad.Descripcion
,x.Entregado_a_Spartan_User.Name
,x.Cant__a_entregar
,x.Und2_Unidad.Descripcion
,x.IdSalidaAlmacen
		  
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
    pdfMake.createPdf(pdfDefinition).download('Salida_en_almacen.pdf');
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
          this._Salida_en_almacenService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Salida_en_almacens;
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
          this._Salida_en_almacenService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Salida_en_almacens;
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
        'No. de Parte / Descripción ': fields.No__de_Parte___Descripcion,
        'Solicitante ': fields.Solicitante_Spartan_User.Name,
        'Cant. Solicitada ': fields.Cant__Solicitada,
        'Und. ': fields.Und__Unidad.Descripcion,
        'Entregado a: 1': fields.Entregado_a_Spartan_User.Name,
        'Cant. a entregar ': fields.Cant__a_entregar,
        'Und. 1': fields.Und2_Unidad.Descripcion,
        'IdSalidaAlmacen ': fields.IdSalidaAlmacen,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Salida_en_almacen  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No__de_Parte___Descripcion: x.No__de_Parte___Descripcion,
      Solicitante: x.Solicitante_Spartan_User.Name,
      Cant__Solicitada: x.Cant__Solicitada,
      Und_: x.Und__Unidad.Descripcion,
      Entregado_a: x.Entregado_a_Spartan_User.Name,
      Cant__a_entregar: x.Cant__a_entregar,
      Und2: x.Und2_Unidad.Descripcion,
      IdSalidaAlmacen: x.IdSalidaAlmacen,

    }));

    this.excelService.exportToCsv(result, 'Salida_en_almacen',  ['Folio'    ,'No__de_Parte___Descripcion'  ,'Solicitante'  ,'Cant__Solicitada'  ,'Und_'  ,'Entregado_a'  ,'Cant__a_entregar'  ,'Und2'  ,'IdSalidaAlmacen' ]);
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
    template += '          <th>No. de Parte / Descripción</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Cant. Solicitada</th>';
    template += '          <th>Und.</th>';
    template += '          <th>Entregado a:</th>';
    template += '          <th>Cant. a entregar</th>';
    template += '          <th>IdSalidaAlmacen</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No__de_Parte___Descripcion + '</td>';
      template += '          <td>' + element.Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Cant__Solicitada + '</td>';
      template += '          <td>' + element.Und__Unidad.Descripcion + '</td>';
      template += '          <td>' + element.Entregado_a_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Cant__a_entregar + '</td>';
      template += '          <td>' + element.Und2_Unidad.Descripcion + '</td>';
      template += '          <td>' + element.IdSalidaAlmacen + '</td>';
		  
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
	template += '\t No. de Parte / Descripción';
	template += '\t Solicitante';
	template += '\t Cant. Solicitada';
	template += '\t Und.';
	template += '\t Entregado a:';
	template += '\t Cant. a entregar';
	template += '\t IdSalidaAlmacen';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.No__de_Parte___Descripcion;
      template += '\t ' + element.Solicitante_Spartan_User.Name;
	  template += '\t ' + element.Cant__Solicitada;
      template += '\t ' + element.Und__Unidad.Descripcion;
      template += '\t ' + element.Entregado_a_Spartan_User.Name;
	  template += '\t ' + element.Cant__a_entregar;
      template += '\t ' + element.Und2_Unidad.Descripcion;
	  template += '\t ' + element.IdSalidaAlmacen;

	  template += '\n';
    });

    return template;
  }

}

export class Salida_en_almacenDataSource implements DataSource<Salida_en_almacen>
{
  private subject = new BehaviorSubject<Salida_en_almacen[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Salida_en_almacenService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Salida_en_almacen[]> {
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
              const longest = result.Salida_en_almacens.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Salida_en_almacens);
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
      condition += " and Salida_en_almacen.Folio = " + data.filter.Folio;
    if (data.filter.No__de_Parte___Descripcion != "")
      condition += " and Salida_en_almacen.No__de_Parte___Descripcion like '%" + data.filter.No__de_Parte___Descripcion + "%' ";
    if (data.filter.Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante + "%' ";
    if (data.filter.Cant__Solicitada != "")
      condition += " and Salida_en_almacen.Cant__Solicitada = " + data.filter.Cant__Solicitada;
    if (data.filter.Und_ != "")
      condition += " and Unidad.Descripcion like '%" + data.filter.Und_ + "%' ";
    if (data.filter.Entregado_a != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Entregado_a + "%' ";
    if (data.filter.Cant__a_entregar != "")
      condition += " and Salida_en_almacen.Cant__a_entregar = " + data.filter.Cant__a_entregar;
    if (data.filter.Und2 != "")
      condition += " and Unidad.Descripcion like '%" + data.filter.Und2 + "%' ";
    if (data.filter.IdSalidaAlmacen != "")
      condition += " and Salida_en_almacen.IdSalidaAlmacen like '%" + data.filter.IdSalidaAlmacen + "%' ";

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
        sort = " Salida_en_almacen.Folio " + data.sortDirecction;
        break;
      case "No__de_Parte___Descripcion":
        sort = " Salida_en_almacen.No__de_Parte___Descripcion " + data.sortDirecction;
        break;
      case "Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Cant__Solicitada":
        sort = " Salida_en_almacen.Cant__Solicitada " + data.sortDirecction;
        break;
      case "Und_":
        sort = " Unidad.Descripcion " + data.sortDirecction;
        break;
      case "Entregado_a":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Cant__a_entregar":
        sort = " Salida_en_almacen.Cant__a_entregar " + data.sortDirecction;
        break;
      case "Und2":
        sort = " Unidad.Descripcion " + data.sortDirecction;
        break;
      case "IdSalidaAlmacen":
        sort = " Salida_en_almacen.IdSalidaAlmacen " + data.sortDirecction;
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
        condition += " AND Salida_en_almacen.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Salida_en_almacen.Folio <= " + data.filterAdvanced.toFolio;
    }
    switch (data.filterAdvanced.No__de_Parte___DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Salida_en_almacen.No__de_Parte___Descripcion LIKE '" + data.filterAdvanced.No__de_Parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Salida_en_almacen.No__de_Parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_Parte___Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Salida_en_almacen.No__de_Parte___Descripcion LIKE '%" + data.filterAdvanced.No__de_Parte___Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Salida_en_almacen.No__de_Parte___Descripcion = '" + data.filterAdvanced.No__de_Parte___Descripcion + "'";
        break;
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
      condition += " AND Salida_en_almacen.Solicitante In (" + Solicitanteds + ")";
    }
    if ((typeof data.filterAdvanced.fromCant__Solicitada != 'undefined' && data.filterAdvanced.fromCant__Solicitada)
	|| (typeof data.filterAdvanced.toCant__Solicitada != 'undefined' && data.filterAdvanced.toCant__Solicitada)) 
	{
      if (typeof data.filterAdvanced.fromCant__Solicitada != 'undefined' && data.filterAdvanced.fromCant__Solicitada)
        condition += " AND Salida_en_almacen.Cant__Solicitada >= " + data.filterAdvanced.fromCant__Solicitada;

      if (typeof data.filterAdvanced.toCant__Solicitada != 'undefined' && data.filterAdvanced.toCant__Solicitada) 
        condition += " AND Salida_en_almacen.Cant__Solicitada <= " + data.filterAdvanced.toCant__Solicitada;
    }
    if ((typeof data.filterAdvanced.Und_ != 'undefined' && data.filterAdvanced.Und_)) {
      switch (data.filterAdvanced.Und_Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Unidad.Descripcion LIKE '" + data.filterAdvanced.Und_ + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Und_ + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Und_ + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Unidad.Descripcion = '" + data.filterAdvanced.Und_ + "'";
          break;
      }
    } else if (data.filterAdvanced.Und_Multiple != null && data.filterAdvanced.Und_Multiple.length > 0) {
      var Und_ds = data.filterAdvanced.Und_Multiple.join(",");
      condition += " AND Salida_en_almacen.Und_ In (" + Und_ds + ")";
    }
    if ((typeof data.filterAdvanced.Entregado_a != 'undefined' && data.filterAdvanced.Entregado_a)) {
      switch (data.filterAdvanced.Entregado_aFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Entregado_a + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Entregado_a + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Entregado_a + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Entregado_a + "'";
          break;
      }
    } else if (data.filterAdvanced.Entregado_aMultiple != null && data.filterAdvanced.Entregado_aMultiple.length > 0) {
      var Entregado_ads = data.filterAdvanced.Entregado_aMultiple.join(",");
      condition += " AND Salida_en_almacen.Entregado_a In (" + Entregado_ads + ")";
    }
    if ((typeof data.filterAdvanced.fromCant__a_entregar != 'undefined' && data.filterAdvanced.fromCant__a_entregar)
	|| (typeof data.filterAdvanced.toCant__a_entregar != 'undefined' && data.filterAdvanced.toCant__a_entregar)) 
	{
      if (typeof data.filterAdvanced.fromCant__a_entregar != 'undefined' && data.filterAdvanced.fromCant__a_entregar)
        condition += " AND Salida_en_almacen.Cant__a_entregar >= " + data.filterAdvanced.fromCant__a_entregar;

      if (typeof data.filterAdvanced.toCant__a_entregar != 'undefined' && data.filterAdvanced.toCant__a_entregar) 
        condition += " AND Salida_en_almacen.Cant__a_entregar <= " + data.filterAdvanced.toCant__a_entregar;
    }
    if ((typeof data.filterAdvanced.Und2 != 'undefined' && data.filterAdvanced.Und2)) {
      switch (data.filterAdvanced.Und2Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Unidad.Descripcion LIKE '" + data.filterAdvanced.Und2 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Und2 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Unidad.Descripcion LIKE '%" + data.filterAdvanced.Und2 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Unidad.Descripcion = '" + data.filterAdvanced.Und2 + "'";
          break;
      }
    } else if (data.filterAdvanced.Und2Multiple != null && data.filterAdvanced.Und2Multiple.length > 0) {
      var Und2ds = data.filterAdvanced.Und2Multiple.join(",");
      condition += " AND Salida_en_almacen.Und2 In (" + Und2ds + ")";
    }
    switch (data.filterAdvanced.IdSalidaAlmacenFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Salida_en_almacen.IdSalidaAlmacen LIKE '" + data.filterAdvanced.IdSalidaAlmacen + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Salida_en_almacen.IdSalidaAlmacen LIKE '%" + data.filterAdvanced.IdSalidaAlmacen + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Salida_en_almacen.IdSalidaAlmacen LIKE '%" + data.filterAdvanced.IdSalidaAlmacen + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Salida_en_almacen.IdSalidaAlmacen = '" + data.filterAdvanced.IdSalidaAlmacen + "'";
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
              const longest = result.Salida_en_almacens.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Salida_en_almacens);
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
