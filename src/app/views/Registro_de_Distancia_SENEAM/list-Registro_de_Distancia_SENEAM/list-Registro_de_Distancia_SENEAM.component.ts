import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Registro_de_Distancia_SENEAMService } from "src/app/api-services/Registro_de_Distancia_SENEAM.service";
import { Registro_de_Distancia_SENEAM } from "src/app/models/Registro_de_Distancia_SENEAM";
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
import { Registro_de_Distancia_SENEAMIndexRules } from 'src/app/shared/businessRules/Registro_de_Distancia_SENEAM-index-rules';
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
  selector: "app-list-Registro_de_Distancia_SENEAM",
  templateUrl: "./list-Registro_de_Distancia_SENEAM.component.html",
  styleUrls: ["./list-Registro_de_Distancia_SENEAM.component.scss"],
})
export class ListRegistro_de_Distancia_SENEAMComponent extends Registro_de_Distancia_SENEAMIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Aeropuerto_Origen",
    "Aeropuerto_Destino",
    "Distancia_SENEAM_KM",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Aeropuerto_Origen",
      "Aeropuerto_Destino",
      "Distancia_SENEAM_KM",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Aeropuerto_Origen_filtro",
      "Aeropuerto_Destino_filtro",
      "Distancia_SENEAM_KM_filtro",

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
      Aeropuerto_Origen: "",
      Aeropuerto_Destino: "",
      Distancia_SENEAM_KM: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Aeropuerto_OrigenFilter: "",
      Aeropuerto_Origen: "",
      Aeropuerto_OrigenMultiple: "",
      Aeropuerto_DestinoFilter: "",
      Aeropuerto_Destino: "",
      Aeropuerto_DestinoMultiple: "",
      fromDistancia_SENEAM_KM: "",
      toDistancia_SENEAM_KM: "",

    }
  };

  dataSource: Registro_de_Distancia_SENEAMDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Registro_de_Distancia_SENEAMDataSource;
  dataClipboard: any;

  constructor(
    private _Registro_de_Distancia_SENEAMService: Registro_de_Distancia_SENEAMService,
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
    this.dataSource = new Registro_de_Distancia_SENEAMDataSource(
      this._Registro_de_Distancia_SENEAMService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Registro_de_Distancia_SENEAM)
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
    this.listConfig.filter.Aeropuerto_Origen = "";
    this.listConfig.filter.Aeropuerto_Destino = "";
    this.listConfig.filter.Distancia_SENEAM_KM = "";

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

  remove(row: Registro_de_Distancia_SENEAM) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Registro_de_Distancia_SENEAMService
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
  ActionPrint(dataRow: Registro_de_Distancia_SENEAM) {

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
,'Aeropuerto Origen'
,'Aeropuerto Destino'
,'Distancia SENEAM (KM)'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Aeropuerto_Origen_Aeropuertos.Nombre
,x.Aeropuerto_Destino_Aeropuertos.Nombre
,x.Distancia_SENEAM_KM
		  
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
    pdfMake.createPdf(pdfDefinition).download('Registro_de_Distancia_SENEAM.pdf');
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
          this._Registro_de_Distancia_SENEAMService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Registro_de_Distancia_SENEAMs;
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
          this._Registro_de_Distancia_SENEAMService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Registro_de_Distancia_SENEAMs;
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
        'Aeropuerto Origen ': fields.Aeropuerto_Origen_Aeropuertos.Nombre,
        'Aeropuerto Destino 1': fields.Aeropuerto_Destino_Aeropuertos.Nombre,
        'Distancia SENEAM (KM) ': fields.Distancia_SENEAM_KM,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Registro_de_Distancia_SENEAM  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Aeropuerto_Origen: x.Aeropuerto_Origen_Aeropuertos.Nombre,
      Aeropuerto_Destino: x.Aeropuerto_Destino_Aeropuertos.Nombre,
      Distancia_SENEAM_KM: x.Distancia_SENEAM_KM,

    }));

    this.excelService.exportToCsv(result, 'Registro_de_Distancia_SENEAM',  ['Folio'    ,'Aeropuerto_Origen'  ,'Aeropuerto_Destino'  ,'Distancia_SENEAM_KM' ]);
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
    template += '          <th>Aeropuerto Origen</th>';
    template += '          <th>Aeropuerto Destino</th>';
    template += '          <th>Distancia SENEAM (KM)</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Aeropuerto_Origen_Aeropuertos.Nombre + '</td>';
      template += '          <td>' + element.Aeropuerto_Destino_Aeropuertos.Nombre + '</td>';
      template += '          <td>' + element.Distancia_SENEAM_KM + '</td>';
		  
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
	template += '\t Aeropuerto Origen';
	template += '\t Aeropuerto Destino';
	template += '\t Distancia SENEAM (KM)';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Aeropuerto_Origen_Aeropuertos.Nombre;
      template += '\t ' + element.Aeropuerto_Destino_Aeropuertos.Nombre;
	  template += '\t ' + element.Distancia_SENEAM_KM;

	  template += '\n';
    });

    return template;
  }

}

