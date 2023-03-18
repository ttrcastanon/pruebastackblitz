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

import { SpartanFile } from 'src/app/models/spartan-file';
import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-Coordinacion_Avisos',
  templateUrl: './Coordinacion_Avisos.component.html',
  styleUrls: ['./Coordinacion_Avisos.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Coordinacion_AvisosComponent implements OnInit, AfterViewInit {
MRaddAvisos: boolean = false;

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
  isServiciosAdd: boolean = true;
  isServiciosOpen: boolean = false;

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
    renderer: Renderer2) {
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

  async Fecha_ExecuteBusinessRules(element): Promise<void> {

    let lista = this.Coordinacion_AvisosForm.get("Detalle_Coordinacion_AvisosItems").value.filter(x => x.Folio == element.Folio);

    let fecha = lista[0].Fecha;

    if(fecha != null && fecha.toISOString().includes('+')) {
      //this.Coordinacion_AvisosForm.get('Fecha').setValue('');
      this.Coordinacion_AvisosForm.get("Detalle_Coordinacion_AvisosItems").value.filter(x => x.Folio == element.Folio)[0].Fecha.setValue('');
      return;
    }
  }

  getCountAvisos(): number {
    return this.dataSourceAvisos.data.filter(d => !d.IsDeleted).length;
  }

  VerificarAvisos(element) {
    let lista = this.Coordinacion_AvisosForm.get("Detalle_Coordinacion_AvisosItems").value.filter( x => x.Folio == element.Folio );

    let Aviso = lista[0].Aviso;
    let Confirmado = lista[0].Confirmado;

    if (Aviso && Confirmado) {
      this.ButtonSaveAvisos = false;
    }
    else {
      this.ButtonSaveAvisos = true
    }
  }
  
  ngAfterViewInit(): void {
    this.dataSourceAvisos.paginator = this.paginator;
	    
    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.AvisosColumns.splice(0, 1);
		
          this.Coordinacion_AvisosForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Coordinacion_Avisos)
      .subscribe((response) => {
        this.permisos = response;
      });

	this.brf.updateValidatorsToControl(this.Coordinacion_AvisosForm, 'Numero_de_Vuelo', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	this.brf.updateValidatorsToControl(this.Coordinacion_AvisosForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(),Validators.required]);
	  
	this.rulesOnInit();	  
  }

  async populateModel(id: number) {
  
    this.spinner.show('loading');
	let result =  await this.Coordinacion_AvisosService.listaSelAll(0, 1, 'Coordinacion_Avisos.Folio=' + id).toPromise();
	if (result.Coordinacion_Avisoss.length > 0) {
        let fAvisos = await this.Detalle_Coordinacion_AvisosService.listaSelAll(0, 1000,'Coordinacion_Avisos.Folio=' + id).toPromise();
            this.AvisosData = fAvisos.Detalle_Coordinacion_Avisoss;
            this.loadAvisos(fAvisos.Detalle_Coordinacion_Avisoss);
            this.dataSourceAvisos = new MatTableDataSource(fAvisos.Detalle_Coordinacion_Avisoss);
            this.dataSourceAvisos.paginator = this.paginator;
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
      } else { this.spinner.hide('loading'); }
  }
  
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
    const Avisos = new Detalle_Coordinacion_Avisos(this.fb);
    this.AvisosData.push(this.addAvisos(Avisos));
    this.dataSourceAvisos.data = this.AvisosData;
    Avisos.edit = true;
    Avisos.isNew = true;
    const length = this.dataSourceAvisos.data.length;
    const index = length - 1;
    //const formAvisos = this.AvisosItems.controls[index] as FormGroup;
    
    const page = Math.ceil(this.dataSourceAvisos.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
    this.isServiciosAdd = !this.isServiciosAdd;
    this.isServiciosOpen = true;
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

        this.AvisosData[index].IsDeleted = true;
        //this.AvisosData.splice(index, 1);
        this.dataSourceAvisos.data = this.AvisosData;
        //this.dataSourceAvisos.data.splice(index, 1);

        let fgr = this.Coordinacion_AvisosForm.controls.Detalle_Coordinacion_AvisosItems as FormArray;
        //fgr.removeAt(index);

        this.dataSourceAvisos._updateChangeSubscription();
        index = this.dataSourceAvisos.data.filter(d => !d.IsDeleted).length;
        const page = Math.ceil(index / this.paginator.pageSize);
        if (page !== this.paginator.pageIndex) {
          this.paginator.pageIndex = page;
        }
      }
    });
  }
  
  closeWindowCancel():void{
    window.close();
  }
  closeWindowSave():void{
    //setTimeout(()=>{ window.close();}, 2000);
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
      //fgr.removeAt(index);
      
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
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
     this.varTipo_de_Aviso.filter(d => d.Clave === formAvisos.value.Aviso)[0] : null ;	
    this.AvisosData[index].Fecha = formAvisos.value.Fecha;
    this.AvisosData[index].Confirmado_por_Correo = formAvisos.value.Confirmado_por_Correo;
    this.AvisosData[index].Confirmado_por_Telefono = formAvisos.value.Confirmado_por_Telefono;
    this.AvisosData[index].Comentarios = formAvisos.value.Comentarios;
    this.AvisosData[index].Confirmado = formAvisos.value.Confirmado;
    this.AvisosData[index].Confirmado_Estatus_de_Confirmacion = formAvisos.value.Confirmado !== '' ?
     this.varEstatus_de_Confirmacion.filter(d => d.Clave === formAvisos.value.Confirmado)[0] : null ;	
	
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
  }



  
  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Coordinacion_AvisosForm.disabled ? "Update" : this.operation;
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
    observablesArray.push(this.Tipo_de_AvisoService.getAll());
    observablesArray.push(this.Estatus_de_ConfirmacionService.getAll());


    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([ varTipo_de_Aviso  , varEstatus_de_Confirmacion  ]) => {
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
    if(this.localStorageHelper.getItemFromLocalStorage("Coordinacion_AvisosWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Coordinacion_AvisosWindowsFloat", "0");
      setTimeout(()=>{ window.close();}, 3000);
    }
    else{
      this.goToList();
    }
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Coordinacion_AvisosForm.value;
      entity.Folio = this.model.Folio;
      entity.Numero_de_Vuelo =  this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId');
      entity.Matricula = this.Coordinacion_AvisosForm.get('Matricula').value.Matricula;
      entity.Ruta_de_Vuelo = this.Coordinacion_AvisosForm.controls.Ruta_de_Vuelo.value;
      entity.Fecha_y_Hora_de_Salida = this.Coordinacion_AvisosForm.controls.Fecha_y_Hora_de_Salida.value;
      entity.Calificacion = this.Coordinacion_AvisosForm.controls.Calificacion.value;	   
	  
	  if (this.model.Folio > 0 ) {
        await this.Coordinacion_AvisosService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_Coordinacion_Avisos(this.model.Folio);  
        this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
        await this.rulesAfterSave();
      } else {
        await (this.Coordinacion_AvisosService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_Coordinacion_Avisos(id);          
          await this.rulesAfterSave();
          
          setTimeout(()=>{ 
            this.localStorageHelper.setItemToLocalStorage("IsResetDynamicSearch", "1");
            this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, id.toString());
          }, 3000);    

        }));
      }
      this.snackBar.open('Registro guardado con éxito', '', {
        duration: 2000,
        verticalPosition: 'top',
        horizontalPosition: 'right',
        panelClass: 'success'
      });
      this.rulesAfterSave();
      // this.isLoading = false;
      // this.spinner.hide('loading');
    } else {
      this.isLoading = false;
      this.spinner.hide('loading');
      return false;
    }
  }

  async saveAndNew() {
    await this.saveData();
    if (this.model.Folio === 0 ) {
      this.Coordinacion_AvisosForm.reset();
      this.model = new Coordinacion_Avisos(this.fb);
      this.Coordinacion_AvisosForm = this.model.buildFormGroup();
      this.dataSourceAvisos = new MatTableDataSource<Detalle_Coordinacion_Avisos>();
      this.AvisosData = [];

    } else {
      this.router.navigate(['views/Coordinacion_Avisos/add']);
    }
  }
  
  async saveAndCopy() {
    await this.saveData();
    this.model.Folio = 0;

  }
  
  cancel() {
    if(this.localStorageHelper.getItemFromLocalStorage("Coordinacion_AvisosWindowsFloat") == "1"){
      this.localStorageHelper.setItemToLocalStorage("Coordinacion_AvisosWindowsFloat", "0");
      window.close();
    }
    else{
      this.goToList();
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
if(  this.operation == 'New' ) {
  this.brf.HideFieldOfForm(this.Coordinacion_AvisosForm, "Numero_de_Vuelo"); 
  this.brf.SetNotRequiredControl(this.Coordinacion_AvisosForm, "Numero_de_Vuelo"); 
  this.brf.SetNotRequiredControl(this.Coordinacion_AvisosForm, "Numero_de_Vuelo");
} 
//TERMINA - BRID:1874


//INICIA - BRID:2037 - Al abrir la pantalla, en nuevo y modificar* Matricula, Ruta de Vuelo, Fecha y Hora de Salida, Calificación y Número de Vuelo siempre deshabilitados* Observaciones no obligatorio* Número de vuelo VISIBLE - Autor: Lizeth Villa - Actualización: 3/25/2021 2:41:24 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
  this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Numero_de_Vuelo', 0);
  this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Matricula', 0);
  this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Ruta_de_Vuelo', 0);
  this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Fecha_y_Hora_de_Salida', 0);
  this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Calificacion', 0); 
  this.brf.SetNotRequiredControl(this.Coordinacion_AvisosForm, "Observaciones"); 
  this.brf.HideFieldOfForm(this.Coordinacion_AvisosForm, "Numero_de_Vuelo");
} 
//TERMINA - BRID:2037


//INICIA - BRID:2173 - acomodar campos en coordinación avisos - Autor: Administrador - Actualización: 3/30/2021 1:24:00 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {

} 
//TERMINA - BRID:2173


