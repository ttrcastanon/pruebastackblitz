import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Layout_Balance_GeneralService } from "src/app/api-services/Layout_Balance_General.service";
import { Layout_Balance_General } from "src/app/models/Layout_Balance_General";
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
import { Layout_Balance_GeneralIndexRules } from 'src/app/shared/businessRules/Layout_Balance_General-index-rules';
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
  selector: "app-list-Layout_Balance_General",
  templateUrl: "./list-Layout_Balance_General.component.html",
  styleUrls: ["./list-Layout_Balance_General.component.scss"],
})
export class ListLayout_Balance_GeneralComponent extends Layout_Balance_GeneralIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Folio_de_carga_manual",
    "Fecha",
    "TipoConcepto",
    "AgrupacionConcepto",
    "Concepto",
    "Real",
    "Presupuesto",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Folio_de_carga_manual",
      "Fecha",
      "TipoConcepto",
      "AgrupacionConcepto",
      "Concepto",
      "Real",
      "Presupuesto",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Folio_de_carga_manual_filtro",
      "Fecha_filtro",
      "TipoConcepto_filtro",
      "AgrupacionConcepto_filtro",
      "Concepto_filtro",
      "Real_filtro",
      "Presupuesto_filtro",

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
      Folio_de_carga_manual: "",
      Fecha: null,
      TipoConcepto: "",
      AgrupacionConcepto: "",
      Concepto: "",
      Real: "",
      Presupuesto: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFolio_de_carga_manual: "",
      toFolio_de_carga_manual: "",
      fromFecha: "",
      toFecha: "",
      TipoConceptoFilter: "",
      TipoConcepto: "",
      TipoConceptoMultiple: "",
      AgrupacionConceptoFilter: "",
      AgrupacionConcepto: "",
      AgrupacionConceptoMultiple: "",
      ConceptoFilter: "",
      Concepto: "",
      ConceptoMultiple: "",
      fromReal: "",
      toReal: "",
      fromPresupuesto: "",
      toPresupuesto: "",

    }
  };

  dataSource: Layout_Balance_GeneralDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Layout_Balance_GeneralDataSource;
  dataClipboard: any;

  constructor(
    private _Layout_Balance_GeneralService: Layout_Balance_GeneralService,
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
    this.dataSource = new Layout_Balance_GeneralDataSource(
      this._Layout_Balance_GeneralService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Layout_Balance_General)
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
    this.listConfig.filter.Folio_de_carga_manual = "";
    this.listConfig.filter.Fecha = undefined;
    this.listConfig.filter.TipoConcepto = "";
    this.listConfig.filter.AgrupacionConcepto = "";
    this.listConfig.filter.Concepto = "";
    this.listConfig.filter.Real = "";
    this.listConfig.filter.Presupuesto = "";

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

  remove(row: Layout_Balance_General) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Layout_Balance_GeneralService
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
  ActionPrint(dataRow: Layout_Balance_General) {

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
,'Folio de carga manual'
,'Fecha'
,'TipoConcepto'
,'AgrupacionConcepto'
,'Concepto'
,'Real'
,'Presupuesto'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Folio_de_carga_manual
,x.Fecha
,x.TipoConcepto_Tipo_de_Concepto_Balance_General.Descripcion
,x.AgrupacionConcepto_Agrupacion_Concepto_Balance_General.Descripcion
,x.Concepto_Concepto_Balance_General.Descripcion
,x.Real
,x.Presupuesto
		  
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
    pdfMake.createPdf(pdfDefinition).download('Layout_Balance_General.pdf');
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
          this._Layout_Balance_GeneralService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Layout_Balance_Generals;
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
          this._Layout_Balance_GeneralService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Layout_Balance_Generals;
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
        'Folio de carga manual ': fields.Folio_de_carga_manual,
        'Fecha ': fields.Fecha ? momentJS(fields.Fecha).format('DD/MM/YYYY') : '',
        'TipoConcepto ': fields.TipoConcepto_Tipo_de_Concepto_Balance_General.Descripcion,
        'AgrupacionConcepto ': fields.AgrupacionConcepto_Agrupacion_Concepto_Balance_General.Descripcion,
        'Concepto ': fields.Concepto_Concepto_Balance_General.Descripcion,
        'Real ': fields.Real,
        'Presupuesto ': fields.Presupuesto,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Layout_Balance_General  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Folio_de_carga_manual: x.Folio_de_carga_manual,
      Fecha: x.Fecha,
      TipoConcepto: x.TipoConcepto_Tipo_de_Concepto_Balance_General.Descripcion,
      AgrupacionConcepto: x.AgrupacionConcepto_Agrupacion_Concepto_Balance_General.Descripcion,
      Concepto: x.Concepto_Concepto_Balance_General.Descripcion,
      Real: x.Real,
      Presupuesto: x.Presupuesto,

    }));

    this.excelService.exportToCsv(result, 'Layout_Balance_General',  ['Folio'    ,'Folio_de_carga_manual'  ,'Fecha'  ,'TipoConcepto'  ,'AgrupacionConcepto'  ,'Concepto'  ,'Real'  ,'Presupuesto' ]);
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
    template += '          <th>Folio de carga manual</th>';
    template += '          <th>Fecha</th>';
    template += '          <th>TipoConcepto</th>';
    template += '          <th>AgrupacionConcepto</th>';
    template += '          <th>Concepto</th>';
    template += '          <th>Real</th>';
    template += '          <th>Presupuesto</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Folio_de_carga_manual + '</td>';
      template += '          <td>' + element.Fecha + '</td>';
      template += '          <td>' + element.TipoConcepto_Tipo_de_Concepto_Balance_General.Descripcion + '</td>';
      template += '          <td>' + element.AgrupacionConcepto_Agrupacion_Concepto_Balance_General.Descripcion + '</td>';
      template += '          <td>' + element.Concepto_Concepto_Balance_General.Descripcion + '</td>';
      template += '          <td>' + element.Real + '</td>';
      template += '          <td>' + element.Presupuesto + '</td>';
		  
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
	template += '\t Folio de carga manual';
	template += '\t Fecha';
	template += '\t TipoConcepto';
	template += '\t AgrupacionConcepto';
	template += '\t Concepto';
	template += '\t Real';
	template += '\t Presupuesto';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Folio_de_carga_manual;
	  template += '\t ' + element.Fecha;
      template += '\t ' + element.TipoConcepto_Tipo_de_Concepto_Balance_General.Descripcion;
      template += '\t ' + element.AgrupacionConcepto_Agrupacion_Concepto_Balance_General.Descripcion;
      template += '\t ' + element.Concepto_Concepto_Balance_General.Descripcion;
	  template += '\t ' + element.Real;
	  template += '\t ' + element.Presupuesto;

	  template += '\n';
    });

    return template;
  }

}

