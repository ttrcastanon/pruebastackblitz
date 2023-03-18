import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Control_Componentes_de_la_AeronaveService } from "src/app/api-services/Control_Componentes_de_la_Aeronave.service";
import { Control_Componentes_de_la_Aeronave } from "src/app/models/Control_Componentes_de_la_Aeronave";
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
import { Control_Componentes_de_la_AeronaveIndexRules } from 'src/app/shared/businessRules/Control_Componentes_de_la_Aeronave-index-rules';
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
  selector: "app-list-Control_Componentes_de_la_Aeronave",
  templateUrl: "./list-Control_Componentes_de_la_Aeronave.component.html",
  styleUrls: ["./list-Control_Componentes_de_la_Aeronave.component.scss"],
})
export class ListControl_Componentes_de_la_AeronaveComponent extends Control_Componentes_de_la_AeronaveIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "Matricula",
    "Modelo",
    "N_serie",
    "Propietario",
    "Fecha_ultima_actualizacion",
    "Usuario_que_actualizo",
    "Codigo_Computarizado_Descripcion",
    "Codigo_ATA",
    "N_Parte",
    "N_de_Serie_Filtro",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "Matricula",
      "Modelo",
      "N_serie",
      "Propietario",
      "Fecha_ultima_actualizacion",
      "Usuario_que_actualizo",
      "Codigo_Computarizado_Descripcion",
      "Codigo_ATA",
      "N_Parte",
      "N_de_Serie_Filtro",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "Matricula_filtro",
      "Modelo_filtro",
      "N_serie_filtro",
      "Propietario_filtro",
      "Fecha_ultima_actualizacion_filtro",
      "Usuario_que_actualizo_filtro",
      "Codigo_Computarizado_Descripcion_filtro",
      "Codigo_ATA_filtro",
      "N_Parte_filtro",
      "N_de_Serie_Filtro_filtro",

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
      N_serie: "",
      Propietario: "",
      Fecha_ultima_actualizacion: null,
      Usuario_que_actualizo: "",
      Codigo_Computarizado_Descripcion: "",
      Codigo_ATA: "",
      N_Parte: "",
      N_de_Serie_Filtro: "",
		
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
      N_serieFilter: "",
      N_serie: "",
      N_serieMultiple: "",
      PropietarioFilter: "",
      Propietario: "",
      PropietarioMultiple: "",
      fromFecha_ultima_actualizacion: "",
      toFecha_ultima_actualizacion: "",
      Usuario_que_actualizoFilter: "",
      Usuario_que_actualizo: "",
      Usuario_que_actualizoMultiple: "",

    }
  };

  dataSource: Control_Componentes_de_la_AeronaveDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Control_Componentes_de_la_AeronaveDataSource;
  dataClipboard: any;

  constructor(
    private _Control_Componentes_de_la_AeronaveService: Control_Componentes_de_la_AeronaveService,
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
    this.dataSource = new Control_Componentes_de_la_AeronaveDataSource(
      this._Control_Componentes_de_la_AeronaveService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Control_Componentes_de_la_Aeronave)
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
    this.listConfig.filter.N_serie = "";
    this.listConfig.filter.Propietario = "";
    this.listConfig.filter.Fecha_ultima_actualizacion = undefined;
    this.listConfig.filter.Usuario_que_actualizo = "";
    this.listConfig.filter.Codigo_Computarizado_Descripcion = "";
    this.listConfig.filter.Codigo_ATA = "";
    this.listConfig.filter.N_Parte = "";
    this.listConfig.filter.N_de_Serie_Filtro = "";

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

//INICIA - BRID:4173 - Ocultar columnas dinamicas modal Aerovics - Autor: Administrador - Actualización: 7/19/2021 11:16:42 AM
if( this.brf.TryParseInt(this.brf.ReplaceVAR('USERID'), this.brf.ReplaceVAR('USERID'))==this.brf.TryParseInt('1', '1') ) { if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Matricula")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Matricula")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Modelo")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Modelo")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"N_serie")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"N_serie")  } if("true" == "true")  {   this.brf.HideFieldofMultirenglon(this.displayedColumns,"Propietario")  }  else  {   this.brf.ShowFieldofMultirenglon(this.displayedColumns,"Propietario")  }} else {}
//TERMINA - BRID:4173

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

  remove(row: Control_Componentes_de_la_Aeronave) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Control_Componentes_de_la_AeronaveService
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
  ActionPrint(dataRow: Control_Componentes_de_la_Aeronave) {

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
,'N° serie'
,'Propietario'
,'Fecha última actualización'
,'Usuario que actualizó'
,'Código Computarizado/Descripción'
,'Código ATA'
,'N° Parte'
,'N° de Serie'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.Matricula_Aeronave.Matricula
,x.Modelo_Modelos.Descripcion
,x.N_serie_Aeronave.Numero_de_Serie
,x.Propietario_Propietarios.Nombre
,x.Fecha_ultima_actualizacion
,x.Usuario_que_actualizo_Spartan_User.Name
,x.Codigo_Computarizado_Descripcion
,x.Codigo_ATA
,x.N_Parte
,x.N_de_Serie_Filtro
		  
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
    pdfMake.createPdf(pdfDefinition).download('Control_Componentes_de_la_Aeronave.pdf');
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
          this._Control_Componentes_de_la_AeronaveService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Control_Componentes_de_la_Aeronaves;
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
          this._Control_Componentes_de_la_AeronaveService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Control_Componentes_de_la_Aeronaves;
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
        'N° serie ': fields.N_serie_Aeronave.Numero_de_Serie,
        'Propietario ': fields.Propietario_Propietarios.Nombre,
        'Fecha última actualización ': fields.Fecha_ultima_actualizacion ? momentJS(fields.Fecha_ultima_actualizacion).format('DD/MM/YYYY') : '',
        'Usuario que actualizó ': fields.Usuario_que_actualizo_Spartan_User.Name,
        'Código Computarizado/Descripción ': fields.Codigo_Computarizado_Descripcion,
        'Código ATA ': fields.Codigo_ATA,
        'N° Parte ': fields.N_Parte,
        'N° de Serie ': fields.N_de_Serie_Filtro,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Control_Componentes_de_la_Aeronave  ${new Date().toLocaleString()}`);
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
      N_serie: x.N_serie_Aeronave.Numero_de_Serie,
      Propietario: x.Propietario_Propietarios.Nombre,
      Fecha_ultima_actualizacion: x.Fecha_ultima_actualizacion,
      Usuario_que_actualizo: x.Usuario_que_actualizo_Spartan_User.Name,
      Codigo_Computarizado_Descripcion: x.Codigo_Computarizado_Descripcion,
      Codigo_ATA: x.Codigo_ATA,
      N_Parte: x.N_Parte,
      N_de_Serie_Filtro: x.N_de_Serie_Filtro,

    }));

    this.excelService.exportToCsv(result, 'Control_Componentes_de_la_Aeronave',  ['Folio'    ,'Matricula'  ,'Modelo'  ,'N_serie'  ,'Propietario'  ,'Fecha_ultima_actualizacion'  ,'Usuario_que_actualizo'  ,'Codigo_Computarizado_Descripcion'  ,'Codigo_ATA'  ,'N_Parte'  ,'N_de_Serie_Filtro' ]);
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
    template += '          <th>N° serie</th>';
    template += '          <th>Propietario</th>';
    template += '          <th>Fecha última actualización</th>';
    template += '          <th>Usuario que actualizó</th>';
    template += '          <th>Código Computarizado/Descripción</th>';
    template += '          <th>Código ATA</th>';
    template += '          <th>N° Parte</th>';
    template += '          <th>N° de Serie</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.Matricula_Aeronave.Matricula + '</td>';
      template += '          <td>' + element.Modelo_Modelos.Descripcion + '</td>';
      template += '          <td>' + element.N_serie_Aeronave.Numero_de_Serie + '</td>';
      template += '          <td>' + element.Propietario_Propietarios.Nombre + '</td>';
      template += '          <td>' + element.Fecha_ultima_actualizacion + '</td>';
      template += '          <td>' + element.Usuario_que_actualizo_Spartan_User.Name + '</td>';
      template += '          <td>' + element.Codigo_Computarizado_Descripcion + '</td>';
      template += '          <td>' + element.Codigo_ATA + '</td>';
      template += '          <td>' + element.N_Parte + '</td>';
      template += '          <td>' + element.N_de_Serie_Filtro + '</td>';
		  
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
	template += '\t N° serie';
	template += '\t Propietario';
	template += '\t Fecha última actualización';
	template += '\t Usuario que actualizó';
	template += '\t Código Computarizado/Descripción';
	template += '\t Código ATA';
	template += '\t N° Parte';
	template += '\t N° de Serie';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
      template += '\t ' + element.Matricula_Aeronave.Matricula;
      template += '\t ' + element.Modelo_Modelos.Descripcion;
      template += '\t ' + element.N_serie_Aeronave.Numero_de_Serie;
      template += '\t ' + element.Propietario_Propietarios.Nombre;
	  template += '\t ' + element.Fecha_ultima_actualizacion;
      template += '\t ' + element.Usuario_que_actualizo_Spartan_User.Name;
	  template += '\t ' + element.Codigo_Computarizado_Descripcion;
	  template += '\t ' + element.Codigo_ATA;
	  template += '\t ' + element.N_Parte;
	  template += '\t ' + element.N_de_Serie_Filtro;

	  template += '\n';
    });

    return template;
  }

}

export class Control_Componentes_de_la_AeronaveDataSource implements DataSource<Control_Componentes_de_la_Aeronave>
{
  private subject = new BehaviorSubject<Control_Componentes_de_la_Aeronave[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Control_Componentes_de_la_AeronaveService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Control_Componentes_de_la_Aeronave[]> {
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
              const longest = result.Control_Componentes_de_la_Aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Control_Componentes_de_la_Aeronaves);
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
      condition += " and Control_Componentes_de_la_Aeronave.Folio = " + data.filter.Folio;
    if (data.filter.Matricula != "")
      condition += " and Aeronave.Matricula like '%" + data.filter.Matricula + "%' ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.N_serie != "")
      condition += " and Aeronave.Numero_de_Serie like '%" + data.filter.N_serie + "%' ";
    if (data.filter.Propietario != "")
      condition += " and Propietarios.Nombre like '%" + data.filter.Propietario + "%' ";
    if (data.filter.Fecha_ultima_actualizacion)
      condition += " and CONVERT(VARCHAR(10), Control_Componentes_de_la_Aeronave.Fecha_ultima_actualizacion, 102)  = '" + moment(data.filter.Fecha_ultima_actualizacion).format("YYYY.MM.DD") + "'";
    if (data.filter.Usuario_que_actualizo != "")
      condition += " and Spartan_User.Name like '%" + data.filter.Usuario_que_actualizo + "%' ";
    if (data.filter.Codigo_Computarizado_Descripcion != "")
      condition += " and Control_Componentes_de_la_Aeronave.Codigo_Computarizado_Descripcion like '%" + data.filter.Codigo_Computarizado_Descripcion + "%' ";
    if (data.filter.Codigo_ATA != "")
      condition += " and Control_Componentes_de_la_Aeronave.Codigo_ATA like '%" + data.filter.Codigo_ATA + "%' ";
    if (data.filter.N_Parte != "")
      condition += " and Control_Componentes_de_la_Aeronave.N_Parte like '%" + data.filter.N_Parte + "%' ";
    if (data.filter.N_de_Serie_Filtro != "")
      condition += " and Control_Componentes_de_la_Aeronave.N_de_Serie_Filtro like '%" + data.filter.N_de_Serie_Filtro + "%' ";

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
        sort = " Control_Componentes_de_la_Aeronave.Folio " + data.sortDirecction;
        break;
      case "Matricula":
        sort = " Aeronave.Matricula " + data.sortDirecction;
        break;
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "N_serie":
        sort = " Aeronave.Numero_de_Serie " + data.sortDirecction;
        break;
      case "Propietario":
        sort = " Propietarios.Nombre " + data.sortDirecction;
        break;
      case "Fecha_ultima_actualizacion":
        sort = " Control_Componentes_de_la_Aeronave.Fecha_ultima_actualizacion " + data.sortDirecction;
        break;
      case "Usuario_que_actualizo":
        sort = " Spartan_User.Name " + data.sortDirecction;
        break;
      case "Codigo_Computarizado_Descripcion":
        sort = " Control_Componentes_de_la_Aeronave.Codigo_Computarizado_Descripcion " + data.sortDirecction;
        break;
      case "Codigo_ATA":
        sort = " Control_Componentes_de_la_Aeronave.Codigo_ATA " + data.sortDirecction;
        break;
      case "N_Parte":
        sort = " Control_Componentes_de_la_Aeronave.N_Parte " + data.sortDirecction;
        break;
      case "N_de_Serie_Filtro":
        sort = " Control_Componentes_de_la_Aeronave.N_de_Serie_Filtro " + data.sortDirecction;
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
        condition += " AND Control_Componentes_de_la_Aeronave.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Control_Componentes_de_la_Aeronave.Folio <= " + data.filterAdvanced.toFolio;
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
      condition += " AND Control_Componentes_de_la_Aeronave.Matricula In (" + Matriculads + ")";
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
      condition += " AND Control_Componentes_de_la_Aeronave.Modelo In (" + Modelods + ")";
    }
    if ((typeof data.filterAdvanced.N_serie != 'undefined' && data.filterAdvanced.N_serie)) {
      switch (data.filterAdvanced.N_serieFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Aeronave.Numero_de_Serie LIKE '" + data.filterAdvanced.N_serie + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.N_serie + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Aeronave.Numero_de_Serie LIKE '%" + data.filterAdvanced.N_serie + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Aeronave.Numero_de_Serie = '" + data.filterAdvanced.N_serie + "'";
          break;
      }
    } else if (data.filterAdvanced.N_serieMultiple != null && data.filterAdvanced.N_serieMultiple.length > 0) {
      var N_serieds = data.filterAdvanced.N_serieMultiple.join(",");
      condition += " AND Control_Componentes_de_la_Aeronave.N_serie In (" + N_serieds + ")";
    }
    if ((typeof data.filterAdvanced.Propietario != 'undefined' && data.filterAdvanced.Propietario)) {
      switch (data.filterAdvanced.PropietarioFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Propietarios.Nombre LIKE '" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Propietarios.Nombre LIKE '%" + data.filterAdvanced.Propietario + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Propietarios.Nombre = '" + data.filterAdvanced.Propietario + "'";
          break;
      }
    } else if (data.filterAdvanced.PropietarioMultiple != null && data.filterAdvanced.PropietarioMultiple.length > 0) {
      var Propietariods = data.filterAdvanced.PropietarioMultiple.join(",");
      condition += " AND Control_Componentes_de_la_Aeronave.Propietario In (" + Propietariods + ")";
    }
    if ((typeof data.filterAdvanced.fromFecha_ultima_actualizacion != 'undefined' && data.filterAdvanced.fromFecha_ultima_actualizacion)
	|| (typeof data.filterAdvanced.toFecha_ultima_actualizacion != 'undefined' && data.filterAdvanced.toFecha_ultima_actualizacion)) 
	{
      if (typeof data.filterAdvanced.fromFecha_ultima_actualizacion != 'undefined' && data.filterAdvanced.fromFecha_ultima_actualizacion) 
        condition += " and CONVERT(VARCHAR(10), Control_Componentes_de_la_Aeronave.Fecha_ultima_actualizacion, 102)  >= '" +  moment(data.filterAdvanced.fromFecha_ultima_actualizacion).format("YYYY.MM.DD") + "'";
      
      if (typeof data.filterAdvanced.toFecha_ultima_actualizacion != 'undefined' && data.filterAdvanced.toFecha_ultima_actualizacion) 
        condition += " and CONVERT(VARCHAR(10), Control_Componentes_de_la_Aeronave.Fecha_ultima_actualizacion, 102)  <= '" + moment(data.filterAdvanced.toFecha_ultima_actualizacion).format("YYYY.MM.DD") + "'";
    }
    if ((typeof data.filterAdvanced.Usuario_que_actualizo != 'undefined' && data.filterAdvanced.Usuario_que_actualizo)) {
      switch (data.filterAdvanced.Usuario_que_actualizoFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Spartan_User.Name LIKE '" + data.filterAdvanced.Usuario_que_actualizo + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_actualizo + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Spartan_User.Name LIKE '%" + data.filterAdvanced.Usuario_que_actualizo + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Spartan_User.Name = '" + data.filterAdvanced.Usuario_que_actualizo + "'";
          break;
      }
    } else if (data.filterAdvanced.Usuario_que_actualizoMultiple != null && data.filterAdvanced.Usuario_que_actualizoMultiple.length > 0) {
      var Usuario_que_actualizods = data.filterAdvanced.Usuario_que_actualizoMultiple.join(",");
      condition += " AND Control_Componentes_de_la_Aeronave.Usuario_que_actualizo In (" + Usuario_que_actualizods + ")";
    }
    switch (data.filterAdvanced.Codigo_Computarizado_DescripcionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_Componentes_de_la_Aeronave.Codigo_Computarizado_Descripcion LIKE '" + data.filterAdvanced.Codigo_Computarizado_Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_Componentes_de_la_Aeronave.Codigo_Computarizado_Descripcion LIKE '%" + data.filterAdvanced.Codigo_Computarizado_Descripcion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_Componentes_de_la_Aeronave.Codigo_Computarizado_Descripcion LIKE '%" + data.filterAdvanced.Codigo_Computarizado_Descripcion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_Componentes_de_la_Aeronave.Codigo_Computarizado_Descripcion = '" + data.filterAdvanced.Codigo_Computarizado_Descripcion + "'";
        break;
    }
    switch (data.filterAdvanced.Codigo_ATAFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_Componentes_de_la_Aeronave.Codigo_ATA LIKE '" + data.filterAdvanced.Codigo_ATA + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_Componentes_de_la_Aeronave.Codigo_ATA LIKE '%" + data.filterAdvanced.Codigo_ATA + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_Componentes_de_la_Aeronave.Codigo_ATA LIKE '%" + data.filterAdvanced.Codigo_ATA + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_Componentes_de_la_Aeronave.Codigo_ATA = '" + data.filterAdvanced.Codigo_ATA + "'";
        break;
    }
    switch (data.filterAdvanced.N_ParteFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_Componentes_de_la_Aeronave.N_Parte LIKE '" + data.filterAdvanced.N_Parte + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_Componentes_de_la_Aeronave.N_Parte LIKE '%" + data.filterAdvanced.N_Parte + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_Componentes_de_la_Aeronave.N_Parte LIKE '%" + data.filterAdvanced.N_Parte + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_Componentes_de_la_Aeronave.N_Parte = '" + data.filterAdvanced.N_Parte + "'";
        break;
    }
    switch (data.filterAdvanced.N_de_Serie_FiltroFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Control_Componentes_de_la_Aeronave.N_de_Serie_Filtro LIKE '" + data.filterAdvanced.N_de_Serie_Filtro + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Control_Componentes_de_la_Aeronave.N_de_Serie_Filtro LIKE '%" + data.filterAdvanced.N_de_Serie_Filtro + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Control_Componentes_de_la_Aeronave.N_de_Serie_Filtro LIKE '%" + data.filterAdvanced.N_de_Serie_Filtro + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Control_Componentes_de_la_Aeronave.N_de_Serie_Filtro = '" + data.filterAdvanced.N_de_Serie_Filtro + "'";
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
              const longest = result.Control_Componentes_de_la_Aeronaves.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Control_Componentes_de_la_Aeronaves);
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
