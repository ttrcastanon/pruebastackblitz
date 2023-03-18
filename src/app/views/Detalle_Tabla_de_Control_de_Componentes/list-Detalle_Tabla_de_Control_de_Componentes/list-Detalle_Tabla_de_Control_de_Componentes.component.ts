import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Detalle_Tabla_de_Control_de_ComponentesService } from "src/app/api-services/Detalle_Tabla_de_Control_de_Componentes.service";
import { Detalle_Tabla_de_Control_de_Componentes } from "src/app/models/Detalle_Tabla_de_Control_de_Componentes";
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
import { Detalle_Tabla_de_Control_de_ComponentesIndexRules } from 'src/app/shared/businessRules/Detalle_Tabla_de_Control_de_Componentes-index-rules';
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
  selector: "app-list-Detalle_Tabla_de_Control_de_Componentes",
  templateUrl: "./list-Detalle_Tabla_de_Control_de_Componentes.component.html",
  styleUrls: ["./list-Detalle_Tabla_de_Control_de_Componentes.component.scss"],
})
export class ListDetalle_Tabla_de_Control_de_ComponentesComponent extends Detalle_Tabla_de_Control_de_ComponentesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Codigo_Computarizado",
    "Descripcion",
    "No_Parte",
    "Posicion",
    "No_Serie",
    "Horas_Acumuladas_Parte",
    "Ciclos_Acumulados_Parte",
    "Horas_Acumuladas_Aeronave",
    "Ciclos_Acumulados_Aeronave",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Codigo_Computarizado",
      "Descripcion",
      "No_Parte",
      "Posicion",
      "No_Serie",
      "Horas_Acumuladas_Parte",
      "Ciclos_Acumulados_Parte",
      "Horas_Acumuladas_Aeronave",
      "Ciclos_Acumulados_Aeronave",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Codigo_Computarizado_filtro",
      "Descripcion_filtro",
      "No_Parte_filtro",
      "Posicion_filtro",
      "No_Serie_filtro",
      "Horas_Acumuladas_Parte_filtro",
      "Ciclos_Acumulados_Parte_filtro",
      "Horas_Acumuladas_Aeronave_filtro",
      "Ciclos_Acumulados_Aeronave_filtro",

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
      Codigo_Computarizado: "",
      Descripcion: "",
      No_Parte: "",
      Posicion: "",
      No_Serie: "",
      Horas_Acumuladas_Parte: "",
      Ciclos_Acumulados_Parte: "",
      Horas_Acumuladas_Aeronave: "",
      Ciclos_Acumulados_Aeronave: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      Codigo_ComputarizadoFilter: "",
      Codigo_Computarizado: "",
      Codigo_ComputarizadoMultiple: "",
      DescripcionFilter: "",
      Descripcion: "",
      DescripcionMultiple: "",

    }
  };

  dataSource: Detalle_Tabla_de_Control_de_ComponentesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Detalle_Tabla_de_Control_de_ComponentesDataSource;
  dataClipboard: any;

  constructor(
    private _Detalle_Tabla_de_Control_de_ComponentesService: Detalle_Tabla_de_Control_de_ComponentesService,
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
    this.dataSource = new Detalle_Tabla_de_Control_de_ComponentesDataSource(
      this._Detalle_Tabla_de_Control_de_ComponentesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Detalle_Tabla_de_Control_de_Componentes)
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
    this.listConfig.filter.Codigo_Computarizado = "";
    this.listConfig.filter.Descripcion = "";
    this.listConfig.filter.No_Parte = "";
    this.listConfig.filter.Posicion = "";
    this.listConfig.filter.No_Serie = "";
    this.listConfig.filter.Horas_Acumuladas_Parte = "";
    this.listConfig.filter.Ciclos_Acumulados_Parte = "";
    this.listConfig.filter.Horas_Acumuladas_Aeronave = "";
    this.listConfig.filter.Ciclos_Acumulados_Aeronave = "";

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

  remove(row: Detalle_Tabla_de_Control_de_Componentes) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Detalle_Tabla_de_Control_de_ComponentesService
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
  ActionPrint(dataRow: Detalle_Tabla_de_Control_de_Componentes) {

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
,'Código Computarizado'
,'Descripción'
,'No Parte'
,'Posición'
,'No Serie'
,'Horas Acumuladas Parte'
,'Ciclos Acumulados Parte'
,'Horas Acumuladas Aeronave'
,'Ciclos Acumulados Aeronave'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Codigo_Computarizado_Codigo_Computarizado.Codigo
,x.Descripcion_Codigo_Computarizado.Descripcion
,x.No_Parte
,x.Posicion
,x.No_Serie
,x.Horas_Acumuladas_Parte
,x.Ciclos_Acumulados_Parte
,x.Horas_Acumuladas_Aeronave
,x.Ciclos_Acumulados_Aeronave
		  
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
    pdfMake.createPdf(pdfDefinition).download('Detalle_Tabla_de_Control_de_Componentes.pdf');
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
          this._Detalle_Tabla_de_Control_de_ComponentesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Detalle_Tabla_de_Control_de_Componentess;
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
          this._Detalle_Tabla_de_Control_de_ComponentesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Detalle_Tabla_de_Control_de_Componentess;
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
        'Código Computarizado ': fields.Codigo_Computarizado_Codigo_Computarizado.Codigo,
        'Descripción ': fields.Descripcion_Codigo_Computarizado.Descripcion,
        'No Parte ': fields.No_Parte,
        'Posición ': fields.Posicion,
        'No Serie ': fields.No_Serie,
        'Horas Acumuladas Parte ': fields.Horas_Acumuladas_Parte,
        'Ciclos Acumulados Parte ': fields.Ciclos_Acumulados_Parte,
        'Horas Acumuladas Aeronave ': fields.Horas_Acumuladas_Aeronave,
        'Ciclos Acumulados Aeronave ': fields.Ciclos_Acumulados_Aeronave,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Detalle_Tabla_de_Control_de_Componentes  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Codigo_Computarizado: x.Codigo_Computarizado_Codigo_Computarizado.Codigo,
      Descripcion: x.Descripcion_Codigo_Computarizado.Descripcion,
      No_Parte: x.No_Parte,
      Posicion: x.Posicion,
      No_Serie: x.No_Serie,
      Horas_Acumuladas_Parte: x.Horas_Acumuladas_Parte,
      Ciclos_Acumulados_Parte: x.Ciclos_Acumulados_Parte,
      Horas_Acumuladas_Aeronave: x.Horas_Acumuladas_Aeronave,
      Ciclos_Acumulados_Aeronave: x.Ciclos_Acumulados_Aeronave,

    }));

    this.excelService.exportToCsv(result, 'Detalle_Tabla_de_Control_de_Componentes',  ['Folio'    ,'Codigo_Computarizado'  ,'Descripcion'  ,'No_Parte'  ,'Posicion'  ,'No_Serie'  ,'Horas_Acumuladas_Parte'  ,'Ciclos_Acumulados_Parte'  ,'Horas_Acumuladas_Aeronave'  ,'Ciclos_Acumulados_Aeronave' ]);
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
    template += '          <th>Código Computarizado</th>';
    template += '          <th>Descripción</th>';
    template += '          <th>No Parte</th>';
    template += '          <th>Posición</th>';
    template += '          <th>No Serie</th>';
    template += '          <th>Horas Acumuladas Parte</th>';
    template += '          <th>Ciclos Acumulados Parte</th>';
    template += '          <th>Horas Acumuladas Aeronave</th>';
    template += '          <th>Ciclos Acumulados Aeronave</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Codigo_Computarizado_Codigo_Computarizado.Codigo + '</td>';
      template += '          <td>' + element.Descripcion_Codigo_Computarizado.Descripcion + '</td>';
      template += '          <td>' + element.No_Parte + '</td>';
      template += '          <td>' + element.Posicion + '</td>';
      template += '          <td>' + element.No_Serie + '</td>';
      template += '          <td>' + element.Horas_Acumuladas_Parte + '</td>';
      template += '          <td>' + element.Ciclos_Acumulados_Parte + '</td>';
      template += '          <td>' + element.Horas_Acumuladas_Aeronave + '</td>';
      template += '          <td>' + element.Ciclos_Acumulados_Aeronave + '</td>';
		  
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
	template += '\t Código Computarizado';
	template += '\t Descripción';
	template += '\t No Parte';
	template += '\t Posición';
	template += '\t No Serie';
	template += '\t Horas Acumuladas Parte';
	template += '\t Ciclos Acumulados Parte';
	template += '\t Horas Acumuladas Aeronave';
	template += '\t Ciclos Acumulados Aeronave';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Codigo_Computarizado_Codigo_Computarizado.Codigo;
      template += '\t ' + element.Descripcion_Codigo_Computarizado.Descripcion;
	  template += '\t ' + element.No_Parte;
	  template += '\t ' + element.Posicion;
	  template += '\t ' + element.No_Serie;
	  template += '\t ' + element.Horas_Acumuladas_Parte;
	  template += '\t ' + element.Ciclos_Acumulados_Parte;
	  template += '\t ' + element.Horas_Acumuladas_Aeronave;
	  template += '\t ' + element.Ciclos_Acumulados_Aeronave;

	  template += '\n';
    });

    return template;
  }

}