export class Registro_de_Distancia_SENEAMDataSource implements DataSource<Registro_de_Distancia_SENEAM>
{
  private subject = new BehaviorSubject<Registro_de_Distancia_SENEAM[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Registro_de_Distancia_SENEAMService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Registro_de_Distancia_SENEAM[]> {
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
              const longest = result.Registro_de_Distancia_SENEAMs.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Registro_de_Distancia_SENEAMs);
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
      condition += " and Registro_de_Distancia_SENEAM.Folio = " + data.filter.Folio;
    if (data.filter.Aeropuerto_Origen != "")
      condition += " and Aeropuertos.Nombre like '%" + data.filter.Aeropuerto_Origen + "%' ";
    if (data.filter.Aeropuerto_Destino != "")
      condition += " and Aeropuertos.Nombre like '%" + data.filter.Aeropuerto_Destino + "%' ";
    if (data.filter.Distancia_SENEAM_KM != "")
      condition += " and Registro_de_Distancia_SENEAM.Distancia_SENEAM_KM = " + data.filter.Distancia_SENEAM_KM;

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
        sort = " Registro_de_Distancia_SENEAM.Folio " + data.sortDirecction;
        break;
      case "Aeropuerto_Origen":
        sort = " Aeropuertos.Nombre " + data.sortDirecction;
        break;
      case "Aeropuerto_Destino":
        sort = " Aeropuertos.Nombre " + data.sortDirecction;
        break;
      case "Distancia_SENEAM_KM":
        sort = " Registro_de_Distancia_SENEAM.Distancia_SENEAM_KM " + data.sortDirecction;
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
        condition += " AND Registro_de_Distancia_SENEAM.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Registro_de_Distancia_SENEAM.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Aeropuerto_Origen != 'undefined' && data.filterAdvanced.Aeropuerto_Origen)) {
      switch (data.filterAdvanced.Aeropuerto_OrigenFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Nombre LIKE '" + data.filterAdvanced.Aeropuerto_Origen + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto_Origen + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto_Origen + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Nombre = '" + data.filterAdvanced.Aeropuerto_Origen + "'";
          break;
      }
    } else if (data.filterAdvanced.Aeropuerto_OrigenMultiple != null && data.filterAdvanced.Aeropuerto_OrigenMultiple.length > 0) {
      var Aeropuerto_Origends = data.filterAdvanced.Aeropuerto_OrigenMultiple.join(",");
      condition += " AND Registro_de_Distancia_SENEAM.Aeropuerto_Origen In (" + Aeropuerto_Origends + ")";
    }
    if ((typeof data.filterAdvanced.Aeropuerto_Destino != 'undefined' && data.filterAdvanced.Aeropuerto_Destino)) {
      switch (data.filterAdvanced.Aeropuerto_DestinoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeropuertos.Nombre LIKE '" + data.filterAdvanced.Aeropuerto_Destino + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto_Destino + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeropuertos.Nombre LIKE '%" + data.filterAdvanced.Aeropuerto_Destino + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeropuertos.Nombre = '" + data.filterAdvanced.Aeropuerto_Destino + "'";
          break;
      }
    } else if (data.filterAdvanced.Aeropuerto_DestinoMultiple != null && data.filterAdvanced.Aeropuerto_DestinoMultiple.length > 0) {
      var Aeropuerto_Destinods = data.filterAdvanced.Aeropuerto_DestinoMultiple.join(",");
      condition += " AND Registro_de_Distancia_SENEAM.Aeropuerto_Destino In (" + Aeropuerto_Destinods + ")";
    }
    if ((typeof data.filterAdvanced.fromDistancia_SENEAM_KM != 'undefined' && data.filterAdvanced.fromDistancia_SENEAM_KM)
	|| (typeof data.filterAdvanced.toDistancia_SENEAM_KM != 'undefined' && data.filterAdvanced.toDistancia_SENEAM_KM)) 
	{
      if (typeof data.filterAdvanced.fromDistancia_SENEAM_KM != 'undefined' && data.filterAdvanced.fromDistancia_SENEAM_KM)
        condition += " AND Registro_de_Distancia_SENEAM.Distancia_SENEAM_KM >= " + data.filterAdvanced.fromDistancia_SENEAM_KM;

      if (typeof data.filterAdvanced.toDistancia_SENEAM_KM != 'undefined' && data.filterAdvanced.toDistancia_SENEAM_KM) 
        condition += " AND Registro_de_Distancia_SENEAM.Distancia_SENEAM_KM <= " + data.filterAdvanced.toDistancia_SENEAM_KM;
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
              const longest = result.Registro_de_Distancia_SENEAMs.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Registro_de_Distancia_SENEAMs);
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