//INICIA - BRID:2616 - Ocultar folio .. - Autor: Lizeth Villa - Actualización: 4/7/2021 10:06:15 AM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  this.brf.HideFieldOfForm(this.Coordinacion_AvisosForm, "Folio"); 
  this.brf.SetNotRequiredControl(this.Coordinacion_AvisosForm, "Folio");
} 
//TERMINA - BRID:2616


//INICIA - BRID:2827 - si el estatus es cerrado y el rol es distinto de administrador, al editar deshabilite todos los datos, oculte el botón guardar y muestre un mensaje 2 - Autor: Administrador - Actualización: 5/3/2021 4:10:50 PM
if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
  if( this.brf.EvaluaQuery("SELECT COUNT(*) from Solicitud_de_Vuelo where folio = "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" and estatus = 9	", 1, 'ABC123')==this.brf.TryParseInt('1', '1') && 
  this.brf.EvaluaQuery("if ( "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 1 or "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 9 ) begin select 1 end	", 1, 'ABC123')!=this.brf.TryParseInt('1', '1') ) { 
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
    this.brf.ShowMessage("El vuelo ha sido cerrado y no se pueden realizar modificaciones, favor de revisar");} else {}
} 
//TERMINA - BRID:2827


//INICIA - BRID:5679 - Habilitar todos los campos si el vuelo esta reabierto - Autor: Lizeth Villa - Actualización: 9/3/2021 5:33:11 PM
if(  this.operation == 'Update' ) {
if( this.brf.EvaluaQuery("if ( ( "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 9) or  ( "+this.localStorageHelper.getLoggedUserInfo().RoleId+"= 12)) begin select 1 end", 1, 'ABC123')==this.brf.TryParseInt('1', '1') && 
this.brf.EvaluaQuery("select Vuelo_reabierto from solicitud_de_vuelo where folio = "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+"", 1, 'ABC123')==this.brf.TryParseInt('1', '1') ) { 
  this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Matricula', 1);
  this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Ruta_de_Vuelo', 1);
  this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Fecha_y_Hora_de_Salida', 1);
  this.brf.SetEnabledControl(this.Coordinacion_AvisosForm, 'Calificacion', 1);} else {}
} 
//TERMINA - BRID:5679

