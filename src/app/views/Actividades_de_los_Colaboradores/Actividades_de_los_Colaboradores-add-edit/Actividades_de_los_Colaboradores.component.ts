import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { off } from 'process';
import * as ts from 'typescript';

import { GeneralService } from 'src/app/api-services/general.service';
import { Actividades_de_los_ColaboradoresService } from 'src/app/api-services/Actividades_de_los_Colaboradores.service';
import { Actividades_de_los_Colaboradores } from 'src/app/models/Actividades_de_los_Colaboradores';
import { Detalle_de_Actividades_de_Colaboradores } from 'src/app/models/Detalle_de_Actividades_de_Colaboradores';
import { Creacion_de_UsuariosService } from 'src/app/api-services/Creacion_de_Usuarios.service';
import { Creacion_de_Usuarios } from 'src/app/models/Creacion_de_Usuarios';
import { CargosService } from 'src/app/api-services/Cargos.service';
import { Cargos } from 'src/app/models/Cargos';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';

import { Catalogo_Actividades_de_ColaboradoresService } from 'src/app/api-services/Catalogo_Actividades_de_Colaboradores.service';
import { Catalogo_Actividades_de_Colaboradores } from 'src/app/models/Catalogo_Actividades_de_Colaboradores';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
import { q } from 'src/app/models/business-rules/business-rule-query.model';
import { MessagesHelper } from "./../../../helpers/messages-helper";

