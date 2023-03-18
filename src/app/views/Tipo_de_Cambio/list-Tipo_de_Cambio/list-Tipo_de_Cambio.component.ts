import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Tipo_de_CambioService } from "src/app/api-services/Tipo_de_Cambio.service";
import { Tipo_de_Cambio } from "src/app/models/Tipo_de_Cambio";
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
import { Tipo_de_CambioIndexRules } from 'src/app/shared/businessRules/Tipo_de_Cambio-index-rules';
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
  selector: "app-list-Tipo_de_Cambio",
  templateUrl: "./list-Tipo_de_Cambio.component.html",
  styleUrls: ["./list-Tipo_de_Cambio.component.scss"],
})
export class ListTipo_de_CambioComponent extends Tipo_de_CambioIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Clave",
    "Fecha",
    "T_C__USD",
    "T_C__EUR",
    "T_C__LIBRA",
    "T_C__CAD",
    "Fecha_de_Edicion",
    "Hora_de_Edicion",
    "Usuario_que_Edita",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Fecha",
      "T_C__USD",
      "T_C__EUR",
      "T_C__LIBRA",
      "T_C__CAD",
      "Fecha_de_Edicion",
      "Hora_de_Edicion",
      "Usuario_que_Edita",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Fecha_filtro",
      "T_C__USD_filtro",
      "T_C__EUR_filtro",
      "T_C__LIBRA_filtro",
      "T_C__CAD_filtro",
      "Fecha_de_Edicion_filtro",
      "Hora_de_Edicion_filtro",
      "Usuario_que_Edita_filtro",

    ],
    MRWhere: "",
    MRSort: "",
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Clave: "",
      Fecha: null,
      T_C__USD: "",
      T_C__EUR: "",
      T_C__LIBRA: "",
      T_C__CAD: "",
      Fecha_de_Edicion: null,
      Hora_de_Edicion: "",
      Usuario_que_Edita: "",
		
    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      fromFecha: "",
      toFecha: "",
      fromT_C__USD: "",
      toT_C__USD: "",
      fromT_C__EUR: "",
      toT_C__EUR: "",
      fromT_C__LIBRA: "",
      toT_C__LIBRA: "",
      fromT_C__CAD: "",
      toT_C__CAD: "",
      fromFecha_de_Edicion: "",
      toFecha_de_Edicion: "",
      fromHora_de_Edicion: "",
      toHora_de_Edicion: "",
      Usuario_que_EditaFilter: "",
      Usuario_que_Edita: "",
      Usuario_que_EditaMultiple: "",

    }
  };

  dataSource: Tipo_de_CambioDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Tipo_de_CambioDataSource;
  dataClipboard: any;

  constructor(
    private _Tipo_de_CambioService: Tipo_de_CambioService,
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
    this.dataSource = new Tipo_de_CambioDataSource(
      this._Tipo_de_CambioService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Tipo_de_Cambio)
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
    this.listConfig.filter.Clave = "";
    this.listConfig.filter.Fecha = undefined;
    this.listConfig.filter.T_C__USD = "";
    this.listConfig.filter.T_C__EUR = "";
    this.listConfig.filter.T_C__LIBRA = "";
    this.listConfig.filter.T_C__CAD = "";
    this.listConfig.filter.Fecha_de_Edicion = undefined;
    this.listConfig.filter.Hora_de_Edicion = "";
    this.listConfig.filter.Usuario_que_Edita = "";

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

//INICIA - BRID:404 - Ocultar columnas en pantalla "Tipo de Cambio" - Autor: Felipe Rodríguez - Actualización: 2/17/2021 3:37:31 PM
if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Fecha_de_Edicion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Fecha_de_Edicion")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Hora_de_Edicion")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Hora_de_Edicion")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Usuario_que_EditaName")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Usuario_que_EditaName")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Clave")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Clave")  }
//TERMINA - BRID:404

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

  remove(row: Tipo_de_Cambio) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Tipo_de_CambioService
          .delete(+row.Clave)
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
  ActionPrint(dataRow: Tipo_de_Cambio) {

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
'Clave'
,'Fecha'
,'T.C. USD'
,'T.C. EUR'
,'T.C. LIBRA'
,'T.C. CAD'
,'Fecha de Edición'
,'Hora de Edición'
,'Usuario que Edita'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Clave
,x.Fecha
,x.T_C__USD
,x.T_C__EUR
,x.T_C__LIBRA
,x.T_C__CAD
,x.Fecha_de_Edicion
,x.Hora_de_Edicion
,x.Usuario_que_Edita_Spartan_User.Name
		  
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
    pdfMake.createPdf(pdfDefinition).download('Tipo_de_Cambio.pdf');
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
          this._Tipo_de_CambioService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Tipo_de_Cambios;
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
          this._Tipo_de_CambioService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Tipo_de_Cambios;
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
        'Clave ': fields.Clave,
        'Fecha ': fields.Fecha ? momentJS(fields.Fecha).format('DD/MM/YYYY') : '',
        'T.C. USD ': fields.T_C__USD,
        'T.C. EUR ': fields.T_C__EUR,
        'T.C. LIBRA ': fields.T_C__LIBRA,
        'T.C. CAD ': fields.T_C__CAD,
        'Fecha de Edición ': fields.Fecha_de_Edicion ? momentJS(fields.Fecha_de_Edicion).format('DD/MM/YYYY') : '',
        'Hora de Edición ': fields.Hora_de_Edicion,
        'Usuario que Edita ': fields.Usuario_que_Edita_Spartan_User.Name,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Tipo_de_Cambio  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Clave: x.Clave,
      Fecha: x.Fecha,
      T_C__USD: x.T_C__USD,
      T_C__EUR: x.T_C__EUR,
      T_C__LIBRA: x.T_C__LIBRA,
      T_C__CAD: x.T_C__CAD,
      Fecha_de_Edicion: x.Fecha_de_Edicion,
      Hora_de_Edicion: x.Hora_de_Edicion,
      Usuario_que_Edita: x.Usuario_que_Edita_Spartan_User.Name,

    }));

    this.excelService.exportToCsv(result, 'Tipo_de_Cambio',  ['Clave'    ,'Fecha'  ,'T_C__USD'  ,'T_C__EUR'  ,'T_C__LIBRA'  ,'T_C__CAD'  ,'Fecha_de_Edicion'  ,'Hora_de_Edicion'  ,'Usuario_que_Edita' ]);
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
    template += '          <th>Clave</th>';
    template += '          <th>Fecha</th>';
    template += '          <th>T.C. USD</th>';
    template += '          <th>T.C. EUR</th>';
    template += '          <th>T.C. LIBRA</th>';
    template += '          <th>T.C. CAD</th>';
    template += '          <th>Fecha de Edición</th>';
    template += '          <th>Hora de Edición</th>';
    template += '          <th>Usuario que Edita</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Clave + '</td>';
      template += '          <td>' + element.Fecha + '</td>';
      template += '          <td>' + element.T_C__USD + '</td>';
      template += '          <td>' + element.T_C__EUR + '</td>';
      template += '          <td>' + element.T_C__LIBRA + '</td>';
      template += '          <td>' + element.T_C__CAD + '</td>';
      template += '          <td>' + element.Fecha_de_Edicion + '</td>';
      template += '          <td>' + element.Hora_de_Edicion + '</td>';
      template += '          <td>' + element.Usuario_que_Edita_Spartan_User.Name + '</td>';
		  
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
	template += '\t Clave';
	template += '\t Fecha';
	template += '\t T.C. USD';
	template += '\t T.C. EUR';
	template += '\t T.C. LIBRA';
	template += '\t T.C. CAD';
	template += '\t Fecha de Edición';
	template += '\t Hora de Edición';
	template += '\t Usuario que Edita';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Clave;
	  template += '\t ' + element.Fecha;
	  template += '\t ' + element.T_C__USD;
	  template += '\t ' + element.T_C__EUR;
	  template += '\t ' + element.T_C__LIBRA;
	  template += '\t ' + element.T_C__CAD;
	  template += '\t ' + element.Fecha_de_Edicion;
	  template += '\t ' + element.Hora_de_Edicion;
      template += '\t ' + element.Usuario_que_Edita_Spartan_User.Name;

	  template += '\n';
    });

    return template;
  }

}

