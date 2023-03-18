import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { NgxSpinnerService } from 'ngx-spinner';
import { forkJoin, Observable, Subject, of } from 'rxjs';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTabGroup } from '@angular/material/tabs';
import { TranslateService } from '@ngx-translate/core';
import * as ClassicEditor from '@ckeditor/ckeditor5-build-classic';
import { Router, ActivatedRoute } from '@angular/router';
import { GeneralService } from 'src/app/api-services/general.service';
import { Autorizacion_de_Prefactura_AerovicsService } from 'src/app/api-services/Autorizacion_de_Prefactura_Aerovics.service';
import { Autorizacion_de_Prefactura_Aerovics } from 'src/app/models/Autorizacion_de_Prefactura_Aerovics';
import { Solicitud_de_VueloService } from 'src/app/api-services/Solicitud_de_Vuelo.service';
import { Solicitud_de_Vuelo } from 'src/app/models/Solicitud_de_Vuelo';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { Estatus_autorizacion_de_prefacturaService } from 'src/app/api-services/Estatus_autorizacion_de_prefactura.service';
import { Estatus_autorizacion_de_prefactura } from 'src/app/models/Estatus_autorizacion_de_prefactura';

import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { SpartanService } from 'src/app/api-services/spartan.service';

@Component({
  selector: 'app-Autorizacion_de_Prefactura_Aerovics',
  templateUrl: './Autorizacion_de_Prefactura_Aerovics.component.html',
  styleUrls: ['./Autorizacion_de_Prefactura_Aerovics.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Autorizacion_de_Prefactura_AerovicsComponent implements OnInit, AfterViewInit {

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Autorizacion_de_Prefactura_AerovicsForm: FormGroup;
  public Editor = ClassicEditor;
  model: Autorizacion_de_Prefactura_Aerovics;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varSolicitud_de_Vuelo: Solicitud_de_Vuelo[] = [];
  public varSpartan_User: Spartan_User[] = [];
  public varCliente: Cliente[] = [];
  public varEstatus_autorizacion_de_prefactura: Estatus_autorizacion_de_prefactura[] = [];

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
  PhaseSelect: number = 0;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Autorizacion_de_Prefactura_AerovicsService: Autorizacion_de_Prefactura_AerovicsService,
    private Solicitud_de_VueloService: Solicitud_de_VueloService,
    private Spartan_UserService: Spartan_UserService,
    private ClienteService: ClienteService,
    private Estatus_autorizacion_de_prefacturaService: Estatus_autorizacion_de_prefacturaService,

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
    renderer: Renderer2) {
    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);
    this.model = new Autorizacion_de_Prefactura_Aerovics(this.fb);
    this.Autorizacion_de_Prefactura_AerovicsForm = this.model.buildFormGroup();

    this.Autorizacion_de_Prefactura_AerovicsForm.get('Folio').disable();
    this.Autorizacion_de_Prefactura_AerovicsForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.PhaseSelect = +this.localStorageHelper.getItemFromLocalStorage("QueryParam");
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Autorizacion_de_Prefactura_AerovicsForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Autorizacion_de_Prefactura_Aerovics)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Autorizacion_de_Prefactura_AerovicsService.listaSelAll(0, 1, 'Autorizacion_de_Prefactura_Aerovics.Folio=' + id).toPromise();
    if (result.Autorizacion_de_Prefactura_Aerovicss.length > 0) {

      this.model.fromObject(result.Autorizacion_de_Prefactura_Aerovicss[0]);

      this.Autorizacion_de_Prefactura_AerovicsForm.markAllAsTouched();
      this.Autorizacion_de_Prefactura_AerovicsForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Autorizacion_de_Prefactura_AerovicsForm.disabled ? "Update" : this.operation;
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

  onTabChanged(event) {
    if (event.tab.ariaLabel == 'Autorizacion_director_general') {
      if (this.operation == 'Update' || this.operation == 'Consult') {
        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('10', '10')) {
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_dg', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_dg', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_dg', 0);
        }
        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44')) {
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_dg', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_dg', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_dg', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Resultado_de_autorizacion_dg', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Observaciones_dg', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Motivo_de_rechazo_dg', 0);
        }
      }
      if (this.operation == 'Update') {
        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('10', '10')) {
          this.brf.SetCurrentDateToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dg");
          this.brf.SetCurrentHourToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dg");
          this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dg", this.localStorageHelper.getItemFromLocalStorage('USERID'));
        }
        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44')) {
          this.brf.SetCurrentDateToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dc");
          this.brf.SetCurrentHourToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dc");
          this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dc", this.localStorageHelper.getItemFromLocalStorage('USERID'));
        }
      }

    }
    if (event.tab.ariaLabel == 'Autorizacion_director_corporativo') {
      if (this.operation == 'Update' || this.operation == 'Consult') {
        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44')) {
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_dc', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_dc', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_dc', 0);
        }
      }
      if (this.operation == 'Update') {
        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44')) {
          this.brf.SetCurrentDateToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dc");
          this.brf.SetCurrentHourToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dc");
          this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dc", this.localStorageHelper.getItemFromLocalStorage('USERID'));
        }
      }
    }
    if (event.tab.ariaLabel == 'Autorizacion_administrativo') {
      if (this.operation == 'Update' || this.operation == 'Consult') {
        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44')
          || this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('10', '10')) {
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_adm', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_adm', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_adm', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Resultado_de_autorizacion_adm', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Observaciones_adm', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Motivo_de_rechazo_adm', 0);
        }
      }
      if (this.operation == 'Update') {
        if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('22', '22')) {
          this.brf.SetCurrentDateToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_adm");
          this.brf.SetCurrentHourToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_adm");
          this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_adm", this.localStorageHelper.getItemFromLocalStorage('USERID'));
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_adm', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_adm', 0);
          this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_adm', 0);
        }
      }
    }

  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Solicitud_de_VueloService.getAll());
    observablesArray.push(this.Spartan_UserService.getAll());
    observablesArray.push(this.ClienteService.getAll());
    observablesArray.push(this.Estatus_autorizacion_de_prefacturaService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varSolicitud_de_Vuelo, varSpartan_User, varCliente, varEstatus_autorizacion_de_prefactura]) => {
          this.varSolicitud_de_Vuelo = varSolicitud_de_Vuelo;
          this.varSpartan_User = varSpartan_User;
          this.varCliente = varCliente;
          this.varEstatus_autorizacion_de_prefactura = varEstatus_autorizacion_de_prefactura;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }



  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Vuelo': {
        this.Solicitud_de_VueloService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSolicitud_de_Vuelo = x.Solicitud_de_Vuelos;
        });
        break;
      }
      case 'Pax_Solicitante': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Empresa_Solicitante': {
        this.ClienteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varCliente = x.Clientes;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_autorizacion_de_prefacturaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_autorizacion_de_prefactura = x.Estatus_autorizacion_de_prefacturas;
        });
        break;
      }
      case 'Usuario_que_autoriza_adm': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Resultado_de_autorizacion_adm': {
        this.Estatus_autorizacion_de_prefacturaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_autorizacion_de_prefactura = x.Estatus_autorizacion_de_prefacturas;
        });
        break;
      }
      case 'Usuario_que_autoriza_dg': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Resultado_de_autorizacion_dg': {
        this.Estatus_autorizacion_de_prefacturaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_autorizacion_de_prefactura = x.Estatus_autorizacion_de_prefacturas;
        });
        break;
      }
      case 'Usuario_que_autoriza_dc': {
        this.Spartan_UserService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varSpartan_User = x.Spartan_Users;
        });
        break;
      }
      case 'Resultado_de_autorizacion_dc': {
        this.Estatus_autorizacion_de_prefacturaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_autorizacion_de_prefactura = x.Estatus_autorizacion_de_prefacturas;
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
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Autorizacion_de_Prefactura_AerovicsForm.value;
      entity.Folio = this.model.Folio;


      if (this.model.Folio > 0) {

        entity.No_prefactura = this.model.No_prefactura;
        entity.Vuelo = this.model.Vuelo;
        entity.Pax_Solicitante = this.model.Pax_Solicitante;
        entity.Empresa_Solicitante = this.model.Empresa_Solicitante;
        entity.Fecha_de_Salida = this.model.Fecha_de_Salida;
        entity.Fecha_de_Regreso = this.model.Fecha_de_Regreso;
        entity.Monto_de_Factura = this.model.Monto_de_Factura;
        entity.Estatus = this.Autorizacion_de_Prefactura_AerovicsForm.get('Estatus').value;
        entity.IsDeleted = this.model.IsDeleted;

        if (this.operation == 'Update') {
          if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('22', '22')) {
            entity.Fecha_de_autorizacion_adm = this.Autorizacion_de_Prefactura_AerovicsForm.get('Fecha_de_autorizacion_adm').value;
            entity.Hora_de_autorizacion_adm = this.Autorizacion_de_Prefactura_AerovicsForm.get('Hora_de_autorizacion_adm').value;
            entity.Usuario_que_autoriza_adm = this.Autorizacion_de_Prefactura_AerovicsForm.get('Usuario_que_autoriza_adm').value;
          }
          if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('10', '10')) {
            entity.Fecha_de_autorizacion_adm = this.model.Fecha_de_autorizacion_adm;
            entity.Hora_de_autorizacion_adm = this.model.Hora_de_autorizacion_adm;
            entity.Usuario_que_autoriza_adm = this.model.Usuario_que_autoriza_adm;
            entity.Resultado_de_autorizacion_adm = this.model.Resultado_de_autorizacion_adm;
            entity.Motivo_de_rechazo_adm = this.model.Motivo_de_rechazo_adm;
            entity.Observaciones_adm = this.model.Observaciones_adm;
            entity.Fecha_de_autorizacion_dg = this.Autorizacion_de_Prefactura_AerovicsForm.get('Fecha_de_autorizacion_dg').value;
            entity.Hora_de_autorizacion_dg = this.Autorizacion_de_Prefactura_AerovicsForm.get('Hora_de_autorizacion_dg').value;
            entity.Usuario_que_autoriza_dg = this.Autorizacion_de_Prefactura_AerovicsForm.get('Usuario_que_autoriza_dg').value;
          }
          if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44')) {
            entity.Fecha_de_autorizacion_adm = this.model.Fecha_de_autorizacion_adm;
            entity.Hora_de_autorizacion_adm = this.model.Hora_de_autorizacion_adm;
            entity.Usuario_que_autoriza_adm = this.model.Usuario_que_autoriza_adm;
            entity.Resultado_de_autorizacion_adm = this.model.Resultado_de_autorizacion_adm;
            entity.Motivo_de_rechazo_adm = this.model.Motivo_de_rechazo_adm;
            entity.Observaciones_adm = this.model.Observaciones_adm;

            entity.Fecha_de_autorizacion_dg = this.model.Fecha_de_autorizacion_dg;
            entity.Hora_de_autorizacion_dg = this.model.Hora_de_autorizacion_dg;
            entity.Usuario_que_autoriza_dg = this.model.Usuario_que_autoriza_dg;
            entity.Resultado_de_autorizacion_dg = this.model.Resultado_de_autorizacion_dg;
            entity.Motivo_de_rechazo_dg = this.model.Motivo_de_rechazo_dg;
            entity.Observaciones_dg = this.model.Observaciones_dg;

            entity.Fecha_de_autorizacion_dc = this.Autorizacion_de_Prefactura_AerovicsForm.get('Fecha_de_autorizacion_dc').value;
            entity.Hora_de_autorizacion_dc = this.Autorizacion_de_Prefactura_AerovicsForm.get('Hora_de_autorizacion_dc').value;
            entity.Usuario_que_autoriza_dc = this.Autorizacion_de_Prefactura_AerovicsForm.get('Usuario_que_autoriza_dc').value;
          }
        }

        await this.Autorizacion_de_Prefactura_AerovicsService.update(this.model.Folio, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
      } else {
        await (this.Autorizacion_de_Prefactura_AerovicsService.insert(entity).toPromise().then(async id => {

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
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
    if (this.model.Folio === 0) {
      this.Autorizacion_de_Prefactura_AerovicsForm.reset();
      this.model = new Autorizacion_de_Prefactura_Aerovics(this.fb);
      this.Autorizacion_de_Prefactura_AerovicsForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Autorizacion_de_Prefactura_Aerovics/add']);
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
    this.router.navigate(['/Autorizacion_de_Prefactura_Aerovics/list/' + this.PhaseSelect], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  No_prefactura_ExecuteBusinessRules(): void {
    //No_prefactura_FieldExecuteBusinessRulesEnd
  }
  Vuelo_ExecuteBusinessRules(): void {
    //Vuelo_FieldExecuteBusinessRulesEnd
  }
  Pax_Solicitante_ExecuteBusinessRules(): void {
    //Pax_Solicitante_FieldExecuteBusinessRulesEnd
  }
  Empresa_Solicitante_ExecuteBusinessRules(): void {
    //Empresa_Solicitante_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Salida_ExecuteBusinessRules(): void {
    //Fecha_de_Salida_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Regreso_ExecuteBusinessRules(): void {
    //Fecha_de_Regreso_FieldExecuteBusinessRulesEnd
  }
  Monto_de_Factura_ExecuteBusinessRules(): void {
    //Monto_de_Factura_FieldExecuteBusinessRulesEnd
  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  Motivo_de_rechazo_general_ExecuteBusinessRules(): void {
    //Motivo_de_rechazo_general_FieldExecuteBusinessRulesEnd
  }
  Observaciones_ExecuteBusinessRules(): void {
    //Observaciones_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_autorizacion_adm_ExecuteBusinessRules(): void {
    //Fecha_de_autorizacion_adm_FieldExecuteBusinessRulesEnd
  }
  Hora_de_autorizacion_adm_ExecuteBusinessRules(): void {
    //Hora_de_autorizacion_adm_FieldExecuteBusinessRulesEnd
  }
  Usuario_que_autoriza_adm_ExecuteBusinessRules(): void {


    //Usuario_que_autoriza_adm_FieldExecuteBusinessRulesEnd
  }
  Resultado_de_autorizacion_adm_ExecuteBusinessRules(): void {

    //INICIA - BRID:5358 - Mostrar u ocultar "Motivo de rechazo" gerente administrativo Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 3:27:47 AM
    if (this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_adm').value == 1) {
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_adm");
      this.brf.HideFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_adm");
    }
    else {
      this.brf.SetRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_adm");
      this.brf.ShowFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_adm");
    }
    //TERMINA - BRID:5358

    //Resultado_de_autorizacion_adm_FieldExecuteBusinessRulesEnd

  }
  Motivo_de_rechazo_adm_ExecuteBusinessRules(): void {
    //Motivo_de_rechazo_adm_FieldExecuteBusinessRulesEnd
  }
  Observaciones_adm_ExecuteBusinessRules(): void {
    //Observaciones_adm_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_autorizacion_dg_ExecuteBusinessRules(): void {
    //Fecha_de_autorizacion_dg_FieldExecuteBusinessRulesEnd
  }
  Hora_de_autorizacion_dg_ExecuteBusinessRules(): void {
    //Hora_de_autorizacion_dg_FieldExecuteBusinessRulesEnd
  }
  Usuario_que_autoriza_dg_ExecuteBusinessRules(): void {
    //Usuario_que_autoriza_dg_FieldExecuteBusinessRulesEnd
  }
  Resultado_de_autorizacion_dg_ExecuteBusinessRules(): void {

    //INICIA - BRID:4904 - Mostrar u ocultar "Motivo de rechazo" dirección general Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/6/2021 7:00:06 PM
    if (this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dg').value == 1) {
      this.brf.HideFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
    }
    else {
      this.brf.ShowFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
      this.brf.SetRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
    }
    //TERMINA - BRID:4904

    //Resultado_de_autorizacion_dg_FieldExecuteBusinessRulesEnd

  }
  Motivo_de_rechazo_dg_ExecuteBusinessRules(): void {
    //Motivo_de_rechazo_dg_FieldExecuteBusinessRulesEnd
  }
  Observaciones_dg_ExecuteBusinessRules(): void {
    //Observaciones_dg_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_autorizacion_dc_ExecuteBusinessRules(): void {
    //Fecha_de_autorizacion_dc_FieldExecuteBusinessRulesEnd
  }
  Hora_de_autorizacion_dc_ExecuteBusinessRules(): void {
    //Hora_de_autorizacion_dc_FieldExecuteBusinessRulesEnd
  }
  Usuario_que_autoriza_dc_ExecuteBusinessRules(): void {
    //Usuario_que_autoriza_dc_FieldExecuteBusinessRulesEnd
  }
  Resultado_de_autorizacion_dc_ExecuteBusinessRules(): void {

    //INICIA - BRID:4906 - Mostrar u ocultar "Motivo de rechazo" dirección corporativo Autorizacion_de_Prefactura_Aerovics - Autor: Jose Caballero - Actualización: 8/21/2021 2:42:22 PM
    if (this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dc').value == 1) {
      this.brf.HideFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
    } else {
      this.brf.ShowFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
      this.brf.SetRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
    }
    //TERMINA - BRID:4906

    //Resultado_de_autorizacion_dc_FieldExecuteBusinessRulesEnd

  }
  Motivo_de_rechazo_dc_ExecuteBusinessRules(): void {
    //Motivo_de_rechazo_dc_FieldExecuteBusinessRulesEnd
  }
  Observaciones_dc_ExecuteBusinessRules(): void {
    //Observaciones_dc_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:4204 - Ocultar Folio "Autorizacion_de_Prefactura_Aerovics" - Autor: Administrador - Actualización: 7/21/2021 4:05:50 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Folio");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Folio");
    }
    //TERMINA - BRID:4204


    //INICIA - BRID:4207 - Acomodo de campos "Autorizacion_de_Prefactura_Aerovics" - Autor: Agustín Administrador - Actualización: 8/3/2021 2:25:15 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:4207


    //INICIA - BRID:4742 - Quitar requeridos Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/6/2021 10:11:07 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Vuelo");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Pax_Solicitante");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Empresa_Solicitante");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_Salida");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_Regreso");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Monto_de_Factura");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "No_prefactura");
    }
    //TERMINA - BRID:4742


    //INICIA - BRID:4743 - Deshabilitar el "Estatus" Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/23/2021 12:38:41 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Estatus', 0);
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'No_prefactura', 0);
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Vuelo', 0);
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Pax_Solicitante', 0);
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Empresa_Solicitante', 0);
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Salida', 0);
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Regreso', 0);
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Monto_de_Factura', 0);
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Observaciones', 0); this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Motivo_de_rechazo_general', 0);
      this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Motivo_de_rechazo_general', 0);
    }
    //TERMINA - BRID:4743


    //INICIA - BRID:4744 - Ocultar pestañas de autorización al nuevo Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/6/2021 6:40:42 PM
    if (this.operation == 'New') {
      this.brf.HideFolder("Autorizacion_director_corporativo");
      this.brf.HideFolder("Autorizacion_director_general");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_dg");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_dc");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
    }
    //TERMINA - BRID:4744


    //INICIA - BRID:4753 - Ocultar pestañas de autorización cuando es contador Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 4:02:38 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('24', '24')) {
        this.brf.HideFolder("Autorizacion_director_corporativo");
        this.brf.HideFolder("Autorizacion_director_general");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Vuelo', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Pax_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Empresa_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Regreso', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'No_prefactura', 0);
        this.brf.HideFolder("Autorizacion_administrativo");
      } else { }
    }
    //TERMINA - BRID:4753


    //INICIA - BRID:4754 - Ocultar pestañas de autorización cuando es administrador Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 4:06:55 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('1', '1')) {
        this.brf.HideFolder("Autorizacion_director_corporativo");
        this.brf.HideFolder("Autorizacion_director_general");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_adm");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
        this.brf.HideFolder("Autorizacion_administrativo");
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Vuelo', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Pax_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Empresa_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Regreso', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Monto_de_Factura', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Estatus', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'No_prefactura', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Motivo_de_rechazo_general', 0);
      } else { }
    }
    //TERMINA - BRID:4754


    //INICIA - BRID:4755 - Deshabilitar campos y pestaña cuando es director general Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 9/17/2021 4:41:19 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('10', '10')) {
        this.brf.HideFolder("Autorizacion_director_corporativo");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Vuelo', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Pax_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Empresa_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Regreso', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Monto_de_Factura', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Resultado_de_autorizacion_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Motivo_de_rechazo_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_dg', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_dg', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_dg', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'No_prefactura', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Observaciones_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Observaciones_dc', 0);
      } else { }
    }
    //TERMINA - BRID:4755


    //INICIA - BRID:4781 - Deshabilitar campos cuando es director corporativo Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 9/17/2021 4:41:17 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44')) {
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Vuelo', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Pax_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Empresa_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Regreso', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Monto_de_Factura', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Resultado_de_autorizacion_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_dg', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_dg', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_dg', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Resultado_de_autorizacion_dg', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_dc', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_dc', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_dc', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'No_prefactura', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Observaciones_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Observaciones_dg', 0);
      } else { }
    }
    //TERMINA - BRID:4781

    //INICIA - BRID:4784 - Filtrar resultado de autorización DG Y DC - Autor: Agustín Administrador - Actualización: 8/25/2021 3:03:10 AM
    if (this.operation == 'Update') {

    }
    //TERMINA - BRID:4784


    //INICIA - BRID:4905 - Ocultar motivos de rechazos de los aprobadores Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 3:11:14 AM
    if (this.operation == 'Update') {
      this.brf.HideFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_adm");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_adm");
      this.brf.HideFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
      this.brf.HideFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
    }
    //TERMINA - BRID:4905


    //INICIA - BRID:5259 - Ocultar "Motivo de rechazo general" - Autor: Agustín Administrador - Actualización: 8/25/2021 12:43:37 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_general");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_general");
    }
    //TERMINA - BRID:5259


    //INICIA - BRID:5354 - Deshabilitar campos y pestañas cuando es gerente administrativo Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 2:16:50 AM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('22', '22')) {
        this.brf.HideFolder("Autorizacion_director_general");
        this.brf.HideFolder("Autorizacion_director_corporativo");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dg");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Resultado_de_autorizacion_dc");
        this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_dc");
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Vuelo', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Pax_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Empresa_Solicitante', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Salida', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_Regreso', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Monto_de_Factura', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Fecha_de_autorizacion_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Hora_de_autorizacion_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'Usuario_que_autoriza_adm', 0);
        this.brf.SetEnabledControl(this.Autorizacion_de_Prefactura_AerovicsForm, 'No_prefactura', 0);
      } else { }
    }
    //TERMINA - BRID:5354

    //INICIA - BRID:5355 - Campos automaticos fecha, hora y usuario cuando es gerente administrativo al editar Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 2:43:33 AM
    if (this.operation == 'Update') {
      if (+this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == 22) {
        this.brf.SetCurrentDateToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_adm");
        this.brf.SetCurrentHourToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_adm")
        this.Autorizacion_de_Prefactura_AerovicsForm.controls['Usuario_que_autoriza_adm'].setValue(1);
        //this.brf.SetValueFromQuery(this.Autorizacion_de_Prefactura_AerovicsForm,"Fecha_de_autorizacion_adm",this.brf.EvaluaQuery("SELECT CONVERT(varchar(11),getdate(),105)", 1, "ABC123"),1,"ABC123"); 
        //this.brf.SetValueFromQuery(this.Autorizacion_de_Prefactura_AerovicsForm,"Hora_de_autorizacion_adm",this.brf.EvaluaQuery("SELECT CONVERT(varchar(8),getdate(),108)", 1, "ABC123"),1,"ABC123"); 

      } else { }
    }
    //TERMINA - BRID:5355


    //INICIA - BRID:5356 - Campos automaticos fecha, hora y usuario cuando es director general al editar Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 2:29:44 AM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('10', '10')) {
        this.brf.SetCurrentDateToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dg");
        this.brf.SetCurrentHourToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dg");
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dg", this.localStorageHelper.getItemFromLocalStorage('USERID'));
      } else { }
    }
    //TERMINA - BRID:5356


    //INICIA - BRID:5357 - Campos automaticos fecha, hora y usuario cuando es director corporativo al editar Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 3:15:49 AM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44')) {
        this.brf.SetCurrentDateToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Fecha_de_autorizacion_dc");
        this.brf.SetCurrentHourToField(this.Autorizacion_de_Prefactura_AerovicsForm, "Hora_de_autorizacion_dc");
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Usuario_que_autoriza_dc", this.localStorageHelper.getItemFromLocalStorage('USERID'));
      } else { }
    }
    //TERMINA - BRID:5357


    //INICIA - BRID:6307 - ocultar campo observaciones y asignar no requerido siempre - Autor: Lizeth Villa - Actualización: 9/17/2021 4:19:02 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.Autorizacion_de_Prefactura_AerovicsForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Observaciones");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Observaciones_adm");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Observaciones_dg");
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Observaciones_dc");
    }
    //TERMINA - BRID:6307


    //INICIA - BRID:6540 - WF:12 Rule - Phase: 1 (Prefacturas Autorizadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '1'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:6540


    //INICIA - BRID:6542 - WF:12 Rule - Phase: 2 (Prefacturas Generadas) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '2'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:6542


    //INICIA - BRID:6544 - WF:12 Rule - Phase: 3 (Prefacturas por Autorizar) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '3'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:6544


    //INICIA - BRID:6546 - WF:12 Rule - Phase: 4 (Prefacturas Autorizadas Director Corporativo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '4'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:6546


    //INICIA - BRID:6548 - WF:12 Rule - Phase: 5 (Prefacturas Autorizadas Director General) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '5'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:6548


    //INICIA - BRID:6550 - WF:12 Rule - Phase: 6 (Prefacturas por Autorizar Director General) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '6'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:6550


    //INICIA - BRID:6552 - WF:12 Rule - Phase: 7 (Prefacturas por Autorizar Director Corporativo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '7'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:6552


    //INICIA - BRID:6554 - WF:12 Rule - Phase: 8 (Prefacturas Autorizadas Administrativo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '8'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:6554


    //INICIA - BRID:6556 - WF:12 Rule - Phase: 9 (Prefacturas por Autorizar Administrativo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '9'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:6556


    //INICIA - BRID:7250 - Observaciones no requerido en prefactura - Autor: Administrador - Actualización: 12/20/2022 2:45:35 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Observaciones_adm");
    }
    //TERMINA - BRID:7250

    //rulesOnInit_ExecuteBusinessRulesEnd


























  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:5564 - Actualiza presupuesto al rechazar factura - Autor: Aaron - Actualización: 8/30/2021 8:18:39 PM
    if (this.operation == 'Update') {
      if (this.Autorizacion_de_Prefactura_AerovicsForm.get('Estatus').value == this.brf.TryParseInt('5', '5')
        || this.Autorizacion_de_Prefactura_AerovicsForm.get('Estatus').value == this.brf.TryParseInt('6', '6')
        || this.Autorizacion_de_Prefactura_AerovicsForm.get('Estatus').value == this.brf.TryParseInt('8', '8')) {
        this.brf.EvaluaQuery(`EXEC usp_UpdtMontosAnuales_Rechazo ${this.Autorizacion_de_Prefactura_AerovicsForm.get('No_prefactura').value}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:5564


    //INICIA - BRID:5605 - RN para envio de notificacion push cuando aprueba Administrativo - Autor: Aaron - Actualización: 9/2/2021 10:36:14 AM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Autorizacion_de_Prefactura_AerovicsForm, 'Estatus')==this.brf.TryParseInt('3', '3') ) { this.brf.SendNotificationPush(this.brf.EvaluaQuery("Select 'Prefactura Aprobada por Administrativo'", ""ABC123""), this.brf.EvaluaQuery("select STUFF(( select ',' + CONVERT(VARCHAR(20), id_user)  + '' from Spartan_User  where ROLE = 10 for XML PATH('') ), 1, 1, '')", 1, "ABC123") ,this.brf.EvaluaQuery("select '{\"id\":\"FLDD[lblFolio]\"}'", 1, "ABC123"), this.brf.EvaluaQuery("Select  'Hay una prefactura pendiente por aprobar. '", 1, "ABC123"),"");} else {}
    }
    //TERMINA - BRID:5605

    //rulesAfterSave_ExecuteBusinessRulesEnd


  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:5009 - Enviar correo desde director corporativo cuando autoriza - Autor: Jose Caballero - Actualización: 9/3/2021 3:35:02 PM
    if (this.operation == 'Update') {
      // if( this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44') && 
      //   this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dc').value == 1) { 
      //     this.brf.SendEmailQuery("VICS - Prefactura autorizada por director corporativo", 
      //       this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (24)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User = GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='IE=edge'><title>EmailTemplate-Fluid</title><style type='text/css'> html, body {margin: 20px 0 0 0 !important;padding: 0 !important;width: 100% i !important;background-color: #E0E0E0 !important;}  * {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}  .ExternalClass {width: 100%;}  div[style*='margin: 16px 0'] {margin: 0 !important;}  table, td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}  table {border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;}  table table table {table-layout: auto;}  img {-ms-interpolation-mode: bicubic;}  .yshortcuts a {border-bottom: none !important;}  a[x-apple-data-detectors] {color: inherit !important;}  /* Estilos Hover para botones */  .button-td, .button-a {transition: all 100ms ease-in;}  .button-td:hover, .button-a:hover {color: #000;} </style></head><body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'><table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#E0E0E0' style='border-collapse:collapse;'><tr><td><center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --><div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>Aerovics</div> <!-- Visually Hidden Preheader Text : END --><div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'><tr><td width='40'>&nbsp;</td><td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr><td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table> <!-- Email Header : END --> <!-- Email Body : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --><tr><td><table cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Estimado (a) GLOBAL[nombre_usuario]</p><p>Se le informa que ha sido autorizada la pre factura correspondiente al vuelo FLD[Vuelo].</p> <br></td></tr></table></td></tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --><!-- Email Footer : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'><tr><td width='40'>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'></td><td width='5'>&nbsp;</td><td><p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'>Atentamente.</p></td><td width='40'>&nbsp;</td></tr><tr><td>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'><img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/></td><td width='5'>&nbsp;</td><td><p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'>Aerovics, S.A. de C.V.</p></td><td width='40'>&nbsp;</td></tr></table><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'><tr><td style='padding-top: 40px;'></td></tr><tr><td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>&nbsp;</td></tr></table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--></div></center></td></tr></table></body></html>");
      //     } else {}
    }
    //TERMINA - BRID:5009


    //INICIA - BRID:5011 - Enviar correo desde director corporativo cuando rechaza - Autor: Jose Caballero - Actualización: 9/3/2021 3:34:56 PM
    if (this.operation == 'Update') {
      // if( this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44') && 
      // this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dc').value == 2) { 
      //   this.brf.SendEmailQuery("VICS - Prefactura rechazada por director corporativo", 
      //     this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (24,10)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User = GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='IE=edge'><title>EmailTemplate-Fluid</title><style type='text/css'> html, body {margin: 20px 0 0 0 !important;padding: 0 !important;width: 100% i !important;background-color: #E0E0E0 !important;}  * {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}  .ExternalClass {width: 100%;}  div[style*='margin: 16px 0'] {margin: 0 !important;}  table, td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}  table {border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;}  table table table {table-layout: auto;}  img {-ms-interpolation-mode: bicubic;}  .yshortcuts a {border-bottom: none !important;}  a[x-apple-data-detectors] {color: inherit !important;}  /* Estilos Hover para botones */  .button-td, .button-a {transition: all 100ms ease-in;}  .button-td:hover, .button-a:hover {color: #000;} </style></head><body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'><table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#E0E0E0' style='border-collapse:collapse;'><tr><td><center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --><div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>Aerovics</div> <!-- Visually Hidden Preheader Text : END --><div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'><tr><td width='40'>&nbsp;</td><td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr><td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table> <!-- Email Header : END --> <!-- Email Body : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --><tr><td><table cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Estimado (a) GLOBAL[nombre_usuario]</p><p>Se le informa que no ha sido autorizada la pre factura correspondiente al vuelo FLD[Vuelo].</p> <br></td></tr></table></td></tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --><!-- Email Footer : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'><tr><td width='40'>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'></td><td width='5'>&nbsp;</td><td><p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'>Atentamente.</p></td><td width='40'>&nbsp;</td></tr><tr><td>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'><img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/></td><td width='5'>&nbsp;</td><td><p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'>Aerovics, S.A. de C.V.</p></td><td width='40'>&nbsp;</td></tr></table><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'><tr><td style='padding-top: 40px;'></td></tr><tr><td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>&nbsp;</td></tr></table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--></div></center></td></tr></table></body></html>");
      //   } else {}
    }
    //TERMINA - BRID:5011


    //INICIA - BRID:5014 - Enviar correo desde director general cuando aceptar - Autor: Jose Caballero - Actualización: 9/3/2021 3:35:00 PM
    if (this.operation == 'Update') {
      //if( +this.localStorageHelper.getItemFromLocalStorage('USERROLEID')==10 && +this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dg').value == 1 ) { this.brf.SendEmailQuery("VICS - Prefactura aprobada por director general", this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (44)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User = GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='IE=edge'><title>EmailTemplate-Fluid</title><style type='text/css'> html, body {margin: 20px 0 0 0 !important;padding: 0 !important;width: 100% i !important;background-color: #E0E0E0 !important;}  * {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}  .ExternalClass {width: 100%;}  div[style*='margin: 16px 0'] {margin: 0 !important;}  table, td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}  table {border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;}  table table table {table-layout: auto;}  img {-ms-interpolation-mode: bicubic;}  .yshortcuts a {border-bottom: none !important;}  a[x-apple-data-detectors] {color: inherit !important;}  /* Estilos Hover para botones */  .button-td, .button-a {transition: all 100ms ease-in;}  .button-td:hover, .button-a:hover {color: #000;} </style></head><body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'><table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#E0E0E0' style='border-collapse:collapse;'><tr><td><center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --><div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>Aerovics</div> <!-- Visually Hidden Preheader Text : END --><div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'><tr><td width='40'>&nbsp;</td><td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr><td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table> <!-- Email Header : END --> <!-- Email Body : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --><tr><td><table cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Estimado (a) GLOBAL[nombre_usuario]</p><p>Se le informa que ha sido autorizada la pre factura correspondiente al vuelo FLD[Vuelo].</p> <br></td></tr></table></td></tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --><!-- Email Footer : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'><tr><td width='40'>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'></td><td width='5'>&nbsp;</td><td><p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'>Atentamente.</p></td><td width='40'>&nbsp;</td></tr><tr><td>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'><img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/></td><td width='5'>&nbsp;</td><td><p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'>Aerovics, S.A. de C.V.</p></td><td width='40'>&nbsp;</td></tr></table><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'><tr><td style='padding-top: 40px;'></td></tr><tr><td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>&nbsp;</td></tr></table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--></div></center></td></tr></table></body></html>");} else {}
    }
    //TERMINA - BRID:5014


    //INICIA - BRID:5015 - Enviar correo desde director general cuando rechazar1 - Autor: Jose Caballero - Actualización: 9/3/2021 3:34:58 PM
    if (this.operation == 'Update') {
      //if( +this.localStorageHelper.getItemFromLocalStorage('USERROLEID')==10 && +this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dg').value == 2 ) { this.brf.SendEmailQuery("VICS - Prefactura rechazada por director general", this.brf.EvaluaQuery("Select ((select STUFF((select ';' + Email + '' from (Select distinct(Email) from Spartan_User where Role in (1,24)) A for XML PATH('') ), 1, 1, '')) + (Select ';' + Email + '' from Spartan_User where Id_User = GLOBAL[USERID]))", 1, "ABC123"), "<!doctype html><html><head><meta charset='utf-8'><meta name='viewport' content='width=device-width, initial-scale=1.0'><meta http-equiv='X-UA-Compatible' content='IE=edge'><title>EmailTemplate-Fluid</title><style type='text/css'> html, body {margin: 20px 0 0 0 !important;padding: 0 !important;width: 100% i !important;background-color: #E0E0E0 !important;}  * {-ms-text-size-adjust: 100%;-webkit-text-size-adjust: 100%;}  .ExternalClass {width: 100%;}  div[style*='margin: 16px 0'] {margin: 0 !important;}  table, td {mso-table-lspace: 0pt !important;mso-table-rspace: 0pt !important;}  table {border-spacing: 0 !important;border-collapse: collapse !important;table-layout: fixed !important;margin: 0 auto !important;}  table table table {table-layout: auto;}  img {-ms-interpolation-mode: bicubic;}  .yshortcuts a {border-bottom: none !important;}  a[x-apple-data-detectors] {color: inherit !important;}  /* Estilos Hover para botones */  .button-td, .button-a {transition: all 100ms ease-in;}  .button-td:hover, .button-a:hover {color: #000;} </style></head><body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'><table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#E0E0E0' style='border-collapse:collapse;'><tr><td><center style='width: 100%;'> <!-- Visually Hidden Preheader Text : BEGIN --><div style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>Aerovics</div> <!-- Visually Hidden Preheader Text : END --><div style='max-width: 600px;'> <!--[if (gte mso 9)|(IE)]> <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px; border-top: 5px solid #1F1F1F'><tr><td width='40'>&nbsp;</td><td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto' style='padding: 26px 0 10px 0' alt='alt_text'></td><td>&nbsp;</td><td width='40'>&nbsp;</td></tr><tr><td width='40'>&nbsp;</td><td width='260' style='border-top: 2px solid #325396'>&nbsp;</td><td style='border-top: 2px solid #8FBFFE'>&nbsp;</td><td width='40'>&nbsp;</td></tr></table> <!-- Email Header : END --> <!-- Email Body : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'>  <!-- 1 Column Text : BEGIN --><tr><td><table cellspacing='0' cellpadding='0' border='0' width='100%'><tr><td style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'><p>Estimado (a) GLOBAL[nombre_usuario]</p><p>Se le informa que no ha sido autorizada la pre factura correspondiente al vuelo FLD[Vuelo].</p> <br></td></tr></table></td></tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --><!-- Email Footer : BEGIN --><table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF' style='max-width: 680px;'><tr><td width='40'>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'></td><td width='5'>&nbsp;</td><td><p style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'>Atentamente.</p></td><td width='40'>&nbsp;</td></tr><tr><td>&nbsp;</td><td width='40' valign='middle' style='text-align: right;'><img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/></td><td width='5'>&nbsp;</td><td><p style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'>Aerovics, S.A. de C.V.</p></td><td width='40'>&nbsp;</td></tr></table><table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#FFFFFF' width='100%' style='max-width: 600px;'><tr><td style='padding-top: 40px;'></td></tr><tr><td style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>&nbsp;</td></tr></table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--></div></center></td></tr></table></body></html>");} else {}
    }
    //TERMINA - BRID:5015


    //INICIA - BRID:5378 - Aprueba gerente administrativo Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 4:55:06 AM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('22', '22') &&
        this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_adm').value == 1) {
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Estatus", "3");
      }
    }
    //TERMINA - BRID:5378


    //INICIA - BRID:5379 - Rechaza gerente administrativo Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/26/2021 5:39:39 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('10', '10') &&
        this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_adm').value == 2) {
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Estatus", "8");
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_general", this.Autorizacion_de_Prefactura_AerovicsForm.get('Motivo_de_rechazo_adm').value);
        this.brf.EvaluaQuery(`UPDATE Facturacion_de_Vuelo SET Estatus = 3 WHERE Folio = ${this.Autorizacion_de_Prefactura_AerovicsForm.get('No_prefactura').value}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:5379


    //INICIA - BRID:5380 - Aprueba director general Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 5:09:50 AM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('10', '10') &&
        this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dg').value == 1) {
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Estatus", "4");
      }
    }
    //TERMINA - BRID:5380


    //INICIA - BRID:5381 - Rechaza director general Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/26/2021 5:38:57 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('10', '10') &&
        this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dg').value == 2) {
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Estatus", "5");
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_general", this.Autorizacion_de_Prefactura_AerovicsForm.get('Motivo_de_rechazo_dg').value);
        this.brf.EvaluaQuery(`UPDATE Facturacion_de_Vuelo SET Estatus = 3 WHERE Folio = ${this.Autorizacion_de_Prefactura_AerovicsForm.get('No_prefactura').value}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:5381


    //INICIA - BRID:5382 - Aprueba director corporativo Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 6:55:14 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44') &&
        this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dc').value == this.brf.TryParseInt('1', '1')) {
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Estatus", "1");
        this.brf.EvaluaQuery(`UPDATE Facturacion_de_Vuelo SET Estatus = 4 WHERE Folio = ${this.Autorizacion_de_Prefactura_AerovicsForm.get('No_prefactura').value}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:5382


    //INICIA - BRID:5383 - Rechaza director corporativo Autorizacion_de_Prefactura_Aerovics - Autor: Agustín Administrador - Actualización: 8/25/2021 6:36:44 PM
    if (this.operation == 'Update') {
      if (this.localStorageHelper.getItemFromLocalStorage('USERROLEID') == this.brf.TryParseInt('44', '44') &&
        this.Autorizacion_de_Prefactura_AerovicsForm.get('Resultado_de_autorizacion_dc').value == this.brf.TryParseInt('2', '2')) {
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Estatus", "6");
        this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Motivo_de_rechazo_general", this.Autorizacion_de_Prefactura_AerovicsForm.get('Motivo_de_rechazo_dc').value);
        this.brf.EvaluaQuery(`UPDATE Facturacion_de_Vuelo SET Estatus = 3 WHERE Folio = ${this.Autorizacion_de_Prefactura_AerovicsForm.get('No_prefactura').value}`, 1, "ABC123");
      }
    }
    //TERMINA - BRID:5383


    //INICIA - BRID:6308 - Concatenar campos observaciones - Autor: Lizeth Villa - Actualización: 9/17/2021 4:28:49 PM
    if (this.operation == 'Update') {

      this.brf.SetValueControl(this.Autorizacion_de_Prefactura_AerovicsForm, "Observaciones", `Administración: ${this.Autorizacion_de_Prefactura_AerovicsForm.get('Observaciones_adm').value} Dirección General: ${this.Autorizacion_de_Prefactura_AerovicsForm.get('Observaciones_dg').value} Dirección Corporativo: ${this.Autorizacion_de_Prefactura_AerovicsForm.get('Observaciones_dc').value}`);

    }
    //TERMINA - BRID:6308

    //rulesBeforeSave_ExecuteBusinessRulesEnd











    return result;
  }

  //Fin de reglas

}
