import { Component, OnInit, Renderer2 } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { ReportesService } from 'src/app/api-services/reportes.service';
import { SeguridadService } from 'src/app/api-services/seguridad.service';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { Spartan_ReportService } from 'src/app/api-services/Spartan_Report.service';
import { StorageKeys } from 'src/app/app-constants';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { Aeronave } from 'src/app/models/Aeronave';
import { ObjectPermission } from 'src/app/models/object-permission';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { ExcelUtil } from "src/app/helpers/excelUtil"
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import * as AppConstants from "../../../app-constants";

@Component({
  selector: 'app-list-reporte-gastos-de-vuelo',
  templateUrl: './list-reporte-gastos-de-vuelo.component.html',
  styleUrls: ['./list-reporte-gastos-de-vuelo.component.scss']
})
export class ListReporteGastosDeVueloComponent implements OnInit {

  title: string = "Listado de Gastos de Vuelo"
  filtrosForm: FormGroup;
  brf: BusinessRulesFunctions;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  permisos: ObjectPermission[] = [];
  reportId: number = 14
  reportObject: any

  listaEmpleados: Observable<Spartan_User[]>;
  listaAeronaves: Observable<Aeronave[]>;
  listaNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;

  isLoadingAeronaves: boolean = false
  isLoadingEmpleados: boolean = false
  isLoadingNumero_de_Vuelo: boolean = false

  notFound: string = "No se encontraron registros."
  loadingText: string = "Cargando..."

  isLoading = new BehaviorSubject<boolean>(false);


  constructor(
    renderer: Renderer2,
    private _spartanService: SpartanService,
    private _translate: TranslateService,
    private localStorageHelper: LocalStorageHelper,
    private spartan_UserService: Spartan_UserService,
    private aeronaveService: AeronaveService,
    private solicitud_de_VueloService: Solicitud_de_VueloService,
    private spartan_ReportService: Spartan_ReportService,
    private seguridadService: SeguridadService,
    private snackBar: MatSnackBar,

  ) {
    this.brf = new BusinessRulesFunctions(renderer, _spartanService, localStorageHelper);
    const lang = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this._translate.setDefaultLang(lang);
    this._translate.use(lang);

    this.filtrosForm = new FormGroup({
      Empleado: new FormControl(''),
      Matricula: new FormControl(''),
      Numero_de_Vuelo: new FormControl(''),

    });
  }

  ngOnInit(): void {
    this.seguridadService.permisos(AppConstants.Permisos.Gastos_de_Vuelo).subscribe((response) => {
      this.permisos = response;
    });

    this.searchSelects();
  }

  //#region Limpiar Filtros  
  clearFilter() {
    this.filtrosForm.reset()
  }
  //#endregion  


  //#region Completar información de Selects
  searchSelects(): void {
    this.searchEmpleados()
    this.searchAeronaves();
    this.searchNumero_de_Vuelo()

  }
  //#endregion