//rulesOnInit_ExecuteBusinessRulesEnd






  }
  
  async rulesAfterSave() {
//rulesAfterSave_ExecuteBusinessRulesInit

//INICIA - BRID:1873 - En nuevo después de guardar asignar numero de vuelo - Autor: Lizeth Villa - Actualización: 3/22/2021 2:35:10 PM
if(  this.operation == 'New' ) {
  await this.brf.EvaluaQueryAsync(" update Coordinacion_Avisos set Numero_de_Vuelo= "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+" where Folio="+this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted), 1, "ABC123");
} 
//TERMINA - BRID:1873


//INICIA - BRID:2630 - al dar de alta o modificar, después de guardar ejecutar el SP: exec uspAsignaCalificacionCoordinacion "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+",1 esto es para asignar la calificación. - Autor: Felipe Rodríguez - Actualización: 4/7/2021 2:33:39 PM
if(  this.operation == 'New' || this.operation == 'Update' ) {
this._SpartanService.SetValueExecuteQueryFG("exec uspAsignaCalificacionCoordinacion "+this.localStorageHelper.getItemFromLocalStorage('SpartanOperationId')+",1", 1, "ABC123");
}
//TERMINA - BRID:2630

//rulesAfterSave_ExecuteBusinessRulesEnd


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
  
}
