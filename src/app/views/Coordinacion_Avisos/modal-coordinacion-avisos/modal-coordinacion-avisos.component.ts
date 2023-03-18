import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, Inject, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';

import { GeneralService } from 'src/app/api-services/general.service';
import { Coordinacion_AvisosService } from 'src/app/api-services/Coordinacion_Avisos.service';
import { Coordinacion_Avisos } from 'src/app/models/Coordinacion_Avisos';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { Detalle_Coordinacion_AvisosService } from 'src/app/api-services/Detalle_Coordinacion_Avisos.service';
import { Detalle_Coordinacion_Avisos } from 'src/app/models/Detalle_Coordinacion_Avisos';
import { Tipo_de_AvisoService } from 'src/app/api-services/Tipo_de_Aviso.service';
import { Tipo_de_Aviso } from 'src/app/models/Tipo_de_Aviso';
import { Estatus_de_ConfirmacionService } from 'src/app/api-services/Estatus_de_Confirmacion.service';
import { Estatus_de_Confirmacion } from 'src/app/models/Estatus_de_Confirmacion';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import Swal from 'sweetalert2';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { getDutchPaginatorEsMX } from '../../../shared/base-views/dutch-paginator-intl';

import { registerLocaleData } from '@angular/common';
import esMX from '@angular/common/locales/es-MX';

import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";

registerLocaleData(esMX);