export class Detalle_Tabla_de_Control_de_ComponentesDataSource implements DataSource<Detalle_Tabla_de_Control_de_Componentes>
{
  private subject = new BehaviorSubject<Detalle_Tabla_de_Control_de_Componentes[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Detalle_Tabla_de_Control_de_ComponentesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Detalle_Tabla_de_Control_de_Componentes[]> {
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
              const longest = result.Detalle_Tabla_de_Control_de_Componentess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Detalle_Tabla_de_Control_de_Componentess);
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
      condition += " and Detalle_Tabla_de_Control_de_Componentes.Folio = " + data.filter.Folio;
    if (data.filter.Codigo_Computarizado != "")
      condition += " and Codigo_Computarizado.Codigo like '%" + data.filter.Codigo_Computarizado + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Codigo_Computarizado.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.No_Parte != "")
      condition += " and Detalle_Tabla_de_Control_de_Componentes.No_Parte like '%" + data.filter.No_Parte + "%' ";
    if (data.filter.Posicion != "")
      condition += " and Detalle_Tabla_de_Control_de_Componentes.Posicion like '%" + data.filter.Posicion + "%' ";
    if (data.filter.No_Serie != "")
      condition += " and Detalle_Tabla_de_Control_de_Componentes.No_Serie like '%" + data.filter.No_Serie + "%' ";
    if (data.filter.Horas_Acumuladas_Parte != "")
      condition += " and Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Parte like '%" + data.filter.Horas_Acumuladas_Parte + "%' ";
    if (data.filter.Ciclos_Acumulados_Parte != "")
      condition += " and Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Parte like '%" + data.filter.Ciclos_Acumulados_Parte + "%' ";
    if (data.filter.Horas_Acumuladas_Aeronave != "")
      condition += " and Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Aeronave like '%" + data.filter.Horas_Acumuladas_Aeronave + "%' ";
    if (data.filter.Ciclos_Acumulados_Aeronave != "")
      condition += " and Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Aeronave like '%" + data.filter.Ciclos_Acumulados_Aeronave + "%' ";

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
        sort = " Detalle_Tabla_de_Control_de_Componentes.Folio " + data.sortDirecction;
        break;
      case "Codigo_Computarizado":
        sort = " Codigo_Computarizado.Codigo " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Codigo_Computarizado.Descripcion " + data.sortDirecction;
        break;
      case "No_Parte":
        sort = " Detalle_Tabla_de_Control_de_Componentes.No_Parte " + data.sortDirecction;
        break;
      case "Posicion":
        sort = " Detalle_Tabla_de_Control_de_Componentes.Posicion " + data.sortDirecction;
        break;
      case "No_Serie":
        sort = " Detalle_Tabla_de_Control_de_Componentes.No_Serie " + data.sortDirecction;
        break;
      case "Horas_Acumuladas_Parte":
        sort = " Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Parte " + data.sortDirecction;
        break;
      case "Ciclos_Acumulados_Parte":
        sort = " Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Parte " + data.sortDirecction;
        break;
      case "Horas_Acumuladas_Aeronave":
        sort = " Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Aeronave " + data.sortDirecction;
        break;
      case "Ciclos_Acumulados_Aeronave":
        sort = " Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Aeronave " + data.sortDirecction;
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
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Codigo_Computarizado != 'undefined' && data.filterAdvanced.Codigo_Computarizado)) {
      switch (data.filterAdvanced.Codigo_ComputarizadoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Codigo_Computarizado.Codigo LIKE '" + data.filterAdvanced.Codigo_Computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Codigo_Computarizado.Codigo LIKE '%" + data.filterAdvanced.Codigo_Computarizado + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Codigo_Computarizado.Codigo LIKE '%" + data.filterAdvanced.Codigo_Computarizado + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Codigo_Computarizado.Codigo = '" + data.filterAdvanced.Codigo_Computarizado + "'";
          break;
      }
    } else if (data.filterAdvanced.Codigo_ComputarizadoMultiple != null && data.filterAdvanced.Codigo_ComputarizadoMultiple.length > 0) {
      var Codigo_Computarizadods = data.filterAdvanced.Codigo_ComputarizadoMultiple.join(",");
      condition += " AND Detalle_Tabla_de_Control_de_Componentes.Codigo_Computarizado In (" + Codigo_Computarizadods + ")";
    }
    if ((typeof data.filterAdvanced.Descripcion != 'undefined' && data.filterAdvanced.Descripcion)) {
      switch (data.filterAdvanced.DescripcionFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Codigo_Computarizado.Descripcion LIKE '" + data.filterAdvanced.Descripcion + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Codigo_Computarizado.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Codigo_Computarizado.Descripcion LIKE '%" + data.filterAdvanced.Descripcion + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Codigo_Computarizado.Descripcion = '" + data.filterAdvanced.Descripcion + "'";
          break;
      }
    } else if (data.filterAdvanced.DescripcionMultiple != null && data.filterAdvanced.DescripcionMultiple.length > 0) {
      var Descripcionds = data.filterAdvanced.DescripcionMultiple.join(",");
      condition += " AND Detalle_Tabla_de_Control_de_Componentes.Descripcion In (" + Descripcionds + ")";
    }
    switch (data.filterAdvanced.No_ParteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.No_Parte LIKE '" + data.filterAdvanced.No_Parte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.No_Parte LIKE '%" + data.filterAdvanced.No_Parte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.No_Parte LIKE '%" + data.filterAdvanced.No_Parte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.No_Parte = '" + data.filterAdvanced.No_Parte + "'";
        break;
    }
    switch (data.filterAdvanced.PosicionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Posicion LIKE '" + data.filterAdvanced.Posicion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Posicion LIKE '%" + data.filterAdvanced.Posicion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Posicion LIKE '%" + data.filterAdvanced.Posicion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Posicion = '" + data.filterAdvanced.Posicion + "'";
        break;
    }
    switch (data.filterAdvanced.No_SerieFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.No_Serie LIKE '" + data.filterAdvanced.No_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.No_Serie LIKE '%" + data.filterAdvanced.No_Serie + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.No_Serie LIKE '%" + data.filterAdvanced.No_Serie + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.No_Serie = '" + data.filterAdvanced.No_Serie + "'";
        break;
    }
    switch (data.filterAdvanced.Horas_Acumuladas_ParteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Parte LIKE '" + data.filterAdvanced.Horas_Acumuladas_Parte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Parte LIKE '%" + data.filterAdvanced.Horas_Acumuladas_Parte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Parte LIKE '%" + data.filterAdvanced.Horas_Acumuladas_Parte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Parte = '" + data.filterAdvanced.Horas_Acumuladas_Parte + "'";
        break;
    }
    switch (data.filterAdvanced.Ciclos_Acumulados_ParteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Parte LIKE '" + data.filterAdvanced.Ciclos_Acumulados_Parte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Parte LIKE '%" + data.filterAdvanced.Ciclos_Acumulados_Parte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Parte LIKE '%" + data.filterAdvanced.Ciclos_Acumulados_Parte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Parte = '" + data.filterAdvanced.Ciclos_Acumulados_Parte + "'";
        break;
    }
    switch (data.filterAdvanced.Horas_Acumuladas_AeronaveFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Aeronave LIKE '" + data.filterAdvanced.Horas_Acumuladas_Aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Aeronave LIKE '%" + data.filterAdvanced.Horas_Acumuladas_Aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Aeronave LIKE '%" + data.filterAdvanced.Horas_Acumuladas_Aeronave + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Horas_Acumuladas_Aeronave = '" + data.filterAdvanced.Horas_Acumuladas_Aeronave + "'";
        break;
    }
    switch (data.filterAdvanced.Ciclos_Acumulados_AeronaveFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Aeronave LIKE '" + data.filterAdvanced.Ciclos_Acumulados_Aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Aeronave LIKE '%" + data.filterAdvanced.Ciclos_Acumulados_Aeronave + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Aeronave LIKE '%" + data.filterAdvanced.Ciclos_Acumulados_Aeronave + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Detalle_Tabla_de_Control_de_Componentes.Ciclos_Acumulados_Aeronave = '" + data.filterAdvanced.Ciclos_Acumulados_Aeronave + "'";
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
              const longest = result.Detalle_Tabla_de_Control_de_Componentess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Detalle_Tabla_de_Control_de_Componentess);
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