  //#region Consulta de Empleados
  searchEmpleados(term?: string) {
    this.isLoadingEmpleados = true;
    if (term == "" || term == null || term == undefined) {
      this.spartan_UserService.listaSelAll(0, 20, "").subscribe((result: any) => {
        this.isLoadingEmpleados = false;
        this.listaEmpleados = of(result?.Spartan_Users);
      }, error => {
        this.isLoadingEmpleados = false;
        this.listaEmpleados = of([]);
      });;
    }
    else if (term != "") {
      this.spartan_UserService.listaSelAll(0, 20, "Spartan_User.Name like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingEmpleados = false;
        this.listaEmpleados = of(result?.Spartan_Users);
      }, error => {
        this.isLoadingEmpleados = false;
        this.listaEmpleados = of([]);
      });;
    }
  }
  //#endregion


  //#region Consulta de Matricula
  searchAeronaves(term?: string) {
    this.isLoadingAeronaves = true;
    if (term == "" || term == null || term == undefined) {
      this.aeronaveService.listaSelAll(0, 20, "").subscribe((result: any) => {
        this.isLoadingAeronaves = false;
        this.listaAeronaves = of(result?.Aeronaves);
      }, error => {
        this.isLoadingAeronaves = false;
        this.listaAeronaves = of([]);
      });;
    }
    else if (term != "") {
      this.aeronaveService.listaSelAll(0, 20, "Aeronave.Matricula like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingAeronaves = false;
        this.listaAeronaves = of(result?.Aeronaves);
      }, error => {
        this.isLoadingAeronaves = false;
        this.listaAeronaves = of([]);
      });;
    }
  }
  //#endregion


  //#region Consulta de Numero de Vuelo
  searchNumero_de_Vuelo(term?: string) {
    this.isLoadingNumero_de_Vuelo = true;
    if (term == "" || term == null || term == undefined) {
      this.solicitud_de_VueloService.listaSelAll(0, 20, "").subscribe((result: any) => {
        this.isLoadingNumero_de_Vuelo = false;
        this.listaNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
      }, error => {
        this.isLoadingNumero_de_Vuelo = false;
        this.listaNumero_de_Vuelo = of([]);
      });;
    }
    else if (term != "") {
      this.solicitud_de_VueloService.listaSelAll(0, 20, "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + term.trimLeft().trimRight() + "%'").subscribe((result: any) => {
        this.isLoadingNumero_de_Vuelo = false;
        this.listaNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
      }, error => {
        this.isLoadingNumero_de_Vuelo = false;
        this.listaNumero_de_Vuelo = of([]);
      });;
    }
  }
  //#endregion


  //#region Obtener Reporte por Id
  getReportExcel() {
    this.isLoading.next(true);

    let reportId = this.reportId

    this.spartan_ReportService.getById(reportId).subscribe({
      next: (response) => {

        this.reportObject = response;

      },
      error: e => console.error(e),
      complete: () => {
        this.execQueryReport(this.reportObject.Query)
      }

    })
  }
  //#endregion


  //#region Obtener Lista de Datos de Reporte
  execQueryReport(query: any) {
    let filters: any = ""
    let arrayExcel: any;

    this.createFilterExcelFromForm().forEach(element => {
      if (element.PhysicalName == "Aeronaves" && element.Valor != null) {
        filters += `@${element.PhysicalName} = '${element.Valor}',`
      }
      else if (element.Valor != "" && element.Valor != null) {
        filters += `@${element.PhysicalName} = ${element.Valor},`
      }
    });
    filters = filters.substring(0, filters.length - 1);

    this.sqlModel.query = `${query}`;

    this._spartanService.GetRawQuery(this.sqlModel).subscribe({
      next: (response) => {

        arrayExcel = JSON.parse(response);// Parsear a JSON para deserealizar el SQL Query
        arrayExcel = this.filterExcel(arrayExcel)

      },
      error: e => console.error(e),
      complete: () => {
        //Exportar a Excel
        if (this.validateQuantityExcel(arrayExcel)) {
          ExcelUtil.exportArrayToExcel(arrayExcel, this.title);
        }
        this.isLoading.next(false);
      }

    })
  }
  //#endregion


  //#region Filtros de Excel
  createFilterExcelFromForm(): Record<'PhysicalName' | 'Valor', string>[] {

    return Object.keys(this.filtrosForm.value).reduce((filtros, key) => {
      const value = this.filtrosForm.value[key];
      filtros.push({ PhysicalName: key, Valor: value });
      return filtros;
    }, [] as Record<'PhysicalName' | 'Valor', string>[]);
  }
  //#endregion


  //#region Filtrar Array de Excel
  filterExcel(arrayExcel: any): any {
    let Empleado = this.filtrosForm.controls["Empleado"].value
    let Matricula = this.filtrosForm.controls["Matricula"].value
    let Numero_de_Vuelo = this.filtrosForm.controls["Numero_de_Vuelo"].value

    if (Empleado != "" && Empleado != null) {
      arrayExcel = arrayExcel.filter(element => element["Nombre Trip."] == Empleado);
    }

    if (Matricula != "" && Matricula != null) {
      arrayExcel = arrayExcel.filter(element => element["Matricula"] == Matricula);
    }

    if (Numero_de_Vuelo != "" && Numero_de_Vuelo != null) {
      arrayExcel = arrayExcel.filter(element => element["Núm. Vuelo"] == Numero_de_Vuelo);
    }

    return arrayExcel
  }
  //#endregion


  //#region Validar Cantidad de Registros en Excel
  validateQuantityExcel(array: string | any[]): boolean {
    let isValid: boolean = true;

    if (array == null || array.length == 0) {
      this.snackBar.open('No existen registros con los filtros indicados.', '', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
      });
      isValid = false;
    }

    return isValid
  }
  //#endregion


}