@Component({
  selector: 'app-Actividades_de_los_Colaboradores',
  templateUrl: './Actividades_de_los_Colaboradores.component.html',
  styleUrls: ['./Actividades_de_los_Colaboradores.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Actividades_de_los_ColaboradoresComponent implements OnInit, AfterViewInit {

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Actividades_de_los_ColaboradoresForm: FormGroup;
	public Editor = ClassicEditor;
	model: Actividades_de_los_Colaboradores;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsColaborador: Observable<Creacion_de_Usuarios[]>;
	hasOptionsColaborador: boolean;
	isLoadingColaborador: boolean;
	optionsPuesto: Observable<Cargos[]>;
	hasOptionsPuesto: boolean;
	isLoadingPuesto: boolean;
	optionsEmpresa: Observable<Cliente[]>;
	hasOptionsEmpresa: boolean;
	isLoadingEmpresa: boolean;

  optionsConcepto: Observable<Catalogo_Actividades_de_Colaboradores[]>;
	hasOptionsConcepto: boolean;
	isLoadingConcepto: boolean;

	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
	
	consult: boolean = false;
  ConceptoSeleccionado: any = null;
  ColaboradorSeleccionado: any = null;
  taskList: any[] = [];
  checkedDiaInhabil: boolean = false;

  dataSourceActividadesColaboradores = new MatTableDataSource<Actividades_de_los_Colaboradores>();
  dataSourceDetalleActividadesColaborador = new MatTableDataSource<Detalle_de_Actividades_de_Colaboradores>();

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Actividades_de_los_ColaboradoresService: Actividades_de_los_ColaboradoresService,
    private Creacion_de_UsuariosService: Creacion_de_UsuariosService,
    private CargosService: CargosService,
    private ClienteService: ClienteService,

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
    private Catalogo_Actividades_de_ColaboradoresService: Catalogo_Actividades_de_ColaboradoresService,
    private _messages: MessagesHelper,
    renderer: Renderer2) {
	this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Actividades_de_los_Colaboradores(this.fb);
    this.Actividades_de_los_ColaboradoresForm = this.model.buildFormGroup();
	
	this.Actividades_de_los_ColaboradoresForm.get('Folio').disable();
    this.Actividades_de_los_ColaboradoresForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ActividadForm = new FormGroup({
    FolioDetalle: new FormControl(),
    Inicio_Horario_Tarea: new FormControl(),
    Final_Horario_Tarea: new FormControl(),
    Concepto: new FormControl(),
    Observaciones: new FormControl()
  });
  
  async getActividadesColaboradores() {

    let fechaReporte = this.Actividades_de_los_ColaboradoresForm.get('Fecha_de_Reporte').value;
    let colaborador = this.Actividades_de_los_ColaboradoresForm.get('Colaborador').value.Clave;

    let fecha = fechaReporte.split != undefined && fechaReporte.split.length == 2 ? fechaReporte.split('T')[0] : fechaReporte.toISOString().split('T')[0];
    let anio = fecha.split('-')[0];
    let mes = fecha.split('-')[1];
    let dia = fecha.split('-')[2];
    let fechaCompuesta = dia + "/" + mes + "/" + anio;

    const model: q = new q();
    model.id = 1;
    model.query = `EXEC uspGet_Actividades_de_los_Colaboradores_byColaboradorFecha '${fechaCompuesta}', ${colaborador}`;
    model.securityCode = "ABC123 ";

    await this._SpartanService.GetRawQuery(model).toPromise().then((result) => {
      if (result == null) {
        return
      }
      let dt = JSON.parse(result.replace('\\', ''));
      this.dataSourceActividadesColaboradores = new MatTableDataSource<Actividades_de_los_Colaboradores>();
      const data = this.dataSourceActividadesColaboradores.data;
      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];
        resDt.IsDeleted = false;
        resDt.edit = false;
        resDt.isNew = true;
        data.push(resDt);
      }
      this.dataSourceActividadesColaboradores.data = data;
    });
  }

  async getDetalleActividadesColaborador() {

    let fechaReporte = this.Actividades_de_los_ColaboradoresForm.get('Fecha_de_Reporte').value;
    let colaborador = this.Actividades_de_los_ColaboradoresForm.get('Colaborador').value.Clave;

    let fecha = fechaReporte.split != undefined && fechaReporte.split.length == 2 ? fechaReporte.split('T')[0] : fechaReporte.toISOString().split('T')[0];
    let anio = fecha.split('-')[0];
    let mes = fecha.split('-')[1];
    let dia = fecha.split('-')[2];
    let fechaCompuesta = dia + "/" + mes + "/" + anio;

    const model: q = new q();
    model.id = 1;
    model.query = `EXEC usp_getListDetalleActividad '${fechaCompuesta}', ${colaborador}`;
    model.securityCode = "ABC123 ";

    await this._SpartanService.GetRawQuery(model).toPromise().then((result) => {
      if (result == null) {
        return
      }
      let dt = JSON.parse(result.replace('\\', ''));
      this.dataSourceDetalleActividadesColaborador = new MatTableDataSource<Detalle_de_Actividades_de_Colaboradores>();
      const data = this.dataSourceDetalleActividadesColaborador.data;
      for (var i = 0; i < dt.length; i++) {
        let resDt = dt[i];
        resDt.IsDeleted = false;
        resDt.edit = false;
        resDt.isNew = true;
        data.push(resDt);
      }
      this.dataSourceDetalleActividadesColaborador.data = data;
    });
  }

  addTask() {
    const values = this.ActividadForm.value;

    this.brf.SetFormatToHour(this.ActividadForm, 'Inicio_Horario_Tarea', values.Inicio_Horario_Tarea);
    this.brf.SetFormatToHour(this.ActividadForm, 'Final_Horario_Tarea', values.Final_Horario_Tarea);

    const conceptoClave = values.Concepto.Clave;
    const inicio_Horario_Tarea = this.ActividadForm.value.Inicio_Horario_Tarea;
    const final_Horario_Tarea = this.ActividadForm.value.Final_Horario_Tarea;
    const observaciones = values.Observaciones;    
    const folioDetalle = values.FolioDetalle;

    this.taskList = [];
    this.ActividadForm.reset();   
    this.saveTaskToBD(inicio_Horario_Tarea, final_Horario_Tarea, observaciones, conceptoClave, folioDetalle);
  }

  async saveTaskToBD(Inicio, Fin, Observaciones, Concepto, FolioDetalle) {

    let fechaReporte = this.Actividades_de_los_ColaboradoresForm.get('Fecha_de_Reporte').value;
    let colaborador = this.Actividades_de_los_ColaboradoresForm.get('Colaborador').value.Clave;
    let diaInhabil = this.checkedDiaInhabil == true ? 1 : 0;
    let folio = this.Actividades_de_los_ColaboradoresForm.get('Folio').value == "Auto" ? 0 : this.Actividades_de_los_ColaboradoresForm.get('Folio').value;

    let fecha = fechaReporte.split != undefined && fechaReporte.split.length == 2 ? fechaReporte.split('T')[0] : fechaReporte.toISOString().split('T')[0];
    let anio = fecha.split('-')[0];
    let mes = fecha.split('-')[1];
    let dia = fecha.split('-')[2];
    let fechaCompuesta = dia + "/" + mes + "/" + anio;

    if(folio != 0) {
      await this.brf.EvaluaQueryAsync(`UPDATE Actividades_de_los_Colaboradores SET Dia_Inhabil = ${diaInhabil} WHERE Folio = ${folio}`, 1, "ABC123");
    }
    
    if(FolioDetalle == null) {
      let query = `EXEC usp_Detalle_de_Actividades_de_Colaboradores_crear ${folio}, '${fechaCompuesta}', ${diaInhabil}, ${colaborador}, NULL, NULL, NULL, NULL, '${Inicio}', '${Fin}', NULL, '${Concepto}', NULL, '${Observaciones}' `;
      let resultFolio = await this.brf.EvaluaQueryAsync(query, 1, "ABC123");
      this.Actividades_de_los_ColaboradoresForm.get('Folio').setValue(resultFolio);
      console.log(resultFolio);      
      this._messages.success("La actividad fue creada correctamente");
      setTimeout(()=>{ 
        this._messages.close();
      }, 2500);
    }    

    if(FolioDetalle != null && FolioDetalle > 0) {
      let queryUpdDetalle = `UPDATE Detalle_de_Actividades_de_Colaboradores SET Dia_Inhabil = ${diaInhabil}, Hora_Inicial = '${Inicio}', Hora_Final = '${Fin}', Concepto = '${Concepto}', Observaciones = '${Observaciones}' WHERE Folio = ${FolioDetalle}`;
      let resultUpdDetalle = await this.brf.EvaluaQueryAsync(queryUpdDetalle, 1, "ABC123");
      console.log(resultUpdDetalle);
      this._messages.success("La actividad fue actualizada correctamente");
      setTimeout(()=>{ 
        this._messages.close();
      }, 2500);
    }

    let queryUpdHoras = `EXEC usp_Actividades_de_los_Colaboradores_calcularHoras ${folio}, ${colaborador}`;
    let resultUpdHoras = await this.brf.EvaluaQueryAsync(queryUpdHoras, 1, "ABC123");
    console.log(resultUpdHoras);

    this.Colaborador_ExecuteBusinessRules();    
  }

  async removeTask(i: any) {
    let folio = this.taskList[i].Folio;
    this._messages
      .confirmation(
        "¿Está seguro que desea eliminar el registro?",
        ""
      )
      .then(async () => {
        await this.brf.EvaluaQueryAsync(`EXEC sp_DelDetalle_de_Actividades_de_Colaboradores ${folio}`, 1, "ABC123");
        this.taskList = [];
        this.Colaborador_ExecuteBusinessRules();
        this._messages.success("La actividad fue eliminada correctamente");
        setTimeout(()=>{ 
          this._messages.close();
        }, 2500);
      });
  }

  editTask(i: any) {
    let folioDetalle = this.taskList[i].Folio;
    let inicio = this.taskList[i].Inicio;
    let fin = this.taskList[i].Fin;
    let descripcion = this.taskList[i].Descripcion;
    let observaciones = this.taskList[i].Observaciones;

    this.ActividadForm.get('Inicio_Horario_Tarea').setValue(inicio);
    this.ActividadForm.get('Final_Horario_Tarea').setValue(fin);
    this.ActividadForm.get('Concepto').setValue(descripcion);
    this.ActividadForm.get('Observaciones').setValue(observaciones);
    this.ActividadForm.get('FolioDetalle').setValue(folioDetalle);
  }

  resetActividadForm() {
    this.ActividadForm.reset();  
  }
  
  ngAfterViewInit(): void {
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
		
          this.Actividades_de_los_ColaboradoresForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Actividades_de_los_Colaboradores)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Actividades_de_los_ColaboradoresForm, 'Colaborador', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Actividades_de_los_ColaboradoresForm, 'Puesto', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Actividades_de_los_ColaboradoresForm, 'Empresa', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Actividades_de_los_ColaboradoresService.listaSelAll(0, 1, 'Actividades_de_los_Colaboradores.Folio=' + id).toPromise();
	if (result.Actividades_de_los_Colaboradoress.length > 0) {
	  
        this.model.fromObject(result.Actividades_de_los_Colaboradoress[0]);
        this.Actividades_de_los_ColaboradoresForm.get('Colaborador').setValue(
          result.Actividades_de_los_Colaboradoress[0].Colaborador_Creacion_de_Usuarios.Nombre_completo,
          { onlySelf: false, emitEvent: true }
        );
        this.Actividades_de_los_ColaboradoresForm.get('Puesto').setValue(
          result.Actividades_de_los_Colaboradoress[0].Puesto_Cargos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Actividades_de_los_ColaboradoresForm.get('Empresa').setValue(
          result.Actividades_de_los_Colaboradoress[0].Empresa_Cliente.Razon_Social,
          { onlySelf: false, emitEvent: true }
        );

        this.Actividades_de_los_ColaboradoresForm.markAllAsTouched();
        this.Actividades_de_los_ColaboradoresForm.updateValueAndValidity();

        await setTimeout(async () => {
          this.Colaborador_ExecuteBusinessRules(); 
        }, 2000);
      
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
    

  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Actividades_de_los_ColaboradoresForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Folio);
        } else {
          this.operation = "New";
        }
        this.rulesOnInit();
      });
  }
  
  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([]) => {

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Actividades_de_los_ColaboradoresForm.get('Colaborador').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingColaborador = true),
      distinctUntilChanged(),
      switchMap(value => {
        this.ColaboradorSeleccionado = value;
        if (!value) return this.Creacion_de_UsuariosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.Creacion_de_UsuariosService.listaSelAll(0, 20, '');
          return this.Creacion_de_UsuariosService.listaSelAll(0, 20,
            "Creacion_de_Usuarios.Nombre_completo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Creacion_de_UsuariosService.listaSelAll(0, 20,
          "Creacion_de_Usuarios.Nombre_completo like '%" + value.Nombre_completo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingColaborador = false;
      this.hasOptionsColaborador = result?.Creacion_de_Usuarioss?.length > 0;	  

      if(this.ColaboradorSeleccionado != null && this.ColaboradorSeleccionado != "") {
        if(result?.Creacion_de_Usuarioss?.length == 1){
          this.Actividades_de_los_ColaboradoresForm.get('Colaborador').setValue(result?.Creacion_de_Usuarioss[0], { onlySelf: true, emitEvent: false });
        }
      }

      this.optionsColaborador = of(result?.Creacion_de_Usuarioss);
    }, error => {
      this.isLoadingColaborador = false;
      this.hasOptionsColaborador = false;
      this.optionsColaborador = of([]);
    });
    this.Actividades_de_los_ColaboradoresForm.get('Puesto').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPuesto = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.CargosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.CargosService.listaSelAll(0, 20, '');
          return this.CargosService.listaSelAll(0, 20,
            "Cargos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.CargosService.listaSelAll(0, 20,
          "Cargos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingPuesto = false;
      this.hasOptionsPuesto = result?.Cargoss?.length > 0;
	  this.Actividades_de_los_ColaboradoresForm.get('Puesto').setValue(result?.Cargoss[0], { onlySelf: true, emitEvent: false });
	  this.optionsPuesto = of(result?.Cargoss);
    }, error => {
      this.isLoadingPuesto = false;
      this.hasOptionsPuesto = false;
      this.optionsPuesto = of([]);
    });
    this.Actividades_de_los_ColaboradoresForm.get('Empresa').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEmpresa = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.ClienteService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.ClienteService.listaSelAll(0, 20, '');
          return this.ClienteService.listaSelAll(0, 20,
            "Cliente.Razon_Social like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.ClienteService.listaSelAll(0, 20,
          "Cliente.Razon_Social like '%" + value.Razon_Social.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingEmpresa = false;
      this.hasOptionsEmpresa = result?.Clientes?.length > 0;
	  this.Actividades_de_los_ColaboradoresForm.get('Empresa').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });
	  this.optionsEmpresa = of(result?.Clientes);
    }, error => {
      this.isLoadingEmpresa = false;
      this.hasOptionsEmpresa = false;
      this.optionsEmpresa = of([]);
    });

    this.ActividadForm.get('Concepto').valueChanges.pipe(
          startWith(''),
          debounceTime(1),
          tap(() => this.isLoadingConcepto = true),
          distinctUntilChanged(),
          switchMap(value => {
            this.ConceptoSeleccionado = value;
            if (!value) return this.Catalogo_Actividades_de_ColaboradoresService.listaSelAll(0, 20, '');
            if (typeof value === 'string') {
              if (value === '') return this.Catalogo_Actividades_de_ColaboradoresService.listaSelAll(0, 20, '');
              return this.Catalogo_Actividades_de_ColaboradoresService.listaSelAll(0, 20,
                "Catalogo_Actividades_de_Colaboradores.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
            }
            return this.Catalogo_Actividades_de_ColaboradoresService.listaSelAll(0, 20,
              "Catalogo_Actividades_de_Colaboradores.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
          })
        ).subscribe(result => {
          this.isLoadingConcepto = false;
          this.hasOptionsConcepto = result?.Catalogo_Actividades_de_Colaboradoress?.length > 0;

          if(this.ConceptoSeleccionado != null && this.ConceptoSeleccionado != "") {
            this.ActividadForm.get('Concepto').setValue(result?.Catalogo_Actividades_de_Colaboradoress[0], { onlySelf: true, emitEvent: false });
          }
          
          this.optionsConcepto = of(result?.Catalogo_Actividades_de_Colaboradoress);
        }, error => {
          this.isLoadingConcepto = false;
          this.hasOptionsConcepto = false;
          this.optionsConcepto = of([]);
        });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

  displayFnColaborador(option: Creacion_de_Usuarios) {
    return option?.Nombre_completo;
  }
  displayFnPuesto(option: Cargos) {
    return option?.Descripcion;
  }
  displayFnEmpresa(option: Cliente) {
    return option?.Razon_Social;
  }
  displayFnConcepto(option: Catalogo_Actividades_de_Colaboradores) {
    return option?.Descripcion;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Actividades_de_los_ColaboradoresForm.value;
      entity.Folio = this.model.Folio;
      entity.Colaborador = this.Actividades_de_los_ColaboradoresForm.get('Colaborador').value.Clave;
      entity.Puesto = this.Actividades_de_los_ColaboradoresForm.get('Puesto').value.Clave;
      entity.Empresa = this.Actividades_de_los_ColaboradoresForm.get('Empresa').value.Clave;
	  	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Actividades_de_los_ColaboradoresService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Actividades_de_los_ColaboradoresService.insert(entity).toPromise().then(async id => {

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
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0 ) {
      this.Actividades_de_los_ColaboradoresForm.reset();
      this.model = new Actividades_de_los_Colaboradores(this.fb);
      this.Actividades_de_los_ColaboradoresForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Actividades_de_los_Colaboradores/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }
  
  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Actividades_de_los_Colaboradores/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      async Colaborador_ExecuteBusinessRules(): Promise<void> {

      //INICIA - BRID:4041 - Filtrar campos a partir de Colaborador - Autor: Aaron - Actualización: 7/1/2021 4:50:29 PM

      this.taskList = [];
      
      let colaborador = this.Actividades_de_los_ColaboradoresForm.get('Colaborador').value.Clave;
      let puesto = await this.brf.EvaluaQueryAsync(`select Descripcion from Cargos WITH(NOLOCK) WHERE Clave = (SELECT Cargo_desempenado FROM Creacion_de_Usuarios WITH(NOLOCK) WHERE Clave = '${colaborador}')`, 1, "ABC123");
      let empresa = await this.brf.EvaluaQueryAsync(`select Razon_Social from Cliente WITH(NOLOCK) WHERE Clave = (SELECT Empresa FROM Detalle_Empresas_Conf_Usuario WITH(NOLOCK) WHERE Configuracion_de_usuarios = '${colaborador}')`, 1, "ABC123");

      this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm,"Puesto", puesto);        
      this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm,"Empresa", empresa);

      await this.getActividadesColaboradores();

      if(this.dataSourceActividadesColaboradores.data.length == 0) {
        return;
      }

      this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm,"Folio", this.dataSourceActividadesColaboradores.data[0].Folio);        
      this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm,"Inicio_Horario_Laboral", this.dataSourceActividadesColaboradores.data[0].Inicio_Horario_Laboral);
      this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm,"Fin_Horario_Laboral", this.dataSourceActividadesColaboradores.data[0].Fin_Horario_Laboral);
      this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm,"Horas_Extras", this.dataSourceActividadesColaboradores.data[0].Horas_Extras);
      this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm,"Horas_Faltantes", this.dataSourceActividadesColaboradores.data[0].Horas_Faltantes);
      this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm,"Horas_Registradas", this.dataSourceActividadesColaboradores.data[0].Horas_Registradas);
      this.checkedDiaInhabil = this.dataSourceActividadesColaboradores.data[0].Dia_Inhabil == null ? false : this.dataSourceActividadesColaboradores.data[0].Dia_Inhabil;

      await this.getDetalleActividadesColaborador();

      this.dataSourceDetalleActividadesColaborador.data.forEach( async x => {
        this.taskList.push({ 
          Folio: x.Folio,
          id: this.taskList.length, 
          Clave: x.Concepto, 
          Descripcion: await this.brf.EvaluaQueryAsync(`SELECT Descripcion FROM Catalogo_Actividades_de_Colaboradores WHERE Clave = '${x.Concepto}'`, 1, "ABC123"), 
          Inicio: x.Hora_Inicial, 
          Fin: x.Hora_Final,
          Observaciones: x.Observaciones
        })
      });

      //TERMINA - BRID:4041

      //Colaborador_FieldExecuteBusinessRulesEnd

    }
    Puesto_ExecuteBusinessRules(): void {
        //Puesto_FieldExecuteBusinessRulesEnd
    }
    Empresa_ExecuteBusinessRules(): void {
        //Empresa_FieldExecuteBusinessRulesEnd
    }
    Inicio_Horario_Laboral_ExecuteBusinessRules(): void {
        //Inicio_Horario_Laboral_FieldExecuteBusinessRulesEnd
    }
    Fin_Horario_Laboral_ExecuteBusinessRules(): void {
        //Fin_Horario_Laboral_FieldExecuteBusinessRulesEnd
    }
    async Fecha_de_Reporte_ExecuteBusinessRules(): Promise<void> {

      let colaborador = this.Actividades_de_los_ColaboradoresForm.get('Colaborador').value.Clave;

      if(colaborador != undefined && colaborador != null) {
        this.Colaborador_ExecuteBusinessRules();
      }

      //Fecha_de_Reporte_FieldExecuteBusinessRulesEnd
    }
    Horas_Registradas_ExecuteBusinessRules(): void {
        //Horas_Registradas_FieldExecuteBusinessRulesEnd
    }
    Horas_Faltantes_ExecuteBusinessRules(): void {
        //Horas_Faltantes_FieldExecuteBusinessRulesEnd
    }
    Horas_Extras_ExecuteBusinessRules(): void {
        //Horas_Extras_FieldExecuteBusinessRulesEnd
    }
    async Dia_Inhabil_ExecuteBusinessRules(event: MatSlideToggleChange): Promise<void> {
      
      this.checkedDiaInhabil = event.checked;

      let diaInhabil = this.checkedDiaInhabil == true ? 1 : 0;
      let folio = this.Actividades_de_los_ColaboradoresForm.get('Folio').value == "Auto" ? 0 : this.Actividades_de_los_ColaboradoresForm.get('Folio').value;

      if(folio != 0) {
        await this.brf.EvaluaQueryAsync(`UPDATE Actividades_de_los_Colaboradores SET Dia_Inhabil = ${diaInhabil} WHERE Folio = ${folio}`, 1, "ABC123");
      }

      //Dia_Inhabil_FieldExecuteBusinessRulesEnd
    }
    No_Actividad_ExecuteBusinessRules(): void {
        //No_Actividad_FieldExecuteBusinessRulesEnd
    }
    Inicio_Horario_Tarea_ExecuteBusinessRules(): void {
      //Inicio_Horario_Tarea_ExecuteBusinessRulesEnd
    }
    Final_Horario_Tarea_ExecuteBusinessRules(): void {
      //Final_Horario_Tarea_ExecuteBusinessRulesEnd
    }
    Concepto_ExecuteBusinessRules(): void {
      //Concepto_ExecuteBusinessRulesEnd
    }
    Observaciones_ExecuteBusinessRules(): void {
      //Observaciones_ExecuteBusinessRulesEnd
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

if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  
} 

