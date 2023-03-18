import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Seguimiento_de_Solicitud_de_ComprasService } from "src/app/api-services/Seguimiento_de_Solicitud_de_Compras.service";
import { Seguimiento_de_Solicitud_de_Compras } from "src/app/models/Seguimiento_de_Solicitud_de_Compras";
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
import { Seguimiento_de_Solicitud_de_ComprasIndexRules } from 'src/app/shared/businessRules/Seguimiento_de_Solicitud_de_Compras-index-rules';
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
  selector: "app-list-Seguimiento_de_Solicitud_de_Compras",
  templateUrl: "./list-Seguimiento_de_Solicitud_de_Compras.component.html",
  styleUrls: ["./list-Seguimiento_de_Solicitud_de_Compras.component.scss"],
})
export class ListSeguimiento_de_Solicitud_de_ComprasComponent extends Seguimiento_de_Solicitud_de_ComprasIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Matricula",
    "Modelo",
    "Numero_de_Reporte",
    "Numero_de_Parte",
    "Departamento",
    "Solicitante",
    "Urgencia",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "Numero_de_Reporte",
      "Numero_de_Parte",
      "Departamento",
      "Solicitante",
      "Urgencia",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Numero_de_Reporte_filtro",
      "Numero_de_Parte_filtro",
      "Departamento_filtro",
      "Solicitante_filtro",
      "Urgencia_filtro",

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
      Modelo: "",
      Numero_de_Reporte: "",
      Numero_de_Parte: "",
      Departamento: "",
      Solicitante: "",
      Urgencia: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      MatriculaFilter: "",
      Matricula: "",
      MatriculaMultiple: "",
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      Numero_de_ReporteFilter: "",
      Numero_de_Reporte: "",
      Numero_de_ReporteMultiple: "",
      Numero_de_ParteFilter: "",
      Numero_de_Parte: "",
      Numero_de_ParteMultiple: "",
      DepartamentoFilter: "",
      Departamento: "",
      DepartamentoMultiple: "",
      SolicitanteFilter: "",
      Solicitante: "",
      SolicitanteMultiple: "",
      UrgenciaFilter: "",
      Urgencia: "",
      UrgenciaMultiple: "",

    }
  };

  dataSource: Seguimiento_de_Solicitud_de_ComprasDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Seguimiento_de_Solicitud_de_ComprasDataSource;
  dataClipboard: any;

  constructor(
    private _Seguimiento_de_Solicitud_de_ComprasService: Seguimiento_de_Solicitud_de_ComprasService,
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
    this.dataSource = new Seguimiento_de_Solicitud_de_ComprasDataSource(
      this._Seguimiento_de_Solicitud_de_ComprasService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Seguimiento_de_Solicitud_de_Compras)
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
    this.listConfig.filter.Modelo = "";
    this.listConfig.filter.Numero_de_Reporte = "";
    this.listConfig.filter.Numero_de_Parte = "";
    this.listConfig.filter.Departamento = "";
    this.listConfig.filter.Solicitante = "";
    this.listConfig.filter.Urgencia = "";

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

  remove(row: Seguimiento_de_Solicitud_de_Compras) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Seguimiento_de_Solicitud_de_ComprasService
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
  ActionPrint(dataRow: Seguimiento_de_Solicitud_de_Compras) {

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
,'Matrícula'
,'Modelo'
,'Número de Reporte '
,'Número de Parte'
,'Departamento'
,'Solicitante'
,'Urgencia'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Matricula_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.Numero_de_Reporte_Crear_Reporte.No_Reporte
,x.Numero_de_Parte_Partes.Numero_de_parte_Descripcion
,x.Departamento_Departamento.Nombre
,x.Solicitante_Spartan_User.Name
,x.Urgencia_Urgencia.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Seguimiento_de_Solicitud_de_Compras.pdf');
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
          this._Seguimiento_de_Solicitud_de_ComprasService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Seguimiento_de_Solicitud_de_Comprass;
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
          this._Seguimiento_de_Solicitud_de_ComprasService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Seguimiento_de_Solicitud_de_Comprass;
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
        'Matrícula ': fields.Matricula_Aeronave.Matricula,
        'Modelo ': fields.Modelo_Modelos.Descripcion,
        'Número de Reporte  ': fields.Numero_de_Reporte_Crear_Reporte.No_Reporte,
        'Número de Parte ': fields.Numero_de_Parte_Partes.Numero_de_parte_Descripcion,
        'Departamento ': fields.Departamento_Departamento.Nombre,
        'Solicitante ': fields.Solicitante_Spartan_User.Name,
        'Urgencia ': fields.Urgencia_Urgencia.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Seguimiento_de_Solicitud_de_Compras  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Matricula: x.Matricula_Aeronave.Matricula,
      Modelo: x.Modelo_Modelos.Descripcion,
      Numero_de_Reporte: x.Numero_de_Reporte_Crear_Reporte.No_Reporte,
      Numero_de_Parte: x.Numero_de_Parte_Partes.Numero_de_parte_Descripcion,
      Departamento: x.Departamento_Departamento.Nombre,
      Solicitante: x.Solicitante_Spartan_User.Name,
      Urgencia: x.Urgencia_Urgencia.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Seguimiento_de_Solicitud_de_Compras',  ['Folio'    ,'Matricula'  ,'Modelo'  ,'Numero_de_Reporte'  ,'Numero_de_Parte'  ,'Departamento'  ,'Solicitante'  ,'Urgencia' ]);
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
    template += '          <th>Matrícula</th>';
    template += '          <th>Modelo</th>';
    template += '          <th>Número de Reporte </th>';
    template += '          <th>Número de Parte</th>';
    template += '          <th>Departamento</th>';
    template += '          <th>Solicitante</th>';
    template += '          <th>Urgencia</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Numero_de_Reporte_Crear_Reporte.No_Reporte + '</td>';
      template += '          <td>' + element.Numero_de_Parte_Partes.Numero_de_parte_Descripcion + '</td>';
      template += '          <td>' + element.Departamento_Departamento.Nombre + '</td>';
      template += '          <td>' + element.Solicitante_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Urgencia_Urgencia.Descripcion + '</td>';
		  
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
	template += '\t Matrícula';
	template += '\t Modelo';
	template += '\t Número de Reporte ';
	template += '\t Número de Parte';
	template += '\t Departamento';
	template += '\t Solicitante';
	template += '\t Urgencia';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.Numero_de_Reporte_Crear_Reporte.No_Reporte;
      template += '\t ' + element.Numero_de_Parte_Partes.Numero_de_parte_Descripcion;
      template += '\t ' + element.Departamento_Departamento.Nombre;
      template += '\t ' + element.Solicitante_Spartan_User.Name;
      template += '\t ' + element.Urgencia_Urgencia.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Seguimiento_de_Solicitud_de_ComprasDataSource implements DataSource<Seguimiento_de_Solicitud_de_Compras>
{
  private subject = new BehaviorSubject<Seguimiento_de_Solicitud_de_Compras[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Seguimiento_de_Solicitud_de_ComprasService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Seguimiento_de_Solicitud_de_Compras[]> {
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
              const longest = result.Seguimiento_de_Solicitud_de_Comprass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Seguimiento_de_Solicitud_de_Comprass);
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
      condition += " and Seguimiento_de_Solicitud_de_Compras.Folio = " + data.filter.Folio;
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Numero_de_Reporte != "")
      condition += " and Crear_Reporte.No_Reporte like '%" + data.filter.Numero_de_Reporte + "%' ";
    if (data.filter.Numero_de_Parte != "")
      condition += " and Partes.Numero_de_parte_Descripcion like '%" + data.filter.Numero_de_Parte + "%' ";
    if (data.filter.Departamento != "")
      condition += " and Departamento.Nombre like '%" + data.filter.Departamento + "%' ";
    if (data.filter.Solicitante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Solicitante + "%' ";
    if (data.filter.Urgencia != "")
      condition += " and Urgencia.Descripcion like '%" + data.filter.Urgencia + "%' ";

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
        sort = " Seguimiento_de_Solicitud_de_Compras.Folio " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Numero_de_Reporte":
        sort = " Crear_Reporte.No_Reporte " + data.sortDirecction;
        break;
      case "Numero_de_Parte":
        sort = " Partes.Numero_de_parte_Descripcion " + data.sortDirecction;
        break;
      case "Departamento":
        sort = " Departamento.Nombre " + data.sortDirecction;
        break;
      case "Solicitante":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Urgencia":
        sort = " Urgencia.Descripcion " + data.sortDirecction;
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
        condition += " AND Seguimiento_de_Solicitud_de_Compras.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Seguimiento_de_Solicitud_de_Compras.Folio <= " + data.filterAdvanced.toFolio;
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
      condition += " AND Seguimiento_de_Solicitud_de_Compras.Matricula In (" + Matriculads + ")";
    }
    if ((typeof data.filterAdvanced.Modelo != 'undefined' && data.filterAdvanced.Modelo)) {
      switch (data.filterAdvanced.ModeloFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Modelos.Descripcion LIKE '" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Modelos.Descripcion LIKE '%" + data.filterAdvanced.Modelo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Modelos.Descripcion = '" + data.filterAdvanced.Modelo + "'";
          break;
      }
    } else if (data.filterAdvanced.ModeloMultiple != null && data.filterAdvanced.ModeloMultiple.length > 0) {
      var Modelods = data.filterAdvanced.ModeloMultiple.join(",");
      condition += " AND Seguimiento_de_Solicitud_de_Compras.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.Numero_de_Reporte != 'undefined' && data.filterAdvanced.Numero_de_Reporte)) {
      switch (data.filterAdvanced.Numero_de_ReporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '" + data.filterAdvanced.Numero_de_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.Numero_de_Reporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Crear_Reporte.No_Reporte LIKE '%" + data.filterAdvanced.Numero_de_Reporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Crear_Reporte.No_Reporte = '" + data.filterAdvanced.Numero_de_Reporte + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_ReporteMultiple != null && data.filterAdvanced.Numero_de_ReporteMultiple.length > 0) {
      var Numero_de_Reporteds = data.filterAdvanced.Numero_de_ReporteMultiple.join(",");
      condition += " AND Seguimiento_de_Solicitud_de_Compras.Numero_de_Reporte In (" + Numero_de_Reporteds + ")";
    }
    if ((typeof data.filterAdvanced.Numero_de_Parte != 'undefined' && data.filterAdvanced.Numero_de_Parte)) {
      switch (data.filterAdvanced.Numero_de_ParteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Partes.Numero_de_parte_Descripcion LIKE '" + data.filterAdvanced.Numero_de_Parte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Partes.Numero_de_parte_Descripcion LIKE '%" + data.filterAdvanced.Numero_de_Parte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Partes.Numero_de_parte_Descripcion LIKE '%" + data.filterAdvanced.Numero_de_Parte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Partes.Numero_de_parte_Descripcion = '" + data.filterAdvanced.Numero_de_Parte + "'";
          break;
      }
    } else if (data.filterAdvanced.Numero_de_ParteMultiple != null && data.filterAdvanced.Numero_de_ParteMultiple.length > 0) {
      var Numero_de_Parteds = data.filterAdvanced.Numero_de_ParteMultiple.join(",");
      condition += " AND Seguimiento_de_Solicitud_de_Compras.Numero_de_Parte In (" + Numero_de_Parteds + ")";
    }
    if ((typeof data.filterAdvanced.Departamento != 'undefined' && data.filterAdvanced.Departamento)) {
      switch (data.filterAdvanced.DepartamentoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Departamento.Nombre LIKE '" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Departamento.Nombre LIKE '%" + data.filterAdvanced.Departamento + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Departamento.Nombre = '" + data.filterAdvanced.Departamento + "'";
          break;
      }
    } else if (data.filterAdvanced.DepartamentoMultiple != null && data.filterAdvanced.DepartamentoMultiple.length > 0) {
      var Departamentods = data.filterAdvanced.DepartamentoMultiple.join(",");
      condition += " AND Seguimiento_de_Solicitud_de_Compras.Departamento In (" + Departamentods + ")";
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
      condition += " AND Seguimiento_de_Solicitud_de_Compras.Solicitante In (" + Solicitanteds + ")";
    }
    if ((typeof data.filterAdvanced.Urgencia != 'undefined' && data.filterAdvanced.Urgencia)) {
      switch (data.filterAdvanced.UrgenciaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Urgencia.Descripcion LIKE '" + data.filterAdvanced.Urgencia + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Urgencia.Descripcion LIKE '%" + data.filterAdvanced.Urgencia + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Urgencia.Descripcion LIKE '%" + data.filterAdvanced.Urgencia + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Urgencia.Descripcion = '" + data.filterAdvanced.Urgencia + "'";
          break;
      }
    } else if (data.filterAdvanced.UrgenciaMultiple != null && data.filterAdvanced.UrgenciaMultiple.length > 0) {
      var Urgenciads = data.filterAdvanced.UrgenciaMultiple.join(",");
      condition += " AND Seguimiento_de_Solicitud_de_Compras.Urgencia In (" + Urgenciads + ")";
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
              const longest = result.Seguimiento_de_Solicitud_de_Comprass.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Seguimiento_de_Solicitud_de_Comprass);
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
