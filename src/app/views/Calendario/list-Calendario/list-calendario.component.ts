import { OnInit, ElementRef, Component, Inject, Input, TemplateRef, ViewChild, AfterViewInit } from '@angular/core';
//import { BsModalService, BsModalRef, ModalDirective } from 'ngx-bootstrap/modal';
import { ActivatedRoute, Router } from '@angular/router';
import { CalendarOptions, constrainPoint, FullCalendarComponent, setRef } from '@fullcalendar/angular';

import { SpartaneAccountService } from "src/app/api-services/spartane-account.service";
import { event } from './../models/modelevento';
import esLocale from '@fullcalendar/core/locales/es';
import { environment } from 'src/environments/environment';
import { Query } from '../models/modelQueryParameter';
import { Role } from '../models/modelRoleParameter';
import { settingRole } from '../models/modelSetting_Role';
import { MatDialog } from '@angular/material/dialog';
import { DetalleEvento } from '../models/detalle-evento.mode';
import { ParamCalendarModel } from '../models/param-calendario.model';
import { registroVuelo } from '../models/registroVuelo';
import { LocalStorageHelper } from 'src/app/helpers/local-storage-helper';
import * as momentJS from 'moment';
import { NgxSpinnerService } from 'ngx-spinner';
import { filter } from 'rxjs/operators';



@Component({
  selector: 'app-list-calendario',
  templateUrl: './list-calendario.component.html',
  styleUrls: ['./list-calendario.component.css']
})
export class ListCalendarioComponent implements OnInit, AfterViewInit {

  RoleId: any
  events: event[] = [];
  sHtmlToolTips: string = "";
  settingRole: settingRole[] = [];
  RoleParameter: Role = new Role;
  queryParamete: Query = new Query;
  detalleEvento: DetalleEvento = new DetalleEvento();
  urlBaseVics: any
  showBtnNuevaSolicitud: boolean = false;
  today = new Date()
  //modalRef?: BsModalRef;
  com: string;
  private queryBody: string = "SELECT Calendario_Configuracion_Rol.Folio FROM  Calendario_Configuracion_Rol INNER JOIN Cargos ON Calendario_Configuracion_Rol.User_Role_Id = Cargos.Clave WHERE Cargos.Role_ID = ";

  calendarOptions: CalendarOptions = {
    initialView: 'dayGridWeek',
    headerToolbar: ({
      left: 'prev,next,today',
      center: 'title',
      right: 'dayGridMonth,dayGridWeek,dayGridDay'
    }),
    dayMaxEventRows: 4,
    eventContent: this.toHtml2,
    eventClick: this.UrlAction,
    locale: esLocale,
    dayMaxEvents: 30,
    eventSources: [(info) => {
      this.parametrosUrl.fecha_inicio = JSON.stringify(info.start).substring(1, 11);
      this.parametrosUrl.fecha_fin = JSON.stringify(info.end).substring(1, 11);
      this.events = []
      return this.getEventsNew2(this.parametrosUrl.rolId, this.parametrosUrl.fecha_inicio, this.parametrosUrl.fecha_fin, this);
    }],

  };


  //nro_tramos:number=3;
  parametrosUrl: ParamCalendarModel = new ParamCalendarModel();
  @ViewChild('calendar') calendarComponent: FullCalendarComponent;

  constructor(
    protected localStorageHelper: LocalStorageHelper,
    private route: ActivatedRoute,
    private spartaneAccountService: SpartaneAccountService,
    private elRef: ElementRef
    , public dialog: MatDialog
    //, private modalService: BsModalService
    , private router: Router,
    private spinner: NgxSpinnerService,

  ) {
    //Window["AppComponent"] = this;

    this.urlBaseVics = this.router.serializeUrl(this.router.createUrlTree([`#/`]));
    this.RoleId = this.localStorageHelper.getItemFromLocalStorage('USERROLEID')
    this.parametrosUrl.rolId = this.RoleId;

    this.route.params.subscribe((params: any) => {
      //this.parametrosUrl.rolId = params.rol;

      //this.parametrosUrl.fecha_inicio = params.fecha_inicio;
      //this.parametrosUrl.fecha_fin = params.fecha_fin;
    });

  }



