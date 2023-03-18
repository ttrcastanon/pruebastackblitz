import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { ImpuestosService } from "src/app/api-services/Impuestos.service";
import { Impuestos } from "src/app/models/Impuestos";
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
import { ImpuestosIndexRules } from 'src/app/shared/businessRules/Impuestos-index-rules';
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
  selector: "app-list-Impuestos",
  templateUrl: "./list-Impuestos.component.html",
  styleUrls: ["./list-Impuestos.component.scss"],
})
export class ListImpuestosComponent extends ImpuestosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "IVA_Nacional",
    "IVA_Internacional",
    "IVA_Frontera",
    "TUA_Nacional",
    "TUA_Internacional",
    "Cargos_por_vuelo_internacional",
    "Derechos_por_servicios_migratorios",
    "Fecha_ultima_modificacion",
    "Hora_ultima_modificacion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "IVA_Nacional",
      "IVA_Internacional",
      "IVA_Frontera",
      "TUA_Nacional",
      "TUA_Internacional",
      "Cargos_por_vuelo_internacional",
      "Derechos_por_servicios_migratorios",
      "Fecha_ultima_modificacion",
      "Hora_ultima_modificacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "IVA_Nacional_filtro",
      "IVA_Internacional_filtro",
      "IVA_Frontera_filtro",
      "TUA_Nacional_filtro",
      "TUA_Internacional_filtro",
      "Cargos_por_vuelo_internacional_filtro",
      "Derechos_por_servicios_migratorios_filtro",
      "Fecha_ultima_modificacion_filtro",
      "Hora_ultima_modificacion_filtro",

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
      IVA_Nacional: "",
      IVA_Internacional: "",
      IVA_Frontera: "",
      TUA_Nacional: "",
      TUA_Internacional: "",
      Cargos_por_vuelo_internacional: "",
      Derechos_por_servicios_migratorios: "",
      Fecha_ultima_modificacion: null,
      Hora_ultima_modificacion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromIVA_Nacional: "",
      toIVA_Nacional: "",
      fromIVA_Internacional: "",
      toIVA_Internacional: "",
      fromIVA_Frontera: "",
      toIVA_Frontera: "",
      fromTUA_Nacional: "",
      toTUA_Nacional: "",
      fromTUA_Internacional: "",
      toTUA_Internacional: "",
      fromCargos_por_vuelo_internacional: "",
      toCargos_por_vuelo_internacional: "",
      fromDerechos_por_servicios_migratorios: "",
      toDerechos_por_servicios_migratorios: "",
      fromFecha_ultima_modificacion: "",
      toFecha_ultima_modificacion: "",
      fromHora_ultima_modificacion: "",
      toHora_ultima_modificacion: "",

    }
  };

  dataSource: ImpuestosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: ImpuestosDataSource;
  dataClipboard: any;

  constructor(
    private _ImpuestosService: ImpuestosService,
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
    this.dataSource = new ImpuestosDataSource(
      this._ImpuestosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Impuestos)
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
    this.listConfig.filter.IVA_Nacional = "";
    this.listConfig.filter.IVA_Internacional = "";
    this.listConfig.filter.IVA_Frontera = "";
    this.listConfig.filter.TUA_Nacional = "";
    this.listConfig.filter.TUA_Internacional = "";
    this.listConfig.filter.Cargos_por_vuelo_internacional = "";
    this.listConfig.filter.Derechos_por_servicios_migratorios = "";
    this.listConfig.filter.Fecha_ultima_modificacion = undefined;
    this.listConfig.filter.Hora_ultima_modificacion = "";

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

  remove(row: Impuestos) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._ImpuestosService
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
  ActionPrint(dataRow: Impuestos) {

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
,'IVA Nacional %'
,'IVA Internacional %'
,'IVA Frontera %'
,'TUA Nacional'
,'TUA Internacional'
,'Cargos por vuelo internacional %'
,'Derechos por servicios migratorios'
,'Fecha última modificación'
,'Hora última modificación'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.IVA_Nacional
,x.IVA_Internacional
,x.IVA_Frontera
,x.TUA_Nacional
,x.TUA_Internacional
,x.Cargos_por_vuelo_internacional
,x.Derechos_por_servicios_migratorios
,x.Fecha_ultima_modificacion
,x.Hora_ultima_modificacion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Impuestos.pdf');
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
          this._ImpuestosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Impuestoss;
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
          this._ImpuestosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Impuestoss;
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
        'IVA Nacional % ': fields.IVA_Nacional,
        'IVA Internacional % ': fields.IVA_Internacional,
        'IVA Frontera % ': fields.IVA_Frontera,
        'TUA Nacional ': fields.TUA_Nacional,
        'TUA Internacional ': fields.TUA_Internacional,
        'Cargos por vuelo internacional % ': fields.Cargos_por_vuelo_internacional,
        'Derechos por servicios migratorios ': fields.Derechos_por_servicios_migratorios,
        'Fecha última modificación ': fields.Fecha_ultima_modificacion ? momentJS(fields.Fecha_ultima_modificacion).format('DD/MM/YYYY') : '',
        'Hora última modificación ': fields.Hora_ultima_modificacion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Impuestos  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      IVA_Nacional: x.IVA_Nacional,
      IVA_Internacional: x.IVA_Internacional,
      IVA_Frontera: x.IVA_Frontera,
      TUA_Nacional: x.TUA_Nacional,
      TUA_Internacional: x.TUA_Internacional,
      Cargos_por_vuelo_internacional: x.Cargos_por_vuelo_internacional,
      Derechos_por_servicios_migratorios: x.Derechos_por_servicios_migratorios,
      Fecha_ultima_modificacion: x.Fecha_ultima_modificacion,
      Hora_ultima_modificacion: x.Hora_ultima_modificacion,

    }));

    this.excelService.exportToCsv(result, 'Impuestos',  ['Folio'    ,'IVA_Nacional'  ,'IVA_Internacional'  ,'IVA_Frontera'  ,'TUA_Nacional'  ,'TUA_Internacional'  ,'Cargos_por_vuelo_internacional'  ,'Derechos_por_servicios_migratorios'  ,'Fecha_ultima_modificacion'  ,'Hora_ultima_modificacion' ]);
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
    template += '          <th>IVA Nacional %</th>';
    template += '          <th>IVA Internacional %</th>';
    template += '          <th>IVA Frontera %</th>';
    template += '          <th>TUA Nacional</th>';
    template += '          <th>TUA Internacional</th>';
    template += '          <th>Cargos por vuelo internacional %</th>';
    template += '          <th>Derechos por servicios migratorios</th>';
    template += '          <th>Fecha última modificación</th>';
    template += '          <th>Hora última modificación</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.IVA_Nacional + '</td>';
      template += '          <td>' + element.IVA_Internacional + '</td>';
      template += '          <td>' + element.IVA_Frontera + '</td>';
      template += '          <td>' + element.TUA_Nacional + '</td>';
      template += '          <td>' + element.TUA_Internacional + '</td>';
      template += '          <td>' + element.Cargos_por_vuelo_internacional + '</td>';
      template += '          <td>' + element.Derechos_por_servicios_migratorios + '</td>';
      template += '          <td>' + element.Fecha_ultima_modificacion + '</td>';
      template += '          <td>' + element.Hora_ultima_modificacion + '</td>';
		  
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
	template += '\t IVA Nacional %';
	template += '\t IVA Internacional %';
	template += '\t IVA Frontera %';
	template += '\t TUA Nacional';
	template += '\t TUA Internacional';
	template += '\t Cargos por vuelo internacional %';
	template += '\t Derechos por servicios migratorios';
	template += '\t Fecha última modificación';
	template += '\t Hora última modificación';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.IVA_Nacional;
	  template += '\t ' + element.IVA_Internacional;
	  template += '\t ' + element.IVA_Frontera;
	  template += '\t ' + element.TUA_Nacional;
	  template += '\t ' + element.TUA_Internacional;
	  template += '\t ' + element.Cargos_por_vuelo_internacional;
	  template += '\t ' + element.Derechos_por_servicios_migratorios;
	  template += '\t ' + element.Fecha_ultima_modificacion;
	  template += '\t ' + element.Hora_ultima_modificacion;

	  template += '\n';
    });

    return template;
  }

}