@Component({
  selector: 'app-modal-coordinacion-avisos',
  templateUrl: './modal-coordinacion-avisos.component.html',
  styleUrls: ['./modal-coordinacion-avisos.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorEsMX()}
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class ModalCoordinacionAvisosComponent implements OnInit, AfterViewInit {

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Coordinacion_AvisosForm: FormGroup;
  public Editor = ClassicEditor;
  model: Coordinacion_Avisos;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsNumero_de_Vuelo: Observable<Solicitud_de_Vuelo[]>;
  hasOptionsNumero_de_Vuelo: boolean;
  isLoadingNumero_de_Vuelo: boolean;
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  public varTipo_de_Aviso: Tipo_de_Aviso[] = [];
  public varEstatus_de_Confirmacion: Estatus_de_Confirmacion[] = [];

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @ViewChild('PaginadorAvisos', { read: MatPaginator }) paginadorAvisos: MatPaginator;

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceAvisos = new MatTableDataSource<Detalle_Coordinacion_Avisos>();
  AvisosColumns = [
    { def: 'actions', hide: false },
    { def: 'Aviso', hide: false },
    { def: 'Fecha', hide: false },
    { def: 'Confirmado_por_Correo', hide: false },
    { def: 'Confirmado_por_Telefono', hide: false },
    { def: 'Comentarios', hide: false },
    { def: 'Confirmado', hide: false },

  ];
  AvisosData: Detalle_Coordinacion_Avisos[] = [];

  today = new Date;
  consult: boolean = false;
  ButtonSaveAvisos: boolean = true;
  SpartanOperationId: any;
  isServiciosAdd: boolean = true;
  isServiciosOpen: boolean = false;
  avisosEliminar: number[] = [];
  todayFecha = new Date('1900-01-01');
  //#endregion

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Coordinacion_AvisosService: Coordinacion_AvisosService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private AeronaveService: AeronaveService,
    private Detalle_Coordinacion_AvisosService: Detalle_Coordinacion_AvisosService,
    private Tipo_de_AvisoService: Tipo_de_AvisoService,
    private Estatus_de_ConfirmacionService: Estatus_de_ConfirmacionService,
    private _seguridad: SeguridadService,
    private spartanFileService: SpartanFileService,
    private helperService: HelperService,
    private snackBar: MatSnackBar,
    private router: Router,
    private route: ActivatedRoute,
    private localStorageHelper: LocalStorageHelper,
    private translateService: TranslateService,
    private spinner: NgxSpinnerService,
    private _SpartanService: SpartanService,
    private renderer: Renderer2,
    public dialogRef: MatDialogRef<ModalCoordinacionAvisosComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
  ) {

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Coordinacion_Avisos(this.fb);
    this.Coordinacion_AvisosForm = this.model.buildFormGroup();
    this.AvisosItems.removeAt(0);

    this.Coordinacion_AvisosForm.get('Folio').disable();
    this.Coordinacion_AvisosForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  soloFecha(e) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
    const keyPressed = e.key;

    if (!allowedKeys.includes(keyPressed)) {
      e.preventDefault();
      return;
    }

    if (e.target.value.length >= 10) {
      e.preventDefault();
      return;
    }
  }

  getCountAvisos(): number {
    return this.dataSourceAvisos.data.filter(d => !d.IsDeleted).length;
  }

  VerificarAvisos(element) {
    const index = this.dataSourceAvisos.data.indexOf(element);
    let fgr = this.Coordinacion_AvisosForm.controls.Detalle_Coordinacion_AvisosItems as FormArray;
    let data = fgr.controls[index] as FormGroup;

    let Aviso = data.controls.Aviso.value;
    let Confirmado = data.controls.Confirmado.value;

    if (Aviso && Confirmado && data.controls.Fecha.status == 'VALID') {
      this.ButtonSaveAvisos = false;
    }
    else {
      this.ButtonSaveAvisos = true
    }
  }

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.dataSourceAvisos.paginator = this.paginadorAvisos;
      this.rulesAfterViewInit();
    }, 0)
  }

  ngOnInit(): void {
    this.populateControls();
 
    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Coordinacion_Avisos).subscribe((response) => {
      this.permisos = response;
    });

    this.brf.updateValidatorsToControl(this.Coordinacion_AvisosForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Coordinacion_AvisosForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Coordinacion_AvisosService.listaSelAll(0, 1, 'Coordinacion_Avisos.Folio=' + id).toPromise();
    if (result.Coordinacion_Avisoss.length > 0) {
      let fAvisos = await this.Detalle_Coordinacion_AvisosService.listaSelAll(0, 1000, 'Coordinacion_Avisos.Folio=' + id).toPromise();
      this.AvisosData = fAvisos.Detalle_Coordinacion_Avisoss;
      this.loadAvisos(fAvisos.Detalle_Coordinacion_Avisoss);
      this.dataSourceAvisos = new MatTableDataSource(fAvisos.Detalle_Coordinacion_Avisoss);
      this.dataSourceAvisos.paginator = this.paginadorAvisos;
      this.dataSourceAvisos.sort = this.sort;

      this.model.fromObject(result.Coordinacion_Avisoss[0]);
      this.Coordinacion_AvisosForm.get('Numero_de_Vuelo').setValue(
        result.Coordinacion_Avisoss[0].Numero_de_Vuelo_Solicitud_de_Vuelo.Numero_de_Vuelo,
        { onlySelf: false, emitEvent: true }
      );
      this.Coordinacion_AvisosForm.get('Matricula').setValue(
        result.Coordinacion_Avisoss[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );

      this.Coordinacion_AvisosForm.markAllAsTouched();
      this.Coordinacion_AvisosForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else {
      this.spinner.hide('loading');
    }
  }

  //#region  Avisos Items

  get AvisosItems() {
    return this.Coordinacion_AvisosForm.get('Detalle_Coordinacion_AvisosItems') as FormArray;
  }

  getAvisosColumns(): string[] {
    return this.AvisosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadAvisos(Avisos: Detalle_Coordinacion_Avisos[]) {
    Avisos.forEach(element => {
      this.addAvisos(element);
    });
  }

  addAvisosToMR() {
    this.isServiciosAdd = !this.isServiciosAdd;
    const Avisos = new Detalle_Coordinacion_Avisos(this.fb);
    Avisos.edit = true;
    Avisos.isNew = true;
    this.AvisosData.push(this.addAvisos(Avisos));
    
    setTimeout(() => {
      this.dataSourceAvisos.data = this.AvisosData;
      const page = Math.ceil(this.dataSourceAvisos.data.filter(d => !d.IsDeleted).length / this.paginadorAvisos.pageSize);
      if (page !== this.paginadorAvisos.pageIndex) {
        this.paginadorAvisos.pageIndex = page;
      }
      
      this.isServiciosOpen = true;
      this.ButtonSaveAvisos = true;
    }, 500)
  
  }

  addAvisos(entity: Detalle_Coordinacion_Avisos) {
    const Avisos = new Detalle_Coordinacion_Avisos(this.fb);
    this.AvisosItems.push(Avisos.buildFormGroup());
    if (entity) {
      Avisos.fromObject(entity);
    }
    this.isServiciosOpen = false;
    return entity;
  }

  AvisosItemsByFolio(Folio: number): FormGroup {
    return (this.Coordinacion_AvisosForm.get('Detalle_Coordinacion_AvisosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  AvisosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceAvisos.data.indexOf(element);
    let fb = this.AvisosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteAvisos(element: any) {
    Swal.fire({
      title: "¿Está seguro de eliminar este registro?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Si, Eliminar',
      cancelButtonText: 'No, Cancelar'
    }).then(result => {
      if (result.value) {
        let index = this.dataSourceAvisos.data.indexOf(element);

        if(this.AvisosData[index].Folio != undefined && this.AvisosData[index].Folio > 0) {
          this.avisosEliminar.push(this.AvisosData[index].Folio);
        }

        this.AvisosData[index].IsDeleted = true;
        this.AvisosData.splice(index, 1);
        this.dataSourceAvisos.data = this.AvisosData;
        this.dataSourceAvisos._updateChangeSubscription();

        let fgr = this.Coordinacion_AvisosForm.controls.Detalle_Coordinacion_AvisosItems as FormArray;
        fgr.removeAt(index);
        index = this.dataSourceAvisos.data.filter(d => !d.IsDeleted).length;
        const page = Math.ceil(index / this.paginadorAvisos.pageSize);
        if (page !== this.paginadorAvisos.pageIndex) {
          this.paginadorAvisos.pageIndex = page;
        }
      }
    });
  }

  cancelEditAvisos(element: any) {
    let index = this.dataSourceAvisos.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.AvisosData[index].IsDeleted = true;
      this.AvisosData.splice(index, 1);
      this.dataSourceAvisos.data = this.AvisosData;
      this.dataSourceAvisos.data.splice(index, 1);
      this.dataSourceAvisos._updateChangeSubscription();
      index = this.AvisosData.filter(d => !d.IsDeleted).length;

      let fgr = this.Coordinacion_AvisosForm.controls.Detalle_Coordinacion_AvisosItems as FormArray;
      fgr.removeAt(index);
      
      const page = Math.ceil(index / this.paginadorAvisos.pageSize);
      if (page !== this.paginadorAvisos.pageIndex) {
        this.paginadorAvisos.pageIndex = page;
      }
    }
    
    const formAvisos = this.AvisosItems.controls[index] as FormGroup;
    formAvisos.controls.Confirmado.setErrors(null);
    formAvisos.controls.Aviso.setErrors(null);
	  
    this.isServiciosAdd = !this.isServiciosAdd;
    this.isServiciosOpen = false;
  }

  async saveAvisos(element: any) {
    const index = this.dataSourceAvisos.data.indexOf(element);
    const formAvisos = this.AvisosItems.controls[index] as FormGroup;
    this.AvisosData[index].Aviso = formAvisos.value.Aviso;
    this.AvisosData[index].Aviso_Tipo_de_Aviso = formAvisos.value.Aviso !== '' ?
      this.varTipo_de_Aviso.filter(d => d.Clave === formAvisos.value.Aviso)[0] : null;
    this.AvisosData[index].Fecha = formAvisos.value.Fecha;
    this.AvisosData[index].Confirmado_por_Correo = formAvisos.value.Confirmado_por_Correo;
    this.AvisosData[index].Confirmado_por_Telefono = formAvisos.value.Confirmado_por_Telefono;
    this.AvisosData[index].Comentarios = formAvisos.value.Comentarios;
    this.AvisosData[index].Confirmado = formAvisos.value.Confirmado;
    this.AvisosData[index].Confirmado_Estatus_de_Confirmacion = formAvisos.value.Confirmado !== '' ?
      this.varEstatus_de_Confirmacion.filter(d => d.Clave === formAvisos.value.Confirmado)[0] : null;

    this.AvisosData[index].isNew = false;
    this.dataSourceAvisos.data = this.AvisosData;
    this.dataSourceAvisos._updateChangeSubscription();
    this.ButtonSaveAvisos = true;
    this.isServiciosAdd = !this.isServiciosAdd;
    this.isServiciosOpen = false;
  }

  editAvisos(element: any) {
    const index = this.dataSourceAvisos.data.indexOf(element);
    const formAvisos = this.AvisosItems.controls[index] as FormGroup;
    formAvisos.controls.Confirmado.setValue(this.dataSourceAvisos.data[index].Confirmado);

    this.ButtonSaveAvisos = false;

    element.edit = true;
    this.isServiciosAdd = !this.isServiciosAdd;
    this.isServiciosOpen = true;
  }

  async saveDetalle_Coordinacion_Avisos(Folio: number) {
    let values: string = '';
    this.avisosEliminar.forEach(x => { values = values + `${x.toString()},`; })
    values = values.slice(0, -1);

    this.dataSourceAvisos.data.forEach(async (d, index) => {
      const data = this.AvisosItems.controls[index] as FormGroup;
      let model = d;
	    model.Coordinacion_Avisos = Folio;
	
      if (model.Folio === 0) {
        // Add Avisos
		let response = await this.Detalle_Coordinacion_AvisosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formAvisos = this.AvisosItemsByFolio(model.Folio);
        if (formAvisos.dirty) {
          // Update Avisos
          let response = await this.Detalle_Coordinacion_AvisosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Avisos
        await this.Detalle_Coordinacion_AvisosService.delete(model.Folio).toPromise();
      }
    });

    if(values != ''){
      let query = `DELETE FROM Detalle_Coordinacion_Avisos WHERE Folio IN (${values})`;
      this.brf.EvaluaQuery(query, 1, "ABC123");
    }
  }

  //#endregion


  getParamsFromUrl() {
    this.operation = this.data.operation
    this.SpartanOperationId = this.data.SpartanOperationId;

    if (this.operation == "Update" || this.operation == "Consult") {
      this.model.Folio = this.data?.Id
      this.populateModel(this.model.Folio);
    }

    if (this.operation == "Consult") {
      this.Coordinacion_AvisosForm.disable();
      this.consult = true;
    }

    this.rulesOnInit();

  }

  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Tipo_de_AvisoService.getAll());
    observablesArray.push(this.Estatus_de_ConfirmacionService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varTipo_de_Aviso, varEstatus_de_Confirmacion]) => {
          this.varTipo_de_Aviso = varTipo_de_Aviso;
          this.varEstatus_de_Confirmacion = varEstatus_de_Confirmacion;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Coordinacion_AvisosForm.get('Numero_de_Vuelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNumero_de_Vuelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Solicitud_de_VueloService.listaSelAll(0, 20, '');
          return this.Solicitud_de_VueloService.listaSelAll(0, 20,
            "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Solicitud_de_VueloService.listaSelAll(0, 20,
          "Solicitud_de_Vuelo.Numero_de_Vuelo like '%" + value.Numero_de_Vuelo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = result?.Solicitud_de_Vuelos?.length > 0;
      this.Coordinacion_AvisosForm.get('Numero_de_Vuelo').setValue(result?.Solicitud_de_Vuelos[0], { onlySelf: true, emitEvent: false });
      this.optionsNumero_de_Vuelo = of(result?.Solicitud_de_Vuelos);
    }, error => {
      this.isLoadingNumero_de_Vuelo = false;
      this.hasOptionsNumero_de_Vuelo = false;
      this.optionsNumero_de_Vuelo = of([]);
    });

    this.Coordinacion_AvisosForm.get('Matricula').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingMatricula = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.AeronaveService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.AeronaveService.listaSelAll(0, 20, '');
          return this.AeronaveService.listaSelAll(0, 20,
            "Aeronave.Matricula like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.AeronaveService.listaSelAll(0, 20,
          "Aeronave.Matricula like '%" + value.Matricula.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = result?.Aeronaves?.length > 0;
      this.Coordinacion_AvisosForm.get('Matricula').setValue(result?.Aeronaves[0], { onlySelf: true, emitEvent: false });
      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });

  }

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Aviso': {
        this.Tipo_de_AvisoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Aviso = x.Tipo_de_Avisos;
        });
        break;
      }
      case 'Confirmado': {
        this.Estatus_de_ConfirmacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Confirmacion = x.Estatus_de_Confirmacions;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnNumero_de_Vuelo(option: Solicitud_de_Vuelo) {
    return option?.Numero_de_Vuelo;
  }
  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }

  async save() {
    await this.saveData();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');

    if (this.rulesBeforeSave()) {
      const entity = this.Coordinacion_AvisosForm.value;
      entity.Folio = this.model.Folio;
      entity.Numero_de_Vuelo = this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');
      entity.Matricula = this.Coordinacion_AvisosForm.get('Matricula').value.Matricula;
      entity.Ruta_de_Vuelo = this.Coordinacion_AvisosForm.controls.Ruta_de_Vuelo.value;
      entity.Fecha_y_Hora_de_Salida = this.Coordinacion_AvisosForm.controls.Fecha_y_Hora_de_Salida.value;
      entity.Calificacion = this.Coordinacion_AvisosForm.controls.Calificacion.value;

      if (this.model.Folio > 0) {
        await this.Coordinacion_AvisosService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Coordinacion_Avisos(this.model.Folio);
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());

        this.rulesAfterSave();
      } else {
        await (this.Coordinacion_AvisosService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Coordinacion_Avisos(id);
          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());

          this.rulesAfterSave();

        }));
      }

    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }


  goToList() {
    this.router.navigate(['/Coordinacion_Avisos/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Numero_de_Vuelo_ExecuteBusinessRules(): void {
    //Numero_de_Vuelo_FieldExecuteBusinessRulesEnd
  }
  Matricula_ExecuteBusinessRules(): void {
    //Matricula_FieldExecuteBusinessRulesEnd
  }
  Ruta_de_Vuelo_ExecuteBusinessRules(): void {
    //Ruta_de_Vuelo_FieldExecuteBusinessRulesEnd
  }
  Fecha_y_Hora_de_Salida_ExecuteBusinessRules(): void {
    //Fecha_y_Hora_de_Salida_FieldExecuteBusinessRulesEnd
  }
  Calificacion_ExecuteBusinessRules(): void {
    //Calificacion_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    //Observaciones_FieldExecuteBusinessRulesEnd
  }

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

    //INICIA - BRID:1874 - En nuevo ocultar campo numero de vuelo  - Autor: Lizeth Villa - Actualización: 3/25/2021 2:47:58 PM
    if (this.operation == 'New') {
      this.brf.HideFieldOfForm(this.Coordinacion_AvisosForm, "Numero_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Coordinacion_AvisosForm, "Numero_de_Vuelo");
      this.brf.SetNotRequiredControl(this.Coordinacion_AvisosForm, "Numero_de_Vuelo");
    }
    //TERMINA - BRID:1874


    //INICIA - BRID:2037 - Al abrir la pantalla, en nuevo y modificar* Matricula, Ruta de Vuelo, Fecha y Hora de Salida, Calificación y Número de Vuelo siempre deshabilitados* Observaciones no obligatorio* Número de vuelo VISIBLE - Autor: Lizeth Villa - Actualización: 3/25/2021 2:41:24 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Numero_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Ruta_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Fecha_y_Hora_de_Salida', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Calificacion', 0);
      this.brf.SetNotRequiredControl(this.Coordinacion_AvisosForm, "Observaciones");
      this.brf.HideFieldOfForm(this.Coordinacion_AvisosForm, "Numero_de_Vuelo");
    }
    //TERMINA - BRID:2037


    //INICIA - BRID:2616 - Ocultar folio .. - Autor: Lizeth Villa - Actualización: 4/7/2021 10:06:15 AM
    this.brf.HideFieldOfForm(this.Coordinacion_AvisosForm, "Folio");
    this.brf.SetNotRequiredControl(this.Coordinacion_AvisosForm, "Folio");
    //TERMINA - BRID:2616


    //INICIA - BRID:2827 - si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje 2 - Autor: Administrador - Actualización: 5/3/2021 4:10:50 PM
    if (this.brf.EvaluaQuery("SELECT COUNT(*) from Solicitud_de_Vuelo where folio = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + " and estatus = 9	", 1, 'ABC123') == this.brf.TryParseInt('1', '1') &&
      this.brf.EvaluaQuery("if ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 1 or " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 9 ) begin select 1 end	", 1, 'ABC123') != this.brf.TryParseInt('1', '1')) {
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Numero_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Matricula', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Ruta_de_Vuelo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Fecha_y_Hora_de_Salida', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Calificacion', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Observaciones', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Folio', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Coordinacion_Avisos', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Aviso', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Fecha', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Confirmado_por_Correo', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Confirmado_por_Telefono', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Comentarios', 0);
      this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Confirmado', 0);
      this.brf.ShowMessage("El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar");
    }
    //TERMINA - BRID:2827


    //INICIA - BRID:5679 - Habilitar todos los campos si el vuelo esta reabierto - Autor: Lizeth Villa - Actualización: 9/3/2021 5:33:11 PM
    if (this.operation == 'Update') {
      if (this.brf.EvaluaQuery("if ( ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 9) or  ( " + this.localStorageHelper.getLoggedUserInfo().RoleId + "= 12)) begin select 1 end", 1, 'ABC123') == this.brf.TryParseInt('1', '1') &&
        this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + "", 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Matricula', 1);
        this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Ruta_de_Vuelo', 1);
        this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Fecha_y_Hora_de_Salida', 1);
        this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Calificacion', 1);
      }
    }
    //TERMINA - BRID:5679

    //rulesOnInit_ExecuteBusinessRulesEnd

  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:1873 - En nuevo después de guardar asignar numero de vuelo - Autor: Lizeth Villa - Actualización: 3/22/2021 2:35:10 PM
    if (this.operation == 'New') {
      await this.brf.EvaluaQueryAsync(" update Coordinacion_Avisos set Numero_de_Vuelo= " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + " where Folio=" + this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted), 1, "ABC123");
    }
    //TERMINA - BRID:1873


    //INICIA - BRID:2630 - al dar de alta o modificar, después de guardar ejecutar el SP: exec uspAsignaCalificacionCoordinacion "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+",1 esto es para asignar la calificación. - Autor: Felipe Rodríguez - Actualización: 4/7/2021 2:33:39 PM
    this._SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion " + this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId') + ",1", 1, "ABC123");
    //TERMINA - BRID:2630

    setTimeout(() => { 

      this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
      
      //rulesAfterSave_ExecuteBusinessRulesEnd
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
      this.isLoading = false;
      this.spinner.hide('loading');
      this.fnCloseModal(1) 
    
    }, 3000);

    
  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    if(this.isServiciosOpen) {
      alert("Has dejado un renglón sin guardar Avisos");
      result = false;
    }

    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas


  //#region Cerrar Modal
  fnCloseModal(result: number) {
    //1 Inserta
    if (result == 1) {
      this.dialogRef.close(result);
    }
    //Indefinido solo cierra
    else {
      this.dialogRef.close();
    }
  }
  //#endregion

}