  ngOnInit(): void {

    this.ShowButtonForRol();

  }

  ngAfterViewInit() {
    //this.getSolicitudes(this.parametrosUrl.rolId, this.parametrosUrl.fecha_inicio, this.parametrosUrl.fecha_fin);
  }

  async getSolicitudes(rolId, datestart, dateend) {
    let csolicitudes;

    await this.spartaneAccountService.getVuelos(rolId, datestart, dateend).subscribe({
      next: data => {
        csolicitudes = data;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.getRegistros(rolId, datestart, dateend, csolicitudes)
      }
    });
    return this.events

  }

  async getRegistros(rolId, datestart, dateend, csolicitudes) {
    let cregistrosV;

    await this.spartaneAccountService.getRegistros(rolId, datestart, dateend).subscribe({
      next: data => {
        cregistrosV = data;
      },
      error: err => {
        console.error(err);
      },
      complete: () => {
        this.getEvents2(rolId, csolicitudes, cregistrosV)
      }
    });
  }

  async getEvents2(rolId, csolicitudes, cregistrosV) {
    this.events = [];
    csolicitudes.forEach(sol => {

      var regSol = true;

      if (cregistrosV != undefined) {
        var registrosFilter = cregistrosV.filter(x => x.No_Vuelo == sol.Folio && x.Fecha_de_salida == sol.Fecha_de_Salida);
        //Ordenar
        var registrosFilterDif = cregistrosV.filter(x => x.No_Vuelo == sol.Folio && x.Fecha_de_salida != sol.Fecha_de_Salida);

      }

      // 
      if (registrosFilter.length == 0 && registrosFilterDif.length == 0) {

      }

      //El mismo día
      if (registrosFilter.length > 0) {
        this.events.push(this.setEvent(sol, registrosFilter, rolId));
        regSol = false;
      }

      //Diferentes días
      var fechActual = '';
      var fechaCambiante = '';
      registrosFilterDif.forEach(x => {

        fechActual = x.Fecha_de_salida;
        if (fechActual != fechaCambiante) {
          var registrosFilterDif2 = registrosFilterDif.filter(y => y.Fecha_de_salida == fechActual);
          fechaCambiante = fechActual;

          this.events.push(this.setEvent(sol, registrosFilterDif2, rolId));
          regSol = false;
        }
        else {
          fechaCambiante = x.Fecha_de_salida;
        }
      });

      regSol ? this.events.push(this.setEvent(sol, null, rolId)) : '';
    });

    this.calendarOptions = {
      events: this.events,
    };

  }


  async getEventsNew(rolId, datestart, dateend, cal) {
    this.spinner.show('loading');
    console.time('Execution Time');

    let csolicitudes;
    await this.spartaneAccountService.getVuelos(rolId, datestart, dateend).subscribe(solicitudes => {
      csolicitudes = solicitudes;
    });
    await this.delay(3000);
    let cregistrosV;
    await this.spartaneAccountService.getRegistros(rolId, datestart, dateend).subscribe(registrosV => {
      cregistrosV = registrosV;
    });
    await this.delay(3000);
    //--------------
    this.events = [];
    csolicitudes.forEach(sol => {

      var regSol = true;

      if (cregistrosV != undefined) {
        var registrosFilter = cregistrosV.filter(x => x.No_Vuelo == sol.Folio && x.Fecha_de_salida == sol.Fecha_de_Salida);
        //Ordenar
        var registrosFilterDif = cregistrosV.filter(x => x.No_Vuelo == sol.Folio && x.Fecha_de_salida != sol.Fecha_de_Salida);

      }

      //El mismo día
      if (registrosFilter.length > 0) {
        this.events.push(this.setEvent(sol, registrosFilter, rolId));
        regSol = false;
      }

      //Diferentes días
      var fechActual = '';
      var fechaCambiante = '';
      registrosFilterDif.forEach(x => {

        fechActual = x.Fecha_de_salida;
        if (fechActual != fechaCambiante) {
          var registrosFilterDif2 = registrosFilterDif.filter(y => y.Fecha_de_salida == fechActual);
          fechaCambiante = fechActual;

          this.events.push(this.setEvent(sol, registrosFilterDif2, rolId));
          regSol = false;
        }
        else {
          fechaCambiante = x.Fecha_de_salida;
        }
      });

      regSol ? this.events.push(this.setEvent(sol, null, rolId)) : '';
    });
    this.spinner.hide('loading');

    console.timeEnd('Execution Time');

    return this.events;

  }

