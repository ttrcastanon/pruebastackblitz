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
import { startWith, map, debounceTime, distinctUntilChanged, tap, switchMap } from 'rxjs/operators';
import { Router, ActivatedRoute } from '@angular/router';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { GeneralService } from 'src/app/api-services/general.service';
import { Orden_de_TrabajoService } from 'src/app/api-services/Orden_de_Trabajo.service';
import { Orden_de_Trabajo } from 'src/app/models/Orden_de_Trabajo';
import { Tipo_de_Orden_de_TrabajoService } from 'src/app/api-services/Tipo_de_Orden_de_Trabajo.service';
import { Tipo_de_Orden_de_Trabajo } from 'src/app/models/Tipo_de_Orden_de_Trabajo';
import { AeronaveService } from 'src/app/api-services/Aeronave.service';
import { Aeronave } from 'src/app/models/Aeronave';
import { ModelosService } from 'src/app/api-services/Modelos.service';
import { Modelos } from 'src/app/models/Modelos';
import { PropietariosService } from 'src/app/api-services/Propietarios.service';
import { Propietarios } from 'src/app/models/Propietarios';
import { Estatus_ReporteService } from 'src/app/api-services/Estatus_Reporte.service';
import { Estatus_Reporte } from 'src/app/models/Estatus_Reporte';
import { Detalle_de_Reportes_PrestablecidosService } from 'src/app/api-services/Detalle_de_Reportes_Prestablecidos.service';
import { Detalle_de_Reportes_Prestablecidos } from 'src/app/models/Detalle_de_Reportes_Prestablecidos';

import { Solicitud_Reportes_OT } from 'src/app/models/Solicitud_Reportes_OT';

import { Detalles_de_trabajo_de_OTService } from 'src/app/api-services/Detalles_de_trabajo_de_OT.service';
import { Detalles_de_trabajo_de_OT } from 'src/app/models/Detalles_de_trabajo_de_OT';
import { Crear_ReporteService } from 'src/app/api-services/Crear_Reporte.service';
import { Crear_Reporte } from 'src/app/models/Crear_Reporte';
import { Spartan_UserService } from 'src/app/api-services/Spartan_User.service';
import { Spartan_User } from 'src/app/models/Spartan_User';
import { Estatus_de_ReporteService } from 'src/app/api-services/Estatus_de_Reporte.service';
import { Estatus_de_Reporte } from 'src/app/models/Estatus_de_Reporte';


import { ObjectPermission } from "./../../../models/object-permission";
import { SeguridadService } from "./../../../api-services/seguridad.service";
import { SpartanFileService } from 'src/app/api-services/spartan-file.service';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import { HelperService } from 'src/app/shared/services/helper.service';
import { StorageKeys } from 'src/app/app-constants';

import * as AppConstants from "../../../app-constants";
import { FilterCombo } from 'src/app/models/filter-combo';

import Utils from 'src/app/helpers/utils';
import { BusinessRulesFunctions } from 'src/app/shared/businessRules/business-rules-functions';
import { CustomValidators } from 'src/app/shared/businessRules/custom-validators';
import { SpartanService } from 'src/app/api-services/spartan.service';
import { q } from 'src/app/models/business-rules/business-rule-query.model';
import { event } from '../../Calendario/models/modelevento';



