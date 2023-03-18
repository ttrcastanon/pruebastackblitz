import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Impresion_de_Bitacora_de_VueloService } from "src/app/api-services/Impresion_de_Bitacora_de_Vuelo.service";
import { Impresion_de_Bitacora_de_Vuelo } from "src/app/models/Impresion_de_Bitacora_de_Vuelo";
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
import { Impresion_de_Bitacora_de_VueloIndexRules } from 'src/app/shared/businessRules/Impresion_de_Bitacora_de_Vuelo-index-rules';
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
  selector: "app-list-Impresion_de_Bitacora_de_Vuelo",
  templateUrl: "./list-Impresion_de_Bitacora_de_Vuelo.component.html",
  styleUrls: ["./list-Impresion_de_Bitacora_de_Vuelo.component.scss"],
})
export class ListImpresion_de_Bitacora_de_VueloComponent extends Impresion_de_Bitacora_de_VueloIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Vuelo",
    "Fecha",
    "Tramo1",
    "Tramo2",
    "Tramo3",
    "Tramo4",
    "Tramo5",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Vuelo",
      "Fecha",
      "Tramo1",
      "Tramo2",
      "Tramo3",
      "Tramo4",
      "Tramo5",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Vuelo_filtro",
      "Fecha_filtro",
      "Tramo1_filtro",
      "Tramo2_filtro",
      "Tramo3_filtro",
      "Tramo4_filtro",
      "Tramo5_filtro",

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
      Vuelo: "",
      Fecha: null,
      Tramo1: "",
      Tramo2: "",
      Tramo3: "",
      Tramo4: "",
      Tramo5: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      VueloFilter: "",
      Vuelo: "",
      VueloMultiple: "",
      fromFecha: "",
      toFecha: "",
      Tramo1Filter: "",
      Tramo1: "",
      Tramo1Multiple: "",
      Tramo2Filter: "",
      Tramo2: "",
      Tramo2Multiple: "",
      Tramo3Filter: "",
      Tramo3: "",
      Tramo3Multiple: "",
      Tramo4Filter: "",
      Tramo4: "",
      Tramo4Multiple: "",
      Tramo5Filter: "",
      Tramo5: "",
      Tramo5Multiple: "",

    }
  };

  dataSource: Impresion_de_Bitacora_de_VueloDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Impresion_de_Bitacora_de_VueloDataSource;
  dataClipboard: any;

  constructor(
    private _Impresion_de_Bitacora_de_VueloService: Impresion_de_Bitacora_de_VueloService,
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
    this.dataSource = new Impresion_de_Bitacora_de_VueloDataSource(
      this._Impresion_de_Bitacora_de_VueloService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Impresion_de_Bitacora_de_Vuelo)
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
    this.listConfig.filter.Vuelo = "";
    this.listConfig.filter.Fecha = undefined;
    this.listConfig.filter.Tramo1 = "";
    this.listConfig.filter.Tramo2 = "";
    this.listConfig.filter.Tramo3 = "";
    this.listConfig.filter.Tramo4 = "";
    this.listConfig.filter.Tramo5 = "";

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

  remove(row: Impresion_de_Bitacora_de_Vuelo) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Impresion_de_Bitacora_de_VueloService
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
  ActionPrint(dataRow: Impresion_de_Bitacora_de_Vuelo) {

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
'Folio '
,'Vuelo'
,'Fecha '
,'Tramo1 '
,'Tramo2 '
,'Tramo3 '
,'Tramo4 '
,'Tramo5 '

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo
,x.Fecha
,x.Tramo1_Registro_de_vuelo.Numero_de_Tramo
,x.Tramo2_Registro_de_vuelo.Numero_de_Tramo
,x.Tramo3_Registro_de_vuelo.Numero_de_Tramo
,x.Tramo4_Registro_de_vuelo.Numero_de_Tramo
,x.Tramo5_Registro_de_vuelo.Numero_de_Tramo
		  
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
    pdfMake.createPdf(pdfDefinition).download('Impresion_de_Bitacora_de_Vuelo.pdf');
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
          this._Impresion_de_Bitacora_de_VueloService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Impresion_de_Bitacora_de_Vuelos;
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
          this._Impresion_de_Bitacora_de_VueloService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Impresion_de_Bitacora_de_Vuelos;
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
        'Folio  ': fields.Folio,
        'Vuelo ': fields.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        'Fecha  ': fields.Fecha ? momentJS(fields.Fecha).format('DD/MM/YYYY') : '',
        'Tramo1  ': fields.Tramo1_Registro_de_vuelo.Numero_de_Tramo,
        'Tramo2  1': fields.Tramo2_Registro_de_vuelo.Numero_de_Tramo,
        'Tramo3  2': fields.Tramo3_Registro_de_vuelo.Numero_de_Tramo,
        'Tramo4  3': fields.Tramo4_Registro_de_vuelo.Numero_de_Tramo,
        'Tramo5  4': fields.Tramo5_Registro_de_vuelo.Numero_de_Tramo,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Impresion_de_Bitacora_de_Vuelo  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Vuelo: x.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
      Fecha: x.Fecha,
      Tramo1: x.Tramo1_Registro_de_vuelo.Numero_de_Tramo,
      Tramo2: x.Tramo2_Registro_de_vuelo.Numero_de_Tramo,
      Tramo3: x.Tramo3_Registro_de_vuelo.Numero_de_Tramo,
      Tramo4: x.Tramo4_Registro_de_vuelo.Numero_de_Tramo,
      Tramo5: x.Tramo5_Registro_de_vuelo.Numero_de_Tramo,

    }));

    this.excelService.exportToCsv(result, 'Impresion_de_Bitacora_de_Vuelo',  ['Folio'    ,'Vuelo'  ,'Fecha'  ,'Tramo1'  ,'Tramo2'  ,'Tramo3'  ,'Tramo4'  ,'Tramo5' ]);
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
    template += '          <th>Folio </th>';
    template += '          <th>Vuelo</th>';
    template += '          <th>Fecha </th>';
    template += '          <th>Tramo1 </th>';
    template += '          <th>Tramo2 </th>';
    template += '          <th>Tramo3 </th>';
    template += '          <th>Tramo4 </th>';
    template += '          <th>Tramo5 </th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo + '</td>';
      template += '          <td>' + element.Fecha + '</td>';
      template += '          <td>' + element.Tramo1_Registro_de_vuelo.Numero_de_Tramo + '</td>';
      template += '          <td>' + element.Tramo2_Registro_de_vuelo.Numero_de_Tramo + '</td>';
      template += '          <td>' + element.Tramo3_Registro_de_vuelo.Numero_de_Tramo + '</td>';
      template += '          <td>' + element.Tramo4_Registro_de_vuelo.Numero_de_Tramo + '</td>';
      template += '          <td>' + element.Tramo5_Registro_de_vuelo.Numero_de_Tramo + '</td>';
		  
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
	template += '\t Folio ';
	template += '\t Vuelo';
	template += '\t Fecha ';
	template += '\t Tramo1 ';
	template += '\t Tramo2 ';
	template += '\t Tramo3 ';
	template += '\t Tramo4 ';
	template += '\t Tramo5 ';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo;
	  template += '\t ' + element.Fecha;
      template += '\t ' + element.Tramo1_Registro_de_vuelo.Numero_de_Tramo;
      template += '\t ' + element.Tramo2_Registro_de_vuelo.Numero_de_Tramo;
      template += '\t ' + element.Tramo3_Registro_de_vuelo.Numero_de_Tramo;
      template += '\t ' + element.Tramo4_Registro_de_vuelo.Numero_de_Tramo;
      template += '\t ' + element.Tramo5_Registro_de_vuelo.Numero_de_Tramo;

	  template += '\n';
    });

    return template;
  }

}