  async getEventsNew2(rolId, datestart, dateend, cal) {
    //this.spinner.show('loading');

    let csolicitudes = await this.spartaneAccountService.getVuelos(rolId, datestart, dateend).toPromise();
    let cregistrosV = await this.spartaneAccountService.getRegistros(rolId, datestart, dateend).toPromise();

    //--------------
    this.events = [];
    csolicitudes.forEach(sol => {

      var regSol = true;

      if (cregistrosV != undefined) {
        var registrosFilter = cregistrosV.filter(x => x.No_Vuelo == sol.Folio && x.Fecha_de_salida == sol.Fecha_de_Salida);
        //Ordenar
        var registrosFilterDif = cregistrosV.filter(x => x.No_Vuelo == sol.Folio && x.Fecha_de_salida != sol.Fecha_de_Salida);

      }

      //El mismo día
      if (registrosFilter.length > 0) {
        this.events.push(this.setEvent(sol, registrosFilter, rolId));
        regSol = false;
      }

      //Diferentes días
      var fechActual = '';
      var fechaCambiante = '';
      registrosFilterDif.forEach(x => {

        fechActual = x.Fecha_de_salida;
        if (fechActual != fechaCambiante) {
          var registrosFilterDif2 = registrosFilterDif.filter(y => y.Fecha_de_salida == fechActual);
          fechaCambiante = fechActual;

          this.events.push(this.setEvent(sol, registrosFilterDif2, rolId));
          regSol = false;
        }
        else {
          fechaCambiante = x.Fecha_de_salida;
        }
      });

      regSol ? this.events.push(this.setEvent(sol, null, rolId)) : '';
    });
    //this.spinner.hide('loading');

    return this.events;

  }


  NewFligth() {
    this.localStorageHelper.setItemToLocalStorage("FromCalendar", "Si");
    this.router.navigate([`/Solicitud_de_Vuelo/add`]);
  }


  async delay(ms: number) {
    await new Promise<void>(resolve => setTimeout(() => resolve(), ms)).then(() => console.log(""));
  }

