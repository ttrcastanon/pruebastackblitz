import { AfterViewChecked, AfterViewInit, Component, ElementRef, OnInit, ViewChild,Renderer2 } from "@angular/core";
import { Codigo_ComputarizadoIndexRules } from 'src/app/shared/businessRules/Codigo_Computarizado-index-rules';
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { Codigo_ComputarizadoService } from "src/app/api-services/Codigo_Computarizado.service";
import { Codigo_Computarizado } from "src/app/models/Codigo_Computarizado";
import { CollectionViewer, SelectionModel } from "@angular/cdk/collections";
import { MatPaginator } from "@angular/material/paginator";
import { DataSource } from "@angular/cdk/collections";
import { BehaviorSubject, forkJoin, fromEvent, merge, Observable, of } from "rxjs";
import { catchError, finalize, concatMap, switchMap, mergeMap, tap } from "rxjs/operators";
import { SpartanService } from "src/app/api-services/spartan.service";
import { MatSort } from "@angular/material/sort";
import * as moment from "moment";
import { Enumerations } from 'src/app/models/enumerations';
import _, { map } from 'underscore';
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { MessagesHelper } from "./../../../helpers/messages-helper";
import { LocalStorageHelper } from "../../../helpers/local-storage-helper";
import { SpartanUserService } from 'src/app/api-services/spartan-user.service';
import { TranslateService } from "@ngx-translate/core";
import { StorageKeys } from "../../../app-constants";
import * as AppConstants from "../../../app-constants";
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import {MatDialog, MatDialogRef, MAT_DIALOG_DATA} from '@angular/material/dialog';

@Component({
  selector: 'app-poup-codigocomputarizado',
  templateUrl: './poup-codigocomputarizado.component.html',
  styleUrls: ['./poup-codigocomputarizado.component.sass']
})
export class PoupCodigocomputarizadoComponent extends Codigo_ComputarizadoIndexRules implements OnInit, AfterViewInit, AfterViewChecked  {
  brf: BusinessRulesFunctions;
  displayedColumns = [
    "select",
    "Modelo",
    "Codigo",
    "Descripcion",
    "Tiempo_Estandar",
    "Descripcion_Busqueda",
    "Por_Defecto_en_Cotizacion",

  ];

  permisos: ObjectPermission[] = [];

  public listConfig = {
    columns: [
      "select",
      "Modelo",
      "Codigo",
      "Descripcion",
      "Tiempo_Estandar",
      "Descripcion_Busqueda",
      "Por_Defecto_en_Cotizacion",

    ],
    columns_filters: [
  
      "Modelo_filtro",
      "Codigo_filtro",
      "Descripcion_filtro",
      "Tiempo_Estandar_filtro",
      "Descripcion_Busqueda_filtro",
      "Por_Defecto_en_Cotizacion_filtro",

    ],
    page: 0,
    size: 10,
    sortField: "",
    sortDirecction: "",
    advancedSearch: false,
    filter: {
      Modelo: "",
      Codigo: "",
      Descripcion: "",
      Tiempo_Estandar: "",
      Descripcion_Busqueda: "",
      Por_Defecto_en_Cotizacion: "",
		
    },
    filterAdvanced: {
      ModeloFilter: "",
      Modelo: "",
      ModeloMultiple: "",
      fromCodigo: "",
      toCodigo: "",
      fromTiempo_Estandar: "",
      toTiempo_Estandar: "",

    }
  };

