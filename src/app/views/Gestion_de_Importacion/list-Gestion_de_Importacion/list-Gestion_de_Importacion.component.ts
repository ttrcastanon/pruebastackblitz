import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { TranslateService } from "@ngx-translate/core";
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { HtmlEditorDialogComponent } from '../../../shared/views/dialogs/html-editor-dialog/html-editor-dialog.component'
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { Gestion_de_ImportacionService } from "src/app/api-services/Gestion_de_Importacion.service";
import { Gestion_de_Importacion } from "src/app/models/Gestion_de_Importacion";
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
import { Gestion_de_ImportacionIndexRules } from 'src/app/shared/businessRules/Gestion_de_Importacion-index-rules';
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
  selector: "app-list-Gestion_de_Importacion",
  templateUrl: "./list-Gestion_de_Importacion.component.html",
  styleUrls: ["./list-Gestion_de_Importacion.component.scss"],
})
export class ListGestion_de_ImportacionComponent extends Gestion_de_ImportacionIndexRules implements OnInit, AfterViewInit, AfterViewChecked {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "acciones",
    "Folio",
    "No__Items_asociados",
    "Transporte",
    "Clave_de_Pedimento",
    "No__de_Pedimento",
    "Miscelanea",
    "No__de_Guia",
    "Servicio_Aduanales",
    "FolioGestiondeImportacion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "acciones",
      "Folio",
      "No__Items_asociados",
      "Transporte",
      "Clave_de_Pedimento",
      "No__de_Pedimento",
      "Miscelanea",
      "No__de_Guia",
      "Servicio_Aduanales",
      "FolioGestiondeImportacion",

    ],
    columns_filters: [
      "acciones_filtro",
      "Folio_filtro",
      "No__Items_asociados_filtro",
      "Transporte_filtro",
      "Clave_de_Pedimento_filtro",
      "No__de_Pedimento_filtro",
      "Miscelanea_filtro",
      "No__de_Guia_filtro",
      "Servicio_Aduanales_filtro",
      "FolioGestiondeImportacion_filtro",

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
      No__Items_asociados: "",
      Transporte: "",
      Clave_de_Pedimento: "",
      No__de_Pedimento: "",
      Miscelanea: "",
      No__de_Guia: "",
      Servicio_Aduanales: "",
      FolioGestiondeImportacion: "",
		
    },
    filterAdvanced: {
      fromFolio: "",
      toFolio: "",
      fromNo__Items_asociados: "",
      toNo__Items_asociados: "",
      TransporteFilter: "",
      Transporte: "",
      TransporteMultiple: "",
      fromNo__de_Pedimento: "",
      toNo__de_Pedimento: "",
      MiscelaneaFilter: "",
      Miscelanea: "",
      MiscelaneaMultiple: "",
      fromNo__de_Guia: "",
      toNo__de_Guia: "",
      Servicio_AduanalesFilter: "",
      Servicio_Aduanales: "",
      Servicio_AduanalesMultiple: "",

    }
  };

  dataSource: Gestion_de_ImportacionDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Gestion_de_ImportacionDataSource;
  dataClipboard: any;

  constructor(
    private _Gestion_de_ImportacionService: Gestion_de_ImportacionService,
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
    this.dataSource = new Gestion_de_ImportacionDataSource(
      this._Gestion_de_ImportacionService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Gestion_de_Importacion)
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
    this.listConfig.filter.No__Items_asociados = "";
    this.listConfig.filter.Transporte = "";
    this.listConfig.filter.Clave_de_Pedimento = "";
    this.listConfig.filter.No__de_Pedimento = "";
    this.listConfig.filter.Miscelanea = "";
    this.listConfig.filter.No__de_Guia = "";
    this.listConfig.filter.Servicio_Aduanales = "";
    this.listConfig.filter.FolioGestiondeImportacion = "";

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

  remove(row: Gestion_de_Importacion) {
    this._messages
      .confirmation(
        "¿Está seguro de que desea eliminar este registro?",
        ""
      )
      .then(() => {
        this.dataSource.loadingSubject.next(true);
        this._Gestion_de_ImportacionService
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
  ActionPrint(dataRow: Gestion_de_Importacion) {

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
,'No. Items asociados'
,'Transporte'
,'Clave de Pedimento'
,'No. de Pedimento'
,'Miscelánea'
,'No. de Guía'
,'Agencia Aduanal'
,'FolioGestiondeImportacion'

    ]
    new_data.push(header);
    data.forEach(x => {
      let new_content = [
x.Folio
,x.No__Items_asociados
,x.Transporte_Tipo_de_Transporte.Descripcion
,x.Clave_de_Pedimento
,x.No__de_Pedimento
,x.Miscelanea_Tipo_de_Miscelaneas.Descripcion
,x.No__de_Guia
,x.Servicio_Aduanales_Servicios_Aduanales.Descripcion
,x.FolioGestiondeImportacion
		  
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
    pdfMake.createPdf(pdfDefinition).download('Gestion_de_Importacion.pdf');
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
          this._Gestion_de_ImportacionService.listaSelAll(starRowIndex, maximumRows, condition, sort)
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Gestion_de_Importacions;
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
          this._Gestion_de_ImportacionService.listaSelAll(1, 9999, '', '')
            .subscribe((response: any) => {
              this.dataSourceTemp = response.Gestion_de_Importacions;
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
        'No. Items asociados ': fields.No__Items_asociados,
        'Transporte ': fields.Transporte_Tipo_de_Transporte.Descripcion,
        'Clave de Pedimento ': fields.Clave_de_Pedimento,
        'No. de Pedimento ': fields.No__de_Pedimento,
        'Miscelánea ': fields.Miscelanea_Tipo_de_Miscelaneas.Descripcion,
        'No. de Guía ': fields.No__de_Guia,
        'Agencia Aduanal ': fields.Servicio_Aduanales_Servicios_Aduanales.Descripcion,
        'FolioGestiondeImportacion ': fields.FolioGestiondeImportacion,

      };
    });
    this.excelService.exportAsExcelFile(excelData, `Gestion_de_Importacion  ${new Date().toLocaleString()}`);
  }

  /**
   * Exportar a CSV
   * @param data : Data a exportar
   */
  ExportToCSV(data: any) {
    var result = data.map(x => ({
      Folio: x.Folio,
      No__Items_asociados: x.No__Items_asociados,
      Transporte: x.Transporte_Tipo_de_Transporte.Descripcion,
      Clave_de_Pedimento: x.Clave_de_Pedimento,
      No__de_Pedimento: x.No__de_Pedimento,
      Miscelanea: x.Miscelanea_Tipo_de_Miscelaneas.Descripcion,
      No__de_Guia: x.No__de_Guia,
      Servicio_Aduanales: x.Servicio_Aduanales_Servicios_Aduanales.Descripcion,
      FolioGestiondeImportacion: x.FolioGestiondeImportacion,

    }));

    this.excelService.exportToCsv(result, 'Gestion_de_Importacion',  ['Folio'    ,'No__Items_asociados'  ,'Transporte'  ,'Clave_de_Pedimento'  ,'No__de_Pedimento'  ,'Miscelanea'  ,'No__de_Guia'  ,'Servicio_Aduanales'  ,'FolioGestiondeImportacion' ]);
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
    template += '          <th>No. Items asociados</th>';
    template += '          <th>Transporte</th>';
    template += '          <th>Clave de Pedimento</th>';
    template += '          <th>No. de Pedimento</th>';
    template += '          <th>Miscelánea</th>';
    template += '          <th>No. de Guía</th>';
    template += '          <th>Agencia Aduanal</th>';
    template += '          <th>FolioGestiondeImportacion</th>';

    template += '      </tr>';
    template += '  </thead>';
    template += '  <tbody>';

    data.forEach(element => {
      template += '      <tr>';
      template += '          <td>' + element.Folio + '</td>';
      template += '          <td>' + element.No__Items_asociados + '</td>';
      template += '          <td>' + element.Transporte_Tipo_de_Transporte.Descripcion + '</td>';
      template += '          <td>' + element.Clave_de_Pedimento + '</td>';
      template += '          <td>' + element.No__de_Pedimento + '</td>';
      template += '          <td>' + element.Miscelanea_Tipo_de_Miscelaneas.Descripcion + '</td>';
      template += '          <td>' + element.No__de_Guia + '</td>';
      template += '          <td>' + element.Servicio_Aduanales_Servicios_Aduanales.Descripcion + '</td>';
      template += '          <td>' + element.FolioGestiondeImportacion + '</td>';
		  
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
	template += '\t No. Items asociados';
	template += '\t Transporte';
	template += '\t Clave de Pedimento';
	template += '\t No. de Pedimento';
	template += '\t Miscelánea';
	template += '\t No. de Guía';
	template += '\t Agencia Aduanal';
	template += '\t FolioGestiondeImportacion';

	template += '\n';

    data.forEach(element => {
	  template += '\t ' + element.Folio;
	  template += '\t ' + element.No__Items_asociados;
      template += '\t ' + element.Transporte_Tipo_de_Transporte.Descripcion;
	  template += '\t ' + element.Clave_de_Pedimento;
	  template += '\t ' + element.No__de_Pedimento;
      template += '\t ' + element.Miscelanea_Tipo_de_Miscelaneas.Descripcion;
	  template += '\t ' + element.No__de_Guia;
      template += '\t ' + element.Servicio_Aduanales_Servicios_Aduanales.Descripcion;
	  template += '\t ' + element.FolioGestiondeImportacion;

	  template += '\n';
    });

    return template;
  }

}

export class Gestion_de_ImportacionDataSource implements DataSource<Gestion_de_Importacion>
{
  private subject = new BehaviorSubject<Gestion_de_Importacion[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Gestion_de_ImportacionService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Gestion_de_Importacion[]> {
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
              const longest = result.Gestion_de_Importacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Gestion_de_Importacions);
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
      condition += " and Gestion_de_Importacion.Folio = " + data.filter.Folio;
    if (data.filter.No__Items_asociados != "")
      condition += " and Gestion_de_Importacion.No__Items_asociados = " + data.filter.No__Items_asociados;
    if (data.filter.Transporte != "")
      condition += " and Tipo_de_Transporte.Descripcion like '%" + data.filter.Transporte + "%' ";
    if (data.filter.Clave_de_Pedimento != "")
      condition += " and Gestion_de_Importacion.Clave_de_Pedimento like '%" + data.filter.Clave_de_Pedimento + "%' ";
    if (data.filter.No__de_Pedimento != "")
      condition += " and Gestion_de_Importacion.No__de_Pedimento = " + data.filter.No__de_Pedimento;
    if (data.filter.Miscelanea != "")
      condition += " and Tipo_de_Miscelaneas.Descripcion like '%" + data.filter.Miscelanea + "%' ";
    if (data.filter.No__de_Guia != "")
      condition += " and Gestion_de_Importacion.No__de_Guia = " + data.filter.No__de_Guia;
    if (data.filter.Servicio_Aduanales != "")
      condition += " and Servicios_Aduanales.Descripcion like '%" + data.filter.Servicio_Aduanales + "%' ";
    if (data.filter.FolioGestiondeImportacion != "")
      condition += " and Gestion_de_Importacion.FolioGestiondeImportacion like '%" + data.filter.FolioGestiondeImportacion + "%' ";

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
        sort = " Gestion_de_Importacion.Folio " + data.sortDirecction;
        break;
      case "No__Items_asociados":
        sort = " Gestion_de_Importacion.No__Items_asociados " + data.sortDirecction;
        break;
      case "Transporte":
        sort = " Tipo_de_Transporte.Descripcion " + data.sortDirecction;
        break;
      case "Clave_de_Pedimento":
        sort = " Gestion_de_Importacion.Clave_de_Pedimento " + data.sortDirecction;
        break;
      case "No__de_Pedimento":
        sort = " Gestion_de_Importacion.No__de_Pedimento " + data.sortDirecction;
        break;
      case "Miscelanea":
        sort = " Tipo_de_Miscelaneas.Descripcion " + data.sortDirecction;
        break;
      case "No__de_Guia":
        sort = " Gestion_de_Importacion.No__de_Guia " + data.sortDirecction;
        break;
      case "Servicio_Aduanales":
        sort = " Servicios_Aduanales.Descripcion " + data.sortDirecction;
        break;
      case "FolioGestiondeImportacion":
        sort = " Gestion_de_Importacion.FolioGestiondeImportacion " + data.sortDirecction;
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
        condition += " AND Gestion_de_Importacion.Folio >= " + data.filterAdvanced.fromFolio;

      if (typeof data.filterAdvanced.toFolio != 'undefined' && data.filterAdvanced.toFolio) 
        condition += " AND Gestion_de_Importacion.Folio <= " + data.filterAdvanced.toFolio;
    }
    if ((typeof data.filterAdvanced.fromNo__Items_asociados != 'undefined' && data.filterAdvanced.fromNo__Items_asociados)
	|| (typeof data.filterAdvanced.toNo__Items_asociados != 'undefined' && data.filterAdvanced.toNo__Items_asociados)) 
	{
      if (typeof data.filterAdvanced.fromNo__Items_asociados != 'undefined' && data.filterAdvanced.fromNo__Items_asociados)
        condition += " AND Gestion_de_Importacion.No__Items_asociados >= " + data.filterAdvanced.fromNo__Items_asociados;

      if (typeof data.filterAdvanced.toNo__Items_asociados != 'undefined' && data.filterAdvanced.toNo__Items_asociados) 
        condition += " AND Gestion_de_Importacion.No__Items_asociados <= " + data.filterAdvanced.toNo__Items_asociados;
    }
    if ((typeof data.filterAdvanced.Transporte != 'undefined' && data.filterAdvanced.Transporte)) {
      switch (data.filterAdvanced.TransporteFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Transporte.Descripcion LIKE '" + data.filterAdvanced.Transporte + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Transporte.Descripcion LIKE '%" + data.filterAdvanced.Transporte + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Transporte.Descripcion LIKE '%" + data.filterAdvanced.Transporte + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Transporte.Descripcion = '" + data.filterAdvanced.Transporte + "'";
          break;
      }
    } else if (data.filterAdvanced.TransporteMultiple != null && data.filterAdvanced.TransporteMultiple.length > 0) {
      var Transporteds = data.filterAdvanced.TransporteMultiple.join(",");
      condition += " AND Gestion_de_Importacion.Transporte In (" + Transporteds + ")";
    }
    switch (data.filterAdvanced.Clave_de_PedimentoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Gestion_de_Importacion.Clave_de_Pedimento LIKE '" + data.filterAdvanced.Clave_de_Pedimento + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Gestion_de_Importacion.Clave_de_Pedimento LIKE '%" + data.filterAdvanced.Clave_de_Pedimento + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Gestion_de_Importacion.Clave_de_Pedimento LIKE '%" + data.filterAdvanced.Clave_de_Pedimento + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Gestion_de_Importacion.Clave_de_Pedimento = '" + data.filterAdvanced.Clave_de_Pedimento + "'";
        break;
    }
    if ((typeof data.filterAdvanced.fromNo__de_Pedimento != 'undefined' && data.filterAdvanced.fromNo__de_Pedimento)
	|| (typeof data.filterAdvanced.toNo__de_Pedimento != 'undefined' && data.filterAdvanced.toNo__de_Pedimento)) 
	{
      if (typeof data.filterAdvanced.fromNo__de_Pedimento != 'undefined' && data.filterAdvanced.fromNo__de_Pedimento)
        condition += " AND Gestion_de_Importacion.No__de_Pedimento >= " + data.filterAdvanced.fromNo__de_Pedimento;

      if (typeof data.filterAdvanced.toNo__de_Pedimento != 'undefined' && data.filterAdvanced.toNo__de_Pedimento) 
        condition += " AND Gestion_de_Importacion.No__de_Pedimento <= " + data.filterAdvanced.toNo__de_Pedimento;
    }
    if ((typeof data.filterAdvanced.Miscelanea != 'undefined' && data.filterAdvanced.Miscelanea)) {
      switch (data.filterAdvanced.MiscelaneaFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Tipo_de_Miscelaneas.Descripcion LIKE '" + data.filterAdvanced.Miscelanea + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Tipo_de_Miscelaneas.Descripcion LIKE '%" + data.filterAdvanced.Miscelanea + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Tipo_de_Miscelaneas.Descripcion LIKE '%" + data.filterAdvanced.Miscelanea + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Tipo_de_Miscelaneas.Descripcion = '" + data.filterAdvanced.Miscelanea + "'";
          break;
      }
    } else if (data.filterAdvanced.MiscelaneaMultiple != null && data.filterAdvanced.MiscelaneaMultiple.length > 0) {
      var Miscelaneads = data.filterAdvanced.MiscelaneaMultiple.join(",");
      condition += " AND Gestion_de_Importacion.Miscelanea In (" + Miscelaneads + ")";
    }
    if ((typeof data.filterAdvanced.fromNo__de_Guia != 'undefined' && data.filterAdvanced.fromNo__de_Guia)
	|| (typeof data.filterAdvanced.toNo__de_Guia != 'undefined' && data.filterAdvanced.toNo__de_Guia)) 
	{
      if (typeof data.filterAdvanced.fromNo__de_Guia != 'undefined' && data.filterAdvanced.fromNo__de_Guia)
        condition += " AND Gestion_de_Importacion.No__de_Guia >= " + data.filterAdvanced.fromNo__de_Guia;

      if (typeof data.filterAdvanced.toNo__de_Guia != 'undefined' && data.filterAdvanced.toNo__de_Guia) 
        condition += " AND Gestion_de_Importacion.No__de_Guia <= " + data.filterAdvanced.toNo__de_Guia;
    }
    if ((typeof data.filterAdvanced.Servicio_Aduanales != 'undefined' && data.filterAdvanced.Servicio_Aduanales)) {
      switch (data.filterAdvanced.Servicio_AduanalesFilter) {
        case Enumerations.Enums.Filters.BeginWith:
          condition += " AND Servicios_Aduanales.Descripcion LIKE '" + data.filterAdvanced.Servicio_Aduanales + "%'";
          break;
        case Enumerations.Enums.Filters.Contains:
          condition += " AND Servicios_Aduanales.Descripcion LIKE '%" + data.filterAdvanced.Servicio_Aduanales + "%'";
          break;
        case Enumerations.Enums.Filters.EndWith:
          condition += " AND Servicios_Aduanales.Descripcion LIKE '%" + data.filterAdvanced.Servicio_Aduanales + "'";
          break;
        case Enumerations.Enums.Filters.Exact:
          condition += " AND Servicios_Aduanales.Descripcion = '" + data.filterAdvanced.Servicio_Aduanales + "'";
          break;
      }
    } else if (data.filterAdvanced.Servicio_AduanalesMultiple != null && data.filterAdvanced.Servicio_AduanalesMultiple.length > 0) {
      var Servicio_Aduanalesds = data.filterAdvanced.Servicio_AduanalesMultiple.join(",");
      condition += " AND Gestion_de_Importacion.Servicio_Aduanales In (" + Servicio_Aduanalesds + ")";
    }
    switch (data.filterAdvanced.FolioGestiondeImportacionFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Gestion_de_Importacion.FolioGestiondeImportacion LIKE '" + data.filterAdvanced.FolioGestiondeImportacion + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Gestion_de_Importacion.FolioGestiondeImportacion LIKE '%" + data.filterAdvanced.FolioGestiondeImportacion + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Gestion_de_Importacion.FolioGestiondeImportacion LIKE '%" + data.filterAdvanced.FolioGestiondeImportacion + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Gestion_de_Importacion.FolioGestiondeImportacion = '" + data.filterAdvanced.FolioGestiondeImportacion + "'";
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
              const longest = result.Gestion_de_Importacions.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Gestion_de_Importacions);
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