  setEvent(element, registrosVue: registroVuelo[], rol: String): event {
    let _event: event = new event;

    _event.rol = rol;
    _event.title = '';
    if (element.Empresa_Solicitante_Cliente.Razon_Social != null) {
      _event.title = element.Empresa_Solicitante_Cliente.Razon_Social;
    }

    _event.matricula = '';
    if (element.Matricula != null) {
      _event.matricula = element.Matricula;
    }

    _event.estatus = '';
    if (element.Estatus_Estatus_de_Solicitud_de_Vuelo.Descripcion != null) {
      _event.estatus = element.Estatus_Estatus_de_Solicitud_de_Vuelo.Descripcion;
    }


    // Filtra Tramos y Hora de Salida por Solicitud y día.
    _event.tramos = '';
    _event.tramosHorarios = '';
    if (registrosVue != null) {

      registrosVue.forEach(x => {
        _event.tramos = _event.tramos + x.Tramos;
        _event.tramosHorarios = _event.tramosHorarios + x.Hora_de_salida + '/';
      });

      //Agrega el tramo Final
      _event.tramos = _event.tramos + registrosVue[0].TramoFinal;
    }

    //Quita el último diagonal de horas.
    if (_event.tramosHorarios.indexOf('/') > 0) {
      _event.tramosHorarios = _event.tramosHorarios.substring(0, _event.tramosHorarios.length - 1)
    }


    _event.numero_de_solicitud = element.Folio;

    _event.numero_de_vuelo = '';
    if (element.Numero_de_Vuelo != null) {
      if (element.Numero_de_Vuelo.length > 0 && element.Numero_de_Vuelo != '0') {
        _event.numero_de_vuelo = element.Numero_de_Vuelo;
      }
    }

    //El calendario debe redireccionar a Gestion de Vuelos

    //_event._url = this.urlBaseVics + 'DynamicSearch?id=2&Cal=' + element.Folio;
    //console.log("Elemento: ", element);
    if(element.Estatus == 9){ //cerrado
      _event._url = '/#/DynamicSearch/DynamicSearch/2/3/10/' + element.Folio;
    }
    else if (element.Estatus == 13){ //cancelado
      _event._url = '/#/DynamicSearch/DynamicSearch/2/3/13/' + element.Folio;
    }
    else{
      _event._url = '/#/DynamicSearch/DynamicSearch/2/3/9/' + element.Folio;
    }
    this.localStorageHelper.setItemToLocalStorage("FromCalendar", "Si");

    if (element.EventoClick != true) {
      _event._url = "";
    }

    //el rol Presidencia o DG pueden entrar a la solicitud de vuelo en estatus Por Autorizar Direccion General o Por Autorizar Presidencia
    if (rol == "10" || rol == '30') {
      if (element.Estatus == '2' || element.Estatus == '3') {

        _event._url = '/#/Solicitud_de_Vuelo/edit/' + element.Folio;
        this.localStorageHelper.setItemToLocalStorage("FromCalendar", "Si");
      } else {
        _event._url = "";
      }
    }

    //Dirección General no puede entrar a solicitudes con estatus Por Autorizar Presidencia
    if (rol == "10") {
      if (element.Estatus == '3') {
        _event._url = "";
      }
    }

    //Presidencia no puede entrar a solicitudes con estatus Por Autorizar Direccion General
    if (rol == "30") {
      if (element.Estatus == '2') {
        _event._url = "";
      }
    }

    //Dirección General puede entrar a Gestión de Vuelo cuando el vuelo esta en estatus Autorizado
    //2021-08-31.- Se cancela esta regla 
    // if (rol == "10") {
    //   if (element.Estatus == '6') {
    //     _event._url = environment.ulrBaseVics + 'Frontal/DynamicSearch?id=2&Cal=' + element.Folio;
    //   }
    // }

    //Rol Solicitante de vuelo no debe ver las notas y comisariatos y al dar click en el calendario no debe hacer nada.
    if (rol == "15") {
      _event._url = "";
    }

    //FGonzalez
    if (registrosVue != null) {

      if (registrosVue[0].Fecha_de_salida != null && registrosVue[0].Hora_de_salida != null) {
        _event.start = new Date(registrosVue[0].Fecha_de_salida.substring(0, 11) + registrosVue[0].Hora_de_salida + ':00');
        _event.end = new Date(registrosVue[0].Fecha_de_salida.substring(0, 11) + registrosVue[0].Hora_de_salida + ':00');


        if (registrosVue[0].Notas_de_vuelo == null) { registrosVue[0].Notas_de_vuelo = ''; }
        if (registrosVue[0].Comisariato == null) { registrosVue[0].Comisariato = ''; }

        _event.notas_vuelo = registrosVue[0].Notas_de_vuelo;
        _event.comisariato = registrosVue[0].Comisariato;

        registrosVue = registrosVue.filter(p => p.Fecha_de_salida = registrosVue[0].Fecha_de_salida);
        _event.registros_vuelo = registrosVue;
        _event.horariosLLegada = '';
        _event.horariosSalida = '';
      }

    }
    else {
      _event.horariosLLegada = this.getFechaString(new Date(element.Fecha_de_Regreso), 'dd/MM/yyyy') + ' (' + element.Hora_de_Regreso + ')';
      _event.horariosSalida = this.getFechaString(new Date(element.Fecha_de_Salida), 'dd/MM/yyyy') + ' (' + element.Hora_de_Salida + ')';
      _event.registros_vuelo = [];
      _event.start = new Date(element.Fecha_de_Salida.substring(0, 11) + element.Hora_de_Salida + ':00');
      _event.end = new Date(element.Fecha_de_Salida.substring(0, 11) + element.Hora_de_Salida + ':00');
      _event.notas_vuelo = "";
      _event.comisariato = "";
    }

    _event.allDay = true;
    _event.color = element.Color; // Personaliza el color de los eventos....
    _event.imagen = element.imagen;

    if (element.facturado) {
      _event.imagen = 'cal-icon-facturado.png';
      element.Estatus_Estatus_de_Solicitud_de_Vuelo.Descripcion = 'Facturado';
      element.Estatus_Estatus_de_Solicitud_de_Vuelo.Clave = 14;
    }

    _event.mantenimiento = element.mantenimiento;

    return _event;
  }