  dataSource: Codigo_ComputarizadoDialogDataSource | null;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  dataSourceTemp: Codigo_ComputarizadoDialogDataSource;
  selection = new SelectionModel<Codigo_Computarizado>(true, []);
  dataClipboard: any;
  constructor(public dialogRef: MatDialogRef<PoupCodigocomputarizadoComponent>,
    private _Codigo_ComputarizadoService: Codigo_ComputarizadoService,
    private _messages: MessagesHelper,
    private _seguridad: SeguridadService,
    private _translate: TranslateService,
    private _localHelper: LocalStorageHelper,
    public _file: SpartanFileService,
    _user: SpartanUserService,
    private localStorageHelper: LocalStorageHelper,
    private SpartanService: SpartanService,renderer: Renderer2
  ) {
    super();
    this.brf = new BusinessRulesFunctions(renderer, SpartanService, localStorageHelper);
    const lang = this._localHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);
  }
  ngAfterViewInit() {
    //this.rulesAfterViewInit();  
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
    //this.loadPaginatorTranslate();
  }

  ngAfterViewChecked() {
    //this.rulesAfterViewChecked();
  }

  ngOnInit() {
    this.dataSource = new Codigo_ComputarizadoDialogDataSource(
      this._Codigo_ComputarizadoService, this._file
    );
    this.init();
    this._seguridad
      .permisos(AppConstants.Permisos.Codigo_Computarizado)
      .subscribe((response) => {
        this.permisos = response;
      });
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
  
  refresh() {
    this.listConfig.page = 0;
    this.loadData();
  }

  selectHandler(row: Codigo_Computarizado) {

    this.selection.toggle(row);
  }
addCotizacion(){


  const cliente = this._localHelper.getItemFromLocalStorage("ClienteSeleccionado");
  console.log("cliente",cliente);
  console.log(this.selection.isEmpty());
    if(this.selection.isEmpty()==true){
      alert("No se han seleccionado registros.")
      return;
    }
    let Folios:string="";
    console.log(this.selection.selected);
    if (cliente == null||cliente=="") {
      this.selection.selected.forEach(element => 
        {console.log(element)
          console.log("EXEC uspInsCodigoCompurizadoSeleccionadosCompuestos '" + element.Codigo + "', 0, '" + element.Modelo_Modelos.Descripcion + "', '" + element.Descripcion+ "'",1,"ABCD123")
         // setTimeout(() => {
            //let folio = this.brf.EvaluaQueryAsync("EXEC uspInsCodigoCompurizadoSeleccionadosCompuestos '" + element.Codigo + "', 0, '" + element.Modelo_Modelos.Descripcion+ "', '" + element.Descripcion+ "'",1,"ABCD123");
            Folios = Folios + "," + element.Codigo;
            this.localStorageHelper.setItemToLocalStorage("GetCogidosSeleccionados", Folios);
         // }, 500);
          console.log(Folios)
      });
    }
    else{
      this.selection.selected.forEach(element => {console.log(element)
      //  setTimeout(() => {
          //let folio = this.brf.EvaluaQueryAsync("EXEC uspInsCodigoCompurizadoSeleccionadosCompuestos '" + element.Codigo + "', " + cliente + ", '" + element.Modelo_Modelos.Descripcion + "', '" + element.Descripcion + "'",1,"ABCD123");
          Folios = Folios + "," + element.Codigo;
          this.localStorageHelper.setItemToLocalStorage("GetCogidosSeleccionados", Folios);
        //}, 500);

       
      });
    }
    console.log(Folios)
    this.localStorageHelper.setItemToLocalStorage("GetCogidosSeleccionados", Folios);
    setTimeout(() => { this.dialogRef.close(); }, 3000);
    
 // this.brf.ShowMessage("message: string")
}
closeDialog(){
  this.dialogRef.close();
}
}
export class Codigo_ComputarizadoDialogDataSource implements DataSource<Codigo_Computarizado>
{
  private subject = new BehaviorSubject<Codigo_Computarizado[]>([]);
  public loadingSubject = new BehaviorSubject<boolean>(false);
  private totalSubject = new BehaviorSubject<number>(0);

  public loading$ = this.loadingSubject.asObservable();

  public total$ = this.totalSubject.asObservable();

  constructor(private service: Codigo_ComputarizadoService, private _file: SpartanFileService) { }

