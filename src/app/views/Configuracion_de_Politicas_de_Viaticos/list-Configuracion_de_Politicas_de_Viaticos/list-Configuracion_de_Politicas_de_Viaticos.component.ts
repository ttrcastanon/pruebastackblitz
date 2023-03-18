import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Configuracion_de_Politicas_de_ViaticosService } from "src/app/api-services/Configuracion_de_Politicas_de_Viaticos.service";
import { Configuracion_de_Politicas_de_Viaticos } from "src/app/models/Configuracion_de_Politicas_de_Viaticos";
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
import { Configuracion_de_Politicas_de_ViaticosIndexRules } from 'src/app/shared/businessRules/Configuracion_de_Politicas_de_Viaticos-index-rules';
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
  selector: "app-list-Configuracion_de_Politicas_de_Viaticos",
  templateUrl: "./list-Configuracion_de_Politicas_de_Viaticos.component.html",
  styleUrls: ["./list-Configuracion_de_Politicas_de_Viaticos.component.scss"],
})
export class ListConfiguracion_de_Politicas_de_ViaticosComponent extends Configuracion_de_Politicas_de_ViaticosIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Fecha_de_Ultima_Modificacion",
    "Hora_de_Ultima_Modificacion",
    "Usuario_que_Modifica",
    "Tipo_de_vuelo",
    "Concepto",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Fecha_de_Ultima_Modificacion",
      "Hora_de_Ultima_Modificacion",
      "Usuario_que_Modifica",
      "Tipo_de_vuelo",
      "Concepto",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Fecha_de_Ultima_Modificacion_filtro",
      "Hora_de_Ultima_Modificacion_filtro",
      "Usuario_que_Modifica_filtro",
      "Tipo_de_vuelo_filtro",
      "Concepto_filtro",

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
      Fecha_de_Ultima_Modificacion: null,
      Hora_de_Ultima_Modificacion: "",
      Usuario_que_Modifica: "",
      Tipo_de_vuelo: "",
      Concepto: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromFecha_de_Ultima_Modificacion: "",
      toFecha_de_Ultima_Modificacion: "",
      fromHora_de_Ultima_Modificacion: "",
      toHora_de_Ultima_Modificacion: "",
      Usuario_que_ModificaFilter: "",
      Usuario_que_Modifica: "",
      Usuario_que_ModificaMultiple: "",
      Tipo_de_vueloFilter: "",
      Tipo_de_vuelo: "",
      Tipo_de_vueloMultiple: "",
      ConceptoFilter: "",
      Concepto: "",
      ConceptoMultiple: "",

    }
  };

  dataSource: Configuracion_de_Politicas_de_ViaticosDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Configuracion_de_Politicas_de_ViaticosDataSource;
  dataClipboard: any;

  constructor(
    private _Configuracion_de_Politicas_de_ViaticosService: Configuracion_de_Politicas_de_ViaticosService,
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
    this.dataSource = new Configuracion_de_Politicas_de_ViaticosDataSource(
      this._Configuracion_de_Politicas_de_ViaticosService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Configuracion_de_Politicas_de_Viaticos)
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
    this.listConfig.filter.Fecha_de_Ultima_Modificacion = undefined;
    this.listConfig.filter.Hora_de_Ultima_Modificacion = "";
    this.listConfig.filter.Usuario_que_Modifica = "";
    this.listConfig.filter.Tipo_de_vuelo = "";
    this.listConfig.filter.Concepto = "";

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

  remove(row: Configuracion_de_Politicas_de_Viaticos) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Configuracion_de_Politicas_de_ViaticosService
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
  ActionPrint(dataRow: Configuracion_de_Politicas_de_Viaticos) {

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
,'Fecha de Última Modificación'
,'Hora de Última Modificación'
,'Usuario que Modifica'
,'Tipo de vuelo'
,'Concepto'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Fecha_de_Ultima_Modificacion
,x.Hora_de_Ultima_Modificacion
,x.Usuario_que_Modifica_Spartan_User.Name
,x.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion
,x.Concepto_Concepto_de_Gasto_de_Empleado.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Configuracion_de_Politicas_de_Viaticos.pdf');
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
          this._Configuracion_de_Politicas_de_ViaticosService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Configuracion_de_Politicas_de_Viaticoss;
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
          this._Configuracion_de_Politicas_de_ViaticosService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Configuracion_de_Politicas_de_Viaticoss;
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
        'Fecha de Última Modificación ': fields.Fecha_de_Ultima_Modificacion ? momentJS(fields.Fecha_de_Ultima_Modificacion).format('DD/MM/YYYY') : '',
        'Hora de Última Modificación ': fields.Hora_de_Ultima_Modificacion,
        'Usuario que Modifica ': fields.Usuario_que_Modifica_Spartan_User.Name,
        'Tipo de vuelo ': fields.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion,
        'Concepto ': fields.Concepto_Concepto_de_Gasto_de_Empleado.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Configuracion_de_Politicas_de_Viaticos  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Fecha_de_Ultima_Modificacion: x.Fecha_de_Ultima_Modificacion,
      Hora_de_Ultima_Modificacion: x.Hora_de_Ultima_Modificacion,
      Usuario_que_Modifica: x.Usuario_que_Modifica_Spartan_User.Name,
      Tipo_de_vuelo: x.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion,
      Concepto: x.Concepto_Concepto_de_Gasto_de_Empleado.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Configuracion_de_Politicas_de_Viaticos',  ['Folio'    ,'Fecha_de_Ultima_Modificacion'  ,'Hora_de_Ultima_Modificacion'  ,'Usuario_que_Modifica'  ,'Tipo_de_vuelo'  ,'Concepto' ]);
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
    template += '          <th>Fecha de Última Modificación</th>';
    template += '          <th>Hora de Última Modificación</th>';
    template += '          <th>Usuario que Modifica</th>';
    template += '          <th>Tipo de vuelo</th>';
    template += '          <th>Concepto</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Fecha_de_Ultima_Modificacion + '</td>';
      template += '          <td>' + element.Hora_de_Ultima_Modificacion + '</td>';
      template += '          <td>' + element.Usuario_que_Modifica_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion + '</td>';
      template += '          <td>' + element.Concepto_Concepto_de_Gasto_de_Empleado.Descripcion + '</td>';
		  
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
	template += '\t Fecha de Última Modificación';
	template += '\t Hora de Última Modificación';
	template += '\t Usuario que Modifica';
	template += '\t Tipo de vuelo';
	template += '\t Concepto';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.Fecha_de_Ultima_Modificacion;
	  template += '\t ' + element.Hora_de_Ultima_Modificacion;
      template += '\t ' + element.Usuario_que_Modifica_Spartan_User.Name;
      template += '\t ' + element.Tipo_de_vuelo_Tipo_de_vuelo.Descripcion;
      template += '\t ' + element.Concepto_Concepto_de_Gasto_de_Empleado.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Configuracion_de_Politicas_de_ViaticosDataSource implements DataSource<Configuracion_de_Politicas_de_Viaticos>
{
  private subject = new BehaviorSubject<Configuracion_de_Politicas_de_Viaticos[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Configuracion_de_Politicas_de_ViaticosService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Configuracion_de_Politicas_de_Viaticos[]> {
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
              const longest = result.Configuracion_de_Politicas_de_Viaticoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Configuracion_de_Politicas_de_Viaticoss);
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
      condition += " and Configuracion_de_Politicas_de_Viaticos.Folio = " + data.filter.Folio;
    if (data.filter.Fecha_de_Ultima_Modificacion)
      condition += " and CONVERT(VARCHAR(10), Configuracion_de_Politicas_de_Viaticos.Fecha_de_Ultima_Modificacion, 102)  = '" + moment(data.filter.Fecha_de_Ultima_Modificacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Hora_de_Ultima_Modificacion != "")
      condition += " and Configuracion_de_Politicas_de_Viaticos.Hora_de_Ultima_Modificacion = '" + data.filter.Hora_de_Ultima_Modificacion + "'";
    if (data.filter.Usuario_que_Modifica != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_Modifica + "%' ";
    if (data.filter.Tipo_de_vuelo != "")
      condition += " and Tipo_de_vuelo.Descripcion like '%" + data.filter.Tipo_de_vuelo + "%' ";
    if (data.filter.Concepto != "")
      condition += " and Concepto_de_Gasto_de_Empleado.Descripcion like '%" + data.filter.Concepto + "%' ";

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
        sort = " Configuracion_de_Politicas_de_Viaticos.Folio " + data.sortDirecction;
        break;
      case "Fecha_de_Ultima_Modificacion":
        sort = " Configuracion_de_Politicas_de_Viaticos.Fecha_de_Ultima_Modificacion " + data.sortDirecction;
        break;
      case "Hora_de_Ultima_Modificacion":
        sort = " Configuracion_de_Politicas_de_Viaticos.Hora_de_Ultima_Modificacion " + data.sortDirecction;
        break;
      case "Usuario_que_Modifica":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Tipo_de_vuelo":
        sort = " Tipo_de_vuelo.Descripcion " + data.sortDirecction;
        break;
      case "Concepto":
        sort = " Concepto_de_Gasto_de_Empleado.Descripcion " + data.sortDirecction;
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
        condition += " AND Configuracion_de_Politicas_de_Viaticos.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Configuracion_de_Politicas_de_Viaticos.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Ultima_Modificacion != 'undefined' && data.filterAdvanced.fromFecha_de_Ultima_Modificacion)
	|| (typeof data.filterAdvanced.toFecha_de_Ultima_Modificacion != 'undefined' && data.filterAdvanced.toFecha_de_Ultima_Modificacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Ultima_Modificacion != 'undefined' && data.filterAdvanced.fromFecha_de_Ultima_Modificacion) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_Politicas_de_Viaticos.Fecha_de_Ultima_Modificacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Ultima_Modificacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Ultima_Modificacion != 'undefined' && data.filterAdvanced.toFecha_de_Ultima_Modificacion) 
        condition += " and CONVERT(VARCHAR(10), Configuracion_de_Politicas_de_Viaticos.Fecha_de_Ultima_Modificacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Ultima_Modificacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHora_de_Ultima_Modificacion != 'undefined' && data.filterAdvanced.fromHora_de_Ultima_Modificacion)
	|| (typeof data.filterAdvanced.toHora_de_Ultima_Modificacion != 'undefined' && data.filterAdvanced.toHora_de_Ultima_Modificacion)) 
	{
		if (typeof data.filterAdvanced.fromHora_de_Ultima_Modificacion != 'undefined' && data.filterAdvanced.fromHora_de_Ultima_Modificacion) 
			condition += " and Configuracion_de_Politicas_de_Viaticos.Hora_de_Ultima_Modificacion >= '" + data.filterAdvanced.fromHora_de_Ultima_Modificacion + "'";
      
		if (typeof data.filterAdvanced.toHora_de_Ultima_Modificacion != 'undefined' && data.filterAdvanced.toHora_de_Ultima_Modificacion) 
			condition += " and Configuracion_de_Politicas_de_Viaticos.Hora_de_Ultima_Modificacion <= '" + data.filterAdvanced.toHora_de_Ultima_Modificacion + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_Modifica != 'undefined' && data.filterAdvanced.Usuario_que_Modifica)) {
      switch (data.filterAdvanced.Usuario_que_ModificaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_que_Modifica + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Modifica + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_Modifica + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_que_Modifica + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_ModificaMultiple != null && data.filterAdvanced.Usuario_que_ModificaMultiple.length > 0) {
      var Usuario_que_Modificads = data.filterAdvanced.Usuario_que_ModificaMultiple.join(",");
      condition += " AND Configuracion_de_Politicas_de_Viaticos.Usuario_que_Modifica In (" + Usuario_que_Modificads + ")";
    }
    if ((typeof data.filterAdvanced.Tipo_de_vuelo != 'undefined' && data.filterAdvanced.Tipo_de_vuelo)) {
      switch (data.filterAdvanced.Tipo_de_vueloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_vuelo.Descripcion LIKE '" + data.filterAdvanced.Tipo_de_vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_vuelo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_vuelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_vuelo.Descripcion LIKE '%" + data.filterAdvanced.Tipo_de_vuelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_vuelo.Descripcion = '" + data.filterAdvanced.Tipo_de_vuelo + "'";
          break;
      }
    } else if (data.filterAdvanced.Tipo_de_vueloMultiple != null && data.filterAdvanced.Tipo_de_vueloMultiple.length > 0) {
      var Tipo_de_vuelods = data.filterAdvanced.Tipo_de_vueloMultiple.join(",");
      condition += " AND Configuracion_de_Politicas_de_Viaticos.Tipo_de_vuelo In (" + Tipo_de_vuelods + ")";
    }
    if ((typeof data.filterAdvanced.Concepto != 'undefined' && data.filterAdvanced.Concepto)) {
      switch (data.filterAdvanced.ConceptoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Concepto_de_Gasto_de_Empleado.Descripcion LIKE '" + data.filterAdvanced.Concepto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Concepto_de_Gasto_de_Empleado.Descripcion LIKE '%" + data.filterAdvanced.Concepto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Concepto_de_Gasto_de_Empleado.Descripcion LIKE '%" + data.filterAdvanced.Concepto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Concepto_de_Gasto_de_Empleado.Descripcion = '" + data.filterAdvanced.Concepto + "'";
          break;
      }
    } else if (data.filterAdvanced.ConceptoMultiple != null && data.filterAdvanced.ConceptoMultiple.length > 0) {
      var Conceptods = data.filterAdvanced.ConceptoMultiple.join(",");
      condition += " AND Configuracion_de_Politicas_de_Viaticos.Concepto In (" + Conceptods + ")";
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
              const longest = result.Configuracion_de_Politicas_de_Viaticoss.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Configuracion_de_Politicas_de_Viaticoss);
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