  AgregarEventos(eventos, calendar) {
    calendar.dayMaxEventRows = 4;
    calendar.eventContent = this.toHtml2;
    calendar.events = eventos;
    calendar.eventClick = this.UrlAction;
  }

  UrlAction(info) {
    //Si tiene Comisariato entonces muestra el modal    numero_de_vuelo
    if ((info.event._def.extendedProps.rol != "15") && (info.event._def.extendedProps.comisariato.length > 0 || info.event._def.extendedProps.notas_vuelo.length > 0)) {
      let data: any = { title: 'No. Vuelo: ' + info.event._def.extendedProps.numero_de_vuelo, comisariato: info.event._def.extendedProps.comisariato, notas_vuelo: info.event._def.extendedProps.notas_vuelo, url: info.event._def.extendedProps._url };
      localStorage.setItem('dataModal', JSON.stringify(data));
      document.getElementById("btn").click();
    } else {
      //Si no tiene Comisariato entonces redirección a la Url.
      //Valida si que tenga url configurada.
      if (info.event._def.extendedProps._url.length > 0) {
        window.parent.location.href = info.event._def.extendedProps._url;
      }
    }
  }

  toHtml2(eventInfo, createElement) {
    let limite: number = 30;
    let textoOrigen: string = '';
    let nfilas: number = textoOrigen.length / limite;
    let textoNuevo: string = '';
    let htmlCusttom: string;
    let title: string = '';
    let _event = eventInfo.event._def;
    let flag_hidden = '';
    let flag_hiddenmantenimiento = '';

    if ((_event.extendedProps.notas_vuelo.length == 0 && _event.extendedProps.comisariato.length == 0) || _event.extendedProps.rol == "15") {
      flag_hidden = 'd-none';
    }
    if (_event.extendedProps.mantenimiento == 0) {
      flag_hiddenmantenimiento = 'd-none';
    }
    /**TODO: Modificación de diseño: Franklin */
    let htmlTramos = "";
    let tramos = `${_event.extendedProps.tramos}`;
    let tramos_array = tramos.split("/");
    let title_array_length = _event.title.split(" ");
    let content_tramos = `<div class="row" style="font-size:0.8rem"> <div class="col-12">##valor##</div> </div>`;
    /**TODO: cantidad de tramos a mostrar por linea */
    let nro_tramos = 3;
    if (window.innerWidth < 1400) {
      nro_tramos = 2;

    }


    if (tramos_array.length < nro_tramos + 1) {
      htmlTramos = content_tramos.replace("##valor##", _event.extendedProps.tramos);
    }
    else {
      let count = 0;
      let new_content_tramos = "";
      tramos_array.forEach((x, i) => {
        new_content_tramos = `${new_content_tramos}${tramos_array[i]} / `;
        if (count == nro_tramos - 1) {
          htmlTramos = `${htmlTramos}${content_tramos.replace("##valor##", new_content_tramos)}`;
          new_content_tramos = "";
          count = 0;
        }
        else {
          if (i == tramos_array.length - 1) {
            htmlTramos = `${htmlTramos}${content_tramos.replace("##valor##", new_content_tramos)}`;
          }
          count++;
        }
      });
    }


    /**TODO: tramos horario / cantidad de tramos a mostrar por linea */
    let htmlTramosHorario = "";
    if (_event.extendedProps.tramosHorarios == null || _event.extendedProps.tramosHorarios == undefined) {
      _event.extendedProps.tramosHorarios = "";
    }
    let tramosHorario = `${_event.extendedProps.tramosHorarios}`;
    let tramos_horario_array = tramosHorario.split("/");
    /**TODO: cantidad de tramos a mostrar por linea */
    let content_tramos_horario = `<div class="row" style="font-size:0.8rem"> <div class="col-12">##valor##</div> </div>`;
    let nro_tramos_horario = 4;
    if (tramos_horario_array.length < nro_tramos_horario + 1) {
      htmlTramosHorario = content_tramos.replace("##valor##", _event.extendedProps.tramosHorarios);
    }
    else {
      let count_tramos = 0;
      let new_content_tramos_horario = "";
      tramos_horario_array.forEach((x, i) => {
        new_content_tramos_horario = `${new_content_tramos_horario}${tramos_horario_array[i]} / `;
        if (count_tramos == nro_tramos_horario - 1) {
          htmlTramosHorario = `${htmlTramosHorario}${content_tramos.replace("##valor##", new_content_tramos_horario)}`;
          new_content_tramos_horario = "";
          count_tramos = 0;
        }
        else {
          if (i == tramos_horario_array.length - 1) {
            htmlTramosHorario = `${htmlTramosHorario}${content_tramos_horario.replace("##valor##", new_content_tramos_horario)}`;
          }
          count_tramos++;
        }
      });
    }


    let horariosSalida = "";
    let horariosLlegada = "";
    if (
      !(_event.extendedProps.numero_de_vuelo != null
        && _event.extendedProps.numero_de_vuelo != undefined
        && _event.extendedProps.numero_de_vuelo != ""
        && _event.extendedProps.numero_de_vuelo != 0)) {
      horariosSalida = `Salida: ${_event.extendedProps.horariosSalida}`;
      horariosLlegada = `LLegada: ${_event.extendedProps.horariosLLegada}`;
    }
    else {
      horariosSalida = `${_event.extendedProps.horariosSalida}`;
      horariosLlegada = `${_event.extendedProps.horariosLLegada}`;
    }

    /**TODO: cantidad de tramos a mostrar por linea */
    // // // // _event.title = `${_event.title} ${_event.title} ${_event.title} ${_event.title} ${_event.title}`
    let content_title = `<div class="row" style="font-size:0.8rem"> <div class="col-12 text-center">##valor##</div> </div>`;
    let nro_espacio_title = 4;
    let title_array = _event.title.split(" ");
    let html_title = "";
    if (title_array.length < nro_espacio_title + 1) {
      html_title = content_title.replace("##valor##", `${_event.title}`);
    }
    else {
      let count_tramos = 0;
      let new_content_title = "";
      title_array.forEach((x, i) => {
        new_content_title = `${new_content_title}${title_array[i]} `;
        if (count_tramos == nro_espacio_title - 1) {
          html_title = `${html_title}${content_title.replace("##valor##", new_content_title)}`;
          new_content_title = "";
          count_tramos = 0;
        }
        else {
          if (i == title_array.length - 1) {
            html_title = `${html_title}${content_tramos_horario.replace("##valor##", new_content_title)}`;
          }
          count_tramos++;
        }
      });
    }

    htmlCusttom = `
      <div class="row" style="font-size:0.8rem">
          <div class="col-12" style="padding-left:0.2rem !important; padding-right:0.2rem !important">
              <table class="table table-bordered">
              <thead>
                  <tr class="text-white">
                      <th class="text-left" style="padding-left:0 !important; padding-right:0 !important">V-${_event.extendedProps.numero_de_vuelo}</th>
                      <th class="text-center" style="padding-left:0 !important; padding-right:0 !important">${_event.extendedProps.matricula}</th>
                      <th class="text-right " style="padding-left:0 !important; padding-right:0 !important">Sol-${_event.extendedProps.numero_de_solicitud}</th>
                  </tr>
              </thead>
              </table>
          </div>
      </div>
      ##title##
      <div class="row" style="font-size:0.8rem">
          <div class="col-12 text-center">${_event.extendedProps.estatus}</div>
      </div>
      ##content_tramos##
      <div class="row" style="font-size:0.8rem">
          <div class="col-12">${horariosSalida}</div>
      </div>
      <div class="row" style="font-size:0.8rem">
          <div class="col-12">${horariosLlegada}</div>
      </div>
      ##content_tramos_horario##
      <div class="row" style="font-size:0.8rem">
          <div class="col-12">
              <img
              style="width: 35px; float: right"
              src="assets/images/calendar-icon/${eventInfo.event._def.extendedProps.imagen}"
              />
              <img
              class="${flag_hidden}"
              id="icon_warning"
              style="width: 35px; float: right"
              src="assets/images/calendar-icon/cal-icon-warning.png"
              
              />
              <img
              class="${flag_hiddenmantenimiento}"
              id="icon_warning"
              style="width: 35px; float: right"
              src="assets/images/calendar-icon/cal-icon-mantenimiento.png"
              />
          </div>
      </div>
      `;
    htmlCusttom = htmlCusttom.replace("##content_tramos##", htmlTramos);
    htmlCusttom = htmlCusttom.replace("##content_tramos_horario##", htmlTramosHorario);

    htmlCusttom = htmlCusttom.replace("##title##", html_title);


    createElement = { html: htmlCusttom }
    return createElement;
  }

