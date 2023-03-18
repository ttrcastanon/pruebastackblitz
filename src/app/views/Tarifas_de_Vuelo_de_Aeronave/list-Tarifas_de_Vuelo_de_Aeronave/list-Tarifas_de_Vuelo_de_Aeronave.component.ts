import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Tarifas_de_Vuelo_de_AeronaveService } from "src/app/api-services/Tarifas_de_Vuelo_de_Aeronave.service";
import { Tarifas_de_Vuelo_de_Aeronave } from "src/app/models/Tarifas_de_Vuelo_de_Aeronave";
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
import { Tarifas_de_Vuelo_de_AeronaveIndexRules } from 'src/app/shared/businessRules/Tarifas_de_Vuelo_de_Aeronave-index-rules';
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
  selector: "app-list-Tarifas_de_Vuelo_de_Aeronave",
  templateUrl: "./list-Tarifas_de_Vuelo_de_Aeronave.component.html",
  styleUrls: ["./list-Tarifas_de_Vuelo_de_Aeronave.component.scss"],
})
export class ListTarifas_de_Vuelo_de_AeronaveComponent extends Tarifas_de_Vuelo_de_AeronaveIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Matricula",
    "Tarifa_Normal",
    "Tarifa_Reducida",
    "Tarifa_en_Espera",
    "Percnota",
    "Moneda",
    "Ultima_Modificacion",
    "Hora_de_ultima_modificacion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Tarifa_Normal",
      "Tarifa_Reducida",
      "Tarifa_en_Espera",
      "Percnota",
      "Moneda",
      "Ultima_Modificacion",
      "Hora_de_ultima_modificacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Tarifa_Normal_filtro",
      "Tarifa_Reducida_filtro",
      "Tarifa_en_Espera_filtro",
      "Percnota_filtro",
      "Moneda_filtro",
      "Ultima_Modificacion_filtro",
      "Hora_de_ultima_modificacion_filtro",

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
      Tarifa_Normal: "",
      Tarifa_Reducida: "",
      Tarifa_en_Espera: "",
      Percnota: "",
      Moneda: "",
      Ultima_Modificacion: null,
      Hora_de_ultima_modificacion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      fromTarifa_Normal: "",
      toTarifa_Normal: "",
      fromTarifa_Reducida: "",
      toTarifa_Reducida: "",
      fromTarifa_en_Espera: "",
      toTarifa_en_Espera: "",
      fromPercnota: "",
      toPercnota: "",
      MonedaFilter: "",
      Moneda: "",
      MonedaMultiple: "",
      fromUltima_Modificacion: "",
      toUltima_Modificacion: "",
      fromHora_de_ultima_modificacion: "",
      toHora_de_ultima_modificacion: "",

    }
  };

  dataSource: Tarifas_de_Vuelo_de_AeronaveDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Tarifas_de_Vuelo_de_AeronaveDataSource;
  dataClipboard: any;

  constructor(
    private _Tarifas_de_Vuelo_de_AeronaveService: Tarifas_de_Vuelo_de_AeronaveService,
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
    this.dataSource = new Tarifas_de_Vuelo_de_AeronaveDataSource(
      this._Tarifas_de_Vuelo_de_AeronaveService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Tarifas_de_Vuelo_de_Aeronave)
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
    this.listConfig.filter.Tarifa_Normal = "";
    this.listConfig.filter.Tarifa_Reducida = "";
    this.listConfig.filter.Tarifa_en_Espera = "";
    this.listConfig.filter.Percnota = "";
    this.listConfig.filter.Moneda = "";
    this.listConfig.filter.Ultima_Modificacion = undefined;
    this.listConfig.filter.Hora_de_ultima_modificacion = "";

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

  remove(row: Tarifas_de_Vuelo_de_Aeronave) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Tarifas_de_Vuelo_de_AeronaveService
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
  ActionPrint(dataRow: Tarifas_de_Vuelo_de_Aeronave) {

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
,'Matricula'
,'Tarifa Normal'
,'Tarifa Reducida'
,'Tarifa en Espera'
,'Percnota'
,'Moneda'
,'Fecha de última Modificación'
,'Hora de ultima modificación'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Matricula_Aeronave.Matricula
,x.Tarifa_Normal
,x.Tarifa_Reducida
,x.Tarifa_en_Espera
,x.Percnota
,x.Moneda_Moneda.Descripcion
,x.Ultima_Modificacion
,x.Hora_de_ultima_modificacion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Tarifas_de_Vuelo_de_Aeronave.pdf');
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
          this._Tarifas_de_Vuelo_de_AeronaveService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              response.Tarifas_de_Vuelo_de_Aeronaves.forEach(e => {
                for (const p in e) {
                  if (typeof e[p] === 'object') {
                    for (const i in e[p]) {
                      if (e[p][i] == null) {
                        e[p][i] = '';
                      }
                    }
                  }
                  if (e[p] == null) {
                    e[p] = '';
                  }
                }
                
                e.Ultima_Modificacion = e.Ultima_Modificacion ? momentJS(e.Ultima_Modificacion).format('DD/MM/YYYY') : '';
    
              });
              this.dataSourceTemp = response.Tarifas_de_Vuelo_de_Aeronaves;
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
          this._Tarifas_de_Vuelo_de_AeronaveService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              response.Tarifas_de_Vuelo_de_Aeronaves.forEach(e => {
                for (const p in e) {
                  if (typeof e[p] === 'object') {
                    for (const i in e[p]) {
                      if (e[p][i] == null) {
                        e[p][i] = '';
                      }
                    }
                  }
                  if (e[p] == null) {
                    e[p] = '';
                  }
                }
                
                e.Ultima_Modificacion = e.Ultima_Modificacion ? momentJS(e.Ultima_Modificacion).format('DD/MM/YYYY') : '';
    
              });
              this.dataSourceTemp = response.Tarifas_de_Vuelo_de_Aeronaves;
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
        'Matricula ': fields.Matricula_Aeronave.Matricula,
        'Tarifa Normal ': fields.Tarifa_Normal,
        'Tarifa Reducida ': fields.Tarifa_Reducida,
        'Tarifa en Espera ': fields.Tarifa_en_Espera,
        'Percnota ': fields.Percnota,
        'Moneda ': fields.Moneda_Moneda.Descripcion,
        'Fecha de última Modificación ': fields.Ultima_Modificacion ? momentJS(fields.Ultima_Modificacion).format('DD/MM/YYYY') : '',
        'Hora de ultima modificación ': fields.Hora_de_ultima_modificacion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Tarifas_de_Vuelo_de_Aeronave  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Matricula: x.Matricula_Aeronave.Matricula,
      Tarifa_Normal: x.Tarifa_Normal,
      Tarifa_Reducida: x.Tarifa_Reducida,
      Tarifa_en_Espera: x.Tarifa_en_Espera,
      Percnota: x.Percnota,
      Moneda: x.Moneda_Moneda.Descripcion,
      Ultima_Modificacion: x.Ultima_Modificacion,
      Hora_de_ultima_modificacion: x.Hora_de_ultima_modificacion,

    }));

    this.excelService.exportToCsv(result, 'Tarifas_de_Vuelo_de_Aeronave',  ['Folio'    ,'Matricula'  ,'Tarifa_Normal'  ,'Tarifa_Reducida'  ,'Tarifa_en_Espera'  ,'Percnota'  ,'Moneda'  ,'Ultima_Modificacion'  ,'Hora_de_ultima_modificacion' ],
    ['Folio', 'Matricula', 'Tarifa Normal', 'Tarifa Reducida', 'Tarifa en Espera', 'Percnota', 'Moneda', 'Fecha de última Modificación', 'Hora de ultima modificación',]);
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
    template += '          <th>Matricula</th>';
    template += '          <th>Tarifa Normal</th>';
    template += '          <th>Tarifa Reducida</th>';
    template += '          <th>Tarifa en Espera</th>';
    template += '          <th>Percnota</th>';
    template += '          <th>Moneda</th>';
    template += '          <th>Fecha de última Modificación</th>';
    template += '          <th>Hora de ultima modificación</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Tarifa_Normal + '</td>';
      template += '          <td>' + element.Tarifa_Reducida + '</td>';
      template += '          <td>' + element.Tarifa_en_Espera + '</td>';
      template += '          <td>' + element.Percnota + '</td>';
      template += '          <td>' + element.Moneda_Moneda.Descripcion + '</td>';
      template += '          <td>' + element.Ultima_Modificacion + '</td>';
      template += '          <td>' + element.Hora_de_ultima_modificacion + '</td>';
		  
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
	template += '\t Matricula';
	template += '\t Tarifa Normal';
	template += '\t Tarifa Reducida';
	template += '\t Tarifa en Espera';
	template += '\t Percnota';
	template += '\t Moneda';
	template += '\t Fecha de última Modificación';
	template += '\t Hora de ultima modificación';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
	  template += '\t ' + element.Tarifa_Normal;
	  template += '\t ' + element.Tarifa_Reducida;
	  template += '\t ' + element.Tarifa_en_Espera;
	  template += '\t ' + element.Percnota;
      template += '\t ' + element.Moneda_Moneda.Descripcion;
	  template += '\t ' + element.Ultima_Modificacion;
	  template += '\t ' + element.Hora_de_ultima_modificacion;

	  template += '\n';
    });

    return template;
  }

}