export class ImpuestosDataSource implements DataSource<Impuestos>
{
  private subject = new BehaviorSubject<Impuestos[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: ImpuestosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Impuestos[]> {
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
              const longest = result.Impuestoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Impuestoss);
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
      condition += " and Impuestos.Folio = " + data.filter.Folio;
    if (data.filter.IVA_Nacional != "")
      condition += " and Impuestos.IVA_Nacional = " + data.filter.IVA_Nacional;
    if (data.filter.IVA_Internacional != "")
      condition += " and Impuestos.IVA_Internacional = " + data.filter.IVA_Internacional;
    if (data.filter.IVA_Frontera != "")
      condition += " and Impuestos.IVA_Frontera = " + data.filter.IVA_Frontera;
    if (data.filter.TUA_Nacional != "")
      condition += " and Impuestos.TUA_Nacional = " + data.filter.TUA_Nacional;
    if (data.filter.TUA_Internacional != "")
      condition += " and Impuestos.TUA_Internacional = " + data.filter.TUA_Internacional;
    if (data.filter.Cargos_por_vuelo_internacional != "")
      condition += " and Impuestos.Cargos_por_vuelo_internacional = " + data.filter.Cargos_por_vuelo_internacional;
    if (data.filter.Derechos_por_servicios_migratorios != "")
      condition += " and Impuestos.Derechos_por_servicios_migratorios = " + data.filter.Derechos_por_servicios_migratorios;
    if (data.filter.Fecha_ultima_modificacion)
      condition += " and CONVERT(VARCHAR(10), Impuestos.Fecha_ultima_modificacion, 102)  = '" + moment(data.filter.Fecha_ultima_modificacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_ultima_modificacion != "")
      condition += " and Impuestos.Hora_ultima_modificacion = '" + data.filter.Hora_ultima_modificacion + "'";

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
        sort = " Impuestos.Folio " + data.sortDirecction;
        break;
      case "IVA_Nacional":
        sort = " Impuestos.IVA_Nacional " + data.sortDirecction;
        break;
      case "IVA_Internacional":
        sort = " Impuestos.IVA_Internacional " + data.sortDirecction;
        break;
      case "IVA_Frontera":
        sort = " Impuestos.IVA_Frontera " + data.sortDirecction;
        break;
      case "TUA_Nacional":
        sort = " Impuestos.TUA_Nacional " + data.sortDirecction;
        break;
      case "TUA_Internacional":
        sort = " Impuestos.TUA_Internacional " + data.sortDirecction;
        break;
      case "Cargos_por_vuelo_internacional":
        sort = " Impuestos.Cargos_por_vuelo_internacional " + data.sortDirecction;
        break;
      case "Derechos_por_servicios_migratorios":
        sort = " Impuestos.Derechos_por_servicios_migratorios " + data.sortDirecction;
        break;
      case "Fecha_ultima_modificacion":
        sort = " Impuestos.Fecha_ultima_modificacion " + data.sortDirecction;
        break;
      case "Hora_ultima_modificacion":
        sort = " Impuestos.Hora_ultima_modificacion " + data.sortDirecction;
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
        condition += " AND Impuestos.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Impuestos.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromIVA_Nacional != 'undefined' && data.filterAdvanced.fromIVA_Nacional)
	|| (typeof data.filterAdvanced.toIVA_Nacional != 'undefined' && data.filterAdvanced.toIVA_Nacional)) 
	{
      if (typeof data.filterAdvanced.fromIVA_Nacional != 'undefined' && data.filterAdvanced.fromIVA_Nacional)
        condition += " AND Impuestos.IVA_Nacional >= " + data.filterAdvanced.fromIVA_Nacional;

      if (typeof data.filterAdvanced.toIVA_Nacional != 'undefined' && data.filterAdvanced.toIVA_Nacional) 
        condition += " AND Impuestos.IVA_Nacional <= " + data.filterAdvanced.toIVA_Nacional;
    }
    if ((typeof data.filterAdvanced.fromIVA_Internacional != 'undefined' && data.filterAdvanced.fromIVA_Internacional)
	|| (typeof data.filterAdvanced.toIVA_Internacional != 'undefined' && data.filterAdvanced.toIVA_Internacional)) 
	{
      if (typeof data.filterAdvanced.fromIVA_Internacional != 'undefined' && data.filterAdvanced.fromIVA_Internacional)
        condition += " AND Impuestos.IVA_Internacional >= " + data.filterAdvanced.fromIVA_Internacional;

      if (typeof data.filterAdvanced.toIVA_Internacional != 'undefined' && data.filterAdvanced.toIVA_Internacional) 
        condition += " AND Impuestos.IVA_Internacional <= " + data.filterAdvanced.toIVA_Internacional;
    }
    if ((typeof data.filterAdvanced.fromIVA_Frontera != 'undefined' && data.filterAdvanced.fromIVA_Frontera)
	|| (typeof data.filterAdvanced.toIVA_Frontera != 'undefined' && data.filterAdvanced.toIVA_Frontera)) 
	{
      if (typeof data.filterAdvanced.fromIVA_Frontera != 'undefined' && data.filterAdvanced.fromIVA_Frontera)
        condition += " AND Impuestos.IVA_Frontera >= " + data.filterAdvanced.fromIVA_Frontera;

      if (typeof data.filterAdvanced.toIVA_Frontera != 'undefined' && data.filterAdvanced.toIVA_Frontera) 
        condition += " AND Impuestos.IVA_Frontera <= " + data.filterAdvanced.toIVA_Frontera;
    }
    if ((typeof data.filterAdvanced.fromTUA_Nacional != 'undefined' && data.filterAdvanced.fromTUA_Nacional)
	|| (typeof data.filterAdvanced.toTUA_Nacional != 'undefined' && data.filterAdvanced.toTUA_Nacional)) 
	{
      if (typeof data.filterAdvanced.fromTUA_Nacional != 'undefined' && data.filterAdvanced.fromTUA_Nacional)
        condition += " AND Impuestos.TUA_Nacional >= " + data.filterAdvanced.fromTUA_Nacional;

      if (typeof data.filterAdvanced.toTUA_Nacional != 'undefined' && data.filterAdvanced.toTUA_Nacional) 
        condition += " AND Impuestos.TUA_Nacional <= " + data.filterAdvanced.toTUA_Nacional;
    }
    if ((typeof data.filterAdvanced.fromTUA_Internacional != 'undefined' && data.filterAdvanced.fromTUA_Internacional)
	|| (typeof data.filterAdvanced.toTUA_Internacional != 'undefined' && data.filterAdvanced.toTUA_Internacional)) 
	{
      if (typeof data.filterAdvanced.fromTUA_Internacional != 'undefined' && data.filterAdvanced.fromTUA_Internacional)
        condition += " AND Impuestos.TUA_Internacional >= " + data.filterAdvanced.fromTUA_Internacional;

      if (typeof data.filterAdvanced.toTUA_Internacional != 'undefined' && data.filterAdvanced.toTUA_Internacional) 
        condition += " AND Impuestos.TUA_Internacional <= " + data.filterAdvanced.toTUA_Internacional;
    }
    if ((typeof data.filterAdvanced.fromCargos_por_vuelo_internacional != 'undefined' && data.filterAdvanced.fromCargos_por_vuelo_internacional)
	|| (typeof data.filterAdvanced.toCargos_por_vuelo_internacional != 'undefined' && data.filterAdvanced.toCargos_por_vuelo_internacional)) 
	{
      if (typeof data.filterAdvanced.fromCargos_por_vuelo_internacional != 'undefined' && data.filterAdvanced.fromCargos_por_vuelo_internacional)
        condition += " AND Impuestos.Cargos_por_vuelo_internacional >= " + data.filterAdvanced.fromCargos_por_vuelo_internacional;

      if (typeof data.filterAdvanced.toCargos_por_vuelo_internacional != 'undefined' && data.filterAdvanced.toCargos_por_vuelo_internacional) 
        condition += " AND Impuestos.Cargos_por_vuelo_internacional <= " + data.filterAdvanced.toCargos_por_vuelo_internacional;
    }
    if ((typeof data.filterAdvanced.fromDerechos_por_servicios_migratorios != 'undefined' && data.filterAdvanced.fromDerechos_por_servicios_migratorios)
	|| (typeof data.filterAdvanced.toDerechos_por_servicios_migratorios != 'undefined' && data.filterAdvanced.toDerechos_por_servicios_migratorios)) 
	{
      if (typeof data.filterAdvanced.fromDerechos_por_servicios_migratorios != 'undefined' && data.filterAdvanced.fromDerechos_por_servicios_migratorios)
        condition += " AND Impuestos.Derechos_por_servicios_migratorios >= " + data.filterAdvanced.fromDerechos_por_servicios_migratorios;

      if (typeof data.filterAdvanced.toDerechos_por_servicios_migratorios != 'undefined' && data.filterAdvanced.toDerechos_por_servicios_migratorios) 
        condition += " AND Impuestos.Derechos_por_servicios_migratorios <= " + data.filterAdvanced.toDerechos_por_servicios_migratorios;
    }
    if ((typeof data.filterAdvanced.fromFecha_ultima_modificacion != 'undefined' && data.filterAdvanced.fromFecha_ultima_modificacion)
	|| (typeof data.filterAdvanced.toFecha_ultima_modificacion != 'undefined' && data.filterAdvanced.toFecha_ultima_modificacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_ultima_modificacion != 'undefined' && data.filterAdvanced.fromFecha_ultima_modificacion) 
        condition += " and CONVERT(VARCHAR(10), Impuestos.Fecha_ultima_modificacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_ultima_modificacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_ultima_modificacion != 'undefined' && data.filterAdvanced.toFecha_ultima_modificacion) 
        condition += " and CONVERT(VARCHAR(10), Impuestos.Fecha_ultima_modificacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_ultima_modificacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_ultima_modificacion != 'undefined' && data.filterAdvanced.fromHora_ultima_modificacion)
	|| (typeof data.filterAdvanced.toHora_ultima_modificacion != 'undefined' && data.filterAdvanced.toHora_ultima_modificacion)) 
	{
		if (typeof data.filterAdvanced.fromHora_ultima_modificacion != 'undefined' && data.filterAdvanced.fromHora_ultima_modificacion) 
			condition += " and Impuestos.Hora_ultima_modificacion >= '" + data.filterAdvanced.fromHora_ultima_modificacion + "'";
      
		if (typeof data.filterAdvanced.toHora_ultima_modificacion != 'undefined' && data.filterAdvanced.toHora_ultima_modificacion) 
			condition += " and Impuestos.Hora_ultima_modificacion <= '" + data.filterAdvanced.toHora_ultima_modificacion + "'";
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
              const longest = result.Impuestoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Impuestoss);
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
