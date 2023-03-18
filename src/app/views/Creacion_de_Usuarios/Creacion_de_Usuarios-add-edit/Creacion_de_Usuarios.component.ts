import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, LOCALE_ID } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray, AbstractControl } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator, MatPaginatorIntl } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap, pairwise } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

import { GeneralService } from 'src/app/api-services/general.service';
import { Creacion_de_UsuariosService } from 'src/app/api-services/Creacion_de_Usuarios.service';
import { Creacion_de_Usuarios } from 'src/app/models/Creacion_de_Usuarios';
import { CargosService } from 'src/app/api-services/Cargos.service';
import { Cargos } from 'src/app/models/Cargos';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { DepartamentoService } from 'src/app/api-services/Departamento.service';
import { Departamento } from 'src/app/models/Departamento';
import { Estatus_de_UsuarioService } from 'src/app/api-services/Estatus_de_Usuario.service';
import { Estatus_de_Usuario } from 'src/app/models/Estatus_de_Usuario';
import { Horarios_de_TrabajoService } from 'src/app/api-services/Horarios_de_Trabajo.service';
import { Horarios_de_Trabajo } from 'src/app/models/Horarios_de_Trabajo';
import { Detalle_Empresas_Conf_UsuarioService } from 'src/app/api-services/Detalle_Empresas_Conf_Usuario.service';
import { Detalle_Empresas_Conf_Usuario } from 'src/app/models/Detalle_Empresas_Conf_Usuario';
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
import * as moment from 'moment';
import { Creacion_de_Clientes } from '../../../models/Creacion_de_Clientes';
import { Creacion_de_UsuariosModule } from '../Creacion_de_Usuarios.module';
import { promise } from 'protractor';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Detalle_Empresas_Conf_UsuarioIndexRules } from '../../../shared/businessRules/Detalle_Empresas_Conf_Usuario-index-rules';
import { getDutchPaginatorIntl } from '../../../shared/base-views/dutch-paginator-intl';
import { AppDateAdapter, APP_DATE_FORMATS } from 'src/app/helpers/AppDateAdapter';
import { DatePipe, registerLocaleData } from '@angular/common';
import esMX from '@angular/common/locales/es-MX';

