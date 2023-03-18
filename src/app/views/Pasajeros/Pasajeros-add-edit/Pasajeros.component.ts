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
import { PasajerosService } from 'src/app/api-services/Pasajeros.service';
import { Pasajeros } from 'src/app/models/Pasajeros';
import { PaisService } from 'src/app/api-services/Pais.service';
import { Pais } from 'src/app/models/Pais';
import { GeneroService } from 'src/app/api-services/Genero.service';
import { Genero } from 'src/app/models/Genero';
import { RespuestaService } from 'src/app/api-services/Respuesta.service';
import { Respuesta } from 'src/app/models/Respuesta';
import { Estatus_AeronaveService } from 'src/app/api-services/Estatus_Aeronave.service';
import { Estatus_Aeronave } from 'src/app/models/Estatus_Aeronave';

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
import { MAT_DATE_LOCALE, DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { MomentDateAdapter, MAT_MOMENT_DATE_ADAPTER_OPTIONS, MAT_MOMENT_DATE_FORMATS } from '@angular/material-moment-adapter';
import * as moment from 'moment';

@Component({
  selector: 'app-Pasajeros',
  templateUrl: './Pasajeros.component.html',
  styleUrls: ['./Pasajeros.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),    
  ],
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE, MAT_MOMENT_DATE_ADAPTER_OPTIONS],
    },
    { provide: MAT_DATE_FORMATS, useValue: MAT_MOMENT_DATE_FORMATS }]
})
export class PasajerosComponent implements OnInit, AfterViewInit {

  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  PasajerosForm: FormGroup;
  public Editor = ClassicEditor;
  model: Pasajeros;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  optionsNacionalidad_1: Observable<Pais[]>;
  hasOptionsNacionalidad_1: boolean;
  isLoadingNacionalidad_1: boolean;
  optionsNacionalidad_2: Observable<Pais[]>;
  hasOptionsNacionalidad_2: boolean;
  isLoadingNacionalidad_2: boolean;
  public varGenero: Genero[] = [];
  public varRespuesta: Respuesta[] = [];
  public varEstatus_Aeronave: Estatus_Aeronave[] = [];
  optionsPais: Observable<Pais[]>;
  hasOptionsPais: boolean;
  isLoadingPais: boolean;
  Cargar_Pasaporte_1SelectedFile: File;
  Cargar_Pasaporte_1Name = '';
  fileCargar_Pasaporte_1: SpartanFile;
  optionsPais_1: Observable<Pais[]>;
  hasOptionsPais_1: boolean;
  isLoadingPais_1: boolean;
  Cargar_Pasaporte_2SelectedFile: File;
  Cargar_Pasaporte_2Name = '';
  fileCargar_Pasaporte_2: SpartanFile;
  optionsPais_2: Observable<Pais[]>;
  hasOptionsPais_2: boolean;
  isLoadingPais_2: boolean;
  Cargar_Visa_1SelectedFile: File;
  Cargar_Visa_1Name = '';
  fileCargar_Visa_1: SpartanFile;
  optionsPais_4: Observable<Pais[]>;
  hasOptionsPais_4: boolean;
  isLoadingPais_4: boolean;
  Cargar_Visa_2SelectedFile: File;
  Cargar_Visa_2Name = '';
  fileCargar_Visa_2: SpartanFile;

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
  emailEnpty: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private PasajerosService: PasajerosService,
    private PaisService: PaisService,
    private GeneroService: GeneroService,
    private RespuestaService: RespuestaService,
    private Estatus_AeronaveService: Estatus_AeronaveService,

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
    this.model = new Pasajeros(this.fb);
    this.PasajerosForm = this.model.buildFormGroup();

    this.PasajerosForm.get('Clave').disable();
    this.PasajerosForm.get('Clave').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
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

