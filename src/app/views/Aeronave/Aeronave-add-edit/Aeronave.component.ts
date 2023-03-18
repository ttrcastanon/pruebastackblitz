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
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { FabricanteService } from 'src/app/api-services/Fabricante.service';
import { Fabricante } from 'src/app/models/Fabricante';
import { ClienteService } from 'src/app/api-services/Cliente.service';
import { Cliente } from 'src/app/models/Cliente';
import { Origen_de_AeronaveService } from 'src/app/api-services/Origen_de_Aeronave.service';
import { Origen_de_Aeronave } from 'src/app/models/Origen_de_Aeronave';
import { Estatus_AeronaveService } from 'src/app/api-services/Estatus_Aeronave.service';
import { Estatus_Aeronave } from 'src/app/models/Estatus_Aeronave';
import { detalle_de_imagenes_de_aeronaveService } from 'src/app/api-services/detalle_de_imagenes_de_aeronave.service';
import { detalle_de_imagenes_de_aeronave } from 'src/app/models/detalle_de_imagenes_de_aeronave';

import { Nivel_de_RuidoService } from 'src/app/api-services/Nivel_de_Ruido.service';
import { Nivel_de_Ruido } from 'src/app/models/Nivel_de_Ruido';
import { Turbulencia_de_EstelaService } from 'src/app/api-services/Turbulencia_de_Estela.service';
import { Turbulencia_de_Estela } from 'src/app/models/Turbulencia_de_Estela';
import { Equipo_de_NavegacionService } from 'src/app/api-services/Equipo_de_Navegacion.service';
import { Equipo_de_Navegacion } from 'src/app/models/Equipo_de_Navegacion';
import { Tipo_de_AlaService } from 'src/app/api-services/Tipo_de_Ala.service';
import { Tipo_de_Ala } from 'src/app/models/Tipo_de_Ala';
import { Detalle_Motores_de_AeronaveService } from 'src/app/api-services/Detalle_Motores_de_Aeronave.service';
import { Detalle_Motores_de_Aeronave } from 'src/app/models/Detalle_Motores_de_Aeronave';
import { MotoresService } from 'src/app/api-services/Motores.service';
import { Motores } from 'src/app/models/Motores';

import { Tipo_de_Bitacora_de_AeronaveService } from 'src/app/api-services/Tipo_de_Bitacora_de_Aeronave.service';
import { Tipo_de_Bitacora_de_Aeronave } from 'src/app/models/Tipo_de_Bitacora_de_Aeronave';
import { Detalle_Seguros_Asociados_aService } from 'src/app/api-services/Detalle_Seguros_Asociados_a.service';
import { Detalle_Seguros_Asociados_a } from 'src/app/models/Detalle_Seguros_Asociados_a';
import { Proveedores_de_SegurosService } from 'src/app/api-services/Proveedores_de_Seguros.service';
import { Proveedores_de_Seguros } from 'src/app/models/Proveedores_de_Seguros';
import { Tipo_de_SeguroService } from 'src/app/api-services/Tipo_de_Seguro.service';
import { Tipo_de_Seguro } from 'src/app/models/Tipo_de_Seguro';


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

