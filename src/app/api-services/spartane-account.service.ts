import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpRequest } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Token } from './../views/Calendario/models/modelToken';
import { parameter } from './../views/Calendario/models/modelparameter';
import { event } from './../views/Calendario/models/modelevento';


@Injectable({
  providedIn: 'root'
})
export class SpartaneAccountService {

  private urlBaseApi: string = environment.endpoints["WebApi"];
  private urlBaseMVC: string = environment.endpoints["WebApi"];

  events: event[] = [];
  event: event = new event;

  constructor(private http: HttpClient) { }

  getToken() {
    const requestPayload = "userName=" + encodeURIComponent('admin') + "&password=" + encodeURIComponent('admin') + "&grant_type=password";
    let getHeaders = new HttpHeaders();
    getHeaders = getHeaders.set('content-Type', 'application/x-www-form-urlencoded');
    return this.http.post<Token>(this.urlBaseApi + '/oauth/token', requestPayload, { headers: getHeaders });
  }

  getEvents(_params: parameter, token: Token) {
    const headers = { 'Authorization': 'bearer ' + token.access_token, 'Content-Type': 'application/json' };
    const parameters = { 'startRowIndex': _params.startRowIndex.toString(), 'maximumRows': _params.maximumRows.toString(), 'where': _params.where, 'order': _params.order };
    return this.http.get(this.urlBaseApi + '/api/' + 'Solicitud_de_Vuelo/ListaSelAll', { headers, params: parameters });
  }

  goUrl(url: string) {
    location.href = this.urlBaseMVC + '/' + url;
  }

  getCaledarioConfiguracion(folio: string, token: Token) {
    const headers = { 'Authorization': 'bearer ' + token.access_token, 'Content-Type': 'application/json' };
    const parameters = { 'startRowIndex': '1', 'maximumRows': '2147483647', 'RelationId=': folio };
    return this.http.get(this.urlBaseApi + '/api/' + 'Calendario_Configuracion/ListaSelAll', { headers, params: parameters });
  }

  getSolicitud_de_Vuelo(rol: string, token: Token) {
    const headers = { 'Authorization': 'bearer ' + token.access_token, 'Content-Type': 'application/json' };
    const parameters = { 'rol': rol };
    return this.http.get<any[]>(this.urlBaseApi + '/api/' + 'Calendario/usp_ListSelAll_Solicitud_de_Vuelo', { headers, params: parameters });

  }

  //FGonzalez
  getRegistro_de_Vuelo(rol: string, token: Token) {
    const headers = { 'Authorization': 'bearer ' + token.access_token, 'Content-Type': 'application/json' };
    const parameters = { 'rol': rol };
    return this.http.get<any[]>(this.urlBaseApi + '/api/' + 'Calendario/usp_ListSelAll_Registro_de_vuelo', { headers, params: parameters });

  }

  getVuelos(rol: string, datestart: string, dateend: string) {

    const headers = new HttpHeaders()
      .set('content-type', 'application/json');

    const parameters = { 'rol': rol, 'start': datestart, 'end': dateend };
    return this.http.get<any[]>(this.urlBaseApi + '/api/' + 'Calendario/getVuelos', { 'headers': headers, params: parameters });

  }

  getRegistros(rol: string, datestart: string, dateend: string) {

    const headers = new HttpHeaders()
      .set('content-type', 'application/json');

    const parameters = { 'rol': rol, 'start': `${datestart}`, 'end': `${dateend}` };
    return this.http.get<any[]>(this.urlBaseApi + '/api/' + 'Calendario/getRegistros', { 'headers': headers, params: parameters });

  }


}


