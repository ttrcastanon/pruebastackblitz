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
import { Control_de_Calibracion_de_Equipo_y_HerramientaService } from 'src/app/api-services/Control_de_Calibracion_de_Equipo_y_Herramienta.service';
import { Control_de_Calibracion_de_Equipo_y_Herramienta } from 'src/app/models/Control_de_Calibracion_de_Equipo_y_Herramienta';
import { HerramientasService } from 'src/app/api-services/Herramientas.service';
import { Herramientas } from 'src/app/models/Herramientas';
import { Estatus_de_CalibracionService } from 'src/app/api-services/Estatus_de_Calibracion.service';
import { Estatus_de_Calibracion } from 'src/app/models/Estatus_de_Calibracion';
import { Detalle_de_Calibracion_por_HerramientaService } from 'src/app/api-services/Detalle_de_Calibracion_por_Herramienta.service';
import { Detalle_de_Calibracion_por_Herramienta } from 'src/app/models/Detalle_de_Calibracion_por_Herramienta';


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
import { element } from 'protractor';

@Component({
  selector: 'app-Control_de_Calibracion_de_Equipo_y_Herramienta',
  templateUrl: './Control_de_Calibracion_de_Equipo_y_Herramienta.component.html',
  styleUrls: ['./Control_de_Calibracion_de_Equipo_y_Herramienta.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Control_de_Calibracion_de_Equipo_y_HerramientaComponent implements OnInit, AfterViewInit {
MRaddHistorico: boolean = false;

	operation: string;
	rowIndex = '';
	nameOfTable = '';
	filterComboEmiter = new Subject<FilterCombo>();
	brf: BusinessRulesFunctions;

	Control_de_Calibracion_de_Equipo_y_HerramientaForm: FormGroup;
	public Editor = ClassicEditor;
	model: Control_de_Calibracion_de_Equipo_y_Herramienta;
	arrayBuffer: string | ArrayBuffer;
	cthis = this;
	optionsNo_de_Codigo: Observable<Herramientas[]>;
	hasOptionsNo_de_Codigo: boolean;
	isLoadingNo_de_Codigo: boolean;
	Certificado_de_CalibracionSelectedFile: File;
	Certificado_de_CalibracionName = '';
	fileCertificado_de_Calibracion: SpartanFile;
	public varEstatus_de_Calibracion: Estatus_de_Calibracion[] = [];
  Certificado_de_Calibracion_Detalle_de_Calibracion_por_Herramienta: string[] = [];



	private dataListConfig: any = null;
	public isLoading = false;
	config: any;
	permisos: ObjectPermission[] = [];
	@ViewChild(MatPaginator) paginator: MatPaginator;
	@ViewChild(MatSort) sort: MatSort;
	@ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
	public collapseAll = true;
  dataSourceHistorico = new MatTableDataSource<Detalle_de_Calibracion_por_Herramienta>();
  HistoricoColumns = [
    { def: 'actions', hide: false },
    { def: 'Fecha_Ultima_Calibracion', hide: false },
    { def: 'Fecha_Proxima_Calibracion', hide: false },
    { def: 'Certificado_de_Calibracion', hide: false },
    { def: 'Manual_del_Usuario', hide: false },
    { def: 'Alcance', hide: false },
    { def: 'Estatus', hide: false },
    { def: 'Notas', hide: false },
	
  ];
  HistoricoData: Detalle_de_Calibracion_por_Herramienta[] = [];
	
	today = new Date;
	consult: boolean = false;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Control_de_Calibracion_de_Equipo_y_HerramientaService: Control_de_Calibracion_de_Equipo_y_HerramientaService,
    private HerramientasService: HerramientasService,
    private Estatus_de_CalibracionService: Estatus_de_CalibracionService,
    private Detalle_de_Calibracion_por_HerramientaService: Detalle_de_Calibracion_por_HerramientaService,


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
    this.model = new Control_de_Calibracion_de_Equipo_y_Herramienta(this.fb);
    this.Control_de_Calibracion_de_Equipo_y_HerramientaForm = this.model.buildFormGroup();
    this.HistoricoItems.removeAt(0);
	
	this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').disable();
    this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }
  
  ngAfterViewInit(): void {
    this.dataSourceHistorico.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.HistoricoColumns.splice(0, 1);
		
          this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Control_de_Calibracion_de_Equipo_y_Herramienta)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No_de_Codigo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	  
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Control_de_Calibracion_de_Equipo_y_HerramientaService.listaSelAll(0, 1, 'Control_de_Calibracion_de_Equipo_y_Herramienta.Folio=' + id).toPromise();
	if (result.Control_de_Calibracion_de_Equipo_y_Herramientas.length > 0) {
        let fHistorico = await this.Detalle_de_Calibracion_por_HerramientaService.listaSelAll(0, 1000,'Control_de_Calibracion_de_Equipo_y_Herramienta.Folio=' + id).toPromise();
            this.HistoricoData = fHistorico.Detalle_de_Calibracion_por_Herramientas;
            this.loadHistorico(fHistorico.Detalle_de_Calibracion_por_Herramientas);
            this.dataSourceHistorico = new MatTableDataSource(fHistorico.Detalle_de_Calibracion_por_Herramientas);
            this.dataSourceHistorico.paginator = this.paginator;
            this.dataSourceHistorico.sort = this.sort;
	  
        this.model.fromObject(result.Control_de_Calibracion_de_Equipo_y_Herramientas[0]);
        this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No_de_Codigo').setValue(
          result.Control_de_Calibracion_de_Equipo_y_Herramientas[0].No_de_Codigo_Herramientas.Codigo,
          { onlySelf: false, emitEvent: true }
        );
        if (this.model.Certificado_de_Calibracion !== null && this.model.Certificado_de_Calibracion !== undefined) {
          this.spartanFileService.getById(this.model.Certificado_de_Calibracion).subscribe(f => {
            this.fileCertificado_de_Calibracion = f;
            this.Certificado_de_CalibracionName = f.Description;
          });
        }

		this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.markAllAsTouched();
		this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.updateValueAndValidity();
        this.spinner.hide('loading');
      } else { this.spinner.hide('loading'); }
  }
  
  get HistoricoItems() {
    return this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Detalle_de_Calibracion_por_HerramientaItems') as FormArray;
  }

  getHistoricoColumns(): string[] {
    return this.HistoricoColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadHistorico(Historico: Detalle_de_Calibracion_por_Herramienta[]) {
    Historico.forEach(element => {
      this.addHistorico(element);
    });
  }

  addHistoricoToMR() {
    const Historico = new Detalle_de_Calibracion_por_Herramienta(this.fb);
    this.HistoricoData.push(this.addHistorico(Historico));
    this.dataSourceHistorico.data = this.HistoricoData;
    Historico.edit = true;
    Historico.isNew = true;
    const length = this.dataSourceHistorico.data.length;
    const index = length - 1;
    const formHistorico = this.HistoricoItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceHistorico.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addHistorico(entity: Detalle_de_Calibracion_por_Herramienta) {
    const Historico = new Detalle_de_Calibracion_por_Herramienta(this.fb);
    this.HistoricoItems.push(Historico.buildFormGroup());
    if (entity) {
      Historico.fromObject(entity);
    }
	return entity;
  }  

  HistoricoItemsByFolio(Folio: number): FormGroup {
    return (this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Detalle_de_Calibracion_por_HerramientaItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  HistoricoItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceHistorico.data.indexOf(element);
	let fb = this.HistoricoItems.controls[index] as FormGroup;
    return fb;
  }  

  deleteHistorico(element: any) {
    let index = this.dataSourceHistorico.data.indexOf(element);
    this.HistoricoData[index].IsDeleted = true;
    this.dataSourceHistorico.data = this.HistoricoData;
    this.dataSourceHistorico._updateChangeSubscription();
    index = this.dataSourceHistorico.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }
  
  cancelEditHistorico(element: any) {
    let index = this.dataSourceHistorico.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.HistoricoData[index].IsDeleted = true;
      this.dataSourceHistorico.data = this.HistoricoData;
      this.dataSourceHistorico._updateChangeSubscription();
      index = this.HistoricoData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }  

  async saveHistorico(element: any) {
    const index = this.dataSourceHistorico.data.indexOf(element);
    const formHistorico = this.HistoricoItems.controls[index] as FormGroup;
    this.HistoricoData[index].Fecha_Ultima_Calibracion = formHistorico.value.Fecha_Ultima_Calibracion;
    this.HistoricoData[index].Fecha_Proxima_Calibracion = formHistorico.value.Fecha_Proxima_Calibracion;
    this.HistoricoData[index].Manual_del_Usuario = formHistorico.value.Manual_del_Usuario;
    this.HistoricoData[index].Alcance = formHistorico.value.Alcance;
    this.HistoricoData[index].Estatus = formHistorico.value.Estatus;
    this.HistoricoData[index].Estatus_Estatus_de_Calibracion = formHistorico.value.Estatus !== '' ?
     this.varEstatus_de_Calibracion.filter(d => d.Folio === formHistorico.value.Estatus)[0] : null ;	
    this.HistoricoData[index].Notas = formHistorico.value.Notas;
	
    this.HistoricoData[index].isNew = false;
    this.dataSourceHistorico.data = this.HistoricoData;
    this.dataSourceHistorico._updateChangeSubscription();
  }
  
  editHistorico(element: any) {
    const index = this.dataSourceHistorico.data.indexOf(element);
    const formHistorico = this.HistoricoItems.controls[index] as FormGroup;
	    
    element.edit = true;
  }  

  async saveDetalle_de_Calibracion_por_Herramienta(Folio: number) {
    this.dataSourceHistorico.data.forEach(async (d, index) => {
      const data = this.HistoricoItems.controls[index] as FormGroup;
      let model = data.getRawValue();
	  model.Control_de_Calibracion_de_Equipo_y_Herramienta = Folio;
	
	  const FolioCertificado_de_Calibracion = await this.saveCertificado_de_Calibracion_Detalle_de_Calibracion_por_Herramienta(index);
      d.Certificado_de_Calibracion = FolioCertificado_de_Calibracion > 0 ? FolioCertificado_de_Calibracion : null;  
      
      if (model.Folio === 0) {
        // Add Histórico
		let response = await this.Detalle_de_Calibracion_por_HerramientaService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formHistorico = this.HistoricoItemsByFolio(model.Folio);
        if (formHistorico.dirty) {
          // Update Histórico
          let response = await this.Detalle_de_Calibracion_por_HerramientaService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Histórico
        await this.Detalle_de_Calibracion_por_HerramientaService.delete(model.Folio).toPromise();
      }
    });
  }

  getCertificado_de_Calibracion_Detalle_de_Calibracion_por_Herramienta(element: any) {
    const index = this.dataSourceHistorico.data.indexOf(element);
    const formDetalle_de_Calibracion_por_Herramienta = this.HistoricoItems.controls[index] as FormGroup;
    return formDetalle_de_Calibracion_por_Herramienta.controls.Certificado_de_CalibracionFile.value && formDetalle_de_Calibracion_por_Herramienta.controls.Certificado_de_CalibracionFile.value !== '' ?
      formDetalle_de_Calibracion_por_Herramienta.controls.Certificado_de_CalibracionFile.value.files[0].name : '';
  }

  async getCertificado_de_Calibracion_Detalle_de_Calibracion_por_HerramientaClick(element: any) {
    const index = this.dataSourceHistorico.data.indexOf(element);
    const formDetalle_de_Calibracion_por_Herramienta = this.HistoricoItems.controls[index] as FormGroup;
    if (formDetalle_de_Calibracion_por_Herramienta.controls.Certificado_de_CalibracionFile.valid
      && formDetalle_de_Calibracion_por_Herramienta.controls.Certificado_de_CalibracionFile.dirty) {
      const Certificado_de_Calibracion = formDetalle_de_Calibracion_por_Herramienta.controls.Certificado_de_CalibracionFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Certificado_de_Calibracion);
      this.helperService.dowloadFileFromArray(byteArray, Certificado_de_Calibracion.name);
    }
  }

  removeCertificado_de_Calibracion_Detalle_de_Calibracion_por_Herramienta(element: any) {
    const index = this.dataSourceHistorico.data.indexOf(element);
    this.Certificado_de_Calibracion_Detalle_de_Calibracion_por_Herramienta[index] = '';
    this.HistoricoData[index].Certificado_de_Calibracion = 0;

    const formDetalle_de_Calibracion_por_Herramienta = this.HistoricoItems.controls[index] as FormGroup;
    if (formDetalle_de_Calibracion_por_Herramienta.controls.Certificado_de_CalibracionFile.valid
      && formDetalle_de_Calibracion_por_Herramienta.controls.Certificado_de_CalibracionFile.dirty) {
      formDetalle_de_Calibracion_por_Herramienta.controls.Certificado_de_CalibracionFile = null;
    }
  } 

  async saveCertificado_de_Calibracion_Detalle_de_Calibracion_por_Herramienta(index: number): Promise<number> {
    const formHistorico = this.HistoricoItems.controls[index] as FormGroup;
    if (formHistorico.controls.Certificado_de_CalibracionFile.valid
      && formHistorico.controls.Certificado_de_CalibracionFile.dirty) {
      const Certificado_de_Calibracion = formHistorico.controls.Certificado_de_CalibracionFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Certificado_de_Calibracion);
      const spartanFile = {
        File: byteArray,
        Description: Certificado_de_Calibracion.name,
        Date_Time: Certificado_de_Calibracion.lastModifiedDate,
        File_Size: Certificado_de_Calibracion.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return 0;
    }
  }

  hasCertificado_de_Calibracion_Detalle_de_Calibracion_por_Herramienta(element) {
    return this.getCertificado_de_Calibracion_Detalle_de_Calibracion_por_Herramienta(element) !== '' ||
      (element.Certificado_de_Calibracion_Spartane_File && element.Certificado_de_Calibracion_Spartane_File.File_Id > 0);
  }


  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Estatus_de_CalibracionService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varEstatus_de_Calibracion  ]) => {
          this.varEstatus_de_Calibracion = varEstatus_de_Calibracion;


          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No_de_Codigo').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingNo_de_Codigo = true),
      distinctUntilChanged(),
      switchMap(value => {
        if (!value) return this.HerramientasService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.HerramientasService.listaSelAll(0, 20, '');
          return this.HerramientasService.listaSelAll(0, 20,
            "Herramientas.Codigo like '%" + value.trimLeft().trimRight() + "%'");
        }
        return this.HerramientasService.listaSelAll(0, 20,
          "Herramientas.Codigo like '%" + value.Codigo.trimLeft().trimRight() + "%'");
      })
    ).subscribe(result => {
      this.isLoadingNo_de_Codigo = false;
      this.hasOptionsNo_de_Codigo = result?.Herramientass?.length > 0;
	  this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No_de_Codigo').setValue(result?.Herramientass[0], { onlySelf: true, emitEvent: false });
	  this.optionsNo_de_Codigo = of(result?.Herramientass);
    }, error => {
      this.isLoadingNo_de_Codigo = false;
      this.hasOptionsNo_de_Codigo = false;
      this.optionsNo_de_Codigo = of([]);
    });


  }
  

  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Estatus': {
        this.Estatus_de_CalibracionService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Calibracion = x.Estatus_de_Calibracions;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