registerLocaleData(esMX);
@Component({
  selector: 'app-Creacion_de_Usuarios',
  templateUrl: './Creacion_de_Usuarios.component.html',
  styleUrls: ['./Creacion_de_Usuarios.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS },
    { provide: MatPaginatorIntl, useValue: getDutchPaginatorIntl()}

  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Creacion_de_UsuariosComponent implements OnInit, AfterViewInit {
MRaddEmpresa: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Creacion_de_UsuariosForm: FormGroup;
  public Editor = ClassicEditor;
  model: Creacion_de_Usuarios;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varCargos: Cargos[] = [];
  optionsJefe_inmediato: Observable<Spartan_User[]>;
  hasOptionsJefe_inmediato: boolean;
  isLoadingJefe_inmediato: boolean;
  public varDepartamento: Departamento[] = [];
  public varEstatus_de_Usuario: Estatus_de_Usuario[] = [];
  public varHorarios_de_Trabajo: Horarios_de_Trabajo[] = [];
  Firma_digitalSelectedFile: File;
  Firma_digitalName = '';
  fileFirma_digital: SpartanFile;
  public varCliente: Cliente[] = [];
  

  autoEmpresa_Detalle_Empresas_Conf_Usuario = new FormControl();
  SelectedEmpresa_Detalle_Empresas_Conf_Usuario: string[] = [];
  isLoadingEmpresa_Detalle_Empresas_Conf_Usuario: boolean;
  searchEmpresa_Detalle_Empresas_Conf_UsuarioCompleted: boolean;
  isEmpresaOpen: boolean = false;
  
  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceEmpresa = new MatTableDataSource<Detalle_Empresas_Conf_Usuario>();
  EmpresaColumns = [
    { def: 'actions', hide: false },
    { def: 'Empresa', hide: false },

  ];
  EmpresaData: Detalle_Empresas_Conf_Usuario[] = [];
  today = new Date();
  consult: boolean = false;
  emailEnpty: boolean = false;
  correoPlaceholder: string = "";
  usuarioPlaceholder: string = "";
  cargaJefeInmediato: boolean = true;
  empresasEliminadas : Detalle_Empresas_Conf_Usuario[] = [];
  empresasEliminadasControls : AbstractControl[] = [];

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Creacion_de_UsuariosService: Creacion_de_UsuariosService,
    private CargosService: CargosService,
    private Spartan_UserService: Spartan_UserService,
    private DepartamentoService: DepartamentoService,
    private Estatus_de_UsuarioService: Estatus_de_UsuarioService,
    private Horarios_de_TrabajoService: Horarios_de_TrabajoService,
    private Detalle_Empresas_Conf_UsuarioService: Detalle_Empresas_Conf_UsuarioService,
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
    private datePipe: DatePipe,
    renderer: Renderer2) {
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Creacion_de_Usuarios(this.fb);
    this.Creacion_de_UsuariosForm = this.model.buildFormGroup();
    this.EmpresaItems.removeAt(0);

    this.Creacion_de_UsuariosForm.get('Clave').disable();
    this.Creacion_de_UsuariosForm.get('Clave').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceEmpresa.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.EmpresaColumns.splice(0, 1);

          this.Creacion_de_UsuariosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Creacion_de_Usuarios)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Creacion_de_UsuariosForm, 'Jefe_inmediato', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Creacion_de_UsuariosForm, 'Correo_electronico', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]);



    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Creacion_de_UsuariosService.listaSelAll(0, 1, 'Creacion_de_Usuarios.Clave=' + id).toPromise();
    if (result.Creacion_de_Usuarioss.length > 0) {
      let fEmpresa = await this.Detalle_Empresas_Conf_UsuarioService.listaSelAll(0, 1000, 'Creacion_de_Usuarios.Clave=' + id).toPromise();
      this.EmpresaData = fEmpresa.Detalle_Empresas_Conf_Usuarios;
      this.loadEmpresa(fEmpresa.Detalle_Empresas_Conf_Usuarios);
      this.dataSourceEmpresa = new MatTableDataSource(fEmpresa.Detalle_Empresas_Conf_Usuarios);
      this.dataSourceEmpresa.paginator = this.paginator;
      this.dataSourceEmpresa.sort = this.sort;

      this.model.fromObject(result.Creacion_de_Usuarioss[0]);
      var Jefe_inmediato = {
        Id_User: result.Creacion_de_Usuarioss[0].Jefe_inmediato_Spartan_User.Id_User,
        Name: result.Creacion_de_Usuarioss[0].Jefe_inmediato_Spartan_User.Name,
      }
      this.Creacion_de_UsuariosForm.get('Jefe_inmediato').setValue(
        Jefe_inmediato,
        { onlySelf: false, emitEvent: true }
      );
      if (this.model.Firma_digital !== null && this.model.Firma_digital !== undefined) {
        this.spartanFileService.getById(this.model.Firma_digital).subscribe(f => {
          this.fileFirma_digital = f;
          this.Firma_digitalName = f.Description;
        });
      }

      this.Creacion_de_UsuariosForm.markAllAsTouched();
      this.Creacion_de_UsuariosForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get EmpresaItems() {
    return this.Creacion_de_UsuariosForm.get('Detalle_Empresas_Conf_UsuarioItems') as FormArray;
  }


  validateEmail() {
    if (this.Creacion_de_UsuariosForm.get('Correo_electronico').invalid) {
      let email = this.Creacion_de_UsuariosForm.get('Correo_electronico').value;
      this.emailEnpty = email.length > 0;
      //this.Creacion_de_UsuariosForm.get('Correo_electronico').setValue("");
    }
  }

  setFullName() {
    let fullName = this.Creacion_de_UsuariosForm.get('Nombres').value + " " + this.Creacion_de_UsuariosForm.get('Apellido_paterno').value + " " + this.Creacion_de_UsuariosForm.get('Apellido_materno').value;
    this.Creacion_de_UsuariosForm.get('Nombre_completo').setValue(fullName);
  }

  getEmpresaColumns(): string[] {
    return this.EmpresaColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadEmpresa(Empresa: Detalle_Empresas_Conf_Usuario[]) {
    Empresa.forEach(element => {
      this.addEmpresa(element);
    });
  }

  calculateAge() {
    let hoy = new Date()
    let fechaNacimiento = new Date(this.Creacion_de_UsuariosForm.get('Fecha_de_Nacimiento').value);

    let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
    let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
    if (diferenciaMeses < 0 ||
      (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
      edad--
    }
    this.Creacion_de_UsuariosForm.get('Edad').setValue(edad);
  }

  addEmpresaToMR() {
    debugger
    const Empresa = new Detalle_Empresas_Conf_Usuario(this.fb);
    this.EmpresaData.push(this.addEmpresa(Empresa));
    this.dataSourceEmpresa.data = this.EmpresaData;
    Empresa.edit = true;
    Empresa.isNew = true;
    const length = this.dataSourceEmpresa.data.length;
    const index = length - 1;
    const formEmpresa = this.EmpresaItems.controls[index] as FormGroup;
    this.brf.updateValidatorsToControl(formEmpresa, 'Empresa', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    this.addFilterToControlEmpresa_Detalle_Empresas_Conf_Usuario(formEmpresa.controls.Empresa, index);

    const page = Math.ceil(this.dataSourceEmpresa.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }

    this.isEmpresaOpen = true  
  }

  addEmpresa(entity: Detalle_Empresas_Conf_Usuario) {
    const Empresa = new Detalle_Empresas_Conf_Usuario(this.fb);
    this.EmpresaItems.push(Empresa.buildFormGroup());
    if (entity) {
      Empresa.fromObject(entity);
    }
    this.isEmpresaOpen = false
    return entity;
  }

  EmpresaItemsByFolio(Folio: number): FormGroup {
    return (this.Creacion_de_UsuariosForm.get('Detalle_Empresas_Conf_UsuarioItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  EmpresaItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceEmpresa.data.indexOf(element);
    let fb = this.EmpresaItems.controls[index] as FormGroup;
    return fb;
  }

  getCountEmpresas(): number {
    return this.dataSourceEmpresa.data.filter(d => !d.IsDeleted).length;
  }

  deleteEmpresa(element: any) {
    let index = this.dataSourceEmpresa.data.indexOf(element);
    this.EmpresaData[index].IsDeleted = true;
    this.dataSourceEmpresa.data = this.EmpresaData;
    this.empresasEliminadas.push(this.EmpresaData[index]);
    this.empresasEliminadasControls.push( this.EmpresaItems.controls[index]);
    this.EmpresaData.splice(index,1)
    this.EmpresaItems.controls.splice(index,1)
    this.dataSourceEmpresa._updateChangeSubscription();

    index = this.dataSourceEmpresa.data.filter(d => !d.IsDeleted).length;
    let fgr = this.Creacion_de_UsuariosForm.controls.Detalle_Empresas_Conf_UsuarioItems as FormArray;
    fgr.removeAt(index);

    this.SelectedEmpresa_Detalle_Empresas_Conf_Usuario[index] = "";
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditEmpresa(element: any) {
    let index = this.dataSourceEmpresa.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.EmpresaData[index].IsDeleted = true;
      this.EmpresaData.splice(index,1)
      this.EmpresaItems.controls.splice(index,1)
      this.dataSourceEmpresa.data = this.EmpresaData;
      
      this.dataSourceEmpresa._updateChangeSubscription();
      index = this.EmpresaData.filter(d => !d.IsDeleted).length;
      let fgr = this.Creacion_de_UsuariosForm.controls.Detalle_Empresas_Conf_UsuarioItems as FormArray;
    fgr.removeAt(index);
    this.SelectedEmpresa_Detalle_Empresas_Conf_Usuario[index] = "";
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
    this.isEmpresaOpen = false
    
  }

  async saveEmpresa(element: any) {
    
    const index = this.dataSourceEmpresa.data.indexOf(element);
    const formEmpresa = this.EmpresaItems.controls[index] as FormGroup;
    if(this.dataSourceEmpresa.data && this.dataSourceEmpresa.data.length > 0){
      let findEmpresa = this.dataSourceEmpresa.data.find(x=> x.Empresa == formEmpresa.value.Empresa)
      if(findEmpresa){
        this.snackBar.open('La empresa seleccionada ya se encuentra registrada', '', {
          duration: 3000,
          verticalPosition: 'top',
          horizontalPosition: 'right',
          panelClass: 'warning'
        });
        this.cancelEditEmpresa(element);
        return;
      }
    }
    if (this.EmpresaData[index].Empresa !== formEmpresa.value.Empresa && formEmpresa.value.Empresa > 0) {
      let cliente = await this.ClienteService.getById(formEmpresa.value.Empresa).toPromise();
      this.EmpresaData[index].Empresa_Cliente = cliente;
    }
    this.EmpresaData[index].Empresa = formEmpresa.value.Empresa;

    this.EmpresaData[index].isNew = false;
    this.dataSourceEmpresa.data = this.EmpresaData;
    this.dataSourceEmpresa._updateChangeSubscription();
    this.isEmpresaOpen = false;
    console.log(this.dataSourceEmpresa.data)
  }

  editEmpresa(element: any) {
    const index = this.dataSourceEmpresa.data.indexOf(element);
    const formEmpresa = this.EmpresaItems.controls[index] as FormGroup;
    this.SelectedEmpresa_Detalle_Empresas_Conf_Usuario[index] = this.dataSourceEmpresa.data[index].Empresa_Cliente.Razon_Social;
    this.addFilterToControlEmpresa_Detalle_Empresas_Conf_Usuario(formEmpresa.controls.Empresa, index);

    element.edit = true;
    this.isEmpresaOpen = false
  }

  async saveDetalle_Empresas_Conf_Usuario(Folio: number) {
    let values: string = '';
    this.dataSourceEmpresa.data = this.dataSourceEmpresa.data.concat(this.empresasEliminadas);
    this.EmpresaItems.controls = this.EmpresaItems.controls.concat(this.empresasEliminadasControls);
    this.dataSourceEmpresa.data.forEach(async (d, index) => {
      const data = this.EmpresaItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Configuracion_de_usuarios = Folio;


      if (model.Folio === 0) {
        // Add Empresa
        //let response = await this.Detalle_Empresas_Conf_UsuarioService.insert(model).toPromise();
        values = values + `(${model.Configuracion_de_usuarios}, ${model.Empresa}),`;
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formEmpresa = this.EmpresaItemsByFolio(model.Folio);
        if (formEmpresa.dirty) {
          // Update Empresa
          let response = await this.Detalle_Empresas_Conf_UsuarioService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Empresa
        //await this.Detalle_Empresas_Conf_UsuarioService.delete(model.Folio).toPromise();
        this.Detalle_Empresas_Conf_UsuarioService.delete(model.Folio).toPromise();
      }
    });

    if(values != ''){
      this.brf.EvaluaQuery(`INSERT INTO Detalle_Empresas_Conf_Usuario VALUES ${values.slice(0, -1)}`, 1, "ABC123");
    }
  }

  public selectEmpresa_Detalle_Empresas_Conf_Usuario(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceEmpresa.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedEmpresa_Detalle_Empresas_Conf_Usuario[index] = event.option.viewValue;
    let fgr = this.Creacion_de_UsuariosForm.controls.Detalle_Empresas_Conf_UsuarioItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Empresa.setValue(event.option.value);
    this.displayFnEmpresa_Detalle_Empresas_Conf_Usuario(element);
  }

  displayFnEmpresa_Detalle_Empresas_Conf_Usuario(this, element) {
    const index = this.dataSourceEmpresa.data.indexOf(element);
    return this.SelectedEmpresa_Detalle_Empresas_Conf_Usuario[index];
  }
  updateOptionEmpresa_Detalle_Empresas_Conf_Usuario(event, element: any) {
    const index = this.dataSourceEmpresa.data.indexOf(element);
    this.SelectedEmpresa_Detalle_Empresas_Conf_Usuario[index] = event.source.viewValue;
  }

  _filterEmpresa_Detalle_Empresas_Conf_Usuario(filter: any): Observable<Cliente> {
    const where = filter !== '' ? "Cliente.Estatus = 1 and Cliente.Razon_Social like '%" + filter + "%'" : 'Cliente.Estatus = 1';
    return this.ClienteService.listaSelAll(0, 20, where);
  }

  addFilterToControlEmpresa_Detalle_Empresas_Conf_Usuario(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingEmpresa_Detalle_Empresas_Conf_Usuario = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingEmpresa_Detalle_Empresas_Conf_Usuario = true;
        return this._filterEmpresa_Detalle_Empresas_Conf_Usuario(value || '');
      })
    ).subscribe(result => {
      this.varCliente = result.Clientes;
      this.isLoadingEmpresa_Detalle_Empresas_Conf_Usuario = false;
      this.searchEmpresa_Detalle_Empresas_Conf_UsuarioCompleted = true;
      this.SelectedEmpresa_Detalle_Empresas_Conf_Usuario[index] = this.varCliente.length === 0 ? '' : this.SelectedEmpresa_Detalle_Empresas_Conf_Usuario[index];
    });
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Clave = +params.get('id');

        if (this.model.Clave) {
          this.operation = !this.Creacion_de_UsuariosForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Clave);
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
    observablesArray.push(this.CargosService.getAll());
    observablesArray.push(this.DepartamentoService.getAll());
    observablesArray.push(this.Estatus_de_UsuarioService.getAll());
    observablesArray.push(this.Horarios_de_TrabajoService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varCargos, varDepartamento, varEstatus_de_Usuario, varHorarios_de_Trabajo]) => {
          this.varCargos = varCargos;
          this.varDepartamento = varDepartamento;
          this.varEstatus_de_Usuario = varEstatus_de_Usuario;
          this.varHorarios_de_Trabajo = varHorarios_de_Trabajo;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Creacion_de_UsuariosForm.get('Jefe_inmediato').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingJefe_inmediato = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.Spartan_UserService.listaSelAll(0, 20, 'Spartan_User.Status = 1');
        if (typeof value === 'string') {
          if (value === '') return this.Spartan_UserService.listaSelAll(0, 20, 'Spartan_User.Status = 1');
          return this.Spartan_UserService.listaSelAll(0, 20,
            "Spartan_User.Status = 1 and Spartan_User.Name like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.Spartan_UserService.listaSelAll(0, 20,
          "Spartan_User.Status = 1 and Spartan_User.Name like '%" + value.Name.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingJefe_inmediato = false;
      this.hasOptionsJefe_inmediato = result?.Spartan_Users?.length > 0;
      if (this.model.Clave > 0 && (this.cargaJefeInmediato || result?.Spartan_Users?.length == 1)) {
        this.cargaJefeInmediato = false;
        this.Creacion_de_UsuariosForm.get('Jefe_inmediato').setValue(result?.Spartan_Users[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsJefe_inmediato = of(result?.Spartan_Users);
    }, error => {
      this.isLoadingJefe_inmediato = false;
      this.hasOptionsJefe_inmediato = false;
      this.optionsJefe_inmediato = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Cargo_desempenado': {
        this.CargosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCargos = x.Cargoss;
        });
        break;
      }
      case 'Departamento': {
        this.DepartamentoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varDepartamento = x.Departamentos;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_de_UsuarioService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Usuario = x.Estatus_de_Usuarios;
        });
        break;
      }
      case 'Horario_de_trabajo': {
        this.Horarios_de_TrabajoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varHorarios_de_Trabajo = x.Horarios_de_Trabajos;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

  displayFnJefe_inmediato(option: Spartan_User) {
    return option?.Name;
  }

  async saveFirma_digital(): Promise<number> {
    if (this.Creacion_de_UsuariosForm.controls.Firma_digitalFile.valid
      && this.Creacion_de_UsuariosForm.controls.Firma_digitalFile.dirty) {
      const Firma_digital = this.Creacion_de_UsuariosForm.controls.Firma_digitalFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Firma_digital);
      const spartanFile = {
        File: byteArray,
        Description: Firma_digital.name,
        Date_Time: Firma_digital.lastModifiedDate,
        File_Size: Firma_digital.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Firma_digital > 0 ? this.model.Firma_digital : 0;
    }
  }

  Firma_digitalUrl() {
    if (this.fileFirma_digital)
      return this.spartanFileService.url(this.fileFirma_digital.File_Id.toString(), this.fileFirma_digital.Description);
    return '#';
  }

  getFirma_digital() {
    this.helperService.dowloadFile(this.fileFirma_digital.base64, this.Firma_digitalName);
  }

  removeFirma_digital() {
    this.Firma_digitalName = '';
    this.model.Firma_digital = 0;
  }

  async save() {
  const sd =   await this.saveData();
  if(sd){
    this.goToList();
  }

  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');

    if (this.rulesBeforeSave()) {


      
      const entity = this.Creacion_de_UsuariosForm.value;
      delete entity.Creacion_de_Usuarioss;
      entity.Creacion_de_Usuario = this.Creacion_de_UsuariosForm.controls.Creacion_de_Usuario.value
      entity.Clave = this.model.Clave;
      entity.Jefe_inmediato = this.Creacion_de_UsuariosForm.get('Jefe_inmediato').value.Id_User;
      entity.Nombre_completo = this.Creacion_de_UsuariosForm.get('Nombre_completo').value;
      entity.Edad = this.Creacion_de_UsuariosForm.controls.Edad.value
      entity.Tiempo_en_la_Empresa = this.Creacion_de_UsuariosForm.controls.Tiempo_en_la_Empresa.value
      entity.Creacion_de_Usuario = this.datePipe.transform(this.Creacion_de_UsuariosForm.controls.Creacion_de_Usuario.value, 'yyyy-MM-dd');
      entity.Fecha_de_Ingreso = this.datePipe.transform(this.Creacion_de_UsuariosForm.controls.Fecha_de_Ingreso.value, 'yyyy-MM-dd');
      entity.Fecha_de_Nacimiento = this.datePipe.transform(this.Creacion_de_UsuariosForm.controls.Fecha_de_Nacimiento.value, 'yyyy-MM-dd');
      const FolioFirma_digital = await this.saveFirma_digital();
      entity.Firma_digital = FolioFirma_digital > 0 ? FolioFirma_digital : null;

      if (this.model.Clave > 0) {
        await this.Creacion_de_UsuariosService.update(this.model.Clave, entity).toPromise();

        await this.saveDetalle_Empresas_Conf_Usuario(this.model.Clave);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Clave.toString());
        this.spinner.hide('loading');
        await this.rulesAfterSave();
        return this.model.Clave;
      } else {
        await (this.Creacion_de_UsuariosService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Empresas_Conf_Usuario(id);

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
      await this.rulesAfterSave();
      this.isLoading = false;
      this.spinner.hide('loading');
      return true;
    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  soloFecha(e) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '/'];
    const keyPressed = e.key;

    if (!allowedKeys.includes(keyPressed)) {
      e.preventDefault();
      return;
    }
    if (e.target.value.length >10) {
      e.preventDefault();
      return;
    }
  }
  async saveAndNew() {
    await this.saveData();
    if (this.model.Clave === 0) {
      this.Creacion_de_UsuariosForm.reset();
      this.model = new Creacion_de_Usuarios(this.fb);
      this.Creacion_de_UsuariosForm = this.model.buildFormGroup();
      this.dataSourceEmpresa = new MatTableDataSource<Detalle_Empresas_Conf_Usuario>();
      this.EmpresaData = [];

    } else {
      this.router.navigate(['views/Creacion_de_Usuarios/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Clave = 0;

  }

  cancel() {
    this.goToList();
  }

  async goToList() {
    this.router.navigate(['/Creacion_de_Usuarios/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Nombres_ExecuteBusinessRules(): void {
    this.getNombre_completo()
    //Nombres_FieldExecuteBusinessRulesEnd
  }
  Apellido_paterno_ExecuteBusinessRules(): void {
    this.getNombre_completo()
    //Apellido_paterno_FieldExecuteBusinessRulesEnd
  }
  Apellido_materno_ExecuteBusinessRules(): void {
    this.getNombre_completo()
    //Apellido_materno_FieldExecuteBusinessRulesEnd
  }
  Nombre_completo_ExecuteBusinessRules(): void {
    //Nombre_completo_FieldExecuteBusinessRulesEnd
  }
  Curp_ExecuteBusinessRules(): void {
    //Curp_FieldExecuteBusinessRulesEnd
  }
  async Fecha_de_Nacimiento_ExecuteBusinessRules(): Promise<void> {

    //INICIA - BRID:1435 - Asignar edad. - Autor: Ivan Yañez - Actualización: 3/10/2021 2:12:06 PM
    if (!this.Creacion_de_UsuariosForm.controls['Fecha_de_Nacimiento'].value) return;
    let fecha = this.Creacion_de_UsuariosForm.controls['Fecha_de_Nacimiento'].value//.toLocaleDateString();
    // this.brf.SetValueControl(this.Creacion_de_UsuariosForm, "Edad",
    //   await this.brf.EvaluaQueryAsync(`exec usptemporalidad '${fecha}'`, 1, "ABC123"));
    //this.calculateAge()
    //TERMINA - BRID:1435
    
    if(fecha.toISOString().includes('+')) {
      this.Creacion_de_UsuariosForm.controls['Fecha_de_Nacimiento'].setValue('');
      return;
    }else{
      this.brf.SetValueControl(this.Creacion_de_UsuariosForm, "Edad",this.calcularAñosMes(fecha));

    }
    //Fecha_de_Nacimiento_FieldExecuteBusinessRulesEnd

  }
  async Fecha_de_Ingreso_ExecuteBusinessRules(): Promise<void> {
    if (!this.Creacion_de_UsuariosForm.controls['Fecha_de_Ingreso'].value) return;
    let fecha = this.Creacion_de_UsuariosForm.controls['Fecha_de_Ingreso'].value//.toLocaleDateString();
    //INICIA - BRID:1437 - Asignar tiempo en la empresa - Autor: Ivan Yañez - Actualización: 3/10/2021 2:15:55 PM
    // this.brf.SetValueControl(this.Creacion_de_UsuariosForm, "Tiempo_en_la_Empresa",
    //   await this.brf.EvaluaQueryAsync(`exec usptemporalidad '${fecha}'`, 1, "ABC123"));

       
    if(fecha.toISOString().includes('+')) {
      this.Creacion_de_UsuariosForm.controls['Fecha_de_Ingreso'].setValue('');
      return;
    }else{
      this.brf.SetValueControl(this.Creacion_de_UsuariosForm, "Tiempo_en_la_Empresa",this.calcularAñosMes(fecha));
    }
    //TERMINA - BRID:1437
  
    //Fecha_de_Ingreso_FieldExecuteBusinessRulesEnd

  }

  

  calcularAñosMes(f) {
    const fecha = moment(f);
    const fechaActual  = moment(this.today)
    let años = fechaActual.diff(fecha, "years")
    let meses = Math.trunc(((fechaActual.diff(fecha, "years",true)-años)+0.0001)*12)
    if(meses == 12){
      meses = 0;
      años += 1;
    }
    //const fechaNacimiento = new Date(this.datePipe.transform(f, 'yyyy-MM-dd'));

    // // Crear un objeto de fecha actual
    // const fechaActual = new Date();

    // // Restar la fecha de nacimiento del objeto de fecha actual
    // const diferencia = fechaActual.getTime() - fechaNacimiento.getTime();

    // // Convertir la diferencia en milisegundos a años, meses y días
    // const edadEnMilisegundos = Date.parse('01/01/1970') + diferencia;
    // const edad = new Date(edadEnMilisegundos);
    // const años = edad.getUTCFullYear() - 1970;
    // const meses = edad.getUTCMonth();
    return `${años} AÑOS ${meses} MESES`;
  } 
  Creacion_de_Usuario_ExecuteBusinessRules(): void {
    //Creacion_de_Usuario_FieldExecuteBusinessRulesEnd
  }
  Edad_ExecuteBusinessRules(): void {
    //Edad_FieldExecuteBusinessRulesEnd
  }
  Tiempo_en_la_Empresa_ExecuteBusinessRules(): void {
    //Tiempo_en_la_Empresa_FieldExecuteBusinessRulesEnd
  }
  Cargo_desempenado_ExecuteBusinessRules(): void {
    //Cargo_desempenado_FieldExecuteBusinessRulesEnd
  }
  Jefe_inmediato_ExecuteBusinessRules(): void {
    //Jefe_inmediato_FieldExecuteBusinessRulesEnd
  }
  Departamento_ExecuteBusinessRules(): void {
    //Departamento_FieldExecuteBusinessRulesEnd
  }
  async Usuario_ExecuteBusinessRules(): Promise<void> {

    let usuarioIngresado = this.Creacion_de_UsuariosForm.controls['Usuario'].value;
    let countUsuario = await this.brf.EvaluaQueryAsync(`SELECT COUNT(ID_USER) FROM SPARTAN_USER WHERE USERNAME = '${usuarioIngresado}'`, 1, 'ABC123');

    if (countUsuario > this.brf.TryParseInt('0', '0')) {
      this.usuarioPlaceholder = 'El usuario ingresado ya está registrado. Favor de intentar con otro.';
      this.Creacion_de_UsuariosForm.get('Usuario').setValue('');

      let elementReference = document.querySelector('#inputUsuario');
      if (elementReference instanceof HTMLElement) {
        elementReference.focus();
      }
    }
    else {
      this.usuarioPlaceholder = '';
    }
    //Usuario_FieldExecuteBusinessRulesEnd
  }
  Contrasena_ExecuteBusinessRules(): void {
    //Contrasena_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  async Correo_electronico_ExecuteBusinessRules(): Promise<void> {

    let correoElectronico = this.Creacion_de_UsuariosForm.controls['Correo_electronico'].value;
    let countEmail = await this.brf.EvaluaQueryAsync(`SELECT COUNT(Email) FROM SPARTAN_USER WHERE Email = '${correoElectronico}'`, 1, 'ABC123');

    if (countEmail > this.brf.TryParseInt('0', '0')) {
      this.correoPlaceholder = 'El correo ingresado ya está registrado. Favor de intentar con otro.';
      this.Creacion_de_UsuariosForm.get('Correo_electronico').setValue('');

      let elementReference = document.querySelector('#inputCorreo_electronico');
      if (elementReference instanceof HTMLElement) {
        elementReference.focus();
      }
    }
    else {
      this.correoPlaceholder = '';
    }
    //Correo_electronico_FieldExecuteBusinessRulesEnd
  }
  Telefono_ExecuteBusinessRules(): void {
    //Telefono_FieldExecuteBusinessRulesEnd
  }
  Celular_ExecuteBusinessRules(): void {
    //Celular_FieldExecuteBusinessRulesEnd
  }
  Direccion_ExecuteBusinessRules(): void {
    //Direccion_FieldExecuteBusinessRulesEnd
  }
  Horario_de_trabajo_ExecuteBusinessRules(): void {
    //Horario_de_trabajo_FieldExecuteBusinessRulesEnd
  }
  Firma_digital_ExecuteBusinessRules(): void {
    //Firma_digital_FieldExecuteBusinessRulesEnd
  }
  Usuario_Registrado_ExecuteBusinessRules(): void {
    //Usuario_Registrado_FieldExecuteBusinessRulesEnd
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


    //BRID:182 - DESHABILITAR NOMBRE COMPLETO EN USUARIOS - Autor: Felipe Rodríguez - Actualización: 2/6/2021 10:04:00 AM
    this.brf.SetEnabledControl(this.Creacion_de_UsuariosForm, 'Nombre_completo', 0);

    //BRID:213 - OCULTAR CAMPO USUARIO REGISTRADO - Autor: Felipe Rodríguez - Actualización: 2/8/2021 12:10:31 PM
    this.brf.SetNotRequiredControl(this.Creacion_de_UsuariosForm, "Usuario_Registrado");
    this.brf.HideFieldOfForm(this.Creacion_de_UsuariosForm, "Usuario_Registrado");

    //BRID:1434 - Des habilitar el campo edad y tiempo en la empresa - Autor: Ivan Yañez - Actualización: 3/10/2021 1:13:48 PM
    this.brf.SetEnabledControl(this.Creacion_de_UsuariosForm, 'Edad', 0);
    this.brf.SetEnabledControl(this.Creacion_de_UsuariosForm, 'Tiempo_en_la_Empresa', 0);

    //BRID:2641 - firma digital no requerida - Autor: Administrador - Actualización: 4/9/2021 1:13:11 PM
    this.brf.SetNotRequiredControl(this.Creacion_de_UsuariosForm, "Firma_digital");

    //BRID:2684 - campo no requerido para curp--. - Autor: Administrador - Actualización: 4/13/2021 10:22:35 AM
    this.brf.SetNotRequiredControl(this.Creacion_de_UsuariosForm, "Curp");

    //BRID:1445 - Regla para obtener los valores default al abrir la pantalla - Autor: Administrador - Actualización: 3/11/2021 10:45:38 AM

    if (this.operation == 'New') {
      this.Creacion_de_UsuariosForm.get('Creacion_de_Usuario').setValue(this.today)
      this.brf.SetEnabledControl(this.Creacion_de_UsuariosForm, 'Creacion_de_Usuario', 0);
    }

    if (this.operation == 'Update') {

      this.brf.SetEnabledControl(this.Creacion_de_UsuariosForm, 'Creacion_de_Usuario', 0);
    }

    
    //rulesOnInit_ExecuteBusinessRulesEnd


  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    let KeyValueInserted = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted);
    let lblClave = this.Creacion_de_UsuariosForm.controls['Clave'].value
    let Cargo_desempenado = this.Creacion_de_UsuariosForm.controls['Cargo_desempenado'].value
    let Usuario_Registrado = this.Creacion_de_UsuariosForm.controls['Usuario_Registrado'].value
    let Estatus = this.Creacion_de_UsuariosForm.controls['Estatus'].value
    let contraseña = this.Creacion_de_UsuariosForm.controls.Contrasena.value;


    //INICIA - BRID:214 - INSERT A SPARTAN_USER DESDE CREACIÓN DE USUARIOS - Autor: Felipe Rodríguez - Actualización: 2/19/2021 2:33:27 PM
    if (this.operation == 'New') {
      if (await this.brf.EvaluaQueryAsync(`SELECT COUNT(NOMBRE_COMPLETO) FROM Creacion_de_Usuarios WHERE CLAVE = ${KeyValueInserted}`, 1, 'ABC123') == this.brf.TryParseInt('1', '1')) {
        this.brf.EvaluaQueryAsync(` EXEC Insert_Creacion_Usuarios_SpartaneUser ${KeyValueInserted}, ${Cargo_desempenado}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:214

    

    //INICIA - BRID:481 - Actualizar Spartan_User Activo/Inactivo - Autor: Administrador - Actualización: 2/19/2021 3:47:34 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.EvaluaQueryAsync(`exec sp_UpdateSpartaneUserByUser ${Usuario_Registrado}, ${Estatus}`, 1, "ABC123");
    }
    //TERMINA - BRID:481


    //INICIA - BRID:1872 - Regla para actualizar Tripulacion o tecnicos desde usuarios al editar. - Autor: Administrador - Actualización: 3/22/2021 2:52:01 PM
    if (this.operation == 'Update') {
      this.brf.EvaluaQueryAsync(`EXEC Actualizar_Datos_Desde_Creacion_Usuarios ${lblClave}, ${Cargo_desempenado}`, 1, "ABC123");
    }
    //TERMINA - BRID:1872

    //rulesAfterSave_ExecuteBusinessRulesEnd

    await this.goToList();

  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    if(this.isEmpresaOpen) {
      alert("Has dejado un renglón sin guardar en Empresas");
      result = false;
    }


    let Usuario = this.Creacion_de_UsuariosForm.controls['Usuario'].value
    let Clave = this.Creacion_de_UsuariosForm.controls['Clave'].value


    //INICIA - BRID:1422 - Regla para validar que no se repita el usuario al nuevo - Autor: Administrador - Actualización: 3/9/2021 2:52:38 PM
    if (this.operation == 'New') {
      if (this.brf.EvaluaQuery(`SELECT COUNT(*) FROM Creacion_de_Usuarios WHERE Usuario = ${Usuario}`, 1, 'ABC123') > this.brf.TryParseInt('0', '0')) {
        this.brf.ShowMessage("Existe un registro con el mismo usuario, favor de verificar.");

        result = false;
      }
    }
    //TERMINA - BRID:1422


    //INICIA - BRID:1423 - Regla para validar que no se repita el usuario al editar - Autor: Administrador - Actualización: 3/9/2021 2:52:37 PM
    if (this.operation == 'Update') {
      if (this.brf.EvaluaQuery(`SELECT COUNT(*) FROM Creacion_de_Usuarios WHERE Usuario = ${Usuario} AND Clave <> ${Clave}`, 1, 'ABC123') > this.brf.TryParseInt('0', '0')) {
        this.brf.ShowMessage("Existe un registro con el mismo usuario, favor de verificar.");

        result = false;
      }
    }
    //TERMINA - BRID:1423

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    return result;
  }

  //Fin de reglas

  getNombre_completo() {
    let Nombres = this.Creacion_de_UsuariosForm.controls['Nombres'].value
    let Apellido_paterno = this.Creacion_de_UsuariosForm.controls['Apellido_paterno'].value
    let Apellido_materno = this.Creacion_de_UsuariosForm.controls['Apellido_materno'].value

    this.Creacion_de_UsuariosForm.controls['Nombre_completo'].setValue(`${Nombres} ${Apellido_paterno} ${Apellido_materno}`)

  }

}
