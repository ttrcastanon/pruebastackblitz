import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Productividad_del_area_de_mantenimientoService } from "src/app/api-services/Productividad_del_area_de_mantenimiento.service";
import { Productividad_del_area_de_mantenimiento } from "src/app/models/Productividad_del_area_de_mantenimiento";
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
import { Productividad_del_area_de_mantenimientoIndexRules } from 'src/app/shared/businessRules/Productividad_del_area_de_mantenimiento-index-rules';
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
  selector: "app-list-Productividad_del_area_de_mantenimiento",
  templateUrl: "./list-Productividad_del_area_de_mantenimiento.component.html",
  styleUrls: ["./list-Productividad_del_area_de_mantenimiento.component.scss"],
})
export class ListProductividad_del_area_de_mantenimientoComponent extends Productividad_del_area_de_mantenimientoIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Matricula",
    "Modelo",
    "Fecha_de_vencimiento",
    "Estatus",
    "N_Reporte",
    "Asignado_a",
    "Tiempo_estimado_de_ejecucion",
    "Tiempo_real_de_ejecucion",
    "Asignar_ejecutante",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "Fecha_de_vencimiento",
      "Estatus",
      "N_Reporte",
      "Asignado_a",
      "Tiempo_estimado_de_ejecucion",
      "Tiempo_real_de_ejecucion",
      "Asignar_ejecutante",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "Fecha_de_vencimiento_filtro",
      "Estatus_filtro",
      "N_Reporte_filtro",
      "Asignado_a_filtro",
      "Tiempo_estimado_de_ejecucion_filtro",
      "Tiempo_real_de_ejecucion_filtro",
      "Asignar_ejecutante_filtro",

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
      Fecha_de_vencimiento: null,
      Estatus: "",
      N_Reporte: "",
      Asignado_a: "",
      Tiempo_estimado_de_ejecucion: "",
      Tiempo_real_de_ejecucion: "",
      Asignar_ejecutante: "",
		
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
      fromFecha_de_vencimiento: "",
      toFecha_de_vencimiento: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      Asignado_aFilter: "",
      Asignado_a: "",
      Asignado_aMultiple: "",
      Asignar_ejecutanteFilter: "",
      Asignar_ejecutante: "",
      Asignar_ejecutanteMultiple: "",

    }
  };

  dataSource: Productividad_del_area_de_mantenimientoDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Productividad_del_area_de_mantenimientoDataSource;
  dataClipboard: any;

  constructor(
    private _Productividad_del_area_de_mantenimientoService: Productividad_del_area_de_mantenimientoService,
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
    this.dataSource = new Productividad_del_area_de_mantenimientoDataSource(
      this._Productividad_del_area_de_mantenimientoService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Productividad_del_area_de_mantenimiento)
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
    this.listConfig.filter.Fecha_de_vencimiento = undefined;
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.N_Reporte = "";
    this.listConfig.filter.Asignado_a = "";
    this.listConfig.filter.Tiempo_estimado_de_ejecucion = "";
    this.listConfig.filter.Tiempo_real_de_ejecucion = "";
    this.listConfig.filter.Asignar_ejecutante = "";

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

//INICIA - BRID:4461 - filtrar solo con estatus 5 (abierto) - Autor: Yamir - Actualización: 7/27/2021 1:47:19 PM
this.brf.SetFilteronList(this.listConfig,"Productividad_del_area_de_mantenimiento.Folio in(select Folio from Productividad_del_area_de_mantenimiento where Estatus= 5)");
//TERMINA - BRID:4461

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

  remove(row: Productividad_del_area_de_mantenimiento) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Productividad_del_area_de_mantenimientoService
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
  ActionPrint(dataRow: Productividad_del_area_de_mantenimiento) {

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
,'Fecha de vencimiento'
,'Estatus'
,'N° Reporte'
,'Asignado a:'
,'Tiempo estimado de ejecución'
,'Tiempo real de ejecución'
,'Asignar ejecutante'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Matricula_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.Fecha_de_vencimiento
,x.Estatus_Estatus_de_Reporte.Descripcion
,x.N_Reporte
,x.Asignado_a_Spartan_User.Name
,x.Tiempo_estimado_de_ejecucion
,x.Tiempo_real_de_ejecucion
,x.Asignar_ejecutante_Spartan_User.Name
		  
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
    pdfMake.createPdf(pdfDefinition).download('Productividad_del_area_de_mantenimiento.pdf');
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
          this._Productividad_del_area_de_mantenimientoService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Productividad_del_area_de_mantenimientos;
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
          this._Productividad_del_area_de_mantenimientoService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Productividad_del_area_de_mantenimientos;
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
        'Fecha de vencimiento ': fields.Fecha_de_vencimiento ? momentJS(fields.Fecha_de_vencimiento).format('DD/MM/YYYY') : '',
        'Estatus ': fields.Estatus_Estatus_de_Reporte.Descripcion,
        'N° Reporte ': fields.N_Reporte,
        'Asignado a: ': fields.Asignado_a_Spartan_User.Name,
        'Tiempo estimado de ejecución ': fields.Tiempo_estimado_de_ejecucion,
        'Tiempo real de ejecución ': fields.Tiempo_real_de_ejecucion,
        'Asignar ejecutante 1': fields.Asignar_ejecutante_Spartan_User.Name,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Productividad_del_area_de_mantenimiento  ${new Date().toLocaleString()}`);
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
      Fecha_de_vencimiento: x.Fecha_de_vencimiento,
      Estatus: x.Estatus_Estatus_de_Reporte.Descripcion,
      N_Reporte: x.N_Reporte,
      Asignado_a: x.Asignado_a_Spartan_User.Name,
      Tiempo_estimado_de_ejecucion: x.Tiempo_estimado_de_ejecucion,
      Tiempo_real_de_ejecucion: x.Tiempo_real_de_ejecucion,
      Asignar_ejecutante: x.Asignar_ejecutante_Spartan_User.Name,

    }));

    this.excelService.exportToCsv(result, 'Productividad_del_area_de_mantenimiento',  ['Folio'    ,'Matricula'  ,'Modelo'  ,'Fecha_de_vencimiento'  ,'Estatus'  ,'N_Reporte'  ,'Asignado_a'  ,'Tiempo_estimado_de_ejecucion'  ,'Tiempo_real_de_ejecucion'  ,'Asignar_ejecutante' ]);
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
    template += '          <th>Fecha de vencimiento</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>N° Reporte</th>';
    template += '          <th>Asignado a:</th>';
    template += '          <th>Tiempo estimado de ejecución</th>';
    template += '          <th>Tiempo real de ejecución</th>';
    template += '          <th>Asignar ejecutante</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.Fecha_de_vencimiento + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Reporte.Descripcion + '</td>';
      template += '          <td>' + element.N_Reporte + '</td>';
      template += '          <td>' + element.Asignado_a_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Tiempo_estimado_de_ejecucion + '</td>';
      template += '          <td>' + element.Tiempo_real_de_ejecucion + '</td>';
      template += '          <td>' + element.Asignar_ejecutante_Spartan_User.Name + '</td>';
		  
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
	template += '\t Fecha de vencimiento';
	template += '\t Estatus';
	template += '\t N° Reporte';
	template += '\t Asignado a:';
	template += '\t Tiempo estimado de ejecución';
	template += '\t Tiempo real de ejecución';
	template += '\t Asignar ejecutante';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
	  template += '\t ' + element.Fecha_de_vencimiento;
      template += '\t ' + element.Estatus_Estatus_de_Reporte.Descripcion;
	  template += '\t ' + element.N_Reporte;
      template += '\t ' + element.Asignado_a_Spartan_User.Name;
	  template += '\t ' + element.Tiempo_estimado_de_ejecucion;
	  template += '\t ' + element.Tiempo_real_de_ejecucion;
      template += '\t ' + element.Asignar_ejecutante_Spartan_User.Name;

	  template += '\n';
    });

    return template;
  }

}

export class Productividad_del_area_de_mantenimientoDataSource implements DataSource<Productividad_del_area_de_mantenimiento>
{
  private subject = new BehaviorSubject<Productividad_del_area_de_mantenimiento[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Productividad_del_area_de_mantenimientoService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Productividad_del_area_de_mantenimiento[]> {
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
              const longest = result.Productividad_del_area_de_mantenimientos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Productividad_del_area_de_mantenimientos);
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
      condition += " and Productividad_del_area_de_mantenimiento.Folio = " + data.filter.Folio;
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Fecha_de_vencimiento)
      condition += " and CONVERT(VARCHAR(10), Productividad_del_area_de_mantenimiento.Fecha_de_vencimiento, 102)  = '" + moment(data.filter.Fecha_de_vencimiento).format("YYYY.MM.DD") + "'";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Reporte.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.N_Reporte != "")
      condition += " and Productividad_del_area_de_mantenimiento.N_Reporte like '%" + data.filter.N_Reporte + "%' ";
    if (data.filter.Asignado_a != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Asignado_a + "%' ";
    if (data.filter.Tiempo_estimado_de_ejecucion != "")
      condition += " and Productividad_del_area_de_mantenimiento.Tiempo_estimado_de_ejecucion like '%" + data.filter.Tiempo_estimado_de_ejecucion + "%' ";
    if (data.filter.Tiempo_real_de_ejecucion != "")
      condition += " and Productividad_del_area_de_mantenimiento.Tiempo_real_de_ejecucion like '%" + data.filter.Tiempo_real_de_ejecucion + "%' ";
    if (data.filter.Asignar_ejecutante != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Asignar_ejecutante + "%' ";

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
        sort = " Productividad_del_area_de_mantenimiento.Folio " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Fecha_de_vencimiento":
        sort = " Productividad_del_area_de_mantenimiento.Fecha_de_vencimiento " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Reporte.Descripcion " + data.sortDirecction;
        break;
      case "N_Reporte":
        sort = " Productividad_del_area_de_mantenimiento.N_Reporte " + data.sortDirecction;
        break;
      case "Asignado_a":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Tiempo_estimado_de_ejecucion":
        sort = " Productividad_del_area_de_mantenimiento.Tiempo_estimado_de_ejecucion " + data.sortDirecction;
        break;
      case "Tiempo_real_de_ejecucion":
        sort = " Productividad_del_area_de_mantenimiento.Tiempo_real_de_ejecucion " + data.sortDirecction;
        break;
      case "Asignar_ejecutante":
        sort = " Spartan_User.Name " + data.sortDirecction;
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
        condition += " AND Productividad_del_area_de_mantenimiento.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Productividad_del_area_de_mantenimiento.Folio <= " + data.filterAdvanced.toFolio;
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
      condition += " AND Productividad_del_area_de_mantenimiento.Matricula In (" + Matriculads + ")";
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
      condition += " AND Productividad_del_area_de_mantenimiento.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento)
	|| (typeof data.filterAdvanced.toFecha_de_vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_vencimiento != 'undefined' && data.filterAdvanced.fromFecha_de_vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Productividad_del_area_de_mantenimiento.Fecha_de_vencimiento, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_vencimiento).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_vencimiento != 'undefined' && data.filterAdvanced.toFecha_de_vencimiento) 
        condition += " and CONVERT(VARCHAR(10), Productividad_del_area_de_mantenimiento.Fecha_de_vencimiento, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_vencimiento).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Reporte.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Reporte.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Reporte.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Productividad_del_area_de_mantenimiento.Estatus In (" + Estatusds + ")";
    }
    switch (data.filterAdvanced.N_ReporteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Productividad_del_area_de_mantenimiento.N_Reporte LIKE '" + data.filterAdvanced.N_Reporte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Productividad_del_area_de_mantenimiento.N_Reporte LIKE '%" + data.filterAdvanced.N_Reporte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Productividad_del_area_de_mantenimiento.N_Reporte LIKE '%" + data.filterAdvanced.N_Reporte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Productividad_del_area_de_mantenimiento.N_Reporte = '" + data.filterAdvanced.N_Reporte + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Asignado_a != 'undefined' && data.filterAdvanced.Asignado_a)) {
      switch (data.filterAdvanced.Asignado_aFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Asignado_a + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Asignado_a + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Asignado_a + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Asignado_a + "'";
          break;
      }
    } else if (data.filterAdvanced.Asignado_aMultiple != null && data.filterAdvanced.Asignado_aMultiple.length > 0) {
      var Asignado_ads = data.filterAdvanced.Asignado_aMultiple.join(",");
      condition += " AND Productividad_del_area_de_mantenimiento.Asignado_a In (" + Asignado_ads + ")";
    }
    switch (data.filterAdvanced.Tiempo_estimado_de_ejecucionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Productividad_del_area_de_mantenimiento.Tiempo_estimado_de_ejecucion LIKE '" + data.filterAdvanced.Tiempo_estimado_de_ejecucion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Productividad_del_area_de_mantenimiento.Tiempo_estimado_de_ejecucion LIKE '%" + data.filterAdvanced.Tiempo_estimado_de_ejecucion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Productividad_del_area_de_mantenimiento.Tiempo_estimado_de_ejecucion LIKE '%" + data.filterAdvanced.Tiempo_estimado_de_ejecucion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Productividad_del_area_de_mantenimiento.Tiempo_estimado_de_ejecucion = '" + data.filterAdvanced.Tiempo_estimado_de_ejecucion + "'";
        break;
    }
    switch (data.filterAdvanced.Tiempo_real_de_ejecucionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Productividad_del_area_de_mantenimiento.Tiempo_real_de_ejecucion LIKE '" + data.filterAdvanced.Tiempo_real_de_ejecucion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Productividad_del_area_de_mantenimiento.Tiempo_real_de_ejecucion LIKE '%" + data.filterAdvanced.Tiempo_real_de_ejecucion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Productividad_del_area_de_mantenimiento.Tiempo_real_de_ejecucion LIKE '%" + data.filterAdvanced.Tiempo_real_de_ejecucion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Productividad_del_area_de_mantenimiento.Tiempo_real_de_ejecucion = '" + data.filterAdvanced.Tiempo_real_de_ejecucion + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Asignar_ejecutante != 'undefined' && data.filterAdvanced.Asignar_ejecutante)) {
      switch (data.filterAdvanced.Asignar_ejecutanteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Asignar_ejecutante + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Asignar_ejecutante + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Asignar_ejecutante + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Asignar_ejecutante + "'";
          break;
      }
    } else if (data.filterAdvanced.Asignar_ejecutanteMultiple != null && data.filterAdvanced.Asignar_ejecutanteMultiple.length > 0) {
      var Asignar_ejecutanteds = data.filterAdvanced.Asignar_ejecutanteMultiple.join(",");
      condition += " AND Productividad_del_area_de_mantenimiento.Asignar_ejecutante In (" + Asignar_ejecutanteds + ")";
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
              const longest = result.Productividad_del_area_de_mantenimientos.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Productividad_del_area_de_mantenimientos);
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
