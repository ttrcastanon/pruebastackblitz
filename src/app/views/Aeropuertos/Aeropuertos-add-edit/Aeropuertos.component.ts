import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild, LOCALE_ID } from '@angular/core';
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
import { AeropuertosService } from 'src/app/api-services/Aeropuertos.service';
import { Aeropuertos } from 'src/app/models/Aeropuertos';
import { PaisService } from 'src/app/api-services/Pais.service';
import { Pais } from 'src/app/models/Pais';
import { EstadoService } from 'src/app/api-services/Estado.service';
import { Estado } from 'src/app/models/Estado';
import { CiudadService } from 'src/app/api-services/Ciudad.service';
import { Ciudad } from 'src/app/models/Ciudad';
import { Tipo_de_AeropuertoService } from 'src/app/api-services/Tipo_de_Aeropuerto.service';
import { Tipo_de_Aeropuerto } from 'src/app/models/Tipo_de_Aeropuerto';
import { Detalle_Pista_de_AeropuertoService } from 'src/app/api-services/Detalle_Pista_de_Aeropuerto.service';
import { Detalle_Pista_de_Aeropuerto } from 'src/app/models/Detalle_Pista_de_Aeropuerto';

import { Detalle_FBOService } from 'src/app/api-services/Detalle_FBO.service';
import { Detalle_FBO } from 'src/app/models/Detalle_FBO';

import { Detalle_HotelesService } from 'src/app/api-services/Detalle_Hoteles.service';
import { Detalle_Hoteles } from 'src/app/models/Detalle_Hoteles';

import { Detalle_ComisariatosService } from 'src/app/api-services/Detalle_Comisariatos.service';
import { Detalle_Comisariatos } from 'src/app/models/Detalle_Comisariatos';

import { Detalle_TransportesService } from 'src/app/api-services/Detalle_Transportes.service';
import { Detalle_Transportes } from 'src/app/models/Detalle_Transportes';


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

import { registerLocaleData } from '@angular/common';
import esMX from '@angular/common/locales/es-MX';

import { DateAdapter, MAT_DATE_FORMATS } from "@angular/material/core";
import { AppDateAdapter, APP_DATE_FORMATS } from "src/app/helpers/AppDateAdapter";
import { number } from '@andufratu/ngx-custom-validators';

registerLocaleData(esMX);

