import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Husos_de_horariosService } from "src/app/api-services/Husos_de_horarios.service";
import { Husos_de_horarios } from "src/app/models/Husos_de_horarios";
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
import { Husos_de_horariosIndexRules } from 'src/app/shared/businessRules/Husos_de_horarios-index-rules';
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
  selector: "app-list-Husos_de_horarios",
  templateUrl: "./list-Husos_de_horarios.component.html",
  styleUrls: ["./list-Husos_de_horarios.component.scss"],
})
export class ListHusos_de_horariosComponent extends Husos_de_horariosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Ano",
    "Fecha_inicio_horario_verano",
    "Fecha_fin_horario_verano",
    "Diferencia_hora_verano",
    "Fecha_inicio_horario_invierno",
    "Fecha_fin_horario_invierno",
    "Diferencia_hora_invierno",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Ano",
      "Fecha_inicio_horario_verano",
      "Fecha_fin_horario_verano",
      "Diferencia_hora_verano",
      "Fecha_inicio_horario_invierno",
      "Fecha_fin_horario_invierno",
      "Diferencia_hora_invierno",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Ano_filtro",
      "Fecha_inicio_horario_verano_filtro",
      "Fecha_fin_horario_verano_filtro",
      "Diferencia_hora_verano_filtro",
      "Fecha_inicio_horario_invierno_filtro",
      "Fecha_fin_horario_invierno_filtro",
      "Diferencia_hora_invierno_filtro",

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
      Ano: "",
      Fecha_inicio_horario_verano: null,
      Fecha_fin_horario_verano: null,
      Diferencia_hora_verano: "",
      Fecha_inicio_horario_invierno: null,
      Fecha_fin_horario_invierno: null,
      Diferencia_hora_invierno: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromAno: "",
      toAno: "",
      fromFecha_inicio_horario_verano: "",
      toFecha_inicio_horario_verano: "",
      fromFecha_fin_horario_verano: "",
      toFecha_fin_horario_verano: "",
      fromDiferencia_hora_verano: "",
      toDiferencia_hora_verano: "",
      fromFecha_inicio_horario_invierno: "",
      toFecha_inicio_horario_invierno: "",
      fromFecha_fin_horario_invierno: "",
      toFecha_fin_horario_invierno: "",
      fromDiferencia_hora_invierno: "",
      toDiferencia_hora_invierno: "",

    }
  };

  dataSource: Husos_de_horariosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Husos_de_horariosDataSource;
  dataClipboard: any;

  constructor(
    private _Husos_de_horariosService: Husos_de_horariosService,
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
    this.dataSource = new Husos_de_horariosDataSource(
      this._Husos_de_horariosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Husos_de_horarios)
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
    this.listConfig.filter.Ano = "";
    this.listConfig.filter.Fecha_inicio_horario_verano = undefined;
    this.listConfig.filter.Fecha_fin_horario_verano = undefined;
    this.listConfig.filter.Diferencia_hora_verano = "";
    this.listConfig.filter.Fecha_inicio_horario_invierno = undefined;
    this.listConfig.filter.Fecha_fin_horario_invierno = undefined;
    this.listConfig.filter.Diferencia_hora_invierno = "";

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

  remove(row: Husos_de_horarios) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Husos_de_horariosService
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
  ActionPrint(dataRow: Husos_de_horarios) {

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
,'Año'
,'Fecha inicio horario verano'
,'Fecha fin horario verano'
,'Diferencia hora verano'
,'Fecha inicio horario invierno'
,'Fecha fin horario invierno'
,'Diferencia hora invierno'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Ano
,x.Fecha_inicio_horario_verano
,x.Fecha_fin_horario_verano
,x.Diferencia_hora_verano
,x.Fecha_inicio_horario_invierno
,x.Fecha_fin_horario_invierno
,x.Diferencia_hora_invierno
		  
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
    pdfMake.createPdf(pdfDefinition).download('Husos_de_horarios.pdf');
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
          this._Husos_de_horariosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Husos_de_horarioss;
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
          this._Husos_de_horariosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Husos_de_horarioss;
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
        'Año ': fields.Ano,
        'Fecha inicio horario verano ': fields.Fecha_inicio_horario_verano ? momentJS(fields.Fecha_inicio_horario_verano).format('DD/MM/YYYY') : '',
        'Fecha fin horario verano ': fields.Fecha_fin_horario_verano ? momentJS(fields.Fecha_fin_horario_verano).format('DD/MM/YYYY') : '',
        'Diferencia hora verano ': fields.Diferencia_hora_verano,
        'Fecha inicio horario invierno ': fields.Fecha_inicio_horario_invierno ? momentJS(fields.Fecha_inicio_horario_invierno).format('DD/MM/YYYY') : '',
        'Fecha fin horario invierno ': fields.Fecha_fin_horario_invierno ? momentJS(fields.Fecha_fin_horario_invierno).format('DD/MM/YYYY') : '',
        'Diferencia hora invierno ': fields.Diferencia_hora_invierno,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Husos_de_horarios  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Ano: x.Ano,
      Fecha_inicio_horario_verano: x.Fecha_inicio_horario_verano,
      Fecha_fin_horario_verano: x.Fecha_fin_horario_verano,
      Diferencia_hora_verano: x.Diferencia_hora_verano,
      Fecha_inicio_horario_invierno: x.Fecha_inicio_horario_invierno,
      Fecha_fin_horario_invierno: x.Fecha_fin_horario_invierno,
      Diferencia_hora_invierno: x.Diferencia_hora_invierno,

    }));

    this.excelService.exportToCsv(result, 'Husos_de_horarios',  ['Folio'    ,'Ano'  ,'Fecha_inicio_horario_verano'  ,'Fecha_fin_horario_verano'  ,'Diferencia_hora_verano'  ,'Fecha_inicio_horario_invierno'  ,'Fecha_fin_horario_invierno'  ,'Diferencia_hora_invierno' ]);
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
    template += '          <th>Año</th>';
    template += '          <th>Fecha inicio horario verano</th>';
    template += '          <th>Fecha fin horario verano</th>';
    template += '          <th>Diferencia hora verano</th>';
    template += '          <th>Fecha inicio horario invierno</th>';
    template += '          <th>Fecha fin horario invierno</th>';
    template += '          <th>Diferencia hora invierno</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Ano + '</td>';
      template += '          <td>' + element.Fecha_inicio_horario_verano + '</td>';
      template += '          <td>' + element.Fecha_fin_horario_verano + '</td>';
      template += '          <td>' + element.Diferencia_hora_verano + '</td>';
      template += '          <td>' + element.Fecha_inicio_horario_invierno + '</td>';
      template += '          <td>' + element.Fecha_fin_horario_invierno + '</td>';
      template += '          <td>' + element.Diferencia_hora_invierno + '</td>';
		  
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
	template += '\t Año';
	template += '\t Fecha inicio horario verano';
	template += '\t Fecha fin horario verano';
	template += '\t Diferencia hora verano';
	template += '\t Fecha inicio horario invierno';
	template += '\t Fecha fin horario invierno';
	template += '\t Diferencia hora invierno';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Ano;
	  template += '\t ' + element.Fecha_inicio_horario_verano;
	  template += '\t ' + element.Fecha_fin_horario_verano;
	  template += '\t ' + element.Diferencia_hora_verano;
	  template += '\t ' + element.Fecha_inicio_horario_invierno;
	  template += '\t ' + element.Fecha_fin_horario_invierno;
	  template += '\t ' + element.Diferencia_hora_invierno;

	  template += '\n';
    });

    return template;
  }

}