export class Layout_Balance_GeneralDataSource implements DataSource<Layout_Balance_General>
{
  private subject = new BehaviorSubject<Layout_Balance_General[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Layout_Balance_GeneralService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Layout_Balance_General[]> {
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
              const longest = result.Layout_Balance_Generals.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Layout_Balance_Generals);
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
      condition += " and Layout_Balance_General.Folio = " + data.filter.Folio;
    if (data.filter.Folio_de_carga_manual != "")
      condition += " and Layout_Balance_General.Folio_de_carga_manual = " + data.filter.Folio_de_carga_manual;
    if (data.filter.Fecha)
      condition += " and CONVERT(VARCHAR(10), Layout_Balance_General.Fecha, 102)  = '" + moment(data.filter.Fecha).format("YYYY.MM.DD") + "'";
    if (data.filter.TipoConcepto != "")
      condition += " and Tipo_de_Concepto_Balance_General.Descripcion like '%" + data.filter.TipoConcepto + "%' ";
    if (data.filter.AgrupacionConcepto != "")
      condition += " and Agrupacion_Concepto_Balance_General.Descripcion like '%" + data.filter.AgrupacionConcepto + "%' ";
    if (data.filter.Concepto != "")
      condition += " and Concepto_Balance_General.Descripcion like '%" + data.filter.Concepto + "%' ";
    if (data.filter.Real != "")
      condition += " and Layout_Balance_General.Real = " + data.filter.Real;
    if (data.filter.Presupuesto != "")
      condition += " and Layout_Balance_General.Presupuesto = " + data.filter.Presupuesto;

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
        sort = " Layout_Balance_General.Folio " + data.sortDirecction;
        break;
      case "Folio_de_carga_manual":
        sort = " Layout_Balance_General.Folio_de_carga_manual " + data.sortDirecction;
        break;
      case "Fecha":
        sort = " Layout_Balance_General.Fecha " + data.sortDirecction;
        break;
      case "TipoConcepto":
        sort = " Tipo_de_Concepto_Balance_General.Descripcion " + data.sortDirecction;
        break;
      case "AgrupacionConcepto":
        sort = " Agrupacion_Concepto_Balance_General.Descripcion " + data.sortDirecction;
        break;
      case "Concepto":
        sort = " Concepto_Balance_General.Descripcion " + data.sortDirecction;
        break;
      case "Real":
        sort = " Layout_Balance_General.Real " + data.sortDirecction;
        break;
      case "Presupuesto":
        sort = " Layout_Balance_General.Presupuesto " + data.sortDirecction;
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
        condition += " AND Layout_Balance_General.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Layout_Balance_General.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFolio_de_carga_manual != 'undefined' && data.filterAdvanced.fromFolio_de_carga_manual)
	|| (typeof data.filterAdvanced.toFolio_de_carga_manual != 'undefined' && data.filterAdvanced.toFolio_de_carga_manual)) 
	{
      if (typeof data.filterAdvanced.fromFolio_de_carga_manual != 'undefined' && data.filterAdvanced.fromFolio_de_carga_manual)
        condition += " AND Layout_Balance_General.Folio_de_carga_manual >= " + data.filterAdvanced.fromFolio_de_carga_manual;

      if (typeof data.filterAdvanced.toFolio_de_carga_manual != 'undefined' && data.filterAdvanced.toFolio_de_carga_manual) 
        condition += " AND Layout_Balance_General.Folio_de_carga_manual <= " + data.filterAdvanced.toFolio_de_carga_manual;
    }
    if ((typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
	|| (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)) 
	{
      if (typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha) 
        condition += " and CONVERT(VARCHAR(10), Layout_Balance_General.Fecha, 102)  >= '" +  moment(data.filterAdvanced.fromFecha).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha) 
        condition += " and CONVERT(VARCHAR(10), Layout_Balance_General.Fecha, 102)  <= '" + moment(data.filterAdvanced.toFecha).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.TipoConcepto != 'undefined' && data.filterAdvanced.TipoConcepto)) {
      switch (data.filterAdvanced.TipoConceptoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Concepto_Balance_General.Descripcion LIKE '" + data.filterAdvanced.TipoConcepto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Concepto_Balance_General.Descripcion LIKE '%" + data.filterAdvanced.TipoConcepto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Concepto_Balance_General.Descripcion LIKE '%" + data.filterAdvanced.TipoConcepto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Concepto_Balance_General.Descripcion = '" + data.filterAdvanced.TipoConcepto + "'";
          break;
      }
    } else if (data.filterAdvanced.TipoConceptoMultiple != null && data.filterAdvanced.TipoConceptoMultiple.length > 0) {
      var TipoConceptods = data.filterAdvanced.TipoConceptoMultiple.join(",");
      condition += " AND Layout_Balance_General.TipoConcepto In (" + TipoConceptods + ")";
    }
    if ((typeof data.filterAdvanced.AgrupacionConcepto != 'undefined' && data.filterAdvanced.AgrupacionConcepto)) {
      switch (data.filterAdvanced.AgrupacionConceptoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Agrupacion_Concepto_Balance_General.Descripcion LIKE '" + data.filterAdvanced.AgrupacionConcepto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Agrupacion_Concepto_Balance_General.Descripcion LIKE '%" + data.filterAdvanced.AgrupacionConcepto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Agrupacion_Concepto_Balance_General.Descripcion LIKE '%" + data.filterAdvanced.AgrupacionConcepto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Agrupacion_Concepto_Balance_General.Descripcion = '" + data.filterAdvanced.AgrupacionConcepto + "'";
          break;
      }
    } else if (data.filterAdvanced.AgrupacionConceptoMultiple != null && data.filterAdvanced.AgrupacionConceptoMultiple.length > 0) {
      var AgrupacionConceptods = data.filterAdvanced.AgrupacionConceptoMultiple.join(",");
      condition += " AND Layout_Balance_General.AgrupacionConcepto In (" + AgrupacionConceptods + ")";
    }
    if ((typeof data.filterAdvanced.Concepto != 'undefined' && data.filterAdvanced.Concepto)) {
      switch (data.filterAdvanced.ConceptoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Concepto_Balance_General.Descripcion LIKE '" + data.filterAdvanced.Concepto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Concepto_Balance_General.Descripcion LIKE '%" + data.filterAdvanced.Concepto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Concepto_Balance_General.Descripcion LIKE '%" + data.filterAdvanced.Concepto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Concepto_Balance_General.Descripcion = '" + data.filterAdvanced.Concepto + "'";
          break;
      }
    } else if (data.filterAdvanced.ConceptoMultiple != null && data.filterAdvanced.ConceptoMultiple.length > 0) {
      var Conceptods = data.filterAdvanced.ConceptoMultiple.join(",");
      condition += " AND Layout_Balance_General.Concepto In (" + Conceptods + ")";
    }
    if ((typeof data.filterAdvanced.fromReal != 'undefined' && data.filterAdvanced.fromReal)
	|| (typeof data.filterAdvanced.toReal != 'undefined' && data.filterAdvanced.toReal)) 
	{
      if (typeof data.filterAdvanced.fromReal != 'undefined' && data.filterAdvanced.fromReal)
        condition += " AND Layout_Balance_General.Real >= " + data.filterAdvanced.fromReal;

      if (typeof data.filterAdvanced.toReal != 'undefined' && data.filterAdvanced.toReal) 
        condition += " AND Layout_Balance_General.Real <= " + data.filterAdvanced.toReal;
    }
    if ((typeof data.filterAdvanced.fromPresupuesto != 'undefined' && data.filterAdvanced.fromPresupuesto)
	|| (typeof data.filterAdvanced.toPresupuesto != 'undefined' && data.filterAdvanced.toPresupuesto)) 
	{
      if (typeof data.filterAdvanced.fromPresupuesto != 'undefined' && data.filterAdvanced.fromPresupuesto)
        condition += " AND Layout_Balance_General.Presupuesto >= " + data.filterAdvanced.fromPresupuesto;

      if (typeof data.filterAdvanced.toPresupuesto != 'undefined' && data.filterAdvanced.toPresupuesto) 
        condition += " AND Layout_Balance_General.Presupuesto <= " + data.filterAdvanced.toPresupuesto;
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
              const longest = result.Layout_Balance_Generals.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Layout_Balance_Generals);
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