@Component({
  selector: 'app-Aeropuertos',
  templateUrl: './Aeropuertos.component.html',
  styleUrls: ['./Aeropuertos.component.scss'],
  providers: [
    { provide: LOCALE_ID, useValue: 'es-MX' },
    { provide: DateAdapter, useClass: AppDateAdapter },
    { provide: MAT_DATE_FORMATS, useValue: APP_DATE_FORMATS }
  ],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AeropuertosComponent implements OnInit, AfterViewInit {
MRaddTransportes: boolean = false;
MRaddComisariatos: boolean = false;
MRaddHoteles: boolean = false;
MRaddFBO: boolean = false;
MRaddPistas_del_Aeropuerto: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  SavePistaButton: boolean = true;
  SaveFBOButton: boolean = true;
  SaveHotelesButton: boolean = true;
  SaveComisariatosButton: boolean = true;
  SaveTransportesButton: boolean = true;

  AeropuertosForm: FormGroup;
  public Editor = ClassicEditor;
  model: Aeropuertos;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsPais: Observable<Pais[]>;
  hasOptionsPais: boolean;
  isLoadingPais: boolean;
  optionsEstado: Observable<Estado[]>;
  hasOptionsEstado: boolean;
  isLoadingEstado: boolean;
  optionsCiudad: Observable<Ciudad[]>;
  hasOptionsCiudad: boolean;
  isLoadingCiudad: boolean;
  public varTipo_de_Aeropuerto: Tipo_de_Aeropuerto[] = [];
  optionsCiudad_mas_cercana: Observable<Ciudad[]>;
  hasOptionsCiudad_mas_cercana: boolean;
  isLoadingCiudad_mas_cercana: boolean;

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  dataSourcePistas_del_Aeropuerto = new MatTableDataSource<Detalle_Pista_de_Aeropuerto>();
  Pistas_del_AeropuertoColumns = [
    { def: 'actions', hide: false },
    { def: 'Pista_Id', hide: false },
    { def: 'Longitud', hide: false },
    { def: 'Ancho', hide: false },
    { def: 'Superficie', hide: false },
    { def: 'Iluminacion', hide: false },
    { def: 'Pavimento', hide: false },

  ];
  @ViewChild('paginatorPistas_del_Aeropuerto') paginatorPistas_del_Aeropuerto: MatPaginator;
  @ViewChild(MatSort) sortPistas_del_Aeropuerto: MatSort;
  Pistas_del_AeropuertoData: Detalle_Pista_de_Aeropuerto[] = [];

  dataSourceFBO = new MatTableDataSource<Detalle_FBO>();
  FBOColumns = [
    { def: 'actions', hide: false },
    { def: 'Nombre', hide: false },
    { def: 'Telefono_Local', hide: false },
    { def: 'Telefono_Gratuito', hide: false },
    { def: 'Sitio_Web', hide: false },

  ];
  FBOData: Detalle_FBO[] = [];
  @ViewChild('paginatorFBO') paginatorFBO: MatPaginator;


  dataSourceHoteles = new MatTableDataSource<Detalle_Hoteles>();
  HotelesColumns = [
    { def: 'actions', hide: false },
    { def: 'Hotel', hide: false },
    { def: 'Telefono_Local', hide: false },
    { def: 'Sitio_Web', hide: false },
    { def: 'Distancia_del_Aeropuerto', hide: false },

  ];
  HotelesData: Detalle_Hoteles[] = [];
  @ViewChild('paginatorHoteles') paginatorHoteles: MatPaginator;


  dataSourceComisariatos = new MatTableDataSource<Detalle_Comisariatos>();
  ComisariatosColumns = [
    { def: 'actions', hide: false },
    { def: 'Comisariato', hide: false },
    { def: 'Telefono_Local', hide: false },
    { def: 'Telefono_Gratuito', hide: false },
    { def: 'Sitio_Web', hide: false },

  ];
  ComisariatosData: Detalle_Comisariatos[] = [];
  @ViewChild('paginatorComisariatos') paginatorComisariatos: MatPaginator;


  dataSourceTransportes = new MatTableDataSource<Detalle_Transportes>();
  TransportesColumns = [
    { def: 'actions', hide: false },
    { def: 'Transporte', hide: false },
    { def: 'Telefono_Local', hide: false },
    { def: 'Telefono_Gratuito', hide: false },
    { def: 'Sitio_Web', hide: false },

  ];
  TransportesData: Detalle_Transportes[] = [];
  @ViewChild('paginatorTransportes') paginatorTransportes: MatPaginator;

  today = new Date;
  consult: boolean = false;
  whereEstado: string = '';
  whereCiudad: string = '';
  tienePais: boolean = false;
  tieneEstado: boolean = false;
  topEstado: number = 0;
  topCiudad: number = 0;

  pistasEliminar: number[] = [];
  fboEliminar: number[] = [];
  hotelesEliminar: number[] = [];
  comisariatosEliminar: number[] = [];
  transportesEliminar: number[] = [];

  isPistasOpen: boolean = false;
  isFboOpen: boolean = false;
  isHotelesOpen: boolean = false;
  isComisariatosOpen: boolean = false;
  isTransportesOpen: boolean = false;

  PaisSeleccionado: any = null;
  CCSeleccionado: any = null;

  fechaMinima = new Date('1900-01-01');
  fechaMaxima = new Date('9999-01-01');

  isStateFromUpdate: boolean = false;
  isStateFromUpdate2: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private AeropuertosService: AeropuertosService,
    private PaisService: PaisService,
    private EstadoService: EstadoService,
    private CiudadService: CiudadService,
    private Tipo_de_AeropuertoService: Tipo_de_AeropuertoService,
    private Detalle_Pista_de_AeropuertoService: Detalle_Pista_de_AeropuertoService,
    private Detalle_FBOService: Detalle_FBOService,
    private Detalle_HotelesService: Detalle_HotelesService,
    private Detalle_ComisariatosService: Detalle_ComisariatosService,
    private Detalle_TransportesService: Detalle_TransportesService,
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
    this.model = new Aeropuertos(this.fb);
    this.AeropuertosForm = this.model.buildFormGroup();
    this.Pistas_del_AeropuertoItems.removeAt(0);
    this.FBOItems.removeAt(0);
    this.HotelesItems.removeAt(0);
    this.ComisariatosItems.removeAt(0);
    this.TransportesItems.removeAt(0);

    this.AeropuertosForm.get('Aeropuerto_ID').disable();
    this.AeropuertosForm.get('Aeropuerto_ID').setValue('Auto');
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

  soloNumeros(e) {
    const allowedKeys = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
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

  checkLength2(e, input, length) {
    const functionalKeys = ['Backspace', 'ArrowRight', 'ArrowLeft'];

    if (functionalKeys.indexOf(e.key) !== -1) {
      return;
    }

    const keyValue = +e.key;
    if (isNaN(keyValue)) {
      e.preventDefault();
      return;
    }

    const hasSelection = input.selectionStart !== input.selectionEnd && input.selectionStart !== null;
    let newValue;
    if (hasSelection) {
      newValue = this.replaceSelection(input, e.key)
    } else {
      newValue = input.value + keyValue.toString();
    }

    if (newValue.length > length) {
      e.preventDefault();
    }
  }

  replaceSelection(input, key) {
    const inputValue = input.value;
    const start = input.selectionStart;
    const end = input.selectionEnd || input.selectionStart;
    return inputValue.substring(0, start) + key + inputValue.substring(end + 1);
  }

  getCountPistas(): number {
    return this.dataSourcePistas_del_Aeropuerto.data.filter(d => !d.IsDeleted).length;
  }
  getCountFBO(): number {
    return this.dataSourceFBO.data.filter(d => !d.IsDeleted).length;
  }
  getCountHoteles(): number {
    return this.dataSourceHoteles.data.filter(d => !d.IsDeleted).length;
  }
  getCountComisariatos(): number {
    return this.dataSourceComisariatos.data.filter(d => !d.IsDeleted).length;
  }
  getCountTransportes(): number {
    return this.dataSourceTransportes.data.filter(d => !d.IsDeleted).length;
  }

  ngAfterViewInit(): void {
    this.dataSourcePistas_del_Aeropuerto.paginator = this.paginatorPistas_del_Aeropuerto;
    this.dataSourceFBO.paginator = this.paginatorFBO;
    this.dataSourceHoteles.paginator = this.paginatorHoteles;
    this.dataSourceComisariatos.paginator = this.paginatorComisariatos;
    this.dataSourceTransportes.paginator = this.paginatorTransportes;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Pistas_del_AeropuertoColumns.splice(0, 1);
          this.FBOColumns.splice(0, 1);
          this.HotelesColumns.splice(0, 1);
          this.ComisariatosColumns.splice(0, 1);
          this.TransportesColumns.splice(0, 1);

          this.AeropuertosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Aeropuertos)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.AeropuertosForm, 'Pais', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    //this.brf.updateValidatorsToControl(this.AeropuertosForm, 'Estado', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.AeropuertosForm, 'Ciudad', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.AeropuertosForm, 'Ciudad_mas_cercana', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    
    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.AeropuertosService.listaSelAll(0, 1, 'Aeropuertos.Aeropuerto_ID=' + id).toPromise();
    if (result.Aeropuertoss.length > 0) {

      this.isStateFromUpdate = true;
      this.isStateFromUpdate2 = true;

      await this.Detalle_Pista_de_AeropuertoService.listaSelAll(0, 1000, 'Aeropuertos.Aeropuerto_ID=' + id)
        .toPromise().then(fPistas_del_Aeropuerto => {
          console.log(fPistas_del_Aeropuerto)
          this.Pistas_del_AeropuertoData = fPistas_del_Aeropuerto.Detalle_Pista_de_Aeropuertos;
          this.loadPistas_del_Aeropuerto(fPistas_del_Aeropuerto.Detalle_Pista_de_Aeropuertos);
          this.dataSourcePistas_del_Aeropuerto = new MatTableDataSource(fPistas_del_Aeropuerto.Detalle_Pista_de_Aeropuertos);
          this.dataSourcePistas_del_Aeropuerto.paginator = this.paginatorPistas_del_Aeropuerto;
          this.dataSourcePistas_del_Aeropuerto.sort = this.sortPistas_del_Aeropuerto;
        });
  
      let fFBO = await this.Detalle_FBOService.listaSelAll(0, 1000, 'Aeropuertos.Aeropuerto_ID=' + id).toPromise();
      this.FBOData = fFBO.Detalle_FBOs;
      this.loadFBO(fFBO.Detalle_FBOs);
      this.dataSourceFBO = new MatTableDataSource(fFBO.Detalle_FBOs);
      this.dataSourceFBO.paginator = this.paginatorFBO;
      this.dataSourceFBO.sort = this.sort;

      let fHoteles = await this.Detalle_HotelesService.listaSelAll(0, 1000, 'Aeropuertos.Aeropuerto_ID=' + id).toPromise();
      this.HotelesData = fHoteles.Detalle_Hoteless;
      this.loadHoteles(fHoteles.Detalle_Hoteless);
      this.dataSourceHoteles = new MatTableDataSource(fHoteles.Detalle_Hoteless);
      this.dataSourceHoteles.paginator = this.paginatorHoteles;
      this.dataSourceHoteles.sort = this.sort;

      let fComisariatos = await this.Detalle_ComisariatosService.listaSelAll(0, 1000, 'Aeropuertos.Aeropuerto_ID=' + id).toPromise();
      this.ComisariatosData = fComisariatos.Detalle_Comisariatoss;
      this.loadComisariatos(fComisariatos.Detalle_Comisariatoss);
      this.dataSourceComisariatos = new MatTableDataSource(fComisariatos.Detalle_Comisariatoss);
      this.dataSourceComisariatos.paginator = this.paginatorComisariatos;
      this.dataSourceComisariatos.sort = this.sort;

      let fTransportes = await this.Detalle_TransportesService.listaSelAll(0, 1000, 'Aeropuertos.Aeropuerto_ID=' + id).toPromise();
      this.TransportesData = fTransportes.Detalle_Transportess;
      this.loadTransportes(fTransportes.Detalle_Transportess);
      this.dataSourceTransportes = new MatTableDataSource(fTransportes.Detalle_Transportess);
      this.dataSourceTransportes.paginator = this.paginatorTransportes;
      this.dataSourceTransportes.sort = this.sort;

      this.model.fromObject(result.Aeropuertoss[0]);
      console.log(result.Aeropuertoss[0]);
      this.AeropuertosForm.get('Pais').setValue(result.Aeropuertoss[0].Pais_Pais.Nombre, { onlySelf: false, emitEvent: true });
      // this.Pais_ExecuteBusinessRules();
      var Estado =
      {
          Clave: result.Aeropuertoss[0].Estado_Estado.Clave,
          Nombre: result.Aeropuertoss[0].Estado_Estado.Nombre,
      }
      this.AeropuertosForm.get('Estado').setValue(Estado, { onlySelf: false, emitEvent: true });
      // this.Estado_ExecuteBusinessRules();
      var Ciudad = 
      {
        Clave: result.Aeropuertoss[0].Ciudad_Ciudad.Clave,
        Nombre: result.Aeropuertoss[0].Ciudad_Ciudad.Nombre,
      }
      var CiudadCercana = 
      {
        Clave: result.Aeropuertoss[0].Ciudad_mas_cercana_Ciudad.Clave,
        Nombre: result.Aeropuertoss[0].Ciudad_mas_cercana_Ciudad.Nombre,
      }

      this.AeropuertosForm.get('Ciudad').setValue(Ciudad, { onlySelf: false, emitEvent: true });
      this.AeropuertosForm.get('Ciudad_mas_cercana').setValue(CiudadCercana, { onlySelf: false, emitEvent: true });

      this.AeropuertosForm.markAllAsTouched();
      this.AeropuertosForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else {
      this.spinner.hide('loading');
    }
  }

  //#region Aeropuertos
  get Pistas_del_AeropuertoItems() {
    return this.AeropuertosForm.get('Detalle_Pista_de_AeropuertoItems') as FormArray;
  }

  getPistas_del_AeropuertoColumns(): string[] {
    return this.Pistas_del_AeropuertoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadPistas_del_Aeropuerto(Pistas_del_Aeropuerto: Detalle_Pista_de_Aeropuerto[]) {
    Pistas_del_Aeropuerto.forEach(element => {
      this.addPistas_del_Aeropuerto(element);
    });
  }

  addPistas_del_AeropuertoToMR() {
    const Pistas_del_Aeropuerto = new Detalle_Pista_de_Aeropuerto(this.fb);
    this.Pistas_del_AeropuertoData.push(this.addPistas_del_Aeropuerto(Pistas_del_Aeropuerto));
    this.dataSourcePistas_del_Aeropuerto.data = this.Pistas_del_AeropuertoData;
    Pistas_del_Aeropuerto.edit = true;
    Pistas_del_Aeropuerto.isNew = true;
    const length = this.dataSourcePistas_del_Aeropuerto.data.length;
    const index = length - 1;
    const formPistas_del_Aeropuerto = this.Pistas_del_AeropuertoItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourcePistas_del_Aeropuerto.data.filter(d => !d.IsDeleted).length / this.paginatorPistas_del_Aeropuerto.pageSize);
    if (page !== this.paginatorPistas_del_Aeropuerto.pageIndex) {
      this.paginatorPistas_del_Aeropuerto.pageIndex = page;
    }
    this.isPistasOpen = true;
    this.SavePistaButton = true;
  }

  addPistas_del_Aeropuerto(entity: Detalle_Pista_de_Aeropuerto) {
    const Pistas_del_Aeropuerto = new Detalle_Pista_de_Aeropuerto(this.fb);
    this.Pistas_del_AeropuertoItems.push(Pistas_del_Aeropuerto.buildFormGroup());
    if (entity) {
      Pistas_del_Aeropuerto.fromObject(entity);
    }
    this.isPistasOpen = false;
    return entity;
  }

  Pistas_del_AeropuertoItemsByFolio(Folio: number): FormGroup {
    return (this.AeropuertosForm.get('Detalle_Pista_de_AeropuertoItems') as FormArray).controls.find(c => c.get('Clave').value === Folio) as FormGroup;
  }

  Pistas_del_AeropuertoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourcePistas_del_Aeropuerto.data.indexOf(element);
    let fb = this.Pistas_del_AeropuertoItems.controls[index] as FormGroup;
    return fb;
  }

  VerificarMRPista(element) {
    const index = this.dataSourcePistas_del_Aeropuerto.data.indexOf(element);
    let fgr = this.AeropuertosForm.controls.Detalle_Pista_de_AeropuertoItems as FormArray;
    let data = fgr.controls[index] as FormGroup;

    let pista = data.controls.Pista_Id.value;
    let Longitud = data.controls.Longitud.value;
    let Ancho = data.controls.Ancho.value;
    let Superficie = data.controls.Superficie.value;
    let Iluminacion = data.controls.Iluminacion.value;
    let Pavimento = data.controls.Pavimento.value;

    if (pista && Longitud != null && data.controls.Longitud.status == 'VALID' && data.controls.Ancho.status == 'VALID' &&
        Longitud != 0 && Ancho != null && Ancho != 0 && Superficie && Iluminacion && Pavimento) {
      this.SavePistaButton = false;
    }
    else {
      this.SavePistaButton = true
    }
  }

  deletePistas_del_Aeropuerto(element: any) {
    let index = this.dataSourcePistas_del_Aeropuerto.data.indexOf(element);

    if(this.Pistas_del_AeropuertoData[index].Clave != undefined && this.Pistas_del_AeropuertoData[index].Clave > 0) {
      this.pistasEliminar.push(this.Pistas_del_AeropuertoData[index].Clave);
    }

    this.Pistas_del_AeropuertoData[index].IsDeleted = true;
    this.Pistas_del_AeropuertoData.splice(index, 1);
    this.dataSourcePistas_del_Aeropuerto.data = this.Pistas_del_AeropuertoData;
    this.dataSourcePistas_del_Aeropuerto._updateChangeSubscription();
    index = this.dataSourcePistas_del_Aeropuerto.data.filter(d => !d.IsDeleted).length;

    let fgr = this.AeropuertosForm.controls.Detalle_Pista_de_AeropuertoItems as FormArray;
    fgr.removeAt(index);

    const page = Math.ceil(index / this.paginatorPistas_del_Aeropuerto.pageSize);
    if (page !== this.paginatorPistas_del_Aeropuerto.pageIndex) {
      this.paginatorPistas_del_Aeropuerto.pageIndex = page;
    }
  }

  cancelEditPistas_del_Aeropuerto(element: any) {
    let index = this.dataSourcePistas_del_Aeropuerto.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Pistas_del_AeropuertoData[index].IsDeleted = true;
      this.Pistas_del_AeropuertoData.splice(index, 1);
      this.dataSourcePistas_del_Aeropuerto.data = this.Pistas_del_AeropuertoData;
      this.dataSourcePistas_del_Aeropuerto._updateChangeSubscription();
      index = this.Pistas_del_AeropuertoData.filter(d => !d.IsDeleted).length;

      let fgr = this.AeropuertosForm.controls.Detalle_Pista_de_AeropuertoItems as FormArray;
      fgr.removeAt(index);

      const page = Math.ceil(index / this.paginatorPistas_del_Aeropuerto.pageSize);
      if (page !== this.paginatorPistas_del_Aeropuerto.pageIndex) {
        this.paginatorPistas_del_Aeropuerto.pageIndex = page;
      }
    }
    this.isPistasOpen = false;
  }

  async savePistas_del_Aeropuerto(element: any) {
    const index = this.dataSourcePistas_del_Aeropuerto.data.indexOf(element);
    const formPistas_del_Aeropuerto = this.Pistas_del_AeropuertoItems.controls[index] as FormGroup;
    this.Pistas_del_AeropuertoData[index].Pista_Id = formPistas_del_Aeropuerto.value.Pista_Id;
    this.Pistas_del_AeropuertoData[index].Longitud = formPistas_del_Aeropuerto.value.Longitud;
    this.Pistas_del_AeropuertoData[index].Ancho = formPistas_del_Aeropuerto.value.Ancho;
    this.Pistas_del_AeropuertoData[index].Superficie = formPistas_del_Aeropuerto.value.Superficie;
    this.Pistas_del_AeropuertoData[index].Iluminacion = formPistas_del_Aeropuerto.value.Iluminacion;
    this.Pistas_del_AeropuertoData[index].Pavimento = formPistas_del_Aeropuerto.value.Pavimento;

    this.Pistas_del_AeropuertoData[index].isNew = false;
    this.dataSourcePistas_del_Aeropuerto.data = this.Pistas_del_AeropuertoData;
    this.dataSourcePistas_del_Aeropuerto._updateChangeSubscription();
    this.SavePistaButton = true;
    this.isPistasOpen = false;
  }

  editPistas_del_Aeropuerto(element: any) {
    const index = this.dataSourcePistas_del_Aeropuerto.data.indexOf(element);
    const formPistas_del_Aeropuerto = this.Pistas_del_AeropuertoItems.controls[index] as FormGroup;

    element.edit = true;
    this.isPistasOpen = true;
    this.MRaddPistas_del_Aeropuerto = true;
  }

  async saveDetalle_Pista_de_Aeropuerto(Folio: number) {
    let valuesInsert: string = '';
    let values: string = '';
    this.pistasEliminar.forEach(x => { values = values + `${x.toString()},`; })
    values = values.slice(0, -1);

    this.dataSourcePistas_del_Aeropuerto.data.forEach(async (d, index) => {
      const data = this.Pistas_del_AeropuertoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Aeropuertos = Folio;
      model.IdAeropuerto = Folio;

      if (model.Clave === 0) {
        // Add Pistas del Aeropuerto
        //let response = await this.Detalle_Pista_de_AeropuertoService.insert(model).toPromise();
        valuesInsert = valuesInsert + `(${model.IdAeropuerto}, '${model.Pista_Id}', ${model.Longitud}, ${model.Ancho}, '${model.Superficie}', '${model.Iluminacion}', '${model.Pavimento}'),`;
      } else if (model.Clave > 0 && !d.IsDeleted) {
        const formPistas_del_Aeropuerto = this.Pistas_del_AeropuertoItemsByFolio(model.Clave);
        if (formPistas_del_Aeropuerto.dirty) {
          // Update Pistas del Aeropuerto
          let response = await this.Detalle_Pista_de_AeropuertoService.update(model.Clave, model).toPromise();
        }
      } else if (model.Clave > 0 && d.IsDeleted) {
        // delete Pistas del Aeropuerto
        await this.Detalle_Pista_de_AeropuertoService.delete(model.Clave).toPromise();
      }
    });

    if(valuesInsert != ''){
      this.brf.EvaluaQuery(`INSERT INTO Detalle_Pista_de_Aeropuerto VALUES ${valuesInsert.slice(0, -1)}`, 1, "ABC123");
    }

    if(values != ''){
      let query = `DELETE FROM Detalle_Pista_de_Aeropuerto WHERE Clave IN (${values})`;
      this.brf.EvaluaQuery(query, 1, "ABC123");
    }

  }
  //#endregion

  //#region FBO
  get FBOItems() {
    return this.AeropuertosForm.get('Detalle_FBOItems') as FormArray;
  }

  getFBOColumns(): string[] {
    return this.FBOColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadFBO(FBO: Detalle_FBO[]) {
    FBO.forEach(element => {
      this.addFBO(element);
    });
  }

  addFBOToMR() {
    const FBO = new Detalle_FBO(this.fb);
    this.FBOData.push(this.addFBO(FBO));
    this.dataSourceFBO.data = this.FBOData;
    FBO.edit = true;
    FBO.isNew = true;
    const length = this.dataSourceFBO.data.length;
    const index = length - 1;
    const formFBO = this.FBOItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceFBO.data.filter(d => !d.IsDeleted).length / this.paginatorFBO.pageSize);
    if (page !== this.paginatorFBO.pageIndex) {
      this.paginatorFBO.pageIndex = page;
    }
    this.isFboOpen = true;
  }

  addFBO(entity: Detalle_FBO) {
    const FBO = new Detalle_FBO(this.fb);
    this.FBOItems.push(FBO.buildFormGroup());
    if (entity) {
      FBO.fromObject(entity);
    }
    this.isFboOpen = false;
    return entity;
  }

  FBOItemsByFolio(Folio: number): FormGroup {
    return (this.AeropuertosForm.get('Detalle_FBOItems') as FormArray).controls.find(c => c.get('Clave').value === Folio) as FormGroup;
  }

  FBOItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceFBO.data.indexOf(element);
    let fb = this.FBOItems.controls[index] as FormGroup;
    return fb;
  }

  deleteFBO(element: any) {
    let index = this.dataSourceFBO.data.indexOf(element);

    if(this.FBOData[index].Clave != undefined && this.FBOData[index].Clave > 0) {
      this.fboEliminar.push(this.FBOData[index].Clave);
    }

    this.FBOData[index].IsDeleted = true;
    this.FBOData.splice(index, 1);
    this.dataSourceFBO.data = this.FBOData;
    this.dataSourceFBO._updateChangeSubscription();
    index = this.dataSourceFBO.data.filter(d => !d.IsDeleted).length;

    let fgr = this.AeropuertosForm.controls.Detalle_FBOItems as FormArray;
    fgr.removeAt(index);

    const page = Math.ceil(index / this.paginatorFBO.pageSize);
    if (page !== this.paginatorFBO.pageIndex) {
      this.paginatorFBO.pageIndex = page;
    }
  }

  cancelEditFBO(element: any) {
    let index = this.dataSourceFBO.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.FBOData[index].IsDeleted = true;
      this.FBOData.splice(index, 1);
      this.dataSourceFBO.data = this.FBOData;
      this.dataSourceFBO._updateChangeSubscription();
      index = this.FBOData.filter(d => !d.IsDeleted).length;

      let fgr = this.AeropuertosForm.controls.Detalle_FBOItems as FormArray;
      fgr.removeAt(index);

      const page = Math.ceil(index / this.paginatorFBO.pageSize);
      if (page !== this.paginatorFBO.pageIndex) {
        this.paginatorFBO.pageIndex = page;
      }
    }
    this.isFboOpen = false;
  }

  async saveFBO(element: any) {
    const index = this.dataSourceFBO.data.indexOf(element);
    const formFBO = this.FBOItems.controls[index] as FormGroup;
    this.FBOData[index].Nombre = formFBO.value.Nombre;
    this.FBOData[index].Telefono_Local = formFBO.value.Telefono_Local;
    this.FBOData[index].Telefono_Gratuito = formFBO.value.Telefono_Gratuito;
    this.FBOData[index].Sitio_Web = formFBO.value.Sitio_Web;

    this.FBOData[index].isNew = false;
    this.dataSourceFBO.data = this.FBOData;
    this.dataSourceFBO._updateChangeSubscription();
    this.SaveFBOButton = true;
    this.isFboOpen = false;
  }

  editFBO(element: any) {
    const index = this.dataSourceFBO.data.indexOf(element);
    const formFBO = this.FBOItems.controls[index] as FormGroup;

    element.edit = true;
    this.isFboOpen = true;
    this.MRaddFBO = true;
  }

  async saveDetalle_FBO(Folio: number) {
    let valuesInsert: string = '';
    let values: string = '';
    this.fboEliminar.forEach(x => { values = values + `${x.toString()},`; })
    values = values.slice(0, -1);

    this.dataSourceFBO.data.forEach(async (d, index) => {
      const data = this.FBOItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Aeropuertos = Folio;
      model.Aeropuerto_Id = Folio;

      if (model.Clave === 0) {
        // Add FBO
        //let response = await this.Detalle_FBOService.insert(model).toPromise();
        valuesInsert = valuesInsert + `(${model.Aeropuerto_Id}, '${model.Nombre}', '${model.Telefono_Local}', '${model.Telefono_Gratuito}', '${model.Sitio_Web}'),`;
      } else if (model.Clave > 0 && !d.IsDeleted) {
        const formFBO = this.FBOItemsByFolio(model.Clave);
        if (formFBO.dirty) {
          // Update FBO
          let response = await this.Detalle_FBOService.update(model.Clave, model).toPromise();
        }
      } else if (model.Clave > 0 && d.IsDeleted) {
        // delete FBO
        await this.Detalle_FBOService.delete(model.Clave).toPromise();
      }
    });

    if(valuesInsert != ''){
      this.brf.EvaluaQuery(`INSERT INTO Detalle_FBO VALUES ${valuesInsert.slice(0, -1)}`, 1, "ABC123");
    }

    if(values != ''){
      let query = `DELETE FROM Detalle_FBO WHERE Clave IN (${values})`;
      this.brf.EvaluaQuery(query, 1, "ABC123");
    }
  }

  //#endregion

  //#region Hoteles
  get HotelesItems() {
    return this.AeropuertosForm.get('Detalle_HotelesItems') as FormArray;
  }

  getHotelesColumns(): string[] {
    return this.HotelesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadHoteles(Hoteles: Detalle_Hoteles[]) {
    Hoteles.forEach(element => {
      this.addHoteles(element);
    });
  }

  addHotelesToMR() {
    const Hoteles = new Detalle_Hoteles(this.fb);
    this.HotelesData.push(this.addHoteles(Hoteles));
    this.dataSourceHoteles.data = this.HotelesData;
    Hoteles.edit = true;
    Hoteles.isNew = true;
    const length = this.dataSourceHoteles.data.length;
    const index = length - 1;
    const formHoteles = this.HotelesItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceHoteles.data.filter(d => !d.IsDeleted).length / this.paginatorHoteles.pageSize);
    if (page !== this.paginatorHoteles.pageIndex) {
      this.paginatorHoteles.pageIndex = page;
    }
    this.isHotelesOpen = true;
  }

  addHoteles(entity: Detalle_Hoteles) {
    const Hoteles = new Detalle_Hoteles(this.fb);
    this.HotelesItems.push(Hoteles.buildFormGroup());
    if (entity) {
      Hoteles.fromObject(entity);
    }
    this.isHotelesOpen = false;
    return entity;
  }

  HotelesItemsByFolio(Folio: number): FormGroup {
    return (this.AeropuertosForm.get('Detalle_HotelesItems') as FormArray).controls.find(c => c.get('Clave').value === Folio) as FormGroup;
  }

  HotelesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceHoteles.data.indexOf(element);
    let fb = this.HotelesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteHoteles(element: any) {
    let index = this.dataSourceHoteles.data.indexOf(element);

    if(this.HotelesData[index].Clave != undefined && this.HotelesData[index].Clave > 0) {
      this.hotelesEliminar.push(this.HotelesData[index].Clave);
    }

    this.HotelesData[index].IsDeleted = true;
    this.HotelesData.splice(index, 1);
    this.dataSourceHoteles.data = this.HotelesData;
    this.dataSourceHoteles._updateChangeSubscription();
    index = this.dataSourceHoteles.data.filter(d => !d.IsDeleted).length;

    let fgr = this.AeropuertosForm.controls.Detalle_HotelesItems as FormArray;
    fgr.removeAt(index);

    const page = Math.ceil(index / this.paginatorHoteles.pageSize);
    if (page !== this.paginatorHoteles.pageIndex) {
      this.paginatorHoteles.pageIndex = page;
    }
  }

  cancelEditHoteles(element: any) {
    let index = this.dataSourceHoteles.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.HotelesData[index].IsDeleted = true;
      this.HotelesData.splice(index, 1);
      this.dataSourceHoteles.data = this.HotelesData;
      this.dataSourceHoteles._updateChangeSubscription();
      index = this.HotelesData.filter(d => !d.IsDeleted).length;

      let fgr = this.AeropuertosForm.controls.Detalle_HotelesItems as FormArray;
      fgr.removeAt(index);

      const page = Math.ceil(index / this.paginatorHoteles.pageSize);
      if (page !== this.paginatorHoteles.pageIndex) {
        this.paginatorHoteles.pageIndex = page;
      }
    }
    this.isHotelesOpen = false;
  }

  async saveHoteles(element: any) {
    const index = this.dataSourceHoteles.data.indexOf(element);
    const formHoteles = this.HotelesItems.controls[index] as FormGroup;
    this.HotelesData[index].Hotel = formHoteles.value.Hotel;
    this.HotelesData[index].Telefono_Local = formHoteles.value.Telefono_Local;
    this.HotelesData[index].Sitio_Web = formHoteles.value.Sitio_Web;
    this.HotelesData[index].Distancia_del_Aeropuerto = formHoteles.value.Distancia_del_Aeropuerto;

    this.HotelesData[index].isNew = false;
    this.dataSourceHoteles.data = this.HotelesData;
    this.dataSourceHoteles._updateChangeSubscription();
    this.SaveHotelesButton = true;
    this.isHotelesOpen = false;
  }

  editHoteles(element: any) {
    const index = this.dataSourceHoteles.data.indexOf(element);
    const formHoteles = this.HotelesItems.controls[index] as FormGroup;

    element.edit = true;
    this.isHotelesOpen = true;
    this.MRaddHoteles = true;
  }

  async saveDetalle_Hoteles(Folio: number) {
    let valuesInsert: string = '';
    let values: string = '';
    this.hotelesEliminar.forEach(x => { values = values + `${x.toString()},`; })
    values = values.slice(0, -1);

    this.dataSourceHoteles.data.forEach(async (d, index) => {
      const data = this.HotelesItems.controls[index] as FormGroup;
      
      let model = data.getRawValue();
      model.Aeropuertos = Folio;
      model.Aeropuerto_Id = Folio;

      if (model.Clave === 0 && !d.IsDeleted) {
        // Add Hoteles
        //let response = await this.Detalle_HotelesService.insert(model).toPromise();
        let distancia = model.Distancia_del_Aeropuerto.length == 0 ? "null" : model.Distancia_del_Aeropuerto;
        valuesInsert = valuesInsert + `(${model.Aeropuerto_Id}, '${model.Hotel}', '${model.Telefono_Local}', '${model.Sitio_Web}', ${distancia}),`;
      } else if (model.Clave > 0 && !d.IsDeleted) {
        const formHoteles = this.HotelesItemsByFolio(model.Clave);
        if (formHoteles.dirty) {
          // Update Hoteles
          let response = await this.Detalle_HotelesService.update(model.Clave, model).toPromise();
        }
      } else if (model.Clave > 0 && d.IsDeleted) {
        // delete Hoteles
        await this.Detalle_HotelesService.delete(model.Clave).toPromise();
      }
    });

    if(valuesInsert != ''){
      this.brf.EvaluaQuery(`INSERT INTO Detalle_Hoteles VALUES ${valuesInsert.slice(0, -1)}`, 1, "ABC123");
    }


    if(values != ''){
      let query = `DELETE FROM Detalle_Hoteles WHERE Clave IN (${values})`;
      this.brf.EvaluaQuery(query, 1, "ABC123");
    }
  }

  //#endregion

  //#region Comisariatos
  get ComisariatosItems() {
    return this.AeropuertosForm.get('Detalle_ComisariatosItems') as FormArray;
  }

  getComisariatosColumns(): string[] {
    return this.ComisariatosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadComisariatos(Comisariatos: Detalle_Comisariatos[]) {
    Comisariatos.forEach(element => {
      this.addComisariatos(element);
    });
  }

  addComisariatosToMR() {
    const Comisariatos = new Detalle_Comisariatos(this.fb);
    this.ComisariatosData.push(this.addComisariatos(Comisariatos));
    this.dataSourceComisariatos.data = this.ComisariatosData;
    Comisariatos.edit = true;
    Comisariatos.isNew = true;
    const length = this.dataSourceComisariatos.data.length;
    const index = length - 1;
    const formComisariatos = this.ComisariatosItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceComisariatos.data.filter(d => !d.IsDeleted).length / this.paginatorComisariatos.pageSize);
    if (page !== this.paginatorComisariatos.pageIndex) {
      this.paginatorComisariatos.pageIndex = page;
    }
    this.isComisariatosOpen = true;
  }

  addComisariatos(entity: Detalle_Comisariatos) {
    const Comisariatos = new Detalle_Comisariatos(this.fb);
    this.ComisariatosItems.push(Comisariatos.buildFormGroup());
    if (entity) {
      Comisariatos.fromObject(entity);
    }
    this.isHotelesOpen = false;
    return entity;
  }

  ComisariatosItemsByFolio(Folio: number): FormGroup {
    return (this.AeropuertosForm.get('Detalle_ComisariatosItems') as FormArray).controls.find(c => c.get('Clave').value === Folio) as FormGroup;
  }

  ComisariatosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceComisariatos.data.indexOf(element);
    let fb = this.ComisariatosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteComisariatos(element: any) {
    let index = this.dataSourceComisariatos.data.indexOf(element);

    if(this.ComisariatosData[index].Clave != undefined && this.ComisariatosData[index].Clave > 0) {
      this.comisariatosEliminar.push(this.ComisariatosData[index].Clave);
    }

    this.ComisariatosData[index].IsDeleted = true;
    this.ComisariatosData.splice(index, 1);
    this.dataSourceComisariatos.data = this.ComisariatosData;
    this.dataSourceComisariatos._updateChangeSubscription();
    index = this.dataSourceComisariatos.data.filter(d => !d.IsDeleted).length;

    let fgr = this.AeropuertosForm.controls.Detalle_ComisariatosItems as FormArray;
    fgr.removeAt(index);

    const page = Math.ceil(index / this.paginatorComisariatos.pageSize);
    if (page !== this.paginatorComisariatos.pageIndex) {
      this.paginatorComisariatos.pageIndex = page;
    }
  }

  cancelEditComisariatos(element: any) {
    let index = this.dataSourceComisariatos.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.ComisariatosData[index].IsDeleted = true;
      this.ComisariatosData.splice(index, 1);
      this.dataSourceComisariatos.data = this.ComisariatosData;
      this.dataSourceComisariatos._updateChangeSubscription();
      index = this.ComisariatosData.filter(d => !d.IsDeleted).length;

      let fgr = this.AeropuertosForm.controls.Detalle_ComisariatosItems as FormArray;
      fgr.removeAt(index);

      const page = Math.ceil(index / this.paginatorComisariatos.pageSize);
      if (page !== this.paginatorComisariatos.pageIndex) {
        this.paginatorComisariatos.pageIndex = page;
      }
    }
    this.isComisariatosOpen = false;
  }

  async saveComisariatos(element: any) {
    const index = this.dataSourceComisariatos.data.indexOf(element);
    const formComisariatos = this.ComisariatosItems.controls[index] as FormGroup;
    this.ComisariatosData[index].Comisariato = formComisariatos.value.Comisariato;
    this.ComisariatosData[index].Telefono_Local = formComisariatos.value.Telefono_Local;
    this.ComisariatosData[index].Telefono_Gratuito = formComisariatos.value.Telefono_Gratuito;
    this.ComisariatosData[index].Sitio_Web = formComisariatos.value.Sitio_Web;

    this.ComisariatosData[index].isNew = false;
    this.dataSourceComisariatos.data = this.ComisariatosData;
    this.dataSourceComisariatos._updateChangeSubscription();
    this.SaveComisariatosButton = true;
    this.isComisariatosOpen = false;
  }

  editComisariatos(element: any) {
    const index = this.dataSourceComisariatos.data.indexOf(element);
    const formComisariatos = this.ComisariatosItems.controls[index] as FormGroup;

    element.edit = true;
    this.isComisariatosOpen = true;
    this.MRaddComisariatos = true;
  }

  async saveDetalle_Comisariatos(Folio: number) {
    let valuesInsert: string = '';
    let values: string = '';
    this.comisariatosEliminar.forEach(x => { values = values + `${x.toString()},`; })
    values = values.slice(0, -1);

    this.dataSourceComisariatos.data.forEach(async (d, index) => {
      const data = this.ComisariatosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Aeropuertos = Folio;
      model.Aeropuerto_Id = Folio;

      if (model.Clave === 0) {
        // Add Comisariatos
        // let response = await this.Detalle_ComisariatosService.insert(model).toPromise();
        valuesInsert = valuesInsert + `(${model.Aeropuerto_Id}, '${model.Comisariato}', '${model.Telefono_Local}', '${model.Telefono_Gratuito}', '${model.Sitio_Web}'),`;
      } else if (model.Clave > 0 && !d.IsDeleted) {
        const formComisariatos = this.ComisariatosItemsByFolio(model.Clave);
        if (formComisariatos.dirty) {
          // Update Comisariatos
          let response = await this.Detalle_ComisariatosService.update(model.Clave, model).toPromise();
        }
      } else if (model.Clave > 0 && d.IsDeleted) {
        // delete Comisariatos
        await this.Detalle_ComisariatosService.delete(model.Clave).toPromise();
      }
    });

    if(valuesInsert != ''){
      this.brf.EvaluaQuery(`INSERT INTO Detalle_Comisariatos VALUES ${valuesInsert.slice(0, -1)}`, 1, "ABC123");
    }

    if(values != ''){
      let query = `DELETE FROM Detalle_Comisariatos WHERE Clave IN (${values})`;
      this.brf.EvaluaQuery(query, 1, "ABC123");
    }

  }
  //#endregion

  //#region Transportes
  get TransportesItems() {
    return this.AeropuertosForm.get('Detalle_TransportesItems') as FormArray;
  }

  getTransportesColumns(): string[] {
    return this.TransportesColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadTransportes(Transportes: Detalle_Transportes[]) {
    Transportes.forEach(element => {
      this.addTransportes(element);
    });
  }

  addTransportesToMR() {
    const Transportes = new Detalle_Transportes(this.fb);
    this.TransportesData.push(this.addTransportes(Transportes));
    this.dataSourceTransportes.data = this.TransportesData;
    Transportes.edit = true;
    Transportes.isNew = true;
    const length = this.dataSourceTransportes.data.length;
    const index = length - 1;
    const formTransportes = this.TransportesItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceTransportes.data.filter(d => !d.IsDeleted).length / this.paginatorTransportes.pageSize);
    if (page !== this.paginatorTransportes.pageIndex) {
      this.paginatorTransportes.pageIndex = page;
    }
    this.isTransportesOpen = true;
  }

  addTransportes(entity: Detalle_Transportes) {
    const Transportes = new Detalle_Transportes(this.fb);
    this.TransportesItems.push(Transportes.buildFormGroup());
    if (entity) {
      Transportes.fromObject(entity);
    }
    this.isTransportesOpen = false;
    return entity;
  }

  TransportesItemsByFolio(Folio: number): FormGroup {
    return (this.AeropuertosForm.get('Detalle_TransportesItems') as FormArray).controls.find(c => c.get('Clave').value === Folio) as FormGroup;
  }

  TransportesItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceTransportes.data.indexOf(element);
    let fb = this.TransportesItems.controls[index] as FormGroup;
    return fb;
  }

  deleteTransportes(element: any) {
    let index = this.dataSourceTransportes.data.indexOf(element);

    if(this.TransportesData[index].Clave != undefined && this.TransportesData[index].Clave > 0) {
      this.transportesEliminar.push(this.TransportesData[index].Clave);
    }

    this.TransportesData[index].IsDeleted = true;
    this.TransportesData.splice(index, 1);
    this.dataSourceTransportes.data = this.TransportesData;
    this.dataSourceTransportes._updateChangeSubscription();
    index = this.dataSourceTransportes.data.filter(d => !d.IsDeleted).length;

    let fgr = this.AeropuertosForm.controls.Detalle_TransportesItems as FormArray;
    fgr.removeAt(index);

    const page = Math.ceil(index / this.paginatorTransportes.pageSize);
    if (page !== this.paginatorTransportes.pageIndex) {
      this.paginatorTransportes.pageIndex = page;
    }
  }

  cancelEditTransportes(element: any) {
    let index = this.dataSourceTransportes.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.TransportesData[index].IsDeleted = true;
      this.TransportesData.splice(index, 1);
      this.dataSourceTransportes.data = this.TransportesData;
      this.dataSourceTransportes._updateChangeSubscription();
      index = this.TransportesData.filter(d => !d.IsDeleted).length;

      let fgr = this.AeropuertosForm.controls.Detalle_TransportesItems as FormArray;
      fgr.removeAt(index);

      const page = Math.ceil(index / this.paginatorTransportes.pageSize);
      if (page !== this.paginatorTransportes.pageIndex) {
        this.paginatorTransportes.pageIndex = page;
      }
    }
    this.isTransportesOpen = false;
  }

  async saveTransportes(element: any) {
    const index = this.dataSourceTransportes.data.indexOf(element);
    const formTransportes = this.TransportesItems.controls[index] as FormGroup;
    this.TransportesData[index].Transporte = formTransportes.value.Transporte;
    this.TransportesData[index].Telefono_Local = formTransportes.value.Telefono_Local;
    this.TransportesData[index].Telefono_Gratuito = formTransportes.value.Telefono_Gratuito;
    this.TransportesData[index].Sitio_Web = formTransportes.value.Sitio_Web;

    this.TransportesData[index].isNew = false;
    this.dataSourceTransportes.data = this.TransportesData;
    this.dataSourceTransportes._updateChangeSubscription();
    this.SaveTransportesButton = true;
    this.isTransportesOpen = false;
  }

  editTransportes(element: any) {
    const index = this.dataSourceTransportes.data.indexOf(element);
    const formTransportes = this.TransportesItems.controls[index] as FormGroup;

    element.edit = true;
    this.isTransportesOpen = true;
    this.MRaddTransportes = true;
  }

  async saveDetalle_Transportes(Folio: number) {
    let valuesInsert: string = '';
    let values: string = '';
    this.transportesEliminar.forEach(x => { values = values + `${x.toString()},`; })
    values = values.slice(0, -1);

    this.dataSourceTransportes.data.forEach(async (d, index) => {
      const data = this.TransportesItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Aeropuertos = Folio;
      model.Aeropuerto_Id = Folio;

      if (model.Clave === 0) {
        // Add Transportes
        //let response = await this.Detalle_TransportesService.insert(model).toPromise();
        valuesInsert = valuesInsert + `(${model.Aeropuerto_Id}, '${model.Transporte}', '${model.Telefono_Local}', '${model.Telefono_Gratuito}', '${model.Sitio_Web}'),`;
      } else if (model.Clave > 0 && !d.IsDeleted) {
        const formTransportes = this.TransportesItemsByFolio(model.Clave);
        if (formTransportes.dirty) {
          // Update Transportes
          let response = await this.Detalle_TransportesService.update(model.Clave, model).toPromise();
        }
      } else if (model.Clave > 0 && d.IsDeleted) {
        // delete Transportes
        await this.Detalle_TransportesService.delete(model.Clave).toPromise();
      }
    });

    if(valuesInsert != ''){
      this.brf.EvaluaQuery(`INSERT INTO Detalle_Transportes VALUES ${valuesInsert.slice(0, -1)}`, 1, "ABC123");
    }

    if(values != ''){
      let query = `DELETE FROM Detalle_Transportes WHERE Clave IN (${values})`;
      this.brf.EvaluaQuery(query, 1, "ABC123");
    }
  }

  //#endregion

  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Aeropuerto_ID = +params.get('id');

        if (this.model.Aeropuerto_ID) {
          this.operation = !this.AeropuertosForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Aeropuerto_ID);
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
    observablesArray.push(this.Tipo_de_AeropuertoService.getAll());
    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varTipo_de_Aeropuerto]) => {
          this.varTipo_de_Aeropuerto = varTipo_de_Aeropuerto;
          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.AeropuertosForm.get('Pais').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais = true),
      distinctUntilChanged(),
      switchMap(value => {

        this.PaisSeleccionado = value;

        if(this.AeropuertosForm.get('Pais').value != '' && this.AeropuertosForm.get('Pais').value.Clave != ''){
          this.tienePais = true;
        }
        else{
          this.AeropuertosForm.get('Estado').setValue('');
          this.AeropuertosForm.get('Ciudad').setValue('');
          this.AeropuertosForm.get('Ciudad_mas_cercana').setValue('');
          this.tienePais = false;
        }

        if (!value) return this.PaisService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PaisService.listaSelAll(0, 20, '');
          return this.PaisService.listaSelAll(0, 20,
            "Pais.Nombre like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PaisService.listaSelAll(0, 20,
          "Pais.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      
      this.isLoadingPais = false;
      this.hasOptionsPais = result?.Paiss?.length > 0;

      if (this.PaisSeleccionado != undefined && this.PaisSeleccionado != "") {
        if(result.Paiss.length == 1) {
          this.AeropuertosForm.get('Pais').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
        }
        else{
          this.AeropuertosForm.get('Estado').setValue('');
          this.AeropuertosForm.get('Ciudad').setValue('');
          this.AeropuertosForm.get('Ciudad_mas_cercana').setValue('');
        }
      }
      
      this.optionsPais = of(result?.Paiss);

      if(!this.tienePais){
        this.AeropuertosForm.get('Pais').setValue('');
      }
      else
      {
        this.Pais_ExecuteBusinessRules();
      }

    }, error => {
      this.isLoadingPais = false;
      this.hasOptionsPais = false;
      this.optionsPais = of([]);
    });
    this.AeropuertosForm.get('Estado').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEstado = true),
      distinctUntilChanged(),
      switchMap(value => {

        if(this.AeropuertosForm.get('Pais').value != '' && this.AeropuertosForm.get('Pais').value.Clave != ''){
          this.whereEstado = `Estado.Pais = ${this.AeropuertosForm.get('Pais').value.Clave }`;
          this.tienePais = true;
          this.topEstado = 20;    
          
          if(!this.isStateFromUpdate) {
            this.AeropuertosForm.get('Ciudad').setValue('');
            this.AeropuertosForm.get('Ciudad_mas_cercana').setValue('');
          }

          this.isStateFromUpdate = false;

        }
        else{
          this.tienePais = false;
        }

        if (!value) return this.EstadoService.listaSelAll(0, this.topEstado, this.whereEstado);
        if (typeof value === 'string') {
          if (value === '') return this.EstadoService.listaSelAll(0, this.topEstado, this.whereEstado);
          return this.EstadoService.listaSelAll(0, this.topEstado,
            "Estado.Nombre like '%" + value.trimLeft().trimRight() + "%' AND " + this.whereEstado);
        }
        return this.EstadoService.listaSelAll(0, this.topEstado,
          "Estado.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%' AND " + this.whereEstado);
      })
    ).subscribe(result => {

      if(result?.Estados?.length == 0) {
        this.AeropuertosForm.controls.Estado.setErrors( {invalidAutocompleteValue: true } );
      }
      
      this.isLoadingEstado = false;
      this.hasOptionsEstado = result?.Estados?.length > 0;

      if(result.Estados.length == 1) {
        this.AeropuertosForm.get('Estado').setValue(result?.Estados[0], { onlySelf: true, emitEvent: false });
      }
      else{
        this.AeropuertosForm.get('Ciudad').setValue('');
        this.AeropuertosForm.get('Ciudad_mas_cercana').setValue('');
      }


      if(!this.tienePais){
        this.AeropuertosForm.get('Estado').setValue('');
      }

      this.optionsEstado = of(result?.Estados);
      this.Estado_ExecuteBusinessRules();

    }, error => {
      this.isLoadingEstado = false;
      this.hasOptionsEstado = false;
      this.optionsEstado = of([]);
    });
    this.AeropuertosForm.get('Ciudad').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCiudad = true),
      distinctUntilChanged(),
      switchMap(value => {

        if(this.AeropuertosForm.get('Estado').value != '' && this.AeropuertosForm.get('Estado').value.Clave != ''){
          this.whereCiudad = `Ciudad.Estado = ${this.AeropuertosForm.get('Estado').value.Clave }`;
          this.tieneEstado = true;
          this.topCiudad = 20;
        }
        else{
          this.tieneEstado = false;
        }

        if (!value) return this.CiudadService.listaSelAll(0, this.topCiudad, this.whereCiudad);
        if (typeof value === 'string') {
          if (value === '') return this.CiudadService.listaSelAll(0, this.topCiudad, this.whereCiudad);
          return this.CiudadService.listaSelAll(0, this.topCiudad,
            "Ciudad.Nombre like '%" + value.trimLeft().trimRight() + "%' AND " + this.whereCiudad);
        }
        return this.CiudadService.listaSelAll(0, this.topCiudad,
          "Ciudad.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%' AND " + this.whereCiudad);
      })
    ).subscribe(result => {

      if(result?.Ciudads?.length == 0) {
        this.AeropuertosForm.controls.Ciudad.setErrors( {invalidAutocompleteValue: true } );
      }

      this.isLoadingCiudad = false;
      this.hasOptionsCiudad = result?.Ciudads?.length > 0;
      this.optionsCiudad = of(result?.Ciudads);

      if(!this.tieneEstado){
        this.AeropuertosForm.get('Ciudad').setValue('');
      }

    }, error => {
      this.isLoadingCiudad = false;
      this.hasOptionsCiudad = false;
      this.optionsCiudad = of([]);
    });
    this.AeropuertosForm.get('Ciudad_mas_cercana').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCiudad_mas_cercana = true),
      distinctUntilChanged(),
      switchMap(value => {

        this.CCSeleccionado = value;

        if(this.AeropuertosForm.get('Estado').value != '' && this.AeropuertosForm.get('Estado').value.Clave != ''){
          this.whereCiudad = `Ciudad.Estado = ${this.AeropuertosForm.get('Estado').value.Clave }`;
          this.tieneEstado = true;
          this.topCiudad = 20;
        }
        else{
          this.tieneEstado = false;
        }

        if (!value) return this.CiudadService.listaSelAll(0, this.topCiudad, this.whereCiudad);
        if (typeof value === 'string') {
          if (value === '') return this.CiudadService.listaSelAll(0, this.topCiudad, this.whereCiudad);
          return this.CiudadService.listaSelAll(0, this.topCiudad,
            "Ciudad.Nombre like '%" + value.trimLeft().trimRight() + "%' AND " + this.whereCiudad);
        }
        return this.CiudadService.listaSelAll(0, this.topCiudad,
          "Ciudad.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%' AND " + this.whereCiudad);
      })
    ).subscribe(result => {

      if(result?.Ciudads?.length == 0) {
        this.AeropuertosForm.controls.Ciudad_mas_cercana.setErrors( {invalidAutocompleteValue: true } );
      }

      this.isLoadingCiudad_mas_cercana = false;
      this.hasOptionsCiudad_mas_cercana = result?.Ciudads?.length > 0;
      
      this.optionsCiudad_mas_cercana = of(result?.Ciudads);
    }, error => {
      this.isLoadingCiudad_mas_cercana = false;
      this.hasOptionsCiudad_mas_cercana = false;
      this.optionsCiudad_mas_cercana = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tipo_de_Aeropuerto': {
        this.Tipo_de_AeropuertoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Aeropuerto = x.Tipo_de_Aeropuertos;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnPais(option: Pais) {
    return option?.Nombre;
  }
  displayFnEstado(option: Estado) {
    return option?.Nombre;
  }
  displayFnCiudad(option: Ciudad) {
    return option?.Nombre;
  }
  displayFnCiudad_mas_cercana(option: Ciudad) {
    return option?.Nombre;
  }

  async save() {
    if(this.rulesBeforeSave()) {
      await this.saveData();
      this.goToList();
    }
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.AeropuertosForm.value;
      entity.Aeropuerto_ID = this.model.Aeropuerto_ID;
      entity.Pais = this.AeropuertosForm.get('Pais').value?.Clave;
      entity.Estado = this.AeropuertosForm.get('Estado').value?.Clave;
      entity.Ciudad = this.AeropuertosForm.get('Ciudad').value?.Clave;
      entity.Ciudad_mas_cercana = this.AeropuertosForm.get('Ciudad_mas_cercana').value?.Clave;
      if(entity.Estado == 0) delete entity.Estado;
      if(entity.Ciudad == 0) delete entity.Ciudad;
      if(entity.Ciudad_mas_cercana == 0) delete entity.Ciudad_mas_cercana;

      if (this.model.Aeropuerto_ID > 0) {
        await this.AeropuertosService.update(this.model.Aeropuerto_ID, entity).toPromise();

        await this.saveDetalle_Pista_de_Aeropuerto(this.model.Aeropuerto_ID);
        await this.saveDetalle_FBO(this.model.Aeropuerto_ID);
        await this.saveDetalle_Hoteles(this.model.Aeropuerto_ID);
        await this.saveDetalle_Comisariatos(this.model.Aeropuerto_ID);
        await this.saveDetalle_Transportes(this.model.Aeropuerto_ID);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Aeropuerto_ID.toString());
        this.rulesAfterSave();
      } else {
        await (this.AeropuertosService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Pista_de_Aeropuerto(id);
          await this.saveDetalle_FBO(id);
          await this.saveDetalle_Hoteles(id);
          await this.saveDetalle_Comisariatos(id);
          await this.saveDetalle_Transportes(id);

          this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          this.rulesAfterSave();
        }));
      }
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
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
    if (this.model.Aeropuerto_ID === 0) {
      this.AeropuertosForm.reset();
      this.model = new Aeropuertos(this.fb);
      this.AeropuertosForm = this.model.buildFormGroup();
      this.dataSourcePistas_del_Aeropuerto = new MatTableDataSource<Detalle_Pista_de_Aeropuerto>();
      this.Pistas_del_AeropuertoData = [];
      this.dataSourceFBO = new MatTableDataSource<Detalle_FBO>();
      this.FBOData = [];
      this.dataSourceHoteles = new MatTableDataSource<Detalle_Hoteles>();
      this.HotelesData = [];
      this.dataSourceComisariatos = new MatTableDataSource<Detalle_Comisariatos>();
      this.ComisariatosData = [];
      this.dataSourceTransportes = new MatTableDataSource<Detalle_Transportes>();
      this.TransportesData = [];

    } else {
      this.router.navigate(['views/Aeropuertos/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Aeropuerto_ID = 0;

  }

  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Aeropuertos/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  ICAO_ExecuteBusinessRules(): void {
    //ICAO_FieldExecuteBusinessRulesEnd
  }
  IATA_ExecuteBusinessRules(): void {
    //IATA_FieldExecuteBusinessRulesEnd
  }
  FAA_ExecuteBusinessRules(): void {
    //FAA_FieldExecuteBusinessRulesEnd
  }
  Nombre_ExecuteBusinessRules(): void {
    //Nombre_FieldExecuteBusinessRulesEnd
  }
  Pais_ExecuteBusinessRules(): void {

    this.AeropuertosForm.get('Estado').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingEstado = true),
      distinctUntilChanged(),
      switchMap(value => {       

        // if(this.AeropuertosForm.get('Pais').value != '' && this.AeropuertosForm.get('Pais').value.Clave != ''){
        //   this.whereEstado = `Estado.Pais = ${this.AeropuertosForm.get('Pais').value.Clave }`;
        // }
        // else{
        //   this.AeropuertosForm.get('Estado').setValue('');
        //   this.AeropuertosForm.get('Ciudad').setValue('');
        // }

        if(this.AeropuertosForm.get('Pais').value != '' && this.AeropuertosForm.get('Pais').value.Clave != '') {
          this.whereEstado = `Estado.Pais = ${this.AeropuertosForm.get('Pais').value.Clave }`;
          
          if(!this.isStateFromUpdate2) {
            this.AeropuertosForm.get('Ciudad').setValue('');
            this.AeropuertosForm.get('Ciudad_mas_cercana').setValue('');
          }
          this.isStateFromUpdate2 = false;

        }

        if (!value) return this.EstadoService.listaSelAll(0, 20, this.whereEstado);
        if (typeof value === 'string') {
          if (value === '') return this.EstadoService.listaSelAll(0, 20, this.whereEstado);
          return this.EstadoService.listaSelAll(0, 20,
            "Estado.Nombre like '%" + value.trimLeft().trimRight() + "%' AND " + this.whereEstado);
        }
        return this.EstadoService.listaSelAll(0, 20,
          "Estado.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%' AND " + this.whereEstado);
      })
    ).subscribe(result => {
      this.isLoadingEstado = false
      
      this.hasOptionsEstado = result?.Estados?.length > 0;
      
      
      // if(result.Estados.length == 1) {
      //   this.AeropuertosForm.get('Estado').setValue(result?.Estados[0], { onlySelf: true, emitEvent: false });
      // }
      // else{
      //   this.AeropuertosForm.get('Ciudad').setValue('');
      //   this.AeropuertosForm.get('Ciudad_mas_cercana').setValue('');
      // }

      this.optionsEstado = of(result?.Estados);
    }, error => {
      this.isLoadingEstado = false;
      this.hasOptionsEstado = false;
      this.optionsEstado = of([]);
    });

    //Pais_FieldExecuteBusinessRulesEnd

  }
  Estado_ExecuteBusinessRules(): void {
    this.AeropuertosForm.get('Ciudad').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCiudad = true),
      distinctUntilChanged(),
      switchMap(value => {

        if(this.AeropuertosForm.get('Estado').value != '' && this.AeropuertosForm.get('Estado').value.Clave != ''){
          this.whereCiudad = `Ciudad.Estado = ${this.AeropuertosForm.get('Estado').value.Clave }`;
        }

        if (!value) return this.CiudadService.listaSelAll(0, 20, this.whereCiudad);
        if (typeof value === 'string') {
          if (value === '') return this.CiudadService.listaSelAll(0, 20, this.whereCiudad);
          return this.CiudadService.listaSelAll(0, 20,
            "Ciudad.Nombre like '%" + value.trimLeft().trimRight() + "%' AND " + this.whereCiudad);
        }
        return this.CiudadService.listaSelAll(0, 20,
          "Ciudad.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%' AND " + this.whereCiudad);
      })
    ).subscribe(result => {
      this.isLoadingCiudad = false;
      this.hasOptionsCiudad = result?.Ciudads?.length > 0;
      this.optionsCiudad = of(result?.Ciudads);
      if(!this.tieneEstado){
        this.AeropuertosForm.get('Ciudad').setValue('');
      }
    }, error => {
      this.isLoadingCiudad = false;
      this.hasOptionsCiudad = false;
      this.optionsCiudad = of([]);
    });

    this.AeropuertosForm.get('Ciudad_mas_cercana').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCiudad_mas_cercana = true),
      distinctUntilChanged(),
      switchMap(value => {

        this.CCSeleccionado = value;

        if(this.AeropuertosForm.get('Estado').value != '' && this.AeropuertosForm.get('Estado').value.Clave != ''){
          this.whereCiudad = `Ciudad.Estado = ${this.AeropuertosForm.get('Estado').value.Clave }`;
          this.tieneEstado = true;
          this.topCiudad = 20;
        }
        else{
          this.tieneEstado = false;
        }

        if (!value) return this.CiudadService.listaSelAll(0, this.topCiudad, this.whereCiudad);
        if (typeof value === 'string') {
          if (value === '') return this.CiudadService.listaSelAll(0, this.topCiudad, this.whereCiudad);
          return this.CiudadService.listaSelAll(0, this.topCiudad,
            "Ciudad.Nombre like '%" + value.trimLeft().trimRight() + "%' AND " + this.whereCiudad);
        }
        return this.CiudadService.listaSelAll(0, this.topCiudad,
          "Ciudad.Nombre like '%" + value.Nombre.trimLeft().trimRight() + "%' AND " + this.whereCiudad);
      })
    ).subscribe(result => {
      this.isLoadingCiudad_mas_cercana = false;
      this.hasOptionsCiudad_mas_cercana = result?.Ciudads?.length > 0;
      
      // if (this.CCSeleccionado != undefined && this.CCSeleccionado != "") {
      //   if(result.Ciudads.length == 1) {
      //     this.AeropuertosForm.get('Ciudad_mas_cercana').setValue(result?.Ciudads[0], { onlySelf: true, emitEvent: false });
      //   }
      // }
      
      this.optionsCiudad_mas_cercana = of(result?.Ciudads);
      if(!this.tieneEstado){
        this.AeropuertosForm.get('Ciudad_mas_cercana').setValue('');
      }
    }, error => {
      this.isLoadingCiudad_mas_cercana = false;
      this.hasOptionsCiudad_mas_cercana = false;
      this.optionsCiudad_mas_cercana = of([]);
    });



    //Estado_FieldExecuteBusinessRulesEnd
  }
  Ciudad_ExecuteBusinessRules(): void {
    //Ciudad_FieldExecuteBusinessRulesEnd
  }
  Horario_de_operaciones_ExecuteBusinessRules(): void {
    //Horario_de_operaciones_FieldExecuteBusinessRulesEnd
  }
  Latitud_ExecuteBusinessRules(): void {
    //Latitud_FieldExecuteBusinessRulesEnd
  }
  Longitud_ExecuteBusinessRules(): void {
    //Longitud_FieldExecuteBusinessRulesEnd
  }
  Elevacion_pies_ExecuteBusinessRules(): void {
    //Elevacion_pies_FieldExecuteBusinessRulesEnd
  }
  Variacion_ExecuteBusinessRules(): void {
    //Variacion_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Aeropuerto_ExecuteBusinessRules(): void {
    //Tipo_de_Aeropuerto_FieldExecuteBusinessRulesEnd
  }
  Ciudad_mas_cercana_ExecuteBusinessRules(): void {
    //Ciudad_mas_cercana_FieldExecuteBusinessRulesEnd
  }
  Distancia_en_KM_ExecuteBusinessRules(): void {
    //Distancia_en_KM_FieldExecuteBusinessRulesEnd
  }
  Aeropuerto_Controlado_ExecuteBusinessRules(): void {
    //Aeropuerto_Controlado_FieldExecuteBusinessRulesEnd
  }
  UTC_Estandar_ExecuteBusinessRules(): void {
    //UTC_Estandar_FieldExecuteBusinessRulesEnd
  }

  parseDate(str): boolean {
    var m = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    return (m) ? true : false;
  }

  UTC_Estandar_Inicio_ExecuteBusinessRules(): void {
    const input = document.getElementById(
      'UTC_Estandar_Inicio',
    ) as HTMLInputElement | null;

    if (input != null) {
      let isDate: boolean = this.parseDate(input.value);
      if(!isDate) {
        this.AeropuertosForm.get('UTC_Estandar_Inicio').setValue(null);
      }
      else{
        let dia = input.value.split('/')[0];
        var iDia: number = +dia;
        let mes = input.value.split('/')[1];
        var iMes: number = +mes;
        
        if(iDia > 31 || iMes > 12) {
          this.AeropuertosForm.get('UTC_Estandar_Inicio').setValue(null);
        }
      }
    }

    //UTC_Estandar_Inicio_FieldExecuteBusinessRulesEnd
  }
  UTC_Estandar_Fin_ExecuteBusinessRules(): void {
    const input = document.getElementById(
      'UTC_Estandar_Fin',
    ) as HTMLInputElement | null;

    if (input != null) {
      let isDate: boolean = this.parseDate(input.value);
      if(!isDate) {
        this.AeropuertosForm.get('UTC_Estandar_Fin').setValue(null);
      }
      else{
        let dia = input.value.split('/')[0];
        var iDia: number = +dia;
        let mes = input.value.split('/')[1];
        var iMes: number = +mes;
        
        if(iDia > 31 || iMes > 12) {
          this.AeropuertosForm.get('UTC_Estandar_Fin').setValue(null);
        }
      }
    }

    //UTC_Estandar_Fin_FieldExecuteBusinessRulesEnd
  }
  UTC_DLTS_ExecuteBusinessRules(): void {

    //UTC_DLTS_FieldExecuteBusinessRulesEnd
  }
  UTC_DLTS_Inicio_ExecuteBusinessRules(): void {
    const input = document.getElementById(
      'UTC_DLTS_Inicio',
    ) as HTMLInputElement | null;

    if (input != null) {
      let isDate: boolean = this.parseDate(input.value);
      if(!isDate) {
        this.AeropuertosForm.get('UTC_DLTS_Inicio').setValue(null);
      }
      else{
        let dia = input.value.split('/')[0];
        var iDia: number = +dia;
        let mes = input.value.split('/')[1];
        var iMes: number = +mes;
        
        if(iDia > 31 || iMes > 12) {
          this.AeropuertosForm.get('UTC_DLTS_Inicio').setValue(null);
        }
      }
    }

    //UTC_DLTS_Inicio_FieldExecuteBusinessRulesEnd
  }
  UTC_DLTS_Fin_ExecuteBusinessRules(): void {
    const input = document.getElementById(
      'UTC_DLTS_Fin',
    ) as HTMLInputElement | null;

    if (input != null) {
      let isDate: boolean = this.parseDate(input.value);
      if(!isDate) {
        this.AeropuertosForm.get('UTC_DLTS_Fin').setValue(null);
      }
      else{
        let dia = input.value.split('/')[0];
        var iDia: number = +dia;
        let mes = input.value.split('/')[1];
        var iMes: number = +mes;
        
        if(iDia > 31 || iMes > 12) {
          this.AeropuertosForm.get('UTC_DLTS_Fin').setValue(null);
        }
      }
    }

    //UTC_DLTS_Fin_FieldExecuteBusinessRulesEnd
  }
  UTC__Amanecer_ExecuteBusinessRules(): void {
    //UTC__Amanecer_FieldExecuteBusinessRulesEnd
  }
  UTC__Atardecer_ExecuteBusinessRules(): void {
    //UTC__Atardecer_FieldExecuteBusinessRulesEnd
  }
  Local_Amanecer_ExecuteBusinessRules(): void {
    //Local_Amanecer_FieldExecuteBusinessRulesEnd
  }
  Local_Atardecer_ExecuteBusinessRules(): void {
    //Local_Atardecer_FieldExecuteBusinessRulesEnd
  }
  TWR_ExecuteBusinessRules(): void {
    //TWR_FieldExecuteBusinessRulesEnd
  }
  GND_ExecuteBusinessRules(): void {
    //GND_FieldExecuteBusinessRulesEnd
  }
  UNICOM_ExecuteBusinessRules(): void {
    //UNICOM_FieldExecuteBusinessRulesEnd
  }
  CARDEL_1_ExecuteBusinessRules(): void {
    //CARDEL_1_FieldExecuteBusinessRulesEnd
  }
  CARDEL_2_ExecuteBusinessRules(): void {
    //CARDEL_2_FieldExecuteBusinessRulesEnd
  }
  APPR_ExecuteBusinessRules(): void {
    //APPR_FieldExecuteBusinessRulesEnd
  }
  DEP_ExecuteBusinessRules(): void {
    //DEP_FieldExecuteBusinessRulesEnd
  }
  ATIS_ExecuteBusinessRules(): void {
    //ATIS_FieldExecuteBusinessRulesEnd
  }
  ATIS_Phone_ExecuteBusinessRules(): void {
    //ATIS_Phone_FieldExecuteBusinessRulesEnd
  }
  ASOS_ExecuteBusinessRules(): void {
    //ASOS_FieldExecuteBusinessRulesEnd
  }
  ASOS_Phone_ExecuteBusinessRules(): void {
    //ASOS_Phone_FieldExecuteBusinessRulesEnd
  }
  AWOS_ExecuteBusinessRules(): void {
    //AWOS_FieldExecuteBusinessRulesEnd
  }
  AWOS_Phone_ExecuteBusinessRules(): void {
    //AWOS_Phone_FieldExecuteBusinessRulesEnd
  }
  AWOS_Type_ExecuteBusinessRules(): void {
    //AWOS_Type_FieldExecuteBusinessRulesEnd
  }
  Codigo_de_area___Lada_ExecuteBusinessRules(): void {
    //Codigo_de_area___Lada_FieldExecuteBusinessRulesEnd
  }
  Administracion_Aeropuerto_ExecuteBusinessRules(): void {
    //Administracion_Aeropuerto_FieldExecuteBusinessRulesEnd
  }
  Comandancia_ExecuteBusinessRules(): void {
    //Comandancia_FieldExecuteBusinessRulesEnd
  }
  Despacho_ExecuteBusinessRules(): void {
    //Despacho_FieldExecuteBusinessRulesEnd
  }
  Torre_de_Control_ExecuteBusinessRules(): void {
    //Torre_de_Control_FieldExecuteBusinessRulesEnd
  }
  Descripcion_ExecuteBusinessRules(): void {
    //Descripcion_FieldExecuteBusinessRulesEnd
  }
  Notas_ExecuteBusinessRules(): void {
    //Notas_FieldExecuteBusinessRulesEnd
  }
  ICAO_IATA_ExecuteBusinessRules(): void {
    //ICAO_IATA_FieldExecuteBusinessRulesEnd
  }
  Comandante_Honorario_ExecuteBusinessRules(): void {
    //Comandante_HonorarioFieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:1170 - Ocultar siempre campo descripción - Autor: Lizeth Villa - Actualización: 3/7/2021 11:25:57 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      // this.brf.HideFieldOfForm(this.AeropuertosForm, "Descripcion"); 
      // this.brf.SetNotRequiredControl(this.AeropuertosForm, "Descripcion"); 
      // this.brf.SetNotRequiredControl(this.AeropuertosForm, "Descripcion");
    }
    //TERMINA - BRID:1170


    //INICIA - BRID:2356 - Campos no requeridos - Autor: Administrador - Actualización: 4/15/2021 12:42:44 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "IATA"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Nombre"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Ciudad"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Estado"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Horario_de_operaciones"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Elevacion_pies"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Variacion"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Tipo_de_Aeropuerto"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Ciudad_mas_cercana"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Distancia_en_KM"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "UTC_Estandar"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "UTC_Estandar_Inicio"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "UTC_Estandar_Fin"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "UTC_DLTS"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "UTC_DLTS_Inicio"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "UTC_DLTS_Fin"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "UTC__Amanecer"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "UTC__Atardecer"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Local_Amanecer"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Local_Atardecer"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "TWR"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "GND"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "UNICOM"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "CARDEL_1"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "CARDEL_2"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "APPR"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "DEP"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "ATIS"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "ATIS_Phone"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "ASOS"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "ASOS_Phone"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "AWOS"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "AWOS_Phone"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "AWOS_Type"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Codigo_de_area___Lada"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Administracion_Aeropuerto"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Comandancia"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Despacho"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Torre_de_Control"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "FAA"); 
      // this.brf.SetNotRequiredControl(this.AeropuertosForm, "Descripcion"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Clave"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "IdAeropuerto"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Pista_Id"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Ancho"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Superficie"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Iluminacion"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Pavimento"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Notas"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "Aeropuerto_Id");
    }
    //TERMINA - BRID:2356


    //INICIA - BRID:2437 - acomodo de campos aeropuertos - Autor: Administrador - Actualización: 4/5/2021 12:52:57 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2437


    //INICIA - BRID:4982 - Ocultar siempre campo ICAO_IATA - Autor: Lizeth Villa - Actualización: 8/13/2021 9:20:20 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "ICAO_IATA"); 
      this.brf.HideFieldOfForm(this.AeropuertosForm, "ICAO_IATA"); 
      this.brf.SetNotRequiredControl(this.AeropuertosForm, "ICAO_IATA");
    }
    //TERMINA - BRID:4982

    //rulesOnInit_ExecuteBusinessRulesEnd




  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    let query = `UPDATE Aeropuertos SET Comandante_Honorario = '${this.AeropuertosForm.get('Comandante_Honorario').value}' WHERE Aeropuerto_ID = ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}`;
    await this.brf.EvaluaQueryAsync(query, 1, "ABC123");

    //INICIA - BRID:1182 - Asignar descripcion al editar - Autor: Lizeth Villa - Actualización: 3/7/2021 11:13:44 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      await this.brf.EvaluaQueryAsync("exec spGetDescripcionAeropuerto "+this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted), 1, "ABC123");
    }
    //TERMINA - BRID:1182


    //INICIA - BRID:4980 - Adignar ICAO_IATA despues de guardar en nuevo y editar - Autor: Lizeth Villa - Actualización: 8/13/2021 10:42:44 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      await this.brf.EvaluaQueryAsync(" exec spGetICAOIATAAeropuerto "+this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted), 1, "ABC123");
    }
    //TERMINA - BRID:4980


    //INICIA - BRID:4981 - Adignar ICAO_IATA despues de guardar en editar - Autor: Lizeth Villa - Actualización: 8/13/2021 10:42:50 AM
    if (this.operation == 'Update') {
      await this.brf.EvaluaQueryAsync(" exec spGetDescripcionAeropuerto "+this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted), 1, "ABC123");
    }
    //TERMINA - BRID:4981

    //rulesAfterSave_ExecuteBusinessRulesEnd



  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    if(this.isPistasOpen) {
      alert("Has dejado un renglón sin guardar Pistas del Aeropuerto");
      result = false;
    }
    if(this.isFboOpen) {
      alert("Has dejado un renglón sin guardar FBO");
      result = false;
    }
    if(this.isHotelesOpen) {
      alert("Has dejado un renglón sin guardar Hoteles");
      result = false;
    }
    if(this.isComisariatosOpen) {
      alert("Has dejado un renglón sin guardar Comisariatos");
      result = false;
    }
    if(this.isTransportesOpen) {
      alert("Has dejado un renglón sin guardar Transportes");
      result = false;
    }

    //rulesBeforeSave_ExecuteBusinessRulesEnd
    return result;
  }

  //Fin de reglas

}
