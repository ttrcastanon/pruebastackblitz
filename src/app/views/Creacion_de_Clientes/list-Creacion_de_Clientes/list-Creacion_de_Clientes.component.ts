import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Creacion_de_ClientesService } from "src/app/api-services/Creacion_de_Clientes.service";
import { Creacion_de_Clientes } from "src/app/models/Creacion_de_Clientes";
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
import { Creacion_de_ClientesIndexRules } from 'src/app/shared/businessRules/Creacion_de_Clientes-index-rules';
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
  selector: "app-list-Creacion_de_Clientes",
  templateUrl: "./list-Creacion_de_Clientes.component.html",
  styleUrls: ["./list-Creacion_de_Clientes.component.scss"],
})
export class ListCreacion_de_ClientesComponent extends Creacion_de_ClientesIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Clave",
    "Razon_Social",
    "Contacto",
    "Correo_Electronico",
    "Direccion_Fiscal",
    "Direccion_Postal",
    "Telefono_de_Contacto",
    "ID_Dynamics",
    "Estatus",
    "Pertenece_a_grupo_BAL",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Clave",
      "Razon_Social",
      "Contacto",
      "Correo_Electronico",
      "Direccion_Fiscal",
      "Direccion_Postal",
      "Telefono_de_Contacto",
      "ID_Dynamics",
      "Estatus",
      "Pertenece_a_grupo_BAL",

    ],
    columns_filters: [
      "acciones_filtro",
      "Clave_filtro",
      "Razon_Social_filtro",
      "Contacto_filtro",
      "Correo_Electronico_filtro",
      "Direccion_Fiscal_filtro",
      "Direccion_Postal_filtro",
      "Telefono_de_Contacto_filtro",
      "ID_Dynamics_filtro",
      "Estatus_filtro",
      "Pertenece_a_grupo_BAL_filtro",

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
      Razon_Social: "",
      Contacto: "",
      Correo_Electronico: "",
      Direccion_Fiscal: "",
      Direccion_Postal: "",
      Telefono_de_Contacto: "",
      ID_Dynamics: "",
      Estatus: "",
      Pertenece_a_grupo_BAL: "",
		
    },
    filterAdvanced: {
      fromClave: "",
      toClave: "",
      EstatusFilter: "",
      Estatus: "",
      EstatusMultiple: "",
      Pertenece_a_grupo_BALFilter: "",
      Pertenece_a_grupo_BAL: "",
      Pertenece_a_grupo_BALMultiple: "",

    }
  };

  dataSource: Creacion_de_ClientesDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Creacion_de_ClientesDataSource;
  dataClipboard: any;

  constructor(
    private _Creacion_de_ClientesService: Creacion_de_ClientesService,
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
    this.dataSource = new Creacion_de_ClientesDataSource(
      this._Creacion_de_ClientesService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Creacion_de_Clientes)
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
    this.listConfig.filter.Razon_Social = "";
    this.listConfig.filter.Contacto = "";
    this.listConfig.filter.Correo_Electronico = "";
    this.listConfig.filter.Direccion_Fiscal = "";
    this.listConfig.filter.Direccion_Postal = "";
    this.listConfig.filter.Telefono_de_Contacto = "";
    this.listConfig.filter.ID_Dynamics = "";
    this.listConfig.filter.Estatus = "";
    this.listConfig.filter.Pertenece_a_grupo_BAL = "";

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

  remove(row: Creacion_de_Clientes) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Creacion_de_ClientesService
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
  ActionPrint(dataRow: Creacion_de_Clientes) {

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
,'Razón Social'
,'Contacto'
,'Correo Electrónico'
,'Dirección Fiscal'
,'Dirección Postal'
,'Teléfono de Contacto'
,'ID Dynamics'
,'Estatus'
,'¿Pertenece a grupo BAL?'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Clave
,x.Razon_Social
,x.Contacto
,x.Correo_Electronico
,x.Direccion_Fiscal
,x.Direccion_Postal
,x.Telefono_de_Contacto
,x.ID_Dynamics
,x.Estatus_Estatus_de_Cliente.Descripcion
,x.Pertenece_a_grupo_BAL_Respuesta.Descripcion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Creacion_de_Clientes.pdf');
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
          this._Creacion_de_ClientesService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Creacion_de_Clientess;
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
          this._Creacion_de_ClientesService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Creacion_de_Clientess;
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
        'Razón Social ': fields.Razon_Social,
        'Contacto ': fields.Contacto,
        'Correo Electrónico ': fields.Correo_Electronico,
        'Dirección Fiscal ': fields.Direccion_Fiscal,
        'Dirección Postal ': fields.Direccion_Postal,
        'Teléfono de Contacto ': fields.Telefono_de_Contacto,
        'ID Dynamics ': fields.ID_Dynamics,
        'Estatus ': fields.Estatus_Estatus_de_Cliente.Descripcion,
        '¿Pertenece a grupo BAL? ': fields.Pertenece_a_grupo_BAL_Respuesta.Descripcion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Creacion_de_Clientes  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Clave: x.Clave,
      Razon_Social: x.Razon_Social,
      Contacto: x.Contacto,
      Correo_Electronico: x.Correo_Electronico,
      Direccion_Fiscal: x.Direccion_Fiscal,
      Direccion_Postal: x.Direccion_Postal,
      Telefono_de_Contacto: x.Telefono_de_Contacto,
      ID_Dynamics: x.ID_Dynamics,
      Estatus: x.Estatus_Estatus_de_Cliente.Descripcion,
      Pertenece_a_grupo_BAL: x.Pertenece_a_grupo_BAL_Respuesta.Descripcion,

    }));

    this.excelService.exportToCsv(result, 'Creacion_de_Clientes',  ['Clave'    ,'Razon_Social'  ,'Contacto'  ,'Correo_Electronico'  ,'Direccion_Fiscal'  ,'Direccion_Postal'  ,'Telefono_de_Contacto'  ,'ID_Dynamics'  ,'Estatus'  ,'Pertenece_a_grupo_BAL' ]);
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
    template += '          <th>Razón Social</th>';
    template += '          <th>Contacto</th>';
    template += '          <th>Correo Electrónico</th>';
    template += '          <th>Dirección Fiscal</th>';
    template += '          <th>Dirección Postal</th>';
    template += '          <th>Teléfono de Contacto</th>';
    template += '          <th>ID Dynamics</th>';
    template += '          <th>Estatus</th>';
    template += '          <th>¿Pertenece a grupo BAL?</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Clave + '</td>';
      template += '          <td>' + element.Razon_Social + '</td>';
      template += '          <td>' + element.Contacto + '</td>';
      template += '          <td>' + element.Correo_Electronico + '</td>';
      template += '          <td>' + element.Direccion_Fiscal + '</td>';
      template += '          <td>' + element.Direccion_Postal + '</td>';
      template += '          <td>' + element.Telefono_de_Contacto + '</td>';
      template += '          <td>' + element.ID_Dynamics + '</td>';
      template += '          <td>' + element.Estatus_Estatus_de_Cliente.Descripcion + '</td>';
      template += '          <td>' + element.Pertenece_a_grupo_BAL_Respuesta.Descripcion + '</td>';
		  
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
	template += '\t Razón Social';
	template += '\t Contacto';
	template += '\t Correo Electrónico';
	template += '\t Dirección Fiscal';
	template += '\t Dirección Postal';
	template += '\t Teléfono de Contacto';
	template += '\t ID Dynamics';
	template += '\t Estatus';
	template += '\t ¿Pertenece a grupo BAL?';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Clave;
	  template += '\t ' + element.Razon_Social;
	  template += '\t ' + element.Contacto;
	  template += '\t ' + element.Correo_Electronico;
	  template += '\t ' + element.Direccion_Fiscal;
	  template += '\t ' + element.Direccion_Postal;
	  template += '\t ' + element.Telefono_de_Contacto;
	  template += '\t ' + element.ID_Dynamics;
      template += '\t ' + element.Estatus_Estatus_de_Cliente.Descripcion;
      template += '\t ' + element.Pertenece_a_grupo_BAL_Respuesta.Descripcion;

	  template += '\n';
    });

    return template;
  }

}