@Component({
  selector: 'app-Aeronave',
  templateUrl: './Aeronave.component.html',
  styleUrls: ['./Aeronave.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class AeronaveComponent implements OnInit, AfterViewInit {
MRaddSeguros_Asociados: boolean = false;
MRaddMotores_de_Aeronave: boolean = false;
MRaddFotografias_de_la_aeronave: boolean = false;

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  AeronaveForm: FormGroup;
  public Editor = ClassicEditor;
  model: Aeronave;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsModelo: Observable<Modelos[]>;
  hasOptionsModelo: boolean;
  isLoadingModelo: boolean;
  public varPropietarios: Propietarios[] = [];
  public varFabricante: Fabricante[] = [];
  optionsCliente: Observable<Cliente[]>;
  hasOptionsCliente: boolean;
  isLoadingCliente: boolean;
  public varOrigen_de_Aeronave: Origen_de_Aeronave[] = [];
  public varEstatus_Aeronave: Estatus_Aeronave[] = [];
  Fotografia_detalle_de_imagenes_de_aeronave: string[] = [];


  public varNivel_de_Ruido: Nivel_de_Ruido[] = [];
  public varTurbulencia_de_Estela: Turbulencia_de_Estela[] = [];
  public varEquipo_de_Navegacion: Equipo_de_Navegacion[] = [];
  public varTipo_de_Ala: Tipo_de_Ala[] = [];
  public varMotores: Motores[] = [];


  public varTipo_de_Bitacora_de_Aeronave: Tipo_de_Bitacora_de_Aeronave[] = [];
  public varProveedores_de_Seguros: Proveedores_de_Seguros[] = [];
  public varTipo_de_Seguro: Tipo_de_Seguro[] = [];


  isFotografiasOpen: boolean = false;
  sqlModel: any = { id: 1, securityCode: "ABC123", query: "" }
  private tmpFotografia:any

  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;

  dataSourceFotografias_de_la_aeronave = new MatTableDataSource<detalle_de_imagenes_de_aeronave>();
  Fotografias_de_la_aeronaveColumns = [
    { def: 'actions', hide: false },
    { def: 'Fotografia', hide: false },

  ];
  Fotografias_de_la_aeronaveData: detalle_de_imagenes_de_aeronave[] = [];

  dataSourceMotores_de_Aeronave = new MatTableDataSource<Detalle_Motores_de_Aeronave>();
  Motores_de_AeronaveColumns = [
    { def: 'actions', hide: false },
    { def: 'Motor', hide: false },
    { def: 'Marca', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'No__Serie', hide: false },

  ];
  Motores_de_AeronaveData: Detalle_Motores_de_Aeronave[] = [];

  dataSourceSeguros_Asociados = new MatTableDataSource<Detalle_Seguros_Asociados_a>();
  Seguros_AsociadosColumns = [
    { def: 'actions', hide: false },
    { def: 'Proveedor_de_Seguro', hide: false },
    { def: 'Tipo_de_Seguro', hide: false },
    { def: 'Numero_de_Poliza', hide: false },
    { def: 'Fecha_De_Vigencia', hide: false },

  ];
  Seguros_AsociadosData: Detalle_Seguros_Asociados_a[] = [];

  today = new Date;
  consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private PropietariosService: PropietariosService,
    private FabricanteService: FabricanteService,
    private ClienteService: ClienteService,
    private Origen_de_AeronaveService: Origen_de_AeronaveService,
    private Estatus_AeronaveService: Estatus_AeronaveService,
    private detalle_de_imagenes_de_aeronaveService: detalle_de_imagenes_de_aeronaveService,
    private Nivel_de_RuidoService: Nivel_de_RuidoService,
    private Turbulencia_de_EstelaService: Turbulencia_de_EstelaService,
    private Equipo_de_NavegacionService: Equipo_de_NavegacionService,
    private Tipo_de_AlaService: Tipo_de_AlaService,
    private Detalle_Motores_de_AeronaveService: Detalle_Motores_de_AeronaveService,
    private MotoresService: MotoresService,
    private Tipo_de_Bitacora_de_AeronaveService: Tipo_de_Bitacora_de_AeronaveService,
    private Detalle_Seguros_Asociados_aService: Detalle_Seguros_Asociados_aService,
    private Proveedores_de_SegurosService: Proveedores_de_SegurosService,
    private Tipo_de_SeguroService: Tipo_de_SeguroService,
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

    this.model = new Aeronave(this.fb);
    this.AeronaveForm = this.model.buildFormGroup();
    this.Fotografias_de_la_aeronaveItems.removeAt(0);
    this.Motores_de_AeronaveItems.removeAt(0);
    this.Seguros_AsociadosItems.removeAt(0);

    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  ngAfterViewInit(): void {
    this.dataSourceFotografias_de_la_aeronave.paginator = this.paginator;
    this.dataSourceMotores_de_Aeronave.paginator = this.paginator;
    this.dataSourceSeguros_Asociados.paginator = this.paginator;
    this.rulesAfterViewInit();
  }

  

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Fotografias_de_la_aeronaveColumns.splice(0, 1);
          this.Motores_de_AeronaveColumns.splice(0, 1);
          this.Seguros_AsociadosColumns.splice(0, 1);

          this.AeronaveForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Aeronave)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.AeronaveForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.AeronaveForm, 'Cliente', [CustomValidators.autocompleteObjectValidator(), Validators.required]);

    this.rulesOnInit();
  }

  async populateModel(id: string) {

    this.spinner.show('loading');
    let result = await this.AeronaveService.listaSelAll(0, 1, "Aeronave.Matricula='" + id + "'").toPromise();
    if (result.Aeronaves.length > 0) {
      await this.detalle_de_imagenes_de_aeronaveService.listaSelAll(0, 1000, "Aeronave.Matricula='" + id + "'").toPromise().then(fFotografias_de_la_aeronave => {

        fFotografias_de_la_aeronave.detalle_de_imagenes_de_aeronaves.forEach(async element => {
          element.Fotografia_Spartane_File = await this.brf.EvaluaQueryAsync(`SELECT ISNULL(Description, '') FROM Spartan_File WHERE File_Id = ${element.Fotografia}`, 1, "ABC123");
        });

        this.Fotografias_de_la_aeronaveData = fFotografias_de_la_aeronave.detalle_de_imagenes_de_aeronaves;
        this.loadFotografias_de_la_aeronave(fFotografias_de_la_aeronave.detalle_de_imagenes_de_aeronaves);
        this.dataSourceFotografias_de_la_aeronave = new MatTableDataSource(fFotografias_de_la_aeronave.detalle_de_imagenes_de_aeronaves);
        this.dataSourceFotografias_de_la_aeronave.paginator = this.paginator;
        this.dataSourceFotografias_de_la_aeronave.sort = this.sort;
      });

      await this.Detalle_Motores_de_AeronaveService.listaSelAll(0, 1000, "Aeronave.Matricula='" + id + "'").toPromise().then(fMotores_de_Aeronave => {
        this.Motores_de_AeronaveData = fMotores_de_Aeronave.Detalle_Motores_de_Aeronaves;
        this.loadMotores_de_Aeronave(fMotores_de_Aeronave.Detalle_Motores_de_Aeronaves);
        this.dataSourceMotores_de_Aeronave = new MatTableDataSource(fMotores_de_Aeronave.Detalle_Motores_de_Aeronaves);
        this.dataSourceMotores_de_Aeronave.paginator = this.paginator;
        this.dataSourceMotores_de_Aeronave.sort = this.sort;
      });

      await this.Detalle_Seguros_Asociados_aService.listaSelAll(0, 1000, "Aeronave.Matricula='" + id + "'").toPromise().then(fSeguros_Asociados => {
        this.Seguros_AsociadosData = fSeguros_Asociados.Detalle_Seguros_Asociados_as;
        this.loadSeguros_Asociados(fSeguros_Asociados.Detalle_Seguros_Asociados_as);
        this.dataSourceSeguros_Asociados = new MatTableDataSource(fSeguros_Asociados.Detalle_Seguros_Asociados_as);
        this.dataSourceSeguros_Asociados.paginator = this.paginator;
        this.dataSourceSeguros_Asociados.sort = this.sort;
        this.dataSourceSeguros_Asociados._updateChangeSubscription();
      });

      this.model.fromObject(result.Aeronaves[0]);

      this.AeronaveForm.get('Modelo').setValue(
        result.Aeronaves[0].Modelo_Modelos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.AeronaveForm.get('Cliente').setValue(
        result.Aeronaves[0].Cliente_Cliente.Razon_Social,
        { onlySelf: false, emitEvent: true }
      );

      setTimeout(() => {
        this.spinner.hide('loading');
        this.AeronaveForm.markAllAsTouched();
        this.AeronaveForm.updateValueAndValidity();
        this.Propia_ExecuteBusinessRules();
      }, 0);
      
    } else { this.spinner.hide('loading'); }
  }

  get Fotografias_de_la_aeronaveItems() {
    return this.AeronaveForm.get('detalle_de_imagenes_de_aeronaveItems') as FormArray;
  }

  getFotografias_de_la_aeronaveColumns(): string[] {
    return this.Fotografias_de_la_aeronaveColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadFotografias_de_la_aeronave(Fotografias_de_la_aeronave: detalle_de_imagenes_de_aeronave[]) {
    Fotografias_de_la_aeronave.forEach(element => {
      this.addFotografias_de_la_aeronave(element);
    });
  }

  addFotografias_de_la_aeronaveToMR() {
    const Fotografias_de_la_aeronave = new detalle_de_imagenes_de_aeronave(this.fb);
    this.Fotografias_de_la_aeronaveData.push(this.addFotografias_de_la_aeronave(Fotografias_de_la_aeronave));
    this.dataSourceFotografias_de_la_aeronave.data = this.Fotografias_de_la_aeronaveData;
    Fotografias_de_la_aeronave.edit = true;
    Fotografias_de_la_aeronave.isNew = true;
    const length = this.dataSourceFotografias_de_la_aeronave.data.length;
    const index = length - 1;
    const formFotografias_de_la_aeronave = this.Fotografias_de_la_aeronaveItems.controls[index] as FormGroup;
    formFotografias_de_la_aeronave.reset();
    const page = Math.ceil(this.dataSourceFotografias_de_la_aeronave.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
    this.isFotografiasOpen = true;
  }

  addFotografias_de_la_aeronave(entity: detalle_de_imagenes_de_aeronave) {
    const Fotografias_de_la_aeronave = new detalle_de_imagenes_de_aeronave(this.fb);
    this.Fotografias_de_la_aeronaveItems.push(Fotografias_de_la_aeronave.buildFormGroup());
    if (entity) {
      Fotografias_de_la_aeronave.fromObject(entity);
    }
    this.isFotografiasOpen = false;
    return entity;
  }

  Fotografias_de_la_aeronaveItemsByFolio(Folio: number): FormGroup {
    return (this.AeronaveForm.get('detalle_de_imagenes_de_aeronaveItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Fotografias_de_la_aeronaveItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceFotografias_de_la_aeronave.data.indexOf(element);
    let fb = this.Fotografias_de_la_aeronaveItems.controls[index] as FormGroup;
    return fb;
  }

  deleteFotografias_de_la_aeronave(element: any) {
    let index = this.dataSourceFotografias_de_la_aeronave.data.indexOf(element);
    this.Fotografias_de_la_aeronaveData[index].IsDeleted = true;
    this.dataSourceFotografias_de_la_aeronave.data = this.Fotografias_de_la_aeronaveData;
    this.dataSourceFotografias_de_la_aeronave.data.splice(index, 1);
    let fgr = this.AeronaveForm.controls.detalle_de_imagenes_de_aeronaveItems as FormArray;
      fgr.removeAt(index);
    this.dataSourceFotografias_de_la_aeronave._updateChangeSubscription();
    index = this.dataSourceFotografias_de_la_aeronave.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditFotografias_de_la_aeronave(element: any) {
    let index = this.dataSourceFotografias_de_la_aeronave.data.indexOf(element);
    element.edit = false;
    element.Fotografia_Spartane_File = this.tmpFotografia;
    if (element.isNew) {
      this.Fotografias_de_la_aeronaveData[index].IsDeleted = true;
      this.Fotografias_de_la_aeronaveData.splice(index, 1);
      let fgr = this.AeronaveForm.controls.detalle_de_imagenes_de_aeronaveItems as FormArray;
      fgr.removeAt(index);
      this.dataSourceFotografias_de_la_aeronave.data = this.Fotografias_de_la_aeronaveData;
      this.dataSourceFotografias_de_la_aeronave._updateChangeSubscription();
      index = this.Fotografias_de_la_aeronaveData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
    this.isFotografiasOpen = false;
  }

  async saveFotografias_de_la_aeronave(element: any) {
    const index = this.dataSourceFotografias_de_la_aeronave.data.indexOf(element);
    const formFotografias_de_la_aeronave = this.Fotografias_de_la_aeronaveItems.controls[index] as FormGroup;

    this.Fotografias_de_la_aeronaveData[index].isNew = false;
    this.MRaddFotografias_de_la_aeronave = false;
    this.dataSourceFotografias_de_la_aeronave.data = this.Fotografias_de_la_aeronaveData;
    this.dataSourceFotografias_de_la_aeronave._updateChangeSubscription();
    this.isFotografiasOpen = false;
    console.log(this.AeronaveForm)
  }

  editFotografias_de_la_aeronave(element: any) {
    const index = this.dataSourceFotografias_de_la_aeronave.data.indexOf(element);
    const formFotografias_de_la_aeronave = this.Fotografias_de_la_aeronaveItems.controls[index] as FormGroup;

    element.edit = true;
    this.isFotografiasOpen = false;
  }

  async savedetalle_de_imagenes_de_aeronave(Folio: string) {
    this.sqlModel.query =  ` DELETE detalle_de_imagenes_de_aeronave WHERE id_aeronave = ${Folio}`;
    this._SpartanService.ExecuteQuery(this.sqlModel).subscribe({
      next: (response) => {
        this.dataSourceFotografias_de_la_aeronave.data.forEach(async (d, index) => {
          const data = this.Fotografias_de_la_aeronaveItems.controls[index] as FormGroup;
          let model = data.getRawValue();
          model.Folio = 0;
          model.Aeronave = Folio;
          model.id_aeronave = Folio;
          const FolioFotografia = await this.saveFotografia_detalle_de_imagenes_de_aeronave(index);
          d.Fotografia = FolioFotografia > 0 ? FolioFotografia : null;
    
          model.Fotografia = d.Fotografia;
    
          await this.detalle_de_imagenes_de_aeronaveService.insert(model).toPromise();
        });
      },
      error: err => {
        console.error(err);
      },
      complete: async () => {
      }
    });
    
  }

  getFotografia_detalle_de_imagenes_de_aeronave(element: any) {
    const index = this.dataSourceFotografias_de_la_aeronave.data.indexOf(element);
    const formdetalle_de_imagenes_de_aeronave = this.Fotografias_de_la_aeronaveItems.controls[index] as FormGroup;
    return formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.value && 
    formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.value !== '' ? 
    formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.value.files[0].name : '';
    
    
  }

  async getFotografia_detalle_de_imagenes_de_aeronaveClick(element: any) {
    const index = this.dataSourceFotografias_de_la_aeronave.data.indexOf(element);
    const formdetalle_de_imagenes_de_aeronave = this.Fotografias_de_la_aeronaveItems.controls[index] as FormGroup;
    if (formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.valid
      && formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.dirty) {
      const Fotografia = formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Fotografia);
      this.helperService.dowloadFileFromArray(byteArray, Fotografia.name);
    }
  }

  removeFotografia_detalle_de_imagenes_de_aeronave(element: any) {
    const index = this.dataSourceFotografias_de_la_aeronave.data.indexOf(element);
    // this.Fotografia_detalle_de_imagenes_de_aeronave[index] = '';
    // this.Fotografias_de_la_aeronaveData[index].Fotografia = 0;
    this.tmpFotografia = element.Fotografia_Spartane_File;
    element.Fotografia_Spartane_File = null;
    const formdetalle_de_imagenes_de_aeronave = this.Fotografias_de_la_aeronaveItems.value[index] as FormGroup;
    formdetalle_de_imagenes_de_aeronave.get("IsDeleted").setValue(true);
    // formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.setValue(null);
    if (formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.valid
      && formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.dirty) {
        formdetalle_de_imagenes_de_aeronave.controls.FotografiaFile.setValue(null);
    } 
  }

  async saveFotografia_detalle_de_imagenes_de_aeronave(index: number): Promise<number> {
    const formFotografias_de_la_aeronave = this.Fotografias_de_la_aeronaveItems.controls[index] as FormGroup;
    const documento = formFotografias_de_la_aeronave.get("Fotografia").value;
    const IsDeleted = formFotografias_de_la_aeronave.get("IsDeleted").value;
    if (formFotografias_de_la_aeronave.controls.FotografiaFile.valid
      && formFotografias_de_la_aeronave.controls.FotografiaFile.dirty) {
      const Fotografia = formFotografias_de_la_aeronave.controls.FotografiaFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Fotografia);
      const spartanFile = {
        File: byteArray,
        Description: Fotografia.name,
        Date_Time: Fotografia.lastModifiedDate,
        File_Size: Fotografia.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return (formFotografias_de_la_aeronave.controls.DOCUMENTOFile.valid && documento && !IsDeleted) ? documento : 0;
    }
  }

  isContinedPicture:boolean = false;

  hasFotografia_detalle_de_imagenes_de_aeronave(element) {
    return this.getFotografia_detalle_de_imagenes_de_aeronave(element) !== '' ||
      (element.Fotografia_Spartane_File && element.Fotografia_Spartane_File.File_Id > 0);
  }

  get Motores_de_AeronaveItems() {
    return this.AeronaveForm.get('Detalle_Motores_de_AeronaveItems') as FormArray;
  }

  getMotores_de_AeronaveColumns(): string[] {
    return this.Motores_de_AeronaveColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadMotores_de_Aeronave(Motores_de_Aeronave: Detalle_Motores_de_Aeronave[]) {
    Motores_de_Aeronave.forEach(element => {
      this.addMotores_de_Aeronave(element);
    });
  }

  addMotores_de_AeronaveToMR() {
    const Motores_de_Aeronave = new Detalle_Motores_de_Aeronave(this.fb);
    this.Motores_de_AeronaveData.push(this.addMotores_de_Aeronave(Motores_de_Aeronave));
    this.dataSourceMotores_de_Aeronave.data = this.Motores_de_AeronaveData;
    Motores_de_Aeronave.edit = true;
    Motores_de_Aeronave.isNew = true;
    const length = this.dataSourceMotores_de_Aeronave.data.length;
    const index = length - 1;
    const formMotores_de_Aeronave = this.Motores_de_AeronaveItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceMotores_de_Aeronave.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addMotores_de_Aeronave(entity: Detalle_Motores_de_Aeronave) {
    const Motores_de_Aeronave = new Detalle_Motores_de_Aeronave(this.fb);
    this.Motores_de_AeronaveItems.push(Motores_de_Aeronave.buildFormGroup());
    if (entity) {
      Motores_de_Aeronave.fromObject(entity);
    }
    return entity;
  }

  Motores_de_AeronaveItemsByFolio(Folio: number): FormGroup {
    return (this.AeronaveForm.get('Detalle_Motores_de_AeronaveItems') as FormArray).controls.find(c => c.get('Clave').value === Folio) as FormGroup;
  }

  Motores_de_AeronaveItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceMotores_de_Aeronave.data.indexOf(element);
    let fb = this.Motores_de_AeronaveItems.controls[index] as FormGroup;
    return fb;
  }

  deleteMotores_de_Aeronave(element: any) {
    let index = this.dataSourceMotores_de_Aeronave.data.indexOf(element);
    this.Motores_de_AeronaveData[index].IsDeleted = true;
    this.Motores_de_AeronaveData.splice(index, 1);
    this.dataSourceMotores_de_Aeronave.data = this.Motores_de_AeronaveData;
    this.dataSourceMotores_de_Aeronave._updateChangeSubscription();
    index = this.dataSourceMotores_de_Aeronave.data.filter(d => !d.IsDeleted).length;

    let fgr = this.AeronaveForm.controls.Detalle_Motores_de_AeronaveItems as FormArray;
    fgr.removeAt(index);

    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditMotores_de_Aeronave(element: any) {
    let index = this.dataSourceMotores_de_Aeronave.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Motores_de_AeronaveData[index].IsDeleted = true;
      this.Motores_de_AeronaveData.splice(index, 1);
      this.dataSourceMotores_de_Aeronave.data = this.Motores_de_AeronaveData;
      this.dataSourceMotores_de_Aeronave._updateChangeSubscription();
      index = this.Motores_de_AeronaveData.filter(d => !d.IsDeleted).length;

      let fgr = this.AeronaveForm.controls.Detalle_Motores_de_AeronaveItems as FormArray;
      fgr.removeAt(index);

      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveMotores_de_Aeronave(element: any) {
    const index = this.dataSourceMotores_de_Aeronave.data.indexOf(element);
    const formMotores_de_Aeronave = this.Motores_de_AeronaveItems.controls[index] as FormGroup;
    this.Motores_de_AeronaveData[index].Motor = formMotores_de_Aeronave.value.Motor;
    this.Motores_de_AeronaveData[index].Motor_Motores = formMotores_de_Aeronave.value.Motor !== '' ?
      this.varMotores.filter(d => d.Clave === formMotores_de_Aeronave.value.Motor)[0] : null;
    this.Motores_de_AeronaveData[index].Marca = formMotores_de_Aeronave.value.Marca;
    this.Motores_de_AeronaveData[index].Modelo = formMotores_de_Aeronave.value.Modelo;
    this.Motores_de_AeronaveData[index].No__Serie = formMotores_de_Aeronave.value.No__Serie;

    this.Motores_de_AeronaveData[index].isNew = false;
    this.dataSourceMotores_de_Aeronave.data = this.Motores_de_AeronaveData;
    this.dataSourceMotores_de_Aeronave._updateChangeSubscription();
  }

  editMotores_de_Aeronave(element: any) {
    const index = this.dataSourceMotores_de_Aeronave.data.indexOf(element);
    const formMotores_de_Aeronave = this.Motores_de_AeronaveItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_Motores_de_Aeronave(Folio: string) {
    this.dataSourceMotores_de_Aeronave.data.forEach(async (d, index) => {
      const data = this.Motores_de_AeronaveItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Aeronave = Folio;
      model.idAeronave = Folio;

      if (model.Clave === 0) {
        // Add Motores de Aeronave
        //let response = await this.Detalle_Motores_de_AeronaveService.insert(model).toPromise();

        await this.brf.EvaluaQueryAsync(`EXEC sp_InsDetalle_Motores_de_Aeronave ${model.idAeronave}, ${model.Motor}, ${model.Marca}, ${model.Modelo}, ${model.No__Serie}`, 1, "ABC123");

      } else if (model.Clave > 0 && !d.IsDeleted) {
        const formMotores_de_Aeronave = this.Motores_de_AeronaveItemsByFolio(model.Clave);
        if (formMotores_de_Aeronave.dirty) {
          // Update Motores de Aeronave
          let response = await this.Detalle_Motores_de_AeronaveService.update(model.Clave, model).toPromise();
        }
      } else if (model.Clave > 0 && d.IsDeleted) {
        // delete Motores de Aeronave
        await this.Detalle_Motores_de_AeronaveService.delete(model.Clave).toPromise();
      }
    });
  }


  get Seguros_AsociadosItems() {
    return this.AeronaveForm.get('Detalle_Seguros_Asociados_aItems') as FormArray;
  }

  getSeguros_AsociadosColumns(): string[] {
    return this.Seguros_AsociadosColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadSeguros_Asociados(Seguros_Asociados: Detalle_Seguros_Asociados_a[]) {
    Seguros_Asociados.forEach(element => {
      this.addSeguros_Asociados(element);
    });
  }

  addSeguros_AsociadosToMR() {
    const Seguros_Asociados = new Detalle_Seguros_Asociados_a(this.fb);
    this.Seguros_AsociadosData.push(this.addSeguros_Asociados(Seguros_Asociados));
    this.dataSourceSeguros_Asociados.data = this.Seguros_AsociadosData;
    Seguros_Asociados.edit = true;
    Seguros_Asociados.isNew = true;
    const length = this.dataSourceSeguros_Asociados.data.length;
    const index = length - 1;
    const formSeguros_Asociados = this.Seguros_AsociadosItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceSeguros_Asociados.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addSeguros_Asociados(entity: Detalle_Seguros_Asociados_a) {
    const Seguros_Asociados = new Detalle_Seguros_Asociados_a(this.fb);
    this.Seguros_AsociadosItems.push(Seguros_Asociados.buildFormGroup());
    if (entity) {
      Seguros_Asociados.fromObject(entity);
    }
    return entity;
  }

  Seguros_AsociadosItemsByFolio(Folio: number): FormGroup {
    return (this.AeronaveForm.get('Detalle_Seguros_Asociados_aItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Seguros_AsociadosItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    let fb = this.Seguros_AsociadosItems.controls[index] as FormGroup;
    return fb;
  }

  deleteSeguros_Asociados(element: any) {
    let index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    this.Seguros_AsociadosData[index].IsDeleted = true;
    this.Seguros_AsociadosData.splice(index, 1);
    this.dataSourceSeguros_Asociados.data = this.Seguros_AsociadosData;
    this.dataSourceSeguros_Asociados._updateChangeSubscription();
    index = this.dataSourceSeguros_Asociados.data.filter(d => !d.IsDeleted).length;
    let fgr = this.AeronaveForm.controls.Detalle_Seguros_Asociados_aItems as FormArray;
    fgr.removeAt(index);
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditSeguros_Asociados(element: any) {
    let index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Seguros_AsociadosData[index].IsDeleted = true;
      this.Seguros_AsociadosData.splice(index, 1);
      this.dataSourceSeguros_Asociados.data = this.Seguros_AsociadosData;
      this.dataSourceSeguros_Asociados._updateChangeSubscription();
      index = this.Seguros_AsociadosData.filter(d => !d.IsDeleted).length;

      let fgr = this.AeronaveForm.controls.Detalle_Seguros_Asociados_aItems as FormArray;
      fgr.removeAt(index);

      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveSeguros_Asociados(element: any) {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    const formSeguros_Asociados = this.Seguros_AsociadosItems.controls[index] as FormGroup;
    this.Seguros_AsociadosData[index].Proveedor_de_Seguro = formSeguros_Asociados.value.Proveedor_de_Seguro;
    this.Seguros_AsociadosData[index].Proveedor_de_Seguro_Proveedores_de_Seguros = formSeguros_Asociados.value.Proveedor_de_Seguro !== '' ?
      this.varProveedores_de_Seguros.filter(d => d.Clave === formSeguros_Asociados.value.Proveedor_de_Seguro)[0] : null;
    this.Seguros_AsociadosData[index].Tipo_de_Seguro = formSeguros_Asociados.value.Tipo_de_Seguro;
    this.Seguros_AsociadosData[index].Tipo_de_Seguro_Tipo_de_Seguro = formSeguros_Asociados.value.Tipo_de_Seguro !== '' ?
      this.varTipo_de_Seguro.filter(d => d.Clave === formSeguros_Asociados.value.Tipo_de_Seguro)[0] : null;
    this.Seguros_AsociadosData[index].Numero_de_Poliza = formSeguros_Asociados.value.Numero_de_Poliza;
    this.Seguros_AsociadosData[index].Fecha_De_Vigencia = formSeguros_Asociados.value.Fecha_De_Vigencia;

    this.Seguros_AsociadosData[index].isNew = false;
    this.dataSourceSeguros_Asociados.data = this.Seguros_AsociadosData;
    this.dataSourceSeguros_Asociados._updateChangeSubscription();
  }

  editSeguros_Asociados(element: any) {
    const index = this.dataSourceSeguros_Asociados.data.indexOf(element);
    const formSeguros_Asociados = this.Seguros_AsociadosItems.controls[index] as FormGroup;

    element.edit = true;
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

  async saveDetalle_Seguros_Asociados_a(Folio: string) {
    this.dataSourceSeguros_Asociados.data.forEach(async (d, index) => {
      const data = this.Seguros_AsociadosItems.controls[index] as FormGroup;
      let model = data.getRawValue();
      model.Aeronave = Folio;
      model.IdMatricula = Folio;


      if (model.Folio === 0) {
        // Add Seguros Asociados
        let response = await this.Detalle_Seguros_Asociados_aService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formSeguros_Asociados = this.Seguros_AsociadosItemsByFolio(model.Folio);
        if (formSeguros_Asociados.dirty) {
          // Update Seguros Asociados
          let response = await this.Detalle_Seguros_Asociados_aService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Seguros Asociados
        await this.Detalle_Seguros_Asociados_aService.delete(model.Folio).toPromise();
      }
    });
  }




  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Matricula = params.get('id');

        if (this.model.Matricula) {
          this.operation = !this.AeronaveForm.disabled ? "Update" : this.operation;
          this.populateModel(this.model.Matricula);
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
    observablesArray.push(this.PropietariosService.getAll());
    observablesArray.push(this.FabricanteService.getAll());
    observablesArray.push(this.Origen_de_AeronaveService.getAll());
    observablesArray.push(this.Estatus_AeronaveService.getAll());

    observablesArray.push(this.Nivel_de_RuidoService.getAll());
    observablesArray.push(this.Turbulencia_de_EstelaService.getAll());
    observablesArray.push(this.Equipo_de_NavegacionService.getAll());
    observablesArray.push(this.Tipo_de_AlaService.getAll());
    observablesArray.push(this.MotoresService.getAll());

    observablesArray.push(this.Tipo_de_Bitacora_de_AeronaveService.getAll());
    observablesArray.push(this.Proveedores_de_SegurosService.getAll());
    observablesArray.push(this.Tipo_de_SeguroService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varPropietarios, varFabricante, varOrigen_de_Aeronave, varEstatus_Aeronave, varNivel_de_Ruido, varTurbulencia_de_Estela, varEquipo_de_Navegacion, varTipo_de_Ala, varMotores, varTipo_de_Bitacora_de_Aeronave, varProveedores_de_Seguros, varTipo_de_Seguro]) => {
          this.varPropietarios = varPropietarios;
          this.varFabricante = varFabricante;
          this.varOrigen_de_Aeronave = varOrigen_de_Aeronave;
          this.varEstatus_Aeronave = varEstatus_Aeronave;

          this.varNivel_de_Ruido = varNivel_de_Ruido;
          this.varTurbulencia_de_Estela = varTurbulencia_de_Estela;
          this.varEquipo_de_Navegacion = varEquipo_de_Navegacion;
          this.varTipo_de_Ala = varTipo_de_Ala;
          this.varMotores = varMotores;

          this.varTipo_de_Bitacora_de_Aeronave = varTipo_de_Bitacora_de_Aeronave;
          this.varProveedores_de_Seguros = varProveedores_de_Seguros;
          this.varTipo_de_Seguro = varTipo_de_Seguro;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.AeronaveForm.get('Modelo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingModelo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.ModelosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.ModelosService.listaSelAll(0, 20, '');
          return this.ModelosService.listaSelAll(0, 20,
            "Modelos.Descripcion like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.ModelosService.listaSelAll(0, 20,
          "Modelos.Descripcion like '%" + value.Descripcion.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = result?.Modeloss?.length > 0;
      const value = this.AeronaveForm.get('Modelo').value;
      if (result?.Modeloss?.length === 1 && value.length === result?.Modeloss[0].Descripcion?.length)
      this.AeronaveForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      this.optionsModelo = of(result?.Modeloss);
      this.validaCampos();
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.AeronaveForm.get('Cliente').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingCliente = true),
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
      this.isLoadingCliente = false;
      this.hasOptionsCliente = result?.Clientes?.length > 0;
      if(this.operation == "Consult" || this.operation == "Update"){
        this.AeronaveForm.get('Cliente').setValue(result?.Clientes[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsCliente = of(result?.Clientes);
      this.validaCampos();
    }, error => {
      this.isLoadingCliente = false;
      this.hasOptionsCliente = false;
      this.optionsCliente = of([]);
    });


  }

  validaCampos(){
    setTimeout(() => {
      this.AeronaveForm.updateValueAndValidity();
    }, 0);
  }

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Propietario': {
        this.PropietariosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varPropietarios = x.Propietarioss;
        });
        break;
      }
      case 'Fabricante': {
        this.FabricanteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varFabricante = x.Fabricantes;
        });
        break;
      }
      case 'Origen_de_Aeronave': {
        this.Origen_de_AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varOrigen_de_Aeronave = x.Origen_de_Aeronaves;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_Aeronave = x.Estatus_Aeronaves;
        });
        break;
      }

      case 'Nivel_de_ruido': {
        this.Nivel_de_RuidoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varNivel_de_Ruido = x.Nivel_de_Ruidos;
        });
        break;
      }
      case 'Turbulencia': {
        this.Turbulencia_de_EstelaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTurbulencia_de_Estela = x.Turbulencia_de_Estelas;
        });
        break;
      }
      case 'Equipo_de_navegacion': {
        this.Equipo_de_NavegacionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEquipo_de_Navegacion = x.Equipo_de_Navegacions;
        });
        break;
      }
      case 'Tipo_de_Ala': {
        this.Tipo_de_AlaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Ala = x.Tipo_de_Alas;
        });
        break;
      }
      case 'Motor': {
        this.MotoresService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varMotores = x.Motoress;
        });
        break;
      }

      case 'Bitacora': {
        this.Tipo_de_Bitacora_de_AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Bitacora_de_Aeronave = x.Tipo_de_Bitacora_de_Aeronaves;
        });
        break;
      }
      case 'Proveedor_de_Seguro': {
        this.Proveedores_de_SegurosService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varProveedores_de_Seguros = x.Proveedores_de_Seguross;
        });
        break;
      }
      case 'Tipo_de_Seguro': {
        this.Tipo_de_SeguroService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Seguro = x.Tipo_de_Seguros;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

  displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
  displayFnCliente(option: Cliente) {
    return option?.Razon_Social;
  }


  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.AeronaveForm.value;
      entity.Matricula = this.model.Matricula;
      entity.Modelo = this.AeronaveForm.get('Modelo').value.Clave;
      entity.Cliente = this.AeronaveForm.get('Cliente').value.Clave;
      entity.Ciclos_iniciales = this.AeronaveForm.get('Ciclos_iniciales').value;
      entity.Ciclos_actuales = this.AeronaveForm.get('Ciclos_actuales').value;
      entity.Horas_iniciales = this.AeronaveForm.get('Horas_iniciales').value;
      entity.Horas_actuales = this.AeronaveForm.get('Horas_actuales').value;
      entity.Inicio_de_operaciones = this.AeronaveForm.get('Inicio_de_operaciones').value;

      if (this.model.Matricula != null) {
        await this.AeronaveService.updateString(this.model.Matricula, entity).toPromise();

        await this.savedetalle_de_imagenes_de_aeronave(this.model.Matricula);
        await this.saveDetalle_Motores_de_Aeronave(this.model.Matricula);
        await this.saveDetalle_Seguros_Asociados_a(this.model.Matricula);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Matricula.toString());
        this.spinner.hide('loading');
        return this.model.Matricula;
      } else {
        entity.Matricula = this.AeronaveForm.get('Matricula').value;
        await (this.AeronaveService.insert(entity).toPromise().then(async id => {
          await this.savedetalle_de_imagenes_de_aeronave(id.toString());
          await this.saveDetalle_Motores_de_Aeronave(id.toString());
          await this.saveDetalle_Seguros_Asociados_a(id.toString());

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
    if (this.model.Matricula === '0') {
      this.AeronaveForm.reset();
      this.model = new Aeronave(this.fb);
      this.AeronaveForm = this.model.buildFormGroup();
      this.dataSourceFotografias_de_la_aeronave = new MatTableDataSource<detalle_de_imagenes_de_aeronave>();
      this.Fotografias_de_la_aeronaveData = [];
      this.dataSourceMotores_de_Aeronave = new MatTableDataSource<Detalle_Motores_de_Aeronave>();
      this.Motores_de_AeronaveData = [];
      this.dataSourceSeguros_Asociados = new MatTableDataSource<Detalle_Seguros_Asociados_a>();
      this.Seguros_AsociadosData = [];

    } else {
      this.router.navigate(['views/Aeronave/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Matricula = '0';

  }

  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Aeronave/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Matricula_ExecuteBusinessRules(): void {
    //Matricula_FieldExecuteBusinessRulesEnd
  }
  Modelo_ExecuteBusinessRules(): void {
    //Modelo_FieldExecuteBusinessRulesEnd
  }
  Propietario_ExecuteBusinessRules(): void {

    //INICIA - BRID:6537 - Si el propietario tiene valor asignar requerido a bitácora, de lo contrario no requerido - Autor: Francisco Javier Martínez Urbina - Actualización: 9/29/2021 11:23:06 AM
    if (this.brf.GetValueByControlType(this.AeronaveForm, 'Propietario') == this.brf.TryParseInt('', '')) { this.brf.SetNotRequiredControl(this.AeronaveForm, "Bitacora"); } else { this.brf.SetRequiredControl(this.AeronaveForm, "Bitacora"); }
    //TERMINA - BRID:6537

    //Propietario_FieldExecuteBusinessRulesEnd

  }
  Fabricante_ExecuteBusinessRules(): void {
    //Fabricante_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Serie_ExecuteBusinessRules(): void {
    //Numero_de_Serie_FieldExecuteBusinessRulesEnd
  }
  Cliente_ExecuteBusinessRules(): void {
    //Cliente_FieldExecuteBusinessRulesEnd
  }
  Ano_de_Fabricacion_ExecuteBusinessRules(): void {
    //Ano_de_Fabricacion_FieldExecuteBusinessRulesEnd
  }
  Origen_de_Aeronave_ExecuteBusinessRules(): void {
    //Origen_de_Aeronave_FieldExecuteBusinessRulesEnd
  }
  Propia_ExecuteBusinessRules(): void {
    // this.tabGroup.selectedIndex = 2;
    //INICIA - BRID:2071 - Campos requeridos cuando es propio - Autor: Administrador - Actualización: 3/26/2021 12:23:55 PM
    if (this.brf.GetValueByControlType(this.AeronaveForm, 'Propia') == this.brf.TryParseInt('true', 'true')) { 
      // this.brf.SetRequiredControl(this.AeronaveForm, "Ciclos_iniciales"); 
      // this.brf.SetRequiredControl(this.AeronaveForm, "Horas_iniciales"); 
      // this.brf.SetRequiredControl(this.AeronaveForm, "Inicio_de_operaciones"); 
      // this.brf.SetRequiredControl(this.AeronaveForm, "Bitacora_1"); 
      setTimeout(() => {
        this.brf.applyConditionsToControl(this.AeronaveForm, "Ciclos_iniciales", true);
        this.brf.applyConditionsToControl(this.AeronaveForm, "Horas_iniciales", true);
        this.brf.applyConditionsToControl(this.AeronaveForm, "Inicio_de_operaciones", true);
        this.brf.applyConditionsToControl(this.AeronaveForm, "Bitacora", true);
        this.AeronaveForm.markAllAsTouched();
        this.AeronaveForm.updateValueAndValidity();
      }, 0);
     
    } 
    else { 
      // this.brf.SetNotRequiredControl(this.AeronaveForm, "Ciclos_iniciales");
      //  this.brf.SetNotRequiredControl(this.AeronaveForm, "Horas_iniciales"); 
      //  this.brf.SetNotRequiredControl(this.AeronaveForm, "Inicio_de_operaciones"); 
      //  this.brf.SetNotRequiredControl(this.AeronaveForm, "Bitacora_1"); 
      setTimeout(() => {
        this.brf.applyConditionsToControl(this.AeronaveForm, "Ciclos_iniciales", false, this.operation == 'New', true);
        this.brf.applyConditionsToControl(this.AeronaveForm, "Horas_iniciales", false, this.operation == 'New', true);
        this.brf.applyConditionsToControl(this.AeronaveForm, "Inicio_de_operaciones", false, this.operation == 'New', true);
        this.brf.applyConditionsToControl(this.AeronaveForm, "Bitacora", false);
      }, 0);
      
      
      }
    //TERMINA - BRID:2071

    //Propia_FieldExecuteBusinessRulesEnd

  }
  Estatus_ExecuteBusinessRules(): void {
    //Estatus_FieldExecuteBusinessRulesEnd
  }
  Operaciones_ExecuteBusinessRules(): void {
    //Operaciones_FieldExecuteBusinessRulesEnd
  }
  Mantenimiento_ExecuteBusinessRules(): void {
    //Mantenimiento_FieldExecuteBusinessRulesEnd
  }
  Capacidad_de_pasajeros_ExecuteBusinessRules(): void {
    //Capacidad_de_pasajeros_FieldExecuteBusinessRulesEnd
  }
  Nivel_de_ruido_ExecuteBusinessRules(): void {
    //Nivel_de_ruido_FieldExecuteBusinessRulesEnd
  }
  Turbulencia_ExecuteBusinessRules(): void {
    //Turbulencia_FieldExecuteBusinessRulesEnd
  }
  Equipo_de_navegacion_ExecuteBusinessRules(): void {
    //Equipo_de_navegacion_FieldExecuteBusinessRulesEnd
  }
  UHV_ExecuteBusinessRules(): void {

    //INICIA - BRID:1429 - regla para change UHV - Autor: Administrador - Actualización: 3/10/2021 9:58:31 AM
    if (this.brf.GetValueByControlType(this.AeronaveForm, 'UHV') == this.brf.TryParseInt('true', 'true')) { this.brf.SetValueControl(this.AeronaveForm, "VHF", "false"); this.brf.SetValueControl(this.AeronaveForm, "ELT", "false"); } else { }
    //TERMINA - BRID:1429

    //UHV_FieldExecuteBusinessRulesEnd

  }
  VHF_ExecuteBusinessRules(): void {

    //INICIA - BRID:1432 - regla para VHF change - Autor: Administrador - Actualización: 3/10/2021 10:05:12 AM
    if (this.brf.GetValueByControlType(this.AeronaveForm, 'VHF') == this.brf.TryParseInt('true', 'true')) { this.brf.SetValueControl(this.AeronaveForm, "UHV", "false"); this.brf.SetValueControl(this.AeronaveForm, "ELT", "false"); } else { }
    //TERMINA - BRID:1432

    //VHF_FieldExecuteBusinessRulesEnd

  }
  ELT_ExecuteBusinessRules(): void {

    //INICIA - BRID:1433 - regla para ELT change - Autor: Administrador - Actualización: 3/10/2021 10:06:40 AM
    if (this.brf.GetValueByControlType(this.AeronaveForm, 'ELT') == this.brf.TryParseInt('true', 'true')) { this.brf.SetValueControl(this.AeronaveForm, "UHV", "false"); this.brf.SetValueControl(this.AeronaveForm, "VHF", "false"); } else { }
    //TERMINA - BRID:1433

    //ELT_FieldExecuteBusinessRulesEnd

  }
  Desierto_ExecuteBusinessRules(): void {
    //Desierto_FieldExecuteBusinessRulesEnd
  }
  Polar_ExecuteBusinessRules(): void {
    //Polar_FieldExecuteBusinessRulesEnd
  }
  Selva_ExecuteBusinessRules(): void {
    //Selva_FieldExecuteBusinessRulesEnd
  }
  Maritimo_ExecuteBusinessRules(): void {
    //Maritimo_FieldExecuteBusinessRulesEnd
  }
  Chalecos_salvavidas_ExecuteBusinessRules(): void {
    //Chalecos_salvavidas_FieldExecuteBusinessRulesEnd
  }
  Numero_de_lanchas_salvavidas_ExecuteBusinessRules(): void {
    //Numero_de_lanchas_salvavidas_FieldExecuteBusinessRulesEnd
  }
  Capacidad_ExecuteBusinessRules(): void {
    //Capacidad_FieldExecuteBusinessRulesEnd
  }
  Color_de_la_aeronave_ExecuteBusinessRules(): void {
    //Color_de_la_aeronave_FieldExecuteBusinessRulesEnd
  }
  Color_cubierta_de_los_botes_ExecuteBusinessRules(): void {
    //Color_cubierta_de_los_botes_FieldExecuteBusinessRulesEnd
  }
  Velocidad_ExecuteBusinessRules(): void {
    //Velocidad_FieldExecuteBusinessRulesEnd
  }
  Tipo_de_Ala_ExecuteBusinessRules(): void {
    //Tipo_de_Ala_FieldExecuteBusinessRulesEnd
  }
  UPA_ExecuteBusinessRules(): void {
    //UPA_FieldExecuteBusinessRulesEnd
  }
  UPA_MODELO_ExecuteBusinessRules(): void {
    //UPA_MODELO_FieldExecuteBusinessRulesEnd
  }
  UPA_SERIE_ExecuteBusinessRules(): void {
    //UPA_SERIE_FieldExecuteBusinessRulesEnd
  }
  Ciclos_iniciales_ExecuteBusinessRules(): void {
    //Ciclos_iniciales_FieldExecuteBusinessRulesEnd
  }
  Ciclos_actuales_ExecuteBusinessRules(): void {
    //Ciclos_actuales_FieldExecuteBusinessRulesEnd
  }
  Horas_iniciales_ExecuteBusinessRules(): void {
    //Horas_iniciales_FieldExecuteBusinessRulesEnd
  }
  Horas_actuales_ExecuteBusinessRules(): void {
    //Horas_actuales_FieldExecuteBusinessRulesEnd
  }
  Inicio_de_operaciones_ExecuteBusinessRules(): void {
    //Inicio_de_operaciones_FieldExecuteBusinessRulesEnd
  }
  Bitacora_ExecuteBusinessRules(): void {
    //Bitacora_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:211 - CAMPOS NO REQUERIDOS EN PANTALLA AERONAVE - Autor: Administrador - Actualización: 4/7/2021 12:03:17 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Matricula");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Modelo");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Numero_de_Serie");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Capacidad_de_pasajeros");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Equipo_de_emergencia");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Clave");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Matricula");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Equipo_de_Emergencia");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Equipo_de_Supervivencia");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Clave");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Matricula");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Equipo_de_Supervivencia");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Chalecos_salvavidas");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Numero_de_lanchas_salvavidas");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Capacidad");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Color_de_la_aeronave");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Ciclos_iniciales");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Ciclos_actuales");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Horas_iniciales");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Horas_actuales");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Inicio_de_operaciones");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Bitacora_1");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Bitacora_2");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Bitacora_3");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Proveedor_de_Seguro");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Tipo_de_Seguro");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Numero_de_poliza");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Fecha_de_vigencia_seguro");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Propietario");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Fabricante");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "UPA");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "UPA_MODELO");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "UPA_SERIE");
    }
    //TERMINA - BRID:211


    //INICIA - BRID:1442 - filtrar campos - Autor: Administrador - Actualización: 3/11/2021 9:13:51 AM
    if (this.operation == 'Update') {
      this._SpartanService.SetValueExecuteQuery(this.AeronaveForm, "Uso_de_Aeronave_Catalogo", this.brf.EvaluaQuery("SELECT Clave, Descripcion FROM dbo.Catalogo_Uso_de_Aeronave WHERE Clave IN (SELECT Clave FROM dbo.Uso_de_Aeronave WHERE Aeronave = " + this.model.Matricula + ")", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:1442


    //INICIA - BRID:1450 - Deshabilitar campos informacion adicional al editar - Autor: Administrador - Actualización: 3/11/2021 6:39:02 PM
    if (this.operation == 'Update') {
      // this.brf.SetEnabledControl(this.AeronaveForm, 'Ciclos_iniciales', 0);
      // this.brf.SetEnabledControl(this.AeronaveForm, 'Ciclos_actuales', 0);
      // this.brf.SetEnabledControl(this.AeronaveForm, 'Horas_iniciales', 0);
      // this.brf.SetEnabledControl(this.AeronaveForm, 'Horas_actuales', 0);
      // this.brf.SetEnabledControl(this.AeronaveForm, 'Inicio_de_operaciones', 0);
      // this.brf.SetEnabledControl(this.AeronaveForm, 'Bitacora_1', 0);
      this.brf.applyConditionsToControl(this.AeronaveForm, "Ciclos_iniciales", false, false, true);
      this.brf.applyConditionsToControl(this.AeronaveForm, "Ciclos_actuales", false, false, true);
      this.brf.applyConditionsToControl(this.AeronaveForm, "Horas_iniciales", false, false, true);
      this.brf.applyConditionsToControl(this.AeronaveForm, "Horas_actuales", false, false, true);
      this.brf.applyConditionsToControl(this.AeronaveForm, "Inicio_de_operaciones", false, false, true);
      this.brf.applyConditionsToControl(this.AeronaveForm, "Bitacora", false, false, true);
    }
    //TERMINA - BRID:1450


    //INICIA - BRID:2075 - Campos requeridos cuando aeronave es propia checkbox - Autor: Administrador - Actualización: 4/9/2021 12:59:36 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.GetValueByControlType(this.AeronaveForm, 'Propia') == this.brf.TryParseInt('true', 'true')) {
        this.brf.SetRequiredControl(this.AeronaveForm, "Ciclos_iniciales");
        this.brf.SetRequiredControl(this.AeronaveForm, "Horas_iniciales");
        this.brf.SetRequiredControl(this.AeronaveForm, "Inicio_de_operaciones");
        this.brf.SetRequiredControl(this.AeronaveForm, "Bitacora_1");
      } else {
        this.brf.SetNotRequiredControl(this.AeronaveForm, "Ciclos_iniciales");
        this.brf.SetNotRequiredControl(this.AeronaveForm, "Horas_iniciales");
        this.brf.SetNotRequiredControl(this.AeronaveForm, "Inicio_de_operaciones");
        this.brf.SetNotRequiredControl(this.AeronaveForm, "Bitacora_1");
      }
    }
    //TERMINA - BRID:2075


    //INICIA - BRID:2628 - campos no requerido aeronave - Autor: Administrador - Actualización: 4/7/2021 10:34:44 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Ano_de_Fabricacion");
      this.brf.SetNotRequiredControl(this.AeronaveForm, "Fotografia");
    }
    //TERMINA - BRID:2628


    //INICIA - BRID:2686 - agregar subtítulo "Equipo de Emergencia" - Autor: Administrador - Actualización: 4/14/2021 3:24:08 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2686


    //INICIA - BRID:2702 - acomodo de campos aeronave1.1 - Autor: Administrador - Actualización: 5/13/2021 2:29:14 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2702


    //INICIA - BRID:2703 - acomodo de campos aeronave1.1	equipamiento de aeronave - Autor: Administrador - Actualización: 4/14/2021 3:18:54 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2703


    //INICIA - BRID:2704 - acomodo de campos aeronave1.1	Información Adicional	 - Autor: Administrador - Actualización: 4/14/2021 1:54:09 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2704


    //INICIA - BRID:2767 - campo uso de aeronave, acomodar campos y agregar subtitulo - Autor: Administrador - Actualización: 4/19/2021 3:10:57 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2767


    //INICIA - BRID:5568 - Campos  ciclos actuales y horas actuales deben estar deshabilitados siempre - Autor: Lizeth Villa - Actualización: 8/31/2021 6:34:07 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.AeronaveForm, 'Ciclos_actuales', 0);
      this.brf.SetEnabledControl(this.AeronaveForm, 'Horas_actuales', 0);
    }
    //TERMINA - BRID:5568


    //INICIA - BRID:6140 - Deshabilitar horas iniciales - Autor: ANgel Acuña - Actualización: 9/10/2021 5:50:28 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.AeronaveForm, 'Horas_iniciales', 0);
    }
    //TERMINA - BRID:6140


    //INICIA - BRID:6536 - Al abrir la pantalla en nuevo y modificación si el campo Propietario esta vacío, quitarle el requerido al campo Bitácora. De lo contrario hacerlo requerido - Autor: Francisco Javier Martínez Urbina - Actualización: 9/29/2021 11:18:15 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      if (this.brf.GetValueByControlType(this.AeronaveForm, 'Propietario') == this.brf.TryParseInt('', '')) {
        this.brf.applyConditionsToControl(this.AeronaveForm, "Bitacora", false);
      }
      else {
        this.brf.applyConditionsToControl(this.AeronaveForm, "Bitacora", true);
      }
    }
    //TERMINA - BRID:6536


    //INICIA - BRID:7091 - Asignar valor al campo de modelo (Manual) - Autor: Eliud Hernandez - Actualización: 10/11/2021 11:28:31 AM
    if (this.operation == 'Update') {
      //this.brf.SetValueFromQuery(this.AeronaveForm,"Modelo",this.brf.EvaluaQuery("select clave,Descripcion from modelos where clave = ( select Modelo from Aeronave where Folio = " + this.AeronaveForm.get('Modelo'), 1, "ABC123"),1,"ABC123");
    }
    //TERMINA - BRID:7091

    //rulesOnInit_ExecuteBusinessRulesEnd














  }

  rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit
    //rulesAfterSave_ExecuteBusinessRulesEnd
  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:5820 - En nuevo, antes de guardar, si existe otro registro con el mismo número de matrícula y número de serie, mostrar mensaje "Ya existe una aeronave registrada con el mismo número de matrícula y número de serie, favor de revisar" y no dejar guardar. - Autor: Lizeth Villa - Actualización: 9/6/2021 11:41:55 AM
    if (this.operation == 'New') {
      console.log("Entrando");
      if (this.brf.EvaluaQuery("select matricula from Aeronave where matricula = 'FLD[Matricula]' and Numero_de_Serie = FLD[Matricula] '", 1, 'ABC123') != this.brf.TryParseInt('', '')) {
        this.brf.ShowMessage("Ya existe una aeronave registrada con el mismo número de matrícula y número de serie, favor de revisar");

        result = false;
      } else { }
    }
    //TERMINA - BRID:5820


    //INICIA - BRID:5838 - Validación antes que de guardar si ya existe un matricula igual pero con distinto numero de serie y que esta este activa - Autor: Lizeth Villa - Actualización: 9/6/2021 11:43:50 AM
    if (this.operation == 'New') {
      if (this.brf.EvaluaQuery("select  COUNT(*) from Aeronave where matricula = GLOBAL[keyvalueinserted] and Estatus = 2 and Numero_de_Serie != 'FLD[Numero_de_Serie ]'", 1, 'ABC123') > this.brf.TryParseInt('0', '0')) {
        this.brf.ShowMessage(" Se ha encontrado otra aeronave activa con la misma matricula, al registrar esta aeronave desactivara la anterior, ¿está seguro de continuar?");

        result = false;
      } else { }
    }
    //TERMINA - BRID:5838


    //INICIA - BRID:5881 - Validación antes que de guardar si ya existe un matricula igual pero con distinto numero de serie y que esta este INACTIVA ejecutar SP uspGeneraVersionamientoAeronave con ajuste manual - Autor: Lizeth Villa - Actualización: 9/7/2021 3:19:29 PM
    if (this.operation == 'New') {
      if (this.brf.EvaluaQuery("select  COUNT(*) from Aeronave where matricula = '" + this.AeronaveForm.get('Matricula').value + "' and Estatus = 2  and Numero_de_Serie != 'FLD[Numero_de_Serie]'", 1, 'ABC123') > this.brf.TryParseInt('0', '0')) { this.brf.EvaluaQuery(" exec uspGeneraVersionamientoAeronave FLD[Matricula]", 1, "ABC123"); } else { }
    }
    //TERMINA - BRID:5881

    //rulesBeforeSave_ExecuteBusinessRulesEnd

    if(this.isFotografiasOpen) {
      alert("Has dejado un renglón sin guardar en Fotografias");
      result = false;
    }

    return result;
  }

  //Fin de reglas

}