  toHtml(eventInfo, createElement) {
    let limite: number = 30;
    let textoOrigen: string = '';
    let nfilas: number = textoOrigen.length / limite;
    let textoNuevo: string = '';
    let htmlCusttom: string;
    let title: string = '';
    if (eventInfo.event.title.length != 0) {
      title = '<i>' + eventInfo.event.title + '</i>';
    }
    let matricula: string = '';
    if (eventInfo.event._def.extendedProps.matricula.length != 0) {
      matricula = '<i>' + eventInfo.event._def.extendedProps.matricula + '</i>';
    }
    let horariosSalida: string = '';
    if (eventInfo.event._def.extendedProps.horariosSalida != 0) {
      horariosSalida = 'Salida: <i>' + eventInfo.event._def.extendedProps.horariosSalida + '</i>';
    }
    let horariosLLegada: string = '';
    if (eventInfo.event._def.extendedProps.horariosSalida != 0) {
      horariosLLegada = 'LLegada: <i>' + eventInfo.event._def.extendedProps.horariosLLegada + '</i>';
    }

    let estatus: string = '';
    if (eventInfo.event._def.extendedProps.estatus.length != 0) {
      estatus = '<i>' + eventInfo.event._def.extendedProps.estatus + '</i>';
    }

    let numeroVuelo: string = '';
    if (eventInfo.event._def.extendedProps.numero_de_vuelo.length != 0) {
      numeroVuelo = '<i>' + eventInfo.event._def.extendedProps.numero_de_vuelo + '</i> ';
    }

    let tramos: string = '';
    if (eventInfo.event._def.extendedProps.tramos.length != 0) {
      textoOrigen = eventInfo.event._def.extendedProps.tramos + ''
      nfilas = textoOrigen.length / 28;
      textoNuevo = '';

      for (let i = 0; i < nfilas; i++) {
        textoNuevo = textoNuevo + textoOrigen.substring((i * 28), ((i + 1) * 28)) + '<br>';
      }

      tramos = '<br><i>' + textoNuevo + '</i> <br>';
    }


    let tramos_Horarios: string = '';
    if (eventInfo.event._def.extendedProps.tramosHorarios.length != 0) {
      textoOrigen = eventInfo.event._def.extendedProps.tramosHorarios + ''
      nfilas = textoOrigen.length / 28;
      textoNuevo = '';
      for (let i = 0; i < nfilas; i++) {
        textoNuevo = textoNuevo + textoOrigen.substring((i * 28), ((i + 1) * 28)) + '<br>';
      }
      tramos_Horarios = '<i>' + textoNuevo + '</i>';
    }
    let numeroSolicitud = 'Sol-<i>' + eventInfo.event._def.extendedProps.numero_de_solicitud + '</i> ';
    let flag_hidden = '';
    let flag_hiddenmantenimiento = '';
    if (eventInfo.event._def.extendedProps.notas_vuelo == null) { eventInfo.event._def.extendedProps.notas_vuelo = ''; }
    if (eventInfo.event._def.extendedProps.comisariato == null) { eventInfo.event._def.extendedProps.comisariato = ''; }


    if ((eventInfo.event._def.extendedProps.notas_vuelo.length == 0 && eventInfo.event._def.extendedProps.comisariato.length == 0) || eventInfo.event._def.extendedProps.rol == "15") {
      flag_hidden = 'd-none';
    }

    if (eventInfo.event._def.extendedProps.mantenimiento == 0) {
      flag_hiddenmantenimiento = 'd-none';
    }
    /**TODO: Modificación de diseño: Franklin */
    htmlCusttom = `
      <table class="table borderless text-white">
          <tbody>
              <tr>
                  <td class="text-center">V-${numeroVuelo}</td>
                  <td class="text-center">${matricula}</td>
                  <td class="text-center">${numeroSolicitud}</td>
              </tr>
              <tr>
                  <td colspan="3" class="text-center">${title}</td>
              </tr>
              <tr>
                  <td colspan="3" class="text-center">${estatus}</td>
              </tr>
              <tr>
                  <td colspan="3" class="">${horariosSalida}</td>
              </tr>
              <tr>
                  <td colspan="3" class="">${horariosLLegada}</td>
              </tr>
              <tr>
                  <td colspan="3" class="">${tramos}</td>
              </tr>
              <tr>
                  <td colspan="3" class="">${tramos_Horarios}</td>
              </tr>
              <tr>
                  <td colspan="3" >
                      <img style ="width:35px; float:right;" src="assets/images/calendar-icon/${eventInfo.event._def.extendedProps.imagen}" /> 
                      <img id="icon_warning" class="d-none" style ="width:35px; float:right;" src="assets/images/calendar-icon/cal-icon-warning.png" /> 
                      <img id="icon_warning" class="d-none" style ="width:35px; float:right;" src="assets/images/calendar-icon/cal-icon-mantenimiento.png" /> 
                  </td>
              </tr>
          </tbody>
      </table>
      `;
    createElement = { html: htmlCusttom }
    return createElement;
  }