export class Tipo_de_CambioDataSource implements DataSource<Tipo_de_Cambio>
{
  private subject = new BehaviorSubject<Tipo_de_Cambio[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Tipo_de_CambioService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Tipo_de_Cambio[]> {
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
          if (column === 'Clave') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Tipo_de_Cambios.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Tipo_de_Cambios);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Clave != "")
      condition += " and Tipo_de_Cambio.Clave = " + data.filter.Clave;
    if (data.filter.Fecha)
      condition += " and CONVERT(VARCHAR(10), Tipo_de_Cambio.Fecha, 102)  = '" + moment(data.filter.Fecha).format("YYYY.MM.DD") + "'";
    if (data.filter.T_C__USD != "")
      condition += " and Tipo_de_Cambio.T_C__USD = " + data.filter.T_C__USD;
    if (data.filter.T_C__EUR != "")
      condition += " and Tipo_de_Cambio.T_C__EUR = " + data.filter.T_C__EUR;
    if (data.filter.T_C__LIBRA != "")
      condition += " and Tipo_de_Cambio.T_C__LIBRA = " + data.filter.T_C__LIBRA;
    if (data.filter.T_C__CAD != "")
      condition += " and Tipo_de_Cambio.T_C__CAD = " + data.filter.T_C__CAD;
    if (data.filter.Fecha_de_Edicion)
      condition += " and CONVERT(VARCHAR(10), Tipo_de_Cambio.Fecha_de_Edicion, 102)  = '" + moment(data.filter.Fecha_de_Edicion).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Edicion != "")
      condition += " and Tipo_de_Cambio.Hora_de_Edicion = '" + data.filter.Hora_de_Edicion + "'";
    if (data.filter.Usuario_que_Edita != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Edita + "%' ";

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "Clave":
        sort = " Tipo_de_Cambio.Clave " + data.sortDirecction;
        break;
      case "Fecha":
        sort = " Tipo_de_Cambio.Fecha " + data.sortDirecction;
        break;
      case "T_C__USD":
        sort = " Tipo_de_Cambio.T_C__USD " + data.sortDirecction;
        break;
      case "T_C__EUR":
        sort = " Tipo_de_Cambio.T_C__EUR " + data.sortDirecction;
        break;
      case "T_C__LIBRA":
        sort = " Tipo_de_Cambio.T_C__LIBRA " + data.sortDirecction;
        break;
      case "T_C__CAD":
        sort = " Tipo_de_Cambio.T_C__CAD " + data.sortDirecction;
        break;
      case "Fecha_de_Edicion":
        sort = " Tipo_de_Cambio.Fecha_de_Edicion " + data.sortDirecction;
        break;
      case "Hora_de_Edicion":
        sort = " Tipo_de_Cambio.Hora_de_Edicion " + data.sortDirecction;
        break;
      case "Usuario_que_Edita":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
    if ((typeof data.filterAdvanced.fromClave != 'undefined' && data.filterAdvanced.fromClave)
	|| (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave)) 
	{
      if (typeof data.filterAdvanced.fromClave != 'undefined' && data.filterAdvanced.fromClave)
        condition += " AND Tipo_de_Cambio.Clave >= " + data.filterAdvanced.fromClave;

      if (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave) 
        condition += " AND Tipo_de_Cambio.Clave <= " + data.filterAdvanced.toClave;
    }
    if ((typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha)
	|| (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha)) 
	{
      if (typeof data.filterAdvanced.fromFecha != 'undefined' && data.filterAdvanced.fromFecha) 
        condition += " and CONVERT(VARCHAR(10), Tipo_de_Cambio.Fecha, 102)  >= '" +  moment(data.filterAdvanced.fromFecha).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha != 'undefined' && data.filterAdvanced.toFecha) 
        condition += " and CONVERT(VARCHAR(10), Tipo_de_Cambio.Fecha, 102)  <= '" + moment(data.filterAdvanced.toFecha).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromT_C__USD != 'undefined' && data.filterAdvanced.fromT_C__USD)
	|| (typeof data.filterAdvanced.toT_C__USD != 'undefined' && data.filterAdvanced.toT_C__USD)) 
	{
      if (typeof data.filterAdvanced.fromT_C__USD != 'undefined' && data.filterAdvanced.fromT_C__USD)
        condition += " AND Tipo_de_Cambio.T_C__USD >= " + data.filterAdvanced.fromT_C__USD;

      if (typeof data.filterAdvanced.toT_C__USD != 'undefined' && data.filterAdvanced.toT_C__USD) 
        condition += " AND Tipo_de_Cambio.T_C__USD <= " + data.filterAdvanced.toT_C__USD;
    }
    if ((typeof data.filterAdvanced.fromT_C__EUR != 'undefined' && data.filterAdvanced.fromT_C__EUR)
	|| (typeof data.filterAdvanced.toT_C__EUR != 'undefined' && data.filterAdvanced.toT_C__EUR)) 
	{
      if (typeof data.filterAdvanced.fromT_C__EUR != 'undefined' && data.filterAdvanced.fromT_C__EUR)
        condition += " AND Tipo_de_Cambio.T_C__EUR >= " + data.filterAdvanced.fromT_C__EUR;

      if (typeof data.filterAdvanced.toT_C__EUR != 'undefined' && data.filterAdvanced.toT_C__EUR) 
        condition += " AND Tipo_de_Cambio.T_C__EUR <= " + data.filterAdvanced.toT_C__EUR;
    }
    if ((typeof data.filterAdvanced.fromT_C__LIBRA != 'undefined' && data.filterAdvanced.fromT_C__LIBRA)
	|| (typeof data.filterAdvanced.toT_C__LIBRA != 'undefined' && data.filterAdvanced.toT_C__LIBRA)) 
	{
      if (typeof data.filterAdvanced.fromT_C__LIBRA != 'undefined' && data.filterAdvanced.fromT_C__LIBRA)
        condition += " AND Tipo_de_Cambio.T_C__LIBRA >= " + data.filterAdvanced.fromT_C__LIBRA;

      if (typeof data.filterAdvanced.toT_C__LIBRA != 'undefined' && data.filterAdvanced.toT_C__LIBRA) 
        condition += " AND Tipo_de_Cambio.T_C__LIBRA <= " + data.filterAdvanced.toT_C__LIBRA;
    }
    if ((typeof data.filterAdvanced.fromT_C__CAD != 'undefined' && data.filterAdvanced.fromT_C__CAD)
	|| (typeof data.filterAdvanced.toT_C__CAD != 'undefined' && data.filterAdvanced.toT_C__CAD)) 
	{
      if (typeof data.filterAdvanced.fromT_C__CAD != 'undefined' && data.filterAdvanced.fromT_C__CAD)
        condition += " AND Tipo_de_Cambio.T_C__CAD >= " + data.filterAdvanced.fromT_C__CAD;

      if (typeof data.filterAdvanced.toT_C__CAD != 'undefined' && data.filterAdvanced.toT_C__CAD) 
        condition += " AND Tipo_de_Cambio.T_C__CAD <= " + data.filterAdvanced.toT_C__CAD;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Edicion != 'undefined' && data.filterAdvanced.fromFecha_de_Edicion)
	|| (typeof data.filterAdvanced.toFecha_de_Edicion != 'undefined' && data.filterAdvanced.toFecha_de_Edicion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Edicion != 'undefined' && data.filterAdvanced.fromFecha_de_Edicion) 
        condition += " and CONVERT(VARCHAR(10), Tipo_de_Cambio.Fecha_de_Edicion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Edicion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Edicion != 'undefined' && data.filterAdvanced.toFecha_de_Edicion) 
        condition += " and CONVERT(VARCHAR(10), Tipo_de_Cambio.Fecha_de_Edicion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Edicion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Edicion != 'undefined' && data.filterAdvanced.fromHora_de_Edicion)
	|| (typeof data.filterAdvanced.toHora_de_Edicion != 'undefined' && data.filterAdvanced.toHora_de_Edicion)) 
	{
		if (typeof data.filterAdvanced.fromHora_de_Edicion != 'undefined' && data.filterAdvanced.fromHora_de_Edicion) 
			condition += " and Tipo_de_Cambio.Hora_de_Edicion >= '" + data.filterAdvanced.fromHora_de_Edicion + "'";
      
		if (typeof data.filterAdvanced.toHora_de_Edicion != 'undefined' && data.filterAdvanced.toHora_de_Edicion) 
			condition += " and Tipo_de_Cambio.Hora_de_Edicion <= '" + data.filterAdvanced.toHora_de_Edicion + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_Edita != 'undefined' && data.filterAdvanced.Usuario_que_Edita)) {
      switch (data.filterAdvanced.Usuario_que_EditaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_que_Edita + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Edita + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Edita + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_que_Edita + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_EditaMultiple != null && data.filterAdvanced.Usuario_que_EditaMultiple.length > 0) {
      var Usuario_que_Editads = data.filterAdvanced.Usuario_que_EditaMultiple.join(",");
      condition += " AND Tipo_de_Cambio.Usuario_que_Edita In (" + Usuario_que_Editads + ")";
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
          if (column === 'Clave') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Tipo_de_Cambios.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Tipo_de_Cambios);
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