//INICIA - BRID:4007 - Acomodo de campos y tamaño - Autor: Aaron - Actualización: 7/1/2021 3:03:39 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:4007


//INICIA - BRID:4039 - Deshabilitar campos automáticos en Actividades - Autor: Aaron - Actualización: 7/1/2021 3:22:39 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.SetEnabledControl(this.Actividades_de_los_ColaboradoresForm, 'Folio', 0);
  this.brf.SetEnabledControl(this.Actividades_de_los_ColaboradoresForm, 'Horas_Registradas', 0);
  this.brf.SetEnabledControl(this.Actividades_de_los_ColaboradoresForm, 'Horas_Extras', 0);
  this.brf.SetEnabledControl(this.Actividades_de_los_ColaboradoresForm, 'Empresa', 0);
  this.brf.SetEnabledControl(this.Actividades_de_los_ColaboradoresForm, 'Puesto', 0);
  //this.brf.SetEnabledControl(this.Actividades_de_los_ColaboradoresForm, 'Fecha_de_Reporte', 0);
  this.brf.SetEnabledControl(this.Actividades_de_los_ColaboradoresForm, 'Horas_Faltantes', 0);
} 
//TERMINA - BRID:4039


//INICIA - BRID:4040 - Cargar Datos automaticos inicio - Autor: Aaron - Actualización: 7/1/2021 3:25:10 PM
if(  this.operation == 'New' ) {
  this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm, "Horas_Registradas", "0");
  this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm, "Horas_Extras", "0");
  this.brf.SetValueControl(this.Actividades_de_los_ColaboradoresForm, "Horas_Faltantes", "0"); 
  this.brf.SetCurrentDateToField(this.Actividades_de_los_ColaboradoresForm,"Fecha_de_Reporte");
} 
//TERMINA - BRID:4040

//rulesOnInit_ExecuteBusinessRulesEnd



  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit
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
