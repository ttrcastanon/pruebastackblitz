import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { Gestion_de_ExportacionService } from 'src/app/api-services/Gestion_de_Exportacion.service';
import { Gestion_de_Exportacion } from 'src/app/models/Gestion_de_Exportacion';
import { Servicios_AduanalesService } from 'src/app/api-services/Servicios_Aduanales.service';
import { Servicios_Aduanales } from 'src/app/models/Servicios_Aduanales';
import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { StorageKeys } from 'src/app/app-constants';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Gestion_de_Exportacion',
  templateUrl: './Gestion_de_Exportacion.component.html',
  styleUrls: ['./Gestion_de_Exportacion.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Gestion_de_ExportacionComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  RoleId: number = 0;
  UserId: number = 0;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }

  Gestion_de_ExportacionForm: FormGroup;
  public Editor = ClassicEditor;
  model: Gestion_de_Exportacion;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varServicios_Aduanales: Servicios_Aduanales[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  today = new Date;
  consult: boolean = false;
  fromGestion_de_aprobacion: any

  //#endregion

  constructor(
    private fb: FormBuilder,
    private Gestion_de_ExportacionService: Gestion_de_ExportacionService,
    private Servicios_AduanalesService: Servicios_AduanalesService,
    private _seguridad: SeguridadService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private spartanService: SpartanService,
    renderer: Renderer2) {

    this.brf = new BusinessRulesFunctions(renderer, spartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    const user = this.localStorageHelper.getLoggedUserInfo();
    this.RoleId = user.RoleId
    this.UserId = user.UserId
    this.fromGestion_de_aprobacion = this.localStorageHelper.getItemFromLocalStorage("IsResetGestion_de_aprobacion") == "0" ? true : false

    this.model = new Gestion_de_Exportacion(this.fb);
    this.Gestion_de_ExportacionForm = this.model.buildFormGroup();

    this.Gestion_de_ExportacionForm.get('Folio').disable();
    this.Gestion_de_ExportacionForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(v => {
      if (v.readOnly) {
        this.Gestion_de_ExportacionForm.disable();
        this.operation = "Consult";
        this.consult = true;
      }
    });

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Gestion_de_Exportacion).subscribe((response) => {
      this.permisos = response;
    });

  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Servicios_AduanalesService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varServicios_Aduanales]) => {
          this.varServicios_Aduanales = varServicios_Aduanales;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }
  }

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Gestion_de_ExportacionForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Folio);
        } else {
          this.operation = "New";
        }
        this.rulesOnInit();
      });
  }

  async populateModel(id: number) {
    this.spinner.show('loading');
    let result = await this.Gestion_de_ExportacionService.listaSelAll(0, 1, 'Gestion_de_Exportacion.Folio=' + id).toPromise();
    if (result.Gestion_de_Exportacions.length > 0) {
      this.model.fromObject(result.Gestion_de_Exportacions[0]);
      this.Gestion_de_ExportacionForm.markAllAsTouched();
      this.Gestion_de_ExportacionForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else {
      this.spinner.hide('loading');
    }
  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Servicios_aduanales': {
        this.Servicios_AduanalesService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varServicios_Aduanales = x.Servicios_Aduanaless;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');

    try {
      if (this.rulesBeforeSave()) {
        const entity = this.Gestion_de_ExportacionForm.value;
        entity.Folio = this.model.Folio;


        if (this.model.Folio > 0) {
          await this.Gestion_de_ExportacionService.update(this.model.Folio, entity).toPromise().then(async id => {
            this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
            this.spinner.hide('loading');
            return this.model.Folio;
          });

        } else {
          await (this.Gestion_de_ExportacionService.insert(entity).toPromise().then(async id => {

            this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
            return id;
          }));
        }

        this.snackBar.open('Registro guardado con éxito', '', {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success'
        });
        this.rulesAfterSave();
        this.isLoading = false;
        this.spinner.hide('loading');
      } else {
        this.isLoading = false;
        this.spinner.hide('loading');
        return false;
      }
    } catch (error) {
      this.snackBar.open('Error al querer guardar', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'error'
      });

      this.rulesAfterSave();
      this.isLoading = false;
      this.spinner.hide('loading');

      return false
    }

    return true
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0) {
      this.Gestion_de_ExportacionForm.reset();
      this.model = new Gestion_de_Exportacion(this.fb);
      this.Gestion_de_ExportacionForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Gestion_de_Exportacion/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }

  goToList() {
    this.router.navigate(['/Gestion_de_Exportacion/list'], { state: { data: this.dataListConfig } });
  }

  cancel() {
    let Reset = this.localStorageHelper.getItemFromLocalStorage("IsResetGestion_de_aprobacion");

    if (Reset == "0") {
      this.localStorageHelper.setItemToLocalStorage("IsResetGestion_de_aprobacion", "1");
      window.close();
    } else {
      this.goToList();
    }
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas
  Transporte_ExecuteBusinessRules(): void { /*Transporte_FieldExecuteBusinessRulesEnd*/ }
  Costo_Flete__ExecuteBusinessRules(): void { /*Costo_Flete__FieldExecuteBusinessRulesEnd*/ }
  Tipo_de_Cambio_Transp__ExecuteBusinessRules(): void { /*Tipo_de_Cambio_Transp__FieldExecuteBusinessRulesEnd*/ }
  No__Factura_ExecuteBusinessRules(): void { /*No__Factura_FieldExecuteBusinessRulesEnd*/ }
  Fecha_de_Factura_ExecuteBusinessRules(): void { /*Fecha_de_Factura_FieldExecuteBusinessRulesEnd*/ }
  Servicios_aduanales_ExecuteBusinessRules(): void { /*Servicios_aduanales_FieldExecuteBusinessRulesEnd*/ }
  Costo_Servicios__ExecuteBusinessRules(): void { /*Costo_Servicios__FieldExecuteBusinessRulesEnd*/ }
  Tipo_de_Cambio_Aduanales_ExecuteBusinessRules(): void { /*Tipo_de_Cambio_Aduanales_FieldExecuteBusinessRulesEnd*/ }
  No__Factura_SA_ExecuteBusinessRules(): void { /*No__Factura_SA_FieldExecuteBusinessRulesEnd*/ }
  Fecha_de_Factura_2_ExecuteBusinessRules(): void { /*Fecha_de_Factura_2_FieldExecuteBusinessRulesEnd*/ }
  Costo_Impuestos__ExecuteBusinessRules(): void { /*Costo_Impuestos__FieldExecuteBusinessRulesEnd*/ }
  Tipo_de_Cambio_Imp__ExecuteBusinessRules(): void { /*Tipo_de_Cambio_Imp__FieldExecuteBusinessRulesEnd*/ }
  Clave_de_Pedimento_ExecuteBusinessRules(): void { /*Clave_de_Pedimento_FieldExecuteBusinessRulesEnd*/ }
  No__de_Pedimento_ExecuteBusinessRules(): void { /*No__de_Pedimento_FieldExecuteBusinessRulesEnd*/ }
  No__De_Guia_ExecuteBusinessRules(): void { /*No__De_Guia_FieldExecuteBusinessRulesEnd*/ }
  Aplicacion_ExecuteBusinessRules(): void { /*Aplicacion_FieldExecuteBusinessRulesEnd*/ }
  FolioExportacion_ExecuteBusinessRules(): void { /*FolioExportacion_FieldExecuteBusinessRulesEnd*/ }

  applyRules() { }

  filterComboObservable(): Observable<FilterCombo> {
    return this.filterComboEmiter.asObservable();
  }

  filterCombo(nameCombo: string, filter: string) {
    const filterCombo: FilterCombo = { nameCombo, filter };
    this.filterComboEmiter.next(filterCombo);
  }

  rulesAfterViewInit() {
  }

  rulesOnInit() {
    //rulesOnInit_ExecuteBusinessRulesInit

    //INICIA - BRID:4087 - Ocultar campos simpre y asignar no requeridos - Autor: Lizeth Villa - Actualización: 7/16/2021 1:29:46 PM
    this.brf.HideFieldOfForm(this.Gestion_de_ExportacionForm, "idPiezas");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "idPiezas");
    this.brf.HideFieldOfForm(this.Gestion_de_ExportacionForm, "idServicios");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "idServicios");
    this.brf.HideFieldOfForm(this.Gestion_de_ExportacionForm, "idComprasGenerales");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "idComprasGenerales");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "idPiezas");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "idServicios");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "idComprasGenerales");
    this.brf.HideFieldOfForm(this.Gestion_de_ExportacionForm, "FolioExportacion");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "FolioExportacion");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Impuestos_Aduanales");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "FolioExportacion");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Transporte");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Costo_Flete_");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Tipo_de_Cambio_Transp_");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "No__Factura");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Fecha_de_Factura");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Servicios_aduanales");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Costo_Servicios_");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Tipo_de_Cambio_Aduanales");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "No__Factura_SA");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Fecha_de_Factura_2");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Costo_Impuestos_");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Tipo_de_Cambio_Imp_");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Clave_de_Pedimento");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "No__de_Pedimento");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "No__De_Guia");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Aplicacion");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "FolioExportacion");
    this.brf.HideFieldOfForm(this.Gestion_de_ExportacionForm, "Folio");
    this.brf.SetNotRequiredControl(this.Gestion_de_ExportacionForm, "Folio");
    //TERMINA - BRID:4087

    //INICIA - BRID:4550 - al editar si el rol es almacen  bloquear primeros campos - Autor: Lizeth Villa - Actualización: 7/30/2021 12:33:53 PM
    if (this.operation == 'Update') {
      if (this.RoleId == 26) {
        this.brf.SetEnabledControl(this.Gestion_de_ExportacionForm, 'Transporte', 0);
        this.brf.SetEnabledControl(this.Gestion_de_ExportacionForm, 'Costo_Flete_', 0);
        this.brf.SetEnabledControl(this.Gestion_de_ExportacionForm, 'Tipo_de_Cambio_Transp_', 0);
        this.brf.SetEnabledControl(this.Gestion_de_ExportacionForm, 'No__Factura', 0);
        this.brf.SetEnabledControl(this.Gestion_de_ExportacionForm, 'Fecha_de_Factura', 0);
      }
    }
    //TERMINA - BRID:4550

    //rulesOnInit_ExecuteBusinessRulesEnd
  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    let KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)
    let IdFolioDetalle = this.localStorageHelper.getItemFromLocalStorage("IdFolioDetalle")

    //INICIA - BRID:4106 - Asignar id despues de guardar - Autor: Lizeth Villa - Actualización: 7/12/2021 7:20:00 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(`UPDATE Gestion_de_Exportacion SET FolioExportacion = Folio WHERE Folio = ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4106


    //INICIA - BRID:4107 - Asignar idexpotacion a detalle de aprobacion con codigo manual (no desactivar) - Autor: Lizeth Villa - Actualización: 7/12/2021 7:24:51 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(`UPDATE Detalle_de_Gestion_de_aprobacion SET IdExportacion = ${KeyValueInserted} WHERE IdFolioDetalle = ${IdFolioDetalle} `, 1, "ABC123");
    }
    //TERMINA - BRID:4107


    //INICIA - BRID:4541 - Insert en MR Detalle_de_Compras_en_exportacion - Autor: Lizeth Villa - Actualización: 7/29/2021 3:38:09 PM
    if (this.operation == 'New') {
      this.brf.EvaluaQuery(`EXEC usp_InsDetalle_de_Compras_en_exportacion ${KeyValueInserted}`, 1, "ABC123");
    }
    //TERMINA - BRID:4541
    

    setTimeout(() => {
      this.cancel()
    }, 2000);
    //rulesAfterSave_ExecuteBusinessRulesEnd
  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit
    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }
  //Fin de reglas

}
