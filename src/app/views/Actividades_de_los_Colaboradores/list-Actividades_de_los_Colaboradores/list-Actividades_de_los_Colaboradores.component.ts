import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Actividades_de_los_ColaboradoresService } from "src/app/api-services/Actividades_de_los_Colaboradores.service";
import { Actividades_de_los_Colaboradores } from "src/app/models/Actividades_de_los_Colaboradores";
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
import { Actividades_de_los_ColaboradoresIndexRules } from 'src/app/shared/businessRules/Actividades_de_los_Colaboradores-index-rules';
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
  selector: "app-list-Actividades_de_los_Colaboradores",
  templateUrl: "./list-Actividades_de_los_Colaboradores.component.html",
  styleUrls: ["./list-Actividades_de_los_Colaboradores.component.scss"],
})
export class ListActividades_de_los_ColaboradoresComponent extends Actividades_de_los_ColaboradoresIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Colaborador",
    "Puesto",
    "Empresa",
    "Inicio_Horario_Laboral",
    "Fin_Horario_Laboral",
    "Fecha_de_Reporte",
    "Horas_Registradas",
    "Horas_Faltantes",
    "Horas_Extras",
    "Dia_Inhabil",
    "No_Actividad",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Colaborador",
      "Puesto",
      "Empresa",
      "Inicio_Horario_Laboral",
      "Fin_Horario_Laboral",
      "Fecha_de_Reporte",
      "Horas_Registradas",
      "Horas_Faltantes",
      "Horas_Extras",
      "Dia_Inhabil",
      "No_Actividad",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Colaborador_filtro",
      "Puesto_filtro",
      "Empresa_filtro",
      "Inicio_Horario_Laboral_filtro",
      "Fin_Horario_Laboral_filtro",
      "Fecha_de_Reporte_filtro",
      "Horas_Registradas_filtro",
      "Horas_Faltantes_filtro",
      "Horas_Extras_filtro",
      "Dia_Inhabil_filtro",
      "No_Actividad_filtro",

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
      Colaborador: "",
      Puesto: "",
      Empresa: "",
      Inicio_Horario_Laboral: "",
      Fin_Horario_Laboral: "",
      Fecha_de_Reporte: null,
      Horas_Registradas: "",
      Horas_Faltantes: "",
      Horas_Extras: "",
      Dia_Inhabil: "",
      No_Actividad: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      ColaboradorFilter: "",
      Colaborador: "",
      ColaboradorMultiple: "",
      PuestoFilter: "",
      Puesto: "",
      PuestoMultiple: "",
      EmpresaFilter: "",
      Empresa: "",
      EmpresaMultiple: "",
      fromInicio_Horario_Laboral: "",
      toInicio_Horario_Laboral: "",
      fromFin_Horario_Laboral: "",
      toFin_Horario_Laboral: "",
      fromFecha_de_Reporte: "",
      toFecha_de_Reporte: "",
      fromHoras_Registradas: "",
      toHoras_Registradas: "",
      fromHoras_Faltantes: "",
      toHoras_Faltantes: "",
      fromHoras_Extras: "",
      toHoras_Extras: "",

    }
  };

  dataSource: Actividades_de_los_ColaboradoresDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Actividades_de_los_ColaboradoresDataSource;
  dataClipboard: any;

  constructor(
    private _Actividades_de_los_ColaboradoresService: Actividades_de_los_ColaboradoresService,
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
    this.dataSource = new Actividades_de_los_ColaboradoresDataSource(
      this._Actividades_de_los_ColaboradoresService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Actividades_de_los_Colaboradores)
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
    this.listConfig.filter.Colaborador = "";
    this.listConfig.filter.Puesto = "";
    this.listConfig.filter.Empresa = "";
    this.listConfig.filter.Inicio_Horario_Laboral = "";
    this.listConfig.filter.Fin_Horario_Laboral = "";
    this.listConfig.filter.Fecha_de_Reporte = undefined;
    this.listConfig.filter.Horas_Registradas = "";
    this.listConfig.filter.Horas_Faltantes = "";
    this.listConfig.filter.Horas_Extras = "";
    this.listConfig.filter.Dia_Inhabil = undefined;
    this.listConfig.filter.No_Actividad = "";

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

//INICIA - BRID:4055 - Cargar informacion del usuario loggeado, si es admin o Gerente carga la informacion de todos los colaboradores - Autor: Aaron - Actualización: 7/2/2021 10:53:35 AM
if( this.brf.EvaluaQuery("SELECT 'GLOBAL[USERROLEID]'", 1, 'ABC123')==this.brf.TryParseInt('1', '1') || this.brf.EvaluaQuery("SELECT 'GLOBAL[USERROLEID]'	", 1, 'ABC123')==this.brf.TryParseInt('19', '19') ) {} else { this.brf.SetFilteronList(this.listConfig,"(Actividades_de_los_Colaboradores.Colaborador = ( SELECT Clave FROM Creacion_de_Usuarios WHERE Usuario_Registrado = 'GLOBAL[USERID]'))	");}
//TERMINA - BRID:4055

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

  remove(row: Actividades_de_los_Colaboradores) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Actividades_de_los_ColaboradoresService
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
  ActionPrint(dataRow: Actividades_de_los_Colaboradores) {

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
,'Colaborador'
,'Puesto'
,'Empresa'
,'Inicio Horario Laboral'
,'Fin Horario Laboral'
,'Fecha de Reporte'
,'Horas Registradas'
,'Horas Faltantes'
,'Horas Extras'
,'Día Inhábil'
,'No Actividad'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Colaborador_Creacion_de_Usuarios.Nombre_completo
,x.Puesto_Cargos.Descripcion
,x.Empresa_Cliente.Razon_Social
,x.Inicio_Horario_Laboral
,x.Fin_Horario_Laboral
,x.Fecha_de_Reporte
,x.Horas_Registradas
,x.Horas_Faltantes
,x.Horas_Extras
,x.Dia_Inhabil
,x.No_Actividad
		  
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
    pdfMake.createPdf(pdfDefinition).download('Actividades_de_los_Colaboradores.pdf');
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
          this._Actividades_de_los_ColaboradoresService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Actividades_de_los_Colaboradoress;
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
          this._Actividades_de_los_ColaboradoresService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Actividades_de_los_Colaboradoress;
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
        'Colaborador ': fields.Colaborador_Creacion_de_Usuarios.Nombre_completo,
        'Puesto ': fields.Puesto_Cargos.Descripcion,
        'Empresa ': fields.Empresa_Cliente.Razon_Social,
        'Inicio Horario Laboral ': fields.Inicio_Horario_Laboral,
        'Fin Horario Laboral ': fields.Fin_Horario_Laboral,
        'Fecha de Reporte ': fields.Fecha_de_Reporte ? momentJS(fields.Fecha_de_Reporte).format('DD/MM/YYYY') : '',
        'Horas Registradas ': fields.Horas_Registradas,
        'Horas Faltantes ': fields.Horas_Faltantes,
        'Horas Extras ': fields.Horas_Extras,
        'Dia_Inhabil ': fields.Dia_Inhabil ? 'SI' : 'NO',
        'No Actividad ': fields.No_Actividad,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Actividades_de_los_Colaboradores  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      Colaborador: x.Colaborador_Creacion_de_Usuarios.Nombre_completo,
      Puesto: x.Puesto_Cargos.Descripcion,
      Empresa: x.Empresa_Cliente.Razon_Social,
      Inicio_Horario_Laboral: x.Inicio_Horario_Laboral,
      Fin_Horario_Laboral: x.Fin_Horario_Laboral,
      Fecha_de_Reporte: x.Fecha_de_Reporte,
      Horas_Registradas: x.Horas_Registradas,
      Horas_Faltantes: x.Horas_Faltantes,
      Horas_Extras: x.Horas_Extras,
      Dia_Inhabil: x.Dia_Inhabil,
      No_Actividad: x.No_Actividad,

    }));

    this.excelService.exportToCsv(result, 'Actividades_de_los_Colaboradores',  ['Folio'    ,'Colaborador'  ,'Puesto'  ,'Empresa'  ,'Inicio_Horario_Laboral'  ,'Fin_Horario_Laboral'  ,'Fecha_de_Reporte'  ,'Horas_Registradas'  ,'Horas_Faltantes'  ,'Horas_Extras'  ,'Dia_Inhabil'  ,'No_Actividad' ]);
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
    template += '          <th>Colaborador</th>';
    template += '          <th>Puesto</th>';
    template += '          <th>Empresa</th>';
    template += '          <th>Inicio Horario Laboral</th>';
    template += '          <th>Fin Horario Laboral</th>';
    template += '          <th>Fecha de Reporte</th>';
    template += '          <th>Horas Registradas</th>';
    template += '          <th>Horas Faltantes</th>';
    template += '          <th>Horas Extras</th>';
    template += '          <th>Día Inhábil</th>';
    template += '          <th>No Actividad</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Colaborador_Creacion_de_Usuarios.Nombre_completo + '</td>';
      template += '          <td>' + element.Puesto_Cargos.Descripcion + '</td>';
      template += '          <td>' + element.Empresa_Cliente.Razon_Social + '</td>';
      template += '          <td>' + element.Inicio_Horario_Laboral + '</td>';
      template += '          <td>' + element.Fin_Horario_Laboral + '</td>';
      template += '          <td>' + element.Fecha_de_Reporte + '</td>';
      template += '          <td>' + element.Horas_Registradas + '</td>';
      template += '          <td>' + element.Horas_Faltantes + '</td>';
      template += '          <td>' + element.Horas_Extras + '</td>';
      template += '          <td>' + element.Dia_Inhabil + '</td>';
      template += '          <td>' + element.No_Actividad + '</td>';
		  
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
	template += '\t Colaborador';
	template += '\t Puesto';
	template += '\t Empresa';
	template += '\t Inicio Horario Laboral';
	template += '\t Fin Horario Laboral';
	template += '\t Fecha de Reporte';
	template += '\t Horas Registradas';
	template += '\t Horas Faltantes';
	template += '\t Horas Extras';
	template += '\t Día Inhábil';
	template += '\t No Actividad';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Colaborador_Creacion_de_Usuarios.Nombre_completo;
      template += '\t ' + element.Puesto_Cargos.Descripcion;
      template += '\t ' + element.Empresa_Cliente.Razon_Social;
	  template += '\t ' + element.Inicio_Horario_Laboral;
	  template += '\t ' + element.Fin_Horario_Laboral;
	  template += '\t ' + element.Fecha_de_Reporte;
	  template += '\t ' + element.Horas_Registradas;
	  template += '\t ' + element.Horas_Faltantes;
	  template += '\t ' + element.Horas_Extras;
	  template += '\t ' + element.Dia_Inhabil;
	  template += '\t ' + element.No_Actividad;

	  template += '\n';
    });

    return template;
  }

}