  connect(
    collectionViewer: CollectionViewer
  ): Observable<Codigo_Computarizado[]> {
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
          if (column === 'Codigo') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Codigo_Computarizados.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        console.log(result)
        this.subject.next(result.Codigo_Computarizados);
        this.totalSubject.next(result.RowCount);
      });

  }

  /**
   * Formando la cláusula Where para la consulta
   * @param data : Contenedor de Filtros
   */
  SetWhereClause(data: any): string {

    let condition = "1 = 1 ";
    if (data.filter.Modelo != "")
      condition += " and Modelos.Descripcion like '%" + data.filter.Modelo + "%' ";
    if (data.filter.Codigo != "")
      condition += " and Codigo_Computarizado.Codigo like '%" + data.filter.Codigo + "%' ";
    if (data.filter.Descripcion != "")
      condition += " and Codigo_Computarizado.Descripcion like '%" + data.filter.Descripcion + "%' ";
    if (data.filter.Tiempo_Estandar != "")
      condition += " and Codigo_Computarizado.Tiempo_Estandar = '" + data.filter.Tiempo_Estandar + "'";
    if (data.filter.Descripcion_Busqueda != "")
      condition += " and Codigo_Computarizado.Descripcion_Busqueda like '%" + data.filter.Descripcion_Busqueda + "%' ";
    if (data.filter.Por_Defecto_en_Cotizacion && data.filter.Por_Defecto_en_Cotizacion != "2") {
      if (data.filter.Por_Defecto_en_Cotizacion == "0" || data.filter.Por_Defecto_en_Cotizacion == "") {
        condition += " and (Codigo_Computarizado.Por_Defecto_en_Cotizacion = 0 or Codigo_Computarizado.Por_Defecto_en_Cotizacion is null)";
      } else {
        condition += " and Codigo_Computarizado.Por_Defecto_en_Cotizacion = 1";
      }
    }

    return condition;
  }

  /**
   * Formando la cláusula Order para la consulta
   * @param data : Contenedor de Filtros
   */
  SetOrderClause(data: any): string {
    let sort: string = '';

    switch (data.sortField) {
      case "Modelo":
        sort = " Modelos.Descripcion " + data.sortDirecction;
        break;
      case "Codigo":
        sort = " Codigo_Computarizado.Codigo " + data.sortDirecction;
        break;
      case "Descripcion":
        sort = " Codigo_Computarizado.Descripcion " + data.sortDirecction;
        break;
      case "Tiempo_Estandar":
        sort = " Codigo_Computarizado.Tiempo_Estandar " + data.sortDirecction;
        break;
      case "Descripcion_Busqueda":
        sort = " Codigo_Computarizado.Descripcion_Busqueda " + data.sortDirecction;
        break;
      case "Por_Defecto_en_Cotizacion":
        sort = " Codigo_Computarizado.Por_Defecto_en_Cotizacion " + data.sortDirecction;
        break;

    }
    return sort;
  }

  loadAdvanced(data: any) {
    let sort = "";
    let condition = "1 = 1 ";
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
      condition += " AND Codigo_Computarizado.Modelo In (" + Modelods + ")";
    }
    switch (data.filterAdvanced.CodigoFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Codigo_Computarizado.Codigo LIKE '" + data.filterAdvanced.Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Codigo_Computarizado.Codigo LIKE '%" + data.filterAdvanced.Codigo + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Codigo_Computarizado.Codigo LIKE '%" + data.filterAdvanced.Codigo + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Codigo_Computarizado.Codigo = '" + data.filterAdvanced.Codigo + "'";
        break;
    }
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
    if ((typeof data.filterAdvanced.fromTiempo_Estandar != 'undefined' && data.filterAdvanced.fromTiempo_Estandar)
	|| (typeof data.filterAdvanced.toTiempo_Estandar != 'undefined' && data.filterAdvanced.toTiempo_Estandar)) 
	{
		if (typeof data.filterAdvanced.fromTiempo_Estandar != 'undefined' && data.filterAdvanced.fromTiempo_Estandar) 
			condition += " and Codigo_Computarizado.Tiempo_Estandar >= '" + data.filterAdvanced.fromTiempo_Estandar + "'";
      
		if (typeof data.filterAdvanced.toTiempo_Estandar != 'undefined' && data.filterAdvanced.toTiempo_Estandar) 
			condition += " and Codigo_Computarizado.Tiempo_Estandar <= '" + data.filterAdvanced.toTiempo_Estandar + "'";
    }
    switch (data.filterAdvanced.Descripcion_BusquedaFilter) {
      case Enumerations.Enums.Filters.BeginWith:
        condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '" + data.filterAdvanced.Descripcion_Busqueda + "%'";
        break;
      case Enumerations.Enums.Filters.Contains:
        condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Descripcion_Busqueda + "%'";
        break;
      case Enumerations.Enums.Filters.EndWith:
        condition += " AND Codigo_Computarizado.Descripcion_Busqueda LIKE '%" + data.filterAdvanced.Descripcion_Busqueda + "'";
        break;
      case Enumerations.Enums.Filters.Exact:
        condition += " AND Codigo_Computarizado.Descripcion_Busqueda = '" + data.filterAdvanced.Descripcion_Busqueda + "'";
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
          if (column === 'Codigo') { // Clave primaria
            data.styles[column] = `width: ${80}px; flex: 0 0 ${80}px !important;`;
          } else if (column != 'acciones' ) { // Campos que no son acciones ni HTML ni Archivos 
            try {
              const longest = result.Codigo_Computarizados.map(x => (x[column]) ? x[column].toString() : '').sort((a, b) => b.length - a.length)[0];
              const length = longest <= 15 ? 15 : longest.length;
              data.styles[column] = `width: ${length * 10}px; flex: 0 0 ${length * 10}px !important; min-width: ${100}px !important; max-width: ${300}px !important;`;
            } catch (error) {
              ;
            }
          } else if (false ) { // Campos que son HTML o Archivos
            data.styles[column] = `width: ${100}px; flex: 0 0 ${100}px !important;`;
          }
        });
        this.subject.next(result.Codigo_Computarizados);
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