@Component({
  selector: 'app-Orden_de_Trabajo',
  templateUrl: './Orden_de_Trabajo.component.html',
  styleUrls: ['./Orden_de_Trabajo.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0', visibility: 'hidden' })),
      state('expanded', style({ height: '*', visibility: 'visible' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class Orden_de_TrabajoComponent implements OnInit, AfterViewInit {
MRaddReportes_Prestablecidos_OT: boolean = false;

  //#region Variables
  operation: string;
  rowIndex = '';
  nameOfTable = '';
  filterComboEmiter = new Subject<FilterCombo>();
  brf: BusinessRulesFunctions;

  Orden_de_TrabajoForm: FormGroup;
  public Editor = ClassicEditor;
  model: Orden_de_Trabajo;
  arrayBuffer: string | ArrayBuffer;
  cthis = this;
  public varTipo_de_Orden_de_Trabajo: Tipo_de_Orden_de_Trabajo[] = [];
  optionsMatricula: Observable<Aeronave[]>;
  hasOptionsMatricula: boolean;
  isLoadingMatricula: boolean;
  optionsModelo: Observable<Modelos[]>;
  hasOptionsModelo: boolean;
  isLoadingModelo: boolean;
  optionsPropietario: Observable<Propietarios[]>;
  hasOptionsPropietario: boolean;
  isLoadingPropietario: boolean;
  public varEstatus_Reporte: Estatus_Reporte[] = [];


  public varCrear_Reporte: Crear_Reporte[] = [];
  public varSpartan_User: Spartan_User[] = [];
  public varSpartan_UserASign1: Spartan_User[] = [];
  public varSpartan_UserASign2: Spartan_User[] = [];
  public varSpartan_UserASign3: Spartan_User[] = [];
  public varSpartan_UserASign4: Spartan_User[] = [];
  public varSpartan_UserASign5: Spartan_User[] = [];
  public varEstatus_de_Reporte: Estatus_de_Reporte[] = [];

  autoFolio_de_Reporte_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingFolio_de_Reporte_Detalles_de_trabajo_de_OT: boolean;
  searchFolio_de_Reporte_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_1_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_1_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_1_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_1_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_2_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_2_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_2_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_2_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_3_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_3_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_3_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_3_Detalles_de_trabajo_de_OTCompleted: boolean;
  autoAsignado_a_4_Detalles_de_trabajo_de_OT = new FormControl();
  SelectedAsignado_a_4_Detalles_de_trabajo_de_OT: string[] = [];
  isLoadingAsignado_a_4_Detalles_de_trabajo_de_OT: boolean;
  searchAsignado_a_4_Detalles_de_trabajo_de_OTCompleted: boolean;


  private dataListConfig: any = null;
  public isLoading = false;
  config: any;
  permisos: ObjectPermission[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild('tabGroup', { static: true }) tabGroup: MatTabGroup;
  public collapseAll = true;
  dataSourceReportes_Prestablecidos_OT = new MatTableDataSource<Detalle_de_Reportes_Prestablecidos>();
  Reportes_Prestablecidos_OTColumns = [
    { def: 'actions', hide: false },
    { def: 'Seleccionar', hide: false },
    { def: 'Reporte_de_inspeccion_de_entrada', hide: false },
    { def: 'Tipo_de_reporte', hide: false },
    { def: 'Prioridad', hide: false },
    { def: 'Tipo_de_Codigo', hide: false },
    { def: 'Codigo_NP', hide: false },
    { def: 'Descripcion', hide: false },

  ];
  Reportes_Prestablecidos_OTData: Detalle_de_Reportes_Prestablecidos[] = [];
  dataSourceDetalle_de_Reportes_de_OT = new MatTableDataSource<Detalles_de_trabajo_de_OT>();
  Detalle_de_Reportes_de_OTColumns = [
    { def: 'actions', hide: false },
    { def: 'Tipo_de_Reporte', hide: false },
    { def: 'Folio_de_Reporte', hide: false },
    { def: 'Descripcion_de_Reporte', hide: false },
    { def: 'Matricula', hide: false },
    { def: 'Modelo', hide: false },
    { def: 'Codigo_Computarizado', hide: false },
    { def: 'Codigo_ATA', hide: false },
    { def: 'Origen_del_Reporte', hide: false },
    { def: 'Respuesta_Total', hide: false },
    { def: 'Asignado_a', hide: false },
    { def: 'Asignado_a_1', hide: false },
    { def: 'Asignado_a_2', hide: false },
    { def: 'Asignado_a_3', hide: false },
    { def: 'Asignado_a_4', hide: false },
    { def: 'Estatus', hide: false },
    //{ def: 'Notificado', hide: false },

  ];
  Detalle_de_Reportes_de_OTData: Detalles_de_trabajo_de_OT[] = [];



  //Seleccionar_Reportes_OTData: Detalle_de_Reportes_Prestablecidos[] = [];
  dataSourceSeleccionar_Reportes_OT = new MatTableDataSource<Solicitud_Reportes_OT>();
  Seleccionar_Reportes_OTColumns = [
    { def: 'actions', hide: true },
    { def: 'Seleccionar', hide: false },
    { def: 'M_Reporte', hide: false },
    { def: 'M_TipoReporte', hide: false },
    { def: 'M_Descripcion', hide: false },
    { def: 'M_CMP', hide: false },
    { def: 'M_ATA', hide: false },
    { def: 'M_Tecnico', hide: false },

    { def: 'M_TecnicoNombre', hide: true },
    { def: 'MR_TipoReporte', hide: true },
    { def: 'MR_FolioReporte', hide: true },
    { def: 'MR_DescripcionReporte', hide: true },
    { def: 'MR_Matricula', hide: true },
    { def: 'MR_Modelo', hide: true },
    { def: 'MR_CodigoComputarizado', hide: true },
    { def: 'MR_ATA', hide: true },
    { def: 'MR_OrigenReporte', hide: true },

  ];


	
	today = new Date;
	consult: boolean = false;
  showButtonMR: boolean = false;
  checkedReportesPreestablecidosOT = false;
  indexEditado: number = 0;
  UserASign0: number = 0;
  UserASign1: number = 0;
  UserASign2: number = 0;
  UserASign3: number = 0;
  UserASign4: number = 0;
  dataSourceRS: any = null;
  matriculaUpdate: any = null;

  constructor(private fb: FormBuilder,
    generalService: GeneralService,
    private Orden_de_TrabajoService: Orden_de_TrabajoService,
    private Tipo_de_Orden_de_TrabajoService: Tipo_de_Orden_de_TrabajoService,
    private AeronaveService: AeronaveService,
    private ModelosService: ModelosService,
    private PropietariosService: PropietariosService,
    private Estatus_ReporteService: Estatus_ReporteService,
    private Detalle_de_Reportes_PrestablecidosService: Detalle_de_Reportes_PrestablecidosService,
    private Detalles_de_trabajo_de_OTService: Detalles_de_trabajo_de_OTService,
    private Crear_ReporteService: Crear_ReporteService,
    private Spartan_UserService: Spartan_UserService,
    private Estatus_de_ReporteService: Estatus_de_ReporteService,
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
    private modalService: NgbModal,
    renderer: Renderer2) {

    this.brf = new BusinessRulesFunctions(renderer, _SpartanService, localStorageHelper);
    const selectedLanguage = this.localStorageHelper.getItemFromLocalStorage(StorageKeys.Language);
    this.translateService.setDefaultLang(selectedLanguage);
    this.translateService.use(selectedLanguage);

    this.model = new Orden_de_Trabajo(this.fb);
    this.Orden_de_TrabajoForm = this.model.buildFormGroup();
    this.Reportes_Prestablecidos_OTItems.removeAt(0);
    this.Detalle_de_Reportes_de_OTItems.removeAt(0);

    this.Seleccionar_Reportes_OTItems.removeAt(0);

    this.Orden_de_TrabajoForm.get('Folio').disable();
    this.Orden_de_TrabajoForm.get('Folio').setValue('Auto');
    this.filterComboObservable().subscribe(x => {
      this.filterCb(x.nameCombo, x.filter);
    });
  }

  TecnicosForm = new FormGroup({
    UsuarioTecnico1Id: new FormControl(),
    UsuarioTecnico2Id: new FormControl(),
    UsuarioTecnico3Id: new FormControl(),
    UsuarioTecnico4Id: new FormControl(),
    UsuarioTecnico5Id: new FormControl()
  });

  async reportesPreestablecidosOT_Toggle(row, event) {
    if(event.checked) {
      console.log('Agrega');

      let model: q = new q();
      model.id = 1;
      model.query = "Select TOP 1 NULL AS Folio, NULL AS Id_Orden_de_Trabajo, B.Reporte_de_inspeccion_de_entrada as Tipo_de_Reporte, NULL AS Folio_de_Reporte, NULL AS Descripcion_de_Reporte, (Select '" + this.Orden_de_TrabajoForm.get('Matricula').value + "') AS Matricula, (Select Descripcion From Modelos Where Clave = " + this.Orden_de_TrabajoForm.get('Modelo').value.Clave + ") as Modelo, NULL AS Codigo_Computarizado, NULL AS Codigo_ATA, Origen_del_Reporte, NULL AS Respuesta_Parcial, NULL AS Respuesta_Total, NULL AS Asignado_a, NULL AS Asignado_a_1, NULL AS Asignado_a_2, NULL AS Asignado_a_3, NULL AS Asignado_a_4, 5 AS Estatus, 0 AS Notificado from (Select 'Obligatorio' AS Origen_del_Reporte) A INNER JOIN CAT__REPORTES_PRESTABLECIDOS B ON A.Origen_del_Reporte = B.Prioridad";
      model.securityCode = "ABC123";

      this._SpartanService.GetRawQuery(model).subscribe(async (result) => {  
        let dt = JSON.parse(result.replace('\\', ''))  
        const data = this.dataSourceDetalle_de_Reportes_de_OT.data;
        for (var i = 0; i < dt.length; i++) {
          let resDt = dt[i];
          resDt.IsDeleted = false;
          resDt.edit = false;
          resDt.isNew = true;
          resDt.Origen_del_Reporte = row.Prioridad;
          resDt.Tipo_de_Reporte = row.Reporte_de_inspeccion_de_entrada;

          let fDetalle_de_Reportes_de_OT = await this.Detalles_de_trabajo_de_OTService.listaSelAll(0, 1, '').toPromise();
            if(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs.length > 0) {
              fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs.forEach((e, i) => {
                
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Email = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Id_User = 0;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Image = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Name = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Role_Spartan_User_Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Username = null;

                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1 = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Email = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Id_User = 0;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Image = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Name = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Role_Spartan_User_Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Username = null;

                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2 = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Email = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Id_User = 0;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Image = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Name = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Role_Spartan_User_Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Username = null;

                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3 = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Email = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Id_User = 0;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Image = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Name = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Role_Spartan_User_Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Username = null;

                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4 = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Email = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Id_User = 0;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Image = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Name = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Role_Spartan_User_Role = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Username = null;

                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Codigo_ATA = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Codigo_Computarizado = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Descripcion_de_Reporte = null;



                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Estatus = 5;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Estatus_Estatus_de_Reporte.Descripcion = "ABIERTO";
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Estatus_Estatus_de_Reporte.Folio = 5;



                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio_de_Reporte = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio_de_Reporte_Crear_Reporte.Folio = 0;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio_de_Reporte_Crear_Reporte.No_Reporte = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Id_Orden_de_Trabajo = null;

                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Matricula = this.Orden_de_TrabajoForm.get('Matricula').value;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Modelo = this.Orden_de_TrabajoForm.get('Modelo').value.Descripcion;

                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Notificado = false;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Origen_del_Reporte = row.Prioridad;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Respuesta_Total = null;
                fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Tipo_de_Reporte = row.Reporte_de_inspeccion_de_entrada;

                data.push(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[0]);

                //SE ASIGNAN LOS DATOS PARA QUE SE REFRESQUE EL MR
                this.dataSourceDetalle_de_Reportes_de_OT.data = data;

              })
            }
        }
      });
    }
    else {
      console.log('Elimina');
      let dtPaso = this.dataSourceDetalle_de_Reportes_de_OT.data.filter(r => r.Tipo_de_Reporte != row.Reporte_de_inspeccion_de_entrada);
      console.log(dtPaso);
      this.dataSourceDetalle_de_Reportes_de_OT.data = dtPaso;
    }
  }

  async reportesSeleccionadosOT_Toggle(row, event?, checked?:boolean) {
    let enter = (event == null)? checked : event.checked;
    if(enter) {
      let model: q = new q();
      model.id = 1;
      model.query = "Select TOP 1 NULL AS Folio, NULL AS Id_Orden_de_Trabajo, B.Reporte_de_inspeccion_de_entrada as Tipo_de_Reporte, NULL AS Folio_de_Reporte, NULL AS Descripcion_de_Reporte, (Select '" + this.Orden_de_TrabajoForm.get('Matricula').value + "') AS Matricula, (Select Descripcion From Modelos Where Clave = " + this.Orden_de_TrabajoForm.get('Modelo').value.Clave + ") as Modelo, NULL AS Codigo_Computarizado, NULL AS Codigo_ATA, Origen_del_Reporte, NULL AS Respuesta_Parcial, NULL AS Respuesta_Total, NULL AS Asignado_a, NULL AS Asignado_a_1, NULL AS Asignado_a_2, NULL AS Asignado_a_3, NULL AS Asignado_a_4, 5 AS Estatus, 0 AS Notificado from (Select 'Obligatorio' AS Origen_del_Reporte) A INNER JOIN CAT__REPORTES_PRESTABLECIDOS B ON A.Origen_del_Reporte = B.Prioridad";
      model.securityCode = "ABC123";

      this._SpartanService.GetRawQuery(model).subscribe((result) => {  
        let dt = JSON.parse(result.replace('\\', ''));  
        
        for (var i = 0; i < dt.length; i++) {
          let resDt = dt[i];
          resDt.IsDeleted = false;
          resDt.edit = false;
          resDt.isNew = true;

          resDt.Folio = null;
          resDt.Codigo_ATA = row.MR_ATA;
          resDt.Codigo_Computarizado = row.MR_CodigoComputarizado;
          resDt.Descripcion_de_Reporte = row.MR_DescripcionReporte;
          resDt.Folio_de_Reporte = row.MR_FolioReporte;
          resDt.Origen_del_Reporte = row.MR_OrigenReporte;
          resDt.Tipo_de_Reporte = row.M_TipoReporte;
          resDt.Asignado_a = row.M_Tecnico;
          resDt.Asignado_a_1 = row.M_TecnicoNombre;

          this.dataSourceRS?.push(resDt);
        }
      });
    }
    else {
      let dtPaso = this.dataSourceRS.filter(r => r.Folio_de_Reporte != row.MR_FolioReporte);
      this.dataSourceRS = dtPaso;
    }
  }

  ValidarTecnicoReportesSeleccionados(): boolean {
    let res: boolean = true;
    this.dataSourceRS.forEach(element => {
      if(!element.Asignado_a) {
        alert(`Por favor seleccione el técnico en los siguientes reportes: ${element.Folio_de_Reporte}`);
        res = false;
      }
    });
    return res;
  }

  GuardarDatos_Seleccionar_Reportes() {

    if(!this.ValidarTecnicoReportesSeleccionados()) {
      return;
    }

    //AQUI GUARDAMOS LOS REPORTES QUE SE SELECCIONAN          
    this.dataSourceRS.forEach(async element => {

      let fDetalle_de_Reportes_de_OT = await this.Detalles_de_trabajo_de_OTService.listaSelAll(0, 1, '').toPromise();
      if(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs.length > 0) {
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs.forEach((e, i) => {
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Email = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Id_User = element.Asignado_a;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Image = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Name = element.Asignado_a_1;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Role_Spartan_User_Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Username = null;
  
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1 = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Email = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Id_User = 0;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Image = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Name = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Role_Spartan_User_Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Username = null;
  
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2 = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Email = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Id_User = 0;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Image = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Name = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Role_Spartan_User_Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Username = null;
  
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3 = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Email = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Id_User = 0;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Image = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Name = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Role_Spartan_User_Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Username = null;
  
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4 = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Email = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Id_User = 0;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Image = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Name = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Role_Spartan_User_Role = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Username = null;
  
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Codigo_ATA = element.Codigo_ATA;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Codigo_Computarizado = element.Codigo_Computarizado;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Descripcion_de_Reporte = element.Descripcion_de_Reporte;                
          
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Estatus = 1;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Estatus_Estatus_de_Reporte.Descripcion = "ASIGNADO";
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Estatus_Estatus_de_Reporte.Folio = 1;

          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio_de_Reporte = element.Folio_de_Reporte;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio_de_Reporte_Crear_Reporte.Folio = element.Folio_de_Reporte;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio_de_Reporte_Crear_Reporte.No_Reporte = null;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Id_Orden_de_Trabajo = null;

          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Matricula = element.Matricula;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Modelo = element.Modelo;

          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Notificado = false;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Origen_del_Reporte = element.Origen_del_Reporte;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Respuesta_Total = element.Respuesta_Total;
          fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Tipo_de_Reporte = element.Tipo_de_Reporte;

          this.dataSourceDetalle_de_Reportes_de_OT.data.push(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[0]);

          //SE ASIGNAN LOS MISMOS DATOS PARA QUE SE REFRESQUE EL MR
          this.dataSourceDetalle_de_Reportes_de_OT.data = this.dataSourceDetalle_de_Reportes_de_OT.data;

        })
      }
    });

    //SE LIMPIA EL DATASOURCE DE PASO
    this.dataSourceRS = this.dataSourceDetalle_de_Reportes_de_OT.data.filter(r => r.Folio == 0);
    this.modalService.dismissAll();
  }

  ChangeSelectCheck(event){

    let dataSetRS = this.dataSourceSeleccionar_Reportes_OT.data;
    
    this.dataSourceSeleccionar_Reportes_OT.data.forEach(element => {
      element.Seleccionar = event.checked;
      this.reportesSeleccionadosOT_Toggle(element, null, event.checked);
      if(this.dataSourceDetalle_de_Reportes_de_OT.data.filter(x => x.Folio_de_Reporte == element.MR_FolioReporte).length > 0) {
        dataSetRS = this.dataSourceSeleccionar_Reportes_OT.data.filter(x => x.MR_FolioReporte != element.MR_FolioReporte);
        this.dataSourceSeleccionar_Reportes_OT.data = dataSetRS;
        
      }
    });

  }

  OpenModalSeleccionar_Reportes(content) {

    let dataSetRS = this.dataSourceSeleccionar_Reportes_OT.data;

    this.dataSourceSeleccionar_Reportes_OT.data.forEach(element => {
      console.log(element);
      element.Seleccionar = true;
      this.reportesSeleccionadosOT_Toggle(element, null, true);
      if(this.dataSourceDetalle_de_Reportes_de_OT.data.filter(x => x.Folio_de_Reporte == element.MR_FolioReporte).length > 0) {
        dataSetRS = this.dataSourceSeleccionar_Reportes_OT.data.filter(x => x.MR_FolioReporte != element.MR_FolioReporte);
        this.dataSourceSeleccionar_Reportes_OT.data = dataSetRS;
        
      }
    });

    if(this.dataSourceSeleccionar_Reportes_OT.data.length == 0) {
      alert("No existen reportes pendientes por asignar a esta Aeronave.");
      return;
    }

    this.dataSourceRS = this.dataSourceDetalle_de_Reportes_de_OT.data.filter(r => r.Folio == 0);
    

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl' }).result.then(
      (result) => {
        console.log(result);
      },
      (reason) => {
        if(reason == 0 || reason == "cerrar" || reason == "cancelar" ) {
          //SE LIMPIA EL DATASOURCE DE PASO
          this.dataSourceRS = this.dataSourceDetalle_de_Reportes_de_OT.data.filter(r => r.Folio == 0);
        }
      },
    );
  }

  ngAfterViewInit(): void {
    this.dataSourceReportes_Prestablecidos_OT.paginator = this.paginator;
    this.dataSourceDetalle_de_Reportes_de_OT.paginator = this.paginator;
    this.dataSourceSeleccionar_Reportes_OT.paginator = this.paginator;

    this.rulesAfterViewInit();
  }

  ngOnInit(): void {
    this.populateControls();
    this.route
      .data
      .subscribe(v => {
        if (v.readOnly) {
          this.Reportes_Prestablecidos_OTColumns.splice(0, 1);
          this.Detalle_de_Reportes_de_OTColumns.splice(0, 1);
          this.Seleccionar_Reportes_OTColumns.splice(0, 1);

          this.Orden_de_TrabajoForm.disable();
          this.operation = "Consult";
          this.consult = true;
        }
      });

    this.dataListConfig = history.state.data;

    this._seguridad
      .permisos(AppConstants.Permisos.Orden_de_Trabajo)
      .subscribe((response) => {
        this.permisos = response;
      });

    this.brf.updateValidatorsToControl(this.Orden_de_TrabajoForm, 'Matricula', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Orden_de_TrabajoForm, 'Modelo', [CustomValidators.autocompleteObjectValidator(), Validators.required]);
    this.brf.updateValidatorsToControl(this.Orden_de_TrabajoForm, 'Propietario', [CustomValidators.autocompleteObjectValidator(), Validators.required]);



    this.rulesOnInit();
  }

  async populateModel(id: number) {

    this.spinner.show('loading');
    let result = await this.Orden_de_TrabajoService.listaSelAll(0, 1, 'Orden_de_Trabajo.Folio=' + id).toPromise();
    if (result.Orden_de_Trabajos.length > 0) {      
      this.matriculaUpdate = result.Orden_de_Trabajos[0].Matricula;

      let fReportes_Prestablecidos_OT = await this.Detalle_de_Reportes_PrestablecidosService.listaSelAll(0, 1000, 'Orden_de_Trabajo.Folio=' + id).toPromise();
      this.Reportes_Prestablecidos_OTData = fReportes_Prestablecidos_OT.Detalle_de_Reportes_Prestablecidoss;
      this.loadReportes_Prestablecidos_OT(fReportes_Prestablecidos_OT.Detalle_de_Reportes_Prestablecidoss);
      this.dataSourceReportes_Prestablecidos_OT = new MatTableDataSource(fReportes_Prestablecidos_OT.Detalle_de_Reportes_Prestablecidoss);
      this.dataSourceReportes_Prestablecidos_OT.paginator = this.paginator;
      this.dataSourceReportes_Prestablecidos_OT.sort = this.sort;
      let fDetalle_de_Reportes_de_OT = await this.Detalles_de_trabajo_de_OTService.listaSelAll(0, 1000, 'Orden_de_Trabajo.Folio=' + id).toPromise();
      this.Detalle_de_Reportes_de_OTData = fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs;
      this.loadDetalle_de_Reportes_de_OT(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs);
      this.dataSourceDetalle_de_Reportes_de_OT = new MatTableDataSource(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs);
      this.dataSourceDetalle_de_Reportes_de_OT.paginator = this.paginator;
      this.dataSourceDetalle_de_Reportes_de_OT.sort = this.sort;

      this.model.fromObject(result.Orden_de_Trabajos[0]);
      this.Orden_de_TrabajoForm.get('Matricula').setValue(
        result.Orden_de_Trabajos[0].Matricula_Aeronave.Matricula,
        { onlySelf: false, emitEvent: true }
      );
      this.Orden_de_TrabajoForm.get('Modelo').setValue(
        result.Orden_de_Trabajos[0].Modelo_Modelos.Descripcion,
        { onlySelf: false, emitEvent: true }
      );
      this.Orden_de_TrabajoForm.get('Propietario').setValue(
        result.Orden_de_Trabajos[0].Propietario_Propietarios.Nombre,
        { onlySelf: false, emitEvent: true }
      );

      this.Orden_de_TrabajoForm.markAllAsTouched();
      this.Orden_de_TrabajoForm.updateValueAndValidity();
      this.spinner.hide('loading');
    } else { this.spinner.hide('loading'); }
  }

  get Reportes_Prestablecidos_OTItems() {
    return this.Orden_de_TrabajoForm.get('Detalle_de_Reportes_PrestablecidosItems') as FormArray;
  }

  get Seleccionar_Reportes_OTItems() {
    return this.Orden_de_TrabajoForm.get('Detalle_de_Reportes_PrestablecidosItems') as FormArray;
  }

  getReportes_Prestablecidos_OTColumns(): string[] {
    return this.Reportes_Prestablecidos_OTColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  getSeleccionar_Reportes_OTColumns(): string[] {
    return this.Seleccionar_Reportes_OTColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadReportes_Prestablecidos_OT(Reportes_Prestablecidos_OT: Detalle_de_Reportes_Prestablecidos[]) {
    Reportes_Prestablecidos_OT.forEach(element => {
      this.addReportes_Prestablecidos_OT(element);
    });
  }

  loadSolicitud_Reportes_OT(Reportes_Prestablecidos_OT: Detalle_de_Reportes_Prestablecidos[]) {
    Reportes_Prestablecidos_OT.forEach(element => {
      this.addReportes_Prestablecidos_OT(element);
    });
  }

  addReportes_Prestablecidos_OTToMR() {
    const Reportes_Prestablecidos_OT = new Detalle_de_Reportes_Prestablecidos(this.fb);
    this.Reportes_Prestablecidos_OTData.push(this.addReportes_Prestablecidos_OT(Reportes_Prestablecidos_OT));
    this.dataSourceReportes_Prestablecidos_OT.data = this.Reportes_Prestablecidos_OTData;
    Reportes_Prestablecidos_OT.edit = true;
    Reportes_Prestablecidos_OT.isNew = true;
    const length = this.dataSourceReportes_Prestablecidos_OT.data.length;
    const index = length - 1;
    const formReportes_Prestablecidos_OT = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;

    const page = Math.ceil(this.dataSourceReportes_Prestablecidos_OT.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addReportes_Prestablecidos_OT(entity: Detalle_de_Reportes_Prestablecidos) {
    const Reportes_Prestablecidos_OT = new Detalle_de_Reportes_Prestablecidos(this.fb);
    this.Reportes_Prestablecidos_OTItems.push(Reportes_Prestablecidos_OT.buildFormGroup());
    if (entity) {
      Reportes_Prestablecidos_OT.fromObject(entity);
    }
    return entity;
  }

  Reportes_Prestablecidos_OTItemsByFolio(Folio: number): FormGroup {
    return (this.Orden_de_TrabajoForm.get('Detalle_de_Reportes_PrestablecidosItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Reportes_Prestablecidos_OTItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    let fb = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;
    return fb;
  }

  Seleccionar_Reportes_OTItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    let fb = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;
    return fb;
  }

  deleteReportes_Prestablecidos_OT(element: any) {
    let index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    this.Reportes_Prestablecidos_OTData[index].IsDeleted = true;
    this.dataSourceReportes_Prestablecidos_OT.data = this.Reportes_Prestablecidos_OTData;
    this.dataSourceReportes_Prestablecidos_OT._updateChangeSubscription();
    index = this.dataSourceReportes_Prestablecidos_OT.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditReportes_Prestablecidos_OT(element: any) {
    let index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Reportes_Prestablecidos_OTData[index].IsDeleted = true;
      this.dataSourceReportes_Prestablecidos_OT.data = this.Reportes_Prestablecidos_OTData;
      this.dataSourceReportes_Prestablecidos_OT._updateChangeSubscription();
      index = this.Reportes_Prestablecidos_OTData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveReportes_Prestablecidos_OT(element: any) {
    const index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    const formReportes_Prestablecidos_OT = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;
    this.Reportes_Prestablecidos_OTData[index].Seleccionar = formReportes_Prestablecidos_OT.value.Seleccionar;
    this.Reportes_Prestablecidos_OTData[index].Reporte_de_inspeccion_de_entrada = formReportes_Prestablecidos_OT.value.Reporte_de_inspeccion_de_entrada;
    this.Reportes_Prestablecidos_OTData[index].Tipo_de_reporte = formReportes_Prestablecidos_OT.value.Tipo_de_reporte;
    this.Reportes_Prestablecidos_OTData[index].Prioridad = formReportes_Prestablecidos_OT.value.Prioridad;
    this.Reportes_Prestablecidos_OTData[index].Tipo_de_Codigo = formReportes_Prestablecidos_OT.value.Tipo_de_Codigo;
    this.Reportes_Prestablecidos_OTData[index].Codigo_NP = formReportes_Prestablecidos_OT.value.Codigo_NP;
    this.Reportes_Prestablecidos_OTData[index].Descripcion = formReportes_Prestablecidos_OT.value.Descripcion;

    this.Reportes_Prestablecidos_OTData[index].isNew = false;
    this.dataSourceReportes_Prestablecidos_OT.data = this.Reportes_Prestablecidos_OTData;
    this.dataSourceReportes_Prestablecidos_OT._updateChangeSubscription();
  }

  editReportes_Prestablecidos_OT(element: any) {
    const index = this.dataSourceReportes_Prestablecidos_OT.data.indexOf(element);
    const formReportes_Prestablecidos_OT = this.Reportes_Prestablecidos_OTItems.controls[index] as FormGroup;

    element.edit = true;
  }

  async saveDetalle_de_Reportes_Prestablecidos(Folio: number) {
    this.dataSourceReportes_Prestablecidos_OT.data.forEach(async (d, index) => {
      let model = d;
      model.id_orden_de_trabajo = Folio;
      model.Folio = model.Folio == null ? 0 : model.Folio;

      if (model.Folio === 0) {
        // Add Reportes Preestablecidos OT
        let response = await this.Detalle_de_Reportes_PrestablecidosService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formReportes_Prestablecidos_OT = this.Reportes_Prestablecidos_OTItemsByFolio(model.Folio);
        if (formReportes_Prestablecidos_OT.dirty) {
          // Update Reportes Preestablecidos OT
          let response = await this.Detalle_de_Reportes_PrestablecidosService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Reportes Preestablecidos OT
        await this.Detalle_de_Reportes_PrestablecidosService.delete(model.Folio).toPromise();
      }
    });
  }


  get Detalle_de_Reportes_de_OTItems() {
    return this.Orden_de_TrabajoForm.get('Detalles_de_trabajo_de_OTItems') as FormArray;
  }

  getDetalle_de_Reportes_de_OTColumns(): string[] {
    return this.Detalle_de_Reportes_de_OTColumns.filter(cd => !cd.hide).map(cd => cd.def);
  }

  loadDetalle_de_Reportes_de_OT(Detalle_de_Reportes_de_OT: Detalles_de_trabajo_de_OT[]) {
    Detalle_de_Reportes_de_OT.forEach(element => {
      this.addDetalle_de_Reportes_de_OT(element);
    });
  }

  addDetalle_de_Reportes_de_OTToMR() {
    const Detalle_de_Reportes_de_OT = new Detalles_de_trabajo_de_OT(this.fb);
    this.Detalle_de_Reportes_de_OTData.push(this.addDetalle_de_Reportes_de_OT(Detalle_de_Reportes_de_OT));
    this.dataSourceDetalle_de_Reportes_de_OT.data = this.Detalle_de_Reportes_de_OTData;
    Detalle_de_Reportes_de_OT.edit = true;
    Detalle_de_Reportes_de_OT.isNew = true;
    const length = this.dataSourceDetalle_de_Reportes_de_OT.data.length;
    const index = length - 1;
    const formDetalle_de_Reportes_de_OT = this.Detalle_de_Reportes_de_OTItems.controls[index] as FormGroup;
    this.addFilterToControlFolio_de_Reporte_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Folio_de_Reporte, index);
    this.addFilterToControlAsignado_a_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a, index);
    this.addFilterToControlAsignado_a_1_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_1, index);
    this.addFilterToControlAsignado_a_2_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_2, index);
    this.addFilterToControlAsignado_a_3_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_3, index);
    this.addFilterToControlAsignado_a_4_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_4, index);

    const page = Math.ceil(this.dataSourceDetalle_de_Reportes_de_OT.data.filter(d => !d.IsDeleted).length / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  addDetalle_de_Reportes_de_OT(entity: Detalles_de_trabajo_de_OT) {
    const Detalle_de_Reportes_de_OT = new Detalles_de_trabajo_de_OT(this.fb);
    this.Detalle_de_Reportes_de_OTItems.push(Detalle_de_Reportes_de_OT.buildFormGroup());
    if (entity) {
      Detalle_de_Reportes_de_OT.fromObject(entity);
    }
    return entity;
  }

  Detalle_de_Reportes_de_OTItemsByFolio(Folio: number): FormGroup {
    return (this.Orden_de_TrabajoForm.get('Detalles_de_trabajo_de_OTItems') as FormArray).controls.find(c => c.get('Folio').value === Folio) as FormGroup;
  }

  Detalle_de_Reportes_de_OTItemsByElemet(element: any): FormGroup {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    let fb = this.Detalle_de_Reportes_de_OTItems.controls[index] as FormGroup;
    return fb;
  }

  deleteDetalle_de_Reportes_de_OT(element: any) {
    let index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.Detalle_de_Reportes_de_OTData[index].IsDeleted = true;
    this.dataSourceDetalle_de_Reportes_de_OT.data = this.Detalle_de_Reportes_de_OTData;
    this.dataSourceDetalle_de_Reportes_de_OT._updateChangeSubscription();
    index = this.dataSourceDetalle_de_Reportes_de_OT.data.filter(d => !d.IsDeleted).length;
    const page = Math.ceil(index / this.paginator.pageSize);
    if (page !== this.paginator.pageIndex) {
      this.paginator.pageIndex = page;
    }
  }

  cancelEditDetalle_de_Reportes_de_OT(element: any) {
    let index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    element.edit = false;
    if (element.isNew) {
      this.Detalle_de_Reportes_de_OTData[index].IsDeleted = true;
      this.dataSourceDetalle_de_Reportes_de_OT.data = this.Detalle_de_Reportes_de_OTData;
      this.dataSourceDetalle_de_Reportes_de_OT._updateChangeSubscription();
      index = this.Detalle_de_Reportes_de_OTData.filter(d => !d.IsDeleted).length;
      const page = Math.ceil(index / this.paginator.pageSize);
      if (page !== this.paginator.pageIndex) {
        this.paginator.pageIndex = page;
      }
    }
  }

  async saveDetalle_de_Reportes_de_OT(element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    const formDetalle_de_Reportes_de_OT = this.Detalle_de_Reportes_de_OTItems.controls[index] as FormGroup;
    this.Detalle_de_Reportes_de_OTData[index].Tipo_de_Reporte = formDetalle_de_Reportes_de_OT.value.Tipo_de_Reporte;
    if (this.Detalle_de_Reportes_de_OTData[index].Folio_de_Reporte !== formDetalle_de_Reportes_de_OT.value.Folio_de_Reporte && formDetalle_de_Reportes_de_OT.value.Folio_de_Reporte > 0) {
      let crear_reporte = await this.Crear_ReporteService.getById(formDetalle_de_Reportes_de_OT.value.Folio_de_Reporte).toPromise();
      this.Detalle_de_Reportes_de_OTData[index].Folio_de_Reporte_Crear_Reporte = crear_reporte;
    }
    this.Detalle_de_Reportes_de_OTData[index].Folio_de_Reporte = formDetalle_de_Reportes_de_OT.value.Folio_de_Reporte;
    this.Detalle_de_Reportes_de_OTData[index].Descripcion_de_Reporte = formDetalle_de_Reportes_de_OT.value.Descripcion_de_Reporte;
    this.Detalle_de_Reportes_de_OTData[index].Matricula = formDetalle_de_Reportes_de_OT.value.Matricula;
    this.Detalle_de_Reportes_de_OTData[index].Modelo = formDetalle_de_Reportes_de_OT.value.Modelo;
    this.Detalle_de_Reportes_de_OTData[index].Codigo_Computarizado = formDetalle_de_Reportes_de_OT.value.Codigo_Computarizado;
    this.Detalle_de_Reportes_de_OTData[index].Codigo_ATA = formDetalle_de_Reportes_de_OT.value.Codigo_ATA;
    this.Detalle_de_Reportes_de_OTData[index].Origen_del_Reporte = formDetalle_de_Reportes_de_OT.value.Origen_del_Reporte;
    this.Detalle_de_Reportes_de_OTData[index].Respuesta_Total = formDetalle_de_Reportes_de_OT.value.Respuesta_Total;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a !== formDetalle_de_Reportes_de_OT.value.Asignado_a && formDetalle_de_Reportes_de_OT.value.Asignado_a > 0) {
      let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a).toPromise();
      this.Detalle_de_Reportes_de_OTData[index].Asignado_a_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a = formDetalle_de_Reportes_de_OT.value.Asignado_a;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a_1 !== formDetalle_de_Reportes_de_OT.value.Asignado_a_1 && formDetalle_de_Reportes_de_OT.value.Asignado_a_1 > 0) {
      let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a_1).toPromise();
      this.Detalle_de_Reportes_de_OTData[index].Asignado_a_1_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a_1 = formDetalle_de_Reportes_de_OT.value.Asignado_a_1;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a_2 !== formDetalle_de_Reportes_de_OT.value.Asignado_a_2 && formDetalle_de_Reportes_de_OT.value.Asignado_a_2 > 0) {
      let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a_2).toPromise();
      this.Detalle_de_Reportes_de_OTData[index].Asignado_a_2_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a_2 = formDetalle_de_Reportes_de_OT.value.Asignado_a_2;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a_3 !== formDetalle_de_Reportes_de_OT.value.Asignado_a_3 && formDetalle_de_Reportes_de_OT.value.Asignado_a_3 > 0) {
      let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a_3).toPromise();
      this.Detalle_de_Reportes_de_OTData[index].Asignado_a_3_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a_3 = formDetalle_de_Reportes_de_OT.value.Asignado_a_3;
    if (this.Detalle_de_Reportes_de_OTData[index].Asignado_a_4 !== formDetalle_de_Reportes_de_OT.value.Asignado_a_4 && formDetalle_de_Reportes_de_OT.value.Asignado_a_4 > 0) {
      let spartan_user = await this.Spartan_UserService.getById(formDetalle_de_Reportes_de_OT.value.Asignado_a_4).toPromise();
      this.Detalle_de_Reportes_de_OTData[index].Asignado_a_4_Spartan_User = spartan_user;
    }
    this.Detalle_de_Reportes_de_OTData[index].Asignado_a_4 = formDetalle_de_Reportes_de_OT.value.Asignado_a_4;
    this.Detalle_de_Reportes_de_OTData[index].Estatus = formDetalle_de_Reportes_de_OT.value.Estatus;
    this.Detalle_de_Reportes_de_OTData[index].Estatus_Estatus_de_Reporte = formDetalle_de_Reportes_de_OT.value.Estatus !== '' ?
      this.varEstatus_de_Reporte.filter(d => d.Folio === formDetalle_de_Reportes_de_OT.value.Estatus)[0] : null;
    this.Detalle_de_Reportes_de_OTData[index].Notificado = formDetalle_de_Reportes_de_OT.value.Notificado;

    this.Detalle_de_Reportes_de_OTData[index].isNew = false;
    this.dataSourceDetalle_de_Reportes_de_OT.data = this.Detalle_de_Reportes_de_OTData;
    this.dataSourceDetalle_de_Reportes_de_OT._updateChangeSubscription();
  }

  editDetalle_de_Reportes_de_OT(element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    const formDetalle_de_Reportes_de_OT = this.Detalle_de_Reportes_de_OTItems.controls[index] as FormGroup;
    this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Folio_de_Reporte_Crear_Reporte.No_Reporte;
    this.addFilterToControlFolio_de_Reporte_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Folio_de_Reporte, index);
    this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_Spartan_User.Name;
    this.addFilterToControlAsignado_a_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a, index);
    this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_1_Spartan_User.Name;
    this.addFilterToControlAsignado_a_1_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_1, index);
    this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_2_Spartan_User.Name;
    this.addFilterToControlAsignado_a_2_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_2, index);
    this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_3_Spartan_User.Name;
    this.addFilterToControlAsignado_a_3_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_3, index);
    this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index] = this.dataSourceDetalle_de_Reportes_de_OT.data[index].Asignado_a_4_Spartan_User.Name;
    this.addFilterToControlAsignado_a_4_Detalles_de_trabajo_de_OT(formDetalle_de_Reportes_de_OT.controls.Asignado_a_4, index);

    element.edit = true;
  }

  async saveDetalles_de_trabajo_de_OT(Folio: number) {
    this.dataSourceDetalle_de_Reportes_de_OT.data.forEach(async (d, index) => {
      let model = d;
      model.Folio = model.Folio == null ? 0 : model.Folio;
      model.Id_Orden_de_Trabajo = Folio;
      model.Asignado_a = model.Asignado_a_Spartan_User.Id_User == 0 ? null : model.Asignado_a_Spartan_User.Id_User;
      model.Asignado_a_1 = model.Asignado_a_1_Spartan_User.Id_User == 0 ? null : model.Asignado_a_1_Spartan_User.Id_User;
      model.Asignado_a_2 = model.Asignado_a_2_Spartan_User.Id_User == 0 ? null : model.Asignado_a_2_Spartan_User.Id_User;
      model.Asignado_a_3 = model.Asignado_a_3_Spartan_User.Id_User == 0 ? null : model.Asignado_a_3_Spartan_User.Id_User;
      model.Asignado_a_4 = model.Asignado_a_4_Spartan_User.Id_User == 0 ? null : model.Asignado_a_4_Spartan_User.Id_User;

      if (model.Folio === 0) {
        // Add Reportes de OT 
        let response = await this.Detalles_de_trabajo_de_OTService.insert(model).toPromise();
      } else if (model.Folio > 0 && !d.IsDeleted) {
        const formDetalle_de_Reportes_de_OT = this.Detalle_de_Reportes_de_OTItemsByFolio(model.Folio);
        if (formDetalle_de_Reportes_de_OT.dirty) {
        // Update Reportes de OT 
        let response = await this.Detalles_de_trabajo_de_OTService.update(model.Folio, model).toPromise();
        }
      } else if (model.Folio > 0 && d.IsDeleted) {
        // delete Reportes de OT 
        await this.Detalles_de_trabajo_de_OTService.delete(model.Folio).toPromise();
      }
    });
  }

  public selectFolio_de_Reporte_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
    let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Folio_de_Reporte.setValue(event.option.value);
    this.displayFnFolio_de_Reporte_Detalles_de_trabajo_de_OT(element);
  }

  displayFnFolio_de_Reporte_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionFolio_de_Reporte_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  }

  _filterFolio_de_Reporte_Detalles_de_trabajo_de_OT(filter: any): Observable<Crear_Reporte> {
    const where = filter !== '' ? "Crear_Reporte.No_Reporte like '%" + filter + "%'" : '';
    return this.Crear_ReporteService.listaSelAll(0, 20, where);
  }

  addFilterToControlFolio_de_Reporte_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingFolio_de_Reporte_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingFolio_de_Reporte_Detalles_de_trabajo_de_OT = true;
        return this._filterFolio_de_Reporte_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varCrear_Reporte = result.Crear_Reportes;
      this.isLoadingFolio_de_Reporte_Detalles_de_trabajo_de_OT = false;
      this.searchFolio_de_Reporte_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index] = this.varCrear_Reporte.length === 0 ? '' : this.SelectedFolio_de_Reporte_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
    let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a.setValue(event.option.value);
    this.displayFnAsignado_a_Detalles_de_trabajo_de_OT(element);
  }

  displayFnAsignado_a_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  }

  _filterAsignado_a_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
    const where = filter !== '' ? "Spartan_User.Name like '%" + filter + "%'" : '';
    return this.Spartan_UserService.listaSelAll(0, 20, where);
  }

  addFilterToControlAsignado_a_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.varSpartan_UserASign1 = result.Spartan_Users;
      this.varSpartan_UserASign2 = result.Spartan_Users;
      this.varSpartan_UserASign3 = result.Spartan_Users;
      this.varSpartan_UserASign4 = result.Spartan_Users;
      this.varSpartan_UserASign5 = result.Spartan_Users;
      this.isLoadingAsignado_a_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_1_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
    let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_1.setValue(event.option.value);
    this.displayFnAsignado_a_1_Detalles_de_trabajo_de_OT(element);
  }

  displayFnAsignado_a_1_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_1_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  }

  _filterAsignado_a_1_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
    const where = filter !== '' ? "Spartan_User.Name like '%" + filter + "%'" : '';
    return this.Spartan_UserService.listaSelAll(0, 20, where);
  }

  addFilterToControlAsignado_a_1_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_1_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_1_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_1_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.varSpartan_UserASign1 = result.Spartan_Users;
      this.varSpartan_UserASign2 = result.Spartan_Users;
      this.varSpartan_UserASign3 = result.Spartan_Users;
      this.varSpartan_UserASign4 = result.Spartan_Users;
      this.varSpartan_UserASign5 = result.Spartan_Users;
      this.isLoadingAsignado_a_1_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_1_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_1_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_2_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
    let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_2.setValue(event.option.value);
    this.displayFnAsignado_a_2_Detalles_de_trabajo_de_OT(element);
  }

  displayFnAsignado_a_2_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_2_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  }

  _filterAsignado_a_2_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
    const where = filter !== '' ? "Spartan_User.Name like '%" + filter + "%'" : '';
    return this.Spartan_UserService.listaSelAll(0, 20, where);
  }

  addFilterToControlAsignado_a_2_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_2_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_2_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_2_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.varSpartan_UserASign1 = result.Spartan_Users;
      this.varSpartan_UserASign2 = result.Spartan_Users;
      this.varSpartan_UserASign3 = result.Spartan_Users;
      this.varSpartan_UserASign4 = result.Spartan_Users;
      this.varSpartan_UserASign5 = result.Spartan_Users;
      this.isLoadingAsignado_a_2_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_2_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_2_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_3_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
    let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_3.setValue(event.option.value);
    this.displayFnAsignado_a_3_Detalles_de_trabajo_de_OT(element);
  }

  displayFnAsignado_a_3_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_3_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  }

  _filterAsignado_a_3_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
    const where = filter !== '' ? "Spartan_User.Name like '%" + filter + "%'" : '';
    return this.Spartan_UserService.listaSelAll(0, 20, where);
  }

  addFilterToControlAsignado_a_3_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_3_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_3_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_3_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.varSpartan_UserASign1 = result.Spartan_Users;
      this.varSpartan_UserASign2 = result.Spartan_Users;
      this.varSpartan_UserASign3 = result.Spartan_Users;
      this.varSpartan_UserASign4 = result.Spartan_Users;
      this.varSpartan_UserASign5 = result.Spartan_Users;
      this.isLoadingAsignado_a_3_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_3_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_3_Detalles_de_trabajo_de_OT[index];
    });
  }
  public selectAsignado_a_4_Detalles_de_trabajo_de_OT(event: MatAutocompleteSelectedEvent, element: any): void {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    if (!event.option) {
      return;
    }
    this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index] = event.option.viewValue;
    let fgr = this.Orden_de_TrabajoForm.controls.Detalles_de_trabajo_de_OTItems as FormArray;
    let data = fgr.controls[index] as FormGroup;
    data.controls.Asignado_a_4.setValue(event.option.value);
    this.displayFnAsignado_a_4_Detalles_de_trabajo_de_OT(element);
  }

  displayFnAsignado_a_4_Detalles_de_trabajo_de_OT(this, element) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    return this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index];
  }
  updateOptionAsignado_a_4_Detalles_de_trabajo_de_OT(event, element: any) {
    const index = this.dataSourceDetalle_de_Reportes_de_OT.data.indexOf(element);
    this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index] = event.source.viewValue;
  }

  _filterAsignado_a_4_Detalles_de_trabajo_de_OT(filter: any): Observable<Spartan_User> {
    const where = filter !== '' ? "Spartan_User.Name like '%" + filter + "%'" : '';
    return this.Spartan_UserService.listaSelAll(0, 20, where);
  }

  addFilterToControlAsignado_a_4_Detalles_de_trabajo_de_OT(control: any, index) {
    control.valueChanges.pipe(
      startWith(''),
      debounceTime(1000),
      tap(() => this.isLoadingAsignado_a_4_Detalles_de_trabajo_de_OT = true),
      distinctUntilChanged(),
      switchMap((value: any) => {
        this.isLoadingAsignado_a_4_Detalles_de_trabajo_de_OT = true;
        return this._filterAsignado_a_4_Detalles_de_trabajo_de_OT(value || '');
      })
    ).subscribe(result => {
      this.varSpartan_User = result.Spartan_Users;
      this.varSpartan_UserASign1 = result.Spartan_Users;
      this.varSpartan_UserASign2 = result.Spartan_Users;
      this.varSpartan_UserASign3 = result.Spartan_Users;
      this.varSpartan_UserASign4 = result.Spartan_Users;
      this.varSpartan_UserASign5 = result.Spartan_Users;
      this.isLoadingAsignado_a_4_Detalles_de_trabajo_de_OT = false;
      this.searchAsignado_a_4_Detalles_de_trabajo_de_OTCompleted = true;
      this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index] = this.varSpartan_User.length === 0 ? '' : this.SelectedAsignado_a_4_Detalles_de_trabajo_de_OT[index];
    });
  }



  getParamsFromUrl() {
    this.route.paramMap.subscribe(
      params => {
        this.model.Folio = +params.get('id');

        if (this.model.Folio) {
          this.operation = !this.Orden_de_TrabajoForm.disabled ? "Update" : this.operation;
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

  async getTecnicos() {
    let result = [];
    let matricula = this.operation == "Update" ? this.matriculaUpdate : this.Orden_de_TrabajoForm.get('Matricula').value;
    result = await this.brf.EvaluaQueryDictionaryAsync(`EXEC uspFiltrarTecnicosPorAeronave '${matricula}'`, 1, 'ABC123');    
    this.varSpartan_UserASign1 = result;
    this.varSpartan_UserASign2 = result;
    this.varSpartan_UserASign3 = result;
    this.varSpartan_UserASign4 = result;
    this.varSpartan_UserASign5 = result;
  }

  populateControls() {
    const observablesArray: Observable<any>[] = [];
    observablesArray.push(this.Tipo_de_Orden_de_TrabajoService.getAll());
    observablesArray.push(this.Estatus_ReporteService.getAll());

    observablesArray.push(this.Estatus_de_ReporteService.getAll());

    if (observablesArray.length > 0) {
      forkJoin(observablesArray)
        .subscribe(([varTipo_de_Orden_de_Trabajo, varEstatus_Reporte, varEstatus_de_Reporte, 
        ]) => {
          this.varTipo_de_Orden_de_Trabajo = varTipo_de_Orden_de_Trabajo;
          this.varEstatus_Reporte = varEstatus_Reporte;
          this.varEstatus_de_Reporte = varEstatus_de_Reporte;

          this.getParamsFromUrl();
        });
    } else {
      this.getParamsFromUrl();
    }

    this.Orden_de_TrabajoForm.get('Matricula').valueChanges.pipe(
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
      if (this.operation == "Update") {
        this.Orden_de_TrabajoForm.get('Matricula').setValue(result?.Aeronaves[0].Matricula, { onlySelf: true, emitEvent: false });
      }
      this.optionsMatricula = of(result?.Aeronaves);
    }, error => {
      this.isLoadingMatricula = false;
      this.hasOptionsMatricula = false;
      this.optionsMatricula = of([]);
    });
    this.Orden_de_TrabajoForm.get('Modelo').valueChanges.pipe(
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
      if (this.operation == "Update") {
        this.Orden_de_TrabajoForm.get('Modelo').setValue(result?.Modeloss[0], { onlySelf: true, emitEvent: false });
      }

      this.optionsModelo = of(result?.Modeloss);
    }, error => {
      this.isLoadingModelo = false;
      this.hasOptionsModelo = false;
      this.optionsModelo = of([]);
    });
    this.Orden_de_TrabajoForm.get('Propietario').valueChanges.pipe(
      startWith(''),
      debounceTime(1),
      tap(() => this.isLoadingPropietario = true),
      distinctUntilChanged(),
      switchMap(value => {
       // if (!value) return this.PropietariosService.listaSelAll(0, 20, '');
        if (typeof value === 'string') {
          if (value === '') return this.PropietariosService.listaSelAll(0, 20, '');
          return this.PropietariosService.listaSelAll(0, 20,
            "Propietarios.Nombre = '" + value.trimLeft().trimRight() + "'");
        }
        return this.PropietariosService.listaSelAll(0, 20,
          "Propietarios.Nombre = '" + value.Nombre.trimLeft().trimRight() + "'");
      })
    ).subscribe(result => {
      this.isLoadingPropietario = false;
      this.hasOptionsPropietario = result?.Propietarioss?.length > 0;
      if (this.operation == "Update") {
        this.Orden_de_TrabajoForm.get('Propietario').setValue(result?.Propietarioss[0], { onlySelf: true, emitEvent: false });
      }
      this.optionsPropietario = of(result?.Propietarioss);
    }, error => {
      this.isLoadingPropietario = false;
      this.hasOptionsPropietario = false;
      this.optionsPropietario = of([]);
    });


  }


  filterCb(combo: string, filter: string) {
    switch (combo) {
      case 'Tipo_de_orden': {
        this.Tipo_de_Orden_de_TrabajoService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varTipo_de_Orden_de_Trabajo = x.Tipo_de_Orden_de_Trabajos;
        });
        break;
      }
      case 'Estatus': {
        this.Estatus_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_Reporte = x.Estatus_Reportes;
        });
        break;
      }

      case 'Estatus': {
        this.Estatus_de_ReporteService.listaSelAll(1, 1000, filter).subscribe(x => {
          this.varEstatus_de_Reporte = x.Estatus_de_Reportes;
        });
        break;
      }


      default: {
        break;
      }
    }
  }

  displayFnMatricula(option: Aeronave) {
    return option?.Matricula;
  }
  displayFnModelo(option: Modelos) {
    return option?.Descripcion;
  }
  displayFnPropietario(option: Propietarios) {
    return option?.Nombre;
  }

  //Open Modal
  OpenModalReportOT(content, element) {
    for(let i = 0; i => this.dataSourceDetalle_de_Reportes_de_OT.data.length; i++){

      if(element.Folio_de_Reporte == null) {
        if(this.dataSourceDetalle_de_Reportes_de_OT.data[i].Tipo_de_Reporte == element.Tipo_de_Reporte){
          this.indexEditado = i;
          break;
        }
      }
      else {
        if(this.dataSourceDetalle_de_Reportes_de_OT.data[i].Folio_de_Reporte == element.Folio_de_Reporte){
          this.indexEditado = i;
          break;
        }
      }
    }

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'lg' }).result.then(
      (result) => {
      },
      (reason) => {
      },
    );
  }

  //SaveModal
  SaveReportOTModal() {
    let UserASign0Name = this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign0).length > 0 ? this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign0)[0].Description : "";  
    let UserASign1Name = this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign1).length > 0 ? this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign1)[0].Description : "";        
    let UserASign2Name = this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign2).length > 0 ? this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign2)[0].Description : "";     
    let UserASign3Name = this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign3).length > 0 ? this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign3)[0].Description : "";    
    let UserASign4Name = this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign4).length > 0 ? this.varSpartan_UserASign1.filter(x => x.Clave == this.UserASign4)[0].Description : "";  

    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_Spartan_User.Id_User = this.UserASign0;
    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_Spartan_User.Name = UserASign0Name;

    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_1_Spartan_User.Id_User = this.UserASign1;
    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_1_Spartan_User.Name = UserASign1Name;

    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_2_Spartan_User.Id_User = this.UserASign2;
    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_2_Spartan_User.Name = UserASign2Name;

    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_3_Spartan_User.Id_User = this.UserASign3;
    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_3_Spartan_User.Name = UserASign3Name;

    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_4_Spartan_User.Id_User = this.UserASign4;
    this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Asignado_a_4_Spartan_User.Name = UserASign4Name;

    if(this.UserASign0 > 0 || this.UserASign1 > 0 || this.UserASign2 > 0 || this.UserASign3 > 0 || this.UserASign4 > 0) {
      this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Estatus = 1;
      this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Estatus_Estatus_de_Reporte.Folio = 1;      
      this.dataSourceDetalle_de_Reportes_de_OT.data[this.indexEditado].Estatus_Estatus_de_Reporte.Descripcion = "ASIGNADO";      
    }

    UserASign0Name = "";
    UserASign1Name = "";
    UserASign2Name = "";
    UserASign3Name = "";
    UserASign4Name = "";

    this.UserASign0 = 0;
    this.UserASign1 = 0;
    this.UserASign2 = 0;
    this.UserASign3 = 0;
    this.UserASign4 = 0;

    this.TecnicosForm.get('UsuarioTecnico1Id').setValue('');
    this.TecnicosForm.get('UsuarioTecnico2Id').setValue('');
    this.TecnicosForm.get('UsuarioTecnico3Id').setValue('');
    this.TecnicosForm.get('UsuarioTecnico4Id').setValue('');
    this.TecnicosForm.get('UsuarioTecnico5Id').setValue('');

    this.modalService.dismissAll();
  }

  async TecnicoReporteSeleccionado_ExecuteBusinessRules(option, element) {
    let username = await this.brf.EvaluaQueryAsync(`SELECT Name FROM Spartan_User WHERE Id_User = ${option.value}`, 1, "ABC123");

    element.M_Tecnico = option.value;
    element.M_TecnicoNombre = username;

    if(this.dataSourceRS.filter(r => r.Folio_de_Reporte == element.MR_FolioReporte).length > 0){
      this.dataSourceRS.filter(r => r.Folio_de_Reporte == element.MR_FolioReporte)[0].Asignado_a = option.value;
      this.dataSourceRS.filter(r => r.Folio_de_Reporte == element.MR_FolioReporte)[0].Asignado_a_1 = username;
    }
  }

  UserASign1_ExecuteBusinessRules(option) {
    this.UserASign0 = option.value;

    if(this.UserASign0 > 0) {
      if(this.UserASign0 == this.UserASign1 || this.UserASign0 == this.UserASign2 || this.UserASign0 == this.UserASign3 || this.UserASign0 == this.UserASign4) {
        this.TecnicosForm.get('UsuarioTecnico1Id').setValue('');
        alert('Ya se tiene asignado al mismo técnico en este reporte.');
        this.UserASign0 = 0;
      }
    }
  }

  UserASign2_ExecuteBusinessRules(option) {
    this.UserASign1 = option.value;

    if(this.UserASign1 > 0) {
      if(this.UserASign1 == this.UserASign0 || this.UserASign1 == this.UserASign2 || this.UserASign1 == this.UserASign3 || this.UserASign1 == this.UserASign4) {
        this.TecnicosForm.get('UsuarioTecnico2Id').setValue('');
        alert('Ya se tiene asignado al mismo técnico en este reporte.');
        this.UserASign1 = 0;
      }
    }
  }

  UserASign3_ExecuteBusinessRules(option) {
    this.UserASign2 = option.value;

    if(this.UserASign2 > 0) {
      if(this.UserASign2 == this.UserASign0 || this.UserASign2 == this.UserASign1 || this.UserASign2 == this.UserASign3 || this.UserASign2 == this.UserASign4) {
        this.TecnicosForm.get('UsuarioTecnico3Id').setValue('');
        alert('Ya se tiene asignado al mismo técnico en este reporte.');
        this.UserASign2 = 0;
      }
    }
  }

  UserASign4_ExecuteBusinessRules(option) {
    this.UserASign3 = option.value;

    if(this.UserASign3 > 0) {
      if(this.UserASign3 == this.UserASign0 || this.UserASign3 == this.UserASign1 || this.UserASign3 == this.UserASign2 || this.UserASign3 == this.UserASign4) {
        this.TecnicosForm.get('UsuarioTecnico4Id').setValue('');
        alert('Ya se tiene asignado al mismo técnico en este reporte.');
        this.UserASign3 = 0;
      }
    }
  }

  UserASign5_ExecuteBusinessRules(option) {
    this.UserASign4 = option.value;

    if(this.UserASign4 > 0) {
      if(this.UserASign4 == this.UserASign0 || this.UserASign4 == this.UserASign1 || this.UserASign4 == this.UserASign2 || this.UserASign4 == this.UserASign3) {
        this.TecnicosForm.get('UsuarioTecnico5Id').setValue('');
        alert('Ya se tiene asignado al mismo técnico en este reporte.');
        this.UserASign4 = 0;
      }
    }
  }

  CancelReportOTModal() {
    this.modalService.dismissAll();
  }

  validacion(): boolean {
    let resultado: boolean = true;

    /* INICIO VALIDAR QUE NO GUARDE SI HAY REPORTES CON ESTATUS DIFERENTE DE TRABAJADO Y SON OBLIGATORIOS AGUSTÍN */
    // Comprueba operación si es nuevo o al editar
    if (this.operation == 'Update') {
      // Comprueba estatus es igual a Abierto
      if (this.Orden_de_TrabajoForm.get('Estatus').value == 1) {
        // Recuperar filas de MR Detalles_de_trabajo_de_OT
        let data = this.dataSourceDetalle_de_Reportes_de_OT.data;
        // Variable 1 = reportes que no cumplen la condicion / 0 = reportes que cumplen con la condición
        let estatus: number = 0;

        // Recorremos los campos de cada row
        for (let i = 0; i < data.length; i++) {
          if (data[i].Origen_del_Reporte == 'Obligatorio' && data[i].Estatus_Estatus_de_Reporte.Descripcion != 'TRABAJADO') {
            estatus = 1;
            break;
          }
        }

        // Validación del result
        if (estatus == 1) {
          alert('No se puede cerrar la OT si existen reportes obligatorios abiertos.');
			    resultado = false;
        }
        else {
          resultado = true;
        }
      }
    }
    /* FIN VALIDAR QUE NO GUARDE SI HAY REPORTES CON ESTATUS DIFERENTE DE TRABAJADO Y SON OBLIGATORIOS AGUSTÍN */

    //VALIDAR QUE NO PERMITA GUARDAR SI EN EL MR REPORTES HAY ABIERTOS - FELIPE RODRÍGUEZ
    if (this.operation == 'Update') {
      if (this.Orden_de_TrabajoForm.get('Estatus').value == 1) {
        //Detalles_de_trabajo_de_OT
        let rows = this.dataSourceDetalle_de_Reportes_de_OT.data;
        let estatus: number = 0;

        for (let i = 0; i < rows.length; i++) {
          if (rows[i].Estatus_Estatus_de_Reporte.Descripcion == 'TRABAJADO' || rows[i].Estatus_Estatus_de_Reporte.Descripcion == 'CANCELADO') {
            estatus = 0;
          }
          else{
            estatus = 1;
            break;
          }
        }

        if (estatus == 1) {
          if (confirm("Existen reportes abiertos, favor de confirmar (OK) si los reportes abiertos se moverán a la bandeja de Por asignar.")) {
            console.log('Aceptó.');
          }
          else{
            console.log('Rechazó.');
            resultado = false;
          }
        }
      }
    }
    //VALIDAR QUE NO PERMITA GUARDAR SI EN EL MR REPORTES HAY ABIERTOS - FELIPE RODRÍGUEZ


    return resultado;
    
  }

  async save() {
    if(!this.validacion()) {
      return;
    }

    await this.saveData();
    this.goToList();

    //setTimeout(() => { this.goToList(); }, 10000);
  }

  async saveData(): Promise<any> {
    this.isLoading = true;
    this.spinner.show('loading');
    if (this.rulesBeforeSave()) {
      const entity = this.Orden_de_TrabajoForm.value;
      entity.Folio = this.model.Folio;
      entity.Matricula = this.Orden_de_TrabajoForm.get('Matricula').value;
      entity.Modelo = this.Orden_de_TrabajoForm.get('Modelo').value.Clave;
      entity.Propietario = this.Orden_de_TrabajoForm.get('Propietario').value.Folio;
      entity.Estatus = this.Orden_de_TrabajoForm.get('Estatus').value;
      entity.Propietario = entity.Propietario == 0 ? null : entity.Propietario;

      entity.Tipo_de_orden = this.Orden_de_TrabajoForm.controls.Tipo_de_orden.value;
      entity.Fecha_de_Creacion = this.Orden_de_TrabajoForm.controls.Fecha_de_Creacion.value;

      if (this.model.Folio > 0) {
        await this.Orden_de_TrabajoService.update(this.model.Folio, entity).toPromise();

        await this.saveDetalle_de_Reportes_Prestablecidos(this.model.Folio);
        await this.saveDetalles_de_trabajo_de_OT(this.model.Folio);

        this.localStorageHelper.setItemToLocalStorage(StorageKeys.KeyValueInserted, this.model.Folio.toString());
      } else {
        await (this.Orden_de_TrabajoService.insert(entity).toPromise().then(async id => {
          await this.saveDetalle_de_Reportes_Prestablecidos(id);
          await this.saveDetalles_de_trabajo_de_OT(id);
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
      this.Orden_de_TrabajoForm.reset();
      this.model = new Orden_de_Trabajo(this.fb);
      this.Orden_de_TrabajoForm = this.model.buildFormGroup();
      this.dataSourceReportes_Prestablecidos_OT = new MatTableDataSource<Detalle_de_Reportes_Prestablecidos>();
      this.Reportes_Prestablecidos_OTData = [];
      this.dataSourceDetalle_de_Reportes_de_OT = new MatTableDataSource<Detalles_de_trabajo_de_OT>();
      this.Detalle_de_Reportes_de_OTData = [];

    } else {
      this.router.navigate(['views/Orden_de_Trabajo/add']);
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
    this.router.navigate(['/Orden_de_Trabajo/list'], { state: { data: this.dataListConfig } });
  }

  configure() {
    console.log("configurando");
  }

  //No borrar el bloque de codigo siguiente

  //Inicio de Reglas

  Tipo_de_orden_ExecuteBusinessRules(): void {

    //INICIA - BRID:4361 - Deshabilitar o Habilitar campo Matricula de acuerdo a el tipo de Orden - Autor: Aaron - Actualización: 9/7/2021 4:04:01 PM
    if (this.brf.GetValueByControlType(this.Orden_de_TrabajoForm, 'Tipo_de_orden') != this.brf.EvaluaQuery("Select ''", 1, 'ABC123')) {
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 1);
    } else {
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 1);
    }
    //TERMINA - BRID:4361

    //Tipo_de_orden_FieldExecuteBusinessRulesEnd

  }
  async Matricula_ExecuteBusinessRules(option: any): Promise<void> {

    this.Orden_de_TrabajoForm.get('Matricula').setValue(option.Matricula);

    //INICIA - BRID:4360 - Verificar si ya existen OT Primarias abiertas para esa Matricula - Autor: Aaron - Actualización: 9/7/2021 3:33:21 PM
    if (await this.brf.EvaluaQueryAsync("Select Count(1) FROM Orden_de_trabajo WHERE Tipo_de_orden = " + this.Orden_de_TrabajoForm.get('Tipo_de_orden').value + " AND Matricula = '"+ this.Orden_de_TrabajoForm.get('Matricula').value +"' AND Estatus = 2", 1, 'ABC123')>this.brf.TryParseInt('0', '0') && 
      this.Orden_de_TrabajoForm.get('Tipo_de_orden').value == this.brf.TryParseInt('1', '1') ) { 
        alert('Ya existe una OT Primaria Abierta para esta OT. No es posible crear una nueva.');
        this.Orden_de_TrabajoForm.get('Matricula').setValue("");
        return;
    } else {}
    //TERMINA - BRID:4360


    //INICIA - BRID:4365 - Verificar si la matricula cuenta con OT Secundaria Abierta - Autor: Eliud Hernandez - Actualización: 10/25/2021 6:05:57 PM
    if (await this.brf.EvaluaQueryAsync("Select Count(1) FROM Orden_de_trabajo WHERE Tipo_de_orden = " + this.Orden_de_TrabajoForm.get('Tipo_de_orden').value + " AND Matricula = '" + this.Orden_de_TrabajoForm.get('Matricula').value + "' AND Estatus = 2", 1, 'ABC123') > this.brf.TryParseInt('0', '0') &&
      this.Orden_de_TrabajoForm.get('Tipo_de_orden').value == this.brf.TryParseInt('2', '2')) {
        alert('Ya existe una OT Secundaria Abierta para esta OT. No es posible crear una nueva.');
        this.Orden_de_TrabajoForm.get('Matricula').setValue("");
        return;
    } else { }
    //TERMINA - BRID:4365

    this.Orden_de_TrabajoForm.get('Modelo').setValue(option.Modelo_Modelos);
    this.Orden_de_TrabajoForm.get('Propietario').setValue(option.Propietario_Propietarios);

    this.getTecnicos();

    //INICIA - BRID:3714 - Al selecionar la matricula, traer el campo modelo y propietario por fefaul - Autor: Eliud Hernandez - Actualización: 10/25/2021 6:14:29 PM
    if (this.Orden_de_TrabajoForm.get('Matricula').value && this.Orden_de_TrabajoForm.get('Matricula').value) {

      this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm, "Horas_acumuladas", "SELECT Horas_actuales FROM Aeronave where matricula = '" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm, "Ciclos_acumulados", "SELECT Ciclos_actuales FROM Aeronave where matricula = '" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123");

    } else { }
    //TERMINA - BRID:3714


    // NO ESTA EN EL MVC
    //INICIA - BRID:3972 - Traer reportes de crear_Reportes - Autor: Aaron - Actualización: 9/9/2021 12:14:07 PM
    this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm,"Cant_de_reportes_pendientes", "select COUNT(FOLIO) from crear_reporte WHERE ESTATUS IN(1,2,3,4,5,7,9) and Matricula = '"+ this.Orden_de_TrabajoForm.get('Matricula').value +"'", 1, "ABC123"); 
    this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm,"Cant_de_reportes_asignados","select COUNT(FOLIO) from crear_reporte WHERE ESTATUS = 1 and Matricula = '"+ this.Orden_de_TrabajoForm.get('Matricula').value +"'", 1, "ABC123"); 
    this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm,"Cant_de_reportes_cerrados","select COUNT(FOLIO) from crear_reporte WHERE ESTATUS = 6 and Matricula = '"+ this.Orden_de_TrabajoForm.get('Matricula').value +"'", 1, "ABC123"); 
    this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm,"Cant_de_rpts_mandatorios_abiertos","select COUNT(FOLIO) from crear_reporte WHERE ESTATUS IN(1,2,3,4,5,7,9) and Prioridad_del_reporte = 4 and Matricula = '"+ this.Orden_de_TrabajoForm.get('Matricula').value +"'", 1, "ABC123");
    //TERMINA - BRID:397


    //INICIA - BRID:4351 - Crear Variable de Sesión de Matricula - Autor: Aaron - Actualización: 9/7/2021 3:44:48 PM
    //this.brf.CreateSessionVar("matricula", this.brf.EvaluaQuery(" Select '" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123"), 1, "ABC123");
    //TERMINA - BRID:4351


    //INICIA - BRID:5455 - Cargar MR reportes de OT con preestablecidos al seleccionar Matricula - Autor: Aaron - Actualización: 9/9/2021 1:19:06 PM
    await this.brf.FillMultiRenglonfromQueryAsync(this.dataSourceDetalle_de_Reportes_de_OT, "Select NULL AS Folio, NULL AS Id_Orden_de_Trabajo, B.Reporte_de_inspeccion_de_entrada as Tipo_de_Reporte, NULL AS Folio_de_Reporte, NULL AS Descripcion_de_Reporte, (Select '" + this.Orden_de_TrabajoForm.get('Matricula').value + "') AS Matricula, (Select Descripcion From Modelos Where Clave = " + this.Orden_de_TrabajoForm.get('Modelo').value.Clave + ") as Modelo, NULL AS Codigo_Computarizado, NULL AS Codigo_ATA, Origen_del_Reporte, NULL AS Respuesta_Parcial, NULL AS Respuesta_Total, NULL AS Asignado_a, NULL AS Asignado_a_1, NULL AS Asignado_a_2, NULL AS Asignado_a_3, NULL AS Asignado_a_4, 5 AS Estatus, 0 AS Notificado from (Select 'Obligatorio' AS Origen_del_Reporte) A INNER JOIN CAT__REPORTES_PRESTABLECIDOS B ON A.Origen_del_Reporte = B.Prioridad", 1, "ABC123");
    //TERMINA - BRID:5455

    let fDetalle_de_Reportes_de_OT = await this.Detalles_de_trabajo_de_OTService.listaSelAll(0, 4, '').toPromise();
    if(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs.length > 0) {
      fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs.forEach((e, i) => {
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Email = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Id_User = 0;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Image = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Name = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Role_Spartan_User_Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_Spartan_User.Username = null;

        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1 = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Email = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Id_User = 0;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Image = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Name = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Role_Spartan_User_Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_1_Spartan_User.Username = null;

        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2 = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Email = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Id_User = 0;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Image = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Name = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Role_Spartan_User_Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_2_Spartan_User.Username = null;

        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3 = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Email = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Id_User = 0;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Image = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Name = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Role_Spartan_User_Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_3_Spartan_User.Username = null;

        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4 = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Email = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Id_User = 0;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Image = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Name = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Role_Spartan_User_Role = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Asignado_a_4_Spartan_User.Username = null;

        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Codigo_ATA = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Codigo_Computarizado = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Descripcion_de_Reporte = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Estatus = this.dataSourceDetalle_de_Reportes_de_OT.data[i].Estatus;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Estatus_Estatus_de_Reporte.Descripcion = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Estatus_Estatus_de_Reporte.Folio = 0;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio_de_Reporte = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio_de_Reporte_Crear_Reporte.Folio = 0;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Folio_de_Reporte_Crear_Reporte.No_Reporte = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Id_Orden_de_Trabajo = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Matricula = this.dataSourceDetalle_de_Reportes_de_OT.data[i].Matricula;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Modelo = this.dataSourceDetalle_de_Reportes_de_OT.data[i].Modelo;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Notificado = false;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Origen_del_Reporte = this.dataSourceDetalle_de_Reportes_de_OT.data[i].Origen_del_Reporte;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Respuesta_Total = null;
        fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs[i].Tipo_de_Reporte = this.dataSourceDetalle_de_Reportes_de_OT.data[i].Tipo_de_Reporte;
      })

      this.Detalle_de_Reportes_de_OTData = fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs;
      this.loadDetalle_de_Reportes_de_OT(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs);
      this.dataSourceDetalle_de_Reportes_de_OT = new MatTableDataSource(fDetalle_de_Reportes_de_OT.Detalles_de_trabajo_de_OTs);
    }

    let matricula = this.Orden_de_TrabajoForm.get('Matricula').value;      
    this.brf.FillMultiRenglonfromQuery(this.dataSourceSeleccionar_Reportes_OT, `EXEC uspGetReportesPendientesMatricula '${matricula}'`, 1, "ABC123");

  }
  Modelo_ExecuteBusinessRules(): void {

    //INICIA - BRID:4681 - Cargar Reportes prestablecidos en MR de reportes de OT - Autor: Aaron - Actualización: 8/26/2021 5:35:50 PM
    //this.brf.FillMultiRenglonfromQuery(this.dataSourceReportes_Prestablecidos_OT,"Detalles_de_trabajo_de_OT",1,"ABC123");
    //TERMINA - BRID:4681

    //Modelo_FieldExecuteBusinessRulesEnd

  }
  Propietario_ExecuteBusinessRules(): void {
    //Propietario_FieldExecuteBusinessRulesEnd
  }
  Fecha_de_Creacion_ExecuteBusinessRules(): void {

    //INICIA - BRID:6150 - Validar que fecha de creacion sea menor a la fecha de entrega - Autor: Aaron - Actualización: 9/13/2021 12:04:51 PM
    if (this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_Creacion]',103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_entrega]',103),103))", 1, 'ABC123') >= this.brf.TryParseInt('0', '0')) { } else { this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery(" Select 'La fecha de entrega no puede ser menor a fecha de creación, por favor valide nuevamente.'	", 1, "ABC123"), 1, "ABC123"); this.brf.SetValueControl(this.Orden_de_TrabajoForm, "Fecha_de_Creacion", " "); }
    //TERMINA - BRID:6150

    //Fecha_de_Creacion_FieldExecuteBusinessRulesEnd

  }
  Fecha_de_entrega_ExecuteBusinessRules(): void {

    //INICIA - BRID:6139 - La Fecha de entrega no puede ser menor a la fecha de creación - Autor: Aaron - Actualización: 9/13/2021 12:07:29 PM
    if (this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_Creacion]',103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_entrega]',103),103))", 1, 'ABC123') >= this.brf.TryParseInt('0', '0')) { } else { this.brf.SetValueControl(this.Orden_de_TrabajoForm, "Fecha_de_entrega", " "); this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery("  Select 'La fecha de entrega no puede ser menor a fecha de creación, por favor valide nuevamente.", 1, "ABC123"), 1, "ABC123"); }
    //TERMINA - BRID:6139


    //INICIA - BRID:6151 - Validar que Fecha de Creación no sea mayor a la fecha de entrega - Autor: Aaron - Actualización: 9/13/2021 12:07:30 PM
    if (this.brf.EvaluaQuery("SELECT DATEDIFF(DAY,CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_Creacion]',103),103), CONVERT(DATE,CONVERT(VARCHAR(10),'FLD[Fecha_de_entrega]',103),103))", 1, 'ABC123') >= this.brf.TryParseInt('0', '0')) { } else { this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery(" Select 'La fecha de entrega no puede ser menor a fecha de creación, por favor valide nuevamente.'", 1, "ABC123"), 1, "ABC123"); this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm, "Fecha_de_entrega", this.brf.EvaluaQuery(" Select ''", 1, "ABC123"), 1, "ABC123"); }
    //TERMINA - BRID:6151

    //Fecha_de_entrega_FieldExecuteBusinessRulesEnd


  }
  Cant_de_reportes_pendientes_ExecuteBusinessRules(): void {
    //Cant_de_reportes_pendientes_FieldExecuteBusinessRulesEnd
  }
  Cant_de_reportes_asignados_ExecuteBusinessRules(): void {
    //Cant_de_reportes_asignados_FieldExecuteBusinessRulesEnd
  }
  Cant_de_reportes_cerrados_ExecuteBusinessRules(): void {
    //Cant_de_reportes_cerrados_FieldExecuteBusinessRulesEnd
  }
  Cant_de_rpts_mandatorios_abiertos_ExecuteBusinessRules(): void {
    //Cant_de_rpts_mandatorios_abiertos_FieldExecuteBusinessRulesEnd
  }
  Horas_acumuladas_ExecuteBusinessRules(): void {
    //Horas_acumuladas_FieldExecuteBusinessRulesEnd
  }
  Ciclos_acumulados_ExecuteBusinessRules(): void {
    //Ciclos_acumulados_FieldExecuteBusinessRulesEnd
  }

  Estatus_ExecuteBusinessRules(): void {

    //INICIA - BRID:4139 - Activar campo de CAusa de cancelacion - Autor: Aaron - Actualización: 7/14/2021 1:31:38 PM
    if (this.Orden_de_TrabajoForm.get('Estatus').value == 3) {
      this.brf.ShowFieldOfForm(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
    }
    else {
      this.brf.HideFieldOfForm(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
      this.brf.SetNotRequiredControl(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
    }
    //TERMINA - BRID:4139


    //INICIA - BRID:7096 - Habilitar Horas Ciclos acumulados y Fecha de cierre al poner el status cerrado Orden_de_Trabajo - Autor: Agustín Administrador - Actualización: 10/12/2021 3:51:25 PM
    console.log("Estatus: ", this.Orden_de_TrabajoForm.get('Estatus').value);
    if (this.Orden_de_TrabajoForm.get('Estatus').value == 1) {
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 1);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 1);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 1);
    }
    else {
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 0);
    }
    //TERMINA - BRID:7096

    //Estatus_FieldExecuteBusinessRulesEnd


  }


  Causa_de_Cancelacion_ExecuteBusinessRules(): void {

    //INICIA - BRID:4155 - Variable de sesión para Causa de Cancelacion - Autor: Aaron - Actualización: 7/20/2021 1:50:24 PM
    this.brf.CreateSessionVar("causa_de_cancelacion", this.brf.EvaluaQuery(" Select '" + this.Orden_de_TrabajoForm.get('causa_de_cancelacion').value + "'", 1, "ABC123"), 1, "ABC123");
    //TERMINA - BRID:4155

    //Causa_de_Cancelacion_FieldExecuteBusinessRulesEnd

  }
  numero_de_orden_ExecuteBusinessRules(): void {
    //numero_de_orden_FieldExecuteBusinessRulesEnd
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

  async rulesOnInit() {

    //rulesOnInit_ExecuteBusinessRulesInit

    //INICIA - BRID:3200 - ocultar tipo de orden - Autor: Administrador - Actualización: 5/24/2021 6:05:16 PM //No esta en el MVC
    /*if(  this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult' ) {
      this.brf.HideFieldOfForm(this.Orden_de_TrabajoForm, "Tipo_de_orden"); 
      this.brf.SetNotRequiredControl(this.Orden_de_TrabajoForm, "Tipo_de_orden");
    } */
    //TERMINA - BRID:3200


    //INICIA - BRID:3546 - ocultar campo numero de orden - Autor: Administrador - Actualización: 5/28/2021 10:01:22 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.HideFieldOfForm(this.Orden_de_TrabajoForm, "numero_de_orden");
      this.brf.SetNotRequiredControl(this.Orden_de_TrabajoForm, "numero_de_orden");
    }
    //TERMINA - BRID:3546


    //INICIA - BRID:3715 - Deshabilitar campo modelo, propietario, hrs acumu y ciclos acumulados. - Autor: Lizeth Villa - Actualización: 6/1/2021 3:56:15 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Modelo', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Propietario', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 0);
    }
    //TERMINA - BRID:3715


    //INICIA - BRID:3716 - Deshabilitar campo modelo, propietario, hrs acumu y ciclos acumulados.. - Autor: Lizeth Villa - Actualización: 6/1/2021 3:55:36 PM
    if (this.operation == 'New') {
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Modelo', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Propietario', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 0);
    }
    //TERMINA - BRID:3716


    //INICIA - BRID:3894 - estatus abierto - Autor: Aaron - Actualización: 7/14/2021 1:29:37 PM
    if (this.operation == 'New') {
      this.brf.SetValueControl(this.Orden_de_TrabajoForm, "Estatus", "2"); this.Estatus_ExecuteBusinessRules();
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Estatus', 0);
      this.brf.HideFieldOfForm(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
      this.brf.SetNotRequiredControl(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
    }
    //TERMINA - BRID:3894


    //INICIA - BRID:3906 - Deshabilitar campos de reportes - Autor: Eliud Hernandez - Actualización: 6/22/2021 11:23:53 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_pendientes', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_asignados', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_cerrados', 0);
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_rpts_mandatorios_abiertos', 0);
    }
    //TERMINA - BRID:3906

    //INICIA - BRID:3910 - LLENAR MR PRESTABLECIDOS - Autor: Aaron - Actualización: 9/9/2021 3:37:27 PM
    if (this.operation == 'New') {
      this.brf.FillMultiRenglonfromQuery(this.dataSourceReportes_Prestablecidos_OT, "SELECT	NULL AS Folio, NULL AS id_orden_de_trabajo, CASE WHEN CRP.Prioridad = 'Obligatorio' THEN 1 ELSE 0 END AS Seleccionar, CRP.Reporte_de_inspeccion_de_entrada AS Reporte_de_inspeccion_de_entrada, CRP.Tipo_de_reporte AS Tipo_de_reporte, 'Obligatorio' AS Prioridad, CRP.Tipo_de_Codigo AS Tipo_de_Codigo, CRP.Codigo_NP AS Codigo_NP, CRP.Descripcion AS Descripcion FROM CAT__REPORTES_PRESTABLECIDOS CRP", 1, "ABC123");
    }
    //TERMINA - BRID:3910


    //INICIA - BRID:3923 - cuando el programador edite una OT deshabilitar los campos junto con su MR - Autor: Yamir - Actualización: 6/15/2021 3:39:37 PM
    console.log("Role: ", this.localStorageHelper.getLoggedUserInfo().RoleId)
    if (this.operation == 'Update') {
      if (43 == this.localStorageHelper.getLoggedUserInfo().RoleId) {
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Tipo_de_orden', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Modelo', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Propietario', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_pendientes', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_asignados', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_cerrados', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_rpts_mandatorios_abiertos', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'numero_de_orden', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_Creacion', 1);
      }
      else {
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Tipo_de_orden', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Modelo', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Propietario', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_pendientes', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_asignados', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_cerrados', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_rpts_mandatorios_abiertos', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'numero_de_orden', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_Creacion', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Tipo_de_orden', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Modelo', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Propietario', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_pendientes', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_asignados', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_cerrados', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_rpts_mandatorios_abiertos', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'numero_de_orden', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_Creacion', 1);
      }
    }
    //TERMINA - BRID:3923

    //INICIA - BRID:3931 - acomodo de campos orden de trabajo - Autor: Yamir - Actualización: 6/17/2021 10:59:14 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {

    }
    //TERMINA - BRID:3931


    //INICIA - BRID:3975 - crear variables  - Autor: Aaron - Actualización: 7/26/2021 11:32:25 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.CreateSessionVar("Matricula", " select '" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123");
      this.brf.CreateSessionVar("numero_de_serie", " select Numero_de_serie from aeronave where Matricula ='" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123");
      this.brf.CreateSessionVar("numero_de_orden", " select " + this.Orden_de_TrabajoForm.get('numero_de_orden').value + "", 1, "ABC123");
      this.brf.CreateSessionVar("nombre_usuario", "select name from spartan_user where id_user=" + this.localStorageHelper.getLoggedUserInfo().UserId, 1, "ABC123");
    }
    //TERMINA - BRID:3975


    //INICIA - BRID:4141 - Deshabilitar causa de cancelación - Autor: Aaron - Actualización: 7/14/2021 1:53:23 PM
    if (this.operation == 'Update') {
      if (this.Orden_de_TrabajoForm.get('Estatus').value == 3) {
        this.brf.HideFieldOfForm(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
      }
      else {
        this.brf.HideFieldOfForm(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
        this.brf.HideFieldOfForm(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
        this.brf.SetNotRequiredControl(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
      }
    }
    //TERMINA - BRID:4141


    //INICIA - BRID:4206 - Prueba Session var Correos - Autor: Aaron - Actualización: 7/26/2021 11:29:36 AM
    if (this.operation == 'Update') {
      this.brf.CreateSessionVar("reportes_asignados", this.brf.EvaluaQuery(" Select ''", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:4206


    //INICIA - BRID:4362 - Deshabilitar Matricula Al nuevo - Autor: Aaron - Actualización: 7/23/2021 6:37:13 PM
    if (this.operation == 'New') {
      this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 0);
    }
    //TERMINA - BRID:4362


    //INICIA - BRID:4647 - Crear variable global RespuesaEstatusReportes para validación al guardar - Autor: Felipe Rodríguez - Actualización: 8/4/2021 5:39:57 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.CreateSessionVar("RespuesaEstatusReportes", this.brf.EvaluaQuery(" SELECT 0", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:4647


    //INICIA - BRID:4678 - Agregar reportes prestablecidos a reportes de OT - Autor: Aaron - Actualización: 8/5/2021 3:31:21 PM
    if (this.operation == 'New') {
      //this.brf.FillMultiRenglonfromQuery(this.dataSourceDetalle_de_Reportes_de_OT,"SELECT * FROM Detalles_de_trabajo_de_OT",1,"ABC123");
    }
    //TERMINA - BRID:4678


    //INICIA - BRID:4908 - Deshabilitar MR cuando no se ha seleccionado matricula - Autor: Aaron - Actualización: 8/6/2021 8:04:44 PM
    if (this.operation == 'New') {

    }
    //TERMINA - BRID:4908


    //INICIA - BRID:5663 - WF:8 Rule - Phase: 1 (Crear Orden de Trabajo) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '1'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:5663


    //INICIA - BRID:5664 - WF:8 Rule - Phase: 2 (Orden de trabajo primaria) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '2'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:5664


    //INICIA - BRID:5666 - WF:8 Rule - Phase: 3 (Orden de trabajo secundaria) - Autor:  - Actualización: 1/1/1900 12:00:00 AM
    if (this.operation == 'New' || this.operation == 'Update' || this.operation == 'Consult') {
      if (this.brf.EvaluaQuery("Select 'GLOBAL[Phase]'", 1, 'ABC123') == this.brf.EvaluaQuery("Select '3'", 1, 'ABC123')) { } else { }
    }
    //TERMINA - BRID:5666


    //INICIA - BRID:5884 - campos de reportes pentiendes en 0 - Autor: Aaron - Actualización: 9/7/2021 3:38:47 PM
    if (this.operation == 'New') {
      this.Orden_de_TrabajoForm.get('Cant_de_reportes_pendientes').setValue(0);
      this.Orden_de_TrabajoForm.get('Cant_de_reportes_asignados').setValue(0);
      this.Orden_de_TrabajoForm.get('Cant_de_reportes_cerrados').setValue(0);
      this.Orden_de_TrabajoForm.get('Cant_de_rpts_mandatorios_abiertos').setValue(0);
      //this.brf.SetValueControl(this.Orden_de_TrabajoForm, "Cant_de_reportes_pendientes", "0");
      //this.brf.SetValueControl(this.Orden_de_TrabajoForm, "Cant_de_reportes_asignados", "0");
      //this.brf.SetValueControl(this.Orden_de_TrabajoForm, "Cant_de_reportes_cerrados", "0");
      //this.brf.SetValueControl(this.Orden_de_TrabajoForm, "Cant_de_rpts_mandatorios_abiertos", "0");
    }
    //TERMINA - BRID:5884


    //INICIA - BRID:5885 - Obtener Cantidades de reportes actuales - Autor: Aaron - Actualización: 9/8/2021 2:16:00 PM
    if (this.operation == 'Update' || this.operation == 'Consult') {
      this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm, "Cant_de_reportes_pendientes", this.brf.EvaluaQuery(" select COUNT(FOLIO) from crear_reporte WHERE ESTATUS IN(1,2,3,4,5,7,9) and Matricula = '" + this.Orden_de_TrabajoForm.get('Matricula').value + "' ", 1, "ABC123"), 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm, "Cant_de_reportes_asignados", this.brf.EvaluaQuery(" select COUNT(FOLIO) from crear_reporte WHERE ESTATUS = 1 and Matricula = '" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123"), 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm, "Cant_de_reportes_cerrados", this.brf.EvaluaQuery("  select COUNT(FOLIO) from crear_reporte WHERE ESTATUS = 6 and Matricula = '" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123"), 1, "ABC123");
      this._SpartanService.SetValueExecuteQuery(this.Orden_de_TrabajoForm, "Cant_de_rpts_mandatorios_abiertos", this.brf.EvaluaQuery("select COUNT(FOLIO) from crear_reporte WHERE ESTATUS IN(1,2,3,4,5,7,9) and Prioridad_del_reporte = 4 and Matricula = '" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:5885


    //INICIA - BRID:6311 - filter matrucula - Autor: Yamir - Actualización: 9/20/2021 12:41:03 PM
    if (this.operation == 'New') {

    }
    //TERMINA - BRID:6311


    //INICIA - BRID:7098 - Habilitar Horas, Ciclos acumulados y Fecha de cierre al poner el status cerrado al modificar Orden_de_Trabajo - Autor: Agustín Administrador - Actualización: 10/12/2021 3:50:34 PM
    if (this.operation == 'Update') {
      if (this.Orden_de_TrabajoForm.get('Estatus').value == 1) {
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 1);
      }
      else {
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 1);
      }
    }
    //TERMINA - BRID:7098

    //REGLA MANUAL
    if (this.operation == 'Update') {

      let estatusEdit: number = null;
      estatusEdit = await this.brf.EvaluaQueryAsync(`SELECT Estatus FROM Orden_de_Trabajo WHERE Folio = ${this.model.Folio}`, 1, "ABC123");

      //ESTATUS ABIERTO
      if(estatusEdit == 2 || estatusEdit == null) {
        console.log('entra a regla manual');
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Tipo_de_orden', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Modelo', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Propietario', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_Creacion', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_pendientes', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_asignados', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_cerrados', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_rpts_mandatorios_abiertos', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 0);
      }
      //ESTATUS CERRADO
      if(estatusEdit == 1) {
        console.log('entra a regla manual');
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Tipo_de_orden', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Modelo', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Propietario', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_Creacion', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_pendientes', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_asignados', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_cerrados', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_rpts_mandatorios_abiertos', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 1);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 1);
      }
      //ESTATUS CANCELADO
      if(estatusEdit == 3) {
        console.log('entra a regla manual');
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Tipo_de_orden', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Matricula', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Modelo', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Propietario', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_Creacion', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Fecha_de_entrega', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_pendientes', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_asignados', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_reportes_cerrados', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Cant_de_rpts_mandatorios_abiertos', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Horas_acumuladas', 0);
        this.brf.SetEnabledControl(this.Orden_de_TrabajoForm, 'Ciclos_acumulados', 0);

        this.brf.ShowFieldOfForm(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
        this.brf.SetRequiredControl(this.Orden_de_TrabajoForm, "Causa_de_Cancelacion");
      }

      this.getTecnicos();

    }
    //REGLA MANUAL



    //rulesOnInit_ExecuteBusinessRulesEnd


  }

  async rulesAfterSave() {
    //rulesAfterSave_ExecuteBusinessRulesInit

    //INICIA - BRID:3717 - Mensaje Evaluación de cierre - Autor: Eliud Hernandez - Actualización: 6/1/2021 4:00:46 PM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.ShowMessage(" Evaluación de cierre");
    }
    //TERMINA - BRID:3717


    //INICIA - BRID:3907 - Guardar numero de orden igual que el folio ingresado - Autor: Felipe Rodríguez - Actualización: 6/10/2021 10:19:46 AM
    if (this.operation == 'New') {
      //this.brf.EvaluaQuery(`EXEC upsGuardarNumeroOrdenTrabajo GLOBAL[KeyValueInserted]`, 1, "ABC123");
      await this.brf.EvaluaQueryAsync(`EXEC upsGuardarNumeroOrdenTrabajo ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}`, 1, "ABC123");
    }
    //TERMINA - BRID:3907


    //INICIA - BRID:3974 - mandar correo de creación de OT  - Autor: Aaron - Actualización: 7/13/2021 8:41:36 PM
    if (this.operation == 'New') {
      //this.brf.SendEmailQuery("Aviso de Creación de Orden de Trabajo. ", this.brf.EvaluaQuery("select STUFF((		select ';' + Email + ''		from Spartan_User		where Role in (19,43,22,42,41)	for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html>@LC@@LB@ <html>@LC@@LB@ @LC@@LB@ <head>@LC@@LB@     <meta charset="utf-8">@LC@@LB@     <meta name="viewport" content="width=device-width, initial-scale=1.0">@LC@@LB@     <meta http-equiv="X-UA-Compatible" content="IE=edge">@LC@@LB@     <title>EmailTemplate-Fluid</title>@LC@@LB@ @LC@@LB@     <style type="text/css">@LC@@LB@         html,@LC@@LB@         body {@LC@@LB@             margin: 20px 0 0 0 !important; @LC@@LB@             padding: 0 !important;@LC@@LB@             width: 100% i !important;@LC@@LB@             background-color: #e0e0e0 !important;@LC@@LB@         }@LC@@LB@ @LC@@LB@         * {@LC@@LB@             -ms-text-size-adjust: 100%;@LC@@LB@             -webkit-text-size-adjust: 100%;@LC@@LB@         }@LC@@LB@ @LC@@LB@         .ExternalClass {@LC@@LB@             width: 100%;@LC@@LB@         }@LC@@LB@ @LC@@LB@         div[style*="margin: 16px 0"] {@LC@@LB@             margin: 0 !important;@LC@@LB@         }@LC@@LB@ @LC@@LB@         table,@LC@@LB@         td {@LC@@LB@             mso-table-lspace: 0pt !important;@LC@@LB@             mso-table-rspace: 0pt !important;@LC@@LB@         }@LC@@LB@ @LC@@LB@         table {@LC@@LB@             border-spacing: 0 !important;@LC@@LB@             border-collapse: collapse !important;@LC@@LB@             table-layout: fixed !important;@LC@@LB@             margin: 0 auto !important;@LC@@LB@         }@LC@@LB@ @LC@@LB@         table table table {@LC@@LB@             table-layout: auto;@LC@@LB@         }@LC@@LB@ @LC@@LB@         img {@LC@@LB@             -ms-interpolation-mode: bicubic;@LC@@LB@         }@LC@@LB@ @LC@@LB@         .yshortcuts a {@LC@@LB@             border-bottom: none !important;@LC@@LB@         }@LC@@LB@ @LC@@LB@         a[x-apple-data-detectors] {@LC@@LB@             color: inherit !important;@LC@@LB@         }@LC@@LB@ @LC@@LB@         /* Estilos Hover para botones */@LC@@LB@         .button-td,@LC@@LB@         .button-a {@LC@@LB@             transition: all 100ms ease-in;@LC@@LB@         }@LC@@LB@ @LC@@LB@         .button-td:hover,@LC@@LB@         .button-a:hover {@LC@@LB@             color: #000;@LC@@LB@         }@LC@@LB@     </style>@LC@@LB@ </head>@LC@@LB@ @LC@@LB@ <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo">@LC@@LB@     <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0"@LC@@LB@         style="border-collapse:collapse;">@LC@@LB@         <tr>@LC@@LB@             <td>@LC@@LB@                 <center style="width: 100%;">@LC@@LB@ @LC@@LB@                     <!-- Visually Hidden Preheader Text : BEGIN -->@LC@@LB@                     <div@LC@@LB@                         style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;">@LC@@LB@                         Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div>@LC@@LB@                     <!-- Visually Hidden Preheader Text : END -->@LC@@LB@ @LC@@LB@                     <div style="max-width: 600px;">@LC@@LB@                         <!--[if (gte mso 9)|(IE)]>@LC@@LB@             <table cellspacing="0" cellpadding="0" border="0" width="600" align="center">@LC@@LB@             <tr>@LC@@LB@             <td>@LC@@LB@             <![endif]-->@LC@@LB@ @LC@@LB@                         <!-- Email Header : BEGIN -->@LC@@LB@                         <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%"@LC@@LB@                             style="max-width: 600px; border-top: 5px solid #1F1F1F">@LC@@LB@                             <tr>@LC@@LB@                                 <td width="40">&nbsp;</td>@LC@@LB@                                 <td width="260"><img src="logo-aerovics.png" width="100%" height="auto"@LC@@LB@                                         style="padding: 26px 0 10px 0" alt="alt_text"></td>@LC@@LB@                                 <td>&nbsp;</td>@LC@@LB@                                 <td width="40">&nbsp;</td>@LC@@LB@                             </tr>@LC@@LB@                             <tr>@LC@@LB@                                 <td width="40">&nbsp;</td>@LC@@LB@                                 <td width="260" style="border-top: 2px solid #325396">&nbsp;</td>@LC@@LB@                                 <td style="border-top: 2px solid #8FBFFE">&nbsp;</td>@LC@@LB@                                 <td width="40">&nbsp;</td>@LC@@LB@                             </tr>@LC@@LB@                         </table>@LC@@LB@                         <!-- Email Header : END -->@LC@@LB@ @LC@@LB@                         <!-- Email Body : BEGIN -->@LC@@LB@                         <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%"@LC@@LB@                             style="max-width: 600px;">@LC@@LB@ @LC@@LB@                             <!-- 1 Column Text : BEGIN -->@LC@@LB@                             <tr>@LC@@LB@                                 <td>@LC@@LB@                                     <table cellspacing="0" cellpadding="0" border="0" width="100%">@LC@@LB@                                         <tr>@LC@@LB@                                             <td@LC@@LB@                                                 style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;">@LC@@LB@                                                 <p>Estimados buenos días</p>@LC@@LB@                                                 <p>Se notifica a todos de la Creación de la OT : </p>@LC@@LB@                                                  <br>@LC@@LB@                                                  <p>No.De OT:</p> @LC@@LB@                                                     <br>   @LC@@LB@                                                     <p>Matrícula:</p>   @LC@@LB@                                                     <br>   @LC@@LB@                                                     <p>No. de serie</p>  @LC@@LB@                                                     <br>  @LC@@LB@                                                     <p>Atentamente: (Usuario que realiza la acción)</p>  @LC@@LB@                                                 <p>Favor de enviar acuse de recibido.</p>@LC@@LB@                                                 <p>Saludos,</p>@LC@@LB@                                             </td>@LC@@LB@                                         </tr>@LC@@LB@                                     </table>@LC@@LB@                                 </td>@LC@@LB@                             </tr>@LC@@LB@                             <!-- 1 Column Text : BEGIN -->@LC@@LB@ @LC@@LB@ @LC@@LB@                         </table>@LC@@LB@                         <!-- Email Body : END -->@LC@@LB@ @LC@@LB@                         <!-- Email Footer : BEGIN -->@LC@@LB@                         <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF"@LC@@LB@                             style="max-width: 680px;">@LC@@LB@                             <tr>@LC@@LB@                                 <td width="40">&nbsp;</td>@LC@@LB@                                 <td width="40" valign="middle" style="text-align: right;">@LC@@LB@                                     <img style="width: 40px; height: 40px;" src="mail-user.png"/>@LC@@LB@                                 </td>@LC@@LB@                                 <td width="5">&nbsp;</td>@LC@@LB@                                 <td>@LC@@LB@                                     <p@LC@@LB@                                         style="font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;">@LC@@LB@                                         José Luis Gonzalez B.</p>@LC@@LB@                                     <p@LC@@LB@                                         style="font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;">@LC@@LB@                                         Mantenimiento.</p>@LC@@LB@                                 </td>@LC@@LB@                                 <td width="40">&nbsp;</td>@LC@@LB@                             </tr>@LC@@LB@                             <tr>@LC@@LB@                                 <td>&nbsp;</td>@LC@@LB@                                 <td width="40" valign="middle" style="text-align: right;">@LC@@LB@                                     <img style="width: 24px; height: 24px;" src="mail-plane.png"/>@LC@@LB@                                 </td>@LC@@LB@                                 <td width="5">&nbsp;</td>@LC@@LB@                                 <td>@LC@@LB@                                     <p@LC@@LB@                                         style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;">@LC@@LB@                                         Aerovics, S.A. de C.V.</p>@LC@@LB@                                 </td>@LC@@LB@                                 <td width="40">&nbsp;</td>@LC@@LB@                             </tr>@LC@@LB@ @LC@@LB@                         </table>@LC@@LB@ @LC@@LB@                         <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%"@LC@@LB@                             style="max-width: 600px;">@LC@@LB@                             <tr>@LC@@LB@                                 <td style="padding-top: 40px;"></td>@LC@@LB@                             </tr>@LC@@LB@                             <tr>@LC@@LB@                                 <td@LC@@LB@                                     style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">@LC@@LB@                                     &nbsp;</td>@LC@@LB@                             </tr>@LC@@LB@                         </table>@LC@@LB@                         <!-- Email Footer : END -->@LC@@LB@ @LC@@LB@                         <!--[if (gte mso 9)|(IE)]>@LC@@LB@             </td>@LC@@LB@             </tr>@LC@@LB@             </table>@LC@@LB@             <![endif]-->@LC@@LB@                     </div>@LC@@LB@                 </center>@LC@@LB@             </td>@LC@@LB@         </tr>@LC@@LB@     </table>@LC@@LB@ </body>@LC@@LB@ @LC@@LB@ </html>");
    }
    //TERMINA - BRID:3974


    //INICIA - BRID:4114 - Ejecutar SP de inserción de Inspección de Entrada - Autor: Aaron - Actualización: 7/28/2021 12:17:53 PM
    if (this.operation == 'New') {
      //this.brf.EvaluaQuery(" EXEC Insert_Nueva_Inspeccion_Entrada GLOBAL[KeyValueInserted]", 1, "ABC123");
      await this.brf.EvaluaQueryAsync(` EXEC Insert_Nueva_Inspeccion_Entrada ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}`, 1, "ABC123");
    }
    //TERMINA - BRID:4114


    //INICIA - BRID:4131 - Enviar correo cuando OT sea cancelada - Autor: Aaron - Actualización: 7/21/2021 11:26:08 AM
    if (this.operation == 'Update') {
      //if (this.brf.GetValueByControlType(this.Orden_de_TrabajoForm, 'Estatus') == this.brf.TryParseInt('3', '3')) { this.brf.SendEmailQuery("Cancelación de OT", this.brf.EvaluaQuery("select STUFF((		select ';' + Email + ''		from Spartan_User		where Role in (19,43,22,42,41)	for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html>  <head>     <meta charset='utf-8'>     <meta name='viewport' content='width=device-width, initial-scale=1.0'>     <meta http-equiv='X-UA-Compatible' content='IE=edge'>     <title>EmailTemplate-Fluid</title>      <style type='text/css'>         html,         body {             margin: 20px 0 0 0 !important;             padding: 0 !important;             width: 100% i !important;             background-color: #e0e0e0 !important;         }          * {             -ms-text-size-adjust: 100%;             -webkit-text-size-adjust: 100%;         }          .ExternalClass {             width: 100%;         }          div[style*='margin: 16px 0'] {             margin: 0 !important;         }          table,         td {             mso-table-lspace: 0pt !important;             mso-table-rspace: 0pt !important;         }          table {             border-spacing: 0 !important;             border-collapse: collapse !important;             table-layout: fixed !important;             margin: 0 auto !important;         }          table table table {             table-layout: auto;         }          img {             -ms-interpolation-mode: bicubic;         }          .yshortcuts a {             border-bottom: none !important;         }          a[x-apple-data-detectors] {             color: inherit !important;         }          /* Estilos Hover para botones */         .button-td,         .button-a {             transition: all 100ms ease-in;         }          .button-td:hover,         .button-a:hover {             color: #000;         }     </style> </head>  <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'>     <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0'         style='border-collapse:collapse;'>         <tr>             <td>                 <center style='width: 100%;'>                      <!-- Visually Hidden Preheader Text : BEGIN -->                     <div                         style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>                         Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div>                     <!-- Visually Hidden Preheader Text : END -->                      <div style='max-width: 600px;'>                         <!--[if (gte mso 9)|(IE)]>             <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'>             <tr>             <td>             <![endif]-->                          <!-- Email Header : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px; border-top: 5px solid #1F1F1F'>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto'                                         style='padding: 26px 0 10px 0' alt='alt_text'></td>                                 <td>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td>                                 <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                         </table>                         <!-- Email Header : END -->                          <!-- Email Body : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px;'>                              <!-- 1 Column Text : BEGIN -->                             <tr>                                 <td>                                     <table cellspacing='0' cellpadding='0' border='0' width='100%'>                                         <tr>                                             <td                                                 style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'>                                                 <p>Estimados buenos días</p>                                                 <p>Se les informa que ha sido cancelada la Orden de Trabajo </p>                                                  <br>                                                  <p>No. Orden de trabajo: GLOBAL[numero_de_orden]</p>                                                     <br>   													                                                     <p>Matrícula: GLOBAL[matricula]</p>                                                       <br>                                                       <p>No. de serie: GLOBAL[numero_de_serie]</p>                                                      <br>  												 													<p>Por la siguiente causa: </p>                                                      <br> 													<p>Trabajo por realizar: </p>                                                      <br>  													                                                     <p>Atentamente: GLOBAL[nombre_usuario]</p>                                                  <p>Saludos,</p>                                             </td>                                         </tr>                                     </table>                                 </td>                             </tr>                             <!-- 1 Column Text : BEGIN -->                           </table>                         <!-- Email Body : END -->                          <!-- Email Footer : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF'                             style='max-width: 680px;'>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='40' valign='middle' style='text-align: right;'>                                     <img style='width: 40px; height: 40px;' src='http://192.168.1.101/MVCvics/Images/mail-plane.PNG'/>                                 </td>                                 <td width='5'>&nbsp;</td>                                 <td>                                     <p                                         style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>                                         José Luis Gonzalez B.</p>                                     <p                                         style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'>                                         Mantenimiento.</p>                                 </td>                                 <td width='40'>&nbsp;</td>                             </tr>                             <tr>                                 <td>&nbsp;</td>                                 <td width='40' valign='middle' style='text-align: right;'>                                     <img style='width: 24px; height: 24px;' src='mail-plane.png'/>                                 </td>                                 <td width='5'>&nbsp;</td>                                 <td>                                     <p                                         style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'>                                         Aerovics, S.A. de C.V.</p>                                 </td>                                 <td width='40'>&nbsp;</td>                             </tr>                          </table>                          <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px;'>                             <tr>                                 <td style='padding-top: 40px;'></td>                             </tr>                             <tr>                                 <td                                     style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>                                     &nbsp;</td>                             </tr>                         </table>                         <!-- Email Footer : END -->                          <!--[if (gte mso 9)|(IE)]>             </td>             </tr>             </table>             <![endif]-->                     </div>                 </center>             </td>         </tr>     </table> </body>  </html>"); } else { }
    }
    //TERMINA - BRID:4131


    //INICIA - BRID:4143 - Enviar correo cuando se Cierra OT - Autor: Aaron - Actualización: 7/21/2021 11:34:35 AM
    if (this.operation == 'Update') {
      //if (this.brf.GetValueByControlType(this.Orden_de_TrabajoForm, 'Estatus') == this.brf.TryParseInt('1', '1')) { this.brf.SendEmailQuery("Aviso de Cierre de Orden de Trabajo ", this.brf.EvaluaQuery("select STUFF((		select ';' + Email + ''		from Spartan_User		where Role in (19,43,22,42,41)	for XML PATH('')	), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html>  <head>     <meta charset='utf-8'>     <meta name='viewport' content='width=device-width, initial-scale=1.0'>     <meta http-equiv='X-UA-Compatible' content='IE=edge'>     <title>EmailTemplate-Fluid</title>      <style type='text/css'>         html,         body {             margin: 20px 0 0 0 !important;             padding: 0 !important;             width: 100% i !important;             background-color: #e0e0e0 !important;         }          * {             -ms-text-size-adjust: 100%;             -webkit-text-size-adjust: 100%;         }          .ExternalClass {             width: 100%;         }          div[style*='margin: 16px 0'] {             margin: 0 !important;         }          table,         td {             mso-table-lspace: 0pt !important;             mso-table-rspace: 0pt !important;         }          table {             border-spacing: 0 !important;             border-collapse: collapse !important;             table-layout: fixed !important;             margin: 0 auto !important;         }          table table table {             table-layout: auto;         }          img {             -ms-interpolation-mode: bicubic;         }          .yshortcuts a {             border-bottom: none !important;         }          a[x-apple-data-detectors] {             color: inherit !important;         }          /* Estilos Hover para botones */         .button-td,         .button-a {             transition: all 100ms ease-in;         }          .button-td:hover,         .button-a:hover {             color: #000;         }     </style> </head>  <body width='100%' style='margin: 20px 0 0 0; background-color: e0e0e0;' yahoo='yahoo'>     <table cellpadding='0' cellspacing='0' border='0' height='100%' width='100%' bgcolor='#e0e0e0'         style='border-collapse:collapse;'>         <tr>             <td>                 <center style='width: 100%;'>                      <!-- Visually Hidden Preheader Text : BEGIN -->                     <div                         style='display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;'>                         Aerovics - Texto para previsualizar en el lector de correo. No se ve en el correo </div>                     <!-- Visually Hidden Preheader Text : END -->                      <div style='max-width: 600px;'>                         <!--[if (gte mso 9)|(IE)]>             <table cellspacing='0' cellpadding='0' border='0' width='600' align='center'>             <tr>             <td>             <![endif]-->                          <!-- Email Header : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px; border-top: 5px solid #1F1F1F'>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260'><img src='http://108.60.201.12/vicsdemoventas3/images/logo-aerovics.png' width='100%' height='auto'                                         style='padding: 26px 0 10px 0' alt='alt_text'></td>                                 <td>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='260' style='border-top: 2px solid #325396'>&nbsp;</td>                                 <td style='border-top: 2px solid #8FBFFE'>&nbsp;</td>                                 <td width='40'>&nbsp;</td>                             </tr>                         </table>                         <!-- Email Header : END -->                          <!-- Email Body : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px;'>                              <!-- 1 Column Text : BEGIN -->                             <tr>                                 <td>                                     <table cellspacing='0' cellpadding='0' border='0' width='100%'>                                         <tr>                                             <td                                                 style='padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;'>                                                 <p>Estimados buenos días</p>                                                 <p>Se notifica a todos del Cierre de los Trabajos descritos a continuación: </p>                                                  <br>                                                  <p>No. Orden de trabajo: GLOBAL[numero_de_orden]</p>                                                     <br>   													                                                     <p>Matrícula: GLOBAL[matricula]</p>                                                       <br>                                                       <p>No. de serie: GLOBAL[numero_de_serie]</p>                                                      <br>  																							                                                     <p>Atentamente: GLOBAL[nombre_usuario]</p>                                                  <p>Saludos,</p>                                             </td>                                         </tr>                                     </table>                                 </td>                             </tr>                             <!-- 1 Column Text : BEGIN -->                           </table>                         <!-- Email Body : END -->                          <!-- Email Footer : BEGIN -->                         <table cellspacing='0' cellpadding='0' border='0' align='center' width='100%' bgcolor='#FFFFFF'                             style='max-width: 680px;'>                             <tr>                                 <td width='40'>&nbsp;</td>                                 <td width='40' valign='middle' style='text-align: right;'>                                     <img style='width: 40px; height: 40px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/>                                 </td>                                 <td width='5'>&nbsp;</td>                                 <td>                                     <p                                         style='font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;'>                                         GLOBAL[nombre_usuario]</p>                                     <p                                         style='font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;'>                                         Mantenimiento.</p>                                 </td>                                 <td width='40'>&nbsp;</td>                             </tr>                             <tr>                                 <td>&nbsp;</td>                                 <td width='40' valign='middle' style='text-align: right;'>                                     <img style='width: 24px; height: 24px;' src='http://108.60.201.12/vicsdemoventas3/images/mail-plane.png'/>                                 </td>                                 <td width='5'>&nbsp;</td>                                 <td>                                     <p                                         style='font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;'>                                         Aerovics, S.A. de C.V.</p>                                 </td>                                 <td width='40'>&nbsp;</td>                             </tr>                          </table>                          <table cellspacing='0' cellpadding='0' border='0' align='center' bgcolor='#ffffff' width='100%'                             style='max-width: 600px;'>                             <tr>                                 <td style='padding-top: 40px;'></td>                             </tr>                             <tr>                                 <td                                     style='border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px'>                                     &nbsp;</td>                             </tr>                         </table>                         <!-- Email Footer : END -->                          <!--[if (gte mso 9)|(IE)]>             </td>             </tr>             </table>             <![endif]-->                     </div>                 </center>             </td>         </tr>     </table> </body>  </html>"); } else { }
    }
    //TERMINA - BRID:4143


    //INICIA - BRID:4192 - Envio de correo al cierre de una OT - Autor: Aaron - Actualización: 7/21/2021 9:44:46 AM
    if (this.operation == 'Update') {
      //if( this.brf.GetValueByControlType(this.Orden_de_TrabajoForm, 'Estatus')==this.brf.TryParseInt('1', '1') ) { this.brf.SendEmailQuery("Aviso de Cierre de Orden de Trabajo ", this.brf.EvaluaQuery("select STUFF((select ';' + Email + '' from Spartan_User where Role in (1,19,43,17,42,22,26,22)	for XML PATH('')), 1, 1, '')", 1, "ABC123"), "<!doctype html> <html> <head> <meta charset="utf-8"> <meta name="viewport" content="width=device-width, initial-scale=1.0"> <meta http-equiv="X-UA-Compatible" content="IE=edge"> <title>EmailTemplate-Fluid</title> <style type="text/css"> html, body { margin: 20px 0 0 0 !important; padding: 0 !important; width: 100% i !important; background-color: #e0e0e0 !important; } * { -ms-text-size-adjust: 100%; -webkit-text-size-adjust: 100%; } .ExternalClass { width: 100%; } div[style*="margin: 16px 0"] { margin: 0 !important; } table, td { mso-table-lspace: 0pt !important; mso-table-rspace: 0pt !important; } table { border-spacing: 0 !important; border-collapse: collapse !important; table-layout: fixed !important; margin: 0 auto !important; } table table table { table-layout: auto; } img { -ms-interpolation-mode: bicubic; } .yshortcuts a { border-bottom: none !important; } a[x-apple-data-detectors] { color: inherit !important; } /* Estilos Hover para botones */ .button-td, .button-a { transition: all 100ms ease-in; } .button-td:hover, .button-a:hover { color: #000; } </style> </head> <body width="100%" style="margin: 20px 0 0 0; background-color: e0e0e0;" yahoo="yahoo"> <table cellpadding="0" cellspacing="0" border="0" height="100%" width="100%" bgcolor="#e0e0e0" style="border-collapse:collapse;"> <tr> <td> <center style="width: 100%;"> <!-- Visually Hidden Preheader Text : BEGIN --> <div style="display:none;font-size:1px;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;font-family: sans-serif;"> Aerovics </div> <!-- Visually Hidden Preheader Text : END --> <div style="max-width: 600px;"> <!--[if (gte mso 9)|(IE)]> <table cellspacing="0" cellpadding="0" border="0" width="600" align="center"> <tr> <td> <![endif]--> <!-- Email Header : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px; border-top: 5px solid #1F1F1F"> <tr> <td width="40">&nbsp;</td> <td width="260"> <img src="logo-aerovics.png" width="100%" height="auto" style="padding: 26px 0 10px 0" alt="alt_text"> </td> <td>&nbsp;</td> <td width="40">&nbsp;</td> </tr> <tr> <td width="40">&nbsp;</td> <td width="260" style="border-top: 2px solid #325396">&nbsp;</td> <td style="border-top: 2px solid #8FBFFE">&nbsp;</td> <td width="40">&nbsp;</td> </tr> </table> <!-- Email Header : END --> <!-- Email Body : BEGIN --> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;">  <!-- 1 Column Text : BEGIN --> <tr> <td> <table cellspacing="0" cellpadding="0" border="0" width="100%"> <tr>  <td style="padding: 10px 40px 40px 40px; font-family: sans-serif; font-size: 15px; mso-height-rule: exactly; line-height: 20px; color: #555555;">  <p>Estimados buenos días</p> <p>Se notifica a todos del Cierre de los Trabajos descritos a continuación:  </p> <br> <p>No.De OT: GLOBAL[numero_de_orden]</p> <br> <p>Matrícula: GLOBAL[matricula]</p> <br> <p>No. de serie: GLOBAL[numero_de_serie]</p> <br> <p>Atentamente: GLOBAL[nombre_usuario]</p> <p>Favor de enviar acuse de recibido.</p>  <p>Saludos,</p> </td> </tr> </table> </td> </tr> <!-- 1 Column Text : BEGIN -->  </table> <!-- Email Body : END --> <!-- Email Footer : BEGIN -->  <table cellspacing="0" cellpadding="0" border="0" align="center" width="100%" bgcolor="#FFFFFF" style="max-width: 680px;">  <tr> <td width="40">&nbsp;</td> <td width="40" valign="middle" style="text-align: right;">  <img style="width: 40px; height: 40px;" src="mail-user.png"/> </td>  <td width="5">&nbsp;</td> <td> <p style="font-size: 15px; font-family: sans-serif; color: #325396; margin: 0; font-weight: bold;">GLOBAL[nombre_usuario]</p> <p style="font-size: 12px; font-family: sans-serif; color: #555555; margin-top: 5px;"> Mantenimiento.</p> </td> <td width="40">&nbsp;</td> </tr> <tr> <td>&nbsp;</td> <td width="40" valign="middle" style="text-align: right;"> <img style="width: 24px; height: 24px;" src="http://108.60.201.12/vicsdemoventas3/images/mail-plane.png"/> </td> <td width="5">&nbsp;</td> <td> <p style="font-size: 12px; font-family: sans-serif; color: #325396; margin-top: 5px;"> Aerovics, S.A. de C.V.</p> </td> <td width="40">&nbsp;</td> </tr> </table> <table cellspacing="0" cellpadding="0" border="0" align="center" bgcolor="#ffffff" width="100%" style="max-width: 600px;"> <tr> <td style="padding-top: 40px;"></td> </tr> <tr> <td style="border-top: 4px solid #325396; border-bottom: 10px solid #1F1F1F; font-size: 3px">  &nbsp;</td> </tr> </table> <!-- Email Footer : END --> <!--[if (gte mso 9)|(IE)]> </td>  </tr> </table> <![endif]--> </div> </center> </td> </tr> </table> </body> </html>");} else {}
    }
    //TERMINA - BRID:4192


    //INICIA - BRID:4319 - Ejecutar SP para actualizar Reportes Asignados a Tecnico e insertar reportes preestablecidos - Autor: Aaron - Actualización: 9/24/2021 12:55:26 PM
    if (this.operation == 'New') {
      //this.brf.EvaluaQuery("EXEC Update_Reporte_Asignado_OT_Prestablecidos GLOBAL[KeyValueInserted]", 1, "ABC123"); 
      //this.brf.EvaluaQuery(" EXEC Update_Reporte_Asignado_OT_Tecnico GLOBAL[KeyValueInserted]	", 1, "ABC123");

      await this.brf.EvaluaQueryAsync(` EXEC Update_Reporte_Asignado_OT_Prestablecidos ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)} `, 1, "ABC123"); 
      await this.brf.EvaluaQueryAsync(` EXEC Update_Reporte_Asignado_OT_Tecnico ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}	`, 1, "ABC123");
    }
    //TERMINA - BRID:4319


    //INICIA - BRID:4684 - Ejecutar SP para actualizar reportes asignados - Autor: Aaron - Actualización: 9/24/2021 12:55:25 PM
    if (this.operation == 'Update') {
      //this.brf.EvaluaQuery("EXEC Update_Reporte_Asignado_OT_Prestablecidos 'FLDD[lblFolio]'", 1, "ABC123");
      //this.brf.EvaluaQuery("EXEC Update_Reporte_Asignado_OT_Tecnico 'FLDD[lblFolio]'	", 1, "ABC123");

      await this.brf.EvaluaQueryAsync(` EXEC Update_Reporte_Asignado_OT_Prestablecidos '${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}' `, 1, "ABC123");
      await this.brf.EvaluaQueryAsync(` EXEC Update_Reporte_Asignado_OT_Tecnico '${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)}'	`, 1, "ABC123");
    }
    //TERMINA - BRID:4684


    //INICIA - BRID:5840 - Crear una OS a partir de una OT después de guardar Orden_de_Trabajo - Autor: Agustín Administrador - Actualización: 9/6/2021 10:58:17 AM
    if (this.operation == 'New') {
      //this.brf.EvaluaQuery("EXEC Insert_Crear_Nueva_OS GLOBAL[keyvalueinserted]", 1, "ABC123");
      await this.brf.EvaluaQueryAsync(`EXEC Insert_Crear_Nueva_OS ${this.localStorageHelper.getItemFromLocalStorage(StorageKeys.KeyValueInserted)} `, 1, "ABC123");
    }
    //TERMINA - BRID:5840


    //INICIA - BRID:7158 - Enviar notificacion push a Inspector cuando se crea una nueva OT - Autor: Aaron - Actualización: 10/19/2021 3:17:26 PM
    if (this.operation == 'New') {
      //this.brf.SendNotificationPush(this.brf.EvaluaQuery("Select 'Se ha creado una nueva Orden de Trabajo'", ""ABC123""), this.brf.EvaluaQuery(" select STUFF((select ',' + CAST(Id_User as VARCHAR(9)) + '' FROM Spartan_User  where Role in (17) for XML PATH('')), 1, 1, '')", 1, "ABC123") ,this.brf.EvaluaQuery("select '{\"id\":\"GLOBAL[KeyValueInserted]\"}'", 1, "ABC123"), this.brf.EvaluaQuery("SELECT 'Se ha creado una nueva Orden de Trabajo'", 1, "ABC123")," 8");
    }
    //TERMINA - BRID:7158

    //rulesAfterSave_ExecuteBusinessRulesEnd

  }

  rulesBeforeSave(): boolean {
    let result = true;
    //rulesBeforeSave_ExecuteBusinessRulesInit

    //INICIA - BRID:4187 - Variable de sesión para Causa de cancelación - Autor: Aaron - Actualización: 7/21/2021 11:34:23 AM
    if (this.operation == 'Update') {
      this.brf.CreateSessionVar("causa_de_cancelacion", this.brf.EvaluaQuery(" Select 'FLD[Causa_de_Cancelacion]'", 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:4187


    //INICIA - BRID:4367 - Variables de Sesión - Autor: Aaron - Actualización: 7/26/2021 11:42:55 AM
    if (this.operation == 'New' || this.operation == 'Update') {
      this.brf.CreateSessionVar("matricula", this.brf.EvaluaQuery(" select '" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123"), 1, "ABC123"); this.brf.CreateSessionVar("numero_de_serie", this.brf.EvaluaQuery(" select Numero_de_serie from aeronave where Matricula ='" + this.Orden_de_TrabajoForm.get('Matricula').value + "'", 1, "ABC123"), 1, "ABC123"); this.brf.CreateSessionVar("nombre_usuario", this.brf.EvaluaQuery(" select name from spartan_user where id_user=" + this.localStorageHelper.getLoggedUserInfo().UserId, 1, "ABC123"), 1, "ABC123");
    }
    //TERMINA - BRID:4367


    //INICIA - BRID:5815 - Validar que no existan OT Relacionadas - Autor: Aaron - Actualización: 9/6/2021 11:41:27 AM
    if (this.operation == 'Update') {
      if (this.brf.EvaluaQuery("EXEC Valida_OS_Relacionada 'FLDD[lblFolio]'", 1, 'ABC123') == this.brf.TryParseInt('1', '1') && this.brf.GetValueByControlType(this.Orden_de_TrabajoForm, 'Estatus') == this.brf.TryParseInt('1', '1')) {
        this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery(" Select 'Existe una OS relacionada a esta OT, es necesario cerrarla antes de poder cerrar la OT.'", 1, "ABC123"), 1, "ABC123");

        result = false;
      } else { }
    }
    //TERMINA - BRID:5815


    //INICIA - BRID:5882 - Cancelar Guardado si tiene OT Primaria Abierta - Autor: Aaron - Actualización: 9/7/2021 3:29:05 PM
    if (this.operation == 'New') {
      if (this.brf.EvaluaQuery("Select Count(*) FROM Orden_de_trabajo WHERE Tipo_de_orden = FLD[Tipo_de_orden] AND Matricula = '" + this.Orden_de_TrabajoForm.get('Matricula').value + "' AND Estatus = 2", 1, 'ABC123') > this.brf.TryParseInt('0', '0') && this.brf.GetValueByControlType(this.Orden_de_TrabajoForm, 'Tipo_de_orden') == this.brf.TryParseInt('1', '1')) {
        this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery("Select 'Ya existe una OT Primaria Abierta para esta OT. No es posible crear una nueva.'", 1, "ABC123"), 1, "ABC123");

        result = false;
      } else { }
    }
    //TERMINA - BRID:5882


    //INICIA - BRID:5883 - Cancelar guardado si existe una OT secundaria Abierta - Autor: Aaron - Actualización: 9/7/2021 3:32:52 PM
    if (this.operation == 'New') {
      if (this.brf.EvaluaQuery("Select Count(*) FROM Orden_de_trabajo WHERE Tipo_de_orden = FLD[Tipo_de_orden] AND Matricula = '" + this.Orden_de_TrabajoForm.get('Matricula').value + "' AND Estatus = 2", 1, 'ABC123') > this.brf.TryParseInt('0', '0') && this.brf.GetValueByControlType(this.Orden_de_TrabajoForm, 'Tipo_de_orden') == this.brf.TryParseInt('2', '2')) {
        this.brf.ShowMessageFromQuery(this.brf.EvaluaQuery("  Select 'Ya existe una OT Secundaria Abierta para esta OT. No es posible crear una nueva.'", 1, "ABC123"), 1, "ABC123");

        result = false;
      } else { }
    }
    //TERMINA - BRID:5883

    //rulesBeforeSave_ExecuteBusinessRulesEnd





    return result;
  }

  //Fin de reglas

}