displayFnNo_de_Codigo(option: Herramientas) {
    return option?.Codigo;
  }

  async saveCertificado_de_Calibracion(): Promise<number> {
    if (this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.controls.Certificado_de_CalibracionFile.valid
      && this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.controls.Certificado_de_CalibracionFile.dirty) {
      const Certificado_de_Calibracion = this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.controls.Certificado_de_CalibracionFile.value.files[0];
      const byteArray = await this.helperService.fileToByteArray(Certificado_de_Calibracion);
      const spartanFile = {
        File: byteArray,
        Description: Certificado_de_Calibracion.name,
        Date_Time: Certificado_de_Calibracion.lastModifiedDate,
        File_Size: Certificado_de_Calibracion.size
      };
      return await this.spartanFileService.insert(spartanFile).toPromise();
    }
    else {
      return this.model.Certificado_de_Calibracion > 0 ? this.model.Certificado_de_Calibracion : 0;
    }
  }
  
  Certificado_de_CalibracionUrl() {
    if (this.fileCertificado_de_Calibracion)
      return this.spartanFileService.url(this.fileCertificado_de_Calibracion.File_Id.toString(), this.fileCertificado_de_Calibracion.Description);
    return '#';
  }  
  
  getCertificado_de_Calibracion() {
    this.helperService.dowloadFile(this.fileCertificado_de_Calibracion.base64, this.Certificado_de_CalibracionName);
  }
  
  removeCertificado_de_Calibracion() {
    this.Certificado_de_CalibracionName = '';
    this.model.Certificado_de_Calibracion = 0;
  }

  async save() {
    await this.saveData();
    this.goToList();
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.value;
      entity.Folio = this.model.Folio;
      entity.No_de_Codigo = this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No_de_Codigo').value.Folio;
      entity.No__de_Parte___Descripcion = this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No__de_Parte___Descripcion').value
      entity.No__de_Serie = this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No__de_Serie').value
      entity.Manual_del_Usuario = this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Manual_del_Usuario').value
      entity.Alcance = this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Alcance').value
	  	  
      const FolioCertificado_de_Calibracion = await this.saveCertificado_de_Calibracion();
      entity.Certificado_de_Calibracion = FolioCertificado_de_Calibracion > 0 ? FolioCertificado_de_Calibracion : null;	  
	  
	  if (this.model.Folio > 0 ) {
        await this.Control_de_Calibracion_de_Equipo_y_HerramientaService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Calibracion_por_Herramienta(this.model.Folio);  

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        this.spinner.hide('loading');
        return this.model.Folio;
      } else {
        await (this.Control_de_Calibracion_de_Equipo_y_HerramientaService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Calibracion_por_Herramienta(id);

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
      this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.reset();
      this.model = new Control_de_Calibracion_de_Equipo_y_Herramienta(this.fb);
      this.Control_de_Calibracion_de_Equipo_y_HerramientaForm = this.model.buildFormGroup();
      this.dataSourceHistorico = new MatTableDataSource<Detalle_de_Calibracion_por_Herramienta>();
      this.HistoricoData = [];

    } else {
      this.router.navigate(['views/Control_de_Calibracion_de_Equipo_y_Herramienta/add']);
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
    this.router.navigate(['/Control_de_Calibracion_de_Equipo_y_Herramienta/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }
  
  //No borrar el bloque de codigo siguiente
  
  //Inicio de Reglas

      No_de_Codigo_ExecuteBusinessRules(element): void {

        //INICIA - BRID:7067 - Asignar valor a descripción y numero de serie al seleccionar código - Autor: Felipe Rodríguez - Actualización: 10/7/2021 12:38:09 PM
        console.log("Element: ", element);
        if( element.Codigo != null || element.Codigo != undefined) { 
          this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No__de_Parte___Descripcion').setValue(element.Codigo_Descripcion);
          this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No__de_Serie').setValue(element.No_de_Serie);
          this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Manual_del_Usuario').setValue(element.Manual_del_Usuario);
          this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Alcance').setValue(element.Alcance);
          this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No__de_Parte___Descripcion', 0);
          this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No__de_Serie', 0); 
          /* this._SpartanService.SetValueExecuteQuery(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm,"No__de_Parte___Descripcion","SELECT ISNULL(Codigo_Descripcion,'No cuenta con Descripción registrada.') FROM Herramientas WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No_de_Codigo').value+"",1,"ABC123"); 
          this._SpartanService.SetValueExecuteQuery(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm,"No__de_Serie","SELECT ISNULL(No_de_Serie,'No cuenta con No. de Serie registrado.') FROM Herramientas WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No_de_Codigo').value+"",1,"ABC123"); 
          this._SpartanService.SetValueExecuteQuery(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm,"Manual_del_Usuario","SELECT ISNULL((SELECT Descripcion FROM Catalago_Manual_de_Usuario WHERE Folio = (SELECT Manual_del_Usuario FROM Herramientas WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No_de_Codigo').value+")),'No cuenta con Manual del Usuario registrado.')",1,"ABC123"); 
          this._SpartanService.SetValueExecuteQuery(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm,"Alcance","SELECT ISNULL(Alcance,'No cuenta con Alcance registrado.') FROM Herramientas WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('No_de_Codigo').value+"",1,"ABC123");
 */        } else {}
        //TERMINA - BRID:7067

        //No_de_Codigo_FieldExecuteBusinessRulesEnd

    }
    No__de_Parte___Descripcion_ExecuteBusinessRules(): void {
        //No__de_Parte___Descripcion_FieldExecuteBusinessRulesEnd
    }
    No__de_Serie_ExecuteBusinessRules(): void {
        //No__de_Serie_FieldExecuteBusinessRulesEnd
    }
    Fecha_Ultima_Calibracion_ExecuteBusinessRules(): void {
        //Fecha_Ultima_Calibracion_FieldExecuteBusinessRulesEnd
    }
    Fecha_Proxima_Calibracion_ExecuteBusinessRules(): void {
        //Fecha_Proxima_Calibracion_FieldExecuteBusinessRulesEnd
    }
    Certificado_de_Calibracion_ExecuteBusinessRules(): void {
        //Certificado_de_Calibracion_FieldExecuteBusinessRulesEnd
    }
    Manual_del_Usuario_ExecuteBusinessRules(): void {
        //Manual_del_Usuario_FieldExecuteBusinessRulesEnd
    }
    Alcance_ExecuteBusinessRules(): void {
        //Alcance_FieldExecuteBusinessRulesEnd
    }
    Estatus_ExecuteBusinessRules(): void {
        //Estatus_FieldExecuteBusinessRulesEnd
    }
    Notas_ExecuteBusinessRules(): void {
        //Notas_FieldExecuteBusinessRulesEnd
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

//INICIA - BRID:7043 - Ocultar folio control de calibración  - Autor: Eliud Hernandez - Actualización: 10/5/2021 1:22:52 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.HideFieldOfForm(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Folio"); 
  this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Folio");
} 
//TERMINA - BRID:7043


//INICIA - BRID:7054 - Ancho de campos en pantalla calibración - Autor: Eliud Hernandez - Actualización: 10/7/2021 12:57:20 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:7054


//INICIA - BRID:7060 - Asignar no requeridos  de la pantalla de calibración. - Autor: Eliud Hernandez - Actualización: 10/7/2021 9:40:26 AM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Certificado_de_Calibracion");
  this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Estatus");
  this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Notas");
} 
//TERMINA - BRID:7060


//INICIA - BRID:7065 - Deshabilitar campos de calibración - Autor: Eliud Hernandez - Actualización: 10/6/2021 5:41:28 PM
if(  this.operation == 'Update' ) {
  this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No_de_Codigo', 0);
  this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No__de_Parte___Descripcion', 0);
  this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No__de_Serie', 0);
} 
//TERMINA - BRID:7065


//INICIA - BRID:7066 - Estatus de Baja Total- No debe de permitir modificar registros solo se puede Consultar - Autor: Felipe Rodríguez - Actualización: 10/7/2021 9:30:18 AM
if(  this.operation == 'Update' ) {
  if( this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Estatus').value == this.brf.TryParseInt('2', '2') ) { 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Folio', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No_de_Codigo', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No__de_Parte___Descripcion', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No__de_Serie', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Fecha_Ultima_Calibracion', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Fecha_Proxima_Calibracion', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Certificado_de_Calibracion', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Manual_del_Usuario', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Alcance', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Estatus', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Notas', 0); 
    this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Historico', 0); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Folio"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "No_de_Codigo"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "No__de_Parte___Descripcion"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "No__de_Serie"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Fecha_Ultima_Calibracion"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Fecha_Proxima_Calibracion"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Certificado_de_Calibracion"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Manual_del_Usuario"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Alcance"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Estatus"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Notas"); 
    this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Historico"); 
  } else {}
} 
//TERMINA - BRID:7066


//INICIA - BRID:7068 - Deshabilitar campos al nuevo y editar - Autor: Felipe Rodríguez - Actualización: 10/7/2021 12:32:26 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "No__de_Parte___Descripcion");
  this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "No__de_Serie"); 
  this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No__de_Parte___Descripcion', 0);
  this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'No__de_Serie', 0); 
  this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Manual_del_Usuario', 0);
  this.brf.SetEnabledControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, 'Alcance', 0); 
  this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Manual_del_Usuario");
  this.brf.SetNotRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Alcance");
} 
//TERMINA - BRID:7068