          this.PasajerosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Pasajeros)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.PasajerosForm, 'Nacionalidad_1', [CustomValidators.autocompleteObjectValidatorNoRquired()]);
    this.brf.updateValidatorsToControl(this.PasajerosForm, 'Nacionalidad_2', [CustomValidators.autocompleteObjectValidatorNoRquired()]);
    this.brf.updateValidatorsToControl(this.PasajerosForm, 'Pais', [CustomValidators.autocompleteObjectValidatorNoRquired()]);
    this.brf.updateValidatorsToControl(this.PasajerosForm, 'Pais_1', [CustomValidators.autocompleteObjectValidatorNoRquired()]);
    this.brf.updateValidatorsToControl(this.PasajerosForm, 'Pais_2', [CustomValidators.autocompleteObjectValidatorNoRquired()]);
    this.brf.updateValidatorsToControl(this.PasajerosForm, 'Pais_4', [CustomValidators.autocompleteObjectValidatorNoRquired()]);



    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.PasajerosService.listaSelAll(0, 1, 'Pasajeros.Clave=' + id).toPromise();
    if (result.Pasajeross.length > 0) {

      this.model.fromObject(result.Pasajeross[0]);
      if (result.Pasajeross[0].Nacionalidad_1_Pais.Clave) {
        this.PasajerosForm.get('Nacionalidad_1').setValue(
          result.Pasajeross[0].Nacionalidad_1_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }
      if (result.Pasajeross[0].Nacionalidad_2_Pais.Clave) {
        this.PasajerosForm.get('Nacionalidad_2').setValue(
          result.Pasajeross[0].Nacionalidad_2_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }
      if (result.Pasajeross[0].Pais_Pais.Clave) {
        this.PasajerosForm.get('Pais').setValue(
          result.Pasajeross[0].Pais_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }

      if (this.model.Cargar_Pasaporte_1 !== null && this.model.Cargar_Pasaporte_1 !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Pasaporte_1).subscribe(f => {
          this.fileCargar_Pasaporte_1 = f;
          this.Cargar_Pasaporte_1Name = f.Description;
        });
      }
      if (result.Pasajeross[0].Pais_1_Pais.Clave) {
        this.PasajerosForm.get('Pais_1').setValue(
          result.Pasajeross[0].Pais_1_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }
      if (this.model.Cargar_Pasaporte_2 !== null && this.model.Cargar_Pasaporte_2 !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Pasaporte_2).subscribe(f => {
          this.fileCargar_Pasaporte_2 = f;
          this.Cargar_Pasaporte_2Name = f.Description;
        });
      }
      if (result.Pasajeross[0].Pais_2_Pais.Clave) {
        this.PasajerosForm.get('Pais_2').setValue(
          result.Pasajeross[0].Pais_2_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }
      if (this.model.Cargar_Visa_1 !== null && this.model.Cargar_Visa_1 !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Visa_1).subscribe(f => {
          this.fileCargar_Visa_1 = f;
          this.Cargar_Visa_1Name = f.Description;
        });
      }
      if (result.Pasajeross[0].Pais_4_Pais.Clave) {
        this.PasajerosForm.get('Pais_4').setValue(
          result.Pasajeross[0].Pais_4_Pais,
          { onlySelf: false, emitEvent: true }
        );
      }
      if (this.model.Cargar_Visa_2 !== null && this.model.Cargar_Visa_2 !== undefined) {
        this.spartanFileService.getById(this.model.Cargar_Visa_2).subscribe(f => {
          this.fileCargar_Visa_2 = f;
          this.Cargar_Visa_2Name = f.Description;
        });
      }

      this.PasajerosForm.markAllAsTouched();
      this.PasajerosForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Clave = +params.get('id');

        if (this.model.Clave) {
          this.operation = !this.PasajerosForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.GeneroService.getAll());
    observablesArray.push(this.RespuestaService.getAll());
    observablesArray.push(this.Estatus_AeronaveService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varGenero, varRespuesta, varEstatus_Aeronave]) => {
          this.varGenero = varGenero;
          this.varRespuesta = varRespuesta;
          this.varEstatus_Aeronave = varEstatus_Aeronave;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.PasajerosForm.get('Nacionalidad_1').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNacionalidad_1 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PaisService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PaisService.listaSelAll(0, 20, '');
          return this.PaisService.listaSelAll(0, 20,
            "Pais.Nacionalidad like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PaisService.listaSelAll(0, 20,
          "Pais.Nacionalidad like '%" + value.Nacionalidad.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNacionalidad_1 = false;
      this.hasOptionsNacionalidad_1 = result?.Paiss?.length > 0;
      //this.PasajerosForm.get('Nacionalidad_1').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      this.optionsNacionalidad_1 = of(result?.Paiss);
    }, error => {
      this.isLoadingNacionalidad_1 = false;
      this.hasOptionsNacionalidad_1 = false;
      this.optionsNacionalidad_1 = of([]);
    });
    this.PasajerosForm.get('Nacionalidad_2').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNacionalidad_2 = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.PaisService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PaisService.listaSelAll(0, 20, '');
          return this.PaisService.listaSelAll(0, 20,
            "Pais.Nacionalidad like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.PaisService.listaSelAll(0, 20,
          "Pais.Nacionalidad like '%" + value.Nacionalidad.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNacionalidad_2 = false;
      this.hasOptionsNacionalidad_2 = result?.Paiss?.length > 0;
      //this.PasajerosForm.get('Nacionalidad_2').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      this.optionsNacionalidad_2 = of(result?.Paiss);
    }, error => {
      this.isLoadingNacionalidad_2 = false;
      this.hasOptionsNacionalidad_2 = false;
      this.optionsNacionalidad_2 = of([]);
    });
    this.PasajerosForm.get('Pais').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais = true),
      distinctUntilChanged(),
      switchMap(value => {
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
      // this.PasajerosForm.get('Pais').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      this.optionsPais = of(result?.Paiss);
    }, error => {
      this.isLoadingPais = false;
      this.hasOptionsPais = false;
      this.optionsPais = of([]);
    });
    this.PasajerosForm.get('Pais_1').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_1 = true),
      distinctUntilChanged(),
      switchMap(value => {
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
      this.isLoadingPais_1 = false;
      this.hasOptionsPais_1 = result?.Paiss?.length > 0;
      //this.PasajerosForm.get('Pais_1').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      this.optionsPais_1 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_1 = false;
      this.hasOptionsPais_1 = false;
      this.optionsPais_1 = of([]);
    });
    this.PasajerosForm.get('Pais_2').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_2 = true),
      distinctUntilChanged(),
      switchMap(value => {
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
      this.isLoadingPais_2 = false;
      this.hasOptionsPais_2 = result?.Paiss?.length > 0;
      //this.PasajerosForm.get('Pais_2').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      this.optionsPais_2 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_2 = false;
      this.hasOptionsPais_2 = false;
      this.optionsPais_2 = of([]);
    });
    this.PasajerosForm.get('Pais_4').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPais_4 = true),
      distinctUntilChanged(),
      switchMap(value => {
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
      this.isLoadingPais_4 = false;
      this.hasOptionsPais_4 = result?.Paiss?.length > 0;
      //this.PasajerosForm.get('Pais_4').setValue(result?.Paiss[0], { onlySelf: true, emitEvent: false });
      this.optionsPais_4 = of(result?.Paiss);
    }, error => {
      this.isLoadingPais_4 = false;
      this.hasOptionsPais_4 = false;
      this.optionsPais_4 = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Genero': {
        this.GeneroService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varGenero = x.Generos;
        });
        break;
      }
      case 'Pertenece_al_grupo': {
        this.RespuestaService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varRespuesta = x.Respuestas;
        });
        break;
      }
      case 'Activo': {
        this.Estatus_AeronaveService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_Aeronave = x.Estatus_Aeronaves;
        });
        break;
      }

      default: {
        break;
      }
    }
  }

  displayFnNacionalidad_1(option: Pais) {
    return option?.Nacionalidad;
  }
  displayFnNacionalidad_2(option: Pais) {
    return option?.Nacionalidad;
  }
  displayFnPais(option: Pais) {
    return option?.Nombre;
  }
  displayFnPais_1(option: Pais) {
    return option?.Nombre;
  }
  displayFnPais_2(option: Pais) {
    return option?.Nombre;
  }
  displayFnPais_4(option: Pais) {
    return option?.Nombre;
  }

  async saveCargar_Pasaporte_1(): Promise<number> {
    if (this.PasajerosForm.controls.Cargar_Pasaporte_1File.valid
      && this.PasajerosForm.controls.Cargar_Pasaporte_1File.dirty) {
      const Cargar_Pasaporte_1 = this.PasajerosForm.controls.Cargar_Pasaporte_1File.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Pasaporte_1);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Pasaporte_1.name,
        Date_Time: Cargar_Pasaporte_1.lastModifiedDate,
        File_Size: Cargar_Pasaporte_1.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Pasaporte_1 > 0 ? this.model.Cargar_Pasaporte_1 : 0;
    }
  }

  Cargar_Pasaporte_1Url() {
    if (this.fileCargar_Pasaporte_1)
      return this.spartanFileService.url(this.fileCargar_Pasaporte_1.File_Id.toString(), this.fileCargar_Pasaporte_1.Description);
    return '#';
  }

  getCargar_Pasaporte_1() {
    this.helperService.dowloadFile(this.fileCargar_Pasaporte_1.base64, this.Cargar_Pasaporte_1Name);
  }

  removeCargar_Pasaporte_1() {
    this.Cargar_Pasaporte_1Name = '';
    this.model.Cargar_Pasaporte_1 = 0;
  }
  async saveCargar_Pasaporte_2(): Promise<number> {
    if (this.PasajerosForm.controls.Cargar_Pasaporte_2File.valid
      && this.PasajerosForm.controls.Cargar_Pasaporte_2File.dirty) {
      const Cargar_Pasaporte_2 = this.PasajerosForm.controls.Cargar_Pasaporte_2File.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Pasaporte_2);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Pasaporte_2.name,
        Date_Time: Cargar_Pasaporte_2.lastModifiedDate,
        File_Size: Cargar_Pasaporte_2.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Pasaporte_2 > 0 ? this.model.Cargar_Pasaporte_2 : 0;
    }
  }

  Cargar_Pasaporte_2Url() {
    if (this.fileCargar_Pasaporte_2)
      return this.spartanFileService.url(this.fileCargar_Pasaporte_2.File_Id.toString(), this.fileCargar_Pasaporte_2.Description);
    return '#';
  }

  getCargar_Pasaporte_2() {
    this.helperService.dowloadFile(this.fileCargar_Pasaporte_2.base64, this.Cargar_Pasaporte_2Name);
  }

  removeCargar_Pasaporte_2() {
    this.Cargar_Pasaporte_2Name = '';
    this.model.Cargar_Pasaporte_2 = 0;
  }
  async saveCargar_Visa_1(): Promise<number> {
    if (this.PasajerosForm.controls.Cargar_Visa_1File.valid
      && this.PasajerosForm.controls.Cargar_Visa_1File.dirty) {
      const Cargar_Visa_1 = this.PasajerosForm.controls.Cargar_Visa_1File.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Visa_1);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Visa_1.name,
        Date_Time: Cargar_Visa_1.lastModifiedDate,
        File_Size: Cargar_Visa_1.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Visa_1 > 0 ? this.model.Cargar_Visa_1 : 0;
    }
  }

  Cargar_Visa_1Url() {
    if (this.fileCargar_Visa_1)
      return this.spartanFileService.url(this.fileCargar_Visa_1.File_Id.toString(), this.fileCargar_Visa_1.Description);
    return '#';
  }

  getCargar_Visa_1() {
    this.helperService.dowloadFile(this.fileCargar_Visa_1.base64, this.Cargar_Visa_1Name);
  }

  removeCargar_Visa_1() {
    this.Cargar_Visa_1Name = '';
    this.model.Cargar_Visa_1 = 0;
  }
  async saveCargar_Visa_2(): Promise<number> {
    if (this.PasajerosForm.controls.Cargar_Visa_2File.valid
      && this.PasajerosForm.controls.Cargar_Visa_2File.dirty) {
      const Cargar_Visa_2 = this.PasajerosForm.controls.Cargar_Visa_2File.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Cargar_Visa_2);
      const spartanFile = {
        File: byteArray,
        Description: Cargar_Visa_2.name,
        Date_Time: Cargar_Visa_2.lastModifiedDate,
        File_Size: Cargar_Visa_2.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Cargar_Visa_2 > 0 ? this.model.Cargar_Visa_2 : 0;
    }
  }

  Cargar_Visa_2Url() {
    if (this.fileCargar_Visa_2)
      return this.spartanFileService.url(this.fileCargar_Visa_2.File_Id.toString(), this.fileCargar_Visa_2.Description);
    return '#';
  }

  getCargar_Visa_2() {
    this.helperService.dowloadFile(this.fileCargar_Visa_2.base64, this.Cargar_Visa_2Name);
  }

  removeCargar_Visa_2() {
    this.Cargar_Visa_2Name = '';
    this.model.Cargar_Visa_2 = 0;
  }

  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.PasajerosForm.value;
      entity.Clave = this.model.Clave;
      if (this.PasajerosForm.get('Nacionalidad_1').value) entity.Nacionalidad_1 = this.PasajerosForm.get('Nacionalidad_1').value.Clave;
      if (this.PasajerosForm.get('Nacionalidad_2').value) entity.Nacionalidad_2 = this.PasajerosForm.get('Nacionalidad_2').value.Clave;
      if (this.PasajerosForm.get('Pais').value) entity.Pais = this.PasajerosForm.get('Pais').value.Clave;
      if (this.PasajerosForm.get('Pais_1').value) entity.Pais_1 = this.PasajerosForm.get('Pais_1').value.Clave;
      if (this.PasajerosForm.get('Pais_2').value) entity.Pais_2 = this.PasajerosForm.get('Pais_2').value.Clave;
      if (this.PasajerosForm.get('Pais_4').value) entity.Pais_4 = this.PasajerosForm.get('Pais_4').value.Clave;
      entity.Edad = this.PasajerosForm.get('Edad').value;
      entity.Nombre_completo = this.PasajerosForm.get('Nombre_completo').value;


      const FolioCargar_Pasaporte_1 = await this.saveCargar_Pasaporte_1();
      entity.Cargar_Pasaporte_1 = FolioCargar_Pasaporte_1 > 0 ? FolioCargar_Pasaporte_1 : null;
      const FolioCargar_Pasaporte_2 = await this.saveCargar_Pasaporte_2();
      entity.Cargar_Pasaporte_2 = FolioCargar_Pasaporte_2 > 0 ? FolioCargar_Pasaporte_2 : null;
      const FolioCargar_Visa_1 = await this.saveCargar_Visa_1();
      entity.Cargar_Visa_1 = FolioCargar_Visa_1 > 0 ? FolioCargar_Visa_1 : null;
      const FolioCargar_Visa_2 = await this.saveCargar_Visa_2();
      entity.Cargar_Visa_2 = FolioCargar_Visa_2 > 0 ? FolioCargar_Visa_2 : null;

      if (this.model.Clave > 0) {
        await this.PasajerosService.update(this.model.Clave, entity).toPromise();


        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Clave.toString());
        this.spinner.hide('loading');
        return this.model.Clave;
      } else {
        await (this.PasajerosService.insert(entity).toPromise().then(async id => {

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
    if (this.model.Clave === 0) {
      this.PasajerosForm.reset();
      this.model = new Pasajeros(this.fb);
      this.PasajerosForm = this.model.buildFormGroup();

    } else {
      this.router.navigate(['views/Pasajeros/add']);
    }
  }

  async saveAndCopy() {
    await this.saveData();
    this.model.Clave = 0;

  }

  cancel() {
    this.goToList();
  }

  goToList() {
    this.router.navigate(['/Pasajeros/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  getNombre_completo() {
    let Nombres = this.PasajerosForm.controls['Nombre_s'].value
    let Apellido_paterno = this.PasajerosForm.controls['Apellido_paterno'].value
    let Apellido_materno = this.PasajerosForm.controls['Apellido_materno'].value

    this.PasajerosForm.controls['Nombre_completo'].setValue(`${Nombres} ${Apellido_paterno} ${Apellido_materno}`)

  }

  validateEmail() {
    if (this.PasajerosForm.get('Correo_electronico').invalid) {
      let email = this.PasajerosForm.get('Correo_electronico').value;
      this.emailEnpty = email.length > 0;
      //this.Creacion_de_UsuariosForm.get('Correo_electronico').setValue("");
    }
  }

  // calculateAge() {
  //   let hoy = new Date()
  //   let fechaNacimiento = new Date(this.PasajerosForm.get('Fecha_de_nacimiento').value);

  //   let edad = hoy.getFullYear() - fechaNacimiento.getFullYear()
  //   let diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth()
  //   if (
  //     diferenciaMeses < 0 ||
  //     (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())
  //   ) {
  //     edad--
  //   }
  //   this.PasajerosForm.get('Edad').setValue(edad);
  //   console.log(edad);
  // }

  
  calcularAñosMes(f) {
    const fecha = moment(f);
    const fechaActual  = moment(this.today)
    let años = fechaActual.diff(fecha, "years")
    let meses = Math.trunc(((fechaActual.diff(fecha, "years",true)-años)+0.0001)*12)
    if(meses == 12){
      meses = 0;
      años += 1;
    }
  return años;
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
  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Identificador_Alias_ExecuteBusinessRules(): void {
    //Identificador_Alias_FieldExecuteBusinessRulesEnd
  }
  Nombre_s_ExecuteBusinessRules(): void {
    //Nombre_s_FieldExecuteBusinessRulesEnd
    this.getNombre_completo()
  }
  Apellido_paterno_ExecuteBusinessRules(): void {
    //Apellido_paterno_FieldExecuteBusinessRulesEnd
    this.getNombre_completo()
  }
  Apellido_materno_ExecuteBusinessRules(): void {
    //Apellido_materno_FieldExecuteBusinessRulesEnd
    this.getNombre_completo()
  }
  Nombre_completo_ExecuteBusinessRules(): void {
    //Nombre_completo_FieldExecuteBusinessRulesEnd
  }
  Telefono_ExecuteBusinessRules(): void {
    //Telefono_FieldExecuteBusinessRulesEnd
  }
  Celular_ExecuteBusinessRules(): void {
    //Celular_FieldExecuteBusinessRulesEnd
  }
  Correo_electronico_ExecuteBusinessRules(): void {
    //Correo_electronico_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_nacimiento_ExecuteBusinessRules(): void {

    //INICIA - BRID:244 - Asignar edad - Autor: Felipe Rodríguez - Actualización: 2/9/2021 11:43:55 AM

    //this.brf.SetValueFromQuery(this.PasajerosForm,"Edad",this.brf.EvaluaQuery(" 	 DECLARE @date date, @tmpdate date, @years int @LC@@LB@ SELECT @date = convert(date,(convert(varchar(10),'FLD[Fecha_de_nacimiento]',103)),103) @LC@@LB@ SELECT @tmpdate = @date @LC@@LB@ SELECT @years = DATEDIFF(yy, @tmpdate, GETDATE()) - CASE WHEN (MONTH(@date) > MONTH(GETDATE())) OR (MONTH(@date) = MONTH(GETDATE()) AND DAY(@date) > DAY(GETDATE())) @LC@@LB@ THEN 1 @LC@@LB@ ELSE 0 @LC@@LB@ END @LC@@LB@ SELECT @tmpdate = DATEADD(yy, @years, @tmpdate) @LC@@LB@ SELECT @years", 1, "ABC123"),1,"ABC123");
    if (!this.PasajerosForm.controls['Fecha_de_nacimiento'].value) return;
    let fecha = this.PasajerosForm.controls['Fecha_de_nacimiento'].value
    
    
       
    if(fecha.toISOString().includes('+')) {
      this.PasajerosForm.controls['Fecha_de_Emision_Licencia'].setValue('');
      return;
    }else{
      this.PasajerosForm.controls["Edad"].setValue(this.calcularAñosMes(fecha));
    }
    //TERMINA - BRID:244


    //INICIA - BRID:245 - No permitir fecha futura - Autor: Felipe Rodríguez - Actualización: 2/9/2021 11:48:51 AM
    //if (this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),GETDATE(),103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_nacimiento]',103),103))@LC@@LB@ ", 1, 'ABC123') > this.brf.TryParseInt('0', '0')) { this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery("Fecha de nacimiento invalida.", 1, "ABC123"), 1, "ABC123"); } else { }
    //TERMINA - BRID:245

    //Fecha_de_nacimiento_FieldExecuteBusinessRulesEnd


  }
  Edad_ExecuteBusinessRules(): void {
    //Edad_FieldExecuteBusinessRulesEnd
  }
  Nacionalidad_1_ExecuteBusinessRules(): void {
    //Nacionalidad_1_FieldExecuteBusinessRulesEnd
  }
  Nacionalidad_2_ExecuteBusinessRules(): void {
    //Nacionalidad_2_FieldExecuteBusinessRulesEnd
  }
  Genero_ExecuteBusinessRules(): void {
    //Genero_FieldExecuteBusinessRulesEnd
  }
  Pertenece_al_grupo_ExecuteBusinessRules(): void {
    //Pertenece_al_grupo_FieldExecuteBusinessRulesEnd
  }
  Activo_ExecuteBusinessRules(): void {
    //Activo_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Pasaporte_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1562 - si seleccionas un pasaporte, obligatorio la parte del documento  - Autor: Administrador - Actualización: 3/17/2021 5:00:37 PM

    // if(this.PasajerosForm.get('Numero_de_Pasaporte_1').value) { 
    //   this.PasajerosForm.controls.Cargar_Pasaporte_1.errors.required = true
    // } 
    //   else {
    //     this.PasajerosForm.controls.Cargar_Pasaporte_1.errors.required = false;
    //   }
    //TERMINA - BRID:1562

    //Numero_de_Pasaporte_1_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_Emision_Pasaporte_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1600 - Regla para validar fechas de emision y vencimiento pasaporte 1 - Autor: Administrador - Actualización: 3/19/2021 9:55:31 AM
    if(!this.PasajerosForm.controls['Fecha_de_Emision_Pasaporte_1'].value)return;
    let fecha = this.PasajerosForm.controls['Fecha_de_Emision_Pasaporte_1'].value
       
    if(fecha.toISOString().includes('+')) {
      this.PasajerosForm.controls['Fecha_de_Emision_Pasaporte_1'].setValue('');
      return;
    }
    //TERMINA - BRID:1600

    //Fecha_de_Emision_Pasaporte_1_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_pasaporte_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1601 - Regla para validar fechas de emision y vencimiento pasaporte 1.1 - Autor: Administrador - Actualización: 3/19/2021 10:00:19 AM
    if(!this.PasajerosForm.controls['Fecha_de_vencimiento_pasaporte_1'].value)return;
    let fecha = this.PasajerosForm.controls['Fecha_de_vencimiento_pasaporte_1'].value
       
    if(fecha.toISOString().includes('+')) {
      this.PasajerosForm.controls['Fecha_de_vencimiento_pasaporte_1'].setValue('');
      return;
    }
    //TERMINA - BRID:1601

    //Fecha_de_vencimiento_pasaporte_1_FieldExecuteBusinessRulesEnd

  }
  Alerta_de_vencimiento_pasaporte_1_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_pasaporte_1_FieldExecuteBusinessRulesEnd
  }
  Pais_ExecuteBusinessRules(): void {
    //Pais_FieldExecuteBusinessRulesEnd
  }
  Cargar_Pasaporte_1_ExecuteBusinessRules(): void {
    //Cargar_Pasaporte_1_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Pasaporte_2_ExecuteBusinessRules(): void {

    //INICIA - BRID:1563 - al seleccionar pasaporte 2 requerido el campo cargar el documento  - Autor: Administrador - Actualización: 3/17/2021 5:03:14 PM
    //if( this.brf.GetValueByControlType(this.PasajerosForm, 'Numero_de_Pasaporte_2')!=this.brf.TryParseInt('', '') ) { this.brf.SetRequiredControl(this.PasajerosForm, "Cargar_Pasaporte_2");} else { this.brf.SetNotRequiredControl(this.PasajerosForm, "Cargar_Pasaporte_2");}
    //TERMINA - BRID:1563

    //Numero_de_Pasaporte_2_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_Emision_Pasaporte_2_ExecuteBusinessRules(): void {

    //INICIA - BRID:1602 - Regla para validar fechas de emision y vencimiento pasaporte 2 - Autor: Administrador - Actualización: 3/19/2021 10:02:48 AM
    // if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_pasaporte_2]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Pasaporte_2]',105)) begin select 1 END", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage("La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.");
    if(!this.PasajerosForm.controls['Fecha_de_Emision_Pasaporte_2'].value)return;
    let fecha = this.PasajerosForm.controls['Fecha_de_Emision_Pasaporte_2'].value
       
    if(fecha.toISOString().includes('+')) {
      this.PasajerosForm.controls['Fecha_de_Emision_Pasaporte_2'].setValue('');
      return;
    }
    // } else {}
    //TERMINA - BRID:1602

    //Fecha_de_Emision_Pasaporte_2_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_pasaporte_2_ExecuteBusinessRules(): void {

    //INICIA - BRID:1603 - Regla para validar fechas de emision y vencimiento pasaporte 2.1 - Autor: Administrador - Actualización: 3/19/2021 10:04:03 AM
    // if( this.brf.EvaluaQuery("if ((select convert(date, 'FLD[Fecha_de_vencimiento_pasaporte_2]', 105))<= convert(date, 'FLD[Fecha_de_Emision_Pasaporte_2]',105)) begin select 1 END", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { this.brf.ShowMessage(" La fecha de vencimiento no puede ser menor o igual a la fecha de emisión.");
    if(!this.PasajerosForm.controls['Fecha_de_vencimiento_pasaporte_2'].value)return;
    let fecha = this.PasajerosForm.controls['Fecha_de_vencimiento_pasaporte_2'].value
       
    if(fecha.toISOString().includes('+')) {
      this.PasajerosForm.controls['Fecha_de_vencimiento_pasaporte_2'].setValue('');
      return;
    }
    // } else {}
    //TERMINA - BRID:1603

    //Fecha_de_vencimiento_pasaporte_2_FieldExecuteBusinessRulesEnd

  }
  Alerta_de_vencimiento_pasaporte_2_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_pasaporte_2_FieldExecuteBusinessRulesEnd
  }
  Pais_1_ExecuteBusinessRules(): void {
    //Pais_1_FieldExecuteBusinessRulesEnd
  }
  Cargar_Pasaporte_2_ExecuteBusinessRules(): void {
    //Cargar_Pasaporte_2_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Visa_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1565 - al seleccionar numero de visa, obligatorio el campo cargar visa - Autor: Administrador - Actualización: 3/17/2021 5:13:24 PM
    // if( this.brf.GetValueByControlType(this.PasajerosForm, 'Numero_de_Visa_1')!=this.brf.GetValueByControlType(this.PasajerosForm, '') ) { this.brf.SetRequiredControl(this.PasajerosForm, "Cargar_Visa_1");} else { this.brf.SetNotRequiredControl(this.PasajerosForm, "Cargar_Visa_1");}
    // //TERMINA - BRID:1565

    //Numero_de_Visa_1_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_Emision_Visa_1_ExecuteBusinessRules(): void {

    if(!this.PasajerosForm.controls['Fecha_de_Emision_Visa_1'].value)return;
    let fecha = this.PasajerosForm.controls['Fecha_de_Emision_Visa_1'].value
       
    if(fecha.toISOString().includes('+')) {
      this.PasajerosForm.controls['Fecha_de_Emision_Visa_1'].setValue('');
      return;
    }
    //TERMINA - BRID:1604

    //Fecha_de_Emision_Visa_1_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_visa_1_ExecuteBusinessRules(): void {

    //INICIA - BRID:1605 - Regla para validar fechas de emision y vencimiento visa 1.1 - Autor: Administrador - Actualización: 3/19/2021 10:06:00 AM
    if(!this.PasajerosForm.controls['Fecha_de_vencimiento_visa_1'].value)return;
    let fecha = this.PasajerosForm.controls['Fecha_de_vencimiento_visa_1'].value
       
    if(fecha.toISOString().includes('+')) {
      this.PasajerosForm.controls['Fecha_de_vencimiento_visa_1'].setValue('');
      return;
    }
    //TERMINA - BRID:1605

    //Fecha_de_vencimiento_visa_1_FieldExecuteBusinessRulesEnd

  }
  Alerta_de_vencimiento_Visa_1_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_Visa_1_FieldExecuteBusinessRulesEnd
  }
  Pais_2_ExecuteBusinessRules(): void {
    //Pais_2_FieldExecuteBusinessRulesEnd
  }
  Cargar_Visa_1_ExecuteBusinessRules(): void {
    //Cargar_Visa_1_FieldExecuteBusinessRulesEnd
  }
  Numero_de_Visa_2_ExecuteBusinessRules(): void {

    // //INICIA - BRID:1566 - al seleccionar visa 2,  - Autor: Administrador - Actualización: 3/17/2021 5:31:44 PM
    // if( this.brf.GetValueByControlType(this.PasajerosForm, 'Numero_de_Visa_2')!=this.brf.TryParseInt('', '') ) { this.brf.SetRequiredControl(this.PasajerosForm, "Cargar_Visa_2");} else { this.brf.SetNotRequiredControl(this.PasajerosForm, "Cargar_Visa_2");}
    // //TERMINA - BRID:1566

    //Numero_de_Visa_2_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_Emision_Visa_2_ExecuteBusinessRules(): void {

    //INICIA - BRID:1606 - Regla para validar fechas de emision y vencimiento visa 2 - Autor: Administrador - Actualización: 3/19/2021 10:06:59 AM
    if(!this.PasajerosForm.controls['Fecha_de_Emision_Visa_2'].value)return;
    let fecha = this.PasajerosForm.controls['Fecha_de_Emision_Visa_2'].value
       
    if(fecha.toISOString().includes('+')) {
      this.PasajerosForm.controls['Fecha_de_Emision_Visa_2'].setValue('');
      return;
    }
    //TERMINA - BRID:1606

    //Fecha_de_Emision_Visa_2_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_vencimiento_visa_2_ExecuteBusinessRules(): void {

    //INICIA - BRID:1607 - Regla para validar fechas de emision y vencimiento visa 2.1 - Autor: Administrador - Actualización: 3/19/2021 10:07:51 AM
    if(!this.PasajerosForm.controls['Fecha_de_vencimiento_visa_2'].value)return;
    let fecha = this.PasajerosForm.controls['Fecha_de_vencimiento_visa_2'].value
       
    if(fecha.toISOString().includes('+')) {
      this.PasajerosForm.controls['Fecha_de_vencimiento_visa_2'].setValue('');
      return;
    }
    //TERMINA - BRID:1607

    //Fecha_de_vencimiento_visa_2_FieldExecuteBusinessRulesEnd

  }
  Alerta_de_vencimiento_visa_2_ExecuteBusinessRules(): void {
    //Alerta_de_vencimiento_visa_2_FieldExecuteBusinessRulesEnd
  }
  Pais_4_ExecuteBusinessRules(): void {
    //Pais_4_FieldExecuteBusinessRulesEnd
  }
  Cargar_Visa_2_ExecuteBusinessRules(): void {
    //Cargar_Visa_2_FieldExecuteBusinessRulesEnd
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

    //INICIA - BRID:243 - Deshabilitar nombre completo y edad en pasajeros - Autor: Felipe Rodríguez - Actualización: 2/9/2021 11:40:26 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      // this.brf.SetNotRequiredControl(this.PasajerosForm, "Nombre_completo"); this.brf.SetEnabledControl(this.PasajerosForm, 'Edad', 0); this.brf.SetNotRequiredControl(this.PasajerosForm, "Edad");
      this.brf.SetEnabledControl(this.PasajerosForm, 'Nombre_completo', 0);
      this.brf.SetEnabledControl(this.PasajerosForm, 'Edad', 0);
    }
    //TERMINA - BRID:243


    //INICIA - BRID:592 - Regla para quitar requerido los campos de nacionalidad 1 y 2 - Autor: Administrador - Actualización: 3/3/2021 1:04:12 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //this.brf.SetNotRequiredControl(this.PasajerosForm, "Nacionalidad_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Nacionalidad_2");
    }
    //TERMINA - BRID:592


    //INICIA - BRID:1448 - Quitar requeridos en pestaña documentos - Autor: Administrador - Actualización: 3/11/2021 4:54:32 PM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      //this.brf.SetNotRequiredControl(this.PasajerosForm, "Numero_de_Pasaporte_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Fecha_de_vencimiento_pasaporte_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Alerta_de_vencimiento_pasaporte_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Cargar_Pasaporte_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Numero_de_Pasaporte_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Fecha_de_vencimiento_pasaporte_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Alerta_de_vencimiento_pasaporte_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Cargar_Pasaporte_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Pais_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Numero_de_Visa_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Fecha_de_vencimiento_visa_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Cargar_Visa_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Pais_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Numero_de_Visa_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Fecha_de_vencimiento_visa_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Alerta_de_vencimiento_visa_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Cargar_Visa_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Fecha_de_Emision_Pasaporte_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Fecha_de_Emision_Pasaporte_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Fecha_de_Emision_Visa_1"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Fecha_de_Emision_Visa_2"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Pais"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Pais_4"); this.brf.SetNotRequiredControl(this.PasajerosForm, "Alerta_de_vencimiento_Visa_1");
    }
    //TERMINA - BRID:1448


    //INICIA - BRID:2697 - acomodo de campos pasajeros1.1. - Autor: Administrador - Actualización: 4/14/2021 11:40:25 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2697


    //INICIA - BRID:2699 - acomodo de campos pasajeros documentos1.1.1 - Autor: Administrador - Actualización: 4/14/2021 11:23:16 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2699


    //INICIA - BRID:2701 - separar campos  - Autor: Administrador - Actualización: 4/19/2021 9:26:11 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:2701

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