  getFechaString(fecha: Date, format: string): String {

    let datestring: string;

    let day = fecha.getDate()
    let month = fecha.getMonth() + 1
    let year = fecha.getFullYear()

    if (month < 10) {

      if (format == 'dd/MM/yyyy') {
        datestring = `${day}/0${month}/${year}`;
      } else {
        datestring = `0${month}/${day}/${year}`;
      }

    } else {

      if (format == 'dd/MM/yyyy') {
        datestring = `${day}/${month}/${year}`;
      } else {
        datestring = `${month}/${day}/${year}`;
      }

    }

    return datestring
  }

  ngOpenModal(template: TemplateRef<any>) {
    //this.modalRef = this.modalService.show(template, Object.assign({}, { class: 'gray modal-lg' }));

    let dataModal: any = JSON.parse(localStorage.getItem('dataModal'));

    this.detalleEvento.title = dataModal.title;
    this.detalleEvento.comisiariato = dataModal.comisariato;
    this.detalleEvento.notas_vuelo = dataModal.notas_vuelo;
    this.detalleEvento.titlecomisiariato = "Comisiarato";
    this.detalleEvento.titlenotas_vuelo = "Notas de Vuelo";

    if (dataModal.url.length > 0) {
      document.getElementById("btnUrl").hidden = false;
    } else {
      document.getElementById("btnUrl").hidden = true;
    }
  }

  irUrl() {
    let dataModal: any = JSON.parse(localStorage.getItem('dataModal'));
    window.parent.location.href = dataModal.url;
    document.getElementById("closeModal").click();
  }

  salto_de_linea(campo: string, textoOriginal: string) {

    let limite: number = 31;
    let textoOrigen: string = campo + textoOriginal + ''
    let nfilas: number = textoOrigen.length / limite;
    let textoNuevo: string = '';

    for (let i = 0; i < nfilas; i++) {
      textoNuevo = textoNuevo + textoOrigen.substring((i * limite), ((i + 1) * limite)) + '<br>';
    }
    textoNuevo = textoNuevo.replace(campo, '');
    return textoNuevo;
  }

  ShowButtonForRol() {

    //Mostrar Boton solo a Roles : Administrador del sistema: 1 y 9, Operaciones: 12, Solicitante de vuelo: 15, Presidencia : 30, 
    if (this.RoleId == 1 || this.RoleId == 9 || this.RoleId == 12 || this.RoleId == 15 || this.RoleId == 30) {
      this.showBtnNuevaSolicitud = true;
    }
    else {
      this.showBtnNuevaSolicitud = false;
    }

  }

}