//INICIA - BRID:7069 - Guardar valor de los campos en variables de sesión. - Autor: Felipe Rodríguez - Actualización: 10/7/2021 10:12:59 AM
if(  this.operation == 'Update' ) {

  let FechaUltimaCalibracion = this._SpartanService.SetValueExecuteQueryRT("SELECT Fecha_Ultima_Calibracion FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123");
  let FechaProximaCalibracion = this._SpartanService.SetValueExecuteQueryRT("SELECT Fecha_Proxima_Calibracion FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123");
  let CertificadoDeCalibracion = this._SpartanService.SetValueExecuteQueryRT("SELECT Certificado_de_Calibracion FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123");
  let ManualDelUsuario = this._SpartanService.SetValueExecuteQueryRT("SELECT Manual_del_Usuario FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123");
  let Alcance = this._SpartanService.SetValueExecuteQueryRT("SELECT Alcance FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123");
  let Estatus = this._SpartanService.SetValueExecuteQueryRT("SELECT Estatus FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123");
  let Notas = this._SpartanService.SetValueExecuteQueryRT("SELECT Notas FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123");
  let FechaUltimaSinModificar = this._SpartanService.SetValueExecuteQueryRT("SELECT '"+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Fecha_Ultima_Calibracion').value+"'", 1, "ABC123");
  this.localStorageHelper.setItemToLocalStorage('FechaUltimaCalibracion', FechaUltimaCalibracion);
  this.localStorageHelper.setItemToLocalStorage('FechaProximaCalibracion', FechaProximaCalibracion);
  this.localStorageHelper.setItemToLocalStorage('CertificadoDeCalibracion', CertificadoDeCalibracion);
  this.localStorageHelper.setItemToLocalStorage('ManualDelUsuario', ManualDelUsuario);
  this.localStorageHelper.setItemToLocalStorage('Alcance', Alcance);
  this.localStorageHelper.setItemToLocalStorage('Estatus', Estatus);
  this.localStorageHelper.setItemToLocalStorage('Notas', Notas);
  this.localStorageHelper.setItemToLocalStorage('FechaUltimaSinModificar', FechaUltimaSinModificar);
  //this.brf.CreateSessionVar("FechaUltimaCalibracion",this.brf.EvaluaQuery("SELECT Fecha_Ultima_Calibracion FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123"), 1,"ABC123"); 
  //this.brf.CreateSessionVar("FechaProximaCalibracion",this.brf.EvaluaQuery("SELECT Fecha_Proxima_Calibracion FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123"), 1,"ABC123"); 
  //this.brf.CreateSessionVar("CertificadoDeCalibracion",this.brf.EvaluaQuery("SELECT Certificado_de_Calibracion FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123"), 1,"ABC123"); 
  //this.brf.CreateSessionVar("ManualDelUsuario",this.brf.EvaluaQuery("SELECT Manual_del_Usuario FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123"), 1,"ABC123"); 
  //this.brf.CreateSessionVar("Alcance",this.brf.EvaluaQuery("SELECT Alcance FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123"), 1,"ABC123"); 
  //this.brf.CreateSessionVar("Estatus",this.brf.EvaluaQuery("SELECT Estatus FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123"), 1,"ABC123"); 
  //this.brf.CreateSessionVar("Notas",this.brf.EvaluaQuery("SELECT Notas FROM Control_de_Calibracion_de_Equipo_y_Herramienta WHERE Folio = "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+"", 1, "ABC123"), 1,"ABC123"); 
  //this.brf.CreateSessionVar("FechaUltimaSinModificar",this.brf.EvaluaQuery("SELECT 'FLD[Fecha_Ultima_Calibracion]'", 1, "ABC123"), 1,"ABC123");
} 
//TERMINA - BRID:7069


//INICIA - BRID:7080 - asignar requerido a campo Estatus - Autor: Felipe Rodríguez - Actualización: 10/7/2021 1:22:16 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.SetRequiredControl(this.Control_de_Calibracion_de_Equipo_y_HerramientaForm, "Estatus");
} 
//TERMINA - BRID:7080