export class Tarifas_de_Vuelo_de_AeronaveDataSource implements DataSource<Tarifas_de_Vuelo_de_Aeronave>
{
  private subject = new BehaviorSubject<Tarifas_de_Vuelo_de_Aeronave[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Tarifas_de_Vuelo_de_AeronaveService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Tarifas_de_Vuelo_de_Aeronave[]> {
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
              const longest = result.Tarifas_de_Vuelo_de_Aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Tarifas_de_Vuelo_de_Aeronaves);
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
      condition += " and Tarifas_de_Vuelo_de_Aeronave.Folio = " + data.filter.Folio;
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Tarifa_Normal != "")
      condition += " and Tarifas_de_Vuelo_de_Aeronave.Tarifa_Normal = " + data.filter.Tarifa_Normal;
    if (data.filter.Tarifa_Reducida != "")
      condition += " and Tarifas_de_Vuelo_de_Aeronave.Tarifa_Reducida = " + data.filter.Tarifa_Reducida;
    if (data.filter.Tarifa_en_Espera != "")
      condition += " and Tarifas_de_Vuelo_de_Aeronave.Tarifa_en_Espera = " + data.filter.Tarifa_en_Espera;
    if (data.filter.Percnota != "")
      condition += " and Tarifas_de_Vuelo_de_Aeronave.Percnota = " + data.filter.Percnota;
    if (data.filter.Moneda != "")
      condition += " and Moneda.Descripcion like '%" + data.filter.Moneda + "%' ";
    if (data.filter.Ultima_Modificacion)
      condition += " and CONVERT(VARCHAR(10), Tarifas_de_Vuelo_de_Aeronave.Ultima_Modificacion, 102)  = '" + moment(data.filter.Ultima_Modificacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_ultima_modificacion != "")
      condition += " and Tarifas_de_Vuelo_de_Aeronave.Hora_de_ultima_modificacion = '" + data.filter.Hora_de_ultima_modificacion + "'";

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
        sort = " Tarifas_de_Vuelo_de_Aeronave.Folio " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Tarifa_Normal":
        sort = " Tarifas_de_Vuelo_de_Aeronave.Tarifa_Normal " + data.sortDirecction;
        break;
      case "Tarifa_Reducida":
        sort = " Tarifas_de_Vuelo_de_Aeronave.Tarifa_Reducida " + data.sortDirecction;
        break;
      case "Tarifa_en_Espera":
        sort = " Tarifas_de_Vuelo_de_Aeronave.Tarifa_en_Espera " + data.sortDirecction;
        break;
      case "Percnota":
        sort = " Tarifas_de_Vuelo_de_Aeronave.Percnota " + data.sortDirecction;
        break;
      case "Moneda":
        sort = " Moneda.Descripcion " + data.sortDirecction;
        break;
      case "Ultima_Modificacion":
        sort = " Tarifas_de_Vuelo_de_Aeronave.Ultima_Modificacion " + data.sortDirecction;
        break;
      case "Hora_de_ultima_modificacion":
        sort = " Tarifas_de_Vuelo_de_Aeronave.Hora_de_ultima_modificacion " + data.sortDirecction;
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
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Folio <= " + data.filterAdvanced.toFolio;
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
      condition += " AND Tarifas_de_Vuelo_de_Aeronave.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.fromTarifa_Normal != 'undefined' && data.filterAdvanced.fromTarifa_Normal)
	|| (typeof data.filterAdvanced.toTarifa_Normal != 'undefined' && data.filterAdvanced.toTarifa_Normal)) 
	{
      if (typeof data.filterAdvanced.fromTarifa_Normal != 'undefined' && data.filterAdvanced.fromTarifa_Normal)
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Tarifa_Normal >= " + data.filterAdvanced.fromTarifa_Normal;

      if (typeof data.filterAdvanced.toTarifa_Normal != 'undefined' && data.filterAdvanced.toTarifa_Normal) 
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Tarifa_Normal <= " + data.filterAdvanced.toTarifa_Normal;
    }
    if ((typeof data.filterAdvanced.fromTarifa_Reducida != 'undefined' && data.filterAdvanced.fromTarifa_Reducida)
	|| (typeof data.filterAdvanced.toTarifa_Reducida != 'undefined' && data.filterAdvanced.toTarifa_Reducida)) 
	{
      if (typeof data.filterAdvanced.fromTarifa_Reducida != 'undefined' && data.filterAdvanced.fromTarifa_Reducida)
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Tarifa_Reducida >= " + data.filterAdvanced.fromTarifa_Reducida;

      if (typeof data.filterAdvanced.toTarifa_Reducida != 'undefined' && data.filterAdvanced.toTarifa_Reducida) 
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Tarifa_Reducida <= " + data.filterAdvanced.toTarifa_Reducida;
    }
    if ((typeof data.filterAdvanced.fromTarifa_en_Espera != 'undefined' && data.filterAdvanced.fromTarifa_en_Espera)
	|| (typeof data.filterAdvanced.toTarifa_en_Espera != 'undefined' && data.filterAdvanced.toTarifa_en_Espera)) 
	{
      if (typeof data.filterAdvanced.fromTarifa_en_Espera != 'undefined' && data.filterAdvanced.fromTarifa_en_Espera)
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Tarifa_en_Espera >= " + data.filterAdvanced.fromTarifa_en_Espera;

      if (typeof data.filterAdvanced.toTarifa_en_Espera != 'undefined' && data.filterAdvanced.toTarifa_en_Espera) 
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Tarifa_en_Espera <= " + data.filterAdvanced.toTarifa_en_Espera;
    }
    if ((typeof data.filterAdvanced.fromPercnota != 'undefined' && data.filterAdvanced.fromPercnota)
	|| (typeof data.filterAdvanced.toPercnota != 'undefined' && data.filterAdvanced.toPercnota)) 
	{
      if (typeof data.filterAdvanced.fromPercnota != 'undefined' && data.filterAdvanced.fromPercnota)
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Percnota >= " + data.filterAdvanced.fromPercnota;

      if (typeof data.filterAdvanced.toPercnota != 'undefined' && data.filterAdvanced.toPercnota) 
        condition += " AND Tarifas_de_Vuelo_de_Aeronave.Percnota <= " + data.filterAdvanced.toPercnota;
    }
    if ((typeof data.filterAdvanced.Moneda != 'undefined' && data.filterAdvanced.Moneda)) {
      switch (data.filterAdvanced.MonedaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Moneda.Descripcion LIKE '" + data.filterAdvanced.Moneda + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Moneda + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Moneda.Descripcion LIKE '%" + data.filterAdvanced.Moneda + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Moneda.Descripcion = '" + data.filterAdvanced.Moneda + "'";
          break;
      }
    } else if (data.filterAdvanced.MonedaMultiple != null && data.filterAdvanced.MonedaMultiple.length > 0) {
      var Monedads = data.filterAdvanced.MonedaMultiple.join(",");
      condition += " AND Tarifas_de_Vuelo_de_Aeronave.Moneda In (" + Monedads + ")";
    }
    if ((typeof data.filterAdvanced.fromUltima_Modificacion != 'undefined' && data.filterAdvanced.fromUltima_Modificacion)
	|| (typeof data.filterAdvanced.toUltima_Modificacion != 'undefined' && data.filterAdvanced.toUltima_Modificacion)) 
	{
      if (typeof data.filterAdvanced.fromUltima_Modificacion != 'undefined' && data.filterAdvanced.fromUltima_Modificacion) 
        condition += " and CONVERT(VARCHAR(10), Tarifas_de_Vuelo_de_Aeronave.Ultima_Modificacion, 102)  >= '" +  moment(data.filterAdvanced.fromUltima_Modificacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toUltima_Modificacion != 'undefined' && data.filterAdvanced.toUltima_Modificacion) 
        condition += " and CONVERT(VARCHAR(10), Tarifas_de_Vuelo_de_Aeronave.Ultima_Modificacion, 102)  <= '" + moment(data.filterAdvanced.toUltima_Modificacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_ultima_modificacion != 'undefined' && data.filterAdvanced.fromHora_de_ultima_modificacion)
	|| (typeof data.filterAdvanced.toHora_de_ultima_modificacion != 'undefined' && data.filterAdvanced.toHora_de_ultima_modificacion)) 
	{
		if (typeof data.filterAdvanced.fromHora_de_ultima_modificacion != 'undefined' && data.filterAdvanced.fromHora_de_ultima_modificacion) 
			condition += " and Tarifas_de_Vuelo_de_Aeronave.Hora_de_ultima_modificacion >= '" + data.filterAdvanced.fromHora_de_ultima_modificacion + "'";
      
		if (typeof data.filterAdvanced.toHora_de_ultima_modificacion != 'undefined' && data.filterAdvanced.toHora_de_ultima_modificacion) 
			condition += " and Tarifas_de_Vuelo_de_Aeronave.Hora_de_ultima_modificacion <= '" + data.filterAdvanced.toHora_de_ultima_modificacion + "'";
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
              const longest = result.Tarifas_de_Vuelo_de_Aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Tarifas_de_Vuelo_de_Aeronaves);
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