export class Impresion_de_Bitacora_de_VueloDataSource implements DataSource<Impresion_de_Bitacora_de_Vuelo>
{
  private subject = new BehaviorSubject<Impresion_de_Bitacora_de_Vuelo[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Impresion_de_Bitacora_de_VueloService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Impresion_de_Bitacora_de_Vuelo[]> {
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
              const longest = result.Impresion_de_Bitacora_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Impresion_de_Bitacora_de_Vuelos);
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
      condition += " and Impresion_de_Bitacora_de_Vuelo.Folio = " + data.filter.Folio;
    if (data.filter.Vuelo != "")
      condition += " and Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + data.filter.Vuelo + "%' ";
    if (data.filter.Fecha)
      condition += " and CONVERT(VARCHAR(10), Impresion_de_Bitacora_de_Vuelo.Fecha, 102)  = '" + moment(data.filter.Fecha).format("YYYY.MM.DD") + "'";
    if (data.filter.Tramo1 != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Tramo1 + "%' ";
    if (data.filter.Tramo2 != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Tramo2 + "%' ";
    if (data.filter.Tramo3 != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Tramo3 + "%' ";
    if (data.filter.Tramo4 != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Tramo4 + "%' ";
    if (data.filter.Tramo5 != "")
      condition += " and Registro_de_vuelo.Numero_de_Tramo like '%" + data.filter.Tramo5 + "%' ";

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
        sort = " Impresion_de_Bitacora_de_Vuelo.Folio " + data.sortDirecction;
        break;
      case "Vuelo":
        sort = " Solicitud_de_Vuelo.Numero_de_Vuelo " + data.sortDirecction;
        break;
      case "Fecha":
        sort = " Impresion_de_Bitacora_de_Vuelo.Fecha " + data.sortDirecction;
        break;
      case "Tramo1":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
        break;
      case "Tramo2":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
        break;
      case "Tramo3":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
        break;
      case "Tramo4":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
        break;
      case "Tramo5":
        sort = " Registro_de_vuelo.Numero_de_Tramo " + data.sortDirecction;
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
        condition += " AND Impresion_de_Bitacora_de_Vuelo.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Impresion_de_Bitacora_de_Vuelo.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Vuelo != 'undefined' && data.filterAdvanced.Vuelo)) {
      switch (data.filterAdvanced.VueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '" + data.filterAdvanced.Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo LIKE '%" + data.filterAdvanced.Vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Solicitud_de_Vuelo.Numero_de_Vuelo = '" + data.filterAdvanced.Vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.VueloMultiple != null && data.filterAdvanced.VueloMultiple.length > 0) {
      var Vuelods = data.filterAdvanced.VueloMultiple.join(",");
      condition += " AND Impresion_de_Bitacora_de_Vuelo.Vuelo In (" + Vuelods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
	|| (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)) 
	{
      if (typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha) 
        condition += " and CONVERT(VARCHAR(10), Impresion_de_Bitacora_de_Vuelo.Fecha, 102)  >= '" +  moment(data.filterAdvanced.fromFecha).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha) 
        condition += " and CONVERT(VARCHAR(10), Impresion_de_Bitacora_de_Vuelo.Fecha, 102)  <= '" + moment(data.filterAdvanced.toFecha).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Tramo1 != 'undefined' && data.filterAdvanced.Tramo1)) {
      switch (data.filterAdvanced.Tramo1Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '" + data.filterAdvanced.Tramo1 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo1 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo1 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo = '" + data.filterAdvanced.Tramo1 + "'";
          break;
      }
    } else if (data.filterAdvanced.Tramo1Multiple != null && data.filterAdvanced.Tramo1Multiple.length > 0) {
      var Tramo1ds = data.filterAdvanced.Tramo1Multiple.join(",");
      condition += " AND Impresion_de_Bitacora_de_Vuelo.Tramo1 In (" + Tramo1ds + ")";
    }
    if ((typeof data.filterAdvanced.Tramo2 != 'undefined' && data.filterAdvanced.Tramo2)) {
      switch (data.filterAdvanced.Tramo2Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '" + data.filterAdvanced.Tramo2 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo2 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo2 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo = '" + data.filterAdvanced.Tramo2 + "'";
          break;
      }
    } else if (data.filterAdvanced.Tramo2Multiple != null && data.filterAdvanced.Tramo2Multiple.length > 0) {
      var Tramo2ds = data.filterAdvanced.Tramo2Multiple.join(",");
      condition += " AND Impresion_de_Bitacora_de_Vuelo.Tramo2 In (" + Tramo2ds + ")";
    }
    if ((typeof data.filterAdvanced.Tramo3 != 'undefined' && data.filterAdvanced.Tramo3)) {
      switch (data.filterAdvanced.Tramo3Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '" + data.filterAdvanced.Tramo3 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo3 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo3 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo = '" + data.filterAdvanced.Tramo3 + "'";
          break;
      }
    } else if (data.filterAdvanced.Tramo3Multiple != null && data.filterAdvanced.Tramo3Multiple.length > 0) {
      var Tramo3ds = data.filterAdvanced.Tramo3Multiple.join(",");
      condition += " AND Impresion_de_Bitacora_de_Vuelo.Tramo3 In (" + Tramo3ds + ")";
    }
    if ((typeof data.filterAdvanced.Tramo4 != 'undefined' && data.filterAdvanced.Tramo4)) {
      switch (data.filterAdvanced.Tramo4Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '" + data.filterAdvanced.Tramo4 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo4 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo4 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo = '" + data.filterAdvanced.Tramo4 + "'";
          break;
      }
    } else if (data.filterAdvanced.Tramo4Multiple != null && data.filterAdvanced.Tramo4Multiple.length > 0) {
      var Tramo4ds = data.filterAdvanced.Tramo4Multiple.join(",");
      condition += " AND Impresion_de_Bitacora_de_Vuelo.Tramo4 In (" + Tramo4ds + ")";
    }
    if ((typeof data.filterAdvanced.Tramo5 != 'undefined' && data.filterAdvanced.Tramo5)) {
      switch (data.filterAdvanced.Tramo5Filter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '" + data.filterAdvanced.Tramo5 + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo5 + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo LIKE '%" + data.filterAdvanced.Tramo5 + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Registro_de_vuelo.Numero_de_Tramo = '" + data.filterAdvanced.Tramo5 + "'";
          break;
      }
    } else if (data.filterAdvanced.Tramo5Multiple != null && data.filterAdvanced.Tramo5Multiple.length > 0) {
      var Tramo5ds = data.filterAdvanced.Tramo5Multiple.join(",");
      condition += " AND Impresion_de_Bitacora_de_Vuelo.Tramo5 In (" + Tramo5ds + ")";
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
              const longest = result.Impresion_de_Bitacora_de_Vuelos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Impresion_de_Bitacora_de_Vuelos);
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