//rulesOnInit_ExecuteBusinessRulesEnd








  }
  
  rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:7058 - Sp que inserte en el historico de calibración MR al Nuevo. - Autor: Felipe Rodríguez - Actualización: 10/6/2021 5:37:43 PM
  if(  this.operation == 'New' ) {
  this.brf.EvaluaQuery("EXEC sp_InsHistoricoCalibracionHerramientas "+ this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)+"", 1, "ABC123");
  } 
//TERMINA - BRID:7058


//INICIA - BRID:7059 - Sp que inserte en el historico de calibración MR al Editar. - Autor: Felipe Rodríguez - Actualización: 10/7/2021 1:19:17 PM
if(  this.operation == 'Update' ) {
  if( this.brf.EvaluaQuery("declare @Fecha nvarchar(10) = '"+this.localStorageHelper.getItemFromLocalStorage('FechaUltimaSinModificar')+"' declare @Fecha2 nvarchar(10) = '"+this.localStorageHelper.getItemFromLocalStorage('Fecha_Ultima_Calibracion')+"' declare @FechaNueva nvarchar(10) declare @FechaNueva2 nvarchar(10) set @FechaNueva = substring(@Fecha,4,2) + '/' + left(@fecha,2) + '/' + right(@fecha,4)   set @FechaNueva2 = substring(@Fecha2,4,2) + '/' + left(@fecha2,2) + '/' + right(@fecha2,4)   select DATEDIFF(day,@FechaNueva, @FechaNueva2)", 1, 'ABC123')>=this.brf.TryParseInt('1', '1') ) { 
    this.brf.EvaluaQuery("EXEC sp_InsHistoricoCalibracionHerramientas "+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Folio').value+", '"+this.localStorageHelper.getItemFromLocalStorage('FechaUltimaCalibracion')+"', '"+this.localStorageHelper.getItemFromLocalStorage('FechaProximaCalibracion')+"', '"+this.localStorageHelper.getItemFromLocalStorage('CertificadoDeCalibracion')+"', '"+this.localStorageHelper.getItemFromLocalStorage('ManualDelUsuario')+"', '"+this.localStorageHelper.getItemFromLocalStorage('Alcance')+"', '"+this.localStorageHelper.getItemFromLocalStorage('Estatus')+"', '"+this.localStorageHelper.getItemFromLocalStorage('Notas')+"'", 1, "ABC123");} else {}
} 
//TERMINA - BRID:7059

//rulesAfterSave_ExecuteBusinessRulesEnd


  }
  
  rulesBeforeSave(): boolean {
    let result = true;
//rulesBeforeSave_ExecuteBusinessRulesInit

//INICIA - BRID:7063 - Validar al nuevo el campo fecha próxima sea mayor que fecha ultima - Autor: Felipe Rodríguez - Actualización: 10/6/2021 5:41:24 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  if( this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),GETDATE(),103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'"+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Fecha_Proxima_Calibracion').value+"',103),103))", 1, 'ABC123')<this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),GETDATE(),103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'"+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('Fecha_Ultima_Calibracion').value+"',103),103))", 1, 'ABC123') ) { 
    this.brf.ShowMessage("La fecha de próxima calibración es menor que la fecha de última calibración, favor de revisar.");

result=false;} else {}
} 
//TERMINA - BRID:7063