export class Husos_de_horariosDataSource implements DataSource<Husos_de_horarios>
{
  private subject = new BehaviorSubject<Husos_de_horarios[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Husos_de_horariosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Husos_de_horarios[]> {
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
              const longest = result.Husos_de_horarioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Husos_de_horarioss);
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
      condition += " and Husos_de_horarios.Folio = " + data.filter.Folio;
    if (data.filter.Ano != "")
      condition += " and Husos_de_horarios.Ano = " + data.filter.Ano;
    if (data.filter.Fecha_inicio_horario_verano)
      condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_inicio_horario_verano, 102)  = '" + moment(data.filter.Fecha_inicio_horario_verano).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_fin_horario_verano)
      condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_fin_horario_verano, 102)  = '" + moment(data.filter.Fecha_fin_horario_verano).format("YYYY.MM.DD") + "'";
    if (data.filter.Diferencia_hora_verano != "")
      condition += " and Husos_de_horarios.Diferencia_hora_verano = " + data.filter.Diferencia_hora_verano;
    if (data.filter.Fecha_inicio_horario_invierno)
      condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_inicio_horario_invierno, 102)  = '" + moment(data.filter.Fecha_inicio_horario_invierno).format("YYYY.MM.DD") + "'";
    if (data.filter.Fecha_fin_horario_invierno)
      condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_fin_horario_invierno, 102)  = '" + moment(data.filter.Fecha_fin_horario_invierno).format("YYYY.MM.DD") + "'";
    if (data.filter.Diferencia_hora_invierno != "")
      condition += " and Husos_de_horarios.Diferencia_hora_invierno = " + data.filter.Diferencia_hora_invierno;

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
        sort = " Husos_de_horarios.Folio " + data.sortDirecction;
        break;
      case "Ano":
        sort = " Husos_de_horarios.Ano " + data.sortDirecction;
        break;
      case "Fecha_inicio_horario_verano":
        sort = " Husos_de_horarios.Fecha_inicio_horario_verano " + data.sortDirecction;
        break;
      case "Fecha_fin_horario_verano":
        sort = " Husos_de_horarios.Fecha_fin_horario_verano " + data.sortDirecction;
        break;
      case "Diferencia_hora_verano":
        sort = " Husos_de_horarios.Diferencia_hora_verano " + data.sortDirecction;
        break;
      case "Fecha_inicio_horario_invierno":
        sort = " Husos_de_horarios.Fecha_inicio_horario_invierno " + data.sortDirecction;
        break;
      case "Fecha_fin_horario_invierno":
        sort = " Husos_de_horarios.Fecha_fin_horario_invierno " + data.sortDirecction;
        break;
      case "Diferencia_hora_invierno":
        sort = " Husos_de_horarios.Diferencia_hora_invierno " + data.sortDirecction;
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
        condition += " AND Husos_de_horarios.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Husos_de_horarios.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromAno != 'undefined' && data.filterAdvanced.fromAno)
	|| (typeof data.filterAdvanced.toAno != 'undefined' && data.filterAdvanced.toAno)) 
	{
      if (typeof data.filterAdvanced.fromAno != 'undefined' && data.filterAdvanced.fromAno)
        condition += " AND Husos_de_horarios.Ano >= " + data.filterAdvanced.fromAno;

      if (typeof data.filterAdvanced.toAno != 'undefined' && data.filterAdvanced.toAno) 
        condition += " AND Husos_de_horarios.Ano <= " + data.filterAdvanced.toAno;
    }
    if ((typeof data.filterAdvanced.fromFecha_inicio_horario_verano != 'undefined' && data.filterAdvanced.fromFecha_inicio_horario_verano)
	|| (typeof data.filterAdvanced.toFecha_inicio_horario_verano != 'undefined' && data.filterAdvanced.toFecha_inicio_horario_verano)) 
	{
      if (typeof data.filterAdvanced.fromFecha_inicio_horario_verano != 'undefined' && data.filterAdvanced.fromFecha_inicio_horario_verano) 
        condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_inicio_horario_verano, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_inicio_horario_verano).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_inicio_horario_verano != 'undefined' && data.filterAdvanced.toFecha_inicio_horario_verano) 
        condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_inicio_horario_verano, 102)  <= '" + moment(data.filterAdvanced.toFecha_inicio_horario_verano).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_fin_horario_verano != 'undefined' && data.filterAdvanced.fromFecha_fin_horario_verano)
	|| (typeof data.filterAdvanced.toFecha_fin_horario_verano != 'undefined' && data.filterAdvanced.toFecha_fin_horario_verano)) 
	{
      if (typeof data.filterAdvanced.fromFecha_fin_horario_verano != 'undefined' && data.filterAdvanced.fromFecha_fin_horario_verano) 
        condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_fin_horario_verano, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_fin_horario_verano).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_fin_horario_verano != 'undefined' && data.filterAdvanced.toFecha_fin_horario_verano) 
        condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_fin_horario_verano, 102)  <= '" + moment(data.filterAdvanced.toFecha_fin_horario_verano).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromDiferencia_hora_verano != 'undefined' && data.filterAdvanced.fromDiferencia_hora_verano)
	|| (typeof data.filterAdvanced.toDiferencia_hora_verano != 'undefined' && data.filterAdvanced.toDiferencia_hora_verano)) 
	{
      if (typeof data.filterAdvanced.fromDiferencia_hora_verano != 'undefined' && data.filterAdvanced.fromDiferencia_hora_verano)
        condition += " AND Husos_de_horarios.Diferencia_hora_verano >= " + data.filterAdvanced.fromDiferencia_hora_verano;

      if (typeof data.filterAdvanced.toDiferencia_hora_verano != 'undefined' && data.filterAdvanced.toDiferencia_hora_verano) 
        condition += " AND Husos_de_horarios.Diferencia_hora_verano <= " + data.filterAdvanced.toDiferencia_hora_verano;
    }
    if ((typeof data.filterAdvanced.fromFecha_inicio_horario_invierno != 'undefined' && data.filterAdvanced.fromFecha_inicio_horario_invierno)
	|| (typeof data.filterAdvanced.toFecha_inicio_horario_invierno != 'undefined' && data.filterAdvanced.toFecha_inicio_horario_invierno)) 
	{
      if (typeof data.filterAdvanced.fromFecha_inicio_horario_invierno != 'undefined' && data.filterAdvanced.fromFecha_inicio_horario_invierno) 
        condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_inicio_horario_invierno, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_inicio_horario_invierno).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_inicio_horario_invierno != 'undefined' && data.filterAdvanced.toFecha_inicio_horario_invierno) 
        condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_inicio_horario_invierno, 102)  <= '" + moment(data.filterAdvanced.toFecha_inicio_horario_invierno).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_fin_horario_invierno != 'undefined' && data.filterAdvanced.fromFecha_fin_horario_invierno)
	|| (typeof data.filterAdvanced.toFecha_fin_horario_invierno != 'undefined' && data.filterAdvanced.toFecha_fin_horario_invierno)) 
	{
      if (typeof data.filterAdvanced.fromFecha_fin_horario_invierno != 'undefined' && data.filterAdvanced.fromFecha_fin_horario_invierno) 
        condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_fin_horario_invierno, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_fin_horario_invierno).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_fin_horario_invierno != 'undefined' && data.filterAdvanced.toFecha_fin_horario_invierno) 
        condition += " and CONVERT(VARCHAR(10), Husos_de_horarios.Fecha_fin_horario_invierno, 102)  <= '" + moment(data.filterAdvanced.toFecha_fin_horario_invierno).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromDiferencia_hora_invierno != 'undefined' && data.filterAdvanced.fromDiferencia_hora_invierno)
	|| (typeof data.filterAdvanced.toDiferencia_hora_invierno != 'undefined' && data.filterAdvanced.toDiferencia_hora_invierno)) 
	{
      if (typeof data.filterAdvanced.fromDiferencia_hora_invierno != 'undefined' && data.filterAdvanced.fromDiferencia_hora_invierno)
        condition += " AND Husos_de_horarios.Diferencia_hora_invierno >= " + data.filterAdvanced.fromDiferencia_hora_invierno;

      if (typeof data.filterAdvanced.toDiferencia_hora_invierno != 'undefined' && data.filterAdvanced.toDiferencia_hora_invierno) 
        condition += " AND Husos_de_horarios.Diferencia_hora_invierno <= " + data.filterAdvanced.toDiferencia_hora_invierno;
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
              const longest = result.Husos_de_horarioss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Husos_de_horarioss);
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
