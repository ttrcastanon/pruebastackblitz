import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { Observable, Subject, of } from 'rxjs';
import { startWith, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';

import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';

import * as AppConstants from "../../../app-constants";
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';

import { NgxSpinnerService } from 'ngx-spinner';
import { TranslateService } from '@ngx-translate/core';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Codigo_ComputarizadoService } from 'src/app/api-services/Codigo_Computarizado.service';
import { Codigo_Computarizado } from 'src/app/models/Codigo_Computarizado';
import { Modelos } from 'src/app/models/Modelos';
import { FilterCombo } from 'src/app/models/filter-combo';
import { ObjectPermission } from "./../../../models/object-permission";

import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanService } from "src/app/api-services/spartan.service";

import { StorageKeys } from 'src/app/app-constants';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';

import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';


@Component({
  selector: 'app-Codigo_Computarizado',
  templateUrl: './Codigo_Computarizado.component.html',
  styleUrls: ['./Codigo_Computarizado.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Codigo_ComputarizadoComponent implements OnInit, AfterViewInit {

  //#region Variables
  Codigo_ComputarizadoForm: FormGroup;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;
  firstLoadEdit: boolean = true

  public Editor = ClassicEditor;
  model: Codigo_Computarizado;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsModelo: Observable<Modelos[]>;
  hasOptionsModelo: boolean;
  isLoadingModelo: boolean;

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
  //#endregion

  constructor(
    private fb: FormBuilder,
    private Codigo_ComputarizadoService: Codigo_ComputarizadoService,
    private ModelosService: ModelosService,
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

    this.model = new Codigo_Computarizado(this.fb);
    this.Codigo_ComputarizadoForm = this.model.buildFormGroup();

    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });

  }

  ngAfterViewInit(): void {
    //this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route.data.subscribe(
      v => {
        if (v.readOnly) {
          this.Codigo_ComputarizadoForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      }
    );

    this.dataListConfig = history.state.data;

    this._seguridad.permisos(AppConstants.Permisos.Codigo_Computarizado).subscribe(
      (response) => {
        this.permisos = response;
      }
    );

    this.brf.updateValidatorsToControl(this.Codigo_ComputarizadoForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    //this.rulesOnInit();	  
  }

  //#region Cargar Datos desde Editar
  populateModel(id: string) {
    this.spinner.show('loading');
    this.Codigo_ComputarizadoService.listaSelAll(0, 1, `Codigo_Computarizado.Descripcion_Busqueda='${id}' `).subscribe(async result => {
      if (result.Codigo_Computarizados.length > 0) {
        this.model.fromObject(result.Codigo_Computarizados[0]);
        this.Codigo_ComputarizadoForm.get('Modelo').setValue(
          result.Codigo_Computarizados[0].Modelo_Modelos.Descripcion,
          { onlySelf: false, emitEvent: true }
        );
        this.Codigo_ComputarizadoForm.controls["Codigo"].disable();

        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
    });
  }
  //#endregion


  //#region Obtener Parametros desde Ruta Editar
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Codigo = params.get('id');

        if (this.model.Codigo) {
          this.operation = !this.Codigo_ComputarizadoForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Codigo);
        } else {
          this.operation = "New";
        }
        this.rulesOnInit();
      });
  }
  //#endregion


  hasPermision(option) {
    return this.permisos.filter((r) => r.operationname == option).length > 0;
  }


  //#region Obtener Campos y Datos
  populateControls() {

    this.getParamsFromUrl();

    //Cambios en el campo Modelo
    this.Codigo_ComputarizadoForm.get('Modelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingModelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        //Al estar vacio
        if (!value) {
          return this.ModelosService.listaSelAll(0, 20, '');
        }
        //Al digitar
        if (typeof value === 'string') {
          if (value === "") {
            return this.ModelosService.listaSelAll(0, 20, '');
          }
          else {
            //Primera carga desde Editar o Consultar
            if (this.firstLoadEdit && (this.operation == "Update" || this.consult)) {
              this.firstLoadEdit = false;
              return this.ModelosService.listaSelAll(0, 20, "Modelos.Descripcion = '" + value.trim() + "'");
            }
            return this.ModelosService.listaSelAll(0, 20, "Modelos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
          }
        }
        //Al seleccionar
        return this.ModelosService.listaSelAll(0, 20, "Modelos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = result?.Modeloss?.length > 0;
      const value = this.Codigo_ComputarizadoForm.get('Modelo').value;
      if (result?.Modeloss?.length === 1 && value.length === result?.Modeloss[0].Descripcion.length)
        this.Codigo_ComputarizadoForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });

  }
  //#endregion


  filterCb(combo: string, filter: string) {
    switch (combo) {

      default: {
        break;
      }
    }
  }

  displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }


  //#region Guardar Datos
  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Codigo_ComputarizadoForm.value;

      entity.Modelo = this.Codigo_ComputarizadoForm.get('Modelo').value.Clave;

      //PUT: Actualizar
      if (this.model.Codigo != null) {
        entity.Codigo = this.model.Codigo;
        await this.brf.EvaluaQueryAsync(`update Codigo_Computarizado set 
        modelo = ${entity.Modelo},
        Codigo = '${entity.Codigo}',
        Descripcion ='${entity.Descripcion}',
        Tiempo_Estandar = '${entity.Tiempo_Estandar}',
        Descripcion_Busqueda = '${entity.Descripcion_Busqueda}',
        Por_Defecto_en_Cotizacion = ${+entity.Por_Defecto_en_Cotizacion} 
        where Descripcion_Busqueda = '${this.model.Descripcion_Busqueda}'`,1,'ABC123')

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Descripcion_Busqueda.toString());
        this.spinner.hide('loading');
        return this.model.Descripcion_Busqueda;
      }
      //POST: Nuevo
      else {
        await (this.Codigo_ComputarizadoService.insert(entity).toPromise().then(
          id => {
            console.log(id)
            if (id != null) {
              this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
            }
            return id;
          })
        );

      }

      this.snackBar.open('Registro guardado con éxito', '',
        {
          duration: 2000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'success'
        }
      );

      this.rulesAfterSave();
      this.isLoading = false;
      this.spinner.hide('loading');
    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }
  //#endregion


  async saveAndNew() {
    await this.saveData();
    if (this.model.Codigo === '0') {
      this.Codigo_ComputarizadoForm.reset();
      this.model = new Codigo_Computarizado(this.fb);
      this.Codigo_ComputarizadoForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Codigo_Computarizado/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Codigo = '0';

  }

  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Codigo_Computarizado/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    //console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas
  //@@Begin.Keep.Implementation('applyRules()')

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
console.log(this.Codigo_ComputarizadoForm.get('Modelo'))
console.log(this.operation)
    //INICIA - BRID:251 - Al abrir la pantalla en nuevo, modificar y consultar ocultar el campo Descripción Búsqueda - Autor: Lizeth Villa - Actualización: 2/9/2021 7:46:32 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.Codigo_ComputarizadoForm, "Descripcion_Busqueda"); this.brf.SetNotRequiredControl(this.Codigo_ComputarizadoForm, "Descripcion_Busqueda");
    }
    if (this.operation == 'Update' || this.operation == 'Consult') {
      
      this.brf.SetEnabledControl(this.Codigo_ComputarizadoForm, "Modelo",0);
    }
    //TERMINA - BRID:251

    //rulesOnInit_ExecuteBusinessRulesEnd

  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    //rulesAfterSave_ExecuteBusinessRulesEnd
  }


  //#region Reglas Antes de Guardar
  rulesBeforeSave(): boolean {
    const result = true;

    let Codigo = this.Codigo_ComputarizadoForm.controls["Codigo"].value;
    let Descripcion = this.Codigo_ComputarizadoForm.controls["Descripcion"].value;
    let Tiempo_Estandar = this.Codigo_ComputarizadoForm.controls["Tiempo_Estandar"].value;

    //Tiempo_Estandar = Tiempo_Estandar.substring(0, 2) + ':' + Tiempo_Estandar.substring(2, 4);

    this.Codigo_ComputarizadoForm.controls["Tiempo_Estandar"].setValue(Tiempo_Estandar);
    this.Codigo_ComputarizadoForm.controls["Descripcion_Busqueda"].setValue(`${Codigo} - ${Descripcion}`);

    return result;
  }
  //#endregion


  //@@End.Keep.Implementation('//Fin de reglas')

  //Fin de reglas

}