//INICIA - BRID:7079 - validar que la nueva fecha ultima de calibración no sea menor que la fecha ultima calibración anterior - Autor: Felipe Rodríguez - Actualización: 10/7/2021 12:59:17 PM
if(  this.operation == 'Update' ) {
  if( this.brf.EvaluaQuery("declare @Fecha nvarchar(10) = '"+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('FechaUltimaSinModificar').value+"' declare @Fecha2 nvarchar(10) = 'FLD[Fecha_Ultima_Calibracion]' declare @FechaNueva nvarchar(10) declare @FechaNueva2 nvarchar(10) set @FechaNueva = substring(@Fecha,4,2) + '/' + left(@fecha,2) + '/' + right(@fecha,4)   set @FechaNueva2 = substring(@Fecha2,4,2) + '/' + left(@fecha2,2) + '/' + right(@fecha2,4)   select DATEDIFF(day,@FechaNueva, @FechaNueva2)", 1, 'ABC123')<this.brf.TryParseInt('0', '0') ) { 
    this.brf.ShowMessage("La nueva Fecha de Última Calibración no puede ser menor que la anterior Fecha de Última Calibración ("+this.Control_de_Calibracion_de_Equipo_y_HerramientaForm.get('FechaUltimaSinModificar').value+"), favor de revisar.");

  result=false;
} else {}
} 
//TERMINA - BRID:7079

//rulesBeforeSave_ExecuteBusinessRulesEnd


    return result;
  }

  //Fin de reglas
  
}