export class Actividades_de_los_ColaboradoresDataSource implements DataSource<Actividades_de_los_Colaboradores>
{
  private subject = new BehaviorSubject<Actividades_de_los_Colaboradores[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Actividades_de_los_ColaboradoresService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Actividades_de_los_Colaboradores[]> {
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
              const longest = result.Actividades_de_los_Colaboradoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Actividades_de_los_Colaboradoress);
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
      condition += " and Actividades_de_los_Colaboradores.Folio = " + data.filter.Folio;
    if (data.filter.Colaborador != "")
      condition += " and Creacion_de_Usuarios.Nombre_completo like '%" + data.filter.Colaborador + "%' ";
    if (data.filter.Puesto != "")
      condition += " and Cargos.Descripcion like '%" + data.filter.Puesto + "%' ";
    if (data.filter.Empresa != "")
      condition += " and Cliente.Razon_Social like '%" + data.filter.Empresa + "%' ";
    if (data.filter.Inicio_Horario_Laboral != "")
      condition += " and Actividades_de_los_Colaboradores.Inicio_Horario_Laboral = '" + data.filter.Inicio_Horario_Laboral + "'";
    if (data.filter.Fin_Horario_Laboral != "")
      condition += " and Actividades_de_los_Colaboradores.Fin_Horario_Laboral = '" + data.filter.Fin_Horario_Laboral + "'";
    if (data.filter.Fecha_de_Reporte)
      condition += " and CONVERT(VARCHAR(10), Actividades_de_los_Colaboradores.Fecha_de_Reporte, 102)  = '" + moment(data.filter.Fecha_de_Reporte).format("YYYY.MM.DD") + "'";
    if (data.filter.Horas_Registradas != "")
      condition += " and Actividades_de_los_Colaboradores.Horas_Registradas = " + data.filter.Horas_Registradas;
    if (data.filter.Horas_Faltantes != "")
      condition += " and Actividades_de_los_Colaboradores.Horas_Faltantes = " + data.filter.Horas_Faltantes;
    if (data.filter.Horas_Extras != "")
      condition += " and Actividades_de_los_Colaboradores.Horas_Extras = " + data.filter.Horas_Extras;
    if (data.filter.Dia_Inhabil && data.filter.Dia_Inhabil != "2") {
      if (data.filter.Dia_Inhabil == "0" || data.filter.Dia_Inhabil == "") {
        condition += " and (Actividades_de_los_Colaboradores.Dia_Inhabil = 0 or Actividades_de_los_Colaboradores.Dia_Inhabil is null)";
      } else {
        condition += " and Actividades_de_los_Colaboradores.Dia_Inhabil = 1";
      }
    }
    if (data.filter.No_Actividad != "")
      condition += " and Actividades_de_los_Colaboradores.No_Actividad like '%" + data.filter.No_Actividad + "%' ";

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
        sort = " Actividades_de_los_Colaboradores.Folio " + data.sortDirecction;
        break;
      case "Colaborador":
        sort = " Creacion_de_Usuarios.Nombre_completo " + data.sortDirecction;
        break;
      case "Puesto":
        sort = " Cargos.Descripcion " + data.sortDirecction;
        break;
      case "Empresa":
        sort = " Cliente.Razon_Social " + data.sortDirecction;
        break;
      case "Inicio_Horario_Laboral":
        sort = " Actividades_de_los_Colaboradores.Inicio_Horario_Laboral " + data.sortDirecction;
        break;
      case "Fin_Horario_Laboral":
        sort = " Actividades_de_los_Colaboradores.Fin_Horario_Laboral " + data.sortDirecction;
        break;
      case "Fecha_de_Reporte":
        sort = " Actividades_de_los_Colaboradores.Fecha_de_Reporte " + data.sortDirecction;
        break;
      case "Horas_Registradas":
        sort = " Actividades_de_los_Colaboradores.Horas_Registradas " + data.sortDirecction;
        break;
      case "Horas_Faltantes":
        sort = " Actividades_de_los_Colaboradores.Horas_Faltantes " + data.sortDirecction;
        break;
      case "Horas_Extras":
        sort = " Actividades_de_los_Colaboradores.Horas_Extras " + data.sortDirecction;
        break;
      case "Dia_Inhabil":
        sort = " Actividades_de_los_Colaboradores.Dia_Inhabil " + data.sortDirecction;
        break;
      case "No_Actividad":
        sort = " Actividades_de_los_Colaboradores.No_Actividad " + data.sortDirecction;
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
        condition += " AND Actividades_de_los_Colaboradores.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Actividades_de_los_Colaboradores.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.Colaborador != 'undefined' && data.filterAdvanced.Colaborador)) {
      switch (data.filterAdvanced.ColaboradorFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '" + data.filterAdvanced.Colaborador + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '%" + data.filterAdvanced.Colaborador + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Creacion_de_Usuarios.Nombre_completo LIKE '%" + data.filterAdvanced.Colaborador + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Creacion_de_Usuarios.Nombre_completo = '" + data.filterAdvanced.Colaborador + "'";
          break;
      }
    } else if (data.filterAdvanced.ColaboradorMultiple != null && data.filterAdvanced.ColaboradorMultiple.length > 0) {
      var Colaboradords = data.filterAdvanced.ColaboradorMultiple.join(",");
      condition += " AND Actividades_de_los_Colaboradores.Colaborador In (" + Colaboradords + ")";
    }
    if ((typeof data.filterAdvanced.Puesto != 'undefined' && data.filterAdvanced.Puesto)) {
      switch (data.filterAdvanced.PuestoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cargos.Descripcion LIKE '" + data.filterAdvanced.Puesto + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cargos.Descripcion LIKE '%" + data.filterAdvanced.Puesto + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cargos.Descripcion LIKE '%" + data.filterAdvanced.Puesto + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cargos.Descripcion = '" + data.filterAdvanced.Puesto + "'";
          break;
      }
    } else if (data.filterAdvanced.PuestoMultiple != null && data.filterAdvanced.PuestoMultiple.length > 0) {
      var Puestods = data.filterAdvanced.PuestoMultiple.join(",");
      condition += " AND Actividades_de_los_Colaboradores.Puesto In (" + Puestods + ")";
    }
    if ((typeof data.filterAdvanced.Empresa != 'undefined' && data.filterAdvanced.Empresa)) {
      switch (data.filterAdvanced.EmpresaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Cliente.Razon_Social LIKE '" + data.filterAdvanced.Empresa + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Empresa + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Cliente.Razon_Social LIKE '%" + data.filterAdvanced.Empresa + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Cliente.Razon_Social = '" + data.filterAdvanced.Empresa + "'";
          break;
      }
    } else if (data.filterAdvanced.EmpresaMultiple != null && data.filterAdvanced.EmpresaMultiple.length > 0) {
      var Empresads = data.filterAdvanced.EmpresaMultiple.join(",");
      condition += " AND Actividades_de_los_Colaboradores.Empresa In (" + Empresads + ")";
    }
    if ((typeof data.filterAdvanced.fromInicio_Horario_Laboral != 'undefined' && data.filterAdvanced.fromInicio_Horario_Laboral)
	|| (typeof data.filterAdvanced.toInicio_Horario_Laboral != 'undefined' && data.filterAdvanced.toInicio_Horario_Laboral)) 
	{
		if (typeof data.filterAdvanced.fromInicio_Horario_Laboral != 'undefined' && data.filterAdvanced.fromInicio_Horario_Laboral) 
			condition += " and Actividades_de_los_Colaboradores.Inicio_Horario_Laboral >= '" + data.filterAdvanced.fromInicio_Horario_Laboral + "'";
      
		if (typeof data.filterAdvanced.toInicio_Horario_Laboral != 'undefined' && data.filterAdvanced.toInicio_Horario_Laboral) 
			condition += " and Actividades_de_los_Colaboradores.Inicio_Horario_Laboral <= '" + data.filterAdvanced.toInicio_Horario_Laboral + "'";
    }
    if ((typeof data.filterAdvanced.fromFin_Horario_Laboral != 'undefined' && data.filterAdvanced.fromFin_Horario_Laboral)
	|| (typeof data.filterAdvanced.toFin_Horario_Laboral != 'undefined' && data.filterAdvanced.toFin_Horario_Laboral)) 
	{
		if (typeof data.filterAdvanced.fromFin_Horario_Laboral != 'undefined' && data.filterAdvanced.fromFin_Horario_Laboral) 
			condition += " and Actividades_de_los_Colaboradores.Fin_Horario_Laboral >= '" + data.filterAdvanced.fromFin_Horario_Laboral + "'";
      
		if (typeof data.filterAdvanced.toFin_Horario_Laboral != 'undefined' && data.filterAdvanced.toFin_Horario_Laboral) 
			condition += " and Actividades_de_los_Colaboradores.Fin_Horario_Laboral <= '" + data.filterAdvanced.toFin_Horario_Laboral + "'";
    }
    if ((typeof data.filterAdvanced.fromFecha_de_Reporte != 'undefined' && data.filterAdvanced.fromFecha_de_Reporte)
	|| (typeof data.filterAdvanced.toFecha_de_Reporte != 'undefined' && data.filterAdvanced.toFecha_de_Reporte)) 
	{
      if (typeof data.filterAdvanced.fromFecha_de_Reporte != 'undefined' && data.filterAdvanced.fromFecha_de_Reporte) 
        condition += " and CONVERT(VARCHAR(10), Actividades_de_los_Colaboradores.Fecha_de_Reporte, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_de_Reporte).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_de_Reporte != 'undefined' && data.filterAdvanced.toFecha_de_Reporte) 
        condition += " and CONVERT(VARCHAR(10), Actividades_de_los_Colaboradores.Fecha_de_Reporte, 102)  <= '" + moment(data.filterAdvanced.toFecha_de_Reporte).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.fromHoras_Registradas != 'undefined' && data.filterAdvanced.fromHoras_Registradas)
	|| (typeof data.filterAdvanced.toHoras_Registradas != 'undefined' && data.filterAdvanced.toHoras_Registradas)) 
	{
      if (typeof data.filterAdvanced.fromHoras_Registradas != 'undefined' && data.filterAdvanced.fromHoras_Registradas)
        condition += " AND Actividades_de_los_Colaboradores.Horas_Registradas >= " + data.filterAdvanced.fromHoras_Registradas;

      if (typeof data.filterAdvanced.toHoras_Registradas != 'undefined' && data.filterAdvanced.toHoras_Registradas) 
        condition += " AND Actividades_de_los_Colaboradores.Horas_Registradas <= " + data.filterAdvanced.toHoras_Registradas;
    }
    if ((typeof data.filterAdvanced.fromHoras_Faltantes != 'undefined' && data.filterAdvanced.fromHoras_Faltantes)
	|| (typeof data.filterAdvanced.toHoras_Faltantes != 'undefined' && data.filterAdvanced.toHoras_Faltantes)) 
	{
      if (typeof data.filterAdvanced.fromHoras_Faltantes != 'undefined' && data.filterAdvanced.fromHoras_Faltantes)
        condition += " AND Actividades_de_los_Colaboradores.Horas_Faltantes >= " + data.filterAdvanced.fromHoras_Faltantes;

      if (typeof data.filterAdvanced.toHoras_Faltantes != 'undefined' && data.filterAdvanced.toHoras_Faltantes) 
        condition += " AND Actividades_de_los_Colaboradores.Horas_Faltantes <= " + data.filterAdvanced.toHoras_Faltantes;
    }
    if ((typeof data.filterAdvanced.fromHoras_Extras != 'undefined' && data.filterAdvanced.fromHoras_Extras)
	|| (typeof data.filterAdvanced.toHoras_Extras != 'undefined' && data.filterAdvanced.toHoras_Extras)) 
	{
      if (typeof data.filterAdvanced.fromHoras_Extras != 'undefined' && data.filterAdvanced.fromHoras_Extras)
        condition += " AND Actividades_de_los_Colaboradores.Horas_Extras >= " + data.filterAdvanced.fromHoras_Extras;

      if (typeof data.filterAdvanced.toHoras_Extras != 'undefined' && data.filterAdvanced.toHoras_Extras) 
        condition += " AND Actividades_de_los_Colaboradores.Horas_Extras <= " + data.filterAdvanced.toHoras_Extras;
    }
    switch (data.filterAdvanced.No_ActividadFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Actividades_de_los_Colaboradores.No_Actividad LIKE '" + data.filterAdvanced.No_Actividad + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Actividades_de_los_Colaboradores.No_Actividad LIKE '%" + data.filterAdvanced.No_Actividad + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Actividades_de_los_Colaboradores.No_Actividad LIKE '%" + data.filterAdvanced.No_Actividad + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Actividades_de_los_Colaboradores.No_Actividad = '" + data.filterAdvanced.No_Actividad + "'";
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
              const longest = result.Actividades_de_los_Colaboradoress.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Actividades_de_los_Colaboradoress);
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
