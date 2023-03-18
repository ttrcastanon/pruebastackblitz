import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Comisariato_y_notas_de_vueloService } from "src/app/api-services/Comisariato_y_notas_de_vuelo.service";
import { Comisariato_y_notas_de_vuelo } from "src/app/models/Comisariato_y_notas_de_vuelo";
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
import { Comisariato_y_notas_de_vueloIndexRules } from 'src/app/shared/businessRules/Comisariato_y_notas_de_vuelo-index-rules';
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
  selector: "app-list-Comisariato_y_notas_de_vuelo",
  templateUrl: "./list-Comisariato_y_notas_de_vuelo.component.html",
  styleUrls: ["./list-Comisariato_y_notas_de_vuelo.component.scss"],
})
export class ListComisariato_y_notas_de_vueloComponent extends Comisariato_y_notas_de_vueloIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Numero_de_Vuelo",
    "Comisariato",
    "Notas_de_vuelo",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Numero_de_Vuelo",
      "Comisariato",
      "Notas_de_vuelo",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Numero_de_Vuelo_filtro",
      "Comisariato_filtro",
      "Notas_de_vuelo_filtro",

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
      Numero_de_Vuelo: "",
      Comisariato: "",
      Notas_de_vuelo: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Numero_de_VueloFilter: "",
      Numero_de_Vuelo: "",
      Numero_de_VueloMultiple: "",

    }
  };

  dataSource: Comisariato_y_notas_de_vueloDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Comisariato_y_notas_de_vueloDataSource;
  dataClipboard: any;

  constructor(
    private _Comisariato_y_notas_de_vueloService: Comisariato_y_notas_de_vueloService,
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
    this.dataSource = new Comisariato_y_notas_de_vueloDataSource(
      this._Comisariato_y_notas_de_vueloService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Comisariato_y_notas_de_vuelo)
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
    this.listConfig.filter.Numero_de_Vuelo = "";
    this.listConfig.filter.Comisariato = "";
    this.listConfig.filter.Notas_de_vuelo = "";

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

  remove(row: Comisariato_y_notas_de_vuelo) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Comisariato_y_notas_de_vueloService
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
  ActionPrint(dataRow: Comisariato_y_notas_de_vuelo) {

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
,'Número de Vuelo'
,'Comisariato'
,'Notas de vuelo'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
,x.Comisariato
,x.Notas_de_vuelo
		  
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
    pdfMake.createPdf(pdfDefinition).download('Comisariato_y_notas_de_vuelo.pdf');
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
          this._Comisariato_y_notas_de_vueloService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Comisariato_y_notas_de_vuelos;
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
          this._Comisariato_y_notas_de_vueloService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Comisariato_y_notas_de_vuelos;
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
        'Número de Vuelo ': fields.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Comisariato ': fields.Comisariato,
        'Notas de vuelo ': fields.Notas_de_vuelo,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Comisariato_y_notas_de_vuelo  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Numero_de_Vuelo: x.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Comisariato: x.Comisariato,
      Notas_de_vuelo: x.Notas_de_vuelo,

    }));

    this.excelService.exportToCsv(result, 'Comisariato_y_notas_de_vuelo',  ['Folio'    ,'Numero_de_Vuelo'  ,'Comisariato'  ,'Notas_de_vuelo' ]);
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
    template += '          <th>Número de Vuelo</th>';
    template += '          <th>Comisariato</th>';
    template += '          <th>Notas de vuelo</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Comisariato + '</td>';
      template += '          <td>' + element.Notas_de_vuelo + '</td>';
		  
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
	template += '\t Número de Vuelo';
	template += '\t Comisariato';
	template += '\t Notas de vuelo';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
	  template += '\t ' + element.Comisariato;
	  template += '\t ' + element.Notas_de_vuelo;

	  template += '\n';
    });

    return template;
  }

}

export class Comisariato_y_notas_de_vueloDataSource implements DataSource<Comisariato_y_notas_de_vuelo>
{
  private subject = new BehaviorSubject<Comisariato_y_notas_de_vuelo[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Comisariato_y_notas_de_vueloService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Comisariato_y_notas_de_vuelo[]> {
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
              const longest = result.Comisariato_y_notas_de_vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Comisariato_y_notas_de_vuelos);
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
      condition += " and Comisariato_y_notas_de_vuelo.Folio = " + data.filter.Folio;
    if (data.filter.Numero_de_Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Numero_de_Vuelo + "%' ";
    if (data.filter.Comisariato != "")
      condition += " and Comisariato_y_notas_de_vuelo.Comisariato like '%" + data.filter.Comisariato + "%' ";
    if (data.filter.Notas_de_vuelo != "")
      condition += " and Comisariato_y_notas_de_vuelo.Notas_de_vuelo like '%" + data.filter.Notas_de_vuelo + "%' ";

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
        sort = " Comisariato_y_notas_de_vuelo.Folio " + data.sortDirecction;
        break;
      case "Numero_de_Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Comisariato":
        sort = " Comisariato_y_notas_de_vuelo.Comisariato " + data.sortDirecction;
        break;
      case "Notas_de_vuelo":
        sort = " Comisariato_y_notas_de_vuelo.Notas_de_vuelo " + data.sortDirecction;
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
        condition += " AND Comisariato_y_notas_de_vuelo.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Comisariato_y_notas_de_vuelo.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Numero_de_Vuelo != 'undefined' && data.filterAdvanced.Numero_de_Vuelo)) {
      switch (data.filterAdvanced.Numero_de_VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.Numero_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Numero_de_Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Numero_de_Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.Numero_de_Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_VueloMultiple != null && data.filterAdvanced.Numero_de_VueloMultiple.length > 0) {
      var Numero_de_Vuelods = data.filterAdvanced.Numero_de_VueloMultiple.join(",");
      condition += " AND Comisariato_y_notas_de_vuelo.Numero_de_Vuelo In (" + Numero_de_Vuelods + ")";
    }
    switch (data.filterAdvanced.ComisariatoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comisariato_y_notas_de_vuelo.Comisariato LIKE '" + data.filterAdvanced.Comisariato + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comisariato_y_notas_de_vuelo.Comisariato LIKE '%" + data.filterAdvanced.Comisariato + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comisariato_y_notas_de_vuelo.Comisariato LIKE '%" + data.filterAdvanced.Comisariato + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comisariato_y_notas_de_vuelo.Comisariato = '" + data.filterAdvanced.Comisariato + "'";
        break;
    }
    switch (data.filterAdvanced.Notas_de_vueloFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Comisariato_y_notas_de_vuelo.Notas_de_vuelo LIKE '" + data.filterAdvanced.Notas_de_vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Comisariato_y_notas_de_vuelo.Notas_de_vuelo LIKE '%" + data.filterAdvanced.Notas_de_vuelo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Comisariato_y_notas_de_vuelo.Notas_de_vuelo LIKE '%" + data.filterAdvanced.Notas_de_vuelo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Comisariato_y_notas_de_vuelo.Notas_de_vuelo = '" + data.filterAdvanced.Notas_de_vuelo + "'";
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
              const longest = result.Comisariato_y_notas_de_vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Comisariato_y_notas_de_vuelos);
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