export class Creacion_de_ClientesDataSource implements DataSource<Creacion_de_Clientes>
{
  private subject = new BehaviorSubject<Creacion_de_Clientes[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Creacion_de_ClientesService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Creacion_de_Clientes[]> {
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
              const longest = result.Creacion_de_Clientess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Creacion_de_Clientess);
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
      condition += " and Creacion_de_Clientes.Clave = " + data.filter.Clave;
    if (data.filter.Razon_Social != "")
      condition += " and Creacion_de_Clientes.Razon_Social like '%" + data.filter.Razon_Social + "%' ";
    if (data.filter.Contacto != "")
      condition += " and Creacion_de_Clientes.Contacto like '%" + data.filter.Contacto + "%' ";
    if (data.filter.Correo_Electronico != "")
      condition += " and Creacion_de_Clientes.Correo_Electronico like '%" + data.filter.Correo_Electronico + "%' ";
    if (data.filter.Direccion_Fiscal != "")
      condition += " and Creacion_de_Clientes.Direccion_Fiscal like '%" + data.filter.Direccion_Fiscal + "%' ";
    if (data.filter.Direccion_Postal != "")
      condition += " and Creacion_de_Clientes.Direccion_Postal like '%" + data.filter.Direccion_Postal + "%' ";
    if (data.filter.Telefono_de_Contacto != "")
      condition += " and Creacion_de_Clientes.Telefono_de_Contacto like '%" + data.filter.Telefono_de_Contacto + "%' ";
    if (data.filter.ID_Dynamics != "")
      condition += " and Creacion_de_Clientes.ID_Dynamics like '%" + data.filter.ID_Dynamics + "%' ";
    if (data.filter.Estatus != "")
      condition += " and Estatus_de_Cliente.Descripcion like '%" + data.filter.Estatus + "%' ";
    if (data.filter.Pertenece_a_grupo_BAL != "")
      condition += " and Respuesta.Descripcion like '%" + data.filter.Pertenece_a_grupo_BAL + "%' ";

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
        sort = " Creacion_de_Clientes.Clave " + data.sortDirecction;
        break;
      case "Razon_Social":
        sort = " Creacion_de_Clientes.Razon_Social " + data.sortDirecction;
        break;
      case "Contacto":
        sort = " Creacion_de_Clientes.Contacto " + data.sortDirecction;
        break;
      case "Correo_Electronico":
        sort = " Creacion_de_Clientes.Correo_Electronico " + data.sortDirecction;
        break;
      case "Direccion_Fiscal":
        sort = " Creacion_de_Clientes.Direccion_Fiscal " + data.sortDirecction;
        break;
      case "Direccion_Postal":
        sort = " Creacion_de_Clientes.Direccion_Postal " + data.sortDirecction;
        break;
      case "Telefono_de_Contacto":
        sort = " Creacion_de_Clientes.Telefono_de_Contacto " + data.sortDirecction;
        break;
      case "ID_Dynamics":
        sort = " Creacion_de_Clientes.ID_Dynamics " + data.sortDirecction;
        break;
      case "Estatus":
        sort = " Estatus_de_Cliente.Descripcion " + data.sortDirecction;
        break;
      case "Pertenece_a_grupo_BAL":
        sort = " Respuesta.Descripcion " + data.sortDirecction;
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
        condition += " AND Creacion_de_Clientes.Clave >= " + data.filterAdvanced.fromClave;

      if (typeof data.filterAdvanced.toClave != 'undefined' && data.filterAdvanced.toClave) 
        condition += " AND Creacion_de_Clientes.Clave <= " + data.filterAdvanced.toClave;
    }
    switch (data.filterAdvanced.Razon_SocialFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Clientes.Razon_Social LIKE '" + data.filterAdvanced.Razon_Social + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Clientes.Razon_Social LIKE '%" + data.filterAdvanced.Razon_Social + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Clientes.Razon_Social LIKE '%" + data.filterAdvanced.Razon_Social + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Clientes.Razon_Social = '" + data.filterAdvanced.Razon_Social + "'";
        break;
    }
    switch (data.filterAdvanced.ContactoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Clientes.Contacto LIKE '" + data.filterAdvanced.Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Clientes.Contacto LIKE '%" + data.filterAdvanced.Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Clientes.Contacto LIKE '%" + data.filterAdvanced.Contacto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Clientes.Contacto = '" + data.filterAdvanced.Contacto + "'";
        break;
    }
    switch (data.filterAdvanced.Correo_ElectronicoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Clientes.Correo_Electronico LIKE '" + data.filterAdvanced.Correo_Electronico + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Clientes.Correo_Electronico LIKE '%" + data.filterAdvanced.Correo_Electronico + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Clientes.Correo_Electronico LIKE '%" + data.filterAdvanced.Correo_Electronico + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Clientes.Correo_Electronico = '" + data.filterAdvanced.Correo_Electronico + "'";
        break;
    }
    switch (data.filterAdvanced.Direccion_FiscalFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Clientes.Direccion_Fiscal LIKE '" + data.filterAdvanced.Direccion_Fiscal + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Clientes.Direccion_Fiscal LIKE '%" + data.filterAdvanced.Direccion_Fiscal + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Clientes.Direccion_Fiscal LIKE '%" + data.filterAdvanced.Direccion_Fiscal + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Clientes.Direccion_Fiscal = '" + data.filterAdvanced.Direccion_Fiscal + "'";
        break;
    }
    switch (data.filterAdvanced.Direccion_PostalFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Clientes.Direccion_Postal LIKE '" + data.filterAdvanced.Direccion_Postal + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Clientes.Direccion_Postal LIKE '%" + data.filterAdvanced.Direccion_Postal + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Clientes.Direccion_Postal LIKE '%" + data.filterAdvanced.Direccion_Postal + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Clientes.Direccion_Postal = '" + data.filterAdvanced.Direccion_Postal + "'";
        break;
    }
    switch (data.filterAdvanced.Telefono_de_ContactoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Clientes.Telefono_de_Contacto LIKE '" + data.filterAdvanced.Telefono_de_Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Clientes.Telefono_de_Contacto LIKE '%" + data.filterAdvanced.Telefono_de_Contacto + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Clientes.Telefono_de_Contacto LIKE '%" + data.filterAdvanced.Telefono_de_Contacto + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Clientes.Telefono_de_Contacto = '" + data.filterAdvanced.Telefono_de_Contacto + "'";
        break;
    }
    switch (data.filterAdvanced.ID_DynamicsFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Creacion_de_Clientes.ID_Dynamics LIKE '" + data.filterAdvanced.ID_Dynamics + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Creacion_de_Clientes.ID_Dynamics LIKE '%" + data.filterAdvanced.ID_Dynamics + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Creacion_de_Clientes.ID_Dynamics LIKE '%" + data.filterAdvanced.ID_Dynamics + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Creacion_de_Clientes.ID_Dynamics = '" + data.filterAdvanced.ID_Dynamics + "'";
        break;
    }
    if ((typeof data.filterAdvanced.Estatus != 'undefined' && data.filterAdvanced.Estatus)) {
      switch (data.filterAdvanced.EstatusFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Estatus_de_Cliente.Descripcion LIKE '" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Estatus_de_Cliente.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Estatus_de_Cliente.Descripcion LIKE '%" + data.filterAdvanced.Estatus + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Estatus_de_Cliente.Descripcion = '" + data.filterAdvanced.Estatus + "'";
          break;
      }
    } else if (data.filterAdvanced.EstatusMultiple != null && data.filterAdvanced.EstatusMultiple.length > 0) {
      var Estatusds = data.filterAdvanced.EstatusMultiple.join(",");
      condition += " AND Creacion_de_Clientes.Estatus In (" + Estatusds + ")";
    }
    if ((typeof data.filterAdvanced.Pertenece_a_grupo_BAL != 'undefined' && data.filterAdvanced.Pertenece_a_grupo_BAL)) {
      switch (data.filterAdvanced.Pertenece_a_grupo_BALFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Respuesta.Descripcion LIKE '" + data.filterAdvanced.Pertenece_a_grupo_BAL + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Pertenece_a_grupo_BAL + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Respuesta.Descripcion LIKE '%" + data.filterAdvanced.Pertenece_a_grupo_BAL + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Respuesta.Descripcion = '" + data.filterAdvanced.Pertenece_a_grupo_BAL + "'";
          break;
      }
    } else if (data.filterAdvanced.Pertenece_a_grupo_BALMultiple != null && data.filterAdvanced.Pertenece_a_grupo_BALMultiple.length > 0) {
      var Pertenece_a_grupo_BALds = data.filterAdvanced.Pertenece_a_grupo_BALMultiple.join(",");
      condition += " AND Creacion_de_Clientes.Pertenece_a_grupo_BAL In (" + Pertenece_a_grupo_BALds + ")";
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
              const longest = result.Creacion_de_Clientess.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Creacion_de_Clientess);
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
